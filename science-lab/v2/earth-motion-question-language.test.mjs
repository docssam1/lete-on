import test from'node:test';import assert from'node:assert/strict';import{execFileSync}from'node:child_process';import{fileURLToPath}from'node:url';
import{items}from'../data/units/c22-s61-u04.js';import{workbook}from'../data/book/c22-s61-u04.workbook.js';import{bankBook}from'../data/book/c22-s61-u04.bank-book.js';
import{earthMotionCurrentItems,EARTH_MOTION_QUESTION_VERSION}from'./earth-motion-question-language.js';import{earthMotionBankBook,bankPaper}from'./earth-motion-bank-paper.js';
import{judgeItem}from'./judge.js';import{gradeDaily}from'./daily-grade.js';import{questionAtVersion,restoreDailyQuestions,restartCurrentQuestion,pickedChoiceTexts}from'./question-revision.js';
const current=earthMotionCurrentItems(items),byNo=n=>current.find(q=>q.bookQuestionId?.endsWith(String(n).padStart(3,'0')));
const valid=c=>c.teacherRequired?c.sample||'관찰한 것을 그림과 글로 나타냈어요.':c.kind==='single-choice'?c.answer:c.kind==='multi-choice'?c.answers:c.kind==='ordered-label-parts'?c.answers.join(', '):c.kind==='ordered-label-sequence'?c.sequence.join(' → '):c.kind==='ordered-term-parts'||c.kind==='ordered-word-parts'?c.parts.map(p=>p.accepted[0]).join(' / '):c.accepted[0];
test('현재 일곱 문항의 발문·보기·표·정답 계약과 진단만 바꾸고 원래 160객체를 보존한다',()=>{
 const original=JSON.stringify(items);assert.equal(current.length,167);assert.equal(current.filter((q,i)=>q===items[i]).length,160);assert.equal(current.filter(q=>q.contentVersion===EARTH_MOTION_QUESTION_VERSION).length,7);
 for(const q of current){if(!q.previousVersions)continue;const w=workbook.questions.find(w=>w.id===q.bookQuestionId);assert.equal(q.prompt,w.prompt);assert.deepEqual(q.answerContract.earthAuthoredContract,w.responseContract);assert.deepEqual(q.responseContract,w.responseContract);const restored=questionAtVersion(q,1);for(const[k,v]of Object.entries(items.find(it=>it.id===q.id)))assert.deepEqual(restored[k],v);assert.equal(earthMotionCurrentItems([q])[0],q);assert.deepEqual(earthMotionCurrentItems([JSON.parse(JSON.stringify(q))])[0],q);}
 assert.equal(byNo(118).type,'T06');assert(byNo(118).answerContract.accepted.includes('공전'));assert.deepEqual(byNo(119).givens.보기.행,workbook.questions[118].given.map(v=>[v]));assert.deepEqual(byNo(124).givens.자료표,workbook.questions[123].table);assert.equal(JSON.stringify(items),original);
});
test('167응답은 동일한 기기 내 판정과 Daily로 닫힌116개·교사 확인51개를 구별한다',()=>{
 let closed=0,open=0;for(const q of current){const ac=q.answerContract,c=ac.earthAuthoredContract||ac.earthMotionContract,value=valid(c),expected=c.teacherRequired?'review':'ok';assert.equal(judgeItem({text:value,ac}).st,expected,q.id);assert.equal(gradeDaily(q,value).status,c.teacherRequired?'review':'correct',q.id);assert.equal(judgeItem({text:'',ac}).st,'empty',q.id);assert.equal(gradeDaily(q,'').status,'blank',q.id);c.teacherRequired?open++:closed++;}assert.equal(closed,116);assert.equal(open,51);
 for(const q of current.filter(q=>q.responseContract.teacherRequired)){assert.equal(judgeItem({text:'완료',ac:q.answerContract}).st,'review');assert.equal(gradeDaily(q,'완료').status,'review');}
});
test('빈칸 이름표·연결 번호·순서·중복 선택·부정 표현을 엄격히 구별한다',()=>{
 const q=byNo(118);for(const value of['공전','지구의 공전','㉠ 공전','(1) 공전','공전이에요'])assert.equal(judgeItem({text:value,ac:q.answerContract}).st,'ok',value);
 for(const value of['야외','자전','공전이 아니에요','㉠ 공전 / ㉠ 공전','㉡ 공전'])assert.equal(judgeItem({text:value,ac:q.answerContract}).st,'no',value);
 const match=byNo(119);for(const value of['ㄷ, ㄱ, ㄴ','(3) ㄴ / (1) ㄷ / (2) ㄱ'])assert.equal(judgeItem({text:value,ac:match.answerContract}).st,'ok');for(const value of['ㄱ ㄷ ㄴ','(1) ㄷ (1) ㄱ (3) ㄴ','(1) ㄷ (2) ㄱ'])assert.equal(judgeItem({text:value,ac:match.answerContract}).st,'no');
 const multi=byNo(115);for(const value of[[1,1],[1,4,4],[1,3],[-1,4]])assert.equal(gradeDaily(multi,value).status,'wrong');assert.equal(gradeDaily(multi,[4,1]).status,'correct');
 for(const q of current.filter(q=>q.responseContract.kind==='ordered-term-parts'&&q.responseContract.parts.length>1)){const p=q.responseContract.parts,values=p.map(x=>x.accepted[0]);assert.equal(judgeItem({text:values.slice().reverse(),ac:q.answerContract}).st,'no',q.id);}
});
test('저장된 이전 답안은 같은 문항의 이전 내용으로 읽고 명시적 재시도 때만 새 내용으로 바꾼다',()=>{
 const q=byNo(118),old=items.find(it=>it.id===q.id),state={answers:{[q.id]:'야외'},first:{[q.id]:'야외'},graded:{[q.id]:{status:'correct'}},self:{[q.id]:'sure'},at:123};const bytes=JSON.stringify(state),saved=restoreDailyQuestions([q],state)[0];assert.equal(saved.prompt,old.prompt);assert.equal(judgeItem({text:state.answers[q.id],ac:saved.answerContract}).st,'ok');assert.equal(judgeItem({text:state.answers[q.id],ac:q.answerContract}).st,'no');
 const next=restartCurrentQuestion(state,q);assert.equal(JSON.stringify(state),bytes);assert.equal(next.revisionHistory[q.id][0].answers,'야외');assert.equal(next.revisionHistory[q.id][0].graded.status,'correct');assert.equal(next.questionVersions[q.id],EARTH_MOTION_QUESTION_VERSION);assert(!Object.hasOwn(next.answers,q.id));assert.equal(restoreDailyQuestions([q],next)[0],q);
 const m=byNo(115),previous=items.find(it=>it.id===m.id);assert.deepEqual(pickedChoiceTexts(m,{picked:[1],presentationVersion:1}),[previous.choices[1]]);assert.deepEqual(pickedChoiceTexts(m,{picked:[1],presentationVersion:EARTH_MOTION_QUESTION_VERSION}),[m.choices[1]]);
});
test('학생·교사 문항집과 빠른표도 현재 일곱 문항을 쓰며 raw 문항집과 원래 교재 원고를 바꾸지 않는다',()=>{
 const raw=JSON.stringify(bankBook);assert.equal(earthMotionBankBook.questions.filter((q,i)=>q===bankBook.questions[i]).length,160);for(const no of[115,118,119,120,124,126,128]){const q=earthMotionBankBook.questions.find(q=>q.sourceBookNo===no),w=workbook.questions[no-1];assert.equal(q.prompt,w.prompt);assert.equal(q.no,no+39);assert.equal(q.id,byNo(no).id);assert.deepEqual(q.answerContract,byNo(no).answerContract);assert.equal(q.answer,w.answer);}
 assert.deepEqual(workbook.questions[117].slots,workbook.questions[117].responseContract.parts);assert.deepEqual(workbook.questions[118].given,workbook.questions[118].options);assert.deepEqual(workbook.questions[119].given,workbook.questions[119].options);assert(!JSON.stringify(workbook.questions[119]).includes('공전 위치/밤의 시선'));
 for(const mode of['student','teacher','answers','quick']){const html=bankPaper({mode});assert(!/undefined|\[object Object\]/.test(html));if(mode==='student')assert(!html.includes('class="ed-key"'));if(mode==='student'||mode==='teacher'){assert(html.includes('ㄱ. 지구가 태양 둘레를 공전'));assert(!html.includes('ㄱ. 자전축/하루 또는 태양/일 년'));}if(mode==='quick'){assert(html.includes('㉠ 공전'));assert(!html.includes('㉠ 야외'));}}
 assert.equal(JSON.stringify(bankBook),raw);
});
test('실제 온라인 입력·수업 쓰기·진단은 현재 계약을 사용하고 이전 오개념을 잘못 해소하지 않는다',()=>{
 const r=JSON.parse(execFileSync(process.execPath,[fileURLToPath(new URL('./tests/earth-motion-question-diagnostics.mjs',import.meta.url))],{encoding:'utf8',timeout:15000}));assert.equal(r.onlineStates,6);assert.equal(r.deckStates,5);assert(r.oldDiagnosticPreserved);assert.equal(r.actualStudentStorageReads,0);assert.equal(r.actualStudentStorageWrites,0);
});
