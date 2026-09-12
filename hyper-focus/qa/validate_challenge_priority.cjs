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
  if(round===1){
    const balance=current[2],payload=balance.payload,query=payload.equations.find(equation=>equation.query);
    const weight=items=>items.reduce((total,item)=>total+payload.values[item.key]*item.count,0);
    payload.equations.forEach(equation=>assert.equal(weight(equation.left),weight(equation.right),'1회 3번의 각 저울은 평형'));
    assert.equal(balance.answer,4,'1회 3번의 보이는 보라색 도형 1개는 하트 4개');
    assert.equal(weight(query.left)/payload.values.H,4,'1회 3번 그림을 하트 1 기준으로 독립 계산');
    assert.deepEqual(query.left,[{key:'T',kind:'circle',color:'#8b78b5',count:1}],'1회 3번 마지막 왼쪽 접시에는 보라색 도형 1개만 표시');
    assert.deepEqual(query.right,[{key:'H',kind:'heart',color:'#e3c989',count:4}],'1회 3번 마지막 오른쪽 접시 정답은 하트 4개');
    assert.match(balance.solution,/^가장 가벼운 도형인 하트에 1을 써 봅시다\./,'1회 3번 풀이를 가장 가벼운 도형 1에서 시작');
    assert.equal((balance.problemHtml.match(/data-balance-key="C"/g)||[]).length,1,'연한 동그라미는 첫 번째 관계에만 표시');
    assert.equal((balance.problemHtml.match(/data-balance-key="T"/g)||[]).length,2,'보라색 동그라미는 세 번째 관계와 마지막 접시에 표시');
  }
}
const report={passed:true,replacementCount:result.length,items:result,tests:['independent numeric solvers','poisoned answer fields','operative waypoint and blockage','operative unit and quantity premises','path span not equal to length rank','distinct top-view distractors','raster assets present']};
fs.writeFileSync(path.resolve(__dirname,'../output/qa/challenge-editions-separated/priority-report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
