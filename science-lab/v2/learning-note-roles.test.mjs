import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';
import {revisedTextbookUnits,revisedTextbookPaper} from './revised-textbook.js';
import {THINKING_BOOK,isCurrentLearningUnit,learningBookName,withLearningIdentity,teacherProblemPages,learningNoteRole} from './revised-learning-book.js';
import {renderEditorialChapter} from './revised-book-editorial.js';
import {makeWorkbookPaper} from './revised-workbook-paper.js';
import {withGrade3StudyNotes} from '../data/book/grade3-study-notes.js';
import {workbook as force,forceStudyNotesPriorWorkbook as priorForce} from '../data/book/s31-u01.workbook.js';
import {workbook as animal,animalStudyNotesPriorWorkbook as priorAnimal} from '../data/book/s31-u02.workbook.js';
import {workbook as plant,plantStudyNotesPriorWorkbook as priorPlant} from '../data/book/s31-u03.workbook.js';
import {workbook as life,lifeStudyNotesPriorWorkbook as priorLife} from '../data/book/s31-u04.workbook.js';
import {workbook as material,materialStudyNotesPriorWorkbook as priorMaterial} from '../data/book/c22-s32-u01.workbook.js';
import {workbook as earthSea,earthSeaStudyNotesPriorWorkbook as priorEarthSea} from '../data/book/c22-s32-u02.workbook.js';
import {workbook as sound,soundStudyNotesPriorWorkbook as priorSound} from '../data/book/c22-s32-u03.workbook.js';
import {workbook as infection,infectionStudyNotesPriorWorkbook as priorInfection} from '../data/book/c22-s32-u04.workbook.js';
const roles={'핵심 정리':'summary','더 알아보기':'extension','내가 정리할 것':'personal','지도 메모':'teacher'};
const notes=html=>[...html.matchAll(/<section class="ed-note(?: ed-teacher-note)?"(?: data-note-role="([^"]+)")?><h3>(.*?)<\/h3>/g)].map(m=>({role:m[1]||'',title:m[2]}));
const studyBooks=[[force,priorForce],[animal,priorAnimal],[plant,priorPlant],[life,priorLife],[material,priorMaterial],[earthSea,priorEarthSea],[sound,priorSound],[infection,priorInfection]];
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function changedPaths(old,current,path=[]){
 if(Object.is(old,current))return [];
 if(old&&current&&typeof old==='object'&&typeof current==='object'){
  assert.deepEqual(Object.keys(current),Object.keys(old),path.join('/')+' keys');
  return Object.keys(old).flatMap(key=>changedPaths(old[key],current[key],[...path,key]));
 }
 return [path];
}

test('the learning identity and note-role policy cover every one of the 32 current workbooks',()=>{
 assert.equal(revisedTextbookUnits.size,32);
 for(const unit of revisedTextbookUnits){
  assert(isCurrentLearningUnit(unit),unit);assert.equal(learningBookName(unit,'old label'),THINKING_BOOK);
  const old={chapter:{thinkWorkbook:true,book:'old label',unit}},next=withLearningIdentity(old,unit);assert.equal(next.chapter.book,THINKING_BOOK);assert.equal(old.chapter.book,'old label');
  for(const[title,role]of Object.entries(roles))assert.equal(learningNoteRole(old.chapter,title),role);for(const title of ['constructor','toString','__proto__','extra'])assert.equal(learningNoteRole(old.chapter,title),'other');
 }
 for(const unit of ['c22-s62-u01','c22-s62-u02','c22-s62-u03','c22-s62-u04']){
  const pages=[{layout:'same'}],before=structuredClone(pages),prepared=teacherProblemPages(pages,null,unit);assert.equal(prepared.length,2);assert.deepEqual(prepared[1],{kind:'duplex-blank',layout:'same'});assert.deepEqual(pages,before);assert.equal(teacherProblemPages(prepared,prepared,unit),prepared);
 }
 const legacy={chapter:{thinkWorkbook:true,book:'legacy',unit:'s42-u01'}};assert.equal(withLearningIdentity(legacy,'s42-u01'),legacy);assert.equal(learningBookName('s42-u01','legacy'),'legacy');assert.equal(learningNoteRole(legacy.chapter,'지도 메모'),'');
});

test('actual student, teacher, answers and quick HTML consistently distinguish personal and teacher notes',async()=>{
 let papers=0,personalTeacherNotes=0,teacherNotes=0;
 for(const unit of revisedTextbookUnits){
  const paper=await revisedTextbookPaper(unit);
  for(const mode of ['student','teacher','answers','quick']){
   const html=paper.workbookPaper({mode}),list=notes(html);assert(list.length>0,unit+' '+mode);papers++;
   for(const note of list)assert.equal(note.role,roles[note.title]||'other',unit+' '+mode+' '+note.title);
   if(mode==='teacher'){personalTeacherNotes+=list.filter(n=>n.role==='personal').length;teacherNotes+=list.filter(n=>n.role==='teacher').length;}
   if(mode==='student')assert(!list.some(n=>n.role==='teacher'));
  }
 }
 assert.equal(papers,128);assert(personalTeacherNotes>0);assert(teacherNotes>0);
});

test('an extra note or appended teacher memo cannot take the personal heading typeface; legacy markup stays unmarked',()=>{
 const page={kind:'concept',section:'same',title:'same',blocks:[{type:'text',text:'unchanged body'}],rail:[{title:'핵심 정리',text:'core'},{title:'더 알아보기',text:'extension'},{title:'내가 정리할 것',write:3},{title:'추가 힌트',text:'extra'}],teacherNote:'teacher body'};
 const chapter={thinkWorkbook:true,unit:'c22-s62-u03',book:THINKING_BOOK,no:1,title:'same',semester:'6-2',theme:'#2f6b4a',questions:[],teacherPages:[],pages:[page]},before=structuredClone(chapter);
 assert.deepEqual(notes(renderEditorialChapter(chapter,{}, {teacher:true})).map(n=>n.role),['summary','extension','personal','other','teacher']);
 assert.deepEqual(notes(renderEditorialChapter(chapter,{}, {teacher:false})).map(n=>n.role),['summary','extension','personal','other']);assert.deepEqual(chapter,before);
 const legacy=renderEditorialChapter({...chapter,unit:'s42-u01'}, {},{teacher:true});assert(!legacy.includes('data-note-role='));assert(legacy.includes('teacher body'));
 // These are declared CSS policies, not a claim that browser layout has been exercised.
 const css=fs.readFileSync(new URL('./revised-workbook.css',import.meta.url),'utf8'),normal='.bk-editorial.revised-workbook[data-unit] .ed-note[data-note-role] h3{font-family:var(--ed-reading)',personal='.bk-editorial.revised-workbook[data-unit] .ed-note[data-note-role="personal"] h3{font-family:var(--ed-hand)';assert(css.includes(normal));assert(css.includes(personal));assert(css.indexOf(normal)>css.indexOf('.ed-note:last-child h3'));assert(css.indexOf(personal)>css.indexOf(normal));
});

test('grade-three study notes preserve every question, extension concept, writing space and teacher answer page',()=>{
 let noteChanges=0,exampleChanges=0;
 for(const [current,prior]of studyBooks){
  const saved=structuredClone(prior);assert.equal(current.questions,prior.questions);assert.equal(current.teacherPages,prior.teacherPages);
  const paths=changedPaths(prior,current);assert(paths.length>0);
  for(const path of paths){
   const key=path.join('/');
   if(/^(pages|teacherStudentPages)\/\d+\/rail\/\d+\/text$/.test(key)){
    const note=prior[path[0]][Number(path[1])].rail[Number(path[3])];
    assert(['핵심 정리','내가 정리할 것'].includes(note.title));noteChanges++;
   }else{
    assert.equal(current.unit,'s31-u03');assert(/^pages\/4\/blocks\/(1\/steps\/2\/[01]|1\/answer|2\/(title|hint))$/.test(key),key);exampleChanges++;
   }
  }
  assert.deepEqual(withGrade3StudyNotes(prior),current);assert.deepEqual(prior,saved);assert.equal(withGrade3StudyNotes(current),current);
  const oldPersonal=prior.pages.flatMap(p=>p.rail||[]).find(n=>n.title==='내가 정리할 것');
  const future={...prior,pages:[{rail:[{title:'더 알아보기',text:oldPersonal.text},{title:'constructor',text:'name'},{title:oldPersonal.title,text:'a later reviewed note'}]}],teacherStudentPages:[]};
  assert.equal(withGrade3StudyNotes(future),future);
  const unsupported={...prior,unit:'other-unit'};assert.equal(withGrade3StudyNotes(unsupported),unsupported);
 }
 assert(noteChanges>0);assert.equal(exampleChanges,5);
 const futureExample={...priorPlant,pages:[{},{},{},{},{...priorPlant.pages[4],rail:[],blocks:priorPlant.pages[4].blocks.map((b,i)=>i===1?{...b,answer:'a later reviewed explanation'}:b)}],teacherStudentPages:[]};
 assert.equal(withGrade3StudyNotes(futureExample),futureExample);
});

test('actual grade-three papers display the simpler notes while answer and quick views stay identical',async()=>{
 for(const [current,prior]of studyBooks){
  const {art}=await import(`../data/book/${current.unit}.workbook-art.js`),paper=await revisedTextbookPaper(current.unit),oldPaper=makeWorkbookPaper(prior,art);
  for(const mode of ['student','teacher','answers','quick']){
   const html=paper.workbookPaper({mode});
   if(mode==='answers'||mode==='quick')assert(html===oldPaper.workbookPaper({mode}),current.unit+' '+mode+' unchanged');
   else{
    for(let i=0;i<current.pages.length;i++)for(let j=0;j<(current.pages[i].rail||[]).length;j++){
     const note=current.pages[i].rail[j],old=prior.pages[i].rail[j];if(note.text!==old.text)assert(html.includes(escape(note.text)),current.unit+' '+mode+' current note');
    }
   }
  }
 }
});
