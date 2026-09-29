/* ============================================================
   Numbers of Magic — MD125~MD133 공통수학2 새 유형 생성기 2차 (2026-09-29)
   근거: docs/high-build-spec.md (공통수학2 새 유형 목록 뒤 9개).
   교재(교과연산 K)는 챕터 제목만 근거로 쓰고, 문제는 전부 새로 만든다.

   MD125 진리집합·필요충분조건        truth · suff · iff(2칸)
   MD126 절대부등식                 min · prod · cs
   MD127 함수의 개수·일대일대응       count(문장제) · bij(문장제) · coef(2칸)
   MD128 합성함수                   value · coef(2칸) · iter
   MD129 역함수                     value · compose · coef(2칸)
   MD130 유리식의 계산               arith(2칸) · partial(2칸) · complex
   MD131 유리함수                   asym(2칸) · coef(2칸) · range(2칸)
   MD132 무리식의 계산               real(문장제) · ration · value
   MD133 무리함수                   domain · shift(2칸) · meet(2칸)

   계약: NM_TGEN[gen](params, rng), Math.random 금지. 답은 정수 또는 정수 배열.
   **답을 먼저 고르고 식을 역산한다** — 근·점근선·최솟값·역함수의 값을 먼저 정한 뒤
   식의 계수를 만든다. 산술·기하 평균은 곱이 제곱수가 되게, 코시-슈바르츠는 제곱의 합이
   딱 떨어지게 잡는다.
   인쇄물은 tex 만 싣는다(관계 기호가 있으면 물음 줄을 생략) — 그래서 tex 만 보고도
   무엇을 구하는지 알 수 있게 쓴다. 최댓값은 M, 최솟값은 m(레벨 개념에서 정의).
   풀이 마지막 단계의 blank = 답 전체. 표기: 계수 1·0 숨김, 음수는 괄호, 이중부호 금지.
   max·min·∈·⊂·∣(\mid) 기호는 쓰지 않는다 — 조건제시법의 세로줄은 \, | \, 로 쓴다.
   ============================================================ */
(function(){
'use strict';
const NM_TGEN = window.NM_TGEN = window.NM_TGEN || {};
const { R, pick, shuffle } = NM_RNG;

/* ── 공용 헬퍼(파일별 독립 정의 관례) ── */
function nz(rng, lo, hi){ return R(rng, lo, hi) * pick(rng, [1, -1]); }
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
function terms(list){
  let s = '';
  list.forEach(([c, v]) => { if(c === 0) return; s += s ? more(c, v) : lead(c, v); });
  return s || '0';
}
function xMinus(r, v){ v = v || 'x'; return r === 0 ? v : `${v}${more(-r, '')}`; }
function grp(a, v){ return a === 0 ? (v || 'x') : `(${xMinus(a, v)})`; }
/* (x−r1)(x−r2) — 0 인 근은 x 를 앞에 */
function fac2(r1, r2){
  if(r1 === 0) return `x${grp(r2)}`;
  if(r2 === 0) return `x${grp(r1)}`;
  return `${grp(r1)}${grp(r2)}`;
}
function cf(c, body){ return c === 1 ? body : c === -1 ? `-${body}` : `${c}${body}`; }
function pow(b, e){ return e === 1 ? String(b) : `${par(b)}^{${e}}`; }
function item(prompt, tex, answer, solution, extra){
  const p = { prompt, tex, answer, answerType:'number', widget:'numpad', negative: hasNeg(answer), solution };
  return Object.assign(p, extra || {});
}
/* 문장제 — MD122 와 같은 모양(word·wordAsk 가 있으면 인쇄는 글로 싣는다) */
function word(story, ask, answer, solution){
  const prompt = {};
  ['ko', 'en', 'zh'].forEach(l => { prompt[l] = story[l] + ' ' + ask[l]; });
  const p = item(prompt, `\\square`, answer, solution);
  p.word = story; p.wordAsk = ask;
  return p;
}
/* 글(문장제)용 표기 — 음수는 − */
function u(n){ return n < 0 ? `−${-n}` : String(n); }
function pTerms(list){
  let s = '';
  list.forEach(([c, v]) => {
    if(c === 0) return;
    const a = Math.abs(c), body = v ? (a === 1 ? v : `${a}${v}`) : String(a);
    s += s ? (c < 0 ? '−' : '+') + body : (c < 0 ? '−' : '') + body;
  });
  return s || '0';
}
const REL  = { le:'\\le ', lt:'<', ge:'\\ge ', gt:'>' };
function relOk(v, r){ return r === 'le' ? v <= 0 : r === 'lt' ? v < 0 : r === 'ge' ? v >= 0 : v > 0; }
/* 연속한 정수 묶음은 a,a+1,⋯,b 로 줄여 쓴다 */
function runsTex(arr){
  if(!arr.length) return '\\varnothing';
  const parts = []; let i = 0;
  while(i < arr.length){
    let j = i; while(j + 1 < arr.length && arr[j + 1] === arr[j] + 1) j++;
    if(j - i + 1 >= 4) parts.push(`${arr[i]},${arr[i + 1]},\\cdots,${arr[j]}`);
    else for(let k = i; k <= j; k++) parts.push(String(arr[k]));
    i = j + 1;
  }
  return `\\{${parts.join(',')}\\}`;
}
function gcd(a, b){ a = Math.abs(a); b = Math.abs(b); while(b){ [a, b] = [b, a % b]; } return a; }
function isSq(n){ return n >= 0 && Math.round(Math.sqrt(n)) ** 2 === n; }
function divisors(n){ const d = []; for(let i = 1; i <= n; i++) if(n % i === 0) d.push(i); return d; }

/* ── MD125 — 진리집합·필요충분조건 ── */
function quadCond(rng, N){
  const r1 = R(rng, -2, N - 2), r2 = r1 + R(rng, 1, 7);
  const rel = pick(rng, ['le', 'le', 'lt', 'ge', 'gt']);
  return { tex:`${poly([1, -(r1 + r2), r1 * r2])}${REL[rel]}0`, fac:`${fac2(r1, r2)}${REL[rel]}0`,
    f: x => relOk((x - r1) * (x - r2), rel) };
}
function absCond(rng, N){
  const c = R(rng, 1, N), d = R(rng, 1, 5), rel = pick(rng, ['le', 'lt', 'ge', 'gt']);
  return { tex:`|${xMinus(c)}|${REL[rel]}${d}`, fac:null, f: x => relOk(Math.abs(x - c) - d, rel) };
}
NM_TGEN['md125_truthSet'] = function (params, rng) {
  const mode = params.mode || 'truth';

  if (mode === 'suff') {
    const lo = R(rng, -6, 4), hi = lo + R(rng, 1, 7);
    const sTex = pick(rng, [0, 0, 1]) ? `${poly([1, -(lo + hi), lo * hi])}\\le 0` : `${lo}\\le x\\le ${hi}`;
    const k = pick(rng, [1, 1, 2, 3]), c = R(rng, -9, 9);
    const form = pick(rng, ['mLe', 'pGe', 'mGe', 'pLe']);
    const kx = lead(k, 'x');
    const kxs = e => k === 1 ? par(e) : `${k}\\times${par(e)}`;
    let tTex, dir, ans, step;
    if (form === 'mLe') { tTex = `${kx}-a\\le ${c}`; dir = 'ge'; ans = k * hi - c; step = `${kxs(hi)}-a\\le ${c}`; }
    else if (form === 'pGe') { tTex = `${kx}+a\\ge ${c}`; dir = 'ge'; ans = c - k * lo; step = `${kxs(lo)}+a\\ge ${c}`; }
    else if (form === 'mGe') { tTex = `${kx}-a\\ge ${c}`; dir = 'le'; ans = k * lo - c; step = `${kxs(lo)}-a\\ge ${c}`; }
    else { tTex = `${kx}+a\\le ${c}`; dir = 'le'; ans = c - k * hi; step = `${kxs(hi)}+a\\le ${c}`; }
    const nec = pick(rng, [0, 1]);
    const pT = nec ? tTex : sTex, qT = nec ? sTex : tTex, imp = nec ? 'q\\Longrightarrow p' : 'p\\Longrightarrow q';
    const rel = dir === 'ge' ? '\\ge ' : '\\le ';
    const sol = [];
    if (/x\^2/.test(sTex)) sol.push({ tex:`${fac2(lo, hi)}\\le 0\\ \\Rightarrow\\ ${lo}\\le x\\le ${hi}` });
    sol.push({ tex:step });
    sol.push({ tex:`a${rel}\\square`, blank:ans });
    return item(
      nec
        ? L3('p 는 q 이기 위한 필요조건입니다(q⟹p). q 의 진리집합이 p 의 진리집합의 부분집합이 되도록 실수 a 의 범위를 구합니다.',
             'p is a necessary condition for q (q⟹p). Find the range of the real number a so that the truth set of q is a subset of the truth set of p.',
             'p是q的必要条件(q⟹p)。求实数a的范围，使q的真值集合是p的真值集合的子集。')
        : L3('p 는 q 이기 위한 충분조건입니다(p⟹q). p 의 진리집합이 q 의 진리집합의 부분집합이 되도록 실수 a 의 범위를 구합니다.',
             'p is a sufficient condition for q (p⟹q). Find the range of the real number a so that the truth set of p is a subset of the truth set of q.',
             'p是q的充分条件(p⟹q)。求实数a的范围，使p的真值集合是q的真值集合的子集。'),
      `p:\\ ${pT},\\ q:\\ ${qT},\\ ${imp}\\ \\Rightarrow\\ a${rel}\\square`, ans, sol);
  }

  if (mode === 'iff') {
    const kind = pick(rng, ['le', 'le', 'gt', 'abs']);
    const prompt = L3('p 와 q 의 진리집합이 서로 같으면 p 는 q 이기 위한 필요충분조건입니다(p⟺q). 두 진리집합이 같아지도록 a, b 를 구합니다.',
      'p is a necessary and sufficient condition for q (p⟺q) when their truth sets are equal. Find a and b so that the two truth sets are equal.',
      '当p与q的真值集合相等时，p是q的充要条件(p⟺q)。求a、b使两个真值集合相等。');
    if (kind === 'abs') {
      const c = R(rng, -6, 6), d = R(rng, 1, 6), strict = pick(rng, [0, 0, 1]);
      const r1 = c - d, r2 = c + d;
      return item(prompt,
        `p:\\ |x-a|${strict ? '<' : '\\le '}b,\\ q:\\ ${poly([1, -(r1 + r2), r1 * r2])}${strict ? '<' : '\\le '}0,\\ p\\Longleftrightarrow q\\ \\Rightarrow\\ a=\\square,\\ b=\\square`,
        [c, d], [
          { tex:`${fac2(r1, r2)}${strict ? '<' : '\\le '}0\\ \\Rightarrow\\ ${r1}${strict ? '<' : '\\le '}x${strict ? '<' : '\\le '}${r2}` },
          { tex:`a-b=${r1},\\ a+b=${r2}` },
          { tex:`a=\\square,\\ b=\\square`, blank:[c, d] }]);
    }
    if (kind === 'gt') {
      const c = R(rng, -6, 6), d = R(rng, 1, 6), strict = pick(rng, [1, 1, 0]);
      const a = -2 * c, b = c * c - d * d;
      const rp = strict ? '>' : '\\ge ';
      return item(prompt,
        `p:\\ x^2+ax+b${rp}0,\\ q:\\ |${xMinus(c)}|${rp}${d},\\ p\\Longleftrightarrow q\\ \\Rightarrow\\ a=\\square,\\ b=\\square`,
        [a, b], [
          { tex:`|${xMinus(c)}|${rp}${d}\\ \\Leftrightarrow\\ ${fac2(c - d, c + d)}${rp}0` },
          { tex:`${fac2(c - d, c + d)}=${poly([1, a, b])}` },
          { tex:`a=\\square,\\ b=\\square`, blank:[a, b] }]);
    }
    const r1 = R(rng, -6, 5), r2 = r1 + R(rng, 1, 8), strict = pick(rng, [0, 0, 1]);
    const a = -(r1 + r2), b = r1 * r2, rl = strict ? '<' : '\\le ';
    const qT = (r1 + r2) % 2 === 0 && pick(rng, [0, 1])
      ? `|${xMinus((r1 + r2) / 2)}|${rl}${(r2 - r1) / 2}` : `${r1}${rl}x${rl}${r2}`;
    return item(prompt,
      `p:\\ x^2+ax+b${rl}0,\\ q:\\ ${qT},\\ p\\Longleftrightarrow q\\ \\Rightarrow\\ a=\\square,\\ b=\\square`,
      [a, b], [
        { tex:`${r1}${rl}x${rl}${r2}\\ \\Leftrightarrow\\ ${fac2(r1, r2)}${rl}0` },
        { tex:`${fac2(r1, r2)}=${poly([1, a, b])}` },
        { tex:`a=\\square,\\ b=\\square`, blank:[a, b] }]);
  }

  /* truth(기본) — 전체집합 U 에서 진리집합의 원소의 개수 */
  for (let g = 0; g < 300; g++) {
    const N = R(rng, 8, 20);
    const U = []; for (let i = 1; i <= N; i++) U.push(i);
    const kind = pick(rng, ['quad', 'quad', 'abs', 'neg', 'and']);
    const p = kind === 'abs' ? absCond(rng, N) : quadCond(rng, N);
    const P = U.filter(p.f);
    let target, res, qTex = '', setLine;
    if (kind === 'neg') {
      res = U.filter(x => !p.f(x)); target = 'n(P^{C})'; setLine = `P^{C}=${runsTex(res)}`;
    } else if (kind === 'and') {
      const k = R(rng, 2, N - 1), rel = pick(rng, ['le', 'lt', 'ge', 'gt']), cup = pick(rng, [0, 0, 1]);
      qTex = `x${REL[rel]}${k}`;
      const Q = U.filter(x => relOk(x - k, rel));
      res = U.filter(x => cup ? (p.f(x) || relOk(x - k, rel)) : (p.f(x) && relOk(x - k, rel)));
      target = cup ? 'n(P\\cup Q)' : 'n(P\\cap Q)';
      setLine = `Q=${runsTex(Q)}`;
    } else {
      res = P; target = 'n(P)';
    }
    if (!res.length || res.length === N) continue;
    const sol = [];
    if (p.fac) sol.push({ tex:p.fac });
    sol.push({ tex:`P=${runsTex(P)}` });
    if (setLine) sol.push({ tex:setLine });
    sol.push({ tex:`${target}=\\square`, blank:res.length });
    return item(
      L3('조건 p, q 의 진리집합을 각각 P, Q 라 합니다. 전체집합 U 의 원소 가운데 조건을 참이 되게 하는 것을 모두 찾아 개수를 셉니다.',
         'Let P and Q be the truth sets of the conditions p and q. Find every element of the universal set U that makes the condition true, and count them.',
         '设条件p、q的真值集合分别为P、Q。在全集U的元素中找出使条件成立的所有元素，再数个数。'),
      `U=\\{1,2,3,\\cdots,${N}\\},\\ p:\\ ${p.tex}${qTex ? `,\\ q:\\ ${qTex}` : ''}\\ \\Rightarrow\\ ${target}=\\square`,
      res.length, sol);
  }
  return item(L3('', '', ''), `U=\\{1,2,3,\\cdots,10\\},\\ p:\\ x^2-5x+4\\le 0\\ \\Rightarrow\\ n(P)=\\square`, 4,
    [{ tex:`P=\\{1,2,3,4\\}` }, { tex:`n(P)=\\square`, blank:4 }]);
};

/* ── MD126 — 절대부등식(산술·기하 평균, 코시-슈바르츠) ── */
const TRIPLES = [[1, 2, 2, 3], [2, 1, 2, 3], [2, 3, 6, 7], [3, 6, 2, 7], [1, 4, 8, 9], [4, 4, 7, 9], [2, 6, 9, 11], [6, 2, 9, 11]];
NM_TGEN['md126_absIneq'] = function (params, rng) {
  const mode = params.mode || 'min';

  if (mode === 'prod') {
    const kind = pick(rng, ['maxProd', 'maxProd', 'minSum', 'frac']);
    if (kind === 'maxProd') {
      let a, b; do { a = R(rng, 1, 6); b = R(rng, 1, 6); } while (gcd(a, b) !== 1);
      const t = R(rng, 1, 4), S = 2 * a * b * t, M = a * b * t * t;
      return item(
        L3('양수 x, y 에서 합이 일정하면 곱은 두 항이 같을 때 가장 큽니다. 산술평균과 기하평균의 관계로 xy 의 최댓값 M 을 구합니다.',
           'For positive x, y with a fixed sum, the product is largest when the two terms are equal. Use the AM–GM inequality to find the greatest value M of xy.',
           '正数x、y的和一定时，两项相等时积最大。用算术平均与几何平均的关系求xy的最大值M。'),
        `x>0,\\ y>0,\\ ${terms([[a, 'x'], [b, 'y']])}=${S}\\ \\Rightarrow\\ xy:\\ M=\\square`, M, [
          { tex:`${a === 1 ? 'x' : a + 'x'}\\times${b === 1 ? 'y' : b + 'y'}\\le\\left(\\dfrac{${S}}{2}\\right)^2=${S * S / 4}` },
          { tex:`xy\\le\\dfrac{${S * S / 4}}{${a * b}}=${M}` },
          { tex:`M=\\square`, blank:M }]);
    }
    if (kind === 'minSum') {
      const a = R(rng, 1, 5), b = R(rng, 1, 5), s = R(rng, 1, 4);
      const P = a * b * s * s, m = 2 * a * b * s;
      return item(
        L3('양수 x, y 에서 곱이 일정하면 합은 두 항이 같을 때 가장 작습니다. 산술평균과 기하평균의 관계로 최솟값 m 을 구합니다.',
           'For positive x, y with a fixed product, the sum is least when the two terms are equal. Use the AM–GM inequality to find the least value m.',
           '正数x、y的积一定时，两项相等时和最小。用算术平均与几何平均的关系求最小值m。'),
        `x>0,\\ y>0,\\ xy=${P}\\ \\Rightarrow\\ ${terms([[a, 'x'], [b, 'y']])}:\\ m=\\square`, m, [
          { tex:`${terms([[a, 'x'], [b, 'y']])}\\ge 2\\sqrt{${a * b === 1 ? '' : a * b + '\\times'}${P}}=2\\sqrt{${a * b * P}}` },
          { tex:`2\\times${a * b * s}=${m}` },
          { tex:`m=\\square`, blank:m }]);
    }
    const uu = R(rng, 1, 5), vv = R(rng, 1, 5), p = uu * uu, q = vv * vv, m = (uu + vv) * (uu + vv);
    return item(
      L3('조건식에 1 을 곱해도 값은 같습니다. x+y 에 조건식을 곱해 펼친 뒤 산술평균과 기하평균의 관계로 최솟값 m 을 구합니다.',
         'Multiplying by 1 changes nothing: multiply x+y by the given expression (equal to 1), expand, and use the AM–GM inequality to find the least value m.',
         '乘1值不变：把x+y乘以等于1的条件式展开，再用算术平均与几何平均的关系求最小值m。'),
      `x>0,\\ y>0,\\ \\dfrac{${p}}{x}+\\dfrac{${q}}{y}=1\\ \\Rightarrow\\ x+y:\\ m=\\square`, m, [
        { tex:`(x+y)\\left(\\dfrac{${p}}{x}+\\dfrac{${q}}{y}\\right)=${p + q}+\\dfrac{${lead(p, 'y')}}{x}+\\dfrac{${lead(q, 'x')}}{y}` },
        { tex:`${p + q}+\\dfrac{${lead(p, 'y')}}{x}+\\dfrac{${lead(q, 'x')}}{y}\\ge ${p + q}+2\\sqrt{${p * q}}=${m}` },
        { tex:`m=\\square`, blank:m }]);
  }

  if (mode === 'cs') {
    const kind = pick(rng, ['lin', 'lin', 'sq', 'three']);
    const askM = pick(rng, [1, 1, 0]);
    const prompt = L3('실수 x, y(, z) 에 대하여 코시-슈바르츠 부등식 (a²+b²)(x²+y²)≥(ax+by)² 을 씁니다. 최댓값은 M, 최솟값은 m 으로 씁니다.',
      'For real x, y (and z), use the Cauchy–Schwarz inequality (a²+b²)(x²+y²)≥(ax+by)². Write the greatest value as M and the least as m.',
      '对实数x、y(、z)用柯西-施瓦茨不等式(a²+b²)(x²+y²)≥(ax+by)²。最大值记为M，最小值记为m。');
    if (kind === 'three') {
      const T = pick(rng, TRIPLES), k = R(rng, 1, 4);
      const [a, b, c] = [T[0] * pick(rng, [1, -1]), T[1] * pick(rng, [1, -1]), T[2] * pick(rng, [1, -1])];
      const h = T[3], M = h * k, ans = askM ? M : -M;
      const L = terms([[a, 'x'], [b, 'y'], [c, 'z']]);
      return item(prompt, `x^2+y^2+z^2=${k * k}\\ \\Rightarrow\\ ${L}:\\ ${askM ? 'M' : 'm'}=\\square`, ans, [
        { tex:`(${L})^2\\le(${par(a)}^2+${par(b)}^2+${par(c)}^2)(x^2+y^2+z^2)=${h * h}\\times${k * k}` },
        { tex:`${-M}\\le ${L}\\le ${M}` },
        { tex:`${askM ? 'M' : 'm'}=\\square`, blank:ans }]);
    }
    const a = nz(rng, 1, 5), b = nz(rng, 1, 5);
    const c = a * a + b * b;
    const L = terms([[a, 'x'], [b, 'y']]);
    if (kind === 'sq') {
      const k = R(rng, 1, 3) * pick(rng, [1, -1]), S = c * k, m = c * k * k;
      return item(prompt, `${L}=${S}\\ \\Rightarrow\\ x^2+y^2:\\ m=\\square`, m, [
        { tex:`(${par(a)}^2+${par(b)}^2)(x^2+y^2)\\ge(${L})^2=${S * S}` },
        { tex:`x^2+y^2\\ge\\dfrac{${S * S}}{${c}}` },
        { tex:`m=\\square`, blank:m }]);
    }
    const k = R(rng, 1, 4), M = c * k, ans = askM ? M : -M;
    return item(prompt, `x^2+y^2=${c * k * k}\\ \\Rightarrow\\ ${L}:\\ ${askM ? 'M' : 'm'}=\\square`, ans, [
      { tex:`(${L})^2\\le(${par(a)}^2+${par(b)}^2)(x^2+y^2)=${c}\\times${c * k * k}=${M * M}` },
      { tex:`${-M}\\le ${L}\\le ${M}` },
      { tex:`${askM ? 'M' : 'm'}=\\square`, blank:ans }]);
  }

  /* min(기본) — 산술·기하 평균으로 최솟값 */
  const prompt = L3('양수 a, b 에 대하여 a+b≥2√(ab) 이고, 등호는 a=b 일 때 성립합니다. 두 항의 곱이 일정해지도록 묶어 최솟값 m 을 구합니다.',
    'For positive a, b, a+b≥2√(ab), with equality when a=b. Group the terms so their product is constant and find the least value m.',
    '对正数a、b有a+b≥2√(ab)，当a=b时取等号。把两项组合成积为定值的形式，求最小值m。');
  const kind = pick(rng, ['ab', 'ab', 'shift', 'pair']);
  if (kind === 'shift') {
    const s = R(rng, 1, 6), k = s * s, c = nz(rng, 1, 5), m = 2 * s + c;
    const d = xMinus(c);
    return item(prompt, `x>${c}\\ \\Rightarrow\\ x+\\dfrac{${k}}{${d}}:\\ m=\\square`, m, [
      { tex:`x+\\dfrac{${k}}{${d}}=(${d})+\\dfrac{${k}}{${d}}${more(c, '')}` },
      { tex:`(${d})+\\dfrac{${k}}{${d}}${more(c, '')}\\ge 2\\sqrt{${k}}${more(c, '')}=${m}` },
      { tex:`m=\\square`, blank:m }]);
  }
  if (kind === 'pair') {
    let p, q;
    do { const g = R(rng, 1, 3), a = R(rng, 1, 4), b = R(rng, 1, 4); p = g * a * a; q = g * b * b; } while (p === q && pick(rng, [0, 1, 1]));
    const m = p + q + 2 * Math.round(Math.sqrt(p * q));
    return item(prompt, `x>0,\\ y>0\\ \\Rightarrow\\ (x+y)\\left(\\dfrac{${p}}{x}+\\dfrac{${q}}{y}\\right):\\ m=\\square`, m, [
      { tex:`(x+y)\\left(\\dfrac{${p}}{x}+\\dfrac{${q}}{y}\\right)=${p + q}+\\dfrac{${lead(p, 'y')}}{x}+\\dfrac{${lead(q, 'x')}}{y}` },
      { tex:`${p + q}+\\dfrac{${lead(p, 'y')}}{x}+\\dfrac{${lead(q, 'x')}}{y}\\ge ${p + q}+2\\sqrt{${p * q}}=${m}` },
      { tex:`m=\\square`, blank:m }]);
  }
  const t = R(rng, 2, 12), ds = divisors(t * t).filter(d => d <= 12 && t * t / d <= 150);
  const a = pick(rng, ds), b = t * t / a, m = 2 * t;
  return item(prompt, `x>0\\ \\Rightarrow\\ ${lead(a, 'x')}+\\dfrac{${b}}{x}:\\ m=\\square`, m, [
    { tex:`${lead(a, 'x')}+\\dfrac{${b}}{x}\\ge 2\\sqrt{${lead(a, 'x')}\\times\\dfrac{${b}}{x}}=2\\sqrt{${t * t}}` },
    { tex:`2\\times${t}=${m}` },
    { tex:`m=\\square`, blank:m }]);
};

/* ── MD127 — 함수의 개수·일대일대응 ── */
const LET = ['a', 'b', 'c', 'd', 'e', 'f'];
function numSet(m){ const a = []; for (let i = 1; i <= m; i++) a.push(i); return `{${a.join(', ')}}`; }
function letSet(n){ return `{${LET.slice(0, n).join(', ')}}`; }
function perm(n, r){ let v = 1; for (let i = 0; i < r; i++) v *= n - i; return v; }
function fact(n){ return perm(n, n); }
function prodTex(n, r){ const a = []; for (let i = 0; i < r; i++) a.push(n - i); return a.join('\\times'); }
NM_TGEN['md127_funcCount'] = function (params, rng) {
  const mode = params.mode || 'count';

  if (mode === 'coef') {
    const a = nz(rng, 1, 4), b = R(rng, -9, 9), p = R(rng, -4, 3), q = p + R(rng, 1, 4);
    const fp = a * p + b, fq = a * q + b, r = Math.min(fp, fq), s = Math.max(fp, fq);
    const inc = a > 0;
    return item(
      L3('X 에서 Y 로의 일차함수 f(x)=ax+b 가 일대일대응이 되려면 정의역의 양 끝이 치역의 양 끝으로 가야 합니다. a>0 이면 작은 끝끼리, a<0 이면 엇갈려 대응합니다.',
         'For the linear function f(x)=ax+b from X to Y to be a one-to-one correspondence, the ends of the domain must go to the ends of Y: small to small if a>0, crossed if a<0.',
         '要使从X到Y的一次函数f(x)=ax+b是一一对应，定义域的两端必须对应到Y的两端：a>0时小端对小端，a<0时交叉对应。'),
      `\\begin{array}{l} X=\\{x\\,|\\,${p}\\le x\\le ${q}\\},\\ Y=\\{y\\,|\\,${r}\\le y\\le ${s}\\} \\\\ f:X\\to Y,\\ f(x)=ax+b\\ (a${inc ? '>' : '<'}0)\\ \\Rightarrow\\ a=\\square,\\ b=\\square \\end{array}`,
      [a, b], [
        { tex: inc ? `f(${p})=${r},\\ f(${q})=${s}` : `f(${p})=${s},\\ f(${q})=${r}` },
        { tex:`${cf(q - p, 'a')}=${inc ? s - r : r - s}\\ \\Rightarrow\\ a=${a}` },
        { tex:`a=\\square,\\ b=\\square`, blank:[a, b] }]);
  }

  if (mode === 'bij') {
    const kind = pick(rng, ['inj', 'bij', 'fix', 'notA']);
    if (kind === 'inj') {
      const m = R(rng, 2, 4), n = R(rng, m + 1, 6), ans = perm(n, m);
      return word(
        L3(`두 집합 X = ${numSet(m)}, Y = ${letSet(n)} 가 있습니다.`, `Let X = ${numSet(m)} and Y = ${letSet(n)}.`, `设集合X = ${numSet(m)}，Y = ${letSet(n)}。`),
        L3('X 에서 Y 로의 일대일함수의 개수를 구합니다.', 'How many one-to-one functions from X to Y are there?', '求从X到Y的单射的个数。'),
        ans, [
          { tex:`{}_{${n}}\\mathrm{P}_{${m}}=${prodTex(n, m)}` },
          { tex:`${prodTex(n, m)}=\\square`, blank:ans }]);
    }
    const n = R(rng, 3, 6);
    const story = L3(`두 집합 X = ${numSet(n)}, Y = ${letSet(n)} 가 있습니다.`, `Let X = ${numSet(n)} and Y = ${letSet(n)}.`, `设集合X = ${numSet(n)}，Y = ${letSet(n)}。`);
    if (kind === 'bij') {
      const ans = fact(n);
      return word(story,
        L3('X 에서 Y 로의 일대일대응의 개수를 구합니다.', 'How many one-to-one correspondences from X to Y are there?', '求从X到Y的一一对应的个数。'),
        ans, [
          { tex:`${n}!=${prodTex(n, n)}` },
          { tex:`${prodTex(n, n)}=\\square`, blank:ans }]);
    }
    const k = R(rng, 1, n), y = LET[R(rng, 0, n - 1)];
    if (kind === 'fix') {
      const ans = fact(n - 1);
      return word(story,
        L3(`X 에서 Y 로의 일대일대응 f 가운데 f(${k}) = ${y} 인 것의 개수를 구합니다.`,
           `How many one-to-one correspondences f from X to Y satisfy f(${k}) = ${y}?`,
           `从X到Y的一一对应f中，满足f(${k}) = ${y}的有多少个？`),
        ans, [
          { tex:`(${n}-1)!=${n - 1 === 1 ? '1' : prodTex(n - 1, n - 1)}` },
          { tex:`${n - 1 === 1 ? '1' : prodTex(n - 1, n - 1)}=\\square`, blank:ans }]);
    }
    const ans = fact(n) - fact(n - 1);
    return word(story,
      L3(`X 에서 Y 로의 일대일대응 f 가운데 f(${k}) ≠ ${y} 인 것의 개수를 구합니다.`,
         `How many one-to-one correspondences f from X to Y satisfy f(${k}) ≠ ${y}?`,
         `从X到Y的一一对应f中，满足f(${k}) ≠ ${y}的有多少个？`),
      ans, [
        { tex:`${n}!-(${n}-1)!=${fact(n)}-${fact(n - 1)}` },
        { tex:`${fact(n)}-${fact(n - 1)}=\\square`, blank:ans }]);
  }

  /* count(기본) — 함수의 개수 */
  const m = R(rng, 2, 4), n = R(rng, 2, 5);
  const story = L3(`두 집합 X = ${numSet(m)}, Y = ${letSet(n)} 가 있습니다.`, `Let X = ${numSet(m)} and Y = ${letSet(n)}.`, `设集合X = ${numSet(m)}，Y = ${letSet(n)}。`);
  const kind = pick(rng, ['all', 'fix', 'notConst', 'notA']);
  const k = R(rng, 1, m), y = LET[R(rng, 0, n - 1)];
  if (kind === 'fix') {
    const ans = Math.pow(n, m - 1);
    return word(story,
      L3(`X 에서 Y 로의 함수 f 가운데 f(${k}) = ${y} 인 것의 개수를 구합니다.`, `How many functions f from X to Y satisfy f(${k}) = ${y}?`, `从X到Y的函数f中，满足f(${k}) = ${y}的有多少个？`),
      ans, [
        { tex:`1\\times${Array(m - 1).fill(n).join('\\times')}` },
        { tex:`${pow(n, m - 1)}=\\square`, blank:ans }]);
  }
  if (kind === 'notA') {
    const ans = (n - 1) * Math.pow(n, m - 1);
    return word(story,
      L3(`X 에서 Y 로의 함수 f 가운데 f(${k}) ≠ ${y} 인 것의 개수를 구합니다.`, `How many functions f from X to Y satisfy f(${k}) ≠ ${y}?`, `从X到Y的函数f中，满足f(${k}) ≠ ${y}的有多少个？`),
      ans, [
        { tex:`(${n}-1)\\times${pow(n, m - 1)}` },
        { tex:`${n - 1}\\times${Math.pow(n, m - 1)}=\\square`, blank:ans }]);
  }
  if (kind === 'notConst') {
    const ans = Math.pow(n, m) - n;
    return word(story,
      L3('X 에서 Y 로의 함수 가운데 상수함수가 아닌 것의 개수를 구합니다.', 'How many functions from X to Y are not constant functions?', '从X到Y的函数中，不是常函数的有多少个？'),
      ans, [
        { tex:`${pow(n, m)}-${n}` },
        { tex:`${Math.pow(n, m)}-${n}=\\square`, blank:ans }]);
  }
  const ans = Math.pow(n, m);
  return word(story,
    L3('X 에서 Y 로의 함수의 개수를 구합니다.', 'How many functions from X to Y are there?', '求从X到Y的函数的个数。'),
    ans, [
      { tex:`${Array(m).fill(n).join('\\times')}` },
      { tex:`${pow(n, m)}=\\square`, blank:ans }]);
};

/* ── MD128 — 합성함수 ── */
function linF(p, q){ return { tex:poly([p, q]), f: x => p * x + q }; }
function randF(rng, quad){
  if (quad) { const p = pick(rng, [1, 1, -1, 2]), c = R(rng, -5, 5); return { tex:poly([p, 0, c]), f: x => p * x * x + c }; }
  return linF(nz(rng, 1, 4), R(rng, -6, 6));
}
NM_TGEN['md128_compose'] = function (params, rng) {
  const mode = params.mode || 'value';

  if (mode === 'coef') {
    const kind = pick(rng, ['fg', 'gf', 'ff']);
    const prompt = L3('합성함수를 x 에 대한 식으로 정리한 뒤, 주어진 식과 계수를 비교해 a, b 를 구합니다(항등식).',
      'Write the composite function in terms of x, then compare coefficients with the given expression to find a and b (an identity).',
      '把合成函数整理成关于x的式子，再与已知式比较系数求a、b(恒等式)。');
    if (kind === 'ff') {
      const a = R(rng, 1, 4), b = nz(rng, 1, 6);
      const h = poly([a * a, a * b + b]);
      return item(prompt, `f(x)=ax+b\\ (a>0),\\ (f\\circ f)(x)=${h}\\ \\Rightarrow\\ a=\\square,\\ b=\\square`, [a, b], [
        { tex:`(f\\circ f)(x)=a(ax+b)+b=a^2x+ab+b` },
        { tex:`a^2=${a * a}\\ (a>0)\\ \\Rightarrow\\ a=${a},\\ ${a + 1}b=${a * b + b}` },
        { tex:`a=\\square,\\ b=\\square`, blank:[a, b] }]);
    }
    const p = nz(rng, 1, 4), q = R(rng, -6, 6), a = nz(rng, 1, 5), b = R(rng, -8, 8);
    if (kind === 'fg') {
      const h = poly([p * a, p * b + q]);
      return item(prompt, `f(x)=${poly([p, q])},\\ g(x)=ax+b,\\ (f\\circ g)(x)=${h}\\ \\Rightarrow\\ a=\\square,\\ b=\\square`, [a, b], [
        { tex:`(f\\circ g)(x)=${cf(p, '(ax+b)')}${more(q, '')}` },
        { tex:`${cf(p, 'a')}=${p * a},\\ ${terms([[p, 'b'], [q, '']])}=${p * b + q}` },
        { tex:`a=\\square,\\ b=\\square`, blank:[a, b] }]);
    }
    const h = poly([a * p, a * q + b]);
    return item(prompt, `f(x)=${poly([p, q])},\\ g(x)=ax+b,\\ (g\\circ f)(x)=${h}\\ \\Rightarrow\\ a=\\square,\\ b=\\square`, [a, b], [
      { tex:`(g\\circ f)(x)=a(${poly([p, q])})+b` },
      { tex:`${cf(p, 'a')}=${a * p},\\ ${terms([[q, 'a'], [1, 'b']])}=${a * q + b}` },
      { tex:`a=\\square,\\ b=\\square`, blank:[a, b] }]);
  }

  if (mode === 'iter') {
    const prompt = L3('f¹=f, f²=f∘f, f³=f∘f∘f, … 처럼 fⁿ 은 f 를 n 번 합성한 함수입니다. 몇 번 합성해 보고 규칙(더해지는 값·배수·되풀이 주기)을 찾습니다.',
      'fⁿ means f composed with itself n times (f²=f∘f, f³=f∘f∘f, …). Compose a few times and find the pattern (a constant step, a multiplier, or a repeating cycle).',
      'fⁿ表示f自身合成n次(f²=f∘f，f³=f∘f∘f，…)。先合成几次，找出规律(加的数、倍数或循环周期)。');
    const kind = pick(rng, ['shift', 'affine', 'invol', 'table', 'table', 'frac']);
    if (kind === 'shift') {
      const c = nz(rng, 1, 6), n = R(rng, 5, 60), a = R(rng, -9, 9), ans = a + n * c;
      return item(prompt, `f(x)=${poly([1, c])}\\ \\Rightarrow\\ f^{${n}}(${a})=\\square`, ans, [
        { tex:`f^{2}(x)=${poly([1, 2 * c])},\\ f^{3}(x)=${poly([1, 3 * c])}` },
        { tex:`f^{${n}}(x)=${poly([1, n * c])}` },
        { tex:`f^{${n}}(${a})=\\square`, blank:ans }]);
    }
    if (kind === 'affine') {
      const k = pick(rng, [2, 2, 3, -2]), xs = R(rng, -4, 4), c = xs * (1 - k);
      const n = k === 3 ? R(rng, 3, 6) : R(rng, 3, 9);
      let a; do { a = R(rng, -5, 5); } while (a === xs);
      const ans = Math.pow(k, n) * (a - xs) + xs;
      const body = xs === 0 ? 'x' : `(${xMinus(xs)})`;
      return item(prompt, `f(x)=${poly([k, c])}\\ \\Rightarrow\\ f^{${n}}(${a})=\\square`, ans, [
        { tex:`f(x)${more(-xs, '')}=${k}${body}` },
        { tex:`f^{${n}}(x)${more(-xs, '')}=${par(k)}^{${n}}${body}` },
        { tex:`f^{${n}}(${a})=\\square`, blank:ans }]);
    }
    if (kind === 'invol') {
      const c = R(rng, -9, 9), n = R(rng, 10, 99), a = R(rng, -9, 9), ans = n % 2 ? c - a : a;
      return item(prompt, `f(x)=${poly([-1, c])}\\ \\Rightarrow\\ f^{${n}}(${a})=\\square`, ans, [
        { tex:`f^{2}(x)=-(${poly([-1, c])})${more(c, '')}=x` },
        { tex:`f^{${n}}(${a})=${n % 2 ? `f(${a})` : a}` },
        { tex:`f^{${n}}(${a})=\\square`, blank:ans }]);
    }
    if (kind === 'frac') {
      const start = pick(rng, [2, -1]);
      const orb = start === 2 ? [2, -1, null] : [-1, null, 2];
      let n; do { n = R(rng, 10, 99); } while (orb[n % 3] === null);
      const ans = orb[n % 3];
      return item(prompt, `f(x)=\\dfrac{1}{1-x}\\ \\Rightarrow\\ f^{${n}}(${start})=\\square`, ans, [
        { tex:`f(2)=-1,\\ f(-1)=\\dfrac{1}{2},\\ f\\left(\\dfrac{1}{2}\\right)=2` },
        { tex:`f^{3}(x)=x,\\ ${n}=3\\times${Math.floor(n / 3)}${more(n % 3, '')}` },
        { tex:`f^{${n}}(${start})=\\square`, blank:ans }]);
    }
    /* table — X={1,…,s} 에서 X 로의 함수를 값으로 준다 */
    const s = pick(rng, [3, 4, 4, 5]);
    const vals = pick(rng, [0, 1]) ? shuffle(rng, Array.from({ length:s }, (_, i) => i + 1))
      : Array.from({ length:s }, () => R(rng, 1, s));
    const k = R(rng, 1, s), n = R(rng, 10, 99);
    const seq = [k]; let x = k; for (let i = 0; i < n; i++) { x = vals[x - 1]; seq.push(x); }
    const ans = seq[n];
    const def = vals.map((v, i) => `f(${i + 1})=${v}`).join(',\\ ');
    const shown = seq.slice(0, Math.min(6, n + 1)).join('\\to ');
    return item(prompt, `${def}\\ \\Rightarrow\\ f^{${n}}(${k})=\\square`, ans, [
      { tex:`${shown}\\to\\cdots` },
      { tex:`f^{${n}}(${k})=\\square`, blank:ans }]);
  }

  /* value(기본) — (f∘g)(a) */
  const quadWho = pick(rng, [0, 1, 2, 2]);
  const F = randF(rng, quadWho === 1), G = randF(rng, quadWho === 2);
  const a = R(rng, -4, 4), kind = pick(rng, ['fg', 'fg', 'gf', 'ff']);
  let inner, outer, lbl, iv;
  if (kind === 'fg') { inner = ['g', G]; outer = ['f', F]; lbl = 'f\\circ g'; }
  else if (kind === 'gf') { inner = ['f', F]; outer = ['g', G]; lbl = 'g\\circ f'; }
  else { inner = ['f', F]; outer = ['f', F]; lbl = 'f\\circ f'; }
  iv = inner[1].f(a);
  const ans = outer[1].f(iv);
  return item(
    L3('(f∘g)(a)=f(g(a)) 입니다. 안쪽 함수의 값을 먼저 구하고, 그 값을 바깥 함수에 넣습니다.',
       '(f∘g)(a)=f(g(a)). Find the value of the inner function first, then put it into the outer function.',
       '(f∘g)(a)=f(g(a))。先求内层函数的值，再代入外层函数。'),
    `f(x)=${F.tex},\\ g(x)=${G.tex}\\ \\Rightarrow\\ (${lbl})(${a})=\\square`, ans, [
      { tex:`${inner[0]}(${a})=${iv}` },
      { tex:`${outer[0]}(${iv})=\\square`, blank:ans }]);
};

/* ── MD129 — 역함수 ── */
function linDef(rng){ return [nz(rng, 1, 5), R(rng, -9, 9)]; }
NM_TGEN['md129_inverse'] = function (params, rng) {
  const mode = params.mode || 'value';
  const prompt = L3('f⁻¹(k)=a 이면 f(a)=k 입니다. 역함수의 식을 구하지 않고 f(a)=k 를 만족하는 a 를 찾습니다.',
    'If f⁻¹(k)=a then f(a)=k. Instead of finding the inverse formula, find the a with f(a)=k.',
    '若f⁻¹(k)=a，则f(a)=k。不必求反函数的式子，找出满足f(a)=k的a。');

  if (mode === 'compose') {
    const prompt2 = L3('(f∘g)⁻¹=g⁻¹∘f⁻¹ 입니다. f⁻¹(k)=a ⇔ f(a)=k 를 써서 안쪽부터 값을 구합니다.',
      '(f∘g)⁻¹=g⁻¹∘f⁻¹. Use f⁻¹(k)=a ⇔ f(a)=k and work from the inside out.',
      '(f∘g)⁻¹=g⁻¹∘f⁻¹。利用f⁻¹(k)=a ⇔ f(a)=k，从内向外求值。');
    for (let g = 0; g < 300; g++) {
      const [p, q] = linDef(rng), s = nz(rng, 1, 4);
      const F = x => p * x + q;
      const kind = pick(rng, ['fgInv', 'finvg', 'gfinv', 'sand']);
      if (kind === 'fgInv') {
        const t = R(rng, -9, 9), x0 = R(rng, -6, 6), G = x => s * x + t, k = F(G(x0));
        if (Math.abs(k) > 99) continue;
        return item(prompt2, `f(x)=${poly([p, q])},\\ g(x)=${poly([s, t])}\\ \\Rightarrow\\ (f\\circ g)^{-1}(${k})=\\square`, x0, [
          { tex:`(f\\circ g)^{-1}(${k})=a\\ \\Leftrightarrow\\ f(g(a))=${k}` },
          { tex:`g(a)=${G(x0)}` },
          { tex:`a=\\square`, blank:x0 }]);
      }
      if (kind === 'gfinv') {
        const t = R(rng, -9, 9), y0 = R(rng, -6, 6), k = F(y0), ans = s * y0 + t;
        if (Math.abs(k) > 60) continue;
        return item(prompt2, `f(x)=${poly([p, q])},\\ g(x)=${poly([s, t])}\\ \\Rightarrow\\ (g\\circ f^{-1})(${k})=\\square`, ans, [
          { tex:`f^{-1}(${k})=${y0}\\ \\Leftarrow\\ f(${y0})=${k}` },
          { tex:`g(${y0})=\\square`, blank:ans }]);
      }
      if (kind === 'finvg') {
        const k0 = R(rng, -6, 6), y0 = R(rng, -6, 6), t = F(y0) - s * k0;
        if (Math.abs(t) > 20) continue;
        return item(prompt2, `f(x)=${poly([p, q])},\\ g(x)=${poly([s, t])}\\ \\Rightarrow\\ (f^{-1}\\circ g)(${k0})=\\square`, y0, [
          { tex:`g(${k0})=${F(y0)}` },
          { tex:`f(a)=${F(y0)}\\ \\Rightarrow\\ a=\\square`, blank:y0 }]);
      }
      /* sand — f∘(g∘f)⁻¹∘f = g⁻¹∘f */
      const k0 = R(rng, -6, 6), z0 = R(rng, -6, 6), t = F(k0) - s * z0;
      if (Math.abs(t) > 20) continue;
      return item(prompt2, `f(x)=${poly([p, q])},\\ g(x)=${poly([s, t])}\\ \\Rightarrow\\ (f\\circ(g\\circ f)^{-1}\\circ f)(${k0})=\\square`, z0, [
        { tex:`f\\circ f^{-1}\\circ g^{-1}\\circ f=g^{-1}\\circ f` },
        { tex:`f(${k0})=${F(k0)},\\ g(a)=${F(k0)}` },
        { tex:`a=\\square`, blank:z0 }]);
    }
  }

  if (mode === 'coef') {
    const kind = pick(rng, ['two', 'formula', 'mixed']);
    const promptC = L3('f⁻¹(k)=a ⇔ f(a)=k 로 바꾸어 f(x)=ax+b 에 대한 식을 세우고 a, b 를 구합니다.',
      'Rewrite f⁻¹(k)=a as f(a)=k, set up equations for f(x)=ax+b, and find a and b.',
      '把f⁻¹(k)=a改写为f(a)=k，列出关于f(x)=ax+b的方程，求a、b。');
    for (let g = 0; g < 300; g++) {
      const a = nz(rng, 1, 5), b = R(rng, -9, 9);
      const F = x => a * x + b;
      if (kind === 'two') {
        const q1 = R(rng, -5, 5), q2 = R(rng, -5, 5);
        if (q1 === q2) continue;
        const p1 = F(q1), p2 = F(q2);
        return item(promptC, `f(x)=ax+b,\\ f^{-1}(${p1})=${q1},\\ f^{-1}(${p2})=${q2}\\ \\Rightarrow\\ a=\\square,\\ b=\\square`, [a, b], [
          { tex:`f(${q1})=${p1},\\ f(${q2})=${p2}` },
          { tex:`${terms([[q1, 'a'], [1, 'b']])}=${p1},\\ ${terms([[q2, 'a'], [1, 'b']])}=${p2}` },
          { tex:`a=\\square,\\ b=\\square`, blank:[a, b] }]);
      }
      if (kind === 'formula') {
        let inv;
        if (a === 1) inv = poly([1, -b]);
        else if (a === -1) inv = poly([-1, b]);
        else if (a > 0) inv = `\\dfrac{${poly([1, -b])}}{${a}}`;
        else inv = `\\dfrac{${terms([[b, ''], [-1, 'x']])}}{${-a}}`;
        return item(
          L3('y=f⁻¹(x) 에서 x 와 y 를 바꾸면 f 의 식이 됩니다. x=f⁻¹(y) 를 y 에 대하여 풀어 f(x)=ax+b 의 a, b 를 구합니다.',
             'Swapping x and y in y=f⁻¹(x) gives f. Solve x=f⁻¹(y) for y to find a and b in f(x)=ax+b.',
             '在y=f⁻¹(x)中交换x与y就得到f。把x=f⁻¹(y)解成关于y的式子，求f(x)=ax+b中的a、b。'),
          `f(x)=ax+b,\\ f^{-1}(x)=${inv}\\ \\Rightarrow\\ a=\\square,\\ b=\\square`, [a, b], [
            { tex:`x=${inv.replace(/x/g, 'y')}` },
            { tex:`y=${poly([a, b])}` },
            { tex:`a=\\square,\\ b=\\square`, blank:[a, b] }]);
      }
      const p = R(rng, -5, 5), q = R(rng, -5, 5);
      if (p === q) continue;
      const bb = p - a * q, r = a * p + bb;
      if (Math.abs(bb) > 20 || Math.abs(r) > 40) continue;
      return item(promptC, `f(x)=ax+b,\\ f(${p})=${r},\\ f^{-1}(${p})=${q}\\ \\Rightarrow\\ a=\\square,\\ b=\\square`, [a, bb], [
        { tex:`f(${p})=${r},\\ f(${q})=${p}` },
        { tex:`${terms([[p, 'a'], [1, 'b']])}=${r},\\ ${terms([[q, 'a'], [1, 'b']])}=${p}` },
        { tex:`a=\\square,\\ b=\\square`, blank:[a, bb] }]);
    }
  }

  /* value(기본) — f⁻¹(k) */
  const kind = pick(rng, ['lin', 'lin', 'quad', 'dbl']);
  if (kind === 'quad') {
    const c = R(rng, -9, 9), x0 = R(rng, 1, 9), k = x0 * x0 + c;
    return item(prompt, `f(x)=${poly([1, 0, c])}\\ (x\\ge 0)\\ \\Rightarrow\\ f^{-1}(${k})=\\square`, x0, [
      { tex:`a^2${more(c, '')}=${k},\\ a\\ge 0` },
      { tex:`a^2=${x0 * x0}\\ \\Rightarrow\\ a=\\square`, blank:x0 }]);
  }
  const [p, q] = linDef(rng);
  if (kind === 'dbl') {
    const x0 = R(rng, -3, 3), y = p * x0 + q, k = p * y + q;
    return item(prompt, `f(x)=${poly([p, q])}\\ \\Rightarrow\\ (f^{-1}\\circ f^{-1})(${k})=\\square`, x0, [
      { tex:`f^{-1}(${k})=${y}\\ \\Leftarrow\\ f(${y})=${k}` },
      { tex:`f^{-1}(${y})=\\square`, blank:x0 }]);
  }
  const x0 = R(rng, -6, 8), k = p * x0 + q;
  return item(prompt, `f(x)=${poly([p, q])}\\ \\Rightarrow\\ f^{-1}(${k})=\\square`, x0, [
    { tex:`f(a)=${k}\\ \\Rightarrow\\ ${terms([[p, 'a'], [q, '']])}=${k}` },
    { tex:`a=\\square`, blank:x0 }]);
};

/* ── MD130 — 유리식의 계산 ── */
function frac(n, d){ return `\\dfrac{${n}}{${d}}`; }
NM_TGEN['md130_ratExpr'] = function (params, rng) {
  const mode = params.mode || 'arith';

  if (mode === 'partial') {
    const prompt = L3('1/(AB)=(1/(B−A))(1/A−1/B) 로 쪼개면 가운데 항이 서로 지워집니다(부분분수). 처음과 끝만 남은 식을 정리합니다. 분수는 기약분수로 씁니다.',
      'Split 1/(AB)=(1/(B−A))(1/A−1/B) and the middle terms cancel (partial fractions). Simplify what remains of the first and last terms; write fractions in lowest terms.',
      '拆成1/(AB)=(1/(B−A))(1/A−1/B)后中间项相互抵消(部分分式)。整理只剩首末两项的式子；分数写成最简分数。');
    if (pick(rng, [0, 1])) {
      const c = R(rng, 1, 4), s = R(rng, 0, 5), d = R(rng, 1, 3), k = R(rng, 3, 6);
      const fk = i => (s + i * d === 0 ? 'x' : `(x+${s + i * d})`);
      const term = i => frac(c, `${fk(i)}${fk(i + 1)}`);
      const lhs = k === 3 ? `${term(0)}+${term(1)}+${term(2)}` : `${term(0)}+${term(1)}+\\cdots+${term(k - 1)}`;
      const A = c * k, B = s + k * d;
      const gg = gcd(c, d), CD = d / gg === 1 ? (c / gg === 1 ? '' : String(c / gg)) : `\\dfrac{${c / gg}}{${d / gg}}`;
      const bare = i => fk(i).replace(/[()]/g, '');
      return item(prompt, `${lhs}=\\dfrac{a}{${fk(0)}(x+b)}\\ \\Rightarrow\\ a=\\square,\\ b=\\square`, [A, B], [
        { tex:`${term(0)}=${CD}\\left(\\dfrac{1}{${bare(0)}}-\\dfrac{1}{${bare(1)}}\\right)` },
        { tex:`${CD}\\left(\\dfrac{1}{${bare(0)}}-\\dfrac{1}{x+${B}}\\right)=\\dfrac{${A}}{${fk(0)}(x+${B})}` },
        { tex:`a=\\square,\\ b=\\square`, blank:[A, B] }]);
    }
    const s = R(rng, 1, 3), d = R(rng, 1, 3), k = R(rng, 4, 12);
    const last = s + k * d, g = gcd(k, s * last), A = k / g, B = s * last / g;
    const term = (x, y) => frac(1, `${x}\\times${y}`);
    return item(prompt,
      `${term(s, s + d)}+${term(s + d, s + 2 * d)}+\\cdots+${term(last - d, last)}=\\dfrac{a}{b}\\ \\Rightarrow\\ a=\\square,\\ b=\\square`, [A, B], [
        { tex:`${d === 1 ? '' : `\\dfrac{1}{${d}}`}\\left(${s === 1 ? '1' : `\\dfrac{1}{${s}}`}-\\dfrac{1}{${last}}\\right)=\\dfrac{${k}}{${s * last}}` }].concat(g > 1 ? [
        { tex:`\\dfrac{${k}}{${s * last}}=\\dfrac{${A}}{${B}}` }] : []).concat([
        { tex:`a=\\square,\\ b=\\square`, blank:[A, B] }]));
  }

  if (mode === 'complex') {
    const kind = pick(rng, ['value', 'value', 'cf', 'xy']);
    const prompt = L3('번분수는 분자와 분모에 같은 식을 곱해 작은 분수를 없애거나, 아래쪽부터 차례로 계산합니다.',
      'For a complex fraction, multiply the numerator and denominator by the same expression to clear the small fractions, or work from the bottom up.',
      '繁分式可以给分子分母同乘一个式子消去小分数，或从下往上依次计算。');
    if (kind === 'cf') {
      const a = R(rng, 1, 5), b = R(rng, 1, 6), c = R(rng, 2, 7);
      const B = b * c + 1, A = a * B + c, ans = a + b + c;
      return item(
        L3('a, b, c 는 자연수이고 c≥2 입니다. 가분수에서 정수 부분을 떼어 내고, 남은 진분수를 뒤집는 일을 되풀이합니다.',
           'a, b, c are natural numbers with c≥2. Take out the whole-number part, flip the remaining proper fraction, and repeat.',
           'a、b、c是自然数且c≥2。取出整数部分，把剩下的真分数倒过来，重复这一过程。'),
        `\\dfrac{${A}}{${B}}=a+\\dfrac{1}{b+\\frac{1}{c}}\\ \\Rightarrow\\ a+b+c=\\square`, ans, [
          { tex:`\\dfrac{${A}}{${B}}=${a}+\\dfrac{${c}}{${B}}=${a}+\\dfrac{1}{\\frac{${B}}{${c}}}` },
          { tex:`\\dfrac{${B}}{${c}}=${b}+\\dfrac{1}{${c}}\\ \\Rightarrow\\ a=${a},\\ b=${b},\\ c=${c}` },
          { tex:`a+b+c=\\square`, blank:ans }]);
    }
    if (kind === 'xy') {
      let x0, y0; do { x0 = nz(rng, 1, 9); y0 = nz(rng, 1, 9); } while (Math.abs(x0) === Math.abs(y0));
      const plus = pick(rng, [0, 1]);
      const ex = plus
        ? `\\dfrac{\\frac{x}{y}-\\frac{y}{x}}{\\frac{1}{y}-\\frac{1}{x}}`
        : `\\dfrac{\\frac{x}{y}-\\frac{y}{x}}{\\frac{1}{y}+\\frac{1}{x}}`;
      const ans = plus ? x0 + y0 : x0 - y0;
      return item(prompt, `x=${x0},\\ y=${y0}\\ \\Rightarrow\\ ${ex}=\\square`, ans, [
        { tex:`${ex}=\\dfrac{x^2-y^2}{${plus ? 'x-y' : 'x+y'}}` },
        { tex:`\\dfrac{x^2-y^2}{${plus ? 'x-y' : 'x+y'}}=${plus ? 'x+y' : 'x-y'}` },
        { tex:`${plus ? `${x0}+${par(y0)}` : `${x0}-${par(y0)}`}=\\square`, blank:ans }]);
    }
    for (let g = 0; g < 400; g++) {
      const x0 = nz(rng, 1, 6), c = R(rng, 1, 5), d = nz(rng, 1, 9), v = nz(rng, 1, 6), a = nz(rng, 1, 6);
      const den = c * x0 - d;
      if (den === 0) continue;
      const b = a * x0 - v * den;
      if (b === 0 || Math.abs(b) > 40) continue;
      const smallF = (n) => (n > 0 ? `-\\frac{${n}}{x}` : `+\\frac{${-n}}{x}`);
      const ex = `\\dfrac{${a}${smallF(b)}}{${c}${smallF(d)}}`;
      return item(prompt, `x=${x0}\\ \\Rightarrow\\ ${ex}=\\square`, v, [
        { tex:`${ex}=\\dfrac{${poly([a, -b])}}{${poly([c, -d])}}` },
        { tex:`\\dfrac{${a * x0 - b}}{${den}}=\\square`, blank:v }]);
    }
  }

  /* arith(기본) — 사칙 후 분자의 계수 */
  const prompt = L3('분모를 통분하거나 인수분해해 약분한 뒤, 오른쪽 식과 계수를 비교해 a, b 를 구합니다.',
    'Bring to a common denominator (or factor and cancel), then compare coefficients with the right-hand side to find a and b.',
    '通分(或因式分解后约分)，再与右边的式子比较系数，求a、b。');
  const kind = pick(rng, ['const', 'const', 'lin', 'mul']);
  for (let g = 0; g < 400; g++) {
    if (kind === 'mul') {
      const rs = shuffle(rng, [-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6]).slice(0, 4);
      const [r1, r2, r3, r4] = rs, div = pick(rng, [0, 1]);
      const N1 = poly([1, -(r1 + r2), r1 * r2]), D1 = poly([1, -(r3 + r4), r3 * r4]);
      const second = div ? frac(xMinus(r2), xMinus(r4)) : frac(xMinus(r4), xMinus(r2));
      const A = -r1, B = -r3;
      return item(prompt,
        `${frac(N1, D1)}${div ? '\\div' : '\\times'}${second}=\\dfrac{x+a}{x+b}\\ \\Rightarrow\\ a=\\square,\\ b=\\square`, [A, B], [
          { tex:`${frac(`${grp(r1)}${grp(r2)}`, `${grp(r3)}${grp(r4)}`)}\\times${frac(xMinus(r4), xMinus(r2))}` },
          { tex:`=${frac(xMinus(r1), xMinus(r3))}` },
          { tex:`a=\\square,\\ b=\\square`, blank:[A, B] }]);
    }
    const p = R(rng, -6, 6), q = R(rng, -6, 6);
    if (p === q) continue;
    const B = R(rng, 1, 6), sub = pick(rng, [0, 1]), sg = sub ? -1 : 1;
    const den = fac2(p, q);
    if (kind === 'lin') {
      const a = -q + sg * B, b = -sg * B * p;
      return item(prompt,
        `\\dfrac{x}{${xMinus(p)}}${sub ? '-' : '+'}\\dfrac{${B}}{${xMinus(q)}}=\\dfrac{x^2+ax+b}{${den}}\\ \\Rightarrow\\ a=\\square,\\ b=\\square`, [a, b], [
          { tex:`\\dfrac{${q === 0 ? 'x^2' : `x${grp(q)}`}${sub ? '-' : '+'}${B}${grp(p)}}{${den}}` },
          { tex:`=\\dfrac{${poly([1, a, b])}}{${den}}` },
          { tex:`a=\\square,\\ b=\\square`, blank:[a, b] }]);
    }
    const A = R(rng, 1, 6);
    const a = A + sg * B, b = -(A * q + sg * B * p);
    if (a === 0) continue;
    return item(prompt,
      `\\dfrac{${A}}{${xMinus(p)}}${sub ? '-' : '+'}\\dfrac{${B}}{${xMinus(q)}}=\\dfrac{ax+b}{${den}}\\ \\Rightarrow\\ a=\\square,\\ b=\\square`, [a, b], [
        { tex:`\\dfrac{${A}${grp(q)}${sub ? '-' : '+'}${B}${grp(p)}}{${den}}` },
        { tex:`=\\dfrac{${poly([a, b])}}{${den}}` },
        { tex:`a=\\square,\\ b=\\square`, blank:[a, b] }]);
  }
};

/* ── MD131 — 유리함수 ── */
/* y = k/(x−p) + q 를 (αx+β)/(cx+δ) 꼴로 */
function stdTex(k, p, q){ return `${k < 0 ? '-' : ''}\\dfrac{${Math.abs(k)}}{${xMinus(p)}}${more(q, '')}`; }
NM_TGEN['md131_ratFunc'] = function (params, rng) {
  const mode = params.mode || 'asym';

  if (mode === 'coef') {
    const prompt = L3('y=k/(x−p)+q 의 정의역은 {x | x≠p}, 치역은 {y | y≠q} 이고 점근선은 x=p, y=q 입니다. 조건에 맞게 a, b 를 구합니다.',
      'y=k/(x−p)+q has domain {x | x≠p}, range {y | y≠q}, and asymptotes x=p, y=q. Find a and b to fit the conditions.',
      'y=k/(x−p)+q的定义域为{x | x≠p}，值域为{y | y≠q}，渐近线为x=p、y=q。按条件求a、b。');
    for (let g = 0; g < 400; g++) {
      if (pick(rng, [0, 1])) {
        const p = nz(rng, 1, 6), q = nz(rng, 1, 6), beta = R(rng, -9, 9);
        const a = q, b = -p;
        if (a * b === beta) continue;
        return item(prompt, `y=\\dfrac{ax${more(beta, '')}}{x+b}:\\ x\\ne ${p},\\ y\\ne ${q}\\ \\Rightarrow\\ a=\\square,\\ b=\\square`, [a, b], [
          { tex:`x+b=0\\ \\Rightarrow\\ x=-b=${p}` },
          { tex:`y\\ne\\dfrac{a}{1}\\ \\Rightarrow\\ a=${q}` },
          { tex:`a=\\square,\\ b=\\square`, blank:[a, b] }]);
      }
      const p = R(rng, -5, 5), a = nz(rng, 1, 5), k = pick(rng, [2, 3, 4, 6, 8, 12]) * pick(rng, [1, -1]);
      const ds = divisors(Math.abs(k)).flatMap(d => [d, -d]);
      const [d1, d2] = shuffle(rng, ds).slice(0, 2);
      const b = k - a * p;
      if (Math.abs(b) > 30) continue;
      const x1 = p + d1, x2 = p + d2, y1 = a + k / d1, y2 = a + k / d2;
      const [X1, Y1, X2, Y2] = x1 < x2 ? [x1, y1, x2, y2] : [x2, y2, x1, y1];
      return item(prompt, `f(x)=\\dfrac{ax+b}{${xMinus(p)}},\\ f(${X1})=${Y1},\\ f(${X2})=${Y2}\\ \\Rightarrow\\ a=\\square,\\ b=\\square`, [a, b], [
        { tex:`${terms([[X1, 'a'], [1, 'b']])}=${Y1 * (X1 - p)},\\ ${terms([[X2, 'a'], [1, 'b']])}=${Y2 * (X2 - p)}` },
        { tex:`${terms([[X2 - X1, 'a']])}=${Y2 * (X2 - p) - Y1 * (X1 - p)}` },
        { tex:`a=\\square,\\ b=\\square`, blank:[a, b] }]);
    }
  }

  if (mode === 'range') {
    for (let g = 0; g < 400; g++) {
      const k = nz(rng, 1, 12), p = R(rng, -5, 5), q = R(rng, -6, 6);
      const ds = divisors(Math.abs(k));
      if (ds.length < 2) continue;
      const [e1, e2] = shuffle(rng, ds).slice(0, 2).sort((x, y) => x - y);
      const side = pick(rng, [1, -1]);
      const d1 = side > 0 ? e1 : -e2, d2 = side > 0 ? e2 : -e1;
      const x1 = p + d1, x2 = p + d2, y1 = q + k / d1, y2 = q + k / d2;
      const M = Math.max(y1, y2), m = Math.min(y1, y2);
      const std = pick(rng, [0, 1, 1]) === 0;
      const ex = std ? stdTex(k, p, q) : frac(poly([q, k - q * p]), xMinus(p));
      return item(
        L3('정의역이 점근선의 한쪽에 있으면 그래프는 그 범위에서 계속 증가하거나 계속 감소합니다. 양 끝의 함숫값에서 최댓값 M, 최솟값 m 이 나옵니다.',
           'When the domain lies on one side of the asymptote, the graph keeps increasing or keeps decreasing there, so the greatest value M and least value m occur at the two ends.',
           '定义域在渐近线一侧时，图像在该范围内一直递增或一直递减，最大值M与最小值m出现在两端。'),
        `y=${ex}\\ (${x1}\\le x\\le ${x2})\\ \\Rightarrow\\ M=\\square,\\ m=\\square`, [M, m], (std ? [] : [
          { tex:`y=${stdTex(k, p, q)}` }]).concat([
          { tex:`x=${x1}\\ \\Rightarrow\\ y=${y1},\\ x=${x2}\\ \\Rightarrow\\ y=${y2}` },
          { tex:`M=\\square,\\ m=\\square`, blank:[M, m] }]));
    }
  }

  /* asym(기본) — 점근선 */
  const prompt = L3('y=k/(x−p)+q 꼴로 바꾸면 점근선은 x=p, y=q 입니다. (ax+b)/(cx+d) 꼴에서는 분모가 0 이 되는 x 와 최고차항 계수의 비 a/c 가 점근선입니다.',
    'Rewritten as y=k/(x−p)+q, the asymptotes are x=p and y=q. For (ax+b)/(cx+d), they are the x that makes the denominator 0 and the ratio a/c of leading coefficients.',
    '化成y=k/(x−p)+q后，渐近线为x=p、y=q。对(ax+b)/(cx+d)，渐近线是使分母为0的x以及最高次项系数之比a/c。');
  const p = R(rng, -6, 6), q = R(rng, -6, 6);
  if (pick(rng, [0, 1, 1]) === 0) {
    const k = nz(rng, 1, 9);
    return item(prompt, `y=${stdTex(k, p, q)}\\ \\Rightarrow\\ x=\\square,\\ y=\\square`, [p, q], [
      { tex:`${xMinus(p)}=0\\ \\Rightarrow\\ x=${p}` },
      { tex:`x=\\square,\\ y=\\square`, blank:[p, q] }]);
  }
  let beta, c;
  do { c = pick(rng, [1, 1, 2, 3, -1, -2]); beta = R(rng, -9, 9); } while (beta + c * q * p === 0);
  const num = poly([c * q, beta]), den = poly([c, -c * p]);
  return item(prompt, `y=\\dfrac{${num}}{${den}}\\ \\Rightarrow\\ x=\\square,\\ y=\\square`, [p, q], [
    { tex:`${den}=0\\ \\Rightarrow\\ x=${p}` },
    { tex:`\\dfrac{${c * q}}{${c}}=${q}` },
    { tex:`x=\\square,\\ y=\\square`, blank:[p, q] }]);
};

/* ── MD132 — 무리식의 계산 ── */
const NONSQ = [2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 17, 18, 19, 20, 21, 22, 23, 24];
const SYMP = [];
for (let a = 3; a <= 30; a++) for (let b = 2; b < a; b++)
  if (!isSq(a) && !isSq(b) && (2 * (a + b)) % (a - b) === 0) SYMP.push([a, b]);
function rootTxt(lin){ return lin === 'x' ? '√x' : `√(${lin})`; }
NM_TGEN['md132_radExpr'] = function (params, rng) {
  const mode = params.mode || 'real';

  if (mode === 'ration') {
    const kind = pick(rng, ['tele', 'func', 'sym']);
    const prompt = L3('분모의 유리화: 1/(√A+√B)=(√B−√A)/(B−A) 입니다. 더하는 식은 가운데 항이 서로 지워지고 처음과 끝만 남습니다.',
      'Rationalize: 1/(√A+√B)=(√B−√A)/(B−A). In a sum, the middle terms cancel and only the first and last remain.',
      '分母有理化：1/(√A+√B)=(√B−√A)/(B−A)。求和时中间项相互抵消，只剩首末两项。');
    if (kind === 'sym') {
      const [a, b] = pick(rng, SYMP), ans = 2 * (a + b) / (a - b);
      return item(prompt,
        `\\dfrac{\\sqrt{${a}}+\\sqrt{${b}}}{\\sqrt{${a}}-\\sqrt{${b}}}+\\dfrac{\\sqrt{${a}}-\\sqrt{${b}}}{\\sqrt{${a}}+\\sqrt{${b}}}=\\square`, ans, [
          { tex:`\\dfrac{(\\sqrt{${a}}+\\sqrt{${b}})^2+(\\sqrt{${a}}-\\sqrt{${b}})^2}{${a}-${b}}` },
          { tex:`\\dfrac{2(${a}+${b})}{${a - b}}=\\square`, blank:ans }]);
    }
    for (let g = 0; g < 400; g++) {
      const d = pick(rng, [1, 1, 2, 3]), uu = R(rng, 1, 6), vv = R(rng, uu + 1, 12);
      if ((vv * vv - uu * uu) % d !== 0 || (vv * vv - uu * uu) / d < 4 || vv * vv > 150) continue;
      const lo = uu * uu, hi = vv * vv;
      if (kind === 'func') {
        const ans = vv - uu;
        return item(prompt,
          `f(x)=\\dfrac{${d}}{\\sqrt{x+${d}}+\\sqrt{x}}\\ \\Rightarrow\\ f(${lo})+f(${lo + d})+\\cdots+f(${hi - d})=\\square`, ans, [
            { tex:`f(x)=\\sqrt{x+${d}}-\\sqrt{x}` },
            { tex:`\\sqrt{${hi}}-\\sqrt{${lo}}=\\square`, blank:ans }]);
      }
      /* 분자 c=d×w — 한 항이 w(√(x+d)−√x) 가 되어 합은 w(v−u) */
      const w = R(rng, 1, 3), c = d * w, val = w * (vv - uu);
      const t = (x) => `\\dfrac{${c}}{\\sqrt{${x}}+\\sqrt{${x + d}}}`;
      const W = w === 1 ? '' : String(w);
      return item(prompt, `${t(lo)}+${t(lo + d)}+\\cdots+${t(hi - d)}=\\square`, val, [
        { tex:`${t(lo)}=${W}(\\sqrt{${lo + d}}-\\sqrt{${lo}})` },
        { tex:`${W}(\\sqrt{${hi}}-\\sqrt{${lo}})=\\square`, blank:val }]);
    }
  }

  if (mode === 'value') {
    const kind = pick(rng, ['sym', 'sym', 'quad', 'recip']);
    const prompt = L3('x, y 를 바로 넣지 말고 x+y, xy(또는 x−y) 를 먼저 구해 곱셈공식의 변형으로 계산합니다.',
      'Do not substitute directly: find x+y and xy (or x−y) first, then use the rearranged product formulas.',
      '不要直接代入：先求x+y与xy(或x−y)，再用乘法公式的变形计算。');
    if (kind === 'quad') {
      const n = nz(rng, 1, 5), m = pick(rng, NONSQ.slice(0, 12)), c = R(rng, -9, 9), ans = m - n * n + c;
      return item(prompt, `x=${n}+\\sqrt{${m}}\\ \\Rightarrow\\ x^2${more(-2 * n, 'x')}${more(c, '')}=\\square`, ans, [
        { tex:`x${more(-n, '')}=\\sqrt{${m}}\\ \\Rightarrow\\ x^2${more(-2 * n, 'x')}${more(n * n, '')}=${m}` },
        { tex:`x^2${more(-2 * n, 'x')}=${m - n * n}` },
        { tex:`${m - n * n}${more(c, '')}=\\square`, blank:ans }]);
    }
    if (kind === 'recip') {
      const [a, b] = pick(rng, SYMP), S = 2 * (a + b) / (a - b);
      const two = pick(rng, [0, 1]), ans = two ? S * S - 2 : S * S - 1;
      const x = `\\dfrac{\\sqrt{${a}}+\\sqrt{${b}}}{\\sqrt{${a}}-\\sqrt{${b}}}`, y = `\\dfrac{\\sqrt{${a}}-\\sqrt{${b}}}{\\sqrt{${a}}+\\sqrt{${b}}}`;
      const ask = two ? 'x^2+y^2' : 'x^2+xy+y^2';
      return item(prompt, `x=${x},\\ y=${y}\\ \\Rightarrow\\ ${ask}=\\square`, ans, [
        { tex:`x+y=\\dfrac{2(${a}+${b})}{${a - b}}=${S},\\ xy=1` },
        { tex:`${ask}=(x+y)^2-${two ? 2 : 1}xy`.replace('-1xy', '-xy') },
        { tex:`${S}^2-${two ? 2 : 1}=\\square`, blank:ans }]);
    }
    for (let g = 0; g < 400; g++) {
      const a = pick(rng, NONSQ), b = pick(rng, NONSQ);
      if (b >= a) continue;
      const asks = [['x^2+y^2', 2 * (a + b), `(x+y)^2-2xy=(2\\sqrt{${a}})^2-2\\times${a - b}`],
                    ['xy', a - b, `(\\sqrt{${a}})^2-(\\sqrt{${b}})^2`],
                    ['(x-y)^2', 4 * b, `(2\\sqrt{${b}})^2`],
                    ['(x+y)^2', 4 * a, `(2\\sqrt{${a}})^2`]];
      if ((2 * (a + b)) % (a - b) === 0) asks.push(['\\dfrac{y}{x}+\\dfrac{x}{y}', 2 * (a + b) / (a - b), `\\dfrac{x^2+y^2}{xy}=\\dfrac{${2 * (a + b)}}{${a - b}}`]);
      if (isSq(a * b)) asks.push(['x^2-y^2', 4 * Math.round(Math.sqrt(a * b)), `(x+y)(x-y)=2\\sqrt{${a}}\\times2\\sqrt{${b}}`]);
      const [ask, ans, st] = pick(rng, asks);
      return item(prompt, `x=\\sqrt{${a}}+\\sqrt{${b}},\\ y=\\sqrt{${a}}-\\sqrt{${b}}\\ \\Rightarrow\\ ${ask}=\\square`, ans, [
        { tex:`x+y=2\\sqrt{${a}},\\ x-y=2\\sqrt{${b}},\\ xy=${a - b}` },
        { tex:`${ask}=${st}` },
        { tex:`${ask}=\\square`, blank:ans }]);
    }
  }

  /* real(기본, 문장제) — 식의 값이 실수가 되는 정수 x 의 개수 */
  const a = R(rng, -6, 5), b = a + R(rng, 2, 12), k = pick(rng, [1, 1, 1, 2, 3]);
  const kind = pick(rng, ['two', 'two', 'fracR', 'fracL', 'hole']);
  const inA = pTerms([[k, 'x'], [-k * a, '']]), inB = pTerms([[b, ''], [-1, 'x']]);
  let ex, cnt, st1, st2;
  if (kind === 'fracR') { ex = `${rootTxt(inA)} + 1/${rootTxt(inB)}`; cnt = b - a; st1 = `${poly([k, -k * a])}\\ge 0,\\ ${terms([[b, ''], [-1, 'x']])}>0`; st2 = `${a}\\le x<${b}`; }
  else if (kind === 'fracL') { ex = `1/${rootTxt(inA)} + ${rootTxt(inB)}`; cnt = b - a; st1 = `${poly([k, -k * a])}>0,\\ ${terms([[b, ''], [-1, 'x']])}\\ge 0`; st2 = `${a}<x\\le ${b}`; }
  else if (kind === 'hole') {
    const h = R(rng, a + 1, b - 1);
    ex = `${rootTxt(inA)} + ${rootTxt(inB)} + 1/(${pTerms([[1, 'x'], [-h, '']])})`; cnt = b - a;
    st1 = `${poly([k, -k * a])}\\ge 0,\\ ${terms([[b, ''], [-1, 'x']])}\\ge 0,\\ x\\ne ${h}`; st2 = `${a}\\le x\\le ${b},\\ x\\ne ${h}`;
  } else { ex = `${rootTxt(inA)} + ${rootTxt(inB)}`; cnt = b - a + 1; st1 = `${poly([k, -k * a])}\\ge 0,\\ ${terms([[b, ''], [-1, 'x']])}\\ge 0`; st2 = `${a}\\le x\\le ${b}`; }
  return word(
    L3(`식 ${ex} 가 있습니다.`, `Consider the expression ${ex}.`, `有式子${ex}。`),
    L3('값이 실수가 되는 정수 x 의 개수를 구합니다.',
       'How many integers x make it a real number?',
       '使其值为实数的整数x有多少个？'),
    cnt, [
      { tex:st1 },
      { tex:st2 },
      { tex:`\\square`, blank:cnt }]);
};

/* ── MD133 — 무리함수 ── */
NM_TGEN['md133_radFunc'] = function (params, rng) {
  const mode = params.mode || 'domain';
  const sq = (sg, rad) => `${sg < 0 ? '-' : ''}\\sqrt{${rad}}`;
  /* 근호 안 a(x−p) — a<0 이면 상수항을 앞에 */
  const radT = (a, p) => a > 0 ? poly([a, -a * p]) : (p === 0 ? lead(a, 'x') : terms([[-a * p, ''], [a, 'x']]));

  if (mode === 'shift') {
    const a = nz(rng, 1, 4), sg = pick(rng, [1, 1, -1]), m = nz(rng, 1, 6), n = nz(rng, 1, 6);
    const base = `y=${sq(sg, lead(a, 'x'))}`;
    const prompt = L3('y=√(ax) 의 그래프를 x축 방향으로 m 만큼, y축 방향으로 n 만큼 평행이동하면 y=√(a(x−m))+n 입니다. 화살표 위의 (m, n) 이 평행이동한 양입니다.',
      'Translating y=√(ax) by m along the x-axis and n along the y-axis gives y=√(a(x−m))+n. The pair (m, n) over the arrow is the translation.',
      '把y=√(ax)的图像沿x轴方向平移m、沿y轴方向平移n，得到y=√(a(x−m))+n。箭头上的(m, n)就是平移量。');
    if (pick(rng, [0, 1])) {
      return item(prompt, `${base}\\ \\xrightarrow{(m,\\,n)}\\ y=${sq(sg, radT(a, m))}${more(n, '')}\\ \\Rightarrow\\ m=\\square,\\ n=\\square`, [m, n], [
        { tex:`y=${sq(sg, `${a === 1 ? '' : a === -1 ? '-' : a}${grp(m)}`)}${more(n, '')}` },
        { tex:`m=\\square,\\ n=\\square`, blank:[m, n] }]);
    }
    const b = -a * m;
    return item(prompt, `${base}\\ \\xrightarrow{(${m},\\,${n})}\\ y=${sq(sg, `${lead(a, 'x')}+b`)}+c\\ \\Rightarrow\\ b=\\square,\\ c=\\square`, [b, n], [
      { tex:`y=${sq(sg, `${a === 1 ? '' : a === -1 ? '-' : a}${grp(m)}`)}${more(n, '')}` },
      { tex:`y=${sq(sg, poly([a, b]))}${more(n, '')}` },
      { tex:`b=\\square,\\ c=\\square`, blank:[b, n] }]);
  }

  if (mode === 'meet') {
    const p = R(rng, -5, 5), q = R(rng, -5, 5), k0 = q - p;
    const coefType = pick(rng, [0, 1]);
    let e, curveUp, curveDn;
    if (coefType) {
      const t = pick(rng, [2, 2, 4]); e = t * t / 4;
      curveUp = `${t}\\sqrt{${xMinus(p)}}${more(q, '')}`;
      curveDn = `-${t}\\sqrt{${p === 0 ? '-x' : terms([[p, ''], [-1, 'x']])}}${more(q, '')}`;
    } else {
      const s = R(rng, 1, 3); e = s;
      curveUp = `\\sqrt{${poly([4 * s, -4 * s * p])}}${more(q, '')}`;
      curveDn = `-\\sqrt{${p === 0 ? lead(-4 * s, 'x') : terms([[4 * s * p, ''], [-4 * s, 'x']])}}${more(q, '')}`;
    }
    const prompt = L3('무리함수의 그래프와 직선 y=x+k 가 서로 다른 두 점에서 만나는 k 의 범위를 구합니다. 직선이 그래프의 끝점을 지날 때와 그래프에 접할 때가 경계입니다.',
      'Find the range of k for which the line y=x+k meets the graph of the radical function at two different points. The boundaries are when the line passes through the endpoint and when it is tangent.',
      '求直线y=x+k与无理函数的图像交于两个不同点时k的范围。边界是直线经过图像端点时和与图像相切时。');
    if (pick(rng, [1, 1, 0])) {
      const ans = [k0, k0 + e];
      return item(prompt, `y=${curveUp},\\ y=x+k\\ \\Rightarrow\\ \\square\\le k<\\square`, ans, [
        { tex:`(${p},${q})\\ \\Rightarrow\\ k=${q}-${par(p)}=${k0}` },
        { tex:`D=0\\ \\Rightarrow\\ k=${k0 + e}` },
        { tex:`\\square\\le k<\\square`, blank:ans }]);
    }
    const ans = [k0 - e, k0];
    return item(prompt, `y=${curveDn},\\ y=x+k\\ \\Rightarrow\\ \\square<k\\le\\square`, ans, [
      { tex:`(${p},${q})\\ \\Rightarrow\\ k=${q}-${par(p)}=${k0}` },
      { tex:`D=0\\ \\Rightarrow\\ k=${k0 - e}` },
      { tex:`\\square<k\\le\\square`, blank:ans }]);
  }

  /* domain(기본) — 정의역·치역의 끝값 */
  const a = nz(rng, 1, 4), p = R(rng, -6, 6), c = R(rng, -6, 6), sg = pick(rng, [1, 1, -1]);
  const rad = radT(a, p);
  const ex = `y=${sq(sg, rad)}${more(c, '')}`;
  const prompt = L3('근호 안이 0 이상이 되는 x 의 범위가 정의역입니다. √ 의 값은 0 이상이므로 치역은 y≥q(√ 앞이 −이면 y≤q) 꼴입니다.',
    'The domain is where the radicand is at least 0. Since a square root is at least 0, the range has the form y≥q (or y≤q if there is a minus sign in front of √).',
    '根号内不小于0的x的范围是定义域。因为√的值不小于0，值域形如y≥q(√前为负号时y≤q)。');
  if (pick(rng, [1, 1, 1, 0, 0]) === 1) {
    const rel = a > 0 ? '\\ge ' : '\\le ';
    return item(prompt, `${ex}\\ \\Rightarrow\\ x${rel}\\square`, p, [
      { tex:`${rad}\\ge 0` },
      { tex:`x${rel}\\square`, blank:p }]);
  }
  const rel = sg > 0 ? '\\ge ' : '\\le ';
  return item(prompt, `${ex}\\ \\Rightarrow\\ y${rel}\\square`, c, [
    { tex:`${sq(sg, rad)}${sg > 0 ? '\\ge ' : '\\le '}0` },
    { tex:`y${rel}\\square`, blank:c }]);
};

if (typeof module !== 'undefined' && module.exports) module.exports = NM_TGEN;
})();
