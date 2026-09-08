import assert from "node:assert/strict";
import * as api from "../../games/perimeter/core.js?v=perimeter-1";
import { renderProblem } from "../../games/perimeter/render.js?v=perimeter-1";
import { COPY } from "./i18n.js";
import { MAX_COUNT, DOMAIN_ORDER, LANGUAGES, COVER_SAMPLE, normalizeCount, normalizeLanguage, initialSelection, validateBank, chooseEntries, groupPages, problemsPerPage, comparisonSymbol, staticRenderOptions } from "./workbook-core.js";

// Independent edge cancellation, flood fill, and D4 signatures; no core geometry helpers.
const xy = (c) => Array.isArray(c) ? c : [c.x, c.y];
const key = (c) => xy(c).join(",");
function perimeter(cells) {
  const edges = new Set();
  for (const cell of cells) {
    const [x, y] = xy(cell);
    for (const e of [`h:${x}:${y}`, `h:${x}:${y + 1}`, `v:${x}:${y}`, `v:${x + 1}:${y}`]) {
      if (edges.has(e)) edges.delete(e); else edges.add(e);
    }
  }
  return edges.size;
}
function connected(cells) {
  const left = new Set(cells.map(key)), stack = [xy(cells[0])];
  left.delete(key(cells[0]));
  while (stack.length) {
    const [x, y] = stack.pop();
    for (const next of [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]) if (left.delete(next.join(","))) stack.push(next);
  }
  return left.size === 0;
}
function hasHole(cells) {
  const filled = new Set(cells.map(key)), seen = new Set(["-1,-1"]), stack = [[-1, -1]];
  while (stack.length) {
    const [x, y] = stack.pop();
    for (const [a, b] of [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]) {
      const id = `${a},${b}`;
      if (a < -1 || b < -1 || a > 6 || b > 6 || filled.has(id) || seen.has(id)) continue;
      seen.add(id); stack.push([a, b]);
    }
  }
  for (let x = 0; x < 6; x += 1) for (let y = 0; y < 6; y += 1) if (!filled.has(`${x},${y}`) && !seen.has(`${x},${y}`)) return true;
  return false;
}
function normalize(cells) {
  const points = cells.map(xy), minX = Math.min(...points.map((c) => c[0])), minY = Math.min(...points.map((c) => c[1]));
  return points.map(([x, y]) => [x - minX, y - minY]).sort((a, b) => a[1] - b[1] || a[0] - b[0]);
}
function transforms(cells) {
  return Array.from({ length: 8 }, (_, i) => normalize(cells.map((c) => {
    let [x, y] = xy(c);
    if (i >= 4) x = -x;
    for (let n = 0; n < i % 4; n += 1) [x, y] = [-y, x];
    return [x, y];
  })));
}
const signature = (cells) => transforms(cells).map(JSON.stringify).sort()[0];
const bank = api.domains.flatMap((d) => api.problemsFor(d.id));
assert.equal(validateBank(api), true);
assert.equal(MAX_COUNT, 20);
assert.deepEqual(api.domains.map((d) => d.id), DOMAIN_ORDER);
for (const [value, expected] of [["", 20], [null, 20], [NaN, 20], [Infinity, 20], [0, 1], [-9, 1], [2.8, 3], [99, 20]]) assert.equal(normalizeCount(value), expected);
assert.equal(normalizeCount(10, 0), 0);
assert.equal(normalizeCount(10, 5), 5);
assert.equal(normalizeLanguage("bad"), "ko");
assert.equal(initialSelection(new URLSearchParams(), api.domains), "all");
assert.equal(initialSelection(new URLSearchParams("domain=all&level=2"), api.domains), "all");
assert.equal(initialSelection(new URLSearchParams("domain=bad"), api.domains), null);
assert.equal(initialSelection(new URLSearchParams("level=3"), api.domains), "compare");
assert.throws(() => chooseEntries(api, "bad", 20));
assert.throws(() => validateBank({ ...api, solutionFor: null }));
assert.throws(() => validateBank({ ...api, problemsFor: (id) => api.problemsFor(id).slice(1) }));
assert.throws(() => comparisonSymbol("unknown"));
assert.deepEqual(staticRenderOptions("en", true), { lang: "en", reveal: true, interactive: false, layout: "horizontal" });
assert.equal(staticRenderOptions("en", false, "vertical").layout, "vertical");

let selections = 0, renderedStates = 0, alternativeChecks = 0;
for (let seed = 0; seed < 40; seed += 1) {
  for (const selection of ["all", ...DOMAIN_ORDER]) {
    for (let count = 1; count <= 20; count += 1) {
      const entries = chooseEntries(api, selection, count, { seed, round: seed });
      assert.equal(entries.length, count);
      assert.equal(new Set(entries.map((e) => e.problem.id)).size, count);
      assert.deepEqual(entries, chooseEntries(api, selection, count, { seed, round: seed }));
      assert.deepEqual(entries.map((e) => e.domain.level), entries.map((e) => e.domain.level).sort((a, b) => a - b));
      const pages = groupPages(entries);
      assert.deepEqual(pages.flat(), entries);
      for (const page of pages) {
        assert.equal(new Set(page.map((e) => e.domain.id)).size, 1);
        assert.ok(page.length <= problemsPerPage(page[0].domain.id));
      }
      if (selection === "all") {
        const counts = DOMAIN_ORDER.map((id) => entries.filter((e) => e.domain.id === id).length);
        assert.ok(Math.max(...counts) - Math.min(...counts) <= 1);
      } else assert.ok(entries.every((e) => e.domain.id === selection));
      selections += 1;
    }
  }
}
const visited = new Set();
for (let round = 0; round < 4; round += 1) chooseEntries(api, "all", 20, { seed: 719, round }).forEach((e) => visited.add(e.problem.id));
assert.equal(visited.size, 80);
assert.equal(groupPages(chooseEntries(api, "all", 20)).length, 12);
const initial = JSON.stringify(bank);
for (const p of bank) {
  assert.equal(connected(p.cells), true, p.id);
  assert.equal(hasHole(p.cells), false, p.id);
  const result = api.answerFor(p), pa = perimeter(p.cells);
  if (p.domain === "compare") {
    assert.equal(result, pa < perimeter(p.other) ? "less" : pa > perimeter(p.other) ? "greater" : "equal");
  } else assert.equal(result, pa, p.id);
  if (p.domain === "joined") {
    assert.equal(new Set(p.groups.flat().map(key)).size, p.cells.length);
    assert.deepEqual(p.groups.flat().map(key).sort(), p.cells.map(key).sort());
  }
  if (p.domain === "build") {
    assert.equal(perimeter(p.example), p.target);
    assert.equal(connected(p.example), true);
    assert.equal(hasHole(p.example), false);
    assert.notEqual(signature(p.cells), signature(p.example), p.id);
    for (const points of transforms(p.example)) {
      assert.equal(api.grade(p, points).correct, true, p.id);
      alternativeChecks += 1;
    }
    for (const points of transforms(p.cells)) assert.equal(api.grade(p, points).correct, false, "A must stay rejected under all symmetries");
  }
  for (const lang of LANGUAGES) {
    for (const reveal of [false, true]) {
      const svg = renderProblem(p, staticRenderOptions(lang, reveal));
      assert.match(svg, /<svg/);
      const paired = ["compare", "build"].includes(p.domain);
      assert.match(svg, paired ? /viewBox="0 0 648 (358|440)"/ : /viewBox="0 0 324 358"/);
      if (paired) assert.match(renderProblem(p, staticRenderOptions(lang, reveal, "vertical")), /viewBox="0 0 324 (716|798)"/);
      assert.doesNotMatch(svg, /NaN|undefined|role="button"|tabindex=/);
      assert.ok(api.promptFor(p, lang).length > 10);
      assert.ok(api.solutionFor(p, lang).length > 10);
      assert.doesNotMatch(api.promptFor(p, lang), /cm|㎝|cm²|cm2/);
      renderedStates += 1;
    }
  }
}
assert.equal(JSON.stringify(bank), initial, "Worksheet tests must not mutate the bank");
const shapes = bank.flatMap((p) => [p.cells, p.other, p.example, ...(p.groups || [])].filter(Boolean));
assert.ok(shapes.every((cells) => signature(cells) !== signature(COVER_SAMPLE.cells)), "Cover diagram must be distinct from every bank shape");
assert.equal(connected(COVER_SAMPLE.cells), true);
assert.equal(hasHole(COVER_SAMPLE.cells), false);
assert.equal(bank.some((p) => p.id === COVER_SAMPLE.id), false);
for (const lang of LANGUAGES) {
  assert.deepEqual(Object.keys(COPY[lang]).sort(), Object.keys(COPY.ko).sort());
  assert.ok(COPY[lang].buildRules.length > 10);
  assert.ok(COPY[lang].criteria.length > 10);
  assert.deepEqual(Object.keys(COPY[lang].descriptions), DOMAIN_ORDER);
}
console.log(JSON.stringify({ passed: true, selections, bankProblems: bank.length, renderedStates, alternativeChecks, coverPerimeter: perimeter(COVER_SAMPLE.cells), all20BodyPages: 12 }, null, 2));
