/* ============================================================
   Numbers of Magic — MD63~67(중등 교과 연산 3차) 스레드 생성기.
   근거: 원장 지시(2026-09-20) — "난 교과연산과 창의연산이 같이 되어야
   한다. 교과 연산 후 문장제·창의연산 혼합 컨셉이었는데."
   점검해 보니 창의 연산 쪽은 촘촘한데 **중등 교과 연산의 기둥 다섯 개가
   아예 없었다**: 연립방정식·일차부등식·일차함수(중2), 이차방정식 풀이·
   이차함수 꼭짓점(중3). 있던 것은 일차방정식(MD50) 하나와 이차방정식의
   '판별식'(MD26)뿐이라, 중2 과정 33은 유형이 둘(MD13·MD14)밖에 없었다.
   중등 구간이 8개월로 짧았던 것은 압축이 아니라 **없어서**였다.

   만드는 형태는 원장이 좋다고 한 그대로다("정수의 계산 유리수의 계산
   곱셈공식 학습지 좋잖아") — 과정마다 3~5개 스레드, 레벨 1~3, 전용
   생성기, 회차마다 4~8번 반복 + 초등 드릴 1개 유지.

   engine/threads/mid8.js(MD47~62)에 이어지는 번호. 계약:
   NM_TGEN[genKey] = function(params, rng) { ... }, Math.random() 금지.

   답 환원 원칙(MASTER-ROADMAP §7) — 이 파일에서 지키는 역산 요령:
   - MD63(연립방정식): 해 (x,y)를 **먼저** 고르고 좌변 계수를 뽑은 뒤
     우변 상수를 e=ax+by로 계산한다. 소거·대입 어느 쪽으로 풀어도
     나눗셈이 딱 떨어진다(가감법의 배수도 계수를 서로소로 잡아 정수).
   - MD64(일차부등식): 경계값 x₀를 먼저 고르고 c=a·x₀+b로 역산 —
     경계가 항상 정수라 "만족하는 가장 큰 정수"도 정수.
     부등호 방향은 생성기가 계산해 tex에 그대로 실어 보여 준다
     (MD29 이차부등식과 같은 규약 — 입력은 숫자 칸뿐이므로).
   - MD65(일차함수): 기울기 m과 y절편 b를 먼저 고르고 두 점을
     y=mx+b 위에서 뽑는다 — (y₂-y₁)/(x₂-x₁)이 항상 m으로 떨어진다.
   - MD66(이차방정식): 두 근 p,q를 먼저 고른다. 완전제곱형은 b를
     짝수로 잡아 b/2가 정수, 계수형은 a(x-p)(x-q)로 전개한다.
   - MD67(이차함수 꼭짓점): y=a(x-p)²+q를 전개해 문제로 내보낸다 —
     꼭짓점이 처음부터 정수이므로 -b/2a를 구할 때 나눗셈이 떨어진다.

   표기 주의(2026-09-20): 이 파일의 tex 는 KaTeX 간격 명령 대신 `\quad`
   만 쓴다. `\;`(백슬래시+세미콜론)는 편집 경로에서 조용히 한 겹씩
   먹히거나 늘어나 JS 문장 끝의 세미콜론까지 함께 망가뜨린 적이 있어,
   아예 쓰지 않는 쪽이 안전하다. 보이는 결과는 같다(둘 다 가로 공백).
   ============================================================ */
(function(){
'use strict';

const { R, pick } = NM_RNG;

/* ── 공용 헬퍼(mid4~8과 동일 계열, 파일별 독립 정의 관례) ── */
function nzInt(rng, lo, hi){ return R(rng, lo, hi) * pick(rng, [1, -1]); }
function wrapPlus(n){ return n < 0 ? `- ${Math.abs(n)}` : `+ ${n}`; }
function coefLead(n){ return n===1?'':n===-1?'-':String(n); }
function wrapPlusCoef(n){ return n===1?'+ ':n===-1?'- ':(n<0?`- ${Math.abs(n)}`:`+ ${n}`); }
function hasNeg(v){ return Array.isArray(v) ? v.some(x => x < 0) : v < 0; }
function gcd(a, b){ a = Math.abs(a); b = Math.abs(b); while (b) { const t = b; b = a % b; a = t; } return a || 1; }

/* 두 일차식을 "ax + by = e" 꼴로 — 계수 ±1을 감추고 부호를 정리한다 */
function linTwoVar(a, b, e){
  return `${coefLead(a)}x ${wrapPlusCoef(b)}y = ${e}`;
}

/* ============================================================
   A. 중2 — 연립방정식·일차부등식·일차함수 (tier:middle2, W9)
   ============================================================ */

/* ── MD63 — 연립방정식 풀이 ──
   해 (x,y)를 먼저 고르고 상수항을 역산하므로 해는 언제나 정수.
   mode: 'substitution'(대입법 — 한 식이 y=… 꼴로 이미 풀려 있다) ·
   'elimination'(가감법 — 한 문자의 계수를 맞춰 더하거나 뺀다) ·
   'mixed'(실전, 계수 범위가 넓고 두 방법 중 편한 쪽을 고른다).
   답은 [x, y] 2칸. */
NM_TGEN['md63_simultaneous'] = function (params, rng) {
  const mode = params.mode || 'substitution';
  const lim = params.wide ? 9 : 6;

  if (mode === 'substitution') {
    /* y = mx + n 과 ax + by = e — 대입하면 x에 대한 일차방정식.
       n(상수항)이 0이면 식에 `+ 0`이 찍히므로 그때는 1로 밀어 두고
       해 y를 그 식에서 다시 읽는다(yy). */
    const x = nzInt(rng, 1, lim);
    const m = nzInt(rng, 1, 3);
    let n = nzInt(rng, 1, lim);
    if (n === 0) n = 1;
    const yy = m * x + n;
    let a = nzInt(rng, 1, 4);
    const b = nzInt(rng, 1, 4);
    let guard = 0;
    while (a + b * m === 0 && guard++ < 30) a = nzInt(rng, 1, 4);   /* 대입 후 x가 사라지면 안 된다 */
    if (a + b * m === 0) a = a + 1;
    const e = a * x + b * yy;
    return {
      prompt: { ko: `이미 y=…로 풀려 있는 식을 다른 식의 y 자리에 그대로 넣어요(대입법) — x를 먼저 구하고, 그 x를 다시 넣어 y를 구해요`,
        en: `One equation is already solved for y — substitute it into the other (substitution method): find x first, then put x back to get y`,
        zh: `已经解出y的式子直接代入另一个式子(代入法)——先求x，再把x代回求y` },
      tex: `\\begin{cases} y = ${coefLead(m)}x ${wrapPlus(n)} \\\\ ${linTwoVar(a, b, e)} \\end{cases} \\quad\\Rightarrow\\quad x = \\square,\\quad y = \\square`,
      answer: [x, yy], answerType: 'number', widget: 'numpad', negative: hasNeg([x, yy]),
      solution: [
        { tex: `${coefLead(a)}x ${wrapPlusCoef(b)}(${coefLead(m)}x ${wrapPlus(n)}) = ${e}` },
        { tex: `${coefLead(a + b * m)}x = \\square`, blank: e - b * n },
        { tex: `x = \\square`, blank: x },
        { tex: `y = ${coefLead(m)}(${x}) ${wrapPlus(n)} = \\square`, blank: yy },
        { tex: `(x,\\, y) = \\left(\\square,\\, \\square\\right)`, blank: [x, yy] }
      ]
    };
  }

  if (mode === 'elimination') {
    /* y의 계수를 b1·b2 로 잡고 서로 곱해 맞춘다 — 소거 후 x의 계수가
       (a1·b2 - a2·b1)/gcd 가 되고, 우변도 같은 조합이라 항상 정수. */
    const x = nzInt(rng, 1, lim), y = nzInt(rng, 1, lim);
    const a1 = nzInt(rng, 1, 4), b1 = nzInt(rng, 1, 3);
    let a2 = nzInt(rng, 1, 4), b2 = nzInt(rng, 1, 3);
    let guard = 0;
    while (a1 * b2 - a2 * b1 === 0 && guard++ < 30) { a2 = nzInt(rng, 1, 4); b2 = nzInt(rng, 1, 3); }
    if (a1 * b2 - a2 * b1 === 0) { a2 = a1 + 1; b2 = b1; }   /* 최후 보정: 해가 하나로 정해지게 */
    const e1 = a1 * x + b1 * y, e2 = a2 * x + b2 * y;
    const g = gcd(b1, b2);
    const k1 = b2 / g, k2 = b1 / g;                          /* y를 없애는 배수 */
    const A = a1 * k1 - a2 * k2, E = e1 * k1 - e2 * k2;
    return {
      prompt: { ko: `한 문자의 계수를 같게 만든 뒤 두 식을 빼면 그 문자가 사라져요(가감법)`,
        en: `Make one letter's coefficients match, then subtract the equations to eliminate it (elimination method)`,
        zh: `把一个字母的系数变成相同，再把两式相减消去它(加减法)` },
      tex: `\\begin{cases} ${linTwoVar(a1, b1, e1)} \\\\ ${linTwoVar(a2, b2, e2)} \\end{cases} \\quad\\Rightarrow\\quad x = \\square,\\quad y = \\square`,
      answer: [x, y], answerType: 'number', widget: 'numpad', negative: hasNeg([x, y]),
      solution: [
        { tex: `${k1} \\times (\\text{①}) - ${k2} \\times (\\text{②}) : ${coefLead(A)}x = ${E}` },
        { tex: `x = \\square`, blank: x },
        { tex: `${coefLead(b1)}y = ${e1} - ${a1}\\times(${x}) = \\square`, blank: e1 - a1 * x },
        { tex: `y = \\square`, blank: y },
        { tex: `(x,\\, y) = \\left(\\square,\\, \\square\\right)`, blank: [x, y] }
      ]
    };
  }

  /* mixed(실전) — 두 식 모두 ax+by=e 꼴, 계수 범위가 넓다 */
  const x = nzInt(rng, 1, params.wide ? 12 : 8), y = nzInt(rng, 1, params.wide ? 12 : 8);
  const a1 = nzInt(rng, 1, 5), b1 = nzInt(rng, 1, 5);
  let a2 = nzInt(rng, 1, 5), b2 = nzInt(rng, 1, 5);
  let g2 = 0;
  while (a1 * b2 - a2 * b1 === 0 && g2++ < 30) { a2 = nzInt(rng, 1, 5); b2 = nzInt(rng, 1, 5); }
  if (a1 * b2 - a2 * b1 === 0) { a2 = a1 + 1; b2 = b1; }
  const e1 = a1 * x + b1 * y, e2 = a2 * x + b2 * y;
  const D = a1 * b2 - a2 * b1;
  return {
    prompt: { ko: `계수를 보고 대입법과 가감법 중 편한 쪽을 골라요 — 한 문자를 없애는 게 목표예요`,
      en: `Look at the coefficients and pick whichever is easier, substitution or elimination — the goal is to eliminate one letter`,
      zh: `看系数选择代入法或加减法中较方便的一种——目标是消去一个字母` },
    tex: `\\begin{cases} ${linTwoVar(a1, b1, e1)} \\\\ ${linTwoVar(a2, b2, e2)} \\end{cases} \\quad\\Rightarrow\\quad x = \\square,\\quad y = \\square`,
    answer: [x, y], answerType: 'number', widget: 'numpad', negative: hasNeg([x, y]),
    solution: [
      { tex: `${b2} \\times (\\text{①}) - ${b1} \\times (\\text{②}) : ${coefLead(D)}x = ${e1 * b2 - e2 * b1}` },
      { tex: `x = \\square`, blank: x },
      { tex: `${a1} \\times (\\text{②}) - ${a2} \\times (\\text{①}) : ${coefLead(D)}y = ${a1 * e2 - a2 * e1}` },
      { tex: `y = \\square`, blank: y },
      { tex: `(x,\\, y) = \\left(\\square,\\, \\square\\right)`, blank: [x, y] }
    ]
  };
};

/* ── MD64 — 일차부등식 ──
   등식과 같은 방법으로 풀되 **음수로 나누면 부등호가 뒤집힌다**는 한
   가지가 전부인 단원. 입력칸이 숫자뿐이라 부등호 자체는 생성기가
   계산해 tex에 실어 보여 주고(MD29와 같은 규약), 학생은 경계값을
   구한다. 다만 'integer' 모드는 뒤집힘이 실제로 채점에 걸리도록
   "만족하는 가장 큰 정수"를 묻는다.
   mode: 'positive'(a>0, 방향 그대로) · 'flip'(a<0, 방향 뒤집힘) ·
   'integer'(양변에 x, 정수해 묻기, 실전). */
NM_TGEN['md64_linearInequality'] = function (params, rng) {
  const mode = params.mode || 'positive';
  const FLIP = { '>': '<', '<': '>', '\\ge': '\\le', '\\le': '\\ge' };

  if (mode === 'flip') {
    const x0 = nzInt(rng, 1, params.wide ? 12 : 8);
    const a = -R(rng, 2, params.wide ? 8 : 5);          /* 반드시 음수 계수 */
    const b = nzInt(rng, 1, 9);
    const c = a * x0 + b;
    const sym = pick(rng, ['>', '<', '\\ge', '\\le']);
    return {
      prompt: { ko: `음수로 나누면 부등호의 방향이 뒤집혀요 — 경계가 되는 수를 구해요`,
        en: `Dividing by a negative flips the inequality sign — find the boundary value`,
        zh: `除以负数时不等号方向要反过来——求出边界的数` },
      tex: `${coefLead(a)}x ${wrapPlus(b)} ${sym} ${c} \\quad\\Rightarrow\\quad x ${FLIP[sym]} \\square`,
      answer: x0, answerType: 'number', widget: 'numpad', negative: x0 < 0,
      solution: [
        { tex: `${coefLead(a)}x ${sym} ${c} - (${b}) = \\square`, blank: c - b },
        { tex: `${c - b} \\div (${a}) = \\square`, blank: x0 },
        { tex: `x ${FLIP[sym]} \\square \\quad (\\text{음수로 나눠 방향이 뒤집혔어요})`, blank: x0 }
      ]
    };
  }

  if (mode === 'integer') {
    /* 양변에 x가 있고, 정리하면 x의 계수가 음수가 되도록 잡아 뒤집힘을
       반드시 거치게 만든다. 답은 부등호가 아니라 **정수 하나**. */
    const x0 = nzInt(rng, 1, params.wide ? 10 : 7);
    const a = R(rng, 1, 4);
    let c = R(rng, 5, 9);                                /* c>a 이므로 (a-c)<0 */
    const d = nzInt(rng, 1, 9);
    let b = (c - a) * x0 + d;                            /* ax+b = cx+d 의 경계 */
    let guard = 0;
    while (b === 0 && guard++ < 20) { c = R(rng, 5, 9); b = (c - a) * x0 + d; }
    if (b === 0) { c = c + 1; b = (c - a) * x0 + d; }    /* 상수항 0 은 식에 안 쓴다 */
    const strict = pick(rng, [true, false]);
    /* ax+b > cx+d ⟺ (a-c)x > d-b ⟺ x < x0 (a-c<0) — 가장 큰 정수는 x0-1
       ax+b ≥ cx+d ⟺ x ≤ x0 — 가장 큰 정수는 x0 */
    const sym = strict ? '>' : '\\ge';
    const shown = strict ? '<' : '\\le';
    const want = strict ? x0 - 1 : x0;
    return {
      prompt: { ko: `정리하면 x ${strict ? '<' : '≤'} (어떤 수)가 돼요 — 이를 만족하는 가장 큰 정수를 답해요`,
        en: `Rearranged it becomes x ${strict ? '<' : '≤'} (some number) — answer the largest integer that satisfies it`,
        zh: `整理后变成x ${strict ? '<' : '≤'}(某个数)——回答满足它的最大整数` },
      tex: `${coefLead(a)}x ${wrapPlus(b)} ${sym} ${coefLead(c)}x ${wrapPlus(d)} \\quad\\Rightarrow\\quad \\text{가장 큰 정수 } x = \\square`,
      answer: want, answerType: 'number', widget: 'numpad', negative: want < 0,
      solution: [
        { tex: `${coefLead(a - c)}x ${sym} ${d} - (${b}) = ${d - b}` },
        { tex: `x ${shown} \\square \\quad (\\text{음수로 나눠 뒤집힘})`, blank: x0 },
        { tex: `\\text{가장 큰 정수} = \\square`, blank: want }
      ]
    };
  }

  /* positive(기본) — a>0, 방향이 그대로 */
  const x0 = nzInt(rng, 1, params.wide ? 12 : 9);
  const a = R(rng, 2, params.wide ? 8 : 5);
  const b = nzInt(rng, 1, 9);
  const c = a * x0 + b;
  const sym = pick(rng, ['>', '<', '\\ge', '\\le']);
  return {
    prompt: { ko: `부등식도 방정식처럼 풀어요 — 양수로 나눌 때는 부등호 방향이 그대로예요`,
      en: `Solve an inequality just like an equation — dividing by a positive keeps the sign the same`,
      zh: `不等式和方程一样解——除以正数时不等号方向不变` },
    tex: `${a}x ${wrapPlus(b)} ${sym} ${c} \\quad\\Rightarrow\\quad x ${sym} \\square`,
    answer: x0, answerType: 'number', widget: 'numpad', negative: x0 < 0,
    solution: [
      { tex: `${a}x ${sym} ${c} - (${b}) = \\square`, blank: c - b },
      { tex: `\\dfrac{${c - b}}{${a}} = \\square`, blank: x0 }
    ]
  };
};

/* ── MD65 — 일차함수의 기울기와 절편 ──
   기울기 m·y절편 b를 먼저 고르고 두 점을 y=mx+b 위에서 뽑으므로
   (y₂-y₁)/(x₂-x₁)이 언제나 m으로 딱 떨어진다.
   mode: 'slope'(두 점 → 기울기 1칸) · 'intercept'(기울기와 한 점 →
   y절편 1칸) · 'fromPoints'(두 점 → y=□x+□ 2칸, 실전). */
NM_TGEN['md65_linearFunction'] = function (params, rng) {
  const mode = params.mode || 'slope';

  /* ── 그래프 모드(2026-09-21) ── 원장 "일차함수 그래프는".
     기울기가 "오른쪽 1칸에 위로 몇 칸"이라는 건 격자 위에서만 보인다. 좌표를
     숫자로만 주던 위 세 모드에 그래프를 읽는 두 모드를 더한다. 계수 범위는
     **상자 안에서 읽히도록** 정한다 — |m|≤3, |b|≤5, x∈[-6,6], y∈[-8,8].
     격자에 실제로 찍히는 점(정수 좌표)만 표시해야 칸을 세어 읽을 수 있다. */
  if (mode === 'readSlope' || mode === 'readEquation') {
    const gm = pick(rng, [1, 2, 3, -1, -2, -3]);
    const gb = R(rng, -5, 5);
    const xr = [-6, 6], yr = [-8, 8];
    /* 표시할 격자점 두 개 — y절편과, 상자 안에 남는 가까운 정수점 하나 */
    const pts = [[0, gb]];
    for (const k of [1, -1, 2, -2, 3, -3]) {
      const y = gm * k + gb;
      if (y >= yr[0] && y <= yr[1]) { pts.push([k, y]); break; }
    }
    const graph = { kind: 'line', m: gm, b: gb, pts: pts, xr: xr, yr: yr };

    if (mode === 'readSlope') {
      return {
        prompt: { ko: `그래프에서 오른쪽으로 1칸 갈 때 위아래로 몇 칸 움직이는지 세어요 — 그게 기울기예요`,
          en: `On the graph, count how many squares up or down you move for one square to the right — that is the slope`,
          zh: `在图象上数一数：向右走1格时上下走了几格——那就是斜率` },
        tex: `\\text{기울기} = \\square`,
        answer: gm, answerType: 'number', widget: 'graphPlane', graph: graph, negative: gm < 0,
        solution: [
          { tex: `\\text{오른쪽 1칸} \\quad\\Rightarrow\\quad \\text{세로 } \\square \\text{칸}`, blank: gm },
          { tex: `\\text{기울기} = \\square`, blank: gm }
        ]
      };
    }
    return {
      prompt: { ko: `그래프가 y축과 만나는 높이가 b, 오른쪽 1칸당 오르내리는 칸 수가 a예요 — y=ax+b로 적어요`,
        en: `Where the graph meets the y-axis is b, and the squares it rises per square right is a — write it as y=ax+b`,
        zh: `图象与y轴相交的高度是b，向右1格上下走的格数是a——写成y=ax+b` },
      tex: `y = \\square x + \\square`,
      answer: [gm, gb], answerType: 'number', widget: 'graphPlane', graph: graph, negative: hasNeg([gm, gb]),
      solution: [
        { tex: `\\text{y축과 만나는 높이} = \\square`, blank: gb },
        { tex: `\\text{오른쪽 1칸당 세로} = \\square`, blank: gm },
        { tex: `y = \\square x + \\square`, blank: [gm, gb] }
      ]
    };
  }

  const m = nzInt(rng, 1, params.wide ? 6 : 4);
  const b = nzInt(rng, 1, params.wide ? 12 : 8);
  const x1 = nzInt(rng, 1, 6);
  let x2 = nzInt(rng, 1, 6);
  let guard = 0;
  while (x2 === x1 && guard++ < 20) x2 = nzInt(rng, 1, 6);
  if (x2 === x1) x2 = x1 + 1;
  const y1 = m * x1 + b, y2 = m * x2 + b;

  if (mode === 'intercept') {
    return {
      prompt: { ko: `y절편은 그래프가 y축과 만나는 높이예요 — y=ax+b에 점의 좌표를 넣고 b를 구해요`,
        en: `The y-intercept is where the graph meets the y-axis — put the point into y=ax+b and solve for b`,
        zh: `y截距是图象与y轴相交的高度——把点的坐标代入y=ax+b求出b` },
      tex: `\\text{기울기 } ${m}, \\quad (${x1},\\, ${y1}) \\quad\\Rightarrow\\quad y = ${coefLead(m)}x + \\square`,
      answer: b, answerType: 'number', widget: 'numpad', negative: b < 0,
      solution: [
        { tex: `${y1} = ${coefLead(m)}(${x1}) + b` },
        { tex: `b = ${y1} - (${m * x1}) = \\square`, blank: b }
      ]
    };
  }

  if (mode === 'fromPoints') {
    return {
      prompt: { ko: `두 점으로 기울기를 먼저 구하고, 그 기울기와 한 점으로 y절편을 구해요`,
        en: `Find the slope from the two points first, then use the slope and one point to find the y-intercept`,
        zh: `先用两点求出斜率，再用斜率和其中一点求出y截距` },
      tex: `(${x1},\\, ${y1}), \\quad (${x2},\\, ${y2}) \\quad\\Rightarrow\\quad y = \\square x + \\square`,
      answer: [m, b], answerType: 'number', widget: 'numpad', negative: hasNeg([m, b]),
      solution: [
        { tex: `\\dfrac{${y2} - (${y1})}{${x2} - (${x1})} = \\dfrac{${y2 - y1}}{${x2 - x1}} = \\square`, blank: m },
        { tex: `b = ${y1} - ${coefLead(m)}(${x1}) = \\square`, blank: b },
        { tex: `y = \\square x + \\square`, blank: [m, b] }
      ]
    };
  }

  /* slope(기본) — 두 점에서 기울기 */
  return {
    prompt: { ko: `기울기는 (y의 증가량)÷(x의 증가량)이에요 — 오른쪽으로 1칸 갈 때 위로 몇 칸인지예요`,
      en: `Slope is (change in y) divided by (change in x) — how far up you go for each step right`,
      zh: `斜率是(y的增量)÷(x的增量)——向右走1格时向上走几格` },
    tex: `(${x1},\\, ${y1}), \\quad (${x2},\\, ${y2}) \\quad\\Rightarrow\\quad \\text{기울기} = \\square`,
    answer: m, answerType: 'number', widget: 'numpad', negative: m < 0,
    solution: [
      { tex: `${y2} - (${y1}) = \\square`, blank: y2 - y1 },
      { tex: `${x2} - (${x1}) = \\square`, blank: x2 - x1 },
      { tex: `\\dfrac{${y2 - y1}}{${x2 - x1}} = \\square`, blank: m }
    ]
  };
};

/* ============================================================
   B. 중3 — 이차방정식과 이차함수 (tier:middle3, W10)
   ============================================================ */

/* ── MD66 — 이차방정식 풀이 ──
   MD20(인수분해 기초)이 식을 쪼개는 데서 끝났다면, 여기서는 그 쪼갠
   식을 =0 으로 놓고 **근을 읽는다**. 두 근 p≤q를 먼저 고르므로 항상
   정수해. mode: 'factor'(x²+bx+c=0, 답 [p,q]) · 'completeSquare'
   (완전제곱꼴 (x+□)²=□, b를 짝수로) · 'leadCoef'(a≠1, 실전). */
NM_TGEN['md66_quadEquation'] = function (params, rng) {
  const mode = params.mode || 'factor';

  if (mode === 'completeSquare') {
    /* x²+2px+c=0 ⟹ (x+p)² = p²-c. p를 먼저 골라 b=2p로 두면
       b가 항상 짝수라 b/2가 정수. */
    const p = nzInt(rng, 1, params.wide ? 9 : 6);
    const c = nzInt(rng, 1, params.wide ? 20 : 12);
    const b = 2 * p, rhs = p * p - c;
    return {
      prompt: { ko: `x의 계수의 절반을 제곱해 더하고 빼면 완전제곱식이 돼요 — (x+□)² = □ 꼴로 고쳐요`,
        en: `Halve the coefficient of x, square it, add and subtract it — rewrite as (x+□)² = □`,
        zh: `把x的系数取一半再平方，加上又减去，就能配成完全平方——改写成(x+□)²=□的形式` },
      tex: `x^2 ${wrapPlus(b)}x ${wrapPlus(c)} = 0 \\quad\\Rightarrow\\quad (x ${wrapPlus(p)})^2 = \\square`,
      answer: rhs, answerType: 'number', widget: 'numpad', negative: rhs < 0,
      solution: [
        { tex: `\\dfrac{${b}}{2} = \\square`, blank: p },
        { tex: `x^2 ${wrapPlus(b)}x ${wrapPlus(p * p)} = ${p * p} - (${c})` },
        { tex: `(x ${wrapPlus(p)})^2 = \\square`, blank: rhs }
      ]
    };
  }

  if (mode === 'leadCoef') {
    /* a(x-p)(x-q)=0 — 계수가 1이 아니어도 근은 p,q 그대로 */
    let p = nzInt(rng, 1, 8), q = nzInt(rng, 1, 8);
    let guard = 0;
    while (p + q === 0 && guard++ < 20) q = nzInt(rng, 1, 8);
    if (p + q === 0) q = q + 1;                          /* x항 계수 0 은 식에 안 쓴다 */
    if (p > q) { const t = p; p = q; q = t; }
    const a = pick(rng, [2, 3, 2, 3, 4]);
    const B = -a * (p + q), C = a * p * q;
    return {
      prompt: { ko: `공통인수를 먼저 묶어내고 인수분해해요 — 근은 각 인수를 0으로 만드는 값이에요. 작은 수부터 입력해요`,
        en: `Pull out the common factor first, then factor — each root makes one factor zero. Enter the smaller one first`,
        zh: `先提取公因数再因式分解——每个因式为0的值就是根。先输入较小的那个` },
      tex: `${a}x^2 ${wrapPlus(B)}x ${wrapPlus(C)} = 0 \\quad\\Rightarrow\\quad x = \\square \\quad\\text{또는}\\quad \\square`,
      answer: [p, q], answerType: 'number', widget: 'numpad', negative: hasNeg([p, q]),
      solution: [
        { tex: `${a}(x^2 ${wrapPlus(-(p + q))}x ${wrapPlus(p * q)}) = 0` },
        { tex: `${a}(x ${wrapPlus(-p)})(x ${wrapPlus(-q)}) = 0` },
        { tex: `x = \\square \\quad\\text{또는}\\quad \\square`, blank: [p, q] }
      ]
    };
  }

  /* factor(기본) — x²+bx+c=0 */
  let p = nzInt(rng, 1, params.wide ? 12 : 9), q = nzInt(rng, 1, params.wide ? 12 : 9);
  let guard = 0;
  while (p + q === 0 && guard++ < 20) q = nzInt(rng, 1, params.wide ? 12 : 9);
  if (p + q === 0) q = q + 1;
  if (p > q) { const t = p; p = q; q = t; }
  const b = -(p + q), c = p * q;
  return {
    prompt: { ko: `AB=0이면 A=0 또는 B=0이에요 — 인수분해한 뒤 각 괄호를 0으로 만드는 x를 찾아요. 작은 수부터 입력해요`,
      en: `If AB=0 then A=0 or B=0 — factor it, then find the x that makes each bracket zero. Enter the smaller one first`,
      zh: `若AB=0则A=0或B=0——先因式分解，再找出使每个括号为0的x。先输入较小的那个` },
    tex: `x^2 ${wrapPlus(b)}x ${wrapPlus(c)} = 0 \\quad\\Rightarrow\\quad x = \\square \\quad\\text{또는}\\quad \\square`,
    answer: [p, q], answerType: 'number', widget: 'numpad', negative: hasNeg([p, q]),
    solution: [
      { tex: `${p} + ${q} = ${p + q}, \\quad ${p} \\times ${q} = ${c}` },
      { tex: `(x ${wrapPlus(-p)})(x ${wrapPlus(-q)}) = 0` },
      { tex: `x = \\square \\quad\\text{또는}\\quad \\square`, blank: [p, q] }
    ]
  };
};

/* ── MD67 — 이차함수의 꼭짓점 ──
   y=a(x-p)²+q를 전개해 문제로 내보내므로 꼭짓점 (p,q)가 처음부터
   정수 — -b/2a를 구하는 자리에서 나눗셈이 항상 떨어진다.
   mode: 'vertexForm'(표준형에서 그대로 읽기) · 'complete'(y=x²+bx+c,
   b 짝수) · 'withCoef'(a≠1, 실전). 답은 [p, q] 2칸. */
NM_TGEN['md67_quadVertex'] = function (params, rng) {
  const mode = params.mode || 'vertexForm';

  /* ── 그래프 모드(2026-09-21) ── MD65 와 같은 좌표평면 위젯. 포물선은 "꼭짓점이
     어디냐"가 그림 하나로 끝나는 개념이라, 식만 주고 끝내면 절반만 가르친 셈이다.
     상자 안에서 꼭짓점과 양팔이 다 보이도록 a=±1, |p|≤3, |q|≤4 로 묶는다. */
  if (mode === 'readVertex') {
    const ga = pick(rng, [1, -1]);
    const gp = R(rng, -3, 3), gq = R(rng, -4, 4);
    return {
      prompt: { ko: `포물선이 꺾이는 한 점이 꼭짓점이에요 — 그래프에서 좌표를 읽어요`,
        en: `The single point where the parabola turns is the vertex — read its coordinates off the graph`,
        zh: `抛物线转折的那一点就是顶点——从图象上读出它的坐标` },
      tex: `\\text{꼭짓점} \\left(\\square,\\, \\square\\right)`,
      answer: [gp, gq], answerType: 'number', widget: 'graphPlane', negative: hasNeg([gp, gq]),
      graph: { kind: 'parabola', a: ga, p: gp, q: gq, pts: [[gp, gq]], xr: [-6, 6], yr: [-8, 8] },
      solution: [
        { tex: `\\text{가장 } ${ga > 0 ? '낮은' : '높은'} \\text{ 점의 } x = \\square`, blank: gp },
        { tex: `\\text{그때의 } y = \\square`, blank: gq },
        { tex: `\\text{꼭짓점} \\left(\\square,\\, \\square\\right)`, blank: [gp, gq] }
      ]
    };
  }

  const p = nzInt(rng, 1, params.wide ? 8 : 5);
  let q = nzInt(rng, 1, params.wide ? 14 : 9);

  if (mode === 'complete') {
    /* y = x² - 2px + (p²+q) — x의 계수가 항상 짝수 */
    let guard = 0;
    while (p * p + q === 0 && guard++ < 20) q = nzInt(rng, 1, params.wide ? 14 : 9);
    if (p * p + q === 0) q = q + 1;                      /* 상수항 0 은 식에 안 쓴다 */
    const b = -2 * p, c = p * p + q;
    return {
      prompt: { ko: `x의 계수의 절반을 제곱해 더하고 빼면 y=(x-p)²+q 꼴이 돼요 — 꼭짓점은 (p, q)예요`,
        en: `Halve the coefficient of x and square it to reach y=(x-p)²+q — the vertex is (p, q)`,
        zh: `把x的系数取一半再平方，配成y=(x-p)²+q的形式——顶点就是(p, q)` },
      tex: `y = x^2 ${wrapPlus(b)}x ${wrapPlus(c)} \\quad\\Rightarrow\\quad \\text{꼭짓점} \\left(\\square,\\, \\square\\right)`,
      answer: [p, q], answerType: 'number', widget: 'numpad', negative: hasNeg([p, q]),
      solution: [
        { tex: `-\\dfrac{${b}}{2} = \\square`, blank: p },
        { tex: `${c} - (${p})^2 = \\square`, blank: q },
        { tex: `y = (x ${wrapPlus(-p)})^2 ${wrapPlus(q)} \\quad\\Rightarrow\\quad (\\square,\\, \\square)`, blank: [p, q] }
      ]
    };
  }

  if (mode === 'withCoef') {
    /* y = a(x-p)² + q 를 전개 — a로 묶어 내야 꼭짓점이 보인다 */
    const a = pick(rng, [2, 3, -2, -3]);
    let guard = 0;
    while (a * p * p + q === 0 && guard++ < 20) q = nzInt(rng, 1, params.wide ? 14 : 9);
    if (a * p * p + q === 0) q = q + 1;                  /* 상수항 0 은 식에 안 쓴다 */
    const b = -2 * a * p, c = a * p * p + q;
    return {
      prompt: { ko: `x²의 계수를 먼저 묶어낸 뒤 완전제곱을 만들어요 — 위로 볼록·아래로 볼록은 그 계수의 부호가 정해요`,
        en: `Factor out the coefficient of x² first, then complete the square — its sign decides whether the parabola opens up or down`,
        zh: `先提取x²的系数再配方——开口向上还是向下由这个系数的符号决定` },
      tex: `y = ${coefLead(a)}x^2 ${wrapPlus(b)}x ${wrapPlus(c)} \\quad\\Rightarrow\\quad \\text{꼭짓점} \\left(\\square,\\, \\square\\right)`,
      answer: [p, q], answerType: 'number', widget: 'numpad', negative: hasNeg([p, q]),
      solution: [
        { tex: `-\\dfrac{${b}}{2 \\times (${a})} = \\square`, blank: p },
        { tex: `${c} - ${a}(${p})^2 = \\square`, blank: q },
        { tex: `y = ${coefLead(a)}(x ${wrapPlus(-p)})^2 ${wrapPlus(q)} \\quad\\Rightarrow\\quad (\\square,\\, \\square)`, blank: [p, q] }
      ]
    };
  }

  /* vertexForm(기본) — 표준형에서 그대로 읽기. 부호 함정이 핵심이다 */
  const a = pick(rng, [1, 1, 2, -1, -2]);
  return {
    prompt: { ko: `y=a(x-p)²+q의 꼭짓점은 (p, q)예요 — 괄호 안의 부호는 반대로 읽어요`,
      en: `For y=a(x-p)²+q the vertex is (p, q) — read the sign inside the brackets the opposite way`,
      zh: `y=a(x-p)²+q的顶点是(p, q)——括号里的符号要反过来读` },
    tex: `y = ${coefLead(a)}(x ${wrapPlus(-p)})^2 ${wrapPlus(q)} \\quad\\Rightarrow\\quad \\text{꼭짓점} \\left(\\square,\\, \\square\\right)`,
    answer: [p, q], answerType: 'number', widget: 'numpad', negative: hasNeg([p, q]),
    solution: [
      { tex: `(x ${wrapPlus(-p)})^2 = 0 \\quad\\Rightarrow\\quad x = \\square`, blank: p },
      { tex: `\\text{그때 } y = ${coefLead(a)}\\times 0 ${wrapPlus(q)} = \\square`, blank: q },
      { tex: `\\text{꼭짓점} \\left(\\square,\\, \\square\\right)`, blank: [p, q] }
    ]
  };
};

if (typeof module !== 'undefined' && module.exports) module.exports = NM_TGEN;
})();
