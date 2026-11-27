import test from'node:test';import assert from'node:assert/strict';import{execFileSync}from'node:child_process';import{fileURLToPath}from'node:url';
import{workbook as w}from'../data/book/c22-s62-u02.workbook.js';import{COMBUSTION_QUESTION_PATCHES,COMBUSTION_RAIL_NOTES,withCombustionEditorial}from'../data/book/c22-s62-u02.editorial.js';
import{items}from'../data/units/c22-s62-u02.js';import{questions as raw}from'../data/book/c22-s62-u02.questions.js';import{combustionCurrentItems,COMBUSTION_QUESTION_VERSION}from'./combustion-question-language.js';import{combustionBankBook}from'./combustion-bank-paper.js';import{revisedTextbookPaper}from'./revised-textbook.js';import{gradeDaily}from'./daily-grade.js';import{judgeItem}from'./judge.js';
const current=combustionCurrentItems(items),item=n=>current.find(q=>q.bookQuestionId===`c22-s62-u02-w${String(n).padStart(3,'0')}`),good=c=>c.teacherRequired?c.sample:c.kind==='single-choice'?c.answer:['multi-choice','unordered-labels'].includes(c.kind)?c.answers:c.kind==='ordered-label-sequence'?c.sequence:c.kind==='short-text'?c.accepted[0]:c.parts.map(p=>p.accepted[0]);
test('연소 교재는 4성취기준·128문항8형식과 11활동·큰 그림 칸을 같은 학생/교사 원고로 제공한다',()=>{
 assert.equal(w.pages.length,133);assert.equal(w.teacherStudentPages.length,134);assert.equal(w.teacherStudentPages.at(-1).kind,'duplex-blank');assert.equal(w.teacherPages.length,52);assert.equal(w.quickPages.length,6);assert.equal(w.questions.length,128);
 assert.deepEqual(Object.values(w.questions.reduce((a,q)=>(a[q.bookResponseForm]=(a[q.bookResponseForm]||0)+1,a),{})),Array(8).fill(16));assert.equal(w.questions.filter(q=>q.responseContract.teacherRequired).length,32);assert.equal(w.questions.filter(q=>q.form==='draw'&&q.drawing==='large').length,16);assert.equal(w.pages.flatMap(p=>p.blocks).filter(b=>b.type==='field'&&b.draw).length,6);assert.equal(w.pages.filter(p=>p.kind.startsWith('activity-')).length,11);
 assert.deepEqual(w.pages.flatMap(p=>p.blocks.filter(b=>b.type==='questions').flatMap(b=>b.ids)),w.questions.map(q=>q.id));assert.deepEqual([...new Set(w.questions.map(q=>q.standard))].sort(),['6과14-01','6과14-02','6과14-03','6과14-04']);
});
test('워밍업·학생용 차례·상위 학습을 구별하고 보고서 상태와 관리용 축약으로 과학을 대신하지 않는다',async()=>{
 assert(w.pages[0].blocks.some(b=>b.type==='field'&&b.title==='워밍업'));assert.deepEqual(w.pages[1].blocks.find(b=>b.type==='table').heads,['배울 내용','해 볼 활동']);assert.equal(COMBUSTION_RAIL_NOTES.length,133);assert.equal(new Set(COMBUSTION_RAIL_NOTES.map(r=>r[1])).size,64);
 for(let i=0;i<133;i++){assert.deepEqual(w.pages[i].rail,w.teacherStudentPages[i].rail);assert.deepEqual(w.pages[i].rail.map(r=>r.title),['핵심 정리','더 알아보기','내가 정리할 것']);assert(/중학교|고등학교/.test(w.pages[i].rail[1].text));assert(w.pages[i].rail[2].write>=3);}
 const main=JSON.stringify(w.pages.map(p=>({...p,rail:[]})));assert(!/물리 변화|화학 변화|그을음|미공유|미실시|자동 학교 성적표|\b6과14-/.test(main));assert(w.pages[48].blocks.some(b=>b.text?.includes('알코올을 더 넣지')));assert.throws(()=>withCombustionEditorial({...w,unit:'other'}));
 const paper=await revisedTextbookPaper(w.unit);for(const mode of['student','teacher','answers','quick']){const h=paper.workbookPaper({mode});assert(!/undefined|\[object Object\]|AI 실사형 설명 이미지|[\u3040-\u30ff]/.test(h));if(mode==='student')assert(!h.includes('class="ed-key"'));if(mode==='teacher')assert.equal((h.match(/class="ed-key"/g)||[]).length,128);}
});
test('13의미 편집의 독립 답·부정/누락·단위를 검사하고 서술·그림을 교사 확인으로 남긴다',()=>{
 assert.deepEqual(Object.keys(COMBUSTION_QUESTION_PATCHES).map(Number),[83,99,100,106,114,115,116,118,120,122,124,126,127]);
 const expected={83:['석회수','뿌옇게'],99:['이산화 탄소','바다'],100:['껍데기','골격'],106:[0,3,4],114:2,115:['이산화 탄소','피해'],116:['화석 연료','이산화 탄소'],118:['ㄴ','ㄷ','ㄱ'],120:['ㄴ','ㄱ','ㄷ'],122:[1,3,4],124:['2개','2개']};
 for(const[n,value]of Object.entries(expected))assert.equal(gradeDaily(item(+n),value).status,'correct',n);
 for(const n of[83,99,100,114,115,116]){const q=w.questions[n-1];for(const answer of q.responseContract.parts?.map(p=>p.accepted[0])||[q.answer])assert(q.criteria.includes(answer),String(n));}assert(!JSON.stringify(w).includes('원인 줄이기과'));assert(!JSON.stringify(w).includes('아직 아직'));
 for(const[n,value]of[[83,['석회수','맑게']],[99,['이산화 탄소가 아님','바다']],[100,['골격','껍데기']],[116,['화석 연료','질소']],[118,['ㄱ','ㄷ','ㄴ']],[120,['ㄱ','ㄴ','ㄷ']],[124,['2','2']]])assert.equal(gradeDaily(item(n),value).status,'wrong',String(n));
 assert.equal(gradeDaily(item(106),[0,3,3,4]).status,'wrong');assert.equal(gradeDaily(item(122),[1,3]).status,'wrong');assert.equal(gradeDaily(item(118),'(3) ㄱ / (1) ㄴ / (2) ㄷ').status,'correct');
 for(const n of[126,127])assert.equal(gradeDaily(item(n),w.questions[n-1].answer).status,'review');assert.equal(gradeDaily(item(116),'미공유 / 질문').status,'wrong');
});
test('198현재 문항의 계약을 공용/Daily/문항집에서 맞추고 이전 원고와 답을 보존한다',()=>{
 const frozen=JSON.stringify(items);let closed=0,review=0;
 for(const q of current){const c=q.responseContract,expected=c.teacherRequired?'review':'correct',r=gradeDaily(q,good(c));assert.equal(r.status,expected,q.id);assert.equal(judgeItem({text:good(c),ac:q.answerContract}).st,c.teacherRequired?'review':'ok',q.id);assert.equal(gradeDaily(q,'').status,'blank',q.id);if(c.teacherRequired)review++;else closed++;
  const b=combustionBankBook.questions.find(b=>b.sourceItemId===q.id);assert(b);assert.equal(b.prompt,q.prompt,q.id);assert.deepEqual(b.choices??null,q.choices??null,q.id);assert.deepEqual(b.responseContract,q.responseContract,q.id);
  if(q.previousVersions){assert.equal(q.contentVersion,COMBUSTION_QUESTION_VERSION);assert.equal(q.previousVersions.length,1);if(q.bookQuestionId)assert.equal(q.previousVersions[0].prompt,raw.find(x=>x.id===q.bookQuestionId).prompt);}
 }
 assert.deepEqual({closed,review},{closed:158,review:40});assert.equal(current.filter(q=>q.previousVersions).length,38);assert.equal(JSON.stringify(items),frozen);assert.deepEqual(combustionCurrentItems(current),current);assert.deepEqual(combustionCurrentItems(JSON.parse(JSON.stringify(current))),current);assert.equal(item(116).previousVersions[0].answerContract.answer,'미공유 / 질문');
 assert.deepEqual(w.figureModels[w.questions[123].figure].rows,w.questions[123].table.행);assert(w.figures[w.questions[123].figure].includes('바닷물의 성질'));assert.equal(current.find(q=>q.id.endsWith('v012')).previousVersions[0].choices[4],'촛농');
});
test('실제 로더·시작·웹 교재·8인쇄 분기에서 학생 저장을 건드리지 않고 기본·옛 주소를 현재 시작·수업으로 연결한다',()=>{
 const r=JSON.parse(execFileSync(process.execPath,['--experimental-vm-modules',fileURLToPath(new URL('./tests/combustion-workbook-routes.mjs',import.meta.url))],{encoding:'utf8',timeout:15000,stdio:['ignore','pipe','pipe']}));assert(r.productionUnitLoaderExecuted);assert.equal(r.workbookRoutes,4);assert.equal(r.bankPrintRoutes,4);assert.equal(r.studentStorageReads,0);assert.equal(r.studentStorageWrites,0);assert(r.fullClassroomAvailable);assert.equal(r.versions,38);
});
