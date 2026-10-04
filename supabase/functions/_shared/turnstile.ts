import { HttpError } from "./http.ts";

export async function verifyTurnstile(token: unknown, idempotencyKey: string, remoteIp: string | null) {
  if (typeof token !== "string" || !token || token.length > 2048) throw new HttpError(400, "CHALLENGE_REQUIRED", "Conclua a verificação de segurança.");
  const secret = Deno.env.get("TURNSTILE_SECRET_KEY");
  if (!secret) throw new HttpError(503, "CHALLENGE_UNAVAILABLE", "Verificação de segurança indisponível.");
  const form = new FormData();
  form.set("secret", secret);
  form.set("response", token);
  form.set("idempotency_key", idempotencyKey);
  if (remoteIp) form.set("remoteip", remoteIp);
  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body: form });
  if (!response.ok) throw new HttpError(503, "CHALLENGE_UNAVAILABLE", "Verificação de segurança indisponível.");
  const result = await response.json();
  const expectedHostname = Deno.env.get("TURNSTILE_EXPECTED_HOSTNAME");
  if (!result.success || result.action !== "application-init" || (expectedHostname && result.hostname !== expectedHostname)) {
    throw new HttpError(400, "CHALLENGE_FAILED", "Refaça a verificação de segurança.");
  }
}

