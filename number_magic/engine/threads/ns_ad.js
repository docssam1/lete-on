/* ============================================================
   Numbers of Magic — NS (Number Sense) + AD (Addition) Thread Generators
   NS1~NS5, AD1~AD8  (13 generators)
   계약: NM_TGEN[key] = (params, rng) => problem
   Math.random 사용 금지 — 주입된 rng만 사용
   ============================================================ */
(function(){
'use strict';

const {R, pick, shuffle} = NM_RNG;

/* 같은 덧셈/보수 사실이라도 등식을 여러 형태로 보여주는 헬퍼.
   k(아는 부분) + need(빈칸) = target 이라는 같은 사실을 8가지 식으로 표현해
   문항 노출 다양성을 크게 늘린다 (NS2·NS3·NS4 공용). */
function _bondForms(k, need, target) {
  return [
    `${k} + \\square = ${target}`,
    `\\square + ${k} = ${target}`,
    `${target} = ${k} + \\square`,
    `${target} = \\square + ${k}`,
    `${target} - ${k} = \\square`,
    `${target} - \\square = ${k}`,
    `\\square = ${target} - ${k}`,
    `${k} = ${target} - \\square`
  ];
}

/* ── 자릿값 이름 헬퍼 ── */
const PLACE_KO  = ['일','십','백','천','만'];
const PLACE_EN  = ['ones','tens','hundreds','thousands','ten-thousands'];
const PLACE_ZH  = ['个位','十位','百位','千位','万位'];

/* ── §red 예시 문항 solution 체인 헬퍼 (2026-09-05) ──
   두 수를 자리별로 더하거나 뺄 때 "일의 자리부터 자리 맞춰" 계산하는 과정을
   자리 수만큼 한 줄씩 보여주고, 마지막 한 줄에서 남은 윗자리를 그대로
   되접어(trivial floor/mod) answer와 정확히 같은 값으로 마무리한다.
   numDigits는 두 수 중 큰 쪽의 자릿수(2~4)만 넣으면 된다. */
function _addPlaceLines(a, b, sum, numDigits){
  let carry = 0;
  const lines = [];
  for(let p = 0; p <= numDigits - 2; p++){
    const pv = Math.pow(10, p);
    const da = Math.floor(a / pv) % 10;
    const db = Math.floor(b / pv) % 10;
    const s  = da + db + carry;
    lines.push({ tex: `\\text{${PLACE_KO[p]}: } ${da} + ${db}${carry ? ' + 1' : ''} = \\square`, blank: s % 10 });
    carry = Math.floor(s / 10);
  }
  const lowerPow = Math.pow(10, numDigits - 1);
  lines.push({ tex: `${Math.floor(sum / lowerPow)} \\times ${lowerPow} + ${sum % lowerPow} = \\square`, blank: sum });
  return lines;
}
function _subPlaceLines(a, b, diff, numDigits){
  let borrowIn = 0;
  const lines = [];
  for(let p = 0; p <= numDigits - 2; p++){
    const pv    = Math.pow(10, p);
    const rawDa = Math.floor(a / pv) % 10;
    const db    = Math.floor(b / pv) % 10;
    let value = rawDa - borrowIn;
    let borrowOut = 0;
    if(value < db){ value += 10; borrowOut = 1; }
    const base = `${rawDa}${borrowIn ? ' - 1' : ''}`;
    const tex  = borrowOut
      ? `\\text{${PLACE_KO[p]}: } (10 + ${base}) - ${db} = \\square`
      : `\\text{${PLACE_KO[p]}: } ${base} - ${db} = \\square`;
    lines.push({ tex, blank: value - db });
    borrowIn = borrowOut;
  }
  const lowerPow = Math.pow(10, numDigits - 1);
  lines.push({ tex: `${Math.floor(diff / lowerPow)} \\times ${lowerPow} + ${diff % lowerPow} = \\square`, blank: diff });
  return lines;
}

/* ── NS1 자릿값 읽기 ── */
NM_TGEN['ns1_placeValue'] = function(params, rng){
  params = params || {};

  /* ── §4 다함식 위젯: 십진블록 읽기 (widget:'base10', mode:'read') ──
     백판(hundred flat)·십막대(ten rod)·낱개(ones cube) 그림을 보고 수를 읽는다.
     2·3자리를 섞어 낸다(백판 0~9개, 항상 0이 아닌 수가 되도록 재추첨). */
  if(params.mode === 'base10'){
    let h, tens, ones;
    do{
      h    = R(rng, 0, 6);
      tens = R(rng, 0, 9);
      ones = R(rng, 0, 9);
    } while(h===0 && tens===0 && ones===0);
    const n = h*100 + tens*10 + ones;
    return {
      prompt: {
        ko: '십진블록이 나타내는 수는 얼마일까요?',
        en: 'What number do the base-10 blocks show?',
        zh: '这些十进制方块表示的数是多少？'
      },
      tex: `${h?h+'00 + ':''}${tens*10} + ${ones} = \\square`,
      answer: n,
      answerType: 'number',
      widget: 'base10',
      base10: { h, tens, ones, mode: 'read' },
      solution: [
        { tex: `${h}\\times100 + ${tens}\\times10 + ${ones}\\times1 = \\square`, blank: n }
      ]
    };
  }

  const max = params.max || 999;

  /* 자릿수 범위 결정 */
  const digits = max >= 10000 ? 5 : max >= 1000 ? 4 : 3;

  /* max 이하의 랜덤 수 — 최소 자릿수를 꽉 채운 수 보장 */
  const minVal = Math.pow(10, digits - 1);
  const n = R(rng, minVal, max);

  /* 물어볼 자리 선택 (0=일, 1=십, ...) */
  const placeIdx = R(rng, 0, digits - 1);
  const placeValue = Math.pow(10, placeIdx);
  const digitAt = Math.floor(n / placeValue) % 10;

  const ko = PLACE_KO[placeIdx];
  const en = PLACE_EN[placeIdx];
  const zh = PLACE_ZH[placeIdx];

  /* 절반 확률로 역문제: "○의 자리 숫자가 d인 수는?" — 하지만 단순 재귀 대신
     이 호출은 정방향(어떤 자리 숫자는?)만 구현, 역문제는 별도 variation */

  /* solution: n을 자릿값별로 풀어 쓰되, 물어본 자리만 "숫자 × 자릿값"으로
     빈칸 처리 — concept 그대로("4는 백의 자리라 400을 뜻해요") */
  const placeParts = [];
  for(let p = digits - 1; p >= 0; p--){
    if(p === placeIdx){
      placeParts.push(`\\square \\times ${placeValue}`);
    } else {
      const pv = Math.pow(10, p);
      const dg = Math.floor(n / pv) % 10;
      if(dg !== 0) placeParts.push(`${dg * pv}`);
    }
  }

  return {
    prompt: {
      ko: `${n}에서 ${ko}의 자리 숫자는 얼마일까요?`,
      en: `In ${n}, what digit is in the ${en} place?`,
      zh: `${n}的${zh}是几？`
    },
    tex: `${n}에서 ${ko}의 자리 = \\square`,
    answer: digitAt,
    answerType: 'number',
    widget: 'missing',
    solution: [
      { tex: `${n} = ${placeParts.join(' + ')}`, blank: digitAt }
    ]
  };
};

/* ── NS2 모으기·가르기 ── */
NM_TGEN['ns2_split'] = function(params, rng){
  params = params || {};
  const max = params.max || 9;
  const n = R(rng, 2, max);
  const a = R(rng, 1, n - 1);
  const b = n - a;

  /* 어느 쪽을 아는 부분으로 보여줄지 + 등식을 8가지 형태 중 하나로 표현 */
  const knownIsA = rng() < 0.5;
  const k    = knownIsA ? a : b;
  const need = knownIsA ? b : a;
  const tex  = pick(rng, _bondForms(k, need, n));

  return {
    prompt: {
      ko: `${n}을 ${k}과 얼마로 가를까요?`,
      en: `Split ${n}: ${k} and how much?`,
      zh: `把${n}分成${k}和多少？`
    },
    tex,
    answer: need,
    answerType: 'number',
    widget: 'cubes',
    cubes: { piles: [a, b], moveTo: n },
    solution: [
      { tex: `${n} \\to ${a} + ${b}` },
      { tex: `${k} + \\square = ${n}`, blank: need }
    ]
  };
};

/* ── NS3 보수 5·10 ──
   params.target은 "이 레벨에서 다룰 최대 목표수"로 해석한다 — 실제 문항은
   2~target 사이의 여러 부분목표(subTarget)를 오가며 만들어 문항 다양성을 늘린다
   (보수 5·10은 조합 수가 본질적으로 적어 target을 고정값으로만 쓰면 20문항
   안에서 반복이 심하다). */
NM_TGEN['ns3_comp510'] = function(params, rng){
  params = params || {};
  const target = params.target || 10;
  /* 목표수 근방(±2)까지 살짝 넓혀 20문항 안 중복을 더 낮춘다 */
  const subTarget = R(rng, 2, target + 2);
  const k = R(rng, 1, subTarget - 1);
  const need = subTarget - k;
  const tex = pick(rng, _bondForms(k, need, subTarget));

  return {
    prompt: {
      ko: `${k}에서 ${subTarget}을 만들려면 얼마가 더 필요해요?`,
      en: `You have ${k}. How many more to make ${subTarget}?`,
      zh: `有${k}个，还需要几个才能凑成${subTarget}？`
    },
    tex,
    answer: need,
    answerType: 'steps',
    steps: [{ tex: `${k} + \\square = ${subTarget}`, blank: need }],
    widget: 'tenframe',
    cubes: { piles: [k, need], moveTo: subTarget }
  };
};

/* ── NS4 보수 100·1000 ──
   NS3와 같은 이유로 target을 "최대 목표수"로 해석해, step의 배수인 여러
   부분목표(subTarget) 사이를 오가며 문항을 만든다. */
NM_TGEN['ns4_comp100'] = function(params, rng){
  params = params || {};
  const target = params.target || 100;
  const step   = params.step   || 10;

  const maxMult   = Math.floor(target / step);        /* subTarget = subMult*step */
  const subMult   = R(rng, 2, maxMult);
  const subTarget = subMult * step;
  const mult      = R(rng, 1, subMult - 1);
  const a = mult * step;
  const b = subTarget - a;
  const tex = pick(rng, _bondForms(a, b, subTarget));

  return {
    prompt: {
      ko: `${a}에 얼마를 더하면 ${subTarget}이 될까요?`,
      en: `What do you add to ${a} to get ${subTarget}?`,
      zh: `${a}加多少等于${subTarget}？`
    },
    tex,
    answer: b,
    answerType: 'steps',
    steps: [{ tex: `${a} + \\square = ${subTarget}`, blank: b }],
    widget: 'steps'
  };
};

/* ── NS5 두 배 수(twin) ── */
NM_TGEN['ns5_twin'] = function(params, rng){
  params = params || {};
  const min = params.min || 1;
  const max = params.max || 10;

  const n = R(rng, min, max);
  /* near-double 변형 (~30% 확률) */
  const variant = rng();
  let m, answer, promptKo, promptEn, promptZh, solution;

  if(variant < 0.33 && n > min){
    /* near-double: n + (n-1) — n의 두 배를 알면 1을 빼면 된다 */
    m = n - 1;
    answer = n + m;
    promptKo = `${n} 더하기 ${m}은 얼마일까요?`;
    promptEn = `What is ${n} + ${m}?`;
    promptZh = `${n}加${m}等于多少？`;
    solution = [
      { tex: `${n} + ${m} = ${n} + ${n} - 1` },
      { tex: `${n}\\times2 - 1 = \\square`, blank: answer }
    ];
  } else if(variant < 0.66 && n < max){
    /* near-double: n + (n+1) — n의 두 배를 알면 1을 더하면 된다 */
    m = n + 1;
    answer = n + m;
    promptKo = `${n} 더하기 ${m}은 얼마일까요?`;
    promptEn = `What is ${n} + ${m}?`;
    promptZh = `${n}加${m}等于多少？`;
    solution = [
      { tex: `${n} + ${m} = ${n} + ${n} + 1` },
      { tex: `${n}\\times2 + 1 = \\square`, blank: answer }
    ];
  } else {
    /* pure double */
    m = n;
    answer = 2 * n;
    promptKo = `${n}의 두 배는 얼마일까요?`;
    promptEn = `What is double ${n}?`;
    promptZh = `${n}的两倍是多少？`;
    solution = [
      { tex: `${n} + ${n} = ${n}\\times2` },
      { tex: `${n}\\times2 = \\square`, blank: answer }
    ];
  }

  /* 같은 (n,m) 조합이라도 더하는 순서·등식 방향을 섞어 문항 다양성을 늘린다.
     순수 두 배(m===n)일 때는 덧셈·곱셈 두 표현이 모두 자연스러우므로
     ×2 표기도 후보에 넣어 형태를 더 늘린다. */
  const forms = [
    `${n} + ${m} = \\square`,
    `${m} + ${n} = \\square`,
    `\\square = ${n} + ${m}`,
    `\\square = ${m} + ${n}`
  ];
  if (m === n) {
    forms.push(
      `${n} \\times 2 = \\square`,
      `2 \\times ${n} = \\square`,
      `\\square = ${n} \\times 2`,
      `\\square = 2 \\times ${n}`
    );
  }
  const tex = pick(rng, forms);

  return {
    prompt: { ko: promptKo, en: promptEn, zh: promptZh },
    tex,
    answer,
    answerType: 'number',
    widget: 'cubes',
    cubes: { piles: [n, m], moveTo: answer },
    solution
  };
};

/* ── AD1 한 자리 덧셈(올림 없음) ── */
NM_TGEN['ad1_add1d'] = function(params, rng){
  params = params || {};
  const maxSum = params.maxSum || 9;

  const a = R(rng, 1, Math.floor(maxSum / 2));
  const b = R(rng, 1, maxSum - a);
  const sum = a + b;

  return {
    prompt: {
      ko: `${a} 더하기 ${b}는 얼마일까요?`,
      en: `What is ${a} + ${b}?`,
      zh: `${a}加${b}等于多少？`
    },
    tex: `${a} + ${b} = \\square`,
    answer: sum,
    answerType: 'number',
    widget: 'cubes',
    cubes: { piles: [a, b], moveTo: sum },
    solution: [
      { tex: `${a} + ${b} = \\square`, blank: sum }
    ]
  };
};

/* ── AD2 받아올림 덧셈(한 자리) ── */
NM_TGEN['ad2_addCarry1d'] = function(params, rng){
  params = params || {};
  const terms = params.terms || 2;

  if(terms === 3){
    /* 세 수: a+b+c, 합 > 10 */
    let a, b, c;
    do {
      a = R(rng, 3, 9);
      b = R(rng, 2, 9);
      c = R(rng, 2, 9);
    } while(a + b + c <= 10 || a + b + c > 27);

    const sum = a + b + c;
    /* 전략: a+b 먼저 받아올림 */
    const ab = a + b;
    const need1 = 10 - a;
    const rest1 = b - need1;

    return {
      prompt: {
        ko: `${a} + ${b} + ${c}를 차례로 더해요`,
        en: `Add ${a} + ${b} + ${c} step by step`,
        zh: `一步步计算${a}＋${b}＋${c}`
      },
      tex: `${a} + ${b} + ${c} = \\square`,
      answer: sum,
      answerType: 'steps',
      steps: [
        { tex: `${a} + ${need1} + ${rest1} + ${c}`, blank: need1 },
        { tex: `10 + ${rest1} + ${c}`,               blank: rest1 },
        { tex: `${ab} + ${c}`,                       blank: ab   },
        { tex: `\\square`,                            blank: sum  }
      ],
      widget: 'steps',
      cubes: { piles: [a, b], moveTo: 10 },
      solution: [
        { tex: `${a} + \\square = 10`,        blank: need1 },
        { tex: `${b} - ${need1} = \\square`,  blank: rest1 },
        { tex: `10 + ${rest1} + ${c} = \\square`, blank: sum }
      ]
    };
  }

  /* 기본: 두 한 자리, 합 > 10 */
  let a, b;
  do {
    a = R(rng, 5, 9);
    b = R(rng, 2, 9);
  } while(a + b <= 10 || a + b > 18);

  const need = 10 - a;
  const rest = b - need;
  const sum  = a + b;

  return {
    prompt: {
      ko: `${b}에서 ${need}을(를) 이사보내 ${a}를 10으로 만들어요`,
      en: `Move ${need} from ${b} to make ${a} into 10, then add ${rest}`,
      zh: `从${b}里搬${need}过去，把${a}凑成10，再加${rest}`
    },
    tex: `${a} + ${b} = \\square`,
    answer: sum,
    answerType: 'steps',
    steps: [
      { tex: `${a} + ${need} + ${rest}`, blank: need },
      { tex: `10 + ${rest}`,             blank: rest },
      { tex: `\\square`,                 blank: sum  }
    ],
    widget: 'steps',
    cubes: { piles: [a, b], moveTo: 10 },
    solution: [
      { tex: `${a} + \\square = 10`,       blank: need },
      { tex: `${b} - ${need} = \\square`,  blank: rest },
      { tex: `10 + ${rest} = \\square`,    blank: sum  }
    ]
  };
};

/* ── AD3 두 자리+한 자리 ── */
NM_TGEN['ad3_add2d1d'] = function(params, rng){
  params = params || {};

  /* ── §4 다함식 위젯: 십진블록 더하기 (widget:'base10', mode:'add') ──
     항상 올림(carry)이 있는 조합만 뽑는다 — 낱개 10개가 새 십막대 하나로
     묶이는 장면이 이 위젯의 핵심이라, 올림 없는 문제는 그림의 재미가 없다. */
  if(params.mode === 'base10'){
    const tens = R(rng, 1, 8);
    const ones_a = R(rng, 1, 9);
    let b;
    do { b = R(rng, 1, 9); } while(ones_a + b < 10);
    const A = tens*10 + ones_a;
    const sum = A + b;
    return {
      prompt: {
        ko: `${A} + ${b}, 십진블록을 다 더하면 얼마일까요?`,
        en: `Add ${A} + ${b} using the base-10 blocks!`,
        zh: `用十进制方块计算${A}+${b}等于多少？`
      },
      tex: `${A} + ${b} = \\square`,
      answer: sum,
      answerType: 'number',
      widget: 'base10',
      base10: { a:{tens, ones:ones_a}, b:{tens:0, ones:b}, mode:'add' },
      solution: _addPlaceLines(A, b, sum, 2)
    };
  }

  const carry      = params.carry      || false;
  const threeDigit = params.threeDigit || false;

  let tens, ones_a, b;

  if(threeDigit){
    /* 3d + 1d (carry 포함) */
    const h = R(rng, 1, 9);
    tens   = R(rng, 1, 9);
    ones_a = R(rng, 1, 9);
    do { b = R(rng, 1, 9); } while(ones_a + b < 10);
    const A = h * 100 + tens * 10 + ones_a;
    const sum = A + b;
    const onesSum = ones_a + b;
    const carryOver = Math.floor(onesSum / 10);
    const newOnes = onesSum % 10;
    const newTens = tens + carryOver;
    return {
      prompt: {
        ko: `${A} 더하기 ${b}는 얼마일까요?`,
        en: `What is ${A} + ${b}?`,
        zh: `${A}加${b}等于多少？`
      },
      tex: `${A} + ${b} = \\square`,
      answer: sum,
      answerType: 'steps',
      steps: [
        { tex: `${h * 100} + ${tens * 10} + ${ones_a} + ${b}`, blank: onesSum > 9 ? newOnes : onesSum },
        { tex: `${h * 100} + ${newTens * 10} + ${newOnes}`,     blank: sum }
      ],
      widget: 'steps',
      solution: _addPlaceLines(A, b, sum, 3)
    };
  }

  tens   = R(rng, 1, 9);
  ones_a = carry ? R(rng, 1, 9) : R(rng, 0, 8);
  if(carry){
    do { b = R(rng, 1, 9); } while(ones_a + b < 10);
  } else {
    do { b = R(rng, 1, 9 - ones_a); } while(ones_a + b >= 10);
  }

  const A   = tens * 10 + ones_a;
  const sum = A + b;

  if(!carry){
    const onesSum = ones_a + b;
    return {
      prompt: {
        ko: `${A} 더하기 ${b}는 얼마일까요?`,
        en: `What is ${A} + ${b}?`,
        zh: `${A}加${b}等于多少？`
      },
      tex: `${A} + ${b} = \\square`,
      answer: sum,
      answerType: 'steps',
      steps: [
        { tex: `${tens * 10} + ${ones_a} + ${b}`, blank: onesSum },
        { tex: `${tens * 10} + ${onesSum}`,        blank: sum     }
      ],
      widget: 'steps',
      solution: _addPlaceLines(A, b, sum, 2)
    };
  }

  /* carry 있는 경우 */
  const onesSum    = ones_a + b;
  const carryOver  = Math.floor(onesSum / 10);
  const newOnes    = onesSum % 10;
  const newTens    = (tens + carryOver) * 10;

  return {
    prompt: {
      ko: `${A} 더하기 ${b}는 얼마일까요? (올림 있어요)`,
      en: `What is ${A} + ${b}? (there is a carry)`,
      zh: `${A}加${b}等于多少？（需要进位）`
    },
    tex: `${A} + ${b} = \\square`,
    answer: sum,
    answerType: 'steps',
    steps: [
      { tex: `${tens * 10} + ${ones_a} + ${b}`, blank: newOnes },
      { tex: `${newTens} + ${newOnes}`,          blank: sum     }
    ],
    widget: 'steps',
    solution: _addPlaceLines(A, b, sum, 2)
  };
};

/* ── AD4 몇십·몇백 덧뺄 ── */
NM_TGEN['ad4_addTens'] = function(params, rng){
  params = params || {};

  /* ── §4 다함식 위젯: 수직선 점프 (widget:'numline') ──
     +n씩(2,3,5,9,10,11 중 하나) 폴짝폴짝 뛰며 빈 칸을 채운다 — 두 자리 범위
     (시작 1~40, 3~4번 점프)까지 다다르도록 잡아 유아 nl2_seq(1~20)보다 넓힌다. */
  if(params.mode === 'numline'){
    const step  = pick(rng, [2,3,5,9,10,11]);
    const hops  = R(rng, 3, 4);              /* 화살표(점프) 수 — 마디는 hops+1개 */
    const start = R(rng, 1, 40);
    const seq = [start];
    for(let i=1;i<=hops;i++) seq.push(seq[i-1] + step);
    const blank = R(rng, 1, hops);           /* 첫 마디(출발점)는 항상 보여준다 */
    const seqTex = seq.map((v,i)=> i===blank ? '\\square' : v).join('\\,\\to\\,');
    return {
      prompt: {
        ko: `+${step}씩 폴짝폴짝! 빈 칸에 들어갈 수는 얼마일까요?`,
        en: `Hop by +${step} each time! What number goes in the blank?`,
        zh: `每次跳+${step}！空格里应该填几？`
      },
      tex: seqTex,
      answer: seq[blank],
      answerType: 'number',
      widget: 'numline',
      numline: { start, step, seq, blank },
      solution: [
        { tex: `${seq[blank - 1]} + ${step} = \\square`, blank: seq[blank] }
      ]
    };
  }

  const unit = params.unit || 10;

  /* 최대 배수 (합이 unit*10 이하) */
  const maxMult = 9;
  const aMult = R(rng, 1, maxMult - 1);
  const bMult = R(rng, 1, maxMult - aMult);
  const a = aMult * unit;
  const b = bMult * unit;

  /* 덧셈 or 뺄셈 (뺄셈이면 a > b 보장) */
  const op = pick(rng, ['+', '-']);
  const bigA = op === '-' ? Math.max(a, b) : a;
  const bigB = op === '-' ? Math.min(a, b) : b;
  const result = op === '+' ? bigA + bigB : bigA - bigB;

  /* 절반 확률로 □ 채우기 변형 */
  const missingAddend = rng() < 0.4;
  if(missingAddend && op === '+'){
    return {
      prompt: {
        ko: `${bigA}에 얼마를 더하면 ${result + bigB}이 될까요?`,
        en: `${bigA} + \\square = ${bigA + bigB}. What's missing?`,
        zh: `${bigA}加多少等于${bigA + bigB}？`
      },
      tex: `${bigA} + \\square = ${bigA + bigB}`,
      answer: bigB,
      answerType: 'number',
      widget: 'missing',
      solution: [
        { tex: `${(bigA + bigB) / unit} - ${bigA / unit} = \\square`, blank: bigB / unit },
        { tex: `${bigB / unit} \\times ${unit} = \\square`, blank: bigB }
      ]
    };
  }

  const unitA = bigA / unit, unitB = bigB / unit;
  const unitResult = op === '+' ? unitA + unitB : unitA - unitB;

  return {
    prompt: {
      ko: `${bigA} ${op} ${bigB}는 얼마일까요?`,
      en: `What is ${bigA} ${op} ${bigB}?`,
      zh: `${bigA}${op}${bigB}等于多少？`
    },
    tex: `${bigA} ${op === '+' ? '+' : '-'} ${bigB} = \\square`,
    answer: result,
    answerType: 'number',
    widget: 'missing',
    solution: [
      { tex: `${unitA} ${op} ${unitB} = \\square`, blank: unitResult },
      { tex: `${unitResult} \\times ${unit} = \\square`, blank: result }
    ]
  };
};

/* ── AD5 두 자리+두 자리(올림) ── */
NM_TGEN['ad5_add2d2d'] = function(params, rng){
  params = params || {};
  const carries = params.carries || 1;

  let a, b;
  if(carries === 1){
    /* 일의 자리만 올림, 십의 자리는 올림 없음 */
    do {
      const ta = R(rng, 1, 8);
      const oa = R(rng, 1, 9);
      const tb = R(rng, 1, 9 - ta);
      const ob = R(rng, 10 - oa, 9);  /* oa+ob >= 10 */
      a = ta * 10 + oa;
      b = tb * 10 + ob;
    } while(a + b > 99 || Math.floor(a / 10) + Math.floor(b / 10) + 1 > 9);
  } else {
    /* 임의 올림 (1~2회) */
    do {
      a = R(rng, 11, 89);
      b = R(rng, 11, 89);
    } while(a + b > 199 || a + b < 11);
  }

  const sum        = a + b;
  const oA         = a % 10;
  const oB         = b % 10;
  const onesSum    = oA + oB;
  const onesCarry  = Math.floor(onesSum / 10);
  const onesResult = onesSum % 10;
  const tA         = Math.floor(a / 10);
  const tB         = Math.floor(b / 10);
  const tensSum    = tA + tB + onesCarry;

  return {
    prompt: {
      ko: `${a} 더하기 ${b}를 자릿값별로 계산해요`,
      en: `Calculate ${a} + ${b} by place value`,
      zh: `按位计算${a}加${b}`
    },
    tex: `${a} + ${b} = \\square`,
    answer: sum,
    answerType: 'steps',
    steps: [
      { tex: `\\text{일의 자리: } ${oA} + ${oB} = \\square`, blank: onesResult },
      { tex: `\\text{십의 자리: } ${tA} + ${tB}${onesCarry ? ' + 1' : ''} = \\square`, blank: tensSum }
    ],
    widget: 'vertical',
    solution: _addPlaceLines(a, b, sum, 2)
  };
};

/* ── AD6 세 자리 덧셈 ── */
NM_TGEN['ad6_add3d'] = function(params, rng){
  params = params || {};
  const bMode = params.b || '2d';

  let a, b;
  if(bMode === '2d'){
    a = R(rng, 100, 899);
    b = R(rng, 10,  99);
  } else {
    a = R(rng, 100, 899);
    b = R(rng, 100, 899);
  }
  const sum = a + b;

  const oA = a % 10,          oB = b % 10;
  const tA = Math.floor(a / 10) % 10, tB = Math.floor(b / 10) % 10;
  const hA = Math.floor(a / 100),     hB = Math.floor(b / 100);

  const onesSum   = oA + oB;
  const oC        = Math.floor(onesSum / 10);
  const onesR     = onesSum % 10;
  const tensSum   = tA + tB + oC;
  const tC        = Math.floor(tensSum / 10);
  const tensR     = tensSum % 10;
  const hunsSum   = hA + hB + tC;

  return {
    prompt: {
      ko: `${a} 더하기 ${b}를 세로로 계산해요`,
      en: `Calculate ${a} + ${b} using column addition`,
      zh: `用竖式计算${a}加${b}`
    },
    tex: `${a} + ${b} = \\square`,
    answer: sum,
    answerType: 'steps',
    steps: [
      { tex: `\\text{일: } ${oA} + ${oB} = \\square`, blank: onesR  },
      { tex: `\\text{십: } ${tA} + ${tB}${oC ? ' + 1' : ''} = \\square`, blank: tensR  },
      { tex: `\\text{백: } ${hA} + ${hB}${tC ? ' + 1' : ''} = \\square`, blank: hunsSum }
    ],
    widget: 'vertical',
    solution: _addPlaceLines(a, b, sum, 3)
  };
};

/* ── AD7 네 자리 덧뺄 ── */
NM_TGEN['ad7_add4d'] = function(params, rng){
  params = params || {};
  const op = params.op || '+';

  let a, b, result, opChar;
  if(op === '±'){
    opChar = pick(rng, ['+', '-']);
  } else {
    opChar = '+';
  }

  if(opChar === '+'){
    a = R(rng, 1000, 8999);
    b = R(rng, 1000, 9999 - a);
    result = a + b;
  } else {
    a = R(rng, 2000, 9999);
    b = R(rng, 1000, a - 1);
    result = a - b;
  }

  return {
    prompt: {
      ko: `${a} ${opChar} ${b}를 계산해요`,
      en: `Calculate ${a} ${opChar} ${b}`,
      zh: `计算${a}${opChar}${b}`
    },
    tex: `${a} ${opChar === '+' ? '+' : '-'} ${b} = \\square`,
    answer: result,
    answerType: 'number',
    widget: 'vertical',
    solution: opChar === '+' ? _addPlaceLines(a, b, result, 4) : _subPlaceLines(a, b, result, 4)
  };
};

/* ── AD8 여러 수 덧셈(짝 묶기) ── */
NM_TGEN['ad8_multiAdd10'] = function(params, rng){
  params = params || {};
  const termCount  = params.terms    || 4;
  const twoDigit   = params.twoDigit || false;

  /* 짝 1~2쌍 생성 후 나머지 orphan 채우기 */
  const pairCount = termCount <= 4 ? 1 : R(rng, 1, 2);
  let nums = [];
  const pairsList = [];

  for(let i = 0; i < pairCount; i++){
    const x = R(rng, 1, 9);
    nums.push(x, 10 - x);
    pairsList.push([x, 10 - x]);
  }

  /* orphan 추가 */
  let tries = 0;
  const orphans = [];
  while(nums.length < termCount && tries < 100){
    tries++;
    const o = twoDigit && rng() < 0.4
      ? R(rng, 11, 29)
      : R(rng, 1, 9);
    /* 이미 있는 수와 10 짝이 안 되도록 */
    const conflicts = nums.some(n => n + o === 10);
    if(!conflicts){ nums.push(o); orphans.push(o); }
  }

  nums = shuffle(rng, nums);
  const sum = nums.reduce((s, n) => s + n, 0);

  /* solution: 10이 되는 짝부터 묶고, 남은 수(orphan)를 더한 뒤 전체를 합친다 */
  const solution = pairsList.map(p => ({ tex: `${p[0]} + ${p[1]} = \\square`, blank: 10 }));
  const orphanStr = orphans.length ? ` + ${orphans.join(' + ')}` : '';
  solution.push({ tex: `${pairCount * 10}${orphanStr} = \\square`, blank: sum });

  return {
    prompt: {
      ko: `합이 10이 되는 짝을 먼저 찾아 묶어요: ${nums.join(', ')}`,
      en: `Find pairs that make 10 first: ${nums.join(', ')}`,
      zh: `先找出凑成10的数对：${nums.join('、')}`
    },
    tex: nums.join(' + ') + ' = \\square',
    answer: sum,
    answerType: 'number',
    widget: 'selectPairs',
    nums,
    target: 10,
    pairCount,
    solution
  };
};

/* ── AD9 10 이용 덧셈(보정 전략) ──
   §4 다함식 위젯: 전략 병렬 비교(widget:'compareSteps'). 24+10과 24+9를
   나란히 두 열로 두고, 왼쪽(딱 10 더하기)을 풀면 오른쪽이 "10 더하고
   1(또는 2) 빼거나 더하기"로 자동으로 이어진다.
   mode:'compare'  → 두 열 비교 위젯
   mode:'abstract' → 같은 전략을 steps(단계 채우기)로 암산 일반화 */
NM_TGEN['ad9_compAdd'] = function(params, rng){
  params = params || {};
  const mode = params.mode || 'compare';

  const tens = R(rng, 1, 8);
  const ones = R(rng, 1, 9);
  const a = tens*10 + ones;
  /* delta: 10에서 살짝 모자라거나(9,8) 넘치는(11,12) 두 번째 덧셈수의 편차 */
  const delta = pick(rng, [-2, -1, 1, 2]);
  const b2 = 10 + delta;
  const sumLeft  = a + 10;
  const sumRight = a + b2;
  const adjWord  = delta < 0 ? `${Math.abs(delta)} 빼기` : `${delta} 더하기`;
  const adjWordEn = delta < 0 ? `subtract ${Math.abs(delta)}` : `add ${delta}`;
  const adjWordZh = delta < 0 ? `减${Math.abs(delta)}` : `加${delta}`;

  if(mode === 'abstract'){
    return {
      prompt: {
        ko: `${a} + ${b2}를 암산으로! (10을 이용해요)`,
        en: `Add ${a} + ${b2} mentally, using 10 as a helper!`,
        zh: `用10来帮忙心算${a}+${b2}！`
      },
      tex: `${a} + ${b2} = \\square`,
      answer: sumRight,
      answerType: 'steps',
      steps: [
        { tex: `${a} + 10 ${delta<0?'-':'+'} ${Math.abs(delta)}`, blank: sumLeft },
        { tex: `\\square`,                                        blank: sumRight }
      ],
      widget: 'steps',
      solution: [
        { tex: `${a} + 10 = \\square`, blank: sumLeft },
        { tex: `${sumLeft} ${delta<0?'-':'+'} ${Math.abs(delta)} = \\square`, blank: sumRight }
      ]
    };
  }

  return {
    prompt: {
      ko: `왼쪽을 먼저 풀고, 오른쪽은 "10 더하고 ${adjWord}"로 이어가요!`,
      en: `Solve the left side, then the right follows "add 10, then ${adjWordEn}"!`,
      zh: `先算左边，右边接着"加10再${adjWordZh}"！`
    },
    tex: `${a} + 10 = \\square,\\ ${a} + ${b2} = \\square`,
    answer: [sumLeft, sumRight],
    answerType: 'number',
    widget: 'compareSteps',
    compareSteps: {
      a,
      left:  { n: 10, steps: [ { tex: `${a} + 10`, blank: sumLeft } ] },
      right: { n: b2, delta, steps: [
        { tex: `${a} + 10`,               blank: sumLeft  },
        { tex: `${sumLeft} ${delta<0?'-':'+'} ${Math.abs(delta)}`, blank: sumRight }
      ] }
    },
    solution: [
      { tex: `${a} + 10 = \\square`, blank: sumLeft },
      { tex: `${sumLeft} ${delta<0?'-':'+'} ${Math.abs(delta)} = \\square`, blank: sumRight },
      { tex: `${a}+10=\\square,\\ ${a}+${b2}=\\square`, blank: [sumLeft, sumRight] }
    ]
  };
};

/* ============================================================
   AD10 — 연이은 덧셈·뺄셈 (세 수·네 수 혼합) — 2026-08-29 신규
   ============================================================
   6~7세·초1 필수인데 우리에게 없던 유형이다. 확인한 것:
     · AD8 여러 수 덧셈은 **덧셈만** 낸다(`3+1+4+7`). 게다가 기본 위젯이
       selectPairs라 "10이 되는 짝"이 있어야 성립하는 전략 유형이다 —
       혼합 덧뺄을 거기 넣으면 위젯도 개념 문장도 어긋난다.
     · MX1 사칙 혼합계산은 괄호 없는 레벨1조차 곱셈이 섞여 나오고(`5+9×5`)
       prereq가 ML7·DV4라 초5 유형이다.
   그래서 AD8에 레벨로 붙이지 않고 스레드를 새로 냈다.

   규칙: 앞에서부터 차례로 계산한다. 중간 결과가 음수가 되는 식(`3-5+4`)은
   만들지 않는다 — 유아·초1 대상이다.
   params: terms(항 수) · max(중간·최종 결과 상한) · cross(10을 넘나들 것) */
NM_TGEN['ad10_chainAddSub'] = function(params, rng){
  params = params || {};
  const terms = params.terms || 3;
  const max   = params.max   || 10;
  const cross = !!params.cross;

  let nums = [], ops = [], partial = [], ok = false;

  for(let attempt = 0; attempt < 400 && !ok; attempt++){
    nums = [R(rng, 1, Math.min(9, max))];
    ops  = [];
    partial = [nums[0]];
    let cur = nums[0], bad = false;

    for(let i = 1; i < terms; i++){
      /* 이번 자리에 쓸 수 있는 연산을 실제 범위로 먼저 걸러낸다 —
         고른 뒤에 버리면 뺄셈이 늘 마지막에만 오는 편향이 생긴다. */
      const canAdd = cur + 1 <= max;
      const canSub = cur - 1 >= 0;
      if(!canAdd && !canSub){ bad = true; break; }
      const op = (canAdd && canSub) ? pick(rng, ['+', '-']) : (canAdd ? '+' : '-');
      const hi = op === '+' ? Math.min(9, max - cur) : Math.min(9, cur);
      if(hi < 1){ bad = true; break; }
      const v = R(rng, 1, hi);
      cur = op === '+' ? cur + v : cur - v;
      nums.push(v); ops.push(op); partial.push(cur);
    }
    if(bad) continue;

    /* 덧셈만 나오면 AD8과 구별이 안 된다 — 뺄셈이 최소 한 번은 들어가야 한다 */
    if(ops.indexOf('-') === -1) continue;
    /* 중간 결과가 0이면(`1-1+7`) 앞의 두 항이 통째로 사라져 두 수 문제가 된다.
       마지막 값이 0인 것(`8-4-4`)은 답이 0일 뿐이라 그대로 둔다. */
    if(partial.slice(1, -1).some(p => p === 0)) continue;
    /* 더했다가 같은 수를 도로 빼는 자리(`9+9-9`)도 실제로는 계산이 없다 */
    let undo = false;
    for(let i = 1; i < ops.length; i++)
      if(ops[i] !== ops[i - 1] && nums[i] === nums[i + 1]) undo = true;
    if(undo) continue;
    /* 초1 레벨: 10을 넘거나 10에서 내려오는 자리가 한 번은 있어야
       받아올림·받아내림 연습이 된다 */
    if(cross && !partial.some(p => p > 10)) continue;
    ok = true;
  }

  /* 절대 폴백 (이론상 발생 안 함) */
  if(!ok){ nums = [8, 3, 2]; ops = ['-', '+']; partial = [8, 5, 7]; }

  let exprTex = String(nums[0]);
  for(let i = 0; i < ops.length; i++) exprTex += ` ${ops[i]} ${nums[i + 1]}`;
  const answer = partial[partial.length - 1];

  /* 단계 줄 — 앞에서부터 차례로 계산하는 순서 그대로.
     MX1과 같은 모양이라 인쇄물에서도 초1이 짚어 가며 풀 수 있다. */
  const steps = [];
  let run = nums[0];
  for(let i = 0; i < ops.length; i++){
    steps.push({ tex: `${run} ${ops[i]} ${nums[i + 1]} = \\square`, blank: partial[i + 1] });
    run = partial[i + 1];
  }

  return {
    prompt: {
      ko: '앞에서부터 차례로 계산해요',
      en: 'Work from left to right, one step at a time',
      zh: '从前往后依次计算'
    },
    tex:        `${exprTex} = \\square`,
    answer,
    answerType: 'steps',
    widget:     'steps',
    steps
  };
};

if(typeof module !== 'undefined' && module.exports) module.exports = NM_TGEN;
})();
