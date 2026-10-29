'use strict';
const assert=require('node:assert/strict');
const source=require('./source-5-2-range-missions.js');
let checked=0;
for(const definition of source.definitions)for(let v=0;v<3;v++)for(const difficulty of [-1,0,1]){
 const q=source.getQuestion(definition.sourceItemId,v,difficulty),m=q.questionModel,a=q.answerModel;
 assert.equal(q.publisherAnswerVerified,false);
 if(m.kind==='two-overlapping-ranges'){
  const A=[],B=[];for(let n=1;n<=Math.max(m.aUpperExclusive,m.bUpper);n++){
   if(n>=m.aLower&&n<m.aUpperExclusive)A.push(n);if(n>m.bLowerExclusive&&n<=m.bUpper)B.push(n);
  }
  const union=new Set([...A,...B]),overlap=A.filter(n=>B.includes(n)),sums=new Set(A.flatMap(x=>B.map(y=>x+y)));
  assert.equal(a.unionCount,union.size);assert.equal(a.overlapSum,overlap.reduce((x,y)=>x+y,0));
  assert.deepEqual([...sums].sort((x,y)=>x-y),Array.from({length:a.sumUpper-a.sumLower+1},(_,i)=>a.sumLower+i));
 }else if(m.kind==='missing-upper-multiple-count'){
  const feasible=[];for(let bound=m.lower+1;bound<=m.lower+m.divisor*(m.count+2);bound++){
   let count=0;for(let x=m.lower;x<bound;x++)if(x%m.divisor===0)count++;if(count===m.count)feasible.push(bound);
  }assert.deepEqual(a.values,feasible);
 }else if(m.kind==='two-digit-endpoint-pairs'){
  let count=0;const target=Array.from({length:m.targetUpper-m.targetLower+1},(_,i)=>m.targetLower+i).length;
  for(let x=10;x<=99;x++)for(let y=10;y<=99;y++){let n=0;for(let z=x+1;z<y;z++)n++;if(n===target)count++}assert.equal(a.value,count);
 }else if(m.kind==='distinct-digit-decimals'){
  const values=new Set();for(let i=0;i<m.digits.length;i++)for(let j=0;j<m.digits.length;j++)for(let k=0;k<m.digits.length;k++){
   if(i===j||i===k||j===k)continue;const x=100*m.digits[i]+10*m.digits[j]+m.digits[k];if(x>m.lowerHundredths&&x<=m.upperHundredths)values.add(x);
  }assert.equal(a.value,values.size);
 }else if(m.kind==='two-minimum-bus-counts'){
  const possible=[];for(let n=1;n<=Math.max(m.capacityA*m.busesA,m.capacityB*m.busesB);n++)if(Math.ceil(n/m.capacityA)===m.busesA&&Math.ceil(n/m.capacityB)===m.busesB)possible.push(n);
  assert.ok(possible.length);assert.deepEqual(possible,Array.from({length:a.upper-a.lower+1},(_,i)=>a.lower+i));
 }else if(m.kind==='bounded-box-count'){
  const possible=[];let sums=new Set([0]);for(let boxes=1;boxes<=Math.floor(m.total/m.minimum)+1;boxes++){
   const next=new Set();for(const x of sums)for(let y=m.minimum;y<=m.maximum;y++)if(x+y<=m.total)next.add(x+y);sums=next;if(sums.has(m.total))possible.push(boxes);
  }assert.ok(possible.length);assert.deepEqual(possible,Array.from({length:a.upper-a.lower+1},(_,i)=>a.lower+i));
 }else throw new Error(`Unexpected kind ${m.kind}`);
 checked++;
}
assert.equal(checked,54);console.log(`5-2 first unit p.5: independently enumerated ${checked} synthetic cases`);
