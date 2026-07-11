/* ============================================================
   Numbers of Magic — DV 나눗셈 스레드 생성기 (DV1~DV8)
   계약: NM_TGEN[genKey] = function(params, rng) { return problem; }
   절대 Math.random() 사용 금지 — R(rng,a,b) / pick(rng,arr) / shuffle(rng,arr) 만 사용
   ============================================================ */
(function () {
  'use strict';

  const { R, pick, shuffle } = NM_RNG;

  /* ── 내부 헬퍼 ───────────────────────────────────────────── */

  function gcdCalc(a, b) { while (b) { const t = b; b = a % b; a = t; } return a; }
  function lcmCalc(a, b) { return (a / gcdCalc(a, b)) * b; }

  /** n의 모든 약수를 오름차순으로 반환 */
  function allFactors(n) {
    const fs = [];
    for (let i = 1; i * i <= n; i++) {
      if (n % i === 0) { fs.push(i); if (i !== n / i) fs.push(n / i); }
    }
    return fs.sort((a, b) => a - b);
  }

  /** n의 소인수를 중복 포함해 오름차순 배열로 반환. e.g. 12 → [2,2,3] */
  function primeFactorArr(n) {
    const pf = [];
    for (let d = 2; d * d <= n; d++) {
      while (n % d === 0) { pf.push(d); n = Math.floor(n / d); }
    }
    if (n > 1) pf.push(n);
    return pf;
  }

  /** n의 가장 작은 소인수 반환 (n이 소수면 n 자신) */
  function smallestPF(n) {
    for (let d = 2; d * d <= n; d++) if (n % d === 0) return d;
    return n;
  }

  /* ── DV1 — 반으로 나누기(÷2) ─────────────────────────────── */
  NM_TGEN['dv1_half'] = function (params, rng) {
    const odd = params && params.odd;

    if (!odd) {
      /* 짝수 ÷ 2 */
      const half   = R(rng, 2, 24);
      const n      = half * 2;
      return {
        prompt: {
          ko: `${n}의 절반은?`,
          en: `What is half of ${n}?`,
          zh: `${n}的一半是多少？`
        },
        tex:        `${n} \\div 2 = \\square`,
        answer:     half,
        answerType: 'number',
        widget:     'array',
        array:      { n, rows: 2 }
      };
    }

    /* 홀수 ÷ 2 (나머지 1, 몫만 답) */
    const k   = R(rng, 1, 19);
    const n   = k * 2 + 1;                 // 홀수 3~39
    const ans = Math.floor(n / 2);
    return {
      prompt: {
        ko: `${n}을 둘로 나누면 몇씩이고 남는 수는?`,
        en: `Divide ${n} by 2 — what is the quotient (enter the whole part)?`,
        zh: `${n}除以2，商几（只填整数部分）？`
      },
      tex:        `${n} \\div 2 = \\square \\cdots 1`,
      answer:     ans,
      answerType: 'number',
      widget:     'array',
      array:      { n, rows: 2 }
    };
  };

  /* ── DV2 — 두 자리÷한 자리(나머지×) ─────────────────────── */
  NM_TGEN['dv2_div2d1d'] = function (params, rng) {
    const b        = R(rng, 2, 9);
    const q        = R(rng, 2, 10);
    const dividend = b * q;

    return {
      prompt: {
        ko: `${dividend}를 ${b}개씩 나누면 몇 묶음?`,
        en: `${dividend} ÷ ${b} = ?`,
        zh: `${dividend}÷${b}=？`
      },
      tex:        `${dividend} \\div ${b} = \\square`,
      answer:     q,
      answerType: 'number',
      widget:     'array',
      array:      { n: dividend, rows: b }
    };
  };

  /* ── DV3 — 나머지 있는 나눗셈 ────────────────────────────── */
  NM_TGEN['dv3_divRem'] = function (params, rng) {
    const b        = R(rng, 2, 9);
    const q        = R(rng, 2, 10);
    const r        = R(rng, 1, b - 1);     // 1 ≤ r ≤ b-1 (나머지 조건)
    const dividend = b * q + r;

    return {
      prompt: {
        ko: `${dividend} ÷ ${b}: 몫과 나머지를 구해요`,
        en: `${dividend} ÷ ${b} — find the quotient and remainder`,
        zh: `${dividend}÷${b}，求商和余数`
      },
      tex:        `${dividend} \\div ${b} = \\square \\cdots ${r}`,
      answer:     q,
      answerType: 'steps',
      widget:     'steps',
      steps: [
        { tex: `${dividend} = ${b} \\times \\square + ${r}`, blank: q },
        { tex: `${dividend} \\div ${b} = \\square`,          blank: q }
      ],
      array: { n: b * q, rows: b }   /* 몫 부분만 배열로 시각화 */
    };
  };

  /* ── DV4 — 세 자리÷한 자리 ───────────────────────────────── */
  NM_TGEN['dv4_div3d1d'] = function (params, rng) {
    const rem = params && params.rem;
    const b   = R(rng, 2, 9);

    /* q 범위: b*q ∈ [100, 999] 이면서 나머지 추가 후에도 ≤ 999 */
    const qMin = Math.ceil(100 / b);
    const qMax = Math.min(111, Math.floor((999 - (rem ? b - 1 : 0)) / b));
    const q    = R(rng, qMin, qMax);
    const r    = rem ? R(rng, 1, b - 1) : 0;
    const dv   = b * q + r;                // 피제수

    if (!rem) {
      return {
        prompt: {
          ko: `${dv} ÷ ${b} = ?`,
          en: `${dv} ÷ ${b} = ?`,
          zh: `${dv}÷${b}=？`
        },
        tex:        `${dv} \\div ${b} = \\square`,
        answer:     q,
        answerType: 'steps',
        widget:     'steps',
        steps: [
          { tex: `${dv} \\div ${b} = \\square`, blank: q }
        ]
      };
    }

    return {
      prompt: {
        ko: `${dv}÷${b}의 몫과 나머지는?`,
        en: `${dv} ÷ ${b} — quotient and remainder?`,
        zh: `${dv}÷${b}，商几余几？`
      },
      tex:        `${dv} \\div ${b} = \\square \\cdots ${r}`,
      answer:     q,
      answerType: 'steps',
      widget:     'steps',
      steps: [
        { tex: `${dv} \\div ${b} = \\square`,      blank: q },
        { tex: `\\text{나머지}: \\square`,          blank: r }
      ]
    };
  };

  /* ── DV5 — 두 자리로 나누기 (÷2d) ───────────────────────── */
  NM_TGEN['dv5_div2d'] = function (params, rng) {
    const d = (params && params.d) || 2;
    let b, q, r, dv;

    if (d === 2) {
      /* 2d÷2d: 피제수 2~3자리 */
      b  = R(rng, 11, 19);
      q  = R(rng, 2, 5);
      r  = R(rng, 0, b - 1);
      dv = b * q + r;
    } else {
      /* 3d÷2d: 피제수 3자리 */
      b  = R(rng, 11, 19);
      const qMin = Math.ceil(100 / b);
      const qMax = Math.min(50, Math.floor(999 / b));
      q  = R(rng, qMin, qMax);
      r  = R(rng, 0, b - 1);
      dv = b * q + r;
    }

    const steps = r === 0
      ? [{ tex: `${dv} = ${b} \\times \\square`,            blank: q }]
      : [
          { tex: `${dv} = ${b} \\times \\square + ${r}`,   blank: q },
          { tex: `\\text{나머지}: \\square`,                blank: r }
        ];

    return {
      prompt: {
        ko: `${dv} ÷ ${b}의 몫과 나머지를 구해요`,
        en: `Find the quotient and remainder: ${dv} ÷ ${b}`,
        zh: `求${dv}÷${b}的商和余数`
      },
      tex:        `${dv} \\div ${b} = \\square \\cdots ${r}`,
      answer:     q,
      answerType: 'steps',
      widget:     'steps',
      steps
    };
  };

  /* ── DV6 — 배수판별법 ────────────────────────────────────── */
  NM_TGEN['dv6_divisibility'] = function (params, rng) {
    const rules = (params && params.rules) || [2, 5, 10];
    const r     = pick(rng, rules);

    /*
     * 3자리 수 prefix■ (ones 자리가 □) 에서 □를 구한다.
     * prefix = R(10,99) → prefix*10+□ 가 r의 배수가 되는 가장 작은 □ 선택.
     * rules [2,5,10]: 끝자리 규칙이므로 반드시 해법 존재.
     * rules [3,6,9]  : 자릿수 합 규칙 — 0~9 중 항상 1개 이상 존재.
     */
    let prefix = 10, d = 0;
    let found  = false;
    for (let attempt = 0; attempt < 30 && !found; attempt++) {
      prefix = R(rng, 10, 99);
      for (let i = 0; i <= 9; i++) {
        if ((prefix * 10 + i) % r === 0) { d = i; found = true; break; }
      }
    }
    /* 절대 폴백 (이론상 발생 안 함) */
    if (!found) { prefix = 10; d = 0; }

    return {
      prompt: {
        ko: `□에 들어갈 숫자를 넣으면 ${r}의 배수가 돼요`,
        en: `Fill in □ to make this number a multiple of ${r}`,
        zh: `填入□使这个数是${r}的倍数`
      },
      tex:        `${prefix}\\square`,
      answer:     d,
      answerType: 'number',
      widget:     'missing'
    };
  };

  /* ── DV7 — 약수·배수·최대공약수·최소공배수 ─────────────── */
  NM_TGEN['dv7_gcdLcm'] = function (params, rng) {
    const mode = (params && params.mode) || 'factors';

    /* ---- 약수 찾기 ---- */
    if (mode === 'factors') {
      const n  = R(rng, 12, 60);
      const fs = allFactors(n);
      return {
        prompt: {
          ko: `${n}의 약수는 모두 몇 개?`,
          en: `How many factors does ${n} have in total?`,
          zh: `${n}共有几个因数？`
        },
        tex:        `${n}\\text{의 약수 개수} = \\square`,
        answer:     fs.length,
        answerType: 'number',
        widget:     'numpad'
      };
    }

    /* ---- 최대공약수(GCD) — 유클리드 호제법 스텝 ---- */
    if (mode === 'gcd') {
      /*
       * 유클리드 단계가 2회로 끝나는 쌍을 큐레이션.
       * 모두 a > b 이므로 첫 단계에서 a = b×1 + r 형태가 나온다.
       */
      const GCD_PAIRS = [
        [18,12],[20,15],[24,16],[24,18],[30,20],[36,24],
        [25,15],[20,12],[32,24],[30,18],[21,14],[28,21],
        [16,12],[20,16],[24,12],[24,20],[30,24],[27,18],
        [30,15],[30,12]
      ];
      const [a, b] = pick(rng, GCD_PAIRS);
      const g      = gcdCalc(a, b);

      /* 유클리드 단계 생성 */
      const steps = [];
      let x = a, y = b;
      while (y > 0) {
        const quo = Math.floor(x / y);
        const rem = x % y;
        steps.push({ tex: `${x} = ${y} \\times ${quo} + \\square`, blank: rem });
        x = y; y = rem;
      }
      steps.push({ tex: `\\gcd(${a},\\,${b}) = \\square`, blank: g });

      return {
        prompt: {
          ko: `${a}와 ${b}의 최대공약수(GCD)를 구해요`,
          en: `Find the GCD of ${a} and ${b}`,
          zh: `求${a}和${b}的最大公因数`
        },
        tex:        `\\gcd(${a},\\,${b}) = \\square`,
        answer:     g,
        answerType: 'steps',
        widget:     'steps',
        steps
      };
    }

    /* ---- 최소공배수(LCM) — GCD → 공식 ---- */
    /* mode === 'lcm' */
    let a, b, g, l;
    let tries = 0;
    do {
      a = R(rng, 4, 20);
      b = R(rng, 4, 20);
      g = gcdCalc(a, b);
      l = lcmCalc(a, b);
      tries++;
    } while ((a === b || l > 200 || g < 2) && tries < 60);
    /* 안전 폴백 */
    if (a === b || l > 200 || g < 2) { a = 12; b = 8; g = 4; l = 24; }

    return {
      prompt: {
        ko: `${a}와 ${b}의 최소공배수(LCM)를 구해요`,
        en: `Find the LCM of ${a} and ${b}`,
        zh: `求${a}和${b}的最小公倍数`
      },
      tex:        `\\text{lcm}(${a},\\,${b}) = \\square`,
      answer:     l,
      answerType: 'steps',
      widget:     'steps',
      steps: [
        { tex: `\\gcd(${a},\\,${b}) = \\square`,                              blank: g },
        { tex: `\\text{lcm} = ${a} \\times ${b} \\div ${g} = \\square`,      blank: l }
      ]
    };
  };

  /* ── DV8 — 소인수분해·약수의 개수 ──────────────────────── */
  NM_TGEN['dv8_primeFact'] = function (params, rng) {
    const mode = (params && params.mode) || 'isPrime';

    /* ---- 소수 판별: 합성수의 최소 소인수 구하기 ---- */
    if (mode === 'isPrime') {
      const COMPOSITES = [
        12,14,15,16,18,20,21,22,24,25,26,27,28,30,32,33,34,35,36,38,
        39,40,42,44,45,48,49,50,51,52,54,55,56,57,58,60,62,63,64,65,
        66,68,69,70,72,74,75,76,77,78,80,81,82,84,85,86,87,88,90,91,
        92,93,94,95,96,98,99,100
      ];
      const n   = pick(rng, COMPOSITES);
      const spf = smallestPF(n);
      return {
        prompt: {
          ko: `${n}의 가장 작은 소인수는?`,
          en: `What is the smallest prime factor of ${n}?`,
          zh: `${n}最小的质因数是几？`
        },
        tex:        `${n}\\text{의 최소 소인수} = \\square`,
        answer:     spf,
        answerType: 'number',
        widget:     'numpad'
      };
    }

    /* ---- 소인수분해: 나눗셈 체인 단계 ---- */
    if (mode === 'factorize') {
      const POOL = [
        12,18,20,24,28,30,36,40,42,45,48,50,
        56,60,63,70,72,75,80,84,90,96,100,108,120
      ];
      const n  = pick(rng, POOL);
      const pf = primeFactorArr(n);          // e.g. 60 → [2,2,3,5]

      /* 나눗셈 체인 스텝: n÷p0=□, □÷p1=□, ..., 마지막 소수 확인 */
      const steps = [];
      let cur = n;
      for (let i = 0; i < pf.length - 1; i++) {
        const next = cur / pf[i];
        steps.push({ tex: `${cur} \\div ${pf[i]} = \\square`, blank: next });
        cur = next;
      }
      /* 마지막 남은 수 = 소수 */
      steps.push({ tex: `${cur}\\text{ 은 소수} \\Rightarrow \\square`, blank: cur });

      const largestPrime = pf[pf.length - 1];
      return {
        prompt: {
          ko: `${n}을 소인수분해 해요`,
          en: `Prime-factorize ${n}`,
          zh: `对${n}进行质因数分解`
        },
        tex:        `${n} = ${pf.join(' \\times ')}`,
        answer:     largestPrime,
        answerType: 'steps',
        widget:     'steps',
        steps
      };
    }

    /* ---- 약수의 개수: 소인수분해 → (지수+1) 곱 공식 ---- */
    /* mode === 'count' */
    /*
     * n = p^a × q^b 형태의 수만 사용해 공식 (a+1)(b+1)을 명확히 연습.
     * 데이터: { n, p, a, q, b }
     */
    const COUNT_POOL = [
      { n:  12, p: 2, a: 2, q: 3, b: 1 },   // (3)(2)=6
      { n:  18, p: 2, a: 1, q: 3, b: 2 },   // (2)(3)=6
      { n:  20, p: 2, a: 2, q: 5, b: 1 },   // (3)(2)=6
      { n:  24, p: 2, a: 3, q: 3, b: 1 },   // (4)(2)=8
      { n:  28, p: 2, a: 2, q: 7, b: 1 },   // (3)(2)=6
      { n:  36, p: 2, a: 2, q: 3, b: 2 },   // (3)(3)=9
      { n:  40, p: 2, a: 3, q: 5, b: 1 },   // (4)(2)=8
      { n:  48, p: 2, a: 4, q: 3, b: 1 },   // (5)(2)=10
      { n:  50, p: 2, a: 1, q: 5, b: 2 },   // (2)(3)=6
      { n:  72, p: 2, a: 3, q: 3, b: 2 },   // (4)(3)=12
      { n:  75, p: 3, a: 1, q: 5, b: 2 },   // (2)(3)=6
      { n:  98, p: 2, a: 1, q: 7, b: 2 },   // (2)(3)=6
      { n: 100, p: 2, a: 2, q: 5, b: 2 }    // (3)(3)=9
    ];
    const entry = pick(rng, COUNT_POOL);
    const { n, p, a, q, b } = entry;
    const count = (a + 1) * (b + 1);

    return {
      prompt: {
        ko: `${n}의 약수의 개수를 소인수분해로 구해요`,
        en: `Use prime factorization to count the divisors of ${n}`,
        zh: `用质因数分解求${n}的因数个数`
      },
      tex: `${n} = ${p}^{${a}} \\times ${q}^{${b}} \\Rightarrow \\text{약수의 개수} = \\square`,
      answer:     count,
      answerType: 'steps',
      widget:     'steps',
      steps: [
        {
          tex:   `(${a}+1) \\times (${b}+1) = \\square`,
          blank: count
        }
      ]
    };
  };

})();
