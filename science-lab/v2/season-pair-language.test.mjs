import test from 'node:test';import assert from 'node:assert/strict';
import {items as raw} from '../data/units/c22-s62-u01.js';
import {seasonCurrentItems} from './season-question-language.js';
import {seasonReadableCurrentItems} from '../data/book/c22-s62-u01.editorial.js';
import {seasonPairCurrentItems,isReadableSeasonPair,seasonPairPrintQuestion,SEASON_PAIR_LANGUAGE_VERSION} from './season-pair-language.js';
import {questionAtVersion,restoreDailyQuestions,pickedChoiceTexts,presentationRecord,questionMisconceptions,restartCurrentQuestion} from './question-revision.js';
import {gradeDaily} from './daily-grade.js';import {snapshotDailyPaper,resolveDailyPaper} from './daily-paper-state.js';
import {revisedClassroom,classroomQuestions} from './revised-lesson.js';import * as book from '../data/book/c22-s62-u01.book.js';
import {currentSeasonBankBook,seasonBankBook,bankPaper} from './season-bank-paper.js';
const base=seasonReadableCurrentItems(seasonCurrentItems(raw),'c22-s62-u01'),current=seasonPairCurrentItems(base),pairs=current.filter(isReadableSeasonPair),clone=x=>structuredClone(x),canonical=q=>({...q,contentVersion:q.contentVersion||1,previousVersions:q.previousVersions||[]}),withoutSamples=value=>Array.isArray(value)?value.map(withoutSamples):value&&typeof value==='object'?Object.fromEntries(Object.entries(value).filter(([key])=>key!=='sample').map(([key,v])=>[key,withoutSamples(v)])):value;
function responses(q){const c=q.responseContract;switch(c.kind){case 'single-choice':return [null,...q.choices.map((_,i)=>i)];case 'multi-choice':return [null,...Array.from({length:1<<q.choices.length},(_,mask)=>q.choices.map((_,i)=>i).filter(i=>mask&(1<<i))),[0,0]];case 'unordered-labels':return ['',c.answers,[...c.answers].reverse(),c.answers.join(' '),[c.answers[0],c.answers[0]],'다른 답'];case 'ordered-label-sequence':return ['',c.sequence,[...c.sequence].reverse(),'다른 답'];case 'ordered-term-parts':{const a=c.parts.map(p=>p.accepted[0]);return ['',a,[...a].reverse(),a.map(()=> '다른 답')];}case 'number-unit':return ['',c.value,c.value+c.units[0],(c.value+1)+c.units[0],c.value+'wrong'];case 'short-text':return ['',...c.accepted,'다른 답'];case 'written-explanation':return ['',c.sample,'내가 설명한 답'];default:throw Error(c.kind);}}

test('all70 current pairs use plain wording while preserving source, data, grading rules and every earlier version',()=>{
 const before=clone(base);assert.equal(pairs.length,70);assert.equal(current.filter((q,i)=>q===base[i]).length,128);const again=seasonPairCurrentItems(base);assert(current.every((q,i)=>q===again[i]));assert.equal(seasonPairCurrentItems(current),current);
 for(const q of pairs){const old=base.find(x=>x.id===q.id);assert.equal(q.contentVersion,SEASON_PAIR_LANGUAGE_VERSION);assert.equal(q.previousVersions.length,(old.previousVersions||[]).length+1);assert.deepEqual(questionAtVersion(q,old.contentVersion||1),canonical(old));assert.deepEqual(questionAtVersion(q,1),canonical(questionAtVersion(old,1)));assert.deepEqual(q.sourceRef,old.sourceRef);assert.deepEqual(q.standards,old.standards);assert.deepEqual(q.evidence,old.evidence);assert.equal(q.releaseReady,false);assert.equal(q.originalPromptCopied,false);assert.equal(q.originalFigureReused,false);assert.deepEqual(withoutSamples(q.responseContract),withoutSamples(old.responseContract));assert.deepEqual(withoutSamples(q.answerContract),withoutSamples(old.answerContract));assert.notEqual(q.explanation,old.explanation);
  for(const response of responses(old))assert.equal(gradeDaily(q,response).status,gradeDaily(old,response).status,q.id);for(const [field,value]of Object.entries(old.givens||{}))if(typeof value==='object')assert.deepEqual(q.givens[field],value);
  const misc={typed:{[q.id]:{any:'M1'}},distractors:{[q.id]:{0:'M1'}},cloze:{},cells:{}};assert.deepEqual(questionMisconceptions(q,misc),questionMisconceptions(old,misc));
 }
 assert.deepEqual(base,before);assert.equal(pairs.filter(q=>q.previousVersions.at(-1).version===1).length,37);assert.equal(pairs.filter(q=>q.previousVersions.at(-1).version==='20261104-season-book').length,33);
 const q11=pairs.find(q=>q.id.endsWith('v011'));assert(q11.prompt.includes('빛과 종이가 이루는 각'));assert(!q11.prompt.includes('입사각'));assert(!q11.explanation.includes('조작 변인'));assert.equal(q11.responseContract.accepted[0],'ㄷ');
 const q18=pairs.find(q=>q.id.endsWith('v018'));assert(q18.explanation.includes('90°−28°=62°'));assert(q18.explanation.includes('90°−51°=39°'));assert(!q18.explanation.includes('여각'));
 const q54=pairs.find(q=>q.id.endsWith('v054'));assert(q54.givens.조건.includes('남중 시각은 12:40'));assert.equal(q54.responseContract.accepted[0],'ㄴ');
 const q63=pairs.find(q=>q.id.endsWith('v063'));assert(q63.prompt.includes('기울어진 B 모형'));assert.deepEqual(q63.responseContract.answers,[0,2]);
 for(const n of ['015','028']){const q=pairs.find(q=>q.id.endsWith('v'+n));assert(q.explanation.includes('그날 태양이 가장 높을 때의 고도'));}
 const q66=pairs.find(q=>q.id.endsWith('v066'));assert(q66.prompt.includes('공전 궤도면에 수직'));assert.deepEqual(q66.responseContract.parts.map(x=>x.value),[54,54]);

});
test('future or unapproved questions are untouched and mutable display data cannot alter raw input or the reviewed patch',()=>{
 const original=base.find(q=>q.id.endsWith('v063'));
 for(const patch of [{status:'draft'},{sourceRef:{type:'original'}},{id:'c22-s62-u01-v999'},{contentVersion:'future'},{prompt:'새 질문'},{givens:{새:'자료'}},{responseContract:{kind:'single-choice',answer:4}},{standards:['새 기준']}]){const q={...clone(original),...patch},rows=[q];assert.equal(seasonPairCurrentItems(rows),rows);assert.equal(rows[0],q);}
 const other=[original];assert.equal(seasonPairCurrentItems(other,'other'),other);assert.equal(seasonPairCurrentItems(null),null);
 const input=clone(original),saved=clone(input),output=seasonPairCurrentItems([input])[0];output.choices[0]='변경';output.givens.조건='변경';assert.deepEqual(input,saved);assert.notEqual(seasonPairCurrentItems([clone(original)])[0].choices[0],'변경');
 const oldPrint=seasonBankBook.questions.find(q=>q.id===original.id),future={...pairs.find(q=>q.id===original.id),contentVersion:'future'};assert.equal(seasonPairPrintQuestion(oldPrint,future),oldPrint);assert.throws(()=>seasonPairPrintQuestion({...oldPrint,prompt:'다른 원고'},pairs.find(q=>q.id===original.id)));

});
test('old answers, grades, picked labels and restart history restore the original pair presentation',()=>{
 for(const q of pairs){const old=base.find(x=>x.id===q.id),response=responses(old).find(v=>v!==''&&v!=null),state={answers:{[q.id]:clone(response)},first:{[q.id]:{status:'wrong'}},graded:{[q.id]:gradeDaily(old,response)},questionVersions:old.contentVersion?{[q.id]:old.contentVersion}:{},unknown:{keep:true}},saved=clone(state);assert.deepEqual(restoreDailyQuestions([q],state)[0],canonical(old));assert.deepEqual(state,saved);if(old.choices){assert.deepEqual(pickedChoiceTexts(q,{picked:[0],presentationVersion:old.contentVersion||1}),[old.choices[0]]);assert.deepEqual(presentationRecord(q,{picked:0}).pickedTexts,[q.choices[0]]);}
  const restarted=restartCurrentQuestion(state,q);assert.equal(restarted.questionVersions[q.id],SEASON_PAIR_LANGUAGE_VERSION);assert.equal(restarted.revisionHistory[q.id][0].version,old.contentVersion||1);assert.deepEqual(restarted.revisionHistory[q.id][0].answers,state.answers[q.id]);assert.deepEqual(state,saved);
 }
 const q=pairs[0],old=base.find(x=>x.id===q.id),state={paper:snapshotDailyPaper([old]),answers:{[q.id]:1}},saved=clone(state),resolved=resolveDailyPaper([q],state,{legacyList:[old],pool:[old,q]});assert.equal(resolved.readOnly,true);assert.deepEqual(resolved.questions.map(canonical),[canonical(old)]);assert.deepEqual(state,saved);
});
test('classroom and print share all70 current pairs and preserve the legacy figure models',async()=>{
 const mod=await revisedClassroom('c22-s62-u01',book),pool=classroomQuestions(mod,raw);assert.equal(mod.classroomItems.filter(isReadableSeasonPair).length,70);
 for(const q of pairs){const lesson=mod.classroomItems.find(x=>x.id===q.id),printed=currentSeasonBankBook.questions.find(x=>x.id===q.id);for(const key of ['prompt','choices','explanation','responseContract','answerContract']){assert.deepEqual(lesson[key],q[key]);assert.deepEqual(printed[key]??null,q[key]??null);}assert.equal(pool.find(x=>x.id===q.id),lesson);assert.notEqual(printed.explanation,seasonBankBook.questions.find(x=>x.id===q.id).explanation);}
 assert.deepEqual(currentSeasonBankBook.figureModels,seasonBankBook.figureModels);
 for(const key of Object.keys(seasonBankBook.figures).filter(k=>!k.includes('-quick-')))assert.equal(currentSeasonBankBook.figures[key],seasonBankBook.figures[key]);
 const teacher=bankPaper({mode:'teacher'});for(const q of pairs)assert(teacher.includes(q.explanation.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;')),q.id);const student=bankPaper({mode:'student'});assert(!/class="ed-key"|class="ed-solution"/.test(student));
});
