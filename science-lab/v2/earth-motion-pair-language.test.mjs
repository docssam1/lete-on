import {observationCurrentItems} from '../data/book/observation-language.js';
import test from 'node:test';import assert from 'node:assert/strict';
import {items as raw} from '../data/units/c22-s61-u04.js';
import {earthMotionCurrentItems} from './earth-motion-question-language.js';
import {earthMotionReadableCurrentItems} from '../data/book/c22-s61-u04.editorial.js';
import {earthMotionPairCurrentItems,isReadableEarthMotionPair,earthMotionPairPrintQuestion,EARTH_MOTION_PAIR_LANGUAGE_VERSION} from './earth-motion-pair-language.js';
import {questionAtVersion,restoreDailyQuestions,pickedChoiceTexts,presentationRecord,questionMisconceptions,restartCurrentQuestion} from './question-revision.js';
import {gradeDaily} from './daily-grade.js';import {snapshotDailyPaper,resolveDailyPaper} from './daily-paper-state.js';
import {revisedClassroom,classroomQuestions} from './revised-lesson.js';import * as book from '../data/book/c22-s61-u04.book.js';
import {currentEarthMotionBankBook,earthMotionBankBook,bankPaper} from './earth-motion-bank-paper.js';
const base=earthMotionReadableCurrentItems(observationCurrentItems(earthMotionCurrentItems(raw),'c22-s61-u04'),'c22-s61-u04'),current=earthMotionPairCurrentItems(base),pairs=current.filter(isReadableEarthMotionPair),clone=x=>structuredClone(x),canonical=q=>({...q,contentVersion:q.contentVersion||1,previousVersions:q.previousVersions||[]}),withoutSamples=value=>Array.isArray(value)?value.map(withoutSamples):value&&typeof value==='object'?Object.fromEntries(Object.entries(value).filter(([key])=>key!=='sample').map(([key,v])=>[key,withoutSamples(v)])):value;
function responses(q){const c=q.responseContract;switch(c.kind){case 'single-choice':return [null,...q.choices.map((_,i)=>i)];case 'multi-choice':return [null,...Array.from({length:1<<q.choices.length},(_,mask)=>q.choices.map((_,i)=>i).filter(i=>mask&(1<<i))),[0,0]];case 'unordered-labels':return ['',c.answers,[...c.answers].reverse(),c.answers.join(' '),[c.answers[0],c.answers[0]],'다른 답'];case 'ordered-label-sequence':return ['',c.sequence,[...c.sequence].reverse(),'다른 답'];case 'ordered-word-parts':case 'ordered-term-parts':{const a=c.parts.map(p=>p.accepted[0]);return ['',a,a.join(' / '),[...a].reverse(),[...a].reverse().join(' / '),a.map(()=> '다른 답')];}case 'number-unit':return ['',c.value,c.value+c.units[0],(c.value+1)+c.units[0],c.value+'wrong'];case 'short-text':return ['',...c.accepted,'다른 답'];case 'written-explanation':return ['',c.sample,'내가 설명한 답'];default:throw Error(c.kind);}}

test('all39 current pairs use plain wording while preserving source, data, grading rules and every earlier version',()=>{
 const before=clone(base);assert.equal(pairs.length,39);assert.equal(current.filter((q,i)=>q===base[i]).length,128);const again=earthMotionPairCurrentItems(base);assert(current.every((q,i)=>q===again[i]));assert.equal(earthMotionPairCurrentItems(current),current);
 for(const q of pairs){const old=base.find(x=>x.id===q.id);assert.equal(q.contentVersion,EARTH_MOTION_PAIR_LANGUAGE_VERSION);assert.equal(q.previousVersions.length,(old.previousVersions||[]).length+1);assert.deepEqual(questionAtVersion(q,old.contentVersion||1),canonical(old));assert.deepEqual(questionAtVersion(q,1),canonical(questionAtVersion(old,1)));assert.deepEqual(q.sourceRef,old.sourceRef);assert.deepEqual(q.standards,old.standards);assert.deepEqual(q.evidence,old.evidence);assert.equal(q.releaseReady,false);assert.equal(q.originalPromptCopied,false);assert.equal(q.originalFigureReused,false);assert.deepEqual(withoutSamples(q.responseContract),withoutSamples(old.responseContract));assert.deepEqual(withoutSamples(q.answerContract),withoutSamples(old.answerContract));assert.notEqual(q.explanation,old.explanation);
  for(const response of responses(old))assert.equal(gradeDaily(q,response).status,gradeDaily(old,response).status,q.id);for(const [field,value]of Object.entries(old.givens||{}))if(typeof value==='object')assert.deepEqual(q.givens[field],value);
  const misc={typed:{[q.id]:{any:'M1'}},distractors:{[q.id]:{0:'M1'}},cloze:{},cells:{}};assert.deepEqual(questionMisconceptions(q,misc),questionMisconceptions(old,misc));
 }
 assert.deepEqual(base,before);assert.equal(pairs.filter(q=>q.previousVersions.at(-1).version===1).length,39);
 const q3=pairs.find(q=>q.id.endsWith('v003'));assert(q3.explanation.includes('북극 위'));assert(q3.explanation.includes('반시계'));assert.equal(q3.responseContract.answer,2);
 const q15=pairs.find(q=>q.id.endsWith('v015'));assert(q15.explanation.includes('9월 15일'));assert(q15.explanation.includes('가상 별무리'));assert.equal(q15.responseContract.actualPerformanceMustNotBeInferred,true);
 const q17=pairs.find(q=>q.id.endsWith('v017'));assert(!q17.givens['자료 종류'].includes('저장'));assert(q17.givens['자료 종류'].includes('직접 관찰한 결과는 아니다'));assert.equal(q17.responseContract.answer,4);
 const q29=pairs.find(q=>q.id.endsWith('v029'));assert(q29.givens['㉠'].includes('약'));assert(q29.givens.조건.includes('북극 위'));assert.deepEqual(q29.responseContract.parts.map(p=>p.accepted[0]),['하루','반시계']);
 const q37=pairs.find(q=>q.id.endsWith('v037'));assert(!q37.explanation.includes('원문'));assert(q37.prompt.includes('북극 위'));assert(q37.prompt.includes('평면의 북쪽 위'));
 for(const q of pairs){const c=q.responseContract,value=c.teacherRequired?c.sample:c.kind==='single-choice'?c.answer:c.kind==='multi-choice'?c.answers:c.kind==='ordered-word-parts'?c.parts.map(p=>p.accepted[0]).join(' / '):c.accepted[0];assert.equal(gradeDaily(q,value).status,c.teacherRequired?'review':'correct',q.id);}

});
test('future or unapproved questions are untouched and mutable display data cannot alter raw input or the reviewed patch',()=>{
 const original=base.find(q=>q.id.endsWith('v027'));
 for(const patch of [{status:'draft'},{sourceRef:{type:'original'}},{id:'c22-s61-u04-v999'},{contentVersion:'future'},{prompt:'새 질문'},{givens:{새:'자료'}},{responseContract:{kind:'single-choice',answer:4}},{standards:['새 기준']}]){const q={...clone(original),...patch},rows=[q];assert.equal(earthMotionPairCurrentItems(rows),rows);assert.equal(rows[0],q);}
 const other=[original];assert.equal(earthMotionPairCurrentItems(other,'other'),other);assert.equal(earthMotionPairCurrentItems(null),null);
 const input=clone(original),saved=clone(input),output=earthMotionPairCurrentItems([input])[0];output.choices[0]='변경';output.givens.조건='변경';assert.deepEqual(input,saved);assert.notEqual(earthMotionPairCurrentItems([clone(original)])[0].choices[0],'변경');
 const oldPrint=earthMotionBankBook.questions.find(q=>q.id===original.id),future={...pairs.find(q=>q.id===original.id),contentVersion:'future'};assert.equal(earthMotionPairPrintQuestion(oldPrint,future),oldPrint);assert.throws(()=>earthMotionPairPrintQuestion({...oldPrint,prompt:'다른 원고'},pairs.find(q=>q.id===original.id)));

});
test('old answers, grades, picked labels and restart history restore the original pair presentation',()=>{
 for(const q of pairs){const old=base.find(x=>x.id===q.id),response=responses(old).find(v=>v!==''&&v!=null),state={answers:{[q.id]:clone(response)},first:{[q.id]:{status:'wrong'}},graded:{[q.id]:gradeDaily(old,response)},questionVersions:old.contentVersion?{[q.id]:old.contentVersion}:{},unknown:{keep:true}},saved=clone(state);assert.deepEqual(restoreDailyQuestions([q],state)[0],canonical(old));assert.deepEqual(state,saved);if(old.choices){assert.deepEqual(pickedChoiceTexts(q,{picked:[0],presentationVersion:old.contentVersion||1}),[old.choices[0]]);assert.deepEqual(presentationRecord(q,{picked:0}).pickedTexts,[q.choices[0]]);}
  const restarted=restartCurrentQuestion(state,q);assert.equal(restarted.questionVersions[q.id],EARTH_MOTION_PAIR_LANGUAGE_VERSION);assert.equal(restarted.revisionHistory[q.id][0].version,old.contentVersion||1);assert.deepEqual(restarted.revisionHistory[q.id][0].answers,state.answers[q.id]);assert.deepEqual(state,saved);
 }
 const q=pairs[0],old=base.find(x=>x.id===q.id),state={paper:snapshotDailyPaper([old]),answers:{[q.id]:1}},saved=clone(state),resolved=resolveDailyPaper([q],state,{legacyList:[old],pool:[old,q]});assert.equal(resolved.readOnly,true);assert.deepEqual(resolved.questions.map(canonical),[canonical(old)]);assert.deepEqual(state,saved);
});
test('classroom and print share all39 current pairs and preserve the legacy figure models',async()=>{
 const mod=await revisedClassroom('c22-s61-u04',book),pool=classroomQuestions(mod,raw);assert.equal(mod.classroomItems.filter(isReadableEarthMotionPair).length,39);
 for(const q of pairs){const lesson=mod.classroomItems.find(x=>x.id===q.id),printed=currentEarthMotionBankBook.questions.find(x=>x.id===q.id);for(const key of ['prompt','choices','explanation','responseContract','answerContract']){assert.deepEqual(lesson[key],q[key]);assert.deepEqual(printed[key]??null,q[key]??null);}assert.equal(pool.find(x=>x.id===q.id),lesson);assert.notEqual(printed.explanation,earthMotionBankBook.questions.find(x=>x.id===q.id).explanation);}
 assert.deepEqual(currentEarthMotionBankBook.figureModels,earthMotionBankBook.figureModels);
 for(const q of currentEarthMotionBankBook.questions.filter(q=>pairs.some(p=>p.id===q.id)&&q.figure))assert.equal(currentEarthMotionBankBook.figures[q.figure],earthMotionBankBook.figures[q.figure]);
 const teacher=bankPaper({mode:'teacher'});for(const q of pairs)assert(teacher.includes(q.explanation.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')),q.id);const student=bankPaper({mode:'student'});assert(!/class="ed-key"|class="ed-solution"/.test(student));
});
