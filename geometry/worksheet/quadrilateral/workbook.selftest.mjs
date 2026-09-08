import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import * as api from "../../games/quadrilateral/core.js?v=quad-1";
import { renderProblem } from "../../games/quadrilateral/render.js?v=quad-1";
import { COPY } from "./i18n.js";
import { chooseEntries, groupPages, normalizeCount, initialSelection, staticRenderOptions, validateBank, DOMAIN_ORDER, LANGUAGES, COVER_SAMPLE, learner_stage } from "./workbook-core.js";

assert.equal(validateBank(api), true);
assert.equal(learner_stage, "초등 도형 · 사각형의 성질과 분류");
for (const [v, expected] of [[null,20],["",20],["a",20],[-1,1],[0,1],[1,1],[4.6,5],[20,20],[99,20]]) assert.equal(normalizeCount(v), expected);
assert.equal(initialSelection(new URLSearchParams(), api.domains), "all");
assert.equal(initialSelection(new URLSearchParams("domain=wrong"), api.domains), null);
assert.equal(initialSelection(new URLSearchParams("level=3"), api.domains), "classify");
let selections = 0, selectedProblems = 0;
for (let seed = 0; seed < 40; seed++) for (const domain of ["all", ...DOMAIN_ORDER]) for (let count = 1; count <= 20; count++) {
  const entries = chooseEntries(api, domain, count, { seed, round: seed % 4 });
  assert.equal(entries.length, count);
  assert.equal(new Set(entries.map((e) => e.problem.id)).size, count);
  assert.deepEqual(entries, chooseEntries(api, domain, count, { seed, round: seed % 4 }));
  for (const page of groupPages(entries)) {
    assert.ok(page.length <= 2);
    assert.equal(new Set(page.map((e) => e.domain.id)).size, 1);
  }
  selections++;
  selectedProblems += count;
}
assert.equal(selections, 4000);
for (let seed = 0; seed < 100; seed++) {
  const rounds = Array.from({ length: 4 }, (_, round) => chooseEntries(api, "all", 20, { seed, round }));
  assert.equal(new Set(rounds.flat().map((e) => e.problem.id)).size, 80);
  assert.equal(groupPages(rounds[0]).length, 12);
}
const all = api.domains.flatMap((d) => api.problemsFor(d.id));
assert.equal(all.length, 80);
assert.ok(!all.some((p) => p.id === COVER_SAMPLE.id || JSON.stringify(p.vertices) === JSON.stringify(COVER_SAMPLE.vertices)));
let renderChecks = 0, gridResponses = 0;
for (const p of all) {
  const answer = api.answerFor(p);
  if (p.domain === "build") {
    assert.ok(api.grade(p, p.example).correct);
    for (let y = 0; y < 7; y++) for (let x = 0; x < 7; x++) {
      assert.equal(api.grade(p, [x,y]).correct, answer.some((d) => d[0] === x && d[1] === y));
      gridResponses++;
    }
  } else assert.ok(api.grade(p, answer).correct);
  for (const lang of LANGUAGES) for (const reveal of [false, true]) {
    const options = staticRenderOptions(lang, reveal);
    assert.equal(Object.hasOwn(options, "selectedPoint"), false);
    const svg = renderProblem(p, options);
    assert.match(svg, /viewBox="0 0 400 400"/);
    assert.doesNotMatch(svg, /tabindex=|role="button"|role="checkbox"/);
    if (p.domain === "build") assert.equal(svg.includes('data-label="D"'), reveal);
    if (!reveal && ["parallel", "right", "build"].includes(p.domain)) assert.doesNotMatch(svg, /data-mark=/);
    assert.ok(COPY[lang].convention.length > 20);
    renderChecks++;
  }
}
const result = { passed:true, selections, selectedProblems, disjointRoundSeeds:100, bankProblems:all.length, renderChecks, gridResponses };
await mkdir(new URL("./qa-artifacts/", import.meta.url), {recursive:true});
await writeFile(new URL("./qa-artifacts/selection-results.json", import.meta.url), JSON.stringify(result,null,2));
console.log(JSON.stringify(result,null,2));
