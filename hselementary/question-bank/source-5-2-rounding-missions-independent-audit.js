'use strict';
const assert=require('node:assert/strict');
const source=require('./source-5-2-rounding-missions.js');
const down=(n,u)=>n-n%u,up=(n,u)=>down(n,u)+(n%u?u:0),nearest=(n,u)=>down(n,u)+(2*(n%u)>=u?u:0),fmt=n=>n.toLocaleString('en-US');
function permutations(xs){if(xs.length===0)return [[]];return xs.flatMap((x,i)=>permutations(xs.filter((_,j)=>i!==j)).map(rest=>[x,...rest]));}
let checked=0;
for(let i=0;i<source.ids.length;i++)for(let v=0;v<3;v++)for(const diff of [-1,0,1]){
 const q=source.getQuestion(source.ids[i],v,diff),m=q.questionModel,a=q.answerModel;assert.equal(q.publisherAnswerVerified,false);
 if(i===0){const expected=m.values.map(n=>m.units.map(u=>up(n,u)));assert.deepEqual(a.values,expected);const cells=[...q.answerVisual.matchAll(/<td>([\d,]+)<\/td>/g)].map(x=>Number(x[1].replaceAll(',','')));assert.deepEqual(cells,expected.flat());}
 if(i===1){assert.deepEqual(a.differences,m.values.map(n=>Math.abs(up(n,100)-nearest(n,1000))));}
 if(i===2){const list=permutations(m.digits).filter(xs=>xs[0]!==0).map(xs=>Number(xs.join('')));const min=Math.min(...list.map(n=>Math.abs(n-m.target)));const winners=list.filter(n=>Math.abs(n-m.target)===min);assert.deepEqual(winners,[a.selected]);assert.equal(a.rounded,nearest(winners[0],1000));}
 if(i===3){const digits=[];for(let n=0;n<=9;n++){const x=m.prefix*1000+n*100+m.suffix;if(down(x,1000)===nearest(x,1000))digits.push(n)}assert.deepEqual(a.digits,digits);}
 if(i===4){let count=0;for(let n=m.lower;n<=m.upper;n++)if(up(n,m.unit)===down(n,m.unit)&&down(n,m.unit)===nearest(n,m.unit))count++;assert.equal(a.count,count);}
 if(i===5){let count=0;for(let n=m.lower;n<=m.upper;n++)if(up(n,m.smallUnit)===nearest(n,m.smallUnit)&&up(n,m.largeUnit)!==nearest(n,m.largeUnit))count++;assert.equal(a.count,count);}
 assert.ok(q.solution.length>20);checked++;
}
assert.equal(checked,54);console.log('54 rounding Mission variants independently verified including rendered table cells and card permutations');
