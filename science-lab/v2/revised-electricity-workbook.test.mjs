import{STUDENT_SCIENCE_LANGUAGE_VERSION}from'../data/book/student-science-language.js';
import test from'node:test';import assert from'node:assert/strict';import{execFileSync}from'node:child_process';import{fileURLToPath}from'node:url';
import{workbook as w}from'../data/book/c22-s62-u03.workbook.js';
import{items}from'../data/units/c22-s62-u03.js';import{questions as raw}from'../data/book/c22-s62-u03.questions.js';
import{ELECTRICITY_QUESTION_PATCHES,ELECTRICITY_RAIL_NOTES,withElectricityEditorial}from'../data/book/c22-s62-u03.editorial.js';
import{electricityCurrentItems,ELECTRICITY_QUESTION_VERSION}from'./electricity-question-language.js';import{electricityBankBook}from'./electricity-bank-paper.js';
import{revisedTextbookPaper}from'./revised-textbook.js';import{gradeDaily}from'./daily-grade.js';import{judgeItem}from'./judge.js';
import{READY}from'./units-index.js';
const current=electricityCurrentItems(items),byNo=n=>current.find(q=>q.bookQuestionId===`c22-s62-u03-w${String(n).padStart(3,'0')}`);
const good=c=>c.teacherRequired?c.sample:c.kind==='single-choice'?c.answer:['multi-choice','unordered-labels'].includes(c.kind)?c.answers:c.kind==='ordered-label-sequence'?c.sequence:c.kind==='short-text'?c.accepted[0]:c.kind==='number-unit'?String(c.value)+c.units[0]:c.parts.map(p=>p.accepted[0]);
const run=file=>JSON.parse(execFileSync(process.execPath,['--experimental-vm-modules',fileURLToPath(new URL('./tests/'+file,import.meta.url))],{encoding:'utf8',timeout:15000,stdio:['ignore','pipe','pipe']}));
test('125쪽·128문항은 네 성취기준·여덟 형식과12활동·큰 그림 칸을 유지한다',()=>{
 assert.equal(w.pages.length,125);assert.equal(w.teacherStudentPages.length,126);assert.equal(w.teacherStudentPages.at(-1).kind,'duplex-blank');assert.equal(w.teacherPages.length,55);assert.equal(w.quickPages.length,6);
 assert.equal(w.questions.length,128);assert.deepEqual(Object.values(w.questions.reduce((a,q)=>(a[q.bookResponseForm]=(a[q.bookResponseForm]||0)+1,a),{})),Array(8).fill(16));
 assert.equal(w.questions.filter(q=>q.responseContract.teacherRequired).length,32);assert.equal(w.questions.filter(q=>q.form==='draw'&&q.drawing==='large').length,16);
 assert.equal(w.pages.flatMap(p=>p.blocks).filter(b=>b.type==='field'&&b.draw).length,4);assert.equal(w.pages.filter(p=>p.kind.startsWith('activity-')).length,12);
 assert.deepEqual(w.pages.flatMap(p=>p.blocks.filter(b=>b.type==='questions').flatMap(b=>b.ids)),w.questions.map(q=>q.id));
 assert.deepEqual([...new Set(w.questions.map(q=>q.standard))].sort(),['6과15-01','6과15-02','6과15-03','6과15-04']);
 assert(READY[w.unit].subs.every(s=>s.types>0));
});
test('학생 문구·워밍업·전지 직렬연결과 상위 학습을 구별하고 실제 부품 사진을 쓴다',async()=>{
 assert(w.pages[0].blocks.some(b=>b.type==='field'&&b.title==='워밍업'));assert(w.pages[0].blocks.some(b=>b.type==='table'&&b.heads[0]==='이름'));
 assert.deepEqual(w.pages[1].blocks.find(b=>b.type==='table').heads,['배울 내용','해 볼 활동']);assert.equal(ELECTRICITY_RAIL_NOTES.length,125);assert.equal(new Set(ELECTRICITY_RAIL_NOTES.map(r=>r[1])).size,64);
 for(let i=0;i<125;i++){assert.deepEqual(w.pages[i].rail,w.teacherStudentPages[i].rail);assert.deepEqual(w.pages[i].rail.map(r=>r.title),['핵심 정리','더 알아보기','내가 정리할 것']);assert(/중학교|고등학교/.test(w.pages[i].rail[1].text));assert(w.pages[i].rail[2].write>=3);}
 const main=JSON.stringify(w.pages.map(p=>({...p,rail:[]})));assert(!/전류에 의한 자기장|옴의 법칙|전구의 병렬연결|오른손 법칙|미실행|미관찰|통전|서로 돕는 한 줄/.test(main));
 assert(w.pages[31].title.includes('직렬연결'));assert(w.figures.circuit.includes('스위치를 열었을 때'));assert(w.figures.series.includes('남은 +극'));assert(w.figures.coil.includes('완성 모습은 아니'));
 for(const n of[3,16,32,46,61,77,93,106])assert(w.pages[n-1].blocks.some(b=>b.type==='field'&&b.title==='개념 확인'&&b.lines===4));
 assert.throws(()=>withElectricityEditorial({...w,unit:'other'}));
 const p=await revisedTextbookPaper(w.unit);for(const mode of['student','teacher','answers','quick']){const h=p.workbookPaper({mode});assert(!/undefined|\[object Object\]|AI 실사형 설명 이미지|[\u3040-\u30ff]/.test(h));if(mode==='student')assert(!h.includes('class="ed-key"'));if(mode==='teacher')assert.equal((h.match(/class="ed-key"/g)||[]).length,128);}
});
test('완료 상태 문제를 자석 비교·전기 사용으로 바꾸고 독립 기대 답·단위·순서를 대조한다',()=>{
 assert.deepEqual(Object.keys(ELECTRICITY_QUESTION_PATCHES).map(Number),[33,35,45,47,76,83,84,114,115,116,117,120,122,124,126]);
 const answers={76:['전자석','영구 자석'],83:['방향','극'],84:['켤','끌'],114:2,115:['밝기','끈다'],116:['기능','설명서'],117:['ㄷ','ㄱ','ㄴ'],120:['ㄴ','ㄱ','ㄷ'],122:[1,3,4],124:['B','12Wh']};
 for(const[n,value]of Object.entries(answers))assert.equal(gradeDaily(byNo(+n),value).status,'correct',n);
 for(const[n,value]of[[76,['영구 자석','전자석']],[84,['흘릴','끌']],[115,['계획','실행']],[116,['미실행','검토']],[117,['ㄱ','ㄷ','ㄴ']],[124,['B','12']],[124,['B','12W']],[124,['A','12Wh']]])assert.equal(gradeDaily(byNo(n),value).status,'wrong',String(n));
 assert.equal(gradeDaily(byNo(122),[1,3,3,4]).status,'wrong');assert.equal(gradeDaily(byNo(126),w.questions[125].answer).status,'review');
 assert.equal(byNo(116).taxonomy.type,'T14');assert.equal(byNo(116).diagnosticOverride.typed[byNo(116).id],undefined);assert.equal(byNo(116).diagnosticOverride.typed.any,'M14');
 assert.equal(byNo(76).taxonomy.element,'E5');assert.equal(byNo(124).verificationModel,null);
});
test('186현재 문항은 공용/Daily/문항집 계약이 같고 원고·이전 답안·재적용을 보존한다',()=>{
 const frozen=JSON.stringify(items);let auto=0,review=0;
 for(const q of current){const c=q.responseContract;assert.equal(gradeDaily(q,good(c)).status,c.teacherRequired?'review':'correct',q.id);assert.equal(judgeItem({text:good(c),ac:q.answerContract}).st,c.teacherRequired?'review':'ok',q.id);assert.equal(gradeDaily(q,'').status,'blank',q.id);if(c.teacherRequired)review++;else auto++;
  const b=electricityBankBook.questions.find(b=>b.sourceItemId===q.id);assert(b);assert.equal(b.prompt,q.prompt,q.id);assert.deepEqual(b.choices??null,q.choices??null,q.id);assert.deepEqual(b.responseContract,q.responseContract,q.id);
  if(q.previousVersions){assert([ELECTRICITY_QUESTION_VERSION,STUDENT_SCIENCE_LANGUAGE_VERSION].includes(q.contentVersion));assert.equal(q.previousVersions.length,q.contentVersion===STUDENT_SCIENCE_LANGUAGE_VERSION&&!q.id.endsWith('b066')?2:1);if(q.bookQuestionId)assert.equal(q.previousVersions[0].prompt,raw.find(w=>w.id===q.bookQuestionId).prompt);}
 }
 assert.deepEqual({auto,review},{auto:144,review:42});assert.equal(current.filter(q=>q.previousVersions).length,118);assert.equal(JSON.stringify(items),frozen);
 assert.deepEqual(electricityCurrentItems(current),current);assert.deepEqual(electricityCurrentItems(JSON.parse(JSON.stringify(current))),current);
 assert.equal(byNo(116).previousVersions[0].answerContract.answer,'미실행 / 검토');assert.deepEqual(w.figureModels[w.questions[123].figure].rows,w.questions[123].table.행);
});
test('실제 로더·시작·웹 교재·8인쇄 경로는 학생 저장 없이 실행하고 전체 수업 입구와 이전 주소를 잇는다',()=>{
 const r=run('electricity-workbook-routes.mjs');assert(r.productionUnitLoaderExecuted&&!r.fullClassroomPending);assert.equal(r.workbookRoutes,4);assert.equal(r.bankPrintRoutes,4);assert.equal(r.studentStorageReads,0);assert.equal(r.studentStorageWrites,0);assert.equal(r.versions,118);
});
test('현재 전기 사용의 정답은 이전 활동 상태의 오개념을 임의로 해소하지 않는다',()=>{
 const r=run('electricity-question-diagnostics.mjs');assert(r.oldDiagnosticPreserved);assert.equal(r.onlineStates,7);assert.equal(r.deckStates,5);assert.equal(r.actualStudentStorageReads,0);assert.equal(r.actualStudentStorageWrites,0);
});
