const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const migrationDir = path.join(root, "supabase", "migrations");
const migrationName = fs.readdirSync(migrationDir).find(function (name) {
  return name.endsWith("_create_grade6_assessment_pipeline.sql");
});
const sql = fs.readFileSync(path.join(migrationDir, migrationName), "utf8");
const plan = require(path.join(root, "assessment", "grade6-placement-plan.js")).plan;

const tables = [
  "gfield_math_learners", "gfield_math_account_learner_links", "gfield_math_teacher_scopes",
  "gfield_math_private_release_revocations",
  "gfield_math_grade6_form_slot_contract", "gfield_math_assessment_forms",
  "gfield_math_assessment_form_items", "gfield_math_assessment_policies",
  "gfield_math_assessment_assignments", "gfield_math_assessment_attempts",
  "gfield_math_assessment_responses", "gfield_math_teacher_scoring_reviews",
  "gfield_math_assessment_scores", "gfield_math_assessment_evidence",
  "gfield_math_report_snapshots", "gfield_math_roadmap_snapshots"
];

const triggerFunctions = [
  "gfield_math_validate_student_link", "gfield_math_validate_teacher_scope",
  "gfield_math_validate_release_revocation", "gfield_math_validate_form_creator",
  "gfield_math_validate_policy_lifecycle",
  "gfield_math_validate_form_item_binding", "gfield_math_validate_form_release",
  "gfield_math_prevent_released_form_item_mutation", "gfield_math_validate_assignment",
  "gfield_math_validate_attempt_binding", "gfield_math_validate_assignment_attempt_consistency",
  "gfield_math_prevent_finalized_attempt_mutation", "gfield_math_prevent_finalized_assessment_mutation",
  "gfield_math_validate_teacher_review", "gfield_math_validate_score",
  "gfield_math_validate_evidence_verifier", "gfield_math_validate_final_report_snapshot",
  "gfield_math_validate_final_roadmap_snapshot", "gfield_math_prevent_final_snapshot_mutation"
];

function tableBody(name) {
  const match = sql.match(new RegExp(`create table public\\.${name} \\(([\\s\\S]*?)\\n\\);`, "i"));
  assert.ok(match, `missing table body for ${name}`);
  return match[1];
}

function functionBody(schema, name) {
  const match = sql.match(new RegExp(`create or replace function ${schema}\\.${name}\\(\\)[\\s\\S]*?as \\$\\$([\\s\\S]*?)\\$\\$;`, "i"));
  assert.ok(match, `missing function body for ${schema}.${name}`);
  return match[1];
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function stripSqlStringsAndComments(value) {
  let out = "";
  let index = 0;
  let mode = "code";
  while (index < value.length) {
    const pair = value.slice(index, index + 2);
    const char = value[index];
    if (mode === "code" && pair === "--") { mode = "comment"; index += 2; continue; }
    if (mode === "comment") {
      if (char === "\n") { mode = "code"; out += "\n"; }
      index += 1;
      continue;
    }
    if (mode === "code" && pair === "$$") { mode = "dollar"; index += 2; continue; }
    if (mode === "dollar") {
      if (pair === "$$") { mode = "code"; index += 2; } else index += 1;
      continue;
    }
    if (mode === "code" && char === "'") { mode = "string"; index += 1; continue; }
    if (mode === "string") {
      if (pair === "''") { index += 2; continue; }
      if (char === "'") mode = "code";
      index += 1;
      continue;
    }
    out += char;
    index += 1;
  }
  assert.equal(mode, "code", "SQL string, comment, or dollar quote must close");
  return out;
}

test("migration uses the repository timestamp convention and one transaction", function () {
  assert.match(migrationName, /^\d{14}_create_grade6_assessment_pipeline\.sql$/);
  assert.match(sql, /^begin;\s/i);
  assert.match(sql, /\scommit;\s*$/i);
  assert.equal((sql.match(/^begin;$/gim) || []).length, 1);
  assert.equal((sql.match(/^commit;$/gim) || []).length, 1);
});

test("static SQL delimiters are balanced", function () {
  const structural = stripSqlStringsAndComments(sql);
  let depth = 0;
  for (const char of structural) {
    if (char === "(") depth += 1;
    if (char === ")") depth -= 1;
    assert.ok(depth >= 0, "closing parenthesis cannot precede its opening parenthesis");
  }
  assert.equal(depth, 0);
  assert.equal((sql.match(/\$\$/g) || []).length, (triggerFunctions.length + 1) * 2);
});

test("the database slot contract matches all 42 Grade 6 plan rows exactly", function () {
  assert.equal(plan.slots.length, 42);
  assert.equal(plan.slots.filter((slot) => slot.scoringMode === "teacher").length, 10);
  plan.slots.forEach(function (slot, index) {
    const row = `(${index + 1}, '${slot.slotId}', '${slot.unitId}', '${slot.clusterId}', '${slot.standardRange}', '${slot.skillId}', '${slot.domainId}', '${slot.difficulty}', '${slot.responseType}', '${slot.scoringMode}', ${slot.maxPoints})`;
    assert.match(sql, new RegExp(escapeRegExp(row)), `slot ${index + 1} must be exact`);
  });
  assert.equal((sql.match(/^\s*\(\d+, 'slot-bdg-g6-/gm) || []).length, 42);
});

test("form items bind exact fixed slots, signed payload hashes, and blueprint attestations", function () {
  const body = tableBody("gfield_math_assessment_form_items");
  assert.match(body, /gfield_math_grade6_form_slot_contract[\s\S]*on delete restrict/i);
  assert.match(body, /gfield_math_private_release_manifests\(release_id, item_id, item_version\)/i);
  assert.match(body, /gfield_math_private_item_revisions\(item_id, item_version\)/i);
  assert.match(body, /unique \(form_id, form_version, item_id\)/i);
  assert.match(sql, /v_manifest_state is distinct from 'signed' or v_item_state is distinct from 'signed'/i);
  assert.match(sql, /v_visibility is distinct from 'authenticated-assessment'/i);
  assert.match(tableBody("gfield_math_assessment_forms"), new RegExp(plan.blueprintContractSha256, "i"));
  assert.match(tableBody("gfield_math_assessment_forms"), /blueprint_version integer not null check \(blueprint_version = 1\)/i);
  ["blueprintId", "blueprintVersion", "blueprintContractSha256", "purpose", "slotId", "unitId", "standardRange"].forEach(function (field) {
    assert.match(sql, new RegExp(`assessmentBinding,${field}`, "i"));
  });
  assert.match(sql, /v_manifest_payload ->> 'publicPayloadSha256' is distinct from v_public_payload_sha256/i);
  assert.match(sql, /locked\.manifest_payload ->> 'publicPayloadSha256' is distinct from locked\.public_payload_sha256/i);
  ["domainId", "clusterId", "skillId", "difficulty", "responseType", "maxPoints"].forEach(function (field) {
    assert.match(sql, new RegExp(`v_public_payload[^;]+?['\"]${field}['\"]`, "i"));
    assert.match(sql, new RegExp(`locked\\.public_payload[^;]+?['\"]${field}['\"]`, "i"));
  });
  assert.match(sql, /v_private_scoring_payload ->> 'scoringMode' is distinct from new\.scoring_mode/i);
  assert.match(sql, /locked\.private_scoring_payload ->> 'scoringMode' is distinct from locked\.scoring_mode/i);
  assert.match(sql, /count\(\*\) - count\(distinct locked\.public_payload_sha256\)/i);
  assert.match(sql, /v_lineage_mismatch_count <> 0 or v_duplicate_public_hash_count <> 0/i);
  assert.match(sql, /gfield_math_private_release_revocations/i);
});

test("every new exposed-schema table starts with RLS and revoked browser grants", function () {
  tables.forEach(function (name) {
    assert.match(sql, new RegExp(`alter table public\\.${name} enable row level security`, "i"));
    assert.match(sql, new RegExp(`revoke all on table public\\.${name} from anon, authenticated`, "i"));
    assert.match(sql, new RegExp(`grant all on table public\\.${name} to service_role`, "i"));
  });
  assert.doesNotMatch(sql, /grant\s+[^;]+\s+to\s+anon/i);
});

test("the browser can write only raw responses and cannot write score-bearing tables", function () {
  const browserMutationGrants = [...sql.matchAll(/grant\s+([^;]+?)\s+on table public\.([a-z0-9_]+)\s+to authenticated;/gi)]
    .filter((match) => /\b(insert|update|delete|all)\b/i.test(match[1]))
    .map((match) => ({ privileges: match[1].replace(/\s+/g, " ").trim(), table: match[2] }));
  assert.deepEqual(browserMutationGrants, [
    { privileges: "insert (response_id, attempt_id, learner_id, form_id, form_version, slot_number, submitted_by, raw_response)", table: "gfield_math_assessment_responses" },
    { privileges: "update (raw_response)", table: "gfield_math_assessment_responses" }
  ]);
  assert.match(sql, /new\.submitted_at := now\(\)/i);
  ["gfield_math_assessment_attempts", "gfield_math_assessment_responses"].forEach(function (name) {
    assert.doesNotMatch(tableBody(name), /^\s*(awarded_points|is_correct|correct_answer|score)\s/im);
  });
  const responseBody = tableBody("gfield_math_assessment_responses");
  assert.match(responseBody, /raw_response \? 'value'/i);
  assert.match(responseBody, /raw_response - 'value' = '\{\}'::jsonb/i);
  assert.match(responseBody, /jsonb_typeof\(raw_response -> 'value'\) in \('string', 'number', 'boolean'\)/i);
  assert.doesNotMatch(responseBody, /jsonb_path_exists/i);
  assert.match(sql, /gfield_math_responses_insert_raw_owned[\s\S]*submitted_by = \(select auth\.uid\(\)\)[\s\S]*attempt_state = 'in-progress'/i);
  assert.match(sql, /gfield_math_responses_update_raw_owned[\s\S]*for update to authenticated[\s\S]*using[\s\S]*with check/i);
  assert.doesNotMatch(sql, /grant update\s+on table public\.gfield_math_assessment_responses/i);
});

test("student ownership and teacher scope come from server-managed mapping tables", function () {
  assert.match(tableBody("gfield_math_account_learner_links"), /references public\.gfield_math_accounts\(user_id\)/i);
  assert.match(tableBody("gfield_math_teacher_scopes"), /references public\.gfield_math_accounts\(user_id\)/i);
  assert.match(sql, /v_role <> 'student' or v_account_status <> 'active'/i);
  assert.match(sql, /v_role not in \('teacher', 'admin'\) or v_account_status <> 'active'/i);
  assert.match(sql, /a\.role = 'student' and a\.status = 'active'/i);
  assert.match(sql, /a\.role in \('teacher', 'admin'\) and a\.status = 'active'/i);
  assert.match(sql, /status = 'active' and \([\s\S]*gfield_math_account_learner_links/i);
  assert.match(sql, /active_learner\.status = 'active'/i);
  assert.match(sql, /drop policy if exists gfield_math_student_state_read_self/i);
  assert.match(sql, /gfield_math_student_state_update_active_self[\s\S]*a\.role = 'student' and a\.status = 'active'/i);
  assert.match(sql, /teacher_user_id = \(select auth\.uid\(\)\)[\s\S]*ends_at > now\(\)/i);
  assert.match(sql, /v_role = 'teacher' and not exists \([\s\S]*gfield_math_teacher_scopes/i);
  assert.doesNotMatch(sql, /user_metadata|raw_user_meta_data|auth\.role\s*\(/i);
});

test("public trigger functions stay invoker-only while the private response guard is isolated", function () {
  triggerFunctions.forEach(function (name) {
    const functionPattern = new RegExp(`create or replace function public\\.${name}\\(\\)[\\s\\S]*?security invoker[\\s\\S]*?set search_path = ''[\\s\\S]*?\\$\\$;`, "i");
    assert.match(sql, functionPattern);
    assert.match(sql, new RegExp(`revoke all on function public\\.${name}\\(\\) from public, anon, authenticated`, "i"));
    assert.match(sql, new RegExp(`grant execute on function public\\.${name}\\(\\) to service_role`, "i"));
  });
  assert.match(sql, /create schema if not exists private;[\s\S]*revoke all on schema private from public, anon, authenticated/i);
  assert.match(sql, /create or replace function private\.gfield_math_validate_raw_response_write\(\)[\s\S]*?security definer[\s\S]*?set search_path = ''[\s\S]*?\$\$;/i);
  assert.match(sql, /revoke all on function private\.gfield_math_validate_raw_response_write\(\) from public, anon, authenticated/i);
  assert.doesNotMatch(sql, /grant execute on function private\.gfield_math_validate_raw_response_write\(\) to authenticated/i);
  assert.equal((sql.match(/security definer/gi) || []).length, 2, "only the private guard and its explanatory comment may mention SECURITY DEFINER");
  assert.doesNotMatch(sql, /grant execute on function[^;]+to authenticated/i);
});

test("final reports require all 42 scores and all 10 teacher reviews", function () {
  assert.match(sql, /v_form_item_count <> 42 or v_response_count <> 42 or v_score_count <> 42/i);
  assert.match(sql, /v_teacher_item_count <> 10 or v_teacher_review_count <> 10/i);
  assert.match(sql, /i\.scoring_mode = 'teacher' and r\.review_id is null/i);
  assert.match(sql, /final roadmap requires the exact final report snapshot/i);
  assert.match(sql, /attempt_state = 'finalized'/i);
  assert.match(sql, /attempt finalization requires 42 responses, 42 server scores and 10 approved teacher reviews/i);
  assert.match(sql, /attempt scoring requires 42 responses, 42 server scores and 10 approved teacher reviews/i);
  assert.match(sql, /a finalized or void attempt is immutable/i);
  assert.match(sql, /final report and roadmap snapshots are immutable/i);
  assert.match(sql, /Counts are recalculated from server-owned relational rows/i);
  assert.match(sql, /No browser form,[\s\S]*score, review array or awarded-points payload participates in this gate/i);
  ["gfield_math_assessment_forms", "gfield_math_assessment_policies", "gfield_math_report_snapshots", "gfield_math_roadmap_snapshots"].forEach(function (name) {
    assert.match(tableBody(name), /automatic_promotion boolean not null default false check \(automatic_promotion = false\)/i);
  });
  assert.match(tableBody("gfield_math_report_snapshots"), /promotion_decision text not null default 'not-decided' check \(promotion_decision = 'not-decided'\)/i);
});

test("internal lineage, policy, scoring, and evidence tables remain service-role-only", function () {
  [
    "gfield_math_assessment_forms", "gfield_math_assessment_form_items",
    "gfield_math_assessment_policies", "gfield_math_grade6_form_slot_contract",
    "gfield_math_private_release_revocations",
    "gfield_math_teacher_scoring_reviews", "gfield_math_assessment_scores",
    "gfield_math_assessment_evidence"
  ].forEach(function (name) {
    assert.doesNotMatch(sql, new RegExp(`grant [^;]+ on table public\\.${name} to authenticated`, "i"));
  });
  assert.doesNotMatch(tableBody("gfield_math_assessment_form_items"), /payload|prompt|answer|rubric|scoring_spec/i);
});

test("student and teacher snapshots are audience-separated", function () {
  ["gfield_math_report_snapshots", "gfield_math_roadmap_snapshots"].forEach(function (name) {
    assert.match(tableBody(name), /audience text not null check \(audience in \('student', 'teacher'\)\)/i);
  });
  assert.match(tableBody("gfield_math_roadmap_snapshots"), /foreign key \(report_id, attempt_id, learner_id, audience\)[\s\S]*gfield_math_report_snapshots/i);
  assert.match(sql, /audience = 'student' and snapshot_state = 'final'/i);
  assert.match(sql, /audience = 'teacher' and exists/i);
});

test("form and policy versions remain in assignments and attempts while snapshots bind the immutable attempt", function () {
  assert.match(tableBody("gfield_math_assessment_assignments"), /form_version integer not null[\s\S]*policy_version integer not null/i);
  assert.match(tableBody("gfield_math_assessment_attempts"), /form_version integer not null[\s\S]*policy_version integer not null/i);
  assert.match(sql, /row\(new\.learner_id, new\.school_id, new\.form_id, new\.form_version, new\.policy_id, new\.policy_version\)/i);
  assert.match(sql, /row\(new\.policy_id, new\.policy_version\) is distinct from row\(v_attempt\.policy_id, v_attempt\.policy_version\)/i);
  assert.match(tableBody("gfield_math_report_snapshots"), /attempt_id text not null references public\.gfield_math_assessment_attempts/i);
  assert.match(sql, /report snapshot must match one attempt and policy exactly/i);
});

test("teacher review IDs and error types match the diagnostic engine contract", function () {
  const reviews = tableBody("gfield_math_teacher_scoring_reviews");
  const scores = tableBody("gfield_math_assessment_scores");
  assert.match(reviews, /review_id text primary key check \(review_id ~ '\^grd-bdg-/i);
  assert.match(reviews, /'explanation-incomplete'/i);
  assert.match(scores, /'explanation-incomplete'/i);
  assert.doesNotMatch(`${reviews}\n${scores}`, /explanation_incomplete/i);
  assert.match(sql, /teacher-review score must exactly match one approved teacher review/i);
  assert.match(sql, /a teacher review referenced by a server score is immutable/i);
});

test("published policies, state transitions, revocations, and final evidence fail closed", function () {
  assert.match(sql, /a published policy can only transition unchanged to retired/i);
  assert.match(sql, /a retired assessment policy is immutable/i);
  assert.match(sql, /assignment state transition is invalid/i);
  assert.match(sql, /attempt state transition is invalid/i);
  assert.match(tableBody("gfield_math_assessment_attempts"), /submitted_at is null or submitted_at >= started_at/i);
  assert.match(tableBody("gfield_math_assessment_attempts"), /finalized_at is null or \(scored_at is not null and finalized_at >= scored_at\)/i);
  assert.match(sql, /assessment evidence can be written only while the attempt is submitted/i);
  assert.match(tableBody("gfield_math_private_release_revocations"), /revoked_by uuid not null references public\.gfield_math_accounts/i);
  assert.match(sql, /release revocation requires an active administrator and exact signed release/i);
  assert.match(sql, /assignment cannot use a withdrawn or revoked item release/i);
  assert.match(sql, /attempt cannot use a withdrawn or revoked item release/i);
  assert.match(sql, /grant select on table public\.gfield_math_accounts to service_role/i);
});

test("assignment and attempt states are coupled while terminal cleanup remains available", function () {
  assert.match(sql, /a new assignment must start assigned/i);
  assert.match(sql, /a new attempt requires an opened assignment/i);
  assert.match(sql, /a submitted assignment requires its submitted attempt/i);
  assert.match(sql, /a closed assignment requires its finalized attempt/i);
  assert.match(sql, /an assignment with an attempt can be cancelled only after the attempt is void/i);
  assert.match(sql, /terminal assignment cleanup cannot rewrite its schedule/i);
  assert.match(sql, /void cleanup cannot rewrite prior attempt timestamps/i);
  assert.match(sql, /Terminal cleanup remains possible after actor suspension, policy\/form retirement or item revocation[\s\S]*new\.assignment_state in \('closed', 'cancelled'\)[\s\S]*return new/i);
  assert.match(sql, /Void cleanup remains possible after learner suspension, policy\/form retirement or item revocation[\s\S]*new\.attempt_state = 'void'[\s\S]*return new/i);
  assert.match(sql, /assignment and attempt states are inconsistent at transaction completion/i);
  assert.match(sql, /create constraint trigger gfield_math_assignment_attempt_consistency_from_assignment[\s\S]*deferrable initially deferred/i);
  assert.match(sql, /create constraint trigger gfield_math_assignment_attempt_consistency_from_attempt[\s\S]*deferrable initially deferred/i);
});

test("form release and attempt scoring serialize against concurrent child mutations", function () {
  const formBinding = functionBody("public", "gfield_math_validate_form_item_binding");
  const formRelease = functionBody("public", "gfield_math_validate_form_release");
  const formMutation = functionBody("public", "gfield_math_prevent_released_form_item_mutation");
  const attempt = functionBody("public", "gfield_math_validate_attempt_binding");
  const childMutation = functionBody("public", "gfield_math_prevent_finalized_assessment_mutation");
  const teacherReview = functionBody("public", "gfield_math_validate_teacher_review");
  const score = functionBody("public", "gfield_math_validate_score");
  const evidence = functionBody("public", "gfield_math_validate_evidence_verifier");

  assert.match(formBinding, /gfield_math_assessment_forms[\s\S]*for share/i);
  assert.match(formRelease, /order by i\.slot_number[\s\S]*for share of i, m, r/i);
  assert.match(formMutation, /gfield_math_assessment_forms[\s\S]*for share/i);

  assert.equal((attempt.match(/\) locked_responses;/gi) || []).length, 2);
  assert.equal((attempt.match(/\) locked_reviews;/gi) || []).length, 2);
  assert.equal((attempt.match(/\) locked_scores;/gi) || []).length, 2);
  assert.equal((attempt.match(/for share of r/gi) || []).length, 4);
  assert.equal((attempt.match(/for share of s/gi) || []).length, 2);
  assert.match(attempt, /attempt event timestamps are write-once/i);

  assert.match(childMutation, /gfield_math_assessment_attempts[\s\S]*for share/i);
  assert.match(childMutation, /in \('scored', 'finalized', 'void'\)/i);
  [teacherReview, score].forEach(function (body) {
    assert.match(body, /attempt_state = 'submitted'[\s\S]*for share/i);
  });
  assert.match(evidence, /gfield_math_assessment_attempts[\s\S]*for share/i);
  assert.match(evidence, /attempt_state <> 'submitted'/i);
});

test("every raw response write rechecks current ownership, workflow, policy, and signed releases", function () {
  assert.match(sql, /create trigger gfield_math_raw_response_write_current[\s\S]*before insert or update on public\.gfield_math_assessment_responses[\s\S]*private\.gfield_math_validate_raw_response_write/i);
  assert.match(sql, /create trigger gfield_math_finalized_responses_immutable\s+before delete on public\.gfield_math_assessment_responses/i);
  assert.doesNotMatch(sql, /create trigger gfield_math_finalized_responses_immutable\s+before update/i);
  assert.match(sql, /raw response requires its exact in-progress attempt/i);
  assert.match(sql, /raw response requires its exact opened assignment/i);
  assert.match(sql, /raw response requires an active student account/i);
  assert.match(sql, /raw response requires the active learner owner/i);
  assert.match(sql, /raw response requires a released form and published school policy/i);
  assert.match(sql, /raw response requires all 42 exact signed and unrevoked form items/i);
  assert.match(sql, /for share of m, r/i);
  assert.match(sql, /gfield_math_validate_release_revocation\(\)[\s\S]*for update/i);
  assert.match(sql, /gfield_math_responses_insert_raw_owned[\s\S]*assignment\.assignment_state = 'opened'/i);
  assert.match(sql, /gfield_math_responses_update_raw_owned[\s\S]*assignment\.assignment_state = 'opened'/i);
});

test("RLS and foreign-key lookup paths have dedicated indexes", function () {
  [
    "gfield_math_teacher_scopes_learner_active_idx", "gfield_math_form_items_release_idx",
    "gfield_math_assignments_form_idx", "gfield_math_assignments_policy_idx",
    "gfield_math_attempts_form_idx", "gfield_math_attempts_policy_idx",
    "gfield_math_responses_learner_attempt_idx", "gfield_math_responses_submitted_by_idx",
    "gfield_math_release_revocations_revoked_by_idx", "gfield_math_reports_learner_audience_idx",
    "gfield_math_roadmaps_learner_audience_idx"
  ].forEach(function (name) { assert.match(sql, new RegExp(`create index ${name}`, "i")); });
  assert.doesNotMatch(sql, /create index gfield_math_(?:responses|scores)_attempt_idx/i);
});
