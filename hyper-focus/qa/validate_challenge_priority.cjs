const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {entries}=require('../challenge/exam-priority.js'),{solve}=require('./challenge-priority-solvers.cjs');
const groups=entries(),result=[];
for(const [section,rounds] of Object.entries(groups))for(const [round,items] of Object.entries(rounds))for(const q of Object.values(items)){
  assert.deepEqual(solve(q.payload),q.answer);assert(q.solution.length>50);
  const poisoned={...q.payload,answer:-999,expected:[]};assert.deepEqual(solve(poisoned),q.answer,'solver must not read saved answers');
  assert(q.problemHtml.includes('<img')&&!q.problemHtml.includes('<svg'));
  const files=[...q.problemHtml.matchAll(/src="([^"]+)"/g),...q.solutionDiagram.matchAll(/src="([^"]+)"/g)];
  for(const [,name] of files){const bytes=fs.readFileSync(path.resolve(__dirname,'../challenge',name));assert(bytes.readUInt32BE(16)>=720);}
  result.push({round:Number(round),section,number:q.number,type:q.typeId,answer:q.answer});
}
const route=groups.main[2][12].payload;
assert(solve({...route,blocked:[]})>solve(route),'blocked road must change the answer');
assert(solve({...route,via:[3,2]})>solve(route),'waypoint must change the answer');
const length=groups.main[1][14].payload;
assert.notDeepEqual(solve({...length,topLeft:2}),solve(length),'upper row clip count must matter');
assert.notDeepEqual(solve({...length,bottomRight:2}),solve(length),'lower row clip count must matter');
assert.equal(typeof groups.main[1][14].answer,'number');
assert(!/\(1\)|\(2\)|나사/.test(groups.main[1][14].prompt),'single question only');
assert(!JSON.stringify(length).includes('eraser'),'unrequested multi-stage eraser conversion removed');
const d=groups.main[2][18].payload;
const extents=d.paths.map(points=>Math.max(...points.map(p=>p[0]))-Math.min(...points.map(p=>p[0])));
assert(extents[1]>extents[2],'longest horizontal span should not reveal longest path');
const masks=groups.extra[1][2].payload.options.map(x=>[...x].sort((a,b)=>a-b).join(','));assert.equal(new Set(masks).size,4);
require('../challenge/challenge-bank.js');
for(const round of [1,2]){
  const current=globalThis.HFChallengeBank.createMockExam(round,62001).questions;
  assert.deepEqual(current.map(q=>q.number),Array.from({length:20},(_,i)=>i+1));
  assert.equal(new Set(current.map(q=>q.sourceNumber)).size,20);
  assert.equal(current.find(q=>q.sourceNumber===1).number,round===1?10:15);
  assert.equal(current[0].typeId,round===1?'replace-count-constraints':'r2-fruit-equations');
  assert.equal(current.find(q=>q.sourceNumber===13).number,13,'previous explicit Q13 requirement keeps its number');
}
const report={passed:true,replacementCount:result.length,items:result,tests:['independent numeric solvers','poisoned answer fields','operative waypoint and blockage','operative unit and quantity premises','path span not equal to length rank','distinct top-view distractors','raster assets present']};
fs.writeFileSync(path.resolve(__dirname,'../output/qa/challenge-editions-separated/priority-report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
