// 쓰기 답 로컬 판정표 검사 — node --test science-lab/bank/*.test.mjs
// 판정표(data/units/<u>.judge.js)가 틀리면 아이가 맞게 쓴 답을 틀렸다고 듣게 된다. 그래서 예로 못 박는다.
//  ① 모든 서술형 문항과 스스로 공부 쓰기 칸(가설·이런 경우는·결론 1)에 판정표가 있다
//  ② 문항·교재의 예시 답은 반드시 통과(ok)
//  ③ ex.ok는 통과, ex.part는 일부(part), ex.no는 두 번째 시도에서도 통과하지 않는다
//  ④ 단답은 정답 목록 그대로·말끝 붙은 답을 통과시키고, 다른 답은 통과시키지 않는다
import test from 'node:test';
import assert from 'node:assert/strict';
import { judgeText, judgeShort, norm } from '../v2/judge.js';

const U = ['c22-s32-u03', 's41-mid', 's32-fin', 's32-mid', 's32-u05', 's32-u04', 's31-mid', 's32-u03', 's32-u02', 's31-u02', 's31-u03', 's32-u01', 's31-u01', 's41-u01', 's41-u02', 's41-u03', 's41-u03b', 's42-u01', 's42-u02', 's42-u03', 's42-u04', 's42-u05', 's51-u01', 's51-u02', 's51-u03', 's51-u04', 's51-u05', 's52-u01'];
const R = new URL('../data/', import.meta.url);
U.push('s31-u04');
U.push('s31-fin');
U.push('c22-s32-u01','c22-s32-u02','c22-s32-u04');
if (!U.includes('c22-s42-u04')) U.push('c22-s42-u04');
const load = async (p) => { try { return await import(new URL(p, R)); } catch (e) { if (e.code === 'ERR_MODULE_NOT_FOUND') return null; throw e; } };

for (const u of U) {
  test(`${u} 판정표`, async (t) => {
    // 사고력 수업 문항·쓰기 칸 판정표(units/<u>.think.js)는 문제은행 판정표에 더해서 본다(v2/think-merge.js와 같은 규칙).
    const T = (await load(`units/${u}.think.js`));
    const J0 = (await load(`units/${u}.judge.js`))?.judge, J = J0 || T?.judge ? { ...(J0 || {}), ...(T?.judge || {}) } : null;
    assert.ok(J, `${u}.judge.js 없음`);
    const book = (await load(`book/${u}.book.js`))?.chapter;
    // 수업에 실제로 있는 자유 쓰기 칸만 검사한다. 수행 안내만 있는 교재는 빈 목록을 명시한다.
    const deckExamples = book ? book.deckWrittenExamples ?? { hypo: book.hypothesis?.a, wonder: book.wonder?.a, concl0: book.conclusion?.[0]?.a } : {};
    const items = [];
    for (const f of [`units/${u}.js`, `units/${u}.similar.js`, `units/${u}.source.js`, `units/${u}.think.js`]) { const m = await load(f); if (m) for (const v of Object.values(m)) if (Array.isArray(v)) items.push(...v.filter((x) => x?.answerContract)); }

    await t.test('① 빠진 판정표 없음', () => {
      const want = [...items.filter((x) => x.answerContract.type === 'written-explanation').map((x) => x.id), ...Object.keys(deckExamples).map((k) => `deck:${k}`)];
      const miss = want.filter((k) => !J[k]);
      assert.deepEqual(miss, [], `판정표 없음: ${miss.join(', ')}`);
    });
    await t.test('② 예시 답은 통과', () => {
      const bad = [];
      for (const it of items) if (it.answerContract.type === 'written-explanation' && J[it.id] && !J[it.id].open) { const r = judgeText(it.answerContract.sample, J[it.id]); if (r.st !== 'ok') bad.push(`${it.id}: ${r.st} ${JSON.stringify(r.missing.map((m) => m.t))} ← ${it.answerContract.sample}`); }
      for (const [name, a] of Object.entries(deckExamples)) { const k = `deck:${name}`; assert.equal(typeof a, 'string', `${k}: 예시 답 없음`); const r = judgeText(a, J[k]); if (J[k] && !J[k].open && r.st !== 'ok') bad.push(`${k}: ${r.st} ${JSON.stringify(r.missing.map((m) => m.t))} ← ${a}`); }
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

test('전각 비교 기호도 방향과 같음을 구별한다', () => {
  for (const [wide, plain] of [['＝', '='], ['＜', '<'], ['＞', '>']]) {
    assert.equal(judgeShort(wide, [plain]).st, 'ok');
    assert.equal(judgeShort(plain, [wide]).st, 'ok');
  }
  assert.equal(judgeShort('＜', ['＝']).st, 'no');
  assert.equal(judgeShort('＞', ['＜']).st, 'no');
  assert.equal(judgeShort('   ', ['＝']).st, 'empty');
});

test('교재의 원문자 실험 기호는 보통 알파벳과 같고 서로 구별된다', () => {
  assert.equal(norm('실험 Ⓐ와 실험 Ⓒ'), norm('실험 A와 실험 C'));
  assert.equal(judgeShort('Ⓐ, Ⓒ', ['A, C']).st, 'ok');
  assert.equal(judgeShort('Ⓐ, Ⓑ', ['A, C']).st, 'no');
});

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

test('단답은 문장 말끝과 다른 낱말·기호 추가를 구별한다', () => {
  for (const [answer, text] of [['응결','응결합니다'],['별','별이에요'],['태양','태양입니다'],['전기','전기예요'],['북극성','북극성이야'],['소금','소금이라고요']]) {
    assert.equal(judgeShort(text, [answer]).st, 'ok', text);
  }
  for (const [answer, text] of [['소금','소금물'],['북','북극성'],['별','별자리'],['태양','태양계'],['전기','전기장'],['달','달무리'],['ㄱ','ㄱ, ㄴ'],['소금','소금이 아니다'],['별','별이 아님']]) {
    assert.equal(judgeShort(text, [answer]).st, 'no', `${answer}: ${text}`);
  }
  assert.equal(judgeShort('별자리예요', ['별','별자리']).st, 'ok');
});
