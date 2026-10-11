import { projectUrl, rpc, serviceKey } from "../_shared/supabase.ts";

type Publication = { id: string; surface: "feed" | "story"; caption: string; public_path: string; container_id: string | null };

const GRAPH_VERSION = Deno.env.get("INSTAGRAM_GRAPH_API_VERSION");
const ACCOUNT_ID = Deno.env.get("INSTAGRAM_BUSINESS_ACCOUNT_ID");
const ACCESS_TOKEN = Deno.env.get("INSTAGRAM_ACCESS_TOKEN");
const WORKER_SECRET = Deno.env.get("INSTAGRAM_PUBLISHER_SECRET");

function configured() {
  return Boolean(GRAPH_VERSION && ACCOUNT_ID && ACCESS_TOKEN && WORKER_SECRET);
}

function unauthorized() {
  return new Response(JSON.stringify({ error: "UNAUTHORIZED" }), { status: 401, headers: { "Content-Type": "application/json" } });
}

function mediaUrl(path: string) {
  return `${projectUrl()}/storage/v1/object/public/promotion-public/${path.split("/").map(encodeURIComponent).join("/")}`;
}

async function graph(path: string, fields: Record<string, string>, method: "GET" | "POST" = "POST") {
  const body = new URLSearchParams({ ...fields, access_token: ACCESS_TOKEN! });
  const url = `https://graph.facebook.com/${GRAPH_VERSION}/${path}`;
  const response = await fetch(method === "GET" ? `${url}?${body}` : url, method === "GET" ? { method } : { method, body });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok || payload?.error) throw new Error(payload?.error?.message || "META_REQUEST_FAILED");
  return payload;
}

async function update(id: string, values: Record<string, unknown>) {
  const response = await fetch(`${projectUrl()}/rest/v1/bpv.social_publications?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { apikey: serviceKey(), Authorization: `Bearer ${serviceKey()}`, "Content-Type": "application/json", Prefer: "return=minimal" },
    body: JSON.stringify({ ...values, updated_at: new Date().toISOString() }),
  });
  if (!response.ok) throw new Error("DATABASE_UPDATE_FAILED");
}

async function defer(id: string, seconds: number) {
  await update(id, { status: "queued", locked_until: null, scheduled_at: new Date(Date.now() + seconds * 1000).toISOString() });
}

async function process(publication: Publication) {
  try {
    let containerId = publication.container_id;
    if (!containerId) {
      const fields: Record<string, string> = { image_url: mediaUrl(publication.public_path) };
      if (publication.surface === "story") fields.media_type = "STORIES";
      else if (publication.caption) fields.caption = publication.caption;
      const created = await graph(`${ACCOUNT_ID}/media`, fields);
      containerId = created.id;
      await update(publication.id, { container_id: containerId });
    }
    if (!containerId) throw new Error("CONTAINER_NOT_CREATED");
    const status = await graph(`${containerId}`, { fields: "status_code,status" }, "GET");
    if (status.status_code === "IN_PROGRESS") return defer(publication.id, 20);
    if (status.status_code !== "FINISHED") throw new Error(status.status || "MEDIA_NOT_READY");
    const published = await graph(`${ACCOUNT_ID}/media_publish`, { creation_id: containerId });
    const now = new Date();
    await update(publication.id, {
      status: "published", locked_until: null, external_media_id: published.id, published_at: now.toISOString(),
      expires_at: publication.surface === "story" ? new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString() : null,
      failure_code: null, failure_message: null,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message.slice(0, 500) : "META_REQUEST_FAILED";
    await update(publication.id, { status: "failed", locked_until: null, failure_code: "META_REQUEST_FAILED", failure_message: message });
  }
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response(JSON.stringify({ error: "METHOD_NOT_ALLOWED" }), { status: 405 });
  if (!configured() || req.headers.get("x-instagram-worker-secret") !== WORKER_SECRET) return unauthorized();
  const publications = await rpc<Publication[]>("bpv_claim_social_publications", { p_limit: 10 });
  await Promise.all(publications.map(process));
  return new Response(JSON.stringify({ processed: publications.length }), { headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
});
