import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { GOLDEN_BELL_BOOKS } from "./golden-bell-data.js";

let answerRefs = 0;
function auditPublicValue(value, path = "books") {
  if (!value || typeof value !== "object") return;
  assert.equal(Object.hasOwn(value, "answer"), false, `${path}: public answer leak`);
  assert.equal(Object.hasOwn(value, "solution"), false, `${path}: public solution leak`);
  if (Object.hasOwn(value, "answerRef")) answerRefs += 1;
  for (const [key, child] of Object.entries(value)) auditPublicValue(child, `${path}.${key}`);
}

auditPublicValue(GOLDEN_BELL_BOOKS);
assert.equal(GOLDEN_BELL_BOOKS.length, 10, "all ten public books are required");
assert.ok(answerRefs >= 2000, `protected answer references unexpectedly low: ${answerRefs}`);

const publicAccountData = await readFile(new URL("../data.js", import.meta.url), "utf8");
assert.doesNotMatch(publicAccountData, /GF[A-Z0-9]{6}/u, "approval code leaked in public data");
assert.match(publicAccountData, /"studentCode":\s*\{\}/u, "public student-code map must be empty");

const client = await readFile(new URL("./golden-bell-protected.js", import.meta.url), "utf8");
assert.doesNotMatch(client, /SERVICE_ROLE|SUPABASE_SECRET/u, "server secret name leaked into browser client");
assert.match(client, /x-fields-session/u, "protected session header missing");

console.log(`GOLDEN_BELL_PROTECTION_OK books=${GOLDEN_BELL_BOOKS.length} answerRefs=${answerRefs}`);
