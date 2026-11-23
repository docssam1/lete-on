import{withForceGuidedWorkbook}from'./force-guided-review.js';
import test from'node:test';
import assert from'node:assert/strict';
import fs from'node:fs';
import{workbook}from'../data/book/s31-u01.workbook.js';
import{withElementaryReadingDirections}from'../data/book/elementary-reading-directions.js';
import{withObservedPhotoAlt}from'../data/book/observation-language.js';
import{review}from'../data/language/s31-u01.js';
import{reviewTextTree,reviewWorkbookTableText,reviewStudentWorkbook}from'./student-language-review.js';
import{withForceDrawingWorkbook,FORCE_DRAWING_VERSION}from'./force-drawing-review.js';
import{revisedTextbookPaper}from'./revised-textbook.js';
const before=reviewWorkbookTableText(reviewTextTree(withObservedPhotoAlt(withElementaryReadingDirections(workbook)),review.text),review),saved=structuredClone(before),next=withForceDrawingWorkbook(before),nos=[75,77,79];
const pageFor=(w,no)=>w.pages.find(p=>p.blocks.some(b=>(b.ids||[]).includes('s31-u01-w'+String(no).padStart(3,'0'))));
test('three picture-only tasks retain the scientific conditions and picture space, without the eighteen duplicate writing lines',()=>{
 assert.deepEqual(before,saved);assert.notEqual(next,before);
 assert.deepEqual(next.questions.filter((q,i)=>q!==before.questions[i]).map(q=>q.no),nos);
 assert.equal(next.questions.length,80);assert.equal(next.pages.length,53);
 assert.equal(next.figures,before.figures);assert.equal(next.teacherPages,before.teacherPages);assert.equal(next.quickPages,before.quickPages);
 for(let i=0;i<80;i++){
  const q=next.questions[i],old=before.questions[i];
  for(const key of['id','no','form','standard','drawing','responseContract','answerContract','sourceRef','figure'])assert.equal(q[key],old[key]);
  if(!nos.includes(q.no)){assert.equal(q,old);continue;}
  assert.equal(q.forceDrawingReviewed,FORCE_DRAWING_VERSION);assert.equal(q.drawingExplanationLines,0);
  const prior=pageFor(before,q.no),page=pageFor(next,q.no);assert.equal(prior.rail[2].write,3);assert(!('write'in page.rail[2]));
  assert.equal(page.rail[2].title,prior.rail[2].title);assert.equal(page.rail[0],prior.rail[0]);assert.equal(page.rail[1],prior.rail[1]);assert.equal(page.blocks,prior.blocks);
 }
 assert(next.questions[74].prompt.includes('손이 힘을 주는 방향'));assert(!next.questions[74].prompt.includes('예상'));
 assert(next.questions[76].prompt.includes('빈 판자의 수평'));assert(next.questions[76].answer.includes('같은 거리'));assert(!next.questions[76].answer.includes('설명한다'));
 assert(next.questions[78].given[0].indexOf('0 확인')<next.questions[78].given[0].indexOf('물체 올리기'));
 assert(next.questions[78].given[0].includes('값과 단위'));assert(next.questions[78].criteria.includes('구체적인 측정값이나 별도의 설명 글은 요구하지 않아요'));
 assert.equal(withForceDrawingWorkbook(next),next);assert.equal(withForceDrawingWorkbook(before),next);
 for(const future of[{...before,unit:'other'},{...before,newEdition:true},{...before,pages:before.pages.map((p,i)=>i?p:{...p,title:'다음 개정'})},{...before,questions:before.questions.map(q=>q.no===77?{...q,prompt:q.prompt+' 새 조건'}:q)}])assert.equal(withForceDrawingWorkbook(future),future);
});
test('the live student and answer papers use the same new task while other questions and quick keys stay intact',async()=>{
 assert.deepEqual(await reviewStudentWorkbook(workbook.unit,withObservedPhotoAlt(withElementaryReadingDirections(workbook))),withForceGuidedWorkbook(next));
 const{workbookPaper}=await revisedTextbookPaper(workbook.unit),student=workbookPaper({mode:'student'}),teacher=workbookPaper({mode:'teacher'}),answers=workbookPaper({mode:'answers'}),quick=workbookPaper({mode:'quick'});
 assert.equal((student.match(/data-question=/g)||[]).length,80);assert.equal((teacher.match(/data-question=/g)||[]).length,80);
 assert(!student.includes('class="ed-key"'));assert(!student.includes('data-solution='));
 for(const no of nos){
  const q=next.questions[no-1],id=q.id,start=student.indexOf('data-question="'+id+'"'),end=student.indexOf('</li>',start),card=student.slice(start,end);
  assert(card.includes(q.prompt));assert(card.includes('class="ed-drawing large'));assert.equal((card.match(/class="ed-drawing-panel"/g)||[]).length,no===75?2:no===79?3:0);assert(!card.includes('ed-lines'));
  assert(student.includes(pageFor(next,no).rail[2].text));assert(teacher.includes(pageFor(next,no).rail[2].text));
  assert(answers.includes(q.answer));assert(answers.includes(q.explanation));assert(answers.includes(q.criteria));assert(!answers.includes(before.questions[no-1].explanation));
 }
 for(const f of['v2.js','revised-textbook.js','revised-lesson.js','index.html'])assert(fs.readFileSync(new URL('./'+f,import.meta.url),'utf8').includes('forceDrawing='+FORCE_DRAWING_VERSION));
 assert.equal((quick.match(/<tr>/g)||[]).length,85);
});
