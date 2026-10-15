"use strict";
const assert = require("node:assert/strict"), fs = require("node:fs"), path = require("node:path"), vm = require("node:vm");
const crypto = require("node:crypto");
const contractFile = "source-6-2-stack-operation-question-contracts.js";
const protectedFiles = ["source-6-2-stack-operations.js", "source-6-2-stack-models.js", "source-inventory-grade6.js", "index.html",
  "source-inventory/6-2-source-items.json", "source-inventory/6-2-u3-e1-readiness-review.json"];
const read = name => fs.readFileSync(path.join(__dirname, name), "utf8");
const digest = name => crypto.createHash("sha256").update(fs.readFileSync(path.join(__dirname, name))).digest("hex");
const hashesBefore = Object.fromEntries(protectedFiles.map(name => [name, digest(name)]));
const api = require("./source-6-2-stack-operation-question-contracts.js");
const operations = require("./source-6-2-stack-operations.js");
const id = suffix => `6-2-u3-e1-${suffix}`;
const label = index => String.fromCodePoint(0x3260 + index);
// Original source fixtures stay fixed; variant heights come from the current math definitions.
// Occupancy, removal, additions and full silhouettes below are computed without solve().
const fixtures = [
  { sourceItemId: id("example-2"), sourceHeights: [[2,3,1],[0,2,2],[0,2,1]],
    columns: [[1,0],[2,0],[0,0],[1,1],[1,2],[2,1],[2,2]] },
  { sourceItemId: id("mission-5"), sourceHeights: [[0,0,2],[3,2,1],[1,0,0]],
    additions: [[0,2,2],[1,1,1]] },
  { sourceItemId: id("mission-6"), sourceHeights: [[0,2,2,1],[2,3,0,0],[0,1,0,0]],
    marked: [[0,1,1],[1,2,1],[1,0,2]] }
];
const key = cell => cell.join(",");
const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
function occupied(heights) {
  const cells = new Set();
  for (let z = 0; z < heights.length; z++) for (let x = 0; x < heights[z].length; x++) {
    for (let y = 0; y < heights[z][x]; y++) cells.add(key([x, y, z]));
  }
  return cells;
}
function scan(cells, template) {
  const rows = template.length, cols = template[0].length;
  const top = template.map(row => row.map(() => 0)), front = Array(cols).fill(0), right = Array(rows).fill(0);
  const heights = template.map(row => row.map(() => 0));
  const frontPixels = new Set(), rightPixels = new Set();
  for (const address of cells) {
    const [x, y, z] = address.split(",").map(Number);
    top[z][x] = 1; front[x] = Math.max(front[x], y + 1); right[rows - 1 - z] = Math.max(right[rows - 1 - z], y + 1);
    heights[z][x] = Math.max(heights[z][x], y + 1);
    frontPixels.add(key([x, y])); rightPixels.add(key([rows - 1 - z, y]));
  }
  return { views: { top, front, right, back: front.slice().reverse(), left: right.slice().reverse() }, heights, frontPixels, rightPixels };
}
function numericViews(views) {
  for (const [name, values] of Object.entries(views)) {
    assert(["top", "front", "right", "back", "left"].includes(name));
    assert(Array.isArray(values));
    if (name === "top") assert(values.every(row => Array.isArray(row) && row.every(n => n === 0 || n === 1)));
    else assert(values.every(n => Number.isSafeInteger(n) && n >= 0));
  }
}
function deeplyFrozen(value) {
  if (value && (typeof value === "object" || typeof value === "function")) {
    assert(Object.isFrozen(value)); Object.values(value).forEach(deeplyFrozen);
  }
}
const setEqual = (a, b) => a.size === b.size && [...a].every(item => b.has(item));
let contracts = 0, removalTrials = 0;
assert.equal(api.registrationOnly, true);
assert.equal(api.officialAnswerVerified, false);
assert.equal(api.learnerReleaseVerified, false);
assert.equal(api.variantCount, 3);
assert.deepEqual(api.levels, [0, 1, 2]);
assert.deepEqual(api.definitions.map(item => item.sourceItemId), fixtures.map(item => item.sourceItemId));
deeplyFrozen(api);
const dependencyBefore = JSON.stringify(operations.definitions);
for (const fixture of fixtures) for (let variant = 0; variant < 3; variant++) {
  const currentDefinition = operations.definitions.find(item => item.sourceItemId === fixture.sourceItemId);
  assert.equal(currentDefinition.pools.length, 3);
  assert.deepEqual(currentDefinition.pools[0], fixture.sourceHeights);
  const heights = currentDefinition.pools[variant], cells = occupied(heights), before = scan(cells, heights);
  const levels = [0, 1, 2].map(level => api.generate(fixture.sourceItemId, variant, level));
  for (const [level, contract] of levels.entries()) {
    assert.equal(contract.sourceItemId, fixture.sourceItemId); assert.equal(contract.variant, variant); assert.equal(contract.level, level);
    assert.equal(contract.registrationOnly, true); assert.equal(contract.officialAnswerVerified, false); assert.equal(contract.learnerReleaseVerified, false);
    assert.equal(contract.variantCount, 3);
    assert.deepEqual(contract.beforeHeights, heights);
    assert.deepEqual(new Set(contract.givenSolid.cells.map(key)), cells);
    assert.deepEqual(contract.sourceRef.pools, currentDefinition.pools);
    assert.equal(contract.viewConvention, api.viewConvention);
    assert.equal(contract.viewConvention.preserveEmptyRowsAndColumns, true);
    assert.equal(contract.viewConvention.removalGravity, false);
    assert.equal(contract.difficultyDesign.mode, ["easy", "source", "hard"][level]);
    assert.equal(contract.difficultyDesign.empiricallyCalibrated, false);
    assert.match(contract.difficultyDesign.structuralChange, /[가-힣]/);
    assert.deepEqual(contract.difficultyDesign.givenViews, Object.keys(contract.givenViews));
    assert.deepEqual(contract.difficultyDesign.requestedViews, contract.requestedViews);
    assert.deepEqual(contract.difficultyDesign.secondaryRequestedViews, contract.secondaryRequestedViews);
    assert.match(contract.promptText, /[가-힣]/); assert.match(contract.solutionText, /[가-힣]/);
    assert(contract.reasoningSteps.every(step => typeof step === "string" && /[가-힣]/.test(step)));
    assert.equal(contract.sourceStepCount, levels[1].reasoningSteps.length);
    assert.equal(contract.sourceStepCount, fixture.marked ? 4 : 3);
    assert.equal(contract.reasoningSteps.length, (fixture.marked ? [3, 4, 6] : [2, 3, 4])[level]);
    assert.equal(api.definitions.find(item => item.sourceItemId === fixture.sourceItemId).sourceStepCount, contract.sourceStepCount);
    assert.deepEqual(Object.keys(contract.answerViews), contract.requestedViews);
    assert.deepEqual(Object.keys(contract.givenViews), Object.keys(contract.givenViewStages));
    numericViews(contract.givenViews); numericViews(contract.answerViews); deeplyFrozen(contract);
    assert(!/(힌트|최댓값|투영|프로필|13개|총 13|전체 13)/.test(contract.promptText));
    if (fixture.columns) {
      assert.equal(contract.answerKind, "labels");
      assert.deepEqual(contract.operation, { kind: "remove-one-labelled-top", independentRemovals: true, removeCountPerTrial: 1 });
      assert.deepEqual(contract.requestedViews, ["front", "right"]);
      assert.deepEqual(contract.answerViews, { front: before.views.front, right: before.views.right });
      const answers = [], secondary = [];
      fixture.columns.forEach(([x, z], index) => {
        const target = [x, heights[z][x] - 1, z], remaining = new Set(cells); assert(remaining.delete(key(target)));
        const after = scan(remaining, heights);
        const qualifies = setEqual(before.frontPixels, after.frontPixels) && setEqual(before.rightPixels, after.rightPixels);
        const changesTop = !equal(before.views.top, after.views.top);
        assert.deepEqual(contract.givenSolid.labels[index], { label: label(index), cell: target });
        assert.deepEqual(contract.removalTrials[index], { label: label(index), removedCell: target, qualifies, changesTop,
          afterHeights: after.heights, afterViews: after.views });
        if (qualifies) { answers.push(label(index)); if (changesTop) secondary.push(label(index)); }
        removalTrials++;
      });
      assert.equal(contract.removalTrials.length, 7);
      assert.deepEqual(contract.answerLabels, answers);
      assert.deepEqual(contract.secondaryAnswerLabels, level === 2 ? secondary : []);
      assert.deepEqual(contract.secondaryRequestedViews, level === 2 ? ["top"] : []);
      assert.deepEqual(contract.givenViews, level === 0 ? { front: before.views.front, right: before.views.right } : {});
      assert.deepEqual(contract.givenViewStages, level === 0 ? { front: "before", right: "before" } : {});
      assert.match(contract.promptText, /각각 한 개씩 따로/);
      assert.match(contract.promptText, /기호를 모두 쓰시오/);
      assert.equal(contract.promptText.includes("위에서"), level === 2);
      if (level === 0) {
        assert.match(contract.reasoningSteps[0], /각각 한 개씩 따로/);
        assert.match(contract.reasoningSteps[0], /주어진 앞과 오른쪽 모양과 비교/);
        assert(contract.reasoningSteps[1].includes(answers.join(", ")));
      }
      assert(!Object.hasOwn(contract, "totalGiven")); assert(!Object.hasOwn(contract, "afterHeights"));
    } else {
      assert.equal(contract.answerKind, "views");
      assert.deepEqual(contract.answerLabels, []); assert.deepEqual(contract.secondaryAnswerLabels, []);
      assert.deepEqual(contract.secondaryRequestedViews, []);
      assert.match(contract.solutionText, /정답 그림과 같습니다/);
      assert(!/(있는 칸은 1|없는 칸은 0|뒤쪽 줄부터|왼쪽부터|\d\s*,\s*\d)/.test(contract.solutionText), "Solutions must refer to answer drawings, not serialize numeric projections");
      const remaining = new Set(cells);
      if (fixture.additions) {
        for (const [x, z, count] of fixture.additions) for (let y = heights[z][x]; y < heights[z][x] + count; y++) {
          assert(!remaining.has(key([x, y, z]))); remaining.add(key([x, y, z]));
        }
        assert.equal(remaining.size, cells.size + 3);
        assert.deepEqual(contract.operation, { kind: "add-to-labelled-columns", additions: fixture.additions.map(([x, z, count], index) => ({ label: label(index), column: [x, z], count })) });
        assert.deepEqual(contract.givenSolid.labels, fixture.additions.map(([x, z], index) => ({ label: label(index), cell: [x, heights[z][x] - 1, z] })));
        assert.deepEqual(contract.requestedViews, level === 2 ? ["right", "front"] : ["right"]);
        assert.deepEqual(contract.givenViews, level === 0 ? { top: before.views.top, right: before.views.right } : { top: before.views.top });
        assert.deepEqual(contract.givenViewStages, level === 0 ? { top: "before", right: "before" } : { top: "before" });
        assert.match(contract.promptText, /㉠ 위에 쌓기나무 2개, ㉡ 위에 쌓기나무 1개/);
        assert.equal(contract.promptText.includes("앞에서"), level === 2);
        assert(!Object.hasOwn(contract, "totalGiven"));
        if (level === 0) {
          assert.match(contract.reasoningSteps[0], /㉠ 위에 쌓기나무 2개, ㉡ 위에 쌓기나무 1개/);
          assert.match(contract.reasoningSteps[1], /주어진 더 쌓기 전 오른쪽 모양/);
          assert.match(contract.reasoningSteps[1], /더 쌓은 뒤 오른쪽 모양을 그립니다/);
        }
      } else {
        fixture.marked.forEach(cell => assert(remaining.delete(key(cell))));
        assert.equal(remaining.size, cells.size - 3);
        assert.deepEqual(contract.operation, { kind: "remove-marked-cubes", removeAllMarked: true, markedColor: "black" });
        assert.deepEqual(contract.givenSolid.markedCells, fixture.marked);
        assert.deepEqual(contract.givenSolid.labels, []);
        assert.equal(contract.totalGiven, cells.size);
        assert(contract.promptText.includes(`쌓기나무 ${cells.size}개`));
        assert.equal(currentDefinition.markedCells.length, 3);
        assert(contract.promptText.includes(`검은색 쌓기나무 ${currentDefinition.markedCells.length}개를 모두 빼었을 때`));
        assert.deepEqual(contract.requestedViews, level === 0 ? ["front", "right"] : level === 1 ? ["top", "front", "right"] : ["top", "front", "right", "back", "left"]);
        assert.deepEqual(contract.givenViews, level === 0 ? { top: scan(remaining, heights).views.top } : {});
        assert.deepEqual(contract.givenViewStages, level === 0 ? { top: "after" } : {});
        assert.equal(contract.promptText.includes("뒤, 왼쪽"), level === 2);
      }
      const after = scan(remaining, heights);
      assert.deepEqual(contract.afterHeights, after.heights);
      assert.deepEqual(occupied(contract.afterHeights), remaining, "No collapse or unsupported gap may be silently introduced");
      for (const view of contract.requestedViews) assert.deepEqual(contract.answerViews[view], after.views[view]);
      for (const name of ["front", "right"]) {
        const profile = after.views[name], pixels = after[`${name}Pixels`];
        assert.equal(profile.reduce((sum, n) => sum + n, 0), pixels.size, "Profiles must describe the full occupied silhouettes");
      }
    }
    const replay = api.generate(fixture.sourceItemId, variant, level);
    assert.deepEqual(replay, contract); assert.notEqual(replay, contract);
    assert.throws(() => { contract.beforeHeights[0][0] = 99; }, TypeError);
    assert.throws(() => { contract.sourceRef.pools[0][0][0] = 99; }, TypeError);
    contracts++;
  }
  assert.deepEqual(levels[0].answerLabels, levels[1].answerLabels);
  assert.deepEqual(levels[2].answerLabels, levels[1].answerLabels);
  assert.equal(new Set(levels.map(contract => contract.difficultyDesign.structuralChange)).size, 3);
  assert(levels[0].reasoningSteps.length < levels[1].reasoningSteps.length);
  assert(levels[2].reasoningSteps.length > levels[1].reasoningSteps.length);
}
for (const level of [0, 1, 2]) assert.deepEqual(api.generate(id("example-2"), 0, level).answerLabels, [label(1), label(3), label(6)]);
assert.deepEqual(api.generate(id("example-2"), 0, 2).secondaryAnswerLabels, [label(1), label(6)]);
assert.deepEqual(api.generate(id("mission-5"), 0, 1).answerViews, { right: [3,3,2] });
assert.deepEqual(api.generate(id("mission-5"), 0, 1).afterHeights, [[0,0,2],[3,3,1],[3,0,0]]);
assert.deepEqual(api.generate(id("mission-6"), 0, 2).answerViews, {
  top: [[0,1,1,1],[1,1,0,0],[0,0,0,0]], front: [1,2,2,1], right: [0,2,2], back: [1,2,2,1], left: [2,2,0]
});
assert.deepEqual(api.generate(id("mission-6"), 0, 1).afterHeights, [[0,2,2,1],[1,2,0,0],[0,0,0,0]]);
let negativeInputs = 0;
for (const bad of [undefined, null, true, "0", -1, 3, 0.5, NaN, Infinity, {}, []]) {
  assert.throws(() => api.generate(id("example-2"), bad, 1), RangeError);
  assert.throws(() => api.generate(id("example-2"), 0, bad), RangeError); negativeInputs += 2;
}
for (const bad of [undefined, null, "unknown", "__proto__", "toString", 0, {}, new String(id("example-2"))]) {
  assert.throws(() => api.generate(bad, 0, 1), RangeError); negativeInputs++;
}
assert.throws(() => api.generate(), RangeError); negativeInputs++;
const catalogContext = { window: {} };
vm.runInNewContext(read("source-inventory-grade6.js"), catalogContext);
const catalog = catalogContext.window.HSE_SOURCE_INVENTORY_GRADE6;
const sourceInventory = JSON.parse(read("source-inventory/6-2-source-items.json"));
const readiness = JSON.parse(read("source-inventory/6-2-u3-e1-readiness-review.json"));
const releasedKeys = {
  [id("example-2")]: "sourceGrade6SecondSpaceE1StackRemovalLabels",
  [id("mission-5")]: "sourceGrade6SecondSpaceE1StackAddViews",
  [id("mission-6")]: "sourceGrade6SecondSpaceE1StackRemoveBlackViews"
};
for (const fixture of fixtures) {
  const item = catalog.items.find(candidate => candidate.sourceItemId === fixture.sourceItemId);
  assert.equal(item.reviewLocked, false); assert.equal(item.generatorKey, releasedKeys[fixture.sourceItemId]); assert.equal(item.verifiedVariantCount, 3);
  assert.equal(item.answerVisualStatus, "verified"); assert.equal(item.sourceVerified, true);
  const sourceItem = sourceInventory.items.find(candidate => candidate.sourceItemId === fixture.sourceItemId);
  assert.equal(sourceItem.implementationStatus, "fixed-verified-pool"); assert.equal(sourceItem.publisherAnswerVerified, false);
  const review = readiness.items.find(candidate => candidate.sourceItemId === fixture.sourceItemId);
  assert.equal(review.releaseStatus, "verified"); assert.equal(review.publicDecision, "confirmed");
  assert.equal(review.generatorKey, item.generatorKey); assert.equal(review.verifiedVariantCount, 3);
  assert.equal(review.answerContract, sourceItem.answerContract);
  assert.equal(review.learnerRenderVerified, true); assert.equal(review.publisherAnswerVerified, false);
}
const catalogBefore = JSON.stringify(catalog), contractCode = read(contractFile);
const blocked = new Proxy({}, { get() { throw new Error("Contract must not touch learner state or drawing APIs"); }, set() { throw new Error("No learner state writes"); } });
const browser = { window: { HSE_SOURCE_INVENTORY_GRADE6: catalog,
  document: blocked, localStorage: blocked }, document: blocked, localStorage: blocked, fetch() { throw new Error("No network"); } };
vm.runInNewContext(read("source-6-2-stack-models.js"), browser);
vm.runInNewContext(read("source-6-2-stack-operations.js"), browser);
vm.runInNewContext(contractCode, browser);
const browserAPI = browser.window.HSE_SOURCE_GRADE6_STACK_OPERATION_QUESTION_CONTRACTS;
assert.equal(browserAPI.registrationOnly, true);
for (const fixture of fixtures) for (let variant = 0; variant < 3; variant++) for (let level = 0; level < 3; level++) {
  assert.equal(JSON.stringify(browserAPI.generate(fixture.sourceItemId, variant, level)), JSON.stringify(api.generate(fixture.sourceItemId, variant, level)));
}
assert.deepEqual(Object.keys(browser.window).sort(), ["HSE_SOURCE_GRADE6_STACK_MODELS", "HSE_SOURCE_GRADE6_STACK_OPERATIONS", "HSE_SOURCE_GRADE6_STACK_OPERATION_QUESTION_CONTRACTS",
  "HSE_SOURCE_INVENTORY_GRADE6", "document", "localStorage"].sort());
assert.equal(JSON.stringify(catalog), catalogBefore);
assert.throws(() => vm.runInNewContext(contractCode, { window: {} }), /Stack operations must be loaded/);
let amdAPI;
const define = (dependencies, factory) => { assert.deepEqual(Array.from(dependencies), ["./source-6-2-stack-operations.js"]); amdAPI = factory(operations); };
define.amd = {};
vm.runInNewContext(contractCode, { define, window: {} });
assert.equal(JSON.stringify(amdAPI.generate(id("mission-6"), 2, 2)), JSON.stringify(api.generate(id("mission-6"), 2, 2)));
assert.equal(JSON.stringify(operations.definitions), dependencyBefore);
assert(read("index.html").includes(contractFile), "The learner entrypoint must load the validated source contracts");
for (const name of protectedFiles) assert.equal(digest(name), hashesBefore[name], `Protected file changed: ${name}`);
console.log(`PASS: ${contracts} contracts, ${removalTrials} independent labelled-removal checks, ${negativeInputs} rejected inputs; three finite learner releases match the source/readiness ledger, CommonJS/browser/AMD and immutable protected hashes. Calculation modules do not change release state.`);
