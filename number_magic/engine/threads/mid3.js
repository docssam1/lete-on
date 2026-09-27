/* ============================================================
   Numbers of Magic — MD15~20(중등 W10 · 중3 제곱근과 다항식의 곱셈)
   스레드 생성기. 근거: MASTER-ROADMAP.md §5(중3 W10) — 2022 개정
   교육과정 중3 '제곱근과 실수'·'다항식의 곱셈과 인수분해' 성취기준
   범위의 표준 연산 유형을 자체 설계(교과서 문장 인용 없음).
   engine/threads/mid2.js(W9, MD10~14)에 이어지는 번호.
   계약: NM_TGEN[genKey] = function(params, rng) { return problem; }
   절대 Math.random() 사용 금지 — R(rng,a,b) / pick(rng,arr)만.
   답 환원 원칙(MASTER-ROADMAP §7): 4√3 같은 근호식은 [계수,근호안]
   두 정수로, 분모의 유리화는 [분자근호안,분모] 두 정수로 받는다 —
   수식 문자열 파서는 절대 쓰지 않는다.
   다칸 답 tex 규약: mid2.js와 동일 — 이어지는 항은 "+\square"로
   통일, 음수는 numpad − 키로 직접 입력(problem.negative로 노출).
   ============================================================ */
(function(){
'use strict';

const { R, pick } = NM_RNG;

/* ── 공용 헬퍼 ── */
function nzInt(rng, lo, hi){ return R(rng, lo, hi) * pick(rng, [1, -1]); }
function wrapPlus(n){ return n < 0 ? `- ${Math.abs(n)}` : `+ ${n}`; }
/* 계수 ±1 은 감춘다 — `+ 1x` 가 아니라 `+ x` (mid9.js 와 같은 규약) */
function wrapPlusCoef(n){ return n === 1 ? '+ ' : n === -1 ? '- ' : (n < 0 ? `- ${Math.abs(n)}` : `+ ${n}`); }
/* 음수만 괄호로 — 풀이 줄의 `-4 + -2` 를 `(-4) + (-2)` 로 */
function par(n){ return n < 0 ? `(${n})` : `${n}`; }
function gcd(a, b){ a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a || 1; }
function divisorsOf(n){
  n = Math.abs(n);
  const out = [];
  for (let k = 1; k <= n; k++) if (n % k === 0) out.push(k);
  return out;
}
/* 제곱수가 아닌 자연수 중 "소인수 제곱이 하나도 없는" 수 — 근호가
   더 이상 안 줄어드는 상태(근호 정리의 도착점). */
function isSquareFree(n){
  for (let p = 2; p * p <= n; p++) if (n % (p * p) === 0) return false;
  return true;
}
/* N을 coeff·√rad 꼴로 완전히 정리(coeff²×rad=N, rad는 제곱인수 없음) */
function simplifyRadical(N){
  let coeff = 1, rad = N;
  for (let p = 2; p * p <= rad; p++) {
    while (rad % (p * p) === 0) { rad /= (p * p); coeff *= p; }
  }
  return { coeff, rad };
}
/* [lo,hi] 구간의 제곱인수 없는 수 목록(중복률 확보용 — 하드코딩 목록
   대신 범위로 만들어 풀을 넓힌다, 연산문제-감사.md §3 조치 방식 그대로) */
function squarefreeRange(lo, hi){
  const out = [];
  for (let n = lo; n <= hi; n++) if (isSquareFree(n)) out.push(n);
  return out;
}
const SQFREE_NARROW = squarefreeRange(2, 30);   /* MD16 basic·withCoeff, MD18 coef */
const SQFREE_WIDE = squarefreeRange(2, 120);    /* MD16 wide, MD18 plain */
const SQFREE_SMALL = squarefreeRange(2, 22);    /* MD18 messyDenom(분모 배수라 작게 유지) */
/* MD19 L5는 위의 검증된 2..30 제곱인수 없는 수를 그대로 쓴다.
   서로 다른 두 수를 a>b로 정규화하면 18C2=153쌍이다. 가까운 수끼리만
   묶던 이전 17쌍 풀을 넓히되, 범위·수의 성질·공식은 바꾸지 않는다. */
const MD19_RADICAL_PAIRS = [];
for (let ai = 1; ai < SQFREE_NARROW.length; ai++) {
  for (let bi = 0; bi < ai; bi++) MD19_RADICAL_PAIRS.push([SQFREE_NARROW[ai], SQFREE_NARROW[bi]]);
}
/* 레벨 개념에 이미 보여 준 (√3+√2)(√3−√2)는 연습 문항으로 다시
   내지 않는다. 전체 원천 풀 153쌍 중 152쌍이 실제 연습 후보다. */
const MD19_RADICAL_PRACTICE_PAIRS = MD19_RADICAL_PAIRS.filter(([a, b]) => a !== 3 || b !== 2);

/* MD15 L4~6 제곱근 대소 비교. 실수 근삿값(Math.sqrt/epsilon) 없이
   부호와 절댓값의 제곱을 유리수 교차곱으로 판정한다. 표시용 분수는
   약분 전 모양을 따로 보존해 √(8/2)=√4 같은 '다른 표기, 같은 값'도
   실제 연습 문항으로 낼 수 있다. */
function positiveGcd(a,b){ a=Math.abs(a); b=Math.abs(b); while(b){ [a,b]=[b,a%b]; } return a||1; }
function normalizedFraction(n,d){
  if(d===0) throw new RangeError('A comparison denominator cannot be zero.');
  if(d<0){ n=-n; d=-d; }
  const g=positiveGcd(n,d);
  return {n:n/g,d:d/g};
}
function comparisonTerm(kind,n,d,sign,display){
  const q=normalizedFraction(Math.abs(n),Math.abs(d||1));
  return {kind,n:q.n,d:q.d,sign:q.n===0?0:(sign<0?-1:1),display:display||null};
}
function rootTerm(n,d,sign,rawN,rawD){
  return comparisonTerm('root',n,d,sign,{kind:'root',n:rawN==null?n:rawN,d:rawD==null?(d||1):rawD});
}
function rationalTerm(n,d,sign,style,text){
  return comparisonTerm('rational',n,d,sign,{kind:style||((d||1)===1?'integer':'fraction'),text:text||null});
}
function fractionCmp(aN,aD,bN,bD){
  const left=aN*bD, right=bN*aD;
  return left===right?0:(left>right?1:-1);
}
function magnitudeSquare(term){
  return term.kind==='root'
    ? {n:term.n,d:term.d}
    : {n:term.n*term.n,d:term.d*term.d};
}
function compareExactTerms(left,right){
  if(left.sign!==right.sign) return left.sign>right.sign?1:-1;
  if(left.sign===0) return 0;
  const a=magnitudeSquare(left), b=magnitudeSquare(right);
  const mag=fractionCmp(a.n,a.d,b.n,b.d);
  return left.sign>0?mag:-mag;
}
function unsignedFractionTex(n,d){ return d===1?`${n}`:`\\dfrac{${n}}{${d}}`; }
function termTex(term){
  const sign=term.sign<0?'-':'';
  if(term.kind==='root'){
    const raw=term.display||{n:term.n,d:term.d};
    return `${sign}\\sqrt{${unsignedFractionTex(raw.n,raw.d)}}`;
  }
  if(term.display&&term.display.kind==='decimal') return `${sign}${term.display.text}`;
  return `${sign}${unsignedFractionTex(term.n,term.d)}`;
}
function squaredMagnitudeTex(term){
  const sq=magnitudeSquare(term);
  return unsignedFractionTex(sq.n,sq.d);
}
function relationFromCmp(cmp){ return cmp>0?'>':(cmp<0?'<':'='); }
function answerFromCmp(cmp){ return cmp>0?1:(cmp<0?3:2); }
function comparisonPairKey(left,right){ return `${termTex(left)}|${termTex(right)}`; }
function buildComparisonPools(){
  const positive=[], negative=[], mixed=[];
  const seen={positive:new Set(),negative:new Set(),mixed:new Set()};
  function add(target,seenSet,left,right){
    const key=comparisonPairKey(left,right);
    if(seenSet.has(key)) return;
    seenSet.add(key); target.push({left,right});
  }
  /* 양의 근호: 자연수 근호의 모든 서로 다른 순서쌍 + 분수 근호와
     값은 같지만 표기가 다른 동치쌍. */
  for(let a=2;a<=80;a++){
    for(let b=2;b<=80;b++) if(a!==b)
      add(positive,seen.positive,rootTerm(a,1,1),rootTerm(b,1,1));
    add(positive,seen.positive,rootTerm(a,1,1),rootTerm(a,1,1,a*2,2));
    add(positive,seen.positive,rootTerm(a,1,1,a*3,3),rootTerm(a,1,1));
  }
  for(let d=2;d<=9;d++) for(let n=1;n<=45;n++) if(positiveGcd(n,d)===1){
    const left=rootTerm(n,d,1);
    const right=rootTerm(n+d,d,1);
    add(positive,seen.positive,left,right);
    add(positive,seen.positive,right,left);
    add(positive,seen.positive,left,rootTerm(n,d,1,n*2,d*2));
  }
  /* 음의 근호는 같은 절댓값 풀을 부호만 바꾼다. 이때 대소 방향이
     반드시 뒤집히므로 양의 근호 규칙을 그대로 적용할 수 없다. */
  positive.forEach(({left,right})=>add(negative,seen.negative,
    Object.assign({},left,{sign:-1}),Object.assign({},right,{sign:-1})));

  /* 혼합: 유리수(정수·분수·유한소수)와 근호를 비교한다. 각 유리수 q에
     대해 q²의 바로 아래·같음·바로 위를 만들고 좌우·부호를 바꾸어
     >,=,<와 부호 우선 판정이 모두 넉넉히 나오게 한다. */
  const rationals=[];
  for(let d=1;d<=8;d++) for(let n=1;n<=32;n++) if(positiveGcd(n,d)===1)
    rationals.push(rationalTerm(n,d,1));
  for(let n=1;n<=49;n++) if(n%10!==0)
    rationals.push(rationalTerm(n,10,1,'decimal',(n/10).toFixed(1)));
  rationals.forEach((q,i)=>{
    const exactRoot=rootTerm(q.n*q.n,q.d*q.d,1);
    const lowerRoot=rootTerm(Math.max(1,q.n*q.n-1),q.d*q.d,1);
    const upperRoot=rootTerm(q.n*q.n+1,q.d*q.d,1);
    for(const r of [lowerRoot,exactRoot,upperRoot]){
      add(mixed,seen.mixed,q,r); add(mixed,seen.mixed,r,q);
      add(mixed,seen.mixed,Object.assign({},q,{sign:-1}),Object.assign({},r,{sign:-1}));
      add(mixed,seen.mixed,Object.assign({},r,{sign:-1}),Object.assign({},q,{sign:-1}));
    }
    /* 서로 다른 부호는 제곱 계산 전에 결정한다. */
    const far=rootTerm(((i%29)+2),1,-1);
    add(mixed,seen.mixed,q,far);
    add(mixed,seen.mixed,far,q);
  });
  return {comparePositive:positive,compareNegative:negative,compareMixed:mixed};
}
const MD15_COMPARISON_POOLS=buildComparisonPools();
function comparisonProblem(mode,pair,index,poolSize){
  const {left,right}=pair;
  const cmp=compareExactTerms(left,right), relation=relationFromCmp(cmp), answer=answerFromCmp(cmp);
  const leftTex=termTex(left), rightTex=termTex(right);
  const signsDiffer=left.sign!==right.sign;
  const negativePair=left.sign<0&&right.sign<0;
  const reasonKo=signsDiffer
    ? '부호가 다르므로 양수가 음수보다 큽니다'
    : `${negativePair?'두 수가 모두 음수이므로 절댓값의 제곱을 비교한 뒤 방향을 뒤집습니다':'두 수의 절댓값을 제곱해 정확히 비교합니다'}`;
  return {
    prompt:{
      ko:`${reasonKo}. ① 왼쪽이 큼 ② 같음 ③ 오른쪽이 큼 중 번호를 고르세요.`,
      en:'Compare exactly. Choose 1 if the left is greater, 2 if equal, or 3 if the right is greater.',
      zh:'准确比较。左边大选1，相等选2，右边大选3。'
    },
    tex:`${leftTex} \\; \\square \\; ${rightTex} \\quad (①>\\;②=\\;③<)`,
    answer, answerType:'number', widget:'numpad',
    completedTex:`${leftTex} ${relation} ${rightTex}`,
    answerRelationTex:`${answer}\\;(${leftTex} ${relation} ${rightTex})`,
    comparison:{
      mode,left:{kind:left.kind,n:left.n,d:left.d,sign:left.sign},
      right:{kind:right.kind,n:right.n,d:right.d,sign:right.sign},
      relation,poolIndex:index,poolSize
    },
    solution:[
      signsDiffer
        ? {tex:`${leftTex} ${relation} ${rightTex}\\quad(\\text{부호를 먼저 비교})`}
        : {tex:`|${leftTex}|^2=${squaredMagnitudeTex(left)},\\quad |${rightTex}|^2=${squaredMagnitudeTex(right)}`},
      {tex:`${leftTex} ${relation} ${rightTex}`},
      {tex:'\\text{선택 번호}=\\square',blank:answer}
    ]
  };
}

/* ── MD15 — 제곱근의 값 ──
   mode: 'perfect'(완전제곱수의 제곱근) · 'squareOfSqrt'((√a)²=a) ·
   'absValue'(√(a²)=|a|, a가 음수일 수 있음 — 결과는 항상 0 이상) ·
   'comparePositive' · 'compareNegative' · 'compareMixed'(정확 비교). */
NM_TGEN['md15_sqrtValue'] = function (params, rng) {
  const mode = params.mode || 'perfect';

  if(MD15_COMPARISON_POOLS[mode]){
    const pool=MD15_COMPARISON_POOLS[mode];
    const index=Math.floor(rng()*pool.length);
    return comparisonProblem(mode,pool[index],index,pool.length);
  }

  if (mode === 'perfect') {
    const k = R(rng, 2, 80);
    const N = k * k;
    return {
      prompt: {
        ko: `${N}가 어떤 수의 제곱인지 찾습니다 — 제곱해서 ${N}이 되는 수`,
        en: `Find the number whose square is ${N}`,
        zh: `找出平方等于${N}的数`
      },
      tex: `\\sqrt{${N}} = \\square`,
      answer: k, answerType: 'number', widget: 'numpad',
      /* 2026-09-20: 첫 줄에 답이 숫자로 박혀 있었다 — 제곱근을 찾는 것이 이 유형의 할 일인데
         그 수를 미리 알려 주고 있었다. 같은 관계를 빈칸으로 물어 탐색이 되게 한다. */
      solution: [
        { tex: `${N} = \\square \\times \\square`, blank: [k, k] },
        { tex: `\\sqrt{${N}} = \\square`, blank: k }
      ]
    };
  }

  if (mode === 'squareOfSqrt') {
    const a = R(rng, 2, 200);
    return {
      prompt: {
        ko: `제곱근을 다시 제곱하면 근호가 사라지고 원래 수로 돌아갑니다`,
        en: `Squaring a square root cancels the root and returns the original number`,
        zh: `平方根再平方，根号消失，回到原来的数`
      },
      tex: `(\\sqrt{${a}})^2 = \\square`,
      answer: a, answerType: 'number', widget: 'numpad',
      solution: [
        { tex: `\\sqrt{${a}} \\times \\sqrt{${a}} = ${a}` },
        { tex: `(\\sqrt{${a}})^2 = \\square`, blank: a }
      ]
    };
  }

  /* absValue — √(a²) = |a|, a는 음수일 수 있다 */
  const a = nzInt(rng, 2, 40);
  return {
    prompt: {
      ko: `${a}의 제곱을 다시 제곱근으로 풀면 절댓값 |${a}|이 나옵니다 — 결과는 항상 0 이상입니다`,
      en: `The square root of ${a}² gives the absolute value |${a}| — the result is always nonnegative`,
      zh: `${a}的平方再开方，结果是绝对值|${a}|——结果永远不小于0`
    },
    tex: `\\sqrt{(${a})^2} = \\square`,
    answer: Math.abs(a), answerType: 'number', widget: 'numpad',
    solution: [
      { tex: `\\sqrt{(${a})^2} = |${a}|` },
      { tex: `|${a}| = \\square`, blank: Math.abs(a) }
    ]
  };
};

/* ── MD16 — 근호의 정리 (√48 = 4√3) ──
   N=a²×b(b는 제곱인수 없는 수)로 두고 답은 [계수 a, 근호 안 b].
   discover에서 이 "숨은 짝(같은 소인수 두 번)을 찾아 밖으로 꺼내는"
   감각을 계보1 '2와 5는 친구'(소인수를 짝지어 보는 습관)와 이어
   붙인다(lineage:['ten-friends'] — 짝을 찾아 밖으로 꺼낸다는 동작
   자체가 같은 계보의 다음 진화라는 판단, MASTER-ROADMAP 작업지시).
   mode: 'basic'(연습) · 'wide'(실전, 더 큰 수) · 'withCoeff'(이미
   계수가 있는 근호, 5√48=20√3처럼 계수끼리도 곱함). */
NM_TGEN['md16_simplifyRadical'] = function (params, rng) {
  const mode = params.mode || 'basic';

  if (mode === 'wide') {
    const a = R(rng, 2, 12), b = pick(rng, SQFREE_WIDE);
    const N = a * a * b;
    return {
      prompt: {
        ko: `근호 안의 수에서 완전제곱수를 찾아 밖으로 꺼냅니다`,
        en: `Find the perfect-square factor inside the root and pull it out`,
        zh: `在根号内找出完全平方因数，把它提到根号外`
      },
      tex: `\\sqrt{${N}} = \\square\\sqrt{\\square}`,
      answer: [a, b], answerType: 'number', widget: 'numpad',
      solution: [
        { tex: `${N} = ${a}^2 \\times ${b}` },
        { tex: `\\sqrt{${N}} = \\square\\sqrt{\\square}`, blank: [a, b] }
      ]
    };
  }

  if (mode === 'withCoeff') {
    const c = R(rng, 2, 6);
    const a = R(rng, 2, 9), b = pick(rng, SQFREE_NARROW);
    const N = a * a * b;
    return {
      prompt: {
        ko: `근호 앞에 이미 계수가 있어도 방법은 같습니다 — 밖으로 꺼낸 수를 원래 계수와 곱합니다`,
        en: `Even with a coefficient already outside, the method is the same — multiply it by what you pull out`,
        zh: `根号前已有系数也一样——把提出来的数和原来的系数相乘`
      },
      tex: `${c}\\sqrt{${N}} = \\square\\sqrt{\\square}`,
      answer: [c * a, b], answerType: 'number', widget: 'numpad',
      solution: [
        { tex: `${N} = ${a}^2 \\times ${b}` },
        { tex: `${c}\\sqrt{${N}} = ${c}\\times ${a}\\sqrt{${b}} = \\square\\sqrt{\\square}`, blank: [c * a, b] }
      ]
    };
  }

  /* basic — 연습 */
  const a = R(rng, 2, 9), b = pick(rng, SQFREE_NARROW);
  const N = a * a * b;
  return {
    prompt: {
      ko: `48 = 16×3처럼, 근호 안에서 같은 소인수가 두 번 만나면(짝) 밖으로 나올 수 있습니다 — 2와 5가 만나 10이 되던 것과 같은 이치입니다`,
      en: `Like 48 = 16×3, when the same prime factor appears twice (a pair) inside the root, it can step outside — the same idea as 2 and 5 meeting to make 10`,
      zh: `就像48=16×3，根号内同一个质因数出现两次(配对)就能提到根号外——和2与5相遇变成10是同一个道理`
    },
    tex: `\\sqrt{${N}} = \\square\\sqrt{\\square}`,
    answer: [a, b], answerType: 'number', widget: 'numpad',
    solution: [
      { tex: `${N} = ${a}^2 \\times ${b}` },
      { tex: `\\sqrt{${N}} = \\square\\sqrt{\\square}`, blank: [a, b] }
    ]
  };
};

/* ── MD17 — 제곱근의 곱셈과 나눗셈 ──
   mode: 'mul'(정수로 떨어짐) · 'div'(정수로 떨어짐) · 'mixed'(완전
   제곱수가 안 되어 근호가 남음 — MD16의 정리 감각을 재사용). */
NM_TGEN['md17_sqrtMulDiv'] = function (params, rng) {
  const mode = params.mode || 'mul';

  if (mode === 'mul') {
    const k = R(rng, 3, 30);
    const N = k * k;
    const divs = divisorsOf(N).filter(d => d > 1 && d < N);
    const a = divs.length ? pick(rng, divs) : N;
    const b = N / a;
    return {
      prompt: {
        ko: `√a × √b = √(ab) — 근호 안을 먼저 곱한 뒤 정리합니다`,
        en: `√a × √b = √(ab) — multiply what's under the roots first, then simplify`,
        zh: `√a × √b = √(ab)——先把根号内的数相乘，再化简`
      },
      tex: `\\sqrt{${a}} \\times \\sqrt{${b}} = \\sqrt{\\square} = \\square`,
      /* 빈칸 둘(근호 안·값)인데 답이 뒷칸 하나였다 — 정답지에 근호 안 수가 없었다(2026-09-20). */
      answer: [N, k], answerType: 'steps', widget: 'steps',
      steps: [
        { tex: `\\sqrt{${a}} \\times \\sqrt{${b}} = \\sqrt{\\square}`, blank: N },
        { tex: `\\sqrt{${N}} = \\square`, blank: k }
      ],
      solution: [
        { tex: `\\sqrt{${a}} \\times \\sqrt{${b}} = \\sqrt{\\square}`, blank: N },
        { tex: `\\sqrt{${N}} = \\square`, blank: k },
        /* 마지막 줄은 문항식과 같은 꼴 — 답 [근호 안, 값] 두 칸을 함께 보여 준다
           (check-solution-steps 는 마지막 blank 가 answer 와 같기를 요구한다). */
        { tex: `\\sqrt{${a}} \\times \\sqrt{${b}} = \\sqrt{\\square} = \\square`, blank: [N, k] }
      ]
    };
  }

  if (mode === 'div') {
    const k = R(rng, 2, 12);
    const b = R(rng, 2, 9);
    const a = k * k * b;
    return {
      prompt: {
        ko: `√a ÷ √b = √(a÷b) — 근호 안을 먼저 나눈 뒤 정리합니다`,
        en: `√a ÷ √b = √(a÷b) — divide what's under the roots first, then simplify`,
        zh: `√a ÷ √b = √(a÷b)——先把根号内的数相除，再化简`
      },
      tex: `\\sqrt{${a}} \\div \\sqrt{${b}} = \\sqrt{\\square} = \\square`,
      answer: [k * k, k], answerType: 'steps', widget: 'steps',
      steps: [
        { tex: `\\sqrt{${a}} \\div \\sqrt{${b}} = \\sqrt{\\square}`, blank: k * k },
        { tex: `\\sqrt{${k * k}} = \\square`, blank: k }
      ],
      solution: [
        { tex: `\\sqrt{${a}} \\div \\sqrt{${b}} = \\sqrt{\\square}`, blank: k * k },
        { tex: `\\sqrt{${k * k}} = \\square`, blank: k },
        { tex: `\\sqrt{${a}} \\div \\sqrt{${b}} = \\sqrt{\\square} = \\square`, blank: [k * k, k] }
      ]
    };
  }

  /* mixed — 곱해도 완전제곱수가 안 되어 근호가 남는 경우 */
  let a, b, N, simp;
  let tries = 0;
  do {
    a = R(rng, 2, 18); b = R(rng, 2, 18);
    N = a * b;
    simp = simplifyRadical(N);
    tries++;
  } while ((simp.rad === 1 || simp.coeff === 1) && tries < 200);
  return {
    prompt: {
      ko: `곱해도 완전제곱수가 안 되면, 곱한 뒤 근호를 정리합니다`,
      en: `If the product isn't a perfect square, multiply first, then simplify the radical`,
      zh: `相乘后若不是完全平方数，就先相乘再化简根号`
    },
    tex: `\\sqrt{${a}} \\times \\sqrt{${b}} = \\square\\sqrt{\\square}`,
    answer: [simp.coeff, simp.rad], answerType: 'number', widget: 'numpad',
    solution: [
      { tex: `\\sqrt{${a}} \\times \\sqrt{${b}} = \\sqrt{${N}}` },
      { tex: `\\sqrt{${N}} = \\square\\sqrt{\\square}`, blank: [simp.coeff, simp.rad] }
    ]
  };
};

/* ── MD18 — 분모의 유리화 ──
   답은 [분자근호안, 분모] 다칸(항상 근호가 √b/b 꼴이 되는 형태로
   맞춘다 — 분자의 계수는 항상 1이라 blank 대상이 아니다). mode:
   'plain'(1/√n) · 'coef'(c/√n, c는 n과 서로소라 더 못 줄어듦) ·
   'messyDenom'(분모의 근호 자체가 먼저 정리돼야 하는 경우, MD16 연계). */
NM_TGEN['md18_rationalize'] = function (params, rng) {
  const lv = params.level || 'plain';

  if (lv === 'plain') {
    const n = pick(rng, SQFREE_WIDE);
    return {
      prompt: {
        ko: `분모의 근호를 없애려면 분자·분모에 같은 근호를 곱합니다`,
        en: `To remove the root from the denominator, multiply top and bottom by the same root`,
        zh: `要去掉分母的根号，就把分子分母同乘一个相同的根号`
      },
      tex: `\\dfrac{1}{\\sqrt{${n}}} = \\dfrac{\\sqrt{\\square}}{\\square}`,
      answer: [n, n], answerShape: 'radicalFraction', answerType: 'number', widget: 'numpad',
      solution: [
        { tex: `\\dfrac{1}{\\sqrt{${n}}} = \\dfrac{1\\times\\sqrt{${n}}}{\\sqrt{${n}}\\times\\sqrt{${n}}}` },
        { tex: `= \\dfrac{\\sqrt{\\square}}{\\square}`, blank: [n, n] }
      ]
    };
  }

  if (lv === 'coef') {
    const n = pick(rng, SQFREE_NARROW);
    let c; do { c = R(rng, 2, 12); } while (gcd(c, n) !== 1);
    return {
      prompt: {
        ko: `분자에 계수가 있어도 방법은 같습니다 — 분모의 근호를 분자·분모에 곱합니다`,
        en: `Even with a numerator coefficient, the method is the same — multiply by the denominator's root`,
        zh: `分子有系数也一样——把分母的根号乘到分子分母上`
      },
      tex: `\\dfrac{${c}}{\\sqrt{${n}}} = \\dfrac{${c}\\sqrt{\\square}}{\\square}`,
      answer: [n, n], answerShape: 'radicalFraction', answerType: 'number', widget: 'numpad',
      solution: [
        { tex: `\\dfrac{${c}}{\\sqrt{${n}}} = \\dfrac{${c}\\times\\sqrt{${n}}}{\\sqrt{${n}}\\times\\sqrt{${n}}}` },
        { tex: `= \\dfrac{${c}\\sqrt{\\square}}{\\square}`, blank: [n, n] }
      ]
    };
  }

  /* messyDenom — 분모의 근호 자체가 정리부터 필요한 경우 */
  let a, b, N;
  do { a = R(rng, 2, 11); b = pick(rng, SQFREE_SMALL); N = a * a * b; } while (N > 500);
  return {
    prompt: {
      ko: `먼저 분모의 근호부터 정리(√${N}=${a}√${b})하고, 그다음 분자·분모에 √${b}를 곱해 유리화합니다`,
      en: `First simplify the denominator's root (√${N}=${a}√${b}), then multiply top and bottom by √${b} to rationalize`,
      zh: `先化简分母的根号(√${N}=${a}√${b})，再用√${b}乘分子分母进行有理化`
    },
    tex: `\\dfrac{1}{\\sqrt{${N}}} = \\dfrac{1}{${a}\\sqrt{${b}}} = \\dfrac{\\sqrt{\\square}}{\\square}`,
    answer: [b, a * b], answerShape: 'radicalFraction', answerType: 'number', widget: 'numpad',
    solution: [
      { tex: `\\sqrt{${N}} = ${a}\\sqrt{${b}}` },
      { tex: `\\dfrac{1}{${a}\\sqrt{${b}}} = \\dfrac{1\\times\\sqrt{${b}}}{${a}\\sqrt{${b}}\\times\\sqrt{${b}}}` },
      { tex: `= \\dfrac{\\sqrt{\\square}}{\\square}`, blank: [b, a * b] }
    ]
  };
};

/* ── MD19 — 곱셈공식의 전개 ──
   lineage: 계보4 '무지개 덧셈법'의 종착(과정-로드맵.md §6 — 무지개
   덧셈법 → 차가 2인 두 수의 곱 → 평균값 곱셈 → 합차공식으로 자란
   줄기의 마지막 걸음). mode: 'twoFactors'((x+a)(x+b)=x²+□x+□, 답
   [a+b,ab]) · 'square'((x+a)²=x²+□x+□, 답[2a,a²]) · 'diffSquares'
   ((x+a)(x-a)=x²-□, 답 a², 계보4가 이름 그대로 완성되는 지점). */
NM_TGEN['md19_expandFormula'] = function (params, rng) {
  const mode = params.mode || 'twoFactors';

  if (mode === 'twoFactors') {
    const a = nzInt(rng, 1, 9), b = nzInt(rng, 1, 9);
    return {
      prompt: {
        ko: `(x+a)(x+b) = x² + (a+b)x + ab — 두 수를 더하고, 곱합니다`,
        en: `(x+a)(x+b) = x² + (a+b)x + ab — add the two numbers, then multiply them`,
        zh: `(x+a)(x+b) = x² + (a+b)x + ab——先把两数相加，再相乘`
      },
      tex: `(x ${wrapPlus(a)})(x ${wrapPlus(b)}) = x^2 + \\square x + \\square`,
      answer: [a + b, a * b], answerType: 'number', widget: 'numpad', negative: (a + b < 0) || (a * b < 0),
      solution: [
        { tex: `(x ${wrapPlus(a)})(x ${wrapPlus(b)}) = x^2 + (${a}+${b})x + (${a})(${b})` },
        { tex: `= x^2 + \\square x + \\square`, blank: [a + b, a * b] }
      ]
    };
  }

  if (mode === 'square') {
    const a = nzInt(rng, 1, 45);
    return {
      prompt: {
        ko: `(x+a)² = x² + 2ax + a² — 가운데 항은 2배, 마지막 항은 제곱입니다`,
        en: `(x+a)² = x² + 2ax + a² — double it for the middle term, square it for the last`,
        zh: `(x+a)² = x² + 2ax + a²——中间项翻倍，最后一项平方`
      },
      tex: `(x ${wrapPlus(a)})^2 = x^2 + \\square x + \\square`,
      answer: [2 * a, a * a], answerType: 'number', widget: 'numpad', negative: (2 * a < 0),
      solution: [
        { tex: `(x ${wrapPlus(a)})^2 = x^2 + 2(${a})x + (${a})^2` },
        { tex: `= x^2 + \\square x + \\square`, blank: [2 * a, a * a] }
      ]
    };
  }

  /* ── 2026-09-21 추가 — 곱셈공식의 활용(디딤돌 개념연산 중3-1A 대조, p.104~114) ──
     여기까지 세 레벨은 전부 "문자식을 전개하는 법"이었다. 원문 비교로 찾은 것은
     **공식을 도구로 쓰는 자리**가 하나도 없었다는 것 — 큰 수 계산·근호식 계산·
     분모의 유리화(켤레)·식의 변형·치환. 다섯 개를 순서대로 더한다. */

  /* numApplication — 곱셈 공식을 이용한 수의 계산: 99×101, 101²처럼 어림수
     기준(n)에서 ±k만큼 떨어진 두 수를 공식으로 계산한다. */
  if (mode === 'numApplication') {
    const n = pick(rng, [10, 20, 50, 100]);
    const k = R(rng, 1, 9);
    if (pick(rng, ['square', 'diff']) === 'square') {
      const v = pick(rng, [n - k, n + k]);
      const ans = v * v;
      return {
        prompt: { ko: `어림수 기준으로 (n±k)² = n²±2nk+k² 를 씁니다 — ${v}는 ${n}에서 ${Math.abs(v - n)}만큼 떨어져 있습니다`,
          en: `Use a round base: (n±k)² = n²±2nk+k² — ${v} is ${Math.abs(v - n)} away from ${n}`,
          zh: `用整数基准：(n±k)² = n²±2nk+k²——${v}离${n}差${Math.abs(v - n)}` },
        tex: `${v}^2 = \\square`,
        answer: ans, answerType: 'number', widget: 'numpad',
        solution: [
          { tex: `${v} = ${n} ${wrapPlus(v - n)}` },
          { tex: `(${n} ${wrapPlus(v - n)})^2 = ${n}^2 ${wrapPlus(2 * n * (v - n))} + ${(v - n) * (v - n)}` },
          { tex: `= \\square`, blank: ans }
        ]
      };
    }
    const lo = n - k, hi = n + k;
    const ans = lo * hi;
    return {
      prompt: { ko: `(n-k)(n+k) = n²-k² — 두 수를 어림수 기준의 ±k로 봅니다`,
        en: `(n-k)(n+k) = n²-k² — see both numbers as a round base ±k`,
        zh: `(n-k)(n+k) = n²-k²——把两数看成整数基准±k` },
      tex: `${lo} \\times ${hi} = \\square`,
      answer: ans, answerType: 'number', widget: 'numpad',
      solution: [
        { tex: `${lo} = ${n} - ${k}, \\quad ${hi} = ${n} + ${k}` },
        { tex: `(${n})^2 - (${k})^2 = ${n * n} - ${k * k}` },
        { tex: `= \\square`, blank: ans }
      ]
    };
  }

  /* radicalApplication — 곱셈 공식을 이용한 근호를 포함한 식의 계산.
     (√a+√b)(√a-√b)=a-b 만 다룬다(첫 판): (√a+√b)² 같은 전개는 결과가
     "정수+근호" 두 갈래라 지금 있는 answerShape(coeffRadical 등)로는
     정수 부분을 얹을 자리가 없다 — 억지로 끼워 맞추지 않고 다음 판 과제로
     남긴다(주석에 남겨 둔다: 정수+계수근호 두 부분 답 모양이 새로 필요). */
  if (mode === 'radicalApplication') {
    const [a, b] = pick(rng, MD19_RADICAL_PRACTICE_PAIRS);   /* a > b, 서로 다름 */
    const ans = a - b;
    return {
      prompt: { ko: `(√a+√b)(√a-√b) = a-b — 합차공식과 같은 자리에서 근호가 사라집니다`,
        en: `(√a+√b)(√a-√b) = a-b — the roots vanish in the same spot as the difference of squares`,
        zh: `(√a+√b)(√a-√b) = a-b——和平方差公式同一个位置，根号消失` },
      tex: `(\\sqrt{${a}} + \\sqrt{${b}})(\\sqrt{${a}} - \\sqrt{${b}}) = \\square`,
      answer: ans, answerType: 'number', widget: 'numpad',
      solution: [
        { tex: `(\\sqrt{${a}})^2 - (\\sqrt{${b}})^2 = ${a} - ${b}` },
        { tex: `= \\square`, blank: ans }
      ]
    };
  }

  /* rationalizeConjugate — 곱셈 공식을 이용한 분모의 유리화: 분모가 두 근호의
     합/차일 때 켤레(부호만 반대인 식)를 분자·분모에 곱해 (a-b)를 만든다.
     MD18은 분모가 근호 하나뿐이라 이 켤레 유형이 없었다. */
  if (mode === 'rationalizeConjugate') {
    const idx1 = R(rng, 0, SQFREE_NARROW.length - 2);
    const a = SQFREE_NARROW[idx1 + 1], b = SQFREE_NARROW[idx1];
    const denom = a - b;
    const op1 = pick(rng, ['+', '-']);
    const op2 = op1 === '+' ? '-' : '+';
    return {
      prompt: { ko: `분모가 두 근호의 합(또는 차)이면 부호만 반대인 켤레를 분자·분모에 곱합니다 — (a+b)(a-b)=a²-b² 이 분모의 근호를 없앱니다`,
        en: `When the denominator is a sum (or difference) of two roots, multiply by the conjugate (opposite sign) — (a+b)(a-b)=a²-b² clears the root`,
        zh: `分母是两个根号的和(或差)时，就乘以符号相反的共轭式——(a+b)(a-b)=a²-b²能去掉分母的根号` },
      /* 분수 안 \square 가 하나뿐이면(분모만) 인쇄 폭 계산이 분수선에 붙는다
         (2026-09-21 check-print 로 발견) — MD18과 같이 분자의 근호 안 수도
         함께 물어 늘 2칸 이상으로 맞춘다(어차피 문제에 이미 나온 수라 답은
         베끼는 것과 같지만, 렌더링 규약을 지키는 쪽이 우선이다). */
      tex: `\\dfrac{1}{\\sqrt{${a}} ${op1} \\sqrt{${b}}} = \\dfrac{\\sqrt{\\square} ${op2} \\sqrt{\\square}}{\\square}`,
      answer: [a, b, Math.abs(denom)], answerType: 'number', widget: 'numpad',
      solution: [
        { tex: `\\dfrac{1}{\\sqrt{${a}} ${op1} \\sqrt{${b}}} \\times \\dfrac{\\sqrt{${a}} ${op2} \\sqrt{${b}}}{\\sqrt{${a}} ${op2} \\sqrt{${b}}}` },
        { tex: `= \\dfrac{\\sqrt{${a}} ${op2} \\sqrt{${b}}}{(${a}) - (${b})}` },
        { tex: `= \\dfrac{\\sqrt{\\square} ${op2} \\sqrt{\\square}}{\\square}`, blank: [a, b, Math.abs(denom)] }
      ]
    };
  }

  /* formulaVariant — 곱셈 공식의 변형: a+b, ab를 알 때 a²+b² = (a+b)²-2ab.
     실제 a,b를 먼저 고르고 합·곱을 역산하므로 항상 정수로 맞아떨어진다. */
  if (mode === 'formulaVariant') {
    const av = nzInt(rng, 1, 9), bv = nzInt(rng, 1, 9);
    const S = av + bv, P = av * bv;
    const ans = av * av + bv * bv;
    return {
      prompt: { ko: `a²+b² 는 (a+b)²-2ab 로 바꿔 구합니다 — 곱셈공식을 이항해서 만든 변형식입니다`,
        en: `a²+b² becomes (a+b)²-2ab — a variant made by rearranging the multiplication formula`,
        zh: `a²+b²可以改写成(a+b)²-2ab——把乘法公式移项得到的变形式` },
      tex: `a + b = ${S}, \\quad ab = ${P} \\quad\\Rightarrow\\quad a^2 + b^2 = \\square`,
      answer: ans, answerType: 'number', widget: 'numpad',
      solution: [
        { tex: `a^2+b^2 = (a+b)^2 - 2ab = ${par(S)}^2 - 2(${P})` },
        { tex: `= ${S * S} - ${2 * P} = \\square`, blank: ans }
      ]
    };
  }

  /* substitutionExpand — 복잡한 식의 전개(치환): 공통부분 x+y를 A로 치환하면
     지금까지 배운 (A+a)(A+b)=A²+(a+b)A+ab 와 똑같은 손동작이 된다. */
  if (mode === 'substitutionExpand') {
    const a = nzInt(rng, 1, 9), b = nzInt(rng, 1, 9);
    return {
      prompt: { ko: `공통부분 x+y를 한 문자 A로 치환하면 (A+a)(A+b) 꼴이 됩니다 — 지금까지 하던 방법 그대로 두 수를 더하고 곱합니다`,
        en: `Substitute the common part x+y with a single letter A, giving (A+a)(A+b) — the same add-then-multiply move as before`,
        zh: `把公共部分x+y换成一个字母A，就成了(A+a)(A+b)——还是先前学过的先加后乘` },
      tex: `(x+y ${wrapPlus(a)})(x+y ${wrapPlus(b)}) = (x+y)^2 + \\square (x+y) + \\square`,
      answer: [a + b, a * b], answerType: 'number', widget: 'numpad', negative: (a + b < 0) || (a * b < 0),
      solution: [
        { tex: `A = x+y \\quad\\Rightarrow\\quad (A ${wrapPlus(a)})(A ${wrapPlus(b)}) = A^2 + (${a}+${b})A + (${a})(${b})` },
        { tex: `= (x+y)^2 + \\square (x+y) + \\square`, blank: [a + b, a * b] }
      ]
    };
  }

  /* diffSquares — 합차공식(계보4 종착): (x+a)(x-a)=x²-a² */
  const a = R(rng, 1, 70);
  return {
    prompt: {
      ko: `(x+a)(x-a) = x² - a² — 가운데 항끼리 사라지고 제곱의 차만 남습니다`,
      en: `(x+a)(x-a) = x² - a² — the middle terms cancel out, leaving only the difference of squares`,
      zh: `(x+a)(x-a) = x² - a²——中间项互相抵消，只剩平方差`
    },
    tex: `(x + ${a})(x - ${a}) = x^2 - \\square`,
    answer: a * a, answerType: 'number', widget: 'numpad',
    solution: [
      { tex: `(x + ${a})(x - ${a}) = x^2 - (${a})^2` },
      { tex: `= x^2 - \\square`, blank: a * a }
    ]
  };
};

/* ── MD20 — 인수분해 기초 ──
   x²+bx+c = (x+p)(x+q)에서 p+q=b, pq=c를 만족하는 p,q를 찾는다.
   두 수의 순서는 곱셈공식(MD19)과 달리 뒤집어도 값이 같은 표현이라
   채점이 순서에 흔들리면 안 된다 — 이 생성기가 항상 p≤q로 정렬해
   내보내고(정렬 규약), 프롬프트도 "작은 수부터"를 명시해 입력 순서를
   고정한다. mode: 'positive'(연습, b·c 모두 양수) · 'mixed'(실전,
   음수 섞임). */
NM_TGEN['md20_factorBasic'] = function (params, rng) {
  const lv = params.level || 'positive';
  const mode = params.mode || null;

  /* ── 2026-09-21 추가: 곱셈공식 세 꼴의 나머지 두 개와, 계수가 1이 아닌 식 ──
     바로 앞 MD19(전개)는 (x+a)(x+b)·(x+a)²·합차 **세 꼴**을 가르치는데 그 역방향인
     이 생성기는 (x+p)(x+q) **한 꼴만** 만들고 있었다. 거꾸로 읽기를 가르쳐 놓고
     거꾸로 읽을 거리를 하나만 준 셈이다. 기적의 중학연산이 `07 인수분해` /
     `08 복잡한 식의 인수분해` 두 단원으로 나누는 자리이기도 하다. */

  /* 완전제곱식 — x²+2ax+a²=(x+a)². 마지막 항은 a²이라 늘 양수이므로 부호로 못 맞힌다:
     가운데 항이 마지막 항의 제곱근의 2배인지 **확인해야** 풀린다. */
  if (mode === 'square') {
    const a = nzInt(rng, 1, 20);
    return {
      prompt: {
        ko: `가운데 항이 마지막 항의 제곱근의 2배면 완전제곱식입니다 — (x+□)² 의 □를 찾습니다`,
        en: `If the middle term is twice the square root of the last, it is a perfect square — find □ in (x+□)²`,
        zh: `中间项是最后一项平方根的2倍时就是完全平方式——找出(x+□)²中的□`
      },
      tex: `x^2 ${wrapPlus(2 * a)}x + ${a * a} = (x + \\square)^2`,
      answer: a, answerType: 'number', widget: 'numpad', negative: a < 0,
      solution: [
        { tex: `${par(a)}^2 = ${a * a}, \\quad 2 \\times ${par(a)} = ${2 * a}` },
        { tex: `x^2 ${wrapPlus(2 * a)}x + ${a * a} = (x + \\square)^2`, blank: a }
      ]
    };
  }

  /* 합차 — x²−a²=(x+a)(x−a). 두 칸에 같은 수가 들어간다(프롬프트에 명시). */
  if (mode === 'diff') {
    const a = R(rng, 2, 30);
    return {
      prompt: {
        ko: `가운데 항이 없고 제곱의 차만 남았으면 합차로 갈라집니다 — 두 칸에 같은 수가 들어갑니다`,
        en: `No middle term and only a difference of squares — it splits into a sum and a difference. The same number goes in both boxes`,
        zh: `没有中间项、只剩平方差时就拆成和与差——两个空填同一个数`
      },
      tex: `x^2 - ${a * a} = (x + \\square)(x - \\square)`,
      answer: [a, a], answerType: 'number', widget: 'numpad', negative: false,
      solution: [
        { tex: `${a * a} = ${a}^2` },
        { tex: `x^2 - ${a * a} = (x + \\square)(x - \\square)`, blank: [a, a] }
      ]
    };
  }

  /* 공통인수 묶기 — ax²+a(p+q)x+apq = a(x+p)(x+q). 묶어낸 뒤는 레벨 1·2와 같은 손동작. */
  if (mode === 'common') {
    const g = pick(rng, [2, 3, 4, 5]);
    let p = nzInt(rng, 1, 7), q = nzInt(rng, 1, 7), guard = 0;
    while (p + q === 0 && guard++ < 20) q = nzInt(rng, 1, 7);
    if (p + q === 0) q = q + 1;                       /* x항 계수 0 은 식에 안 쓴다 */
    if (p > q) { const t = p; p = q; q = t; }
    const A = g, B = g * (p + q), C = g * p * q;
    return {
      prompt: {
        ko: `세 항에 공통인수가 있으면 먼저 묶어냅니다 — 묶어낸 수, 그다음 두 수를 작은 수부터 입력합니다`,
        en: `Pull out the common factor first, then enter it, followed by the two numbers, smaller one first`,
        zh: `三项有公因数时先提取——先填提取的数，再按从小到大填两个数`
      },
      tex: `${A}x^2 ${wrapPlusCoef(B)}x ${wrapPlus(C)} = \\square(x + \\square)(x + \\square)`,
      answer: [g, p, q], answerType: 'number', widget: 'numpad', negative: (p < 0) || (q < 0),
      solution: [
        { tex: `${A}x^2 ${wrapPlusCoef(B)}x ${wrapPlus(C)} = ${g}(x^2 ${wrapPlusCoef(p + q)}x ${wrapPlus(p * q)})` },
        { tex: `${par(p)} + ${par(q)} = ${p + q}, \\quad ${par(p)} \\times ${par(q)} = ${p * q}` },
        { tex: `${A}x^2 ${wrapPlusCoef(B)}x ${wrapPlus(C)} = \\square(x + \\square)(x + \\square)`, blank: [g, p, q] }
      ]
    };
  }

  /* 십자곱셈 — (mx+p)(x+q) = mx² + (mq+p)x + pq. 공통인수가 없으므로 묶어낼 수 없고,
     대각선으로 곱해 더해야 풀린다. m과 p가 서로소여야 첫 괄호가 더 쪼개지지 않는다. */
  if (mode === 'cross') {
    let m = 2, p = 1, q = 1, guard = 0;
    do {
      m = pick(rng, [2, 3, 5]);
      p = nzInt(rng, 1, 7);
      q = nzInt(rng, 1, 7);
    } while ((gcd(m, p) !== 1 || m * q + p === 0) && guard++ < 200);
    if (gcd(m, p) !== 1 || m * q + p === 0) { m = 2; p = 3; q = 1; }   /* 안전망: 2x²+5x+3 */
    const A = m, B = m * q + p, C = p * q;
    return {
      prompt: {
        ko: `공통인수가 없으면 대각선으로 곱해 더합니다 — 앞 괄호의 계수와 상수, 그다음 뒤 괄호의 상수를 입력합니다`,
        en: `With no common factor, cross-multiply and add — enter the first bracket's coefficient and constant, then the second bracket's constant`,
        zh: `没有公因数时就交叉相乘再相加——先填前括号的系数和常数，再填后括号的常数`
      },
      tex: `${A}x^2 ${wrapPlusCoef(B)}x ${wrapPlus(C)} = (\\square x + \\square)(x + \\square)`,
      answer: [m, p, q], answerType: 'number', widget: 'numpad', negative: (p < 0) || (q < 0),
      solution: [
        { tex: `${m} \\times ${par(q)} + ${par(p)} = ${B}, \\quad ${par(p)} \\times ${par(q)} = ${C}` },
        { tex: `${A}x^2 ${wrapPlusCoef(B)}x ${wrapPlus(C)} = (\\square x + \\square)(x + \\square)`, blank: [m, p, q] }
      ]
    };
  }

  let p, q;
  if (lv === 'positive') {
    p = R(rng, 1, 15); q = R(rng, 1, 15);
  } else {
    p = nzInt(rng, 1, 12); q = nzInt(rng, 1, 12);
  }
  if (p > q) { const t = p; p = q; q = t; }   /* 정렬 규약: 작은 수부터 */
  const b = p + q, c = p * q;
  return {
    prompt: {
      ko: `x² + bx + c = (x+p)(x+q)일 때, 더하면 b, 곱하면 c가 되는 두 수를 찾습니다 — 작은 수부터 순서대로 입력합니다`,
      en: `For x² + bx + c = (x+p)(x+q), find two numbers that add to b and multiply to c — enter the smaller one first`,
      zh: `x² + bx + c = (x+p)(x+q)时，找相加得b、相乘得c的两个数——先输入较小的那个`
    },
    tex: `x^2 ${wrapPlus(b)}x ${wrapPlus(c)} = (x + \\square)(x + \\square)`,
    answer: [p, q], answerType: 'number', widget: 'numpad', negative: (p < 0) || (q < 0),
    solution: [
      { tex: `${p} + ${q} = ${b}, \\;\\; ${p} \\times ${q} = ${c}` },
      { tex: `x^2 ${wrapPlus(b)}x ${wrapPlus(c)} = (x + \\square)(x + \\square)`, blank: [p, q] }
    ]
  };
};

/* ── MD83 — 제곱근의 덧셈과 뺄셈 ──
   2026-09-21 추가. 디딤돌 개념연산 중3-1A 대조(p.68~78)로 찾은 것: 중3-1 제곱근
   단원의 정확히 절반(덧셈·뺄셈)이 스레드 자체가 없었다 — 지금까지 MD15~18은
   "정리하는 법"만 가르치고 "더하거나 빼는 법"이 어디에도 없어 3√2+√2 같은 식이
   한 번도 안 나왔다. MD20 뒤에 번호를 잇지 않고 83을 쓰는 건 창의연산 새 계보
   번호와 안 겹치려는 것(MASTER-ROADMAP §5 — 중등 MD는 1~82로 이미 다 찼다).
   radicand는 대부분 서로 다른 소수만 골라 곱해서 안전하게 근호가 안 겹치도록
   한다(제곱인수가 우연히 생기면 "정리 전"인데 이미 정리된 것처럼 보인다).
   mode: 'sameRadicand'(기본, 근호 안이 같음) · 'simplifyThenCombine'(정리 후
   결합, ⑵ 핵심) · 'distribute'(분배법칙) · 'rationalizeMixed'(유리화 혼합) ·
   'threeTerm'(세 항 결합) · 'intFracPart'(무리수의 정수 부분·소수 부분). */
NM_TGEN['md83_radicalAddSub'] = function (params, rng) {
  const mode = params.mode || 'sameRadicand';
  const PRIMES = [2, 3, 5, 7, 11, 13];
  function distinctPrimes(n){
    const idxs = [];
    while (idxs.length < n) { const i = R(rng, 0, PRIMES.length - 1); if (!idxs.includes(i)) idxs.push(i); }
    return idxs.map(i => PRIMES[i]);
  }

  if (mode === 'sameRadicand') {
    const a = pick(rng, SQFREE_NARROW);
    const op = pick(rng, ['+', '-']);
    let m = R(rng, 3, 9), n = op === '-' ? R(rng, 1, m - 1) : R(rng, 1, 8);
    const coeff = op === '+' ? m + n : m - n;
    return {
      prompt: { ko: `근호 안의 수가 같으면 계수끼리만 더하거나 뺍니다 — 동류항을 정리하는 것과 같은 손동작입니다`,
        en: `When the number under the root is the same, only the coefficients add or subtract — the same move as combining like terms`,
        zh: `根号内的数相同时，只把系数相加或相减——和合并同类项是同一个动作` },
      tex: `${m}\\sqrt{${a}} ${op} ${n}\\sqrt{${a}} = \\square\\sqrt{${a}}`,
      answer: coeff, answerType: 'number', widget: 'numpad', negative: coeff < 0,
      solution: [
        { tex: `${m} ${op} ${n} = ${coeff}` },
        { tex: `\\square\\sqrt{${a}}`, blank: coeff }
      ]
    };
  }

  if (mode === 'simplifyThenCombine') {
    const b = pick(rng, SQFREE_NARROW.filter(x => x <= 12));
    const op = pick(rng, ['+', '-']);
    const p = R(rng, 2, 6), q = op === '-' ? R(rng, 1, p - 1) : R(rng, 2, 6);
    const N1 = p * p * b, N2 = q * q * b;
    const coeff = op === '+' ? p + q : p - q;
    return {
      prompt: { ko: `근호 안이 달라 보여도 먼저 정리하면 같아질 수 있습니다 — 정리부터 하고 그다음 더하거나 뺍니다`,
        en: `Even if they look different, simplifying first can reveal the same root — simplify, then add or subtract`,
        zh: `根号内看起来不同也可能化简后相同——先化简，再相加或相减` },
      tex: `\\sqrt{${N1}} ${op} \\sqrt{${N2}} = \\square\\sqrt{${b}}`,
      answer: coeff, answerType: 'number', widget: 'numpad', negative: coeff < 0,
      solution: [
        { tex: `\\sqrt{${N1}} = ${p}\\sqrt{${b}}, \\quad \\sqrt{${N2}} = ${q}\\sqrt{${b}}` },
        { tex: `${p} ${op} ${q} = ${coeff}` },
        { tex: `\\square\\sqrt{${b}}`, blank: coeff }
      ]
    };
  }

  if (mode === 'distribute') {
    const [a, b, c] = distinctPrimes(3);
    const op = pick(rng, ['+', '-']);
    const ab = a * b, ac = a * c;
    return {
      prompt: { ko: `√a(√b±√c) = √ab±√ac — 다항식의 분배법칙과 같은 자리입니다`,
        en: `√a(√b±√c) = √ab±√ac — the same spot as the distributive law for polynomials`,
        zh: `√a(√b±√c) = √ab±√ac——和多项式的分配律是同一个位置` },
      tex: `\\sqrt{${a}}(\\sqrt{${b}} ${op} \\sqrt{${c}}) = \\sqrt{\\square} ${op} \\sqrt{\\square}`,
      answer: [ab, ac], answerType: 'number', widget: 'numpad', negative: false,
      solution: [
        { tex: `\\sqrt{${a}} \\times \\sqrt{${b}} = \\sqrt{${ab}}, \\quad \\sqrt{${a}} \\times \\sqrt{${c}} = \\sqrt{${ac}}` },
        { tex: `\\sqrt{\\square} ${op} \\sqrt{\\square}`, blank: [ab, ac] }
      ]
    };
  }

  if (mode === 'rationalizeMixed') {
    const [a, b, c] = distinctPrimes(3);
    const op = pick(rng, ['+', '-']);
    const ac = a * c, bc = b * c;
    return {
      prompt: { ko: `분모에 근호가 있으면 먼저 유리화합니다 — 분자·분모에 분모의 근호를 곱한 뒤 정리합니다`,
        en: `If the denominator has a root, rationalize first — multiply top and bottom by that root, then simplify`,
        zh: `分母有根号时先有理化——分子分母同乘分母的根号，再化简` },
      tex: `\\dfrac{\\sqrt{${a}} ${op} \\sqrt{${b}}}{\\sqrt{${c}}} = \\dfrac{\\sqrt{\\square} ${op} \\sqrt{\\square}}{\\square}`,
      answer: [ac, bc, c], answerType: 'number', widget: 'numpad', negative: false,
      solution: [
        { tex: `\\dfrac{(\\sqrt{${a}} ${op} \\sqrt{${b}}) \\times \\sqrt{${c}}}{\\sqrt{${c}} \\times \\sqrt{${c}}}` },
        { tex: `= \\dfrac{\\sqrt{${ac}} ${op} \\sqrt{${bc}}}{${c}}` },
        { tex: `\\dfrac{\\sqrt{\\square} ${op} \\sqrt{\\square}}{\\square}`, blank: [ac, bc, c] }
      ]
    };
  }

  if (mode === 'threeTerm') {
    const a = pick(rng, SQFREE_NARROW);
    const m = R(rng, 4, 9), n = R(rng, 1, 6), l = R(rng, 1, 6);
    const op1 = pick(rng, ['+', '-']), op2 = pick(rng, ['+', '-']);
    const coeff = (op1 === '+' ? m + n : m - n) + (op2 === '+' ? l : -l);
    return {
      prompt: { ko: `근호 안의 수가 모두 같으면, 세 항이어도 계수끼리 순서대로 더하거나 뺍니다`,
        en: `When all three terms share the same root, combine the coefficients left to right, just as with two`,
        zh: `根号内的数都相同时，三项也一样从左到右把系数相加或相减` },
      tex: `${m}\\sqrt{${a}} ${op1} ${n}\\sqrt{${a}} ${op2} ${l}\\sqrt{${a}} = \\square\\sqrt{${a}}`,
      answer: coeff, answerType: 'number', widget: 'numpad', negative: coeff < 0,
      solution: [
        { tex: `${m} ${op1} ${n} ${op2} ${l} = ${coeff}` },
        { tex: `\\square\\sqrt{${a}}`, blank: coeff }
      ]
    };
  }

  /* intFracPart — 무리수의 정수 부분과 소수 부분. N을 완전제곱수 사이(k²<N<(k+1)²)로
     골라 √N이 항상 무리수가 되게 하고, 정수 부분(k, 즉 ⌊√N⌋)만 묻는다 — 소수 부분은
     "√N−k" 꼴로 답이 무리수라 숫자 칸에 못 받는다(§7 답 환원 원칙 그대로 적용). */
  const k = R(rng, 1, 9);
  const N = R(rng, k * k + 1, (k + 1) * (k + 1) - 1);
  return {
    prompt: { ko: `무리수는 정수 부분과 소수 부분으로 나뉩니다 — √${N}은 어느 두 정수 사이에 있는지부터 찾습니다`,
      en: `An irrational number splits into an integer part and a decimal part — first find which two integers √${N} sits between`,
      zh: `无理数可分为整数部分和小数部分——先找√${N}在哪两个整数之间` },
    tex: `\\sqrt{${N}}\\text{의 정수 부분} = \\square`,
    answer: k, answerType: 'number', widget: 'numpad',
    solution: [
      { tex: `${k}^2 = ${k * k} < ${N} < ${(k + 1) * (k + 1)} = (${k + 1})^2` },
      { tex: `${k} < \\sqrt{${N}} < ${k + 1}` },
      { tex: `\\square`, blank: k }
    ]
  };
};

if (typeof module !== 'undefined' && module.exports) module.exports = NM_TGEN;
})();
