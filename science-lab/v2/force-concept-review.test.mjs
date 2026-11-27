import{withForceMixedWorkbook}from'./force-mixed-response.js';
import test from'node:test';
import assert from'node:assert/strict';
import fs from'node:fs';
import crypto from'node:crypto';
import{workbook}from'../data/book/s31-u01.workbook.js';
import{review}from'../data/language/s31-u01.js';
import{withElementaryReadingDirections}from'../data/book/elementary-reading-directions.js';
import{withObservedPhotoAlt}from'../data/book/observation-language.js';
import{reviewStudentWorkbook,reviewTextTree,reviewWorkbookTableText}from'./student-language-review.js';
import{withForceDrawingWorkbook}from'./force-drawing-review.js';
import{withForceGuidedWorkbook}from'./force-guided-review.js';
import{withForceConceptWorkbook,FORCE_CONCEPT_VERSION}from'./force-concept-review.js';
import{makeWorkbookPaper}from'./revised-workbook-paper.js';
import{art}from'../data/book/s31-u01.workbook-art.js';
import{revisedTextbookPaper}from'./revised-textbook.js';
const before=withForceGuidedWorkbook(withForceDrawingWorkbook(reviewWorkbookTableText(reviewTextTree(withObservedPhotoAlt(withElementaryReadingDirections(workbook)),review.text),review))),next=withForceConceptWorkbook(before),ids=w=>w.pages.flatMap(p=>p.blocks.flatMap(b=>b.ids||[]));
test('twelve short concept pages and oral rails preserve all eighty tasks and the four standards without mutating a prior edition',()=>{
 const saved=structuredClone(before);assert.notEqual(next,before);assert.equal(next.pages.length,48);assert.deepEqual(next.teacherStudentPages,next.pages);
 assert.equal(next.questions,before.questions);assert.equal(next.teacherPages,before.teacherPages);assert.equal(next.quickPages,before.quickPages);assert.deepEqual(ids(next),ids(before));assert.equal(ids(next).length,80);
 assert.equal(next.pages.flatMap(p=>p.rail).filter(n=>n.write).length,0);assert.equal(next.pages.slice(0,12).flatMap(p=>p.blocks).filter(b=>b.type==='field').length,0);
 assert.deepEqual(new Set(next.pages.slice(0,12).flatMap(p=>p.standards)),new Set(['4과01-01','4과01-02','4과01-03','4과01-04']));
 assert(next.pages[0].blocks.some(b=>b.type==='heading'&&b.text==='워밍업'));
 for(let i=0;i<36;i++){const old=before.pages[i+15],p=next.pages[i+12];assert.equal(p.blocks,old.blocks);assert.equal(p.rail[0],old.rail[0]);assert.equal(p.rail[1],old.rail[1]);}
 assert.deepEqual(before,saved);assert.equal(withForceConceptWorkbook(before),next);assert.equal(withForceConceptWorkbook(next),next);
 for(const future of[{...before,unit:'other'},{...before,futureEdition:true},{...before,pages:before.pages.map((p,i)=>i?p:{...p,title:'다음 개정'})},{...before,questions:before.questions.map((q,i)=>i?q:{...q,prompt:'새 문제'})}])assert.equal(withForceConceptWorkbook(future),future);
});
test('examples keep physical comparison conditions and values, while photo descriptions make no measured-value claim',()=>{
 const content=JSON.stringify(next.pages.slice(0,12));for(const word of['수평대','받침점','같은 거리','0을','단위','지레','빗면'])assert(content.includes(word),word);
 const tables=i=>next.pages[i].blocks.filter(b=>b.type==='table').map(b=>b.rows);
 assert.deepEqual(tables(5).slice(0,2),[[['작은 주머니','240 g'],['큰 빈 상자','160 g']],[['사과','180 g'],['배','260 g'],['감','180 g']]]);
 assert.deepEqual(tables(7)[0],[['빈 그릇','50 g'],['그 그릇과 쌀','210 g']]);assert(content.includes('210−50=160 g'));
 assert.deepEqual(tables(7)[1].map(r=>r[1]),['196 g','202 g','200 g']);assert.equal(210-50,160);
 assert.deepEqual(tables(9)[0].map(r=>r[1]),['280 g','280 g']);assert.equal(next.figures['model-change'],before.figures['model-change']);
 for(const i of[2,10]){const p=next.pages[i],s=JSON.stringify(p.blocks);assert(s.includes('해 본 뒤에 동그라미'));assert(s.includes('비슷했어요'));assert(p.blocks.some(b=>b.type==='list'&&b.items.length===3));}
 const changed=Object.keys(before.figures).filter(k=>next.figures[k]!==before.figures[k]);assert.deepEqual(changed,['opener','ramp','scale','scale-results']);
 for(const k of['opener','ramp','scale']){assert.equal(next.figures[k].match(/<img[^>]+>/)[0],before.figures[k].match(/<img[^>]+>/)[0]);assert(!/\d+\s*g|가상|측정 사진/.test(next.figures[k]));}
 assert.equal(next.figures['scale-results'].match(/<tbody>[\s\S]*?<\/tbody>/)[0],before.figures['scale-results'].match(/<tbody>[\s\S]*?<\/tbody>/)[0]);
 const metadata=JSON.parse(fs.readFileSync(new URL('../assets/book/s31-u01-lesson-photo-metadata.json',import.meta.url)));
 assert.equal(metadata.assets.length,2);for(const row of metadata.assets){assert.equal(row.observationRecord,false);assert.equal(row.generator,'built-in image_gen');assert(row.prompt.length>500);const data=fs.readFileSync(new URL('../assets/book/'+row.file,import.meta.url));assert.equal(crypto.createHash('sha256').update(data).digest('hex'),row.sha256);assert(Object.values(next.figures).some(html=>html.includes(row.file)));}
});
test('the current four printed modes render the short checks with no student keys and unchanged answer and quick papers',async()=>{
 assert.deepEqual(await reviewStudentWorkbook(workbook.unit,withObservedPhotoAlt(withElementaryReadingDirections(workbook))),withForceMixedWorkbook(next));
 const actual=makeWorkbookPaper(next,art),prior=makeWorkbookPaper(before,art),counts={student:48,teacher:75,answers:27,quick:5};
 for(const [mode,count]of Object.entries(counts)){const html=actual.workbookPaper({mode});assert.equal((html.match(/class="bk-page /g)||[]).length,count,mode);if(mode==='answers'||mode==='quick')assert.equal(html,prior.workbookPaper({mode}),mode);else{assert.equal((html.match(/data-question=/g)||[]).length,80);assert(html.includes('수평대라고 해요'));assert(html.includes('force-concept-balance')||html.includes('photo-balance-v2.png'));}}
 const student=actual.workbookPaper({mode:'student'});assert(!/class="ed-key"|data-solution=/.test(student));assert(student.includes('한 낱말 확인'));assert(student.includes('기호로 써요'));assert(student.includes('도구와 쓰임을 짝지어요'));
 for(const file of['v2.js','revised-textbook.js','revised-lesson.js','book.js','revised-workbook-paper.js','index.html'])assert(fs.readFileSync(new URL('./'+file,import.meta.url),'utf8').includes('forceConcepts='+FORCE_CONCEPT_VERSION));
});
