import { beforeEach, expect, test, vi } from "vitest";

const { auth } = vi.hoisted(() => ({ auth: { getSession: vi.fn(), signInWithPassword: vi.fn(), mfa: { listFactors: vi.fn(), enroll: vi.fn(), unenroll: vi.fn(), challengeAndVerify: vi.fn(), getAuthenticatorAssuranceLevel: vi.fn() } } }));
vi.mock("@supabase/supabase-js", () => ({ createClient: () => ({ auth }) }));
vi.mock("./config", () => ({ apiConfig: () => ({ ready: true, url: "https://test.supabase.co", key: "public" }), AdminApiError: class extends Error { constructor(code, message, status=0) { super(message); this.code = code; this.status=status; } } }));
import { authorizeAssistant, changedProductFields, downloadApplication, enrollMfa, getAuthState, listCampaigns, listSocialPublications, publishCampaign, retrySocialPublication, signIn, verifyMfa } from "./adminApi";

beforeEach(() => {
  vi.clearAllMocks();
  auth.getSession.mockResolvedValue({ data: { session: { access_token: "session-token" } } });
  auth.mfa.listFactors.mockResolvedValue({ data: { all: [], totp: [] } });
  auth.mfa.getAuthenticatorAssuranceLevel.mockResolvedValue({ data: { currentLevel: "aal1" } });
});

test('sends only fields changed in an existing product',()=>{
  const base={id:'p',revision:2,remoteRevision:4,name:'Produto',category:'mercearia',image:'https://photo'};
  expect(changedProductFields(base,{...base,revision:3,category:'higiene'})).toEqual({revision:3,category:'higiene'});
});

test('does not send local image metadata in a product patch',()=>{
  const base={id:'p',revision:2,remoteRevision:4,name:'Produto',image:'old'};
  const product={...base,revision:3,image:'new',imageSmall:'small',imageWidth:1600,imageHeight:1200,imageOptimizationVersion:1};
  expect(changedProductFields(base,product)).toEqual({revision:3,image:'new',imageSmall:'small'});
});

test("explains a network failure during sign in without treating it as an invalid password", async () => {
  auth.signInWithPassword.mockResolvedValue({ data: {}, error: { name: "AuthRetryableFetchError", message: "Failed to fetch", status: 0 } });
  await expect(signIn("user@example.com", "password")).rejects.toThrow("A conexão com a autenticação falhou");
});
test('distinguishes server failures from credentials and logs only safe metadata',async()=>{
 const logged=vi.spyOn(console,'error').mockImplementation(()=>{});
 auth.signInWithPassword.mockResolvedValue({data:{},error:{name:'AuthRetryableFetchError',code:'unexpected_failure',status:500,message:'secret token must never appear'}});
 await expect(signIn('user@example.com','private-password')).rejects.toThrow('O servidor de autenticação falhou');
 const output=logged.mock.calls.map(args=>args.join(' ')).join('\n');
 expect(output).toContain('"operation":"sign-in"');expect(output).toContain('"status":500');
 expect(output).not.toContain('private-password');expect(output).not.toContain('secret token');expect(output).not.toContain('user@example.com');
 logged.mockRestore();
});
test('gives a specific message for rejected credentials',async()=>{
 const logged=vi.spyOn(console,'error').mockImplementation(()=>{});
 auth.signInWithPassword.mockResolvedValue({data:{},error:{code:'invalid_credentials',status:400}});
 await expect(signIn('user@example.com','wrong')).rejects.toThrow('E-mail ou senha incorretos');
 logged.mockRestore();
});
test('reports API status and request id while hiding server details',async()=>{
 const logged=vi.spyOn(console,'error').mockImplementation(()=>{});
 global.fetch=vi.fn().mockResolvedValue({ok:false,status:500,headers:{get:()=> 'request-123'},json:async()=>({message:'private response body',code:'unexpected_failure'})});
 await expect(listCampaigns()).rejects.toThrow('O serviço falhou');
 const output=logged.mock.calls.map(args=>args.join(' ')).join('\n');
 expect(output).toContain('"requestId":"request-123"');expect(output).toContain('"status":500');
 expect(output).not.toContain('private response body');
 logged.mockRestore();
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
test("requires a fresh authenticator challenge before authorizing assisted mode", async () => {
  await expect(authorizeAssistant("123456")).rejects.toThrow("Configure o autenticador");
  auth.mfa.listFactors.mockResolvedValue({ data: { totp: [{ id: "phone-factor", status: "verified" }] } });
  auth.mfa.challengeAndVerify.mockResolvedValue({});
  expect(await authorizeAssistant("123456")).toBe("session-token");
  expect(auth.mfa.challengeAndVerify).toHaveBeenCalledWith({ factorId: "phone-factor", code: "123456" });
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
test("lists and retries Instagram publications through the protected admin endpoint", async () => {
  global.fetch = vi.fn()
    .mockResolvedValueOnce({ ok: true, json: async () => ({ publications: [{ id: "publication" }] }) })
    .mockResolvedValueOnce({ ok: true, json: async () => ({ id: "publication", status: "queued" }) });
  expect(await listSocialPublications()).toEqual([{ id: "publication" }]);
  await retrySocialPublication("publication");
  expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({ action: "social_list" });
  expect(JSON.parse(fetch.mock.calls[1][1].body)).toEqual({ action: "social_retry", publication_id: "publication" });
});
