import { authenticatedUser, download, rpc } from "../_shared/supabase.ts";
import { cors, failure, HttpError, json, preflight, requireMethod, requireUuid } from "../_shared/http.ts";

function safeDownloadName(value: string) {
  return value.replace(/[^A-Za-z0-9._-]/g, "_").slice(0, 120) || "curriculo.pdf";
}

Deno.serve(async (req) => {
  try {
    if (req.method === "OPTIONS") return preflight(req);
    requireMethod(req, "POST");
    const user = await authenticatedUser(req);
    const body = await req.json();
    if (body?.action === "list") {
      const before = body.before == null ? null : new Date(body.before);
      if (before && Number.isNaN(before.valueOf())) throw new HttpError(400, "INVALID_CURSOR", "Cursor inválido.");
      const beforeId = body.before_id == null ? null : requireUuid(body.before_id, "Cursor");
      if (beforeId && !before) throw new HttpError(400, "INVALID_CURSOR", "Cursor inválido.");
      return json(req, { applications: await rpc("bpv_list_applications_page", { p_actor: user.id, p_before: before?.toISOString() ?? null, p_before_id: beforeId, p_limit: body.limit ?? 50 }) });
    }
    if (body?.action === "download") {
      const access = await rpc<{ path: string; file_name: string; mime_type: string }>("bpv_authorize_application_download", {
        p_actor: user.id, p_application_id: requireUuid(body.application_id, "Candidatura"),
      });
      const bytes = await download("resumes-private", access.path);
      return new Response(bytes, {
        status: 200,
        headers: { ...cors(req), "Content-Type": access.mime_type, "Content-Disposition": `attachment; filename="${safeDownloadName(access.file_name)}"`, "Cache-Control": "no-store, private" },
      });
    }
    throw new HttpError(400, "INVALID_ACTION", "Ação inválida.");
  } catch (error) {
    return failure(req, error);
  }
});
