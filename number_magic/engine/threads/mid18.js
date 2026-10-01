/* ============================================================
   Numbers of Magic — MD101~MD114 공통수학1 새 유형 생성기 (2026-09-29)
   근거: docs/high-build-spec.md (공통수학1 새 유형 목록 뒤 14개).
   교재(교과연산 J·K)는 챕터 제목만 근거로 쓰고, 문제는 전부 새로 만든다.

   MD101 고차방정식               oneRoot · largest · biquad
   MD102 삼차방정식의 근과 계수    sum · product · pair
   MD103 x³=1 의 허근 ω            basic · powerSum · expr
   MD104 연립이차방정식            linQuad · quadQuad · symmetric   (모두 2칸)
   MD105 부정방정식                intCount · product · real(2칸)
   MD106 식의 값의 범위            sum · diff · prod               (모두 2칸: 아래끝·위끝)
   MD107 연립일차부등식            count · largest · unknown
   MD108 절댓값을 포함한 부등식     linear(2칸) · count · quad
   MD109 연립이차부등식            count · minInt · empty
   MD110 합의 법칙·곱의 법칙        sum · product · divisors
   MD111 순열                      value · adjacent · apart
   MD112 사전식 배열·자연수의 개수   rank · even · zero
   MD113 조합                      value · include · atLeast
   MD114 뽑아서 나열·도형의 개수     arrange · lines · triangles

   계약: NM_TGEN[gen](params, rng), Math.random 금지. 답은 정수 또는 정수 배열.
   **답을 먼저 고르고 식을 역산한다** — 근·해·끝값을 먼저 정한 뒤 계수를 만든다.
   경우의 수는 공식으로 답을 내고, 검산 스크립트가 전부 세어 대조한다.
   풀이 마지막 단계의 blank = 답 전체. 표기: 계수 1·0 숨김, 음수는 괄호, 이중부호 금지.
   max·min·∈·mod 기호는 쓰지 않는다(교과서 말: 가장 큰 값, 최댓값 M …).
   ============================================================ */
(function(){
'use strict';
const NM_TGEN = window.NM_TGEN = window.NM_TGEN || {};
const { R, pick, shuffle } = NM_RNG;

/* ── 공용 헬퍼(파일별 독립 정의 관례) ── */
function nzInt(rng, lo, hi){ return R(rng, lo, hi) * pick(rng, [1, -1]); }
function par(n){ return n < 0 ? `(${n})` : String(n); }
function hasNeg(v){ return Array.isArray(v) ? v.some(x => x < 0) : v < 0; }
function L3(ko, en, zh){ return { ko, en, zh }; }
function lead(c, v){ if(!v) return String(c); return c === 1 ? v : c === -1 ? `-${v}` : `${c}${v}`; }
function more(c, v){
  if(c === 0) return '';
  const a = Math.abs(c);
  return (c < 0 ? ' - ' : ' + ') + (v ? (a === 1 ? v : `${a}${v}`) : String(a));
}
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
/* 여러 문자 항: [[계수, 문자], …] */
function terms(list){
  let s = '';
  list.forEach(([c, v]) => { if(c === 0) return; s += s ? more(c, v) : lead(c, v); });
  return s || '0';
}
function xMinus(r, v){ v = v || 'x'; return r === 0 ? v : `${v}${more(-r, '')}`; }
function fac(r, v){ return r === 0 ? (v || 'x') : `(${xMinus(r, v)})`; }
function gcd(a, b){ a = Math.abs(a); b = Math.abs(b); while(b){ const t = a % b; a = b; b = t; } return a; }
/* n/d 를 기약분수 tex 로(분모는 양수, 정수면 정수) */
function frac(n, d){
  if(d < 0){ n = -n; d = -d; }
  const g = gcd(n, d) || 1; n /= g; d /= g;
  if(d === 1) return String(n);
  return n < 0 ? `-\\dfrac{${-n}}{${d}}` : `\\dfrac{${n}}{${d}}`;
}
function item(prompt, tex, answer, solution, extra){
  const p = { prompt, tex, answer, answerType:'number', widget:'numpad', negative: hasNeg(answer), solution };
  return Object.assign(p, extra || {});
}
/* 문장제 — MD88 과 같은 모양(word·wordAsk 가 있으면 인쇄는 글로 싣는다) */
function word(story, ask, tex, answer, solution){
  const prompt = {};
  ['ko', 'en', 'zh'].forEach(l => { prompt[l] = story[l] + ' ' + ask[l]; });
  const p = item(prompt, tex, answer, solution);
  p.word = story; p.wordAsk = ask;
  return p;
}
function fact(n){ let f = 1; for(let i = 2; i <= n; i++) f *= i; return f; }
function perm(n, r){ if(r < 0 || r > n) return 0; let f = 1; for(let i = 0; i < r; i++) f *= n - i; return f; }
function comb(n, r){ if(r < 0 || r > n) return 0; return perm(n, r) / fact(r); }
function desc(n, r){ const a = []; for(let i = 0; i < r; i++) a.push(n - i); return a; }
function times(arr){ return arr.join('\\times'); }
const XY = `x=\\square,\\ y=\\square`;
/* \le·\ge 뒤에 문자가 바로 붙으면 \lex 처럼 다른 명령이 되므로 공백을 붙여 둔다 */
const OP = { lt:'<', le:'\\le ', gt:'>', ge:'\\ge ' };
const FLIP = { lt:'gt', le:'ge', gt:'lt', ge:'le' };
function cases(a, b){ return `\\begin{cases} ${a} \\\\ ${b} \\end{cases}`; }

/* ── MD101 — 고차방정식 ── */
function irreducible(rng){
  const p = R(rng, -4, 4);
  const q = R(rng, Math.floor(p * p / 4) + 1, Math.floor(p * p / 4) + 6);
  return [p, q];
}
NM_TGEN['md101_higherEq'] = function (params, rng) {
  const mode = params.mode || 'oneRoot';

  if (mode === 'largest') {
    let rs, g = 0;
    do { rs = [R(rng, -5, 5), R(rng, -5, 5), R(rng, -5, 5)]; }
    while ((rs[0] === rs[1] || rs[1] === rs[2] || rs[0] === rs[2]) && g++ < 50);
    if (rs[0] === rs[1] || rs[1] === rs[2] || rs[0] === rs[2]) rs = [-1, 2, 3];
    const [a, b, c] = rs;
    const cs = [1, -(a + b + c), a * b + b * c + c * a, -a * b * c];
    const sorted = rs.slice().sort((u, v) => u - v);
    const askBig = pick(rng, [0, 1]);
    const ans = askBig ? sorted[2] : sorted[0];
    /* 먼저 찾는 근: 절댓값이 가장 작은 근(상수항의 약수를 작은 것부터 넣으면 먼저 나온다) */
    const first = rs.slice().sort((u, v) => Math.abs(u) - Math.abs(v) || u - v)[0];
    const rest = rs.filter(x => x !== first);
    return item(
      askBig
        ? L3('세 근이 모두 정수입니다. 인수정리로 근 하나를 찾아 인수분해하고, 가장 큰 근을 α 라 할 때 α 를 구합니다.',
             'All three roots are integers. Find one root with the factor theorem, factor, and let α be the largest root. Find α.',
             '三个根都是整数。用因式定理找出一个根并因式分解，设最大的根为α，求α。')
        : L3('세 근이 모두 정수입니다. 인수정리로 근 하나를 찾아 인수분해하고, 가장 작은 근을 α 라 할 때 α 를 구합니다.',
             'All three roots are integers. Find one root with the factor theorem, factor, and let α be the smallest root. Find α.',
             '三个根都是整数。用因式定理找出一个根并因式分解，设最小的根为α，求α。'),
      `${poly(cs)}=0 \\;\\Rightarrow\\; \\alpha=\\square`, ans, [
        { tex:`P(x)=${poly(cs)},\\quad P(${first})=0` },
        { tex:`${fac(first)}(${poly([1, -(rest[0] + rest[1]), rest[0] * rest[1]])})=0` },
        { tex:`${fac(sorted[0])}${fac(sorted[1])}${fac(sorted[2])}=0` },
        { tex:`\\alpha=\\square`, blank:ans }]);
  }

  if (mode === 'biquad') {
    const four = pick(rng, [0, 1]);
    let a = R(rng, 1, 6), t2;
    if (four) { let b = R(rng, 1, 6), g = 0; while (b === a && g++ < 20) b = R(rng, 1, 6); if (b === a) b = a === 6 ? 5 : a + 1; t2 = b * b; }
    else t2 = -R(rng, 1, 9);
    const t1 = a * a;
    const cs = [1, 0, -(t1 + t2), 0, t1 * t2];
    const askProd = pick(rng, [0, 1]);
    const big = four ? Math.max(a, Math.round(Math.sqrt(t2))) : a;
    const ans = askProd ? (four ? t1 * t2 : -t1) : big;
    const rootsTex = `x=\\pm ${a},\\ x=\\pm ${Math.round(Math.sqrt(Math.abs(t2)))}`;
    return item(
      askProd
        ? L3('x²=t 로 치환하면 t 에 대한 이차방정식이 됩니다. 실근을 모두 구해 그 곱을 구합니다(허근은 빼고).',
             'Substitute t=x² to get a quadratic in t. Find all the real roots and multiply them (leave out imaginary roots).',
             '令t=x²得到关于t的二次方程。求出所有实根并求它们的积(不含虚根)。')
        : L3('x²=t 로 치환하면 t 에 대한 이차방정식이 됩니다. 가장 큰 실근을 α 라 할 때 α 를 구합니다.',
             'Substitute t=x² to get a quadratic in t. Let α be the largest real root. Find α.',
             '令t=x²得到关于t的二次方程。设最大的实根为α，求α。'),
      `${poly(cs)}=0 \\;\\Rightarrow\\; ${askProd ? '\\square' : '\\alpha=\\square'}`, ans, [
        { tex:`t^2${more(-(t1 + t2), 't')}${more(t1 * t2, '')}=0\\quad (t=x^2)` },
        { tex:`${fac(t1, 't')}${fac(t2, 't')}=0` },
        { tex: four ? rootsTex : `x^2=${t1}\\ \\Rightarrow\\ x=\\pm ${a}` },
        { tex: askProd ? `${four ? `${a}\\times(-${a})\\times${Math.round(Math.sqrt(t2))}\\times(-${Math.round(Math.sqrt(t2))})` : `${a}\\times(-${a})`}=\\square` : `\\alpha=\\square`, blank:ans }]);
  }

  /* oneRoot(기본) — (x−r)(x²+px+q), 남은 이차식은 실근이 없다 */
  const r = nzInt(rng, 1, 4);
  const [p, q] = irreducible(rng);
  const cs = [1, p - r, q - p * r, -r * q];
  const D = p * p - 4 * q;
  return item(
    L3('이 삼차방정식의 실근은 하나뿐이고 정수입니다. 상수항의 약수를 넣어 P(a)=0 이 되는 a 를 찾고, 조립제법으로 나머지 이차식을 구해 실근이 없음을 확인합니다.',
       'This cubic has exactly one real root, and it is an integer. Try divisors of the constant term to find a with P(a)=0, then divide synthetically and check the remaining quadratic has no real root.',
       '这个三次方程只有一个实根，且是整数。代入常数项的约数找出使P(a)=0的a，再用综合除法求出剩下的二次式，确认它没有实根。'),
    `${poly(cs)}=0 \\;\\Rightarrow\\; x=\\square`, r, [
      { tex:`P(x)=${poly(cs)},\\quad P(${r})=0` },
      { tex:`(${xMinus(r)})(${poly([1, p, q])})=0` },
      { tex:`D=${par(p)}^2-4\\times${q}=${D}` },
      { tex:`x=\\square`, blank:r }]);
};

/* ── MD102 — 삼차방정식의 근과 계수의 관계 ──
   세 근의 합 s, 두 근씩 곱의 합 q, 곱 p 를 먼저 고르고 계수를 만든다. */
NM_TGEN['md102_cubicVieta'] = function (params, rng) {
  const mode = params.mode || 'sum';
  const a = pick(rng, [1, 1, 2, 3]);
  const s = nzInt(rng, 1, 6);
  let q = nzInt(rng, 1, 9);
  const p = nzInt(rng, 1, 9);
  let kind = mode;
  if (mode === 'pair') kind = pick(rng, ['pair', 'sq', 'recip']);
  let m = 0;
  if (kind === 'recip') { m = nzInt(rng, 1, 4); q = p * m; }
  const cs = [a, -a * s, a * q, -a * p];
  const eq = `${poly(cs)}=0`;
  const base = L3('세 근을 α, β, γ 라 합니다. ax³+bx²+cx+d=0 에서 α+β+γ=−b/a, αβ+βγ+γα=c/a, αβγ=−d/a 입니다.',
    'Let the three roots be α, β, γ. For ax³+bx²+cx+d=0, α+β+γ=−b/a, αβ+βγ+γα=c/a, αβγ=−d/a.',
    '设三个根为α、β、γ。对ax³+bx²+cx+d=0，有α+β+γ=−b/a，αβ+βγ+γα=c/a，αβγ=−d/a。');
  const S = '\\alpha+\\beta+\\gamma', Q = '\\alpha\\beta+\\beta\\gamma+\\gamma\\alpha', PR = '\\alpha\\beta\\gamma';

  /* a>1 이면 약분 전 분수를 한 줄 보여 준다(−d/a = ap/a 처럼 부호를 정리한 꼴) */
  const mid = (lhs, num) => a === 1 ? [] : [{ tex:`${lhs}=\\dfrac{${num}}{${a}}` }];
  if (kind === 'product') {
    return item(base, `${eq} \\;\\Rightarrow\\; ${PR}=\\square`, p, [
      { tex:`${PR}=-\\dfrac{d}{a}` }].concat(mid(PR, a * p), [
      { tex:`${PR}=\\square`, blank:p }]));
  }
  if (kind === 'pair') {
    return item(base, `${eq} \\;\\Rightarrow\\; ${Q}=\\square`, q, [
      { tex:`${Q}=\\dfrac{c}{a}` }].concat(mid(Q, a * q), [
      { tex:`${Q}=\\square`, blank:q }]));
  }
  if (kind === 'sq') {
    const ans = s * s - 2 * q;
    return item(base, `${eq} \\;\\Rightarrow\\; \\alpha^2+\\beta^2+\\gamma^2=\\square`, ans, [
      { tex:`${S}=${s},\\quad ${Q}=${q}` },
      { tex:`\\alpha^2+\\beta^2+\\gamma^2=(${S})^2-2(${Q})` },
      { tex:`=${par(s)}^2-2\\times${par(q)}=\\square`, blank:ans }]);
  }
  if (kind === 'recip') {
    return item(base, `${eq} \\;\\Rightarrow\\; \\dfrac{1}{\\alpha}+\\dfrac{1}{\\beta}+\\dfrac{1}{\\gamma}=\\square`, m, [
      { tex:`${Q}=${q},\\quad ${PR}=${p}` },
      { tex:`\\dfrac{1}{\\alpha}+\\dfrac{1}{\\beta}+\\dfrac{1}{\\gamma}=\\dfrac{${Q}}{${PR}}` },
      { tex:`=\\dfrac{${q}}{${p}}=\\square`, blank:m }]);
  }
  /* sum(기본) */
  return item(base, `${eq} \\;\\Rightarrow\\; ${S}=\\square`, s, [
    { tex:`${S}=-\\dfrac{b}{a}` }].concat(mid(S, a * s), [
    { tex:`${S}=\\square`, blank:s }]));
};

/* ── MD103 — x³=1 의 허근 ω ──
   ω³=1, ω²+ω+1=0, ω̄=ω², ω+ω̄=−1, ωω̄=1 만으로 값이 정수가 되는 식을 만든다. */
function wpow(e){ return e === 1 ? '\\omega' : `\\omega^{${e}}`; }
NM_TGEN['md103_omega'] = function (params, rng) {
  const mode = params.mode || 'basic';
  const base = L3('ω 는 x³=1 의 한 허근입니다. ω³=1 이고 ω²+ω+1=0 입니다.',
    'ω is an imaginary root of x³=1, so ω³=1 and ω²+ω+1=0.',
    'ω是x³=1的一个虚根，所以ω³=1，ω²+ω+1=0。');
  const withTip = tip => L3(base.ko + ' ' + tip.ko, base.en + ' ' + tip.en, base.zh + tip.zh);

  if (mode === 'powerSum') {
    if (pick(rng, [0, 1, 1])) {
      const n = R(rng, 4, 60), f = Math.floor(n / 3);
      const ans = 3 * f - n;
      return item(
        withTip(L3('ωᵏ+1/ωᵏ 은 k 가 3의 배수이면 2, 아니면 ω+ω²=−1 입니다.', 'ωᵏ+1/ωᵏ is 2 when k is a multiple of 3, and ω+ω²=−1 otherwise.', 'k是3的倍数时ωᵏ+1/ωᵏ=2，否则等于ω+ω²=−1。')),
        `\\left(\\omega+\\dfrac{1}{\\omega}\\right)+\\left(\\omega^2+\\dfrac{1}{\\omega^2}\\right)+\\cdots+\\left(\\omega^{${n}}+\\dfrac{1}{\\omega^{${n}}}\\right)=\\square`, ans, [
          { tex:`\\omega^{3k}+\\dfrac{1}{\\omega^{3k}}=2,\\quad \\omega+\\dfrac{1}{\\omega}=\\omega+\\omega^2=-1` },
          { tex:`2\\times${f}+(-1)\\times${n - f}=\\square`, blank:ans }]);
    }
    const from1 = pick(rng, [0, 1]);
    /* 1+ω+…+ωⁿ (항 n+1 개) 또는 ω+…+ωⁿ (항 n 개): 남는 항이 정수가 되는 n 만 */
    let n, ans;
    if (from1) { n = 3 * R(rng, 2, 20) + pick(rng, [0, 2]); const left = (n + 1) % 3; ans = left === 1 ? 1 : 0; }
    else { n = 3 * R(rng, 2, 20) + pick(rng, [0, 2]); const left = n % 3; ans = left === 2 ? -1 : 0; }
    const head = from1 ? '1+\\omega+\\omega^2+\\cdots' : '\\omega+\\omega^2+\\omega^3+\\cdots';
    return item(
      withTip(L3('연속한 세 항씩 묶으면 ωᵏ(1+ω+ω²)=0 이 되어 사라집니다. 남은 항만 계산합니다.', 'Every three consecutive terms form ωᵏ(1+ω+ω²)=0 and vanish; compute only what is left.', '每连续三项组成ωᵏ(1+ω+ω²)=0而消去，只算剩下的项。')),
      `${head}+\\omega^{${n}}=\\square`, ans, [
        { tex:`\\omega^{k}+\\omega^{k+1}+\\omega^{k+2}=\\omega^{k}(1+\\omega+\\omega^2)=0` },
        { tex:`${head}+\\omega^{${n}}` + (from1
            ? (ans === 1 ? `=\\omega^{${n}}=(\\omega^3)^{${n / 3}}=\\square` : `=\\square`)
            : (ans === -1 ? `=\\omega^{${n - 1}}+\\omega^{${n}}=\\omega+\\omega^2=\\square` : `=\\square`)), blank:ans }]);
  }

  if (mode === 'expr') {
    if (pick(rng, [0, 1])) {
      const a = R(rng, 1, 9), b = R(rng, 1, 9);
      const ans = -a - b;
      const lhs = `\\dfrac{${lead(a, '\\omega^2')}}{1+\\omega}+\\dfrac{${lead(b, '\\omega')}}{1+\\omega^2}`;
      return item(
        withTip(L3('1+ω=−ω², 1+ω²=−ω 로 바꾸면 분모가 약분됩니다.', 'Rewrite 1+ω=−ω² and 1+ω²=−ω; the denominators cancel.', '把1+ω换成−ω²，1+ω²换成−ω，分母就能约去。')),
        `${lhs}=\\square`, ans, [
          { tex:`1+\\omega=-\\omega^2,\\quad 1+\\omega^2=-\\omega` },
          { tex:`${lhs}=\\dfrac{${lead(a, '\\omega^2')}}{-\\omega^2}+\\dfrac{${lead(b, '\\omega')}}{-\\omega}` },
          { tex:`=-${a}-${b}=\\square`, blank:ans }]);
    }
    const a = nzInt(rng, 1, 6), b = nzInt(rng, 1, 6);
    const ans = a * a - a * b + b * b;
    const conj = pick(rng, [0, 1]);
    const w2 = conj ? '\\overline{\\omega}' : '\\omega^2';
    return item(
      withTip(conj
        ? L3('ω̄ 도 x³=1 의 허근이고 ω̄=ω² 입니다. ω+ω̄=−1, ωω̄=1 을 씁니다.', 'ω̄ is also an imaginary root of x³=1 and ω̄=ω². Use ω+ω̄=−1 and ωω̄=1.', 'ω̄也是x³=1的虚根，且ω̄=ω²。利用ω+ω̄=−1、ωω̄=1。')
        : L3('전개한 뒤 ω+ω²=−1, ω³=1 을 씁니다.', 'Expand, then use ω+ω²=−1 and ω³=1.', '展开后利用ω+ω²=−1、ω³=1。')),
      `(${a}${more(b, '\\omega')})(${a}${more(b, w2)})=\\square`, ans, [
        { tex:`=${par(a)}^2+${par(a * b)}(\\omega+${w2})+${par(b)}^2\\,\\omega${conj ? '\\overline{\\omega}' : '^3'}` },
        { tex:`=${par(a)}^2-${par(a * b)}+${par(b)}^2=\\square`, blank:ans }]);
  }

  /* basic(기본) */
  if (pick(rng, [0, 1])) {
    const c = nzInt(rng, 2, 9), k = nzInt(rng, 1, 9);
    const e1 = 3 * R(rng, 1, 20) + 1, e2 = 3 * R(rng, 1, 20) + 2;
    const order = pick(rng, [0, 1]);
    const ex = order ? [e1, e2] : [e2, e1];
    const ans = k - c;
    const lhs = `${lead(c, wpow(ex[0]))}${more(c, wpow(ex[1]))}${more(k, '')}`;
    return item(
      withTip(L3('지수를 3으로 나눈 나머지만 봅니다.', 'Only the remainder of each exponent divided by 3 matters.', '只看指数除以3的余数。')),
      `${lhs}=\\square`, ans, [
        { tex:`${wpow(e1)}=\\omega,\\quad ${wpow(e2)}=\\omega^2` },
        { tex:`${lhs}=${lead(c, '(\\omega+\\omega^2)')}${more(k, '')}` },
        { tex:`=${par(c)}\\times(-1)${more(k, '')}=\\square`, blank:ans }]);
  }
  const a = nzInt(rng, 1, 9);
  const ans = a * a + a + 1;
  return item(
    withTip(L3('전개한 뒤 ω+ω²=−1, ω³=1 을 씁니다.', 'Expand, then use ω+ω²=−1 and ω³=1.', '展开后利用ω+ω²=−1、ω³=1。')),
    `(${a}-\\omega)(${a}-\\omega^2)=\\square`, ans, [
      { tex:`=${par(a)}^2-${par(a)}(\\omega+\\omega^2)+\\omega^3` },
      { tex:`=${par(a)}^2+${par(a)}+1=\\square`, blank:ans }]);
};

/* ── MD104 — 연립이차방정식 (답: x, y 2칸) ── */
const QFORMS = [[1, 0, 1], [1, 1, 0], [2, 0, 1], [1, -1, 1], [1, 0, -1], [0, 1, 1], [1, 1, 1], [1, 0, 2]];
function qTex(f){ return terms([[f[0], 'x^2'], [f[1], 'xy'], [f[2], 'y^2']]); }
function qVal(f, x, y){ return f[0] * x * x + f[1] * x * y + f[2] * y * y; }
NM_TGEN['md104_simulQuad'] = function (params, rng) {
  const mode = params.mode || 'linQuad';

  if (mode === 'quadQuad') {
    const p = R(rng, 1, 3), q = -R(rng, 1, 3), y0 = R(rng, 1, 4), x0 = p * y0;
    const f = pick(rng, [[1, 0, 1], [1, 1, 1], [1, 0, 2], [0, 1, 1], [1, 1, 0], [2, 0, 1]]);
    const Rv = qVal(f, x0, y0), K = qVal(f, p, 1);
    const e1 = `${terms([[1, 'x^2'], [-(p + q), 'xy'], [p * q, 'y^2']])}=0`;
    return item(
      L3('x, y 는 양수입니다. 우변이 0 인 식을 인수분해해 x 를 y 로 나타낸 뒤 다른 식에 넣습니다.',
         'x and y are positive. Factor the equation whose right side is 0, write x in terms of y, and substitute into the other equation.',
         'x、y是正数。把右边为0的方程因式分解，用y表示x，再代入另一个方程。'),
      `${cases(e1, `${qTex(f)}=${Rv}`)} \\;\\Rightarrow\\; ${XY}`, [x0, y0], [
        { tex:`(x${more(-p, 'y')})(x${more(-q, 'y')})=0` },
        { tex:`x=${lead(p, 'y')}\\quad (x=${lead(q, 'y')}\\ \\text{: } xy<0)` },
        { tex:`${lead(K, 'y^2')}=${Rv},\\quad y=${y0}` },
        { tex:XY, blank:[x0, y0] }]);
  }

  if (mode === 'symmetric') {
    let x = R(rng, -5, 9), y = R(rng, -5, 9), g = 0;
    while (x === y && g++ < 20) y = R(rng, -5, 9);
    if (x === y) y = x - 1;
    if (x < y) { const t = x; x = y; y = t; }
    const s = x + y, P = x * y, Q2 = x * x + y * y;
    const useSq = pick(rng, [0, 1]);
    const second = useSq ? `x^2+y^2=${Q2}` : `xy=${P}`;
    const steps = [];
    if (useSq) steps.push({ tex:`xy=\\dfrac{(x+y)^2-(x^2+y^2)}{2}=\\dfrac{${par(s)}^2-${Q2}}{2}=${P}` });
    steps.push({ tex:`t^2${more(-s, 't')}${more(P, '')}=0` });
    steps.push({ tex:`${fac(x, 't')}${fac(y, 't')}=0` });
    steps.push({ tex:XY, blank:[x, y] });
    return item(
      L3('x>y 입니다. x+y 와 xy 를 알면 x, y 는 t²−(x+y)t+xy=0 의 두 근입니다.',
         'x>y. Once x+y and xy are known, x and y are the two roots of t²−(x+y)t+xy=0.',
         'x>y。知道x+y与xy后，x、y是t²−(x+y)t+xy=0的两个根。'),
      `${cases(`x+y=${s}`, second)} \\;\\Rightarrow\\; ${XY}`, [x, y], steps);
  }

  /* linQuad(기본) — 일차식 y=mx+k 와 이차식. 양수 해가 하나뿐인 것만 */
  for (let g = 0; g < 60; g++) {
    const x0 = R(rng, 1, 6), y0 = R(rng, 1, 6);
    const m = pick(rng, [1, -1, 2]), k = y0 - m * x0;
    const f = pick(rng, QFORMS);
    const Rv = qVal(f, x0, y0);
    const A = f[0] + f[1] * m + f[2] * m * m, B = f[1] * k + 2 * f[2] * m * k, Cc = f[2] * k * k - Rv;
    if (A === 0) continue;
    const x1 = -B / A - x0, y1 = m * x1 + k;
    if (Math.abs(x1 - x0) > 1e-9 && x1 > 0 && y1 > 0) continue;
    if (Rv === 0) continue;
    const line = m === -1 ? `x+y=${k}` : `y=${lead(m, 'x')}${more(k, '')}`;
    const sg = A < 0 ? -1 : 1;
    return item(
      L3('x, y 는 양수입니다. 일차방정식을 y=… 꼴로 고쳐 이차방정식에 넣으면 x 에 대한 이차방정식이 됩니다.',
         'x and y are positive. Write the linear equation as y=… and substitute it into the quadratic to get a quadratic in x.',
         'x、y是正数。把一次方程写成y=…的形式代入二次方程，得到关于x的二次方程。'),
      `${cases(line, `${qTex(f)}=${Rv}`)} \\;\\Rightarrow\\; ${XY}`, [x0, y0], [
        { tex:`y=${lead(m, 'x')}${more(k, '')}` },
        { tex:`${poly([sg * A, sg * B, sg * Cc])}=0` },
        { tex:`x=${x0}\\ (x>0),\\quad y=${y0}` },
        { tex:XY, blank:[x0, y0] }]);
  }
  return NM_TGEN['md104_simulQuad']({ mode:'symmetric' }, rng);
};

/* ── MD105 — 부정방정식 ── */
function pairsTex(ps){ return ps.map(([x, y]) => `(${x},\\,${y})`).join(',\\ '); }
NM_TGEN['md105_indefinite'] = function (params, rng) {
  const mode = params.mode || 'intCount';

  if (mode === 'product') {
    const a = R(rng, 1, 4), b = R(rng, 1, 4), M = R(rng, 2, 24);
    const sols = [];
    for (let d = -M; d <= M; d++) {
      if (d === 0 || M % d) continue;
      const x = a + d, y = b + M / d;
      if (x >= 1 && y >= 1) sols.push([x, y]);
    }
    const askMax = pick(rng, [0, 1]);
    const ans = askMax ? sols.reduce((t, [x, y]) => Math.max(t, x + y), -1e9) : sols.length;
    const lhs = `xy${more(-b, 'x')}${more(-a, 'y')}`;
    return item(
      askMax
        ? L3('x, y 는 자연수입니다. (x−a)(y−b)=(정수) 꼴로 묶고 약수를 짝지어, x+y 의 값 가운데 가장 큰 것을 구합니다.',
             'x and y are natural numbers. Group into (x−a)(y−b)=(integer), pair up the divisors, and find the largest value of x+y.',
             'x、y是自然数。整理成(x−a)(y−b)=(整数)，把约数配对，求x+y的最大值。')
        : L3('x, y 는 자연수입니다. (x−a)(y−b)=(정수) 꼴로 묶고 약수를 짝지어 순서쌍 (x, y) 의 개수를 구합니다.',
             'x and y are natural numbers. Group into (x−a)(y−b)=(integer), pair up the divisors, and count the ordered pairs (x, y).',
             'x、y是自然数。整理成(x−a)(y−b)=(整数)，把约数配对，求有序数对(x, y)的个数。'),
      `${lhs}=${M - a * b} \\;\\Rightarrow\\; \\square`, ans, [
        { tex:`(${xMinus(a)})(${xMinus(b, 'y')})=${M}` },
        { tex:`(x,\\,y)=${pairsTex(sols)}` },
        { tex:`\\square`, blank:ans }]);
  }

  if (mode === 'real') {
    if (pick(rng, [0, 1])) {
      const a = nzInt(rng, 1, 6), b = nzInt(rng, 1, 6);
      return item(
        L3('x, y 는 실수입니다. 완전제곱식의 합 A²+B²=0 이 되도록 묶으면 A=0, B=0 입니다.',
           'x and y are real. Rewrite as a sum of squares A²+B²=0; then A=0 and B=0.',
           'x、y是实数。配成平方和A²+B²=0，则A=0且B=0。'),
        `${terms([[1, 'x^2'], [1, 'y^2'], [-2 * a, 'x'], [-2 * b, 'y'], [a * a + b * b, '']])}=0 \\;\\Rightarrow\\; ${XY}`, [a, b], [
          { tex:`(${xMinus(a)})^2+(${xMinus(b, 'y')})^2=0` },
          { tex:`${xMinus(a)}=0,\\quad ${xMinus(b, 'y')}=0` },
          { tex:XY, blank:[a, b] }]);
    }
    const c = nzInt(rng, 1, 5), d = nzInt(rng, 1, 5);
    const x = c + d;
    return item(
      L3('x, y 는 실수입니다. x 가 들어 있는 항을 먼저 완전제곱식으로 묶고, 남은 것을 y 에 대한 완전제곱식으로 만듭니다.',
         'x and y are real. First complete the square in the terms containing x, then complete the square in y with what remains.',
         'x、y是实数。先把含x的项配成完全平方，再把剩下的配成关于y的完全平方。'),
      `${terms([[1, 'x^2'], [-2, 'xy'], [2, 'y^2'], [-2 * c, 'x'], [2 * c - 2 * d, 'y'], [c * c + d * d, '']])}=0 \\;\\Rightarrow\\; ${XY}`, [x, d], [
        { tex:`(x-y${more(-c, '')})^2+(${xMinus(d, 'y')})^2=0` },
        { tex:`y=${d},\\quad x=y${more(c, '')}=${x}` },
        { tex:XY, blank:[x, d] }]);
  }

  /* intCount(기본) — ax+by=c 의 자연수 해 */
  let a = R(rng, 2, 7), b = R(rng, 2, 7), g = 0;
  while (a === b && g++ < 20) b = R(rng, 2, 7);
  if (a === b) b = a === 7 ? 5 : a + 1;
  const c = a * R(rng, 1, 8) + b * R(rng, 1, 6);
  const sols = [];
  for (let x = 1; a * x < c; x++) { const r = c - a * x; if (r % b === 0) sols.push([x, r / b]); }
  const ans = sols.length;
  return item(
    L3('x, y 는 자연수입니다. 계수가 큰 쪽 문자에 1, 2, 3, … 을 차례로 넣어 다른 문자도 자연수가 되는 순서쌍 (x, y) 의 개수를 구합니다.',
       'x and y are natural numbers. Substitute 1, 2, 3, … for one variable and count the ordered pairs (x, y) where the other is also a natural number.',
       'x、y是自然数。给一个字母依次代入1、2、3、…，求另一个也是自然数的有序数对(x, y)的个数。'),
    `${a}x+${b}y=${c} \\;\\Rightarrow\\; \\square`, ans, [
      { tex:`y=\\dfrac{${c}-${a}x}{${b}}>0` },
      { tex:`(x,\\,y)=${pairsTex(sols)}` },
      { tex:`\\square`, blank:ans }]);
};

/* ── MD106 — 식의 값의 범위 (답: 아래끝·위끝 2칸) ── */
NM_TGEN['md106_exprRange'] = function (params, rng) {
  const mode = params.mode || 'sum';
  const a = R(rng, -6, 5), b = a + R(rng, 1, 5), c = R(rng, -6, 5), d = c + R(rng, 1, 5);
  const given = `${a}\\le x\\le ${b},\\ ${c}\\le y\\le ${d}`;

  if (mode === 'prod') {
    const cs = [a * c, a * d, b * c, b * d];
    const lo = Math.min.apply(null, cs), hi = Math.max.apply(null, cs);
    return item(
      L3('xy 의 값의 범위는 양 끝값끼리의 곱 네 개를 모두 계산해 가장 작은 값과 가장 큰 값을 고릅니다(부호가 섞이면 순서가 바뀝니다).',
         'For the range of xy, compute all four products of endpoints and take the smallest and largest (signs can reverse the order).',
         'xy的取值范围：算出端点两两相乘的四个积，取最小值和最大值(符号不同时大小会颠倒)。'),
      `${given} \\;\\Rightarrow\\; \\square\\le xy\\le\\square`, [lo, hi], [
        { tex:`${par(a)}\\times${par(c)}=${a * c},\\ ${par(a)}\\times${par(d)}=${a * d}` },
        { tex:`${par(b)}\\times${par(c)}=${b * c},\\ ${par(b)}\\times${par(d)}=${b * d}` },
        { tex:`\\square\\le xy\\le\\square`, blank:[lo, hi] }]);
  }

  const p = R(rng, 1, 3), q = R(rng, 1, 3);
  if (mode === 'diff') {
    const lo = p * a - q * d, hi = p * b - q * c;
    const ex = `${lead(p, 'x')}${more(-q, 'y')}`;
    return item(
      L3('빼는 식은 부호를 바꾸어 더합니다: −y 의 범위를 먼저 구하면 작은 끝과 큰 끝이 뒤바뀝니다. 그다음 끝끼리 더합니다.',
         'Turn the subtraction into adding a negative: find the range of −y first (its ends swap), then add the ends.',
         '把减法变成加上相反数：先求−y的范围(两端互换)，再把端点相加。'),
      `${given} \\;\\Rightarrow\\; \\square\\le ${ex}\\le\\square`, [lo, hi], [
        { tex:`${p * a}\\le ${lead(p, 'x')}\\le ${p * b}` },
        { tex:`${-q * d}\\le ${lead(-q, 'y')}\\le ${-q * c}` },
        { tex:`\\square\\le ${ex}\\le\\square`, blank:[lo, hi] }]);
  }
  /* sum(기본) */
  const lo = p * a + q * c, hi = p * b + q * d;
  const ex = `${lead(p, 'x')}${more(q, 'y')}`;
  return item(
    L3('더하는 식은 작은 끝끼리, 큰 끝끼리 더합니다.', 'For a sum, add the small ends together and the large ends together.', '求和时小端与小端相加，大端与大端相加。'),
    `${given} \\;\\Rightarrow\\; \\square\\le ${ex}\\le\\square`, [lo, hi], [
      { tex:`${p * a}\\le ${lead(p, 'x')}\\le ${p * b},\\quad ${q * c}\\le ${lead(q, 'y')}\\le ${q * d}` },
      { tex:`\\square\\le ${ex}\\le\\square`, blank:[lo, hi] }]);
};

/* ── MD107 — 연립일차부등식 ──
   해 x (dir) B 를 먼저 정하고 px+q (op) rx+s 를 역산한다. k=p−r<0 이면 부등호가 뒤집힌다. */
function linIneq(rng, B, dir, forcePos){
  for (let g = 0; g < 40; g++) {
    const r = R(rng, 0, 3);
    const k = forcePos ? R(rng, 1, 4) : nzInt(rng, 1, 4);
    const p = r + k;
    if (p === 0) continue;
    const q = R(rng, -9, 9), s = q + k * B;
    const op = k > 0 ? dir : FLIP[dir];
    const right = r === 0 ? String(s) : `${lead(r, 'x')}${more(s, '')}`;
    return { tex:`${lead(p, 'x')}${more(q, '')}${OP[op]}${right}`, k, q, r, p, dir };
  }
  return { tex:`x${OP[dir]}${B}`, k:1, q:0, r:0, p:1, dir };
}
NM_TGEN['md107_linSystem'] = function (params, rng) {
  const mode = params.mode || 'count';
  const lo = R(rng, -8, 6), hi = lo + R(rng, 2, 7);
  const sL = pick(rng, [0, 1]), sH = pick(rng, [0, 1]);   /* 1 = 등호 없음 */
  const dL = sL ? 'gt' : 'ge', dH = sH ? 'lt' : 'le';
  const setTex = `${lo}${sL ? '<' : '\\le '}x${sH ? '<' : '\\le '}${hi}`;

  if (mode === 'unknown') {
    const paramLow = pick(rng, [0, 1]);
    const B = paramLow ? lo : hi, dir = paramLow ? dL : dH;
    const fixed = linIneq(rng, paramLow ? hi : lo, paramLow ? dH : dL);
    const r = R(rng, 0, 3), k = R(rng, 1, 4), p = r + k, q = R(rng, -9, 9);
    const a = q + k * B;
    const pTex = `${lead(p, 'x')}${more(q, '')}${OP[dir]}${r === 0 ? 'a' : `${lead(r, 'x')}+a`}`;
    const sys = pick(rng, [0, 1]) ? cases(fixed.tex, pTex) : cases(pTex, fixed.tex);
    return item(
      L3('연립부등식의 해가 주어진 범위와 같을 때 상수 a 의 값을 구합니다. a 가 없는 부등식이 한쪽 끝을, a 가 있는 부등식이 다른 쪽 끝을 정합니다.',
         'The solution of the system equals the given range. Find the constant a: the inequality without a fixes one end, the one with a fixes the other.',
         '联立不等式的解与给定范围相同，求常数a。不含a的不等式确定一端，含a的不等式确定另一端。'),
      `${sys} \\;\\Rightarrow\\; ${setTex},\\ a=\\square`, a, [
        { tex:`${lead(k, 'x')}${OP[dir]}a${more(-q, '')}` },
        { tex:`a${more(-q, '')}=${k === 1 ? B : `${k}\\times${par(B)}`}` },
        { tex:`a=\\square`, blank:a }]);
  }

  const i1 = linIneq(rng, lo, dL), i2 = linIneq(rng, hi, dH);
  const sys = pick(rng, [0, 1]) ? cases(i1.tex, i2.tex) : cases(i2.tex, i1.tex);
  const steps = [
    { tex:`x${OP[dL]}${lo},\\quad x${OP[dH]}${hi}` },
    { tex:setTex }
  ];
  if (mode === 'largest') {
    const big = pick(rng, [0, 1]);
    const ans = big ? (sH ? hi - 1 : hi) : (sL ? lo + 1 : lo);
    return item(
      big
        ? L3('두 부등식의 해의 공통부분을 구하고, 그 안에서 가장 큰 정수를 구합니다.', 'Find the common part of the two solutions, then the largest integer in it.', '求两个不等式解的公共部分，再求其中最大的整数。')
        : L3('두 부등식의 해의 공통부분을 구하고, 그 안에서 가장 작은 정수를 구합니다.', 'Find the common part of the two solutions, then the smallest integer in it.', '求两个不等式解的公共部分，再求其中最小的整数。'),
      `${sys} \\;\\Rightarrow\\; x=\\square`, ans, steps.concat([{ tex:`x=\\square`, blank:ans }]));
  }
  const ans = hi - lo + 1 - sL - sH;
  return item(
    L3('각 부등식을 풀어 공통부분을 구한 뒤, 그 안의 정수의 개수를 셉니다. 등호가 있는 끝은 포함합니다.',
       'Solve each inequality, take the common part, and count the integers in it. An end with an equals sign is included.',
       '分别解每个不等式，求公共部分，再数其中整数的个数。带等号的端点要包含。'),
    `${sys} \\;\\Rightarrow\\; \\square`, ans, steps.concat([{ tex:`${hi}-${par(lo)}+1${sL + sH ? more(-(sL + sH), '') : ''}=\\square`, blank:ans }]));
};

/* ── MD108 — 절댓값을 포함한 부등식 ── */
NM_TGEN['md108_absIneq'] = function (params, rng) {
  const mode = params.mode || 'linear';

  if (mode === 'count') {
    if (pick(rng, [0, 1])) {
      /* |x−p|+|x−q| (op) c — 두 점까지 거리의 합 */
      const p = R(rng, -5, 3), q = p + R(rng, 1, 5), c = (q - p) + R(rng, 1, 6);
      const strict = pick(rng, [0, 1]);
      let n = 0;
      for (let x = -60; x <= 60; x++) { const v = Math.abs(x - p) + Math.abs(x - q); if (strict ? v < c : v <= c) n++; }
      const o = strict ? '<' : '\\le ';
      return item(
        L3('절댓값 안이 0 이 되는 두 값을 기준으로 구간을 셋으로 나누어 풀고, 해를 합친 뒤 정수의 개수를 셉니다.',
           'Split into three intervals at the two values that make the insides 0, solve on each, combine, and count the integers.',
           '以使绝对值内为0的两个值为界分成三个区间分别求解，合并后数整数的个数。'),
        `|${xMinus(p)}|+|${xMinus(q)}|${o}${c} \\;\\Rightarrow\\; \\square`, n, [
          { tex:`x<${p},\\quad ${p}\\le x<${q},\\quad x\\ge ${q}` },
          { tex:`${frac(p + q - c, 2)}${o}x${o}${frac(p + q + c, 2)}` },
          { tex:`\\square`, blank:n }]);
    }
    const a = pick(rng, [2, 3]), b = nzInt(rng, 1, 9), c = R(rng, 2, 9);
    const strict = pick(rng, [0, 1]);
    let n = 0;
    for (let x = -60; x <= 60; x++) { const v = Math.abs(a * x - b); if (strict ? v < c : v <= c) n++; }
    if (n === 0) return NM_TGEN['md108_absIneq'](params, rng);
    const o = strict ? '<' : '\\le ';
    return item(
      L3('|A|<c 는 −c<A<c 입니다(c>0). x 의 범위를 구한 뒤 그 안의 정수의 개수를 셉니다.',
         '|A|<c means −c<A<c (c>0). Find the range of x, then count the integers in it.',
         '|A|<c即−c<A<c(c>0)。求出x的范围，再数其中整数的个数。'),
      `|${lead(a, 'x')}${more(-b, '')}|${o}${c} \\;\\Rightarrow\\; \\square`, n, [
        { tex:`${-c}${o}${lead(a, 'x')}${more(-b, '')}${o}${c}` },
        { tex:`${frac(b - c, a)}${o}x${o}${frac(b + c, a)}` },
        { tex:`\\square`, blank:n }]);
  }

  if (mode === 'quad') {
    if (pick(rng, [0, 1])) {
      /* x²−p|x|−q (op) 0, |x|=t: (t−r)(t+s) (op) 0, t≥0 → t<r */
      const r = R(rng, 1, 6);
      let s = R(rng, 1, 6);
      if (s === r) s = r === 6 ? 5 : r + 1;      /* r=s 이면 |x| 항이 사라져 절댓값 문제가 아니게 된다 */
      const strict = pick(rng, [0, 1]);
      const n = strict ? 2 * r - 1 : 2 * r + 1;
      const o = strict ? '<' : '\\le ';
      return item(
        L3('x²=|x|² 이므로 |x|=t(t≥0) 로 두면 t 에 대한 이차부등식이 됩니다. 해의 정수의 개수를 구합니다.',
           'Since x²=|x|², put t=|x| (t≥0) to get a quadratic inequality in t. Count the integer solutions.',
           '因为x²=|x|²，令t=|x|(t≥0)得到关于t的二次不等式。求整数解的个数。'),
        `x^2${more(-(r - s), '|x|')}${more(-r * s, '')}${o}0 \\;\\Rightarrow\\; \\square`, n, [
          { tex:`(|x|${more(-r, '')})(|x|${more(s, '')})${o}0` },
          { tex:`|x|${o}${r},\\quad ${-r}${o}x${o}${r}` },
          { tex:`\\square`, blank:n }]);
    }
    /* |x²−a| (op) b */
    for (let g = 0; g < 40; g++) {
      const a = R(rng, 2, 30), b = R(rng, 1, 12), strict = pick(rng, [0, 1]);
      let n = 0;
      for (let x = -40; x <= 40; x++) { const v = Math.abs(x * x - a); if (strict ? v < b : v <= b) n++; }
      if (n === 0) continue;
      const o = strict ? '<' : '\\le ';
      return item(
        L3('|A|<b 는 −b<A<b 입니다. x² 의 범위를 구한 뒤, 그 범위에 x² 이 들어가는 정수 x 를 셉니다.',
           '|A|<b means −b<A<b. Find the range of x², then count the integers x whose square falls in it.',
           '|A|<b即−b<A<b。求出x²的范围，再数平方落在其中的整数x。'),
        `|x^2${more(-a, '')}|${o}${b} \\;\\Rightarrow\\; \\square`, n, [
          { tex:`${a - b}${o}x^2${o}${a + b}` },
          { tex:`\\square`, blank:n }]);
    }
  }

  /* linear(기본) — |ax−b| (op) c 의 해 lo (op) x (op) hi */
  const a = R(rng, 1, 3);
  let lo = R(rng, -8, 4), hi = lo + R(rng, 1, 8);
  if ((a * (lo + hi)) % 2) hi += 1;
  const b = a * (lo + hi) / 2, c = a * (hi - lo) / 2;
  const o = pick(rng, ['<', '\\le ']);
  return item(
    L3('c>0 일 때 |A|<c 는 −c<A<c, |A|≤c 는 −c≤A≤c 입니다. x 의 범위의 양 끝을 구합니다.',
       'For c>0, |A|<c means −c<A<c and |A|≤c means −c≤A≤c. Find both ends of the range of x.',
       'c>0时，|A|<c即−c<A<c，|A|≤c即−c≤A≤c。求x的范围的两端。'),
    `|${lead(a, 'x')}${more(-b, '')}|${o}${c} \\;\\Rightarrow\\; \\square${o}x${o}\\square`, [lo, hi], [
      { tex:`${-c}${o}${lead(a, 'x')}${more(-b, '')}${o}${c}` },
      { tex:`${b - c}${o}${lead(a, 'x')}${o}${b + c}` },
      { tex:`\\square${o}x${o}\\square`, blank:[lo, hi] }]);
};

/* ── MD109 — 연립이차부등식 ── */
function quadIn(rng, r1, r2, strict){
  /* (x−r1)(x−r2) < 0 (또는 ≤) — 가끔 −1 을 곱해 부등호를 뒤집어 보인다 */
  const neg = pick(rng, [0, 0, 1]);
  const sg = neg ? -1 : 1;
  const op = neg ? (strict ? '>' : '\\ge ') : (strict ? '<' : '\\le ');
  return `${poly([sg, -sg * (r1 + r2), sg * r1 * r2])}${op}0`;
}
NM_TGEN['md109_quadSystem'] = function (params, rng) {
  const mode = params.mode || 'count';
  const r1 = R(rng, -6, 4), r2 = r1 + R(rng, 2, 8);
  const strict = pick(rng, [0, 1]);
  const ins = x => strict ? (x > r1 && x < r2) : (x >= r1 && x <= r2);
  const o = strict ? '<' : '\\le ';
  const Q = quadIn(rng, r1, r2, strict);

  if (mode === 'empty') {
    const upper = pick(rng, [0, 1]);
    /* 끝값에서 해가 없어지는 짝만 쓴다 */
    const lin = upper ? (strict ? pick(rng, ['gt', 'ge']) : 'gt') : (strict ? pick(rng, ['lt', 'le']) : 'lt');
    const ans = upper ? r2 : r1;
    const askTex = upper ? `a\\ge\\square` : `a\\le\\square`;
    return item(
      L3('이차부등식의 해를 먼저 구합니다. 일차부등식 x … a 의 해와 겹치는 부분이 없도록 a 의 범위를 정합니다(끝값이 포함되는지 따져 봅니다).',
         'Solve the quadratic inequality first. Choose the range of a so that the solution of x … a does not overlap it (check whether the endpoint is included).',
         '先解二次不等式。确定a的范围，使一次不等式x…a的解与它没有公共部分(注意端点是否包含)。'),
      `${cases(Q, `x${OP[lin]}a`)} \\;\\Rightarrow\\; ${askTex}`, ans, [
        { tex:`${fac(r1)}${fac(r2)}${o}0` },
        { tex:`${r1}${o}x${o}${r2}` },
        { tex:askTex, blank:ans }]);
  }

  /* 두 번째 부등식: 일차 또는 바깥쪽 이차(교집합이 한 구간이 되게) */
  let second, secondStep, test;
  if (pick(rng, [0, 1])) {
    const B = R(rng, r1, r2), dir = pick(rng, ['lt', 'le', 'gt', 'ge']);
    const li = linIneq(rng, B, dir);
    second = li.tex; secondStep = `x${OP[dir]}${B}`;
    test = x => dir === 'lt' ? x < B : dir === 'le' ? x <= B : dir === 'gt' ? x > B : x >= B;
  } else {
    let s1, s2;
    if (pick(rng, [0, 1])) { s1 = r1 - R(rng, 1, 4); s2 = r1 + R(rng, 1, Math.max(1, r2 - r1 - 1)); }
    else { s2 = r2 + R(rng, 1, 4); s1 = r2 - R(rng, 1, Math.max(1, r2 - r1 - 1)); }
    const st2 = pick(rng, [0, 1]);
    second = `${poly([1, -(s1 + s2), s1 * s2])}${st2 ? '>' : '\\ge '}0`;
    secondStep = `${fac(s1)}${fac(s2)}${st2 ? '>' : '\\ge '}0`;
    test = x => st2 ? (x < s1 || x > s2) : (x <= s1 || x >= s2);
  }
  const sol = [];
  for (let x = r1 - 1; x <= r2 + 1; x++) if (ins(x) && test(x)) sol.push(x);
  if (!sol.length) return NM_TGEN['md109_quadSystem'](params, rng);
  const sys = pick(rng, [0, 1]) ? cases(Q, second) : cases(second, Q);
  const steps = [
    { tex:`${r1}${o}x${o}${r2}` },
    { tex:secondStep },
    { tex:`x=${sol.join(',\\ ')}` }
  ];
  if (mode === 'minInt') {
    const ans = sol[0];
    return item(
      L3('두 부등식의 해를 각각 구해 공통부분을 찾고, 그 안에서 가장 작은 정수를 구합니다.',
         'Solve each inequality, find the common part, and give the smallest integer in it.',
         '分别解两个不等式，求公共部分，再求其中最小的整数。'),
      `${sys} \\;\\Rightarrow\\; x=\\square`, ans, steps.concat([{ tex:`x=\\square`, blank:ans }]));
  }
  const ans = sol.length;
  return item(
    L3('두 부등식의 해를 각각 구해 공통부분을 찾고, 그 안의 정수의 개수를 셉니다.',
       'Solve each inequality, find the common part, and count the integers in it.',
       '分别解两个不等式，求公共部分，再数其中整数的个数。'),
    `${sys} \\;\\Rightarrow\\; \\square`, ans, steps.concat([{ tex:`\\square`, blank:ans }]));
};

/* ── MD110 — 합의 법칙·곱의 법칙 ── */
const DICE = s => 6 - Math.abs(s - 7);
const LETTERS = [['a', 'b', 'c', 'd', 'e'], ['p', 'q', 'r', 's', 't'], ['x', 'y', 'z', 'u', 'v']];
function primeTex(fs){ return fs.filter(([, e]) => e > 0).map(([p, e]) => e === 1 ? String(p) : `${p}^{${e}}`).join('\\times'); }
NM_TGEN['md110_sumProduct'] = function (params, rng) {
  const mode = params.mode || 'sum';

  if (mode === 'product') {
    const kind = pick(rng, ['route', 'expand', 'round']);
    if (kind === 'expand') {
      const k = pick(rng, [2, 3]);
      const ns = []; for (let i = 0; i < k; i++) ns.push(R(rng, 2, 5));
      const ex = ns.map((n, i) => `(${LETTERS[i].slice(0, n).join('+')})`).join('');
      const ans = ns.reduce((t, n) => t * n, 1);
      /* 같은 레벨의 다른 갈래가 문장제라 이것도 문장제로 낸다(인쇄 칸이 레벨 단위로 정해진다) */
      return word(
        L3(`다음 식을 전개합니다: ${ex}. 각 괄호에서 항을 하나씩 골라 곱하고, 문자가 모두 달라 동류항이 생기지 않습니다.`,
           `Expand ${ex}. Each term picks one term from every bracket, and all letters differ, so no like terms appear.`,
           `展开${ex}。每项从各括号中各取一项相乘，字母都不同，不会出现同类项。`),
        L3('항은 모두 몇 개입니까?', 'How many terms are there?', '共有多少项？'),
        `${ex} \\;\\Rightarrow\\; \\square`, ans, [
          { tex:`${times(ns)}=\\square`, blank:ans }]);
    }
    if (kind === 'round') {
      const a = R(rng, 3, 9), ans = a * (a - 1);
      return word(
        L3(`A 마을과 B 마을 사이에 길이 ${a}가지 있습니다. A 에서 B 로 갔다가 돌아오는데, 갈 때 지난 길은 돌아올 때 쓰지 않습니다.`,
           `There are ${a} roads between towns A and B. You go from A to B and come back, but you do not use the same road on the way back.`,
           `A村与B村之间有${a}条路。从A去B再返回，回来时不走去时走过的路。`),
        L3('가능한 방법은 모두 몇 가지입니까?', 'How many ways are possible?', '共有多少种走法？'),
        `\\square`, ans, [
          { tex:`\\text{A}\\to\\text{B}\\ ${a},\\quad \\text{B}\\to\\text{A}\\ ${a - 1}` },
          { tex:`${a}\\times${a - 1}=\\square`, blank:ans }]);
    }
    const a = R(rng, 2, 5), b = R(rng, 2, 5), c = R(rng, 1, 4), ans = a * b + c;
    return word(
      L3(`A 에서 B 로 가는 길이 ${a}가지, B 에서 C 로 가는 길이 ${b}가지, A 에서 C 로 바로 가는 길이 ${c}가지입니다.`,
         `There are ${a} roads from A to B, ${b} roads from B to C, and ${c} direct roads from A to C.`,
         `从A到B有${a}条路，从B到C有${b}条路，从A直接到C有${c}条路。`),
      L3('A 에서 C 로 가는 방법은 모두 몇 가지입니까? (같은 곳을 두 번 지나지 않습니다)', 'How many ways are there from A to C? (No place is visited twice.)', '从A到C共有多少种走法？(不重复经过同一地点)'),
      `\\square`, ans, [
        { tex:`\\text{A}\\to\\text{B}\\to\\text{C}\\text{: } ${a}\\times${b}=${a * b}` },
        { tex:`${a * b}+${c}=\\square`, blank:ans }]);
  }

  if (mode === 'divisors') {
    let e2, e3, e5, N, g = 0;
    do { e2 = R(rng, 0, 5); e3 = R(rng, 0, 3); e5 = R(rng, 0, 2); N = Math.pow(2, e2) * Math.pow(3, e3) * Math.pow(5, e5); }
    while ((N > 2000 || [e2, e3, e5].filter(e => e > 0).length < 2) && g++ < 80);
    if (N > 2000 || [e2, e3, e5].filter(e => e > 0).length < 2) { e2 = 3; e3 = 2; e5 = 0; N = 72; }
    const fs = [[2, e2], [3, e3], [5, e5]].filter(([, e]) => e > 0);
    const kind = pick(rng, ['count', 'count', 'sum', 'even']);
    if (kind === 'sum' && N <= 400) {
      const parts = fs.map(([p, e]) => { const a = []; for (let i = 0; i <= e; i++) a.push(Math.pow(p, i)); return a; });
      const ans = parts.reduce((t, a) => t * a.reduce((u, v) => u + v, 0), 1);
      return item(
        L3(`${N} 의 소인수분해를 보면 약수는 각 소인수의 거듭제곱에서 하나씩 골라 곱한 것입니다. 양의 약수의 총합을 구합니다.`,
           `Factor ${N} into primes; each divisor is a product of one power chosen from each prime. Find the sum of the positive divisors.`,
           `把${N}分解质因数，每个约数都是从各质因数的幂中各取一个相乘。求正约数之和。`),
        `${N} \\;\\Rightarrow\\; \\square`, ans, [
          { tex:`${N}=${primeTex(fs)}` },
          { tex:`${parts.map(a => `(${a.join('+')})`).join('')}=\\square`, blank:ans }]);
    }
    if (kind === 'even' && e2 > 0) {
      const ans = e2 * fs.filter(([p]) => p !== 2).reduce((t, [, e]) => t * (e + 1), 1);
      const others = fs.filter(([p]) => p !== 2);
      return item(
        L3(`${N} 의 양의 약수 가운데 짝수의 개수를 구합니다. 짝수인 약수는 2 를 적어도 한 번 곱해야 하므로, 2 의 지수는 1 부터 고릅니다.`,
           `Count the even positive divisors of ${N}. An even divisor must contain 2 at least once, so the exponent of 2 starts from 1.`,
           `求${N}的正约数中偶数的个数。偶数约数至少含一个因数2，所以2的指数从1开始取。`),
        `${N} \\;\\Rightarrow\\; \\square`, ans, [
          { tex:`${N}=${primeTex(fs)}` },
          { tex:`${[String(e2)].concat(others.map(([, e]) => `(${e}+1)`)).join('\\times')}=\\square`, blank:ans }]);
    }
    const ans = fs.reduce((t, [, e]) => t * (e + 1), 1);
    return item(
      L3(`${N} 의 양의 약수의 개수를 구합니다. 소인수분해한 뒤 각 지수에 1 을 더해 곱합니다(곱의 법칙).`,
         `Count the positive divisors of ${N}. Factor into primes, add 1 to each exponent, and multiply (multiplication rule).`,
         `求${N}的正约数的个数。分解质因数后把各指数加1再相乘(乘法原理)。`),
      `${N} \\;\\Rightarrow\\; \\square`, ans, [
        { tex:`${N}=${primeTex(fs)}` },
        { tex:`${fs.map(([, e]) => `(${e}+1)`).join('\\times')}=\\square`, blank:ans }]);
  }

  /* sum(기본) */
  const kind = pick(rng, ['dice', 'multiple', 'ineq']);
  if (kind === 'dice') {
    const s1 = R(rng, 2, 12); let s2 = R(rng, 2, 12), g = 0;
    while (s2 === s1 && g++ < 20) s2 = R(rng, 2, 12);
    if (s2 === s1) s2 = s1 === 12 ? 11 : s1 + 1;
    const lo = Math.min(s1, s2), hi = Math.max(s1, s2);
    const ans = DICE(lo) + DICE(hi);
    return word(
      L3(`서로 다른 두 개의 주사위를 동시에 던집니다. 나온 눈의 수의 합이 ${lo} 또는 ${hi} 입니다.`,
         `Two different dice are thrown together. The sum of the numbers shown is ${lo} or ${hi}.`,
         `同时掷两枚不同的骰子，点数之和为${lo}或${hi}。`),
      L3('이러한 경우는 모두 몇 가지입니까?', 'How many such outcomes are there?', '这样的情况共有多少种？'),
      `\\square`, ans, [
        { tex:`${lo}\\text{: } ${DICE(lo)},\\quad ${hi}\\text{: } ${DICE(hi)}` },
        { tex:`${DICE(lo)}+${DICE(hi)}=\\square`, blank:ans }]);
  }
  if (kind === 'ineq') {
    const k = R(rng, 2, 3), n = R(rng, k + 3, 14);
    const cnt = []; for (let y = 1; n - k * y >= 1; y++) cnt.push(n - k * y);
    const ans = cnt.reduce((t, v) => t + v, 0);
    return word(
      L3(`자연수 x, y 가 다음 부등식을 만족합니다: x+${k}y≤${n}. y=1, 2, 3, … 일 때로 나누어 가능한 x 의 개수를 세고 더합니다(합의 법칙).`,
         `Natural numbers x and y satisfy x+${k}y≤${n}. Split into cases y=1, 2, 3, …, count the possible x in each, and add (addition rule).`,
         `自然数x、y满足x+${k}y≤${n}。按y=1、2、3、…分情况，数出x的个数再相加(加法原理)。`),
      L3('순서쌍 (x, y) 는 모두 몇 개입니까?', 'How many ordered pairs (x, y) are there?', '有序数对(x, y)共有多少个？'),
      `x+${k}y\\le ${n} \\;\\Rightarrow\\; \\square`, ans, [
        { tex:`y=${cnt.length <= 4 ? cnt.map((_, i) => i + 1).join(',\\ ') : `1,\\ 2,\\ \\cdots,\\ ${cnt.length}`}` },
        { tex:`${cnt.join('+')}=\\square`, blank:ans }]);
  }
  const pq = pick(rng, [[2, 3], [2, 5], [3, 4], [3, 5], [4, 5], [2, 7], [3, 7]]);
  const [p, q] = pq, N = R(rng, 30, 100);
  const A = Math.floor(N / p), B = Math.floor(N / q), Cc = Math.floor(N / (p * q));
  const ans = A + B - Cc;
  return word(
    L3(`1 부터 ${N} 까지의 자연수 중에서 하나를 고릅니다. 고른 수가 ${p} 의 배수 또는 ${q} 의 배수입니다.`,
       `Choose one natural number from 1 to ${N}. The number is a multiple of ${p} or a multiple of ${q}.`,
       `从1到${N}的自然数中选一个，它是${p}的倍数或${q}的倍数。`),
    L3(`이러한 경우는 몇 가지입니까? (${p * q} 의 배수는 두 번 세지 않습니다)`, `How many such cases are there? (Do not count multiples of ${p * q} twice.)`, `这样的情况有多少种？(${p * q}的倍数不要重复计算)`),
    `\\square`, ans, [
      { tex:`${p}\\text{: } ${A},\\quad ${q}\\text{: } ${B},\\quad ${p * q}\\text{: } ${Cc}` },
      { tex:`${A}+${B}-${Cc}=\\square`, blank:ans }]);
};

/* ── MD111 — 순열 ── */
function nPr(n, r){ return `{}_{${n}}\\mathrm{P}_{${r}}`; }
/* 한 줄로 놓는 장면 — 사람이 서거나 책을 꽂는다. k 는 이름 붙은 것의 개수(A, B, …) */
function lineScene(rng, n, k){
  const labs = ['A', 'B', 'C', 'D'].slice(0, k);
  const ko = labs.join(', '), zh = labs.join('、');
  const en = k === 1 ? 'A' : k === 2 ? 'A and B' : labs.slice(0, -1).join(', ') + ' and ' + labs[k - 1];
  return pick(rng, [0, 1])
    ? L3(`${ko} 를 포함한 ${n}명이 한 줄로 섭니다.`, `${n} people including ${en} stand in a line.`, `包括${zh}在内的${n}人站成一排。`)
    : L3(`${ko} 를 포함한 서로 다른 책 ${n}권을 책꽂이에 한 줄로 꽂습니다.`, `${n} different books including ${en} are placed in a row on a shelf.`, `把包括${zh}在内的${n}本不同的书排成一排放在书架上。`);
}
NM_TGEN['md111_perm'] = function (params, rng) {
  const mode = params.mode || 'value';

  if (mode === 'adjacent') {
    const kind = pick(rng, ['two', 'three', 'pairs', 'girls', 'blocks']);
    if (kind === 'girls' || kind === 'blocks') {
      const a = R(rng, 2, 5), b = R(rng, 2, 4);
      const story = L3(`남학생 ${a}명과 여학생 ${b}명이 한 줄로 섭니다.`, `${a} boys and ${b} girls stand in a line.`, `${a}名男生和${b}名女生站成一排。`);
      if (kind === 'blocks') {
        const ans = 2 * fact(a) * fact(b);
        return word(story,
          L3('남학생은 남학생끼리, 여학생은 여학생끼리 이웃하게 서는 방법은 몇 가지입니까?', 'In how many ways can the boys all stand together and the girls all stand together?', '男生站在一起、女生站在一起的排法有多少种？'),
          `\\square`, ans, [
            { tex:`2!\\times${a}!\\times${b}!` },
            { tex:`2\\times${fact(a)}\\times${fact(b)}=\\square`, blank:ans }]);
      }
      const ans = fact(a + 1) * fact(b);
      return word(story,
        L3('여학생끼리 모두 이웃하게 서는 방법은 몇 가지입니까?', 'In how many ways can all the girls stand next to each other?', '女生全部相邻的排法有多少种？'),
        `\\square`, ans, [
          { tex:`${a + 1}!\\times${b}!` },
          { tex:`${fact(a + 1)}\\times${fact(b)}=\\square`, blank:ans }]);
    }
    if (kind === 'pairs') {
      const n = R(rng, 5, 8), ans = fact(n - 2) * 2 * 2;
      return word(lineScene(rng, n, 4),
        L3('A 와 B 가 이웃하고, C 와 D 도 이웃하는 방법은 몇 가지입니까?', 'In how many arrangements are A and B next to each other and C and D also next to each other?', 'A和B相邻、C和D也相邻的排法有多少种？'),
        `\\square`, ans, [
          { tex:`${n - 2}!\\times2!\\times2!` },
          { tex:`${fact(n - 2)}\\times2\\times2=\\square`, blank:ans }]);
    }
    const k = kind === 'three' ? 3 : 2, n = R(rng, k + 2, 8);
    const ans = fact(n - k + 1) * fact(k);
    const who = k === 3 ? L3('A, B, C 가 모두', 'A, B and C are all', 'A、B、C全部') : L3('A 와 B 가', 'A and B are', 'A和B');
    return word(lineScene(rng, n, k),
      L3(`${who.ko} 이웃하는 방법은 몇 가지입니까?`, `In how many arrangements ${who.en} next to each other?`, `${who.zh}相邻的排法有多少种？`),
      `\\square`, ans, [
        { tex:`${n - k + 1}!\\times${k}!` },
        { tex:`${fact(n - k + 1)}\\times${fact(k)}=\\square`, blank:ans }]);
  }

  if (mode === 'apart') {
    const kind = pick(rng, ['twoApart', 'threeApart', 'notEnd', 'girlsApart', 'alternate', 'atLeast']);
    if (kind === 'threeApart') {
      /* 나머지 n−3 을 먼저 놓고, 그 사이사이·양 끝 n−2 자리에 A, B, C 를 하나씩 */
      const n = R(rng, 5, 8), ans = fact(n - 3) * perm(n - 2, 3);
      return word(lineScene(rng, n, 3),
        L3('A, B, C 가운데 어느 둘도 이웃하지 않는 방법은 몇 가지입니까?', 'In how many arrangements are no two of A, B and C next to each other?', 'A、B、C中任意两个都不相邻的排法有多少种？'),
        `\\square`, ans, [
          { tex:`${n - 3}!\\times${nPr(n - 2, 3)}` },
          { tex:`${fact(n - 3)}\\times${perm(n - 2, 3)}=\\square`, blank:ans }]);
    }
    if (kind === 'notEnd') {
      /* '적어도'의 반대: 전체에서 A 가 양 끝에 오는 경우를 뺀다 */
      const n = R(rng, 4, 8), ans = fact(n) - 2 * fact(n - 1);
      return word(lineScene(rng, n, 1),
        L3('A 가 양 끝이 아닌 자리에 놓이는 방법은 몇 가지입니까?', 'In how many arrangements is A at neither end?', 'A不在两端的排法有多少种？'),
        `\\square`, ans, [
          { tex:`${n}!-2\\times${n - 1}!` },
          { tex:`${fact(n)}-${2 * fact(n - 1)}=\\square`, blank:ans }]);
    }
    if (kind === 'twoApart') {
      const n = R(rng, 4, 8), ans = fact(n) - 2 * fact(n - 1);
      return word(lineScene(rng, n, 2),
        L3('A 와 B 가 이웃하지 않게 놓이는 방법은 몇 가지입니까?', 'In how many arrangements are A and B not next to each other?', 'A和B不相邻的排法有多少种？'),
        `\\square`, ans, [
          { tex:`${n}!-${n - 1}!\\times2!` },
          { tex:`${fact(n)}-${2 * fact(n - 1)}=\\square`, blank:ans }]);
    }
    const a = R(rng, 2, 5); let b = R(rng, 2, Math.min(4, 8 - a));   /* atLeast 용 */
    const story = () => L3(`남학생 ${a}명과 여학생 ${b}명이 한 줄로 섭니다.`, `${a} boys and ${b} girls stand in a line.`, `${a}名男生和${b}名女生站成一排。`);
    if (kind === 'alternate') {
      /* 남학생이 여학생과 같거나 1 명 많다(그래야 번갈아 설 수 있다) */
      const a3 = R(rng, 2, 5), b3 = pick(rng, [a3, a3 - 1 >= 2 ? a3 - 1 : a3]);
      const ans = (a3 === b3 ? 2 : 1) * fact(a3) * fact(b3);
      return word(L3(`남학생 ${a3}명과 여학생 ${b3}명이 한 줄로 섭니다.`, `${a3} boys and ${b3} girls stand in a line.`, `${a3}名男生和${b3}名女生站成一排。`),
        L3('남학생과 여학생이 번갈아 서는 방법은 몇 가지입니까?', 'In how many ways can boys and girls stand alternately?', '男生和女生交替站的排法有多少种？'),
        `\\square`, ans, [
          { tex: a3 === b3 ? `2\\times${a3}!\\times${b3}!` : `${a3}!\\times${b3}!` },
          { tex:`${a3 === b3 ? '2\\times' : ''}${fact(a3)}\\times${fact(b3)}=\\square`, blank:ans }]);
    }
    if (kind === 'atLeast') {
      const n = a + b, ans = fact(n) - perm(a, 2) * fact(n - 2);
      return word(story(),
        L3('양 끝 가운데 적어도 한쪽에 여학생이 서는 방법은 몇 가지입니까?', 'In how many ways can at least one end be a girl?', '两端中至少有一端是女生的排法有多少种？'),
        `\\square`, ans, [
          { tex:`${n}!-${nPr(a, 2)}\\times${n - 2}!` },
          { tex:`${fact(n)}-${perm(a, 2)}\\times${fact(n - 2)}=\\square`, blank:ans }]);
    }
    /* girlsApart — 남학생을 먼저 세우고 사이사이·양 끝 (a+1) 자리에 여학생 */
    const a2 = R(rng, 3, 6);
    b = R(rng, 2, Math.min(4, 9 - a2));
    const ans = fact(a2) * perm(a2 + 1, b);
    return word(
      L3(`남학생 ${a2}명과 여학생 ${b}명이 한 줄로 섭니다.`, `${a2} boys and ${b} girls stand in a line.`, `${a2}名男生和${b}名女生站成一排。`),
      L3('여학생끼리 이웃하지 않게 서는 방법은 몇 가지입니까?', 'In how many ways can they stand so that no two girls are next to each other?', '女生互不相邻的排法有多少种？'),
      `\\square`, ans, [
        { tex:`${a2}!\\times${nPr(a2 + 1, b)}` },
        { tex:`${fact(a2)}\\times${perm(a2 + 1, b)}=\\square`, blank:ans }]);
  }

  /* deep(심화) — 2026-10-01 신규. 원장 "순열에 심화 넣고". 팩토리얼의 구조를 보는 네 가지:
     ① (n+1)!/(n−1)! = n(n+1) 으로 n 찾기 ② ₙP₃ = N 에서 n ③ 끝자리 0 의 개수(5 의 배수 세기)
     ④ 1·1!+2·2!+…+k·k! = (k+1)!−1 (곱을 차로 바꾸면 가운데가 지워진다). 답은 모두 정수 하나. */
  if (mode === 'deep') {
    const dk = pick(rng, ['shift', 'p3', 'zeros', 'sumfact']);
    if (dk === 'shift') {
      const n = R(rng, 3, 14), N = n * (n + 1);
      return item(
        L3('(n+1)!=(n+1)×n×(n−1)! 이므로 분모의 (n−1)! 과 약분하면 n(n+1) 만 남습니다.', '(n+1)! = (n+1)×n×(n−1)!, so dividing by (n−1)! leaves n(n+1).', '(n+1)!=(n+1)×n×(n−1)!，与分母的(n−1)!约分后只剩n(n+1)。'),
        `\\dfrac{(n+1)!}{(n-1)!}=${N} \\;\\Rightarrow\\; n=\\square`, n, [
          { tex:`n(n+1)=${N}=${n}\\times${n + 1}` },
          { tex:`n=\\square`, blank:n }]);
    }
    if (dk === 'p3') {
      const n = R(rng, 4, 11), N = n * (n - 1) * (n - 2);
      return item(
        L3('ₙP₃=n(n−1)(n−2) 입니다. 연속한 세 자연수의 곱으로 나타내어 n 을 구합니다.', 'ₙP₃ = n(n−1)(n−2). Write the number as a product of three consecutive naturals to find n.', 'ₙP₃=n(n−1)(n−2)。把数写成三个连续自然数的积，求n。'),
        `${nPr('n', 3)}=${N} \\;\\Rightarrow\\; n=\\square`, n, [
          { tex:`n(n-1)(n-2)=${N}=${n}\\times${n - 1}\\times${n - 2}` },
          { tex:`n=\\square`, blank:n }]);
    }
    if (dk === 'zeros') {
      const n = R(rng, 10, 60), z = Math.floor(n / 5) + Math.floor(n / 25);
      return item(
        L3(`${n}! 의 일의 자리에서부터 이어지는 0 의 개수를 구합니다. 0 은 2×5 마다 하나씩 생기고 2 는 충분히 많으므로 5 의 개수만 셉니다(5 의 배수 + 25 의 배수).`, `Count the zeros at the end of ${n}!. Each 2×5 makes one zero and 2s are plentiful, so count the 5s (multiples of 5, plus extra for multiples of 25).`, `求${n}!末尾连续0的个数。每个2×5产生一个0，2足够多，所以只数5的个数（5的倍数再加25的倍数）。`),
        `${n}! \\;\\Rightarrow\\; \\square`, z, [
          { tex:`\\lfloor ${n}\\div 5\\rfloor + \\lfloor ${n}\\div 25\\rfloor = ${Math.floor(n / 5)}+${Math.floor(n / 25)}` },
          { tex:`${Math.floor(n / 5)}+${Math.floor(n / 25)}=\\square`, blank:z }]);
    }
    const k = R(rng, 3, 7), tot = fact(k + 1) - 1;
    const sumTex = Array.from({ length: Math.min(k, 3) }, (_, i) => `${i + 1}\\times ${i + 1}!`).join('+') + (k > 3 ? `+\\cdots+${k}\\times ${k}!` : '');
    return item(
      L3('k×k! = (k+1)! − k! 이므로 각 항을 차로 바꾸면 가운데가 서로 지워져 (k+1)!−1 만 남습니다.', 'k×k! = (k+1)! − k!, so the middle terms cancel and only (k+1)! − 1 is left.', 'k×k!=(k+1)!−k!，每项拆成差后中间互相抵消，只剩(k+1)!−1。'),
      `${sumTex} = \\square`, tot, [
        { tex:`(k+1)!-1 = ${k + 1}!-1 = ${fact(k + 1)}-1` },
        { tex:`${fact(k + 1)}-1=\\square`, blank:tot }]);
  }

  /* value(기본) */
  const kind = pick(rng, ['nPr', 'nPr', 'solve', 'fact']);
  if (kind === 'solve') {
    const n = R(rng, 3, 15), N = n * (n - 1);
    return item(
      L3('ₙP₂=n(n−1) 입니다. 연속한 두 자연수의 곱으로 나타내어 n 을 구합니다.', 'ₙP₂=n(n−1). Write the number as a product of two consecutive natural numbers to find n.', 'ₙP₂=n(n−1)。把它写成两个连续自然数之积，求n。'),
      `${nPr('n', 2)}=${N} \\;\\Rightarrow\\; n=\\square`, n, [
        { tex:`n(n-1)=${N}=${n}\\times${n - 1}` },
        { tex:`n=\\square`, blank:n }]);
  }
  if (kind === 'fact') {
    const n = R(rng, 5, 12), m = n - R(rng, 1, 3);
    const vs = desc(n, n - m), ans = perm(n, n - m);
    return item(
      L3('n!=n×(n−1)×…×1 입니다. 분모와 겹치는 부분을 약분합니다.', 'n!=n×(n−1)×…×1. Cancel the part shared with the denominator.', 'n!=n×(n−1)×…×1。约去与分母相同的部分。'),
      `\\dfrac{${n}!}{${m}!}=\\square`, ans, [
        { tex:`\\dfrac{${n}!}{${m}!}=${times(vs)}` },
        { tex:`${times(vs)}=\\square`, blank:ans }]);
  }
  const n = R(rng, 4, 12), r = R(rng, 2, Math.min(5, n));
  const ans = perm(n, r);
  return item(
    L3('ₙPᵣ 는 서로 다른 n 개에서 r 개를 골라 한 줄로 늘어놓는 경우의 수입니다. n 부터 1 씩 줄여 가며 r 개를 곱합니다.',
       'ₙPᵣ counts the ways to choose r of n different things and arrange them in a row: multiply r factors starting at n and going down by 1.',
       'ₙPᵣ是从n个不同元素中取r个排成一列的方法数：从n开始每次减1，连乘r个数。'),
    `${nPr(n, r)}=\\square`, ans, [
      { tex:`${nPr(n, r)}=${times(desc(n, r))}` },
      { tex:`${times(desc(n, r))}=\\square`, blank:ans }]);
};

/* ── MD112 — 사전식 배열·자연수의 개수 ── */
function rankOf(seq){
  /* seq: 서로 다른 값의 배열 → 사전식 순서(1부터) · 각 자리 [작은 것 개수, 남은 자리 수!] */
  let rank = 1; const parts = []; const left = seq.slice();
  for (let i = 0; i < seq.length; i++) {
    const smaller = left.filter(v => v < seq[i]).length;
    const f = fact(seq.length - 1 - i);
    if (smaller) parts.push([smaller, f]);
    rank += smaller * f;
    left.splice(left.indexOf(seq[i]), 1);
  }
  return { rank, parts };
}
function kth(sorted, k){
  const left = sorted.slice(), out = []; let rem = k - 1; const parts = [];
  for (let i = sorted.length - 1; i >= 0; i--) {
    const f = fact(i), idx = Math.floor(rem / f);
    if (idx) parts.push([idx, f]);
    out.push(left[idx]); left.splice(idx, 1); rem -= idx * f;
  }
  return { out, parts };
}
function partsTex(parts){ return parts.length ? parts.map(([c, f]) => `${c}\\times${f}`).join('+') : '0'; }
NM_TGEN['md112_lexOrder'] = function (params, rng) {
  const mode = params.mode || 'rank';

  if (mode === 'rank') {
    const n = pick(rng, [4, 5]);
    const letters = pick(rng, [0, 1]);
    const pool = letters ? ['a', 'b', 'c', 'd', 'e', 'f', 'g'] : [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const chosen = shuffle(rng, pool.map((_, i) => i)).slice(0, n).sort((u, v) => u - v);
    const show = i => String(pool[i]);
    const listTex = chosen.map(show).join(', ');
    const askK = pick(rng, [0, 1]);
    const storyL = letters
      ? L3(`문자 ${n}개(${listTex})를 한 번씩 모두 써서 만든 문자열을 사전식으로(알파벳 순서대로) 늘어놓습니다.`,
           `All strings using each of ${listTex} exactly once are listed in dictionary (alphabetical) order.`,
           `把${listTex}各用一次组成的所有字符串按字典顺序排列。`)
      : L3(`숫자 ${n}개(${listTex})를 한 번씩 모두 써서 만든 ${n}자리 자연수를 작은 수부터 차례로 늘어놓습니다.`,
           `All ${n}-digit numbers using each of ${listTex} exactly once are listed from smallest to largest.`,
           `把${listTex}各用一次组成的所有${n}位数从小到大排列。`);
    if (askK && !letters) {
      const k = R(rng, 2, fact(n) - 1);
      const { out, parts } = kth(chosen, k);
      const ans = Number(out.map(show).join(''));
      return word(storyL,
        L3(`${k}번째 수는 무엇입니까?`, `What is the number in position ${k}?`, `第${k}个数是多少？`),
        `\\square`, ans, [
          { tex:`${k}-1=${partsTex(parts)}` },
          { tex:`\\square`, blank:ans }]);
    }
    let seq, g = 0;
    do { seq = shuffle(rng, chosen); } while (seq.every((v, i) => v === chosen[i]) && g++ < 10);
    const { rank, parts } = rankOf(seq);
    const target = seq.map(show).join('');
    return word(storyL,
      L3(`몇 번째가 ${target} 입니까?`, `In which position is ${target}?`, `${target}排在第几个？`),
      `\\square`, rank, [
        { tex:`${partsTex(parts)}+1=\\square`, blank:rank }]);
  }

  if (mode === 'even') {
    /* 0 이 없는 서로 다른 숫자 n 개로 r 자리 수 */
    let S, g = 0;
    do { S = shuffle(rng, [1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, R(rng, 4, 6)).sort((u, v) => u - v); }
    while (!S.some(d => d % 2 === 0) && g++ < 20);
    const n = S.length, r = R(rng, 3, Math.min(4, n));
    const ev = S.filter(d => d % 2 === 0).length, od = n - ev;
    let kind = pick(rng, ['even', 'odd', 'five']);
    if (kind === 'five' && S.indexOf(5) < 0) kind = 'even';
    if (kind === 'odd' && od === 0) kind = 'even';
    const cnt = kind === 'even' ? ev : kind === 'odd' ? od : 1;
    const ans = cnt * perm(n - 1, r - 1);
    const what = kind === 'even' ? L3('짝수', 'even', '偶数') : kind === 'odd' ? L3('홀수', 'odd', '奇数') : L3('5의 배수', 'multiples of 5', '5的倍数');
    return word(
      L3(`숫자 카드 ${n}장(${S.join(', ')})에서 ${r}장을 뽑아 ${r}자리 자연수를 만듭니다.`,
         `Draw ${r} of the ${n} cards ${S.join(', ')} to form a ${r}-digit natural number.`,
         `从写有${S.join('、')}的${n}张卡片中抽${r}张组成${r}位自然数。`),
      L3(`이 가운데 ${what.ko}는 몇 개입니까? (일의 자리부터 정합니다)`, `How many of them are ${what.en}? (Fix the ones digit first.)`, `其中${what.zh}有多少个？(先确定个位)`),
      `\\square`, ans, [
        { tex:`${cnt}\\times${nPr(n - 1, r - 1)}` },
        { tex:`${cnt}\\times${perm(n - 1, r - 1)}=\\square`, blank:ans }]);
  }

  /* zero — 0 을 포함한 서로 다른 숫자, 맨 앞자리에 0 이 올 수 없다 */
  const nz = shuffle(rng, [1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, R(rng, 3, 5)).sort((u, v) => u - v);
  const S = [0].concat(nz), n = S.length, r = R(rng, 3, Math.min(4, n));
  let kind = pick(rng, ['all', 'even', 'even', 'five', 'odd']);
  if (kind === 'five' && nz.indexOf(5) < 0) kind = 'even';
  const e1 = nz.filter(d => d % 2 === 0).length, o1 = nz.length - e1;
  if (kind === 'odd' && o1 === 0) kind = 'all';
  if (kind === 'even' && e1 === 0) kind = 'all';     /* 0 뿐이면 두 번째 갈래가 0 항이 된다 */
  const story = L3(`숫자 카드 ${n}장(${S.join(', ')})에서 ${r}장을 뽑아 ${r}자리 자연수를 만듭니다.`,
    `Draw ${r} of the ${n} cards ${S.join(', ')} to form a ${r}-digit natural number.`,
    `从写有${S.join('、')}的${n}张卡片中抽${r}张组成${r}位自然数。`);
  if (kind === 'all') {
    const ans = (n - 1) * perm(n - 1, r - 1);
    return word(story,
      L3('만들 수 있는 자연수는 몇 개입니까? (맨 앞자리에는 0 이 올 수 없습니다)', 'How many natural numbers can be formed? (The first digit cannot be 0.)', '能组成多少个自然数？(首位不能是0)'),
      `\\square`, ans, [
        { tex:`${n - 1}\\times${nPr(n - 1, r - 1)}` },
        { tex:`${n - 1}\\times${perm(n - 1, r - 1)}=\\square`, blank:ans }]);
  }
  if (kind === 'odd') {
    const ans = o1 * (n - 2) * perm(n - 2, r - 2);
    return word(story,
      L3('이 가운데 홀수는 몇 개입니까? (일의 자리를 먼저, 그다음 맨 앞자리를 정합니다)', 'How many of them are odd? (Fix the ones digit first, then the first digit.)', '其中奇数有多少个？(先定个位，再定首位)'),
      `\\square`, ans, [
        { tex:`${o1}\\times${n - 2}\\times${nPr(n - 2, r - 2)}` },
        { tex:`${o1}\\times${n - 2}\\times${perm(n - 2, r - 2)}=\\square`, blank:ans }]);
  }
  const m = kind === 'five' ? 1 : e1;           /* 일의 자리에 올 0 아닌 숫자 개수 */
  const A = perm(n - 1, r - 1), B = m * (n - 2) * perm(n - 2, r - 2);
  const ans = A + B;
  const what = kind === 'five' ? L3('5의 배수', 'multiples of 5', '5的倍数') : L3('짝수', 'even', '偶数');
  return word(story,
    L3(`이 가운데 ${what.ko}는 몇 개입니까? (일의 자리가 0 인 경우와 아닌 경우로 나눕니다)`, `How many of them are ${what.en}? (Split into ones digit 0 and ones digit not 0.)`, `其中${what.zh}有多少个？(分个位是0和不是0两种情况)`),
    `\\square`, ans, [
      { tex:`${nPr(n - 1, r - 1)}+${m}\\times${n - 2}\\times${nPr(n - 2, r - 2)}` },
      { tex:`${A}+${B}=\\square`, blank:ans }]);
};

/* ── MD113 — 조합 ── */
function nCr(n, r){ return `{}_{${n}}\\mathrm{C}_{${r}}`; }
function combTex(n, r){ return `\\dfrac{${times(desc(n, r))}}{${times(desc(r, r))}}`; }
NM_TGEN['md113_comb'] = function (params, rng) {
  const mode = params.mode || 'value';

  if (mode === 'include') {
    const n = R(rng, 6, 12), kind = pick(rng, ['in', 'out', 'both', 'inOut']);
    const r = kind === 'both' ? R(rng, 3, 5) : R(rng, 2, 5);
    let m, k, ask;
    if (kind === 'in') { m = n - 1; k = r - 1; ask = L3('A 가 반드시 뽑히는 방법은 몇 가지입니까?', 'In how many ways is A always chosen?', 'A一定被选中的方法有多少种？'); }
    else if (kind === 'out') { m = n - 1; k = r; ask = L3('A 가 뽑히지 않는 방법은 몇 가지입니까?', 'In how many ways is A not chosen?', 'A不被选中的方法有多少种？'); }
    else if (kind === 'both') { m = n - 2; k = r - 2; ask = L3('A 와 B 가 모두 뽑히는 방법은 몇 가지입니까?', 'In how many ways are both A and B chosen?', 'A和B都被选中的方法有多少种？'); }
    else { m = n - 2; k = r - 1; ask = L3('A 는 뽑히고 B 는 뽑히지 않는 방법은 몇 가지입니까?', 'In how many ways is A chosen but B not?', 'A被选中而B不被选中的方法有多少种？'); }
    const ans = comb(m, k);
    return word(
      L3(`A, B 를 포함한 ${n}명 가운데 ${r}명을 뽑습니다.`, `Choose ${r} people from ${n} people including A and B.`, `从包括A、B在内的${n}人中选${r}人。`),
      ask, `\\square`, ans, [
        { tex:nCr(m, k) },
        { tex: k <= 1 ? `${nCr(m, k)}=\\square` : `${combTex(m, k)}=\\square`, blank:ans }]);
  }

  if (mode === 'atLeast') {
    const a = R(rng, 3, 6), b = R(rng, 2, 5), r = R(rng, 2, Math.min(4, a));
    const story = L3(`남학생 ${a}명과 여학생 ${b}명 가운데 ${r}명을 뽑습니다.`, `Choose ${r} students from ${a} boys and ${b} girls.`, `从${a}名男生和${b}名女生中选${r}人。`);
    const kind = pick(rng, ['girl', 'each', 'exact']);
    const T = comb(a + b, r), Aa = comb(a, r), Bb = comb(b, r);
    if (kind === 'each') {
      const ans = T - Aa - Bb;
      return word(story,
        L3('남학생과 여학생이 적어도 한 명씩 뽑히는 방법은 몇 가지입니까?', 'In how many ways is at least one boy and at least one girl chosen?', '男生和女生至少各选一人的方法有多少种？'),
        `\\square`, ans, [
          { tex:`${nCr(a + b, r)}-${nCr(a, r)}${Bb ? '-' + nCr(b, r) : ''}` },
          { tex:`${T}-${Aa}${Bb ? '-' + Bb : ''}=\\square`, blank:ans }]);
    }
    if (kind === 'exact') {
      const i = R(rng, 1, r - 1 < 1 ? 1 : r - 1), j = r - i;
      if (j < 1 || j > b) return NM_TGEN['md113_comb'](params, rng);
      const ans = comb(a, i) * comb(b, j);
      return word(story,
        L3(`남학생 ${i}명, 여학생 ${j}명을 뽑는 방법은 몇 가지입니까?`, `In how many ways can exactly ${i} boy(s) and ${j} girl(s) be chosen?`, `选出${i}名男生、${j}名女生的方法有多少种？`),
        `\\square`, ans, [
          { tex:`${nCr(a, i)}\\times${nCr(b, j)}` },
          { tex:`${comb(a, i)}\\times${comb(b, j)}=\\square`, blank:ans }]);
    }
    const ans = T - Aa;
    return word(story,
      L3('여학생이 적어도 한 명 뽑히는 방법은 몇 가지입니까? (전체에서 남학생만 뽑는 경우를 뺍니다)', 'In how many ways is at least one girl chosen? (Subtract the all-boys choices from the total.)', '至少选一名女生的方法有多少种？(从全部中减去只选男生的情况)'),
      `\\square`, ans, [
        { tex:`${nCr(a + b, r)}-${nCr(a, r)}` },
        { tex:`${T}-${Aa}=\\square`, blank:ans }]);
  }

  /* value(기본) */
  const kind = pick(rng, ['nCr', 'nCr', 'sym', 'solve']);
  if (kind === 'sym') {
    const n = R(rng, 7, 20), s = R(rng, 2, Math.floor(n / 2) - 1);
    const ans = n - s;
    return item(
      L3('ₙCᵣ=ₙCₙ₋ᵣ 입니다. r 가 주어진 수와 다를 때 두 아래 첨자의 합이 n 이 됩니다.', 'ₙCᵣ=ₙCₙ₋ᵣ. When r differs from the given number, the two lower indices add up to n.', 'ₙCᵣ=ₙCₙ₋ᵣ。当r与给定的数不同时，两个下标之和等于n。'),
      `${nCr(n, 'r')}=${nCr(n, s)}\\ (r\\ne ${s}) \\;\\Rightarrow\\; r=\\square`, ans, [
        { tex:`r+${s}=${n}` },
        { tex:`r=\\square`, blank:ans }]);
  }
  if (kind === 'solve') {
    const n = R(rng, 3, 20), N = n * (n - 1) / 2;
    return item(
      L3('ₙC₂=n(n−1)/2 입니다. n(n−1) 을 연속한 두 자연수의 곱으로 나타냅니다.', 'ₙC₂=n(n−1)/2. Write n(n−1) as a product of two consecutive natural numbers.', 'ₙC₂=n(n−1)/2。把n(n−1)写成两个连续自然数之积。'),
      `${nCr('n', 2)}=${N} \\;\\Rightarrow\\; n=\\square`, n, [
        { tex:`n(n-1)=${2 * N}=${n}\\times${n - 1}` },
        { tex:`n=\\square`, blank:n }]);
  }
  const n = R(rng, 5, 12), r = R(rng, 2, Math.min(4, n - 2));
  const ans = comb(n, r);
  return item(
    L3('ₙCᵣ=ₙPᵣ÷r! 입니다. 순서를 생각하지 않으므로 r! 로 나눕니다.', 'ₙCᵣ=ₙPᵣ÷r!. Order does not matter, so divide by r!.', 'ₙCᵣ=ₙPᵣ÷r!。不考虑顺序，所以除以r!。'),
    `${nCr(n, r)}=\\square`, ans, [
      { tex:`${nCr(n, r)}=\\dfrac{${nPr(n, r)}}{${r}!}` },
      { tex:`${combTex(n, r)}=\\square`, blank:ans }]);
};

/* ── MD114 — 뽑아서 나열·도형의 개수 ── */
NM_TGEN['md114_selectArrange'] = function (params, rng) {
  const mode = params.mode || 'arrange';

  if (mode === 'lines') {
    const kind = pick(rng, ['circle', 'collinear', 'diag']);
    if (kind === 'diag') {
      const n = R(rng, 5, 20), ans = comb(n, 2) - n;
      return word(
        L3(`볼록 ${n}각형이 있습니다.`, `There is a convex polygon with ${n} sides.`, `有一个凸${n}边形。`),
        L3('대각선은 모두 몇 개입니까? (두 꼭짓점을 이은 선분에서 변을 뺍니다)', 'How many diagonals does it have? (Segments joining two vertices, minus the sides.)', '它共有多少条对角线？(连接两顶点的线段减去边)'),
        `\\square`, ans, [
          { tex:`${nCr(n, 2)}-${n}` },
          { tex:`${comb(n, 2)}-${n}=\\square`, blank:ans }]);
    }
    if (kind === 'collinear') {
      const n = R(rng, 6, 12), k = R(rng, 3, n - 2), ans = comb(n, 2) - comb(k, 2) + 1;
      return word(
        L3(`평면 위에 점 ${n}개가 있고, 그 가운데 ${k}개만 한 직선 위에 있습니다(그 밖의 어떤 세 점도 한 직선 위에 있지 않습니다).`,
           `There are ${n} points in a plane; exactly ${k} of them lie on one line (no other three are on a line).`,
           `平面上有${n}个点，其中只有${k}个在同一条直线上(其余任意三点不共线)。`),
        L3('두 점을 지나는 서로 다른 직선은 몇 개입니까?', 'How many different lines pass through two of the points?', '过其中两点的不同直线有多少条？'),
        `\\square`, ans, [
          { tex:`${nCr(n, 2)}-${nCr(k, 2)}+1` },
          { tex:`${comb(n, 2)}-${comb(k, 2)}+1=\\square`, blank:ans }]);
    }
    const n = R(rng, 5, 15), ans = comb(n, 2);
    return word(
      L3(`원 위에 서로 다른 점 ${n}개가 있습니다.`, `There are ${n} different points on a circle.`, `圆上有${n}个不同的点。`),
      L3('두 점을 지나는 직선은 몇 개입니까?', 'How many lines pass through two of the points?', '过其中两点的直线有多少条？'),
      `\\square`, ans, [
        { tex:nCr(n, 2) },
        { tex:`${combTex(n, 2)}=\\square`, blank:ans }]);
  }

  if (mode === 'triangles') {
    const kind = pick(rng, ['circle', 'collinear', 'parallel']);
    if (kind === 'parallel') {
      const a = R(rng, 2, 6), b = R(rng, 2, 6);
      const ans = comb(a, 2) * b + a * comb(b, 2);
      return word(
        L3(`평행한 두 직선 가운데 한 직선 위에 점 ${a}개, 다른 직선 위에 점 ${b}개가 있습니다.`,
           `On two parallel lines there are ${a} points on one line and ${b} points on the other.`,
           `两条平行直线中，一条上有${a}个点，另一条上有${b}个点。`),
        L3('이 점들을 꼭짓점으로 하는 삼각형은 몇 개입니까?', 'How many triangles have their vertices among these points?', '以这些点为顶点的三角形有多少个？'),
        `\\square`, ans, [
          { tex:`${nCr(a, 2)}\\times${b}+${a}\\times${nCr(b, 2)}` },
          { tex:`${comb(a, 2)}\\times${b}+${a}\\times${comb(b, 2)}=\\square`, blank:ans }]);
    }
    if (kind === 'collinear') {
      const n = R(rng, 6, 12), k = R(rng, 3, n - 2), ans = comb(n, 3) - comb(k, 3);
      return word(
        L3(`평면 위에 점 ${n}개가 있고, 그 가운데 ${k}개만 한 직선 위에 있습니다(그 밖의 어떤 세 점도 한 직선 위에 있지 않습니다).`,
           `There are ${n} points in a plane; exactly ${k} of them lie on one line (no other three are on a line).`,
           `平面上有${n}个点，其中只有${k}个在同一条直线上(其余任意三点不共线)。`),
        L3('세 점을 꼭짓점으로 하는 삼각형은 몇 개입니까?', 'How many triangles have three of the points as vertices?', '以其中三点为顶点的三角形有多少个？'),
        `\\square`, ans, [
          { tex:`${nCr(n, 3)}-${nCr(k, 3)}` },
          { tex:`${comb(n, 3)}-${comb(k, 3)}=\\square`, blank:ans }]);
    }
    const n = R(rng, 5, 14), ans = comb(n, 3);
    return word(
      L3(`원 위에 서로 다른 점 ${n}개가 있습니다.`, `There are ${n} different points on a circle.`, `圆上有${n}个不同的点。`),
      L3('세 점을 꼭짓점으로 하는 삼각형은 몇 개입니까?', 'How many triangles have three of the points as vertices?', '以其中三点为顶点的三角形有多少个？'),
      `\\square`, ans, [
        { tex:nCr(n, 3) },
        { tex:`${combTex(n, 3)}=\\square`, blank:ans }]);
  }

  /* arrange(기본) */
  const kind = pick(rng, ['mixed', 'withA', 'withAB']);
  if (kind === 'mixed') {
    const a = R(rng, 3, 6), b = R(rng, 3, 6), i = R(rng, 1, 2), j = R(rng, 1, 2);
    const ans = comb(a, i) * comb(b, j) * fact(i + j);
    return word(
      L3(`남학생 ${a}명과 여학생 ${b}명이 있습니다.`, `There are ${a} boys and ${b} girls.`, `有${a}名男生和${b}名女生。`),
      L3(`남학생 ${i}명과 여학생 ${j}명을 뽑아 한 줄로 세우는 방법은 몇 가지입니까?`, `In how many ways can you choose ${i} boy(s) and ${j} girl(s) and line them up?`, `选出${i}名男生和${j}名女生排成一排的方法有多少种？`),
      `\\square`, ans, [
        { tex:`${nCr(a, i)}\\times${nCr(b, j)}\\times${i + j}!` },
        { tex:`${comb(a, i)}\\times${comb(b, j)}\\times${fact(i + j)}=\\square`, blank:ans }]);
  }
  const n = R(rng, 5, 10);
  const two = kind === 'withAB';
  const r = R(rng, 3, 4), m = two ? comb(n - 2, r - 2) : comb(n - 1, r - 1);
  const ans = m * fact(r);
  return word(
    L3(`A, B 를 포함한 ${n}명 가운데 ${r}명을 뽑아 한 줄로 세웁니다.`, `Choose ${r} of ${n} people including A and B and line them up.`, `从包括A、B在内的${n}人中选${r}人排成一排。`),
    two
      ? L3('A 와 B 가 모두 뽑혀 줄에 서는 방법은 몇 가지입니까?', 'In how many ways are both A and B in the line?', 'A和B都被选中并排在队里的方法有多少种？')
      : L3('A 가 반드시 뽑혀 줄에 서는 방법은 몇 가지입니까?', 'In how many ways is A always in the line?', 'A一定被选中并排在队里的方法有多少种？'),
    `\\square`, ans, [
      { tex:`${two ? nCr(n - 2, r - 2) : nCr(n - 1, r - 1)}\\times${r}!` },
      { tex:`${m}\\times${fact(r)}=\\square`, blank:ans }]);
};

if (typeof module !== 'undefined' && module.exports) module.exports = NM_TGEN;
})();
