/* ============================================================
   Numbers of Magic — MD21~30(고등 W11 · 공통수학1) 스레드 생성기.
   근거: MASTER-ROADMAP.md §6(W11 공통수학1) — 2022 개정 교육과정
   공통수학1 '다항식'·'방정식과 부등식'·'행렬' 성취기준 범위의 표준
   연산 유형을 자체 설계(교재 원문 없음, 원본 문장 인용 없음). 집합·
   명제·경우의 수 같은 비연산 단원은 범위 밖(작업지시).
   engine/threads/mid3.js(W10, MD15~20)에 이어지는 번호.
   2022 개정 과목명 준수 — 이 파일 어디에도 "고1" 표기 없음(전부
   "공통수학1"). 계약: NM_TGEN[genKey] = function(params, rng) { ... }
   절대 Math.random() 사용 금지 — R(rng,a,b) / pick(rng,arr)만.
   답 환원 원칙(MASTER-ROADMAP §7): 문자식·근호식·행렬을 문자열로
   받지 않는다 — 전부 정수 몇 개로 환원한다.
   - 다항식 몫·나머지, 곱셈공식 계수, 항등식 미정계수, 인수분해
     인수의 계수: 각 자리 정수를 다칸으로.
   - 근의 공식 (p±√q)/r: [p,q,r] 세 정수(기약 전 형태 그대로 — MD16의
     "근호 정리"는 별개 단계이므로 이 유형에서는 요구하지 않는다).
   - 행렬 2×2: 성분 4개를 [a11,a12,a21,a22] 순서(행 우선)로 다칸.
   다칸 답 tex 규약: mid2·mid3와 동일 — 이어지는 항은 "+\square"로
   통일, 음수는 numpad − 키로 입력(problem.negative로 노출). tex에는
   반드시 KaTeX \square 최소 1개(코드베이스 전수 확인된 관례) —
   "찾아라"류 서술은 tex가 아니라 prompt(3개 언어)에 둔다.
   신규 KaTeX 명령(2026-08-25, 원장 지시로 exam.js texToPlain에도
   등록): \le · \pm · \equiv · \alpha · \beta · \overline{} ·
   \begin{pmatrix}...\end{pmatrix}(행렬, MD30 전용).
   ============================================================ */
(function(){
'use strict';

const { R, pick } = NM_RNG;

/* ── 공용 헬퍼 ── */
function nzInt(rng, lo, hi){ return R(rng, lo, hi) * pick(rng, [1, -1]); }
function wrapPlus(n){ return n < 0 ? `- ${Math.abs(n)}` : `+ ${n}`; }
function hasNeg(v){ return Array.isArray(v) ? v.some(x => x < 0) : v < 0; }
function isPerfectSquare(n){ if (n < 0) return false; const r = Math.round(Math.sqrt(n)); return r * r === n; }
function matTex(m){ return `\\begin{pmatrix} ${m[0][0]} & ${m[0][1]} \\\\ ${m[1][0]} & ${m[1][1]} \\end{pmatrix}`; }
const BLANK_MAT = `\\begin{pmatrix} \\square & \\square \\\\ \\square & \\square \\end{pmatrix}`;

/* ── MD21 — 다항식의 곱셈과 나눗셈 ──
   mode: 'mul'((ax+b)(cx+d) 전개, 답 3칸) · 'div'(이차식÷(x-k) 조립
   제법, 몫의 상수항과 나머지 2칸 — 몫의 x계수는 나눗셈 원리상 피제식의
   최고차항 계수와 같아 이미 tex에 노출) · 'mulTri'(이항식×삼항식,
   답 4칸 — 다칸 4개 인프라 확인용 실전). */
NM_TGEN['md21_polyMulDiv'] = function (params, rng) {
  const mode = params.mode || 'mul';

  if (mode === 'mul') {
    const a = R(rng, 2, 9), c = R(rng, 2, 9);
    const b = nzInt(rng, 1, 9), d = nzInt(rng, 1, 9);
    const answer = [a * c, a * d + b * c, b * d];
    return {
      prompt: {
        ko: `괄호 두 개를 각각 분배해서 곱한 뒤, 같은 차수끼리 모아요`,
        en: `Distribute both brackets, then collect terms of the same degree`,
        zh: `把两个括号分别展开相乘，再合并同类项`
      },
      tex: `(${a}x ${wrapPlus(b)})(${c}x ${wrapPlus(d)}) = \\square x^2 + \\square x + \\square`,
      answer, answerType: 'number', widget: 'numpad', negative: hasNeg(answer)
    };
  }

  if (mode === 'div') {
    const a = R(rng, 2, 9), b = nzInt(rng, 1, 20), c = nzInt(rng, 1, 20);
    const k = R(rng, 1, 9);
    const m = a * k + b;      /* 조립제법: 몫의 상수항 */
    const r = m * k + c;      /* 나머지 */
    const answer = [m, r];
    return {
      prompt: {
        ko: `조립제법으로 나눠요 — k를 곱하고 다음 계수를 더하는 걸 반복해요`,
        en: `Use synthetic division — multiply by k, add the next coefficient, repeat`,
        zh: `用综合除法——乘以k再加上下一个系数，重复进行`
      },
      tex: `(${a}x^2 ${wrapPlus(b)}x ${wrapPlus(c)}) \\div (x - ${k}) = ${a}x + \\square \\;\\; \\text{R} \\square`,
      answer, answerType: 'number', widget: 'numpad', negative: hasNeg(answer)
    };
  }

  /* mulTri — 이항식×삼항식, 답 4칸(4다칸 인프라 확인용) */
  const a = R(rng, 2, 6), b = nzInt(rng, 1, 6);
  const c = R(rng, 2, 6), d = nzInt(rng, 1, 6), e = nzInt(rng, 1, 6);
  const answer = [a * c, a * d + b * c, a * e + b * d, b * e];
  return {
    prompt: {
      ko: `이항식의 두 항을 삼항식의 세 항 모두에 각각 분배해요`,
      en: `Distribute each term of the binomial across all three terms of the trinomial`,
      zh: `把二项式的两项分别乘三项式的每一项`
    },
    tex: `(${a}x ${wrapPlus(b)})(${c}x^2 ${wrapPlus(d)}x ${wrapPlus(e)}) = \\square x^3 + \\square x^2 + \\square x + \\square`,
    answer, answerType: 'number', widget: 'numpad', negative: hasNeg(answer)
  };
};

/* ── MD22 — 곱셈공식의 확장 ── 계보5 '자리의 마법' 연장(2026-08-25,
   작업지시) — 괄호 하나를 세 항 모두에 분배하는 (x+a)³ 전개는 MD13
   ((단항식)×(다항식) 분배)의 심화형이라는 판단. mode: 'basic'((x+a)³,
   a는 양수) · 'signed'((x+a)³, a는 음수 가능) · 'sumCubeFormula'
   (합·차의 세제곱 공식 x³±a³=(x±a)(x²∓ax+a²) 확인, 답 1칸). */
NM_TGEN['md22_cubeFormula'] = function (params, rng) {
  const mode = params.mode || 'basic';
  const cubeCoeffs = a => [3 * a, 3 * a * a, a * a * a];

  if (mode === 'basic') {
    const a = R(rng, 1, 80);
    const answer = cubeCoeffs(a);
    return {
      prompt: {
        ko: `(x+a)³ = x³+3ax²+3a²x+a³ — 가운데 두 항은 3배, 마지막은 세제곱`,
        en: `(x+a)³ = x³+3ax²+3a²x+a³ — the two middle terms are tripled, the last is cubed`,
        zh: `(x+a)³ = x³+3ax²+3a²x+a³——中间两项各乘3，最后一项是立方`
      },
      tex: `(x + ${a})^3 = x^3 + \\square x^2 + \\square x + \\square`,
      answer, answerType: 'number', widget: 'numpad', negative: hasNeg(answer)
    };
  }

  if (mode === 'signed') {
    const a = nzInt(rng, 1, 45);
    const answer = cubeCoeffs(a);
    return {
      prompt: {
        ko: `a가 음수여도 공식은 같아요 — 부호까지 그대로 대입해요`,
        en: `The formula stays the same even when a is negative — substitute the sign as-is`,
        zh: `a是负数公式也一样——把符号原样代入`
      },
      tex: `(x ${wrapPlus(a)})^3 = x^3 + \\square x^2 + \\square x + \\square`,
      answer, answerType: 'number', widget: 'numpad', negative: hasNeg(answer)
    };
  }

  /* sumCubeFormula — 합·차의 세제곱 공식 확인 */
  const a = R(rng, 1, 45);
  const cube = a * a * a;
  const sign = pick(rng, ['+', '-']);
  const tex = sign === '+'
    ? `(x + ${a})(x^2 - ${a}x + ${a * a}) = x^3 + \\square`
    : `(x - ${a})(x^2 + ${a}x + ${a * a}) = x^3 - \\square`;
  return {
    prompt: {
      ko: `x³±a³ = (x±a)(x²∓ax+a²) — 두 인수를 곱하면 가운데 항들이 사라져요`,
      en: `x³±a³ = (x±a)(x²∓ax+a²) — multiplying the two factors cancels the middle terms`,
      zh: `x³±a³ = (x±a)(x²∓ax+a²)——两因式相乘，中间项互相抵消`
    },
    tex, answer: cube, answerType: 'number', widget: 'numpad'
  };
};

/* ── MD23 — 항등식과 미정계수법 ──
   mode: 'direct'(계수 직접 대응, 항등식의 정의 확인) · 'expand'
   (a(x-p)+b(x-q)≡Cx+D 전개 후 계수비교, 답 [a,b]) · 'expandWide'
   (같은 구조, 실전 범위). */
NM_TGEN['md23_identity'] = function (params, rng) {
  const mode = params.mode || 'direct';

  if (mode === 'direct') {
    const C = nzInt(rng, 1, 9), D = nzInt(rng, 1, 20);
    const answer = [C, D];
    return {
      prompt: {
        ko: `모든 x에 대해 항상 성립하는 식(항등식)이면, 양변의 x계수끼리·상수항끼리 같아요`,
        en: `If an equation holds for every x (an identity), the x-coefficients match and the constants match`,
        zh: `如果对任意x都成立(恒等式)，两边x的系数相等，常数项也相等`
      },
      tex: `\\square x + \\square \\equiv ${C}x ${wrapPlus(D)}`,
      answer, answerType: 'number', widget: 'numpad', negative: hasNeg(answer)
    };
  }

  const wide = mode === 'expandWide';
  let p, q;
  do { p = R(rng, 1, wide ? 20 : 9); q = R(rng, 1, wide ? 20 : 9); } while (p === q);
  const a = nzInt(rng, 1, wide ? 15 : 9), b = nzInt(rng, 1, wide ? 15 : 9);
  const C = a + b, D = -a * p - b * q;
  const answer = [a, b];
  return {
    prompt: {
      ko: `좌변을 먼저 전개해 x계수와 상수항을 정리한 뒤, 우변과 비교해요`,
      en: `Expand the left side first to collect the x-coefficient and constant, then compare with the right side`,
      zh: `先展开左边，整理出x的系数和常数项，再和右边比较`
    },
    tex: `\\square(x - ${p}) + \\square(x - ${q}) \\equiv ${C}x ${wrapPlus(D)}`,
    answer, answerType: 'number', widget: 'numpad', negative: hasNeg(answer)
  };
};

/* ── MD24 — 나머지정리 ── P(a)를 직접 계산하면 (x-a)로 나눈 나머지가
   나온다(나눗셈을 다 하지 않고 대입 한 번으로 끝나는 지름길). mode:
   'direct'(이차식 대입) · 'directCubic'(삼차식 대입) · 'findUnknown'
   (나머지가 주어졌을 때 미지 계수 역산, 실전). */
NM_TGEN['md24_remainderTheorem'] = function (params, rng) {
  const mode = params.mode || 'direct';

  if (mode === 'direct') {
    const a = R(rng, 1, 9), b = nzInt(rng, 1, 20), c = nzInt(rng, 1, 20);
    const k = nzInt(rng, 1, 6);
    const value = a * k * k + b * k + c;
    return {
      prompt: {
        ko: `P(x)를 (x-a)로 나눈 나머지는 나눗셈 없이 P(a)만 계산하면 바로 나와요`,
        en: `The remainder of P(x) divided by (x-a) is just P(a) — no division needed`,
        zh: `P(x)除以(x-a)的余数，不用做除法，直接算P(a)就行`
      },
      tex: `P(x) = ${a}x^2 ${wrapPlus(b)}x ${wrapPlus(c)}, \\;\\; P(${k}) = \\square`,
      answer: value, answerType: 'number', widget: 'numpad', negative: value < 0
    };
  }

  if (mode === 'directCubic') {
    const a = R(rng, 1, 6), b = nzInt(rng, 1, 9), c = nzInt(rng, 1, 15), d = nzInt(rng, 1, 15);
    const k = nzInt(rng, 1, 5);
    const value = a * k * k * k + b * k * k + c * k + d;
    return {
      prompt: {
        ko: `삼차식도 같은 원리예요 — 차수가 늘어도 그냥 x자리에 대입만 하면 돼요`,
        en: `Same principle for a cubic — just substitute into the x's, no matter the degree`,
        zh: `三次式也是同样的道理——不管次数多高，直接把数代入x就行`
      },
      tex: `P(x) = ${a}x^3 ${wrapPlus(b)}x^2 ${wrapPlus(c)}x ${wrapPlus(d)}, \\;\\; P(${k}) = \\square`,
      answer: value, answerType: 'number', widget: 'numpad', negative: value < 0
    };
  }

  /* findUnknown — 나머지가 주어졌을 때 계수 역산(실전) */
  const n = R(rng, 2, 6), c0 = nzInt(rng, 1, 15);
  const k = nzInt(rng, 1, 9);
  const remainder = n * n * n + k * n + c0;
  return {
    prompt: {
      ko: `P(n) = 나머지라는 걸 거꾸로 이용해요 — 대입한 값이 나머지와 같아지는 계수를 찾아요`,
      en: `Use the relationship backward — find the coefficient that makes the substituted value equal the given remainder`,
      zh: `反过来用P(n)=余数——找出使代入值等于余数的系数`
    },
    tex: `P(x) = x^3 + \\square x ${wrapPlus(c0)}, \\;\\; P(${n}) = ${remainder}`,
    answer: k, answerType: 'number', widget: 'numpad', negative: k < 0
  };
};

/* ── MD25 — 인수분해 심화(공식 3종) ── 계보5 '자리의 마법' 연장
   (2026-08-25, 작업지시) — 합·차의 세제곱 인수분해는 MD22의 곱셈공식을
   거꾸로 읽는 것이자 분배 구조를 다시 뜯어보는 것이라는 판단. mode:
   'sumCube'(x³+a³) · 'diffCube'(x³-a³) · 'quarticSub'(치환 x²=t로
   사차식을 두 이차식의 곱으로, 실전 — MD20의 p+q=b,pq=c 감각 재사용). */
NM_TGEN['md25_factorAdvanced'] = function (params, rng) {
  const mode = params.mode || 'sumCube';

  if (mode === 'sumCube') {
    const a = R(rng, 1, 80);
    const answer = [a, -a, a * a];
    return {
      prompt: {
        ko: `x³+a³ = (x+a)(x²-ax+a²) — 부호에 주의해서 세 빈칸을 채워요`,
        en: `x³+a³ = (x+a)(x²-ax+a²) — fill in the three blanks, watch the signs`,
        zh: `x³+a³ = (x+a)(x²-ax+a²)——注意符号，填出三个空格`
      },
      tex: `x^3 + ${a * a * a} = (x + \\square)(x^2 + \\square x + \\square)`,
      answer, answerType: 'number', widget: 'numpad', negative: hasNeg(answer)
    };
  }

  if (mode === 'diffCube') {
    const a = R(rng, 1, 80);
    const answer = [a, a, a * a];
    return {
      prompt: {
        ko: `x³-a³ = (x-a)(x²+ax+a²) — 두 빈칸 모두 a가 그대로 들어가요`,
        en: `x³-a³ = (x-a)(x²+ax+a²) — both blanks are simply a`,
        zh: `x³-a³ = (x-a)(x²+ax+a²)——两个空格都直接填a`
      },
      tex: `x^3 - ${a * a * a} = (x - \\square)(x^2 + \\square x + \\square)`,
      answer, answerType: 'number', widget: 'numpad', negative: hasNeg(answer)
    };
  }

  /* quarticSub — t=x² 치환으로 사차식을 두 이차식의 곱으로(실전) */
  let m = nzInt(rng, 1, 10), n = nzInt(rng, 1, 10);
  if (m > n) { const t = m; m = n; n = t; }
  const p = m + n, q = m * n;
  const answer = [m, n];
  return {
    prompt: {
      ko: `x²를 t로 놓고 보면 t²+bt+c 꼴이에요 — 더해서 b, 곱해서 c인 두 수를 찾아요(작은 값부터)`,
      en: `Treat x² as t — it becomes t²+bt+c. Find two numbers that add to b and multiply to c (smaller first)`,
      zh: `把x²看成t，就变成t²+bt+c——找相加得b、相乘得c的两个数(先填较小的)`
    },
    tex: `x^4 ${wrapPlus(p)}x^2 ${wrapPlus(q)} = (x^2 + \\square)(x^2 + \\square)`,
    answer, answerType: 'number', widget: 'numpad', negative: hasNeg(answer)
  };
};

/* ── MD26 — 이차방정식의 판별식 ──
   mode: 'value'(D=b²-4ac 계산) · 'count'(D의 부호로 실근 개수 판정) ·
   'unknownK'(중근 조건 D=0으로 계수 역산, 답은 ±로 묶어 1칸 — \pm
   실사용). */
NM_TGEN['md26_discriminant'] = function (params, rng) {
  const mode = params.mode || 'value';

  if (mode === 'value') {
    const a = R(rng, 1, 9), b = nzInt(rng, 1, 20), c = nzInt(rng, 1, 30);
    const D = b * b - 4 * a * c;
    return {
      prompt: {
        ko: `근을 구하기 전에 판별식 D=b²-4ac부터 계산해요 — 근을 몇 개 가질지 미리 알려주는 정찰병이에요`,
        en: `Before finding the roots, compute the discriminant D=b²-4ac — it scouts ahead and tells you how many roots there are`,
        zh: `求根之前先算判别式D=b²-4ac——它像侦察兵一样提前告诉你有几个根`
      },
      tex: `${a}x^2 ${wrapPlus(b)}x ${wrapPlus(c)} = 0 \\;\\Rightarrow\\; D = \\square`,
      answer: D, answerType: 'number', widget: 'numpad', negative: D < 0
    };
  }

  if (mode === 'count') {
    const caseType = pick(rng, ['pos', 'zero', 'neg']);
    let a, b, c;
    if (caseType === 'zero') {
      a = R(rng, 1, 6); const k = R(rng, 1, 8);
      b = 2 * a * k; c = a * k * k;
    } else {
      let tries = 0, D;
      do {
        a = R(rng, 1, 6); b = nzInt(rng, 1, 15); c = nzInt(rng, 1, 15);
        D = b * b - 4 * a * c; tries++;
      } while (((caseType === 'pos' && D <= 0) || (caseType === 'neg' && D >= 0)) && tries < 200);
    }
    const D = b * b - 4 * a * c;
    const count = D > 0 ? 2 : D === 0 ? 1 : 0;
    return {
      prompt: {
        ko: `D>0이면 서로 다른 두 실근, D=0이면 중근(1개), D<0이면 실근이 없어요`,
        en: `D>0 means two distinct real roots, D=0 means a repeated root (1), D<0 means no real roots`,
        zh: `D>0是两个不同实根，D=0是重根(1个)，D<0则没有实根`
      },
      tex: `${a}x^2 ${wrapPlus(b)}x ${wrapPlus(c)} = 0 \\;\\Rightarrow\\; \\square`,
      answer: count, answerType: 'number', widget: 'numpad'
    };
  }

  /* unknownK — 중근 조건(D=0)으로 계수 역산, 답은 ±로 묶어 1칸 */
  const m = R(rng, 1, 80);
  const q = m * m;
  return {
    prompt: {
      ko: `중근을 가지려면 D=0이에요 — k²=4q가 되는 양수 k를 구하고 ±를 붙여요`,
      en: `A repeated root needs D=0 — find the positive k with k²=4q, then attach ±`,
      zh: `要有重根就要D=0——求出满足k²=4q的正数k，再加上±`
    },
    tex: `x^2 + kx + ${q} = 0 \\;\\Rightarrow\\; k = \\pm\\square`,
    answer: 2 * m, answerType: 'number', widget: 'numpad'
  };
};

/* ── MD27 — 근과 계수의 관계 ── 계보4 '무지개 덧셈법' 연장 검토
   결과: 연장으로 판단(보고서 참조) — 무지개 덧셈법 계보는 이미
   "차가 2인 두 수의 곱 → 평균값 곱셈 → 합차공식"으로 두 수의 합·곱
   구조를 다뤄 왔고, 근과 계수의 관계(α+β=-b/a, αβ=c/a)는 그 구조를
   "임의의 두 수"에서 "방정식의 두 근"으로 일반화하는 자연스러운 다음
   걸음이라 판단했다. mode: 'sumProduct'(a=1, 답[α+β,αβ]) ·
   'sumProductA'(a≠1) · 'sumSquares'(α²+β²=(α+β)²-2αβ 활용, 실전). */
NM_TGEN['md27_rootsSumProduct'] = function (params, rng) {
  const mode = params.mode || 'sumProduct';

  if (mode === 'sumProduct') {
    const b = nzInt(rng, 1, 15), c = nzInt(rng, 1, 30);
    const answer = [-b, c];
    return {
      prompt: {
        ko: `근을 구하지 않아도 α+β=-b, αβ=c — 계수만 보고 바로 알 수 있어요`,
        en: `You don't need the roots themselves: α+β=-b, αβ=c — just read it off the coefficients`,
        zh: `不用求出根：α+β=-b，αβ=c——只看系数就知道`
      },
      tex: `x^2 ${wrapPlus(b)}x ${wrapPlus(c)} = 0 \\;\\Rightarrow\\; \\alpha+\\beta=\\square, \\;\\; \\alpha\\beta=\\square`,
      answer, answerType: 'number', widget: 'numpad', negative: hasNeg(answer)
    };
  }

  if (mode === 'sumProductA') {
    const S = nzInt(rng, 1, 12), P = nzInt(rng, 1, 20);
    const a = R(rng, 2, 6);
    const b = -a * S, c = a * P;
    const answer = [S, P];
    return {
      prompt: {
        ko: `x²의 계수가 1이 아니면 a로 나눠서 α+β=-b/a, αβ=c/a를 써요`,
        en: `When the x² coefficient isn't 1, divide by a: α+β=-b/a, αβ=c/a`,
        zh: `x²的系数不是1时，除以a：α+β=-b/a，αβ=c/a`
      },
      tex: `${a}x^2 ${wrapPlus(b)}x ${wrapPlus(c)} = 0 \\;\\Rightarrow\\; \\alpha+\\beta=\\square, \\;\\; \\alpha\\beta=\\square`,
      answer, answerType: 'number', widget: 'numpad', negative: hasNeg(answer)
    };
  }

  /* sumSquares — α²+β²=(α+β)²-2αβ(실전) */
  const b = nzInt(rng, 1, 12), c = nzInt(rng, 1, 20);
  const S = -b, P = c;
  const target = S * S - 2 * P;
  return {
    prompt: {
      ko: `α²+β²은 (α+β)²-2αβ로 바꿔 써요 — 합과 곱만 알면 이런 식도 바로 구해요`,
      en: `Rewrite α²+β² as (α+β)²-2αβ — knowing just the sum and product unlocks expressions like this`,
      zh: `把α²+β²改写成(α+β)²-2αβ——只要知道和与积，这类式子也能马上求出`
    },
    tex: `x^2 ${wrapPlus(b)}x ${wrapPlus(c)} = 0 \\;\\Rightarrow\\; \\alpha^2+\\beta^2=\\square`,
    answer: target, answerType: 'number', widget: 'numpad', negative: target < 0
  };
};

/* ── MD28 — 근의 공식 ── 답 환원 규약(MASTER-ROADMAP §7): x=(p±√q)/r
   꼴은 [p,q,r] 세 정수로 받는다(근의 공식을 그대로 적용한 값 — MD16의
   근호 정리는 이 유형의 범위 밖, 기약하지 않은 형태 그대로가 정답).
   mode: 'basic'(a=1) · 'general'(a≠1) · 'wide'(더 큰 수, 실전). */
NM_TGEN['md28_quadraticFormula'] = function (params, rng) {
  const mode = params.mode || 'basic';

  function draw(aRange, bRange, cRange){
    let a, b, c, D, tries = 0;
    do {
      a = R(rng, aRange[0], aRange[1]);
      b = nzInt(rng, bRange[0], bRange[1]);
      c = nzInt(rng, cRange[0], cRange[1]);
      D = b * b - 4 * a * c;
      tries++;
    } while ((D <= 0 || isPerfectSquare(D)) && tries < 300);
    return { a, b, c, D };
  }

  const cfg = mode === 'basic' ? { a: [1, 1], b: [2, 12], c: [1, 20] }
    : mode === 'general' ? { a: [2, 6], b: [2, 15], c: [1, 20] }
    : { a: [2, 9], b: [2, 20], c: [1, 30] };  /* wide(실전) */
  const { a, b, c, D } = draw(cfg.a, cfg.b, cfg.c);
  const p = -b, q = D, r = 2 * a;
  const answer = [p, q, r];
  const eqTex = a === 1
    ? `x^2 ${wrapPlus(b)}x ${wrapPlus(c)} = 0`
    : `${a}x^2 ${wrapPlus(b)}x ${wrapPlus(c)} = 0`;
  return {
    prompt: {
      ko: `근의 공식 x=(-b±√(b²-4ac))/(2a)에 그대로 대입해요 — 기약하지 않은 형태 그대로가 답이에요`,
      en: `Plug straight into the quadratic formula x=(-b±√(b²-4ac))/(2a) — the unreduced form is the answer`,
      zh: `直接代入求根公式x=(-b±√(b²-4ac))/(2a)——不用化简，代入后的形式就是答案`
    },
    tex: `${eqTex} \\;\\Rightarrow\\; x = \\dfrac{\\square \\pm \\sqrt{\\square}}{\\square}`,
    answer, answerType: 'number', widget: 'numpad', negative: hasNeg(answer)
  };
};

/* ── MD29 — 이차부등식(해가 두 근 사이) ──
   (x-p)(x-q)<0(또는 ≤0) 꼴의 해는 p<x<q(또는 p≤x≤q) — 두 경계값을
   [p,q](작은 값부터)로 받는다. mode: 'between'(인수분해된 형태) ·
   'expandForm'(전개된 형태, 먼저 인수분해해야 함) · 'withCoeff'
   (x²계수≠1, 실전). */
NM_TGEN['md29_quadIneq'] = function (params, rng) {
  const mode = params.mode || 'between';

  function drawPQ(){
    let p = R(rng, -9, 9), q = R(rng, -9, 9);
    while (p === q) q = R(rng, -9, 9);
    if (p > q) { const t = p; p = q; q = t; }
    return [p, q];
  }
  const [p, q] = drawPQ();
  const sym = pick(rng, ['<', '\\le']);
  const answer = [p, q];

  if (mode === 'between') {
    return {
      prompt: {
        ko: `두 인수의 부호가 다를 때만 곱이 음수가 돼요 — 두 근 사이가 해예요`,
        en: `The product is negative only when the two factors have opposite signs — the solution lies between the two roots`,
        zh: `只有两因式符号相反时乘积才是负——解在两根之间`
      },
      tex: `(x - ${p})(x - ${q}) ${sym} 0 \\;\\Rightarrow\\; \\square ${sym} x ${sym} \\square`,
      answer, answerType: 'number', widget: 'numpad', negative: hasNeg(answer)
    };
  }

  if (mode === 'expandForm') {
    const b = -(p + q), c = p * q;
    return {
      prompt: {
        ko: `먼저 좌변을 인수분해해서 두 근을 찾은 뒤, 그 사이가 해가 돼요`,
        en: `First factor the left side to find the two roots, then the solution is the interval between them`,
        zh: `先把左边因式分解求出两根，解就在两根之间`
      },
      tex: `x^2 ${wrapPlus(b)}x ${wrapPlus(c)} ${sym} 0 \\;\\Rightarrow\\; \\square ${sym} x ${sym} \\square`,
      answer, answerType: 'number', widget: 'numpad', negative: hasNeg(answer)
    };
  }

  /* withCoeff — x²계수≠1(실전) */
  const a = R(rng, 2, 6);
  const b = -a * (p + q), c = a * p * q;
  return {
    prompt: {
      ko: `x²의 계수가 1이 아니어도 먼저 인수분해하면 방법은 똑같아요`,
      en: `Even when the x² coefficient isn't 1, factor first and the method is identical`,
      zh: `即使x²的系数不是1，先因式分解，方法完全一样`
    },
    tex: `${a}x^2 ${wrapPlus(b)}x ${wrapPlus(c)} ${sym} 0 \\;\\Rightarrow\\; \\square ${sym} x ${sym} \\square`,
    answer, answerType: 'number', widget: 'numpad', negative: hasNeg(answer)
  };
};

/* ── MD30 — 행렬의 덧셈·뺄셈·곱셈 ──
   답은 2×2 성분 4개 [a11,a12,a21,a22](행 우선)로 받는다 — 다칸 4개
   인프라 확인용 대표 유형(작업지시). mode: 'addSub' · 'scalarMul' ·
   'matMul'(행렬곱, 실전). */
NM_TGEN['md30_matrix2x2'] = function (params, rng) {
  const mode = params.mode || 'addSub';
  const mk = (lo, hi) => [[nzInt(rng, lo, hi), nzInt(rng, lo, hi)], [nzInt(rng, lo, hi), nzInt(rng, lo, hi)]];

  if (mode === 'addSub') {
    const A = mk(1, 9), B = mk(1, 9);
    const op = pick(rng, ['+', '-']);
    const R2 = [[0, 0], [0, 0]];
    for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) R2[i][j] = op === '+' ? A[i][j] + B[i][j] : A[i][j] - B[i][j];
    const answer = [R2[0][0], R2[0][1], R2[1][0], R2[1][1]];
    return {
      prompt: {
        ko: `행렬의 덧셈·뺄셈은 같은 자리(성분)끼리만 계산해요`,
        en: `Matrix addition/subtraction works entry by entry, same position only`,
        zh: `矩阵加减法只对相同位置(元素)分别运算`
      },
      tex: `${matTex(A)} ${op} ${matTex(B)} = ${BLANK_MAT}`,
      answer, answerType: 'number', widget: 'numpad', negative: hasNeg(answer)
    };
  }

  if (mode === 'scalarMul') {
    const k = R(rng, 2, 6);
    const A = mk(1, 9);
    const answer = [k * A[0][0], k * A[0][1], k * A[1][0], k * A[1][1]];
    return {
      prompt: {
        ko: `스칼라곱은 모든 성분에 그 수를 똑같이 곱해요`,
        en: `A scalar multiple multiplies every single entry by that number`,
        zh: `数乘就是把每个元素都乘以同一个数`
      },
      tex: `${k} ${matTex(A)} = ${BLANK_MAT}`,
      answer, answerType: 'number', widget: 'numpad', negative: hasNeg(answer)
    };
  }

  /* matMul — 행렬곱(실전): 행×열 규칙 */
  const A = mk(1, 5), B = mk(1, 5);
  const r11 = A[0][0] * B[0][0] + A[0][1] * B[1][0];
  const r12 = A[0][0] * B[0][1] + A[0][1] * B[1][1];
  const r21 = A[1][0] * B[0][0] + A[1][1] * B[1][0];
  const r22 = A[1][0] * B[0][1] + A[1][1] * B[1][1];
  const answer = [r11, r12, r21, r22];
  return {
    prompt: {
      ko: `행렬곱은 앞 행렬의 행과 뒤 행렬의 열을 하나씩 짝지어 곱하고 더해요`,
      en: `Matrix multiplication pairs each row of the first with each column of the second, multiplies, and adds`,
      zh: `矩阵乘法把前者的行与后者的列逐个配对相乘再相加`
    },
    tex: `${matTex(A)} \\times ${matTex(B)} = ${BLANK_MAT}`,
    answer, answerType: 'number', widget: 'numpad', negative: hasNeg(answer)
  };
};

if (typeof module !== 'undefined' && module.exports) module.exports = NM_TGEN;
})();
