'use strict';
const assert=require('node:assert/strict'),s=require('./source-5-2-u3-page29-mission6-synthetic.js');
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y), near=(a,b)=>assert.ok(Math.abs(a-b)<1e-5,`${a} != ${b}`);
const angle=(v,a,b)=>{const x={x:a.x-v.x,y:a.y-v.y},y={x:b.x-v.x,y:b.y-v.y};return Math.acos((x.x*y.x+x.y*y.y)/(Math.hypot(x.x,x.y)*Math.hypot(y.x,y.y)))*180/Math.PI};
const labels=['ㄱㅂㅁ','ㄱㅂㄴ','ㄹㅂㅁ'];
for(let i=0;i<3;i++)for(const d of [-1,0,1]) {
 const m=s.model(i,d),q=s.makeQuestion(i,d),{G,N,D,R,M,B}=m.points;
 near(dist(G,N),m.side);near(dist(N,D),m.side);near(dist(D,G),m.side);near(dist(N,R),m.offset);near(dist(D,M),m.offset);
 assert.ok(m.intersectionParameters.onGR>0&&m.intersectionParameters.onGR<1&&m.intersectionParameters.onNM>0&&m.intersectionParameters.onNM<1);
 const angles=[angle(B,G,M),angle(B,G,N),angle(B,R,M)], expected=[60,120,120];near(angles[i],expected[i]);assert.equal(q.answer,`${expected[i]}°`);
 assert.ok(q.prompt.includes(`∠${labels[i]}`));assert.doesNotMatch(q.prompt,/60°|120°|data-source-answer/);assert.match(q.answerVisual,new RegExp(`${expected[i]}°`));assert.notEqual(m.offset,5);assert.equal(q.publisherKeyVerified,false);
}
const id=s.definition.sourceItemId,key=s.definition.generatorKey,api={names:[],generatorKey:()=>'',generate:()=>null};s.install({HSE_GENERATORS:api});const item={id,sourceItemId:id,generatorKey:key,sourceVerified:true,reviewLocked:false};assert.equal(api.generate(item,0,0,0,1).answer,'120°');assert.equal(api.generate({...item,reviewLocked:true},0,0,0,1),null);
console.log('PASS 3 variants × 3 difficulty settings: equal lengths, intersections, acute/obtuse angles and locked gate');
