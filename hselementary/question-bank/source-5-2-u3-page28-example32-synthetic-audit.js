'use strict';
const assert = require('node:assert/strict');
const m = require('./source-5-2-u3-page28-example32-synthetic.js');
const dist2=(a,b)=>(a.x-b.x)**2+(a.y-b.y)**2;
const dot=(a,b,c)=>(b.x-a.x)*(c.x-a.x)+(b.y-a.y)*(c.y-a.y);
for (let i=0;i<m.pools.length;i++) {
 const side=m.pools[i], shape=m.model(side), p=shape.points, tol=0.0001;
 for(const [a,b] of [[p.A,p.B],[p.B,p.C],[p.C,p.D],[p.D,p.A],[p.D,p.T],[p.T,p.E],[p.E,p.F],[p.F,p.D],[p.T,p.C]]) assert.ok(Math.abs(dist2(a,b)-side**2)<tol);
 for(const [a,b,c] of [[p.A,p.B,p.D],[p.T,p.D,p.E],[p.E,p.T,p.F]]) assert.ok(Math.abs(dot(a,b,c))<tol);
 assert.ok(Math.abs(dot(p.D,p.T,p.C)-side**2/2)<tol);
 for(let d=-1;d<=1;d++){const q=m.makeQuestion(i,d);assert.equal(q.answer,`${side}cm`);assert.match(q.solution,/정삼각형/);assert.match(q.prompt,/60°/);assert.doesNotMatch(q.prompt,/정답/);assert.equal(q.verifiedPoolIndex,i);assert.equal(q.publisherKeyVerified,false);assert.ok(![12].includes(side));}
}
console.log('PASS 3 × 3: independent squared distances, perpendicularity, equilateral triangle');
