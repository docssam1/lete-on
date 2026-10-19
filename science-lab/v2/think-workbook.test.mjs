// 교과 연결 사고력 편집 교재(문제집형 A4) — 4-2 Ⅳ 기후변화(c22-s42-u04) · 3-2 Ⅳ 감염병(c22-s32-u04).
// 지킬 것: ① 학생용에 정답·해설이 없다 ② 교사용은 모든 문항 아래 정답 + 정답·해설 쪽 ③ 빠른 정답표가 모든 문항을 덮는다
// ④ 문항 형식이 다양하고 객관식 정답 자리가 고르다 ⑤ 그림 파일이 모두 있다 ⑥ 모형 수치가 3D 실험실과 같다.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { makeWorkbookPaper } from './think-workbook-paper.js';
import { seaModel } from '../scenes/sealevel-model.js';
import { glitterModel } from '../scenes/glitter-model.js';

const load = async (u) => {
  const [{ workbook: wb }, { art }] = await Promise.all([import(`../data/book/${u}.workbook.js`), import(`../data/book/${u}.book.js`)]);
  return { wb, art, paper: makeWorkbookPaper(wb, art) };
};
const count = (s, re) => (s.match(re) || []).length;

for (const u of ['c22-s42-u04', 'c22-s32-u04']) {
  test(`${u} 학생용 교재에는 정답·해설이 없다`, async () => {
    const { wb, paper } = await load(u), s = paper.workbookPaper({ mode: 'student' });
    assert.equal(count(s, /class="ed-key"/g), 0);
    assert.equal(count(s, /class="ed-solution"/g), 0);
    for (const q of wb.questions.filter((x) => ['written', 'draw', 'short', 'match', 'order'].includes(x.form))) assert.ok(!s.includes(q.answer), `${q.no}번 답이 학생용에 보임`);
    assert.ok(!/undefined|\[object Object\]/.test(s));
    assert.equal(count(s, /class="bk-page /g), wb.pages.length);
  });

  test(`${u} 교사용: 문항 아래 정답 + 정답·해설 쪽 · 빠른 정답표`, async () => {
    const { wb, paper } = await load(u);
    const t = paper.workbookPaper({ mode: 'teacher' }), a = paper.workbookPaper({ mode: 'answers' }), q = paper.workbookPaper({ mode: 'quick' });
    assert.equal(count(t, /class="ed-key"/g), wb.questions.length, '모든 문항 아래 정답');
    assert.equal(count(t, /class="ed-solution"/g), wb.questions.length, '교사용 뒤쪽 해설');
    assert.equal(count(a, /class="ed-solution"/g), wb.questions.length, '정답·해설만');
    for (const x of wb.questions) assert.ok(q.includes(`<th scope="row">${x.no}</th>`), `빠른 정답표 ${x.no}번`);
    for (const x of wb.questions) assert.ok(x.misconception && x.criteria && x.explanation, `${x.no}번 해설 칸`);
  });

  test(`${u} 문항 구성: 형식 다양 · 정답 자리 고름 · 보기 길이`, async () => {
    const { wb } = await load(u), Q = wb.questions;
    assert.ok(Q.length >= 40, `문항 ${Q.length}`);
    assert.equal(new Set(Q.map((x) => x.id)).size, Q.length);
    assert.ok(new Set(Q.map((x) => x.form)).size >= 7, '형식 7가지 이상');
    const sc = Q.filter((x) => x.form === 'choice'), pos = [0, 0, 0, 0, 0];
    sc.forEach((x) => pos[x.key]++);
    assert.ok(Math.max(...pos) - Math.min(...pos) <= 2, `정답 자리 ${pos}`);
    for (const x of sc) {
      const L = x.choices.map((c) => c.length), top = Math.max(...L), second = [...L].sort((p, r) => r - p)[1];
      assert.ok(!(L[x.key] === top && L.filter((v) => v === top).length === 1 && top - second >= 3), `${x.no}번 정답이 눈에 띄게 가장 긴 보기`);
      assert.ok(x.answer.startsWith('①②③④⑤'[x.key]), `${x.no}번 정답 표기`);
    }
    for (const x of Q.filter((x) => x.form === 'multi')) assert.ok(x.key.length >= 2, `${x.no}번 모두 고르기`);
  });

  test(`${u} 지면: 쪽마다 오른쪽 날개 · 그림 파일 있음`, async () => {
    const { wb, paper } = await load(u), s = paper.workbookPaper({ mode: 'student' });
    for (const p of [...wb.pages, ...wb.teacherPages, ...wb.quickPages]) assert.ok(p.rail.length, `${p.title} 날개`);
    for (const m of s.matchAll(/src="\.\.\/assets\/book\/([^"]+)"/g)) assert.ok(fs.existsSync(new URL(`../assets/book/${m[1]}`, import.meta.url)), `그림 없음 ${m[1]}`);
    assert.ok(count(s, /class="ed-photo"/g) + count(s, /class="ed-gallery-item"/g) >= 6, '그림(사진·렌더) 6장 이상(사진이 들어오면 늘어난다)');
    assert.ok(count(s, /class="ed-gallery numbered"/g) >= 1, '실험 과정 ①②③ 사진 줄');
    assert.ok(count(s, /class="ed-term"/g) >= 6, '핵심 낱말 강조');
    assert.ok(count(s, /ed-layout-two/g) >= 3, '단원평가·준비 점검 2단');
    assert.ok(!/-(row|over)\.webp/.test(s), '결과가 적힌 그림을 문항 옆에 두지 않는다');
  });
}

test('교재의 모형 수치 = 3D 실험실 수치', async () => {
  const sea = (await load('c22-s42-u04')).wb.questions, gl = (await load('c22-s32-u04')).wb.questions;
  const ans = (Q, p) => Q.find((q) => q.prompt.includes(p)).answer;
  assert.equal(ans(sea, '물높이 3 cm에서 물에 닿는 집을 모두'), seaModel(3).wet.join(', '));
  assert.equal(ans(sea, '물높이가 3 cm일 때 물에 닿은 집은 몇 채'), seaModel(3, true).result);
  assert.equal(ans(sea, '물높이 2 cm에서 물에 닿은 집은 몇 채'), seaModel(2).result);
  assert.equal(ans(gl, '1차례 악수한 뒤 반짝이가 묻은 친구는 누구'), glitterModel(1, 0).who.join(', '));
  assert.equal(ans(gl, '2차례 뒤 반짝이가 묻은 친구는 누구인가요?'), glitterModel(2, 1).who.join(', '));
  assert.equal(ans(gl, '2차례 뒤 반짝이가 묻은 친구는 몇 명'), glitterModel(2, 0).result);
});
