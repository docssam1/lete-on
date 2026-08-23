import { createClient } from "@supabase/supabase-js";

const PRODUCTION_ORIGIN = "https://lete-on.gfieldacademy.net";
const LOCAL_ORIGINS = new Set([
  "http://127.0.0.1:4177",
  "http://localhost:4177",
  "http://127.0.0.1:41873",
  "http://localhost:41873"
]);
const ACTIONS = new Set(["listExams", "loadExam", "loadAnswers", "saveAttempt"]);
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]{0,78}[a-z0-9])?$/;
const QUESTION_KEY_RE = /^premier:(utilization|final|last)-(\d{2}):q(\d{2})$/;
const TYPE_KEY_RE = /^[a-z][a-z0-9-]{1,79}$/;
const AREA_KEYS = new Set(["arithmetic", "spatial", "pattern", "logic", "combinatorics", "measurement"]);
const JSON_MIME_RE = /^application\/(?:[a-z0-9.+-]*\+)?json(?:\s*;|$)/i;
const QUESTION_MIMES = new Set(["image/jpeg", "image/png", "image/webp"]);
const MAX_REQUEST_BYTES = 131072;
const MAX_MANIFEST_BYTES = 2 * 1024 * 1024;
const MAX_ANSWER_BYTES = 1024 * 1024;
const MAX_QUESTION_ASSET_BYTES = 10 * 1024 * 1024;
const MAX_EXAM_ASSET_BYTES = 32 * 1024 * 1024;
const SIGNED_URL_SECONDS = 900;

const FORBIDDEN_PROBLEM_KEYS = new Set([
  "answer", "answers", "answertext", "answercandidate", "answercandidates", "answertype",
  "correct", "correctanswer", "correctanswers", "gradingkey", "scoringkey", "score",
  "solution", "solutions", "explanation", "explanations",
  "source", "sourcepath", "sourceurl", "sourceuri", "sourcefile", "sourcefilename",
  "sourcememoryrecordid", "sourcepointer", "originalpath", "originalurl",
  "privateurl", "signedurl", "signedasseturl", "asseturl", "objectpath", "bucketid",
  "path", "filepath", "fileurl", "fileuri", "localpath", "pdf", "pdfpath",
  "href", "src", "url", "uri", "proto", "prototype", "constructor"
]);
const FORBIDDEN_ANSWER_TRANSPORT_KEYS = new Set([
  "source", "sourcepath", "sourceurl", "sourceuri", "sourcefile", "sourcefilename",
  "sourcememoryrecordid", "sourcepointer", "originalpath", "originalurl",
  "privateurl", "signedurl", "signedasseturl", "asseturl", "objectpath", "bucketid",
  "path", "filepath", "fileurl", "fileuri", "localpath", "pdf", "pdfpath",
  "href", "src", "url", "uri", "proto", "prototype", "constructor"
]);

type JsonObject = Record<string, unknown>;
// Database-generated types are not committed in this static site repository.
// Runtime rows are therefore validated at every trust boundary below.
// deno-lint-ignore no-explicit-any
type SupabaseClient = any;

class ApiError extends Error {
  status: number;
  code: string;

  constructor(status: number, code: string) {
    super(code);
    this.status = status;
    this.code = code;
  }
}

function publicErrorCode(code: string): string {
  const publicCodes = new Set([
    "authentication_required", "request_not_allowed", "invalid_request",
    "exam_not_available", "entitlement_required", "attempt_not_available",
    "attempt_conflict", "submission_conflict", "revision_conflict",
    "answers_not_available", "asset_not_available", "asset_unavailable",
    "too_many_requests", "server_not_ready"
  ]);
  if (publicCodes.has(code)) return code;
  if (code === "origin_not_allowed") return "request_not_allowed";
  if (new Set([
    "request_too_large", "invalid_request_fields", "action_invalid", "exam_invalid",
    "load_event_invalid", "attempt_invalid", "submission_invalid", "marks_invalid", "marks_incomplete"
  ]).has(code)) return "invalid_request";
  if (/^(?:question_)?asset_(?:not_available|unavailable)$/.test(code)) {
    return code.endsWith("not_available") ? "asset_not_available" : "asset_unavailable";
  }
  if (/asset_|manifest_|answer_|question_|revision_/.test(code)) return "server_not_ready";
  return "server_not_ready";
}

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

function allowedOrigin(origin: string): boolean {
  return origin === PRODUCTION_ORIGIN || LOCAL_ORIGINS.has(origin);
}

function responseHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get("origin") || "";
  return {
    "access-control-allow-origin": allowedOrigin(origin) ? origin : PRODUCTION_ORIGIN,
    "access-control-allow-headers": "authorization, apikey, content-type, x-client-info",
    "access-control-allow-methods": "POST, OPTIONS",
    "cache-control": "no-store, private, max-age=0",
    "content-type": "application/json; charset=utf-8",
    "cross-origin-resource-policy": "same-site",
    "referrer-policy": "no-referrer",
    "vary": "Origin",
    "x-content-type-options": "nosniff"
  };
}

function json(request: Request, status: number, body: JsonObject): Response {
  return new Response(JSON.stringify(body), { status, headers: responseHeaders(request) });
}

async function readJsonObject(request: Request): Promise<JsonObject> {
  const declared = Number(request.headers.get("content-length") || 0);
  if (Number.isFinite(declared) && declared > MAX_REQUEST_BYTES) {
    throw new ApiError(413, "request_too_large");
  }
  if (!request.body) throw new ApiError(400, "invalid_request");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > MAX_REQUEST_BYTES) {
        await reader.cancel();
        throw new ApiError(413, "request_too_large");
      }
      chunks.push(value);
    }
  } finally {
    reader.releaseLock();
  }
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  try {
    const parsed = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("object required");
    return parsed as JsonObject;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(400, "invalid_request");
  }
}

function requireExactKeys(value: JsonObject, keys: string[]): void {
  const actual = Object.keys(value).sort();
  const expected = [...keys].sort();
  if (actual.length !== expected.length || actual.some((key, index) => key !== expected[index])) {
    throw new ApiError(400, "invalid_request_fields");
  }
}

function normalizedKey(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function rejectLeakingString(value: string): void {
  const lower = value.toLowerCase();
  if (
    /(?:https?:)?\/\//i.test(value)
    || /\b(?:file|blob|data):/i.test(value)
    || /(?:^|[\s"'(])(?:[a-z]:[\\/]|\\\\)/i.test(value)
    || /(?:^|[\s"'(])\/(?:users|home|var|private|tmp)\//i.test(value)
    || lower.includes("/storage/v1/object")
    || lower.includes(".source-memory")
    || lower.includes("tmp/pdfs")
    || /(?:sb_secret_|service[_-]?role)/i.test(value)
  ) throw new ApiError(409, "private_content_rejected");
}

function inspectJson(
  value: unknown,
  forbiddenKeys: Set<string>,
  rejectAnswerPrefixes: boolean,
  state = { nodes: 0 },
  depth = 0
): void {
  state.nodes += 1;
  if (state.nodes > 20000 || depth > 24) throw new ApiError(400, "manifest_too_complex");
  if (typeof value === "string") {
    rejectLeakingString(value);
    return;
  }
  if (Array.isArray(value)) {
    for (const entry of value) inspectJson(entry, forbiddenKeys, rejectAnswerPrefixes, state, depth + 1);
    return;
  }
  if (!value || typeof value !== "object") return;
  for (const [key, entry] of Object.entries(value as JsonObject)) {
    const normalized = normalizedKey(key);
    if (
      forbiddenKeys.has(normalized)
      || normalized.endsWith("path") || normalized.endsWith("url") || normalized.endsWith("uri")
      || /정답|해설|원본.?경로|파일.?경로|비공개.?주소/.test(key)
      || (rejectAnswerPrefixes && (normalized.startsWith("answer") || normalized.startsWith("solution")))
    ) throw new ApiError(409, "manifest_secret_field");
    inspectJson(entry, forbiddenKeys, rejectAnswerPrefixes, state, depth + 1);
  }
}

function asSafeText(value: unknown, maximum: number, allowEmpty: boolean, code: string): string {
  if (typeof value !== "string") throw new ApiError(409, code);
  const text = value.trim();
  // deno-lint-ignore no-control-regex
  if ((!allowEmpty && !text) || text.length > maximum || /[<>\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(text)) {
    throw new ApiError(409, code);
  }
  return text;
}

function asRevision(value: unknown): number {
  const revision = Number(value);
  if (!Number.isInteger(revision) || revision < 1 || revision > 32767) {
    throw new ApiError(409, "revision_invalid");
  }
  return revision;
}

function isUuid(value: unknown): value is string {
  return typeof value === "string" && UUID_RE.test(value);
}

function assertExamReference(value: unknown): string {
  const reference = String(value || "").trim();
  if (!UUID_RE.test(reference) && !SLUG_RE.test(reference)) throw new ApiError(400, "exam_invalid");
  return reference;
}

function assertUuid(value: unknown, code: string): string {
  if (!isUuid(value)) throw new ApiError(400, code);
  return value;
}

function normalizeExam(row: JsonObject): JsonObject {
  const revision = asRevision(row.current_revision);
  if (
    !isUuid(row.id) || !SLUG_RE.test(String(row.slug || ""))
    || !["utilization", "final", "last"].includes(String(row.series || ""))
    || !Number.isInteger(Number(row.round_no)) || Number(row.round_no) < 1
    || row.status !== "published" || !row.published_at
    || !Number.isFinite(Date.parse(String(row.published_at)))
    || Date.parse(String(row.published_at)) > Date.now()
    || (row.answers_released_at != null && !Number.isFinite(Date.parse(String(row.answers_released_at))))
  ) throw new ApiError(409, "exam_contract_invalid");
  return {
    id: String(row.slug),
    title: asSafeText(row.title, 200, false, "exam_contract_invalid"),
    series: row.series,
    roundNo: Number(row.round_no),
    status: "published",
    revision,
    publishedAt: String(row.published_at),
    answersReleasedAt: row.answers_released_at ? String(row.answers_released_at) : null
  };
}

async function resolveExam(userClient: SupabaseClient, referenceValue: unknown): Promise<{ raw: JsonObject; safe: JsonObject }> {
  const reference = assertExamReference(referenceValue);
  let query = userClient
    .from("hf_mock_exams")
    .select("id,slug,series,round_no,title,status,published_at,answers_released_at,current_revision")
    .eq("status", "published")
    .lte("published_at", new Date().toISOString());
  query = UUID_RE.test(reference) ? query.eq("id", reference) : query.eq("slug", reference);
  const { data, error } = await query.maybeSingle();
  if (error || !data) throw new ApiError(404, "exam_not_available");
  return { raw: data as JsonObject, safe: normalizeExam(data as JsonObject) };
}

async function resolveOwnedAttempt(userClient: SupabaseClient, attemptIdValue: unknown): Promise<JsonObject> {
  const attemptId = assertUuid(attemptIdValue, "attempt_invalid");
  const { data, error } = await userClient
    .from("hf_mock_attempts")
    .select("id,mock_exam_id,attempt_no,seed,question_count,manifest_revision,manifest_asset_id,status,answers_viewed_at")
    .eq("id", attemptId)
    .maybeSingle();
  if (error || !data) throw new ApiError(404, "attempt_not_available");
  return data as JsonObject;
}

async function resolveVisibleAsset(
  userClient: SupabaseClient,
  examId: string,
  revision: number,
  kind: "manifest" | "answer"
): Promise<JsonObject> {
  const { data, error } = await userClient
    .from("hf_mock_assets")
    .select("id,mock_exam_id,asset_kind,mime_type,revision,sha256,byte_size")
    .eq("mock_exam_id", examId)
    .eq("revision", revision)
    .eq("asset_kind", kind);
  if (error || !Array.isArray(data) || data.length !== 1) {
    throw new ApiError(404, `${kind}_not_available`);
  }
  return data[0] as JsonObject;
}

function createServiceClient(supabaseUrl: string, secretKey: string): SupabaseClient {
  if (!supabaseUrl || !secretKey) throw new ApiError(503, "service_unavailable");
  return createClient(supabaseUrl, secretKey, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false }
  });
}

async function enforceRequestQuota(supabaseUrl: string, secretKey: string, userId: string): Promise<void> {
  const service = createServiceClient(supabaseUrl, secretKey);
  const { data, error } = await service.rpc("hf_consume_asset_url_quota", {
    p_user_id: userId
  });
  if (error) throw new ApiError(503, "server_not_ready");
  if (data !== true) throw new ApiError(429, "too_many_requests");
}

async function serviceAsset(service: SupabaseClient, assetId: string): Promise<JsonObject> {
  const { data, error } = await service
    .from("hf_mock_assets")
    .select("id,mock_exam_id,asset_kind,bucket_id,object_path,mime_type,revision,sha256,byte_size")
    .eq("id", assetId)
    .maybeSingle();
  if (error || !data) throw new ApiError(503, "asset_unavailable");
  return data as JsonObject;
}

function validateAssetMetadata(asset: JsonObject, maximumBytes: number): void {
  const size = Number(asset.byte_size);
  if (
    !isUuid(asset.id) || !isUuid(asset.mock_exam_id)
    || asset.bucket_id !== "hf-mock-private"
    || typeof asset.object_path !== "string" || !asset.object_path
    || typeof asset.sha256 !== "string" || !/^[0-9a-f]{64}$/.test(asset.sha256)
    || !Number.isSafeInteger(size) || size < 1 || size > maximumBytes
  ) throw new ApiError(409, "asset_contract_invalid");
}

async function sha256Hex(bytes: Uint8Array): Promise<string> {
  const owned = Uint8Array.from(bytes);
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", owned.buffer));
  return Array.from(digest, byte => byte.toString(16).padStart(2, "0")).join("");
}

async function readVerifiedBytes(service: SupabaseClient, asset: JsonObject, maximumBytes: number): Promise<Uint8Array> {
  validateAssetMetadata(asset, maximumBytes);
  const { data, error } = await service.storage
    .from(String(asset.bucket_id))
    .download(String(asset.object_path));
  if (error || !data) throw new ApiError(503, "asset_unavailable");
  const bytes = new Uint8Array(await data.arrayBuffer());
  if (bytes.byteLength !== Number(asset.byte_size) || bytes.byteLength > maximumBytes) {
    throw new ApiError(409, "asset_integrity_failed");
  }
  if (await sha256Hex(bytes) !== asset.sha256) throw new ApiError(409, "asset_integrity_failed");
  return bytes;
}

async function readVerifiedJson(service: SupabaseClient, asset: JsonObject, maximumBytes: number): Promise<unknown> {
  if (!JSON_MIME_RE.test(String(asset.mime_type || ""))) throw new ApiError(409, "asset_type_invalid");
  const bytes = await readVerifiedBytes(service, asset, maximumBytes);
  try {
    return JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
  } catch (_) {
    throw new ApiError(409, "asset_json_invalid");
  }
}

type SafeQuestion = {
  number: number;
  questionKey: string;
  revision: number;
  releaseStatus: "verified";
  lockReasons: never[];
  areaKey: string;
  areaLabel: string;
  typeKey: string;
  typeTitle: string;
  typeId: number | null;
  typeCode: string;
  difficultyLabel: string;
  prompt: string;
  assetId: string;
  assetAlt: string;
};

function validateProblemManifest(value: unknown, exam: JsonObject, expectedRevision: number): {
  title: string;
  subtitle: string;
  description: string;
  durationMinutes: number | null;
  questions: SafeQuestion[];
} {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new ApiError(409, "manifest_invalid");
  inspectJson(value, FORBIDDEN_PROBLEM_KEYS, true);
  const manifest = value as JsonObject;
  if (manifest.schemaVersion !== 1 || asRevision(manifest.manifestRevision) !== expectedRevision) {
    throw new ApiError(409, "manifest_revision_mismatch");
  }
  if (manifest.status !== "published") throw new ApiError(409, "manifest_not_published");
  if (manifest.examId != null && ![exam.id, exam.slug].includes(manifest.examId)) {
    throw new ApiError(409, "manifest_exam_mismatch");
  }
  if (!Array.isArray(manifest.questions) || manifest.questions.length < 1 || manifest.questions.length > 100) {
    throw new ApiError(409, "manifest_invalid");
  }
  const expectedRound = String(exam.round_no).padStart(2, "0");
  const seenKeys = new Set<string>();
  const seenAssets = new Set<string>();
  const questions = manifest.questions.map((raw, index): SafeQuestion => {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) throw new ApiError(409, "question_invalid");
    const question = raw as JsonObject;
    const number = Number(question.number);
    const revision = asRevision(question.revision);
    const match = QUESTION_KEY_RE.exec(String(question.questionKey || ""));
    const assetId = assertUuid(question.assetId, "question_asset_invalid");
    if (
      number !== index + 1 || revision !== expectedRevision || !match
      || match[1] !== exam.series || match[2] !== expectedRound
      || match[3] !== String(number).padStart(2, "0")
      || seenKeys.has(String(question.questionKey)) || seenAssets.has(assetId)
    ) throw new ApiError(409, "question_identity_invalid");
    if (question.releaseStatus !== "verified"
      || !Array.isArray(question.lockReasons) || question.lockReasons.length !== 0) {
      throw new ApiError(409, "question_locked");
    }
    if (!AREA_KEYS.has(String(question.areaKey)) || !TYPE_KEY_RE.test(String(question.typeKey || ""))) {
      throw new ApiError(409, "question_classification_invalid");
    }
    const typeId = question.typeId == null ? null : Number(question.typeId);
    if (typeId != null && (!Number.isInteger(typeId) || typeId < 1 || typeId > 54)) {
      throw new ApiError(409, "question_classification_invalid");
    }
    seenKeys.add(String(question.questionKey));
    seenAssets.add(assetId);
    return {
      number,
      questionKey: String(question.questionKey),
      revision,
      releaseStatus: "verified",
      lockReasons: [],
      areaKey: String(question.areaKey),
      areaLabel: asSafeText(question.areaLabel, 100, false, "question_classification_invalid"),
      typeKey: String(question.typeKey),
      typeTitle: asSafeText(question.typeTitle, 160, false, "question_classification_invalid"),
      typeId,
      typeCode: question.typeCode == null ? "" : asSafeText(question.typeCode, 80, false, "question_classification_invalid"),
      difficultyLabel: question.difficultyLabel == null ? "" : asSafeText(question.difficultyLabel, 40, false, "question_invalid"),
      prompt: asSafeText(question.prompt, 10000, false, "question_invalid"),
      assetId,
      assetAlt: asSafeText(question.assetAlt, 300, false, "question_asset_invalid")
    };
  });
  const duration = manifest.durationMinutes == null ? null : Number(manifest.durationMinutes);
  if (duration != null && (!Number.isInteger(duration) || duration < 1 || duration > 300)) {
    throw new ApiError(409, "manifest_invalid");
  }
  const title = asSafeText(manifest.title, 200, false, "manifest_invalid");
  if (title !== exam.title) throw new ApiError(409, "manifest_exam_mismatch");
  return {
    title,
    subtitle: manifest.subtitle == null
      ? `${questions.length}문항`
      : asSafeText(manifest.subtitle, 300, false, "manifest_invalid"),
    description: manifest.description == null
      ? ""
      : asSafeText(manifest.description, 1000, true, "manifest_invalid"),
    durationMinutes: duration,
    questions
  };
}

async function verifyQuestionAssets(
  userClient: SupabaseClient,
  service: SupabaseClient,
  examId: string,
  revision: number,
  questions: SafeQuestion[]
): Promise<Array<SafeQuestion & { signedAssetUrl: string; mimeType: string }>> {
  const ids = questions.map(question => question.assetId);
  const { data, error } = await userClient
    .from("hf_mock_assets")
    .select("id,mock_exam_id,asset_kind,mime_type,revision,sha256,byte_size")
    .in("id", ids);
  if (error || !Array.isArray(data) || data.length !== ids.length) {
    throw new ApiError(404, "question_asset_not_available");
  }
  const totalBytes = data.reduce((sum, row) => sum + Number(row.byte_size || 0), 0);
  if (!Number.isSafeInteger(totalBytes) || totalBytes < 1 || totalBytes > MAX_EXAM_ASSET_BYTES) {
    throw new ApiError(409, "question_asset_mismatch");
  }
  const visibleById = new Map(data.map(row => [String(row.id), row as JsonObject]));
  const output = [];
  for (const question of questions) {
    const visible = visibleById.get(question.assetId);
    if (!visible || visible.mock_exam_id !== examId || Number(visible.revision) !== revision
      || visible.asset_kind !== "question" || !QUESTION_MIMES.has(String(visible.mime_type || ""))) {
      throw new ApiError(409, "question_asset_mismatch");
    }
    const full = await serviceAsset(service, question.assetId);
    validateAssetMetadata(full, 104857600);
    if (full.mock_exam_id !== examId || Number(full.revision) !== revision
      || full.asset_kind !== "question" || !QUESTION_MIMES.has(String(full.mime_type || ""))
      || full.sha256 !== visible.sha256 || Number(full.byte_size) !== Number(visible.byte_size)) {
      throw new ApiError(409, "question_asset_mismatch");
    }
    await readVerifiedBytes(service, full, MAX_QUESTION_ASSET_BYTES);
    const { data: signed, error: signedError } = await service.storage
      .from(String(full.bucket_id))
      .createSignedUrl(String(full.object_path), SIGNED_URL_SECONDS);
    if (signedError || !signed?.signedUrl) throw new ApiError(503, "question_asset_unavailable");
    output.push({
      ...question,
      signedAssetUrl: signed.signedUrl,
      mimeType: String(full.mime_type)
    });
  }
  return output;
}

function validateAnswerManifest(value: unknown, manifest: ReturnType<typeof validateProblemManifest>, exam: JsonObject, revision: number): JsonObject[] {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new ApiError(409, "answer_manifest_invalid");
  inspectJson(value, FORBIDDEN_ANSWER_TRANSPORT_KEYS, false);
  const document = value as JsonObject;
  if (document.schemaVersion !== 1 || asRevision(document.manifestRevision) !== revision) {
    throw new ApiError(409, "answer_revision_mismatch");
  }
  if (document.examId != null && ![exam.id, exam.slug].includes(document.examId)) {
    throw new ApiError(409, "answer_exam_mismatch");
  }
  if (!Array.isArray(document.answers) || document.answers.length !== manifest.questions.length) {
    throw new ApiError(409, "answer_manifest_invalid");
  }
  const seen = new Set<string>();
  return document.answers.map((raw, index) => {
    if (!raw || typeof raw !== "object" || Array.isArray(raw)) throw new ApiError(409, "answer_invalid");
    const entry = raw as JsonObject;
    const question = manifest.questions[index];
    if (entry.questionKey !== question.questionKey || seen.has(question.questionKey)
      || asRevision(entry.revision) !== revision) {
      throw new ApiError(409, "answer_revision_mismatch");
    }
    if (entry.verificationStatus !== "verified"
      || !/^[a-z][a-z0-9_-]{1,39}$/.test(String(entry.answerType || ""))
      || !Object.prototype.hasOwnProperty.call(entry, "answer")
      || !Array.isArray(entry.answerCandidates) || entry.answerCandidates.length !== 1
      || JSON.stringify(entry.answerCandidates[0]) !== JSON.stringify(entry.answer)) {
      throw new ApiError(409, "answer_not_unique");
    }
    seen.add(question.questionKey);
    return {
      questionKey: question.questionKey,
      revision,
      answerType: String(entry.answerType),
      answer: entry.answer,
      answerText: asSafeText(
        typeof entry.answerText === "string" ? entry.answerText : String(entry.answer),
        2000,
        false,
        "answer_invalid"
      ),
      answerCandidates: [entry.answer],
      verificationStatus: "verified"
    };
  });
}

function rpcRow(data: unknown, code: string): JsonObject {
  const row = Array.isArray(data) ? data[0] : data;
  if (!row || typeof row !== "object" || Array.isArray(row)) throw new ApiError(503, code);
  return row as JsonObject;
}

function mapRpcError(error: unknown, operation: "begin" | "reveal" | "submit"): never {
  const value = error as { code?: string; message?: string } | null;
  const code = String(value?.code || "");
  const message = String(value?.message || "");
  if (code === "42501") throw new ApiError(403, "entitlement_required");
  if (/revision/i.test(message)) throw new ApiError(409, "revision_conflict");
  if (code === "23505") {
    throw new ApiError(409, operation === "submit" ? "submission_conflict" : "attempt_conflict");
  }
  if (["22023", "55000"].includes(code)) {
    throw new ApiError(409, operation === "reveal" ? "answers_not_available" : "attempt_conflict");
  }
  throw new ApiError(503, "server_not_ready");
}

async function listExams(userClient: SupabaseClient): Promise<JsonObject> {
  const { data, error } = await userClient
    .from("hf_mock_exams")
    .select("id,slug,series,round_no,title,status,published_at,answers_released_at,current_revision")
    .eq("status", "published")
    .lte("published_at", new Date().toISOString())
    .order("series", { ascending: true })
    .order("round_no", { ascending: true });
  if (error || !Array.isArray(data)) throw new ApiError(503, "exam_list_unavailable");
  return { exams: data.map(row => normalizeExam(row as JsonObject)) };
}

async function loadExam(
  payload: JsonObject,
  userClient: SupabaseClient,
  userId: string,
  supabaseUrl: string,
  secretKey: string
): Promise<JsonObject> {
  requireExactKeys(payload, ["action", "examId", "loadEventId"]);
  const loadEventId = assertUuid(payload.loadEventId, "load_event_invalid");
  const exam = await resolveExam(userClient, payload.examId);
  const revision = Number(exam.raw.current_revision);
  const visibleManifest = await resolveVisibleAsset(userClient, String(exam.raw.id), revision, "manifest");

  // The service key is constructed only after JWT authentication and RLS have
  // proved that this student can read the published exam and manifest row.
  const service = createServiceClient(supabaseUrl, secretKey);
  const manifestAsset = await serviceAsset(service, String(visibleManifest.id));
  if (manifestAsset.mock_exam_id !== exam.raw.id || Number(manifestAsset.revision) !== revision
    || manifestAsset.asset_kind !== "manifest" || manifestAsset.sha256 !== visibleManifest.sha256) {
    throw new ApiError(409, "manifest_asset_mismatch");
  }
  const rawManifest = await readVerifiedJson(service, manifestAsset, MAX_MANIFEST_BYTES);
  const manifest = validateProblemManifest(rawManifest, exam.raw, revision);

  const { data: beginData, error: beginError } = await service.rpc("hf_begin_mock_attempt", {
    p_student_id: userId,
    p_mock_exam_id: exam.raw.id,
    p_manifest_asset_id: manifestAsset.id,
    p_manifest_revision: revision,
    p_question_count: manifest.questions.length,
    p_load_event_id: loadEventId
  });
  if (beginError) mapRpcError(beginError, "begin");
  const attempt = rpcRow(beginData, "attempt_start_failed");
  const questions = await verifyQuestionAssets(userClient, service, String(exam.raw.id), revision, manifest.questions);

  return {
    exam: exam.safe,
    attemptId: attempt.attempt_id,
    attemptNo: Number(attempt.attempt_no),
    attemptStatus: attempt.status,
    serverSeed: Number(attempt.server_seed),
    manifestRevision: revision,
    title: manifest.title,
    subtitle: manifest.subtitle,
    description: manifest.description,
    durationMinutes: manifest.durationMinutes,
    questionCount: questions.length,
    signedUrlExpiresIn: SIGNED_URL_SECONDS,
    questions: questions.map(({ assetId: _assetId, ...question }) => question)
  };
}

async function loadAnswers(
  payload: JsonObject,
  userClient: SupabaseClient,
  userId: string,
  supabaseUrl: string,
  secretKey: string
): Promise<JsonObject> {
  requireExactKeys(payload, ["action", "attemptId"]);
  const attempt = await resolveOwnedAttempt(userClient, payload.attemptId);
  const exam = await resolveExam(userClient, attempt.mock_exam_id);
  const revision = asRevision(attempt.manifest_revision);
  const service = createServiceClient(supabaseUrl, secretKey);

  const { data: revealData, error: revealError } = await service.rpc("hf_reveal_mock_answers", {
    p_student_id: userId,
    p_attempt_id: attempt.id
  });
  if (revealError) mapRpcError(revealError, "reveal");
  const reveal = rpcRow(revealData, "answer_reveal_failed");
  if (Number(reveal.manifest_revision) !== revision) throw new ApiError(409, "answer_revision_mismatch");

  // The policy becomes true only after hf_reveal_mock_answers commits the exact
  // owner/revision grading transition.
  const visibleAnswer = await resolveVisibleAsset(userClient, String(attempt.mock_exam_id), revision, "answer");
  const [manifestAsset, answerAsset] = await Promise.all([
    serviceAsset(service, String(attempt.manifest_asset_id)),
    serviceAsset(service, String(visibleAnswer.id))
  ]);
  if (manifestAsset.mock_exam_id !== attempt.mock_exam_id || Number(manifestAsset.revision) !== revision
    || manifestAsset.asset_kind !== "manifest" || answerAsset.mock_exam_id !== attempt.mock_exam_id
    || Number(answerAsset.revision) !== revision || answerAsset.asset_kind !== "answer"
    || answerAsset.sha256 !== visibleAnswer.sha256) {
    throw new ApiError(409, "answer_asset_mismatch");
  }
  const [problemJson, answerJson] = await Promise.all([
    readVerifiedJson(service, manifestAsset, MAX_MANIFEST_BYTES),
    readVerifiedJson(service, answerAsset, MAX_ANSWER_BYTES)
  ]);
  const manifest = validateProblemManifest(problemJson, exam.raw, revision);
  const answers = validateAnswerManifest(answerJson, manifest, exam.raw, revision);
  return {
    attemptId: attempt.id,
    attemptStatus: reveal.status,
    manifestRevision: revision,
    answersViewedAt: reveal.answers_viewed_at,
    answers
  };
}

function validateMarks(value: unknown, questions: SafeQuestion[]): Record<string, "o" | "x"> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new ApiError(400, "marks_invalid");
  const marks = value as Record<string, unknown>;
  const expected = questions.map(question => String(question.number));
  const keys = Object.keys(marks).sort((a, b) => Number(a) - Number(b));
  if (keys.length !== expected.length || keys.some((key, index) => key !== expected[index])) {
    throw new ApiError(400, "marks_incomplete");
  }
  const normalized: Record<string, "o" | "x"> = {};
  for (const key of keys) {
    if (marks[key] !== "o" && marks[key] !== "x") throw new ApiError(400, "marks_invalid");
    normalized[key] = marks[key] as "o" | "x";
  }
  return normalized;
}

async function saveAttempt(
  payload: JsonObject,
  userClient: SupabaseClient,
  userId: string,
  supabaseUrl: string,
  secretKey: string
): Promise<JsonObject> {
  requireExactKeys(payload, ["action", "attemptId", "submissionId", "marks"]);
  const submissionId = assertUuid(payload.submissionId, "submission_invalid");
  const attempt = await resolveOwnedAttempt(userClient, payload.attemptId);
  const exam = await resolveExam(userClient, attempt.mock_exam_id);
  const revision = asRevision(attempt.manifest_revision);
  const service = createServiceClient(supabaseUrl, secretKey);
  const manifestAsset = await serviceAsset(service, String(attempt.manifest_asset_id));
  if (manifestAsset.mock_exam_id !== attempt.mock_exam_id || Number(manifestAsset.revision) !== revision
    || manifestAsset.asset_kind !== "manifest") throw new ApiError(409, "manifest_asset_mismatch");
  const manifestJson = await readVerifiedJson(service, manifestAsset, MAX_MANIFEST_BYTES);
  const manifest = validateProblemManifest(manifestJson, exam.raw, revision);
  const marks = validateMarks(payload.marks, manifest.questions);
  const wrongQuestions = manifest.questions.filter(question => marks[String(question.number)] === "x");
  const correctCount = manifest.questions.length - wrongQuestions.length;
  const wrongQuestionKeys = wrongQuestions.map(question => question.questionKey);
  const wrongTypeKeys = Array.from(new Set(wrongQuestions.map(question => question.typeKey)));
  const digest = await sha256Hex(new TextEncoder().encode(JSON.stringify({
    attemptId: attempt.id,
    submissionId,
    manifestRevision: revision,
    marks
  })));

  const { data, error } = await service.rpc("hf_submit_mock_attempt", {
    p_student_id: userId,
    p_attempt_id: attempt.id,
    p_submission_event_id: submissionId,
    p_submission_digest: digest,
    p_marks: marks,
    p_correct_count: correctCount,
    p_wrong_question_keys: wrongQuestionKeys,
    p_wrong_type_keys: wrongTypeKeys
  });
  if (error) mapRpcError(error, "submit");
  const receipt = rpcRow(data, "attempt_save_failed");
  if (receipt.status !== "submitted" || Number(receipt.correct_count) !== correctCount
    || Number(receipt.question_count) !== manifest.questions.length) {
    throw new ApiError(503, "attempt_receipt_invalid");
  }
  return {
    attemptId: receipt.attempt_id,
    submissionId,
    attemptNo: Number(receipt.attempt_no),
    status: "submitted",
    manifestRevision: revision,
    correctCount: Number(receipt.correct_count),
    questionCount: Number(receipt.question_count),
    score: Number(receipt.score),
    wrongQuestionKeys: receipt.wrong_question_keys,
    wrongTypeKeys: receipt.wrong_type_keys,
    submittedAt: receipt.submitted_at
  };
}

Deno.serve(async request => {
  try {
    const origin = request.headers.get("origin") || "";
    if (request.method === "OPTIONS") {
      if (!allowedOrigin(origin)) return json(request, 403, { error: "origin_not_allowed" });
      return new Response("ok", { headers: responseHeaders(request) });
    }
    if (request.method !== "POST" || (origin && !allowedOrigin(origin))) {
      throw new ApiError(403, "request_not_allowed");
    }

    const authorization = request.headers.get("authorization") || "";
    const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const publishableKey = environmentKey("SUPABASE_PUBLISHABLE_KEYS", "SUPABASE_PUBLISHABLE_KEY", "SUPABASE_ANON_KEY");
    const secretKey = environmentKey("SUPABASE_SECRET_KEYS", "SUPABASE_SECRET_KEY", "SUPABASE_SERVICE_ROLE_KEY");
    if (!token || !supabaseUrl || !publishableKey) throw new ApiError(401, "authentication_required");

    const userClient = createClient(supabaseUrl, publishableKey, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
      global: { headers: { Authorization: authorization } }
    });
    const { data: authData, error: authError } = await userClient.auth.getUser(token);
    if (authError || !authData.user || authData.user.is_anonymous
      || authData.user.app_metadata?.hf_role !== "student") {
      throw new ApiError(401, "authentication_required");
    }

    await enforceRequestQuota(supabaseUrl, secretKey, authData.user.id);

    const payload = await readJsonObject(request);
    const action = String(payload.action || "");
    if (!ACTIONS.has(action)) throw new ApiError(400, "action_invalid");
    let result: JsonObject;
    if (action === "listExams") {
      requireExactKeys(payload, ["action"]);
      result = await listExams(userClient);
    } else if (action === "loadExam") {
      result = await loadExam(payload, userClient, authData.user.id, supabaseUrl, secretKey);
    } else if (action === "loadAnswers") {
      result = await loadAnswers(payload, userClient, authData.user.id, supabaseUrl, secretKey);
    } else {
      result = await saveAttempt(payload, userClient, authData.user.id, supabaseUrl, secretKey);
    }
    return json(request, 200, result);
  } catch (error) {
    if (error instanceof ApiError) return json(request, error.status, { error: publicErrorCode(error.code) });
    return json(request, 503, { error: "server_not_ready" });
  }
});
