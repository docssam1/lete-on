import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { GOLDEN_BELL_BOOKS } from "./golden-bell-data.js";
import { GOLDEN_BELL_RECOVERY } from "./golden-bell-recovery-data.js";

let answerRefs = 0;
function auditPublicValue(value, path = "books") {
  if (typeof value === "string") assert.doesNotMatch(value, /(?:[A-Za-z]:[\\/]|file:\/\/)/, `${path}: private local path`);
  if (!value || typeof value !== "object") return;
  for (const key of ["answer", "solution", "privateAnswer", "workedSolution", "workedSteps", "evidence", "sourcePath", "fingerprint"]) {
    assert.equal(Object.hasOwn(value, key), false, `${path}: public ${key} leak`);
  }
  if (Object.hasOwn(value, "answerRef")) answerRefs += 1;
  for (const [key, child] of Object.entries(value)) auditPublicValue(child, `${path}.${key}`);
}

auditPublicValue(GOLDEN_BELL_BOOKS);
assert.equal(GOLDEN_BELL_BOOKS.length, 10, "all ten public books are required");
assert.ok(answerRefs >= 2000, `protected answer references unexpectedly low: ${answerRefs}`);
const baselineRefs = answerRefs;
auditPublicValue(GOLDEN_BELL_RECOVERY, "recovery");

const publicAccountData = await readFile(new URL("../data.js", import.meta.url), "utf8");
assert.doesNotMatch(publicAccountData, /GF[A-Z0-9]{6}/u, "approval code leaked in public data");
assert.match(publicAccountData, /"studentCode":\s*\{\}/u, "public student-code map must be empty");

const client = await readFile(new URL("./golden-bell-protected.js", import.meta.url), "utf8");
assert.doesNotMatch(client, /SERVICE_ROLE|SUPABASE_SECRET/u, "server secret name leaked into browser client");
assert.match(client, /x-fields-session/u, "protected session header missing");

console.log(`GOLDEN_BELL_PROTECTION_OK books=${GOLDEN_BELL_BOOKS.length} answerRefs=${baselineRefs} supplementalRefs=${answerRefs - baselineRefs}`);
