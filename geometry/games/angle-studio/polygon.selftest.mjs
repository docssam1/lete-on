import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { pathToFileURL } from "node:url";
import {
  polygonProblems, polygonPrompt, polygonSolution, polygonAnswer, renderPolygon, polygonHint,
} from "./polygon.js";

const locales = ["ko", "en", "zh", "ja"];
const near = (actual, expected, message, tolerance = 1e-6) => assert.ok(Math.abs(actual - expected) < tolerance, `${message}: ${actual} != ${expected}`);
const length = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const determinant = (a, b, c) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
const area = (points) => Math.abs(points.reduce((sum, [x, y], i) => {
  const [nx, ny] = points[(i + 1) % points.length];
  return sum + x * ny - nx * y;
}, 0)) / 2;

// Independent of the module's dot-product/acos measurement and n - 2 answer.
function anglesFromCoordinates(points) {
  return points.map((p, i) => {
    const a = points[(i + points.length - 1) % points.length], b = points[(i + 1) % points.length];
    const from = Math.atan2(a[1] - p[1], a[0] - p[0]);
    const to = Math.atan2(b[1] - p[1], b[0] - p[0]);
    let angle = ((to - from) * 180 / Math.PI + 360) % 360;
    if (angle > 180) angle = 360 - angle;
    return angle;
  });
}

function auditProblem(p) {
  assert.match(p.id, /^polygon-\d{2}$/);
  assert.equal(p.domain, "polygon");
  assert.ok(["triangles", "sum", "missing", "regular"].includes(p.kind));
  assert.equal(p.vertices.length, p.sides);
  assert.ok(Number.isInteger(p.sides) && p.sides >= 3 && p.sides <= 9);
  assert.ok(Number.isInteger(p.anchor) && p.anchor >= 0 && p.anchor < p.sides);
  assert.equal(p.unit, p.kind === "triangles" ? "count" : "degree");
  for (const point of p.vertices) {
    assert.equal(point.length, 2);
    assert.ok(point.every(Number.isFinite));
    assert.ok(point[0] >= 60 && point[0] <= 300 && point[1] >= 44 && point[1] <= 230);
  }
  const points = p.vertices, n = points.length;
  const orientation = Math.sign(determinant(points[0], points[1], points[2]));
  for (let i = 0; i < n; i++) {
    assert.ok(length(points[i], points[(i + 1) % n]) >= 24);
    for (let j = 0; j < n; j++) {
      if (j !== i && j !== (i + 1) % n) assert.ok(orientation * determinant(points[i], points[(i + 1) % n], points[j]) > 0.001);
    }
  }
  const triangles = [];
  for (let i = 1; i < n - 1; i++) triangles.push([points[p.anchor], points[(p.anchor + i) % n], points[(p.anchor + i + 1) % n]]);
  const triangleAreas = triangles.map(area);
  assert.ok(triangleAreas.every((a) => a > 60));
  near(triangleAreas.reduce((s, a) => s + a, 0), area(points), `${p.id}: fan exactly covers polygon`);
  const angles = anglesFromCoordinates(points);
  const measuredSum = angles.reduce((s, a) => s + a, 0);
  for (const tri of triangles) near(anglesFromCoordinates(tri).reduce((s, a) => s + a, 0), 180, `${p.id}: triangle sum`);
  near(measuredSum, triangles.length * 180, `${p.id}: measured interior sum`);
  if (p.kind === "missing") {
    assert.ok([3, 4].includes(n));
    assert.ok(Number.isInteger(p.target) && p.target >= 0 && p.target < n);
    assert.equal(p.knownAngles.length, n);
    assert.equal(p.knownAngles[p.target], null);
    assert.equal(p.knownAngles.filter((v) => v === null).length, 1);
    for (let i = 0; i < n; i++) if (i !== p.target) {
      assert.ok(Number.isInteger(p.knownAngles[i]) && p.knownAngles[i] > 0 && p.knownAngles[i] < 180);
      near(angles[i], p.knownAngles[i], `${p.id}: given angle ${i}`);
    }
  } else assert.equal(p.knownAngles, undefined);
  if (p.kind === "regular") {
    assert.equal(p.regular, true);
    assert.ok(Number.isInteger(p.target) && p.target >= 0 && p.target < n);
    points.forEach((v, i) => {
      near(length(v, points[(i + 1) % n]), length(points[0], points[1]), `${p.id}: equal sides`);
      near(angles[i], angles[0], `${p.id}: equal angles`);
    });
    near(angles[0], Math.round(angles[0]), `${p.id}: integer regular angle`);
  } else assert.ok(!p.regular);
  const measuredAnswer = p.kind === "triangles" ? triangles.length : p.kind === "sum" ? measuredSum : angles[p.target];
  near(measuredAnswer, Math.round(measuredAnswer), `${p.id}: exact integer answer`);
  near(polygonAnswer(p), measuredAnswer, `${p.id}: independent answer`);
  return Math.round(measuredAnswer);
}

// All normalized pairwise distances reject duplicates even after rotation,
// translation, reflection, resizing, or changing the starting vertex.
function diagramKey(p) {
  const points = p.vertices, n = points.length;
  const perimeter = points.reduce((sum, v, i) => sum + length(v, points[(i + 1) % n]), 0);
  const keys = [];
  for (const direction of [1, -1]) for (let start = 0; start < n; start++) {
    const sequence = Array.from({ length: n }, (_, i) => points[(start + direction * i + n) % n]);
    keys.push(sequence.flatMap((a, i) => sequence.slice(i + 1).map((b) => (length(a, b) / perimeter).toFixed(7))).join(","));
  }
  return `${n}:${keys.sort()[0]}`;
}

function auditBank(bank) {
  assert.equal(bank.length, 20);
  assert.equal(new Set(bank.map((p) => p.id)).size, 20);
  assert.equal(new Set(bank.map(diagramKey)).size, 20);
  bank.forEach(auditProblem);
}

export function runPolygonSelftest() {
  auditBank(polygonProblems);
  assert.ok(Object.isFrozen(polygonProblems));
  assert.ok(polygonProblems.every((p) => Object.isFrozen(p) && Object.isFrozen(p.vertices) && p.vertices.every(Object.isFrozen)));
  assert.deepEqual(polygonProblems.map((p) => p.kind), [...Array(5).fill("triangles"), ...Array(5).fill("sum"), ...Array(7).fill("missing"), ...Array(3).fill("regular")]);
  assert.deepEqual(polygonProblems.map(polygonAnswer), [2, 3, 4, 5, 6, 360, 540, 720, 900, 1260, 60, 52, 96, 110, 105, 70, 115, 108, 120, 135]);
  const before = JSON.stringify(polygonProblems);
  let renderChecks = 0;
  for (const p of polygonProblems) for (const lang of locales) {
    const prompt = polygonPrompt(p, lang), hint = polygonHint(p, lang), solution = polygonSolution(p, lang);
    for (const value of [prompt, hint, solution]) {
      assert.ok(typeof value === "string" && value.length > 20);
      assert.doesNotMatch(value, /undefined|NaN|Infinity|<script|polygon-\d/);
    }
    assert.ok(solution.includes(String(polygonAnswer(p))));
    assert.doesNotMatch(prompt, /=/);
    if (lang !== "ko") assert.doesNotMatch(prompt + hint + solution, /[\uac00-\ud7af]/);
    if (p.kind === "regular") assert.match(prompt, { ko: /정.+각형/, en: /regular/, zh: /正.+边形/, ja: /正.+角形/ }[lang]);
    if (p.kind === "triangles") {
      assert.match(prompt, { ko: /대각선을 그어 보세요\./, en: /^Draw diagonals/, zh: /^请从.*画对角线。/, ja: /対角線を引きましょう。/ }[lang]);
      assert.doesNotMatch(prompt, /그으면|If you|如果|引くと/);
    }
    const student = renderPolygon(p, { lang }), revealed = renderPolygon(p, { lang, reveal: true });
    assert.equal(student, renderPolygon(p, { lang }));
    assert.equal((student.match(/<svg\b/g) || []).length, 1);
    assert.match(student, /viewBox="0 0 360 300"/);
    assert.match(student, /role="img"/);
    assert.match(student, /<title>[^<>]+<\/title><desc>[^<>]+<\/desc>/);
    assert.match(student, /GFIELD/);
    assert.doesNotMatch(student, /data-diagonal|data-triangle-number|data-solution-step|data-answer|opacity="0"|visibility|display:none|NaN|undefined|<script|href=|<foreignObject/);
    assert.equal(student.match(/<title>(.*?)<\/title>/)[1], revealed.match(/<title>(.*?)<\/title>/)[1]);
    assert.doesNotMatch(student.match(/<title>(.*?)<\/title>/)[1], /\d|\u00b0/);
    const description = student.match(/<desc>(.*?)<\/desc>/)[1];
    assert.deepEqual(description.match(/\d+/g) || [], p.kind === "missing" ? p.knownAngles.filter((v) => v !== null).map(String) : [], "accessible description contains only given numbers");
    assert.doesNotMatch(description, /=|\u00d7|\u00f7/);
    const visibleStudent = [...student.matchAll(/<text\b[^>]*>(.*?)<\/text>/g)].map((m) => m[1]);
    const degreeLabels = visibleStudent.filter((value) => value.endsWith("\u00b0"));
    assert.deepEqual(degreeLabels, p.kind === "missing" ? p.knownAngles.filter((v) => v !== null).map((v) => `${v}\u00b0`) : []);
    assert.equal(visibleStudent.filter((v) => v === "?").length, ["missing", "regular"].includes(p.kind) ? 1 : 0);
    assert.equal((revealed.match(/data-solution-step/g) || []).length, 2);
    assert.equal((revealed.match(/data-diagonal/g) || []).length, p.kind === "missing" ? 0 : p.sides - 3);
    assert.equal((revealed.match(/data-triangle-number/g) || []).length, ["triangles", "sum"].includes(p.kind) ? p.sides - 2 : 0);
    const renderedPoints = student.match(/data-polygon-outline="true" points="([^"]+)"/)[1].split(" ").map((pair) => pair.split(",").map(Number));
    anglesFromCoordinates(renderedPoints).forEach((angle, i) => near(angle, anglesFromCoordinates(p.vertices)[i], `${p.id}: serialized SVG angle`, 1e-6));
    assert.ok(!solution.includes("undefined"));
    renderChecks += 2;
  }
  assert.equal(JSON.stringify(polygonProblems), before);
  for (const p of polygonProblems) {
    for (const fn of [polygonPrompt, polygonHint, polygonSolution]) assert.equal(fn(p, "invalid"), fn(p, "ko"));
    assert.equal(renderPolygon(p, { lang: "invalid" }), renderPolygon(p));
    assert.equal(renderPolygon(p, { interactive: false, selectedVertices: [] }), renderPolygon(p), "worksheet default remains unchanged");
    assert.equal(renderPolygon(p, { reveal: true, interactive: true, selectedVertices: null }), renderPolygon(p, { reveal: true }), "reveal ignores stale learner state");
    if (p.kind !== "triangles") assert.equal(renderPolygon(p, { interactive: true, selectedVertices: null }), renderPolygon(p), "other domains ignore construction options");
  }
  let constructionChecks = 0;
  for (const seed of polygonProblems.filter((p) => p.kind === "triangles")) {
    for (let anchor = 0; anchor < seed.sides; anchor++) for (const lang of locales) {
      const p = { ...seed, anchor };
      const others = p.vertices.map((_, i) => i).filter((i) => i !== anchor);
      for (let mask = 0; mask < 2 ** others.length; mask++) {
        const selectedVertices = Object.freeze(others.filter((_, i) => mask & 2 ** i));
        const svg = renderPolygon(p, { lang, interactive: true, selectedVertices });
        assert.match(svg, /role="group" data-polygon-interactive="true"/);
        assert.doesNotMatch(svg, /data-triangle-number|data-solution-step|data-answer/);
        const buttons = [...svg.matchAll(/<g data-vertex="(\d+)"([^>]+)>(.*?)<\/g>/g)];
        assert.deepEqual(buttons.map((m) => Number(m[1])), others, "adjacent vertices stay clickable too");
        for (const [full, index, attributes, content] of buttons) {
          const letter = "ABCDEFGHI"[Number(index)];
          assert.match(attributes, /role="button" tabindex="0"/);
          assert.ok(attributes.includes(`aria-pressed="${selectedVertices.includes(Number(index))}"`));
          assert.ok(attributes.includes(`aria-label="${letter}"`));
          assert.ok(content.startsWith(`<title>${letter}</title>`));
          assert.match(full, /data-vertex-hit="true"[^>]+r="20"/);
          assert.equal((content.match(/<text\b/g) || []).length, 1);
          assert.doesNotMatch(content, /correct|wrong|diagonal|non-neighbor/);
        }
        const expected = selectedVertices.filter((i) => {
          const offset = (i - anchor + p.sides) % p.sides;
          return offset > 1 && offset < p.sides - 1;
        });
        const drawn = [...svg.matchAll(/data-diagonal="(\d+)" data-learner-diagonal="true" d="M([\d.,-]+) L([\d.,-]+)"/g)];
        assert.deepEqual(drawn.map((m) => Number(m[1])), expected);
        for (const [, index, from, to] of drawn) {
          from.split(",").map(Number).forEach((v, i) => near(v, p.vertices[anchor][i], "learner line starts at anchor"));
          to.split(",").map(Number).forEach((v, i) => near(v, p.vertices[Number(index)][i], "learner line ends at selection"));
        }
        assert.equal(svg.match(/<desc>(.*?)<\/desc>/)[1], renderPolygon(p, { lang }).match(/<desc>(.*?)<\/desc>/)[1], "selection adds no answer to accessible description");
        constructionChecks++;
      }
    }
  }
  const constructionSeed = polygonProblems[1];
  assert.equal(renderPolygon(constructionSeed, { interactive: true, selectedVertices: [3, 2, 3, 0] }), renderPolygon(constructionSeed, { interactive: true, selectedVertices: [2, 3] }), "duplicate choices and the anchor do not add duplicate lines");
  const readOnlyDrawing = renderPolygon(constructionSeed, { selectedVertices: [2] });
  assert.match(readOnlyDrawing, /data-learner-diagonal/);
  assert.doesNotMatch(readOnlyDrawing, /role="button"|tabindex|data-vertex=/);
  let negativeControls = 0;
  function reject(index, change) {
    const p = structuredClone(polygonProblems[index]);
    change(p);
    assert.throws(() => auditProblem(p));
    for (const fn of [polygonAnswer, polygonPrompt, polygonHint, polygonSolution, renderPolygon]) assert.throws(() => fn(p));
    negativeControls++;
  }
  reject(0, (p) => { p.domain = "fields"; });
  reject(0, (p) => { p.id = "<script>"; });
  reject(0, (p) => { p.kind = "exterior"; });
  reject(0, (p) => { p.unit = "degree"; });
  reject(10, (p) => { p.unit = "count"; });
  reject(0, (p) => { p.sides++; });
  reject(0, (p) => { p.anchor = -1; });
  reject(0, (p) => { p.anchor = 0.5; });
  reject(0, (p) => { p.vertices[0][0] = NaN; });
  reject(0, (p) => { p.vertices[0][0] = Infinity; });
  reject(0, (p) => { p.vertices[0][0] = 350; });
  reject(0, (p) => { p.vertices[0][1] = 299; });
  reject(0, (p) => { p.vertices[0] = [...p.vertices[1]]; });
  reject(0, (p) => { p.vertices[0] = [180, 137]; });
  reject(0, (p) => { [p.vertices[1], p.vertices[2]] = [p.vertices[2], p.vertices[1]]; });
  reject(0, (p) => { p.vertices[1] = p.vertices[0].map((v, i) => (v + p.vertices[2][i]) / 2); });
  reject(10, (p) => { p.knownAngles[0]++; });
  reject(10, (p) => { p.knownAngles[0] = null; });
  reject(10, (p) => { p.knownAngles[2] = 60; });
  reject(10, (p) => { p.target = 3; });
  reject(10, (p) => { p.knownAngles[0] = 0; });
  reject(10, (p) => { p.knownAngles[1] = 180; });
  reject(10, (p) => { p.vertices[0][0] += 3; });
  reject(0, (p) => { p.knownAngles = [90, 90, 90, 90]; });
  reject(17, (p) => { p.regular = false; });
  reject(17, (p) => { p.vertices[1][0] += 5; });
  reject(17, (p) => { p.target = -1; });
  reject(0, (p) => { p.regular = true; });
  assert.throws(() => auditBank(polygonProblems.slice(1)));
  const duplicateId = structuredClone(polygonProblems);
  duplicateId[1].id = duplicateId[0].id;
  assert.throws(() => auditBank(duplicateId));
  const duplicateShape = structuredClone(polygonProblems);
  duplicateShape[5].vertices = structuredClone(duplicateShape[0].vertices);
  assert.throws(() => auditBank(duplicateShape));
  for (const value of ["false", 0, 1, null]) assert.throws(() => renderPolygon(polygonProblems[0], { reveal: value }));
  for (const fn of [polygonAnswer, polygonPrompt, polygonHint, polygonSolution, renderPolygon]) assert.throws(() => fn(null));
  negativeControls += 12;
  for (const interactive of ["false", 0, 1, null]) {
    assert.throws(() => renderPolygon(constructionSeed, { interactive }));
    negativeControls++;
  }
  for (const selectedVertices of [null, {}, "2", ["2"], [-1], [5], [1.5], [NaN], [Infinity], [undefined], Array(1)]) {
    assert.throws(() => renderPolygon(constructionSeed, { interactive: true, selectedVertices }));
    negativeControls++;
  }
  return { problems: 20, locales: 4, renderChecks, constructionChecks, negativeControls };
}

// Optional browser evidence is in-memory; this runner creates no repo artifacts.
export async function runPolygonBrowserChecks() {
  const require = createRequire(import.meta.url);
  const { chromium } = require("playwright");
  const browser = await chromium.launch({ headless: true });
  let diagrams = 0, textBoxes = 0, pointerChecks = 0, keyboardChecks = 0;
  try {
    for (const width of [1280, 390]) {
      const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
      for (const lang of locales) for (const state of ["student", "reveal", "empty", "partial", "complete"]) {
        const interactive = !["student", "reveal"].includes(state), reveal = state === "reveal";
        const problems = interactive ? polygonProblems.filter((p) => p.kind === "triangles") : polygonProblems;
        await page.setContent(`<html lang="${lang}"><meta charset="utf-8"><style>body{margin:16px}main{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,360px),360px));gap:16px}section{min-width:0}svg{max-width:100%!important}</style><main>${problems.map((p) => {
          const eligible = p.vertices.map((_, i) => i).filter((i) => { const offset = (i - p.anchor + p.sides) % p.sides; return offset > 1 && offset < p.sides - 1; });
          const selectedVertices = state === "complete" ? eligible : state === "partial" ? eligible.slice(0, 1) : [];
          return `<section data-id="${p.id}">${renderPolygon(p, { lang, reveal, interactive, selectedVertices })}</section>`;
        }).join("")}</main></html>`);
        await page.evaluate(() => document.fonts.ready);
        const results = await page.evaluate(() => [...document.querySelectorAll("svg")].map((svg) => {
          const texts = [...svg.querySelectorAll("text")].map((node) => {
            const box = node.getBBox();
            return { value: node.textContent, x: box.x, y: box.y, width: box.width, height: box.height };
          });
          const outside = texts.filter((b) => b.x < 4 || b.y < 4 || b.x + b.width > 356 || b.y + b.height > 300);
          const overlaps = texts.flatMap((a, i) => texts.slice(i + 1).filter((b) => a.x < b.x + b.width + 2 && a.x + a.width + 2 > b.x && a.y < b.y + b.height + 2 && a.y + a.height + 2 > b.y).map((b) => [a.value, b.value]));
          const buttonIssues = [...svg.querySelectorAll("[data-vertex]")].flatMap((button) => {
            const label = button.querySelector("text").getBBox(), ring = button.querySelector("[data-vertex-ring]"), hit = button.querySelector("[data-vertex-hit]");
            const x = ring.cx.baseVal.value, y = ring.cy.baseVal.value, radius = ring.r.baseVal.value;
            const corners = [[label.x, label.y], [label.x + label.width, label.y], [label.x, label.y + label.height], [label.x + label.width, label.y + label.height]];
            return corners.some(([cx, cy]) => Math.hypot(cx - x, cy - y) > radius - 1) || hit.r.baseVal.value !== 20 || x - 20 < 4 || y - 20 < 4 || x + 20 > 356 || y + 20 > 296 ? [button.dataset.vertex] : [];
          });
          return { id: svg.parentElement.dataset.id, outside, overlaps, buttonIssues, textBoxes: texts.length };
        }));
        for (const result of results) {
          assert.deepEqual(result.outside, [], `${result.id} ${width} ${lang} ${state}: clipped label`);
          assert.deepEqual(result.overlaps, [], `${result.id} ${width} ${lang} ${state}: overlapping labels`);
          assert.deepEqual(result.buttonIssues, [], `${result.id} ${width} ${lang} ${state}: button label or hit area`);
          textBoxes += result.textBoxes;
        }
        assert.equal(await page.getByRole("button").count(), interactive ? problems.reduce((sum, p) => sum + p.sides - 1, 0) : 0, "SVG controls are present in the accessibility tree");
        if (state === "empty") {
          await page.evaluate(() => {
            window.polygonEvents = [];
            const record = (event) => {
              const button = event.target.closest("[data-vertex]");
              if (!button) return;
              if (event.type === "keydown") event.preventDefault();
              window.polygonEvents.push([button.closest("section").dataset.id, Number(button.dataset.vertex), event.type, event.key || ""]);
            };
            document.addEventListener("click", record);
            document.addEventListener("keydown", record);
          });
          for (const p of problems) for (let i = 0; i < p.sides; i++) if (i !== p.anchor) {
            const button = page.locator(`[data-id="${p.id}"]`).getByRole("button", { name: "ABCDEFGHI"[i], exact: true });
            await button.click({ position: { x: 38, y: 20 } });
            await button.focus();
            await button.press("Enter");
            await button.press("Space");
            assert.equal(await button.locator("[data-vertex-ring]").evaluate((node) => getComputedStyle(node).strokeWidth), "3px");
            assert.equal(await button.getAttribute("aria-pressed"), "false", "the shared UI, not the SVG, owns state");
            const events = await page.evaluate(() => window.polygonEvents.splice(0));
            assert.deepEqual(events, [[p.id, i, "click", ""], [p.id, i, "keydown", "Enter"], [p.id, i, "keydown", " "]]);
            pointerChecks++;
            keyboardChecks += 2;
          }
        }
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
        diagrams += results.length;
      }
      await page.close();
    }
  } finally { await browser.close(); }
  return { diagrams, textBoxes, pointerChecks, keyboardChecks, viewports: [1280, 390] };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  console.log("polygon selftest:", JSON.stringify(runPolygonSelftest()));
  if (process.argv.includes("--browser")) console.log("polygon browser:", JSON.stringify(await runPolygonBrowserChecks()));
}
