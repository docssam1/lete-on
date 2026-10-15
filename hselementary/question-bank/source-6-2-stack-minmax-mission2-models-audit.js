"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs"), path = require("node:path"), crypto = require("node:crypto"), vm = require("node:vm");
const api = require("./source-6-2-stack-minmax-mission2-models.js");
const counts = require("./source-6-2-stack-count-models.js");
const clone = value => JSON.parse(JSON.stringify(value));
const digest = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex").toUpperCase();
const root = path.resolve(__dirname,"../..");
function snapshot(directory) {
  const result = {};
  function walk(dir) {
    for (const entry of fs.readdirSync(dir,{withFileTypes:true})) {
      if (entry.name === ".git") continue;
      const file = path.join(dir,entry.name);
      if (entry.isDirectory()) walk(file);
      else if (entry.isFile()) result[path.relative(directory,file)] = digest(file);
    }
  }
  walk(directory);
  return result;
}
const repositoryBefore = snapshot(root);
const args = process.argv.slice(2);
assert(args.length === 0 || args.length === 2 && args[0] === "--evidence-dir", "Use only optional --evidence-dir DIRECTORY");
const evidenceDir = args.length ? path.resolve(args[1]) : null;
const evidenceBefore = evidenceDir ? snapshot(evidenceDir) : null;
const source = api.definitions[0].source;
if (evidenceDir) {
  assert.equal(digest(path.join(evidenceDir,source.cropFile)),source.cropSha256);
  assert.equal(digest(path.join(evidenceDir,source.independentReportFile)),source.independentReportSha256);
  const report = fs.readFileSync(path.join(evidenceDir,source.independentReportFile),"utf8");
  assert(report.includes("## Mission 2"));
  assert(report.includes("432") && report.includes("17+20=37"));
}
function deeplyFrozen(value) {
  if (value && typeof value === "object") {
    assert(Object.isFrozen(value));
    Object.values(value).forEach(deeplyFrozen);
  }
}
const canonical = arrangements => arrangements.map(matrix => JSON.stringify(matrix)).sort();
function equalSet(actual, expected) {
  return actual.size === expected.size && [...actual].every(pixel => expected.has(pixel));
}
function silhouette(profile) {
  const pixels = new Set();
  profile.forEach((height,index) => {
    for (let level=0;level<height;level++) pixels.add(`${index},${level}`);
  });
  return pixels;
}
function expectedViews(condition) {
  const top = new Set();
  condition.top.forEach((row,depth) => row.forEach((present,x) => { if (present) top.add(`${x},${depth}`); }));
  return { top, front: silhouette(condition.front), right: silhouette(condition.right) };
}
function voxelProjection(heights) {
  const cubes = new Set(), top = new Set(), front = new Set(), right = new Set();
  heights.forEach((row,depth) => row.forEach((height,x) => {
    for (let level=0;level<height;level++) cubes.add(`${x},${depth},${level}`);
  }));
  for (const cell of cubes) {
    const [x,depth,level] = cell.split(",").map(Number);
    if (level > 0) assert(cubes.has(`${x},${depth},${level-1}`), "Unsupported cube");
    top.add(`${x},${depth}`);
    front.add(`${x},${level}`);
    right.add(`${heights.length-1-depth},${level}`);
  }
  return { cubes, top, front, right };
}
function verifyProjection(heights, condition) {
  const expected = expectedViews(condition), actual = voxelProjection(heights);
  for (const key of ["top","front","right"]) assert(equalSet(actual[key],expected[key]), `Wrong ${key} projection`);
  if (condition.fixedHeights) condition.fixedHeights.forEach((row,depth) => row.forEach((height,x) => {
    if (height !== null) assert.equal(heights[depth][x],height);
  }));
  return actual.cubes.size;
}
// Bound each column using pixel inclusion, then independently scan with a mixed-radix counter.
// No production maxima, bounds, witnesses or accepted arrangements enter this search.
function boundedVoxelSearch(condition) {
  const expected = expectedViews(condition), positions = [], choices = [];
  const ceiling = Math.max(...condition.front,...condition.right);
  condition.top.forEach((row,depth) => row.forEach((present,x) => {
    if (!present) return;
    positions.push([x,depth]);
    const allowed = [];
    for (let height=1;height<=ceiling;height++) {
      let fits = true;
      for (let level=0;level<height;level++) {
        if (!expected.front.has(`${x},${level}`) || !expected.right.has(`${condition.top.length-1-depth},${level}`)) fits = false;
      }
      if (condition.fixedHeights && condition.fixedHeights[depth][x] !== null && condition.fixedHeights[depth][x] !== height) fits = false;
      if (fits) allowed.push(height);
    }
    choices.push(allowed);
  }));
  const trials = choices.reduce((n,values) => n*values.length,1);
  assert(trials <= 1000000, "Independent bounded search budget exceeded");
  const accepted = [], histogram = {};
  const heights = condition.top.map(row => row.map(() => 0));
  for (let code=0;code<trials;code++) {
    let cursor = code;
    positions.forEach(([x,depth],i) => {
      heights[depth][x] = choices[i][cursor % choices[i].length];
      cursor = Math.floor(cursor/choices[i].length);
    });
    const projection = voxelProjection(heights);
    if (!["top","front","right"].every(key => equalSet(projection[key],expected[key]))) continue;
    accepted.push(clone(heights));
    histogram[projection.cubes.size] = (histogram[projection.cubes.size] || 0)+1;
  }
  return { trials, accepted, histogram };
}
function compareAccepted(result, condition, oracle) {
  assert.deepEqual(canonical(result.arrangements),canonical(oracle.accepted));
  assert.equal(new Set(canonical(result.arrangements)).size,result.arrangementCount);
  assert.equal(result.arrangementCount,oracle.accepted.length);
  assert.deepEqual(result.totalHistogram,oracle.histogram);
  const totals = oracle.accepted.map(matrix => verifyProjection(matrix,condition));
  assert.equal(result.minimum,Math.min(...totals));
  assert.equal(result.maximum,Math.max(...totals));
  assert.equal(result.minMaxSum,result.minimum+result.maximum);
  assert.equal(verifyProjection(result.minimumWitness,condition),result.minimum);
  assert.equal(verifyProjection(result.maximumWitness,condition),result.maximum);
  assert.equal(result.searchSize,result.visited);
}
function analyticExtrema(condition) {
  const { top, front, right } = condition;
  const rowBounds = right.slice().reverse(), baseColumns = top.flat().filter(Boolean).length;
  const upper = top.map((row,depth) => row.map((present,x) => present ? Math.min(front[x],rowBounds[depth]) : 0));
  const groups = [];
  for (let depth=0;depth<top.length;depth++) {
    const cells = [];
    for (let x=0;x<front.length;x++) if (top[depth][x] && upper[depth][x] >= rowBounds[depth]) cells.push([x,depth]);
    assert(cells.length);
    if (rowBounds[depth] > 1) groups.push({ target:rowBounds[depth], cells });
  }
  for (let x=0;x<front.length;x++) {
    const cells = [];
    for (let depth=0;depth<top.length;depth++) if (top[depth][x] && upper[depth][x] >= front[x]) cells.push([x,depth]);
    assert(cells.length);
    if (front[x] <= 1) continue;
    const alreadyForced = groups.some(group => group.target === front[x] && group.cells.length === 1 &&
      cells.some(cell => cell.join(",") === group.cells[0].join(",")));
    if (!alreadyForced) groups.push({ target:front[x], cells });
  }
  // Only disjoint attainment groups may contribute additive extras above the one-cube baseline.
  const used = new Set();
  for (const group of groups) for (const cell of group.cells) {
    const key = cell.join(",");
    assert(!used.has(key), "Lower-bound groups overlap");
    used.add(key);
  }
  const minimum = baseColumns+groups.reduce((sum,group) => sum+group.target-1,0);
  const maximum = upper.flat().reduce((sum,height) => sum+height,0);
  const minimumWitness = top.map(row => row.map(present => present ? 1 : 0));
  for (const group of groups) {
    const [x,depth] = group.cells.at(-1);
    minimumWitness[depth][x] = group.target;
  }
  assert.equal(verifyProjection(minimumWitness,condition),minimum);
  assert.equal(verifyProjection(upper,condition),maximum);
  return { baseColumns, groups, upper, minimum, maximum, minimumWitness, maximumWitness:upper };
}
assert.equal(api.definitions.length,1);
assert.equal(api.definitions[0].sourceItemId,"6-2-u3-e2-mission-2");
assert.equal(api.definitions[0].variantCount,3);
assert.equal(api.definitions[0].pools.length,3);
assert.equal(api.viewConvention,counts.viewConvention);
for (const flags of [api,api.definitions[0]]) {
  assert.equal(flags.registrationOnly,true);
  for (const key of ["official","officialAnswerVerified","learnerReleaseVerified","renderedFidelityVerified","difficultyVerified","directionPresentationVerified"]) assert.equal(flags[key],false);
}
deeplyFrozen(api);
const definitionsBefore = JSON.stringify(api.definitions), existingModelsBefore = JSON.stringify(counts.definitions);
const sourceCondition = { top:[[1,0,0],[1,1,1],[0,1,1],[1,1,1]], front:[4,2,3], right:[4,3,1,3] };
assert.deepEqual(api.definitions[0].pools[0],sourceCondition);
const rows = [];
let poolTrials = 0, acceptedCount = 0, secondaryCases = 0, secondaryTrials = 0, negativeTests = 0;
let secondaryAcceptedCases = 0, secondaryRejectedCases = 0;
for (let variant=0;variant<3;variant++) {
  const peak = 4+variant, expected = clone(sourceCondition);
  expected.front[0] = peak; expected.right[0] = peak;
  const condition = api.definitions[0].pools[variant];
  assert.deepEqual(condition,expected);
  assert.deepEqual(Object.keys(condition).sort(),["front","right","top"]);
  const result = api.solve(api.definitions[0].sourceItemId,variant);
  const oracle = boundedVoxelSearch(expected), analytic = analyticExtrema(expected);
  compareAccepted(result,expected,oracle);
  assert.equal(result.searchSize,108*peak);
  assert.equal(result.searchSize,oracle.trials);
  assert.equal(result.arrangementCount,9);
  assert.equal(result.minimum,peak+13); assert.equal(result.maximum,peak+16);
  assert.equal(result.answer,2*peak+29);
  assert.equal(result.minimum,analytic.minimum); assert.equal(result.maximum,analytic.maximum);
  assert.deepEqual(result.upperBounds,analytic.upper);
  assert.equal(analytic.baseColumns,9); assert.equal(analytic.groups.length,4);
  assert.deepEqual(canonical(analytic.groups.slice(0,3).map(group => group.cells)),canonical([[[0,0]],[[2,2]],[[0,3]]]));
  assert.deepEqual(analytic.groups[3],{target:2,cells:[[1,2],[1,3]]});
  assert.deepEqual(analytic.minimumWitness,[[3,0,0],[1,1,1],[0,1,3],[peak,2,1]]);
  assert.deepEqual(analytic.maximumWitness,[[3,0,0],[1,1,1],[0,2,3],[peak,2,3]]);
  assert.equal(result.uniqueRequestedNumericAnswer,true); assert.equal(result.uniqueArrangement,false);
  assert.equal(result.secondaryFixedHeights,false); assert.equal(result.registrationOnly,true);
  assert.equal(result.official,false); assert.equal(result.officialAnswerVerified,false); assert.equal(result.learnerReleaseVerified,false);
  deeplyFrozen(result);
  assert.throws(() => { result.arrangements[0][0][0] = 0; },TypeError);
  assert.throws(() => { result.condition.front[0] = 0; },TypeError);
  assert.throws(() => { result.minimumWitness[0][0] = 0; },TypeError);
  assert.throws(() => { result.totalHistogram[result.minimum] = 999; },TypeError);
  assert.deepEqual(api.solve(api.definitions[0].sourceItemId,variant),result);
  assert.deepEqual(api.enumerate(clone(condition)),result);
  // Check every one-cell height clue, including feasible, contradictory and empty-cell clues.
  for (let depth=0;depth<4;depth++) for (let x=0;x<3;x++) {
    const heights = condition.top[depth][x] ? Array.from({length:analytic.upper[depth][x]},(_,i) => i+1) : [0];
    for (const height of heights) {
      const secondary = clone(condition);
      secondary.fixedHeights = condition.top.map(row => row.map(() => null));
      secondary.fixedHeights[depth][x] = height;
      const saved = JSON.stringify(secondary), secondaryOracle = boundedVoxelSearch(secondary);
      if (!secondaryOracle.accepted.length) {
        assert.throws(() => api.enumerate(secondary),RangeError); negativeTests++; secondaryRejectedCases++;
      } else {
        secondaryAcceptedCases++;
        const narrowed = api.enumerate(secondary);
        compareAccepted(narrowed,secondary,secondaryOracle);
        assert.equal(narrowed.secondaryFixedHeights,true); deeplyFrozen(narrowed);
        assert.equal(narrowed.searchSize,secondaryOracle.trials);
        secondary.fixedHeights[depth][x] = null;
        assert.equal(narrowed.condition.fixedHeights[depth][x],height);
        secondary.fixedHeights[depth][x] = height;
      }
      assert.equal(JSON.stringify(secondary),saved);
      secondaryCases++; secondaryTrials += secondaryOracle.trials;
    }
  }
  const exact = {...clone(condition),fixedHeights:clone(result.minimumWitness)};
  const exactOracle = boundedVoxelSearch(exact), exactResult = api.enumerate(exact);
  compareAccepted(exactResult,exact,exactOracle);
  assert.equal(exactResult.uniqueArrangement,true); assert.equal(exactResult.arrangementCount,1);
  secondaryCases++; secondaryAcceptedCases++; secondaryTrials += exactOracle.trials;
  rows.push({variant,peak,searchSize:result.searchSize,arrangementCount:result.arrangementCount,
    minimum:result.minimum,maximum:result.maximum,answer:result.answer,totalHistogram:result.totalHistogram});
  poolTrials += oracle.trials; acceptedCount += oracle.accepted.length;
}
assert.equal(api.solve("6-2-u3-e2-mission-2").answer,37);
const wrongDirection = clone(sourceCondition); wrongDirection.right.reverse();
const wrongOracle = boundedVoxelSearch(wrongDirection), wrongResult = counts.enumerate(wrongDirection);
compareAccepted(wrongResult,wrongDirection,wrongOracle);
assert.equal(wrongOracle.trials,1296); assert.equal(wrongResult.arrangementCount,63);
assert.equal(wrongResult.minimum,17); assert.equal(wrongResult.maximum,22); assert.equal(wrongResult.minMaxSum,39);
const missingFootprint = clone(sourceCondition); missingFootprint.top[2][1] = 0;
const missingOracle = boundedVoxelSearch(missingFootprint), missingResult = counts.enumerate(missingFootprint);
compareAccepted(missingResult,missingFootprint,missingOracle);
assert.equal(missingOracle.trials,216); assert.equal(missingResult.arrangementCount,3);
assert.equal(missingResult.minimum,16); assert.equal(missingResult.maximum,18); assert.equal(missingResult.minMaxSum,34);
const bad = [null,[],{},wrongDirection,missingFootprint,
  {...clone(sourceCondition),front:[7,2,3],right:[7,3,1,3]},
  {...clone(sourceCondition),front:[5,2,3]}, {...clone(sourceCondition),right:[5,3,1,3]},
  {...clone(sourceCondition),front:[4,3,3]}, {...clone(sourceCondition),right:[4,3,2,3]},
  {...clone(sourceCondition),front:[4,2]}, {...clone(sourceCondition),right:[4,3,1]},
  {...clone(sourceCondition),top:[[1,0,0],[1,1,1],[1,1,1],[1,1,1]]},
  {...clone(sourceCondition),top:[[1,0,0],[1,1,1],[0,1],[1,1,1]]},
  {...clone(sourceCondition),front:["4",2,3]}, {...clone(sourceCondition),right:[NaN,3,1,3]},
  {...clone(sourceCondition),total:17}, {...clone(sourceCondition),highest:4},
  {...clone(sourceCondition),hidden:1}, {...clone(sourceCondition),[Symbol("unknown")]:1},
  {...clone(sourceCondition),fixedHeights:undefined}, {...clone(sourceCondition),fixedHeights:[]},
  {...clone(sourceCondition),fixedHeights:[[3,1,0],[null,null,null],[0,null,null],[4,null,null]]},
  {...clone(sourceCondition),fixedHeights:[[4,0,0],[null,null,null],[0,null,null],[4,null,null]]},
  {...clone(sourceCondition),fixedHeights:[[0,0,0],[null,null,null],[0,null,null],[4,null,null]]},
  {...clone(sourceCondition),fixedHeights:[[3,0,0],[null,null,null],[0,null,null],[4,1.5,null]]},
  {...clone(sourceCondition),fixedHeights:[[3,0,0],[null,null,null],[0,null,null],[4,7,null]]},
  {...clone(sourceCondition),fixedHeights:[[3,0,0],[null,null,null],[0,null,null],[3,null,null]]}];
const sparseTop = clone(sourceCondition); delete sparseTop.top[1][1]; bad.push(sparseTop);
const sparseRow = clone(sourceCondition); delete sparseRow.top[1]; bad.push(sparseRow);
const sparseProfile = clone(sourceCondition); delete sparseProfile.front[0]; bad.push(sparseProfile);
const sparseFixed = {...clone(sourceCondition),fixedHeights:sourceCondition.top.map(row => row.map(() => null))};
delete sparseFixed.fixedHeights[1][1]; bad.push(sparseFixed);
const inherited = Object.create(sourceCondition); bad.push(inherited);
for (const condition of bad) { assert.throws(() => api.enumerate(condition),RangeError); negativeTests++; }
for (const variant of [-1,3,4,0.5,"0",null,NaN,Infinity]) {
  assert.throws(() => api.solve("6-2-u3-e2-mission-2",variant),RangeError); negativeTests++;
}
for (const id of [null,"missing","mission-2","6-2-u3-e2-mission-4"]) {
  assert.throws(() => api.solve(id),RangeError); negativeTests++;
}
assert.throws(() => { api.definitions[0].pools[0].top[0][0] = 0; },TypeError);
assert.throws(() => { api.definitions[0].pools.push(sourceCondition); },TypeError);
assert.throws(() => { api.conditionPolicy.peaks[0] = 9; },TypeError);
assert.equal(JSON.stringify(api.definitions),definitionsBefore);
assert.equal(JSON.stringify(counts.definitions),existingModelsBefore);
const totalOracleTrials = poolTrials+secondaryTrials+wrongOracle.trials+missingOracle.trials;
assert(totalOracleTrials <= 1000000, "Aggregate independent search budget exceeded");
assert.equal(secondaryCases,secondaryAcceptedCases+secondaryRejectedCases);
const modelText = fs.readFileSync(path.join(__dirname,"source-6-2-stack-minmax-mission2-models.js"),"utf8");
const auditText = fs.readFileSync(__filename,"utf8");
assert(!/[A-Za-z]:[\\/]/.test(modelText+auditText), "Private absolute path in public JS");
const sentinel = { names:["existing"], generate:() => "existing" };
const browser = { window:{HSE_GENERATORS:sentinel,HSE_SOURCE_GRADE6_STACK_COUNT_MODELS:counts} };
const globalsBefore = Object.keys(browser.window);
vm.runInNewContext(modelText,browser);
assert.deepEqual(Object.keys(browser.window).sort(),[...globalsBefore,"HSE_SOURCE_GRADE6_STACK_MINMAX_MISSION2_MODELS"].sort());
assert.equal(browser.window.HSE_GENERATORS,sentinel); assert.deepEqual(sentinel.names,["existing"]);
assert.equal(browser.window.HSE_SOURCE_GRADE6_STACK_MINMAX_MISSION2_MODELS.solve("6-2-u3-e2-mission-2").answer,37);
assert.throws(() => vm.runInNewContext(modelText,{window:{}}),/dependency is required/);
assert.deepEqual(snapshot(root),repositoryBefore);
if (evidenceDir) assert.deepEqual(snapshot(evidenceDir),evidenceBefore);
console.log(JSON.stringify({ status:"passed",definitionCount:1,modelCount:3,models:rows,
  poolOracleTrials:poolTrials,poolAccepted:acceptedCount,secondaryCases,secondaryOracleTrials:secondaryTrials,
  secondaryAcceptedCases,secondaryRejectedCases,invalidPoolInputs:bad.length,invalidSolveInputs:12,
  negativeTests,diagnosticOracleTrials:wrongOracle.trials+missingOracle.trials,totalOracleTrials,
  independentSearchBudget:1000000,exactAcceptedSetsCompared:true,coordinateVoxelProjectionsVerified:true,
  analyticMaximumAndDisjointForcedLowerBoundsVerified:true,immutableResultsVerified:true,
  wrongDirectionDiagnostic:{trials:1296,accepted:63,minimum:17,maximum:22,sum:39},
  missingFootprintDiagnostic:{trials:216,accepted:3,minimum:16,maximum:18,sum:34},
  sourceHashesChecked:Boolean(evidenceDir),repositoryFilesChecked:Object.keys(repositoryBefore).length,
  existingFilesUnchanged:true,privateEvidenceUnchanged:evidenceDir ? true : null,
  registrationOnly:true,generatorRegistration:false,unlockCount:0,official:false,learnerReleaseVerified:false,
  renderedFidelityVerified:false,difficultyVerified:false,
  residualRisk:"Source lacks an explicit front arrow; direction presentation, rendering, teacher review and difficulty remain unverified. No release or official-key claim."
},null,2));
