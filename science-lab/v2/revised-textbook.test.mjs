import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {revisedTextbook,revisedTextbookPaper,revisedTextbookUnits} from './revised-textbook.js?v=20261102';
import {renderChapter} from './book.js?terms=20261102';
const added=['s31-u01','s31-u02','s31-u03','s31-u04','c22-s42-u02','c22-s32-u03','c22-s32-u04','c22-s42-u04','s41-u02','s41-u03','s41-u04','c22-s42-u03','c22-s51-u01','c22-s51-u02','c22-s51-u04','c22-s52-u01','c22-s52-u02','c22-s52-u03','c22-s52-u04','c22-s61-u01','c22-s61-u02','c22-s61-u03','c22-s61-u04'];
const released=['c22-s32-u01','c22-s32-u02','s41-u01','c22-s42-u01','c22-s51-u03'];
const count=(html,re)=>(html.match(re)||[]).length;
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const root=path.dirname(fileURLToPath(import.meta.url));
test('검수한 서른한 교재만 별도 경로로 연결한다',async()=>{
 assert.deepEqual([...revisedTextbookUnits],['c22-s62-u04','c22-s62-u03','c22-s62-u02','c22-s62-u01',...released,...added]);
 const mod={chapter:{unit:'not-reviewed'},art:{}};
 assert.equal(await revisedTextbook('not-reviewed',mod),mod);
 assert.equal(await revisedTextbookPaper('not-reviewed'),null);
});
for(const unit of revisedTextbookUnits){
 const {workbook:wb}=await import(`../data/book/${unit}.workbook.js?v=20261102`);
 test(`${unit}: 학생·교사·해설·빠른표의 문항과 안내를 보존한다`,async()=>{
  const paper=await revisedTextbookPaper(unit);
  const html=Object.fromEntries(['student','teacher','answers','quick'].map(mode=>[mode,paper.workbookPaper({mode})]));
  assert.equal(count(html.student,/class="ed-question"/g),wb.questions.length);
  assert.equal(count(html.teacher,/class="ed-key"/g),wb.questions.length);
  assert.equal(count(html.answers,/class="ed-solution"/g),wb.questions.length);
  assert.equal(count(html.student,/class="ed-key"|class="ed-solution"/g),0);
  for(const mode of ['student','teacher','answers','quick']){
   assert(!/undefined|\[object Object\]/.test(html[mode]));
   for(const img of html[mode].matchAll(/<img\b[^>]*src="([^"]+)"/g)){
    const src=img[1];assert(src.startsWith('../assets/'),src);
    assert(fs.statSync(path.resolve(root,src)).size>0,src);
   }
  }
  for(const mode of ['answers','quick']){
   const expected=(mode==='answers'?wb.teacherPages:wb.quickPages).flatMap(p=>p.rail.map(r=>escape(r.title)));
   const actual=[...html[mode].matchAll(/<section class="ed-note"(?: data-note-role="(?:summary|extension|personal|teacher|other)")?><h3>(.*?)<\/h3>/g)].map(m=>m[1]);
   assert.deepEqual(actual,expected);
  }
  assert.equal(count(html.student,/<section class="bk-page /g),wb.pages.length);
  for(const q of wb.questions)assert(html.student.includes(`data-question="${q.id}"`));
  if(added.includes(unit)){
   assert.equal(wb.questions.length,['c22-s61-u01','c22-s61-u02','c22-s61-u03','c22-s61-u04'].includes(unit)?128:['c22-s52-u03','c22-s52-u04'].includes(unit)?112:unit==='c22-s52-u02'?104:['c22-s51-u04','c22-s52-u01'].includes(unit)?96:80);assert.equal(new Set(wb.questions.map(q=>unit==='c22-s61-u04'?q.bookResponseForm:q.form)).size,8);
   assert.deepEqual([...html.student.matchAll(/<section class="ed-note"(?: data-note-role="(?:summary|extension|personal|teacher|other)")?><h3>(.*?)<\/h3>/g)].map(m=>m[1]),wb.pages.flatMap(()=>['핵심 정리','더 알아보기','내가 정리할 것']));
  }
 });
 test(`${unit}: 웹 교재와 A4는 같은 문항·본문을 사용하며 기존 수업 계획은 보존한다`,async()=>{
  const original=await import(`../data/book/${unit}.book.js`);
  const merged=await revisedTextbook(unit,original);
  assert.equal(merged.plan,original.plan);
  assert.deepEqual(merged.chapter.questions,wb.questions);
  assert.deepEqual(merged.chapter.pages,wb.pages);
  assert.equal(merged.chapter.revisedCurriculumWorkbook,true);
  assert.equal(merged.chapter.book,'지필드 교과 연결 사고력');
  const html=renderChapter(merged.chapter,merged.art,[],{live:true});
  assert.equal(count(html,/class="ed-question"/g),wb.questions.length);
  assert.equal(count(html,/class="ed-key"|class="ed-solution"/g),0);
 });
}
