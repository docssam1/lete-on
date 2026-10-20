// 2026-10-19: 기본 수업은 사고력 수업(think-lessons.test.mjs)으로 바뀌었다. 이 파일은 선택 기능으로 옮긴 탐구 기록장·기록 교재(records)가 예전대로 동작하는지 본다.
import test from 'node:test';import assert from 'node:assert/strict';
import {inquiry} from '../data/activities/c22-s32-u04.inquiry.js';import {recordsLesson as lesson} from '../data/units/c22-s32-u04.records.js';import {chapter,art,plan} from '../data/book/c22-s32-u04.records-book.js';import {items} from '../data/units/c22-s32-u04.js';
import {emptyInquiry,saveInquiry,validInquiry,inquiryError,inquirySections} from './inquiry-records.js';import {buildSlides} from './deck.js';import {renderChapter} from './book.js';import {BANK,BOOK_UNITS} from './units-index.js';
test('감염병 수업의 일곱 활동을 연결하되 원문·임상 진단·공식 성적을 만들어 내지 않는다',()=>{
 assert.deepEqual(inquiry.activities.map(a=>a.id),['cases','routes','model','handwash','habits','share','practice']);assert(BOOK_UNITS.has(inquiry.unit));assert(BANK[inquiry.unit].lesson);assert(BANK[inquiry.unit].sourcePending);assert.equal(BANK[inquiry.unit].n,0);assert.deepEqual(BANK[inquiry.unit].sets,[]);
 for(const a of inquiry.activities){assert(a.steps.length>=4);assert(a.fields.some(f=>f.key==='date'&&f.required));assert(a.fields.some(f=>f.key==='status'&&f.required));assert(lesson.report.sections.some(s=>s.from==='inquiry.'+a.id));}
 const safety=lesson.explore.home.safety.join(' ');assert.match(safety,/병원체 배양/);assert.match(safety,/침이나 컵 공유/);assert.match(safety,/건강 상태나 공식 성적/);
 const refs=[...chapter.check,...chapter.formative.items];assert.equal(new Set(refs).size,16);for(const id of refs)assert(items.some(q=>q.id===id));assert.equal(refs.filter(id=>items.find(q=>q.id===id).answerContract.type==='written-explanation').length,4);
});
test('다섯 과정·세 기회의 근거를 독립 보관하며 미실천·미기록·계획을 완료로 승격하지 않는다',()=>{
 const s=emptyInquiry(inquiry);for(const a of inquiry.activities){const d=s.drafts[a.id];for(const f of a.fields)d.values[f.key]=f.type==='date'?'2026-10-18':f.options?.at(-1)||f.label+' 기능 검수 예시';if(a.columns)d.rows=Array.from({length:a.minRows},(_,i)=>a.columns.map(c=>c+' 기능 검수 '+i));}
 const a=inquiry.activities.find(a=>a.id==='routes');s.drafts.routes.rows.pop();assert(inquiryError(a,s.drafts.routes));s.drafts.routes.rows.push(a.columns.map(c=>c+' 다섯 번째 과정'));
 const b=inquiry.activities.find(a=>a.id==='practice');s.drafts.practice.rows.pop();assert(inquiryError(b,s.drafts.practice));s.drafts.practice.rows.push(['검수 기회3','미기록','확인 못함','어른에게 다음 방법 상의할 계획']);
 s.drafts.share.values.status='앞으로 공유할 계획';
 for(const kind of['routes','model','share','practice'])saveInquiry(inquiry,s,kind,'test-'+kind);assert(validInquiry(inquiry,s));assert.equal(s.records.length,4);assert.match(inquirySections(inquiry,s)['inquiry.practice'],/미기록/);assert.match(inquirySections(inquiry,s)['inquiry.share'],/앞으로 공유할 계획/);assert(!s.records.some(r=>Object.hasOwn(r,'score')||Object.hasOwn(r,'complete')||Object.hasOwn(r,'infected')));
 const cross=structuredClone(s);cross.unit='s32-u04';assert(!validInquiry(inquiry,cross));
});
test('학생 교재는 지도 답을 숨기고 두 수업은 계획 그림·7기록·16자료 확인을 제공한다',()=>{
 assert.equal(chapter.pages.length,42);
 for(const mode of['self','teach']){const slides=buildSlides(chapter,art,plan,items,mode);assert.equal(slides.length,mode==='teach'?63:62);assert.equal(slides.filter(s=>s.mount==='lab').length,7);assert.equal(slides.filter(s=>s.id.endsWith('-sources')).length,2);assert.equal(slides.find(s=>s.ses===2).id,'cases-concept');assert.equal(slides.filter(s=>s.item).length,16);assert.match(slides.find(s=>s.id==='model-sources').title,/계획/);assert(slides.find(s=>s.id==='practice-concept'));}
 const student=renderChapter(chapter,art,items),teacher=renderChapter(chapter,art,items,{teacher:true});assert(!student.includes('class="bk-ans"'));assert(teacher.includes('class="bk-ans"'));assert(!student.includes('[object Object]'));assert(student.includes('홍역·볼거리·풍진'));assert(student.includes('접촉'));assert.equal((student.match(/target="_blank"/g)||[]).length,4);assert.match(student,/bk-band-no">04/);assert.equal((student.match(/GFIELD · 지필드/g)||[]).length,42);assert.equal((student.match(/<img /g)||[]).length,2);assert(!student.includes('1→2→4→6'));assert(teacher.includes('1→2→4→6'));assert.equal((teacher.match(/예시 답:/g)||[]).length,4);
});
