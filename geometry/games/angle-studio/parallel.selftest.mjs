import assert from "node:assert/strict";
import { parallelProblems, parallelPrompt, parallelHint, parallelSolution, parallelAnswer, parallelGeometry, validateParallelProblem, renderParallel } from "./parallel.js";

const languages = ["ko", "en", "zh", "ja"];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1];
const cross = (a, b) => a[0] * b[1] - a[1] * b[0];
const subtract = (a, b) => a.map((v, i) => v - b[i]);
const normalize = v => v.map(n => n / Math.hypot(...v));
const near = (a, b, description) => assert.ok(Math.abs(a - b) < 1e-8, `${description}: ${a} vs ${b}`);
const interior = (g, s) => dot(subtract(s.labelPoint, s.center), subtract(g.lines[1 - s.crossing].center, s.center)) > 0;
const side = (g, s) => Math.sign(cross(g.transversal.direction, subtract(s.labelPoint, s.center)));
const angle = s => Math.acos(Math.max(-1, Math.min(1, dot(...s.arms)))) * 180 / Math.PI;
const position = p => p.responseKind === "angle-label";

assert.equal(parallelProblems.length, 20);
assert.deepEqual(parallelProblems.map(p => p.id), Array.from({ length: 20 }, (_, i) => `parallel-${String(i + 1).padStart(2, "0")}`));
assert.equal(parallelProblems.filter(p => p.kind === "corresponding-position").length, 6);
assert.equal(parallelProblems.filter(p => p.kind === "alternate-position").length, 4);
assert.equal(parallelProblems.filter(p => !position(p)).length, 10);
assert.equal(parallelProblems.filter(p => !p.parallel).length, 6);
assert.equal(new Set(parallelProblems.map(p => `${p.tilt}/${p.secondTilt}/${p.rotation}`)).size, 20);
assert.ok(Object.isFrozen(parallelProblems));

let numericChecks = 0, positionCandidates = 0, renderedStates = 0;
for (const p of parallelProblems) {
  assert.equal(validateParallelProblem(p), true);
  const g = parallelGeometry(p), answer = parallelAnswer(p), source = g.sectors[p.source];
  assert.ok(Number.isInteger(answer));
  for (const l of g.lines) near(Math.abs(cross(l.direction, g.transversal.direction)), Math.abs(cross(normalize(subtract(l.end, l.start)), normalize(subtract(g.transversal.end, g.transversal.start)))), p.id);
  near(cross(g.lines[0].direction, g.lines[1].direction), Math.sin(p.secondTilt * Math.PI / 180), p.id);
  g.sectors.forEach(s => {
    near(angle(s), s.sweep, p.id);
    const line = g.lines[s.crossing];
    s.arms.forEach(arm => assert.ok(Math.abs(cross(arm, line.direction)) < 1e-8 || Math.abs(cross(arm, g.transversal.direction)) < 1e-8));
  });
  if (position(p)) {
    // Classify from half-plane positions, independently of the module's index map.
    const candidates = g.sectors.filter(s => {
      positionCandidates++;
      if (s.crossing === source.crossing) return false;
      if (p.kind === "alternate-position") return interior(g, s) && interior(g, source) && side(g, s) !== side(g, source);
      const above = x => Math.sign(cross(g.lines[x.crossing].direction, subtract(x.labelPoint, x.center)));
      return above(s) === above(source) && side(g, s) === side(g, source);
    });
    assert.equal(candidates.length, 1, p.id);
    assert.equal(candidates[0].label, answer, p.id);
    if (!p.parallel) assert.ok(Math.abs(angle(source) - angle(candidates[0])) > 1, "Nonparallel positions must not suggest equal angles");
    for (const s of g.sectors) for (const other of g.sectors) {
      if (s.index < other.index) assert.ok(Math.hypot(...subtract(s.labelPoint, other.labelPoint)) > 28, `${p.id}: overlapping number badges`);
    }
  } else {
    const target = g.sectors[p.target];
    near(angle(source), p.given, `${p.id}: given`);
    near(angle(target), answer, `${p.id}: answer`);
    const ratio = angle(target) / angle(source);
    if (["same-side-interior-angle", "supplementary-transfer-angle"].includes(p.kind)) near(angle(target) + angle(source), 180, p.id);
    else near(ratio, 1, p.id);
    numericChecks += 2;
  }
  for (const lang of languages) {
    assert.match(parallelPrompt(p, lang), /ℓ/u);
    assert.doesNotMatch(parallelPrompt(p, lang), /(?:직선|Lines|直线|直線) l(?:\s|과)/u);
    for (const text of [parallelPrompt(p, lang), parallelHint(p, lang), parallelSolution(p, lang)]) {
      assert.ok(text && !text.includes("undefined") && !text.includes("NaN"));
      if (lang !== "ko") assert.ok(!/[가-힣]/u.test(text));
    }
    assert.ok(parallelSolution(p, lang).includes(String(answer)));
    for (const reveal of [false, true]) {
      const svg = renderParallel(p, { reveal, lang });
      assert.match(svg, /viewBox="0 0 360 320"/);
      assert.match(svg, /<title>[^<]+<\/title>/);
      assert.match(svg, /<text[^>]*>ℓ<\/text>/u);
      assert.doesNotMatch(svg, /<text[^>]*>l<\/text>/);
      assert.ok(!/\b(?:NaN|Infinity|undefined)\b|<script|<image|foreignObject|onload=|G:[\\/]|file:\/\//i.test(svg));
      assert.equal((svg.match(/data-parallel-mark=/g) || []).length, p.parallel ? 2 : 0);
      assert.equal((svg.match(/data-angle-label=/g) || []).length, position(p) ? 8 : 0);
      assert.equal((svg.match(/data-angle-role=/g) || []).length, position(p) ? 0 : 2);
      assert.equal(renderParallel(p, { reveal, lang, interactive: true }), svg);
      if (!position(p)) {
        const targetText = svg.match(/<text[^>]*data-angle-role="target"[^>]*>([^<]*)<\/text>/)[1];
        assert.equal(targetText, reveal ? `${answer}°` : "?");
      }
      if (!reveal) {
        assert.match([...svg.matchAll(/<text[^>]*>([^<]*)<\/text>/g)].at(-1)[1], /ℓ/u);
        assert.ok(!svg.includes('class="parallel-reason"'));
        assert.ok(!svg.match(/<title>[^<]*\d/u));
        assert.equal(svg.includes("#16734b"), false);
      } else assert.ok(svg.includes('class="parallel-reason"'));
      renderedStates++;
    }
  }
  assert.equal(parallelPrompt(p, "unknown"), parallelPrompt(p, "ko"));
}

function rejects(p) {
  for (const fn of [validateParallelProblem, parallelAnswer, parallelGeometry, parallelPrompt, parallelHint, parallelSolution, renderParallel]) assert.throws(() => fn(p), /Invalid parallel problem/);
}
const first = parallelProblems[0], compute = parallelProblems[10];
for (const p of [null, {}, { ...first, id: "<script>" }, { ...first, source: -1 }, { ...first, source: 8 }, { ...first, source: 0.5 }, { ...first, labels: [1, 1, 2, 3, 4, 5, 6, 7] }, { ...first, labels: [1, 2, 3, 4, 5, 6, 7, 9] }, { ...first, labels: null }, { ...first, parallel: true }, { ...first, unit: "degree" }, { ...first, responseKind: "degree" }, { ...first, kind: "clock" }, { ...first, tilt: NaN }, { ...first, tilt: 0 }, { ...first, rotation: Infinity }, { ...first, secondTilt: 50 }, { ...first, target: 4 }, { ...parallelProblems[6], source: 2 }, { ...compute, given: -10 }, { ...compute, given: 180 }, { ...compute, given: 60 }, { ...compute, given: "50" }, { ...compute, target: -1 }, { ...compute, target: 1 }, { ...compute, parallel: false, secondTilt: 17 }, { ...compute, labels: [1, 2, 3, 4, 5, 6, 7, 8] }]) rejects(p);
for (const p of parallelProblems.filter(p => !position(p))) {
  rejects({ ...p, parallel: false, secondTilt: 10 });
  for (const given of [-1, 0, 180, 181, NaN, Infinity]) rejects({ ...p, given });
  for (let target = 0; target < 8; target++) {
    const candidate = { ...p, target };
    try { validateParallelProblem(candidate); } catch { continue; }
    near(angle(parallelGeometry(candidate).sectors[target]), parallelAnswer(candidate), "accepted target");
  }
}

if (process.argv.includes("--browser")) {
  const { createRequire } = await import("node:module");
  const { chromium } = createRequire(import.meta.url)("playwright");
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    for (const width of [1200, 390]) {
      await page.setViewportSize({ width, height: 900 });
      for (const lang of languages) for (const reveal of [false, true]) {
        await page.setContent(`<style>body{margin:0;padding:0 20px}svg{display:block;width:360px;max-width:100%;height:auto}</style>${parallelProblems.map(p => `<section data-case="${p.id}">${renderParallel(p, { lang, reveal })}</section>`).join("")}`);
        const issues = await page.evaluate(() => {
          const failures = [];
          for (const svg of document.querySelectorAll("svg")) {
            const texts = [...svg.querySelectorAll("text")];
            const id = svg.parentElement.dataset.case;
            for (const text of texts) {
              const b = text.getBBox();
              if (b.x < 2 || b.y < 2 || b.x + b.width > 358 || b.y + b.height > 320) failures.push(`${id}: clipped ${text.textContent}`);
              if (parseFloat(getComputedStyle(text).fontSize) * svg.getScreenCTM().a < 17) failures.push(`${id}: small label`);
            }
            const labels = texts.filter(t => t.hasAttribute("data-angle-label") || t.hasAttribute("data-angle-role"));
            for (let i = 0; i < labels.length; i++) for (let j = i + 1; j < labels.length; j++) {
              const a = labels[i].getBBox(), b = labels[j].getBBox();
              if (a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y) failures.push(`${id}: colliding labels`);
            }
          }
          return failures;
        });
        assert.deepEqual(issues, [], `${width}px ${lang} reveal=${reveal}`);
      }
    }
  } finally { await browser.close(); }
}
console.log(JSON.stringify({ problems: 20, positionCases: 10, nonparallelCases: 6, numericChecks, positionCandidates, renderedStates, browser: process.argv.includes("--browser") }));
