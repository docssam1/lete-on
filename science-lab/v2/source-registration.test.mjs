import {questionAtVersion} from './question-revision.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {originalSourceTwin} from './original-source-pairs.js';
import {withSourceBankPaper} from './source-bank-paper.js';
import {sourceQuestionPrintHtml,needsSourceTeacherReview} from './source-content.js';
import {gradeDaily,summarize} from './daily-grade.js';
import {snapshotDailyPaper,resolveDailyPaper} from './daily-paper-state.js';
import {BANK} from './units-index.js';
import vm from 'node:vm';
import * as presentation from './source-presentation.js';
import * as content from './source-content.js';
import {sourceExamPaperHtml,sourceExamPrintLinks,sourcePaperMode} from './source-exam-paper.js';
import {photoFigureHtml} from './photo-figure.js';
import {seasonAnswerHint} from './season-answer-hint.js';
import {assessmentPool,assessmentRelated} from './assessment-data.js';
import {withThink,loadJudge} from './think-merge.js';
import {teacherKeyHtml} from './daily.js';
const cases=[['c22-s61-u04',39,6,167,'earth-motion'],['c22-s62-u01',68,8,198,'season'],['c22-s62-u02',49,6,198,'combustion'],['c22-s62-u03',58,9,186,'electricity']];
const restoreReviewed=q=>{const original=structuredClone(q);original.privateOnly=true;original.runtimeRegistered=false;original.taxonomy=original.sourceTaxonomy;delete original.sourceTaxonomy;delete original.sourcePair;return original;};
test('등록된 네 원문 모듈은 검수 원고의 내용 해시와 214개의 출처·원번호·기존 짝을 보존한다',async()=>{
 let total=0,review=0;
 for(const[unit,n,held,practice]of cases){
  const mod=await import('../data/units/'+unit+'.js'),{source,sourceRegistration:r}=await import('../data/units/'+unit+'.source.js'),{taxonomy}=await import('../data/units/'+unit+'.taxonomy.js');
  assert.deepEqual(mod.source.map(q=>{const old=source.find(r=>r.id===q.id);return q.diagnosticOverride?questionAtVersion(q,old.contentVersion):q;}),source);assert.equal(source.length,n);assert.equal(mod.items.length,practice);assert.equal(BANK[unit].n,n);assert(!BANK[unit].sourcePending);assert(BANK[unit].pairsInPractice);
  assert.equal(new Set([...source,...mod.items].map(q=>q.id)).size,n+practice);
  assert.equal(r.loginRequired,false);assert.equal(r.transport,'static-files');assert.equal(r.wholeCurrentEdition,false);
  assert.equal(createHash('sha256').update(JSON.stringify(source.map(restoreReviewed))).digest('hex'),r.reviewedContentSha256);
  const types=new Set(taxonomy.types.map(t=>t.id)),ids=new Set();
  for(const q of source){
   assert.equal(q.status,'verified');assert.equal(q.privateOnly,false);assert.equal(q.runtimeRegistered,true);assert(q.sourceRef.originalNo>0);assert.equal(q.key,q.sourceRef.set+'-'+q.sourceRef.originalNo);
   assert(types.has(q.taxonomy.type));assert.equal(taxonomy.sources[q.key][0],q.taxonomy.type);
   const pair=originalSourceTwin(q,mod);assert(pair,q.id);assert(!ids.has(pair.id));ids.add(pair.id);
   assert.equal(q.sourcePair.itemId,pair.id);assert.equal(q.sourcePair.set,q.sourceRef.set);assert.equal(q.sourcePair.no,q.sourceRef.originalNo);
   const text=JSON.stringify(q);assert(!/\/Users\/|privatePath|packagePath|file:\/\//.test(text));
   for(const block of [...q.sourceContextBlocks,...q.sourceMaterialBlocks])if(block.type==='figure')assert(fs.existsSync(new URL('../'+block.src,import.meta.url)));
  }
  assert.equal(source.filter(needsSourceTeacherReview).length,held);total+=source.length;review+=held;
 }
 assert.equal(total,214);assert.equal(review,29);
});
test('통합 문항집의 네 인쇄 모드는 새 원문과 기존 연습을 중복 없이 모두 포함한다',async()=>{
 for(const[unit,n,,practice,name]of cases){
  const mod=await import('../data/units/'+unit+'.js'),paper=await import('./'+name+'-bank-paper.js'),data=withSourceBankPaper({...mod,bankPaper:paper.bankPaper});
  const before=JSON.stringify(mod.items);
  for(const mode of ['student','teacher','answers','quick']){
   const html=data.bankPaper({...data,mode}),ids=[...html.matchAll(/(?:data-paper-item|data-question)="([^"]+)"/g)].map(m=>m[1]);
   for(const q of mod.source)assert.equal(ids.filter(id=>id===q.id).length,1);
   if(mode==='student'||mode==='teacher'){assert.equal(ids.length,n+practice);assert.equal(new Set(ids).size,ids.length);}
   assert(html.includes('전체 '+(n+practice)+'문항집'));assert(html.includes('data-workbook-print disabled'));assert(!html.includes('onclick="print()"'));
   if(mode==='student'){assert(!html.includes('source-print-key'));assert(!html.includes('class="ed-key"'));}
   if(mode==='answers'||mode==='quick'){
    const originalPart=html.slice(html.indexOf('<main'),html.indexOf('<section class="source-bank-practice">'));
    assert(!originalPart.includes('<img'));assert(!originalPart.includes('source-print-number'));assert(!originalPart.includes('source-choice-table'));
   }
  }
  assert.equal(JSON.stringify(mod.items),before);
 }
});
test('214개 원문의 실제 채점·저장 복원은 185개 자동 확인과 29개 교사 확인을 유지한다',async()=>{
 const result=[];
 for(const[unit]of cases){
  const {source}=await import('../data/units/'+unit+'.source.js'),answers={};
  for(const q of source){
   const a=q.answerContract,value=a.type==='single-choice'?a.answer:a.type==='multi-choice'?a.answers:a.sample??a.answer;answers[q.id]=value;
   assert.equal(gradeDaily(q,'').status,'blank');
   const graded=gradeDaily(q,value,{judge:{[q.id]:{open:true}}});
   assert.equal(graded.status,needsSourceTeacherReview(q)?'review':'correct',q.id);
   if(!needsSourceTeacherReview(q))assert.notEqual(gradeDaily(q,'가상 오답').status,'correct',q.id);
   result.push(graded);
  }
  const state={answers,paper:snapshotDailyPaper(source)},future=source.map(q=>({...q,prompt:'나중에 바뀐 가상 문제'}));
  const restored=resolveDailyPaper(future,state);
  assert.equal(restored.readOnly,true);assert.equal(restored.reason,'changed');
  assert.deepEqual(JSON.parse(JSON.stringify(restored.questions)),source);
  for(const q of restored.questions)assert.equal(gradeDaily(q,answers[q.id]).status,needsSourceTeacherReview(q)?'review':'correct');
 }
 const summary=summarize(result);assert.equal(summary.correct,185);assert.equal(summary.confirmed,185);assert.equal(summary.review,29);
});
test('짝 연결은 명시한 출처와 실제 문항 ID를 확인하며 잘못된 단원·출처를 받아들이지 않는다',()=>{
 const original={sourceRef:{type:'original',sourceId:'original-book',set:1,no:3,originalNo:3},sourcePair:{itemId:'paired-item',sourceId:'paired-book',set:1,no:3}},pair={id:'paired-item',sourceRef:{type:'authored-pair',of:{sourceId:'paired-book',set:1,no:3}}};
 assert.equal(originalSourceTwin(original,{items:[pair]}),pair);
 assert.equal(originalSourceTwin(original,{items:[{...pair,id:'other'}]}),undefined);
 assert.equal(originalSourceTwin(original,{items:[{...pair,sourceRef:{...pair.sourceRef,of:{...pair.sourceRef.of,sourceId:'other-book'}}}]}),undefined);
 assert.equal(originalSourceTwin({...original,sourceRef:{...original.sourceRef,type:'similar'}},{items:[pair]}),undefined);
 const old={sourceRef:{type:'original',set:2,no:4}},legacy={sourceRef:{of:{set:2,no:4}}};
 assert.equal(originalSourceTwin(old,{similar:[legacy]}),legacy);
});
test('실제 네 단원 로더와 64원문 라우트가 214문항·현재 짝·학생 인쇄·교사 답안표를 연결한다',async()=>{
 const entry=new URL('./v2.js',import.meta.url),src=fs.readFileSync(entry,'utf8'),app={innerHTML:''};
 let mounted,wired=0,storage=0;
 const failStorage=()=>{storage++;throw Error('Loading original sources must not touch student storage.');};
 const escape=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const ctx=vm.createContext({BANK,withThink,loadJudge,assessmentPool,assessmentRelated,...presentation,...content,sourceExamPaperHtml,sourceExamPrintLinks,sourcePaperMode,originalSourceTwin,wireSourceExamPaper:()=>{wired++;return()=>{};},esc:escape,CIRC:['①','②','③','④','⑤'],FIG:{},MISC:null,$app:app,scrollTo:()=>{},releasePage:()=>{},du:x=>x,wireItem:()=>{},writtenPracticeHtml:()=>'',photoFigureHtml,seasonAnswerHint,store:{get:failStorage,set:failStorage},record:failStorage});
 const dynamic=async spec=>{
  if(!spec.startsWith('./daily.js'))return import(new URL(spec,entry).href);
  const exports={mountDaily:args=>{mounted=args;return()=>{};},teacherKeyHtml};
  const module=new vm.SyntheticModule(Object.keys(exports),function(){for(const[k,v]of Object.entries(exports))this.setExport(k,v);},{context:ctx});
  await module.link(()=>{});await module.evaluate();return module;
 };
 const start=src.indexOf('const UNITS = ')+14,end=src.indexOf('\n// 문제은행만',start);
 const loaders=new vm.Script('('+src.slice(start,end).trim().replace(/;$/,'')+')',{importModuleDynamically:dynamic}).runInContext(ctx);
 const renderStart=src.indexOf('function blanksHtml('),renderEnd=src.indexOf('let FIG =',renderStart);
 ctx.itemHtml=new vm.Script(src.slice(renderStart,renderEnd)+'\nitemHtml').runInContext(ctx);
 const examStart=src.indexOf('async function pageExam('),examEnd=src.indexOf('\n// 문제은행 전체 차례',examStart);
 const page=new vm.Script(src.slice(examStart,examEnd)+'\npageExam',{importModuleDynamically:dynamic}).runInContext(ctx);
 let originals=0,routes=0;
 for(const[unit,n]of cases){
  const mod=await loaders[unit]();assert.equal(mod.source.length,n);const before=JSON.stringify(mod);
  ctx.FIG=mod.figures||{};ctx.MISC=mod.misc||null;
  for(const set of BANK[unit].sets){
   const list=mod.source.filter(q=>q.sourceRef.set===set);
   await page(unit,mod,mod.lesson,set);routes++;
   assert.deepEqual(JSON.parse(JSON.stringify(mounted.list)),list);originals+=list.length;
   assert(mounted.tabs.includes('/paper-teacher'));
   for(const q of mounted.list)assert.equal(mounted.twin(q).id,q.sourcePair.itemId);
   for(const mode of ['paper','paper-teacher']){
    await page(unit,mod,mod.lesson,set,mode);routes++;
    assert.equal((app.innerHTML.match(/data-paper-item=/g)||[]).length,list.length);
    const main=app.innerHTML.slice(app.innerHTML.indexOf('<main'));
    assert(!/<(?:input|select|button)\b/.test(main));
    if(mode==='paper')assert(!main.includes('class="ans"'));
   }
   await page(unit,mod,mod.lesson,set,'teacher');routes++;
   for(const q of list)assert(app.innerHTML.includes(escape(q.prompt)));
  }
  assert.equal(JSON.stringify(mod),before);
 }
 assert.equal(originals,214);assert.equal(routes,64);assert.equal(wired,32);assert.equal(storage,0);
});
