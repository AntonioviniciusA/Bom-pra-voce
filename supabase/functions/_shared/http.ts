export class HttpError extends Error {
  constructor(public status: number, public code: string, message: string) {
    super(message);
  }
}

const DEFAULT_ALLOWED_ORIGINS = ["https://bom-pra-voce-vert.vercel.app"];

function allowedOrigins() {
  const configured = (Deno.env.get("ALLOWED_ORIGINS") ?? "").split(",").map((v) => v.trim()).filter(Boolean);
  return new Set([...DEFAULT_ALLOWED_ORIGINS, ...configured]);
}

export function cors(req: Request) {
  const origin = req.headers.get("origin") ?? "";
  const allowed = allowedOrigins();
  const administrative = /\/(promotion-admin|rh-applications)\/?$/.test(new URL(req.url).pathname);
  if (administrative) {
    // The local panel still needs a valid user JWT, AAL2 and operation permission.
    for (const value of ["null", "http://127.0.0.1:5174", "http://localhost:5174"]) allowed.add(value);
  }
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
  const body = { error: known ? error.code : "INTERNAL_ERROR", message: known ? error.message : "Serviço temporariamente indisponível." };
  if (known && error.code === "ORIGIN_NOT_ALLOWED") {
    return new Response(JSON.stringify(body), {
      status: error.status,
      headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
    });
  }
  return json(req, body, known ? error.status : 500);
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
