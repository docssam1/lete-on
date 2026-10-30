'use strict';
const assert=require('node:assert/strict'),api=require('./source-5-2-u3-fold-rectangle-area-synthetic.js');
// Trace each unit cell through the three folds; the final cut falls on integer grid lines.
function countByTracing(w,h){let upper=0,lower=0;for(let a=0;a<w;a++)for(let b=0;b<h;b++){let x=a+.5,y=b+.5;if(y<w){if(y<x)[x,y]=[y,x];if(x+y<w)[x,y]=[w-y,w-x];if(x>w/2)x=w-x;if(x>=w/3&&x<=w/2)upper++;}else{if(x>w/2)x=w-x;if(x>=w/3&&x<=w/2)lower++;}}return {upper,lower};}
assert.deepEqual(countByTracing(12,16),{upper:80,lower:16});
for(let i=0;i<3;i++){const m=api.model(i),traced=countByTracing(m.w,m.h);assert.equal(traced.upper,m.upper);assert.equal(traced.lower,m.lower);assert.equal(traced.upper+traced.lower,m.answer);assert.equal(m.answer,[204,368,580][i]);for(const d of [-1,0,1]){const q=api.makeQuestion(i,d);assert.equal(q.answer,`${m.answer}cm²`);assert.match(q.prompt,/세 등분/);assert.doesNotMatch(q.prompt,new RegExp(`${m.answer}cm²`));assert.match(q.answerVisual,/8겹/);assert.match(q.answerVisual,/2겹/);assert.match(q.solution,/한 번만 접혀 2겹/);}}
console.log('직사각형 접기 넓이 감사 통과: 원문과 세 변형, 독립 단위칸 접기 추적·8겹/2겹·세 난이도');
