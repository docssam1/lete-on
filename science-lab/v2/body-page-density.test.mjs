import test from'node:test';import assert from'node:assert/strict';
import{workbook}from'../data/book/c22-s51-u04.workbook.js';import{withObservedPhotoAlt}from'../data/book/observation-language.js';import{withElementaryReadingDirections}from'../data/book/elementary-reading-directions.js';import{reviewStudentWorkbook}from'./student-language-review.js';import{withBodyPageDensity}from'./body-page-density.js';import{revisedTextbookPaper}from'./revised-textbook.js';
const next=await reviewStudentWorkbook(workbook.unit,withObservedPhotoAlt(withElementaryReadingDirections(workbook))),ids=pages=>pages.flatMap(p=>p.blocks.flatMap(b=>b.ids||[]));
test('body questions stay complete and ordered in both differently grouped student and teacher pages',()=>{
 assert.equal(next.pages.length,51);assert.equal(next.teacherStudentPages.length,58);for(const pages of[next.pages,next.teacherStudentPages])assert.deepEqual(ids(pages),next.questions.map(q=>q.id));assert.equal(next.questions.length,96);
 assert.equal(next.pages.filter(p=>p.layout==='body-density').length,9);assert.equal(next.teacherStudentPages.filter(p=>p.layout==='body-density').length,2);for(const pages of[next.pages,next.teacherStudentPages])for(const p of pages.filter(p=>p.layout==='body-density')){assert(ids([p]).length>=4&&ids([p]).length<=6);assert(!next.questions.some(q=>ids([p]).includes(q.id)&&q.form==='draw'));assert(p.rail.every(n=>n.text));}
});
test('drawings, real observation pages and printed lookup ranges survive the shorter book',()=>{
 for(const pages of[next.pages,next.teacherStudentPages]){assert.equal(pages.filter(p=>ids([p]).some(id=>next.questions.find(q=>q.id===id)?.form==='draw')).length,4);assert.equal(pages.flatMap(p=>p.blocks).filter(b=>b.type==='field'&&b.draw).length,2);const rows=pages.at(-1).blocks.find(b=>b.type==='table'&&b.heads?.[0]==='궁금한 내용').rows;assert.equal(rows.length,7);for(const row of rows){const [a,b]=row[1].replace('쪽','').split('~').map(Number);assert(a>=1&&b>=a&&b<pages.length);}}
});
test('density is idempotent and ignores all unregistered, source and future workbooks',()=>{
 assert.equal(withBodyPageDensity(next),next);assert.equal(withBodyPageDensity(workbook),workbook);for(const patch of[{unit:'other'},{title:'future'},{questions:next.questions.map(q=>({...q,prompt:q.prompt+' future'}))}]){const future={...next,...patch};assert.equal(withBodyPageDensity(future),future);}
});
test('four real print routes keep all96 questions and unchanged answer coverage after reflow',async()=>{
 const paper=await revisedTextbookPaper(workbook.unit);for(const[mode,count]of Object.entries({student:51,teacher:90,answers:32,quick:4})){const html=paper.workbookPaper({mode});assert.equal((html.match(/class="bk-page /g)||[]).length,count);if(mode==='student'||mode==='teacher')assert.equal((html.match(/data-question=/g)||[]).length,96);if(mode==='student')assert(!html.includes('class="ed-key"'));if(mode==='teacher'||mode==='answers')assert.equal((html.match(/data-solution=/g)||[]).length,96);}
});
