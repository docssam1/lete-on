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
  /* 교재 D12(나머지 없는 (세)÷(두)) · D13(나머지 있는 (세)÷(두)) · D14·D15(네 자리)가
     이 자리다(2026-09-20). 고치기 전 두 가지가 어긋나 있었다:
       ① **나머지를 문항에 미리 적어 줬다** — `856 ÷ 17 = □ ⋯ 5` 꼴이라 몫만 물었다.
          나머지를 알면 856−5를 17로 나누면 끝이라 "나머지가 나누는 수보다 작아야 한다"는
          이 단원의 핵심이 사라진다. 이제 DV19와 같이 `= □ ⋯ □`(answer [q, r])로 묻는다.
       ② **나누는 수가 11~19뿐이었다** — 두 자리로 나누는 단원인데 20~99가 한 번도 안 나왔다.
          교재 예시가 21·22·23인 이유는 "앞 두 자리와 견줘 몫을 어림"하는 연습이라, 나누는
          수가 십몇이면 어림할 것이 없다.
     자릿수만 늘어나는 D14·D15는 한 레벨로 합쳤다(C10 네 자리 곱셈을 뺀 것과 같은 기준). */
  NM_TGEN['dv5_div2d'] = function (params, rng) {
    const d    = (params && params.d) || 3;        /* 나누어지는 수의 자릿수 */
    const rem  = params && params.rem;             /* true=나머지 있음 · false=없음 · undefined=섞기 */
    let b, q, r, dv, tries = 0;
    do {
      /* 나누는 수: 두 자리 전체. 몫 어림이 되도록 L1(두 자리÷두 자리)만 11~49로 둔다. */
      b = d === 2 ? R(rng, 11, 49) : R(rng, 11, 99);
      const lo = d === 2 ? 10 : (d === 3 ? 100 : 1000);
      const hi = d === 2 ? 99 : (d === 3 ? 999 : 9999);
      const qMin = Math.max(2, Math.ceil((lo + 1) / b));
      const qMax = Math.floor(hi / b);
      if (qMax < qMin) continue;
      q = R(rng, qMin, qMax);
      const want = (rem === undefined) ? pick(rng, [true, false]) : rem;
      r = want ? R(rng, 1, b - 1) : 0;
      dv = b * q + r;
    } while ((dv > (d === 2 ? 99 : d === 3 ? 999 : 9999) || dv < (d === 2 ? 10 : d === 3 ? 100 : 1000)) && tries++ < 200);
    if (tries >= 200) { b = 21; q = 12; r = 5; dv = 257; }

    const hasR = r > 0;
    /* 몫을 어림하는 자리 — 교재의 "앞에서 두 자리만큼 견줘 몫의 자릿수를 예상한다".
       앞 두 자리가 나누는 수보다 작으면 세 자리를 봐야 한다는 것 자체가 이 단원의 내용이다. */
    const head2 = +String(dv).slice(0, 2);
    const digits = String(q).length;
    const steps = [
      { tex: `${head2} \\div ${b} \\;\\Rightarrow\\; \\text{몫은 } \\square \\text{자리}`, blank: digits },
      { tex: `${b} \\times \\square = ${dv - r}`, blank: q }
    ];
    if (hasR) steps.push({ tex: `${dv} - ${dv - r} = \\square`, blank: r });
    steps.push({ tex: hasR ? `${dv} \\div ${b} = \\square \\cdots \\square` : `${dv} \\div ${b} = \\square`,
                 blank: hasR ? [q, r] : q });

    return {
      prompt: {
        ko: hasR ? `${dv} ÷ ${b}의 몫과 나머지를 구해요` : `${dv} ÷ ${b}을 계산해요`,
        en: hasR ? `Find the quotient and remainder: ${dv} ÷ ${b}` : `Work out ${dv} ÷ ${b}`,
        zh: hasR ? `求${dv}÷${b}的商和余数` : `计算${dv}÷${b}`
      },
      tex:        hasR ? `${dv} \\div ${b} = \\square \\cdots \\square` : `${dv} \\div ${b} = \\square`,
      answer:     hasR ? [q, r] : q,
      answerType: 'steps',
      widget:     'steps',
      divBox:     { a: dv, b, q, r },     /* 인쇄용 세로 나눗셈 상자 — DV19와 같은 계약 */
      steps,
      solution:   steps
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
          { tex: `\\text{홀수째 자리}=${d[0]}+${d[2]}=${odd}\\;,\\;\\text{짝수째 자리}=${d[1]}+${d[3]}=${even}` },
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
        { tex: `${psum} + \\text{끝자리가 } ${r}\\text{의 배수} \\Rightarrow \\{${cands.join(',\\,')}\\}` },
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

    /* ---- 최대공약수 — 유클리드 호제법 스텝 ----
       한국어 화면·인쇄물에 GCD·LCM 약어를 쓰지 않는다(2026-09-19 원장 "최소공배수가 맞지") —
       초·중 교과는 최대공약수·최소공배수로 부른다. 영어 지문(en)만 GCD/LCM 을 쓴다. ----
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
      steps.push({ tex: `\\text{최대공약수}(${a},\\,${b}) = \\square`, blank: g });

      return {
        prompt: {
          ko: `${a}와 ${b}의 최대공약수를 구해요`,
          en: `Find the GCD of ${a} and ${b}`,
          zh: `求${a}和${b}的最大公因数`
        },
        tex:        `\\text{최대공약수}(${a},\\,${b}) = \\square`,
        answer:     g,
        answerType: 'steps',
        widget:     'steps',
        steps,
        solution: steps.slice()
      };
    }

    /* ---- 최소공배수 — 최대공약수 → 공식 ---- */
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
        ko: `${a}와 ${b}의 최소공배수를 구해요`,
        en: `Find the LCM of ${a} and ${b}`,
        zh: `求${a}和${b}的最小公倍数`
      },
      tex:        `\\text{최소공배수}(${a},\\,${b}) = \\square`,
      answer:     l,
      answerType: 'steps',
      widget:     'steps',
      steps: [
        { tex: `\\text{최대공약수}(${a},\\,${b}) = \\square`,                              blank: g },
        { tex: `\\text{최소공배수} = ${a} \\times ${b} \\div ${g} = \\square`,      blank: l }
      ],
      solution: [
        { tex: `\\text{최대공약수}(${a},\\,${b}) = \\square`,                              blank: g },
        { tex: `\\text{최소공배수} = ${a} \\times ${b} \\div ${g} = \\square`,      blank: l }
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
  /* ══ 문장제 소재(2026-09-17, 원장 "문장제 소재를 다양히 하라는 거지") ══
     같은 a÷b라도 사탕·봉지 이야기만 나오면 아이는 숫자만 뽑아 나눈다. 소재가 바뀌어야
     "무엇을 몇 개씩, 무엇이 몇 개"를 문장에서 다시 읽는다. 소재마다 그것을 담는 자리(holder)가
     다르다 — 봉지·접시·상자·필통(담다), 꽃병(꽂다), 줄(놓다), 모둠(나누다), 버스(타다).
       unit   물건 단위(개·장·자루·권·송이·명)
       food   먹는 틀(똑같이 나누어 먹기 · 하루에 b개씩이면 며칠)을 쓸 수 있는가
       person 사람(학생)이라 "친구에게 나눠 주기" 틀은 안 쓰고 모둠·버스 틀만
       holders 담는 자리 목록 — {type, ko, en(복수), enOne, zh}. type은 HOLDER_FRAMES의 키 */
  const DV_ITEMS = [
    { ko:'사탕',   unit:'개',  en:'candies',  zh:'糖',   zhU:'颗', food:true,
      holders:[{ type:'box', ko:'봉지', en:'bags', enOne:'bag', zh:'袋子' }] },
    { ko:'쿠키',   unit:'개',  en:'cookies',  zh:'饼干', zhU:'块', food:true,
      holders:[{ type:'box', ko:'접시', en:'plates', enOne:'plate', zh:'盘子' }] },
    { ko:'사과',   unit:'개',  en:'apples',   zh:'苹果', zhU:'个', food:true,
      holders:[{ type:'box', ko:'바구니', en:'baskets', enOne:'basket', zh:'篮子' }] },
    { ko:'귤',     unit:'개',  en:'tangerines', zh:'橘子', zhU:'个', food:true,
      holders:[{ type:'box', ko:'상자', en:'boxes', enOne:'box', zh:'盒子' }] },
    { ko:'딸기',   unit:'개',  en:'strawberries', zh:'草莓', zhU:'个', food:true,
      holders:[{ type:'box', ko:'접시', en:'plates', enOne:'plate', zh:'盘子' }] },
    { ko:'초콜릿', unit:'개',  en:'chocolates', zh:'巧克力', zhU:'块', food:true,
      holders:[{ type:'box', ko:'상자', en:'boxes', enOne:'box', zh:'盒子' }] },
    { ko:'구슬',   unit:'개',  en:'marbles',  zh:'弹珠', zhU:'颗',
      holders:[{ type:'box', ko:'주머니', en:'pouches', enOne:'pouch', zh:'袋子' }] },
    { ko:'풍선',   unit:'개',  en:'balloons', zh:'气球', zhU:'个',
      holders:[{ type:'box', ko:'봉지', en:'bags', enOne:'bag', zh:'袋子' }] },
    { ko:'색종이', unit:'장',  en:'sheets of paper', zh:'彩纸', zhU:'张',
      holders:[{ type:'box', ko:'상자', en:'boxes', enOne:'box', zh:'盒子' }] },
    { ko:'스티커', unit:'장',  en:'stickers', zh:'贴纸', zhU:'张',
      holders:[{ type:'box', ko:'봉투', en:'envelopes', enOne:'envelope', zh:'信封' }] },
    { ko:'연필',   unit:'자루', en:'pencils', zh:'铅笔', zhU:'支',
      holders:[{ type:'box', ko:'필통', en:'pencil cases', enOne:'pencil case', zh:'文具盒' }] },
    { ko:'공책',   unit:'권',  en:'notebooks', zh:'本子', zhU:'本',
      holders:[{ type:'box', ko:'상자', en:'boxes', enOne:'box', zh:'盒子' }] },
    { ko:'꽃',     unit:'송이', en:'flowers', zh:'花',   zhU:'朵',
      holders:[{ type:'vase', ko:'꽃병', en:'vases', enOne:'vase', zh:'花瓶' }] },
    { ko:'의자',   unit:'개',  en:'chairs',   zh:'椅子', zhU:'把', noGive:true,
      holders:[{ type:'row', ko:'줄', en:'rows', enOne:'row', zh:'排' }] },
    { ko:'학생',   unit:'명',  en:'students', zh:'学生', zhU:'名', person:true,
      holders:[{ type:'team', ko:'모둠', en:'teams', enOne:'team', zh:'小组' },
               { type:'bus',  ko:'버스', en:'buses', enOne:'bus', zh:'公交车' }] }
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
  /* 수를 읽을 때의 받침 — 1·3·6·7·8·0·10 계열은 받침 있음(과), 2·4·5·9 는 없음(와) */
  function dvNumWa(n){ const d = n % 10; return [2,4,5,9].indexOf(d) >= 0 && d !== 0 ? '와' : '과'; }
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
      { tex: `${skip.join(',\\;')} \\Rightarrow \\square`, blank: q },
      { tex: `${b} \\times \\square = ${a}`, blank: q },
      { tex: `${a} \\div ${b} = \\square`,   blank: q }
    ];
  }

  /* ══ 문장 틀 ══ 등분(share)은 "한 명(한 자리)의 몫", 포함(group)은 "몇 명·몇 자리·며칠".
     같은 소재라도 틀이 바뀌고, 같은 틀이라도 소재가 바뀐다 — 아이가 문장을 다시 읽게.
       share 틀 → {word, ask, rowLabel(줄이 뜻하는 것: "3명"·"필통 3개"·"3줄")}
       group 틀 → {word, ask, unit(답 단위: 묶음·명·개·일·줄·모둠·대)}
     사람 틀(give·eat·friends·each·days)은 물건에만, holder 틀은 소재의 담는 자리에 맞춰. */
  const PEOPLE_SHARE = [
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
    { id:'friends', build:(a,b,q,it,who)=>({
        word:{ ko:`${dvJosa(who.ko,'은','는')} ${it.ko} ${a}${dvJosa(it.unit,'을','를')} 친구 ${b}명에게 똑같이 나누어 주었어요.`,
               en:`${who.en} gave ${a} ${it.en} equally to ${b} friends.`,
               zh:`${who.zh}把${a}${it.zhU}${it.zh}平均送给了${b}个朋友。` },
        ask:{ ko:`친구 한 명이 받은 ${dvJosa(it.ko,'은','는')} 몇 ${it.unit}일까요?`,
              en:`How many did each friend get?`,
              zh:`每个朋友得到几${it.zhU}？` },
        rowLabel:{ ko:`친구 ${b}명`, en:`${b} friends`, zh:`${b}个朋友` } }) }
  ];
  const PEOPLE_GROUP = [
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
    { id:'days', food:true, build:(a,b,q,it,who)=>({
        word:{ ko:`${dvJosa(who.ko,'은','는')} ${it.ko} ${a}${dvJosa(it.unit,'을','를')} 하루에 ${b}${it.unit}씩 먹어요.`,
               en:`${who.en} eats ${b} ${it.en} a day and has ${a} ${it.en}.`,
               zh:`${who.zh}有${a}${it.zhU}${it.zh}，每天吃${b}${it.zhU}。` },
        ask:{ ko:`며칠 동안 먹을 수 있을까요?`, en:`How many days will they last?`, zh:`可以吃几天？` },
        unit:{ ko:'일', en:'days', zh:'天' } }) }
  ];
  /* 담는 자리 틀 — type마다 동사가 다르다(담다·꽂다·놓다·나누다·타다). h = holder */
  const HOLDER_FRAMES = {
    box: {
      share:(a,b,q,it,h)=>({
        word:{ ko:`${it.ko} ${a}${dvJosa(it.unit,'이','가')} ${h.ko} ${b}개에 똑같이 들어 있어요.`,
               en:`${a} ${it.en} are packed equally into ${b} ${h.en}.`,
               zh:`${a}${it.zhU}${it.zh}平均装在${b}个${h.zh}里。` },
        ask:{ ko:`${h.ko} 한 개에는 몇 ${it.unit}씩 들어 있을까요?`, en:`How many are in each ${h.enOne}?`, zh:`每个${h.zh}里有几${it.zhU}？` },
        rowLabel:{ ko:`${h.ko} ${b}개`, en:`${b} ${h.en}`, zh:`${b}个${h.zh}` } }),
      group:(a,b,q,it,h)=>({
        word:{ ko:`${it.ko} ${a}${dvJosa(it.unit,'을','를')} ${h.ko} 한 개에 ${b}${it.unit}씩 담으려고 해요.`,
               en:`We pack ${a} ${it.en}, ${b} to a ${h.enOne}.`,
               zh:`把${a}${it.zhU}${it.zh}每${b}${it.zhU}装一个${h.zh}。` },
        ask:{ ko:`${dvJosa(h.ko,'은','는')} 몇 개 필요할까요?`, en:`How many ${h.en} do we need?`, zh:`需要几个${h.zh}？` },
        unit:{ ko:'개', en:h.en, zh:'个' } })
    },
    vase: {
      share:(a,b,q,it,h)=>({
        word:{ ko:`${it.ko} ${a}${dvJosa(it.unit,'을','를')} ${h.ko} ${b}개에 똑같이 나누어 꽂아요.`,
               en:`${a} ${it.en} are put equally into ${b} ${h.en}.`,
               zh:`把${a}${it.zhU}${it.zh}平均插在${b}个${h.zh}里。` },
        ask:{ ko:`${h.ko} 한 개에 몇 ${it.unit}씩 꽂을까요?`, en:`How many go in each ${h.enOne}?`, zh:`每个${h.zh}插几${it.zhU}？` },
        rowLabel:{ ko:`${h.ko} ${b}개`, en:`${b} ${h.en}`, zh:`${b}个${h.zh}` } }),
      group:(a,b,q,it,h)=>({
        word:{ ko:`${it.ko} ${a}${dvJosa(it.unit,'을','를')} ${h.ko} 한 개에 ${b}${it.unit}씩 꽂으려고 해요.`,
               en:`We put ${b} ${it.en} in each ${h.enOne}, using ${a} ${it.en}.`,
               zh:`把${a}${it.zhU}${it.zh}每${b}${it.zhU}插一个${h.zh}。` },
        ask:{ ko:`${dvJosa(h.ko,'은','는')} 몇 개 필요할까요?`, en:`How many ${h.en} do we need?`, zh:`需要几个${h.zh}？` },
        unit:{ ko:'개', en:h.en, zh:'个' } })
    },
    row: {
      share:(a,b,q,it,h)=>({
        word:{ ko:`${it.ko} ${a}${dvJosa(it.unit,'을','를')} ${b}줄로 똑같이 놓으려고 해요.`,
               en:`${a} ${it.en} are set out in ${b} equal rows.`,
               zh:`把${a}${it.zhU}${it.zh}平均摆成${b}排。` },
        ask:{ ko:`한 줄에 몇 ${it.unit}씩 놓을까요?`, en:`How many are in each row?`, zh:`每排摆几${it.zhU}？` },
        rowLabel:{ ko:`${b}줄`, en:`${b} rows`, zh:`${b}排` } }),
      group:(a,b,q,it,h)=>({
        word:{ ko:`${it.ko} ${a}${dvJosa(it.unit,'을','를')} 한 줄에 ${b}${it.unit}씩 놓으려고 해요.`,
               en:`${a} ${it.en} are set out with ${b} in each row.`,
               zh:`把${a}${it.zhU}${it.zh}每排摆${b}${it.zhU}。` },
        ask:{ ko:`몇 줄이 될까요?`, en:`How many rows are there?`, zh:`能摆几排？` },
        unit:{ ko:'줄', en:'rows', zh:'排' } })
    },
    team: {
      share:(a,b,q,it,h)=>({
        word:{ ko:`${it.ko} ${a}명을 ${b}모둠으로 똑같이 나누려고 해요.`,
               en:`${a} ${it.en} are divided equally into ${b} teams.`,
               zh:`把${a}名${it.zh}平均分成${b}个小组。` },
        ask:{ ko:`한 모둠은 몇 명일까요?`, en:`How many are in each team?`, zh:`每个小组有几名？` },
        rowLabel:{ ko:`${b}모둠`, en:`${b} teams`, zh:`${b}个小组` } }),
      group:(a,b,q,it,h)=>({
        word:{ ko:`${it.ko} ${a}명을 ${b}명씩 한 모둠으로 만들려고 해요.`,
               en:`${a} ${it.en} are put into teams of ${b}.`,
               zh:`把${a}名${it.zh}每${b}名分成一个小组。` },
        ask:{ ko:`모둠이 몇 개 될까요?`, en:`How many teams are there?`, zh:`能分成几个小组？` },
        unit:{ ko:'모둠', en:'teams', zh:'个小组' } })
    },
    bus: {
      share:(a,b,q,it,h)=>({
        word:{ ko:`${it.ko} ${a}명이 버스 ${b}대에 똑같이 나누어 타요.`,
               en:`${a} ${it.en} ride in ${b} buses, the same number in each.`,
               zh:`${a}名${it.zh}平均坐${b}辆公交车。` },
        ask:{ ko:`버스 한 대에 몇 명씩 탈까요?`, en:`How many ride in each bus?`, zh:`每辆车坐几名？` },
        rowLabel:{ ko:`버스 ${b}대`, en:`${b} buses`, zh:`${b}辆车` } }),
      group:(a,b,q,it,h)=>({
        word:{ ko:`${it.ko} ${a}명이 버스 한 대에 ${b}명씩 타려고 해요.`,
               en:`${a} ${it.en} ride buses, ${b} to a bus.`,
               zh:`${a}名${it.zh}每${b}名坐一辆公交车。` },
        ask:{ ko:`버스는 몇 대 필요할까요?`, en:`How many buses are needed?`, zh:`需要几辆车？` },
        unit:{ ko:'대', en:'buses', zh:'辆' } })
    }
  };
  /* 틀 고르기 — 사람 틀(물건만, 먹는 틀은 food만)과 담는 자리 틀을 한 통에 넣고 하나를 뽑는다.
     학생(person)은 담는 자리 틀만, 의자(noGive)는 나눠 주기·묶기 틀을 뺀다(의자를 묶지는 않는다). */
  function dvBuild(rng, kind, a, b, q, it, who){
    const cands = [];
    const people = kind === 'share' ? PEOPLE_SHARE : PEOPLE_GROUP;
    if(!it.person) people.forEach(f => { if((!f.food || it.food) && !(it.noGive && (f.id==='give'||f.id==='friends'||f.id==='each'||f.id==='bundle'))) cands.push(() => f.build(a, b, q, it, who)); });
    (it.holders || []).forEach(h => { const fr = HOLDER_FRAMES[h.type]; if(fr) cands.push(() => fr[kind](a, b, q, it, h)); });
    return pick(rng, cands)();
  }
  function dvPrompt(word, ask){
    return { ko: word.ko + ' ' + ask.ko, en: word.en + ' ' + ask.en, zh: word.zh + ask.zh };
  }

  /* ── DV12 — 똑같이 나누기(등분) ──────────────────────────── */
  function dvShareProblem(rng, b, q, item, who){
    const a = b * q;
    const f = dvBuild(rng, 'share', a, b, q, item, who);
    return {
      prompt: dvPrompt(f.word, f.ask),
      word: f.word, wordAsk: f.ask,
      wordUnit: { ko: item.unit, en: item.en, zh: item.zhU },
      tex: `${a} \\div ${b} = \\square`,
      answer: q, answerType: 'number',
      widget: 'array', array: { n: a, rows: b },   /* b명(b개 자리) = b줄 → 한 줄이 한 몫 */
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
    const f = dvBuild(rng, 'group', a, b, q, item, who);
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

  /* ── DV17 — 곱셈식에서 나눗셈의 몫 찾기(2026-09-19, 원장이 준 교과서 지면) ──
     `2 × □ = 10 ⇔ 10 ÷ 2 = □`(곱하는 수 찾기) · `□ × 5 = 15 ⇔ 15 ÷ 5 = □`(곱해지는 수 찾기).
     같은 답을 두 식으로 보여 주는 것이 문항의 전부라, 두 식을 나란히 쓰고 빈칸은 하나로 잇는다. */
  NM_TGEN['dv17_quotFromMul'] = function (params, rng) {
    const mode = (params && params.mode) || 'times';      /* times = 곱하는 수, timesed = 곱해지는 수 */
    const hi   = !!(params && params.hi);
    const a = R(rng, 2, hi ? 9 : 5), q = R(rng, 2, 9), c = a * q;
    const mulTex = mode === 'times' ? `${a} \\times \\square = ${c}` : `\\square \\times ${a} = ${c}`;
    const divTex = `${c} \\div ${a} = \\square`;
    const what = mode === 'times'
      ? { ko: '곱하는 수', en: 'the number being multiplied by', zh: '乘数' }
      : { ko: '곱해지는 수', en: 'the number being multiplied', zh: '被乘数' };
    return {
      prompt: {
        ko: `곱셈식에서 ${what.ko}를 찾아 나눗셈의 몫을 구해요. ${mode === 'times' ? `${a} × □ = ${c}` : `□ × ${a} = ${c}`}`,
        en: `Find ${what.en} in the multiplication, and you have the quotient. ${mode === 'times' ? `${a} × □ = ${c}` : `□ × ${a} = ${c}`}`,
        zh: `在乘法算式里找${what.zh}，就是除法的商。${mode === 'times' ? `${a}×□=${c}` : `□×${a}=${c}`}`
      },
      tex: `${mulTex} \\;\\Leftrightarrow\\; ${divTex}`,
      answer: q, answerType: 'number', widget: 'numpad',
      sameBlank: true,              /* 두 식의 빈칸이 같은 수 — 예시에서 둘 다 채운다 */
      solution: [
        { tex: mulTex, blank: q },
        { tex: divTex, blank: q }
      ]
    };
  };

  /* ── DV18 — 나머지가 있는 나눗셈, 나머지 크기별(교과서 "나머지가 1인/3인/2인 나눗셈") ──
     묶음 그림(배열)으로 "11개를 2개씩 묶으면 5묶음 1개가 남아요"를 눈으로 보게 하고,
     답은 몫과 나머지 두 칸. r 값을 고정해 한 회차가 한 가지 나머지만 다루게 한다. */
  NM_TGEN['dv18_remFixed'] = function (params, rng) {
    const want = (params && params.r) || 0;               /* 0 = 아무 나머지 */
    const twoDigitQ = !!(params && params.q2);            /* 몫이 두 자리 */
    let b, q, r;
    if (want) {
      b = R(rng, want + 1, 9);                            /* 나머지는 나누는 수보다 작아야 한다 */
      r = want;
    } else {
      b = R(rng, 2, 9);
      r = R(rng, 1, b - 1);
    }
    q = twoDigitQ ? R(rng, 10, 19) : R(rng, 2, 9);
    if (!twoDigitQ && b * q + r > 60) q = Math.max(2, Math.floor((60 - r) / b));   /* 그림으로 보여 줄 만한 크기로 */
    const a = b * q + r;
    const item = pick(rng, DV_ITEMS.filter(function(it){ return !it.person; }));   /* 사람을 "묶지"는 않는다 */
    const word = {
      ko: `${item.ko} ${a}${dvJosa(item.unit,'을','를')} ${b}${item.unit}씩 묶어요.`,
      en: `We bundle ${a} ${item.en} into groups of ${b}.`,
      zh: `把${a}${item.zhU}${item.zh}每${b}${item.zhU}分成一组。`
    };
    const ask = {
      ko: `몇 묶음이 되고 몇 ${dvJosa(item.unit,'이','가')} 남을까요?`,
      en: `How many groups, and how many are left over?`,
      zh: `能分成几组？还剩几${item.zhU}？`
    };
    return {
      prompt: { ko: word.ko + ' ' + ask.ko, en: word.en + ' ' + ask.en, zh: word.zh + ask.zh },
      word, wordAsk: ask,
      tex: `${a} \\div ${b} = \\square \\cdots \\square`,
      answer: [q, r], answerType: 'number',
      /* 배열 위젯은 60칸까지 — 그보다 크면(몫이 두 자리) 숫자판으로 */
      widget: a <= 60 ? 'array' : 'numpad',
      array: a <= 60 ? { n: a, rows: q } : undefined,
      answerNote: { ko: `몫 ${q}, 나머지 ${r}`, en: `quotient ${q}, remainder ${r}`, zh: `商${q}，余${r}` },
      solution: [
        { tex: `${b} \\times \\square = ${b * q}`, blank: q },
        { tex: `${a} - ${b * q} = \\square`, blank: r },
        { tex: `${a} \\div ${b} = \\square \\cdots \\square`, blank: [q, r] }
      ]
    };
  };

  /* ── DV19 — 세로 나눗셈(2026-09-19, 교과서 "몫이 한/두 자리, 나머지가 2인 (두 자리)÷(한 자리)") ──
     3)17 처럼 나눗셈 상자를 그리고, 몫을 자리에 맞춰 쓰게 한다. 렌더는 exam.js divBoxHtml. */
  NM_TGEN['dv19_longDiv'] = function (params, rng) {
    const rem   = !!(params && params.rem);
    const q2    = !!(params && params.q2);      /* 몫이 두 자리 */
    const d3    = !!(params && params.d3);      /* 세 자리 ÷ 한 자리 */
    /* 레벨이 겹치지 않게 — L3·L4(몫 두 자리)는 나누어지는 수가 두 자리,
       세 자리는 L5 전용이다(2026-09-19). 나누는 수가 크면 두 자리 몫의 폭이
       좁아지므로(9면 10~11뿐) q2 레벨은 2~7에서 고른다. */
    const b = d3 ? R(rng, 2, 9) : (q2 ? R(rng, 2, 7) : R(rng, 2, 9));
    const r = rem ? R(rng, 1, b - 1) : 0;
    const q = d3 ? R(rng, 100, 999 / b | 0)
                 : (q2 ? R(rng, 10, ((99 - r) / b) | 0) : R(rng, 2, 9));
    const a = b * q + r;
    /* 자리별 계산 — 나누어지는 수의 자리를 왼쪽부터 내려 가며(몫의 자리가 서는 곳만 단계로 남긴다) */
    const as = String(a);
    const steps = [];
    let cur = 0;
    for (let i = 0; i < as.length; i++) {
      cur = cur * 10 + +as[i];
      if (cur < b && steps.length === 0) continue;     /* 아직 몫이 서지 않는 자리는 건너뛴다 */
      const qi = Math.floor(cur / b);
      steps.push({ tex: `${cur} \\div ${b} = \\square`, blank: qi });
      cur -= qi * b;
    }
    /* 몫이 한 자리면 자리별 단계가 하나뿐이라 마지막 줄과 똑같아진다(2026-09-19) —
       그 자리는 "몇 배 하면 되는가"를 묻는 곱셈 줄로 바꿔 준다. */
    if (steps.length <= 1) {
      steps.length = 0;
      steps.push({ tex: `${b} \\times \\square = ${a - r}`, blank: q });
    }
    steps.push({ tex: rem ? `${a} \\div ${b} = \\square \\cdots \\square` : `${a} \\div ${b} = \\square`,
                 blank: rem ? [q, r] : q });
    return {
      prompt: {
        ko: `${a} ÷ ${b}을 세로셈으로 계산해요. 몫은 자리에 맞춰 쓰고${rem ? ', 나머지도 써요' : ''}.`,
        en: `Work out ${a} ÷ ${b} in the long-division box. Line the quotient up by place${rem ? ', and write the remainder' : ''}.`,
        zh: `用竖式计算${a}÷${b}。商要对齐数位${rem ? '，并写出余数' : ''}。`
      },
      tex: rem ? `${a} \\div ${b} = \\square \\cdots \\square` : `${a} \\div ${b} = \\square`,
      answer: rem ? [q, r] : q,
      answerType: 'steps', widget: 'steps', steps,
      divBox: { a, b, q, r },        /* 인쇄용 세로 나눗셈 상자 */
      solution: steps
    };
  };

  /* ── DV20 — 약수와 배수(2026-09-19, 원장 "약수, 배수 이런 것들도 세분화") ──
     한 덩어리였던 DV7(약수 개수·최대공약수·최소공배수)을 아이가 밟는 순서대로 쪼갠다:
     약수 모두 쓰기 → 배수 차례로 쓰기 → 공약수 → 최대공약수 → 공배수 → 최소공배수.
     답이 여러 개인 레벨은 쉼표로 받는다(answer 배열). */
  function dvFactorsOf(n){ const f=[]; for(let i=1;i<=n;i++) if(n%i===0) f.push(i); return f; }
  function dvGcd(x,y){ while(y){ const t=x%y; x=y; y=t; } return x; }
  NM_TGEN['dv20_factorMultiple'] = function (params, rng) {
    const mode = (params && params.mode) || 'factors';
    if (mode === 'factors') {                       /* 한 수의 약수 모두 */
      /* 약수가 일곱 개 이상인 수(24·30·36·40·48…)는 인쇄 칸에서 줄을 넘어간다 —
         여섯 개 이하만 쓰고, 대신 수를 넉넉히 둬 스무 문항이 겹치지 않게 한다. */
      const n = pick(rng, [10,12,14,15,16,18,20,21,22,25,26,27,28,32,33,34,35,38,39,
                           44,45,46,49,50,51,52,55,57,58,62,63,65,68,69,75,76,77,82,
                           85,86,87,91,92,93,94,95,98,99]);
      const f = dvFactorsOf(n);
      return {
        prompt: { ko: `${n}의 약수를 모두 쓰세요.`, en: `Write every factor of ${n}.`, zh: `写出${n}的所有因数。` },
        tex: `${n}\\text{의 약수} = ${f.map(function(){ return '\\square'; }).join(',\\,')}`,
        answer: f, answerType: 'number', widget: 'numpad',
        solution: [{ tex: `1 \\times ${n} = ${n}${f.length>2?',\\;'+f[1]+' \\times '+(n/f[1])+' = '+n:''}` },
                   { tex: `${n}\\text{의 약수}: ${f.join(',\\,')}` }]
      };
    }
    if (mode === 'multiples') {                      /* 배수를 차례로 */
      /* 2~15의 배수를 4~6개 — 스무 문항이 서로 겹치지 않을 만큼 경우의 수를 둔다 */
      const n = R(rng, 2, 15), k = R(rng, 4, 6);
      const ms = []; for (let i=1;i<=k;i++) ms.push(n*i);
      return {
        prompt: { ko: `${n}의 배수를 작은 것부터 ${k}개 쓰세요.`, en: `Write the first ${k} multiples of ${n}.`, zh: `从小到大写出${n}的前${k}个倍数。` },
        tex: `${n}\\text{의 배수} = ${ms.map(function(){ return '\\square'; }).join(',\\,')}`,
        answer: ms, answerType: 'number', widget: 'numpad',
        solution: [{ tex: `${n} \\times 1,\\, ${n} \\times 2,\\, \\ldots` },
                   { tex: `${ms.join(',\\,')}` }]
      };
    }
    /* 공약수·최대공약수·공배수·최소공배수 */
    /* 서로소(공약수가 1뿐)·너무 큰 최소공배수는 다시 뽑는다 — 보여 줄 것이 없거나 아이에게 버겁다 */
    let a, b, g, l, tries = 0;
    do {
      a = R(rng, 4, 24); b = R(rng, 4, 24);
      g = dvGcd(a, b); l = a * b / g;
    } while (tries++ < 40 && (a === b || (/^(common|gcd)$/.test(mode) && g < 2) || (/Mul|lcm/.test(mode) && l > 60)));
    if (mode === 'common') {                         /* 공약수 모두 */
      const cf = dvFactorsOf(g);
      return {
        prompt: { ko: `${a}${dvNumWa(a)} ${b}의 공약수를 모두 쓰세요.`, en: `Write every common factor of ${a} and ${b}.`, zh: `写出${a}和${b}的所有公因数。` },
        tex: `${a},\\, ${b}\\text{의 공약수} = ${cf.map(function(){ return '\\square'; }).join(',\\,')}`,
        answer: cf, answerType: 'number', widget: 'numpad',
        solution: [{ tex: `${a}: ${dvFactorsOf(a).join(',\\,')}` },
                   { tex: `${b}: ${dvFactorsOf(b).join(',\\,')}` },
                   { tex: `\\text{공약수}: ${cf.join(',\\,')}` }]
      };
    }
    if (mode === 'gcd') {
      return {
        prompt: { ko: `${a}${dvNumWa(a)} ${b}의 최대공약수는?`, en: `What is the greatest common factor of ${a} and ${b}?`, zh: `${a}和${b}的最大公因数是多少？` },
        tex: `\\text{최대공약수}(${a},\\, ${b}) = \\square`,
        answer: g, answerType: 'number', widget: 'numpad',
        solution: [{ tex: `${a}: ${dvFactorsOf(a).join(',\\,')}` },
                   { tex: `${b}: ${dvFactorsOf(b).join(',\\,')}` },
                   { tex: `\\text{가장 큰 공약수} = \\square`, blank: g }]
      };
    }
    if (mode === 'commonMul') {                      /* 공배수 3개 */
      const cm = [l, l*2, l*3];
      return {
        prompt: { ko: `${a}${dvNumWa(a)} ${b}의 공배수를 작은 것부터 3개 쓰세요.`, en: `Write the first three common multiples of ${a} and ${b}.`, zh: `从小到大写出${a}和${b}的前三个公倍数。` },
        tex: `${a},\\, ${b}\\text{의 공배수} = ${cm.map(function(){ return '\\square'; }).join(',\\,')}`,
        answer: cm, answerType: 'number', widget: 'numpad',
        solution: [{ tex: `\\text{최소공배수} = ${l}` }, { tex: `${cm.join(',\\,')}` }]
      };
    }
    return {                                          /* lcm */
      prompt: { ko: `${a}${dvNumWa(a)} ${b}의 최소공배수는?`, en: `What is the least common multiple of ${a} and ${b}?`, zh: `${a}和${b}的最小公倍数是多少？` },
      tex: `\\text{최소공배수}(${a},\\, ${b}) = \\square`,
      answer: l, answerType: 'number', widget: 'numpad',
      solution: [{ tex: `\\text{최대공약수}(${a},${b}) = ${g}` },
                 { tex: `${a} \\times ${b} \\div ${g} = \\square`, blank: l }]
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
