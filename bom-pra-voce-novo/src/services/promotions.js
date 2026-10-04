import { callPublicFunction, publicMediaUrl, PublicApiError } from "./publicApi";
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
export async function getPromotions(signal) {
  return parsePromotions(await callPublicFunction("public-promotions", { signal }));
}
