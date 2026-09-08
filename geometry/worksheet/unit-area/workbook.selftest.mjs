import assert from "node:assert/strict";
import { normalizeCount, normalizeLanguage, initialSelection, orderedDomains, validateBank, chooseEntries, groupPages, comparisonSymbol, staticRenderOptions, DOMAIN_ORDER, LANGUAGES } from "./workbook-core.js";
import { COPY } from "./i18n.js";

const domains = DOMAIN_ORDER.map((id, i) => ({ id, level: i + 1, names: Object.fromEntries(LANGUAGES.map((lang) => [lang, id])) }));
const example = [[0, 0], [1, 0], [0, 1], [1, 1]];
const cells = example.map(([x, y]) => ({ x, y, part: "full" }));
const pools = Object.fromEntries(domains.map(({ id }) => [id, Array.from({ length: 20 }, (_, i) => ({ id: `${id}-fixture-${i}`, domain: id, unit: id === "build" ? "drawing" : id === "compare" ? "comparison" : "area", size: 6, cells, left: cells, right: cells, target: 4, example }))]));
const fixture = { domains, problemsFor: (id) => pools[id], promptFor: () => "Question", hintFor: () => "Hint", solutionFor: () => "Solution", answerFor: (p) => p.domain === "build" ? example : p.domain === "compare" ? "equal" : 4, grade: () => ({ correct: true }) };

assert.equal(validateBank(fixture), true);
for (const [input, expected] of [["", 20], [null, 20], ["invalid", 20], [0, 1], [-3, 1], [21, 20], [2.6, 3], [1, 1]]) assert.equal(normalizeCount(input), expected);
assert.equal(normalizeCount(20, 8), 8);
assert.equal(normalizeCount(20, 0), 0);
assert.equal(normalizeCount(null, 20, 10), 10);
assert.equal(normalizeLanguage("xx"), "ko");
assert.equal(initialSelection(new URLSearchParams(), domains), "all");
assert.equal(initialSelection(new URLSearchParams("level=all"), domains), "all");
assert.equal(initialSelection(new URLSearchParams("level=2"), domains), "halves");
assert.equal(initialSelection(new URLSearchParams("level=99"), domains), null);
assert.equal(initialSelection(new URLSearchParams("domain=build&level=2"), domains), "build");
assert.equal(initialSelection(new URLSearchParams("domain=unknown"), domains), null);
assert.deepEqual(orderedDomains([...domains].reverse()), domains);
assert.deepEqual(["less", "equal", "greater"].map(comparisonSymbol), ["<", "=", ">"]);
assert.throws(() => comparisonSymbol("unknown"));
assert.throws(() => validateBank({ ...fixture, domains: domains.slice(0, 3) }));
assert.throws(() => validateBank({ ...fixture, problemsFor: () => [] }));
assert.throws(() => validateBank({ ...fixture, answerFor: () => NaN }));
assert.throws(() => validateBank({ ...fixture, grade: () => ({ correct: false }) }));
assert.throws(() => chooseEntries(fixture, "missing", 10));
assert.deepEqual(staticRenderOptions("ko"), { lang: "ko", reveal: false, interactive: false, selectedCells: [], markedCells: [], pairs: [], activeHalf: null, aligned: false });
assert.equal(staticRenderOptions("en", true).reveal, true);
for (const lang of LANGUAGES) {
  assert.equal(normalizeLanguage(lang), lang);
  assert.deepEqual(Object.keys(COPY[lang]).sort(), Object.keys(COPY.ko).sort());
  for (const domain of DOMAIN_ORDER) assert.ok(COPY[lang].descriptions[domain]);
}

let selections = 0;
function selectionAudit(api) {
  const original = JSON.stringify(api.domains.map((d) => api.problemsFor(d.id)));
  for (let seed = 1; seed <= 20; seed += 1) for (const selection of ["all", ...DOMAIN_ORDER]) for (let count = 1; count <= 20; count += 1) {
    const entries = chooseEntries(api, selection, count, { seed });
    const ids = entries.map((e) => e.problem.id);
    assert.equal(entries.length, count);
    assert.equal(new Set(ids).size, count);
    assert.deepEqual(chooseEntries(api, selection, count, { seed }), entries);
    const order = entries.map((e) => DOMAIN_ORDER.indexOf(e.domain.id));
    assert.deepEqual(order, [...order].sort((a, b) => a - b));
    if (selection !== "all") assert.ok(entries.every((e) => e.domain.id === selection));
    const pages = groupPages(entries);
    assert.deepEqual(pages.flat(), entries);
    for (const page of pages) {
      assert.ok(page.length <= 2);
      assert.equal(new Set(page.map((e) => e.domain.id)).size, 1);
    }
    const next = chooseEntries(api, selection, count, { seed, round: 1 });
    assert.notDeepEqual(next.map((e) => e.problem.id), ids);
    for (const domain of api.domains) {
      const previous = new Set(entries.filter((e) => e.domain.id === domain.id).map((e) => e.problem.id));
      if (previous.size <= 10) assert.ok(next.filter((e) => e.domain.id === domain.id).every((e) => !previous.has(e.problem.id)));
    }
    selections += 1;
  }
  const cycle = Array.from({ length: 4 }, (_, round) => chooseEntries(api, "all", 20, { seed: 19, round })).flat();
  assert.equal(new Set(cycle.map((e) => e.problem.id)).size, 80);
  assert.equal(groupPages(chooseEntries(api, "all", 20)).length, 12);
  assert.deepEqual(groupPages(chooseEntries(api, "all", 20)).map((page) => page.length), [2, 2, 1, 2, 2, 1, 2, 2, 1, 2, 2, 1]);
  assert.equal(JSON.stringify(api.domains.map((d) => api.problemsFor(d.id))), original, "Selection must not mutate the bank");
}
selectionAudit(fixture);

const area = (cells) => cells.reduce((n, c) => n + (c.part === "full" ? 1 : .5), 0);
function independentlyConnected(points) {
  const visited = new Set([points[0].join(",")]);
  let previous;
  do {
    previous = visited.size;
    for (const [x, y] of points) if ([[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]].some((point) => visited.has(point.join(",")))) visited.add(`${x},${y}`);
  } while (visited.size !== previous);
  return visited.size === points.length;
}
let integration = "not requested", verifiedProblems = 0, alternativeBuildAnswers = 0, renderedStates = 0;
if (!process.argv.includes("--model-only")) {
  const api = await import("../../games/unit-area/core.js?v=area-1");
  const renderer = await import("../../games/unit-area/render.js?v=area-1");
  validateBank(api);
  assert.deepEqual(api.problemsFor("build").map((p) => p.target).sort((a, b) => a - b), Array.from({ length: 20 }, (_, i) => i + 4), "Every blank drawing task has a unique target, 4 through 23");
  selectionAudit(api);
  for (const domain of domains) for (const p of api.problemsFor(domain.id)) {
    const lists = p.domain === "build" ? [] : p.domain === "compare" ? [p.left, p.right] : [p.cells];
    for (const list of lists) {
      assert.equal(new Set(list.map((c) => `${c.x},${c.y}`)).size, list.length);
      for (const c of list) {
        assert.ok(Number.isInteger(c.x) && Number.isInteger(c.y) && c.x >= 0 && c.x < 6 && c.y >= 0 && c.y < 6);
        assert.ok(["full", "nw", "ne", "se", "sw"].includes(c.part));
        if (p.domain !== "halves") assert.equal(c.part, "full");
      }
    }
    if (p.domain === "whole" || p.domain === "halves") {
      assert.equal(api.answerFor(p), area(p.cells));
      if (p.domain === "halves") assert.equal(p.cells.filter((c) => c.part !== "full").length % 2, 0);
    } else if (p.domain === "compare") {
      const difference = p.left.length - p.right.length;
      assert.equal(api.answerFor(p), difference < 0 ? "less" : difference > 0 ? "greater" : "equal");
    } else {
      const answer = api.answerFor(p);
      assert.equal(answer.length, p.target);
      assert.equal(independentlyConnected(answer), true);
      const alternate = Array.from({ length: p.target }, (_, i) => [i % 6, Math.floor(i / 6)]);
      const reflected = alternate.map(([x, y]) => [5 - x, 5 - y]);
      for (const candidate of [alternate, reflected]) {
        assert.equal(independentlyConnected(candidate), true);
        assert.equal(api.grade(p, candidate).correct, true);
        alternativeBuildAnswers += 1;
      }
      assert.equal(api.grade(p, [...alternate, alternate[0]]).correct, false);
      assert.equal(api.grade(p, alternate.slice(1)).correct, false);
      assert.equal(api.grade(p, [[-1, 0], ...alternate.slice(1)]).correct, false);
      const disconnected = Array.from({ length: p.target }, (_, i) => i === 0 ? [5, 5] : [(i - 1) % 6, Math.floor((i - 1) / 6)]);
      assert.equal(independentlyConnected(disconnected), false);
      assert.equal(api.grade(p, disconnected).correct, false);
    }
    for (const lang of LANGUAGES) for (const reveal of [false, true]) {
      const svg = renderer.renderProblem(p, staticRenderOptions(lang, reveal));
      assert.match(svg, /<svg[\s>]/);
      assert.doesNotMatch(svg, /NaN|undefined|<[^>]*\s(?:role="button"|tabindex="0")/);
      renderedStates += 1;
    }
    verifiedProblems += 1;
  }
  integration = "passed";
}
console.log(JSON.stringify({ passed: true, selections, integration, verifiedProblems, alternativeBuildAnswers, renderedStates, all20BodyPages: 12, all20WithCoverPages: 13 }, null, 2));
