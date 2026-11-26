"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
require("../data/available-mocks.js");require("../data/academy-engagement.js");require("../data/official-exam-specs.js");require("../data/public-exam-profiles.js");
const nav=require("../promo/course-navigation.js"),snapshot=require("./fixtures/public52-dg3-sm3-snapshot-v1.json");
const rounds=globalThis.HIGHSELECT_AVAILABLE_MOCKS, specs=globalThis.HIGHSELECT_OFFICIAL_EXAM_SPECS;
const ids=["dg-pre-high1-r02","dg-pre-high1-r03","dg-middle1-entry-r04","sm-pre-middle-common1-r04","dg-middle1-entry-final"];
const read=rel=>fs.readFileSync(path.join(__dirname,"..",rel),"utf8");
test("current57 preserves all52 published metadata rows and appends only five reviewed editions",()=>{
 assert.equal(rounds.length,57);assert.deepEqual(rounds.slice(0,52),snapshot.catalog);
 assert.deepEqual(rounds.slice(52).map(e=>e.id),ids);
 assert.equal(rounds.reduce((s,e)=>s+e.questionCount,0),2160);
 assert.equal(rounds.reduce((s,e)=>s+e.pageCount+e.answerPageCount+e.analysisPageCount,0),2063);
 assert.deepEqual(rounds.slice(52).map(e=>[e.durationMinutes,e.questionCount,e.pageCount,e.answerPageCount,e.analysisPageCount]),[[90,30,15,15,4],[90,30,15,15,4],[70,30,6,5,3],[180,30,16,16,4],[70,30,6,5,3]]);
 assert.equal(rounds[55].title,"생각하는수학 공통수학1 입반 대비 4회");assert.equal(rounds[55].scope,"중2-2·중3-1·중3-2");
 assert.equal(rounds[56].title,"깊은생각 중1 시작반 입반 대비 최종(마무리)");assert.equal(rounds[56].scope,"초5·초6 누적");
 for(const e of rounds.slice(52))assert.deepEqual(Object.keys(e).sort(),["id","programId","title","scope","mode","durationMinutes","sectionMinutes","breakMinutes","questionCount","pageCount","answerPageCount","analysisPageCount"].sort());
});
test("the five new editions belong only to their actual courses and all57 remain reachable once",()=>{
 assert.deepEqual(ids.map(id=>nav.selectionForExam(id)),[{program:"DG",course:"pre-high1"},{program:"DG",course:"pre-high1"},{program:"DG",course:"middle1"},{program:"SM",course:"common1-basic"},{program:"DG",course:"middle1"}]);
 assert.deepEqual(nav.examsFor("DG","pre-high1",rounds).map(e=>e.id),["dg-pre-high1-r01",...ids.slice(0,2)]);
 assert.deepEqual(nav.examsFor("DG","middle1",rounds).map(e=>e.id),["dg-middle1-entry-r01","dg-middle1-entry-r02","dg-middle1-entry-r03",ids[2],ids[4]]);
 const visible=globalThis.HIGHSELECT_ACADEMY_ENGAGEMENT.programs.flatMap(p=>p.courses.flatMap(c=>nav.examsFor(p.code,c.id,rounds).map(e=>e.id)));
 assert.equal(visible.length,57);assert.equal(new Set(visible).size,57);assert.deepEqual([...visible].sort(),rounds.map(e=>e.id).sort());
});
test("current H1 official scope covers common1/common2 while the historical first paper retains its narrower scope",()=>{
 const s=specs.courses["DG:pre-high1"];assert.equal(s.scope,"공통수학1 + 공통수학2 전 범위");
 assert.equal(s.sourceUrl,"https://apply.dailystudy.com/entrance-test/info/?academy=master&grade=H1");
 assert.equal(s.checkedAt,"2026-11-26");
 const fact=globalThis.HIGHSELECT_PUBLIC_PROFILES.profiles.find(p=>p.code==="DG").facts.find(f=>f.label==="대치 2027 예비고1 범위");
 assert.equal(fact.value,s.scope);
 assert.equal(specs.editions["dg-pre-high1-r01"].scope,"공통수학1 + 공통수학2 도형의 방정식");
 assert.equal(specs.editions["dg-pre-high1-r01"].scopeState,"source-paper");
 assert.equal(rounds.find(e=>e.id==="dg-pre-high1-r01").scope,snapshot.catalog.find(e=>e.id==="dg-pre-high1-r01").scope);
 assert.ok(rounds.slice(52,54).every(e=>e.scope==="공통수학1·공통수학2 전 범위"));
 assert.equal(globalThis.HIGHSELECT_ACADEMY_ENGAGEMENT.programs.find(p=>p.code==="DG").courses.find(c=>c.id==="pre-high1").scope,"공통수학1·공통수학2 전 범위");
});
test("both browser entries and all changed promo data imports carry the same current cache revision",()=>{
 const version="dg-next3-20261126-v2-329e1630-498e5f09";
 for(const rel of ["promo/index.html","public/exam-entry.html"]){
  const html=read(rel);
  for(const file of ["available-mocks","course-navigation"]){const parts=html.split(file+".js?v=");assert.equal(parts.length,2);assert.equal(parts[1].split(String.fromCharCode(34))[0],version);}
 }
 const promo=read("promo/index.html");
 for(const file of ["official-exam-specs","public-exam-profiles","academy-engagement"])assert.ok(promo.includes(file+".js?v="+version));
 for(const rel of ["data/available-mocks.js","promo/index.html","public/exam-entry.html"])assert.doesNotMatch(read(rel),/private-work|bank-private|storage-objects|file_uri|access_token|service_role|\/Users\//);
});
