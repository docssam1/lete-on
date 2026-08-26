"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const root = path.join(__dirname, "..");
const migration = fs.readFileSync(path.join(root, "supabase", "migrations", "20260825092754_highselect_secure_draft_foundation.sql"), "utf8");
const config = fs.readFileSync(path.join(root, "supabase", "config.toml"), "utf8");
const edgeFunction = fs.readFileSync(path.join(root, "supabase", "functions", "draft-admin", "index.ts"), "utf8");

test("Supabase draft foundation stores only protected operational metadata", () => {
  ["hs_staff_accounts", "hs_exam_draft_candidates", "hs_exam_drafts", "hs_exam_draft_placements", "hs_exam_draft_replacements", "hs_exam_draft_audit"].forEach(table => {
    assert.match(migration, new RegExp(`alter table public\\.${table} enable row level security;`));
    assert.match(migration, new RegExp(`revoke all on table public\\.${table} from anon, authenticated;`));
  });
  assert.match(migration, /create schema if not exists highselect_private/);
  assert.match(migration, /highselect_private\.valid_scope/);
  assert.match(migration, /highselect_private\.valid_constraints/);
  assert.match(migration, /unique \(draft_id, item_id\)/);
  assert.match(migration, /unique \(draft_id, sort_order\)/);
  assert.match(migration, /check \(from_item_id <> to_item_id\)/);
  assert.doesNotMatch(migration, /questionText|answerKey|correctAnswer|pdfUrl|sourcePath|storagePath|solutionText/i);
  assert.match(migration, /pg_catalog\.jsonb_object_keys/);
  assert.doesNotMatch(migration, /jsonb_object_length/);
});

test("Supabase contracts keep dedicated opaque IDs and guarded local auth defaults", () => {
  assert.ok(migration.includes("^drf-(sh|dp|wm|ed|dg|sm)-[a-f0-9]{16}$"));
  assert.ok(migration.includes("^plc-(sh|dp|wm|ed|dg|sm)-[a-f0-9]{16}$"));
  assert.ok(migration.includes("^qst-bnk-[a-z0-9]{16}$"));
  assert.ok(migration.includes("^typ-bnk-[a-z0-9]{16}$"));
  assert.match(config, /enable_signup = false/);
  assert.match(config, /minimum_password_length = 12/);
  assert.match(config, /password_requirements = "lower_upper_letters_digits_symbols"/);
  assert.match(config, /\[auth\.mfa\.totp\][\s\S]*enroll_enabled = true[\s\S]*verify_enabled = true/);
  assert.match(config, /\[realtime\]\s+enabled = false/);
  assert.match(config, /\[storage\.vector\]\s+enabled = false/);
  assert.match(config, /\[analytics\]\s+enabled = false/);
  assert.doesNotMatch(config, /sb_(?:secret|service_role)_/i);
});

test("Supabase draft edge gate checks active staff and returns metadata only", () => {
  assert.match(config, /\[functions\.draft-admin\][\s\S]*verify_jwt = true/);
  assert.match(edgeFunction, /user\.app_metadata\?\.gfield_role !== "admin"/);
  assert.match(edgeFunction, /from\("hs_staff_accounts"\)/);
  assert.match(edgeFunction, /staff\?\.status !== "active"/);
  assert.match(edgeFunction, /action === "readiness"/);
  assert.match(edgeFunction, /action === "candidates"/);
  assert.match(edgeFunction, /classification_verified", true/);
  assert.match(edgeFunction, /rights_verified", true/);
  assert.match(edgeFunction, /HIGHSELECT_ALLOWED_ORIGINS/);
  assert.doesNotMatch(edgeFunction, /questionText|answerKey|correctAnswer|pdfUrl|sourcePath|storagePath|solutionText|user_metadata/i);
});
