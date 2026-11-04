'use strict';
const assert = require('node:assert/strict');
// The source specifies isosceles triangles and four equal intervals on each base,
// but neither their height nor the scale between the two tiers.
function count(h,q){
 const triangles=[];
 for(const scale of [1,q]) for(let a=-2;a<=2;a++) for(let b=a+1;b<=2;b++){
  const s=scale*scale, sides=[s*(h*h+a*a),s*(h*h+b*b),s*(b-a)**2].sort((x,y)=>x-y);
  triangles.push({scale,a,b,sides});
 }
 let total=0,crossTier=0;
 for(let i=0;i<triangles.length;i++)for(let j=i+1;j<triangles.length;j++){
  const x=triangles[i],y=triangles[j];
  if(x.sides.every((v,k)=>Math.abs(v-y.sides[k])<1e-9)){total++;if(x.scale!==y.scale)crossTier++;}
 }
 return {total,crossTier};
}
assert.deepEqual(count(3,2),{total:8,crossTier:0});
assert.deepEqual(count(2,Math.sqrt(2)),{total:10,crossTier:2});
console.log('Source ambiguity: 8 or 10 congruent pairs under the stated geometric conditions');
