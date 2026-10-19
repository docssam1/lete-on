import test from 'node:test';
import assert from 'node:assert/strict';
import {inquiry} from '../data/activities/c22-s32-u01.inquiry.js';
import {emptyInquiry,inquiryDraft,inquiryError,validInquiry,saveInquiry,loadInquiry,inquiryKey,inquirySections,inquiryReportHtml} from './inquiry-records.js';
const fill=(s,id)=>{const a=inquiry.activities.find(a=>a.id===id),d=s.drafts[id];for(const f of a.fields)d.values[f.key]=f.type==='date'?'2026-10-17':f.options?.[0]||f.label+' 검수 입력';if(a.columns)d.rows=Array.from({length:a.minRows||2},(_,i)=>a.columns.map(h=>h+' '+(i+1)));return d;};
test('실제 자료별 근거·날짜와 상태를 확인하고 계획을 수행 완료로 승격하지 않는다',()=>{
 const s=emptyInquiry(inquiry);assert(validInquiry(inquiry,s));assert(inquiryError(inquiry.activities[0],s.drafts.materials));const d=fill(s,'materials');d.values.date='2026-02-30';assert(!validInquiry(inquiry,s));d.values.date='2026-10-17';d.rows[0][2]='';assert(inquiryError(inquiry.activities[0],d));d.rows[0][2]='직접 확인한 특징';const r=saveInquiry(inquiry,s,'materials','m1');assert.equal(r.data.values.status,'직접 관찰함');assert(!Object.hasOwn(r,'complete'));assert(!Object.hasOwn(r,'score'));assert(validInquiry(inquiry,s));
 fill(s,'design').values.status='설계만 함';saveInquiry(inquiry,s,'design','d1');assert.equal(s.records[1].data.values.status,'설계만 함');assert(inquirySections(inquiry,s)['inquiry.design'].includes('설계만 함'));
});
test('새 기록·수정·다른 활동 ID와 훼손된 가져오기를 원자적으로 구별한다',()=>{
 const s=emptyInquiry(inquiry);fill(s,'design');saveInquiry(inquiry,s,'design','one');fill(s,'design');const before=structuredClone(s);assert.throws(()=>saveInquiry(inquiry,s,'design','one'));assert.deepEqual(s,before);s.drafts.design={...structuredClone(s.records[0].data),editingId:'one'};s.drafts.design.values.problem='바꾼 생활 문제';saveInquiry(inquiry,s,'design','unused');assert.equal(s.records.length,1);assert.equal(s.records[0].data.values.problem,'바꾼 생활 문제');fill(s,'share').editingId='one';assert.throws(()=>saveInquiry(inquiry,s,'share','unused'));delete s.drafts.share.editingId;assert(!validInquiry(inquiry,s));
 const bad=emptyInquiry(inquiry);bad.records.push({id:'bad',kind:'materials',data:inquiryDraft(inquiry.activities[0])});assert(!validInquiry(inquiry,bad));const cross={...emptyInquiry(inquiry),unit:'s31-u03'};assert(!validInquiry(inquiry,cross));let writes=0;const storage={getItem:()=>JSON.stringify(cross),setItem:()=>writes++};assert.throws(()=>loadInquiry(inquiry,storage));assert.equal(writes,0);
});
test('보고서에 모든 자료·그림을 포함하고 학생 입력을 실행 가능한 HTML로 내보내지 않는다',()=>{
 const s=emptyInquiry(inquiry),d=fill(s,'materials');d.values.target='<img src=x onerror=alert(1)>';d.rows[0][2]='<script>bad</script>';d.drawing.strokes=[[[1,1],[20,20]]];d.drawing.description='이름표와 확인한 재료';saveInquiry(inquiry,s,'materials','m1');const html=inquiryReportHtml(inquiry,s);assert(!html.includes('<script>'));assert(!html.includes('<img'));assert(html.includes('&lt;script&gt;'));assert(html.includes('<polyline'));assert(html.includes('GFIELD · 지필드'));assert(html.includes('이름표와 확인한 재료'));assert.equal(inquiryKey(inquiry),'sciLab.inquiry.c22-s32-u01');
});
