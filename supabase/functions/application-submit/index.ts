import { randomToken, sha256 } from "../_shared/crypto.ts";
import { failure, HttpError, json, preflight, requireMethod, requireUuid } from "../_shared/http.ts";
import { download, rpc, upload } from "../_shared/supabase.ts";
import { MAX_RESUME_BYTES, text, validateBirthDate, validateEmail, validatePdf } from "../_shared/validation.ts";

const MAX_BODY_BYTES = 5_150_000;

Deno.serve(async (req) => {
  let uploadedPath: string | null = null;
  try {
    if (req.method === "OPTIONS") return preflight(req);
    requireMethod(req, "POST");
    if (Deno.env.get("APPLICATIONS_ENABLED") !== "true") throw new HttpError(503, "APPLICATIONS_DISABLED", "Recebimento temporariamente indisponível.");
    const length = Number(req.headers.get("content-length") ?? 0);
    if (!length || length > MAX_BODY_BYTES) throw new HttpError(413, "REQUEST_TOO_LARGE", "O envio excede o limite permitido.");
    const form = await req.formData();
    const actualIntentId = requireUuid(text(form.get("intent_id"), 36, true), "Sessão");
    requireUuid(req.headers.get("idempotency-key"), "Chave de envio");
    const token = req.headers.get("x-application-token") ?? "";
    if (token.length < 32 || token.length > 128) throw new HttpError(401, "INVALID_TOKEN", "Sessão inválida.");
    const name = text(form.get("name"), 120, true);
    const email = text(form.get("email"), 254, true).toLowerCase();
    validateEmail(email);
    const phone = text(form.get("phone"), 24);
    const birthDate = validateBirthDate(text(form.get("birth_date"), 10));
    const address = text(form.get("address"), 200);
    const area = text(form.get("area"), 100);
    const privacyVersion = text(form.get("privacy_notice_version"), 80, true);
    if (!Deno.env.get("PRIVACY_NOTICE_VERSION") || privacyVersion !== Deno.env.get("PRIVACY_NOTICE_VERSION")) {
      throw new HttpError(409, "PRIVACY_NOTICE_CHANGED", "O aviso de privacidade foi atualizado. Recarregue a página antes de enviar.");
    }
    const file = form.get("file");
    if (!(file instanceof File)) throw new HttpError(422, "FILE_REQUIRED", "Selecione o currículo em PDF.");
    const safeName = file.name.trim().replace(/[\\/\r\n]/g, "_").slice(0, 255);
    const bytes = new Uint8Array(await file.arrayBuffer());
    if (bytes.length > MAX_RESUME_BYTES) throw new HttpError(413, "FILE_TOO_LARGE", "O PDF excede o limite de 5 MB.");
    validatePdf(bytes);
    const fileHash = await sha256(bytes);
    const normalized = JSON.stringify({ name, email, phone, birth_date: birthDate ?? "", address, area, privacy_notice_version: privacyVersion, file_name: safeName, file_sha256: fileHash });
    const payloadHash = await sha256(normalized);
    const tokenHash = await sha256(token);
    const intent = await rpc<{ object_path: string } | null>("bpv_get_application_intent_by_id", { p_intent_id: actualIntentId, p_token_hash: tokenHash });
    if (!intent) throw new HttpError(401, "INVALID_TOKEN", "Sessão inválida.");
    uploadedPath = intent.object_path;
    try {
      await upload("resumes-private", uploadedPath, bytes, "application/pdf");
    } catch (error) {
      // An idempotent retry may find the immutable object already stored. Verify it before finalizing.
      const existing = new Uint8Array(await download("resumes-private", uploadedPath));
      if (await sha256(existing) !== fileHash) throw error;
    }
    const receipt = await rpc("bpv_finalize_application", {
      p_intent_id: actualIntentId, p_token_hash: tokenHash, p_payload_hash: payloadHash,
      p_name: name, p_email: email, p_phone: phone, p_birth_date: birthDate, p_address: address, p_area: area,
      p_privacy_version: privacyVersion, p_object_path: uploadedPath, p_file_name: safeName,
      p_file_sha256: fileHash, p_file_size: bytes.length,
      p_protocol: `BPV-${new Date().getUTCFullYear()}-${randomToken(16)}`,
    });
    uploadedPath = null;
    return json(req, receipt);
  } catch (error) {
    if (uploadedPath) console.warn("Orphan candidate object queued for reconciliation", uploadedPath);
    return failure(req, error);
  }
});

