import { failure, json, preflight, requireMethod } from "../_shared/http.ts";
import { projectUrl, rpc } from "../_shared/supabase.ts";

Deno.serve(async (req) => {
  try {
    if (req.method === "OPTIONS") return preflight(req);
    requireMethod(req, "GET");
    const meta = await rpc<{ server_time: string; version: string; next_change_at: string | null }>("bpv_public_promotions_meta", {});
    if (new URL(req.url).searchParams.get("meta") === "1") {
      return json(req, meta, 200, { "Cache-Control": "no-store" });
    }
    const data = await rpc<{ server_time: string; campaigns: Array<Record<string, unknown>> }>("bpv_public_promotions", {});
    const prefix = `${projectUrl()}/storage/v1/object/public/promotion-public/`;
    return json(req, {
      server_time: meta.server_time,
      version: meta.version,
      next_change_at: meta.next_change_at,
      campaigns: data.campaigns.map(({ public_path, thumbnail_path, ...campaign }) => ({
        ...campaign,
        file_url: prefix + encodeURI(String(public_path)),
        thumbnail_url: thumbnail_path ? prefix + encodeURI(String(thumbnail_path)) : undefined,
      })),
    });
  } catch (error) {
    return failure(req, error);
  }
});

