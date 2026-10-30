import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
import {exportGrade5} from './print/export-grade5.mjs';
const w={};vm.runInNewContext(readFileSync(new URL('planner-report.js',import.meta.url),'utf8'),{window:w});const R=w.PlannerReport;
const sample=extra=>({grade:'pre',age:7,fields:{year:2026,mon:11},lanes:[{id:'school',label:'교과',blocks:[{id:'a',title:'초등 3-1 응용',start:0,end:4},{id:'b',title:'초등 3-2 응용',start:4,end:7}]}],...extra});
test('preschool milestones stop at February, include an exact boundary finish, and do not finish the March course',()=>{
 const m=R.model(sample()),entry=m.admissions[0];assert.equal(entry.id,'elementary');assert.equal(entry.date,'2027년 2월까지');assert.equal(entry.cutoff,4);assert.equal(entry.rows[0].completed,'초등 3-1 응용');assert.equal(entry.rows[0].ongoing,null);assert.equal(m.admissions.length,3);assert.match(R.render(m),/입학 전 어디까지/);
});
test('January uses the current school year while Korean preschool age remains a calendar-year age',()=>{
 const primary=R.model(sample({grade:6,age:null,fields:{year:2027,mon:1}})).admissions[0];assert.equal(primary.year,2027);assert.equal(primary.cutoff,2);
 const pre=R.model(sample({age:7,fields:{year:2027,mon:1}})).admissions[0];assert.equal(pre.year,2028);assert.equal(pre.cutoff,14);
});
test('past entry dates, international calendars and an unknown age do not become invented histories',()=>{
 assert.deepEqual(Array.from(R.model(sample({grade:7})).admissions,e=>e.id),['high']);
 assert.equal(R.model(sample({fields:{year:2026,mon:11,internationalCalendar:true}})).admissions.length,0);
 assert.equal(R.model(sample({age:null})).admissions.length,0);
});
test('clipped source courses, sustained support and six-month reviews cannot be reported as completed books',()=>{
 const rows=R.model(sample({lanes:[{id:'school',label:'교과',anchor:0,blocks:[{id:'a',title:'긴 교과',start:0,end:3,sourceStart:0,sourceEnd:6}]},{id:'thinking',label:'사고력',blocks:[{title:'도형 꾸준히',start:0,end:4,sustained:true},{title:'오답 유지',start:0,end:4,kind:'review'}]}]})).admissions[0].rows;
 assert.equal(rows.length,1);assert.equal(rows[0].completed,null);assert.equal(rows[0].ongoing,'긴 교과');
});
test('grade5 distinguishes completed middle2-1, ongoing middle2-2, high school application and science continuation',()=>{
 const d=exportGrade5(),entries=d.report.admissions,mid=entries.find(e=>e.id==='middle'),high=entries.find(e=>e.id==='high'),row=(e,id)=>e.rows.find(r=>r.id===id);
 assert.equal(entries.length,2);assert.equal(mid.date,'2028년 2월까지');assert.match(row(mid,'school').completed,/중2-1/);assert.match(row(mid,'school').ongoing,/중2-2/);assert.equal(row(mid,'school').ongoingUntil,'2028.04');assert.match(row(mid,'deep').completed,/중1-2/);assert.match(row(mid,'calc').completed,/도형 3권/);
 assert.equal(high.date,'2031년 2월까지');assert.match(row(high,'school').completed,/공통수학2 쎈/);assert.equal(row(high,'school').unplanned,true);assert.equal(row(high,'science').completedAt,'2031.02');assert.match(row(high,'science').completed,/통합과학 2/);assert.doesNotMatch(row(high,'science').completed,/시작/);
 assert.equal(row(mid,'thinking').completedAt,'2027.06');assert.equal(row(high,'thinking').completedAt,'2027.06');
});

test('a course with no end date is not projected as still studying the same book at every school entry',()=>{
 const m=R.model(sample({lanes:[{id:'school',label:'교과',blocks:[{title:'기간을 고르지 않은 책',start:0,end:null}]}]}));
 assert.ok(m.admissions.every(e=>e.rows.length===0));
});
