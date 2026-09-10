'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {solveQuestion}=require('./validate_challenge_concepts.cjs');
const variantChecks=require('./validate_challenge_variants.cjs');
const coreLevelChecks=require('./validate_challenge_core_levels.cjs');
const plan=require('../challenge/concept-book-plan.js').build(20260909);

function model(value){
 if(Array.isArray(value))return value.map(model);
 if(value&&typeof value==='object')return Object.fromEntries(
  Object.keys(value).sort()
   .filter(key=>!['seed','difficulty','answer','answerCandidates','ways'].includes(key))
   .map(key=>[key,model(value[key])])
 );
 return value;
}
function canonicalNet(cells){const variants=[];for(const swap of [false,true])for(const sx of [-1,1])for(const sy of [-1,1]){const transformed=cells.map(([a,b])=>[(swap?b:a)*sx,(swap?a:b)*sy]),minX=Math.min(...transformed.map(cell=>cell[0])),minY=Math.min(...transformed.map(cell=>cell[1]));variants.push(transformed.map(([x,y])=>[x-minX,y-minY]).sort((a,b)=>a[1]-b[1]||a[0]-b[0]).join(';'));}return variants.sort()[0];}
function rollDie(o,d){return d==='N'?{top:o.south,bottom:o.north,north:o.top,south:o.bottom,east:o.east,west:o.west}:d==='S'?{top:o.north,bottom:o.south,north:o.bottom,south:o.top,east:o.east,west:o.west}:d==='E'?{top:o.west,bottom:o.east,north:o.north,south:o.south,east:o.top,west:o.bottom}:{top:o.east,bottom:o.west,north:o.north,south:o.south,east:o.bottom,west:o.top};}
function finalDie(board){return board.route.reduce(rollDie,board.startOrientation);}
function solve(question){const p=question.payload;
 if(p.kind==='group'&&p.query==='cumulative-color-difference'){
  const totals=p.colors.map((_,colorIndex)=>Array.from({length:p.position},(_,index)=>index+1).filter(position=>(position-1)%p.colors.length===colorIndex).reduce((sum,position)=>sum+position,0));
  const winner=Math.max(...totals),loser=Math.min(...totals),winnerIndex=totals.indexOf(winner);
  return `${p.colors[winnerIndex]} 구슬이 ${winner-loser}개 더 많습니다.`;
 }
 if(question.typeId==='r3-main-13'&&p.kind==='roll')return coreLevelChecks.solve({...question,difficulty:p.moves.length===5?'hard':'same'});
 return question.variant?variantChecks.solve(question):solveQuestion(question);
}
function assertQuestion(question,label){
 assert(question.prompt,`${label}: 문제 없음`);
 assert(question.solution&&question.answer!==undefined,`${label}: 정답 또는 상세 풀이 없음`);
 assert(!/풀이 확인 필요|undefined|NaN/.test(question.solution),`${label}: 미완성 풀이`);
 assert(!/more-answer|answer-visual|정답과 풀이/.test(question.problemHtml||''),`${label}: 학생 문제에 정답 그림 노출`);
 assert(!/(^|[^0-9])[−-]\s*0([^0-9]|$)/.test(`${question.prompt} ${question.problemHtml||''}`),`${label}: 학생 식에 -0 사용`);
 assert.deepEqual(solve(question),question.answer,`${label}: 독립 계산과 정답 불일치`);
}

const failures=[],volumeReports=[],arrowTriples=[],linkTriples=[],requestedChecks=[];
let independentChecks=0;
for(const volume of plan.volumes){
 try{
   const expectedBehaviorCount=volume.round===1?40:39;
   assert.equal(volume.chapters.length,8,`${volume.round}권 단원 수`);
   assert(volume.chapters.every(chapter=>chapter.items.length===5)||(volume.round===2&&volume.chapters[3].items.length===4),`${volume.round}권 단원별 행동유형 구성`);
   const slots=volume.chapters.flatMap(chapter=>chapter.items);
   assert.equal(slots.length,expectedBehaviorCount,`${volume.round}권 행동유형 수`);
   assert.equal(volume.review.length,expectedBehaviorCount,`${volume.round}권 REVIEW 수`);
   assert.equal(new Set(slots.map(slot=>slot.slotKey)).size,expectedBehaviorCount,`${volume.round}권 행동유형 키 중복`);
   assert.equal(new Set(slots.map(slot=>slot.subtype)).size,expectedBehaviorCount,`${volume.round}권 행동유형 중복`);
   assert.equal(new Set(slots.map(slot=>slot.typeId)).size,expectedBehaviorCount,`${volume.round}권 풀이 행동 중복`);
   assert.equal(new Set(slots.map(slot=>slot.title)).size,expectedBehaviorCount,`${volume.round}권 제목 중복`);
  assert.deepEqual(volume.review.map(item=>item.key),slots.map(slot=>slot.review.key),`${volume.round}권 REVIEW 1:1 대응`);

  for(const slot of slots){
   const phases=[slot.basic,slot.guided,slot.review];
   assert.deepEqual(phases.map(item=>item.phase),['basic','guided','review'],`${slot.slotKey}: 학습 순서`);
   assert.deepEqual(phases.map(item=>item.difficulty),['easy','same','same'],`${slot.slotKey}: 난도 순서`);
   assert.equal(new Set(phases.map(item=>item.typeId)).size,1,`${slot.slotKey}: 다른 풀이 행동으로 대체됨`);
   assert.equal(new Set(phases.map(item=>item.key)).size,3,`${slot.slotKey}: 문항 키 중복`);
   assert.equal(new Set(phases.map(item=>JSON.stringify(model(item.question.payload)))).size,3,`${slot.slotKey}: 조건 화면 중복`);
   const evidence=phases.map(item=>item.difficultyEvidence);
   assert(evidence.every(item=>item&&item.metric&&Number.isFinite(item.value)),`${slot.slotKey}: 실제 난도 근거 없음`);
   assert.equal(evidence[0].metric,evidence[1].metric,`${slot.slotKey}: 난도 지표 불일치`);
   assert.equal(evidence[1].metric,evidence[2].metric,`${slot.slotKey}: REVIEW 난도 지표 불일치`);
   assert(evidence[1].value>evidence[0].value,`${slot.slotKey}: 유제가 기본보다 높지 않음`);
   assert.equal(evidence[2].value,evidence[1].value,`${slot.slotKey}: REVIEW가 유제와 같은 난도가 아님`);
   phases.forEach(item=>{assertQuestion(item.question,item.key);independentChecks+=1;});

   if(phases[0].question.typeId==='arrow-number-move'){
    const steps=phases.map(item=>item.question.payload.verticalStep);
    assert.deepEqual(steps,[10,8,8],`${slot.slotKey}: 화살표 ±10/±8/±8 조건`);
    phases.forEach(item=>assert(item.question.payload.moves.some(move=>'UD'.includes(move)),`${item.key}: 위아래 이동 없음`));
    arrowTriples.push({round:volume.round,slot:slot.typeNumber,steps});
   }
   if(phases[0].question.payload.kind==='geo-links'){
    const pairCounts=phases.map(item=>item.question.payload.pairs.length);
    assert.deepEqual(pairCounts,[3,3,3],`${slot.slotKey}: 선 잇기는 기본부터 세 도형 쌍`);
    phases.forEach(item=>{
     assert.equal(new Set(item.question.payload.symbols).size,3,`${item.key}: 도형 세 종류가 서로 다르지 않음`);
     assert.equal(item.question.answer.length,3,`${item.key}: 정답 선 세 개가 아님`);
    });
    linkTriples.push({round:volume.round,slot:slot.typeNumber,pairCounts,grids:phases.map(item=>`${item.question.payload.w}x${item.question.payload.h}`)});
   }
  }
  volumeReports.push({round:volume.round,chapters:8,behaviors:expectedBehaviorCount,teachingQuestions:expectedBehaviorCount*2,reviewQuestions:expectedBehaviorCount,totalQuestions:expectedBehaviorCount*3});
 }catch(error){failures.push({round:volume.round,error:error.message});}
}
try{
 const slots=round=>plan.volumes[round-1].chapters.flatMap(chapter=>chapter.items);
 const bySubtype=(round,subtype)=>{const item=slots(round).find(slot=>slot.subtype===subtype);assert(item,`${round}권 ${subtype} 없음`);return item;};
 const payloads=(round,subtype)=>{const item=bySubtype(round,subtype);return [item.basic,item.guided,item.review].map(phase=>phase.question.payload);};

 const split=payloads(1,'core-split-merge-chain')[0].panels[0];
 assert.deepEqual(split.nodes,{a:9,b:8,total:17},'1권 가르기 대표 (1)은 17을 9와 8로 가르기');
 assert.deepEqual(split.givenKeys,['total','a'],'1권 가르기 대표 (1) 제시 수');
 assert.deepEqual(split.blankKeys,['b'],'1권 가르기 대표 (1) 빈칸');
 assert(!payloads(1,'core-minimum-sum-pyramid')[0].cards.includes(0),'1권 숫자 카드 대표에 0 사용');
 assert.deepEqual(payloads(1,'distinct-tree').map(payload=>payload.known.length),[2,3,3],'1권 수나무 2단계·3단계');
 assert(payloads(1,'distinct-tree').every((payload,index)=>payload.total>=[17,20,20][index]),'1권 수나무 수 범위');
 assert.deepEqual(payloads(1,'age-chain').map(payload=>payload.borrowingSubtraction),[
  {minuend:24,subtrahend:8,difference:16},
  {minuend:27,subtrahend:9,difference:18},
  {minuend:26,subtrahend:9,difference:17}
 ],'1권 나이 문제 두 자리 받아내림');
 const code=payloads(1,'circle-bar-code');
 assert.deepEqual(code.map(payload=>payload.examples.length+(payload.stacked?1:0)),[4,5,5],'1권 원·막대 규칙 대표와 유제 단계');
 assert.deepEqual(payloads(1,'core-four-cell-code')[0].weights,[1,2,4,8],'1권 네 칸 숫자 코드의 자리값');
 const machines=payloads(1,'number-machine');
 assert.deepEqual(machines.map(payload=>payload.groups.map(group=>group.rule)),[['double','add'],['double','subtract'],['double','subtract']],'1권 수 상자 위 더하기·아래 빼기');
 assert.deepEqual(payloads(1,'shade-cycle').map(payload=>payload.missingCount),[2,3,3],'1권 색칠 규칙 빈 그림 수');
 const periods=payloads(1,'independent-periods');
 assert.equal(periods[0].counts,null,'1권 대표는 이중 주기');
 assert.deepEqual(periods.slice(1).map(payload=>payload.counts),[[1,2,3],[1,2,3]],'1권 유제·리뷰는 1·2·3개 삼중 주기');
 const stars=payloads(1,'missing-combination');
 assert.deepEqual([stars[0].slots,stars[0].choose],[4,2],'1권 대표 별 4개 중 2개');
 assert(stars.slice(1).every(payload=>payload.rules?.length===2),'1권 유제·리뷰 빠진 색칠 조합은 두 층');
 assert.deepEqual(payloads(1,'growing-groups').slice(1).map(payload=>[payload.position,payload.query]),[[22,'cumulative-color-difference'],[22,'cumulative-color-difference']],'1권 22번째까지 누적 구슬 비교');

 assert.deepEqual(payloads(2,'general-quadrilaterals').map(payload=>payload.horizontalLevels.length-2),[1,2,2],'2권 사다리꼴 가로선 1개·2개');
 assert.deepEqual(payloads(2,'tetromino').map(payload=>payload.options.length),[3,4,4],'2권 조각 보기 3개·4개');
 assert.deepEqual(payloads(2,'pattern-piece-count').map(payload=>payload.rays),[3,4,4],'2권 삼각형 선 3개·4개');
 const folds=payloads(2,'fold-holes');
 assert.deepEqual(folds[0].folds,['right-to-left','bottom-to-top'],'2권 대표 색종이 오른쪽에서 왼쪽, 아래에서 위로 접기');
 assert(folds.slice(1).every(payload=>payload.folds.length===2&&payload.folds.every(fold=>fold.startsWith('diag-'))),'2권 유제·리뷰 대각선 두 번 접기');
 const foldQuestions=[bySubtype(2,'fold-holes').basic,bySubtype(2,'fold-holes').guided,bySubtype(2,'fold-holes').review].map(item=>item.question);
 assert(foldQuestions.every(question=>question.problemHtml.includes('data-fold-engine="half-plane-mirror"')),'2권 색종이는 필즈 문제은행의 반평면·거울대칭 접기 엔진');
 assert(foldQuestions.every(question=>(question.problemHtml.match(/data-fold-stage=/g)||[]).length===3&&(question.problemHtml.match(/data-fold-arrow=/g)||[]).length===2),'2권 색종이는 실제 종이 모양 세 단계와 접기 화살표 두 개');
 assert.deepEqual(payloads(2,'partition-three').map(payload=>payload.complexity),[37,45,45],'2권 같은 세 부분 나누기 단계');
 const partitionBoards=payloads(2,'congruent-marked-partition');
 assert.equal(bySubtype(2,'congruent-marked-partition').number,7,'2권 7번은 나무 그림이 하나씩 들어가는 같은 모양 나누기');
 assert.deepEqual(partitionBoards.map(payload=>payload.boards.length),[2,3,3],'2권 같은 모양 나누기는 대표 2도형·유제와 리뷰 3도형');
 assert(partitionBoards.every(payload=>payload.boards.every(board=>board.parts.length===2&&board.markers.length===2)),'2권 같은 모양 나누기는 두 부분과 나무 두 개');
 assert.deepEqual(payloads(2,'top-view').map(payload=>Math.max(...payload.heights.flat())),[2,3,3],'2권 위에서 보기 대표 2층·유제 3층');
 const fills=payloads(2,'stack-box-fill');
 assert(fills.every(payload=>payload.width===3&&payload.depth===3&&payload.camera==='geometry-standard-iso'),'2권 상자 채우기는 3×3 높은 등각 시점');
 assert.deepEqual(fills.map(payload=>payload.boxH),[2,3,3],'2권 상자 채우기는 대표 2층·유제와 리뷰 3층');
 assert.deepEqual(fills.map(payload=>payload.need),[8,12,13],'2권 상자 채우기 추가 개수 8·12·13개');
 assert.deepEqual([bySubtype(2,'stack-box-fill').basic.question.answer,bySubtype(2,'stack-box-fill').guided.question.answer,bySubtype(2,'stack-box-fill').review.question.answer],[8,12,13],'2권 상자 채우기 정답');
  const minimumStacks=payloads(2,'stack-minimum-visible');
  assert.deepEqual([bySubtype(2,'stack-minimum-visible').basic.question.answer,bySubtype(2,'stack-minimum-visible').guided.question.answer,bySubtype(2,'stack-minimum-visible').review.question.answer],[10,14,14],'2권 쌓기나무 개수 10·14·14개');
  assert(minimumStacks.every(payload=>payload.responseMode==='cube-count'&&payload.countMode==='all-cubes-in-drawing'&&payload.camera==='iso-plus-x-plus-z-v1'),'2권 쌓기나무 개수 세기 조건');
  assert(minimumStacks.every(payload=>payload.heightMap.every((row,rowIndex)=>row.every((height,columnIndex)=>!(rowIndex<2&&height<payload.heightMap[rowIndex+1][columnIndex])&&!(columnIndex<2&&height<row[columnIndex+1])))),'2권 쌓기나무는 앞·오른쪽으로 갈수록 높아지지 않음');
  const checkerStacks=payloads(2,'checker-stack-count');
  assert.equal(bySubtype(2,'checker-stack-count').number,11,'2권 11번은 검은색·흰색 교차 쌓기나무');
  assert(checkerStacks.every(payload=>payload.responseMode==='color-count-pair'&&Math.max(...payload.heightMap.flat())>=2),'2권 교차 색 쌓기나무는 입체 계단 모양');
  for(const subtype of ['net-colors-pair','net-pips-pair']){
   const pairPayloads=payloads(2,subtype);
   assert.deepEqual(pairPayloads.map(payload=>payload.subproblems.length),[2,2,2],`2권 ${subtype} 소문제 두 개`);
   assert.deepEqual(pairPayloads.map(payload=>payload.subproblems[0].query.length),[1,2,2],`2권 ${subtype} 대표 1칸·유제와 리뷰 2칸`);
   pairPayloads.forEach(payload=>assert.equal(new Set(payload.subproblems.map(subproblem=>canonicalNet(subproblem.cells))).size,2,`2권 ${subtype}의 두 전개도는 서로 다른 모양`));
  }
  const targetDice=payloads(2,'dice-target-bottom');
  assert.deepEqual(targetDice.map(payload=>payload.route.length),[4,5,5],'2권 목표 칸 밑면은 대표 4회·유제와 리뷰 5회 이동');
  assert(targetDice.every(payload=>payload.responseMode==='target-bottom-number'&&payload.view==='southeast-diagonal'&&payload.rows===4&&payload.cols===4),'2권 18번은 4×4 등각 격자의 목표 칸 밑면');
  assert.deepEqual([bySubtype(2,'dice-target-bottom').basic.question.answer,bySubtype(2,'dice-target-bottom').guided.question.answer,bySubtype(2,'dice-target-bottom').review.question.answer],[2,6,4],'2권 주사위 움직이기 밑면 정답');
  assert.deepEqual(targetDice.map(payload=>[payload.sourceDatabase,payload.sourceProblemId]),[['geometry/games/dice-roll/levels.js','dice-l4-01'],['geometry/games/dice-roll/levels.js','dice-l4-02'],['geometry/games/dice-roll/levels.js','dice-l4-03']],'2권 주사위 움직이기 문항 DB 연결');
  for(const subtype of ['dice-target-bottom']){
    const slot=bySubtype(2,subtype);
    for(const phase of [slot.basic,slot.guided,slot.review]){
      const html=phase.question.problemHtml,boardCount=(html.match(/data-dice-board="4x4"/g)||[]).length,dieCount=(html.match(/data-die-on-start="true"/g)||[]).length;
      assert((phase.question.solution.match(/→/g)||[]).length>=2,'2권 주사위 상세 풀이에 이동 단계 필요');
      assert(boardCount===1&&dieCount===1&&html.includes('data-viewpoint="southeast-diagonal"'),'2권 주사위 움직이기는 4×4 등각 격자 시작 칸 위의 입체 주사위와 방향 화살표');
    }
  }
  const tetra=payloads(2,'tetra-cube-hole-count');
  assert.deepEqual(tetra.map(payload=>payload.holes),[1,2,2],'2권 테트라큐브는 대표 1개·유제와 REVIEW 2개의 구멍');
  assert.deepEqual(tetra.map(payload=>payload.cubeCount),[32,36,36],'2권 테트라큐브 쌓기나무 개수');
  assert.deepEqual([bySubtype(2,'tetra-cube-hole-count').basic.question.answer,bySubtype(2,'tetra-cube-hole-count').guided.question.answer,bySubtype(2,'tetra-cube-hole-count').review.question.answer],[8,9,9],'2권 테트라큐브 개수 정답');
  assert(tetra.every(payload=>payload.pieces.length===payload.cubeCount/4&&payload.pieces.every(piece=>piece.length===4)),'2권 19번은 실제 네 칸 테트라큐브 조각으로 구성');
  assert(tetra.every(payload=>Math.max(...payload.heightMap.flat())===2),'2권 19번 REVIEW도 2층으로 읽을 수 있어야 함');
 const selectedSubtypes=slots(2).map(slot=>slot.subtype);
 assert(!selectedSubtypes.includes('three-view-minimum-cubes'),'2권 위·앞·옆 최소 개수 유형 제거');
 assert(!selectedSubtypes.includes('opposite-faces'),'2권 직육면체 마주 보는 모양 유형 제거');
  assert(!selectedSubtypes.includes('dice-finish-visible-faces')&&!selectedSubtypes.includes('dice-paired-bottom-inference'),'2권 19·20번의 별도 주사위 유형 제거');
  assert(!selectedSubtypes.includes('route-count'),'2권 기존 오른쪽·위쪽 격자 경로 유형 제거');
  assert(!selectedSubtypes.includes('core-cube-count-fill'),'2권 11번의 중복 쌓기나무 세기 제거');
  assert(!selectedSubtypes.includes('diagonal-route-order'),'2권 24번 중복 대각선 경로 제거');
  assert(!selectedSubtypes.includes('orthogonal-length'),'2권 29번 중복 꺾은선 길이 제거');
  const pathSlot=bySubtype(2,'simple-path-network'),pathPayloads=payloads(2,'simple-path-network');
  assert.equal(pathSlot.number,25,'2권 25번은 지나간 지점을 다시 지나지 않는 길');
  assert.deepEqual(pathPayloads.map(payload=>[payload.vertices.length,payload.edges.length]),[[7,9],[8,11],[8,11]],'2권 26번 갈림점·길 수');
  assert.deepEqual([pathSlot.basic.question.answer,pathSlot.guided.question.answer,pathSlot.review.question.answer],[7,12,12],'2권 26번 단순 경로 정답');
  assert(pathPayloads.every(payload=>payload.noRevisit===true&&payload.undirected===true),'2권 26번은 양방향이며 지점 재방문 금지');
 assert.deepEqual(payloads(2,'net-perspective').map(payload=>payload.choices.length),[3,4,4],'2권 전개도에서 겨냥도 찾기 보기 수');
 const lengthRelations=payloads(2,'object-length-equivalence');
 assert.equal(bySubtype(2,'object-length-equivalence').number,21,'2권 21번은 연필·지우개·클립 길이 관계');
 assert.deepEqual(lengthRelations.map(payload=>payload.rows.length),[2,4,4],'2권 길이 대표 한 관계·유제와 리뷰 두 연결 관계');
 assert(lengthRelations.every(payload=>Object.keys(payload.units).sort().join(',')==='C,E,P'&&payload.rows.some(row=>row.items.includes('P'))&&payload.rows.some(row=>row.items.includes('E'))&&payload.rows.some(row=>row.items.includes('C'))),'2권 길이 그림에 연필·지우개·클립 모두 사용');
 const blockBuilds=payloads(2,'block-build-count');
 assert.equal(bySubtype(2,'block-build-count').number,24,'2권 24번은 A·B 블록으로 만든 모양');
 assert.deepEqual(blockBuilds.map(payload=>payload.bPieces.length),[4,3,3],'2권 A·B 블록의 두 칸 블록 개수');
 assert.deepEqual(payloads(2,'noncrossing-links').map(payload=>payload.pairs.length),[3,3,3],'2권 선 잇기 세 도형');
 const shortest=payloads(2,'shortest-path-grid');
 assert.equal(bySubtype(2,'shortest-path-grid').number,29,'2권 29번은 복원한 최단거리');
 assert.deepEqual([bySubtype(2,'shortest-path-grid').basic.question.answer,bySubtype(2,'shortest-path-grid').guided.question.answer,bySubtype(2,'shortest-path-grid').review.question.answer],[16,31,37],'2권 최단거리 독립 정답');
 const balances=payloads(2,'balance-substitution-pictures');
 assert.equal(bySubtype(2,'balance-substitution-pictures').number,31,'2권 31번은 여러 저울 관계 대입');
 assert.deepEqual(balances.map(payload=>payload.equations.length),[3,4,4],'2권 저울 대표 3그림·유제와 리뷰 4그림');
  assert.deepEqual(payloads(2,'queue-between').map(payload=>payload.people.length),[4,5,5],'2권 39번 줄세우기 대표 4명·유제와 리뷰 5명');
  assert.equal(bySubtype(2,'queue-between').title,'조건에 맞게 줄세우기','2권 39번 제목은 줄세우기');
  assert.equal(new Set(plan.volumes.flatMap(volume=>volume.chapters.flatMap(chapter=>chapter.items.map(item=>item.subtype)))).size,79,'두 권 79개 행동유형이 모두 달라야 함');
   requestedChecks.push('2권 19·20번 주사위 세부 유형 삭제와 구멍 테트라큐브 추가');
}catch(error){failures.push({scope:'requested-revisions',error:error.message});}
assert.equal(plan.volumes.length,2);
if(!arrowTriples.length)failures.push({scope:'all',error:'화살표 이동 행동유형 없음'});
if(!linkTriples.length)failures.push({scope:'all',error:'세 도형 선 잇기 행동유형 없음'});
const report={
 passed:failures.length===0,
 volumes:volumeReports,
 structure:'1권 행동유형 40개, 2권 행동유형 39개 × (기본 1 + 한 단계 1 + 같은 난이도 REVIEW 1)',
 independentMathChecks:independentChecks,
 arrowTriples,
 linkTriples,
 requestedChecks,
 failures
};
const out=path.resolve(__dirname,'../output/qa/challenge-concepts-two');
fs.mkdirSync(out,{recursive:true});
fs.writeFileSync(path.join(out,'math-report.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
assert.equal(failures.length,0);
