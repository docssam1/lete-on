import {withElementaryReadingDirections} from '../data/book/elementary-reading-directions.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {withGrade4StudyNotes,GRADE4_STUDY_NOTE_UNITS} from '../data/book/grade4-study-notes.js';
import {workbook as water,waterStudyNotesPriorWorkbook as priorWater} from '../data/book/s41-u02.workbook.js';
import {workbook as land,landStudyNotesPriorWorkbook as priorLand} from '../data/book/s41-u03.workbook.js';
import {workbook as climate,climateStudyNotesPriorWorkbook as priorClimate} from '../data/book/c22-s42-u04.workbook.js';
import {revisedTextbookPaper} from './revised-textbook.js';
import {makeWorkbookPaper} from './revised-workbook-paper.js';

const books=[[water,priorWater,14],[land,priorLand,18],[climate,priorClimate,20]];
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function changes(old,current,path=[]){
 if(Object.is(old,current))return [];
 if(old&&current&&typeof old==='object'&&typeof current==='object'){
  assert.deepEqual(Object.keys(current),Object.keys(old),path.join('/'));
  return Object.keys(old).flatMap(key=>changes(old[key],current[key],[...path,key]));
 }
 return [path];
}

test('grade-four personal directions preserve all questions, upper learning and every other workbook field',()=>{
 assert.deepEqual(GRADE4_STUDY_NOTE_UNITS,books.map(([book])=>book.unit));
 for(const [current,prior,count]of books){
  const saved=structuredClone(prior),paths=changes(prior,current);
  assert.equal(current.questions,prior.questions);assert.equal(current.teacherPages,prior.teacherPages);assert.equal(current.quickPages,prior.quickPages);assert.equal(current.figures,prior.figures);
  assert.equal(paths.length,count*2);let students=0,teachers=0;
  for(const path of paths){
   assert.match(path.join('/'),/^(pages|teacherStudentPages)\/\d+\/rail\/\d+\/text$/);
   const note=prior[path[0]][Number(path[1])].rail[Number(path[3])];assert.equal(note.title,'내가 정리할 것');
   if(path[0]==='pages')students++;else teachers++;
  }
  assert.equal(students,count);assert.equal(teachers,count);assert.deepEqual(withGrade4StudyNotes(prior),current);assert.equal(withGrade4StudyNotes(current),current);assert.deepEqual(prior,saved);
 }
});

test('actual four paper views show the reviewed directions and keep answer views and all other HTML identical',async()=>{
 for(const [current,prior,count]of books){
  const {art}=await import(`../data/book/${current.unit}.workbook-art.js`),actual=await revisedTextbookPaper(current.unit),before=makeWorkbookPaper(withElementaryReadingDirections(prior),art),expected=makeWorkbookPaper(withElementaryReadingDirections(current),art);
  for(const mode of ['student','teacher','answers','quick']){
   const html=actual.workbookPaper({mode});assert.equal(html,expected.workbookPaper({mode}));
   if(mode==='answers'||mode==='quick')assert.equal(html,before.workbookPaper({mode}));
   else{
    let changed=0;const restored=structuredClone(current);
    for(const key of ['pages','teacherStudentPages'])for(let i=0;i<current[key].length;i++)for(let j=0;j<(current[key][i].rail||[]).length;j++){
     const note=current[key][i].rail[j],old=prior[key][i].rail[j];
     if(note.text!==old.text){assert(html.includes(escape(note.text)));restored[key][i].rail[j].text=old.text;if(key==='pages')changed++;}
    }
    assert.equal(changed,count);assert.equal(makeWorkbookPaper(withElementaryReadingDirections(restored),art).workbookPaper({mode}),before.workbookPaper({mode}));
    if(mode==='student')assert(!/class="ed-key"|class="ed-solution"/.test(html));
   }
  }
 }
});

test('note edits are limited to exact reviewed unit, role and wording without changing future or teacher material',()=>{
 assert.equal(withGrade4StudyNotes(null),null);
 for(const [current,prior]of books){
  const pageIndex=prior.pages.findIndex((p,i)=>p.rail.some((n,j)=>n.text!==current.pages[i].rail[j].text)),page=prior.pages[pageIndex],index=page.rail.findIndex((n,j)=>n.text!==current.pages[pageIndex].rail[j].text),note=page.rail[index];
  for(const title of ['핵심 정리','더 알아보기','지도 메모','constructor']){
   const input={...prior,pages:[{rail:[{...note,title}]}],teacherStudentPages:[]};assert.equal(withGrade4StudyNotes(input),input);
  }
  for(const text of ['a later reviewed direction','__proto__','constructor']){
   const input={...prior,pages:[{rail:[{...note,text}]}],teacherStudentPages:[]};assert.equal(withGrade4StudyNotes(input),input);
  }
  for(const unit of ['s31-u01','s41-u04','other','__proto__']){const input={...prior,unit};assert.equal(withGrade4StudyNotes(input),input);}
  const teacherOnly={...prior,pages:[],teacherStudentPages:[],teacherPages:[page]};assert.equal(withGrade4StudyNotes(teacherOnly),teacherOnly);
  const blanks={...prior,pages:[{kind:'duplex-blank',blocks:[],rail:[]},{kind:'duplex-blank'}],teacherStudentPages:[]};assert.equal(withGrade4StudyNotes(blanks),blanks);
 }
});
