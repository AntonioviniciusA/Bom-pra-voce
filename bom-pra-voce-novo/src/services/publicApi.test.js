import { callPublicFunction, apiConfig } from "./publicApi";
beforeEach(() => {
  process.env.REACT_APP_SUPABASE_URL = "https://example.supabase.co";
  process.env.REACT_APP_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_test";
  global.fetch = jest.fn();
});
afterEach(() => { delete global.fetch; jest.useRealTimers(); });
test("no configuration or a secret key blocks network requests", async () => {
  process.env.REACT_APP_SUPABASE_PUBLISHABLE_KEY = "sb_secret_not_allowed";
  expect(apiConfig().ready).toBe(false);
  await expect(callPublicFunction("public-promotions")).rejects.toMatchObject({ code: "UNAVAILABLE" });
  expect(fetch).not.toHaveBeenCalled();
});
test("requests do not cache personal data or attach browser cookies", async () => {
  fetch.mockResolvedValue({ ok: true, json: async () => ({ valid: true }) });
  await callPublicFunction("public-promotions");
  expect(fetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
    credentials: "omit", cache: "no-store", redirect: "error",
    headers: { apikey: "sb_publishable_test" },
  }));
});
test.each([[409,"CONFLICT"],[410,"EXPIRED"],[429,"RATE_LIMIT"],[503,"UNAVAILABLE"]])("HTTP %s never returns success", async (status, code) => {
  fetch.mockResolvedValue({ ok: false, status });
  await expect(callPublicFunction("application-submit")).rejects.toMatchObject({ code });
});
test("validation errors preserve the server code so the form can be corrected", async () => {
  fetch.mockResolvedValue({ ok: false, status: 422, json: async () => ({ error: "INVALID_FIELDS" }) });
  await expect(callPublicFunction("application-submit")).rejects.toMatchObject({ code: "INVALID_FIELDS", status: 422 });
});
test("a timeout ends the request instead of leaving an endless spinner", async () => {
  jest.useFakeTimers();
  fetch.mockImplementation((url, options) => new Promise((resolve, reject) => {
    options.signal.addEventListener("abort", () => reject(new Error("aborted")));
  }));
  const assertion = expect(callPublicFunction("public-promotions")).rejects.toMatchObject({ code: "NETWORK" });
  jest.advanceTimersByTime(25000);
  await assertion;
});

test("upload reports real bytes and waits for server response after 100%", async () => {
  const original = global.XMLHttpRequest;
  const xhr = { upload: {}, open: jest.fn(), setRequestHeader: jest.fn(), send: jest.fn() };
  global.XMLHttpRequest = jest.fn(() => xhr);
  try {
    const onProgress = jest.fn();
    const resolved = jest.fn();
    const pending = callPublicFunction("application-submit", { body: new FormData(), onUploadProgress: onProgress }).then(resolved);
    xhr.upload.onprogress({ lengthComputable: true, loaded: 25, total: 100 });
    expect(onProgress).toHaveBeenLastCalledWith({ phase: "uploading", percent: 25 });
    xhr.upload.onload();
    await Promise.resolve();
    expect(resolved).not.toHaveBeenCalled();
    expect(onProgress).toHaveBeenLastCalledWith({ phase: "confirming", percent: 100 });
    xhr.status = 200;
    xhr.responseText = JSON.stringify({ status: "received" });
    xhr.onload();
    await pending;
    expect(resolved).toHaveBeenCalledWith({ status: "received" });
  } finally { global.XMLHttpRequest = original; }
});
test.each(["onerror", "ontimeout"])("upload %s never confirms receipt", async event => {
  const original = global.XMLHttpRequest;
  const xhr = { upload: {}, open: jest.fn(), setRequestHeader: jest.fn(), send: jest.fn() };
  global.XMLHttpRequest = jest.fn(() => xhr);
  try {
    const pending = callPublicFunction("application-submit", { body: new FormData(), onUploadProgress: jest.fn() });
    xhr[event]();
    await expect(pending).rejects.toMatchObject({ code: "NETWORK" });
  } finally { global.XMLHttpRequest = original; }
});
