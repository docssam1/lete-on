"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
require("../data/available-mocks.js");require("../data/academy-engagement.js");require("../data/official-exam-specs.js");require("../data/public-exam-profiles.js");
const nav=require("../promo/course-navigation.js"),snapshot=require("./fixtures/public52-dg3-sm3-snapshot-v1.json");
const rounds=globalThis.HIGHSELECT_AVAILABLE_MOCKS, specs=globalThis.HIGHSELECT_OFFICIAL_EXAM_SPECS;
const legacyFive=["dg-pre-high1-r02","dg-pre-high1-r03","dg-middle1-entry-r04","sm-pre-middle-common1-r04","dg-middle1-entry-final"];
const finalThree=["dg-pre-high1-r04","dg-pre-high1-final","sm-pre-middle-common1-final"];
const read=rel=>fs.readFileSync(path.join(__dirname,"..",rel),"utf8");
test("current60 preserves all52 prior published rows and appends the same five reviewed rows plus three final candidates",()=>{
 assert.equal(rounds.length,60);assert.deepEqual(rounds.slice(0,52),snapshot.catalog);
 assert.deepEqual(rounds.slice(52,57).map(e=>e.id),legacyFive);
 assert.deepEqual(rounds.slice(57).map(e=>e.id),finalThree);
 assert.equal(rounds.reduce((s,e)=>s+e.questionCount,0),2250);
 assert.equal(rounds.reduce((s,e)=>s+e.pageCount+e.answerPageCount+e.analysisPageCount,0),2166);
 assert.deepEqual(rounds.slice(57).map(e=>[e.durationMinutes,e.sectionMinutes,e.breakMinutes,e.questionCount,e.pageCount,e.answerPageCount,e.analysisPageCount]),[[90,null,0,30,15,15,4],[90,null,0,30,15,15,4],[180,null,0,30,16,15,4]]);
 assert.deepEqual(rounds.slice(57).map(e=>[e.programId,e.title,e.scope,e.mode]),[
  ["DG","깊은생각 예비고1 입학 대비 4회","공통수학1·공통수학2 전 범위","released"],
  ["DG","깊은생각 예비고1 입학 대비 최종(마무리)","공통수학1·공통수학2 전 범위","released"],
  ["SM","생각하는수학 공통수학1 입반 대비 최종(마무리)","중2-2·중3-1·중3-2","released"]
 ]);
 const keys=Object.keys(rounds[56]).sort();for(const e of rounds.slice(57))assert.deepEqual(Object.keys(e).sort(),keys);
 assert.equal(rounds[55].title,"생각하는수학 공통수학1 입반 대비 4회");assert.equal(rounds[55].scope,"중2-2·중3-1·중3-2");
 assert.equal(rounds[56].title,"깊은생각 중1 시작반 입반 대비 최종(마무리)");assert.equal(rounds[56].scope,"초5·초6 누적");
});
test("all60 editions belong to their actual courses and the twelve advertised courses each show five rounds",()=>{
 const programs=globalThis.HIGHSELECT_ACADEMY_ENGAGEMENT.programs;
 const visible=programs.flatMap(p=>p.courses.flatMap(c=>nav.examsFor(p.code,c.id,rounds).map(e=>e.id)));
 const active=programs.flatMap(p=>p.courses.map(c=>({program:p.code,course:c.id,exams:nav.examsFor(p.code,c.id,rounds)}))).filter(c=>c.exams.length);
 assert.equal(active.length,12);
 assert.ok(active.every(c=>c.exams.length===5));
 assert.equal(programs.reduce((n,p)=>n+p.courses.length,0),40);
 assert.equal(visible.length,60);assert.equal(new Set(visible).size,60);assert.deepEqual([...visible].sort(),rounds.map(e=>e.id).sort());
 assert.deepEqual(finalThree.map(id=>nav.selectionForExam(id)),[{program:"DG",course:"pre-high1"},{program:"DG",course:"pre-high1"},{program:"SM",course:"common1-basic"}]);
 assert.deepEqual(nav.examsFor("DG","pre-high1",rounds).map(e=>e.id),["dg-pre-high1-r01","dg-pre-high1-r02","dg-pre-high1-r03",...finalThree.slice(0,2)]);
 assert.deepEqual(nav.examsFor("SM","common1-basic",rounds).map(e=>e.id),["sm-pre-middle-common1-r01","sm-pre-middle-common1-r02","sm-pre-middle-common1-r03","sm-pre-middle-common1-r04",finalThree[2]]);
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
 assert.ok(rounds.slice(57,59).every(e=>e.scope==="공통수학1·공통수학2 전 범위"));
 assert.equal(globalThis.HIGHSELECT_ACADEMY_ENGAGEMENT.programs.find(p=>p.code==="DG").courses.find(c=>c.id==="pre-high1").scope,"공통수학1·공통수학2 전 범위");
});
test("both browser entries use final3 cache tags on changed imports and promo login links",()=>{
 const version="final3-20261126-v1";
 for(const rel of ["promo/index.html","public/exam-entry.html"]){
  const html=read(rel);
  for(const file of ["available-mocks","course-navigation"]){const parts=html.split(file+".js?v=");assert.equal(parts.length,2);assert.equal(parts[1].split(String.fromCharCode(34))[0],version);}
 }
 const promo=read("promo/index.html");
 for(const file of ["official-exam-specs","public-exam-profiles","academy-engagement"])assert.ok(promo.includes(file+".js?v="+version));
 assert.equal((promo.match(/login\.html\?v=final3-20261126-v1/g)||[]).length,4);
 for(const rel of ["data/available-mocks.js","promo/index.html","public/exam-entry.html"])assert.doesNotMatch(read(rel),/private-work|bank-private|storage-objects|file_uri|access_token|service_role|\/Users\//);
});
