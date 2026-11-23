import test from'node:test';
import assert from'node:assert/strict';
import fs from'node:fs';
import vm from'node:vm';
import{withThink,loadJudge}from'./think-merge.js';
import{workbook}from'../data/book/s31-u01.workbook.js';
import{review}from'../data/language/s31-u01.js';
import{withElementaryReadingDirections}from'../data/book/elementary-reading-directions.js';
import{withObservedPhotoAlt}from'../data/book/observation-language.js';
import{reviewStudentModule,reviewStudentWorkbook,reviewQuestionRows,reviewTextTree,reviewWorkbookTableText}from'./student-language-review.js';
import{withForceDrawingWorkbook}from'./force-drawing-review.js';
import{forceGuidedItems,withForceGuidedWorkbook,FORCE_GUIDED_VERSION as version}from'./force-guided-review.js';
import{questionAtVersion,questionVersion,restoreDailyQuestions}from'./question-revision.js';
import{snapshotDailyPaper,resolveDailyPaper}from'./daily-paper-state.js';
import{gradeDaily}from'./daily-grade.js';
import{revisedTextbookPaper}from'./revised-textbook.js';
import{revisedClassroom,classroomQuestions}from'./revised-lesson.js';
const unit=workbook.unit,entry=new URL('./v2.js',import.meta.url),code=fs.readFileSync(entry,'utf8'),a=code.indexOf('const UNITS = ')+14,b=code.indexOf('\n// 문제은행만',a);
const loaders=new vm.Script('('+code.slice(a,b).trim().replace(/;$/,'')+')',{importModuleDynamically:s=>import(new URL(s,entry).href)}).runInContext(vm.createContext({withThink}));
const raw=await loaders[unit](),bank=await reviewStudentModule(unit,raw),priorBank=[...reviewQuestionRows(raw.similar,review),...reviewQuestionRows(raw.items,review)],current=[...bank.similar,...bank.items];
const before=withForceDrawingWorkbook(reviewWorkbookTableText(reviewTextTree(withObservedPhotoAlt(withElementaryReadingDirections(workbook)),review.text),review)),next=withForceGuidedWorkbook(before),nos=[35,36,37,38,39,40,63,64,76,78,80],plain=x=>JSON.parse(JSON.stringify(x)),normalized=q=>({...q,contentVersion:questionVersion(q)});
test('six guided bank responses require teacher review and restore every complete prior presentation',async()=>{
 assert.equal(bank.source,raw.source);assert.equal(current.length,priorBank.length);assert.equal(current.filter(q=>q.contentVersion===version).length,6);
 const judge=await loadJudge(unit);
 for(let i=0;i<current.length;i++){
  const q=current[i],old=priorBank[i];
  if(q.contentVersion!==version){assert.deepEqual(q,old);continue;}
  assert.equal(q.sourceRef,old.sourceRef);assert.equal(q.taxonomy,old.taxonomy);assert.equal(q.responseContract,old.responseContract);assert.equal(q.givens,old.givens);
  assert(q.answerContract.reviewRequired);assert(q.answerContract.rubric.required.length<=2);
  for(const v of new Set([questionVersion(old),...(old.previousVersions||[]).map(p=>p.version)])){
   const expected=normalized(questionAtVersion(old,v)),state={answers:{[q.id]:'내가 쓴 옛 답'},questionVersions:{[q.id]:v}},saved=plain(state);
   assert.deepEqual(normalized(questionAtVersion(q,v)),expected);assert.deepEqual(normalized(restoreDailyQuestions([q],state)[0]),expected);assert.deepEqual(state,saved);
  }
  const frozen=resolveDailyPaper([q],{paper:snapshotDailyPaper([old]),answers:{[q.id]:'내 답'}});assert(frozen.readOnly);assert.deepEqual(frozen.questions,[old]);
  assert.equal(gradeDaily(q,'',{judge}).status,'blank');for(const value of[q.answerContract.sample,'다른 알맞은 예','모르겠어요.'])assert.equal(gradeDaily(q,value,{judge}).status,'review');
  assert.equal(forceGuidedItems([q],unit)[0],q);
  for(const patch of[{status:'source'},{sourceRef:{type:'original'}},{prompt:old.prompt+' future'},{futureField:true},{answerContract:{...old.answerContract,future:true}}]){const future={...old,...patch};assert.equal(forceGuidedItems([future],unit)[0],future);}
 }
 assert.equal(forceGuidedItems(priorBank,'other'),priorBank);
});
test('eleven tasks keep the same scientific data and standards with short response steps and no additional drawing essays',async()=>{
 const saved=plain(before);assert.equal(next.questions.length,80);assert.deepEqual(next.questions.filter((q,i)=>q!==before.questions[i]).map(q=>q.no),nos);
 assert.deepEqual(Object.keys(next.figures),[...Object.keys(before.figures),'force-guided-level-comparison']);for(const [key,value]of Object.entries(before.figures))assert.equal(next.figures[key],value);assert.equal(next.teacherPages,before.teacherPages);assert.equal(next.pages.length,51);
 assert.deepEqual(next.pages.flatMap(p=>p.blocks.flatMap(b=>b.ids||[])),before.pages.flatMap(p=>p.blocks.flatMap(b=>b.ids||[])));
 for(let i=0;i<80;i++){
  const q=next.questions[i],old=before.questions[i];for(const k of['id','no','form','standard','sourceId','sourceRef','sourceGivens','drawing','responseContract'])assert.equal(q[k],old[k]);if(q.no===63)assert.equal(q.figure,'force-guided-level-comparison');else assert.equal(q.figure,old.figure);
  if(!nos.includes(q.no)){assert.equal(q,old);continue;}
  if(q.form==='written'){assert(q.lines<=2);if(q.parts){assert.equal(q.parts.length,2);assert(q.answerPerPart);}else assert([35,40].includes(q.no));}
  else{assert.equal(q.drawingExplanationLines,0);assert(!/적으|설명하|계획을/.test(q.prompt));}
  if(q.sourceId){const pair=current.find(b=>b.id===q.sourceId);assert.equal(q.answer,pair.answerContract.sample);assert.deepEqual(q.sourceContract,pair.answerContract);assert.equal([q.prompt,...(q.parts||[])].join('\n'),pair.prompt);}
 }
 // Solve the supplied comparison data, independently of answer text.
 const weight=current.find(q=>q.id==='s31-u01-v050').givens['모형 기록'].map(s=>Number(s.match(/\d+/)[0]));assert.deepEqual(weight,[60,30]);assert(weight[0]>weight[1]);assert(next.questions[37].answer.includes('왼쪽'));
 const rows=[...next.figures['model-results'].matchAll(/<tr><th scope="row">([^<]+)<\/th>([\s\S]*?)<\/tr>/g)].map(m=>({symbol:m[1],cells:[...m[2].matchAll(/<td>([^<]+)<\/td>/g)].map(x=>x[1])}));
 const derived=[...next.figures['force-guided-level-comparison'].matchAll(/<tr><th scope="row">([^<]+)<\/th>([\s\S]*?)<\/tr>/g)].map(m=>({symbol:m[1],cells:[...m[2].matchAll(/<td>([^<]+)<\/td>/g)].map(x=>x[1])}));assert.deepEqual(derived,rows.filter(r=>['㉡','㉢'].includes(r.symbol)).map(r=>({symbol:r.symbol,cells:[r.cells[0].replace('물체 ','')+' · '+r.cells[1],r.cells[2].replace('물체 ','')+' · '+r.cells[3],'수평']})));
 const equalWeight=rows.filter(r=>r.cells[1]===r.cells[3]&&r.cells[4]==='수평을 이룬다').map(r=>r.symbol);assert.deepEqual(equalWeight,['㉢']);assert(next.questions[62].answer.includes('㉢'));
 for(const no of[76,80])assert.equal(next.questions[no-1].drawingPanels,2);
 for(const p of next.pages.filter(p=>p.blocks.some(b=>(b.ids||[]).some(id=>nos.map(n=>unit+'-w'+String(n).padStart(3,'0')).includes(id)))))assert(!('write'in p.rail[2]));
 assert.deepEqual(before,saved);assert.equal(withForceGuidedWorkbook(next),next);
 for(const future of[{...before,unit:'other'},{...before,futureEdition:true},{...before,questions:before.questions.map(q=>q.no===63?{...q,prompt:q.prompt+' new'}:q)}])assert.equal(withForceGuidedWorkbook(future),future);
});
test('the actual classroom, student, answer and quick papers display the revised task and retain their boundaries',async()=>{
 assert.deepEqual(await reviewStudentWorkbook(unit,withObservedPhotoAlt(withElementaryReadingDirections(workbook))),next);
 const lesson=await revisedClassroom(unit,await import('../data/book/s31-u01.book.js')),selected=lesson.classroomItems.filter(q=>q.contentVersion===version);assert.deepEqual(selected.map(q=>q.id),['s31-u01-v009']);
 const q=selected[0],old=questionAtVersion(q,1);assert(old.prompt.includes('다음 번'));assert.equal(q.answerContract.sample,next.questions[34].answer);assert.equal(q.prompt,next.questions[34].prompt);
 const pool=classroomQuestions(lesson,[...bank.items,...bank.similar,...bank.source]);assert.equal(pool.find(p=>p.id===q.id),q);
 const{workbookPaper}=await revisedTextbookPaper(unit),html=Object.fromEntries(['student','teacher','answers','quick'].map(mode=>[mode,workbookPaper({mode})]));
 assert.equal((html.student.match(/data-question=/g)||[]).length,80);assert.equal((html.teacher.match(/data-question=/g)||[]).length,80);assert(!/class="ed-key"|data-solution=/.test(html.student));
 for(const no of nos){
  const q=next.questions[no-1],start=html.student.indexOf('data-question="'+q.id+'"'),card=html.student.slice(start,html.student.indexOf('</li>',start));assert(card.includes(q.prompt));
  if(q.parts)assert.equal((card.match(/ed-part-response/g)||[]).length,2);if(q.form==='draw')assert(!card.includes('ed-lines'));
  for(const k of['answer','explanation','criteria'])assert(html.answers.includes(q[k]),q.id+' '+k);
 }
 assert(html.quick.includes('서술 · 같은 무게인 물체 찾기'));assert(html.quick.includes('그림으로 나타내기 · 짐의 무게와 드는 힘'));assert(html.quick.includes('그림으로 나타내기 · 상자를 올리는 두 방법'));
});
