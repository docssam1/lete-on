#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const path = require("node:path");
const lessonValidator = require("./validate-private-sasmo-english-lessons.cjs");
const mediaValidator = require("./validate-private-sasmo-question-media.cjs");
const intakeValidator = require("./validate-private-sasmo-diagnostic.cjs");

const SAMPLE_QUESTIONS = Object.freeze([6, 16, 7, 20]);
const CONCEPT_SCHEMA = "gfield-private-english-concept-lesson-v1";

function fail(code) { const error = new Error(code); error.code = code; throw error; }
function esc(value) { return String(value).replace(/&/gu,"&amp;").replace(/</gu,"&lt;").replace(/>/gu,"&gt;").replace(/"/gu,"&quot;").replace(/'/gu,"&#39;"); }
function inside(parent, child) { const relative = path.relative(parent, child); return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative)); }
function arg(args, name) { const index = args.indexOf(name); if (index < 0 || !args[index + 1]) fail("WHITEBOARD_COMMAND_INVALID"); return args[index + 1]; }
function jsonScript(value) { return JSON.stringify(value).replace(/</gu,"\\u003c"); }

function loadConcept(rootValue, fileName) {
  const root = intakeValidator.assertExternalPrivateRoot(rootValue);
  if (!/^sasmo-g6-concept-[a-z0-9-]+\.json$/u.test(fileName)) fail("WHITEBOARD_CONCEPT_FILE_INVALID");
  const filePath = path.resolve(root, fileName);
  if (!inside(root, filePath)) fail("WHITEBOARD_CONCEPT_FILE_INVALID");
  let concept;
  try { concept = JSON.parse(fs.readFileSync(filePath,"utf8")); } catch (_error) { fail("WHITEBOARD_CONCEPT_JSON_INVALID"); }
  const keys = ["schemaVersion","conceptId","language","title","subtitle","learningGoal","estimatedMinutes","linkedSkills","segments","reflectionPrompt"];
  if (!concept || typeof concept !== "object" || Array.isArray(concept) || Object.keys(concept).some(function(key){return !keys.includes(key);})) fail("WHITEBOARD_CONCEPT_INVALID");
  if (concept.schemaVersion !== CONCEPT_SCHEMA || concept.language !== "en-US" || concept.conceptId !== "ratio-common-totals" || !Number.isInteger(concept.estimatedMinutes) || concept.estimatedMinutes < 2 || concept.estimatedMinutes > 4) fail("WHITEBOARD_CONCEPT_INVALID");
  if (!Array.isArray(concept.segments) || concept.segments.length < 5 || concept.segments.length > 9) fail("WHITEBOARD_CONCEPT_SEGMENTS_INVALID");
  concept.segments.forEach(function(segment,index){
    if (!segment || typeof segment !== "object" || !/^[a-z][a-z0-9-]+$/u.test(segment.segmentId) || typeof segment.narration !== "string" || segment.narration.length < 30 || typeof segment.math !== "string" || !segment.math || typeof segment.visualTarget !== "string") fail(`WHITEBOARD_CONCEPT_SEGMENT_${index}_INVALID`);
  });
  return concept;
}

function outputPath(value) {
  const output = path.resolve(value);
  const project = fs.realpathSync(path.resolve(__dirname,".."));
  if (inside(project,output) || path.extname(output).toLowerCase() !== ".html") fail("WHITEBOARD_OUTPUT_INVALID");
  fs.mkdirSync(path.dirname(output),{recursive:true});
  intakeValidator.assertExternalPrivateRoot(path.dirname(output));
  return output;
}

function conceptBoard() {
  const cells = Array.from({length:20},function(_v,index){return `<span class="ratio-cell${index < 5 ? " part-a" : ""}${index >= 5 && index < 9 ? " part-b" : ""}"></span>`;}).join("");
  return `<div class="concept-board teaching-board" aria-label="Animated ratio bar model">
    <div class="board-beat" data-beat-id="notice-the-language"><span class="beat-label">Part and rest</span><div class="bar four"><i></i><i></i><i></i><i></i></div><p>part : rest = 1 : 3</p></div>
    <div class="board-beat" data-beat-id="build-the-whole"><span class="beat-label">Build the whole</span><p class="large-math">1 + 3 = 4 equal parts</p></div>
    <div class="board-beat" data-beat-id="write-the-fraction"><span class="beat-label">Share of the whole</span><p class="large-math">${mathMarkup("part / whole = 1 / 4")}</p></div>
    <div class="board-beat" data-beat-id="compare-another-share"><span class="beat-label">A second relationship</span><div class="bar five"><i></i><i></i><i></i><i></i><i></i></div><p>1 : 4 becomes ${fractionMarkup("1","5","one fifth")}</p></div>
    <div class="board-beat wide" data-beat-id="choose-a-common-total"><span class="beat-label">One common total</span><div class="twenty-grid">${cells}</div><p>${mathMarkup("1/4 = 5/20 · 1/5 = 4/20")}</p></div>
    <div class="board-beat" data-beat-id="thinking-pause"><span class="beat-label">Thinking pause</span><p>Why must every bar represent the same whole?</p></div>
    <div class="board-beat" data-beat-id="recap"><span class="beat-label">Rule</span><p>part : rest → part ÷ whole → common total</p></div>
  </div>`;
}

function round(value) { return Number(value.toFixed(3)); }
function vector(from, to) { return { x: to.x - from.x, y: to.y - from.y }; }
function add(point, offset) { return { x: point.x + offset.x, y: point.y + offset.y }; }
function length(offset) { return Math.hypot(offset.x, offset.y); }
function distance(first, second) { return length(vector(first, second)); }
function dot(first, second) { return first.x * second.x + first.y * second.y; }
function rotateCounterClockwise(offset) { return { x: -offset.y, y: offset.x }; }
function degrees(radians) { return radians * 180 / Math.PI; }
function direction(vertex, point) { return Math.atan2(point.y - vertex.y, point.x - vertex.x); }
function normalizedClockwiseDelta(start, end) {
  let delta = end - start;
  while (delta < 0) delta += Math.PI * 2;
  while (delta >= Math.PI * 2) delta -= Math.PI * 2;
  return delta;
}
function minorAngle(first, vertex, second) {
  const clockwise = normalizedClockwiseDelta(direction(vertex, first), direction(vertex, second));
  return degrees(Math.min(clockwise, Math.PI * 2 - clockwise));
}
function point(id, value) { return Object.freeze({ id, x: round(value.x), y: round(value.y) }); }
function segment(id, from, to, role) { return Object.freeze({ id, from, to, role: role || "given" }); }
function angle(id, vertex, start, end, expectedDegrees, radius, labelRadius, role) {
  return Object.freeze({ id, vertex, start, end, expectedDegrees, radius, labelRadius, role });
}

function buildQ6GeometryModel() {
  const side = 160;
  const D = point("D", { x: 200, y: 60 });
  const E = point("E", { x: D.x + side, y: D.y });
  const C = point("C", { x: (D.x + E.x) / 2, y: D.y + Math.sqrt(3) * side / 2 });
  const leftOffset = rotateCounterClockwise(vector(D, C));
  const rightOffset = rotateCounterClockwise(vector(C, E));
  const A = point("A", add(D, leftOffset));
  const B = point("B", add(C, leftOffset));
  const F = point("F", add(E, rightOffset));
  const G = point("G", add(C, rightOffset));
  const points = Object.freeze({ A, B, C, D, E, F, G });
  const segments = Object.freeze([
    segment("segment-ad", "A", "D"), segment("segment-dc", "D", "C"),
    segment("segment-cb", "C", "B"), segment("segment-ba", "B", "A"),
    segment("segment-ce", "C", "E"), segment("segment-ef", "E", "F"),
    segment("segment-fg", "F", "G"), segment("segment-gc", "G", "C"),
    segment("segment-de", "D", "E"),
    segment("auxiliary-ae", "A", "E", "auxiliary"),
    segment("auxiliary-ac", "A", "C", "auxiliary")
  ]);
  const angles = Object.freeze([
    angle("angle-adc", "D", "C", "A", 90, 19, 33, "given-square-angle"),
    angle("angle-cde", "D", "E", "C", 60, 27, 38, "given-equilateral-angle"),
    angle("angle-ade", "D", "E", "A", 150, 53, 88, "derived-large-angle"),
    angle("angle-ead", "A", "D", "E", 15, 25, 32, "derived-isosceles-angle"),
    angle("angle-dac", "A", "D", "C", 45, 62, 115, "square-diagonal-angle"),
    angle("angle-eac", "A", "E", "C", 30, 42, 72, "answer-angle")
  ]);
  const model = Object.freeze({ viewBox: Object.freeze({ x: 25, y: 24, width: 510, height: 286 }), side, points, segments, angles });
  validateQ6GeometryModel(model);
  return model;
}

function approximately(actual, expected, tolerance, code) {
  if (Math.abs(actual - expected) > tolerance) fail(code);
}

function validateQ6GeometryModel(model) {
  const p = model.points;
  const sideLengths = [distance(p.A,p.D),distance(p.D,p.C),distance(p.C,p.B),distance(p.B,p.A),distance(p.C,p.E),distance(p.E,p.F),distance(p.F,p.G),distance(p.G,p.C),distance(p.D,p.E)];
  sideLengths.forEach(function (actual) { approximately(actual, model.side, 0.002, "WHITEBOARD_Q06_SIDE_LENGTH_INVALID"); });
  approximately(dot(vector(p.D,p.A),vector(p.D,p.C)), 0, 0.02, "WHITEBOARD_Q06_LEFT_SQUARE_INVALID");
  approximately(dot(vector(p.E,p.C),vector(p.E,p.F)), 0, 0.02, "WHITEBOARD_Q06_RIGHT_SQUARE_INVALID");
  model.angles.forEach(function (entry) {
    approximately(minorAngle(p[entry.start], p[entry.vertex], p[entry.end]), entry.expectedDegrees, 0.002, `WHITEBOARD_Q06_${entry.id.toUpperCase().replace(/-/gu,"_")}_INVALID`);
  });
  return true;
}

function coord(value) { return round(value).toString(); }
function svgLine(entry, model, className) {
  const first = model.points[entry.from];
  const second = model.points[entry.to];
  return `<line id="${entry.id}" class="${className || "geometry-segment"}" data-layout-role="segment" data-owner-id="${entry.id}" x1="${coord(first.x)}" y1="${coord(first.y)}" x2="${coord(second.x)}" y2="${coord(second.y)}"/>`;
}
function angleGeometry(entry, model) {
  const vertex = model.points[entry.vertex];
  const startPoint = model.points[entry.start];
  const endPoint = model.points[entry.end];
  const start = direction(vertex, startPoint);
  const delta = normalizedClockwiseDelta(start, direction(vertex, endPoint));
  const startPosition = { x: vertex.x + entry.radius * Math.cos(start), y: vertex.y + entry.radius * Math.sin(start) };
  const endPosition = { x: vertex.x + entry.radius * Math.cos(start + delta), y: vertex.y + entry.radius * Math.sin(start + delta) };
  const labelDirection = start + delta / 2;
  const label = { x: vertex.x + entry.labelRadius * Math.cos(labelDirection), y: vertex.y + entry.labelRadius * Math.sin(labelDirection) };
  return { path: `M ${coord(startPosition.x)} ${coord(startPosition.y)} A ${entry.radius} ${entry.radius} 0 ${delta > Math.PI ? 1 : 0} 1 ${coord(endPosition.x)} ${coord(endPosition.y)}`, label };
}
function svgAngle(entry, model, label) {
  const geometry = angleGeometry(entry, model);
  return `<g id="${entry.id}" data-layout-role="angle-sector" data-angle-start="${entry.start}" data-angle-end="${entry.end}" data-owner-id="${entry.vertex}" data-angle-degrees="${entry.expectedDegrees}"><path d="${geometry.path}"/><text data-label-for="${entry.id}" x="${coord(geometry.label.x)}" y="${coord(geometry.label.y)}">${esc(label || `${entry.expectedDegrees}°`)}</text></g>`;
}
function equalityTick(entry, model, id) {
  const first = model.points[entry.from];
  const second = model.points[entry.to];
  const offset = vector(first, second);
  const magnitude = length(offset);
  const normal = { x: -offset.y / magnitude, y: offset.x / magnitude };
  const middle = { x: (first.x + second.x) / 2, y: (first.y + second.y) / 2 };
  const half = 7;
  return `<line id="${id}" data-layout-role="equal-mark" data-owner-id="${entry.id}" x1="${coord(middle.x-normal.x*half)}" y1="${coord(middle.y-normal.y*half)}" x2="${coord(middle.x+normal.x*half)}" y2="${coord(middle.y+normal.y*half)}"/>`;
}
function pointLabels(model) {
  const values = Object.values(model.points);
  const center = values.reduce(function (sum, entry) { return { x: sum.x + entry.x / values.length, y: sum.y + entry.y / values.length }; }, { x: 0, y: 0 });
  return values.map(function (entry) {
    let away = vector(center, entry);
    if (length(away) < 18) away = { x: 0, y: 1 };
    const magnitude = length(away);
    const offset = { x: away.x / magnitude * 18, y: away.y / magnitude * 18 };
    const anchor = offset.x < -4 ? "end" : offset.x > 4 ? "start" : "middle";
    return `<text data-layout-role="point-label" data-label-for="point-${entry.id}" text-anchor="${anchor}" dominant-baseline="middle" x="${coord(entry.x+offset.x)}" y="${coord(entry.y+offset.y)}">${entry.id}</text>`;
  }).join("");
}

function q6Board(lesson) {
  const model = buildQ6GeometryModel();
  const baseSegments = model.segments.filter(function (entry) { return entry.role === "given"; }).map(function (entry) { return svgLine(entry, model); }).join("");
  const ae = model.segments.find(function (entry) { return entry.id === "auxiliary-ae"; });
  const ac = model.segments.find(function (entry) { return entry.id === "auxiliary-ac"; });
  const ad = model.segments.find(function (entry) { return entry.id === "segment-ad"; });
  const de = model.segments.find(function (entry) { return entry.id === "segment-de"; });
  const byId = Object.fromEntries(model.angles.map(function (entry) { return [entry.id, entry]; }));
  return `<div class="geometry-board teaching-board q6-board" aria-label="Angle-chase teaching diagram">
    <svg viewBox="${model.viewBox.x} ${model.viewBox.y} ${model.viewBox.width} ${model.viewBox.height}" role="img" aria-label="Two calculated squares, equilateral triangle CED, and the auxiliary rays needed for angle EAC">
      <g class="base-geometry">${baseSegments}</g>
      <g class="labels">${pointLabels(model)}</g>
      <g class="angle-mark board-beat" data-beat-id="q06-step-1">${svgAngle(byId["angle-adc"],model)}${svgAngle(byId["angle-cde"],model)}${svgAngle(byId["angle-ade"],model)}</g>
      <g class="construction-mark board-beat" data-beat-id="q06-step-2">${svgLine(ae,model,"auxiliary-segment")}${equalityTick(ad,model,"equal-ad")}${equalityTick(de,model,"equal-de")}${svgAngle(byId["angle-ead"],model)}</g>
      <g class="answer-mark board-beat" data-beat-id="q06-step-3">${svgLine(ac,model,"auxiliary-segment")}${svgAngle(byId["angle-dac"],model)}${svgAngle(byId["angle-eac"],model)}</g>
    </svg><p class="board-beat board-intro" data-beat-id="q06-intro">${esc(lesson.conceptGoal)}</p>
  </div>`;
}

function q16Point(id, column, row, side, originX, originY) {
  return point(id, { x: originX + column * side / 2, y: originY + row * Math.sqrt(3) * side / 2 });
}

function straightSegmentPathExists(model, fromId, toId) {
  const from = model.points[fromId];
  const to = model.points[toId];
  const whole = vector(from, to);
  const adjacency = new Map(Object.keys(model.points).map(function (id) { return [id, []]; }));
  model.segments.forEach(function (entry) {
    adjacency.get(entry.from).push(entry.to);
    adjacency.get(entry.to).push(entry.from);
  });
  const queue = [fromId];
  const visited = new Set(queue);
  while (queue.length) {
    const currentId = queue.shift();
    if (currentId === toId) return true;
    const current = model.points[currentId];
    adjacency.get(currentId).forEach(function (nextId) {
      if (visited.has(nextId)) return;
      const step = vector(current, model.points[nextId]);
      const cross = step.x * whole.y - step.y * whole.x;
      const perpendicularDistance = Math.abs(cross) / length(whole);
      if (perpendicularDistance > 0.005 || dot(step, whole) <= 0) return;
      visited.add(nextId);
      queue.push(nextId);
    });
  }
  return false;
}

function enumerateQ16Triangles(model) {
  const ids = Object.keys(model.points);
  const triangles = [];
  for (let first = 0; first < ids.length; first += 1) {
    for (let second = first + 1; second < ids.length; second += 1) {
      for (let third = second + 1; third < ids.length; third += 1) {
        const vertices = [ids[first], ids[second], ids[third]];
        const lengths = [
          distance(model.points[vertices[0]], model.points[vertices[1]]),
          distance(model.points[vertices[0]], model.points[vertices[2]]),
          distance(model.points[vertices[1]], model.points[vertices[2]])
        ];
        if (Math.max(...lengths) - Math.min(...lengths) > 0.02) continue;
        if (!straightSegmentPathExists(model, vertices[0], vertices[1]) || !straightSegmentPathExists(model, vertices[0], vertices[2]) || !straightSegmentPathExists(model, vertices[1], vertices[2])) continue;
        const sizeClass = Math.round(lengths[0] / model.side);
        triangles.push(Object.freeze({ id: `triangle-${vertices.join("-").toLowerCase()}`, vertices: Object.freeze(vertices), sizeClass }));
      }
    }
  }
  return Object.freeze(triangles);
}

function validateQ16TriangleModel(model) {
  if (Object.keys(model.points).length !== 18 || model.segments.length !== 36 || model.triangles.length !== 32) fail("WHITEBOARD_Q16_GRAPH_INVALID");
  const expected = new Map([[1, 19], [2, 10], [3, 3]]);
  expected.forEach(function (count, sizeClass) {
    if (model.triangles.filter(function (entry) { return entry.sizeClass === sizeClass; }).length !== count) fail(`WHITEBOARD_Q16_SIZE_${sizeClass}_COUNT_INVALID`);
  });
  if (model.triangles.some(function (entry) { return entry.sizeClass < 1 || entry.sizeClass > 3 || new Set(entry.vertices).size !== 3; })) fail("WHITEBOARD_Q16_TRIANGLE_INVALID");
  return true;
}

function buildQ16TriangleModel() {
  const side = 72;
  const originX = 90;
  const originY = 28;
  const points = {};
  [0, 2, 4, 6].forEach(function (column, index) { points[`A${index}`] = q16Point(`A${index}`, column, 0, side, originX, originY); });
  [-1, 1, 3, 5, 7].forEach(function (column, index) { points[`B${index}`] = q16Point(`B${index}`, column, 1, side, originX, originY); });
  [0, 2, 4, 6].forEach(function (column, index) { points[`C${index}`] = q16Point(`C${index}`, column, 2, side, originX, originY); });
  [1, 3, 5].forEach(function (column, index) { points[`D${index}`] = q16Point(`D${index}`, column, 3, side, originX, originY); });
  [2, 4].forEach(function (column, index) { points[`E${index}`] = q16Point(`E${index}`, column, 4, side, originX, originY); });
  const edgePairs = [
    ["A0","A1"],["A1","A2"],["A2","A3"],
    ["B0","B1"],["B1","B2"],["B2","B3"],["B3","B4"],
    ["C0","C1"],["C1","C2"],["C2","C3"],["D0","D1"],["D1","D2"],
    ["A0","B1"],["A1","B1"],["A1","B2"],["A2","B2"],["A2","B3"],["A3","B3"],
    ["B0","C0"],["B1","C0"],["B1","C1"],["B2","C1"],["B2","C2"],["B3","C2"],["B3","C3"],["B4","C3"],
    ["C0","D0"],["C1","D0"],["C1","D1"],["C2","D1"],["C2","D2"],["C3","D2"],
    ["D0","E0"],["D1","E0"],["D1","E1"],["D2","E1"]
  ];
  const segments = Object.freeze(edgePairs.map(function (pair, index) { return segment(`q16-edge-${String(index + 1).padStart(2, "0")}`, pair[0], pair[1]); }));
  const partial = { side, points: Object.freeze(points), segments };
  const model = Object.freeze({ side, points: partial.points, segments, triangles: enumerateQ16Triangles(partial), viewBox: Object.freeze({ x: 35, y: 16, width: 330, height: 310 }) });
  validateQ16TriangleModel(model);
  return model;
}

function q16TrianglePolygon(entry, model, index) {
  const values = entry.vertices.map(function (id) { return model.points[id]; });
  const center = values.reduce(function (sum, value) { return { x: sum.x + value.x / 3, y: sum.y + value.y / 3 }; }, { x: 0, y: 0 });
  const ordered = values.slice().sort(function (first, second) { return Math.atan2(first.y - center.y, first.x - center.x) - Math.atan2(second.y - center.y, second.x - center.x); });
  return `<g class="counted-triangle size-${entry.sizeClass}" data-layout-role="counted-triangle" data-size-class="${entry.sizeClass}" data-count-index="${index + 1}" data-vertices="${entry.vertices.join(" ")}"><polygon points="${ordered.map(function (value) { return `${coord(value.x)},${coord(value.y)}`; }).join(" ")}"/><text x="${coord(center.x)}" y="${coord(center.y)}">${index + 1}</text></g>`;
}

function q16ClassSvg(model, sizeClass) {
  const selected = model.triangles.filter(function (entry) { return entry.sizeClass === sizeClass; }).map(function (entry) {
    const center = entry.vertices.reduce(function (sum, id) { return { x: sum.x + model.points[id].x / 3, y: sum.y + model.points[id].y / 3 }; }, { x: 0, y: 0 });
    return { entry, center };
  }).sort(function (first, second) { return first.center.y - second.center.y || first.center.x - second.center.x || first.entry.id.localeCompare(second.entry.id); });
  const base = model.segments.map(function (entry) { return svgLine(entry, model, "triangle-grid-segment"); }).join("");
  const overlays = selected.map(function (record, index) { return q16TrianglePolygon(record.entry, model, index); }).join("");
  return `<svg viewBox="${model.viewBox.x} ${model.viewBox.y} ${model.viewBox.width} ${model.viewBox.height}" role="img" aria-label="All ${selected.length} size ${sizeClass} triangles counted on the reconstructed source grid"><g class="triangle-grid">${base}</g><g class="triangle-count-overlays">${overlays}</g></svg>`;
}

function q16Board(lesson) {
  const model = buildQ16TriangleModel();
  const cards = [[1,19,"one unit side"],[2,10,"two unit sides"],[3,3,"three unit sides"]].map(function (entry) {
    return `<figure class="q16-count-card" data-layout-role="triangle-count-panel" data-size-class="${entry[0]}">${q16ClassSvg(model,entry[0])}<figcaption><span>Size ${entry[0]} · ${entry[2]}</span><strong>${entry[1]}</strong></figcaption></figure>`;
  }).join("");
  return `<div class="triangle-count-board teaching-board q16-board" aria-label="Source-faithful triangle count by side length">
    <div class="board-beat board-intro" data-beat-id="q16-intro"><span class="beat-label">Goal</span><p>${esc(lesson.conceptGoal)}</p></div>
    <div class="board-beat q16-size-key" data-beat-id="q16-step-1"><span class="beat-label">Use one non-overlapping classification</span><p>Count triangles with side length 1, 2, or 3 grid units. No fourth size has all three sides in the source drawing.</p></div>
    <div class="board-beat q16-count-panels" data-beat-id="q16-step-2">${cards}</div>
    <div class="board-beat q16-total" data-beat-id="q16-step-3"><span>Every triangle appears in exactly one panel.</span><strong>19 + 10 + 3 = 32</strong></div>
  </div>`;
}

function validateQ7UnitBarModel(model) {
  const byId = Object.fromEntries(model.people.map(function (entry) { return [entry.id, entry]; }));
  const A = byId.A.halfUnits;
  const B = byId.B.halfUnits;
  const C = byId.C.halfUnits;
  const D = byId.D.halfUnits;
  if (A * 2 !== B || D !== B || C * 2 !== A + B || D - C !== 1) fail("WHITEBOARD_Q07_RELATION_INVALID");
  if (model.halfUnitValue !== 10 || model.people.reduce(function (sum, entry) { return sum + entry.halfUnits; }, 0) * model.halfUnitValue !== 130) fail("WHITEBOARD_Q07_TOTAL_INVALID");
  const solutions = [];
  for (let a = 0; a <= 200; a += 1) {
    for (let b = 0; b <= 200; b += 1) {
      if (a * 2 !== b) continue;
      const c = (a + b) / 2;
      const d = b;
      if (Number.isInteger(c) && d - c === 10) solutions.push([a,b,c,d]);
    }
  }
  if (solutions.length !== 1 || solutions[0].join(",") !== "20,40,30,40") fail("WHITEBOARD_Q07_UNIQUE_SOLUTION_INVALID");
  return true;
}

function buildQ7UnitBarModel() {
  const model = Object.freeze({
    halfUnitValue: 10,
    people: Object.freeze([
      Object.freeze({ id: "A", name: "Annabelle", halfUnits: 2 }),
      Object.freeze({ id: "B", name: "Betty", halfUnits: 4 }),
      Object.freeze({ id: "C", name: "Cynthia", halfUnits: 3 }),
      Object.freeze({ id: "D", name: "Dora", halfUnits: 4 })
    ])
  });
  validateQ7UnitBarModel(model);
  return model;
}

function fractionMarkup(numerator, denominator, spoken) {
  return `<span class="stacked-fraction" role="img" aria-label="${esc(spoken)}"><span>${esc(numerator)}</span><span>${esc(denominator)}</span></span>`;
}

function mathMarkup(value) {
  return String(value).split(/(\b\d+\s*\/\s*\d+\b)/gu).map(function (part) {
    const fraction = part.match(/^(\d+)\s*\/\s*(\d+)$/u);
    if (fraction) return fractionMarkup(fraction[1],fraction[2],`${fraction[1]} over ${fraction[2]}`);
    const symbols = part
      .replace(/\b(\d+(?:\.\d+)?)\s+deg\b/gu,"$1°")
      .replace(/\s+x\s+/gu," × ")
      .replace(/\s+\/\s+/gu," ÷ ")
      .replace(/\s*->\s*/gu," → ");
    return esc(symbols);
  }).join("");
}

function normalizedAlignmentMath(value) {
  return String(value)
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[−–—]/gu,"-")
    .replace(/×/gu,"x")
    .replace(/÷/gu,"/")
    .replace(/°/gu,"deg")
    .replace(/\s+/gu,"");
}

function sampleAlignmentFailure(questionNumber) {
  fail(`WHITEBOARD_Q${String(questionNumber).padStart(2,"0")}_LESSON_ALIGNMENT_INVALID`);
}

function validateSampleBoardAlignment(lesson) {
  const questionNumber = Number(lesson && lesson.questionNumber);
  if (!SAMPLE_QUESTIONS.includes(questionNumber)) return true;
  if (!lesson || !Array.isArray(lesson.steps) || !lesson.finalAnswer) sampleAlignmentFailure(questionNumber);
  const math = lesson.steps.map(function (step) { return normalizedAlignmentMath(step && step.math); }).join("|");
  const answerValue = normalizedAlignmentMath(lesson.finalAnswer.value);
  const answerDisplay = normalizedAlignmentMath(lesson.finalAnswer.display);
  const matchesExactly = function (fragments) {
    return math === fragments.map(normalizedAlignmentMath).join("|");
  };
  const displayHasWholeNumber = function (value) {
    return new RegExp(`(?:^|[^0-9.])${value}(?:[^0-9.]|$)`,"u").test(answerDisplay);
  };

  if (questionNumber === 6) {
    const angles = Object.fromEntries(buildQ6GeometryModel().angles.map(function (entry) { return [entry.id, entry.expectedDegrees]; }));
    if (!matchesExactly([
      `angle ADE = ${angles["angle-adc"]} deg + ${angles["angle-cde"]} deg = ${angles["angle-ade"]} deg`,
      `angle EAD = (180 deg - ${angles["angle-ade"]} deg) / 2 = ${angles["angle-ead"]} deg`,
      `angle EAC = ${angles["angle-dac"]} deg - ${angles["angle-ead"]} deg = ${angles["angle-eac"]} deg`
    ]) || answerValue !== "d" || !displayHasWholeNumber(angles["angle-eac"])) sampleAlignmentFailure(questionNumber);
  }

  if (questionNumber === 7) {
    const model = buildQ7UnitBarModel();
    const people = Object.fromEntries(model.people.map(function (entry) { return [entry.id, entry.halfUnits]; }));
    const totalBlocks = model.people.reduce(function (sum, entry) { return sum + entry.halfUnits; }, 0);
    const totalCoins = totalBlocks * model.halfUnitValue;
    const allLessonText = JSON.stringify(lesson);
    if (!matchesExactly([
      `A=${people.A} blocks, B=${people.B} blocks, D=${people.D} blocks`,
      `C = (${people.A} + ${people.B}) / 2 = ${people.C} blocks`,
      `1 small block = ${model.halfUnitValue} coins`,
      `(${people.A} + ${people.B} + ${people.C} + ${people.D}) x ${model.halfUnitValue} = ${totalCoins} coins`
    ]) || /\b(?:0\.5|1\.5)\s*(?:u\b|units?\b)/iu.test(allLessonText) || answerValue !== "b" || !displayHasWholeNumber(totalCoins)) sampleAlignmentFailure(questionNumber);
  }

  if (questionNumber === 16) {
    const model = buildQ16TriangleModel();
    const counts = [1,2,3].map(function (sizeClass) { return model.triangles.filter(function (entry) { return entry.sizeClass === sizeClass; }).length; });
    const total = counts.reduce(function (sum, value) { return sum + value; }, 0);
    if (!matchesExactly([`classes: ${1 ** 2}-part, ${2 ** 2}-part, ${3 ** 2}-part`, `${counts[0]} small, ${counts[1]} medium, ${counts[2]} large`, `${counts[0]} + ${counts[1]} + ${counts[2]} = ${total}`]) || answerValue !== String(total) || !displayHasWholeNumber(total)) sampleAlignmentFailure(questionNumber);
  }

  if (questionNumber === 20) {
    const model = buildQ20ShareModel();
    const shares = model.shares;
    if (!matchesExactly([
      "A=1/4, B=1/5, C=2/7 of total",
      `A=${shares.A}u, B=${shares.B}u, C=${shares.C}u`,
      `D=${model.totalUnits}-${shares.A}-${shares.B}-${shares.C}=${shares.D}u`,
      `${shares.C}u-${shares.D}u=3u=3 candies; total=${model.totalUnits}`
    ]) || answerValue !== String(model.totalUnits) || !displayHasWholeNumber(model.totalUnits)) sampleAlignmentFailure(questionNumber);
  }
  return true;
}

function q7UnitBar(entry) {
  const blocks = Array.from({ length: entry.halfUnits }, function (_value, index) {
    const difference = entry.id === "D" && index === entry.halfUnits - 1;
    return `<i data-layout-role="unit-block"${difference ? ' data-difference-block="true"' : ""}></i>`;
  }).join("");
  return `<div class="q7-bar-row" data-layout-role="unit-bar" data-person-id="${entry.id}" data-half-units="${entry.halfUnits}"><span><b>${entry.id}</b>${esc(entry.name)}</span><div class="q7-bar">${blocks}</div><em>${entry.halfUnits} small blocks</em></div>`;
}

function q7Board(lesson) {
  const model = buildQ7UnitBarModel();
  return `<div class="unit-bar-board teaching-board q7-board" aria-label="Calculated unit bars for the four gold-coin relationships">
    <div class="board-beat board-intro" data-beat-id="q07-intro"><span class="beat-label">Goal</span><p>${esc(lesson.conceptGoal)}</p></div>
    <div class="board-beat q7-bars" data-beat-id="q07-step-1"><span class="beat-label">Translate every relationship into the same small block</span>${model.people.map(q7UnitBar).join("")}</div>
    <div class="board-beat q7-relation" data-beat-id="q07-step-2"><span>Cynthia is halfway between Annabelle and Betty.</span><strong>C = ${fractionMarkup("A + B","2","the quantity A plus B over 2")} = 3 small blocks</strong></div>
    <div class="board-beat q7-scale" data-beat-id="q07-step-3"><span>The highlighted part of Dora's bar is exactly the stated difference.</span><strong>1 small block = 10 coins</strong></div>
    <div class="board-beat q7-total" data-beat-id="q07-step-4"><span>Add 2 + 4 + 3 + 4 blocks.</span><strong>13 × 10 = 130 coins</strong></div>
  </div>`;
}

function validateQ20ShareModel(model) {
  const shares = model.shares;
  const total = model.totalUnits;
  const restA = total - shares.A;
  const restB = total - shares.B;
  const restC = total - shares.C;
  if (shares.A * 3 !== restA || shares.B * 4 !== restB || shares.C * 5 !== restC * 2) fail("WHITEBOARD_Q20_RATIO_INVALID");
  if (Object.values(shares).reduce(function (sum, value) { return sum + value; }, 0) !== total || shares.C - shares.D !== 3) fail("WHITEBOARD_Q20_TOTAL_INVALID");
  const totals = [];
  for (let candidate = 1; candidate <= 10_000; candidate += 1) {
    if (candidate % 4 || candidate % 5 || (candidate * 2) % 7) continue;
    const A = candidate / 4;
    const B = candidate / 5;
    const C = candidate * 2 / 7;
    const D = candidate - A - B - C;
    if (Number.isInteger(D) && C - D === 3) totals.push(candidate);
  }
  if (totals.length !== 1 || totals[0] !== 140) fail("WHITEBOARD_Q20_UNIQUE_SOLUTION_INVALID");
  return true;
}

function buildQ20ShareModel() {
  const model = Object.freeze({ totalUnits: 140, shares: Object.freeze({ A: 35, B: 28, C: 40, D: 37 }) });
  validateQ20ShareModel(model);
  return model;
}

function q20ShareBar(model, resolved) {
  return `<div class="q20-share-bar" data-layout-role="common-total-bar" data-total-units="${model.totalUnits}">${Object.entries(model.shares).map(function (entry) {
    const known = entry[0] !== "D" || resolved;
    const percentage = (entry[1] / model.totalUnits * 100).toFixed(6);
    return `<span class="share-${entry[0].toLowerCase()}${known ? "" : " is-unresolved"}" data-layout-role="share-segment" data-person-id="${entry[0]}" data-share-units="${entry[1]}" style="--share:${entry[1]};--share-percent:${percentage}%"><b>${entry[0]}</b><em>${known ? `${entry[1]} units` : "remainder"}</em></span>`;
  }).join("")}</div>`;
}

function q20Board(lesson) {
  const model = buildQ20ShareModel();
  return `<div class="common-total-board teaching-board q20-board" aria-label="Calculated common-total ratio model">
    <div class="board-beat board-intro" data-beat-id="q20-intro"><span class="beat-label">Goal</span><p>${esc(lesson.conceptGoal)}</p></div>
    <div class="board-beat q20-fractions" data-beat-id="q20-step-1"><span class="q20-fraction-card"><b>Andrew</b><em>A : rest = 1 : 3</em><strong>A = ${fractionMarkup("1","4","one fourth")} of the total</strong></span><span class="q20-fraction-card"><b>Barry</b><em>B : rest = 1 : 4</em><strong>B = ${fractionMarkup("1","5","one fifth")} of the total</strong></span><span class="q20-fraction-card"><b>Cassie</b><em>C : rest = 2 : 5</em><strong>C = ${fractionMarkup("2","7","two sevenths")} of the total</strong></span></div>
    <div class="board-beat q20-common" data-beat-id="q20-step-2"><span class="beat-label">Use one common total: LCM(4, 5, 7) = 140</span>${q20ShareBar(model,false)}</div>
    <div class="board-beat q20-remainder" data-beat-id="q20-step-3"><span class="beat-label">The remainder belongs to Drake</span><strong>140 − 35 − 28 − 40 = 37</strong>${q20ShareBar(model,true)}</div>
    <div class="board-beat q20-scale" data-beat-id="q20-step-4"><div><span>Cassie</span><b style="--compare-width:100%">40 units</b></div><div><span>Drake</span><b style="--compare-width:92.5%">37 units</b></div><strong>3 units = 3 candies → 1 unit = 1 candy → total = 140 candies</strong></div>
  </div>`;
}

function genericBoard(lesson, number) {
  return `<div class="teaching-board generic-board" aria-label="Step-by-step visual model">
    <div class="board-beat board-intro" data-beat-id="q${String(number).padStart(2,"0")}-intro"><span class="beat-label">Goal</span><p>${esc(lesson.conceptGoal)}</p></div>
    ${lesson.steps.map(function(step,index){return `<div class="board-beat" data-beat-id="q${String(number).padStart(2,"0")}-step-${index+1}"><span class="beat-label">${index+1}. ${esc(step.label)}</span><p>${esc(step.explanation)}</p><strong>${mathMarkup(step.math)}</strong></div>`;}).join("")}
  </div>`;
}

function playerControls(id, playLabel) {
  return `<div class="player-controls" data-controls="${esc(id)}">
    <button type="button" data-action="play">▶ ${esc(playLabel)}</button><button type="button" data-action="pause">Pause</button><button type="button" data-action="previous">← Previous</button><button type="button" data-action="next">Next →</button><button type="button" data-action="restart">Restart</button><button type="button" data-action="overview">Overview</button><button type="button" data-action="stop">Stop</button>
    <span class="progress" data-progress="${esc(id)}" aria-live="polite">0 / 0</span><label>Speed <select data-action="speed"><option value="0.85">0.85×</option><option value="1" selected>1×</option><option value="1.15">1.15×</option></select></label>
  </div><div class="caption" aria-live="polite" data-caption="${esc(id)}">Press Play lesson to hear the English explanation.</div>`;
}

function conceptPanel(concept) {
  return `<article class="sample-panel is-active" data-panel="concept">
    <header class="panel-head"><p class="eyebrow">Concept lesson · ${concept.estimatedMinutes} minutes</p><h2>${esc(concept.title)}</h2><p>${esc(concept.subtitle)}</p></header>
    <section class="goal"><strong>Learning goal</strong><p>${esc(concept.learningGoal)}</p></section>
    <section class="watch"><div class="section-title"><span>01</span><div><p>Watch the idea</p><h3>Listen and watch one relationship appear at a time.</h3></div></div>${playerControls("concept","Play concept")}${conceptBoard()}</section>
    <section class="step-study"><div class="section-title"><span>02</span><div><p>Study step by step</p><h3>Open each step at your own pace.</h3></div></div><div class="details-list">${concept.segments.map(function(segment,index){return `<details${index===0?" open":""}><summary><b>${String(index+1).padStart(2,"0")}</b>${esc(segment.title)}</summary><div><p>${esc(segment.narration)}</p><strong>${mathMarkup(segment.math)}</strong></div></details>`;}).join("")}</div></section>
    <section class="reflection"><p class="eyebrow">Try it</p><h3>${esc(concept.reflectionPrompt)}</h3></section>
  </article>`;
}

function problemPanel(lesson, item, asset, order) {
  validateSampleBoardAlignment(lesson);
  const id=`q${String(lesson.questionNumber).padStart(2,"0")}`;
  const board=lesson.questionNumber===6?q6Board(lesson):lesson.questionNumber===16?q16Board(lesson):lesson.questionNumber===7?q7Board(lesson):lesson.questionNumber===20?q20Board(lesson):genericBoard(lesson,lesson.questionNumber);
  const sourceDiagramRequired=Boolean(lesson.verification && lesson.verification.sourceDiagramRequired);
  const sourceChoicesRequired=Boolean(item && item.responseType === "multiple-choice");
  const sourceNote=sourceDiagramRequired
    ? sourceChoicesRequired
      ? "The original prompt, quantities, answer choices, labels, and diagram are preserved."
      : "The original prompt, quantities, labels, and diagram are preserved."
    : sourceChoicesRequired
      ? "The original prompt, quantities, and answer choices are preserved."
      : "The original prompt and quantities are preserved.";
  return `<article class="sample-panel" data-panel="${id}" hidden>
    <header class="panel-head"><p class="eyebrow">${order<3?"Geometry":"Algebraic reasoning"} · Actual SASMO 2019 question</p><h2>Question ${lesson.questionNumber}: ${esc(lesson.title)}</h2></header>
    <section class="actual-problem"><div class="section-title"><span>01</span><div><p>Read the actual problem</p><h3>${sourceNote}</h3></div></div><div class="question-image-frame" data-beat-id="${id}-problem"><img src="${asset.dataUri}" alt="${esc(asset.altText)}" width="${asset.width}" height="${asset.height}"></div><button type="button" class="zoom-control" aria-expanded="false">Open full-size question</button></section>
    <section class="watch"><div class="section-title"><span>02</span><div><p>Watch the solution</p><h3>English narration and the matching math step move together.</h3></div></div>${playerControls(id,"Play solution")}${board}</section>
    <section class="step-study"><div class="section-title"><span>03</span><div><p>Study step by step</p><h3>Pause, open a step, and check the equation.</h3></div></div><div class="details-list">${lesson.steps.map(function(step,index){return `<details><summary><b>${String(index+1).padStart(2,"0")}</b>${esc(step.label)}</summary><div><p>${esc(step.explanation)}</p><strong>${mathMarkup(step.math)}</strong></div></details>`;}).join("")}</div></section>
    <section class="reason"><div><p class="eyebrow">Why it works</p><p>${esc(lesson.whyItWorks)}</p></div><div><p class="eyebrow">Common mistake</p><p>${esc(lesson.commonMistake)}</p></div></section>
    <section class="answer"><button type="button" class="answer-button" aria-expanded="false">Reveal verified answer</button><strong hidden>${esc(lesson.finalAnswer.display)}</strong></section>
  </article>`;
}

function narrationData(concept, lessons, mediaAssets) {
  const result={concept:concept.segments.map(function(segment){return {id:segment.segmentId,text:segment.narration};})};
  lessons.forEach(function(lesson){
    const id=`q${String(lesson.questionNumber).padStart(2,"0")}`;
    const asset=mediaAssets.get(lesson.itemId);
    result[id]=[{id:`${id}-problem`,text:asset.spokenPrompt},{id:`${id}-intro`,text:lesson.conceptGoal}].concat(lesson.steps.map(function(step,index){return {id:`${id}-step-${index+1}`,text:`${step.label}. ${step.explanation}. ${step.math}`};}));
  });
  return result;
}

function documentHtml(options) {
  const {concept,pack,intakePack,mediaAssets}=options;
  const lessonByNumber=new Map(pack.lessons.map(function(lesson){return [lesson.questionNumber,lesson];}));
  const intakeById=new Map(intakePack.items.map(function(item){return [item.itemId,item];}));
  const selected=SAMPLE_QUESTIONS.map(function(number){const lesson=lessonByNumber.get(number);if(!lesson)fail("WHITEBOARD_SAMPLE_LESSON_MISSING");return lesson;});
  const tabs=[`<button type="button" class="lesson-tab is-current" data-show="concept" aria-current="page"><b>Concept</b><span>Common totals</span></button>`].concat(selected.map(function(lesson,index){return `<button type="button" class="lesson-tab" data-show="q${String(lesson.questionNumber).padStart(2,"0")}" aria-current="false"><b>${index<2?"Geometry":"Algebra"} ${index%2+1}</b><span>Question ${lesson.questionNumber}</span></button>`;})).join("");
  const panels=conceptPanel(concept)+selected.map(function(lesson,index){return problemPanel(lesson,intakeById.get(lesson.itemId),mediaAssets.get(lesson.itemId),index+1);}).join("");
  const narration=narrationData(concept,selected,mediaAssets);
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>G·MAP English Math Lesson Sample</title><style>
:root{--ink:#18231d;--muted:#647068;--paper:#fffefa;--wash:#efeee7;--line:#d8ddd7;--green:#174d35;--mint:#deece3;--gold:#b9893f;--red:#9b4639;font-family:"Aptos","Segoe UI",Arial,sans-serif;color:var(--ink);background:var(--wash)}*{box-sizing:border-box}body{margin:0;background:var(--wash)}button,select{font:inherit}.app{display:grid;grid-template-columns:250px minmax(0,1fr);min-height:100vh}.rail{position:sticky;top:0;height:100vh;padding:24px 16px;background:var(--ink);color:white}.brand{padding:5px 7px 22px;border-bottom:1px solid #ffffff26}.brand small{color:#b7c8bc;font-size:10px;font-weight:800;letter-spacing:.12em;text-transform:uppercase}.brand h1{margin:8px 0 0;font-family:Georgia,serif;font-size:23px;font-weight:500}.tabs{display:grid;gap:5px;margin-top:18px}.lesson-tab{display:grid;gap:3px;padding:12px;border:0;border-left:2px solid transparent;background:transparent;color:#d5dfd8;text-align:left;cursor:pointer}.lesson-tab span{font-size:11px;color:#aebdb3}.lesson-tab:hover,.lesson-tab:focus-visible{outline:none;background:#ffffff0c}.lesson-tab.is-current{border-color:#e4b96e;background:#ffffff12;color:white}.stage{min-width:0;padding:34px}.paper{max-width:1040px;margin:auto;padding:48px 56px 70px;border:1px solid #deddd5;background:var(--paper);box-shadow:0 24px 70px #34413812}.sample-panel[hidden]{display:none}.panel-head{padding-bottom:26px;border-bottom:1px solid var(--ink)}.eyebrow{margin:0 0 8px!important;color:var(--green);font-size:10px!important;font-weight:800;letter-spacing:.12em;text-transform:uppercase}.panel-head h2{max-width:800px;margin:0;font-family:Georgia,serif;font-size:clamp(32px,4vw,52px);line-height:1.05;font-weight:500;letter-spacing:-.035em}.panel-head>p:last-child{max-width:720px;margin:14px 0 0;color:var(--muted);font-size:17px;line-height:1.55}.goal{margin:26px 0;padding:18px 20px;border-left:4px solid var(--gold);background:#f7f1e5}.goal p{margin:7px 0 0;line-height:1.6}.actual-problem,.watch,.step-study{margin-top:44px}.section-title{display:grid;grid-template-columns:42px 1fr;gap:12px;align-items:start;margin-bottom:16px}.section-title>span{font-family:Georgia,serif;color:var(--gold);font-size:23px}.section-title p{margin:0;color:var(--green);font-size:10px;font-weight:800;letter-spacing:.1em;text-transform:uppercase}.section-title h3{margin:5px 0 0;font-family:Georgia,serif;font-size:22px;font-weight:500}.question-image-frame{overflow:hidden;border:1px solid #cfd5cf;background:white}.question-image-frame img{display:block;width:100%;height:auto}.question-image-frame.is-zoomed{overflow:auto}.question-image-frame.is-zoomed img{width:1300px;max-width:none}.zoom-control{margin-top:8px;padding:9px 13px;border:1px solid var(--green);background:white;color:var(--green);cursor:pointer}.player-controls{display:flex;flex-wrap:wrap;gap:7px;padding:12px;border:1px solid #cbd7ce;border-bottom:0;background:#f0f5f1}.player-controls button,.player-controls select{min-height:40px;padding:8px 12px;border:1px solid #b9c7bd;background:white;color:var(--ink);cursor:pointer}.player-controls button:first-child{background:var(--green);color:white}.player-controls label{display:flex;align-items:center;gap:6px;margin-left:auto;font-size:12px}.progress{display:flex;align-items:center;padding:0 7px;color:var(--green);font-size:12px;font-weight:800}.caption{min-height:64px;padding:13px 16px;border:1px solid #cbd7ce;background:#fff;color:#3d4b42;line-height:1.55}.teaching-board{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:12px;padding:18px;border:1px solid #cad8cd;background:#edf4ee}.board-beat{padding:14px;border:1px solid #ced9d0;background:#ffffff;color:#667169;opacity:.42;transition:opacity .2s ease,transform .2s ease,border-color .2s ease}.board-beat.is-current{border-color:var(--gold);color:var(--ink);opacity:1;transform:translateY(-2px);box-shadow:0 8px 18px #4d5c5020}.board-beat.is-complete{opacity:.78}.board-beat.wide{grid-column:1/-1}.beat-label{display:block;margin-bottom:8px;color:var(--green);font-size:10px;font-weight:800;letter-spacing:.08em;text-transform:uppercase}.board-beat p{margin:5px 0;line-height:1.5}.large-math,.generic-board strong{font-family:"Cascadia Mono",monospace}.bar{display:flex;height:38px;margin:8px 0}.bar i{flex:1;border:1px solid #547461;background:#f9fcf9}.bar i:first-child{background:#efc98a}.twenty-grid{display:grid;grid-template-columns:repeat(10,1fr);gap:3px}.ratio-cell{height:22px;border:1px solid #81948a;background:white}.part-a{background:#efc98a}.part-b{background:#9bc4aa}.geometry-board{display:block;position:relative}.geometry-board svg{display:block;width:100%;max-height:460px}.base-geometry{fill:none;stroke:#25372d;stroke-width:4}.base-geometry line,.angle-mark path,.construction-mark line,.construction-mark path,.answer-mark line,.answer-mark path{vector-effect:non-scaling-stroke}.labels{font-family:Georgia,serif;font-size:22px;font-style:italic}.labels text,.angle-mark text,.construction-mark text,.answer-mark text{paint-order:stroke fill;stroke:#edf4ee;stroke-width:5px;stroke-linejoin:round}.angle-mark,.construction-mark,.answer-mark{fill:none;stroke:var(--gold);stroke-width:4}.angle-mark text,.construction-mark text,.answer-mark text{fill:var(--red);font:700 20px "Segoe UI",sans-serif;text-anchor:middle;dominant-baseline:middle}.auxiliary-segment{stroke:var(--green);stroke-width:3;stroke-dasharray:9 7}.construction-mark [data-layout-role="equal-mark"]{stroke:var(--red);stroke-width:3}.answer-mark #angle-dac{opacity:.65}.answer-mark #angle-eac{stroke:var(--red);stroke-width:5}.q6-board .board-beat{opacity:.16}.q6-board .board-beat.is-complete{opacity:.92}.q6-board .board-beat.is-current{opacity:1;transform:none;box-shadow:none}.q6-board .board-intro{margin-top:0}.q16-board,.q7-board,.q20-board{display:block}.q16-board .board-beat,.q7-board .board-beat,.q20-board .board-beat{margin-top:10px}.q16-board .board-beat:first-child,.q7-board .board-beat:first-child,.q20-board .board-beat:first-child{margin-top:0}.q16-board .board-beat.is-complete,.q7-board .board-beat.is-complete,.q20-board .board-beat.is-complete{opacity:1}.q16-count-panels{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.q16-count-card{min-width:0;margin:0;border:1px solid #d1d9d3;background:#fbfdfb}.q16-count-card svg{display:block;width:100%;height:auto}.triangle-grid{fill:none;stroke:#87948c;stroke-width:1.5}.triangle-grid line,.counted-triangle polygon{vector-effect:non-scaling-stroke}.counted-triangle polygon{stroke-width:2}.counted-triangle text{font:700 14px "Segoe UI",sans-serif;text-anchor:middle;dominant-baseline:middle;paint-order:stroke fill;stroke:#fff;stroke-width:4px}.size-1 polygon{fill:#8cc7a755;stroke:#25704d}.size-1 text{fill:#174d35}.size-2 polygon{fill:#e7bd6b55;stroke:#a66f18}.size-2 text{fill:#7d4e08}.size-3 polygon{fill:#c86b5f55;stroke:#9b4639}.size-3 text{fill:#7b3027}.q16-count-card figcaption{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:9px;border-top:1px solid #d1d9d3;color:var(--green);font-size:11px;font-weight:700}.q16-count-card figcaption strong{font:700 22px Georgia,serif;color:var(--ink)}.q16-total{display:flex;align-items:center;justify-content:space-between;gap:16px}.q16-total strong{font:700 25px "Cascadia Mono",monospace;color:var(--green)}.q7-bars{display:grid;gap:8px}.q7-bar-row{display:grid;grid-template-columns:126px minmax(180px,1fr) 104px;gap:10px;align-items:center}.q7-bar-row>span{display:flex;align-items:center;gap:8px;font-weight:700}.q7-bar-row>span b{display:grid;place-items:center;width:26px;height:26px;border-radius:50%;background:var(--green);color:white}.q7-bar-row>em{font-size:11px;font-style:normal;color:var(--muted)}.q7-bar{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));height:34px}.q7-bar i{border:1px solid #547461;background:#afd1bb}.q7-bar i+ i{border-left:0}.q7-bar [data-difference-block="true"]{background:#efc98a;box-shadow:inset 0 0 0 2px #b17a24}.q7-relation,.q7-scale,.q7-total{display:flex;align-items:center;justify-content:space-between;gap:18px}.q7-relation strong,.q7-scale strong,.q7-total strong{font:700 18px "Cascadia Mono",monospace;color:var(--green)}.stacked-fraction{display:inline-grid;grid-template-rows:auto auto;vertical-align:middle;min-width:1.5em;margin:0 .12em;text-align:center;font-family:Georgia,serif;line-height:1}.stacked-fraction>span:first-child{padding:0 .18em .08em;border-bottom:1.5px solid currentColor}.stacked-fraction>span:last-child{padding-top:.08em}.q20-fractions{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}.q20-fraction-card{display:grid;gap:6px;padding:12px;border:1px solid #d1d9d3;background:#fbfdfb}.q20-fraction-card>b{color:var(--green)}.q20-fraction-card>em{font-size:12px;font-style:normal;color:var(--muted)}.q20-fraction-card>strong{font-family:Georgia,serif;font-size:17px}.q20-share-bar{display:flex;min-height:72px;margin-top:10px;border:2px solid var(--green);background:white;overflow:hidden}.q20-share-bar>[data-layout-role="share-segment"]{display:grid;place-content:center;min-width:0;flex:var(--share) 1 0;padding:7px;border-right:1px solid #ffffff99;text-align:center}.q20-share-bar span:last-child{border-right:0}.q20-share-bar b{font-family:Georgia,serif;font-size:20px}.q20-share-bar em{font-size:10px;font-style:normal;white-space:nowrap}.share-a{background:#a9cfb6}.share-b{background:#d9c18a}.share-c{background:#91bcca}.share-d{background:#caa49e}.q20-share-bar .is-unresolved{background:repeating-linear-gradient(135deg,#f4f0e8,#f4f0e8 8px,#e6ded0 8px,#e6ded0 16px);color:#5f625e}.q20-remainder>strong{display:block;font:700 19px "Cascadia Mono",monospace;color:var(--green)}.q20-scale{display:grid;gap:8px}.q20-scale>div{display:grid;grid-template-columns:70px minmax(0,1fr);align-items:center;gap:10px}.q20-scale>div>b{display:block;width:calc(var(--compare) * 2.5%);min-height:30px;padding:6px 10px;background:#91bcca;color:#18362d;font:700 13px "Cascadia Mono",monospace}.q20-scale>div:nth-child(2)>b{background:#caa49e}.q20-scale>strong{margin-top:5px;font:700 17px "Cascadia Mono",monospace;color:var(--green)}.generic-board{grid-template-columns:1fr}.generic-board strong{display:block;margin-top:9px;padding:10px;border-left:3px solid var(--green);background:#eef3ee}.details-list{border-top:1px solid var(--line)}details{border-bottom:1px solid var(--line)}summary{display:grid;grid-template-columns:42px 1fr;gap:10px;padding:15px 0;cursor:pointer;font-weight:700}summary b{color:var(--gold);font-family:Georgia,serif;font-size:18px}details>div{padding:0 0 18px 52px}details p{margin:0 0 10px;line-height:1.65;color:#46534b}details strong{display:block;padding:11px 13px;border-left:3px solid var(--green);background:#eef3ee;font-family:"Cascadia Mono",monospace}.reason{display:grid;grid-template-columns:1fr 1fr;gap:1px;margin-top:35px;border:1px solid var(--line);background:var(--line)}.reason>div{padding:19px;background:white}.reason p:last-child{margin:0;line-height:1.6}.answer{display:flex;align-items:center;gap:18px;margin-top:24px;padding:20px;background:var(--mint)}.answer-button{padding:11px 15px;border:0;background:var(--green);color:white;cursor:pointer}.answer strong{font-family:Georgia,serif;font-size:24px}.reflection{margin-top:30px;padding:22px;border:1px solid #c0d1c4;background:var(--mint)}.reflection h3{margin:0;font-family:Georgia,serif;font-size:22px;font-weight:500;line-height:1.45}.speaking-target{outline:3px solid #e3b768;outline-offset:3px}
.q20-scale>div>b{width:var(--compare-width)}
.q20-share-bar>[data-layout-role="share-segment"]{flex:0 0 var(--share-percent)}
@media(max-width:760px){.app{display:block}.rail{position:relative;height:auto;padding:14px}.brand{padding-bottom:12px}.brand h1{font-size:19px}.tabs{display:flex;overflow:auto;margin-top:10px}.lesson-tab{flex:0 0 112px;padding:9px}.stage{padding:0}.paper{padding:28px 16px 45px;border:0;box-shadow:none}.panel-head h2{font-size:34px}.player-controls label{width:100%;margin:0}.teaching-board,.reason{grid-template-columns:1fr}.board-beat.wide{grid-column:auto}.question-image-frame{margin-left:-16px;margin-right:-16px}.question-image-frame img{min-width:100%;}.section-title h3{font-size:19px}details>div{padding-left:0}.answer{align-items:flex-start;flex-direction:column}.geometry-board{margin-left:-16px;margin-right:-16px;padding:10px;overflow:visible}.geometry-board svg{min-width:0;max-height:none}.q16-count-panels,.q20-fractions{grid-template-columns:1fr}.q16-count-card svg{max-height:310px}.q16-total,.q7-relation,.q7-scale,.q7-total{align-items:flex-start;flex-direction:column}.q7-bar-row{grid-template-columns:82px minmax(0,1fr)}.q7-bar-row>em{grid-column:2}.q20-share-bar{min-height:62px}.q20-share-bar em{font-size:9px}.q20-scale>strong{font-size:14px}}
@page{size:A4;margin:12mm}
@media print{:root,body{background:#fff}body{-webkit-print-color-adjust:exact;print-color-adjust:exact}.app{display:block;min-height:auto}.rail,.player-controls,.caption,.zoom-control,.answer{display:none!important}.stage{padding:0}.paper{max-width:none;margin:0;padding:0;border:0;box-shadow:none}.sample-panel[hidden]{display:none!important}.panel-head{padding-bottom:5mm}.panel-head h2{font-size:28pt}.actual-problem,.watch,.step-study{margin-top:7mm}.section-title{break-after:avoid}.question-image-frame,.teaching-board,.reason,details{break-inside:avoid;page-break-inside:avoid}.question-image-frame{margin:0!important;overflow:hidden!important}.question-image-frame img{width:100%!important;max-width:100%!important}.geometry-board{margin:0!important;padding:10px!important}.geometry-board svg{max-height:105mm}.board-beat{transition:none!important}.teaching-board .board-beat{opacity:1!important}.q6-board .board-intro{border-color:#ced9d0}.details-list details:not([open])>:not(summary){display:block!important}.reason{grid-template-columns:1fr 1fr}.reason>div{padding:4mm}}
@media(prefers-reduced-motion:reduce){*{scroll-behavior:auto!important;transition:none!important;animation:none!important}}
.brand p{margin:6px 0 0;color:#b7c8bc;font-size:11px;line-height:1.4}.brand .brand-range{color:#e4b96e;font-weight:700}.concept-board .board-beat,.generic-board .board-beat{opacity:.68}.concept-board .board-beat.is-current,.generic-board .board-beat.is-current{opacity:1}.concept-board .board-beat.is-complete,.generic-board .board-beat.is-complete{opacity:.84}
.sample-panel[data-panel^="q"] .teaching-board:not(.has-progress){display:none}.sample-panel[data-panel^="q"] .teaching-board .board-beat{visibility:hidden;opacity:0}.sample-panel[data-panel^="q"] .teaching-board .board-beat.is-current,.sample-panel[data-panel^="q"] .teaching-board .board-beat.is-complete{visibility:visible;opacity:1}
@media print{.sample-panel[data-panel^="q"] .teaching-board{display:block!important}.sample-panel[data-panel^="q"] .teaching-board .board-beat{visibility:visible!important;opacity:1!important}}
</style></head><body><div class="app"><aside class="rail"><div class="brand"><small>GFIELD Math Assessment &amp; Pathway</small><h1>G·MAP Lessons</h1><p class="brand-range">From Foundations to Competition.</p><p>Diagnose. Learn. Advance.</p></div><nav class="tabs">${tabs}</nav></aside><main class="stage"><div class="paper">${panels}</div></main></div><script id="narration-data" type="application/json">${jsonScript(narration)}</script><script>
(()=>{const data=JSON.parse(document.querySelector('#narration-data').textContent);let run=0,paused=false,currentId=null,currentIndex=0;const synth='speechSynthesis'in window?window.speechSynthesis:null;
function panel(id){return document.querySelector('[data-panel="'+id+'"]')}
function clear(p){p.querySelectorAll('.board-beat,.question-image-frame').forEach(n=>n.classList.remove('is-current','is-complete','speaking-target'));p.querySelectorAll('.teaching-board').forEach(n=>n.classList.remove('has-progress'))}
function setProgress(id,value){const node=panel(id).querySelector('[data-progress="'+id+'"]');if(node)node.textContent=value+' / '+data[id].length}
function showStep(id,index,scroll){const segments=data[id];const p=panel(id);const bounded=Math.max(0,Math.min(index,segments.length-1));const step=segments[bounded];clear(p);segments.slice(0,bounded).forEach(done=>{const n=p.querySelector('[data-beat-id="'+done.id+'"]');if(n)n.classList.add('is-complete')});const target=p.querySelector('[data-beat-id="'+step.id+'"]');if(target){const board=target.closest('.teaching-board');if(board)board.classList.add('has-progress');target.classList.add('is-current','speaking-target');if(scroll!==false)target.scrollIntoView({block:'center',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})}p.querySelector('[data-caption="'+id+'"]').textContent=step.text;setProgress(id,bounded+1);currentId=id;currentIndex=bounded;return step}
function cancelVoice(){if(synth)synth.cancel()}
function voice(){const list=synth?synth.getVoices():[];return list.find(v=>/^en-US$/i.test(v.lang))||list.find(v=>/^en-GB$/i.test(v.lang))||list.find(v=>/^en(?:-|_)/i.test(v.lang))||null}
function voiceFallback(id,step){panel(id).querySelector('[data-caption="'+id+'"]').textContent=step.text+' Voice playback is unavailable in this browser; use Next to continue through the complete English captions.'}
function stop(){run++;cancelVoice();paused=false;currentId=null;currentIndex=0;document.querySelectorAll('.sample-panel').forEach(clear);document.querySelectorAll('.caption').forEach(c=>c.textContent='Lesson stopped. Press Play to start again.');Object.keys(data).forEach(id=>setProgress(id,0))}
function speak(id,start=0){run++;cancelVoice();paused=false;currentId=id;currentIndex=start;const token=run;const segments=data[id];const p=panel(id);function next(){if(token!==run||currentIndex>=segments.length)return;const step=showStep(id,currentIndex,true);if(!synth||typeof window.SpeechSynthesisUtterance!=='function'){voiceFallback(id,step);return}const u=new window.SpeechSynthesisUtterance(step.text);u.lang='en-US';u.rate=Number(p.querySelector('[data-action="speed"]').value);const v=voice();if(v)u.voice=v;u.onend=()=>{if(token===run){currentIndex++;next()}};u.onerror=()=>voiceFallback(id,step);synth.speak(u)}next()}
function manualStep(id,delta){run++;cancelVoice();paused=false;const length=data[id].length;const base=currentId===id?currentIndex:(delta>0?-1:1);showStep(id,Math.max(0,Math.min(base+delta,length-1)),true)}
function overview(id){run++;cancelVoice();paused=false;const p=panel(id);clear(p);p.querySelectorAll('.teaching-board').forEach(n=>n.classList.add('has-progress'));data[id].forEach(step=>{const node=p.querySelector('[data-beat-id="'+step.id+'"]');if(node)node.classList.add('is-complete')});p.querySelector('[data-caption="'+id+'"]').textContent='Final overview. Every verified reasoning object is visible. The answer stays hidden until you choose Reveal verified answer.';setProgress(id,data[id].length);currentId=id;currentIndex=data[id].length-1}
document.addEventListener('click',e=>{const tab=e.target.closest('.lesson-tab');if(tab){stop();document.querySelectorAll('.lesson-tab').forEach(b=>{b.classList.toggle('is-current',b===tab);b.setAttribute('aria-current',b===tab?'page':'false')});document.querySelectorAll('.sample-panel').forEach(p=>p.hidden=p.dataset.panel!==tab.dataset.show);return}const controls=e.target.closest('[data-controls]');if(controls){const action=e.target.closest('[data-action]')?.dataset.action;const id=controls.dataset.controls;if(action==='play')speak(id,0);if(action==='previous')manualStep(id,-1);if(action==='next')manualStep(id,1);if(action==='restart')speak(id,0);if(action==='overview')overview(id);if(action==='stop')stop();if(action==='pause'&&synth){if(synth.speaking&&!paused){synth.pause();paused=true;e.target.textContent='Resume'}else if(paused){synth.resume();paused=false;e.target.textContent='Pause'}}return}const zoom=e.target.closest('.zoom-control');if(zoom){const frame=zoom.previousElementSibling;const on=frame.classList.toggle('is-zoomed');zoom.setAttribute('aria-expanded',String(on));zoom.textContent=on?'Fit question to page':'Open full-size question';return}const answer=e.target.closest('.answer-button');if(answer){const value=answer.nextElementSibling;const on=answer.getAttribute('aria-expanded')==='true';answer.setAttribute('aria-expanded',String(!on));answer.textContent=on?'Reveal verified answer':'Hide verified answer';value.hidden=on}});Object.keys(data).forEach(id=>setProgress(id,0));window.addEventListener('beforeunload',cancelVoice)})();
</script></body></html>`;
}

function render(options) {
  const loaded=lessonValidator.loadAndValidate(options);
  const media=mediaValidator.loadAndValidate({mediaRoot:options.mediaRoot,mediaFile:options.mediaFile,imageIndexFile:options.imageIndexFile,intakePack:loaded.intakePack});
  const concept=loadConcept(options.conceptRoot,options.conceptFile);
  const output=outputPath(options.output);
  fs.writeFileSync(output,documentHtml({concept,pack:loaded.pack,intakePack:loaded.intakePack,mediaAssets:media.validation.assets}),"utf8");
  return Object.freeze({output,sampleQuestions:SAMPLE_QUESTIONS,conceptId:concept.conceptId,voiceSource:"browser-speech-synthesis",imageIndexSha256:media.validation.imageIndexSha256});
}

if(require.main===module){try{const result=render({lessonRoot:arg(process.argv,"--lesson-root"),lessonFile:arg(process.argv,"--lesson-file"),mediaRoot:arg(process.argv,"--media-root"),mediaFile:arg(process.argv,"--media-file"),imageIndexFile:arg(process.argv,"--image-index-file"),intakeRoot:arg(process.argv,"--intake-root"),intakeFile:arg(process.argv,"--intake-file"),conceptRoot:arg(process.argv,"--concept-root"),conceptFile:arg(process.argv,"--concept-file"),output:arg(process.argv,"--output")});console.log(`PASS SASMO whiteboard sample: concept + ${result.sampleQuestions.length} problem lessons, source index ${result.imageIndexSha256} -> ${result.output}`)}catch(error){console.error(`BLOCKED SASMO whiteboard sample: ${error.code||error.message||"INVALID"}`);process.exitCode=2}}

module.exports=Object.freeze({SAMPLE_QUESTIONS,buildQ6GeometryModel,validateQ6GeometryModel,minorAngle,buildQ16TriangleModel,enumerateQ16Triangles,validateQ16TriangleModel,buildQ7UnitBarModel,validateQ7UnitBarModel,buildQ20ShareModel,validateQ20ShareModel,validateSampleBoardAlignment,loadConcept,documentHtml,render});
