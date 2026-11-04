import {prepareCampaignImages} from './productImages';
import { createClient } from "@supabase/supabase-js";
import { apiConfig, AdminApiError } from "./config";
import {logPanelError} from './diagnostics';

let client;
function supabase() {
  const config = apiConfig();
  if (!config.ready) throw new AdminApiError("UNAVAILABLE", "Configure a conexão do Supabase para usar o painel.");
  if (!client) client = createClient(config.url, config.key, {
    auth: { storage: sessionStorage, persistSession: true, autoRefreshToken: true, detectSessionInUrl: false }
  });
  return client;
}

function authError(error, fallback, operation='auth') {
  let mapped;
  if (error?.status >= 500) {
    mapped = new AdminApiError("SERVER", "O servidor de autenticação falhou ao concluir o acesso. Aguarde um momento e tente novamente.", error.status);
  } else if (error?.name === "AuthRetryableFetchError" || (error?.status === 0 && error?.message === "Failed to fetch")) {
    mapped = new AdminApiError("NETWORK", "A conexão com a autenticação falhou. Confira sua internet e tente novamente.");
  } else if (error?.code === 'invalid_credentials') {
    mapped = new AdminApiError("AUTH", "E-mail ou senha incorretos. Confira os dados e tente novamente.", error.status || 0);
  }
  const messages = {
    mfa_totp_enroll_not_enabled: "A ativação por autenticador está desabilitada no projeto Supabase. Habilite TOTP nas configurações de autenticação.",
    mfa_verification_failed: "Código inválido ou expirado. Verifique o horário automático do celular e use o código atual.",
    mfa_factor_name_conflict: "Já existe um autenticador com esse nome. Saia e entre novamente para atualizar a lista.",
  };
  if (!mapped && messages[error?.code]) mapped = new AdminApiError("AUTH", messages[error.code], error.status || 0);
  if (!mapped) mapped = new AdminApiError("AUTH", fallback, error?.status || 0);
  mapped.remoteCode = error?.code;
  mapped.cause = error;
  logPanelError(operation,mapped);
  return mapped;
}

async function mfaState() {
  const auth = supabase().auth;
  const [{ data: assurance, error: assuranceError }, { data: factors, error: factorsError }] = await Promise.all([
    auth.mfa.getAuthenticatorAssuranceLevel(), auth.mfa.listFactors()
  ]);
  if (assuranceError) throw authError(assuranceError, "Não foi possível verificar o segundo fator.", 'mfa-assurance');
  if (factorsError) throw authError(factorsError, "Não foi possível listar os autenticadores.", 'mfa-factors');
  const verifiedFactors = (factors?.totp || []).filter(factor => factor.status === "verified");
  if (assurance?.currentLevel === "aal2") return { step: "ready", factors: verifiedFactors };
  return { step: verifiedFactors.length ? "challenge" : "enroll", factors: verifiedFactors };
}

export async function getAuthState() {
  const { data, error } = await supabase().auth.getSession();
  if (error) throw authError(error, "Não foi possível recuperar a sessão.", 'session-restore');
  if (!data.session) return { step: "login", factors: [] };
  return mfaState();
}

export async function clearAdminToken() {
  const { error } = await supabase().auth.signOut({ scope: "local" });
  if (error) throw authError(error, "Não foi possível sair.", 'sign-out');
}

export async function enrollMfa() {
  // Remove only abandoned enrollments created by this panel, never verified factors.
  const { data: factors, error: listError } = await supabase().auth.mfa.listFactors();
  if (listError) throw authError(listError, "Não foi possível consultar os autenticadores.", 'mfa-factors');
  for (const factor of factors.all || []) {
    if (factor.factor_type === "totp" && factor.status === "unverified" && factor.friendly_name === "Painel local Bom Pra Você") {
      const { error } = await supabase().auth.mfa.unenroll({ factorId: factor.id });
      if (error) throw authError(error, "Não foi possível reiniciar a configuração pendente.", 'mfa-unenroll');
    }
  }
  const { data, error } = await supabase().auth.mfa.enroll({ factorType: "totp", friendlyName: "Painel local Bom Pra Você" });
  if (error) throw authError(error, "Não foi possível iniciar a ativação do segundo fator.", 'mfa-enroll');
  const qr = data.totp.qr_code;
  const svg = qr.includes("<svg") ? qr.slice(qr.indexOf("<svg")) : null;
  return { factorId: data.id, qrCode: svg ? `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}` : qr, secret: data.totp.secret };
}

export async function verifyMfa(factorId, code) {
  const { error } = await supabase().auth.mfa.challengeAndVerify({ factorId, code });
  if (error) throw authError(error, "Código inválido ou expirado.", 'mfa-verify');
  const state = await mfaState();
  if (state.step !== "ready") throw new AdminApiError("AUTH", "O segundo fator não elevou a sessão para AAL2.");
  return state;
}

export async function authorizeAssistant(code) {
  const auth = supabase().auth;
  const { data: factors, error: factorsError } = await auth.mfa.listFactors();
  if (factorsError) throw authError(factorsError, "Não foi possível consultar o autenticador.", "assistant-mfa-factors");
  const factor = (factors?.totp || []).find((item) => item.status === "verified");
  if (!factor) throw new AdminApiError("AUTH", "Configure o autenticador do celular antes de ativar o modo assistido.");
  const { error } = await auth.mfa.challengeAndVerify({ factorId: factor.id, code });
  if (error) throw authError(error, "Código inválido ou expirado.", "assistant-mfa-verify");
  const { data, error: sessionError } = await auth.getSession();
  if (sessionError || !data.session?.access_token) throw authError(sessionError, "Não foi possível confirmar a sessão protegida.", "assistant-session");
  return data.session.access_token;
}

async function request(path, options = {}) {
  const config = apiConfig();
  if (!config.ready) throw new AdminApiError("UNAVAILABLE", "Configure a conexão do Supabase para usar o painel.");
  const { data, error } = await supabase().auth.getSession();
  if (error || !data.session?.access_token) {const problem=new AdminApiError("AUTH", "Sua sessão expirou. Entre novamente.");logPanelError('session-required',problem);throw problem;}
  let response;
  try { response = await fetch(`${config.url}${path}`, {
    ...options,
    headers: { apikey: config.key, Authorization: `Bearer ${data.session.access_token}`, ...options.headers },
  }); } catch (cause) {const problem=new AdminApiError('NETWORK','Não foi possível conectar ao serviço. Confira a internet e tente novamente.');problem.cause=cause;logPanelError('api-request',problem);throw problem;}
  if (!response.ok) {
    let message = "Não foi possível concluir a operação.";
    let remoteCode;
    try { const body=await response.json();message=body?.message || message;remoteCode=body?.code; } catch {}
    const guidance={401:'Sua sessão expirou. Entre novamente.',403:'Sua conta não tem permissão para esta operação.',409:'Os dados mudaram no servidor. Confira o estado atual antes de tentar novamente.',429:'Muitas tentativas em pouco tempo. Aguarde e tente novamente.'};
    const friendly=response.status>=500?'O serviço falhou. Tente novamente em instantes.':guidance[response.status]||message;
    const problem=new AdminApiError(response.status === 401 ? "AUTH" : "REQUEST", friendly, response.status);
    problem.remoteCode=remoteCode;problem.requestId=response.headers?.get?.('x-request-id')||undefined;
    logPanelError('api-request',problem);throw problem;
  }
  return response;
}

export async function productCampaignRequest(action, campaign, expectedRevision=0, onProgress) {
  if(action==='publish') campaign=await prepareCampaignImages(campaign,async payload=>{
    const binary=payload instanceof Blob;
    const response=await request('/functions/v1/product-showcase',{method:'POST',headers:{'Content-Type':binary?payload.type:'application/json'},body:binary?payload:JSON.stringify(payload)});
    return response.json();
  },onProgress);
  const response=await request('/functions/v1/product-showcase',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action,campaign_id:campaign?.id,expected_revision:expectedRevision,campaign})});
  return response.json();
}

export function changedProductFields(base={},product={}){
  const patch={revision:product.revision};
  const localImageMetadata=new Set(['imageWidth','imageHeight','imageOptimizationVersion']);
  for(const key of new Set([...Object.keys(base),...Object.keys(product)])){
    if(['id','revision','remoteRevision'].includes(key)||localImageMetadata.has(key))continue;
    if(JSON.stringify(base[key])!==JSON.stringify(product[key]))patch[key]=product[key];
  }
  return patch;
}

export async function productCatalogRequest(action, product, expectedRevision=0, onProgress, baseProduct) {
  if(action==='product_list'){
    const response=await request('/functions/v1/product-showcase',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action})});
    return response.json();
  }
  let patch=action==='product_patch'?changedProductFields(baseProduct,product):null;
  const needsImageUpload=action!=='product_patch'||typeof patch.image==='string'&&patch.image.startsWith('data:');
  const prepared=needsImageUpload?await prepareCampaignImages({items:[{id:product.id,priceCents:1,unit:'un',expiresOn:'2099-12-31',product}]},async payload=>{
    const binary=payload instanceof Blob;
    const response=await request('/functions/v1/product-showcase',{method:'POST',headers:{'Content-Type':binary?payload.type:'application/json'},body:binary?payload:JSON.stringify(payload)});
    return response.json();
  },onProgress):null;
  if(action==='product_patch'&&prepared)patch={...patch,image:prepared.items[0].product.image,imageSmall:prepared.items[0].product.imageSmall};
  const body=action==='product_patch'?{action,campaign_id:product.id,expected_revision:expectedRevision,patch}:{action:'product_save',campaign_id:product.id,expected_revision:expectedRevision,product:prepared.items[0].product};
  const response=await request('/functions/v1/product-showcase',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
  return response.json();
}

export async function signIn(email, password) {
  const { data, error } = await supabase().auth.signInWithPassword({ email, password });
  if (error || !data.session) throw authError(error, "Não foi possível iniciar a sessão.", 'sign-in');
  return mfaState();
}

export async function updatePassword(password) {
  const { data, error } = await supabase().auth.updateUser({ password });
  if (error) throw authError(error, "Não foi possível trocar a senha.", 'password-update');
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
export async function listSocialPublications() {
  const response = await request("/functions/v1/promotion-admin", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "social_list" }) });
  return (await response.json())?.publications || [];
}
export async function retrySocialPublication(publicationId) {
  const response = await request("/functions/v1/promotion-admin", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "social_retry", publication_id: publicationId }) });
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
