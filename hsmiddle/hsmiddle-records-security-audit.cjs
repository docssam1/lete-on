#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = __dirname;
const read = file => fs.readFileSync(path.join(root, file), "utf8");
const assert = (condition, message) => { if (!condition) throw new Error(message); };

const data = read("data.js");
const cloud = read("hsm-cloud.js");
const auth = read("shared-auth.js");
const migration = read("../supabase/migrations/20260919170000_secure_hsmiddle_records.sql");
const closeMigration = read("../supabase/migrations/20260919173000_close_direct_hsmiddle_records_access.sql");
const edge = read("../supabase/functions/hsmiddle-records/index.ts");
const pages = ["login.html", "diagnostic.html", "report.html", "exam.html", "admin.html"].map(file => [file, read(file)]);

for (const forbidden of ["studentCode", "studentCodes", "approvalCodes"]) {
  assert(!data.includes(forbidden), `public data leaks credential marker: ${forbidden}`);
}
assert(!/HS-[0-9]{4}/u.test(data) && !/\b[0-9]{11}\b/u.test(data), "public data contains approval-code shaped value");
assert(!/\/rest\/v1\/(hsm_students|hsm_attempts)/.test(cloud), "browser still calls protected tables directly");
assert(cloud.includes("/functions/v1/hsmiddle-records"), "browser edge-function endpoint missing");
assert(cloud.includes('headers["x-hsm-session"]'), "browser session header missing");
assert(!/\.storage\s*\.\s*from\s*\(/u.test(cloud + edge), "Supabase Storage must not receive textbook or exam assets");
assert(!/\/storage\/v1\//u.test(cloud + edge), "Supabase Storage endpoint must not be used");

for (const policy of ["hsm_students_insert", "hsm_students_select", "hsm_attempts_insert", "hsm_attempts_select"]) {
  assert(closeMigration.includes(`drop policy if exists ${policy}`), `public policy not dropped: ${policy}`);
}
for (const table of ["hsm_access_accounts", "hsm_access_sessions", "hsm_students", "hsm_attempts"]) {
  const source = table.startsWith("hsm_access_") ? migration : closeMigration;
  assert(source.includes(`revoke all on public.${table} from public, anon, authenticated`), `direct grants not revoked: ${table}`);
}
assert(!/'[a-f0-9]{64}'/.test(migration), "migration contains reusable approval hash");
assert(!/HS-[0-9]{4}/u.test(migration) && !/\b[0-9]{11}\b/u.test(migration), "migration contains plaintext approval code");
assert(migration.includes("extensions.crypt") && migration.includes("extensions.gen_salt('bf', 12)"), "slow password hashing missing");
assert(migration.includes("hsm_authenticate") && migration.includes("hsm_upsert_access_account"), "server-only account RPC missing");

for (const marker of ["requireSession", "consumeLoginLimit", "validAttemptRecord", "admin_required", "attempt_limit"]) {
  assert(edge.includes(marker), `edge security contract missing: ${marker}`);
}
assert(edge.includes('req.headers.get("x-hsm-session")'), "edge does not authenticate custom session");
assert(edge.includes("correct * 2.5") && edge.includes("states_mismatch"), "score consistency check missing");

for (const [file, source] of pages) {
  assert(!source.includes("isValidStudent("), `${file} still uses public credential validation`);
  assert(!source.includes("writeSession("), `${file} still stores approval code`);
}

function storage() {
  const values = new Map();
  return {
    getItem: key => values.has(key) ? values.get(key) : null,
    setItem: (key, value) => values.set(key, String(value)),
    removeItem: key => values.delete(key),
    key: index => [...values.keys()][index] || null,
    get length() { return values.size; },
  };
}

const localStorage = storage();
const sessionStorage = storage();
const context = { window: {}, localStorage, sessionStorage, console, Date, JSON, String, Number, Array, Boolean, RegExp };
context.window = context;
vm.runInNewContext(auth, context, { filename: "shared-auth.js" });
assert(!context.HSMIDDLE_AUTH.readSession().valid, "empty browser session must be invalid");
localStorage.setItem("hs-student", "probe");
localStorage.setItem("hsm-session-token-v2", "a".repeat(64));
localStorage.setItem("hsm-session-profile-v2", JSON.stringify({ name: "probe", access: ["diagnostic"], admin: false, expiresAt: new Date(Date.now() + 60000).toISOString() }));
const active = context.HSMIDDLE_AUTH.readSession();
assert(active.valid && active.name === "probe" && active.access[0] === "diagnostic", "valid server session not restored");
localStorage.setItem("hsm-session-profile-v2", JSON.stringify({ name: "probe", access: ["diagnostic"], admin: false, expiresAt: new Date(Date.now() - 1000).toISOString() }));
assert(!context.HSMIDDLE_AUTH.readSession().valid, "expired server session must be rejected");

console.log("HSMIDDLE_RECORDS_SECURITY_AUDIT_OK public_credentials=0 pages=5 direct_table_access=0 storage_assets=0");
