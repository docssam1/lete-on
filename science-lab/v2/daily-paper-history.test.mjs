import test from'node:test';import assert from'node:assert/strict';import fs from'node:fs';import{execFileSync}from'node:child_process';import{fileURLToPath}from'node:url';
import{revisedClassroom,classroomQuestions}from'./revised-lesson.js';import{withThink}from'./think-merge.js';import{resolveDailyPaper,snapshotDailyPaper}from'./daily-paper-state.js';
test('실제 Daily의 복구·별도 풀기·이전 답안 전환·교사 확인·사진 저장 이벤트를 대조한다',()=>{
 const r=JSON.parse(execFileSync(process.execPath,[fileURLToPath(new URL('./tests/daily-paper-history.mjs',import.meta.url))],{encoding:'utf8',timeout:15000}));for(const key of['failedArchiveKeepsOldState','oldGradesNotRecomputed','partialRecordsNotExpandedToFullPaper','explicitCurrentPaperArchivesOldState','historyCanReopenAndReturnWithoutWrites','oldTeacherCommentsAndReviewsPreserved','newReviewCarriesOriginalQuestion','photoKeysSeparated','oldPhotoPreserved','staleEventsIgnored','clozeMarkupReadOnly','unknownSnapshotDoesNotCrashOrWrite','assessmentStoreIsolated'])assert.equal(r[key],true,key);assert.equal(r.readOnlyRestoreWrites,0);assert(r.observersDisposed>=8);
});
test('실제 아홉 사고력 수업의 옛 확인 문항과 새 구성을 대조하고 예전 응답을 새 목록으로 늘리지 않는다',async()=>{
 const source=fs.readFileSync(new URL('./v2.js',import.meta.url),'utf8');
 for(const unit of['s31-u01','s31-u02','s31-u03','s31-u04','c22-s42-u02','c22-s32-u01','c22-s32-u02','c22-s32-u03','c22-s32-u04']){
  const book=await import(`../data/book/${unit}.book.js`),bank=await import(`../data/units/${unit}.js`),similar=await import(`../data/units/${unit}.similar.js`),data=source.includes(`withThink('${unit}'`)?await withThink(unit,{...bank,...similar}):{...bank,...similar},originalPool=[...data.similar,...data.items],mod=await revisedClassroom(unit,book),pool=classroomQuestions(mod,originalPool);
  const find=(list,key)=>list.find(q=>q.id===key)||list.find(q=>q.sourceRef?.of&&`${q.sourceRef.of.set}-${q.sourceRef.of.no}`===key),list=ch=>[...new Set([...(ch.check||[]),...(ch.formative?.items||[])])],old=list(book.chapter).map(k=>find(originalPool,k)),current=list(mod.chapter).map(k=>find(pool,k));assert(old.every(Boolean)&&current.every(Boolean));
  const state={answers:{[old[0].id]:0},graded:Object.fromEntries(old.map((q,i)=>[q.id,i?'blank':'wrong'])),first:{[old[0].id]:{status:'wrong',m:[]}},at:42},before=structuredClone(state),restored=resolveDailyPaper(current,state,{legacyList:old,pool:originalPool});
  assert.deepEqual(restored.questions.map(q=>q.id),old.map(q=>q.id));assert.deepEqual(state,before);assert.equal(resolveDailyPaper(current,{paper:snapshotDailyPaper(current),answers:{}}).readOnly,false);if(unit==='c22-s32-u04'){assert.equal(old.length,10);assert.equal(current.length,12);assert.equal(restored.readOnly,true);}
 }
});
