const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const migrationDir = path.join(root, "supabase", "migrations");
const migrationName = fs.readdirSync(migrationDir).find(function (name) {
  return name.endsWith("_create_boarding_item_signer_foundation.sql");
});
const sql = fs.readFileSync(path.join(migrationDir, migrationName), "utf8");
const hardeningName = fs.readdirSync(migrationDir).find(function (name) {
  return name.endsWith("_harden_boarding_item_signer_commit.sql");
});
const hardeningSql = fs.readFileSync(path.join(migrationDir, hardeningName), "utf8");
const signer = fs.readFileSync(path.join(root, "supabase", "functions", "boarding-item-signer", "index.ts"), "utf8");
const releasePayloadHash = fs.readFileSync(path.join(root, "question-bank", "release-payload-hash.mjs"), "utf8");
const payloadGuard = fs.readFileSync(path.join(root, "question-bank", "boarding-signer-payload-guard.mjs"), "utf8");
const commitProof = fs.readFileSync(path.join(root, "question-bank", "release-commit-proof.mjs"), "utf8");
const readme = fs.readFileSync(path.join(root, "README.md"), "utf8");
const config = fs.readFileSync(path.join(root, "supabase", "config.toml"), "utf8");

const privateTables = [
  "gfield_math_private_item_revisions",
  "gfield_math_private_rights_records",
  "gfield_math_private_item_rights_bindings",
  "gfield_math_private_review_records",
  "gfield_math_private_release_manifests"
];

test("signer migration follows the generated Supabase timestamp convention", function () {
  assert.match(migrationName, /^\d{14}_create_boarding_item_signer_foundation\.sql$/);
  assert.match(hardeningName, /^\d{14}_harden_boarding_item_signer_commit\.sql$/);
});

test("every answer-bearing signer table has RLS and no browser role grants", function () {
  privateTables.forEach(function (table) {
    assert.match(sql, new RegExp(`alter table public\\.${table} enable row level security`, "i"));
    assert.match(sql, new RegExp(`revoke all on table public\\.${table} from anon, authenticated`, "i"));
    assert.match(sql, new RegExp(`grant all on table public\\.${table} to service_role`, "i"));
  });
  assert.doesNotMatch(sql, /revoke\s+all\s+on\s+schema\s+public/i);
});

test("private evidence is append-only and signed records cannot mutate", function () {
  assert.match(sql, /gfield_math_private_rights_records_append_only/i);
  assert.match(sql, /gfield_math_private_review_records_append_only/i);
  assert.match(sql, /gfield_math_private_item_rights_bindings_append_only/i);
  assert.match(sql, /gfield_math_private_item_revisions_immutable_after_sign/i);
  assert.match(sql, /gfield_math_private_release_manifests_immutable/i);
});

test("release commit is atomic, snapshot-bound, and exposes only an invoker wrapper", function () {
  assert.match(sql, /create or replace function public\.gfield_math_commit_signed_release/i);
  assert.match(hardeningSql, /drop function public\.gfield_math_commit_signed_release/i);
  assert.match(hardeningSql, /create schema if not exists gfield_math_internal/i);
  assert.match(hardeningSql, /create function gfield_math_internal\.commit_signed_release[\s\S]*security definer[\s\S]*set search_path = pg_catalog, pg_temp/i);
  assert.match(hardeningSql, /create function public\.gfield_math_commit_signed_release[\s\S]*security invoker[\s\S]*gfield_math_internal\.commit_signed_release/i);
  assert.match(hardeningSql, /revoke all on schema gfield_math_internal from public, anon, authenticated, service_role/i);
  assert.match(hardeningSql, /revoke all on function public\.gfield_math_commit_signed_release[\s\S]*from public, anon, authenticated/i);
  assert.match(hardeningSql, /grant execute on function public\.gfield_math_commit_signed_release[\s\S]*to service_role/i);
  [
    "author_user_id = p_expected_author_user_id",
    "program_id = p_expected_program_id",
    "target_grade = p_expected_target_grade",
    "visibility_class = p_expected_visibility_class",
    "public_payload = p_expected_public_payload",
    "private_scoring_payload = p_expected_private_scoring_payload",
    "rubric_payload is not distinct from p_expected_rubric_payload",
    "public_payload_sha256 = p_expected_public_payload_sha256",
    "private_scoring_sha256 = p_expected_private_scoring_sha256",
    "rubric_sha256 is not distinct from p_expected_rubric_sha256",
  ].forEach(function (binding) {
    assert.match(hardeningSql, new RegExp(binding.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"));
  });
  assert.match(hardeningSql, /update public\.gfield_math_private_item_revisions[\s\S]*insert into public\.gfield_math_private_release_manifests/i);
});

test("reviewer specialties are database-authorized and unavailable to browser roles", function () {
  assert.match(hardeningSql, /create table public\.gfield_math_reviewer_credentials/i);
  assert.match(hardeningSql, /credential_version integer not null/i);
  assert.match(hardeningSql, /create table public\.gfield_math_reviewer_credential_revocations/i);
  assert.match(hardeningSql, /alter table public\.gfield_math_reviewer_credentials enable row level security/i);
  assert.match(hardeningSql, /revoke all on table public\.gfield_math_reviewer_credentials from anon, authenticated/i);
  assert.match(hardeningSql, /grant select on table public\.gfield_math_reviewer_credentials to service_role/i);
  assert.doesNotMatch(hardeningSql, /grant select, insert on table public\.gfield_math_reviewer_credentials to service_role/i);
  assert.match(hardeningSql, /grant select on table public\.gfield_math_reviewer_credential_revocations to service_role/i);
  assert.doesNotMatch(hardeningSql, /grant all on table public\.gfield_math_reviewer_credentials to service_role/i);
  assert.match(hardeningSql, /student-payload-safety/i);
  assert.match(hardeningSql, /security-reviewer/i);
  assert.match(signer, /from\("gfield_math_reviewer_credentials"\)/);
  assert.match(signer, /credential_version,status,approved_by,approved_at,expires_at/);
  assert.match(signer, /from\("gfield_math_reviewer_credential_revocations"\)/);
  assert.match(signer, /selectSignerCredential\(\{/);
  assert.match(payloadGuard, /reviewerCredentialVersion/);
  assert.match(signer, /"student-payload-safety"/);
  assert.match(payloadGuard, /"student-payload-safety": "security-reviewer"/);
});

test("transaction revalidates and locks every mutable authorization before commit", function () {
  assert.match(hardeningSql, /from public\.gfield_math_accounts a[\s\S]*for update/i);
  assert.match(hardeningSql, /from public\.gfield_math_reviewer_credentials c[\s\S]*for update/i);
  assert.doesNotMatch(hardeningSql, /gfield_math_reviewer_credential_revocations[\s\S]{0,300}revoked_at\s*<=/i);
  assert.match(hardeningSql, /approved_at <= v_reviewed_at/i);
  assert.match(hardeningSql, /approved_at <= p_signed_at/i);
  assert.match(hardeningSql, /v_reviewed_at > p_signed_at or v_reviewed_at > clock_timestamp\(\)/i);
  assert.match(hardeningSql, /expires_at > clock_timestamp\(\)/i);
  assert.match(hardeningSql, /reviewerCredentialVersion/i);
  assert.match(hardeningSql, /credentialApprovedBy/i);
  assert.match(hardeningSql, /credentialApprovedAt/i);
  assert.match(hardeningSql, /student-payload-safety/i);
  assert.match(hardeningSql, /revoke all on table public\.gfield_math_private_release_manifests from service_role/i);
  assert.match(hardeningSql, /grant select on table public\.gfield_math_private_release_manifests to service_role/i);
  assert.match(hardeningSql, /gfield_math_private_item_revisions_no_presigned_insert/i);
  assert.match(hardeningSql, /gfield_math_reject_future_private_evidence/i);
  assert.match(hardeningSql, /gfield_math_stamp_reviewer_credential_revocation/i);
});

test("direct service-role RPC commits require a Vault-backed HMAC proof", function () {
  assert.match(hardeningSql, /create extension if not exists pgcrypto with schema extensions/i);
  assert.match(hardeningSql, /create extension if not exists supabase_vault cascade/i);
  assert.match(hardeningSql, /revoke all on schema vault from public, anon, authenticated, service_role/i);
  assert.match(hardeningSql, /revoke all privileges on all tables in schema vault from public, anon, authenticated, service_role/i);
  assert.match(hardeningSql, /revoke all privileges on all sequences in schema vault from public, anon, authenticated, service_role/i);
  assert.match(hardeningSql, /revoke all privileges on all functions in schema vault from public, anon, authenticated, service_role/i);
  assert.doesNotMatch(hardeningSql, /grant[\s\S]{0,120}(?:vault\.|schema vault)[\s\S]{0,120}service_role/i);
  assert.match(hardeningSql, /gfield_vault_owner_access/i);
  assert.match(hardeningSql, /grant usage on schema vault to %I/i);
  assert.match(hardeningSql, /grant select on table vault\.decrypted_secrets to %I/i);
  assert.match(hardeningSql, /gfield_vault_acl_gate/i);
  assert.match(hardeningSql, /has_schema_privilege\(v_role, 'vault', 'USAGE'\)/i);
  assert.match(hardeningSql, /has_table_privilege\(v_role, c\.oid, 'SELECT'\)/i);
  assert.match(hardeningSql, /has_function_privilege\(v_role, p\.oid, 'EXECUTE'\)/i);
  assert.match(hardeningSql, /where d\.name = 'gfield_boarding_release_commit_hmac_v1'/i);
  assert.match(hardeningSql, /v_commit_secret ~ '\[\^!-~\]'/i);
  assert.match(hardeningSql, /octet_length\(convert_to\(v_commit_secret, 'UTF8'\)\) not between 32 and 512/i);
  assert.doesNotMatch(hardeningSql, /\{32,512\}/);
  assert.match(hardeningSql, /extensions\.hmac\(v_commit_material, v_commit_secret, 'sha256'\)/i);
  assert.match(hardeningSql, /p_manifest_canonical_json::jsonb is distinct from p_manifest_payload/i);
  assert.match(hardeningSql, /p_commit_proof_base64url/i);
  assert.match(hardeningSql, /6SY-ZRFr3HOISOUegXnre5_DoiFgr6lpHvAb1kUYSw8/);
  assert.match(signer, /GFIELD_BOARDING_DB_COMMIT_HMAC_SECRET/);
  assert.match(signer, /createReleaseCommitProofBase64url\(/);
  assert.match(signer, /p_manifest_canonical_json: manifestCanonicalJson/);
  assert.match(signer, /p_commit_proof_base64url: commitProofBase64url/);
  assert.match(commitProof, /manifestCanonicalJson/);
  assert.match(commitProof, /encoder\.encode\(value\)\.length/);
  assert.match(readme, /service role, Auth Admin surface,[\s\S]*trusted-computing boundary/i);
  assert.match(readme, /external approval signature or isolated signing service/i);
  assert.doesNotMatch(readme, /blocks a leaked `service_role` key by itself/i);
});

test("edge function requires a verified active admin and does not trust metadata", function () {
  assert.match(config, /\[functions\.boarding-item-signer\][\s\S]*verify_jwt\s*=\s*true/i);
  assert.match(signer, /userClient\.auth\.getUser\(token\)/);
  assert.match(signer, /from\("gfield_math_accounts"\)[\s\S]*account\.status !== "active"\s*\|\|\s*account\.role !== "admin"/);
  assert.doesNotMatch(signer, /user_metadata|app_metadata|raw_user_meta_data/i);
  assert.match(signer, /body\.action !== "sign-item-release"/);
  assert.match(signer, /request\.method !== "POST"/);
});

test("signer verifies exact hashes, rights bindings, reviews, and commits only a signed manifest", function () {
  ["public_hash_invalid", "private_hash_invalid", "rubric_hash_invalid", "rights_hash_invalid", "review_hash_invalid"].forEach(function (code) {
    assert.match(signer, new RegExp(code));
  });
  assert.match(signer, /payload\.rightsRecordId !== expectedRights\.rightsRecordId/);
  assert.match(signer, /payload\.reviewedRightsHash !== expectedRights\.rightsRecordSha256/);
  assert.match(signer, /reviewedRightsAssetKeys\.has\("__item__"\)/);
  assert.match(signer, /crypto\.subtle\.importKey\(\s*"jwk",\s*jwk,\s*\{\s*name:\s*"Ed25519"/);
  assert.match(signer, /service\.rpc\(\s*"gfield_math_commit_signed_release"/);
  assert.match(signer, /assertReleasePayloadHash\(kind, payload, hash\)/);
  ["public-payload", "private-spec", "rubric", "rights-record", "review-record"].forEach(function (kind) {
    assert.match(signer, new RegExp(`"${kind}"`));
  });
  assert.match(releasePayloadHash, /embeddedSha256 !== expectedSha256[\s\S]*expectedSha256 !== recomputedSha256/);
  assert.match(signer, /validateSignerItemPayloads\(\{/);
  assert.match(signer, /validateSignerRightsPayload\(\{/);
  assert.match(signer, /validateSignerReviewPayload\(\{/);
  assert.match(payloadGuard, /asset_bytes_verification_unavailable/);
  assert.match(hardeningSql, /jsonb_array_length\(p_expected_public_payload->'assets'\) <> 0[\s\S]*asset bytes are not yet server-verifiable/i);
  assert.match(payloadGuard, /public_answer_leak_detected/);
  assert.match(payloadGuard, /REVIEWER_ROLE_BY_TYPE/);
  assert.doesNotMatch(signer, /from\("gfield_math_private_release_manifests"\)\.insert/);
  assert.match(signer, /return \{\s*releaseId: manifest\.releaseId,\s*itemId,\s*itemVersion,\s*publicPayloadSha256: publicHash,\s*releaseState: "signed",?\s*\}/);
});

test("manifest hash and signature cover the entire canonical manifest", function () {
  assert.match(signer, /const manifestSha256 = await sha256CanonicalJson\(manifest\)/);
  assert.match(signer, /new TextEncoder\(\)\.encode\(canonicalizeJson\(manifest\)\)/);
  assert.doesNotMatch(signer, /canonicalReleasePayloadMaterial\([^\n]*manifest/);
});

test("the signer has a tight CORS boundary and never enables a wildcard origin", function () {
  assert.match(signer, /GFIELD_BOARDING_ALLOWED_ORIGINS/);
  assert.match(signer, /access-control-allow-methods": "POST, OPTIONS"/);
  assert.doesNotMatch(signer, /access-control-allow-origin"\s*[:,]\s*"\*"/i);
});
