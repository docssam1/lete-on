/* ============================================================
   Numbers of Magic — MD87 산점도와 상관관계.

   근거 범위: 디딤돌수학 개념연산 중3-2 인쇄 p.144~153.
   원본 문항·수치·그림은 복제하지 않고, 표의 순서쌍을 직접 찍는 활동과
   양/음/무상관 및 강도를 읽는 수학적 행동만 자체 유한 풀로 구성한다.

   계약: NM_TGEN[genKey] = function(params, rng) { ... }, Math.random() 금지.
   ============================================================ */
(function(){
'use strict';

const { pick } = NM_RNG;
function L3(ko,en,zh){ return {ko,en,zh}; }
function clonePoints(points){ return points.map(p=>[p[0],p[1]]); }
function correlation(points){
  const n=points.length;
  const mx=points.reduce((s,p)=>s+p[0],0)/n, my=points.reduce((s,p)=>s+p[1],0)/n;
  let xy=0,xx=0,yy=0;
  points.forEach(p=>{const dx=p[0]-mx,dy=p[1]-my;xy+=dx*dy;xx+=dx*dx;yy+=dy*dy;});
  return xy/Math.sqrt(xx*yy);
}
function permute(values, visit){
  const a=values.slice(),used=new Array(a.length).fill(false),out=[];
  (function walk(){
    if(out.length===a.length){visit(out.slice());return;}
    for(let i=0;i<a.length;i++)if(!used[i]){used[i]=true;out.push(a[i]);walk();out.pop();used[i]=false;}
  })();
}

/* 같은 산점도를 여러 답으로 분류하지 않도록 상관계수 구간 사이에 안전 여백을 둔다.
   strong: |r|>=.88, weak: .28<=|r|<=.58, none: |r|<=.08. */
const REL={strongPositive:[],weakPositive:[],none:[],weakNegative:[],strongNegative:[]};
permute([1,2,3,4,5,6,7,8],function(y){
  const pts=y.map((v,i)=>[i+1,v]),r=correlation(pts);
  let key=null;
  if(r>=.88)key='strongPositive';
  else if(r>=.28&&r<=.58)key='weakPositive';
  else if(Math.abs(r)<=.08)key='none';
  else if(r<=-.28&&r>=-.58)key='weakNegative';
  else if(r<=-.88)key='strongNegative';
  if(!key||REL[key].length>=192)return;
  /* y축 평행이동은 관계를 보존하면서 눈에 보이는 점 배열을 달리한다. */
  REL[key].push(Object.freeze({points:Object.freeze(clonePoints(pts).map(Object.freeze)),r}));
  if(REL[key].length<192){
    const shifted=pts.map(p=>[p[0],p[1]+1]);
    REL[key].push(Object.freeze({points:Object.freeze(clonePoints(shifted).map(Object.freeze)),r}));
  }
});

const PLOT_POOL=[];
permute([1,2,3,4,5,6],function(y){
  if(PLOT_POOL.length>=240)return;
  const pts=y.map((v,i)=>[i+1,v+((PLOT_POOL.length%2)?2:1)]);
  PLOT_POOL.push(Object.freeze({points:Object.freeze(clonePoints(pts).map(Object.freeze))}));
});

const READ_POOL=[];
const relationEntries=Object.keys(REL).flatMap(kind=>REL[kind].slice(0,48).map(x=>({kind,...x})));
relationEntries.forEach((entry,idx)=>{
  const points=entry.points;
  const queries=[
    {kind:'xAtLeast',value:3+(idx%4)},
    {kind:'yAtLeast',value:3+((idx+1)%4)},
    {kind:'bothAtLeast',x:3+(idx%3),y:4+((idx+1)%3)},
    {kind:'aboveDiagonal'}
  ];
  queries.forEach(query=>{
    const answer=points.filter(p=>query.kind==='xAtLeast'?p[0]>=query.value:
      query.kind==='yAtLeast'?p[1]>=query.value:
      query.kind==='bothAtLeast'?p[0]>=query.x&&p[1]>=query.y:p[1]>p[0]).length;
    if(answer>0&&answer<points.length)READ_POOL.push(Object.freeze({points,query:Object.freeze(query),answer}));
  });
});

const CLASS_POOL=[];
for(const kind of ['strongPositive','weakPositive','none','weakNegative','strongNegative']){
  REL[kind].forEach(item=>CLASS_POOL.push(Object.freeze({kind,points:item.points,r:item.r})));
}

function relationAnswer(kind,detail){
  if(detail)return ({strongPositive:1,weakPositive:2,none:3,weakNegative:4,strongNegative:5})[kind];
  if(kind==='strongPositive'||kind==='weakPositive')return 1;
  if(kind==='strongNegative'||kind==='weakNegative')return 2;
  return 3;
}
function relationKo(kind){
  return ({strongPositive:'강한 양의 상관관계',weakPositive:'약한 양의 상관관계',none:'상관관계 없음',weakNegative:'약한 음의 상관관계',strongNegative:'강한 음의 상관관계'})[kind];
}
function graph(points){ return {kind:'points',pts:clonePoints(points),xr:[0,10],yr:[0,10]}; }
function scatter(mode,points,plotted,labels){
  return {mode,points:clonePoints(points),plotted:!!plotted,showTable:mode==='plot',xLabel:labels[0],yLabel:labels[1]};
}
function common(prompt,tex,answer,model,plotted,labels){
  const visiblePoints=model.points;
  return {prompt,tex,answer,answerType:'number',widget:'numpad',negative:false,
    graph:graph(plotted?visiblePoints:[]),scatterPlot:scatter(model.mode,visiblePoints,plotted,labels),
    scatterModel:Object.freeze(model)};
}
function plotProblem(m){
  const points=clonePoints(m.points),answer=points.length;
  const p=common(
    L3('표의 순서쌍을 빈 모눈에 모두 찍습니다. 점을 서로 선으로 잇지 않습니다.','Plot every ordered pair on the blank grid. Do not join the points.','把表中的有序数对全部描在空白方格中，不要把点连起来。'),
    `\\text{순서쌍 }${points.length}\\text{개를 모두 찍고, 찍은 점의 수}=\\square`,answer,
    {mode:'plot',points:Object.freeze(points.map(Object.freeze)),answer,poolSize:PLOT_POOL.length},false,
    ['x 자료','y 자료']);
  /* 다른 모드처럼 풀이 줄을 둔다 — 없으면 예시·해설에 풀이가 비어 나간다(2026-09-25) */
  p.solution=[{tex:'\\text{표의 순서쌍마다 }(x,\\;y)\\text{ 자리에 점 하나}'},
    {tex:'\\text{찍은 점의 수}=\\square',blank:answer}];
  return p;
}
function queryTex(q){
  if(q.kind==='xAtLeast')return `x\\ge ${q.value}`;
  if(q.kind==='yAtLeast')return `y\\ge ${q.value}`;
  if(q.kind==='bothAtLeast')return `x\\ge ${q.x}\\text{이고 }y\\ge ${q.y}`;
  return 'y>x';
}
function readProblem(m){
  const points=clonePoints(m.points),q=Object.assign({},m.query);
  const p=common(
    L3('산점도의 점을 조건에 맞게 하나씩 세어 답합니다. 경계선 위의 점도 ≥ 조건에는 포함합니다.','Count the plotted points that satisfy the condition. Include boundary points for ≥.','逐个数出满足条件的点；“≥”条件包含边界上的点。'),
    `\\text{산점도에서 }${queryTex(q)}\\text{인 점은 }\\square\\text{개}`,m.answer,
    {mode:'read',points:Object.freeze(points.map(Object.freeze)),query:Object.freeze(q),answer:m.answer,poolSize:READ_POOL.length},true,
    ['x 자료','y 자료']);
  p.solution=[{tex:`${queryTex(q)}\\text{인 점을 한 번씩 표시}`},{tex:'\\text{점의 수}=\\square',blank:m.answer}];
  return p;
}
function classifyProblem(m,detail){
  const points=clonePoints(m.points),answer=relationAnswer(m.kind,detail);
  const key=detail
    ? '\\begin{array}{c}\\text{①강한 양  ②약한 양  ③없음}\\\\\\text{④약한 음  ⑤강한 음}\\end{array}'
    : '\\text{①양의 상관  ②음의 상관  ③없음}';
  const p=common(
    L3(detail?'점들이 향하는 방향과 모인 정도를 함께 보고 번호로 답합니다.':'x가 증가할 때 y가 대체로 어떻게 변하는지 보고 번호로 답합니다.',
       detail?'Use both direction and tightness of the point cloud, then answer with a number.':'As x increases, decide how y tends to change and answer with a number.',
       detail?'同时观察点云的方向和紧密程度，填写编号。':'观察x增大时y大致怎样变化，填写编号。'),
    `${key}\\quad\\Rightarrow\\quad\\square`,answer,
    {mode:detail?'strength':'correlation',kind:m.kind,points:Object.freeze(points.map(Object.freeze)),r:m.r,answer,poolSize:CLASS_POOL.length},true,
    ['첫째 변량','둘째 변량']);
  p.solution=[{tex:'x\\text{가 커질 때 점들의 전체 방향을 본다}'},{tex:`\\text{${relationKo(m.kind)}}\\Rightarrow\\square`,blank:answer}];
  return p;
}

NM_TGEN.md87_scatter=function(params,rng){
  const mode=(params&&params.mode)||'plot';
  if(mode==='plot')return plotProblem(pick(rng,PLOT_POOL));
  if(mode==='read')return readProblem(pick(rng,READ_POOL));
  if(mode==='correlation')return classifyProblem(pick(rng,CLASS_POOL),false);
  if(mode==='strength')return classifyProblem(pick(rng,CLASS_POOL),true);
  throw new RangeError('MD87 unknown mode: '+mode);
};
NM_TGEN.md87ScatterPoolSizes=Object.freeze({plot:PLOT_POOL.length,read:READ_POOL.length,correlation:CLASS_POOL.length,strength:CLASS_POOL.length,relations:Object.freeze(Object.keys(REL).reduce((o,k)=>(o[k]=REL[k].length,o),{}))});
if(typeof module!=='undefined'&&module.exports)module.exports=NM_TGEN;
})();
