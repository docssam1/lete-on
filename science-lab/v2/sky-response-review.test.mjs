import{reviewStudentWorkbook,reviewStudentModule}from'./student-language-review.js';
import{withElementaryReadingDirections}from'../data/book/elementary-reading-directions.js';
import{withObservedPhotoAlt}from'../data/book/observation-language.js';
import test from'node:test';import assert from'node:assert/strict';import fs from'node:fs';import vm from'node:vm';
import{SKY_RESPONSE_VERSION as version,skyResponseItems,withSkyResponseWorkbook}from'../data/book/sky-response-review.js';
import{withThink,loadJudge}from'./think-merge.js';import{gradeDaily}from'./daily-grade.js';import{questionAtVersion,restoreDailyQuestions,restartCurrentQuestion}from'./question-revision.js';import{snapshotDailyPaper,resolveDailyPaper}from'./daily-paper-state.js';import{classify}from'./progress.js';
import{workbook,skyResponsePriorWorkbook as priorWorkbook}from'../data/book/c22-s42-u01.workbook.js';import{revisedTextbook,revisedTextbookPaper}from'./revised-textbook.js';import{revisedClassroom,classroomQuestions}from'./revised-lesson.js';import{renderChapter}from'./book.js';
const url=new URL('./v2.js',import.meta.url),code=fs.readFileSync(url,'utf8'),a=code.indexOf('const UNITS = ')+14,b=code.indexOf('\n// 문제은행만',a),loaders=new vm.Script('('+code.slice(a,b).trim().replace(/;$/,'')+')',{importModuleDynamically:s=>import(new URL(s,url).href)}).runInContext(vm.createContext({withThink})),unit='c22-s42-u01',mod=await loaders[unit](),current=mod.items.find(q=>q.id===unit+'-b30'),prior=questionAtVersion(current,current.previousVersions.at(-1).version),esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

test('the simulated Moon-record criterion remains teacher-reviewed and every old response retains its exact historical contract',async()=>{
 assert.equal(current.contentVersion,version);assert.deepEqual({...current,answerContract:prior.answerContract,contentVersion:prior.contentVersion,previousVersions:prior.previousVersions},prior);
 assert.equal(current.answerContract.sample,prior.answerContract.sample);assert.equal(current.answerContract.teacherReview,true);assert(!current.answerContract.rubric.required.join(' ').includes('실제 관찰 기록'));
 const judge=await loadJudge(unit);
 for(const typed of['',current.answerContract.sample,'두 날짜는 둥글었지만 사이 기록은 없어요.','날마다 똑같았어요.']){assert.deepEqual(gradeDaily(current,typed,{judge}),gradeDaily(prior,typed,{judge}));assert.deepEqual(classify(current,mod.misc,false,{typed}),classify(prior,mod.misc,false,{typed}));}
 for(const v of[prior.contentVersion,...prior.previousVersions.map(q=>q.version)]){
  const old=questionAtVersion(current,v),state={answers:{[current.id]:'사이의 기록이 없어요.',other:'keep'},questionVersions:v===1?{}:{[current.id]:v}},saved=structuredClone(state);
  assert.deepEqual(restoreDailyQuestions([current],state)[0],old);const paper=resolveDailyPaper([current],{paper:snapshotDailyPaper([old]),answers:state.answers});assert(paper.readOnly);assert.deepEqual(paper.questions[0].answerContract,old.answerContract);
  const restarted=restartCurrentQuestion(state,current);assert.deepEqual(state,saved);assert.equal(restarted.answers.other,'keep');assert.equal(restarted.questionVersions[current.id],version);assert.equal(restarted.revisionHistory[current.id][0].answers,state.answers[current.id]);
 }
});

test('future and original questions retain their data, and only five reviewed workbook questions change their assessment fields',()=>{
 const saved=structuredClone(prior);assert.deepEqual(skyResponseItems([prior],unit)[0],current);assert.deepEqual(prior,saved);const rows=[current];assert.equal(skyResponseItems(rows,unit),rows);assert.equal(skyResponseItems(rows,'other'),rows);
 for(const fields of[{status:'source'},{sourceRef:{type:'original'}},{contentVersion:'future'},{prompt:prior.prompt+' future'},{answerContract:{...prior.answerContract,extra:true}},{givens:{text:'new material'}},{sourceContent:{blocks:[]}},{figure:'future.jpg'},{taxonomy:{...prior.taxonomy,standard:'future'}}]){const input=[{...prior,...fields}];assert.equal(skyResponseItems(input,unit),input);}
 assert.equal(workbook.questions.length,80);for(const k of['figures','teacherPages','quickPages'])assert.equal(workbook[k],priorWorkbook[k]);
 assert.deepEqual(workbook.questions.filter((q,i)=>q!==priorWorkbook.questions[i]).map(q=>q.no),[17,55,69,79,80]);
 for(let i=0;i<80;i++){const q=workbook.questions[i],old=priorWorkbook.questions[i];for(const k of Object.keys(old).filter(k=>!['prompt','answer','explanation','criteria','sourceContract'].includes(k)))assert.deepEqual(q[k],old[k]);if(![69,79].includes(q.no))assert.equal(q.prompt,old.prompt);if(![79,80].includes(q.no))assert.equal(q.answer,old.answer);}
 assert.deepEqual(workbook.questions.find(q=>q.no===17).sourceContract,current.answerContract);assert(!workbook.questions.find(q=>q.no===55).criteria.includes('안전한 계획'));assert(!workbook.questions.find(q=>q.no===80).criteria.includes('다음 확인'));
 assert.equal(withSkyResponseWorkbook(workbook),workbook);
 for(const fields of[{prompt:'future'},{sourceRef:{type:'original'}},{contentVersion:'future'},{sourceContract:{teacherRequired:false}},{given:['new material']}]){const input={...priorWorkbook,questions:priorWorkbook.questions.map(q=>({...q,...fields}))};assert.equal(withSkyResponseWorkbook(input),input);}
});

test('current workbook, bank and classroom routes display the same criterion and identify the bowl pointer stars without exposing student answers',async()=>{
 const raw=await import('../data/book/'+unit+'.book.js'),cls=await revisedClassroom(unit,raw),pool=classroomQuestions(cls,[...mod.similar,...mod.items]),book=await revisedTextbook(unit,raw),paper=await revisedTextbookPaper(unit);
 const reviewed=await reviewStudentModule(unit,mod),present=reviewed.items.find(q=>q.id===current.id),now=await reviewStudentWorkbook(unit,withObservedPhotoAlt(withElementaryReadingDirections(workbook)));assert.deepEqual(pool.find(q=>q.id===current.id),present);const selected=cls.classroomItems.find(q=>q.id===current.id);if(selected)assert.deepEqual(selected,present);
 const pointer=now.questions.find(q=>q.no===79);assert(pointer.prompt.includes('국자 그릇의 바깥쪽 두 별'));assert(pointer.answer.includes('국자 입구 쪽'));
 for(const mode of['student','teacher'])for(const html of[paper.workbookPaper({mode}),renderChapter(book.chapter,book.art,[],{teacher:mode==='teacher',live:true})]){assert(html.includes(esc(pointer.prompt)));if(mode==='student'){assert(!html.includes('class="ed-key"'));assert(!html.includes(esc(now.questions.find(q=>q.no===55).criteria)));}else{assert(html.includes(esc(pointer.criteria)));assert(html.includes(esc(now.questions.find(q=>q.no===17).criteria)));}}
 for(const text of[code,fs.readFileSync(new URL('./revised-lesson.js',import.meta.url),'utf8')])assert(text.includes('&sky='+version));assert(fs.readFileSync(new URL('./index.html',import.meta.url),'utf8').includes('&skyResponse='+version));
});
