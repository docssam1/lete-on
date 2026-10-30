'use strict';
const assert=require('node:assert/strict'),api=require('./source-5-2-u3-fold-fourths-area-synthetic.js');
function countByTracing(w,h){let upper=0,lower=0;for(let a=0;a<w;a++)for(let b=0;b<h;b++){let x=a+.5,y=b+.5;if(y<w){if(y<x)[x,y]=[y,x];if(x+y<w)[x,y]=[w-y,w-x];if(x>w/2)x=w-x;if(x>=3*w/8&&x<=w/2)upper++;}else{if(x>w/2)x=w-x;if(x>=3*w/8&&x<=w/2)lower++;}}return {upper,lower};}
assert.deepEqual(countByTracing(16,22),{upper:112,lower:24});
for(let i=0;i<3;i++){const m=api.model(i),t=countByTracing(m.w,m.h);assert.equal(t.upper,m.upper);assert.equal(t.lower,m.lower);assert.equal(t.upper+t.lower,m.answer);assert.equal(m.answer,[276,496,780][i]);for(const d of [-1,0,1]){const q=api.makeQuestion(i,d);assert.equal(q.answer,`${m.answer}cm²`);assert.match(q.prompt,/네 등분/);assert.doesNotMatch(q.prompt,new RegExp(`${m.answer}cm²`));assert.match(q.solution,/한 번만 접혀 2겹/);assert.match(q.answerVisual,/8겹/);}}
console.log('네 등분 접기 넓이 감사 통과: 원문과 세 변형, 독립 단위칸 추적·8겹/2겹·세 난이도');
