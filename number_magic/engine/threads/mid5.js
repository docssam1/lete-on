/* ============================================================
   Numbers of Magic — MD31~35(고등 W12 · 공통수학2) 스레드 생성기.
   근거: MASTER-ROADMAP.md §6(W12 공통수학2) — 2022 개정 교육과정
   공통수학2 '도형의 방정식' 성취기준 범위의 표준 연산 유형을 자체
   설계(교재 원문 없음). 집합과 명제·함수(유리·무리) 등 비연산/좌표
   범위 밖 단원은 제외(작업지시). engine/threads/mid4.js(W11, MD21~30)
   에 이어지는 번호. 2022 개정 과목명 준수 — "고1" 표기 없음(전부
   "공통수학2"). 계약은 mid4.js와 동일: NM_TGEN[genKey] =
   function(params, rng) { ... }, Math.random() 금지.
   답 환원 규약: 좌표는 [x,y] 두 정수, 거리는 MD16과 같은 [계수,근호안]
   두 정수(도형의 방정식이라도 "√ 답은 근호 정리 규약을 그대로 재사용
   한다"는 작업지시 반영 — 새 규약을 만들지 않는다), 원의 방정식은
   [중심x,중심y,반지름] 세 정수. 전부 forward 생성(목표값을 먼저
   정하고 그로부터 문제 계수를 역산)이라 나눗셈으로 인한 소수 답이
   원천적으로 나오지 않는다 — 검증 하네스가 다시 확인한다.

   solution 필드(2026-09-04, 학습지 v2 §2-4 ★예시 문항용) — 각
   생성기가 실제로 답에 이르는 과정을 {tex,blank} 배열로 함께
   반환한다. 마지막 줄의 blank는 항상 answer와 동일(검증:
   scripts/check-solution-steps.js). tex·answer 등 기존 필드는
   전혀 바뀌지 않는다.
   ============================================================ */
(function(){
'use strict';

const { R, pick } = NM_RNG;

/* ── 공용 헬퍼(mid3.js·mid4.js와 동일 계열, 파일별 독립 정의 관례) ── */
function nzInt(rng, lo, hi){ return R(rng, lo, hi) * pick(rng, [1, -1]); }
function wrapPlus(n){ return n < 0 ? `- ${Math.abs(n)}` : `+ ${n}`; }
function hasNeg(v){ return Array.isArray(v) ? v.some(x => x < 0) : v < 0; }
/* N=coeff²×rad(rad는 제곱인수 없음) 꼴로 정리 — MD16(mid3.js)과 동일
   알고리즘의 독립 사본(파일 간 공유 없음, 기존 관례). */
function simplifyRadical(N){
  let coeff = 1, rad = N;
  for (let p = 2; p * p <= rad; p++) {
    while (rad % (p * p) === 0) { rad /= (p * p); coeff *= p; }
  }
  return { coeff, rad };
}

/* ── MD31 — 두 점 사이의 거리 ── 답은 MD16과 같은 [계수,근호안] 규약
   재사용(작업지시) — √(dx²+dy²)를 완전제곱 인수로 정리한다. mode:
   'basic'(작은 좌표) · 'wide'(더 큰 좌표) · 'signed'(음수 좌표 위주,
   실전). */
NM_TGEN['md31_distance'] = function (params, rng) {
  const mode = params.mode || 'basic';
  const range = mode === 'basic' ? 7 : mode === 'wide' ? 13 : 15;
  let x1, y1, x2, y2, dx, dy;
  do {
    x1 = R(rng, -range, range); y1 = R(rng, -range, range);
    x2 = R(rng, -range, range); y2 = R(rng, -range, range);
    dx = x2 - x1; dy = y2 - y1;
  } while (dx === 0 || dy === 0);
  const N = dx * dx + dy * dy;
  const { coeff, rad } = simplifyRadical(N);
  const answer = [coeff, rad];
  return {
    prompt: {
      ko: `두 점 사이의 거리는 가로·세로 차를 각각 제곱해 더한 뒤 제곱근을 씌워요(피타고라스 정리)`,
      en: `The distance between two points: square the horizontal and vertical differences, add them, then take the square root (Pythagorean theorem)`,
      zh: `两点间距离：把横、纵坐标差分别平方后相加，再开平方(勾股定理)`
    },
    tex: `A(${x1}, ${y1}), \\;\\; B(${x2}, ${y2}) \\;\\Rightarrow\\; \\overline{AB} = \\square\\sqrt{\\square}`,
    answer, answerType: 'number', widget: 'numpad', negative: hasNeg(answer),
    solution: [
      { tex: `(x_2-x_1)^2 = (${x2}-(${x1}))^2 = \\square`, blank: dx * dx },
      { tex: `(y_2-y_1)^2 = (${y2}-(${y1}))^2 = \\square`, blank: dy * dy },
      { tex: `\\sqrt{${dx * dx}+${dy * dy}} = \\square\\sqrt{\\square}`, blank: [coeff, rad] }
    ]
  };
};

/* ── MD32 — 중점과 내분점·외분점 ── 세 모드 모두 "목표 좌표를 먼저
   정하고 그로부터 두 점을 역산"하는 forward 생성이라 나눗셈이 항상
   정수로 떨어진다(내분·외분 공식의 분모가 자동으로 약분됨). mode:
   'midpoint' · 'section'(내분, m:n) · 'external'(외분, m≠n 필수). */
NM_TGEN['md32_midSection'] = function (params, rng) {
  const mode = params.mode || 'midpoint';

  if (mode === 'midpoint') {
    const mx = nzInt(rng, 1, 12), my = nzInt(rng, 1, 12);
    const hx = R(rng, 1, 8), hy = R(rng, 1, 8);
    const x1 = mx - hx, y1 = my - hy, x2 = mx + hx, y2 = my + hy;
    const answer = [mx, my];
    return {
      prompt: {
        ko: `중점은 두 좌표를 각각 더해 2로 나눠요`,
        en: `The midpoint: add each pair of coordinates and divide by 2`,
        zh: `中点：把两个坐标分别相加再除以2`
      },
      tex: `A(${x1}, ${y1}), \\;\\; B(${x2}, ${y2}) \\;\\Rightarrow\\; M = (\\square, \\square)`,
      answer, answerType: 'number', widget: 'numpad', negative: hasNeg(answer),
      solution: [
        { tex: `M_x = \\dfrac{${x1}+${x2}}{2} = \\square`, blank: mx },
        { tex: `M_y = \\dfrac{${y1}+${y2}}{2} = \\square`, blank: my },
        { tex: `M = (\\square, \\square)`, blank: [mx, my] }
      ]
    };
  }

  if (mode === 'section') {
    let m = R(rng, 1, 4), n = R(rng, 1, 4);
    while (m === n) n = R(rng, 1, 4);
    const s = m + n;
    const tx = nzInt(rng, 1, 5), ty = nzInt(rng, 1, 5);
    const x1 = R(rng, -8, 8), y1 = R(rng, -8, 8);
    const x2 = x1 + s * tx, y2 = y1 + s * ty;
    const px = x1 + m * tx, py = y1 + m * ty;
    const answer = [px, py];
    return {
      prompt: {
        ko: `m:n으로 내분하는 점은 A쪽에 n, B쪽에 m을 곱해 더한 뒤 (m+n)으로 나눠요`,
        en: `The point dividing AB internally in ratio m:n weights A by n and B by m, sums them, and divides by (m+n)`,
        zh: `按m:n内分的点，A乘n、B乘m后相加，再除以(m+n)`
      },
      tex: `A(${x1}, ${y1}), \\;\\; B(${x2}, ${y2}), \\;\\; ${m}:${n} \\;\\Rightarrow\\; P = (\\square, \\square)`,
      answer, answerType: 'number', widget: 'numpad', negative: hasNeg(answer),
      solution: [
        { tex: `P_x = \\dfrac{${n}\\times ${x1}+${m}\\times ${x2}}{${m}+${n}} = \\square`, blank: px },
        { tex: `P_y = \\dfrac{${n}\\times ${y1}+${m}\\times ${y2}}{${m}+${n}} = \\square`, blank: py },
        { tex: `P = (\\square, \\square)`, blank: [px, py] }
      ]
    };
  }

  /* external — 외분(실전), m≠n 필수 */
  let m = R(rng, 1, 4), n = R(rng, 1, 4);
  while (m === n) n = R(rng, 1, 4);
  const d = m - n;
  const tx = nzInt(rng, 1, 5), ty = nzInt(rng, 1, 5);
  const x1 = R(rng, -8, 8), y1 = R(rng, -8, 8);
  const x2 = x1 + d * tx, y2 = y1 + d * ty;
  const px = x1 + m * tx, py = y1 + m * ty;
  const answer = [px, py];
  return {
    prompt: {
      ko: `외분점은 내분과 같은 모양이지만 분모가 (m-n)이에요 — m=n이면 정할 수 없어요`,
      en: `The external division point uses the same shape but with denominator (m-n) — undefined when m=n`,
      zh: `外分点结构和内分一样，但分母是(m-n)——m=n时无法确定`
    },
    tex: `A(${x1}, ${y1}), \\;\\; B(${x2}, ${y2}), \\;\\; ${m}:${n} \\;\\Rightarrow\\; Q = (\\square, \\square)`,
    answer, answerType: 'number', widget: 'numpad', negative: hasNeg(answer),
    solution: [
      { tex: `Q_x = \\dfrac{${m}\\times ${x2}-${n}\\times ${x1}}{${m}-${n}} = \\square`, blank: px },
      { tex: `Q_y = \\dfrac{${m}\\times ${y2}-${n}\\times ${y1}}{${m}-${n}} = \\square`, blank: py },
      { tex: `Q = (\\square, \\square)`, blank: [px, py] }
    ]
  };
};

/* ── MD33 — 직선의 방정식(기울기·y절편) ── 답은 y=ax+b의 [a,b] 두
   정수. mode: 'twoPoints'(두 점 통과) · 'standardForm'(일반형→기울기
   절편형 변환) · 'standardFormWide'(같은 변환, 실전 범위). */
NM_TGEN['md33_lineEquation'] = function (params, rng) {
  const mode = params.mode || 'twoPoints';

  if (mode === 'twoPoints') {
    const a = nzInt(rng, 1, 8);
    const x1 = R(rng, -8, 8), y1 = nzInt(rng, 1, 15);
    const dx = nzInt(rng, 1, 6);
    const x2 = x1 + dx, y2 = y1 + a * dx;
    const b = y1 - a * x1;
    const answer = [a, b];
    return {
      prompt: {
        ko: `기울기는 y의 변화량÷x의 변화량, y절편은 기울기를 구한 뒤 한 점을 대입해 찾아요`,
        en: `Slope is the change in y over the change in x; find the y-intercept by substituting one point once you know the slope`,
        zh: `斜率是y的变化量除以x的变化量，求出斜率后代入一点即可求y轴截距`
      },
      tex: `A(${x1}, ${y1}), \\;\\; B(${x2}, ${y2}) \\;\\Rightarrow\\; y = \\square x + \\square`,
      answer, answerType: 'number', widget: 'numpad', negative: hasNeg(answer),
      solution: [
        { tex: `a = \\dfrac{${y2}-${y1}}{${x2}-${x1}} = \\square`, blank: a },
        { tex: `b = ${y1}-(${a})\\times(${x1}) = \\square`, blank: b },
        { tex: `y = \\square x + \\square`, blank: [a, b] }
      ]
    };
  }

  /* standardForm / standardFormWide — 일반형 Ax+By=C를 y=ax+b로 */
  const wide = mode === 'standardFormWide';
  const a = nzInt(rng, 1, wide ? 12 : 6), b = nzInt(rng, 1, wide ? 20 : 12);
  const B = R(rng, 1, wide ? 9 : 6);
  const A = -a * B, C = b * B;
  const answer = [a, b];
  return {
    prompt: {
      ko: `Ax+By=C를 y=  꼴로 바꾸려면 y항만 남기고 나머지를 이항한 뒤 B로 나눠요`,
      en: `To rewrite Ax+By=C as y=..., isolate the y term, transpose the rest, then divide by B`,
      zh: `把Ax+By=C改写成y=...的形式，先把y项单独留下，其余移项后再除以B`
    },
    tex: `${A}x + ${B}y = ${C} \\;\\Rightarrow\\; y = \\square x + \\square`,
    answer, answerType: 'number', widget: 'numpad', negative: hasNeg(answer),
    solution: [
      { tex: `${B}y = ${-A}x + ${C}` },
      { tex: `a = \\dfrac{${-A}}{${B}} = \\square`, blank: a },
      { tex: `b = \\dfrac{${C}}{${B}} = \\square`, blank: b },
      { tex: `y = \\square x + \\square`, blank: [a, b] }
    ]
  };
};

/* ── MD34 — 두 직선의 평행·수직 조건 ── 일반형 Ax+By+C=0 기준.
   평행: A₁D=kB₁(기울기 같음) · 수직: Ak+BD=0(기울기 곱=-1). 둘 다
   나눗셈이 아니라 곱셈으로 역산해 k가 항상 정수가 되도록 만든다.
   mode: 'parallel' · 'perpendicular' · 'mixed'(둘 중 하나, 더 큰
   범위, 실전). */
NM_TGEN['md34_parallelPerp'] = function (params, rng) {
  const which = params.mode === 'mixed' ? pick(rng, ['parallel', 'perpendicular']) : (params.mode || 'parallel');
  const wide = params.mode === 'mixed';
  const range = wide ? 9 : 6;

  /* k=A*D/B(평행)는 B|A일 때, k=-B*D/A(수직)는 A|B일 때 나눗셈 없이
     정수가 된다 — 두 조건의 배수 관계가 서로 반대라 모드별로 어느
     쪽을 자유 변수로 둘지 갈라야 한다(한쪽으로 통일하면 다른 쪽이
     항상 정수로 안 떨어짐 — 검증 하네스가 실제로 잡아낸 버그). */
  const j = nzInt(rng, 1, range);
  const D = nzInt(rng, 1, range);
  let A, B, k;
  if (which === 'parallel') {
    B = R(rng, 1, range); A = j * B;      /* B|A → k=A*D/B=j*D */
    k = j * D;
  } else {
    A = nzInt(rng, 1, range); B = j * A;  /* A|B → k=-B*D/A=-j*D */
    k = -j * D;
  }
  const C1 = nzInt(rng, 1, 10), C2 = nzInt(rng, 1, 10);
  const answer = k;

  return {
    prompt: which === 'parallel' ? {
      ko: `두 직선이 평행하려면 x,y의 계수 비율이 같아야 해요(A:B = k:D)`,
      en: `Two lines are parallel when their x,y coefficient ratios match (A:B = k:D)`,
      zh: `两直线平行时x、y的系数比相同(A:B = k:D)`
    } : {
      ko: `두 직선이 수직이려면 Ak+BD=0이 성립해야 해요(기울기의 곱이 -1)`,
      en: `Two lines are perpendicular when Ak+BD=0 holds (the product of slopes is -1)`,
      zh: `两直线垂直时Ak+BD=0成立(斜率之积为-1)`
    },
    tex: `${A}x ${wrapPlus(B)}y ${wrapPlus(C1)} = 0, \\;\\; kx ${wrapPlus(D)}y ${wrapPlus(C2)} = 0 \\;\\Rightarrow\\; k = \\square`,
    answer, answerType: 'number', widget: 'numpad', negative: answer < 0,
    solution: which === 'parallel' ? [
      { tex: `A:B = k:D \\;\\Rightarrow\\; k = \\dfrac{A\\times D}{B}` },
      { tex: `k = \\dfrac{${A}\\times ${D}}{${B}} = \\square`, blank: k }
    ] : [
      { tex: `Ak+BD=0 \\;\\Rightarrow\\; k = \\dfrac{-BD}{A}` },
      { tex: `k = \\dfrac{-(${B})\\times(${D})}{${A}} = \\square`, blank: k }
    ]
  };
};

/* ── MD35 — 원의 방정식(완성형) ── x²+y²+Ax+By+C=0을 완전제곱으로
   묶어 (x-a)²+(y-b)²=r² 꼴의 중심(a,b)·반지름 r을 구한다. 답은 세
   정수 [a,b,r](입력 순서 그대로). mode: 'basic' · 'wide'(더 큰 값) ·
   'leadingCoeff'(x²,y² 앞에 공통계수 m이 있어 먼저 나눠야 함, 실전). */
NM_TGEN['md35_circleEquation'] = function (params, rng) {
  const mode = params.mode || 'basic';
  const range = mode === 'wide' || mode === 'leadingCoeff' ? 15 : 8;

  const a = nzInt(rng, 1, range), b = nzInt(rng, 1, range);
  const r = R(rng, 1, mode === 'wide' || mode === 'leadingCoeff' ? 15 : 10);
  const A = -2 * a, B = -2 * b, C = a * a + b * b - r * r;
  const answer = [a, b, r];

  if (mode === 'leadingCoeff') {
    const m = R(rng, 2, 4);
    return {
      prompt: {
        ko: `x²,y² 앞에 공통 계수가 있으면 먼저 그 수로 전체를 나눈 뒤 완전제곱으로 묶어요`,
        en: `If x² and y² share a common coefficient, divide the whole equation by it first, then complete the square`,
        zh: `x²、y²前有公共系数时，先用它除全式，再配方成完全平方`
      },
      tex: `${m}x^2 + ${m}y^2 ${wrapPlus(m * A)}x ${wrapPlus(m * B)}y ${wrapPlus(m * C)} = 0 \\;\\Rightarrow\\; (x-\\square)^2+(y-\\square)^2=\\square^2`,
      answer, answerType: 'number', widget: 'numpad', negative: hasNeg(answer),
      solution: [
        { tex: `x^2+y^2 ${wrapPlus(A)}x ${wrapPlus(B)}y ${wrapPlus(C)} = 0` },
        { tex: `a=-\\dfrac{${A}}{2}=\\square,\\;\\;b=-\\dfrac{${B}}{2}=\\square`, blank: [a, b] },
        { tex: `r=\\sqrt{${a}^2+${b}^2-(${C})}=\\square`, blank: r },
        { tex: `(x-\\square)^2+(y-\\square)^2=\\square^2`, blank: [a, b, r] }
      ]
    };
  }

  return {
    prompt: {
      ko: `x항끼리, y항끼리 완전제곱식으로 묶으면 중심과 반지름이 바로 보여요`,
      en: `Group the x-terms and y-terms into perfect squares to reveal the center and radius directly`,
      zh: `把x项、y项分别配成完全平方式，中心和半径就一目了然`
    },
    tex: `x^2+y^2 ${wrapPlus(A)}x ${wrapPlus(B)}y ${wrapPlus(C)} = 0 \\;\\Rightarrow\\; (x-\\square)^2+(y-\\square)^2=\\square^2`,
    answer, answerType: 'number', widget: 'numpad', negative: hasNeg(answer),
    solution: [
      { tex: `a=-\\dfrac{${A}}{2}=\\square,\\;\\;b=-\\dfrac{${B}}{2}=\\square`, blank: [a, b] },
      { tex: `r=\\sqrt{${a}^2+${b}^2-(${C})}=\\square`, blank: r },
      { tex: `(x-\\square)^2+(y-\\square)^2=\\square^2`, blank: [a, b, r] }
    ]
  };
};

if (typeof module !== 'undefined' && module.exports) module.exports = NM_TGEN;
})();
