/* ============================================================
   Numbers of Magic — MD10~14(중등 W9 · 중2 식의 계산) 스레드 생성기
   근거: MASTER-ROADMAP.md §5(중2 W9) — 2022 개정 교육과정 중2 '식의
   계산' 성취기준 범위의 표준 연산 유형을 자체 설계(교과서 문장 인용
   없음). engine/threads/mid.js(W8, MD1~9)에 이어지는 번호.
   계약: NM_TGEN[genKey] = function(params, rng) { return problem; }
   절대 Math.random() 사용 금지 — R(rng,a,b) / pick(rng,arr)만.
   답 환원 원칙(MASTER-ROADMAP §7): 모든 답은 정수 몇 개로 받는다 —
   문자식을 문자열로 입력받지 않는다(지수법칙은 "결과의 지수"만,
   단항식·다항식은 계수/지수를 정수 다칸으로).
   다칸 답 tex 규약: 이어지는 항의 부호는 항상 "+\square"로 통일하고
   음수는 numpad의 − 키로 직접 입력한다(각 항의 부호를 tex에서
   앞항목과 맞춰 표시하려다 이중부호가 생기는 문제를 원천 차단 —
   W8 mid.js가 wrapSigned()로 부호 있는 "리터럴 숫자"에만 쓰던 것과
   달리, 여기서는 빈칸이라 그 문제가 없다). problem.negative는 배열
   답 중 하나라도 음수일 수 있으면 true로 켠다(단일 - 키 노출용).
   ============================================================ */
(function(){
'use strict';

const { R, pick } = NM_RNG;

/* ── 공용 헬퍼 ── */
function nzInt(rng, lo, hi){ return R(rng, lo, hi) * pick(rng, [1, -1]); }   /* 0이 아닌 부호 있는 정수 */
function wrapPlus(n){ return n < 0 ? `- ${Math.abs(n)}` : `+ ${n}`; }         /* "+5" / "- 5" 접속 조각 */

/* 단항식 표기 — 2026-08-28 인쇄 점검에서 `1x^{3}`·`x^{1}`·`x^{0}`이 그대로
   찍히고 음수 계수가 `\times -9x^{3}`처럼 괄호 없이 나오던 것을 정리한다.
   계수 1은 생략, 지수 1은 x, 지수 0은 문자 없음, 음수는 괄호. */
function monoTex(c, m, needParen){
  let body;
  if(m === 0)      body = String(Math.abs(c));
  else {
    const xs = (m === 1) ? 'x' : `x^{${m}}`;
    body = (Math.abs(c) === 1) ? xs : `${Math.abs(c)}${xs}`;
  }
  if(c < 0) return needParen ? `(-${body})` : `-${body}`;
  return body;
}
function divisorsOf(n){
  n = Math.abs(n);
  const out = [];
  for (let k = 1; k <= n; k++) if (n % k === 0) out.push(k);
  return out;
}

/* ── MD10 — 지수법칙 4종 (aᵐ×aⁿ · (aᵐ)ⁿ · aᵐ÷aⁿ · 혼합) ──
   답은 항상 "결과의 지수" 하나(밑은 그대로 두고 지수만 계산 — §7).
   밑 글자를 매번 바꿔 특정 문자에 안 묶이게 한다. lineage: 계보5
   '자리의 마법'의 종착(과정-로드맵.md §6 — 자릿값 곱셈의 부분곱
   원리가 지수법칙의 "몇 번 곱했나 세기"로 자라난다).
   mode: 'mul' · 'pow' · 'div' · 'combo'(두 법칙이 한 식에 섞임). */
NM_TGEN['md10_expLaw'] = function (params, rng) {
  const mode = params.mode || 'mul';
  const BASES = ['a', 'b', 'c', 'x', 'y', 'm', 'n'];
  const base = pick(rng, BASES);

  if (mode === 'mul') {
    const m = R(rng, 2, 9), n = R(rng, 2, 9);
    return {
      prompt: {
        ko: `밑이 같은 거듭제곱끼리 곱할 땐 지수를 더해요`,
        en: `Multiplying powers with the same base — add the exponents`,
        zh: `同底数幂相乘——指数相加`
      },
      tex: `${base}^{${m}} \\times ${base}^{${n}} = ${base}^{\\square}`,
      answer: m + n, answerType: 'number', widget: 'numpad',
      solution: [
        { tex: `${base}^{${m}} \\times ${base}^{${n}} = ${base}^{${m}+${n}}` },
        { tex: `${base}^{${m}+${n}} = ${base}^{\\square}`, blank: m + n }
      ]
    };
  }

  if (mode === 'pow') {
    const m = R(rng, 2, 5), n = R(rng, 2, 4);
    return {
      prompt: {
        ko: `거듭제곱을 다시 거듭제곱하면 지수끼리 곱해요`,
        en: `A power raised to another power — multiply the exponents`,
        zh: `幂的乘方——指数相乘`
      },
      tex: `(${base}^{${m}})^{${n}} = ${base}^{\\square}`,
      answer: m * n, answerType: 'number', widget: 'numpad',
      solution: [
        { tex: `(${base}^{${m}})^{${n}} = ${base}^{${m}\\times${n}}` },
        { tex: `${base}^{${m}\\times${n}} = ${base}^{\\square}`, blank: m * n }
      ]
    };
  }

  if (mode === 'div') {
    const n = R(rng, 1, 8), m = R(rng, n + 1, n + 8);
    return {
      prompt: {
        ko: `밑이 같은 거듭제곱끼리 나누면 지수를 빼요(큰 지수 − 작은 지수)`,
        en: `Dividing powers with the same base — subtract the exponents (bigger minus smaller)`,
        zh: `同底数幂相除——指数相减(大指数减小指数)`
      },
      tex: `${base}^{${m}} \\div ${base}^{${n}} = ${base}^{\\square}`,
      answer: m - n, answerType: 'number', widget: 'numpad',
      solution: [
        { tex: `${base}^{${m}} \\div ${base}^{${n}} = ${base}^{${m}-${n}}` },
        { tex: `${base}^{${m}-${n}} = ${base}^{\\square}`, blank: m - n }
      ]
    };
  }

  /* combo — 두 법칙이 한 식에 섞인다 (밑 혼합 — 지수법칙 4번째 유형) */
  const shape = pick(rng, ['powThenMul', 'mulThenDiv', 'productPow']);

  if (shape === 'powThenMul') {
    const m = R(rng, 2, 4), n = R(rng, 2, 3), k = R(rng, 2, 9);
    const mid = m * n;
    const answer = mid + k;
    return {
      prompt: {
        ko: `(${base}^{${m}})^{${n}}을 먼저 하나의 거듭제곱으로 합치고, 곱셈 법칙을 적용해요`,
        en: `First collapse (${base}^${m})^${n} into one power, then apply the multiplication law`,
        zh: `先把(${base}^{${m}})^{${n}}合成一个幂，再用乘法法则`
      },
      tex: `(${base}^{${m}})^{${n}} \\times ${base}^{${k}} = ${base}^{\\square}`,
      answer, answerType: 'steps', widget: 'steps',
      steps: [
        { tex: `(${base}^{${m}})^{${n}} = ${base}^{\\square}`, blank: mid },
        { tex: `${base}^{${mid}} \\times ${base}^{${k}} = ${base}^{\\square}`, blank: answer }
      ],
      solution: [
        { tex: `(${base}^{${m}})^{${n}} = ${base}^{\\square}`, blank: mid },
        { tex: `${base}^{${mid}} \\times ${base}^{${k}} = ${base}^{\\square}`, blank: answer }
      ]
    };
  }

  if (shape === 'mulThenDiv') {
    const p = R(rng, 2, 9), q = R(rng, 2, 9);
    const sum = p + q;
    const k = R(rng, 1, sum - 1);
    const answer = sum - k;
    return {
      prompt: {
        ko: `곱셈으로 지수를 먼저 더한 뒤, 나눗셈으로 지수를 빼요`,
        en: `Add exponents for the multiplication first, then subtract for the division`,
        zh: `先用乘法把指数相加，再用除法把指数相减`
      },
      tex: `${base}^{${p}} \\times ${base}^{${q}} \\div ${base}^{${k}} = ${base}^{\\square}`,
      answer, answerType: 'steps', widget: 'steps',
      steps: [
        { tex: `${base}^{${p}} \\times ${base}^{${q}} = ${base}^{\\square}`, blank: sum },
        { tex: `${base}^{${sum}} \\div ${base}^{${k}} = ${base}^{\\square}`, blank: answer }
      ],
      solution: [
        { tex: `${base}^{${p}} \\times ${base}^{${q}} = ${base}^{\\square}`, blank: sum },
        { tex: `${base}^{${sum}} \\div ${base}^{${k}} = ${base}^{\\square}`, blank: answer }
      ]
    };
  }

  /* productPow — (aᵐ×aⁿ)ᵖ = a^((m+n)p) */
  const m = R(rng, 2, 5), n = R(rng, 2, 5), p = R(rng, 2, 3);
  const inner = m + n;
  const answer = inner * p;
  return {
    prompt: {
      ko: `괄호 안을 먼저 하나의 거듭제곱으로 합치고, 바깥 지수를 곱해요`,
      en: `Combine inside the brackets into one power first, then multiply by the outer exponent`,
      zh: `先把括号内合成一个幂，再乘以外面的指数`
    },
    tex: `(${base}^{${m}} \\times ${base}^{${n}})^{${p}} = ${base}^{\\square}`,
    answer, answerType: 'steps', widget: 'steps',
    steps: [
      { tex: `${base}^{${m}} \\times ${base}^{${n}} = ${base}^{\\square}`, blank: inner },
      { tex: `(${base}^{${inner}})^{${p}} = ${base}^{\\square}`, blank: answer }
    ],
    solution: [
      { tex: `${base}^{${m}} \\times ${base}^{${n}} = ${base}^{\\square}`, blank: inner },
      { tex: `(${base}^{${inner}})^{${p}} = ${base}^{\\square}`, blank: answer }
    ]
  };
};

/* ── MD11 — 단항식의 곱셈과 나눗셈 ──
   답은 [계수, 지수] 다칸. 문자는 항상 x 하나로 고정 — 서로 다른 문자
   여러 개가 섞인 단항식은 범위 밖(다음 배치). mode: 'mul' · 'div' ·
   'chain'(세 단항식 곱나눗 혼합, 앞에서부터 차례로). */
NM_TGEN['md11_monoMulDiv'] = function (params, rng) {
  const mode = params.mode || 'mul';

  if (mode === 'mul') {
    const c1 = nzInt(rng, 1, 9), c2 = nzInt(rng, 1, 9);
    const m = R(rng, 1, 5), n = R(rng, 1, 5);
    const coeff = c1 * c2, exp = m + n;
    return {
      prompt: {
        ko: `단항식끼리 곱할 땐 계수는 계수끼리 곱하고, 문자는 지수법칙으로 합쳐요`,
        en: `Multiply monomials: multiply the coefficients, combine the letter parts with the exponent law`,
        zh: `单项式相乘：系数乘系数，字母部分用指数法则合并`
      },
      tex: `${monoTex(c1, m, false)} \\times ${monoTex(c2, n, true)} = \\square x^{\\square}`,
      answer: [coeff, exp], answerType: 'number', widget: 'numpad', negative: coeff < 0,
      /* 개념 애니메이션용 장면 필드 (개념애니-설계.md §4-1) — 계수·지수가
         monoTex()로 만든 문자열 안에만 있어서 "두 표기를 나란히"를 그릴 수
         없었다. tex 파싱 금지라 지역변수를 그대로 내보낸다. 기존 반환값 불변. */
      scene: { archetype: 'notation', op: 'mul', a: { c: c1, e: m }, b: { c: c2, e: n }, coeff, exp },
      solution: [
        { tex: `${c1} \\times ${c2} = ${coeff}` },
        { tex: `x^{${m}} \\times x^{${n}} = x^{${m + n}}` },
        { tex: `${monoTex(c1, m, false)} \\times ${monoTex(c2, n, true)} = \\square x^{\\square}`, blank: [coeff, exp] }
      ]
    };
  }

  if (mode === 'div') {
    const n = R(rng, 1, 4), m = R(rng, n, n + 4);
    const c2 = nzInt(rng, 1, 9);
    const k = nzInt(rng, 1, 9);
    const c1 = c2 * k;
    const coeff = k, exp = m - n;
    return {
      prompt: {
        ko: `단항식끼리 나눌 땐 계수는 계수끼리 나누고, 문자는 지수법칙으로 빼요`,
        en: `Divide monomials: divide the coefficients, subtract exponents for the letter parts`,
        zh: `单项式相除：系数除以系数，字母部分用指数法则相减`
      },
      tex: `${monoTex(c1, m, false)} \\div ${monoTex(c2, n, true)} = \\square x^{\\square}`,
      answer: [coeff, exp], answerType: 'number', widget: 'numpad', negative: coeff < 0,
      scene: { archetype: 'notation', op: 'div', a: { c: c1, e: m }, b: { c: c2, e: n }, coeff, exp },
      solution: [
        { tex: `${c1} \\div ${c2} = ${coeff}` },
        { tex: `x^{${m}} \\div x^{${n}} = x^{${m - n}}` },
        { tex: `${monoTex(c1, m, false)} \\div ${monoTex(c2, n, true)} = \\square x^{\\square}`, blank: [coeff, exp] }
      ]
    };
  }

  /* chain — 세 단항식의 곱셈·나눗셈 혼합, 앞에서부터 차례로.
     매 단계 나눗셈이면 그 시점 계수의 약수만 골라 정수로 떨어지게,
     지수는 항상 1 이상으로 남게(0으로 사라지지 않게) 만든다. */
  let coeff = nzInt(rng, 1, 6);
  let exp = R(rng, 2, 5);
  const terms = [{ c: coeff, m: exp, op: null }];
  for (let i = 0; i < 2; i++) {
    const canDiv = exp >= 2;
    const op = canDiv ? pick(rng, ['\\times', '\\div']) : '\\times';
    if (op === '\\times') {
      const c = nzInt(rng, 1, 6), m = R(rng, 1, 3);
      coeff *= c; exp += m;
      terms.push({ c, m, op });
    } else {
      const divs = divisorsOf(coeff);
      const c = pick(rng, divs);
      let m = R(rng, 0, exp - 1);
      /* c===1 && m===0 이면 "÷ 1"인 항 — 계수도 지수도 안 바뀌는 무의미한
         단계라 지수법칙 나눗셈을 전혀 안 가르친다. exp>=2(canDiv 보장)라
         exp-1>=1이라서 m을 1 이상으로 다시 뽑아도 항상 값이 있다. */
      if (c === 1 && m === 0) m = R(rng, 1, exp - 1);
      coeff = coeff / c; exp = exp - m;
      terms.push({ c, m, op });
    }
  }
  const exprTex = terms.map((t, i) => i === 0 ? monoTex(t.c, t.m, false) : ` ${t.op} ${monoTex(t.c, t.m, true)}`).join('');
  const coeffChainTex = terms.map((t, i) => i === 0 ? String(t.c) : ` ${t.op} ${t.c}`).join('');
  const expChainTex = terms.map((t, i) => i === 0 ? String(t.m) : ` ${t.op === '\\times' ? '+' : '-'} ${t.m}`).join('');
  return {
    prompt: {
      ko: `세 단항식의 곱셈·나눗셈 혼합이에요. 앞에서부터 차례로 계산해요`,
      en: `Mixed × and ÷ of three monomials — work left to right`,
      zh: `三个单项式的乘除混合——从左到右依次计算`
    },
    tex: `${exprTex} = \\square x^{\\square}`,
    answer: [coeff, exp], answerType: 'number', widget: 'numpad', negative: coeff < 0,
    solution: [
      { tex: `\\text{계수}: ${coeffChainTex} = ${coeff}` },
      { tex: `\\text{지수}: ${expChainTex} = ${exp}` },
      { tex: `\\square x^{\\square}`, blank: [coeff, exp] }
    ]
  };
};

/* ── MD12 — 다항식의 덧셈과 뺄셈(동류항 정리) ──
   mode: 'linear'(일차식 두 개, 답 [x계수,상수]) · 'quadratic'(이차식
   두 개, 답 [x²계수,x계수,상수]) · 'brackets'(괄호 앞이 −라서 안의
   모든 항의 부호를 바꿔야 하는 경우, 답 [x계수,상수]). */
NM_TGEN['md12_polyAddSub'] = function (params, rng) {
  const mode = params.mode || 'linear';

  if (mode === 'linear') {
    const a1 = nzInt(rng, 1, 9), b1 = nzInt(rng, 1, 20);
    const a2 = nzInt(rng, 1, 9), b2 = nzInt(rng, 1, 20);
    const op = pick(rng, ['+', '-']);
    const xc = op === '+' ? a1 + a2 : a1 - a2;
    const cc = op === '+' ? b1 + b2 : b1 - b2;
    return {
      prompt: {
        ko: `동류항끼리(문자와 차수가 같은 항끼리)만 더하거나 빼요`,
        en: `Combine like terms — same letter, same power — only`,
        zh: `只把同类项(字母和次数都相同)相加或相减`
      },
      tex: `(${a1}x ${wrapPlus(b1)}) ${op} (${a2}x ${wrapPlus(b2)}) = \\square x + \\square`,
      answer: [xc, cc], answerType: 'number', widget: 'numpad', negative: xc < 0 || cc < 0,
      solution: [
        { tex: `${a1} ${op} ${a2} = ${xc}` },
        { tex: `${b1} ${op} ${b2} = ${cc}` },
        { tex: `\\square x + \\square`, blank: [xc, cc] }
      ]
    };
  }

  if (mode === 'quadratic') {
    const a1 = nzInt(rng, 1, 6), b1 = nzInt(rng, 1, 9), c1 = nzInt(rng, 1, 15);
    const a2 = nzInt(rng, 1, 6), b2 = nzInt(rng, 1, 9), c2 = nzInt(rng, 1, 15);
    const op = pick(rng, ['+', '-']);
    const x2c = op === '+' ? a1 + a2 : a1 - a2;
    const xc = op === '+' ? b1 + b2 : b1 - b2;
    const cc = op === '+' ? c1 + c2 : c1 - c2;
    return {
      prompt: {
        ko: `x², x, 상수 — 차수가 같은 항끼리 각각 정리해요`,
        en: `Sort by degree — x² terms, x terms, and constants each combine separately`,
        zh: `按次数分类——x²项、x项、常数项分别合并`
      },
      tex: `(${a1}x^2 ${wrapPlus(b1)}x ${wrapPlus(c1)}) ${op} (${a2}x^2 ${wrapPlus(b2)}x ${wrapPlus(c2)}) = \\square x^2 + \\square x + \\square`,
      answer: [x2c, xc, cc], answerType: 'number', widget: 'numpad', negative: x2c < 0 || xc < 0 || cc < 0,
      solution: [
        { tex: `${a1} ${op} ${a2} = ${x2c}` },
        { tex: `${b1} ${op} ${b2} = ${xc}` },
        { tex: `${c1} ${op} ${c2} = ${cc}` },
        { tex: `\\square x^2 + \\square x + \\square`, blank: [x2c, xc, cc] }
      ]
    };
  }

  /* brackets — 괄호 앞이 −라서 안의 모든 항의 부호를 바꿔야 함(뺄셈 고정) */
  const a1 = nzInt(rng, 1, 9), b1 = nzInt(rng, 1, 20);
  const a2 = nzInt(rng, 1, 9), b2 = nzInt(rng, 1, 20);
  const xc = a1 - a2, cc = b1 - b2;
  return {
    prompt: {
      ko: `괄호 앞이 −이면 괄호 안 모든 항의 부호를 바꿔서 풀어요`,
      en: `A minus sign in front of the brackets flips the sign of every term inside`,
      zh: `括号前是−号，就要把括号里每一项的符号都变号`
    },
    tex: `${a1}x ${wrapPlus(b1)} - (${a2}x ${wrapPlus(b2)}) = \\square x + \\square`,
    answer: [xc, cc], answerType: 'number', widget: 'numpad', negative: xc < 0 || cc < 0,
    solution: [
      { tex: `-(${a2}x ${wrapPlus(b2)}) = ${-a2}x ${wrapPlus(-b2)}` },
      { tex: `${a1} - ${a2} = ${xc}` },
      { tex: `${b1} - ${b2} = ${cc}` },
      { tex: `\\square x + \\square`, blank: [xc, cc] }
    ]
  };
};

/* ── MD13 — (단항식)×(다항식)의 전개 ──
   분배법칙으로 괄호를 푼다. lineage: 계보5 '자리의 마법'의 한 걸음
   (부분곱 원리 → 다항식 곱셈). mode: 'binomial'(이항식) ·
   'monomialX'(곱하는 단항식에 x가 있어 차수가 하나씩 오름) ·
   'trinomial'(삼항식, 답 세 칸). */
NM_TGEN['md13_monoTimesPoly'] = function (params, rng) {
  const mode = params.mode || 'binomial';

  if (mode === 'binomial') {
    const k = nzInt(rng, 2, 9);
    const a = nzInt(rng, 1, 9), b = nzInt(rng, 1, 20);
    return {
      prompt: {
        ko: `분배법칙으로 괄호 안의 두 항에 각각 곱해요`,
        en: `Distribute — multiply each term inside the brackets`,
        zh: `用分配律——分别乘括号里的每一项`
      },
      tex: `${k}(${a}x ${wrapPlus(b)}) = \\square x + \\square`,
      answer: [k * a, k * b], answerType: 'number', widget: 'numpad', negative: (k * a < 0) || (k * b < 0),
      solution: [
        { tex: `${k} \\times ${a} = ${k * a}` },
        { tex: `${k} \\times ${b} = ${k * b}` },
        { tex: `\\square x + \\square`, blank: [k * a, k * b] }
      ]
    };
  }

  if (mode === 'monomialX') {
    const k = nzInt(rng, 2, 9);
    const a = nzInt(rng, 1, 9), b = nzInt(rng, 1, 20);
    return {
      prompt: {
        ko: `${k}x를 괄호 안 두 항에 각각 곱해요 — 차수가 하나씩 올라가요`,
        en: `Multiply ${k}x by each term inside — the power of x goes up by one each time`,
        zh: `把${k}x分别乘括号里的每一项——x的次数各加1`
      },
      tex: `${k}x(${a}x ${wrapPlus(b)}) = \\square x^2 + \\square x`,
      answer: [k * a, k * b], answerType: 'number', widget: 'numpad', negative: (k * a < 0) || (k * b < 0),
      solution: [
        { tex: `${k} \\times ${a} = ${k * a}` },
        { tex: `${k} \\times ${b} = ${k * b}` },
        { tex: `\\square x^2 + \\square x`, blank: [k * a, k * b] }
      ]
    };
  }

  /* trinomial — 삼항식 전개 */
  const k = nzInt(rng, 2, 7);
  const a = nzInt(rng, 1, 6), b = nzInt(rng, 1, 9), c = nzInt(rng, 1, 15);
  return {
    prompt: {
      ko: `분배법칙으로 괄호 안 세 항 모두에 곱해요`,
      en: `Distribute across all three terms inside the brackets`,
      zh: `用分配律乘括号里的三项`
    },
    tex: `${k}(${a}x^2 ${wrapPlus(b)}x ${wrapPlus(c)}) = \\square x^2 + \\square x + \\square`,
    answer: [k * a, k * b, k * c], answerType: 'number', widget: 'numpad',
    negative: (k * a < 0) || (k * b < 0) || (k * c < 0),
    solution: [
      { tex: `${k} \\times ${a} = ${k * a}` },
      { tex: `${k} \\times ${b} = ${k * b}` },
      { tex: `${k} \\times ${c} = ${k * c}` },
      { tex: `\\square x^2 + \\square x + \\square`, blank: [k * a, k * b, k * c] }
    ]
  };
};

/* ── MD14 — 등식의 변형(이항 감각) ──
   완전한 방정식 풀이가 아니라, 등호를 넘어갈 때 부호가 바뀌는 감각을
   기르는 것이 목적(G 교재에 일차방정식 단원이 없어 W8에서 다루지
   못한 부분을 여기서 "변형 감각"으로만 다룬다 — 정독 원칙). mode:
   'add'(x+a=b) · 'sub'(x-a=b) · 'solve'(ax+b=c, 이항→나눗셈 완주). */
NM_TGEN['md14_isolateX'] = function (params, rng) {
  const mode = params.mode || 'add';

  if (mode === 'add') {
    const a = R(rng, 1, 30), x = nzInt(rng, 1, 20);
    const b = x + a;
    return {
      prompt: {
        ko: `x + ${a} = ${b}: 좌변의 +${a}를 우변으로 넘기면 부호가 바뀌어요`,
        en: `x + ${a} = ${b}: move +${a} to the other side — the sign flips`,
        zh: `x + ${a} = ${b}：把左边的+${a}移到右边，符号要变`
      },
      tex: `x + ${a} = ${b} \\;\\Rightarrow\\; x = ${b} - \\square`,
      answer: a, answerType: 'number', widget: 'numpad',
      solution: [
        { tex: `x + ${a} = ${b}` },
        { tex: `x = ${b} - \\square`, blank: a }
      ]
    };
  }

  if (mode === 'sub') {
    const a = R(rng, 1, 30), x = nzInt(rng, 1, 20);
    const b = x - a;
    return {
      prompt: {
        ko: `x - ${a} = ${b}: 좌변의 -${a}를 우변으로 넘기면 부호가 바뀌어요`,
        en: `x - ${a} = ${b}: move -${a} to the other side — the sign flips`,
        zh: `x - ${a} = ${b}：把左边的-${a}移到右边，符号要变`
      },
      tex: `x - ${a} = ${b} \\;\\Rightarrow\\; x = ${b} + \\square`,
      answer: a, answerType: 'number', widget: 'numpad',
      solution: [
        { tex: `x - ${a} = ${b}` },
        { tex: `x = ${b} + \\square`, blank: a }
      ]
    };
  }

  /* solve — ax+b=c: 상수항을 이항한 뒤, x의 계수로 나눠 x까지 완주 */
  const aC = R(rng, 2, 9);
  const x0 = nzInt(rng, 1, 12);
  const b = R(rng, 1, 30) * pick(rng, [1, -1]);
  const c = aC * x0 + b;
  return {
    prompt: {
      ko: `상수항을 이항한 뒤, 양변을 x의 계수로 나눠요`,
      en: `Move the constant term across, then divide both sides by the coefficient of x`,
      zh: `先把常数项移项，再用x的系数除以两边`
    },
    tex: `${aC}x ${wrapPlus(b)} = ${c} \\;\\Rightarrow\\; x = \\square`,
    answer: x0, answerType: 'steps', widget: 'steps', negative: x0 < 0,
    steps: [
      { tex: `${aC}x = ${c} - \\square`, blank: b },
      { tex: `${aC}x = ${c - b} \\;\\Rightarrow\\; x = \\square`, blank: x0 }
    ],
    solution: [
      { tex: `${aC}x = ${c} - \\square`, blank: b },
      { tex: `${aC}x = ${c - b} \\;\\Rightarrow\\; x = \\square`, blank: x0 }
    ]
  };
};

if (typeof module !== 'undefined' && module.exports) module.exports = NM_TGEN;
})();
