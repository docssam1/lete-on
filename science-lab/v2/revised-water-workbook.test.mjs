import test from'node:test';import assert from'node:assert/strict';
import{workbook as w}from'../data/book/s41-u02.workbook.js';
import{WATER_RAIL_NOTES,WATER_EXAMPLES,withWaterEditorial}from'../data/book/s41-u02.editorial.js';
import{revisedTextbookPaper}from'./revised-textbook.js';
test('물의 상태 변화: 63쪽·80문항·8형식·6개 큰 그리기와 9예제를 제공한다',()=>{
 assert.equal(w.pages.length,63);assert.equal(w.teacherStudentPages.length,63);assert.equal(w.teacherPages.length,22);assert.equal(w.quickPages.length,3);assert.equal(w.questions.length,80);assert.equal(new Set(w.questions.map(q=>q.form)).size,8);
 const ids=w.pages.flatMap(p=>p.blocks.filter(b=>b.type==='questions').flatMap(b=>b.ids));assert.deepEqual(ids,w.questions.map(q=>q.id));assert.equal(new Set(ids).size,80);assert.equal(w.questions.filter(q=>q.form==='draw'&&q.drawing==='large').length,6);assert.equal(w.pages.flatMap(p=>p.blocks).filter(b=>b.type==='example').length,9);
 for(const p of w.pages.slice(0,11))assert(p.blocks.some(b=>b.type==='field'));for(const q of w.questions)assert(q.answer&&q.explanation&&q.criteria);
});
test('물 교재: 반복 없는 오른쪽 원고를 학생·교사에 같은 쪽 순서로 연결한다',()=>{
 assert.equal(WATER_RAIL_NOTES.length,63);for(let k=0;k<3;k++)assert.equal(new Set(WATER_RAIL_NOTES.map(r=>r[k])).size,63);
 for(let i=0;i<63;i++){assert.deepEqual(w.pages[i].rail,w.teacherStudentPages[i].rail);assert.deepEqual(w.pages[i].rail.map(r=>r.title),['핵심 정리','더 알아보기','내가 정리할 것']);assert(w.pages[i].rail[1].text.startsWith('상위 학습 · '));assert(w.pages[i].rail[2].write>=3);}
 assert.throws(()=>withWaterEditorial({...w,unit:'other'}));const wrong=structuredClone(w);[wrong.teacherStudentPages[12],wrong.teacherStudentPages[13]]=[wrong.teacherStudentPages[13],wrong.teacherStudentPages[12]];assert.throws(()=>withWaterEditorial(wrong));
});
test('물 예제는 관찰·상태·측정 범위·장치 경로를 구별하고 학생용 정답은 숨긴다',async()=>{
 assert(WATER_EXAMPLES[2].answer.includes('같은 상태라고 쓰지'));assert(WATER_EXAMPLES[4].steps[0][1].includes('4.0→4.4→4.0'));assert(WATER_EXAMPLES[6].steps[0][1].includes('6 mL'));assert(WATER_EXAMPLES[9].steps[0][1].includes('누수·흘림이 없으며'));assert(WATER_EXAMPLES[10].answer.includes('증발→응결→수집'));assert(WATER_EXAMPLES[11].answer.includes('응결이 없었다는 뜻은 아니'));
 const p=await revisedTextbookPaper('s41-u02'),s=p.workbookPaper({mode:'student'}),t=p.workbookPaper({mode:'teacher'});assert(!/class="ed-key"|class="ed-solution"/.test(s));assert.equal((t.match(/class="ed-key"/g)||[]).length,80);assert(t.includes('duplex-blank'));assert(!s.includes('AI 실사형 설명 이미지'));
});
