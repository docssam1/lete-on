import test from 'node:test';
import assert from 'node:assert/strict';
import { emptyLife, validLife, normalizeLife, newLifeExperiment, selectLifeExperiment, lifeExperiments, addObservation, experimentError, lifeRows, loadLife, saveLife, lifeReportHtml, drawingSvg, LIFE_KEY } from './life-records.js';
import { performance } from '../data/activities/s31-u04.performance.js';
import { readFileSync } from 'node:fs';
import { lesson } from '../data/units/s31-u04.lesson.js';
import { items } from '../data/units/s31-u04.js';
const observed = () => { const s = emptyLife(); Object.assign(s.draft, { date: '2026-10-17', species: '화분 가의 강낭콩', facts: '떡잎이 보인다.' }); s.draft.drawing.strokes = [[[10, 20], [30, 40]]]; return s; };
test('관찰 글·그림이 없는 초안에서 실제 기록을 만들지 않는다', () => {
  const s = emptyLife(); assert(validLife(s)); assert.deepEqual(lifeRows(s), []);
  assert(addObservation(s, 'a').error);
  const noDrawing = observed(); noDrawing.draft.drawing.strokes = []; assert(addObservation(noDrawing, 'a').error);
});
test('같은 기록을 고쳐 저장해도 복제하지 않고 날짜 순서를 유지한다', () => {
  const s = observed(), a = addObservation(s, 'a').state;
  Object.assign(a.draft, s.draft, { date: '2026-10-16', facts: '씨앗이 부풀었다.' });
  const b = addObservation(a, 'b').state; assert.deepEqual(b.observations.map((r) => r.id), ['b', 'a']);
  b.draft = { ...structuredClone(s.draft), facts: '본잎을 보았다.', editingId: 'a' };
  const c = addObservation(b, 'a').state; assert.equal(c.observations.length, 2); assert.equal(c.observations[1].facts, '본잎을 보았다.'); assert(!('editingId' in c.observations[1]));
  assert.equal(s.observations.length, 0); assert.equal(lifeRows(c).length, 2);
});
test('비교 실험은 계획과 두 실제 결과가 있어야 기록할 수 있다', () => {
  const s = emptyLife(), row = { date: '2026-10-17', a: '0개', b: '3개', fact: '나에서 더 많이 싹텄다.' };
  assert(experimentError(s.experiment, row));
  for (const k of ['question', 'hypothesis', 'change', 'same', 'measure']) s.experiment[k] = '직접 쓴 계획';
  assert.equal(experimentError(s.experiment, row), ''); assert(experimentError(s.experiment, { ...row, b: '' }));
  assert.deepEqual(lifeRows(s), []);
});
test('기기 저장 실패·손상된 파일을 성공으로 표시하지 않는다', () => {
  const broken = { getItem() { return '{broken'; }, setItem() { throw Error('quota'); } };
  assert(loadLife(broken).error); assert.equal(saveLife(broken, emptyLife()), false);
  const memory = new Map(), storage = { getItem: (k) => memory.get(k), setItem: (k, v) => memory.set(k, v) };
  assert(saveLife(storage, observed())); assert.equal(loadLife(storage).state.draft.facts, '떡잎이 보인다.'); assert(memory.has(LIFE_KEY));
});
test('불러오는 파일의 잘못된 좌표·누락된 내용·과도한 그림을 거부한다', () => {
  const s = observed(); s.draft.drawing.strokes[0][0][0] = Infinity; assert(!validLife(s));
  s.draft.drawing.strokes = [[[700, 20]]]; assert(!validLife(s));
  s.draft.drawing.strokes = Array.from({ length: 501 }, () => [[1, 2]]); assert(!validLife(s));
  assert(!validLife({ version: 1 }));
  const recorded = addObservation(observed(), 'a').state; recorded.observations.push(structuredClone(recorded.observations[0])); assert(!validLife(recorded));
  const badDate = observed(); badDate.draft.date = '2026-02-31'; assert(addObservation(badDate, 'b').error);
});
test('직접 그리는 원문 발문·문맥·쪽수와 한 개의 짝 수행을 보존한다', () => {
  const raw = JSON.parse(readFileSync(new URL('../bank/work/s31u04/performance-source.json', import.meta.url)))[0];
  assert.equal(performance[0].id, raw.id); assert.equal(performance[0].prompt, raw.prompt); assert.equal(performance[0].context, raw.provenance.context); assert.equal(performance[0].sourceRef.page, raw.page);
  assert.equal(performance.length, 2); assert.equal(performance[1].sourceRef.of, raw.id); assert.notEqual(performance[1].prompt, raw.prompt);
});
test('5E가 실제 문항과 관찰 기록에 연결되고 미관찰 결과를 확정하지 않는다', () => {
  const ids = new Set(items.map((q) => q.id));
  for (const id of [...lesson.explain.cards, lesson.explain.table, ...lesson.explain.miniTest, ...lesson.elaborate.items, ...lesson.evaluate.items]) assert(ids.has(id), id);
  assert.equal(lesson.explore.lab.kind, 'life'); assert.equal(lesson.engage.scene, null);
  assert.match(lesson.explain.fromData([]), /관찰 결과가 없/);
  assert.match(lesson.evaluate.performanceNote, /수행의 완료나 공식 성적을 대신하지/);
});
test('소개 HTML은 입력을 실행하지 않고 그림과 워터마크·미기록 표시를 보존한다', () => {
  const s = addObservation(observed(), 'a').state; s.intro.title = '<script>alert(1)</script>'; s.intro.evidence = '<img src=x onerror=alert(2)>';
  const html = lifeReportHtml(s); assert(!html.includes('<script>')); assert(!html.includes('<img src=')); assert(html.includes('&lt;script&gt;')); assert(html.includes('GFIELD · 지필드')); assert(html.includes('실험 결과: 미기록')); assert(html.includes('아직 공유 기록이 없어요.')); assert(html.includes('<polyline'));
  assert(!drawingSvg({ strokes: [[['<script>', 1]]], description: '' }).includes('<polyline'));
});
test('이전 한 실험 파일을 손실 없이 읽고 새 실험의 계획·미완성 결과를 분리한다', () => {
  const old = emptyLife(); delete old.experimentId; delete old.experimentArchives;
  old.experiment.question = '싹트기 물 비교'; old.experiment.conclusion = '직접 본 결론'; old.experimentDraft.a = '아직 쓰는 중';
  old.experiment.rows.push({ id: 'r1', date: '2026-10-17', a: '0개', b: '3개', fact: '관찰한 차이' });
  const storage = { getItem: () => JSON.stringify(old) }, migrated = loadLife(storage).state;
  assert.deepEqual(migrated.experiment, old.experiment); assert.equal(migrated.experimentDraft.a, '아직 쓰는 중');
  const next = newLifeExperiment(migrated, 'water', { question: '자람 물 비교' }).state;
  next.experimentDraft.b = '새 실험 작성 중'; next.experiment.conclusion = '두 번째 결론';
  const back = selectLifeExperiment(next, 'legacy');
  assert.deepEqual(back.experiment, old.experiment); assert.equal(back.experimentDraft.a, '아직 쓰는 중');
  const again = normalizeLife(JSON.parse(JSON.stringify(selectLifeExperiment(back, 'water'))));
  assert.equal(again.experimentDraft.b, '새 실험 작성 중'); assert.equal(again.experiment.conclusion, '두 번째 결론');
  assert.equal(lifeExperiments(again).length, 2); assert.equal(lifeRows(again)[0].species, '싹트기 물 비교');
  assert.equal(old.experimentId, undefined);
});
test('보관한 실험의 중복 ID·손상된 결과를 거부하고 모든 실험을 보고서에 싣는다', () => {
  let s = emptyLife(); s.experiment.question = '첫 실험';
  s = newLifeExperiment(s, 'water', { question: '<물 조건>' }).state;
  s.experiment.rows.push({ id: 'r', date: '2026-10-17', a: '가의 사실', b: '나의 사실', fact: '물 비교 근거' });
  s = newLifeExperiment(s, 'light', { question: '햇빛 조건' }).state;
  s.experiment.rows.push({ id: 'r', date: '2026-10-17', a: '가의 모습', b: '나의 모습', fact: '빛 비교 근거' });
  assert(validLife(s)); assert.equal(lifeRows(s).length, 2);
  const html = lifeReportHtml(s); assert(html.includes('&lt;물 조건&gt;')); assert(html.includes('빛 비교 근거')); assert(html.includes('물 비교 근거'));
  assert.equal((html.match(/· 계획<\/h1>/g) || []).length, 3);
  assert(newLifeExperiment(s, 'water').error);
  const bad = structuredClone(s); bad.experimentArchives[0].id = 'light'; assert(!validLife(bad));
  const broken = structuredClone(s); broken.experimentArchives[1].experiment.rows[0].date = '2026-02-31'; assert(!validLife(broken));
  assert.throws(() => normalizeLife(broken));
});
