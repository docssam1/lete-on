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

})();
