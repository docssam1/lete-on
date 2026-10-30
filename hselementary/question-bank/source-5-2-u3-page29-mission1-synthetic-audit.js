'use strict';
const assert=require('node:assert/strict'),s=require('./source-5-2-u3-page29-mission1-synthetic.js');
for(let i=0;i<s.pools.length;i++)for(const d of [-1,0,1]){
 const m=s.model(i,d),q=s.makeQuestion(i,d),e=0.02;
 for(const [a,b] of [['GN','GD'],['GN','RN'],['GD','RM'],['RN','RM'],['ND','NM']])assert.ok(Math.abs(m.sideLengths[a]-m.sideLengths[b])<e);
 assert.ok(Math.abs(m.angles.baseAtD-m.base)<e);assert.ok(Math.abs(m.angles.crossingAtS-m.crossing)<e);assert.ok(Math.abs(m.angles.targetAtR-m.answer)<e);assert.equal(m.answer,m.base-m.crossing/2);
 for(const x of Object.values(m.intersections))assert.ok(x>0&&x<1);
 for(const n of [m.base,m.crossing]) {assert.notEqual(n,66);assert.notEqual(n,72);}assert.equal(q.answer,`${m.answer}°`);assert.doesNotMatch(q.prompt,/정답/);assert.match(q.prompt,/ㄱㄴ=ㄱㄷ이고 ㄹㄴ=ㄹㅁ/);
 const paths=Array.from(q.prompt.matchAll(/class="source52-p29m1-angle" d="[^"]* A[\d.]+ [\d.]+ 0 0 ([01]) /g));assert.equal(paths.length,2);assert.deepEqual(paths.map(x=>x[1]),['1','1']);
}
console.log('PASS 3 × 3: congruence, segment intersections, angles and SVG arc direction');
