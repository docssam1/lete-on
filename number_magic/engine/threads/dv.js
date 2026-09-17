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
      /* 짝수 ÷ 2 — 대상 수 범위를 두 자리 후반까지 확대(array 위젯이 n칸을
         그리므로 시각적으로 과하지 않게 60까지만) */
      const half   = R(rng, 2, 60);
      const n      = half * 2;
      const tex = pick(rng, [
        `${n} \\div 2 = \\square`,
        `\\dfrac{${n}}{2} = \\square`
      ]);
      return {
        prompt: {
          ko: `${n}의 절반은?`,
          en: `What is half of ${n}?`,
          zh: `${n}的一半是多少？`
        },
        tex,
        answer:     half,
        answerType: 'number',
        widget:     'array',
        array:      { n, rows: 2 },
        solution: [
          { tex: `${n} = ${half} + ${half}` },
          { tex: `${n} \\div 2 = \\square`, blank: half }
        ]
      };
    }

    /* 홀수 ÷ 2 (나머지 1, 몫만 답) — 대상 수 범위 확대 */
    const k   = R(rng, 1, 74);
    const n   = k * 2 + 1;                 // 홀수 3~149
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
      array:      { n, rows: 2 },
      solution: [
        { tex: `${n} = ${ans * 2} + 1` },
        { tex: `${n} \\div 2 = \\square \\cdots 1`, blank: ans }
      ]
    };
  };

  /* ── DV2 — 두 자리÷한 자리(나머지×) ─────────────────────── */
  NM_TGEN['dv2_div2d1d'] = function (params, rng) {
    const lv       = (params && params.level) || 'main';
    const b        = R(rng, 2, lv === 'practice' ? 5 : 9);
    const q        = R(rng, 2, lv === 'practice' ? 9 : 10);
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
      array:      { n: dividend, rows: b },
      solution: [
        { tex: `${b} \\times \\square = ${dividend}`, blank: q },
        { tex: `${dividend} \\div ${b} = \\square`,   blank: q }
      ]
    };
  };

  /* ── DV3 — 나머지 있는 나눗셈 ────────────────────────────── */
  NM_TGEN['dv3_divRem'] = function (params, rng) {
    const lv       = (params && params.level) || 'main';
    const b        = R(rng, lv === 'practice' ? 3 : 2, lv === 'practice' ? 5 : 9);
    const q        = R(rng, 2, lv === 'practice' ? 9 : 10);
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
        ],
        solution: [
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
      ],
      solution: [
        { tex: `${b} \\times ${q} = ${b * q}` },
        { tex: `${dv} - ${b * q} = \\square`, blank: r },
        { tex: `${dv} \\div ${b} = \\square \\cdots ${r}`, blank: q }
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

    const solution = r === 0
      ? [{ tex: `${dv} = ${b} \\times \\square`, blank: q }]
      : [
          { tex: `${b} \\times ${q} = ${b * q}` },
          { tex: `${dv} - ${b * q} = \\square`, blank: r },
          { tex: `${dv} \\div ${b} = \\square \\cdots ${r}`, blank: q }
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
      steps,
      solution
    };
  };

  /* ── DV6 — 배수판별법 ────────────────────────────────────── */
  NM_TGEN['dv6_divisibility'] = function (params, rng) {
    const mode = (params && params.mode) || 'missing';

    /* ---- 자릿수 합 (3·9 배수 판정) ---- */
    if (mode === 'digitSum') {
      const n    = R(rng, 100, 999);
      const digs = String(n).split('').map(Number);
      const dsum = digs.reduce((a, b) => a + b, 0);
      return {
        prompt: {
          ko: `${n}의 각 자리 숫자를 더해요 — 3의 배수인지 확인해 봐요!`,
          en: `Add the digits of ${n} — check if it's a multiple of 3!`,
          zh: `把${n}各位数字相加——判断是不是3的倍数！`
        },
        tex:        `${digs.join('+')} = \\square`,
        answer:     dsum,
        answerType: 'number',
        widget:     'numpad',
        solution: [
          { tex: `${n} \\Rightarrow ${digs.join(',\\,')}` },
          { tex: `${digs.join('+')} = \\square`, blank: dsum }
        ]
      };
    }

    /* ---- 7의 배수 판정: 뒷자리를 떼고 그 2배를 남은 수에서 뺀다 ----
       10a + b 가 7의 배수 ⟺ a − 2b 가 7의 배수.
       (10a+b) − 7b = 10a − 6b = 2(5a − 3b) 이고 7과 2는 서로소이므로
       5a−3b, 즉 −2(a−2b)+7a 의 배수 여부가 a−2b로 판정된다.
       인쇄물은 tex 한 줄만 나가므로 원래 수 n까지 tex에 실어 자족하게 만든다
       (HANDOFF "tex 하나로 문항이 성립하는가" 규칙). 초등 대상이라 음수가
       나오지 않는 조합만 쓴다. */
    if (mode === 'rule7') {
      let n = 0, a = 0, b = 0, red = -1;
      for (let t = 0; t < 60 && red < 0; t++) {
        n = R(rng, 100, 999);
        a = Math.floor(n / 10);
        b = n % 10;
        red = a - 2 * b;
      }
      if (red < 0) { n = 203; a = 20; b = 3; red = 14; }
      return {
        prompt: {
          ko: `${n}의 뒷자리를 떼고, 남은 수에서 뒷자리의 2배를 빼요 — 7의 배수인지 알아보는 방법이에요`,
          en: `Drop the last digit of ${n} and subtract twice that digit — this tests divisibility by 7`,
          zh: `去掉${n}的末位，再从剩下的数里减去末位的2倍——这是判断7的倍数的方法`
        },
        tex:        `${n} \\rightarrow ${a} - 2 \\times ${b} = \\square`,
        answer:     red,
        answerType: 'number',
        widget:     'numpad',
        solution: [
          { tex: `${n} \\Rightarrow a=${a},\\; b=${b}` },
          { tex: `${a} - 2 \\times ${b} = \\square`, blank: red }
        ]
      };
    }

    /* ---- 11의 배수 판정: 홀수번째 자리 합 − 짝수번째 자리 합 ----
       10 ≡ −1 (mod 11) 이므로 자리마다 부호가 번갈아 붙는다. 그 교대합이
       11의 배수(0 포함)면 원래 수도 11의 배수다. 여기서도 초등 대상이라
       차가 음수가 되지 않는 네 자리 수만 고른다. */
    if (mode === 'rule11') {
      let n = 0, d = [0, 0, 0, 0], odd = 0, even = 0, diff = -1;
      for (let t = 0; t < 60 && diff < 0; t++) {
        n = R(rng, 1000, 9999);
        d = String(n).split('').map(Number);
        odd  = d[0] + d[2];   /* 첫째·셋째 자리 */
        even = d[1] + d[3];   /* 둘째·넷째 자리 */
        diff = odd - even;
      }
      if (diff < 0) { n = 8195; d = [8, 1, 9, 5]; odd = 17; even = 6; diff = 11; }
      return {
        prompt: {
          ko: `${n}의 홀수번째 자리끼리, 짝수번째 자리끼리 더한 뒤 그 차를 구해요 — 11의 배수인지 알아보는 방법이에요`,
          en: `Add the digits of ${n} in odd places and in even places, then take the difference — this tests divisibility by 11`,
          zh: `把${n}奇数位上的数字相加、偶数位上的数字相加，再求两者之差——这是判断11的倍数的方法`
        },
        tex:        `${n} \\rightarrow (${d[0]}+${d[2]}) - (${d[1]}+${d[3]}) = \\square`,
        answer:     diff,
        answerType: 'number',
        widget:     'numpad',
        solution: [
          { tex: `\\text{odd}=${d[0]}+${d[2]}=${odd}\\;,\\;\\text{even}=${d[1]}+${d[3]}=${even}` },
          { tex: `${odd} - ${even} = \\square`, blank: diff }
        ]
      };
    }

    const rules = (params && params.rules) || [2, 5, 10];
    const r     = pick(rng, rules);

    /*
     * 3자리 수 prefix■ (ones 자리가 □) 에서 □를 구한다.
     * prefix = R(10,99) → prefix*10+□ 가 r의 배수가 되는 □ 중 하나를 고른다.
     * rules [2,5,10]: 끝자리 규칙이므로 반드시 해법 존재.
     * rules [3,6,9]  : 자릿수 합 규칙 — 0~9 중 항상 1개 이상 존재.
     *
     * ★ 이 문항은 원래 유일해가 없었다(2026-08-28 인쇄 점검에서 발견).
     *   `66□`가 2의 배수가 되는 □는 0·2·4·6·8 다섯 개인데 정답키는 하나뿐이라,
     *   맞게 쓴 학생이 틀린 것으로 채점됐다. 게다가 0부터 훑어 "가장 작은" 것을
     *   집었던 탓에 2·5·10 레벨은 정답이 400문항 전부 0이었다 — 0만 스무 번
     *   쓰면 만점이었다.
     *   그래서 묻는 것을 "가장 큰 숫자"로 바꿨다. 후보가 여럿이어도 최댓값은
     *   하나뿐이라 유일해가 되고(채점이 공정해지고), 끝자리·자릿수 합 규칙을
     *   쓰는 학습 목표도 그대로다. r=10만은 후보가 0뿐이라 답이 0이다.
     */
    let prefix = 10, d = 0;
    let found  = false;
    for (let attempt = 0; attempt < 30 && !found; attempt++) {
      prefix = R(rng, 10, 99);
      const cands = [];
      for (let i = 0; i <= 9; i++) {
        if ((prefix * 10 + i) % r === 0) cands.push(i);
      }
      if (cands.length) { d = Math.max.apply(null, cands); found = true; }
    }
    /* 절대 폴백 (이론상 발생 안 함) */
    if (!found) { prefix = 10; d = 0; }

    /* 풀이용: 이 prefix에서 실제로 r의 배수를 만드는 자리 숫자 후보 전부 재계산
       (rng 미사용, prefix·r만으로 결정적) — 2·5·10은 끝자리 규칙, 3·6·9는
       자릿수 합 규칙이라 방법을 갈라 보여 준다. */
    const cands = [];
    for (let i = 0; i <= 9; i++) if ((prefix * 10 + i) % r === 0) cands.push(i);
    let solution;
    if (r === 2 || r === 5 || r === 10) {
      solution = [
        { tex: `${r}\\text{의 배수} \\Rightarrow \\text{끝자리} \\in \\{${cands.join(',\\,')}\\}` },
        { tex: `\\text{가장 큰 숫자} = \\square`, blank: d }
      ];
    } else {
      const psum = String(prefix).split('').reduce((s, ch) => s + Number(ch), 0);
      solution = [
        { tex: `${psum} + \\text{끝자리} \\equiv 0\\ (\\text{mod}\\ ${r}) \\Rightarrow \\{${cands.join(',\\,')}\\}` },
        { tex: `\\text{가장 큰 숫자} = \\square`, blank: d }
      ];
    }

    return {
      prompt: {
        ko: `${r}의 배수가 되도록 □에 넣을 수 있는 가장 큰 숫자는?`,
        en: `What is the largest digit for □ that makes this a multiple of ${r}?`,
        zh: `要使这个数是${r}的倍数，□里能填的最大数字是几？`
      },
      tex:        `${prefix}\\square`,
      answer:     d,
      answerType: 'number',
      widget:     'missing',
      solution
    };
  };

  /* ── DV7 — 약수·배수·최대공약수·최소공배수 ─────────────── */
  NM_TGEN['dv7_gcdLcm'] = function (params, rng) {
    const mode = (params && params.mode) || 'factors';

    /* ---- 약수 찾기 ---- */
    if (mode === 'factors') {
      const lv = (params && params.level) || 'main';
      const n  = R(rng, 10, lv === 'practice' ? 40 : 120);
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
        widget:     'numpad',
        solution: [
          { tex: `${n}\\text{의 약수}: ${fs.join(',\\,')}` },
          { tex: `\\text{개수} = \\square`, blank: fs.length }
        ]
      };
    }

    /* ---- 최대공약수(GCD) — 유클리드 호제법 스텝 ----
       고정 목록 대신 a,b를 직접 뽑아 유클리드 호제법을 돌려 본다.
       g<2(재미없는 서로소)나 단계가 너무 많은(3단계 초과) 조합은 다시 뽑아,
       "2~3단계로 끝나는 쌍"이라는 원래 설계 의도는 유지하면서 조합 수를 크게 늘린다. */
    if (mode === 'gcd') {
      let a, b, g = 0, steps = null;
      let tries = 0;
      do {
        a = R(rng, 12, 90);
        b = R(rng, 6, 72);
        if (a === b) { tries++; continue; }
        if (a < b) { const t = a; a = b; b = t; }
        steps = [];
        let x = a, y = b;
        while (y > 0) {
          const quo = Math.floor(x / y);
          const rem = x % y;
          steps.push({ tex: `${x} = ${y} \\times ${quo} + \\square`, blank: rem });
          x = y; y = rem;
        }
        g = x;
        tries++;
      } while ((!steps || g < 2 || steps.length > 3) && tries < 100);

      if (!steps || g < 2 || steps.length > 3) {
        /* 극히 드문 폴백 */
        a = 18; b = 12; g = 6;
        steps = [
          { tex: `18 = 12 \\times 1 + \\square`, blank: 6 },
          { tex: `12 = 6 \\times 2 + \\square`,  blank: 0 }
        ];
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
        steps,
        solution: steps.slice()
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
      ],
      solution: [
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
        widget:     'numpad',
        solution: [
          { tex: `${n} \\div ${spf} = \\square`, blank: n / spf },
          { tex: `\\text{최소 소인수} = \\square`, blank: spf }
        ]
      };
    }

    /* ---- 소인수분해: 나눗셈 체인 단계 ----
       고정 목록 대신 대상 수 범위를 넓혀 직접 뽑는다. 소인수가 1개뿐인
       소수는 "분해"가 의미 없으므로 제외(소인수 개수 ≥ 2, 중복 포함). */
    if (mode === 'factorize') {
      const lv = (params && params.level) || 'main';
      const hi = lv === 'practice' ? 60 : 200;
      let n;
      do { n = R(rng, 10, hi); } while (primeFactorArr(n).length < 2);
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
        steps,
        solution: steps.slice()
      };
    }

    /* ---- 약수의 개수: 소인수분해 → (지수+1) 곱 공식 ---- */
    /* mode === 'count' */
    /*
     * 고정 목록 대신 n = p^a × q^b 형태를 직접 조합해 (a+1)(b+1) 공식을
     * 연습한다. n이 너무 커지지 않도록(≤1000) 지수를 제한한다.
     */
    const PRIMES = [2, 3, 5, 7, 11];
    let n, p, a, q, b;
    let tries = 0;
    do {
      const two = shuffle(rng, PRIMES).slice(0, 2);
      p = two[0]; q = two[1];
      a = R(rng, 1, 5);
      b = R(rng, 1, 4);
      n = Math.pow(p, a) * Math.pow(q, b);
      tries++;
    } while (n > 1000 && tries < 60);
    if (n > 1000) { n = 12; p = 2; a = 2; q = 3; b = 1; }
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
      ],
      solution: [
        {
          tex:   `(${a}+1) \\times (${b}+1) = \\square`,
          blank: count
        }
      ]
    };
  };

  /* ══════════════════════════════════════════════════════════════
     DV12~DV15 — 나눗셈의 뜻 (2026-09-17, 원장 지시)
     "나누기 전략이 직접 나누기가 있고, 같은 수를 빼서 나누기가 있고, 묶어서
      나누기도 있잖아. 양이 적고 너무 단순해. 좀 제대로 생각을 할 수 있도록."
     ── 왜 따로 만드는가 ──
     기존 DV1(÷2)·DV2(2d÷1d)는 `12 ÷ 3 = □` 한 줄을 배열로 보여 주고 답만 받는다.
     교과서(3-1)가 나눗셈을 도입하는 세 가지 뜻 — 똑같이 나누기(등분) · 묶어 세기
     (포함) · 같은 수를 빼기(반복 뺄셈) — 는 어디에도 없었다. 스토리 브리지 유닛
     T-DV1의 노트에는 세 얼굴이 적혀 있었지만 연습은 여전히 DV2였다.
     ── 설계 ──
     · DV12 등분: "12개를 3명이 똑같이" → 배열 위젯의 줄 수를 **사람 수**로 맞춰야 한다.
     · DV13 포함: "12개를 3개씩 묶으면" → 줄 수를 **묶음 수**로. 같은 12÷3인데 줄 수가
       다르다 — 문장을 읽어야 맞는다. level mix는 두 뜻을 섞어 낸다.
     · DV14 반복 뺄셈: 12−3=9, 9−3=6, 6−3=3, 3−3=0 을 단계 위젯으로 **직접 빼 가며**
       몇 번 뺐는지 센다. 나머지 레벨은 더 못 빼는 데서 멈추고 남는 수를 본다.
     · DV15 곱셈↔나눗셈: a×b=c에서 나눗셈 둘, 그리고 □÷b=q(나누어지는 수를 찾기),
       c÷□=q(나누는 수를 찾기) — 역연산으로 생각하게 한다.
     · 이야기가 있는 셋은 p.word/wordAsk/wordUnit을 함께 내서 인쇄(exam.js 문장제
       분기)에서도 이야기가 찍힌다. tex만 찍히면 뜻이 사라지고 DV2와 같아진다.
     ══════════════════════════════════════════════════════════════ */
  /* 소재 — box: 담는 그릇(등분 S3·포함 G3의 "필통 3개에" 틀), food: 먹는 틀(S2·G4)을 쓸 수 있는가 */
  const DV_ITEMS = [
    { ko:'사탕',   unit:'개',  en:'candies',         one:'candy',          zh:'糖',   zhU:'颗', food:true,
      box:{ ko:'봉지', en:'bags', enOne:'bag', zh:'袋子' } },
    { ko:'쿠키',   unit:'개',  en:'cookies',         one:'cookie',         zh:'饼干', zhU:'块', food:true,
      box:{ ko:'접시', en:'plates', enOne:'plate', zh:'盘子' } },
    { ko:'구슬',   unit:'개',  en:'marbles',         one:'marble',         zh:'弹珠', zhU:'颗', food:false,
      box:{ ko:'주머니', en:'pouches', enOne:'pouch', zh:'袋子' } },
    { ko:'색종이', unit:'장',  en:'sheets of paper', one:'sheet of paper', zh:'彩纸', zhU:'张', food:false,
      box:{ ko:'상자', en:'boxes', enOne:'box', zh:'盒子' } },
    { ko:'스티커', unit:'장',  en:'stickers',        one:'sticker',        zh:'贴纸', zhU:'张', food:false,
      box:{ ko:'봉투', en:'envelopes', enOne:'envelope', zh:'信封' } },
    { ko:'연필',   unit:'자루', en:'pencils',        one:'pencil',         zh:'铅笔', zhU:'支', food:false,
      box:{ ko:'필통', en:'pencil cases', enOne:'pencil case', zh:'文具盒' } }
  ];
  const DV_NAMES = [
    { ko:'지우', en:'Jiwoo',  zh:'智友' }, { ko:'하준', en:'Hajun',  zh:'河俊' },
    { ko:'소율', en:'Soyul',  zh:'素律' }, { ko:'도윤', en:'Doyun',  zh:'道允' },
    { ko:'서연', en:'Seoyeon',zh:'瑞妍' }, { ko:'유나', en:'Yuna',   zh:'由娜' }
  ];
  /* 받침 유무로 조사 고르기 — "개를"·"장을"·"자루를" */
  function dvBatchim(w){ const c = w.charCodeAt(w.length-1); return c >= 0xAC00 && c <= 0xD7A3 && ((c - 0xAC00) % 28) !== 0; }
  function dvJosa(w, withB, noB){ return w + (dvBatchim(w) ? withB : noB); }
  /* 숫자 읽기의 받침: 2·4·5·9 → 받침 없음(를), 3·6·7·8·10 → 있음(을) */
  function dvNumJosa(n, withB, noB){ return String(n) + ([2,4,5,9].indexOf(n % 10) >= 0 && n % 10 !== 0 ? noB : withB); }

  /* 풀이 사슬(인쇄 예시·따라풀기·정답지 해설용) — 답만 보여 주지 않는다(2026-09-17,
     원장 "아이들이 답만 본다고 알아? 과정을 연결하여 보여 줘야지").
       ① b씩 세기: 3, 6, 9, 12 ⇒ □(몇 번?)  — 등분이면 "한 바퀴 돌 때마다 b개",
                                             포함이면 "묶음마다 b개". 그림(array)과 짝.
       ② b × □ = a                            — 센 횟수를 곱셈으로 확인
       ③ a ÷ b = □                            — 나눗셈 식으로 마무리
     ①의 답이 곧 몫이라 세 단계의 빈칸이 모두 같은 수로 이어진다 — 그래서 '연결'이다. */
  function dvSolutionChain(a, b, q){
    const skip = [];
    for (let i = 1; i <= q; i++) skip.push(String(i * b));
    return [
      { tex: `${skip.join(',\;')} \\Rightarrow \\square`, blank: q },
      { tex: `${b} \\times \\square = ${a}`, blank: q },
      { tex: `${a} \\div ${b} = \\square`,   blank: q }
    ];
  }

  /* ══ 문장 틀 — 등분(share) 4가지 · 포함(group) 4가지 (2026-09-17, 원장) ══
     "몇 개씩 먹어야 7명이 먹을 수 있을까요?", "연필 24자루가 필통 3개에 있습니다. 필통 한 개에는…"
     처럼 같은 등분제도 말이 달라야 하고, 포함제("한 명에 3개씩 주면 몇 명?", "필통 하나에
     3자루씩 넣으면 필통이 몇 개?", "하루에 3개씩 먹으면 며칠?")와 **구분**해야 한다.
     틀마다 답의 단위(wordUnit)와 그림 설명(picCap)이 달라진다 — 그게 구분의 근거다.
       share: {word, ask, unit=물건 단위, rowLabel=줄이 뜻하는 것("3명"·"필통 3개"…)}
       group: {word, ask, unit=답 단위(묶음·명·개·일)} */
  const SHARE_FRAMES = [
    { id:'give', build:(a,b,q,it,who)=>({
        word:{ ko:`${dvJosa(who.ko,'은','는')} ${it.ko} ${a}${dvJosa(it.unit,'을','를')} ${b}명이 똑같이 나누어 가지도록 나눠 줘요.`,
               en:`${who.en} shares ${a} ${it.en} equally among ${b} children.`,
               zh:`${who.zh}把${a}${it.zhU}${it.zh}平均分给${b}个小朋友。` },
        ask:{ ko:`한 명이 몇 ${it.unit}씩 가질까요?`, en:`How many does each child get?`, zh:`每人分到几${it.zhU}？` },
        rowLabel:{ ko:`${b}명`, en:`${b} children`, zh:`${b}人` } }) },
    { id:'eat', food:true, build:(a,b,q,it,who)=>({
        word:{ ko:`${it.ko} ${a}${dvJosa(it.unit,'을','를')} ${b}명이 똑같이 나누어 먹으려고 해요.`,
               en:`${b} children want to share ${a} ${it.en} equally.`,
               zh:`${b}个小朋友想把${a}${it.zhU}${it.zh}平均分着吃。` },
        ask:{ ko:`몇 ${it.unit}씩 먹어야 ${b}명이 똑같이 다 먹을 수 있을까요?`,
              en:`How many should each one eat so that all ${b} get the same?`,
              zh:`每人吃几${it.zhU}，${b}个人才能正好分完？` },
        rowLabel:{ ko:`${b}명`, en:`${b} children`, zh:`${b}人` } }) },
    { id:'box', build:(a,b,q,it,who)=>({
        word:{ ko:`${it.ko} ${a}${dvJosa(it.unit,'이','가')} ${it.box.ko} ${b}개에 똑같이 들어 있어요.`,
               en:`${a} ${it.en} are packed equally into ${b} ${it.box.en}.`,
               zh:`${a}${it.zhU}${it.zh}平均装在${b}个${it.box.zh}里。` },
        ask:{ ko:`${it.box.ko} 한 개에는 몇 ${it.unit}씩 들어 있을까요?`,
              en:`How many are in each ${it.box.enOne}?`,
              zh:`每个${it.box.zh}里有几${it.zhU}？` },
        rowLabel:{ ko:`${it.box.ko} ${b}개`, en:`${b} ${it.box.en}`, zh:`${b}个${it.box.zh}` } }) },
    { id:'friends', build:(a,b,q,it,who)=>({
        word:{ ko:`${dvJosa(who.ko,'은','는')} ${it.ko} ${a}${dvJosa(it.unit,'을','를')} 친구 ${b}명에게 똑같이 나누어 주었어요.`,
               en:`${who.en} gave ${a} ${it.en} equally to ${b} friends.`,
               zh:`${who.zh}把${a}${it.zhU}${it.zh}平均送给了${b}个朋友。` },
        ask:{ ko:`친구 한 명이 받은 ${dvJosa(it.ko,'은','는')} 몇 ${it.unit}일까요?`,
              en:`How many did each friend get?`,
              zh:`每个朋友得到几${it.zhU}？` },
        rowLabel:{ ko:`친구 ${b}명`, en:`${b} friends`, zh:`${b}个朋友` } }) }
  ];
  const GROUP_FRAMES = [
    { id:'bundle', build:(a,b,q,it,who)=>({
        word:{ ko:`${dvJosa(who.ko,'은','는')} ${it.ko} ${a}${dvJosa(it.unit,'을','를')} ${b}${it.unit}씩 한 묶음으로 묶어요.`,
               en:`${who.en} bundles ${a} ${it.en} into groups of ${b}.`,
               zh:`${who.zh}把${a}${it.zhU}${it.zh}每${b}${it.zhU}捆成一组。` },
        ask:{ ko:`몇 묶음이 될까요?`, en:`How many groups are there?`, zh:`能分成几组？` },
        unit:{ ko:'묶음', en:'groups', zh:'组' } }) },
    { id:'each', build:(a,b,q,it,who)=>({
        word:{ ko:`${dvJosa(who.ko,'은','는')} ${it.ko} ${a}${dvJosa(it.unit,'을','를')} 한 명에게 ${b}${it.unit}씩 나누어 주려고 해요.`,
               en:`${who.en} wants to give ${b} ${it.en} to each child, using ${a} ${it.en}.`,
               zh:`${who.zh}要把${a}${it.zhU}${it.zh}每人分${b}${it.zhU}。` },
        ask:{ ko:`몇 명에게 줄 수 있을까요?`, en:`How many children can get some?`, zh:`可以分给几个人？` },
        unit:{ ko:'명', en:'children', zh:'人' } }) },
    { id:'box', build:(a,b,q,it,who)=>({
        word:{ ko:`${it.ko} ${a}${dvJosa(it.unit,'을','를')} ${it.box.ko} 한 개에 ${b}${it.unit}씩 담으려고 해요.`,
               en:`We pack ${a} ${it.en}, ${b} to a ${it.box.enOne}.`,
               zh:`把${a}${it.zhU}${it.zh}每${b}${it.zhU}装一个${it.box.zh}。` },
        ask:{ ko:`${dvJosa(it.box.ko,'은','는')} 몇 개 필요할까요?`, en:`How many ${it.box.en} do we need?`, zh:`需要几个${it.box.zh}？` },
        unit:{ ko:'개', en:it.box.en, zh:'个' } }) },
    { id:'days', food:true, build:(a,b,q,it,who)=>({
        word:{ ko:`${dvJosa(who.ko,'은','는')} ${it.ko} ${a}${dvJosa(it.unit,'을','를')} 하루에 ${b}${it.unit}씩 먹어요.`,
               en:`${who.en} eats ${b} ${it.en} a day and has ${a} ${it.en}.`,
               zh:`${who.zh}有${a}${it.zhU}${it.zh}，每天吃${b}${it.zhU}。` },
        ask:{ ko:`며칠 동안 먹을 수 있을까요?`, en:`How many days will they last?`, zh:`可以吃几天？` },
        unit:{ ko:'일', en:'days', zh:'天' } }) }
  ];
  function dvFrame(rng, frames, item){
    const ok = frames.filter(f => !f.food || item.food);
    return pick(rng, ok);
  }
  function dvPrompt(word, ask){
    return { ko: word.ko + ' ' + ask.ko, en: word.en + ' ' + ask.en, zh: word.zh + ask.zh };
  }

  /* ── DV12 — 똑같이 나누기(등분) ──────────────────────────── */
  function dvShareProblem(rng, b, q, item, who){
    const a = b * q;
    const f = dvFrame(rng, SHARE_FRAMES, item).build(a, b, q, item, who);
    return {
      prompt: dvPrompt(f.word, f.ask),
      word: f.word, wordAsk: f.ask,
      wordUnit: { ko: item.unit, en: item.en, zh: item.zhU },
      tex: `${a} \\div ${b} = \\square`,
      answer: q, answerType: 'number',
      widget: 'array', array: { n: a, rows: b },   /* b명(b개 그릇) = b줄 → 한 줄이 한 몫 */
      meaning: 'share',
      picCap: { ko: `${f.rowLabel.ko} → ${b}줄 · 한 줄이 한 몫(${q}${item.unit})`,
                en: `${f.rowLabel.en} → ${b} rows · one row = one share (${q})`,
                zh: `${f.rowLabel.zh}→${b}行 · 一行是一份（${q}${item.zhU}）` },
      solution: dvSolutionChain(a, b, q)
    };
  }
  NM_TGEN['dv12_share'] = function (params, rng) {
    const hi  = !!(params && params.hi);
    const big = !!(params && params.big);
    const item = pick(rng, DV_ITEMS), who = pick(rng, DV_NAMES);
    if (big) {                       /* 몫이 두 자리 — 배열 위젯이 60칸까지라 b·q ≤ 60 */
      const b = R(rng, 2, 4), q = R(rng, 10, 15);
      return dvShareProblem(rng, b, q, item, who);
    }
    const b = R(rng, 2, hi ? 9 : 5), q = R(rng, 2, 9);
    return dvShareProblem(rng, b, q, item, who);
  };

  /* ── DV13 — 묶어서 나누기(포함) ──────────────────────────── */
  function dvGroupProblem(rng, b, q, item, who){
    const a = b * q;
    const f = dvFrame(rng, GROUP_FRAMES, item).build(a, b, q, item, who);
    return {
      prompt: dvPrompt(f.word, f.ask),
      word: f.word, wordAsk: f.ask,
      wordUnit: f.unit,
      tex: `${a} \\div ${b} = \\square`,
      answer: q, answerType: 'number',
      widget: 'array', array: { n: a, rows: q },   /* q줄 = q묶음 → 한 줄이 한 묶음(b개) */
      meaning: 'group',
      picCap: { ko: `${b}${item.unit}씩 → ${q}${f.unit.ko}`,
                en: `groups of ${b} → ${q} ${f.unit.en}`,
                zh: `每${b}${item.zhU}一组→${q}${f.unit.zh}` },
      solution: dvSolutionChain(a, b, q)
    };
  }
  NM_TGEN['dv13_group'] = function (params, rng) {
    const hi  = !!(params && params.hi);
    const mix = !!(params && params.mix);
    const item = pick(rng, DV_ITEMS), who = pick(rng, DV_NAMES);
    const b = R(rng, 2, (hi || mix) ? 9 : 5), q = R(rng, 2, 9);
    /* mix — 같은 a÷b인데 어떤 때는 "몇 명에게 몇 개씩"이고 어떤 때는 "몇 개씩 몇 묶음"이다.
       배열의 줄 수(사람 수 vs 묶음 수)가 달라지므로 문장을 읽지 않으면 틀린다. */
    if (mix && R(rng, 0, 1) === 0) return dvShareProblem(rng, b, q, item, who);
    return dvGroupProblem(rng, b, q, item, who);
  };

  /* ── DV16 — 등분제·포함제 구분(2026-09-17, 원장 "등분제와 포함제 문제를 구분해야지") ──
     같은 a÷b 이야기라도 "한 명(한 그릇)의 몫"을 묻는지, "몇 명·몇 묶음·며칠"을 묻는지 가려낸다.
       kind(L1): 어떤 나눗셈인가 — 보기 2개(순서 고정: ① 똑같이 나누기 ② 묶어서 나누기)
       unit(L2): 답이 무엇을 나타내는가 — 보기 3개(섞음)
     계산은 시키지 않는다 — 구분 자체가 문항이다. 보기는 wp.js 문장제와 같은 {ko,en,zh} 묶음. */
  NM_TGEN['dv16_kind'] = function (params, rng) {
    const mode = (params && params.mode) || 'kind';
    const item = pick(rng, DV_ITEMS), who = pick(rng, DV_NAMES);
    const b = R(rng, 2, 9), q = R(rng, 2, 9), a = b * q;
    const share = R(rng, 0, 1) === 0;
    const f = dvFrame(rng, share ? SHARE_FRAMES : GROUP_FRAMES, item).build(a, b, q, item, who);
    let ask, choices, answer, note;
    if (mode === 'unit') {
      const opts = [
        { ko:`한 명(한 ${item.box.ko})이 가지는 ${item.ko}의 개수`, en:`how many ${item.en} one child (one ${item.box.enOne}) gets`, zh:`一个人（一个${item.box.zh}）分到几${item.zhU}${item.zh}`, ok: share },
        { ko:`몇 명(몇 묶음·며칠)인지`, en:`how many children (groups, days)`, zh:`几个人（几组、几天）`, ok: !share },
        { ko:`${item.ko} 전체의 개수`, en:`the total number of ${item.en}`, zh:`${item.zh}的总数`, ok: false }
      ];
      const order = shuffle(rng, [0, 1, 2]);
      choices = { ko: order.map(i => opts[i].ko), en: order.map(i => opts[i].en), zh: order.map(i => opts[i].zh) };
      answer = order.findIndex(i => opts[i].ok) + 1;
      ask = { ko:`이 문제의 답은 무엇을 나타낼까요?`, en:`What does the answer to this problem tell us?`, zh:`这道题的答案表示什么？` };
    } else {
      choices = {
        ko:[`똑같이 나누기 — 한 명(한 ${item.box.ko})의 몫을 구해요`, `묶어서 나누기 — 몇 명(몇 묶음·며칠)인지 구해요`],
        en:[`Sharing equally — find one child's (one ${item.box.enOne}'s) share`, `Grouping — find how many children (groups, days)`],
        zh:[`平均分——求一个人（一个${item.box.zh}）的份`, `分组——求几个人（几组、几天）`]
      };
      answer = share ? 1 : 2;
      ask = { ko:`이 문제는 어떤 나눗셈일까요?`, en:`Which kind of division is this?`, zh:`这是哪一种除法？` };
    }
    note = { ko: choices.ko[answer - 1], en: choices.en[answer - 1], zh: choices.zh[answer - 1] };
    const pr = {};
    ['ko','en','zh'].forEach(lang => {
      const opts = ' ' + choices[lang].map((c, i) => `${i + 1}) ${c}`).join('  ');
      pr[lang] = f.word[lang] + (lang === 'zh' ? '' : ' ') + ask[lang] + opts;
    });
    return {
      prompt: pr,
      word: f.word, wordAsk: ask, choices,
      answer, answerType: 'number', widget: 'numpad',
      answerNote: note,
      meaning: share ? 'share' : 'group', kindOf: share ? 'share' : 'group'
    };
  };

  /* ── DV14 — 같은 수를 빼서 나누기(반복 뺄셈) ─────────────── */
  NM_TGEN['dv14_repsub'] = function (params, rng) {
    const rem = !!(params && params.rem);
    const b = R(rng, 2, 9);
    const q = R(rng, 2, 5);                 /* 단계가 여섯을 넘지 않게 */
    const r = rem ? R(rng, 1, b - 1) : 0;
    const a = b * q + r;
    const steps = [];
    let cur = a;
    for (let i = 0; i < q; i++) { steps.push({ tex: `${cur} - ${b} = \\square`, blank: cur - b }); cur -= b; }
    steps.push({ tex: rem ? `${a} \\div ${b} = \\square \\cdots ${r}` : `${a} \\div ${b} = \\square`, blank: q });
    const word = {
      ko: rem ? `${a}에서 ${dvNumJosa(b,'을','를')} 계속 빼요. 더 뺄 수 없을 때까지 빼요.`
              : `${a}에서 ${dvNumJosa(b,'을','를')} 0이 될 때까지 계속 빼요.`,
      en: rem ? `Keep subtracting ${b} from ${a} until you can't subtract any more.`
              : `Keep subtracting ${b} from ${a} until you reach 0.`,
      zh: rem ? `从${a}里一直减${b}，减到不能再减为止。` : `从${a}里一直减${b}，直到变成0。`
    };
    const ask = {
      ko: rem ? `몇 번 뺄 수 있고, 몇이 남을까요? 뺄셈을 차례로 써 보세요.`
              : `몇 번 빼면 0이 될까요? 뺄셈을 차례로 써 보세요.`,
      en: rem ? `How many times can you subtract, and what is left? Write each subtraction.`
              : `How many times until 0? Write each subtraction.`,
      zh: rem ? `能减几次？还剩几？把每一步减法写出来。` : `减几次会变成0？把每一步减法写出来。`
    };
    return {
      prompt: { ko: word.ko + ' ' + ask.ko, en: word.en + ' ' + ask.en, zh: word.zh + ask.zh },
      word, wordAsk: ask,
      wordUnit: { ko: '번', en: 'times', zh: '次' },
      tex: rem ? `${a} \\div ${b} = \\square \\cdots ${r}` : `${a} \\div ${b} = \\square`,
      answer: q, answerType: 'steps',
      widget: 'steps', steps,
      meaning: 'repsub'
    };
  };

  /* ── DV15 — 곱셈으로 나눗셈(곱셈↔나눗셈의 관계) ──────────── */
  NM_TGEN['dv15_family'] = function (params, rng) {
    const mode = (params && params.mode) || 'facts';
    const a = R(rng, 2, 9), b = R(rng, 2, 9), c = a * b;
    if (mode === 'dividend') {
      /* □ ÷ b = a — 나누어지는 수를 찾는다: b×a로 되돌린다 */
      return {
        prompt: { ko: `□ ÷ ${b} = ${a}의 □는 얼마일까요? 곱셈으로 되돌려 봐요.`,
                  en: `□ ÷ ${b} = ${a}. Find □ by multiplying back.`,
                  zh: `□÷${b}=${a}，□是几？用乘法倒推。` },
        tex: `\\square \\div ${b} = ${a}`,
        answer: c, answerType: 'steps', widget: 'steps',
        steps: [ { tex: `${b} \\times ${a} = \\square`, blank: c } ],
        solution: [ { tex: `${b} \\times ${a} = \\square`, blank: c } ]
      };
    }
    if (mode === 'divisor') {
      return {
        prompt: { ko: `${c} ÷ □ = ${a}의 □는 얼마일까요? □×${a}=${c}로 생각해요.`,
                  en: `${c} ÷ □ = ${a}. Think □ × ${a} = ${c}.`,
                  zh: `${c}÷□=${a}，□是几？想成□×${a}=${c}。` },
        tex: `${c} \\div \\square = ${a}`,
        answer: b, answerType: 'steps', widget: 'steps',
        steps: [ { tex: `\\square \\times ${a} = ${c}`, blank: b } ],
        solution: [ { tex: `\\square \\times ${a} = ${c}`, blank: b } ]
      };
    }
    /* facts — 곱셈 하나에서 나눗셈 두 개 */
    return {
      prompt: { ko: `${a} × ${b} = ${c}에서 나눗셈 식 두 개를 만들어요.`,
                en: `From ${a} × ${b} = ${c}, write the two division facts.`,
                zh: `由${a}×${b}=${c}写出两个除法算式。` },
      tex: `${a} \\times ${b} = ${c} \;\\Rightarrow\; ${c} \\div ${b} = \\square`,
      answer: a, answerType: 'steps', widget: 'steps',
      steps: [
        { tex: `${c} \\div ${a} = \\square`, blank: b },
        { tex: `${c} \\div ${b} = \\square`, blank: a }
      ],
      solution: [
        { tex: `${c} \\div ${a} = \\square`, blank: b },
        { tex: `${c} \\div ${b} = \\square`, blank: a }
      ]
    };
  };

})();
