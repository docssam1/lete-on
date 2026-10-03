"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const crypto = require("node:crypto");
const { spawnSync } = require("node:child_process");

// PDF 19 / printed 21, read visually before inspecting producer values.
const originals = [
  { mission: 3, facts: { height: "3.9", ratio: "1.25", largeArea: "9.36" }, answer: "0.96cm", handwriting: "ambiguous-cancelled-writing", agreement: null },
  { mission: 4, facts: { leftArea: "46.8", rightArea: "30.3", union: "59.7", base: "3.2" }, answer: "10.875cm", handwriting: "10.875", agreement: true },
  { mission: 6, facts: { topRight: "6", bottomLeft: "9.25", bottomRight: "5.55" }, answer: "10cm²", handwriting: "10", agreement: true }
];
const idFor = mission => `6-2-u2-e2-mission-${mission}`;
const keyFor = mission => `sourceGrade6SecondDecimalDivisionE2Mission${mission}`;
const N = "(\\d+(?:\\.\\d+)?)";
const files = new Map();
const failures = [], warnings = [], rows = [];
const counts = { originals: 0, originalPromptMatches: 0, publicConditions: 0, candidateConditions: 0,
  distinctConditions: 0, arithmetic: 0, geometry: 0, solvedDiagrams: 0,
  equalMetric: 0, hiddenAttributeChecks: 0, modulo: 0, maxSafe: 0, invalidInputs: 0, forcedLock: 0,
  negativeTests: 0, metadataIndependence: 0 };
function read(name) {
  if (!files.has(name)) files.set(name, fs.readFileSync(path.resolve(__dirname, name)));
  return files.get(name).toString("utf8");
}
const digest = bytes => crypto.createHash("sha256").update(bytes).digest("hex");
function check(label, fn, severity = "P2") {
  try { fn(); return true; }
  catch (error) { failures.push({ severity, check: label, error: error.message }); return false; }
}
function freeze(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.values(value).forEach(freeze); Object.freeze(value);
  }
  return value;
}
function gcd(a, b) {
  a = a < 0n ? -a : a; b = b < 0n ? -b : b;
  while (b) [a, b] = [b, a % b];
  return a;
}
function r(n, d = 1n) {
  n = BigInt(n); d = BigInt(d); assert.notEqual(d, 0n);
  if (d < 0n) { n = -n; d = -d; }
  const g = gcd(n, d); return { n: n / g, d: d / g };
}
function decimal(text) {
  assert.match(String(text), /^-?\d+(?:\.\d+)?$/);
  const negative = String(text).startsWith("-");
  const [whole, fraction = ""] = String(text).replace(/^-/, "").split(".");
  return r(BigInt(whole + fraction) * (negative ? -1n : 1n), 10n ** BigInt(fraction.length));
}
const add = (a, b) => r(a.n * b.d + b.n * a.d, a.d * b.d);
const sub = (a, b) => r(a.n * b.d - b.n * a.d, a.d * b.d);
const mul = (a, b) => r(a.n * b.n, a.d * b.d);
const div = (a, b) => r(a.n * b.d, a.d * b.n);
const cmp = (a, b) => a.n * b.d - b.n * a.d;
const abs = a => r(a.n < 0n ? -a.n : a.n, a.d);
const equal = (a, b, message) => assert.equal(cmp(a, b), 0n, message);
const positive = (...values) => values.forEach(value => assert(value.n > 0n, "Positive lengths and areas required"));
const two = r(2), one = r(1), zero = r(0);
function finite(value) {
  assert(value.n >= 0n);
  for (let places = 0; places <= 12; places += 1) {
    const scale = 10n ** BigInt(places);
    if (value.n * scale % value.d) continue;
    const digits = String(value.n * scale / value.d).padStart(places + 1, "0");
    return places ? `${digits.slice(0, -places)}.${digits.slice(-places)}` : digits;
  }
  assert.fail("Nonterminating answer");
}
function near(a, b, message, tolerance = decimal("0.00001")) {
  const scale = [one, abs(a), abs(b)].reduce((x, y) => cmp(x, y) > 0n ? x : y);
  assert(cmp(abs(sub(a, b)), mul(scale, tolerance)) <= 0n,
    `${message}: ${a.n}/${a.d} vs ${b.n}/${b.d}`);
}
const coordNear = (a, b, message) => near(a, b, message, decimal("0.000002"));
const plain = markup => String(markup).replace(/<[^>]*>/g, "")
  .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
  .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/\s+/g, " ").trim();
function match(text, pattern) {
  const matches = [...text.matchAll(new RegExp(pattern, "gu"))];
  assert.equal(matches.length, 1, `One visible condition required: ${pattern}`);
  return matches[0];
}
function svgMarkup(markup) {
  const matches = String(markup).match(/<svg\b[\s\S]*?<\/svg>/g) || [];
  assert.equal(matches.length, 1, "Exactly one actual diagram required"); return matches[0];
}
const xmlCache = new Map();
function parseBatch(markups) {
  const missing = [...new Set(markups)].filter(markup => !xmlCache.has(markup));
  if (!missing.length) return;
  // Use the native structured XML parser; no temporary files or third-party install.
  const script = String.raw`
$ErrorActionPreference='Stop'
[Console]::InputEncoding=[Text.UTF8Encoding]::new($false)
[Console]::OutputEncoding=[Text.UTF8Encoding]::new($false)
$inputs=ConvertFrom-Json ([Console]::In.ReadToEnd())
$results=@(foreach($source in $inputs) {
  $settings=[Xml.XmlReaderSettings]::new(); $settings.DtdProcessing=[Xml.DtdProcessing]::Prohibit; $settings.XmlResolver=$null
  $reader=[Xml.XmlReader]::Create([IO.StringReader]::new($source),$settings)
  $doc=[Xml.XmlDocument]::new(); $doc.XmlResolver=$null; $doc.Load($reader); $reader.Dispose()
  $nodes=@(foreach($element in $doc.SelectNodes('//*')) {
    $attrs=@{}; foreach($a in $element.Attributes) { $attrs[$a.Name]=$a.Value }
    @{ tag=$element.LocalName; attrs=$attrs; text=$element.InnerText }
  })
  @{ nodes=$nodes }
})
ConvertTo-Json -InputObject $results -Depth 8 -Compress
`;
  const result = spawnSync("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", script],
    { input: JSON.stringify(missing), encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
  assert.equal(result.status, 0, `Native SVG XML parse failed: ${result.stderr || result.error}`);
  const documents = JSON.parse(result.stdout.replace(/^\uFEFF/, ""));
  assert.equal(documents.length, missing.length);
  documents.forEach((document, i) => xmlCache.set(missing[i], document.nodes));
}
function nodes(markup) {
  const svg = svgMarkup(markup); assert(xmlCache.has(svg), "SVG must be parsed before verification");
  return xmlCache.get(svg);
}
function only(values, message) { assert.equal(values.length, 1, message); return values[0]; }
const find = (elements, tag, name, value) => only(elements.filter(node => node.tag === tag && node.attrs[name] === value), `${tag}[${name}=${value}]`);
function areaLabel(elements, owner) {
  const node = find(elements, "text", "data-owner-id", owner);
  assert.match(node.text, /^(?:\d+(?:\.\d+)?|㉠|□)cm²$/);
  return { node, text: node.text.slice(0, -3), value: /^[\d.]+cm²$/.test(node.text) ? decimal(node.text.slice(0, -3)) : null };
}
function rawText(markup, owner) {
  return only((svgMarkup(markup).match(/<text\b[^>]*>[\s\S]*?<\/text>/g) || [])
    .filter(text => text.includes(`data-owner-id="${owner}"`)), `Visible text ${owner}`);
}
function essential(matchResult) {
  const value = decimal(matchResult[1]);
  return { required: matchResult[0], changed: matchResult[0].replace(matchResult[1], finite(add(value, decimal("0.01")))) };
}

// Arithmetic consumes only the printed prompt and the XML text labels, never producer metadata.
function solve(mission, level, prompt) {
  const elements = nodes(prompt), prose = plain(String(prompt).replace(/<svg\b[\s\S]*?<\/svg>/g, ""));
  assert.match(prose, mission === 6 ? /㉠에 알맞은 넓이를 구하세요/ : mission === 3 ? /선분 ㄴㅁ의 길이/ : /선분 ㅅㅇ의 길이/);
  let answer, facts, branch, needed, geometry;
  if (mission === 3) {
    const ratioMatch = match(prose, `넓이의 ${N}배`), ratio = decimal(ratioMatch[1]);
    const heightNode = find(elements, "text", "data-owner-id", "large-height");
    const height = decimal(match(heightNode.text, `^${N}cm$`)[1]);
    assert(cmp(ratio, one) > 0n); positive(height);
    let largeBase, largeArea;
    if (level === 0) {
      largeBase = decimal(match(prose, `선분 ㄴㄷ의 길이는 ${N}cm입니다`)[1]);
      largeArea = div(mul(largeBase, height), two); branch = "base-given";
      facts = { height: finite(height), ratio: finite(ratio), largeBase: finite(largeBase) };
    } else {
      if (level === 1) {
        largeArea = decimal(match(prose, `삼각형 ㄱㄴㄷ의 넓이는 ${N}cm²입니다`)[1]); branch = "area-to-base";
        facts = { height: finite(height), ratio: finite(ratio), largeArea: finite(largeArea) };
      } else {
        const sum = decimal(match(prose, `두 삼각형의 넓이의 합은 ${N}cm²입니다`)[1]);
        // Share of the sum, rather than the producer's small-area-then-multiply path.
        largeArea = mul(sum, div(ratio, add(ratio, one))); branch = "sum-share-to-base";
        facts = { height: finite(height), ratio: finite(ratio), sum: finite(sum) };
      }
      largeBase = div(mul(two, largeArea), height);
    }
    const smallBase = div(largeBase, ratio); answer = sub(largeBase, smallBase);
    equal(add(answer, smallBase), largeBase); positive(answer, smallBase, largeArea);
    geometry = { height, ratio, largeBase, smallBase, largeArea };
    needed = essential(ratioMatch);
  } else if (mission === 4) {
    const baseNode = find(elements, "text", "data-owner-id", "segment-ㅁㄷ");
    const base = decimal(match(baseNode.text, `^${N}cm$`)[1]); positive(base);
    let overlap, leftArea, rightArea, sum, union, outside, givenMatch;
    if (level === 0) {
      givenMatch = match(prose, `겹친 부분의 넓이는 ${N}cm²입니다`);
      overlap = decimal(givenMatch[1]); branch = "overlap-given";
      facts = { overlap: finite(overlap), base: finite(base) };
    } else if (level === 1) {
      givenMatch = match(prose, `삼각형 ㄱㄴㄷ의 넓이는 ${N}cm²`);
      leftArea = decimal(givenMatch[1]); rightArea = decimal(match(prose, `삼각형 ㄹㅁㅂ의 넓이는 ${N}cm²`)[1]);
      union = decimal(match(prose, `전체 넓이는 ${N}cm²입니다`)[1]); sum = add(leftArea, rightArea);
      overlap = sub(sum, union); outside = sub(union, overlap); branch = "inclusion-exclusion";
      positive(leftArea, rightArea, outside); assert(cmp(overlap, leftArea) < 0n && cmp(overlap, rightArea) < 0n);
      facts = { leftArea: finite(leftArea), rightArea: finite(rightArea), union: finite(union), base: finite(base) };
    } else {
      givenMatch = match(prose, `두 삼각형의 넓이의 합은 ${N}cm²`); sum = decimal(givenMatch[1]);
      outside = decimal(match(prose, `겹치지 않은 두 부분의 넓이의 합은 ${N}cm²입니다`)[1]);
      overlap = div(sub(sum, outside), two); positive(outside); branch = "double-overlap-reconstruction";
      facts = { sum: finite(sum), outside: finite(outside), base: finite(base) };
    }
    positive(overlap); answer = div(overlap, div(base, two));
    equal(div(mul(base, answer), two), overlap);
    geometry = { base, overlap, leftArea, rightArea, sum, union, outside }; needed = essential(givenMatch);
  } else {
    assert.equal(mission, 6);
    const top = areaLabel(elements, "top-right"), bottomLeft = areaLabel(elements, "bottom-left"), bottomRight = areaLabel(elements, "bottom-right");
    assert.equal(areaLabel(elements, "top-left").text, "㉠"); positive(top.value, bottomLeft.value);
    let right = bottomRight.value, leftWidth, rightWidth, topHeight, bottomHeight;
    if (level === 0) {
      const widthMatch = match(prose, `왼쪽 직사각형들의 너비는 ${N}cm이고`);
      leftWidth = decimal(widthMatch[1]); rightWidth = decimal(match(prose, `오른쪽 직사각형들의 너비는 ${N}cm입니다`)[1]);
      positive(leftWidth, rightWidth, right);
      bottomHeight = div(bottomLeft.value, leftWidth); equal(div(right, rightWidth), bottomHeight);
      topHeight = div(top.value, rightWidth); answer = mul(topHeight, leftWidth); branch = "widths-to-top-height";
      facts = { topRight: finite(top.value), bottomLeft: finite(bottomLeft.value), bottomRight: finite(right), leftWidth: finite(leftWidth), rightWidth: finite(rightWidth) };
      needed = essential(widthMatch);
    } else {
      if (level === 2) {
        assert.equal(bottomRight.text, "□");
        const totalMatch = match(prose, `아랫줄 두 직사각형의 넓이의 합은 ${N}cm²입니다`);
        const total = decimal(totalMatch[1]); right = sub(total, bottomLeft.value); branch = "missing-bottom-area-then-ratio";
        facts = { topRight: finite(top.value), bottomLeft: finite(bottomLeft.value), bottomTotal: finite(total) }; needed = essential(totalMatch);
      } else {
        positive(right); branch = "row-width-ratio";
        facts = { topRight: finite(top.value), bottomLeft: finite(bottomLeft.value), bottomRight: finite(right) };
        const required = rawText(prompt, "top-right");
        needed = { required, changed: required.replace(`>${finite(top.value)}<`, `>${finite(add(top.value, decimal("0.01")))}<`) };
        assert.notEqual(needed.changed, needed.required);
      }
      positive(right);
      const ratio = div(bottomLeft.value, right); answer = mul(ratio, top.value);
    }
    positive(answer); equal(mul(answer, right), mul(top.value, bottomLeft.value));
    geometry = { topRight: top.value, bottomLeft: bottomLeft.value, bottomRight: right, leftWidth, rightWidth, topHeight, bottomHeight };
  }
  positive(answer);
  return { value: answer, answer: `${finite(answer)}${mission === 6 ? "cm²" : "cm"}`, facts, branch, geometry, ...needed };
}

const point = (x, y) => ({ x, y });
const vector = (a, b) => point(sub(b.x, a.x), sub(b.y, a.y));
const dot = (a, b) => add(mul(a.x, b.x), mul(a.y, b.y));
const determinant = (a, b) => sub(mul(a.x, b.y), mul(a.y, b.x));
function actualPoints(elements) {
  const points = {};
  for (const node of elements.filter(node => node.tag === "line" && node.attrs["data-from"] && node.attrs["data-to"])) {
    for (const [name, x, y] of [[node.attrs["data-from"], node.attrs.x1, node.attrs.y1], [node.attrs["data-to"], node.attrs.x2, node.attrs.y2]]) {
      const p = point(decimal(x), decimal(y));
      if (points[name]) { equal(p.x, points[name].x, `Endpoint ${name} x disagrees`); equal(p.y, points[name].y, `Endpoint ${name} y disagrees`); }
      points[name] = p;
    }
  }
  return points;
}
function area(vertices) {
  let sum = zero;
  for (let i = 0; i < vertices.length; i += 1) sum = add(sum, determinant(vertices[i], vertices[(i + 1) % vertices.length]));
  return div(abs(sum), two);
}
function polygon(node) {
  return node.attrs.points.trim().split(/\s+/).map(pair => {
    const parts = pair.split(","); assert.equal(parts.length, 2); return point(decimal(parts[0]), decimal(parts[1]));
  });
}
function samePoint(a, b, message) { coordNear(a.x, b.x, `${message} x`); coordNear(a.y, b.y, `${message} y`); }
// Solve two implicit line equations with Cramer's rule, not the module's t/u intersection construction.
function crossing(a, b, c, d) {
  const coefficient = (p, q) => ({ a: sub(q.y, p.y), b: sub(p.x, q.x), c: sub(mul(p.x, q.y), mul(q.x, p.y)) });
  const l = coefficient(a, b), k = coefficient(c, d), denominator = sub(mul(l.a, k.b), mul(k.a, l.b));
  assert.notEqual(denominator.n, 0n);
  const p = point(div(sub(mul(l.c, k.b), mul(k.c, l.b)), denominator), div(sub(mul(l.a, k.c), mul(k.a, l.c)), denominator));
  for (const [start, end] of [[a, b], [c, d]]) {
    const v = vector(start, end), offset = vector(start, p), lengthSquared = dot(v, v), distance = dot(v, offset);
    assert(cmp(distance, zero) > 0n && cmp(distance, lengthSquared) < 0n, "Crossing must be inside both segments");
  }
  return p;
}
function marks(elements, points, expected) {
  const paths = elements.filter(node => node.tag === "path" && node.attrs["data-layout-role"] === "right-angle");
  assert.equal(paths.length, expected.length);
  assert.deepEqual(paths.map(node => node.attrs["data-angle-vertex"]).sort(), [...expected].sort());
  for (const mark of paths) {
    const a = mark.attrs, vertex = points[a["data-angle-vertex"]], first = points[a["data-angle-start"]], second = points[a["data-angle-end"]];
    assert(vertex && first && second); equal(dot(vector(vertex, first), vector(vertex, second)), zero, "Right-angle ownership must be physically perpendicular");
    assert.equal(a["data-owner-id"], `right-angle-${a["data-angle-vertex"]}`);
    assert.match(a.d, /^M-?[\d.]+,-?[\d.]+ L-?[\d.]+,-?[\d.]+ L-?[\d.]+,-?[\d.]+$/);
    const p = a.d.match(/[ML](-?[\d.]+),(-?[\d.]+)/g).map(pair => {
      const [x, y] = pair.slice(1).split(","); return point(decimal(x), decimal(y));
    });
    near(determinant(vector(vertex, first), vector(vertex, p[0])), zero, "First mark endpoint on first ray", decimal("0.01"));
    near(determinant(vector(vertex, second), vector(vertex, p[2])), zero, "Last mark endpoint on second ray", decimal("0.01"));
    assert(dot(vector(vertex, first), vector(vertex, p[0])).n > 0n && dot(vector(vertex, second), vector(vertex, p[2])).n > 0n);
    samePoint(p[1], point(sub(add(p[0].x, p[2].x), vertex.x), sub(add(p[0].y, p[2].y), vertex.y)), "Square mark's actual corner");
    near(dot(vector(vertex, p[0]), vector(vertex, p[0])), r(100), "First mark side length");
    near(dot(vector(vertex, p[2]), vector(vertex, p[2])), r(100), "Second mark side length");
  }
}
function pointLabels(elements, points) {
  for (const [name, p] of Object.entries(points)) {
    const labels = elements.filter(node => node.tag === "text" && node.attrs["data-label-for"] === name);
    if (!labels.length && /^(?:TL|TC|TR|ML|C|MR|BL|BC|BR)$/.test(name)) continue;
    const label = only(labels, `Point label ${name}`), a = label.attrs;
    assert.equal(label.text, name); assert.equal(a["data-owner-id"], `point-${name}`);
    const [nx, ny] = a["data-label-normal"].split(",").map(decimal), distance = decimal(a["data-label-distance"]);
    positive(distance); near(add(mul(nx, nx), mul(ny, ny)), one, "Label normal is a unit direction", decimal("0.0002"));
    const delta = vector(p, point(decimal(a.x), decimal(a.y)));
    near(delta.x, mul(nx, distance), "Actual label position follows its normal", decimal("0.002"));
    near(delta.y, mul(ny, distance), "Actual label position follows its normal", decimal("0.002"));
  }
}
function geometry(mission, level, markup, computed) {
  const elements = nodes(markup), p = actualPoints(elements), data = computed.geometry;
  pointLabels(elements, p);
  if (mission === 3) {
    assert.deepEqual(Object.keys(p).sort(), ["ㄱ", "ㄴ", "ㄷ", "ㄹ", "ㅁ"].sort());
    equal(p["ㄱ"].y, p["ㄹ"].y); equal(p["ㄴ"].y, p["ㅁ"].y); equal(p["ㄴ"].y, p["ㄷ"].y);
    equal(p["ㄱ"].x, p["ㄴ"].x); equal(p["ㄹ"].x, p["ㄷ"].x);
    assert(cmp(p["ㄴ"].x, p["ㅁ"].x) < 0n && cmp(p["ㅁ"].x, p["ㄷ"].x) < 0n && cmp(p["ㄱ"].y, p["ㄴ"].y) < 0n);
    const large = area([p["ㄱ"], p["ㄴ"], p["ㄷ"]]), small = area([p["ㄹ"], p["ㅁ"], p["ㄷ"]]);
    near(div(large, small), data.ratio, "Actual triangle area ratio");
    near(div(sub(p["ㄷ"].x, p["ㅁ"].x), sub(p["ㄷ"].x, p["ㄴ"].x)), div(data.smallBase, data.largeBase), "Displayed bases and SVG bases agree");
    const cross = crossing(p["ㄱ"], p["ㄷ"], p["ㄹ"], p["ㅁ"]);
    const shade = polygon(find(elements, "polygon", "data-layout-role", "source-shading"));
    assert.equal(shade.length, 5);
    [p["ㄱ"], p["ㄴ"], p["ㄷ"], p["ㄹ"], cross].forEach((value, i) => samePoint(shade[i], value, "Union shading vertex"));
    marks(elements, p, ["ㄴ", "ㄹ", "ㄷ"]);
    const dimension = only(elements.filter(node => node.tag === "line" && node.attrs.class === "source62-triangle-measure"), "Height dimension line");
    equal(decimal(dimension.attrs.y1), p["ㄱ"].y); equal(decimal(dimension.attrs.y2), p["ㄴ"].y);
    equal(decimal(dimension.attrs.x1), decimal(dimension.attrs.x2));
  } else if (mission === 4) {
    assert(cmp(p["ㄱ"].y, p["ㄹ"].y) < 0n, "Original left apex must be higher than the right apex");
    const baseline = ["ㄴ", "ㅁ", "ㅇ", "ㄷ", "ㅂ"];
    baseline.forEach((name, i) => {
      equal(p[name].y, p["ㄴ"].y);
      if (i) assert(cmp(p[baseline[i - 1]].x, p[name].x) < 0n, "Original baseline point order");
    });
    const cross = crossing(p["ㄱ"], p["ㄷ"], p["ㄹ"], p["ㅁ"]);
    samePoint(p["ㅅ"], cross, "ㅅ is the actual line intersection");
    equal(p["ㅅ"].x, p["ㅇ"].x); assert(cmp(p["ㅅ"].y, p["ㅇ"].y) < 0n);
    marks(elements, p, ["ㅇ"]);
    const circle = find(elements, "circle", "data-layout-role", "intersection");
    samePoint(point(decimal(circle.attrs.cx), decimal(circle.attrs.cy)), cross, "Intersection dot");
    const shade = polygon(find(elements, "polygon", "data-layout-role", "overlap-region")); assert.equal(shade.length, 3);
    [p["ㅅ"], p["ㅁ"], p["ㄷ"]].forEach((value, i) => samePoint(shade[i], value, "Overlap shading vertex"));
    const left = area([p["ㄱ"], p["ㄴ"], p["ㄷ"]]), right = area([p["ㄹ"], p["ㅁ"], p["ㅂ"]]), overlap = area(shade);
    positive(left, right, overlap);
    if (level === 1) {
      near(div(left, overlap), div(data.leftArea, data.overlap), "Actual left/overlap area ratio");
      near(div(right, overlap), div(data.rightArea, data.overlap), "Actual right/overlap area ratio");
      near(div(sub(add(left, right), overlap), overlap), div(data.union, data.overlap), "Actual union/overlap area ratio");
    }
    if (level === 2) {
      near(div(add(left, right), overlap), div(data.sum, data.overlap), "Actual sum/overlap area ratio");
      near(div(sub(add(left, right), mul(two, overlap)), overlap), div(data.outside, data.overlap), "Actual nonoverlap/overlap area ratio");
    }
    const bracket = find(elements, "path", "data-owner-id", "segment-ㅁㄷ");
    const m = bracket.attrs.d.match(/^M(-?[\d.]+),(-?[\d.]+)v7 H(-?[\d.]+)v-7$/);
    assert(m, "Base bracket must delimit ㅁㄷ, not ㅇㄷ or the outer base");
    equal(decimal(m[1]), p["ㅁ"].x); equal(decimal(m[3]), p["ㄷ"].x);
  } else {
    const rectangle = find(elements, "rect", "data-layout-role", "outline"), a = rectangle.attrs;
    const left = decimal(a.x), top = decimal(a.y), width = decimal(a.width), height = decimal(a.height);
    positive(width, height); const right = add(left, width), bottom = add(top, height);
    const col = find(elements, "line", "data-layout-role", "column-divider").attrs;
    const row = find(elements, "line", "data-layout-role", "row-divider").attrs;
    const x = decimal(col.x1), y = decimal(row.y1);
    equal(x, decimal(col.x2)); equal(decimal(col.y1), top); equal(decimal(col.y2), bottom);
    equal(y, decimal(row.y2)); equal(decimal(row.x1), left); equal(decimal(row.x2), right);
    assert(cmp(left, x) < 0n && cmp(x, right) < 0n && cmp(top, y) < 0n && cmp(y, bottom) < 0n);
    const regions = {
      "top-left": [left, top, x, y], "top-right": [x, top, right, y],
      "bottom-left": [left, y, x, bottom], "bottom-right": [x, y, right, bottom]
    };
    const pixelAreas = {};
    for (const [owner, [x0, y0, x1, y1]] of Object.entries(regions)) {
      const label = areaLabel(elements, owner).node;
      coordNear(decimal(label.attrs.x), div(add(x0, x1), two), `Area label ${owner} horizontal association`);
      coordNear(decimal(label.attrs.y), div(add(y0, y1), two), `Area label ${owner} vertical association`);
      pixelAreas[owner] = mul(sub(x1, x0), sub(y1, y0));
    }
    near(div(pixelAreas["bottom-left"], pixelAreas["bottom-right"]), div(data.bottomLeft, data.bottomRight), "Columns match the printed areas");
    near(div(pixelAreas["top-right"], pixelAreas["bottom-right"]), div(data.topRight, data.bottomRight), "Rows match the printed areas");
    near(div(pixelAreas["top-left"], pixelAreas["top-right"]), div(computed.value, data.topRight), "Target rectangle area ratio");
    if (level === 0) near(div(sub(x, left), sub(right, x)), div(data.leftWidth, data.rightWidth), "Widths match the explicit easy condition");
    marks(elements, p, []);
  }
  return p;
}
function equalMetric(markup, computed) {
  const elements = nodes(markup), col = find(elements, "line", "data-layout-role", "column-divider").attrs;
  const row = find(elements, "line", "data-layout-role", "row-divider").attrs;
  const rect = find(elements, "rect", "data-layout-role", "outline").attrs, data = computed.geometry;
  const xScale = div(sub(decimal(col.x1), decimal(rect.x)), data.leftWidth);
  const topScale = div(sub(decimal(row.y1), decimal(rect.y)), data.topHeight);
  const bottomScale = div(sub(add(decimal(rect.y), decimal(rect.height)), decimal(row.y1)), data.bottomHeight);
  near(xScale, topScale, "M6 easy: one metric scale for width and top height");
  near(xScale, bottomScale, "M6 easy: one metric scale for width and bottom height");
}
function noHiddenModelAttributes(markup) {
  const permitted = new Set(["data-renderer", "data-geometry-kind", "data-source-item", "data-phase",
    "data-target-segment", "data-owner-id", "data-layout-role", "data-from", "data-to", "data-label-for", "data-label-normal",
    "data-label-distance", "data-angle-vertex", "data-angle-start", "data-angle-end",
    "data-layout-ignore", "data-layout-overlap-ok"]);
  for (const node of nodes(markup)) for (const [name, value] of Object.entries(node.attrs)) {
    if (name.startsWith("data-")) assert(permitted.has(name), `Problem SVG contains nonsemantic hidden attribute: ${name}=${value}`);
    assert.notEqual(name, "hidden"); assert.notEqual(name, "aria-hidden");
    if (name === "style") assert.doesNotMatch(value, /display\s*:\s*none|visibility\s*:\s*hidden|opacity\s*:\s*0(?:\D|$)/i);
  }
}
function rectangleFingerprint(markup) {
  return nodes(markup).filter(node => node.tag === "rect" || node.tag === "line").map(node => {
    const attrs = node.attrs;
    return { tag: node.tag, role: attrs["data-layout-role"], coordinates: node.tag === "rect"
      ? [attrs.x, attrs.y, attrs.width, attrs.height] : [attrs.x1, attrs.y1, attrs.x2, attrs.y2] };
  });
}
function verifyEquations(solution) {
  const expressions = [...String(solution).matchAll(/<span class="math-inline-expression">([^<]+)<\/span>/g)];
  assert(expressions.length > 0);
  function expression(text) {
    const tokens = text.replace(/\s/g, "").match(/\d+(?:\.\d+)?|[()+\-×÷]/g) || [];
    assert.equal(tokens.join(""), text.replace(/\s/g, "")); let at = 0;
    const primary = () => {
      if (tokens[at] === "(") { at++; const value = sum(); assert.equal(tokens[at++], ")"); return value; }
      return decimal(tokens[at++]);
    };
    const product = () => { let value = primary(); while (["×", "÷"].includes(tokens[at])) { const op = tokens[at++], right = primary(); value = op === "×" ? mul(value, right) : div(value, right); } return value; };
    const sum = () => { let value = product(); while (["+", "-"].includes(tokens[at])) { const op = tokens[at++], right = product(); value = op === "+" ? add(value, right) : sub(value, right); } return value; };
    const value = sum(); assert.equal(at, tokens.length); return value;
  }
  for (const [, text] of expressions) {
    const parts = text.split("="); assert(parts.length >= 2);
    const values = parts.map(expression); values.slice(1).forEach(value => equal(value, values[0], `Printed solution equation ${text}`));
  }
  assert.doesNotMatch(plain(solution), /제곱근|피타고라스|연립방정식|삼각함수/);
}
function verifyArithmetic(item, mission, level) {
  assert(item && item.prompt && item.answerVisual); assert.doesNotMatch(item.prompt + item.answerVisual, /NaN|Infinity|undefined/);
  const computed = solve(mission, level, item.prompt);
  assert.equal(item.answer, computed.answer, "Answer must equal independently solved visible conditions, including its unit");
  const root = find(nodes(item.prompt), "svg", "data-phase", "problem");
  assert.equal(root.attrs["data-source-item"], idFor(mission));
  if (mission !== 6) assert.equal(root.attrs["data-target-segment"], mission === 3 ? "ㄴ-ㅁ" : "ㅅ-ㅇ");
  else for (const owner of ["top-left", "top-right", "bottom-left", "bottom-right"]) {
    assert.equal(areaLabel(nodes(item.prompt), owner).node.attrs["data-layout-role"],
      owner === "top-left" || level === 2 && owner === "bottom-right" ? "unknown-area" : "given-area");
  }
  assert(!nodes(item.prompt).some(node => node.attrs["data-layout-role"] === "answer-value"));
  assert.doesNotMatch(item.prompt, /data-answer-source|data-phase="answer"|\bhidden\b|display:\s*none/);
  verifyEquations(item.solution);
  return computed;
}
function verifySolved(item, mission, level, computed) {
  const elements = nodes(item.answerVisual), root = find(elements, "svg", "data-phase", "answer");
  assert.equal(root.attrs["data-source-item"], idFor(mission));
  geometry(mission, level, item.answerVisual, computed);
  if (mission === 6) {
    const expected = { "top-left": computed.value, "top-right": computed.geometry.topRight,
      "bottom-left": computed.geometry.bottomLeft, "bottom-right": computed.geometry.bottomRight };
    for (const [owner, value] of Object.entries(expected)) equal(areaLabel(elements, owner).value, value, `Solved ${owner} number`);
    assert.equal(elements.filter(node => node.tag === "text" && node.attrs["data-layout-role"] === "answer-value").length, level === 2 ? 2 : 1);
    assert.doesNotMatch(root.text, /㉠|□/);
  } else {
    const answer = find(elements, "text", "data-layout-role", "answer-value");
    assert.equal(answer.text, mission === 4 ? `ㅅㅇ = ${computed.answer}` : computed.answer);
    assert.equal(answer.attrs["data-owner-id"], mission === 3 ? "target-segment" : "target-height");
    assert.equal(root.attrs["data-target-segment"], mission === 3 ? "ㄴ-ㅁ" : "ㅅ-ㅇ");
    if (mission === 3) {
      const target = find(elements, "line", "data-layout-role", "target-segment").attrs;
      assert.equal(target["data-from"], "ㄴ"); assert.equal(target["data-to"], "ㅁ");
      const p = actualPoints(elements);
      coordNear(decimal(answer.attrs.x), div(add(p["ㄴ"].x, p["ㅁ"].x), two), "Solved target label centered on ㄴㅁ");
    }
  }
  const problemPoints = actualPoints(nodes(item.prompt)), answerPoints = actualPoints(elements);
  for (const [name, p] of Object.entries(problemPoints)) samePoint(p, answerPoints[name], "Problem/answer diagram geometry stays identical");
}
function sourceSelfChecks() {
  const m3 = originals[0].facts, h = decimal(m3.height), a = decimal(m3.largeArea), ratio = decimal(m3.ratio);
  const base = div(mul(two, a), h), gap = mul(base, div(sub(ratio, one), ratio));
  assert.equal(`${finite(gap)}cm`, originals[0].answer); equal(div(mul(h, sub(base, gap)), two), div(a, ratio));
  const m4 = originals[1].facts, overlap = sub(add(decimal(m4.leftArea), decimal(m4.rightArea)), decimal(m4.union));
  assert.equal(`${finite(div(mul(two, overlap), decimal(m4.base)))}cm`, originals[1].answer);
  const m6 = originals[2].facts, quotient = div(decimal(m6.topRight), decimal(m6.bottomRight));
  assert.equal(`${finite(mul(decimal(m6.bottomLeft), quotient))}cm²`, originals[2].answer);
  counts.originals = 3;
}
function styleAndLoading() {
  const index = read("index.html"), css = read("source-6-2-e2-geometry.css");
  const at = name => index.indexOf(`./${name}`);
  assert(at("generators.js") >= 0 && at("source-6-2-e2-geometry.js") > at("generators.js") && at("app.js") > at("source-6-2-e2-geometry.js"));
  assert(at("source-6-2-e2-geometry.css") > at("source-6-2-overlap-triangles.css"));
  assert.match(css, /color:\s*#000/); assert.match(css, /fill:\s*#000/); assert.match(css, /stroke:\s*#000/);
  assert.match(css, /font-weight:\s*400/); assert.match(css, /letter-spacing:\s*0/); assert.match(css, /font-family:\s*var\(--bank-font/);
  assert.doesNotMatch(css, /(?:font-weight:\s*(?:[5-9]\d\d|bold)|(?:stroke|color):\s*#[a-fA-F0-9]{6})/);
  assert.match(css, /source62-triangle-target\s*\{\s*stroke-width:\s*1\.4\s*!important/);
  warnings.push({ severity: "scope", message: "CSS/loading checked statically; computed styles, label collisions, PC/mobile/A4 remain the parent's rendered gates." });
}
function main() {
  check("Three independent originals", sourceSelfChecks);
  const context = vm.createContext({ window: {} });
  for (const name of ["source-inventory-grade6.js", "curriculum.js", "generators.js"]) vm.runInContext(read(name), context, { filename: name });
  const catalog = context.window.HSE_SOURCE_INVENTORY_GRADE6, curriculum = context.window.HSE_CURRICULUM;
  const before = { catalog: JSON.stringify(catalog), curriculum: JSON.stringify(curriculum) };
  freeze(catalog); freeze(curriculum);
  vm.runInContext(read("source-6-2-e2-geometry.js"), context, { filename: "source-6-2-e2-geometry.js" });
  const api = context.window.HSE_GENERATORS, moduleApi = context.window.HSE_SOURCE_GRADE6_E2_GEOMETRY;
  const types = curriculum.semesters.flatMap(semester => semester.units.flatMap(unit => unit.subunits.flatMap(subunit => subunit.types)));
  check("Three registrations, current loader and scoped typography", () => {
    assert(moduleApi?.registrationOnly); assert.equal(moduleApi.definitions.length, 3);
    assert.deepEqual(Array.from(moduleApi.definitions, definition => definition.sourceItemId), originals.map(source => idFor(source.mission)));
    for (const { mission } of originals) assert.equal(api.names.filter(key => key === keyFor(mission)).length, 1);
    styleAndLoading();
  });
  const cases = [];
  for (const source of originals) {
    const type = only(types.filter(type => type.sourceItemId === idFor(source.mission)), "Actual catalog type");
    check(`${idFor(source.mission)} public lock and source evidence`, () => {
      if (source.mission === 3) {
        assert.equal(type.reviewLocked, true); assert.equal(api.generatorKey(type), "");
        for (const offset of [-1, 0, 1]) for (const pool of [0, 1, 2]) assert.equal(api.generate(type, 0, offset, 1, pool), null);
      }
      const evidence = moduleApi.definitions.find(definition => definition.sourceItemId === type.sourceItemId).source;
      assert.equal(evidence.pdfPage, 19); assert.equal(evidence.printedPage, 21);
      assert.equal(evidence.publisherAnswerVerified, false); assert.equal(evidence.handwrittenAnswerVerified, false);
      assert.equal(evidence.originalAnswerStatus, "independently-computed"); assert.equal(evidence.originalAnswer, source.answer);
      assert.equal(evidence.handwritingAgreesWithCalculation, source.agreement);
      if (source.mission === 3) {
        assert.equal(evidence.handwritingReadingConfirmed, false); assert.equal(evidence.handwritingConflict, null);
        assert.match(evidence.handwritingReading, /판독 불가|불명|확정.*(?:불가|않)/);
      } else { assert.equal(evidence.handwritingReadingConfirmed, true); assert.equal(evidence.handwritingReading, source.handwriting); }
    });
    const candidate = freeze({ ...type, reviewLocked: false, generatorKey: keyFor(source.mission) });
    const mode = type.reviewLocked ? "candidate-clone" : "public";
    const inputType = type.reviewLocked ? candidate : type;
    check(`${idFor(source.mission)} actual catalog dispatch`, () => {
      if (!type.reviewLocked) {
        assert.equal(type.generatorKey, keyFor(source.mission)); assert.equal(api.generatorKey(type), keyFor(source.mission));
        assert.equal(type.problemVisualRequired, true); assert.equal(type.answerVisualRequired, true);
      }
    });
    for (const pool of [0, 1, 2]) for (const level of [0, 1, 2]) {
      const item = api.generate(inputType, 0, level - 1, 123, pool);
      cases.push({ source, type, candidate, inputType, mode, mission: source.mission, pool, level, item, label: `${idFor(source.mission)} p${pool} l${level}` });
    }
    check(`${idFor(source.mission)} forced-lock precedence`, () => {
      const forced = freeze({ ...candidate, reviewLocked: true });
      assert.equal(api.generatorKey(forced), "");
      assert.equal(api.generate(forced, 0, Infinity, 1, NaN), null); counts.forcedLock++;
    });
    for (const offset of [-2, 2, 0.5, "0", NaN, Infinity, -Infinity, true]) check(`${idFor(source.mission)} invalid offset ${String(offset)}`, () => {
      assert.throws(() => api.generate(candidate, 0, offset, 1, 0)); counts.invalidInputs++;
    });
    for (const variant of [-1, 0.5, "1", NaN, Infinity, -Infinity, Number.MAX_SAFE_INTEGER + 1, null, true]) check(`${idFor(source.mission)} invalid variant ${String(variant)}`, () => {
      assert.throws(() => api.generate(candidate, 0, 0, 1, variant)); counts.invalidInputs++;
    });
  }
  parseBatch(cases.flatMap(({ item }) => [svgMarkup(item.prompt), svgMarkup(item.answerVisual)]));
  const mutations = [];
  for (const entry of cases) check(`${entry.label} prepare actual visible-condition mutations`, () => {
    entry.computed = solve(entry.mission, entry.level, entry.item.prompt);
    const hiddenModelPrompt = entry.item.prompt.replace(/\sdata-model(?:-points)?="[^"]*"/g, "")
      .replace("<svg ", '<svg data-model="999999" data-model-points="not-an-input" ');
    entry.poisoned = { ...entry.item, prompt: hiddenModelPrompt,
      exactValues: { invalid: "99999" }, geometryModel: { invalid: "99999" }, sourceAnswer: "99999", sourceEvidence: null, verifiedPoolIndex: -99 };
    mutations.push({ ...entry, kind: "hidden-model-attributes", mutant: entry.poisoned });
    mutations.push({ ...entry, kind: "missing-condition", mutant: { ...entry.item, prompt: entry.item.prompt.replace(entry.computed.required, "") } });
    mutations.push({ ...entry, kind: "changed-condition", mutant: { ...entry.item, prompt: entry.item.prompt.replace(entry.computed.required, entry.computed.changed) } });
    const tag = only((svgMarkup(entry.item.prompt).match(/<line\b[^>]*>/g) || []).filter(tag => tag.includes('data-layout-role="' + (entry.mission === 3 ? "large-sloping-side" : entry.mission === 4 ? "left-crossing-side" : "column-divider") + '"')), "Actual line to mutate");
    const altered = tag.replace(/x2="([\d.]+)"/, (_, value) => `x2="${finite(add(decimal(value), one))}"`);
    assert.notEqual(altered, tag);
    mutations.push({ ...entry, kind: "changed-line", mutant: { ...entry.item, prompt: entry.item.prompt.replace(tag, altered) } });
    const solvedText = only((svgMarkup(entry.item.answerVisual).match(/<text\b[^>]*>[\s\S]*?<\/text>/g) || [])
      .filter(tag => tag.includes('data-layout-role="answer-value"') && (entry.mission !== 6 || tag.includes('data-owner-id="top-left"'))), "Actual solved target label");
    const valuePrefix = entry.mission === 4 ? ">ㅅㅇ = " : ">";
    const changedText = solvedText.replace(valuePrefix + finite(entry.computed.value), valuePrefix + finite(add(entry.computed.value, decimal("0.01"))));
    assert.notEqual(solvedText, changedText);
    mutations.push({ ...entry, kind: "changed-solved-number", mutant: { ...entry.item, answerVisual: entry.item.answerVisual.replace(solvedText, changedText) } });
    const expression = entry.item.solution.match(/<span class="math-inline-expression">([^<]+)<\/span>/);
    assert(expression);
    const changedEquation = expression[0].replace(/=(\d+(?:\.\d+)?)(?=<\/span>)/, (_, value) => `=${finite(add(decimal(value), decimal("0.01")))}`);
    assert.notEqual(changedEquation, expression[0]);
    mutations.push({ ...entry, kind: "changed-equation", mutant: { ...entry.item, solution: entry.item.solution.replace(expression[0], changedEquation) } });
    if (entry.mission !== 6) {
      const rightMark = only((svgMarkup(entry.item.prompt).match(/<path\b[^>]*>/g) || []).filter(tag => tag.includes('data-layout-role="right-angle"')).slice(0, 1), "Right mark to mutate");
      const changedMark = rightMark.replace('data-angle-start="', 'data-angle-start="INVALID');
      mutations.push({ ...entry, kind: "changed-right-mark", mutant: { ...entry.item, prompt: entry.item.prompt.replace(rightMark, changedMark) } });
    } else {
      const outline = only((svgMarkup(entry.item.prompt).match(/<rect\b[^>]*>/g) || [])
        .filter(tag => tag.includes('data-layout-role="outline"')), "Actual dynamic outline to mutate");
      const changedOutline = outline.replace(/width="([\d.]+)"/, (_, width) => `width="${finite(add(decimal(width), one))}"`);
      assert.notEqual(outline, changedOutline);
      mutations.push({ ...entry, kind: "changed-outline", mutant: { ...entry.item, prompt: entry.item.prompt.replace(outline, changedOutline) } });
    }
  });
  parseBatch([...mutations.flatMap(({ mutant }) => [svgMarkup(mutant.prompt), svgMarkup(mutant.answerVisual)]),
    ...cases.filter(entry => entry.poisoned).map(entry => svgMarkup(entry.poisoned.prompt))]);
  const signatures = new Set();
  for (const entry of cases) {
    const { item, mission, level, pool, inputType, source, label } = entry;
    check(`${label} visible arithmetic and equations`, () => {
      const computed = verifyArithmetic(item, mission, level); entry.computed = computed;
      const signature = JSON.stringify({ mission, facts: computed.facts, branch: computed.branch });
      assert(!signatures.has(signature), "Duplicate conditions do not count as new levels"); signatures.add(signature);
      counts.arithmetic++; counts.distinctConditions++;
      if (level === 1 && pool === 0) {
        assert.deepEqual(computed.facts, source.facts, "Independently read original conditions"); assert.equal(computed.answer, source.answer);
        counts.originalPromptMatches++;
      }
      counts[entry.mode === "public" ? "publicConditions" : "candidateConditions"]++;
      rows.push({ id: idFor(mission), pool, level, mode: entry.mode, facts: computed.facts, answer: computed.answer, reasoning: computed.branch });
    });
    if (!entry.computed) continue;
    check(`${label} learner SVG has no hidden numeric model attributes`, () => { noHiddenModelAttributes(item.prompt); counts.hiddenAttributeChecks++; });
    check(`${label} actual SVG intersection, area ratios and mark semantics`, () => { geometry(mission, level, item.prompt, entry.computed); counts.geometry++; });
    check(`${label} solved numbers and identical geometry`, () => { verifySolved(item, mission, level, entry.computed); counts.solvedDiagrams++; });
    if (mission === 6 && level === 0) check(`${label} equal metric from visible widths and areas`, () => { equalMetric(item.prompt, entry.computed); counts.equalMetric++; });
    check(`${label} producer metadata is not a solving input`, () => {
      assert.equal(solve(mission, level, entry.poisoned.prompt).answer, entry.computed.answer);
      geometry(mission, level, entry.poisoned.prompt, entry.computed); counts.metadataIndependence++;
    });
    check(`${label} modulo and maximum safe variant`, () => {
      const wrapped = api.generate(inputType, 0, level - 1, 123, pool + 3);
      for (const field of ["prompt", "answer", "solution", "answerVisual"]) assert.equal(wrapped[field], item[field]);
      assert.equal(verifyArithmetic(wrapped, mission, level).answer, entry.computed.answer); counts.modulo++;
      const highest = Number.MAX_SAFE_INTEGER - Number((BigInt(Number.MAX_SAFE_INTEGER) - BigInt(pool)) % 3n);
      assert.equal(Number(BigInt(highest) % 3n), pool);
      const boundary = api.generate(inputType, 0, level - 1, 123, highest);
      for (const field of ["prompt", "answer", "solution", "answerVisual"]) assert.equal(boundary[field], item[field]);
      assert.equal(verifyArithmetic(boundary, mission, level).answer, entry.computed.answer); counts.maxSafe++;
    });
    check(`${label} wrong, negative and leaked answers rejected`, () => {
      for (const answer of [mission === 6 ? "99999cm²" : "99999cm", `-${entry.computed.answer}`, ""]) {
        assert.throws(() => verifyArithmetic({ ...item, answer }, mission, level)); counts.negativeTests++;
      }
      assert.throws(() => verifyArithmetic({ ...item, prompt: `${item.prompt}<span hidden data-answer-source="${idFor(mission)}">${item.answer}</span>` }, mission, level)); counts.negativeTests++;
    });
    check(`${label} source and difficulty metadata follows real conditions`, () => {
      assert.equal(item.sourceItemId, idFor(mission)); assert.equal(item.generator, keyFor(mission));
      assert.equal(item.verifiedPoolIndex, pool); assert.equal(item.verifiedVariantCount, 3); assert.equal(item.difficultyLevel, level);
      assert.equal(item.difficultyOffset, level - 1); assert.equal(item.publisherAnswerVerified, false); assert.equal(item.handwrittenAnswerVerified, false);
      assert.equal(item.sourceAnswer, source.answer);
      assert.equal(item.variantProvenance, pool === 0 && level === 1 ? "source-values" : "source-structure-variant");
      assert.equal(item.difficultyStepDelta, item.reasoningSteps - item.sourceStepCount);
    });
    if (item.geometryModel?.projection && item.geometryModel.projection !== "equal-metric") {
      warnings.push({ severity: "metadata", check: label, message: `Declared projection ${item.geometryModel.projection}; do not describe it as equal-metric without matching visible geometry.` });
    }
  }
  for (const { mutant, mission, level, label, kind, computed } of mutations) check(`${label} reject ${kind} mutant`, () => {
    if (kind === "changed-line" || kind === "changed-right-mark" || kind === "changed-outline") assert.throws(() => geometry(mission, level, mutant.prompt, computed));
    else if (kind === "hidden-model-attributes") assert.throws(() => noHiddenModelAttributes(mutant.prompt));
    else if (kind === "changed-solved-number") assert.throws(() => verifySolved(mutant, mission, level, computed));
    else assert.throws(() => verifyArithmetic(mutant, mission, level));
    counts.negativeTests++;
  });
  for (const { mission } of originals) for (const pool of [0, 1, 2]) check(`${idFor(mission)} p${pool} real difficulty progression`, () => {
    const branchCases = cases.filter(entry => entry.mission === mission && entry.pool === pool);
    assert.equal(new Set(branchCases.map(entry => entry.computed?.branch)).size, 3);
    const steps = branchCases.map(entry => entry.item.reasoningSteps);
    assert(steps.every(Number.isInteger) && steps[0] < steps[1] && steps[1] < steps[2]);
    assert.equal(new Set(branchCases.map(entry => entry.item.difficultyDesign)).size, 3);
    if (mission === 6) {
      const fingerprint = rectangleFingerprint(branchCases[0].item.prompt);
      branchCases.slice(1).forEach(entry => assert.deepEqual(rectangleFingerprint(entry.item.prompt), fingerprint,
        "M6 all levels use the same actual dynamic outer rectangle and divider coordinates"));
    }
  });
  check("Expected independent test counts", () => {
    assert.equal(counts.originals, 3); assert.equal(counts.originalPromptMatches, 3);
    assert.equal(counts.publicConditions + counts.candidateConditions, 27);
    assert.equal(counts.distinctConditions, 27); assert.equal(counts.arithmetic, 27);
    assert.equal(counts.geometry, 27); assert.equal(counts.solvedDiagrams, 27); assert.equal(counts.metadataIndependence, 27);
    assert.equal(counts.hiddenAttributeChecks, 27); assert.equal(counts.equalMetric, 3);
    assert.equal(counts.modulo, 27); assert.equal(counts.maxSafe, 27); assert.equal(counts.invalidInputs, 51);
    assert.equal(counts.forcedLock, 3); assert.equal(counts.negativeTests, 297);
  });
  check("No catalog mutation or input change during this exact run", () => {
    assert.equal(JSON.stringify(catalog), before.catalog); assert.equal(JSON.stringify(curriculum), before.curriculum);
    for (const [name, bytes] of files) assert.equal(digest(fs.readFileSync(path.resolve(__dirname, name))), digest(bytes), `Input changed while auditing: ${name}`);
  });
}
check("Audit execution", main, "P1");
const inputHashes = Object.fromEntries([...files].map(([name, bytes]) => [name, digest(bytes)]));
console.log(JSON.stringify({ scope: "E2 Mission 3/4/6 only; prompt/XML-derived exact math and SVG geometry, not browser/PDF/publisher verification",
  counts, auditHash: digest(fs.readFileSync(__filename)), inputHashes,
  sourceFacts: originals.map(({ mission, ...source }) => ({ id: idFor(mission), ...source, publisherKeyVerified: false })), rows, warnings, failures }, null, 2));
if (failures.length) { console.error(`E2 GEOMETRY RELEASE AUDIT FAILED: ${failures.length} checks`); process.exitCode = 1; }
else console.log("E2 GEOMETRY RELEASE AUDIT PASS: 27 conditions, source originals, candidate M3 locked; no runtime file writes.");
