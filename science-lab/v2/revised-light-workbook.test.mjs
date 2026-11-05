import test from'node:test';import assert from'node:assert/strict';
import{workbook as w}from'../data/book/c22-s51-u02.workbook.js';
import{LIGHT_RAIL_NOTES,LIGHT_EXAMPLES,withLightEditorial}from'../data/book/c22-s51-u02.editorial.js';
import{revisedTextbookPaper,revisedTextbook}from'./revised-textbook.js';
test('빛 교재는58쪽·80문항8형식·큰 경로 그림2개·예제11개를 제공한다',()=>{
 assert.equal(w.pages.length,58);assert.equal(w.teacherStudentPages.length,58);assert.equal(w.teacherPages.length,26);assert.equal(w.quickPages.length,3);assert.equal(w.questions.length,80);assert.equal(new Set(w.questions.map(q=>q.form)).size,8);assert.equal(w.questions.filter(q=>q.form==='draw'&&q.drawing==='large').length,2);assert.equal(w.pages.flatMap(p=>p.blocks).filter(b=>b.type==='example').length,11);assert.deepEqual(w.pages.flatMap(p=>p.blocks.filter(b=>b.type==='questions').flatMap(b=>b.ids)),w.questions.map(q=>q.id));for(const q of w.questions)assert(q.answer&&q.explanation&&q.criteria);
});
test('쪽별 과학 심화와 정리 질문은 학생·교사에서 같고 잘못된 원고 결합을 거부한다',()=>{
 assert.equal(LIGHT_RAIL_NOTES.length,58);for(let i=0;i<3;i++)assert.equal(new Set(LIGHT_RAIL_NOTES.map(r=>r[i])).size,58);for(let i=0;i<58;i++){assert.deepEqual(w.pages[i].rail,w.teacherStudentPages[i].rail);assert.deepEqual(w.pages[i].rail.map(r=>r.title),['핵심 정리','더 알아보기','내가 정리할 것']);assert(w.pages[i].rail[2].write>=3);}assert.throws(()=>withLightEditorial({...w,unit:'other'}));const bad=structuredClone(w);[bad.teacherStudentPages[2],bad.teacherStudentPages[3]]=[bad.teacherStudentPages[3],bad.teacherStudentPages[2]];assert.throws(()=>withLightEditorial(bad));
});
test('워밍업·사진과 설명 그림의 경로·어둠상자/반사/굴절/제작 활동을 연결한다',()=>{
 assert(w.pages[0].blocks.some(b=>b.type==='field'&&b.title==='워밍업'));assert.deepEqual(w.pages[1].blocks.find(b=>b.type==='table').rows.map(r=>r[0]),['물체를 보기 위해 빛이 필요함','빛의 직진·반사·굴절','거울과 렌즈의 쓰임새']);assert(LIGHT_EXAMPLES[25].answer.includes('아래 거울 → 위 거울 → 눈'));assert(LIGHT_EXAMPLES[30].answer.includes('굴절'));for(const key of['sourcePencil','sourceCoin','sourceMirror','sourceLens'])assert(w.figures[key].includes('<img'));assert(!w.figures.sourceLens.includes('25쪽'));assert(w.pages[25].blocks.some(b=>b.type==='field'&&b.draw));
});
test('웹과 인쇄4종은 같은80문항을 쓰고 원래 수업/기록 자료는 보존한다',async()=>{
 const original=await import('../data/book/c22-s51-u02.book.js'),merged=await revisedTextbook(w.unit,original);assert.equal(merged.plan,original.plan);assert.equal(merged.chapter.book,'지필드 교과 연결 사고력');assert.deepEqual(merged.chapter.pages,w.pages);const p=await revisedTextbookPaper(w.unit),student=p.workbookPaper({mode:'student'}),teacher=p.workbookPaper({mode:'teacher'});assert.equal((student.match(/class="ed-question"/g)||[]).length,80);assert.equal((teacher.match(/class="ed-key"/g)||[]).length,80);assert(!/class="ed-key"|class="ed-solution"/.test(student));assert(!teacher.includes('duplex-blank'));assert(!student.includes('AI 실사형 설명 이미지'));
});
