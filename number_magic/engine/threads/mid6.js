/* ============================================================
   Numbers of Magic — MD36~42(고등 W13 · 대수) 스레드 생성기.
   근거: MASTER-ROADMAP.md §6(W13 대수) — 2022 개정 교육과정 '대수'
   과목 '지수함수와 로그함수'·'삼각함수'·'수열' 성취기준 범위의 표준
   연산 유형을 자체 설계(교재 원문 없음, 원본 문장 인용 없음).
   engine/threads/mid5.js(W12, MD31~35)에 이어지는 번호. 2022 개정
   과목명 준수 — 이 파일 어디에도 "고3" 표기 없음(전부 "대수").
   계약: NM_TGEN[genKey] = function(params, rng) { ... }
   절대 Math.random() 사용 금지 — R(rng,a,b) / pick(rng,arr)만.

   답 환원 원칙(MASTER-ROADMAP §7) — 이 파일에서 새로 정하는 규약:
   - 유리수 지수(MD36): ⁿ√(aᵐ)=a^(p/q)의 [p,q] 두 정수(기약분수).
   - 로그(MD37·38): 값 자체가 정수 하나 — a^x=N 관계를 항상 forward로
     구성해 나눗셈 없이 정수가 나오게 한다. 밑변환도 b=a^k 관계로
     역산해 정수만 나오도록 만든다("정수 되는 것만" 원장 지시).
   - 삼각비 특수각(MD39): 값의 형태에 따라 셋으로 갈린다 — 정수 하나
     (0,1) / 기약분수 [분자,분모](answerShape:'fraction') / 근호가
     섞인 분수는 MD28(근의 공식)과 같은 방식으로 tex에 \square를 3개
     박아 [계수,근호안,분모]를 순서대로 받는다(새 answerShape를 만들지
     않고 근의 공식 선례를 재사용) / 순수 근호값은 MD16·MD31과 같은
     [계수,근호안] 두 정수.
   - 수열(MD40·41): 일반항 문제의 정답은 [a1,d] 또는 [a1,r] 두 정수,
     n항·합 문제의 정답은 정수 하나. 등비수열의 합은 나눗셈 공식 대신
     항을 직접 나열해 더하는 루프로 계산해 부동소수점 오차를 원천
     차단한다.
   - Σ(MD42): 값은 항상 정수 하나 — Σk=n(n+1)/2, Σk²=n(n+1)(2n+1)/6은
     항상 정수가 되는 항등식이라 별도 역산 없이 forward로 n만 골라도
     안전하다(무지개 덧셈법·제곱수의 합과 동일 공식, lineage 명시).

   기호 전환 교육(§13) — 이 파일에서 log(MD37)·Σ(MD42)가 처음
   등장한다. 두 생성기 모두 mode:'decode'를 갖고 있고, 이건 유닛의
   practice(첫 단계, discover보다 먼저 나옴)에서만 쓴다 — "계산 없이
   기호가 시키는 일을 읽기"이므로 완성된 식을 그대로 보여주고 그중
   한 자리(밑·진수·항의 개수 등)만 읽어 입력하게 한다. threads.js에
   등록하는 1~3레벨은 전부 실제 계산 모드다.

   solution 필드(2026-09-04, 학습지 v2 §2-4 ★예시 문항용) — 각
   생성기가 실제로 답에 이르는 과정을 {tex,blank} 배열로 함께
   반환한다. 마지막 줄의 blank는 항상 answer와 동일(검증:
   scripts/check-solution-steps.js). tex·answer 등 기존 필드는
   전혀 바뀌지 않는다.
   ============================================================ */
(function(){
'use strict';

const { R, pick } = NM_RNG;

/* ── 공용 헬퍼(mid4·mid5와 동일 계열, 파일별 독립 정의 관례) ── */
function nzInt(rng, lo, hi){ return R(rng, lo, hi) * pick(rng, [1, -1]); }
function wrapPlus(n){ return n < 0 ? `- ${Math.abs(n)}` : `+ ${n}`; }
/* 변수 항 전용 — 계수 ±1은 숫자를 감춰 '1x²' 노출 방지 */
function coefLead(n){ return n===1?'':n===-1?'-':String(n); }
function wrapPlusCoef(n){ return n===1?'+ ':n===-1?'- ':(n<0?`- ${Math.abs(n)}`:`+ ${n}`); }
function hasNeg(v){ return Array.isArray(v) ? v.some(x => x < 0) : v < 0; }
function gcd(a, b){ a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a || 1; }
/* 로그 계열 생성기 공용 — N=aˣ가 학습지에 어울리지 않게 치솟는 걸 막으면서도
   조합 수는 넓게 유지한다: x를 먼저 뽑고, N≤ceiling이 되도록 x에 맞춰 a의
   상한을 역산한다(x가 크면 a 상한은 저절로 작아짐). aMax는 그 상한의 절대
   천장(너무 쉬운 a=2~3만 반복되지 않게 하는 하한 보장 역할도 겸함). */
function pickLogPair(rng, xMax, aMax, ceiling){
  const x = R(rng, 1, xMax);
  const aCap = Math.max(2, Math.min(aMax, Math.floor(Math.pow(ceiling, 1 / x))));
  const a = R(rng, 2, aCap);
  return { a, x, N: Math.pow(a, x) };
}
/* MD39 solution용 — 계수 c를 곱하기 전, 그 특수각의 "원래" 값을
   그대로 tex로 옮긴다(표는 coeff가 항상 1이라 계수 표기는 생략). */
function trigBaseTex(e){
  if (e.kind === 'int') return String(e.val);
  if (e.kind === 'fracSimple') return `\\dfrac{${e.n}}{${e.d}}`;
  if (e.kind === 'fracRoot') return `\\dfrac{\\sqrt{${e.rad}}}{${e.denom}}`;
  return `\\sqrt{${e.rad}}`; /* rootOnly */
}

/* ── MD36 — 거듭제곱근과 유리수 지수 ── ⁿ√(aᵐ)을 a^(p/q)(기약분수)로
   바꾼다. m=p×k, n=q×k(gcd(p,q)=1)로 역산해 항상 정확히 p/q로
   기약되게 만든다. mode: 'basic'(k=1, 이미 기약된 형태로 표기법
   자체를 익힘) · 'reduce'(k=2~3, 실제 약분 필요) · 'wide'(더 큰
   범위, 실전). */
NM_TGEN['md36_rationalExponent'] = function (params, rng) {
  const mode = params.mode || 'basic';
  const bases = [2, 3, 5, 7, 10, 6];
  const a = pick(rng, bases);
  const qMax = mode === 'wide' ? 6 : 4;
  const pMax = mode === 'wide' ? 11 : 7;
  let p, q;
  do {
    q = R(rng, 2, qMax);
    p = R(rng, 1, pMax);
  } while (gcd(p, q) !== 1);
  const k = mode === 'basic' ? 1 : R(rng, 2, mode === 'wide' ? 4 : 3);
  const m = p * k, n = q * k;
  const answer = [p, q];
  return {
    prompt: {
      ko: `ⁿ√(aᵐ)은 지수 m/n을 기약분수로 줄인 a^(p/q)와 같아요 — 근호의 지수(n)는 분모로, 거듭제곱의 지수(m)는 분자로 가요`,
      en: `The nth root of aᵐ equals a raised to the reduced fraction m/n — the root's index (n) becomes the denominator, the power's exponent (m) becomes the numerator`,
      zh: `aᵐ的n次方根等于a的m/n次方(约分后)——根指数(n)作分母，幂指数(m)作分子`
    },
    tex: `\\sqrt[${n}]{${a}^{${m}}} = ${a}^{\\frac{\\square}{\\square}}`,
    answer, answerType: 'number', widget: 'numpad', negative: false,
    solution: [
      { tex: `\\dfrac{${m}}{${n}}` },
      { tex: `\\gcd(${m},${n})=${k}` },
      { tex: `\\dfrac{${m}}{${n}} = \\dfrac{\\square}{\\square}`, blank: [p, q] }
    ]
  };
};

/* ── MD37 — 로그의 정의 ── log_a N = x ⟺ a^x = N. 항상 N=a^x로 먼저
   정하는 forward 생성이라 값은 언제나 정수. 지수 사다리(M-10)와
   같은 방향으로 "a를 몇 번 곱해야 N이 되는가"를 묻는다.
   mode: 'value'(x 구하기, 기본) · 'findN'(N=a^x 거꾸로 구하기) ·
   'findBase'(a 구하기) · 'wide'(더 큰 범위, 실전) ·
   'decode'(§13 기호 해독 — 밑·진수·값 중 하나를 계산 없이 읽기,
   유닛 practice 전용). */
NM_TGEN['md37_logDefinition'] = function (params, rng) {
  const mode = params.mode || 'value';

  if (mode === 'decode') {
    const a = R(rng, 2, 9);
    const x = R(rng, 2, 4);
    const N = Math.pow(a, x);
    const which = pick(rng, ['base', 'arg', 'exp']);
    const answer = which === 'base' ? a : which === 'arg' ? N : x;
    const promptMap = {
      base: { ko: `이 로그식에서 "밑"(log 아래 작은 수)을 그대로 읽어 입력해요 — 계산은 필요 없어요`,
        en: `Just read off the "base" (the small number under log) in this equation — no calculation needed`,
        zh: `直接读出这个对数式中的"底数"(log下方的小数字)——不用计算` },
      arg: { ko: `이 로그식에서 "진수"(log 오른쪽의 수)를 그대로 읽어 입력해요 — 계산은 필요 없어요`,
        en: `Just read off the "argument" (the number to the right of log) in this equation — no calculation needed`,
        zh: `直接读出这个对数式中的"真数"(log右边的数)——不用计算` },
      exp: { ko: `이 로그식에서 등호 오른쪽 값(지수 사다리의 몇 번째 칸인지)을 그대로 읽어 입력해요 — 계산은 필요 없어요`,
        en: `Just read off the value on the right of the equals sign (which rung of the exponent ladder) — no calculation needed`,
        zh: `直接读出等号右边的值(是指数梯子的第几级)——不用计算` }
    };
    const decodeTex = which === 'base' ? `\\log_{\\square} ${N} = ${x}`
      : which === 'arg' ? `\\log_{${a}} \\square = ${x}`
      : `\\log_{${a}} ${N} = \\square`;
    return {
      prompt: promptMap[which],
      tex: `\\log_{${a}} ${N} = ${x}`,
      answer, answerType: 'number', widget: 'numpad', negative: false,
      solution: [ { tex: decodeTex, blank: answer } ]
    };
  }

  if (mode === 'findN') {
    /* 범위(2026-08-25, 중복 감사 대응): a·x를 그냥 넓히면 N=aˣ가 (예: a=20,
       x=6이면 6천4백만) 학습지에 어울리지 않는 천문학적 수가 된다. x를 먼저
       뽑고, N이 ceiling을 넘지 않도록 x에 맞춰 a의 상한을 역산하는
       pickLogPair()로 "조합 수는 넓히되 크기는 억제"한다. */
    const { a, x, N } = pickLogPair(rng, params.wide ? 5 : 4, params.wide ? 70 : 40, params.wide ? 60000 : 20000);
    return {
      prompt: {
        ko: `log_a N = x는 "a를 x번 곱하면 N"이라는 뜻이에요 — aˣ를 계산하면 N이 나와요`,
        en: `log_a N = x means "a multiplied by itself x times gives N" — compute aˣ to get N`,
        zh: `log_a N = x的意思是"a自乘x次得到N"——算出aˣ就是N`
      },
      tex: `\\log_{${a}} \\square = ${x}`,
      answer: N, answerType: 'number', widget: 'numpad', negative: false,
      solution: [
        { tex: `\\log_{${a}} N = ${x} \\;\\Rightarrow\\; N=${a}^{${x}}` },
        { tex: `${a}^{${x}} = \\square`, blank: N }
      ]
    };
  }

  if (mode === 'findBase') {
    const x = R(rng, 2, 4);
    const a = R(rng, 2, params.wide ? 9 : 6);
    const N = Math.pow(a, x);
    return {
      prompt: {
        ko: `log_a N = x에서 밑 a를 구하려면, x번 거듭제곱해서 N이 되는 수를 찾아요(N=aˣ의 반대 방향)`,
        en: `To find the base a in log_a N = x, find the number that gives N when raised to the x power`,
        zh: `求log_a N=x中的底数a，需要找到自乘x次后等于N的那个数`
      },
      tex: `\\log_{\\square} ${N} = ${x}`,
      answer: a, answerType: 'number', widget: 'numpad', negative: false,
      solution: [
        { tex: `a^{${x}} = ${N}` },
        { tex: `a = \\square`, blank: a }
      ]
    };
  }

  /* value(기본) 또는 wide(실전) — a,N을 주고 x=log_a N 찾기.
     findN과 같은 이유로 pickLogPair()를 재사용한다. */
  const wide = mode === 'wide';
  const { a, x, N } = pickLogPair(rng, wide ? 6 : 4, wide ? 80 : 40, wide ? 100000 : 20000);
  return {
    prompt: {
      ko: `log_a N = x는 "a를 몇 번 곱해야 N이 되는가"를 묻는 거예요 — 지수 사다리를 오르며 확인해요: a¹,a²,a³…`,
      en: `log_a N = x asks "how many times must a be multiplied to reach N" — climb the exponent ladder: a¹,a²,a³…`,
      zh: `log_a N = x问的是"a要乘几次才能得到N"——沿着指数梯子往上爬确认：a¹,a²,a³…`
    },
    tex: `\\log_{${a}} ${N} = \\square`,
    answer: x, answerType: 'number', widget: 'numpad', negative: false,
    solution: [
      { tex: `${a}^{\\square} = ${N}`, blank: x },
      { tex: `\\log_{${a}} ${N} = \\square`, blank: x }
    ]
  };
};

/* ── MD38 — 로그의 성질 ── logA+logB=log(AB), logA-logB=log(A÷B),
   밑변환은 b=a^k 관계로 역산해 정수만 나오게 한다("정수 되는 것만").
   mode: 'sumProduct' · 'diffQuotient' · 'changeBase'. */
NM_TGEN['md38_logProperties'] = function (params, rng) {
  const mode = params.mode || 'sumProduct';

  if (mode === 'sumProduct') {
    /* answer=X*Y=a^(m+n) — m,n을 각각 넓히면 지수의 합이 걷잡을 수 없이
       커진다(2026-08-25 중복 감사 대응 중 발견: a=8,m=n=5면 answer가 10억
       단위). 지수의 합(total)을 먼저 정해 위 한도를 걸고, 그 total에 맞춰
       a의 상한을 역산해 답을 ceiling 이하로 묶는다. */
    const total = R(rng, 2, 8);
    const m = R(rng, 1, total - 1), n = total - m;
    const aCap = Math.max(2, Math.min(9, Math.floor(Math.pow(20000, 1 / total))));
    const a = R(rng, 2, aCap);
    const X = Math.pow(a, m), Y = Math.pow(a, n);
    const answer = X * Y;
    return {
      prompt: {
        ko: `log_a X + log_a Y = log_a(XY) — 두 로그의 합은 안의 수를 곱한 로그와 같아요`,
        en: `log_a X + log_a Y = log_a(XY) — the sum of two logs equals the log of their product`,
        zh: `log_a X + log_a Y = log_a(XY)——两个对数之和等于真数相乘后的对数`
      },
      tex: `\\log_{${a}} ${X} + \\log_{${a}} ${Y} = \\log_{${a}} \\square`,
      answer, answerType: 'number', widget: 'numpad', negative: false,
      solution: [
        { tex: `\\log_{${a}} ${X} + \\log_{${a}} ${Y} = \\log_{${a}} (XY)` },
        { tex: `XY = ${X}\\times ${Y} = \\square`, blank: answer }
      ]
    };
  }

  if (mode === 'diffQuotient') {
    /* X=a^nX가 폭주하지 않도록 nX를 먼저 상한을 두고 고른 뒤, 그 nX에 맞춰
       a의 상한을 역산한다(sumProduct와 같은 이유). */
    const nX = R(rng, 2, 6);
    const nY = R(rng, 1, nX - 1);
    const aCap = Math.max(2, Math.min(9, Math.floor(Math.pow(20000, 1 / nX))));
    const a = R(rng, 2, aCap);
    const X = Math.pow(a, nX), Y = Math.pow(a, nY);
    const answer = X / Y;
    return {
      prompt: {
        ko: `log_a X - log_a Y = log_a(X÷Y) — 두 로그의 차는 안의 수를 나눈 로그와 같아요`,
        en: `log_a X - log_a Y = log_a(X÷Y) — the difference of two logs equals the log of their quotient`,
        zh: `log_a X - log_a Y = log_a(X÷Y)——两个对数之差等于真数相除后的对数`
      },
      tex: `\\log_{${a}} ${X} - \\log_{${a}} ${Y} = \\log_{${a}} \\square`,
      answer, answerType: 'number', widget: 'numpad', negative: false,
      solution: [
        { tex: `\\log_{${a}} ${X} - \\log_{${a}} ${Y} = \\log_{${a}} (X\\div Y)` },
        { tex: `X\\div Y = ${X}\\div ${Y} = \\square`, blank: answer }
      ]
    };
  }

  /* changeBase — log_b N = r ⟺ N = b^r은 b가 무엇이든 항상 정수로
     떨어진다(밑을 소인수분해해 "b 자신이 어떤 수의 거듭제곱"임을
     알아채면 더 쉽게 푼다는 게 이 모드의 요령일 뿐, N=b^r로 forward
     구성하는 이상 b·r 자체에는 제약이 없다 — a,k 중간 매개는 tex에
     드러나지도 않으면서 (b,N) 조합만 줄이는 군더더기였다, 2026-08-25
     중복 감사 대응 중 정리). pickLogPair()로 b·N을 넓게, 그러면서도
     ceiling 이하로 통제한다. */
  const { a: b, x: r, N } = pickLogPair(rng, 6, 50, 1000000);
  return {
    prompt: {
      ko: `log_b N을 구할 때 b 자신이 어떤 수의 거듭제곱이면, b를 한 단위로 삼아 몇 번 곱해야 N이 되는지 세면 돼요(밑변환이 정수로 떨어지는 경우)`,
      en: `To find log_b N, when b itself is already a clean power, just count how many times b must be multiplied to reach N (a change-of-base case that lands on an integer)`,
      zh: `求log_b N时，如果b本身就是某数的整数次幂，只需数b要乘几次得到N(换底后恰为整数的情形)`
    },
    tex: `\\log_{${b}} ${N} = \\square`,
    answer: r, answerType: 'number', widget: 'numpad', negative: false,
    solution: [
      { tex: `${b}^{\\square} = ${N}`, blank: r },
      { tex: `\\log_{${b}} ${N} = \\square`, blank: r }
    ]
  };
};

/* ── MD39 — 삼각함수의 값(특수각) ── 0°·30°·45°·60°·90° 표. 값의
   형태에 따라 세 가지 답 규약으로 갈린다:
   int(정수 0·1) / fracSimple([분자,분모], answerShape:'fraction') /
   fracRoot([계수,근호안,분모] — MD28 근의 공식처럼 tex에 \square 3개를
   그대로 박아 순서대로 받음, 새 answerShape 없음) /
   rootOnly([계수,근호안] — MD16·MD31과 같은 두 정수 규약). */
const TRIG_ENTRIES = [
  { fn: 'sin', deg: 0,  kind: 'int', val: 0 },
  { fn: 'sin', deg: 30, kind: 'fracSimple', n: 1, d: 2 },
  { fn: 'sin', deg: 45, kind: 'fracRoot', coeff: 1, rad: 2, denom: 2 },
  { fn: 'sin', deg: 60, kind: 'fracRoot', coeff: 1, rad: 3, denom: 2 },
  { fn: 'sin', deg: 90, kind: 'int', val: 1 },
  { fn: 'cos', deg: 0,  kind: 'int', val: 1 },
  { fn: 'cos', deg: 30, kind: 'fracRoot', coeff: 1, rad: 3, denom: 2 },
  { fn: 'cos', deg: 45, kind: 'fracRoot', coeff: 1, rad: 2, denom: 2 },
  { fn: 'cos', deg: 60, kind: 'fracSimple', n: 1, d: 2 },
  { fn: 'cos', deg: 90, kind: 'int', val: 0 },
  { fn: 'tan', deg: 0,  kind: 'int', val: 0 },
  { fn: 'tan', deg: 30, kind: 'fracRoot', coeff: 1, rad: 3, denom: 3 },
  { fn: 'tan', deg: 45, kind: 'int', val: 1 },
  { fn: 'tan', deg: 60, kind: 'rootOnly', coeff: 1, rad: 3 }
];
window.NM_TRIG_ENTRIES = TRIG_ENTRIES; /* 검증 하네스가 같은 표를 대조용으로 재사용 */

const TRIG_PROMPT = {
  int: { ko: `0°·90°는 좌표축 위의 값이에요 — sin0°·cos90°는 0, sin90°·cos0°는 1, 45°의 tan은 밑변과 높이가 같아 1`,
    en: `0° and 90° sit right on the axes — sin0°/cos90°=0, sin90°/cos0°=1, and tan45°=1 because base and height are equal`,
    zh: `0°和90°正好在坐标轴上——sin0°/cos90°=0，sin90°/cos0°=1，tan45°=1是因为底和高相等` },
  fracSimple: { ko: `30°·60°는 정삼각형을 반으로 자른 직각삼각형의 변의 비에서 나와요 — sin30°=cos60°=1/2`,
    en: `30° and 60° come from the side ratios of a right triangle formed by bisecting an equilateral triangle — sin30°=cos60°=1/2`,
    zh: `30°和60°来自把等边三角形对半切开得到的直角三角形边比——sin30°=cos60°=1/2` },
  fracRoot: { ko: `특수각 삼각형의 변의 비를 그대로 분수로 옮겨요 — 근호가 있는 값은 분자에 √를 그대로 둬요`,
    en: `Carry the special-triangle side ratio straight into a fraction — keep the √ in the numerator as-is`,
    zh: `把特殊角三角形的边比直接写成分数——根号留在分子里` },
  rootOnly: { ko: `tan60°=sin60°÷cos60°=(√3/2)÷(1/2)=√3 — 분모가 사라지고 근호만 남아요`,
    en: `tan60°=sin60°÷cos60°=(√3/2)÷(1/2)=√3 — the denominators cancel, leaving only the root`,
    zh: `tan60°=sin60°÷cos60°=(√3/2)÷(1/2)=√3——分母互相抵消，只剩下根号` }
};

/* 14개 (함수,각) 조합만으로는 20문항 학습지에서 조합이 금방 바닥나
   중복률이 45~75%까지 치솟는다(실측, 2026-08-25 중복 감사에서 발견).
   표 자체를 늘리는 대신(특수각은 수학적으로 딱 14개뿐) 앞에 정수 계수
   c를 곱해 "c×sin30°" 식으로 변주해 조합 수를 곱절로 늘린다 — 실제
   교재에서도 흔한 형태이고, 특수각 값을 안다는 본질은 그대로 유지된다.
   c=1이면 계수 표시를 생략해 원래의 순수한 형태도 그대로 섞여 나온다.
   기약분수 규약을 지키려고 c로 축약하지 않고 그대로(c×원래값)를
   정답으로 받는다 — 근의 공식(MD28)처럼 "기약 전 형태 그대로"도 이미
   있는 관례라 새 규약이 아니다. */
NM_TGEN['md39_trigSpecialAngle'] = function (params, rng) {
  const mode = params.mode || 'basic';
  const pool = mode === 'basic' ? TRIG_ENTRIES.filter(e => e.kind === 'int' || e.kind === 'fracSimple')
    : mode === 'mixed' ? TRIG_ENTRIES.filter(e => e.kind === 'fracRoot')
    : TRIG_ENTRIES; /* wide(실전) — 전체 14종 */
  const cMax = mode === 'basic' ? 9 : mode === 'mixed' ? 18 : 9;
  const e = pick(rng, pool);
  const c = R(rng, 1, cMax);
  const head = `\\${e.fn} ${e.deg}^\\circ`;
  const prefix = c === 1 ? '' : `${c} \\times `;
  const baseLine = { tex: `${head} = ${trigBaseTex(e)}` };
  if (e.kind === 'int') {
    return { prompt: TRIG_PROMPT.int, tex: `${prefix}${head} = \\square`, answer: c * e.val, answerType: 'number', widget: 'numpad', negative: false,
      solution: [ baseLine, { tex: `${prefix}${head} = \\square`, blank: c * e.val } ] };
  }
  /* 약분 정책(2026-08-29 원장): 5학년 이상은 기약분수가 정답. 고1 삼각함수도
     마찬가지인데 예전엔 계수를 곱한 값을 그대로 냈다 — 6×sin30°의 정답키가
     6/2였다(실제로는 정수 3). 분모까지 약분해 1이 되면 분수 꼴을 버리고
     정수(또는 근호만) 꼴로 낸다. */
  if (e.kind === 'fracSimple') {
    const g = gcd(c * e.n, e.d);
    const nn = (c * e.n) / g, dd = e.d / g;
    if (dd === 1) {
      return { prompt: TRIG_PROMPT.int, tex: `${prefix}${head} = \\square`, answer: nn, answerType: 'number', widget: 'numpad', negative: false,
        solution: [ baseLine, { tex: `${prefix}${head} = ${c}\\times\\dfrac{${e.n}}{${e.d}} = \\square`, blank: nn } ] };
    }
    return { prompt: TRIG_PROMPT.fracSimple, tex: `${prefix}${head} = \\dfrac{\\square}{\\square}`, answer: [nn, dd], answerShape: 'fraction', answerType: 'number', widget: 'numpad', negative: false,
      solution: [ baseLine, { tex: `${prefix}${head} = \\dfrac{${c}\\times ${e.n}}{${e.d}} = \\dfrac{\\square}{\\square}`, blank: [nn, dd] } ] };
  }
  if (e.kind === 'fracRoot') {
    const g = gcd(c * e.coeff, e.denom);
    const cc = (c * e.coeff) / g, dd = e.denom / g;
    if (dd === 1) {
      /* 분모가 사라지면 "계수√근호" 꼴 — rootOnly와 같은 모양이 된다 */
      return { prompt: TRIG_PROMPT.rootOnly, tex: `${prefix}${head} = \\square\\sqrt{\\square}`, answer: [cc, e.rad], answerShape: 'coeffRadical', answerType: 'number', widget: 'numpad', negative: false,
        solution: [ baseLine, { tex: `${prefix}${head} = \\dfrac{${c}\\times\\sqrt{${e.rad}}}{${e.denom}} = \\square\\sqrt{\\square}`, blank: [cc, e.rad] } ] };
    }
    return { prompt: TRIG_PROMPT.fracRoot, tex: `${prefix}${head} = \\dfrac{\\square\\sqrt{\\square}}{\\square}`, answer: [cc, e.rad, dd], answerShape: 'coeffRadicalFraction', answerType: 'number', widget: 'numpad', negative: false,
      solution: [ baseLine, { tex: `${prefix}${head} = \\dfrac{${c}\\times\\sqrt{${e.rad}}}{${e.denom}} = \\dfrac{\\square\\sqrt{\\square}}{\\square}`, blank: [cc, e.rad, dd] } ] };
  }
  /* rootOnly */
  return { prompt: TRIG_PROMPT.rootOnly, tex: `${prefix}${head} = \\square\\sqrt{\\square}`, answer: [c * e.coeff, e.rad], answerShape: 'coeffRadical', answerType: 'number', widget: 'numpad', negative: false,
    solution: [ baseLine, { tex: `${prefix}${head} = ${c}\\times\\sqrt{${e.rad}} = \\square\\sqrt{\\square}`, blank: [c * e.coeff, e.rad] } ] };
};

/* ── MD40 — 등차수열 ── aₙ=a₁+(n-1)d, Sₙ=n(2a₁+(n-1)d)/2. Sₙ은
   n(n-1)이 항상 짝수라 어떤 정수 a1,d,n을 넣어도 나눗셈 없이 정수로
   떨어진다(증명: n(2a1+(n-1)d)=2·n·a1+n(n-1)d, 두 항 모두 항상 짝수).
   mode: 'nthTerm'(일반항 값) · 'findRule'(두 항→a1,d 역산) ·
   'sum'(합). */
NM_TGEN['md40_arithmeticSeq'] = function (params, rng) {
  const mode = params.mode || 'nthTerm';
  const wide = !!params.wide;

  if (mode === 'nthTerm') {
    const a1 = nzInt(rng, 1, wide ? 20 : 15);
    const d = nzInt(rng, 1, wide ? 12 : 9);
    const n = R(rng, 3, wide ? 14 : 10);
    const answer = a1 + (n - 1) * d;
    return {
      prompt: { ko: `등차수열의 일반항 aₙ=a₁+(n-1)d에 그대로 대입해요`,
        en: `Substitute directly into the general term formula aₙ=a₁+(n-1)d`,
        zh: `直接代入等差数列通项公式aₙ=a₁+(n-1)d` },
      tex: `a_1=${a1},\\;d=${d} \\;\\Rightarrow\\; a_{${n}} = \\square`,
      answer, answerType: 'number', widget: 'numpad', negative: answer < 0,
      solution: [
        { tex: `(n-1)d = (${n}-1)\\times ${d} = \\square`, blank: (n - 1) * d },
        { tex: `a_{${n}} = a_1+(n-1)d = ${a1}+${(n - 1) * d} = \\square`, blank: answer }
      ]
    };
  }

  if (mode === 'findRule') {
    const d = nzInt(rng, 1, wide ? 9 : 6);
    const a1 = nzInt(rng, 1, wide ? 20 : 12);
    const p = R(rng, 1, 4), q = p + R(rng, 1, 4);
    const X = a1 + (p - 1) * d, Y = a1 + (q - 1) * d;
    const answer = [a1, d];
    return {
      prompt: { ko: `d=(뒤 항-앞 항)÷(항번호 차), a₁=X-(p-1)d 순서로 구해요`,
        en: `Find d = (later term − earlier term) ÷ (index difference), then a₁ = X − (p−1)d`,
        zh: `先求d=(后项-前项)÷(项数之差)，再求a₁=X-(p-1)d` },
      tex: `a_{${p}}=${X},\\;a_{${q}}=${Y} \\;\\Rightarrow\\; a_1=\\square,\\;d=\\square`,
      answer, answerType: 'number', widget: 'numpad', negative: hasNeg(answer),
      solution: [
        { tex: `d = \\dfrac{${Y}-${X}}{${q}-${p}} = \\square`, blank: d },
        { tex: `a_1 = ${X}-(${p}-1)\\times ${d} = \\square`, blank: a1 },
        { tex: `a_1=\\square,\\;d=\\square`, blank: [a1, d] }
      ]
    };
  }

  /* sum */
  const a1 = nzInt(rng, 1, wide ? 20 : 12);
  const d = nzInt(rng, 1, wide ? 9 : 6);
  const n = R(rng, 3, wide ? 12 : 8);
  const Sn = n * (2 * a1 + (n - 1) * d) / 2;
  return {
    prompt: { ko: `등차수열의 합 Sₙ=n(2a₁+(n-1)d)÷2에 대입해요`,
      en: `Substitute into the arithmetic series sum Sₙ=n(2a₁+(n-1)d)÷2`,
      zh: `代入等差数列求和公式Sₙ=n(2a₁+(n-1)d)÷2` },
    tex: `a_1=${a1},\\;d=${d} \\;\\Rightarrow\\; S_{${n}} = \\square`,
    answer: Sn, answerType: 'number', widget: 'numpad', negative: Sn < 0,
    solution: [
      { tex: `2a_1+(n-1)d = 2\\times ${a1}+(${n}-1)\\times ${d} = \\square`, blank: 2 * a1 + (n - 1) * d },
      { tex: `S_{${n}} = \\dfrac{n(2a_1+(n-1)d)}{2} = \\dfrac{${n}\\times ${2 * a1 + (n - 1) * d}}{2} = \\square`, blank: Sn }
    ]
  };
};

/* ── MD41 — 등비수열 ── aₙ=a₁×r^(n-1). 합은 항을 직접 나열해 더하는
   루프로 계산해(공식의 나눗셈 대신) 부동소수점 오차와 소수 답을
   원천 차단한다("정수 되는 조합만" 요구를 계산 방식 자체로 충족).
   mode: 'nthTerm' · 'findRule'(두 항→a1,r 역산) · 'sum'. */
NM_TGEN['md41_geometricSeq'] = function (params, rng) {
  const mode = params.mode || 'nthTerm';
  const wide = !!params.wide;
  function pickR(w){ const mag = R(rng, 2, w ? 4 : 3); return mag * pick(rng, [1, -1]); }

  if (mode === 'nthTerm') {
    const a1 = nzInt(rng, 1, 9);
    const r = pickR(wide);
    const n = R(rng, 2, wide ? 6 : 4);
    const answer = a1 * Math.pow(r, n - 1);
    return {
      prompt: { ko: `등비수열의 일반항 aₙ=a₁×r^(n-1)에 대입해요`,
        en: `Substitute into the geometric general term aₙ=a₁×r^(n-1)`,
        zh: `代入等比数列通项公式aₙ=a₁×r^(n-1)` },
      tex: `a_1=${a1},\\;r=${r} \\;\\Rightarrow\\; a_{${n}} = \\square`,
      answer, answerType: 'number', widget: 'numpad', negative: answer < 0,
      solution: [
        { tex: `r^{${n - 1}} = \\square`, blank: Math.pow(r, n - 1) },
        { tex: `a_{${n}} = a_1\\times r^{${n - 1}} = ${a1}\\times ${Math.pow(r, n - 1)} = \\square`, blank: answer }
      ]
    };
  }

  if (mode === 'findRule') {
    const r = pickR(wide);
    const a1 = nzInt(rng, 1, wide ? 8 : 5);
    const p = R(rng, 1, 3), q = p + R(rng, 1, 2);
    const X = a1 * Math.pow(r, p - 1), Y = a1 * Math.pow(r, q - 1);
    const answer = [a1, r];
    return {
      prompt: { ko: `두 항의 비로 공비 r을 먼저 구하고, a₁=X÷r^(p-1)로 구해요`,
        en: `Find the common ratio r from the ratio of two terms, then a₁ = X ÷ r^(p-1)`,
        zh: `先由两项之比求出公比r，再求a₁=X÷r^(p-1)` },
      tex: `a_{${p}}=${X},\\;a_{${q}}=${Y} \\;\\Rightarrow\\; a_1=\\square,\\;r=\\square`,
      answer, answerType: 'number', widget: 'numpad', negative: hasNeg(answer),
      solution: [
        { tex: `Y\\div X = ${Y}\\div ${X} = \\square`, blank: Y / X },
        { tex: `r = \\square`, blank: r },
        { tex: `a_1 = X\\div r^{${p - 1}} = ${X}\\div ${Math.pow(r, p - 1)} = \\square`, blank: a1 },
        { tex: `a_1=\\square,\\;r=\\square`, blank: [a1, r] }
      ]
    };
  }

  /* sum — 항을 직접 나열해 더한다(나눗셈 공식 미사용) */
  const a1 = nzInt(rng, 1, wide ? 8 : 5);
  const r = pickR(true);
  const n = R(rng, 2, 4);
  let Sn = 0, term = a1, terms = [];
  for (let i = 0; i < n; i++) { terms.push(term); Sn += term; term *= r; }
  const sumExpr = terms.map((t, i) => i === 0 ? String(t) : wrapPlus(t)).join(' ');
  return {
    prompt: { ko: `등비수열의 합은 각 항을 직접 나열해 더한 것과 같아요 — a₁+a₁r+a₁r²+…`,
      en: `The sum of a geometric series is just adding each term one by one — a₁+a₁r+a₁r²+…`,
      zh: `等比数列的和就是把每一项依次相加——a₁+a₁r+a₁r²+…` },
    tex: `a_1=${a1},\\;r=${r} \\;\\Rightarrow\\; S_{${n}} = \\square`,
    answer: Sn, answerType: 'number', widget: 'numpad', negative: Sn < 0,
    solution: [
      { tex: `S_{${n}} = ${sumExpr}` },
      { tex: `S_{${n}} = \\square`, blank: Sn }
    ]
  };
};

/* ── MD42 — Σ 계산 ── Σk=n(n+1)÷2(무지개 덧셈법과 동일 공식,
   lineage:'rainbow-sum'), Σk²=n(n+1)(2n+1)÷6(제곱수의 합=CH10과 동일
   공식). 둘 다 항등식이라 forward로 n만 골라도 항상 정수.
   mode: 'sumK' · 'sumK2' · 'sumAffine'(Σ(pk+q), 실전) ·
   'decode'(§13 — 시작 k·끝 k·항의 개수 중 하나를 계산 없이 읽기,
   유닛 practice 전용). */
NM_TGEN['md42_sigmaSum'] = function (params, rng) {
  const mode = params.mode || 'sumK';
  const wide = !!params.wide;

  if (mode === 'decode') {
    const a = R(rng, 1, 3);
    const b = a + R(rng, 2, 6);
    const which = pick(rng, ['start', 'end', 'count']);
    const answer = which === 'start' ? a : which === 'end' ? b : (b - a + 1);
    const promptMap = {
      start: { ko: `Σ 아래의 작은 글자가 "몇 번째 k부터 시작하는지"를 알려줘요 — 그대로 읽어요`,
        en: `The small text below Σ tells you which k to start from — just read it off`,
        zh: `Σ下方的小字告诉你k从几开始——直接读出来` },
      end: { ko: `Σ 위의 숫자가 "어디서 끝나는지"를 알려줘요 — 그대로 읽어요`,
        en: `The number above Σ tells you where k ends — just read it off`,
        zh: `Σ上方的数字告诉你k到哪里结束——直接读出来` },
      count: { ko: `Σ는 k=시작부터 끝까지 하나씩 대입해서 다 더하라는 뜻이에요 — 몇 번 더하는지(항의 개수)만 세어봐요(계산 없이 개수만!)`,
        en: `Σ means substitute k one by one from start to end and add them all — just count how many terms that is (no summing, just counting!)`,
        zh: `Σ的意思是把k从起点到终点依次代入并全部相加——数一数要加几项就好(不用求和，只数个数)` }
    };
    const solution = which === 'start' ? [ { tex: `\\sum_{k=\\square}^{${b}} k`, blank: a } ]
      : which === 'end' ? [ { tex: `\\sum_{k=${a}}^{\\square} k`, blank: b } ]
      : [ { tex: `\\sum_{k=${a}}^{${b}} k` }, { tex: `${b}-${a}+1 = \\square`, blank: b - a + 1 } ];
    return {
      prompt: promptMap[which],
      tex: `\\sum_{k=${a}}^{${b}} k`,
      answer, answerType: 'number', widget: 'numpad', negative: false,
      solution
    };
  }

  if (mode === 'sumK') {
    /* n 범위(2026-08-25, 중복 감사 대응): n 하나뿐인 단일 변수 생성기라
       10~20칸으로는 20문항 학습지에서 60%대까지 중복된다(실측). n(n+1)÷2는
       n이 커져도 항상 정수이므로 안전하게 넓힌다. */
    const n = R(rng, 3, wide ? 150 : 100);
    const answer = n * (n + 1) / 2;
    return {
      prompt: { ko: `Σk(k=1~n)는 무지개 덧셈법 그대로예요 — n(n+1)÷2`,
        en: `Σk from 1 to n is exactly the rainbow-sum trick — n(n+1)÷2`,
        zh: `Σk(k=1~n)就是彩虹加法法——n(n+1)÷2` },
      tex: `\\sum_{k=1}^{${n}} k = \\square`,
      answer, answerType: 'number', widget: 'numpad', negative: false,
      solution: [
        { tex: `n(n+1) = ${n}\\times(${n}+1) = \\square`, blank: n * (n + 1) },
        { tex: `\\sum_{k=1}^{${n}} k = \\dfrac{n(n+1)}{2} = \\dfrac{${n * (n + 1)}}{2} = \\square`, blank: answer }
      ]
    };
  }

  if (mode === 'sumK2') {
    const n = R(rng, 3, wide ? 120 : 80);
    const answer = n * (n + 1) * (2 * n + 1) / 6;
    return {
      prompt: { ko: `Σk²(k=1~n)는 제곱수의 합 공식 그대로예요 — n(n+1)(2n+1)÷6`,
        en: `Σk² from 1 to n is exactly the sum-of-squares formula — n(n+1)(2n+1)÷6`,
        zh: `Σk²(k=1~n)就是平方数之和公式——n(n+1)(2n+1)÷6` },
      tex: `\\sum_{k=1}^{${n}} k^2 = \\square`,
      answer, answerType: 'number', widget: 'numpad', negative: false,
      solution: [
        { tex: `n(n+1)(2n+1) = ${n}\\times(${n}+1)\\times(2\\times ${n}+1) = \\square`, blank: n * (n + 1) * (2 * n + 1) },
        { tex: `\\sum_{k=1}^{${n}} k^2 = \\dfrac{n(n+1)(2n+1)}{6} = \\square`, blank: answer }
      ]
    };
  }

  /* sumAffine — Σ(pk+q)=p·Σk+q·n(실전, pΣk과 상수항 q·n으로 쪼개기) */
  const n = R(rng, 3, wide ? 12 : 8);
  const p = R(rng, 2, 5);
  const q = nzInt(rng, 1, 9);
  const answer = p * n * (n + 1) / 2 + q * n;
  return {
    prompt: { ko: `Σ(pk+q)는 pΣk + qΣ1로 쪼개요 — 앞은 무지개 덧셈법, 뒤는 q를 n번 더한 것`,
      en: `Σ(pk+q) splits into p·Σk + q·Σ1 — the first part is the rainbow sum, the second is q added n times`,
      zh: `Σ(pk+q)拆成p·Σk + q·Σ1——前面是彩虹求和，后面是q加n次` },
    tex: `\\sum_{k=1}^{${n}} (${p}k ${wrapPlus(q)}) = \\square`,
    answer, answerType: 'number', widget: 'numpad', negative: answer < 0,
    solution: [
      { tex: `p\\sum k = ${p}\\times \\dfrac{${n}(${n}+1)}{2} = \\square`, blank: p * n * (n + 1) / 2 },
      { tex: `q\\sum 1 = ${q}\\times ${n} = \\square`, blank: q * n },
      { tex: `\\sum_{k=1}^{${n}} (${p}k ${wrapPlus(q)}) = \\square`, blank: answer }
    ]
  };
};

if (typeof module !== 'undefined' && module.exports) module.exports = NM_TGEN;
})();
