import{priorWritingClassroom as revisedClassroom}from'./tests/ecology-writing-stage.mjs';
import test from'node:test';import assert from'node:assert/strict';import fs from'node:fs';import vm from'node:vm';
import{ECOLOGY_MATERIAL_VERSION as version,ecologyMaterialItems,withEcologyMaterialWorkbook}from'../data/book/ecology-material-context.js';
import{withThink,loadJudge}from'./think-merge.js';import{gradeDaily}from'./daily-grade.js';import{questionAtVersion,restoreDailyQuestions,restartCurrentQuestion}from'./question-revision.js';import{snapshotDailyPaper,resolveDailyPaper}from'./daily-paper-state.js';import{classify}from'./progress.js';
import{workbook,ecologyMaterialPriorWorkbook as priorWorkbook}from'../data/book/c22-s42-u02.workbook.js';import{revisedTextbook,revisedTextbookPaper}from'./revised-textbook.js';import{classroomQuestions}from'./revised-lesson.js';import{renderChapter}from'./book.js';
const url=new URL('./v2.js',import.meta.url),code=fs.readFileSync(url,'utf8'),a=code.indexOf('const UNITS = ')+14,b=code.indexOf('\n// 문제은행만',a),loaders=new vm.Script('('+code.slice(a,b).trim().replace(/;$/,'')+')',{importModuleDynamically:s=>import(new URL(s,url).href)}).runInContext(vm.createContext({withThink})),unit='c22-s42-u02',mod=await loaders[unit](),current=mod.items.find(q=>q.id===unit+'-b35'),prior=questionAtVersion(current,current.previousVersions.at(-1).version),id=unit+'-w039',food='풀 → 메뚜기 → 개구리 → 뱀 / 풀 → 애벌레 → 작은 새 → 뱀';

test('the missing food-web material is supplied while grading, diagnoses and all saved presentations retain their contracts',async()=>{
 assert.equal(current.contentVersion,version);assert.equal(current.givens.먹이그물,food);assert.equal(prior.givens.먹이그물,undefined);
 assert.deepEqual({...current,givens:prior.givens,contentVersion:prior.contentVersion,previousVersions:prior.previousVersions},prior);
 const judge=await loadJudge(unit);
 for(const typed of['',current.answerContract.sample,'작은 새가 충분한지도 살펴야 해요.','다 살아남아요.']){assert.deepEqual(gradeDaily(current,typed,{judge}),gradeDaily(prior,typed,{judge}));assert.deepEqual(classify(current,mod.misc,false,{typed}),classify(prior,mod.misc,false,{typed}));}
 for(const v of[prior.contentVersion,...prior.previousVersions.map(q=>q.version)]){
  const old=questionAtVersion(current,v),state={answers:{[current.id]:'남은 먹이의 양을 확인해요.',other:'keep'},questionVersions:v===1?{}:{[current.id]:v}},saved=structuredClone(state);
  assert.equal(old.givens.먹이그물,undefined);assert.deepEqual(restoreDailyQuestions([current],state)[0],old);
  const paper=resolveDailyPaper([current],{paper:snapshotDailyPaper([old]),answers:state.answers});assert(paper.readOnly);assert.deepEqual(paper.questions[0].givens,old.givens);
  const restarted=restartCurrentQuestion(state,current);assert.deepEqual(state,saved);assert.equal(restarted.answers.other,'keep');assert.equal(restarted.questionVersions[current.id],version);assert.equal(restarted.revisionHistory[current.id][0].answers,state.answers[current.id]);
 }
});

test('only the reviewed authored question and matching workbook page receive the existing six-relation material',()=>{
 const saved=structuredClone(prior);assert.deepEqual(ecologyMaterialItems([prior],unit)[0],current);assert.deepEqual(prior,saved);
 const rows=[current];assert.equal(ecologyMaterialItems(rows,unit),rows);assert.equal(ecologyMaterialItems(rows,'other'),rows);
 for(const fields of[{status:'source'},{sourceRef:{type:'original'}},{contentVersion:'future'},{prompt:prior.prompt+' future'},{answerContract:{...prior.answerContract,extra:true}},{givens:{text:'new material'}},{sourceContent:{blocks:[]}},{figure:'future.jpg'},{taxonomy:{...prior.taxonomy,standard:'future'}}]){const input=[{...prior,...fields}];assert.equal(ecologyMaterialItems(input,unit),input);}
 assert.equal(workbook.questions.length,80);assert.equal(workbook.pages.length,priorWorkbook.pages.length);assert.equal(workbook.figures,priorWorkbook.figures);assert.equal(workbook.teacherPages,priorWorkbook.teacherPages);assert.equal(workbook.quickPages,priorWorkbook.quickPages);
 for(let i=0;i<80;i++){const q=workbook.questions[i],old=priorWorkbook.questions[i];if(q.id!==id)assert.equal(q,old);else{assert.deepEqual(q.sourceGivens,current.givens);assert.deepEqual({...q,sourceGivens:old.sourceGivens},old);}}
 for(const group of['pages','teacherStudentPages'])for(let i=0;i<workbook[group].length;i++){const page=workbook[group][i],old=priorWorkbook[group][i];if(JSON.stringify(page)!==JSON.stringify(old)){assert(old.blocks.some(b=>b.ids?.includes(id)));assert.deepEqual(page.blocks[0],{type:'diagram',key:'ecoWeb',caption:'39번 먹이 관계 자료'});assert.deepEqual({...page,blocks:old.blocks},old);}else assert.equal(page,old);}
 assert.equal(withEcologyMaterialWorkbook(workbook),workbook);
 for(const patch of[{figures:{...priorWorkbook.figures,ecoWeb:'future'}},{questions:priorWorkbook.questions.map(q=>q.id===id?{...q,prompt:q.prompt+' future'}:q)},{pages:priorWorkbook.pages.map((p,i)=>i===35?{...p,title:'future'}:p)}]){const input={...priorWorkbook,...patch};assert.equal(withEcologyMaterialWorkbook(input),input);}
});

test('actual student and teacher workbook pages show all six food relations beside question 39, and current bank and classroom data agree',async()=>{
 const raw=await import('../data/book/'+unit+'.book.js'),cls=await revisedClassroom(unit,raw),pool=classroomQuestions(cls,[...mod.similar,...mod.items]),book=await revisedTextbook(unit,raw),paper=await revisedTextbookPaper(unit);
 assert.deepEqual(pool.find(q=>q.id===current.id),current);const selected=cls.classroomItems.find(q=>q.id===current.id);if(selected)assert.deepEqual(selected,current);
 const expected=workbook.figures.ecoWeb;
 for(const mode of['student','teacher']){
  for(const html of[paper.workbookPaper({mode}),renderChapter(book.chapter,book.art,[],{teacher:mode==='teacher',live:true})]){
   const at=html.indexOf('39번 먹이 관계 자료');assert(at>=0);assert(html.indexOf('data-question="'+id+'"',at)>at);assert(html.slice(Math.max(0,at-expected.length-100),at).includes(expected));
  }
  assert(mod.bankPaper({...mod,mode}).includes(food));
 }
 assert(!paper.workbookPaper({mode:'student'}).includes('class="ed-key"'));
 for(const text of[code,fs.readFileSync(new URL('./revised-lesson.js',import.meta.url),'utf8')])assert(text.includes('&ecology='+version));
 assert(fs.readFileSync(new URL('./index.html',import.meta.url),'utf8').includes('&ecologyMaterial='+version));
});
