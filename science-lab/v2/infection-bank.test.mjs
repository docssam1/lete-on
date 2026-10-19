import test from 'node:test';
import assert from 'node:assert/strict';
import {items,unit} from '../data/units/c22-s32-u04.js';
import {similar} from '../data/units/c22-s32-u04.similar.js';
import {judge} from '../data/units/c22-s32-u04.judge.js';
import {taxonomy} from '../data/units/c22-s32-u04.taxonomy.js';
import {practicePaperHtml,practiceAnswer} from './practice-paper.js';
import {bankFor2022} from './curriculum-2022.js';
import {BANK,BOOK_UNITS} from './units-index.js';
import {judgeShort,judgeText} from './judge.js';

test('현재 감염병 은행은 옛 물질 원문과 분리하고 원문 확보·실제 수행 완료를 만들지 않는다',()=>{
  const b=bankFor2022('s32-u04',BANK);
  assert.equal(b.contentId,unit.id); assert(b.sourcePending); assert.equal(b.n,0);
  assert.deepEqual(b.sets,[]); assert(b.lesson); assert(BOOK_UNITS.has(unit.id));
  assert.equal(unit.sources.originalExamAvailable,false); assert.deepEqual(similar,[]);
  assert.equal(BANK['s32-u04'].n,70);
  assert.equal(items.length,80); assert.deepEqual(Object.keys(taxonomy.sources),[]);
  for(const q of items) {
    assert.equal(q.status,'authored'); assert.equal(q.sourceRef.type,'authored-supplement');
    assert(q.taxonomy.topic&&q.taxonomy.concept&&q.taxonomy.inquirySkill);
    assert(q.givens===null||typeof q.givens==='object');
  }
});
test('단답의 부분 어절은 통과시키지 않고 수행 설명은 교사 확인으로 남긴다',()=>{
  for(const q of items) {
    const a=q.answerContract;
    if(a.type==='short-text') {
      assert.equal(judgeShort(a.answer,a.accepted).st,'ok');
      assert.notEqual(judgeShort(a.answer.slice(0,1),a.accepted).st,'ok',q.id);
      assert.notEqual(judgeShort('모르겠어요',a.accepted).st,'ok',q.id);
    }
    if(a.type==='written-explanation') {
      assert(judge[q.id].open); assert.equal(judgeText(a.sample,judge[q.id]).st,'review');
    }
  }
});
test('창작 문제지의 세 모드는 같은80문항·번호를 쓰며 학생 답을 노출하지 않는다',()=>{
  const args={unit:unit.id,title:unit.title,course:unit.course,items};
  const student=practicePaperHtml(args),teacher=practicePaperHtml({...args,mode:'teacher'}),answers=practicePaperHtml({...args,mode:'answers'});
  for(const html of [student,teacher,answers]) {
    assert.equal((html.match(/data-paper-item=/g)||[]).length,80);
    assert(!html.includes('undefined')); assert(!html.includes('[object Object]'));
    assert.match(html,/실제 실천·공유를 완료한 것으로 세지/);
    assert.match(html,/GFIELD · 지필드/);
  }
  assert(!student.includes('class="practice-key"')); assert(!student.includes('class="ans"'));
  for(const q of items.filter(q=>q.answerContract.type==='written-explanation')) assert(!student.includes(q.answerContract.sample));
  assert.equal((teacher.match(/class="practice-key"/g)||[]).length,80);
  assert.equal((answers.match(/class="practice-key"/g)||[]).length,80);
  const multi=items.find(q=>q.answerContract.type==='multi-choice'),short=items.find(q=>q.answerContract.type==='short-text');
  assert.equal(practiceAnswer(multi),'①, ③'); assert.equal(practiceAnswer(short),'감염병');
});
