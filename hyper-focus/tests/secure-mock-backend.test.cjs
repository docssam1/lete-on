"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const read = relative => fs.readFileSync(path.join(root, relative), "utf8");

const migration = read("supabase/migrations/20260823151425_secure_mock_delivery_v1.sql");
const edge = read("supabase/functions/secure-mock/index.ts");
const edgeDeno = read("supabase/functions/secure-mock/deno.json");
const config = read("supabase/config.toml");
const genericSigner = read("supabase/functions/signed-asset-url/index.ts");

function section(source, start, end) {
  const from = source.indexOf(start);
  const to = source.indexOf(end, from + start.length);
  assert.ok(from >= 0 && to > from, `missing section ${start}`);
  return source.slice(from, to);
}

function testRevisionAndAttemptSchema() {
  [
    /alter table public\.hf_mock_exams[\s\S]*current_revision integer not null/,
    /alter table public\.hf_mock_assets[\s\S]*revision integer not null[\s\S]*sha256 text not null[\s\S]*byte_size bigint not null/,
    /hf_mock_assets_revision_singleton_idx[\s\S]*where asset_kind in \('manifest', 'answer'\)/,
    /manifest_revision integer not null/,
    /manifest_asset_id uuid not null[\s\S]*references public\.hf_mock_assets\(id\) on delete restrict/,
    /grading_mode text not null default 'self_reported'/,
    /answers_viewed_at timestamptz/,
    /submission_event_id uuid/,
    /submission_digest text/,
    /wrong_question_keys text\[\] not null/,
    /wrong_type_keys text\[\] not null/,
    /status in \('in_progress', 'grading', 'submitted', 'review_pending'\)/,
    /hf_mock_attempts_marks_object_check[\s\S]*jsonb_typeof\(marks\) = 'object'/,
    /hf_mock_attempts_active_exam_idx[\s\S]*student_id, mock_exam_id\)[\s\S]*status in \('in_progress', 'grading'\)/,
    /hf_mock_attempts_submission_event_idx[\s\S]*where submission_event_id is not null/
  ].forEach(pattern => assert.match(migration, pattern));
  assert.doesNotMatch(migration, /jsonb_object_length/i);
  assert.match(migration, /pg_catalog\.jsonb_object_keys\(p_marks\)/);
}

function testServiceOnlyRpcContract() {
  const names = ["hf_begin_mock_attempt", "hf_reveal_mock_answers", "hf_submit_mock_attempt"];
  names.forEach(name => {
    const body = section(migration, `create or replace function public.${name}`, "$$;");
    assert.match(body, /security invoker/i, `${name} must not bypass RLS as a definer`);
    assert.match(body, /set search_path = ''/i);
    assert.match(body, /current_user <> 'service_role'/i);
    assert.match(migration, new RegExp(`revoke execute on function public\\.${name}\\([\\s\\S]*?from public, anon, authenticated;`, "i"));
    assert.match(migration, new RegExp(`grant execute on function public\\.${name}\\([\\s\\S]*?to service_role;`, "i"));
  });
  assert.match(migration, /pg_catalog\.pg_advisory_xact_lock/);
  assert.match(migration, /mock attempt limit reached/);
  assert.match(migration, /load event idempotency conflict/);
  assert.match(migration, /submission idempotency conflict/);
  assert.match(migration, /status = 'grading'[\s\S]*answers_viewed_at = coalesce/);
  assert.match(migration, /v_attempt\.status <> 'grading' or v_attempt\.answers_viewed_at is null/);
  assert.match(migration, /v_seed :=[\s\S]*& 2147483647::bigint/);
}

function testRlsAndLeastPrivilege() {
  assert.match(migration, /drop policy hf_mock_assets_entitled_select/);
  assert.match(migration, /attempt\.manifest_revision = hf_mock_assets\.revision/);
  assert.match(migration, /attempt\.answers_viewed_at is not null/);
  assert.match(migration, /attempt\.status in \('grading', 'submitted'\)/);
  assert.match(migration, /revoke insert, update, delete, truncate on table[\s\S]*public\.hf_mock_attempts[\s\S]*from public, anon, authenticated/);
  assert.match(migration, /revoke select on table public\.hf_mock_assets from authenticated/);
  const columnGrant = section(migration, "grant select (", ") on public.hf_mock_assets to authenticated;");
  assert.doesNotMatch(columnGrant, /bucket_id|object_path/);
}

function testEdgeAuthorizationOrderAndInputs() {
  assert.match(edgeDeno, /npm:@supabase\/supabase-js@2\.112\.3/);
  assert.match(config, /\[functions\.secure-mock\][\s\S]*enabled = true[\s\S]*verify_jwt = true/);
  assert.match(edge, /userClient\.auth\.getUser\(token\)/);
  assert.match(edge, /authData\.user\.app_metadata\?\.hf_role !== "student"/);
  assert.match(edge, /service\.rpc\("hf_consume_asset_url_quota", \{[\s\S]*p_user_id: userId/);
  assert.match(edge, /if \(error\) throw new ApiError\(503, "server_not_ready"\)/);
  assert.match(edge, /if \(data !== true\) throw new ApiError\(429, "too_many_requests"\)/);
  assert.match(edge, /requireExactKeys\(payload, \["action", "examId", "loadEventId"\]\)/);
  assert.match(edge, /requireExactKeys\(payload, \["action", "attemptId"\]\)/);
  assert.match(edge, /requireExactKeys\(payload, \["action", "attemptId", "submissionId", "marks"\]\)/);
  ["approvalCode", "payload.name", "payload.studentId", "payload.score", "payload.correctCount", "payload.wrongTypeIds"]
    .forEach(value => assert.ok(!edge.includes(value), `client field must not be trusted: ${value}`));

  const handler = section(edge, "Deno.serve(async request =>", "  } catch (error) {");
  assert.ok(handler.indexOf("auth.getUser(token)") < handler.indexOf("enforceRequestQuota("));
  assert.ok(handler.indexOf("enforceRequestQuota(") < handler.indexOf("readJsonObject(request)"));

  const load = section(edge, "async function loadExam(", "async function loadAnswers(");
  assert.ok(load.indexOf("resolveExam(userClient") < load.indexOf("createServiceClient("));
  assert.ok(load.indexOf("resolveVisibleAsset(userClient") < load.indexOf("createServiceClient("));
  const answers = section(edge, "async function loadAnswers(", "function validateMarks(");
  assert.ok(answers.indexOf("resolveOwnedAttempt(userClient") < answers.indexOf("createServiceClient("));
  assert.ok(answers.indexOf("resolveExam(userClient") < answers.indexOf("createServiceClient("));
  const save = section(edge, "async function saveAttempt(", "Deno.serve(");
  assert.ok(save.indexOf("resolveOwnedAttempt(userClient") < save.indexOf("createServiceClient("));
  assert.ok(save.indexOf("resolveExam(userClient") < save.indexOf("createServiceClient("));
}

function testManifestAndAssetFailClosedRules() {
  assert.match(edge, /FORBIDDEN_PROBLEM_KEYS/);
  assert.match(edge, /"answer", "answers"/);
  assert.match(edge, /"source", "sourcepath"/);
  assert.match(edge, /"proto", "prototype", "constructor"/);
  assert.match(edge, /question\.releaseStatus !== "verified"/);
  assert.match(edge, /question\.lockReasons\.length !== 0/);
  assert.match(edge, /revision !== expectedRevision/);
  assert.match(edge, /visible\.mock_exam_id !== examId \|\| Number\(visible\.revision\) !== revision/);
  assert.match(edge, /visible\.asset_kind !== "question"/);
  assert.match(edge, /createSignedUrl\(String\(full\.object_path\), SIGNED_URL_SECONDS\)/);
  assert.match(edge, /crypto\.subtle\.digest\("SHA-256"/);
  assert.match(edge, /bytes\.byteLength !== Number\(asset\.byte_size\)/);
  assert.match(edge, /await readVerifiedBytes\(service, full, MAX_QUESTION_ASSET_BYTES\)/);
  assert.doesNotMatch(edge, /QUESTION_MIMES[^\n]*application\/pdf/);
  assert.match(edge, /asSafeText\(question\.typeTitle, 160/);
  assert.match(edge, /asSafeText\(question\.assetAlt, 300/);
}

function testAnswerAndSubmissionDerivation() {
  const answers = section(edge, "async function loadAnswers(", "function validateMarks(");
  assert.ok(answers.indexOf('service.rpc("hf_reveal_mock_answers"') < answers.indexOf('resolveVisibleAsset(userClient'));
  assert.match(answers, /readVerifiedJson\(service, answerAsset, MAX_ANSWER_BYTES\)/);
  assert.match(answers, /validateAnswerManifest\(answerJson, manifest, exam\.raw, revision\)/);

  const save = section(edge, "async function saveAttempt(", "Deno.serve(");
  assert.match(save, /readVerifiedJson\(service, manifestAsset, MAX_MANIFEST_BYTES\)/);
  assert.match(save, /const correctCount = manifest\.questions\.length - wrongQuestions\.length/);
  assert.match(save, /const wrongQuestionKeys = wrongQuestions\.map/);
  assert.match(save, /const wrongTypeKeys = Array\.from\(new Set/);
  assert.match(save, /p_correct_count: correctCount/);
  assert.match(save, /p_wrong_question_keys: wrongQuestionKeys/);
  assert.match(save, /p_wrong_type_keys: wrongTypeKeys/);
  assert.match(save, /submissionId,[\s\S]*manifestRevision: revision/);
}

function testGenericSignerCannotBypassJsonValidation() {
  assert.match(genericSigner, /\.select\("id"\)/);
  assert.match(genericSigner, /serviceClient\.from\("hf_mock_assets"\)[\s\S]*\.select\("id,bucket_id,object_path,asset_kind"\)/);
  assert.match(genericSigner, /expectedBucket = assetType === "mock" \? "hf-mock-private" : "hf-vip-private"/);
  assert.match(genericSigner, /assetType === "mock" && asset\.asset_kind !== "cover"/);
  const visibilityProof = genericSigner.indexOf('.select("id")');
  const privilegedPathRead = genericSigner.indexOf('.select("id,bucket_id,object_path,asset_kind")');
  assert.ok(visibilityProof >= 0 && privilegedPathRead > visibilityProof);
}

function main() {
  testRevisionAndAttemptSchema();
  testServiceOnlyRpcContract();
  testRlsAndLeastPrivilege();
  testEdgeAuthorizationOrderAndInputs();
  testManifestAndAssetFailClosedRules();
  testAnswerAndSubmissionDerivation();
  testGenericSignerCannotBypassJsonValidation();
  console.log("Hyper Focus secure mock backend QA: PASS");
}

main();
