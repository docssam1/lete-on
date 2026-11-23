import{beforePlantTask}from'./tests/plant-guided-stage.mjs';
import{beforeAnimalTask}from'./tests/animal-guided-stage.mjs';
import{beforeEcologyWriting}from'./tests/ecology-writing-stage.mjs';
import test from'node:test';import assert from'node:assert/strict';import fs from'node:fs';import vm from'node:vm';
import{SEMS_2022,contentId2022,assessmentsFor2022}from'./curriculum-2022.js';import{BANK}from'./units-index.js';import{withThink}from'./think-merge.js';
import{reviewStudentModule,reviewStudentWorkbook,reviewQuestionRows,reviewPaperText,reviewWorkbookTableText,STUDENT_LANGUAGE_VERSION as version}from'./student-language-review.js';
import{questionVersion,questionAtVersion,restoreDailyQuestions,questionMisconceptions}from'./question-revision.js';import{snapshotDailyPaper,resolveDailyPaper}from'./daily-paper-state.js';import{gradeDaily}from'./daily-grade.js';
import{withObservedPhotoAlt}from'../data/book/observation-language.js';import{withElementaryReadingDirections}from'../data/book/elementary-reading-directions.js';import{revisedClassroom,classroomQuestions}from'./revised-lesson.js';
import{makeWorkbookPaper}from'./revised-workbook-paper.js';
const entry=new URL('./v2.js',import.meta.url),code=fs.readFileSync(entry,'utf8'),a=code.indexOf('const UNITS = ')+14,b=code.indexOf('\n// 문제은행만',a),loaders=new vm.Script('('+code.slice(a,b).trim().replace(/;$/,'')+')',{importModuleDynamically:s=>import(new URL(s,entry).href)}).runInContext(vm.createContext({withThink}));
const ids=SEMS_2022.flatMap(s=>s.units.map(u=>contentId2022(u.position))),assessmentIds=[...new Set([...SEMS_2022.flatMap(s=>assessmentsFor2022(s.sem,BANK).map(x=>x.contentId)),...Object.keys(BANK).filter(x=>/^(?:c22-)?s\d\d-(mid|fin)$/.test(x))])];
const load=async id=>loaders[id]?loaders[id]():{...(await import('../data/units/'+id+'.js')),...(await import('../data/units/'+id+'.similar.js')),...(BANK[id]?.authored&&!BANK[id]?.mixedSourceAssessment?{source:[]}:await import('../data/units/'+id+'.source.js'))},plain=x=>x===undefined?undefined:JSON.parse(JSON.stringify(x));

const beforeTaskReview=q=>beforeEcologyWriting(beforePlantTask(beforeAnimalTask(q.forceGuidedWriting&&q.contentVersion==='20261123-force-guided-tasks'?questionAtVersion(q,q.previousVersions.at(-1).version):q)));

test('all 32 units and every registered assessment retain source questions, keys, grading, diagnoses and complete old presentations',async()=>{
 let changed=0,sources=0;
 for(const unit of [...ids,...assessmentIds]){const before=await load(unit),saved=plain({items:before.items,source:before.source,similar:before.similar}),after=await reviewStudentModule(unit,before);
  for(const field of ['items','source','similar'])for(let i=0;i<(before[field]||[]).length;i++){
   const old=before[field][i],q=after[field][i];assert.equal(q.id,old.id);if(q.id==='c22-s52-u03-b050'){assert.equal(q.answerContract.answer,'예시 자료');for(const a of old.answerContract.accepted)assert(q.answerContract.accepted.includes(a));}else assert.deepEqual(beforeTaskReview(q).answerContract,old.answerContract);assert.deepEqual(q.responseContract,old.responseContract);assert.deepEqual(q.sourceRef,old.sourceRef);assert.deepEqual(beforeTaskReview(q).taxonomy,old.taxonomy);
   if(old.sourceRef.type==='original'){assert.equal(q,old);sources++;}
   if(q===old)continue;changed++;assert.equal(q.contentVersion,q.plantGuidedResponse?'20261124-plant-guided-tasks':q.animalGuidedResponse?'20261123-animal-guided-tasks':q.forceGuidedWriting?'20261123-force-guided-tasks':q.id==='c22-s52-u03-b050'?'20261123-weather-example-response':['c22-s42-u02-b43','c22-s42-u02-b53','c22-s42-u02-b78'].includes(q.id)?'20261123-ecology-conservation':q.id==='c22-s42-u02-b37'?'20261123-ecology-foodweb-tasks':q.guidedWriting?'20261123-ecology-guided-writing':version);assert.deepEqual(plain(questionMisconceptions(beforeTaskReview(q),before.misc)),plain(questionMisconceptions(old,before.misc)));
   const restored=questionAtVersion(q,questionVersion(old));assert.deepEqual(restored,{...plain(old),contentVersion:questionVersion(old)});
   const value=old.answerContract.answers??old.answerContract.sample??old.answerContract.answer;
   for(const response of [value,''])assert.equal(gradeDaily(q,response,{misc:before.misc}).status,gradeDaily(old,response,{misc:before.misc}).status,unit+' '+q.id);
   const state={answers:{[q.id]:value},questionVersions:{[q.id]:questionVersion(old)}};assert.deepEqual(restoreDailyQuestions([q],state),[restored]);const frozen=resolveDailyPaper([q],{paper:snapshotDailyPaper([old]),answers:state.answers});assert(frozen.readOnly);assert.deepEqual(plain(frozen.questions),[plain(old)]);
  }
  assert.deepEqual(plain({items:before.items,source:before.source,similar:before.similar}),saved);
 }
 assert(changed>250);assert(sources>=1763);
});

test('wording-only reviews retain 3080 question contracts with explicitly separate task revisions',async()=>{
 let questions=0,changedBooks=0,tables=0;const tableUnits=new Set();
 for(const unit of ids){const {workbook:raw}=await import('../data/book/'+unit+'.workbook.js'),before=withObservedPhotoAlt(withElementaryReadingDirections(raw)),saved=plain(before),after=await reviewStudentWorkbook(unit,before);questions+=before.questions.length;if(after!==before)changedBooks++;
  const review=(await import('../data/language/'+unit+'.js')).review;
  assert.deepEqual(Object.keys(after.figures||{}),unit==='s31-u01'?[...Object.keys(before.figures||{}),'force-guided-level-comparison','force-concept-balance','force-concept-lever']:unit==='s31-u02'?[...Object.keys(before.figures||{}),'animal-concept-polar']:Object.keys(before.figures||{}));
  for(const [key,html]of Object.entries(before.figures||{})){
   const next=after.figures[key];if(unit==='c22-s52-u03'&&key==='weather-quick-28')continue;
   if(next===html)continue;
   if(unit==='s31-u01'&&['opener','ramp','scale'].includes(key)){assert.equal(next.match(/<img[^>]+>/)[0],html.match(/<img[^>]+>/)[0]);continue;}
   if(unit==='s31-u01'&&key==='scale-results'){assert.equal(next.match(/<tbody>[\s\S]*?<\/tbody>/)[0],html.match(/<tbody>[\s\S]*?<\/tbody>/)[0]);assert(next.includes('예시 무게'));continue;}
   if(unit==='s31-u03'&&['two-criteria','length-data'].includes(key)){assert.equal(next.match(/<tbody>[\s\S]*?<\/tbody>/)[0],html.match(/<tbody>[\s\S]*?<\/tbody>/)[0]);if(key==='length-data'){assert(!next.includes('가상'));assert(next.includes('앞의 식물 사진을 잰 값과는 달라요.'));}continue;}
   if(unit==='s31-u02'&&key==='water-life'){assert.equal(next.match(/<tbody>[\s\S]*?<\/tbody>/)[0],html.match(/<tbody>[\s\S]*?<\/tbody>/)[0]);assert(next.includes('붕어와 수달이 헤엄칠 때 쓰는 몸의 부분을 비교해 보아요.'));continue;}
   if(unit==='c22-s42-u02'&&key==='ecoChains'){assert.equal(next.match(/<tbody>[\s\S]*?<\/tbody>/)[0],html.match(/<tbody>[\s\S]*?<\/tbody>/)[0]);continue;}
   if(unit==='c22-s42-u02'&&key==='ecoSurveyCards'){assert.equal(next,html.replace('관계 지도 만들기를 위한 제공 목록이에요. 학생이 직접 조사한 결과가 아니에요.','목록의 여섯 대상을 살아 있는지에 따라 나누어 보아요.'));continue;}
   assert(Object.hasOwn(review.tableFigures||{},key),unit+' '+key);assert(before.questions.some(q=>q.status==='authored'&&q.figure===key));assert(html.includes('<table'));
   assert.equal(next,reviewPaperText(html,review));assert.deepEqual(next.match(/<[^>]*>/g),html.match(/<[^>]*>/g));assert.deepEqual(next.match(/\d+(?:\.\d+)?/g),html.match(/\d+(?:\.\d+)?/g));tables++;tableUnits.add(unit);
  }
  assert.equal(after.questions.length,before.questions.length);
  for(let i=0;i<before.questions.length;i++){const q=before.questions[i],n=after.questions[i];for(const k of ['id','answer','accepted','answerContract','responseContract','sourceRef','taxonomy','figure','no','section','standard'])if(q.id==='c22-s52-u03-w050'&&k==='answer')assert.equal(n[k],'예시 자료');else if(q.id==='c22-s52-u03-w050'&&k==='accepted'){for(const a of q[k])assert(n[k].includes(a));}else if(unit==='s31-u01'&&n.no===63&&k==='figure')assert.equal(n.figure,'force-guided-level-comparison');else if(unit==='s31-u01'&&[35,36,37,38,39,40,63,64,76,78,80].includes(n.no)&&k==='answer'){assert.equal(n.forceGuidedWriting,'20261123-force-guided-tasks');assert(n.answer.length>0);}else if(unit==='s31-u01'&&[75,77,79].includes(n.no)&&k==='answer'){assert.equal(n.forceDrawingReviewed,'20261123-force-drawing-panels');assert(n.answer.length>0);}else if(unit==='s31-u03'&&[35,36,37,38,39,40,63,64,75,76,77,78,79,80].includes(n.no)&&k==='answer'){assert.equal(n.plantGuidedResponse,'20261124-plant-guided-tasks');assert(n.answer.length>0);}else if(unit==='s31-u03'&&n.no===37&&k==='answerContract'){assert(n.answerContract.reviewRequired);assert.deepEqual(n.answerContract,n.sourceContract);}else if(unit==='s31-u02'&&[35,36,37,38,39,40,63,64,75,76,77,78,79,80].includes(n.no)&&k==='answer'){assert.equal(n.animalGuidedResponse,'20261123-animal-guided-tasks');assert(n.answer.length>0);}else if(n.foodwebReviewed&&k==='answer'){assert(n.answer.length>0);assert([27,28,36,43,44,45,48,53,54,55,56].includes(n.no));}else if(n.conservationReviewed&&k==='answer'){assert(n.answer.length>0);assert([61,62,63,68,70,71,73,74,75,76,77,78,79,80].includes(n.no));}else if(n.guidedWriting&&k==='answer')assert.equal(n.answer,n.sourceContract.sample);else if(n.guidedWriting&&k==='figure'&&q.no===39)assert.equal(n.figure,undefined);else assert.deepEqual(n[k],q[k],unit+' '+q.id+' '+k);}
  assert.deepEqual(plain(before),saved);assert.deepEqual(await reviewStudentWorkbook(unit,after),after);
 }
 assert.equal(questions,3080);assert(changedBooks>=20);assert.equal(tables,47);assert.deepEqual([...tableUnits],['c22-s61-u04','c22-s62-u01','c22-s62-u04']);
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

test('reviewed career source names appear inside the actual workbook table as well as its question data',async()=>{
 const unit='c22-s62-u04',{workbook:raw}=await import('../data/book/'+unit+'.workbook.js'),after=await reviewStudentWorkbook(unit,raw),key='career-question-data-1';
 assert(after.questions[0].table.행[0][1].includes('시청의 자료(예시, 2025년)'));
 assert(after.figures[key].includes('시청의 자료(예시, 2025년)'));
 assert(!after.figures[key].includes('가상 시 자료팀'));
 const {workbookPaper}=makeWorkbookPaper(after);
 for(const mode of ['student','teacher']){const html=workbookPaper({mode});assert(html.includes('<td>시청의 자료(예시, 2025년)</td>'));assert(!html.includes('<td>가상 시 자료팀·2025년</td>'));}
});

test('table language review preserves future HTML, source-owned figures, unregistered pictures and repeated output',async()=>{
 const unit='c22-s62-u04',{workbook:raw}=await import('../data/book/'+unit+'.workbook.js'),review=(await import('../data/language/'+unit+'.js')).review,key='career-question-data-1';
 const after=reviewWorkbookTableText(raw,review);assert.notEqual(after.figures[key],raw.figures[key]);assert.equal(reviewWorkbookTableText(after,review),after);
 const future={...raw,figures:{...raw.figures,[key]:raw.figures[key]+'<!-- revised table -->'}};
 assert.equal(reviewWorkbookTableText(future,review).figures[key],future.figures[key]);
 const source={...raw,questions:raw.questions.map(q=>q.figure===key?{...q,status:'verified'}:q)};
 assert.equal(reviewWorkbookTableText(source,review).figures[key],source.figures[key]);
 const picture={...raw,figures:{...raw.figures,[key]:{src:'figure.webp',alt:'가상 시 자료팀·2025년'}}};assert.equal(reviewWorkbookTableText(picture,review).figures[key],picture.figures[key]);
 const unregistered={...raw,figures:{...raw.figures,'future-table':raw.figures[key]},questions:[...raw.questions,{status:'authored',figure:'future-table'}]};assert.equal(reviewWorkbookTableText(unregistered,review).figures['future-table'],raw.figures[key]);
});
