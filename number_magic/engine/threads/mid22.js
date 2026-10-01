/* ============================================================
   Numbers of Magic — MD144~MD153 대수 새 유형 생성기 2차 (2026-09-29)
   근거: docs/high-build-spec.md (대수 새 유형 목록 뒤 10개).
   교재(교과연산 L)는 챕터 제목만 근거로 쓰고, 문제는 전부 새로 만든다.

   MD144 삼각방정식·부등식            count · sum · quad
   MD145 삼각형·사각형의 넓이          sas · heron · quad
   MD146 Sₙ 과 aₙ 의 관계             an · a1 · judge
   MD147 등차수열의 합의 최대·최소      sign · max · cond
   MD148 원리합계(문장제)              save · pay · compare
   MD149 여러 가지 수열의 합           frac · root · ag
   MD150 군수열                       group · pos · gsum
   MD151 수열의 귀납적 정의             arith · geo · two
   MD152 점화식                       add · mul · term
   MD153 수학적 귀납법(빈칸)            base · step · coef

   계약: NM_TGEN[gen](params, rng), Math.random 금지. 답은 정수.
   **답을 먼저 고르고 식을 역산한다.** 삼각방정식의 해는 15° 의 배수만 나오게 특수각 값으로만 만들고,
   원리합계는 문제에 준 거듭제곱 값(소수 둘째 자리, 반올림이 경계에서 먼 것만)으로 계산해 정수가 되게
   금액을 고른다. 여러 가지 수열의 합은 약분한 값의 분모를 보여 주고 분자를 묻는다.
   인쇄물은 tex 만 싣는다 — 그래서 tex 만 보고도 무엇을 구하는지 알 수 있게 쓰고,
   N·S·M·m·g·h·T 같은 기호는 레벨 지시문에서 정의한다. 풀이 마지막 단계의 blank = 답.
   문제 줄은 \frac·\bigl(\bigr) 만 쓴다(\dfrac·\left 는 인쇄 칸을 넘친 적이 있다).
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
function terms(list){
  let s = '';
  list.forEach(([c, v]) => { if(c === 0) return; s += s ? more(c, v) : lead(c, v); });
  return s || '0';
}
function item(prompt, tex, answer, solution, extra){
  const p = { prompt, tex, answer, answerType:'number', widget:'numpad', negative: hasNeg(answer), solution };
  return Object.assign(p, extra || {});
}
/* 문장제 — MD122·MD140 과 같은 모양(word·wordAsk 가 있으면 인쇄는 글로 싣는다) */
function word(story, ask, answer, solution){
  const prompt = {};
  ['ko', 'en', 'zh'].forEach(l => { prompt[l] = story[l] + ' ' + ask[l]; });
  const p = item(prompt, `\\square`, answer, solution);
  p.word = story; p.wordAsk = ask;
  return p;
}
function gcd(a, b){ a = Math.abs(a); b = Math.abs(b); while(b){ [a, b] = [b, a % b]; } return a; }
function mod(a, n){ return ((a % n) + n) % n; }
function fracTex(p, q){
  const g = gcd(p, q) || 1; p /= g; q /= g;
  if(q < 0){ p = -p; q = -q; }
  if(q === 1) return String(p);
  return `${p < 0 ? '-' : ''}\\frac{${Math.abs(p)}}{${q}}`;
}
function radTex(p, q){
  if(p === 0) return '0';
  const g = gcd(p, q) || 1; p /= g; q /= g;
  const sg = p < 0 ? '-' : '', a = Math.abs(p);
  if(q === 1) return a === 1 ? `${sg}\\pi` : `${sg}${a}\\pi`;
  return a === 1 ? `${sg}\\frac{\\pi}{${q}}` : `${sg}\\frac{${a}}{${q}}\\pi`;
}
function sumOf(a){ return a.reduce((s, v) => s + v, 0); }

/* ── MD144 — 삼각방정식·부등식 ── */
const TRIG = {
  sin: t => Math.sin(t * Math.PI / 180),
  cos: t => Math.cos(t * Math.PI / 180),
  tan: t => Math.tan(t * Math.PI / 180)
};
/* 값 코드 → [수, tex] */
const TV = {
  zero:[0, '0'], one:[1, '1'], h:[0.5, '\\frac{1}{2}'], r2:[Math.SQRT1_2, '\\frac{\\sqrt{2}}{2}'], r3:[Math.sqrt(3) / 2, '\\frac{\\sqrt{3}}{2}'],
  t1:[1, '1'], tr3:[Math.sqrt(3), '\\sqrt{3}'], ti3:[1 / Math.sqrt(3), '\\frac{\\sqrt{3}}{3}']
};
function tvTex(code, s){ return code === 'zero' ? '0' : (s < 0 ? '-' : '') + TV[code][1]; }
function fArg(f, b){ return `\\${f} ${b === 1 ? '' : b}x`; }
/* F 의 계수는 언제나 양수 — 그래서 = 을 부등호로 바꿔도 같은 부등식이다 */
function eqTex(rng, F, code, s){
  const sg = s < 0 ? '-' : '', op = s < 0 ? '+' : '-';
  switch(code){
    case 'zero': return `${F}=0`;
    case 'one': case 't1': return pick(rng, [`${F}=${sg}1`, `${F}${op}1=0`]);
    case 'h': return pick(rng, [`2${F}=${sg}1`, `2${F}${op}1=0`]);
    case 'r2': return pick(rng, [`\\sqrt{2}${F}=${sg}1`, `\\sqrt{2}${F}${op}1=0`, `2${F}=${sg}\\sqrt{2}`]);
    case 'r3': return pick(rng, [`2${F}=${sg}\\sqrt{3}`, `2${F}${op}\\sqrt{3}=0`]);
    case 'tr3': return pick(rng, [`${F}=${sg}\\sqrt{3}`, `${F}${op}\\sqrt{3}=0`]);
    default: return pick(rng, [`\\sqrt{3}${F}=${sg}1`, `\\sqrt{3}${F}${op}1=0`, `3${F}=${sg}\\sqrt{3}`]);   /* ti3 */
  }
}
/* 구간 [lo, hi](도) 안에서 f(bx)=v 의 해 x(도) — bx 는 15° 의 배수만 본다 */
function trigSols(f, b, v, I){
  const out = [];
  for(let t = b * I.lo; t <= b * I.hi; t += 15){
    const x = t / b;
    if((x === I.lo && !I.loIn) || (x === I.hi && !I.hiIn)) continue;
    const m = mod(t, 360);
    if(f === 'tan' && (m === 90 || m === 270)) continue;
    if(Math.abs(TRIG[f](m) - v) < 1e-9) out.push(x);
  }
  return out;
}
const RAD_I = [
  { tex:'0\\le x<2\\pi', lo:0, hi:360, loIn:1, hiIn:0 },
  { tex:'0\\le x\\le2\\pi', lo:0, hi:360, loIn:1, hiIn:1 },
  { tex:'0<x<2\\pi', lo:0, hi:360, loIn:0, hiIn:0 },
  { tex:'0\\le x<\\pi', lo:0, hi:180, loIn:1, hiIn:0 },
  { tex:'0\\le x\\le\\pi', lo:0, hi:180, loIn:1, hiIn:1 },
  { tex:'-\\pi<x\\le\\pi', lo:-180, hi:180, loIn:0, hiIn:1 }
];
const DEG_I = [
  { tex:'0^\\circ\\le x<360^\\circ', lo:0, hi:360, loIn:1, hiIn:0 },
  { tex:'0^\\circ\\le x\\le360^\\circ', lo:0, hi:360, loIn:1, hiIn:1 },
  { tex:'0^\\circ\\le x<180^\\circ', lo:0, hi:180, loIn:1, hiIn:0 }
];
function pickTrigEq(rng, fns){
  const f = pick(rng, fns);
  if(f === 'tan') return { f, code: pick(rng, ['t1', 'tr3', 'ti3', 't1', 'tr3', 'ti3', 'zero']), s: pick(rng, [1, -1]) };
  return { f, code: pick(rng, ['h', 'r2', 'r3', 'h', 'r2', 'r3', 'one', 'zero']), s: pick(rng, [1, -1]) };
}
function listRad(xs){ return xs.map(d => radTex(d, 180)).join(',\\ '); }
function listDeg(xs){ return xs.map(d => `${d}^\\circ`).join(',\\ '); }
NM_TGEN['md144_trigEq'] = function (params, rng) {
  const mode = params.mode || 'count';

  if (mode === 'sum') {
    const prompt = L3('방정식은 모든 해의 합을 S 라 합니다. 부등식의 해가 α<x<β(또는 α≤x≤β) 꼴이면 그 α, β 를 씁니다. 각은 도(°)로 답합니다.',
      'For an equation, let S be the sum of all its solutions. When an inequality has solutions α<x<β (or α≤x≤β), use those α and β. Answer angles in degrees (°).',
      '方程的所有解之和记为S。不等式的解为α<x<β(或α≤x≤β)的形式时，用这个α、β。角用度(°)作答。');
    for (let g = 0; g < 400; g++) {
      if (pick(rng, [0, 0, 1])) {
        /* 부등식 — 해가 한 구간이 되는 것만 */
        const f = pick(rng, ['sin', 'cos']), code = pick(rng, ['h', 'r2', 'r3', 'zero']);
        let s, rel, al, be;
        const th = f === 'sin' ? { h:30, r2:45, r3:60, zero:0 }[code] : { h:60, r2:45, r3:30, zero:90 }[code];
        if (f === 'sin') {
          if (code === 'zero') { const k = pick(rng, ['>', '\\ge', '<']); s = 1; rel = k; [al, be] = k === '<' ? [180, 360] : [0, 180]; }
          else if (pick(rng, [0, 1])) { s = 1; rel = pick(rng, ['>', '\\ge']); al = th; be = 180 - th; }
          else { s = -1; rel = pick(rng, ['<', '\\le']); al = 180 + th; be = 360 - th; }
        } else {
          s = code === 'zero' ? 1 : pick(rng, [1, -1]); rel = pick(rng, ['<', '\\le']);
          const a0 = s > 0 ? th : 180 - th; al = a0; be = 360 - a0;
        }
        const closed = rel === '\\ge' || rel === '\\le';
        const ineq = eqTex(rng, fArg(f, 1), code, s).replace('=', rel);
        const iv = closed ? `\\alpha\\le x\\le\\beta` : `\\alpha<x<\\beta`;
        const askSum = pick(rng, [0, 1]), ans = askSum ? al + be : be - al;
        return item(prompt, `${ineq}\\ (0^\\circ\\le x<360^\\circ)\\ \\Rightarrow\\ ${iv},\\ ${askSum ? '\\alpha+\\beta' : '\\beta-\\alpha'}=\\square^\\circ`, ans, [
          { tex:`\\${f} x${rel}${tvTex(code, s)}` },
          { tex: closed ? `${al}^\\circ\\le x\\le${be}^\\circ` : `${al}^\\circ<x<${be}^\\circ` },
          { tex:`${askSum ? '\\alpha+\\beta' : '\\beta-\\alpha'}=\\square^\\circ`, blank:ans }]);
      }
      const E = pickTrigEq(rng, ['sin', 'cos', 'tan']), b = pick(rng, [1, 1, 2, 3]), I = pick(rng, DEG_I);
      const xs = trigSols(E.f, b, E.s * TV[E.code][0], I), S = sumOf(xs);
      if (!xs.length || S <= 0 || S !== Math.round(S) || xs.length > 8) continue;
      return item(prompt, `${eqTex(rng, fArg(E.f, b), E.code, E.s)}\\ (${I.tex})\\ \\Rightarrow\\ S=\\square^\\circ`, S, [
        { tex:`${fArg(E.f, b)}=${tvTex(E.code, E.s)}` },
        { tex:`x=${listDeg(xs)}` },
        { tex:`S=\\square^\\circ`, blank:S }]);
    }
  }

  if (mode === 'quad') {
    const prompt = L3('f(x) 에 대한 이차방정식으로 보고 인수분해합니다. sin²x+cos²x=1 로 한 가지 함수로 모으고, −1≤sin x≤1, −1≤cos x≤1 을 벗어난 근은 버립니다. N 은 해의 개수, S 는 모든 해의 합(도)입니다.',
      'Treat it as a quadratic in the trig function and factor it. Use sin²x+cos²x=1 to write it in one function, and discard roots outside −1≤sin x≤1, −1≤cos x≤1. N is the number of solutions and S the sum of all solutions (in degrees).',
      '把它看作关于三角函数的二次方程并因式分解。用sin²x+cos²x=1化成一种函数，舍去超出−1≤sin x≤1、−1≤cos x≤1的根。N是解的个数，S是所有解之和(度)。');
    for (let g = 0; g < 400; g++) {
      const kind = pick(rng, ['same', 'same', 'conv', 'conv', 'tan']);
      let tex, f, roots, fac;
      if (kind === 'tan') {
        f = 'tan';
        const t = pick(rng, [[1, 3, 'tr3'], [3, 1, 'ti3'], [1, 1, 't1']]);
        tex = `${t[0] === 1 ? '' : t[0]}\\tan^2x=${t[1]}`;
        roots = [[t[2], 1], [t[2], -1]];
        fac = `\\tan x=\\pm${TV[t[2]][1]}`;
      } else {
        let p, q;
        do { p = R(rng, -4, 4); q = R(rng, -4, 4); } while (p >= q || (Math.abs(p) > 2 && Math.abs(q) > 2));
        f = pick(rng, ['sin', 'cos']);
        const o = f === 'sin' ? 'cos' : 'sin';
        if (kind === 'same') {
          let A = 4, B = -2 * (p + q), C = p * q; const gg = gcd(gcd(A, B), C); A /= gg; B /= gg; C /= gg;
          tex = `${terms([[A, `\\${f}^2x`], [B, `\\${f} x`], [C, '']])}=0`;
        } else {
          if ((p * q) % 2) continue;
          const k = p + q, m = -p * q / 2 - 2;        /* 2(1−f²)+kf+m=0 ⇔ 2f²−kf−(2+m)=0 */
          tex = `${terms([[2, `\\${o}^2x`], [k, `\\${f} x`], [m, '']])}=0`;
        }
        const code = { 0:['zero', 1], 1:['h', 1], '-1':['h', -1], 2:['one', 1], '-2':['one', -1] };
        roots = [p, q].filter(r => Math.abs(r) <= 2).map(r => code[r]);
        fac = `\\${f} x=${[p, q].map(r => fracTex(r, 2)).join(',\\ ')}`;
      }
      const askN = pick(rng, [0, 1]), I = askN ? RAD_I[0] : DEG_I[0];
      let xs = [];
      roots.forEach(([c, s]) => { xs = xs.concat(trigSols(f, 1, s * TV[c][0], I)); });
      xs.sort((a, b) => a - b);
      const ans = askN ? xs.length : sumOf(xs);
      if (!xs.length || ans <= 0) continue;
      return item(prompt, `${tex}\\ (${I.tex})\\ \\Rightarrow\\ ${askN ? 'N=\\square' : 'S=\\square^\\circ'}`, ans, [
        { tex: fac },
        { tex:`x=${askN ? listRad(xs) : listDeg(xs)}` },
        { tex: askN ? 'N=\\square' : 'S=\\square^\\circ', blank:ans }]);
    }
  }

  /* count(기본) — 일차식 꼴 해의 개수 */
  const prompt = L3('sin x, cos x, tan x 를 하나의 값으로 정리한 뒤, 주어진 범위에서 그 값을 갖는 x 를 모두 찾습니다. bx 꼴이면 t=bx 의 범위를 먼저 구합니다. 해의 개수를 N 이라 합니다.',
    'Rearrange so that sin x, cos x or tan x equals one value, then find every x in the given range with that value. For bx, first find the range of t=bx. Let N be the number of solutions.',
    '整理成sin x、cos x或tan x等于一个值，再在给定范围内找出所有取这个值的x。若是bx，先求t=bx的范围。解的个数记为N。');
  for (let g = 0; g < 400; g++) {
    const E = pickTrigEq(rng, ['sin', 'cos', 'tan']), b = pick(rng, [1, 1, 2, 3]);
    const I = b === 1 ? pick(rng, RAD_I) : pick(rng, [RAD_I[0], RAD_I[1], RAD_I[3], RAD_I[4]]);
    const xs = trigSols(E.f, b, E.s * TV[E.code][0], I);
    if (!xs.length) continue;
    const sol = [{ tex:`${fArg(E.f, b)}=${tvTex(E.code, E.s)}` }];
    if (xs.length <= 6) sol.push({ tex:`x=${listRad(xs)}` });
    else sol.push({ tex:`t=${b}x:\\ ${b * I.lo === 0 ? '0' : radTex(b * I.lo, 180)}${I.loIn ? '\\le' : '<'}t${I.hiIn ? '\\le' : '<'}${radTex(b * I.hi, 180)}` });
    sol.push({ tex:'N=\\square', blank:xs.length });
    return item(prompt, `${eqTex(rng, fArg(E.f, b), E.code, E.s)}\\ (${I.tex})\\ \\Rightarrow\\ N=\\square`, xs.length, sol);
  }
};

/* ── MD145 — 삼각형·사각형의 넓이 ── */
/* 각(도) → sin 의 꼴: [분자, 분모, 근호] — sin=분자·√근호/분모 */
const SINF = { 30:[1, 2, 1], 150:[1, 2, 1], 90:[1, 1, 1], 45:[1, 2, 2], 135:[1, 2, 2], 60:[1, 2, 3], 120:[1, 2, 3] };
function angTex(rng, d){ return pick(rng, [0, 0, 1]) ? radTex(d, 180) : `${d}^\\circ`; }
function rootTex(k, r){ return r === 1 ? String(k) : `${k === 1 ? '' : k}\\sqrt{${r}}`; }
function boxRoot(r){ return r === 1 ? '\\square' : `\\square\\sqrt{${r}}`; }
/* 헤론 삼각형(세 변과 넓이가 모두 정수) — 변 ≤ 30 */
const HERON = [];
const EIS = [];                                /* 한 각이 60° 또는 120° 인 정수 삼각형 [끼인 두 변, 마주 보는 변] */
(function(){
  for (let a = 2; a <= 30; a++) for (let b = a; b <= 30; b++) for (let c = b; c < a + b && c <= 30; c++) {
    const P = (a + b + c) * (-a + b + c) * (a - b + c) * (a + b - c), r = Math.round(Math.sqrt(P));
    if (r * r === P && r % 4 === 0) HERON.push([a, b, c, r / 4]);
  }
  for (let a = 2; a <= 24; a++) for (let b = a; b <= 24; b++) {
    if ((a * b) % 4) continue;
    [[-1, 60], [1, 120]].forEach(([s, ang]) => {
      const c2 = a * a + b * b + s * a * b, c = Math.round(Math.sqrt(c2));
      if (c * c === c2 && c !== a && c !== b) EIS.push([a, b, c, ang]);
    });
  }
})();
NM_TGEN['md145_area'] = function (params, rng) {
  const mode = params.mode || 'sas';

  if (mode === 'heron') {
    const prompt = L3('세 변이 a, b, c 인 삼각형의 넓이 S 는 s=(a+b+c)/2 로 S=√(s(s−a)(s−b)(s−c)) 입니다. 또 S=rs=abc/(4R) 입니다(r 은 내접원, R 은 외접원의 반지름). 코사인법칙으로 한 각을 구해 S=½ab sinC 로 구해도 됩니다.',
      'For a triangle with sides a, b, c, let s=(a+b+c)/2; then S=√(s(s−a)(s−b)(s−c)). Also S=rs=abc/(4R) (r is the inradius, R the circumradius). You may instead find an angle by the law of cosines and use S=½ab sinC.',
      '三边为a、b、c的三角形，设s=(a+b+c)/2，则面积S=√(s(s−a)(s−b)(s−c))。又S=rs=abc/(4R)(r为内切圆半径，R为外接圆半径)。也可以用余弦定理求一个角，再用S=½ab sinC。');
    for (let g = 0; g < 400; g++) {
      const kind = pick(rng, ['S', 'S', 'r', 'R', 'eis', 'eis']);
      if (kind === 'eis') {
        const [a, b, c, ang] = pick(rng, EIS), k = a * b / 4;
        const sd = shuffle(rng, [a, b, c]);
        return item(prompt, `a=${sd[0]},\\ b=${sd[1]},\\ c=${sd[2]}\\ \\Rightarrow\\ S=\\square\\sqrt{3}`, k, [
          { tex:`\\cos\\theta=\\frac{${a}^2+${b}^2-${c}^2}{2\\times${a}\\times${b}}=${ang === 60 ? '\\frac{1}{2}' : '-\\frac{1}{2}'}` },
          { tex:`\\theta=${ang}^\\circ,\\ S=\\frac{1}{2}\\times${a}\\times${b}\\times\\frac{\\sqrt{3}}{2}` },
          { tex:`S=\\square\\sqrt{3}`, blank:k }]);
      }
      const [a, b, c, S] = pick(rng, HERON), s2 = a + b + c;
      const sd = shuffle(rng, [a, b, c]), head = `a=${sd[0]},\\ b=${sd[1]},\\ c=${sd[2]}\\ \\Rightarrow\\ `;
      const heron = s2 % 2 === 0
        ? { tex:`s=${s2 / 2},\\ S=\\sqrt{${s2 / 2}\\times${s2 / 2 - a}\\times${s2 / 2 - b}\\times${s2 / 2 - c}}=${S}` }
        : { tex:`S=\\frac{1}{4}\\sqrt{${s2}\\times${s2 - 2 * a}\\times${s2 - 2 * b}\\times${s2 - 2 * c}}=${S}` };
      if (kind === 'r') {
        if (s2 % 2 || S % (s2 / 2)) continue;
        const r = S / (s2 / 2);
        return item(prompt, `${head}r=\\square`, r, [heron, { tex:`${S}=r\\times${s2 / 2}` }, { tex:'r=\\square', blank:r }]);
      }
      if (kind === 'R') {
        if ((a * b * c) % (4 * S)) continue;
        const Rr = a * b * c / (4 * S);
        return item(prompt, `${head}R=\\square`, Rr, [heron, { tex:`R=\\frac{${a}\\times${b}\\times${c}}{4\\times${S}}` }, { tex:'R=\\square', blank:Rr }]);
      }
      return item(prompt, `${head}S=\\square`, S, [heron, { tex:'S=\\square', blank:S }]);
    }
  }

  if (mode === 'quad') {
    const prompt = L3('평행사변형 ABCD 는 두 변 AB, AD 와 그 끼인각 A 로, 사각형 ABCD 는 두 대각선 AC, BD 와 두 대각선이 이루는 각 θ 로 주어집니다. 넓이를 S 라 하면 평행사변형은 S=ab sinA, 사각형은 S=½pq sinθ 입니다.',
      'A parallelogram ABCD is given by sides AB, AD and the included angle A; a quadrilateral ABCD by its diagonals AC, BD and the angle θ between them. With area S, a parallelogram has S=ab sinA and a quadrilateral S=½pq sinθ.',
      '平行四边形ABCD由两边AB、AD及夹角A给出；四边形ABCD由两条对角线AC、BD及对角线所成的角θ给出。面积记为S，平行四边形S=ab sinA，四边形S=½pq sinθ。');
    for (let g = 0; g < 400; g++) {
      const para = pick(rng, [0, 1]), d = pick(rng, [30, 45, 60, 90, 120, 135, 150]), [nu, de, rt] = SINF[d];
      const x = R(rng, 2, 20), y = R(rng, 2, 20), den = para ? de : 2 * de;
      if ((x * y * nu) % den) continue;
      const k = x * y * nu / den, A = angTex(rng, d);
      const [L1, L2, AN] = para ? ['\\overline{AB}', '\\overline{AD}', '\\angle A'] : ['\\overline{AC}', '\\overline{BD}', '\\theta'];
      const f0 = w => para ? `S=${x}\\times${w}\\times\\sin${d}^\\circ` : `S=\\frac{1}{2}\\times${x}\\times${w}\\times\\sin${d}^\\circ`;
      if (pick(rng, [0, 0, 1])) {
        return item(prompt, `S=${rootTex(k, rt)},\\ ${L1}=${x},\\ ${AN}=${A}\\ \\Rightarrow\\ ${L2}=\\square`, y, [
          { tex: f0(L2) + `=${rootTex(k, rt)}` },
          { tex:`${L2}=\\square`, blank:y }]);
      }
      return item(prompt, `${L1}=${x},\\ ${L2}=${y},\\ ${AN}=${A}\\ \\Rightarrow\\ S=${boxRoot(rt)}`, k, [
        { tex: f0(y) },
        { tex:`S=${boxRoot(rt)}`, blank:k }]);
    }
  }

  /* sas(기본) — 두 변과 끼인각 */
  const prompt = L3('삼각형 ABC 에서 a=BC, b=CA, c=AB 이고 넓이를 S 라 하면 S=½ab sinC=½bc sinA=½ca sinB 입니다. 넓이에서 거꾸로 변의 길이를 구하기도 합니다.',
    'In triangle ABC, a=BC, b=CA, c=AB; with area S, S=½ab sinC=½bc sinA=½ca sinB. Sometimes you work back from the area to a side.',
    '在三角形ABC中，a=BC，b=CA，c=AB，面积记为S，则S=½ab sinC=½bc sinA=½ca sinB。有时由面积反求边长。');
  for (let g = 0; g < 400; g++) {
    const d = pick(rng, [30, 45, 60, 90, 120, 135, 150]), [nu, de, rt] = SINF[d];
    const x = R(rng, 2, 20), y = R(rng, 2, 20);
    if ((x * y * nu) % (2 * de)) continue;
    const k = x * y * nu / (2 * de), [u, v, W] = pick(rng, [['a', 'b', 'C'], ['b', 'c', 'A'], ['c', 'a', 'B']]), A = angTex(rng, d);
    if (pick(rng, [0, 0, 1])) {
      return item(prompt, `S=${rootTex(k, rt)},\\ ${u}=${x},\\ ${W}=${A}\\ \\Rightarrow\\ ${v}=\\square`, y, [
        { tex:`\\frac{1}{2}\\times${x}\\times${v}\\times\\sin${d}^\\circ=${rootTex(k, rt)}` },
        { tex:`${v}=\\square`, blank:y }]);
    }
    return item(prompt, `${u}=${x},\\ ${v}=${y},\\ ${W}=${A}\\ \\Rightarrow\\ S=${boxRoot(rt)}`, k, [
      { tex:`S=\\frac{1}{2}\\times${x}\\times${y}\\times\\sin${d}^\\circ` },
      { tex:`S=${boxRoot(rt)}`, blank:k }]);
  }
};

/* ── MD146 — Sₙ 과 aₙ 의 관계 ── */
function sPoly(p, q, r){ return poly([p, q, r], 'n'); }
function sExp(c, b, m){ return `${c === 1 ? '' : `${c}\\times`}${b}^{${m === 0 ? 'n' : `n${more(m, '')}`}}`; }
NM_TGEN['md146_snAn'] = function (params, rng) {
  const mode = params.mode || 'an';

  if (mode === 'a1') {
    const prompt = L3('a₁=S₁ 이고, n≥2 일 때 aₙ=Sₙ−Sₙ₋₁ 입니다. Sₙ 에 상수항이 있으면(또는 등비 꼴의 상수가 맞지 않으면) a₁ 만 따로 떨어지므로 a₁ 을 먼저 따로 구합니다.',
      'a₁=S₁, and for n≥2, aₙ=Sₙ−Sₙ₋₁. If Sₙ has a constant term (or the constant of a geometric form does not fit), a₁ stands apart, so find a₁ separately first.',
      'a₁=S₁，n≥2时aₙ=Sₙ−Sₙ₋₁。若Sₙ有常数项(或等比形式的常数不吻合)，a₁单独分开，所以先单独求a₁。');
    for (let g = 0; g < 400; g++) {
      const kind = pick(rng, ['a1', 'a1k', 'ak']);
      let tex, a1, ak, k, sol;
      if (pick(rng, [0, 1])) {
        const p = nz(rng, 1, 4), q = R(rng, -8, 8), r = nz(rng, 1, 9);
        k = R(rng, 2, 15);
        tex = `S_n=${sPoly(p, q, r)}`; a1 = p + q + r; ak = p * (2 * k - 1) + q;
        sol = [{ tex:`a_1=S_1=${a1}` }, { tex:`a_n=S_n-S_{n-1}=${poly([2 * p, q - p], 'n')}\\ (n\\ge2)` }];
      } else {
        const b = pick(rng, [2, 3]), c = R(rng, 1, 3), d = nz(rng, 1, 6);
        if (d === -c) continue;
        k = R(rng, 2, b === 2 ? 8 : 6);
        tex = `S_n=${sExp(c, b, 0)}${more(d, '')}`; a1 = c * b + d; ak = c * (b - 1) * b ** (k - 1);
        sol = [{ tex:`a_1=S_1=${a1}` }, { tex:`a_n=S_n-S_{n-1}=${c * (b - 1) === 1 ? '' : `${c * (b - 1)}\\times`}${b}^{n-1}\\ (n\\ge2)` }];
      }
      if (kind === 'a1') return item(prompt, `${tex}\\ \\Rightarrow\\ a_1=\\square`, a1, [sol[0], { tex:'a_1=\\square', blank:a1 }]);
      if (kind === 'ak') return item(prompt, `${tex}\\ \\Rightarrow\\ a_{${k}}=\\square`, ak, sol.concat([{ tex:`a_{${k}}=\\square`, blank:ak }]));
      const ans = a1 + ak;
      return item(prompt, `${tex}\\ \\Rightarrow\\ a_1+a_{${k}}=\\square`, ans, sol.concat([{ tex:`${a1}+${par(ak)}=\\square`, blank:ans }]));
    }
  }

  if (mode === 'judge') {
    const prompt = L3('Sₙ 에서 aₙ 을 구해, 주어진 조건이 n=1 부터 성립하도록 k 를 정합니다. 등차는 aₙ₊₁−aₙ 이, 등비는 aₙ₊₁÷aₙ 이 첫째항부터 일정해야 하므로 a₁=S₁ 이 n≥2 의 식과 맞아야 합니다.',
      'Find aₙ from Sₙ and choose k so that the given condition holds from n=1. For an arithmetic sequence aₙ₊₁−aₙ, and for a geometric one aₙ₊₁÷aₙ, must be constant from the first term, so a₁=S₁ must fit the formula for n≥2.',
      '由Sₙ求aₙ，确定k使给出的条件从n=1起成立。等差要求aₙ₊₁−aₙ、等比要求aₙ₊₁÷aₙ从第一项起就一定，所以a₁=S₁必须符合n≥2的式子。');
    const kind = pick(rng, ['ar', 'ge', 'ge', 'coef', 'coef']);
    if (kind === 'ar') {
      const p = nz(rng, 1, 5), q = R(rng, -9, 9), c = nz(rng, 1, 12);
      return item(prompt, `S_n=${sPoly(p, q, 0)}+k${more(c, '')},\\ a_{n+1}-a_n=${2 * p}\\ (n\\ge1)\\ \\Rightarrow\\ k=\\square`, -c, [
        { tex:`a_n=${poly([2 * p, q - p], 'n')}\\ (n\\ge2)` },
        { tex:`a_1=${p + q}+k${more(c, '')}=${p + q}` },
        { tex:'k=\\square', blank:-c }]);
    }
    if (kind === 'ge') {
      for (let g = 0; g < 100; g++) {
        const b = pick(rng, [2, 3, 4]), m = pick(rng, [-1, 0, 0, 1, 2]), c = R(rng, 1, 5) * (m === -1 ? b : 1);
        const k = m === -1 ? -c / b : -c * b ** m;
        if (Math.abs(k) > 200) continue;
        return item(prompt, `S_n=${sExp(c, b, m)}+k,\\ a_{n+1}=${b}a_n\\ (n\\ge1)\\ \\Rightarrow\\ k=\\square`, k, [
          { tex:`a_n=S_n-S_{n-1}=${c * (b - 1)}\\times${b}^{n${more(m - 1, '')}}\\ (n\\ge2)` },
          { tex:`a_1=S_1=${c * b ** (m + 1)}+k=${c * (b - 1) * b ** m}` },
          { tex:'k=\\square', blank:k }]);
      }
    }
    const k = nz(rng, 1, 6), q = R(rng, -9, 9), j = R(rng, 2, 12), val = k * (2 * j - 1) + q;
    return item(prompt, `S_n=kn^2${more(q, 'n')},\\ a_{${j}}=${val}\\ \\Rightarrow\\ k=\\square`, k, [
      { tex:`a_{${j}}=S_{${j}}-S_{${j - 1}}=${2 * j - 1}k${more(q, '')}` },
      { tex:`${2 * j - 1}k${more(q, '')}=${val}` },
      { tex:'k=\\square', blank:k }]);
  }

  /* an(기본) — Sₙ=pn²+qn 에서 aₙ */
  const prompt = L3('aₙ=Sₙ−Sₙ₋₁(n≥2), a₁=S₁ 입니다. Sₙ=pn²+qn 이면 a₁ 도 같은 식에 맞아 aₙ=2pn+q−p 인 등차수열입니다. aₘ+…+aₙ=Sₙ−Sₘ₋₁ 입니다.',
    'aₙ=Sₙ−Sₙ₋₁ (n≥2) and a₁=S₁. If Sₙ=pn²+qn, a₁ fits the same formula, so aₙ=2pn+q−p is arithmetic. Also aₘ+…+aₙ=Sₙ−Sₘ₋₁.',
    'aₙ=Sₙ−Sₙ₋₁(n≥2)，a₁=S₁。若Sₙ=pn²+qn，a₁也符合同一个式子，aₙ=2pn+q−p是等差数列。另外aₘ+…+aₙ=Sₙ−Sₘ₋₁。');
  const p = nz(rng, 1, 5), q = R(rng, -9, 9), S = n => p * n * n + q * n;
  const tex = q !== 0 && pick(rng, [0, 0, 1]) ? `S_n=n(${poly([p, q], 'n')})` : `S_n=${sPoly(p, q, 0)}`;
  const kind = pick(rng, ['ak', 'ak', 'range', 'diff']);
  if (kind === 'range') {
    const m = R(rng, 2, 10), n = m + R(rng, 2, 12), ans = S(n) - S(m - 1);
    return item(prompt, `${tex}\\ \\Rightarrow\\ a_{${m}}+a_{${m + 1}}+\\cdots+a_{${n}}=\\square`, ans, [
      { tex:`S_{${n}}-S_{${m - 1}}=${S(n)}-${par(S(m - 1))}` },
      { tex:`a_{${m}}+\\cdots+a_{${n}}=\\square`, blank:ans }]);
  }
  if (kind === 'diff') {
    const k = R(rng, 1, 10), j = k + R(rng, 2, 10), ans = 2 * p * (j - k);
    return item(prompt, `${tex}\\ \\Rightarrow\\ a_{${j}}-a_{${k}}=\\square`, ans, [
      { tex:`a_n=${poly([2 * p, q - p], 'n')}` },
      { tex:`a_{${j}}-a_{${k}}=${2 * p}\\times${j - k}` },
      { tex:`a_{${j}}-a_{${k}}=\\square`, blank:ans }]);
  }
  const k = R(rng, 2, 20), ans = p * (2 * k - 1) + q;
  return item(prompt, `${tex}\\ \\Rightarrow\\ a_{${k}}=\\square`, ans, [
    { tex:`a_{${k}}=S_{${k}}-S_{${k - 1}}=${S(k)}-${par(S(k - 1))}` },
    { tex:`a_{${k}}=\\square`, blank:ans }]);
};

/* ── MD147 — 등차수열의 합의 최대·최소 ── */
/* 등차수열 표시 — a₁·d / 일반항 / 두 항 */
function apShow(rng, a1, d){
  const kind = pick(rng, ['ad', 'ad', 'gen', 'two']);
  if (kind === 'gen') return { tex:`a_n=${terms([[d, 'n'], [a1 - d, '']])}`, sol:`a_1=${a1},\\ d=${d}` };
  if (kind === 'two') {
    const p = R(rng, 2, 6), q = p + R(rng, 2, 6), ap = a1 + (p - 1) * d, aq = a1 + (q - 1) * d;
    return { tex:`a_{${p}}=${ap},\\ a_{${q}}=${aq}`, sol:`d=\\frac{${aq}-${par(ap)}}{${q - p}}=${d},\\ a_1=${a1}` };
  }
  return { tex:`a_1=${a1},\\ d=${d}`, sol:`a_n=${terms([[d, 'n'], [a1 - d, '']])}` };
}
function apExt(a1, d){
  /* 부호가 바뀌기 전까지의 합 — 감소(a₁>0, d<0)면 최댓값, 증가(a₁<0, d>0)면 최솟값 */
  let s = 0, best = 0, at = [], n = 0;
  for (n = 1; n <= 400; n++) {
    const an = a1 + (n - 1) * d;
    if ((d < 0 && an < 0) || (d > 0 && an > 0)) break;
    s += an;
    if (s === best) at.push(n); else { best = s; at = [n]; }
  }
  return { v:best, at };
}
NM_TGEN['md147_apExtreme'] = function (params, rng) {
  const mode = params.mode || 'sign';

  if (mode === 'max' || mode === 'cond') {
    const prompt = L3('첫째항부터의 합 Sₙ 의 최댓값을 M, 최솟값을 m 이라 합니다. 감소하는 등차수열은 양수인 항까지 더할 때 M, 증가하는 등차수열은 음수인 항까지 더할 때 m 입니다. "Sₙ=M" 은 합이 최대가 되는 n 을 뜻합니다.',
      'Let M be the greatest and m the least value of Sₙ, the sum from the first term. For a decreasing arithmetic sequence, adding up to the last positive term gives M; for an increasing one, adding up to the last negative term gives m. "Sₙ=M" refers to the n at which the sum is greatest.',
      '从首项起的和Sₙ的最大值记为M，最小值记为m。递减的等差数列加到最后一个正项时得M，递增的等差数列加到最后一个负项时得m。"Sₙ=M"指和最大时的n。');
    for (let g = 0; g < 400; g++) {
      const dec = pick(rng, [1, 1, 0]), D = R(rng, 2, 7), A = R(rng, 10, 60);
      const a1 = dec ? A : -A, d = dec ? -D : D, X = dec ? 'M' : 'm', E = apExt(a1, d);
      if (E.at.length !== 1 && mode === 'max' && pick(rng, [0, 1])) continue;
      if (mode === 'cond' && pick(rng, [0, 1]) && dec) {
        /* Sₚ=S_q (p+q 짝수) — 가운데에서 최대 */
        const e = R(rng, 1, 4), p = R(rng, 3, 12), q = p + 2 * R(rng, 1, 6), b1 = (p + q - 1) * e, dd = -2 * e;
        const F = apExt(b1, dd), askN = pick(rng, [0, 1]);
        if (F.at.length !== 1) continue;
        const ans = askN ? F.at[0] : F.v;
        return item(prompt, `a_1=${b1},\\ S_{${p}}=S_{${q}}\\ \\Rightarrow\\ ${askN ? 'S_n=M,\\ n=\\square' : 'M=\\square'}`, ans, [
          { tex:`a_{${p + 1}}+a_{${q}}=0\\ \\Rightarrow\\ 2\\times${b1}+${p + q - 1}d=0,\\ d=${dd}` },
          { tex:`a_n=${terms([[dd, 'n'], [b1 - dd, '']])}` },
          { tex: askN ? 'n=\\square' : 'M=\\square', blank:ans }]);
      }
      const Sh = mode === 'cond'
        ? (() => { const p = R(rng, 2, 6), q = p + R(rng, 2, 6), ap = a1 + (p - 1) * d, aq = a1 + (q - 1) * d;
            return { tex:`a_{${p}}=${ap},\\ a_{${q}}=${aq}`, sol:`d=\\frac{${aq}-${par(ap)}}{${q - p}}=${d},\\ a_1=${a1}` }; })()
        : apShow(rng, a1, d);
      const askN = E.at.length === 1 && pick(rng, [0, 1]);
      const last = a1 + (E.at[E.at.length - 1] - 1) * d;
      const ans = askN ? E.at[0] : E.v;
      return item(prompt, `${Sh.tex}\\ \\Rightarrow\\ ${askN ? `S_n=${X},\\ n=\\square` : `${X}=\\square`}`, ans, [
        { tex: Sh.sol },
        { tex:`a_{${E.at[E.at.length - 1]}}=${last},\\ a_{${E.at[E.at.length - 1] + 1}}=${last + d}` },
        { tex: askN ? 'n=\\square' : `${X}=\\square`, blank:ans }]);
    }
  }

  /* sign(기본) — 부호가 바뀌는 항 */
  const prompt = L3('등차수열의 일반항 aₙ=a₁+(n−1)d 로 부등식을 풀어 부호가 바뀌는 곳을 찾습니다. n 은 자연수이므로 경계에 가장 가까운 자연수를 답합니다.',
    'Use the general term aₙ=a₁+(n−1)d to solve the inequality and find where the sign changes. Since n is a natural number, answer with the natural number nearest the boundary.',
    '用等差数列的通项aₙ=a₁+(n−1)d解不等式，找出符号改变的地方。n是自然数，答离边界最近的自然数。');
  const dec = pick(rng, [1, 1, 0]), D = R(rng, 2, 9), A = R(rng, 15, 99);
  const a1 = dec ? A : -A, d = dec ? -D : D, Sh = apShow(rng, a1, d);
  const after = Math.floor(A / D) + 2, before = Math.ceil(A / D);   /* 부호가 바뀐 첫 n / 바뀌기 전 마지막 n */
  const askAfter = pick(rng, [0, 1]);
  const cond = askAfter ? (dec ? 'a_n<0' : 'a_n>0') : (dec ? 'a_n>0' : 'a_n<0');
  const ans = askAfter ? after : before, rel = askAfter ? 'n\\ge\\square' : 'n\\le\\square';
  return item(prompt, `${Sh.tex}\\ \\Rightarrow\\ (${cond}\\ \\Leftrightarrow\\ ${rel})`, ans, [
    { tex: Sh.sol },
    { tex:`${cond.replace('a_n', `${a1}${more(d, '')}(n-1)`)}\\ \\Rightarrow\\ n-1${cond.includes(dec ? '<' : '>') ? '>' : '<'}\\frac{${A}}{${D}}` },
    { tex: rel, blank:ans }]);
};

/* ── MD148 — 원리합계(문장제) ── */
const SUP = { 0:'⁰', 1:'¹', 2:'²', 3:'³', 4:'⁴', 5:'⁵', 6:'⁶', 7:'⁷', 8:'⁸', 9:'⁹' };
function sup(n){ return String(n).split('').map(c => SUP[c]).join(''); }
function baseTxt(p){ return (1 + p / 100).toFixed(2).replace(/0$/, ''); }
/* (1+p/100)^n 을 소수 둘째 자리로 — 반올림 경계에서 먼 것만 */
function powG(p, n){
  const v = Math.pow(1 + p / 100, n) * 100, G = Math.round(v);
  return Math.abs(v - G) < 0.4 ? G : 0;
}
function gTxt(p, n, G){ return `${baseTxt(p)}${sup(n)}=${(G / 100).toFixed(2)}`; }
function pickRate(rng, monthly){
  for (let g = 0; g < 200; g++) {
    const p = monthly ? 1 : pick(rng, [1, 2, 3, 4, 5, 6, 8, 10]);
    const n = monthly ? pick(rng, [12, 24, 36]) : R(rng, 5, 20);
    const G = powG(p, n);
    if (G && G <= 600 && G > 100) return { p, n, G };
  }
  return { p:2, n:10, G:122 };
}
/* 금액 a 의 배수 단위 — a·num/den 이 정수가 되는 가장 작은 a */
function unitFor(num, den){ return den / gcd(num, den); }
function per(M){
  return M ? L3('월이율', 'a monthly rate of', '月利率') : L3('연이율', 'an annual rate of', '年利率');
}
NM_TGEN['md148_annuity'] = function (params, rng) {
  const mode = params.mode || 'save';
  const note = (p, n, G) => L3(` (단, ${gTxt(p, n, G)} 로 계산합니다.)`, ` (Use ${gTxt(p, n, G)}.)`, `(按${gTxt(p, n, G)}计算。)`);
  const U = M => M ? L3(['개월', '매월', '달'], ['months', 'month', 'month'], ['个月', '每月', '月']) : L3(['년', '매년', '해'], ['years', 'year', 'year'], ['年', '每年', '年']);

  for (let g = 0; g < 400; g++) {
    const M = mode !== 'compare' && pick(rng, [0, 0, 0, 1]) ? 1 : 0;
    const { p, n, G } = pickRate(rng, M), u = U(M), rt = per(M);
    const tail = note(p, n, G);
    const cp = L3(`${rt.ko} ${p}%, ${M ? '1개월' : '1년'}마다 복리로`, `at ${rt.en} ${p}% compounded ${M ? 'monthly' : 'yearly'}`, `${rt.zh}${p}%，每${M ? '月' : '年'}复利计算`);

    if (mode === 'pay') {
      const begin = pick(rng, [0, 1]);
      if (pick(rng, [0, 0, 1]) && !M) {
        /* 대출 상환 — P·Gⁿ = a(Gⁿ−1)/r */
        const L = unitFor(100 * (G - 100), G * p), a = L * R(rng, 1, Math.max(1, Math.floor(3000 / L)));
        const P = a * 100 * (G - 100) / (G * p);
        if (a > 3000 || P > 30000 || P !== Math.round(P)) continue;
        return word(
          L3(`${P} 만 원을 빌리고 ${cp.ko} 1년 뒤부터 매년 말에 같은 금액을 ${n}번 갚아 모두 갚으려고 합니다.${tail.ko}`,
             `You borrow ${P} ten-thousand won ${cp.en}, and repay the same amount at the end of every year for ${n} years, starting one year later, to clear the loan.${tail.en}`,
             `借${P}万韩元，${cp.zh}，从一年后起每年年末还同样的金额，共还${n}次还清。${tail.zh}`),
          L3('매년 갚는 금액은 몇 만 원입니까?', 'How many ten-thousand won is each yearly payment?', '每年还款多少万韩元？'),
          a, [
            { tex:`${P}\\times${(G / 100).toFixed(2)}=\\frac{a(${(G / 100).toFixed(2)}-1)}{${(p / 100).toFixed(2)}}` },
            { tex:`a=\\square`, blank:a }]);
      }
      const num = begin ? (100 + p) * (G - 100) : (G - 100), den = begin ? 100 * p : p;
      const L = unitFor(num, den), a = L * R(rng, 1, Math.max(1, Math.floor(400 / L)));
      const T = a * num / den;
      if (a > 400 || T > 60000) continue;
      return word(
        L3(`${u.ko[1]} ${begin ? '초' : '말'}에 같은 금액을 ${cp.ko} ${n}${u.ko[0]} 동안 적립하여 ${n}${u.ko[0]}째 말에 ${T} 만 원을 만들려고 합니다.${tail.ko}`,
           `You deposit the same amount at the ${begin ? 'start' : 'end'} of every ${u.en[1]} for ${n} ${u.en[0]}, ${cp.en}, to have ${T} ten-thousand won at the end of the ${n}th ${u.en[2]}.${tail.en}`,
           `${u.zh[1]}${begin ? '初' : '末'}存入同样的金额，${cp.zh}，共存${n}${u.zh[0]}，要在第${n}${u.zh[0] === '年' ? '年' : '个月'}末攒到${T}万韩元。${tail.zh}`),
        L3(`${u.ko[1]} 적립할 금액은 몇 만 원입니까?`, `How many ten-thousand won must you deposit each ${u.en[1]}?`, `${u.zh[1]}应存入多少万韩元？`),
        a, [
          { tex: begin ? `\\frac{a\\times${baseTxt(p)}\\times(${(G / 100).toFixed(2)}-1)}{${(p / 100).toFixed(2)}}=${T}` : `\\frac{a(${(G / 100).toFixed(2)}-1)}{${(p / 100).toFixed(2)}}=${T}` },
          { tex:'a=\\square', blank:a }]);
    }

    if (mode === 'compare') {
      const kind = pick(rng, ['lump', 'simple', 'be']);
      if (kind === 'simple') {
        const X = 100 * R(rng, 1, 20), comp = X * G / 100, simp = X + X * n * p / 100, ans = comp - simp;
        if (ans <= 0) continue;
        return word(
          L3(`${X} 만 원을 ${rt.ko} ${p}% 로 ${n}년 동안 예금합니다. 1년마다 복리로 계산할 때와 단리로 계산할 때 ${n}년 뒤의 원리합계를 비교합니다.${tail.ko}`,
             `You deposit ${X} ten-thousand won at ${rt.en} ${p}% for ${n} years. Compare the amounts after ${n} years with yearly compound interest and with simple interest.${tail.en}`,
             `把${X}万韩元按${rt.zh}${p}%存${n}年。比较按每年复利与按单利计算时${n}年后的本利和。${tail.zh}`),
          L3('복리가 단리보다 몇 만 원 더 많습니까?', 'By how many ten-thousand won is the compound amount larger?', '复利比单利多多少万韩元？'),
          ans, [
            { tex:`${X}\\times${(G / 100).toFixed(2)}=${comp}` },
            { tex:`${X}+${X}\\times${(p / 100).toFixed(2)}\\times${n}=${simp}` },
            { tex:`${comp}-${simp}=\\square`, blank:ans }]);
      }
      if (kind === 'be') {
        const L = unitFor(G - 100, 100), a = L * R(rng, 1, Math.max(1, Math.floor(300 / L))), ans = a * (G - 100) / 100;
        if (a > 300) continue;
        return word(
          L3(`${a} 만 원씩 ${n}번, ${cp.ko} 적립합니다. 매년 초에 넣을 때와 매년 말에 넣을 때 ${n}년째 말의 원리합계를 비교합니다.${tail.ko}`,
             `You deposit ${a} ten-thousand won ${n} times ${cp.en}. Compare the amounts at the end of the ${n}th year when depositing at the start of each year and at the end of each year.${tail.en}`,
             `每次存${a}万韩元，共存${n}次，${cp.zh}。比较每年初存入与每年末存入时第${n}年末的本利和。${tail.zh}`),
          L3('매년 초에 넣을 때가 몇 만 원 더 많습니까?', 'By how many ten-thousand won is the start-of-year plan larger?', '每年初存入的多多少万韩元？'),
          ans, [
            { tex:`\\frac{${a}\\times${baseTxt(p)}(${(G / 100).toFixed(2)}-1)}{${(p / 100).toFixed(2)}}-\\frac{${a}(${(G / 100).toFixed(2)}-1)}{${(p / 100).toFixed(2)}}` },
            { tex:`${a}\\times(${(G / 100).toFixed(2)}-1)=\\square`, blank:ans }]);
      }
      /* 목돈 vs 적립 */
      const La = unitFor(G - 100, p), a = La * R(rng, 1, Math.max(1, Math.floor(300 / La)));
      const LX = unitFor(G, 100), X = LX * R(rng, 1, Math.max(1, Math.floor(2000 / LX))), B = a * (G - 100) / p;
      if (a > 300 || X > 2000) continue;
      const A = X * G / 100, ans = Math.abs(A - B);
      if (!ans || A > 60000 || B > 60000) continue;
      return word(
        L3(`${cp.ko} 두 가지 방법으로 저축합니다. 가: 지금 ${X} 만 원을 한꺼번에 예금합니다. 나: 매년 말에 ${a} 만 원씩 ${n}번 적립합니다.${tail.ko}`,
           `You save in two ways, ${cp.en}. Plan A: deposit ${X} ten-thousand won all at once now. Plan B: deposit ${a} ten-thousand won at the end of every year, ${n} times.${tail.en}`,
           `${cp.zh}，用两种方法储蓄。甲：现在一次存入${X}万韩元。乙：每年年末存入${a}万韩元，共${n}次。${tail.zh}`),
        L3(`${n}년째 말에 두 원리합계의 차는 몇 만 원입니까?`, `At the end of the ${n}th year, what is the difference between the two amounts, in ten-thousand won?`, `第${n}年末两种本利和相差多少万韩元？`),
        ans, [
          { tex:`${X}\\times${(G / 100).toFixed(2)}=${A}` },
          { tex:`\\frac{${a}(${(G / 100).toFixed(2)}-1)}{${(p / 100).toFixed(2)}}=${B}` },
          { tex:`${Math.max(A, B)}-${Math.min(A, B)}=\\square`, blank:ans }]);
    }

    /* save(기본) — 원리합계 */
    const kind = pick(rng, ['lump', 'end', 'end', 'begin', 'begin']);
    if (kind === 'lump') {
      const L = unitFor(G, 100), X = L * R(rng, 1, Math.max(1, Math.floor(2000 / L))), ans = X * G / 100;
      if (X > 2000) continue;
      return word(
        L3(`${X} 만 원을 ${cp.ko} ${n}${u.ko[0]} 동안 예금합니다.${tail.ko}`,
           `You deposit ${X} ten-thousand won ${cp.en} for ${n} ${u.en[0]}.${tail.en}`,
           `把${X}万韩元${cp.zh}，存${n}${u.zh[0]}。${tail.zh}`),
        L3(`${n}${u.ko[0]} 뒤의 원리합계는 몇 만 원입니까?`, `What is the amount after ${n} ${u.en[0]}, in ten-thousand won?`, `${n}${u.zh[0]}后的本利和是多少万韩元？`),
        ans, [
          { tex:`${X}\\times${baseTxt(p)}^{${n}}=${X}\\times${(G / 100).toFixed(2)}` },
          { tex:'\\square', blank:ans }]);
    }
    const begin = kind === 'begin';
    const num = begin ? (100 + p) * (G - 100) : (G - 100), den = begin ? 100 * p : p;
    const L = unitFor(num, den), a = L * R(rng, 1, Math.max(1, Math.floor(400 / L)));
    const ans = a * num / den;
    if (a > 400 || ans > 60000) continue;
    return word(
      L3(`${u.ko[1]} ${begin ? '초' : '말'}에 ${a} 만 원씩 ${cp.ko} ${n}${u.ko[0]} 동안 적립합니다.${tail.ko}`,
         `You deposit ${a} ten-thousand won at the ${begin ? 'start' : 'end'} of every ${u.en[1]} for ${n} ${u.en[0]}, ${cp.en}.${tail.en}`,
         `${u.zh[1]}${begin ? '初' : '末'}存入${a}万韩元，${cp.zh}，共存${n}${u.zh[0]}。${tail.zh}`),
      L3(`${n}${u.ko[0]}째 말의 원리합계는 몇 만 원입니까?`, `What is the total at the end of the ${n}th ${u.en[2]}, in ten-thousand won?`, `第${n}${u.zh[0] === '年' ? '年' : '个月'}末的本利和是多少万韩元？`),
      ans, [
        { tex: begin ? `\\frac{${a}\\times${baseTxt(p)}\\times(${baseTxt(p)}^{${n}}-1)}{${baseTxt(p)}-1}` : `\\frac{${a}(${baseTxt(p)}^{${n}}-1)}{${baseTxt(p)}-1}` },
        { tex:'\\square', blank:ans }]);
  }
};

/* ── MD149 — 여러 가지 수열의 합 ── */
/* 분수 [p, q] 더하기(약분) */
function fAdd(A, B){ const p = A[0] * B[1] + B[0] * A[1], q = A[1] * B[1], g = gcd(p, q) || 1; return [p / g, q / g]; }
/* 부분분수 꼴: 일반항 c/((ak+b)(ak+b+e)) */
const PF = [
  { t:'k(k+1)', a:1, b:0, e:1 }, { t:'(k+1)(k+2)', a:1, b:1, e:1 }, { t:'k(k+2)', a:1, b:0, e:2 },
  { t:'(2k-1)(2k+1)', a:2, b:-1, e:2 }, { t:'(2k+1)(2k+3)', a:2, b:1, e:2 }, { t:'k^2+3k+2', a:1, b:1, e:1 },
  { t:'k^2+k', a:1, b:0, e:1 }, { t:'4k^2-1', a:2, b:-1, e:2 }, { t:'(3k-2)(3k+1)', a:3, b:-2, e:3 }, { t:'(k+2)(k+3)', a:1, b:2, e:1 }
];
function pfSum(P, c, n){
  let s = [0, 1];
  for (let k = 1; k <= n; k++) { const u = P.a * k + P.b; s = fAdd(s, [c, u * (u + P.e)]); }
  return s;
}
NM_TGEN['md149_seriesSum'] = function (params, rng) {
  const mode = params.mode || 'frac';

  if (mode === 'root') {
    const prompt = L3('분모의 유리화로 1/(√(k+1)+√k)=√(k+1)−√k 처럼 바꾸면 앞뒤 항이 차례로 지워지고 처음과 끝만 남습니다.',
      'Rationalizing the denominator, 1/(√(k+1)+√k)=√(k+1)−√k, so neighbouring terms cancel and only the first and last remain.',
      '把分母有理化，1/(√(k+1)+√k)=√(k+1)−√k，前后项依次消去，只剩首尾。');
    const kind = pick(rng, ['one', 'one', 'odd', 'rev', 'ak']);
    if (kind === 'odd') {
      const m = 2 * R(rng, 2, 15) + 1, n = (m * m - 1) / 2, ans = (m - 1) / 2;
      return item(prompt, `\\sum_{k=1}^{${n}}\\frac{1}{\\sqrt{2k+1}+\\sqrt{2k-1}}=\\square`, ans, [
        { tex:`\\frac{1}{\\sqrt{2k+1}+\\sqrt{2k-1}}=\\frac{\\sqrt{2k+1}-\\sqrt{2k-1}}{2}` },
        { tex:`\\frac{\\sqrt{${2 * n + 1}}-1}{2}=\\frac{${m}-1}{2}` },
        { tex:'\\square', blank:ans }]);
    }
    if (kind === 'rev') {
      const m = R(rng, 3, 20), n = m * m - 1, c = pick(rng, [1, 1, 2, 3]), v = c * (m - 1);
      return item(prompt, `\\sum_{k=1}^{n}\\frac{${c}}{\\sqrt{k+1}+\\sqrt{k}}=${v}\\ \\Rightarrow\\ n=\\square`, n, [
        { tex:`${c === 1 ? '' : c}(\\sqrt{n+1}-1)=${v}` },
        { tex:`\\sqrt{n+1}=${m}` },
        { tex:'n=\\square', blank:n }]);
    }
    const s = R(rng, 1, 8), t = s + R(rng, 1, 12), lo = s * s, hi = t * t - 1, c = pick(rng, [1, 1, 1, 2, 3]), ans = c * (t - s);
    if (kind === 'ak') {
      return item(prompt, `a_k=\\sqrt{k}+\\sqrt{k+1}\\ \\Rightarrow\\ \\sum_{k=${lo}}^{${hi}}\\frac{${c}}{a_k}=\\square`, ans, [
        { tex:`\\frac{1}{a_k}=\\sqrt{k+1}-\\sqrt{k}` },
        { tex:`${c === 1 ? '' : c}(\\sqrt{${hi + 1}}-\\sqrt{${lo}})=${c === 1 ? '' : c}(${t}-${s})` },
        { tex:'\\square', blank:ans }]);
    }
    return item(prompt, `\\sum_{k=${lo}}^{${hi}}\\frac{${c}}{\\sqrt{k+1}+\\sqrt{k}}=\\square`, ans, [
      { tex:`\\frac{1}{\\sqrt{k+1}+\\sqrt{k}}=\\sqrt{k+1}-\\sqrt{k}` },
      { tex:`${c === 1 ? '' : c}(\\sqrt{${hi + 1}}-\\sqrt{${lo}})=${c === 1 ? '' : c}(${t}-${s})` },
      { tex:'\\square', blank:ans }]);
  }

  if (mode === 'ag') {
    const prompt = L3('(등차)×(등비) 꼴의 합 S 는 공비 r 를 곱한 rS 를 한 칸 밀어 빼면(S−rS) 등비수열의 합이 됩니다.',
      'For a sum S of (arithmetic)×(geometric) terms, multiply by the ratio r and subtract rS shifted by one place (S−rS) to get a geometric sum.',
      '(等差)×(等比)形式的和S，乘以公比r后错开一位相减(S−rS)，就化成等比数列的和。');
    for (let g = 0; g < 400; g++) {
      const r = pick(rng, [2, 2, 3]), a = R(rng, 1, 3), b = R(rng, -1, 3), e = pick(rng, [0, 1]);
      const n = R(rng, 4, r === 2 ? 10 : 7);
      if (a + b <= 0) continue;
      let S = 0; for (let k = 1; k <= n; k++) S += (a * k + b) * r ** (k - 1 + e);
      if (S > 200000) continue;
      const lin = poly([a, b], 'k'), pw = e ? `${r}^{k}` : `${r}^{k-1}`;
      const body = b === 0 && a === 1 ? `k\\cdot${pw}` : `(${lin})\\cdot${pw}`;
      const written = b === 0 && a === 1 && !e && pick(rng, [0, 1]);
      const tex = written ? `1+2\\cdot${r}+3\\cdot${r}^{2}+\\cdots+${n}\\cdot${r}^{${n - 1}}=\\square` : `\\sum_{k=1}^{${n}}${body}=\\square`;
      return item(prompt, tex, S, [
        { tex:`S=${(a + b) * r ** e}+${(2 * a + b) * r ** (1 + e)}+\\cdots+${a * n + b}\\cdot${r}^{${n - 1 + e}}` },
        { tex:`${1 - r}S=${(1 - r) * S}` },
        { tex:'S=\\square', blank:S }]);
    }
  }

  /* frac(기본) — 부분분수 */
  const prompt = L3('1/(AB)=(1/(B−A))(1/A−1/B) 로 나누면 가운데 항이 지워집니다. 합은 약분한 분수로 나타내고, 분모가 보이는 칸에는 분자를 씁니다.',
    'Split 1/(AB)=(1/(B−A))(1/A−1/B) so the middle terms cancel. Write the sum as a reduced fraction; where the denominator is shown, enter the numerator.',
    '拆成1/(AB)=(1/(B−A))(1/A−1/B)，中间的项消去。和写成约分后的分数；分母已给出时填分子。');
  for (let g = 0; g < 400; g++) {
    const P = pick(rng, PF), c = pick(rng, [1, 1, 1, 2, 3, 4]), n = R(rng, 3, 30);
    const [sp, sq] = pfSum(P, c, n);
    if (sq > 999 || sq === 1) continue;
    const term = `\\frac{${c}}{${P.t}}`;
    if (pick(rng, [0, 0, 1])) {
      return item(prompt, `\\sum_{k=1}^{n}${term}=\\frac{${sp}}{${sq}}\\ \\Rightarrow\\ n=\\square`, n, [
        { tex:`${term}=\\frac{${c}}{${P.e}}\\bigl(\\frac{1}{${poly([P.a, P.b], 'k')}}-\\frac{1}{${poly([P.a, P.b + P.e], 'k')}}\\bigr)` },
        { tex:`\\sum_{k=1}^{n}${term}=\\frac{${sp}}{${sq}}` },
        { tex:'n=\\square', blank:n }]);
    }
    return item(prompt, `\\sum_{k=1}^{${n}}${term}=\\frac{\\square}{${sq}}`, sp, [
      { tex:`${term}=\\frac{${c}}{${P.e}}\\bigl(\\frac{1}{${poly([P.a, P.b], 'k')}}-\\frac{1}{${poly([P.a, P.b + P.e], 'k')}}\\bigr)` },
      { tex:`\\sum_{k=1}^{${n}}${term}=\\frac{\\square}{${sq}}`, blank:sp }]);
  }
};

/* ── MD150 — 군수열 ── */
const GF = {
  nat:{ tex:'(1),\\ (2,\\ 3),\\ (4,\\ 5,\\ 6),\\ \\cdots', size:g => g, term:(g, h) => g * (g - 1) / 2 + h, uniq:1 },
  odd:{ tex:'(1),\\ (3,\\ 5),\\ (7,\\ 9,\\ 11),\\ \\cdots', size:g => g, term:(g, h) => g * (g - 1) + 2 * h - 1, uniq:1 },
  even:{ tex:'(2),\\ (4,\\ 6),\\ (8,\\ 10,\\ 12),\\ \\cdots', size:g => g, term:(g, h) => g * (g - 1) + 2 * h, uniq:1 },
  sq:{ tex:'(1),\\ (2,\\ 3,\\ 4),\\ (5,\\ 6,\\ 7,\\ 8,\\ 9),\\ \\cdots', size:g => 2 * g - 1, term:(g, h) => (g - 1) * (g - 1) + h, uniq:1 },
  up:{ tex:'(1),\\ (1,\\ 2),\\ (1,\\ 2,\\ 3),\\ \\cdots', size:g => g, term:(g, h) => h },
  rep:{ tex:'(1),\\ (2,\\ 2),\\ (3,\\ 3,\\ 3),\\ \\cdots', size:g => g, term:(g, h) => g },
  down:{ tex:'(1),\\ (2,\\ 1),\\ (3,\\ 2,\\ 1),\\ \\cdots', size:g => g, term:(g, h) => g - h + 1 },
  mul:{ tex:'(1),\\ (2,\\ 4),\\ (3,\\ 6,\\ 9),\\ \\cdots', size:g => g, term:(g, h) => g * h },
  frac:{ tex:'(\\frac{1}{1}),\\ (\\frac{1}{2},\\ \\frac{2}{2}),\\ (\\frac{1}{3},\\ \\frac{2}{3},\\ \\frac{3}{3}),\\ \\cdots', size:g => g, frac:1 }
};
function gLocate(F, m){ let g = 1, c = 0; while (c + F.size(g) < m) { c += F.size(g); g++; } return { g, h:m - c, before:c }; }
function gBefore(F, g){ let c = 0; for (let i = 1; i < g; i++) c += F.size(i); return c; }
function gSumTex(F, g){ return F.size(g) === g ? `1+2+\\cdots+${g - 1}` : `1+3+\\cdots+${2 * g - 3}`; }
NM_TGEN['md150_groupSeq'] = function (params, rng) {
  const mode = params.mode || 'group';
  const defs = L3('괄호 하나를 군이라 하고 앞에서부터 제1군, 제2군, … 이라 합니다. 괄호를 떼고 늘어놓은 수열을 a₁, a₂, a₃, … 이라 합니다. ',
    'Each pair of brackets is a group, numbered group 1, group 2, … from the front. Removing the brackets gives the sequence a₁, a₂, a₃, …. ',
    '一个括号叫一个群，从前往后依次叫第1群、第2群……。去掉括号排成的数列记为a₁, a₂, a₃, …。');
  const K = Object.keys(GF);

  if (mode === 'pos') {
    const prompt = L3(defs.ko + '어떤 수가 들어 있는 군에서 그 수가 앞에서 h 번째이면 h 로 씁니다. 군마다 몇 개씩 들어 있는지로 앞 군까지의 항의 수를 먼저 셉니다.',
      defs.en + 'If a number is the h-th term of its group, write h. First count the terms in all earlier groups from the group sizes.',
      defs.zh + '若某数是它所在群中从前往后的第h个，记为h。先按每群的个数数出前面各群共有多少项。');
    const kind = pick(rng, ['val', 'val', 'am', 'frac']);
    if (kind === 'val') {
      const key = pick(rng, K.filter(k => GF[k].uniq)), F = GF[key], g = R(rng, 5, 25), h = R(rng, 1, F.size(g)), N = F.term(g, h);
      return item(prompt, `${F.tex}:\\ ${N}\\ \\Rightarrow\\ h=\\square`, h, [
        { tex:`g=${g}:\\ ${F.term(g, 1)},\\ ${F.term(g, 2)},\\ \\cdots` },
        { tex:'h=\\square', blank:h }]);
    }
    if (kind === 'frac') {
      const F = GF.frac, m = R(rng, 20, 300), L = gLocate(F, m);
      return item(prompt, `${F.tex}\\ \\Rightarrow\\ a_{${m}}=\\frac{\\square}{${L.g}}`, L.h, [
        { tex:`${gSumTex(F, L.g)}=${L.before}` },
        { tex:`${m}-${L.before}=${L.h}` },
        { tex:`a_{${m}}=\\frac{\\square}{${L.g}}`, blank:L.h }]);
    }
    const key = pick(rng, ['up', 'down', 'mul']), F = GF[key], m = R(rng, 20, 300), L = gLocate(F, m), v = F.term(L.g, L.h);
    return item(prompt, `${F.tex}\\ \\Rightarrow\\ a_{${m}}=\\square`, v, [
      { tex:`${gSumTex(F, L.g)}=${L.before}` },
      { tex:`a_{${m}}:\\ g=${L.g},\\ h=${L.h}` },
      { tex:`a_{${m}}=\\square`, blank:v }]);
  }

  if (mode === 'gsum') {
    const prompt = L3(defs.ko + '제 g 군에 있는 수의 합을 T_g 로 씁니다. 군의 첫 항과 항의 수로 한 군의 합을 구하고, 여러 군은 Σ 로 더합니다.',
      defs.en + 'Write T_g for the sum of the numbers in group g. Find one group’s sum from its first term and number of terms, and add several groups with Σ.',
      defs.zh + '第g群中各数之和记为T_g。由群的首项与项数求一个群的和，多个群用Σ相加。');
    for (let t = 0; t < 400; t++) {
      if (pick(rng, [0, 1])) {
        const key = pick(rng, K), F = GF[key];
        let g = R(rng, 4, 20), T;
        if (F.frac) { g = 2 * R(rng, 2, 12) + 1; T = (g + 1) / 2; }
        else { T = 0; for (let h = 1; h <= F.size(g); h++) T += F.term(g, h); }
        if (T > 100000) continue;
        return item(prompt, `${F.tex}\\ \\Rightarrow\\ T_{${g}}=\\square`, T, [
          { tex:`T_{${g}}=${F.frac ? `\\frac{1+2+\\cdots+${g}}{${g}}` : `${F.term(g, 1)}+\\cdots+${F.term(g, F.size(g))}`}` },
          { tex:`T_{${g}}=\\square`, blank:T }]);
      }
      const key = pick(rng, K.filter(k => !GF[k].frac)), F = GF[key], m = R(rng, 12, 100), L = gLocate(F, m);
      let S = 0; for (let g = 1; g <= L.g; g++) for (let h = 1; h <= F.size(g); h++) { if (gBefore(F, g) + h > m) break; S += F.term(g, h); }
      if (S > 100000) continue;
      return item(prompt, `${F.tex}\\ \\Rightarrow\\ a_1+a_2+\\cdots+a_{${m}}=\\square`, S, [
        { tex:`a_{${m}}:\\ g=${L.g},\\ h=${L.h}` },
        { tex:`T_1+\\cdots+T_{${L.g - 1}}+(${F.term(L.g, 1)}+\\cdots+${F.term(L.g, L.h)})` },
        { tex:'\\square', blank:S }]);
    }
  }

  /* group(기본) — 몇 번째 군 */
  const prompt = L3(defs.ko + '어떤 수(또는 aₘ)가 들어 있는 군을 제 g 군이라 합니다. 제 g 군까지의 항의 수(또는 마지막 수)로 범위를 잡아 g 를 찾습니다.',
    defs.en + 'The group containing a number (or aₘ) is group g. Bound it using the number of terms (or the last number) up to group g, and find g.',
    defs.zh + '某数(或aₘ)所在的群叫第g群。用到第g群为止的项数(或最后一个数)夹出范围，求g。');
  if (pick(rng, [0, 1])) {
    const key = pick(rng, K.filter(k => GF[k].uniq)), F = GF[key], g = R(rng, 5, 30), h = R(rng, 1, F.size(g)), N = F.term(g, h);
    const last = gg => F.term(gg, F.size(gg));
    return item(prompt, `${F.tex}:\\ ${N}\\ \\Rightarrow\\ g=\\square`, g, [
      { tex:`${last(g - 1)}<${N}\\le${last(g)}` },
      { tex:'g=\\square', blank:g }]);
  }
  const key = pick(rng, K), F = GF[key], m = R(rng, 20, 400), L = gLocate(F, m);
  return item(prompt, `${F.tex}:\\ a_{${m}}\\ \\Rightarrow\\ g=\\square`, L.g, [
    { tex:`${L.before}<${m}\\le${L.before + F.size(L.g)}` },
    { tex:'g=\\square', blank:L.g }]);
};

/* ── MD151 — 수열의 귀납적 정의 ── */
function iterate(first, step, k){ const a = first.slice(); while (a.length < k) a.push(step(a)); return a; }
NM_TGEN['md151_recDef'] = function (params, rng) {
  const mode = params.mode || 'arith';

  if (mode === 'geo') {
    const prompt = L3('aₙ₊₁=raₙ, aₙ₊₁÷aₙ=r, aₙ₊₁²=aₙaₙ₊₂ 는 모두 공비가 r 인 등비수열을 뜻합니다. 첫째항과 공비를 찾아 aₖ=a₁rᵏ⁻¹ 로 계산합니다.',
      'aₙ₊₁=raₙ, aₙ₊₁÷aₙ=r and aₙ₊₁²=aₙaₙ₊₂ all describe a geometric sequence with ratio r. Find the first term and ratio, then use aₖ=a₁rᵏ⁻¹.',
      'aₙ₊₁=raₙ、aₙ₊₁÷aₙ=r、aₙ₊₁²=aₙaₙ₊₂都表示公比为r的等比数列。求出首项与公比，再用aₖ=a₁rᵏ⁻¹计算。');
    for (let g = 0; g < 400; g++) {
      const r = pick(rng, [2, 3, -2, -3, 4, 5, 2, 3]), a1 = nz(rng, 1, 6), k = R(rng, 4, 9), ak = a1 * r ** (k - 1);
      if (Math.abs(ak) > 200000) continue;
      const kind = pick(rng, ['r', 'q', 'mid', 'rev', 'half']);
      if (kind === 'half') {
        const e = R(rng, 4, 9), c = pick(rng, [1, 3, 5]), b1 = c * 2 ** e, kk = R(rng, 2, e + 1), v = b1 / 2 ** (kk - 1);
        return item(prompt, `a_1=${b1},\\ a_{n+1}=\\frac{1}{2}a_n\\ \\Rightarrow\\ a_{${kk}}=\\square`, v, [
          { tex:`a_{${kk}}=${b1}\\times\\bigl(\\frac{1}{2}\\bigr)^{${kk - 1}}` },
          { tex:`a_{${kk}}=\\square`, blank:v }]);
      }
      const def = kind === 'q' ? `a_1=${a1},\\ \\frac{a_{n+1}}{a_n}=${r}` :
        kind === 'mid' ? `a_1=${a1},\\ a_2=${a1 * r},\\ a_{n+1}^{2}=a_na_{n+2}` : `a_1=${a1},\\ a_{n+1}=${r}a_n`;
      const sol0 = { tex:`a_n=${a1}\\times${par(r)}^{n-1}` };
      if (kind === 'rev') {
        return item(prompt, `${def},\\ a_k=${ak}\\ \\Rightarrow\\ k=\\square`, k, [sol0, { tex:`${par(r)}^{k-1}=${ak / a1}` }, { tex:'k=\\square', blank:k }]);
      }
      return item(prompt, `${def}\\ \\Rightarrow\\ a_{${k}}=\\square`, ak, [sol0, { tex:`a_{${k}}=\\square`, blank:ak }]);
    }
  }

  if (mode === 'two') {
    const prompt = L3('앞의 항으로 다음 항이 정해지므로 n=1, 2, 3, … 을 차례로 넣어 봅니다. 같은 값이 되풀이되면 주기를 찾아 큰 번호의 항도 구합니다.',
      'Each term is fixed by the earlier ones, so substitute n=1, 2, 3, … in order. If the values repeat, find the period and use it for terms far along.',
      '后项由前项决定，所以依次代入n=1, 2, 3, …。若数值循环出现，求出周期，再求序号很大的项。');
    for (let g = 0; g < 400; g++) {
      const kind = pick(rng, ['lin2', 'lin2', 'per6', 'inv', 'sum2']);
      if (kind === 'lin2') {
        const p = pick(rng, [1, 1, 2, 3]), q = pick(rng, [1, 2, -1]), a1 = R(rng, -3, 5), a2 = R(rng, -3, 6), k = R(rng, 5, 8);
        const A = iterate([a1, a2], a => p * a[a.length - 1] + q * a[a.length - 2], k), v = A[k - 1];
        if (Math.abs(v) > 5000 || a1 === a2 && a1 === 0) continue;
        return item(prompt, `a_1=${a1},\\ a_2=${a2},\\ a_{n+2}=${terms([[p, 'a_{n+1}'], [q, 'a_n']])}\\ \\Rightarrow\\ a_{${k}}=\\square`, v, [
          { tex:`a_3=${A[2]},\\ a_4=${A[3]},\\ a_5=${A[4]}` },
          { tex:`a_{${k}}=\\square`, blank:v }]);
      }
      if (kind === 'per6') {
        const a1 = nz(rng, 1, 9), a2 = nz(rng, 1, 9), k = R(rng, 20, 120), A = iterate([a1, a2], a => a[a.length - 1] - a[a.length - 2], 8);
        if (pick(rng, [0, 1])) {
          const v = A[(k - 1) % 6];
          return item(prompt, `a_1=${a1},\\ a_2=${a2},\\ a_{n+2}=a_{n+1}-a_n\\ \\Rightarrow\\ a_{${k}}=\\square`, v, [
            { tex:`a_3=${A[2]},\\ a_4=${A[3]},\\ a_5=${A[4]},\\ a_6=${A[5]},\\ a_7=${A[6]}` },
            { tex:`${k}=6\\times${Math.floor((k - 1) / 6)}+${(k - 1) % 6 + 1}` },
            { tex:`a_{${k}}=\\square`, blank:v }]);
        }
        const r = k % 6, S = sumOf(A.slice(0, r));
        return item(prompt, `a_1=${a1},\\ a_2=${a2},\\ a_{n+2}=a_{n+1}-a_n\\ \\Rightarrow\\ a_1+a_2+\\cdots+a_{${k}}=\\square`, S, [
          { tex:`a_1+a_2+\\cdots+a_6=0` },
          { tex:`${k}=6\\times${Math.floor(k / 6)}+${r}` },
          { tex:'\\square', blank:S }]);
      }
      if (kind === 'inv') {
        const a1 = nz(rng, 1, 9), c = a1 * nz(rng, 1, 9), k = R(rng, 10, 99), v = k % 2 ? a1 : c / a1;
        if (a1 * a1 === c) continue;
        return item(prompt, `a_1=${a1},\\ a_na_{n+1}=${c}\\ \\Rightarrow\\ a_{${k}}=\\square`, v, [
          { tex:`a_2=\\frac{${c}}{${par(a1)}}=${c / a1},\\ a_3=${a1}` },
          { tex:`a_{${k}}=\\square`, blank:v }]);
      }
      const a1 = R(rng, -9, 9), c = nz(rng, 1, 15), m = R(rng, 5, 40);
      if (pick(rng, [0, 1])) {
        const k = R(rng, 10, 99), v = k % 2 ? a1 : c - a1;
        return item(prompt, `a_1=${a1},\\ a_{n+1}+a_n=${c}\\ \\Rightarrow\\ a_{${k}}=\\square`, v, [
          { tex:`a_2=${c - a1},\\ a_3=${a1}` },
          { tex:`a_{${k}}=\\square`, blank:v }]);
      }
      const S = c * m;
      return item(prompt, `a_1=${a1},\\ a_{n+1}+a_n=${c}\\ \\Rightarrow\\ a_1+a_2+\\cdots+a_{${2 * m}}=\\square`, S, [
        { tex:`(a_1+a_2)+(a_3+a_4)+\\cdots=${c}\\times${m}` },
        { tex:'\\square', blank:S }]);
    }
  }

  /* arith(기본) */
  const prompt = L3('aₙ₊₁=aₙ+d, aₙ₊₁−aₙ=d, 2aₙ₊₁=aₙ+aₙ₊₂ 는 모두 공차가 d 인 등차수열을 뜻합니다. 첫째항과 공차를 찾아 aₖ=a₁+(k−1)d 로 계산합니다.',
    'aₙ₊₁=aₙ+d, aₙ₊₁−aₙ=d and 2aₙ₊₁=aₙ+aₙ₊₂ all describe an arithmetic sequence with common difference d. Find the first term and difference, then use aₖ=a₁+(k−1)d.',
    'aₙ₊₁=aₙ+d、aₙ₊₁−aₙ=d、2aₙ₊₁=aₙ+aₙ₊₂都表示公差为d的等差数列。求出首项与公差，再用aₖ=a₁+(k−1)d计算。');
  const a1 = R(rng, -20, 30), d = nz(rng, 1, 9), k = R(rng, 8, 40), ak = a1 + (k - 1) * d;
  const kind = pick(rng, ['add', 'diff', 'mid', 'rev', 'sum']);
  let def;
  if (kind === 'mid') {
    const j = R(rng, 3, 6);
    def = `a_1=${a1},\\ a_{${j}}=${a1 + (j - 1) * d},\\ 2a_{n+1}=a_n+a_{n+2}`;
  } else def = kind === 'diff' ? `a_1=${a1},\\ a_{n+1}-a_n=${d}` : `a_1=${a1},\\ a_{n+1}=a_n${more(d, '')}`;
  const sol0 = { tex:`a_n=${terms([[d, 'n'], [a1 - d, '']])}` };
  if (kind === 'rev') return item(prompt, `${def},\\ a_k=${ak}\\ \\Rightarrow\\ k=\\square`, k, [sol0, { tex:`${a1}+${par(d)}(k-1)=${ak}` }, { tex:'k=\\square', blank:k }]);
  if (kind === 'sum') {
    const n = R(rng, 5, 20), S = n * (2 * a1 + (n - 1) * d) / 2;
    return item(prompt, `${def}\\ \\Rightarrow\\ a_1+a_2+\\cdots+a_{${n}}=\\square`, S, [sol0, { tex:`\\frac{${n}(${2 * a1}+${n - 1}\\times${par(d)})}{2}` }, { tex:'\\square', blank:S }]);
  }
  return item(prompt, `${def}\\ \\Rightarrow\\ a_{${k}}=\\square`, ak, [sol0, { tex:`a_{${k}}=\\square`, blank:ak }]);
};

/* ── MD152 — 점화식 ── */
function binom(n, r){ let v = 1; for (let i = 1; i <= r; i++) v = v * (n - r + i) / i; return Math.round(v); }
NM_TGEN['md152_recurrence'] = function (params, rng) {
  const mode = params.mode || 'add';

  if (mode === 'mul') {
    const prompt = L3('aₙ₊₁=aₙ·f(n) 이면 aₖ=a₁·f(1)·f(2)·…·f(k−1) 입니다. 분수를 차례로 곱하면 분자와 분모가 엇갈려 지워집니다.',
      'If aₙ₊₁=aₙ·f(n), then aₖ=a₁·f(1)·f(2)·…·f(k−1). Multiplying the fractions in order, numerators and denominators cancel crosswise.',
      '若aₙ₊₁=aₙ·f(n)，则aₖ=a₁·f(1)·f(2)·…·f(k−1)。依次相乘时分子分母交错约去。');
    for (let g = 0; g < 400; g++) {
      const kind = pick(rng, ['up', 'up', 'down', 'pow', 'nform']);
      const k = R(rng, 4, 20);
      if (kind === 'pow') {
        const r = pick(rng, [2, 3]), kk = R(rng, 3, r === 2 ? 6 : 4), a1 = R(rng, 1, 5), v = a1 * r ** (kk * (kk - 1) / 2);
        if (v > 500000) continue;
        return item(prompt, `a_1=${a1},\\ a_{n+1}=${r}^{n}a_n\\ \\Rightarrow\\ a_{${kk}}=\\square`, v, [
          { tex:`\\sum_{i=1}^{${kk - 1}}i=${kk * (kk - 1) / 2}` },
          { tex:`a_{${kk}}=${a1}\\times${r}^{${kk * (kk - 1) / 2}}` },
          { tex:`a_{${kk}}=\\square`, blank:v }]);
      }
      const c = pick(rng, [1, 1, 2, 3]), B = binom(k - 1 + c, c);    /* f(1)…f(k−1) = C(k−1+c, c) */
      if (kind === 'down') {
        const t = R(rng, 1, 6), a1 = B * t;
        if (a1 > 5000) continue;
        return item(prompt, `a_1=${a1},\\ a_{n+1}=\\frac{n}{n${more(c, '')}}a_n\\ \\Rightarrow\\ a_{${k}}=\\square`, t, [
          { tex:`a_{${k}}=${a1}\\times\\frac{1\\times2\\times\\cdots\\times${k - 1}}{${1 + c}\\times${2 + c}\\times\\cdots\\times${k - 1 + c}}` },
          { tex:`a_{${k}}=\\frac{${a1}}{${B}}` },
          { tex:`a_{${k}}=\\square`, blank:t }]);
      }
      const a1 = R(rng, 1, 6), v = a1 * B;
      if (v > 100000) continue;
      const def = kind === 'nform' && c === 1 ? `na_{n+1}=(n+1)a_n` : `a_{n+1}=\\frac{n${more(c, '')}}{n}a_n`;
      return item(prompt, `a_1=${a1},\\ ${def}\\ \\Rightarrow\\ a_{${k}}=\\square`, v, [
        { tex:`a_{${k}}=${a1}\\times\\frac{${1 + c}\\times${2 + c}\\times\\cdots\\times${k - 1 + c}}{1\\times2\\times\\cdots\\times${k - 1}}` },
        { tex:`a_{${k}}=${a1}\\times${B}` },
        { tex:`a_{${k}}=\\square`, blank:v }]);
    }
  }

  if (mode === 'term') {
    const prompt = L3('aₙ₊₁=paₙ+q 는 α=pα+q 인 α 로 aₙ₊₁−α=p(aₙ−α) 꼴의 등비수열로 바꿉니다. 역수를 취하거나 rⁿ 으로 나누어 등차수열로 바꾸는 꼴도 있습니다.',
      'For aₙ₊₁=paₙ+q, use α with α=pα+q to rewrite it as the geometric form aₙ₊₁−α=p(aₙ−α). Other forms become arithmetic after taking reciprocals or dividing by rⁿ.',
      'aₙ₊₁=paₙ+q用满足α=pα+q的α化成aₙ₊₁−α=p(aₙ−α)的等比形式。也有取倒数或除以rⁿ后化成等差数列的形式。');
    for (let g = 0; g < 400; g++) {
      const kind = pick(rng, ['aff', 'aff', 'inv', 'div', 'sn']);
      if (kind === 'aff') {
        const p = pick(rng, [2, 3]), q = nz(rng, 1, 6) * (p === 3 ? 2 : 1), al = q / (1 - p), a1 = R(rng, -5, 8), k = R(rng, 6, 12);
        if (a1 === al) continue;
        const v = al + (a1 - al) * p ** (k - 1);
        if (Math.abs(v) > 500000) continue;
        return item(prompt, `a_1=${a1},\\ a_{n+1}=${p}a_n${more(q, '')}\\ \\Rightarrow\\ a_{${k}}=\\square`, v, [
          { tex:`a_{n+1}${more(-al, '')}=${p}(a_n${more(-al, '')})` },
          { tex:`a_n=${a1 - al}\\times${p}^{n-1}${more(al, '')}` },
          { tex:`a_{${k}}=\\square`, blank:v }]);
      }
      if (kind === 'inv') {
        const c = R(rng, 1, 5), b = pick(rng, [1, 1, 2, 3, 4]), k = R(rng, 5, 40), v = b + (k - 1) * c;
        return item(prompt, `a_1=${b === 1 ? '1' : `\\frac{1}{${b}}`},\\ a_{n+1}=\\frac{a_n}{${c === 1 ? '' : c}a_n+1}\\ \\Rightarrow\\ \\frac{1}{a_{${k}}}=\\square`, v, [
          { tex:`\\frac{1}{a_{n+1}}=\\frac{1}{a_n}+${c}` },
          { tex:`\\frac{1}{a_{${k}}}=${b}+${k - 1}\\times${c}` },
          { tex:`\\frac{1}{a_{${k}}}=\\square`, blank:v }]);
      }
      if (kind === 'div') {
        const r = pick(rng, [2, 3]), c = R(rng, 1, 3), t = R(rng, 1, 4), a1 = r * t, k = R(rng, 3, r === 2 ? 9 : 6);
        const v = r ** k * (t + (k - 1) * c);
        if (v > 500000) continue;
        return item(prompt, `a_1=${a1},\\ a_{n+1}=${r}a_n+${c === 1 ? '' : `${c}\\times`}${r}^{n+1}\\ \\Rightarrow\\ a_{${k}}=\\square`, v, [
          { tex:`\\frac{a_{n+1}}{${r}^{n+1}}=\\frac{a_n}{${r}^{n}}+${c}` },
          { tex:`\\frac{a_{${k}}}{${r}^{${k}}}=${t}+${k - 1}\\times${c}` },
          { tex:`a_{${k}}=\\square`, blank:v }]);
      }
      const c = nz(rng, 1, 9), k = R(rng, 3, 12), v = c * 2 ** (k - 1);
      return item(prompt, `S_n=2a_n${more(-c, '')}\\ \\Rightarrow\\ a_{${k}}=\\square`, v, [
        { tex:`a_1=S_1=2a_1${more(-c, '')},\\ a_1=${c}` },
        { tex:`a_n=S_n-S_{n-1}=2a_n-2a_{n-1},\\ a_n=2a_{n-1}` },
        { tex:`a_{${k}}=\\square`, blank:v }]);
    }
  }

  /* add(기본) — aₙ₊₁=aₙ+f(n) */
  const prompt = L3('aₙ₊₁=aₙ+f(n) 이면 aₖ=a₁+f(1)+f(2)+…+f(k−1)=a₁+Σ_{i=1}^{k−1}f(i) 입니다.',
    'If aₙ₊₁=aₙ+f(n), then aₖ=a₁+f(1)+f(2)+…+f(k−1)=a₁+Σ_{i=1}^{k−1}f(i).',
    '若aₙ₊₁=aₙ+f(n)，则aₖ=a₁+f(1)+f(2)+…+f(k−1)=a₁+Σ_{i=1}^{k−1}f(i)。');
  for (let g = 0; g < 400; g++) {
    const kind = pick(rng, ['lin', 'lin', 'sq', 'pow']), a1 = R(rng, -5, 10);
    let fT, f, kmax = 25;
    if (kind === 'lin') { const p = R(rng, 1, 5), q = R(rng, -4, 6); fT = poly([p, q], 'n'); f = n => p * n + q; }
    else if (kind === 'sq') { const c = R(rng, 1, 3); fT = c === 1 ? 'n^2' : `${c}n^2`; f = n => c * n * n; kmax = 15; }
    else { const r = pick(rng, [2, 3]), c = pick(rng, [1, 1, 2]); fT = `${c === 1 ? '' : `${c}\\times`}${r}^{n}`; f = n => c * r ** n; kmax = r === 2 ? 11 : 8; }
    const k = R(rng, 5, kmax);
    let v = a1; for (let i = 1; i < k; i++) v += f(i);
    const def = pick(rng, [0, 1]) ? `a_{n+1}=a_n+${fT}` : `a_{n+1}-a_n=${fT}`;
    if (pick(rng, [0, 0, 1]) && [...Array(k)].every((_, i) => f(i + 1) > 0)) {
      return item(prompt, `a_1=${a1},\\ ${def},\\ a_k=${v}\\ \\Rightarrow\\ k=\\square`, k, [
        { tex:`a_k=${a1}+\\sum_{i=1}^{k-1}(${fT.replace(/n/g, 'i')})` },
        { tex:'k=\\square', blank:k }]);
    }
    return item(prompt, `a_1=${a1},\\ ${def}\\ \\Rightarrow\\ a_{${k}}=\\square`, v, [
      { tex:`a_{${k}}=${a1}+\\sum_{i=1}^{${k - 1}}(${fT.replace(/n/g, 'i')})` },
      { tex:`a_{${k}}=\\square`, blank:v }]);
  }
};

/* ── MD153 — 수학적 귀납법(빈칸) ── */
function bigPow(b, e){ let v = 1n; for (let i = 0; i < e; i++) v *= BigInt(b); return v; }
function bigFact(n){ let v = 1n; for (let i = 2; i <= n; i++) v *= BigInt(i); return v; }
function bigGcd(a, b){ a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) { [a, b] = [b, a % b]; } return a; }
NM_TGEN['md153_induction'] = function (params, rng) {
  const mode = params.mode || 'base';

  if (mode === 'step') {
    const prompt = L3('n=k 일 때 성립한다고 가정하면, n=k+1 일 때의 좌변은 n=k 일 때의 좌변에 (k+1) 번째 항 하나를 더한 것입니다. 그 더하는 항을 k 에 대한 식으로 정리해 빈칸을 채웁니다.',
      'Assuming the statement for n=k, the left side for n=k+1 is the left side for n=k plus one more term, the (k+1)th. Write that added term in k and fill in the blank.',
      '假设n=k时成立，则n=k+1时的左边等于n=k时的左边再加上第(k+1)项。把所加的项整理成关于k的式子并填空。');
    for (let g = 0; g < 400; g++) {
      /* 빈칸은 분수 밖에 둔다 — 분수 안의 인쇄 상자는 분수선에 붙는다(check-print) */
      const kind = pick(rng, ['lin', 'lin', 'ii', 'ii', 'geo']);
      if (kind === 'lin') {
        const p = R(rng, 1, 6), q = R(rng, -4, 6), c0 = p + 2 * q;
        if (p + q < 1) continue;
        const F = `\\frac{k(${poly([p, c0], 'k')})}{2}`;
        const bl = pick(rng, [0, 1]);
        const add = bl ? `(\\square k${more(p + q, '')})` : `(${p === 1 ? '' : p}k+\\square)`, ans = bl ? p : p + q;
        return item(prompt, `\\sum_{i=1}^{k+1}(${poly([p, q], 'i')})=${F}+${add}`, ans, [
          { tex:`${p === 1 ? '' : p}(k+1)${more(q, '')}=${poly([p, p + q], 'k')}` },
          { tex:'\\square', blank:ans }]);
      }
      if (kind === 'ii') {
        const c = R(rng, 0, 4), b1 = c + 2, b0 = c + 1;
        const f = c === 0 ? 'i^{2}' : `i(i+${c})`;
        const F = `\\frac{k(k+1)(2k${more(1 + 3 * c, '')})}{6}`;
        const bl = pick(rng, [0, 1]), add = bl ? `(k^2+\\square k+${b0})` : `(k^2+${b1}k+\\square)`, ans = bl ? b1 : b0;
        return item(prompt, `\\sum_{i=1}^{k+1}${f}=${F}+${add}`, ans, [
          { tex: c === 0 ? '(k+1)^2=k^2+2k+1' : `(k+1)(k+${c + 1})=k^2+${b1}k+${b0}` },
          { tex:'\\square', blank:ans }]);
      }
      if (kind === 'geo') {
        const r = pick(rng, [2, 3, 4, 5]), a = R(rng, 1, 5), ar = a * r;
        const F = r === 2 ? `${ar}(2^{k}-1)` : `\\frac{${ar}(${r}^{k}-1)}{${r - 1}}`;
        return item(prompt, `\\sum_{i=1}^{k+1}${a === 1 ? '' : `${a}\\times`}${r}^{i}=${F}+\\square\\times${r}^{k}`, ar, [
          { tex:`${a === 1 ? '' : `${a}\\times`}${r}^{k+1}=${ar}\\times${r}^{k}` },
          { tex:'\\square', blank:ar }]);
      }
    }
  }

  if (mode === 'coef') {
    const prompt = L3('n=1 일 때 성립하고, n=k 일 때 성립하면 n=k+1 일 때도 성립하도록 빈칸의 수를 정합니다. n=1, 2 를 넣어 보면 빈칸의 수를 먼저 짐작할 수 있습니다.',
      'Choose the number in the blank so the formula holds for n=1 and, whenever it holds for n=k, also holds for n=k+1. Substituting n=1, 2 lets you guess the number first.',
      '确定空格中的数，使等式在n=1时成立，且n=k时成立则n=k+1时也成立。先代入n=1, 2就能猜出空格中的数。');
    /* 빈칸은 분수 밖에 둔다 — 분수 안의 인쇄 상자는 분수선에 붙는다(check-print). 그래서 분모를 좌변으로 곱해 둔다. */
    for (let g = 0; g < 400; g++) {
      const kind = pick(rng, ['lin', 'lin', 'ii', 'geo', 'geo', 'ag']);
      if (kind === 'lin') {
        const a = R(rng, 1, 6), b = R(rng, -3, 6), c0 = a + 2 * b, bl = c0 > 0 && pick(rng, [0, 1]);
        const rhs = bl ? `n(${a === 1 ? '' : a}n+\\square)` : `n(\\square n${more(c0, '')})`;
        const ans = bl ? c0 : a;
        return item(prompt, `2\\sum_{k=1}^{n}(${poly([a, b], 'k')})=${rhs}`, ans, [
          { tex: bl ? `n=1:\\ 2\\times${par(a + b)}=${a}+${c0}` : `n=1:\\ 2\\times${par(a + b)}=${a}${more(c0, '')}` },
          { tex:'\\square', blank:ans }]);
      }
      if (kind === 'ii') {
        const c = R(rng, 1, 5), f = `k(k+${c})`;
        return item(prompt, `6\\sum_{k=1}^{n}${f}=n(n+1)(2n+\\square)`, 1 + 3 * c, [
          { tex:`n=1:\\ 6\\times${1 + c}=2\\times${4 + 3 * c}` },
          { tex:'\\square', blank:1 + 3 * c }]);
      }
      if (kind === 'geo') {
        const r = pick(rng, [3, 4, 5, 6, 7]), c = R(rng, 1, 6), bl = pick(rng, [0, 1]);
        const term = `${c === 1 ? '' : `${c}\\times`}${r}^{k-1}`, pw = c === 1 ? `${r}^{n}-1` : `${c}(${r}^{n}-1)`;
        const tex = bl ? `\\square\\times\\sum_{k=1}^{n}${term}=${pw}` : `${r - 1}\\sum_{k=1}^{n}${term}=\\square(${r}^{n}-1)`;
        const ans = bl ? r - 1 : c;
        return item(prompt, tex, ans, [
          { tex:`n=1:\\ ${r - 1}\\times${c}=${c}\\times(${r}-1)` },
          { tex:'\\square', blank:ans }]);
      }
      const c = R(rng, 1, 6);
      return item(prompt, `\\sum_{k=1}^{n}${c === 1 ? '' : c}k\\cdot2^{k}=${c === 1 ? '' : c}(n-1)2^{n+1}+\\square`, 2 * c, [
        { tex:`n=1:\\ ${c === 1 ? '' : `${c}\\times`}2=0\\times4+${2 * c}` },
        { tex:'\\square', blank:2 * c }]);
    }
  }

  /* base(기본) — 첫 단계의 값 */
  const prompt = L3('수학적 귀납법은 처음 값에서 확인하고 한 칸씩 넘어갑니다. n₀ 은 "n≥n₀ 인 모든 자연수 n 에서 부등식이 성립하는" 가장 작은 자연수이고, d 는 모든 자연수 n 에서 f(n) 을 나누어떨어지게 하는 가장 큰 자연수입니다.',
    'Induction checks the first value and then moves one step at a time. n₀ is the smallest natural number such that the inequality holds for every natural number n≥n₀, and d is the largest natural number that divides f(n) for every natural number n.',
    '数学归纳法先验证最初的值，再一步步推进。n₀是使"对所有n≥n₀的自然数n不等式都成立"的最小自然数，d是对所有自然数n都整除f(n)的最大自然数。');
  for (let g = 0; g < 400; g++) {
    if (pick(rng, [0, 1])) {
      /* 부등식 — n₀ */
      const kind = pick(rng, ['sq', 'lin', 'fact', 'cube']), ge = pick(rng, [0, 0, 1]);
      let tex, L, Rr;
      if (kind === 'sq') { const c = R(rng, -3, 12); tex = `2^{n}${ge ? '\\ge' : '>'}n^{2}${more(c, '')}`; L = n => bigPow(2, n); Rr = n => BigInt(n * n + c); }
      else if (kind === 'lin') { const b = pick(rng, [2, 3]), a = R(rng, 2, 12), c = R(rng, -5, 10); tex = `${b}^{n}${ge ? '\\ge' : '>'}${poly([a, c], 'n')}`; L = n => bigPow(b, n); Rr = n => BigInt(a * n + c); }
      else if (kind === 'fact') { const b = pick(rng, [2, 3, 4]); tex = `n!${ge ? '\\ge' : '>'}${b}^{n}`; L = n => bigFact(n); Rr = n => bigPow(b, n); }
      else { const b = pick(rng, [2, 3]), c = R(rng, -2, 6); tex = `${b}^{n}${ge ? '\\ge' : '>'}n^{3}${more(c, '')}`; L = n => bigPow(b, n); Rr = n => BigInt(n) ** 3n + BigInt(c); }
      const ok = n => ge ? L(n) >= Rr(n) : L(n) > Rr(n);
      let n0 = 1; for (let n = 1; n <= 60; n++) if (!ok(n)) n0 = n + 1;
      if (n0 < 2 || n0 > 40) continue;
      return item(prompt, `${tex}\\ (n\\ge n_0)\\ \\Rightarrow\\ n_0=\\square`, n0, [
        { tex:`n=${n0 - 1}:\\ ${L(n0 - 1)}${ge ? '<' : '\\le'}${Rr(n0 - 1)}` },
        { tex:`n=${n0}:\\ ${L(n0)}${ge ? '\\ge' : '>'}${Rr(n0)}` },
        { tex:'n_0=\\square', blank:n0 }]);
    }
    /* 배수 — d */
    const kind = pick(rng, ['ab', 'ab', 'lin', 'cube', 'mix']);
    let tex, f;
    if (kind === 'ab') {
      const a = R(rng, 3, 11), b = R(rng, 1, a - 2);
      tex = b === 1 ? `${a}^{n}-1` : `${a}^{n}-${b}^{n}`; f = n => bigPow(a, n) - bigPow(b, n);
    } else if (kind === 'lin') {
      const a = pick(rng, [3, 4, 5, 6, 7]), c = nz(rng, 1, 12), e = R(rng, -9, 9);
      tex = `${a}^{n}${more(c, 'n')}${more(e, '')}`; f = n => bigPow(a, n) + BigInt(c * n + e);
    } else if (kind === 'cube') {
      const c = pick(rng, [-1, 2, 5, 11, -7, 3, 8]);
      tex = `n^{3}${more(c, 'n')}`; f = n => BigInt(n) ** 3n + BigInt(c * n);
    } else {
      const a = R(rng, 2, 6), b = R(rng, 2, 7), s = R(rng, 0, 2);
      tex = `${a}^{n+${s}}+${b}^{2n-1}`; f = n => bigPow(a, n + s) + bigPow(b, 2 * n - 1);
    }
    let d = 0n; for (let n = 1; n <= 30; n++) { const v = f(n); if (v !== 0n) d = bigGcd(d, v); }
    const dn = Number(d);
    if (dn < 2 || dn > 999) continue;
    return item(prompt, `f(n)=${tex}\\ \\Rightarrow\\ d=\\square`, dn, [
      { tex:`f(1)=${f(1)},\\ f(2)=${f(2)}` },
      { tex:'d=\\square', blank:dn }]);
  }
};

if (typeof module !== 'undefined' && module.exports) module.exports = NM_TGEN;
})();
