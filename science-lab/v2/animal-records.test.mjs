import test from 'node:test';
import assert from 'node:assert/strict';
import { animalActivities, animals } from '../data/activities/s31-u02.animal.js';
import { ANIMAL_KEY, emptyAnimal, validAnimal, loadAnimal, saveAnimalRecord, animalDraftError, animalReportHtml, animalReportSections } from './animal-records.js';
import { chapter, art, plan } from '../data/book/s31-u02.book.js';
import { lesson } from '../data/units/s31-u02.lesson.js';
import { similar } from '../data/units/s31-u02.similar.js';
import { renderChapter } from './book.js';
import { buildSlides } from './deck.js';
const complete=(s,kind)=>{const a=animalActivities.find((a)=>a.id===kind),d=s.drafts[kind];for(const f of a.fields)d.values[f.key]=f.type==='date'?'2026-10-17':f.label;return d;};
test('두 분류 기준과 근거를 독립하여 보관한다',()=>{
 const s=emptyAnimal(),d=complete(s,'classify');d.values.criterion='날개가 있는가';d.values.groupA='날개 있음';d.values.groupB='날개 없음';for(const a of animals)d.groups[a.id]={group:'unknown',evidence:'다른 사진을 더 확인'};
 saveAnimalRecord(s,'classify','first');const next=complete(s,'classify');next.values.criterion='깃털로 덮였는가';next.values.groupA='깃털 있음';next.values.groupB='깃털 없음';for(const a of animals)next.groups[a.id]={group:'unknown',evidence:'몸 표면 자료 확인 중'};saveAnimalRecord(s,'classify','second');
 assert.equal(s.records[0].data.values.criterion,'날개가 있는가');assert.equal(s.records[1].data.values.criterion,'깃털로 덮였는가');assert.equal(s.drafts.classify.values.criterion,'');assert(validAnimal(s));
});
test('근거 없는 분류·잘못된 날짜·손상 그림을 거부하고 기존 기록을 보호한다',()=>{
 const s=emptyAnimal(),d=complete(s,'classify');assert.match(animalDraftError(animalActivities[1],d),/각 동물/);assert.throws(()=>saveAnimalRecord(s,'classify','one'));assert.equal(s.records.length,0);
 const o=complete(s,'observe');o.values.date='2026-02-30';assert(!validAnimal(s));o.values.date='2026-10-17';o.drawing.strokes=[[[700,2]]];assert(!validAnimal(s));
 const storage={getItem:(k)=>{assert.equal(k,ANIMAL_KEY);return '{broken';},setItem:()=>assert.fail('읽기 실패로 기존 자료를 덮어쓰면 안 된다')};assert.throws(()=>loadAnimal(storage));
});
test('활동별 작성 중인 내용과 처음·수정 설계 그림을 따로 보관한다',()=>{
 const s=emptyAnimal(),d=complete(s,'design');d.drawing.strokes=[[[10,10],[50,50]]];s.drafts.habitat.values.animal='붕어';saveAnimalRecord(s,'design','design-1');assert.equal(s.drafts.habitat.values.animal,'붕어');const r=complete(s,'share');r.drawing.strokes=[[[20,20],[80,80]]];saveAnimalRecord(s,'share','share-1');assert.deepEqual(s.records[0].data.drawing.strokes,[[[10,10],[50,50]]]);assert.deepEqual(s.records[1].data.drawing.strokes,[[[20,20],[80,80]]]);assert(validAnimal(JSON.parse(JSON.stringify(s))));
});
test('내려받는 자료는 긴 글을 보존하고 입력을 실행하지 않는다',()=>{
 const s=emptyAnimal(),d=complete(s,'design');d.values.product='<script>alert(1)</script>'+('긴 설계 설명 '.repeat(500))+'마지막 문장';saveAnimalRecord(s,'design','d');const html=animalReportHtml(s);assert(!html.includes('<script>'));assert(html.includes('&lt;script&gt;'));assert(html.includes('마지막 문장'));assert(html.includes("content:'GFIELD · 지필드'"));assert(html.includes('작성 중인 내용까지'));assert(animalReportSections(s)['animal.design'].includes('마지막 문장'));
});
test('5E는 기존 80개 짝 문항을 재사용하고 실제 수행을 자동 완료하지 않는다',()=>{
 const ids=new Set(similar.map((q)=>q.id));for(const id of [...lesson.explain.cards,lesson.explain.table,...lesson.explain.miniTest,...lesson.elaborate.items,...lesson.evaluate.items])assert(ids.has(id),id);assert.equal(similar.length,80);assert.equal(lesson.reusePairedItems,true);assert.equal(lesson.explore.lab.kind,'animal');assert.match(lesson.evaluate.performanceNote,/증거를 대신하지/);
});
test('24쪽 교재와 수업에 다섯 활동·교사 분리·실제 의견 반영을 포함한다',()=>{
 const student=renderChapter(chapter,art,similar),teacher=renderChapter(chapter,art,similar,{teacher:true});assert.equal((student.match(/class="bk-page/g)||[]).length,24);assert.equal((student.match(/class="bk-life-watermark/g)||[]).length,24);assert(!student.includes('class="bk-ans"'));assert(teacher.includes('class="bk-ans"'));assert(student.includes('친구에게 실제로 들은 의견'));
 for(const mode of ['self','teach']){const slides=buildSlides(chapter,art,plan,similar,mode);for(const a of animalActivities)assert(slides.some((s)=>s.fieldTab===a.id&&s.kind==='fieldwork'));assert.equal(slides.filter((s)=>s.kind==='write'&&!s.item).length,0);assert(slides.some((s)=>s.id==='recall'&&s.ses===2));}
});
