/* ============================================================
   Numbers of Magic — MD88 경우의 수.

   근거 범위: 디딤돌수학 개념연산 중2-2 인쇄 p.216~230.
   포함: 사건의 경우의 수, 배타적인 A 또는 B의 덧셈법칙, A와 B가
   잇달아 일어나는 곱셈법칙/경로, 한 줄 세우기, 특정 자리 고정.
   제외: p.232 이후와 확률. 원본 문항·수치·문장을 복제하지 않고 같은
   계산 원리로 새 유한 풀을 만든다.

   계약: NM_TGEN[genKey] = function(params, rng) { ... }, Math.random() 금지.
   모든 답은 현재 numpad 4자리 안(0~9999)이다.
   ============================================================ */
(function(){
'use strict';

const { pick } = NM_RNG;

function L3(ko,en,zh){ return {ko,en,zh}; }
function product(from,count){
  let value=1;
  for(let i=0;i<count;i++) value*=from-i;
  return value;
}
function factorial(n){ return product(n,n); }
function factors(from,count){
  const out=[];
  for(let i=0;i<count;i++) out.push(from-i);
  return out;
}
function timesTex(values){ return values.join('\\times'); }
function baseProblem(prompt,tex,answer,solution,model){
  return {
    prompt, tex, answer, answerType:'number', widget:'numpad', negative:false,
    solution, countingModel:Object.freeze(model)
  };
}
function wordProblem(story,ask,tex,answer,solution,model){
  const prompt={};
  ['ko','en','zh'].forEach(function(lang){ prompt[lang]=story[lang]+' '+ask[lang]; });
  const p=baseProblem(prompt,tex,answer,solution,model);
  p.word=story; p.wordAsk=ask;
  return p;
}

/* 한 번의 시행에서 조건을 만족하는 결과의 개수. 모두 1..n 번호 카드로
   통일해 사건의 원소를 실제로 셀 수 있게 한다. */
const EVENT_POOL=[];
for(let n=6;n<=28;n++){
  for(let k=2;k<n;k++){
    EVENT_POOL.push({kind:'atLeast',n,k,answer:n-k+1});
    EVENT_POOL.push({kind:'atMost',n,k,answer:k});
  }
  EVENT_POOL.push({kind:'odd',n,answer:Math.ceil(n/2)});
  EVENT_POOL.push({kind:'even',n,answer:Math.floor(n/2)});
  for(let d=2;d<=8;d++) if(Math.floor(n/d)>=2)
    EVENT_POOL.push({kind:'multiple',n,d,answer:Math.floor(n/d)});
}

const EITHER_CONTEXTS=[
  {a:['버스','bus','公交车'],b:['지하철','subway','地铁'],unit:['노선','routes','条线路']},
  {a:['빨간 펜','red pens','红笔'],b:['파란 펜','blue pens','蓝笔'],unit:['자루','choices','支']},
  {a:['빵','breads','面包'],b:['음료','drinks','饮料'],unit:['가지','choices','种']},
  {a:['오전 수업','morning classes','上午课'],b:['오후 수업','afternoon classes','下午课'],unit:['가지','choices','种']},
  {a:['동쪽 문','east gates','东门'],b:['서쪽 문','west gates','西门'],unit:['가지','ways','种']}
];
const EITHER_POOL=[];
for(let c=0;c<EITHER_CONTEXTS.length;c++) for(let a=2;a<=16;a++) for(let b=2;b<=16;b++)
  EITHER_POOL.push({kind:'either',context:c,a,b,answer:a+b});

const BOTH_CONTEXTS=[
  {a:['상의','tops','上衣'],b:['하의','bottoms','下装'],unit:['벌','outfits','套']},
  {a:['A에서 B로 가는 길','routes from A to B','从A到B的路'],b:['B에서 C로 가는 길','routes from B to C','从B到C的路'],unit:['가지','routes','条路线'],route:true},
  {a:['첫 번째 자물쇠 번호','first-lock codes','第一把锁的号码'],b:['두 번째 자물쇠 번호','second-lock codes','第二把锁的号码'],unit:['가지','codes','种']},
  {a:['간식','snacks','零食'],b:['음료','drinks','饮料'],unit:['세트','sets','套']},
  {a:['출발 노선','outbound routes','去程路线'],b:['돌아오는 노선','return routes','返程路线'],unit:['가지','route pairs','种']}
];
const BOTH_POOL=[];
for(let c=0;c<BOTH_CONTEXTS.length;c++) for(let a=2;a<=15;a++) for(let b=2;b<=15;b++)
  BOTH_POOL.push({kind:'both',context:c,a,b,answer:a*b});

/* p.228의 한 줄 세우기. 중학교 범위에 맞춰 P 기호 대신 처음 자리부터
   선택지가 하나씩 줄어드는 곱으로 보인다. 4자리 numpad 범위만 남긴다. */
const LINEUP_POOL=[];
for(let n=3;n<=30;n++){
  for(let r=2;r<=Math.min(n,5);r++){
    const answer=product(n,r);
    if(answer<=9999) LINEUP_POOL.push({kind:r===n?'all':'selectLine',n,r,answer});
  }
  const all=factorial(n);
  if(n>=3&&all<=9999&&!LINEUP_POOL.some(function(x){return x.n===n&&x.r===n;}))
    LINEUP_POOL.push({kind:'all',n,r:n,answer:all});
}

/* p.230의 특정 자리 고정. 자리 자체가 문제 조건이므로 같은 n이라도
   고정 위치가 다르면 학습자에게 보이는 서로 다른 실제 과제다. */
const FIXED_POOL=[];
for(let n=4;n<=8;n++){
  for(let seat=1;seat<=n;seat++)
    FIXED_POOL.push({kind:'oneFixed',n,seats:[seat],answer:factorial(n-1)});
}
for(let n=4;n<=9;n++){
  for(let first=1;first<=n;first++) for(let second=1;second<=n;second++) if(first!==second)
    FIXED_POOL.push({kind:'twoFixed',n,seats:[first,second],answer:factorial(n-2)});
}
for(let n=4;n<=7;n++) FIXED_POOL.push({kind:'eitherAtFirst',n,answer:2*factorial(n-1)});
for(let n=4;n<=8;n++) FIXED_POOL.push({kind:'bothEnds',n,answer:2*factorial(n-2)});

function eventProblem(model){
  let condition,conditionEn,conditionZh,tex,rule;
  if(model.kind==='atLeast'){
    condition=`${model.k} 이상`; conditionEn=`at least ${model.k}`; conditionZh=`不小于${model.k}`;
    tex=`1\\le x\\le ${model.n},\\quad x\\ge ${model.k}\\quad\\Rightarrow\\quad\\square\\text{가지}`;
    rule=`${model.n}-${model.k}+1`;
  }else if(model.kind==='atMost'){
    condition=`${model.k} 이하`; conditionEn=`at most ${model.k}`; conditionZh=`不大于${model.k}`;
    tex=`1\\le x\\le ${model.n},\\quad x\\le ${model.k}\\quad\\Rightarrow\\quad\\square\\text{가지}`;
    rule=String(model.k);
  }else if(model.kind==='multiple'){
    condition=`${model.d}의 배수`; conditionEn=`a multiple of ${model.d}`; conditionZh=`${model.d}的倍数`;
    tex=`1\\le x\\le ${model.n},\\quad ${model.d}\\mid x\\quad\\Rightarrow\\quad\\square\\text{가지}`;
    rule=`\\left\\lfloor\\dfrac{${model.n}}{${model.d}}\\right\\rfloor`;
  }else{
    const odd=model.kind==='odd';
    condition=odd?'홀수':'짝수'; conditionEn=odd?'odd':'even'; conditionZh=odd?'奇数':'偶数';
    tex=`1\\le x\\le ${model.n},\\quad x\\text{는 ${condition}}\\quad\\Rightarrow\\quad\\square\\text{가지}`;
    rule=odd?`\\left\\lceil\\dfrac{${model.n}}2\\right\\rceil`:`\\left\\lfloor\\dfrac{${model.n}}2\\right\\rfloor`;
  }
  return baseProblem(
    L3(`1부터 ${model.n}까지 적힌 카드에서 ${condition}인 카드를 한 장 고를 때, 가능한 결과의 수를 구합니다.`,
      `Choose one card numbered 1 through ${model.n}. Count the possible results that are ${conditionEn}.`,
      `从写有1到${model.n}的卡片中选一张，求${conditionZh}的结果数。`),
    tex,model.answer,
    [{tex:`\\text{조건에 맞는 결과를 빠짐없이 센다}`},{tex:`${rule}=\\square`,blank:model.answer}],model
  );
}

function eitherProblem(model){
  const c=EITHER_CONTEXTS[model.context],a=c.a,b=c.b,u=c.unit;
  const story=L3(`${a[0]} ${model.a}${u[0]}와 ${b[0]} ${model.b}${u[0]} 중에서 하나만 고릅니다.`,
    `Choose exactly one from ${model.a} ${a[1]} or ${model.b} ${b[1]}.`,
    `从${model.a}${u[2]}${a[2]}或${model.b}${u[2]}${b[2]}中只选一个。`);
  const ask=L3('두 사건은 겹치지 않습니다. 고르는 방법은 모두 몇 가지입니까?',
    'The two cases do not overlap. How many choices are there?',
    '两种情况不重叠，共有多少种选法？');
  return wordProblem(story,ask,`${model.a}+${model.b}=\\square`,model.answer,
    [{tex:'\\text{겹치지 않는 A 또는 B는 더한다}'},{tex:`${model.a}+${model.b}=\\square`,blank:model.answer}],model);
}

function bothProblem(model){
  const c=BOTH_CONTEXTS[model.context],a=c.a,b=c.b,u=c.unit;
  const story=c.route
    ?L3(`A에서 B로 가는 길이 ${model.a}가지, B에서 C로 가는 길이 ${model.b}가지입니다.`,
      `There are ${model.a} routes from A to B and ${model.b} routes from B to C.`,
      `从A到B有${model.a}条路，从B到C有${model.b}条路。`)
    :L3(`${a[0]} ${model.a}가지와 ${b[0]} ${model.b}가지에서 각각 하나씩 고릅니다.`,
      `Choose one of ${model.a} ${a[1]} and one of ${model.b} ${b[1]}.`,
      `从${model.a}种${a[2]}和${model.b}种${b[2]}中各选一个。`);
  const ask=L3(`두 단계를 모두 거치는 방법은 몇 ${u[0]}입니까?`,
    `How many ${u[1]} complete both stages?`,
    `完成两个步骤共有多少${u[2]}？`);
  return wordProblem(story,ask,`${model.a}\\times${model.b}=\\square`,model.answer,
    [{tex:'\\text{A 다음 B처럼 두 단계를 모두 거치면 곱한다}'},{tex:`${model.a}\\times${model.b}=\\square`,blank:model.answer}],model);
}

function lineupProblem(model){
  const vals=factors(model.n,model.r),all=model.r===model.n;
  const story=all
    ?L3(`서로 다른 학생 ${model.n}명이 모두 한 줄로 섭니다.`,`All ${model.n} distinct students stand in one line.`,`${model.n}名不同的学生全部排成一列。`)
    :L3(`서로 다른 학생 ${model.n}명 중 ${model.r}명을 뽑아 한 줄로 섭니다.`,`Choose ${model.r} of ${model.n} distinct students and line them up.`,`从${model.n}名不同的学生中选${model.r}名排成一列。`);
  const ask=L3('줄을 세우는 방법은 몇 가지입니까?','How many lineups are possible?','共有多少种排法？');
  return wordProblem(story,ask,`${timesTex(vals)}=\\square`,model.answer,
    [{tex:`\\text{첫 자리부터 선택지는 }${vals.join(', ')}\\text{개}`},{tex:`${timesTex(vals)}=\\square`,blank:model.answer}],model);
}

function fixedProblem(model){
  let story,ask,fixedCount,multiplier=1;
  if(model.kind==='oneFixed'){
    fixedCount=1;
    story=L3(`서로 다른 학생 ${model.n}명이 한 줄로 설 때 A의 자리는 왼쪽에서 ${model.seats[0]}번째로 고정합니다.`,
      `${model.n} distinct students line up with A fixed in position ${model.seats[0]} from the left.`,
      `${model.n}名不同学生排成一列，A固定在从左数第${model.seats[0]}个位置。`);
  }else if(model.kind==='twoFixed'){
    fixedCount=2;
    story=L3(`서로 다른 학생 ${model.n}명이 한 줄로 설 때 A는 ${model.seats[0]}번째, B는 ${model.seats[1]}번째 자리에 고정합니다.`,
      `${model.n} distinct students line up with A fixed in position ${model.seats[0]} and B in position ${model.seats[1]}.`,
      `${model.n}名不同学生排成一列，A固定在第${model.seats[0]}位，B固定在第${model.seats[1]}位。`);
  }else if(model.kind==='eitherAtFirst'){
    fixedCount=1; multiplier=2;
    story=L3(`서로 다른 학생 ${model.n}명이 한 줄로 설 때 A 또는 B가 맨 앞에 섭니다.`,
      `${model.n} distinct students line up with either A or B in the first position.`,
      `${model.n}名不同学生排成一列，A或B站在最前面。`);
  }else{
    fixedCount=2; multiplier=2;
    story=L3(`서로 다른 학생 ${model.n}명이 한 줄로 설 때 A와 B가 양 끝에 섭니다.`,
      `${model.n} distinct students line up with A and B at the two ends.`,
      `${model.n}名不同学生排成一列，A和B站在两端。`);
  }
  ask=L3('조건을 만족하는 줄 세우기는 몇 가지입니까?','How many lineups satisfy the condition?','满足条件的排法有多少种？');
  const free=model.n-fixedCount,vals=factors(free,free);
  const prefix=multiplier===2?'2\\times':'';
  return wordProblem(story,ask,`${prefix}${timesTex(vals)}=\\square`,model.answer,
    [{tex:`\\text{고정한 뒤 남은 빈자리 }${free}\\text{개}`},{tex:`${prefix}${timesTex(vals)}=\\square`,blank:model.answer}],model);
}

NM_TGEN.md88_countingCases=function(params,rng){
  const mode=(params&&params.mode)||'eventCount';
  let pool,make;
  if(mode==='eventCount'){pool=EVENT_POOL;make=eventProblem;}
  else if(mode==='either'){pool=EITHER_POOL;make=eitherProblem;}
  else if(mode==='both'){pool=BOTH_POOL;make=bothProblem;}
  else if(mode==='lineup'){pool=LINEUP_POOL;make=lineupProblem;}
  else if(mode==='fixedSeat'){pool=FIXED_POOL;make=fixedProblem;}
  else throw new RangeError('MD88 unknown mode: '+mode);
  const model=pick(rng,pool);
  const problem=make(model);
  problem.countingModel=Object.freeze(Object.assign({mode,poolSize:pool.length},model));
  return problem;
};

if(typeof module!=='undefined'&&module.exports)module.exports=NM_TGEN;
})();
