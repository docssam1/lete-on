"use strict";
const test=require("node:test"),assert=require("node:assert/strict");
const engine=require("../shared/paper-learning-profile.js"),range=require("../shared/paper-score-range.js"),library=require("../competition/amc-original-paper-library.js");
const domains=(a,b,c=0)=>[{id:"algebra",correct:a,wrong:b,blank:c,attempted:a+b}];
function record(year,date,extra={}){return {id:"r"+year+date,programId:"amc10",grade:9,paperLabel:year+" AMC 10 A",paper:{year,form:"A",points:30,max:150},examDate:date,savedAt:date+"T01:00:00Z",summary:{itemCount:25,correct:5,wrong:20,blank:0,unmarked:0},domains:domains(5,0),concepts:[{id:"fraction",correct:0,wrong:1,blank:0}],reasons:[{id:"reading",count:1}],...extra};}
const opts={range,library,asOf:"2026-11-16"};
test("strengths and review states include blanks and require three marked questions",()=>{
 assert.equal(engine.domainsFor(domains(2,0))[0].state,"insufficient");
 assert.equal(engine.domainsFor(domains(3,0))[0].state,"strength");
 assert.equal(engine.domainsFor(domains(3,0,7))[0].state,"review");
 assert.equal(engine.domainsFor(domains(4,1))[0].state,"strength");
 assert.equal(engine.domainsFor(domains(3,2))[0].state,"review");
 assert.equal(engine.domainsFor(domains(7,3))[0].state,"developing");
});
test("concept counts contain no question numbers or answers and do not duplicate a tag within one item",()=>{
 const rows=engine.conceptsFromMarks([{status:"wrong",answer:"secret"},{status:"correct"},{status:"blank"},{status:"unmarked"}],n=>({sourceConcepts:n===1?["fraction","fraction","parity"]:["fraction"]}));
 assert.deepEqual(rows,[{id:"fraction",correct:1,wrong:1,blank:1},{id:"parity",correct:0,wrong:1,blank:0}]);
 assert.doesNotMatch(JSON.stringify(rows),/secret|question|answer/);
});
test("cumulative review counts distinct first completed papers and separates contests and grades",()=>{
 const first=record(2023,"2026-11-01"),second=record(2024,"2026-11-02");
 const repeated=record(2023,"2026-11-03",{domains:domains(5,20),concepts:[{id:"fraction",correct:1,wrong:0,blank:0}]});
 const rows=engine.groups([first,second,repeated,record(2025,"2026-11-17"),record(2026,"2026-11-04",{grade:8}),record(2025,"2026-11-04",{programId:"amc12"}),record(2025,"2026-11-05",{summary:{itemCount:25,correct:5,wrong:19,blank:0,unmarked:1}})],opts);
 const group=rows.find(x=>x.grade===9&&x.programId==="amc10");
 assert.equal(group.count,2);assert.equal(group.repeats,1);assert.equal(group.domains[0].correct,10);assert.equal(group.domains[0].state,"strength");
 assert.equal(group.recurring[0].reviewPapers,2);assert.equal(group.reasons.reading,2);assert.equal(rows.length,3);
});
test("a corrected concept on a new paper is no longer an active recurring weakness",()=>{
 const records=[record(2023,"2026-11-01"),record(2024,"2026-11-02"),record(2025,"2026-11-03",{concepts:[{id:"fraction",correct:1,wrong:0,blank:0}]})];
 const group=engine.groups(records,opts)[0];assert.equal(group.recurring.length,0);assert.equal(group.recovered[0].id,"fraction");
});
test("weighted domain totals and equally sized first/latest paper blocks preserve evidence",()=>{
 const group=engine.groups([record(2023,"2026-11-01",{domains:domains(1,1)}),record(2024,"2026-11-02",{domains:domains(5,4)}),record(2025,"2026-11-03",{domains:domains(5,0)})],opts)[0];
 assert.deepEqual([group.domains[0].correct,group.domains[0].total,group.domains[0].rate],[11,16,69]);
 assert.equal(group.domains[0].trend,null,"first block has fewer than three classified questions");
});
test("legacy records without concept counts still contribute domain results without invented concept evidence",()=>{
 const row=record(2023,"2026-11-01");delete row.concepts;delete row.paper;
 const group=engine.groups([row],opts)[0];assert.equal(group.count,1);assert.equal(group.conceptPaperCount,0);assert.equal(group.recurring.length,0);
});
