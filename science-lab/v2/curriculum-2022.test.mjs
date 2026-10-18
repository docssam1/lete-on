import test from 'node:test';
import assert from 'node:assert/strict';
import { SEMS_2022, bankFor2022, assessmentsFor2022 } from './curriculum-2022.js';
import { curriculumBankHtml, catalogNavigation } from './bank-catalog.js';
import { SEMS, BANK } from './units-index.js';

test('2022 차례는 8학기 32개 위치를 기존 자료 ID와 구분한다', () => {
  assert.deepEqual(SEMS_2022.map((s) => s.sem), ['3-1', '3-2', '4-1', '4-2', '5-1', '5-2', '6-1', '6-2']);
  const units = SEMS_2022.flatMap((s) => s.units);
  assert.equal(units.length, 32);
  assert.equal(new Set(units.map((u) => u.key)).size, 32);
  for (const s of SEMS_2022) {
    assert.equal(s.units.length, 4);
    assert.match(s.source, /^https:\/\/bookstore\.visang\.com\//);
    for (const [i, u] of s.units.entries()) {
      assert.equal(u.no, i + 1);
      assert.equal(u.key, `2022:${u.position}`);
    }
  }
  assert.deepEqual(SEMS_2022[1].units.map((u) => u.title), ['물체와 물질', '지구와 바다', '소리의 성질', '감염병과 건강한 생활']);
  assert.equal(SEMS_2022[7].units[3].title, '과학과 나의 진로');
});

test('같은 위치의 기존 문제은행을 새 단원에 자동 연결하지 않는다', () => {
  const old = SEMS.find((s) => s.sem === '3-2').units[2];
  const current = SEMS_2022.find((s) => s.sem === '3-2').units[2];
  assert.equal(old.id, current.position);
  assert.equal(old.title, '지표의 변화');
  assert.equal(current.title, '소리의 성질');
  assert(BANK[old.id]);
  assert.equal(bankFor2022(current.position, BANK).contentId, 'c22-s32-u03');
  assert.equal(bankFor2022('s42-u03', BANK).contentId, 'c22-s42-u03'); // 새기체 ID를 명시적으로 연결하고 기존 그림자와 거울은 유지
  assert.equal(bankFor2022('not-a-unit', BANK), null);
  assert(!curriculumBankHtml(BANK).includes('#/s32-u03/exam/'));
});

test('검수된 연결은 실제 원문 수와 1:1 유사문항이 있는 자료를 연다', async () => {
  for (const unit of SEMS_2022.flatMap((s) => s.units)) {
    const resource = bankFor2022(unit.position, BANK);
    if (!resource) continue;
    if(resource.sourcePending){assert.equal(resource.n,0);const{items,unit}=await import(`../data/units/${resource.contentId}.js`);assert.equal(items.length,resource.supplement);assert.equal(unit.sources.originalExamAvailable,false);continue;}
    const { source } = await import(`../data/units/${resource.contentId}.source.js`);
    const { similar } = await import(`../data/units/${resource.contentId}.similar.js`);
    assert.equal(source.length, resource.n, unit.key);
    assert.deepEqual([...new Set(source.map((q) => q.sourceRef.set))], resource.sets);
    for (const q of source) assert.equal(similar.filter((s) => s.sourceRef.of.set === q.sourceRef.set && s.sourceRef.of.no === q.sourceRef.no).length, 1);
  }
  assert.equal(bankFor2022('s31-u01', BANK).contentId, 's31-u01');
  assert.equal(bankFor2022('s31-u02', BANK).contentId, 's31-u02');
  assert.equal(bankFor2022('s31-u03', BANK).contentId, 's31-u03');
  assert.equal(bankFor2022('s31-u04', BANK).contentId, 's31-u04');
  assert.equal(bankFor2022('s31-u04', BANK).supplement, 64);
  assert.equal(bankFor2022('s41-u02', BANK).contentId, 's41-u02');
  assert.equal(bankFor2022('s41-u02', {}), null);
});

test('준비 중인 단원에는 학습 링크를 만들지 않고, 자료가 없으면 0으로 표시한다', () => {
  const html = curriculumBankHtml({});
  assert.equal((html.match(/data-curriculum-unit=/g) || []).length, 32);
  assert.equal((html.match(/<li class="wait"/g) || []).length, 32);
  assert.match(html, /현재 0개 단원의 원문 0문항/);
  assert(!html.includes('/exam/'));
});

test('두 차례는 직접 링크와 현재 페이지 표시를 제공한다', () => {
  for (const current of ['2022', 'legacy']) {
    const nav = catalogNavigation(current);
    assert.equal((nav.match(/aria-current="page"/g) || []).length, 1);
    assert.match(nav, current === '2022' ? /href="#\/bank" aria-current="page"/ : /href="#\/bank\/legacy" aria-current="page"/);
  }
});

test('중간평가는 실제 두 단원 범위와 50쌍을 유지하고 32단원 합계에 섞이지 않는다', async () => {
  const [mid] = assessmentsFor2022('3-1',BANK);
  assert.equal(mid.contentId,'s31-mid');
  assert.equal(mid.label,'중간평가');assert.equal(mid.assessment,true);
  assert.equal(mid.scope,'힘과 우리 생활 · 동물의 생활');
  assert.deepEqual(mid.sets,[1,2]);
  const {source} = await import('../data/units/s31-mid.source.js');
  const {similar} = await import('../data/units/s31-mid.similar.js');
  assert.equal(source.length,50);assert.equal(similar.length,50);
  for(const q of source) assert.equal(similar.filter((s)=>s.sourceRef.of.set===q.sourceRef.set&&s.sourceRef.of.no===q.sourceRef.no).length,1);
  const html=curriculumBankHtml(BANK);
  assert.equal((html.match(/data-curriculum-unit=/g)||[]).length,32);
  assert(html.includes('현재 20개 단원의 원문 1298문항'));
  assert(html.includes('data-assessment="s31-mid"'));
  assert(html.includes('#/s31-fin/exam/1'));
  assert(html.includes('창작 60문항'));
  assert.deepEqual(assessmentsFor2022('3-1',{}),[]);
  assert.deepEqual(assessmentsFor2022('3-2',BANK).map(a=>a.contentId),['c22-s32-mid','c22-s32-fin']);
  assert.deepEqual(assessmentsFor2022('4-1',BANK).map(a=>a.contentId),['c22-s41-mid','c22-s41-fin']);
  assert(html.includes('원문 50 · 짝 50 · 보충 24'));
  assert(html.includes('#/c22-s41-mid/print/student'));
});

test('새 물체와 물질의 내용 ID는 기존 탐구 단원과 저장 위치를 덮어쓰지 않는다', async () => {
 const old=SEMS.find(s=>s.sem==='3-2').units[0],current=bankFor2022('s32-u01',BANK);
 assert.equal(old.id,'s32-u01');assert.equal(old.title,'재미있는 나의 탐구');assert.equal(current.contentId,'c22-s32-u01');assert.equal(current.n,70);assert.equal(current.supplement,64);assert.equal(current.reusedSourceUnit,'s32-u04');
 const {unit}=await import('../data/units/s32-u01.js');assert.equal(unit.id,'s32-u01');assert.equal(unit.title,'재미있는 나의 탐구');
 const h=curriculumBankHtml(BANK);assert(h.includes('#/c22-s32-u01/start'));assert(h.includes('원문 70 · 짝 70 · 보충 64'));assert(!h.includes('#/s32-u01/exam/'));
});

test('지구와 바다의 창작 학습은 원문 보유 단원으로 표시하지 않는다',()=>{
 const b=bankFor2022('s32-u02',BANK),h=curriculumBankHtml(BANK);assert.equal(b.contentId,'c22-s32-u02');assert.equal(b.n,0);assert.equal(b.supplement,80);assert(b.sourcePending);assert.deepEqual(b.sets,[]);assert(!h.includes('#/c22-s32-u02/exam/'));assert(h.includes('창작 80 · 원문 준비 중'));assert(h.includes('20개 단원의 원문 1298문항'));assert(h.includes('별도로 4개 단원의 창작 학습 352문항'));
});
