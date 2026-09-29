/* ============================================================
   Numbers of Magic — MD115~MD124 공통수학2 새 유형 생성기 1차 (2026-09-29)
   근거: docs/high-build-spec.md (공통수학2 새 유형 목록 앞 10개).
   교재(교과연산 J·K)는 챕터 제목만 근거로 쓰고, 문제는 전부 새로 만든다.

   MD115 삼각형의 무게중심          coord(2칸) · vertex(2칸) · sum
   MD116 점과 직선 사이의 거리       dist · parallel · unknown
   MD117 좌표축에 접하는 원(문장제)  xAxis · both · unknown
   MD118 원과 직선의 위치 관계       count · tangent · range(2칸)
   MD119 원의 접선의 방정식          onCircle · slope · outside
   MD120 평행이동                   point(2칸) · line · circle(2칸)
   MD121 대칭이동                   point(2칸) · line(2칸) · circle(2칸)
   MD122 원소·부분집합의 개수(문장제) nA · subsets · special
   MD123 집합의 연산                basic · diff · laws
   MD124 원소의 개수 공식            union · three · bound(2칸)

   계약: NM_TGEN[gen](params, rng), Math.random 금지. 답은 정수 또는 정수 배열.
   **답을 먼저 고르고 식을 역산한다** — 거리·반지름·접선의 절편·중심을 먼저 정한 뒤
   직선과 원의 계수를 만든다. 거리가 정수가 되도록 법선은 피타고라스 수(3,4,5 …)를 쓴다.
   집합 문항은 원소를 모두 나열하거나 작은 자연수에 대한 간단한 조건으로 정의해,
   검산 스크립트가 원소를 직접 세어 대조할 수 있게 한다.
   풀이 마지막 단계의 blank = 답 전체. 표기: 계수 1·0 숨김, 음수는 괄호, 이중부호 금지.
   max·min·∈·⊂ 기호는 쓰지 않는다(교과서 말: 최댓값 M, 최솟값 m, 부분집합 …).
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
function terms(list){
  let s = '';
  list.forEach(([c, v]) => { if(c === 0) return; s += s ? more(c, v) : lead(c, v); });
  return s || '0';
}
function xMinus(r, v){ v = v || 'x'; return r === 0 ? v : `${v}${more(-r, '')}`; }
/* (x−a) — a=0 이면 괄호 없이 x */
function grp(a, v){ return a === 0 ? (v || 'x') : `(${xMinus(a, v)})`; }
/* 계수×식 — 1·−1 은 숨긴다. cfMore 는 두 번째 항부터 */
function cf(c, body){ return c === 1 ? body : c === -1 ? `-${body}` : `${c}${body}`; }
function cfMore(c, body){ if(c === 0) return ''; const a = Math.abs(c); return (c < 0 ? ' - ' : ' + ') + (a === 1 ? body : `${a}${body}`); }
function pt(x, y){ return `(${x},${y})`; }
function lineTex(a, b, c){ return `${terms([[a, 'x'], [b, 'y'], [c, '']])}=0`; }
function sqPart(a, v){ return a === 0 ? `${v}^2` : `(${xMinus(a, v)})^2`; }
function circ(a, b, R2){ return `${sqPart(a, 'x')}+${sqPart(b, 'y')}=${R2}`; }
function genCirc(a, b, R2){ return `x^2+y^2${more(-2 * a, 'x')}${more(-2 * b, 'y')}${more(a * a + b * b - R2, '')}=0`; }
/* a·x0 + b·y0 + c 를 곱셈 꼴로 */
function subExpr(a, b, c, x0, y0){
  let s = `${a}\\times${par(x0)}`;
  s += `${b < 0 ? '-' : '+'}${Math.abs(b)}\\times${par(y0)}`;
  return s + more(c, '');
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
/* 글(문장제)용 표기 — 음수는 −, 제곱은 ² */
function u(n){ return n < 0 ? `−${-n}` : String(n); }
function pLead(c, v){ return c === 1 ? v : c === -1 ? `−${v}` : `${u(c)}${v}`; }
function pMore(c, v){ if(c === 0) return ''; const a = Math.abs(c); return (c < 0 ? '−' : '+') + (v && a === 1 ? v : `${a}${v}`); }
function pSq(v, a){ return a === 0 ? `${v}²` : `(${v}${a > 0 ? '−' : '+'}${Math.abs(a)})²`; }
function pPt(x, y){ return `(${u(x)}, ${u(y)})`; }
const QUAD = [
  null,
  { s:[1, 1],   ko:'제1사분면', en:'the first quadrant',  zh:'第一象限' },
  { s:[-1, 1],  ko:'제2사분면', en:'the second quadrant', zh:'第二象限' },
  { s:[-1, -1], ko:'제3사분면', en:'the third quadrant',  zh:'第三象限' },
  { s:[1, -1],  ko:'제4사분면', en:'the fourth quadrant', zh:'第四象限' }];
/* 거리가 정수가 되는 법선 (a, b, √(a²+b²)) */
const NORMS = [[3, 4, 5], [4, 3, 5], [5, 12, 13], [12, 5, 13], [6, 8, 10], [8, 6, 10], [8, 15, 17], [15, 8, 17]];
function normal(rng){ const [a, b, h] = pick(rng, NORMS); return [a, b * pick(rng, [1, -1]), h]; }

/* ── MD115 — 삼각형의 무게중심 ── */
function centroidTri(rng, gr, vr, cr){
  for(let g = 0; g < 300; g++){
    const gx = R(rng, -gr, gr), gy = R(rng, -gr, gr);
    const x1 = R(rng, -vr, vr), y1 = R(rng, -vr, vr), x2 = R(rng, -vr, vr), y2 = R(rng, -vr, vr);
    const x3 = 3 * gx - x1 - x2, y3 = 3 * gy - y1 - y2;
    if(Math.abs(x3) > cr || Math.abs(y3) > cr) continue;
    if((x2 - x1) * (y3 - y1) - (x3 - x1) * (y2 - y1) === 0) continue;
    return { gx, gy, x1, y1, x2, y2, x3, y3 };
  }
  return { gx:1, gy:1, x1:0, y1:0, x2:3, y2:0, x3:0, y3:3 };
}
function sum3(p, q, r){ return `${p}${more(q, '')}${more(r, '')}`; }
NM_TGEN['md115_centroid'] = function (params, rng) {
  const mode = params.mode || 'coord';
  const base = L3('삼각형 ABC 의 무게중심 G 의 좌표는 세 꼭짓점의 x 좌표끼리, y 좌표끼리 더해 3 으로 나눈 값입니다.',
    'The centroid G of triangle ABC has coordinates equal to the sums of the vertices’ x- and y-coordinates, each divided by 3.',
    '三角形ABC的重心G的坐标，是三个顶点的x坐标之和、y坐标之和分别除以3。');

  if (mode === 'vertex') {
    const t = centroidTri(rng, 6, 9, 12);
    return item(
      L3('G 는 삼각형 ABC 의 무게중심입니다. 3G=A+B+C 에서 꼭짓점 C 의 좌표를 구합니다.',
         'G is the centroid of triangle ABC. From 3G=A+B+C, find the coordinates of vertex C.',
         'G是三角形ABC的重心。由3G=A+B+C求顶点C的坐标。'),
      `A${pt(t.x1, t.y1)},\\ B${pt(t.x2, t.y2)},\\ G${pt(t.gx, t.gy)} \\;\\Rightarrow\\; C(\\square,\\ \\square)`, [t.x3, t.y3], [
        { tex:`x_3=3\\times${par(t.gx)}${more(-t.x1, '')}${more(-t.x2, '')}=\\square`, blank:t.x3 },
        { tex:`y_3=3\\times${par(t.gy)}${more(-t.y1, '')}${more(-t.y2, '')}=\\square`, blank:t.y3 },
        { tex:`C(\\square,\\ \\square)`, blank:[t.x3, t.y3] }]);
  }

  if (mode === 'sum') {
    const t = centroidTri(rng, 7, 10, 14);
    const kind = pick(rng, ['ab', 'ab', 'prod', 'cSum']);
    if (kind === 'cSum') {
      const ans = t.x3 + t.y3;
      return item(
        L3('G 는 삼각형 ABC 의 무게중심입니다. 꼭짓점 C(p, q) 를 구해 p+q 의 값을 구합니다.',
           'G is the centroid of triangle ABC. Find vertex C(p, q) and then p+q.',
           'G是三角形ABC的重心。求出顶点C(p, q)，再求p+q的值。'),
        `A${pt(t.x1, t.y1)},\\ B${pt(t.x2, t.y2)},\\ G${pt(t.gx, t.gy)} \\;\\Rightarrow\\; C(p,q),\\ p+q=\\square`, ans, [
          { tex:`p=3\\times${par(t.gx)}${more(-t.x1, '')}${more(-t.x2, '')}=${t.x3}` },
          { tex:`q=3\\times${par(t.gy)}${more(-t.y1, '')}${more(-t.y2, '')}=${t.y3}` },
          { tex:`p+q=\\square`, blank:ans }]);
    }
    const a = t.x1, b = t.y2;
    const prod = kind === 'prod';
    const ans = prod ? a * b : a + b;
    return item(
      prod
        ? L3('G 는 삼각형 ABC 의 무게중심입니다. x 좌표와 y 좌표로 식을 하나씩 세워 a, b 를 구하고 ab 의 값을 구합니다.',
             'G is the centroid of triangle ABC. Set up one equation from the x-coordinates and one from the y-coordinates, find a and b, then ab.',
             'G是三角形ABC的重心。由x坐标、y坐标各列一个方程求a、b，再求ab的值。')
        : L3('G 는 삼각형 ABC 의 무게중심입니다. x 좌표와 y 좌표로 식을 하나씩 세워 a, b 를 구하고 a+b 의 값을 구합니다.',
             'G is the centroid of triangle ABC. Set up one equation from the x-coordinates and one from the y-coordinates, find a and b, then a+b.',
             'G是三角形ABC的重心。由x坐标、y坐标各列一个方程求a、b，再求a+b的值。'),
      `A(a,${t.y1}),\\ B(${t.x2},b),\\ C${pt(t.x3, t.y3)},\\ G${pt(t.gx, t.gy)} \\;\\Rightarrow\\; ${prod ? 'ab' : 'a+b'}=\\square`, ans, [
        { tex:`\\dfrac{a${more(t.x2, '')}${more(t.x3, '')}}{3}=${t.gx}\\ \\Rightarrow\\ a=${a}` },
        { tex:`\\dfrac{${t.y1}+b${more(t.y3, '')}}{3}=${t.gy}\\ \\Rightarrow\\ b=${b}` },
        { tex:`${prod ? 'ab' : 'a+b'}=\\square`, blank:ans }]);
  }

  /* coord(기본) */
  const t = centroidTri(rng, 6, 9, 12);
  return item(base,
    `A${pt(t.x1, t.y1)},\\ B${pt(t.x2, t.y2)},\\ C${pt(t.x3, t.y3)} \\;\\Rightarrow\\; G(\\square,\\ \\square)`, [t.gx, t.gy], [
      { tex:`\\dfrac{${sum3(t.x1, t.x2, t.x3)}}{3}=\\square`, blank:t.gx },
      { tex:`\\dfrac{${sum3(t.y1, t.y2, t.y3)}}{3}=\\square`, blank:t.gy },
      { tex:`G(\\square,\\ \\square)`, blank:[t.gx, t.gy] }]);
};

/* ── MD116 — 점과 직선 사이의 거리 ──
   거리 d 를 먼저 고르고, 법선 (a,b) 는 피타고라스 수로 잡아 √(a²+b²) 가 정수가 되게 한다. */
function absSum(V, v){ return V === 0 ? `|${v}|` : `|${V}+${v}|`; }
NM_TGEN['md116_pointLine'] = function (params, rng) {
  const mode = params.mode || 'dist';

  if (mode === 'parallel') {
    const [a, b, h] = normal(rng);
    const d = R(rng, 1, 6), c1 = R(rng, -15, 15), c2 = c1 + pick(rng, [1, -1]) * d * h;
    const k = pick(rng, [1, 1, 2, 3, -1, -2]);
    const l2 = lineTex(k * a, k * b, k * c2);
    const sol = [];
    if (k !== 1) sol.push({ tex:`${l2}\\ \\Rightarrow\\ ${lineTex(a, b, c2)}` });
    sol.push({ tex:`d=\\dfrac{|${c1}-${par(c2)}|}{\\sqrt{${a}^2+${par(b)}^2}}=\\dfrac{${d * h}}{${h}}` });
    sol.push({ tex:`d=\\square`, blank:d });
    return item(
      L3('두 직선은 평행합니다. x, y 의 계수를 같게 맞춘 뒤 ax+by+c=0 과 ax+by+c′=0 사이의 거리 |c−c′|/√(a²+b²) 를 구합니다.',
         'The two lines are parallel. Make the x- and y-coefficients match, then use the distance |c−c′|/√(a²+b²) between ax+by+c=0 and ax+by+c′=0.',
         '两直线平行。先把x、y的系数化成相同，再用ax+by+c=0与ax+by+c′=0之间的距离|c−c′|/√(a²+b²)。'),
      `${lineTex(a, b, c1)},\\ ${l2} \\;\\Rightarrow\\; d=\\square`, d, sol);
  }

  if (mode === 'unknown') {
    const kind = pick(rng, ['k', 'k', 'coord']);
    if (kind === 'coord') {
      /* P(t, y0), t>0 — 다른 근은 0 이하가 되도록 고른다 */
      for (let g = 0; g < 400; g++) {
        const [A, B, h] = normal(rng);
        const t = R(rng, 1, 8), y0 = R(rng, -6, 6), d = R(rng, 1, 5);
        const C = d * h - A * t - B * y0;
        const t2 = t - 2 * d * h / A;
        if (t2 > 0 || C === 0) continue;
        const V = B * y0 + C;
        return item(
          L3('점 P 와 직선 사이의 거리가 d 입니다. 거리 공식으로 식을 세워 양수 t 를 구합니다.',
             'The distance from P to the line is d. Set up the distance formula and find the positive t.',
             '点P到直线的距离为d。用距离公式列方程，求正数t。'),
          `P(t,${y0}),\\ ${lineTex(A, B, C)},\\ d=${d}\\ (t>0) \\;\\Rightarrow\\; t=\\square`, t, [
            { tex:`\\dfrac{|${A}t${more(V, '')}|}{\\sqrt{${A}^2+${par(B)}^2}}=${d}` },
            { tex:`${A}t${more(V, '')}=\\pm ${d * h}` },
            { tex:`t=\\square`, blank:t }]);
      }
    }
    for (let g = 0; g < 400; g++) {
      const [a, b, h] = normal(rng);
      const x0 = R(rng, -6, 6), y0 = R(rng, -6, 6), d = R(rng, 1, 6);
      const V = a * x0 + b * y0, T = d * h;
      if (Math.abs(V) >= T) continue;
      const pos = pick(rng, [1, 1, 0]);
      const ans = pos ? -V + T : -V - T;
      return item(
        pos
          ? L3('점 P 와 직선 사이의 거리가 d 입니다. |ax₀+by₀+k|=d√(a²+b²) 에서 k 의 두 값 가운데 양수를 구합니다.',
               'The distance from P to the line is d. From |ax₀+by₀+k|=d√(a²+b²), find the positive one of the two values of k.',
               '点P到直线的距离为d。由|ax₀+by₀+k|=d√(a²+b²)，求k的两个值中的正数。')
          : L3('점 P 와 직선 사이의 거리가 d 입니다. |ax₀+by₀+k|=d√(a²+b²) 에서 k 의 두 값 가운데 음수를 구합니다.',
               'The distance from P to the line is d. From |ax₀+by₀+k|=d√(a²+b²), find the negative one of the two values of k.',
               '点P到直线的距离为d。由|ax₀+by₀+k|=d√(a²+b²)，求k的两个值中的负数。'),
        `P${pt(x0, y0)},\\ ${terms([[a, 'x'], [b, 'y']])}+k=0,\\ d=${d}\\ (k${pos ? '>' : '<'}0) \\;\\Rightarrow\\; k=\\square`, ans, [
          { tex:`\\dfrac{${absSum(V, 'k')}}{${h}}=${d}` },
          { tex:`k=${-V === 0 ? '' : -V}\\pm ${T}` },
          { tex:`k=\\square`, blank:ans }]);
    }
  }

  /* dist(기본) */
  const [a, b, h] = normal(rng);
  const x0 = R(rng, -6, 6), y0 = R(rng, -6, 6), d = R(rng, 1, 6);
  const c = pick(rng, [1, -1]) * d * h - a * x0 - b * y0;
  return item(
    L3('점 (x₀, y₀) 와 직선 ax+by+c=0 사이의 거리는 |ax₀+by₀+c|/√(a²+b²) 입니다.',
       'The distance from (x₀, y₀) to the line ax+by+c=0 is |ax₀+by₀+c|/√(a²+b²).',
       '点(x₀, y₀)到直线ax+by+c=0的距离为|ax₀+by₀+c|/√(a²+b²)。'),
    `P${pt(x0, y0)},\\ ${lineTex(a, b, c)} \\;\\Rightarrow\\; d=\\square`, d, [
      { tex:`d=\\dfrac{|${subExpr(a, b, c, x0, y0)}|}{\\sqrt{${a}^2+${par(b)}^2}}` },
      { tex:`d=\\dfrac{${d * h}}{${h}}=\\square`, blank:d }]);
};

/* ── MD117 — 좌표축에 접하는 원 (문장제) ──
   x축에 접하면 반지름 = |중심의 y좌표|, y축에 접하면 반지름 = |중심의 x좌표|. */
/* x축에 접하고 중심이 (a, k) 인 원이 (a±w, q) 를 지남: w² = q(2k−q) */
const PASS_X = [];
for (let k = 1; k <= 10; k++) for (let q = 1; q < 2 * k; q++) {
  const s = q * (2 * k - q), w = Math.round(Math.sqrt(s));
  if (w * w === s && w > 0) PASS_X.push([k, q, w]);
}
/* 두 축에 접하고 (p1,p2) 를 지나는 원 두 개(제1사분면): r = p1+p2 ± √(2p1p2) */
const PASS_XY = [];
for (let p1 = 1; p1 <= 12; p1++) for (let p2 = 1; p2 <= 12; p2++) {
  const s = 2 * p1 * p2, w = Math.round(Math.sqrt(s));
  if (w * w === s) PASS_XY.push([p1, p2, p1 + p2 - w, p1 + p2 + w]);
}
NM_TGEN['md117_circleAxis'] = function (params, rng) {
  const mode = params.mode || 'xAxis';

  if (mode === 'both') {
    const Q = QUAD[R(rng, 1, 4)], [s1, s2] = Q.s;
    if (pick(rng, [0, 1])) {
      /* 중심 (s1 r, s2 r) 이 직선 y=mx+n 위에 */
      /* s2 − m·s1 = 0 이면(m = s1·s2) 직선이 원점을 지나 반지름이 정해지지 않으므로 뺀다 */
      const m = pick(rng, [-3, -2, -1, 1, 2, 3].filter(v => v !== s1 * s2));
      const r = R(rng, 1, 9), n = s2 * r - m * s1 * r;
      const askSq = pick(rng, [0, 0, 1]), ans = askSq ? r * r : r;
      const line = `y=${pLead(m, 'x')}${pMore(n, '')}`;
      return word(
        L3(`중심이 직선 ${line} 위에 있고, ${Q.ko}에서 x축과 y축에 모두 접하는 원이 있습니다.`,
           `A circle has its center on the line ${line} and touches both the x-axis and the y-axis in ${Q.en}.`,
           `一个圆的圆心在直线${line}上，并在${Q.zh}内与x轴、y轴都相切。`),
        askSq
          ? L3('이 원의 넓이가 kπ 일 때 k 의 값을 구합니다.', 'Its area is kπ. Find k.', '这个圆的面积为kπ，求k的值。')
          : L3('이 원의 반지름을 구합니다.', 'Find its radius.', '求这个圆的半径。'),
        `\\square`, ans, [
          { tex:`(${s1 < 0 ? '-' : ''}r,\\ ${s2 < 0 ? '-' : ''}r)` },
          { tex:`${s2 < 0 ? '-' : ''}r=${cf(m * s1, 'r')}${more(n, '')}` },
          { tex:`r=${r}` },
          { tex: askSq ? `k=r^2=\\square` : `r=\\square`, blank:ans }]);
    }
    const [p1, p2, r1, r2] = pick(rng, PASS_XY);
    const kind = pick(rng, ['sum', 'big', 'small']);
    const ans = kind === 'sum' ? r1 + r2 : kind === 'big' ? r2 : r1;
    const P = pPt(s1 * p1, s2 * p2);
    return word(
      L3(`점 ${P} 을 지나고 x축과 y축에 모두 접하는 원은 두 개입니다.`,
         `Exactly two circles pass through the point ${P} and touch both the x-axis and the y-axis.`,
         `经过点${P}且与x轴、y轴都相切的圆有两个。`),
      kind === 'sum' ? L3('두 원의 반지름의 합을 구합니다.', 'Find the sum of their radii.', '求两个圆的半径之和。')
        : kind === 'big' ? L3('두 원 가운데 큰 원의 반지름을 구합니다.', 'Find the radius of the larger circle.', '求其中较大圆的半径。')
        : L3('두 원 가운데 작은 원의 반지름을 구합니다.', 'Find the radius of the smaller circle.', '求其中较小圆的半径。'),
      `\\square`, ans, [
        { tex:`(x${s1 > 0 ? '-' : '+'}r)^2+(y${s2 > 0 ? '-' : '+'}r)^2=r^2` },
        { tex:`${poly([1, -2 * (p1 + p2), p1 * p1 + p2 * p2], 'r')}=0` },
        { tex:`(r-${r1})(r-${r2})=0` },
        { tex:`\\square`, blank:ans }]);
  }

  if (mode === 'unknown') {
    const kind = pick(rng, ['x', 'y', 'both']);
    const a = nzInt(rng, 1, 7);
    const b = kind === 'both' ? a * pick(rng, [1, -1]) : nzInt(rng, 1, 7);
    const c0 = R(rng, -6, 6);
    const r = kind === 'y' ? Math.abs(a) : Math.abs(b);
    const k = a * a + b * b - r * r - c0;
    const eq = `x²+y²${pMore(-2 * a, 'x')}${pMore(-2 * b, 'y')}+k${pMore(c0, '')}=0`;
    const where = kind === 'x' ? L3('x축에 접합니다', 'touches the x-axis', '与x轴相切')
      : kind === 'y' ? L3('y축에 접합니다', 'touches the y-axis', '与y轴相切')
      : L3('x축과 y축에 모두 접합니다', 'touches both the x-axis and the y-axis', '与x轴、y轴都相切');
    const S = a * a + b * b - c0;
    return word(
      L3(`원 ${eq} 이 ${where.ko}.`, `The circle ${eq} ${where.en}.`, `圆${eq}${where.zh}。`),
      L3('상수 k 의 값을 구합니다.', 'Find the constant k.', '求常数k的值。'),
      `\\square`, k, [
        { tex:`${sqPart(a, 'x')}+${sqPart(b, 'y')}=${S}-k` },
        { tex:`r=${r},\\quad ${S}-k=${r * r}` },
        { tex:`k=\\square`, blank:k }]);
  }

  /* xAxis(기본) */
  const kind = pick(rng, ['r2', 'C', 'pass']);
  if (kind === 'pass') {
    const [k0, q0, w] = pick(rng, PASS_X);
    const sg = pick(rng, [1, -1]), k = sg * k0, q = sg * q0;
    const a = R(rng, -6, 6), p = a + pick(rng, [1, -1]) * w;
    return word(
      L3(`x축에 접하고 중심이 점 (${u(a)}, k) 인 원이 점 ${pPt(p, q)} 을 지납니다.`,
         `A circle touching the x-axis has center (${u(a)}, k) and passes through the point ${pPt(p, q)}.`,
         `一个与x轴相切的圆，圆心为(${u(a)}, k)，并经过点${pPt(p, q)}。`),
      L3('k 의 값을 구합니다.', 'Find k.', '求k的值。'),
      `\\square`, k, [
        { tex:`r=|k|,\\quad (${p}-${par(a)})^2+(${q}-k)^2=k^2` },
        { tex:`${lead(2 * q, 'k')}=${w * w + q * q}` },
        { tex:`k=\\square`, blank:k }]);
  }
  const a = nzInt(rng, 1, 8), b = nzInt(rng, 1, 9);
  if (kind === 'C') {
    const ans = a * a;
    const eq = `x²+y²${pMore(-2 * a, 'x')}${pMore(-2 * b, 'y')}+C=0`;
    return word(
      L3(`중심이 점 ${pPt(a, b)} 이고 x축에 접하는 원의 방정식을 ${eq} 으로 나타냅니다.`,
         `The circle with center ${pPt(a, b)} touching the x-axis is written as ${eq}.`,
         `圆心为${pPt(a, b)}且与x轴相切的圆的方程写成${eq}。`),
      L3('상수 C 의 값을 구합니다.', 'Find the constant C.', '求常数C的值。'),
      `\\square`, ans, [
        { tex:`r=|${b}|=${Math.abs(b)}` },
        { tex:`C=${par(a)}^2+${par(b)}^2-${b * b}` },
        { tex:`C=\\square`, blank:ans }]);
  }
  const ans = b * b;
  return word(
    L3(`중심이 점 ${pPt(a, b)} 이고 x축에 접하는 원이 있습니다.`,
       `A circle has center ${pPt(a, b)} and touches the x-axis.`,
       `一个圆的圆心为${pPt(a, b)}，且与x轴相切。`),
    L3(`이 원의 방정식을 ${pSq('x', a)}+${pSq('y', b)}=r² 으로 나타낼 때 r² 의 값을 구합니다.`,
       `Writing it as ${pSq('x', a)}+${pSq('y', b)}=r², find r².`,
       `把它写成${pSq('x', a)}+${pSq('y', b)}=r²，求r²的值。`),
    `\\square`, ans, [
      { tex:`r=|${b}|=${Math.abs(b)}` },
      { tex:`r^2=\\square`, blank:ans }]);
};

/* ── MD118 — 원과 직선의 위치 관계 ── */
/* 원 (x−a)²+(y−b)²=t²(1+m²) 과 y=mx+k: 중심과 직선 사이 거리 = √r² ⇔ |ma−b+k| = t(1+m²) */
function slopeCircle(rng){
  const m = nzInt(rng, 1, 3), t = R(rng, 1, 3);
  const a = R(rng, -4, 4), b = R(rng, -4, 4);
  return { m, t, a, b, R2: t * t * (1 + m * m), T: t * (1 + m * m), V: m * a - b };
}
NM_TGEN['md118_circleLine'] = function (params, rng) {
  const mode = params.mode || 'count';

  if (mode === 'tangent' || mode === 'range') {
    const range = mode === 'range';
    const useSlope = pick(rng, [0, 1]);
    let c, T, V, lineT, sol0, circT;
    for (let g = 0; g < 400; g++) {
      if (useSlope) {
        c = slopeCircle(rng); T = c.T; V = c.V;
        circT = circ(c.a, c.b, c.R2);
        lineT = `y=${lead(c.m, 'x')}+k`;
        sol0 = `\\dfrac{${absSum(V, 'k')}}{\\sqrt{${1 + c.m * c.m}}}${range ? '<' : '='}\\sqrt{${c.R2}}`;
      } else {
        const [A, B, h] = normal(rng);
        const a = R(rng, -4, 4), b = R(rng, -4, 4), r = R(rng, 1, 5);
        T = r * h; V = A * a + B * b;
        circT = circ(a, b, r * r);
        lineT = `${terms([[A, 'x'], [B, 'y']])}+k=0`;
        sol0 = `\\dfrac{${absSum(V, 'k')}}{${h}}${range ? '<' : '='}${r}`;
      }
      if (!range && Math.abs(V) >= T) continue;
      break;
    }
    if (range) {
      const lo = -V - T, hi = -V + T;
      return item(
        L3('원과 직선이 서로 다른 두 점에서 만나려면 (중심과 직선 사이의 거리) < (반지름) 이어야 합니다. k 의 범위를 구합니다.',
           'The circle and the line meet at two distinct points exactly when (distance from the center to the line) < (radius). Find the range of k.',
           '圆与直线交于两个不同点的条件是(圆心到直线的距离)<(半径)。求k的范围。'),
        `${circT},\\ ${lineT} \\;\\Rightarrow\\; \\square<k<\\square`, [lo, hi], [
          { tex:sol0 },
          { tex:`${-T}<k${more(V, '')}<${T}` },
          { tex:`\\square<k<\\square`, blank:[lo, hi] }]);
    }
    const pos = pick(rng, [1, 1, 0]);
    const ans = pos ? -V + T : -V - T;
    return item(
      pos
        ? L3('원과 직선이 접하려면 (중심과 직선 사이의 거리) = (반지름) 이어야 합니다. k 의 두 값 가운데 양수를 구합니다.',
             'The line touches the circle exactly when (distance from the center to the line) = (radius). Find the positive one of the two values of k.',
             '直线与圆相切的条件是(圆心到直线的距离)=(半径)。求k的两个值中的正数。')
        : L3('원과 직선이 접하려면 (중심과 직선 사이의 거리) = (반지름) 이어야 합니다. k 의 두 값 가운데 음수를 구합니다.',
             'The line touches the circle exactly when (distance from the center to the line) = (radius). Find the negative one of the two values of k.',
             '直线与圆相切的条件是(圆心到直线的距离)=(半径)。求k的两个值中的负数。'),
      `${circT},\\ ${lineT}\\ (k${pos ? '>' : '<'}0) \\;\\Rightarrow\\; k=\\square`, ans, [
        { tex:sol0 },
        { tex:`k${more(V, '')}=\\pm ${T}` },
        { tex:`k=\\square`, blank:ans }]);
  }

  /* count(기본) — 교점의 개수 0·1·2 를 먼저 고른다 */
  const target = pick(rng, [0, 1, 2]);
  const prompt = L3('중심과 직선 사이의 거리 d 와 반지름 r 을 비교하거나(d<r 이면 2, d=r 이면 1, d>r 이면 0), 연립한 이차방정식의 판별식으로 교점의 개수를 구합니다.',
    'Compare the distance d from the center to the line with the radius r (d<r: 2, d=r: 1, d>r: 0), or use the discriminant of the combined quadratic, to find the number of common points.',
    '比较圆心到直线的距离d与半径r(d<r为2，d=r为1，d>r为0)，或用联立所得二次方程的判别式，求交点个数。');
  if (pick(rng, [0, 1])) {
    /* 원점 중심 x²+y²=Rr, 직선 y=mx+n — D/4 = Rr(1+m²) − n² */
    let m, n, Rr, D4, g = 0;
    do {
      m = nzInt(rng, 1, 3);
      if (target === 1) { const t = R(rng, 1, 3); Rr = t * t * (1 + m * m); n = pick(rng, [1, -1]) * t * (1 + m * m); }
      else { Rr = R(rng, 2, 30); n = nzInt(rng, 1, 12); }
      D4 = Rr * (1 + m * m) - n * n;
    } while ((target === 2 ? D4 <= 0 : target === 1 ? D4 !== 0 : D4 >= 0) && g++ < 200);
    if (target !== (D4 > 0 ? 2 : D4 === 0 ? 1 : 0)) { m = 1; n = 2; Rr = 2; D4 = 0; }
    const ans = D4 > 0 ? 2 : D4 === 0 ? 1 : 0;
    return item(prompt,
      `x^2+y^2=${Rr},\\ y=${lead(m, 'x')}${more(n, '')} \\;\\Rightarrow\\; \\square`, ans, [
        { tex:`${poly([1 + m * m, 2 * m * n, n * n - Rr])}=0` },
        { tex:`\\dfrac{D}{4}=${par(m * n)}^2-${1 + m * m}\\times${par(n * n - Rr)}=${D4}` },
        { tex:`\\square`, blank:ans }]);
  }
  const [A, B, h] = normal(rng);
  const a = pick(rng, [0, 1]) ? 0 : R(rng, -5, 5), b = a === 0 && pick(rng, [0, 1]) ? 0 : R(rng, -5, 5);
  const r = R(rng, 1, 8);
  const d = target === 1 ? r : target === 2 ? R(rng, 0, r - 1) : R(rng, r + 1, r + 4);
  const C = pick(rng, [1, -1]) * d * h - A * a - B * b;
  return item(prompt,
    `${circ(a, b, r * r)},\\ ${lineTex(A, B, C)} \\;\\Rightarrow\\; \\square`, target, [
      { tex:`d=\\dfrac{|${subExpr(A, B, C, a, b)}|}{\\sqrt{${A}^2+${par(B)}^2}}=${d},\\quad r=${r}` },
      { tex:`\\square`, blank:target }]);
};

/* ── MD119 — 원의 접선의 방정식 ── */
/* 원점 중심 x²+y²=Rr 에 기울기 m 인 접선 y=mx±n: n² = Rr(1+m²) — n² 이 (1+m²) 로 나누어떨어지는 쌍 */
const SLOPE_T = [];
for (let m = 1; m <= 7; m++) for (let n = 1; n <= 40; n++) {
  const q = 1 + m * m;
  if ((n * n) % q === 0 && n * n / q <= 120) SLOPE_T.push([m, n, n * n / q]);
}
/* 원 밖의 점 P(p,q) 에서 x²+y²=Rr 에 그은 접선의 기울기: (p²−Rr)m² − 2pq·m + q²−Rr = 0 */
const OUT_SUM = [], OUT_PROD = [];
for (let p = -8; p <= 8; p++) for (let q = -8; q <= 8; q++) for (let Rr = 1; Rr <= 60; Rr++) {
  if (p * p + q * q <= Rr || p * p === Rr) continue;
  const den = p * p - Rr;
  if ((2 * p * q) % den === 0 && p * q !== 0) OUT_SUM.push([p, q, Rr]);
  if ((q * q - Rr) % den === 0 && q * q !== Rr) OUT_PROD.push([p, q, Rr]);
}
NM_TGEN['md119_tangentLine'] = function (params, rng) {
  const mode = params.mode || 'onCircle';

  if (mode === 'slope') {
    const [m0, n, Rr] = pick(rng, SLOPE_T);
    const m = m0 * pick(rng, [1, -1]);
    const pos = pick(rng, [1, 1, 0]);
    const ans = pos ? n : -n;
    const kind = pick(rng, ['slope', 'par', 'perp']);
    const sign = `(n${pos ? '>' : '<'}0)`;
    const sol = [
      { tex:`n^2=${Rr}\\times(${m0 * m0}+1)=${n * n}` },
      { tex:`n=\\pm ${n}` },
      { tex:`n=\\square`, blank:ans }];
    if (kind === 'slope') {
      return item(
        L3('원 x²+y²=r² 에 접하고 기울기가 m 인 직선은 y=mx±r√(m²+1) 입니다.',
           'The lines with slope m tangent to x²+y²=r² are y=mx±r√(m²+1).',
           '与圆x²+y²=r²相切且斜率为m的直线是y=mx±r√(m²+1)。'),
        `x^2+y^2=${Rr},\\ y=${lead(m, 'x')}+n\\ ${sign} \\;\\Rightarrow\\; n=\\square`, ans, sol);
    }
    const q = pick(rng, [1, 1, 2, 3]), c = nzInt(rng, 1, 9);
    const given = kind === 'par' ? lineTex(m * q, -q, c) : lineTex(q, m * q, c);
    return item(
      kind === 'par'
        ? L3('접선 ℓ 은 주어진 직선과 평행하므로 기울기가 같습니다. 기울기 a 를 구한 뒤 y=ax±r√(a²+1) 을 씁니다.',
             'The tangent ℓ is parallel to the given line, so it has the same slope a. Find a, then use y=ax±r√(a²+1).',
             '切线ℓ与已知直线平行，斜率相同。求出斜率a后用y=ax±r√(a²+1)。')
        : L3('접선 ℓ 은 주어진 직선과 수직이므로 기울기의 곱이 −1 입니다. 기울기 a 를 구한 뒤 y=ax±r√(a²+1) 을 씁니다.',
             'The tangent ℓ is perpendicular to the given line, so the product of the slopes is −1. Find a, then use y=ax±r√(a²+1).',
             '切线ℓ与已知直线垂直，斜率之积为−1。求出斜率a后用y=ax±r√(a²+1)。'),
      `x^2+y^2=${Rr},\\ \\ell${kind === 'par' ? '\\parallel' : '\\perp'}(${given}),\\ \\ell:\\ y=ax+n\\ ${sign} \\;\\Rightarrow\\; n=\\square`, ans,
      [{ tex:`a=${m}` }].concat(sol));
  }

  if (mode === 'outside') {
    const kind = pick(rng, ['length', 'length', 'sum', 'prod']);
    if (kind === 'length') {
      let a, b, dx, dy, L, Rr, g = 0;
      do {
        a = pick(rng, [0, 1]) ? 0 : R(rng, -4, 4); b = a === 0 ? 0 : R(rng, -4, 4);
        dx = R(rng, -8, 8); dy = R(rng, -8, 8); L = R(rng, 1, 8);
        Rr = dx * dx + dy * dy - L * L;
      } while (Rr < 1 && g++ < 200);
      if (Rr < 1) { a = 0; b = 0; dx = 3; dy = 4; L = 4; Rr = 9; }
      const D2 = dx * dx + dy * dy;
      const circT = a === 0 && b === 0 ? `x^2+y^2=${Rr}` : circ(a, b, Rr);
      return item(
        L3('점 P 에서 원에 그은 접선의 접점을 T, 원의 중심을 C 라 하면 삼각형 CTP 는 직각삼각형이므로 PT²=CP²−r² 입니다.',
           'Let T be the point of tangency of a tangent from P and C the center. Triangle CTP is right-angled, so PT²=CP²−r².',
           '设从P引圆的切线的切点为T，圆心为C，则三角形CTP是直角三角形，PT²=CP²−r²。'),
        `${circT},\\ P${pt(a + dx, b + dy)} \\;\\Rightarrow\\; \\overline{PT}=\\square`, L, [
          { tex:`\\overline{CP}^2=${par(dx)}^2+${par(dy)}^2=${D2}` },
          { tex:`\\overline{PT}^2=${D2}-${Rr}=${L * L}` },
          { tex:`\\overline{PT}=\\square`, blank:L }]);
    }
    const isSum = kind === 'sum';
    const [p, q, Rr] = pick(rng, isSum ? OUT_SUM : OUT_PROD);
    const den = p * p - Rr;
    const ans = isSum ? 2 * p * q / den : (q * q - Rr) / den;
    return item(
      L3('점 P 를 지나는 직선 y−q=m(x−p) 가 원에 접할 조건(중심과의 거리 = 반지름)에서 m 에 대한 이차방정식을 세우고, 두 근 m₁, m₂(두 접선의 기울기)에 근과 계수의 관계를 씁니다.',
         'For the line y−q=m(x−p) through P to touch the circle (distance from the center = radius), set up a quadratic in m; its roots m₁, m₂ are the two tangent slopes, so use the root–coefficient relations.',
         '过点P的直线y−q=m(x−p)与圆相切(圆心到直线的距离=半径)，得到关于m的二次方程，两根m₁、m₂是两条切线的斜率，用根与系数的关系。'),
      `x^2+y^2=${Rr},\\ P${pt(p, q)} \\;\\Rightarrow\\; ${isSum ? 'm_1+m_2' : 'm_1m_2'}=\\square`, ans, [
        { tex:`\\dfrac{|${terms([[-p, 'm'], [q, '']])}|}{\\sqrt{m^2+1}}=\\sqrt{${Rr}}` },
        { tex:`${poly([den, -2 * p * q, q * q - Rr], 'm')}=0` },
        { tex: isSum ? `m_1+m_2=\\dfrac{${2 * p * q}}{${den}}=\\square` : `m_1m_2=\\dfrac{${q * q - Rr}}{${den}}=\\square`, blank:ans }]);
  }

  /* onCircle(기본) — 접점 P=(a+u, b+v), u=tv. 접선: u(x−a)+v(y−b)=u²+v² ⇒ y=−tx+n */
  const origin = pick(rng, [0, 1]);
  const a = origin ? 0 : R(rng, -5, 5), b = origin ? 0 : R(rng, -5, 5);
  const v = nzInt(rng, 1, 4), t = nzInt(rng, 1, 3), uu = t * v;
  const Rr = uu * uu + v * v, n = t * a + b + v * (t * t + 1);
  const circT = a === 0 && b === 0 ? `x^2+y^2=${Rr}` : circ(a, b, Rr);
  return item(
    L3('원 위의 점 P 에서의 접선은 반지름 CP 에 수직입니다. 원 x²+y²=r² 위의 점 (x₁, y₁) 에서의 접선은 x₁x+y₁y=r² 입니다.',
       'The tangent at a point P on the circle is perpendicular to the radius CP. For x²+y²=r², the tangent at (x₁, y₁) is x₁x+y₁y=r².',
       '圆上一点P处的切线垂直于半径CP。圆x²+y²=r²上点(x₁, y₁)处的切线为x₁x+y₁y=r²。'),
    `${circT},\\ P${pt(a + uu, b + v)} \\;\\Rightarrow\\; y=${lead(-t, 'x')}+\\square`, n, [
      { tex:`${cf(uu, grp(a, 'x'))}${cfMore(v, grp(b, 'y'))}=${Rr}` },
      { tex:`y=${lead(-t, 'x')}+\\square`, blank:n }]);
};

/* ── MD120 — 평행이동 ── */
function trTex(a, b){ return `(x,\\ y)\\to(x${more(a, '')},\\ y${more(b, '')})`; }
NM_TGEN['md120_translate'] = function (params, rng) {
  const mode = params.mode || 'point';
  const a = nzInt(rng, 1, 6), b = nzInt(rng, 1, 6);

  if (mode === 'line') {
    const kind = pick(rng, ['si', 'gen', 'find']);
    const m = nzInt(rng, 1, 4), n = R(rng, -8, 8);
    if (kind === 'gen') {
      const A = nzInt(rng, 1, 5), B = nzInt(rng, 1, 5), C = R(rng, -9, 9);
      const ans = C - A * a - B * b;
      return item(
        L3('평행이동 (x, y)→(x+a, y+b) 로 옮긴 도형의 방정식은 x 대신 x−a, y 대신 y−b 를 넣어 얻습니다.',
           'Under (x, y)→(x+a, y+b), the moved figure’s equation comes from replacing x with x−a and y with y−b.',
           '按(x, y)→(x+a, y+b)平移后，图形的方程用x−a代x、y−b代y得到。'),
        `${trTex(a, b)}:\\ ${lineTex(A, B, C)} \\;\\Rightarrow\\; ${terms([[A, 'x'], [B, 'y']])}+\\square=0`, ans, [
          { tex:`${cf(A, `(${xMinus(a)})`)}${cfMore(B, `(${xMinus(b, 'y')})`)}${more(C, '')}=0` },
          { tex:`${terms([[A, 'x'], [B, 'y']])}+\\square=0`, blank:ans }]);
    }
    const n2 = n - m * a + b;
    if (kind === 'find') {
      const nm = n - m * a;
      return item(
        L3('직선을 x축 방향으로 주어진 만큼, y축 방향으로 k 만큼 평행이동했더니 오른쪽 직선이 되었습니다. k 의 값을 구합니다.',
           'The line was moved by the given amount along the x-axis and by k along the y-axis, giving the line on the right. Find k.',
           '把直线沿x轴方向平移给定的量、沿y轴方向平移k，得到右边的直线。求k的值。'),
        `(x,\\ y)\\to(x${more(a, '')},\\ y+k):\\ y=${lead(m, 'x')}${more(n, '')}\\ \\to\\ y=${lead(m, 'x')}${more(n2, '')} \\;\\Rightarrow\\; k=\\square`, b, [
          { tex:`y-k=${cf(m, `(${xMinus(a)})`)}${more(n, '')}` },
          { tex:`y=${lead(m, 'x')}${more(nm, '')}+k` },
          { tex:`k=\\square`, blank:b }]);
    }
    return item(
      L3('평행이동 (x, y)→(x+a, y+b) 로 옮긴 직선은 x 대신 x−a, y 대신 y−b 를 넣어 얻습니다. 옮긴 직선의 y절편을 구합니다.',
         'Under (x, y)→(x+a, y+b), replace x with x−a and y with y−b. Find the y-intercept of the moved line.',
         '按(x, y)→(x+a, y+b)平移，用x−a代x、y−b代y。求平移后直线的y截距。'),
      `${trTex(a, b)}:\\ y=${lead(m, 'x')}${more(n, '')} \\;\\Rightarrow\\; y=${lead(m, 'x')}+\\square`, n2, [
        { tex:`y${more(-b, '')}=${cf(m, `(${xMinus(a)})`)}${more(n, '')}` },
        { tex:`y=${lead(m, 'x')}+\\square`, blank:n2 }]);
  }

  if (mode === 'circle') {
    const p = R(rng, -6, 6), q = R(rng, -6, 6), r = R(rng, 1, 6), Rr = r * r;
    if (pick(rng, [0, 1])) {
      return item(
        L3('원을 평행이동하면 반지름은 그대로이고 중심만 옮겨집니다. 원의 중심을 찾아 옮긴 원의 중심의 좌표를 구합니다.',
           'Translating a circle keeps its radius and moves only its center. Find the center, then the center of the moved circle.',
           '平移圆时半径不变，只有圆心移动。先求圆心，再求平移后圆的圆心坐标。'),
        `${trTex(a, b)}:\\ ${genCirc(p, q, Rr)} \\;\\Rightarrow\\; (\\square,\\ \\square)`, [p + a, q + b], [
          { tex:circ(p, q, Rr) },
          { tex:`(${p}${more(a, '')},\\ ${q}${more(b, '')})` },
          { tex:`(\\square,\\ \\square)`, blank:[p + a, q + b] }]);
    }
    return item(
      L3('평행이동 (x, y)→(x+a, y+b) 로 왼쪽 원이 오른쪽 원으로 옮겨졌습니다. 두 중심을 비교해 a, b 를 구합니다.',
         'The translation (x, y)→(x+a, y+b) moves the left circle onto the right one. Compare the centers to find a and b.',
         '平移(x, y)→(x+a, y+b)把左边的圆移到右边的圆。比较两个圆心求a、b。'),
      `${circ(p, q, Rr)}\\ \\to\\ ${genCirc(p + a, q + b, Rr)} \\;\\Rightarrow\\; a=\\square,\\ b=\\square`, [a, b], [
        { tex:`(${p},${q})\\ \\to\\ (${p + a},${q + b})` },
        { tex:`a=${p + a}-${par(p)},\\ b=${q + b}-${par(q)}` },
        { tex:`a=\\square,\\ b=\\square`, blank:[a, b] }]);
  }

  /* point(기본) */
  const x = R(rng, -8, 8), y = R(rng, -8, 8);
  const kind = pick(rng, ['fwd', 'back', 'pair']);
  if (kind === 'back') {
    return item(
      L3('평행이동한 뒤의 점이 주어졌습니다. 거꾸로 옮겨(−a, −b) 처음 점을 구합니다.',
         'The point after the translation is given. Move it back by (−a, −b) to find the original point.',
         '已知平移后的点。反向平移(−a, −b)求原来的点。'),
      `${trTex(a, b)}:\\ P\\ \\to\\ ${pt(x + a, y + b)} \\;\\Rightarrow\\; P(\\square,\\ \\square)`, [x, y], [
        { tex:`(${x + a}${more(-a, '')},\\ ${y + b}${more(-b, '')})` },
        { tex:`P(\\square,\\ \\square)`, blank:[x, y] }]);
  }
  if (kind === 'pair') {
    const px = R(rng, -6, 6), py = R(rng, -6, 6);
    return item(
      L3('점 P 를 P′ 으로 옮기는 평행이동으로 점 Q 를 옮깁니다. 먼저 x, y 방향으로 얼마나 옮기는지 구합니다.',
         'The translation that moves P to P′ also moves Q. First find how far it moves in the x- and y-directions.',
         '把点P移到P′的平移也移动点Q。先求沿x、y方向各移动多少。'),
      `P${pt(px, py)}\\to P'${pt(px + a, py + b)},\\ Q${pt(x, y)} \\;\\Rightarrow\\; Q'(\\square,\\ \\square)`, [x + a, y + b], [
        { tex:`(${px + a}-${par(px)},\\ ${py + b}-${par(py)})=(${a},${b})` },
        { tex:`Q'(\\square,\\ \\square)`, blank:[x + a, y + b] }]);
  }
  return item(
    L3('평행이동 (x, y)→(x+a, y+b) 는 x 좌표에 a, y 좌표에 b 를 더합니다.',
       'The translation (x, y)→(x+a, y+b) adds a to the x-coordinate and b to the y-coordinate.',
       '平移(x, y)→(x+a, y+b)把x坐标加a、y坐标加b。'),
    `${trTex(a, b)}:\\ P${pt(x, y)} \\;\\Rightarrow\\; P'(\\square,\\ \\square)`, [x + a, y + b], [
      { tex:`(${x}${more(a, '')},\\ ${y}${more(b, '')})` },
      { tex:`P'(\\square,\\ \\square)`, blank:[x + a, y + b] }]);
};

/* ── MD121 — 대칭이동 ──
   거울: x축(직선 y=0) · y축(직선 x=0) · 원점 O · 직선 y=x · 직선 y=−x */
const MIRROR = {
  x:{ lab:'y=0',  f:(x, y) => [x, -y] },
  y:{ lab:'x=0',  f:(x, y) => [-x, y] },
  o:{ lab:'O',    f:(x, y) => [-x, -y] },
  d:{ lab:'y=x',  f:(x, y) => [y, x] },
  e:{ lab:'y=-x', f:(x, y) => [-y, -x] }
};
function arrow(k){ return `\\ \\xrightarrow{\\ ${MIRROR[k].lab}\\ }\\ `; }
const MIRROR_NOTE = L3('화살표 위의 기호는 대칭의 기준입니다: y=0 은 x축, x=0 은 y축, O 는 원점, y=x·y=−x 는 그 직선입니다.',
  'The label on each arrow is the mirror: y=0 is the x-axis, x=0 is the y-axis, O is the origin, and y=x, y=−x are those lines.',
  '箭头上的记号是对称的基准：y=0是x轴，x=0是y轴，O是原点，y=x、y=−x是那两条直线。');
function withNote(p){ return L3(p.ko + ' ' + MIRROR_NOTE.ko, p.en + ' ' + MIRROR_NOTE.en, p.zh + ' ' + MIRROR_NOTE.zh); }
NM_TGEN['md121_reflect'] = function (params, rng) {
  const mode = params.mode || 'point';

  if (mode === 'line') {
    if (pick(rng, [0, 1])) {
      /* y=mx+n 꼴 — y=x·y=−x 는 기울기 ±1 일 때만(기울기가 1/m 이 되므로) */
      const k = pick(rng, ['x', 'y', 'o', 'd', 'e']);
      const m = k === 'd' || k === 'e' ? pick(rng, [1, -1]) : nzInt(rng, 1, 5);
      const n = nzInt(rng, 1, 9);
      let M, N, step;
      if (k === 'x') { M = -m; N = -n; step = `-y=${lead(m, 'x')}${more(n, '')}`; }
      else if (k === 'y') { M = -m; N = n; step = `y=${lead(-m, 'x')}${more(n, '')}`; }
      else if (k === 'o') { M = m; N = -n; step = `-y=${lead(-m, 'x')}${more(n, '')}`; }
      else if (k === 'd') { M = m; N = -n * m; step = `x=${lead(m, 'y')}${more(n, '')}`; }
      else { M = m; N = n * m; step = `-x=${lead(-m, 'y')}${more(n, '')}`; }
      return item(
        withNote(L3('직선을 대칭이동하면 x, y 를 대칭점의 좌표로 바꾸어 넣습니다(예: x축 대칭은 y 대신 −y).',
          'To reflect a line, substitute the reflected coordinates for x and y (e.g. for the x-axis, replace y with −y).',
          '对称变换直线时，把x、y换成对称点的坐标(例如关于x轴对称时用−y代y)。')),
        `y=${lead(m, 'x')}${more(n, '')}${arrow(k)}y=\\square x+\\square`, [M, N], [
          { tex:step },
          { tex:`y=\\square x+\\square`, blank:[M, N] }]);
    }
    /* ax+by+c=0 꼴 — 옮긴 식은 x 의 계수가 양수가 되도록 정리해 보여 준다 */
    const k = pick(rng, ['x', 'y', 'o', 'd', 'e']);
    const A = nzInt(rng, 1, 6), B = nzInt(rng, 1, 6), C = nzInt(rng, 1, 9);
    let nA, nB;
    if (k === 'x') { nA = A; nB = -B; }
    else if (k === 'y') { nA = -A; nB = B; }
    else if (k === 'o') { nA = -A; nB = -B; }
    else if (k === 'd') { nA = B; nB = A; }
    else { nA = -B; nB = -A; }
    let nC = C;
    const raw = lineTex(nA, nB, nC);
    if (nA < 0) { nA = -nA; nB = -nB; nC = -nC; }
    return item(
      withNote(L3('직선을 대칭이동하면 x, y 를 대칭점의 좌표로 바꾸어 넣습니다. x 의 계수가 양수가 되도록 정리합니다.',
        'To reflect a line, substitute the reflected coordinates for x and y, then rearrange so the x-coefficient is positive.',
        '对称变换直线时，把x、y换成对称点的坐标，再整理使x的系数为正。')),
      `${lineTex(A, B, C)}${arrow(k)}${lead(nA, 'x')}+\\square y+\\square=0`, [nB, nC], [
        { tex:raw },
        { tex:`${lead(nA, 'x')}+\\square y+\\square=0`, blank:[nB, nC] }]);
  }

  if (mode === 'circle') {
    const p = nzInt(rng, 1, 6), q = nzInt(rng, 1, 6), r = R(rng, 1, 6), Rr = r * r;
    const k = pick(rng, ['x', 'y', 'o', 'd', 'e']);
    const [p2, q2] = MIRROR[k].f(p, q);
    if (pick(rng, [0, 1])) {
      /* 일반형 계수 */
      const F = p * p + q * q - Rr;
      return item(
        withNote(L3('원을 대칭이동하면 반지름은 그대로이고 중심만 대칭이동합니다. 옮긴 원의 방정식에서 x, y 의 계수를 구합니다.',
          'Reflecting a circle keeps its radius; only the center is reflected. Find the coefficients of x and y in the reflected circle’s equation.',
          '对称变换圆时半径不变，只有圆心对称移动。求变换后圆的方程中x、y的系数。')),
        `${genCirc(p, q, Rr)}${arrow(k)}x^2+y^2+\\square x+\\square y${more(F, '')}=0`, [-2 * p2, -2 * q2], [
          { tex:`(${p},${q})\\ \\to\\ (${p2},${q2})` },
          { tex:circ(p2, q2, Rr) },
          { tex:`x^2+y^2+\\square x+\\square y${more(F, '')}=0`, blank:[-2 * p2, -2 * q2] }]);
    }
    let k2 = null, p3 = p2, q3 = q2;
    if (pick(rng, [0, 1])) {
      k2 = pick(rng, ['x', 'y', 'o', 'd', 'e'].filter(z => z !== k));
      [p3, q3] = MIRROR[k2].f(p2, q2);
    }
    const src = pick(rng, [0, 1]) ? circ(p, q, Rr) : genCirc(p, q, Rr);
    const steps = [{ tex:`(${p},${q})\\ \\to\\ (${p2},${q2})` }];
    if (k2) steps.push({ tex:`(${p2},${q2})\\ \\to\\ (${p3},${q3})` });
    steps.push({ tex:`(\\square,\\ \\square)`, blank:[p3, q3] });
    return item(
      withNote(L3('원을 대칭이동하면 반지름은 그대로이고 중심만 대칭이동합니다. 옮긴 원의 중심의 좌표를 구합니다(화살표가 둘이면 차례로 옮깁니다).',
        'Reflecting a circle keeps its radius; only the center is reflected. Find the center of the image (with two arrows, reflect in order).',
        '对称变换圆时半径不变，只有圆心对称移动。求变换后圆的圆心坐标(有两个箭头时依次变换)。')),
      `${src}${arrow(k)}${k2 ? `\\cdots${arrow(k2)}` : ''}(\\square,\\ \\square)`, [p3, q3], steps);
  }

  /* point(기본) */
  let x = nzInt(rng, 1, 9), y = nzInt(rng, 1, 9);
  if (x === y) y = y === 9 ? -9 : y + 1;
  const k = pick(rng, ['x', 'y', 'o', 'd']);
  const [x2, y2] = MIRROR[k].f(x, y);
  if (pick(rng, [0, 0, 1])) {
    const k2 = pick(rng, ['x', 'y', 'o', 'd', 'e'].filter(z => z !== k));
    const [x3, y3] = MIRROR[k2].f(x2, y2);
    return item(
      withNote(L3('점을 차례로 두 번 대칭이동합니다. 첫 번째로 옮긴 점을 다시 옮깁니다.',
        'Reflect the point twice, in order: reflect the first image again.',
        '把点依次对称变换两次：把第一次得到的点再变换。')),
      `P${pt(x, y)}${arrow(k)}\\cdots${arrow(k2)}(\\square,\\ \\square)`, [x3, y3], [
        { tex:`${pt(x, y)}\\ \\to\\ ${pt(x2, y2)}` },
        { tex:`${pt(x2, y2)}\\ \\to\\ (\\square,\\ \\square)`, blank:[x3, y3] }]);
  }
  return item(
    withNote(L3('x축 대칭은 y 좌표의 부호를, y축 대칭은 x 좌표의 부호를, 원점 대칭은 둘 다 바꿉니다. 직선 y=x 대칭은 x, y 좌표를 서로 바꿉니다.',
      'Reflection in the x-axis flips the sign of y, in the y-axis the sign of x, and in the origin both; reflection in y=x swaps x and y.',
      '关于x轴对称改变y坐标的符号，关于y轴对称改变x坐标的符号，关于原点对称两个都改变；关于直线y=x对称则交换x、y坐标。')),
    `P${pt(x, y)}${arrow(k)}(\\square,\\ \\square)`, [x2, y2], [
      { tex:`(\\square,\\ \\square)`, blank:[x2, y2] }]);
};

/* ── MD122 — 원소의 개수·부분집합의 개수 (문장제) ── */
function setTxt(S){ return `{${S.join(', ')}}`; }
function divisors(N){ const d = []; for (let i = 1; i <= N; i++) if (N % i === 0) d.push(i); return d; }
function isPrime(n){ if (n < 2) return false; for (let i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; }
/* 집합 A 를 하나 만든다 — 원소를 나열하거나 간단한 조건으로 정의한다 */
function makeSet(rng, lo, hi){
  for (let g = 0; g < 200; g++) {
    const kind = pick(rng, ['list', 'list', 'div', 'mult', 'range']);
    if (kind === 'list') {
      const n = R(rng, lo, hi);
      const pool = pick(rng, [0, 1]) ? ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'] : [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
      const S = shuffle(rng, pool).slice(0, n);
      if (typeof S[0] === 'number') S.sort((p, q) => p - q); else S.sort();
      const t = `A = ${setTxt(S)}`;
      return { n, txt:L3(t, t, t), els:S };
    }
    if (kind === 'div') {
      const N = pick(rng, [4, 6, 8, 9, 10, 12, 14, 15, 16, 18, 20, 21, 22, 25, 27, 28, 30, 32, 44, 45, 50, 52, 63, 64, 75, 81, 98]);
      const d = divisors(N);
      if (d.length < lo || d.length > hi) continue;
      return { n:d.length, els:d, txt:L3(`A = {x | x는 ${N}의 약수}`, `A = {x | x is a divisor of ${N}}`, `A = {x | x是${N}的约数}`) };
    }
    if (kind === 'mult') {
      const k = R(rng, 2, 9), n = R(rng, lo, hi), N = k * n + R(rng, 0, k - 1);
      const els = []; for (let i = k; i <= N; i += k) els.push(i);
      return { n, els, txt:L3(`A = {x | x는 ${N} 이하의 ${k}의 배수인 자연수}`, `A = {x | x is a natural number at most ${N} that is a multiple of ${k}}`, `A = {x | x是不大于${N}且是${k}的倍数的自然数}`) };
    }
    const a = R(rng, -4, 6), n = R(rng, lo, hi);
    const els = []; for (let i = a; i < a + n; i++) els.push(i);
    return { n, els, txt:L3(`A = {x | ${u(a)} ≤ x < ${u(a + n)}, x는 정수}`, `A = {x | ${u(a)} ≤ x < ${u(a + n)}, x is an integer}`, `A = {x | ${u(a)} ≤ x < ${u(a + n)}，x是整数}`) };
  }
  const t = 'A = {1, 2, 3}';
  return { n:3, els:[1, 2, 3], txt:L3(t, t, t) };
}
NM_TGEN['md122_setCount'] = function (params, rng) {
  const mode = params.mode || 'nA';
  const ASK_N = L3('n(A) 를 구합니다.', 'Find n(A).', '求n(A)。');

  if (mode === 'subsets') {
    const A = makeSet(rng, 2, 7);
    const proper = pick(rng, [0, 1]);
    const ans = Math.pow(2, A.n) - (proper ? 1 : 0);
    return word(
      L3(`집합 ${A.txt.ko} 가 있습니다.`, `Let ${A.txt.en}.`, `设集合${A.txt.zh}。`),
      proper ? L3('A 의 진부분집합(A 자신을 뺀 부분집합)의 개수를 구합니다.', 'Find the number of proper subsets of A (subsets other than A itself).', '求A的真子集(除A本身以外的子集)的个数。')
        : L3('A 의 부분집합의 개수를 구합니다.', 'Find the number of subsets of A.', '求A的子集的个数。'),
      `\\square`, ans, [
        { tex:`n(A)=${A.n}` },
        { tex:`2^{${A.n}}${proper ? '-1' : ''}=\\square`, blank:ans }]);
  }

  if (mode === 'special') {
    const n = R(rng, 4, 8);
    const start = pick(rng, [1, 1, 2, 0]);
    const S = []; for (let i = 0; i < n; i++) S.push(start + i);
    const txt = `A = ${setTxt(S)}`;
    const story = L3(`집합 ${txt} 가 있습니다.`, `Let ${txt}.`, `设集合${txt}。`);
    const kind = pick(rng, ['inc', 'inc', 'even', 'odd']);
    if (kind === 'inc') {
      const sh = shuffle(rng, S);
      const i = R(rng, 1, 2), j = R(rng, 0, Math.min(2, n - i - 1));
      const inc = sh.slice(0, i).sort((p, q) => p - q), exc = sh.slice(i, i + j).sort((p, q) => p - q);
      const e = n - i - j, ans = Math.pow(2, e);
      const ask = j
        ? L3(`A 의 부분집합 가운데 ${setTxt(inc)} 의 원소는 모두 포함하고 ${setTxt(exc)} 의 원소는 하나도 포함하지 않는 것의 개수를 구합니다.`,
             `Among the subsets of A, how many contain every element of ${setTxt(inc)} and no element of ${setTxt(exc)}?`,
             `A的子集中，包含${setTxt(inc)}的全部元素且不含${setTxt(exc)}的任何元素的有多少个？`)
        : L3(`A 의 부분집합 가운데 ${setTxt(inc)} 의 원소를 모두 포함하는 것의 개수를 구합니다.`,
             `Among the subsets of A, how many contain every element of ${setTxt(inc)}?`,
             `A的子集中，包含${setTxt(inc)}的全部元素的有多少个？`);
      return word(story, ask, `\\square`, ans, [
        { tex:`${n}-${i}${j ? `-${j}` : ''}=${e}` },
        { tex:`2^{${e}}=\\square`, blank:ans }]);
    }
    const even = kind === 'even';
    const others = S.filter(v => (v % 2 === 0) !== even).length;
    const ans = Math.pow(2, n) - Math.pow(2, others);
    return word(story,
      even ? L3('A 의 부분집합 가운데 짝수를 적어도 하나 원소로 갖는 것의 개수를 구합니다.', 'Among the subsets of A, how many contain at least one even number?', 'A的子集中，至少含有一个偶数的有多少个？')
        : L3('A 의 부분집합 가운데 홀수를 적어도 하나 원소로 갖는 것의 개수를 구합니다.', 'Among the subsets of A, how many contain at least one odd number?', 'A的子集中，至少含有一个奇数的有多少个？'),
      `\\square`, ans, [
        { tex:`2^{${n}}-2^{${others}}` },
        { tex:`${Math.pow(2, n)}-${Math.pow(2, others)}=\\square`, blank:ans }]);
  }

  /* nA(기본) */
  const kind = pick(rng, ['mult', 'div', 'range', 'odd', 'sq', 'prime', 'step']);
  let txt, els;
  if (kind === 'mult') {
    const k = R(rng, 2, 9), N = R(rng, 2 * k, Math.max(2 * k + 5, 60));
    els = []; for (let i = k; i <= N; i += k) els.push(i);
    txt = L3(`A = {x | x는 ${N} 이하의 ${k}의 배수인 자연수}`, `A = {x | x is a natural number at most ${N} that is a multiple of ${k}}`, `A = {x | x是不大于${N}且是${k}的倍数的自然数}`);
  } else if (kind === 'div') {
    const N = R(rng, 6, 100);
    els = divisors(N);
    txt = L3(`A = {x | x는 ${N}의 약수}`, `A = {x | x is a divisor of ${N}}`, `A = {x | x是${N}的约数}`);
  } else if (kind === 'range') {
    const a = R(rng, -5, 5), b = a + R(rng, 2, 12);
    const rel = pick(rng, [['≤', '<'], ['<', '≤'], ['≤', '≤'], ['<', '<']]);
    els = []; for (let i = a; i <= b; i++) {
      if ((rel[0] === '<' && i === a) || (rel[1] === '<' && i === b)) continue;
      els.push(i);
    }
    const c = `${u(a)} ${rel[0]} x ${rel[1]} ${u(b)}`;
    txt = L3(`A = {x | ${c}, x는 정수}`, `A = {x | ${c}, x is an integer}`, `A = {x | ${c}，x是整数}`);
  } else if (kind === 'odd') {
    const N = R(rng, 5, 40), ev = pick(rng, [0, 1]);
    els = []; for (let i = 1; i <= N; i++) if (i % 2 === (ev ? 0 : 1)) els.push(i);
    txt = ev ? L3(`A = {x | x는 ${N} 이하의 짝수인 자연수}`, `A = {x | x is an even natural number at most ${N}}`, `A = {x | x是不大于${N}的偶数}`)
      : L3(`A = {x | x는 ${N} 이하의 홀수인 자연수}`, `A = {x | x is an odd natural number at most ${N}}`, `A = {x | x是不大于${N}的奇数}`);
  } else if (kind === 'sq') {
    const N = R(rng, 5, 90);
    els = []; for (let i = 1; i * i < N; i++) els.push(i);
    txt = L3(`A = {x | x² < ${N}, x는 자연수}`, `A = {x | x² < ${N}, x is a natural number}`, `A = {x | x² < ${N}，x是自然数}`);
  } else if (kind === 'prime') {
    const N = R(rng, 10, 50);
    els = []; for (let i = 2; i <= N; i++) if (isPrime(i)) els.push(i);
    txt = L3(`A = {x | x는 ${N} 이하의 소수}`, `A = {x | x is a prime number at most ${N}}`, `A = {x | x是不大于${N}的质数}`);
  } else {
    const s = R(rng, 2, 5), n = R(rng, 4, 12), st = pick(rng, [0, s, 1]);
    els = []; for (let i = 0; i < n; i++) els.push(st + s * i);
    const t = `A = {${els[0]}, ${els[1]}, ${els[2]}, …, ${els[n - 1]}}`;
    txt = L3(`${t} (${s}씩 커지는 수)`, `${t} (increasing by ${s})`, `${t}(每次增加${s})`);
  }
  const ans = els.length;
  const shown = ans <= 8 ? els.join(', ') : `${els.slice(0, 3).join(', ')}, \\cdots, ${els[ans - 1]}`;
  return word(
    L3(`집합 ${txt.ko} 가 있습니다.`, `Let ${txt.en}.`, `设集合${txt.zh}。`), ASK_N,
    `\\square`, ans, [
      { tex:`A=\\{${shown}\\}` },
      { tex:`n(A)=\\square`, blank:ans }]);
};

/* ── MD123 — 집합의 연산 ── */
function setTex(S){ return S.length ? `\\{${S.join(',')}\\}` : '\\varnothing'; }
function randSet(rng, N, lo, hi){
  const pool = []; for (let i = 1; i <= N; i++) pool.push(i);
  return shuffle(rng, pool).slice(0, R(rng, lo, hi)).sort((p, q) => p - q);
}
const has = (S, v) => S.indexOf(v) >= 0;
function uTex(N){ return `U=\\{1,2,3,\\cdots,${N}\\}`; }
NM_TGEN['md123_setOps'] = function (params, rng) {
  const mode = params.mode || 'basic';

  if (mode === 'diff' || mode === 'laws') {
    const three = mode === 'laws';
    const N = three ? R(rng, 8, 10) : R(rng, 8, 12);
    const U = []; for (let i = 1; i <= N; i++) U.push(i);
    const A = randSet(rng, N, 3, three ? 5 : 6), B = randSet(rng, N, 3, three ? 5 : 6), C = randSet(rng, N, 3, 5);
    const KINDS = three
      ? [['A\\cap(B\\cup C)', v => has(A, v) && (has(B, v) || has(C, v)), 1],
         ['(A\\cup B)\\cap C', v => (has(A, v) || has(B, v)) && has(C, v), 1],
         ['A-(B\\cup C)', v => has(A, v) && !has(B, v) && !has(C, v), 1],
         ['(A\\cap B)\\cup C', v => (has(A, v) && has(B, v)) || has(C, v), 1],
         ['A^{C}\\cap B^{C}', v => !has(A, v) && !has(B, v), 0],
         ['A^{C}\\cup B^{C}', v => !has(A, v) || !has(B, v), 0],
         ['(A-B)\\cup(B-A)', v => has(A, v) !== has(B, v), 0]]
      : [['A-B', v => has(A, v) && !has(B, v), 0],
         ['B-A', v => has(B, v) && !has(A, v), 0],
         ['A^{C}', v => !has(A, v), 0],
         ['B^{C}', v => !has(B, v), 0],
         ['(A\\cup B)^{C}', v => !has(A, v) && !has(B, v), 0],
         ['A\\cap B^{C}', v => has(A, v) && !has(B, v), 0]];
    const [ex, f, useC] = pick(rng, KINDS);
    const res = U.filter(f), ans = res.length;
    const sets = `A=${setTex(A)},\\ B=${setTex(B)}${useC ? `,\\ C=${setTex(C)}` : ''}`;
    return item(
      three
        ? L3('연산 법칙(분배법칙·드모르간의 법칙)으로 식을 간단히 하거나, 괄호 안부터 차례로 원소를 나열해 개수를 셉니다.',
             'Simplify with the laws of set operations (distributive, De Morgan) or list the elements step by step from the inside out, then count.',
             '用运算律(分配律、德摩根律)化简，或从括号内开始依次列出元素，再数个数。')
        : L3('A−B 는 A 에는 있고 B 에는 없는 원소, A^C 는 전체집합 U 에서 A 의 원소를 뺀 것입니다. 원소를 나열해 개수를 셉니다.',
             'A−B has the elements of A that are not in B; A^C is U with the elements of A removed. List the elements and count.',
             'A−B是属于A但不属于B的元素，A^C是从全集U中去掉A的元素。列出元素后数个数。'),
      `\\begin{array}{l} ${uTex(N)} \\\\ ${sets} \\\\ n(${ex})=\\square \\end{array}`, ans, [
        { tex:`${ex}=${setTex(res)}` },
        { tex:`n(${ex})=\\square`, blank:ans }]);
  }

  /* basic(기본) — 합집합·교집합 */
  const N = 12;
  const A = randSet(rng, N, 3, 6), B = randSet(rng, N, 3, 6);
  const union = pick(rng, [0, 1]);
  const res = [];
  for (let v = 1; v <= N; v++) if (union ? (has(A, v) || has(B, v)) : (has(A, v) && has(B, v))) res.push(v);
  const ex = union ? 'A\\cup B' : 'A\\cap B';
  return item(
    L3('A∪B 는 A 또는 B 에 속하는 원소, A∩B 는 A 와 B 에 모두 속하는 원소의 모임입니다. 원소를 나열해 개수를 셉니다.',
       'A∪B collects the elements in A or B; A∩B collects those in both. List the elements and count.',
       'A∪B是属于A或B的元素，A∩B是同时属于A和B的元素。列出元素后数个数。'),
    `A=${setTex(A)},\\ B=${setTex(B)} \\;\\Rightarrow\\; n(${ex})=\\square`, res.length, [
      { tex:`${ex}=${setTex(res)}` },
      { tex:`n(${ex})=\\square`, blank:res.length }]);
};

/* ── MD124 — 유한집합의 원소의 개수 ──
   벤 다이어그램의 각 영역 개수를 먼저 정하고, 주어지는 값을 거기서 계산한다. */
NM_TGEN['md124_setSize'] = function (params, rng) {
  const mode = params.mode || 'union';

  if (mode === 'three') {
    const [a, b, c] = [R(rng, 1, 12), R(rng, 1, 12), R(rng, 1, 12)];
    const [ab, bc, ca] = [R(rng, 0, 6), R(rng, 0, 6), R(rng, 0, 6)];
    const t = R(rng, 1, 5);
    const nA = a + ab + ca + t, nB = b + ab + bc + t, nC = c + bc + ca + t;
    const nAB = ab + t, nBC = bc + t, nCA = ca + t;
    const un = a + b + c + ab + bc + ca + t;
    const kind = pick(rng, ['union', 'union', 'triple']);
    const l1 = `n(A)=${nA},\\ n(B)=${nB},\\ n(C)=${nC}`;
    const l2 = `n(A\\cap B)=${nAB},\\ n(B\\cap C)=${nBC},\\ n(C\\cap A)=${nCA}`;
    const rule = L3('n(A∪B∪C)=n(A)+n(B)+n(C)−n(A∩B)−n(B∩C)−n(C∩A)+n(A∩B∩C) 입니다.',
      'n(A∪B∪C)=n(A)+n(B)+n(C)−n(A∩B)−n(B∩C)−n(C∩A)+n(A∩B∩C).',
      'n(A∪B∪C)=n(A)+n(B)+n(C)−n(A∩B)−n(B∩C)−n(C∩A)+n(A∩B∩C)。');
    const sumTex = `${nA}+${nB}+${nC}-${nAB}-${nBC}-${nCA}`;
    if (kind === 'triple') {
      return item(rule,
        `\\begin{array}{l} ${l1} \\\\ ${l2} \\\\ n(A\\cup B\\cup C)=${un} \\;\\Rightarrow\\; n(A\\cap B\\cap C)=\\square \\end{array}`, t, [
          { tex:`${un}=${sumTex}+n(A\\cap B\\cap C)` },
          { tex:`n(A\\cap B\\cap C)=\\square`, blank:t }]);
    }
    return item(rule,
      `\\begin{array}{l} ${l1} \\\\ ${l2} \\\\ n(A\\cap B\\cap C)=${t} \\;\\Rightarrow\\; n(A\\cup B\\cup C)=\\square \\end{array}`, un, [
        { tex:`${sumTex}+${t}` },
        { tex:`n(A\\cup B\\cup C)=\\square`, blank:un }]);
  }

  if (mode === 'bound') {
    const Un = R(rng, 15, 50);
    let a = R(rng, 5, Un - 1), b = R(rng, 5, Un - 1);
    const inter = pick(rng, [1, 1, 0]);
    if (inter) {
      const M = Math.min(a, b), m = Math.max(0, a + b - Un);
      const small = a <= b ? 'A' : 'B';
      return item(
        L3('n(A∩B) 의 최댓값을 M, 최솟값을 m 이라 합니다. 교집합은 작은 집합보다 클 수 없고, n(A∩B)=n(A)+n(B)−n(A∪B) 에서 n(A∪B)≤n(U) 입니다.',
           'Let M and m be the greatest and least possible values of n(A∩B). The intersection cannot exceed the smaller set, and n(A∩B)=n(A)+n(B)−n(A∪B) with n(A∪B)≤n(U).',
           '设n(A∩B)的最大值为M，最小值为m。交集不能超过较小的集合，且n(A∩B)=n(A)+n(B)−n(A∪B)，n(A∪B)≤n(U)。'),
        `n(U)=${Un},\\ n(A)=${a},\\ n(B)=${b} \\;\\Rightarrow\\; n(A\\cap B):\\ M=\\square,\\ m=\\square`, [M, m], [
          { tex:`n(A\\cap B)\\le n(${small})=${M}` },
          { tex: a + b - Un > 0 ? `n(A\\cap B)\\ge ${a}+${b}-${Un}=${m}` : `${a}+${b}-${Un}\\le 0\\ \\Rightarrow\\ n(A\\cap B)\\ge 0` },
          { tex:`M=\\square,\\ m=\\square`, blank:[M, m] }]);
    }
    const M = Math.min(Un, a + b), m = Math.max(a, b);
    const big = a >= b ? 'A' : 'B';
    return item(
      L3('n(A∪B) 의 최댓값을 M, 최솟값을 m 이라 합니다. 합집합은 큰 집합보다 작을 수 없고, n(A∪B)≤n(A)+n(B), n(A∪B)≤n(U) 입니다.',
         'Let M and m be the greatest and least possible values of n(A∪B). The union is at least the larger set, and n(A∪B)≤n(A)+n(B), n(A∪B)≤n(U).',
         '设n(A∪B)的最大值为M，最小值为m。并集不小于较大的集合，且n(A∪B)≤n(A)+n(B)，n(A∪B)≤n(U)。'),
      `n(U)=${Un},\\ n(A)=${a},\\ n(B)=${b} \\;\\Rightarrow\\; n(A\\cup B):\\ M=\\square,\\ m=\\square`, [M, m], [
        { tex:`n(A\\cup B)\\ge n(${big})=${m}` },
        { tex: a + b <= Un ? `n(A\\cup B)\\le ${a}+${b}=${M}` : `n(A\\cup B)\\le n(U)=${M}` },
        { tex:`M=\\square,\\ m=\\square`, blank:[M, m] }]);
  }

  /* union(기본) — 두 집합 */
  const x = R(rng, 1, 20), y = R(rng, 1, 20), z = R(rng, 1, 12), w = R(rng, 1, 15);
  const nA = x + z, nB = y + z, nU = x + y + z, all = nU + w;
  const kind = pick(rng, ['union', 'inter', 'nB', 'comp', 'diff']);
  const rule = L3('n(A∪B)=n(A)+n(B)−n(A∩B) 입니다. 여집합은 n(A^C)=n(U)−n(A), 차집합은 n(A−B)=n(A)−n(A∩B) 입니다.',
    'n(A∪B)=n(A)+n(B)−n(A∩B). For complements n(A^C)=n(U)−n(A), and for differences n(A−B)=n(A)−n(A∩B).',
    'n(A∪B)=n(A)+n(B)−n(A∩B)。补集n(A^C)=n(U)−n(A)，差集n(A−B)=n(A)−n(A∩B)。');
  if (kind === 'inter') {
    return item(rule, `n(A)=${nA},\\ n(B)=${nB},\\ n(A\\cup B)=${nU} \\;\\Rightarrow\\; n(A\\cap B)=\\square`, z, [
      { tex:`n(A\\cap B)=${nA}+${nB}-${nU}` },
      { tex:`n(A\\cap B)=\\square`, blank:z }]);
  }
  if (kind === 'nB') {
    return item(rule, `n(A)=${nA},\\ n(A\\cup B)=${nU},\\ n(A\\cap B)=${z} \\;\\Rightarrow\\; n(B)=\\square`, nB, [
      { tex:`${nU}=${nA}+n(B)-${z}` },
      { tex:`n(B)=\\square`, blank:nB }]);
  }
  if (kind === 'comp') {
    return item(rule, `n(U)=${all},\\ n(A)=${nA},\\ n(B)=${nB},\\ n(A\\cap B)=${z} \\;\\Rightarrow\\; n(A^{C}\\cap B^{C})=\\square`, w, [
      { tex:`A^{C}\\cap B^{C}=(A\\cup B)^{C}` },
      { tex:`n(A\\cup B)=${nA}+${nB}-${z}=${nU}` },
      { tex:`${all}-${nU}=\\square`, blank:w }]);
  }
  if (kind === 'diff') {
    return item(rule, `n(A)=${nA},\\ n(B)=${nB},\\ n(A\\cup B)=${nU} \\;\\Rightarrow\\; n(A-B)=\\square`, x, [
      { tex:`n(A\\cap B)=${nA}+${nB}-${nU}=${z}` },
      { tex:`n(A-B)=${nA}-${z}=\\square`, blank:x }]);
  }
  return item(rule, `n(A)=${nA},\\ n(B)=${nB},\\ n(A\\cap B)=${z} \\;\\Rightarrow\\; n(A\\cup B)=\\square`, nU, [
    { tex:`${nA}+${nB}-${z}` },
    { tex:`n(A\\cup B)=\\square`, blank:nU }]);
};

if (typeof module !== 'undefined' && module.exports) module.exports = NM_TGEN;
})();
