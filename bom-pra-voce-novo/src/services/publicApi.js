export class PublicApiError extends Error {
  constructor(code, message, status = 0) { super(message); this.code = code; this.status = status; }
}
export function apiConfig() {
  const url = (process.env.REACT_APP_SUPABASE_URL || "").replace(/\/$/, "");
  const key = process.env.REACT_APP_SUPABASE_PUBLISHABLE_KEY || "";
  let valid = false;
  try { valid = new URL(url).protocol === "https:" && /^sb_publishable_[A-Za-z0-9_-]+$/.test(key); } catch {}
  return { url, key, ready: valid };
}
export async function callPublicFunction(name, { signal, body, headers = {} } = {}) {
  const config = apiConfig();
  if (!config.ready) throw new PublicApiError("UNAVAILABLE", "Serviço temporariamente indisponível.");
  const controller = new AbortController();
  const abort = () => controller.abort();
  if (signal?.aborted) abort();
  signal?.addEventListener("abort", abort);
  const timeout = setTimeout(abort, 25000);
  try {
    const response = await fetch(config.url + "/functions/v1/" + name, {
      method: body ? "POST" : "GET", body, signal: controller.signal,
      credentials: "omit", cache: "no-store", redirect: "error",
      headers: { apikey: config.key, ...headers },
    });
    if (!response.ok) {
      let serverCode = "";
      try { serverCode = (await response.json())?.error || ""; } catch {}
      const code = serverCode === "PRIVACY_NOTICE_CHANGED" ? serverCode : response.status === 409 ? "CONFLICT" : response.status === 410 ? "EXPIRED" : response.status === 429 ? "RATE_LIMIT" :
        [400, 413, 415, 422].includes(response.status) ? (serverCode || "INVALID_REQUEST") : "UNAVAILABLE";
      throw new PublicApiError(code, "Não foi possível confirmar a operação. Tente novamente.", response.status);
    }
    return await response.json();
  } catch (error) {
    if (error instanceof PublicApiError) throw error;
    throw new PublicApiError("NETWORK", "Não foi possível confirmar a operação. Verifique sua conexão.");
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener("abort", abort);
  }
}
export function publicMediaUrl(value) {
  try {
    const url = new URL(value);
    const project = new URL(apiConfig().url);
    return url.protocol === "https:" && url.origin === project.origin &&
      url.pathname.startsWith("/storage/v1/object/public/promotion-public/") &&
      !url.username && !url.password && !url.search && !url.hash ? url.href : null;
  } catch { return null; }
}
