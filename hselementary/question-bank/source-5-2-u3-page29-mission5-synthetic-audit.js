'use strict';
const assert=require('node:assert/strict'),s=require('./source-5-2-u3-page29-mission5-synthetic.js');
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y), cross=(a,b,c)=>(b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x), near=(a,b)=>assert.ok(Math.abs(a-b)<1e-5,`${a} != ${b}`);
const angles=['ㅁㅂㄹ','ㅂㅁㄹ','ㅁㄹㅂ'];
for(let i=0;i<3;i++)for(const d of [-1,0,1]){
 const m=s.model(i,d),q=s.makeQuestion(i,d),{G,N,D,M,P,R}=m.points;
 near(dist(G,N),m.side);near(dist(N,D),m.side);near(dist(D,G),m.side);
 near(dist(G,M),m.offset);near(dist(N,P),m.offset);near(dist(D,R),m.offset);
 near(cross(G,N,M),0);near(cross(N,D,P),0);near(cross(D,G,R),0);
 near(dist(M,P),dist(P,R));near(dist(P,R),dist(R,M));for(const a of Object.values(m.angles))near(a,60);
 assert.equal(q.answer,'60°');assert.ok(q.prompt.includes(`∠${angles[i]}`));
 assert.doesNotMatch(q.prompt,/60°|안쪽 정삼각형|data-source-answer/);
 assert.match(q.answerVisual,/60°/);assert.equal(q.publisherKeyVerified,false);
}
const id=s.definition.sourceItemId,key=s.definition.generatorKey,api={names:[],generatorKey:()=>'',generate:()=>null};
s.install({HSE_GENERATORS:api});const item={id,sourceItemId:id,generatorKey:key,sourceVerified:true,reviewLocked:false};
assert.equal(api.generate(item,0,0,0,2).answer,'60°');assert.equal(api.generate({...item,reviewLocked:true},0,0,0,2),null);
console.log('PASS 3 variants × 3 difficulty settings: equal offset, segment placement, congruence, answer separation and locked gate');
