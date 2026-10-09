// Daily Test 채점(v2/daily-grade.js) — 모든 교재 단원에서 정답은 맞음, 빈칸은 안 푼 문항, 모르는 말은 추측하지 않고 검토.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { gradeDaily, summarize, diagnoseDaily, vocabOf, countWord } from './daily-grade.js';

const UNITS = ['s41-u01', 's41-u02', 's41-u03', 's41-u03b', 's42-u01', 's42-u02', 's42-u03', 's42-u04', 's42-u05', 's51-u01', 's51-u02', 's51-u03', 's51-u04', 's51-u05', 's52-u01'];
const DATA = { 's41-u03b': 's41-u03' };
async function load(u) {
  const d = DATA[u] || u;
  const [{ chapter: ch }, { similar }, misc] = await Promise.all([import(`../data/book/${u}.book.js`), import(`../data/units/${d}.similar.js`), import(`../data/units/${d}.misc.js`)]);
  const judge = await import(`../data/units/${u}.judge.js`).then((m) => m.judge).catch(() => ({}));
  const bySrc = (k) => similar.find((s) => `${s.sourceRef?.of?.set}-${s.sourceRef?.of?.no}` === k);
  const list = [...new Set([...(ch.check || []), ...(ch.formative?.items || [])])].map(bySrc).filter(Boolean);
  return { ch, similar, misc, judge, list, vocab: vocabOf(similar, misc) };
}
const keyOf = (it) => { const ac = it.answerContract;
  return { 'single-choice': ac.answer, 'multi-choice': ac.answers, 'short-text': ac.answer, cloze: ac.blanks?.map((b) => b.answer), 'table-fill': ac.rows?.map((r) => r.answer), 'written-explanation': ac.sample }[ac.type]; };

for (const u of UNITS) test(`${u}: 정답은 맞음, 빈칸은 안 푼 문항`, async () => {
  const { list, misc, judge, vocab } = await load(u);
  assert.ok(list.length >= 4, `Daily Test 문항이 ${list.length}개뿐`);
  for (const it of list) {
    const opt = { misc, judge, vocab }, g = gradeDaily(it, keyOf(it), opt);
    if (it.answerContract.type === 'written-explanation') assert.notEqual(g.status, 'wrong', `${it.id} 예시 답이 오개념으로 판정됨`);
    else assert.equal(g.status, 'correct', `${it.id} 정답이 ${g.status}`);
    assert.equal(gradeDaily(it, it.answerContract.type === 'single-choice' ? null : '', opt).status, 'blank');
  }
});

test('고르기 오답은 틀림이고 고른 보기를 넘긴다', async () => {
  const { list, misc } = await load('s51-u04');
  const it = list.find((x) => x.answerContract.type === 'single-choice'), bad = (it.answerContract.answer + 1) % it.choices.length;
  const g = gradeDaily(it, bad, { misc });
  assert.equal(g.status, 'wrong'); assert.equal(g.detail.picked, bad);
});

test('단답: 단원 낱말 목록의 다른 낱말은 틀림, 모르는 말은 검토', async () => {
  const { list, misc, vocab } = await load('s51-u04');
  const it = list.find((x) => x.answerContract.type === 'short-text');
  const other = [...vocab].find((w) => w && w !== it.answerContract.answer && !(it.answerContract.accepted || []).includes(w));
  assert.equal(gradeDaily(it, other, { misc, vocab }).status, 'wrong');
  assert.equal(gradeDaily(it, '잘모르겠는말ㅋ', { misc, vocab }).status, 'review');
});

test('서술: 판정표 예시대로 — 맞는 답은 맞음, 오개념 문장은 틀림(오개념 id 포함), 일부·엉뚱한 말은 검토', async () => {
  let seen = 0;
  for (const u of UNITS) {
    const { list, misc, judge } = await load(u);
    for (const it of list.filter((x) => x.answerContract.type === 'written-explanation' && judge[x.id]?.ex)) {
      const J = judge[it.id], o = { misc, judge };
      for (const t of J.ex.ok || []) assert.equal(gradeDaily(it, t, o).status, 'correct', `${u} ${it.id} ok 예시: ${t}`);
      for (const t of J.ex.part || []) assert.equal(gradeDaily(it, t, o).status, 'review', `${u} ${it.id} part 예시: ${t}`);
      for (const t of J.ex.no || []) { const g = gradeDaily(it, t, o); assert.notEqual(g.status, 'correct', `${u} ${it.id} no 예시가 맞음: ${t}`); if (g.status === 'wrong') assert.ok(g.detail.m.length, `${it.id} 오개념 id 없음`); }
      seen++;
    }
  }
  assert.ok(seen >= 5, `판정표가 있는 서술 문항이 ${seen}개뿐`);
});

test('점수: 검토·빈칸은 분모에서 뺀다', () => {
  const s = summarize([{ status: 'correct' }, { status: 'correct' }, { status: 'wrong' }, { status: 'review' }, { status: 'blank' }]);
  assert.deepEqual(s, { correct: 2, wrong: 1, confirmed: 3, review: 1, blank: 1, total: 5 });
});

test('진단: 두 문항 = 확정, 한 문항 = 의심, 확정이 먼저', () => {
  const dx = diagnoseDaily([{ id: 'a', status: 'wrong', m: ['M1'] }, { id: 'b', status: 'wrong', m: ['M2', 'M1'] }, { id: 'c', status: 'correct', m: [] }]);
  assert.deepEqual(dx.map((d) => [d.m, d.status, d.items.length]), [['M1', 'confirmed', 2], ['M2', 'suspected', 1]]);
});

test('고유어 수', () => { assert.equal(countWord(9), '아홉'); assert.equal(countWord(10), '열'); assert.equal(countWord(12), '열두'); });
