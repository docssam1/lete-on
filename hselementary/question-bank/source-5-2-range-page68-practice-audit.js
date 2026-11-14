'use strict';
const assert = require('node:assert/strict');
const api = require('./source-5-2-range-page68-practice.js');
// The original first three problems require students to mark the number line.
// Check the teacher's endpoints independently against the source and keep
// those marks out of the student question.
for (const [n, answer, coordinates, fills] of [
  [1, '16 초과 20 이하', [16,20], ['white','#191511']],
  [2, '29, 30, 31, 32', [28,33], ['white','white']],
  [3, '40kg 미만 또는 90kg 이상', [40,90], ['white','#191511']]
]) {
  const q = api.build(n);
  assert.equal(q.answer, answer);
  assert.equal(q.automaticGrading, false);
  assert.doesNotMatch(q.prompt, /data-answer-marks/);
  assert.match(q.answerVisual, new RegExp(`data-answer-marks="${n}"`));
  const circles = [...q.answerVisual.matchAll(/<circle cx="([\d.]+)" cy="32" r="4\.5" fill="([^"]+)"/g)];
  assert.equal(circles.length, 2);
  const ticks = new Map([...q.answerVisual.matchAll(/<text x="([\d.]+)" y="57"[^>]*>(\d+)<\/text>/g)].map(m => [Number(m[2]), Number(m[1])]));
  circles.forEach((circle, i) => { assert(Math.abs(Number(circle[1]) - ticks.get(coordinates[i])) < 1e-7); assert.equal(circle[2], fills[i]); });
}
// Natural numbers in the intersection: 28 < x <= 35 and 26 <= x < 33.
assert.deepEqual(Array.from({length:50},(_,i)=>i+1).filter(x=>x>28&&x<=35&&x>=26&&x<33),[29,30,31,32]);
for (const [weight, canRide] of [[39.9,false],[40,true],[89.9,true],[90,false]]) {
  assert.equal(weight >= 40 && weight < 90, canRide);
}
const numbers = (start,end) => Array.from({length:end-start+1},(_,i)=>i+start);
const a=numbers(1,100).filter(x=>numbers(1,100).filter(v=>v>25&&v<=x).length===20);
const b=numbers(1,29).filter(x=>numbers(1,100).filter(v=>v>=x&&v<30).length===22);
assert.deepEqual(a,[45]);assert.deepEqual(b,[8]);assert.equal(api.build(4).answer,String(a[0]+b[0]));
const pairs=[];for(let x=10;x<=99;x++)for(let y=10;y<=99;y++)if(numbers(1,99).filter(v=>v>x&&v<y).length===42)pairs.push([x,y]);
assert.equal(Math.max(...pairs.map(p=>p[0])),56);assert(pairs.some(([x,y])=>x===56&&y===99));assert.equal(api.build(6).answer,'56');
for(const [v,expected] of [[59.9,false],[60,true],[110,true],[110.1,false]]) assert.equal(!(v<60||v>110),expected);
for(const [needed,remaining] of [[4.01,.99],[4.5,.5],[5,0]])assert(Math.abs((5-needed)-remaining)<1e-9);
assert.equal(api.build(5).automaticGrading,false);assert.equal(api.build(7).automaticGrading,false);
console.log('PASS: original practice 1–7 independent enumeration, number-line endpoints and solution marks');
