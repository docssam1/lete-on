/* ============================================================
   Numbers of Magic — ML 곱셈 스레드 생성기 (ML1~ML11)
   계약: NM_TGEN[genKey] = function(params, rng) { return problem; }
   절대 Math.random() 사용 금지 — R(rng,a,b) / pick(rng,arr) / shuffle(rng,arr) 만 사용
   ============================================================ */
(function(){
'use strict';

const { R, pick, shuffle } = NM_RNG;

/* ── ML1 — 배와 반 (×2 · ÷2) ─────────────────────────────── */
NM_TGEN['ml1_double'] = function(params, rng) {
  const op  = params.op  || 'x2';
  const max = params.max || 99;

  /* mix 모드: 0=x2, 1=d2 */
  const doX2 = (op === 'x2') || (op === 'mix' && R(rng, 0, 1) === 0);

  if (doX2) {
    const n      = R(rng, 1, Math.floor(max / 2));
    const answer = 2 * n;
    return {
      prompt: {
        ko: `${n}의 두 배는?`,
        en: `What is double ${n}?`,
        zh: `${n}的两倍是多少？`
      },
      tex: `${n} \\times 2 = \\square`,
      answer,
      answerType: 'number',
      widget: 'array',
      array: { n: answer, rows: 2 }
    };
  } else {
    /* d2: 짝수 n = R(rng,1,max/4)*2 → n/2 가 정수 보장 */
    const n      = R(rng, 1, Math.floor(max / 4)) * 2;
    const answer = n / 2;
    return {
      prompt: {
        ko: `${n}을 반으로 나누면?`,
        en: `What is half of ${n}?`,
        zh: `${n}除以2等于多少？`
      },
      tex: `${n} \\div 2 = \\square`,
      answer,
      answerType: 'number',
      widget: 'array',
      array: { n, rows: 2 }
    };
  }
};

/* ── ML2 — 곱셈구구 2~5단 ─────────────────────────────────── */
NM_TGEN['ml2_tt25'] = function(params, rng) {
  const tables = params.tables || [2, 3];
  const t      = pick(rng, tables);
  const n      = R(rng, 1, 9);
  const answer = t * n;

  /* 랜덤으로 t×n 또는 n×t 순서 선택 */
  const flip = R(rng, 0, 1) === 1;
  const tex  = flip
    ? `${n} \\times ${t} = \\square`
    : `${t} \\times ${n} = \\square`;

  return {
    prompt: {
      ko: `${t} × ${n}은 얼마일까요?`,
      en: `What is ${t} times ${n}?`,
      zh: `${t}×${n}等于多少？`
    },
    tex,
    answer,
    answerType: 'number',
    widget: 'array',
    array: { n: answer, rows: t }
  };
};

/* ── ML3 — 곱셈구구 6~9단 ─────────────────────────────────── */
NM_TGEN['ml3_tt69'] = function(params, rng) {
  const tables = params.tables || [6, 7];
  const t      = pick(rng, tables);
  const n      = R(rng, 1, 9);
  const answer = t * n;

  const flip = R(rng, 0, 1) === 1;
  const tex  = flip
    ? `${n} \\times ${t} = \\square`
    : `${t} \\times ${n} = \\square`;

  return {
    prompt: {
      ko: `${t} × ${n}은 얼마일까요?`,
      en: `What is ${t} times ${n}?`,
      zh: `${t}×${n}等于多少？`
    },
    tex,
    answer,
    answerType: 'number',
    widget: 'array',
    array: { n: answer, rows: t }
  };
};

/* ── ML4 — 구구 mix · □채우기 ─────────────────────────────── */
NM_TGEN['ml4_ttMix'] = function(params, rng) {
  const missing = params.missing === true;
  const t       = R(rng, 2, 9);
  const n       = R(rng, 1, 9);
  const product = t * n;

  if (!missing) {
    return {
      prompt: {
        ko: `${t} × ${n}은 얼마일까요?`,
        en: `What is ${t} times ${n}?`,
        zh: `${t}×${n}等于多少？`
      },
      tex: `${t} \\times ${n} = \\square`,
      answer: product,
      answerType: 'number',
      widget: 'numpad'
    };
  }

  /* missing factor: □×n=product 또는 t×□=product */
  const missingFirst = R(rng, 0, 1) === 0;
  const tex    = missingFirst
    ? `\\square \\times ${n} = ${product}`
    : `${t} \\times \\square = ${product}`;
  const answer = missingFirst ? t : n;

  return {
    prompt: {
      ko: '빈 칸에 알맞은 수는?',
      en: 'What goes in the box?',
      zh: '方框里填什么？'
    },
    tex,
    answer,
    answerType: 'number',
    widget: 'missing'
  };
};

/* ── ML5 — 몇십 곱 (tens×1d, tens×tens) ──────────────────── */
NM_TGEN['ml5_tensMul'] = function(params, rng) {
  const mode = params.mode || 't1';

  if (mode === 't1') {
    /* 몇십 × 한 자리: a=10·20…90, b=2~9 */
    const a      = R(rng, 1, 9) * 10;
    const b      = R(rng, 2, 9);
    const aTens  = Math.floor(a / 10);
    const mid    = aTens * b;
    const answer = a * b;

    return {
      prompt: {
        ko: `${a} × ${b}을 몇십 곱셈으로 계산해요`,
        en: `Calculate ${a} × ${b} using tens multiplication`,
        zh: `用整十乘法计算 ${a} × ${b}`
      },
      tex: `${a} \\times ${b} = \\square`,
      answer,
      answerType: 'steps',
      widget: 'steps',
      steps: [
        { tex: `${aTens} \\times ${b} = \\square`,  blank: mid    },
        { tex: `${mid} \\times 10 = \\square`,       blank: answer }
      ]
    };
  }

  if (mode === 'h1') {
    /* 몇백 × 한 자리: a=100·200…900, b=2~9 */
    const a       = R(rng, 1, 9) * 100;
    const b       = R(rng, 2, 9);
    const aHunds  = Math.floor(a / 100);
    const mid     = aHunds * b;
    const answer  = a * b;

    return {
      prompt: {
        ko: `${a} × ${b}을 몇백 곱셈으로 계산해요`,
        en: `Calculate ${a} × ${b} using hundreds multiplication`,
        zh: `用整百乘法计算 ${a} × ${b}`
      },
      tex: `${a} \\times ${b} = \\square`,
      answer,
      answerType: 'steps',
      widget: 'steps',
      steps: [
        { tex: `${aHunds} \\times ${b} = \\square`,  blank: mid    },
        { tex: `${mid} \\times 100 = \\square`,        blank: answer }
      ]
    };
  }

  /* mode === 'tt': 몇십 × 몇십 */
  const a      = R(rng, 1, 9) * 10;
  const b      = R(rng, 1, 9) * 10;
  const aTens  = Math.floor(a / 10);
  const bTens  = Math.floor(b / 10);
  const mid    = aTens * bTens;
  const answer = a * b;

  return {
    prompt: {
      ko: `${a} × ${b}을 몇십×몇십으로 계산해요`,
      en: `Calculate ${a} × ${b} using tens × tens`,
      zh: `计算 ${a} × ${b}（整十×整十）`
    },
    tex: `${a} \\times ${b} = \\square`,
    answer,
    answerType: 'steps',
    widget: 'steps',
    steps: [
      { tex: `${aTens} \\times ${bTens} = \\square`,  blank: mid    },
      { tex: `${mid} \\times 100 = \\square`,          blank: answer }
    ]
  };
};

/* ── ML6 — 두 자리×한 자리 (분배 암산) ──────────────────────── */
NM_TGEN['ml6_mul2d1dMental'] = function(params, rng) {
  const easy = params.easy !== false;
  let a, b;

  if (easy) {
    /* easy: a가 몇십이거나 b가 2~3 */
    if (R(rng, 0, 1) === 0) {
      a = R(rng, 1, 9) * 10;   /* 10·20…90 */
      b = R(rng, 2, 9);
    } else {
      a = R(rng, 11, 99);
      b = pick(rng, [2, 3]);
    }
  } else {
    /* 일반: a는 두 자리(일의 자리≠0), b=4~9 */
    do { a = R(rng, 11, 99); } while (a % 10 === 0);
    b = R(rng, 4, 9);
  }

  const tens   = Math.floor(a / 10);
  const ones   = a % 10;
  const tensV  = tens * 10;
  const step1  = tensV * b;
  const step2  = ones * b;
  const answer = a * b;

  return {
    prompt: {
      ko: `${a}를 ${tensV}과 ${ones}으로 나누어 ${b}을 곱해요`,
      en: `Split ${a} into ${tensV} and ${ones}, then multiply each by ${b}`,
      zh: `把${a}拆成${tensV}和${ones}，分别乘以${b}`
    },
    tex: `${a} \\times ${b} = \\square`,
    answer,
    answerType: 'steps',
    widget: 'steps',
    steps: [
      { tex: `${tensV} \\times ${b} = \\square`,    blank: step1  },
      { tex: `${ones} \\times ${b} = \\square`,     blank: step2  },
      { tex: `${step1} + ${step2} = \\square`,       blank: answer }
    ]
  };
};

/* ── ML7 — 세 자리×한 자리 ───────────────────────────────── */
NM_TGEN['ml7_mul3d1d'] = function(params, rng) {
  const vertical = params.vertical === true;
  const lv       = params.level || 'main';
  const a        = R(rng, lv === 'practice' ? 101 : 100, lv === 'practice' ? 399 : 999);
  const b        = R(rng, 2, lv === 'practice' ? 4 : 9);
  const h        = Math.floor(a / 100);
  const t        = Math.floor((a % 100) / 10);
  const o        = a % 10;
  const answer   = a * b;

  if (!vertical) {
    /* 가로 분배법 */
    const hPart = h * 100 * b;
    const tPart = t * 10  * b;
    const oPart = o       * b;

    return {
      prompt: {
        ko: `${a} × ${b}을 백·십·일로 나누어 계산해요`,
        en: `Calculate ${a} × ${b} by splitting into hundreds, tens, and ones`,
        zh: `把${a}分成百位·十位·个位分别乘${b}`
      },
      tex: `${a} \\times ${b} = \\square`,
      answer,
      answerType: 'steps',
      widget: 'steps',
      steps: [
        { tex: `${h * 100} \\times ${b} = \\square`,               blank: hPart  },
        { tex: `${t * 10} \\times ${b} = \\square`,                blank: tPart  },
        { tex: `${o} \\times ${b} = \\square`,                     blank: oPart  },
        { tex: `${hPart} + ${tPart} + ${oPart} = \\square`,        blank: answer }
      ]
    };
  }

  /* 세로셈: 올림 포함 단계별 */
  const oRes    = o * b;
  const oCarry  = Math.floor(oRes / 10);
  const tRes    = t * b + oCarry;
  const tCarry  = Math.floor(tRes / 10);
  const hRes    = h * b + tCarry;

  return {
    prompt: {
      ko: `${a} × ${b}을 세로셈으로 계산해요`,
      en: `Calculate ${a} × ${b} using vertical multiplication`,
      zh: `用竖式计算 ${a} × ${b}`
    },
    tex: `${a} \\times ${b} = \\square`,
    answer,
    answerType: 'steps',
    widget: 'vertical',
    steps: [
      { tex: `${o} \\times ${b} = \\square`,                        blank: oRes   },
      { tex: `${t} \\times ${b} + ${oCarry} = \\square`,           blank: tRes   },
      { tex: `${h} \\times ${b} + ${tCarry} = \\square`,           blank: hRes   }
    ]
  };
};

/* ── ML8 — 두 자리×두 자리 ───────────────────────────────── */
NM_TGEN['ml8_mul2d2d'] = function(params, rng) {
  const easy = params.easy !== false;
  let a, b;

  if (easy) {
    a = R(rng, 11, 99);
    /* easy b: 몇십(×1d급) 또는 십의 자리=1(11~19) */
    const easyBs = [10,20,30,40,50,60,70,80,90,
                    11,12,13,14,15,16,17,18,19];
    b = pick(rng, easyBs);
    if (b === a) b = pick(rng, easyBs);
  } else {
    a = R(rng, 11, 99);
    b = R(rng, 11, 99);
  }

  const bTens  = Math.floor(b / 10);
  const bOnes  = b % 10;
  const part1  = a * bTens * 10;
  const part2  = a * bOnes;
  const answer = a * b;

  return {
    prompt: {
      ko: `${a} × ${b}을 분배법칙으로 계산해요`,
      en: `Calculate ${a} × ${b} using the distributive law`,
      zh: `用分配律计算 ${a} × ${b}`
    },
    tex: `${a} \\times ${b} = \\square`,
    answer,
    answerType: 'steps',
    widget: 'vertical',
    steps: [
      { tex: `${a} \\times ${bTens * 10} = \\square`,              blank: part1  },
      { tex: `${a} \\times ${bOnes} = \\square`,                   blank: part2  },
      { tex: `${part1} + ${part2} = \\square`,                      blank: answer }
    ]
  };
};

/* ── ML9 — 세 자리×두 자리 ───────────────────────────────── */
NM_TGEN['ml9_mul3d2d'] = function(params, rng) {
  const a      = R(rng, 100, 999);
  const b      = R(rng, 11, 99);
  const answer = a * b;

  return {
    prompt: {
      ko: `${a} × ${b}을 계산해요`,
      en: `Calculate ${a} × ${b}`,
      zh: `计算 ${a} × ${b}`
    },
    tex: `${a} \\times ${b} = \\square`,
    answer,
    answerType: 'number',
    widget: 'vertical'
  };
};

/* ── ML10 — 특수곱 (19단 · 99단 · 기준곱) ─────────────────── */
NM_TGEN['ml10_specialMul'] = function(params, rng) {
  const mode = params.mode || 't19';

  /* ─ t19: 11~19단 교차 트릭 ─ */
  if (mode === 't19') {
    const a      = R(rng, 11, 19);
    const b      = R(rng, 11, 19);
    const answer = a * b;
    /* 방법: (10+p)(10+q) = (10+p+q)×10 + p×q
       step1: (a + b의 일의 자리) × 10
       step2: a의 일의 자리 × b의 일의 자리
       step3: 합산 */
    const aOnes = a - 10;
    const bOnes = b - 10;
    const cross = (a + bOnes) * 10;   /* = (10+aOnes+bOnes)×10 */
    const dot   = aOnes * bOnes;

    return {
      prompt: {
        ko: `${a} × ${b}을 19단 방법으로 계산해요`,
        en: `Calculate ${a} × ${b} using the 11-19 cross method`,
        zh: `用19段法计算 ${a} × ${b}`
      },
      tex: `${a} \\times ${b} = \\square`,
      answer,
      answerType: 'steps',
      widget: 'steps',
      steps: [
        { tex: `(${a} + ${bOnes}) \\times 10 = \\square`, blank: cross  },
        { tex: `${aOnes} \\times ${bOnes} = \\square`,    blank: dot    },
        { tex: `${cross} + ${dot} = \\square`,             blank: answer }
      ]
    };
  }

  /* ─ t99: (100−1)×n 트릭 ─ */
  if (mode === 't99') {
    const n      = R(rng, 2, 99);
    const answer = 99 * n;

    return {
      prompt: {
        ko: `99 × ${n}을 (100 - 1) × ${n}으로 계산해요`,
        en: `Calculate 99 × ${n} as (100 − 1) × ${n}`,
        zh: `用(100−1)×${n}计算 99×${n}`
      },
      tex: `99 \\times ${n} = \\square`,
      answer,
      answerType: 'steps',
      widget: 'steps',
      steps: [
        { tex: `100 \\times ${n} - ${n} = \\square`, blank: answer }
      ]
    };
  }

  /* ─ anchor: 25×4=100, 37×3=111, 125×8=1000 활용 ─ */
  const anchorId = pick(rng, ['a25', 'a37', 'a125']);

  if (anchorId === 'a25') {
    /* n×25 = n×100÷4. n을 4의 배수로 제한 */
    const k      = R(rng, 1, 24);
    const n      = k * 4;
    const answer = n * 25;

    return {
      prompt: {
        ko: `${n} × 25 = ${n} × 100 ÷ 4로 계산해요`,
        en: `Calculate ${n} × 25 as ${n} × 100 ÷ 4`,
        zh: `用 ${n}×100÷4 计算 ${n}×25`
      },
      tex: `${n} \\times 25 = \\square`,
      answer,
      answerType: 'steps',
      widget: 'steps',
      steps: [
        { tex: `${n} \\times 100 = \\square`,      blank: n * 100 },
        { tex: `${n * 100} \\div 4 = \\square`,    blank: answer  }
      ]
    };
  }

  if (anchorId === 'a37') {
    /* 37×3=111, 37×(3m)=111×m */
    const m      = R(rng, 1, 9);
    const factor = 3 * m;
    const answer = 37 * factor;

    return {
      prompt: {
        ko: `37 × ${factor}을 37 × 3 = 111 활용해 계산해요`,
        en: `Calculate 37 × ${factor} using 37 × 3 = 111`,
        zh: `利用 37×3=111 计算 37×${factor}`
      },
      tex: `37 \\times ${factor} = \\square`,
      answer,
      answerType: 'steps',
      widget: 'steps',
      steps: [
        { tex: `37 \\times 3 = \\square`,          blank: 111    },
        { tex: `111 \\times ${m} = \\square`,       blank: answer }
      ]
    };
  }

  /* anchorId === 'a125': 125×8=1000 */
  const m      = R(rng, 1, 9);
  const factor = 8 * m;
  const answer = 125 * factor;

  return {
    prompt: {
      ko: `125 × ${factor}을 125 × 8 = 1000 활용해 계산해요`,
      en: `Calculate 125 × ${factor} using 125 × 8 = 1000`,
      zh: `利用 125×8=1000 计算 125×${factor}`
    },
    tex: `125 \\times ${factor} = \\square`,
    answer,
    answerType: 'steps',
    widget: 'steps',
    steps: [
      { tex: `125 \\times 8 = \\square`,         blank: 1000   },
      { tex: `1000 \\times ${m} = \\square`,      blank: answer }
    ]
  };
};

/* ── ML11 — 제곱수·거듭제곱 ──────────────────────────────── */
NM_TGEN['ml11_squares'] = function(params, rng) {
  const powers = params.powers === true;

  if (!powers) {
    /* 제곱수: n²  (lo~hi 범위) */
    const lo     = params.lo || 11;
    const hi     = params.hi || 20;
    const n      = R(rng, lo, hi);
    const answer = n * n;

    return {
      prompt: {
        ko: `${n}의 제곱은?`,
        en: `What is ${n} squared?`,
        zh: `${n}的平方是多少？`
      },
      tex: `${n}^2 = \\square`,
      answer,
      answerType: 'steps',
      widget: 'array',
      array: { n: answer, rows: n },
      steps: [
        { tex: `${n} \\times ${n} = \\square`, blank: answer }
      ]
    };
  }

  /* 거듭제곱: base^exp (2·3·5, exp=2~5) */
  const base   = pick(rng, [2, 3, 5]);
  const exp    = R(rng, 2, 5);
  const answer = Math.pow(base, exp) | 0;   /* 항상 정수 */

  /* 연속 곱셈 단계: base² → base³ → … → base^exp */
  const steps = [];
  let product  = base;
  for (let e = 2; e <= exp; e++) {
    const prev  = product;
    product    *= base;
    steps.push({ tex: `${prev} \\times ${base} = \\square`, blank: product });
  }

  return {
    prompt: {
      ko: `${base}의 ${exp}제곱은?`,
      en: `What is ${base} to the power of ${exp}?`,
      zh: `${base}的${exp}次方是多少？`
    },
    tex: `${base}^{${exp}} = \\square`,
    answer,
    answerType: 'steps',
    widget: 'steps',
    steps
  };
};

/* ── ML_PAIR10 — 곱해서 10/100 만들기 & 분해곱셈법 ─────────── */
NM_TGEN['ml_pair10'] = function(params, rng) {
  const target = params.target || 10;
  const mode   = params.mode   || 'three';
  const lv     = params.level  || 'main';

  if (target === 10) {
    const bMax = lv === 'practice' ? 5 : 9;
    const b      = R(rng, 2, bMax);
    const answer = 2 * b * 5;            /* = 10 × b */
    return {
      prompt:{ ko:`2 × ${b} × 5를 쌍을 찾아 쉽게 계산해요`,
               en:`Find the pair to easily compute 2 × ${b} × 5`,
               zh:`找到乘积为10的对，轻松计算 2 × ${b} × 5` },
      tex:`2 \\times ${b} \\times 5 = \\square`,
      answer, answerType:'steps', widget:'steps',
      steps:[
        { tex:`2 \\times 5 = \\square`,     blank:10      },
        { tex:`10 \\times ${b} = \\square`, blank:answer  }
      ]
    };
  }

  if (mode === 'decomp') {
    /* 분해곱셈법: n × 25 → (k×4) × 25 = k×100  (4의 배수 n=4k) */
    const k      = R(rng, 2, 12);
    const n      = k * 4;
    const answer = n * 25;
    return {
      prompt:{ ko:`${n} × 25를 분해해서 계산해요`,
               en:`Decompose to compute ${n} × 25`,
               zh:`分解计算 ${n} × 25` },
      tex:`${n} \\times 25 = \\square`,
      answer, answerType:'steps', widget:'steps',
      steps:[
        { tex:`${n} = ${k} \\times \\square`, blank:4   },
        { tex:`4 \\times 25 = \\square`,      blank:100 },
        { tex:`${k} \\times 100 = \\square`,  blank:answer }
      ]
    };
  }

  /* target===100: 4×25=100 쌍 포함 세 수 곱 */
  const bMax2 = lv === 'practice' ? 5 : 9;
  const b      = R(rng, 2, bMax2);
  const answer = 4 * b * 25;             /* = 100 × b */
  return {
    prompt:{ ko:`4 × ${b} × 25를 쌍을 찾아 계산해요`,
             en:`Find the pair to compute 4 × ${b} × 25`,
             zh:`找到乘积为100的对，计算 4 × ${b} × 25` },
    tex:`4 \\times ${b} \\times 25 = \\square`,
    answer, answerType:'steps', widget:'steps',
    steps:[
      { tex:`4 \\times 25 = \\square`,      blank:100    },
      { tex:`100 \\times ${b} = \\square`,  blank:answer }
    ]
  };
};

/* ── ML_GAUSS — 가우스 덧셈 (등차수열 합) ────────────────────── */
NM_TGEN['ml_gauss'] = function(params, rng) {
  const lv = params.level || 'main';
  const nMax = lv === 'practice' ? 5 : 10;
  const n      = R(rng, 3, nMax) * 2;
  const total  = n * (n + 1) / 2;
  const pairs  = n / 2;
  const pairSum= n + 1;

  return {
    prompt:{ ko:`1부터 ${n}까지 더하면 얼마일까요?`,
             en:`What is the sum from 1 to ${n}?`,
             zh:`1加到${n}等于多少？` },
    tex:`1 + 2 + \\cdots + ${n} = \\square`,
    answer:total, answerType:'steps', widget:'steps',
    steps:[
      { tex:`1 + ${n} = \\square`,               blank:pairSum },
      { tex:`\\text{쌍의 수} = ${n} \\div 2 = \\square`, blank:pairs },
      { tex:`${pairSum} \\times ${pairs} = \\square`, blank:total  }
    ]
  };
};

/* ── ML_X9 — ×9 전략 (n×9=n×10−n) ──────────────────────────── */
NM_TGEN['ml_x9'] = function(params, rng) {
  const lv = params.level || 'main';
  const n      = lv === 'practice' ? R(rng, 2, 12) : R(rng, 2, 99);
  const answer = n * 9;

  return {
    prompt:{ ko:`${n} × 9를 ×10 빼기 전략으로 계산해요`,
             en:`Compute ${n} × 9 using the ×10 minus strategy`,
             zh:`用×10减的策略计算 ${n} × 9` },
    tex:`${n} \\times 9 = \\square`,
    answer, answerType:'steps', widget:'steps',
    steps:[
      { tex:`${n} \\times 10 = \\square`,        blank:n*10   },
      { tex:`${n*10} - ${n} = \\square`,          blank:answer }
    ]
  };
};

/* ── ML_OVERMUL — 더 곱해주고 빼기 (올림빼기) ───────────────── */
NM_TGEN['ml_overmul'] = function(params, rng) {
  const lv      = params.level || 'main';
  const rounds  = lv === 'practice' ? [10] : [10, 100];
  const round   = pick(rng, rounds);
  const k       = R(rng, 1, 3);
  const near    = round - k;
  const aMax    = lv === 'practice' ? 9 : (round === 10 ? 19 : 9);
  const a       = R(rng, 2, aMax);
  const answer  = a * near;

  return {
    prompt:{ ko:`${a} × ${near}를 올림빼기 전략으로 계산해요`,
             en:`Compute ${a} × ${near} using the over-subtract strategy`,
             zh:`用多乘再减策略计算 ${a} × ${near}` },
    tex:`${a} \\times ${near} = \\square`,
    answer, answerType:'steps', widget:'steps',
    steps:[
      { tex:`${a} \\times ${round} = \\square`,       blank:a*round  },
      { tex:`${a} \\times ${k} = \\square`,           blank:a*k      },
      { tex:`${a*round} - ${a*k} = \\square`,          blank:answer   }
    ]
  };
};

/* ── ML_DIGIT_PRED — 몇 자리 수 예측 ────────────────────────── */
NM_TGEN['ml_digit_pred'] = function(params, rng) {
  const lv = params.level || 'main';
  const hi = lv === 'practice' ? 31 : 49;
  const a      = R(rng, 11, hi);
  const b      = R(rng, 11, hi);
  const answer = a * b;
  const digits = answer.toString().length;

  const aT  = Math.floor(a / 10);
  const bT  = Math.floor(b / 10);
  const leadProd = aT * bT;

  return {
    prompt:{ ko:`${a} × ${b}는 몇 자리 수일지 예측하고 계산해요`,
             en:`Predict the digit count of ${a} × ${b}, then compute it`,
             zh:`预测 ${a} × ${b} 的位数，然后计算` },
    tex:`${a} \\times ${b} = \\square`,
    answer, answerType:'steps', widget:'steps',
    steps:[
      { tex:`${aT} \\times ${bT} = \\square \\;\\text{(앞 자리 곱)}`, blank:leadProd },
      { tex:`\\therefore \\; \\text{${digits}자리} \\;|\\; ${a} \\times ${b} = \\square`, blank:answer }
    ]
  };
};

/* ── ML_X11 — ×11 전략 (ab×11 = a_(a+b)_b) ─────────────────── */
NM_TGEN['ml_x11'] = function(params, rng) {
  const lv = params.level || 'main';
  /* practice: 올림 없는 수(십의 자리+일의 자리 < 10) 우선 */
  let a;
  if (lv === 'practice') {
    do { a = R(rng, 11, 54); } while ((Math.floor(a/10) + a%10) >= 10);
  } else {
    a = R(rng, 11, 99);
  }
  const aT     = Math.floor(a / 10);
  const aO     = a % 10;
  const mid    = aT + aO;
  const answer = a * 11;

  /* 올림 있을 때 별도 처리 */
  if (mid >= 10) {
    /* 올림: (aT+1) | (mid-10) | aO */
    const h = aT + 1;
    const m = mid - 10;
    return {
      prompt:{ ko:`${a} × 11을 ×11 전략으로 계산해요`,
               en:`Compute ${a} × 11 using the ×11 trick`,
               zh:`用×11技巧计算 ${a} × 11` },
      tex:`${a} \\times 11 = \\square`,
      answer, answerType:'steps', widget:'steps',
      steps:[
        { tex:`${aT} + ${aO} = \\square \\;\\text{(가운데 자리)}`, blank:mid    },
        { tex:`\\text{올림 포함} \\Rightarrow ${h}${m}${aO}= \\square`, blank:answer }
      ]
    };
  }

  return {
    prompt:{ ko:`${a} × 11을 ×11 전략으로 계산해요`,
             en:`Compute ${a} × 11 using the ×11 trick`,
             zh:`用×11技巧计算 ${a} × 11` },
    tex:`${a} \\times 11 = \\square`,
    answer, answerType:'steps', widget:'steps',
    steps:[
      { tex:`${aT} + ${aO} = \\square \\;\\text{(가운데 자리)}`, blank:mid    },
      { tex:`\\Rightarrow ${aT}${mid}${aO} = \\square`,  blank:answer }
    ]
  };
};

/* ── ML_PLACESHIFT — 자리이동 곱셈 (반복 자릿수 인수) ───────── */
NM_TGEN['ml_placeshift'] = function(params, rng) {
  const lv = params.level || 'main';
  const REPD = lv === 'practice' ? [2,3,4] : [2,3,4,5,6,7,8,9];
  const d      = pick(rng, REPD);
  const b      = d * 11;
  const aMax   = lv === 'practice' ? 29 : 49;
  const a      = R(rng, 11, aMax);
  const partial= a * d;
  const answer = a * b;

  return {
    prompt:{ ko:`${a} × ${b}를 자리이동 전략으로 계산해요`,
             en:`Compute ${a} × ${b} using the place-shift strategy`,
             zh:`用位移策略计算 ${a} × ${b}` },
    tex:`${a} \\times ${b} = \\square`,
    answer, answerType:'steps', widget:'steps',
    steps:[
      { tex:`${a} \\times ${d} = \\square`,             blank:partial       },
      { tex:`${partial} + ${partial*10} = \\square`,     blank:answer        }
    ]
  };
};

/* ── ML_X5 — ×5/÷5 전략 ─────────────────────────────────────── */
NM_TGEN['ml_x5'] = function(params, rng) {
  const mode = params.mode || 'mul';
  const lv   = params.level || 'main';

  if (mode === 'mul') {
    const nMax = lv === 'practice' ? 19 : 49;
    const n      = R(rng, 1, nMax) * 2;
    const answer = n * 5;
    return {
      prompt:{ ko:`${n} × 5를 ×10÷2 전략으로 계산해요`,
               en:`Compute ${n} × 5 using ×10÷2`,
               zh:`用×10÷2策略计算 ${n} × 5` },
      tex:`${n} \\times 5 = \\square`,
      answer, answerType:'steps', widget:'steps',
      steps:[
        { tex:`${n} \\times 10 = \\square`,   blank:n*10   },
        { tex:`${n*10} \\div 2 = \\square`,   blank:answer }
      ]
    };
  }

  /* div: n ÷ 5 = n × 2 ÷ 10 */
  const qMax = lv === 'practice' ? 9 : 19;
  const q      = R(rng, 1, qMax);
  const n      = q * 5;
  const answer = q;
  return {
    prompt:{ ko:`${n} ÷ 5를 ×2÷10 전략으로 계산해요`,
             en:`Compute ${n} ÷ 5 using ×2÷10`,
             zh:`用×2÷10策略计算 ${n} ÷ 5` },
    tex:`${n} \\div 5 = \\square`,
    answer, answerType:'steps', widget:'steps',
    steps:[
      { tex:`${n} \\times 2 = \\square`,     blank:n*2    },
      { tex:`${n*2} \\div 10 = \\square`,    blank:answer }
    ]
  };
};

/* ── ML_X25 — ×25/÷25 전략 ─────────────────────────────────── */
NM_TGEN['ml_x25'] = function(params, rng) {
  const mode = params.mode || 'mul';
  const lv   = params.level || 'main';

  if (mode === 'mul') {
    const kMax = lv === 'practice' ? 8 : 20;
    const k      = R(rng, 1, kMax);
    const n      = k * 4;
    const answer = n * 25;
    return {
      prompt:{ ko:`${n} × 25를 ×100÷4 전략으로 계산해요`,
               en:`Compute ${n} × 25 using ×100÷4`,
               zh:`用×100÷4策略计算 ${n} × 25` },
      tex:`${n} \\times 25 = \\square`,
      answer, answerType:'steps', widget:'steps',
      steps:[
        { tex:`${n} \\times 100 = \\square`,  blank:n*100  },
        { tex:`${n*100} \\div 4 = \\square`,  blank:answer }
      ]
    };
  }

  /* div: n ÷ 25 = n × 4 ÷ 100 */
  const qMax25 = lv === 'practice' ? 8 : 20;
  const q      = R(rng, 1, qMax25);
  const n      = q * 25;
  const answer = q;
  return {
    prompt:{ ko:`${n} ÷ 25를 ×4÷100 전략으로 계산해요`,
             en:`Compute ${n} ÷ 25 using ×4÷100`,
             zh:`用×4÷100策略计算 ${n} ÷ 25` },
    tex:`${n} \\div 25 = \\square`,
    answer, answerType:'steps', widget:'steps',
    steps:[
      { tex:`${n} \\times 4 = \\square`,    blank:n*4    },
      { tex:`${n*4} \\div 100 = \\square`,  blank:answer }
    ]
  };
};

/* ── ML_DIV_DECOMP — 분해 나눗셈 ────────────────────────────── */
NM_TGEN['ml_div_decomp'] = function(params, rng) {
  const lv = params.level || 'main';
  const bMax = lv === 'practice' ? 5 : 9;
  const b      = R(rng, 2, bMax);
  const q1     = R(rng, 10, 99);  /* 백의 몫 */
  const q2     = R(rng, 1,  9);   /* 십의 몫 */
  const a      = (q1 * 10 + q2) * b;  /* a = (q1×10+q2)×b, 항상 딱 나눔 */
  const hPart  = Math.floor(a / 100) * 100;    /* 내림백자리 */
  const rest   = a - hPart;
  const answer = a / b;

  return {
    prompt:{ ko:`${a} ÷ ${b}를 분해해서 계산해요`,
             en:`Compute ${a} ÷ ${b} by decomposing`,
             zh:`分解计算 ${a} ÷ ${b}` },
    tex:`${a} \\div ${b} = \\square`,
    answer, answerType:'steps', widget:'steps',
    steps:[
      { tex:`${hPart} \\div ${b} = \\square`,    blank:hPart/b    },
      { tex:`${rest} \\div ${b} = \\square`,     blank:rest/b     },
      { tex:`${hPart/b} + ${rest/b} = \\square`, blank:answer     }
    ]
  };
};

/* ── ML_DIV_SIMPLIFY — 약분 나눗셈 ─────────────────────────── */
NM_TGEN['ml_div_simplify'] = function(params, rng) {
  const lv = params.level || 'main';
  const PAIRS_EASY = [[48,6],[54,6],[60,6],[56,8],[48,8],[54,9]];
  const PAIRS_ALL  = [
    [84,12],[96,12],[72,12],[60,12],
    [63, 9],[81, 9],[54, 9],
    [64, 8],[56, 8],[48, 8],
    [70, 7],[84, 7],[56, 7],
    [60, 6],[72, 6],[54, 6]
  ];
  const PAIRS = lv === 'practice' ? PAIRS_EASY : PAIRS_ALL;
  const [a, b] = pick(rng, PAIRS);
  const gcd    = (x, y) => y === 0 ? x : gcd(y, x % y);
  const g      = gcd(a, b);
  const sa     = a / g;
  const sb     = b / g;
  const answer = a / b;

  return {
    prompt:{ ko:`${a} ÷ ${b}를 약분해서 계산해요`,
             en:`Simplify then compute ${a} ÷ ${b}`,
             zh:`约分计算 ${a} ÷ ${b}` },
    tex:`${a} \\div ${b} = \\square`,
    answer, answerType:'steps', widget:'steps',
    steps:[
      { tex:`${a} \\div ${g} = \\square`, blank:sa },
      { tex:`${b} \\div ${g} = \\square`, blank:sb },
      { tex:`${sa} \\div ${sb} = \\square`, blank:answer }
    ]
  };
};

/* ── ML_DIV_EXPAND — 부풀려 나눗셈 (양쪽 같은 배수) ─────────── */
NM_TGEN['ml_div_expand'] = function(params, rng) {
  const lv   = params.level || 'main';
  const mode = lv === 'practice' ? 'x2' : pick(rng, ['x2','x4']);
  if (mode === 'x2') {
    const q      = R(rng, 1, 19);
    const b      = 5;
    const a      = q * b;
    const answer = q;
    return {
      prompt:{ ko:`${a} ÷ 5를 부풀려서 계산해요`,
               en:`Expand to compute ${a} ÷ 5`,
               zh:`扩大计算 ${a} ÷ 5` },
      tex:`${a} \\div 5 = \\square`,
      answer, answerType:'steps', widget:'steps',
      steps:[
        { tex:`${a} \\times 2 = \\square`, blank:a*2  },
        { tex:`${a*2} \\div 10 = \\square`, blank:answer }
      ]
    };
  }
  /* x4: n÷25 → 4n÷100 */
  const q      = R(rng, 1, 12);
  const b      = 25;
  const a      = q * b;
  const answer = q;
  return {
    prompt:{ ko:`${a} ÷ 25를 부풀려서 계산해요`,
             en:`Expand to compute ${a} ÷ 25`,
             zh:`扩大计算 ${a} ÷ 25` },
    tex:`${a} \\div 25 = \\square`,
    answer, answerType:'steps', widget:'steps',
    steps:[
      { tex:`${a} \\times 4 = \\square`,    blank:a*4    },
      { tex:`${a*4} \\div 100 = \\square`, blank:answer  }
    ]
  };
};

/* ── ML_FRAC_SAME — 분수 덧뺄셈 (동분모) ───────────────────── */
NM_TGEN['ml_frac_same'] = function(params, rng) {
  const op  = params.op || 'add';
  const lv  = params.level || 'main';
  const DENS = lv === 'practice' ? [3,4,5,6] : [3,4,5,6,7,8,9,10];
  const den = pick(rng, DENS);
  let num1, num2;

  if (op === 'add') {
    do {
      num1 = R(rng, 1, den - 1);
      num2 = R(rng, 1, den - 1);
    } while (num1 + num2 > den);
    const numR  = num1 + num2;
    const answer= numR;
    return {
      prompt:{ ko:`분수를 더해요`,
               en:`Add the fractions`,
               zh:`分数加法` },
      tex:`\\dfrac{${num1}}{${den}} + \\dfrac{${num2}}{${den}} = \\dfrac{\\square}{${den}}`,
      answer, answerType:'number', widget:'numpad'
    };
  }

  /* sub */
  num1 = R(rng, 2, den - 1);
  num2 = R(rng, 1, num1 - 1);
  const numR  = num1 - num2;
  const answer= numR;
  return {
    prompt:{ ko:`분수를 빼요`,
             en:`Subtract the fractions`,
             zh:`分数减法` },
    tex:`\\dfrac{${num1}}{${den}} - \\dfrac{${num2}}{${den}} = \\dfrac{\\square}{${den}}`,
    answer, answerType:'number', widget:'numpad'
  };
};

/* ── ML_FRAC_DIFF — 분수 덧뺄셈 (이분모/통분) ──────────────── */
NM_TGEN['ml_frac_diff'] = function(params, rng) {
  const op = params.op || 'add';
  const lv = params.level || 'main';
  const COPRIME_PAIRS = lv === 'practice'
    ? [[2,3],[2,5],[3,4]]
    : [[2,3],[2,5],[3,4],[3,5],[4,5],[2,7],[3,7]];
  const [d1, d2] = pick(rng, COPRIME_PAIRS);
  const lcd = d1 * d2;
  const n1  = R(rng, 1, d1 - 1);
  const n2  = R(rng, 1, d2 - 1);

  if (op === 'add') {
    const r1  = n1 * d2;  /* n1/d1 → r1/lcd */
    const r2  = n2 * d1;  /* n2/d2 → r2/lcd */
    const num = r1 + r2;
    return {
      prompt:{ ko:`통분해서 더해요`,
               en:`Find common denominator, then add`,
               zh:`通分后相加` },
      tex:`\\dfrac{${n1}}{${d1}} + \\dfrac{${n2}}{${d2}} = \\dfrac{\\square}{${lcd}}`,
      answer:num, answerType:'steps', widget:'steps',
      steps:[
        { tex:`\\dfrac{${n1}}{${d1}} = \\dfrac{\\square}{${lcd}}`, blank:r1  },
        { tex:`\\dfrac{${n2}}{${d2}} = \\dfrac{\\square}{${lcd}}`, blank:r2  },
        { tex:`\\dfrac{${r1}}{${lcd}} + \\dfrac{${r2}}{${lcd}} = \\dfrac{\\square}{${lcd}}`, blank:num }
      ]
    };
  }

  /* sub: ensure n1/d1 > n2/d2 */
  const r1 = n1 * d2;
  const r2 = n2 * d1;
  if (r1 <= r2) {
    const num = r2 - r1;
    return {
      prompt:{ ko:`통분해서 빼요`,
               en:`Find common denominator, then subtract`,
               zh:`通分后相减` },
      tex:`\\dfrac{${n2}}{${d2}} - \\dfrac{${n1}}{${d1}} = \\dfrac{\\square}{${lcd}}`,
      answer:num, answerType:'steps', widget:'steps',
      steps:[
        { tex:`\\dfrac{${n2}}{${d2}} = \\dfrac{\\square}{${lcd}}`, blank:r2  },
        { tex:`\\dfrac{${n1}}{${d1}} = \\dfrac{\\square}{${lcd}}`, blank:r1  },
        { tex:`\\dfrac{${r2}}{${lcd}} - \\dfrac{${r1}}{${lcd}} = \\dfrac{\\square}{${lcd}}`, blank:num }
      ]
    };
  }
  const num = r1 - r2;
  return {
    prompt:{ ko:`통분해서 빼요`,
             en:`Find common denominator, then subtract`,
             zh:`通分后相减` },
    tex:`\\dfrac{${n1}}{${d1}} - \\dfrac{${n2}}{${d2}} = \\dfrac{\\square}{${lcd}}`,
    answer:num, answerType:'steps', widget:'steps',
    steps:[
      { tex:`\\dfrac{${n1}}{${d1}} = \\dfrac{\\square}{${lcd}}`, blank:r1  },
      { tex:`\\dfrac{${n2}}{${d2}} = \\dfrac{\\square}{${lcd}}`, blank:r2  },
      { tex:`\\dfrac{${r1}}{${lcd}} - \\dfrac{${r2}}{${lcd}} = \\dfrac{\\square}{${lcd}}`, blank:num }
    ]
  };
};

/* ── ML_VEDA — VEDA 곱셈 (두 자리 × 두 자리, 교차곱) ──────── */
NM_TGEN['ml_veda'] = function(params, rng) {
  const lv = params.level || 'main';
  const hi = lv === 'practice' ? 31 : 49;
  const a   = R(rng, 11, hi);
  const b   = R(rng, 11, hi);
  const aT  = Math.floor(a / 10); const aO = a % 10;
  const bT  = Math.floor(b / 10); const bO = b % 10;

  const ones  = aO * bO;
  const cross = aT * bO + aO * bT;
  const tens  = aT * bT;
  const answer= a * b;

  return {
    prompt:{ ko:`${a} × ${b}를 VEDA 교차곱으로 계산해요`,
             en:`Compute ${a} × ${b} using VEDA cross-multiplication`,
             zh:`用VEDA交叉法计算 ${a} × ${b}` },
    tex:`${a} \\times ${b} = \\square`,
    answer, answerType:'steps', widget:'steps',
    steps:[
      { tex:`${aO} \\times ${bO} = \\square \\;\\text{(일의 자리)}`, blank:ones  },
      { tex:`${aT}\\times${bO}+${aO}\\times${bT} = \\square \\;\\text{(교차)}`, blank:cross },
      { tex:`${aT} \\times ${bT} = \\square \\;\\text{(십의 자리)}`, blank:tens  },
      { tex:`\\text{합산} \\Rightarrow ${a} \\times ${b} = \\square`, blank:answer }
    ]
  };
};

/* ── ML_DIFF2SQ — 차가 2인 두 수의 곱 (n²−1) ────────────────── */
NM_TGEN['ml_diff2sq'] = function(params, rng) {
  const lv = params.level || 'main';
  const n      = lv === 'practice' ? R(rng, 5, 10) : R(rng, 5, 20);
  const a      = n - 1;
  const b      = n + 1;
  const sq     = n * n;
  const answer = sq - 1;

  return {
    prompt:{ ko:`${a} × ${b}를 제곱 마법으로 계산해요`,
             en:`Compute ${a} × ${b} using the square shortcut`,
             zh:`用平方捷算 ${a} × ${b}` },
    tex:`${a} \\times ${b} = \\square`,
    answer, answerType:'steps', widget:'steps',
    steps:[
      { tex:`${n}^2 = \\square`,          blank:sq     },
      { tex:`${sq} - 1 = \\square`,       blank:answer }
    ]
  };
};

/* ── ML_DECIMAL_MUL — 소수 곱셈·나눗셈 ─────────────────────── */
NM_TGEN['ml_decimal_mul'] = function(params, rng) {
  const mode = params.mode || 'mul';
  const lv   = params.level || 'main';

  if (mode === 'mul') {
    const shift = lv === 'practice' ? 1 : pick(rng, [1, 2]);
    const a     = R(rng, 2, 99);
    const label = shift === 1 ? '0.1' : '0.01';
    const div   = shift === 1 ? 10   : 100;
    /* a×0.1은 부동소수점 오차(7×0.1=0.7000…01)가 생기므로 a÷div로 계산 */
    const answer= a / div;
    return {
      prompt:{ ko:`${a} × ${label} = ?`,
               en:`What is ${a} × ${label}?`,
               zh:`${a} × ${label} = ?` },
      tex:`${a} \\times ${label} = \\square`,
      answer, answerType:'steps', widget:'steps',
      steps:[
        { tex:`${a} \\div ${div} = \\square`, blank:answer }
      ]
    };
  }

  /* div: a ÷ 0.1 = a × 10 */
  const shift  = lv === 'practice' ? 1 : pick(rng, [1, 2]);
  const a      = R(rng, 1, 9);
  const mul    = shift === 1 ? 10  : 100;
  /* a÷0.1은 부동소수점 오차(7÷0.1=70.00…01)가 생기므로 a×mul로 계산 */
  const answer = a * mul;
  const label  = shift === 1 ? '0.1' : '0.01';
  return {
    prompt:{ ko:`${a} ÷ ${label} = ?`,
             en:`What is ${a} ÷ ${label}?`,
             zh:`${a} ÷ ${label} = ?` },
    tex:`${a} \\div ${label} = \\square`,
    answer, answerType:'steps', widget:'steps',
    steps:[
      { tex:`${a} \\times ${mul} = \\square`, blank:answer }
    ]
  };
};

/* ── ML_PARTIAL — 차근차근 곱하기 (부분곱 세로셈) ────────────
   자리별로 쪼개 각각 곱한 뒤 모두 더한다 (받아올림을 미루는 전략) */
NM_TGEN['ml_partial'] = function(params, rng) {
  const lv = params.level || 'main';

  /* 두 수의 십의 자리·일의 자리 모두 0이 되지 않도록 1~9에서 뽑는다 */
  const tensA = R(rng, 1, 9);
  const onesA = R(rng, 1, 9);
  const a     = tensA * 10 + onesA;

  if (lv === 'practice') {
    /* 두 자리 × 한 자리 */
    const b      = R(rng, 1, 9);
    const p1     = b * onesA;
    const p2     = b * (tensA * 10);
    const answer = p1 + p2;
    return {
      prompt:{ ko:`${a} × ${b}를 자리별로 나누어 곱해요`,
               en:`Break ${a} × ${b} apart by place value`,
               zh:`把 ${a} × ${b} 按数位拆开相乘` },
      tex:`${a} \\times ${b} = \\square`,
      answer, answerType:'steps', widget:'steps',
      steps:[
        { tex:`${b} \\times ${onesA} = \\square`,       blank:p1     },
        { tex:`${b} \\times ${tensA * 10} = \\square`,  blank:p2     },
        { tex:`${p1} + ${p2} = \\square`,                blank:answer }
      ]
    };
  }

  /* main: 두 자리 × 두 자리 */
  const tensB  = R(rng, 1, 9);
  const onesB  = R(rng, 1, 9);
  const b      = tensB * 10 + onesB;
  const p1     = onesB * onesA;
  const p2     = onesB * (tensA * 10);
  const p3     = (tensB * 10) * onesA;
  const p4     = (tensB * 10) * (tensA * 10);
  const answer = p1 + p2 + p3 + p4;
  return {
    prompt:{ ko:`${a} × ${b}를 자리별로 나누어 곱해요`,
             en:`Break ${a} × ${b} apart by place value`,
             zh:`把 ${a} × ${b} 按数位拆开相乘` },
    tex:`${a} \\times ${b} = \\square`,
    answer, answerType:'steps', widget:'steps',
    steps:[
      { tex:`${onesB} \\times ${onesA} = \\square`,            blank:p1     },
      { tex:`${onesB} \\times ${tensA * 10} = \\square`,       blank:p2     },
      { tex:`${tensB * 10} \\times ${onesA} = \\square`,       blank:p3     },
      { tex:`${tensB * 10} \\times ${tensA * 10} = \\square`,  blank:p4     },
      { tex:`${p1} + ${p2} + ${p3} + ${p4} = \\square`,        blank:answer }
    ]
  };
};

/* ── ML_END9 — "9"로 끝나는 수의 곱 ───────────────────────────
   1 크게 만들어 곱하고, 더 곱한 만큼 한 번 뺀다 (49×34 = 50×34−34) */
NM_TGEN['ml_end9'] = function(params, rng) {
  const lv = params.level || 'main';

  let a;
  if (lv === 'practice') {
    a = pick(rng, [19, 29, 39, 49]);
  } else {
    const cands = [];
    for (let i = 1; i <= 9; i++) cands.push(i * 10 + 9);  /* 19,29,...,99 */
    cands.push(199);
    a = pick(rng, cands);
  }
  const b      = lv === 'practice' ? R(rng, 2, 9) : R(rng, 12, 48);
  const bumped = (a + 1) * b;
  const answer = a * b;

  return {
    prompt:{ ko:`${a} × ${b}: ${a + 1}을 곱하고 ${b}를 한 번 빼요`,
             en:`${a} × ${b}: multiply by ${a + 1}, then subtract ${b} once`,
             zh:`${a} × ${b}：先乘 ${a + 1}，再减一次 ${b}` },
    tex:`${a} \\times ${b} = \\square`,
    answer, answerType:'steps', widget:'steps',
    steps:[
      { tex:`${a + 1} \\times ${b} = \\square`, blank:bumped },
      { tex:`${bumped} - ${b} = \\square`,      blank:answer }
    ]
  };
};

/* ── ML_FRAC_MULDIV — 분수의 곱셈·나눗셈 ──────────────────────
   분모를 고정해 박고 분자만 답으로 받는다 (ml_frac_same과 같은 패턴) */
NM_TGEN['ml_frac_muldiv'] = function(params, rng) {
  const op   = params.op || 'mul';
  const lv   = params.level || 'main';
  const dMax = lv === 'practice' ? 5 : 9;

  const d1 = R(rng, 2, dMax);
  const d2 = R(rng, 2, dMax);
  const n1 = R(rng, 1, d1 - 1);
  const n2 = R(rng, 1, d2 - 1);   /* div일 때도 n2>=1 항상 보장 */

  if (op === 'mul') {
    const answer = n1 * n2;
    return {
      prompt:{ ko:`분자는 분자끼리, 분모는 분모끼리 곱해요`,
               en:`Multiply numerators together and denominators together`,
               zh:`分子乘分子，分母乘分母` },
      tex:`\\dfrac{${n1}}{${d1}} \\times \\dfrac{${n2}}{${d2}} = \\dfrac{\\square}{${d1 * d2}}`,
      answer, answerType:'number', widget:'numpad'
    };
  }

  /* div: (n1/d1) ÷ (n2/d2) = (n1/d1) × (d2/n2) */
  const answer = n1 * d2;
  return {
    prompt:{ ko:`나눗셈을 곱셈으로 바꾸고 뒤집어요`,
             en:`Turn division into multiplication and flip the second fraction`,
             zh:`把除法变成乘法，再把第二个分数倒过来` },
    tex:`\\dfrac{${n1}}{${d1}} \\div \\dfrac{${n2}}{${d2}} = \\dfrac{\\square}{${d1 * n2}}`,
    answer, answerType:'number', widget:'numpad'
  };
};

/* ── ML_FRAC_CONV — 분수 전환 나눗셈 (나눗셈을 분수로 쪼개 소수로) ──
   675÷4 = 600/4 + 40/4 + 35/4 = 150+10+8.75 = 168.75 */
NM_TGEN['ml_frac_conv'] = function(params, rng) {
  const lv   = params.level || 'main';
  const DENS = lv === 'practice' ? [2, 4, 5, 8] : [2, 4, 5, 8, 20, 25];
  const d    = pick(rng, DENS);
  const n    = lv === 'practice' ? R(rng, 100, 999) : R(rng, 1000, 9999);
  /* d가 2·4·5·8·20·25뿐이라 소수 셋째자리 이하에서 끊기므로 반올림해도 오차 없음 */
  const answer = Math.round(n / d * 1000) / 1000;

  return {
    prompt:{ ko:`${n} ÷ ${d}: 수를 쪼개서 나누고 소수로 나타내요`,
             en:`${n} ÷ ${d}: split the number apart, divide, and write it as a decimal`,
             zh:`${n} ÷ ${d}：把数拆开来除，用小数表示` },
    tex:`${n} \\div ${d} = \\square`,
    answer, answerType:'number', widget:'numpad'
  };
};

/* ── ML_DECIMAL_DIV — 소수를 나누기 ───────────────────────────
   48.96÷0.8 → 489.6÷8=61.2: 나누는 수를 자연수로 만들어 나눈다.
   부동소수 오차를 없애려면 몫·나누는 수를 정수 스케일로 먼저 정하고
   나누어지는 수는 그 곱으로 역산한다. */
NM_TGEN['ml_decimal_div'] = function(params, rng) {
  const lv     = params.level || 'main';
  const qi     = R(rng, 10, 99);                                /* 몫 = qi/10 (소수 한 자리) */
  const vi     = lv === 'practice' ? R(rng, 2, 9) : R(rng, 11, 99);
  const vScale = lv === 'practice' ? 10 : 100;                  /* v = vi/vScale */
  const nScale = 10 * vScale;                                   /* n = qi*vi/nScale */

  const q      = qi / 10;
  const v      = vi / vScale;
  const n      = (qi * vi) / nScale;
  const answer = Math.round(q * 100) / 100;

  const trim = s => s.indexOf('.') === -1 ? s : s.replace(/0+$/, '').replace(/\.$/, '');
  const nStr = trim(n.toFixed(lv === 'practice' ? 2 : 3));
  const vStr = trim(v.toFixed(lv === 'practice' ? 1 : 2));

  return {
    prompt:{ ko:`${nStr} ÷ ${vStr}: 나누는 수를 자연수로 만들어 나눠요`,
             en:`${nStr} ÷ ${vStr}: turn the divisor into a whole number, then divide`,
             zh:`${nStr} ÷ ${vStr}：把除数变成整数再除` },
    tex:`${nStr} \\div ${vStr} = \\square`,
    answer, answerType:'number', widget:'numpad'
  };
};

})();
