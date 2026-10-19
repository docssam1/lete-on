import test from 'node:test';
import assert from 'node:assert/strict';
import {plantActivities,leafPhotos}from'../data/activities/s31-u03.plant.js';
import{emptyPlant,validPlant,loadPlant,addLeafSample,reuseLeafSamples,savePlantRecord,plantDraftError,plantReportHtml,plantReportSections}from'./plant-records.js';
import{emptyAnimal}from'./animal-records.js';
import{chapter,art,plan}from'../data/book/s31-u03.book.js';
import{lesson}from'../data/units/s31-u03.lesson.js';
import{similar}from'../data/units/s31-u03.similar.js';
import{renderChapter}from'./book.js';
import{buildSlides}from'./deck.js';
import{BANK,BOOK_UNITS}from'./units-index.js';
import{curriculumBankHtml}from'./bank-catalog.js';
const fill=(s,kind)=>{const a=plantActivities.find((a)=>a.id===kind),d=s.drafts[kind];for(const f of a.fields)d.values[f.key]=f.type==='date'?'2026-10-17':f.label;if(a.classify){d.values.groupA='가 모둠';d.values.groupB='나 모둠';}return d;};
test('직접 모은 잎의 이름표·출처와 서로 다른 분류 기준을 독립 보관한다',()=>{
 const s=emptyPlant(),d=fill(s,'classify');for(const id of['leaf-a','leaf-b']){const row=addLeafSample(s,{id,name:id,source:'교실에서 제공받은 잎'});row.group='a';row.evidence='가장자리가 톱니 모양';}savePlantRecord(s,'classify','first');const before=JSON.stringify(s.records[0]);reuseLeafSamples(s);assert.equal(s.drafts.classify.values.criterion,'');assert(s.drafts.classify.samples.every((r)=>r.source==='교실에서 제공받은 잎'&&!r.group&&!r.evidence));fill(s,'classify');s.drafts.classify.values.criterion='끝의 모양';for(const r of s.drafts.classify.samples){r.group='b';r.evidence='새 기준의 근거';}savePlantRecord(s,'classify','second');assert.equal(JSON.stringify(s.records[0]),before);assert.notEqual(s.records[0].data.values.criterion,s.records[1].data.values.criterion);assert(validPlant(s));
});
test('잘못된 잎·중복 이름표·빈 분류와 ID 충돌은 기존 기록을 보존한다',()=>{
 const s=emptyPlant(),d=fill(s,'classify');assert.match(plantDraftError(plantActivities[1],d),/두 가지/);addLeafSample(s,{id:'a',name:'잎 가',source:'사진 자료'});const before=JSON.stringify(s);assert.throws(()=>addLeafSample(s,{id:'a',name:'덮어쓰기'}));assert.equal(JSON.stringify(s),before);assert.throws(()=>savePlantRecord(s,'classify','x'));assert.equal(s.records.length,0);fill(s,'observe');savePlantRecord(s,'observe','first');fill(s,'observe');const record=JSON.stringify(s.records);assert.throws(()=>savePlantRecord(s,'observe','first'));assert.equal(JSON.stringify(s.records),record);
});
test('제공 사진은 사진 자료이며 실제 채집·관찰 기록을 자동 생성하지 않는다',()=>{
 const s=emptyPlant();for(const p of leafPhotos)addLeafSample(s,{id:'photo-'+p.id,name:p.name,source:'이론편 PDF 8쪽 사진',photoId:p.id});assert.equal(s.records.length,0);assert.equal(s.drafts.classify.samples.length,6);assert(s.drafts.classify.samples.every((r)=>r.photoId&&!r.group));assert(validPlant(s));
});
test('다른 단원 파일·잘못된 날짜·손상 좌표를 거부하고 원래 저장소는 덮어쓰지 않는다',()=>{
 assert(!validPlant(emptyAnimal()));const s=emptyPlant();s.unit='s31-u02';assert(!validPlant(s));s.unit='s31-u03';s.drafts.observe.values.date='2026-02-30';assert(!validPlant(s));s.drafts.observe.values.date='2026-10-17';s.drafts.observe.drawing.strokes=[[[NaN,1]]];assert(!validPlant(s));assert.throws(()=>loadPlant({getItem:()=>'{broken',setItem:()=>assert.fail('읽기 실패 후 덮어쓰면 안 된다')}));
});
test('설계·수정 그림과 초안을 구별하고 보고서의 긴 글과 입력 안전성을 유지한다',()=>{
 const s=emptyPlant(),d=fill(s,'design');d.values.product='<script>alert(1)</script>'+('긴 설명 '.repeat(500))+'마지막 문장';d.drawing.strokes=[[[1,2],[60,70]]];s.drafts.habitat.values.plant='부레옥잠';savePlantRecord(s,'design','d');fill(s,'share').drawing.strokes=[[[10,20],[100,200]]];savePlantRecord(s,'share','r');assert.equal(s.drafts.habitat.values.plant,'부레옥잠');assert.notDeepEqual(s.records[0].data.drawing.strokes,s.records[1].data.drawing.strokes);const html=plantReportHtml(s);assert(!html.includes('<script>'));assert(html.includes('&lt;script&gt;'));assert(html.includes('마지막 문장'));assert(plantReportSections(s)['plant.design'].includes('마지막 문장'));assert(html.includes("content:'GFIELD · 지필드'"));assert(validPlant(JSON.parse(JSON.stringify(s))));
});
test('5E의 모든 연결은 기존 80개 짝 문항에 있고 수행을 자동 완료하지 않는다',()=>{
 const ids=new Set(similar.map((q)=>q.id));for(const id of[...lesson.explain.cards,lesson.explain.table,...lesson.explain.miniTest,...lesson.elaborate.items,...lesson.evaluate.items])assert(ids.has(id),id);assert.equal(similar.length,80);assert.equal(lesson.reusePairedItems,true);assert.equal(lesson.explore.lab.kind,'plant');assert.match(lesson.evaluate.performanceNote,/증거를 대신하지/);
});
test('25쪽 교재와 두 수업 모드에 실제 잎 자료·다섯 활동·협의와 수정을 포함한다',()=>{
 const student=renderChapter(chapter,art,similar),teacher=renderChapter(chapter,art,similar,{teacher:true});assert.equal((student.match(/class="bk-page/g)||[]).length,25);assert.equal((student.match(/class="bk-life-watermark/g)||[]).length,25);assert(!student.includes('class="bk-ans"'));assert(teacher.includes('class="bk-ans"'));assert(student.includes('내 잎 관찰 준비와 이름표'));assert(student.includes('고친 설계와 그 까닭'));assert(!student.includes('[&quot;'));for(const mode of['self','teach']){const slides=buildSlides(chapter,art,plan,similar,mode);assert.equal(slides.length,mode==='self'?45:46);for(const a of plantActivities)assert(slides.some((s)=>s.fieldTab===a.id&&s.kind==='fieldwork'));assert(slides.some((s)=>s.id==='recall'&&s.ses===2));assert.equal(slides.filter((s)=>s.kind==='write'&&!s.item).length,0);assert(!slides.find((s)=>s.id==='environment').body.includes('숨 쉬는'));assert(slides.find((s)=>s.id==='environment').title.includes('식물별'));assert(!slides.map((s)=>s.title+s.body).join('').includes('동물'));}
});

test('완성한 동물·식물 단원의 수업·교재를 실제 32단원 차례에서 열 수 있다',()=>{const html=curriculumBankHtml(BANK);for(const u of ['s31-u02','s31-u03']){assert(BOOK_UNITS.has(u));assert.equal(BANK[u].lesson,true);assert(html.includes(`href="#/${u}/start"`));assert(html.includes(`href="#/${u}/2/lab"`));}});
