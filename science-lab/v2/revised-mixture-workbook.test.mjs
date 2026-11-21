import test from'node:test';import assert from'node:assert/strict';
import{workbook as w}from'../data/book/c22-s52-u01.workbook.js';import{MIXTURE_RAIL_NOTES,withMixtureEditorial}from'../data/book/c22-s52-u01.editorial.js';import{revisedTextbookPaper}from'./revised-textbook.js';
test('혼합물 71쪽은 96문항8형식과 단계별 분리 활동을 순서대로 제공한다',()=>{
 assert.equal(w.pages.length,71);assert.equal(w.teacherStudentPages.length,71);assert.equal(w.teacherPages.length,32);assert.equal(w.quickPages.length,4);assert.equal(w.questions.length,96);assert.equal(new Set(w.questions.map(q=>q.form)).size,8);
 assert.deepEqual(w.pages.flatMap(p=>p.blocks.filter(b=>b.type==='questions').flatMap(b=>b.ids)),w.questions.map(q=>q.id));assert.equal(w.pages.flatMap(p=>p.blocks).filter(b=>b.type==='example').length,8);assert.equal(w.pages.flatMap(p=>p.blocks).filter(b=>b.type==='field'&&b.draw===true).length,2);assert.equal(w.questions.filter(q=>q.form==='draw'&&q.drawing==='large').length,2);
 for(const q of w.questions)assert(q.answer&&q.explanation&&q.criteria);
});
test('기본 성질·관찰과 상위 밀도·용해도·증류를 구별하여 같은 학생·교사 쪽에 놓는다',()=>{
 assert.equal(MIXTURE_RAIL_NOTES.length,71);for(let k=0;k<3;k++)assert.equal(new Set(MIXTURE_RAIL_NOTES.map(r=>r[k])).size,71);for(let i=0;i<71;i++){assert.deepEqual(w.pages[i].rail,w.teacherStudentPages[i].rail);assert.deepEqual(w.pages[i].rail.map(r=>r.title),['핵심 정리','더 알아보기','내가 정리할 것']);assert(w.pages[i].rail[2].write>=3);}assert(w.pages[14].rail[1].text.includes('밀도'));assert(w.pages[19].rail[1].text.includes('용해도'));assert(w.pages[32].rail[1].text.includes('증류'));
 assert(w.pages[0].blocks.some(b=>b.type==='field'&&b.title==='워밍업'));assert.equal(w.pages[1].blocks[0].rows.length,3);assert(!JSON.stringify(w.pages[1]).includes('6과05-'));assert.throws(()=>withMixtureEditorial({...w,unit:'other'}));
});
test('그림의 상태와 직접 본 결과를 구별하고 87번의 정답 계약을 유지한다',()=>{
 const q=w.questions.find(q=>q.no===87);assert.deepEqual(q.key,[0,1,2,4]);assert.equal(q.answer,'①, ②, ③, ⑤');assert(!q.choices.some(x=>/AI|미수신/.test(x)));const q92=w.questions.find(q=>q.no===92);assert(q92.prompt.includes('접시 그림'));assert(q92.answer.includes('직접 관찰'));assert.equal(q92.form,'written');
 for(const key of ['mixture','sieve','oil','dissolve','filter','evaporate','technology']){assert(w.figures[key].includes('/c22-s52-u01/'+key+'-photo-v1.png'));assert(!/AI|실제 실험\/측정 사진 아님/.test(w.figures[key]));}assert(w.pages[29].blocks.some(b=>b.type==='list'&&b.items.some(t=>t.includes('맛보지'))));
});
test('인쇄4모드에서 학생 답 숨김·교사96정답·양면 빈 면·해설·빠른표를 연결한다',async()=>{
 const p=await revisedTextbookPaper(w.unit),s=p.workbookPaper({mode:'student'}),t=p.workbookPaper({mode:'teacher'}),a=p.workbookPaper({mode:'answers'}),quick=p.workbookPaper({mode:'quick'});assert(!/class="ed-key"|class="ed-solution"/.test(s));assert.equal((t.match(/class="ed-key"/g)||[]).length,96);assert.equal((a.match(/class="ed-solution"/g)||[]).length,96);assert(t.includes('duplex-blank'));assert(quick.includes('mixture-quick')||quick.includes('교사 확인'));for(const h of[s,t,a,quick])assert(!/AI 실사형 설명 이미지|미수신/.test(h));
});
