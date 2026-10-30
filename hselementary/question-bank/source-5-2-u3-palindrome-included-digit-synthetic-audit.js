'use strict';
const assert=require('node:assert/strict'),api=require('./source-5-2-u3-palindrome-included-digit-synthetic.js');
function generate(lo,hi,d){const out=[];for(let a=1;a<=9;a++)for(let b=0;b<=9;b++){const nums=[101*a+10*b,1001*a+110*b];for(const n of nums)if(n>=lo&&n<=hi&&(a===d||b===d))out.push(n)}return out;}
const original=generate(100,10000,1);assert.equal(original.length,36);assert.equal(original.filter(n=>n<1000).length,18);assert.equal(original.filter(n=>n>=1000).length,18);assert.ok(!original.includes(10000));
for(let i=0;i<3;i++){const m=api.model(i),nums=generate(m.lo,m.hi,m.digit);assert.equal(new Set(nums).size,nums.length);assert.equal(nums.length,[18,9,36][i]);assert.equal(nums.length,m.answer);for(const d of [-1,0,1]){const q=api.makeQuestion(i,d);assert.equal(q.answer,`${m.answer}개`);assert.match(q.prompt,/적어도 하나/);assert.match(q.prompt,/양 끝의 수도 포함/);assert.match(q.solution,/0/);assert.equal(q.answerVisualRequired,false);}}
console.log('대칭수 포함 숫자 감사 통과: 원문 자리수·경계와 창작 세 범위·세 난이도 독립 조합');
