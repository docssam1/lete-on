'use strict';
const assert=require('node:assert/strict'),api=require('./source-5-2-u3-laser-corner-synthetic.js');
function unfolded(w,h){let L=1;while(L%w||L%h)L++;const times=[];for(let t=1;t<L;t++)if(t%w===0||t%h===0)times.push(t);times.push(L);const fold=(t,n)=>{const q=Math.floor(t/n),r=t%n;return q%2?n-r:r};return {length:L,points:[[0,0],...times.map(t=>[fold(t,w),fold(t,h)])],hits:times.length-1};}
const source=api.trace(12,10),sourceCheck=unfolded(12,10);assert.equal(source.hits,9);assert.equal(source.corner,'ㄹ');assert.deepEqual(source.points,sourceCheck.points);
for(let i=0;i<3;i++){const m=api.model(i),u=unfolded(m.w,m.h);assert.equal(u.length,m.length);assert.equal(u.hits,m.hits);assert.deepEqual(u.points,m.points);assert.deepEqual([m.hits,m.corner],[[6,'ㄷ'],[3,'ㄴ'],[3,'ㄹ']][i]);for(const d of [-1,0,1]){const q=api.makeQuestion(i,d);assert.equal(q.answer,`${m.hits}번, 코너 ${m.corner}`);assert.match(q.prompt,/마지막에 코너에 닿는 것은 반사 횟수에 넣지 않습니다/);assert.match(q.solution,/최소공배수/);assert.doesNotMatch(q.prompt,/data-laser-corner="solution"/);assert.match(q.answerVisual,/data-laser-corner="solution"/);}}
console.log('직사각형 거울 감사 통과: 원문·세 변형의 펼친 경로, 반사 횟수·종착 코너·세 난이도');
