import { callPublicFunction, PublicApiError, apiConfig } from "./publicApi";
import { privacyReady, storeConfig } from "../Data/storeConfig";
export const MAX_RESUME_BYTES = 5000000;
export const applicationReady = () => apiConfig().ready &&
  process.env.REACT_APP_APPLICATIONS_ENABLED === "true" &&
  Boolean(process.env.REACT_APP_TURNSTILE_SITE_KEY) && privacyReady();
export function validateApplication(values, file) {
  const errors = {};
  if (!values.name?.trim() || values.name.trim().length > 120) errors.name = "Informe seu nome (até 120 caracteres).";
  if (!values.email?.trim() || values.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = "Informe um e-mail válido para contato.";
  if ((values.phone || "").length > 24) errors.phone = "Use até 24 caracteres no telefone.";
  if ((values.city || "").length > 100) errors.city = "Use até 100 caracteres na cidade.";
  if ((values.area || "").length > 100) errors.area = "Use até 100 caracteres.";
  if (values.birthDate) {
    const parsed = new Date(values.birthDate + "T12:00:00Z");
    if (Number.isNaN(parsed.valueOf()) || parsed.toISOString().slice(0, 10) !== values.birthDate || values.birthDate > new Date().toISOString().slice(0, 10))
      errors.birthDate = "Informe uma data de nascimento válida e não futura.";
  }
  if (!file) errors.file = "Selecione seu currículo em PDF.";
  else if (!/\.pdf$/i.test(file.name) || (file.type && file.type !== "application/pdf"))
    errors.file = "Escolha um arquivo PDF.";
  else if (!file.size || file.size > MAX_RESUME_BYTES) errors.file = "O PDF deve ter conteúdo e no máximo 5 MB (5.000.000 bytes).";
  return errors;
}
function parseReceipt(data, intent, payload) {
  const receipt = data?.receipt;
  if (data?.status !== "received" || data.intent_id !== intent.id ||
      !receipt || !/^BPV-\d{4}-[A-Za-z0-9-]{22,64}$/.test(receipt.protocol) ||
      !Number.isFinite(Date.parse(receipt.received_at)) ||
      receipt.candidate_name !== payload.name ||
      typeof receipt.file_name !== "string" || !receipt.file_name.trim() ||
      receipt.file_name.length > 255 || /[\r\n]/.test(receipt.file_name)) {
    throw new PublicApiError("INVALID_RESPONSE", "O recebimento ainda não foi confirmado. Tente novamente sem alterar os dados.");
  }
  return { protocol: receipt.protocol, received_at: receipt.received_at,
    candidate_name: payload.name, area: payload.area, file_name: receipt.file_name };
}
// A session belongs to exactly one immutable payload and lives only in memory.
export function createApplicationSession(values, file, challengeToken = "") {
  const payload = { name: values.name.trim(), email: values.email.trim(), phone: (values.phone || "").trim(),
    birth_date: values.birthDate || "", city: (values.city || "").trim(), area: (values.area || "").trim() };
  const key = crypto.randomUUID();
  let intent = null;
  let busy = false;
  let result = null;
  let deadline = null;
  return {
    async submit() {
      if (result) return result;
      if (busy) throw new PublicApiError("BUSY", "Envio em andamento.");
      busy = true;
      try {
        if (!intent) {
          const data = await callPublicFunction("application-init", {
            body: JSON.stringify({ idempotency_key: key, challenge_token: challengeToken }),
            headers: { "Content-Type": "application/json", "Idempotency-Key": key },
          });
          if (typeof data?.intent_id !== "string" || !data.intent_id ||
              typeof data.token !== "string" || data.token.length < 32 ||
              !Number.isFinite(Date.parse(data.expires_at)) || !Number.isFinite(Date.parse(data.server_time))) {
            throw new PublicApiError("INVALID_RESPONSE", "Não foi possível preparar o envio.");
          }
          intent = { id: data.intent_id, token: data.token };
          deadline = performance.now() + Math.min(1800000, Date.parse(data.expires_at) - Date.parse(data.server_time));
        }
        if (performance.now() >= deadline) throw new PublicApiError("EXPIRED", "A sessão expirou. Não é possível confirmar este envio pelo site. Não faça um novo envio sem orientação da loja.");
        const body = new FormData();
        body.append("intent_id", intent.id);
        body.append("name", payload.name);
        body.append("email", payload.email);
        body.append("phone", payload.phone);
        body.append("birth_date", payload.birth_date);
        body.append("city", payload.city);
        body.append("area", payload.area);
        body.append("privacy_notice_version", storeConfig.privacy.version);
        body.append("file", file);
        const data = await callPublicFunction("application-submit", {
          body, headers: { "X-Application-Token": intent.token, "Idempotency-Key": key },
        });
        result = parseReceipt(data, intent, payload);
        return result;
      } finally { busy = false; }
    },
  };
}
