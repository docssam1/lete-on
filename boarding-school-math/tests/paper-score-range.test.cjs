"use strict";
const assert = require("node:assert/strict"), test = require("node:test");
const engine = require("../shared/paper-score-range.js");
const bands = [{id:"top1",label:"1%"},{id:"top5",label:"5%"},{id:"top25",label:"25%"}];
const reference = {top1:130.5,top5:100.5,top25:75};
test("published interval bounds include their lower bound and exclude the next cutoff",()=>{
  assert.deepEqual(engine.intervalFor(100.5,150,reference,bands),{id:"top5",labels:["5%"],lower:100.5,upper:130.5,upperInclusive:false});
  assert.equal(engine.intervalFor(130.5,150,reference,bands).id,"top1");
  assert.equal(engine.intervalFor(0,150,reference,bands).id,"below");
  assert.equal(engine.intervalFor(150,150,reference,bands).upperInclusive,true);
  assert.equal(engine.intervalFor(151,150,reference,bands),null);
  assert.equal(engine.intervalFor(75,150,null,bands),null);
});
test("ties, sparse cutoffs and a cutoff at the maximum never create empty intervals",()=>{
  assert.deepEqual(engine.intervalsFor(15,{top1:15,top5:15,top25:8},bands).map(x=>[x.id,x.lower,x.upper,x.upperInclusive]),[["top1",15,15,true],["top25",8,15,false],["below",0,8,false]]);
  assert.deepEqual(engine.intervalsFor(15,{top5:0},bands).map(x=>[x.lower,x.upper]),[[0,15]]);
  assert.equal(engine.intervalsFor(150,{top1:100,top5:120},bands).length,0);
  assert.equal(engine.intervalsFor(150,{top1:NaN,top5:151},bands).length,0);
  assert.equal(engine.intervalsFor(150,{top1:130.5},bands).length,2);
});
const context={programId:"amc10",grade:9,max:150,scoringKey:"0:6:0:1.5:150:25",asOf:"2026-11-15"};
function entry(year,points,date="2026-11-01",extra={}) {return {programId:"amc10",grade:9,max:150,scoringKey:context.scoringKey,year,form:"A",points,examDate:date,complete:true,...extra};}
test("expected range is exactly the recent observed minimum and maximum, with a three-paper minimum",()=>{
  assert.equal(engine.forecast([entry(2023,90),entry(2024,120)],context).ready,false);
  const result=engine.forecast([entry(2023,90),entry(2024,120),entry(2025,105)],context);
  assert.deepEqual([result.ready,result.lower,result.upper,result.median,result.count],[true,90,120,105,3]);
});
test("repeated papers, future dates, incomplete marks and incompatible scoring do not inflate the range",()=>{
  const result=engine.forecast([entry(2023,90,"2026-10-01"),entry(2023,150,"2026-11-02"),entry(2024,120),entry(2025,105),
    entry(2020,150,"2026-11-16"),entry(2019,150,"2026-11-01",{grade:8}),entry(2018,150,"2026-11-01",{programId:"amc12"}),
    entry(2017,150,"2026-11-01",{complete:false}),entry(2016,150,"2026-11-01",{scoringKey:"different"}),entry(2015,150,"2026-02-01"),
    entry(2014,151),entry(2013,100.1),entry(2027,105),entry(2012,105,"2026-02-31")],context);
  assert.deepEqual([result.lower,result.upper,result.count],[90,120,3]);
  assert.equal(engine.forecast([entry(2023,90,"2026-02-01"),entry(2023,150,"2026-11-01")],context).count,0);
});
test("recent eight distinct papers are used and zero/perfect scores are retained",()=>{
  const result=engine.forecast(Array.from({length:10},(_,i)=>entry(2010+i,i===9?0:i===8?150:i*6,`2026-11-${String(i+1).padStart(2,"0")}`)),context);
  assert.deepEqual([result.count,result.lower,result.upper],[8,0,150]);
  assert.deepEqual(result.entries.map(x=>x.year),[2019,2018,2017,2016,2015,2014,2013,2012]);
});
test("AMC8 and AIME stay on their own integer scales and do not use half-point scores",()=>{
  for(const [programId,max] of [["amc8",25],["aime",15]]){
    const ctx={...context,programId,max,scoringKey:`${programId}-integer`};
    const result=engine.forecast([entry(2023,0),entry(2024,6),entry(2025,max),entry(2022,4.5)].map(x=>({...x,programId,max,scoringKey:ctx.scoringKey})),ctx);
    assert.deepEqual([result.count,result.lower,result.upper],[3,0,max]);
  }
});

test("legacy aggregates recover only exact paper labels and score-reconciled records enter the range",()=>{
 const library=require("../competition/amc-original-paper-library.js");
 const record={programId:"amc10",grade:9,paperLabel:"2024 AMC 10 A",examDate:"2026-11-01",summary:{itemCount:25,unmarked:0,correct:15,wrong:5,blank:5}};
 assert.equal(engine.attemptFromDiagnostic(record,library).points,97.5);
 assert.equal(engine.attemptFromDiagnostic({...record,paperLabel:"My practice A"},library),null);
 assert.equal(engine.attemptFromDiagnostic({...record,paper:{year:2024,form:"A",points:150,max:150}},library),null);
 assert.equal(engine.attemptFromDiagnostic({...record,paper:{year:2024,form:"A",points:97.5,max:150}},library).points,97.5);
 assert.equal(engine.attemptFromDiagnostic({...record,paper:{year:2024,form:"Z",points:97.5,max:150}},library),null);
 assert.equal(engine.attemptFromDiagnostic({...record,summary:{...record.summary,unmarked:1}},library),null);
});
test("void-item adjusted totals are preserved but legacy counts cannot invent the adjustment",()=>{
 const library=require("../competition/amc-original-paper-library.js");
 const record={programId:"amc12",grade:10,paperLabel:"2025 AMC 12 A",examDate:"2026-11-01",summary:{itemCount:25,unmarked:0,correct:20,wrong:5,blank:0}};
 assert.equal(engine.attemptFromDiagnostic(record,library),null);
 assert.equal(engine.attemptFromDiagnostic({...record,paper:{year:2025,form:"A",points:126,max:150}},library).points,126);
 assert.equal(engine.attemptFromDiagnostic({...record,paper:{year:2025,form:"A",points:120,max:150}},library).points,120);
 assert.equal(engine.attemptFromDiagnostic({...record,paper:{year:2025,form:"A",points:124.5,max:150}},library),null);
});

test("identifiable historical papers remain comparable only within their own scoring profile",()=>{
 const library=require("../competition/amc-original-paper-library.js");
 const attempts=[1980,1981,1982].map((year,index)=>engine.attemptFromDiagnostic({programId:"amc12",grade:10,paper:{year,form:"",points:150-index*5,max:150},examDate:`2026-11-0${index+1}`,summary:{itemCount:30,unmarked:0,correct:30-index,wrong:index,blank:0}},library));
 const result=engine.forecast(attempts,{...context,programId:"amc12",grade:10,scoringKey:engine.scoringKey(library.formatFor("amc12",1982,""))});
 assert.deepEqual([result.ready,result.lower,result.upper],[true,140,150]);
 assert.equal(engine.forecast(attempts,{...context,programId:"amc12",grade:10}).ready,false);
});

test("paper identity survives partial marks and custom notes independently from score eligibility",()=>{
 const library=require("../competition/amc-original-paper-library.js");
 const record={programId:"amc10",grade:9,paperLabel:"2025 AMC 10 B",paper:{year:2021,form:"C"},summary:{itemCount:25,unmarked:24,correct:1,wrong:0,blank:0}};
 assert.deepEqual(engine.identityFromDiagnostic(record,library),{year:2021,form:"C"});
 assert.equal(engine.attemptFromDiagnostic(record,library),null);
 assert.equal(engine.identityFromDiagnostic({...record,paper:{year:2025,form:"C"}},library),null);
 assert.deepEqual(engine.identityFromDiagnostic({programId:"amc10",paperLabel:"2020 AMC 10 A"},library),{year:2020,form:"A"});
 assert.equal(engine.identityFromDiagnostic({programId:"amc10",paperLabel:"Review in 2020"},library),null);
});
