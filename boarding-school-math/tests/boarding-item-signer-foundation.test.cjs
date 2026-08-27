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
const signer = fs.readFileSync(path.join(root, "supabase", "functions", "boarding-item-signer", "index.ts"), "utf8");
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

test("release commit is atomic and service-role-only without security definer", function () {
  assert.match(sql, /create or replace function public\.gfield_math_commit_signed_release/i);
  assert.match(sql, /security invoker/i);
  assert.doesNotMatch(sql, /gfield_math_commit_signed_release[\s\S]*security definer/i);
  assert.match(sql, /revoke all on function public\.gfield_math_commit_signed_release[\s\S]*from public, anon, authenticated/i);
  assert.match(sql, /grant execute on function public\.gfield_math_commit_signed_release[\s\S]*to service_role/i);
  assert.match(sql, /update public\.gfield_math_private_item_revisions[\s\S]*insert into public\.gfield_math_private_release_manifests/i);
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
  assert.doesNotMatch(signer, /from\("gfield_math_private_release_manifests"\)\.insert/);
  assert.match(signer, /return \{\s*releaseId: manifest\.releaseId,\s*itemId,\s*itemVersion,\s*publicPayloadSha256: publicHash,\s*releaseState: "signed",?\s*\}/);
});

test("the signer has a tight CORS boundary and never enables a wildcard origin", function () {
  assert.match(signer, /GFIELD_BOARDING_ALLOWED_ORIGINS/);
  assert.match(signer, /access-control-allow-methods": "POST, OPTIONS"/);
  assert.doesNotMatch(signer, /access-control-allow-origin"\s*[:,]\s*"\*"/i);
});
