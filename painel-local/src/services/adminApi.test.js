import { beforeEach, expect, test, vi } from "vitest";

const { auth } = vi.hoisted(() => ({ auth: { getSession: vi.fn(), mfa: { listFactors: vi.fn(), enroll: vi.fn(), unenroll: vi.fn(), challengeAndVerify: vi.fn(), getAuthenticatorAssuranceLevel: vi.fn() } } }));
vi.mock("@supabase/supabase-js", () => ({ createClient: () => ({ auth }) }));
vi.mock("./config", () => ({ apiConfig: () => ({ ready: true, url: "https://test.supabase.co", key: "public" }), AdminApiError: class extends Error { constructor(code, message) { super(message); this.code = code; } } }));
import { downloadApplication, enrollMfa, getAuthState, listCampaigns, publishCampaign, verifyMfa } from "./adminApi";

beforeEach(() => {
  vi.clearAllMocks();
  auth.getSession.mockResolvedValue({ data: { session: { access_token: "session-token" } } });
  auth.mfa.listFactors.mockResolvedValue({ data: { all: [], totp: [] } });
  auth.mfa.getAuthenticatorAssuranceLevel.mockResolvedValue({ data: { currentLevel: "aal1" } });
});
test("offers enrollment when there is no verified factor and challenge when one exists", async () => {
  expect((await getAuthState()).step).toBe("enroll");
  auth.mfa.listFactors.mockResolvedValue({ data: { totp: [{ id: "verified", status: "verified" }] } });
  expect((await getAuthState()).step).toBe("challenge");
});
test("restarts only abandoned panel factors and encodes QR colors safely", async () => {
  auth.mfa.listFactors.mockResolvedValue({ data: { all: [{ id: "pending", status: "unverified", factor_type: "totp", friendly_name: "Painel local Bom Pra Você" }, { id: "verified", status: "verified", factor_type: "totp", friendly_name: "Painel local Bom Pra Você" }] } });
  auth.mfa.unenroll.mockResolvedValue({});
  auth.mfa.enroll.mockResolvedValue({ data: { id: "new", totp: { qr_code: 'data:image/svg+xml;utf-8,<svg fill="#000"></svg>', secret: "test-secret" } } });
  const result = await enrollMfa();
  expect(auth.mfa.unenroll).toHaveBeenCalledExactlyOnceWith({ factorId: "pending" });
  expect(result.qrCode).toContain("%23000");
});
test("never opens the panel when MFA verification fails or does not elevate the session", async () => {
  auth.mfa.challengeAndVerify.mockResolvedValue({ error: { code: "mfa_verification_failed" } });
  await expect(verifyMfa("factor", "000000")).rejects.toThrow("Código inválido");
  auth.mfa.challengeAndVerify.mockResolvedValue({});
  await expect(verifyMfa("factor", "000000")).rejects.toThrow("AAL2");
  auth.mfa.getAuthenticatorAssuranceLevel.mockResolvedValue({ data: { currentLevel: "aal2" } });
  expect((await verifyMfa("factor", "000000")).step).toBe("ready");
});
test("reads the server array and sends metadata with the same publication request", async () => {
  global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => [{ id: "offer" }] });
  expect(await listCampaigns()).toEqual([{ id: "offer" }]);
  await publishCampaign({ id: "offer", revision: 2 }, new File(["image"], "flyer.png", { type: "image/png" }), { theme_key: "green" });
  const options = fetch.mock.calls[1][1];
  expect(JSON.parse(options.body.get("campaign"))).toEqual({ theme_key: "green" });
  expect(options.body.get("expected_revision")).toBe("2");
});
test("downloads through the authorized endpoint and delays blob revocation", async () => {
  vi.useFakeTimers();
  global.fetch = vi.fn().mockResolvedValue({ ok: true, blob: async () => new Blob(["pdf"]) });
  URL.createObjectURL = vi.fn(() => "blob:resume"); URL.revokeObjectURL = vi.fn();
  const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});
  await downloadApplication("application-id", "cv.pdf");
  expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({ action: "download", application_id: "application-id" });
  expect(click).toHaveBeenCalledOnce(); expect(URL.revokeObjectURL).not.toHaveBeenCalled();
  vi.runAllTimers(); expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:resume"); vi.useRealTimers();
});
