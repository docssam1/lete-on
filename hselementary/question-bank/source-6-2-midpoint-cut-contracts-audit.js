"use strict";
const assert = require("node:assert/strict"), fs = require("node:fs"), path = require("node:path"), crypto = require("node:crypto"), vm = require("node:vm");
const models = require("./source-6-2-midpoint-cut-models.js"), contracts = require("./source-6-2-midpoint-cut-contracts.js");
const id = "6-2-u3-e4-example-1", pool = [3, 2, 4];
const root = process.env.HSE_MIDPOINT_SOURCE_EVIDENCE_DIR;
assert(typeof root === "string" && /^E:[/\\]/i.test(root) && path.win32.isAbsolute(root), "Set an explicit E: source evidence directory");
const evidence = path.join(root, "midpoints-design"), clone = value => JSON.parse(JSON.stringify(value));
const sha = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const read = file => JSON.parse(fs.readFileSync(path.join(evidence, file), "utf8"));
const key = p => p.join(",");
function sameCells(actual, expected, label) {
  assert(Array.isArray(actual), label); assert.equal(new Set(actual.map(key)).size, actual.length, `${label}: duplicates`);
  assert.deepEqual(actual.map(key).sort(), expected.map(key).sort(), label);
}
function samePolygon(actual, expected) {
  sameCells(actual, expected, "model: section polygon vertices");
  const edges = polygon => polygon.map((p, i) => [key(p), key(polygon[(i + 1) % polygon.length])].sort().join("/")).sort();
  assert.deepEqual(edges(actual), edges(expected), "model: section polygon cycle");
}
function readIndependent() {
  const observation = read("source-observation.json"), signs = read("sign-results.json"), polygons = read("polygon-results.json"), verified = read("verification.json");
  assert.equal(observation.sourceItemId, id); assert.equal(observation.source.n, 3);
  assert.equal(verified.status, "pass"); assert.equal(verified.enumeratedByEachMethod, 99); assert.equal(verified.allMutationsDetected, true);
  assert.equal(verified.verifierSha256, sha(path.join(evidence, "compare-results.mjs")));
  const imageSha = sha(path.join(root, "source-pdf-36.png")), observationSha = sha(path.join(evidence, "source-observation.json"));
  assert.equal(observation.source.sha256, imageSha); assert.equal(verified.sourceSha256, imageSha); assert.equal(verified.observationSha256, observationSha);
  for (const [r, resultFile, script] of [[signs, "sign-results.json", "calculate-signs.mjs"], [polygons, "polygon-results.json", "calculate-polygons.py"]]) {
    assert.equal(r.sourceSha256, imageSha); assert.equal(r.observationSha256, observationSha);
    assert.equal(r.scriptSha256, sha(path.join(evidence, script))); assert.equal(verified.calculationFiles[resultFile], sha(path.join(evidence, resultFile)));
    assert.deepEqual(r.cases.map(c => c.n), [2, 3, 4]);
  }
  assert.deepEqual(signs.plane.normal, [1, 1, -1]); assert.equal(signs.plane.rhsPerN, 1);
  assert.deepEqual([polygons.planeFit.alpha, polygons.planeFit.beta, polygons.planeFit.gamma], ["1", "1", "-1/2"]);
  for (const residual of Object.values(signs.plane.pointResiduals)) assert.equal(residual, 0);
  for (const residual of Object.values(polygons.planeFit.residuals)) assert.equal(residual, "0");
  assert.equal(signs.rejectedCandidate.accepted, false);
  const results = polygons.cases.map(p => {
    const s = signs.cases.find(c => c.n === p.n), v = verified.cases.find(c => c.n === p.n), full = [];
    for (let x = 0; x < p.n; x++) for (let y = 0; y < p.n; y++) for (let z = 0; z < p.n; z++) full.push([x, y, z]);
    for (const c of [s, p]) {
      assert.equal(c.enumeratedCellCount, full.length); sameCells(c.allCells.map(row => row.cell), full, "independent: full enumeration");
      assert(c.allCells.every(row => ["cut", "boundary-only", "outside"].includes(row.classification)));
      sameCells(c.cutCells, c.allCells.filter(row => row.classification === "cut").map(row => row.cell), "independent: cut classification");
      sameCells(c.boundaryOnlyCells, c.allCells.filter(row => row.classification === "boundary-only").map(row => row.cell), "independent: touch classification");
      assert.equal(c.cutCount, c.cutCells.length); assert.equal(c.layers.length, c.n);
      c.layers.forEach((l, y) => {
        assert.equal(l.j, y); sameCells(l.cutCells, c.cutCells.filter(cell => cell[1] === y), "independent: layer cuts");
        sameCells(l.boundaryOnlyCells, c.boundaryOnlyCells.filter(cell => cell[1] === y), "independent: layer contacts");
      });
    }
    sameCells(s.cutCells, p.cutCells, "independent: two cut methods"); sameCells(s.boundaryOnlyCells, p.boundaryOnlyCells, "independent: two contact methods");
    sameCells(v.cutCells, p.cutCells, "independent: verification cuts"); sameCells(v.boundaryOnlyCells, p.boundaryOnlyCells, "independent: verification contacts");
    const states = new Map(s.allCells.map(row => [key(row.cell), row.classification]));
    p.allCells.forEach(row => assert.equal(row.classification, states.get(key(row.cell)), "independent: all classes agree"));
    const points = Object.fromEntries(Object.entries(observation.edgeEndpointsUnit).map(([name, [a, b]]) => [name, a.map((value, axis) => (value + b[axis]) * p.n / 2)]));
    for (const [name, point] of Object.entries(points)) assert.deepEqual(point.map(value => value * 2), signs.points2Unit[name].map(value => value * p.n));
    return { ...p, full, points, plane: { normal: signs.plane.normal, constant: p.n * signs.plane.rhsPerN, coordinateScale: 2 },
      sectionEdges: observation.sourceSectionEdges.map(edge => ({ from: edge.ends[0], to: edge.ends[1],
        a: points[edge.ends[0]], b: points[edge.ends[1]], style: edge.style === "dotted-hidden" ? "dashed" : "solid" })), cycle: observation.sectionCycle };
  });
  return results;
}
function independentTrace(r, height) {
  const vertices = [[0, 0], [r.n, 0], [r.n, r.n], [0, r.n]], points = [];
  const f = ([x, z]) => x + height - z - r.n / 2;
  const add = p => { if (!points.some(q => q.every((v, i) => Math.abs(v - p[i]) < 1e-9))) points.push(p); };
  for (let i = 0; i < 4; i++) {
    const a = vertices[i], b = vertices[(i + 1) % 4], fa = f(a), fb = f(b);
    if (fa === 0) add(a);
    if (fa * fb < 0) { const t = fa / (fa - fb); add(a.map((v, axis) => v + t * (b[axis] - v))); }
  }
  return points;
}
function validateModel(m, r) {
  assert.equal(m.n, r.n); assert.deepEqual(m.dimensions, [r.n, r.n, r.n], "model: dimensions");
  for (const field of ["width", "height", "depth"]) assert.equal(m[field], r.n);
  assert.deepEqual(m.points, r.points, "model: source midpoint points"); assert.deepEqual(m.plane, r.plane, "model: midpoint plane");
  for (const p of Object.values(m.points)) assert.equal(m.plane.normal.reduce((sum, value, axis) => sum + value * p[axis] * 2, 0), m.plane.constant, "model: six-point incidence");
  assert.deepEqual(m.sectionEdges, r.sectionEdges, "model: explicit six source edges and dashes");
  samePolygon(m.planeSection, r.cycle.map(name => r.points[name]));
  sameCells(m.cubes, r.full, "model: full cubes"); sameCells(m.cutCells, r.cutCells, "model: independent cut cells");
  sameCells(m.touchCells, r.boundaryOnlyCells, "model: independent touch cells");
  assert.equal(m.cutCount, r.cutCells.length); assert.equal(m.touchCount, r.boundaryOnlyCells.length);
  assert.equal(m.layers.length, r.n);
  m.layers.forEach((layer, y) => {
    assert.equal(layer.layer, y + 1, "model: layer label");
    sameCells(layer.cells, r.full.filter(cell => cell[1] === y).map(([x, , z]) => [x, z]), "model: all layer cells");
    sameCells(layer.cutCells, r.layers[y].cutCells.map(([x, , z]) => [x, z]), "model: layer cut cells");
    sameCells(layer.touchCells, r.layers[y].boundaryOnlyCells.map(([x, , z]) => [x, z]), "model: layer touch cells");
    assert.equal(layer.cutCount, r.layers[y].cutCells.length); assert.equal(layer.touchCount, r.layers[y].boundaryOnlyCells.length);
    assert.equal(layer.slabTraces.length, 2);
    layer.slabTraces.forEach((trace, offset) => {
      sameCells(trace, independentTrace(r, y + offset), "model: actual midpoint slab traces");
      for (const [x, z] of trace) assert.equal(x + y + offset - z, r.n / 2, "model: trace incidence");
    });
  });
  assert.deepEqual(m.directions, { x: "right", y: "up", z: "back" }); assert.equal(m.boundaryContactIsCut, false);
}
let xml;
function parseMarkup(text) {
  if (!xml) {
    try { xml = require("xml-js"); } catch (error) {
      if (error.code !== "MODULE_NOT_FOUND") throw error;
      xml = require(process.env.HSE_XML_PARSER_PATH || path.join(process.env.USERPROFILE || "", ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/xml-js"));
    }
  }
  return xml.xml2js(`<audit-root>${text}</audit-root>`, { compact: false }).elements[0];
}
function elements(node, name) { return (node.elements || []).flatMap(c => [...(c.type === "element" && (!name || c.name === name) ? [c] : []), ...elements(c, name)]); }
function textContent(node) { return (node.elements || []).map(c => c.type === "text" ? c.text : textContent(c)).join(""); }
function equality(expression) {
  const tokens = expression.match(/\d+|[+=]/g) || [];
  assert.equal(tokens.join(""), expression.replace(/\s/g, ""), "equation: unsupported token");
  let at = 0;
  const number = () => { assert(/^\d+$/.test(tokens[at] || ""), "equation: integer required"); const n = Number(tokens[at++]); assert(Number.isSafeInteger(n)); return n; };
  const sum = () => { const terms = [number()]; while (tokens[at] === "+") { at++; terms.push(number()); } return { terms, value: terms.reduce((s, n) => s + n, 0) }; };
  const left = sum(); assert.equal(tokens[at++], "=", "equation: equality required"); const right = sum();
  assert.equal(at, tokens.length); assert.equal(left.value, right.value, "equation: false equality"); return { left, right };
}
function validateRelease(q) {
  for (const item of [q, q.model]) {
    assert.equal(item.originalSourceReleaseStatus, "locked", "release: lock");
    for (const field of ["sourceExact", "publisherAnswerVerified", "humanApproved", "learnerReleaseVerified", "empiricallyCalibrated"]) assert.equal(item[field], false, `release: ${field}`);
  }
  assert.equal(q.officialAnswerVerified, false); assert.equal(q.handwrittenAnswerVerified, false);
  assert.equal(q.difficultyDesign.empiricallyCalibrated, false); assert.equal(q.requiresOriginalReview, true);
}
function validateContract(q, r, variant, level) {
  assert.equal(q.sourceItemId, id); assert.equal(q.variant, variant); assert.equal(q.level, level);
  assert.deepEqual(q.requestedLayers, level === 0 ? [r.n] : Array.from({ length: r.n }, (_, i) => r.n - i), "contract: requested layer scope");
  const expected = level === 0 ? r.layers.at(-1).cutCells.length : r.cutCells.length;
  assert.deepEqual(q.answer, level === 2 ? [expected, r.boundaryOnlyCells.length] : expected, "contract: independent answer");
  assert.deepEqual(q.answerOrder, level === 2 ? ["cut", "boundary-touch"] : ["cut"]); assert.equal(q.answerUnit, "\uAC1C");
  assert.deepEqual(q.responseLayers, []); assert.equal(q.requiresLayerDrawing, false);
  assert.deepEqual(q.studentGiven, { promptText: q.promptText, dimensions: q.model.dimensions, points: q.model.points,
    sectionEdges: q.model.sectionEdges, responseLayers: [] }, "student: exact answer-safe schema");
  assert(q.promptText.includes(`\uC313\uAE30\uB098\uBB34 ${r.full.length}\uAC1C`), "student: literal cube count");
  assert(q.promptText.includes("\uC5EC\uC12F \uBAA8\uC11C\uB9AC\uC758 \uC911\uC810 A, B, C, D, E, F"), "student: six original midpoint labels");
  assert(q.promptText.includes("\uB9E8 \uC704\uCE35") === (level === 0));
  assert(q.promptText.includes("\uB2FF\uAE30\uB9CC") === (level === 2)); assert(q.promptText.includes("\uB0B4\uBD80\uAC00 \uC798\uB9B0"));
  assert.equal(elements(parseMarkup(q.promptText)).length, 0, "student: no tables or filled figures");
  assert(!/[=^]|\*\*|\d\s*[+\u00d7]\s*\d|\uC88C\uD45C|\uC870\uD569|\uCE35\uBCC4 \uAC1C\uC218|\uC815\uB2F5\uC740/.test(q.promptText), "student: no invented equations or answer counts");
  assert.equal(q.difficultyDesign.problemView, "full-cube-with-six-midpoints");
  assert.equal(q.difficultyDesign.mode, ["easy", "source", "hard"][level]); assert.equal(q.difficultyDesign.sourceReferenceSize, 3);
  const selected = r.layers.filter(layer => q.requestedLayers.includes(layer.j + 1));
  assert.equal(q.answerDrawing.length, selected.length);
  q.answerDrawing.forEach((drawing, i) => { assert.equal(drawing.layer, selected[i].j + 1); sameCells(drawing.cells, selected[i].cutCells.map(([x, , z]) => [x, z]), "contract: exact answer drawing cells"); });
  const expressions = [selected.slice().reverse().map(layer => layer.cutCells.length)];
  if (level === 2) expressions.push(r.layers.slice().reverse().map(layer => layer.boundaryOnlyCells.length));
  assert.equal(q.solutionEquations.length, expressions.length);
  q.solutionEquations.forEach((span, index) => {
    const nodes = elements(parseMarkup(span)); assert.equal(nodes.length, 1); assert.equal(nodes[0].name, "span");
    assert.equal(nodes[0].attributes.class, "math-inline-expression");
    const parsed = equality(textContent(nodes[0])); assert.deepEqual(parsed.left.terms, expressions[index], "equation: independent layer terms");
    assert.equal(parsed.right.value, index === 0 ? expected : r.boundaryOnlyCells.length, "equation: independent total");
  });
  assert.deepEqual(elements(parseMarkup(q.solutionText), "span").map(textContent), q.solutionEquations.map(span => textContent(parseMarkup(span))));
  assert.equal(q.sourceConditionsClarified, true); assert.equal(q.requestedAnswerUnique, true); assert.equal(q.conditionScope, "positive-volume-cut-only");
  return { answer: q.answer, expressions: q.solutionEquations.map(span => textContent(parseMarkup(span))) };
}
function frozen(value) { if (value && typeof value === "object") { assert(Object.isFrozen(value)); Object.values(value).forEach(frozen); } }
function fingerprints() {
  return ["source-6-2-plane-cut-models.js", "source-6-2-midpoint-cut-models.js", "source-6-2-midpoint-cut-contracts.js", "source-6-2-midpoint-cut-contracts-audit.js"].map(file => path.join(__dirname, file))
    .concat(["source-observation.json", "REVIEW.md", "sign-results.json", "polygon-results.json", "verification.json", "calculate-signs.mjs", "calculate-polygons.py", "compare-results.mjs", "source-example-4-1-zoom.png"].map(file => path.join(evidence, file)), path.join(root, "source-pdf-36.png"))
    .map(file => ({ file, sha256: sha(file) }));
}
function check(report, name, fn) {
  try { const detail = fn(); report.checks.push({ name, status: "pass", ...(detail === undefined ? {} : { detail }) }); }
  catch (error) { report.checks.push({ name, status: "fail", error: error.message }); }
}
function negative(report, name, fn, expected) { check(report, `negative/${name}`, () => { assert.throws(fn, expected); return { rejected: true, expected: String(expected) }; }); }
function run() {
  const report = { schema: "midpoint-cut-contract-audit/v1", createdAt: new Date().toISOString(), inputs: fingerprints(), checks: [], cases: [],
    scope: "three-models-and-nine-pure-contracts-only", originalSourceReleaseStatus: "locked", sourceExact: false,
    publisherAnswerVerified: false, humanApproved: false, learnerReleaseVerified: false, empiricallyCalibrated: false,
    browserVerified: false, a4Verified: false, rendererVerified: false, registered: false, unlocked: false, mainChanged: false, pushed: false,
    learner_stage: "\uCD08\uB4F1 6\uD559\uB144 2\uD559\uAE30 \u00B7 \uD669\uC18C \uC2EC\uD654 \u00B7 \uACF5\uAC04\uACFC \uC785\uCCB4",
    learnerFitCriteria: ["language", "representations", "prerequisites", "reasoning-load", "response-mode"], learnerFitStatus: "technical-scope-only-human-review-pending",
    skills: ["evidence-gated-learning-pipeline", "audit-verify-explain-grade-5"], commonWorkflowVersion: "2026-10-14.r6" };
  let references;
  check(report, "independent-source-and-two-method-integrity", () => { references = readIndependent(); });
  if (references) {
    assert.deepEqual(models.pool, pool); assert.deepEqual(contracts.pool, pool); assert.deepEqual(models.sourceItemIds, [id]);
    report.modelCellsCompared = 0;
    for (let variant = 0; variant < 3; variant++) {
      const r = references.find(result => result.n === pool[variant]), model = models.solve(id, variant);
      check(report, `model/v${variant}/all-cells-plane-source-edges`, () => { validateModel(model, r); frozen(model); report.modelCellsCompared += model.cubes.length; });
      report.cases.push({ variant, n: r.n, cut: r.cutCells.length, touch: r.boundaryOnlyCells.length, layers: r.layers.map(layer => layer.cutCells.length) });
      for (let level = 0; level < 3; level++) {
        const q = contracts.generate(id, variant, level);
        check(report, `contract/v${variant}/l${level}`, () => { assert.equal(q.learner_stage, report.learner_stage); return validateContract(q, r, variant, level); });
        check(report, `release-and-freeze/v${variant}/l${level}`, () => { validateRelease(q); frozen(q); });
      }
    }
    const original = contracts.generate(id, 0, 2), r = references.find(result => result.n === 3), altered = mutate => { const q = clone(original); mutate(q); return q; };
    negative(report, "same-count-coherent-wrong-cell", () => validateModel(altered(q => {
      const m = q.model, old = m.cutCells[0], wrong = r.allCells.find(row => row.classification !== "cut" && row.cell[1] === old[1]).cell;
      m.cutCells[0] = wrong;
      m.layers.forEach(layer => { layer.cutCells = m.cutCells.filter(cell => cell[1] === layer.layer - 1).map(([x, , z]) => [x, z]); layer.cutCount = layer.cutCells.length; });
      q.answerDrawing = m.layers.map(layer => ({ layer: layer.layer, cells: layer.cutCells }));
    }).model, r), /model: independent cut cells/);
    negative(report, "old-triangle-plane", () => validateModel(altered(q => q.model.plane.constant = 2 * q.model.n).model, r), /model: midpoint plane/);
    negative(report, "same-count-wrong-sum-plane", () => validateModel(altered(q => { q.model.plane.normal = [1, 1, 1]; q.model.plane.constant = 3 * q.model.n; }).model, r), /model: midpoint plane/);
    negative(report, "wrong-source-midpoint", () => validateModel(altered(q => { q.model.points.A[1] -= 0.5; q.model.points.A[2] -= 0.5; }).model, r), /model: source midpoint points/);
    negative(report, "hidden-edge-made-solid", () => validateModel(altered(q => q.model.sectionEdges[0].style = "solid").model, r), /model: explicit six source edges and dashes/);
    negative(report, "visible-only-edges", () => validateModel(altered(q => q.model.sectionEdges = q.model.sectionEdges.filter(edge => edge.style === "solid")).model, r), /model: explicit six source edges and dashes/);
    negative(report, "edge-order-swapped", () => validateModel(altered(q => q.model.sectionEdges.reverse()).model, r), /model: explicit six source edges and dashes/);
    negative(report, "layer-cell-omitted", () => validateModel(altered(q => q.model.layers[0].cutCells.pop()).model, r), /model: layer cut cells/);
    negative(report, "wrong-hard-answer", () => validateContract(altered(q => q.answer[0]--), r, 0, 2), /contract: independent answer/);
    negative(report, "wrong-answer-drawing", () => validateContract(altered(q => q.answerDrawing[0].cells[0] = [0, 2]), r, 0, 2), /contract: exact answer drawing cells/);
    negative(report, "answer-in-student-given", () => validateContract(altered(q => q.studentGiven.answer = q.answer), r, 0, 2), /student: exact answer-safe schema/);
    negative(report, "unlocked-state", () => validateRelease(altered(q => q.originalSourceReleaseStatus = "approved")), /release: lock/);
    negative(report, "publisher-promoted", () => validateRelease(altered(q => q.publisherAnswerVerified = true)), /release: publisherAnswerVerified/);
    negative(report, "false-equality", () => equality("6+7+6=18"), /equation: false equality/);
    negative(report, "arithmetic-injection", () => equality("1+process.exit()=1"), /equation: unsupported token/);
    check(report, "immutable-write-rejection", () => { assert.throws(() => original.model.cutCells.pop(), TypeError); assert.throws(() => { original.answer[0] = 0; }, TypeError); });
  }
  for (const value of [undefined, null, 0, 1, 5, 2.5, "3", NaN, Infinity, [3, 3, 3]]) check(report, `invalid-size/${String(value)}`, () => assert.throws(() => models.build(value), RangeError));
  for (const value of [undefined, null, -1, 3, 1.5, "0", NaN, Infinity]) {
    check(report, `invalid-variant/${String(value)}`, () => assert.throws(() => contracts.generate(id, value, 1), RangeError));
    check(report, `invalid-level/${String(value)}`, () => assert.throws(() => contracts.generate(id, 0, value), RangeError));
  }
  for (const value of [undefined, null, "6-2-u3-e4-exploration", "6-2-u3-e4-mission-3", {}, []]) check(report, `invalid-source/${String(value)}`, () => assert.throws(() => contracts.generate(value, 0, 1), RangeError));
  check(report, "UMD-parity-all-nine-not-browser", () => {
    const context = vm.createContext({ window: {} });
    for (const file of ["source-6-2-plane-cut-models.js", "source-6-2-midpoint-cut-models.js", "source-6-2-midpoint-cut-contracts.js"]) vm.runInContext(fs.readFileSync(path.join(__dirname, file), "utf8"), context);
    for (let variant = 0; variant < 3; variant++) for (let level = 0; level < 3; level++) assert.deepEqual(clone(context.window.HSE_SOURCE_GRADE6_MIDPOINT_CUT_CONTRACTS.generate(id, variant, level)), clone(contracts.generate(id, variant, level)));
  });
  for (const [file, reason] of [["source-6-2-midpoint-cut-models.js", /helpers must load first/], ["source-6-2-midpoint-cut-contracts.js", /models must load first/]]) {
    negative(report, `missing-dependency/${file}`, () => vm.runInNewContext(fs.readFileSync(path.join(__dirname, file), "utf8"), { window: {} }), reason);
  }
  check(report, "inputs-stable-through-run", () => assert.deepEqual(fingerprints(), report.inputs));
  report.failedChecks = report.checks.filter(c => c.status === "fail"); report.status = report.failedChecks.length ? "failed" : "passed-bounded-contracts";
  report.checkCount = report.checks.length; report.passedChecks = report.checkCount - report.failedChecks.length;
  report.questionCases = report.checks.filter(c => c.name.startsWith("contract/") && c.status === "pass").length;
  report.negativeControls = report.checks.filter(c => c.name.startsWith("negative/"));
  const folder = path.join(root, "midpoint-cut-contract-audit"); fs.mkdirSync(folder, { recursive: true });
  fs.writeFileSync(path.join(folder, "results.json"), JSON.stringify(report, null, 2) + "\n"); return report;
}
module.exports = { run, readIndependent, validateModel, validateContract, validateRelease, equality };
if (require.main === module) {
  try { const r = run(); console.log(JSON.stringify({ status: r.status, cases: r.questionCases, modelCells: r.modelCellsCompared, checks: r.checkCount,
    failures: r.failedChecks, report: path.join(root, "midpoint-cut-contract-audit/results.json") })); if (r.failedChecks.length) process.exitCode = 1; }
  catch (error) { console.error(error.stack); process.exitCode = 1; }
}
