"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const contracts = require("./source-6-2-notched-mission5-contracts.js");
const { independent, auditModel, assertFrozen, auditPrivateEvidence } = require("./source-6-2-notched-mission5-models-audit.js");
const sourceItemId = "6-2-u3-e2-mission-5";
const learner_stage = "초등 6학년 2학기 · 황소 심화 · 공간과 입체";
const criteria = ["language", "representations", "prerequisites", "reasoning-load", "response-mode"];
const clean = value => JSON.parse(JSON.stringify(value));
function evaluate(expression) {
  assert(/^[0-9+×=-]+$/.test(expression));
  const parts = expression.split("="); assert.equal(parts.length, 2);
  const tokens = parts[0].match(/\d+|[+×-]/g);
  let term = Number(tokens[0]), total = 0, sign = 1;
  for (let i = 1; i < tokens.length; i += 2) {
    const op = tokens[i], value = Number(tokens[i + 1]);
    assert(Number.isSafeInteger(value));
    if (op === "×") term *= value;
    else { total += sign * term; sign = op === "+" ? 1 : -1; term = value; }
  }
  assert.equal(total + sign * term, Number(parts[1]));
}
function auditRows(actual, expected) {
  assert.equal(actual.length, expected.layers.length);
  actual.forEach((row, index) => {
    const layer = expected.layers[index];
    assert.equal(row.layer, layer.layer); assert.equal(row.side, layer.side);
    assert.equal(row.total, layer.cells.length); assert.equal(row.hidden, layer.hiddenCells.length);
    assert.equal(row.visible, layer.visibleCells.length);
    evaluate(row.cubeEquation); evaluate(row.hiddenEquation);
    assert.equal(Number(row.cubeEquation.split("=")[1]), row.total);
    assert.equal(Number(row.hiddenEquation.split("=")[1]), row.hidden);
    const counts = Array.from({ length: layer.side }, (_, z) => layer.hiddenCells.filter(cell => cell[1] === z).length).filter(Boolean);
    assert.equal(row.hiddenEquation, `${counts.join("+") || "0"}=${row.hidden}`);
    assert.equal(row.cubeEquation, layer.side === 1 ? "1=1" : `${layer.side}×${layer.side}${expected.filled ? "" : "-1"}=${row.total}`);
  });
}
function auditContract(q, variant, level) {
  const n = [6, 5, 7][variant], expected = independent(n), filled = independent(n, true);
  assert.equal(q.sourceItemId, sourceItemId); assert.equal(q.variant, variant); assert.equal(q.level, level);
  assert.equal(q.learner_stage, learner_stage); assert.equal(q.learnerFitGate.id, "learner-fit");
  assert.equal(q.learnerFitGate.learner_stage, learner_stage);
  assert.deepEqual(Object.keys(q.learnerFitGate.criteria).sort(), [...criteria].sort());
  assert.deepEqual(q.learnerFitGate.criteria, q.learnerFitCriteria);
  assert.equal(q.learnerFitGate.status, "pending-human-review");
  criteria.forEach(name => assert(q.learnerFitCriteria[name].length > 10));
  auditModel(q.model, n); auditRows(q.rows, expected);
  assert.equal(q.sourceTotal, expected.layers.reduce((a, layer) => a + layer.cells.length, 0));
  assert.equal(q.resultContract, level === 2 ? "ordered" : "single-value");
  assert.equal(q.answerContract.kind, q.resultContract); assert.equal(q.answerContract.valueType, "integer");
  assert.deepEqual(q.answerOrder, level === 2 ? ["original", "filled"] : ["original"]);
  assert.deepEqual(q.answerContract.order, q.answerOrder);
  assert.deepEqual(q.answer, level === 2 ? [expected.counts.difference, filled.counts.difference] : level === 0 ? expected.counts.hidden : expected.counts.difference);
  (Array.isArray(q.answer) ? q.answer : [q.answer]).forEach(answer => assert(Number.isSafeInteger(answer)));
  const omitted = 2;
  assert.equal(q.givenOmittedBottomLayers, omitted);
  const labels = Array.from({ length: n - omitted }, (_, i) => i + 1 + omitted);
  assert.deepEqual(q.layerLabels, labels); assert.deepEqual(q.givenModel.layerLabels, labels);
  assert.equal(q.givenModel.givenOmittedBottomLayers, omitted);
  assert.equal(q.givenModel.complete, false); assert.equal(q.givenModel.ellipsisBelow, true);
  assert.deepEqual(q.givenModel.layers, q.model.layers.slice(omitted).map(layer => ({
    layer: layer.layer, y: layer.y, side: layer.side, cells: layer.cells })));
  assert.deepEqual(q.givenModel.cubes, q.model.cubes.filter(cube => cube[1] >= omitted));
  assert(q.givenModel.cubes.every(([x, y, z]) => y >= omitted && x < n - y && z < n - y));
  assert.equal(q.layerCue, null); assert(!Object.hasOwn(q.givenModel, "H"));
  if (level === 2) {
    assert.deepEqual(Object.keys(q.filledModel).sort(), ["H", "cubes", "layers"]);
    assert.deepEqual(q.filledModel.H, filled.H);
    assert.deepEqual(q.filledModel.cubes.map(c => c.join(",")).sort(), filled.cubes.map(c => c.join(",")).sort());
    q.filledModel.layers.forEach((layer, i) => {
      assert.equal(layer.layer, i + 1);
      for (const name of ["cells", "visibleCells", "hiddenCells"]) {
        assert.deepEqual(layer[name].map(c => c.join(",")).sort(), filled.layers[i][name].map(c => c.join(",")).sort());
      }
      assert.equal(layer.count, filled.layers[i].count); assert.equal(layer.occupied, filled.layers[i].occupied);
    });
    auditRows(q.filledRows, filled);
    assert(q.promptText.includes("(1)") && q.promptText.includes("(2)"));
    assert(q.promptText.includes("맨 위층을 제외한 각 층"));
  } else { assert.equal(q.filledModel, null); assert.equal(q.filledRows, null); }
  assert.deepEqual(Object.keys(q.studentGiven).sort(), ["givenModel", "layerCue", "promptText"]);
  assert.deepEqual(q.studentGiven, { givenModel: q.givenModel, layerCue: q.layerCue, promptText: q.promptText });
  const forbiddenKeys = /^(answer|hidden|hiddenCells|hiddenCount|visibleCells|counts|solution|solutionText|rows|filledModel)$/;
  function answerSafe(value) {
    if (value && typeof value === "object") Object.entries(value).forEach(([key, child]) => {
      assert(!forbiddenKeys.test(key), `Answer-bearing field in studentGiven: ${key}`); answerSafe(child);
    });
  }
  answerSafe(q.studentGiven);
  assert(q.promptText.includes(`쌓기나무를 ${n}층까지`));
  assert(q.promptText.includes(q.learnerConditions[0])); assert(q.promptText.includes(q.learnerConditions[1]));
  assert(q.promptText.includes("아래 두 층을 생략했습니다"));
  assert(!/층에는 \d+개|층별 개수|전체 개수는|<table/.test(q.promptText));
  assert(q.promptText.includes("뒤쪽의 면도 포함") && q.promptText.includes("바닥에 닿은 면도 보이는"));
  assert(q.promptText.includes(level === 0 ? "보이지 않는 쌓기나무는 모두 몇 개인지" : "보이는 쌓기나무의 개수에서 보이지 않는 쌓기나무의 개수를 뺀"));
  assert(q.solutionText.includes("여섯 면이 모두 다른 쌓기나무와 맞닿은"));
  assert(q.solutionText.includes("1층은 바닥에 닿은 면이 보이므로"));
  const forbiddenLanguage = /거듭제곱|제곱합|세제곱|조합|이항|\^|\*\*|[a-zA-Z]\s*[+×=-]\s*[a-zA-Z0-9]/;
  assert(!forbiddenLanguage.test(q.promptText + q.solutionText.replace(/<[^>]+>/g, "")));
  const explanationEquationCount = m => n + m.layers.filter(layer => layer.hiddenCells.length > 0).length + 4;
  const equationCount = level === 0 ? expected.layers.filter(layer => layer.hiddenCells.length > 0).length + 1 : explanationEquationCount(expected) + (level === 2 ? explanationEquationCount(filled) : 0);
  assert.equal(q.solutionEquations.length, equationCount);
  assert(!q.solutionText.includes("0=0"));
  assert(!/<\/span>\s*개/.test(q.solutionText));
  assert.equal((q.solutionText.match(/<p>/g) || []).length, level === 2 ? 8 : level === 0 ? 2 : 4);
  assert.equal((q.solutionText.match(/<\/p>/g) || []).length, level === 2 ? 8 : level === 0 ? 2 : 4);
  q.solutionEquations.forEach(span => {
    const match = span.match(/^<span class="math-inline-expression" style="white-space:nowrap;color:#000">([0-9+×=-]+)<\/span>$/);
    assert(match); assert(match[1].length <= 30); evaluate(match[1]); assert(q.solutionText.includes(span));
  });
  const actualSpans = [...q.solutionText.matchAll(/<span[^>]*>[0-9+×=-]+<\/span>/g)].map(match => match[0]);
  assert.deepEqual(actualSpans, q.solutionEquations);
  assert.equal(q.difficultyDesign.sourceReferenceLevel, 1); assert.equal(q.difficultyDesign.sourceReferenceLayers, 6);
  assert.equal(q.difficultyDesign.full3DGiven, false);
  assert.equal(q.difficultyDesign.empiricallyCalibrated, false);
  assert.equal(q.sourcepolicy.originalQuestionScope, "visible minus hidden only");
  assert.equal(q.sourcepolicy.hardQuestionScope, "same difference after filling each non-top front corner");
  assert.equal(q.sourcepolicy.sourceOnlyFutureAndVisibilityClarified, true);
  assert.equal(q.sourcepolicy.parentAutomaticallyApprovesHandwrittenAnswers, false);
  assert.equal(q.originalSourceReleaseStatus, "locked"); assert.equal(q.sourceExact, false);
  for (const name of ["officialAnswerVerified", "publisherAnswerVerified", "handwrittenAnswerVerified", "humanApproved",
    "teacherReleaseVerified", "learnerReleaseVerified", "sourceFidelityVerified", "renderedFidelityVerified",
    "difficultyVerified", "independentMathReviewVerified", "constructionConditionApproved", "empiricallyCalibrated"]) {
    assert.equal(q[name], false); assert.equal(q.sourcepolicy[name], false);
  }
  assert.equal(q.requestedAnswerUnique, true);
  return equationCount;
}
function run() {
  let questionCases = 0, equationCases = 0, layerCases = 0;
  for (let variant = 0; variant < 3; variant++) for (let level = 0; level < 3; level++) {
    const q = contracts.generate(sourceItemId, variant, level);
    equationCases += auditContract(q, variant, level); assertFrozen(q);
    layerCases += q.givenModel.layers.length; questionCases++;
  }
  const invalid = [
    ["other", 0, 1], [null, 0, 1], [undefined, 0, 1], [sourceItemId, 3, 1], [sourceItemId, -1, 1],
    [sourceItemId, "0", 1], [sourceItemId, null, 1], [sourceItemId, NaN, 1], [sourceItemId, Infinity, 1],
    [sourceItemId, 1.5, 1], [sourceItemId, true, 1], [sourceItemId, {}, 1], [sourceItemId, undefined, 1],
    ...[undefined, null, -1, 3, NaN, Infinity, "1", 1.5, true, {}, []].map(level => [sourceItemId, 0, level])
  ];
  invalid.forEach(args => assert.throws(() => contracts.generate(...args), RangeError));
  const original = contracts.generate(sourceItemId, 0, 2);
  const mutations = [
    q => { q.answer.reverse(); }, q => { q.answerOrder.reverse(); }, q => { q.resultContract = "set"; },
    q => { q.givenOmittedBottomLayers = 0; }, q => { q.layerLabels[0] = 1; },
    q => { q.givenModel.cubes.push([0, 0, 0]); }, q => { q.givenModel.layers[0].layer = 2; },
    q => { q.givenModel.layers[0].cells.push([3, 3]); }, q => { q.rows[1].hidden++; },
    q => { q.filledModel.H[0][0]--; }, q => { q.filledModel.cubes.pop(); },
    q => { q.filledModel.layers[0].occupied--; }, q => { q.filledRows[1].hiddenEquation = "0=0"; },
    q => { q.studentGiven.answer = q.answer; }, q => { q.solutionEquations[0] = "<span>1=1</span>"; },
    q => { q.learner_stage = "other"; }, q => { delete q.learnerFitCriteria.language; },
    q => { q.publisherAnswerVerified = true; }, q => { q.humanApproved = true; },
    q => { q.difficultyDesign.empiricallyCalibrated = true; }, q => { q.sourceTotal++; },
    q => { q.sourcepolicy.parentAutomaticallyApprovesHandwrittenAnswers = true; },
    q => { q.sourcepolicy.sourceOnlyFutureAndVisibilityClarified = false; },
    q => { q.solutionText += "0=0"; },
    q => { q.solutionText = q.solutionText.replace("</span>", "</span>개"); },
    q => { q.promptText = q.promptText.replace("바닥에 닿은 면도 보이는", "바닥에 닿은 면은 안 보이는"); }
  ];
  mutations.forEach(mutate => { const q = clean(original); mutate(q); assert.throws(() => auditContract(q, 0, 2)); });
  let immutableMutations = 0;
  for (const mutate of [() => { original.answer.reverse(); }, () => { original.givenModel.cubes.pop(); },
    () => { original.filledModel.H[0][0] = 0; }, () => { original.learnerFitCriteria.language = "other"; },
    () => { original.solutionEquations.push("1=1"); }, () => { original.studentGiven.answer = 0; }]) {
    assert.throws(mutate, TypeError); immutableMutations++;
  }
  const context = vm.createContext({});
  for (const file of ["source-6-2-notched-mission5-models.js", "source-6-2-notched-mission5-contracts.js"]) {
    vm.runInContext(fs.readFileSync(path.join(__dirname, file), "utf8"), context);
  }
  for (let variant = 0; variant < 3; variant++) for (let level = 0; level < 3; level++) {
    const q = clean(context.HSE_SOURCE_GRADE6_NOTCHED_MISSION5_CONTRACTS.generate(sourceItemId, variant, level));
    auditContract(q, variant, level); assert.deepEqual(q, clean(contracts.generate(sourceItemId, variant, level)));
  }
  assert.throws(() => vm.runInNewContext(fs.readFileSync(path.join(__dirname, "source-6-2-notched-mission5-contracts.js"), "utf8")));
  const privateEvidence = auditPrivateEvidence(process.env, process.argv.includes("--require-private"));
  return { status: "passed", questionCases, equationCases, givenLayerCases: layerCases, umdCases: 9,
    dependencyOrderNegatives: 1, invalidParameters: invalid.length, rejectedContractMutations: mutations.length,
    immutableMutations, learner_stage, learnerFitCriteria: criteria, learnerFitGate: "technical-check-passed-human-review-pending",
    privateEvidence, sourceExact: false, originalSourceReleaseStatus: "locked", officialAnswerVerified: false,
    handwrittenAnswerVerified: false, humanApproved: false, independentMathReviewVerified: false,
    teacherReleaseVerified: false, learnerReleaseVerified: false, browserVerified: false, renderedFidelityVerified: false };
}
module.exports = { auditContract, evaluate, run };
if (require.main === module) console.log(JSON.stringify(run()));
