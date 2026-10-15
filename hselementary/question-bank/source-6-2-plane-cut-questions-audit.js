"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const crypto = require("node:crypto");
const id = "6-2-u3-e4-exploration", key = "sourceGrade6SecondSpaceE4PrismCut";
const missionIds = ["6-2-u3-e4-mission-3", "6-2-u3-e4-mission-3-1", "6-2-u3-e4-mission-3-2"];
const evidenceRoot = "E:/Codex/visualizations/2026/08/21/01a0242e-3982-7661-8225-b287285e6742/source-6-2-u3-e4-review-20261014";
const sourceDir = path.join(evidenceRoot, "concept-source-review");
const files = ["models", "reference", "assets", "contracts", "presentation", "questions"].map(name => `source-6-2-plane-cut-${name}.js`);
const clone = value => JSON.parse(JSON.stringify(value));
const sha = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const code = file => fs.readFileSync(path.join(__dirname, file), "utf8");
const readSource = file => JSON.parse(fs.readFileSync(path.join(sourceDir, file), "utf8"));
function check(report, name, fn) {
  try { const detail = fn(); report.checks.push({ name, status: "pass", ...(detail === undefined ? {} : { detail }) }); }
  catch (error) { report.checks.push({ name, status: "fail", error: error.message }); }
}
function sameCells(actual, expected, label) {
  const k = cell => cell.join(",");
  assert.equal(new Set(actual.map(k)).size, actual.length, `${label}: duplicate cells`);
  assert.deepEqual(actual.map(k).sort(), expected.map(k).sort(), label);
}
function independentReferences() {
  const input = readSource("rectangular-variants-source-reading.json"), vertex = readSource("rectangular-variants-vertex-results.json"), polygon = readSource("rectangular-variants-polygon-results.json");
  const source = readSource("source-reading.json"), actual = source.figures.find(f => f.id === "actual-question-ABC");
  assert.deepEqual(input.finiteCases.map(c => c.dimensionsXYZ), [[3, 2, 2], [4, 3, 3], [5, 4, 4]]);
  assert.deepEqual(input.finiteCases[0].dimensionsXYZ, actual.dimensionsXYZ);
  assert.equal(input.sourceReading.baseReadingSha256, sha(path.join(sourceDir, "source-reading.json")));
  assert.equal(input.sourceReading.sourceImageSha256, sha(path.join(evidenceRoot, "source-pdf-36.png")));
  for (const [r, script] of [[vertex, "rectangular-variants-vertices.mjs"], [polygon, "rectangular-variants-polygons.py"]]) {
    assert.equal(r.inputSha256, sha(path.join(sourceDir, "rectangular-variants-source-reading.json")));
    assert.equal(r.scriptSha256, sha(path.join(sourceDir, script)));
    assert.equal(r.sourceSha256, input.sourceReading.sourceImageSha256);
  }
  return input.finiteCases.map((item, index) => {
    const a = vertex.cases[index], b = polygon.cases[index], full = [], [w, h, d] = item.dimensionsXYZ;
    assert.equal(a.id, item.id); assert.equal(b.id, item.id);
    assert.deepEqual(a.dimensionsXYZ, item.dimensionsXYZ); assert.deepEqual(b.dimensionsXYZ, item.dimensionsXYZ);
    assert.deepEqual(a.points, b.points); if (index === 0) assert.deepEqual(a.points, actual.points);
    for (let x = 0; x < w; x++) for (let y = 0; y < h; y++) for (let z = 0; z < d; z++) full.push([x, y, z]);
    for (const r of [a, b]) {
      assert.equal(r.enumeratedCellCount, full.length); sameCells(r.allCells.map(c => c.cell), full, "independent: full evaluation");
      sameCells(r.cutCells, r.allCells.filter(c => c.classification === "cut").map(c => c.cell), "independent: cut classification");
      sameCells(r.touchOnlyCells, r.allCells.filter(c => c.classification === "touch-only").map(c => c.cell), "independent: contact classification");
      assert.equal(r.cutCount, r.cutCells.length); assert.equal(r.touchOnlyCount, r.touchOnlyCells.length);
      assert.equal(r.layers.length, h);
      r.layers.forEach((layer, y) => {
        assert.equal(layer.j, y); sameCells(layer.cutCells, r.cutCells.filter(c => c[1] === y), "independent: layer cut set");
        sameCells(layer.touchOnlyCells, r.touchOnlyCells.filter(c => c[1] === y), "independent: layer contact set");
      });
    }
    sameCells(a.cutCells, b.cutCells, "independent: both cut lists"); sameCells(a.touchOnlyCells, b.touchOnlyCells, "independent: both contact lists");
    const states = new Map(a.allCells.map(c => [c.cell.join(","), c.classification]));
    b.allCells.forEach(c => assert.equal(c.classification, states.get(c.cell.join(",")), "independent: every-cell agreement"));
    return b;
  });
}
let xml;
function parseMarkup(markup) {
  if (!xml) {
    try { xml = require("xml-js"); } catch (error) {
      if (error.code !== "MODULE_NOT_FOUND") throw error;
      xml = require(process.env.HSE_XML_PARSER_PATH || path.join(process.env.USERPROFILE || "", ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/xml-js"));
    }
  }
  // Generated bank markup uses HTML void img elements; normalize only that syntax for XML parsing.
  const wellFormed = markup.replace(/<img\b([^>]*?)\s*\/?\s*>/g, (_, attributes) => `<img${attributes.replace(/\/$/, "")}/>`);
  return xml.xml2js(`<audit-root>${wellFormed}</audit-root>`, { compact: false }).elements[0];
}
function elements(node, name) { return (node.elements || []).flatMap(c => [...(c.type === "element" && (!name || c.name === name) ? [c] : []), ...elements(c, name)]); }
const attr = (node, name) => node.attributes && node.attributes[name];
const textContent = node => (node.elements || []).map(c => c.type === "text" ? c.text : textContent(c)).join("");
function imageMetadata(img, assets) {
  const src = attr(img, "src"); assert.equal(typeof src, "string");
  assert(!/^(?:https?:|data:|\/\/)|\.\./i.test(src), "asset: local static image required");
  const file = path.posix.basename(src), meta = assets.image(file);
  assert.equal(meta.file, file); assert(Number.isSafeInteger(meta.width) && meta.width > 0 && Number.isSafeInteger(meta.height) && meta.height > 0);
  assert(/^[a-f0-9]{64}$/i.test(meta.sha256));
  const absolute = path.resolve(__dirname, src);
  assert(absolute.startsWith(path.join(__dirname, "assets") + path.sep), "asset: outside bank assets");
  assert.equal(sha(absolute), meta.sha256, "asset: static byte hash");
  const bytes = fs.readFileSync(absolute);
  assert.equal(bytes.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
  assert.equal(bytes.readUInt32BE(16), meta.width); assert.equal(bytes.readUInt32BE(20), meta.height);
  if (attr(img, "width") !== undefined) assert.equal(Number(attr(img, "width")), meta.width);
  if (attr(img, "height") !== undefined) assert.equal(Number(attr(img, "height")), meta.height);
  return file;
}
function validateQuestion(q, reference, variant, level, presentation, assets) {
  const expected = level === 0 ? reference.layers.at(-1).cutCells.length : reference.cutCells.length;
  const answer = level === 2 ? `(1) ${expected}\uAC1C; (2) ${reference.touchOnlyCells.length}\uAC1C` : `${expected}\uAC1C`;
  assert.equal(q.sourceItemId, id); assert.equal(q.generator, key); assert.equal(q.answer, answer);
  assert.deepEqual(clone(q.model.dimensions), reference.dimensionsXYZ);
  sameCells(clone(q.model.cutCells), reference.cutCells, "question: independent cut cells");
  sameCells(clone(q.model.touchCells), reference.touchOnlyCells, "question: independent contact cells");
  assert.equal(q.verifiedVariantCount, 3); assert.equal(q.verifiedVariantTarget, 3); assert.equal(q.verifiedPoolIndex, variant);
  assert.equal(q.verifiedVariantId, `${id}:v${variant}`); assert.equal(q.difficultyOffset, level - 1);
  assert.equal(q.difficultyLevel, level); assert.equal(q.difficultyRank, level); assert.equal(q.answerPageLayout, "two-column");
  assert.equal(q.registrationOnly, true); assert.equal(q.officialAnswerVerified, false);
  for (const field of ["sourceExact", "publisherAnswerVerified", "learnerReleaseVerified", "humanApproved"]) assert.equal(q[field], false);
  for (const field of ["sourceReferencePanelRequired", "sourceReferencePanelImplemented", "sourceConditionsClarified", "requestedAnswerUnique"]) assert.equal(q[field], true);
  assert.equal(q.originalSourceReleaseStatus, "locked");
  const plain = presentation.renderBank(id, variant, level);
  for (const field of ["prompt", "promptText", "answer", "answerVisual", "solution", "structuralFingerprint"]) assert.equal(q[field], plain[field], "wrapper: presentation unchanged without extra helpful text");
  const prompt = parseMarkup(q.prompt), teacher = parseMarkup(q.answerVisual), images = elements(prompt, "img");
  const problemFiles = images.map(img => imageMetadata(img, assets));
  assert.equal(problemFiles.filter(f => f.endsWith("-given.png")).length, 1, "problem: one unsolved prism image");
  assert(problemFiles.includes(`${reference.dimensionsXYZ.join("x")}-given.png`), "problem: actual prism dimensions");
  assert(!problemFiles.some(f => /cut-all|cut-top|answer|touch|filled/.test(f)), "problem: no target answer image");
  assert.equal(problemFiles.length, 4, "problem: exactly one prism and three original reference images");
  for (const name of ["reference-solid.png", "reference-layer-2.png", "reference-layer-1.png"]) assert.equal(problemFiles.filter(f => f === name).length, 1, "problem: no duplicated original reference picture");
  const panels = elements(prompt, "section").filter(n => attr(n, "data-reference-role") === "source-given-worked-example");
  assert.equal(panels.length, 1, "problem: one exact original worked panel");
  const numbers = elements(panels[0], "g").filter(n => attr(n, "data-reference-number") !== undefined);
  const assignments = [[1, "0,1,0"], [2, "1,1,0"], [3, "1,1,1"], [4, "1,0,0"]];
  assert.deepEqual(numbers.map(n => [Number(attr(n, "data-reference-number")), attr(n, "data-cell")]), assignments, "problem: original circles 1-4 not prism answer");
  numbers.forEach((n, i) => { assert.equal(elements(n, "circle").length, 1); assert.equal(textContent(elements(n, "text")[0]).trim(), String(i + 1)); });
  assert.deepEqual(elements(prompt, "svg").map(n => Number(attr(n, "data-reference-layer"))), [2, 1], "problem: original grids only, exploration has no response grids");
  assert(!elements(prompt).some(n => /answer|solution|teacher|count-table|helper/.test(attr(n, "class") || "")), "problem: no invented answer/helper table");
  assert(!/\d\s*[+=]\s*\d|\uC815\uB2F5\uC740|\uCE35\uBCC4 \uAC1C\uC218/.test(textContent(prompt)), "problem: no target count or equality");
  const teacherFiles = elements(teacher, "img").map(img => imageMetadata(img, assets));
  assert.deepEqual(teacherFiles, [`${reference.dimensionsXYZ.join("x")}-cut-${level === 0 ? "top" : "all"}.png`], "teacher: one matching solved image without reference duplication");
  const grids = elements(teacher, "svg"), requested = level === 0 ? [reference.dimensionsXYZ[1]] : Array.from({ length: reference.dimensionsXYZ[1] }, (_, i) => reference.dimensionsXYZ[1] - i);
  const expectedGrids = requested.map(layer => [layer, "cut"]);
  if (level === 2) expectedGrids.push(...requested.map(layer => [layer, "touch"]));
  assert.deepEqual(grids.map(n => [Number(attr(n, "data-layer")), attr(n, "data-phase")]), expectedGrids, "teacher: exact requested grids");
  grids.forEach((svg, i) => {
    const [layer, mode] = expectedGrids[i], rects = elements(svg, "rect");
    const expectedCells = reference.layers[layer - 1][mode === "cut" ? "cutCells" : "touchOnlyCells"].map(([x, , z]) => [x, z]);
    assert.equal(rects.length, reference.dimensionsXYZ[0] * reference.dimensionsXYZ[2]);
    sameCells(rects.filter(n => attr(n, "data-selected") === "true").map(n => [Number(attr(n, "data-x")), Number(attr(n, "data-z"))]), expectedCells, "teacher: independent selected voxel count/positions");
    for (const rect of rects) assert.equal(attr(rect, "fill"), attr(rect, "data-selected") === "true" ? "#cedfcf" : "#fff");
  });
  return { independentAnswer: answer, problemImages: problemFiles, answerImages: teacherFiles, teacherGrids: grids.length };
}
function stubApi() {
  const calls = [], sentinel = { unchanged: true };
  return { calls, sentinel, names: ["legacy"],
    generatorKey: function(...args) { calls.push({ method: "key", receiver: this, args }); return args[0]?.reviewLocked ? "" : "legacy-key"; },
    generate: function(...args) { calls.push({ method: "generate", receiver: this, args }); return args[0]?.reviewLocked ? null : sentinel; } };
}
function loadContext() {
  const api = stubApi(), window = { HSE_GENERATORS: api }, context = vm.createContext({ window });
  for (const file of files) vm.runInContext(code(file), context, { filename: file });
  return { api, window, context };
}
function fingerprints() {
  const names = [...files, "source-6-2-plane-cut-questions-audit.js"];
  return names.map(file => path.join(__dirname, file)).filter(fs.existsSync).concat(
    ["source-reading.json", "rectangular-variants-source-reading.json", "rectangular-variants-vertex-results.json", "rectangular-variants-polygon-results.json",
      "rectangular-variants-vertices.mjs", "rectangular-variants-polygons.py"].map(file => path.join(sourceDir, file)),
    path.join(__dirname, "source-inventory-grade6.js"), path.join(evidenceRoot, "source-pdf-36.png"))
    .map(file => ({ file, sha256: sha(file) }));
}
function run() {
  const report = { schema: "plane-cut-bank-wrapper-audit/v1", createdAt: new Date().toISOString(), checks: [], cases: [], pending: [],
    inputs: fingerprints(), scope: "browser-UMD-vm-with-prior-generator-stub-and-real-static-production-presentation",
    sourceItemIdsRegistered: [id], missionIdsNotRegistered: missionIds, inventoryEdited: false,
    originalSourceReleaseStatus: "locked", sourceExact: false, publisherAnswerVerified: false, learnerReleaseVerified: false,
    browserVerified: false, a4VerifiedByWorker: false, publicApproval: false, unlockPerformed: false, mainChanged: false, deployed: false,
    prototypeVisualsRechecked: false, skills: ["evidence-gated-learning-pipeline", "audit-verify-explain-grade-5"] };
  const assetFile = path.join(__dirname, "source-6-2-plane-cut-assets.js");
  if (!fs.existsSync(assetFile)) report.pending.push("Static assets module is not ready; parent should rerun after patch");
  let presentation;
  if (!report.pending.length) {
    try { presentation = require("./source-6-2-plane-cut-presentation.js"); } catch (error) { report.pending.push(`Presentation dependencies not ready: ${error.message}`); }
    if (presentation && typeof presentation.renderBank !== "function") report.pending.push("presentation.renderBank is not ready; no production generation tests run");
  }
  if (!report.pending.length) {
    let loaded, references;
    check(report, "correct-order-real-UMD-load", () => { loaded = loadContext(); });
    check(report, "independent-rectangular-full-cell-lists", () => { references = independentReferences(); });
    if (loaded && references) {
      const { api, window } = loaded, type = { sourceItemId: id, generatorKey: key, reviewLocked: false };
      check(report, "only-one-registration", () => {
        assert.deepEqual(clone(window.HSE_SOURCE_GRADE6_PLANE_CUT_QUESTIONS.keys), { [id]: key });
        assert(Object.isFrozen(window.HSE_SOURCE_GRADE6_PLANE_CUT_QUESTIONS));
        assert(Object.isFrozen(window.HSE_SOURCE_GRADE6_PLANE_CUT_QUESTIONS.keys));
        assert.deepEqual(api.names, ["legacy", key]); assert.equal(api.generatorKey(type), key);
        assert.equal(window.HSE_SOURCE_GRADE6_PLANE_CUT_QUESTIONS.registrationOnly, true);
        assert.equal(window.HSE_SOURCE_GRADE6_PLANE_CUT_QUESTIONS.learnerReleaseVerified, false);
      });
      for (let variant = 0; variant < 3; variant++) for (let level = 0; level < 3; level++) {
        check(report, `actual-9-contracts/v${variant}/l${level}`, () => {
          const q = api.generate(type, 4, level - 1, 123, variant);
          assert(q); assert.equal(q.levelRank, 4);
          const detail = validateQuestion(q, references[variant], variant, level, window.HSE_SOURCE_GRADE6_PLANE_CUT_PRESENTATION, window.HSE_SOURCE_GRADE6_PLANE_CUT_ASSETS);
          report.cases.push({ variant, level, structuralFingerprint: q.structuralFingerprint, ...detail }); return detail;
        });
      }
      check(report, "locked-type-never-generated-or-mutated", () => {
        const locked = { ...type, reviewLocked: true }, snapshot = clone(locked);
        assert.equal(api.generatorKey(locked), ""); assert.equal(api.generate(locked), null); assert.deepEqual(locked, snapshot);
      });
      for (const t of [{ sourceItemId: id, generatorKey: "other" }, { sourceItemId: "other", generatorKey: key },
        { generatorKey: key }, { sourceItemId: id }, Object.assign([], type), Object.create(type)]) {
        check(report, `mismatch-or-inherited/${String(t.sourceItemId)}/${String(t.generatorKey)}`, () => { assert.equal(api.generatorKey(t), ""); assert.equal(api.generate(t), null); });
      }
      check(report, "unrelated-delegation-this-and-all-arguments", () => {
        const receiver = {}, args = [{ sourceItemId: "unknown", generatorKey: "unknown" }, 7, 2, 99, 12, "extra"];
        assert.equal(api.generatorKey.call(receiver, ...args), "legacy-key"); assert.equal(api.generate.call(receiver, ...args), api.sentinel);
        const calls = api.calls.slice(-2); assert.deepEqual(calls.map(c => c.receiver), [receiver, receiver]);
        for (const call of calls) assert.deepEqual(call.args, args);
        for (const t of [null, {}, "unknown"]) { assert.equal(api.generatorKey(t), "legacy-key"); assert.equal(api.generate(t), api.sentinel); }
      });
      check(report, "mission-aggregate-and-two-children-unregistered", () => {
        for (const sourceItemId of missionIds) {
          assert(!Object.hasOwn(window.HSE_SOURCE_GRADE6_PLANE_CUT_QUESTIONS.keys, sourceItemId));
          const t = { sourceItemId, generatorKey: "", reviewLocked: true };
          assert.equal(api.generatorKey(t), ""); assert.equal(api.generate(t), null);
        }
        const catalog = { window: {} }; vm.runInNewContext(code("source-inventory-grade6.js"), catalog);
        for (const sourceItemId of missionIds.slice(1)) {
          const item = catalog.window.HSE_SOURCE_INVENTORY_GRADE6.items.find(t => t.sourceItemId === sourceItemId);
          assert(item); assert.equal(item.reviewLocked, true); assert.equal(item.generatorKey, "");
        }
      });
      for (const value of [-1, 1.5, "0", NaN, Infinity, null, Number.MAX_SAFE_INTEGER + 1]) {
        check(report, `invalid-variant/${String(value)}`, () => assert.throws(() => api.generate(type, 1, 0, 1, value), /Unsupported plane-cut/));
      }
      for (const value of [-2, 2, 0.5, "0", NaN, Infinity, null]) {
        check(report, `invalid-offset/${String(value)}`, () => assert.throws(() => api.generate(type, 1, value, 1, 0), /Unsupported plane-cut/));
      }
      check(report, "finite-pool-modulo-and-defaults", () => {
        const q = api.generate(type, 2); assert.equal(q.verifiedPoolIndex, 0); assert.equal(q.difficultyOffset, 0);
        for (const variant of [3, 4, 5, 99, Number.MAX_SAFE_INTEGER]) {
          const p = api.generate(type, 2, 0, 123, variant); assert.equal(p.verifiedPoolIndex, variant % 3);
          assert.equal(p.structuralFingerprint, api.generate(type, 2, 0, 123, variant % 3).structuralFingerprint);
        }
      });
      for (const [field, value] of [["sourceItemId", missionIds[0]], ["variant", 1], ["level", 2], ["requestedAnswerUnique", false],
        ["sourceConditionsClarified", false], ["sourceReferencePanelRequired", false], ["sourceReferencePanelImplemented", false],
        ["originalSourceReleaseStatus", "approved"], ["sourceExact", true], ["publisherAnswerVerified", true], ["learnerReleaseVerified", true],
        ["humanApproved", true], ["structuralFingerprint", ""]]) {
        check(report, `negative/guard-mutation/${field}`, () => {
          const base = clone(window.HSE_SOURCE_GRADE6_PLANE_CUT_PRESENTATION.renderBank(id, 0, 1)); base[field] = value;
          const guardedApi = stubApi(), guardWindow = { HSE_GENERATORS: guardedApi, HSE_SOURCE_GRADE6_PLANE_CUT_ASSETS: window.HSE_SOURCE_GRADE6_PLANE_CUT_ASSETS,
            HSE_SOURCE_GRADE6_PLANE_CUT_PRESENTATION: { renderBank: () => base } };
          vm.runInNewContext(code(files.at(-1)), { window: guardWindow }); assert.equal(guardedApi.generate(type, 1, 0, 1, 0), null);
        });
      }
      for (const missing of ["HSE_GENERATORS", "HSE_SOURCE_GRADE6_PLANE_CUT_ASSETS", "HSE_SOURCE_GRADE6_PLANE_CUT_PRESENTATION"]) {
        check(report, `negative/missing-dependency/${missing}`, () => {
          const w = { HSE_GENERATORS: stubApi(), HSE_SOURCE_GRADE6_PLANE_CUT_ASSETS: window.HSE_SOURCE_GRADE6_PLANE_CUT_ASSETS,
            HSE_SOURCE_GRADE6_PLANE_CUT_PRESENTATION: window.HSE_SOURCE_GRADE6_PLANE_CUT_PRESENTATION }; delete w[missing];
          assert.throws(() => vm.runInNewContext(code(files.at(-1)), { window: w }), /must load first/);
        });
      }
      check(report, "duplicate-load-does-not-add-names", () => { vm.runInContext(code(files.at(-1)), loaded.context); assert.deepEqual(api.names, ["legacy", key]); });
    }
  }
  if (!report.pending.length) check(report, "input-hashes-stable-through-run", () => assert.deepEqual(fingerprints(), report.inputs));
  report.failedChecks = report.checks.filter(c => c.status === "fail");
  report.status = report.failedChecks.length ? "failed" : report.pending.length ? "pending" : "passed-bounded-vm-production-api";
  report.checkCount = report.checks.length; report.passedChecks = report.checkCount - report.failedChecks.length;
  report.actualContractCases = report.cases.length;
  const folder = path.join(evidenceRoot, "questions-audit"); fs.mkdirSync(folder, { recursive: true });
  fs.writeFileSync(path.join(folder, "questions-audit.json"), JSON.stringify(report, null, 2) + "\n"); return report;
}
module.exports = { run, independentReferences, validateQuestion, parseMarkup };
if (require.main === module) {
  try { const r = run(); console.log(JSON.stringify({ status: r.status, cases: r.actualContractCases, checks: r.checkCount,
    failures: r.failedChecks, pending: r.pending, report: path.join(evidenceRoot, "questions-audit/questions-audit.json") }));
    if (r.status === "failed") process.exitCode = 1;
  } catch (error) { console.error(error.stack); process.exitCode = 1; }
}
