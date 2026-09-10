const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const more=require('../challenge/exam-more.js'),{solve,pathsFor,tileSolutions,roll}=require('./challenge-more-solvers.cjs');
const result=[];let failed=false;
for(const r of [3,4])for(const section of ['main','extra'])for(const q of more.get(r,section).questions){try{
 assert.deepEqual(solve(q.payload),q.answer);
 assert.deepEqual(solve({...q.payload,answer:'wrong',expected:-123}),q.answer);
 assert(q.solution.length>25&&!/확인해야|TODO/.test(q.solution));
 if(['links','walk'].includes(q.payload.kind))assert.deepEqual(pathsFor(q.payload)[0],q.visual.answer);
 if(q.visual&&process.env.CHECK_MORE_IMAGES==='1'){const file=path.resolve(__dirname,'../challenge/assets/more',q.id+'.png');assert(fs.readFileSync(file).readUInt32BE(16)>=1440);}
 result.push({round:r,section,number:q.number,kind:q.payload.kind,answer:q.answer});
 }catch(e){failed=true;console.error(q.id,e.message);}}
require('../challenge/challenge-bank.js');const extra=require('../challenge/exam-supplement.js');
for(const r of [1,2,3,4]){assert.equal(globalThis.HFChallengeBank.createMockExam(r,62001).questions.length,20);assert.equal(extra.get(r).questions.length,6);}
for(const r of [3,4]){const qs=more.get(r).questions;for(const domain of ['수','지문이해','도형','논리추리'])assert.equal(qs.filter(q=>q.domain===domain).length,5);assert.equal(new Set(qs.map(q=>q.prompt)).size,20);}
function question(round,section,number){
 const q=more.get(round,section).questions[number-1];
 assert(q&&q.number===number,`${round}회 ${section} ${number}번을 찾을 수 없음`);
 return q;
}
function assertThreeShapeLinks(q){
 const p=q.payload,labels=q.visual&&q.visual.labels;
 assert.equal(p.kind,'links');
 assert.equal(p.pairs.length,3,`${q.id}: 도형 쌍은 3개여야 함`);
 const endpoints=p.pairs.flat();
 assert.equal(new Set(endpoints).size,6,`${q.id}: 6개 끝점은 모두 달라야 함`);
 assert(endpoints.every(n=>Number.isInteger(n)&&n>=0&&n<p.w*p.h),`${q.id}: 끝점이 모눈 밖에 있음`);
 const symbols=p.pairs.map(([a,b])=>{
  assert.equal(labels[String(a)],labels[String(b)],`${q.id}: 같은 도형끼리의 쌍이 아님`);
  return labels[String(a)];
 });
 assert.equal(new Set(symbols).size,3,`${q.id}: 서로 다른 도형 3종이 아님`);
 const solutions=pathsFor(p);
 assert.equal(solutions.length,1,`${q.id}: 세 선을 함께 그리는 해가 ${solutions.length}개`);
 assert.deepEqual(solutions[0],q.visual.answer,`${q.id}: 렌더러 풀이 선과 독립 계산이 다름`);
 const occupied=new Set();
 solutions[0].forEach((route,i)=>{
  assert.equal(route[0],p.pairs[i][0]);assert.equal(route.at(-1),p.pairs[i][1]);
  assert.equal(new Set(route).size,route.length,`${q.id}: 한 선이 같은 칸을 두 번 지나감`);
  route.slice(1).forEach((cell,j)=>assert.equal(Math.abs(cell%p.w-route[j]%p.w)+Math.abs(Math.floor(cell/p.w)-Math.floor(route[j]/p.w)),1,`${q.id}: 가로·세로로 이웃하지 않은 칸을 연결함`));
  const foreign=new Set(p.pairs.filter((_,j)=>j!==i).flat());
  assert(!route.some(cell=>foreign.has(cell)),`${q.id}: 다른 도형이 있는 칸을 통과함`);
  for(const cell of route){assert(!occupied.has(cell),`${q.id}: 서로 다른 선이 같은 칸을 지나감`);occupied.add(cell);}
 });
}
assertThreeShapeLinks(question(4,'main',11));
assert(question(4,'main',11).payload.pairs.every(([a,b])=>Math.abs(a%5-b%5)+Math.abs(Math.floor(a/5)-Math.floor(b/5))>1),'4회 11번 같은 도형은 서로 옆에 있지 않음');

const r3Roll=question(3,'main',13),r4Roll=question(4,'main',15);
assert.deepEqual(r3Roll.payload.moves,['R','U','R']);assert.equal(roll(r3Roll.payload),6);assert.equal(solve(r3Roll.payload),r3Roll.answer);
assert.deepEqual(r4Roll.payload.moves,['R','R','D','R']);assert.equal(r4Roll.payload.query,'bottom');assert.equal(roll(r4Roll.payload),6);assert.equal(solve(r4Roll.payload),r4Roll.answer);
assert.deepEqual(question(3,'main',1).payload,{kind:'reverse',end:17,changes:[-9,8]},'3회 1번 버스 승하차 거꾸로 해결하기');
assert(question(3,'main',6).payload.paths.some(path=>path.some((point,index)=>index&&point[0]!==path[index-1][0]&&point[1]!==path[index-1][1])),'3회 6번에 대각선 포함');
assert(question(3,'main',7).prompt.includes('2년이 지난 후')&&!question(3,'main',7).prompt.includes('두 해'),'3회 7번 표현 수정');
assert.equal(question(3,'main',9).payload.kind,'shortest-path-grid');
assert.equal(question(3,'main',15).payload.kind,'checker-stack-count');
assert.equal(question(3,'main',18).payload.kind,'tetra-cube-hole-count');
assert(!question(3,'main',18).problemHtml.includes('같은 색의 쌓기나무 4개가 테트라큐브 1개입니다.'),'3회 18번 그림 아래 중복 설명 제거');
assert.equal(question(3,'main',19).payload.w*question(3,'main',19).payload.h,20);assert.deepEqual(question(3,'main',19).payload.checkpoints,[0,6,15,12,19,8,3,7],'3회 19번 숫자 위치를 불규칙하게 배치');
assert.equal(question(3,'extra',1).payload.boards.length,3,'3회 추가 1번 여러 도형');
assert.equal(question(3,'extra',4).payload.kind,'object-length-equivalence');
assert.equal(question(3,'extra',6).payload.kind,'cube-count-fill-custom');
assert.equal(question(4,'main',12).payload.kind,'block-build-count');
assert.equal(question(4,'main',17).payload.kind,'balance-substitution-pictures');
assert.equal(question(4,'main',18).payload.kind,'congruent-marked-partition');
const r4MainKinds=new Set(more.get(4,'main').questions.map(q=>q.payload.kind)),r4ExtraKinds=more.get(4,'extra').questions.map(q=>q.payload.kind);
assert.equal(new Set(r4ExtraKinds).size,6,'4회 추가 연습은 서로 다른 새 유형 여섯 개');
assert(r4ExtraKinds.every(kind=>!r4MainKinds.has(kind)),'4회 추가 연습은 본시험에 넣지 않은 유형');
assert(!question(4,'extra',1).problemHtml.includes('같은 연필·지우개·클립은 각각 길이가 같습니다.'),'4회 추가 1번 그림 아래 중복 설명 제거');
assert(!question(4,'extra',2).problemHtml.includes('검은색과 흰색 쌓기나무를 각각 세어 보세요.'),'4회 추가 2번 그림 아래 설명 제거');
assert.deepEqual(question(4,'extra',4).payload,{kind:'shortest-path-grid',cols:4,rows:3,blocked:[[2,1]],directions:['E','N'],responseMode:'shortest-path-count'},'4회 추가 4번 작은 4×3 표와 제외 지점 1개');
const out=path.resolve(__dirname,'../output/qa/challenge-editions-separated');fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'more-math-report.json'),JSON.stringify({passed:!failed,checked:result.length,result},null,2));
console.log(JSON.stringify({passed:!failed,checked:result.length}));if(failed)process.exitCode=1;
