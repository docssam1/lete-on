/* ============================================================
   Numbers of Magic — MD91~MD100 공통수학1 새 유형 생성기 (2026-09-29)
   근거: docs/high-build-spec.md (공통수학1 새 유형 목록 앞 10개).
   교재(교과연산 J)는 챕터 제목만 근거로 쓰고, 문제는 전부 새로 만든다.

   MD91 곱셈공식의 변형          sq · diff · cube
   MD92 이차식으로 나눈 나머지    coefA · coefB · both(2칸)
   MD93 인수정리                 coef · findRoot · factorConst
   MD94 인수분해를 이용한 수의 계산 diffSq · perfectSq · cube
   MD95 복소수의 사칙과 켤레      addSub · mul · div        (답: 실부·허부 2칸)
   MD96 복소수가 서로 같을 조건    one · two(2칸) · mixed(2칸)
   MD97 i 의 거듭제곱·음수의 제곱근 power(2칸) · sum(2칸) · negRoot
   MD98 두 수를 근으로 하는 방정식  intRoots · shifted · conjugate (모두 2칸)
   MD99 그래프와 x축·직선의 위치 관계 count · tangent · range
   MD100 제한된 범위의 최대·최소   inside · outside · unknown

   계약: NM_TGEN[gen](params, rng), Math.random 금지. 답은 정수 또는 정수 배열.
   **답을 먼저 고르고 식을 역산한다**(MD52 와 같은 요령) — 나눗셈이 필요한 자리는
   몫이 정수가 되도록 미리 곱해 둔다. 풀이 마지막 단계의 blank = 답 전체.
   표기: 계수 1·0 을 드러내지 않고(term/poly), 음수는 괄호로(par), 이중부호 금지.
   ============================================================ */
(function(){
'use strict';
const NM_TGEN = window.NM_TGEN = window.NM_TGEN || {};
const { R, pick } = NM_RNG;

/* ── 공용 헬퍼(파일별 독립 정의 관례) ── */
function nzInt(rng, lo, hi){ return R(rng, lo, hi) * pick(rng, [1, -1]); }
function par(n){ return n < 0 ? `(${n})` : String(n); }
function hasNeg(v){ return Array.isArray(v) ? v.some(x => x < 0) : v < 0; }
function L3(ko, en, zh){ return { ko, en, zh }; }
/* 첫 항: 계수 c 와 문자 v — 1·−1 은 숨긴다 */
function lead(c, v){ if(!v) return String(c); return c === 1 ? v : c === -1 ? `-${v}` : `${c}${v}`; }
/* 뒤따르는 항: 0 이면 생략, 부호를 연산자로 */
function more(c, v){
  if(c === 0) return '';
  const a = Math.abs(c);
  return (c < 0 ? ' - ' : ' + ') + (v ? (a === 1 ? v : `${a}${v}`) : String(a));
}
/* 계수 배열(높은 차수부터) → 다항식 문자열 */
function poly(cs, v){
  v = v || 'x';
  const n = cs.length - 1;
  let s = '';
  cs.forEach((c, i) => {
    const d = n - i;
    if(c === 0) return;
    const vv = d === 0 ? '' : d === 1 ? v : `${v}^${d}`;
    s += s ? more(c, vv) : lead(c, vv);
  });
  return s || '0';
}
/* x − r 꼴 */
function xMinus(r, v){ v = v || 'x'; return r === 0 ? v : `${v}${more(-r, '')}`; }
/* 복소수 a+bi */
function cx(a, b){
  if(b === 0) return String(a);
  const im = b === 1 ? 'i' : b === -1 ? '-i' : `${b}i`;
  if(a === 0) return im;
  return `${a}${b < 0 ? ' - ' : ' + '}${Math.abs(b) === 1 ? '' : Math.abs(b)}i`;
}
function item(prompt, tex, answer, solution, extra){
  const p = { prompt, tex, answer, answerType:'number', widget:'numpad', negative: hasNeg(answer), solution };
  return Object.assign(p, extra || {});
}
const AB = `a=\\square,\\ b=\\square`;

/* ── MD91 — 곱셈공식의 변형 ──
   a, b 를 정수로 먼저 고르고 a+b·a−b·ab 를 주어 식의 값을 묻는다. */
function twoInts(rng){
  let a = nzInt(rng, 1, 9), b = nzInt(rng, 1, 9), g = 0;
  while(a === b && g++ < 20) b = nzInt(rng, 1, 9);
  if(a === b) b = a + 1 === 0 ? a + 2 : a + 1;
  return [a, b];
}
NM_TGEN['md91_formulaVariant'] = function (params, rng) {
  const mode = params.mode || 'sq';
  const [a, b] = twoInts(rng);
  const s = a + b, d = a - b, p = a * b;

  if (mode === 'diff') {
    const kind = pick(rng, ['sqDiff', 'absDiff', 'sqSum']);
    if (kind === 'absDiff') {
      const hi = Math.max(a, b), lo = Math.min(a, b), dd = hi - lo;
      return item(
        L3('a>b 이므로 (a−b)²을 먼저 구한 뒤 양의 제곱근을 택합니다.', 'Since a>b, find (a−b)² first and take the positive square root.', '因为a>b，先求(a−b)²，再取正的平方根。'),
        `a+b=${s},\\ ab=${p},\\ a>b \\;\\Rightarrow\\; a-b=\\square`, dd, [
          { tex:`(a-b)^2=(a+b)^2-4ab=${par(s)}^2-4\\times${par(p)}=${dd * dd}` },
          { tex:`a-b=\\sqrt{${dd * dd}}=\\square`, blank:dd }]);
    }
    if (kind === 'sqSum') {
      const ans = s * s;
      return item(
        L3('(a+b)²=(a−b)²+4ab 를 씁니다.', 'Use (a+b)²=(a−b)²+4ab.', '利用(a+b)²=(a−b)²+4ab。'),
        `a-b=${d},\\ ab=${p} \\;\\Rightarrow\\; (a+b)^2=\\square`, ans, [
          { tex:`(a+b)^2=(a-b)^2+4ab` },
          { tex:`=${par(d)}^2+4\\times${par(p)}=\\square`, blank:ans }]);
    }
    const ans = d * d;
    return item(
      L3('(a−b)²=(a+b)²−4ab 를 씁니다.', 'Use (a−b)²=(a+b)²−4ab.', '利用(a−b)²=(a+b)²−4ab。'),
      `a+b=${s},\\ ab=${p} \\;\\Rightarrow\\; (a-b)^2=\\square`, ans, [
        { tex:`(a-b)^2=(a+b)^2-4ab` },
        { tex:`=${par(s)}^2-4\\times${par(p)}=\\square`, blank:ans }]);
  }

  if (mode === 'cube') {
    const kind = pick(rng, ['sumCube', 'diffCube', 'recip2', 'recip3', 'recipMinus']);
    if (kind === 'sumCube') {
      const ans = s * s * s - 3 * p * s;
      return item(
        L3('a³+b³=(a+b)³−3ab(a+b) 를 씁니다.', 'Use a³+b³=(a+b)³−3ab(a+b).', '利用a³+b³=(a+b)³−3ab(a+b)。'),
        `a+b=${s},\\ ab=${p} \\;\\Rightarrow\\; a^3+b^3=\\square`, ans, [
          { tex:`a^3+b^3=(a+b)^3-3ab(a+b)` },
          { tex:`=${par(s)}^3-3\\times${par(p)}\\times${par(s)}=\\square`, blank:ans }]);
    }
    if (kind === 'diffCube') {
      const ans = d * d * d + 3 * p * d;
      return item(
        L3('a³−b³=(a−b)³+3ab(a−b) 를 씁니다.', 'Use a³−b³=(a−b)³+3ab(a−b).', '利用a³−b³=(a−b)³+3ab(a−b)。'),
        `a-b=${d},\\ ab=${p} \\;\\Rightarrow\\; a^3-b^3=\\square`, ans, [
          { tex:`a^3-b^3=(a-b)^3+3ab(a-b)` },
          { tex:`=${par(d)}^3+3\\times${par(p)}\\times${par(d)}=\\square`, blank:ans }]);
    }
    const t = nzInt(rng, 3, 9);
    if (kind === 'recipMinus') {
      const ans = t * t + 2;
      return item(
        L3('x와 1/x 의 곱은 1 입니다. (x−1/x)²에 2를 더합니다.', 'x times 1/x is 1, so add 2 to (x−1/x)².', 'x与1/x之积为1，在(x−1/x)²上加2。'),
        `x-\\dfrac{1}{x}=${t} \\;\\Rightarrow\\; x^2+\\dfrac{1}{x^2}=\\square`, ans, [
          { tex:`x^2+\\dfrac{1}{x^2}=\\left(x-\\dfrac{1}{x}\\right)^2+2` },
          { tex:`=${par(t)}^2+2=\\square`, blank:ans }]);
    }
    if (kind === 'recip2') {
      const ans = t * t - 2;
      return item(
        L3('x와 1/x 의 곱은 1 입니다. (x+1/x)²에서 2를 뺍니다.', 'x times 1/x is 1, so subtract 2 from (x+1/x)².', 'x与1/x之积为1，从(x+1/x)²中减去2。'),
        `x+\\dfrac{1}{x}=${t} \\;\\Rightarrow\\; x^2+\\dfrac{1}{x^2}=\\square`, ans, [
          { tex:`x^2+\\dfrac{1}{x^2}=\\left(x+\\dfrac{1}{x}\\right)^2-2` },
          { tex:`=${par(t)}^2-2=\\square`, blank:ans }]);
    }
    const ans = t * t * t - 3 * t;
    return item(
      L3('a=x, b=1/x 로 보면 ab=1 입니다. a³+b³=(a+b)³−3ab(a+b) 를 씁니다.', 'Treat a=x and b=1/x, so ab=1, and use a³+b³=(a+b)³−3ab(a+b).', '把a=x、b=1/x看作一组，ab=1，利用a³+b³=(a+b)³−3ab(a+b)。'),
      `x+\\dfrac{1}{x}=${t} \\;\\Rightarrow\\; x^3+\\dfrac{1}{x^3}=\\square`, ans, [
        { tex:`x^3+\\dfrac{1}{x^3}=\\left(x+\\dfrac{1}{x}\\right)^3-3\\left(x+\\dfrac{1}{x}\\right)` },
        { tex:`=${par(t)}^3-3\\times${par(t)}=\\square`, blank:ans }]);
  }

  /* sq(기본) — a²+b² */
  if (pick(rng, [0, 1])) {
    const ans = s * s - 2 * p;
    return item(
      L3('a²+b²=(a+b)²−2ab 를 씁니다.', 'Use a²+b²=(a+b)²−2ab.', '利用a²+b²=(a+b)²−2ab。'),
      `a+b=${s},\\ ab=${p} \\;\\Rightarrow\\; a^2+b^2=\\square`, ans, [
        { tex:`a^2+b^2=(a+b)^2-2ab` },
        { tex:`=${par(s)}^2-2\\times${par(p)}=\\square`, blank:ans }]);
  }
  const ans = d * d + 2 * p;
  return item(
    L3('a²+b²=(a−b)²+2ab 를 씁니다.', 'Use a²+b²=(a−b)²+2ab.', '利用a²+b²=(a−b)²+2ab。'),
    `a-b=${d},\\ ab=${p} \\;\\Rightarrow\\; a^2+b^2=\\square`, ans, [
      { tex:`a^2+b^2=(a-b)^2+2ab` },
      { tex:`=${par(d)}^2+2\\times${par(p)}=\\square`, blank:ans }]);
};

/* ── MD92 — 이차식으로 나눈 나머지 ──
   나머지 ax+b 의 a, b 와 두 근 α, β 를 먼저 고르고 P(α)=aα+b, P(β)=aβ+b 를 준다. */
NM_TGEN['md92_quadRemainder'] = function (params, rng) {
  const mode = params.mode || 'coefA';
  let al = nzInt(rng, 1, 5), be = nzInt(rng, 1, 5), g = 0;
  while(al === be && g++ < 20) be = nzInt(rng, 1, 5);
  if(al === be) be = al === 5 ? 4 : al + 1;
  if(al < be){ const t = al; al = be; be = t; }
  const a = nzInt(rng, 1, 6), b = nzInt(rng, 1, 9);
  const r1 = a * al + b, r2 = a * be + b;
  const divisor = mode === 'both' && pick(rng, [0, 1])
    ? poly([1, -(al + be), al * be])
    : `(${xMinus(al)})(${xMinus(be)})`;
  const cond = `P(${al})=${r1},\\ P(${be})=${r2}`;
  const steps = [
    { tex:`P(x)=\\{${divisor}\\}Q(x)+ax+b` },
    { tex:`${lead(al, 'a')}${more(1, 'b')}=${r1},\\quad ${lead(be, 'a')}${more(1, 'b')}=${r2}` },
    { tex:`${al - be === 1 ? '' : al - be}a=${r1}-${par(r2)}=${r1 - r2}` }
  ];
  const promptBase = mode === 'both' && divisor.indexOf('(') !== 0
    ? L3('나누는 식을 먼저 인수분해해 두 근을 찾고, 나머지 ax+b 에 두 근을 넣어 연립합니다.',
         'Factor the divisor to find its two roots, then substitute them into the remainder ax+b and solve.',
         '先把除式因式分解求出两个根，再代入余式ax+b联立求解。')
    : L3('이차식으로 나눈 나머지는 ax+b 꼴입니다. 나누는 식이 0 이 되는 두 값을 넣어 연립합니다.',
         'The remainder on division by a quadratic has the form ax+b. Substitute the two values that make the divisor 0 and solve.',
         '除以二次式的余式形如ax+b。代入使除式为0的两个值，联立求解。');

  if (mode === 'coefB') {
    return item(promptBase, `${cond},\\ P(x)\\div(${xMinus(al)})(${xMinus(be)}) \\text{: } ax+b \\;\\Rightarrow\\; b=\\square`, b,
      steps.concat([{ tex:`a=${a},\\quad b=${r1}-${par(a)}\\times${par(al)}=\\square`, blank:b }]));
  }
  if (mode === 'both') {
    const divTex = divisor.indexOf('(') === 0 ? divisor : `(${divisor})`;
    return item(promptBase, `${cond},\\ P(x)\\div${divTex} \\text{: } ax+b \\;\\Rightarrow\\; ${AB}`, [a, b],
      steps.concat([{ tex:`a=${a},\\ b=${r1}-${par(a)}\\times${par(al)}=${b} \\;\\Rightarrow\\; ${AB}`, blank:[a, b] }]));
  }
  return item(promptBase, `${cond},\\ P(x)\\div(${xMinus(al)})(${xMinus(be)}) \\text{: } ax+b \\;\\Rightarrow\\; a=\\square`, a,
    steps.concat([{ tex: al - be === 1 ? `a=\\square` : `a=${r1 - r2}\\div${al - be}=\\square`, blank:a }]));
};

/* ── MD93 — 인수정리 ──
   P(x)=(x−r)(x²+px+q) 를 먼저 만든다. 인수 찾기·인수분해 결과는 p²<4q 로 골라
   남은 이차식이 실근을 갖지 않게 한다 — 그래야 정수 근 r 이 하나로 정해진다. */
function irreducible(rng){
  const p = R(rng, -4, 4);
  const q = R(rng, Math.floor(p * p / 4) + 1, Math.floor(p * p / 4) + 6);
  return [p, q];
}
NM_TGEN['md93_factorTheorem'] = function (params, rng) {
  const mode = params.mode || 'coef';
  const r = nzInt(rng, 1, 4);

  if (mode === 'coef') {
    /* x³+kx²+cx+d, P(r)=0 → k 를 먼저 고르고 d 를 역산 */
    const k = nzInt(rng, 1, 6), c = R(rng, -9, 9);
    const d = -(r * r * r + k * r * r + c * r);
    const tail = `${more(c, 'x')}${more(d, '')}`;
    return item(
      L3(`x${r > 0 ? '−' + r : '+' + (-r)} 이 P(x)의 인수이면 P(${r})=0 입니다(인수정리).`,
         `If x${r > 0 ? '−' + r : '+' + (-r)} is a factor of P(x), then P(${r})=0 (factor theorem).`,
         `若x${r > 0 ? '−' + r : '+' + (-r)}是P(x)的因式，则P(${r})=0(因式定理)。`),
      `P(x)=x^3+kx^2${tail},\\quad P(${r})=0 \\;\\Rightarrow\\; k=\\square`, k, [
        { tex:`P(${r})=${par(r)}^3+k\\times${par(r)}^2${c === 0 ? '' : (c < 0 ? '-' : '+') + Math.abs(c) + '\\times' + par(r)}${more(d, '')}=0` },
        { tex:`${lead(r * r, 'k')}${more(r * r * r + c * r + d, '')}=0` },
        { tex:`k=\\square`, blank:k }]);
  }

  const [p, q] = irreducible(rng);
  /* (x−r)(x²+px+q) = x³+(p−r)x²+(q−pr)x−rq */
  const cs = [1, p - r, q - p * r, -r * q];
  const P = poly(cs);

  if (mode === 'findRoot') {
    return item(
      L3('상수항의 약수 ±1, ±2, … 를 차례로 넣어 P(a)=0 이 되는 정수 a 를 찾습니다.',
         'Try the divisors ±1, ±2, … of the constant term until P(a)=0 for an integer a.',
         '依次代入常数项的约数±1、±2、…，找出使P(a)=0的整数a。'),
      `P(x)=${P},\\quad P(a)=0 \\;\\Rightarrow\\; a=\\square`, r, [
        { tex:`P(${r})=${par(r)}^3${more(p - r, '')}${p - r === 0 ? '' : '\\times' + par(r) + '^2'}${more(q - p * r, '')}${q - p * r === 0 ? '' : '\\times' + par(r)}${more(-r * q, '')}=0` },
        { tex:`a=\\square`, blank:r }]);
  }

  /* factorConst — (x−α)(x²+ax+b) 의 a 또는 b */
  const askB = pick(rng, [0, 1]);
  const ans = askB ? q : p;
  return item(
    L3('인수정리로 정수 근 α 를 먼저 찾고, 조립제법으로 나머지 이차식을 구합니다.',
       'Find the integer root α with the factor theorem first, then get the remaining quadratic by synthetic division.',
       '先用因式定理找出整数根α，再用综合除法求出剩下的二次式。'),
    `${P}=(x-\\alpha)(x^2+ax+b) \\;\\Rightarrow\\; ${askB ? 'b' : 'a'}=\\square`, ans, [
      { tex:`P(${r})=0 \\;\\Rightarrow\\; \\alpha=${r}` },
      { tex:`${P}=(${xMinus(r)})(${poly([1, p, q])})` },
      { tex:`${askB ? 'b' : 'a'}=\\square`, blank:ans }]);
};

/* ── MD94 — 인수분해를 이용한 수의 계산 ── */
NM_TGEN['md94_factorArith'] = function (params, rng) {
  const mode = params.mode || 'diffSq';

  if (mode === 'perfectSq') {
    const kind = pick(rng, ['near', 'expand']);
    if (kind === 'expand') {
      /* a²+2ab+b² 에서 a+b 가 깔끔한 수 */
      const S = pick(rng, [20, 30, 40, 50, 60, 70, 80, 90, 100]);
      const b = R(rng, 2, Math.min(19, S / 2 - 1)), a = S - b;
      const ans = S * S;
      return item(
        L3('a²+2ab+b²=(a+b)² 꼴로 묶어 계산합니다.', 'Group it as a²+2ab+b²=(a+b)².', '把它合成a²+2ab+b²=(a+b)²来计算。'),
        `${a}^2+2\\times${a}\\times${b}+${b}^2=\\square`, ans, [
          { tex:`=(${a}+${b})^2=${S}^2` },
          { tex:`=\\square`, blank:ans }]);
    }
    const N = pick(rng, [20, 30, 40, 50, 60, 70, 80, 90, 100, 200, 300]);
    const k = nzInt(rng, 1, 4), n = N + k;
    const ans = n * n;
    const op = k > 0 ? '+' : '-';
    return item(
      L3('깔끔한 수에 가까운 수는 (a±b)²=a²±2ab+b² 로 펼쳐 계산합니다.', 'For a number near a round one, expand (a±b)²=a²±2ab+b².', '接近整十整百的数，用(a±b)²=a²±2ab+b²展开计算。'),
      `${n}^2=\\square`, ans, [
        { tex:`${n}^2=(${N}${op}${Math.abs(k)})^2` },
        { tex:`=${N * N}${op}${2 * N * Math.abs(k)}+${k * k}=\\square`, blank:ans }]);
  }

  if (mode === 'cube') {
    const kind = pick(rng, ['near', 'expand']);
    if (kind === 'expand') {
      const S = pick(rng, [10, 20, 30, 40, 50]);
      const b = R(rng, 1, Math.min(S / 2 - 1, 7)), a = S - b;
      const ans = S * S * S;
      return item(
        L3('a³+3a²b+3ab²+b³=(a+b)³ 꼴로 묶어 계산합니다.', 'Group it as a³+3a²b+3ab²+b³=(a+b)³.', '把它合成a³+3a²b+3ab²+b³=(a+b)³来计算。'),
        `${a}^3+3\\times${a}^2\\times${b}+3\\times${a}\\times${b}^2+${b}^3=\\square`, ans, [
          { tex:`=(${a}+${b})^3=${S}^3` },
          { tex:`=\\square`, blank:ans }]);
    }
    const N = pick(rng, [10, 20, 30, 40, 50, 100]);
    const k = nzInt(rng, 1, 3), n = N + k;
    const ans = n * n * n;
    const op = k > 0 ? '+' : '-', ak = Math.abs(k);
    return item(
      L3('(a±b)³=a³±3a²b+3ab²±b³ 로 펼쳐 계산합니다.', 'Expand (a±b)³=a³±3a²b+3ab²±b³.', '用(a±b)³=a³±3a²b+3ab²±b³展开计算。'),
      `${n}^3=\\square`, ans, [
        { tex:`${n}^3=(${N}${op}${ak})^3` },
        { tex:`=${N * N * N}${op}${3 * N * N * ak}+${3 * N * ak * ak}${op}${ak * ak * ak}=\\square`, blank:ans }]);
  }

  /* diffSq(기본) — a²−b²=(a+b)(a−b), a+b 가 깔끔한 수 */
  const S = pick(rng, [20, 30, 40, 50, 60, 80, 100, 200]);
  let dd = R(rng, 2, Math.min(40, S - 2));
  if (dd % 2) dd += 1;                     /* S 가 짝수라 a−b 도 짝수여야 a, b 가 정수 */
  if (dd >= S) dd = S - 2;
  const a = (S + dd) / 2, b = (S - dd) / 2;
  const ans = S * dd;
  return item(
    L3('a²−b²=(a+b)(a−b) 로 바꾸면 곱셈 한 번이 됩니다.', 'Rewrite a²−b² as (a+b)(a−b) and it becomes one multiplication.', '把a²−b²写成(a+b)(a−b)，就只需一次乘法。'),
    `${a}^2-${b}^2=\\square`, ans, [
      { tex:`=(${a}+${b})(${a}-${b})=${S}\\times${dd}` },
      { tex:`=\\square`, blank:ans }]);
};

/* ── MD95 — 복소수의 사칙과 켤레 (답: 실부·허부 2칸) ── */
NM_TGEN['md95_complexArith'] = function (params, rng) {
  const mode = params.mode || 'addSub';
  const ask = `=a+bi \\;\\Rightarrow\\; ${AB}`;

  if (mode === 'mul') {
    const a = nzInt(rng, 1, 6), b = nzInt(rng, 1, 6), c = nzInt(rng, 1, 6), d = nzInt(rng, 1, 6);
    const re = a * c - b * d, im = a * d + b * c;
    return item(
      L3('분배법칙으로 전개하고 i²=−1 로 바꿉니다.', 'Expand with the distributive law and replace i² with −1.', '用分配律展开，再把i²换成−1。'),
      `(${cx(a, b)})(${cx(c, d)})${ask}`, [re, im], [
        { tex:`=${a * c}${more(a * d, 'i')}${more(b * c, 'i')}${more(b * d, 'i^2')}` },
        { tex:`=${a * c}${more(a * d + b * c, 'i')}${more(-b * d, '')}` },
        { tex:`=${cx(re, im)} \\;\\Rightarrow\\; ${AB}`, blank:[re, im] }]);
  }

  if (mode === 'div') {
    /* 몫 z=e+fi 와 나누는 수 w=c+di 를 먼저 고르고 분자 = z·w */
    const e = nzInt(rng, 1, 4), f = nzInt(rng, 1, 4), c = nzInt(rng, 1, 3), d = nzInt(rng, 1, 3);
    const nr = e * c - f * d, ni = e * d + f * c;
    if (nr === 0 || ni === 0) return NM_TGEN['md95_complexArith'](params, rng);
    const nn = c * c + d * d;
    const tr = nr * c + ni * d, ti = ni * c - nr * d;   /* 분자 × 켤레 */
    return item(
      L3('분모의 켤레복소수를 분모·분자에 곱해 분모를 실수로 만듭니다.', 'Multiply top and bottom by the conjugate of the denominator to make it real.', '分子分母同乘分母的共轭复数，使分母变为实数。'),
      `\\dfrac{${cx(nr, ni)}}{${cx(c, d)}}${ask}`, [e, f], [
        { tex:`=\\dfrac{(${cx(nr, ni)})(${cx(c, -d)})}{(${cx(c, d)})(${cx(c, -d)})}` },
        { tex:`=\\dfrac{${cx(tr, ti)}}{${nn}}` },
        { tex:`=${cx(e, f)} \\;\\Rightarrow\\; ${AB}`, blank:[e, f] }]);
  }

  /* addSub(기본) */
  const a = nzInt(rng, 1, 9), b = nzInt(rng, 1, 9), c = nzInt(rng, 1, 9), d = nzInt(rng, 1, 9);
  const minus = pick(rng, [0, 1]);
  const re = minus ? a - c : a + c, im = minus ? b - d : b + d;
  return item(
    L3('실수부분끼리, 허수부분끼리 계산합니다.', 'Combine the real parts together and the imaginary parts together.', '实部与实部、虚部与虚部分别计算。'),
    `(${cx(a, b)})${minus ? '-' : '+'}(${cx(c, d)})${ask}`, [re, im], [
      { tex:`a=${a}${minus ? '-' : '+'}${par(c)}=${re},\\quad b=${b}${minus ? '-' : '+'}${par(d)}=${im}` },
      { tex:`${AB}`, blank:[re, im] }]);
};

/* ── MD96 — 복소수가 서로 같을 조건 ──
   x, y 를 먼저 고르고 실수부분·허수부분을 역산한다. */
NM_TGEN['md96_complexEqual'] = function (params, rng) {
  const mode = params.mode || 'one';
  const XY = `x=\\square,\\ y=\\square`;
  const x = nzInt(rng, 1, 9), y = nzInt(rng, 1, 9);

  if (mode === 'mixed') {
    /* x(p1+q1 i) + y(p2+q2 i) = c + di — 연립일차방정식 */
    let p1, q1, p2, q2, g = 0;
    do {
      p1 = nzInt(rng, 1, 4); q1 = nzInt(rng, 1, 4); p2 = nzInt(rng, 1, 4); q2 = nzInt(rng, 1, 4);
    } while (p1 * q2 - p2 * q1 === 0 && g++ < 30);
    if (p1 * q2 - p2 * q1 === 0) { p1 = 1; q1 = 1; p2 = 2; q2 = -1; }
    const c = p1 * x + p2 * y, d = q1 * x + q2 * y;
    return item(
      L3('좌변을 전개해 실수부분과 허수부분으로 모은 뒤, 양변을 비교해 연립방정식을 풉니다. x, y 는 실수입니다.',
         'Expand the left side, gather real and imaginary parts, compare both sides and solve the system. x and y are real.',
         '展开左边，整理成实部和虚部，比较两边后解方程组。x、y是实数。'),
      `x(${cx(p1, q1)})+y(${cx(p2, q2)})=${cx(c, d)} \\;\\Rightarrow\\; ${XY}`, [x, y], [
        { tex:`(${lead(p1, 'x')}${more(p2, 'y')})+(${lead(q1, 'x')}${more(q2, 'y')})i=${cx(c, d)}` },
        { tex:`${lead(p1, 'x')}${more(p2, 'y')}=${c},\\quad ${lead(q1, 'x')}${more(q2, 'y')}=${d}` },
        { tex:`${XY}`, blank:[x, y] }]);
  }

  const p = R(rng, 1, 3), q = nzInt(rng, 1, 9);   /* 실수부분 px+q */
  const m = R(rng, 1, 3), n = nzInt(rng, 1, 9);   /* 허수부분 my+n */
  const c = p * x + q, d = m * y + n;

  if (mode === 'two') {
    return item(
      L3('두 복소수가 같으면 실수부분끼리, 허수부분끼리 같습니다. x, y 는 실수입니다.',
         'Two complex numbers are equal when their real parts match and their imaginary parts match. x and y are real.',
         '两个复数相等，则实部相等、虚部相等。x、y是实数。'),
      `(${lead(p, 'x')}${more(q, '')})+(${lead(m, 'y')}${more(n, '')})i=${cx(c, d)} \\;\\Rightarrow\\; ${XY}`, [x, y], [
        { tex:`${lead(p, 'x')}${more(q, '')}=${c},\\quad ${lead(m, 'y')}${more(n, '')}=${d}` },
        { tex:`${XY}`, blank:[x, y] }]);
  }

  /* one(기본) — 한 쪽만 미지수 */
  const b = nzInt(rng, 1, 9);
  if (pick(rng, [0, 1])) {
    return item(
      L3('허수부분이 이미 같으니 실수부분끼리 같다고 놓습니다. x 는 실수입니다.',
         'The imaginary parts already match, so set the real parts equal. x is real.',
         '虚部已经相等，令实部相等即可。x是实数。'),
      `(${lead(p, 'x')}${more(q, '')})${more(b, 'i')}=${cx(c, b)} \\;\\Rightarrow\\; x=\\square`, x, [
        { tex:`${lead(p, 'x')}${more(q, '')}=${c}` },
        { tex:`x=\\square`, blank:x }]);
  }
  return item(
    L3('실수부분이 이미 같으니 허수부분끼리 같다고 놓습니다. y 는 실수입니다.',
       'The real parts already match, so set the imaginary parts equal. y is real.',
       '实部已经相等，令虚部相等即可。y是实数。'),
    `${b}+(${lead(m, 'y')}${more(n, '')})i=${cx(b, d)} \\;\\Rightarrow\\; y=\\square`, y, [
      { tex:`${lead(m, 'y')}${more(n, '')}=${d}` },
      { tex:`y=\\square`, blank:y }]);
};

/* ── MD97 — i 의 거듭제곱·음수의 제곱근 ── */
const IPOW = [[1, 0], [0, 1], [-1, 0], [0, -1]];   /* i^0, i^1, i^2, i^3 */
function ipow(k){ return k === 0 ? '1' : k === 1 ? 'i' : `i^{${k}}`; }
function chain(a, b){ return a === b ? a : `${a}=${b}`; }
function divFour(n){ return `${n}=4\\times${Math.floor(n / 4)}${n % 4 ? '+' + (n % 4) : ''}`; }
NM_TGEN['md97_iPower'] = function (params, rng) {
  const mode = params.mode || 'power';
  const ask = `=a+bi \\;\\Rightarrow\\; ${AB}`;

  if (mode === 'sum') {
    const n = R(rng, 5, 99), from0 = pick(rng, [0, 1]);
    /* 합 = i^0(선택)+i^1+…+i^n — 넷씩 묶으면 0 */
    let re = from0 ? 1 : 0, im = 0;
    for (let k = 1; k <= n; k++) { re += IPOW[k % 4][0]; im += IPOW[k % 4][1]; }
    const head = from0 ? '1+i+i^2+i^3+\\cdots' : 'i+i^2+i^3+i^4+\\cdots';
    const full = Math.floor(n / 4) * 4;
    return item(
      L3('i+i²+i³+i⁴=0 이므로 넷씩 묶으면 사라집니다. 남은 항만 더합니다.', 'Since i+i²+i³+i⁴=0, every block of four vanishes; add only the leftover terms.', '因为i+i²+i³+i⁴=0，每四项一组消去，只加剩下的项。'),
      `${head}+i^{${n}}${ask}`, [re, im], [
        { tex:`i+i^2+\\cdots+i^{${full}}=0` },
        { tex:`=${cx(re, im)} \\;\\Rightarrow\\; ${AB}`, blank:[re, im] }]);
  }

  if (mode === 'negRoot') {
    const kind = pick(rng, ['mul', 'div']);
    if (kind === 'div') {
      const bb = pick(rng, [2, 3, 5, 6, 7]), k = R(rng, 2, 6), aa = bb * k * k;
      return item(
        L3('√(−a)=√a·i 로 바꾼 뒤 계산합니다. 둘 다 음수일 때의 나눗셈은 i 가 약분됩니다.', 'Write √(−a) as √a·i first; when both are negative the i cancels in the quotient.', '先把√(−a)写成√a·i；两者都为负数时，相除i被约去。'),
        `\\dfrac{\\sqrt{-${aa}}}{\\sqrt{-${bb}}}=\\square`, k, [
          { tex:`=\\dfrac{\\sqrt{${aa}}\\,i}{\\sqrt{${bb}}\\,i}=\\sqrt{${k * k}}` },
          { tex:`=\\square`, blank:k }]);
    }
    const s = pick(rng, [2, 3, 5, 6, 7]), m = R(rng, 1, 5), n = R(rng, 1, 5);
    const aa = s * m * m, bb = s * n * n;
    const ans = -s * m * n;
    return item(
      L3('√(−a)=√a·i 로 바꾼 뒤 곱합니다. i²=−1 이라 부호가 바뀝니다.', 'Write √(−a) as √a·i and multiply; since i²=−1 the sign flips.', '先把√(−a)写成√a·i再相乘；因为i²=−1，符号改变。'),
      `\\sqrt{-${aa}}\\times\\sqrt{-${bb}}=\\square`, ans, [
        { tex:`=\\sqrt{${aa}}\\,i\\times\\sqrt{${bb}}\\,i=\\sqrt{${aa * bb}}\\,i^2` },
        { tex:`=${s * m * n}\\times(-1)=\\square`, blank:ans }]);
  }

  /* power(기본) — i^n 또는 i^n 의 거듭 곱 */
  const n = R(rng, 5, 99);
  const [re, im] = IPOW[n % 4];
  const kind = pick(rng, ['plain', 'neg']);
  if (kind === 'neg') {
    /* (−i)^n = (−1)^n i^n */
    const sg = n % 2 ? -1 : 1;
    const r2 = sg * re + 0, i2 = sg * im + 0;
    return item(
      L3('(−i)ⁿ=(−1)ⁿ·iⁿ 이고, iⁿ 은 지수를 4로 나눈 나머지로 정해집니다.', '(−i)ⁿ=(−1)ⁿ·iⁿ, and iⁿ depends only on n mod 4.', '(−i)ⁿ=(−1)ⁿ·iⁿ，iⁿ由n除以4的余数决定。'),
      `(-i)^{${n}}${ask}`, [r2, i2], [
        { tex:`(-i)^{${n}}=(-1)^{${n}}\\,i^{${n}},\\quad ${divFour(n)}` },
        { tex:`=${chain(`${sg < 0 ? '-' : ''}${ipow(n % 4)}`, cx(r2, i2))} \\;\\Rightarrow\\; ${AB}`, blank:[r2, i2] }]);
  }
  return item(
    L3('i⁴=1 이므로 지수를 4로 나눈 나머지만 봅니다.', 'Since i⁴=1, only the remainder of the exponent divided by 4 matters.', '因为i⁴=1，只看指数除以4的余数。'),
    `i^{${n}}${ask}`, [re, im], [
      { tex:divFour(n) },
      { tex:`i^{${n}}=${chain(ipow(n % 4), cx(re, im))} \\;\\Rightarrow\\; ${AB}`, blank:[re, im] }]);
};

/* ── MD98 — 두 수를 근으로 하는 이차방정식·켤레근 (답: a, b 2칸) ── */
NM_TGEN['md98_buildQuadratic'] = function (params, rng) {
  const mode = params.mode || 'intRoots';
  const EQ = `x^2+ax+b=0`;

  if (mode === 'shifted') {
    /* 원래 방정식 x²+px+q=0 의 두 근 α, β 에서 새 두 근 */
    const p = nzInt(rng, 1, 7), q = nzInt(rng, 1, 9);
    const s = -p, P = q;
    const kind = pick(rng, ['shift', 'double', 'square']);
    let ns, np, roots, st;
    if (kind === 'shift') {
      const k = nzInt(rng, 1, 3);
      ns = s + 2 * k; np = P + k * s + k * k;
      roots = `\\alpha${more(k, '')},\\ \\beta${more(k, '')}`;
      st = `(\\alpha+\\beta)${more(2 * k, '')}=${ns},\\quad \\alpha\\beta${more(k, '')}(\\alpha+\\beta)${more(k * k, '')}=${np}`;
    } else if (kind === 'double') {
      const k = pick(rng, [2, 3, -2, -1]);
      ns = k * s; np = k * k * P;
      roots = `${lead(k, '\\alpha')},\\ ${lead(k, '\\beta')}`;
      st = `${par(k)}(\\alpha+\\beta)=${ns},\\quad ${k * k}\\alpha\\beta=${np}`;
    } else {
      ns = s * s - 2 * P; np = P * P;
      roots = `\\alpha^2,\\ \\beta^2`;
      st = `(\\alpha+\\beta)^2-2\\alpha\\beta=${ns},\\quad (\\alpha\\beta)^2=${np}`;
    }
    const a = -ns, b = np;
    return item(
      L3('먼저 근과 계수의 관계로 α+β, αβ 를 구하고, 새 두 근의 합과 곱을 계산합니다. 새 방정식은 x²−(합)x+(곱)=0 입니다.',
         'Get α+β and αβ from the coefficients, then the sum and product of the new roots. The new equation is x²−(sum)x+(product)=0.',
         '先由根与系数的关系求α+β、αβ，再算新两根的和与积。新方程为x²−(和)x+(积)=0。'),
      `${poly([1, p, q])}=0 \\text{: } \\alpha,\\ \\beta \\;\\Rightarrow\\; ${roots} \\text{: } ${EQ},\\ ${AB}`, [a, b], [
        { tex:`\\alpha+\\beta=${s},\\quad \\alpha\\beta=${P}` },
        { tex:st },
        { tex:`a=-${par(ns)},\\ b=${np} \\;\\Rightarrow\\; ${AB}`, blank:[a, b] }]);
  }

  if (mode === 'conjugate') {
    const m = nzInt(rng, 1, 7);
    if (pick(rng, [0, 1])) {
      const n = pick(rng, [2, 3, 5, 6, 7, 10, 11]);
      const a = -2 * m, b = m * m - n;
      return item(
        L3('a, b 는 유리수이고 α 는 방정식의 한 근입니다. 계수가 유리수이면 m+√n 이 근일 때 m−√n 도 근입니다. 두 근의 합과 곱을 구합니다.',
           'a and b are rational and α is a root. With rational coefficients, if m+√n is a root then so is m−√n. Find the sum and product of the two roots.',
           'a、b是有理数，α是方程的一个根。系数为有理数时，若m+√n是根，则m−√n也是根。求两根之和与积。'),
        `${EQ},\\quad \\alpha=${m}+\\sqrt{${n}} \\;\\Rightarrow\\; ${AB}`, [a, b], [
          { tex:`\\beta=${m}-\\sqrt{${n}}` },
          { tex:`\\alpha+\\beta=${2 * m},\\quad \\alpha\\beta=${par(m)}^2-${n}=${b}` },
          { tex:`${AB}`, blank:[a, b] }]);
    }
    const n = nzInt(rng, 1, 5);
    const a = -2 * m, b = m * m + n * n;
    return item(
      L3('a, b 는 실수이고 α 는 방정식의 한 근입니다. 계수가 실수이면 허근 m+ni 의 켤레 m−ni 도 근입니다. 두 근의 합과 곱을 구합니다.',
         'a and b are real and α is a root. With real coefficients, the conjugate of a complex root m+ni is also a root. Find the sum and product of the two roots.',
         'a、b是实数，α是方程的一个根。系数为实数时，虚根m+ni的共轭m−ni也是根。求两根之和与积。'),
      `${EQ},\\quad \\alpha=${cx(m, n)} \\;\\Rightarrow\\; ${AB}`, [a, b], [
        { tex:`\\beta=${cx(m, -n)}` },
        { tex:`\\alpha+\\beta=${2 * m},\\quad \\alpha\\beta=${par(m)}^2+${par(n)}^2=${b}` },
        { tex:`${AB}`, blank:[a, b] }]);
  }

  /* intRoots(기본) */
  const r1 = nzInt(rng, 1, 9), r2 = nzInt(rng, 1, 9);
  const a = -(r1 + r2), b = r1 * r2;
  return item(
    L3('두 근이 α, β 이면 x²−(α+β)x+αβ=0 입니다.', 'If the roots are α and β, the equation is x²−(α+β)x+αβ=0.', '两根为α、β时，方程为x²−(α+β)x+αβ=0。'),
    `\\alpha=${r1},\\ \\beta=${r2} \\;\\Rightarrow\\; ${EQ},\\ ${AB}`, [a, b], [
      { tex:`\\alpha+\\beta=${r1 + r2},\\quad \\alpha\\beta=${b}` },
      { tex:`a=-(\\alpha+\\beta),\\ b=\\alpha\\beta \\;\\Rightarrow\\; ${AB}`, blank:[a, b] }]);
};

/* ── MD99 — 이차함수의 그래프와 x축·직선의 위치 관계 ──
   두 그래프의 교점은 f(x)−g(x)=0 의 실근이다. 그 이차식을 먼저 정하고 역산한다. */
function kPart(n){ return n === 0 ? 'k' : `(k${more(-n, '')})`; }
NM_TGEN['md99_graphLine'] = function (params, rng) {
  const mode = params.mode || 'count';
  const useLine = pick(rng, [0, 1, 1]);
  const m = useLine ? nzInt(rng, 1, 5) : 0, n = useLine ? R(rng, -6, 6) : 0;
  const G = useLine ? `y=${lead(m, 'x')}${more(n, '')}` : `y=0`;

  if (mode === 'tangent') {
    /* x²+bx+c 와 mx+n 이 접함: (b−m)² = 4(c−n). b−m 을 짝수로 */
    const h = nzInt(rng, 1, useLine ? 5 : 9);   /* 차이식 = (x+h)² */
    const b = m + 2 * h;
    const askLine = useLine && pick(rng, [0, 1]);
    if (askLine) {
      /* 직선의 y절편 k 를 묻는다: c 를 주고 n=k=c−h² */
      const c = R(rng, -5, 9) || 1;
      const k = c - h * h;
      return item(
        L3('두 식을 같다고 놓은 이차방정식의 판별식이 0 이면 접합니다.', 'The graphs touch when the equation from setting them equal has discriminant 0.', '令两式相等所得二次方程的判别式为0时相切。'),
        `y=${poly([1, b, c])},\\ y=${lead(m, 'x')}+k \\;\\Rightarrow\\; k=\\square`, k, [
          { tex:`${poly([1, b - m, c])}-k=0` },
          { tex:`D=${par(b - m)}^2-4(${c}-k)=0` },
          { tex:`k=\\square`, blank:k }]);
    }
    const k = n + h * h;                    /* 상수항 k */
    return item(
      L3('두 식을 같다고 놓은 이차방정식의 판별식이 0 이면 접합니다.', 'The graphs touch when the equation from setting them equal has discriminant 0.', '令两式相等所得二次方程的判别式为0时相切。'),
      `y=${poly([1, b, 0])}+k,\\ ${G} \\;\\Rightarrow\\; k=\\square`, k, [
        { tex:`${poly([1, b - m, 0])}${useLine ? `+k${more(-n, '')}` : '+k'}=0` },
        { tex:`D=${par(b - m)}^2-4${kPart(n)}=0` },
        { tex:`k=\\square`, blank:k }]);
  }

  if (mode === 'range') {
    /* 두 점에서 만나거나(k<경계) 만나지 않을(k>경계) 조건의 끝값 */
    const h = nzInt(rng, 1, useLine ? 5 : 9), b = m + 2 * h;
    const bound = n + h * h;
    const meet = pick(rng, [0, 1]);
    const rel = meet ? '<' : '>';
    return item(
      meet
        ? L3('서로 다른 두 점에서 만나려면 판별식 D>0 이어야 합니다. k 의 범위의 끝값을 구합니다.', 'To meet at two distinct points the discriminant must satisfy D>0. Find the endpoint of the range of k.', '要在两个不同点相交，判别式须D>0。求k的范围的端点。')
        : L3('만나지 않으려면 판별식 D<0 이어야 합니다. k 의 범위의 끝값을 구합니다.', 'To have no common point the discriminant must satisfy D<0. Find the endpoint of the range of k.', '要没有交点，判别式须D<0。求k的范围的端点。'),
      `y=${poly([1, b, 0])}+k,\\ ${G} \\;\\Rightarrow\\; k${rel}\\square`, bound, [
        { tex:`D=${par(b - m)}^2-4${kPart(n)}${meet ? '>' : '<'}0` },
        { tex:`k${rel}\\square`, blank:bound }]);
  }

  /* count(기본) — 교점의 개수 0·1·2 를 먼저 고른다 */
  const target = pick(rng, [0, 1, 2]);
  const a = pick(rng, [1, 1, 2, -1]);
  let diffC;                                 /* f−g = a·(차이식) */
  if (target === 2) {
    const r1 = R(rng, -5, 5); let r2 = R(rng, -5, 5); if (r2 === r1) r2 = r1 + R(rng, 1, 3);
    diffC = [1, -(r1 + r2), r1 * r2];
  } else if (target === 1) {
    const r = R(rng, -5, 5); diffC = [1, -2 * r, r * r];
  } else {
    const r = R(rng, -4, 4), e = R(rng, 1, 6); diffC = [1, -2 * r, r * r + e];
  }
  const fc = [a * diffC[0], a * diffC[1] + m, a * diffC[2] + n];
  const dc = [a * diffC[0], a * diffC[1], a * diffC[2]];
  const D = dc[1] * dc[1] - 4 * dc[0] * dc[2];
  return item(
    L3('두 식을 같다고 놓은 이차방정식의 판별식 D 의 부호로 교점의 개수를 정합니다(D>0 이면 2, D=0 이면 1, D<0 이면 0).',
       'Set the two equal; the sign of the discriminant D of that quadratic gives the number of common points (D>0: 2, D=0: 1, D<0: 0).',
       '令两式相等，由所得二次方程判别式D的符号定交点个数(D>0为2，D=0为1，D<0为0)。'),
    `y=${poly(fc)},\\ ${G} \\;\\Rightarrow\\; \\square`, target, [
      { tex:`${poly(dc)}=0` },
      { tex:`D=${par(dc[1])}^2-4\\times${par(dc[0])}\\times${par(dc[2])}=${D}` },
      { tex:`\\square`, blank:target }]);
};

/* ── MD100 — 제한된 범위에서 이차함수의 최대·최소 ──
   y=a(x−p)²+q 를 먼저 고르고 일반형으로 펼쳐 보여 준다. */
NM_TGEN['md100_rangeExtrema'] = function (params, rng) {
  const mode = params.mode || 'inside';
  const a = pick(rng, [1, 1, 2, -1, -1, -2]);
  const p = R(rng, -4, 4), q = R(rng, -9, 9);
  const f = x => a * (x - p) * (x - p) + q;
  const b = -2 * a * p, c0 = a * p * p + q;
  let lo, hi;
  if (mode === 'outside') {
    if (pick(rng, [0, 1])) { lo = p + R(rng, 1, 3); hi = lo + R(rng, 1, 4); }
    else { hi = p - R(rng, 1, 3); lo = hi - R(rng, 1, 4); }
  } else {
    lo = p - R(rng, 1, 4); hi = p + R(rng, 1, 4);
  }
  const fl = f(lo), fh = f(hi), inside = lo <= p && p <= hi;
  const vals = [fl, fh].concat(inside ? [q] : []);
  const mx = Math.max.apply(null, vals), mn = Math.min.apply(null, vals);
  const range = `\\ (${lo}\\le x\\le ${hi})`;
  const sq = `${a === 1 ? '' : a === -1 ? '-' : a}${p === 0 ? 'x^2' : `(${xMinus(p)})^2`}`;
  const vertexForm = `y=${sq}${more(q, '')}`;

  if (mode === 'unknown') {
    /* 상수항 k 를 모르고 최댓값·최솟값 하나를 안다 → k */
    const askMax = pick(rng, [0, 1]);
    const M = askMax ? mx : mn;
    const k = c0;                          /* 원래 상수항이 답 */
    const shift = M - k;                   /* k 를 뺀 부분의 극값 */
    const tag = askMax ? 'M' : 'm';        /* 교과서 표기: 최댓값 M, 최솟값 m (\max 기호는 쓰지 않는다) */
    const def = askMax
      ? L3('최댓값을 M 이라 합니다. ', 'Let M be the maximum value. ', '设最大值为M。')
      : L3('최솟값을 m 이라 합니다. ', 'Let m be the minimum value. ', '设最小值为m。');
    return item(
      L3(def.ko + '상수항 k 는 그래프를 위아래로만 옮깁니다. k 를 뺀 식의 최댓값·최솟값을 먼저 구하고 주어진 값과 비교합니다.',
         def.en + 'The constant k only shifts the graph up or down. Find the extreme value without k first, then compare with the given value.',
         def.zh + '常数k只使图象上下平移。先求不含k部分的最值，再与给定值比较。'),
      `y=${poly([a, b, 0])}+k${range},\\ ${tag}=${M} \\;\\Rightarrow\\; k=\\square`, k, [
        { tex:`y=${sq}${more(-a * p * p, '')}+k` },
        { tex:`${tag}=k${more(shift, '')}=${M}` },
        { tex:`k=\\square`, blank:k }]);
  }

  const askMax = pick(rng, [0, 1]);
  const ans = askMax ? mx : mn;
  const tag = askMax ? 'M' : 'm';
  const def = askMax
    ? L3('최댓값을 M 이라 합니다. ', 'Let M be the maximum value. ', '设最大值为M。')
    : L3('최솟값을 m 이라 합니다. ', 'Let m be the minimum value. ', '设最小值为m。');
  const how = inside
    ? L3('꼭짓점이 범위 안에 있으면 꼭짓점과 양 끝점의 함숫값을 비교합니다.', 'If the vertex lies in the interval, compare the values at the vertex and both endpoints.', '顶点在范围内时，比较顶点与两端点的函数值。')
    : L3('꼭짓점이 범위 밖에 있으면 양 끝점의 함숫값만 비교합니다.', 'If the vertex lies outside the interval, compare only the values at the two endpoints.', '顶点在范围外时，只比较两端点的函数值。');
  return item(
    L3(def.ko + how.ko, def.en + how.en, def.zh + how.zh),
    `y=${poly([a, b, c0])}${range} \\;\\Rightarrow\\; ${tag}=\\square`, ans, [
      { tex:vertexForm },
      { tex:`f(${lo})=${fl},\\quad f(${hi})=${fh}${inside ? `,\\quad f(${p})=${q}` : ''}` },
      { tex:`${tag}=\\square`, blank:ans }]);
};

if (typeof module !== 'undefined' && module.exports) module.exports = NM_TGEN;
})();
