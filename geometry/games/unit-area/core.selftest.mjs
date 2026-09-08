import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { domains, problemsFor, promptFor, hintFor, solutionFor, answerFor, grade, areaOf, connectedCells } from "./core.js";
import { renderProblem } from "./render.js";

const languages = ["ko", "en", "zh", "ja"];
const all = domains.flatMap(domain => problemsFor(domain.id));
const summary = { problems: all.length, numericChecks: 0, buildChecks: 0, acceptedNonExampleBuilds: 0, triangleChecks: 0, pairChecks: 0, svgChecks: 0 };
const near = (a, b, message) => assert.ok(Math.abs(a - b) < 1e-7, `${message}: ${a} != ${b}`);
const coords = cells => cells.map(({ x, y }) => [x, y]);
const sortedKey = cells => cells.map(point => point.join(",")).sort().join(";");
function normalized(cells) {
  const minX = Math.min(...cells.map(point => point[0])), minY = Math.min(...cells.map(point => point[1]));
  return sortedKey(cells.map(([x, y]) => [x - minX, y - minY]));
}
function congruenceKey(cells) {
  return [-1, 1].flatMap(sx => [-1, 1].flatMap(sy => [false, true].map(swap =>
    normalized(cells.map(([x, y]) => swap ? [sy * y, sx * x] : [sx * x, sy * y]))))).sort()[0];
}
function shoelace(vertices) {
  return Math.abs(vertices.reduce((sum, [x, y], i) => {
    const [nx, ny] = vertices[(i + 1) % vertices.length];
    return sum + x * ny - nx * y;
  }, 0)) / 2;
}
// Independent corner omission and shoelace oracle; does not call areaOf.
function vertices(cell) {
  const corners = [[cell.x, cell.y], [cell.x + 1, cell.y], [cell.x + 1, cell.y + 1], [cell.x, cell.y + 1]];
  const omitted = { full: -1, nw: 2, ne: 3, se: 0, sw: 1 }[cell.part];
  assert.notEqual(omitted, undefined);
  return corners.filter((_, index) => index !== omitted);
}
function auditCells(cells, fullOnly = false) {
  const seen = new Set();
  for (const cell of cells) {
    assert.ok(Number.isInteger(cell.x) && Number.isInteger(cell.y));
    assert.ok(cell.x >= 0 && cell.x < 6 && cell.y >= 0 && cell.y < 6);
    const key = `${cell.x},${cell.y}`;
    assert.ok(!seen.has(key), `Overlapping cells: ${key}`);
    seen.add(key);
    if (fullOnly) assert.equal(cell.part, "full");
    near(shoelace(vertices(cell)), cell.part === "full" ? 1 : 0.5, "Independent polygon area");
  }
  return cells.reduce((sum, cell) => sum + shoelace(vertices(cell)), 0);
}
// Union-find is deliberately separate from the production breadth-first search.
function componentCount(points) {
  const parents = points.map((_, i) => i);
  const root = i => parents[i] === i ? i : (parents[i] = root(parents[i]));
  points.forEach(([x, y], i) => points.slice(0, i).forEach(([px, py], j) => {
    if (Math.abs(x - px) + Math.abs(y - py) === 1) parents[root(i)] = root(j);
  }));
  return new Set(parents.map((_, i) => root(i))).size;
}
function expectGrade(p, response, valid, correct, kind) {
  assert.deepEqual(grade(p, response), { valid, correct, kind }, `${p.id}: ${String(response)}`);
}
const attr = (tag, name) => tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
const polygons = svg => [...svg.matchAll(/<polygon\b[^>]*>/g)].map(match => match[0]);
const polygonPoints = tag => attr(tag, "points").split(" ").map(point => point.split(",").map(Number));
const visibleText = svg => [...svg.matchAll(/<text\b[^>]*>([^<]*)<\/text>/g)].map(match => match[1]);
const halfIndices = p => p.cells.flatMap((cell, index) => cell.part === "full" ? [] : [index]);

assert.deepEqual(domains.map(({ id, level }) => [id, level]), [["whole", 1], ["halves", 2], ["compare", 3], ["build", 4]]);
assert.equal(all.length, 80);
assert.equal(new Set(all.map(p => p.id)).size, 80);
assert.deepEqual(problemsFor("missing"), []);
assert.deepEqual(problemsFor("toString"), []);
assert.deepEqual(problemsFor("__proto__"), []);
assert.ok(Object.isFrozen(domains));
const fullCounts = new Set(), halfCounts = new Set(), orientations = new Set();
const classes = { less: 0, equal: 0, greater: 0 };
const scripts = { ko: /[가-힣]/u, en: /[A-Za-z]/u, zh: /[\u4e00-\u9fff]/u, ja: /[ぁ-んァ-ン]/u };

for (const domain of domains) {
  const problems = problemsFor(domain.id);
  assert.equal(problems.length, 20);
  assert.ok(Object.isFrozen(problems));
  assert.equal(new Set(problems.map(p => JSON.stringify(p.domain === "build" ? p.target : p.cells || [p.left, p.right]))).size, 20);
  problems.forEach((p, index) => {
    assert.equal(p.id, `${domain.id}-${String(index + 1).padStart(2, "0")}`);
    assert.equal(p.domain, domain.id);
    assert.equal(p.size, 6);
    assert.ok(p.kind && Object.isFrozen(p));
    assert.equal(p.unit, domain.id === "build" ? "drawing" : domain.id === "compare" ? "comparison" : "area");
    for (const lang of languages) {
      for (const value of [domain.names[lang], promptFor(p, lang), hintFor(p, lang), solutionFor(p, lang), solutionFor(p, lang, answerFor(p))]) {
        assert.ok(typeof value === "string" && value.length > 3);
        assert.match(value, scripts[lang]);
        assert.doesNotMatch(value, /undefined|NaN|Infinity|cm²|cm2|G:[\\/]|file:\/\//i);
        if (lang !== "ko") assert.doesNotMatch(value, /[가-힣]/u);
        if (lang === "en") assert.match(value, /^[\x20-\x7e]+$/);
      }
    }
    assert.equal(promptFor(p, "unknown"), promptFor(p, "ko"));
    assert.equal(hintFor(p, "unknown"), hintFor(p, "ko"));
    assert.equal(solutionFor(p, "unknown"), solutionFor(p, "ko"));
    for (const empty of [null, undefined, "", " ", "\t\n"]) expectGrade(p, empty, false, false, "empty");

    if (p.domain === "whole" || p.domain === "halves") {
      const answer = auditCells(p.cells, p.domain === "whole");
      near(answerFor(p), answer, `${p.id}: independent answer`);
      near(areaOf(p.cells), answer, `${p.id}: areaOf`);
      assert.ok(Number.isInteger(answer) && answer >= 4 && answer <= 18);
      if (p.domain === "whole") assert.equal(componentCount(coords(p.cells)), 1);
      else {
        const halves = p.cells.filter(cell => cell.part !== "full");
        assert.ok(halves.length >= 2 && halves.length <= 8 && halves.length % 2 === 0);
        fullCounts.add(p.cells.length - halves.length);
        halfCounts.add(halves.length);
        halves.forEach(cell => orientations.add(cell.part));
      }
      for (let n = 0; n <= 40; n++) {
        expectGrade(p, n, true, n === answer, n === answer ? "correct" : "retry");
        expectGrade(p, String(n), true, n === answer, n === answer ? "correct" : "retry");
        summary.numericChecks += 2;
      }
      for (const value of [String(answer), ` ${answer} `, `${answer}.0`, `${answer}.000`, `00${answer}`, answer]) expectGrade(p, value, true, true, "correct");
      for (const bad of [false, true, [], [answer], {}, { value: answer }, -1, -0.5, 1.5, NaN, Infinity, -Infinity, Number.MAX_SAFE_INTEGER + 1,
        "4x", `${answer} cm2`, "0x10", "0b100", "4e0", "4E0", "+4", "-4", "4/1", "4,0", "4.5", ".4", "4.", "1_000", "４", "4 0", "NaN", "Infinity", "9007199254740992", Symbol("4")]) {
        expectGrade(p, bad, false, false, "invalid");
        summary.numericChecks++;
      }
    } else if (p.domain === "compare") {
      const a = auditCells(p.left, true), b = auditCells(p.right, true);
      assert.ok(a >= 4 && a <= 16 && b >= 4 && b <= 16);
      assert.equal(componentCount(coords(p.left)), 1);
      assert.equal(componentCount(coords(p.right)), 1);
      const expected = a < b ? "less" : a > b ? "greater" : "equal";
      assert.equal(answerFor(p), expected);
      classes[expected]++;
      if (expected === "equal") assert.notEqual(congruenceKey(coords(p.left)), congruenceKey(coords(p.right)), "Equal areas must use noncongruent figures");
      for (const response of ["less", "equal", "greater"]) expectGrade(p, response, true, response === expected, response === expected ? "correct" : "retry");
      for (const response of ["<", ">", "=", "Less", " less ", 0, 1, false, true, [], ["equal"], {}, Symbol("less")]) expectGrade(p, response, false, false, "invalid");
    } else {
      assert.ok(Number.isInteger(p.target) && p.target >= 4 && p.target <= 23);
      assert.equal(p.example.length, p.target);
      auditCells(p.example.map(([x, y]) => ({ x, y, part: "full" })), true);
      assert.equal(componentCount(p.example), 1);
      expectGrade(p, p.example, true, true, "correct");
      assert.deepEqual(answerFor(p), p.example);
      const mutableAnswer = answerFor(p);
      mutableAnswer[0][0] = 99;
      assert.notDeepEqual(mutableAnswer, answerFor(p));
      expectGrade(p, [], false, false, "empty");
      for (const bad of [true, false, 4, "4", {}, [[0, 0], [0, 0]], [...p.example, [...p.example[0]]], [[-1, 0]], [[6, 0]], [[0, 6]], [[0, -1]],
        [[0.1, 0]], [["0", 0]], [[0]], [[0, 0, 1]], [null], [[NaN, 0]], [[Infinity, 0]], new Set(p.example)]) expectGrade(p, bad, false, false, "invalid");
      expectGrade(p, [[0, 0]], true, false, "retry");
      expectGrade(p, Array.from({ length: 36 }, (_, i) => [i % 6, Math.floor(i / 6)]), true, false, "retry");
      expectGrade(p, [[0, 0], [1, 1]], true, false, "disconnected");
      expectGrade(p, [[0, 0], [5, 5]], true, false, "disconnected");
      const checkerboard = Array.from({ length: 36 }, (_, i) => [i % 6, Math.floor(i / 6)]).filter(([x, y]) => (x + y) % 2 === 0).slice(0, p.target);
      expectGrade(p, checkerboard, true, false, "disconnected");
      for (const swapped of [p.example.toReversed(), p.example.map(([x, y]) => [5 - x, y]), p.example.map(([x, y]) => [y, 5 - x])]) expectGrade(p, swapped, true, true, "correct");
    }
  });
}
assert.equal(new Set(problemsFor("whole").map(p => congruenceKey(coords(p.cells)))).size, 20, "Whole shapes must differ beyond translation, rotation, and reflection");
assert.ok(fullCounts.size >= 8);
assert.deepEqual([...halfCounts].sort(), [2, 4, 6, 8]);
assert.deepEqual([...orientations].sort(), ["ne", "nw", "se", "sw"]);
assert.deepEqual(classes, { less: 7, equal: 6, greater: 7 });
assert.equal(connectedCells([]), false);
assert.equal(connectedCells([[0, 0], [0, 0]]), false);
assert.equal(connectedCells([[0, 0], [1, 1]]), false);
assert.equal(connectedCells([[0, 0], [1, 0], [1, 1]]), true);
assert.equal(connectedCells([[0, 0], ["1", 0]]), false);
assert.ok(Number.isNaN(areaOf([{ x: 0, y: 0, part: "bad" }])));

const buildProblems = problemsFor("build");
assert.deepEqual(buildProblems.map(p => p.target), Array.from({ length: 20 }, (_, i) => i + 4));
const byTarget = new Map(buildProblems.map(p => [p.target, p]));
// Exhaust every nonempty subset of a 4x4 window; move the window over the 6x6 board.
for (let mask = 1; mask < 65536; mask++) {
  const selection = [];
  for (let bit = 0; bit < 16; bit++) if (mask & (1 << bit)) selection.push([bit % 4 + mask % 3, Math.floor(bit / 4) + Math.floor(mask / 3) % 3]);
  const connected = componentCount(selection) === 1;
  assert.equal(connectedCells(selection), connected);
  const p = byTarget.get(selection.length) || byTarget.get(4);
  const correct = connected && selection.length === p.target;
  expectGrade(p, selection, true, correct, !connected ? "disconnected" : correct ? "correct" : "retry");
  expectGrade(byTarget.get(18), selection, true, false, connected ? "retry" : "disconnected");
  if (correct && sortedKey(selection) !== sortedKey(p.example)) summary.acceptedNonExampleBuilds++;
  summary.buildChecks += 2;
}

let seed = 918271;
function random() { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 2 ** 32; }
for (const p of buildProblems) for (let sample = 0; sample < 80; sample++) {
  const chosen = [[Math.floor(random() * 6), Math.floor(random() * 6)]];
  while (chosen.length < p.target) {
    const candidates = [];
    for (let y = 0; y < 6; y++) for (let x = 0; x < 6; x++) {
      if (!chosen.some(([cx, cy]) => cx === x && cy === y) && chosen.some(([cx, cy]) => Math.abs(cx - x) + Math.abs(cy - y) === 1)) candidates.push([x, y]);
    }
    chosen.push(candidates[Math.floor(random() * candidates.length)]);
  }
  assert.equal(componentCount(chosen), 1);
  expectGrade(p, chosen, true, true, "correct");
  summary.buildChecks++;
}
const ring = [[1, 1], [2, 1], [3, 1], [1, 2], [3, 2], [1, 3], [2, 3], [3, 3]];
expectGrade(byTarget.get(8), ring, true, true, "correct");
assert.match(solutionFor(byTarget.get(8), "en", ring), /Your 8 whole squares/);
assert.match(solutionFor(byTarget.get(8), "en"), /example/);

for (const p of all) for (const lang of languages) for (const reveal of [false, true]) for (const interactive of [false, true]) {
  const svg = renderProblem(p, { lang, reveal, interactive });
  const expectedHeight = { whole: 410, halves: 500, compare: 730, build: 440 }[p.domain];
  assert.match(svg, new RegExp(`viewBox="0 0 360 ${expectedHeight}"`));
  assert.match(svg, /<title>[^<]+<\/title>/);
  assert.doesNotMatch(svg, /undefined|NaN|Infinity|<script|<image|foreignObject|onload=|cm²|cm2|file:\/\//i);
  assert.match(svg, new RegExp(`lang="${lang}"`));
  assert.equal(svg.includes('data-answer="true"'), reveal);
  const title = svg.match(/<title>([^<]*)<\/title>/)[1];
  assert.doesNotMatch(title, /\d/);
  assert.equal(attr(svg.slice(0, svg.indexOf(">") + 1), "aria-label"), title);
  if (!reveal) {
    assert.ok(visibleText(svg).filter(value => /\d/.test(value)).every(value => (value.match(/\d+/g) || []).every(n => n === "1")), "No numerical answer before reveal");
    assert.doesNotMatch(svg, /data-pair-badge|data-count-mark|data-pair-tray/);
  }
  const buttons = [...svg.matchAll(/<(?:rect|polygon|g)\b[^>]*role="button"[^>]*>/g)].map(match => match[0]);
  const expectedButtons = !interactive || p.domain === "compare" ? 0 : p.domain === "build" ? 36 : p.domain === "halves" ? halfIndices(p).length : p.cells.length;
  assert.equal(buttons.length, expectedButtons);
  for (const tag of buttons) {
    assert.equal(attr(tag, "tabindex"), "0");
    assert.match(attr(tag, "aria-label"), scripts[lang]);
    assert.ok(["true", "false"].includes(attr(tag, "aria-pressed")));
  }
  if (!interactive) assert.doesNotMatch(svg, /data-cell=|data-half=|tabindex=/);
  if (p.domain === "halves") {
    const pieces = polygons(svg).filter(tag => attr(tag, "data-part"));
    assert.equal(pieces.length, halfIndices(p).length);
    pieces.forEach((tag, i) => {
      near(shoelace(polygonPoints(tag)), 44 * 44 / 2, "Actual rendered triangle area");
      assert.equal(attr(tag, "data-part"), p.cells[halfIndices(p)[i]].part);
      assert.equal(attr(tag, "data-half"), undefined);
      summary.triangleChecks++;
    });
    if (interactive) {
      const groups = [...svg.matchAll(/<g\b[^>]*data-half="[^>]+>/g)].map(match => match[0]);
      assert.deepEqual(groups.map(tag => Number(attr(tag, "data-half"))), halfIndices(p));
      groups.forEach(tag => assert.equal(attr(tag, "data-piece-index"), attr(tag, "data-half")));
      assert.equal((svg.match(/data-half-hitbox="true"/g) || []).length, halfIndices(p).length);
      assert.doesNotMatch(svg, /data-cell=/);
    }
  }
  if (p.domain === "compare") {
    for (const [name, cells] of [["A", p.left], ["B", p.right]]) {
      const pieces = [...svg.matchAll(new RegExp(`<g data-piece="${name}-[^>]+><rect[^>]+/>`, "g"))].map(match => match[0]);
      assert.equal(pieces.length, cells.length);
      pieces.forEach((tag, i) => {
        assert.equal(attr(tag, "data-piece"), `${name}-${i}`);
        assert.equal(attr(tag, "width"), "44");
        assert.equal(attr(tag, "height"), "44");
        assert.match(attr(tag, "transform"), /^translate\(\d+ \d+\)$/);
      });
    }
    const aligned = renderProblem(p, { lang, reveal, interactive, aligned: true });
    const before = [...svg.matchAll(/<g data-piece="[^>]+><rect[^>]+\/>/g)].map(match => match[0]);
    const after = [...aligned.matchAll(/<g data-piece="[^>]+><rect[^>]+\/>/g)].map(match => match[0]);
    assert.deepEqual(after.map(tag => tag.replace(/transform="[^"]+"/, "")), before.map(tag => tag.replace(/transform="[^"]+"/, "")), "Alignment must only translate existing full squares");
    assert.ok(before.some((tag, i) => tag !== after[i]));
    assert.equal(aligned.includes('data-answer="true"'), reveal);
  }
  summary.svgChecks++;
}

function rotated(points, angle) {
  const rad = angle * Math.PI / 180, c = Math.cos(rad), s = Math.sin(rad);
  return points.map(([x, y]) => [22 + (x - 22) * c - (y - 22) * s, 22 + (x - 22) * s + (y - 22) * c]);
}
for (const p of problemsFor("halves")) {
  const indices = halfIndices(p);
  for (const a of indices) for (const b of indices) if (a !== b) {
    const svg = renderProblem(p, { pairs: [[a, b]], interactive: true });
    assert.equal((svg.match(/data-pair="1"/g) || []).length, 2);
    assert.equal((svg.match(/data-pair-badge="1"/g) || []).length, 2);
    const tray = [...svg.matchAll(/<g data-source-half="(\d+)" transform="rotate\((-?\d+) 22 22\)">(<polygon[^>]+>)/g)];
    assert.equal(tray.length, 2);
    tray.forEach((match, slot) => {
      assert.equal(Number(match[1]), slot ? b : a);
      const transformed = rotated(polygonPoints(match[3]), Number(match[2]));
      const rounded = transformed.map(point => point.map(n => Math.round(n)));
      assert.equal(sortedKey(rounded), sortedKey(slot ? [[44, 0], [44, 44], [0, 44]] : [[0, 0], [44, 0], [0, 44]]));
      near(shoelace(transformed), 968, "Paired half preserves area after rigid rotation");
      transformed.forEach(([x, y]) => assert.ok(x >= -1e-8 && x <= 44 + 1e-8 && y >= -1e-8 && y <= 44 + 1e-8));
    });
    summary.pairChecks++;
  }
  const active = renderProblem(p, { activeHalf: indices[0], interactive: true });
  assert.equal((active.match(/data-active-half="true"/g) || []).length, 1);
  assert.doesNotMatch(active, /data-pair-badge|data-pair-tray/);
  assert.doesNotMatch(renderProblem(p, { activeHalf: null }), /data-active-half/);
  assert.doesNotMatch(renderProblem(p, { pairs: [[indices[0], indices[0]], [-1, indices[1]], [999, indices[0]], [indices[0]], ["0", indices[1]], null] }), /data-pair-tray/);
  const allPairs = Array.from({ length: indices.length / 2 }, (_, i) => [indices[i], indices[indices.length - 1 - i]]);
  const paired = renderProblem(p, { pairs: allPairs, activeHalf: indices[0], lang: "en" });
  assert.equal((paired.match(/data-pair-tray=/g) || []).length, indices.length / 2);
  assert.equal((paired.match(/data-pair-piece=/g) || []).length, indices.length);
  const reveal = renderProblem(p, { pairs: allPairs.slice(0, 1), reveal: true });
  assert.equal((reveal.match(/data-pair-tray=/g) || []).length, indices.length / 2);
}
for (const p of problemsFor("whole")) {
  const marked = renderProblem(p, { markedCells: coords(p.cells).slice(0, 3), interactive: true });
  assert.equal((marked.match(/data-count-mark=/g) || []).length, 3);
}
const draw = byTarget.get(8);
const defaultDrawing = renderProblem(draw, { reveal: true, lang: "en" });
assert.match(defaultDrawing, /One possible answer/);
assert.match(defaultDrawing, /Other shapes can also be correct/);
const ringDrawing = renderProblem(draw, { reveal: true, selectedCells: ring, lang: "en" });
assert.match(ringDrawing, /Your shape/);
assert.doesNotMatch(ringDrawing, /One possible answer/);
const drawnCells = [...ringDrawing.matchAll(/<rect data-drawing-square="([^"]+)"[^>]+fill="#c7e7db"/g)].map(match => match[1]).sort();
assert.deepEqual(drawnCells, ring.map(point => point.join(",")).sort());
assert.match(renderProblem(draw, { lang: '"><script>alert(1)</script>' }), /lang="ko"/);

if (process.argv.includes("--browser") || process.argv.includes("--snapshot")) {
  const require = createRequire(import.meta.url);
  const { chromium } = require("playwright");
  const sharp = require("sharp");
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    summary.browser = { diagramChecks: 0, labelChecks: 0, pixelChecks: 0, focusChecks: 0, halfHitChecks: 0, printPdfBytes: 0 };
    const shell = content => `<!doctype html><html><head><meta charset="utf-8"><style>*{box-sizing:border-box}body{margin:0;padding:16px;background:white;font-family:Arial,sans-serif}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,360px),360px));gap:20px;align-items:start}section{width:100%;max-width:360px;break-inside:avoid}svg{overflow:visible}@page{size:A4;margin:12mm}@media print{body{padding:0}main{display:block}section{margin:0 auto 8mm}}</style></head><body><main>${content}</main></body></html>`;
    for (const width of [1280, 390, 794]) {
      await page.setViewportSize({ width, height: width === 794 ? 1123 : 900 });
      await page.emulateMedia({ media: width === 794 ? "print" : "screen" });
      for (const lang of languages) {
        const specimens = all.flatMap(p => [
          renderProblem(p, { lang, interactive: true }),
          renderProblem(p, { lang, reveal: true }),
          ...(p.domain === "compare" ? [renderProblem(p, { lang, aligned: true }), renderProblem(p, { lang, aligned: true, reveal: true })] : []),
          ...(p.domain === "halves" ? [renderProblem(p, { lang, interactive: true, activeHalf: halfIndices(p)[0], pairs: Array.from({ length: halfIndices(p).length / 2 }, (_, i) => [halfIndices(p)[i], halfIndices(p).at(-i - 1)]) })] : []),
          ...(p.domain === "whole" ? [renderProblem(p, { lang, markedCells: coords(p.cells), interactive: true })] : []),
          ...(p.domain === "build" ? [renderProblem(p, { lang, reveal: true, selectedCells: p.example, interactive: true })] : [])
        ]);
        await page.setContent(shell(specimens.map(svg => `<section>${svg}</section>`).join("")));
        await page.evaluate(() => document.fonts.ready);
        const checked = await page.evaluate(() => {
          const failures = [], textRects = [];
          let labels = 0;
          for (const svg of document.querySelectorAll("svg")) {
            const bounds = svg.getBoundingClientRect(), vb = svg.viewBox.baseVal;
            if (bounds.width < 340 || bounds.right > innerWidth + 1) failures.push("Unexpected scale or overflow");
            const cue = svg.querySelector("[data-unit-cue] rect").getBoundingClientRect();
            const grid = svg.querySelector("[data-grid] rect").getBoundingClientRect();
            if (Math.abs(cue.width - grid.width / 6) > 0.1 || Math.abs(cue.height - cue.width) > 0.1) failures.push("Unit cue scale mismatch");
            const current = [];
            for (const label of svg.querySelectorAll("text")) {
              const r = label.getBoundingClientRect();
              labels++;
              if (r.left < bounds.left - 1 || r.right > bounds.right + 1 || r.top < bounds.top - 1 || r.bottom > bounds.bottom + 1) failures.push(`Out of bounds: ${label.textContent}`);
              for (const prior of current) if (Math.min(r.right, prior.right) - Math.max(r.left, prior.left) > 1 && Math.min(r.bottom, prior.bottom) - Math.max(r.top, prior.top) > 1) failures.push(`Overlapping label: ${label.textContent}`);
              current.push({ left: r.left, top: r.top, right: r.right, bottom: r.bottom });
            }
            if (svg.getBBox().width > vb.width + 1) failures.push("SVG geometry outside viewBox");
            for (const group of svg.querySelectorAll("[data-piece]")) {
              const tile = group.querySelector("rect");
              if (tile.width.baseVal.value !== 44 || tile.height.baseVal.value !== 44) failures.push("Resized compare piece");
              const matrix = group.transform.baseVal.consolidate().matrix;
              if (matrix.a !== 1 || matrix.d !== 1 || matrix.b !== 0 || matrix.c !== 0) failures.push("Compare piece transformed beyond translation");
            }
            textRects.push(current.length);
          }
          return { failures, labels, diagrams: textRects.length };
        });
        assert.deepEqual(checked.failures, [], `Browser ${width}px ${lang}`);
        summary.browser.diagramChecks += checked.diagrams;
        summary.browser.labelChecks += checked.labels;
      }
    }
    await page.setViewportSize({ width: 390, height: 900 });
    await page.emulateMedia({ media: "screen" });
    for (const p of problemsFor("halves")) {
      await page.setContent(shell(`<section>${renderProblem(p, { interactive: true })}</section>`));
      await page.evaluate(() => {
        window.halfHits = [];
        document.addEventListener("click", event => {
          const half = event.target.closest("[data-half]");
          if (half) window.halfHits.push(Number(half.getAttribute("data-half")));
        });
      });
      const expectedHits = [];
      for (const index of halfIndices(p)) {
        const half = page.locator(`[data-half="${index}"]`);
        const hitbox = await half.locator("[data-half-hitbox]").boundingBox();
        assert.ok(Math.abs(hitbox.width - 44 * 358 / 360) < 0.02, "Full-cell hit width at 390px");
        assert.ok(Math.abs(hitbox.height - hitbox.width) < 0.02, "Square half-cell hitbox");
        await half.click();
        // Focus strokes can extend the group bounds; sample the actual hit rectangle.
        await page.mouse.click(hitbox.x + 2, hitbox.y + 2);
        await page.mouse.click(hitbox.x + hitbox.width - 2, hitbox.y + hitbox.height - 2);
        expectedHits.push(index, index, index);
        summary.browser.halfHitChecks += 3;
      }
      assert.deepEqual(await page.evaluate(() => window.halfHits), expectedHits, `${p.id}: center and unshaded corners must activate the correct half`);
    }
    const denseHalf = problemsFor("halves").find(p => halfIndices(p).length === 8);
    const ordered = halfIndices(denseHalf);
    const pairs = [[ordered[0], ordered[2]], [ordered[1], ordered[5]], [ordered[3], ordered[7]], [ordered[4], ordered[6]]];
    await page.setViewportSize({ width: 390, height: 900 });
    await page.emulateMedia({ media: "screen" });
    const examples = [renderProblem(denseHalf, { lang: "ko", pairs, activeHalf: ordered[2], interactive: true }), renderProblem(problemsFor("compare")[13], { lang: "en", aligned: true }), ringDrawing];
    await page.setContent(shell(examples.map(svg => `<section>${svg}</section>`).join("")));
    await page.keyboard.press("Tab");
    assert.equal(await page.evaluate(() => document.activeElement?.getAttribute("role")), "button");
    summary.browser.focusChecks++;
    const focused = await page.evaluate(() => document.activeElement?.getAttribute("data-half"));
    assert.equal(Number(focused), ordered[0]);
    await page.keyboard.press("Tab");
    assert.notEqual(await page.evaluate(() => document.activeElement?.getAttribute("data-half")), focused);
    summary.browser.focusChecks++;
    for (let i = 0; i < 3; i++) {
      const png = await page.locator("svg").nth(i).screenshot();
      const { data, info } = await sharp(png).removeAlpha().raw().toBuffer({ resolveWithObject: true });
      let colored = 0;
      for (let j = 0; j < data.length; j += info.channels) if (Math.max(data[j], data[j + 1], data[j + 2]) - Math.min(data[j], data[j + 1], data[j + 2]) > 15) colored++;
      assert.ok(colored > 3000, "Diagram must render real colored area pieces");
      summary.browser.pixelChecks++;
    }
    await page.emulateMedia({ media: "print" });
    const pdf = await page.pdf({ format: "A4", printBackground: true, preferCSSPageSize: true });
    assert.equal(pdf.subarray(0, 5).toString(), "%PDF-");
    assert.ok(pdf.length > 8000);
    summary.browser.printPdfBytes = pdf.length;
    assert.deepEqual(errors, []);
    if (process.argv.includes("--snapshot")) {
      await page.emulateMedia({ media: "screen" });
      await page.setViewportSize({ width: 1160, height: 780 });
      await page.setContent(shell(examples.map(svg => `<section>${svg}</section>`).join("")));
      summary.snapshot = (await page.screenshot({ type: "jpeg", quality: 70 })).toString("base64");
    }
  } finally {
    await browser.close();
  }
}

console.log(JSON.stringify(summary));
