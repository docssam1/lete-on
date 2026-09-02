/* ============================================================
   Numbers of Magic — MD(중등 W8 · 중1 정수와 유리수) 스레드 생성기
   근거: MASTER-ROADMAP.md §5(중1 W8) + 중등연산-목차.md(G03~G25, 정수와
   유리수 사칙연산·거듭제곱만 다루는 실측 목차) — 문자와 식·일차방정식·
   정비례반비례는 G목차에 없어 이번 배치 범위 밖(다음 세션).
   계약: NM_TGEN[genKey] = function(params, rng) { return problem; }
   절대 Math.random() 사용 금지 — R(rng,a,b) / pick(rng,arr) / shuffle(rng,arr)만.
   답 환원 원칙(MASTER-ROADMAP §7): 모든 답은 정수 몇 개(또는 분수 페어
   [분자,분모])로 받는다 — 문자식·근호식 문자열 입력 없음.
   음수 답은 반드시 problem.negative=true (또는 배열 정답이면 동일하게
   negative:true) — steps의 개별 blank는 s.blank<0이면 위젯이 자동으로
   마이너스 키를 켜주지만, 최종 numpad(단일 또는 다칸) 값은 자동 감지가
   없어 명시적으로 켜야 한다(app/widgets.js, app/main.js 둘 다 동일 계약).
   ============================================================ */
(function(){
'use strict';

const { R, pick } = NM_RNG;

/* ── 공용 헬퍼 ── */
function nzMag(rng, lo, hi){ return R(rng, lo, hi); }              /* 항상 양의 크기(lo>=1) */
function signOf(rng){ return pick(rng, [1, -1]); }
function gcd(a, b){ a = Math.abs(a); b = Math.abs(b); while(b){ [a, b] = [b, a % b]; } return a || 1; }
function lcm(a, b){ return Math.abs(a * b) / gcd(a, b); }
/* 분수를 분모>0으로 정규화(부호는 분자로 몰아줌) — CH5 등 기존 관례(약분은 안 함) 유지 */
/* 분수 답 정규화 — 부호를 분자로 몰고 기약분수로 줄인다.
   약분 정책(2026-08-29 원장): 4학년까지는 약분하지 않은 값, 5학년부터는 기약분수가
   정답이다. 이 파일의 MD3·MD7은 중1 과정이라 기약분수가 정답이어야 하는데
   예전엔 부호만 정리하고 약분을 안 해 4/4·(-12)/30 같은 답이 정답키로 나갔다.
   normFrac을 쓰는 곳은 MD3·MD7뿐이라 여기서 한 번에 처리한다. */
function normFrac(n, d){
  if(d < 0){ n = -n; d = -d; }
  const g = gcd(n, d);
  return [n / g, d / g];
}
function divisorsOf(n){
  n = Math.abs(n);
  const out = [];
  for(let k = 1; k <= n; k++) if(n % k === 0) out.push(k);
  return out;
}
/* 부호 있는 수를 다른 연산자 옆에 그대로 찍으면 "4 + -5"나 "20 - -7"처럼
   부호 두 개가 붙어 읽기 힘들어진다(교재는 항상 괄호로 묶어 "(-5)"로 쓴다).
   음수만 괄호로 감싸 그 문제를 없앤다 — 양수는 그대로. */
function wrapSigned(x){ return x < 0 ? `(${x})` : String(x); }

/* ── MD1 — 정수 개념·수직선 (G03·G05: 절댓값·대소 비교·수직선 위 거리) ──
   mode: 'abs'(절댓값) · 'compare'(대소 비교) · 'distance'(수직선 위 두 점 거리).
   compare는 결과 자체가 음수일 수 있어 problem.negative가 필요, abs·distance는
   항상 0 이상이라 필요 없다. */
NM_TGEN['md1_intConcept'] = function (params, rng) {
  const mode = params.mode || 'abs';

  if (mode === 'abs') {
    const lv = params.level || 'main';
    const mag = lv === 'practice' ? nzMag(rng, 1, 40) : nzMag(rng, 10, 99);
    const a = signOf(rng) * mag;
    return {
      prompt: {
        ko: `|${a}|의 값을 구해요 — 절댓값은 원점(0)에서 그 수까지의 거리예요`,
        en: `Find |${a}| — absolute value is the distance from 0 to that number`,
        zh: `求|${a}|——绝对值是这个数到原点(0)的距离`
      },
      tex: `|${a}| = \\square`,
      answer: mag, answerType: 'number', widget: 'numpad'
    };
  }

  if (mode === 'compare') {
    let a, b;
    do { a = R(rng, -50, 50); b = R(rng, -50, 50); } while (a === b);
    const askMax = pick(rng, [true, false]);
    const answer = askMax ? Math.max(a, b) : Math.min(a, b);
    return {
      prompt: {
        ko: `${a}와 ${b} 중 ${askMax ? '더 큰' : '더 작은'} 수는 무엇일까요?`,
        en: `Which is ${askMax ? 'greater' : 'smaller'}, ${a} or ${b}?`,
        zh: `${a}和${b}中，哪个${askMax ? '更大' : '更小'}？`
      },
      tex: `${askMax ? '\\max' : '\\min'}(${a},\\,${b}) = \\square`,
      answer, answerType: 'number', widget: 'numpad', negative: answer < 0
    };
  }

  /* distance — 수직선 위 두 점 사이 칸 수(|a-b|) : G05의 수직선 접근 예고 */
  let a, b;
  do { a = R(rng, -50, 50); b = R(rng, -50, 50); } while (a === b);
  const dist = Math.abs(a - b);
  return {
    prompt: {
      ko: `수직선 위에서 ${a}와 ${b} 사이는 몇 칸 떨어져 있을까요?`,
      en: `On the number line, how many steps apart are ${a} and ${b}?`,
      zh: `在数轴上，${a}和${b}相距几格？`
    },
    tex: `|${a} - (${b})| = \\square`,
    answer: dist, answerType: 'number', widget: 'numpad'
  };
};

/* ── MD2 — 정수의 덧셈과 뺄셈 (G04·G06·G07·G12) ──
   mode: 'same'(같은 부호) · 'diff'(다른 부호) · 'brackets'(괄호 풀기) ·
   'chain3'(세 정수 혼합, 앞에서부터 차례로). steps의 blank는 규칙 그대로
   드러나도록 절댓값 계산을 먼저 보여준다. */
NM_TGEN['md2_intAddSub'] = function (params, rng) {
  const mode = params.mode || 'same';
  const lv = params.level || 'main';
  const mag = () => lv === 'practice' ? nzMag(rng, 1, 20) : nzMag(rng, 10, 50);

  if (mode === 'same') {
    const s = signOf(rng);
    const ma = mag(), mb = mag();
    const a = s * ma, b = s * mb;
    const absSum = ma + mb;
    const sum = a + b;
    const wa = wrapSigned(a), wb = wrapSigned(b);
    return {
      prompt: {
        ko: `${wa} + ${wb}: 부호가 같은 두 수의 덧셈이에요 — 절댓값끼리 더하고 공통 부호를 붙여요`,
        en: `${wa} + ${wb}: same-sign addition — add the absolute values, keep the shared sign`,
        zh: `${wa} + ${wb}：同号相加——先加绝对值，再带上共同的符号`
      },
      tex: `${wa} + ${wb} = \\square`,
      answer: sum, answerType: 'steps', widget: 'steps',
      steps: [
        { tex: `|${a}| + |${b}| = \\square`, blank: absSum },
        { tex: `${wa} + ${wb} = \\square`, blank: sum }
      ]
    };
  }

  if (mode === 'diff') {
    const ma = mag(), mb = mag();
    const s = signOf(rng);
    const a = s * ma, b = -s * mb;
    const diff = Math.abs(ma - mb);
    const sum = a + b;
    const wa = wrapSigned(a), wb = wrapSigned(b);
    return {
      prompt: {
        ko: `${wa} + ${wb}: 부호가 다른 두 수의 덧셈이에요 — 절댓값의 차에 절댓값이 큰 쪽 부호를 붙여요`,
        en: `${wa} + ${wb}: different-sign addition — subtract the absolute values, keep the sign of the larger one`,
        zh: `${wa} + ${wb}：异号相加——用绝对值的差，符号跟绝对值大的那个数一致`
      },
      tex: `${wa} + ${wb} = \\square`,
      answer: sum, answerType: 'steps', widget: 'steps',
      steps: [
        { tex: `|${a}| - |${b}| = \\square \\;(\\text{절댓값 차})`, blank: diff },
        { tex: `${wa} + ${wb} = \\square`, blank: sum }
      ]
    };
  }

  if (mode === 'brackets') {
    /* G06·G07: 괄호가 있는 정수의 덧뺄셈 — 괄호를 풀어서(빼는 수의 부호를
       바꾸어 덧셈으로) 계산하는 것이 편리하다는 규칙을 그대로 스텝으로. */
    const op = pick(rng, ['+', '-']);
    const x = signOf(rng) * mag();
    const y = signOf(rng) * mag();
    const flipped = op === '+' ? y : -y;
    const answer = x + flipped;
    return {
      prompt: {
        ko: `${x} ${op} (${y}): 괄호를 풀어서 덧셈으로 바꿔 계산해요`,
        en: `${x} ${op} (${y}): open the brackets and turn it into addition`,
        zh: `${x} ${op} (${y})：把括号打开，变成加法来算`
      },
      tex: `${x} ${op} (${y}) = \\square`,
      answer, answerType: 'steps', widget: 'steps',
      steps: [
        { tex: `${x} ${op} (${y}) = ${x} + \\square`, blank: flipped },
        { tex: `${x} + (${flipped}) = \\square`, blank: answer }
      ]
    };
  }

  /* chain3 — G12: 세 정수의 덧셈과 뺄셈 혼합, 앞에서부터 차례로 */
  const m1 = mag(), m2 = mag(), m3 = mag();
  const op1 = pick(rng, ['+', '-']);
  const op2 = pick(rng, ['+', '-']);
  const step1 = op1 === '+' ? m1 + m2 : m1 - m2;
  const answer = op2 === '+' ? step1 + m3 : step1 - m3;
  return {
    prompt: {
      ko: `${m1} ${op1} ${m2} ${op2} ${m3}: 세 수의 덧뺄셈은 앞에서부터 차례로 계산해요`,
      en: `${m1} ${op1} ${m2} ${op2} ${m3}: solve three-number ± left to right`,
      zh: `${m1} ${op1} ${m2} ${op2} ${m3}：三个数的加减法从左往右依次计算`
    },
    tex: `${m1} ${op1} ${m2} ${op2} ${m3} = \\square`,
    answer, answerType: 'steps', widget: 'steps',
    steps: [
      { tex: `${m1} ${op1} ${m2} = \\square`, blank: step1 },
      { tex: `${step1} ${op2} ${m3} = \\square`, blank: answer }
    ]
  };
};

/* ── MD3 — 유리수의 덧셈과 뺄셈 (G08·G10·G11·G13~G15: 통분) ──
   답은 항상 [분자,분모] 페어(answerShape:'fraction', 약분 안 함 — CH5와
   같은 관례). mode: 'sameDenom' · 'diffDenom'(통분) · 'chain3'(세 유리수 혼합). */
NM_TGEN['md3_ratAddSub'] = function (params, rng) {
  const mode = params.mode || 'sameDenom';
  const DENOMS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 12];

  if (mode === 'sameDenom') {
    const d = pick(rng, DENOMS);
    const a1 = signOf(rng) * R(rng, 1, d - 1);
    const a2 = signOf(rng) * R(rng, 1, d - 1);
    const [n, den] = normFrac(a1 + a2, d);
    return {
      prompt: {
        ko: `분모가 같으면 정수처럼 분자끼리만 계산해요`,
        en: `Same denominator — just combine the numerators, like integers`,
        zh: `分母相同——像整数一样只算分子'`
      },
      tex: `\\dfrac{${a1}}{${d}} + \\dfrac{${a2}}{${d}} = \\square`,
      answer: [n, den], answerShape: 'fraction', answerType: 'number', widget: 'numpad',
      negative: (a1 + a2) < 0
    };
  }

  if (mode === 'diffDenom') {
    let d1 = pick(rng, DENOMS), d2;
    do { d2 = pick(rng, DENOMS); } while (d2 === d1);
    const LCD = lcm(d1, d2);
    const a1 = signOf(rng) * R(rng, 1, d1 - 1);
    const a2 = signOf(rng) * R(rng, 1, d2 - 1);
    const conv1 = a1 * (LCD / d1);
    const conv2 = a2 * (LCD / d2);
    const [n, den] = normFrac(conv1 + conv2, LCD);
    return {
      prompt: {
        ko: `분모가 다르면 분모의 최소공배수로 통분한 뒤 더해요 (LCM=${LCD})`,
        en: `Different denominators — convert to the LCM first, then add (LCM=${LCD})`,
        zh: `分母不同——先通分到最小公倍数再相加(LCM=${LCD})`
      },
      tex: `\\dfrac{${a1}}{${d1}} + \\dfrac{${a2}}{${d2}} = \\square`,
      answer: [n, den], answerShape: 'fraction', answerType: 'number', widget: 'numpad',
      negative: (conv1 + conv2) < 0
    };
  }

  /* chain3 — G13~G15: 분모가 다른 세 유리수의 덧뺄셈 혼합 */
  const ds = [pick(rng, DENOMS), pick(rng, DENOMS), pick(rng, DENOMS)];
  const LCD = ds.reduce((acc, d) => lcm(acc, d), 1);
  const terms = ds.map(d => signOf(rng) * R(rng, 1, d - 1));
  const convs = terms.map((a, i) => a * (LCD / ds[i]));
  const sumNum = convs.reduce((a, b) => a + b, 0);
  const [n, den] = normFrac(sumNum, LCD);
  const exprTex = terms.map((a, i) => (i === 0 ? `\\dfrac{${a}}{${ds[i]}}` : ` + \\dfrac{${a}}{${ds[i]}}`)).join('');
  return {
    prompt: {
      ko: `세 유리수의 덧뺄셈 혼합이에요. 분모의 최소공배수로 통분한 뒤 앞에서부터 계산해요 (LCM=${LCD})`,
      en: `Mixed addition of three rational numbers — convert to the LCM, then combine left to right (LCM=${LCD})`,
      zh: `三个有理数的混合加减——先通分到最小公倍数，再从左到右计算(LCM=${LCD})`
    },
    tex: `${exprTex} = \\square`,
    answer: [n, den], answerShape: 'fraction', answerType: 'number', widget: 'numpad',
    negative: sumNum < 0
  };
};

/* ── MD4 — 정수·유리수의 곱셈과 나눗셈 (G16·G17·G18: 부호 결정) ──
   mode: 'mul2' · 'div2' · 'mulChain'(3~4개, 음수 개수 홀짝) ·
   'mixedChain'(곱셈·나눗셈 혼합, 앞에서부터). 규칙("음수 개수가 짝이면 +,
   홀이면 -")을 steps 첫 칸에 그대로 노출. */
NM_TGEN['md4_intMulDiv'] = function (params, rng) {
  const mode = params.mode || 'mul2';
  const lv = params.level || 'main';
  const mag = (hi) => nzMag(rng, 2, lv === 'practice' ? Math.min(hi, 12) : hi);

  if (mode === 'mul2') {
    const a = signOf(rng) * mag(30), b = signOf(rng) * mag(30);
    const negCount = (a < 0 ? 1 : 0) + (b < 0 ? 1 : 0);
    const absProduct = Math.abs(a) * Math.abs(b);
    const product = a * b;
    return {
      prompt: {
        ko: `${a} × ${wrapSigned(b)}: 곱의 부호를 먼저 정하고 절댓값끼리 곱해요`,
        en: `${a} × ${b}: decide the sign of the product first, then multiply the absolute values`,
        zh: `${a} × ${b}：先确定积的符号，再把绝对值相乘`
      },
      tex: `${a} \\times ${wrapSigned(b)} = \\square`,
      answer: product, answerType: 'steps', widget: 'steps',
      steps: [
        { tex: `\\text{음수 개수}: \\square`, blank: negCount },
        { tex: `|${a}| \\times |${b}| = \\square`, blank: absProduct },
        { tex: `${a} \\times ${wrapSigned(b)} = \\square`, blank: product }
      ]
    };
  }

  if (mode === 'div2') {
    const b = signOf(rng) * mag(12);
    const q = signOf(rng) * mag(12);
    const a = b * q;
    const negCount = (a < 0 ? 1 : 0) + (b < 0 ? 1 : 0);
    return {
      prompt: {
        ko: `${a} ÷ ${wrapSigned(b)}: 몫의 부호를 먼저 정하고 절댓값끼리 나눠요`,
        en: `${a} ÷ ${b}: decide the sign of the quotient first, then divide the absolute values`,
        zh: `${a} ÷ ${b}：先确定商的符号，再把绝对值相除`
      },
      tex: `${a} \\div ${wrapSigned(b)} = \\square`,
      answer: q, answerType: 'steps', widget: 'steps',
      steps: [
        { tex: `\\text{음수 개수}: \\square`, blank: negCount },
        { tex: `|${a}| \\div |${b}| = \\square`, blank: Math.abs(q) },
        { tex: `${a} \\div ${wrapSigned(b)} = \\square`, blank: q }
      ]
    };
  }

  if (mode === 'mulChain') {
    const n = lv === 'practice' ? 3 : R(rng, 3, 4);
    const factors = [];
    for (let i = 0; i < n; i++) factors.push(signOf(rng) * mag(15));
    const negCount = factors.filter(f => f < 0).length;
    const absProduct = factors.reduce((p, f) => p * Math.abs(f), 1);
    const product = factors.reduce((p, f) => p * f, 1);
    const exprTex = factors.map((f,i) => i ? wrapSigned(f) : String(f)).join(' \\times ');
    const absTex = factors.map(f => `|${f}|`).join(' \\times ');
    return {
      prompt: {
        ko: `세 개 이상의 정수의 곱셈 — 음수가 짝수 개면 +, 홀수 개면 -예요`,
        en: `Multiplying three or more integers — an even count of negatives gives +, odd gives -`,
        zh: `三个以上整数相乘——负数个数为偶数得正，为奇数得负`
      },
      tex: `${exprTex} = \\square`,
      answer: product, answerType: 'steps', widget: 'steps',
      steps: [
        { tex: `\\text{음수 개수}: \\square`, blank: negCount },
        { tex: `${absTex} = \\square`, blank: absProduct },
        { tex: `${exprTex} = \\square`, blank: product }
      ]
    };
  }

  /* mixedChain — G18: 곱셈과 나눗셈 혼합, 앞에서부터 차례로 */
  const shape = pick(rng, ['ab_div_c', 'a_div_b_c']);
  if (shape === 'a_div_b_c') {
    const b = signOf(rng) * mag(9);
    const q1 = signOf(rng) * mag(9);
    const a = b * q1;
    const c = signOf(rng) * mag(9);
    const answer = q1 * c;
    return {
      prompt: {
        ko: `${a} \\div ${b} \\times ${c}: 곱셈·나눗셈 혼합은 앞에서부터 차례로 계산해요`,
        en: `${a} ÷ ${b} × ${c}: mixed × and ÷ — work left to right`,
        zh: `${a} ÷ ${b} × ${c}：乘除混合运算从左到右依次计算`
      },
      tex: `${a} \\div ${wrapSigned(b)} \\times ${wrapSigned(c)} = \\square`,
      answer, answerType: 'steps', widget: 'steps',
      steps: [
        { tex: `${a} \\div ${wrapSigned(b)} = \\square`, blank: q1 },
        { tex: `${q1} \\times ${wrapSigned(c)} = \\square`, blank: answer }
      ]
    };
  }
  const a = signOf(rng) * mag(9), b = signOf(rng) * mag(9);
  const interim = a * b;
  const divisors = divisorsOf(interim).filter(d => d >= 2);
  const cMag = divisors.length ? pick(rng, divisors) : 1;
  const c = signOf(rng) * cMag;
  const answer = interim / c;
  return {
    prompt: {
      ko: `${a} \\times ${b} \\div ${c}: 곱셈·나눗셈 혼합은 앞에서부터 차례로 계산해요`,
      en: `${a} × ${b} ÷ ${c}: mixed × and ÷ — work left to right`,
      zh: `${a} × ${b} ÷ ${c}：乘除混合运算从左到右依次计算`
    },
    tex: `${a} \\times ${wrapSigned(b)} \\div ${wrapSigned(c)} = \\square`,
    answer, answerType: 'steps', widget: 'steps',
    steps: [
      { tex: `${a} \\times ${wrapSigned(b)} = \\square`, blank: interim },
      { tex: `${interim} \\div ${wrapSigned(c)} = \\square`, blank: answer }
    ]
  };
};

/* ── MD5 — 거듭제곱과 부호 (G19) ──
   (-a)^n(밑에 괄호) vs -a^n(지수가 밑보다 우선, -(a^n))의 차이를 정확히
   구분한다 — 짝수 지수에서만 값이 갈린다((-2)^4=16, -2^4=-16), 홀수
   지수는 둘 다 음수로 같다((-2)^3=-8=-2^3). mode: 'paren' · 'bare' · 'mixed'. */
NM_TGEN['md5_signedPower'] = function (params, rng) {
  const mode = params.mode || 'mixed';
  const form = mode === 'mixed' ? pick(rng, ['paren', 'bare']) : mode;
  const a = R(rng, 2, 30);
  const n = R(rng, 2, 4);

  if (form === 'paren') {
    /* (-a)^n = (-a)×(-a)×…×(-a) — 반복 곱셈을 그대로 스텝으로 노출 */
    const steps = [];
    let prod = -a;
    for (let i = 1; i < n; i++) {
      const next = prod * (-a);
      steps.push({ tex: `${prod} \\times (${-a}) = \\square`, blank: next });
      prod = next;
    }
    const answer = prod;
    return {
      prompt: {
        ko: `(-${a})^{${n}}: 밑이 통째로 괄호 안에 있어요 — (-${a})를 ${n}번 곱해요`,
        en: `(-${a})^${n}: the base itself is negative — multiply (-${a}) by itself ${n} times`,
        zh: `(-${a})^{${n}}：整个底数都在括号里——把(-${a})连乘${n}次`
      },
      tex: `(-${a})^{${n}} = \\square`,
      answer, answerType: 'steps', widget: 'steps', steps
    };
  }

  /* bare — -a^n = -(a^n): 지수가 a에만 걸리고, 맨 앞 -는 마지막에 붙는다 */
  const pw = Math.pow(a, n);
  const answer = -pw;
  return {
    prompt: {
      ko: `-${a}^{${n}}: 지수는 ${a}에만 걸려요 — ${a}^{${n}}을 먼저 구하고 마지막에 -를 붙여요`,
      en: `-${a}^${n}: the exponent applies only to ${a} — find ${a}^${n} first, then attach the minus sign`,
      zh: `-${a}^{${n}}：指数只作用于${a}——先求${a}^{${n}}，最后再加负号`
    },
    tex: `-${a}^{${n}} = \\square`,
    answer, answerType: 'steps', widget: 'steps',
    steps: [
      { tex: `${a}^{${n}} = \\square`, blank: pw },
      { tex: `-${pw} = \\square`, blank: answer }
    ]
  };
};

/* ── MD6 — 정수의 사칙 혼합 계산 (G18 확장: +-×÷ 전체 혼합·괄호) ──
   mode: 'noBrackets' · 'brackets' · 'withDivChain'. MD2(덧뺄만)·MD4(곱나눗만)와
   달리 네 연산이 한 문제에 다 섞인다 — 곱셈·나눗셈을 먼저, 괄호를 더 먼저. */
NM_TGEN['md6_intMixed'] = function (params, rng) {
  const mode = params.mode || 'noBrackets';
  const lv = params.level || 'main';
  const mag = (hi) => nzMag(rng, 2, lv === 'practice' ? Math.min(hi, 9) : hi);

  if (mode === 'noBrackets') {
    /* a + b×c (부호 있는 a,b,c) */
    const a = signOf(rng) * mag(20);
    const b = signOf(rng) * mag(9);
    const c = signOf(rng) * mag(9);
    const bc = b * c;
    const answer = a + bc;
    return {
      prompt: {
        ko: `${a} + ${b} \\times ${c}: 괄호가 없으면 곱셈을 먼저 계산해요`,
        en: `${a} + ${b} × ${c}: no brackets — multiply first`,
        zh: `${a} + ${b} × ${c}：没有括号先算乘法`
      },
      tex: `${a} + ${wrapSigned(b)} \\times ${wrapSigned(c)} = \\square`,
      answer, answerType: 'steps', widget: 'steps',
      steps: [
        { tex: `${wrapSigned(b)} \\times ${wrapSigned(c)} = \\square \\;(\\text{먼저!})`, blank: bc },
        { tex: `${a} + ${wrapSigned(bc)} = \\square`, blank: answer }
      ]
    };
  }

  if (mode === 'brackets') {
    /* (a+b)×c − d (부호 있는 a,b,c,d) — 괄호가 연산 순서를 바꾼다 */
    const a = signOf(rng) * mag(15);
    const b = signOf(rng) * mag(15);
    const c = signOf(rng) * mag(9);
    const d = signOf(rng) * mag(20);
    const ab = a + b;
    const abc = ab * c;
    const answer = abc - d;
    const wa = wrapSigned(a), wb = wrapSigned(b), wc = wrapSigned(c), wd = wrapSigned(d);
    return {
      prompt: {
        ko: `(${wa}+${wb}) \\times ${wc} - ${wd}: 괄호 안을 가장 먼저, 그다음 곱셈, 마지막 뺄셈`,
        en: `(${wa}+${wb}) × ${wc} - ${wd}: brackets first, then multiply, then subtract`,
        zh: `(${wa}+${wb}) × ${wc} - ${wd}：先算括号，再乘法，最后减法`
      },
      tex: `(${wa} + ${wb}) \\times ${wc} - ${wd} = \\square`,
      answer, answerType: 'steps', widget: 'steps',
      steps: [
        { tex: `${wa} + ${wb} = \\square \\;(\\text{괄호 먼저})`, blank: ab },
        { tex: `${ab} \\times ${wc} = \\square`, blank: abc },
        { tex: `${abc} - ${wd} = \\square`, blank: answer }
      ]
    };
  }

  /* withDivChain — a + b×c÷d (나눗셈 포함 사칙 혼합, d는 b×c의 약수) */
  const a = signOf(rng) * mag(20);
  const b = signOf(rng) * mag(9);
  const c = signOf(rng) * mag(9);
  const bc = b * c;
  const divisors = divisorsOf(bc).filter(x => x >= 2);
  const dMag = divisors.length ? pick(rng, divisors) : 1;
  const d = signOf(rng) * dMag;
  const bcd = bc / d;
  const answer = a + bcd;
  return {
    prompt: {
      ko: `${a} + ${b} \\times ${c} \\div ${d}: 곱셈·나눗셈을 먼저 앞에서부터, 그다음 덧셈`,
      en: `${a} + ${b} × ${c} ÷ ${d}: do × and ÷ first (left to right), then add`,
      zh: `${a} + ${b} × ${c} ÷ ${d}：先从左到右做乘除法，再做加法`
    },
    tex: `${a} + ${wrapSigned(b)} \\times ${wrapSigned(c)} \\div ${wrapSigned(d)} = \\square`,
    answer, answerType: 'steps', widget: 'steps',
    steps: [
      { tex: `${wrapSigned(b)} \\times ${wrapSigned(c)} = \\square`, blank: bc },
      { tex: `${wrapSigned(bc)} \\div ${wrapSigned(d)} = \\square`, blank: bcd },
      { tex: `${a} + ${wrapSigned(bcd)} = \\square`, blank: answer }
    ]
  };
};

/* ── MD7 — 유리수의 곱셈과 나눗셈 (G20~G25) ──
   답은 [분자,분모] 페어(약분 안 함). mode: 'mul' · 'div'(역수) · 'mixedChain'. */
NM_TGEN['md7_ratMulDiv'] = function (params, rng) {
  const mode = params.mode || 'mul';
  const DENOMS = [2, 3, 4, 5, 6, 7, 8, 9];

  if (mode === 'mul') {
    const d1 = pick(rng, DENOMS), d2 = pick(rng, DENOMS);
    const a1 = signOf(rng) * R(rng, 1, d1 - 1);
    const a2 = signOf(rng) * R(rng, 1, d2 - 1);
    const [n, den] = normFrac(a1 * a2, d1 * d2);
    return {
      prompt: {
        ko: `유리수의 곱셈은 곱의 부호를 먼저 정한 뒤, 분자는 분자끼리 분모는 분모끼리 곱해요`,
        en: `Multiplying rationals: decide the sign first, then multiply numerators and denominators separately`,
        zh: `有理数乘法：先确定积的符号，再分子乘分子、分母乘分母`
      },
      tex: `\\dfrac{${a1}}{${d1}} \\times \\dfrac{${a2}}{${d2}} = \\square`,
      answer: [n, den], answerShape: 'fraction', answerType: 'number', widget: 'numpad',
      negative: (a1 * a2) < 0
    };
  }

  if (mode === 'div') {
    const d1 = pick(rng, DENOMS), d2 = pick(rng, DENOMS);
    const a1 = signOf(rng) * R(rng, 1, d1 - 1);
    let a2; do { a2 = signOf(rng) * R(rng, 1, d2 - 1); } while (a2 === 0);
    /* a1/d1 ÷ a2/d2 = a1/d1 × d2/a2 (나누는 수의 역수) */
    const [n, den] = normFrac(a1 * d2, d1 * a2);
    return {
      prompt: {
        ko: `나눗셈은 나누는 수의 역수를 곱해요: \\dfrac{${a2}}{${d2}}의 역수는 \\dfrac{${d2}}{${a2}}`,
        en: `Division = multiply by the reciprocal of the divisor: the reciprocal of ${a2}/${d2} is ${d2}/${a2}`,
        zh: `除法＝乘以除数的倒数：${a2}/${d2}的倒数是${d2}/${a2}`
      },
      tex: `\\dfrac{${a1}}{${d1}} \\div \\dfrac{${a2}}{${d2}} = \\square`,
      answer: [n, den], answerShape: 'fraction', answerType: 'number', widget: 'numpad',
      negative: (a1 * d2 * (d1 * a2)) < 0
    };
  }

  /* mixedChain — G24·G25: 곱셈·나눗셈 혼합, 음수 개수로 부호 먼저 결정 */
  const d1 = pick(rng, DENOMS), d2 = pick(rng, DENOMS), d3 = pick(rng, DENOMS);
  const a1 = signOf(rng) * R(rng, 1, d1 - 1);
  const a2 = signOf(rng) * R(rng, 1, d2 - 1);
  let a3; do { a3 = signOf(rng) * R(rng, 1, d3 - 1); } while (a3 === 0);
  const op2 = pick(rng, ['\\times', '\\div']);
  /* a1/d1 × a2/d2 (×) a3/d3  또는 (÷, 즉 ×역수) */
  let num = a1 * a2, den = d1 * d2;
  if (op2 === '\\times') { num = num * a3; den = den * d3; }
  else { num = num * d3; den = den * a3; }
  const [n, dd] = normFrac(num, den);
  return {
    prompt: {
      ko: `세 유리수의 곱셈·나눗셈 혼합 — 음수 개수로 부호를 먼저 정하고, 나눗셈은 역수의 곱셈으로 바꿔요`,
      en: `Mixed × and ÷ of three rationals — count negatives for the sign first, turn ÷ into × by the reciprocal`,
      zh: `三个有理数的乘除混合——先用负数个数定符号，除法换成乘倒数'`
    },
    tex: `\\dfrac{${a1}}{${d1}} \\times \\dfrac{${a2}}{${d2}} ${op2} \\dfrac{${a3}}{${d3}} = \\square`,
    answer: [n, dd], answerShape: 'fraction', answerType: 'number', widget: 'numpad',
    negative: n < 0   /* den(=d1*d2*(op2==='÷'?a3:d3))이 ÷일 때 a3의 부호를 타고 음수가 될 수
                          있어 normFrac()이 부호를 뒤집을 수 있다 — 정규화 이후 값 n을 봐야 한다 */
  };
};

/* ── MD8 — 유한소수 판별 (과정-로드맵.md §6 계보1 '2와 5는 친구'의 종착) ──
   기약분수로 약분했을 때 분모의 소인수가 2와 5뿐이면 유한소수(답 1),
   그 외의 소인수가 하나라도 있으면 순환소수(답 0). level:'reduced'(이미
   기약분수) · 'unreduced'(약분해야 진짜 분모가 드러남 — 더 어려움). */
NM_TGEN['md8_terminating'] = function (params, rng) {
  const lv = params.level || 'reduced';
  const willTerminate = pick(rng, [true, false]);

  let redDen;
  if (willTerminate) {
    const p = R(rng, 0, 3), q = R(rng, 0, 3);
    redDen = Math.pow(2, p) * Math.pow(5, q);
    if (redDen === 1) redDen = pick(rng, [2, 5]);
  } else {
    const other = pick(rng, [3, 7, 9, 11, 13]);
    const withTwoFive = pick(rng, [true, false]);
    redDen = withTwoFive ? other * pick(rng, [2, 4, 5, 10]) : other;
  }

  let num;
  do { num = R(rng, 1, redDen - 1); } while (gcd(num, redDen) !== 1);

  let dispNum = num, dispDen = redDen;
  if (lv === 'unreduced') {
    const k = R(rng, 2, 5);
    dispNum = num * k; dispDen = redDen * k;
  }

  const answer = willTerminate ? 1 : 0;
  return {
    prompt: {
      ko: `\\dfrac{${dispNum}}{${dispDen}}를 소수로 나타내면 유한소수일까요? 유한소수면 1, 순환소수(무한소수)면 0을 눌러요`,
      en: `Does ${dispNum}/${dispDen} become a terminating decimal? Press 1 if terminating, 0 if repeating`,
      zh: `${dispNum}/${dispDen}化成小数是有限小数吗？有限小数按1，循环小数按0`
    },
    tex: `\\dfrac{${dispNum}}{${dispDen}} \\;\\Rightarrow\\; \\square \\;(1=\\text{유한},\\,0=\\text{순환})`,
    answer, answerType: 'number', widget: 'numpad'
  };
};

/* ── MD9 — 순환소수 → 분수 (섞인 순환소수, CH5와 차별화) ──
   CH5(adv_repeatDec.toFraction)는 처음부터 반복되는 0.\overline{R} 만 다룬다.
   여기는 반복 전 자리(비순환부, k자리)가 있는 중2 표준형 0.P\overline{R}까지
   일반화한다 — 공식: 분자 = "P뒤에 R을 이어붙인 수" - P, 분모 = 10^k×(10^m-1).
   (예: 0.41\overline{6} → 416-41=375, 100×9=900 → 375/900 = 5/12) */
NM_TGEN['md9_repeatToFrac'] = function (params, rng) {
  const k = params.k != null ? params.k : 1;   /* 비순환부 자리 수 */
  const m = params.m != null ? params.m : 1;   /* 순환마디 자리 수 */

  const P = R(rng, 0, Math.pow(10, k) - 1);
  const R_ = R(rng, 1, Math.pow(10, m) - 1);
  const Ppad = String(P).padStart(k, '0');
  const Rpad = String(R_).padStart(m, '0');

  const PRconcat = P * Math.pow(10, m) + R_;
  /* 기약분수로 줄여서 답한다 — 중2 과정이라 5학년 이상 약분 정책이 적용된다
     (2026-08-29 원장 지시). 예전엔 48/90처럼 계산 직후 값이 정답키였다. */
  const [numerator, denominator] = normFrac(PRconcat - P,
    Math.pow(10, k) * (Math.pow(10, m) - 1));

  return {
    prompt: {
      ko: `순환소수를 분수로! 반복 전 자리(${Ppad})까지 포함해 이어붙인 수에서 반복 전 자리 수를 빼고, 분모는 10^{${k}}×(10^{${m}}-1)이에요 — 마지막엔 기약분수로 줄여요`,
      en: `Turn the repeating decimal into a fraction: subtract the non-repeating prefix from the concatenated number, and the denominator is 10^${k}×(10^${m}-1)`,
      zh: `把循环小数化成分数：用"前缀+循环节"连成的数减去前缀，分母是10^{${k}}×(10^{${m}}-1)`
    },
    tex: `0.${Ppad}\\overline{${Rpad}} = \\square`,
    answer: [numerator, denominator], answerShape: 'fraction', answerType: 'number', widget: 'numpad'
  };
};

if (typeof module !== 'undefined' && module.exports) module.exports = NM_TGEN;
})();
