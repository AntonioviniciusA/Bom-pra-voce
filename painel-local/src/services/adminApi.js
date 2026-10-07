import { createClient } from "@supabase/supabase-js";
import { apiConfig, AdminApiError } from "./config";

let client;
function supabase() {
  const config = apiConfig();
  if (!config.ready) throw new AdminApiError("UNAVAILABLE", "Configure a conexão do Supabase para usar o painel.");
  if (!client) client = createClient(config.url, config.key, {
    auth: { storage: sessionStorage, persistSession: true, autoRefreshToken: true, detectSessionInUrl: false }
  });
  return client;
}

function authError(error, fallback) {
  const messages = {
    mfa_totp_enroll_not_enabled: "A ativação por autenticador está desabilitada no projeto Supabase. Habilite TOTP nas configurações de autenticação.",
    mfa_verification_failed: "Código inválido ou expirado. Verifique o horário automático do celular e use o código atual.",
    mfa_factor_name_conflict: "Já existe um autenticador com esse nome. Saia e entre novamente para atualizar a lista.",
  };
  if (messages[error?.code]) return new AdminApiError("AUTH", messages[error.code], error.status || 0);
  return new AdminApiError("AUTH", error?.message || fallback, error?.status || 0);
}

async function mfaState() {
  const auth = supabase().auth;
  const [{ data: assurance, error: assuranceError }, { data: factors, error: factorsError }] = await Promise.all([
    auth.mfa.getAuthenticatorAssuranceLevel(), auth.mfa.listFactors()
  ]);
  if (assuranceError) throw authError(assuranceError, "Não foi possível verificar o segundo fator.");
  if (factorsError) throw authError(factorsError, "Não foi possível listar os autenticadores.");
  const verifiedFactors = (factors?.totp || []).filter(factor => factor.status === "verified");
  if (assurance?.currentLevel === "aal2") return { step: "ready", factors: verifiedFactors };
  return { step: verifiedFactors.length ? "challenge" : "enroll", factors: verifiedFactors };
}

export async function getAuthState() {
  const { data, error } = await supabase().auth.getSession();
  if (error) throw authError(error, "Não foi possível recuperar a sessão.");
  if (!data.session) return { step: "login", factors: [] };
  return mfaState();
}

export async function clearAdminToken() {
  const { error } = await supabase().auth.signOut({ scope: "local" });
  if (error) throw authError(error, "Não foi possível sair.");
}

export async function enrollMfa() {
  // Remove only abandoned enrollments created by this panel, never verified factors.
  const { data: factors, error: listError } = await supabase().auth.mfa.listFactors();
  if (listError) throw authError(listError, "Não foi possível consultar os autenticadores.");
  for (const factor of factors.all || []) {
    if (factor.factor_type === "totp" && factor.status === "unverified" && factor.friendly_name === "Painel local Bom Pra Você") {
      const { error } = await supabase().auth.mfa.unenroll({ factorId: factor.id });
      if (error) throw authError(error, "Não foi possível reiniciar a configuração pendente.");
    }
  }
  const { data, error } = await supabase().auth.mfa.enroll({ factorType: "totp", friendlyName: "Painel local Bom Pra Você" });
  if (error) throw authError(error, "Não foi possível iniciar a ativação do segundo fator.");
  const qr = data.totp.qr_code;
  const svg = qr.includes("<svg") ? qr.slice(qr.indexOf("<svg")) : null;
  return { factorId: data.id, qrCode: svg ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}` : qr, secret: data.totp.secret };
}

export async function verifyMfa(factorId, code) {
  const { error } = await supabase().auth.mfa.challengeAndVerify({ factorId, code });
  if (error) throw authError(error, "Código inválido ou expirado.");
  const state = await mfaState();
  if (state.step !== "ready") throw new AdminApiError("AUTH", "O segundo fator não elevou a sessão para AAL2.");
  return state;
}

async function request(path, options = {}) {
  const config = apiConfig();
  if (!config.ready) throw new AdminApiError("UNAVAILABLE", "Configure a conexão do Supabase para usar o painel.");
  const { data, error } = await supabase().auth.getSession();
  if (error || !data.session?.access_token) throw new AdminApiError("AUTH", "Sua sessão expirou. Entre novamente.");
  const response = await fetch(`${config.url}${path}`, {
    ...options,
    headers: { apikey: config.key, Authorization: `Bearer ${data.session.access_token}`, ...options.headers },
  });
  if (!response.ok) {
    let message = "Não foi possível concluir a operação.";
    try { message = (await response.json())?.message || message; } catch {}
    throw new AdminApiError(response.status === 401 ? "AUTH" : "REQUEST", message, response.status);
  }
  return response;
}

export async function signIn(email, password) {
  const { data, error } = await supabase().auth.signInWithPassword({ email, password });
  if (error || !data.session) throw authError(error, "E-mail ou senha inválidos.");
  return mfaState();
}

export async function updatePassword(password) {
  const { data, error } = await supabase().auth.updateUser({ password });
  if (error) throw authError(error, "Não foi possível trocar a senha.");
  return data;
}

export async function listCampaigns() {
  const response = await request("/functions/v1/promotion-admin", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "list" }) });
  const body = await response.json();
  return Array.isArray(body) ? body : body?.campaigns || [];
}
export async function createCampaign(campaign) {
  const response = await request("/functions/v1/promotion-admin", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "create", campaign }) });
  return response.json();
}
export async function updateCampaign(campaign, values) {
  const response = await request("/functions/v1/promotion-admin", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "update", campaign_id: campaign.id, expected_revision: campaign.revision, campaign: values }) });
  return response.json();
}
export async function publishCampaign(campaign, file, values) {
  const form = new FormData();
  form.append("action", "publish"); form.append("campaign_id", campaign.id); form.append("expected_revision", campaign.revision); form.append("file", file);
  if (values) form.append("campaign", JSON.stringify(values));
  const response = await request("/functions/v1/promotion-admin", { method: "POST", headers: { "Idempotency-Key": crypto.randomUUID() }, body: form });
  return response.json();
}
export async function withdrawCampaign(campaign) {
  const response = await request("/functions/v1/promotion-admin", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "withdraw", campaign_id: campaign.id, expected_revision: campaign.revision }) });
  return response.json();
}
export async function listApplications(cursor = {}) {
  const response = await request("/functions/v1/rh-applications", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "list", limit: 50, ...cursor }) });
  return (await response.json())?.applications || [];
}
export async function downloadApplication(applicationId, filename = "curriculo.pdf") {
  const response = await request("/functions/v1/rh-applications", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "download", application_id: applicationId }) });
  const blob = await response.blob();
  const url = URL.createObjectURL(blob); const link = document.createElement("a"); link.href = url; link.download = filename.replace(/[^\p{L}\p{N}._-]/gu, "_");
  document.body.appendChild(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}
