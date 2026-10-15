"use strict";
const fs = require("node:fs"), path = require("node:path"), vm = require("node:vm");
const crypto = require("node:crypto"), assert = require("node:assert/strict");
const models = require("./source-6-2-stack-pattern-models.js");
const contracts = require("./source-6-2-border-mission3-contracts.js");
const id = "6-2-u3-e2-mission-3", stages = [10,8,12];
const learner_stage = "초등 6학년 2학기 · 황소 심화 · 공간과 입체";
const learnerConditions = "첫째 도형은 가로와 세로가 각각 3칸입니다. 다음 도형은 각 변이 2칸씩 늘어난 정사각형입니다. 각 도형의 테두리에 쌓기나무를 한 개씩 놓고, 안쪽은 왼쪽 위 칸을 빈칸으로 하여 가로와 세로 방향으로 빈칸과 쌓기나무 한 개가 번갈아 놓이도록 다시 만듭니다. 쌓기나무의 한 모서리 길이는 1 cm이며 그 밖에는 놓지 않습니다.";
const faceDefinition = "면의 넓이는 쌓기나무끼리 맞닿지 않은 모든 면의 넓이입니다. 구멍을 향한 안쪽 옆면과 그림에서 가려진 옆면도 포함하고, 바닥에 닿은 밑면은 모두 제외합니다.";
const criteria = ["language", "representations", "prerequisites", "reasoning-load", "response-mode"];
const firstHeights = [
  [[1,1,1],[1,0,1],[1,1,1]],
  [[1,1,1,1,1],[1,0,1,0,1],[1,1,0,1,1],[1,0,1,0,1],[1,1,1,1,1]],
  [[1,1,1,1,1,1,1],[1,0,1,0,1,0,1],[1,1,0,1,0,1,1],[1,0,1,0,1,0,1],
    [1,1,0,1,0,1,1],[1,0,1,0,1,0,1],[1,1,1,1,1,1,1]]
];
const hashes = {
  model: "F2B17A9146CA34534018D29E750413FA7DA9C4EA57762C024B382BFF989ED1BC",
  report: "8140B3E7AC8200C9F7D15BE163A293AB7272F0C18AF088955A73ACCDAAD541E1",
  crop: "606FFE5D17DFFEDED10AC6C9F59B69FD33F4974C2050506755515CC756AB5A12",
  pdf: "69035C63AD62DED1308E490D7073C7CE01F7D9887CFE338F3D88AAC10B9A6FAE"
};
const modelPath = path.join(__dirname, "source-6-2-stack-pattern-models.js");
const contractPath = path.join(__dirname, "source-6-2-border-mission3-contracts.js");
const hash = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex").toUpperCase();
function explicitPath(value, drives) {
  assert(typeof value === "string" && path.win32.isAbsolute(value) && /^[A-Za-z]:[\\/]/.test(value),
    "Provide an explicit absolute drive path through the evidence environment");
  const normalized = path.win32.normalize(value);
  assert(drives.includes(normalized[0].toUpperCase()), "Evidence drive is outside the allowed read-only boundary");
  return normalized;
}
for (const bad of [undefined, "", "C:/private", "F:/private", "E:relative", "./private", "\\\\server\\private", 42])
  assert.throws(() => explicitPath(bad, ["E"]), { name: "AssertionError" });
assert.equal(explicitPath("E:/evidence", ["E"]), "E:\\evidence");
// Both inputs are mandatory; no private path is embedded or guessed by this audit.
const evidenceDirectory = explicitPath(process.env.HSE_STACK_PATTERN_EVIDENCE_DIR, ["E"]);
const realDirectory = explicitPath(fs.realpathSync(evidenceDirectory), ["E"]);
function evidenceFile(name) {
  const file = explicitPath(fs.realpathSync(path.join(realDirectory, name)), ["E"]);
  assert.equal(path.win32.dirname(file).toLowerCase(), realDirectory.replace(/[\\/]$/, "").toLowerCase());
  return file;
}
const reportPath = evidenceFile("independent-pattern-review.md"), cropPath = evidenceFile("mission3-original.png");
const pdfPath = explicitPath(fs.realpathSync(explicitPath(process.env.HSE_STACK_PATTERN_SOURCE_PDF, ["E","F"])), ["E","F"]);
for (const [file, expected] of [[modelPath,hashes.model],[reportPath,hashes.report],[cropPath,hashes.crop],[pdfPath,hashes.pdf]])
  assert.equal(hash(file), expected, `Source fingerprint mismatch: ${path.basename(file)}`);
assert.equal(fs.readFileSync(pdfPath).subarray(0,5).toString("ascii"), "%PDF-");
const report = fs.readFileSync(reportPath, "utf8"), heading = "## 6. Mission 3: 테두리와 내부 0·1 격자";
const start = report.indexOf(heading), end = report.indexOf("## 7.", start);
assert(start >= 0 && end > start);
const section = report.slice(start,end);
for (const phrase of ["위에서 본 높이표", "8,20,36", "1,5,13", "다시 배치", "구멍 하나당", "고정 카메라", "바닥을 뺀"])
  assert(section.includes(phrase), `Missing section-6 evidence: ${phrase}`);
assert(report.includes("처음 세 상태만 제공")); assert(report.includes(hashes.pdf));
const sourceGridText = section.match(/```text\s+([\s\S]*?)```/);
assert(sourceGridText);
for (const H of firstHeights) {
  const printedRows = [...sourceGridText[1].matchAll(/\b[01]{3,7}\b/g)].map(match => match[0]).filter(row => row.length === H.length);
  assert.deepEqual(printedRows, H.map(row => row.join("")), "Every transcribed source cell must match section 6");
}
const crop = fs.readFileSync(cropPath);
assert.equal(crop.subarray(0,8).toString("hex"), "89504e470d0a1a0a");
assert.equal(crop.readUInt32BE(16),826); assert.equal(crop.readUInt32BE(20),745);
const code = fs.readFileSync(contractPath,"utf8"), modelCode = fs.readFileSync(modelPath,"utf8");
assert(!/model\.(?:answer|surface|totalCubes|numericDifference|formulaAudit|layerCounts)/.test(code));
assert(!/[EFG]:[\\/](?:Codex|지필드|내 드라이브)/i.test(code + fs.readFileSync(__filename,"utf8")), "No private absolute source path in public code");
const normalize = value => JSON.parse(JSON.stringify(value));
const sum = values => values.reduce((total,value) => total + value,0);
const keys = cells => cells.map(cell => cell.join(",")).sort();
const initialDefinitions = JSON.stringify(models.definitions);

// Alternate the row starts and cells explicitly, independently of the model's parity expression.
function constructRows(stage, filled = false) {
  let side = 3;
  for (let step = 1; step < stage; step++) side += 2;
  const H = [Array(side).fill(1)];
  let firstInside = 0;
  for (let row = 1; row < side - 1; row++) {
    const values = [1]; let next = firstInside;
    for (let column = 1; column < side - 1; column++) { values.push(filled ? 1 : next); next = 1 - next; }
    values.push(1); H.push(values); firstInside = 1 - firstInside;
  }
  H.push(Array(side).fill(1)); return H;
}
function cubesFromRows(H) {
  return H.flatMap((row,z) => row.flatMap((height,x) => height ? [[x,0,z]] : []));
}
// Enumerate geometric unit squares and cancel shared ownership; no neighbor lookup or formula oracle.
function planeOracle(H) {
  const side = H.length, cubes = cubesFromRows(H), planes = new Map();
  const components = Object.fromEntries(["top","outerSides","innerHoleSides","groundBottoms","contacts"].map(name => [name,[]]));
  const add = (key, category, cube, direction, neighbor) => {
    const owners = planes.get(key) || []; owners.push({ category, cube, direction, neighbor }); planes.set(key,owners);
  };
  for (const [x,y,z] of cubes) {
    const cube = [x,y,z];
    add(`Y,1,${x},${z}`,"top",cube,"positiveY",[x,1,z]);
    add(`Y,0,${x},${z}`,"groundBottoms",cube,"negativeY",[x,-1,z]);
    add(`X,${x},${y},${z}`,x === 0 ? "outerSides" : "innerHoleSides",cube,"negativeX",[x-1,y,z]);
    add(`X,${x+1},${y},${z}`,x+1 === side ? "outerSides" : "innerHoleSides",cube,"positiveX",[x+1,y,z]);
    add(`Z,${z},${x},${y}`,z === 0 ? "outerSides" : "innerHoleSides",cube,"negativeZ",[x,y,z-1]);
    add(`Z,${z+1},${x},${y}`,z+1 === side ? "outerSides" : "innerHoleSides",cube,"positiveZ",[x,y,z+1]);
  }
  for (const owners of planes.values()) {
    assert(owners.length === 1 || owners.length === 2);
    for (const { category, ...face } of owners) components[owners.length === 2 ? "contacts" : category].push(face);
  }
  const emptyInteriorCells = [], rowHoleCounts = [];
  for (let z = 1; z < side - 1; z++) {
    let holes = 0;
    for (let x = 1; x < side - 1; x++) if (!H[z][x]) { emptyInteriorCells.push([x,z]); holes++; }
    rowHoleCounts.push(holes);
  }
  const rowCounts = H.map(row => sum(row)), count = sum(rowCounts);
  const area = components.top.length + components.outerSides.length + components.innerHoleSides.length;
  // A third method counts 0/1 transitions across every row and column, with outside cells empty.
  let transitionSides = 0;
  for (let row = 0; row < side; row++) for (let edge = 0; edge <= side; edge++) {
    transitionSides += Math.abs((H[row][edge-1] || 0) - (H[row][edge] || 0));
    transitionSides += Math.abs((H[edge-1]?.[row] || 0) - (H[edge]?.[row] || 0));
  }
  assert.equal(area, count + transitionSides);
  assert.equal(cubes.length,count);
  return { H,cubes,side,rowCounts,rowHoleCounts,emptyInteriorCells,count,area,difference:area-count,components };
}
const faceKeys = faces => faces.map(face => JSON.stringify(face)).sort();
function checkSurface(surface, oracle) {
  assert.deepEqual(surface.H,oracle.H); assert.deepEqual(keys(surface.cubes),keys(oracle.cubes));
  assert.equal(surface.side,oracle.side); assert.equal(surface.highest,1); assert.equal(surface.cubeEdgeLengthCm,1);
  assert.equal(surface.count,oracle.count); assert.equal(surface.cubeCount,oracle.count);
  assert.equal(surface.areaCm2,oracle.area); assert.equal(surface.surfaceAreaExcludingAllBottomCm2,oracle.area);
  assert.equal(surface.exposedFacesExcludingAllBottom,oracle.area); assert.equal(surface.numericDifference,oracle.difference);
  assert.equal(surface.groundBottomFaces,oracle.count); assert.equal(surface.allExposedFaces,oracle.area+oracle.count);
  assert.equal(surface.sharedFacePairs,oracle.components.contacts.length/2);
  assert.deepEqual(surface.emptyInteriorCells,oracle.emptyInteriorCells);
  assert.equal(surface.emptyInteriorCount,oracle.emptyInteriorCells.length); assert.deepEqual(surface.rowHoleCounts,oracle.rowHoleCounts);
  assert.deepEqual(Object.keys(surface.components).sort(),Object.keys(oracle.components).sort());
  for (const name of Object.keys(oracle.components)) {
    assert.equal(surface.components[name].count,oracle.components[name].length);
    assert.deepEqual(faceKeys(surface.components[name].faces),faceKeys(oracle.components[name]));
  }
  assert.equal(sum(Object.values(surface.components).map(component => component.count)),oracle.count*6);
}
function policyCheck(q) {
  for (const candidate of [q,q.sourcepolicy]) {
    assert.equal(candidate.originalSourceReleaseStatus,"locked");
    for (const flag of ["sourceExact","originalAnswerDeterminate","publisherAnswerVerified","handwrittenAnswerVerified",
      "officialAnswerVerified","constructionConditionApproved","officialHumanApproval","learnerReleaseVerified","productionLoaded","catalogUnlock","deployed"])
      assert.equal(candidate[flag],false,flag);
    for (const flag of ["registrationOnly","sourceConditionsClarified","requestedAnswerUniqueUnderExplicitConstruction",
      "requestedAnswerUnique","uniqueRequestedNumericAnswerUnderConstruction"]) assert.equal(candidate[flag],true,flag);
    assert.equal(candidate.sourceConditionProvenance,"explicit-learner-given-conditions");
  }
  assert.equal(q.sourcepolicy.sourceFirstThreeOnly,true); assert.equal(q.sourcepolicy.firstThreeForceUniqueFuture,false);
  assert.equal(q.sourcepolicy.answerBasis,"conditional-independent-calculation");
  const e = q.sourcepolicy.sourceEvidence;
  assert.equal(e.reportFile,"independent-pattern-review.md"); assert.equal(e.section,heading.slice(3));
  assert.equal(e.cropFile,"mission3-original.png"); assert.equal(e.reportSha256,hashes.report);
  assert.equal(e.cropSha256,hashes.crop); assert.equal(e.pdfSha256,hashes.pdf);
  assert.equal(e.pdfPage,33); assert.equal(e.printedPage,35); assert.equal(e.originalRequestedStage,10);
  assert.deepEqual(e.sourceFirstThreeHeights,firstHeights); assert.deepEqual(e.sourceFirstThreeTotals,[8,20,36]);
  assert.deepEqual(e.sourceFirstThreeEmptyInteriorCounts,[1,5,13]);
  assert.deepEqual(e.originalQuestionOrder,["original-numeric-difference"]);
  assert(q.sourcepolicy.approvalBoundary.includes("Parent source interpretation"));
}
function expectedEquations(oracle,stage,level) {
  const side = oracle.side, holes = oracle.emptyInteriorCells.length, groups = new Map();
  oracle.rowHoleCounts.forEach(empty => groups.set(empty,(groups.get(empty)||0)+1));
  const totals = [...groups].map(([empty,rows]) => empty*rows);
  const full = oracle.count+holes, outer = oracle.components.outerSides.length, inner = oracle.components.innerHoleSides.length;
  const equations = [`2×${stage-1}=${side-3}`,`3+${side-3}=${side}`,`${side}×${side}=${full}`,
    ...[...groups].map(([empty,rows]) => `${empty}×${rows}=${empty*rows}`),
    `${totals.join("+")}=${holes}`,`${full}-${holes}=${oracle.count}`,`${side}×4=${outer}`,`${holes}×4=${inner}`,
    `${oracle.count}+${outer}+${inner}=${oracle.area}`,`${oracle.area}-${oracle.count}=${oracle.difference}`];
  if (level === 2) equations.push(`${oracle.count}+${holes}=${full}`,`${full}+${outer}=${full+outer}`,`${full+outer}-${full}=${outer}`);
  return equations;
}
function validateCase(q,variant,level) {
  const stage = stages[variant], oracle = planeOracle(constructRows(stage));
  assert.equal(q.sourceItemId,id); assert.equal(q.variant,variant); assert.equal(q.level,level); assert.equal(q.stage,stage);
  assert.deepEqual(q.model.H,oracle.H); assert.deepEqual(keys(q.model.cubes),keys(oracle.cubes));
  assert.deepEqual(keys(q.model.layers[0].cells),keys(oracle.cubes.map(([x,,z]) => [x,z])));
  checkSurface(q.surface,oracle); assert.deepEqual(q.surfaceComponents,q.surface.components);
  assert.equal(q.count,oracle.count); assert.equal(q.areaCm2,oracle.area); assert.equal(q.numericDifference,oracle.difference);
  assert.equal(q.resultContract,level === 2 ? "ordered" : "single-value");
  assert.deepEqual(q.answer,level === 2 ? [oracle.difference,planeOracle(constructRows(stage,true)).difference] : oracle.difference);
  assert.deepEqual(q.answerOrder,level === 2 ? ["original-numeric-difference","filled-numeric-difference"] : ["original-numeric-difference"]);
  const answers = level === 2 ? q.answer : [q.answer];
  assert(answers.every(Number.isSafeInteger)); assert.equal(Array.isArray(q.answer),level === 2);
  if (level === 2) {
    const filled = planeOracle(constructRows(stage,true)); checkSurface(q.filledPattern,filled);
    assert.deepEqual(q.filledModel,q.filledPattern); assert.equal(q.filledModel.n,stage);
    assert.equal(q.filledModel.xOrigin,0); assert.equal(q.filledModel.zOrigin,0);
    assert.deepEqual(q.filledPattern.addedCubes,oracle.emptyInteriorCells.map(([x,z]) => [x,0,z]));
    assert.deepEqual(q.filledPattern.moves,[]); assert(q.filledPattern.H.every(row => row.every(height => height === 1)));
    const filledKeys = new Set(keys(q.filledPattern.cubes));
    for (const key of keys(q.model.cubes)) assert(filledKeys.has(key),"Existing cubes must remain unmoved");
    assert.equal(q.filledPattern.count-q.count,oracle.emptyInteriorCells.length);
  } else { assert.equal(q.filledPattern,null); assert.equal(q.filledModel,null); }
  policyCheck(q);
  assert.equal(q.learnerConditions,learnerConditions); assert.equal(q.faceDefinition,faceDefinition);
  assert(q.promptText.startsWith(`${learnerConditions} ${faceDefinition} ${stage}번째 도형에 대하여 `));
  assert(q.promptText.includes("ㄴ cm²")); assert(q.promptText.includes("두 수의 차이 ㄴ-ㄱ"));
  assert.equal((q.promptText.match(/값을 구하시오/g)||[]).length,level === 2 ? 2 : 1);
  assert.deepEqual([...q.promptText.matchAll(/\n\((\d)\)/g)].map(match => Number(match[1])),level === 2 ? [1,2] : []);
  assert.equal(q.promptText.includes("빈칸을 모두 쌓기나무 한 개씩으로 채웁니다"),level === 2);
  assert.equal(q.promptText.includes("한 층으로 만듭니다"),level === 2);
  if (level === 0) {
    assert.deepEqual(q.countCue,{ cubeCount:oracle.count,emptyInteriorCount:oracle.emptyInteriorCells.length });
    assert.deepEqual(q.easyCue,q.countCue);
    assert(q.promptText.includes(`쌓기나무는 ${oracle.count}개이고 안쪽 빈칸은 ${oracle.emptyInteriorCells.length}칸입니다.`));
    assert.deepEqual(Object.keys(q.countCue).sort(),["cubeCount","emptyInteriorCount"]);
  } else {
    assert.equal(q.countCue,null); assert.equal(q.easyCue,null); assert(!q.promptText.includes(`쌓기나무는 ${oracle.count}개`));
  }
  assert(!q.promptText.includes(String(oracle.area)),"Prompt must not supply area");
  for (const answer of answers) assert(!q.promptText.includes(String(answer)),"Prompt must not supply the answer");
  assert.deepEqual(q.solutionEquations,expectedEquations(oracle,stage,level));
  const spans = [...q.solution.matchAll(/<span class="math-inline-expression" style="color:#000">([^<]+)<\/span>/g)].map(match => match[1]);
  assert.deepEqual(spans,q.solutionEquations);
  for (const equation of spans) {
    assert(equation.length <= 40); const match = equation.match(/^([0-9+×-]+)=(\d+)$/); assert(match,"Scalar elementary arithmetic only");
    const terms = match[1].match(/[+-]?\d+(?:×\d+)*/g);
    assert.equal(sum(terms.map(term => term.split("×").reduce((product,value) => product*Number(value),1))),Number(match[2]));
  }
  assert(!/<sup>/.test(spans.join(" "))); assert(q.solution.includes("cm<sup>2</sup>"));
  assert(q.solution.includes("ㄴ과 ㄱ의 수치만 빼면"));
  const fit = q.learnerFit;
  assert.equal(q.learner_stage,learner_stage); assert.equal(fit.learner_stage,learner_stage);
  assert.equal(fit.id,"learner-fit"); assert.deepEqual(fit.criteria,criteria); assert.equal(fit.evidenceFile,path.basename(__filename));
  assert.equal(fit.responseMode,level === 2 ? "ordered-integer-numeric-differences" : "integer-numeric-difference"); assert.equal(fit.responseCount,answers.length);
  assert.equal(fit.humanReviewPending,true); assert.equal(fit.empiricallyCalibrated,false);
  assert.equal(q.difficultyDesign.mode,["easy","source","hard"][level]); assert.equal(q.difficultyDesign.empiricallyCalibrated,false);
  assert(fit.language && fit.representations && fit.prerequisites.length && fit.reasoningLoad);
  const learnerText = [q.promptText,q.solution,fit.language,fit.representations,...fit.prerequisites,fit.reasoningLoad,q.difficultyDesign.structuralChange]
    .join(" ").replace(/cm<sup>2<\/sup>|cm²|\bcm\b/g,"").replace(/<[^>]*>/g,"");
  assert(!/[A-Za-z\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff]|[⁰¹²³⁴⁵⁶⁷⁸⁹^]|\*\*|조합|순열|Σ|∑|\d+\.\d+/.test(learnerText),"Korean copy only; no algebra, CJK/Japanese placeholders, powers, combinations or decimal formula");
  return oracle;
}
function frozenTree(value) {
  if (!value || typeof value !== "object") return;
  assert(Object.isFrozen(value)); Object.values(value).forEach(frozenTree);
}
const contexts = [{ HSE_SOURCE_GRADE6_STACK_PATTERN_MODELS:models },{ window:{ HSE_SOURCE_GRADE6_STACK_PATTERN_MODELS:models } },{}];
for (const context of contexts) {
  if (!context.window && !context.HSE_SOURCE_GRADE6_STACK_PATTERN_MODELS) vm.runInNewContext(modelCode,context);
  vm.runInNewContext(code,context);
  assert.deepEqual(Object.keys(context.window || context).sort(),["HSE_SOURCE_GRADE6_STACK_PATTERN_MODELS","HSE_SOURCE_GRADE6_BORDER_MISSION3_CONTRACTS"].sort());
  assert.equal((context.window || context).HSE_GENERATORS,undefined);
}
assert.deepEqual(contracts.sourceItemIds,[id]); assert.equal(contracts.learnerConditions,learnerConditions);
assert.equal(contracts.learner_stage,learner_stage); assert.equal(contracts.faceDefinition,faceDefinition);
const definition = models.definitions.find(item => item.sourceItemId === id);
assert.deepEqual(definition.pools.map(pool => pool.n),stages); assert.deepEqual(definition.sourceFirstThreeHeights,firstHeights);
for (const [index,state] of models.firstStates(id).entries()) {
  const oracle = planeOracle(firstHeights[index]);
  assert.deepEqual(state.H,firstHeights[index]); assert.deepEqual(state.H,constructRows(index+1));
  assert.deepEqual(keys(state.cubes),keys(oracle.cubes)); assert.equal(oracle.count,[8,20,36][index]);
  assert.equal(oracle.emptyInteriorCells.length,[1,5,13][index]); assert.equal(oracle.area,[24,60,116][index]);
}
let mutationRejections = 0, invalidInputRejections = 0, equationChecks = 0;
const rejectMutation = action => { assert.throws(action,{ name:"TypeError" }); mutationRejections++; };
const generatedCases = [], learnerFitCases = [];
for (let variant = 0; variant < 3; variant++) for (let level = 0; level < 3; level++) {
  const q = contracts.generate(id,variant,level), oracle = validateCase(q,variant,level);
  assert.deepEqual(q.model,models.solve(id,variant)); frozenTree(q); equationChecks += q.solutionEquations.length;
  for (const context of contexts) assert.deepEqual(normalize((context.window || context).HSE_SOURCE_GRADE6_BORDER_MISSION3_CONTRACTS.generate(id,variant,level)),normalize(q));
  const before = JSON.stringify(q);
  rejectMutation(() => { q.answer[0] = -1; }); rejectMutation(() => { q.answerOrder[0] = "wrong"; });
  rejectMutation(() => { q.surface.components.innerHoleSides.faces[0].cube[0] = -1; });
  rejectMutation(() => { q.surface.areaCm2 = -1; }); rejectMutation(() => { q.surface.emptyInteriorCells[0][0] = -1; });
  rejectMutation(() => { q.model.H[0][0] = 0; }); rejectMutation(() => { q.model.cubes[0][1] = 1; });
  rejectMutation(() => { q.sourcepolicy.originalSourceReleaseStatus = "approved"; });
  rejectMutation(() => { q.solutionEquations.push("wrong"); }); rejectMutation(() => { q.learnerFit.criteria.push("wrong"); });
  rejectMutation(() => { q.difficultyDesign.empiricallyCalibrated = true; }); rejectMutation(() => { delete q.faceDefinition; });
  if (q.countCue) rejectMutation(() => { q.countCue.areaCm2 = q.areaCm2; });
  if (q.filledPattern) {
    rejectMutation(() => { q.filledPattern.H[1][1] = 0; }); rejectMutation(() => { q.filledPattern.addedCubes[0][1] = 1; });
    rejectMutation(() => { q.filledPattern.moves.push("move"); });
  }
  assert.equal(JSON.stringify(q),before); assert.deepEqual(contracts.generate(id,variant,level),q);
  generatedCases.push({ variant,level,stage:stages[variant],count:q.count,emptyInteriorCount:oracle.emptyInteriorCells.length,
    surfaceComponents:Object.fromEntries(Object.entries(oracle.components).map(([name,faces]) => [name,faces.length])),
    areaCm2:q.areaCm2,answer:q.answer,answerOrder:q.answerOrder,filledCount:q.filledPattern?.count || null,filledAreaCm2:q.filledPattern?.areaCm2 || null });
  learnerFitCases.push({ sourceItemId:id,variant,level,id:"learner-fit",learner_stage,status:"pass",
    scope:"bounded-contract-self-test",humanReviewPending:true,empiricallyCalibrated:false,
    criteria: { language:{ status:"pass",evidence:q.learnerFit.language },representations:{ status:"pass",evidence:q.learnerFit.representations },
      prerequisites:{ status:"pass",evidence:q.learnerFit.prerequisites },"reasoning-load":{ status:"pass",evidence:q.learnerFit.reasoningLoad },
      "response-mode":{ status:"pass",evidence:{ resultContract:q.resultContract,answerOrder:q.answerOrder,count:q.learnerFit.responseCount } } } });
}
assert.deepEqual(generatedCases.filter(item => item.level === 2).map(item => item.answer),[[808,84],[520,68],[1160,100]]);
assert.equal(generatedCases.length,9); assert.equal(learnerFitCases.length,9);
assert.equal(new Set([0,1,2].map(level => contracts.generate(id,0,level).difficultyDesign.structuralChange)).size,3);
frozenTree(contracts); rejectMutation(() => { contracts.sourceItemIds.push("unowned"); });
rejectMutation(() => { contracts.generate = () => null; });
const invalidNumbers = [-1,3,0.5,"0","1",null,undefined,NaN,Infinity,-Infinity,{},[],true,false,1n,new Number(0),Number.MAX_SAFE_INTEGER+1];
const invalidInputs = [
  ...["6-2-u3-e2-mission-1","6-2-u3-e2-example-2",`${id} `,"",null,undefined,{},[id],new String(id),true].map(bad => [bad,0,0]),
  ...invalidNumbers.map(bad => [id,bad,1]),...invalidNumbers.map(bad => [id,0,bad]),[],[id],[id,0]
];
for (const args of invalidInputs) {
  assert.throws(() => contracts.generate(...args),{ name:"RangeError" });
  let calls = 0;
  const context = { HSE_SOURCE_GRADE6_STACK_PATTERN_MODELS:{ solve() { calls++; throw new Error("Invalid input reached model"); } } };
  vm.runInNewContext(code,context);
  assert.throws(() => context.HSE_SOURCE_GRADE6_BORDER_MISSION3_CONTRACTS.generate(...args),{ name:"RangeError" });
  assert.equal(calls,0); invalidInputRejections++;
}
const missing = {}; vm.runInNewContext(code,missing);
assert.throws(() => missing.HSE_SOURCE_GRADE6_BORDER_MISSION3_CONTRACTS.generate(id,0,0),{ name:"Error" });
const trapContext = { HSE_SOURCE_GRADE6_STACK_PATTERN_MODELS:{ solve(sourceId,variant) {
  const base = models.solve(sourceId,variant), proxy = { ...base };
  for (const key of ["answer","surface","totalCubes","numericDifference","formulaAudit","layerCounts","highest","columns"])
    Object.defineProperty(proxy,key,{ enumerable:false,get() { throw new Error(`Forbidden summary access: ${key}`); } });
  return Object.freeze(proxy);
} } };
vm.runInNewContext(code,trapContext);
for (let variant = 0; variant < 3; variant++) for (let level = 0; level < 3; level++)
  validateCase(normalize(trapContext.HSE_SOURCE_GRADE6_BORDER_MISSION3_CONTRACTS.generate(id,variant,level)),variant,level);
let badGeometryRejections = 0;
for (const corrupt of [
  model => { model.H[1][1] = 1; },model => { model.cubes.pop(); },model => { model.cubes.push(model.cubes[0].slice()); },
  model => { model.cubes[0][1] = 1; },model => { model.cubes[0][0] = -1; },model => { model.layers[0].cells.pop(); },
  model => { model.layers[0].cells[0] = model.layers[0].cells[1].slice(); },model => { model.n = 8; },
  model => { model.xOrigin = 1; },model => { model.H[1].pop(); },model => { model.cubes[0][0] = 0.5; }
]) {
  const damaged = normalize(models.solve(id,0)); corrupt(damaged);
  const context = { HSE_SOURCE_GRADE6_STACK_PATTERN_MODELS:{ solve:() => damaged } }; vm.runInNewContext(code,context);
  assert.throws(() => context.HSE_SOURCE_GRADE6_BORDER_MISSION3_CONTRACTS.generate(id,0,2),{ name:"Error" }); badGeometryRejections++;
}
// Preserve every given state but allow a different continuation when added conditions are absent.
let ambiguityWithoutConditionsNegatives = 0;
for (const stage of [1,2,3,...stages]) {
  const H = constructRows(stage), alternate = H.map(row => row.slice());
  if (stage > 3) alternate[1][1] = 1;
  if (stage <= 3) assert.deepEqual(alternate,firstHeights[stage-1]);
  else { assert.notEqual(planeOracle(H).difference,planeOracle(alternate).difference); ambiguityWithoutConditionsNegatives++; }
}
let floorAndHoleNegatives = 0;
for (const stage of stages) {
  const oracle = planeOracle(constructRows(stage));
  assert.notEqual(oracle.area+oracle.count-oracle.count,oracle.difference,"Including every ground bottom changes the answer");
  assert.notEqual(oracle.area-oracle.components.innerHoleSides.length-oracle.count,oracle.difference,"Omitting hole sides changes the answer");
  floorAndHoleNegatives += 2;
}
const codeMutations = [
  ["+ components.innerHoleSides.count","+ 0"],
  ["const areaCm2 = components.top.count","const areaCm2 = components.groundBottoms.count + components.top.count"],
  ["surface.emptyInteriorCells.map","surface.emptyInteriorCells.slice(0, 1).map"],
  ["const answer = level === 2 ? [surface.numericDifference] : surface.numericDifference","const answer = level === 2 ? [surface.areaCm2] : surface.areaCm2"],
  ["answerOrder.push(\"filled-numeric-difference\")","answerOrder.push(\"original-numeric-difference\")"],
  ["${learnerConditions} ${faceDefinition}","${faceDefinition}"]
];
let behavioralMutationRejections = 0;
for (const [from,to] of codeMutations) {
  assert(code.includes(from)); const context = { HSE_SOURCE_GRADE6_STACK_PATTERN_MODELS:models };
  vm.runInNewContext(code.replace(from,to),context);
  assert.throws(() => validateCase(normalize(context.HSE_SOURCE_GRADE6_BORDER_MISSION3_CONTRACTS.generate(id,0,2)),0,2),{ name:"AssertionError" });
  behavioralMutationRejections++;
}
assert.equal(JSON.stringify(models.definitions),initialDefinitions);
for (const [file,expected] of [[modelPath,hashes.model],[reportPath,hashes.report],[cropPath,hashes.crop],[pdfPath,hashes.pdf]]) assert.equal(hash(file),expected);
console.log(JSON.stringify({
  status:"passed",sourceItemIds:[id],generatedCaseCount:generatedCases.length,generatedCases,
  firstThreeHeights:firstHeights,firstThreeTotals:[8,20,36],firstThreeEmptyInteriorCounts:[1,5,13],
  oracle:"independent alternating row construction, shared geometric unit-face cancellation and row/column boundary transitions; voxel-backed full face comparison",
  equationChecks,invalidInputRejections,mutationRejections,badGeometryRejections,behavioralMutationRejections,
  ambiguityWithoutConditionsNegatives,floorAndHoleNegatives,browserUMDContexts:contexts.length,browserUMDComparisons:27,summaryAccessTrapCases:9,
  learner_stage,learnerFit:{ id:"learner-fit",status:"pass",criteria,cases:learnerFitCases,empiricallyCalibrated:false,humanReviewPending:true },
  evidence:{ reportFile:path.basename(reportPath),section:heading.slice(3),cropFile:path.basename(cropPath),cropDimensions:[826,745],pdfPage:33,printedPage:35,hashes },
  preservation:{ modelSha256:hash(modelPath),modelUnchanged:true },
  skillsApplied:["evidence-gated-learning-pipeline: source, math, learner-fit and release separation","gfield-single-answer-visibility: explicit determinacy and all exposed faces"],
  sourceExact:false,originalAnswerDeterminate:false,originalSourceReleaseStatus:"locked",
  publisherAnswerVerified:false,handwrittenAnswerVerified:false,officialAnswerVerified:false,officialHumanApproval:false,constructionConditionApproved:false,
  sourceConditionsClarified:true,requestedAnswerUniqueUnderExplicitConstruction:true,registrationOnly:true,learnerReleaseVerified:false,
  productionLoaded:false,catalogUnlock:false,deployed:false,browserRun:false,
  pendingGates:["parent presentation and actual desktop/mobile/PDF evidence","parent bank integration","human construction adoption and learner review","publisher answer and release authority"]
},null,2));
