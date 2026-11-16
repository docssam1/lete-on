import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {withThink,loadJudge} from './think-merge.js';
import {revisedTextbookUnits} from './revised-textbook.js';
import {questionAtVersion,questionMisconceptions,restoreDailyQuestions,restartCurrentQuestion} from './question-revision.js';
import {gradeDaily,vocabOf} from './daily-grade.js';

const code=fs.readFileSync(new URL('./v2.js',import.meta.url),'utf8');
const a=code.indexOf('const UNITS = ')+14,b=code.indexOf('\n// 문제은행만',a);
const loaders=new vm.Script('('+code.slice(a,b).trim().replace(/;$/,'')+')',{importModuleDynamically:s=>import(new URL(s,new URL('./v2.js',import.meta.url)).href)}).runInContext(vm.createContext({withThink}));
const units=[];
for(const unit of revisedTextbookUnits)units.push({unit,mod:await loaders[unit](),judge:await loadJudge(unit)});
const fullKeys=['id','status','sourceRef','taxonomy','prompt','responseContract','answerContract','explanation'];
const metadata=new Set(['version','snapshotKind','contentVersion','previousVersions']);
const payload=q=>Object.fromEntries(Object.entries(q).filter(([key])=>!metadata.has(key)));
const full=[],partial=[];
for(const data of units)for(const q of [...data.mod.items,...(data.mod.similar||[]),...(data.mod.source||[])]){
 const seen=new Set();
 for(const snapshot of q.previousVersions||[]){
  assert(!seen.has(snapshot.version),q.id+' duplicate version');seen.add(snapshot.version);
  (fullKeys.every(key=>Object.hasOwn(snapshot,key))&&snapshot.id===q.id?full:partial).push({...data,q,snapshot});
 }
}

test('all stored full snapshots restore exactly their own fields while the two legacy deltas retain their context',()=>{
 assert.equal(units.length,32);assert.equal(full.length,3742);assert.equal(partial.length,2);
 assert.equal(full.filter(({q,snapshot})=>q.id==='c22-s62-u04-b123'&&snapshot.version==='20261104-career-book').length,1);
 assert.deepEqual(partial.map(({q,snapshot})=>[q.id,Object.keys(snapshot)]),[['c22-s32-u03-b25',['version','choices']],['c22-s32-u03-b41',['version','choices']]]);
 for(const {q,snapshot}of full){
  const before=JSON.stringify(q),restored=questionAtVersion(q,snapshot.version);
  assert.deepEqual(payload(restored),payload(snapshot),q.id+' '+snapshot.version);
  assert.equal(restored.contentVersion,snapshot.version);
  assert.equal(JSON.stringify(q),before,q.id+' mutation');
 }
 for(const {q,snapshot}of partial){
  const restored=questionAtVersion(q,snapshot.version);
  assert.deepEqual(restored.choices,snapshot.choices);
  assert.equal(restored.id,q.id);assert.deepEqual(restored.answerContract,q.answerContract);
  assert(restored.prompt);assert(restored.sourceRef);assert(restored.taxonomy);
 }
});

test('historic grading, answers, self checks and explicit retakes survive complete-snapshot restoration',()=>{
 for(const {q,snapshot,mod,judge}of full){
  const {version,snapshotKind,...fields}=snapshot,expected={...fields,contentVersion:version},restored=questionAtVersion(q,version),ac=expected.answerContract;
  const options={misc:questionMisconceptions(expected,mod.misc),judge,vocab:vocabOf([expected],mod.misc)};
  const actualOptions={...options,misc:questionMisconceptions(restored,mod.misc)};
  assert.deepEqual(actualOptions.misc,options.misc,q.id+' diagnosis');
  const answers=ac.type==='single-choice'?[...expected.choices.map((_,i)=>i),'']:ac.type==='multi-choice'?[ac.answers,[],[0],['other']]:ac.type==='cloze'?[ac.blanks.map(b=>b.answer),ac.blanks.map(()=>''),ac.blanks.map(()=>'other')]:ac.type==='table-fill'?[ac.rows.map(r=>r.answer),[],ac.rows.map(r=>r.answer.map(()=>'other'))]:[ac.sample??ac.answer??'learner response','','other'];
  for(const answer of answers)assert.deepEqual(gradeDaily(restored,answer,actualOptions),gradeDaily(expected,answer,options),q.id+' '+version);
  // Daily records have already passed through localStorage's JSON serialization.
  const graded=gradeDaily(expected,answers[0],options),state=JSON.parse(JSON.stringify({answers:{[q.id]:answers[0],other:'keep'},first:{[q.id]:graded},graded:{[q.id]:graded},self:{[q.id]:'sure'},questionVersions:{[q.id]:version},at:42})),saved=structuredClone(state);
  assert.deepEqual(payload(restoreDailyQuestions([q],state)[0]),payload(expected));assert.deepEqual(state,saved);
  const next=restartCurrentQuestion(state,q);assert.deepEqual(state,saved);assert.equal(next.answers.other,'keep');
  assert.equal(next.revisionHistory[q.id][0].version,version);assert.deepEqual(next.revisionHistory[q.id][0].answers,state.answers[q.id]);assert.deepEqual(next.revisionHistory[q.id][0].graded,state.graded[q.id]);assert.equal(next.revisionHistory[q.id][0].self,'sure');
 }
});
