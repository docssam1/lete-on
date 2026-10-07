// 쓰기 답 로컬 판정표 검사 — node --test science-lab/bank/*.test.mjs
// 판정표(data/units/<u>.judge.js)가 틀리면 아이가 맞게 쓴 답을 틀렸다고 듣게 된다. 그래서 예로 못 박는다.
//  ① 모든 서술형 문항과 스스로 공부 쓰기 칸(가설·이런 경우는·결론 1)에 판정표가 있다
//  ② 문항·교재의 예시 답은 반드시 통과(ok)
//  ③ ex.ok는 통과, ex.part는 일부(part), ex.no는 두 번째 시도에서도 통과하지 않는다
//  ④ 단답은 정답 목록 그대로·말끝 붙은 답을 통과시키고, 다른 답은 통과시키지 않는다
import test from 'node:test';
import assert from 'node:assert/strict';
import { judgeText, judgeShort, norm } from '../v2/judge.js';

const U = ['s41-u01', 's41-u02', 's41-u03', 's41-u03b', 's42-u01', 's42-u02', 's42-u03', 's42-u04', 's42-u05', 's51-u01'];
const R = new URL('../data/', import.meta.url);
const load = async (p) => { try { return await import(new URL(p, R)); } catch (e) { if (e.code === 'ERR_MODULE_NOT_FOUND') return null; throw e; } };

for (const u of U) {
  test(`${u} 판정표`, async (t) => {
    const J = (await load(`units/${u}.judge.js`))?.judge;
    assert.ok(J, `${u}.judge.js 없음`);
    const book = (await load(`book/${u}.book.js`))?.chapter;
    const items = [];
    for (const f of [`units/${u}.js`, `units/${u}.similar.js`]) { const m = await load(f); if (m) for (const v of Object.values(m)) if (Array.isArray(v)) items.push(...v.filter((x) => x?.answerContract)); }

    await t.test('① 빠진 판정표 없음', () => {
      const want = [...items.filter((x) => x.answerContract.type === 'written-explanation').map((x) => x.id), ...(book ? ['deck:hypo', 'deck:wonder', 'deck:concl0'] : [])];
      const miss = want.filter((k) => !J[k]);
      assert.deepEqual(miss, [], `판정표 없음: ${miss.join(', ')}`);
    });
    await t.test('② 예시 답은 통과', () => {
      const bad = [];
      for (const it of items) if (it.answerContract.type === 'written-explanation' && J[it.id] && !J[it.id].open) { const r = judgeText(it.answerContract.sample, J[it.id]); if (r.st !== 'ok') bad.push(`${it.id}: ${r.st} ${JSON.stringify(r.missing.map((m) => m.t))} ← ${it.answerContract.sample}`); }
      if (book) for (const [k, a] of [['deck:hypo', book.hypothesis.a], ['deck:wonder', book.wonder.a], ['deck:concl0', book.conclusion[0].a]]) { const r = judgeText(a, J[k]); if (J[k] && !J[k].open && r.st !== 'ok') bad.push(`${k}: ${r.st} ${JSON.stringify(r.missing.map((m) => m.t))} ← ${a}`); }
      assert.deepEqual(bad, []);
    });
    await t.test('③ 예(ex)대로 판정', () => {
      const bad = [];
      for (const [k, key] of Object.entries(J)) {
        if (key.open) continue;
        assert.ok(key.ex?.ok?.length, `${k}: ex.ok 없음`);
        assert.ok(key.ex?.no?.length, `${k}: ex.no 없음`);
        for (const a of key.ex.ok) { const r = judgeText(a, key); if (r.st !== 'ok') bad.push(`${k} ok→${r.st} ${JSON.stringify(r.missing.map((m) => m.t))}: ${a}`); }
        for (const a of key.ex.part || []) { const r = judgeText(a, key); if (r.st !== 'part') bad.push(`${k} part→${r.st}: ${a}`); }
        for (const a of key.ex.no) { for (const tries of [1, 2]) { const r = judgeText(a, key, { tries }); if (r.st === 'ok') bad.push(`${k} no→ok(tries ${tries}): ${a}`); } }
        for (const n of key.need || []) assert.ok(n.t && n.ask, `${k}: need에 t·ask 필요`);
        for (const w of key.wrong || []) assert.ok(w.say, `${k}: wrong에 say 필요`);
      }
      assert.deepEqual(bad, []);
    });
    await t.test('④ 단답 정답 목록', () => {
      for (const it of items.filter((x) => x.answerContract.type === 'short-text')) {
        const acc = it.answerContract.accepted?.length ? it.answerContract.accepted : [it.answerContract.answer];
        for (const a of acc) assert.equal(judgeShort(a, acc).st, 'ok', `${it.id}: ${a}`);
        assert.equal(judgeShort('모르겠어요', acc).st, 'no', it.id);
      }
    });
  });
}

test('부정·말끝·빈 답', () => {
  const key = { need: [{ t: '붙는다', ask: '?', any: ['붙'] }], ex: {} };
  assert.equal(judgeText('자석에 붙는다', key).st, 'ok');
  assert.equal(judgeText('자석에 붙지 않는다', key).st, 'miss');
  assert.equal(judgeText('자석에 안 붙는다', key).st, 'miss');
  assert.equal(judgeText('   ', key).st, 'empty');
  assert.equal(judgeShort('응결해요', ['응결']).st, 'ok');
  assert.equal(judgeShort('응결이 아니다', ['응결']).st, 'no');
  assert.equal(judgeShort('ㄴ', ['ㄴ']).st, 'ok');
  assert.equal(judgeShort('ㄷ', ['ㄴ']).st, 'no');
  assert.equal(norm('(1) ㉡ (2) ㉠'), '1㉡2㉠');
  assert.equal(norm('ㄴ, ㄷ이 맞다'), '㉡㉢이맞다');
  // 두 번째에도 모자란 긴 답: 핵심 생각이 하나라도 있으면 선생님 확인, 하나도 없으면 딴 이야기로 보고 예시 답
  const two = { need: [{ t: '붙는다', ask: '?', any: ['붙'] }, { t: '끌려온다', ask: '?', any: ['끌려'] }], ex: {} };
  assert.equal(judgeText('자석 쪽으로 가까이 가서 딱 붙어 버리는 것 같아요', two, { tries: 2 }).st, 'review');
  assert.equal(judgeText('전혀 다른 말로 길게 설명해 보았습니다 정말로요', two, { tries: 2 }).st, 'miss');
  assert.equal(judgeText('아무거나', { open: true }).st, 'review');
});
