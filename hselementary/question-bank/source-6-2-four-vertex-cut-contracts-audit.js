"use strict";
const assert = require("node:assert/strict"), fs = require("node:fs"), path = require("node:path"), vm = require("node:vm"), crypto = require("node:crypto");
const models = require("./source-6-2-four-vertex-cut-models.js"), contracts = require("./source-6-2-four-vertex-cut-contracts.js");
const id = "6-2-u3-e4-example-2", pool = [4, 3, 5], labels = ["\uAC00", "\uB098", "\uB2E4", "\uB77C"];
const cycle = [labels[0], labels[1], labels[3], labels[2]];
const owned = ["source-6-2-four-vertex-cut-models.js", "source-6-2-four-vertex-cut-contracts.js", "source-6-2-four-vertex-cut-contracts-audit.js"];
const helperFile = "source-6-2-plane-cut-models.js";
const clone = value => JSON.parse(JSON.stringify(value));
const sha = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const fingerprint = files => files.map(file => ({ file, sha256: sha(file) }));
const keys = cells => cells.map(cell => cell.join(",")).sort();
function sameCells(actual, expected, context) {
  assert(Array.isArray(actual), context); assert.equal(new Set(keys(actual)).size, actual.length, `${context}: duplicate cell`);
  assert.deepEqual(keys(actual), keys(expected), context);
}
function check(report, name, fn) {
  try { const detail = fn(); report.checks.push({ name, status: "pass", ...(detail === undefined ? {} : { detail }) }); }
  catch (error) { report.checks.push({ name, status: "fail", error: error.message }); }
}
function paths(env = process.env) {
  const root = env.HSE_FOUR_VERTEX_SOURCE_EVIDENCE_DIR;
  assert(root && path.isAbsolute(root) && path.parse(root).root.toLowerCase() === "e:\\", "Set HSE_FOUR_VERTEX_SOURCE_EVIDENCE_DIR to an explicit absolute E: review root");
  const resolved = path.resolve(root), repository = path.resolve(__dirname, "../.."), relative = path.relative(repository, resolved);
  assert(relative && (relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)), "Evidence root must be outside the repository");
  const output = path.join(resolved, "four-vertex-models");
  if (env.HSE_SCREENSHOT_DIR) assert.equal(path.resolve(env.HSE_SCREENSHOT_DIR).toLowerCase(), output.toLowerCase(), "Output is bounded to four-vertex-models under the review root");
  return { root: resolved, design: path.join(resolved, "four-vertex-design"), output };
}
function expectedPoints(n, reading) {
  assert.deepEqual(reading.dimensionsXYZ, [4, 4, 4]);
  const gap = reading.dimensionsXYZ[2] - reading.points.ga[2];
  assert.equal(gap, 1);
  return { [labels[0]]: [0, n, n - gap], [labels[1]]: [n, n, n - gap], [labels[2]]: [0, 0, 0], [labels[3]]: [n, 0, 0] };
}
const abs = n => n < 0n ? -n : n;
const gcd = (a, b) => b ? gcd(b, a % b) : abs(a);
function fraction(n, d = 1n) {
  n = BigInt(n); d = BigInt(d); assert.notEqual(d, 0n);
  if (d < 0n) { n = -n; d = -d; }
  const divisor = gcd(n, d); return { n: n / divisor, d: d / divisor };
}
const compare = (a, b) => a.n * b.d - b.n * a.d;
const multiply = (a, b) => fraction(a.n * b.n, a.d * b.d);
const fractionText = a => a.d === 1n ? String(a.n) : `${a.n}/${a.d}`;
function parseFraction(text) {
  assert.match(String(text), /^-?\d+(?:\/\d+)?$/);
  const [n, d = "1"] = String(text).split("/"); return fraction(n, d);
}
const numeric = a => Number(a.n) / Number(a.d);
function independentPlane(points) {
  const p = points[labels[2]].map(BigInt), q = points[labels[3]].map(BigInt), r = points[labels[0]].map(BigInt);
  const u = q.map((value, axis) => value - p[axis]), v = r.map((value, axis) => value - p[axis]);
  let normal = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
  const divisor = normal.reduce((common, coefficient) => gcd(common, coefficient), 0n); assert(divisor > 0n, "Unique nondegenerate plane");
  normal = normal.map(coefficient => coefficient / divisor);
  if (normal.find(coefficient => coefficient !== 0n) < 0n) normal = normal.map(coefficient => -coefficient);
  const rhs = normal.reduce((sum, coefficient, axis) => sum + coefficient * p[axis], 0n);
  for (const point of Object.values(points)) assert.equal(normal.reduce((sum, coefficient, axis) => sum + coefficient * BigInt(point[axis]), 0n), rhs);
  return { normal: normal.map(Number), rhs: Number(rhs) };
}
function oracleResult(method, n, points, allCells, plane) {
  const cutCells = allCells.filter(cell => cell.classification === "cut").map(row => row.cell);
  const touchCells = allCells.filter(cell => cell.classification === "touch-only").map(row => row.cell);
  const outsideCells = allCells.filter(cell => cell.classification === "outside").map(row => row.cell);
  const layers = Array.from({ length: n }, (_, y) => ({ layer: y + 1,
    cutCells: cutCells.filter(cell => cell[1] === y), touchCells: touchCells.filter(cell => cell[1] === y) }));
  return { method, n, points, ...(plane ? { plane } : {}), enumeratedCells: allCells.length, cutCells, touchCells, outsideCells,
    cutCount: cutCells.length, touchCount: touchCells.length, layers, allCells };
}
function vertexOracle(n, points) {
  const plane = independentPlane(points), allCells = [];
  for (let x = 0; x < n; x++) for (let y = 0; y < n; y++) for (let z = 0; z < n; z++) {
    const signs = [];
    for (const xx of [x, x + 1]) for (const yy of [y, y + 1]) for (const zz of [z, z + 1]) {
      signs.push(plane.normal[0] * xx + plane.normal[1] * yy + plane.normal[2] * zz - plane.rhs);
    }
    const min = Math.min(...signs), max = Math.max(...signs);
    allCells.push({ cell: [x, y, z], classification: min < 0 && max > 0 ? "cut" : min <= 0 && max >= 0 ? "touch-only" : "outside", signs });
  }
  return oracleResult("independent-BigInt-plane-and-eight-vertex-signs", n, points, allCells, plane);
}
function clipOracle(n, points) {
  // Clip the observed bottom-to-top yz segment, without a plane or vertex-sign input.
  const bottom = points[labels[2]], top = points[labels[0]], rightBottom = points[labels[3]], rightTop = points[labels[1]];
  assert.deepEqual(bottom, [0, 0, 0]); assert.deepEqual(rightBottom, [n, 0, 0]);
  assert.deepEqual(rightTop.slice(1), top.slice(1)); assert.equal(top[0], 0);
  const dy = top[1], dz = top[2], allCells = []; assert(dy > 0 && dz > 0);
  for (let y = 0; y < n; y++) for (let z = 0; z < n; z++) {
    const bounds = [fraction(0), fraction(y, dy), fraction(z, dz)], upper = [fraction(1), fraction(y + 1, dy), fraction(z + 1, dz)];
    const low = bounds.reduce((a, b) => compare(a, b) > 0n ? a : b), high = upper.reduce((a, b) => compare(a, b) < 0n ? a : b);
    const order = compare(low, high), classification = order < 0n ? "cut" : order === 0n ? "touch-only" : "outside";
    for (let x = 0; x < n; x++) {
      const endpoint = (xx, t) => [String(xx), fractionText(multiply(fraction(dy), t)), fractionText(multiply(fraction(dz), t))];
      const polygonXYZExact = order > 0n ? [] : order === 0n ? [endpoint(x, low), endpoint(x + 1, low)] :
        [endpoint(x, low), endpoint(x + 1, low), endpoint(x + 1, high), endpoint(x, high)];
      allCells.push({ cell: [x, y, z], classification, tIntervalExact: [fractionText(low), fractionText(high)], polygonXYZExact,
        polygonXZExact: polygonXYZExact.map(([xx, , zz]) => [xx, zz]) });
    }
  }
  return oracleResult("independent-exact-rational-yz-segment-rectangle-clipping-and-x-extrusion", n, points, allCells);
}
function near(actual, expected, context) {
  assert(Number.isFinite(actual) && Math.abs(actual - expected) < 1e-10, `${context}: ${actual} != ${expected}`);
}
function sameVertices(actual, expected, context) {
  assert.equal(actual.length, expected.length, context);
  const unused = expected.map(point => point.slice());
  for (const point of actual) {
    assert(point.every(Number.isFinite), context);
    const index = unused.findIndex(candidate => candidate.length === point.length && candidate.every((coordinate, axis) => Math.abs(point[axis] - coordinate) < 1e-10));
    assert(index >= 0, context); unused.splice(index, 1);
  }
}
function frozenTree(value, seen = new Set()) {
  if (!value || typeof value !== "object" || seen.has(value)) return;
  seen.add(value); assert(Object.isFrozen(value), "Deep immutable data"); Object.values(value).forEach(child => frozenTree(child, seen));
}
function validateModel(model, oracle) {
  const { n, points, plane } = oracle;
  assert.equal(model.n, n); assert.equal(model.width, n); assert.equal(model.height, n); assert.equal(model.depth, n);
  assert.deepEqual(model.dimensions, [n, n, n]); assert.deepEqual(model.points, points);
  assert.deepEqual(model.plane.normal, plane.normal); assert.equal(model.plane.constant, plane.rhs * 2); assert.equal(model.plane.coordinateScale, 2);
  assert.equal(model.plane.normal[0], 0, "Source plane is independent of x");
  assert.deepEqual(model.directions, { x: "right", y: "up", z: "back" }); assert.equal(model.boundaryContactIsCut, false);
  sameCells(model.cubes, oracle.allCells.map(row => row.cell), "all cubes");
  sameCells(model.cutCells, oracle.cutCells, "cut cells"); sameCells(model.touchCells, oracle.touchCells, "touch-only cells");
  sameCells(model.cutCells3D, oracle.cutCells, "cutCells3D alias"); sameCells(model.touchCells3D, oracle.touchCells, "touchCells3D alias");
  assert.equal(model.cutCount, oracle.cutCount); assert.equal(model.touchCount, oracle.touchCount); assert.equal(model.layers.length, n);
  model.layers.forEach((row, index) => {
    const expected = oracle.layers[index]; assert.equal(row.layer, index + 1);
    const all2D = Array.from({ length: n }, (_, x) => Array.from({ length: n }, (_, z) => [x, z])).flat();
    sameCells(row.cells, all2D, "grid cells"); sameCells(row.cells2D, all2D, "cells2D alias");
    sameCells(row.cutCells, expected.cutCells.map(([x, , z]) => [x, z]), "layer cut cells");
    sameCells(row.touchCells, expected.touchCells.map(([x, , z]) => [x, z]), "layer touch cells");
    assert.equal(row.cutCount, expected.cutCells.length); assert.equal(row.touchCount, expected.touchCells.length);
    assert.equal(row.slabTraces.length, 2);
    row.slabTraces.forEach((trace, boundary) => {
      const y = index + boundary, z = numeric(fraction((n - 1) * y, n));
      sameVertices(trace, [[0, z], [n, z]], "fixed-y trace endpoints");
      trace.forEach(([x, zz]) => near(plane.normal[0] * x + plane.normal[1] * y + plane.normal[2] * zz, plane.rhs, "trace on actual plane"));
    });
  });
  const expectedEdges = cycle.map((from, index) => ({ from, to: cycle[(index + 1) % 4], a: points[from], b: points[cycle[(index + 1) % 4]], style: "dashed" }));
  assert.deepEqual(model.sectionEdges, expectedEdges, "Four source-defined dashed edges, in observed order");
  sameVertices(model.planeSection, cycle.map(label => points[label]), "full section vertices");
  const edgeKey = (a, b) => [a.join(","), b.join(",")].sort().join("|");
  assert.deepEqual(model.planeSection.map((a, index) => edgeKey(a, model.planeSection[(index + 1) % 4])).sort(),
    expectedEdges.map(edge => edgeKey(edge.a, edge.b)).sort(), "Section polygon must follow its boundary, not a crossed vertex order");
  assert.equal(model.sourceReferenceSize, 4); assert.equal(model.sourceGeometryMatches, n === 4);
  assert.equal(model.variantDesignStatus, "authored-candidate-pending-adoption"); assert.equal(model.originalSourceReleaseStatus, "locked");
  for (const flag of ["sourceExact", "publisherAnswerVerified", "humanApproved", "learnerReleaseVerified", "empiricallyCalibrated"]) assert.equal(model[flag], false);
  return { n, cells: n ** 3, cut: model.cutCount, touch: model.touchCount, layers: model.layers.map(row => row.cutCount) };
}
function parseEquation(markup) {
  const match = /^<span class="math-inline-expression" style="white-space:nowrap;color:#000">(\d+(?:\+\d+)*)=(\d+)<\/span>$/.exec(markup);
  assert(match, "Restricted equality grammar"); const terms = match[1].split("+").map(Number), total = Number(match[2]);
  assert.equal(terms.reduce((sum, term) => sum + term, 0), total, "Independently parsed equality"); return { terms, total };
}
function validateQuestion(q, oracle, variant, level) {
  validateModel(q.model, oracle);
  assert.equal(q.sourceItemId, id); assert.equal(q.variant, variant); assert.equal(q.level, level);
  assert.equal(q.model.sourceItemId, id); assert.equal(q.model.variant, variant);
  assert.deepEqual(q.model.sourceRef, { pdfPage: 36, printedPage: 38, example: "4-2" });
  assert.equal(q.learner_stage, "\uCD08\uB4F1 6\uD559\uB144 2\uD559\uAE30 \u00B7 \uD669\uC18C \uC2EC\uD654 \u00B7 \uACF5\uAC04\uACFC \uC785\uCCB4");
  const requested = level === 0 ? [oracle.n] : Array.from({ length: oracle.n }, (_, index) => oracle.n - index);
  const selected = oracle.layers.filter(row => requested.includes(row.layer));
  const count = selected.reduce((sum, row) => sum + row.cutCells.length, 0), answer = level === 2 ? [count, oracle.touchCount] : count;
  assert.deepEqual(q.answer, answer); assert.deepEqual(q.requestedLayers, requested); assert.deepEqual(q.responseLayers, []); assert.equal(q.requiresLayerDrawing, false);
  assert.deepEqual(q.answerOrder, level === 2 ? ["cut", "boundary-touch"] : ["cut"]); assert.equal(q.answerUnit, "\uAC1C");
  assert.deepEqual(q.answerDrawing, selected.map(row => ({ layer: row.layer, cells: row.cutCells.map(([x, , z]) => [x, z]) })));
  assert.deepEqual(Object.keys(q.studentGiven).sort(), ["dimensions", "points", "promptText", "responseLayers", "sectionEdges", "solidFilled"].sort());
  assert.equal(q.studentGiven.solidFilled, true); assert(q.promptText.includes("\uBE48\uD2C8\uC5C6\uC774"), "A visible full-solid condition is required, not just an internal model assumption");
  assert.equal(q.studentGiven.promptText, q.promptText); assert.deepEqual(q.studentGiven.dimensions, [oracle.n, oracle.n, oracle.n]);
  assert.deepEqual(q.studentGiven.points, oracle.points); assert.deepEqual(q.studentGiven.sectionEdges, q.model.sectionEdges); assert.deepEqual(q.studentGiven.responseLayers, []);
  assert.equal(typeof q.promptText, "string"); assert(q.promptText.includes("\uAC00, \uB098, \uB2E4, \uB77C"));
  assert(q.promptText.includes("\uB0B4\uBD80\uAC00 \uC798\uB9B0")); assert.equal(q.promptText.includes("\uB9E8 \uC704\uCE35"), level === 0);
  assert.equal(q.promptText.includes("\uB2FF\uAE30\uB9CC"), level === 2);
  assert(!/[<>=+\d]|\uCE35\uBCC4 \uAC1C\uC218|\uC815\uB2F5\uC740/.test(q.promptText), "No invented table, coordinates, formulas, count hints or filled teacher diagram in student prompt");
  const equations = q.solutionEquations.map(parseEquation); assert.equal(equations.length, level === 2 ? 2 : 1);
  assert.deepEqual(equations[0], { terms: selected.slice().reverse().map(row => row.cutCells.length), total: count });
  if (level === 2) assert.deepEqual(equations[1], { terms: oracle.layers.slice().reverse().map(row => row.touchCells.length), total: oracle.touchCount });
  for (const equation of q.solutionEquations) assert(q.solutionText.includes(equation));
  for (const flag of ["sourceExact", "publisherAnswerVerified", "officialAnswerVerified", "handwrittenAnswerVerified", "humanApproved", "learnerReleaseVerified", "empiricallyCalibrated"]) assert.equal(q[flag], false);
  for (const flag of ["sourceConditionsClarified", "requestedAnswerUnique", "requiresOriginalReview"]) assert.equal(q[flag], true);
  assert.equal(q.originalSourceReleaseStatus, "locked"); assert.equal(q.conditionScope, "solid-cube-and-positive-volume-cut-only");
  assert.equal(q.structuralFingerprint, `four-vertex-cut:${oracle.n}x${oracle.n}x${oracle.n}:top-depth-${oracle.n - 1}:ga-na-ra-da:${level === 0 ? "top" : "all"}`);
  assert.equal(q.difficultyDesign.mode, ["easy", "source", "hard"][level]); assert.equal(q.difficultyDesign.sourceReferenceSize, 4);
  assert.equal(q.difficultyDesign.sourceReferenceLevel, 1); assert.equal(q.difficultyDesign.sourceGeometryMatches, oracle.n === 4);
  assert.equal(q.difficultyDesign.authoredCandidate, true); assert.equal(q.difficultyDesign.adoptionStatus, "pending"); assert.equal(q.difficultyDesign.empiricallyCalibrated, false);
  return { variant, n: oracle.n, level, answer, requestedLayers: requested };
}
function run() {
  const locations = paths(), designFiles = ["source-reading.json", "REVIEW.md", "verification.json", "vertex-results.json", "layer-results.json",
    "image-evidence.json", "example-4-2-figure-zoom.png", "example-4-2-item-zoom.png", "check-vertices.mjs", "check-layers.py", "compare-results.mjs"].map(file => path.join(locations.design, file));
  const sourceImage = path.join(locations.root, "source-pdf-36.png"), inputFiles = [...owned, helperFile].map(file => path.join(__dirname, file)).concat(designFiles, sourceImage);
  const json = file => JSON.parse(fs.readFileSync(path.join(locations.design, file), "utf8"));
  const reading = json("source-reading.json"), verification = json("verification.json"), storedVertices = json("vertex-results.json"), storedPolygons = json("layer-results.json");
  const report = { schema: "four-vertex-cut-contract-audit/v1", createdAt: new Date().toISOString(), runtime: { node: process.version, platform: process.platform, arch: process.arch },
    sourceItemId: id, sourceReferenceSize: 4, candidatePool: pool, checks: [], cases: [], models: [], inputs: fingerprint(inputFiles),
    inputRootEnvironment: "HSE_FOUR_VERTEX_SOURCE_EVIDENCE_DIR", outputDirectory: locations.output,
    sourceObservation: "Four-by-four-by-four, top points one unit before rear edge; all four section edges dashed; directly viewed full page and indexed crop",
    skills: ["source-to-memory", "evidence-gated-learning-pipeline", "gfield-geometry-layout-validator", "gfield-single-answer-visibility"],
    skillScope: "Source locators, exact incidence/determinacy, independent math, student/teacher boundary and pending adoption; no renderer approval",
    commonWorkflowVersion: "2026-10-14.r6", originalSourceReleaseStatus: "locked", sourceExact: false,
    publisherAnswerVerified: false, humanApproved: false, learnerReleaseVerified: false, empiricallyCalibrated: false,
    sourceAdoption: "pending", difficultyAdoption: "pending", rendererVerified: false, browserVerified: false, a4Verified: false,
    registrationPerformed: false, catalogEdited: false, originalsModified: false, parentFilesModified: false, gitActions: false, publicRelease: false,
    learnerFit: { gate: "learner-fit", status: "pending", learner_stage: contracts.generate(id, 0, 1).learner_stage,
      criteria: { language: "Korean counting instruction, candidate review pending", representations: "Full solid and four grid vertices; render observability pending",
        prerequisites: "Unit cube layers, plane/interior versus boundary contact; adoption pending", "reasoning-load": "Top-only, all layers, then separate contact; authored candidates",
        "response-mode": "Number only; two ordered counts for harder candidate" } } };
  check(report, "source-input-fingerprints-and-proof-provenance", () => {
    assert.equal(reading.sourceItemId, id); assert.deepEqual(reading.points, { ga: [0, 4, 3], na: [4, 4, 3], da: [0, 0, 0], ra: [4, 0, 0] });
    assert.equal(sha(sourceImage), reading.source.sha256);
    for (const stored of [storedVertices, storedPolygons, verification]) {
      assert.equal(stored.sourceSha256, sha(sourceImage)); assert.equal(stored.readingSha256, sha(path.join(locations.design, "source-reading.json")));
    }
    assert.equal(storedVertices.scriptSha256, sha(path.join(locations.design, "check-vertices.mjs")));
    assert.equal(storedPolygons.scriptSha256, sha(path.join(locations.design, "check-layers.py")));
    assert.deepEqual(reading.sectionCycle.map(name => reading.pointLabels[name]), cycle);
    assert.equal(reading.sourceSectionEdges.length, 4); assert(reading.sourceSectionEdges.every(edge => edge.sourceStyle.startsWith("black-dashed")));
    assert.deepEqual(verification.plane.normal, [0, 3, -4]); assert.equal(verification.plane.rhs, 0);
  });
  const oracles = [], clipping = [];
  for (const [variant, n] of pool.entries()) {
    const points = expectedPoints(n, reading), sign = vertexOracle(n, points), clip = clipOracle(n, points);
    oracles.push(sign); clipping.push(clip);
    check(report, `two-independent-algorithms/n${n}`, () => {
      assert.equal(sign.enumeratedCells, n ** 3); assert.equal(clip.enumeratedCells, n ** 3);
      sameCells(sign.cutCells, clip.cutCells, "two independent cut sets"); sameCells(sign.touchCells, clip.touchCells, "two independent touch sets");
      sameCells(sign.outsideCells, clip.outsideCells, "two independent outside sets");
      assert.equal(sign.cutCount + sign.touchCount + sign.outsideCells.length, n ** 3);
      const kinds = new Map(clip.allCells.map(row => [row.cell.join(","), row.classification]));
      sign.allCells.forEach(row => assert.equal(kinds.get(row.cell.join(",")), row.classification));
      return { n, cellsPerMethod: n ** 3, cut: sign.cutCount, touch: sign.touchCount, layers: sign.layers.map(row => row.cutCells.length) };
    });
    const model = models.solve(id, variant), cutSet = new Set(keys(model.cutCells)), touchSet = new Set(keys(model.touchCells));
    check(report, `model/n${n}`, () => { const detail = validateModel(model, sign); frozenTree(model); report.models.push(detail); return detail; });
    for (const row of sign.allCells) check(report, `cell/n${n}/${row.cell.join("-")}`, () => {
      const key = row.cell.join(","), actual = cutSet.has(key) ? "cut" : touchSet.has(key) ? "touch-only" : "outside";
      assert.equal(actual, row.classification); assert.equal(clip.allCells.find(cell => cell.cell.join(",") === key).classification, row.classification);
    });
    for (let level = 0; level < 3; level++) check(report, `contract/v${variant}/l${level}`, () => {
      const q = contracts.generate(id, variant, level), detail = validateQuestion(q, sign, variant, level); frozenTree(q); report.cases.push(detail); return detail;
    });
  }
  check(report, "source-n4-against-stored-independent-full-cell-lists-and-polygons", () => {
    const sign = oracles[0], clip = clipping[0];
    for (const stored of [storedVertices, storedPolygons, verification]) {
      sameCells(sign.cutCells, stored.cutCells, "source exact cuts"); sameCells(sign.touchCells, stored.touchOnlyCells, "source exact boundary touches");
      assert.equal(stored.cutCount, sign.cutCount); assert.equal(stored.touchOnlyCount, sign.touchCount);
      for (const row of stored.layers) {
        sameCells(sign.layers[row.j].cutCells, row.cutCells, "source layer cut sets");
        sameCells(sign.layers[row.j].touchCells, row.touchOnlyCells, "source layer touch sets");
      }
    }
    for (const stored of [storedVertices, storedPolygons]) {
      assert.equal(stored.allCells.length, 64);
      const kinds = new Map(stored.allCells.map(row => [row.cell.join(","), row.classification]));
      sign.allCells.forEach(row => assert.equal(kinds.get(row.cell.join(",")), row.classification));
    }
    for (const stored of storedPolygons.allCells) {
      const current = clip.allCells.find(row => row.cell.join(",") === stored.cell.join(","));
      const vertices = values => values.map(point => point.map(value => fractionText(parseFraction(value))).join(",")).sort();
      assert.deepEqual(vertices(current.polygonXZExact), vertices(stored.polygonXZExact), "source cell footprint fraction oracle");
      assert.deepEqual(vertices(current.polygonXYZExact), vertices(stored.polygonXYZExact), "source actual plane fraction oracle");
    }
    assert.deepEqual(sign.layers.map(row => row.cutCells.length), [4, 8, 8, 4]); assert.equal(sign.cutCount, 24); assert.equal(sign.touchCount, 4);
  });
  check(report, "frozen-pool-independent-variant-fingerprints", () => {
    frozenTree(models); frozenTree(contracts); assert.deepEqual(models.pool, pool);
    assert.equal(new Set(pool.map((_, variant) => contracts.generate(id, variant, 1).structuralFingerprint)).size, 3);
  });
  for (const n of [0, 2, 6, "4", [4, 4, 4], null, undefined, NaN, Infinity]) check(report, `negative/invalid-size/${String(n)}`, () => assert.throws(() => models.build(n), /Unverified/));
  for (const source of ["6-2-u3-e4-example-1", "6-2-u3-e4-exploration", "6-2-u3-e4-mission-3", "unknown", null, undefined]) check(report, `negative/invalid-id/${String(source)}`, () => {
    assert.throws(() => models.solve(source, 0), /Unsupported/); assert.throws(() => contracts.generate(source, 0, 1), /Unsupported/);
  });
  for (const variant of [-1, 3, 0.5, "0", null, undefined, NaN, Infinity]) check(report, `negative/invalid-variant/${String(variant)}`, () => assert.throws(() => contracts.generate(id, variant, 1), /Unsupported/));
  for (const level of [-1, 3, 0.5, "1", null, undefined, NaN, Infinity]) check(report, `negative/invalid-level/${String(level)}`, () => assert.throws(() => contracts.generate(id, 0, level), /Unsupported/));
  const sourceModel = models.solve(id, 0);
  const modelMutations = [
    ["same-count-wrong-cells", m => { m.cutCells[0] = [0, 0, 3]; }], ["omit-cut-cell", m => { m.cutCells.pop(); }],
    ["wrong-plane", m => { m.plane.normal = [0, 1, -1]; }], ["wrong-plane-scale", m => { m.plane.coordinateScale = 1; }],
    ["top-points-at-back-corners", m => { m.points[labels[0]][2] = 4; m.points[labels[1]][2] = 4; }],
    ["visible-edge-made-solid", m => { m.sectionEdges[0].style = "solid"; }], ["section-endpoint-on-other-face", m => { m.sectionEdges[3].a = [0, 0, 4]; }],
    ["wrong-layer-label", m => { m.layers[0].layer = 4; }], ["same-count-wrong-layer-grid", m => { m.layers[0].cutCells[0] = [0, 3]; }],
    ["touch-counted-as-cut", m => { m.cutCells[0] = m.touchCells[0]; }], ["zero-x-invalid-trace", m => { m.layers[0].slabTraces[1][0][0] = null; }],
    ["trace-off-actual-plane", m => { m.layers[0].slabTraces[1][0][1] = 1; }], ["wrong-section-vertex", m => { m.planeSection[0][2] += 1; }],
    ["crossed-section-order", m => { [m.planeSection[1], m.planeSection[2]] = [m.planeSection[2], m.planeSection[1]]; }],
    ["duplicate-cube", m => { m.cubes[0] = m.cubes[1]; }], ["source-unlocked", m => { m.originalSourceReleaseStatus = "approved"; }]
  ];
  for (const [name, mutate] of modelMutations) check(report, `negative/model/${name}`, () => { const bad = clone(sourceModel); mutate(bad); assert.throws(() => validateModel(bad, oracles[0])); });
  const questionMutations = [
    ["wrong-answer", q => { q.answer[0] += 1; }], ["answer-order-swapped", q => { q.answer.reverse(); }],
    ["omit-boundary-answer", q => { q.answer = q.answer[0]; }], ["wrong-answer-layer", q => { q.answerDrawing[0].layer = 4; }],
    ["same-count-wrong-answer-cells", q => { q.answerDrawing[0].cells[0] = [0, 3]; }], ["drawing-response-invented", q => { q.responseLayers = [4]; }],
    ["student-table-added", q => { q.studentGiven.countTable = [4, 8, 8, 4]; }], ["student-answer-filled", q => { q.studentGiven.layers = q.answerDrawing; }],
    ["solid-condition-removed", q => { q.promptText = q.promptText.replace("\uBE48\uD2C8\uC5C6\uC774", ""); q.studentGiven.promptText = q.promptText; }],
    ["solid-condition-false", q => { q.studentGiven.solidFilled = false; }],
    ["student-formula-added", q => { q.promptText += " 3y-4z=0"; q.studentGiven.promptText = q.promptText; }],
    ["wrong-student-solid", q => { q.studentGiven.dimensions = [3, 3, 3]; }], ["source-reference-size-wrong", q => { q.difficultyDesign.sourceReferenceSize = 3; }],
    ["wrong-model-source-id", q => { q.model.sourceItemId = "6-2-u3-e4-example-1"; }], ["wrong-source-locator", q => { q.model.sourceRef.example = "4-1"; }],
    ["wrong-learner-stage", q => { q.learner_stage = "other"; }], ["student-top-point-moved-back", q => { q.studentGiven.points[labels[0]][2] = 4; }],
    ["candidate-labelled-approved", q => { q.difficultyDesign.adoptionStatus = "approved"; }],
    ["bad-equality-with-valid-answer", q => { q.solutionEquations[0] = '<span class="math-inline-expression" style="white-space:nowrap;color:#000">4+8+8+5=24</span>'; }]
  ];
  for (const flag of ["sourceExact", "publisherAnswerVerified", "officialAnswerVerified", "humanApproved", "learnerReleaseVerified", "empiricallyCalibrated"]) questionMutations.push([`guard-${flag}`, q => { q[flag] = true; }]);
  for (const [name, mutate] of questionMutations) check(report, `negative/contract/${name}`, () => { const bad = clone(contracts.generate(id, 0, 2)); mutate(bad); assert.throws(() => validateQuestion(bad, oracles[0], 0, 2)); });
  for (const original of [oracles[0], clipping[0]]) for (const [name, mutate] of [
    ["same-total-wrong-cell", o => { o.cutCells[0] = [0, 0, 3]; }], ["omission", o => { o.cutCells.pop(); }],
    ["boundary-in-cut", o => { o.cutCells[0] = o.touchCells[0]; }]
  ]) check(report, `negative/oracle/${original.method}/${name}`, () => {
    const bad = clone(original); mutate(bad); assert.throws(() => sameCells(bad.cutCells, verification.cutCells, "stored source oracle"));
  });
  check(report, "UMD-browser-nine-contract-cases-and-deep-freeze", () => {
    const window = {}, context = vm.createContext({ window });
    for (const file of [helperFile, ...owned.slice(0, 2)]) vm.runInContext(fs.readFileSync(path.join(__dirname, file), "utf8"), context, { filename: file });
    const api = window.HSE_SOURCE_GRADE6_FOUR_VERTEX_CUT_CONTRACTS; assert(api); assert(!window.HSE_GENERATORS);
    for (let variant = 0; variant < 3; variant++) for (let level = 0; level < 3; level++) {
      const q = api.generate(id, variant, level); frozenTree(q); validateQuestion(clone(q), oracles[variant], variant, level);
      assert.deepEqual(clone(q), clone(contracts.generate(id, variant, level)));
    }
  });
  for (const file of owned.slice(0, 2)) check(report, `negative/UMD-missing-dependency/${file}`, () => {
    assert.throws(() => vm.runInNewContext(fs.readFileSync(path.join(__dirname, file), "utf8"), { window: {} }), /must load first/);
  });
  check(report, "negative/environment-required", () => assert.throws(() => paths({}), /explicit absolute E:/));
  check(report, "negative/environment-outside-E", () => assert.throws(() => paths({ HSE_FOUR_VERTEX_SOURCE_EVIDENCE_DIR: "C:\\audit" }), /explicit absolute E:/));
  check(report, "negative/environment-in-repository", () => assert.throws(() => paths({ HSE_FOUR_VERTEX_SOURCE_EVIDENCE_DIR: __dirname }), /outside the repository/));
  check(report, "negative/environment-unbounded-output", () => assert.throws(() => paths({ HSE_FOUR_VERTEX_SOURCE_EVIDENCE_DIR: locations.root, HSE_SCREENSHOT_DIR: locations.root }), /bounded/));
  check(report, "all-inputs-unchanged", () => assert.deepEqual(fingerprint(inputFiles), report.inputs));
  report.failedChecks = report.checks.filter(row => row.status === "fail"); report.checkCount = report.checks.length;
  report.passedChecks = report.checkCount - report.failedChecks.length; report.status = report.failedChecks.length ? "failed" : "passed-bounded-model-and-contract-math";
  report.modelCellsPerMethod = oracles.reduce((sum, oracle) => sum + oracle.enumeratedCells, 0); report.contractCases = report.cases.length;
  report.negativeControls = report.checks.filter(row => row.name.startsWith("negative/"));
  report.pending = ["Original source/human/publisher adoption", "Variant and difficulty adoption", "Rendered observability, Three graphics, browser/A4 and registration"];
  report.independenceBoundary = "Both algorithms share the observed source-point contract, not production helpers or cut/touch selections. The clipping method uses yz endpoints without the sign-method plane. Math verification is not a second human source reading or release approval.";
  fs.mkdirSync(locations.output, { recursive: true });
  const outputFiles = { vertices: path.join(locations.output, "independent-vertex-results.json"), clipping: path.join(locations.output, "independent-yz-clipping-results.json"), report: path.join(locations.output, "contracts-audit.json") };
  report.outputFiles = outputFiles;
  fs.writeFileSync(outputFiles.vertices, JSON.stringify({ runtime: report.runtime, inputs: report.inputs, results: oracles }, null, 2) + "\n");
  fs.writeFileSync(outputFiles.clipping, JSON.stringify({ runtime: report.runtime, inputs: report.inputs, results: clipping }, null, 2) + "\n");
  fs.writeFileSync(outputFiles.report, JSON.stringify(report, null, 2) + "\n");
  return report;
}
module.exports = { run, validateModel, validateQuestion, vertexOracle, clipOracle, parseEquation };
if (require.main === module) {
  try {
    const report = run(); console.log(JSON.stringify({ status: report.status, runtime: report.runtime, checks: report.checkCount, failures: report.failedChecks,
      models: report.models, cellsPerMethod: report.modelCellsPerMethod, contractCases: report.contractCases,
      negativeControls: report.negativeControls.length, outputFiles: report.outputFiles }));
    if (report.failedChecks.length) process.exitCode = 1;
  } catch (error) { console.error(error.stack); process.exitCode = 1; }
}
