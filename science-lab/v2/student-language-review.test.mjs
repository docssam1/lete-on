import test from'node:test';import assert from'node:assert/strict';import fs from'node:fs';import vm from'node:vm';
import{SEMS_2022,contentId2022,assessmentsFor2022}from'./curriculum-2022.js';import{BANK}from'./units-index.js';import{withThink}from'./think-merge.js';
import{reviewStudentModule,reviewStudentWorkbook,reviewQuestionRows,reviewPaperText,STUDENT_LANGUAGE_VERSION as version}from'./student-language-review.js';
import{questionVersion,questionAtVersion,restoreDailyQuestions,questionMisconceptions}from'./question-revision.js';import{snapshotDailyPaper,resolveDailyPaper}from'./daily-paper-state.js';import{gradeDaily}from'./daily-grade.js';
import{withObservedPhotoAlt}from'../data/book/observation-language.js';import{withElementaryReadingDirections}from'../data/book/elementary-reading-directions.js';import{revisedClassroom,classroomQuestions}from'./revised-lesson.js';
const entry=new URL('./v2.js',import.meta.url),code=fs.readFileSync(entry,'utf8'),a=code.indexOf('const UNITS = ')+14,b=code.indexOf('\n// 문제은행만',a),loaders=new vm.Script('('+code.slice(a,b).trim().replace(/;$/,'')+')',{importModuleDynamically:s=>import(new URL(s,entry).href)}).runInContext(vm.createContext({withThink}));
const ids=SEMS_2022.flatMap(s=>s.units.map(u=>contentId2022(u.position))),assessmentIds=[...new Set([...SEMS_2022.flatMap(s=>assessmentsFor2022(s.sem,BANK).map(x=>x.contentId)),...Object.keys(BANK).filter(x=>/^(?:c22-)?s\d\d-(mid|fin)$/.test(x))])];
const load=async id=>loaders[id]?loaders[id]():{...(await import('../data/units/'+id+'.js')),...(await import('../data/units/'+id+'.similar.js')),...(BANK[id]?.authored&&!BANK[id]?.mixedSourceAssessment?{source:[]}:await import('../data/units/'+id+'.source.js'))},plain=x=>x===undefined?undefined:JSON.parse(JSON.stringify(x));

test('all 32 units and every registered assessment retain source questions, keys, grading, diagnoses and complete old presentations',async()=>{
 let changed=0,sources=0;
 for(const unit of [...ids,...assessmentIds]){const before=await load(unit),saved=plain({items:before.items,source:before.source,similar:before.similar}),after=await reviewStudentModule(unit,before);
  for(const field of ['items','source','similar'])for(let i=0;i<(before[field]||[]).length;i++){
   const old=before[field][i],q=after[field][i];assert.equal(q.id,old.id);assert.deepEqual(q.answerContract,old.answerContract);assert.deepEqual(q.responseContract,old.responseContract);assert.deepEqual(q.sourceRef,old.sourceRef);assert.deepEqual(q.taxonomy,old.taxonomy);
   if(old.sourceRef.type==='original'){assert.equal(q,old);sources++;}
   if(q===old)continue;changed++;assert.equal(q.contentVersion,version);assert.deepEqual(plain(questionMisconceptions(q,before.misc)),plain(questionMisconceptions(old,before.misc)));
   const restored=questionAtVersion(q,questionVersion(old));assert.deepEqual(restored,{...plain(old),contentVersion:questionVersion(old)});
   const value=old.answerContract.answers??old.answerContract.sample??old.answerContract.answer;
   for(const response of [value,''])assert.equal(gradeDaily(q,response,{misc:before.misc}).status,gradeDaily(old,response,{misc:before.misc}).status,unit+' '+q.id);
   const state={answers:{[q.id]:value},questionVersions:{[q.id]:questionVersion(old)}};assert.deepEqual(restoreDailyQuestions([q],state),[restored]);const frozen=resolveDailyPaper([q],{paper:snapshotDailyPaper([old]),answers:state.answers});assert(frozen.readOnly);assert.deepEqual(plain(frozen.questions),[plain(old)]);
  }
  assert.deepEqual(plain({items:before.items,source:before.source,similar:before.similar}),saved);
 }
 assert(changed>250);assert(sources>=1763);
});

test('all 3080 workbook questions retain answer words, response parts, figures and references while reviewed captions and stems use ordinary school language',async()=>{
 let questions=0,changedBooks=0;
 for(const unit of ids){const {workbook:raw}=await import('../data/book/'+unit+'.workbook.js'),before=withObservedPhotoAlt(withElementaryReadingDirections(raw)),saved=plain(before),after=await reviewStudentWorkbook(unit,before);questions+=before.questions.length;if(after!==before)changedBooks++;
  assert.deepEqual(after.figures,before.figures);assert.equal(after.questions.length,before.questions.length);
  for(let i=0;i<before.questions.length;i++){const q=before.questions[i],n=after.questions[i];for(const k of ['id','answer','answerContract','responseContract','sourceRef','taxonomy','figure','no','section','standard'])assert.deepEqual(n[k],q[k],unit+' '+q.id+' '+k);}
  assert.deepEqual(plain(before),saved);assert.deepEqual(await reviewStudentWorkbook(unit,after),after);
 }
 assert.equal(questions,3080);assert(changedBooks>=20);
 const {workbook}=await import('../data/book/c22-s52-u02.workbook.js'),w=await reviewStudentWorkbook(workbook.unit,workbook);assert(!w.questions.find(q=>q.no===10).prompt.includes('가상'));
});

test('the live module, classroom question pool and paper share the revised wording; missing photos are replaced by an explicit observation record',async()=>{
 const unit='c22-s42-fin',before=await load(unit),after=await reviewStudentModule(unit,before),id=unit+'-f1-03',q=after.items.find(q=>q.id===id);assert(q.prompt.includes('관찰한 기록'));assert(!q.prompt.includes('사진'));assert(after.bankPaper({...after,mode:'student'}).includes(q.prompt));assert(!after.bankPaper({...after,mode:'student'}).includes(q.explanation));
 const u='c22-s42-u03',mod=await reviewStudentModule(u,await load(u)),chapter=await revisedClassroom(u,await import('../data/book/'+u+'.book.js')),pool=classroomQuestions(chapter,[...mod.items,...mod.source,...mod.similar]);for(const q of mod.items.filter(q=>q.contentVersion===version))assert.equal(pool.find(p=>p.id===q.id),q);
 const review=(await import('../data/language/'+unit+'.js')).review,old=before.items.find(q=>q.id===id),future={...old,futureMetadata:true};assert.equal(reviewQuestionRows([future],review)[0],future);assert.equal(reviewQuestionRows(after.items,review),after.items);
 assert(code.includes('reviewStudentModule(u,await load())'));assert(code.includes('const m=await reviewStudentModule(u,raw)'));assert(code.includes('student-language-review.js?v='+version));
});

test('paper edits replace exact escaped prose without executing HTML and preserve unrelated text',()=>{
 const review={text:{'원래 <그림>':'새 <그림>'},questions:{}};assert.equal(reviewPaperText('<p>원래 &lt;그림&gt;</p><p>다른 글</p>',review),'<p>새 &lt;그림&gt;</p><p>다른 글</p>');assert.equal(reviewPaperText('<p>원래와 다른 그림</p>',review),'<p>원래와 다른 그림</p>');
});
