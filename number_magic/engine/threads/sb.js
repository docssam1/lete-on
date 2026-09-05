/* ============================================================
   Numbers of Magic — SB 뺄셈 스레드 생성기 (SB1~SB7)
   계약: NM_TGEN[genKey] = function(params, rng) { return problem; }
   절대 Math.random() 사용 금지 — R(rng,a,b) / pick(rng,arr) / shuffle(rng,arr) 만 사용
   ============================================================ */
(function(){
'use strict';

const { R, pick, shuffle } = NM_RNG;

/* ── §red 예시 문항 solution 체인 헬퍼 (2026-09-05) ──
   자리별로 오른쪽부터 빼되, 모자라면 윗자리에서 10을 빌리는 과정을
   한 줄씩 보여주고, 마지막 줄은 남은 윗자리를 그대로 되접어(trivial
   floor/mod) answer와 정확히 같은 값으로 마무리한다. numDigits는 a의
   자릿수(2~4)만 넣으면 된다 — SB6(3·4자리)·AD7(4자리 뺄셈)에서 공용. */
function _subPlaceLines(a, b, diff, numDigits){
  const KO = ['일','십','백','천'];
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
      ? `\\text{${KO[p]}: } (10 + ${base}) - ${db} = \\square`
      : `\\text{${KO[p]}: } ${base} - ${db} = \\square`;
    lines.push({ tex, blank: value - db });
    borrowIn = borrowOut;
  }
  const lowerPow = Math.pow(10, numDigits - 1);
  lines.push({ tex: `${Math.floor(diff / lowerPow)} \\times ${lowerPow} + ${diff % lowerPow} = \\square`, blank: diff });
  return lines;
}

/* ── SB1 — 한 자리 뺄셈 ─────────────────────────────────────── */
NM_TGEN['sb1_sub1d'] = function(params, rng) {
  const max = (params && params.max != null) ? params.max : 9;
  const a   = R(rng, 2, max);
  const b   = R(rng, 1, a - 1);   // guarantees a - b > 0
  const ans = a - b;

  return {
    prompt: {
      ko: `${a}에서 ${b}를 빼면 얼마가 남을까요?`,
      en: `${a} minus ${b} equals?`,
      zh: `${a}减${b}等于多少？`
    },
    tex: `${a} - ${b} = \\square`,
    answer: ans,
    answerType: 'number',
    widget: 'cubes',
    cubes: { piles: [a, b], moveTo: ans },
    solution: [
      { tex: `${a} - ${b} = \\square`, blank: ans }
    ]
  };
};

/* ── SB2 — 몇십−한 자리 · 100−수 ──────────────────────────── */
NM_TGEN['sb2_subTens'] = function(params, rng) {
  const mode = (params && params.mode) || 'tens';

  if (mode === 'tens') {
    const a       = R(rng, 2, 9) * 10;   // 20~90
    const b       = R(rng, 1, 9);
    const ans     = a - b;
    // Borrowing strategy: 10-b first, then add remaining tens
    const newOnes     = 10 - b;
    const remainTens  = a - 10;

    return {
      prompt: {
        ko: `${a}에서 ${b}를 빼면 얼마가 남을까요?`,
        en: `${a} minus ${b} equals?`,
        zh: `${a}减${b}等于多少？`
      },
      tex: `${a} - ${b} = \\square`,
      answer: ans,
      answerType: 'steps',
      widget: 'steps',
      steps: [
        { tex: `10 - ${b} = \\square`,              blank: newOnes },
        { tex: `${remainTens} + ${newOnes} = \\square`, blank: ans }
      ]
    };
  }

  /* hundred mode: 100 − n (1-digit or 2-digit) */
  const b = R(rng, 0, 1) === 0 ? R(rng, 1, 9) : R(rng, 11, 99);
  const ans = 100 - b;

  let steps;
  if (b < 10) {
    steps = [
      { tex: `100 - ${b} = \\square`, blank: ans }
    ];
  } else {
    const bTens = Math.floor(b / 10) * 10;
    const bOnes = b % 10;
    const mid   = 100 - bTens;
    steps = [
      { tex: `100 - ${bTens} = \\square`, blank: mid },
      { tex: `${mid} - ${bOnes} = \\square`,     blank: ans }
    ];
  }

  return {
    prompt: {
      ko: `100에서 ${b}를 빼면 얼마가 남을까요?`,
      en: `100 minus ${b} equals?`,
      zh: `100减${b}等于多少？`
    },
    tex: `100 - ${b} = \\square`,
    answer: ans,
    answerType: 'steps',
    widget: 'steps',
    steps
  };
};

/* ── SB3 — 두 자리−한 자리 ─────────────────────────────────── */
NM_TGEN['sb3_sub2d1d'] = function(params, rng) {
  const borrow = params && params.borrow;

  if (!borrow) {
    /* No borrow: ones of a >= b */
    let a, onesA;
    do {
      a     = R(rng, 11, 99);
      onesA = a % 10;
    } while (onesA === 0);                // skip round numbers (no ones to compare)
    const b   = R(rng, 1, onesA);        // b <= onesA → no borrow needed
    const ans = a - b;

    return {
      prompt: {
        ko: `${a}에서 ${b}를 빼면 얼마가 남을까요?`,
        en: `${a} minus ${b} equals?`,
        zh: `${a}减${b}等于多少？`
      },
      tex: `${a} - ${b} = \\square`,
      answer: ans,
      answerType: 'number',
      widget: 'cubes',
      cubes: { piles: [a, b], moveTo: ans },
      solution: [
        { tex: `${a} - ${b} = \\square`, blank: ans }
      ]
    };
  }

  /* Borrow: ones of a < b (onesA must be 0~8 so b can be onesA+1..9) */
  let a, onesA;
  do {
    a     = R(rng, 12, 99);
    onesA = a % 10;
  } while (onesA === 9);                  // onesA=9 leaves no room for b > onesA ≤ 9
  const b         = R(rng, onesA + 1, 9);
  const ans       = a - b;
  const tensDigit = Math.floor(a / 10);
  const newOnes   = 10 + onesA - b;      // ones after borrowing

  return {
    prompt: {
      ko: `${a}에서 ${b}를 빼면 얼마가 남을까요? (내림이 필요해요)`,
      en: `${a} minus ${b} equals? (You'll need to borrow!)`,
      zh: `${a}减${b}等于多少？（需要退位）`
    },
    tex: `${a} - ${b} = \\square`,
    answer: ans,
    answerType: 'steps',
    widget: 'steps',
    steps: [
      { tex: `10 + ${onesA} - ${b} = \\square`,              blank: newOnes },
      { tex: `${tensDigit - 1}0 + ${newOnes} = \\square`,    blank: ans }
    ]
  };
};

/* ── SB4 — 두 자리−두 자리 ─────────────────────────────────── */
NM_TGEN['sb4_sub2d2d'] = function(params, rng) {
  const borrow = params && params.borrow;
  let a, b, ok;

  if (!borrow) {
    /* No borrow: ones(a) >= ones(b) AND tens(a) >= tens(b) */
    ok = false;
    while (!ok) {
      a  = R(rng, 21, 99);
      b  = R(rng, 11, a - 1);
      ok = (a % 10 >= b % 10) && (Math.floor(a / 10) >= Math.floor(b / 10));
    }
    const ans = a - b;
    return {
      prompt: {
        ko: `${a}에서 ${b}를 빼면 얼마가 남을까요?`,
        en: `${a} minus ${b} equals?`,
        zh: `${a}减${b}等于多少？`
      },
      tex: `${a} - ${b} = \\square`,
      answer: ans,
      answerType: 'steps',
      widget: 'vertical',
      steps: [
        { tex: `일의 자리: ${a % 10} - ${b % 10} = \\square`,  blank: ans % 10 },
        { tex: `십의 자리: \\square`,                            blank: Math.floor(ans / 10) }
      ],
      solution: _subPlaceLines(a, b, ans, 2)
    };
  }

  /* Borrow: ones(a) < ones(b), but tens(a) > tens(b) so result stays positive */
  ok = false;
  while (!ok) {
    a  = R(rng, 21, 99);
    b  = R(rng, 11, a - 1);
    ok = (a % 10 < b % 10) && (Math.floor(a / 10) > Math.floor(b / 10));
  }
  const ans         = a - b;
  const borrowOnes  = 10 + a % 10 - b % 10;   // ones digit after borrow

  return {
    prompt: {
      ko: `${a}에서 ${b}를 빼면 얼마가 남을까요? (내림이 필요해요)`,
      en: `${a} minus ${b} equals? (You'll need to borrow!)`,
      zh: `${a}减${b}等于多少？（需要退位）`
    },
    tex: `${a} - ${b} = \\square`,
    answer: ans,
    answerType: 'steps',
    widget: 'vertical',
    steps: [
      { tex: `일의 자리: 10 + ${a % 10} - ${b % 10} = \\square`, blank: borrowOnes },
      { tex: `십의 자리: \\square`,                                blank: Math.floor(ans / 10) }
    ],
    solution: _subPlaceLines(a, b, ans, 2)
  };
};

/* ── SB5 — 보정 빼기 (더 빼고 돌려받기) ────────────────────── */
NM_TGEN['sb5_subAdjust'] = function(params, rng) {
  const small = !(params && params.small === false);  // default true

  if (small) {
    /* 2d − (7 | 8 | 9): subtract 10, add back extra */
    const a     = R(rng, 12, 99);
    const sub   = pick(rng, [7, 8, 9]);
    const extra = 10 - sub;            // 1 | 2 | 3
    const ans   = a - sub;

    return {
      prompt: {
        ko: `${sub} 대신 10을 빼고, ${extra}을(를) 돌려받아요. ${a} - ${sub} = ?`,
        en: `Subtract 10 instead of ${sub}, then add back ${extra}. ${a} − ${sub} = ?`,
        zh: `减10后补回${extra}。${a} - ${sub} = ?`
      },
      tex: `${a} - ${sub} = \\square`,
      answer: ans,
      answerType: 'steps',
      widget: 'steps',
      steps: [
        { tex: `${a} - 10 + \\square`,         blank: extra },
        { tex: `${a - 10} + ${extra} = \\square`, blank: ans }
      ]
    };
  }

  /* large: 3d − 2d where b ends in 7~9 → round b up, add back the difference */
  let a, b, ok;
  ok = false;
  while (!ok) {
    a  = R(rng, 101, 999);
    b  = R(rng, 10,  99);
    ok = (b % 10 >= 7) && (a > b + 10);
  }
  const roundB = Math.ceil(b / 10) * 10;   // next multiple of 10
  const extra  = roundB - b;               // 1 | 2 | 3
  const ans    = a - b;

  return {
    prompt: {
      ko: `${b} 대신 ${roundB}을(를) 빼고, ${extra}을(를) 돌려받아요. ${a} - ${b} = ?`,
      en: `Subtract ${roundB} instead of ${b}, then add back ${extra}. ${a} − ${b} = ?`,
      zh: `减${roundB}后补回${extra}。${a} - ${b} = ?`
    },
    tex: `${a} - ${b} = \\square`,
    answer: ans,
    answerType: 'steps',
    widget: 'steps',
    steps: [
      { tex: `${a} - ${roundB} + \\square`,          blank: extra },
      { tex: `${a - roundB} + ${extra} = \\square`,  blank: ans }
    ]
  };
};

/* ── SB6 — 큰 수 뺄셈 (3·4자리) ────────────────────────────── */
NM_TGEN['sb6_subBig'] = function(params, rng) {
  const d = (params && params.d) || 3;
  let a, b;

  if (d === 3) {
    a = R(rng, 201, 999);
    b = R(rng, 100, a - 1);
  } else {
    a = R(rng, 2001, 9999);
    b = R(rng, 1000, a - 1);
  }

  const ans = a - b;

  return {
    prompt: {
      ko: `${a}에서 ${b}를 빼면 얼마가 남을까요?`,
      en: `${a} minus ${b} equals?`,
      zh: `${a}减${b}等于多少？`
    },
    tex: `${a} - ${b} = \\square`,
    answer: ans,
    answerType: 'number',
    widget: 'vertical',
    solution: _subPlaceLines(a, b, ans, d)
  };
};

/* ── SB7 — 식의 변형 ──────────────────────────────────────── */
NM_TGEN['sb7_transform'] = function(params, rng) {
  const mode = (params && params.mode) || 'group';

  if (mode === 'group') {
    /* Two pairs each summing to a multiple of 10; show regrouping strategy */
    const round1 = R(rng, 1, 8) * 10;              // e.g. 30
    const a2     = R(rng, 1, 9);
    const a1     = round1 - a2;                     // e.g. 23 (a1+a2=30)

    let round2;
    do { round2 = R(rng, 1, 8) * 10; } while (round2 === round1);
    const b2    = R(rng, 1, 9);
    const b1    = round2 - b2;                      // e.g. 15 (b1+b2=20)

    const total = round1 + round2;
    const nums  = shuffle(rng, [a1, a2, b1, b2]);

    return {
      prompt: {
        ko: `식을 변형해서 더 쉽게 계산해 볼까요? ${nums.join(' + ')} = ?`,
        en: `Rearrange to make it easier! ${nums.join(' + ')} = ?`,
        zh: `变形算式，更轻松计算！${nums.join(' + ')} = ?`
      },
      tex: `${nums.join(' + ')} = \\square`,
      answer: total,
      answerType: 'steps',
      widget: 'steps',
      steps: [
        { tex: `(${a1} + ${a2}) + (${b1} + ${b2}) = \\square + ${round2}`, blank: round1 },
        { tex: `${round1} + ${round2} = \\square`,                          blank: total }
      ]
    };
  }

  /* tens mode: find hidden pairs that sum to 10 (or a multiple of 10) */
  /* Pair 1: single-digit a1 + a2 = 10 */
  const a1 = R(rng, 1, 9);
  const a2 = 10 - a1;

  /* Pair 2: b1 (teens to 40s, non-round) + b2 such that b1+b2 is a multiple of 10 */
  const b1     = R(rng, 2, 4) * 10 + R(rng, 1, 9);   // e.g. 24, 36, 41
  const b2     = 10 - b1 % 10;                         // complement to next 10
  const round2 = b1 + b2;                              // e.g. 30, 40
  const total  = 10 + round2;
  const nums   = shuffle(rng, [a1, a2, b1, b2]);

  return {
    prompt: {
      ko: `10이 되는 짝을 찾아 묶어 볼까요? ${nums.join(' + ')} = ?`,
      en: `Find pairs that make 10s! ${nums.join(' + ')} = ?`,
      zh: `找出凑整十的配对！${nums.join(' + ')} = ?`
    },
    tex: `${nums.join(' + ')} = \\square`,
    answer: total,
    answerType: 'steps',
    widget: 'steps',
    steps: [
      { tex: `(${a1} + ${a2}) + (${b1} + ${b2}) = 10 + \\square`, blank: round2 },
      { tex: `10 + ${round2} = \\square`,                          blank: total }
    ]
  };
};

if(typeof module !== 'undefined' && module.exports) module.exports = window.NM_TGEN;
})();
