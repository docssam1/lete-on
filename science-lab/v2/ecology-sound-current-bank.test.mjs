import test from'node:test';import assert from'node:assert/strict';import{execFileSync}from'node:child_process';import{fileURLToPath}from'node:url';
import{items as ecology}from'../data/units/c22-s42-u02.js';import{source as ecologySource}from'../data/units/c22-s42-u02.source.js';import{similar as ecologySimilar}from'../data/units/c22-s42-u02.similar.js';
import{items as sound}from'../data/units/c22-s32-u03.think.js';import{source as soundSource}from'../data/units/c22-s32-u03.source.js';import{similar as soundSimilar}from'../data/units/c22-s32-u03.similar.js';
import{ecologySoundCurrentItems,ECOLOGY_SOUND_BANK_VERSION}from'./ecology-sound-question-language.js';import{gradeDaily}from'./daily-grade.js';import{questionAtVersion,restoreDailyQuestions}from'./question-revision.js';import{snapshotDailyPaper,resolveDailyPaper,startDailyPaper}from'./daily-paper-state.js';
const groups=[['c22-s42-u02',ecology,ecologySource,ecologySimilar],['c22-s32-u03',sound,soundSource,soundSimilar]];
test('실제 두 로더·온라인 문항·인쇄 렌더러는 수업과 같은 맥락을 사용한다',()=>{
 const result=JSON.parse(execFileSync(process.execPath,['--experimental-vm-modules',fileURLToPath(new URL('./tests/ecology-sound-bank-loaders.mjs',import.meta.url))],{encoding:'utf8',timeout:15000,stdio:['ignore','pipe','pipe']}));assert.deepEqual(result.map(r=>r.changed),[1,1]);assert.deepEqual(result.map(r=>r.items),[92,76]);assert.deepEqual(result.map(r=>r.readabilityRevisions),[20,0]);assert(result.every(r=>r.currentBankAndClassroomAgree&&r.actualItemHtmlAndPrintExecuted));
});
test('두 맥락의 응답 계약·빈칸 판정과 이전 은행 문장·저장된 수업 시험지를 보존한다',()=>{
 for(const[unit,items,source,similar]of groups){
  const before=structuredClone(items),current=ecologySoundCurrentItems(items,unit),changed=current.filter(q=>q.contentVersion===ECOLOGY_SOUND_BANK_VERSION);assert.equal(changed.length,1);assert.deepEqual(items,before);
  for(const pool of[source,similar])ecologySoundCurrentItems(pool,unit).forEach((q,i)=>assert.equal(q,pool[i]));
  const q=changed[0],old=items.find(x=>x.id===q.id);assert.deepEqual(q.answerContract,old.answerContract);assert.deepEqual(q.taxonomy,old.taxonomy);assert.deepEqual(q.sourceRef,old.sourceRef);for(const[k,v]of Object.entries(old))assert.deepEqual(questionAtVersion(q,1)[k],v);
  assert.equal(ecologySoundCurrentItems([q],unit)[0],q);assert.deepEqual(ecologySoundCurrentItems(structuredClone(current),unit),current);const future={...q,contentVersion:'later',previousVersions:[...q.previousVersions,{version:q.contentVersion,...structuredClone(q)}]};assert.equal(ecologySoundCurrentItems([future],unit)[0],future);
  const answer=q.answerContract.type==='cloze'?['떨림']:q.answerContract.sample;if(q.answerContract.type==='cloze'){assert.equal(gradeDaily(q,answer).status,'correct');assert.equal(gradeDaily(q,['']).status,'blank');assert.equal(gradeDaily(q,['소음'],{vocab:new Set(['소음'])}).status,'wrong');assert.equal(gradeDaily(q,['확인할 움직임']).status,'review');}else assert.equal(gradeDaily(q,answer).status,'review');
  assert.deepEqual(restoreDailyQuestions([q],{answers:{[q.id]:answer}})[0].prompt,old.prompt);
  const{contentVersion,previousVersions,...legacyClass}=q,state={paper:snapshotDailyPaper([legacyClass]),answers:{[q.id]:answer},graded:{[q.id]:{status:'correct'}},self:{[q.id]:'sure'}},snapshot=structuredClone(state),resolved=resolveDailyPaper([q],state);assert(resolved.readOnly&&resolved.snapshot);assert.deepEqual(resolved.questions,[legacyClass]);
  const next=startDailyPaper(state,resolved,[q],'context-current-attempt');assert.deepEqual(state,snapshot);assert.deepEqual(next.paperHistory[0].state,state);assert.deepEqual(next.paperHistory[0].paper.questions,[legacyClass]);assert.equal(next.paperHistory[0].originalCompositionKnown,true);assert.deepEqual(next.paper.questions,[q]);assert.deepEqual(next.answers,{});
 }
 assert.equal(ecologySoundCurrentItems(ecology,'unrelated'),ecology);
});
