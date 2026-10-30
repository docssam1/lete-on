'use strict';
const assert=require('node:assert/strict'),memo=new Map();
function moves(p){const out=[];for(let i=0;i<3;i++)for(let x=i?p[i-1]+1:0;x<p[i];x++){const q=p.slice();q[i]=x;out.push({stone:i,shift:p[i]-x,next:q});}return out;}
function win(p){const k=p.join(',');if(!memo.has(k))memo.set(k,moves(p).some(m=>!win(m.next)));return memo.get(k);}
const start=[3,9,17],good=moves(start).filter(m=>!win(m.next));assert.deepEqual(good.map(m=>[m.stone,m.shift,m.next]),[[2,4,[3,9,13]]]);
// Independently verify the gap-pairing rule for every possible three-stone
// position up to the source's last occupied cell.
let states=0;for(let a=0;a<18;a++)for(let b=a+1;b<18;b++)for(let c=b+1;c<18;c++){const p=[a,b,c],balanced=a===c-b-1;assert.equal(!win(p),balanced);if(balanced)for(const move of moves(p))assert.ok(moves(move.next).some(reply=>reply.next[0]===reply.next[2]-reply.next[1]-1));states++;}
const row=require('./source-inventory/5-2-u3-e5-e8-readiness-review.json').items.find(x=>x.sourceItemId==='5-2-u3-e8-example-8-4');assert.equal(row.publicDecision,'locked');assert.match(row.independentAnswer,/4칸/);
console.log(`38쪽 예제 8-4: 원문 첫 수 ㄷ 4칸·${states}개 상태의 미니맥스와 빈칸 대응 검증`);
