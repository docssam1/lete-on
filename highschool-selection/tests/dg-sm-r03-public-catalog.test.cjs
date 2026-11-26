"use strict";
const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");
const crypto=require("node:crypto");
require("../data/available-mocks.js");
require("../data/academy-engagement.js");
const nav=require("../promo/course-navigation.js");
const rounds=globalThis.HIGHSELECT_AVAILABLE_MOCKS;
function canonical(value){if(Array.isArray(value))return value.map(canonical);if(value&&typeof value==="object")return Object.fromEntries(Object.keys(value).sort().map(k=>[k,canonical(value[k])]));return value;}
function read(relative){return fs.readFileSync(path.join(__dirname,"..",relative),"utf8");}
test("the original public 50 rows remain in order and the two new metadata rows append",()=>{
 assert.equal(rounds.length,52);
 const digest=crypto.createHash("sha256").update(JSON.stringify(canonical(rounds.slice(0,50)))).digest("hex");
 assert.equal(digest,"b5d9588a03e2b318d358c7dd1087ffaa85c0a543eb2769990aaccfa082857d29");
 assert.deepEqual(rounds.slice(50).map(x=>x.id),["dg-middle1-entry-r03","sm-pre-middle-common1-r03"]);
 assert.equal(rounds.reduce((n,x)=>n+x.questionCount,0),2010);
 assert.equal(rounds.reduce((n,x)=>n+x.pageCount+x.answerPageCount+x.analysisPageCount,0),1931);
});
test("new rounds expose only public metadata and map to their own courses",()=>{
 const additions=rounds.slice(50);
 assert.deepEqual(additions.map(x=>[x.programId,x.durationMinutes,x.questionCount,x.pageCount,x.answerPageCount,x.analysisPageCount]),[["DG",70,30,8,5,3],["SM",180,30,15,16,4]]);
 assert.match(additions[0].scope,/초5·초6 누적/);
 assert.match(additions[1].scope,/기존 중2-2·중3-1·중3-2 대비 연속성/);
 for(const row of additions){assert.deepEqual(Object.keys(row).sort(),["analysisPageCount","answerPageCount","breakMinutes","durationMinutes","id","mode","pageCount","programId","questionCount","scope","sectionMinutes","title"].sort());}
 const visible=globalThis.HIGHSELECT_ACADEMY_ENGAGEMENT.programs.flatMap(p=>p.courses.flatMap(c=>nav.examsFor(p.code,c.id,rounds).map(x=>x.id)));
 assert.equal(visible.length,52);assert.equal(new Set(visible).size,52);
 assert.deepEqual(nav.selectionForExam(additions[0].id),{program:"DG",course:"middle1"});
 assert.deepEqual(nav.selectionForExam(additions[1].id),{program:"SM",course:"common1-basic"});
});
test("the promo and exam-entry HTML use the same catalog and route cache revision",()=>{
 const pages=[read("promo/index.html"),read("public/exam-entry.html")];
 const versions=pages.map(html=>{const a=html.match(/available-mocks\.js\?v=([^"']+)/);const n=html.match(/course-navigation\.js\?v=([^"']+)/);assert.ok(a&&n);assert.equal(a[1],n[1]);return a[1];});
 assert.equal(versions[0],versions[1]);assert.match(versions[0],/^dg3-sm3-20261126-v3-/);
});
