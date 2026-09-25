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

/* 최대공약수 — EL5 비례배분이 "이미 간단한 비"를 뽑을 때 쓴다 */
function gcdEl(a, b){ a = Math.abs(a); b = Math.abs(b); while(b){ const t = b; b = a % b; a = t; } return a || 1; }

/* ── EL1 — 역연산: □×7=91, □÷6=8, 52+□=131 ──────────────────
   params.mode: 'as'(덧뺄셈) | 'md'(곱나눗셈) | 'mix'(둘 다) — 기본 'mix'
   params.max : 수 범위 상한(연산별로 다르게 스케일) */
NM_TGEN['el_inverse'] = function(params, rng){
  const mode = params.mode || 'mix';
  const opKind = mode === 'mix' ? pick(rng, ['as','md']) : mode;

  let tex, answer, ko, en, zh, inv;   /* inv = 역연산 줄. 이게 없으면 "역연산으로 구해요"
                                         라면서 풀이가 문항식 한 줄 복사뿐이었다 — 아이는
                                         발판 없이 □ 를 암산해야 했다(2026-09-20). */

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
      inv = `${c} - ${a} = \\square`;
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
        inv = `${b} + ${k} = \\square`;
      } else {
        const a = b + k; // a > b 보장
        tex = `${a} - \\square = ${b}`;
        answer = a - b;
        inv = `${a} - ${b} = \\square`;
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
      inv = `${c} \\div ${a} = \\square`;
    } else {
      // □÷a=c  →  □=a×c   또는  c÷□=a → □=c÷a(=주어진 몫)
      const a = R(rng, 2, maxFactor);
      const c = R(rng, 2, maxFactor*6);
      if(form === 0){
        tex = `\\square \\div ${a} = ${c}`;
        answer = a * c;
        inv = `${a} \\times ${c} = \\square`;
      } else {
        const dividend = a * c; // 항상 나누어떨어짐
        tex = `${dividend} \\div \\square = ${c}`;
        answer = a;
        inv = `${dividend} \\div ${c} = \\square`;
      }
    }
    ko = `□에 알맞은 수를 역연산으로 구해요: ${tex.replace('\\square','□')}`;
    en = `Find the missing number using the inverse operation: ${tex.replace('\\square','?')}`;
    zh = `用逆运算求□：${tex.replace('\\square','□')}`;
  }

  return {
    prompt:{ ko, en, zh },
    tex, answer, answerType:'steps', widget:'steps',
    /* 역연산 줄 → 원래 식에 되돌려 넣어 확인. DV15 가 이미 쓰는 모양이다. */
    steps:[ { tex: inv, blank:answer }, { tex, blank:answer } ]
  };
};

/* ── EL2 — 검산: 어떤 수+286=633 →  633−286=□ ──────────────
   params.mode: 'add' | 'sub' | 'muldiv' (기본 'add')
   ⚠️ 2026-09-20 이전에는 문두가 `347+286=633이 맞는지 검산해요`였고 **답이 347**이었다.
   즉 정답이 문제 지문 첫 글자에 그대로 찍혀 있어, 계산 없이 베껴 쓰면 100% 맞았다.
   검산할 식의 한 자리를 '어떤 수'로 가리면 관계는 그대로면서 계산을 해야 답이 나온다. */
NM_TGEN['el_check'] = function(params, rng){
  const mode = params.mode || 'add';

  if(mode === 'add'){
    const max = params.max || 500;
    const a = R(rng, 10, max);
    const b = R(rng, 10, max);
    const c = a + b;
    const tex = `${c} - ${b} = \\square`;
    return {
      prompt:{ ko:`어떤 수 + ${b} = ${c} 예요. 뺄셈으로 검산해서 어떤 수를 구해요`,
               en:`A number + ${b} = ${c}. Check by subtracting to find the number`,
               zh:`某数 + ${b} = ${c}。用减法检验，求这个数` },
      tex, answer:a, answerType:'steps', widget:'steps',
      steps:[ { tex, blank:a }, { tex:`\\square + ${b} = ${c}`, blank:a } ]
    };
  }

  if(mode === 'sub'){
    const max = params.max || 500;
    const b = R(rng, 10, max);
    const a = b + R(rng, 10, max); // a > b
    const c = a - b;
    const tex = `${c} + ${b} = \\square`;
    return {
      prompt:{ ko:`어떤 수 − ${b} = ${c} 예요. 덧셈으로 검산해서 어떤 수를 구해요`,
               en:`A number − ${b} = ${c}. Check by adding to find the number`,
               zh:`某数 − ${b} = ${c}。用加法检验，求这个数` },
      tex, answer:a, answerType:'steps', widget:'steps',
      steps:[ { tex, blank:a }, { tex:`\\square - ${b} = ${c}`, blank:a } ]
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
      prompt:{ ko:`어떤 수 × ${b} = ${c} 예요. 나눗셈으로 검산해서 어떤 수를 구해요`,
               en:`A number × ${b} = ${c}. Check by dividing to find the number`,
               zh:`某数 × ${b} = ${c}。用除法检验，求这个数` },
      tex, answer:a, answerType:'steps', widget:'steps',
      steps:[ { tex, blank:a }, { tex:`\\square \\times ${b} = ${c}`, blank:a } ]
    };
  } else {
    const tex = `${c} \\div ${a} = \\square`;
    return {
      prompt:{ ko:`${a} × 어떤 수 = ${c} 예요. 나눗셈으로 검산해서 어떤 수를 구해요`,
               en:`${a} × a number = ${c}. Check by dividing to find the number`,
               zh:`${a} × 某数 = ${c}。用除法检验，求这个数` },
      tex, answer:b, answerType:'steps', widget:'steps',
      steps:[ { tex, blank:b }, { tex:`${a} \\times \\square = ${c}`, blank:b } ]
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
  /* ○ 는 쓰기 상자로 바뀌지 않아(texDisplay 는 \square 만 키운다) **답 쓸 칸이 없었다**.
     ○ 로 견주게 하되 뒤에 답 칸을 잇는다(2026-09-20 점검). 이러면 "○에 부등호냐 값이냐"가
     식만 보고도 분명해져, 프롬프트를 질문 줄로 싣는 특례(exam.js printAskText)도 필요 없다. */
  const tex = `${L.tex} \\;\\bigcirc\\; ${R2.tex} \\;\\Rightarrow\\; \\text{큰 값} = \\square`;
  const texDiff = `${L.tex} \\;\\bigcirc\\; ${R2.tex} \\;\\Rightarrow\\; \\text{큰 값} = \\square \\,,\\; \\text{차} = \\square`;

  if(mode === 'diff'){
    return {
      prompt:{ ko:`두 식의 값을 비교해요: ${L.tex.replace(/\\times/,'×')} 와 ${R2.tex.replace(/\\times/,'×')} 중 더 큰 값과, 그 차를 순서대로 입력해요`,
               en:`Compare the two expressions and enter [bigger value, difference]`,
               zh:`比较两个算式的值，依次填入[较大值, 差]` },
      tex: texDiff, answer:[bigger, diff], answerType:'number', widget:'numpad',
      solution: [
        { tex: `${L.tex} = ${L.val}\\, ,\\; ${R2.tex} = ${R2.val}` },
        { tex: `\\max(${L.val}, ${R2.val}) = \\square \\, ,\\; ${bigger} - ${smaller} = \\square`, blank: [bigger, diff] }
      ]
    };
  }

  return {
    prompt:{ ko:`두 식 중 더 큰 값을 구해요: ${L.tex.replace(/\\times/,'×')} ○ ${R2.tex.replace(/\\times/,'×')}`,
             en:`Find the greater value of the two expressions`,
             zh:`求两个算式中较大的值` },
    tex, answer:bigger, answerType:'number', widget:'numpad',
    solution: [
      { tex: `${L.tex} = ${L.val}\\, ,\\; ${R2.tex} = ${R2.val}` },
      { tex: `\\max(${L.val}, ${R2.val}) = \\square`, blank: bigger }
    ]
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

  /* ── 비례배분 (mode:'distribute') — 2026-08-29 신규 ────────────────
     초6. 전체를 주어진 비로 나눈다. 비례식 다음에 오는 단원이고, 우리 문제은행
     어디에도 없었다.

     tex는 두 조건을 그대로 적어 자족하게 만든다 —
       `□ + ○ = 600 , □ : ○ = 2 : 3`
     합과 비가 동시에 묶이면 두 수는 240·360 하나뿐이라 답이 유일하다.
     (합을 빼고 비만 주면 2:3·4:6·240:360… 무엇이든 맞아 유일해가 깨진다.)
     빈칸 기호를 □·○ 둘로 갈라 어느 칸이 전항이고 어느 칸이 후항인지 못 박는다
     — EL3 크기 비교가 이미 쓰는 표기다. 답은 [□, ○] 차례. */
  if(mode === 'distribute'){
    const a = R(rng, 1, 7);
    let b;
    do { b = R(rng, 1, 8); } while(b === a || gcdEl(a, b) !== 1);   /* 이미 간단한 비로 준다 */
    const unit  = R(rng, 2, 40);          /* 한 몫의 크기 */
    const p1    = a * unit, p2 = b * unit;
    const total = p1 + p2;

    return {
      prompt: {
        ko: `${total}을(를) ${a} : ${b}로 비례배분해요 (가, 나 차례로)`,
        en: `Split ${total} in the ratio ${a} : ${b} — give the first part, then the second`,
        zh: `把${total}按${a} : ${b}的比例分配（依次填甲、乙）`
      },
      /* 전에는 `□ + ○ = total , □ : ○ = a : b` 였는데, 같은 미지수가 두 번 나오는데도
         예시 줄이 \square 를 **독립된 빈칸**으로 보고 차례로 채워 비례식이 깨졌다
         (`29 + ○ = 261 , 232 : ○ = 1 : 8`). 미지수는 글자로 두고 답 칸을 따로 준다(2026-09-20). */
      tex: `\\text{가} + \\text{나} = ${total} \\;,\\;\\; \\text{가} : \\text{나} = ${a} : ${b}`
         + ` \\;\\Rightarrow\\; \\text{가} = \\square \\,,\\; \\text{나} = \\square`,
      answer:     [p1, p2],
      answerType: 'number',
      widget:     'numpad',
      solution: [
        { tex: `${total} \\div (${a}+${b}) = \\square`, blank: unit },
        { tex: `${a} \\times ${unit} = \\square\\, ,\\; ${b} \\times ${unit} = \\square`, blank: [p1, p2] }
      ]
    };
  }
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
      steps:[ { tex, blank:d } ],
      solution: [
        { tex:`${b} \\times ${c} = \\square`, blank: b * c },
        { tex:`${b * c} \\div ${a} = \\square`, blank: d }
      ]
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
    ],
    solution:[
      { tex:`${b} \\times ${c} = \\square`, blank: bc },
      { tex:`${bc} \\div ${a} = \\square`,  blank: d  }
    ]
  };
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_TGEN;
})();
