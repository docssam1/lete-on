import{guidanceParticleCurrentItems}from'../data/book/term-particle-language.js';
import{STUDENT_SCIENCE_LANGUAGE_VERSION}from'../data/book/student-science-language.js';
import test from'node:test';import assert from'node:assert/strict';import{execFileSync}from'node:child_process';import{fileURLToPath}from'node:url';
import{workbook as w,guidanceParticlePriorWorkbook as priorWorkbook}from'../data/book/c22-s62-u04.workbook.js';import{questions as raw}from'../data/book/c22-s62-u04.questions.js';import{items}from'../data/units/c22-s62-u04.js';
import{careerCurrentItems,CAREER_CHANGED_NUMBERS,CAREER_QUESTION_VERSION}from'./career-question-language.js';import{CAREER_QUESTION_PATCHES,careerSourceNotes}from'../data/book/c22-s62-u04.editorial.js';
import{careerBankBook}from'./career-bank-paper.js';import*as misc from'../data/units/c22-s62-u04.misc.js';import{gradeDaily}from'./daily-grade.js';import{judgeItem}from'./judge.js';import{revisedTextbookPaper}from'./revised-textbook.js';
import{semanticChoices,semanticMultiple,otherClosed}from'./tests/fixtures/career-independent-answers.mjs';import{auditRevisionDiagnostics}from'../bank/audit-revision-diagnostics.js';
const current=careerCurrentItems(items),byNo=n=>current[n-1],run=file=>JSON.parse(execFileSync(process.execPath,['--experimental-vm-modules',fileURLToPath(new URL('./tests/'+file,import.meta.url))],{encoding:'utf8',timeout:15000,stdio:['ignore','pipe','pipe']}));
const good=c=>c.kind==='single-choice'?c.answer:c.kind==='multi-choice'?c.answers:c.kind==='ordered-label-sequence'?c.sequence:c.kind==='ordered-term-parts'?c.parts.map(p=>p.accepted[0]):c.sample;
test('2022의 두 목표·127쪽·128문항8형식과12활동·큰 그림 칸을 갖춘다',()=>{
 assert.equal(w.pages.length,127);assert.equal(w.teacherStudentPages.length,128);assert.equal(w.teacherPages.length,54);assert.equal(w.quickPages.length,6);assert.equal(w.questions.length,128);
 assert.deepEqual([...new Set(w.questions.map(q=>q.standard))],['6과16-01','6과16-02']);assert.equal(new Set(w.questions.map(q=>q.bookResponseForm)).size,8);for(const f of new Set(w.questions.map(q=>q.bookResponseForm)))assert.equal(w.questions.filter(q=>q.bookResponseForm===f).length,16);
 assert.equal(w.pages.filter(p=>p.kind.startsWith('activity')).length,12);assert.equal(w.questions.filter(q=>q.form==='draw'&&q.drawing==='large').length,16);
 assert(w.pages[0].blocks.some(b=>b.title==='워밍업'));assert(w.pages[0].blocks.some(b=>b.type==='table'&&b.heads[0]==='이름'));assert(!JSON.stringify(w.pages[1]).includes('6과16-'));
 assert.equal(new Set(w.pages.map(p=>p.rail[1].text)).size,78);for(let i=0;i<127;i++)assert.deepEqual(w.pages[i].rail,w.teacherStudentPages[i].rail);
 for(const p of w.pages.filter(p=>p.kind==='concept'))assert(p.blocks.some(b=>b.type==='field'&&b.lines>=4));
 assert.deepEqual(w.teacherPages.slice(-4).map(p=>p.title),w.pages.slice(-4).map(p=>p.title));
});
test('19문항은 미래 예상과 직업 속 과학으로 고치고 독립 기대 답·단위·순서를 대조한다',()=>{
 assert.deepEqual(Object.keys(CAREER_QUESTION_PATCHES).map(Number),[27,51,100,...Array.from({length:16},(_,i)=>113+i)]);
 const expected={27:['8일','예상'],51:['함께','알 수 없다'],100:['수정','추가 조사'],113:4,114:2,115:['빛','진동'],116:['수분','온도'],117:['ㄴ','ㄱ','ㄷ'],118:['ㄷ','ㄱ','ㄴ'],119:['ㄴ','ㄱ','ㄷ'],120:['ㄱ','ㄴ','ㄷ'],121:[1,2,3],122:[0,1,4],123:['35℃','7℃'],124:['2개','2개']};
 for(const[n,answer]of Object.entries(expected))assert.equal(gradeDaily(byNo(+n),answer).status,'correct',n);
 for(const[n,answer]of[[27,['8일','미관측']],[51,['함께','미확인']],[100,['수정','미확인']],[116,['검토','미실행']],[119,['ㄱ','ㄴ','ㄷ']],[123,['35','7']],[123,['35℃','7분']],[124,['2','2']]])assert.equal(gradeDaily(byNo(n),answer).status,'wrong',n);
 assert.equal(gradeDaily(byNo(123),['35°C','7°C']).status,'correct');for(const n of[125,126,127,128])assert.equal(gradeDaily(byNo(n),byNo(n).responseContract.sample).status,'review');
});
test('이전 집필의 독립96기대값을 바탕으로 유지한 문항의 의미와 현재96자동/32교사 경계를 검증한다',()=>{
 const expected={...otherClosed};for(const[n,text]of Object.entries(semanticChoices))expected[n]=raw[n-1].choices.indexOf(text);for(const[n,texts]of Object.entries(semanticMultiple))expected[n]=texts.map(s=>raw[n-1].choices.indexOf(s));assert.equal(Object.keys(expected).length,96);expected[67]=['일','과학'];
 for(const[n,answer]of Object.entries(expected))if(!Object.hasOwn(CAREER_QUESTION_PATCHES,n))assert.equal(gradeDaily(byNo(+n),answer).status,'correct',n);
 let auto=0,review=0;for(const q of current){const text=good(q.responseContract),wanted=q.responseContract.teacherRequired?'review':'correct';assert.equal(gradeDaily(q,text).status,wanted,q.id);assert.equal(judgeItem({text,ac:q.answerContract}).st,wanted==='correct'?'ok':'review',q.id);assert.equal(gradeDaily(q,'').status,'blank');q.responseContract.teacherRequired?review++:auto++;}assert.deepEqual({auto,review},{auto:96,review:32});
});
test('현재74원고와 이전 답·계약을 보존하고 문항집/빠른표도 같은 원고를 쓴다',async()=>{
 const old=JSON.stringify(items);assert.equal(CAREER_CHANGED_NUMBERS.length,74);assert.equal(current.filter(q=>q.contentVersion).length,74);assert.deepEqual(careerCurrentItems(current),current);assert.deepEqual(careerCurrentItems(JSON.parse(JSON.stringify(current))),current);assert.equal(JSON.stringify(items),old);
 const newest=guidanceParticleCurrentItems(current,'c22-s62-u04');for(const q of current){const wq=w.questions.find(w=>w.id===q.bookQuestionId),oldWq=priorWorkbook.questions.find(w=>w.id===q.bookQuestionId),b=careerBankBook.questions.find(b=>b.sourceItemId===q.id),latest=newest.find(x=>x.id===q.id);assert.equal(q.prompt,wq.prompt);assert.deepEqual(q.responseContract,oldWq.responseContract);assert.deepEqual(latest.responseContract,wq.responseContract);assert.deepEqual(b.answerContract,latest.answerContract);if(q.previousVersions){assert([CAREER_QUESTION_VERSION,STUDENT_SCIENCE_LANGUAGE_VERSION].includes(q.contentVersion));assert.equal(q.previousVersions[0].prompt,raw.find(w=>w.id===q.bookQuestionId).prompt);}}
 assert.equal(byNo(116).previousVersions[0].answerContract.answer,'검토 / 미실행');assert.equal(byNo(123).verificationModel,null);assert.deepEqual(w.figureModels['career-question-data-123'].rows,[['볕이 드는 곳','35℃'],['그늘진 곳','28℃']]);
 const paper=await revisedTextbookPaper(w.unit);assert(!paper.workbookPaper({mode:'student'}).includes('class="ed-key"'));assert.equal((paper.workbookPaper({mode:'teacher'}).match(/class="ed-key"/g)||[]).length,128);
});
test('버전 진단 감사는 현재 답을 오답으로 넣거나 버전·코드를 바꾸면 거부한다',()=>{
 const byId=new Map(items.map(q=>[q.id,q])),valid=auditRevisionDiagnostics(misc.revisionItems,byId,misc.misconceptions);assert.deepEqual(valid.errors,[]);assert(valid.used.get('M17')>0&&valid.used.get('M18')>0);
 const bad=structuredClone(byNo(113));bad.diagnosticOverride.distractors[4]='M17';assert(auditRevisionDiagnostics([bad],byId,misc.misconceptions).errors.some(x=>x.includes('정답')));
 const missing=structuredClone(byNo(116));missing.diagnosticOverride.typed.any='M99';assert(auditRevisionDiagnostics([missing],byId,misc.misconceptions).errors.some(x=>x.includes('없는 버전 오개념')));
 const version=structuredClone(byNo(116));version.diagnosticOverride.version='different';assert(auditRevisionDiagnostics([version],byId,misc.misconceptions).errors.some(x=>x.includes('버전 불일치')));
});
test('실제 로더·시작·웹 교재·8인쇄·8소단원을 실행하고 교재와 연결한 전체 수업 주소를 보호한다',()=>{const r=run('career-workbook-routes.mjs');assert(r.productionUnitLoaderExecuted&&!r.fullClassroomPending);assert.equal(r.workbookRoutes,4);assert.equal(r.bankPrintRoutes,4);assert.equal(r.legacyRedirects,3);assert.equal(r.uniqueOnlineQuestions,128);assert.equal(r.studentElementLabels,8);assert.equal(r.studentTypeLabels,16);assert.equal(r.officialStandards,2);assert(r.classificationStructureUnchanged&&r.homeAndSubsectionLabelsAgree);assert.equal(r.versions,74);assert.equal(r.studentStorageReads,0);assert.equal(r.studentStorageWrites,0);});
test('온라인/수업/Daily의 응답과 이전 계획 진단은 새 과학 문항과 섞이지 않는다',()=>{const r=run('career-question-diagnostics.mjs');assert.equal(r.onlineStates,7);assert.equal(r.deckStates,5);assert(r.oldDiagnosticPreserved);assert.equal(r.actualStudentStorageReads,0);assert.equal(r.actualStudentStorageWrites,0);});
test('직업 사례는 과학적 원리와 확인한 공식 자료를 연결한다',()=>{assert.equal(careerSourceNotes.length,6);assert(careerSourceNotes.every(s=>s.readOn==='2026-11-04'));const ag=careerSourceNotes.find(s=>s.id==='agricultural-projections');assert.equal(ag.published,'2025-01-09');assert(ag.url.includes('nihhs.go.kr'));assert(w.pages[19].blocks.some(b=>b.text?.includes('전망')));assert(w.pages[126].title.includes('진로를 과학과'));});
