"use strict";
const assert = require("node:assert/strict"), fs = require("node:fs"), path = require("node:path"), vm = require("node:vm"), crypto = require("node:crypto");
const contracts = require("./source-6-2-midpoint-cut-contracts.js");
const id = "6-2-u3-e4-example-1", key = "sourceGrade6SecondSpaceE4MidpointCut", pool = [3, 2, 4];
const scriptFile = "source-6-2-midpoint-cut-questions.js", cssFile = "source-6-2-midpoint-cut-questions.css";
const code = file => fs.readFileSync(path.join(__dirname, file), "utf8"), clone = value => JSON.parse(JSON.stringify(value));
const sha = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const modelFiles = ["source-6-2-plane-cut-models.js", "source-6-2-midpoint-cut-models.js", "source-6-2-midpoint-cut-contracts.js"];
function outputFolder(env = process.env) {
  const directory = env.HSE_SCREENSHOT_DIR || (env.HSE_MIDPOINT_SOURCE_EVIDENCE_DIR && path.join(env.HSE_MIDPOINT_SOURCE_EVIDENCE_DIR, "midpoint-wrapper"));
  assert(directory, "Set HSE_SCREENSHOT_DIR (output directory) or HSE_MIDPOINT_SOURCE_EVIDENCE_DIR (evidence root)");
  assert(path.isAbsolute(directory) && path.parse(directory).root.toLowerCase() === "e:\\", "Audit output must be an explicit absolute E: directory");
  const folder = path.resolve(directory), repository = path.resolve(__dirname, "../..");
  const relative = path.relative(repository, folder);
  assert(relative && (relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)), "Audit output must be outside the repository");
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
    records.set(file, Object.freeze({ file, width: 1600, height: 1200, sha256: "a".repeat(64), dimensions: Object.freeze([n, n, n]), kind, glyphSize: 72 }));
  }
  return Object.freeze({ image(file) { if (!records.has(file)) throw new RangeError("Unverified synthetic asset"); return records.get(file); } });
}
function syntheticPresentation() {
  function image(q, kind) {
    return `<button type="button" class="source62-midpoint-cut-zoom" data-midpoint-cut-file="n${q.model.n}-${kind}.png"><img src="./assets/source-6-2-midpoint-cut/n${q.model.n}-${kind}.png" width="1600" height="1200" alt="midpoint source geometry" data-glyph-size="72"/></button>`;
  }
  function grids(q, mode) {
    return q.requestedLayers.map(layer => {
      const row = q.model.layers[layer - 1], selected = new Set(row[mode === "cut" ? "cutCells" : "touchCells"].map(c => c.join(",")));
      const rects = row.cells.map(([x, z]) => `<rect data-x="${x}" data-z="${z}" data-selected="${selected.has(`${x},${z}`)}" fill="${selected.has(`${x},${z}`) ? "#cedfcf" : "#fff"}"/>`).join("");
      return `<svg data-layer="${layer}" data-phase="${mode}">${rects}</svg>`;
    }).join("");
  }
  return Object.freeze({ renderBank(source, variant, level) {
    const q = contracts.generate(source, variant, level);
    return Object.freeze({ ...q,
      prompt: `<div class="source62-midpoint-given"><p>${q.promptText}</p><div data-midpoint-solid="given">${image(q, "given")}</div></div>`,
      answer: Array.isArray(q.answer) ? q.answer.map((n, i) => `(${i + 1}) ${n}\uAC1C`).join("; ") : `${q.answer}\uAC1C`,
      answerVisual: `<div class="source62-midpoint-answer"><div data-midpoint-solid="answer">${image(q, level === 0 ? "cut-top" : "cut-all")}</div><div class="source62-cut-layers">${grids(q, "cut")}</div>${level === 2 ? `<div class="source62-cut-layers">${grids(q, "touch")}</div>` : ""}</div>`,
      solution: q.solutionText, answerKeyVisual: true });
  } });
}
function load(document, overrides = {}) {
  const api = stubApi(), window = { HSE_GENERATORS: api }, context = vm.createContext({ window, ...(document ? { document } : {}) });
  modelFiles.forEach(file => vm.runInContext(code(file), context, { filename: file }));
  window.HSE_SOURCE_GRADE6_MIDPOINT_CUT_ASSETS = syntheticAssets();
  window.HSE_SOURCE_GRADE6_MIDPOINT_CUT_PRESENTATION = syntheticPresentation();
  Object.assign(window, overrides); vm.runInContext(code(scriptFile), context, { filename: scriptFile });
  return { api, window, context };
}
let xml;
function parseMarkup(markup) {
  if (!xml) {
    try { xml = require("xml-js"); } catch (error) {
      if (error.code !== "MODULE_NOT_FOUND") throw error;
      xml = require(process.env.HSE_XML_PARSER_PATH || path.join(process.env.USERPROFILE || "", ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/xml-js"));
    }
  }
  const wellFormed = markup.replace(/<img\b([^>]*?)\s*\/?\s*>/g, (_, attributes) => `<img${attributes.replace(/\/$/, "")}/>`);
  return xml.xml2js(`<audit-root>${wellFormed}</audit-root>`, { compact: false }).elements[0];
}
function elements(node, name) { return (node.elements || []).flatMap(c => [...(c.type === "element" && (!name || c.name === name) ? [c] : []), ...elements(c, name)]); }
const attr = (node, name) => node.attributes && node.attributes[name];
const textContent = node => (node.elements || []).map(c => c.type === "text" ? c.text : textContent(c)).join("");
function validateQuestion(p, presentation, variant, level) {
  const pure = contracts.generate(id, variant, level), base = presentation.renderBank(id, variant, level);
  assert.equal(p.sourceItemId, id); assert.equal(p.generator, key); assert.equal(p.answer, base.answer);
  assert.equal(p.solution, base.solution); assert.deepEqual(clone(p.model), clone(pure.model));
  assert.deepEqual(clone(p.studentGiven), clone(pure.studentGiven)); assert.equal(p.promptText, pure.promptText);
  assert.equal(p.structuralFingerprint, pure.structuralFingerprint); assert.equal(p.verifiedPoolIndex, variant);
  assert.equal(p.verifiedVariantCount, 3); assert.equal(p.verifiedVariantTarget, 3); assert.equal(p.verifiedVariantId, `${id}:v${variant}`);
  assert.equal(p.difficultyLevel, level); assert.equal(p.difficultyOffset, level - 1); assert.equal(p.answerPageLayout, "two-column");
  for (const field of ["sourceExact", "publisherAnswerVerified", "humanApproved", "learnerReleaseVerified", "empiricallyCalibrated", "officialAnswerVerified"]) assert.equal(p[field], false);
  assert.equal(p.originalSourceReleaseStatus, "locked"); assert.equal(p.registrationOnly, true);
  assert.deepEqual(clone(p.responseLayers), []); assert.equal(p.requiresLayerDrawing, false);
  const prompt = parseMarkup(p.prompt), teacher = parseMarkup(p.answerVisual);
  for (const [tree, role, phase] of [[prompt, "problem", "given"], [teacher, "teacher", level === 0 ? "cut-top" : "cut-all"]]) {
    const wrappers = elements(tree).filter(n => attr(n, "data-midpoint-cut-context") !== undefined);
    assert.equal(wrappers.length, 1); assert.equal(attr(wrappers[0], "data-midpoint-cut-context"), role);
    assert.equal(attr(wrappers[0], "data-source-item-id"), id); assert.equal(attr(wrappers[0], "data-variant"), String(variant)); assert.equal(attr(wrappers[0], "data-level"), String(level));
    const images = elements(tree, "img"); assert.equal(images.length, 1);
    assert.equal(attr(images[0], "src"), `./assets/source-6-2-midpoint-cut/n${pool[variant]}-${phase}.png`);
    const buttons = elements(tree, "button"); assert.equal(buttons.length, 1);
    assert.equal(attr(buttons[0], "class"), "source62-midpoint-cut-zoom");
    assert.equal(attr(buttons[0], "data-midpoint-cut-file"), `n${pool[variant]}-${phase}.png`);
  }
  assert.equal(textContent(prompt), pure.promptText, "student: context metadata adds no helpful text");
  assert.equal(elements(prompt, "svg").length, 0, "student: no response/layer grids");
  assert(!elements(prompt).some(n => ["table", "span", "canvas", "script"].includes(n.name)), "student: no invented tables/formulas");
  assert(!/\d\s*[+=]\s*\d|\uCE35\uBCC4 \uAC1C\uC218|\uC815\uB2F5\uC740/.test(textContent(prompt)), "student: no answer count leak");
  const expected = pure.requestedLayers.map(layer => [layer, "cut"]);
  if (level === 2) expected.push(...pure.requestedLayers.map(layer => [layer, "touch"]));
  const grids = elements(teacher, "svg");
  assert.deepEqual(grids.map(n => [Number(attr(n, "data-layer")), attr(n, "data-phase")]), expected);
  grids.forEach((svg, i) => {
    const [layer, mode] = expected[i], cells = pure.model.layers[layer - 1][mode === "cut" ? "cutCells" : "touchCells"];
    const selected = elements(svg, "rect").filter(n => attr(n, "data-selected") === "true").map(n => [Number(attr(n, "data-x")), Number(attr(n, "data-z"))]);
    assert.deepEqual(selected.map(String).sort(), cells.map(String).sort(), "teacher: preserved contract selections");
  });
  return { variant, level, n: pool[variant], answer: p.answer, teacherGrids: grids.length };
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
  document.createElement = tag => new Element(tag);
  document.body = { append(element) { element.isConnected = true; } };
  document.addEventListener = (name, fn) => { assert(!listeners.has(name), "duplicate zoom listener"); listeners.set(name, fn); };
  const button = (variant = 0, level = 1, role = "problem") => {
    const phase = role === "problem" ? "given" : level === 0 ? "cut-top" : "cut-all";
    const context = { dataset: { midpointCutContext: role, sourceItemId: id, variant: String(variant), level: String(level) } };
    const host = { matches(selector) { return selector === (role === "problem" ? ".source62-midpoint-given" : ".source62-midpoint-answer"); } };
    return { context, host, dataset: { midpointCutFile: `n${pool[variant]}-${phase}.png` }, isConnected: true,
      closest(selector) { if (selector === "[data-midpoint-cut-context]") return this.context; if (selector === ".source62-midpoint-given,.source62-midpoint-answer") return this.host; return null; },
      querySelector() { return { alt: "source midpoint geometry" }; }, focus() { document.activeElement = this; } };
  };
  const click = b => listeners.get("click")({ target: { closest(selector) { assert.equal(selector, ".source62-midpoint-cut-zoom"); return b; } }, preventDefault() {} });
  return { document, listeners, created, decodes, button, click };
}
function fingerprints() {
  return [scriptFile, cssFile, "source-6-2-midpoint-cut-questions-audit.js", ...modelFiles]
    .map(file => ({ file: path.join(__dirname, file), sha256: sha(path.join(__dirname, file)) }));
}
async function run() {
  const folder = outputFolder();
  const report = { schema: "midpoint-wrapper-audit/v1", createdAt: new Date().toISOString(), checks: [], cases: [],
    scope: "synthetic-fixtures-and-exported-parent-API-with-stable-real-contracts-and-controlled-DOM", inputs: fingerprints(),
    reportFile: path.join(folder, "wrapper-audit.json"),
    sourceItemIdsInCandidateWrapper: [id], indexEdited: false, catalogEdited: false, liveRegistrationPerformed: false,
    originalSourceReleaseStatus: "locked", sourceExact: false, publisherAnswerVerified: false, humanApproved: false, learnerReleaseVerified: false,
    sourceMathRechecked: false, rasterRechecked: false, browserVerified: false, nativeEscapeBrowserVerified: false, a4Verified: false,
    rendererVerified: false, unlocked: false, gitActions: false, serverStarted: false,
    skills: ["evidence-gated-learning-pipeline", "audit-verify-explain-grade-5"],
    skillScope: "Contract/approval preservation, learner answer boundary and bounded failure verification only", commonWorkflowVersion: "2026-10-14.r6" };
  let runtime;
  check(report, "synthetic-candidate-load-document-undefined", () => { runtime = load(); assert(!runtime.window.HSE_SOURCE_GRADE6_MIDPOINT_CUT_ZOOM_BOUND); });
  if (runtime) {
    const { api, window } = runtime, type = { sourceItemId: id, generatorKey: key, reviewLocked: false };
    check(report, "strict-single-source-capability-only", () => {
      assert.deepEqual(clone(window.HSE_SOURCE_GRADE6_MIDPOINT_CUT_QUESTIONS.keys), { [id]: key });
      assert.deepEqual(clone(window.HSE_SOURCE_GRADE6_MIDPOINT_CUT_QUESTIONS.pool), pool);
      assert(Object.isFrozen(window.HSE_SOURCE_GRADE6_MIDPOINT_CUT_QUESTIONS.keys)); assert(Object.isFrozen(window.HSE_SOURCE_GRADE6_MIDPOINT_CUT_QUESTIONS.pool));
      assert.deepEqual(api.names, ["legacy", key]); assert.equal(api.generatorKey(type), key);
    });
    for (let variant = 0; variant < 3; variant++) for (let level = 0; level < 3; level++) check(report, `synthetic-contract/v${variant}/l${level}`, () => {
      const p = api.generate(type, 4, level - 1, 123, variant); assert(p); assert.equal(p.levelRank, 4);
      const detail = validateQuestion(p, window.HSE_SOURCE_GRADE6_MIDPOINT_CUT_PRESENTATION, variant, level); report.cases.push(detail); return detail;
    });
    check(report, "locked-source-preserved", () => { const t = { ...type, reviewLocked: true }, before = clone(t); assert.equal(api.generatorKey(t), ""); assert.equal(api.generate(t), null); assert.deepEqual(t, before); });
    for (const t of [{ sourceItemId: id, generatorKey: "other" }, { sourceItemId: "other", generatorKey: key },
      { sourceItemId: id }, { generatorKey: key }, Object.assign([], type), Object.create(type)]) {
      check(report, `negative/mismatched-source-key/${String(t.sourceItemId)}/${String(t.generatorKey)}`, () => { assert.equal(api.generatorKey(t), ""); assert.equal(api.generate(t), null); });
    }
    check(report, "unrelated-delegation-this-and-arguments", () => {
      const receiver = {}, args = [{ sourceItemId: "6-2-u3-e4-exploration", generatorKey: "other" }, 7, 9, 4, 12, "extra"];
      assert.equal(api.generatorKey.call(receiver, ...args), "legacy-key"); assert.equal(api.generate.call(receiver, ...args), api.sentinel);
      api.calls.slice(-2).forEach(call => { assert.equal(call.receiver, receiver); assert.deepEqual(call.args, args); });
      for (const t of [null, {}, "unknown"]) { assert.equal(api.generatorKey(t), "legacy-key"); assert.equal(api.generate(t), api.sentinel); }
    });
    for (const value of [-1, 1.5, "0", NaN, Infinity, null, Number.MAX_SAFE_INTEGER + 1]) check(report, `negative/invalid-variant/${String(value)}`, () => assert.throws(() => api.generate(type, 1, 0, 1, value), /Unsupported midpoint-cut/));
    for (const value of [-2, 2, 0.5, "0", NaN, Infinity, null]) check(report, `negative/invalid-offset/${String(value)}`, () => assert.throws(() => api.generate(type, 1, value, 1, 0), /Unsupported midpoint-cut/));
    for (const value of [NaN, Infinity, -Infinity, null, "1"]) check(report, `negative/nonfinite-rank/${String(value)}`, () => assert.throws(() => api.generate(type, value, 0, 1, 0), /Unsupported midpoint-cut/));
    check(report, "finite-pool-modulo-defaults-fingerprints", () => {
      assert.equal(api.generate(type, 2).verifiedPoolIndex, 0); assert.equal(api.generate(type, 2).difficultyOffset, 0);
      for (const variant of [3, 4, 5, 99, Number.MAX_SAFE_INTEGER]) {
        const p = api.generate(type, 2, 0, 1, variant); assert.equal(p.verifiedPoolIndex, variant % 3);
        assert.equal(p.structuralFingerprint, api.generate(type, 2, 0, 1, variant % 3).structuralFingerprint);
      }
      assert.equal(new Set(pool.map((_, i) => api.generate(type, 2, 0, 1, i).structuralFingerprint)).size, 3);
    });
    const base = window.HSE_SOURCE_GRADE6_MIDPOINT_CUT_PRESENTATION.renderBank(id, 0, 1);
    for (const [field, value] of [["sourceItemId", "6-2-u3-e4-exploration"], ["variant", 1], ["level", 2], ["requestedAnswerUnique", false],
      ["sourceConditionsClarified", false], ["requiresOriginalReview", false], ["sourceExact", true], ["originalSourceReleaseStatus", "approved"],
      ["publisherAnswerVerified", true], ["humanApproved", true], ["learnerReleaseVerified", true], ["empiricallyCalibrated", true],
      ["requiresLayerDrawing", true], ["responseLayers", [3]], ["structuralFingerprint", ""]]) check(report, `negative/guard/${field}`, () => {
      const q = clone(base); q[field] = value;
      const guarded = load(undefined, { HSE_SOURCE_GRADE6_MIDPOINT_CUT_PRESENTATION: { renderBank: () => q } });
      assert.equal(guarded.api.generate(type, 2, 0, 1, 0), null);
    });
    for (const missing of ["HSE_GENERATORS", "HSE_SOURCE_GRADE6_MIDPOINT_CUT_MODELS", "HSE_SOURCE_GRADE6_MIDPOINT_CUT_ASSETS", "HSE_SOURCE_GRADE6_MIDPOINT_CUT_PRESENTATION"]) check(report, `negative/missing-dependency/${missing}`, () => {
      const w = { ...window, HSE_GENERATORS: stubApi() }; delete w[missing]; assert.throws(() => vm.runInNewContext(code(scriptFile), { window: w }), /must load first/);
    });
    check(report, "duplicate-load-names-idempotent", () => { vm.runInContext(code(scriptFile), runtime.context); assert.deepEqual(api.names, ["legacy", key]); });
  }
  const assetsFile = path.join(__dirname, "source-6-2-midpoint-cut-assets.js"), presentationFile = path.join(__dirname, "source-6-2-midpoint-cut-presentation.js");
  let exportedAssets, parent;
  check(report, "exported-parent-API-required", () => {
    exportedAssets = require(assetsFile); parent = require(presentationFile);
    assert.equal(typeof exportedAssets.image, "function"); assert.equal(typeof parent.renderBank, "function");
    report.parentApi = { status: "API-smoke-executed-only", rasterRechecked: false, presentationSha256: sha(presentationFile), assetsSha256: sha(assetsFile) };
  });
  if (exportedAssets) {
    check(report, "exported-asset-whitelist", () => {
      assert.deepEqual([...exportedAssets.files].sort(), pool.flatMap(n => ["given", "cut-top", "cut-all"].map(kind => `n${n}-${kind}.png`)).sort());
      assert.throws(() => exportedAssets.image("../n3-given.png"), /Unverified/);
      assert.throws(() => exportedAssets.image("n5-given.png"), /Unverified/);
    });
    for (const n of pool) for (const kind of ["given", "cut-top", "cut-all"]) check(report, `exported-metadata/n${n}/${kind}`, () => {
      const file = `n${n}-${kind}.png`, asset = exportedAssets.image(file);
      assert.equal(asset.file, file); assert.equal(asset.kind, kind); assert.deepEqual(clone(asset.dimensions), [n, n, n]);
      assert.equal(asset.width, 1600); assert.equal(asset.height, 1600); assert.equal(asset.glyphSize, 72);
      assert.match(asset.sha256, /^[a-f0-9]{64}$/); assert(Object.isFrozen(asset)); assert(Object.isFrozen(asset.dimensions));
      const printedLabelPoints = asset.glyphSize / asset.width * 72 * 72 / 25.4;
      assert(printedLabelPoints >= 9, "72mm bitmap has nominal labels >=9pt");
      return { file, printedWidthMm: 72, nominalPrintedLabelPoints: printedLabelPoints, rasterRechecked: false };
    });
  }
  let domRuntime, dom;
  check(report, "controlled-DOM-exported-assets-listener-load", () => {
    assert(exportedAssets, "Exported asset metadata required"); dom = fakeDom();
    domRuntime = load(dom.document, { HSE_SOURCE_GRADE6_MIDPOINT_CUT_ASSETS: exportedAssets });
    vm.runInContext(code(scriptFile), domRuntime.context); assert.equal(dom.listeners.size, 1);
  });
  if (domRuntime) {
    for (const [label, mutate] of [["unknown-file", b => { b.dataset.midpointCutFile = "unknown.png"; }],
      ["path-traversal", b => { b.dataset.midpointCutFile = "../n3-given.png"; }],
      ["cross-source-context", b => { b.context.dataset.sourceItemId = "6-2-u3-e4-exploration"; }],
      ["invalid-level", b => { b.context.dataset.level = "3"; }], ["noninteger-level", b => { b.context.dataset.level = "1.5"; }],
      ["invalid-variant", b => { b.context.dataset.variant = "3"; }], ["mismatched-size", b => { b.dataset.midpointCutFile = "n2-given.png"; }],
      ["problem-with-teacher-image", b => { b.dataset.midpointCutFile = "n3-cut-all.png"; }],
      ["unknown-phase", b => { b.dataset.phase = "filled"; }], ["cross-source-button", b => { b.dataset.sourceItemId = "other"; }],
      ["missing-context", b => { b.context = null; }], ["wrong-context-role", b => { b.context.dataset.midpointCutContext = "teacher"; }]]) await asyncCheck(report, `negative/zoom/${label}`, async () => {
      const b = dom.button(); mutate(b); await dom.click(b); assert.equal(dom.created.length, 0); assert.equal(dom.decodes.length, 0);
    });
    for (let variant = 0; variant < 3; variant++) for (let level = 0; level < 3; level++) for (const role of ["problem", "teacher"]) await asyncCheck(report, `controlled-DOM-exported-zoom/v${variant}/l${level}/${role}`, async () => {
      const b = dom.button(variant, level, role), promise = dom.click(b), pending = dom.decodes.at(-1), dialog = dom.created.find(e => e.tag === "dialog");
      assert(!dialog.open, "decode precedes opening"); pending.resolve(); await promise; assert(dialog.open); assert.equal(dialog.attributes["aria-busy"], "false");
      assert.equal(dialog.className, "source62-midpoint-cut-figure-dialog"); assert(dialog.attributes["aria-label"]);
      const image = dialog.children.find(e => e.tag === "div").children[0]; assert(image.src.endsWith(b.dataset.midpointCutFile));
      let prevented = false; dialog.listeners.get("cancel")({ preventDefault() { prevented = true; } }); assert.equal(prevented, false, "native Escape default is not prevented");
      dialog.close(); assert.equal(dom.document.activeElement, b, "focus returns to diagram button");
    });
    const dialog = dom.created.find(e => e.tag === "dialog");
    await asyncCheck(report, "negative/zoom/difficulty-phase-mismatch", async () => {
      const b = dom.button(0, 0, "teacher"), before = dom.decodes.length; b.dataset.midpointCutFile = "n3-cut-all.png";
      await dom.click(b); assert.equal(dom.decodes.length, before); assert(!dialog.open);
    });
    await asyncCheck(report, "synthetic-zoom/latest-request-wins", async () => {
      const a = dom.button(0), b = dom.button(1), first = dom.click(a), old = dom.decodes.at(-1), second = dom.click(b), current = dom.decodes.at(-1);
      old.resolve(); await first; assert(!dialog.open); current.resolve(); await second;
      assert(dialog.open); assert(dialog.children[1].children[0].src.endsWith("n2-given.png")); dialog.close();
    });
    await asyncCheck(report, "negative/zoom/close-during-decode-no-reopen", async () => {
      const promise = dom.click(dom.button()), pending = dom.decodes.at(-1); dialog.listeners.get("close")(); pending.resolve(); await promise; assert(!dialog.open);
    });
    await asyncCheck(report, "negative/zoom/metadata-mutated-during-decode", async () => {
      const b = dom.button(), promise = dom.click(b), pending = dom.decodes.at(-1); b.context.dataset.level = "9"; pending.resolve(); await promise; assert(!dialog.open); assert.equal(dialog.attributes["aria-busy"], "false");
    });
    await asyncCheck(report, "negative/zoom/wrong-decoded-dimensions", async () => {
      const promise = dom.click(dom.button()), pending = dom.decodes.at(-1); pending.image.naturalWidth = 1500; pending.resolve(); await promise; assert(!dialog.open);
    });
    await asyncCheck(report, "negative/zoom/decode-failure", async () => {
      const promise = dom.click(dom.button()); dom.decodes.at(-1).reject(new Error("Synthetic decode failure")); await promise; assert(!dialog.open); assert.equal(dialog.attributes["aria-busy"], "false");
    });
    await asyncCheck(report, "negative/zoom/detached-button", async () => {
      const b = dom.button(), promise = dom.click(b), pending = dom.decodes.at(-1); b.isConnected = false; pending.resolve(); await promise; assert(!dialog.open);
    });
    await asyncCheck(report, "negative/zoom/invalid-click-cancels-pending", async () => {
      const promise = dom.click(dom.button()), pending = dom.decodes.at(-1), bad = dom.button(); bad.context.dataset.sourceItemId = "other";
      await dom.click(bad); pending.resolve(); await promise; assert(!dialog.open);
    });
    check(report, "single-reused-dialog", () => assert.equal(dom.created.filter(e => e.tag === "dialog").length, 1));
  }
  check(report, "CSS-is-scoped-and-print-dialog-hidden-not-rendered", () => {
    const css = code(cssFile); assert(css.includes(".source62-midpoint-cut-zoom")); assert(css.includes(".source62-midpoint-cut-figure-dialog{display:none!important}"));
    assert(!css.includes(".source62-cut-zoom") && !css.includes(".source62-m3-figure-dialog"));
    assert(css.includes("width:72mm") && css.includes("letter-spacing:0"));
    assert.equal((css.match(/\{/g) || []).length, (css.match(/\}/g) || []).length);
    return { nominalPrintedGlyphPoints: 72 / 1600 * 72 * 72 / 25.4, actualPrintVerified: false };
  });
  check(report, "CSS-answer-key-fragmentation-preserves-two-columns-and-72mm", () => {
    const css = code(cssFile);
    assert(css.includes("@page source62MidpointAnswerKey{size:A4;margin:12mm 8mm}"), "Keep continued answer pages inside physical margins");
    assert(css.includes("{page:source62MidpointAnswerKey;padding:0}"), "Do not add base-page padding inside the scoped physical margins");
    assert(css.includes(".answer-key-grid{break-after:avoid}"), "Keep summary with the beginning of the diagrams");
    assert(css.includes(".answer-key-visuals>figure{flex:0 0 calc((100% - 6mm)/2);min-width:0;break-inside:avoid}"), "Keep each bounded answer intact in two columns");
    assert(css.includes("margin:3mm auto;break-inside:avoid") && css.includes("figure{margin:0;text-align:center;break-inside:avoid}"), "Individual diagrams and layer grids stay intact");
    return { paginationBrowserVerified: false, actualPrintVerified: false };
  });
  check(report, "negative/output-environment-missing", () => assert.throws(() => outputFolder({}), /Set HSE_SCREENSHOT_DIR/));
  check(report, "negative/output-outside-E", () => assert.throws(() => outputFolder({ HSE_SCREENSHOT_DIR: "C:\\audit-output" }), /absolute E:/));
  check(report, "negative/output-inside-repository", () => assert.throws(() => outputFolder({ HSE_SCREENSHOT_DIR: __dirname }), /outside the repository/));
  check(report, "output-environment-root-and-direct-directory", () => {
    assert.equal(outputFolder({ HSE_SCREENSHOT_DIR: folder }), folder);
    const evidenceRoot = path.dirname(folder);
    assert.equal(outputFolder({ HSE_MIDPOINT_SOURCE_EVIDENCE_DIR: evidenceRoot }), path.join(evidenceRoot, "midpoint-wrapper"));
  });
  if (exportedAssets && parent) {
    const real = load(undefined, { HSE_SOURCE_GRADE6_MIDPOINT_CUT_ASSETS: exportedAssets, HSE_SOURCE_GRADE6_MIDPOINT_CUT_PRESENTATION: parent });
    for (let variant = 0; variant < 3; variant++) for (let level = 0; level < 3; level++) check(report, `parent-API-contract-smoke/v${variant}/l${level}`, () => {
      validateQuestion(real.api.generate({ sourceItemId: id, generatorKey: key }, 4, level - 1, 1, variant), parent, variant, level);
    });
    check(report, "exported-parent-inputs-unchanged", () => {
      assert.equal(sha(assetsFile), report.parentApi.assetsSha256); assert.equal(sha(presentationFile), report.parentApi.presentationSha256);
    });
  }
  check(report, "owned-and-stable-contract-inputs-unchanged", () => assert.deepEqual(fingerprints(), report.inputs));
  report.failedChecks = report.checks.filter(c => c.status === "fail"); report.status = report.failedChecks.length ? "failed" : "passed-synthetic-wrapper";
  report.checkCount = report.checks.length; report.passedChecks = report.checkCount - report.failedChecks.length;
  report.syntheticContractCases = report.cases.length; report.negativeControls = report.checks.filter(c => c.name.startsWith("negative/"));
  report.controlledDomExportedAssetZoomCases = report.checks.filter(c => c.name.startsWith("controlled-DOM-exported-zoom/") && c.status === "pass").length;
  report.parentApiContractCases = report.checks.filter(c => c.name.startsWith("parent-API-contract-smoke/") && c.status === "pass").length;
  report.approvalBoundary = "No source/raster/PDF verification, live bank registration, catalog unlock or public approval is claimed";
  fs.mkdirSync(folder, { recursive: true });
  fs.writeFileSync(report.reportFile, JSON.stringify(report, null, 2) + "\n"); return report;
}
module.exports = { run, validateQuestion, parseMarkup };
if (require.main === module) run().then(r => {
  console.log(JSON.stringify({ status: r.status, cases: r.syntheticContractCases, checks: r.checkCount, failures: r.failedChecks,
    parentApi: r.parentApi, exportedAssetZoomCases: r.controlledDomExportedAssetZoomCases, parentApiContractCases: r.parentApiContractCases,
    report: r.reportFile })); if (r.failedChecks.length) process.exitCode = 1;
}).catch(error => { console.error(error.stack); process.exitCode = 1; });
