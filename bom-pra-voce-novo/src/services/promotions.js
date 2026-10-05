import { callPublicFunction, publicMediaUrl, PublicApiError } from "./publicApi";
const CACHE_KEY = "bpv:public-promotions:v1";

function parseMeta(data) {
  const serverTime = Date.parse(data?.server_time);
  const nextChangeAt = data?.next_change_at ? Date.parse(data.next_change_at) : null;
  if (!Number.isFinite(serverTime) || typeof data?.version !== "string" || !/^[a-f0-9]{32}$/.test(data.version) ||
      (nextChangeAt !== null && !Number.isFinite(nextChangeAt))) {
    throw new PublicApiError("INVALID_RESPONSE", "As ofertas não puderam ser verificadas.");
  }
  return { serverTime, version: data.version, nextChangeAt };
}

function readCache(version) {
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY));
    return cached?.version === version && cached?.payload ? cached.payload : null;
  } catch {
    clearPromotionsCache();
    return null;
  }
}

function writeCache(version, payload) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify({ version, payload })); } catch {}
}

export function clearPromotionsCache() {
  try { localStorage.removeItem(CACHE_KEY); } catch {}
}
export function parsePromotions(data) {
  const serverTime = Date.parse(data?.server_time);
  if (!Number.isFinite(serverTime) || !Array.isArray(data?.campaigns)) {
    throw new PublicApiError("INVALID_RESPONSE", "As ofertas não puderam ser verificadas.");
  }
  const campaigns = data.campaigns.map(item => {
    const starts = Date.parse(item.starts_at);
    const ends = Date.parse(item.ends_at);
    const url = publicMediaUrl(item.file_url);
    const thumbnail = item.thumbnail_url ? publicMediaUrl(item.thumbnail_url) : null;
    const categoryKey = ["meat-frozen", "home-baby", "grocery-drinks", "cleaning-beauty", "other"].includes(item.category_key) ? item.category_key : "other";
    const displayOrder = Number.isInteger(item.display_order) && item.display_order >= 0 && item.display_order <= 999 ? item.display_order : 100;
    if (!item.id || typeof item.title !== "string" || !item.title.trim() ||
        typeof item.conditions !== "string" || !item.conditions.trim() ||
        typeof item.summary !== "string" || !item.summary.trim() ||
        !Number.isFinite(starts) || !Number.isFinite(ends) || ends <= starts ||
        !url || (item.thumbnail_url && !thumbnail) ||
        !["application/pdf", "image/jpeg", "image/png", "image/webp"].includes(item.mime_type) ||
        !Number.isInteger(item.size_bytes) || item.size_bytes <= 0 || item.size_bytes > 10000000) {
      throw new PublicApiError("INVALID_RESPONSE", "As ofertas não puderam ser verificadas.");
    }
    return { ...item, category_key: categoryKey, display_order: displayOrder, file_url: url, thumbnail_url: thumbnail, starts, ends };
  });
  if (new Set(campaigns.map(item => item.id)).size !== campaigns.length)
    throw new PublicApiError("INVALID_RESPONSE", "As ofertas não puderam ser verificadas.");
  return { serverTime, campaigns: campaigns.filter(item => item.starts <= serverTime && item.ends > serverTime).sort((a, b) => a.display_order - b.display_order) };
}
export async function getPromotions(signal, retry = true) {
  const meta = parseMeta(await callPublicFunction("public-promotions", { signal, query: { meta: "1" } }));
  const cached = readCache(meta.version);
  if (cached) return { ...parsePromotions({ ...cached, server_time: new Date(meta.serverTime).toISOString() }), version: meta.version, nextChangeAt: meta.nextChangeAt, fromCache: true };
  clearPromotionsCache();
  const payload = await callPublicFunction("public-promotions", { signal });
  const result = parsePromotions(payload);
  if (payload.version !== meta.version) {
    clearPromotionsCache();
    if (retry) return getPromotions(signal, false);
    throw new PublicApiError("CONFLICT", "As ofertas foram atualizadas durante a consulta.", 409);
  }
  writeCache(meta.version, payload);
  return { ...result, version: meta.version, nextChangeAt: meta.nextChangeAt, fromCache: false };
}
