import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile, stat } from "node:fs/promises";
import { book07Markup } from "./book07-renderers.js";

const normalizedPath = process.env.FIELDS_GOLDEN_BELL_BOOK07_NORMALIZED;
assert.ok(normalizedPath, "FIELDS_GOLDEN_BELL_BOOK07_NORMALIZED is required");

const normalized = JSON.parse((await readFile(normalizedPath, "utf8")).replace(/^\uFEFF/, ""));
assert.equal(normalized.bookId, "book-07");
assert.equal(normalized.updates?.length, 2, "book07 recovery must have two lesson updates");

const learnerStage = "7세 8월부터 초등 1학년 초반 · 필즈 더 클래식 1과정";
const expectedIds = new Set([
  "book07-recovery-s22-04-35",
  "book07-recovery-s22-04-77",
  "book07-recovery-s22-04-131",
  "book07-recovery-s38-03"
]);
const expectedSourceNos = new Map([
  ["book07-recovery-s22-04-35", "확인 04-(1)"],
  ["book07-recovery-s22-04-77", "확인 04-(2)"],
  ["book07-recovery-s22-04-131", "확인 04-(3)"],
  ["book07-recovery-s38-03", "확인 03"]
]);
const seenIds = new Set();
const sourceDigests = new Map();
let itemCount = 0;

function numeric(value, label) {
  const number = Number(value);
  assert.ok(Number.isFinite(number), `${label} must be numeric`);
  return number;
}

function assertLearnerFit(item) {
  assert.equal(item.learnerFit?.learner_stage, learnerStage);
  for (const field of ["language", "representations", "prerequisites", "reasoning-load", "response-mode"]) {
    assert.equal(typeof item.learnerFit[field], "string", `missing learner-fit ${field}`);
    assert.ok(item.learnerFit[field].trim(), `empty learner-fit ${field}`);
  }
}

function assertEvidence(item) {
  const evidence = item.evidence;
  assert.ok(evidence && typeof evidence.sourcePath === "string");
  assert.match(evidence.fingerprint, /^[0-9a-f]{64}$/iu);
  assert.equal(typeof evidence.officialAnswer, "string");
  assert.ok(evidence.review?.trim());
  assert.ok(evidence.sourceRender?.toLowerCase().endsWith(".png"));
  return evidence;
}

function verifySequence(item) {
  const values = item.visual?.values;
  assert.equal(item.visual?.subtype, "sequence");
  assert.ok(Array.isArray(values) && values.length >= 2);
  const start = numeric(values[0], `${item.id} start`);
  const step = numeric(item.visual.step, `${item.id} step`);
  const target = numeric(item.visual.target, `${item.id} target`);
  const distance = target - start;
  assert.equal(distance % step, 0, `${item.id} target is not on the source sequence`);
  const moves = distance / step;
  const expected = moves + 1;
  assert.equal(item.answer, String(expected), `${item.id} answer does not match independent sequence calculation`);
  for (const number of [start, target, distance, step, moves, expected]) {
    assert.match(item.solution, new RegExp(String(number).replace("-", "\\-"), "u"), `${item.id} solution omits numeric step ${number}`);
  }
  assert.equal(item.visual.position, "?");
  assert.equal(item.visual.sourceLayout, true);
  assert.match(item.prompt, /똑같은 수를 더하여/u);
  const markup = book07Markup(item.visual);
  assert.match(markup, /b7-source-sequence/u);
  assert.doesNotMatch(markup, /씩/u, "Do not show a solved step size on the source question");
  assert.match(item.prompt, new RegExp(String(target), "u"));
}

function verifyExchange(item) {
  const visual = item.visual;
  assert.equal(visual?.subtype, "exchange");
  assert.equal(visual.initialLabel, "판");
  assert.equal(visual.tokenLabel, "쿠폰");
  assert.equal(visual.tokenUnit, "장");
  assert.equal(visual.rewardLabel, "피자 1판");
  assert.equal(visual.sourceLayout, true);
  assert.equal((book07Markup(visual).match(/<span>/g) || []).length, visual.rate, "Each exchange coupon must be visible");
  const rate = numeric(visual.rate, `${item.id} rate`);
  let total = numeric(visual.initial, `${item.id} initial`);
  let coupons = total;
  const numericSteps = [total];
  while (coupons >= rate) {
    const extra = Math.floor(coupons / rate);
    total += extra;
    coupons = coupons % rate + extra;
    numericSteps.push(extra, coupons, total);
  }
  assert.ok(coupons < rate, `${item.id}: exchange must stop below the coupon threshold`);
  assert.equal(item.answer, String(total), `${item.id} answer does not match independent exchange calculation`);
  for (const number of numericSteps) assert.match(item.solution, new RegExp(String(number), "u"), `${item.id} solution omits numeric step ${number}`);
  assert.match(item.solution, new RegExp(`${coupons}[^0-9]{0,20}${rate}`, "u"), `${item.id} solution omits the final below-threshold proof`);
  assert.match(item.solution, /더 교환할 수 없습니다/u, `${item.id} solution omits the stopping conclusion`);
  assert.match(item.prompt, /피자/u);
  assert.match(item.prompt, /쿠폰/u);
}

for (const update of normalized.updates) {
  assert.ok(["arithmetic-sequence", "reverse-growth"].includes(update.lessonId));
  assert.equal(update.appendItems?.length, update.lessonId === "arithmetic-sequence" ? 3 : 1);
  for (const item of update.appendItems) {
    assert.ok(expectedIds.has(item.id), `${item.id}: unexpected recovery id`);
    assert.ok(!seenIds.has(item.id), `${item.id}: duplicate recovery id`);
    seenIds.add(item.id);
    itemCount += 1;
    for (const field of ["id", "sourceNo", "sourceLocator", "typeLabel", "prompt", "answer", "solution"]) {
      assert.equal(typeof item[field], "string", `${item.id}: missing ${field}`);
      assert.ok(item[field].trim(), `${item.id}: empty ${field}`);
    }
    assert.equal(item.sourceNo, expectedSourceNos.get(item.id), `${item.id}: sourceNo must use the source question number`);
    assert.equal(item.answerMode, "input");
    assert.equal(item.inputMode, "numeric");
    assert.equal("parts" in item, false, `${item.id}: scalar recovery item must not contain parts`);
    assertLearnerFit(item);
    const evidence = assertEvidence(item);
    assert.equal(evidence.officialAnswer, item.answer);
    assert.ok(await stat(evidence.sourcePath));
    assert.ok(await stat(evidence.sourceRender));
    const sourceDigest = createHash("sha256").update(await readFile(evidence.sourcePath)).digest("hex");
    assert.equal(sourceDigest.toUpperCase(), evidence.fingerprint.toUpperCase(), `${item.id}: source fingerprint changed`);
    if (sourceDigests.has(evidence.sourcePath)) assert.equal(sourceDigests.get(evidence.sourcePath), evidence.fingerprint);
    sourceDigests.set(evidence.sourcePath, evidence.fingerprint);
    if (update.lessonId === "arithmetic-sequence") verifySequence(item);
    else verifyExchange(item);
  }
}

assert.deepEqual(seenIds, expectedIds);
assert.equal(itemCount, expectedIds.size);

const pizzaMarkup = book07Markup({
  kind: "book7",
  subtype: "exchange",
  initial: 1,
  rate: 1,
  initialLabel: "판",
  tokenLabel: "쿠폰",
  tokenUnit: "장",
  rewardLabel: "피자 1판"
});
assert.match(pizzaMarkup, /판/u);
assert.match(pizzaMarkup, /쿠폰/u);
assert.match(pizzaMarkup, /피자 1판/u);
assert.doesNotMatch(pizzaMarkup, /빈 병|새 음료/u);

const defaultMarkup = book07Markup({ kind: "book7", subtype: "exchange", initial: 1, rate: 1 });
assert.match(defaultMarkup, /병/u);
assert.match(defaultMarkup, /빈 병/u);
assert.match(defaultMarkup, /새 음료 1병/u);

console.log(`GOLDEN_BELL_BOOK07_RECOVERY_OK items=${itemCount} sources=${sourceDigests.size} renderer=custom-and-default-labels`);
