/* ============================================================
   Numbers of Magic — ADV(고급 CHALLENGE) 신규 13종 스레드 생성기
   근거: 고급-목차.md "신규 13건" + CURRICULUM-SOURCES.md §8(고급 A 정독).
   계약: NM_TGEN[genKey] = function(params, rng) { return problem; }
   절대 Math.random() 사용 금지 — R(rng,a,b) / pick(rng,arr) / shuffle(rng,arr) 만 사용.
   steps의 blank는 항상 정수(rng.js 계약) — 각 함수는 이를 지키도록 설계됨.
   ============================================================ */
(function(){
'use strict';

const { R, pick, shuffle } = NM_RNG;

/* ── CH1 — 한쪽으로 모으기 (고급 A-1) ────────────────────────
   곱하는 수를 계속 나누고(그 인수만큼) 곱해지는 수를 그만큼 키운다.
   48×12 → 48×6×2 → (48×6)×2 → 288×2 = 576. 원본은 여러 단계로 쪼갠다
   (정독 주의점) — 그래서 b를 완전히 1이 될 때까지 인수분해해 매 단계를
   스텝으로 남긴다. 수치 범위(정독): 2d×2d(48×12)~3d×2d(226×14, 149×14),
   곱하는 수는 12~24의 합성수 위주. */
NM_TGEN['adv_gather'] = function (params, rng) {
  const lv = params.level || 'main';
  const B_LIST = [12, 14, 15, 16, 18, 20, 21, 22, 24];
  const a0 = lv === 'practice' ? R(rng, 20, 49) : R(rng, 100, 299);
  const b0 = pick(rng, B_LIST);

  /* b0을 2~7 범위의 인수로 그리디하게(큰 것부터) 완전히 쪼갠다 — 항상 1로 끝난다 */
  const factors = [];
  let b = b0;
  while (b > 1) {
    let d = null;
    for (let f = 7; f >= 2; f--) { if (b % f === 0) { d = f; break; } }
    if (!d) d = b; /* 안전망 — 2~7 범위 밖 소인수(원본 목록엔 없음) */
    factors.push(d);
    b = b / d;
  }

  const steps = [];
  let aCur = a0;
  factors.forEach(f => {
    const next = aCur * f;
    steps.push({ tex: `${aCur} \\times ${f} = \\square`, blank: next });
    aCur = next;
  });
  const answer = aCur;

  return {
    prompt: {
      ko: `${a0} × ${b0}를 한쪽으로 모으기(곱하는 수를 쪼개 곱해지는 수를 키우기)로 계산해요`,
      en: `Calculate ${a0} × ${b0} by shrinking the multiplier and growing the multiplicand`,
      zh: `用"移到一边"（缩小乘数、放大被乘数）计算 ${a0} × ${b0}`
    },
    tex: `${a0} \\times ${b0} = \\square`,
    answer, answerType: 'steps', widget: 'steps',
    steps
  };
};

/* ── CH2 — 100(1000) 보수 곱 ──────────────────────────────────
   under: (base−p)(base−q) = base(base−p−q) + pq  (100 미만끼리는 더한다)
   mixed: (base+p)(base−q) = base(base+p−q) − pq  (한쪽이 base를 넘으면 뺀다)
   수치 범위(정독): base100 두 자리(90번대)가 메인, base1000으로 확장하면
   919×946·973×964류의 세 자리(900번대) 곱이 나온다. */
NM_TGEN['adv_comp100'] = function (params, rng) {
  const mode = params.mode || 'under';
  const base = params.base || 100;
  const pMax = base === 100 ? 9 : 99;

  if (mode === 'under') {
    const p = R(rng, 1, pMax), q = R(rng, 1, pMax);
    const a = base - p, b = base - q;
    const front = base - (p + q);
    const back = p * q;
    const answer = front * base + back;
    return {
      prompt: {
        ko: `${a} × ${b}를 ${base} 보수 곱셈으로 계산해요 (둘 다 ${base}보다 작아요)`,
        en: `Calculate ${a} × ${b} using ${base}-complement multiplication (both are less than ${base})`,
        zh: `用${base}补数乘法计算 ${a} × ${b}（两数都小于${base}）`
      },
      tex: `${a} \\times ${b} = \\square`,
      answer, answerType: 'steps', widget: 'steps',
      steps: [
        { tex: `${base} - (${p} + ${q}) = \\square`, blank: front },
        { tex: `${p} \\times ${q} = \\square`, blank: back },
        { tex: `${front} \\times ${base} + ${back} = \\square`, blank: answer }
      ]
    };
  }

  /* mixed: a>base, b<base */
  const p = R(rng, 1, pMax), q = R(rng, 1, pMax);
  const a = base + p, b = base - q;
  const front = base + p - q;
  const back = p * q;
  const answer = front * base - back;
  return {
    prompt: {
      ko: `${a} × ${b}를 ${base} 보수 곱셈으로 계산해요 (${a}는 ${base}보다 크고 ${b}는 작아요)`,
      en: `Calculate ${a} × ${b} using ${base}-complement multiplication (${a} is over ${base}, ${b} is under)`,
      zh: `用${base}补数乘法计算 ${a} × ${b}（${a}比${base}大，${b}比${base}小）`
    },
    tex: `${a} \\times ${b} = \\square`,
    answer, answerType: 'steps', widget: 'steps',
    steps: [
      { tex: `${base} + ${p} - ${q} = \\square`, blank: front },
      { tex: `${p} \\times ${q} = \\square`, blank: back },
      { tex: `${front} \\times ${base} - ${back} = \\square`, blank: answer }
    ]
  };
};

/* ── CH3 — 진법 · 진법 곱셈법 ──────────────────────────────────
   convert: 십진수↔b진수 상호 변환(b=2,3,5는 왕복, 16은 큰 수 읽기만 — 자릿수에
   문자가 섞이는 답은 숫자 답칸으로 못 받으므로 fromBase만).
   binaryMul: 곱하는 수를 1,2,4,8,16,32의 합으로 분해해 미리 구한 배수를
   더한다(이진법 원리 곱셈). 수치 범위(정독): 변환은 1~23, 이진곱셈은
   곱해지는 수 12~32·곱하는 수 3~61. */
NM_TGEN['adv_baseSystem'] = function (params, rng) {
  const op = params.op || 'convert';

  if (op === 'binaryMul') {
    const lv = params.level || 'main';
    const N = R(rng, 12, 32);
    const M = lv === 'practice' ? R(rng, 3, 20) : R(rng, 21, 61);
    const bits = [];
    let m = M, p = 1;
    while (m > 0) { if (m & 1) bits.push(p); m = m >> 1; p *= 2; }
    const steps = bits.map(pw => ({ tex: `${N} \\times ${pw} = \\square`, blank: N * pw }));
    const parts = bits.map(pw => N * pw);
    const answer = N * M;
    steps.push({
      tex: `${parts.join(' + ')} = \\square`,
      blank: answer
    });
    return {
      prompt: {
        ko: `${N} × ${M}를 ${M} = ${bits.join('+')}로 쪼개 이진법 곱셈으로 계산해요`,
        en: `Calculate ${N} × ${M} by splitting ${M} = ${bits.join('+')} (binary-decomposition multiplication)`,
        zh: `把${M}拆成${bits.join('+')}，用二进制分解法计算 ${N} × ${M}`
      },
      tex: `${N} \\times ${M} = \\square`,
      answer, answerType: 'steps', widget: 'steps',
      steps
    };
  }

  /* convert */
  const base = params.base || 5;
  const dir = params.dir || 'fromBase';

  if (base === 16) {
    /* hex → decimal (문자가 섞인 답은 못 받으므로 이 방향만) */
    const digitsN = params.big ? R(rng, 2, 3) : 2;
    let hex = '';
    let value = 0;
    for (let i = 0; i < digitsN; i++) {
      const d = i === 0 ? R(rng, 1, 15) : R(rng, 0, 15);
      hex += d.toString(16).toUpperCase();
      value = value * 16 + d;
    }
    return {
      prompt: {
        ko: `16진수 ${hex}를 십진수로 바꿔요`,
        en: `Convert the hexadecimal number ${hex} to decimal`,
        zh: `把16进制数${hex}换算成十进制`
      },
      tex: `(${hex})_{16} = \\square`,
      answer: value, answerType: 'number', widget: 'numpad'
    };
  }

  /* base 2/3/5 — 왕복 가능(자릿수가 전부 한 자리 숫자라 답을 그대로 붙여 써도 안전).
     정독 범위(1~23)는 원문 표의 최소 폭이라 그대로 쓰면 문제 가짓수가 23개뿐이라
     한 장(20문항) 안에서 중복률이 30%를 넘었다(연산문제-감사.md와 같은 원인) —
     교재보다 넓혀서(진법별로 결과 자릿수가 과하게 길어지지 않는 선까지) 재사용한다. */
  const maxN = base === 2 ? 63 : base === 3 ? 80 : 124;
  const n = R(rng, 1, maxN);
  const digits = [];
  let nn = n;
  if (nn === 0) digits.push(0);
  while (nn > 0) { digits.unshift(nn % base); nn = Math.floor(nn / base); }
  const baseStr = digits.join('');

  if (dir === 'toBase') {
    return {
      prompt: {
        ko: `십진수 ${n}을 ${base}진법으로 바꿔요`,
        en: `Convert the decimal number ${n} to base ${base}`,
        zh: `把十进制数${n}换算成${base}进制`
      },
      tex: `(${n})_{10} = (\\square)_{${base}}`,
      answer: Number(baseStr), answerType: 'number', widget: 'numpad'
    };
  }

  /* fromBase */
  return {
    prompt: {
      ko: `${base}진법으로 쓰인 ${baseStr}을 십진수로 바꿔요`,
      en: `Convert ${baseStr} written in base ${base} to decimal`,
      zh: `把${base}进制的${baseStr}换算成十进制`
    },
    tex: `(${baseStr})_{${base}} = \\square`,
    answer: n, answerType: 'number', widget: 'numpad'
  };
};

/* ── CH4 — 1001 자릿수 이동법칙 ────────────────────────────────
   mul: N × (10^n+1) = N을 이어붙인 것(간격 없음), N × (10^(n+1)+1) = 한 칸
   간격, N × (10^{2n}+10^n+1) = 세 번 반복(1001001형).
   div: 역방향 — 반복된 수를 다시 나눠 원래 수 N을 찾는다.
   수치 범위(정독): 3자리(123×1001)~4자리 곱해지는 수, 나눗셈도 절반 비중. */
NM_TGEN['adv_1001'] = function (params, rng) {
  const mode = params.mode || 'mul';
  const lv = params.level || 'main';
  const n = lv === 'practice' ? 3 : pick(rng, [3, 4]);
  const N = R(rng, Math.pow(10, n - 1), Math.pow(10, n) - 1);
  const patType = n === 3 ? pick(rng, ['none', 'gap1', 'triple']) : pick(rng, ['none', 'gap1']);

  let mult, steps, patDesc;
  if (patType === 'none') {
    const shift = Math.pow(10, n);
    mult = shift + 1;
    const part = N * shift;
    const answer = part + N;
    steps = [
      { tex: `${N} \\times ${shift} = \\square`, blank: part },
      { tex: `${part} + ${N} = \\square`, blank: answer }
    ];
    patDesc = { ko: `${N}이 사이 간격 없이 두 번 반복돼요`, en: `${N} repeats twice with no gap`, zh: `${N}会连续重复两次` };
  } else if (patType === 'gap1') {
    const shift = Math.pow(10, n + 1);
    mult = shift + 1;
    const part = N * shift;
    const answer = part + N;
    steps = [
      { tex: `${N} \\times ${shift} = \\square`, blank: part },
      { tex: `${part} + ${N} = \\square`, blank: answer }
    ];
    patDesc = { ko: `${N} 사이에 0이 한 칸 끼고 두 번 반복돼요`, en: `${N} repeats twice with one zero gap`, zh: `${N}中间隔一个0再重复一次` };
  } else {
    const shift1 = Math.pow(10, n), shift2 = Math.pow(10, 2 * n);
    mult = shift2 + shift1 + 1;
    const part2 = N * shift2, part1 = N * shift1;
    const mid = part2 + part1;
    const answer = mid + N;
    steps = [
      { tex: `${N} \\times ${shift2} = \\square`, blank: part2 },
      { tex: `${part2} + ${part1 === part2 ? '' : ''}${N} \\times ${shift1} = \\square`, blank: mid },
      { tex: `${mid} + ${N} = \\square`, blank: answer }
    ];
    patDesc = { ko: `${N}이 세 번 그대로 반복돼요`, en: `${N} repeats three times`, zh: `${N}会连续重复三次` };
  }
  const answer = steps[steps.length - 1].blank;
  const dividend = N * mult;

  if (mode === 'div') {
    return {
      prompt: {
        ko: `${dividend} ÷ ${mult}: 반복되는 자리를 알아채고 원래 수를 찾아요`,
        en: `${dividend} ÷ ${mult} — spot the repeating pattern to find the original number`,
        zh: `${dividend} ÷ ${mult}：找出重复的规律，求出原来的数`
      },
      tex: `${dividend} \\div ${mult} = \\square`,
      answer: N, answerType: 'steps', widget: 'steps',
      steps: [{ tex: `${dividend} \\div ${mult} = \\square`, blank: N }]
    };
  }

  return {
    prompt: {
      ko: `${N} × ${mult}: ${patDesc.ko}`,
      en: `${N} × ${mult}: ${patDesc.en}`,
      zh: `${N} × ${mult}：${patDesc.zh}`
    },
    tex: `${N} \\times ${mult} = \\square`,
    answer, answerType: 'steps', widget: 'steps',
    steps
  };
};

/* ── CH5 — 순환소수 나눗셈 (D-2, 중2 선행) ────────────────────
   cycle: 9·99·999로 나누면 몫의 반복마디가 나눈 수 그대로(자릿수만큼) —
   원문 핵심 규칙을 직접 확인.
   digitAt: 일반 분모(3·7·9·11·12·13·55·90·99…)로 긴나눗셈을 시뮬레이션해
   소수점 k번째 자리 숫자를 구한다 — 선행부(비반복)가 있는 분모도 다룬다.
   toFraction: 0.(반복마디) → 분수. 수치 범위(정독): 1÷9~10÷99, 1÷55류. */
NM_TGEN['adv_repeatDec'] = function (params, rng) {
  const mode = params.mode || 'cycle';

  if (mode === 'cycle') {
    const d = pick(rng, [9, 99, 999]);
    const nDigits = d === 9 ? 1 : d === 99 ? 2 : 3;
    const nMin = Math.pow(10, nDigits - 1);
    const n = nMin === 1 ? R(rng, 1, d - 1) : R(rng, nMin, d - 1);
    return {
      prompt: {
        ko: `${n} ÷ ${d}: 몫의 반복마디는 몇일까요? (나눈 수 ${d}가 힌트예요)`,
        en: `${n} ÷ ${d} — what is the repeating block of the quotient? (${d} is the hint)`,
        zh: `${n} ÷ ${d}：商的循环节是几？（${d}就是提示）`
      },
      tex: `${n} \\div ${d} = 0.\\overline{\\square}`,
      answer: n, answerType: 'number', widget: 'numpad'
    };
  }

  if (mode === 'digitAt') {
    const lv = params.level || 'main';
    const D_LIST = lv === 'practice' ? [3, 9, 11, 99] : [3, 9, 11, 99, 90, 55, 999];
    const d = pick(rng, D_LIST);
    const n = R(rng, 1, d - 1);
    const k = R(rng, 1, lv === 'practice' ? 4 : 9);
    let rem = n, digit = 0;
    for (let i = 0; i < k; i++) { rem *= 10; digit = Math.floor(rem / d); rem %= d; }
    return {
      prompt: {
        ko: `${n} ÷ ${d}의 소수 ${k}번째 자리 숫자는?`,
        en: `What is the ${k}${k === 1 ? 'st' : k === 2 ? 'nd' : k === 3 ? 'rd' : 'th'} digit after the decimal point of ${n} ÷ ${d}?`,
        zh: `${n} ÷ ${d}的小数点后第${k}位是几？`
      },
      tex: `${n} \\div ${d} = \\square \\;(\\text{소수 ${k}번째 자리})`,
      answer: digit, answerType: 'number', widget: 'numpad'
    };
  }

  /* toFraction */
  const k = R(rng, 1, 3);
  const d = Math.pow(10, k) - 1;
  const block = R(rng, 1, d - 1);
  const blockStr = String(block).padStart(k, '0');
  return {
    prompt: {
      ko: `0.${blockStr}${blockStr}…(반복마디 "${blockStr}")를 기약분수 이전의 분수로 나타내요`,
      en: `Write 0.${blockStr}${blockStr}… (repeating block "${blockStr}") as a fraction`,
      zh: `把0.${blockStr}${blockStr}…（循环节"${blockStr}"）写成分数`
    },
    tex: `0.\\overline{${blockStr}} = \\square`,
    answer: [block, d], answerShape: 'fraction',
    answerType: 'number', widget: 'numpad'
  };
};

/* ── CH6 — 100(10·1000)에 가까운 수의 나눗셈 ──────────────────
   n = d×q + r 를 "100(anchor)으로 나눈 것처럼 어림 → 모자란 만큼(anchor−d)을
   몫에 곱해 나머지에 계속 더하기"로 구한다. 수식으로는 매 라운드
   rem_new = rem − d×q1 이 되므로(증명: rem−anchor·q1+(anchor−d)·q1 = rem−d·q1)
   몇 라운드를 반복하든 항상 정확하다. 수치 범위(정독): anchor100·나누는
   수 96~99(4자리÷2자리)가 메인, 10·1000 근처로 확장. */
NM_TGEN['adv_divNear'] = function (params, rng) {
  const anchor = params.anchor || 100;
  const lv = params.level || 'main';

  let d, Q, Rrem;
  if (anchor === 10) {
    d = R(rng, 7, 9);
    Q = R(rng, 20, 90);
  } else if (anchor === 1000) {
    d = R(rng, 996, 999);
    Q = R(rng, 20, 90);
  } else {
    d = R(rng, 96, 99);
    Q = lv === 'practice' ? R(rng, 40, 99) : R(rng, 100, 400);
  }
  Rrem = R(rng, 0, d - 1);
  const n = d * Q + Rrem;
  const k = anchor - d;

  let q = 0, rem = n;
  const rounds = [];
  while (rem >= anchor) {
    const q1 = Math.floor(rem / anchor);
    if (q1 <= 0) break;
    const bump = k * q1;
    const before = rem;
    q += q1;
    rem = rem - anchor * q1 + bump;
    rounds.push({ before, q1, bump, after: rem });
  }
  const extra = Math.floor(rem / d);
  q += extra; rem -= extra * d;

  const steps = [];
  rounds.forEach(r => {
    steps.push({ tex: `${r.before} \\div ${anchor} = \\square \\;(\\text{어림 몫})`, blank: r.q1 });
    steps.push({ tex: `(${anchor}-${d}) \\times ${r.q1} = \\square \\;(\\text{보정})`, blank: r.bump });
  });
  steps.push({ tex: `${n} \\div ${d} = \\square \\cdots \\square`, blank: q });
  steps.push({ tex: `\\text{나머지}: \\square`, blank: rem });

  return {
    prompt: {
      ko: `${n} ÷ ${d}: ${anchor}에 가까운 수로 나누는 전략으로 몫과 나머지를 구해요`,
      en: `${n} ÷ ${d} — find the quotient and remainder using the near-${anchor} division strategy`,
      zh: `${n} ÷ ${d}：用"接近${anchor}"策略求商和余数`
    },
    tex: `${n} \\div ${d} = \\square \\cdots ${rem}`,
    answer: q, answerType: 'steps', widget: 'steps',
    steps
  };
};

/* ── CH7 — 50·100·1000 근처 수의 제곱 ─────────────────────────
   (A+a)² = A² + 2Aa + a² = P×(A²/P + (2A/P)a) + a²  (P=100 또는 1000).
   앞자리 = A²/P + (2A/P)a, 뒷자리 = a² — 실제 덧셈으로 합치므로 자리올림도
   자동으로 정확하다. 수치 범위(정독): 44²~110²(50·100 기준), 990²~1010²
   (1000 기준). */
NM_TGEN['adv_nearSquare'] = function (params, rng) {
  const A = params.anchor || 100;
  const P = A === 1000 ? 1000 : 100;
  /* 정독 범위(44²~110², 990²~1010²)를 그대로 쓰면 a가 ±10뿐이라 20개 미만
     조합이라 한 장 중복률이 35%대였다(연산문제-감사.md와 같은 원인) — "근처"라는
     취지를 지키는 선에서 폭을 넓혔다(anchor별로 상대폭이 비슷하게 유지되도록). */
  const aMax = A === 50 ? 33 : A === 100 ? 40 : 42;
  let a;
  do { a = R(rng, -aMax, aMax); } while (a === 0);
  const x = A + a;
  const base = (A * A) / P;
  const mult = (2 * A) / P;
  const front = base + mult * a;
  const aSq = a * a;
  const answer = front * P + aSq;

  return {
    prompt: {
      ko: `${x}²을 ${A} 근처 수의 제곱 마법으로 계산해요`,
      en: `Compute ${x}² using the near-${A} square trick`,
      zh: `用"靠近${A}的平方"魔法计算 ${x}²`
    },
    tex: `${x}^2 = \\square`,
    answer, answerType: 'steps', widget: 'steps',
    steps: [
      { tex: `${base} ${a >= 0 ? '+' : '-'} ${mult} \\times ${Math.abs(a)} = \\square`, blank: front },
      { tex: `${a}^2 = \\square`, blank: aSq },
      { tex: `${front} \\times ${P} + ${aSq} = \\square`, blank: answer }
    ]
  };
};

/* ── CH8 — 제곱·세제곱 계산법 (★칸 자유 선택) ─────────────────
   제곱: n² = (n−★)(n+★) + ★².  세제곱: n³ = (n−★)×n×(n+★) + ★²×n.
   ★는 n±★가 계산하기 편해지도록(대개 일의 자리를 지우도록) 고른다.
   수치 범위(정독): 제곱은 세 자리(125²~894²), 세제곱은 두 자리(11³~99³). */
NM_TGEN['adv_sqcube'] = function (params, rng) {
  const mode = params.mode || 'square';
  const n = mode === 'square' ? R(rng, 125, 894) : R(rng, 11, 99);
  const rem = n % 10;
  const star = rem === 0 ? R(rng, 1, 9) : pick(rng, [rem, 10 - rem]);
  const x = n - star, y = n + star;

  if (mode === 'cube') {
    const part1 = x * n * y;
    const part2 = star * star * n;
    const answer = part1 + part2;
    return {
      prompt: {
        ko: `${n}³을 ★=${star}로 잡아 세제곱 계산법으로 구해요`,
        en: `Compute ${n}³ using the cube trick with ★=${star}`,
        zh: `用★=${star}的立方捷算法求 ${n}³`
      },
      tex: `${n}^3 = \\square`,
      answer, answerType: 'steps', widget: 'steps',
      steps: [
        { tex: `(${x}) \\times ${n} \\times (${y}) = \\square`, blank: part1 },
        { tex: `${star}^2 \\times ${n} = \\square`, blank: part2 },
        { tex: `${part1} + ${part2} = \\square`, blank: answer }
      ]
    };
  }

  const xy = x * y;
  const starSq = star * star;
  const answer = xy + starSq;
  return {
    prompt: {
      ko: `${n}²을 ★=${star}로 잡아 제곱 계산법으로 구해요`,
      en: `Compute ${n}² using the square trick with ★=${star}`,
      zh: `用★=${star}的平方捷算法求 ${n}²`
    },
    tex: `${n}^2 = \\square`,
    answer, answerType: 'steps', widget: 'steps',
    steps: [
      { tex: `(${x}) \\times (${y}) = \\square`, blank: xy },
      { tex: `${star}^2 = \\square`, blank: starSq },
      { tex: `${xy} + ${starSq} = \\square`, blank: answer }
    ]
  };
};

/* ── CH9 — 분리 제곱법 ─────────────────────────────────────────
   N = 앞부분×10^s + 뒷부분일 때 N² = 앞²×10^{2s} + 2×앞×뒤×10^s + 뒤².
   세 항을 실제 덧셈으로 합치므로 자리올림이 저절로 정확히 반영된다.
   수치 범위(정독): 5자리(11550²~99812²), 분리 지점은 보통 뒤 2~3자리. */
NM_TGEN['adv_splitSquare'] = function (params, rng) {
  const s = params.split || 2;
  const lv = params.level || 'main';
  const N = lv === 'practice' ? R(rng, 11550, 49999) : R(rng, 50000, 99812);
  const div = Math.pow(10, s);
  const front = Math.floor(N / div);
  const back = N % div;
  const frontSq = front * front;
  const twoFB = 2 * front * back;
  const backSq = back * back;
  const answer = frontSq * Math.pow(10, 2 * s) + twoFB * Math.pow(10, s) + backSq;

  return {
    prompt: {
      ko: `${N}²을 끝 ${s}자리 기준으로 분리해서 계산해요 (앞 ${front}, 뒤 ${back})`,
      en: `Compute ${N}² by splitting off the last ${s} digits (front ${front}, back ${back})`,
      zh: `按末${s}位拆分计算 ${N}²（前${front}，后${back}）`
    },
    tex: `${N}^2 = \\square`,
    answer, answerType: 'steps', widget: 'steps',
    steps: [
      { tex: `${front}^2 = \\square`, blank: frontSq },
      { tex: `2 \\times ${front} \\times ${back} = \\square`, blank: twoFB },
      { tex: `${back}^2 = \\square`, blank: backSq },
      { tex: `${frontSq}\\times10^{${2 * s}} + ${twoFB}\\times10^{${s}} + ${backSq} = \\square`, blank: answer }
    ]
  };
};

/* ── CH10 — 제곱수의 합 (n(n+1)(2n+1)/6) ──────────────────────
   1이 아닌 곳부터 시작하면 (b까지의 합) − (a−1까지의 합)으로 구한다 —
   원문은 시작수가 1이 아닌 경우가 대부분이라 이 뺄셈 구조를 기본값으로 둔다.
   수치 범위(정독): 1~5의 소구간에서 100~300의 세 자리 구간까지. */
NM_TGEN['adv_sumSquares'] = function (params, rng) {
  const lv = params.level || 'main';
  /* 정독의 "1~5의 소구간"은 원문 최소 예시일 뿐 — 그대로 쓰면 시작수 5개×구간폭
     3개뿐이라 한 장 중복률이 44%였다. 시작수·구간폭 둘 다 넓혀 소구간이라는
     느낌(두 자리 이내)은 유지하면서 조합 수를 늘렸다. */
  const a = lv === 'practice' ? R(rng, 1, 20) : R(rng, 50, 250);
  const span = lv === 'practice' ? R(rng, 2, 8) : R(rng, 20, 60);
  const b = Math.min(a + span, lv === 'practice' ? 30 : 300);

  const sumSq = n => n <= 0 ? 0 : n * (n + 1) * (2 * n + 1) / 6;
  const Sb = sumSq(b);
  const Sa1 = sumSq(a - 1);
  const answer = Sb - Sa1;

  const steps = [];
  const bb1 = b * (b + 1);
  const bb2 = bb1 * (2 * b + 1);
  steps.push({ tex: `${b} \\times ${b + 1} = \\square`, blank: bb1 });
  steps.push({ tex: `${bb1} \\times ${2 * b + 1} = \\square`, blank: bb2 });
  steps.push({ tex: `${bb2} \\div 6 = \\square \\;(1^2+\\cdots+${b}^2)`, blank: Sb });

  if (a > 1) {
    const n2 = a - 1;
    const aa1 = n2 * (n2 + 1);
    const aa2 = aa1 * (2 * n2 + 1);
    steps.push({ tex: `${n2} \\times ${n2 + 1} \\times ${2 * n2 + 1} \\div 6 = \\square \\;(1^2+\\cdots+${n2}^2)`, blank: Sa1 });
    steps.push({ tex: `${Sb} - ${Sa1} = \\square`, blank: answer });
  }

  return {
    prompt: {
      ko: `${a}²부터 ${b}²까지 제곱을 다 더하면 얼마일까요?`,
      en: `What is ${a}² + ${a + 1}² + \\dots + ${b}²?`,
      zh: `从${a}²加到${b}²等于多少？`
    },
    tex: `${a}^2 + ${a + 1}^2 + \\cdots + ${b}^2 = \\square`,
    answer, answerType: 'steps', widget: 'steps',
    steps
  };
};

/* ── CH11 — 몰아주기 곱 (십의 자리 기준 앞자리 맞춰 곱하기) ────
   sameTens(일반형): base×(base+b1+b2)+b1×b2.
   sameTensSum10(A-3, 36×34류): 앞=t×(t+1), 뒤=b1×b2(합10).
   sameOnesSum10(A-4, 36×76류): 앞=t1×t2+ones, 뒤=ones².
   nearTens(B 확장): 십의 자리가 달라도 기준수를 자유롭게 잡아 같은 일반형으로. */
NM_TGEN['adv_anchorTens'] = function (params, rng) {
  const mode = params.mode || 'sameTens';

  if (mode === 'sameTensSum10') {
    const t = R(rng, 2, 9);
    const b1 = R(rng, 1, 9), b2 = 10 - b1;
    const front = t * (t + 1), back = b1 * b2;
    const answer = front * 100 + back;
    const a = t * 10 + b1, c = t * 10 + b2;
    return {
      prompt: { ko: `${a} × ${c}: 십의 자리가 같고 일의 자리 합이 10이에요`,
        en: `${a} × ${c}: same tens digit, ones digits sum to 10`,
        zh: `${a} × ${c}：十位相同，个位之和为10` },
      tex: `${a} \\times ${c} = \\square`,
      answer, answerType: 'steps', widget: 'steps',
      steps: [
        { tex: `${t} \\times ${t + 1} = \\square`, blank: front },
        { tex: `${b1} \\times ${b2} = \\square`, blank: back },
        { tex: `${front} \\times 100 + ${back} = \\square`, blank: answer }
      ]
    };
  }

  if (mode === 'sameOnesSum10') {
    const t1 = R(rng, 1, 9), t2 = 10 - t1;
    const ones = R(rng, 0, 9);
    const front = t1 * t2 + ones, back = ones * ones;
    const answer = front * 100 + back;
    const a = t1 * 10 + ones, c = t2 * 10 + ones;
    return {
      prompt: { ko: `${a} × ${c}: 일의 자리가 같고 십의 자리 합이 10이에요`,
        en: `${a} × ${c}: same ones digit, tens digits sum to 10`,
        zh: `${a} × ${c}：个位相同，十位之和为10` },
      tex: `${a} \\times ${c} = \\square`,
      answer, answerType: 'steps', widget: 'steps',
      steps: [
        { tex: `${t1} \\times ${t2} + ${ones} = \\square`, blank: front },
        { tex: `${ones}^2 = \\square`, blank: back },
        { tex: `${front} \\times 100 + ${back} = \\square`, blank: answer }
      ]
    };
  }

  /* sameTens(일반형) · nearTens(기준수 자유형) — 같은 공식, base 선택만 다름 */
  let base, b1, b2;
  if (mode === 'nearTens') {
    base = R(rng, 2, 8) * 10;
    b1 = R(rng, 1, 14); b2 = R(rng, 1, 14);
    while (b2 === b1) b2 = R(rng, 1, 14);
  } else {
    const t = R(rng, 2, 9);
    base = t * 10;
    b1 = R(rng, 0, 9); b2 = R(rng, 0, 9);
  }
  const a = base + b1, c = base + b2;
  const mid = base + b1 + b2;
  const part1 = base * mid;
  const part2 = b1 * b2;
  const answer = part1 + part2;
  return {
    prompt: { ko: `${a} × ${c}를 몰아주기 곱(기준수 ${base})으로 계산해요`,
      en: `Calculate ${a} × ${c} by anchoring on ${base}`,
      zh: `以${base}为基准，用集中相乘法计算 ${a} × ${c}` },
    tex: `${a} \\times ${c} = \\square`,
    answer, answerType: 'steps', widget: 'steps',
    steps: [
      { tex: `${base} \\times (${base} + ${b1} + ${b2}) = \\square`, blank: part1 },
      { tex: `${b1} \\times ${b2} = \\square`, blank: part2 },
      { tex: `${part1} + ${part2} = \\square`, blank: answer }
    ]
  };
};

/* ── CH12 — 어림하기 곱셈법 ────────────────────────────────────
   ①가까운 계산하기 쉬운 수 찾기 ②더/덜 곱해진 정도 판단(부호) ③최종값.
   a를 가까운 라운드수(round)로 잡고, a=round+e(e는 +/-)로 어긋난 만큼을
   e×b로 보정한다. 수치 범위(정독): 2자리(52×48)~3자리(404×396),
   비대칭 거리(298×122)도 이 방식(한쪽만 반올림)으로 그대로 재현된다. */
NM_TGEN['adv_estimate'] = function (params, rng) {
  const lv = params.level || 'main';
  const roundTo = lv === 'practice' ? 10 : pick(rng, [10, 100]);
  const m = lv === 'practice' ? R(rng, 2, 9) : R(rng, 2, 49);
  const roundVal = m * roundTo;
  const eMax = roundTo === 10 ? R(rng, 1, 4) : R(rng, 1, 9);
  const sign = pick(rng, [1, -1]);
  const e = sign * eMax;
  const a = roundVal + e;
  const b = lv === 'practice' ? R(rng, 10, 99) : R(rng, 50, 999);

  const estimate = roundVal * b;
  const crossTerm = Math.abs(e) * b;
  const answer = estimate + e * b;

  return {
    prompt: {
      ko: `${a} × ${b}를 어림하기 곱셈법으로 계산해요 (${a}는 ${roundVal}에 가까워요)`,
      en: `Calculate ${a} × ${b} using the estimate-and-adjust method (${a} is close to ${roundVal})`,
      zh: `用估算调整法计算 ${a} × ${b}（${a}接近${roundVal}）`
    },
    tex: `${a} \\times ${b} = \\square`,
    answer, answerType: 'steps', widget: 'steps',
    steps: [
      { tex: `${roundVal} \\times ${b} = \\square`, blank: estimate },
      { tex: `${Math.abs(e)} \\times ${b} = \\square`, blank: crossTerm },
      { tex: `${estimate} ${e > 0 ? '+' : '-'} ${crossTerm} = \\square`, blank: answer }
    ]
  };
};

/* ── CH13 — 큰 수 정복 (만·억·조 자릿수 판단) ─────────────────
   두 수의 0 개수를 더해 다음 단위(만·억·조)로 몇 계단 올라가는지 판단한다.
   그래픽 상 실제 곱은 최대 16자리까지 커질 수 있어(1000조) 숫자 입력칸에
   그대로 받을 수 없으므로, 그래프된 "몇 [단위]"의 그 앞자리 수(X, ≤4자리)를
   답으로 받는다 — 원문 취지("0의 개수로 단위를 판단")를 그대로 유지하면서
   입력 UI 제약을 피한다. 수치 범위(정독): 만×만(=억)~100만×10억(=1000조). */
NM_TGEN['adv_bigscale'] = function (params, rng) {
  const UNITS = [{ exp: 4, ko: '만', en: 'ten-thousand', zh: '万' },
                 { exp: 8, ko: '억', en: 'hundred-million', zh: '亿' },
                 { exp: 12, ko: '조', en: 'trillion', zh: '万亿' }];

  let p1, p2, totalZeros, unit, remainder;
  for (let tries = 0; tries < 8; tries++) {
    p1 = R(rng, 3, 7);
    p2 = R(rng, 4, 9);
    totalZeros = p1 + p2;
    const cand = UNITS.filter(u => u.exp <= totalZeros);
    unit = cand.length ? cand[cand.length - 1] : UNITS[0];
    remainder = totalZeros - unit.exp;
    if (remainder <= 2) break;
  }
  if (remainder > 2) { p1 = 4; p2 = 4; totalZeros = 8; unit = UNITS[1]; remainder = 0; }

  const k1 = R(rng, 1, 9), k2 = R(rng, 1, 9);
  const a = k1 * Math.pow(10, p1);
  const b = k2 * Math.pow(10, p2);
  const k1k2 = k1 * k2;
  const X = k1k2 * Math.pow(10, remainder);

  return {
    prompt: {
      ko: `${a.toLocaleString('ko-KR')} × ${b.toLocaleString('ko-KR')}은 몇 ${unit.ko}일까요? (0의 개수를 세어 봐요)`,
      en: `${a.toLocaleString('en-US')} × ${b.toLocaleString('en-US')} is how many ${unit.en}(s)? (count the zeros)`,
      zh: `${a.toLocaleString('zh-CN')} × ${b.toLocaleString('zh-CN')}是多少${unit.zh}？（数一数0的个数）`
    },
    tex: `${a} \\times ${b} = \\square\\,\\text{${unit.ko}}`,
    answer: X, answerType: 'steps', widget: 'steps',
    steps: [
      { tex: `\\text{0의 개수}: ${p1} + ${p2} = \\square`, blank: totalZeros },
      { tex: `${k1} \\times ${k2} = \\square`, blank: k1k2 },
      { tex: `${k1k2} \\times 10^{${remainder}} = \\square \\;(${unit.ko}\\ \\text{단위})`, blank: X }
    ]
  };
};

if (typeof module !== 'undefined' && module.exports) module.exports = NM_TGEN;
})();
