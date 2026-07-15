/* ============================================================
   Numbers of Magic — DC·MX 스레드 생성기 (DC1~DC3, MX1~MX5)
   계약: NM_TGEN[genKey] = function(params, rng) { return problem; }
   절대 Math.random() 사용 금지 — R(rng,a,b) / pick(rng,arr) / shuffle(rng,arr) 만 사용
   소수 답: 십분의 자리→answer=정수(×10), 백분의 자리→answer=정수(×100)
   steps의 blank는 항상 정수
   ============================================================ */
(function(){
'use strict';

const { R, pick, shuffle } = NM_RNG;

/* ── DC1 — 소수 덧·뺄 (1자리 · 2자리) ───────────────────────── */
NM_TGEN['dc1_decAddSub'] = function(params, rng) {
  const places = params.places || 1;

  if (places === 1) {
    const op = pick(rng, ['+', '-']);

    if (op === '+') {
      const a   = R(rng, 1, 9);
      const b   = R(rng, 1, 9);
      const sum = a + b;          /* 합 = 십분의 자리 합 */

      if (sum < 10) {
        /* 올림 없음: 0.a + 0.b = 0.sum */
        return {
          prompt: {
            ko: `소수 한 자리 덧셈: 자릿수를 맞춰 더해요`,
            en: `Add 1-place decimals: line up the decimal points`,
            zh: `一位小数加法：对齐小数点再相加`
          },
          tex:        `0.${a} + 0.${b} = 0.\\square`,
          answer:     sum,
          answerType: 'steps',
          widget:     'vertical',
          steps: [
            { tex: `${a} + ${b} = \\square \\;(\\times 10\\text{ 계산})`, blank: sum },
            { tex: `0.${a} + 0.${b} = 0.\\square`,                        blank: sum }
          ]
        };
      } else {
        /* 올림 있음: 합 >= 10 → 1.x */
        const carry = Math.floor(sum / 10);   /* = 1 */
        const frac  = sum % 10;
        return {
          prompt: {
            ko: `소수 한 자리 덧셈(올림 있음): 십의 자리로 올림해요`,
            en: `1-place decimal addition with carry into ones`,
            zh: `一位小数进位加法`
          },
          tex:        `0.${a} + 0.${b} = \\dfrac{\\square}{10}`,
          answer:     sum,                    /* 정수: 십분의 자리 합 */
          answerType: 'steps',
          widget:     'vertical',
          steps: [
            { tex: `${a} + ${b} = \\square \\;(\\text{십분의 자리 합})`, blank: sum  },
            { tex: `${carry}.${frac} = \\dfrac{\\square}{10}`,            blank: sum  }
          ]
        };
      }
    } else {
      /* 뺄셈: a > b 보장 */
      const a    = R(rng, 2, 9);
      const b    = R(rng, 1, a - 1);
      const diff = a - b;
      return {
        prompt: {
          ko: `소수 한 자리 뺄셈: 자릿수를 맞춰 빼요`,
          en: `Subtract 1-place decimals: line up the decimal points`,
          zh: `一位小数减法：对齐小数点再相减`
        },
        tex:        `0.${a} - 0.${b} = 0.\\square`,
        answer:     diff,
        answerType: 'steps',
        widget:     'vertical',
        steps: [
          { tex: `${a} - ${b} = \\square \\;(\\times 10\\text{ 계산})`, blank: diff },
          { tex: `0.${a} - 0.${b} = 0.\\square`,                         blank: diff }
        ]
      };
    }
  }

  /* places === 2 : 백분의 자리 (a, b는 10~99로 0.10~0.99 표현) */
  const op = pick(rng, ['+', '-']);

  if (op === '+') {
    const a    = R(rng, 10, 89);
    const b    = R(rng, 10, 89);
    const sum  = a + b;                /* 백분의 자리 합 */
    const aStr = String(a).padStart(2, '0');
    const bStr = String(b).padStart(2, '0');
    return {
      prompt: {
        ko: `소수 두 자리 덧셈: 백분의 자리까지 맞춰요`,
        en: `Add 2-place decimals: line up to hundredths`,
        zh: `两位小数加法：对齐到百分位`
      },
      tex:        `0.${aStr} + 0.${bStr} = \\dfrac{\\square}{100}`,
      answer:     sum,
      answerType: 'steps',
      widget:     'vertical',
      steps: [
        { tex: `${a} + ${b} = \\square \\;(\\times 100\\text{ 계산})`, blank: sum },
        { tex: `\\dfrac{\\square}{100}`,                                 blank: sum }
      ]
    };
  } else {
    /* 뺄셈: a > b 보장 */
    const a    = R(rng, 21, 99);
    const b    = R(rng, 10, a - 1);
    const diff = a - b;
    const aStr = String(a).padStart(2, '0');
    const bStr = String(b).padStart(2, '0');
    return {
      prompt: {
        ko: `소수 두 자리 뺄셈: 백분의 자리까지 맞춰요`,
        en: `Subtract 2-place decimals: line up to hundredths`,
        zh: `两位小数减法：对齐到百分位`
      },
      tex:        `0.${aStr} - 0.${bStr} = \\dfrac{\\square}{100}`,
      answer:     diff,
      answerType: 'steps',
      widget:     'vertical',
      steps: [
        { tex: `${a} - ${b} = \\square \\;(\\times 100\\text{ 계산})`, blank: diff },
        { tex: `\\dfrac{\\square}{100}`,                                  blank: diff }
      ]
    };
  }
};

/* ── DC2 — 소수 곱셈 ──────────────────────────────────────────── */
NM_TGEN['dc2_decMul'] = function(params, rng) {
  /* 두 가지 유형 중 랜덤 선택 */
  const variant = pick(rng, ['decDec', 'intDec']);

  if (variant === 'decDec') {
    /* 0.a × 0.b = (a × b) ÷ 100  →  answer = a*b (백분의 자리 표현) */
    const a    = R(rng, 1, 9);
    const b    = R(rng, 1, 9);
    const prod = a * b;               /* 백분의 자리 값 */
    return {
      prompt: {
        ko: `0.${a} × 0.${b}: 정수 곱셈 후 소수점 2자리 이동`,
        en: `0.${a} × 0.${b}: multiply integers then shift decimal 2 places`,
        zh: `0.${a}×0.${b}：整数相乘后移两位小数点`
      },
      tex:        `0.${a} \\times 0.${b} = \\dfrac{\\square}{100}`,
      answer:     prod,
      answerType: 'steps',
      widget:     'steps',
      steps: [
        { tex: `${a} \\times ${b} = \\square \\;(\\text{정수 곱셈})`,         blank: prod },
        { tex: `\\text{소수점 2자리 ← } \\Rightarrow \\dfrac{\\square}{100}`, blank: prod }
      ]
    };
  }

  /* intDec: 정수 × 0.b  →  answer = a*b (십분의 자리 표현) */
  const a    = R(rng, 11, 49);
  const b    = R(rng, 1, 9);
  const prod = a * b;                 /* 십분의 자리 값 */
  return {
    prompt: {
      ko: `${a} × 0.${b}: 정수 곱셈 후 소수점 1자리 이동`,
      en: `${a} × 0.${b}: multiply integers then shift decimal 1 place`,
      zh: `${a}×0.${b}：整数相乘后移一位小数点`
    },
    tex:        `${a} \\times 0.${b} = \\dfrac{\\square}{10}`,
    answer:     prod,
    answerType: 'steps',
    widget:     'steps',
    steps: [
      { tex: `${a} \\times ${b} = \\square`,                            blank: prod },
      { tex: `\\text{소수점 1자리 ← } \\Rightarrow \\dfrac{\\square}{10}`, blank: prod }
    ]
  };
};

/* ── DC3 — 소수 나눗셈 ────────────────────────────────────────── */
NM_TGEN['dc3_decDiv'] = function(params, rng) {
  /* 전략: 소수 나눗셈 = 10배 → 정수 나눗셈 → ÷10
     quotient_t : 몫의 십분의 자리 값 (정수)  → 실제 몫 = quotient_t / 10
     divisor    : 제수 (정수)
     dividend_t : 피제수의 십분의 자리 값 = quotient_t × divisor
     실제 피제수 = dividend_t / 10   예) 3.6 ÷ 4 = 0.9
                  quotient_t=9, divisor=4, dividend_t=36                */
  const divisors = [2, 4, 5];
  let   divisor, qt, dt;
  do {
    divisor = pick(rng, divisors);
    qt      = R(rng, 1, 9);
    dt      = qt * divisor;           /* 피제수의 십분의 자리 값 */
  } while (dt >= 100);               /* 피제수가 10 미만 보장 */

  const dvWhole = Math.floor(dt / 10);
  const dvTenth = dt % 10;
  const dvStr   = `${dvWhole}.${dvTenth}`;   /* e.g. "3.6" */

  return {
    prompt: {
      ko: `${dvStr} ÷ ${divisor}: 10배 해서 정수로 계산해요`,
      en: `${dvStr} ÷ ${divisor}: multiply by 10 to divide as integers`,
      zh: `${dvStr}÷${divisor}：乘10化为整数再计算`
    },
    tex:        `${dvStr} \\div ${divisor} = 0.\\square`,
    answer:     qt,                   /* 정수 (십분의 자리 몫) */
    answerType: 'steps',
    widget:     'steps',
    steps: [
      { tex: `${dt} \\div ${divisor} = \\square \\;(\\times 10\\text{ 계산})`, blank: qt },
      { tex: `\\div 10 \\;\\Rightarrow\\; 0.\\square`,                          blank: qt }
    ]
  };
};

/* ── MX1 — 사칙 혼합계산 (괄호 0·1·2) ──────────────────────── */
NM_TGEN['mx1_orderOps'] = function(params, rng) {
  const brackets = (params.brackets != null) ? params.brackets : 0;

  if (brackets === 0) {
    /* 두 유형 중 랜덤: a + b×c  또는  a×b + c×d */
    const variant = pick(rng, ['addMul', 'mulAddMul']);

    if (variant === 'addMul') {
      const a   = R(rng, 2, 9);
      const b   = R(rng, 2, 9);
      const c   = R(rng, 2, 9);
      const bc  = b * c;
      const ans = a + bc;
      return {
        prompt: {
          ko: `괄호가 없으면 곱셈 먼저! ${a}+${b}×${c}`,
          en: `No brackets? Multiply first! ${a}+${b}×${c}`,
          zh: `无括号先乘除！${a}+${b}×${c}`
        },
        tex:        `${a} + ${b} \\times ${c} = \\square`,
        answer:     ans,
        answerType: 'steps',
        widget:     'steps',
        steps: [
          { tex: `${b} \\times ${c} = \\square \\;(\\text{먼저!})`, blank: bc  },
          { tex: `${a} + ${bc} = \\square`,                           blank: ans }
        ]
      };
    }

    /* mulAddMul: a×b + c×d */
    const a   = R(rng, 2, 9);
    const b   = R(rng, 2, 5);
    const c   = R(rng, 2, 9);
    const d   = R(rng, 2, 5);
    const ab  = a * b;
    const cd  = c * d;
    const ans = ab + cd;
    return {
      prompt: {
        ko: `곱셈 두 개를 각각 먼저 계산해요: ${a}×${b}+${c}×${d}`,
        en: `Calculate both multiplications first: ${a}×${b}+${c}×${d}`,
        zh: `先分别计算两个乘法：${a}×${b}+${c}×${d}`
      },
      tex:        `${a} \\times ${b} + ${c} \\times ${d} = \\square`,
      answer:     ans,
      answerType: 'steps',
      widget:     'steps',
      steps: [
        { tex: `${a} \\times ${b} = \\square`,   blank: ab  },
        { tex: `${c} \\times ${d} = \\square`,   blank: cd  },
        { tex: `${ab} + ${cd} = \\square`,         blank: ans }
      ]
    };
  }

  if (brackets === 1) {
    /* (a + b) × c  — 소괄호가 연산 순서를 바꾼다 */
    const a   = R(rng, 2, 9);
    const b   = R(rng, 2, 9);
    const c   = R(rng, 2, 9);
    const ab  = a + b;
    const ans = ab * c;
    return {
      prompt: {
        ko: `괄호 안을 먼저! (${a}+${b})×${c}`,
        en: `Brackets first! (${a}+${b})×${c}`,
        zh: `括号内先算！(${a}+${b})×${c}`
      },
      tex:        `(${a} + ${b}) \\times ${c} = \\square`,
      answer:     ans,
      answerType: 'steps',
      widget:     'steps',
      steps: [
        { tex: `${a} + ${b} = \\square \\;(\\text{괄호 먼저})`, blank: ab  },
        { tex: `${ab} \\times ${c} = \\square`,                  blank: ans }
      ]
    };
  }

  /* brackets === 2: {(a + b) × c − d}  — 중괄호 포함 */
  const a   = R(rng, 2, 8);
  const b   = R(rng, 2, 8);
  const c   = R(rng, 2, 5);
  const ab  = a + b;
  const abc = ab * c;
  const d   = R(rng, 1, Math.min(abc - 1, 20));
  const ans = abc - d;
  return {
    prompt: {
      ko: `소괄호→곱셈→뺄셈 순서로! \\{(${a}+${b})×${c}−${d}\\}`,
      en: `Inner brackets first, then multiply, then subtract! \\{(${a}+${b})×${c}−${d}\\}`,
      zh: `从内到外依次计算！\\{(${a}+${b})×${c}−${d}\\}`
    },
    tex:        `\\{(${a} + ${b}) \\times ${c} - ${d}\\} = \\square`,
    answer:     ans,
    answerType: 'steps',
    widget:     'steps',
    steps: [
      { tex: `${a} + ${b} = \\square \\;(\\text{소괄호})`,   blank: ab  },
      { tex: `${ab} \\times ${c} = \\square`,                  blank: abc },
      { tex: `${abc} - ${d} = \\square`,                        blank: ans }
    ]
  };
};

/* ── MX2 — 수열의 합 ─────────────────────────────────────────── */
NM_TGEN['mx2_series'] = function(params, rng) {
  const mode = params.mode || 'nat';

  if (mode === 'nat') {
    /* 1 + 2 + 3 + … + n = n(n+1)/2  (가우스 공식) */
    const n   = R(rng, 4, 20);
    const sum = (n * (n + 1)) / 2;    /* n*(n+1)은 짝수 → 항상 정수 */
    return {
      prompt: {
        ko: `1부터 ${n}까지 모두 더하면? (가우스 공식 활용)`,
        en: `Sum of 1 to ${n}? (use Gauss's formula)`,
        zh: `1到${n}的和是多少？（用高斯公式）`
      },
      tex:        `1 + 2 + 3 + \\cdots + ${n} = \\square`,
      answer:     sum,
      answerType: 'steps',
      widget:     'steps',
      steps: [
        { tex: `n \\times (n+1) = ${n} \\times ${n + 1} = \\square`,         blank: n * (n + 1) },
        { tex: `\\dfrac{${n * (n + 1)}}{2} = \\square`,                        blank: sum         }
      ]
    };
  }

  /* mode === 'oddEven' */
  const n    = R(rng, 3, 10);
  const kind = pick(rng, ['odd', 'even']);

  if (kind === 'odd') {
    /* 처음 n개 홀수의 합: 1+3+5+…+(2n-1) = n² */
    const lastOdd = 2 * n - 1;
    const ans     = n * n;
    return {
      prompt: {
        ko: `처음 ${n}개 홀수의 합: 1+3+5+…+${lastOdd}`,
        en: `Sum of first ${n} odd numbers: 1+3+5+…+${lastOdd}`,
        zh: `前${n}个奇数之和：1+3+5+…+${lastOdd}`
      },
      tex:        `1 + 3 + 5 + \\cdots + ${lastOdd} = \\square`,
      answer:     ans,
      answerType: 'steps',
      widget:     'steps',
      steps: [
        { tex: `\\text{홀수 }${n}\\text{개의 합} = ${n}^2 = \\square`, blank: ans }
      ]
    };
  }

  /* kind === 'even': 처음 n개 짝수의 합: 2+4+6+…+2n = n(n+1) */
  const lastEven = 2 * n;
  const ans      = n * (n + 1);
  return {
    prompt: {
      ko: `처음 ${n}개 짝수의 합: 2+4+6+…+${lastEven}`,
      en: `Sum of first ${n} even numbers: 2+4+6+…+${lastEven}`,
      zh: `前${n}个偶数之和：2+4+6+…+${lastEven}`
    },
    tex:        `2 + 4 + 6 + \\cdots + ${lastEven} = \\square`,
    answer:     ans,
    answerType: 'steps',
    widget:     'steps',
    steps: [
      { tex: `${n} \\times (${n} + 1) = ${n} \\times ${n + 1} = \\square`, blank: ans }
    ]
  };
};

/* ── MX3 — 비와 비율·백분율 ──────────────────────────────────── */
NM_TGEN['mx3_ratio'] = function(params, rng) {
  const mode = params.mode || 'toPct';

  if (mode === 'toPct') {
    /* 분수 → 백분율 (%).  분모는 100으로 나누어 정수 %가 나오는 수만 선택 */
    const d   = pick(rng, [4, 5, 10, 20, 25, 50]);
    const a   = R(rng, 1, Math.min(d - 1, 9));   /* a < d 진분수 */
    const pct = (a * 100) / d;                    /* 항상 정수 */
    return {
      prompt: {
        ko: `\\frac{${a}}{${d}}를 백분율(%)로 나타내요`,
        en: `Convert \\frac{${a}}{${d}} to a percentage`,
        zh: `将\\frac{${a}}{${d}}化为百分数`
      },
      tex:        `\\dfrac{${a}}{${d}} = \\square\\,\\%`,
      answer:     pct,
      answerType: 'steps',
      widget:     'steps',
      steps: [
        { tex: `${a} \\div ${d} \\times 100 = \\square`, blank: pct }
      ]
    };
  }

  /* mode === 'hpl': 소수 → 할·푼·리 (한국식 소수 비율 표현)
     n은 세 자리 정수(100~999), 실제 소수는 n/1000
     예) n=354 → 0.354 → 3할 5푼 4리   */
  const n   = R(rng, 100, 999);
  const hal = Math.floor(n / 100);           /* 할(0.1 단위) */
  const pun = Math.floor((n % 100) / 10);   /* 푼(0.01 단위) */
  const ri  = n % 10;                        /* 리(0.001 단위) */
  const decStr = '0.' + String(n).padStart(3, '0');

  return {
    prompt: {
      ko: `${decStr}를 할·푼·리로 나타내요`,
      en: `Express ${decStr} in Korean decimal ratios (할·푼·리)`,
      zh: `将${decStr}用割·分·厘表示`
    },
    tex:        `${decStr} = \\square\\,\\text{할}\\;\\square\\,\\text{푼}\\;\\square\\,\\text{리}`,
    answer:     hal,                         /* 할(가장 큰 자리) */
    answerType: 'steps',
    widget:     'steps',
    steps: [
      { tex: `\\text{할 (0.1 단위)} = \\square`, blank: hal },
      { tex: `\\text{푼 (0.01 단위)} = \\square`, blank: pun },
      { tex: `\\text{리 (0.001 단위)} = \\square`, blank: ri  }
    ]
  };
};

/* ── MX4 — 제곱근 ────────────────────────────────────────────── */
NM_TGEN['mx4_sqrt'] = function(params, rng) {
  const hi   = params.hi || 400;
  const nMax = (hi === 400) ? 20 : 40;
  const n    = R(rng, 11, nMax);
  const sq   = n * n;

  return {
    prompt: {
      ko: `${sq}의 제곱근을 구해요`,
      en: `Find the square root of ${sq}`,
      zh: `求${sq}的平方根`
    },
    tex:        `\\sqrt{${sq}} = \\square`,
    answer:     n,
    answerType: 'number',
    widget:     'array',
    array:      { n: sq, rows: n }
  };
};

/* ── MX5 — 분수·소수 혼합 총정리 ────────────────────────────── */
NM_TGEN['mx5_mixedReview'] = function(params, rng) {

  /* 내부 헬퍼: 최대공약수 */
  function gcd(a, b) {
    while (b) { const t = b; b = a % b; a = t; }
    return a;
  }

  const type = pick(rng, ['frAdd', 'frSub', 'decAdd', 'simplify']);

  /* ── frAdd: 동분모 분수 덧셈 ─────────────────────────────── */
  if (type === 'frAdd') {
    const d   = pick(rng, [3, 4, 5, 6, 8]);
    const a   = R(rng, 1, d - 1);
    const b   = R(rng, 1, d - 1);
    const sum = a + b;                       /* 합 분자 (가분수 가능) */
    return {
      prompt: {
        ko: `동분모 분수 덧셈: \\dfrac{${a}}{${d}} + \\dfrac{${b}}{${d}}`,
        en: `Same-denominator fraction addition: \\dfrac{${a}}{${d}} + \\dfrac{${b}}{${d}}`,
        zh: `同分母分数加法：\\dfrac{${a}}{${d}} + \\dfrac{${b}}{${d}}`
      },
      tex:        `\\dfrac{${a}}{${d}} + \\dfrac{${b}}{${d}} = \\dfrac{\\square}{${d}}`,
      answer:     sum,
      answerType: 'steps',
      widget:     'steps',
      steps: [
        { tex: `${a} + ${b} = \\square \\;(\\text{분자끼리})`, blank: sum },
        { tex: `\\dfrac{\\square}{${d}}`,                        blank: sum }
      ]
    };
  }

  /* ── frSub: 동분모 분수 뺄셈 ─────────────────────────────── */
  if (type === 'frSub') {
    const d    = pick(rng, [3, 4, 5, 6, 8]);
    const a    = R(rng, 2, d - 1);            /* a >= 2 보장 */
    const b    = R(rng, 1, a - 1);            /* b < a 보장 */
    const diff = a - b;
    return {
      prompt: {
        ko: `동분모 분수 뺄셈: \\dfrac{${a}}{${d}} - \\dfrac{${b}}{${d}}`,
        en: `Same-denominator fraction subtraction: \\dfrac{${a}}{${d}} - \\dfrac{${b}}{${d}}`,
        zh: `同分母分数减法：\\dfrac{${a}}{${d}} - \\dfrac{${b}}{${d}}`
      },
      tex:        `\\dfrac{${a}}{${d}} - \\dfrac{${b}}{${d}} = \\dfrac{\\square}{${d}}`,
      answer:     diff,
      answerType: 'steps',
      widget:     'steps',
      steps: [
        { tex: `${a} - ${b} = \\square \\;(\\text{분자끼리})`, blank: diff },
        { tex: `\\dfrac{\\square}{${d}}`,                        blank: diff }
      ]
    };
  }

  /* ── decAdd: 소수 한 자리 덧셈 (올림 없는 경우) ─────────── */
  if (type === 'decAdd') {
    const a   = R(rng, 1, 8);
    const b   = R(rng, 1, 9 - a);            /* a + b < 10 보장 */
    const sum = a + b;
    return {
      prompt: {
        ko: `소수 한 자리 덧셈: 0.${a} + 0.${b}`,
        en: `1-place decimal addition: 0.${a} + 0.${b}`,
        zh: `一位小数加法：0.${a} + 0.${b}`
      },
      tex:        `0.${a} + 0.${b} = 0.\\square`,
      answer:     sum,
      answerType: 'steps',
      widget:     'steps',
      steps: [
        { tex: `${a} + ${b} = \\square \\;(\\text{십분의 자리})`, blank: sum },
        { tex: `0.\\square`,                                         blank: sum }
      ]
    };
  }

  /* ── simplify: 약분·기약분수 ─────────────────────────────── */
  /* type === 'simplify' */
  const denoms = [6, 8, 9, 10, 12];
  const d = pick(rng, denoms);
  let a, g;
  let tries = 0;
  do {
    a = R(rng, 2, d - 1);
    g = gcd(a, d);
    tries++;
  } while (g <= 1 && tries < 60);

  if (g <= 1) {
    /* 극히 드문 경우: frAdd로 대체 */
    const fd   = pick(rng, [4, 5, 6]);
    const fa   = R(rng, 1, fd - 1);
    const fb   = R(rng, 1, fd - 1);
    const fsum = fa + fb;
    return {
      prompt: {
        ko: `동분모 분수 덧셈: \\dfrac{${fa}}{${fd}} + \\dfrac{${fb}}{${fd}}`,
        en: `Same-denominator fraction addition: \\dfrac{${fa}}{${fd}} + \\dfrac{${fb}}{${fd}}`,
        zh: `同分母分数加法：\\dfrac{${fa}}{${fd}} + \\dfrac{${fb}}{${fd}}`
      },
      tex:        `\\dfrac{${fa}}{${fd}} + \\dfrac{${fb}}{${fd}} = \\dfrac{\\square}{${fd}}`,
      answer:     fsum,
      answerType: 'steps',
      widget:     'steps',
      steps: [
        { tex: `${fa} + ${fb} = \\square`, blank: fsum },
        { tex: `\\dfrac{\\square}{${fd}}`, blank: fsum }
      ]
    };
  }

  const sn = a / g;   /* 약분된 분자 */
  const sd = d / g;   /* 약분된 분모 */
  return {
    prompt: {
      ko: `\\dfrac{${a}}{${d}}를 기약분수로 나타내요`,
      en: `Simplify \\dfrac{${a}}{${d}} to its lowest terms`,
      zh: `将\\dfrac{${a}}{${d}}化为最简分数`
    },
    tex:        `\\dfrac{${a}}{${d}} = \\dfrac{\\square}{${sd}}`,
    answer:     sn,
    answerType: 'steps',
    widget:     'steps',
    steps: [
      { tex: `\\gcd(${a},\\,${d}) = \\square`,                                   blank: g  },
      { tex: `\\dfrac{${a} \\div ${g}}{${d} \\div ${g}} = \\dfrac{\\square}{${sd}}`, blank: sn }
    ]
  };
};

/* ============================================================
   DC0 — 소수 알기 · 개념 도입
   0.1 = 1/10. mode: 'count'(0.1이 n개 → 소수 답) |
   'place'(소수 첫째 자리 숫자) | 'frac'(n/10 → 소수)
   소수 답은 넘패드 decimal 지원(parseFloat 채점) 전제.
   ============================================================ */
NM_TGEN['dc0_intro'] = function(params, rng) {
  const lv   = params.level || 'main';
  const mode = pick(rng, ['count', 'place', 'frac']);

  if (mode === 'count') {
    /* 0.1이 n개면? practice: n=2~9(0.n), main: n=2~29(2.9까지) */
    const n = lv === 'practice' ? R(rng, 2, 9) : R(rng, 2, 29);
    const answer = n / 10;
    return {
      prompt: {
        ko: `0.1이 ${n}개 모이면 얼마일까요?`,
        en: `What do ${n} copies of 0.1 make?`,
        zh: `${n}个0.1是多少？`
      },
      tex: `0.1 \\times ${n} = \\square`,
      answer,
      answerType: 'number',
      widget: 'numpad'
    };
  }

  if (mode === 'place') {
    /* a.b에서 소수 첫째 자리 숫자는? — 정수 답 */
    const a = R(rng, 1, lv === 'practice' ? 9 : 99);
    const b = R(rng, 1, 9);
    return {
      prompt: {
        ko: `${a}.${b}에서 소수 첫째 자리 숫자는 무엇일까요?`,
        en: `In ${a}.${b}, what digit is in the tenths place?`,
        zh: `${a}.${b}的十分位上是几？`
      },
      tex: `${a}.${b} \\;\\rightarrow\\; \\text{소수 첫째 자리} = \\square`,
      answer: b,
      answerType: 'number',
      widget: 'missing'
    };
  }

  /* frac: n/10을 소수로 — 소수 답 */
  const n = lv === 'practice' ? R(rng, 1, 9) : R(rng, 1, 29);
  const answer = n / 10;
  return {
    prompt: {
      ko: `10분의 ${n}을 소수로 쓰면? (0.1 = 1/10이에요!)`,
      en: `Write ${n}/10 as a decimal. (Remember 0.1 = 1/10!)`,
      zh: `十分之${n}写成小数是多少？(0.1 = 1/10！)`
    },
    tex: `\\dfrac{${n}}{10} = \\square`,
    answer,
    answerType: 'number',
    widget: 'numpad'
  };
};

})();
