'use strict';
const assert=require('node:assert/strict');
const api=require('./source-5-2-u3-page28-exploration-synthetic.js');
const inventory=require('./source-inventory/5-2-source-items.json');
const original=inventory.sourceItems.find(x=>x.syntheticRuntimeTypeId===api.sourceItemId);
assert.ok(original && original.implementationStatus==='review-locked');
const sub=(a,b)=>({x:a.x-b.x,y:a.y-b.y}),dot=(a,b)=>a.x*b.x+a.y*b.y,cross=(a,b)=>a.x*b.y-a.y*b.x,norm=a=>Math.hypot(a.x,a.y),near=(a,b)=>assert.ok(Math.abs(a-b)<1e-7,`${a} != ${b}`),angle=(a,v,b)=>{const u=sub(a,v),w=sub(b,v);return 180/Math.PI*Math.acos(Math.max(-1,Math.min(1,dot(u,w)/norm(u)/norm(w))))};
for(let i=0;i<api.variants.length;i++){
 const v=api.variants[i],p=api.points(v),q=api.makeQuestion(i),{G,N,D,R,M,B}=p;
 near(norm(sub(G,N)),norm(sub(G,D)));near(norm(sub(R,M)),norm(sub(R,D)));
 near(norm(sub(G,N)),norm(sub(R,M)));near(norm(sub(G,D)),norm(sub(R,D)));near(norm(sub(N,D)),norm(sub(M,D)));
 near(cross(sub(B,G),sub(D,G)),0);near(cross(sub(B,R),sub(M,R)),0);
 assert.ok(dot(sub(B,G),sub(B,D))<0 && dot(sub(B,R),sub(B,M))<0);
 near(angle(G,N,D),v.a);near(angle(M,B,D),180-2*v.a+v.t);near(angle(D,G,R),90-v.t/2);
 assert.equal(q.answer,`${90-v.t/2}°`);assert.equal(q.publisherAnswerVerified,false);
 assert.ok(q.prompt.includes('대응점은')&&q.prompt.includes('ㄱㄴ=ㄱㄷ'));
}
console.log('세 창작 문항의 합동·이등변·교점·각도 및 원문 잠금 검증 통과');
