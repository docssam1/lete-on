"use strict";
const assert = require("node:assert/strict"), fs = require("node:fs"), path = require("node:path"), vm = require("node:vm"), crypto = require("node:crypto");
const contracts = require("./source-6-2-four-vertex-cut-contracts.js");
const id = "6-2-u3-e4-example-2", key = "sourceGrade6SecondSpaceE4FourVertexCut", pool = [4, 3, 5];
const prefix = "HSE_SOURCE_GRADE6_FOUR_VERTEX_CUT_", scriptFile = "source-6-2-four-vertex-cut-questions.js", cssFile = "source-6-2-four-vertex-cut-questions.css";
const modelFiles = ["source-6-2-plane-cut-models.js", "source-6-2-four-vertex-cut-models.js", "source-6-2-four-vertex-cut-contracts.js"];
const clone = value => JSON.parse(JSON.stringify(value)), code = file => fs.readFileSync(path.join(__dirname, file), "utf8");
const sha = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const fingerprints = () => [scriptFile, cssFile, "source-6-2-four-vertex-cut-questions-audit.js", ...modelFiles].map(file => ({ file, sha256: sha(path.join(__dirname, file)) }));
function outputFolder(env = process.env) {
  const root = env.HSE_FOUR_VERTEX_SOURCE_EVIDENCE_DIR, directory = env.HSE_SCREENSHOT_DIR || (root && path.join(root, "four-vertex-wrapper"));
  assert(directory, "Set HSE_SCREENSHOT_DIR or HSE_FOUR_VERTEX_SOURCE_EVIDENCE_DIR");
  assert(path.isAbsolute(directory) && path.parse(directory).root.toLowerCase() === "e:\\", "Output must be an explicit absolute E: directory");
  const folder = path.resolve(directory), repository = path.resolve(__dirname, "../.."), relative = path.relative(repository, folder);
  assert(relative && (relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)), "Output must be outside the repository");
  assert.equal(path.basename(folder).toLowerCase(), "four-vertex-wrapper", "Output is bounded to four-vertex-wrapper");
  if (root) assert.equal(folder.toLowerCase(), path.resolve(root, "four-vertex-wrapper").toLowerCase(), "Output must remain under the evidence root");
  return folder;
}
function check(report, name, fn) {
  try { const detail = fn(); report.checks.push({ name, status: "pass", ...(detail === undefined ? {} : { detail }) }); }
  catch (error) { report.checks.push({ name, status: "fail", error: error.message }); }
}
async function asyncCheck(report, name, fn) {
  try { await fn(); report.checks.push({ name, status: "pass" }); }
  catch (error) { report.checks.push({ name, status: "fail", error: error.message }); }
}
function stubApi() {
  const calls = [], sentinel = { legacy: "unchanged" };
  return { names: ["legacy"], calls, sentinel,
    generatorKey: function(...args) { calls.push({ method: "key", receiver: this, args }); return args[0]?.reviewLocked ? "" : "legacy-key"; },
    generate: function(...args) { calls.push({ method: "generate", receiver: this, args }); return args[0]?.reviewLocked ? null : sentinel; } };
}
function syntheticAssets() {
  const records = new Map();
  for (const n of pool) for (const kind of ["given", "cut-top", "cut-all"]) {
    const file = `n${n}-${kind}.png`;
    records.set(file, Object.freeze({ file, width: 1600, height: 1600, sha256: "a".repeat(64), dimensions: Object.freeze([n, n, n]), kind, glyphSize: 72 }));
  }
  return Object.freeze({ files: Object.freeze([...records.keys()]), image(file) { if (!records.has(file)) throw new RangeError("Unverified synthetic asset"); return records.get(file); } });
}
function syntheticPresentation() {
  const image = (q, kind) => `<button type="button" class="source62-four-vertex-cut-zoom" data-four-vertex-cut-file="n${q.model.n}-${kind}.png"><img src="./assets/source-6-2-four-vertex-cut/n${q.model.n}-${kind}.png" width="1600" height="1600" alt="four vertex source geometry" data-glyph-size="72"/></button>`;
  const grids = (q, mode) => q.requestedLayers.map(layer => {
    const row = q.model.layers[layer - 1], selected = new Set(row[mode === "cut" ? "cutCells" : "touchCells"].map(String));
    return `<svg data-layer="${layer}" data-phase="${mode}">${row.cells.map(([x, z]) => `<rect data-x="${x}" data-z="${z}" data-selected="${selected.has(`${x},${z}`)}" fill="${selected.has(`${x},${z}`) ? "#cedfcf" : "#fff"}"/>`).join("")}</svg>`;
  }).join("");
  return Object.freeze({ renderBank(source, variant, level) {
    const q = contracts.generate(source, variant, level);
    return Object.freeze({ ...q,
      prompt: `<div class="source62-four-vertex-given"><p>${q.promptText}</p><div data-four-vertex-solid="given">${image(q, "given")}</div></div>`,
      answer: Array.isArray(q.answer) ? q.answer.map((value, index) => `(${index + 1}) ${value}\uAC1C`).join("; ") : `${q.answer}\uAC1C`,
      answerVisual: `<div class="source62-four-vertex-answer"><div data-four-vertex-solid="answer">${image(q, level === 0 ? "cut-top" : "cut-all")}</div><div class="source62-cut-layers">${grids(q, "cut")}</div>${level === 2 ? `<div class="source62-cut-layers">${grids(q, "touch")}</div>` : ""}</div>`,
      solution: q.solutionText, answerKeyVisual: true });
  } });
}
function load(document, overrides = {}) {
  const api = stubApi(), window = { HSE_GENERATORS: api }, context = vm.createContext({ window, ...(document ? { document } : {}) });
  modelFiles.forEach(file => vm.runInContext(code(file), context, { filename: file }));
  window[`${prefix}ASSETS`] = syntheticAssets(); window[`${prefix}PRESENTATION`] = syntheticPresentation();
  Object.assign(window, overrides); vm.runInContext(code(scriptFile), context, { filename: scriptFile }); return { api, window, context };
}
let xml;
function parseMarkup(markup) {
  if (!xml) {
    try { xml = require("xml-js"); } catch (error) {
      if (error.code !== "MODULE_NOT_FOUND") throw error;
      xml = require(process.env.HSE_XML_PARSER_PATH || path.join(process.env.USERPROFILE || "", ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/xml-js"));
    }
  }
  const normalized = markup.replace(/<img\b([^>]*?)\s*\/?\s*>/g, (_, attributes) => `<img${attributes.replace(/\/$/, "")}/>`);
  return xml.xml2js(`<audit-root>${normalized}</audit-root>`, { compact: false }).elements[0];
}
const elements = (node, name) => (node.elements || []).flatMap(child => [...(child.type === "element" && (!name || child.name === name) ? [child] : []), ...elements(child, name)]);
const attr = (node, name) => node.attributes?.[name];
const textContent = node => (node.elements || []).map(child => child.type === "text" ? child.text : textContent(child)).join("");
function validateQuestion(q, presentation, variant, level) {
  const pure = contracts.generate(id, variant, level), base = presentation.renderBank(id, variant, level);
  assert(q); assert.equal(q.sourceItemId, id); assert.equal(q.generator, key); assert.equal(q.answer, base.answer); assert.equal(q.solution, pure.solutionText);
  assert.deepEqual(clone(q.model), clone(pure.model)); assert.deepEqual(clone(q.studentGiven), clone(pure.studentGiven));
  assert.equal(q.studentGiven.solidFilled, true); assert(q.promptText.includes("\uBE48\uD2C8\uC5C6\uC774")); assert.equal(q.promptText, pure.promptText);
  assert.equal(q.conditionScope, "solid-cube-and-positive-volume-cut-only");
  const ordered = [...q.answer.matchAll(/\(\d+\)\s*(\d+)\uAC1C/g)].map(match => Number(match[1]));
  if (level === 2) assert.deepEqual(ordered, pure.answer);
  else { const scalar = /^(\d+)\uAC1C$/.exec(q.answer); assert(scalar); assert.equal(Number(scalar[1]), pure.answer); }
  assert.equal(q.structuralFingerprint, pure.structuralFingerprint); assert.equal(q.verifiedPoolIndex, variant);
  assert.equal(q.verifiedVariantCount, 3); assert.equal(q.verifiedVariantTarget, 3); assert.equal(q.verifiedVariantId, `${id}:v${variant}`);
  assert.equal(q.difficultyLevel, level); assert.equal(q.difficultyOffset, level - 1); assert.equal(q.answerPageLayout, "two-column");
  for (const field of ["sourceExact", "publisherAnswerVerified", "officialAnswerVerified", "humanApproved", "learnerReleaseVerified", "empiricallyCalibrated"]) assert.equal(q[field], false);
  assert.equal(q.originalSourceReleaseStatus, "locked"); assert.equal(q.registrationOnly, true); assert.equal(q.difficultyDesign.adoptionStatus, "pending");
  assert.deepEqual(clone(q.responseLayers), []); assert.equal(q.requiresLayerDrawing, false);
  const prompt = parseMarkup(q.prompt), teacher = parseMarkup(q.answerVisual);
  for (const [tree, role, phase] of [[prompt, "problem", "given"], [teacher, "teacher", level === 0 ? "cut-top" : "cut-all"]]) {
    const wrappers = elements(tree).filter(node => attr(node, "data-four-vertex-cut-context") !== undefined);
    assert.equal(wrappers.length, 1); assert.equal(attr(wrappers[0], "data-four-vertex-cut-context"), role);
    assert.equal(attr(wrappers[0], "data-source-item-id"), id); assert.equal(attr(wrappers[0], "data-variant"), String(variant)); assert.equal(attr(wrappers[0], "data-level"), String(level));
    const hosts = elements(tree).filter(node => attr(node, "class") === `source62-four-vertex-${role === "problem" ? "given" : "answer"}`); assert.equal(hosts.length, 1);
    const solids = elements(hosts[0]).filter(node => attr(node, "data-four-vertex-solid") !== undefined);
    assert.equal(solids.length, 1); assert.equal(attr(solids[0], "data-four-vertex-solid"), role === "problem" ? "given" : "answer");
    const images = elements(tree, "img"), buttons = elements(tree, "button"); assert.equal(images.length, 1); assert.equal(buttons.length, 1);
    assert.equal(attr(images[0], "src"), `./assets/source-6-2-four-vertex-cut/n${pool[variant]}-${phase}.png`);
    assert.equal(attr(buttons[0], "class"), "source62-four-vertex-cut-zoom"); assert.equal(attr(buttons[0], "data-four-vertex-cut-file"), `n${pool[variant]}-${phase}.png`);
  }
  assert.equal(textContent(prompt), pure.promptText, "No extra helpful text or answer text"); assert.equal(elements(prompt, "svg").length, 0);
  assert(!elements(prompt).some(node => ["table", "span", "canvas", "script"].includes(node.name)), "No invented tables, response/layer grids or formulas");
  const expected = pure.requestedLayers.map(layer => [layer, "cut"]);
  if (level === 2) expected.push(...pure.requestedLayers.map(layer => [layer, "touch"]));
  const grids = elements(teacher, "svg"); assert.deepEqual(grids.map(node => [Number(attr(node, "data-layer")), attr(node, "data-phase")]), expected);
  grids.forEach((grid, index) => {
    const [layer, mode] = expected[index], row = pure.model.layers[layer - 1], cells = elements(grid, "rect");
    const coordinates = cells.map(node => [Number(attr(node, "data-x")), Number(attr(node, "data-z"))]);
    assert.equal(new Set(coordinates.map(String)).size, pool[variant] ** 2); assert.deepEqual(coordinates.map(String).sort(), row.cells.map(String).sort());
    const selected = cells.filter(node => attr(node, "data-selected") === "true").map(node => [Number(attr(node, "data-x")), Number(attr(node, "data-z"))]);
    assert.deepEqual(selected.map(String).sort(), row[mode === "cut" ? "cutCells" : "touchCells"].map(String).sort());
  });
  return { variant, level, n: pool[variant], answer: q.answer, teacherGrids: grids.length };
}
function fakeDom() {
  const listeners = new Map(), created = [], decodes = [], document = { activeElement: null };
  class Element {
    constructor(tag) { this.tag = tag; this.listeners = new Map(); this.children = []; this.attributes = {}; this.open = false; this.isConnected = false; created.push(this); }
    setAttribute(name, value) { this.attributes[name] = value; }
    addEventListener(name, fn) { this.listeners.set(name, fn); }
    append(...children) { this.children.push(...children); children.forEach(child => { child.isConnected = true; }); }
    replaceChildren(...children) { this.children = children; children.forEach(child => { child.isConnected = true; }); }
    querySelector(selector) { return selector === "button" ? this.children.find(child => child.tag === "button") : null; }
    focus() { document.activeElement = this; }
    showModal() { this.open = true; }
    close() { this.open = false; this.listeners.get("close")?.(); }
    decode() { return new Promise((resolve, reject) => decodes.push({ image: this, resolve: () => { this.naturalWidth ??= this.width; this.naturalHeight ??= this.height; resolve(); }, reject })); }
  }
  document.createElement = tag => new Element(tag); document.body = { append(element) { element.isConnected = true; } };
  document.addEventListener = (name, fn) => { assert(!listeners.has(name), "Duplicate listener"); listeners.set(name, fn); };
  const button = (variant = 0, level = 1, role = "problem") => {
    const phase = role === "problem" ? "given" : level === 0 ? "cut-top" : "cut-all";
    const context = { dataset: { fourVertexCutContext: role, sourceItemId: id, variant: String(variant), level: String(level) } };
    const host = { owner: context, matches(selector) { return selector === `.source62-four-vertex-${role === "problem" ? "given" : "answer"}`; }, closest() { return this.owner; } };
    const solid = { owner: host, dataset: { fourVertexSolid: role === "problem" ? "given" : "answer" }, closest() { return this.owner; } };
    return { context, host, solid, dataset: { fourVertexCutFile: `n${pool[variant]}-${phase}.png` }, isConnected: true,
      closest(selector) { return selector === "[data-four-vertex-cut-context]" ? this.context : selector === "[data-four-vertex-solid]" ? this.solid : this.host; },
      querySelector() { return { alt: "four vertex source geometry" }; }, focus() { document.activeElement = this; } };
  };
  const click = button => listeners.get("click")({ target: { closest(selector) { assert.equal(selector, ".source62-four-vertex-cut-zoom"); return button; } }, preventDefault() {} });
  return { document, created, decodes, listeners, button, click };
}
async function zoomCases(report, label, assets) {
  const dom = fakeDom(), runtime = load(dom.document, { [`${prefix}ASSETS`]: assets });
  check(report, `${label}/listener-idempotent`, () => { vm.runInContext(code(scriptFile), runtime.context); assert.equal(dom.listeners.size, 1); });
  const invalidButtons = [
    ["unknown-file", b => { b.dataset.fourVertexCutFile = "unknown.png"; }], ["path-traversal", b => { b.dataset.fourVertexCutFile = "../n4-given.png"; }],
    ["cross-source-context", b => { b.context.dataset.sourceItemId = "6-2-u3-e4-example-1"; }], ["invalid-level", b => { b.context.dataset.level = "3"; }],
    ["fractional-level", b => { b.context.dataset.level = "1.5"; }], ["invalid-variant", b => { b.context.dataset.variant = "3"; }],
    ["mismatched-size", b => { b.dataset.fourVertexCutFile = "n3-given.png"; }], ["student-with-answer-image", b => { b.dataset.fourVertexCutFile = "n4-cut-all.png"; }],
    ["unknown-phase", b => { b.dataset.phase = "filled"; }], ["cross-source-button", b => { b.dataset.sourceItemId = "other"; }],
    ["missing-context", b => { b.context = null; }], ["wrong-role", b => { b.context.dataset.fourVertexCutContext = "teacher"; }],
    ["bad-host-owner", b => { b.host.owner = {}; }], ["bad-solid-owner", b => { b.solid.owner = {}; }],
    ["wrong-solid-phase", b => { b.solid.dataset.fourVertexSolid = "answer"; }], ["missing-solid", b => { b.solid = null; }],
    ["ambiguous-host", b => { b.host.matches = () => true; }], ["foreign-host", b => { b.host.matches = () => false; }],
    ["variant-attribute-mismatch", b => { b.dataset.variant = "1"; }], ["level-attribute-mismatch", b => { b.dataset.level = "2"; }]
  ];
  for (const [name, mutate] of invalidButtons) await asyncCheck(report, `negative/${label}/${name}`, async () => {
    const button = dom.button(); mutate(button); await dom.click(button); assert.equal(dom.created.length, 0); assert.equal(dom.decodes.length, 0);
  });
  for (let variant = 0; variant < 3; variant++) for (let level = 0; level < 3; level++) for (const role of ["problem", "teacher"]) await asyncCheck(report, `${label}/valid/v${variant}/l${level}/${role}`, async () => {
    const button = dom.button(variant, level, role), pending = dom.click(button), decode = dom.decodes.at(-1), dialog = dom.created.find(node => node.tag === "dialog");
    assert(!dialog.open); decode.resolve(); await pending; assert(dialog.open); assert.equal(dialog.attributes["aria-busy"], "false");
    assert.equal(dialog.className, "source62-four-vertex-cut-figure-dialog"); assert(dialog.attributes["aria-label"]);
    assert(dialog.children[1].children[0].src.endsWith(button.dataset.fourVertexCutFile));
    let prevented = false; dialog.listeners.get("cancel")({ preventDefault() { prevented = true; } }); assert.equal(prevented, false);
    dialog.close(); assert.equal(dom.document.activeElement, button);
  });
  const dialog = dom.created.find(node => node.tag === "dialog");
  await asyncCheck(report, `negative/${label}/difficulty-phase`, async () => {
    const button = dom.button(0, 0, "teacher"), before = dom.decodes.length; button.dataset.fourVertexCutFile = "n4-cut-all.png";
    await dom.click(button); assert.equal(dom.decodes.length, before); assert(!dialog.open);
  });
  await asyncCheck(report, `${label}/latest-request-wins`, async () => {
    const first = dom.click(dom.button(0)), old = dom.decodes.at(-1), second = dom.click(dom.button(1)), current = dom.decodes.at(-1);
    old.resolve(); await first; assert(!dialog.open); current.resolve(); await second; assert(dialog.open);
    assert(dialog.children[1].children[0].src.endsWith("n3-given.png")); dialog.close();
  });
  for (const [name, mutate] of [
    ["close-during-decode", () => dialog.listeners.get("close")()], ["context-changed-during-decode", b => { b.context.dataset.level = "9"; }],
    ["owner-changed-during-decode", b => { b.host.owner = {}; }], ["wrong-natural-dimensions", (_, decode) => { decode.image.naturalWidth = 1500; }],
    ["detached-button", b => { b.isConnected = false; }], ["invalid-request-cancels-pending", () => { const bad = dom.button(); bad.context.dataset.sourceItemId = "other"; return dom.click(bad); }]
  ]) await asyncCheck(report, `negative/${label}/${name}`, async () => {
    const button = dom.button(), pending = dom.click(button), decode = dom.decodes.at(-1); await mutate(button, decode); decode.resolve(); await pending; assert(!dialog.open);
  });
  await asyncCheck(report, `negative/${label}/decode-failure`, async () => {
    const pending = dom.click(dom.button()); dom.decodes.at(-1).reject(new Error("Synthetic decode failure")); await pending;
    assert(!dialog.open); assert.equal(dialog.attributes["aria-busy"], "false");
  });
  check(report, `${label}/one-reused-dialog`, () => assert.equal(dom.created.filter(node => node.tag === "dialog").length, 1));
}
async function run() {
  const folder = outputFolder();
  const report = { schema: "four-vertex-wrapper-audit/v1", createdAt: new Date().toISOString(), runtime: { node: process.version, platform: process.platform, arch: process.arch },
    checks: [], cases: [], inputs: fingerprints(), reportFile: path.join(folder, "wrapper-audit.json"),
    scope: "Synthetic static presentation/metadata and controlled DOM using stable actual contracts; optional exported parent API smoke",
    sourceItemIdsInCandidateWrapper: [id], originalSourceReleaseStatus: "locked", sourceExact: false, publisherAnswerVerified: false,
    humanApproved: false, learnerReleaseVerified: false, empiricallyCalibrated: false, sourceAdoption: "pending", difficultyAdoption: "pending",
    sourceMathRechecked: false, rasterRechecked: false, browserVerified: false, nativeEscapeBrowserVerified: false, a4Verified: false,
    rendererVerified: false, unlocked: false, catalogEdited: false, indexEdited: false, liveRegistrationPerformed: false, gitActions: false, serverStarted: false,
    skills: ["evidence-gated-learning-pipeline", "audit-verify-explain-grade-5"],
    skillScope: "Stable contract/approval preservation, learner answer boundary, scoped print rules and bounded failure checks only", commonWorkflowVersion: "2026-10-14.r6" };
  const runtime = load(), { api, window } = runtime, type = { sourceItemId: id, generatorKey: key, reviewLocked: false };
  check(report, "document-undefined-safely-skips-listener", () => assert(!window[`${prefix}ZOOM_BOUND`]));
  check(report, "strict-single-source-frozen-capability", () => {
    assert.deepEqual(clone(window[`${prefix}QUESTIONS`].keys), { [id]: key }); assert.deepEqual(clone(window[`${prefix}QUESTIONS`].pool), pool);
    assert(Object.isFrozen(window[`${prefix}QUESTIONS`].keys)); assert(Object.isFrozen(window[`${prefix}QUESTIONS`].pool));
    assert.deepEqual(api.names, ["legacy", key]); assert.equal(api.generatorKey(type), key);
  });
  for (let variant = 0; variant < 3; variant++) for (let level = 0; level < 3; level++) check(report, `synthetic-contract/v${variant}/l${level}`, () => {
    const q = api.generate(type, 4, level - 1, 123, variant); assert.equal(q.levelRank, 4);
    const detail = validateQuestion(q, window[`${prefix}PRESENTATION`], variant, level); report.cases.push(detail); return detail;
  });
  check(report, "locked-candidate-and-input-unchanged", () => {
    const locked = { ...type, reviewLocked: true }, before = clone(locked); assert.equal(api.generatorKey(locked), ""); assert.equal(api.generate(locked), null); assert.deepEqual(locked, before);
  });
  for (const candidate of [{ sourceItemId: id, generatorKey: "other" }, { sourceItemId: "other", generatorKey: key },
    { sourceItemId: id }, { generatorKey: key }, Object.assign([], type), Object.create(type)]) check(report, `negative/mismatched-source-key/${String(candidate.sourceItemId)}/${String(candidate.generatorKey)}`, () => {
    assert.equal(api.generatorKey(candidate), ""); assert.equal(api.generate(candidate), null);
  });
  check(report, "unrelated-delegation-receiver-arguments-and-lock", () => {
    const receiver = {}, args = [{ sourceItemId: "6-2-u3-e4-example-1", generatorKey: "sourceGrade6SecondSpaceE4MidpointCut" }, 7, 9, 4, 12, "extra"];
    assert.equal(api.generatorKey.call(receiver, ...args), "legacy-key"); assert.equal(api.generate.call(receiver, ...args), api.sentinel);
    api.calls.slice(-2).forEach(call => { assert.equal(call.receiver, receiver); assert.deepEqual(call.args, args); });
    for (const candidate of [null, {}, "unknown"]) { assert.equal(api.generatorKey(candidate), "legacy-key"); assert.equal(api.generate(candidate), api.sentinel); }
    const locked = { ...args[0], reviewLocked: true }; assert.equal(api.generatorKey(locked), ""); assert.equal(api.generate(locked), null);
  });
  for (const value of [-1, 1.5, "0", NaN, Infinity, null, Number.MAX_SAFE_INTEGER + 1]) check(report, `negative/invalid-variant/${String(value)}`, () => assert.throws(() => api.generate(type, 1, 0, 1, value), /Unsupported four-vertex-cut/));
  for (const value of [-2, 2, 0.5, "0", NaN, Infinity, null]) check(report, `negative/invalid-offset/${String(value)}`, () => assert.throws(() => api.generate(type, 1, value, 1, 0), /Unsupported four-vertex-cut/));
  for (const value of [NaN, Infinity, -Infinity, null, "1"]) check(report, `negative/nonfinite-rank/${String(value)}`, () => assert.throws(() => api.generate(type, value, 0, 1, 0), /Unsupported four-vertex-cut/));
  check(report, "finite-pool-modulo-defaults-fingerprints", () => {
    assert.equal(api.generate(type, 2).verifiedPoolIndex, 0); assert.equal(api.generate(type).difficultyOffset, 0);
    for (const variant of [3, 4, 5, 99, Number.MAX_SAFE_INTEGER]) {
      const q = api.generate(type, 2, 0, 1, variant); assert.equal(q.verifiedPoolIndex, variant % 3);
      assert.equal(q.structuralFingerprint, api.generate(type, 2, 0, 1, variant % 3).structuralFingerprint);
    }
    assert.equal(new Set(pool.map((_, variant) => api.generate(type, 2, 0, 1, variant).structuralFingerprint)).size, 3);
  });
  const base = window[`${prefix}PRESENTATION`].renderBank(id, 0, 1);
  const guards = [["sourceItemId", "other"], ["variant", 1], ["level", 2], ["requestedAnswerUnique", false], ["sourceConditionsClarified", false],
    ["requiresOriginalReview", false], ["sourceExact", true], ["originalSourceReleaseStatus", "approved"], ["publisherAnswerVerified", true],
    ["officialAnswerVerified", true], ["humanApproved", true], ["learnerReleaseVerified", true], ["empiricallyCalibrated", true],
    ["requiresLayerDrawing", true], ["responseLayers", [4]], ["structuralFingerprint", ""], ["conditionScope", "positive-volume-cut-only"], ["prompt", undefined], ["answerVisual", ""]];
  for (const [field, value] of guards) check(report, `negative/guard/${field}`, () => {
    const q = clone(base); q[field] = value; const guarded = load(undefined, { [`${prefix}PRESENTATION`]: { renderBank: () => q } });
    assert.equal(guarded.api.generate(type, 2, 0, 1, 0), null);
  });
  for (const [name, mutate] of [["solid-not-filled", q => { q.studentGiven.solidFilled = false; }], ["student-response-invented", q => { q.studentGiven.responseLayers = [4]; }],
    ["wrong-model-dimensions", q => { q.model.dimensions = [3, 3, 3]; }], ["wrong-student-dimensions", q => { q.studentGiven.dimensions = [5, 5, 5]; }]]) check(report, `negative/guard/${name}`, () => {
    const q = clone(base); mutate(q); const guarded = load(undefined, { [`${prefix}PRESENTATION`]: { renderBank: () => q } }); assert.equal(guarded.api.generate(type, 2, 0, 1, 0), null);
  });
  for (const missing of ["HSE_GENERATORS", ...["MODELS", "CONTRACTS", "ASSETS", "PRESENTATION"].map(suffix => `${prefix}${suffix}`)]) check(report, `negative/missing-dependency/${missing}`, () => {
    const dependencies = { ...window, HSE_GENERATORS: stubApi() }; delete dependencies[missing]; assert.throws(() => vm.runInNewContext(code(scriptFile), { window: dependencies }), /must load first/);
  });
  check(report, "negative/unverified-model-pool", () => assert.throws(() => load(undefined, { [`${prefix}MODELS`]: { pool: [4, 3, 6] } }), /must load first/));
  check(report, "duplicate-load-preserves-names-and-delegation", () => { vm.runInContext(code(scriptFile), runtime.context); assert.deepEqual(api.names, ["legacy", key]); });
  const assets = syntheticAssets(); await zoomCases(report, "synthetic-zoom", assets);
  for (const [field, value] of [["file", "n3-given.png"], ["kind", "cut-all"], ["dimensions", [3, 3, 3]], ["width", 0], ["height", Infinity], ["glyphSize", 8], ["sha256", "unknown"]]) await asyncCheck(report, `negative/zoom-metadata/${field}`, async () => {
    const dom = fakeDom(); load(dom.document, { [`${prefix}ASSETS`]: { image: () => ({ ...assets.image("n4-given.png"), [field]: value }) } });
    await dom.click(dom.button()); assert.equal(dom.decodes.length, 0); assert.equal(dom.created.length, 0);
  });
  await asyncCheck(report, "negative/zoom/asset-revision-changes-during-decode", async () => {
    const dom = fakeDom(); let metadata = assets.image("n4-given.png"); load(dom.document, { [`${prefix}ASSETS`]: { image: () => metadata } });
    const pending = dom.click(dom.button()), decode = dom.decodes.at(-1); metadata = { ...metadata, sha256: "b".repeat(64) }; decode.resolve(); await pending;
    assert(!dom.created.find(node => node.tag === "dialog").open);
  });
  const generated = api.generate(type, 4, 0, 1, 0);
  for (const [name, mutate] of [["wrong-scalar-answer", q => { q.answer = "999\uAC1C"; }], ["student-extra-table", q => { q.prompt += "<table/>"; }],
    ["student-answer-text", q => { q.prompt += "<p>24\uAC1C</p>"; }], ["teacher-same-count-wrong-cell", q => { q.answerVisual = q.answerVisual.replace('data-x="0" data-z="2" data-selected="true"', 'data-x="0" data-z="3" data-selected="true"'); }]]) check(report, `negative/markup/${name}`, () => {
    const bad = clone(generated); mutate(bad); assert.throws(() => validateQuestion(bad, window[`${prefix}PRESENTATION`], 0, 1));
  });
  check(report, "CSS-current-parent-pattern-scoped-72mm-two-column-A4", () => {
    const css = code(cssFile); assert(css.includes(".source62-four-vertex-cut-figure-dialog{display:none!important}"));
    assert(!css.includes(".source62-midpoint") && !css.includes(".source62-m3") && !css.includes(".source62-cut-zoom"));
    assert(css.includes("@page source62FourVertexAnswerKey{size:A4;margin:12mm 8mm}")); assert(css.includes("{page:source62FourVertexAnswerKey;padding:0}"));
    assert(css.includes("width:72mm") && css.includes("letter-spacing:0") && css.includes(".answer-key-grid{break-after:avoid}"));
    assert(css.includes(".answer-key-visuals>figure{flex:0 0 calc((100% - 6mm)/2);min-width:0;break-inside:avoid}"));
    assert(css.includes("position:relative;z-index:2;background:#fff")); assert.equal((css.match(/\{/g) || []).length, (css.match(/\}/g) || []).length);
    const points = 72 / 1600 * 72 * 72 / 25.4; assert(points >= 9); return { nominalPrintedLabelPoints: points, actualPrintVerified: false };
  });
  check(report, "negative/output-env-missing", () => assert.throws(() => outputFolder({}), /Set HSE_SCREENSHOT_DIR/));
  check(report, "negative/output-outside-E", () => assert.throws(() => outputFolder({ HSE_SCREENSHOT_DIR: "C:\\four-vertex-wrapper" }), /absolute E:/));
  check(report, "negative/output-in-repository", () => assert.throws(() => outputFolder({ HSE_SCREENSHOT_DIR: __dirname }), /outside the repository/));
  check(report, "negative/output-unbounded-folder", () => assert.throws(() => outputFolder({ HSE_SCREENSHOT_DIR: path.dirname(folder) }), /bounded/));
  check(report, "output-env-direct-and-root", () => { assert.equal(outputFolder({ HSE_SCREENSHOT_DIR: folder }), folder); assert.equal(outputFolder({ HSE_FOUR_VERTEX_SOURCE_EVIDENCE_DIR: path.dirname(folder) }), folder); });
  const assetsFile = path.join(__dirname, "source-6-2-four-vertex-cut-assets.js"), presentationFile = path.join(__dirname, "source-6-2-four-vertex-cut-presentation.js");
  report.parentApi = { status: "pending", reason: "Parent static exports/renderBank not ready; synthetic checks do not verify actual images" };
  if (fs.existsSync(assetsFile) && fs.existsSync(presentationFile)) {
    let exportedAssets, parent;
    check(report, "exported-parent-API-load", () => {
      exportedAssets = require(assetsFile); parent = require(presentationFile); assert.equal(typeof parent.renderBank, "function"); assert.equal(typeof exportedAssets.image, "function");
      report.parentApi = { status: "API-smoke-only", rasterRechecked: false, assetsSha256: sha(assetsFile), presentationSha256: sha(presentationFile) };
    });
    if (exportedAssets && parent) {
      const actual = load(undefined, { [`${prefix}ASSETS`]: exportedAssets, [`${prefix}PRESENTATION`]: parent });
      for (let variant = 0; variant < 3; variant++) for (let level = 0; level < 3; level++) check(report, `parent-API/v${variant}/l${level}`, () => validateQuestion(actual.api.generate(type, 4, level - 1, 1, variant), parent, variant, level));
      for (const n of pool) for (const kind of ["given", "cut-top", "cut-all"]) check(report, `exported-metadata/n${n}/${kind}`, () => {
        const file = `n${n}-${kind}.png`, asset = exportedAssets.image(file); assert.equal(asset.file, file); assert.equal(asset.kind, kind);
        assert.deepEqual(clone(asset.dimensions), [n, n, n]); assert.equal(asset.glyphSize, 72); assert.match(asset.sha256, /^[a-f0-9]{64}$/i);
        assert(asset.width > 0 && asset.height > 0); const labelPoints = asset.glyphSize / asset.width * 72 * 72 / 25.4; assert(labelPoints >= 9);
        return { file, nominalPrintedLabelPoints: labelPoints, rasterRechecked: false };
      });
      await zoomCases(report, "exported-metadata-zoom", exportedAssets);
      check(report, "exported-parent-inputs-unchanged", () => { assert.equal(sha(assetsFile), report.parentApi.assetsSha256); assert.equal(sha(presentationFile), report.parentApi.presentationSha256); });
    }
  }
  check(report, "owned-and-stable-contract-inputs-unchanged", () => assert.deepEqual(fingerprints(), report.inputs));
  report.failedChecks = report.checks.filter(row => row.status === "fail"); report.checkCount = report.checks.length; report.passedChecks = report.checkCount - report.failedChecks.length;
  report.status = report.failedChecks.length ? "failed" : "passed-synthetic-wrapper"; report.syntheticContractCases = report.cases.length;
  report.syntheticZoomCases = report.checks.filter(row => row.name.startsWith("synthetic-zoom/valid/") && row.status === "pass").length;
  report.parentApiCases = report.checks.filter(row => row.name.startsWith("parent-API/") && row.status === "pass").length;
  report.negativeControls = report.checks.filter(row => row.name.startsWith("negative/"));
  report.approvalBoundary = "No actual raster/source/PC/mobile/PDF verification, live catalog unlock, main adoption or public approval is claimed";
  fs.mkdirSync(folder, { recursive: true }); fs.writeFileSync(report.reportFile, JSON.stringify(report, null, 2) + "\n"); return report;
}
module.exports = { run, validateQuestion, parseMarkup };
if (require.main === module) run().then(report => {
  console.log(JSON.stringify({ status: report.status, runtime: report.runtime, checks: report.checkCount, failures: report.failedChecks,
    syntheticContracts: report.syntheticContractCases, syntheticZoom: report.syntheticZoomCases, parentApiCases: report.parentApiCases,
    negativeControls: report.negativeControls.length, parentApi: report.parentApi, report: report.reportFile }));
  if (report.failedChecks.length) process.exitCode = 1;
}).catch(error => { console.error(error.stack); process.exitCode = 1; });
