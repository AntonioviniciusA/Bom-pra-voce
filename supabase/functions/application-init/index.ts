import { hmac, sha256 } from "../_shared/crypto.ts";
import { failure, HttpError, json, preflight, requireMethod, requireUuid } from "../_shared/http.ts";
import { rpc } from "../_shared/supabase.ts";
import { verifyTurnstile } from "../_shared/turnstile.ts";

type Intent = { id: string; token_hash: string; key_version: number; expires_at: string; state: string } | null;

function clientIp(req: Request) {
  return req.headers.get("cf-connecting-ip") || req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

Deno.serve(async (req) => {
  try {
    if (req.method === "OPTIONS") return preflight(req);
    requireMethod(req, "POST");
    if (Deno.env.get("APPLICATIONS_ENABLED") !== "true") throw new HttpError(503, "APPLICATIONS_DISABLED", "Recebimento temporariamente indisponível.");
    const contentLength = Number(req.headers.get("content-length") ?? 0);
    if (contentLength > 16_384) throw new HttpError(413, "REQUEST_TOO_LARGE", "Solicitação muito grande.");
    const body = await req.json();
    const idempotencyKey = requireUuid(req.headers.get("idempotency-key") || body?.idempotency_key, "Chave de envio");
    const secret = Deno.env.get(`APPLICATION_TOKEN_SECRET_V${Deno.env.get("APPLICATION_TOKEN_KEY_VERSION") || "1"}`);
    const keyVersion = Number(Deno.env.get("APPLICATION_TOKEN_KEY_VERSION") || "1");
    if (!secret || !Number.isInteger(keyVersion) || keyVersion < 1) throw new HttpError(503, "CONFIGURATION_ERROR", "Recebimento temporariamente indisponível.");
    const idempotencyHash = await hmac(secret, `idempotency:${idempotencyKey}`);
    let intent = await rpc<Intent>("bpv_get_application_intent", { p_idempotency_hash: idempotencyHash });
    if (!intent) {
      await verifyTurnstile(body?.challenge_token, idempotencyKey, clientIp(req));
      const id = crypto.randomUUID();
      const token = await hmac(secret, `intent:${id}:${idempotencyHash}`);
      intent = await rpc<Intent>("bpv_create_application_intent", {
        p_id: id,
        p_idempotency_hash: idempotencyHash,
        p_token_hash: await sha256(token),
        p_key_version: keyVersion,
        p_object_path: `${id}/${crypto.randomUUID()}.pdf`,
        p_subject_hash: await hmac(secret, `ip:${clientIp(req)}`),
      });
    }
    if (!intent) throw new HttpError(503, "INTENT_UNAVAILABLE", "Não foi possível preparar o envio.");
    if (intent.state === "expired" || Date.parse(intent.expires_at) <= Date.now()) throw new HttpError(410, "EXPIRED", "Sessão expirada.");
    const versionSecret = Deno.env.get(`APPLICATION_TOKEN_SECRET_V${intent.key_version}`);
    if (!versionSecret) throw new HttpError(503, "KEY_UNAVAILABLE", "Não foi possível recuperar a sessão.");
    const token = await hmac(versionSecret, `intent:${intent.id}:${idempotencyHash}`);
    if (await sha256(token) !== intent.token_hash) throw new HttpError(409, "INTENT_CONFLICT", "A sessão não pôde ser conciliada.");
    return json(req, { intent_id: intent.id, token, server_time: new Date().toISOString(), expires_at: intent.expires_at });
  } catch (error) {
    return failure(req, error);
  }
});

