"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const vm = require("node:vm");
const evidenceRoot = "E:/Codex/visualizations/2026/08/21/01a0242e-3982-7661-8225-b287285e6742/source-6-2-u3-e4-review-20261014";
const sourceDir = path.join(evidenceRoot, "concept-source-review");
const apiFile = path.join(__dirname, "source-6-2-plane-cut-reference.js");
const numberedCells = [[1, [0, 1, 0]], [2, [1, 1, 0]], [3, [1, 1, 1]], [4, [1, 0, 0]]];
const clone = value => JSON.parse(JSON.stringify(value));
const sha = file => crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
const read = name => JSON.parse(fs.readFileSync(path.join(sourceDir, name), "utf8"));
const key = point => point.join(",");
function near(actual, expected, label) { assert(Number.isFinite(actual) && Math.abs(actual - expected) <= 1e-9, label); }
function sameCells(actual, expected, label) {
  assert(Array.isArray(actual), label);
  assert.equal(new Set(actual.map(key)).size, actual.length, `${label}: duplicate coordinates`);
  assert.deepEqual(actual.map(key).sort(), expected.map(key).sort(), label);
}
function rational(text) {
  assert(/^-?\d+(?:\/\d+)?$/.test(text), "source: rational token");
  const [n, d = "1"] = text.split("/");
  assert(BigInt(d) > 0n, "source: rational denominator");
  return { n: BigInt(n), d: BigInt(d), value: Number(n) / Number(d) };
}
function samePolygon(actual, expected, label) {
  sameCells(actual, expected, label);
  const edge = (a, b) => [key(a), key(b)].sort().join("/");
  const edges = polygon => polygon.map((p, i) => edge(p, polygon[(i + 1) % polygon.length])).sort();
  assert.deepEqual(edges(actual), edges(expected), `${label}: boundary order`);
}
function sameTraces(actual, expected) {
  assert(Array.isArray(actual));
  const canonical = trace => trace.map(key).sort().join("/");
  assert.equal(actual.length, expected.length, "panel: top trace count");
  assert.deepEqual(actual.map(canonical).sort(), expected.map(canonical).sort(), "panel: top trace geometry");
}
function residual(point, expected) {
  return expected.plane.normal.reduce((sum, coefficient, axis) => sum + coefficient * point[axis], 0) - expected.plane.constant / 2;
}
function deepFrozen(value) {
  if (value && typeof value === "object") { assert(Object.isFrozen(value), "panel: deeply frozen"); Object.values(value).forEach(deepFrozen); }
}
function deriveExpected() {
  const reading = read("source-reading.json"), verified = read("source-verification.json");
  assert.equal(verified.status, "pass-for-bounded-source-reading-and-math");
  assert.equal(verified.sourceSha256, sha(path.join(evidenceRoot, "source-pdf-36.png")));
  assert.equal(verified.readingSha256, sha(path.join(sourceDir, "source-reading.json")));
  assert.equal(verified.scriptSha256, sha(path.join(sourceDir, "compare-source-results.mjs")));
  for (const file of ["vertex-results.json", "layer-results.json"]) assert.equal(verified.calculationFileSha256[file], sha(path.join(sourceDir, file)));
  const source = reading.figures.find(f => f.id === "printed-example");
  const comparison = verified.results.find(f => f.id === "printed-example");
  const vertices = read("vertex-results.json"), polygons = read("layer-results.json");
  for (const [r, script] of [[vertices, "source-vertex-check.mjs"], [polygons, "source-layer-check.py"]]) {
    assert.equal(r.readingSha256, verified.readingSha256); assert.equal(r.sourceSha256, verified.sourceSha256);
    assert.equal(r.scriptSha256, sha(path.join(sourceDir, script)));
  }
  const vertex = vertices.figures.find(f => f.id === "printed-example"), polygon = polygons.figures.find(f => f.id === "printed-example");
  assert.deepEqual(source.dimensionsXYZ, [2, 2, 2]);
  assert.deepEqual(vertex.dimensionsXYZ, source.dimensionsXYZ); assert.deepEqual(polygon.dimensionsXYZ, source.dimensionsXYZ);
  assert.equal(source.panelReproduction.requiredForWholeConceptItem, true);
  assert.equal(verified.printedPositiveEvidence.fullConceptRequiresOriginalExamplePanel, true);
  const full = [];
  for (let x = 0; x < 2; x++) for (let y = 0; y < 2; y++) for (let z = 0; z < 2; z++) full.push([x, y, z]);
  sameCells(vertex.allCells.map(c => c.cell), full, "source: vertex method enumerates every cell");
  sameCells(polygon.allCells.map(c => c.cell), full, "source: polygon method enumerates every cell");
  const states = new Map(vertex.allCells.map(c => [key(c.cell), c.classification]));
  for (const c of polygon.allCells) assert.equal(c.classification, states.get(key(c.cell)), "source: every-cell classification agrees");
  sameCells(vertex.interiorCutCells, polygon.interiorCutCells, "source: independent cut lists");
  sameCells(vertex.touchOnlyCells, polygon.touchOnlyCells, "source: independent contact lists");
  sameCells(comparison.interiorCutCells, polygon.interiorCutCells, "source: comparison cut list");
  sameCells(numberedCells.map(([, cell]) => cell), polygon.interiorCutCells, "source: explicit numbering covers cuts only");
  assert.equal(comparison.enumeratedByEachMethod, full.length);
  assert.equal(comparison.allCellClassificationsEqual, true); assert.equal(comparison.allLayerCellSetsEqual, true);
  const plane = { normal: vertex.plane.normal, constant: vertex.plane.rhs * 2, coordinateScale: 2 };
  assert.deepEqual(plane, { normal: [1, 1, -1], constant: 4, coordinateScale: 2 });
  for (const [name, value] of [["alpha", -plane.normal[0]], ["beta", -plane.normal[2]], ["gamma", vertex.plane.rhs]]) {
    const f = rational(polygon.planeFit[name]); assert.equal(BigInt(value) * f.d, BigInt(plane.normal[1]) * f.n, "source: exact independent plane fit");
  }
  const expected = { role: "source-given-worked-example", dimensions: source.dimensionsXYZ, plane, points: source.points,
    cubes: full, cutCells: polygon.interiorCutCells, touchCells: polygon.touchOnlyCells, printedCount: source.printedCountEvidence.count,
    sourceRef: { pdfPage: reading.source.pdfPage, printedPage: reading.source.printedPage }, layers: [] };
  assert.equal(expected.printedCount, numberedCells.length);
  for (const p of Object.values(source.points)) assert.equal(residual(p, expected), 0, "source: physical point incidence");
  source.printedLayers.forEach(sourceLayer => {
    const y = sourceLayer.j, calculated = polygon.layers.find(l => l.j === y);
    sameCells(sourceLayer.circledCells.map(c => c.cell), calculated.interiorCutCells, "source: printed layer enumeration");
    const facets = sourceLayer.circledCells.map(c => {
      const row = polygon.allCells.find(v => key(v.cell) === key(c.cell));
      assert.equal(row.classification, "interior-cut");
      const facet = row.polygonXYZExact.map(p => p.map(v => rational(v).value));
      assert(facet.length >= 3);
      return { number: c.printedNumber, cell: c.cell, polygon: facet,
        positionXZ: [0, 2].map(axis => facet.reduce((sum, p) => sum + p[axis], 0) / facet.length) };
    });
    for (const facet of facets) {
      assert.deepEqual(facet.cell, numberedCells.find(([n]) => n === facet.number)[1], "source: fixed number assignment");
      for (const p of facet.polygon) assert.equal(residual(p, expected), 0);
    }
    const footprint = calculated.footprintXZExact.map(p => p.map(v => rational(v).value));
    samePolygon(sourceLayer.layer3DSectionBoundary.map(([x, , z]) => [x, z]), footprint, "source: printed slab and independent polygon");
    const topTraces = sourceLayer.projectedPrintedLinesXZ.map(trace => clone(trace));
    sourceLayer.projectedPrintedLinesXZ.forEach((trace, index) => trace.forEach(([x, z]) => assert.equal(residual([x, sourceLayer.lineOriginsY[index], z], expected), 0)));
    if (sourceLayer.layerBottomSectionAtY0) topTraces.push(sourceLayer.layerBottomSectionAtY0.map(([x, , z]) => [x, z]));
    expected.layers.push({ layer: y + 1, polygon: sourceLayer.layer3DSectionBoundary, facets, topTraces,
      title: sourceLayer.printedTitle, circledCells: facets.map(({ number, cell, positionXZ }) => ({ number, cell, positionXZ })) });
  });
  assert.deepEqual(expected.layers.map(l => l.layer), [2, 1]);
  return expected;
}
function validatePanel(panel, expected) {
  assert.equal(panel.role, expected.role, "panel: source-given role");
  assert.deepEqual(panel.dimensions, expected.dimensions, "panel: fixed example dimensions");
  assert(panel.sourceRef && typeof panel.sourceRef === "object", "panel: source reference required");
  for (const name of ["pdfPage", "printedPage"]) assert.equal(panel.sourceRef[name], expected.sourceRef[name], "panel: printed source locator");
  if (Object.hasOwn(panel, "printedCount")) assert.equal(panel.printedCount, expected.printedCount, "panel: printed count");
  for (const name of ["actualQuestionAnswerIncluded", "handwritingIncluded", "humanApproved", "publisherAnswerVerified", "learnerReleaseVerified"]) {
    if (Object.hasOwn(panel, name)) assert.equal(panel[name], false, `panel: ${name}`);
  }
  const model = panel.model;
  assert.deepEqual(model.dimensions, expected.dimensions, "panel: model dimensions");
  assert.deepEqual(model.plane, expected.plane, "panel: independent plane");
  sameCells(model.cubes, expected.cubes, "panel: all eight example cells");
  sameCells(model.cutCells, expected.cutCells, "panel: interior cuts");
  sameCells(model.touchCells, expected.touchCells, "panel: contacts excluded");
  sameCells(Object.values(model.points), Object.values(expected.points), "panel: source physical vertices");
  samePolygon(model.planeSection, Object.values(expected.points), "panel: full triangle");
  assert.equal(model.cutCount, expected.cutCells.length, "panel: model cut count");
  assert.equal(model.touchCount, expected.touchCells.length, "panel: model contact count");
  assert.equal(panel.layers.length, expected.layers.length, "panel: layer count");
  panel.layers.forEach((row, index) => {
    const e = expected.layers[index];
    assert.equal(row.layer, e.layer, "panel: upper/lower layer order");
    samePolygon(row.polygon, e.polygon, "panel: exact slab boundary");
    sameTraces(row.topTraces, e.topTraces);
    assert.equal(row.facets.length, e.facets.length, "panel: facet count");
    assert.deepEqual(row.facets.map(f => f.number), e.facets.map(f => f.number), "panel: printed facet numbers");
    row.facets.forEach((facet, i) => {
      const f = e.facets[i];
      assert.deepEqual(facet.cell, f.cell, "panel: numbered facet cell");
      samePolygon(facet.polygon, f.polygon, "panel: exact numbered facet");
      for (const p of facet.polygon) { near(residual(p, expected), 0, "panel: facet on actual plane");
        assert(p.every((v, axis) => v >= f.cell[axis] && v <= f.cell[axis] + 1), "panel: facet inside numbered voxel"); }
    });
    assert.equal(row.circledCells.length, e.circledCells.length, "panel: circled count");
    row.circledCells.forEach((c, i) => {
      const f = e.circledCells[i];
      assert.equal(c.number, f.number, "panel: circled number");
      assert.deepEqual(c.cell, f.cell, "panel: circled cell assignment");
      if (c.positionXZ) c.positionXZ.forEach((v, axis) => near(v, f.positionXZ[axis], "panel: circle position in facet"));
    });
  });
  return { fixedExample: true, layers: [2, 1], facets: 4, numberedCutsAreGivenNotTargetAnswer: true };
}
let xml;
function xmlParser() {
  if (!xml) {
    try { xml = require("xml-js"); } catch (error) {
      if (error.code !== "MODULE_NOT_FOUND") throw error;
      xml = require(process.env.HSE_XML_PARSER_PATH || path.join(process.env.USERPROFILE || "",
        ".cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/xml-js"));
    }
  }
  return xml;
}
function parseMarkup(markup) {
  assert.equal(typeof markup, "string", "markup: string required");
  return xmlParser().xml2js(`<audit-root>${markup}</audit-root>`, { compact: false }).elements[0];
}
function elements(node, name) {
  return (node.elements || []).flatMap(child => [...(child.type === "element" && (!name || child.name === name) ? [child] : []), ...elements(child, name)]);
}
const attr = (node, name) => node.attributes && node.attributes[name];
function numberAttr(node, name) {
  assert(attr(node, name) !== undefined && String(attr(node, name)).trim() !== "", `markup: missing ${name}`);
  const n = Number(attr(node, name)); assert(Number.isFinite(n), `markup: invalid ${name}`); return n;
}
function textContent(node) { return (node.elements || []).map(c => c.type === "text" ? c.text : textContent(c)).join(""); }
function textFragments(node) { return (node.elements || []).flatMap(c => c.type === "text" ? [c.text] : textFragments(c)); }
function validateMarkup(markup, expected) {
  const tree = typeof markup === "string" ? parseMarkup(markup) : markup, nodes = elements(tree);
  const roots = nodes.filter(n => attr(n, "data-reference-role") !== undefined);
  assert.equal(roots.length, 1, "markup: exactly one original reference panel");
  assert.equal(attr(roots[0], "data-reference-role"), expected.role, "markup: original given role");
  assert(!nodes.some(n => ["script", "foreignObject", "img", "canvas"].includes(n.name)), "markup: unexpected external or opaque answer content");
  assert(!nodes.some(n => /answer|solution|teacher|helper|count-table/.test(attr(n, "class") || "")), "markup: invented answer/helper content");
  const visible = textContent(tree);
  assert(!textFragments(tree).some(text => /\b(?:7|15|26)\b/.test(text)) &&
    !/\uD569\uACC4|\uC815\uB2F5|\uCE35\uBCC4 \uAC1C\uC218|\d\s*[+=]\s*\d/.test(visible), "markup: actual target answer or invented count table");
  const mounts = nodes.filter(n => attr(n, "data-cut-reference") !== undefined);
  assert.equal(mounts.filter(n => attr(n, "data-cut-reference") === "solid").length, 1, "markup: full original solid mount");
  const sections = mounts.filter(n => attr(n, "data-cut-reference") === "section");
  assert.equal(mounts.length, 3, "markup: full solid and two sections only");
  assert.deepEqual(sections.map(n => numberAttr(n, "data-layer")), [2, 1], "markup: upper/lower section mounts");
  const figures = elements(tree, "figure"); assert.equal(figures.length, 2, "markup: two original layer figures");
  const grids = elements(tree, "svg").filter(n => attr(n, "data-reference-layer") !== undefined);
  assert.equal(elements(tree, "svg").length, 2, "markup: no invented extra grids");
  assert.deepEqual(grids.map(n => numberAttr(n, "data-reference-layer")), [2, 1], "markup: top-view layer labels");
  expected.layers.forEach((e, index) => {
    const svg = grids[index], figure = figures[index];
    assert.equal(numberAttr(figure, "data-reference-layer"), e.layer, "markup: figure layer");
    assert.equal(elements(figure, "svg").length, 1, "markup: one top view per original figure");
    assert.equal(textContent(elements(figure, "figcaption")[0]).replace(/\s/g, ""), e.title.replace(/\s/g, ""), "markup: printed layer title and arrow");
    assert.equal(elements(figure, "span").filter(n => textContent(n).trim() === "\u2192").length, 1, "markup: original section-to-grid arrow");
    const rects = elements(svg, "rect"); assert.equal(rects.length, 4, "markup: 2x2 original grid cells");
    sameCells(rects.map(n => [numberAttr(n, "data-x"), numberAttr(n, "data-z")]), [[0, 0], [1, 0], [0, 1], [1, 1]], "markup: source grid coordinates");
    const first = rects.find(n => attr(n, "data-x") === "0" && attr(n, "data-z") === "0");
    const unit = numberAttr(first, "width"), left = numberAttr(first, "x"), top = numberAttr(first, "y") - unit;
    assert(unit > 0, "markup: positive cell size");
    for (const rect of rects) {
      const x = numberAttr(rect, "data-x"), z = numberAttr(rect, "data-z");
      near(numberAttr(rect, "width"), unit, "markup: square unit width"); near(numberAttr(rect, "height"), unit, "markup: square unit height");
      near(numberAttr(rect, "x"), left + x * unit, "markup: source x direction");
      near(numberAttr(rect, "y"), top + (1 - z) * unit, "markup: source reversed z direction");
      assert(["#fff", "#ffffff", "white"].includes(String(attr(rect, "fill")).toLowerCase()), "markup: original uncolored grid");
      if (attr(rect, "data-selected") !== undefined) assert.equal(attr(rect, "data-selected"), "false", "markup: no teacher-selected cells");
    }
    const lines = elements(svg, "line"), traces = e.topTraces.filter(t => t.length === 2);
    assert.equal(lines.length, traces.length, "markup: original projected trace count");
    const decoded = lines.map(line => {
      assert.equal(attr(line, "data-role"), "reference-trace", "markup: original trace role");
      return [[numberAttr(line, "x1"), numberAttr(line, "y1")], [numberAttr(line, "x2"), numberAttr(line, "y2")]]
        .map(([x, y]) => [(x - left) / unit, 2 - (y - top) / unit]);
    });
    sameTraces(decoded, traces);
    const groups = elements(svg, "g");
    assert.deepEqual(groups.map(g => numberAttr(g, "data-reference-number")), e.circledCells.map(c => c.number), "markup: circled glyph numbers");
    assert.equal(elements(svg, "text").length, groups.length, "markup: no extra numeric labels");
    assert.equal(elements(svg, "circle").length, groups.length, "markup: all numbers circled");
    groups.forEach((group, i) => {
      const c = e.circledCells[i];
      assert.equal(attr(group, "data-cell"), c.cell.join(","), "markup: numbered cell identity");
      const match = String(attr(group, "transform")).match(/^translate\(\s*(-?\d+(?:\.\d+)?(?:e[+-]?\d+)?)\s*,\s*(-?\d+(?:\.\d+)?(?:e[+-]?\d+)?)\s*\)$/i);
      assert(match, "markup: circle group translation only");
      const center = [Number(match[1]), Number(match[2])];
      near((center[0] - left) / unit, c.positionXZ[0], "markup: numbered facet x position");
      near(2 - (center[1] - top) / unit, c.positionXZ[1], "markup: numbered facet z position");
      const texts = elements(group, "text"), circles = elements(group, "circle");
      assert.equal(texts.length, 1); assert.equal(circles.length, 1);
      assert.equal(textContent(texts[0]).trim(), String(c.number), "markup: actual printed numeral");
      near(numberAttr(texts[0], "x"), 0, "markup: centered text x"); near(numberAttr(texts[0], "y"), 0, "markup: centered text y");
      if (attr(circles[0], "cx") !== undefined) near(numberAttr(circles[0], "cx"), 0, "markup: centered circle x");
      if (attr(circles[0], "cy") !== undefined) near(numberAttr(circles[0], "cy"), 0, "markup: centered circle y");
      const radius = numberAttr(circles[0], "r"); assert(radius > 0 && radius < unit / 2, "markup: bounded visible circle");
      const [x, , z] = c.cell;
      assert(center[0] - radius >= left + x * unit && center[0] + radius <= left + (x + 1) * unit &&
        center[1] - radius >= top + (1 - z) * unit && center[1] + radius <= top + (2 - z) * unit, "markup: circle inside original cell");
    });
    for (const node of [svg, ...elements(svg)]) {
      assert(!attr(node, "style"), "markup: no hidden fill/flip override");
      if (node.name !== "g") assert(!attr(node, "transform"), "markup: no geometry flip");
    }
  });
  return { grids: 2, cells: 8, circles: 4, originalGivenNumbersAllowed: [1, 2, 3, 4], actualPrismAnswerNotIncluded: true };
}
function fixture(expected) {
  return { role: expected.role, dimensions: clone(expected.dimensions), sourceRef: clone(expected.sourceRef), printedCount: expected.printedCount,
    model: { dimensions: clone(expected.dimensions), plane: clone(expected.plane), points: clone(expected.points),
      planeSection: clone(Object.values(expected.points)), cubes: clone(expected.cubes), cutCells: clone(expected.cutCells),
      touchCells: clone(expected.touchCells), cutCount: expected.cutCells.length, touchCount: expected.touchCells.length }, layers: clone(expected.layers) };
}
function validateSlab(slab, layer) {
  assert.deepEqual(slab.dimensions, [2, 1, 2], "slab: fixed layer dimensions");
  assert.equal(slab.n, 1, "slab: one unit height");
  assert.deepEqual(slab.points, {}, "slab: no unprinted point labels");
  sameCells(slab.cubes, [[0, 0, 0], [0, 0, 1], [1, 0, 0], [1, 0, 1]], "slab: all four source cells");
  const local = polygon => polygon.map(([x, y, z]) => [x, y - (layer.layer - 1), z]);
  samePolygon(slab.planeSection, local(layer.polygon), "slab: exact local-Y section");
  assert.equal(slab.sectionFacets.length, layer.facets.length, "slab: numbered facet count");
  slab.sectionFacets.forEach((polygon, index) => samePolygon(polygon, local(layer.facets[index].polygon), "slab: exact local-Y facet"));
}
function check(report, name, fn) {
  try { const detail = fn(); report.checks.push({ name, status: "pass", ...(detail === undefined ? {} : { detail }) }); }
  catch (error) { report.checks.push({ name, status: "fail", error: error.message }); }
}
function negative(report, name, fn, reason) { check(report, `negative/${name}`, () => { assert.throws(fn, reason); return { rejected: true, reason: String(reason) }; }); }
function fingerprints() {
  const files = [__filename, path.join(evidenceRoot, "source-pdf-36.png"),
    ...["source-reading.json", "source-verification.json", "vertex-results.json", "layer-results.json", "compare-source-results.mjs",
      "source-vertex-check.mjs", "source-layer-check.py", "printed-example-panel-zoom.png"].map(name => path.join(sourceDir, name))];
  if (fs.existsSync(apiFile)) files.push(apiFile, path.join(__dirname, "source-6-2-plane-cut-models.js"));
  return files.map(file => ({ file, sha256: sha(file) }));
}
function run() {
  const report = { schema: "source-given-reference-audit/v1", scope: "fixed-printed-example-model-and-markup-only", createdAt: new Date().toISOString(),
    checks: [], pending: [], inputs: fingerprints(), apiInspected: false, productionFilesModified: false,
    originalSourceReleaseStatus: "locked", sourceExact: false, officialAnswerVerified: false,
    humanApproved: false, browserVerified: false, a4Verified: false, rendered3DVerified: false,
    wholeOriginalVerified: false, publicApproval: false, unlock: false, commit: false, push: false,
    skills: ["evidence-gated-learning-pipeline", "audit-verify-explain-grade-5"],
    skillScope: "Source-first independent geometry, unchanged original assets, teacher/helper boundaries, and bounded evidence without release approval",
    commonWorkflowVersion: "2026-10-14.r6" };
  let expected;
  check(report, "independent-source-expectations", () => { expected = deriveExpected(); report.expected = expected;
    return { numberedCells, derivation: "original printed grid/section reading plus independently evaluated all-cell vertex and rational polygon results; no parent selection reused" }; });
  if (expected) {
    const baseline = fixture(expected);
    check(report, "synthetic-validator-positive-not-production", () => validatePanel(baseline, expected));
    const changed = mutate => { const p = clone(baseline); mutate(p); return p; };
    negative(report, "swapped-layer-order", () => validatePanel(changed(p => p.layers.reverse()), expected), /panel: upper\/lower layer order/);
    negative(report, "missing-numbered-facet", () => validatePanel(changed(p => p.layers[0].facets.pop()), expected), /panel: facet count/);
    negative(report, "incorrect-printed-count", () => validatePanel(changed(p => p.printedCount = 7), expected), /panel: printed count/);
    negative(report, "renumbered-facet", () => validatePanel(changed(p => p.layers[0].facets[0].number = 4), expected), /panel: printed facet numbers/);
    negative(report, "moved-circled-cell", () => validatePanel(changed(p => p.layers[0].circledCells[0].cell = [0, 1, 1]), expected), /panel: circled cell assignment/);
    negative(report, "altered-plane", () => validatePanel(changed(p => p.model.plane.constant = 6), expected), /panel: independent plane/);
    negative(report, "off-plane-facet", () => validatePanel(changed(p => p.layers[0].facets[0].polygon[0][1] += 1), expected), /panel: exact numbered facet/);
    negative(report, "parameterized-example-as-target", () => validatePanel(changed(p => p.dimensions = [3, 2, 2]), expected), /panel: fixed example dimensions/);
    if (!fs.existsSync(apiFile)) report.pending.push("reference.js is not ready; rerun once after parent patch, no polling performed");
    else {
      let api, panel, markup;
      check(report, "commonjs-api-load", () => { api = require(apiFile); report.apiInspected = true; });
      if (api && typeof api.build === "function") {
        check(report, "actual-api-build-model", () => { panel = api.build(); return validatePanel(panel, expected); });
        if (panel) check(report, "actual-api-deep-freeze", () => deepFrozen(panel));
      } else report.pending.push("build() is not ready");
      if (api && typeof api.render === "function") {
        check(report, "actual-api-render-source-given", () => { markup = api.render(); return validateMarkup(markup, expected); });
      } else report.pending.push("render() is not ready");
      if (api && typeof api.slab === "function" && panel) {
        check(report, "actual-api-local-Y-section-slabs-not-rendered3D", () => {
          panel.layers.forEach((row, index) => { const slab = api.slab(row); validateSlab(slab, expected.layers[index]); deepFrozen(slab); });
        });
        for (const layer of [undefined, null, 0, 3, 1.5, "1", NaN]) {
          check(report, `invalid-slab-layer/${String(layer)}`, () => assert.throws(() => api.slab({ layer }), RangeError));
        }
        negative(report, "slab-wrong-local-Y", () => {
          const slab = clone(api.slab(panel.layers[0])); slab.planeSection[0][1]++;
          validateSlab(slab, expected.layers[0]);
        }, /slab: exact local-Y section/);
      }
      if (typeof markup === "string") {
        const changedTree = mutate => { const tree = parseMarkup(markup); mutate(tree); return tree; };
        negative(report, "markup-wrong-layer", () => validateMarkup(changedTree(tree => elements(tree, "svg")[0].attributes["data-reference-layer"] = "1"), expected), /markup: top-view layer labels/);
        negative(report, "markup-wrong-numeral", () => validateMarkup(changedTree(tree => elements(tree, "text")[0].elements[0].text = "4"), expected), /markup: actual printed numeral/);
        negative(report, "markup-wrong-circle-cell", () => validateMarkup(changedTree(tree => elements(tree, "g")[0].attributes["data-cell"] = "0,1,1"), expected), /markup: numbered cell identity/);
        negative(report, "markup-flipped-grid", () => validateMarkup(changedTree(tree => {
          const rect = elements(tree, "rect")[0]; rect.attributes.y = String(numberAttr(rect, "y") + numberAttr(rect, "height"));
        }), expected), /markup: source reversed z direction/);
        negative(report, "markup-target-answer-seven", () => validateMarkup(markup + "<div>7\uAC1C</div>", expected), /markup: actual target answer/);
        negative(report, "markup-invented-helper-table", () => validateMarkup(markup + '<table class="count-table"><tr><td>7</td></tr></table>', expected), /markup: invented answer\/helper content/);
      }
      if (api && typeof api.build === "function" && typeof api.render === "function") check(report, "umd-global-parity-not-browser", () => {
        const context = vm.createContext({});
        for (const file of ["source-6-2-plane-cut-models.js", "source-6-2-plane-cut-reference.js"]) vm.runInContext(fs.readFileSync(path.join(__dirname, file), "utf8"), context);
        const umd = context.HSE_SOURCE_GRADE6_PLANE_CUT_REFERENCE;
        assert(umd && typeof umd.build === "function" && typeof umd.render === "function");
        const p = clone(umd.build()); validatePanel(p, expected); assert.deepEqual(p, clone(api.build()));
        validateMarkup(umd.render(), expected); assert.equal(umd.render(), api.render());
      });
    }
  }
  check(report, "inputs-stable-through-run", () => assert.deepEqual(fingerprints(), report.inputs));
  report.failedChecks = report.checks.filter(c => c.status === "fail");
  report.status = report.failedChecks.length ? "failed" : report.pending.length ? "pending" : "passed-bounded-model-and-markup";
  report.checkCount = report.checks.length; report.passedChecks = report.checkCount - report.failedChecks.length;
  report.negativeControls = report.checks.filter(c => c.name.startsWith("negative/"));
  report.referenceModelAndMarkupVerified = report.status === "passed-bounded-model-and-markup";
  report.approvalBoundary = "Passing the fixed example contract does not verify actual 3D/print rendering, full concept integration, human source fidelity, learner fit or public release";
  const folder = path.join(evidenceRoot, "reference-audit"); fs.mkdirSync(folder, { recursive: true });
  fs.writeFileSync(path.join(folder, "reference-audit.json"), JSON.stringify(report, null, 2) + "\n");
  return report;
}
module.exports = { deriveExpected, validatePanel, validateMarkup, validateSlab, parseMarkup, run };
if (require.main === module) {
  try { const r = run(); console.log(JSON.stringify({ status: r.status, checks: r.checkCount, failures: r.failedChecks,
    pending: r.pending, report: path.join(evidenceRoot, "reference-audit/reference-audit.json") }));
    if (r.status === "failed") process.exitCode = 1;
  } catch (error) { console.error(error.stack); process.exitCode = 1; }
}
