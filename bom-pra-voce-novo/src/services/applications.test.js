import { createApplicationSession, validateApplication } from "./applications";
import { callPublicFunction } from "./publicApi";
jest.mock("./publicApi", () => ({
  callPublicFunction: jest.fn(), apiConfig: () => ({ ready: true }),
  PublicApiError: class extends Error { constructor(code, message) { super(message); this.code = code; } },
}));
const values = { name: "Pessoa Teste", email: "teste@example.com", area: "Padaria" };
const file = new File(["%PDF-1.4 teste"], "curriculo.pdf", { type: "application/pdf" });
const intent = { intent_id: "intent-1", token: "a".repeat(40), server_time: "2026-10-01T12:00:00Z", expires_at: "2026-10-01T12:30:00Z" };
const receipt = { status: "received", intent_id: "intent-1", receipt: {
  protocol: "BPV-2026-" + "a".repeat(32), received_at: "2026-10-01T12:01:00Z", candidate_name: values.name, file_name: file.name,
} };
beforeEach(() => {
  jest.clearAllMocks();
  Object.defineProperty(global, "crypto", { configurable: true, value: { randomUUID: () => "b".repeat(32) } });
});
test("validates type, size and required contact without trusting extension alone", () => {
  expect(validateApplication(values, file)).toEqual({});
  expect(validateApplication({ ...values, email: "bad" }, file).email).toBeTruthy();
  expect(validateApplication(values, { name: "file.pdf", type: "text/html", size: 10 }).file).toBeTruthy();
  expect(validateApplication(values, { name: "file.pdf", type: "application/pdf", size: 5000001 }).file).toBeTruthy();
});
test("lost response retries same intent, token, payload and returns one confirmed receipt", async () => {
  callPublicFunction.mockResolvedValueOnce(intent).mockRejectedValueOnce(new Error("lost")).mockResolvedValueOnce(receipt);
  const session = createApplicationSession(values, file);
  await expect(session.submit()).rejects.toThrow("lost");
  const result = await session.submit();
  expect(result.protocol).toBe(receipt.receipt.protocol);
  const first = callPublicFunction.mock.calls[1][1];
  const second = callPublicFunction.mock.calls[2][1];
  expect(first.headers).toEqual(second.headers);
  expect(first.body.get("intent_id")).toBe(second.body.get("intent_id"));
  expect(first.body.get("file")).toBe(second.body.get("file"));
  expect(first.body.get("privacy_notice_version")).toBe("");
  expect(JSON.parse(callPublicFunction.mock.calls[0][1].body).challenge_token).toBe("");
  expect(await session.submit()).toBe(result);
  expect(callPublicFunction).toHaveBeenCalledTimes(3);
});
test("generic success or different identity never emits receipt", async () => {
  callPublicFunction.mockResolvedValueOnce(intent).mockResolvedValueOnce({ success: true });
  await expect(createApplicationSession(values, file).submit()).rejects.toMatchObject({ code: "INVALID_RESPONSE" });
});
test("expired intent does not silently create a new submission", async () => {
  callPublicFunction.mockResolvedValueOnce({ ...intent, expires_at: intent.server_time });
  const session = createApplicationSession(values, file);
  await expect(session.submit()).rejects.toMatchObject({ code: "EXPIRED" });
  await expect(session.submit()).rejects.toMatchObject({ code: "EXPIRED" });
  expect(callPublicFunction).toHaveBeenCalledTimes(1);
});
