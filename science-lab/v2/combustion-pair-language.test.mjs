import test from 'node:test';import assert from 'node:assert/strict';
import {items as raw} from '../data/units/c22-s62-u02.js';
import {combustionCurrentItems} from './combustion-question-language.js';
import {combustionReadableCurrentItems} from '../data/book/c22-s62-u02.editorial.js';
import {combustionPairCurrentItems,isReadableCombustionPair,combustionPairPrintQuestion,COMBUSTION_PAIR_LANGUAGE_VERSION} from './combustion-pair-language.js';
import {questionAtVersion,restoreDailyQuestions,pickedChoiceTexts,presentationRecord,questionMisconceptions,restartCurrentQuestion} from './question-revision.js';
import {gradeDaily} from './daily-grade.js';import {snapshotDailyPaper,resolveDailyPaper} from './daily-paper-state.js';
import {revisedClassroom,classroomQuestions} from './revised-lesson.js';import * as book from '../data/book/c22-s62-u02.book.js';
import {currentCombustionBankBook,combustionBankBook,bankPaper} from './combustion-bank-paper.js';
const base=combustionReadableCurrentItems(combustionCurrentItems(raw),'c22-s62-u02'),current=combustionPairCurrentItems(base),pairs=current.filter(isReadableCombustionPair),clone=x=>structuredClone(x),canonical=q=>({...q,contentVersion:q.contentVersion||1,previousVersions:q.previousVersions||[]}),withoutSamples=value=>Array.isArray(value)?value.map(withoutSamples):value&&typeof value==='object'?Object.fromEntries(Object.entries(value).filter(([key])=>key!=='sample').map(([key,v])=>[key,withoutSamples(v)])):value;
function responses(q){const c=q.responseContract;switch(c.kind){case 'single-choice':return [null,...q.choices.map((_,i)=>i)];case 'multi-choice':return [null,...Array.from({length:1<<q.choices.length},(_,mask)=>q.choices.map((_,i)=>i).filter(i=>mask&(1<<i))),[0,0]];case 'unordered-labels':return ['',c.answers,[...c.answers].reverse(),c.answers.join(' '),[c.answers[0],c.answers[0]],'다른 답'];case 'ordered-label-sequence':return ['',c.sequence,[...c.sequence].reverse(),'다른 답'];case 'ordered-term-parts':{const a=c.parts.map(p=>p.accepted[0]);return ['',a,[...a].reverse(),a.map(()=> '다른 답')];}case 'number-unit':return ['',c.value,c.value+c.units[0],(c.value+1)+c.units[0],c.value+'wrong'];case 'short-text':return ['',...c.accepted,'다른 답'];case 'written-explanation':return ['',c.sample,'내가 설명한 답'];default:throw Error(c.kind);}}

test('all70 current pairs use plain wording while preserving source, data, grading rules and every earlier version',()=>{
 const before=clone(base);assert.equal(pairs.length,70);assert.equal(current.filter((q,i)=>q===base[i]).length,128);const again=combustionPairCurrentItems(base);assert(current.every((q,i)=>q===again[i]));assert.equal(combustionPairCurrentItems(current),current);
 for(const q of pairs){const old=base.find(x=>x.id===q.id);assert.equal(q.contentVersion,COMBUSTION_PAIR_LANGUAGE_VERSION);assert.equal(q.previousVersions.length,(old.previousVersions||[]).length+1);assert.deepEqual(questionAtVersion(q,old.contentVersion||1),canonical(old));assert.deepEqual(questionAtVersion(q,1),canonical(questionAtVersion(old,1)));assert.deepEqual(q.sourceRef,old.sourceRef);assert.deepEqual(q.standards,old.standards);assert.deepEqual(q.evidence,old.evidence);assert.equal(q.releaseReady,false);assert.equal(q.originalPromptCopied,false);assert.equal(q.originalFigureReused,false);assert.deepEqual(withoutSamples(q.responseContract),withoutSamples(old.responseContract));assert.deepEqual(withoutSamples(q.answerContract),withoutSamples(old.answerContract));assert.notEqual(q.explanation,old.explanation);
  for(const response of responses(old))assert.equal(gradeDaily(q,response).status,gradeDaily(old,response).status,q.id);for(const [field,value]of Object.entries(old.givens||{}))if(typeof value==='object')assert.deepEqual(q.givens[field],value);
  const misc={typed:{[q.id]:{any:'M1'}},distractors:{[q.id]:{0:'M1'}},cloze:{},cells:{}};assert.deepEqual(questionMisconceptions(q,misc),questionMisconceptions(old,misc));
 }
 assert.deepEqual(base,before);assert.equal(pairs.filter(q=>q.previousVersions.at(-1).version===1).length,63);assert.equal(pairs.filter(q=>q.previousVersions.at(-1).version==='20261104-combustion-book').length,7);
 for(const n of ['006','019','036','054']){const q=pairs.find(q=>q.id.endsWith('v'+n));assert(q.givens.조건.includes('종류와 크기는 같게'));assert(q.givens.조건.includes('처음 불꽃의 상태는 비슷하게'));assert(q.givens.조건.includes('온도와 기체의 비율은 같으며'));assert(q.givens.조건.includes('계속 들어오지 않는다'));}
 const q66=pairs.find(q=>q.id.endsWith('v066'));assert(q66.explanation.includes('알맞은 초기 상황'));
 const q52=pairs.find(q=>q.id.endsWith('v052'));assert.equal(q52.prompt,'두 연료의 관찰 기록과 맞지 않는 문장을 고르세요.');assert.equal(q52.responseContract.answer,1);assert(!q52.explanation.includes('공통 관찰'));
});
test('future or unapproved questions are untouched and mutable display data cannot alter raw input or the reviewed patch',()=>{
 const original=base.find(q=>q.id.endsWith('v054'));
 for(const patch of [{status:'draft'},{sourceRef:{type:'original'}},{id:'c22-s62-u02-v999'},{contentVersion:'future'},{prompt:'새 질문'},{givens:{새:'자료'}},{responseContract:{kind:'single-choice',answer:4}},{standards:['새 기준']}]){const q={...clone(original),...patch},rows=[q];assert.equal(combustionPairCurrentItems(rows),rows);assert.equal(rows[0],q);}
 const other=[original];assert.equal(combustionPairCurrentItems(other,'other'),other);assert.equal(combustionPairCurrentItems(null),null);
 const input=clone(original),saved=clone(input),output=combustionPairCurrentItems([input])[0];output.choices[0]='변경';output.givens.조건='변경';assert.deepEqual(input,saved);assert.notEqual(combustionPairCurrentItems([clone(original)])[0].choices[0],'변경');
 const oldPrint=combustionBankBook.questions.find(q=>q.id===original.id),future={...pairs.find(q=>q.id===original.id),contentVersion:'future'};assert.equal(combustionPairPrintQuestion(oldPrint,future),oldPrint);assert.throws(()=>combustionPairPrintQuestion({...oldPrint,prompt:'다른 원고'},pairs.find(q=>q.id===original.id)));

});
test('old answers, grades, picked labels and restart history restore the original pair presentation',()=>{
 for(const q of pairs){const old=base.find(x=>x.id===q.id),response=responses(old).find(v=>v!==''&&v!=null),state={answers:{[q.id]:clone(response)},first:{[q.id]:{status:'wrong'}},graded:{[q.id]:gradeDaily(old,response)},questionVersions:old.contentVersion?{[q.id]:old.contentVersion}:{},unknown:{keep:true}},saved=clone(state);assert.deepEqual(restoreDailyQuestions([q],state)[0],canonical(old));assert.deepEqual(state,saved);if(old.choices){assert.deepEqual(pickedChoiceTexts(q,{picked:[0],presentationVersion:old.contentVersion||1}),[old.choices[0]]);assert.deepEqual(presentationRecord(q,{picked:0}).pickedTexts,[q.choices[0]]);}
  const restarted=restartCurrentQuestion(state,q);assert.equal(restarted.questionVersions[q.id],COMBUSTION_PAIR_LANGUAGE_VERSION);assert.equal(restarted.revisionHistory[q.id][0].version,old.contentVersion||1);assert.deepEqual(restarted.revisionHistory[q.id][0].answers,state.answers[q.id]);assert.deepEqual(state,saved);
 }
 const q=pairs[0],old=base.find(x=>x.id===q.id),state={paper:snapshotDailyPaper([old]),answers:{[q.id]:1}},saved=clone(state),resolved=resolveDailyPaper([q],state,{legacyList:[old],pool:[old,q]});assert.equal(resolved.readOnly,true);assert.deepEqual(resolved.questions.map(canonical),[canonical(old)]);assert.deepEqual(state,saved);
});
test('classroom and print share all70 current pairs and preserve the legacy figure models',async()=>{
 const mod=await revisedClassroom('c22-s62-u02',book),pool=classroomQuestions(mod,raw);assert.equal(mod.classroomItems.filter(isReadableCombustionPair).length,70);
 for(const q of pairs){const lesson=mod.classroomItems.find(x=>x.id===q.id),printed=currentCombustionBankBook.questions.find(x=>x.id===q.id);for(const key of ['prompt','choices','explanation','responseContract','answerContract']){assert.deepEqual(lesson[key],q[key]);assert.deepEqual(printed[key]??null,q[key]??null);}assert.equal(pool.find(x=>x.id===q.id),lesson);assert.notEqual(printed.explanation,combustionBankBook.questions.find(x=>x.id===q.id).explanation);}
 assert.deepEqual(currentCombustionBankBook.figureModels,combustionBankBook.figureModels);
 for(const key of Object.keys(combustionBankBook.figures).filter(k=>!k.includes('-quick-')))assert.equal(currentCombustionBankBook.figures[key],combustionBankBook.figures[key]);
 const teacher=bankPaper({mode:'teacher'});for(const q of pairs)assert(teacher.includes(q.explanation));const student=bankPaper({mode:'student'});assert(!/class="ed-key"|class="ed-solution"/.test(student));
});
