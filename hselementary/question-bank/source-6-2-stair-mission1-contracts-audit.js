"use strict";
const fs = require("node:fs"), path = require("node:path"), vm = require("node:vm");
const crypto = require("node:crypto"), assert = require("node:assert/strict");
const models = require("./source-6-2-stack-pattern-models.js");
const contracts = require("./source-6-2-stair-mission1-contracts.js");
const id = "6-2-u3-e2-mission-1", stages = [5, 4, 6];
const learner_stage = "초등 6학년 2학기 · 황소 심화 · 공간과 입체";
const learnerConditions = "첫째 모양은 쌓기나무 한 개입니다. 다음 모양은 앞쪽의 낮은 계단을 그대로 두고 뒤쪽 두 변에 각각 한 줄씩 기둥을 붙여 바닥을 정사각형으로 만듭니다. 새 기둥의 높이는 그 모양의 차례와 같습니다. 각 기둥은 바닥부터 빈틈없이 쌓고 그 밖에는 놓지 않습니다.";
const criteria = ["language", "representations", "prerequisites", "reasoning-load", "response-mode"];
const contractPath = path.join(__dirname, "source-6-2-stair-mission1-contracts.js");
const modelPath = path.join(__dirname, "source-6-2-stack-pattern-models.js");
function evidenceRoot(directory) {
  assert(typeof directory === "string" && /^[EG]:[\\/]/i.test(directory) && path.win32.isAbsolute(directory),
    "Set HSE_STACK_PATTERN_EVIDENCE_DIR explicitly to an absolute E: or G: evidence directory");
  const normalized = path.win32.normalize(directory);
  assert(/^[EG]:[\\/]/i.test(normalized), "Evidence directory must remain on E: or G:");
  return normalized;
}
for (const bad of [undefined, "", "C:/private", "F:/private", "E:relative", "./private", "\\\\server\\private", 42]) {
  assert.throws(() => evidenceRoot(bad), { name: "AssertionError" });
}
assert.equal(evidenceRoot("E:/evidence"), "E:\\evidence");
assert.equal(evidenceRoot("G:/evidence"), "G:\\evidence");
const sourceDirectory = evidenceRoot(process.env.HSE_STACK_PATTERN_EVIDENCE_DIR);
const realDirectory = evidenceRoot(fs.realpathSync(sourceDirectory));
function evidenceFile(name) {
  const file = fs.realpathSync(path.join(realDirectory, name));
  evidenceRoot(file);
  assert.equal(path.win32.dirname(file).toLowerCase(), realDirectory.replace(/[\\/]$/, "").toLowerCase(),
    "Private evidence must resolve inside the supplied directory");
  return file;
}
const reportPath = evidenceFile("independent-pattern-review.md"), cropPath = evidenceFile("mission1-original.png");
const hashes = {
  model: "F2B17A9146CA34534018D29E750413FA7DA9C4EA57762C024B382BFF989ED1BC",
  report: "8140B3E7AC8200C9F7D15BE163A293AB7272F0C18AF088955A73ACCDAAD541E1",
  crop: "27910D959229ED790459CA4616EFA08A983AB9E3174BA2C30918EB8375DD437B"
};
const hash = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex").toUpperCase();
assert.equal(hash(modelPath), hashes.model); assert.equal(hash(reportPath), hashes.report); assert.equal(hash(cropPath), hashes.crop);
const report = fs.readFileSync(reportPath, "utf8"), heading = "## 5. Mission 1: 두 방향으로 올라가는 안쪽 계단";
const sectionStart = report.indexOf(heading), sectionEnd = report.indexOf("## 6.", sectionStart);
assert(sectionStart >= 0 && sectionEnd > sectionStart);
const section = report.slice(sectionStart, sectionEnd);
for (const phrase of ["가장 낮은 앞 모서리", "1,7,22", "25,24,21,16,9", "V(5)", "95", "아래는 모두 채운다"])
  assert(section.includes(phrase), `Missing private source evidence: ${phrase}`);
assert(report.includes("처음 세 상태만 제공"));
const crop = fs.readFileSync(cropPath);
assert.equal(crop.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
assert.equal(crop.readUInt32BE(16), 780); assert.equal(crop.readUInt32BE(20), 670);
const code = fs.readFileSync(contractPath, "utf8"), modelCode = fs.readFileSync(modelPath, "utf8");
assert(!/formulaAudit|model\.answer|model\.totalCubes|model\.layerCounts/.test(code));
assert(!/[EG]:[\\/](?:Codex|내 드라이브)/i.test(code + fs.readFileSync(__filename, "utf8")), "No private absolute path in code");
const normalize = value => JSON.parse(JSON.stringify(value));
const sortedKeys = cubes => cubes.map(cube => cube.join(",")).sort();
const sum = values => values.reduce((total, value) => total + value, 0);
const initialDefinitions = JSON.stringify(models.definitions);
const generatedCases = [], learnerFitCases = [];
let equationChecks = 0, alternateEquationChecks = 0, invalidInputRejections = 0, mutationRejections = 0, unmovedRemainderChecks = 0;
let recursiveAdditionChecks = 0;

// Keep front-origin physical columns fixed; append exactly one rear row and one rear column.
function constructRecursiveLColumns(stage) {
  const physicalCubes = [[0, 0, 0]], occupied = new Set(["0,0,0"]), additions = [];
  for (let next = 2; next <= stage; next++) {
    const previous = new Set(occupied), newColumns = [];
    for (let along = 0; along < next; along++) newColumns.push([along, next - 1]);
    for (let along = 0; along < next - 1; along++) newColumns.push([next - 1, along]);
    assert.equal(newColumns.filter(([x, z]) => x === next - 1 && z === next - 1).length, 1);
    assert.equal(new Set(newColumns.map(column => column.join(","))).size, newColumns.length);
    for (const [x, z] of newColumns) for (let y = 0; y < next; y++) {
      const cube = [x, y, z], key = cube.join(",");
      assert(!occupied.has(key)); occupied.add(key); physicalCubes.push(cube);
    }
    for (const key of previous) assert(occupied.has(key), "Existing front stair must remain physically unchanged");
    assert.equal(occupied.size, physicalCubes.length);
    const footprint = new Set(physicalCubes.filter(([, y]) => y === 0).map(([x, , z]) => [x, z].join(",")));
    for (let z = 0; z < next; z++) for (let x = 0; x < next; x++) assert(footprint.has([x, z].join(",")));
    assert.equal(footprint.size, next * next);
    additions.push({ stage: next, newColumns, addedCubes: physicalCubes.length - previous.size });
    recursiveAdditionChecks++;
  }
  // Only convert coordinates to the existing model's back-to-front axes; no physical move.
  const cubes = physicalCubes.map(([x, y, z]) => [stage - 1 - x, y, stage - 1 - z]);
  return { cubes, physicalCubes, additions };
}

// Independent horizontal layer sets: omit only the front-corner square at each height.
function constructLayerSets(stage) {
  const cubes = [], layers = [];
  for (let layer = 1; layer <= stage; layer++) {
    const cells = [], missingCells = [], cut = stage - layer + 1;
    for (let z = 0; z < stage; z++) for (let x = 0; x < stage; x++) {
      if (x >= cut && z >= cut) missingCells.push([x, z]);
      else { cells.push([x, z]); cubes.push([x, layer - 1, z]); }
    }
    layers.push({ layer, cells, missingCells, count: cells.length });
  }
  return { cubes, layers };
}
// Separate construction: number both edges from the lowest front corner, then fill columns.
function constructTwoEdgeNumbers(stage) {
  const cubes = [], heights = Array.from({ length: stage }, () => Array(stage).fill(0));
  for (let leftNumber = 1; leftNumber <= stage; leftNumber++) {
    for (let rightNumber = 1; rightNumber <= stage; rightNumber++) {
      const height = leftNumber > rightNumber ? leftNumber : rightNumber;
      const x = stage - leftNumber, z = stage - rightNumber;
      heights[z][x] = height;
      for (let y = 0; y < height; y++) cubes.push([x, y, z]);
    }
  }
  return { cubes, heights };
}
function enumerate(model) {
  const stage = model.n, occupied = new Set(), buckets = Array.from({ length: stage }, () => []);
  const heights = Array.from({ length: stage }, () => Array(stage).fill(0));
  for (const cube of model.cubes) {
    assert.equal(cube.length, 3); assert(cube.every(Number.isSafeInteger));
    const [x, y, z] = cube, key = cube.join(",");
    assert(x >= 0 && x < stage && y >= 0 && y < stage && z >= 0 && z < stage);
    assert(!occupied.has(key), `Duplicate cube: ${key}`); occupied.add(key);
    buckets[y].push(cube); heights[z][x]++;
  }
  for (const [x, y, z] of model.cubes) if (y > 0) assert(occupied.has([x, y - 1, z].join(",")), "Unsupported cube");
  assert.deepEqual(model.H, heights); assert.equal(model.xOrigin, 0); assert.equal(model.zOrigin, 0);
  const counts = buckets.map(cubes => cubes.length), total = sum(counts);
  const removedCubes = model.cubes.filter(([, y]) => y >= stage - 2);
  const remainingCubes = model.cubes.filter(([, y]) => y < stage - 2);
  return { counts, total, removed: removedCubes.length, remaining: remainingCubes.length, removedCubes, remainingCubes };
}
function frozenTree(value) {
  if (!value || typeof value !== "object") return;
  assert(Object.isFrozen(value)); Object.values(value).forEach(frozenTree);
}
function rejectMutation(action) { assert.throws(action, { name: "TypeError" }); mutationRejections++; }
function policyCheck(q) {
  for (const candidate of [q, q.sourcepolicy]) {
    assert.equal(candidate.originalSourceReleaseStatus, "locked");
    for (const flag of ["sourceExact", "originalAnswerDeterminate", "publisherAnswerVerified", "handwrittenAnswerVerified",
      "officialAnswerVerified", "officialHumanApproval", "constructionConditionApproved", "learnerReleaseVerified", "productionLoaded", "catalogUnlock", "deployed"])
      assert.equal(candidate[flag], false, flag);
    for (const flag of ["requestedAnswerUniqueUnderExplicitConstruction", "requestedAnswerUnique", "uniqueRequestedNumericAnswerUnderConstruction", "sourceConditionsClarified", "registrationOnly"])
      assert.equal(candidate[flag], true, flag);
    assert.equal(candidate.sourceConditionProvenance, "explicit-learner-given-conditions");
  }
  assert.equal(q.sourcepolicy.sourceFirstThreeOnly, true); assert.equal(q.sourcepolicy.firstThreeForceUniqueFuture, false);
  assert.equal(q.sourcepolicy.answerBasis, "conditional-independent-calculation");
  assert.equal(q.model.officialAnswerVerified, false); assert.equal(q.model.constructionConditionApproved, false);
  assert.equal(q.model.viewConvention.fixedOrientation, true); assert.equal(q.model.viewConvention.quotientByRotationOrReflection, false);
  assert.equal(q.model.viewConvention.depthAxis, "z increases toward the front");
  assert.equal(q.sourceRef.pdfPage, 33); assert.equal(q.sourceRef.printedPage, 35);
  assert.equal(q.sourceRef.cropSha256, hashes.crop); assert.equal(q.sourceRef.independentReportSha256, hashes.report);
  const evidence = q.sourcepolicy.sourceEvidence;
  assert.equal(evidence.reportSha256, hashes.report); assert.equal(evidence.cropSha256, hashes.crop);
  assert.equal(evidence.section, heading.slice(3)); assert.equal(evidence.originalRequestedStage, 5);
  assert.deepEqual(evidence.originalQuestionOrder, ["total-cubes"]);
  assert.deepEqual(evidence.sourceFirstThreeTotals, [1, 7, 22]);
}
function checkEquations(q, independent, level) {
  for (const [text, equations, alternate] of [[q.solution, q.solutionEquations, false], [q.alternateSolution, q.alternateSolutionEquations, true]]) {
    const inline = [...text.matchAll(/<span class="math-inline-expression">([^<]+)<\/span>/g)].map(match => match[1]);
    assert.deepEqual(inline, equations);
    for (const equation of inline) {
      assert(equation.length < 30, `Oversized equation atom: ${equation}`);
      const match = /^(\d+(?:[+×-]\d+)*)=(\d+)개$/.exec(equation);
      assert(match, `Non-elementary equation: ${equation}`);
      const terms = match[1].match(/[+-]?\d+(?:×\d+)*/g);
      const computed = sum(terms.map(term => term.split("×").reduce((product, number) => product * Number(number), 1)));
      assert.equal(computed, Number(match[2]), equation);
      if (alternate) alternateEquationChecks++; else equationChecks++;
    }
  }
  const stage = independent.layers.length, counts = independent.layers.map(row => row.count);
  const total = sum(counts), holes = independent.layers.filter(row => row.missingCells.length > 0);
  const missing = sum(holes.map(row => row.missingCells.length));
  const expected = independent.layers.map(row => `${stage}×${stage}${row.layer === 1 ? "" : `-${row.layer - 1}×${row.layer - 1}`}=${row.count}개`);
  expected.push(`${counts.join("+")}=${total}개`);
  const alternateExpected = [`${stage}×${stage}×${stage}=${total + missing}개`];
  alternateExpected.push(...holes.map(row => `${row.layer - 1}×${row.layer - 1}×1=${row.missingCells.length}개`));
  alternateExpected.push(`${holes.map(row => row.missingCells.length).join("+") || "0"}=${missing}개`, `${total + missing}-${missing}=${total}개`);
  if (level === 2) {
    const top = counts.slice(-2).reverse(), removed = sum(top);
    expected.push(`${top.join("+")}=${removed}개`, `${total}-${removed}=${total - removed}개`);
  }
  assert.deepEqual(q.solutionEquations, expected, "All solution steps must match independently enumerated layer sets");
  assert.deepEqual(q.alternateSolutionEquations, alternateExpected, "Private alternate volume calculation must match empty-cell enumeration");
  assert(!q.solution.includes(q.alternateSolution)); assert(!/정육면체|다르게 세면/.test(q.solution));
  assert(q.alternateSolution.includes("정육면체")); assert.equal(q.alternateSolutionAudience, "private-reviewer");
  assert.equal(q.volumeSubtraction.fullCubeCount, total + missing);
  assert.equal(q.volumeSubtraction.missing, missing); assert.equal(q.volumeSubtraction.total, total);
  assert.deepEqual(q.volumeSubtraction.missingLayers, independent.layers.map(row => ({ layer: row.layer, side: row.layer - 1, count: row.missingCells.length })));
}
function learnerFitCheck(q, variant, level) {
  assert.equal(q.learner_stage, learner_stage); assert.equal(q.learnerFit.learner_stage, learner_stage);
  assert.equal(q.learnerFit.id, "learner-fit"); assert.deepEqual(q.learnerFit.criteria, criteria);
  if (level !== 0) assert.equal(q.learnerConditions, learnerConditions);
  assert(q.promptText.startsWith(q.learnerConditions));
  assert(q.promptText.includes(`${q.model.n}번째 모양`));
  assert.equal(q.learnerFit.evidenceFile, path.basename(__filename));
  assert.equal(q.learnerFit.responseMode, "ordered-integer-counts"); assert.equal(q.learnerFit.responseCount, level === 2 ? 2 : 1);
  assert.equal(q.learnerFit.empiricallyCalibrated, false); assert.equal(q.learnerFit.humanReviewPending, true);
  assert.equal(q.difficultyDesign.empiricallyCalibrated, false); assert.equal(q.difficultyDesign.mode, ["easy", "source", "hard"][level]);
  const learnerText = [q.promptText, q.solution, q.alternateSolution, ...q.learnerFit.prerequisites, q.learnerFit.reasoningLoad, q.difficultyDesign.structuralChange].join(" ").replace(/<[^>]*>/g, "");
  assert(!/[A-Za-z]|[⁰¹²³⁴⁵⁶⁷⁸⁹^]|\*\*|조합|순열|최댓값|max\(|Σ|∑|[\u3040-\u30ff]/.test(learnerText), "No foreign placeholders, learner algebra, powers or combinations");
  assert(!/번호|좌표|두 변에서/.test(q.learnerConditions), "Learner construction must be physical, not an edge-coordinate lesson");
  assert.equal((q.promptText.match(/몇 개인지|몇 개가 남는지/g) || []).length, level === 2 ? 2 : 1);
  assert.equal(q.promptText.includes("맨 위 두 층"), level === 2);
  if (level === 0) {
    assert.equal(q.model.n, [3, 2, 1][variant]);
    assert(q.promptText.includes("그림에 보이는"));
    assert(!/층별|표|다음 모양|새 기둥|뒤쪽 두 변|[=+×]/.test(q.promptText));
  }
  assert.equal(q.layerCue, null); assert(!/층별 개수 표|math-inline-expression|[=+×]/.test(q.promptText));
  assert.deepEqual([...q.promptText.matchAll(/\n\((\d)\)/g)].map(match => Number(match[1])), level === 2 ? [1, 2] : []);
  if (level === 2) {
    assert(q.promptText.includes(`${stages[variant]}층과 ${stages[variant] - 1}층`));
    assert(q.promptText.includes("남은 쌓기나무는 옮기지 않습니다."));
  } else assert(!/제거|남는|남은|옮기/.test(q.promptText));
  for (const answer of q.answer) assert(!q.promptText.includes(`${answer}개`), "Prompt leaks contracted answer");
  learnerFitCases.push({
    sourceItemId: id, variant, level, stage: q.model.n, id: "learner-fit", learner_stage, status: "pass",
    scope: "bounded-contract-language-and-reasoning-checks", empiricallyCalibrated: false, humanReviewPending: true,
    criteria: {
      language: { status: "pass", evidence: "Explicit Korean recursive rear L-column addition, unchanged front stair, ground-filled columns and no other cubes; no coordinate lesson, variables or powers." },
      representations: { status: "pass", evidence: level === 0 ? "One already-visible source prefix state; no given layer table or equation." : "Fixed-orientation inner stair layers and natural-number arithmetic; no advanced formula." },
      prerequisites: { status: "pass", evidence: q.learnerFit.prerequisites },
      "reasoning-load": { status: "pass", evidence: q.learnerFit.reasoningLoad },
      "response-mode": { status: "pass", evidence: { resultContract: "ordered", count: q.answer.length, answerOrder: q.answerOrder } }
    }
  });
}

assert.deepEqual(contracts.sourceItemIds, [id]); assert.equal(contracts.learner_stage, learner_stage);
assert.equal(contracts.learnerConditions, learnerConditions);
const definition = models.definitions.find(item => item.sourceItemId === id);
assert.equal(definition.mode, "two-direction-stair-total"); assert.deepEqual(definition.pools.map(pool => pool.n), stages);
const firstHeights = [[[1]], [[2, 2], [2, 1]], [[3, 3, 3], [3, 2, 2], [3, 2, 1]]];
assert.deepEqual(definition.sourceFirstThreeHeights, firstHeights);
for (const [index, state] of models.firstStates(id).entries()) {
  assert.deepEqual(state.H, firstHeights[index]); assert.equal(enumerate(state).total, [1, 7, 22][index]);
  assert.deepEqual(sortedKeys(state.cubes), sortedKeys(constructLayerSets(index + 1).cubes));
  assert.deepEqual(sortedKeys(state.cubes), sortedKeys(constructTwoEdgeNumbers(index + 1).cubes));
  assert.deepEqual(sortedKeys(state.cubes), sortedKeys(constructRecursiveLColumns(index + 1).cubes));
}
const browsers = [{ HSE_SOURCE_GRADE6_STACK_PATTERN_MODELS: models }, { window: { HSE_SOURCE_GRADE6_STACK_PATTERN_MODELS: models } }, {}];
for (const context of browsers) {
  if (!context.window && !context.HSE_SOURCE_GRADE6_STACK_PATTERN_MODELS) vm.runInNewContext(modelCode, context);
  vm.runInNewContext(code, context, { filename: path.basename(contractPath) });
  const root = context.window || context;
  assert.deepEqual(Object.keys(root).sort(), ["HSE_SOURCE_GRADE6_STACK_PATTERN_MODELS", "HSE_SOURCE_GRADE6_STAIR_MISSION1_CONTRACTS"].sort());
  assert.equal(root.HSE_GENERATORS, undefined);
}
for (let variant = 0; variant < 3; variant++) for (let level = 0; level < 3; level++) {
  const q = contracts.generate(id, variant, level), stage = level === 0 ? [3, 2, 1][variant] : stages[variant];
  const layers = constructLayerSets(stage), edges = constructTwoEdgeNumbers(stage), recursive = constructRecursiveLColumns(stage);
  const actual = enumerate(q.model);
  assert.equal(q.sourceItemId, id); assert.equal(q.variant, variant); assert.equal(q.level, level);
  assert.equal(q.model.n, stage); assert.deepEqual(q.model, level === 0 ? { ...models.build(id, { n: stage }), variant } : models.solve(id, variant));
  if (level === 0) assert.deepEqual(q.model.H, firstHeights[stage - 1]);
  assert.deepEqual(sortedKeys(q.model.cubes), sortedKeys(layers.cubes));
  assert.deepEqual(sortedKeys(q.model.cubes), sortedKeys(edges.cubes)); assert.deepEqual(q.model.H, edges.heights);
  assert.deepEqual(sortedKeys(q.model.cubes), sortedKeys(recursive.cubes));
  assert.deepEqual(actual.counts, layers.layers.map(row => row.count));
  for (const row of q.model.layers) assert.deepEqual(sortedKeys(row.cells), sortedKeys(layers.layers[row.layer - 1].cells));
  assert.equal(q.resultContract, "ordered"); assert.deepEqual(q.answer, level === 2 ? [actual.total, actual.remaining] : [actual.total]);
  assert.deepEqual(q.answerOrder, level === 2 ? ["total-cubes", "remaining-after-removing-top-two-layers"] : ["total-cubes"]);
  assert(q.answer.every(Number.isSafeInteger));
  if (level === 2) {
    const removed = q.removedTopLayers;
    assert.equal(removed.count, 2);
    assert.deepEqual(removed.rows, layers.layers.slice(-2).reverse().map(row => ({ layer: row.layer, count: row.count })));
    assert.equal(removed.removed, actual.removed); assert.equal(removed.remaining, actual.remaining);
    assert.deepEqual(removed.removedCubes, actual.removedCubes); assert.deepEqual(removed.remainingCubes, actual.remainingCubes);
    assert.deepEqual(removed.moves, []);
    const original = new Set(sortedKeys(q.model.cubes));
    for (const cube of removed.remainingCubes) { assert(original.has(cube.join(","))); assert(cube[1] < stage - 2); unmovedRemainderChecks++; }
    assert.deepEqual(sortedKeys([...removed.remainingCubes, ...removed.removedCubes]), sortedKeys(q.model.cubes));
  } else assert.equal(q.removedTopLayers, null);
  policyCheck(q); checkEquations(q, layers, level); learnerFitCheck(q, variant, level); frozenTree(q);
  assert.deepEqual(q.sourcepolicy.sourceEvidence.sourceFirstThreeHeights, firstHeights);
  const before = JSON.stringify(q);
  rejectMutation(() => { q.answer[0] = -1; }); rejectMutation(() => { q.answer.push(-1); });
  rejectMutation(() => { q.model.cubes[0][0] = 999; }); rejectMutation(() => { q.model.H[0][0] = 999; });
  rejectMutation(() => { q.model.layers[0].cells[0][0] = 999; });
  rejectMutation(() => { q.sourcepolicy.originalSourceReleaseStatus = "approved"; });
  rejectMutation(() => { q.solutionEquations[0] = "wrong"; }); rejectMutation(() => { q.learnerFit.criteria.push("wrong"); });
  rejectMutation(() => { q.alternateSolutionEquations[0] = "wrong"; });
  rejectMutation(() => { q.volumeSubtraction.missingLayers[0].count = -1; });
  rejectMutation(() => { q.difficultyDesign.empiricallyCalibrated = true; }); rejectMutation(() => { delete q.model; });
  if (q.layerCue) rejectMutation(() => { q.layerCue.rows[0].count = -1; });
  if (q.removedTopLayers) {
    rejectMutation(() => { q.removedTopLayers.rows[0].count = -1; });
    rejectMutation(() => { q.removedTopLayers.remainingCubes[0][1] = 99; });
    rejectMutation(() => { q.removedTopLayers.removedCubes[0][1] = 0; });
    rejectMutation(() => { q.removedTopLayers.moves.push({ from: [0, 0, 0], to: [1, 0, 0] }); });
  }
  assert.equal(JSON.stringify(q), before); assert.deepEqual(contracts.generate(id, variant, level), q);
  for (const context of browsers) {
    const browserQ = (context.window || context).HSE_SOURCE_GRADE6_STAIR_MISSION1_CONTRACTS.generate(id, variant, level);
    frozenTree(browserQ); assert.deepEqual(normalize(browserQ), normalize(q));
  }
  generatedCases.push({ variant, level, stage, answer: q.answer, layerCounts: actual.counts, topTwoRemoved: actual.removed,
    remaining: actual.remaining, resultContract: q.resultContract, cubesEnumerated: actual.total });
}
assert.deepEqual(generatedCases.filter(item => item.level === 2).map(item => item.answer), [[95, 70], [50, 31], [161, 130]]);
assert.deepEqual(generatedCases.filter(item => item.level === 0).map(item => item.answer), [[22], [7], [1]]);
assert.deepEqual(generatedCases.filter(item => item.level === 2).map(item => item.topTwoRemoved), [25, 19, 31]);
assert.equal(generatedCases.length, 9); assert.equal(learnerFitCases.length, 9);
assert.equal(equationChecks, 51); assert.equal(alternateEquationChecks, 54);
assert.equal(new Set([0, 1, 2].map(level => contracts.generate(id, 0, level).difficultyDesign.structuralChange)).size, 3);
frozenTree(contracts); rejectMutation(() => { contracts.sourceItemIds.push("unowned"); });
rejectMutation(() => { contracts.learnerConditions = "changed"; }); rejectMutation(() => { contracts.generate = () => null; });
const invalidNumbers = [-1, 3, 0.5, "0", "1", null, undefined, NaN, Infinity, -Infinity, {}, [], true, false, 1n, new Number(0), Number.MAX_SAFE_INTEGER + 1];
const invalidInputs = [
  ...["6-2-u3-e2-example-2", "6-2-u3-e2-mission-3", "6-2-u3-e3-exploration", `${id} `, "", null, undefined, {}, [id], new String(id), true].map(bad => [bad, 0, 0]),
  ...invalidNumbers.map(bad => [id, bad, 1]), ...invalidNumbers.map(bad => [id, 0, bad]), [], [id], [id, 0]
];
for (const args of invalidInputs) {
  assert.throws(() => contracts.generate(...args), { name: "RangeError" });
  let solveCalls = 0;
  const context = { HSE_SOURCE_GRADE6_STACK_PATTERN_MODELS: { solve() { solveCalls++; throw new Error("Invalid input reached model"); } } };
  vm.runInNewContext(code, context);
  assert.throws(() => context.HSE_SOURCE_GRADE6_STAIR_MISSION1_CONTRACTS.generate(...args), { name: "RangeError" });
  assert.equal(solveCalls, 0); invalidInputRejections++;
}
const missingDependency = {}; vm.runInNewContext(code, missingDependency);
assert.throws(() => missingDependency.HSE_SOURCE_GRADE6_STAIR_MISSION1_CONTRACTS.generate(id, 0, 0), { name: "Error" });
// Access traps prove solution generation does not read precomputed answer/formula summaries.
function trapSummaries(base) {
  const proxy = { ...base };
  for (const key of ["answer", "totalCubes", "layerCounts", "formulaAudit"])
    Object.defineProperty(proxy, key, { enumerable: false, get() { throw new Error(`Forbidden model summary: ${key}`); } });
  return Object.freeze(proxy);
}
const trappingModel = {
  solve: (sourceId, variant) => trapSummaries(models.solve(sourceId, variant)),
  build: (sourceId, condition) => trapSummaries(models.build(sourceId, condition))
};
const trapContext = { HSE_SOURCE_GRADE6_STACK_PATTERN_MODELS: trappingModel }; vm.runInNewContext(code, trapContext);
for (let variant = 0; variant < 3; variant++) for (let level = 0; level < 3; level++) {
  assert.deepEqual(normalize(trapContext.HSE_SOURCE_GRADE6_STAIR_MISSION1_CONTRACTS.generate(id, variant, level).answer), contracts.generate(id, variant, level).answer);
}
assert.equal(JSON.stringify(models.definitions), initialDefinitions);
assert.equal(hash(modelPath), hashes.model); assert.equal(hash(reportPath), hashes.report); assert.equal(hash(cropPath), hashes.crop);
console.log(JSON.stringify({
  status: "passed", sourceItemIds: [id], generatedCases, generatedCaseCount: generatedCases.length,
  firstThreeTotals: [1, 7, 22], firstThreeHeights: firstHeights,
  oracle: "independent repeated rear L-column addition, horizontal layer sets, two-edge-number columns and full voxel enumeration; no formula or answer oracle",
  equationChecks, alternateEquationChecks, invalidInputRejections, mutationRejections, unmovedRemainderChecks, recursiveAdditionChecks,
  browserUMDContexts: browsers.length, browserUMDComparisons: browsers.length * generatedCases.length, summaryAccessTrapCases: 9,
  learner_stage, learnerFit: { id: "learner-fit", status: "pass", criteria, cases: learnerFitCases, empiricallyCalibrated: false, humanReviewPending: true },
  evidence: { reportFile: path.basename(reportPath), section: heading.slice(3), cropFile: path.basename(cropPath), modelFile: path.basename(modelPath), hashes },
  sourceExact: false, originalAnswerDeterminate: false, originalSourceReleaseStatus: "locked",
  publisherAnswerVerified: false, handwrittenAnswerVerified: false, officialAnswerVerified: false, officialHumanApproval: false,
  requestedAnswerUniqueUnderExplicitConstruction: true, registrationOnly: true, learnerReleaseVerified: false,
  productionLoaded: false, catalogUnlock: false, deployed: false, browserRun: false,
  pendingGates: ["teacher review and construction adoption", "empirical difficulty calibration", "rendered desktop/mobile/A4 if presentation is later authorized", "publisher answer and release authority"]
}, null, 2));
