// 교과 연결 사고력 수업(2026-10-19 원장 정정) — 4-2 Ⅳ 기후변화(c22-s42-u04) · 3-2 Ⅳ 감염병(c22-s32-u04).
// 지킬 것: ① 기본 수업에 기록 양식(탐구 기록 앱)이 끼어들지 않는다 ② 자료·현상 → 예상 → 3D 실험 → 결과 → 개념 → 새 상황 순서
// ③ 예상 단계에서 답을 먼저 보여 주지 않는다 ④ 예전 기록은 선택 기능(records)으로 그대로 이어진다 ⑤ 수업 문항은 문제집 수준 검사를 통과한다.
import test from 'node:test';
import assert from 'node:assert/strict';
import { buildSlides } from './deck.js';
import { renderChapter } from './book.js';
import { judgeText } from './judge.js';
import { seaModel, LEVELS } from '../scenes/sealevel-model.js';
import { glitterModel } from '../scenes/glitter-model.js';
import { materialRow, hardest, bendiest, floaters, seeThrough } from '../scenes/material-model.js';
import { evapRow, AMOUNTS } from '../scenes/seawater-model.js';
import { rulerRow } from '../scenes/ruler-model.js';
import { moonRow } from '../scenes/moon-model.js';
import { meadowRow } from '../scenes/meadow-model.js';

const UNITS = { 'c22-s42-u04': { lab: 'sealevel', scene: 'sea-town', rowsKey: 'climateInquiryRows' }, 'c22-s32-u04': { lab: 'glitter', scene: 'glitter-hands', rowsKey: undefined },
  'c22-s32-u01': { lab: 'material', scene: 'material-bars', rowsKey: undefined }, 'c22-s32-u02': { lab: 'seawater', scene: 'evap-dishes', rowsKey: undefined },
  'c22-s32-u03': { lab: 'ruler', scene: 'ruler-desk', rowsKey: undefined }, 's41-u04': { lab: 'bread', scene: 'bread-dough', rowsKey: 'biologyInquiryRows' },
  'c22-s42-u01': { lab: 'moon', scene: 'moon-sky', rowsKey: 'skyInquiryRows' }, 'c22-s42-u02': { lab: 'meadow', scene: 'meadow-field', rowsKey: 'ecologyInquiryRows' } };
const load = async (u) => {
  const [book, ix, unit, think, similar, lesson, records] = await Promise.all([import(`../data/book/${u}.book.js`), import(`../data/book/${u}.interact.js`), import(`../data/units/${u}.js`),
    import(`../data/units/${u}.think.js`), import(`../data/units/${u}.similar.js`).catch(() => ({ similar: [] })), import(`../data/units/${u}.lesson.js`), import(`../data/units/${u}.records.js`)]);
  return { ...book, ix: ix.interact, pool: [...similar.similar, ...unit.items, ...think.items], think, lesson: lesson.lesson, records: records.recordsLesson };
};

for (const [u, want] of Object.entries(UNITS)) {
  test(`${u} 기본 수업 = 사고력 수업(기록 양식 없음)`, async () => {
    const d = await load(u);
    assert.ok(!d.chapter.inquirywork && !d.chapter.fieldwork, '기록형 수업 틀로 가면 안 된다');
    for (const mode of ['self', 'teach']) {
      const S = buildSlides(d.chapter, d.art, d.plan, d.pool, mode, d.ix), id = (k) => S.findIndex((s) => s.id === k);
      assert.ok(S.length >= 20 && S.length <= 40, `${mode} ${S.length}장`);
      assert.equal(S.filter((s) => s.kind === 'fieldwork' || s.kind === 'fieldwork-read').length, 0, '기록 앱 장이 없다');
      assert.equal(S.filter((s) => s.id === 'lab').length, 1, '3D 실험실 장 하나');
      for (const [a, b] of [['intro', 'predict'], ['predict', 'lab'], ['lab', 'concl'], ['concl', 'note'], ['note', 'wonder']]) assert.ok(id(a) >= 0 && id(a) < id(b), `${mode}: ${a} → ${b}`);
      const before = S.slice(0, id('lab')).map((s) => s.body).join(' ');
      for (const ans of [d.chapter.conclusion[0].a, d.ix.predict.result]) assert.ok(!before.includes(ans), `${mode}: 실험 전에 답이 보인다`);
      assert.ok(!/-(row|over|all)\.webp/.test(before), `${mode}: 실험 전 장면에 결과 그림이 있다`);
      const tests = S.filter((s) => /^test\d/.test(s.id));
      assert.equal(tests.length, d.chapter.check.length, '확인 문제가 모두 실린다');
    }
    assert.equal(d.lesson.explore.lab.kind, want.lab);
    assert.equal(d.lesson.engage.scene, want.scene);
  });

  test(`${u} 예전 기록은 선택 기능으로 이어진다`, async () => {
    const d = await load(u);
    assert.equal(d.lesson.explore.records.kind, 'inquiry');
    assert.equal(d.lesson.explore.records.config, d.records.explore.lab.config, '같은 활동 설정(저장 키 sciLab.inquiry.<단원>)');
    assert.equal(d.lesson.explore.records.rowsKey, want.rowsKey ?? d.records.explore.lab.rowsKey);
    assert.notEqual(d.lesson.explore.lab.rowsKey || 'labRows', d.lesson.explore.records.rowsKey || 'labRows', '새 3D 실험 기록이 예전 기록 행을 덮지 않는다');
    assert.equal(d.lesson.report, d.records.report);
  });

  test(`${u} 교재: 학생용은 답 비공개, 교사용은 답과 해설`, async () => {
    const d = await load(u);
    const s = renderChapter(d.chapter, d.art, d.pool), t = renderChapter(d.chapter, d.art, d.pool, { teacher: true });
    assert.ok(!s.includes('class="bk-ans"') && t.includes('class="bk-ans"'));
    assert.ok(!/undefined|\[object Object\]/.test(s + t));
    for (const m of s.matchAll(/src="\.\.\/assets\/book\/([^"]+)"/g)) assert.ok((await import('node:fs')).existsSync(new URL(`../assets/book/${m[1]}`, import.meta.url)), `그림 없음 ${m[1]}`);
  });

  test(`${u} 수업 문항 품질: 정답 자리·보기 길이·판정 예시`, async () => {
    const d = await load(u), items = d.think.items, sc = items.filter((x) => x.answerContract.type === 'single-choice');
    const pos = [0, 0, 0, 0, 0]; sc.forEach((x) => pos[x.answerContract.answer]++);
    assert.ok(Math.max(...pos) - Math.min(...pos) <= 1, `정답 자리 ${pos}`);
    for (const x of sc) { const L = x.choices.map((c) => c.length), a = x.answerContract.answer; assert.ok(!(L[a] === Math.max(...L) && Math.max(...L) - [...L].sort((p, q) => q - p)[1] >= 3), `${x.id} 정답이 눈에 띄게 가장 긴 보기`); }
    for (const x of sc) assert.ok(d.think.misc.distractors[x.id], `${x.id} 오답→오개념 연결`);
    for (const [k, j] of Object.entries(d.think.judge)) {
      for (const a of j.ex.ok) assert.equal(judgeText(a, j).st, 'ok', `${k} ok: ${a}`);
      for (const a of j.ex.no) assert.notEqual(judgeText(a, j).st, 'ok', `${k} no: ${a}`);
    }
    for (const k of [...d.chapter.check, ...d.chapter.formative.items]) assert.ok(d.pool.some((x) => x.id === k), `확인 문제 ${k} 없음`);
  });
}

test('3D 모형 수치 = 교재 결과 표', () => {
  assert.deepEqual(LEVELS.map((l) => seaModel(l, false).n), [0, 1, 2, 3]);
  assert.deepEqual(LEVELS.map((l) => seaModel(l, true).n), [0, 0, 0, 3]);
  assert.deepEqual(seaModel(4, false).wet, ['B', 'C', 'D'], '언덕 위 A는 4 cm에서도 젖지 않는다');
  assert.deepEqual([1, 2, 3].map((r) => glitterModel(r, 0).n), [2, 4, 6]);
  assert.deepEqual([1, 2, 3].map((r) => glitterModel(r, 1).n), [2, 2, 2]);
  assert.deepEqual([hardest(), bendiest(), floaters(), seeThrough()], ['금속', '고무', ['나무'], ['플라스틱']], '막대 네 개: 단단함·휨·뜸·투명');
  assert.equal(materialRow('물에 넣기').고무, '가라앉아요', '무른 고무도 가라앉는다(단단함과 뜨는 것은 다른 성질)');
  assert.deepEqual(AMOUNTS.map((ml) => evapRow(ml).seaG), [0.35, 0.7, 1.4], '바닷물 약 3.5 % · 양에 비례');
  assert.ok(AMOUNTS.every((ml) => evapRow(ml).tapG === 0), '수돗물은 거의 남지 않음');
  assert.deepEqual([5, 10, 15].map((l) => rulerRow(l, '세게').rank), [3, 2, 1], '짧을수록 높은 소리');
  assert.equal(rulerRow(10, '세게').rank, rulerRow(10, '약하게').rank, '세기는 높낮이를 바꾸지 않는다');
  assert.deepEqual([3, 7, 15].map((d) => moonRow(d).dir), ['서쪽', '남쪽', '동쪽'], '같은 시각(저녁)의 달은 서쪽 → 동쪽');
  assert.deepEqual([3, 7, 15, 22, 26].map((d) => moonRow(d).name), ['초승달', '상현달', '보름달', '하현달', '그믐달']);
  assert.ok([3, 7, 15].map((d) => moonRow(d).lit).every((v, i, a) => !i || v > a[i - 1]), '보름까지 밝은 부분이 커진다');
  assert.deepEqual([22, 26].map((d) => moonRow(d).time), ['새벽 6시쯤', '새벽 6시쯤'], '하현·그믐은 새벽 관찰');
  assert.deepEqual(['rabbitT', 'grassT'].map((k) => meadowRow('여우가 사라짐')[k]), ['늘어남', '줄어듦'], '여우가 사라지면 토끼 늘고 풀 줄어듦');
  assert.deepEqual(['grassT', 'foxT'].map((k) => meadowRow('토끼가 사라짐')[k]), ['늘어남', '줄어듦'], '토끼가 사라지면 풀 늘고 여우 줄어듦');
  assert.deepEqual(['rabbitT', 'foxT'].map((k) => meadowRow('풀이 줄어듦(가뭄)')[k]), ['줄어듦', '줄어듦'], '가뭄이면 토끼·여우 모두 줄어듦');
  assert.equal(meadowRow('그대로').result, '풀·토끼·여우 모두 그대로');
});
