/* ============================================================
   Numbers of Magic — MD134~MD143 대수 새 유형 생성기 1차 (2026-09-29)
   근거: docs/high-build-spec.md (대수 새 유형 목록 앞 10개).
   교재(교과연산 L)는 챕터 제목만 근거로 쓰고, 문제는 전부 새로 만든다.

   MD134 a^x+a^−x 꼴 식의 값          sq · cube · diff
   MD135 상용로그                    int · digits · decimal
   MD136 지수함수의 그래프·대소        point(2칸) · move · order
   MD137 지수함수의 최대·최소          range(2칸) · quad(2칸) · coef
   MD138 로그함수의 그래프·대소        point(2칸) · move · order
   MD139 로그함수의 최대·최소          range(2칸) · quad(2칸) · coef
   MD140 일반각과 호도법              convert · quad(문장제) · coterm
   MD141 부채꼴의 호의 길이와 넓이     arc · area · max
   MD142 삼각함수의 정의·관계          point · pyth · sumprod
   MD143 그래프의 미정계수·각의 변환    coef(2칸) · value · simplify

   계약: NM_TGEN[gen](params, rng), Math.random 금지. 답은 정수 또는 정수 배열.
   **답을 먼저 고르고 식을 역산한다** — 지수·로그의 값이 정수가 되는 점과 구간을 먼저 정하고,
   상용로그는 주어진 네 자리 값으로 계산해도, 참값으로 계산해도 정수 부분이 같은 수만 낸다
   (소수 부분이 0.02~0.98 안). 라디안은 "π 의 몇 배"(분모는 문제에 보인다)나 도(°)로 묻는다.
   인쇄물은 tex 만 싣는다 — 그래서 tex 만 보고도 무엇을 구하는지 알 수 있게 쓴다.
   최댓값은 M, 최솟값은 m, 주기는 p(레벨 개념에서 정의). 풀이 마지막 단계의 blank = 답 전체.
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
function cf(c, body){ return c === 1 ? body : c === -1 ? `-${body}` : `${c}${body}`; }
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
function gcd(a, b){ a = Math.abs(a); b = Math.abs(b); while(b){ [a, b] = [b, a % b]; } return a; }
function mod(a, n){ return ((a % n) + n) % n; }
/* p/q π — 약분한 꼴로 */
function radTex(p, q){
  const g = gcd(p, q) || 1; p /= g; q /= g;
  const sg = p < 0 ? '-' : '', a = Math.abs(p);
  if(q === 1) return a === 1 ? `${sg}\\pi` : `${sg}${a}\\pi`;
  return a === 1 ? `${sg}\\frac{\\pi}{${q}}` : `${sg}\\frac{${a}}{${q}}\\pi`;
}
function fracTex(p, q){
  const g = gcd(p, q) || 1; p /= g; q /= g;
  if(q < 0){ p = -p; q = -q; }
  if(q === 1) return String(p);
  return `${p < 0 ? '-' : ''}\\frac{${Math.abs(p)}}{${q}}`;
}

/* 밑 B={a, inv}: inv 이면 1/a. 지수가 정수일 때 값이 정수가 되는 쪽만 쓴다 */
const EMAX = { 2:5, 3:3, 4:3, 5:2, 6:2 };
function mkB(rng, pool, inv){ return { a: pick(rng, pool), inv: inv ? 1 : 0 }; }
function bTex(B){ return B.inv ? `\\bigl(\\frac{1}{${B.a}}\\bigr)` : String(B.a); }
function bSub(B){ return B.inv ? `\\frac{1}{${B.a}}` : String(B.a); }
function sgE(B, e){ return B.inv ? -e : e; }                 /* |지수| e → 실제 지수 */
function xArg(p){ return p === 0 ? 'x' : xMinus(p); }
/* k·B^ex — 밑이 정수면 계수와 붙어 한 수로 읽히지 않게 × 를 쓴다(3×5ˣ, 35ˣ 아님) */
function kPow(B, k, ex){
  const body = `${bTex(B)}^{${ex}}`;
  return B.inv || k === 1 || k === -1 ? cf(k, body) : `${k}\\times${body}`;
}
function expT(B, k, p){ return kPow(B, k, xArg(p)); }
function logT(B, arg){ return `\\log_{${bSub(B)}}${arg}`; }
function lArg(p){ return p === 0 ? 'x' : `(${xMinus(p)})`; }

/* ── MD134 — a^x+a^−x 꼴 식의 값 ── */
function uForm(rng){
  if(pick(rng, [0, 0, 1])){
    const P = n => n === 2 ? 'x' : n === 4 ? 'x^{2}' : `x^{\\frac{${n}}{2}}`;
    const N = n => n === 2 ? 'x^{-1}' : n === 4 ? 'x^{-2}' : `x^{-\\frac{${n}}{2}}`;
    return { P, N, pos:'x>1' };
  }
  const b = pick(rng, [2, 3, 5]), packed = pick(rng, [0, 1]);
  const P = n => n === 1 ? `${b}^{x}` : packed && b ** n <= 125 ? `${b ** n}^{x}` : `${b}^{${n}x}`;
  const N = n => n === 1 ? `${b}^{-x}` : packed && b ** n <= 125 ? `${b ** n}^{-x}` : `${b}^{-${n}x}`;
  return { P, N, pos:'x>0' };
}
NM_TGEN['md134_expSym'] = function (params, rng) {
  const mode = params.mode || 'sq';
  const U = uForm(rng);
  const S = n => `${U.P(n)}+${U.N(n)}`, D = n => `${U.P(n)}-${U.N(n)}`;
  const prompt = L3('aˣ×a⁻ˣ=1 입니다. 곱이 1 인 두 수의 합·차를 제곱하거나 세제곱해 식의 값을 구합니다.',
    'aˣ×a⁻ˣ=1. Square or cube the sum or difference of two numbers whose product is 1 to find the value.',
    'aˣ×a⁻ˣ=1。把积为1的两个数的和或差平方或立方，求式子的值。');

  if (mode === 'cube') {
    const kind = pick(rng, ['sc', 'sc', 'dc', 'dc', 'rs', 'rd']);
    if (kind === 'sc') {
      const k = R(rng, 3, 9), ans = k ** 3 - 3 * k;
      return item(prompt, `${S(1)}=${k}\\ \\Rightarrow\\ ${S(3)}=\\square`, ans, [
        { tex:`${S(3)}=(${S(1)})^3-3(${S(1)})` },
        { tex:`${k}^3-3\\times${k}=\\square`, blank:ans }]);
    }
    if (kind === 'dc') {
      const k = R(rng, 1, 8), ans = k ** 3 + 3 * k;
      return item(prompt, `${D(1)}=${k}\\ \\Rightarrow\\ ${D(3)}=\\square`, ans, [
        { tex:`${D(3)}=(${D(1)})^3+3(${D(1)})` },
        { tex:`${k}^3+3\\times${k}=\\square`, blank:ans }]);
    }
    if (kind === 'rs') {
      const k = R(rng, 3, 12), ans = k * k - 3;
      return item(prompt, `${S(1)}=${k}\\ \\Rightarrow\\ \\frac{${S(3)}}{${S(1)}}=\\square`, ans, [
        { tex:`${S(3)}=(${S(1)})(${U.P(2)}-1+${U.N(2)})` },
        { tex:`${U.P(2)}+${U.N(2)}=${k}^2-2=${k * k - 2}` },
        { tex:`${k * k - 2}-1=\\square`, blank:ans }]);
    }
    const k = R(rng, 1, 10), ans = k * k + 3;
    return item(prompt, `${D(1)}=${k}\\ \\Rightarrow\\ \\frac{${D(3)}}{${D(1)}}=\\square`, ans, [
      { tex:`${D(3)}=(${D(1)})(${U.P(2)}+1+${U.N(2)})` },
      { tex:`${U.P(2)}+${U.N(2)}=${k}^2+2=${k * k + 2}` },
      { tex:`${k * k + 2}+1=\\square`, blank:ans }]);
  }

  if (mode === 'diff') {
    const kind = pick(rng, ['toS', 'toD', 'toD', 'quot', 'four']);
    if (kind === 'toS') {
      const s = R(rng, 3, 11), m = s * s - 2;
      return item(prompt, `${S(2)}=${m}\\ \\Rightarrow\\ ${S(1)}=\\square`, s, [
        { tex:`(${S(1)})^2=${S(2)}+2=${s * s}` },
        { tex:`${S(1)}>0` },
        { tex:`${S(1)}=\\square`, blank:s }]);
    }
    if (kind === 'toD') {
      const d = R(rng, 1, 10), m = d * d + 2;
      return item(prompt, `${S(2)}=${m}\\ (${U.pos})\\ \\Rightarrow\\ ${D(1)}=\\square`, d, [
        { tex:`(${D(1)})^2=${S(2)}-2=${d * d}` },
        { tex:`${U.pos}\\ \\Rightarrow\\ ${D(1)}>0` },
        { tex:`${D(1)}=\\square`, blank:d }]);
    }
    if (kind === 'quot') {
      const m = R(rng, 3, 40);
      if (pick(rng, [0, 1])) {
        return item(prompt, `${S(2)}=${m}\\ \\Rightarrow\\ \\frac{${D(3)}}{${D(1)}}=\\square`, m + 1, [
          { tex:`${D(3)}=(${D(1)})(${U.P(2)}+1+${U.N(2)})` },
          { tex:`${m}+1=\\square`, blank:m + 1 }]);
      }
      return item(prompt, `${S(2)}=${m}\\ \\Rightarrow\\ \\frac{${S(3)}}{${S(1)}}=\\square`, m - 1, [
        { tex:`${S(3)}=(${S(1)})(${U.P(2)}-1+${U.N(2)})` },
        { tex:`${m}-1=\\square`, blank:m - 1 }]);
    }
    const k = R(rng, 3, 6), s2 = k * k - 2, ans = s2 * s2 - 2;
    return item(prompt, `${S(1)}=${k}\\ \\Rightarrow\\ ${S(4)}=\\square`, ans, [
      { tex:`${S(2)}=${k}^2-2=${s2}` },
      { tex:`${S(4)}=${s2}^2-2` },
      { tex:`${s2 * s2}-2=\\square`, blank:ans }]);
  }

  /* sq(기본) — 제곱 */
  const kind = pick(rng, ['s2', 's2', 'dsq', 'd2', 'ssq', 'back']);
  if (kind === 's2' || kind === 'dsq') {
    const k = R(rng, 3, 12);
    if (kind === 's2') {
      const ans = k * k - 2;
      return item(prompt, `${S(1)}=${k}\\ \\Rightarrow\\ ${S(2)}=\\square`, ans, [
        { tex:`(${S(1)})^2=${S(2)}+2` },
        { tex:`${k}^2-2=\\square`, blank:ans }]);
    }
    const ans = k * k - 4;
    return item(prompt, `${S(1)}=${k}\\ \\Rightarrow\\ (${D(1)})^2=\\square`, ans, [
      { tex:`(${D(1)})^2=(${S(1)})^2-4` },
      { tex:`${k}^2-4=\\square`, blank:ans }]);
  }
  if (kind === 'd2' || kind === 'ssq') {
    const k = R(rng, 1, 10);
    if (kind === 'd2') {
      const ans = k * k + 2;
      return item(prompt, `${D(1)}=${k}\\ \\Rightarrow\\ ${S(2)}=\\square`, ans, [
        { tex:`(${D(1)})^2=${S(2)}-2` },
        { tex:`${k}^2+2=\\square`, blank:ans }]);
    }
    const ans = k * k + 4;
    return item(prompt, `${D(1)}=${k}\\ \\Rightarrow\\ (${S(1)})^2=\\square`, ans, [
      { tex:`(${S(1)})^2=(${D(1)})^2+4` },
      { tex:`${k}^2+4=\\square`, blank:ans }]);
  }
  const m = R(rng, 3, 60);
  if (pick(rng, [0, 1])) {
    return item(prompt, `${S(2)}=${m}\\ \\Rightarrow\\ (${S(1)})^2=\\square`, m + 2, [
      { tex:`(${S(1)})^2=${S(2)}+2` },
      { tex:`${m}+2=\\square`, blank:m + 2 }]);
  }
  return item(prompt, `${S(2)}=${m}\\ \\Rightarrow\\ (${D(1)})^2=\\square`, m - 2, [
    { tex:`(${D(1)})^2=${S(2)}-2` },
    { tex:`${m}-2=\\square`, blank:m - 2 }]);
};

/* ── MD135 — 상용로그 ── */
const LOGV = { 2:3010, 3:4771, 7:8451 };                 /* ×10⁻⁴ — 문제에 그대로 준다 */
const CBASE = [[2, [2]], [3, [3]], [5, [5]], [6, [2, 3]], [7, [7]], [12, [2, 2, 3]], [14, [2, 7]],
  [15, [3, 5]], [18, [2, 3, 3]], [21, [3, 7]], [24, [2, 2, 2, 3]], [35, [5, 7]]];
function lg4(fs){ return fs.reduce((s, p) => s + (p === 5 ? 10000 - LOGV[2] : LOGV[p]), 0); }
function givenLog(fs){
  const ps = [...new Set(fs.map(p => p === 5 ? 2 : p))].sort((a, b) => a - b);
  return ps.map(p => `\\log ${p}=0.${LOGV[p]}`).join(',\\ ');
}
function dec4(v){ const s = v < 0 ? '-' : '', a = Math.abs(v); return `${s}${Math.floor(a / 10000)}.${String(a % 10000).padStart(4, '0')}`; }
/* v = log 값 ×10⁻⁴(정수), t = 참값 — 둘의 정수 부분이 같고 경계에서 멀어야 쓴다 */
function safeLog(v, t){
  const f = mod(v, 10000);
  if (f < 200 || f > 9800) return false;
  return Math.floor(v / 10000) === Math.floor(t) && Math.abs(t - Math.round(t)) > 0.01;
}
NM_TGEN['md135_commonLog'] = function (params, rng) {
  const mode = params.mode || 'int';

  if (mode === 'digits') {
    const prompt = L3('10ⁿ⁻¹≤N<10ⁿ 이면 N 은 n 자리의 정수입니다. 주어진 상용로그의 값으로 log N 을 계산해 정수 부분에 1 을 더합니다.',
      'If 10ⁿ⁻¹≤N<10ⁿ, N is an n-digit integer. Compute log N with the given common logarithms and add 1 to its integer part.',
      '若10ⁿ⁻¹≤N<10ⁿ，则N是n位整数。用所给的常用对数值计算log N，把整数部分加1。');
    for (let g = 0; g < 400; g++) {
      let fs, eTex, v, t;
      if (pick(rng, [0, 0, 1])) {
        const [b1, f1] = pick(rng, CBASE.slice(0, 5)), [b2, f2] = pick(rng, CBASE.slice(0, 5));
        if (b1 >= b2) continue;
        const n1 = R(rng, 5, 30), n2 = R(rng, 5, 30);
        fs = f1.concat(f2); eTex = `${b1}^{${n1}}\\times${b2}^{${n2}}`;
        v = n1 * lg4(f1) + n2 * lg4(f2); t = n1 * Math.log10(b1) + n2 * Math.log10(b2);
      } else {
        const [b, f] = pick(rng, CBASE), n = R(rng, 10, 60);
        fs = f; eTex = `${b}^{${n}}`; v = n * lg4(f); t = n * Math.log10(b);
      }
      if (!safeLog(v, t) || v > 990000) continue;
      const ans = Math.floor(v / 10000) + 1;
      return item(prompt, `${givenLog(fs)},\\ 10^{n-1}\\le ${eTex}<10^{n}\\ \\Rightarrow\\ n=\\square`, ans, [
        { tex:`\\log ${eTex}=${dec4(v)}` },
        { tex:`10^{${ans - 1}}\\le ${eTex}<10^{${ans}}` },
        { tex:`n=\\square`, blank:ans }]);
    }
  }

  if (mode === 'decimal') {
    const prompt = L3('0<N<1 에서 10⁻ⁿ≤N<10⁻ⁿ⁺¹ 이면 N 은 소수점 아래 n 째 자리에서 처음으로 0 이 아닌 숫자가 나타납니다. log N 의 정수 부분이 −n 입니다.',
      'For 0<N<1, if 10⁻ⁿ≤N<10⁻ⁿ⁺¹ then the first nonzero digit of N appears in the nth decimal place. The integer part of log N is −n.',
      '当0<N<1且10⁻ⁿ≤N<10⁻ⁿ⁺¹时，N在小数点后第n位首次出现不为0的数字。log N的整数部分是−n。');
    const DEC = [[2, [2]], [3, [3]], [5, [5]], [6, [2, 3]], [7, [7]], [8, [2, 2, 2]]];
    for (let g = 0; g < 400; g++) {
      const kind = pick(rng, ['inv', 'neg', 'dec']);
      let fs, eTex, v, t;
      if (kind === 'dec') {
        const [d, f] = pick(rng, DEC), n = R(rng, 5, 40);
        fs = f; eTex = `(0.${d})^{${n}}`; v = n * (lg4(f) - 10000); t = n * Math.log10(d / 10);
      } else {
        const [b, f] = pick(rng, CBASE), n = R(rng, 5, 40);
        fs = f; v = -n * lg4(f); t = -n * Math.log10(b);
        eTex = kind === 'inv' ? `\\bigl(\\frac{1}{${b}}\\bigr)^{${n}}` : `${b}^{-${n}}`;
      }
      if (!safeLog(v, t) || v < -990000) continue;
      const ans = -Math.floor(v / 10000);
      if (ans < 2) continue;
      return item(prompt, `${givenLog(fs)},\\ 10^{-n}\\le ${eTex}<10^{-n+1}\\ \\Rightarrow\\ n=\\square`, ans, [
        { tex:`\\log ${eTex}=${dec4(v)}=${-ans}+0.${String(mod(v, 10000)).padStart(4, '0')}` },
        { tex:`10^{${-ans}}\\le ${eTex}<10^{${-ans + 1}}` },
        { tex:`n=\\square`, blank:ans }]);
    }
  }

  /* int(기본) — log N 의 정수 부분 */
  const prompt = L3('log N=n+α(n 은 정수, 0≤α<1) 에서 n 을 log N 의 정수 부분, α 를 소수 부분이라 합니다. 주어진 상용로그의 값으로 log N 을 계산합니다.',
    'In log N=n+α (n an integer, 0≤α<1), n is the integer part and α the decimal part of log N. Compute log N with the given common logarithms.',
    '在log N=n+α(n为整数，0≤α<1)中，n叫log N的整数部分，α叫小数部分。用所给的常用对数值计算log N。');
  for (let g = 0; g < 400; g++) {
    const [b, f] = pick(rng, CBASE), n = R(rng, 5, 50), inv = pick(rng, [0, 0, 1]);
    const v = (inv ? -1 : 1) * n * lg4(f), t = (inv ? -1 : 1) * n * Math.log10(b);
    if (!safeLog(v, t) || Math.abs(v) > 990000) continue;
    const ans = Math.floor(v / 10000);
    const eTex = inv ? `\\bigl(\\frac{1}{${b}}\\bigr)^{${n}}` : `${b}^{${n}}`;
    return item(prompt, `${givenLog(f)},\\ \\log ${eTex}=n+\\alpha\\ (0\\le\\alpha<1)\\ \\Rightarrow\\ n=\\square`, ans, [
      { tex:`\\log ${eTex}=${inv ? '-' : ''}${n}\\log ${b}=${dec4(v)}` },
      { tex:`${dec4(v)}=${ans}+0.${String(mod(v, 10000)).padStart(4, '0')}` },
      { tex:`n=\\square`, blank:ans }]);
  }
  return item(prompt, `\\log 2=0.3010,\\ \\log 2^{10}=n+\\alpha\\ (0\\le\\alpha<1)\\ \\Rightarrow\\ n=\\square`, 3,
    [{ tex:`\\log 2^{10}=3.0100` }, { tex:`n=\\square`, blank:3 }]);
};

/* ── 지수·로그 그래프 공용 — 대칭·평행이동 (x,y)→(sx·x+m, sy·y+n) ── */
function mapTex(sx, m, sy, n){
  return `(x,\\,y)\\to(${terms([[sx, 'x'], [m, '']])},\\,${terms([[sy, 'y'], [n, '']])})`;
}
function pickMove(rng){
  const kind = pick(rng, ['t', 't', 'r', 'tr', 'tr']);
  let sx = 1, sy = 1, m = 0, n = 0;
  if (kind !== 't') { do { sx = pick(rng, [1, -1]); sy = pick(rng, [1, -1]); } while (sx === 1 && sy === 1); }
  if (kind !== 'r') { m = R(rng, -5, 5); n = R(rng, -6, 6); if (m === 0 && n === 0) n = nz(rng, 1, 6); }
  return { sx, sy, m, n };
}

/* ── MD136 — 지수함수의 그래프·대소 ── */
/* 대소 비교용 가면 — b^(p/q) 를 다른 모양으로 */
function powMask(b, p, q, type){
  const e = (num, den) => fracTex(num, den);
  const pw = (base, num, den) => e(num, den) === '1' ? String(base) : `${base}^{${e(num, den)}}`;
  if (type === 'root') {
    const inner = p > 0 ? String(b ** p) : `\\frac{1}{${b ** -p}}`;
    return q === 2 ? `\\sqrt{${inner}}` : `\\sqrt[${q}]{${inner}}`;
  }
  if (type === 'sq') return pw(b * b, p, 2 * q);
  if (type === 'cube') return pw(b ** 3, p, 3 * q);
  if (type === 'inv') return e(-p, q) === '1' ? `\\frac{1}{${b}}` : `\\bigl(\\frac{1}{${b}}\\bigr)^{${e(-p, q)}}`;
  return pw(b, p, q);
}
function maskTypes(b, p, q){
  const t = ['sq', 'inv', 'plain'];
  if (q > 1 && Math.abs(p) <= (b === 2 ? 7 : 4)) t.push('root', 'root');
  if (b === 2) t.push('cube');
  return t;
}
NM_TGEN['md136_expGraph'] = function (params, rng) {
  const mode = params.mode || 'point';

  if (mode === 'move') {
    const B = mkB(rng, [2, 3, 4, 5], pick(rng, [0, 0, 1]));
    const { sx, sy, m, n } = pickMove(rng);
    const e = R(rng, 0, EMAX[B.a]), ex = sgE(B, e);          /* f(c) 의 지수 sx(c−m)=ex */
    const c = m + sx * ex, ans = sy * B.a ** e + n;
    const inner = sx > 0 ? xArg(m) : terms([[-1, 'x'], [m, '']]);
    const img = `${cf(sy, `${bTex(B)}^{${inner}}`)}${more(n, '')}`;
    return item(
      L3('점 (x, y) 를 화살표 위의 점으로 옮기는 이동으로 y=aˣ 의 그래프를 옮긴 그래프가 y=f(x) 입니다. 옮긴 점을 (X, Y) 로 놓고 x, y 를 X, Y 로 나타내 원래 식에 넣습니다.',
         'Moving each point (x, y) as shown over the arrow sends the graph of y=aˣ to the graph of y=f(x). Call the new point (X, Y), write x and y in terms of X and Y, and substitute into the original equation.',
         '按箭头上的方式移动每个点(x, y)，y=aˣ的图像变为y=f(x)的图像。设新点为(X, Y)，用X、Y表示x、y后代入原式。'),
      `y=${bTex(B)}^{x}\\ \\xrightarrow{${mapTex(sx, m, sy, n)}}\\ y=f(x)\\ \\Rightarrow\\ f(${c})=\\square`, ans, [
        { tex:`f(x)=${img}` },
        { tex:`f(${c})=${cf(sy, `${bTex(B)}^{${ex}}`)}${more(n, '')}` },
        { tex:`f(${c})=\\square`, blank:ans }]);
  }

  if (mode === 'order') {
    const b = pick(rng, [2, 2, 3]);
    for (let g = 0; g < 400; g++) {
      const q1 = pick(rng, [1, 2, 3, 4]), p1 = R(rng, -3 * q1, 3 * q1);
      const D = R(rng, 1, 3), q3 = q1, p3 = p1 + D * q1;
      const q2 = pick(rng, [2, 3, 4, 6]), p2 = R(rng, Math.ceil(p1 * q2 / q1), Math.floor(p3 * q2 / q1));
      const es = [[p1, q1], [p2, q2], [p3, q3]].map(([p, q]) => { const d = gcd(p, q) || 1; return [p / d, q / d]; });
      const vals = es.map(([p, q]) => p / q);
      if (!(vals[0] < vals[1] && vals[1] < vals[2]) || es.some(([p]) => p === 0)) continue;
      if (es.some(([, q]) => q === 1) && es.every(([, q]) => q === 1)) continue;
      const types = [];
      const texs = es.map(([p, q]) => {
        const ok = maskTypes(b, p, q).filter(t => !types.includes(t) || types.length >= 3);
        const t = pick(rng, ok.length ? ok : ['plain']); types.push(t);
        return powMask(b, p, q, t);
      });
      if (new Set(texs).size < 3 || texs.some(s => s.length > 40)) continue;
      const prod = (2 * p1) % q1 === 0 && pick(rng, [0, 1]);
      const ans = prod ? (2 * p1 + D * q1) / q1 : D;
      const order = shuffle(rng, [0, 1, 2]);
      const lab = ['A', 'B', 'C'];
      const list = order.map((i, j) => `${lab[j]}=${texs[i]}`).join(',\\ ');
      const eL = es.map(([p, q]) => `${b}^{${fracTex(p, q)}}`);
      return item(
        L3('세 수를 모두 같은 밑의 거듭제곱으로 고친 뒤 지수를 비교합니다. 밑이 1 보다 크면 지수가 클수록 큰 수입니다. 가장 큰 수를 M, 가장 작은 수를 m 이라 합니다.',
           'Rewrite all three numbers as powers of the same base and compare exponents; with a base greater than 1, a larger exponent means a larger number. Call the largest M and the smallest m.',
           '把三个数都化成同底数的幂再比较指数；底数大于1时指数越大数越大。最大的数记为M，最小的数记为m。'),
        `${list}\\ \\Rightarrow\\ M${prod ? '\\times' : '\\div'} m=${b}^{\\square}`, ans, [
          { tex:`${eL[0]}<${eL[1]}<${eL[2]}` },
          { tex:`M=${eL[2]},\\ m=${eL[0]}` },
          { tex:`M${prod ? '\\times' : '\\div'} m=${b}^{\\square}`, blank:ans }]);
    }
  }

  /* point(기본) — 지나는 점과 점근선(2칸) */
  const B = mkB(rng, [2, 3, 4, 5], pick(rng, [0, 0, 1]));
  const k = pick(rng, [1, 1, 1, 2, 3, -1, -2]), p = R(rng, -4, 4), q = R(rng, -6, 6);
  const e = R(rng, 0, EMAX[B.a]), x0 = p + sgE(B, e), y0 = k * B.a ** e + q;
  const f = `${expT(B, k, p)}${more(q, '')}`;
  return item(
    L3('y=k·aˣ⁻ᵖ+q 의 그래프에서 x 에 값을 넣어 지나는 점의 y좌표를 구합니다. 점근선은 x 가 한쪽으로 한없이 갈 때 그래프가 다가가는 직선 y=q 입니다.',
       'On the graph of y=k·aˣ⁻ᵖ+q, substitute x to find the y-coordinate of a point. The asymptote is the line y=q that the graph approaches as x goes far in one direction.',
       '在y=k·aˣ⁻ᵖ+q的图像上代入x求点的纵坐标。渐近线是x向一侧无限变化时图像无限接近的直线y=q。'),
    `y=${f}\\ \\Rightarrow\\ (${x0},\\ \\square),\\ y=\\square`, [y0, q], [
      { tex:`x=${x0}:\\ y=${kPow(B, k, sgE(B, e))}${more(q, '')}=${y0}` },
      { tex:`${bTex(B)}^{${xArg(p)}}>0` },
      { tex:`(${x0},\\ \\square),\\ y=\\square`, blank:[y0, q] }]);
};

/* ── MD137 — 지수함수의 최대·최소 ── */
function eRange(rng, B){
  const em = EMAX[B.a]; let e1, e2;
  do { e1 = R(rng, 0, em); e2 = R(rng, 0, em); } while (e1 === e2);
  if (e1 > e2) [e1, e2] = [e2, e1];
  return [e1, e2];
}
/* t=bˣ 로 바꾼 이차식 t²−Ct+c 의 식 */
function quadExp(rng, b, C, cTex){
  const first = pick(rng, [0, 1]) ? `${b * b}^{x}` : `${b}^{2x}`;
  let s = 0; for (let v = C; v > 1 && v % b === 0; v /= b) s++;
  const second = b ** s === C && s >= 1 && pick(rng, [0, 1]) ? `-${b}^{x+${s}}` : `-${C}\\times${b}^{x}`;
  return `${first}${second}${cTex}`;
}
NM_TGEN['md137_expMaxMin'] = function (params, rng) {
  const mode = params.mode || 'range';

  if (mode === 'quad') {
    const b = pick(rng, [2, 2, 3]), x1 = R(rng, 0, 1), x2 = R(rng, x1 + 1, b === 2 ? 4 : 2);
    const tl = b ** x1, th = b ** x2;
    const inside = pick(rng, [1, 1, 1, 1, 0]);
    const t0 = inside ? R(rng, tl, th) : (tl > 1 ? R(rng, 1, tl - 1) : R(rng, th + 1, th + 3));
    const c = R(rng, -9, 9), C = 2 * t0;
    const g = t => t * t - C * t + c;
    const M = Math.max(g(tl), g(th)), m = t0 >= tl && t0 <= th ? c - t0 * t0 : Math.min(g(tl), g(th));
    return item(
      L3('bˣ=t 로 놓으면 b²ˣ=t² 이므로 t 에 대한 이차함수가 됩니다. x 의 범위에서 t 의 범위를 먼저 구하고, 꼭짓점이 그 안에 있는지 봅니다.',
         'Put bˣ=t; then b²ˣ=t², so the function becomes quadratic in t. First find the range of t from the range of x, then check whether the vertex lies inside it.',
         '令bˣ=t，则b²ˣ=t²，函数变成关于t的二次函数。先由x的范围求出t的范围，再看顶点是否在其中。'),
      `y=${quadExp(rng, b, C, more(c, ''))}\\ (${x1}\\le x\\le ${x2})\\ \\Rightarrow\\ M=\\square,\\ m=\\square`, [M, m], [
        { tex:`t=${b}^{x}\\ (${tl}\\le t\\le ${th})` },
        { tex:`y=${poly([1, -C, c], 't')}=(${xMinus(t0, 't')})^2${more(c - t0 * t0, '')}` },
        { tex:`M=\\square,\\ m=\\square`, blank:[M, m] }]);
  }

  if (mode === 'coef') {
    const kind = pick(rng, ['shift', 'shift', 'quad', 'base', 'base']);
    const prompt = L3('지수함수는 밑이 1 보다 크면 증가하고, 0 과 1 사이이면 감소합니다. 주어진 최댓값 M 또는 최솟값 m 이 어느 끝에서 나오는지 정한 뒤 식을 세웁니다.',
      'An exponential function increases if its base is greater than 1 and decreases if the base is between 0 and 1. Decide at which end the given greatest value M or least value m occurs, then set up an equation.',
      '指数函数底数大于1时递增，在0与1之间时递减。先判断所给最大值M或最小值m在哪一端取得，再列方程。');
    if (kind === 'shift') {
      const B = mkB(rng, [2, 3, 4, 5], pick(rng, [0, 0, 1])), s = pick(rng, [1, 1, 2, 3]), p = R(rng, -4, 4);
      const [e1, e2] = eRange(rng, B), k = R(rng, -9, 9), askM = pick(rng, [0, 1]);
      const xs = [p + sgE(B, e1), p + sgE(B, e2)].sort((a, b) => a - b);
      const val = askM ? s * B.a ** e2 + k : s * B.a ** e1 + k;
      return item(prompt, `y=${expT(B, s, p)}+k\\ (${xs[0]}\\le x\\le ${xs[1]}),\\ ${askM ? 'M' : 'm'}=${val}\\ \\Rightarrow\\ k=\\square`, k, [
        { tex:`x=${p + sgE(B, askM ? e2 : e1)}:\\ ${askM ? 'M' : 'm'}=${kPow(B, s, sgE(B, askM ? e2 : e1))}+k` },
        { tex:`${s * B.a ** (askM ? e2 : e1)}+k=${val}` },
        { tex:`k=\\square`, blank:k }]);
    }
    if (kind === 'quad') {
      const b = 2, x1 = R(rng, 0, 1), x2 = R(rng, x1 + 1, 3), tl = b ** x1, th = b ** x2;
      const t0 = R(rng, tl, th), C = 2 * t0, k = R(rng, -9, 9), g = t => t * t - C * t + k;
      const askM = pick(rng, [0, 0, 1]);
      const val = askM ? Math.max(g(tl), g(th)) : k - t0 * t0;
      const tAt = askM ? (g(tl) >= g(th) ? tl : th) : t0;
      return item(prompt, `y=${quadExp(rng, b, C, '+k')}\\ (${x1}\\le x\\le ${x2}),\\ ${askM ? 'M' : 'm'}=${val}\\ \\Rightarrow\\ k=\\square`, k, [
        { tex:`t=2^{x}\\ (${tl}\\le t\\le ${th}),\\ y=(${xMinus(t0, 't')})^2+k${more(-t0 * t0, '')}` },
        { tex:`t=${tAt}:\\ ${g(tAt) - k === 0 ? 'k' : `${g(tAt) - k}+k`}=${val}` },
        { tex:`k=\\square`, blank:k }]);
    }
    const a = R(rng, 2, 6);
    let x2 = R(rng, 2, 4); while (a ** x2 > 625) x2--;
    const x1 = R(rng, 0, x2 - 1), form = pick(rng, ['M', 'M', 'diff', 'inv']);
    if (form === 'inv') {
      return item(prompt, `y=a^{x}\\ (0<a<1,\\ ${-x2}\\le x\\le ${-x1}),\\ M=${a ** x2}\\ \\Rightarrow\\ \\frac{1}{a}=\\square`, a, [
        { tex:`0<a<1\\ \\Rightarrow\\ M=a^{${-x2}}=\\bigl(\\frac{1}{a}\\bigr)^{${x2}}` },
        { tex:`\\bigl(\\frac{1}{a}\\bigr)^{${x2}}=${a ** x2}` },
        { tex:`\\frac{1}{a}=\\square`, blank:a }]);
    }
    if (form === 'diff') {
      const v = a ** x2 - a ** x1;
      return item(prompt, `y=a^{x}\\ (a>1,\\ ${x1}\\le x\\le ${x2}),\\ M-m=${v}\\ \\Rightarrow\\ a=\\square`, a, [
        { tex:`M=a^{${x2}},\\ m=a^{${x1}}` },
        { tex:`a^{${x2}}-a^{${x1}}=${v}` },
        { tex:`a=\\square`, blank:a }]);
    }
    return item(prompt, `y=a^{x}\\ (a>1,\\ ${x1}\\le x\\le ${x2}),\\ M=${a ** x2}\\ \\Rightarrow\\ a=\\square`, a, [
      { tex:`a>1\\ \\Rightarrow\\ M=a^{${x2}}` },
      { tex:`a^{${x2}}=${a ** x2}` },
      { tex:`a=\\square`, blank:a }]);
  }

  /* range(기본) — 닫힌 범위에서 M, m(2칸) */
  const B = mkB(rng, [2, 3, 4, 5], pick(rng, [0, 0, 1]));
  const k = pick(rng, [1, 1, 2, 3, -1]), p = R(rng, -4, 4), q = R(rng, -6, 6);
  const [e1, e2] = eRange(rng, B);
  const v1 = k * B.a ** e1 + q, v2 = k * B.a ** e2 + q;
  const xa = p + sgE(B, e1), xb = p + sgE(B, e2);
  const xs = [xa, xb].sort((a, b) => a - b);
  const M = Math.max(v1, v2), m = Math.min(v1, v2);
  return item(
    L3('지수함수 y=aˣ 은 a>1 이면 증가, 0<a<1 이면 감소합니다. 닫힌 범위의 양 끝에서 함숫값을 구해 큰 것이 최댓값 M, 작은 것이 최솟값 m 입니다.',
       'y=aˣ increases if a>1 and decreases if 0<a<1. Evaluate at both ends of the closed interval: the larger is the greatest value M and the smaller is the least value m.',
       'y=aˣ在a>1时递增，0<a<1时递减。求闭区间两端的函数值，较大的是最大值M，较小的是最小值m。'),
    `y=${expT(B, k, p)}${more(q, '')}\\ (${xs[0]}\\le x\\le ${xs[1]})\\ \\Rightarrow\\ M=\\square,\\ m=\\square`, [M, m], [
      { tex:`x=${xa}:\\ y=${v1},\\ x=${xb}:\\ y=${v2}` },
      { tex:`M=\\square,\\ m=\\square`, blank:[M, m] }]);
};

/* ── MD138 — 로그함수의 그래프·대소 ── */
function logMask(b, N, type){
  if (type === 'sq') return `\\log_{${b * b}}${N * N}`;
  if (type === 'half') return `\\frac{1}{2}\\log_{${b}}${N * N}`;
  if (type === 'two') return `2\\log_{${b * b}}${N}`;
  if (type === 'inv') return `-\\log_{\\frac{1}{${b}}}${N}`;
  if (type === 'cube') return `\\log_{${b ** 3}}${N ** 3}`;
  return `\\log_{${b}}${N}`;
}
NM_TGEN['md138_logGraph'] = function (params, rng) {
  const mode = params.mode || 'point';

  if (mode === 'move') {
    const B = mkB(rng, [2, 3, 4, 5], pick(rng, [0, 0, 1]));
    const prompt = L3('점 (x, y) 를 화살표 위의 점으로 옮기는 이동으로 y=logₐx 의 그래프를 옮긴 그래프가 y=f(x) 입니다. (x, y)→(y, x) 는 직선 y=x 에 대한 대칭이동이므로 역함수 y=aˣ 가 됩니다.',
      'Moving each point (x, y) as shown over the arrow sends the graph of y=logₐx to the graph of y=f(x). (x, y)→(y, x) is the reflection in y=x, which gives the inverse y=aˣ.',
      '按箭头上的方式移动每个点(x, y)，y=logₐx的图像变为y=f(x)的图像。(x, y)→(y, x)是关于直线y=x的对称变换，得到反函数y=aˣ。');
    if (pick(rng, [0, 0, 0, 0, 1])) {
      const e = R(rng, 0, EMAX[B.a]), c = sgE(B, e), ans = B.a ** e;
      return item(prompt, `y=${logT(B, 'x')}\\ \\xrightarrow{(x,\\,y)\\to(y,\\,x)}\\ y=f(x)\\ \\Rightarrow\\ f(${c})=\\square`, ans, [
        { tex:`f(x)=${bTex(B)}^{x}` },
        { tex:`f(${c})=${bTex(B)}^{${c}}=\\square`, blank:ans }]);
    }
    const { sx, sy, m, n } = pickMove(rng);
    const e = R(rng, 0, EMAX[B.a] + 1), c = m + sx * B.a ** e, lv = sgE(B, e), ans = sy * lv + n;
    const inner = sx > 0 ? lArg(m) : `(${terms([[-1, 'x'], [m, '']])})`;
    return item(prompt, `y=${logT(B, 'x')}\\ \\xrightarrow{${mapTex(sx, m, sy, n)}}\\ y=f(x)\\ \\Rightarrow\\ f(${c})=\\square`, ans, [
      { tex:`f(x)=${cf(sy, logT(B, inner))}${more(n, '')}` },
      { tex:`f(${c})=${cf(sy, logT(B, String(B.a ** e)))}${more(n, '')}` },
      { tex:`f(${c})=\\square`, blank:ans }]);
  }

  if (mode === 'order') {
    const b = pick(rng, [2, 2, 3]);
    for (let g = 0; g < 400; g++) {
      const n1 = R(rng, 2, 15), D = R(rng, 1, 3), n3 = n1 * b ** D;
      if (n3 > 400) continue;
      const n2 = R(rng, n1 + 1, n3 - 1);
      if (n2 === n1 * b || n2 === n1 * b * b) continue;
      const Ns = [n1, n2, n3], types = [];
      const texs = Ns.map(N => {
        const ok = ['plain', 'inv', 'two'];
        if (N <= 40) ok.push('sq', 'half');
        if (N <= 9 && b === 2) ok.push('cube');
        const free = ok.filter(t => !types.includes(t));
        const t = pick(rng, free.length ? free : ok); types.push(t);
        return logMask(b, N, t);
      });
      if (new Set(texs).size < 3) continue;
      const order = shuffle(rng, [0, 1, 2]), lab = ['A', 'B', 'C'];
      const list = order.map((i, j) => `${lab[j]}=${texs[i]}`).join(',\\ ');
      return item(
        L3('세 수를 모두 같은 밑의 로그로 고친 뒤 진수를 비교합니다. 밑이 1 보다 크면 진수가 클수록 큰 수입니다. 가장 큰 수를 M, 가장 작은 수를 m 이라 합니다.',
           'Rewrite all three as logarithms to the same base and compare the arguments; with a base greater than 1, a larger argument means a larger number. Call the largest M and the smallest m.',
           '把三个数都化成同底的对数再比较真数；底数大于1时真数越大数越大。最大的数记为M，最小的数记为m。'),
        `${list}\\ \\Rightarrow\\ M-m=\\square`, D, [
          { tex:`\\log_{${b}}${n1}<\\log_{${b}}${n2}<\\log_{${b}}${n3}` },
          { tex:`M-m=\\log_{${b}}\\frac{${n3}}{${n1}}=\\log_{${b}}${b ** D}` },
          { tex:`M-m=\\square`, blank:D }]);
    }
  }

  /* point(기본) — 지나는 점과 점근선(2칸) */
  const B = mkB(rng, [2, 3, 4, 5], pick(rng, [0, 0, 1]));
  const k = pick(rng, [1, 1, 1, 2, 3, -1, -2]), p = R(rng, -4, 4), q = R(rng, -6, 6);
  const e = R(rng, 0, EMAX[B.a] + 1), x0 = p + B.a ** e, y0 = k * sgE(B, e) + q;
  return item(
    L3('y=k·logₐ(x−p)+q 의 그래프에서 x 에 값을 넣어 지나는 점의 y좌표를 구합니다. 진수 x−p 는 0 보다 커야 하므로 점근선은 직선 x=p 입니다.',
       'On the graph of y=k·logₐ(x−p)+q, substitute x to find the y-coordinate of a point. The argument x−p must be positive, so the asymptote is the line x=p.',
       '在y=k·logₐ(x−p)+q的图像上代入x求点的纵坐标。真数x−p必须大于0，所以渐近线是直线x=p。'),
    `y=${cf(k, logT(B, lArg(p)))}${more(q, '')}\\ \\Rightarrow\\ (${x0},\\ \\square),\\ x=\\square`, [y0, p], [
      { tex:`x=${x0}:\\ y=${cf(k, logT(B, String(B.a ** e)))}${more(q, '')}=${y0}` },
      { tex:`${xMinus(p)}>0\\ \\Rightarrow\\ x>${p}` },
      { tex:`(${x0},\\ \\square),\\ x=\\square`, blank:[y0, p] }]);
};

/* ── MD139 — 로그함수의 최대·최소 ── */
function powTex(b, e){ return e >= 0 ? String(b ** e) : `\\frac{1}{${b ** -e}}`; }
NM_TGEN['md139_logMaxMin'] = function (params, rng) {
  const mode = params.mode || 'range';
  const quadPrompt = L3('logₐx=t 로 놓으면 t 에 대한 이차함수가 됩니다. x 의 범위에서 t 의 범위를 먼저 구하고, 꼭짓점이 그 안에 있는지 봅니다.',
    'Put logₐx=t to get a quadratic function of t. First find the range of t from the range of x, then check whether the vertex lies inside it.',
    '令logₐx=t，得到关于t的二次函数。先由x的范围求出t的范围，再看顶点是否在其中。');

  if (mode === 'quad') {
    const b = pick(rng, [2, 2, 3]), e1 = R(rng, -1, 1), e2 = R(rng, e1 + 2, b === 2 ? Math.min(6, e1 + 5) : 4);
    const inside = pick(rng, [1, 1, 1, 1, 0]);
    const t0 = inside ? R(rng, e1, e2) : pick(rng, [e1 - 1, e2 + 1]);
    const c = R(rng, -9, 9), g = t => t * t - 2 * t0 * t + c;
    const M = Math.max(g(e1), g(e2)), m = t0 >= e1 && t0 <= e2 ? c - t0 * t0 : Math.min(g(e1), g(e2));
    const L = `\\log_{${b}}x`;
    return item(quadPrompt,
      `y=(${L})^2${more(-2 * t0, L)}${more(c, '')}\\ (${powTex(b, e1)}\\le x\\le ${powTex(b, e2)})\\ \\Rightarrow\\ M=\\square,\\ m=\\square`, [M, m], [
        { tex:`t=${L}\\ (${e1}\\le t\\le ${e2})` },
        { tex:`y=${poly([1, -2 * t0, c], 't')}=${t0 === 0 ? 't^2' : `(${xMinus(t0, 't')})^2`}${more(c - t0 * t0, '')}` },
        { tex:`M=\\square,\\ m=\\square`, blank:[M, m] }]);
  }

  if (mode === 'coef') {
    const kind = pick(rng, ['shift', 'shift', 'quad', 'base', 'sum']);
    const prompt = L3('로그함수는 밑이 1 보다 크면 증가하고, 0 과 1 사이이면 감소합니다. 주어진 최댓값 M 또는 최솟값 m 이 어디에서 나오는지 정한 뒤 식을 세웁니다.',
      'A logarithmic function increases if its base is greater than 1 and decreases if the base is between 0 and 1. Decide where the given greatest value M or least value m occurs, then set up an equation.',
      '对数函数底数大于1时递增，在0与1之间时递减。先判断所给最大值M或最小值m在哪里取得，再列方程。');
    if (kind === 'shift') {
      const B = mkB(rng, [2, 3, 4, 5], pick(rng, [0, 0, 1])), s = pick(rng, [1, 1, 2, 3]), p = R(rng, -4, 4);
      const em = EMAX[B.a] + 1; let e1, e2;
      do { e1 = R(rng, 0, em); e2 = R(rng, 0, em); } while (e1 >= e2);
      const k = R(rng, -9, 9), askM = pick(rng, [0, 1]);
      const at = (askM ? 1 : -1) * (B.inv ? -1 : 1) > 0 ? e2 : e1;
      const val = s * sgE(B, at) + k;
      return item(prompt, `y=${cf(s, logT(B, lArg(p)))}+k\\ (${p + B.a ** e1}\\le x\\le ${p + B.a ** e2}),\\ ${askM ? 'M' : 'm'}=${val}\\ \\Rightarrow\\ k=\\square`, k, [
        { tex:`x=${p + B.a ** at}:\\ ${askM ? 'M' : 'm'}=${cf(s, logT(B, String(B.a ** at)))}+k` },
        { tex:`${s * sgE(B, at)}+k=${val}` },
        { tex:`k=\\square`, blank:k }]);
    }
    if (kind === 'quad') {
      const e1 = R(rng, -1, 1), e2 = R(rng, e1 + 2, Math.min(6, e1 + 5)), t0 = R(rng, e1, e2), k = R(rng, -9, 9);
      const L = '\\log_{2}x', val = k - t0 * t0;
      return item(prompt, `y=(${L})^2${more(-2 * t0, L)}+k\\ (${powTex(2, e1)}\\le x\\le ${powTex(2, e2)}),\\ m=${val}\\ \\Rightarrow\\ k=\\square`, k, [
        { tex:`t=${L}\\ (${e1}\\le t\\le ${e2}),\\ y=${t0 === 0 ? 't^2' : `(${xMinus(t0, 't')})^2`}+k${more(-t0 * t0, '')}` },
        { tex:`t=${t0}:\\ ${t0 === 0 ? 'k' : `${-t0 * t0}+k`}=${val}` },
        { tex:`k=\\square`, blank:k }]);
    }
    if (kind === 'sum') {
      const b = pick(rng, [2, 2, 3]);
      const c = b === 2 ? 2 ** R(rng, 2, 6) : pick(rng, [6, 18, 54]);
      const M = Math.round(Math.log(c * c / 4) / Math.log(b));
      return item(prompt, `y=\\log_{${b}}x+\\log_{${b}}(${c}-x)\\ (0<x<${c})\\ \\Rightarrow\\ M=\\square`, M, [
        { tex:`y=\\log_{${b}}x(${c}-x),\\ x(${c}-x)=-(${xMinus(c / 2)})^2+${c * c / 4}` },
        { tex:`x=${c / 2}:\\ M=\\log_{${b}}${c * c / 4}` },
        { tex:`M=\\square`, blank:M }]);
    }
    const a = R(rng, 2, 9);
    let M = R(rng, 1, 4); while (a ** M > 1000) M--;
    const low = pick(rng, [0, 0, 1]);
    return item(prompt, `y=\\log_{a}x\\ (a>1,\\ ${low ? a : 1}\\le x\\le ${a ** M}),\\ M=${M}\\ \\Rightarrow\\ a=\\square`, a, [
      { tex:`a>1\\ \\Rightarrow\\ M=\\log_{a}${a ** M}` },
      { tex:`a^{${M}}=${a ** M}` },
      { tex:`a=\\square`, blank:a }]);
  }

  /* range(기본) — 닫힌 범위에서 M, m(2칸) */
  const B = mkB(rng, [2, 3, 4, 5], pick(rng, [0, 0, 1]));
  const k = pick(rng, [1, 1, 2, 3, -1]), p = R(rng, -4, 4), q = R(rng, -6, 6);
  const em = EMAX[B.a] + 1; let e1, e2;
  do { e1 = R(rng, 0, em); e2 = R(rng, 0, em); } while (e1 >= e2);
  const v1 = k * sgE(B, e1) + q, v2 = k * sgE(B, e2) + q;
  const M = Math.max(v1, v2), m = Math.min(v1, v2);
  return item(
    L3('로그함수 y=logₐx 는 a>1 이면 증가, 0<a<1 이면 감소합니다. 닫힌 범위의 양 끝에서 함숫값을 구해 큰 것이 최댓값 M, 작은 것이 최솟값 m 입니다.',
       'y=logₐx increases if a>1 and decreases if 0<a<1. Evaluate at both ends of the closed interval: the larger is the greatest value M and the smaller is the least value m.',
       'y=logₐx在a>1时递增，0<a<1时递减。求闭区间两端的函数值，较大的是最大值M，较小的是最小值m。'),
    `y=${cf(k, logT(B, lArg(p)))}${more(q, '')}\\ (${p + B.a ** e1}\\le x\\le ${p + B.a ** e2})\\ \\Rightarrow\\ M=\\square,\\ m=\\square`, [M, m], [
      { tex:`x=${p + B.a ** e1}:\\ y=${v1},\\ x=${p + B.a ** e2}:\\ y=${v2}` },
      { tex:`M=\\square,\\ m=\\square`, blank:[M, m] }]);
};

/* ── MD140 — 일반각과 호도법 ── */
function radTxt(p, q){
  const g = gcd(p, q) || 1; p /= g; q /= g;
  const sg = p < 0 ? '−' : '', a = Math.abs(p);
  if (q === 1) return a === 1 ? `${sg}π` : `${sg}${a}π`;
  return a === 1 ? `${sg}π/${q}` : `${sg}${a}π/${q}`;
}
function degTxt(d){ return d < 0 ? `−${-d}°` : `${d}°`; }
NM_TGEN['md140_radian'] = function (params, rng) {
  const mode = params.mode || 'convert';

  if (mode === 'quad') {
    let txt, qd, sol;
    if (pick(rng, [0, 1])) {
      qd = R(rng, 1, 4);
      const al = 90 * (qd - 1) + 5 * R(rng, 1, 17), n = R(rng, -3, 3), d = al + 360 * n;
      txt = degTxt(d);
      sol = [{ tex:`${d}^\\circ=360^\\circ\\times${par(n)}+${al}^\\circ` }];
    } else {
      const q = pick(rng, [3, 4, 6]);
      let r; do { r = R(rng, 1, 2 * q - 1); } while (gcd(r, q) !== 1 || (2 * r) % q === 0);
      const n = R(rng, -3, 3), p = r + 2 * q * n;
      qd = Math.floor(r / (q / 2)) + 1;
      txt = radTxt(p, q);
      sol = [{ tex:`${radTex(p, q)}=2\\pi\\times${par(n)}+${radTex(r, q)}` }];
    }
    sol.push({ tex:`\\square`, blank:qd });
    return word(
      L3(`θ = ${txt} 입니다.`, `Let θ = ${txt}.`, `设θ = ${txt}。`),
      L3('θ 를 나타내는 동경은 제몇사분면에 있는지 그 번호를 구합니다.', 'In which quadrant does the terminal side of θ lie? Give the quadrant number.', 'θ的终边在第几象限？填写象限的序号。'),
      qd, sol);
  }

  if (mode === 'coterm') {
    const prompt = L3('동경이 같은 각은 360°(=2π) 의 정수 배만큼 차이 납니다. 일반각 360°×n+α 에서 n 은 정수이고, α 는 0° 이상 360° 미만입니다.',
      'Angles with the same terminal side differ by an integer multiple of 360° (=2π). In the general angle 360°×n+α, n is an integer and α is at least 0° and less than 360°.',
      '终边相同的角相差360°(=2π)的整数倍。在一般角360°×n+α中，n为整数，α不小于0°且小于360°。');
    const kind = pick(rng, ['deg', 'deg', 'n', 'rad', 'rad']);
    if (kind === 'rad') {
      const q = pick(rng, [2, 3, 4, 6]);
      let r; do { r = R(rng, 1, 2 * q - 1); } while (gcd(r, q) !== 1);
      const n = nz(rng, 1, 4), p = r + 2 * q * n;
      return item(prompt, `${radTex(p, q)}=2n\\pi+\\theta\\ (0\\le\\theta<2\\pi)\\ \\Rightarrow\\ \\theta=\\frac{\\square}{${q}}\\pi`, r, [
        { tex:`${radTex(p, q)}=2\\pi\\times${par(n)}+${radTex(r, q)}` },
        { tex:`\\theta=\\frac{\\square}{${q}}\\pi`, blank:r }]);
    }
    const al = R(rng, 1, 359), n = nz(rng, 1, 4), d = al + 360 * n;
    const head = `${d}^\\circ=360^\\circ\\times n+\\alpha\\ (0^\\circ\\le\\alpha<360^\\circ)\\ \\Rightarrow\\ `;
    if (kind === 'n') {
      return item(prompt, `${head}n=\\square`, n, [
        { tex:`${d}^\\circ=360^\\circ\\times${par(n)}+${al}^\\circ` },
        { tex:`n=\\square`, blank:n }]);
    }
    return item(prompt, `${head}\\alpha=\\square^\\circ`, al, [
      { tex:`${d}^\\circ=360^\\circ\\times${par(n)}+${al}^\\circ` },
      { tex:`\\alpha=\\square^\\circ`, blank:al }]);
  }

  /* convert(기본) — 도 ↔ 라디안 */
  const prompt = L3('180°=π(라디안) 입니다. 도를 라디안으로 바꿀 때는 π/180 을, 라디안을 도로 바꿀 때는 180°/π 를 곱합니다.',
    '180°=π radians. Multiply by π/180 to change degrees to radians, and by 180°/π to change radians to degrees.',
    '180°=π(弧度)。角度化弧度乘π/180，弧度化角度乘180°/π。');
  const k = nz(rng, 1, 36), d = 15 * k, g = gcd(k, 12), p = k / g, q = 12 / g;
  if (pick(rng, [0, 1])) {
    const tex = q === 1 ? `${d}^\\circ=\\square\\pi` : `${d}^\\circ=\\frac{\\square}{${q}}\\pi`;
    return item(prompt, tex, p, [
      { tex:`${d}^\\circ=${d}\\times\\frac{\\pi}{180}=${radTex(p, q)}` },
      { tex: tex, blank:p }]);
  }
  return item(prompt, `${radTex(p, q)}=\\square^\\circ`, d, [
    { tex:`${radTex(p, q)}\\times\\frac{180^\\circ}{\\pi}=${p}\\times${180 / q}^\\circ` },
    { tex:`${radTex(p, q)}=\\square^\\circ`, blank:d }]);
};

/* ── MD141 — 부채꼴의 호의 길이와 넓이 ── */
function angPick(rng){
  if (pick(rng, [0, 1, 1])) {
    const k = R(rng, 1, 23), g = gcd(k, 12);
    return { tex:`${15 * k}^\\circ`, p:k / g, q:12 / g, deg:15 * k };
  }
  const q = pick(rng, [2, 3, 4, 6]);
  let p; do { p = R(rng, 1, 2 * q - 1); } while (gcd(p, q) !== 1);
  return { tex:radTex(p, q), p, q };
}
function piT(k){ return k === 1 ? '\\pi' : `${k}\\pi`; }
NM_TGEN['md141_sector'] = function (params, rng) {
  const mode = params.mode || 'arc';

  if (mode === 'area') {
    const prompt = L3('반지름이 r, 중심각이 θ(라디안) 인 부채꼴의 넓이는 S=½r²θ=½rl 입니다(l 은 호의 길이). 중심각이 도로 주어지면 먼저 라디안으로 바꿉니다.',
      'A sector with radius r and central angle θ (radians) has area S=½r²θ=½rl (l is the arc length). If the angle is given in degrees, change it to radians first.',
      '半径为r、圆心角为θ(弧度)的扇形面积S=½r²θ=½rl(l为弧长)。圆心角以度给出时先化成弧度。');
    const kind = pick(rng, ['ang', 'ang', 'rl', 'rev', 'lrev']);
    if (kind === 'rl' || kind === 'lrev') {
      let r, l; do { r = R(rng, 2, 16); l = R(rng, 2, 20); } while ((r * l) % 2);
      const S = r * l / 2;
      if (kind === 'rl') {
        return item(prompt, `r=${r},\\ l=${l}\\ \\Rightarrow\\ S=\\square`, S, [
          { tex:`S=\\frac{1}{2}\\times${r}\\times${l}` },
          { tex:`S=\\square`, blank:S }]);
      }
      return item(prompt, `S=${S},\\ r=${r}\\ \\Rightarrow\\ l=\\square`, l, [
        { tex:`\\frac{1}{2}\\times${r}\\times l=${S}` },
        { tex:`l=\\square`, blank:l }]);
    }
    for (let g = 0; g < 400; g++) {
      const A = angPick(rng), r = R(rng, 1, 12);
      if ((r * r * A.p) % (2 * A.q)) continue;
      const K = r * r * A.p / (2 * A.q);
      if (kind === 'rev') {
        return item(prompt, `S=${piT(K)},\\ \\theta=${A.tex}\\ \\Rightarrow\\ r=\\square`, r, [
          { tex:`\\frac{1}{2}r^2\\times${radTex(A.p, A.q)}=${piT(K)}` },
          { tex:`r^2=${r * r}` },
          { tex:`r=\\square`, blank:r }]);
      }
      return item(prompt, `r=${r},\\ \\theta=${A.tex}\\ \\Rightarrow\\ S=\\square\\pi`, K, [
        { tex:`S=\\frac{1}{2}\\times${r}^2\\times${radTex(A.p, A.q)}` },
        { tex:`S=\\square\\pi`, blank:K }]);
    }
  }

  if (mode === 'max') {
    const k = R(rng, 2, 25), P = 4 * k;
    const prompt = L3('둘레의 길이가 2r+l 로 일정하면 넓이 S=½rl=½r(P−2r) 은 r 에 대한 이차함수입니다. 넓이의 최댓값을 M 이라 하고, "S=M" 은 넓이가 최대일 때를 뜻합니다.',
      'With a fixed perimeter 2r+l=P, the area S=½rl=½r(P−2r) is quadratic in r. Let M be the greatest area; "S=M" means the moment the area is greatest.',
      '周长2r+l=P一定时，面积S=½rl=½r(P−2r)是关于r的二次函数。设面积的最大值为M，"S=M"表示面积最大时。');
    const kind = pick(rng, ['M', 'M', 'r', 'l', 'P']);
    const sol0 = { tex:`S=\\frac{1}{2}r(${P}-2r)=-(${xMinus(k, 'r')})^2+${k * k}` };
    if (kind === 'r') return item(prompt, `2r+l=${P},\\ S=M\\ \\Rightarrow\\ r=\\square`, k, [sol0, { tex:`r=\\square`, blank:k }]);
    if (kind === 'l') return item(prompt, `2r+l=${P},\\ S=M\\ \\Rightarrow\\ l=\\square`, 2 * k, [sol0, { tex:`r=${k},\\ l=${P}-2\\times${k}` }, { tex:`l=\\square`, blank:2 * k }]);
    if (kind === 'P') {
      return item(prompt, `M=${k * k}\\ \\Rightarrow\\ 2r+l=\\square`, P, [
        { tex:`2r+l=P:\\ M=\\frac{P^2}{16}` },
        { tex:`P^2=${16 * k * k}` },
        { tex:`2r+l=\\square`, blank:P }]);
    }
    return item(prompt, `2r+l=${P}\\ \\Rightarrow\\ M=\\square`, k * k, [sol0, { tex:`M=\\square`, blank:k * k }]);
  }

  /* arc(기본) — 호의 길이 */
  const prompt = L3('반지름이 r, 중심각이 θ(라디안) 인 부채꼴의 호의 길이는 l=rθ 입니다. 중심각이 도로 주어지면 먼저 라디안으로 바꿉니다.',
    'A sector with radius r and central angle θ (radians) has arc length l=rθ. If the angle is given in degrees, change it to radians first.',
    '半径为r、圆心角为θ(弧度)的扇形弧长l=rθ。圆心角以度给出时先化成弧度。');
  const kind = pick(rng, ['fw', 'fw', 'rev', 'theta']);
  if (kind === 'theta') {
    const r = R(rng, 2, 15), t = R(rng, 1, 3), l = r * t;
    return item(prompt, `r=${r},\\ l=${l}\\ \\Rightarrow\\ \\theta=\\square`, t, [
      { tex:`${r}\\theta=${l}` },
      { tex:`\\theta=\\square`, blank:t }]);
  }
  const A = angPick(rng), r = A.q * R(rng, 1, Math.max(1, Math.min(4, Math.floor(24 / A.q)))), K = r * A.p / A.q;
  if (kind === 'rev') {
    return item(prompt, `l=${piT(K)},\\ \\theta=${A.tex}\\ \\Rightarrow\\ r=\\square`, r, [
      { tex:`r\\times${radTex(A.p, A.q)}=${piT(K)}` },
      { tex:`r=\\square`, blank:r }]);
  }
  return item(prompt, `r=${r},\\ \\theta=${A.tex}\\ \\Rightarrow\\ l=\\square\\pi`, K, [
    { tex:`l=${r}\\times${radTex(A.p, A.q)}` },
    { tex:`l=\\square\\pi`, blank:K }]);
};

/* ── MD142 — 삼각함수의 정의와 관계 ── */
const PYT = [[3, 4, 5], [5, 12, 13], [8, 15, 17], [7, 24, 25], [6, 8, 10], [9, 12, 15], [20, 21, 29]];
const QRANGE = ['0<\\theta<\\frac{\\pi}{2}', '\\frac{\\pi}{2}<\\theta<\\pi', '\\pi<\\theta<\\frac{3}{2}\\pi', '\\frac{3}{2}\\pi<\\theta<2\\pi'];
const QSGN = [[1, 1], [1, -1], [-1, -1], [-1, 1]];          /* [sin 부호, cos 부호] */
NM_TGEN['md142_trigDef'] = function (params, rng) {
  const mode = params.mode || 'point';

  if (mode === 'pyth') {
    const prompt = L3('sin²θ+cos²θ=1, tanθ=sinθ/cosθ 입니다. θ 의 범위로 부호를 정합니다. tanθ 가 주어지면 분자·분모를 cosθ 로 나누어 tanθ 로 나타냅니다.',
      'sin²θ+cos²θ=1 and tanθ=sinθ/cosθ. Use the range of θ to decide the signs. If tanθ is given, divide the numerator and denominator by cosθ to write everything in tanθ.',
      'sin²θ+cos²θ=1，tanθ=sinθ/cosθ。由θ的范围确定符号。若给出tanθ，把分子分母同除以cosθ，用tanθ表示。');
    const kind = pick(rng, ['sin', 'sin', 'cos', 'ratio', 'ratio', 'sec']);
    if (kind === 'ratio') {
      for (let g = 0; g < 400; g++) {
        const t = nz(rng, 1, 5), c = R(rng, 1, 3), d = R(rng, -5, 5), den = c * t + d;
        if (den === 0) continue;
        const a = nz(rng, 1, 4), Rv = nz(rng, 1, 5), b = Rv * den - a * t;
        if (Math.abs(b) > 9 || b === 0) continue;
        const num = terms([[a, '\\sin\\theta'], [b, '\\cos\\theta']]), dn = terms([[c, '\\sin\\theta'], [d, '\\cos\\theta']]);
        return item(prompt, `\\tan\\theta=${t}\\ \\Rightarrow\\ \\frac{${num}}{${dn}}=\\square`, Rv, [
          { tex:`\\frac{${terms([[a, '\\tan\\theta'], [b, '']])}}{${terms([[c, '\\tan\\theta'], [d, '']])}}=\\frac{${a * t + b}}{${den}}` },
          { tex:`\\frac{${num}}{${dn}}=\\square`, blank:Rv }]);
      }
    }
    if (kind === 'sec') {
      const t = nz(rng, 1, 9), ans = 1 + t * t;
      return item(prompt, `\\tan\\theta=${t}\\ \\Rightarrow\\ \\frac{1}{\\cos^2\\theta}=\\square`, ans, [
        { tex:`\\frac{1}{\\cos^2\\theta}=\\frac{\\sin^2\\theta+\\cos^2\\theta}{\\cos^2\\theta}=\\tan^2\\theta+1` },
        { tex:`${par(t)}^2+1=\\square`, blank:ans }]);
    }
    let [a, b, r] = pick(rng, PYT); if (pick(rng, [0, 1])) [a, b] = [b, a];
    const qd = R(rng, 0, 3), [ss, cs] = QSGN[qd];
    const sv = ss * a, cv = cs * b;                               /* r·sin, r·cos */
    const givenSin = kind === 'sin';
    const gTex = givenSin ? `\\sin\\theta=${fracTex(sv, r)}` : `\\cos\\theta=${fracTex(cv, r)}`;
    const askTan = pick(rng, [0, 1]);
    const tanK = b;                                               /* |tanθ|=a/b — b 를 곱하면 정수 */
    let ask, ans;
    if (askTan) { ask = `${tanK}\\tan\\theta`; ans = tanK * sv / cv; }
    else if (givenSin) { ask = `${r}\\cos\\theta`; ans = cv; }
    else { ask = `${r}\\sin\\theta`; ans = sv; }
    return item(prompt, `${gTex}\\ (${QRANGE[qd]})\\ \\Rightarrow\\ ${ask}=\\square`, ans, [
      { tex: givenSin ? `\\cos^2\\theta=1-${fracTex(a * a, r * r)}=${fracTex(b * b, r * r)}` : `\\sin^2\\theta=1-${fracTex(b * b, r * r)}=${fracTex(a * a, r * r)}` },
      { tex:`\\sin\\theta=${fracTex(sv, r)},\\ \\cos\\theta=${fracTex(cv, r)}` },
      { tex:`${ask}=\\square`, blank:ans }]);
  }

  if (mode === 'sumprod') {
    const prompt = L3('(sinθ±cosθ)²=1±2sinθcosθ 입니다. 합이나 차를 제곱해 sinθcosθ 를 구하고, 필요하면 a³+b³=(a+b)³−3ab(a+b) 를 씁니다.',
      '(sinθ±cosθ)²=1±2sinθcosθ. Square the sum or difference to get sinθcosθ, and use a³+b³=(a+b)³−3ab(a+b) when needed.',
      '(sinθ±cosθ)²=1±2sinθcosθ。把和或差平方求sinθcosθ，必要时用a³+b³=(a+b)³−3ab(a+b)。');
    for (let g = 0; g < 400; g++) {
      const kind = pick(rng, ['sc', 'sc', 'dsc', 'sq', 'cube', 'cot']);
      if (kind === 'sq') {
        const d = pick(rng, [2, 3, 4, 5, 6, 8, 9]), c = nz(rng, 1, Math.floor(d / 2));
        if (gcd(c, d) !== 1) continue;
        const plus = pick(rng, [0, 1]), num = d + (plus ? 2 * c : -2 * c);  /* (s±c)² = num/d */
        if (num <= 0) continue;
        const ans = num, K = d;
        return item(prompt, `\\sin\\theta\\cos\\theta=${fracTex(c, d)}\\ \\Rightarrow\\ ${K}(\\sin\\theta${plus ? '+' : '-'}\\cos\\theta)^2=\\square`, ans, [
          { tex:`(\\sin\\theta${plus ? '+' : '-'}\\cos\\theta)^2=1${plus ? '+' : '-'}2\\sin\\theta\\cos\\theta` },
          { tex:`1${plus ? '+' : '-'}2\\times${c < 0 ? `\\bigl(${fracTex(c, d)}\\bigr)` : fracTex(c, d)}=${fracTex(num, d)}` },
          { tex:`${K}(\\sin\\theta${plus ? '+' : '-'}\\cos\\theta)^2=\\square`, blank:ans }]);
      }
      const b = pick(rng, [2, 3, 4, 5]), a = nz(rng, 1, Math.floor(Math.sqrt(2) * b));
      if (gcd(a, b) !== 1 || a * a === b * b || a * a >= 2 * b * b) continue;
      const diff = kind === 'dsc';
      const sTex = `\\sin\\theta${diff ? '-' : '+'}\\cos\\theta=${fracTex(a, b)}`;
      const scN = diff ? b * b - a * a : a * a - b * b, scD = 2 * b * b;      /* sinθcosθ = scN/scD */
      if (kind === 'cot') {
        if (scN === 0 || scD % scN) continue;
        const ans = scD / scN;
        return item(prompt, `${sTex}\\ \\Rightarrow\\ \\tan\\theta+\\frac{1}{\\tan\\theta}=\\square`, ans, [
          { tex:`\\sin\\theta\\cos\\theta=${fracTex(scN, scD)}` },
          { tex:`\\tan\\theta+\\frac{1}{\\tan\\theta}=\\frac{1}{\\sin\\theta\\cos\\theta}` },
          { tex:`\\frac{1}{\\sin\\theta\\cos\\theta}=\\square`, blank:ans }]);
      }
      if (kind === 'cube') {
        /* s³+c³ = s(1−sc) = (a/b)(1 − scN/scD) */
        const n = a * (scD - scN), dd = b * scD, gg = gcd(n, dd), K = dd / gg, ans = n / gg;
        if (K > 60) continue;
        return item(prompt, `${sTex}\\ \\Rightarrow\\ ${K === 1 ? '' : K}(\\sin^3\\theta+\\cos^3\\theta)=\\square`, ans, [
          { tex:`\\sin\\theta\\cos\\theta=${fracTex(scN, scD)}` },
          { tex:`\\sin^3\\theta+\\cos^3\\theta=${fracTex(a, b)}\\times\\bigl(1-(${fracTex(scN, scD)})\\bigr)` },
          { tex:`${K === 1 ? '' : K}(\\sin^3\\theta+\\cos^3\\theta)=\\square`, blank:ans }]);
      }
      const gg = gcd(scN, scD), K = scD / gg, ans = scN / gg;
      return item(prompt, `${sTex}\\ \\Rightarrow\\ ${K === 1 ? '' : K}\\sin\\theta\\cos\\theta=\\square`, ans, [
        { tex:`1${diff ? '-' : '+'}2\\sin\\theta\\cos\\theta=${fracTex(a * a, b * b)}` },
        { tex:`\\sin\\theta\\cos\\theta=${fracTex(scN, scD)}` },
        { tex:`${K === 1 ? '' : K}\\sin\\theta\\cos\\theta=\\square`, blank:ans }]);
    }
  }

  /* point(기본) — 동경 위의 점으로 값 */
  let [a, b, r] = pick(rng, PYT); if (pick(rng, [0, 1])) [a, b] = [b, a];
  const x = a * pick(rng, [1, -1]), y = b * pick(rng, [1, -1]);
  const kind = pick(rng, ['sum', 'dif', 'prod', 'tan']);
  let ask, ans;
  if (kind === 'sum') { ask = `${r}(\\sin\\theta+\\cos\\theta)`; ans = y + x; }
  else if (kind === 'dif') { ask = `${r}(\\sin\\theta-\\cos\\theta)`; ans = y - x; }
  else if (kind === 'prod') { ask = `${r * r}\\sin\\theta\\cos\\theta`; ans = x * y; }
  else { ask = `${r}\\sin\\theta${more(x, '\\tan\\theta')}`; ans = 2 * y; }
  return item(
    L3('원점 O 에서 점 P(x, y) 로 그은 동경이 나타내는 각을 θ, OP=r 이라 하면 sinθ=y/r, cosθ=x/r, tanθ=y/x 입니다.',
       'Let θ be the angle whose terminal side goes from the origin O through P(x, y), and let OP=r. Then sinθ=y/r, cosθ=x/r and tanθ=y/x.',
       '设从原点O到点P(x, y)的终边表示的角为θ，OP=r，则sinθ=y/r，cosθ=x/r，tanθ=y/x。'),
    `P(${x},\\,${y})\\ \\Rightarrow\\ ${ask}=\\square`, ans, [
      { tex:`r=\\sqrt{${par(x)}^2+${par(y)}^2}=${r}` },
      { tex:`\\sin\\theta=${fracTex(y, r)},\\ \\cos\\theta=${fracTex(x, r)},\\ \\tan\\theta=${fracTex(y, x)}` },
      { tex:`${ask}=\\square`, blank:ans }]);
};

/* ── MD143 — 그래프의 미정계수·각의 변환 ── */
const PERIOD = { 1:'2\\pi', 2:'\\pi', 3:'\\frac{2}{3}\\pi', 4:'\\frac{\\pi}{2}', 5:'\\frac{2}{5}\\pi', 6:'\\frac{\\pi}{3}' };
/* 변환 각: 함수 f(각) 가 θ 의 어떤 함수가 되는지 [종류, 부호] (s=sin, c=cos, t=tan, k=1/tan) */
const TRF = [
  { t:'\\pi+\\theta', s:['s', -1], c:['c', -1], n:['t', 1] },
  { t:'\\pi-\\theta', s:['s', 1], c:['c', -1], n:['t', -1] },
  { t:'-\\theta', s:['s', -1], c:['c', 1], n:['t', -1] },
  { t:'2\\pi-\\theta', s:['s', -1], c:['c', 1], n:['t', -1] },
  { t:'\\frac{\\pi}{2}+\\theta', s:['c', 1], c:['s', -1], n:['k', -1] },
  { t:'\\frac{\\pi}{2}-\\theta', s:['c', 1], c:['s', 1], n:['k', 1] },
  { t:'\\frac{3}{2}\\pi+\\theta', s:['c', -1], c:['s', 1], n:['k', -1] },
  { t:'\\frac{3}{2}\\pi-\\theta', s:['c', -1], c:['s', -1], n:['k', 1] }
];
const FN = { s:'\\sin', c:'\\cos', n:'\\tan' };
function argT(tr){ return /frac/.test(tr.t) ? `\\bigl(${tr.t}\\bigr)` : `(${tr.t})`; }
/* 원하는 종류(want)가 되는 (함수, 변환) 하나 */
function trPick(rng, fns, want){
  for (let g = 0; g < 100; g++) {
    const f = pick(rng, fns), tr = pick(rng, TRF), [kd, sg] = tr[f];
    if (want.includes(kd)) return { f, tr, kd, sg };
  }
  return { f:'s', tr:TRF[1], kd:'s', sg:1 };
}
/* 특수각 — 기준각 r(도) 의 각 하나를 라디안 tex 로 */
function spAngle(rng, r){
  const d = pick(rng, [r, 180 - r, 180 + r, 360 - r, -r, -(180 - r), 360 + r, r - 360]);
  const t = radTex(d, 180);
  return { d, tex: d < 0 ? `\\bigl(${t}\\bigr)` : t };
}
function rs(v){ return Math.round(v * 1e9) / 1e9; }
NM_TGEN['md143_trigGraph'] = function (params, rng) {
  const mode = params.mode || 'coef';

  if (mode === 'value') {
    const prompt = L3('π±θ, π/2±θ, −θ 꼴의 각은 기준각 θ 의 삼각함수로 바꿉니다. 각을 π/6, π/4, π/3 을 기준으로 나누어 부호(사분면)와 값을 정합니다.',
      'Change an angle of the form π±θ, π/2±θ or −θ into a trig function of the reference angle θ. Split the angle around π/6, π/4 or π/3 and decide the sign (quadrant) and value.',
      '把π±θ、π/2±θ、−θ形式的角化成基准角θ的三角函数。以π/6、π/4、π/3为基准，确定符号(象限)与值。');
    const LIB = [
      () => { const A = spAngle(rng, 30); return [`2\\sin${A.tex}`, 2 * Math.sin(A.d * Math.PI / 180)]; },
      () => { const A = spAngle(rng, 60); return [`2\\cos${A.tex}`, 2 * Math.cos(A.d * Math.PI / 180)]; },
      () => { const A = spAngle(rng, 45); return [`\\tan${A.tex}`, Math.tan(A.d * Math.PI / 180)]; },
      () => { const A = spAngle(rng, pick(rng, [30, 60])); return [`4\\sin^{2}${A.tex}`, 4 * Math.sin(A.d * Math.PI / 180) ** 2]; },
      () => { const A = spAngle(rng, pick(rng, [30, 60])); return [`4\\cos^{2}${A.tex}`, 4 * Math.cos(A.d * Math.PI / 180) ** 2]; },
      () => { const A = spAngle(rng, 30); return [`3\\tan^{2}${A.tex}`, 3 * Math.tan(A.d * Math.PI / 180) ** 2]; },
      () => { const A = spAngle(rng, 45); const f = pick(rng, ['sin', 'cos']); return [`\\sqrt{2}\\${f}${A.tex}`, Math.SQRT2 * Math[f](A.d * Math.PI / 180)]; },
      () => { const A = spAngle(rng, pick(rng, [30, 60])); return [`\\sqrt{3}\\tan${A.tex}`, Math.sqrt(3) * Math.tan(A.d * Math.PI / 180)]; },
      () => { const A = spAngle(rng, 60); return [`2\\sqrt{3}\\sin${A.tex}`, 2 * Math.sqrt(3) * Math.sin(A.d * Math.PI / 180)]; },
      () => { const A = spAngle(rng, 30), B = spAngle(rng, 60); return [`4\\sin${A.tex}\\cos${B.tex}`, 4 * Math.sin(A.d * Math.PI / 180) * Math.cos(B.d * Math.PI / 180)]; }
    ];
    let t1, v1, t2, v2;
    do { [t1, v1] = pick(rng, LIB)(); [t2, v2] = pick(rng, LIB)(); } while (t1 === t2);
    const plus = pick(rng, [0, 1]), ans = Math.round(plus ? v1 + v2 : v1 - v2);
    return item(prompt, `${t1}${plus ? '+' : '-'}${t2}=\\square`, ans, [
      { tex:`${t1}=${Math.round(v1)}` },
      { tex:`${t2}=${Math.round(v2)}` },
      { tex:`${Math.round(v1)}${plus ? '+' : '-'}${par(Math.round(v2))}=\\square`, blank:ans }]);
  }

  if (mode === 'simplify') {
    const prompt = L3('각 변환 공식으로 모든 항을 sinθ, cosθ, tanθ 로 바꾼 뒤 sin²θ+cos²θ=1, tanθ×(1/tanθ)=1 을 씁니다. 식의 값은 θ 에 관계없이 일정합니다.',
      'Use the angle-change formulas to write every term with sinθ, cosθ and tanθ, then use sin²θ+cos²θ=1 and tanθ×(1/tanθ)=1. The value does not depend on θ.',
      '用角的变换公式把每一项化成sinθ、cosθ、tanθ，再用sin²θ+cos²θ=1、tanθ×(1/tanθ)=1。式子的值与θ无关。');
    if (pick(rng, [0, 1])) {
      /* F1(A)F2(B) ± F3(C)F4(D) — ±cos²θ 와 ±sin²θ 로 */
      const pt = ([P, Q]) => `${FN[P.f]}${argT(P.tr)}${FN[Q.f]}${argT(Q.tr)}`;
      const red = ([P, Q], kd) => `${P.sg * Q.sg < 0 ? '-' : ''}\\${kd === 'c' ? 'cos' : 'sin'}^2\\theta`;
      for (let g = 0; g < 100; g++) {
        const X = trPick(rng, ['s', 'c'], ['c']), Y = trPick(rng, ['s', 'c'], ['c']);
        const Z = trPick(rng, ['s', 'c'], ['s']), W = trPick(rng, ['s', 'c'], ['s']);
        if (pt([X, X]) === pt([X, Y]) || pt([Z, Z]) === pt([Z, W])) continue;
        const s1 = X.sg * Y.sg, s2 = Z.sg * W.sg, op = s1 === s2 ? '+' : '-';
        const pairs = shuffle(rng, [[X, Y, 'c'], [Z, W, 's']]);
        const ans = pairs[0][0].sg * pairs[0][1].sg;              /* 앞 항의 부호 × (cos²θ+sin²θ) */
        return item(prompt, `${pt(pairs[0])}${op}${pt(pairs[1])}=\\square`, ans, [
          { tex:`${pt(pairs[0])}=${red(pairs[0], pairs[0][2])}` },
          { tex:`${pt(pairs[1])}=${red(pairs[1], pairs[1][2])}` },
          { tex:`${ans < 0 ? '-' : ''}(\\sin^2\\theta+\\cos^2\\theta)=\\square`, blank:ans }]);
      }
    }
    /* f²(A)+g²(B) ± k·tan(C)tan(D) */
    const P = trPick(rng, ['s', 'c'], ['s']), Q = trPick(rng, ['s', 'c'], ['c']);
    const T1 = trPick(rng, ['n'], ['t']), T2 = trPick(rng, ['n'], ['k']);
    const sq = shuffle(rng, [P, Q]), tn = shuffle(rng, [T1, T2]);
    const k = pick(rng, [1, 1, 2, 3]), plus = pick(rng, [0, 1]);
    const tv = T1.sg * T2.sg, ans = 1 + (plus ? 1 : -1) * k * tv;
    const sqT = sq.map(E => `${FN[E.f]}^2${argT(E.tr)}`).join('+');
    const tnT = `${k === 1 ? '' : k}\\tan${argT(tn[0].tr)}\\tan${argT(tn[1].tr)}`;
    return item(prompt, `${sqT}${plus ? '+' : '-'}${tnT}=\\square`, ans, [
      { tex:`${sqT}=\\sin^2\\theta+\\cos^2\\theta=1` },
      { tex:`\\tan${argT(tn[0].tr)}\\tan${argT(tn[1].tr)}=${tv}` },
      { tex:`1${plus ? '+' : '-'}${k === 1 ? par(tv) : `${k}\\times${par(tv)}`}=\\square`, blank:ans }]);
  }

  /* coef(기본) — 최댓값·최솟값과 주기로 a, b (2칸) */
  const f = pick(rng, ['sin', 'cos']), a = R(rng, 1, 6), b = R(rng, 1, 6), c = R(rng, -6, 6);
  const M = a + c, m = c - a, kind = pick(rng, ['M', 'm', 'Mm']);
  const head = kind === 'Mm' ? `y=a\\${f} bx+c\\ (a>0,\\ b>0),\\ M=${M},\\ m=${m}` :
    `y=a\\${f} bx${more(c, '')}\\ (a>0,\\ b>0),\\ ${kind}=${kind === 'M' ? M : m}`;
  return item(
    L3('y=a sin bx+c, y=a cos bx+c(a>0, b>0) 의 최댓값은 M=a+c, 최솟값은 m=−a+c, 주기는 p=2π/b 입니다.',
       'For y=a sin bx+c and y=a cos bx+c (a>0, b>0), the greatest value is M=a+c, the least value is m=−a+c and the period is p=2π/b.',
       'y=a sin bx+c、y=a cos bx+c(a>0，b>0)的最大值M=a+c，最小值m=−a+c，周期p=2π/b。'),
    `${head},\\ p=${PERIOD[b]}\\ \\Rightarrow\\ a=\\square,\\ b=\\square`, [a, b], [
      { tex: kind === 'Mm' ? `a=\\frac{${M}-${par(m)}}{2}=${a}` : kind === 'M' ? `a${more(c, '')}=${M}` : `-a${more(c, '')}=${m}` },
      { tex:`\\frac{2\\pi}{b}=${PERIOD[b]}` },
      { tex:`a=\\square,\\ b=\\square`, blank:[a, b] }]);
};

if (typeof module !== 'undefined' && module.exports) module.exports = NM_TGEN;
})();
