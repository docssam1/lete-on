/* ============================================================
   Numbers of Magic — NS (Number Sense) + AD (Addition) Thread Generators
   NS1~NS5, AD1~AD8  (13 generators)
   계약: NM_TGEN[key] = (params, rng) => problem
   Math.random 사용 금지 — 주입된 rng만 사용
   ============================================================ */
(function(){
'use strict';

const {R, pick, shuffle} = NM_RNG;

/* ── 자릿값 이름 헬퍼 ── */
const PLACE_KO  = ['일','십','백','천','만'];
const PLACE_EN  = ['ones','tens','hundreds','thousands','ten-thousands'];
const PLACE_ZH  = ['个位','十位','百位','千位','万位'];

/* ── NS1 자릿값 읽기 ── */
NM_TGEN['ns1_placeValue'] = function(params, rng){
  params = params || {};
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
  return {
    prompt: {
      ko: `${n}에서 ${ko}의 자리 숫자는 얼마일까요?`,
      en: `In ${n}, what digit is in the ${en} place?`,
      zh: `${n}的${zh}是几？`
    },
    tex: `${n}에서 ${ko}의 자리 = \\square`,
    answer: digitAt,
    answerType: 'number',
    widget: 'missing'
  };
};

/* ── NS2 모으기·가르기 ── */
NM_TGEN['ns2_split'] = function(params, rng){
  params = params || {};
  const max = params.max || 9;
  const n = R(rng, 2, max);
  const a = R(rng, 1, n - 1);
  const b = n - a;

  /* 절반 확률로 □+b=n vs a+□=n */
  const blankFirst = rng() < 0.5;
  const tex = blankFirst
    ? `\\square + ${b} = ${n}`
    : `${a} + \\square = ${n}`;
  const answerVal = blankFirst ? a : b;
  const knownPart = blankFirst ? b : a;

  return {
    prompt: {
      ko: `${n}을 ${knownPart}과 얼마로 가를까요?`,
      en: `Split ${n}: ${knownPart} and how much?`,
      zh: `把${n}分成${knownPart}和多少？`
    },
    tex,
    answer: answerVal,
    answerType: 'number',
    widget: 'cubes',
    cubes: { piles: [a, b], moveTo: n }
  };
};

/* ── NS3 보수 5·10 ── */
NM_TGEN['ns3_comp510'] = function(params, rng){
  params = params || {};
  const target = params.target || 10;
  /* k는 1 이상, target-1 이하 */
  const k = R(rng, 1, target - 1);
  const need = target - k;

  return {
    prompt: {
      ko: `${k}에서 ${target}을 만들려면 얼마가 더 필요해요?`,
      en: `You have ${k}. How many more to make ${target}?`,
      zh: `有${k}个，还需要几个才能凑成${target}？`
    },
    tex: `${k} + \\square = ${target}`,
    answer: need,
    answerType: 'steps',
    steps: [{ tex: `${k} + \\square = ${target}`, blank: need }],
    widget: 'tenframe',
    cubes: { piles: [k, need], moveTo: target }
  };
};

/* ── NS4 보수 100·1000 ── */
NM_TGEN['ns4_comp100'] = function(params, rng){
  params = params || {};
  const target = params.target || 100;
  const step   = params.step   || 10;

  /* a: step의 배수이면서 target 미만 */
  const multCount = Math.floor(target / step) - 1; /* 1 ~ multCount */
  const mult = R(rng, 1, multCount);
  const a = mult * step;
  const b = target - a;

  return {
    prompt: {
      ko: `${a}에 얼마를 더하면 ${target}이 될까요?`,
      en: `What do you add to ${a} to get ${target}?`,
      zh: `${a}加多少等于${target}？`
    },
    tex: `${a} + \\square = ${target}`,
    answer: b,
    answerType: 'steps',
    steps: [{ tex: `${a} + \\square = ${target}`, blank: b }],
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
  let tex, answer, promptKo, promptEn, promptZh;

  if(variant < 0.33 && n > min){
    /* near-double: n + (n-1) */
    const m = n - 1;
    tex = `${n} + ${m} = \\square`;
    answer = n + m;
    promptKo = `${n} 더하기 ${m}은 얼마일까요?`;
    promptEn = `What is ${n} + ${m}?`;
    promptZh = `${n}加${m}等于多少？`;
  } else if(variant < 0.66 && n < max){
    /* near-double: n + (n+1) */
    const m = n + 1;
    tex = `${n} + ${m} = \\square`;
    answer = n + m;
    promptKo = `${n} 더하기 ${m}은 얼마일까요?`;
    promptEn = `What is ${n} + ${m}?`;
    promptZh = `${n}加${m}等于多少？`;
  } else {
    /* pure double */
    tex = `${n} + ${n} = \\square`;
    answer = 2 * n;
    promptKo = `${n}의 두 배는 얼마일까요?`;
    promptEn = `What is double ${n}?`;
    promptZh = `${n}的两倍是多少？`;
  }

  return {
    prompt: { ko: promptKo, en: promptEn, zh: promptZh },
    tex,
    answer,
    answerType: 'number',
    widget: 'cubes',
    cubes: { piles: [n, n], moveTo: answer }
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
    cubes: { piles: [a, b], moveTo: sum }
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
      cubes: { piles: [a, b], moveTo: 10 }
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
    cubes: { piles: [a, b], moveTo: 10 }
  };
};

/* ── AD3 두 자리+한 자리 ── */
NM_TGEN['ad3_add2d1d'] = function(params, rng){
  params = params || {};
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
      widget: 'steps'
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
      widget: 'steps'
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
    widget: 'steps'
  };
};

/* ── AD4 몇십·몇백 덧뺄 ── */
NM_TGEN['ad4_addTens'] = function(params, rng){
  params = params || {};
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
      widget: 'missing'
    };
  }

  return {
    prompt: {
      ko: `${bigA} ${op} ${bigB}는 얼마일까요?`,
      en: `What is ${bigA} ${op} ${bigB}?`,
      zh: `${bigA}${op}${bigB}等于多少？`
    },
    tex: `${bigA} ${op === '+' ? '+' : '-'} ${bigB} = \\square`,
    answer: result,
    answerType: 'number',
    widget: 'missing'
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
    widget: 'vertical'
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
    widget: 'vertical'
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
    widget: 'vertical'
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

  for(let i = 0; i < pairCount; i++){
    const x = R(rng, 1, 9);
    nums.push(x, 10 - x);
  }

  /* orphan 추가 */
  let tries = 0;
  while(nums.length < termCount && tries < 100){
    tries++;
    const o = twoDigit && rng() < 0.4
      ? R(rng, 11, 29)
      : R(rng, 1, 9);
    /* 이미 있는 수와 10 짝이 안 되도록 */
    const conflicts = nums.some(n => n + o === 10);
    if(!conflicts){ nums.push(o); }
  }

  nums = shuffle(rng, nums);
  const sum = nums.reduce((s, n) => s + n, 0);

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
    pairCount
  };
};

if(typeof module !== 'undefined' && module.exports) module.exports = NM_TGEN;
})();
