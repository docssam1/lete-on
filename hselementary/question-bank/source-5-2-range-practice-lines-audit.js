'use strict';
const assert=require('node:assert/strict'),api=require('./source-5-2-range-page68-practice.js');
const common=Array.from({length:101},(_,n)=>n).filter(n=>n>28&&n<=35&&n>=26&&n<33);
assert.deepEqual(common,[29,30,31,32]);
for(const [x,expected] of [[16,false],[16.1,true],[20,true],[20.1,false]])assert.equal(x>16&&x<=20,expected);
for(const [x,expected] of [[39.9,true],[40,false],[89.9,false],[90,true]])assert.equal(!(x>=40&&x<90),expected);
const counts=Array.from({length:40},(_,n)=>n).filter(n=>150+200*n>=5000);assert.equal(Math.min(...counts),25);
for(const n of [1,2,3]){const q=api.build(n);assert(q.answerVisual.includes(`data-answer-marks="${n}"`));assert(!q.prompt.includes('data-answer-marks'));assert.equal(q.automaticGrading,false)}
assert.equal(api.build(9).answer,'25개');console.log('PASS: ranges, endpoint inclusions, number line separation, apple count');
