import assert from "node:assert/strict";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve, relative, isAbsolute } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";
import { GOLDEN_BELL_BOOKS } from "../fields-classic/question-bank/golden-bell-data.js";

const [baseArg, publicArg, privateArg, ...candidateArgs] = process.argv.slice(2);
assert.ok(baseArg && publicArg && privateArg && candidateArgs.length, "Usage: <private-base-bank> <public-module-output> <private-bank-output> <normalized-candidates...>");
const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const outsideRepo = (name) => {
  const part = relative(root, resolve(name));
  return part.startsWith("..") || isAbsolute(part);
};
assert.ok(outsideRepo(baseArg) && outsideRepo(privateArg) && candidateArgs.every(outsideRepo), "Private source and answers must stay outside the repository");
assert.notEqual(resolve(baseArg), resolve(privateArg), "Do not overwrite the protected baseline");
assert.equal(resolve(publicArg), resolve(root, "fields-classic/question-bank/golden-bell-recovery-data.js"), "Use the dedicated supplemental public module only");
const loadJson = async (name) => JSON.parse((await readFile(name, "utf8")).replace(/^\uFEFF/, ""));
const bank = await loadJson(baseArg);
assert.equal(bank.schemaVersion, 1);
const baseline = structuredClone(bank.books);
const version = "source-recovery-20260906";
const learnerStage = "7세 8월부터 초등 1학년 초반 · 필즈 더 클래식 1과정";
const publicGroups = [];
const protectedKeys = /^(?:answer|solution|privateAnswer|workedSteps|workedSolution|evidence|sourcePath|fingerprint)$/i;
function assertPublic(value) {
  if (typeof value === "string") assert.doesNotMatch(value, /(?:[A-Za-z]:[\\/]|file:\/\/)/, "Private path in public payload");
  if (!value || typeof value !== "object") return;
  for (const [key, child] of Object.entries(value)) {
    assert.ok(!protectedKeys.test(key), `Private field in public payload: ${key}`);
    assertPublic(child);
  }
}
let count = 0;
const allIds = new Set();
for (const filename of candidateArgs) {
  const candidate = await loadJson(filename);
  const book = GOLDEN_BELL_BOOKS.find((entry) => entry.id === candidate.bookId);
  assert.ok(book && bank.books[book.id], "Unknown book");
  const updates = [];
  for (const update of candidate.updates) {
    const lesson = book.lessons.find((entry) => entry.id === update.lessonId);
    assert.ok(lesson?.original?.items && update.appendItems?.length, "Unknown lesson or empty recovery");
    const startGroup = Math.max(0, ...lesson.original.items.map((item) => Number(item.printGroup) || 0));
    const items = update.appendItems.map((item, index) => {
      const key = `${book.id}/${lesson.id}/${item.id}`;
      assert.ok(!allIds.has(key) && !lesson.original.items.some((old) => old.id === item.id), "Duplicate original item");
      allIds.add(key);
      assert.equal(item.learnerFit?.learner_stage, learnerStage);
      for (const field of ["language", "representations", "prerequisites", "reasoning-load", "response-mode"]) assert.ok(item.learnerFit[field]?.trim(), `Missing learner-fit ${field}`);
      for (const field of ["id", "sourceNo", "sourceLocator", "typeLabel", "prompt", "answer", "solution"]) assert.ok(typeof item[field] === "string" && item[field].trim(), `Missing ${field}`);
      assert.ok(item.solution.length >= 40 && item.evidence, "Worked source solution and evidence required");
      assert.ok(!item.parts?.length, "This recovery release accepts only source single-value answers");
      assert.equal(item.answerMode, "input");
      const output = {
        id: item.id, sourceNo: item.sourceNo, sourceLocator: item.sourceLocator,
        typeLabel: item.typeLabel, prompt: item.prompt, visual: item.visual,
        answerMode: "input", inputMode: "numeric", structureKey: lesson.original.structureKey,
        printGroup: startGroup + index + 1
      };
      assertPublic(output);
      const digest = createHash("sha256").update(JSON.stringify(output)).digest("hex").slice(0, 16);
      const answerRef = `/recovery/${version}/${key}/${digest}`;
      assert.ok(!Object.hasOwn(bank.books[book.id], answerRef), "Ref already in baseline: create a new release");
      bank.books[book.id][answerRef] = { answer: item.answer, solution: item.solution };
      count += 1;
      return { ...output, answerRef };
    });
    updates.push({ lessonId: lesson.id, items });
  }
  assert.ok(!publicGroups.some((group) => group.bookId === book.id), "Merge candidates for the same book before building");
  publicGroups.push({ bookId: book.id, updates });
}
for (const [bookId, records] of Object.entries(baseline)) {
  for (const [ref, record] of Object.entries(records)) assert.deepEqual(bank.books[bookId][ref], record, "Existing protected answers changed");
}
const publicText = `/* Generated supplemental source questions. Answers are delivered by the existing protected book endpoint. */\nexport const GOLDEN_BELL_RECOVERY_VERSION = ${JSON.stringify(version)};\nexport const GOLDEN_BELL_RECOVERY = Object.freeze(${JSON.stringify(publicGroups)});\n`;
bank.generatedAt = new Date().toISOString();
bank.recovery = { version, count, publicSha256: createHash("sha256").update(publicText).digest("hex") };
await mkdir(dirname(resolve(privateArg)), { recursive: true });
await writeFile(privateArg, JSON.stringify(bank, null, 2) + "\n");
await writeFile(publicArg, publicText);
console.log(JSON.stringify({ version, addedItems: count, baselineRefs: Object.values(baseline).reduce((sum, records) => sum + Object.keys(records).length, 0), totalRefs: Object.values(bank.books).reduce((sum, records) => sum + Object.keys(records).length, 0) }));
