"use strict";
const assert = require("node:assert/strict");
const path = require("node:path");
const presentation = require("./source-6-2-plane-cut-presentation.js");
const contracts = require("./source-6-2-plane-cut-contracts.js");
const sourcePanel = require("./source-6-2-plane-cut-reference.js");
const audit = require("./source-6-2-plane-cut-contracts-audit.js");
const { ids, clone, sameCells, parseMarkup, elements, textContent, reference, check, negative } = audit;
const attr = (node, name) => node.attributes && node.attributes[name];
function numberAttr(node, name) {
  const value = attr(node, name);
  assert(value !== undefined && value.trim() !== "", `svg: missing ${name}`);
  const number = Number(value);
  assert(Number.isFinite(number), `svg: invalid ${name}`);
  return number;
}
function validateGrid(svg, r, layer, mode) {
  assert.equal(svg.name, "svg");
  assert.equal(numberAttr(svg, "data-layer"), layer, "svg: wrong layer label");
  assert.equal(attr(svg, "data-phase"), mode, "svg: wrong phase");
  assert.equal(attr(svg, "aria-label"), `${layer}\uCE35 \uC704\uC5D0\uC11C \uBCF8 ${mode === "blank" ? "\uB2F5 \uACA9\uC790" : "\uC808\uB2E8 \uACB0\uACFC"}`, "svg: accessible layer label");
  const unit = 26, pad = 8, width = r.width * unit + 2 * pad, height = r.depth * unit + 2 * pad;
  assert.equal(attr(svg, "viewBox"), `0 0 ${width} ${height}`, "svg: physical rectangle viewBox");
  assert.equal(numberAttr(svg, "width"), width); assert.equal(numberAttr(svg, "height"), height);
  const rects = elements(svg, "rect"), lines = elements(svg, "line");
  assert.equal(elements(svg).length, rects.length + lines.length, "svg: unexpected answer-bearing shapes");
  const expected = r.auditAllCells.filter(c => c[1] === layer - 1).map(([x, , z]) => [x, z]);
  const selected = mode === "blank" ? [] : mode === "cut" ? r.layers[layer - 1].twoDVoxels.map(([x, , z]) => [x, z])
    : r.boundaryTouchesExcluded.filter(t => t.voxel[1] === layer - 1).map(t => [t.voxel[0], t.voxel[2]]);
  sameCells(rects.map(rect => [numberAttr(rect, "data-x"), numberAttr(rect, "data-z")]), expected, "svg: width*depth exact cells");
  sameCells(rects.filter(rect => attr(rect, "data-selected") === "true").map(rect => [numberAttr(rect, "data-x"), numberAttr(rect, "data-z")]), selected, "svg: selected cut/touch/blank cells");
  for (const rect of rects) {
    const x = numberAttr(rect, "data-x"), z = numberAttr(rect, "data-z"), filled = selected.some(c => c[0] === x && c[1] === z);
    assert.equal(attr(rect, "data-selected"), String(filled), "svg: selected boolean");
    assert.equal(attr(rect, "fill"), filled ? "#cedfcf" : "#fff", "svg: wrong cell fill");
    assert.equal(numberAttr(rect, "x"), pad + x * unit, "svg: source x-axis");
    assert.equal(numberAttr(rect, "y"), pad + (r.depth - 1 - z) * unit, "svg: source reversed z-axis");
    assert.equal(numberAttr(rect, "width"), unit); assert.equal(numberAttr(rect, "height"), unit);
    assert.equal(attr(rect, "stroke"), "#111");
    assert(!attr(rect, "transform") && !attr(rect, "style"), "svg: hidden flip or fill override");
  }
  assert(!attr(svg, "transform") && !attr(svg, "style"), "svg: hidden global flip");
  const heights = mode === "cut" ? [layer - 1, layer].filter(y => audit.sourceTrace(r, y).length === 2) : [];
  assert.equal(lines.length, heights.length, "svg: blank/touch must have no traces; cut requires both slab traces");
  lines.forEach((line, index) => {
    assert.equal(attr(line, "data-role"), "plane-trace", "svg: trace role");
    assert(!attr(line, "transform") && !attr(line, "style"), "svg: transformed trace");
    const endpoints = [[numberAttr(line, "x1"), numberAttr(line, "y1")], [numberAttr(line, "x2"), numberAttr(line, "y2")]]
      .map(([x, y]) => [(x - pad) / unit, r.depth - (y - pad) / unit]);
    const yHeight = heights[index];
    for (const [x, z] of endpoints) {
      assert(x >= -1e-9 && x <= r.width + 1e-9 && z >= -1e-9 && z <= r.depth + 1e-9, "svg: trace outside physical rectangle");
      audit.near(audit.planeResidual(r, [x, yHeight, z]), 0, "svg: endpoint off actual plane");
    }
    audit.samePoints(endpoints, audit.sourceTrace(r, yHeight), "svg: actual plane endpoints");
  });
  return { layer, mode, cells: rects.length, selected: selected.length, traces: lines.length };
}
function targetTree(q) {
  const tree = parseMarkup(q.prompt), panels = elements(tree).filter(node => attr(node, "data-reference-role") !== undefined);
  assert.equal(panels.length, q.sourceReferencePanelRequired ? 1 : 0, "prompt: required source example count");
  if(panels.length){
    assert.deepEqual(panels[0], parseMarkup(sourcePanel.render()).elements[0], "prompt: source example altered or candidate answer inserted");
    function remove(node){node.elements=(node.elements||[]).filter(child=>child!==panels[0]);for(const child of node.elements)if(child.type==="element")remove(child);}
    remove(tree);
  }
  return tree;
}
function validateStudentMarkup(q) {
  const tree = targetTree(q);
  const nodes = elements(tree);
  assert(!nodes.some(node => ["table", "span", "img", "canvas", "path", "polygon", "text", "script"].includes(node.name)), "prompt: answer table/equation/filled3D forbidden");
  for (const node of nodes) {
    assert(!/answer|solution|teacher|count-table|filled/i.test(attr(node, "class") || ""), "prompt: teacher-only content");
    assert(!attr(node, "style") && !attr(node, "transform"), "prompt: hidden fill or transform override");
    const solid = attr(node, "data-cut-solid");
    if (solid !== undefined) assert.equal(solid, "given", "prompt: filled3D answer mount");
  }
  assert(!/=|\d\s*[+]\s*\d/.test(textContent(tree)), "prompt: equality leak");
  const given = nodes.filter(node => attr(node, "data-cut-solid") !== undefined);
  assert.equal(given.length, 1, "prompt: exactly one given solid mount");
  assert.equal(numberAttr(given[0], "data-cut-n"), q.model.n, "prompt: solid size");
  assert.equal((tree.elements || []).filter(node => node.type === "element").length, 1);
  const expectedText = (q.sourceReferencePromptText||"") + q.promptText + q.responseLayers.map(layer => `${layer}\uCE35`).join("");
  assert.equal(textContent(tree), expectedText, "prompt: instruction/captions only; candidate answer leaked or instruction missing");
}
function validateBlankGrids(q, r) {
  const tree = targetTree(q), svgs = elements(tree, "svg"), figures = elements(tree, "figure");
  const expected = q.sourceItemId === ids[1] ? q.requestedLayers : [];
  assert.deepEqual(svgs.map(svg => numberAttr(svg, "data-layer")), expected, "prompt: all blank response layers required");
  assert.equal(figures.length, expected.length, "prompt: response figures");
  figures.forEach((figure, index) => {
    const captions = elements(figure, "figcaption");
    assert.deepEqual(captions.map(textContent), [`${expected[index]}\uCE35`], "prompt: blank grid layer captions only");
    assert.equal(elements(figure, "svg").length, 1, "prompt: one grid per layer");
  });
  return svgs.map((svg, index) => validateGrid(svg, r, expected[index], "blank"));
}
function validateTeacher(q, r) {
  const tree = parseMarkup(q.answerVisual), figures = elements(tree, "figure"), svgs = elements(tree, "svg");
  for (const node of elements(tree)) assert(!attr(node, "style") && !attr(node, "transform"), "teacher: hidden source-view transform");
  const expected = q.requestedLayers.map(layer => ({ layer, mode: "cut" }));
  if (q.level === 2) expected.push(...q.requestedLayers.map(layer => ({ layer, mode: "touch" })));
  assert.equal(figures.length, expected.length, "teacher: all figures");
  assert.equal(svgs.length, expected.length, "teacher: all grids");
  const mounts = elements(tree).filter(node => attr(node, "data-cut-solid") !== undefined);
  assert.equal(mounts.length, 1, "teacher: one answer solid mount");
  assert.equal(attr(mounts[0], "data-cut-solid"), "answer");
  assert.equal(numberAttr(mounts[0], "data-cut-n"), r.n);
  return expected.map(({ layer, mode }, index) => {
    assert.equal(elements(figures[index], "svg").length, 1);
    const count = mode === "cut" ? r.layers[layer - 1].twoDCount : r.boundaryTouchesExcluded.filter(t => t.voxel[1] === layer - 1).length;
    assert.deepEqual(elements(figures[index], "figcaption").map(textContent), [`${layer}\uCE35`, `${count}\uAC1C`], "teacher: exact layer/count captions");
    return validateGrid(svgs[index], r, layer, mode);
  });
}
function run() {
  const report = audit.baseReport("presentation", audit.inputHashes(["source-6-2-plane-cut-presentation.js"]));
  const independent = audit.readIndependent();
  report.sourceInterpretation = independent.sourceInterpretation;
  report.independentComparison = independent.rectangularFinalComparison;
  report.independentReferences = audit.referenceSummary(independent);
  assert.deepEqual(presentation.sourceItemIds, ids);
  for (const id of ids) for (let variant = 0; variant < 3; variant++) for (let level = 0; level < 3; level++) {
    const q = presentation.render(id, variant, level), pure = contracts.generate(id, variant, level), r = reference(independent, id, variant);
    const name = `${id}/v${variant}/l${level}`;
    report.cases.push({ id, variant, level, dimensions: r.dimensions, independentReference: r.origin, promptText: q.promptText,
      requiresLayerDrawing: q.requiresLayerDrawing, responseLayers: q.responseLayers });
    check(report, `${name}/student-boundary`, () => { audit.validateStudentGiven(q); validateStudentMarkup(q); });
    check(report, `${name}/blank-response-grids`, () => validateBlankGrids(q, r));
    check(report, `${name}/teacher-source-view-and-plane`, () => validateTeacher(q, r));
    check(report, `${name}/answer-solution`, () => {
      const value = audit.expectedAnswer(r, level);
      const expected = Array.isArray(value) ? value.map((n, i) => `(${i + 1}) ${n}\uAC1C`).join("; ") : `${value}\uAC1C`;
      assert.equal(q.answer, expected, "presentation: independent formatted answer");
      assert.equal(q.solution, pure.solutionText); assert.equal(q.answerKeyVisual, true);
    });
    check(report, `${name}/response-mode`, () => audit.validateResponse(q, id, level));
    check(report, `${name}/release`, () => audit.validateRelease(q));
  }
  const original = presentation.render(ids[1], 0, 2), r = reference(independent, ids[1], 0);
  function altered(field, mutate) { const q = clone(original), tree = parseMarkup(q[field]); mutate(tree); return tree; }
  function gridNegative(name, field, mutate, mode, expected) {
    negative(report, name, () => {
      const tree = altered(field, mutate);
      validateGrid(elements(tree, "svg")[0], r, r.n, mode);
    }, expected);
  }
  gridNegative("colored-blank-cell", "prompt", tree => { elements(tree, "rect")[0].attributes.fill = "#cedfcf"; }, "blank", /svg: wrong cell fill/);
  gridNegative("selected-blank-cell", "prompt", tree => { elements(tree, "rect")[0].attributes["data-selected"] = "true"; }, "blank", /svg: selected cut\/touch\/blank cells/);
  gridNegative("blank-cut-trace", "prompt", tree => {
    elements(tree, "svg")[0].elements.push({ type: "element", name: "line", attributes: { "data-role": "plane-trace", x1: "8", y1: "8", x2: "34", y2: "34" } });
  }, "blank", /svg: blank\/touch must have no traces/);
  gridNegative("relabeled-layer", "answerVisual", tree => { elements(tree, "svg")[0].attributes["data-layer"] = "1"; }, "cut", /svg: wrong layer label/);
  gridNegative("flipped-source-row-axis", "answerVisual", tree => {
    for (const rect of elements(elements(tree, "svg")[0], "rect")) rect.attributes.y = String(8 + Number(rect.attributes["data-z"]) * 26);
  }, "cut", /svg: source reversed z-axis/);
  gridNegative("wrong-trace-endpoint", "answerVisual", tree => { elements(tree, "line")[0].attributes.x1 = String(numberAttr(elements(tree, "line")[0], "x1") - 13); }, "cut", /svg: endpoint off actual plane/);
  gridNegative("teacher-cut-relocated-same-count", "answerVisual", tree => {
    const rects = elements(elements(tree, "svg")[0], "rect"), selected = rects.find(rect => attr(rect, "data-selected") === "true"), blank = rects.find(rect => attr(rect, "data-selected") === "false");
    selected.attributes["data-selected"] = "false"; selected.attributes.fill = "#fff";
    blank.attributes["data-selected"] = "true"; blank.attributes.fill = "#cedfcf";
  }, "cut", /svg: selected cut\/touch\/blank cells/);
  negative(report, "moved-candidate-answer-to-prompt", () => validateStudentMarkup({ ...original, prompt: original.prompt + `<div class="teacher-answer">${original.answer}</div>` }), /prompt: teacher-only content/);
  negative(report, "unmarked-candidate-answer-in-prompt", () => validateStudentMarkup({ ...original,
    prompt: original.prompt.replace(original.promptText, original.promptText + "16\uAC1C") }), /prompt: instruction\/captions only/);
  negative(report, "count-table-on-problem", () => validateStudentMarkup({ ...original, prompt: original.prompt + "<table><tr><td>16</td></tr></table>" }), /prompt: answer table/);
  negative(report, "equality-on-problem", () => validateStudentMarkup({ ...original, prompt: original.prompt + "<div>7+5+3+1=16</div>" }), /prompt: equality leak/);
  negative(report, "filled3D-on-problem", () => validateStudentMarkup({ ...original, prompt: original.prompt.replace('data-cut-solid="given"', 'data-cut-solid="answer"') }), /prompt: filled3D answer mount/);
  negative(report, "missing-all-blank-grids", () => validateBlankGrids({ ...original, prompt: "<div></div>" }, r), /prompt: all blank response layers/);
  const rectangular = presentation.render(ids[0], 0, 1), rectangularRef = reference(independent, ids[0], 0);
  negative(report, "rectangular-grid-squared", () => {
    const svg = elements(parseMarkup(rectangular.answerVisual), "svg")[0], side = rectangularRef.depth * 26 + 16;
    svg.attributes.viewBox = `0 0 ${side} ${side}`; svg.attributes.width = String(side);
    validateGrid(svg, rectangularRef, rectangularRef.height, "cut");
  }, /svg: physical rectangle viewBox/);
  negative(report, "rectangular-trace-replaced-with-cube-formula", () => {
    const svg = elements(parseMarkup(rectangular.answerVisual), "svg")[0], line = elements(svg, "line")[0];
    const traceHeight = rectangularRef.height - 1;
    line.attributes.x1 = String(8 + rectangularRef.height * 26);
    line.attributes.y1 = String(8 + (rectangularRef.depth - traceHeight) * 26);
    validateGrid(svg, rectangularRef, rectangularRef.height, "cut");
  }, /svg: endpoint off actual plane/);
  const invalid = [undefined, null, -1, 3, 1.5, "0", NaN, Infinity, {}, []];
  for (const value of invalid) {
    check(report, `invalid-variant/${String(value)}`, () => assert.throws(() => presentation.render(ids[0], value, 1), RangeError));
    check(report, `invalid-level/${String(value)}`, () => assert.throws(() => presentation.render(ids[0], 0, value), RangeError));
  }
  for (const value of [undefined, null, "other", {}, []]) check(report, `invalid-source/${String(value)}`, () => assert.throws(() => presentation.render(value, 0, 1), RangeError));
  const pure = contracts.generate(ids[1], 0, 2);
  for (const layer of [undefined, null, 0, -1, 5, 1.5, "1", NaN]) check(report, `invalid-grid-layer/${String(layer)}`, () => assert.throws(() => presentation.grid(pure, layer, "blank"), RangeError));
  for (const mode of [undefined, null, "answer", "Blank", {}, []]) check(report, `invalid-grid-mode/${String(mode)}`, () => assert.throws(() => presentation.grid(pure, 4, mode), RangeError));
  return audit.finish(report, "presentation-audit.json");
}
module.exports = { validateGrid, validateStudentMarkup, validateBlankGrids, validateTeacher, run };
if (require.main === module) {
  try { const report = run(); console.log(JSON.stringify({ status: report.status, cases: report.cases.length,
    checks: report.checkCount, failures: report.failedChecks, report: path.join(audit.evidenceRoot, "contract-audit/presentation-audit.json") }));
    if (report.status !== "passed") process.exitCode = 1;
  } catch (error) { console.error(error.stack); process.exitCode = 1; }
}
