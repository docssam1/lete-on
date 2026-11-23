import test from'node:test';
import assert from'node:assert/strict';
import fs from'node:fs';
import crypto from'node:crypto';
import{workbook}from'../data/book/s31-u02.workbook.js';
import{review}from'../data/language/s31-u02.js';
import{withObservedPhotoAlt}from'../data/book/observation-language.js';
import{withElementaryReadingDirections}from'../data/book/elementary-reading-directions.js';
import{reviewStudentWorkbook,reviewTextTree,reviewWorkbookTableText}from'./student-language-review.js';
import{withAnimalGuidedWorkbook}from'./animal-guided-review.js';
import{withAnimalConceptWorkbook,ANIMAL_CONCEPT_VERSION as version}from'./animal-concept-review.js';
import{makeWorkbookPaper}from'./revised-workbook-paper.js';
import{revisedTextbookPaper}from'./revised-textbook.js';
const before=withAnimalGuidedWorkbook(reviewWorkbookTableText(reviewTextTree(withObservedPhotoAlt(withElementaryReadingDirections(workbook)),review.text),review)),next=withAnimalConceptWorkbook(before),ids=w=>w.pages.flatMap(p=>p.blocks.flatMap(b=>b.ids||[]));
test('short animal concept checks replace 63 long lines while all eighty questions, practice pages and prior editions remain intact',()=>{
 const saved=structuredClone(before);assert.equal(before.pages.length,54);assert.notEqual(next,before);assert.equal(next.pages.length,51);assert.equal(next.teacherStudentPages,next.pages);
 assert.equal(next.questions,before.questions);assert.equal(next.teacherPages,before.teacherPages);assert.equal(next.quickPages,before.quickPages);assert.deepEqual(ids(next),ids(before));assert.equal(ids(next).length,80);
 const previousFields=before.pages.slice(0,16).flatMap(p=>p.blocks).filter(b=>b.type==='field');assert.equal(previousFields.reduce((n,b)=>n+b.lines,0),63);
 const fields=next.pages.flatMap(p=>p.blocks).filter(b=>b.type==='field');assert.equal(fields.length,1);assert.equal(fields[0].draw,true);assert.equal(fields[0].lines,undefined);
 assert.equal(next.pages.flatMap(p=>p.rail).filter(n=>n.write).length,0);
 for(let i=0;i<38;i++)assert.equal(next.pages[i+12],before.pages[i+16]);
 assert.deepEqual(new Set(next.pages.slice(0,12).flatMap(p=>p.standards)),new Set(['4과02-01','4과02-02','4과02-03']));
 const reference=next.pages.at(-1);assert(reference.blocks.some(b=>b.key==='animal-concept-sources'));assert(!next.pages.slice(0,12).some(p=>p.blocks.some(b=>b.key==='animal-concept-sources')));
 assert.equal(next.figures['animal-concept-sources'],before.figures['animal-concept-sources']);assert.equal((next.figures['animal-concept-sources'].match(/href=/g)||[]).length,5);
 assert.deepEqual(before,saved);assert.equal(withAnimalConceptWorkbook(before),next);assert.equal(withAnimalConceptWorkbook(next),next);
 for(const future of[{...before,unit:'other'},{...before,futureEdition:true},{...before,pages:before.pages.map((p,i)=>i?p:{...p,title:'다음 판본'})},{...before,questions:before.questions.map((q,i)=>i?q:{...q,prompt:'새 질문'})}])assert.equal(withAnimalConceptWorkbook(future),future);
});
test('animal features and classification retain the supplied tables while photographs never require counting hidden parts',()=>{
 assert.equal(next.figures['two-criteria'],before.figures['two-criteria']);assert.equal(next.figures['water-life'].match(/<tbody>[\s\S]*?<\/tbody>/)[0],before.figures['water-life'].match(/<tbody>[\s\S]*?<\/tbody>/)[0]);
 for(const key of Object.keys(before.figures))if(key!=='water-life')assert.equal(next.figures[key],before.figures[key],key);
 const pages=next.pages.slice(0,12),content=JSON.stringify(pages);for(const word of['깃털','얇은 피부 막','지느러미','물갈퀴','4개(두 쌍)','6개(세 쌍)','친구의 생각'])assert(content.includes(word),word);
 const counting=JSON.stringify(pages[6].blocks);assert(counting.includes('사진에서 가려진 부분은 설명으로도 확인해요.'));assert(JSON.stringify(pages[7].blocks).includes('발바닥의 작은 돌기는 이 사진에 보이지 않으므로'));
 const plan=JSON.stringify(pages[10].blocks);for(const word of['판의 너비만','같은 통','물의 양','깊이·방법','해 보기 전에는 결과를 미리 정하지'])assert(plan.includes(word),word);
 const metadata=JSON.parse(fs.readFileSync(new URL('../assets/book/s31-u02-concept-photo-metadata.json',import.meta.url)));assert.equal(metadata.generator,'built-in image_gen');assert.equal(metadata.observationRecord,false);assert.equal(metadata.assets.length,9);
 const rendered=JSON.stringify(next.pages)+JSON.stringify(next.figures);for(const row of metadata.assets){assert(row.prompt.length>500);const bytes=fs.readFileSync(new URL('../assets/book/'+row.file,import.meta.url));assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),row.sha256);assert.equal(bytes.subarray(1,4).toString(),'PNG');assert(bytes.readUInt32BE(16)>=1500);assert(bytes.readUInt32BE(20)>=1000);assert(rendered.includes(row.file));}
});
test('current animal papers show 51 student pages with unchanged answer and quick papers and no answer leaks',async()=>{
 assert.deepEqual(await reviewStudentWorkbook('s31-u02',withObservedPhotoAlt(withElementaryReadingDirections(workbook))),next);
 const{workbookPaper}=await revisedTextbookPaper('s31-u02'),prior=makeWorkbookPaper(before).workbookPaper;
 for(const[mode,count]of Object.entries({student:51,teacher:79,answers:27,quick:5})){const html=workbookPaper({mode});assert.equal((html.match(/class="bk-page /g)||[]).length,count,mode);if(['answers','quick'].includes(mode))assert.equal(html,prior({mode}));if(mode==='student'){assert.equal((html.match(/data-question=/g)||[]).length,80);assert(!/class="ed-key"|data-solution=/.test(html));assert(!html.includes('PDF 32쪽 관찰 자료'));}}
 for(const f of['v2.js','revised-textbook.js','revised-lesson.js','book.js','revised-workbook-paper.js','index.html'])assert(fs.readFileSync(new URL('./'+f,import.meta.url),'utf8').includes('animalConcepts='+version),f);
});
