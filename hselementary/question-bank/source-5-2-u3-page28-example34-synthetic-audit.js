'use strict';
const assert=require('node:assert/strict');
const api=require('./source-5-2-u3-page28-example34-synthetic.js');
const inventory=require('./source-inventory/5-2-source-items.json');
const original=inventory.sourceItems.find(x=>x.syntheticRuntimeTypeId===api.sourceItemId);
assert.ok(original && original.implementationStatus==='review-locked');
const sub=(a,b)=>({x:a.x-b.x,y:a.y-b.y}),dot=(a,b)=>a.x*b.x+a.y*b.y,cross=(a,b)=>a.x*b.y-a.y*b.x,norm=a=>Math.hypot(a.x,a.y),near=(a,b)=>assert.ok(Math.abs(a-b)<1e-7,`${a} != ${b}`),angle=(a,v,b)=>{const u=sub(a,v),w=sub(b,v);return 180/Math.PI*Math.acos(Math.max(-1,Math.min(1,dot(u,w)/norm(u)/norm(w))))};
for(let i=0;i<api.angles.length;i++){
 const theta=api.angles[i],p=api.points(theta),q=api.makeQuestion(i),{G,N,D,R,M,B,S,O}=p;
 near(dot(sub(N,G),sub(R,G)),0); near(cross(sub(R,G),sub(D,N)),0);
 near(norm(sub(G,R)),norm(sub(G,M))); near(norm(sub(D,R)),norm(sub(D,M)));
 near(M.x,B.x);near(M.y,-B.y);near(cross(sub(S,G),sub(M,G)),0);near(S.y,0);
 assert.ok(S.x>0 && S.x<D.x);near(cross(sub(O,G),sub(D,G)),0);near(cross(sub(O,S),sub(B,S)),0);
 assert.ok(dot(sub(O,G),sub(O,D))<0 && dot(sub(O,S),sub(O,B))<0);
 near(angle(R,G,D),theta);near(angle(B,O,D),3*theta);
 assert.equal(q.answer,`${3*theta}°`);assert.ok(q.prompt.includes('선분 ㄱㄷ을 접는 선')&&q.prompt.includes('선분 ㄴㄷ을 접는 선'));
 assert.ok(q.answerVisual.includes(`${3*theta}°`));assert.equal(q.publisherAnswerVerified,false);
}
console.log('세 창작 접기 문항의 대칭·교점·목표각·원문 잠금 검증 통과');
