export class HttpError extends Error {
  constructor(public status: number, public code: string, message: string) {
    super(message);
  }
}

function allowedOrigins() {
  return new Set((Deno.env.get("ALLOWED_ORIGINS") ?? "").split(",").map((v) => v.trim()).filter(Boolean));
}

export function cors(req: Request) {
  const origin = req.headers.get("origin") ?? "";
  const allowed = allowedOrigins();
  if (origin && !allowed.has(origin)) throw new HttpError(403, "ORIGIN_NOT_ALLOWED", "Origem não autorizada.");
  return {
    "Access-Control-Allow-Origin": origin || "null",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "authorization, apikey, content-type, idempotency-key, x-application-token",
    "Access-Control-Max-Age": "600",
    "Vary": "Origin",
  };
}

export function json(req: Request, value: unknown, status = 200, extra: HeadersInit = {}) {
  return new Response(JSON.stringify(value), {
    status,
    headers: { ...cors(req), "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", ...extra },
  });
}

export function failure(req: Request, error: unknown) {
  const known = error instanceof HttpError;
  return json(req, { error: known ? error.code : "INTERNAL_ERROR", message: known ? error.message : "Serviço temporariamente indisponível." }, known ? error.status : 500);
}

export function preflight(req: Request) {
  return new Response(null, { status: 204, headers: cors(req) });
}

export function requireMethod(req: Request, method: string) {
  if (req.method !== method) throw new HttpError(405, "METHOD_NOT_ALLOWED", "Método não permitido.");
}

export function requireUuid(value: string | null, label = "identificador") {
  if (!value || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)) {
    throw new HttpError(400, "INVALID_REQUEST", `${label} inválido.`);
  }
  return value.toLowerCase();
}

