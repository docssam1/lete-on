"use strict";
const fs = require("node:fs"), path = require("node:path"), vm = require("node:vm");
const crypto = require("node:crypto"), assert = require("node:assert/strict");
const models = require("./source-6-2-stack-pattern-models.js");
const contracts = require("./source-6-2-t-pattern-example2-contracts.js");
const id = "6-2-u3-e2-example-2", stages = [25, 20, 30];
const easyStages = [3, 2, 1];
const learner_stage = "초등 6학년 2학기 · 황소 심화 · 공간과 입체";
const learnerConditions = "모양의 차례와 같은 수의 층을 쌓습니다. 맨 위층은 세 개를 한 줄로 놓고 가운데 앞에 한 개를 붙입니다. 바로 아래층은 윗층의 자리를 모두 채우고 왼쪽·오른쪽·앞쪽 세 갈래 끝에 각각 한 개를 더 붙입니다. 1층까지 같은 방법으로 쌓고 그 밖에는 놓지 않습니다.";
const criteria = ["language", "representations", "prerequisites", "reasoning-load", "response-mode"];
const contractPath = path.join(__dirname, "source-6-2-t-pattern-example2-contracts.js");
const modelPath = path.join(__dirname, "source-6-2-stack-pattern-models.js");
const evidenceDirectory = process.env.HSE_STACK_PATTERN_EVIDENCE_DIR;
assert(typeof evidenceDirectory === "string" && /^[EG]:[\\/]/i.test(evidenceDirectory) && path.win32.isAbsolute(evidenceDirectory),
  "Set HSE_STACK_PATTERN_EVIDENCE_DIR explicitly to an absolute E: or G: evidence directory");
const sourceDirectory = path.win32.normalize(evidenceDirectory);
assert(/^[EG]:[\\/]/i.test(sourceDirectory), "Evidence directory must remain on E: or G:");
const reportPath = path.join(sourceDirectory, "independent-pattern-review.md");
const cropPath = path.join(sourceDirectory, "example2-2-original.png");
const hashes = {
  model: "F2B17A9146CA34534018D29E750413FA7DA9C4EA57762C024B382BFF989ED1BC",
  report: "8140B3E7AC8200C9F7D15BE163A293AB7272F0C18AF088955A73ACCDAAD541E1",
  crop: "FFDD0604850EE125343A37D7879B7BEFD94128BE455A94BE84619E003D2D2ED0"
};
const hash = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex").toUpperCase();
assert.equal(hash(modelPath), hashes.model); assert.equal(hash(reportPath), hashes.report); assert.equal(hash(cropPath), hashes.crop);
const report = fs.readFileSync(reportPath, "utf8"), sectionStart = report.indexOf("## 4. 예제 2-2: T자 세 갈래 계단");
assert(sectionStart >= 0);
const section = report.slice(sectionStart, report.indexOf("## 5.", sectionStart));
for (const phrase of ["가운데 칸", "T자 4칸", "4,11,21", "76-4=72", "V(25)"]) assert(section.includes(phrase));
const code = fs.readFileSync(contractPath, "utf8"), modelCode = fs.readFileSync(modelPath, "utf8");
assert(!/formulaAudit|model\.answer|model\.totalCubes|model\.layerDifference/.test(code));
const normalize = value => JSON.parse(JSON.stringify(value));
const initialDefinitions = JSON.stringify(models.definitions);
let mutationRejections = 0, equationChecks = 0, invalidInputRejections = 0;
const generatedCases = [], learnerFitCases = [];

// Independent physical construction: extend three endpoints downward, then enumerate every voxel.
function constructByLayers(stage) {
  const footprint = new Set(["-1,0", "0,0", "1,0", "0,1"]), cubes = [], topDown = [];
  for (let layer = stage; layer >= 1; layer--) {
    const cells = [...footprint].map(key => key.split(",").map(Number));
    topDown.push({ layer, count: cells.length, cells });
    cells.forEach(([x, z]) => cubes.push([x, layer - 1, z]));
    if (layer > 1) {
      const crossbar = cells.filter(([, z]) => z === 0).map(([x]) => x);
      const front = cells.filter(([x]) => x === 0).map(([, z]) => z);
      footprint.add(`${Math.min(...crossbar) - 1},0`);
      footprint.add(`${Math.max(...crossbar) + 1},0`);
      footprint.add(`0,${Math.max(...front) + 1}`);
    }
  }
  return { cubes, topDown };
}
function sortedKeys(cubes) { return cubes.map(cube => cube.join(",")).sort(); }
function enumerate(model) {
  const buckets = Array.from({ length: model.n }, () => []), occupied = new Set();
  const heights = Array.from({ length: model.n + 1 }, () => Array(2 * model.n + 1).fill(0));
  for (const cube of model.cubes) {
    assert.equal(cube.length, 3); assert(cube.every(Number.isSafeInteger));
    const [x, y, z] = cube, key = cube.join(",");
    assert(!occupied.has(key), `Duplicate cube: ${key}`); occupied.add(key);
    assert(y >= 0 && y < model.n && z >= 0 && z <= model.n && x >= -model.n && x <= model.n);
    assert(x === 0 || z === 0, "Unexpected fourth arm or rectangular filling");
    buckets[y].push(cube); heights[z][x + model.n]++;
  }
  for (const [x, y, z] of model.cubes) if (y > 0) assert(occupied.has([x, y - 1, z].join(",")), "Unsupported cube");
  assert.deepEqual(model.H, heights); assert.equal(model.xOrigin, -model.n); assert.equal(model.zOrigin, 0);
  const counts = buckets.map(layer => layer.length), total = buckets.reduce((sum, layer) => sum + layer.length, 0);
  const removed = buckets.slice(-3).reduce((sum, layer) => sum + layer.length, 0);
  return { counts, total, difference: counts[0] - counts.at(-1), removed, remaining: total - removed };
}
function frozenTree(value) {
  if (!value || typeof value !== "object") return;
  assert(Object.isFrozen(value)); Object.values(value).forEach(frozenTree);
}
function rejectMutation(action) { assert.throws(action, { name: "TypeError" }); mutationRejections++; }
function policyCheck(q) {
  for (const candidate of [q, q.sourcepolicy]) {
    assert.equal(candidate.originalSourceReleaseStatus, "locked");
    for (const flag of ["originalAnswerDeterminate", "publisherAnswerVerified", "handwrittenAnswerVerified", "sourceExact", "constructionConditionApproved", "officialHumanApproval", "learnerReleaseVerified"]) assert.equal(candidate[flag], false);
    assert.equal(candidate.requestedAnswerUnique, true);
    assert.equal(candidate.uniqueRequestedNumericAnswerUnderConstruction, true);
    assert.equal(candidate.registrationOnly, true); assert.equal(candidate.sourceConditionsClarified, true);
    assert.equal(candidate.sourceConditionProvenance, "explicit-learner-given-conditions");
  }
  assert.equal(q.sourcepolicy.firstThreeForceUniqueFuture, false);
  assert.equal(q.sourcepolicy.answerBasis, "conditional-independent-calculation");
  for (const flag of ["productionLoaded", "catalogUnlock", "deployed"]) assert.equal(q.sourcepolicy[flag], false);
  assert.equal(q.model.officialAnswerVerified, false); assert.equal(q.model.constructionConditionApproved, false);
  assert.equal(q.sourceRef.pdfPage, 32); assert.equal(q.sourceRef.printedPage, 34);
  assert.equal(q.sourceRef.independentReportSha256, hashes.report); assert.equal(q.sourceRef.cropSha256, hashes.crop);
  assert.equal(q.sourcepolicy.sourceEvidence.reportSha256, hashes.report);
  assert.equal(q.sourcepolicy.sourceEvidence.cropSha256, hashes.crop);
  assert.deepEqual(q.sourcepolicy.sourceEvidence.sourceFirstThreeTotals, [4, 11, 21]);
  assert.deepEqual(q.sourcepolicy.sourceEvidence.originalQuestionOrder, ["total-cubes", "ground-layer-minus-25th-layer"]);
  assert.equal(q.sourcepolicy.sourceEvidence.originalRequestedStage, 25);
  assert.equal(q.model.viewConvention.fixedOrientation, true);
  assert.equal(q.model.viewConvention.quotientByRotationOrReflection, false);
  assert.equal(q.model.viewConvention.depthAxis, "z increases toward the front");
}
function equationCheck(q) {
  const inline = [...q.solution.matchAll(/<span class="math-inline-expression">([^<]+)<\/span>/g)].map(match => match[1]);
  assert.deepEqual(inline, q.solutionEquations);
  for (const equation of inline) {
    const match = /^(\d+(?:[+×-]\d+)*)=(\d+)개$/.exec(equation);
    assert(match, `Non-elementary equation: ${equation}`);
    assert(match[1].match(/\d+/g).length <= 6, `Oversized nowrap equation: ${equation}`);
    // Arithmetic parser for natural-number expressions; no evaluation or formula oracle.
    const terms = match[1].match(/[+-]?\d+(?:×\d+)*/g);
    const computed = terms.reduce((sum, term) => sum + term.split("×").reduce((product, number) => product * Number(number), 1), 0);
    assert.equal(computed, Number(match[2]), equation); equationChecks++;
  }
}
function expectedEquations(actual, level) {
  const counts = actual.counts.slice().reverse(), equations = ["3+1=4개", "1+1+1=3개"];
  if (level === 0) {
    return [`${counts.join("+")}=${actual.total}개`];
  } else {
    const pairs = Math.floor(counts.length / 2), sum = counts[0] + counts.at(-1);
    for (let pair = 0; pair < pairs; pair++) {
      assert.equal(counts[pair] + counts[counts.length - 1 - pair], sum);
      if (pair < 2) equations.push(`${counts[pair]}+${counts[counts.length - 1 - pair]}=${sum}개`);
    }
    equations.push(`${sum}×${pairs}=${sum * pairs}개`);
    if (counts.length % 2) equations.push(`${sum * pairs}+${counts[pairs]}=${actual.total}개`);
    equations.push(`${counts.at(-1)}-${counts[0]}=${actual.difference}개`);
    if (level === 2) {
      equations.push(`${counts.slice(0, 3).join("+")}=${actual.removed}개`);
      equations.push(`${actual.total}-${actual.removed}=${actual.remaining}개`);
    }
  }
  return equations;
}
function learnerFitCheck(q, variant, level) {
  assert.equal(q.learner_stage, learner_stage); assert.equal(q.learnerFit.learner_stage, learner_stage);
  assert.equal(q.learnerFit.id, "learner-fit"); assert.deepEqual(q.learnerFit.criteria, criteria);
  const text = `${q.promptText} ${q.solution}`;
  assert(!/\b[ni]\b|\^|\*\*|[²³]|<sup\b|다항식|순열|방정식|일반항|시그마|Σ|∑|max\(/i.test(text));
  assert(q.promptText.includes(q.learnerConditions));
  if (level !== 0) {
    assert.equal(q.learnerConditions, learnerConditions);
    for (const phrase of ["모양의 차례와 같은 수의 층", "세 개를 한 줄", "가운데 앞에 한 개", "윗층의 자리를 모두 채우고", "왼쪽·오른쪽·앞쪽 세 갈래 끝", "각각 한 개를 더", "1층까지 같은 방법", "그 밖에는 놓지 않습니다."]) assert(q.promptText.includes(phrase));
  }
  assert.equal(q.difficultyDesign.mode, ["easy", "source", "hard"][level]);
  assert.equal(q.difficultyDesign.empiricallyCalibrated, false); assert.equal(q.learnerFit.empiricallyCalibrated, false);
  assert.equal(q.learnerFit.humanReviewPending, true);
  assert.deepEqual(q.learnerFit.prerequisites, ["층과 바닥의 구별", "쌓기나무 개수 세기", "자연수의 덧셈·뺄셈·곱셈"]);
  assert.equal(q.learnerFit.responseMode, "ordered-integer-counts"); assert.equal(q.learnerFit.responseCount, level + 1);
  assert.equal(q.resultContract, "ordered"); assert.equal(q.answer.length, level + 1);
  assert(q.answer.every(value => Number.isSafeInteger(value) && value >= 0));
  assert(q.promptText.includes(`${q.model.n}번째`));
  assert(q.solution.includes("T자"));
  if (level !== 0) assert(q.solution.includes("한 층 내려갈 때마다"));
  const allRows = q.model.layerCounts.slice().reverse().map(count => `${count}개`).join(", ");
  if (level !== 0) assert(!q.solution.includes(allRows), "Future-stage solution dumps all layer counts");
  if (level === 0) {
    assert.equal(q.model.n, easyStages[variant]);
    assert(q.promptText.includes("그림에 보이는"));
    assert(!/층별|표|한 층|다음 모양|세 갈래|[=+×]/.test(q.promptText));
    assert.equal((q.promptText.match(/몇 개인지/g) || []).length, 1);
    assert.equal(q.solutionEquations.length, 1);
    assert(!/\(2\)|몇 개 더|제거/.test(q.promptText)); assert(!q.solution.includes("짝지어"));
  } else {
    assert.equal(q.layerCue, null); assert(!q.promptText.includes("층별 개수 표"));
    assert(q.promptText.includes("(1)")); assert(q.promptText.includes("(2)"));
    assert.deepEqual([...q.promptText.matchAll(/\n\((\d)\)/g)].map(match => Number(match[1])), level === 2 ? [1, 2, 3] : [1, 2]);
    assert(q.promptText.includes(`1층에 놓인 쌓기나무는 ${stages[variant]}층`));
    assert(q.solution.includes("짝지어")); assert(q.solution.includes("쌍의 합"));
    assert(q.solution.includes("모든 짝의 합이"));
    const pairedEquations = q.solutionEquations.filter(equation => /^\d+\+\d+=\d+개$/.test(equation));
    assert.equal(pairedEquations.length, q.model.n % 2 ? 4 : 3);
    assert(q.solution.includes("가운데") || stages[variant] % 2 === 0);
  }
  assert.equal(q.layerCue, null);
  assert(!/층별 개수 표|math-inline-expression|[=+×]/.test(q.promptText));
  assert.equal(q.promptText.includes("(3)"), level === 2);
  assert.equal(q.promptText.includes("맨 위 세 층"), level === 2);
  if (level === 2) {
    assert(q.promptText.includes("나머지 층의 쌓기나무는 그대로 둡니다."));
    assert(q.solution.includes("4+7+10=21개")); assert(q.solution.includes("남은 개수"));
  }
  assert(!q.promptText.includes(`${q.answer[0]}개`), "Prompt leaks total");
  if (level === 2) assert(!q.promptText.includes(`${q.answer[2]}개`), "Prompt leaks remaining count");
  learnerFitCases.push({
    sourceItemId: id, variant, level, stage: q.model.n, id: "learner-fit", learner_stage,
    status: "pass", scope: "bounded-contract-language-and-reasoning-checks", empiricallyCalibrated: false,
    humanReviewPending: true,
    criteria: {
      language: { status: "pass", evidence: "Explicit Korean construction; no learner variables, powers, permutations or algebra." },
      representations: { status: "pass", evidence: level === 0 ? "One already-visible source prefix state; no given layer table or equation." : "T-shaped voxel layers and natural-number pairing arithmetic; fixed source orientation." },
      prerequisites: { status: "pass", evidence: q.learnerFit.prerequisites },
      "reasoning-load": { status: "pass", evidence: q.learnerFit.reasoningLoad },
      "response-mode": { status: "pass", evidence: { resultContract: "ordered", count: level + 1, answerOrder: q.answerOrder } }
    }
  });
}

assert.deepEqual(contracts.sourceItemIds, [id]); assert.equal(contracts.learner_stage, learner_stage);
assert.equal(contracts.learnerConditions, learnerConditions);
const definition = models.definitions.find(item => item.sourceItemId === id);
assert.deepEqual(definition.pools.map(pool => pool.n), stages);
const firstHeights = [
  [[1, 1, 1], [0, 1, 0]],
  [[1, 2, 2, 2, 1], [0, 0, 2, 0, 0], [0, 0, 1, 0, 0]],
  [[1, 2, 3, 3, 3, 2, 1], [0, 0, 0, 3, 0, 0, 0], [0, 0, 0, 2, 0, 0, 0], [0, 0, 0, 1, 0, 0, 0]]
];
for (const [index, state] of models.firstStates(id).entries()) {
  assert.deepEqual(state.H, firstHeights[index]); assert.deepEqual(definition.sourceFirstThreeHeights[index], firstHeights[index]);
  assert.equal(enumerate(state).total, [4, 11, 21][index]);
  assert.deepEqual(sortedKeys(state.cubes), sortedKeys(constructByLayers(index + 1).cubes));
}

const browsers = [
  { HSE_SOURCE_GRADE6_STACK_PATTERN_MODELS: models },
  { window: { HSE_SOURCE_GRADE6_STACK_PATTERN_MODELS: models } },
  {}
];
for (const context of browsers) {
  if (!context.window && !context.HSE_SOURCE_GRADE6_STACK_PATTERN_MODELS) vm.runInNewContext(modelCode, context);
  vm.runInNewContext(code, context, { filename: path.basename(contractPath) });
  const root = context.window || context;
  assert.deepEqual(Object.keys(root).sort(), ["HSE_SOURCE_GRADE6_STACK_PATTERN_MODELS", "HSE_SOURCE_GRADE6_T_PATTERN_EXAMPLE2_CONTRACTS"].sort());
  assert.equal(root.HSE_GENERATORS, undefined);
}
for (let variant = 0; variant < 3; variant++) for (let level = 0; level < 3; level++) {
  const q = contracts.generate(id, variant, level), stage = level === 0 ? easyStages[variant] : stages[variant], expectedConstruction = constructByLayers(stage);
  assert.equal(q.sourceItemId, id); assert.equal(q.variant, variant); assert.equal(q.level, level); assert.equal(q.model.n, stage);
  assert.deepEqual(q.model, level === 0 ? { ...models.build(id, { n: stage }), variant } : models.solve(id, variant));
  if (level === 0) assert.deepEqual(q.model.H, firstHeights[stage - 1]);
  assert.deepEqual(sortedKeys(q.model.cubes), sortedKeys(expectedConstruction.cubes));
  const actual = enumerate(q.model);
  assert.deepEqual(actual.counts.slice().reverse(), expectedConstruction.topDown.map(layer => layer.count));
  assert.deepEqual(q.model.layerCounts, actual.counts);
  const expected = level === 0 ? [actual.total] : level === 1 ? [actual.total, actual.difference] : [actual.total, actual.difference, actual.remaining];
  assert.deepEqual(q.answer, expected);
  assert.deepEqual(q.answerOrder, ["total-cubes", "ground-layer-minus-top-layer", "remaining-after-removing-top-three-layers"].slice(0, level + 1));
  if (level === 2) {
    assert.equal(q.removedTopLayers.count, 3);
    assert.deepEqual(q.removedTopLayers.rows, [{ layer: stage, count: 4 }, { layer: stage - 1, count: 7 }, { layer: stage - 2, count: 10 }]);
    assert.equal(q.removedTopLayers.removed, actual.removed); assert.equal(q.removedTopLayers.remaining, actual.remaining);
    assert.equal(q.answer[2], q.answer[0] - actual.removed);
  } else assert.equal(q.removedTopLayers, null);
  policyCheck(q); equationCheck(q); learnerFitCheck(q, variant, level); frozenTree(q);
  assert.deepEqual(q.solutionEquations, expectedEquations(actual, level), "Every elementary solution step must match enumerated layers");
  const before = JSON.stringify(q);
  rejectMutation(() => { q.answer[0] = -1; }); rejectMutation(() => { q.answer.push(-1); });
  rejectMutation(() => { q.model.cubes[0][0] = 999; }); rejectMutation(() => { q.model.H[0][0] = 999; });
  rejectMutation(() => { q.model.layers[0].cells[0][0] = 999; });
  rejectMutation(() => { q.sourcepolicy.originalSourceReleaseStatus = "approved"; });
  rejectMutation(() => { q.solutionEquations[0] = "wrong"; }); rejectMutation(() => { q.learnerFit.criteria.push("wrong"); });
  rejectMutation(() => { q.difficultyDesign.empiricallyCalibrated = true; }); rejectMutation(() => { delete q.model; });
  if (q.layerCue) rejectMutation(() => { q.layerCue.rows[0].count = -1; });
  if (q.removedTopLayers) rejectMutation(() => { q.removedTopLayers.rows[0].count = -1; });
  assert.equal(JSON.stringify(q), before); assert.deepEqual(contracts.generate(id, variant, level), q);
  for (const context of browsers) {
    const api = (context.window || context).HSE_SOURCE_GRADE6_T_PATTERN_EXAMPLE2_CONTRACTS;
    const browserQ = api.generate(id, variant, level); frozenTree(browserQ);
    assert.deepEqual(normalize(browserQ), normalize(q));
  }
  generatedCases.push({ variant, level, stage, answer: q.answer, resultContract: q.resultContract, cubesEnumerated: actual.total });
}
assert.deepEqual(generatedCases.filter(item => item.level === 2).map(item => item.answer), [[1000, 72, 979], [650, 57, 629], [1425, 87, 1404]]);
assert.deepEqual(generatedCases.filter(item => item.level === 0).map(item => item.answer), [[21], [11], [4]]);
assert.equal(new Set([0, 1, 2].map(level => contracts.generate(id, 0, level).difficultyDesign.structuralChange)).size, 3);
frozenTree(contracts); rejectMutation(() => { contracts.sourceItemIds.push("unowned"); });
rejectMutation(() => { contracts.learnerConditions = "changed"; }); rejectMutation(() => { contracts.generate = () => null; });
const invalidNumbers = [-1, 3, 0.5, "0", "1", null, undefined, NaN, Infinity, -Infinity, {}, [], true, false, 1n, Number.MAX_SAFE_INTEGER + 1];
const invalidInputs = [
  ...["6-2-u3-e2-mission-1", "6-2-u3-e2-mission-3", "6-2-u3-e3-exploration", "", null, undefined, {}, [id], new String(id), true].map(bad => [bad, 0, 0]),
  ...invalidNumbers.map(bad => [id, bad, 1]), ...invalidNumbers.map(bad => [id, 0, bad]),
  [], [id], [id, 0]
];
for (const args of invalidInputs) {
  assert.throws(() => contracts.generate(...args), { name: "RangeError" });
  let solveCalls = 0;
  const context = { HSE_SOURCE_GRADE6_STACK_PATTERN_MODELS: { solve() { solveCalls++; throw new Error("Invalid input reached voxel model"); } } };
  vm.runInNewContext(code, context);
  assert.throws(() => context.HSE_SOURCE_GRADE6_T_PATTERN_EXAMPLE2_CONTRACTS.generate(...args), { name: "RangeError" });
  assert.equal(solveCalls, 0); invalidInputRejections++;
}
const missingDependency = {}; vm.runInNewContext(code, missingDependency);
assert.throws(() => missingDependency.HSE_SOURCE_GRADE6_T_PATTERN_EXAMPLE2_CONTRACTS.generate(id, 0, 0), { name: "Error" });
assert.equal(JSON.stringify(models.definitions), initialDefinitions);
assert.equal(hash(modelPath), hashes.model); assert.equal(hash(reportPath), hashes.report); assert.equal(hash(cropPath), hashes.crop);
console.log(JSON.stringify({
  status: "passed", sourceItemIds: [id], generatedCases, generatedCaseCount: generatedCases.length,
  firstThreeTotals: [4, 11, 21], oracle: "independent endpoint extension and full voxel/layer enumeration; no closed-form oracle",
  equationChecks, invalidInputRejections, mutationRejections, browserUMDContexts: browsers.length, browserUMDComparisons: browsers.length * generatedCases.length,
  learner_stage, learnerFit: { id: "learner-fit", status: "pass", criteria, cases: learnerFitCases, empiricallyCalibrated: false, humanReviewPending: true },
  evidence: { reportFile: path.basename(reportPath), section: "4. 예제 2-2: T자 세 갈래 계단", cropFile: path.basename(cropPath), modelFile: path.basename(modelPath), hashes },
  originalSourceReleaseStatus: "locked", originalAnswerDeterminate: false, publisherAnswerVerified: false,
  handwrittenAnswerVerified: false, sourceExact: false, officialHumanApproval: false, registrationOnly: true,
  learnerReleaseVerified: false, productionLoaded: false, catalogUnlock: false, deployed: false,
  browserRun: false, pendingGates: ["teacher review and construction adoption", "empirical difficulty calibration", "rendered desktop/mobile/A4 if a presentation is later authorized", "publisher answer and release authority"]
}, null, 2));
