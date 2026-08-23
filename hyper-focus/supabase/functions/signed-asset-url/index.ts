// deno-lint-ignore no-import-prefix
import { createClient } from "npm:@supabase/supabase-js@2.112.3";

const ALLOWED_ORIGINS = new Set([
  "https://lete-on.gfieldacademy.net",
  "http://127.0.0.1:4177",
  "http://localhost:4177",
  "http://127.0.0.1:41873",
  "http://localhost:41873"
]);
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SIGNED_URL_SECONDS = 180;

function environmentKey(mapName: string, singleName: string, legacyName: string): string {
  const mapValue = Deno.env.get(mapName);
  if (mapValue) {
    try {
      const parsed = JSON.parse(mapValue) as Record<string, unknown>;
      if (typeof parsed.default === "string") return parsed.default;
    } catch (_) {
      // Ignore malformed optional key maps and fall back to named variables.
    }
  }
  return Deno.env.get(singleName) || Deno.env.get(legacyName) || "";
}

async function readJsonObject(
  request: Request,
  maximumBytes: number
): Promise<{ value?: Record<string, unknown>; error?: "too_large" | "invalid" }> {
  const declared = Number(request.headers.get("content-length") || 0);
  if (Number.isFinite(declared) && declared > maximumBytes) return { error: "too_large" };
  if (!request.body) return { error: "invalid" };
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > maximumBytes) {
        await reader.cancel();
        return { error: "too_large" };
      }
      chunks.push(value);
    }
  } catch (_) {
    return { error: "invalid" };
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(total);
  let offset = 0;
  chunks.forEach(chunk => { bytes.set(chunk, offset); offset += chunk.byteLength; });
  try {
    const parsed = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? { value: parsed as Record<string, unknown> }
      : { error: "invalid" };
  } catch (_) {
    return { error: "invalid" };
  }
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

Deno.serve(async request => {
  const origin = request.headers.get("origin") || "";
  if (request.method === "OPTIONS") {
    return ALLOWED_ORIGINS.has(origin)
      ? new Response("ok", { headers: responseHeaders(request) })
      : json(request, 403, { error: "origin_not_allowed" });
  }
  if (request.method !== "POST" || (origin && !ALLOWED_ORIGINS.has(origin))) {
    return json(request, 403, { error: "request_not_allowed" });
  }
  const authorization = request.headers.get("authorization") || "";
  const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
  const publishableKey = environmentKey("SUPABASE_PUBLISHABLE_KEYS", "SUPABASE_PUBLISHABLE_KEY", "SUPABASE_ANON_KEY");
  const secretKey = environmentKey("SUPABASE_SECRET_KEYS", "SUPABASE_SECRET_KEY", "SUPABASE_SERVICE_ROLE_KEY");
  if (!token || !supabaseUrl || !publishableKey || !secretKey) {
    return json(request, 401, { error: "authentication_required" });
  }

  const userClient = createClient(supabaseUrl, publishableKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { headers: { Authorization: authorization } }
  });
  const serviceClient = createClient(supabaseUrl, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
  });

  const { data: authData, error: authError } = await userClient.auth.getUser(token);
  if (authError || !authData.user || authData.user.is_anonymous) {
    return json(request, 401, { error: "authentication_required" });
  }

  const { data: quotaAllowed, error: quotaError } = await serviceClient.rpc("hf_consume_asset_url_quota", {
    p_user_id: authData.user.id
  });
  if (quotaError) return json(request, 503, { error: "quota_check_failed" });
  if (quotaAllowed !== true) return json(request, 429, { error: "too_many_requests" });

  const parsedPayload = await readJsonObject(request, 4096);
  if (parsedPayload.error === "too_large") return json(request, 413, { error: "request_too_large" });
  if (!parsedPayload.value) return json(request, 400, { error: "invalid_request" });
  const payload = parsedPayload.value;
  const assetType = String(payload.assetType || "");
  const assetId = String(payload.assetId || "");
  if (!(["vip", "mock"].includes(assetType)) || !UUID_RE.test(assetId)) {
    return json(request, 400, { error: "invalid_request" });
  }

  const table = assetType === "vip" ? "hf_vip_assets" : "hf_mock_assets";
  const { data: visibleAsset, error: assetError } = await userClient
    .from(table)
    .select("id")
    .eq("id", assetId)
    .maybeSingle();
  if (assetError || !visibleAsset) return json(request, 404, { error: "asset_not_available" });

  // RLS proves visibility with the harmless id column. Bucket/object paths are
  // fetched only with the service role after that authorization decision.
  const serviceResult = assetType === "mock"
    ? await serviceClient.from("hf_mock_assets")
      .select("id,bucket_id,object_path,asset_kind")
      .eq("id", visibleAsset.id)
      .maybeSingle()
    : await serviceClient.from("hf_vip_assets")
      .select("id,bucket_id,object_path")
      .eq("id", visibleAsset.id)
      .maybeSingle();
  const serviceAssetError = serviceResult.error;
  const asset = serviceResult.data as null | {
    id: string;
    bucket_id: string;
    object_path: string;
    asset_kind?: string;
  };
  const expectedBucket = assetType === "mock" ? "hf-mock-private" : "hf-vip-private";
  if (serviceAssetError || !asset || asset.bucket_id !== expectedBucket) {
    return json(request, 404, { error: "asset_not_available" });
  }
  // Raw problem/answer JSON must pass secure-mock's checksum, revision and
  // schema sanitizers. Never expose those objects through the generic signer.
  if (assetType === "mock" && asset.asset_kind !== "cover") {
    return json(request, 404, { error: "asset_not_available" });
  }

  const { data: signed, error: signedError } = await serviceClient.storage
    .from(asset.bucket_id)
    .createSignedUrl(asset.object_path, SIGNED_URL_SECONDS);
  if (signedError || !signed?.signedUrl) return json(request, 503, { error: "asset_unavailable" });

  return json(request, 200, { url: signed.signedUrl, expiresIn: SIGNED_URL_SECONDS });
});
