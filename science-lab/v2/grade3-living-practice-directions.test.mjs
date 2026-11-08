import test from 'node:test';
import assert from 'node:assert/strict';
import {workbook as animal,animalPracticePriorWorkbook as priorAnimal} from '../data/book/s31-u02.workbook.js';
import {workbook as plant,plantPracticePriorWorkbook as priorPlant} from '../data/book/s31-u03.workbook.js';
import {workbook as force,forceElementaryPriorWorkbook as priorForce} from '../data/book/s31-u01.workbook.js';
import {withGrade3LivingPracticeDirections} from '../data/book/s31-living-practice-directions.js';
import {withForceElementaryWorkbook} from '../data/book/s31-u01.elementary.js';
import {withGrade3StudyNotes} from '../data/book/grade3-study-notes.js';
import {revisedTextbookPaper} from './revised-textbook.js';

const books=[[animal,priorAnimal,31,withGrade3LivingPracticeDirections],[plant,priorPlant,32,withGrade3LivingPracticeDirections],[force,priorForce,25,withForceElementaryWorkbook]];
const withoutPrompt=q=>Object.fromEntries(Object.entries(q).filter(([key])=>key!=='prompt'));
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

test('grade-three practice directions preserve all response fields, source-linked questions and page materials',()=>{
 for(const [current,prior,count]of books){
  assert.equal(current.questions.length,80);
  assert.deepEqual({...current,questions:null},{...withGrade3StudyNotes(prior),questions:null});
  let changed=0;
  for(let i=0;i<80;i++){
   const q=current.questions[i],old=prior.questions[i];
   assert.deepEqual(withoutPrompt(q),withoutPrompt(old),q.id+' response and materials');
   if(i<40)assert.deepEqual(q,old,q.id+' source-linked presentation');
   if(q.prompt!==old.prompt){
    changed++;assert(q.no>=41&&!q.sourceId&&!q.sourceRef);
    assert.equal((q.prompt.match(/\[\s*\]/g)||[]).length,(old.prompt.match(/\[\s*\]/g)||[]).length,q.id+' blank count');
   }
  }
  assert.equal(changed,count);
  assert.deepEqual(new Set(current.questions.map(q=>q.form)),new Set(['choice','multi','blank','short','written','match','order','draw']));
 }
});

test('the actual four-mode textbook renderer uses the current elementary directions without leaking student keys',async()=>{
 for(const [current]of books){
  const paper=await revisedTextbookPaper(current.unit);
  for(const mode of ['student','teacher','answers','quick']){
   const html=paper.workbookPaper({mode});assert(!/undefined|\[object Object\]/.test(html));
   if(mode==='student'||mode==='teacher')for(const q of current.questions)for(const text of q.prompt.split(/\[\s*\]/).filter(Boolean))assert(html.includes(escape(text)),q.id+' '+mode);
   if(mode==='student')assert(!/class="ed-key"|class="ed-solution"/.test(html));
   if(mode==='teacher')assert.equal((html.match(/class="ed-key"/g)||[]).length,80);
  }
 }
});

test('the direction overlay never mutates prior books or overwrites source, unknown or versioned presentations',()=>{
 for(const [current,prior,,apply]of books){
  const saved=structuredClone(prior);assert.deepEqual(withGrade3StudyNotes(apply(prior)),current);assert.deepEqual(prior,saved);
  assert.equal(apply(current),current);
  const target=prior.questions.find(q=>q.prompt!==current.questions.find(c=>c.id===q.id).prompt);
  for(const row of [{...target,sourceId:'protected'},{...target,sourceRef:{type:'original'}},{...target,sourceRef:{type:'similar'}},{...target,contentVersion:'future'},{...target,id:'unknown'},{...target,prompt:'a later reviewed direction'}]){
   const book={...prior,questions:[row]};assert.equal(apply(book),book);
  }
  const unsupported={...prior,unit:'other-unit'};assert.equal(apply(unsupported),unsupported);
 }
});
