import { createClient } from "@supabase/supabase-js";

type Row = Record<string, unknown>;

const BASE_REVIEWS = [
  "math-correctness",
  "age-appropriateness",
  "answer-uniqueness",
  "translation-ko",
  "translation-en",
  "rights",
  "scoring-rubric",
];
const HASH = /^[a-f0-9]{64}$/;
const ITEM_ID = /^qst-bnk-[a-z0-9]{16}$/;

function allowedOrigins(): Set<string> {
  try {
    const values = JSON.parse(
      Deno.env.get("GFIELD_BOARDING_ALLOWED_ORIGINS") || "[]",
    );
    return new Set(
      Array.isArray(values)
        ? values.filter((value): value is string => typeof value === "string")
        : [],
    );
  } catch (_) {
    return new Set();
  }
}

function isAllowedOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  return !origin || allowedOrigins().has(origin);
}

function headers(request: Request): Headers {
  const result = new Headers({
    "access-control-allow-headers":
      "authorization, apikey, content-type, x-client-info",
    "access-control-allow-methods": "POST, OPTIONS",
    "cache-control": "no-store",
    "content-type": "application/json; charset=utf-8",
    "vary": "Origin",
    "x-content-type-options": "nosniff",
  });
  const origin = request.headers.get("origin") || "";
  if (allowedOrigins().has(origin)) {
    result.set("access-control-allow-origin", origin);
  }
  return result;
}

function json(request: Request, status: number, payload: Row): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: headers(request),
  });
}

function bearer(request: Request): string {
  const value = request.headers.get("authorization") || "";
  return value.startsWith("Bearer ") ? value.slice(7) : "";
}

function secretKey(): string {
  return Deno.env.get("SUPABASE_SECRET_KEY") ||
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
}

function asRecord(value: unknown): Row {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("release_input_invalid");
  }
  return value as Row;
}

function assertText(value: unknown, code = "release_input_invalid"): string {
  if (typeof value !== "string" || !value || value !== value.trim()) {
    throw new Error(code);
  }
  return value;
}

function canonicalize(value: unknown): string {
  if (
    value === null || typeof value === "boolean" || typeof value === "number" ||
    typeof value === "string"
  ) return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalize).join(",")}]`;
  const record = asRecord(value);
  return `{${
    Object.keys(record).sort().map((key) =>
      `${JSON.stringify(key)}:${canonicalize(record[key])}`
    ).join(",")
  }}`;
}

async function sha256(value: unknown): Promise<string> {
  const bytes = new TextEncoder().encode(canonicalize(value));
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", bytes));
  return Array.from(digest).map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function base64Url(bytes: Uint8Array): string {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(
    /=+$/g,
    "",
  );
}

function releaseId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  return `rel-bnk-${
    Array.from(bytes).map((byte) => byte.toString(16).padStart(2, "0")).join("")
  }`;
}

function requiredReviewTypes(publicPayload: Row): string[] {
  const required = [...BASE_REVIEWS];
  const assets = Array.isArray(publicPayload.assets)
    ? publicPayload.assets
    : [];
  if (assets.length) required.push("visual-evidence", "asset-rights");
  if (JSON.stringify(publicPayload).includes('"zh-Hans"')) {
    required.push("translation-zh-Hans");
  }
  return required;
}

async function requireActiveAdmin(request: Request) {
  const token = bearer(request);
  const url = Deno.env.get("SUPABASE_URL") || "";
  const publicKey = Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ||
    Deno.env.get("SUPABASE_ANON_KEY") || "";
  const serviceKey = secretKey();
  if (!token || !url || !publicKey || !serviceKey) {
    throw new Error("authentication_required");
  }
  const userClient = createClient(url, publicKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: { headers: { Authorization: `Bearer ${token}` } },
  });
  const service = createClient(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });
  const { data, error } = await userClient.auth.getUser(token);
  if (error || !data.user || data.user.is_anonymous) {
    throw new Error("authentication_required");
  }
  const { data: account, error: accountError } = await service
    .from("gfield_math_accounts")
    .select("role,status")
    .eq("user_id", data.user.id)
    .maybeSingle();
  if (
    accountError || !account || account.status !== "active" ||
    account.role !== "admin"
  ) throw new Error("admin_required");
  return { service, userId: data.user.id };
}

async function assertExpectedHash(
  payload: unknown,
  expected: unknown,
  code: string,
): Promise<string> {
  const hash = assertText(expected, code);
  if (!HASH.test(hash) || await sha256(payload) !== hash) throw new Error(code);
  return hash;
}

async function signManifest(
  manifest: Row,
): Promise<{ signature: string; keyId: string }> {
  const rawKey = Deno.env.get("GFIELD_BOARDING_SIGNING_PRIVATE_JWK") || "";
  const keyId = Deno.env.get("GFIELD_BOARDING_SIGNING_KEY_ID") || "";
  if (!rawKey || !keyId) throw new Error("signer_not_configured");
  let jwk: JsonWebKey;
  try {
    jwk = JSON.parse(rawKey) as JsonWebKey;
  } catch (_) {
    throw new Error("signer_not_configured");
  }
  const key = await crypto.subtle.importKey(
    "jwk",
    jwk,
    { name: "Ed25519" },
    false,
    ["sign"],
  );
  const bytes = new TextEncoder().encode(canonicalize(manifest));
  const signature = new Uint8Array(
    await crypto.subtle.sign({ name: "Ed25519" }, key, bytes),
  );
  return { signature: base64Url(signature), keyId };
}

async function signItemRelease(request: Request, body: Row): Promise<Row> {
  const itemId = assertText(body.itemId);
  const itemVersion = body.itemVersion;
  if (
    !ITEM_ID.test(itemId) || !Number.isInteger(itemVersion) ||
    (itemVersion as number) < 1
  ) throw new Error("release_input_invalid");
  const { service, userId } = await requireActiveAdmin(request);
  const { data: item, error: itemError } = await service
    .from("gfield_math_private_item_revisions")
    .select(
      "item_id,item_version,author_user_id,visibility_class,public_payload,private_scoring_payload,rubric_payload,public_payload_sha256,private_scoring_sha256,rubric_sha256,release_state",
    )
    .eq("item_id", itemId)
    .eq("item_version", itemVersion)
    .maybeSingle();
  if (itemError || !item || item.release_state !== "in-review") {
    throw new Error("release_not_ready");
  }

  const publicPayload = asRecord(item.public_payload);
  const privatePayload = asRecord(item.private_scoring_payload);
  const publicHash = await assertExpectedHash(
    publicPayload,
    item.public_payload_sha256,
    "public_hash_invalid",
  );
  const privateHash = await assertExpectedHash(
    privatePayload,
    item.private_scoring_sha256,
    "private_hash_invalid",
  );
  const rubricHash = item.rubric_payload == null
    ? null
    : await assertExpectedHash(
      asRecord(item.rubric_payload),
      item.rubric_sha256,
      "rubric_hash_invalid",
    );

  const { data: bindings, error: bindingError } = await service
    .from("gfield_math_private_item_rights_bindings")
    .select("asset_key,rights_record_id,rights_version")
    .eq("item_id", itemId)
    .eq("item_version", itemVersion);
  if (bindingError || !Array.isArray(bindings)) {
    throw new Error("rights_unavailable");
  }
  const assets = Array.isArray(publicPayload.assets)
    ? publicPayload.assets
    : [];
  const expectedAssetKeys = ["__item__"].concat(
    assets.map((asset) =>
      assertText(asRecord(asset).assetId, "rights_unavailable")
    ),
  );
  if (
    new Set(expectedAssetKeys).size !== expectedAssetKeys.length ||
    bindings.length !== expectedAssetKeys.length ||
    expectedAssetKeys.some((key) =>
      !bindings.some((binding) => binding.asset_key === key)
    )
  ) {
    throw new Error("rights_unavailable");
  }
  const rightsBindings: Row[] = [];
  for (const binding of bindings) {
    const { data: rights, error: rightsError } = await service
      .from("gfield_math_private_rights_records")
      .select(
        "rights_record_id,rights_version,item_id,item_version,asset_id,rights_payload,rights_record_sha256,decision,expires_at",
      )
      .eq("rights_record_id", binding.rights_record_id)
      .eq("rights_version", binding.rights_version)
      .maybeSingle();
    if (
      rightsError || !rights || rights.decision !== "approved" ||
      rights.item_id !== itemId || rights.item_version !== itemVersion ||
      (rights.expires_at && new Date(rights.expires_at).getTime() <= Date.now())
    ) throw new Error("rights_unavailable");
    if (
      (binding.asset_key === "__item__" && rights.asset_id !== null) ||
      (binding.asset_key !== "__item__" &&
        rights.asset_id !== binding.asset_key)
    ) throw new Error("rights_unavailable");
    const rightsHash = await assertExpectedHash(
      asRecord(rights.rights_payload),
      rights.rights_record_sha256,
      "rights_hash_invalid",
    );
    rightsBindings.push({
      assetKey: binding.asset_key,
      rightsRecordId: rights.rights_record_id,
      rightsVersion: rights.rights_version,
      rightsRecordSha256: rightsHash,
    });
  }

  const { data: reviews, error: reviewError } = await service
    .from("gfield_math_private_review_records")
    .select(
      "review_id,review_type,review_payload,review_record_sha256,reviewer_user_id",
    )
    .eq("item_id", itemId)
    .eq("item_version", itemVersion)
    .eq("decision", "approved");
  if (reviewError || !Array.isArray(reviews)) {
    throw new Error("reviews_unavailable");
  }
  const required = requiredReviewTypes(publicPayload);
  if (
    required.some((type) =>
      !reviews.some((review) => review.review_type === type)
    )
  ) throw new Error("reviews_unavailable");
  const reviewerIds = [
    ...new Set(reviews.map((review) => review.reviewer_user_id)),
  ];
  const { data: reviewers, error: reviewersError } = await service
    .from("gfield_math_accounts")
    .select("user_id,role,status")
    .in("user_id", reviewerIds);
  if (
    reviewersError || !Array.isArray(reviewers) ||
    reviewers.length !== reviewerIds.length
  ) throw new Error("reviews_unavailable");
  const reviewerMap = new Map(
    reviewers.map((reviewer) => [reviewer.user_id, reviewer]),
  );
  const reviewBindings: Row[] = [];
  const rightsByAssetKey = new Map(
    rightsBindings.map((binding) => [String(binding.assetKey), binding]),
  );
  const reviewedRightsAssetKeys = new Set<string>();
  for (const review of reviews) {
    if (review.reviewer_user_id === item.author_user_id) {
      throw new Error("reviews_unavailable");
    }
    const reviewer = reviewerMap.get(review.reviewer_user_id);
    if (
      !reviewer || reviewer.status !== "active" ||
      !["teacher", "admin"].includes(reviewer.role)
    ) throw new Error("reviews_unavailable");
    const payload = asRecord(review.review_payload);
    const reviewHash = await assertExpectedHash(
      payload,
      review.review_record_sha256,
      "review_hash_invalid",
    );
    if (
      payload.reviewedPublicHash !== publicHash ||
      (["math-correctness", "answer-uniqueness", "scoring-rubric"].includes(
        review.review_type,
      ) && payload.reviewedPrivateHash !== privateHash) ||
      (review.review_type === "scoring-rubric" &&
        payload.reviewedRubricHash !== rubricHash)
    ) throw new Error("reviews_unavailable");
    if (
      review.review_type === "rights" || review.review_type === "asset-rights"
    ) {
      const assetKey = assertText(payload.assetKey, "reviews_unavailable");
      const expectedRights = rightsByAssetKey.get(assetKey);
      if (
        !expectedRights ||
        payload.rightsRecordId !== expectedRights.rightsRecordId ||
        payload.rightsVersion !== expectedRights.rightsVersion ||
        payload.reviewedRightsHash !== expectedRights.rightsRecordSha256 ||
        (review.review_type === "rights" && assetKey !== "__item__") ||
        (review.review_type === "asset-rights" && assetKey === "__item__")
      ) throw new Error("reviews_unavailable");
      reviewedRightsAssetKeys.add(assetKey);
    }
    reviewBindings.push({
      reviewId: review.review_id,
      type: review.review_type,
      reviewRecordSha256: reviewHash,
    });
  }
  if (
    !reviewedRightsAssetKeys.has("__item__") ||
    expectedAssetKeys.some((assetKey) =>
      assetKey !== "__item__" && !reviewedRightsAssetKeys.has(assetKey)
    )
  ) {
    throw new Error("reviews_unavailable");
  }

  const signedAt = new Date().toISOString();
  const manifest: Row = {
    schemaVersion: "gfield-boarding-release-manifest-v1",
    releaseId: releaseId(),
    itemId,
    itemVersion,
    visibilityClass: item.visibility_class,
    publicPayloadSha256: publicHash,
    privateScoringSha256: privateHash,
    rubricSha256: rubricHash,
    rightsBindings: rightsBindings.sort((left, right) =>
      String(left.assetKey).localeCompare(String(right.assetKey))
    ),
    reviewBindings: reviewBindings.sort((left, right) =>
      String(left.reviewId).localeCompare(String(right.reviewId))
    ),
    signedAt,
    signedBy: userId,
  };
  const manifestSha256 = await sha256(manifest);
  const signed = await signManifest(manifest);
  const { data: committed, error: commitError } = await service.rpc(
    "gfield_math_commit_signed_release",
    {
      p_release_id: manifest.releaseId,
      p_item_id: itemId,
      p_item_version: itemVersion,
      p_manifest_payload: manifest,
      p_manifest_sha256: manifestSha256,
      p_signature_base64url: signed.signature,
      p_signing_key_id: signed.keyId,
      p_signed_by: userId,
      p_signed_at: signedAt,
    },
  );
  if (commitError || committed !== true) {
    throw new Error("release_write_failed");
  }
  return {
    releaseId: manifest.releaseId,
    itemId,
    itemVersion,
    publicPayloadSha256: publicHash,
    releaseState: "signed",
  };
}

Deno.serve(async (request) => {
  if (request.method === "OPTIONS") {
    return isAllowedOrigin(request)
      ? new Response("ok", { headers: headers(request) })
      : json(request, 403, { error: "origin_not_allowed" });
  }
  if (request.method !== "POST" || !isAllowedOrigin(request)) {
    return json(request, 403, { error: "request_not_allowed" });
  }
  try {
    const body = asRecord(await request.json());
    if (body.action !== "sign-item-release") {
      return json(request, 404, { error: "action_not_found" });
    }
    return json(request, 200, await signItemRelease(request, body));
  } catch (error) {
    const code = error instanceof Error ? error.message : "server_not_ready";
    const status = code === "authentication_required"
      ? 401
      : code === "admin_required"
      ? 403
      : code === "release_input_invalid"
      ? 400
      : code === "signer_not_configured"
      ? 503
      : 503;
    return json(request, status, {
      error:
        ["authentication_required", "admin_required", "release_input_invalid"]
            .includes(code)
          ? code
          : "server_not_ready",
    });
  }
});
