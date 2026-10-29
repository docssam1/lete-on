'use strict';
const assert=require('node:assert/strict');
const source=require('./source-5-2-u3-page29-mission4-synthetic.js');
const sub=(a,b)=>({x:a.x-b.x,y:a.y-b.y});
const dot=(a,b)=>a.x*b.x+a.y*b.y;
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const reflect=(p,a,b)=>{const v=sub(b,a),t=dot(sub(p,a),v)/dot(v,v);return {x:2*(a.x+t*v.x)-p.x,y:2*(a.y+t*v.y)-p.y};};
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-6,`${a} != ${b}`);
for(let i=0;i<source.pools.length;i++) for(const difficulty of [-1,0,1]) {
 const [alpha,beta]=source.pools[i],shape=source.model(alpha,beta),p=shape.points,q=source.makeQuestion(i,difficulty);
 close(dist(reflect(p.R,p.B,p.D),p.M),0);
 close(dist(reflect(p.M,p.S,p.O),p.J),0);
 close(shape.angles.bjs,beta); close(shape.angles.odn,90-2*alpha);
 close(shape.angles.sjo,90); close(shape.answer,(90+alpha-beta)/2);
 for(const t of Object.values(shape.parameters)) assert.ok(t>0 && t<1);
 assert.equal(q.answer,`${shape.answer}°`);
 assert.doesNotMatch(q.prompt,/data-answer-angle|data-source-answer/);
 assert.match(q.answerVisual,new RegExp(`data-answer-angle="${shape.answer}"`));
 assert.notEqual(beta,32);assert.notEqual(90-2*alpha,46);
 assert.equal(q.publisherKeyVerified,false);assert.equal(q.handwrittenAnswerVerified,false);
}
const id=source.definition.sourceItemId,key=source.definition.generatorKey;
const api={names:[],generatorKey:()=>'',generate:()=>null};source.install({HSE_GENERATORS:api});
const item={id,sourceItemId:id,generatorKey:key,sourceVerified:true,reviewLocked:false};
assert.equal(api.generate(item,0,0,0,1).answer,'39°');
assert.equal(api.generate({...item,reviewLocked:true},0,0,0,1),null);
console.log('PASS 3 variants × 3 difficulty settings: two reflections, angles, interior positions, answer separation and locked gate');
