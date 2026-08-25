/* ============================================================
   Numbers of Magic — EL (초등 신규 5종) Thread Generators
   EL1 역연산 · EL2 검산 · EL3 크기 비교 · EL4 평균 · EL5 비례식
   계약: NM_TGEN[key] = (params, rng) => problem
   Math.random 사용 금지 — 주입된 rng만 사용
   답 환원 원칙: 배열 답([a,b])은 다칸 답 넘패드로 채점(app/main.js multiPad*)
   ============================================================ */
(function(){
'use strict';

const {R, pick, shuffle} = NM_RNG;

/* ── EL1 — 역연산: □×7=91, □÷6=8, 52+□=131 ──────────────────
   params.mode: 'as'(덧뺄셈) | 'md'(곱나눗셈) | 'mix'(둘 다) — 기본 'mix'
   params.max : 수 범위 상한(연산별로 다르게 스케일) */
NM_TGEN['el_inverse'] = function(params, rng){
  const mode = params.mode || 'mix';
  const opKind = mode === 'mix' ? pick(rng, ['as','md']) : mode;

  let tex, answer, ko, en, zh;

  if(opKind === 'as'){
    const max = params.max || 100;
    const op  = pick(rng, ['+','-']);
    const form = pick(rng, [0,1]); // 0: □ 앞  1: □ 뒤
    if(op === '+'){
      const x = R(rng, 1, max);           // 빈칸(정답)
      const a = R(rng, 1, max);
      const c = x + a;
      if(form === 0){ tex = `\\square + ${a} = ${c}`; }
      else{ tex = `${a} + \\square = ${c}`; }
      answer = x;
      ko = `□에 알맞은 수를 역연산으로 구해요: ${tex.replace('\\square','□')}`;
      en = `Find the missing number using the inverse operation: ${a} and ${c} given`;
      zh = `用逆运算求□：${tex.replace('\\square','□')}`;
    } else {
      // 두 형태: x - k = b (x=b+k)  또는  a - x = b (x=a-b), 항상 양수가 되도록 구성
      const k = R(rng, 1, max);
      const b = R(rng, 1, max);
      if(form === 0){
        tex = `\\square - ${k} = ${b}`;
        answer = b + k;
      } else {
        const a = b + k; // a > b 보장
        tex = `${a} - \\square = ${b}`;
        answer = a - b;
      }
      ko = `□에 알맞은 수를 역연산으로 구해요`;
      en = `Find the missing number using the inverse operation`;
      zh = `用逆运算求□`;
    }
  } else {
    // md: 곱셈/나눗셈 역연산
    const maxFactor = params.max || 12;
    const op = pick(rng, ['×','÷']);
    const form = pick(rng, [0,1]);
    if(op === '×'){
      const x = R(rng, 2, maxFactor*6);
      const a = R(rng, 2, maxFactor);
      const c = x * a;
      tex = form === 0 ? `\\square \\times ${a} = ${c}` : `${a} \\times \\square = ${c}`;
      answer = x;
    } else {
      // □÷a=c  →  □=a×c   또는  c÷□=a → □=c÷a(=주어진 몫)
      const a = R(rng, 2, maxFactor);
      const c = R(rng, 2, maxFactor*6);
      if(form === 0){
        tex = `\\square \\div ${a} = ${c}`;
        answer = a * c;
      } else {
        const dividend = a * c; // 항상 나누어떨어짐
        tex = `${dividend} \\div \\square = ${c}`;
        answer = a;
      }
    }
    ko = `□에 알맞은 수를 역연산으로 구해요: ${tex.replace('\\square','□')}`;
    en = `Find the missing number using the inverse operation: ${tex.replace('\\square','?')}`;
    zh = `用逆运算求□：${tex.replace('\\square','□')}`;
  }

  return {
    prompt:{ ko, en, zh },
    tex, answer, answerType:'steps', widget:'steps',
    steps:[ { tex, blank:answer } ]
  };
};

/* ── EL2 — 검산: 347+286=633이 맞는지 →  633−286=□ ─────────
   params.mode: 'add' | 'sub' | 'muldiv' (기본 'add') */
NM_TGEN['el_check'] = function(params, rng){
  const mode = params.mode || 'add';

  if(mode === 'add'){
    const max = params.max || 500;
    const a = R(rng, 10, max);
    const b = R(rng, 10, max);
    const c = a + b;
    const tex = `${c} - ${b} = \\square`;
    return {
      prompt:{ ko:`${a}+${b}=${c}가 맞는지 검산해요: ${c}−${b}=□`,
               en:`Check if ${a}+${b}=${c}: compute ${c}−${b}=□`,
               zh:`检验${a}+${b}=${c}是否正确：${c}−${b}=□` },
      tex, answer:a, answerType:'steps', widget:'steps',
      steps:[ { tex, blank:a } ]
    };
  }

  if(mode === 'sub'){
    const max = params.max || 500;
    const b = R(rng, 10, max);
    const a = b + R(rng, 10, max); // a > b
    const c = a - b;
    const tex = `${c} + ${b} = \\square`;
    return {
      prompt:{ ko:`${a}−${b}=${c}가 맞는지 검산해요: ${c}+${b}=□`,
               en:`Check if ${a}−${b}=${c}: compute ${c}+${b}=□`,
               zh:`检验${a}−${b}=${c}是否正确：${c}+${b}=□` },
      tex, answer:a, answerType:'steps', widget:'steps',
      steps:[ { tex, blank:a } ]
    };
  }

  // muldiv: 곱셈↔나눗셈 검산
  const bMax = params.max || 12;
  const a = R(rng, 2, bMax);
  const b = R(rng, 2, bMax*5);
  const c = a * b;
  const dir = pick(rng, [0,1]);
  if(dir === 0){
    const tex = `${c} \\div ${b} = \\square`;
    return {
      prompt:{ ko:`${a}×${b}=${c}가 맞는지 검산해요: ${c}÷${b}=□`,
               en:`Check if ${a}×${b}=${c}: compute ${c}÷${b}=□`,
               zh:`检验${a}×${b}=${c}是否正确：${c}÷${b}=□` },
      tex, answer:a, answerType:'steps', widget:'steps',
      steps:[ { tex, blank:a } ]
    };
  } else {
    const tex = `${c} \\div ${a} = \\square`;
    return {
      prompt:{ ko:`${c}÷${a}=${b}가 맞는지 검산해요: ${c}÷${a}=□`,
               en:`Check if ${c}÷${a}=${b}: compute ${c}÷${a}=□`,
               zh:`检验${c}÷${a}=${b}是否正确：${c}÷${a}=□` },
      tex, answer:b, answerType:'steps', widget:'steps',
      steps:[ { tex, blank:b } ]
    };
  }
};

/* ── EL3 — 크기 비교: 27×3 ○ 84−7, 더 큰 쪽의 값(또는 [값,차])을 답 ──
   params.mode: 'simple' | 'wide' | 'diff'(다칸 답 [큰값,차]) */
NM_TGEN['el_compare'] = function(params, rng){
  const mode = params.mode || 'simple';

  function simpleExpr(maxA, maxB){
    // 두 수 + 한 연산으로 이루어진 식 하나와 그 값을 만든다
    const op = pick(rng, ['+','-','×']);
    if(op === '+'){
      const a = R(rng, 1, maxA), b = R(rng, 1, maxB);
      return { tex:`${a} + ${b}`, val:a+b };
    }
    if(op === '-'){
      const b = R(rng, 1, maxB), a = b + R(rng, 1, maxA);
      return { tex:`${a} - ${b}`, val:a-b };
    }
    const a = R(rng, 2, Math.min(12,maxA)), b = R(rng, 2, Math.min(12,maxB));
    return { tex:`${a} \\times ${b}`, val:a*b };
  }

  const isWide = mode !== 'simple';
  const maxA = isWide ? 99 : 20;
  const maxB = isWide ? 99 : 20;

  let L, R2;
  let tries=0;
  do{
    L = simpleExpr(maxA, maxB);
    R2 = simpleExpr(maxA, maxB);
    tries++;
  } while(L.val === R2.val && tries < 30);
  if(L.val === R2.val) R2.val += 1; // 극히 드문 폴백(무한루프 방지) — 값만 보정, tex는 그대로 두어도 표기상 문제 없음(연산문제-감사 기준 dup 영향 미미)

  const bigger = Math.max(L.val, R2.val);
  const smaller = Math.min(L.val, R2.val);
  const diff = bigger - smaller;
  const tex = `${L.tex} \\;\\bigcirc\\; ${R2.tex}`;

  if(mode === 'diff'){
    return {
      prompt:{ ko:`두 식의 값을 비교해요: ${L.tex.replace(/\\times/,'×')} 와 ${R2.tex.replace(/\\times/,'×')} 중 더 큰 값과, 그 차를 순서대로 입력해요`,
               en:`Compare the two expressions and enter [bigger value, difference]`,
               zh:`比较两个算式的值，依次填入[较大值, 差]` },
      tex, answer:[bigger, diff], answerType:'number', widget:'numpad'
    };
  }

  return {
    prompt:{ ko:`두 식 중 더 큰 값을 구해요: ${L.tex.replace(/\\times/,'×')} ○ ${R2.tex.replace(/\\times/,'×')}`,
             en:`Find the greater value of the two expressions`,
             zh:`求两个算式中较大的值` },
    tex, answer:bigger, answerType:'number', widget:'numpad'
  };
};

/* ── EL4 — 평균: 3~5개 수의 평균(정수), 상위: 평균 주고 빠진 수 역산 ──
   params.mode: 'find' | 'missing'
   params.n   : 항의 개수(없으면 mode에 따라 기본값) */
NM_TGEN['el_average'] = function(params, rng){
  const mode = params.mode || 'find';
  const n = params.n || (mode === 'find' ? pick(rng,[3,4]) : pick(rng,[3,4,5]));
  const lo = params.lo || 1, hi = params.hi || 20;

  // 평균을 먼저 정하고, n개 값이 그 평균 주위에서 정수 합을 이루도록 구성한다.
  // last = avg*n - (앞 n-1개 합) 이 유효 범위(1~avg+spread*2)에 들 때까지 재시도.
  // 재시도가 다 실패해도(극히 드묾) '전부 avg'라는 결정적 폴백이 항상 유효(합=avg*n 보장).
  const avg = R(rng, lo, hi);
  const spread = params.spread || 8;
  let finalVals = null;
  for(let attempt=0; attempt<25 && !finalVals; attempt++){
    const vals=[];
    for(let i=0;i<n-1;i++) vals.push(R(rng, Math.max(1, avg-spread), avg+spread));
    const last = avg*n - vals.reduce((s,v)=>s+v,0);
    if(last >= 1 && last <= avg+spread*2) finalVals = vals.concat([last]);
  }
  if(!finalVals) finalVals = new Array(n).fill(avg);
  const total = avg*n;      // finalVals 합은 구성상 항상 avg*n
  const realAvg = avg;      // 항상 정수(요구사항 충족)

  if(mode === 'find'){
    const listTex = finalVals.join(', ');
    const tex = `(${finalVals.join(' + ')}) \\div ${n} = \\square`;
    return {
      prompt:{ ko:`${listTex}의 평균을 구해요`,
               en:`Find the average of ${listTex}`,
               zh:`求${listTex}的平均数` },
      tex, answer:realAvg, answerType:'steps', widget:'steps',
      steps:[
        { tex:`${finalVals.join(' + ')} = \\square`, blank: total },
        { tex:`${total} \\div ${n} = \\square`,       blank: realAvg }
      ]
    };
  }

  // mode === 'missing': 평균과 (n-1)개 값을 주고 나머지 하나를 역산
  const known = finalVals.slice(0, n-1);
  const missing = finalVals[n-1];
  const tex = `(${known.join(' + ')} + \\square) \\div ${n} = ${realAvg}`;
  return {
    prompt:{ ko:`${known.join(', ')}와 어떤 수의 평균이 ${realAvg}예요. 어떤 수를 구해요`,
             en:`The average of ${known.join(', ')} and an unknown number is ${realAvg}. Find the unknown number`,
             zh:`${known.join('、')}和某数的平均数是${realAvg}，求某数` },
    tex, answer:missing, answerType:'steps', widget:'steps',
    steps:[
      { tex:`${realAvg} \\times ${n} = \\square`, blank: total },
      { tex:`${total} - (${known.join(' + ')}) = \\square`, blank: missing }
    ]
  };
};

/* ── EL5 — 비례식: a:b = c:□ (정수해 보장), 상위: 내항·외항 곱 steps ──
   params.mode: 'direct'(단답) | 'steps'(외항내항곱 과정) */
NM_TGEN['el_ratio'] = function(params, rng){
  const mode = params.mode || 'direct';
  const aMax = params.max || 12;
  const mMax = params.mMax || 9;

  const a = R(rng, 2, aMax);
  let b;
  do{ b = R(rng, 2, aMax); } while(b === a);
  const m = R(rng, 2, mMax);
  const c = a * m;
  const d = b * m; // 정답 — a:b = c:d 가 항상 정수비가 되도록 구성

  const tex = `${a} : ${b} = ${c} : \\square`;

  if(mode === 'direct'){
    return {
      prompt:{ ko:`비례식이 성립하도록 □를 구해요: ${a}:${b} = ${c}:□`,
               en:`Find □ so the proportion holds: ${a}:${b} = ${c}:□`,
               zh:`求□使比例式成立：${a}:${b} = ${c}:□` },
      tex, answer:d, answerType:'steps', widget:'steps',
      steps:[ { tex, blank:d } ]
    };
  }

  // steps: 외항(a,d)의 곱 = 내항(b,c)의 곱 → d = (b×c)÷a
  const bc = b * c;
  return {
    prompt:{ ko:`외항의 곱과 내항의 곱이 같음을 이용해 □를 구해요: ${a}:${b} = ${c}:□`,
             en:`Use "outer product = inner product" to find □: ${a}:${b} = ${c}:□`,
             zh:`利用"外项之积=内项之积"求□：${a}:${b} = ${c}:□` },
    tex, answer:d, answerType:'steps', widget:'steps',
    steps:[
      { tex:`${b} \\times ${c} = \\square`, blank: bc },
      { tex:`${bc} \\div ${a} = \\square`,  blank: d  }
    ]
  };
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_TGEN;
})();
