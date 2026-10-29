const assert=require('node:assert/strict');
const m=require('./source-5-2-u3-page25-mission4-synthetic.js');
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-7,`${a} != ${b}`);
for(let i=0;i<3;i++){
 const p=m.derive(i), {A,B,C,D,X}=p;
 [dist(A,B),dist(B,C),dist(C,D),dist(D,A),dist(A,X),dist(B,X)].forEach(x=>near(x,120));
 const angle=Math.acos(((B.x-A.x)*(D.x-A.x)+(B.y-A.y)*(D.y-A.y))/(dist(A,B)*dist(A,D)))*180/Math.PI;near(angle,p.angle);
 if(p.angle===120){near((X.x-A.x)*(D.y-A.y)-(X.y-A.y)*(D.x-A.x),0);assert.ok((X.x-A.x)*(D.x-A.x)+(X.y-A.y)*(D.y-A.y)<0);}
 else {near(dist(X,D),0)}
 for(const difficulty of [-1,0,1]){const q=m.build(i,difficulty);assert.match(q.solution,new RegExp(`${p.angle}°`));assert.match(q.answerVisual,/u3m4-answer/);assert.doesNotMatch(q.prompt,/<svg/);assert.equal((q.answerVisual.match(/stroke-dasharray="4 3"/g)||[]).length>=5,true)}
}
console.log('PASS 3 configurations × 3 levels: equilateral construction, angle, 4 sides, figures');
