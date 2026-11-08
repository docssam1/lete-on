import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';
import {withGrade5StudyNotes,GRADE5_STUDY_NOTE_UNITS} from '../data/book/grade5-study-notes.js';
import {revisedTextbookPaper} from './revised-textbook.js';
import {makeWorkbookPaper} from './revised-workbook-paper.js';
const counts=[6,4,5,5,3,5,6,7],books=[];
for(const [i,unit]of GRADE5_STUDY_NOTE_UNITS.entries()){
 const {workbook,grade5StudyNotesPriorWorkbook}=await import(`../data/book/${unit}.workbook.js`);
 books.push([workbook,grade5StudyNotesPriorWorkbook,counts[i]]);
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

test('actual four paper views show the reviewed directions and keep answer views and all other HTML identical',async()=>{
 for(const [current,prior,count]of books){
  const {art}=await import(`../data/book/${current.unit}.workbook-art.js`),actual=await revisedTextbookPaper(current.unit),before=makeWorkbookPaper(prior,art),expected=makeWorkbookPaper(current,art);
  for(const mode of ['student','teacher','answers','quick']){
   const html=actual.workbookPaper({mode});assert.equal(html,expected.workbookPaper({mode}));
   if(mode==='answers'||mode==='quick')assert.equal(html,before.workbookPaper({mode}));
   else{
    let changed=0;const restored=structuredClone(current);
    for(const key of ['pages','teacherStudentPages'])for(let i=0;i<current[key].length;i++)for(let j=0;j<(current[key][i].rail||[]).length;j++){
     const note=current[key][i].rail[j],old=prior[key][i].rail[j];
     if(note.text!==old.text){assert(html.includes(escape(note.text)));restored[key][i].rail[j].text=old.text;if(key==='pages')changed++;}
    }
    assert.equal(changed,count);assert.equal(makeWorkbookPaper(restored,art).workbookPaper({mode}),before.workbookPaper({mode}));
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
  if(spec==='../data/book/c22-s52-u01.workbook.js?v=20261106-mixture-readable-workbook'){oldCacheReads++;return synthetic({workbook:prior});}
  return synthetic({...await import(new URL(spec,url).href)});
 });await module.evaluate();assert.equal(oldCacheReads,0);
 const paper=makeWorkbookPaper(current,{}, {route:'print',toolLabel:'혼합물 문항집 고르기'});
 for(const mode of ['student','teacher','answers','quick'])assert.equal(module.namespace.mixtureBankPaperHtml({mode}),paper.workbookPaper({mode}));
 const html=module.namespace.mixtureBankPaperHtml({mode:'student'});
 assert(html.includes('분리하기 전과 뒤의 무게를 비교할 때 확인할 조건을 쓰세요.'));
});
