import assert from "node:assert/strict";
import { book10SourceAnimation, renderBook10SourceFrame } from "./golden-bell-book10-animation.js";

const quantity = (id, structureKey, equations, prompt = "두 모양의 값을 구하세요.") => ({
  id, structureKey, prompt, typeLabel: "합과 차", visual: { kind: "book10", subtype: "quantity-equations", unit: "g", symbols: [{ label: "<네모>", token: "<" }, { label: "동그라미", token: "●" }], equations }
});
const target = (id, attempts, prompt = "B의 나에 한 번 맞혔을 때의 점수를 구하세요.", parts) => ({
  id, structureKey: "target-score-difference", prompt, parts, typeLabel: "과녁 점수", visual: { kind: "book10", subtype: "target-score", zones: [{ label: "가" }, { label: "나" }], attempts }
});
const enumerate = (rows, limit = 80) => {
  const values = [];
  for (let first = 1; first <= limit; first += 1) for (let second = 1; second <= limit; second += 1) {
    if (rows.every((row) => { const counts = row.terms || row.hits; return counts[0] * first + counts[1] * second === row.total; })) values.push([first, second]);
  }
  return values;
};

// Independent numerical fixtures, not transcriptions of teacher-guide answers.
const symmetric = quantity("synthetic-symmetric", "sum-difference-combine-divide", [{ terms: [1, 2], total: 18 }, { terms: [2, 1], total: 21 }]);
const repeated = quantity("synthetic-repeated", "common-term-elimination", [{ terms: [3, 2], total: 44 }, { terms: [1, 2], total: 24 }]);
const score = target("synthetic-target", [{ label: "A", hits: [2, 1], total: 16 }, { label: "B", hits: [1, 1], total: 10 }]);

for (const item of [symmetric, repeated, score]) {
  const result = book10SourceAnimation(item);
  assert.ok(result, `${item.id} must be supported`);
  assert.equal(result.kind, "source-animation");
  assert.equal(result.sourceItemId, item.id);
  assert.equal(result.problem, item.prompt);
  assert.equal(result.visual, item.visual);
  assert.deepEqual(result.printSteps, result.beats.map((_, index) => index));
  assert.ok(result.beats.every((beat) => beat.durationMs >= 3500 && beat.durationMs <= 5000));
  assert.deepEqual(enumerate(result.model.rows || result.model.attempts), [result.model.values], `${item.id} must have one independently enumerated positive solution`);
  for (const step of result.printSteps) {
    const staticFrame = renderBook10SourceFrame(result, step);
    assert.match(staticFrame, new RegExp(`data-source-item-id=\\"${item.id}\\"`));
    assert.match(staticFrame, /source-animation-b10__conditions/u);
    assert.doesNotMatch(staticFrame, /is-moving|is-animated|is-cancelling/u, "static frames cannot animate");
  }
  const animatedStep = result.beats.findIndex((beat) => ["combine", "cancel", "remove-common"].includes(beat.phase));
  const animated = renderBook10SourceFrame(result, animatedStep, { animate: true });
  assert.match(animated, /is-moving|is-cancelling/u, "animated player frame needs grouped motion classes");
}

const symmetricResult = book10SourceAnimation(symmetric);
const targetReadings = (animation, phase) => {
  const frame = renderBook10SourceFrame(animation, animation.beats.findIndex((beat) => beat.phase === phase));
  return frame.split('aria-label="구할 저울의 무게">')[1].split('source-animation-b10__calculation-area')[0].match(/<b>[^<]+ g<\/b>/g);
};
assert.deepEqual(targetReadings(symmetricResult, "source"), ["<b>? g</b>", "<b>? g</b>", "<b>? g</b>"], "the three requested scales appear before the explanation without answers");
const sourceTargets = renderBook10SourceFrame(symmetricResult, 0).split('aria-label="구할 저울의 무게">')[1].split('source-animation-b10__calculation-area')[0];
assert.equal((sourceTargets.match(/<i aria-hidden="true">\+<\/i>/g) || []).length, 1, "only the two-shape target has a plus sign; single-shape targets have none");
assert.deepEqual(targetReadings(symmetricResult, "divide"), ["<b>13 g</b>", "<b>? g</b>", "<b>? g</b>"], "only the justified pair value is revealed");
assert.deepEqual(targetReadings(symmetricResult, "derive-first"), ["<b>13 g</b>", "<b>8 g</b>", "<b>5 g</b>"], "each requested scale retains its source order");
assert.equal(symmetricResult.model.combinedTotal, symmetric.visual.equations[0].total + symmetric.visual.equations[1].total, "combined total must conserve both source rows");
assert.equal(symmetricResult.model.pairCoefficient * symmetricResult.model.pairValue, symmetricResult.model.combinedTotal, "equal division must conserve the combined total");
const symmetricDivision = book10SourceAnimation(quantity("symmetric-division", "sum-difference-combine-divide", [{ terms: [1, 3], total: 10 }, { terms: [3, 1], total: 14 }]));
assert.ok(symmetricDivision?.beats.some((beat) => beat.phase === "derive-second-divide"), "symmetric derivation keeps a non-unit final division");
assert.match(renderBook10SourceFrame(symmetricDivision, symmetricDivision.beats.findIndex((beat) => beat.phase === "derive-second-divide")), /4 ÷ 2 = 2/u, "symmetric final division is visible");
const repeatedResult = book10SourceAnimation(repeated);
assert.deepEqual(repeatedResult.model.cancellation, [1, 2], "repeated common terms must cancel the exact shared counts");
assert.equal(repeatedResult.model.delta[0] * repeatedResult.model.values[0], repeatedResult.model.deltaTotal, "remaining relation must conserve the difference");
assert.ok(repeatedResult.beats.some((beat) => beat.phase === "substitute-divide"), "repeated-term substitution keeps its final division");
assert.match(renderBook10SourceFrame(repeatedResult, 1), /is-matched/u, "identify beat highlights common tokens");
assert.doesNotMatch(renderBook10SourceFrame(repeatedResult, 1), /is-cancelled/u, "identify beat cannot strike through tokens");
assert.match(symmetricResult.beats.find((beat) => beat.phase === "arrange").caption, /두 모양을 하나씩 짝지어요/u, "pairing caption matches the arranged visual");
const targetResult = book10SourceAnimation(score);
assert.deepEqual(targetResult.model.cancellation, [1, 1], "target records must remove the exact common hits");
assert.equal(targetResult.model.delta[targetResult.model.isolatedIndex] * targetResult.model.values[targetResult.model.isolatedIndex], targetResult.model.deltaTotal, "target difference must conserve score");
assert.match(renderBook10SourceFrame(targetResult, targetResult.beats.findIndex((beat) => beat.phase === "score-difference")), /16 - 10 = 6/u, "target difference writes both original totals before division");
for (const phase of ["match-common", "remove-common"]) {
  const frame = renderBook10SourceFrame(targetResult, targetResult.beats.findIndex((beat) => beat.phase === phase));
  assert.equal((frame.match(/class="source-animation-b10__record"/g) || []).length, 2, `${phase} keeps both working records`);
  assert.equal((frame.match(/class="b10-target-attempt"/g) || []).length, 2, `${phase} keeps both original records`);
}
const structuredTarget = book10SourceAnimation(target("structured-target", [{ label: "A", hits: [2, 1], total: 16 }, { label: "B", hits: [1, 1], total: 10 }], "A의 가에 한 번 맞혔을 때의 점수를 구하세요.", [{ label: "나의 점수" }]));
assert.equal(structuredTarget?.model.requestedIndex, 1, "structured part labels take priority over the prompt fallback");
const targetDivision = book10SourceAnimation(target("target-division", [{ label: "A", hits: [3, 2], total: 23 }, { label: "B", hits: [1, 2], total: 13 }]));
assert.ok(targetDivision?.beats.some((beat) => beat.phase === "isolate-divide"), "target isolation keeps a non-unit division");
assert.ok(targetDivision?.beats.some((beat) => beat.phase === "find-requested-divide"), "target request keeps a non-unit division");
assert.match(renderBook10SourceFrame(targetDivision, targetDivision.beats.findIndex((beat) => beat.phase === "find-requested-divide")), /8 ÷ 2 = 4/u, "target requested-zone division is visible");
assert.match(renderBook10SourceFrame(symmetricResult, 0), /&lt;네모&gt;|&lt;/u, "source labels and tokens must be escaped");

assert.equal(book10SourceAnimation(quantity("ambiguous", "sum-difference-combine-divide", [{ terms: [1, 1], total: 8 }, { terms: [1, 1], total: 8 }])), null, "equal symmetric rows are ambiguous");
assert.equal(book10SourceAnimation(quantity("negative-intermediate", "sum-difference-combine-divide", [{ terms: [2, 1], total: 21 }, { terms: [1, 2], total: 18 }])), null, "this early-grade storyboard cannot introduce negative intermediate quantities");
assert.equal(book10SourceAnimation(quantity("negative", "sum-difference-combine-divide", [{ terms: [1, 2], total: 1 }, { terms: [2, 1], total: 8 }])), null, "negative solutions are rejected");
assert.equal(book10SourceAnimation(quantity("fraction", "common-term-elimination", [{ terms: [3, 1], total: 8 }, { terms: [1, 1], total: 5 }])), null, "noninteger solutions are rejected");
assert.equal(book10SourceAnimation(target("wrong-request", [{ label: "A", hits: [2, 1], total: 16 }, { label: "B", hits: [1, 1], total: 10 }], "A의 가에 한 번 맞혔을 때의 점수를 구하세요.")), null, "ambiguous or mismatched requested zones are rejected");
assert.equal(book10SourceAnimation({ id: "unsupported", structureKey: "anything", prompt: "x", visual: {} }), null, "unsupported structures are rejected");
assert.equal(book10SourceAnimation({ id: "malformed", structureKey: "sum-difference-combine-divide", prompt: "x", visual: { kind: "book10", subtype: "quantity-equations", symbols: [], equations: "not rows" } }), null, "malformed source data is rejected without throwing");

console.log("GOLDEN_BELL_BOOK10_ANIMATION_AUDIT_OK supported=3 enumeration=pass conservation=pass cancellation=pass escape=pass rejection=pass printSteps=pass");
