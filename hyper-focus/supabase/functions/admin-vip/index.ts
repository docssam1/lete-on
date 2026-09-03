// deno-lint-ignore no-import-prefix
import { createClient } from "npm:@supabase/supabase-js@2.112.3";

const ALLOWED_ORIGINS = new Set([
  "https://lete-on.gfieldacademy.net",
  "http://127.0.0.1:4177",
  "http://localhost:4177",
  "http://127.0.0.1:41873",
  "http://localhost:41873"
]);
const CONTENT_ID_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const KINDS = new Set(["resources", "seminar", "column", "magazine"]);
const STATUSES = new Set(["draft", "review_pending", "reviewed", "published", "archived"]);
const ASSET_KINDS = new Set(["cover", "video", "pdf", "attachment"]);
const MIME_LIMITS: Record<string, number> = Object.freeze({
  "application/pdf": 100 * 1024 * 1024,
  "image/jpeg": 25 * 1024 * 1024,
  "image/png": 25 * 1024 * 1024,
  "image/webp": 25 * 1024 * 1024,
  "video/mp4": 500 * 1024 * 1024
});

function environmentKey(mapName: string, singleName: string, legacyName: string): string {
  const mapValue = Deno.env.get(mapName);
  if (mapValue) {
    try {
      const parsed = JSON.parse(mapValue) as Record<string, unknown>;
      if (typeof parsed.default === "string") return parsed.default;
    } catch (_) {}
  }
  return Deno.env.get(singleName) || Deno.env.get(legacyName) || "";
}

function responseHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get("origin") || "";
  return {
    "access-control-allow-origin": ALLOWED_ORIGINS.has(origin) ? origin : "https://lete-on.gfieldacademy.net",
    "access-control-allow-headers": "authorization, apikey, content-type, x-client-info",
    "access-control-allow-methods": "POST, OPTIONS",
    "cache-control": "no-store",
    "content-type": "application/json; charset=utf-8",
    "vary": "Origin",
    "x-content-type-options": "nosniff"
  };
}

function json(request: Request, status: number, body: Record<string, unknown>): Response {
  return new Response(JSON.stringify(body), { status, headers: responseHeaders(request) });
}

async function readJsonObject(request: Request, maximumBytes = 65536): Promise<Record<string, unknown> | null> {
  const declared = Number(request.headers.get("content-length") || 0);
  if (Number.isFinite(declared) && declared > maximumBytes) return null;
  try {
    const text = await request.text();
    if (new TextEncoder().encode(text).byteLength > maximumBytes) return null;
    const value = JSON.parse(text);
    return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, unknown> : null;
  } catch (_) {
    return null;
  }
}

function decodeClaims(token: string): Record<string, unknown> | null {
  try {
    const segment = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(segment.padEnd(Math.ceil(segment.length / 4) * 4, "=")));
  } catch (_) {
    return null;
  }
}

function text(value: unknown, maximum: number): string {
  return String(value || "").normalize("NFKC").trim().slice(0, maximum);
}

function tags(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return [...new Set(value.map(item => text(item, 30)).filter(Boolean))].slice(0, 12);
}

function validAsset(kind: string, mimeType: string, byteSize: number): boolean {
  if (!ASSET_KINDS.has(kind) || !MIME_LIMITS[mimeType] || !Number.isInteger(byteSize) || byteSize < 1 || byteSize > MIME_LIMITS[mimeType]) return false;
  if (kind === "cover") return mimeType.startsWith("image/");
  if (kind === "video") return mimeType === "video/mp4";
  if (kind === "pdf") return mimeType === "application/pdf";
  return true;
}

function expectedObjectPath(contentId: string, assetKind: string, uploadId: string): string {
  return assetKind === "attachment"
    ? `${contentId}/attachment/${uploadId}`
    : `${contentId}/${assetKind}`;
}

Deno.serve(async request => {
  const origin = request.headers.get("origin") || "";
  if (request.method === "OPTIONS") {
    return ALLOWED_ORIGINS.has(origin) ? new Response("ok", { headers: responseHeaders(request) }) : json(request, 403, { error: "origin_not_allowed" });
  }
  if (request.method !== "POST" || (origin && !ALLOWED_ORIGINS.has(origin))) return json(request, 403, { error: "request_not_allowed" });

  const authorization = request.headers.get("authorization") || "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const publishableKey = environmentKey("SUPABASE_PUBLISHABLE_KEYS", "SUPABASE_PUBLISHABLE_KEY", "SUPABASE_ANON_KEY");
  const secretKey = environmentKey("SUPABASE_SECRET_KEYS", "SUPABASE_SECRET_KEY", "SUPABASE_SERVICE_ROLE_KEY");
  if (!token || !supabaseUrl || !publishableKey || !secretKey) return json(request, 401, { error: "authentication_required" });

  const userClient = createClient(supabaseUrl, publishableKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { headers: { Authorization: authorization } }
  });
  const service = createClient(supabaseUrl, secretKey, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } });
  const { data: authData, error: authError } = await userClient.auth.getUser(token);
  const claims = decodeClaims(token);
  const metadata = claims?.app_metadata as Record<string, unknown> | undefined;
  if (authError || !authData.user || authData.user.is_anonymous || metadata?.hf_role !== "admin" || authData.user.app_metadata?.hf_role !== "admin") {
    return json(request, 403, { error: "admin_access_required" });
  }
  const { data: staff, error: staffError } = await service.from("hf_admin_accounts")
    .select("role,account_status,authorization_changed_at").eq("user_id", authData.user.id).maybeSingle();
  const issuedAtMs = Number(claims?.iat || 0) * 1000;
  const changedAtMs = Date.parse(String(staff?.authorization_changed_at || ""));
  if (staffError || staff?.role !== "admin" || staff.account_status !== "active" || !Number.isFinite(issuedAtMs) || !Number.isFinite(changedAtMs) || issuedAtMs < changedAtMs) {
    return json(request, 403, { error: "admin_access_required" });
  }

  const payload = await readJsonObject(request);
  if (!payload) return json(request, 400, { error: "invalid_request" });
  const action = String(payload.action || "");

  try {
    if (action === "list") {
      const [contentResult, relationResult, assetResult] = await Promise.all([
        service.from("hf_vip_contents").select("id,kind,title,summary,content_date,tags,body_html,status,published_at,updated_at").order("updated_at", { ascending: false }),
        service.from("hf_vip_relations").select("content_id,related_content_id,sort_order").order("sort_order", { ascending: true }),
        service.from("hf_vip_assets").select("id,content_id,asset_kind,page_no,mime_type,created_at").order("created_at", { ascending: true })
      ]);
      if (contentResult.error || relationResult.error || assetResult.error) throw new Error("vip_list_failed");
      return json(request, 200, { contents: contentResult.data || [], relations: relationResult.data || [], assets: assetResult.data || [] });
    }

    if (action === "saveContent") {
      const id = text(payload.id, 80).toLowerCase();
      const kind = text(payload.kind, 20);
      const title = text(payload.title, 120);
      const summary = text(payload.summary, 500);
      const bodyText = text(payload.bodyText, 30000);
      const status = text(payload.status, 20);
      const contentDate = /^\d{4}-\d{2}-\d{2}$/.test(String(payload.contentDate || "")) ? String(payload.contentDate) : null;
      if (!CONTENT_ID_RE.test(id) || !KINDS.has(kind) || !title || !STATUSES.has(status)) return json(request, 400, { error: "invalid_content" });
      const { data: existing, error: existingError } = await service.from("hf_vip_contents").select("id,published_at,created_by").eq("id", id).maybeSingle();
      if (existingError) throw existingError;
      const row = {
        id, kind, title, summary, content_date: contentDate, tags: tags(payload.tags), body_html: bodyText, status,
        published_at: status === "published" ? existing?.published_at || new Date().toISOString() : null,
        created_by: existing?.created_by || authData.user.id,
        updated_by: authData.user.id
      };
      const { data: saved, error } = await service.from("hf_vip_contents").upsert(row).select("id,status,published_at").single();
      if (error) throw error;
      return json(request, 200, { content: saved });
    }

    if (action === "saveRelations") {
      const contentId = text(payload.contentId, 80).toLowerCase();
      const relatedIds = [...new Set((Array.isArray(payload.relatedIds) ? payload.relatedIds : []).map(value => text(value, 80).toLowerCase()))]
        .filter(value => value !== contentId).slice(0, 12);
      if (!CONTENT_ID_RE.test(contentId) || relatedIds.some(value => !CONTENT_ID_RE.test(value))) return json(request, 400, { error: "invalid_relations" });
      const required = [contentId, ...relatedIds];
      const { data: found, error: foundError } = await service.from("hf_vip_contents").select("id").in("id", required);
      if (foundError || new Set((found || []).map(row => row.id)).size !== required.length) return json(request, 409, { error: "related_content_missing" });
      const { error: deleteError } = await service.from("hf_vip_relations").delete().eq("content_id", contentId);
      if (deleteError) throw deleteError;
      if (relatedIds.length) {
        const { error: insertError } = await service.from("hf_vip_relations").insert(relatedIds.map((relatedId, index) => ({ content_id: contentId, related_content_id: relatedId, sort_order: index })));
        if (insertError) throw insertError;
      }
      return json(request, 200, { relatedIds });
    }

    if (action === "createUpload") {
      const contentId = text(payload.contentId, 80).toLowerCase();
      const assetKind = text(payload.assetKind, 20);
      const mimeType = text(payload.mimeType, 80).toLowerCase();
      const byteSize = Number(payload.byteSize);
      if (!CONTENT_ID_RE.test(contentId) || !validAsset(assetKind, mimeType, byteSize)) return json(request, 400, { error: "invalid_asset" });
      const { data: content } = await service.from("hf_vip_contents").select("id").eq("id", contentId).maybeSingle();
      if (!content) return json(request, 404, { error: "content_not_found" });
      const uploadId = assetKind === "attachment" ? crypto.randomUUID() : assetKind;
      const objectPath = expectedObjectPath(contentId, assetKind, uploadId);
      const { data: signed, error } = await service.storage.from("hf-vip-private").createSignedUploadUrl(objectPath, { upsert: true });
      if (error || !signed?.token) throw error || new Error("upload_sign_failed");
      return json(request, 200, { bucket: "hf-vip-private", objectPath, uploadToken: signed.token, uploadId });
    }

    if (action === "finalizeUpload") {
      const contentId = text(payload.contentId, 80).toLowerCase();
      const assetKind = text(payload.assetKind, 20);
      const mimeType = text(payload.mimeType, 80).toLowerCase();
      const byteSize = Number(payload.byteSize);
      const uploadId = text(payload.uploadId, 80);
      const objectPath = text(payload.objectPath, 240);
      if (!CONTENT_ID_RE.test(contentId) || !validAsset(assetKind, mimeType, byteSize) || objectPath !== expectedObjectPath(contentId, assetKind, uploadId)) {
        return json(request, 400, { error: "invalid_asset" });
      }
      if (assetKind === "attachment" && !UUID_RE.test(uploadId)) return json(request, 400, { error: "invalid_asset" });
      const slash = objectPath.lastIndexOf("/");
      const folder = objectPath.slice(0, slash);
      const fileName = objectPath.slice(slash + 1);
      const { data: objects, error: listError } = await service.storage.from("hf-vip-private").list(folder, { limit: 20, search: fileName });
      const stored = (objects || []).find(item => item.name === fileName);
      const storedSize = Number(stored?.metadata?.size || 0);
      const storedMime = String(stored?.metadata?.mimetype || stored?.metadata?.contentType || "").toLowerCase();
      if (listError || !stored || storedSize !== byteSize || (storedMime && storedMime !== mimeType)) return json(request, 409, { error: "uploaded_asset_mismatch" });

      let existing: { id: string } | null = null;
      if (assetKind !== "attachment") {
        const result = await service.from("hf_vip_assets").select("id").eq("content_id", contentId).eq("asset_kind", assetKind).maybeSingle();
        if (result.error) throw result.error;
        existing = result.data;
      }
      const assetRow = { content_id: contentId, asset_kind: assetKind, page_no: null, bucket_id: "hf-vip-private", object_path: objectPath, mime_type: mimeType };
      const result = existing
        ? await service.from("hf_vip_assets").update(assetRow).eq("id", existing.id).select("id,content_id,asset_kind,mime_type").single()
        : await service.from("hf_vip_assets").insert(assetRow).select("id,content_id,asset_kind,mime_type").single();
      if (result.error) throw result.error;
      return json(request, 200, { asset: result.data });
    }

    return json(request, 400, { error: "unsupported_action" });
  } catch (error) {
    console.error("admin-vip failed", error);
    return json(request, 503, { error: "admin_vip_unavailable" });
  }
});
