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
    /* 표기 순서를 섞어 같은 (n,answer)라도 다른 식으로 보이게 */
    const tex = pick(rng, [
      `${n} \\times 2 = \\square`,
      `2 \\times ${n} = \\square`
    ]);
    return {
      prompt: {
        ko: `${n}의 두 배는?`,
        en: `What is double ${n}?`,
        zh: `${n}的两倍是多少？`
      },
      tex,
      answer,
      answerType: 'number',
      widget: 'array',
      array: { n: answer, rows: 2 },
      solution: [
        { tex: `${n} \\times 2 = ${n} + ${n}` },
        { tex: `${n} + ${n} = \\square`, blank: answer }
      ]
    };
  } else {
    /* d2: 짝수 n = R(rng,1,max/2)*2 → n/2 가 정수 보장, max를 최대로 활용 */
    const n      = R(rng, 1, Math.floor(max / 2)) * 2;
    const answer = n / 2;
    const tex = pick(rng, [
      `${n} \\div 2 = \\square`,
      `\\dfrac{${n}}{2} = \\square`
    ]);
    return {
      prompt: {
        ko: `${n}을 반으로 나누면?`,
        en: `What is half of ${n}?`,
        zh: `${n}除以2等于多少？`
      },
      tex,
      answer,
      answerType: 'number',
      widget: 'array',
      array: { n, rows: 2 },
      solution: [
        { tex: `${n} = ${answer} + ${answer}` },
        { tex: `${n} \\div 2 = \\square`, blank: answer }
      ]
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
    array: { n: answer, rows: t },
    solution: [
      { tex: `${t} \\times ${n} = \\square`, blank: answer }
    ]
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

  /* 6~9단은 더 작은 아는 곱에서 옮겨간다: n이 짝수면 절반을 곱해 두 배,
     홀수면 한 묶음 적은 곱에 t를 한 번 더 더한다 */
  const nEven = n % 2 === 0;
  let solution;
  if (nEven) {
    const halfN = n / 2;
    const halfProd = t * halfN;
    solution = [
      { tex: `${t} \\times ${n} = ${t} \\times ${halfN} \\times 2` },
      { tex: `${t} \\times ${halfN} = \\square`, blank: halfProd },
      { tex: `${halfProd} \\times 2 = \\square`, blank: answer }
    ];
  } else {
    const prevN = n - 1;
    const prevProd = t * prevN;
    solution = [
      { tex: `${t} \\times ${n} = ${t} \\times ${prevN} + ${t}` },
      { tex: `${t} \\times ${prevN} = \\square`, blank: prevProd },
      { tex: `${prevProd} + ${t} = \\square`, blank: answer }
    ];
  }

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
    array: { n: answer, rows: t },
    solution
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
      widget: 'numpad',
      solution: [
        { tex: `${t} \\times ${n} = \\square`, blank: product }
      ]
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
    widget: 'missing',
    solution: missingFirst
      ? [ { tex: `${product} \\div ${n} = \\square`, blank: t } ]
      : [ { tex: `${product} \\div ${t} = \\square`, blank: n } ]
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
      ],
      solution: [
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
    ],
    solution: [
      { tex: `${o} \\times ${b} = \\square`,                        blank: oRes   },
      { tex: `${t} \\times ${b} + ${oCarry} = \\square`,           blank: tRes   },
      { tex: `${h} \\times ${b} + ${tCarry} = \\square`,           blank: hRes   },
      { tex: `${hRes} \\times 100 + ${tRes % 10} \\times 10 + ${oRes % 10} = \\square`, blank: answer }
    ]
  };
};

/* ── ML8 — 두 자리×두 자리 ───────────────────────────────── */
NM_TGEN['ml8_mul2d2d'] = function(params, rng) {
  /* ── 고급 C-1 확장: 엑스맨 곱셈 (세 자리 이상) ─────────────────
     원본(고급 C '엑스맨 곱셈')은 3자리×2자리 · 3자리×3자리만 실제
     훈련문제로 다룬다(4자리 이상은 핵심체크 토론일 뿐, 문제화 안 됨).
     제너레이터 주의점(정독): 자리별 부분합이 두 자리 이상으로 자리올림이
     발생하는 경우가 다수 있다 — 여기서는 각 조각을 "제 자리값을 실은
     정수"로 만들어 마지막에 실제 덧셈으로 합치므로(자릿수를 자르지 않음)
     올림이 자동으로 정확히 반영된다. */
  if (params.digits === '3x2' || params.digits === '3x3') {
    const a2 = R(rng, 1, 9), a1 = R(rng, 0, 9), a0 = R(rng, 0, 9);
    const a  = a2 * 100 + a1 * 10 + a0;

    if (params.digits === '3x2') {
      /* b0을 1~9로 둬(0 제외) 매번 진짜 X 교차곱(십자리 조각)이 0이 되는
         맥빠진 문제가 나오지 않도록 한다 */
      const b1 = R(rng, 1, 9), b0 = R(rng, 1, 9);
      const b  = b1 * 10 + b0;
      const p1000 = a2 * b1;
      const p100  = a2 * b0 + a1 * b1;
      const p10   = a1 * b0 + a0 * b1;
      const p1    = a0 * b0;
      const answer = p1000 * 1000 + p100 * 100 + p10 * 10 + p1;

      return {
        prompt: {
          ko: `${a} × ${b}를 엑스맨 곱셈(X자 교차곱)으로 계산해요`,
          en: `Calculate ${a} × ${b} using X-cross multiplication`,
          zh: `用X交叉法计算 ${a} × ${b}`
        },
        tex: `${a} \\times ${b} = \\square`,
        answer, answerType: 'steps', widget: 'steps',
        steps: [
          { tex: `${a2} \\times ${b1} = \\square \\;\\text{(천)}`, blank: p1000 },
          { tex: `${a2}\\times${b0} + ${a1}\\times${b1} = \\square \\;\\text{(백, X)}`, blank: p100 },
          { tex: `${a1}\\times${b0} + ${a0}\\times${b1} = \\square \\;\\text{(십, X)}`, blank: p10 },
          { tex: `${a0} \\times ${b0} = \\square \\;\\text{(일)}`, blank: p1 },
          { tex: `${p1000}\\times1000 + ${p100}\\times100 + ${p10}\\times10 + ${p1} = \\square`, blank: answer }
        ]
      };
    }

    /* 3x3 */
    const b2 = R(rng, 1, 9), b1 = R(rng, 0, 9), b0 = R(rng, 0, 9);
    const b  = b2 * 100 + b1 * 10 + b0;
    const p10000 = a2 * b2;
    const p1000  = a2 * b1 + a1 * b2;
    const p100   = a2 * b0 + a1 * b1 + a0 * b2;
    const p10    = a1 * b0 + a0 * b1;
    const p1     = a0 * b0;
    const answer = p10000 * 10000 + p1000 * 1000 + p100 * 100 + p10 * 10 + p1;

    return {
      prompt: {
        ko: `${a} × ${b}를 엑스맨 곱셈(X자 교차곱)으로 계산해요`,
        en: `Calculate ${a} × ${b} using X-cross multiplication`,
        zh: `用X交叉法计算 ${a} × ${b}`
      },
      tex: `${a} \\times ${b} = \\square`,
      answer, answerType: 'steps', widget: 'steps',
      steps: [
        { tex: `${a2} \\times ${b2} = \\square \\;\\text{(만)}`, blank: p10000 },
        { tex: `${a2}\\times${b1} + ${a1}\\times${b2} = \\square \\;\\text{(천, X)}`, blank: p1000 },
        { tex: `${a2}\\times${b0} + ${a1}\\times${b1} + ${a0}\\times${b2} = \\square \\;\\text{(백, X)}`, blank: p100 },
        { tex: `${a1}\\times${b0} + ${a0}\\times${b1} = \\square \\;\\text{(십, X)}`, blank: p10 },
        { tex: `${a0} \\times ${b0} = \\square \\;\\text{(일)}`, blank: p1 },
        { tex: `${p10000}\\times10000 + ${p1000}\\times1000 + ${p100}\\times100 + ${p10}\\times10 + ${p1} = \\square`, blank: answer }
      ]
    };
  }

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

  /* b를 십의 자리·일의 자리로 나눠 두 번 곱하고 더한다 */
  const bTens = Math.floor(b / 10) * 10;
  const bOnes = b % 10;
  const p1    = a * bOnes;
  const p2    = a * bTens;

  return {
    prompt: {
      ko: `${a} × ${b}을 계산해요`,
      en: `Calculate ${a} × ${b}`,
      zh: `计算 ${a} × ${b}`
    },
    tex: `${a} \\times ${b} = \\square`,
    answer,
    answerType: 'number',
    widget: 'vertical',
    solution: [
      { tex: `${b} = ${bTens} + ${bOnes}` },
      { tex: `${a} \\times ${bOnes} = \\square`, blank: p1 },
      { tex: `${a} \\times ${bTens} = \\square`, blank: p2 },
      { tex: `${p1} + ${p2} = \\square`, blank: answer }
    ]
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

  /* ── 고급 A-5 확장: "1"로 끝나는 수의 제곱 ★1²=★0²+★0+★1 ──────
     제너레이터 주의점(정독): 핵심체크가 세제곱·일반화까지 은근히
     요구하는 심화형이다 — 두 자리~여섯 자리 결과까지 자릿수를 늘려가며
     패턴이 유지됨을 보여야 원본 취지에 가깝다(11²~991²). */
  if (params.mode === 'end1') {
    const k    = R(rng, 1, 99);       // n = 10k+1, n:11~991
    const n    = 10 * k + 1;
    const base = n - 1;               // 항상 10의 배수라 base² 계산이 쉬움
    const baseSq = base * base;
    const answer  = baseSq + base + n;

    return {
      prompt: {
        ko: `${n}²을 "1로 끝나는 수의 제곱" 마법으로 계산해요`,
        en: `Compute ${n}² using the "ends-in-1" square trick`,
        zh: `用"尾数为1的平方"魔法计算 ${n}²`
      },
      tex: `${n}^2 = \\square`,
      answer, answerType: 'steps', widget: 'steps',
      steps: [
        { tex: `${base}^2 = \\square`, blank: baseSq },
        { tex: `${baseSq} + ${base} + ${n} = \\square`, blank: answer }
      ]
    };
  }

  /* ── 고급 D-4 확장: 제곱수 점화식 ★²=(★∓1)²∓(2★∓1) ──────────
     원본은 "앞(내림) 또는 뒤(올림) 중 계산이 편한 쪽을 자유롭게 고른다"는
     유연성이 핵심이다 — 방향을 매번 rng로 섞어 두 방향 모두 나오게 한다.
     고급 A-6(유명한 제곱수와 1차이)과 공식은 완전히 같지만, A-6은 "외운
     기준수(25·50·100 등) 근처를 ★칸 일반화"이고 이쪽은 "임의의 연속한
     정수를 바로 옆 제곱수 1칸에서" 유도한다는 점이 다르다 — 두 유닛을
     그대로 복제하지 않도록 여기서는 항상 거리 1, n은 임의 정수로 둔다. */
  if (params.mode === 'adjacent') {
    const n = R(rng, 11, 501);
    const goDown = R(rng, 0, 1) === 0;

    if (goDown) {
      const prev   = n - 1;
      const prevSq = prev * prev;
      const answer = prevSq + prev + n;
      return {
        prompt: {
          ko: `${n}²을 바로 앞 제곱수 ${prev}²에서 유도해요`,
          en: `Derive ${n}² from the previous square ${prev}²`,
          zh: `从前一个平方数 ${prev}² 推出 ${n}²`
        },
        tex: `${n}^2 = \\square`,
        answer, answerType: 'steps', widget: 'steps',
        steps: [
          { tex: `${prev}^2 = \\square`, blank: prevSq },
          { tex: `${prevSq} + ${prev} + ${n} = \\square`, blank: answer }
        ]
      };
    }

    const next   = n + 1;
    const nextSq = next * next;
    const answer = nextSq - next - n;
    return {
      prompt: {
        ko: `${n}²을 바로 뒤 제곱수 ${next}²에서 유도해요`,
        en: `Derive ${n}² from the next square ${next}²`,
        zh: `从后一个平方数 ${next}² 推出 ${n}²`
      },
      tex: `${n}^2 = \\square`,
      answer, answerType: 'steps', widget: 'steps',
      steps: [
        { tex: `${next}^2 = \\square`, blank: nextSq },
        { tex: `${nextSq} - ${next} - ${n} = \\square`, blank: answer }
      ]
    };
  }

  if (!powers) {
    /* 제곱수: n²  (lo~hi 범위) */
    const lo     = params.lo || 11;
    const hi     = params.hi || 20;
    const n      = R(rng, lo, hi);
    const answer = n * n;
    /* lo~hi 범위 자체는 레벨 설계값(threads.js)이라 그대로 두고,
       같은 n이라도 다른 식으로 보이도록 표기를 섞어 문항 다양성을 늘린다 */
    const tex = pick(rng, [
      `${n}^2 = \\square`,
      `\\square = ${n}^2`,
      `${n} \\times ${n} = \\square`,
      `\\square = ${n} \\times ${n}`,
      `(${n})^2 = \\square`,
      `\\square = (${n})^2`,
      `(${n}) \\times (${n}) = \\square`,
      `\\square = (${n}) \\times (${n})`
    ]);

    return {
      prompt: {
        ko: `${n}의 제곱은?`,
        en: `What is ${n} squared?`,
        zh: `${n}的平方是多少？`
      },
      tex,
      answer,
      answerType: 'steps',
      widget: 'array',
      array: { n: answer, rows: n },
      steps: [
        { tex: `${n} \\times ${n} = \\square`, blank: answer }
      ]
    };
  }

  /* 거듭제곱: base^exp — base·exp 후보는 threads.js가 아닌 이 함수 내부 값이라
     자유롭게 넓힐 수 있다 (2·3·5→더 다양한 밑, exp 2~5→2~6) */
  const base   = pick(rng, [2, 3, 4, 5, 6, 7, 9, 10]);
  const exp    = R(rng, 2, 6);
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
    tex: pick(rng, [
      `${base}^{${exp}} = \\square`,
      `\\square = ${base}^{${exp}}`
    ]),
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
    /* 2×5=10 짝은 고정하되, 곱해지는 인수 개수(총 3~5개)와 값을 다양화하고
       짝의 위치도 섞어 같은 값이라도 다른 식으로 보이게 한다 */
    const bMax      = lv === 'practice' ? 12 : 12;
    const extraCount= lv === 'practice' ? R(rng, 1, 2) : R(rng, 2, 3);
    const extras = [];
    for (let i = 0; i < extraCount; i++) {
      let v;
      do { v = R(rng, 2, bMax); } while (v === 2 || v === 5);
      extras.push(v);
    }
    const factors = shuffle(rng, [2, 5, ...extras]);
    const tex = factors.join(' \\times ') + ' = \\square';

    const steps = [{ tex: '2 \\times 5 = \\square', blank: 10 }];
    let running = 10;
    extras.forEach(v => {
      const prev = running;
      running *= v;
      steps.push({ tex: `${prev} \\times ${v} = \\square`, blank: running });
    });
    const answer = running;

    return {
      prompt:{ ko:`${factors.join(' × ')}를 쌍을 찾아 쉽게 계산해요`,
               en:`Find the pair to easily compute ${factors.join(' × ')}`,
               zh:`找到乘积为10的对，轻松计算 ${factors.join(' × ')}` },
      tex,
      answer, answerType:'steps', widget:'steps',
      steps
    };
  }

  if (mode === 'decomp') {
    /* 분해곱셈법: n × 25 → (k×4) × 25 = k×100  (4의 배수 n=4k) */
    const kMax   = lv === 'practice' ? 12 : 40;
    const k      = R(rng, 2, kMax);
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

  if (target === 1000) {
    /* 곱해서 1000 만들기 — 계보1(2와 5는 친구) 세 번째 관문.
       8×125, 2×500, 4×250, 40×25, 5×200, 10×100, 20×50 중 매번 다른 짝을 뽑아
       (target===10/100처럼 짝을 고정하지 않고) 생성을 다양화한다. */
    const pairs1000 = [[8,125],[2,500],[4,250],[40,25],[5,200],[10,100],[20,50]];
    const pair      = pick(rng, pairs1000);
    const bMax3      = lv === 'practice' ? 9 : 12;
    const extraCount3= lv === 'practice' ? R(rng, 1, 2) : R(rng, 2, 3);
    const extras3 = [];
    for (let i = 0; i < extraCount3; i++) {
      let v;
      do { v = R(rng, 2, bMax3); } while (v === pair[0] || v === pair[1]);
      extras3.push(v);
    }
    const factors3 = shuffle(rng, [pair[0], pair[1], ...extras3]);
    const tex3 = factors3.join(' \\times ') + ' = \\square';

    const steps3 = [{ tex: `${pair[0]} \\times ${pair[1]} = \\square`, blank: 1000 }];
    let running3 = 1000;
    extras3.forEach(v => {
      const prev = running3;
      running3 *= v;
      steps3.push({ tex: `${prev} \\times ${v} = \\square`, blank: running3 });
    });
    const answer3 = running3;

    return {
      prompt:{ ko:`${factors3.join(' × ')}를 쌍을 찾아 계산해요 (1000을 만드는 쌍이 있어요!)`,
               en:`Find the pair that makes 1000 to compute ${factors3.join(' × ')}`,
               zh:`找到乘积为1000的对，计算 ${factors3.join(' × ')}` },
      tex: tex3,
      answer: answer3, answerType:'steps', widget:'steps',
      steps: steps3
    };
  }

  /* target===100: 4×25=100 짝은 고정, 인수 개수(3~5개)와 값을 다양화 */
  const bMax2      = lv === 'practice' ? 9 : 12;
  const extraCount2= lv === 'practice' ? 1 : R(rng, 2, 3);
  const extras2 = [];
  for (let i = 0; i < extraCount2; i++) {
    let v;
    do { v = R(rng, 2, bMax2); } while (v === 4 || v === 25);
    extras2.push(v);
  }
  const factors2 = shuffle(rng, [4, 25, ...extras2]);
  const tex2 = factors2.join(' \\times ') + ' = \\square';

  const steps2 = [{ tex: '4 \\times 25 = \\square', blank: 100 }];
  let running2 = 100;
  extras2.forEach(v => {
    const prev = running2;
    running2 *= v;
    steps2.push({ tex: `${prev} \\times ${v} = \\square`, blank: running2 });
  });
  const answer2 = running2;

  return {
    prompt:{ ko:`${factors2.join(' × ')}를 쌍을 찾아 계산해요`,
             en:`Find the pair to compute ${factors2.join(' × ')}`,
             zh:`找到乘积为100的对，计算 ${factors2.join(' × ')}` },
    tex: tex2,
    answer: answer2, answerType:'steps', widget:'steps',
    steps: steps2
  };
};

/* ── ML_GAUSS — 가우스 덧셈 (등차수열 합) ────────────────────── */
NM_TGEN['ml_gauss'] = function(params, rng) {
  /* ── 고급 B-4 확장: 가우스 덧셈의 응용 (끝²−첫²+첫+끝)÷2 ────────
     원본은 기존 가우스 페어링 공식을 "제곱" 형태로 다시 유도한 것이다.
     제너레이터 주의점(정독): 이 공식은 "연속한 자연수"에만 적용된다 —
     등차가 2 이상인 수열(홀짝수만 더하기 등)에는 못 쓴다고 원본이 직접
     경고한다. 그래서 이 모드는 공차를 항상 1로 고정한다(기존 가우스
     페어링 모드는 공차 1~3을 그대로 유지 — 아래에서 분기).
     수치 범위(정독): 두 자리(5~15)에서 세 자리(300~500)까지. */
  if (params.mode === 'squareForm') {
    const lv2 = params.level || 'main';
    const a1  = lv2 === 'practice' ? R(rng, 5, 15) : R(rng, 300, 400);
    const span = lv2 === 'practice' ? R(rng, 3, 12) : R(rng, 20, 100);
    const last = Math.min(a1 + span, lv2 === 'practice' ? 60 : 500);
    const diffSq = last * last - a1 * a1;
    const withEnds = diffSq + a1 + last;
    const answer = withEnds / 2;

    return {
      prompt: {
        ko: `${a1}부터 ${last}까지 더한 값을 제곱 공식으로 계산해요`,
        en: `Find ${a1} + ${a1 + 1} + \\dots + ${last} using the square formula`,
        zh: `用平方公式求 ${a1} 加到 ${last} 的和`
      },
      tex: `${a1} + ${a1 + 1} + \\cdots + ${last} = \\square`,
      answer, answerType: 'steps', widget: 'steps',
      steps: [
        { tex: `${last}^2 - ${a1}^2 = \\square`, blank: diffSq },
        { tex: `${diffSq} + ${a1} + ${last} = \\square`, blank: withEnds },
        { tex: `${withEnds} \\div 2 = \\square`, blank: answer }
      ]
    };
  }

  const lv = params.level || 'main';
  /* 시작수·공차·항수를 모두 다양화 (1부터 시작하는 짝수 n개 고정 탈피).
     항수는 짝의 개수 계산(가우스 페어링)을 그대로 쓸 수 있도록 항상 짝수로 뽑는다. */
  const diffs      = lv === 'practice' ? [1, 2] : [1, 2, 3];
  const d          = pick(rng, diffs);
  const termsList  = lv === 'practice' ? [4, 6, 8, 10] : [4, 6, 8, 10, 12, 14, 16, 18, 20];
  const terms      = pick(rng, termsList);
  const a1Max      = lv === 'practice' ? 10 : 50;
  const a1         = R(rng, 1, a1Max);
  const last       = a1 + (terms - 1) * d;
  const pairSum    = a1 + last;
  const pairs      = terms / 2;
  const total      = pairSum * pairs;

  const seqTex = d === 1
    ? `${a1} + ${a1 + 1} + \\cdots + ${last}`
    : `${a1} + ${a1 + d} + ${a1 + 2 * d} + \\cdots + ${last}`;

  return {
    prompt:{ ko:`${a1}부터 ${last}까지 ${d === 1 ? '' : `${d}씩 `}더하면 얼마일까요?`,
             en:`What is ${a1} + ${a1 + d} + \\dots + ${last}?`,
             zh:`从${a1}加到${last}${d === 1 ? '' : `（每次加${d}）`}等于多少？` },
    tex:`${seqTex} = \\square`,
    answer:total, answerType:'steps', widget:'steps',
    steps:[
      { tex:`${a1} + ${last} = \\square`,               blank:pairSum },
      { tex:`\\text{쌍의 수} = ${terms} \\div 2 = \\square`, blank:pairs },
      { tex:`${pairSum} \\times ${pairs} = \\square`, blank:total  }
    ]
  };
};

/* ── ML_X9 — ×9 전략 (n×9=n×10−n) ──────────────────────────── */
NM_TGEN['ml_x9'] = function(params, rng) {
  const lv = params.level || 'main';
  /* 교재 사례(4291×9, 8466×9)처럼 main은 네 자리까지, practice는 두 자리까지 */
  const n      = lv === 'practice' ? R(rng, 2, 60) : R(rng, 2, 9999);
  const answer = n * 9;
  const tex = pick(rng, [
    `${n} \\times 9 = \\square`,
    `9 \\times ${n} = \\square`
  ]);

  return {
    prompt:{ ko:`${n} × 9를 ×10 빼기 전략으로 계산해요`,
             en:`Compute ${n} × 9 using the ×10 minus strategy`,
             zh:`用×10减的策略计算 ${n} × 9` },
    tex,
    answer, answerType:'steps', widget:'steps',
    steps:[
      { tex:`${n} \\times 10 = \\square`,        blank:n*10   },
      { tex:`${n*10} - ${n} = \\square`,          blank:answer }
    ],
    /* 개념 애니메이션용 장면 필드 (개념애니-설계.md §4-1).
       NM_TGEN 생성기는 의미 필드를 안 내보내고 n이 tex 문자열 안에만 있어서
       "×10 하고 n을 뺀다"를 그릴 수가 없었다. tex를 파싱하면 표기가 바뀌는
       순간 조용히 깨지므로, 이미 계산해 둔 지역변수를 그대로 내보낸다.
       기존 반환값(prompt·tex·answer·steps)은 건드리지 않는다 — 문항·정답·
       인쇄 전부 불변. */
    scene:{ archetype:'place-shift', n, shifted:n*10, back:n, result:answer, factor:9, shiftPlaces:1 }
  };
};

/* ── ML_OVERMUL — 더 곱해주고 빼기 (올림빼기) ───────────────── */
NM_TGEN['ml_overmul'] = function(params, rng) {
  const lv = params.level || 'main';
  /* practice: 10에 가까운 수만. main: 10~100 사이 몇십에 가까운 수까지 확대
     (교재 사례 956×28, 873×37은 30·40에 가까운 두 자리 수를 곱하는 형태) */
  const rounds  = lv === 'practice' ? [10] : [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  const round   = pick(rng, rounds);
  const k       = R(rng, 1, 3);
  const near    = round - k;
  const aMax    = lv === 'practice' ? 29 : 999;
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
  /* ── 고급 D-1 확장: 피라미드 곱셈 (반복숫자끼리의 곱) ─────────────
     11×11, 111×111처럼 같은 숫자가 반복되는 두 수(자릿수 다른 반복
     숫자끼리도 가능: 222×333 등)를 곱하면 파스칼의 삼각형 계수를 닮은
     대칭 숫자열이 나온다.
     제너레이터 주의점(정독): 반복 숫자가 4 이상이면(444×444 등) 파스칼
     계수(1,2,3,4…)가 10을 넘어가 받아올림이 발생해서 더 이상 단순
     대칭 피라미드로 안 보인다 — 최종 합산 단계는 항상 "실제 곱셈"으로
     계산하므로 값 자체는 정확하지만, 시각적으로 자릿수가 대칭이 깨지는
     지점(반복 4자리 이상)이 있다는 것은 학습지 해설에서 별도로 짚어야
     한다. 여기서는 자릿수 2~6까지만 다룬다(정독 수치 범위). */
  if (params.mode === 'pyramid') {
    const lv2  = params.level || 'main';
    const lens = lv2 === 'practice' ? [2, 3] : [2, 3, 4, 5, 6];
    const len  = pick(rng, lens);
    const d1   = R(rng, 1, 9);
    const d2   = R(rng, 1, 9);
    const rep  = (d) => String(d).repeat(len);
    const a = parseInt(rep(d1), 10);
    const b = parseInt(rep(d2), 10);
    const peak = d1 * d2;              /* 파스칼 삼각형의 정점(가운데) 계수 */
    const answer = a * b;

    return {
      prompt: {
        ko: `${a} × ${b}를 피라미드 곱셈으로 계산해요`,
        en: `Calculate ${a} × ${b} using pyramid multiplication`,
        zh: `用金字塔乘法计算 ${a} × ${b}`
      },
      tex: `${a} \\times ${b} = \\square`,
      answer, answerType: 'steps', widget: 'steps',
      steps: [
        { tex: `${d1} \\times ${d2} = \\square \\;\\text{(피라미드 꼭대기 계수)}`, blank: peak },
        { tex: `${a} \\times ${b} = \\square`, blank: answer }
      ]
    };
  }

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
    /* 교재 사례(2734×5)처럼 main은 세·네 자리까지 확대, practice는 두 자리 */
    const nMax = lv === 'practice' ? 99 : 4999;
    const n      = R(rng, 1, nMax) * 2;
    const answer = n * 5;
    const tex = pick(rng, [
      `${n} \\times 5 = \\square`,
      `5 \\times ${n} = \\square`
    ]);
    return {
      prompt:{ ko:`${n} × 5를 ×10÷2 전략으로 계산해요`,
               en:`Compute ${n} × 5 using ×10÷2`,
               zh:`用×10÷2策略计算 ${n} × 5` },
      tex,
      answer, answerType:'steps', widget:'steps',
      steps:[
        { tex:`${n} \\times 10 = \\square`,   blank:n*10   },
        { tex:`${n*10} \\div 2 = \\square`,   blank:answer }
      ]
    };
  }

  /* div: n ÷ 5 = n × 2 ÷ 10 */
  const qMax = lv === 'practice' ? 49 : 2499;
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
    /* 교재 사례(7345×25)처럼 main은 세·네 자리까지 확대, practice는 두 자리 */
    const kMax = lv === 'practice' ? 40 : 999;
    const k      = R(rng, 1, kMax);
    const n      = k * 4;
    const answer = n * 25;
    const tex = pick(rng, [
      `${n} \\times 25 = \\square`,
      `25 \\times ${n} = \\square`
    ]);
    return {
      prompt:{ ko:`${n} × 25를 ×100÷4 전략으로 계산해요`,
               en:`Compute ${n} × 25 using ×100÷4`,
               zh:`用×100÷4策略计算 ${n} × 25` },
      tex,
      answer, answerType:'steps', widget:'steps',
      steps:[
        { tex:`${n} \\times 100 = \\square`,  blank:n*100  },
        { tex:`${n*100} \\div 4 = \\square`,  blank:answer }
      ]
    };
  }

  /* div: n ÷ 25 = n × 4 ÷ 100 */
  const qMax25 = lv === 'practice' ? 24 : 999;
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
  /* 고정 (a,b) 목록 대신 나누는 수 b와 몫 q를 직접 뽑아 a=b×q를 만든다.
     gcd(b×q, b) = b 이므로 항상 약분→정수 나눗셈으로 이어진다.
     교재 사례(5427÷9, 3668÷28)처럼 main은 두 자리 나누는 수·큰 몫까지 확대 */
  const bRange = lv === 'practice' ? [4, 12] : [4, 60];
  const qRange = lv === 'practice' ? [3, 20] : [10, 400];
  const b      = R(rng, bRange[0], bRange[1]);
  const q      = R(rng, qRange[0], qRange[1]);
  const a      = b * q;
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
  const mode = lv === 'practice' ? 'x2' : pick(rng, ['x2', 'x4']);
  if (mode === 'x2') {
    /* 5로 끝나는 나누는 수는 모두 ×2 하면 끝자리가 0이 된다.
       교재 사례(8085÷55)처럼 나누는 수를 5·15·…·95까지 확대 */
    const dTensMax = lv === 'practice' ? 4 : 9;
    const dTens  = R(rng, 0, dTensMax);
    const b      = dTens * 10 + 5;               /* 5,15,...,95 */
    const qMax   = lv === 'practice' ? 39 : 199;
    const q      = R(rng, 1, qMax);
    const a      = q * b;
    const answer = q;
    const b2     = b * 2;
    return {
      prompt:{ ko:`${a} ÷ ${b}를 부풀려서 계산해요`,
               en:`Expand to compute ${a} ÷ ${b}`,
               zh:`扩大计算 ${a} ÷ ${b}` },
      tex:`${a} \\div ${b} = \\square`,
      answer, answerType:'steps', widget:'steps',
      steps:[
        { tex:`${a} \\times 2 = \\square`,     blank:a*2  },
        { tex:`${a*2} \\div ${b2} = \\square`, blank:answer }
      ]
    };
  }
  /* x4: 25 또는 75로 나누기 → ×4 하면 100 또는 300 (교재 사례 3150÷75) */
  const base   = pick(rng, [25, 75]);
  const qMax   = lv === 'practice' ? 12 : 99;
  const q      = R(rng, 1, qMax);
  const a      = q * base;
  const answer = q;
  const b4     = base * 4;
  return {
    prompt:{ ko:`${a} ÷ ${base}를 부풀려서 계산해요`,
             en:`Expand to compute ${a} ÷ ${base}`,
             zh:`扩大计算 ${a} ÷ ${base}` },
    tex:`${a} \\div ${base} = \\square`,
    answer, answerType:'steps', widget:'steps',
    steps:[
      { tex:`${a} \\times 4 = \\square`,     blank:a*4    },
      { tex:`${a*4} \\div ${b4} = \\square`, blank:answer  }
    ]
  };
};

/* ── ML_FRAC_SAME — 분수 덧뺄셈 (동분모) ───────────────────── */
NM_TGEN['ml_frac_same'] = function(params, rng) {
  const op  = params.op || 'add';
  const lv  = params.level || 'main';
  /* 분모 후보를 넓혀 (분모,분자1,분자2) 조합 수를 크게 늘린다 */
  const DENS = lv === 'practice'
    ? [3,4,5,6,7,8,9,10,11,12]
    : [3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
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
      answer, answerType:'number', widget:'numpad',
      solution: [
        { tex: `\\dfrac{${num1}}{${den}} + \\dfrac{${num2}}{${den}} = \\dfrac{${num1} + ${num2}}{${den}}` },
        { tex: `${num1} + ${num2} = \\square`, blank: numR }
      ]
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
    answer, answerType:'number', widget:'numpad',
    solution: [
      { tex: `\\dfrac{${num1}}{${den}} - \\dfrac{${num2}}{${den}} = \\dfrac{${num1} - ${num2}}{${den}}` },
      { tex: `${num1} - ${num2} = \\square`, blank: numR }
    ]
  };
};

/* 서로소인 (d1,d2) 쌍을 maxD 이하 범위에서 모두 나열 (분모 후보 확대용) */
function _fracDiffGcd(a, b) { while (b) { const t = b; b = a % b; a = t; } return a; }
function _coprimePairs(maxD) {
  const list = [];
  for (let a = 2; a <= maxD; a++) {
    for (let b = a + 1; b <= maxD; b++) {
      if (_fracDiffGcd(a, b) === 1) list.push([a, b]);
    }
  }
  return list;
}
const _COPRIME_PRACTICE = _coprimePairs(9);
const _COPRIME_MAIN     = _coprimePairs(14);

/* ── ML_FRAC_DIFF — 분수 덧뺄셈 (이분모/통분) ──────────────── */
NM_TGEN['ml_frac_diff'] = function(params, rng) {
  const op = params.op || 'add';
  const lv = params.level || 'main';
  const COPRIME_PAIRS = lv === 'practice' ? _COPRIME_PRACTICE : _COPRIME_MAIN;
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
  /* ── 고급 확장 4종 — 전부 같은 뿌리(합차공식 A×B = M²−D²)를 다른
     각도로 가르친다. 정독에서 발견한 대로, 서로 복제되지 않도록
     "무엇이 주어지고 무엇을 학생이 직접 구하는가"를 의도적으로
     다르게 설계했다(아래 각 모드 주석 참조). */

  /* B-1 "같은 수만큼 큰/작은 수의 곱" — 기준수 제시형.
     차이(d)를 1로 고정하지 않고 일반화한 것이 원본 C-24(ml_diff2sq
     기본형) 대비 확장 포인트다. 기준수 A와 두 수(A−d, A+d)를 문제에
     이미 제시하므로, 학생은 "평균을 구하는" 단계 없이 바로 A²−d²만
     계산한다 — 아래 E-2(avgCalc, 평균을 직접 계산)와 구분되는 지점.
     수치 범위(정독): 두 자리(93×87)~세 자리(999×1001). */
  if (params.mode === 'anchorGiven') {
    const lv2 = params.level || 'main';
    const A = lv2 === 'practice' ? R(rng, 20, 90) : R(rng, 50, 1000);
    const dMax = Math.max(1, Math.min(A - 1, lv2 === 'practice' ? 8 : 15));
    const d = R(rng, 1, dMax);
    const x = A - d, y = A + d;
    const Asq = A * A, dSq = d * d;
    const answer = Asq - dSq;

    return {
      prompt: {
        ko: `${x}와 ${y}는 기준수 ${A}보다 각각 ${d}만큼 작고 커요. ${x} × ${y}는?`,
        en: `${x} and ${y} are each ${d} away from the anchor ${A}. What is ${x} × ${y}?`,
        zh: `${x}和${y}分别比基准数${A}小${d}和大${d}。${x} × ${y}是多少？`
      },
      tex: `${x} \\times ${y} = \\square`,
      answer, answerType: 'steps', widget: 'steps',
      steps: [
        { tex: `${A}^2 = \\square`, blank: Asq },
        { tex: `${Asq} - ${dSq} = \\square`, blank: answer }
      ]
    };
  }

  /* E-2 "평균값을 이용한 곱셈 1" — 평균 계산형.
     기준수를 주지 않고 두 수만 준다 — 학생이 평균과 차를 직접 구하는
     3단계(평균 구하기→차 구하기→평균²−차²)가 핵심이라 B-1(anchorGiven)
     과 스텝 구조 자체가 다르다. 수치 범위(정독): 8×12(평균10)~
     242×202(평균222), 차는 항상 짝수(평균이 정수)만. */
  if (params.mode === 'avgCalc') {
    const lv2 = params.level || 'main';
    const A = lv2 === 'practice' ? R(rng, 10, 30) : R(rng, 30, 222);
    const dMax = Math.max(1, Math.min(A - 1, lv2 === 'practice' ? 6 : 20));
    const d = R(rng, 1, dMax);
    const x = A - d, y = A + d;
    const Asq = A * A, dSq = d * d;
    const answer = Asq - dSq;

    return {
      prompt: {
        ko: `${x} × ${y}를 평균값 곱셈으로 계산해요`,
        en: `Calculate ${x} × ${y} using the average-value method`,
        zh: `用平均值乘法计算 ${x} × ${y}`
      },
      tex: `${x} \\times ${y} = \\square`,
      answer, answerType: 'steps', widget: 'steps',
      steps: [
        { tex: `(${x} + ${y}) \\div 2 = \\square`, blank: A },
        { tex: `${A} - ${x} = \\square`, blank: d },
        { tex: `${A}^2 - ${d}^2 = \\square`, blank: answer }
      ]
    };
  }

  /* A-6 "유명한 제곱수와 1 차이 나는 수의 제곱" — 유명 기준수 근처.
     ML11의 D-4(adjacent, 거리 항상 1·임의의 정수)와 공식은 같지만
     "동전의 양면"으로 갈라놓은 지점: 여기는 학생이 이미 외운 유명한
     기준수(25·50·90·100·120·150·200·249·501, 원문 실제 등장 값)에서
     출발하고, 거리 ★는 1로 국한하지 않는다(핵심체크가 ★칸 일반화를
     직접 요구 — 97²=100²−100×3−97×3 예시). */
  if (params.mode === 'famousNear') {
    const FAMOUS = [25, 50, 90, 100, 120, 150, 200, 249, 501];
    const A = pick(rng, FAMOUS);
    const d = R(rng, 1, 5);
    const up = R(rng, 0, 1) === 1;
    const n = up ? A + d : A - d;
    const Asq = A * A;
    const cross = d * (A + n);
    const answer = up ? Asq + cross : Asq - cross;

    return {
      prompt: {
        ko: `${n}²을 외운 제곱수 ${A}² 근처에서 구해요`,
        en: `Find ${n}² starting from the memorized square ${A}²`,
        zh: `从记住的平方数 ${A}² 出发求 ${n}²`
      },
      tex: `${n}^2 = \\square`,
      answer, answerType: 'steps', widget: 'steps',
      steps: [
        { tex: `${A}^2 = \\square`, blank: Asq },
        { tex: `${d} \\times (${A} + ${n}) = \\square`, blank: cross },
        up
          ? { tex: `${Asq} + ${cross} = \\square`, blank: answer }
          : { tex: `${Asq} - ${cross} = \\square`, blank: answer }
      ]
    };
  }

  /* E-4 "평균값을 이용한 곱셈 2·3" — 3·4자리 수의 제곱(재귀형).
     n을 끝 r자리(3자리 수는 끝 2자리, 4자리 수는 끝 3자리)만큼 위아래로
     벌려 (n−r)(n+r)+r² 로 구한다 — E-2의 평균값 공식(M²−D²의 변형,
     여기선 M=n·D=r가 아니라 두 인수 (n−r),(n+r)의 곱에 r²를 더하는
     동치식)을 큰 수에 재귀적으로 재사용한 것이다. 4자리는 r 자체가
     3자리 수라 "r²을 구하는 것"이 다시 3자리 제곱법 문제가 된다는
     재귀 구조를 별도 스텝으로 노출한다(정독 제너레이터 주의점).
     수치 범위(정독): 3자리 210~999, 4자리 1125~5134. */
  if (params.mode === 'sq3d' || params.mode === 'sq4d') {
    const is4 = params.mode === 'sq4d';
    let n, r;
    do {
      n = is4 ? R(rng, 1125, 5134) : R(rng, 210, 999);
      r = is4 ? (n % 1000) : (n % 100);
    } while (r === 0);
    const x = n - r, y = n + r;
    const xy = x * y;
    const rSq = r * r;
    const answer = xy + rSq;

    const steps = [
      { tex: `${n} - ${r} = \\square`, blank: x },
      { tex: `${n} + ${r} = \\square`, blank: y },
      { tex: `${x} \\times ${y} = \\square`, blank: xy }
    ];
    if (is4) steps.push({ tex: `${r}^2 = \\square \\;\\text{(3자리 제곱법 재사용)}`, blank: rSq });
    steps.push({ tex: `${xy} + ${rSq} = \\square`, blank: answer });

    const splitDigits = is4 ? 3 : 2;
    return {
      prompt: {
        ko: `${n}²을 분리해서 계산해요(끝 ${splitDigits}자리 기준)`,
        en: `Compute ${n}² by splitting off the last ${splitDigits} digits`,
        zh: `按末${splitDigits}位拆分计算 ${n}²`
      },
      tex: `${n}^2 = \\square`,
      answer, answerType: 'steps', widget: 'steps',
      steps
    };
  }

  const lv = params.level || 'main';
  /* 교재 사례(97×99, 249×251)처럼 main은 두 자리~세 자리 일부까지 확대 */
  let n;
  if (lv === 'practice') {
    n = R(rng, 5, 60);
  } else {
    n = pick(rng, ['2d', '2d', '3d']) === '2d' ? R(rng, 20, 99) : R(rng, 100, 250);
  }
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
   2026-08-25 승격: 결과 분모(d1*d2 등)는 입력의 두 분모를 곱하기만 하면
   나오는, 학생이 직접 구해야 할 값이라 "분모를 미리 박아 주는" 구식 설계는
   오히려 "분모는 분모끼리 곱해요"라는 이 유닛의 핵심 스킬을 대신 해 준
   셈이었다. 이제 결과 전체(분자·분모, 약분 없이 그대로)를 answerShape:
   'fraction'으로 받는다 — steps 스캐폴드가 없는 answerType:'number'라
   다칸 답 넘패드(main.js/widgets.js)로 그대로 흘러 승격에 안전했다. */
/* 분수 답을 기약분수로 줄인다 — 약분 정책(2026-08-29 원장): 4학년까지는 약분하지
   않은 값, 5학년부터는 기약분수가 정답. 분수의 곱셈·나눗셈은 초5~6 과정이라
   기약분수가 정답이어야 하는데 예전엔 6/12 같은 계산 직후 값이 정답키였다. */
function _fracReduce(n, d){
  if(d < 0){ n = -n; d = -d; }
  let a = Math.abs(n), b = Math.abs(d);
  while(b){ const t = b; b = a % b; a = t; }
  const g = a || 1;
  return [n / g, d / g];
}

NM_TGEN['ml_frac_muldiv'] = function(params, rng) {
  const op   = params.op || 'mul';
  const lv   = params.level || 'main';
  const dMax = lv === 'practice' ? 5 : 9;

  const d1 = R(rng, 2, dMax);
  const d2 = R(rng, 2, dMax);
  const n1 = R(rng, 1, d1 - 1);
  const n2 = R(rng, 1, d2 - 1);   /* div일 때도 n2>=1 항상 보장 */

  if (op === 'mul') {
    const [mn, md] = _fracReduce(n1 * n2, d1 * d2);
    return {
      prompt:{ ko:`분자는 분자끼리, 분모는 분모끼리 곱한 뒤 기약분수로 줄여요`,
               en:`Multiply numerators together and denominators together, then reduce`,
               zh:`分子乘分子，分母乘分母，最后约成最简分数` },
      tex:`\\dfrac{${n1}}{${d1}} \\times \\dfrac{${n2}}{${d2}} = \\square`,
      answer:[mn, md], answerShape:'fraction',
      answerType:'number', widget:'numpad',
      solution: [
        { tex: `\\dfrac{${n1}}{${d1}} \\times \\dfrac{${n2}}{${d2}} = \\dfrac{${n1 * n2}}{${d1 * d2}}` },
        { tex: `\\dfrac{${n1 * n2}}{${d1 * d2}} = \\dfrac{\\square}{\\square}`, blank: [mn, md] }
      ]
    };
  }

  /* div: (n1/d1) ÷ (n2/d2) = (n1/d1) × (d2/n2) */
  const [dn, dd] = _fracReduce(n1 * d2, d1 * n2);
  return {
    prompt:{ ko:`나눗셈을 곱셈으로 바꾸고 뒤집은 뒤, 기약분수로 줄여요`,
             en:`Turn division into multiplication, flip the second fraction, then reduce`,
             zh:`把除法变成乘法，再把第二个分数倒过来，最后约成最简分数` },
    tex:`\\dfrac{${n1}}{${d1}} \\div \\dfrac{${n2}}{${d2}} = \\square`,
    answer:[dn, dd], answerShape:'fraction',
    answerType:'number', widget:'numpad',
    solution: [
      { tex: `\\dfrac{${n1}}{${d1}} \\div \\dfrac{${n2}}{${d2}} = \\dfrac{${n1}}{${d1}} \\times \\dfrac{${d2}}{${n2}}` },
      { tex: `\\dfrac{${n1}}{${d1}} \\times \\dfrac{${d2}}{${n2}} = \\dfrac{\\square}{\\square}`, blank: [dn, dd] }
    ]
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

  /* d의 배수로 떨어지는 큰 덩어리(I×d)와 나머지(r)로 쪼갠 뒤 각각 나눠 더한다 */
  const whole = Math.floor(n / d);
  const chunk = whole * d;
  const rest  = n - chunk;
  const restPart = Math.round((rest / d) * 1000) / 1000;

  return {
    prompt:{ ko:`${n} ÷ ${d}: 수를 쪼개서 나누고 소수로 나타내요`,
             en:`${n} ÷ ${d}: split the number apart, divide, and write it as a decimal`,
             zh:`${n} ÷ ${d}：把数拆开来除，用小数表示` },
    tex:`${n} \\div ${d} = \\square`,
    answer, answerType:'number', widget:'numpad',
    solution: [
      { tex: `${n} = ${chunk} + ${rest}` },
      { tex: `${chunk} \\div ${d} = \\square`, blank: whole },
      { tex: `${rest} \\div ${d} = \\square`, blank: restPart },
      { tex: `${whole} + ${restPart} = \\square`, blank: answer }
    ]
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

  /* 나누는 수(vStr)의 소수점을 오른쪽으로 밀어 자연수로 만들고, 나누어지는 수(nStr)도
     같은 자리만큼 밀어준다. 실제 표시된 소수 자리 수(k)만큼 10^k를 곱한다. */
  const decPlaces = s => { const i = s.indexOf('.'); return i === -1 ? 0 : s.length - i - 1; };
  const k       = decPlaces(vStr);
  const mult    = Math.pow(10, k);
  const newV    = Math.round(parseFloat(vStr) * mult);
  const newNVal = Math.round(parseFloat(nStr) * mult * 1e6) / 1e6;
  const newNStr = trim(newNVal.toFixed(6));

  return {
    prompt:{ ko:`${nStr} ÷ ${vStr}: 나누는 수를 자연수로 만들어 나눠요`,
             en:`${nStr} ÷ ${vStr}: turn the divisor into a whole number, then divide`,
             zh:`${nStr} ÷ ${vStr}：把除数变成整数再除` },
    tex:`${nStr} \\div ${vStr} = \\square`,
    answer, answerType:'number', widget:'numpad',
    solution: [
      { tex: `${nStr} \\div ${vStr} = ${newNStr} \\div ${newV}` },
      { tex: `${newNStr} \\div ${newV} = \\square`, blank: answer }
    ]
  };
};

})();
