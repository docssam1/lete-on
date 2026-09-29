/* ============================================================
   Numbers of Magic — MD154~MD159 미적분Ⅰ 새 유형 생성기 (2026-09-29)
   근거: docs/high-build-spec.md (미적분Ⅰ 새 유형 목록). 교과서 없이 문제를 전부 새로 만든다.

   MD154 미분법 공식                     poly · product · power
   MD155 평균값 정리·롤의 정리            rolle · mvt · more
   MD156 함수의 증가·감소                 interval · always · local
   MD157 닫힌 구간에서의 최대·최소         cubic · quartic · coef
   MD158 방정식·부등식에의 활용            count · k · ineq
   MD159 정적분의 성질·정적분으로 정의된 함수  prop · deriv · fn

   계약: NM_TGEN[gen](params, rng), Math.random 금지. 답은 정수.
   **답을 먼저 고르고 식을 역산한다.** 삼·사차함수는 도함수의 근(정수)을 먼저 골라
   f′(x)=3p(x−c₁)(x−c₂), 4p(x−c₁)(x−c₂)(x−c₃) 에서 적분해 만든다(계수가 정수가 되는 것만).
   정적분은 원시함수의 계수를 정수로 먼저 고르고 미분해 피적분함수를 만든다 — 그래서 값이 정수다.
   인쇄물은 tex 만 싣는다 — M·m·N·S·↗·↘ 같은 기호는 레벨 지시문에서 정의한다.
   풀이 마지막 단계의 blank = 답. 문제 줄은 \frac·\bigl(\bigr) 만 쓴다.
   ⚠️ 정적분의 위끝에 1 을 쓰지 않는다 — 표기 다듬기(tex-tidy)가 `^{1}` 을 지운다.
   ============================================================ */
(function(){
'use strict';
const NM_TGEN = window.NM_TGEN = window.NM_TGEN || {};
const { R, pick } = NM_RNG;

/* ── 공용 헬퍼(파일별 독립 정의 관례) ── */
function nz(rng, lo, hi){ return R(rng, lo, hi) * pick(rng, [1, -1]); }
function par(n){ return n < 0 ? `(${n})` : String(n); }
function hasNeg(v){ return Array.isArray(v) ? v.some(x => x < 0) : v < 0; }
function L3(ko, en, zh){ return { ko, en, zh }; }
function lead(c, v){ if(!v) return String(c); return c === 1 ? v : c === -1 ? `-${v}` : `${c}${v}`; }
function more(c, v){
  if(c === 0) return '';
  const a = Math.abs(c);
  return (c < 0 ? '-' : '+') + (v ? (a === 1 ? v : `${a}${v}`) : String(a));
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
/* 차수 j 자리의 계수를 기호(sym)로 둔 다항식 — 기호 항은 언제나 + 로 붙인다 */
function polyA(cs, j, sym, v){
  sym = sym || 'a'; v = v || 'x';
  const n = cs.length - 1;
  let s = '';
  cs.forEach((c, i) => {
    const d = n - i;
    const vv = d === 0 ? '' : d === 1 ? v : `${v}^${d}`;
    if(d === j){ s += (s ? '+' : '') + sym + vv; return; }
    if(c === 0) return;
    s += s ? more(c, vv) : lead(c, vv);
  });
  return s;
}
function terms(list){
  let s = '';
  list.forEach(([c, v]) => { if(c === 0) return; s += s ? more(c, v) : lead(c, v); });
  return s || '0';
}
function item(prompt, tex, answer, solution, extra){
  const p = { prompt, tex, answer, answerType:'number', widget:'numpad', negative: hasNeg(answer), solution };
  return Object.assign(p, extra || {});
}
function pv(cs, x){ return cs.reduce((s, c) => s * x + c, 0); }
function dv(cs){ const n = cs.length - 1; return cs.slice(0, -1).map((c, i) => c * (n - i)); }
/* f′(x)=3p(x−c₁)(x−c₂)+m 인 삼차함수(상수항 s) */
function cubicCP(p, c1, c2, m, s){ return [p, -3 * p * (c1 + c2) / 2, 3 * p * c1 * c2 + m, s]; }
/* f′(x)=4p(x−c₁)(x−c₂)(x−c₃) 인 사차함수(상수항 s) */
function quarticCP(p, c1, c2, c3, s){
  const e1 = c1 + c2 + c3, e2 = c1 * c2 + c2 * c3 + c3 * c1, e3 = c1 * c2 * c3;
  return [p, -4 * p * e1 / 3, 2 * p * e2, -4 * p * e3, s];
}
function fac(c, v){ v = v || 'x'; return c === 0 ? v : `(${poly([1, -c], v)})`; }
function facTex(k, cs, v){ return `${k === 1 ? '' : k === -1 ? '-' : k}${cs.map(c => fac(c, v)).join('')}`; }
/* 곱의 미분 한 항 D·P — D 가 상수면 계수로 붙이고(1·−1 은 숨김), 아니면 괄호 두 개 */
function prodTerm(D, P, first){
  const body = `(${poly(P)})`;
  if (D.length === 1) return first ? lead(D[0], body) : more(D[0], body);
  return (first ? '' : '+') + `(${poly(D)})${body}`;
}
function iv(a, b){ return `${a}\\le x\\le${b}`; }
function ok3(p, c1, c2){ return (p * (c1 + c2)) % 2 === 0; }
function pickP(rng, c1, c2){ return (c1 + c2) % 2 ? pick(rng, [2, -2]) : pick(rng, [1, 1, 1, -1, -1, 2, -2]); }
function ext(f, xs){ const vs = xs.map(x => pv(f, x)); return { M: Math.max(...vs), m: Math.min(...vs), vs }; }

/* ── MD154 — 미분법 공식 ── */
NM_TGEN['md154_diffRules'] = function (params, rng) {
  const mode = params.mode || 'poly';

  if (mode === 'product') {
    const prompt = L3('곱의 미분법 {f(x)g(x)}′=f′(x)g(x)+f(x)g′(x) 를 씁니다. 전개해서 미분해도 되지만, 곱의 꼴 그대로 x 에 값을 넣으면 계산이 짧아집니다.',
      'Use the product rule {f(x)g(x)}′=f′(x)g(x)+f(x)g′(x). You may expand first, but substituting into the product form directly is shorter.',
      '用乘积的求导法则{f(x)g(x)}′=f′(x)g(x)+f(x)g′(x)。也可以先展开再求导，但保持乘积形式直接代值计算更短。');
    const fct = () => pick(rng, [0, 0, 1]) ? [pick(rng, [1, 1, 2, -1]), R(rng, -4, 4), nz(rng, 1, 5)] : [nz(rng, 1, 3), nz(rng, 1, 6)];
    for (let g = 0; g < 400; g++) {
      const kind = pick(rng, ['expl', 'expl', 'expl', 'g', 'fg']), x0 = R(rng, -3, 3);
      if (kind === 'fg') {
        const u = nz(rng, 1, 7), u1 = nz(rng, 1, 7), v = nz(rng, 1, 7), v1 = nz(rng, 1, 7), ans = u1 * v + u * v1;
        return item(prompt, `h(x)=f(x)g(x),\\ f(${x0})=${u},\\ f'(${x0})=${u1},\\ g(${x0})=${v},\\ g'(${x0})=${v1}\\ \\Rightarrow\\ h'(${x0})=\\square`, ans, [
          { tex:`h'(x)=f'(x)g(x)+f(x)g'(x)` },
          { tex:`h'(${x0})=${u1}\\times${par(v)}+${par(u)}\\times${par(v1)}` },
          { tex:`h'(${x0})=\\square`, blank:ans }]);
      }
      const A = fct(), dA = dv(A), a0 = pv(A, x0), a1 = pv(dA, x0);
      if (kind === 'g') {
        const u = nz(rng, 1, 6), v = nz(rng, 1, 6), ans = a1 * u + a0 * v;
        if (Math.abs(ans) > 300) continue;
        return item(prompt, `f(x)=(${poly(A)})g(x),\\ g(${x0})=${u},\\ g'(${x0})=${v}\\ \\Rightarrow\\ f'(${x0})=\\square`, ans, [
          { tex:`f'(x)=${dA.length === 1 ? lead(dA[0], 'g(x)') : `(${poly(dA)})g(x)`}+(${poly(A)})g'(x)` },
          { tex:`f'(${x0})=${a1}\\times${par(u)}+${par(a0)}\\times${par(v)}` },
          { tex:`f'(${x0})=\\square`, blank:ans }]);
      }
      const B = fct(), dB = dv(B), b0 = pv(B, x0), b1 = pv(dB, x0), ans = a1 * b0 + a0 * b1;
      if (Math.abs(ans) > 400 || poly(A) === poly(B)) continue;
      return item(prompt, `f(x)=(${poly(A)})(${poly(B)})\\ \\Rightarrow\\ f'(${x0})=\\square`, ans, [
        { tex:`f'(x)=${prodTerm(dA, B, true)}${prodTerm(dB, A, false)}` },
        { tex:`f'(${x0})=${par(a1)}\\times${par(b0)}+${par(a0)}\\times${par(b1)}` },
        { tex:`f'(${x0})=\\square`, blank:ans }]);
    }
  }

  if (mode === 'power') {
    const prompt = L3('{(ax+b)ⁿ}′=n(ax+b)ⁿ⁻¹×a 입니다. 괄호 안을 미분한 a 를 곱하는 것을 잊지 않습니다. 미정계수는 f′(x) 에 값을 넣어 만든 방정식으로 구합니다.',
      '{(ax+b)ⁿ}′=n(ax+b)ⁿ⁻¹×a. Do not forget to multiply by a, the derivative of the inside. Find an unknown coefficient from the equation you get by substituting into f′(x).',
      '{(ax+b)ⁿ}′=n(ax+b)ⁿ⁻¹×a。别忘了乘上括号内求导得到的a。待定系数用把值代入f′(x)得到的方程求出。');
    for (let g = 0; g < 400; g++) {
      const kind = pick(rng, ['val', 'val', 'mix', 'coefK', 'coefQ']);
      const a = nz(rng, 1, 3), b = nz(rng, 1, 6), x0 = R(rng, -3, 3), base = a * x0 + b;
      if (base === 0) continue;
      const B = poly([a, b]);
      if (kind === 'mix') {
        const n = pick(rng, [2, 3]), q = nz(rng, 1, 5), L = x0 + q;
        const ans = base ** n + L * n * a * base ** (n - 1);
        if (Math.abs(ans) > 3000 || L === 0) continue;
        return item(prompt, `f(x)=(${poly([1, q])})(${B})^{${n}}\\ \\Rightarrow\\ f'(${x0})=\\square`, ans, [
          { tex:`f'(x)=(${B})^{${n}}+(${poly([1, q])})\\times${par(n * a)}(${B})${n - 1 === 1 ? '' : `^{${n - 1}}`}` },
          { tex:`f'(${x0})=${par(base)}^{${n}}+${par(L)}\\times${par(n * a)}\\times${par(base)}${n - 1 === 1 ? '' : `^{${n - 1}}`}` },
          { tex:`f'(${x0})=\\square`, blank:ans }]);
      }
      const n = R(rng, 2, 5), D = n * a * base ** (n - 1);
      if (Math.abs(D) > 3000) continue;
      const dTex = `${n * a}(${B})${n - 1 === 1 ? '' : `^{${n - 1}}`}`;
      const dVal = `${n * a}\\times${par(base)}${n - 1 === 1 ? '' : `^{${n - 1}}`}`;
      if (kind === 'coefK') {
        const k = nz(rng, 1, 5), V = k * D;
        if (Math.abs(V) > 3000) continue;
        return item(prompt, `f(x)=k(${B})^{${n}},\\ f'(${x0})=${V}\\ \\Rightarrow\\ k=\\square`, k, [
          { tex:`f'(x)=${lead(n * a, 'k')}(${B})${n - 1 === 1 ? '' : `^{${n - 1}}`}` },
          { tex:`f'(${x0})=${D}k=${V}` },
          { tex:'k=\\square', blank:k }]);
      }
      if (kind === 'coefQ') {
        if (x0 === 0) continue;
        const k = nz(rng, 1, 6), V = D + 2 * k * x0;
        return item(prompt, `f(x)=(${B})^{${n}}+kx^2,\\ f'(${x0})=${V}\\ \\Rightarrow\\ k=\\square`, k, [
          { tex:`f'(x)=${dTex}+2kx` },
          { tex:`f'(${x0})=${terms([[D, ''], [2 * x0, 'k']])}=${V}` },
          { tex:'k=\\square', blank:k }]);
      }
      return item(prompt, `f(x)=(${B})^{${n}}\\ \\Rightarrow\\ f'(${x0})=\\square`, D, [
        { tex:`f'(x)=${dTex}` },
        { tex:`f'(${x0})=${dVal}` },
        { tex:`f'(${x0})=\\square`, blank:D }]);
    }
  }

  /* poly(기본) — 다항함수의 미분계수 */
  const prompt = L3('(xⁿ)′=nxⁿ⁻¹ 과 상수배·합의 미분법으로 f′(x) 를 구한 뒤 x 에 값을 넣습니다. 계수 a 가 있으면 f′(x) 에 값을 넣은 식을 a 에 대한 일차방정식으로 풉니다.',
    'Find f′(x) with (xⁿ)′=nxⁿ⁻¹ and the constant-multiple and sum rules, then substitute. If there is a coefficient a, solve the resulting linear equation in a.',
    '用(xⁿ)′=nxⁿ⁻¹及常数倍、和的求导法则求出f′(x)后代值。若有系数a，把代值后的式子当作关于a的一次方程来解。');
  for (let g = 0; g < 400; g++) {
    const x0 = R(rng, -3, 3);
    if (pick(rng, [0, 0, 1])) {
      const j = pick(rng, [1, 2, 2]);
      if (j === 2 && x0 === 0) continue;
      const cs = [nz(rng, 1, 3), R(rng, -6, 6), R(rng, -8, 8), R(rng, -9, 9)], a0 = nz(rng, 1, 6);
      cs[3 - j] = 0;
      const K = pv(dv(cs), x0), ca = j * x0 ** (j - 1), V = K + ca * a0;
      return item(prompt, `f(x)=${polyA(cs, j)},\\ f'(${x0})=${V}\\ \\Rightarrow\\ a=\\square`, a0, [
        { tex:`f'(x)=${polyA(dv(cs), j - 1, j === 1 ? 'a' : `${j}a`)}` },
        { tex:`f'(${x0})=${terms([[K, ''], [ca, 'a']])}=${V}` },
        { tex:'a=\\square', blank:a0 }]);
    }
    const deg = pick(rng, [3, 3, 4]);
    const cs = [nz(rng, 1, 4)];
    for (let i = 0; i < deg; i++) cs.push(R(rng, -6, 6));
    const ans = pv(dv(cs), x0);
    if (Math.abs(ans) > 300 || cs.filter(c => c).length < 3) continue;
    return item(prompt, `f(x)=${poly(cs)}\\ \\Rightarrow\\ f'(${x0})=\\square`, ans, [
      { tex:`f'(x)=${poly(dv(cs))}` },
      { tex:`f'(${x0})=\\square`, blank:ans }]);
  }
};

/* ── MD155 — 평균값 정리·롤의 정리 ── */
/* 삼차함수 f′(x)=3p(x−c₁)(x−c₂)+m 에서 [a,b] 의 평균변화율이 꼭 m 이 되는 (c₁,c₂,a,b) — 로드 때 한 번 찾는다.
   조건: (a²+ab+b²)−(3/2)(c₁+c₂)(a+b)+3c₁c₂=0. c 는 열린구간 (a,b) 안의 것만 센다. */
const MVT3 = [];
(function(){
  for (let c1 = -5; c1 <= 5; c1++) for (let c2 = c1 + 1; c2 <= 5; c2++)
    for (let a = -8; a <= 8; a++) for (let b = a + 1; b <= 8; b++) {
      if (2 * (a * a + a * b + b * b) - 3 * (c1 + c2) * (a + b) + 6 * c1 * c2 !== 0) continue;
      const ins = [c1, c2].filter(c => a < c && c < b);
      if (ins.length) MVT3.push({ c1, c2, a, b, ins });
    }
})();
NM_TGEN['md155_mvt'] = function (params, rng) {
  const mode = params.mode || 'rolle';
  const one = MVT3.filter(t => t.ins.length === 1), two = MVT3.filter(t => t.ins.length === 2);

  if (mode === 'mvt') {
    const prompt = L3('평균값 정리: f(x) 가 닫힌구간 [a, b] 에서 연속이고 열린구간 (a, b) 에서 미분가능하면 {f(b)−f(a)}/(b−a)=f′(c) 인 c 가 열린구간 (a, b) 에 있습니다. 그 c 의 값을 구합니다.',
      'Mean value theorem: if f(x) is continuous on [a, b] and differentiable on (a, b), there is c in (a, b) with {f(b)−f(a)}/(b−a)=f′(c). Find that c.',
      '拉格朗日中值定理：若f(x)在闭区间[a, b]上连续、在开区间(a, b)内可导，则开区间(a, b)内存在c使{f(b)−f(a)}/(b−a)=f′(c)。求这个c的值。');
    for (let g = 0; g < 400; g++) {
      if (pick(rng, [0, 1, 1])) {
        const t = pick(rng, one), p = pickP(rng, t.c1, t.c2), m = nz(rng, 1, 6), s = R(rng, -9, 9);
        const f = cubicCP(p, t.c1, t.c2, m, s), fa = pv(f, t.a), fb = pv(f, t.b), c = t.ins[0];
        if (Math.max(...f.map(Math.abs)) > 60) continue;
        return item(prompt, `f(x)=${poly(f)}\\ \\ (${iv(t.a, t.b)}),\\ \\frac{f(${t.b})-f(${t.a})}{${t.b}-${par(t.a)}}=f'(c)\\ \\Rightarrow\\ c=\\square`, c, [
          { tex:`\\frac{${fb}-${par(fa)}}{${t.b - t.a}}=${m}` },
          { tex:`f'(c)-${par(m)}=${facTex(3 * p, [t.c1, t.c2], 'c')}=0` },
          { tex:'c=\\square', blank:c }]);
      }
      const p = nz(rng, 1, 3), q = R(rng, -8, 8), r = R(rng, -9, 9), a = R(rng, -6, 5), b = a + 2 * R(rng, 1, 4), c = (a + b) / 2;
      const f = [p, q, r], fa = pv(f, a), fb = pv(f, b), m = (fb - fa) / (b - a);
      return item(prompt, `f(x)=${poly(f)}\\ \\ (${iv(a, b)}),\\ \\frac{f(${b})-f(${a})}{${b}-${par(a)}}=f'(c)\\ \\Rightarrow\\ c=\\square`, c, [
        { tex:`\\frac{${fb}-${par(fa)}}{${b - a}}=${m}` },
        { tex:`f'(c)=${poly([2 * p, q], 'c')}=${m}` },
        { tex:'c=\\square', blank:c }]);
    }
  }

  if (mode === 'more') {
    const prompt = L3('N 은 평균값 정리를 만족시키는 c(a<c<b)의 개수, S 는 그런 c 의 합입니다. k 는 f(a)=f(b) 가 되어 롤의 정리가 성립하도록 하는 값, t 는 평균값 정리를 만족시키는 c 가 주어진 값이 되도록 하는 구간의 끝입니다.',
      'N is the number of values c (a<c<b) satisfying the mean value theorem, and S their sum. k is the value that makes f(a)=f(b) so that Rolle’s theorem applies, and t is the interval end that makes the mean-value c equal the given value.',
      'N是满足中值定理的c(a<c<b)的个数，S是这些c之和。k是使f(a)=f(b)从而罗尔定理成立的值，t是使满足中值定理的c等于给定值的区间端点。');
    for (let g = 0; g < 400; g++) {
      const kind = pick(rng, ['count', 'count', 'sum', 'sum', 'rolleK', 'rolleK', 'end']);
      if (kind === 'count' || kind === 'sum') {
        const t = pick(rng, [0, 1]) ? pick(rng, two) : pick(rng, one);
        const p = pickP(rng, t.c1, t.c2), m = pick(rng, [0, nz(rng, 1, 6)]), s = R(rng, -9, 9);
        const f = cubicCP(p, t.c1, t.c2, m, s), fa = pv(f, t.a), fb = pv(f, t.b);
        if (Math.max(...f.map(Math.abs)) > 60) continue;
        const ans = kind === 'count' ? t.ins.length : t.ins.reduce((x, y) => x + y, 0);
        if (kind === 'sum' && ans === 0) continue;
        const sym = kind === 'count' ? 'N' : 'S';
        return item(prompt, `f(x)=${poly(f)}\\ \\ (${iv(t.a, t.b)})\\ \\Rightarrow\\ ${sym}=\\square`, ans, [
          { tex:`\\frac{f(${t.b})-f(${t.a})}{${t.b}-${par(t.a)}}=\\frac{${fb}-${par(fa)}}{${t.b - t.a}}=${m}` },
          { tex:`f'(c)${m ? `-${par(m)}` : ''}=${facTex(3 * p, [t.c1, t.c2], 'c')}=0,\\ ${t.a}<c<${t.b}` },
          { tex:`c=${t.ins.join(',\\ ')}` },
          { tex:`${sym}=\\square`, blank:ans }]);
      }
      if (kind === 'rolleK') {
        const a = R(rng, -5, 4), b = a + R(rng, 1, 5), s = R(rng, -9, 9);
        if (pick(rng, [0, 1])) {
          const p = nz(rng, 1, 2), k = -p * (a * a + a * b + b * b);
          return item(prompt, `f(x)=${lead(p, 'x^3')}+kx${more(s, '')}\\ \\ (${iv(a, b)}),\\ f(${a})=f(${b})\\ \\Rightarrow\\ k=\\square`, k, [
            { tex:`${terms([[p * a ** 3, ''], [a, 'k']])}=${terms([[p * b ** 3, ''], [b, 'k']])}` },
            { tex:`${b - a}k=${p * a ** 3 - p * b ** 3}` },
            { tex:'k=\\square', blank:k }]);
        }
        const p = nz(rng, 1, 3), k = -p * (a + b);
        if (k === 0) continue;
        return item(prompt, `f(x)=${lead(p, 'x^2')}+kx${more(s, '')}\\ \\ (${iv(a, b)}),\\ f(${a})=f(${b})\\ \\Rightarrow\\ k=\\square`, k, [
          { tex:`${terms([[p * a * a, ''], [a, 'k']])}=${terms([[p * b * b, ''], [b, 'k']])}` },
          { tex:`${b - a}k=${p * a * a - p * b * b}` },
          { tex:'k=\\square', blank:k }]);
      }
      /* end — 이차함수의 평균값 c 는 구간의 가운데 */
      const p = nz(rng, 1, 3), q = R(rng, -8, 8), r = R(rng, -9, 9), a = R(rng, -5, 4), c = a + R(rng, 1, 4), t = 2 * c - a;
      return item(prompt, `f(x)=${poly([p, q, r])}\\ \\ (${a}\\le x\\le t),\\ c=${c}\\ \\Rightarrow\\ t=\\square`, t, [
        { tex:`\\frac{f(t)-f(${a})}{t-${par(a)}}=${p === 1 ? '' : p === -1 ? '-' : p}(t${more(a, '')})${more(q, '')}` },
        { tex:`f'(${c})=${2 * p * c + q}` },
        { tex:'t=\\square', blank:t }]);
    }
  }

  /* rolle(기본) */
  const prompt = L3('롤의 정리: f(x) 가 닫힌구간 [a, b] 에서 연속이고 열린구간 (a, b) 에서 미분가능하며 f(a)=f(b) 이면 f′(c)=0 인 c 가 열린구간 (a, b) 에 있습니다. 그 c 의 값을 구합니다.',
    'Rolle’s theorem: if f(x) is continuous on [a, b], differentiable on (a, b) and f(a)=f(b), there is c in (a, b) with f′(c)=0. Find that c.',
    '罗尔定理：若f(x)在闭区间[a, b]上连续、在开区间(a, b)内可导且f(a)=f(b)，则开区间(a, b)内存在c使f′(c)=0。求这个c的值。');
  for (let g = 0; g < 400; g++) {
    if (pick(rng, [0, 1, 1])) {
      const t = pick(rng, one), p = pickP(rng, t.c1, t.c2), s = R(rng, -9, 9);
      const f = cubicCP(p, t.c1, t.c2, 0, s), c = t.ins[0];
      if (Math.max(...f.map(Math.abs)) > 60) continue;
      return item(prompt, `f(x)=${poly(f)}\\ \\ (${iv(t.a, t.b)}),\\ f'(c)=0\\ \\Rightarrow\\ c=\\square`, c, [
        { tex:`f(${t.a})=f(${t.b})=${pv(f, t.a)}` },
        { tex:`f'(x)=${facTex(3 * p, [t.c1, t.c2])}` },
        { tex:`${t.a}<c<${t.b},\\ c=\\square`, blank:c }]);
    }
    const p = nz(rng, 1, 3), r = R(rng, -9, 9), a = R(rng, -6, 5), b = a + 2 * R(rng, 1, 4), c = (a + b) / 2, q = -p * (a + b);
    const f = [p, q, r];
    return item(prompt, `f(x)=${poly(f)}\\ \\ (${iv(a, b)}),\\ f'(c)=0\\ \\Rightarrow\\ c=\\square`, c, [
      { tex:`f(${a})=f(${b})=${pv(f, a)}` },
      { tex:`f'(x)=${poly([2 * p, q])}` },
      { tex:'c=\\square', blank:c }]);
  }
};

/* ── MD156 — 함수의 증가·감소 ── */
NM_TGEN['md156_monotone'] = function (params, rng) {
  const mode = params.mode || 'interval';

  if (mode === 'always') {
    const prompt = L3('최고차항의 계수가 양수이면 실수 전체에서 증가, 음수이면 실수 전체에서 감소하도록 하는 a 를 찾습니다. 모든 x 에서 f′(x)≥0(또는 ≤0) 이어야 하므로 f′(x)=0 의 판별식이 D≤0 입니다. N 은 그런 정수 a 의 개수, m 은 가장 작은 정수, M 은 가장 큰 정수입니다.',
      'Find a so that f is increasing on all reals when the leading coefficient is positive, or decreasing on all reals when it is negative. Since f′(x)≥0 (or ≤0) for every x, the discriminant of f′(x)=0 satisfies D≤0. N is the number of such integers a, m the least and M the greatest.',
      '求a，使首项系数为正时f在实数范围内递增，为负时在实数范围内递减。因为对所有x都有f′(x)≥0(或≤0)，所以f′(x)=0的判别式D≤0。N是这样的整数a的个数，m是最小的整数，M是最大的整数。');
    for (let g = 0; g < 400; g++) {
      const kind = pick(rng, ['quadA', 'linA', 'param', 'param']), w = R(rng, -9, 9);
      if (kind === 'quadA') {
        const p = pick(rng, [1, 1, -1, 2, -2]), b = p * R(rng, 1, 16), X = 3 * p * b, K = Math.floor(Math.sqrt(X));
        const ask = pick(rng, ['N', 'N', 'M', 'm']), ans = ask === 'N' ? 2 * K + 1 : ask === 'M' ? K : -K;
        return item(prompt, `f(x)=${polyA([p, 0, b, w], 2)}\\ \\Rightarrow\\ ${ask}=\\square`, ans, [
          { tex:`f'(x)=${polyA([3 * p, 0, b], 1, '2a')}` },
          { tex:`\\frac{D}{4}=a^2-${X}\\le0,\\ ${-K}\\le a\\le${K}` },
          { tex:`${ask}=\\square`, blank:ans }]);
      }
      if (kind === 'linA') {
        const p = pick(rng, [1, 1, -1, 2, -2]), h = nz(rng, 1, 4), q = -3 * p * h, bnd = 3 * p * h * h;
        const ask = p > 0 ? 'm' : 'M';
        return item(prompt, `f(x)=${polyA([p, q, 0, w], 1)}\\ \\Rightarrow\\ ${ask}=\\square`, bnd, [
          { tex:`f'(x)=${polyA([3 * p, 2 * q, 0], 0)}` },
          { tex:`\\frac{D}{4}=${q * q}${more(-3 * p, 'a')}\\le0,\\ a${p > 0 ? '\\ge' : '\\le'}${bnd}` },
          { tex:`${ask}=\\square`, blank:bnd }]);
      }
      const r1 = R(rng, -5, 4), r2 = r1 + R(rng, 1, 7);
      if (r2 > 6) continue;
      const u = r1 + r2, v = -r1 * r2, p = pick(rng, [1, -1]);
      const lin = u === 0 ? more(3 * p * v, 'x') : v === 0 ? more(3 * p * u, 'ax') : `${p > 0 ? '+' : '-'}3(${poly([u, v], 'a')})x`;
      const tex = `f(x)=${lead(p, 'x^3')}${p > 0 ? '+' : '-'}3ax^2${lin}${more(w, '')}`;
      const ask = pick(rng, ['N', 'N', 'm', 'M']), ans = ask === 'N' ? r2 - r1 + 1 : ask === 'm' ? r1 : r2;
      return item(prompt, `${tex}\\ \\Rightarrow\\ ${ask}=\\square`, ans, [
        { tex:`\\frac{D}{4}=9a^2-9(${poly([u, v], 'a')})\\le0` },
        { tex:`a^2${more(-u, 'a')}${more(-v, '')}\\le0,\\ ${r1}\\le a\\le${r2}` },
        { tex:`${ask}=\\square`, blank:ans }]);
    }
  }

  if (mode === 'local') {
    const prompt = L3('↗ 는 괄호 안의 범위에서 증가, ↘ 는 감소한다는 뜻입니다. 그 범위의 모든 x 에서 f′(x)≥0(↗) 또는 f′(x)≤0(↘) 이어야 하므로 f′(x) 의 그 범위에서의 최솟값 또는 최댓값으로 조건을 세웁니다. M 은 그런 정수 a 의 최댓값, m 은 최솟값입니다.',
      '↗ means increasing on the range in brackets and ↘ decreasing. Every x there needs f′(x)≥0 (↗) or f′(x)≤0 (↘), so set up the condition with the least or greatest value of f′(x) on that range. M is the greatest such integer a and m the least.',
      '↗表示在括号内的范围内递增，↘表示递减。该范围内所有x都要满足f′(x)≥0(↗)或f′(x)≤0(↘)，所以用f′(x)在该范围内的最小值或最大值列出条件。M是这样的整数a的最大值，m是最小值。');
    for (let g = 0; g < 400; g++) {
      const p = pick(rng, [1, -1]), h = R(rng, -3, 3), q = -3 * p * h, w = R(rng, -9, 9);
      const G = [3 * p, 2 * q, 0];                   /* f′(x)=G(x)+a */
      const half = pick(rng, [0, 0, 1]);
      let xs, rng2, inc;
      if (half) {
        inc = p > 0;                                  /* 반직선에서는 위로 볼록한 f′ 만 ↘, 아래로 볼록한 f′ 만 ↗ 가 가능하다 */
        const s = R(rng, -3, 3), right = pick(rng, [0, 1]);
        xs = [s]; if (right ? h > s : h < s) xs.push(h);
        rng2 = right ? `x\\ge${s}` : `x\\le${s}`;
      } else {
        inc = pick(rng, [0, 1]) === 1;
        const lo = R(rng, -4, 3), hi = lo + R(rng, 1, 4);
        xs = [lo, hi]; if (lo < h && h < hi) xs.push(h);
        rng2 = iv(lo, hi);
      }
      const vals = xs.map(x => pv(G, x));
      /* ↗: G(x)+a≥0 ⇒ a≥−min G  ·  ↘: G(x)+a≤0 ⇒ a≤−max G */
      const crit = inc ? Math.min(...vals) : Math.max(...vals), xe = xs[vals.indexOf(crit)], ans = -crit || 0;
      const ask = inc ? 'm' : 'M';
      if (Math.abs(ans) > 60) continue;
      return item(prompt, `f(x)=${polyA([p, q, 0, w], 1)}\\ \\ ${inc ? '\\nearrow' : '\\searrow'}\\ (${rng2})\\ \\Rightarrow\\ ${ask}=\\square`, ans, [
        { tex:`f'(x)=${polyA(G, 0)}` },
        { tex:`f'(${xe})=${terms([[crit, ''], [1, 'a']])}${inc ? '\\ge' : '\\le'}0` },
        { tex:`${ask}=\\square`, blank:ans }]);
    }
  }

  /* interval(기본) */
  const prompt = L3('f′(x)=0 의 두 근 α<β 로 실수를 나누고 f′(x) 의 부호를 봅니다. ↗ 는 증가하는 구간, ↘ 는 감소하는 구간입니다. 괄호 안에 적힌 구간의 α, β 로 식의 값을 구합니다.',
    'Split the real line at the two roots α<β of f′(x)=0 and look at the sign of f′(x). ↗ marks where f is increasing and ↘ where it is decreasing. Use the α and β of the interval in brackets.',
    '用f′(x)=0的两根α<β把实数分开，看f′(x)的符号。↗表示递增区间，↘表示递减区间。用括号中区间的α、β求式子的值。');
  for (let g = 0; g < 400; g++) {
    const c1 = R(rng, -5, 4), c2 = c1 + R(rng, 1, 6);
    if (c2 > 6) continue;
    const p = pickP(rng, c1, c2), s = R(rng, -9, 9), f = cubicCP(p, c1, c2, 0, s);
    if (Math.max(...f.map(Math.abs)) > 60) continue;
    const mid = pick(rng, [0, 1]);
    /* p>0: 가운데 ↘, 바깥 ↗ · p<0: 가운데 ↗, 바깥 ↘ */
    const arrow = (mid ? p < 0 : p > 0) ? '\\nearrow' : '\\searrow';
    const where = mid ? '\\alpha\\le x\\le\\beta' : 'x\\le\\alpha,\\ x\\ge\\beta';
    const asks = [['\\alpha', c1], ['\\beta', c2], ['\\alpha+\\beta', c1 + c2], ['\\beta-\\alpha', c2 - c1]];
    const [aT, ans] = pick(rng, asks);
    return item(prompt, `f(x)=${poly(f)}\\ \\ ${arrow}\\ (${where})\\ \\Rightarrow\\ ${aT}=\\square`, ans, [
      { tex:`f'(x)=${facTex(3 * p, [c1, c2])}` },
      { tex:`\\alpha=${c1},\\ \\beta=${c2}` },
      { tex:`${aT}=\\square`, blank:ans }]);
  }
};

/* ── MD157 — 닫힌 구간에서의 최대·최소 ── */
function candList(a, b, cs){ return [a].concat(cs.filter(c => a < c && c < b), [b]); }
function valLine(f, xs){ return xs.map(x => `f(${x})=${pv(f, x)}`).join(',\\ '); }
function pickCubic(rng){
  for (let g = 0; g < 100; g++) {
    const c1 = R(rng, -4, 3), c2 = c1 + R(rng, 1, 5);
    if (c2 > 4) continue;
    return { cs:[c1, c2], p: pickP(rng, c1, c2) };
  }
  return { cs:[0, 2], p:1 };
}
function pickQuartic(rng){
  for (let g = 0; g < 200; g++) {
    const c1 = R(rng, -3, 1), c2 = c1 + R(rng, 1, 3), c3 = c2 + R(rng, 1, 3);
    if (c3 > 3 || (c1 + c2 + c3) % 3) continue;
    return { cs:[c1, c2, c3], p: pick(rng, [1, 1, -1]) };
  }
  return { cs:[-1, 0, 1], p:1 };
}
NM_TGEN['md157_closedMax'] = function (params, rng) {
  const mode = params.mode || 'cubic';

  if (mode === 'quartic') {
    const prompt = L3('M 은 주어진 닫힌구간에서의 최댓값, m 은 최솟값입니다. 구간 안의 극값(f′(x)=0 인 점)과 양 끝의 함숫값을 모두 비교합니다. 사차함수는 극값이 셋까지 있습니다.',
      'M is the greatest value on the given closed interval and m the least. Compare every extreme value inside (points with f′(x)=0) with the values at both ends. A quartic can have up to three extreme values.',
      'M是在给定闭区间上的最大值，m是最小值。比较区间内所有极值(f′(x)=0的点)与两端的函数值。四次函数最多有三个极值。');
    for (let g = 0; g < 400; g++) {
      const quart = pick(rng, [1, 1, 1, 0]);
      const C = quart ? pickQuartic(rng) : pickCubic(rng), s = R(rng, -9, 9);
      const f = quart ? quarticCP(C.p, ...C.cs, s) : cubicCP(C.p, C.cs[0], C.cs[1], 0, s);
      const a = R(rng, -4, 2), b = a + R(rng, 2, 5);
      if (b > 4) continue;
      const inside = C.cs.filter(c => a < c && c < b);
      if (inside.length < (quart ? 2 : 1)) continue;
      const xs = candList(a, b, C.cs), E = ext(f, xs);
      if (Math.max(...E.vs.map(Math.abs)) > 500 || E.M === E.m) continue;
      const [sym, ans] = pick(rng, [['M+m', E.M + E.m], ['M+m', E.M + E.m], ['M-m', E.M - E.m], ['M', E.M], ['m', E.m]]);
      return item(prompt, `f(x)=${poly(f)}\\ \\ (${iv(a, b)})\\ \\Rightarrow\\ ${sym}=\\square`, ans, [
        { tex:`f'(x)=${facTex((quart ? 4 : 3) * C.p, C.cs)}` },
        { tex: valLine(f, xs) },
        { tex:`M=${E.M},\\ m=${E.m}` },
        { tex:`${sym}=\\square`, blank:ans }]);
    }
  }

  if (mode === 'coef') {
    const prompt = L3('M 은 주어진 닫힌구간에서의 최댓값, m 은 최솟값입니다. 미정계수가 있어도 최대·최소가 되는 x 는 그대로이므로, 먼저 어느 x 에서 최대·최소인지 정한 뒤 주어진 값으로 방정식을 세웁니다. a 는 양수입니다.',
      'M is the greatest value on the given closed interval and m the least. The unknown does not move the x where the maximum or minimum occurs, so first decide those x, then set up equations from the given values. a is positive.',
      'M是在给定闭区间上的最大值，m是最小值。待定系数不改变取得最值的x，所以先确定在哪个x取最大、最小值，再用给定的值列方程。a为正数。');
    for (let g = 0; g < 400; g++) {
      const quart = pick(rng, [0, 0, 1]);
      const C = quart ? pickQuartic(rng) : pickCubic(rng);
      if (C.p !== 1 || (!quart && (C.cs[0] + C.cs[1]) % 2)) continue;
      const core = quart ? quarticCP(1, ...C.cs, 0) : cubicCP(1, C.cs[0], C.cs[1], 0, 0);
      const a = R(rng, -4, 2), b = a + R(rng, 2, 5);
      if (b > 4 || !C.cs.some(c => a < c && c < b)) continue;
      const xs = candList(a, b, C.cs), E = ext(core, xs);
      if (Math.max(...E.vs.map(Math.abs)) > 300 || E.M === E.m) continue;
      const coreT = poly(core);
      if (pick(rng, [0, 1, 1])) {
        const k = R(rng, -12, 12), M = E.M + k, m = E.m + k;
        const kind = pick(rng, ['Mm', 'mM', 'Mk', 'mk']);
        const given = kind[0] === 'M' ? `M=${M}` : `m=${m}`;
        const [sym, ans] = kind === 'Mm' ? ['m', m] : kind === 'mM' ? ['M', M] : ['k', k];
        return item(prompt, `f(x)=${coreT}+k\\ \\ (${iv(a, b)}),\\ ${given}\\ \\Rightarrow\\ ${sym}=\\square`, ans, [
          { tex: xs.map(x => `f(${x})=${terms([[pv(core, x), ''], [1, 'k']])}`).join(',\\ ') },
          { tex:`k=${k}` },
          { tex:`${sym}=\\square`, blank:ans }]);
      }
      const A = R(rng, 1, 3), B = R(rng, -10, 10), M = A * E.M + B, m = A * E.m + B;
      const [sym, ans] = pick(rng, [['a+b', A + B], ['a+b', A + B], ['b', B], ['ab', A * B]]);
      if (sym === 'ab' && B === 0) continue;
      return item(prompt, `f(x)=a(${coreT})+b\\ \\ (${iv(a, b)}),\\ M=${M},\\ m=${m}\\ \\Rightarrow\\ ${sym}=\\square`, ans, [
        { tex:`M=${terms([[E.M, 'a'], [1, 'b']])},\\ m=${terms([[E.m, 'a'], [1, 'b']])}` },
        { tex:`a=${A},\\ b=${B}` },
        { tex:`${sym}=\\square`, blank:ans }]);
    }
  }

  /* cubic(기본) */
  const prompt = L3('M 은 주어진 닫힌구간에서의 최댓값, m 은 최솟값입니다. f′(x)=0 인 x 중 구간 안에 있는 것의 함숫값과 양 끝 값을 비교합니다. 극댓값이 꼭 최댓값인 것은 아닙니다.',
    'M is the greatest value on the given closed interval and m the least. Compare the values at points inside the interval with f′(x)=0 against the values at both ends. A local maximum is not always the greatest value.',
    'M是在给定闭区间上的最大值，m是最小值。比较区间内使f′(x)=0的点的函数值与两端的值。极大值不一定是最大值。');
  for (let g = 0; g < 400; g++) {
    const C = pickCubic(rng), s = R(rng, -9, 9), f = cubicCP(C.p, C.cs[0], C.cs[1], 0, s);
    const a = R(rng, -5, 3), b = a + R(rng, 2, 6);
    if (b > 5 || !C.cs.some(c => a < c && c < b)) continue;
    const xs = candList(a, b, C.cs), E = ext(f, xs);
    if (Math.max(...E.vs.map(Math.abs)) > 400) continue;
    const [sym, ans] = pick(rng, [['M', E.M], ['m', E.m]]);
    return item(prompt, `f(x)=${poly(f)}\\ \\ (${iv(a, b)})\\ \\Rightarrow\\ ${sym}=\\square`, ans, [
      { tex:`f'(x)=${facTex(3 * C.p, C.cs)}` },
      { tex: valLine(f, xs) },
      { tex:`${sym}=\\square`, blank:ans }]);
  }
};

/* ── MD158 — 방정식·부등식에의 활용 ── */
NM_TGEN['md158_rootsIneq'] = function (params, rng) {
  const mode = params.mode || 'count';

  if (mode === 'k') {
    const prompt = L3('f(x)=k 의 실근은 y=f(x) 의 그래프와 직선 y=k 의 교점입니다. 극댓값과 극솟값 사이에 k 가 있으면 세 점, 극값과 같으면 두 점에서 만납니다. N 은 서로 다른 세 실근을 갖는 정수 k 의 개수, S 는 서로 다른 두 실근을 갖는 모든 k 의 합, k₀ 은 실근이 오직 하나인 자연수 k 의 최솟값입니다.',
      'The real roots of f(x)=k are where the graph of y=f(x) meets the line y=k. For k strictly between the local maximum and minimum there are three meeting points, and two when k equals an extreme value. N is the number of integers k giving three distinct real roots, S the sum of all k giving two, and k₀ the least natural number k giving exactly one real root.',
      'f(x)=k的实根是y=f(x)的图像与直线y=k的交点。k在极大值与极小值之间时有三个交点，等于极值时有两个。N是使方程有三个不同实根的整数k的个数，S是使方程有两个不同实根的所有k之和，k₀是使方程只有一个实根的自然数k的最小值。');
    for (let g = 0; g < 400; g++) {
      const C = pickCubic(rng), s = R(rng, -9, 9), f = cubicCP(C.p, C.cs[0], C.cs[1], 0, s);
      const v1 = pv(f, C.cs[0]), v2 = pv(f, C.cs[1]), lo = Math.min(v1, v2), hi = Math.max(v1, v2);
      if (Math.max(Math.abs(lo), Math.abs(hi)) > 120 || Math.max(...f.map(Math.abs)) > 60) continue;
      const kind = pick(rng, ['N', 'N', 'S', 'k0']);
      let sym, ans;
      if (kind === 'N') { if (hi - lo < 2 || hi - lo > 60) continue; sym = 'N'; ans = hi - lo - 1; }
      else if (kind === 'S') { sym = 'S'; ans = lo + hi; if (ans === 0) continue; }
      else { if (!(lo <= 1 && hi >= 1)) continue; sym = 'k_0'; ans = hi + 1; }
      const eq = pick(rng, [0, 1]) ? `${poly(f)}=k` : `${poly(f)}-k=0`;
      return item(prompt, `${eq}\\ \\Rightarrow\\ ${sym}=\\square`, ans, [
        { tex:`f(x)=${poly(f)},\\ f'(x)=${facTex(3 * C.p, C.cs)}` },
        { tex:`f(${C.cs[0]})=${v1},\\ f(${C.cs[1]})=${v2}` },
        { tex:`${sym}=\\square`, blank:ans }]);
    }
  }

  if (mode === 'ineq') {
    const prompt = L3('부등식이 괄호 안의 모든 x 에서(괄호가 없으면 모든 실수 x 에서) 성립하도록 하는 정수 k 를 찾습니다. 좌변과 우변을 f(x) 와 k 로 나누어 그 범위에서 f(x) 의 최솟값이나 최댓값과 k 를 비교합니다. m 은 그런 정수 k 의 최솟값, M 은 최댓값입니다.',
      'Find the integers k for which the inequality holds for every x in brackets (every real x if there are none). Separate f(x) from k and compare k with the least or greatest value of f(x) on that range. m is the least such integer k and M the greatest.',
      '求使不等式对括号内所有x(没有括号时对所有实数x)都成立的整数k。把式子分成f(x)与k，比较k与f(x)在该范围内的最小值或最大值。m是这样的整数k的最小值，M是最大值。');
    for (let g = 0; g < 400; g++) {
      const kind = pick(rng, ['quart', 'half', 'half', 'closed']);
      let f, fT, xs, dom, dT;
      if (kind === 'quart') {
        const C = pickQuartic(rng);
        if (C.p !== 1) continue;
        f = quarticCP(1, ...C.cs, 0); dT = facTex(4, C.cs); xs = C.cs; dom = '';
      } else {
        const C = pickCubic(rng);
        if (C.p < 0) continue;
        f = cubicCP(C.p, C.cs[0], C.cs[1], 0, 0); dT = facTex(3 * C.p, C.cs);
        if (kind === 'half') {
          const d = pick(rng, [0, 0, 1, -1, 2]);
          if (!(C.cs[1] > d)) continue;
          xs = [d].concat(C.cs.filter(c => c > d)); dom = `x\\ge${d}`;
        } else {
          const a = R(rng, -4, 2), b = a + R(rng, 2, 5);
          if (b > 4 || !C.cs.some(c => a < c && c < b)) continue;
          xs = candList(a, b, C.cs); dom = iv(a, b);
        }
      }
      const strict = pick(rng, [0, 0, 1]);
      /* 형태: f+k≥0 → k≥−min · f≥k → k≤min · f≤k (닫힌구간만) → k≥max. k 가 우변이면 상수항도 둔다. */
      const form = kind === 'closed' ? pick(rng, ['plus', 'ge', 'le']) : pick(rng, ['plus', 'ge']);
      if (form !== 'plus') f = f.slice(0, -1).concat([R(rng, -9, 9)]);
      fT = poly(f);
      const E = ext(f, xs);
      if (Math.max(...E.vs.map(Math.abs)) > 300) continue;
      let tex, sym, ans, step;
      if (form === 'plus') { tex = `${fT}+k${strict ? '>' : '\\ge'}0`; sym = 'm'; ans = -E.m + strict; step = `k${strict ? '>' : '\\ge'}${-E.m}`; }
      else if (form === 'ge') { tex = `${fT}${strict ? '>' : '\\ge '}k`; sym = 'M'; ans = E.m - strict; step = `k${strict ? '<' : '\\le'}${E.m}`; }
      else { tex = `${fT}${strict ? '<' : '\\le '}k`; sym = 'm'; ans = E.M + strict; step = `k${strict ? '>' : '\\ge'}${E.M}`; }
      return item(prompt, `${tex}${dom ? `\\ \\ (${dom})` : ''}\\ \\Rightarrow\\ ${sym}=\\square`, ans, [
        { tex:`f(x)=${fT},\\ f'(x)=${dT}` },
        { tex:`${form === 'le' ? '\\max' : '\\min'} f(x)=${form === 'le' ? E.M : E.m},\\ ${step}` },
        { tex:`${sym}=\\square`, blank:ans }]);
    }
  }

  /* count(기본) */
  const prompt = L3('f(x)=0 의 서로 다른 실근의 개수 N 은 y=f(x) 의 그래프가 x축과 만나는 점의 개수입니다. 극댓값과 극솟값의 부호를 봅니다: 곱이 음수이면 3, 0 이면 2, 양수이면 1 입니다. 양변에 식이 있으면 한쪽으로 모아 f(x)=0 꼴로 만듭니다.',
    'The number N of distinct real roots of f(x)=0 is the number of points where the graph of y=f(x) meets the x-axis. Look at the signs of the local maximum and minimum: a negative product gives 3, zero gives 2 and a positive product gives 1. If both sides have terms, collect them into the form f(x)=0.',
    'f(x)=0的不同实根的个数N等于y=f(x)的图像与x轴交点的个数。看极大值与极小值的符号：乘积为负时为3，为0时为2，为正时为1。若两边都有项，先移到一边化成f(x)=0。');
  for (let g = 0; g < 400; g++) {
    const C = pickCubic(rng), h = cubicCP(C.p, C.cs[0], C.cs[1], 0, 0);
    const h1 = pv(h, C.cs[0]), h2 = pv(h, C.cs[1]), lo = Math.min(h1, h2), hi = Math.max(h1, h2);
    const N = pick(rng, [1, 2, 3]);
    let t;                                           /* f=h−t, t 는 y=h 와 만나는 수평선의 높이 */
    if (N === 3) { if (hi - lo < 2) continue; t = R(rng, lo + 1, hi - 1); }
    else if (N === 2) t = pick(rng, [lo, hi]);
    else t = pick(rng, [lo - R(rng, 1, 8), hi + R(rng, 1, 8)]);
    const f = h.slice(0, 3).concat([-t]);
    if (Math.max(...f.map(Math.abs)) > 80) continue;
    const v1 = pv(f, C.cs[0]), v2 = pv(f, C.cs[1]);
    let eq = `${poly(f)}=0`;
    /* 일차항·상수항을 우변으로 옮긴 꼴도 낸다 */
    if (pick(rng, [0, 1]) && (f[2] || f[3])) eq = `${poly([f[0], f[1], 0, 0])}=${poly([-f[2], -f[3]])}`;
    return item(prompt, `${eq}\\ \\Rightarrow\\ N=\\square`, N, [
      { tex:`f(x)=${poly(f)},\\ f'(x)=${facTex(3 * C.p, C.cs)}` },
      { tex:`f(${C.cs[0]})=${v1},\\ f(${C.cs[1]})=${v2}` },
      { tex:'N=\\square', blank:N }]);
  }
};

/* ── MD159 — 정적분의 성질·정적분으로 정의된 함수 ── */
function F3(rng){ return [nz(rng, 1, 2), R(rng, -4, 4), R(rng, -6, 6), 0]; }   /* 원시함수 αx³+βx²+γx */
function I(F, a, b){ return pv(F, b) - pv(F, a); }
function intT(a, b, body, v){ v = v || 'x'; return `\\int_{${a}}^{${b}}${body}\\,d${v}`; }
NM_TGEN['md159_defInt'] = function (params, rng) {
  const mode = params.mode || 'prop';

  if (mode === 'deriv') {
    const prompt = L3('아래끝이 상수이고 위끝이 x 이면 d/dx∫ₐˣ f(t)dt=f(x) 입니다. 위끝과 아래끝이 바뀌면 부호가 바뀝니다. 극한 꼴은 F(x)=∫f(t)dt 의 미분계수로 봅니다. x₀ 은 F(x) 가 극대가 되는 x 입니다.',
      'With a constant lower limit and upper limit x, d/dx∫ₐˣ f(t)dt=f(x). Swapping the limits changes the sign. Read a limit form as a derivative of F(x)=∫f(t)dt. x₀ is the x where F(x) has a local maximum.',
      '下限为常数、上限为x时，d/dx∫ₐˣ f(t)dt=f(x)。交换上下限则变号。极限形式看作F(x)=∫f(t)dt的导数。x₀是F(x)取得极大值的x。');
    for (let g = 0; g < 400; g++) {
      const kind = pick(rng, ['dd', 'dd', 'rev', 'lim', 'limx', 'ext']);
      if (kind === 'ext') {
        const al = R(rng, -4, 3), be = al + R(rng, 1, 5), q = pick(rng, [1, -1, 2, -2, 3]), lo = R(rng, -2, 2);
        const P = [q, -q * (al + be), q * al * be], x0 = q > 0 ? al : be;
        return item(prompt, `F(x)=${intT(lo, 'x', `(${poly(P, 't')})`, 't')}\\ \\Rightarrow\\ x_0=\\square`, x0, [
          { tex:`F'(x)=${facTex(q, [al, be])}` },
          { tex:`x=${x0}:\\ F'(x)\\ +\\to-` },
          { tex:'x_0=\\square', blank:x0 }]);
      }
      const deg = pick(rng, [2, 2, 3]), P = [nz(rng, 1, 3)];
      for (let i = 0; i < deg; i++) P.push(R(rng, -6, 6));
      if (P.filter(c => c).length < 2) continue;
      const c = R(rng, -3, 3), val = pv(P, c), a = R(rng, -3, 4), PT = `(${poly(P, 't')})`;
      if (Math.abs(val) > 200) continue;
      if (kind === 'rev') {
        if (a === 1) continue;
        return item(prompt, `F(x)=${intT('x', a, PT, 't')}\\ \\Rightarrow\\ F'(${c})=\\square`, -val, [
          { tex:`F(x)=-${intT(a, 'x', PT, 't')}` },
          { tex:`F'(x)=-${PT.replace(/t/g, 'x')}` },
          { tex:`F'(${c})=\\square`, blank:-val }]);
      }
      if (kind === 'lim') {
        const up = c === 0 ? 'h' : `${c}+h`;
        return item(prompt, `\\lim_{h\\to0}\\frac{1}{h}${intT(c, up, PT, 't')}=\\square`, val, [
          { tex:`F(x)=${intT(c, 'x', PT, 't')},\\ F(${c})=0` },
          { tex:`\\lim_{h\\to0}\\frac{F(${up})-F(${c})}{h}=F'(${c})` },
          { tex:`F'(${c})=\\square`, blank:val }]);
      }
      if (kind === 'limx') {
        return item(prompt, `\\lim_{x\\to${c}}\\frac{1}{${poly([1, -c])}}${intT(c, 'x', PT, 't')}=\\square`, val, [
          { tex:`F(x)=${intT(c, 'x', PT, 't')},\\ F(${c})=0` },
          { tex:`\\lim_{x\\to${c}}\\frac{F(x)-F(${c})}{${poly([1, -c])}}=F'(${c})` },
          { tex:`F'(${c})=\\square`, blank:val }]);
      }
      if (pick(rng, [0, 1])) {
        return item(prompt, `F(x)=${intT(a, 'x', PT, 't')}\\ \\Rightarrow\\ F'(${c})=\\square`, val, [
          { tex:`F'(x)=${poly(P)}` },
          { tex:`F'(${c})=\\square`, blank:val }]);
      }
      return item(prompt, `\\frac{d}{dx}${intT(a, 'x', PT, 't')}=g(x)\\ \\Rightarrow\\ g(${c})=\\square`, val, [
        { tex:`g(x)=${poly(P)}` },
        { tex:`g(${c})=\\square`, blank:val }]);
    }
  }

  if (mode === 'fn') {
    const prompt = L3('∫ₐˣ f(t)dt=g(x) 이면 ① x=a 를 넣어 g(a)=0 ② 양변을 미분해 f(x)=g′(x) 입니다. f(x) 안에 ∫f(t)dt(상수)가 들어 있으면 그 정적분을 k 로 놓고 k 에 대한 방정식을 풉니다.',
      'If ∫ₐˣ f(t)dt=g(x), then ① substituting x=a gives g(a)=0 and ② differentiating both sides gives f(x)=g′(x). If f(x) contains ∫f(t)dt (a constant), call that integral k and solve an equation in k.',
      '若∫ₐˣ f(t)dt=g(x)，则①代入x=a得g(a)=0，②两边求导得f(x)=g′(x)。若f(x)中含有∫f(t)dt(常数)，就把这个定积分设为k，解关于k的方程。');
    for (let g = 0; g < 400; g++) {
      const kind = pick(rng, ['coefA', 'coefA', 'fval', 'fval', 'selfK']);
      if (kind === 'selfK') {
        const F = F3(rng), P = dv(F), al = R(rng, -2, 2), len = pick(rng, [2, 2, 3]), be = al + len, IP = I(F, al, be);
        if (be === 1 || IP % (len - 1)) continue;
        const k = -IP / (len - 1);
        if (k === 0 || Math.abs(k) > 150) continue;
        const askF = pick(rng, [0, 1]), c = R(rng, -2, 3), ans = askF ? pv(P, c) + k : k;
        return item(prompt, `f(x)=${poly(P)}+${intT(al, be, 'f(t)', 't')}\\ \\Rightarrow\\ ${askF ? `f(${c})` : intT(al, be, 'f(t)', 't')}=\\square`, ans, [
          { tex:`k=${intT(al, be, 'f(t)', 't')},\\ f(x)=${poly(P)}+k` },
          { tex:`k=${IP}+${len}k,\\ k=${k}` },
          { tex:`${askF ? `f(${c})` : 'k'}=\\square`, blank:ans }]);
      }
      const j = pick(rng, [0, 1, 2, 2]), s = R(rng, -3, 3);
      if (j > 0 && s === 0) continue;
      const cs = [nz(rng, 1, 3), R(rng, -5, 5), R(rng, -6, 6), 0], a0 = j === 0 ? null : nz(rng, 1, 6);
      if (j > 0) { cs[3 - j] = a0; cs[3] = -pv(cs, s); }
      else cs[3] = -pv(cs, s);
      const A = j > 0 ? a0 : cs[3];
      if (A === 0) continue;
      const shown = cs.slice(); if (j === 0) shown[3] = 0;
      const gT = polyA(shown, j);
      const base = shown.slice(); base[3 - j] = 0;
      const G0 = pv(base, s), cA = s ** j;
      if (kind === 'coefA') {
        return item(prompt, `${intT(s, 'x', 'f(t)', 't')}=${gT}\\ \\Rightarrow\\ a=\\square`, A, [
          { tex:`x=${s}:\\ 0=${terms([[G0, ''], [cA, 'a']])}` },
          { tex:'a=\\square', blank:A }]);
      }
      const c = R(rng, -3, 3), ans = pv(dv(cs), c);
      if (Math.abs(ans) > 200) continue;
      return item(prompt, `${intT(s, 'x', 'f(t)', 't')}=${gT}\\ \\Rightarrow\\ f(${c})=\\square`, ans, [
        j > 0 ? { tex:`x=${s}:\\ 0=${terms([[G0, ''], [cA, 'a']])},\\ a=${A}` } : { tex:`f(x)=g'(x)` },
        { tex:`f(x)=${poly(dv(cs))}` },
        { tex:`f(${c})=\\square`, blank:ans }]);
    }
  }

  /* prop(기본) — 정적분의 성질·절댓값 */
  const prompt = L3('∫ₐᶜ f(x)dx+∫꜀ᵇ f(x)dx=∫ₐᵇ f(x)dx, ∫ᵇₐ f(x)dx=−∫ₐᵇ f(x)dx 입니다. 절댓값은 안의 식이 0 이 되는 x 에서 구간을 나눕니다. ∫₋ₜᵗ 에서는 홀수 차수 항이 지워지고 짝수 차수 항은 2∫₀ᵗ 가 됩니다.',
    '∫ₐᶜ f(x)dx+∫꜀ᵇ f(x)dx=∫ₐᵇ f(x)dx and ∫ᵇₐ f(x)dx=−∫ₐᵇ f(x)dx. For an absolute value, split the interval where the inside equals 0. In ∫₋ₜᵗ the odd-degree terms cancel and the even-degree terms become 2∫₀ᵗ.',
    '∫ₐᶜ f(x)dx+∫꜀ᵇ f(x)dx=∫ₐᵇ f(x)dx，∫ᵇₐ f(x)dx=−∫ₐᵇ f(x)dx。绝对值在里面的式子等于0的x处分开区间。∫₋ₜᵗ中奇次项消去，偶次项变为2∫₀ᵗ。');
  for (let g = 0; g < 400; g++) {
    const kind = pick(rng, ['abs1', 'abs2', 'abs2', 'split', 'given', 'sym']);
    if (kind === 'abs1') {
      const p = nz(rng, 1, 4), r = R(rng, -3, 3), a = r - R(rng, 1, 4), b = r + R(rng, 1, 4);
      const S2 = Math.abs(p) * ((r - a) ** 2 + (b - r) ** 2);
      if (b === 1 || S2 % 2) continue;
      const ans = S2 / 2, f = [p, -p * r], nf = [-p, p * r];
      const [L, Rt] = p > 0 ? [nf, f] : [f, nf];
      return item(prompt, `${intT(a, b, `|${poly(f)}|`)}=\\square`, ans, [
        { tex:`${intT(a, r, `(${poly(L)})`)}+${intT(r, b, `(${poly(Rt)})`)}` },
        { tex:`\\frac{${Math.abs(p) * (r - a) ** 2}}{2}+\\frac{${Math.abs(p) * (b - r) ** 2}}{2}` },
        { tex:'\\square', blank:ans }]);
    }
    if (kind === 'abs2') {
      const r1 = R(rng, -3, 2), r2 = r1 + 2 * R(rng, 1, 2);
      if (r2 > 4) continue;
      const F = [1, -3 * (r1 + r2) / 2, 3 * r1 * r2, 0], f = dv(F);
      const a = R(rng, -4, 2), b = a + R(rng, 2, 5);
      if (b > 5 || b === 1 || !(a < r1 && r1 < b) && !(a < r2 && r2 < b)) continue;
      const cuts = [a].concat([r1, r2].filter(r => a < r && r < b), [b]);
      const parts = []; let ans = 0;
      for (let i = 0; i + 1 < cuts.length; i++) { const v = Math.abs(I(F, cuts[i], cuts[i + 1])); parts.push(v); ans += v; }
      if (ans > 300) continue;
      return item(prompt, `${intT(a, b, `|${poly(f)}|`)}=\\square`, ans, [
        { tex:`${poly(f)}=${facTex(3, [r1, r2])}` },
        { tex: parts.join('+') },
        { tex:'\\square', blank:ans }]);
    }
    if (kind === 'split') {
      const F = F3(rng), f = dv(F), a = R(rng, -3, 2), c = a + R(rng, 1, 3), b = c + R(rng, 1, 3);
      if (b === 1 || c === 1) continue;
      const body = `(${poly(f)})`;
      if (pick(rng, [0, 1])) {
        const ans = I(F, a, b);
        if (Math.abs(ans) > 300) continue;
        return item(prompt, `${intT(a, c, body)}+${intT(c, b, body)}=\\square`, ans, [
          { tex:`${intT(a, b, body)}=\\Bigl[${poly(F)}\\Bigr]_{${a}}^{${b}}` },
          { tex:'\\square', blank:ans }]);
      }
      const ans = I(F, a, c);
      if (Math.abs(ans) > 300) continue;
      return item(prompt, `${intT(a, b, body)}-${intT(c, b, body)}=\\square`, ans, [
        { tex:`${intT(a, c, body)}=\\Bigl[${poly(F)}\\Bigr]_{${a}}^{${c}}` },
        { tex:'\\square', blank:ans }]);
    }
    if (kind === 'given') {
      const a = R(rng, -2, 2), c = a + R(rng, 1, 4), b = c + R(rng, 1, 4), A = nz(rng, 1, 20), B = nz(rng, 1, 20);
      if (b === 1 || c === 1) continue;
      const form = pick(rng, [0, 1, 2]), ft = 'f(x)';
      if (form === 0) return item(prompt, `${intT(a, b, ft)}=${A},\\ ${intT(c, b, ft)}=${B}\\ \\Rightarrow\\ ${intT(a, c, ft)}=\\square`, A - B, [
        { tex:`${intT(a, c, ft)}=${intT(a, b, ft)}-${intT(c, b, ft)}` },
        { tex:`${A}-${par(B)}=\\square`, blank:A - B }]);
      if (form === 1) return item(prompt, `${intT(a, c, ft)}=${A},\\ ${intT(c, b, ft)}=${B}\\ \\Rightarrow\\ ${intT(a, b, ft)}=\\square`, A + B, [
        { tex:`${intT(a, b, ft)}=${intT(a, c, ft)}+${intT(c, b, ft)}` },
        { tex:`${A}+${par(B)}=\\square`, blank:A + B }]);
      return item(prompt, `${intT(a, b, ft)}=${A},\\ ${intT(a, c, ft)}=${B}\\ \\Rightarrow\\ ${intT(b, c, ft)}=\\square`, B - A, [
        { tex:`${intT(b, c, ft)}=-${intT(c, b, ft)}=-\\bigl(${A}-${par(B)}\\bigr)` },
        { tex:'\\square', blank:B - A }]);
    }
    /* sym */
    const t = pick(rng, [2, 3]), al = nz(rng, 1, 2), ga = R(rng, -6, 6), be3 = nz(rng, 1, 5), ep = R(rng, -6, 6);
    const f = [be3, 3 * al, ep, ga], half = al * t ** 3 + ga * t, ans = 2 * half;
    if (Math.abs(ans) > 300) continue;
    return item(prompt, `${intT(-t, t, `(${poly(f)})`)}=\\square`, ans, [
      { tex:`2${intT(0, t, `(${poly([3 * al, 0, ga])})`)}` },
      { tex:`2\\times${par(half)}` },
      { tex:'\\square', blank:ans }]);
  }
};

if (typeof module !== 'undefined' && module.exports) module.exports = NM_TGEN;
})();
