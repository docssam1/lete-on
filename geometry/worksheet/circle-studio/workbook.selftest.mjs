import assert from "node:assert/strict";
import * as api from "../../games/circle-studio/core.js?v=circle-1";
import { DOMAIN_ORDER, LANGUAGES, learner_stage, SVG_WIDTH_MM, COVER_ID, validateBank, normalizeCount, normalizeLanguage, initialSelection, chooseEntries, groupPages, staticRenderOptions } from "./workbook-core.js";
import { COPY } from "./i18n.js";

assert.equal(validateBank(api), true);
assert.equal(learner_stage, api.learner_stage);
assert.ok(Math.abs(SVG_WIDTH_MM * 56 / 400 - 10) < 1e-12);
assert.equal(normalizeLanguage("bad"), "ko");
for (const [input, expected] of [[undefined,20],[null,20],["",20],["abc",20],[0,1],[21,20],[-3,1],[1,1],[2.8,3],[Infinity,20]]) assert.equal(normalizeCount(input), expected);
assert.equal(initialSelection(new URLSearchParams(), api.domains),"all");
assert.equal(initialSelection(new URLSearchParams("domain=unknown"),api.domains),null);
assert.equal(initialSelection(new URLSearchParams("level=4"),api.domains),"draw");
const ids = entries => entries.map(e => e.problem.id);
let selections = 0;
for (let seed = 0; seed < 1000; seed++) {
  const seen = new Set();
  for (let round = 0; round < 4; round++) {
    const entries = chooseEntries(api,"all",20,{seed,round});
    assert.equal(entries.length,20);
    assert.deepEqual(DOMAIN_ORDER.map(d=>entries.filter(e=>e.domain.id===d).length),[5,5,5,5]);
    for (const id of ids(entries)) { assert.ok(!seen.has(id)); seen.add(id); }
    assert.equal(groupPages(entries).length,12);
    selections++;
  }
  assert.equal(seen.size,80);
}
const reordered = {...api, domains:[...api.domains].reverse(), problemsFor:d=>[...api.problemsFor(d)].reverse()};
for (const domain of ["all",...DOMAIN_ORDER]) for (let count=1;count<=20;count++) for (const round of [0,1,3,4294967295]) {
  const entries=chooseEntries(api,domain,count,{seed:719,round});
  assert.deepEqual(ids(entries),ids(chooseEntries(reordered,domain,count,{seed:719,round})));
  assert.equal(entries.length,count);
  assert.equal(new Set(ids(entries)).size,count);
  for(const page of groupPages(entries)) {
    assert.ok(page.length>=1&&page.length<=2);
    assert.equal(new Set(page.map(e=>e.domain.id)).size,1);
  }
  selections++;
}
let prompts=0;
for(const lang of LANGUAGES) {
  assert.deepEqual(Object.keys(COPY[lang]).sort(),Object.keys(COPY.ko).sort());
  for(const d of DOMAIN_ORDER) for(const p of api.problemsFor(d)) {
    assert.notEqual(p.id,COVER_ID);
    const parts=api.promptPartsFor(p,lang);
    assert.equal(api.promptFor(p,lang),[parts.question,...parts.conditions].join(" "));
    assert.deepEqual(staticRenderOptions(lang),{lang,reveal:false,interactive:false,construction:null,traceProgress:0});
    assert.equal(api.grade(p,api.answerFor(p)).correct,true);
    prompts++;
  }
}
const invalid={...api,problemsFor:d=>api.problemsFor(d).slice(0,19)};
assert.throws(()=>validateBank(invalid));
assert.throws(()=>validateBank({...api,promptPartsFor:undefined}));
assert.throws(()=>chooseEntries(api,"unknown",20));
console.log(JSON.stringify({passed:true,selections,prompts,bankItems:80,learner_stage,gridSpacingMM:SVG_WIDTH_MM*56/400}));
