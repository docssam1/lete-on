'use strict';
const assert=require('node:assert/strict'),api=require('./source-5-2-u3-composite-half-synthetic.js');
const source=require('./source-inventory/5-2-source-items.json').sourceItems.find(x=>x.sourceItemId==='5-2-u3-e8-mission-2');assert.equal(source.implementationStatus,'review-locked');
function area(p){return Math.abs(p.reduce((z,a,i)=>{const b=p[(i+1)%p.length];return z+a[0]*b[1]-a[1]*b[0]},0))/2}
function clip(poly,a,b){const cross=p=>(b[0]-a[0])*(p[1]-a[1])-(b[1]-a[1])*(p[0]-a[0]),out=[];for(let i=0;i<poly.length;i++){const p=poly[i],q=poly[(i+1)%poly.length],u=cross(p),v=cross(q);if(u>=0)out.push(p);if((u<0&&v>0)||(u>0&&v<0)){const t=u/(u-v);out.push([p[0]+t*(q[0]-p[0]),p[1]+t*(q[1]-p[1])]);}}return out}
for(let i=0;i<3;i++)for(const d of [-1,0,1]){const q=api.makeQuestion(i,d),g=api.geometry(q.questionModel);for(const p of [g.rectangle,g.parallelogram])assert.ok(Math.abs(2*area(clip(p,...g.ends))-area(p))<1e-9);assert.equal(q.automaticGrading,false);assert.ok(!q.prompt.includes('data-half-answer'));assert.ok(q.answerVisual.includes('data-half-answer'));assert.equal(q.publisherKeyVerified,false);}
console.log('Three synthetic shapes × three difficulties: independent polygon clipping verifies both halves; source locked.');
