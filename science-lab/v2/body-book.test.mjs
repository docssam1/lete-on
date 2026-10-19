import test from 'node:test';
import assert from 'node:assert/strict';
import {chapter,art,bodyConcepts} from '../data/book/c22-s51-u04.book.js';
import {model} from '../data/book/c22-s51-u04.figures.js';
import {renderChapter} from './book.js';
import {BANK,READY,BOOK_UNITS} from './units-index.js';

test('우리 몸 교재: 96문항이 한 번씩 나오고 학생·교사 해설이 분리된다',()=>{
 const {questions,pages,teacherPages}=chapter;
 assert.equal(pages.length,42);assert.equal(teacherPages.length,24);
 assert.deepEqual(pages.flatMap(p=>p.blocks.filter(b=>b.type==='questions').flatMap(b=>b.ids)),questions.map(q=>q.id));
 assert.deepEqual(teacherPages.flatMap(p=>p.blocks.flatMap(b=>b.ids)),questions.map(q=>q.id));
 const student=renderChapter(chapter,art,[],{}),teacher=renderChapter(chapter,art,[],{teacher:true});
 assert.equal((student.match(/data-question=/g)||[]).length,96);assert(!student.includes('data-solution='));
 assert.equal((teacher.match(/data-solution=/g)||[]).length,96);
 assert([...pages,...teacherPages].every(p=>p.rail.length>=2));
 // 전용 전체 수업·기록 연결과 교재의 기존 지면을 함께 보존한다.
 assert.equal(BANK[chapter.unit].n,58);assert(!READY[chapter.unit].bankOnly&&BANK[chapter.unit].lesson&&BOOK_UNITS.has(chapter.unit));
});

test('우리 몸 문항: 8형식의 실제 응답 구조와 선택지·정답·기준이 유효하다',()=>{
 const forms=Object.fromEntries([...new Set(chapter.questions.map(q=>q.form))].map(f=>[f,chapter.questions.filter(q=>q.form===f).length]));
 assert.deepEqual(forms,{choice:23,blank:18,match:9,written:22,multi:8,order:7,short:5,draw:4});
 const positions=[0,0,0,0];
 for(const q of chapter.questions){
  for(const k of ['id','prompt','answer','explanation','misconception','criteria'])assert(q[k]?.length>0,`${q.id}: ${k}`);
  if(q.form==='choice'){assert.equal(q.choices.length,4);assert.equal(q.answer,'①②③④'[q.key]);positions[q.key]++;}
  if(q.form==='multi'){assert(q.key.length>1);assert(q.key.every(i=>i>=0&&i<q.choices.length));assert.equal(q.answer,q.key.map(i=>'①②③④⑤'[i]).join(', '));}
  if(q.form==='match')assert(q.given.length&&q.parts.length);
  if(q.form==='blank')assert(q.prompt.includes('[ ]'));
  if(q.form==='draw')assert.equal(q.drawing,'large');
 }
 assert.deepEqual(positions,[5,6,6,6]);
});

test('우리 몸 사진과 연습값: 설명 자료·실제 기록을 구별하고 기관 경로를 보존한다',()=>{
 const photos=Object.values(art).filter(h=>h.includes('<img'));
 assert.equal(photos.length,7);assert.equal(bodyConcepts.length,7);
 assert(photos.every(h=>h.includes('AI 실사형 설명 이미지 · 실제 기관/측정 사진 아님')&&!h.includes('<svg')));
 assert(art.arm.includes('grid-template-columns:2fr 1fr'));
 assert.deepEqual(model.urineRoute,['콩팥','오줌관','방광','요도','몸 밖']);
 assert.deepEqual(model.foodRoute,['입','식도','위','작은창자','큰창자','항문']);
 assert.deepEqual(model.exercise.rows,[['쉬고 난 뒤',72,18],['가벼운 걷기 직후',98,27],['잠시 쉰 뒤',78,20]]);
 assert.equal(model.exercise.actualStudentData,false);assert.equal(model.pump.actualMeasurement,false);
 assert.equal(model.pump.amountPerStrokeMl,4);assert.equal(model.pump.observationSeconds,10);
 const q=n=>chapter.questions[n-1];
 assert.equal(q(37).answer,'11회');assert.match(q(37).explanation,/30초/);
 assert.match(q(76).answer,/9회/);assert.match(q(76).answer,/건강/);
 assert.equal(q(86).answer,'2일');assert.match(q(92).answer,/AI/);
 for(const n of [22,23,24,25,26,27,28,29,39,40])assert(chapter.pages[n-1].blocks.some(b=>b.type==='field'||b.type==='table'));
});
