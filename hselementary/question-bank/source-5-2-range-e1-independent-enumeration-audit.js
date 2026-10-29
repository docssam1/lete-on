'use strict';
// Enumerate feasible values from the generated question model, independently of its answer formula.
const assert=require('node:assert/strict');
const source=require('./source-5-2-range-e1.js');
let checked=0;
for(const definition of source.definitions) for(let v=0;v<3;v++) for(const difficulty of [-1,0,1]) {
 const q=source.getQuestion(definition.sourceItemId,v,difficulty),m=q.questionModel,a=q.answerModel;
 assert.equal(q.publisherAnswerVerified,false);
 if(m.kind==='continuous-range') {
  assert.equal(a.lower,m.lower);assert.equal(a.upper,m.upper);assert.equal(a.lowerIncluded,false);assert.equal(a.upperIncluded,true);
  assert.match(q.answerVisual,/data-role="lower-endpoint"/);assert.match(q.answerVisual,/data-role="upper-endpoint"/);
  assert.ok(q.solution.includes('소수도 포함'));
 } else if(m.kind==='maximum-lower-endpoint') {
  const possible=[];
  for(let x=100;x<=999;x++) for(let y=x+1;y<=999;y++) if(y-x+1===m.count)possible.push(x);
  assert.ok(possible.length);assert.equal(a.value,Math.max(...possible));assert.equal(q.answer,String(a.value));
 } else if(m.kind==='minimum-seat-intersection') {
  const feasible=[];for(let n=1;n<=Math.max(m.capacityA*m.seatsA,m.capacityB*m.seatsB);n++)
   if(Math.ceil(n/m.capacityA)===m.seatsA && Math.ceil(n/m.capacityB)===m.seatsB)feasible.push(n);
  assert.ok(feasible.length);assert.deepEqual(feasible,Array.from({length:a.upper-a.lower+1},(_,i)=>a.lower+i));
 } else if(m.kind==='two-group-overlap') {
  const feasible=[];for(let both=0;both<=m.total;both++) {
   const hatOnly=m.hats-both,glassesOnly=m.sunglasses-both,neither=m.total-both-hatOnly-glassesOnly;
   if(hatOnly>=0&&glassesOnly>=0&&neither>=0)feasible.push(both);
  }
  assert.ok(feasible.length);assert.deepEqual(feasible,Array.from({length:a.upper-a.lower+1},(_,i)=>a.lower+i));
 } else if(m.kind==='bounded-box-allocation') {
  const feasible=[];let sums=new Set([0]);
  for(let boxes=1;boxes<=Math.floor(m.total/m.minimum)+1;boxes++) {
   const next=new Set();for(const sum of sums)for(let n=m.minimum;n<m.upperExclusive;n++)if(sum+n<=m.total)next.add(sum+n);
   sums=next;if(sums.has(m.total))feasible.push(boxes);
  }
  assert.ok(feasible.length);assert.deepEqual(feasible,Array.from({length:a.upper-a.lower+1},(_,i)=>a.lower+i));
 } else throw new Error(`Unexpected kind: ${m.kind}`);
 checked++;
}
assert.equal(checked,45);
console.log(`5-2 first unit p.4: independently checked ${checked} generated cases, including exhaustive integer allocations and boundaries`);
