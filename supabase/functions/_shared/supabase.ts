import { HttpError } from "./http.ts";

function env(name: string) {
  const value = Deno.env.get(name);
  if (!value) throw new Error(`Missing server configuration: ${name}`);
  return value;
}

export const projectUrl = () => env("SUPABASE_URL").replace(/\/$/, "");
export const serviceKey = () => Deno.env.get("SUPABASE_SECRET_KEY") || env("SUPABASE_SERVICE_ROLE_KEY");

async function api(path: string, init: RequestInit = {}) {
  const key = serviceKey();
  const response = await fetch(`${projectUrl()}${path}`, {
    ...init,
    headers: { apikey: key, Authorization: `Bearer ${key}`, ...(init.headers ?? {}) },
  });
  if (!response.ok) {
    const detail = await response.text();
    console.error("Supabase request failed", response.status, detail.slice(0, 500));
    let message = "";
    try { message = JSON.parse(detail)?.message ?? ""; } catch { /* not JSON */ }
    const mapped: Record<string, [number, string]> = {
      FORBIDDEN: [403, "FORBIDDEN"], EXPIRED: [410, "EXPIRED"], RATE_LIMIT: [429, "RATE_LIMIT"],
      PAYLOAD_CONFLICT: [409, "CONFLICT"], OBJECT_CONFLICT: [409, "CONFLICT"], REVISION_CONFLICT: [409, "CONFLICT"],
      INVALID_TOKEN: [401, "INVALID_TOKEN"], NOT_FOUND: [404, "NOT_FOUND"], DOWNLOAD_BLOCKED: [423, "DOWNLOAD_BLOCKED"],
    };
    if (mapped[message]) throw new HttpError(mapped[message][0], mapped[message][1], "Não foi possível concluir a operação.");
    throw new HttpError(503, "DEPENDENCY_UNAVAILABLE", "Não foi possível concluir a operação.");
  }
  if (response.status === 204) return null;
  const type = response.headers.get("content-type") ?? "";
  return type.includes("json") ? response.json() : response.arrayBuffer();
}

export async function rpc<T>(name: string, body: Record<string, unknown>): Promise<T> {
  return await api(`/rest/v1/rpc/${name}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }) as T;
}

export async function upload(bucket: string, path: string, bytes: Uint8Array, contentType: string) {
  await api(`/storage/v1/object/${bucket}/${path}`, { method: "POST", headers: { "Content-Type": contentType, "x-upsert": "false", "Cache-Control": "31536000" }, body: Uint8Array.from(bytes).buffer });
}

export async function remove(bucket: string, paths: string[]) {
  await api(`/storage/v1/object/${bucket}`, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prefixes: paths }) });
}

export async function download(bucket: string, path: string) {
  return await api(`/storage/v1/object/authenticated/${bucket}/${path}`) as ArrayBuffer;
}

export async function authenticatedUser(req: Request) {
  const authorization = req.headers.get("authorization") ?? "";
  if (!authorization.startsWith("Bearer ")) throw new HttpError(401, "UNAUTHENTICATED", "Autenticação necessária.");
  const key = serviceKey();
  const response = await fetch(`${projectUrl()}/auth/v1/user`, { headers: { apikey: key, Authorization: authorization } });
  if (!response.ok) throw new HttpError(401, "UNAUTHENTICATED", "Sessão inválida ou expirada.");
  const user = await response.json();
  if (!user?.id) throw new HttpError(401, "UNAUTHENTICATED", "Sessão inválida.");
  try {
    const encoded = authorization.slice(7).split(".")[1];
    const normalized = encoded.replaceAll("-", "+").replaceAll("_", "/").padEnd(Math.ceil(encoded.length / 4) * 4, "=");
    const payload = JSON.parse(atob(normalized));
    if (payload.aal !== "aal2") throw new HttpError(403, "MFA_REQUIRED", "Confirme o segundo fator para continuar.");
  } catch (error) {
    if (error instanceof HttpError) throw error;
    throw new HttpError(401, "UNAUTHENTICATED", "Sessão inválida.");
  }
  return user as { id: string; email?: string };
}

