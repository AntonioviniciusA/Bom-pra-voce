import { sha256 } from "../_shared/crypto.ts";
import { authenticatedUser, download, remove, rpc, upload } from "../_shared/supabase.ts";
import { failure, HttpError, json, preflight, requireMethod, requireUuid } from "../_shared/http.ts";
import { validatePromotion } from "../_shared/validation.ts";

Deno.serve(async (req) => {
  const uploaded: Array<[string, string]> = [];
  try {
    if (req.method === "OPTIONS") return preflight(req);
    requireMethod(req, "POST");
    const user = await authenticatedUser(req);
    const type = req.headers.get("content-type") ?? "";
    if (type.includes("multipart/form-data")) {
      const form = await req.formData();
      if (form.get("action") !== "publish") throw new HttpError(400, "INVALID_ACTION", "Ação inválida.");
      const campaignId = requireUuid(String(form.get("campaign_id") ?? ""), "Campanha");
      const publicationKey = requireUuid(req.headers.get("idempotency-key"), "Chave de publicação");
      const expectedRevision = Number(form.get("expected_revision"));
      if (!Number.isSafeInteger(expectedRevision) || expectedRevision < 0) throw new HttpError(400, "INVALID_REVISION", "Revisão inválida.");
      const file = form.get("file");
      if (!(file instanceof File)) throw new HttpError(422, "FILE_REQUIRED", "Selecione o material.");
      const bytes = new Uint8Array(await file.arrayBuffer());
      const extension = validatePromotion(bytes, file.type);
      const versionId = publicationKey;
      const draftPath = `${campaignId}/${versionId}/source.${extension}`;
      const publicPath = `${campaignId}/${versionId}.${extension}`;
      const expectedHash = await sha256(bytes);
      for (const [bucket, path] of [["promotion-drafts", draftPath], ["promotion-public", publicPath]] as const) {
        try {
          await upload(bucket, path, bytes, file.type);
          uploaded.push([bucket, path]);
        } catch (error) {
          const existing = new Uint8Array(await download(bucket, path));
          if (await sha256(existing) !== expectedHash) throw error;
        }
      }
      const result = await rpc("bpv_publish_campaign", {
        p_actor: user.id, p_campaign_id: campaignId, p_expected_revision: expectedRevision,
        p_publication_key: publicationKey, p_draft_path: draftPath, p_public_path: publicPath,
        p_sha256: expectedHash, p_mime_type: file.type, p_size_bytes: bytes.length,
      });
      return json(req, result);
    }
    const body = await req.json();
    if (body?.action === "create") return json(req, await rpc("bpv_create_campaign", { p_actor: user.id, p_payload: body.campaign }), 201);
    if (body?.action === "withdraw") {
      return json(req, await rpc("bpv_withdraw_campaign", {
        p_actor: user.id, p_campaign_id: requireUuid(body.campaign_id, "Campanha"), p_expected_revision: body.expected_revision,
      }));
    }
    if (body?.action === "list") return json(req, await rpc("bpv_list_campaigns", { p_actor: user.id }));
    throw new HttpError(400, "INVALID_ACTION", "Ação inválida.");
  } catch (error) {
    for (const [bucket, path] of uploaded.reverse()) {
      try { await remove(bucket, [path]); } catch { console.error("Could not remove orphan promotion object", bucket, path); }
    }
    return failure(req, error);
  }
});

