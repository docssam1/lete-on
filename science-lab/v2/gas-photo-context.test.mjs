import test from'node:test';import assert from'node:assert/strict';import fs from'node:fs';import crypto from'node:crypto';import vm from'node:vm';
import{gasPhoto,GAS_PHOTO_VERSION as version,gasPhotoItems,withGasPhotoWorkbook}from'../data/book/gas-photo-context.js';
import{workbook,gasPhotoPriorWorkbook as priorWorkbook}from'../data/book/c22-s42-u03.workbook.js';
import{withThink}from'./think-merge.js';import{gradeDaily}from'./daily-grade.js';import{classify}from'./progress.js';import{questionAtVersion,restoreDailyQuestions,restartCurrentQuestion}from'./question-revision.js';import{snapshotDailyPaper,resolveDailyPaper}from'./daily-paper-state.js';
import{revisedTextbook,revisedTextbookPaper}from'./revised-textbook.js';import{revisedClassroom,classroomQuestions}from'./revised-lesson.js';import{renderChapter}from'./book.js';import{thinkingCheckQuestion}from'./thinking-check-question.js';
const unit='c22-s42-u03',url=new URL('./v2.js',import.meta.url),code=fs.readFileSync(url,'utf8'),start=code.indexOf('const UNITS = ')+14,end=code.indexOf('\n// 문제은행만',start),loaders=new vm.Script('('+code.slice(start,end).trim().replace(/;$/,'')+')',{importModuleDynamically:s=>import(new URL(s,url).href)}).runInContext(vm.createContext({withThink})),mod=await loaders[unit](),current=mod.items.find(q=>q.id===unit+'-b42'),prior=questionAtVersion(current,current.previousVersions.at(-1).version),esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

test('the gas result photograph is a verified original asset and preserves grading, diagnosis and every saved question version',()=>{
 const bytes=fs.readFileSync(new URL('../'+gasPhoto.src,import.meta.url));assert.equal(bytes.length,gasPhoto.bytes);assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),gasPhoto.sha256);assert.equal(crypto.createHash('sha1').update(bytes).digest('hex'),gasPhoto.sourceSha1);
 assert.equal(current.contentVersion,version);assert.equal(current.figure,gasPhoto.src);assert.equal(current.figureNote,gasPhoto.alt);assert.deepEqual(current.photoLabels,[gasPhoto.label]);assert.equal(current.photoCredit,gasPhoto.credit);assert.equal(prior.figure,undefined);
 for(const key of['prompt','givens','answerContract','responseContract','taxonomy','explanation','diagnosticOverride'])assert.deepEqual(current[key],prior[key]);
 for(const answer of['','온도와 바깥 압력, 공기 출입을 더 알아봐야 해요.','온도가 올라서 부풀었어요.']){assert.deepEqual(gradeDaily(current,answer),gradeDaily(prior,answer));assert.deepEqual(classify(current,mod.misc,false,{typed:answer}),classify(prior,mod.misc,false,{typed:answer}));}
 for(const v of current.previousVersions.map(q=>q.version)){
  const old=questionAtVersion(current,v);assert(old);assert.equal(old.figure,undefined);assert.equal(old.photoLabels,undefined);
  const state={answers:{[current.id]:'예전 답',other:'keep'},questionVersions:v===1?{}:{[current.id]:v}},saved=structuredClone(state);assert.deepEqual(restoreDailyQuestions([current],state),[old]);
  const paper=resolveDailyPaper([current],{...state,paper:snapshotDailyPaper([old])});assert(paper.readOnly);assert.equal(paper.questions[0].figure,undefined);assert.deepEqual(paper.questions[0].answerContract,old.answerContract);
  const restarted=restartCurrentQuestion(state,current);assert.deepEqual(state,saved);assert.equal(restarted.answers.other,'keep');assert.equal(restarted.questionVersions[current.id],version);assert.equal(restarted.revisionHistory[current.id][0].answers,'예전 답');
 }
});

test('full authored-question guards add only the missing photo while preserving future, original and already supplied material',()=>{
 const saved=structuredClone(prior);assert.deepEqual(gasPhotoItems([prior],unit)[0],current);assert.deepEqual(prior,saved);const rows=[current];assert.equal(gasPhotoItems(rows,unit),rows);assert.equal(gasPhotoItems(rows,'other'),rows);
 for(const fields of[{status:'source'},{sourceRef:{type:'original'}},{contentVersion:'future'},{prompt:prior.prompt+' future'},{givens:{text:'future material'}},{figure:'future.jpg'},{answerContract:{...prior.answerContract,extra:true}}]){const input=[{...prior,...fields}];assert.equal(gasPhotoItems(input,unit),input);}
 assert.deepEqual(withGasPhotoWorkbook(priorWorkbook),workbook);assert.equal(withGasPhotoWorkbook(workbook),workbook);assert.equal(workbook.questions.length,80);
 for(const key of['pages','teacherStudentPages','teacherPages','quickPages'])assert.equal(workbook[key],priorWorkbook[key]);
 const before=priorWorkbook.questions.find(q=>q.no===37),after=workbook.questions.find(q=>q.no===37);assert.equal(before.figure,undefined);assert.deepEqual(after,{...before,figure:'gasPhotoQuestion37'});assert.deepEqual(workbook.questions.filter((q,i)=>q!==priorWorkbook.questions[i]).map(q=>q.no),[37]);assert.deepEqual({...workbook.figures,gasPhotoQuestion37:undefined},{...priorWorkbook.figures,gasPhotoQuestion37:undefined});
 for(const fields of[{prompt:before.prompt+' future'},{sourceRef:{type:'original'}},{figure:'existing'},{responseContract:{teacherRequired:false}}]){const input={...priorWorkbook,questions:priorWorkbook.questions.map(q=>q===before?{...q,...fields}:q)};assert.equal(withGasPhotoWorkbook(input),input);}
 const existing={...priorWorkbook,figures:{...priorWorkbook.figures,gasPhotoQuestion37:'existing material'}};assert.equal(withGasPhotoWorkbook(existing),existing);
});

test('actual gas workbook, bank and classroom routes present the same result photo with captions and keep student answers hidden',async()=>{
 const raw=await import('../data/book/'+unit+'.book.js'),cls=await revisedClassroom(unit,raw),pool=classroomQuestions(cls,[...mod.similar,...mod.items]),book=await revisedTextbook(unit,raw),paper=await revisedTextbookPaper(unit);assert.deepEqual(pool.find(q=>q.id===current.id),current);assert.deepEqual(cls.classroomItems.find(q=>q.id===current.id),current);
 for(const mode of['student','teacher']){
  const printed=paper.workbookPaper({mode}),web=renderChapter(book.chapter,book.art,[],{teacher:mode==='teacher',live:true}),bank=mod.bankPaper({...mod,mode}),question=thinkingCheckQuestion(current,1,mode==='teacher');
  for(const html of[printed,web,bank,question]){assert(html.includes('../'+gasPhoto.src));assert(html.includes(esc(gasPhoto.alt)));assert(html.includes(esc(gasPhoto.label)));assert(html.includes(gasPhoto.creator));}
  for(const html of[printed,web]){const a=html.indexOf('data-question="'+unit+'-w037"');assert(a>=0);const item=html.slice(a,html.indexOf('</li>',a));assert(item.includes('../'+gasPhoto.src));assert(item.includes(gasPhoto.sourceUrl));assert.equal(item.includes('class="ed-key"'),mode==='teacher');}
  if(mode==='student'){assert(!printed.includes('class="ed-key"'));assert(!bank.includes(esc(current.answerContract.sample)));}else assert(bank.includes(esc(current.answerContract.sample)));
 }
 for(const mode of['answers','quick']){assert(!paper.workbookPaper({mode}).includes('../'+gasPhoto.src));assert(!mod.bankPaper({...mod,mode}).includes('../'+gasPhoto.src));}
 const lesson=fs.readFileSync(new URL('./revised-lesson.js',import.meta.url),'utf8'),index=fs.readFileSync(new URL('./index.html',import.meta.url),'utf8');for(const text of[code,lesson,index])assert(text.includes('&gasPhoto='+version));for(const text of[code,lesson])assert(text.includes('c22-s42-u03.editorial.js?v=20261106-gas-readable-workbook&photo='+version));
});
