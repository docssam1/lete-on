#!/usr/bin/env node
'use strict';
/* 「연산 학습을 안 했어요」 사다리 진단(2026-10-27): 5세 소마셈 P · 6세 소마셈 K · 7세 기적의 계산법 1권.
 * 쉬운 단계부터 20문항, 처음으로 2문항 이상(1문항 단계는 그 문항) 틀리거나 모른 단계가 시작점.
 * 여러 seed에서 20문항·중복 없음·단계 순서·정답 채점·시작점 규칙·모두 맞힘·종이 채점 결과를 확인한다. */
const assert = require('assert'), fs = require('fs'), path = require('path'), vm = require('vm');
const ROOT = path.resolve(__dirname, '..'), read = f => fs.readFileSync(path.join(ROOT, f), 'utf8');
const pageScripts = [...read('index.html').matchAll(/<script\s+[^>]*src=["']([^"']+)["']/g)].map(m => m[1].split('?')[0]);
const generators = pageScripts.filter(f => /^engine\/(?:generators\.js|rng\.js|threads\/[^/]+\.js)$/.test(f));
const units = fs.readdirSync(path.join(ROOT, 'data/units')).filter(f => f.endsWith('.js')).sort().map(f => 'data/units/' + f);
const files = [...new Set([...generators, 'data/curriculum.js', 'data/threads.js', 'data/middle-pacing.js', 'data/wordable.js', 'data/courses.js', 'data/stages.js', ...units,
  'data/placement-books.js', 'data/dunoro-courses.js', 'data/soma-p-2019.js', 'data/book-volume-topics.js', 'data/placement-plan.js', 'data/placement-paths.js'])];
const W = { console: { log() {}, warn() {}, error() {} } }; W.window = W;
const ctx = vm.createContext(W);
files.forEach(f => vm.runInContext(read(f), ctx, { filename: f, timeout: 20000 }));
const P = W.NM_PLACEMENT_PLAN, PATHS = W.NM_PLACEMENT_PATHS;
assert.deepStrictEqual([...P.ladderCodes()], ['a5', 'a6', 'a7']);
const answer = it => ({ id: it.id, value: it.answer, validationFlags: { validTargets: true } });
const wrong = it => ({ id: it.id, value: Array.isArray(it.answer) ? it.answer.map(x => x + 101) : it.answer + 101, validationFlags: { validTargets: true } });
const order = new Map(W.NM_COURSE_SPEC.map((s, i) => ['C' + s.id, i]));
const after = (a, b) => (order.get(a.course) - order.get(b.course)) || a.session - b.session;
let plans = 0;
for (const code of P.ladderCodes()) for (let k = 0; k < 40; k++) {
  const seed = 'ladder-check-' + k, plan = P.buildLadder(code, seed);
  plans++;
  assert.strictEqual(plan.items.length, 20, code + ' has 20 items');
  assert.strictEqual(new Set(plan.items.map(x => x.fingerprint)).size, 20, code + ' items are unique');
  assert.deepStrictEqual(JSON.parse(JSON.stringify(P.buildLadder(code, seed))), JSON.parse(JSON.stringify(plan)), code + ' is reproducible');
  const steps = plan.ladder.steps;
  assert(steps.length >= 7, code + ' climbs at least 7 steps');
  assert.strictEqual(steps.reduce((n, s) => n + s.count, 0), 20);
  let last = -1;
  plan.items.forEach(it => { assert(it.ladderStep >= last, 'items stay in step order'); last = it.ladderStep; assert(order.has(it.course) && it.session >= 1, 'each item has an app practice anchor'); });
  // all right → next book level, never earlier than the last checked step
  const all = P.summarize(plan, plan.items.map(answer)).recommendation;
  assert.strictEqual(all.ladder.start, steps.length);
  assert(after(all, plan.items.slice().sort(after).pop()) >= 0, code + ' next book does not move backwards');
  // the first step with ≥2 misses is the start, whatever comes later
  for (let at = 0; at < steps.length; at++) {
    const stop = steps[at], resp = plan.items.map(it => it.stageId === stop.id ? wrong(it) : it.ladderStep < at ? answer(it) : answer(it));
    const rec = P.summarize(plan, resp).recommendation;
    assert.strictEqual(rec.ladder.start, at, code + ' stop at step ' + at);
    assert.strictEqual(rec.stageId, stop.id);
    assert.strictEqual(rec.course + '#' + rec.session, stop.course + '#' + stop.session);
  }
  // one miss in a multi-question step is not a stop; unknown counts as a miss
  const multi = steps.findIndex(s => s.count >= 2);
  const oneMiss = plan.items.map(it => it.stageId === steps[multi].id && it.id.endsWith(':1') ? wrong(it) : answer(it));
  assert.strictEqual(P.summarize(plan, oneMiss).recommendation.ladder.start, steps.length, 'one miss does not stop the climb');
  const unknown = plan.items.map(it => it.stageId === steps[multi].id ? { id: it.id, skipped: true } : answer(it));
  assert.strictEqual(P.summarize(plan, unknown).recommendation.ladder.start, multi, 'unknown answers stop the climb');
  // paper marks give the same start and the path's main topic is that start
  const marks = plan.items.map(it => it.ladderStep < 3 ? 'o' : it.ladderStep === 3 ? 'x' : '');
  const paper = PATHS.paperAnalysis(plan, marks, {});
  assert.strictEqual(paper.path.main.ladder.start, 3);
  assert.strictEqual(paper.path.main.stageId, steps[3].id);
  assert.strictEqual(paper.path.next.stageId, steps[4].id);
}
console.log('LADDER_PLACEMENT_OK plans=' + plans + ' codes=' + P.ladderCodes().join(','));
