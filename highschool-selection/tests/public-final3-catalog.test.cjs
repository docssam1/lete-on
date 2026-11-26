"use strict";
const test=require("node:test"),assert=require("node:assert/strict"),fs=require("node:fs"),path=require("node:path");
require("../data/available-mocks.js");require("../data/academy-engagement.js");
const nav=require("../promo/course-navigation.js");
const snapshot=require("./fixtures/public57-final3-baseline-v1.json");
const rows=globalThis.HIGHSELECT_AVAILABLE_MOCKS,root=path.join(__dirname,"..");
const read=rel=>fs.readFileSync(path.join(root,rel),"utf8");
const additions=["dg-pre-high1-r04","dg-pre-high1-final","sm-pre-middle-common1-final"];
test("the exact prior57 public metadata rows remain byte-for-byte equivalent as objects and the requested three append",()=>{
 assert.equal(snapshot.catalog.length,57);
 assert.deepEqual(rows.slice(0,57),snapshot.catalog);
 assert.deepEqual(rows.slice(57).map(x=>x.id),additions);
 assert.deepEqual(rows.map(x=>Object.keys(x).sort()),[...snapshot.catalog.map(x=>Object.keys(x).sort()),...Array(3).fill(Object.keys(snapshot.catalog[0]).sort())]);
});
test("the locked prior57 snapshot records the former shared HTML cache tag",()=>{
 assert.equal(snapshot.htmlCacheTag,"dg-next3-20261126-v2-329e1630-498e5f09");
 assert.equal(snapshot.examEntryCacheTag,snapshot.htmlCacheTag);
});
test("final3 data stays public metadata only and remains within the three intended courses",()=>{
 const expected=[
  ["dg-pre-high1-r04","DG","공통수학1·공통수학2 전 범위","pre-high1"],
  ["dg-pre-high1-final","DG","공통수학1·공통수학2 전 범위","pre-high1"],
  ["sm-pre-middle-common1-final","SM","중2-2·중3-1·중3-2","common1-basic"]
 ];
 for(const [id,program,scope,course] of expected){
  const exam=rows.find(x=>x.id===id);assert.equal(exam.programId,program);assert.equal(exam.scope,scope);assert.equal(exam.mode,"released");
  assert.deepEqual(nav.selectionForExam(id),{program,course});
  assert.deepEqual(Object.keys(exam).sort(),Object.keys(snapshot.catalog[0]).sort());
  assert.equal(exam.sectionMinutes,null);assert.equal(exam.breakMinutes,0);assert.equal(exam.questionCount,30);
 }
 assert.equal(rows.reduce((n,x)=>n+x.questionCount,0),2250);
 assert.equal(rows.reduce((n,e)=>n+e.pageCount+e.answerPageCount+e.analysisPageCount,0),2166);
});
test("the public H1 R1 scope stays historical while the current H1 course and new editions use the full range",()=>{
 assert.equal(rows.find(x=>x.id==="dg-pre-high1-r01").scope,snapshot.catalog.find(x=>x.id==="dg-pre-high1-r01").scope);
 assert.notEqual(rows.find(x=>x.id==="dg-pre-high1-r01").scope,rows.find(x=>x.id==="dg-pre-high1-r04").scope);
});
test("final3 revision is shared by changed imports and the four public promo login links",()=>{
 const version="final3-20261126-v1";
 for(const rel of ["promo/index.html","public/exam-entry.html"]){
  const html=read(rel);for(const name of ["available-mocks","course-navigation"]){const match=html.match(new RegExp(name+"\\.js\\?v=([^\" ]+)"));assert.equal(match?.[1],version);}
 }
 const promo=read("promo/index.html");assert.equal((promo.match(/login\.html\?v=final3-20261126-v1/g)||[]).length,4);
 for(const rel of ["data/available-mocks.js","promo/index.html","public/exam-entry.html"])assert.doesNotMatch(read(rel),/private-work|bank-private|storage-objects|file_uri|access_token|service_role|\/Users\//);
});
