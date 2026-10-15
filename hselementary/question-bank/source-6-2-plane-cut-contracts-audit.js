"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const vm = require("node:vm");
const contracts = require("./source-6-2-plane-cut-contracts.js");
const models = require("./source-6-2-plane-cut-models.js");

const evidenceRoot = "E:/Codex/visualizations/2026/08/21/01a0242e-3982-7661-8225-b287285e6742/source-6-2-u3-e4-review-20261014";
const ids = ["6-2-u3-e4-exploration", "6-2-u3-e4-mission-3"];
const pools = [[[3, 2, 2], [4, 3, 3], [5, 4, 4]], [[4, 4, 4], [3, 3, 3], [2, 2, 2]]];
const sourceReview = path.join(evidenceRoot, "concept-source-review");
const learner_stage = "\uCD08\uB4F1 6\uD559\uB144 2\uD559\uAE30 \u00B7 \uD669\uC18C \uC2EC\uD654 \u00B7 \uACF5\uAC04\uACFC \uC785\uCCB4";
const clone = value => JSON.parse(JSON.stringify(value));
const key = cell => cell.join(",");
function sameCells(actual, expected, label) {
  assert(Array.isArray(actual), `${label}: array required`);
  assert.equal(new Set(actual.map(key)).size, actual.length, `${label}: duplicate coordinates`);
  assert.deepEqual(actual.map(key).sort(), expected.map(key).sort(), label);
}
function xmlParser() {
  try { return require("xml-js"); } catch (error) {
    if (error.code !== "MODULE_NOT_FOUND") throw error;
    return require(process.env.HSE_XML_PARSER_PATH || path.join(process.env.USERPROFILE || "",
      ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/xml-js"));
  }
}
function parseMarkup(markup) {
  assert.equal(typeof markup, "string", "markup: string required");
  return xmlParser().xml2js(`<audit-root>${markup}</audit-root>`, { compact: false }).elements[0];
}
function elements(node, name) {
  const result = [];
  for (const child of node.elements || []) {
    if (child.type === "element" && (!name || child.name === name)) result.push(child);
    result.push(...elements(child, name));
  }
  return result;
}
function textContent(node) {
  return (node.elements || []).map(child => child.type === "text" ? child.text : textContent(child)).join("");
}
function equation(expression) {
  // Parse both sides independently; never eval authored arithmetic or trust its RHS.
  assert.equal(typeof expression, "string");
  const tokens = expression.match(/\d+|[+=]/g) || [];
  assert.equal(tokens.join(""), expression.replace(/\s/g, ""), "equation: unsupported token");
  let at = 0;
  function number() {
    assert(/^\d+$/.test(tokens[at] || ""), "equation: integer required");
    const value = Number(tokens[at++]);
    assert(Number.isSafeInteger(value), "equation: unsafe integer");
    return value;
  }
  function sum() {
    const terms = [number()];
    while (tokens[at] === "+") { at++; terms.push(number()); }
    const value = terms.reduce((total, term) => total + term, 0);
    assert(Number.isSafeInteger(value), "equation: unsafe sum");
    return { terms, value };
  }
  const left = sum();
  assert.equal(tokens[at++], "=", "equation: equality required");
  const right = sum();
  assert.equal(at, tokens.length, "equation: trailing tokens");
  assert.equal(left.value, right.value, "equation: false equality");
  return { left, right };
}
const sha = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const readJson = file => JSON.parse(fs.readFileSync(file, "utf8"));
function allCells(dimensions) {
  const [width, height, depth] = dimensions, cells = [];
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) for (let z = 0; z < depth; z++) cells.push([x, y, z]);
  return cells;
}
function fraction(text) {
  assert(/^-?\d+(?:\/\d+)?$/.test(text), "independent: invalid rational");
  const [numerator, denominator = "1"] = text.split("/");
  assert(BigInt(denominator) > 0n);
  return { numerator: BigInt(numerator), denominator: BigInt(denominator) };
}
function assertPlaneFit(plane, fit) {
  for (const [name, numerator] of [["alpha", -plane.normal[0]], ["beta", -plane.normal[2]], ["gamma", plane.rhs]]) {
    const f = fraction(fit[name]);
    assert.equal(BigInt(numerator) * f.denominator, BigInt(plane.normal[1]) * f.numerator, "independent: exact rational plane fit");
  }
  for (const residual of Object.values(fit.residuals)) assert.equal(residual, "0");
}
function validateCalculation(c, dimensions) {
  const full = allCells(dimensions);
  assert.deepEqual(c.dimensionsXYZ, dimensions, "independent: dimensions");
  assert.equal(c.enumeratedCellCount, full.length, "independent: all cells evaluated");
  sameCells(c.allCells.map(row => row.cell), full, "independent: full evaluation list");
  assert(c.allCells.every(row => ["cut", "touch-only", "outside"].includes(row.classification)));
  sameCells(c.cutCells, c.allCells.filter(row => row.classification === "cut").map(row => row.cell), "independent: cut classification list");
  sameCells(c.touchOnlyCells, c.allCells.filter(row => row.classification === "touch-only").map(row => row.cell), "independent: contact classification list");
  assert.equal(c.cutCount, c.cutCells.length); assert.equal(c.touchOnlyCount, c.touchOnlyCells.length);
  assert.equal(c.layers.length, dimensions[1]);
  c.layers.forEach((layer, y) => {
    assert.equal(layer.j, y);
    sameCells(layer.cutCells, c.cutCells.filter(cell => cell[1] === y), "independent: layer cuts");
    sameCells(layer.touchOnlyCells, c.touchOnlyCells.filter(cell => cell[1] === y), "independent: layer touches");
  });
}
function normalizeReference(id, variant, dimensions, points, plane, cuts, touches, origin) {
  const [width, height, depth] = dimensions;
  return { sourceItemId: id, variant, dimensions, width, height, depth, n: height, points, plane, origin,
    auditAllCells: allCells(dimensions), by2dVoxelList: cuts, cutCountByLayer2dPolygons: cuts.length,
    boundaryTouchesExcluded: touches.map(voxel => ({ voxel })),
    layers: Array.from({ length: height }, (_, y) => ({ y: [y, y + 1],
      twoDVoxels: cuts.filter(cell => cell[1] === y), twoDCount: cuts.filter(cell => cell[1] === y).length })) };
}
function readIndependent() {
  if (process.env.HSE_PLANE_CUT_EVIDENCE_DIR) assert.equal(path.resolve(process.env.HSE_PLANE_CUT_EVIDENCE_DIR), path.resolve(evidenceRoot), "evidence: outside authorized root");
  const results = [], source = readJson(path.join(sourceReview, "source-reading.json"));
  const inputFile = path.join(sourceReview, "rectangular-variants-source-reading.json"), input = readJson(inputFile);
  const vertex = readJson(path.join(sourceReview, "rectangular-variants-vertex-results.json"));
  const polygon = readJson(path.join(sourceReview, "rectangular-variants-polygon-results.json"));
  const actual = source.figures.find(f => f.id === "actual-question-ABC");
  const example = source.figures.find(f => f.id === "printed-example");
  assert.equal(source.sourceItemId, ids[0]);
  assert.deepEqual(actual.dimensionsXYZ, pools[0][0], "source: corrected target dimensions");
  assert.deepEqual(actual.points, { A: [3, 2, 2], B: [0, 2, 0], C: [3, 0, 0] }, "source: actual physical points");
  assert.deepEqual(example.dimensionsXYZ, [2, 2, 2], "source: fixed worked example is not the target");
  assert.equal(example.panelReproduction.requiredForWholeConceptItem, true);
  assert.deepEqual(input.sourceReading.studentExamplePanel.dimensionsXYZ, example.dimensionsXYZ);
  assert.equal(input.sourceReading.studentExamplePanel.parameterizeWithTarget, false);
  assert.equal(input.sourceReading.baseReadingSha256, sha(path.join(sourceReview, "source-reading.json")));
  assert.equal(input.sourceReading.sourceImageSha256, sha(path.join(evidenceRoot, "source-pdf-36.png")));
  assert.equal(source.source.sha256, input.sourceReading.sourceImageSha256);
  assert.deepEqual(input.finiteCases.map(c => c.dimensionsXYZ), pools[0]);
  for (const [r, script] of [[vertex, "rectangular-variants-vertices.mjs"], [polygon, "rectangular-variants-polygons.py"]]) {
    assert.equal(r.inputSha256, sha(inputFile), "independent: stale input");
    assert.equal(r.scriptSha256, sha(path.join(sourceReview, script)), "independent: stale method");
    assert.equal(r.sourceSha256, input.sourceReading.sourceImageSha256, "independent: source hash");
    assert.deepEqual(r.cases.map(c => c.id), input.finiteCases.map(c => c.id));
  }
  input.finiteCases.forEach((item, variant) => {
    const a = vertex.cases[variant], b = polygon.cases[variant], dimensions = item.dimensionsXYZ;
    validateCalculation(a, dimensions); validateCalculation(b, dimensions);
    const parameters = { width: dimensions[0], height: dimensions[1], depth: dimensions[2] };
    const points = Object.fromEntries(Object.entries(input.sourceReading.pointTemplate).map(([name, p]) => [name, p.map(v => typeof v === "string" ? parameters[v] : v)]));
    assert.deepEqual(a.points, points, "independent: physical source-template points");
    assert.deepEqual(b.points, points);
    if (variant === 0) assert.deepEqual(points, actual.points);
    assertPlaneFit(a.plane, b.planeFit);
    sameCells(a.cutCells, b.cutCells, "independent: both-method cut sets");
    sameCells(a.touchOnlyCells, b.touchOnlyCells, "independent: both-method contact sets");
    const states = new Map(a.allCells.map(row => [key(row.cell), row.classification]));
    for (const row of b.allCells) assert.equal(row.classification, states.get(key(row.cell)), "independent: every-cell class agrees");
    for (let y = 0; y < dimensions[1]; y++) {
      sameCells(a.layers[y].cutCells, b.layers[y].cutCells, "independent: both-method layer cuts");
      sameCells(a.layers[y].touchOnlyCells, b.layers[y].touchOnlyCells, "independent: both-method layer contacts");
    }
    results.push(normalizeReference(ids[0], variant, dimensions, points,
      { normal: a.plane.normal, constant: 2 * a.plane.rhs, coordinateScale: 2 }, b.cutCells, b.touchOnlyCells, "rectangular-independent-two-methods"));
  });
  // The old cube calculation remains valid only for Mission 3, never for exploration.
  const cube = readJson(path.join(evidenceRoot, "independent/results.json"));
  assert.equal(cube.schema, "independent-cube-plane-review/v1");
  assert.equal(cube.verificationIntegrity.firstMethodSelectionIndependent, true);
  assert.equal(cube.verificationIntegrity.originalSourceLocked, true);
  assert.equal(cube.verificationIntegrity.sourceWritePerformed, false);
  assert.equal(cube.results.length, 3);
  pools[1].forEach((dimensions, variant) => {
    const n = dimensions[0], c = cube.results.find(r => r.n === n);
    assert(c, `independent: missing Mission 3 cube ${n}`);
    assert.equal(c.twoDCubesEvaluated, allCells(dimensions).length);
    assert.equal(c.totalCubes, allCells(dimensions).length);
    assert.equal(c.methodsAgree, true); assert.equal(c.allCoordinatesEqual, true); assert.equal(c.allLayerCoordinatesEqual, true);
    sameCells(c.byVertexSignVoxelList, c.by2dVoxelList, "independent: Mission 3 both methods");
    assert.equal(c.cutCountByLayer2dPolygons, c.by2dVoxelList.length);
    assert.equal(c.cutCountByVertexSigns, c.byVertexSignVoxelList.length);
    const points = Object.fromEntries(Object.entries(cube.coordinateInterpretation.mission3).map(([name, p]) => [name, p.map(v => v * n / 4)]));
    const r = normalizeReference(ids[1], variant, dimensions, points,
      { normal: [1, 1, -1], constant: 2 * n, coordinateScale: 2 }, c.by2dVoxelList, c.boundaryTouchesExcluded.map(t => t.voxel), "Mission-3-retained-cube-two-methods");
    assert.equal(c.layers.length, n);
    c.layers.forEach((layer, y) => {
      assert.deepEqual(layer.y, [y, y + 1]);
      sameCells(layer.twoDVoxels, r.layers[y].twoDVoxels, "independent: Mission 3 layer list");
      sameCells(layer.vertexSignVoxels, layer.twoDVoxels, "independent: Mission 3 layer methods");
      assert.equal(layer.twoDCount, layer.twoDVoxels.length); assert.equal(layer.vertexSignCount, layer.vertexSignVoxels.length);
      assert.equal(layer.coordinateSetsEqual, true);
    });
    for (const control of Object.values(c.negativeControls)) assert.equal(control.mismatchDetected, true);
    results.push(r);
  });
  const verification = readJson(path.join(sourceReview, "rectangular-variants-verification.json"));
  assert.equal(verification.status, "pass-bounded-independent-math");
  assert.equal(verification.inputSha256, sha(inputFile));
  for (const filename of ["rectangular-variants-vertex-results.json", "rectangular-variants-polygon-results.json"]) assert.equal(verification.calculationFiles[filename], sha(path.join(sourceReview, filename)));
  assert.equal(verification.negativeControls.allDetected, true);
  return { results, sourceInterpretation: input.sourceReading.supersededScope,
    sourceReferencePanelRequired: true, fixedWorkedExampleDimensions: example.dimensionsXYZ,
    rectangularFinalComparison: verification.status };
}
function reference(independent, id, variant) {
  assert(ids.includes(id) && Number.isSafeInteger(variant) && variant >= 0 && variant < 3);
  const r = independent.results.find(r => r.sourceItemId === id && r.variant === variant);
  assert(r, "independent: source/variant reference missing");
  return r;
}
function planeResidual(r, point) {
  return r.plane.normal.reduce((sum, coefficient, i) => sum + coefficient * point[i], 0) - r.plane.constant / r.plane.coordinateScale;
}
function near(actual, expected, label) { assert(Math.abs(actual - expected) <= 1e-9, label); }
function samePoints(actual, expected, label) {
  assert.equal(actual.length, expected.length, label);
  const remaining = expected.slice();
  for (const p of actual) {
    assert(p.every(Number.isFinite), label);
    const index = remaining.findIndex(q => q.length === p.length && q.every((v, i) => Math.abs(v - p[i]) <= 1e-9));
    assert(index >= 0, label); remaining.splice(index, 1);
  }
}
function sourceTrace(r, height) {
  const vertices = [[0, 0], [r.width, 0], [r.width, r.depth], [0, r.depth]], points = [];
  const add = p => { if (!points.some(q => q.every((v, i) => Math.abs(v - p[i]) <= 1e-9))) points.push(p); };
  // Intersect the independently fitted plane with the four physical rectangle edges.
  for (let i = 0; i < vertices.length; i++) {
    const a = vertices[i], b = vertices[(i + 1) % vertices.length];
    const fa = planeResidual(r, [a[0], height, a[1]]), fb = planeResidual(r, [b[0], height, b[1]]);
    if (fa === 0) add(a);
    if (fa * fb < 0) { const t = fa / (fa - fb); add(a.map((v, axis) => v + t * (b[axis] - v))); }
  }
  return points;
}
function validatePlaneCellSets(r) {
  const cuts = [], touches = [];
  for (const cell of r.auditAllCells) {
    const values = [];
    for (const dx of [0, 1]) for (const dy of [0, 1]) for (const dz of [0, 1]) {
      values.push(planeResidual(r, [cell[0] + dx, cell[1] + dy, cell[2] + dz]));
    }
    const min = Math.min(...values), max = Math.max(...values);
    if (min < 0 && max > 0) cuts.push(cell);
    else if (min <= 0 && max >= 0) touches.push(cell);
  }
  sameCells(cuts, r.by2dVoxelList, "independent: physical-plane exhaustive cuts");
  sameCells(touches, r.boundaryTouchesExcluded.map(t => t.voxel), "independent: physical-plane exhaustive contacts");
}
function referenceSummary(independent) {
  return independent.results.map(r => ({ sourceItemId: r.sourceItemId, variant: r.variant, dimensions: r.dimensions,
    origin: r.origin, physicalPoints: r.points, doubledCoordinatePlane: r.plane, allCells: r.auditAllCells.length,
    cutCount: r.by2dVoxelList.length, touchCount: r.boundaryTouchesExcluded.length,
    layerCutCountsBottomToTop: r.layers.map(layer => layer.twoDCount),
    layerTouchCountsBottomToTop: r.layers.map((_, y) => r.boundaryTouchesExcluded.filter(t => t.voxel[1] === y).length) }));
}
function validateModel(m, r) {
  assert.deepEqual(m.dimensions, r.dimensions, "model: actual dimensions");
  for (const name of ["width", "height", "depth", "n"]) assert.equal(m[name], r[name], `model: ${name}`);
  assert.deepEqual(m.points, r.points, "model: source incidences");
  assert.deepEqual(m.plane, r.plane, "model: actual plane");
  for (const point of Object.values(r.points)) assert.equal(planeResidual(r, point), 0, "model: source point plane incidence");
  sameCells(m.cubes, r.auditAllCells, "model: all voxels");
  sameCells(m.cutCells, r.by2dVoxelList, "model: cut voxels");
  sameCells(m.touchCells, r.boundaryTouchesExcluded.map(t => t.voxel), "model: touch voxels");
  assert.equal(m.cutCount, r.cutCountByLayer2dPolygons, "model: cut count");
  assert.equal(m.touchCount, r.boundaryTouchesExcluded.length, "model: touch count");
  assert.equal(m.layers.length, r.height, "model: all layers");
  m.layers.forEach((layer, y) => {
    assert.equal(layer.layer, y + 1, "model: layer label");
    const ref = r.layers[y];
    sameCells(layer.cells, r.auditAllCells.filter(c => c[1] === y).map(([x, , z]) => [x, z]), "model: layer cells");
    sameCells(layer.cutCells, ref.twoDVoxels.map(([x, , z]) => [x, z]), "model: layer cuts");
    const touches = r.boundaryTouchesExcluded.filter(t => t.voxel[1] === y).map(t => [t.voxel[0], t.voxel[2]]);
    sameCells(layer.touchCells, touches, "model: layer touches");
    assert.equal(layer.cutCount, ref.twoDCount, "model: layer cut count");
    assert.equal(layer.touchCount, touches.length, "model: layer touch count");
    assert.equal(layer.slabTraces.length, 2, "model: slab traces");
    layer.slabTraces.forEach((trace, offset) => {
      const height = y + offset;
      samePoints(trace, sourceTrace(r, height), "model: slab endpoints");
      for (const [x, z] of trace) {
        assert(x >= 0 && x <= r.width && z >= 0 && z <= r.depth, "model: trace outside physical rectangle");
        near(planeResidual(r, [x, height, z]), 0, "model: endpoint off plane");
      }
    });
  });
  sameCells(m.planeSection, Object.values(m.points), "model: plane section");
  assert.deepEqual(m.directions, { x: "right", y: "up", z: "back" }, "model: source view axes");
  assert.equal(m.boundaryContactIsCut, false, "model: boundary definition");
}
function validateRelease(q) {
  for (const subject of [q, q.model]) {
    assert.equal(subject.sourceExact, false, "release: sourceExact");
    assert.equal(subject.originalSourceReleaseStatus, "locked", "release: original lock");
    for (const name of ["publisherAnswerVerified", "humanApproved", "learnerReleaseVerified"]) assert.equal(subject[name], false, `release: ${name}`);
    for (const name of ["officialAnswerVerified", "handwrittenAnswerVerified", "teacherReleaseVerified"]) {
      if (Object.hasOwn(subject, name)) assert.equal(subject[name], false, `release: ${name}`);
    }
  }
  assert.equal(q.requiresOriginalReview, true, "release: review required");
  assert.equal(q.difficultyDesign.empiricallyCalibrated, false, "release: calibration");
  assert.equal(q.sourceReferencePanelRequired, q.sourceItemId === ids[0], "release: worked reference panel requirement");
  assert.equal(q.sourceReferencePanelImplemented, q.sourceReferencePanelRequired, "release: required source panel implementation");
}
function validateStudentGiven(q) {
  assert.deepEqual(q.studentGiven, { promptText: q.promptText, dimensions: q.model.dimensions, points: q.model.points,
    responseLayers: q.responseLayers }, "student: unexpected answer-bearing fields");
  const tree = parseMarkup(q.promptText);
  assert.equal(elements(tree).length, 0, "student: text prompt must contain no markup");
  assert(!/[=]|\d\s*[+]\s*\d/.test(q.promptText), "student: equation leak");
  assert(!/\uCE35\uBCC4 \uAC1C\uC218|\uC815\uB2F5\uC740|\uC804\uCCB4 \uAC1C\uC218\uB294/.test(q.promptText), "student: count leak");
}
function validateAnswers(q, r, id, variant, level) {
  assert.equal(q.sourceItemId, id); assert.equal(q.variant, variant); assert.equal(q.level, level);
  const requested = level === 0 ? [r.n] : Array.from({ length: r.n }, (_, i) => r.n - i);
  assert.deepEqual(q.requestedLayers, requested, "contract: requested layers");
  const layers = r.layers.filter(layer => requested.includes(layer.y[0] + 1));
  const cut = layers.reduce((s, layer) => s + layer.twoDCount, 0), touch = r.boundaryTouchesExcluded.length;
  assert.deepEqual(q.answer, level === 2 ? [cut, touch] : cut, "contract: requested answer");
  assert.deepEqual(q.answerOrder, level === 2 ? ["cut", "boundary-touch"] : ["cut"], "contract: answer order");
  assert.equal(q.answerUnit, "\uAC1C");
  assert.equal(q.answerDrawing.length, layers.length, "contract: drawing layers");
  q.answerDrawing.forEach((drawing, index) => {
    assert.equal(drawing.layer, layers[index].y[0] + 1, "contract: drawing label");
    sameCells(drawing.cells, layers[index].twoDVoxels.map(([x, , z]) => [x, z]), "contract: exact drawing cells");
  });
  const spans = elements(parseMarkup(q.solutionText), "span");
  assert.deepEqual(spans.map(textContent), q.solutionEquations.map(s => textContent(parseMarkup(s))), "equation: solution coverage");
  const sums = [layers.slice().reverse().map(layer => layer.twoDCount)];
  if (level === 2) sums.push(requested.map(layer => r.boundaryTouchesExcluded.filter(t => t.voxel[1] === layer - 1).length));
  assert.equal(q.solutionEquations.length, sums.length, "equation: count");
  q.solutionEquations.forEach((markup, index) => {
    const tree = parseMarkup(markup), nodes = elements(tree);
    assert.equal(nodes.length, 1, "equation: wrapper");
    assert.equal(nodes[0].name, "span");
    assert.equal(nodes[0].attributes.class, "math-inline-expression");
    const result = equation(textContent(nodes[0]));
    assert.deepEqual(result.left.terms, sums[index], "equation: independent layer terms");
    assert.equal(result.right.value, index === 0 ? cut : touch, "equation: independent total");
  });
  assert.equal(q.sourceConditionsClarified, true);
  assert.equal(q.conditionScope, "positive-volume-cut-only");
  assert.equal(q.requestedAnswerUnique, true);
  assert.equal(q.difficultyDesign.mode, ["easy", "source", "hard"][level]);
  return { answer: q.answer, equations: spans.map(textContent) };
}
function expectedAnswer(r, level) {
  const cut = level === 0 ? r.layers[r.height - 1].twoDCount : r.by2dVoxelList.length;
  return level === 2 ? [cut, r.boundaryTouchesExcluded.length] : cut;
}
function validateResponse(q, id, level) {
  const drawing = id === ids[1];
  assert.equal(q.requiresLayerDrawing, drawing, "response: drawing flag");
  assert.deepEqual(q.responseLayers, drawing ? q.requestedLayers : [], "response: drawing layers");
  assert.equal(q.learner_stage, learner_stage, "learner-fit: exact stage");
  assert(q.promptText.includes("\uB0B4\uBD80\uAC00 \uC798\uB9B0"), "response: interior definition missing");
  assert(q.promptText.includes("\uB9E8 \uC704\uCE35") === (level === 0), "response: easy top scope");
  if (drawing) {
    assert(/\uD45C\uC2DC|\uADF8\uB9AC|\uADF8\uB824|\uB098\uD0C0\uB0B4/.test(q.promptText), "response: Mission 3 missing explicit layer drawing instruction");
    if (level > 0) assert(q.promptText.includes("\uAC01 \uCE35"), "response: Mission 3 missing each-layer scope");
  } else assert(!/\uD45C\uC2DC|\uADF8\uB9AC|\uADF8\uB824|\uB098\uD0C0\uB0B4/.test(q.promptText), "response: exploration must be numeric only");
  if (level === 2) assert(q.promptText.includes("\uB2FF\uAE30\uB9CC"), "response: hard contact question missing");
}
function assertFrozen(value) {
  if (value && typeof value === "object") {
    assert(Object.isFrozen(value), "immutability: object not frozen");
    Object.values(value).forEach(assertFrozen);
  }
}
function inputHashes(extra = []) {
  const files = ["source-6-2-plane-cut-models.js", "source-6-2-plane-cut-reference.js", "source-6-2-plane-cut-contracts.js",
    "source-6-2-plane-cut-contracts-audit.js", "source-6-2-plane-cut-presentation-audit.js", ...extra].map(f => path.join(__dirname, f));
  files.push(path.join(evidenceRoot, "independent/results.json"), path.join(evidenceRoot, "independent/cube-plane-independent.js"),
    path.join(evidenceRoot, "source-pdf-36.png"), path.join(evidenceRoot, "source-pdf-37.png"));
  for (const file of ["source-reading.json", "rectangular-variants-source-reading.json", "rectangular-variants-vertex-results.json",
    "rectangular-variants-polygon-results.json", "rectangular-variants-vertices.mjs", "rectangular-variants-polygons.py",
    "rectangular-variants-verification.json"]) files.push(path.join(sourceReview, file));
  return files.map(file => ({ file, sha256: sha(file) }));
}
function check(report, name, fn) {
  try { const detail = fn(); report.checks.push({ name, status: "pass", ...(detail === undefined ? {} : { detail }) }); }
  catch (error) { report.checks.push({ name, status: "fail", error: error.message }); }
}
function negative(report, name, fn, expected) {
  check(report, `negative/${name}`, () => { assert.throws(fn, expected); return { rejected: true, expected: String(expected) }; });
}
function baseReport(kind, hashes) {
  return { schema: "plane-cut-bounded-audit/v2", kind, createdAt: new Date().toISOString(),
    scope: "local-contract-and-markup-only", inputs: hashes, checks: [], cases: [],
    skills: [
      { name: "evidence-gated-learning-pipeline", path: "C:/Users/user/.agents/skills/evidence-gated-learning-pipeline/SKILL.md",
        reason: "Independent mathematics, source drawing response, student/teacher boundary and locked approval states" },
      { name: "audit-verify-explain-grade-5", path: "E:/Codex/skills/audit-verify-explain-grade-5/SKILL.md",
        reason: "Read-only parent API audit with reproducible checks and explicit untested rendering scope" }
    ],
    commonWorkflowVersion: "2026-10-14.r6", learner_stage,
    learnerFitCriteria: ["language", "representations", "prerequisites", "reasoning-load", "response-mode"],
    learnerFitStatus: "technical-scope-only-human-review-pending", sourceExact: false,
    sourceReferencePanelImplemented: true, wholeOriginalSourceReviewVerified: false,
    wholeOriginalComplete: false,
    pendingSourceGates: [{ id: "original-worked-reference-panel", status: "pending", sourceItemId: ids[0],
      reason: "The fixed original 2x2x2 worked example panel is implemented; its independent source/render audit and actual bank integration are separate required gates" }],
    originalSourceReleaseStatus: "locked", officialAnswerVerified: false, publisherAnswerVerified: false,
    humanApproved: false, learnerReleaseVerified: false, browserVerified: false, a4Verified: false,
    publicApproval: false, mainChanged: false, deployed: false, productionFilesModifiedByWorker: false };
}
function finish(report, filename) {
  const after = inputHashes(report.kind === "presentation" ? ["source-6-2-plane-cut-presentation.js"] : []);
  check(report, "inputs-stable-through-run", () => assert.deepEqual(after, report.inputs));
  report.failedChecks = report.checks.filter(c => c.status === "fail");
  const missingDrawing = report.failedChecks.filter(c => c.error.includes("Mission 3 missing explicit layer drawing instruction"));
  report.parentFindings = missingDrawing.length ? [{
    ownerFile: "hselementary/question-bank/source-6-2-plane-cut-contracts.js",
    locator: "generate: level===0 promptText branch",
    finding: "Mission 3 easy requiresLayerDrawing=true and has a top-layer blank response grid, but the instruction asks only for a numeric count",
    affectedCases: missingDrawing.map(c => c.name),
    nextActionForParent: "Explicitly ask for marking the top-layer drawing as well as its count; retain source/hard all-layer drawing requirements",
    productionChangePerformedByWorker: false
  }] : [];
  report.status = report.failedChecks.length ? "failed" : "passed";
  report.technicalStatus = report.status;
  report.wholeOriginalStatus = "pending-independent-reference-panel-render-review-and-bank-integration";
  report.checkCount = report.checks.length;
  report.passedChecks = report.checkCount - report.failedChecks.length;
  report.negativeControls = report.checks.filter(c => c.name.startsWith("negative/"));
  const folder = path.join(evidenceRoot, "contract-audit");
  fs.mkdirSync(folder, { recursive: true });
  fs.writeFileSync(path.join(folder, filename), JSON.stringify(report, null, 2) + "\n");
  return report;
}
function run() {
  const report = baseReport("contracts", inputHashes());
  const independent = readIndependent();
  report.sourceInterpretation = independent.sourceInterpretation;
  report.independentComparison = independent.rectangularFinalComparison;
  report.independentReferences = referenceSummary(independent);
  check(report, "source-read-plane-versus-independent-all-cell-lists", () => {
    independent.results.forEach(validatePlaneCellSets);
    return { finiteSolids: independent.results.length, cells: independent.results.reduce((s, r) => s + r.auditAllCells.length, 0),
      sourceOfSelection: "supplied vertex-sign and polygon results; no parent selection reused" };
  });
  assert.deepEqual(contracts.sourceItemIds, ids);
  for (const id of ids) for (let variant = 0; variant < 3; variant++) for (let level = 0; level < 3; level++) {
    const q = contracts.generate(id, variant, level), r = reference(independent, id, variant), name = `${id}/v${variant}/l${level}`;
    report.cases.push({ id, variant, level, dimensions: r.dimensions, independentReference: r.origin, promptText: q.promptText,
      requiresLayerDrawing: q.requiresLayerDrawing, responseLayers: q.responseLayers,
      expectedAnswer: expectedAnswer(r, level) });
    check(report, `${name}/full-model`, () => validateModel(q.model, r));
    check(report, `${name}/answers-equations`, () => validateAnswers(q, r, id, variant, level));
    check(report, `${name}/response-mode`, () => validateResponse(q, id, level));
    check(report, `${name}/student-boundary`, () => validateStudentGiven(q));
    check(report, `${name}/release`, () => validateRelease(q));
    check(report, `${name}/immutable`, () => assertFrozen(q));
  }
  const original = contracts.generate(ids[0], 0, 2), r = reference(independent, ids[0], 0);
  function altered(mutate) { const q = clone(original); mutate(q); return q; }
  negative(report, "removed-voxel", () => validateModel(altered(q => q.model.cubes.pop()).model, r), /model: all voxels/);
  negative(report, "changed-plane", () => validateModel(altered(q => q.model.plane.constant += 2).model, r), /model: actual plane/);
  negative(report, "superseded-cube-target-mapping", () => validateModel(altered(q => q.model.dimensions = [2, 2, 2]).model, r), /model: actual dimensions/);
  negative(report, "moved-cut-same-count", () => validateModel(altered(q => q.model.cutCells[0] = [0, 0, 0]).model, r), /model: cut voxels/);
  negative(report, "wrong-layer-label", () => validateModel(altered(q => q.model.layers[0].layer = 2).model, r), /model: layer label/);
  negative(report, "reversed-hard-answer", () => validateAnswers(altered(q => q.answer.reverse()), r, ids[0], 0, 2), /contract: requested answer/);
  negative(report, "moved-answer-drawing", () => validateAnswers(altered(q => q.answerDrawing[0].cells[0] = [0, 0]), r, ids[0], 0, 2), /contract: exact drawing cells/);
  negative(report, "true-equality-with-wrong-layer-terms", () => validateAnswers(altered(q => {
    const old = q.solutionEquations[0], text = textContent(parseMarkup(old)), parsed = equation(text), terms = parsed.left.terms.slice();
    assert(terms.length > 1 && terms[1] > 0);
    terms[0]++; terms[1]--;
    const changed = old.replace(text, `${terms.join("+")}=${parsed.right.value}`);
    assert.notEqual(old, changed);
    q.solutionEquations[0] = changed; q.solutionText = q.solutionText.replace(old, changed);
  }), r, ids[0], 0, 2), /equation: independent layer terms/);
  negative(report, "candidate-answer-in-student-given", () => validateStudentGiven(altered(q => q.studentGiven.answer = q.answer)), /student: unexpected answer/);
  negative(report, "unlocked-original", () => validateRelease(altered(q => q.originalSourceReleaseStatus = "approved")), /release: original lock/);
  negative(report, "missing-required-source-panel", () => validateRelease(altered(q => q.sourceReferencePanelImplemented = false)), /release: required source panel implementation/);
  negative(report, "false-equality", () => equation("7+5+3+1=15"), /equation: false equality/);
  negative(report, "expression-injection", () => equation("1+process.exit()=1"), /equation: unsupported token/);
  const invalid = [undefined, null, -1, 3, 1.5, "0", NaN, Infinity, {}, []];
  for (const value of invalid) {
    check(report, `invalid-variant/${String(value)}`, () => assert.throws(() => contracts.generate(ids[0], value, 1), RangeError));
    check(report, `invalid-level/${String(value)}`, () => assert.throws(() => contracts.generate(ids[0], 0, value), RangeError));
  }
  for (const value of [undefined, null, "other", {}, []]) check(report, `invalid-source/${String(value)}`, () => assert.throws(() => contracts.generate(value, 0, 1), RangeError));
  for (const value of [undefined, null, 0, 1, 5, 2.5, "2", NaN]) check(report, `invalid-size/${String(value)}`, () => assert.throws(() => models.build(value), RangeError));
  for (const dimensions of [[3, 2], [3, 2, 2, 1], [2, 3, 2], [3, 2, 3], [6, 5, 5], ["3", 2, 2], [3, 2.5, 2]]) {
    check(report, `invalid-dimensions/${JSON.stringify(dimensions)}`, () => assert.throws(() => models.build(dimensions), RangeError));
  }
  for (const points of [undefined, null, [], [[0, 0, 0]], [[0, 0], [1, 0, 0], [0, 1, 0]],
    [[0, 0, 0], [1.5, 0, 0], [0, 1, 0]], [[0, 0, 0], [1, 1, 1], [2, 2, 2]]]) {
    check(report, `invalid-plane-points/${JSON.stringify(points)}`, () => assert.throws(() => models.planeFromPoints(points), RangeError));
  }
  check(report, "frozen-mutation-rejection", () => {
    assert.throws(() => original.answer.reverse(), TypeError);
    assert.throws(() => original.model.cubes.pop(), TypeError);
    assert.throws(() => { original.studentGiven.answer = 4; }, TypeError);
  });
  check(report, "valid-equality-parser-controls", () => { equation("7+5+3+1=16"); equation("3=1+2"); });
  const context = vm.createContext({});
  for (const file of ["source-6-2-plane-cut-models.js", "source-6-2-plane-cut-contracts.js"]) vm.runInContext(fs.readFileSync(path.join(__dirname, file), "utf8"), context);
  check(report, "umd-vm-parity-18-not-browser", () => {
    for (const c of report.cases) assert.deepEqual(clone(context.HSE_SOURCE_GRADE6_PLANE_CUT_CONTRACTS.generate(c.id, c.variant, c.level)), clone(contracts.generate(c.id, c.variant, c.level)));
  });
  return finish(report, "contracts-audit.json");
}
module.exports = { evidenceRoot, ids, clone, key, sameCells, samePoints, near, planeResidual, sourceTrace, expectedAnswer, parseMarkup, elements, textContent, equation,
  referenceSummary,
  readIndependent, reference, validateModel, validateAnswers, validateResponse, validateStudentGiven,
  validateRelease, inputHashes, check, negative, baseReport, finish, run };
if (require.main === module) {
  try { const report = run(); console.log(JSON.stringify({ status: report.status, cases: report.cases.length,
    checks: report.checkCount, failures: report.failedChecks, report: path.join(evidenceRoot, "contract-audit/contracts-audit.json") }));
    if (report.status !== "passed") process.exitCode = 1;
  } catch (error) { console.error(error.stack); process.exitCode = 1; }
}
