import{BIOLOGY_EXAMPLE_VERSION}from'../data/book/biology-example-card.js';
import{GRADE4_REVIEW_VERSION}from'../data/book/grade4-question-review.js';
// This regression verifies the earlier presentation stage; the grade 4 review has separate coverage.
const beforeGrade4=item=>{const q=item.contentVersion===BIOLOGY_EXAMPLE_VERSION?questionAtVersion(item,item.previousVersions.at(-1).version):item;return q.contentVersion===GRADE4_REVIEW_VERSION?questionAtVersion(q,q.previousVersions.at(-1).version):q;};
import{BIOLOGY_PEER_OPINIONS_VERSION,BIOLOGY_ELEMENTARY_BANK_VERSION as peerPriorVersion}from'../data/book/s41-u04.editorial.js';
import{BIOLOGY_OBSERVATION_CHOICE_VERSION}from'../data/book/standalone-question-context.js';
import{thinkingCheckQuestion}from'./thinking-check-question.js';
import test from'node:test';import assert from'node:assert/strict';import fs from'node:fs';import vm from'node:vm';import{createHash}from'node:crypto';
import{photoFigureHtml}from'./photo-figure.js';import{biologyObservationPhotos,withBiologyObservationArt,withBiologyObservationWorkbook,BIOLOGY_OBSERVATION_PHOTO_VERSION}from'../data/book/biology-observation-photos.js';
import{standaloneQuestionContexts}from'../data/book/standalone-question-context.js';import{items as raw}from'../data/units/s41-u04.js';import{items as think}from'../data/units/s41-u04.think.js';
import{biologyCurrentItems}from'../data/book/biology-student-language.js';import{biologyReadableCurrentItems,biologyElementaryCurrentItems}from'../data/book/s41-u04.editorial.js';import{lessonReferenceItems}from'../data/book/lesson-reference-data.js';
import{biologyReferencePriorWorkbook as workbook,biologyObservationPriorWorkbook}from'../data/book/s41-u04.workbook.js';import{art}from'../data/book/s41-u04.workbook-art.js';import{withThink,loadJudge}from'./think-merge.js';import{revisedClassroom}from'./revised-lesson.js';import{revisedTextbookPaper}from'./revised-textbook.js';
import{questionAtVersion,questionMisconceptions,restoreDailyQuestions,restartCurrentQuestion}from'./question-revision.js';import{gradeDaily}from'./daily-grade.js';import{snapshotDailyPaper,resolveDailyPaper}from'./daily-paper-state.js';
import*as presentation from'./source-presentation.js';import*as content from'./source-content.js';import{writtenPracticeHtml}from'./written-practice.js';import{seasonAnswerHint}from'./season-answer-hint.js';
const unit='s41-u04',ids=['s41-u04-b04','s41-u04-b11','s41-u04-b12','s41-u04-b14'];
const initial=lessonReferenceItems(biologyElementaryCurrentItems(biologyReadableCurrentItems(biologyCurrentItems([...raw,...think]),unit),unit),unit),prior=initial.map(q=>['s41-u04-b09','s41-u04-b16'].includes(q.id)?standaloneQuestionContexts([q],unit)[0]:q);
const code=fs.readFileSync(new URL('./v2.js',import.meta.url),'utf8'),a=code.indexOf('const UNITS = ')+14,b=code.indexOf('\n// 문제은행만',a),loaders=new vm.Script('('+code.slice(a,b).trim().replace(/;$/,'')+')',{importModuleDynamically:s=>import(new URL(s,new URL('./v2.js',import.meta.url)).href)}).runInContext(vm.createContext({withThink})),current=await loaders[unit]();
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));

test('four observation questions gain the correct photographs without changing any answer, effective diagnosis or historic response',async()=>{
 const before=JSON.stringify(prior),judge=await loadJudge(unit),changed=[];
 for(let i=0;i<prior.length;i++){
  const old=prior[i],stage=beforeGrade4(current.items[i]),latest=stage.contentVersion===BIOLOGY_PEER_OPINIONS_VERSION?questionAtVersion(stage,peerPriorVersion):stage,q=latest.contentVersion===BIOLOGY_OBSERVATION_CHOICE_VERSION?questionAtVersion(latest,BIOLOGY_OBSERVATION_PHOTO_VERSION):latest;if(!ids.includes(q.id)){assert.deepEqual(q,old);continue;}changed.push(q.id);assert.equal(q.contentVersion,BIOLOGY_OBSERVATION_PHOTO_VERSION);
  const allowed=new Set(['prompt','observationPhotos','contentVersion','previousVersions','diagnosticOverride']);for(const k of new Set([...Object.keys(q),...Object.keys(old)]))if(!allowed.has(k))assert.deepEqual(q[k],old[k],q.id+' '+k);
  if(old.diagnosticOverride?.version===old.contentVersion)assert.deepEqual({...q.diagnosticOverride,version:old.contentVersion},old.diagnosticOverride);else assert.deepEqual(q.diagnosticOverride,old.diagnosticOverride);
  assert.deepEqual(questionMisconceptions(q,current.misc),questionMisconceptions(old,current.misc));
  const answers=q.answerContract.type==='multi-choice'?Array.from({length:1<<q.choices.length},(_,mask)=>q.choices.map((_,i)=>i).filter(i=>mask&(1<<i))):['',0,1,2,3,4];
  for(const answer of answers)assert.deepEqual(gradeDaily(q,answer,{judge,misc:questionMisconceptions(q,current.misc)}),gradeDaily(old,answer,{judge,misc:questionMisconceptions(old,current.misc)}));
  for(const version of new Set([old.contentVersion||1,...(old.previousVersions||[]).map(p=>p.version)])){
   const restored=questionAtVersion(q,version),expected=questionAtVersion(old,version);assert(!Object.hasOwn(restored,'observationPhotos'));for(const[k,v]of Object.entries(expected))assert.deepEqual(restored[k],v);
   const state={answers:{[q.id]:0,other:'keep'},graded:{[q.id]:{status:'wrong'}},self:{[q.id]:'sure'},questionVersions:{[q.id]:version}},saved=structuredClone(state);
   assert.equal(restoreDailyQuestions([q],state)[0].prompt,expected.prompt);const next=restartCurrentQuestion(state,q);assert.deepEqual(state,saved);assert.equal(next.answers.other,'keep');assert.deepEqual(next.revisionHistory[q.id][0].graded,state.graded[q.id]);
  }
  const paper=resolveDailyPaper([q],{paper:snapshotDailyPaper([old]),answers:{[q.id]:0}});assert(!paper.questions[0].observationPhotos);
  const currentPaper=snapshotDailyPaper([q]),sameVersionNewPhoto=structuredClone(q);sameVersionNewPhoto.observationPhotos[0].src='assets/book/different-photo.jpg';assert.equal(resolveDailyPaper([sameVersionNewPhoto],{paper:currentPaper}).readOnly,true);assert.deepEqual(resolveDailyPaper([q],{paper:currentPaper}).questions[0].observationPhotos,q.observationPhotos);
  for(const altered of [{...old,contentVersion:'future'},{...old,prompt:'future'},{...old,observationPhotos:[{existing:true}]},{...old,givens:{existing:'data'}},...['original','similar','authored-pair'].map(type=>({...old,sourceRef:{type}}))]){const rows=[altered];assert.equal(standaloneQuestionContexts(rows,unit),rows);}
 }
 assert.deepEqual(changed,ids);assert.equal(JSON.stringify(prior),before);assert.equal(standaloneQuestionContexts(current.items,unit),current.items);
 const cls=await revisedClassroom(unit,await import('../data/book/s41-u04.book.js'));for(const q of cls.classroomItems)assert.deepEqual(q,current.items.find(it=>it.id===q.id));
});

test('both original images, labels and attribution reach learning, Daily and both question paper modes without revealing keys',()=>{
 const photos=biologyObservationPhotos('mushroom','spirogyra'),hashes=['f1f68a4d90fd4df48a7df1a2449577bfb992db2eebfedff582ee041408fa6998','aa69ab673362f8316cc3bf1e27f1fd969dfc97d05ed266edc6fdd12f2f7a761f'];
 for(const[p,i]of photos.map((p,i)=>[p,i]))assert.equal(createHash('sha256').update(fs.readFileSync(new URL('../'+p.src,import.meta.url))).digest('hex'),hashes[i]);
 const ctx=vm.createContext({...presentation,...content,photoFigureHtml,writtenPracticeHtml,seasonAnswerHint,FIG:{},MISC:null,CIRC:['①','②','③','④','⑤'],esc}),item=new vm.Script(code.slice(code.indexOf('function blanksHtml('),code.indexOf('let FIG ='))+';itemHtml').runInContext(ctx),dailyCode=fs.readFileSync(new URL('./daily.js',import.meta.url),'utf8'),daily=new vm.Script(dailyCode.slice(dailyCode.indexOf('const figHtml ='),dailyCode.indexOf('const givensHtml ='))+';figHtml').runInContext(ctx);
 for(const q of current.items.filter(q=>ids.includes(q.id))){
  assert.equal(q.observationPhotos.length,['s41-u04-b04','s41-u04-b14'].includes(q.id)?2:1);
  for(const html of [item(q),item(q,{print:true}),daily(q),thinkingCheckQuestion(q,1,false),thinkingCheckQuestion(q,1,true)])for(const p of q.observationPhotos){assert(html.includes('../'+p.src));assert(html.includes(esc(p.label)));assert(html.includes(esc(p.creator)));assert(html.includes(p.licenseUrl));assert(!html.includes('class="ans"'));}
  for(const mode of ['student','teacher','answers','quick']){const html=current.bankPaper({...current,mode});assert(!/undefined|\[object Object\]/.test(html));if(mode==='student'||mode==='teacher'){const at=html.indexOf('data-paper-item="'+q.id+'"'),card=html.slice(at,html.indexOf('</article>',at));for(const p of q.observationPhotos)assert(card.includes('../'+p.src));if(mode==='student')assert(!card.includes('bio-bank-key'));}}
 }
 const unsafe=structuredClone(photos);unsafe[0].sourceUrl='javascript:alert(1)';assert.throws(()=>photoFigureHtml({observationPhotos:unsafe}));unsafe[0]=photos[0];unsafe[0]={...unsafe[0],src:'assets/book/../secret.jpg'};assert.throws(()=>photoFigureHtml({observationPhotos:unsafe}));
 const html=photoFigureHtml({observationPhotos:[{...photos[0],label:'<script>"&'}]});assert(html.includes('&lt;script&gt;&quot;&amp;'));assert(!html.includes('<script>'));
 photos[0].label='changed';assert.notEqual(biologyObservationPhotos('mushroom')[0].label,'changed');
});

test('the biology concept page uses a real filament micrograph while every workbook question, writing area and other figure remains intact',async()=>{
 const old=biologyObservationPriorWorkbook;assert.deepEqual(workbook.questions,old.questions);for(const k of Object.keys(old).filter(k=>k!=='figures'))assert.deepEqual(workbook[k],old[k]);
 for(const key of Object.keys(old.figures))if(key!=='biologySpirogyra')assert.equal(workbook.figures[key],old.figures[key]);assert.equal(workbook.figures.biologySpirogyra,art.biologySpirogyra);assert(workbook.figures.biologySpirogyra.includes('s41-u04-spirogyra-reischig.jpg'));assert(!workbook.figures.biologySpirogyra.includes('300x'));
 assert.equal(withBiologyObservationWorkbook(workbook),workbook);assert.equal(withBiologyObservationArt(art),art);const other={...old,unit:'other'};assert.equal(withBiologyObservationWorkbook(other),other);const future={biologySpirogyra:'future figure'};assert.equal(withBiologyObservationArt(future),future);
 const paper=await revisedTextbookPaper(unit);for(const mode of ['student','teacher','answers','quick']){const html=paper.workbookPaper({mode});assert(!/undefined|\[object Object\]/.test(html));if(mode==='student'||mode==='teacher'){assert(html.includes('s41-u04-spirogyra-reischig.jpg'));assert(html.includes('Josef Reischig'));assert(html.includes('https://creativecommons.org/licenses/by-sa/3.0/'));}if(mode==='student')assert(!html.includes('class="ed-key"'));}
});
