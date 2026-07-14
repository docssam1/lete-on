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
  const a        = R(rng, 100, 999);
  const b        = R(rng, 2, 9);
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

})();
