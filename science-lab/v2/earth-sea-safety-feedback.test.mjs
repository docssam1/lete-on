import test from'node:test';import assert from'node:assert/strict';import fs from'node:fs';import vm from'node:vm';
import{earthSeaSafetyReview,earthSeaSafetyMisconceptions,EARTH_SEA_SAFETY_VERSION as version}from'../data/book/earth-sea-choice-review.js';
import{withThink,loadJudge}from'./think-merge.js';import{questionAtVersion,questionMisconceptions,restoreDailyQuestions,restartCurrentQuestion}from'./question-revision.js';import{snapshotDailyPaper,resolveDailyPaper}from'./daily-paper-state.js';import{gradeDaily}from'./daily-grade.js';import{classify,record,analyze,remedyItems}from'./progress.js';import{teacherKeyHtml}from'./daily.js';import{revisedTextbookUnits}from'./revised-textbook.js';
const url=new URL('./v2.js',import.meta.url),code=fs.readFileSync(url,'utf8'),a=code.indexOf('const UNITS = ')+14,b=code.indexOf('\n// 문제은행만',a),loaders=new vm.Script('('+code.slice(a,b).trim().replace(/;$/,'')+')',{importModuleDynamically:s=>import(new URL(s,url).href)}).runInContext(vm.createContext({withThink})),unit='c22-s32-u02',mod=await loaders[unit](),targets=mod.items.filter(q=>q.contentVersion===version),previousStage='20261115-earth-sea-linked-choice-review',esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const whyFor=misc=>new vm.Script(code.slice(code.indexOf('function whyHtml('),code.indexOf('// ctx ='))+';whyHtml').runInContext(vm.createContext({MISC:misc,esc,questionMisconceptions}));
const maps={'c22-s32-u02-b28':{0:'ES_TASTE',1:'ES_HEAT',2:'ES_DISTANCE',3:'ES_DISTANCE'},'c22-s32-u02-b35':{0:'ES_HEAT',2:'ES_DISTANCE',3:'ES_EQUIPMENT',4:'ES_TASTE'}};

test('two safety revisions preserve all questions, numeric keys and saved attempts while eight wrong choices receive relevant guidance',async()=>{
 assert.deepEqual(targets.map(q=>q.id),Object.keys(maps));const judge=await loadJudge(unit),why=whyFor(mod.misc);let wrong=0;
 for(const q of targets){const before=questionAtVersion(q,previousStage),reverted={...q};for(const k of['contentVersion','previousVersions','diagnosticOverride'])if(Object.hasOwn(before,k))reverted[k]=before[k];else delete reverted[k];assert.deepEqual(reverted,before);assert.deepEqual(q.diagnosticOverride.distractors,maps[q.id]);
  for(let choice=0;choice<q.choices.length;choice++){
   const oldGrade=gradeDaily(before,choice,{misc:mod.misc,judge}),currentGrade=gradeDaily(q,choice,{misc:mod.misc,judge});assert.deepEqual(currentGrade,oldGrade);const dx=classify(q,mod.misc,currentGrade.status==='correct',currentGrade.detail);
   if(choice===q.answerContract.answer){assert.equal(currentGrade.status,'correct');assert.deepEqual(dx.m,[]);continue;}
   wrong++;const expected=maps[q.id][choice];assert.deepEqual(dx.m,[expected]);const html=why(q,false,currentGrade.detail);assert(html.includes(earthSeaSafetyMisconceptions[expected].fix));assert(!html.includes(mod.misc.misconceptions[q.id.endsWith('28')?'M04':'M05'].fix));
  }
  for(const v of[1,previousStage]){
   const old=questionAtVersion(q,v),state={answers:{[q.id]:0},first:{[q.id]:{status:'wrong'}},questionVersions:{[q.id]:v}},saved=structuredClone(state);assert.deepEqual(classify(old,mod.misc,false,{picked:0}).m,[q.id.endsWith('28')?'M04':'M05']);assert(why(old,false,{picked:0}).includes(mod.misc.misconceptions[q.id.endsWith('28')?'M04':'M05'].fix));assert.deepEqual(restoreDailyQuestions([q],state)[0],old);
   const next=restartCurrentQuestion(state,q);assert.deepEqual(state,saved);assert.equal(next.questionVersions[q.id],version);assert.deepEqual(next.revisionHistory[q.id][0].answers,0);const paper=resolveDailyPaper([q],{paper:snapshotDailyPaper([old]),answers:state.answers});assert(paper.readOnly);assert.deepEqual(paper.questions[0].choices,old.choices);
  }
  const versionless=restoreDailyQuestions([q],{answers:{[q.id]:0}})[0];assert.equal(versionless.contentVersion,1);
  const key=teacherKeyHtml({u:unit,ch:{title:'지구와 바다'},list:[q],misc:mod.misc});for(const id of new Set(Object.values(maps[q.id])))assert(key.includes(esc(earthSeaSafetyMisconceptions[id].label)));
  const beforeCopy=structuredClone(before),once=earthSeaSafetyReview([before],unit);assert.deepEqual(before,beforeCopy);assert.deepEqual(once[0],q);assert.equal(earthSeaSafetyReview(once,unit),once);
  for(const patch of[{status:'source'},{sourceContent:{blocks:[]}},{sourceRef:{type:'original'}},{contentVersion:'future'},{prompt:before.prompt+' future'},{choices:[...before.choices].reverse()},{answerContract:{...before.answerContract,extra:true}},{givens:{future:true}},{previousVersions:[]},{extra:'future'}]){const rows=[{...before,...patch}];assert.equal(earthSeaSafetyReview(rows,unit),rows);}const other=[before];assert.equal(earthSeaSafetyReview(other,'another-unit'),other);
 }assert.equal(wrong,8);
 const index=fs.readFileSync(new URL('./index.html',import.meta.url),'utf8');assert(index.includes('&safety='+version));assert(code.includes('earth-sea-choice-review.js?v='+previousStage+'&safety='+version));
});

test('current safety diagnoses recommend safety questions and resolve without rewriting older comparison diagnoses',()=>{
 const priorStorage=globalThis.localStorage,store=new Map();globalThis.localStorage={getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)};
 try{
  const [a,b]=targets,old=questionAtVersion(a,previousStage);record(unit,old,'sub',false,{picked:0},mod.misc);record(unit,a,'sub',false,{picked:0},mod.misc);record(unit,b,'sub',false,{picked:4},mod.misc);
  const dx=analyze(unit,mod.misc);assert.equal(dx.mis.ES_TASTE.status,'confirmed');assert.equal(dx.mis.M04.status,'suspected');assert.deepEqual(new Set(remedyItems(unit,'ES_TASTE',mod.misc,mod.items,20).map(q=>q.id)),new Set(targets.map(q=>q.id)));assert(!remedyItems(unit,'M04',mod.misc,mod.items,100).some(q=>q.id===a.id));
  record(unit,a,'sub',true,{picked:a.answerContract.answer},mod.misc);record(unit,b,'sub',true,{picked:b.answerContract.answer},mod.misc);const next=analyze(unit,mod.misc);assert.equal(next.mis.ES_TASTE.status,'resolved');assert.equal(next.mis.M04.streak,0);
 }finally{if(priorStorage===undefined)delete globalThis.localStorage;else globalThis.localStorage=priorStorage;}
});

test('actual root correction messages agree with recorded diagnoses for all current closed-choice questions across 32 units',async()=>{
 let cases=0,overridden=0;
 for(const unit of revisedTextbookUnits){const mod=await loaders[unit](),why=whyFor(mod.misc);for(const q of[...mod.items,...mod.source,...mod.similar]){
  if(!['single-choice','multi-choice'].includes(q.answerContract?.type))continue;const keys=q.answerContract.answers||[q.answerContract.answer];for(let i=0;i<q.choices.length;i++)if(!keys.includes(i)){
   cases++;if(q.diagnosticOverride)overridden++;const dx=classify(q,mod.misc,false,{picked:i}),html=why(q,false,{picked:i});assert.equal((html.match(/class="mis-tag"/g)||[]).length,dx.m.length,q.id+' '+i);for(const id of dx.m)assert(html.includes(mod.misc.misconceptions[id].fix),q.id+' '+id);if(!dx.m.length)assert(html.includes(esc(q.explanation)));
  }
 }}assert(cases>11000);assert(overridden>100);
});
