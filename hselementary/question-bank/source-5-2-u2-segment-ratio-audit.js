'use strict';
const assert = require('node:assert/strict');
const api = require('./source-5-2-u2-linked-practice.js');
const q = api.rows.find(row => row.id === '5-2-u2-practice-59-segment-similar');
for (const [i,[a,b,c,ad,ce]] of [[3,4,5,72,70],[2,3,4,63,60],[4,5,6,60,48],[3,5,8,80,75]].entries()) {
  const out=api.build(q,i), scale=ad/(a+b+c), ab=a*scale, bc=b*scale, cd=c*scale, de=ce-cd;
  assert(de>0);
  assert.equal(out.answer,`${ab+bc+ce}cm`);
  const x=[...out.prompt.matchAll(/<text x="([\d.]+)" y="51">[가나다라마]<\/text>/g)].map(m=>+m[1]);
  assert.equal(x.length,5);
  const lengths=[ab,bc,cd,de], factor=(x[4]-x[0])/(ab+bc+cd+de);
  lengths.forEach((length,j)=>assert(Math.abs((x[j+1]-x[j])-length*factor)<0.03,`variant ${i}, segment ${j} proportion`));
}
console.log('PASS: four segment diagrams and answers match independent distance calculations');
