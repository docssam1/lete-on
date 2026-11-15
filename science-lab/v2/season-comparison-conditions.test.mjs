import{seasonContextItems}from'../data/book/season-workbook-context.js';
const beforeSeasonContext=q=>{if(q?.contentVersion!=='20261116-season-workbook-context')return q;const{version,snapshotKind,...previous}=q.previousVersions.at(-1);return previous;};
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {withThink} from './think-merge.js';
import {SEASON_COMPARISON_VERSION as version,seasonComparisonEdits as edits,seasonComparisonCurrentItems,withSeasonComparisonWorkbook} from '../data/book/c22-s62-u01.editorial.js';
import {grade6ReviewPriorWorkbook as workbook,seasonComparisonPriorWorkbook as priorWorkbook} from '../data/book/c22-s62-u01.workbook.js';
import {gradeDaily,vocabOf} from './daily-grade.js';
import {questionAtVersion,questionMisconceptions,restoreDailyQuestions,restartCurrentQuestion} from './question-revision.js';
import {snapshotDailyPaper,resolveDailyPaper} from './daily-paper-state.js';
import {revisedClassroom} from './revised-lesson.js';
import {revisedTextbook,revisedTextbookPaper} from './revised-textbook.js';
import {renderChapter} from './book.js';

const unit='c22-s62-u01',url=new URL('./v2.js',import.meta.url),code=fs.readFileSync(url,'utf8'),a=code.indexOf('const UNITS = ')+14,b=code.indexOf('\n// 문제은행만',a);
const loaders=new vm.Script('('+code.slice(a,b).trim().replace(/;$/,'')+')',{importModuleDynamically:s=>import(new URL(s,url).href)}).runInContext(vm.createContext({withThink}));
const mod=await loaders[unit](),changed=mod.items.map(beforeSeasonContext).filter(q=>q.contentVersion===version),esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const values=q=>q.choices?q.choices.map((_,i)=>i):q.answerContract.type==='short-text'?['','같게 / 날짜','날짜 / 같게','같게 / 시각','다른 답']:['',q.answerContract.sample,'그림과 설명'];

test('season comparison revisions preserve automatic decisions, diagnostics and every saved presentation',()=>{
 assert.equal(changed.length,3);
 const priorItems=mod.items.map(q=>q.contentVersion===version?questionAtVersion(q,edits[q.workbookRef.no].priorVersion):q);
 assert.deepEqual(vocabOf(mod.items,mod.misc),vocabOf(priorItems,mod.misc));
 for(const q of changed){
  const edit=edits[q.workbookRef.no],old=questionAtVersion(q,edit.priorVersion),saved=structuredClone(old);
  for(const value of [...values(old),...values(q)])assert.deepEqual(gradeDaily(q,value),gradeDaily(old,value));
  assert.deepEqual(questionMisconceptions(q,mod.misc),questionMisconceptions(old,mod.misc));
  for(const v of new Set([edit.priorVersion,...old.previousVersions.map(x=>x.version)]))assert.deepEqual(questionAtVersion(q,v),questionAtVersion(old,v));
  const state={answers:{[q.id]:values(old)[1],other:'keep'},graded:{[q.id]:JSON.parse(JSON.stringify(gradeDaily(old,values(old)[1])))},questionVersions:{[q.id]:edit.priorVersion},self:{[q.id]:'sure'}},before=structuredClone(state);
  assert.deepEqual(restoreDailyQuestions([q],state)[0],old);
  const paper=resolveDailyPaper([q],{paper:snapshotDailyPaper([old]),answers:state.answers});assert(paper.readOnly);assert.equal(paper.questions[0].prompt,old.prompt);
  const next=restartCurrentQuestion(state,q);assert.deepEqual(state,before);assert.equal(next.questionVersions[q.id],version);assert.equal(next.answers.other,'keep');assert.deepEqual(next.revisionHistory[q.id][0].graded,state.graded[q.id]);
  for(const key of Object.keys(old).filter(k=>!['prompt','explanation','responseContract','answerContract','contentVersion','previousVersions','diagnosticOverride'].includes(k)))assert.deepEqual(q[key],old[key]);
  const withoutSample=c=>{const x=structuredClone(c);delete x.sample;if(x.seasonContract)delete x.seasonContract.sample;return x;};assert.deepEqual(withoutSample(q.answerContract),withoutSample(old.answerContract));assert.deepEqual(withoutSample(q.responseContract),withoutSample(old.responseContract));
  for(const patch of [{contentVersion:'future'},{status:'draft'},{sourceRef:{type:'original'}},{sourceContent:{}},{prompt:'different prompt'}]){const x={...old,...patch};assert.equal(seasonComparisonCurrentItems([x],unit)[0],x);}
  assert.deepEqual(old,saved);
 }
 assert.equal(seasonComparisonCurrentItems(mod.items,unit),mod.items);assert.equal(seasonComparisonCurrentItems(mod.items,'other'),mod.items);assert.equal(seasonComparisonCurrentItems(null,unit),null);
 assert.equal(gradeDaily(changed.find(q=>q.workbookRef.no===68),'같게 / 날짜').status,'correct');assert.equal(gradeDaily(changed.find(q=>q.workbookRef.no===68),'날짜 / 같게').status,'wrong');assert.equal(gradeDaily(changed.find(q=>q.workbookRef.no===114),2).status,'correct');assert.equal(gradeDaily(changed.find(q=>q.workbookRef.no===80),'표와 설명').status,'review');
});

test('the workbook specifies noon comparisons and removes the contradictory wall angle without changing data or writing space',()=>{
 for(const key of Object.keys(priorWorkbook).filter(k=>k!=='questions'))assert.equal(workbook[key],priorWorkbook[key]);
 let count=0;
 for(let i=0;i<workbook.questions.length;i++){
  const q=workbook.questions[i],old=priorWorkbook.questions[i],edit=edits[q.no];if(!edit){assert.equal(q,old);continue;}count++;
  assert(q.prompt.includes('남중'));assert(!q.prompt.includes('같은 장소와 날짜, 시각'));assert(!q.prompt.includes('벽에 직각'));
  const restored={...q,prompt:old.prompt};if(edit.explanation)restored.explanation=old.explanation;if(edit.answer){assert(q.answer.includes('남중할 때가 아닌 자료'));assert.equal(q.responseContract.sample,q.answer);restored.answer=old.answer;restored.responseContract=old.responseContract;}assert.deepEqual(restored,old);
  for(const patch of [{contentVersion:'future'},{prompt:'other'},{sourceRef:{type:'original'}}]){const x={...old,...patch},w={...priorWorkbook,questions:[x]};assert.equal(withSeasonComparisonWorkbook(w),w);}
 }
 assert.equal(count,3);assert.equal(withSeasonComparisonWorkbook(workbook),workbook);
});

test('the actual classroom, web book, workbook and bank print modes use the same comparison conditions',async()=>{
 const book=await import('../data/book/c22-s62-u01.book.js'),classroom=await revisedClassroom(unit,book);assert.deepEqual(classroom.classroomItems,mod.items);
 const web=await revisedTextbook(unit,book),html=renderChapter(web.chapter,web.art,mod.similar),paper=await revisedTextbookPaper(unit);
 for(const q of changed)assert(html.includes(esc(q.prompt)));
 for(const mode of ['student','teacher','answers','quick']){
  const html=paper.workbookPaper({mode}),bank=mod.bankPaper({...mod,mode});
  if(['student','teacher'].includes(mode))for(const q of changed){assert(html.includes(esc(q.prompt)));assert(bank.includes(esc(q.prompt)));}
  if(mode==='student'){assert(!/class="ed-key"|class="ed-solution"/.test(html));assert(!/class="ed-key"|class="ed-solution"/.test(bank));assert(!html.includes(esc(edits[80].answer)));assert(!bank.includes(esc(edits[80].answer)));}
  if(['teacher','answers'].includes(mode)){assert(html.includes(esc(edits[80].answer)));assert(bank.includes(esc(edits[80].answer)));assert(html.includes(esc(edits[68].explanation)));assert(bank.includes(esc(edits[68].explanation)));}
 }
});
