import{withObservedPhotoAlt}from'../data/book/observation-language.js';
import{reviewStudentWorkbook,reviewTextTree}from'./student-language-review.js';
const unitForLanguage=w=>w.unit;
import{withEnergyContextWorkbook}from'../data/book/energy-workbook-context.js';
import{withHeatContextWorkbook}from'../data/book/heat-workbook-context.js';
import{withWeatherContextWorkbook}from'../data/book/weather-workbook-context.js';
import{withMixtureContextWorkbook}from'../data/book/mixture-workbook-context.js';
import{withBodyContextWorkbook}from'../data/book/body-workbook-context.js';
import{withSolutionContextWorkbook}from'../data/book/solution-workbook-context.js';
import{withLightContextWorkbook}from'../data/book/light-workbook-context.js';
import{withGeologyResponseWorkbook}from'../data/book/geology-response-review.js';
import{withRepresentationReviewedWorkbook}from'../data/book/representation-question-review.js';
import{withMaterialReadingWorkbook}from'../data/book/material-reading-criteria.js';
import{withGrade5ReviewedWorkbook}from'../data/book/grade5-question-review.js';
import{withReviewedWorkbookCriteria}from'../data/book/reviewed-question-criteria.js';
import{withGeologyStandaloneContext}from'../data/book/standalone-question-context.js';
import {withElementaryReadingDirections} from '../data/book/elementary-reading-directions.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
import {withGrade5StudyNotes,GRADE5_STUDY_NOTE_UNITS} from '../data/book/grade5-study-notes.js';
import {revisedTextbookPaper} from './revised-textbook.js';
import {makeWorkbookPaper} from './revised-workbook-paper.js';
const counts=[6,4,5,5,3,5,6,7],books=[];
for(const [i,unit]of GRADE5_STUDY_NOTE_UNITS.entries()){
 const {workbook,lightContextPriorWorkbook,grade5StudyNotesPriorWorkbook,geologyObservationPriorWorkbook,reviewedCriteriaPriorWorkbook,grade5ReviewPriorWorkbook}=await import(`../data/book/${unit}.workbook.js`);
 books.push([lightContextPriorWorkbook||geologyObservationPriorWorkbook||reviewedCriteriaPriorWorkbook||grade5ReviewPriorWorkbook||workbook,grade5StudyNotesPriorWorkbook,counts[i]]);
}
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function changes(old,current,path=[]){
 if(Object.is(old,current))return [];
 if(old&&current&&typeof old==='object'&&typeof current==='object'){
  assert.deepEqual(Object.keys(current),Object.keys(old),path.join('/'));
  return Object.keys(old).flatMap(key=>changes(old[key],current[key],[...path,key]));
 }
 return [path];
}

test('grade-five personal directions preserve all questions, upper learning and every other workbook field',()=>{
 assert.deepEqual(GRADE5_STUDY_NOTE_UNITS,books.map(([book])=>book.unit));
 for(const [current,prior,count]of books){
  const saved=structuredClone(prior),paths=changes(prior,current);
  assert.equal(current.questions,prior.questions);assert.equal(current.teacherPages,prior.teacherPages);assert.equal(current.quickPages,prior.quickPages);assert.equal(current.figures,prior.figures);
  assert.equal(paths.length,count*2);let students=0,teachers=0;
  for(const path of paths){
   assert.match(path.join('/'),/^(pages|teacherStudentPages)\/\d+\/rail\/\d+\/text$/);
   const note=prior[path[0]][Number(path[1])].rail[Number(path[3])];assert.equal(note.title,'내가 정리할 것');
   if(path[0]==='pages')students++;else teachers++;
  }
  assert.equal(students,count);assert.equal(teachers,count);assert.deepEqual(withGrade5StudyNotes(prior),current);assert.equal(withGrade5StudyNotes(current),current);assert.deepEqual(prior,saved);
 }
});

test('the historical note stage preserves its other HTML and all four actual views include subsequent reviewed criteria and directions',async()=>{
 for(const [current,prior,count]of books){
  const {art}=await import(`../data/book/${current.unit}.workbook-art.js`),actual=await revisedTextbookPaper(current.unit),before=makeWorkbookPaper(withRepresentationReviewedWorkbook(withMaterialReadingWorkbook(withGrade5ReviewedWorkbook(withReviewedWorkbookCriteria(withElementaryReadingDirections(withGeologyStandaloneContext(prior)))))),art),expected=makeWorkbookPaper(withRepresentationReviewedWorkbook(withMaterialReadingWorkbook(withGrade5ReviewedWorkbook(withReviewedWorkbookCriteria(withElementaryReadingDirections(withGeologyStandaloneContext(current)))))),art);
  for(const mode of ['student','teacher','answers','quick']){
   const latest=current.unit==='c22-s52-u04'?makeWorkbookPaper(await reviewStudentWorkbook(unitForLanguage(withElementaryReadingDirections(withEnergyContextWorkbook(withGrade5ReviewedWorkbook(withReviewedWorkbookCriteria(current))))),withElementaryReadingDirections(withEnergyContextWorkbook(withGrade5ReviewedWorkbook(withReviewedWorkbookCriteria(current))))),art):current.unit==='c22-s52-u02'?makeWorkbookPaper(await reviewStudentWorkbook(unitForLanguage(withElementaryReadingDirections(withHeatContextWorkbook(withGrade5ReviewedWorkbook(withReviewedWorkbookCriteria(current))))),withElementaryReadingDirections(withHeatContextWorkbook(withGrade5ReviewedWorkbook(withReviewedWorkbookCriteria(current))))),art):current.unit==='c22-s52-u03'?makeWorkbookPaper(await reviewStudentWorkbook(unitForLanguage(withElementaryReadingDirections(withWeatherContextWorkbook(withGrade5ReviewedWorkbook(withReviewedWorkbookCriteria(current))))),withElementaryReadingDirections(withWeatherContextWorkbook(withGrade5ReviewedWorkbook(withReviewedWorkbookCriteria(current))))),art):current.unit==='c22-s52-u01'?makeWorkbookPaper(await reviewStudentWorkbook(unitForLanguage(withElementaryReadingDirections(withMixtureContextWorkbook(withGrade5ReviewedWorkbook(withReviewedWorkbookCriteria(current))))),withElementaryReadingDirections(withMixtureContextWorkbook(withGrade5ReviewedWorkbook(withReviewedWorkbookCriteria(current))))),art):current.unit==='c22-s51-u04'?makeWorkbookPaper(await reviewStudentWorkbook(unitForLanguage(withElementaryReadingDirections(withBodyContextWorkbook(withRepresentationReviewedWorkbook(withGrade5ReviewedWorkbook(current))))),withElementaryReadingDirections(withBodyContextWorkbook(withRepresentationReviewedWorkbook(withGrade5ReviewedWorkbook(current))))),art):current.unit==='c22-s51-u01'?makeWorkbookPaper(await reviewStudentWorkbook(unitForLanguage(withElementaryReadingDirections(withGeologyResponseWorkbook(withMaterialReadingWorkbook(withGeologyStandaloneContext(current))))),withElementaryReadingDirections(withGeologyResponseWorkbook(withMaterialReadingWorkbook(withGeologyStandaloneContext(current))))),art):current.unit==='c22-s51-u02'?makeWorkbookPaper(await reviewStudentWorkbook(unitForLanguage(withElementaryReadingDirections(withLightContextWorkbook(current))),withElementaryReadingDirections(withLightContextWorkbook(current))),art):current.unit==='c22-s51-u03'?makeWorkbookPaper(await reviewStudentWorkbook(unitForLanguage(withElementaryReadingDirections(withSolutionContextWorkbook(withGrade5ReviewedWorkbook(current)))),withElementaryReadingDirections(withSolutionContextWorkbook(withGrade5ReviewedWorkbook(current)))),art):expected;assert.equal(actual.workbookPaper({mode}),latest.workbookPaper({mode}));const html=expected.workbookPaper({mode});
   if(mode==='answers'||mode==='quick')assert.equal(html,before.workbookPaper({mode}));
   else{
    let changed=0;const restored=structuredClone(current);
    for(const key of ['pages','teacherStudentPages'])for(let i=0;i<current[key].length;i++)for(let j=0;j<(current[key][i].rail||[]).length;j++){
     const note=current[key][i].rail[j],old=prior[key][i].rail[j];
     if(note.text!==old.text){assert(html.includes(escape(note.text)));restored[key][i].rail[j].text=old.text;if(key==='pages')changed++;}
    }
    assert.equal(changed,count);assert.equal(makeWorkbookPaper(withRepresentationReviewedWorkbook(withMaterialReadingWorkbook(withGrade5ReviewedWorkbook(withReviewedWorkbookCriteria(withElementaryReadingDirections(withGeologyStandaloneContext(restored)))))),art).workbookPaper({mode}),before.workbookPaper({mode}));
    if(mode==='student')assert(!/class="ed-key"|class="ed-solution"/.test(html));
   }
  }
 }
});

test('note edits are limited to exact reviewed unit, role and wording without changing future or teacher material',()=>{
 assert.equal(withGrade5StudyNotes(null),null);
 for(const [current,prior]of books){
  const pageIndex=prior.pages.findIndex((p,i)=>p.rail.some((n,j)=>n.text!==current.pages[i].rail[j].text)),page=prior.pages[pageIndex],index=page.rail.findIndex((n,j)=>n.text!==current.pages[pageIndex].rail[j].text),note=page.rail[index];
  for(const title of ['핵심 정리','더 알아보기','지도 메모','constructor']){
   const input={...prior,pages:[{rail:[{...note,title}]}],teacherStudentPages:[]};assert.equal(withGrade5StudyNotes(input),input);
  }
  for(const text of ['a later reviewed direction','__proto__','constructor']){
   const input={...prior,pages:[{rail:[{...note,text}]}],teacherStudentPages:[]};assert.equal(withGrade5StudyNotes(input),input);
  }
  for(const unit of ['s31-u01','s41-u04','other','__proto__']){const input={...prior,unit};assert.equal(withGrade5StudyNotes(input),input);}
  const teacherOnly={...prior,pages:[],teacherStudentPages:[],teacherPages:[page]};assert.equal(withGrade5StudyNotes(teacherOnly),teacherOnly);
  const blanks={...prior,pages:[{kind:'duplex-blank',blocks:[],rail:[]},{kind:'duplex-blank'}],teacherStudentPages:[]};assert.equal(withGrade5StudyNotes(blanks),blanks);
 }
});

// Simulate a previously cached workbook at the old URL. The actual bank entry must select the reviewed manuscript URL.
test('mixture bank print imports the reviewed personal directions even when the older workbook module is cached',async()=>{
 const url=new URL('./mixture-bank-paper.js',import.meta.url),source=await readFile(url,'utf8'),context=vm.createContext({}),[current,prior]=books[4];let oldCacheReads=0;
 async function synthetic(namespace){
  const module=new vm.SyntheticModule(Object.keys(namespace),function(){for(const [key,value]of Object.entries(namespace))this.setExport(key,value);},{context});await module.link(()=>{});return module;
 }
 const module=new vm.SourceTextModule(source,{context,identifier:url.href});
 await module.link(async spec=>{
  if(spec.startsWith('../data/book/c22-s52-u01.workbook.js')&&spec!=='../data/book/c22-s52-u01.workbook.js?v=20261115-grade5-question-review&mixtureContext=20261116-mixture-workbook-context'){oldCacheReads++;return synthetic({workbook:prior});}
  return synthetic({...await import(new URL(spec,url).href)});
 });await module.evaluate();assert.equal(oldCacheReads,0);
 const active=(await import('../data/book/c22-s52-u01.workbook.js')).workbook,paper=makeWorkbookPaper(await reviewStudentWorkbook(active.unit,withObservedPhotoAlt(withElementaryReadingDirections(active))),{}, {route:'print',toolLabel:'혼합물 문항집 고르기'});
 for(const mode of ['student','teacher','answers','quick'])assert.equal(module.namespace.mixtureBankPaperHtml({mode}),paper.workbookPaper({mode}));
 const html=module.namespace.mixtureBankPaperHtml({mode:'student'});
 assert(html.includes('같은 상태로 말려 무게를 비교해요.'));
});
