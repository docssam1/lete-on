import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { GOLDEN_BELL_BOOKS as libraryBooks } from "./golden-bell-library.js";
import { GOLDEN_BELL_RECOVERY } from "./golden-bell-recovery-data.js";

const GOLDEN_BELL_BOOKS = libraryBooks.filter((book) => book.courseId === "course-01");

// 출처·교정 메모는 공개 데이터로 나가므로 정답을 글로 적으면 안 된다(원문은 비공개 답안 기록의 sourceNote).
// "교사용 답(□=8)", "공개 답은 2350", "47×50=2350이므로", "(5/12)" 같은 꼴을 막는다. 출처 표기 "답안 슬라이드 2쪽"은 허용.
const NOTE_KEYS = new Set(["sourceLocator", "sourceDiscrepancy", "reason", "note", "sourceNote"]);
const SOURCE_CITATION = /답안\s*(?:PPTX\s*)?슬라이드\s*\d+쪽?/gu;
const NOTE_ANSWER_PATTERNS = [/[□△◇☆]\s*=\s*\d/u, /답(?:은|는|이|을|\(|:)?\s*\d/u, /=\s*\d+\s*(?:이므로|으로|로|입니다)/u, /\d+\s*\/\s*\d+/u];

let answerRefs = 0;
function auditPublicValue(value, path = "books") {
  if (typeof value === "string") assert.doesNotMatch(value, /(?:[A-Za-z]:[\\/]|file:\/\/)/, `${path}: private local path`);
  if (!value || typeof value !== "object") return;
  for (const key of ["answer", "solution", "privateAnswer", "workedSolution", "workedSteps", "evidence", "sourcePath", "fingerprint"]) {
    assert.equal(Object.hasOwn(value, key), false, `${path}: public ${key} leak`);
  }
  if (Object.hasOwn(value, "answerRef")) answerRefs += 1;
  for (const [key, child] of Object.entries(value)) {
    if (typeof child === "string" && NOTE_KEYS.has(key)) {
      const text = child.replace(SOURCE_CITATION, "");
      assert.equal(NOTE_ANSWER_PATTERNS.some((pattern) => pattern.test(text)), false, `${path}.${key}: answer written in public note`);
    }
    auditPublicValue(child, `${path}.${key}`);
  }
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
