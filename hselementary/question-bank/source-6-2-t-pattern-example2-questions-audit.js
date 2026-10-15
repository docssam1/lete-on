"use strict";
const fs = require("node:fs"), path = require("node:path"), vm = require("node:vm"), assert = require("node:assert/strict"), crypto = require("node:crypto");
const models = require("./source-6-2-stack-pattern-models.js");
const contracts = require("./source-6-2-t-pattern-example2-contracts.js");
const presentation = require("./source-6-2-t-pattern-example2-presentation.js");
const id = "6-2-u3-e2-example-2", key = "sourceGrade6SecondSpaceE2TPatternCount";
const type = { sourceItemId: id, generatorKey: key, reviewLocked: false };
const read = file => fs.readFileSync(path.join(__dirname, file), "utf8");
const wrapper = read("source-6-2-t-pattern-example2-questions.js"), presentationCode = read("source-6-2-t-pattern-example2-presentation.js");
const css = read("source-6-2-t-pattern-example2-questions.css"), contractCode = read("source-6-2-t-pattern-example2-contracts.js");
const prefix = fs.readFileSync(path.join(__dirname, "assets/source-6-2-t-pattern-example2/prefix-given.png"));
const normalize = value => JSON.parse(JSON.stringify(value));
const attributes = tag => Object.fromEntries([...tag.matchAll(/([\w-]+)="([^"]*)"/g)].map(match => [match[1], match[2]]));
const sorted = cells => cells.map(cell => cell.join(",")).sort();
const badRange = action => assert.throws(action, { name: "RangeError" });
let generated = 0, svgFigures = 0, svgCells = 0, contractRejections = 0, routingRejections = 0, layerRejections = 0, delegationCases = 0;

function fresh(candidate = presentation) {
  const delegated = [], api = { names: ["old"],
    generatorKey() { delegated.push({ kind: "key", receiver: this, args: [...arguments] }); return "old-key"; },
    generate() { delegated.push({ kind: "generate", receiver: this, args: [...arguments] }); return "unchanged-old"; }
  };
  const window = { HSE_GENERATORS: api, HSE_SOURCE_GRADE6_T_PATTERN_EXAMPLE2_PRESENTATION: candidate };
  vm.runInNewContext(wrapper, { window }, { filename: "source-6-2-t-pattern-example2-questions.js" });
  return { api, window, delegated };
}

function flags(q) {
  for (const name of ["registrationOnly", "sourceConditionsClarified", "requestedAnswerUnique", "uniqueRequestedNumericAnswerUnderConstruction"])
    assert.equal(q[name], true, name);
  for (const name of ["learnerReleaseVerified", "publisherAnswerVerified", "handwrittenAnswerVerified", "sourceExact", "originalAnswerDeterminate", "officialHumanApproval", "constructionConditionApproved"])
    assert.equal(q[name], false, name);
  assert.equal(q.originalSourceReleaseStatus, "locked");
  assert.equal(q.sourceConditionProvenance, "explicit-learner-given-conditions");
  assert.equal(q.sourcepolicy.answerBasis, "conditional-independent-calculation");
  assert.equal(q.sourcepolicy.firstThreeForceUniqueFuture, false);
  assert.equal(q.learner_stage, contracts.learner_stage);
  assert.equal(q.learnerFit.id, "learner-fit");
  assert.equal(q.learnerFit.learner_stage, q.learner_stage);
  assert.deepEqual(q.learnerFit.criteria, ["language", "representations", "prerequisites", "reasoning-load", "response-mode"]);
  assert.equal(q.learnerFit.humanReviewPending, true);
  assert.equal(q.resultContract, "ordered");
}

function svgCheck(q, svg, layer) {
  const attrs = attributes(svg.slice(0, svg.indexOf(">") + 1)), rects = [...svg.matchAll(/<rect\b[^>]*\/>/g)].map(match => attributes(match[0]));
  // Reconstruct expected occupancy independently from H, not the generated SVG.
  const expected = [];
  q.model.H.forEach((row, z) => row.forEach((height, column) => { if (height >= layer) expected.push([column + q.model.xOrigin, z]); }));
  const actual = rects.map(rect => [Number(rect["data-x"]), Number(rect["data-z"])]);
  assert.deepEqual(sorted(actual), sorted(expected));
  assert.equal(new Set(sorted(actual)).size, expected.length);
  const minX = Math.min(...expected.map(([x]) => x)), maxX = Math.max(...expected.map(([x]) => x));
  const minZ = Math.min(...expected.map(([, z]) => z)), maxZ = Math.max(...expected.map(([, z]) => z));
  assert.equal(attrs.xmlns, "http://www.w3.org/2000/svg");
  assert.equal(Number(attrs["data-layer"]), layer);
  assert.equal(attrs["data-orientation"], "back-to-front");
  assert.equal(Number(attrs["data-min-x"]), minX); assert.equal(Number(attrs["data-min-z"]), minZ);
  assert.equal(Number(attrs.width), (maxX - minX + 1) * 16 + 20);
  assert.equal(Number(attrs.height), (maxZ - minZ + 1) * 16 + 20);
  assert.equal(attrs.viewBox, `0 0 ${attrs.width} ${attrs.height}`);
  assert(attrs.style.includes("background:#fff"));
  assert(!/<text\b|<image\b|<foreignObject\b|transform=/.test(svg));
  for (const rect of rects) {
    assert.equal(Number(rect.x), 10 + (Number(rect["data-x"]) - minX) * 16);
    assert.equal(Number(rect.y), 10 + (Number(rect["data-z"]) - minZ) * 16);
    assert.equal(Number(rect["data-layer"]), layer);
    assert.equal(rect.width, "16"); assert.equal(rect.height, "16");
    assert.equal(rect.fill, "#fff"); assert.equal(rect.stroke, "#000"); assert.equal(rect["stroke-width"], "1");
    assert(Number(rect.x) + 16 < Number(attrs.width)); assert(Number(rect.y) + 16 < Number(attrs.height));
  }
  svgFigures++; svgCells += rects.length;
}

function promptCheck(q, p) {
  assert.equal(p.promptText, q.promptText);
  assert(p.prompt.includes(q.learnerConditions));
  assert(p.prompt.includes(q.promptText.split(/(?=\([123]\))/).join("<br>")));
  assert.equal((p.prompt.match(/<br>/g) || []).length, q.level === 0 ? 0 : q.level === 1 ? 2 : 3);
  assert.equal((p.prompt.match(/<button\b/g) || []).length, 1);
  assert.equal((p.prompt.match(/<img\b/g) || []).length, 1);
  const image = attributes(p.prompt.match(/<img\b[^>]*>/)[0]);
  assert.equal(image.src, "./assets/source-6-2-t-pattern-example2/prefix-given.png");
  assert.equal(image.width, "1600"); assert.equal(image.height, "523");
  assert.equal(image.alt, "첫째, 둘째, 셋째 T자 쌓기나무 모양");
  const button = attributes(p.prompt.match(/<button\b[^>]*>/)[0]);
  assert.equal(button.class, "source62-m3-image-button");
  assert.equal(button["data-m3-figure"], String(q.variant));
  assert.equal(button["data-source-figure-family"], "t-pattern-example2");
  assert(!/<svg\b|data-x=|data-z=|data-removed=|data-source-answer-layer=|math-inline-expression|정답은/.test(p.prompt));
  q.answer.forEach(answer => assert(!p.prompt.includes(`${answer}개`), "Result leaked into student prompt"));
  const tables = p.prompt.match(/<table\b/g) || [];
  assert.equal(tables.length, 0); assert.equal(p.layerCue, null);
  assert(!/given-layer-counts|data-layer-count|층별 개수 표|[=+×]/.test(q.promptText));
  if (q.level === 0) {
    assert.equal(q.model.n, [3, 2, 1][q.variant]);
    assert.deepEqual(q.answer, [[21], [11], [4]][q.variant]);
    assert.deepEqual(q.model.H, models.definitions.find(item => item.sourceItemId === id).sourceFirstThreeHeights[q.model.n - 1]);
    assert(q.promptText.includes("그림에 보이는"));
    assert.equal((q.promptText.match(/몇 개인지/g) || []).length, 1);
  }
}

function equationCheck(q) {
  const inline = [...q.solution.matchAll(/<span class="math-inline-expression">([^<]+)<\/span>/g)].map(match => match[1]);
  assert.deepEqual(inline, q.solutionEquations);
  inline.forEach(equation => {
    const match = /^(\d+(?:[+×-]\d+)*)=(\d+)개$/.exec(equation);
    assert(match, `Unexpected equation ${equation}`);
    const terms = match[1].match(/[+-]?\d+(?:×\d+)*/g);
    const result = terms.reduce((sum, term) => sum + term.split("×").reduce((product, value) => product * Number(value), 1), 0);
    assert.equal(result, Number(match[2]));
  });
}

assert.equal(crypto.createHash("sha256").update(fs.readFileSync(path.join(__dirname, "source-6-2-t-pattern-example2-contracts.js"))).digest("hex"),
  "671e201ef8458d4c7cc7bd0c2ec992d4b18aa86f2cc5bf65747fde0cf5aa6346");
assert.equal(prefix.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
assert.equal(prefix.readUInt32BE(16), 1600); assert.equal(prefix.readUInt32BE(20), 523);
assert.deepEqual(contracts.sourceItemIds, [id]);
assert.deepEqual(models.firstStates(id).map(model => model.totalCubes), [4, 11, 21]);
const definition = models.definitions.find(item => item.sourceItemId === id);
models.firstStates(id).forEach((model, index) => assert.deepEqual(model.H, definition.sourceFirstThreeHeights[index]));
const frozenModels = JSON.stringify(models.definitions);
const browser = { HSE_SOURCE_GRADE6_T_PATTERN_EXAMPLE2_CONTRACTS: contracts };
vm.runInNewContext(presentationCode, browser);
const browserContracts = { HSE_SOURCE_GRADE6_STACK_PATTERN_MODELS: models };
vm.runInNewContext(contractCode, browserContracts);

for (let variant = 0; variant < 3; variant++) for (let level = 0; level < 3; level++) {
  const q = contracts.generate(id, variant, level), p = presentation.render(id, variant, level), n = (level === 0 ? [3, 2, 1] : [25, 20, 30])[variant];
  flags(q); flags(p); assert.equal(q.model.n, n); assert.equal(Object.isFrozen(q), true); assert.equal(Object.isFrozen(p), true);
  assert.deepEqual(normalize(browserContracts.HSE_SOURCE_GRADE6_T_PATTERN_EXAMPLE2_CONTRACTS.generate(id, variant, level)), normalize(q));
  assert.deepEqual(normalize(browser.HSE_SOURCE_GRADE6_T_PATTERN_EXAMPLE2_PRESENTATION.render(id, variant, level)), normalize(p));
  const actualCounts = Array(n).fill(0);
  q.model.cubes.forEach(([, y]) => actualCounts[y]++);
  const total = actualCounts.reduce((sum, count) => sum + count, 0), difference = actualCounts[0] - actualCounts.at(-1);
  const removed = actualCounts.slice(-3).reduce((sum, count) => sum + count, 0);
  assert.deepEqual(q.answer, level === 0 ? [total] : level === 1 ? [total, difference] : [total, difference, total - removed]);
  assert.equal(total, (level === 0 ? [21, 11, 4] : [1000, 650, 1425])[variant]);
  if (level !== 0) { assert.equal(difference, [72, 57, 87][variant]); assert.equal(removed, 21); }
  assert.deepEqual(p.difficultyDesign, q.difficultyDesign); assert.equal(p.difficultyDesign.mode, ["easy", "source", "hard"][level]);
  assert.equal(p.difficultyDesign.empiricallyCalibrated, false); assert.equal(p.learnerFit.responseCount, level + 1);
  assert.equal(p.solution, q.solution); equationCheck(q); promptCheck(q, p);
  assert.equal(p.answer, q.answer.map((count, index) => `(${index + 1})${count}개`).join(";"));
  assert.equal(p.answerKeyVisual, true); assert(!/<\/?\w+\b/.test(p.answer));
  const layers = [...new Set(level === 2 ? [1, n, n - 1, n - 2] : [1, n])];
  const figures = [...p.answerVisual.matchAll(/<figure\b[^>]*>(.*?)<\/figure>/g)];
  assert.equal(figures.length, layers.length);
  figures.forEach((figure, index) => {
    const layer = layers[index], svg = figure[1].match(/<svg\b.*?<\/svg>/)[0];
    assert.equal(svg, presentation.layerSvg(q, layer)); svgCheck(q, svg, layer);
    assert.equal(svg, browser.HSE_SOURCE_GRADE6_T_PATTERN_EXAMPLE2_PRESENTATION.layerSvg(q, layer));
    const removedLayer = level === 2 && layer >= n - 2;
    assert.equal(attributes(figure[0])["data-removed"], String(removedLayer));
    assert(figure[1].includes(`<figcaption>${layer}층 · ${actualCounts[layer - 1]}개${removedLayer ? " · 제거하는 층" : ""}</figcaption>`));
    const button = attributes(figure[1].match(/<button\b[^>]*>/)[0]);
    assert(button.class.split(" ").includes("source62-m3-image-button"));
    assert(button.class.split(" ").includes("source62-t-pattern-grid-button"));
    assert.equal(button["data-m3-figure"], String(variant)); assert.equal(button["data-source-figure-family"], "t-pattern-layer");
    assert.equal(button["data-source-answer-layer"], String(layer)); assert.equal(button["data-source-difficulty-level"], String(level));
    assert.equal(button["aria-label"], `${layer}층 그림 확대`); assert.equal(button.title, `${layer}층 그림 확대`);
    assert(figure[1].endsWith(`${svg}</button>`));
  });
  assert.equal((p.answerVisual.match(/<svg\b/g) || []).length, layers.length);
  for (const bad of [0, 2, n - 3, n + 1, "1", null, NaN, Infinity, .5].filter(value => !layers.includes(value))) { badRange(() => presentation.layerSvg(q, bad)); layerRejections++; }
  const { api } = fresh(), generatedQ = api.generate(type, 7, level - 1, 123, variant);
  flags(generatedQ); assert.equal(api.generatorKey(type), key); assert.equal(generatedQ.answer, p.answer);
  assert.equal(generatedQ.answerVisual, `<div data-print-weight="regular3">${p.answerVisual}</div>`);
  assert.equal(generatedQ.answerPageLayout, "two-column"); assert.equal(generatedQ.answerKeyVisual, true);
  assert.equal(generatedQ.generator, key); assert.equal(generatedQ.levelRank, 7); assert.equal(generatedQ.sourceDifficultyRank, 1);
  assert.equal(generatedQ.difficultyOffset, level - 1); assert.equal(generatedQ.difficultyLevel, level); assert.equal(generatedQ.difficultyRank, level);
  assert.equal(generatedQ.verifiedVariantCount, 3); assert.equal(generatedQ.verifiedVariantTarget, 3);
  assert.equal(generatedQ.verifiedVariantId, `${id}:v${variant}`); assert.equal(generatedQ.verifiedPoolIndex, variant);
  assert.equal(generatedQ.generationMode, "fixed-verified-pool"); assert.equal(generatedQ.officialAnswerVerified, false);
  assert.deepEqual(generatedQ.difficultyDesign, q.difficultyDesign); generated++;
}
assert.equal(JSON.stringify(models.definitions), frozenModels);

const poisonedText = { HSE_SOURCE_GRADE6_T_PATTERN_EXAMPLE2_CONTRACTS: { ...contracts, generate(...args) {
  return { ...contracts.generate(...args), promptText: '<img src="bad" onerror="bad">&\n(1) <script>bad</script>' };
} } };
vm.runInNewContext(presentationCode, poisonedText);
const safePrompt = poisonedText.HSE_SOURCE_GRADE6_T_PATTERN_EXAMPLE2_PRESENTATION.render(id, 0, 1).prompt;
assert(safePrompt.includes("&lt;img src=&quot;bad&quot; onerror=&quot;bad&quot;&gt;&amp;\n<br>(1) &lt;script&gt;bad&lt;/script&gt;"));
assert.equal((safePrompt.match(/<img\b/g) || []).length, 1); assert(!/<script\b/.test(safePrompt));
const unbrokenText = { HSE_SOURCE_GRADE6_T_PATTERN_EXAMPLE2_CONTRACTS: { ...contracts, generate(...args) {
  const q = contracts.generate(...args); return { ...q, promptText: q.promptText.replaceAll("\n", "") };
} } };
vm.runInNewContext(presentationCode, unbrokenText);
for (const level of [1, 2]) {
  const prompt = unbrokenText.HSE_SOURCE_GRADE6_T_PATTERN_EXAMPLE2_PRESENTATION.render(id, 0, level).prompt;
  assert.equal((prompt.match(/<br>/g) || []).length, level + 1);
  for (let part = 1; part <= level + 1; part++) assert(prompt.includes(`<br>(${part})`));
  assert(prompt.includes(contracts.learnerConditions));
}

const badContracts = [
  ...["unknown", null, undefined, {}, [id]].map(value => [value, 0, 1]),
  ...[-1, 3, .5, "0", NaN, Infinity, null, undefined, {}, true, Number.MAX_SAFE_INTEGER + 1].map(value => [id, value, 1]),
  ...[-1, 3, .5, "1", NaN, Infinity, null, undefined, {}, true].map(value => [id, 0, value])
];
badContracts.forEach(args => {
  let solveCalls = 0;
  const context = { HSE_SOURCE_GRADE6_STACK_PATTERN_MODELS: { solve() { solveCalls++; throw new Error("Invalid input reached model"); } } };
  vm.runInNewContext(contractCode, context);
  badRange(() => context.HSE_SOURCE_GRADE6_T_PATTERN_EXAMPLE2_CONTRACTS.generate(...args)); assert.equal(solveCalls, 0); contractRejections++;
});
for (const bad of [-2, 2, .5, "0", false, {}, [], NaN, Infinity, null]) { badRange(() => fresh().api.generate(type, 1, bad, 17, 0)); routingRejections++; }
for (const bad of [-1, .5, "0", null, false, {}, [], NaN, Infinity, Number.MAX_SAFE_INTEGER + 1]) { badRange(() => fresh().api.generate(type, 1, 0, 17, bad)); routingRejections++; }
const malformed = [
  { ...type, reviewLocked: true }, { ...type, generatorKey: "old" }, { ...type, generatorKey: "" }, { ...type, generatorKey: null },
  { sourceItemId: id }, { sourceItemId: "unowned", generatorKey: key }, { generatorKey: key },
  Object.assign([], type), Object.assign(() => {}, type), Object.create(type)
];
malformed.forEach(bad => {
  const { api, delegated } = fresh(); assert.equal(api.generatorKey(bad), ""); assert.equal(api.generate(bad, 1, 0, 17, 0), null);
  assert.equal(delegated.length, 0); routingRejections++;
});
for (const [name, value] of Object.entries({ sourceItemId: "wrong", variant: 1, level: 2, sourceConditionsClarified: false,
  requestedAnswerUnique: false, originalAnswerDeterminate: true, originalSourceReleaseStatus: "eligible", sourceExact: true,
  registrationOnly: false, learnerReleaseVerified: true, publisherAnswerVerified: true, handwrittenAnswerVerified: true,
  officialHumanApproval: true, constructionConditionApproved: true })) {
  const { api } = fresh({ render(...args) { return { ...presentation.render(...args), [name]: value }; } });
  assert.equal(api.generate(type, 1, 0, 17, 0), null); routingRejections++;
}
for (const bad of [null, {}, { ...contracts.generate(id, 0, 1), sourceItemId: "unknown" }, { ...contracts.generate(id, 0, 1), level: 3 }]) {
  badRange(() => presentation.layerSvg(bad, 1)); layerRejections++;
}
assert.equal(fresh().api.generate(type, 1).verifiedPoolIndex, 0);
assert.equal(fresh().api.generate(type, 1).difficultyLevel, 1);

for (const args of [[{ old: true }, 7, -1, 123, 4, "extra"], [{ sourceItemId: "6-2-u3-e2-mission-1" }, 2, 0, 19], [null], [], ["old", 1, 2, 3, null]]) {
  const { api, delegated } = fresh(), receiver = { marker: "caller" };
  assert.equal(api.generate.apply(receiver, args), "unchanged-old"); assert.equal(delegated.length, 1);
  assert.equal(delegated[0].receiver, receiver); assert.deepEqual(delegated[0].args, args); delegationCases++;
}
for (const other of [null, undefined, "old", { old: true }, { sourceItemId: "6-2-u3-e3-exploration" }]) {
  const { api, delegated } = fresh(), receiver = { marker: "caller" };
  assert.equal(api.generatorKey.call(receiver, other, "extra"), "old-key");
  assert.equal(delegated[0].receiver, receiver); assert.deepEqual(delegated[0].args, [other, "extra"]); delegationCases++;
}
const finite = fresh(), requests = Array.from({ length: 120 }, (_, variant) => finite.api.generate(type, 1, 0, 17, variant));
assert.equal(new Set(requests.map(q => q.verifiedVariantId)).size, 3); assert.equal(new Set(requests.map(q => q.prompt)).size, 3);
requests.forEach((q, variant) => { assert.equal(q.verifiedPoolIndex, variant % 3); assert.equal(q.verifiedVariantCount, 3); });
assert.equal(finite.api.generate(type, 1, 0, 17, Number.MAX_SAFE_INTEGER).verifiedPoolIndex, Number.MAX_SAFE_INTEGER % 3);
const reload = fresh(); vm.runInNewContext(wrapper, { window: reload.window });
assert.equal(reload.api.names.filter(name => name === key).length, 1);
assert.equal(reload.api.generate(type, 1, 0, 17, 0).answer, "(1)1000개;(2)72개");
for (const window of [{}, { HSE_GENERATORS: {} }, { HSE_SOURCE_GRADE6_T_PATTERN_EXAMPLE2_PRESENTATION: presentation }])
  assert.throws(() => vm.runInNewContext(wrapper, { window }), { name: "Error" });

// Exercise real older wrappers, not just a delegation stub.
const legacyWindow = { HSE_GENERATORS: { names: ["old"], generatorKey: () => "", generate: () => null } };
for (const family of ["stacks", "example2", "example3", "mission3", "mission5", "mission6", "exploration"]) {
  legacyWindow[`HSE_SOURCE_GRADE6_PAINTED_${family.toUpperCase()}_PRESENTATION`] = require(`./source-6-2-painted-${family}-presentation.js`);
  vm.runInNewContext(read(`source-6-2-painted-${family}-questions.js`), { window: legacyWindow });
}
const olderTypes = [
  ["6-2-u3-e3-example-1", "sourceGrade6SecondSpaceE3PaintedFaceClasses"],
  ["6-2-u3-e3-mission-2", "sourceGrade6SecondSpaceE3NotchedPaintedFaceClasses"],
  ["6-2-u3-e3-mission-4", "sourceGrade6SecondSpaceE3AllPaintedArea"],
  ["6-2-u3-e3-mission-1", "sourceGrade6SecondSpaceE3UnpaintedInnerCubes"],
  ["6-2-u3-e3-example-2", "sourceGrade6SecondSpaceE3PaintBeforeRemoval"],
  ["6-2-u3-e3-example-3-1", "sourceGrade6SecondSpaceE3ExactlyTwoRed"],
  ["6-2-u3-e3-example-3-2", "sourceGrade6SecondSpaceE3AtLeastOneColor"],
  ["6-2-u3-e3-mission-3", "sourceGrade6SecondSpaceE3PaintedFourThree"],
  ["6-2-u3-e3-mission-5-1", "sourceGrade6SecondSpaceE3PaintedVolumeInverse"],
  ["6-2-u3-e3-mission-5-2", "sourceGrade6SecondSpaceE3PaintedSurfaceInverse"],
  ["6-2-u3-e3-mission-6-1", "sourceGrade6SecondSpaceE3PaintedOneFace"],
  ["6-2-u3-e3-mission-6-2", "sourceGrade6SecondSpaceE3PaintedNoFace"],
  ["6-2-u3-e3-exploration", "sourceGrade6SecondSpaceE3PaintedExploration"]
];
const baseline = [];
for (const [sourceItemId, generatorKey] of olderTypes) for (let variant = 0; variant < 3; variant++) for (let offset = -1; offset <= 1; offset++) {
  const args = [{ sourceItemId, generatorKey, reviewLocked: false }, 1, offset, 17, variant], before = legacyWindow.HSE_GENERATORS.generate(...args);
  assert(before, `Missing older generator ${sourceItemId}`);
  baseline.push({ args, before: normalize(before), oldKey: legacyWindow.HSE_GENERATORS.generatorKey(args[0]) });
}
const previousNames = [...legacyWindow.HSE_GENERATORS.names];
legacyWindow.HSE_SOURCE_GRADE6_T_PATTERN_EXAMPLE2_PRESENTATION = presentation;
vm.runInNewContext(wrapper, { window: legacyWindow });
baseline.forEach(entry => {
  assert.deepEqual(normalize(legacyWindow.HSE_GENERATORS.generate(...entry.args)), entry.before);
  assert.equal(legacyWindow.HSE_GENERATORS.generatorKey(entry.args[0]), entry.oldKey);
});
olderTypes.forEach(([sourceItemId, generatorKey]) => {
  const locked = { sourceItemId, generatorKey, reviewLocked: true };
  assert.equal(legacyWindow.HSE_GENERATORS.generatorKey(locked), ""); assert.equal(legacyWindow.HSE_GENERATORS.generate(locked, 1, 0, 17, 0), null);
});
assert.deepEqual(normalize(legacyWindow.HSE_GENERATORS.names), [...previousNames, key]);
assert.equal(legacyWindow.HSE_GENERATORS.generate(type, 1, 0, 17, 0).generator, key);

for (const name of ["source-6-2-t-pattern-example2-presentation.js", "source-6-2-t-pattern-example2-questions.js", "source-6-2-t-pattern-example2-questions.css", "source-6-2-t-pattern-example2-questions-audit.js"]) {
  assert(!/(?:^|[^A-Za-z0-9_])[A-Za-z]:[\\/]|file:\/\/|private-sources[\\/]|visualizations[\\/]/.test(read(name)), `Private absolute path in ${name}`);
}
assert(css.includes("var(--bank-font, inherit)")); assert(css.includes("font: inherit; color: #000"));
assert(css.includes("font-weight: 400")); assert(css.includes("width: min(78mm, 100%); max-width: 78mm"));
assert(css.includes(".source62-t-pattern-answer .source62-t-pattern-grid-button"));
assert(css.includes("grid-template-columns: repeat(2, minmax(0, 1fr))"));
assert(!/:hover|100vh|page-break-before|break-before:\s*page|!important/.test(css));
console.log(JSON.stringify({ status: "passed", generatedCases: generated, svgFigures, svgCells, contractRejections, routingRejections, layerRejections,
  delegationCases, legacyRetentionCases: baseline.length, legacyLockedCases: olderTypes.length, finitePoolRequests: requests.length, distinctVariants: 3,
  frozenContractSha256Verified: true, exactPrefixDimensions: [prefix.readUInt32BE(16), prefix.readUInt32BE(20)], noNewlinePromptCases: 2,
  givenResultLeaks: 0, modelOrientation: "back-to-front",
  exportedLayerSvgReusedExactly: true, answerPageLayout: "two-column", answerPrintWeight: "regular3",
  sourceConditionsClarified: true, originalAnswerDeterminate: false, originalSourceReleaseStatus: "locked", sourceExact: false,
  learner_stage: contracts.learner_stage, learnerFit: { id: "learner-fit", status: "pending", criteria: ["language", "representations", "prerequisites", "reasoning-load", "response-mode"] },
  registrationOnly: true, learnerReleaseVerified: false, officialAnswerVerified: false, browserRun: false, catalogUnlock: false,
  pendingParentGates: ["shared zoom integration", "index and app integration", "desktop/mobile/browser", "actual mixed A4/PDF print",
    "learner-fit and difficulty", "construction adoption", "teacher/publisher approval", "release authority"] }));
