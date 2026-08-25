"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const bankCore = require("../data/question-bank-core.js");

const root = path.join(__dirname, "..");
const migration = fs.readFileSync(path.join(root, "supabase", "migrations", "20260825092754_highselect_secure_draft_foundation.sql"), "utf8");
const config = fs.readFileSync(path.join(root, "supabase", "config.toml"), "utf8");

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
});

test("Supabase contracts match the current opaque IDs and guarded local auth defaults", () => {
  assert.match(bankCore.createNeutralId("examDraft", "SH", "supabase-draft"), /^drf-sh-[a-f0-9]{16}$/);
  assert.match(bankCore.createNeutralId("placement", "SH", "supabase-placement"), /^plc-sh-[a-f0-9]{16}$/);
  assert.match(bankCore.createSharedBankId("question", "supabase-candidate"), /^qst-bnk-[a-f0-9]{16}$/);
  assert.match(bankCore.createSharedBankId("type", "supabase-type"), /^typ-bnk-[a-f0-9]{16}$/);
  assert.match(config, /enable_signup = false/);
  assert.match(config, /minimum_password_length = 12/);
  assert.match(config, /password_requirements = "lower_upper_letters_digits_symbols"/);
  assert.match(config, /\[auth\.mfa\.totp\][\s\S]*enroll_enabled = true[\s\S]*verify_enabled = true/);
  assert.match(config, /\[realtime\]\s+enabled = false/);
  assert.match(config, /\[storage\.vector\]\s+enabled = false/);
  assert.match(config, /\[analytics\]\s+enabled = false/);
  assert.doesNotMatch(config, /sb_(?:secret|service_role)_/i);
});
