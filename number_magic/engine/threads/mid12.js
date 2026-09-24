/* ============================================================
   Numbers of Magic — MD85 산포도: 편차·분산·표준편차·자료 비교.

   근거 범위: 디딤돌수학 개념연산 중3-2 인쇄 p.112~125.
   원본 문항·수치·문장은 복제하지 않고, 같은 수학적 행동만 새 유한
   풀로 구성한다. 모든 자료는 모집단 분산(편차 제곱의 평균)을 쓴다.

   계약: NM_TGEN[genKey] = function(params, rng) { ... }, Math.random() 금지.
   ============================================================ */
(function(){
'use strict';

const { pick } = NM_RNG;
function L3(ko,en,zh){ return {ko,en,zh}; }
function sum(a){ return a.reduce((s,x)=>s+x,0); }
function sqSum(a){ return a.reduce((s,x)=>s+x*x,0); }
function isSquare(n){ return Number.isInteger(Math.sqrt(n)); }
function listTex(a,mark){
  return a.map((x,i)=>i===mark?`\\underline{${x}}`:String(x)).join(',\\;');
}
function base(prompt,tex,answer,solution,model){
  return {prompt,tex,answer,answerType:'number',widget:'numpad',negative:Array.isArray(answer)?answer.some(x=>x<0):answer<0,solution,dispersionModel:Object.freeze(model)};
}

/* 비감소 편차열을 정확히 열거한다. 순서만 바꾼 같은 자료를 다른 변형으로
   세지 않으며, 합이 0인 것만 남긴다. */
const DEV_SETS=[];
function buildSets(n,lo,hi,start,acc){
  if(acc.length===n){
    if(sum(acc)===0 && acc.some(x=>x!==0) && acc[acc.length-1]-acc[0]>=3)
      DEV_SETS.push(Object.freeze(acc.slice()));
    return;
  }
  for(let v=start;v<=hi;v++){
    const next=acc.concat(v),left=n-next.length,partial=sum(next);
    if(partial+left*v>0) break;
    if(partial+left*hi<0) continue;
    buildSets(n,lo,hi,v,next);
  }
}
buildSets(4,-8,8,-8,[]);
buildSets(5,-7,7,-7,[]);
buildSets(6,-6,6,-6,[]);

const DEVIATION_POOL=[];
for(const dev of DEV_SETS){
  for(let mean=12;mean<=30;mean+=3){
    const data=dev.map(x=>x+mean);
    if(data[0]<0)continue;
    for(let target=0;target<data.length;target++) if(dev[target]!==0)
      DEVIATION_POOL.push(Object.freeze({data:Object.freeze(data),mean,target,answer:dev[target]}));
  }
}

const MISSING_POOL=[];
for(const dev of DEV_SETS){
  for(let missing=0;missing<dev.length;missing++){
    if(dev[missing]===0)continue;
    MISSING_POOL.push(Object.freeze({deviations:dev,missing,answer:dev[missing]}));
  }
}

const SPREAD_SETS=DEV_SETS.filter(function(dev){
  const q=sqSum(dev),v=q/dev.length;
  return Number.isInteger(v)&&v>=2&&v<=80&&!isSquare(v);
});
const VARIANCE_POOL=[];
for(const dev of SPREAD_SETS){
  for(let mean=12;mean<=36;mean+=4){
    const data=dev.map(x=>x+mean);
    if(data[0]>=0){
      const squaredSum=sqSum(dev),variance=squaredSum/dev.length;
      VARIANCE_POOL.push(Object.freeze({data:Object.freeze(data),mean,deviations:dev,squaredSum,variance}));
    }
  }
}

/* 평균과 산포도를 동시에 읽되 서로 섞지 않는 비교 문제. 같은 분산끼리의
   모호한 비교는 만들지 않는다. */
const COMPARE_BASE=SPREAD_SETS.slice(0,140);
const COMPARE_POOL=[];
for(let i=0;i<COMPARE_BASE.length;i++){
  for(let j=i+1;j<COMPARE_BASE.length;j++){
    const da=COMPARE_BASE[i],db=COMPARE_BASE[j];
    const va=sqSum(da)/da.length,vb=sqSum(db)/db.length;
    if(va===vb)continue;
    const meanA=24+(i%9),meanB=24+((j+4)%9)+(j%3===0?1:0);
    if(meanA===meanB)continue;
    const dataA=da.map(x=>x+meanA),dataB=db.map(x=>x+meanB);
    if(dataA[0]<0||dataB[0]<0)continue;
    COMPARE_POOL.push(Object.freeze({
      dataA:Object.freeze(dataA),dataB:Object.freeze(dataB),meanA,meanB,
      deviationsA:da,deviationsB:db,varianceA:va,varianceB:vb,
      higherMean:meanA>meanB?1:2,moreConsistent:va<vb?1:2
    }));
    if(COMPARE_POOL.length>=4800)break;
  }
  if(COMPARE_POOL.length>=4800)break;
}

function deviationProblem(m){
  return base(
    L3('밑줄 친 변량에서 평균을 빼 편차를 구합니다.','Subtract the mean from the underlined value to find its deviation.','用画线的变量减去平均数，求偏差。'),
    `\\text{평균 }${m.mean},\\quad (${listTex(m.data,m.target)})\\quad\\Rightarrow\\quad\\text{밑줄 친 값의 편차}=\\square`,
    m.answer,
    [{tex:`\\text{편차}=\\text{변량}-\\text{평균}`},{tex:`${m.data[m.target]}-${m.mean}=\\square`,blank:m.answer}],
    {mode:'deviation',data:m.data,mean:m.mean,target:m.target,deviations:m.data.map(x=>x-m.mean),answer:m.answer,poolSize:DEVIATION_POOL.length}
  );
}

function missingProblem(m){
  const shown=m.deviations.map((x,i)=>i===m.missing?'x':String(x)).join(',\\;');
  const known=m.deviations.filter((_,i)=>i!==m.missing),knownSum=sum(known);
  /* 편차 0은 합에 아무것도 보태지 않는다 — "+0+0"을 늘어놓지 않고 0이 아닌 편차만 더한다(2026-09-25). */
  const nz=known.filter(x=>x!==0);
  const knownTex=nz.length?nz.map((x,i)=>i===0?String(x):(x<0?`-${Math.abs(x)}`:`+${x}`)).join('')+'+x':'x';
  return base(
    L3('편차의 합은 0입니다. 빠진 편차를 구합니다.','The deviations add to zero. Find the missing deviation.','偏差的和为0，求缺少的偏差。'),
    `\\text{편차 }(${shown})\\quad\\Rightarrow\\quad x=\\square`,
    m.answer,
    [{tex:'\\text{편차의 합}=0'},{tex:`${knownTex}=0`},{tex:`x=-(${knownSum})=\\square`,blank:m.answer}],
    {mode:'missingDeviation',deviations:m.deviations,missing:m.missing,knownSum,answer:m.answer,poolSize:MISSING_POOL.length}
  );
}

function varianceProblem(m){
  return base(
    L3('평균을 구한 뒤 편차를 제곱하여 분산과 표준편차를 구합니다.','Find the mean, square the deviations, then find the variance and standard deviation.','先求平均数，再把偏差平方，求方差和标准差。'),
    `(${listTex(m.data,-1)})\\quad\\Rightarrow\\quad\\text{분산}=\\square,\\quad\\text{표준편차}=\\sqrt{\\square}`,
    [m.variance,m.variance],
    [{tex:`\\text{평균}=\\dfrac{${m.data.join('+')}}{${m.data.length}}=\\square`,blank:m.mean},
     {tex:`\\text{편차}=(${m.deviations.join(',')})`},
     {tex:`\\text{편차 제곱의 합}=${m.squaredSum}`},
     {tex:`\\text{분산}=\\dfrac{${m.squaredSum}}{${m.data.length}}=\\square`,blank:m.variance},
     {tex:`\\text{표준편차}=\\sqrt{\\square}`,blank:m.variance}],
    {mode:'varianceStd',data:m.data,mean:m.mean,deviations:m.deviations,squaredSum:m.squaredSum,variance:m.variance,standardDeviation:{coefficient:1,radicand:m.variance},poolSize:VARIANCE_POOL.length}
  );
}

function compareProblem(m){
  return base(
    L3('① A, ② B로 답합니다. 평균이 큰 자료와 평균 주위에 더 고르게 모인 자료를 각각 고릅니다.','Answer 1 for A and 2 for B. Choose the set with the larger mean and the set clustered more tightly around its mean.','用①表示A、②表示B。分别选择平均数较大、数据更集中在平均数附近的一组。'),
    `\\begin{aligned}A&:(${listTex(m.dataA,-1)})\\\\B&:(${listTex(m.dataB,-1)})\\\\\\text{큰 평균}&=\\square\\\\\\text{더 고름}&=\\square\\end{aligned}`,
    [m.higherMean,m.moreConsistent],
    [{tex:`\\overline{x}_A=${m.meanA},\\quad \\overline{x}_B=${m.meanB}`},
     {tex:`V_A=${m.varianceA},\\quad V_B=${m.varianceB}`},
     {tex:'\\overline{x}_{\\max}:\\square',blank:m.higherMean},
     {tex:'V_{\\min}:\\square',blank:m.moreConsistent}],
    Object.assign({mode:'compare',poolSize:COMPARE_POOL.length},m)
  );
}

NM_TGEN.md85_dispersion=function(params,rng){
  const mode=(params&&params.mode)||'deviation';
  if(mode==='deviation')return deviationProblem(pick(rng,DEVIATION_POOL));
  if(mode==='missingDeviation')return missingProblem(pick(rng,MISSING_POOL));
  if(mode==='varianceStd')return varianceProblem(pick(rng,VARIANCE_POOL));
  if(mode==='compare')return compareProblem(pick(rng,COMPARE_POOL));
  throw new RangeError('MD85 unknown mode: '+mode);
};

NM_TGEN.md85DispersionPoolSizes=Object.freeze({deviation:DEVIATION_POOL.length,missingDeviation:MISSING_POOL.length,varianceStd:VARIANCE_POOL.length,compare:COMPARE_POOL.length});

if(typeof module!=='undefined'&&module.exports)module.exports=NM_TGEN;
})();
