/* ============================================================
   Numbers of Magic — MD47~62(심화 유형 2차) 스레드 생성기.
   근거: 작업지시(2026-08-27, "심화 유형 2차") — MASTER-ROADMAP.md에서
   의도적으로 비워 뒀던 세 구간을 채운다.
   A. 중1 문자와 식(W8, tier:middle1, MD47~51) — 2022 개정 교육과정
      성취기준 범위를 자체 설계(원문 없음, W8은 애초에 원본 없이
      정수·유리수만 다뤘던 구간 — engine/threads/mid.js 상단 주석 참조).
   B. 대수 심화(tier:algebra, MD52~57) — mid6.js(MD36~42)가 작업지시로
      제외했던 지수·로그 방정식/부등식·사인법칙·코사인법칙·삼각함수
      최대최소주기.
   C. 미적분Ⅰ 심화(tier:calculus1, MD58~62) — mid7.js(MD43~46)가
      작업지시로 제외했던 유리화형 극한·연속조건·극값·넓이·속도.
   engine/threads/mid7.js(MD43~46)에 이어지는 번호. 계약:
   NM_TGEN[genKey] = function(params, rng) { ... }, Math.random() 금지.

   답 환원 원칙(MASTER-ROADMAP §7) — 이 파일에서 지키는 역산 요령:
   - MD47(문자식 표현): 계수·지수를 그대로 forward로 골라 다칸(계수,지수)
     으로 받는다. 나눗셈이 있는 표기(분수 계수)는 기약분수를 먼저
     고르고 배수로 늘려 역산(MD36과 동일 요령).
   - MD48(식의 값): 정수 대입 후 곱셈·덧셈뿐이라 항상 정수.
   - MD49(일차식 계산): 분배·동류항 정리 모두 정수 계수의 곱셈·덧셈뿐.
   - MD50(일차방정식): x(답)를 먼저 고르고 남은 상수를 역산 —
     나눗셈이 필요한 자리가 아예 없다.
   - MD51(정비례·반비례): 반비례는 두 좌표가 항상 같은 곱 a=xy가
     되도록 a의 약수 중에서 x를 고른다(나눗셈 대신 약수 선택).
   - MD52(지수방정식)·MD53(로그방정식)·MD54(지수·로그 부등식): x(답)를
     먼저 고르고 상수항을 역산 — mid6.js의 로그값 역산과 같은 계열.
   - MD55(사인법칙): 특수각 중 답이 정수 또는 [계수,근호안]으로 딱
     떨어지는 30°·45°·90°만 쓴다(60°는 분수+근호가 겹쳐 카탈로그의
     2형태 규약을 벗어나므로 제외).
   - MD56(코사인법칙): 90°는 실행 중 피타고라스 삼조를 매번 생성하고,
     60°·120°는 정수해가 나오는 (b,c,a) 삼조가 희소해(각각 20개·7개)
     아래 SIXTY_TRIPLES·ONE20_TRIPLES에 전수 탐색으로 미리 구해
     박아 둔다(범위: b,c∈[2,40], b<c, a=b,a=c 제외 — 도출 과정은
     이 파일 하단 주석 및 검증 스크립트 참조).
   - MD57(삼각함수 최대·최소·주기): 최대최소는 a+c/c-a 뺄셈뿐이라
     항상 정수. 주기는 2π/b(sin·cos) 또는 π/b(tan)를 π의 배수인
     기약분수 [분자,분모]로 받는다(새 answerShape 없이 'fraction' 재사용).
   - MD58(유리화형 극한): a+p=m²이 되도록 p를 역산해 두면 √(x+p)가
     x=a에서 정확히 m이 되고, 분모/분자 어느 쪽에 근호가 있든
     약분 후 남는 값이 항상 정수(분모 쪽) 또는 1/(2m)(분자 쪽,
     answerShape:'fraction')로 딱 떨어진다.
   - MD59(연속조건 상수 결정): 극한값 자체를 그대로 k로 두면 연속
     조건이 항등적으로 성립 — 나눗셈 없이 뺄셈·곱셈만으로 역산.
   - MD60(극값): f'(x)=3k(x-r1)(x-r2)가 되도록 r1+r2를 항상 짝수로
     골라 2로 나눈 몫이 정수가 되게 만든다(MD46과 같은 "나눗셈 대신
     배수" 요령).
   - MD61(곡선과 x축 사이 넓이): s=6k로 두면 원시함수의 항마다
     3·2로 나눠떨어져 계수가 전부 정수(§7 표의 "배수로 역산" 그대로).
   - MD62(속도·거리): 위치함수 계수를 짝수/3의 배수로 미리 정해
     속도의 역도함수가 나눗셈 없이 정수로 떨어지게 만든다.
   ============================================================ */
(function(){
'use strict';

const { R, pick } = NM_RNG;

/* ── 공용 헬퍼(mid4~7과 동일 계열, 파일별 독립 정의 관례) ── */
function nzInt(rng, lo, hi){ return R(rng, lo, hi) * pick(rng, [1, -1]); }
function wrapPlus(n){ return n < 0 ? `- ${Math.abs(n)}` : `+ ${n}`; }
/* 변수 항 전용 — 계수 ±1은 숫자를 감춰 '1x²' 노출 방지 */
function coefLead(n){ return n===1?'':n===-1?'-':String(n); }
function wrapPlusCoef(n){ return n===1?'+ ':n===-1?'- ':(n<0?`- ${Math.abs(n)}`:`+ ${n}`); }
function hasNeg(v){ return Array.isArray(v) ? v.some(x => x < 0) : v < 0; }
function gcd(a, b){ a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a || 1; }
function divisorsOf(n){ n=Math.abs(n); const out=[]; for(let d=1; d<=n; d++) if(n%d===0) out.push(d); return out; }

/* ============================================================
   A. 중1 문자와 식(W8, tier:middle1)
   ============================================================ */

/* ── MD47 — 문자식 표현 ── 곱셈 기호를 생략한 표기(계수 앞·문자 뒤,
   같은 문자의 반복은 지수로), 나눗셈은 분수로 쓰는 규칙. 정답은
   표기 규칙을 적용한 뒤의 계수(·지수)를 다칸으로 받는다.
   mode: 'singleVar'(한 문자, [계수,지수] 2칸) · 'withDivision'(나눗셈
   → 분수 계수, answerShape:'fraction') · 'twoVars'(두 문자, [계수,
   지수1,지수2] 3칸, 실전). */
NM_TGEN['md47_expressionNotation'] = function (params, rng) {
  const mode = params.mode || 'singleVar';
  const VARS = ['x', 'a', 'b', 'y'];

  if (mode === 'withDivision') {
    /* x×m÷d — 기약분수 p/q를 먼저 고르고 m=p×k, d=q×k로 역산해
       항상 정확히 p/q로 기약되게 만든다(MD36과 동일 요령). */
    let p, q;
    do { q = R(rng, 2, 6); p = R(rng, 1, 8); } while (gcd(p, q) !== 1);
    const k = R(rng, 1, 3);
    const m = p * k, d = q * k;
    const v = pick(rng, VARS);
    const answer = [p, q];
    return {
      prompt: { ko: `문자식에서 나눗셈은 분수로 써요 — ${v}×${m}÷${d}를 계수 하나의 분수로 정리해봐요(기약분수로)`,
        en: `In algebraic notation, division becomes a fraction — simplify ${v}×${m}÷${d} into one fractional coefficient (in lowest terms)`,
        zh: `代数式中除法要写成分数——把${v}×${m}÷${d}整理成一个最简分数系数` },
      tex: `${v} \\times ${m} \\div ${d} = \\dfrac{\\square}{\\square} ${v}`,
      answer, answerShape: 'fraction', answerType: 'number', widget: 'numpad', negative: false,
      solution: [
        { tex: `${v} \\times ${m} \\div ${d} = \\dfrac{${m}}{${d}} ${v}` },
        { tex: `\\dfrac{${m}}{${d}} = \\dfrac{\\square}{\\square}`, blank: answer }
      ]
    };
  }

  if (mode === 'twoVars') {
    const [v1, v2] = pick(rng, [['x', 'y'], ['a', 'b'], ['x', 'a']]);
    const c = R(rng, 2, 9);
    const e1 = R(rng, 2, 3), e2 = R(rng, 1, 2);
    const chain1 = new Array(e1).fill(v1).join('\\times ');
    const chain2 = new Array(e2).fill(v2).join('\\times ');
    const answer = [c, e1, e2];
    return {
      prompt: { ko: `같은 문자를 여러 번 곱하면 지수로 써요 — 곱셈 기호를 생략하고 정리해봐요(계수, ${v1}의 지수, ${v2}의 지수 순서)`,
        en: `Multiplying the same letter repeatedly becomes an exponent — drop the multiplication signs and simplify (coefficient, exponent of ${v1}, exponent of ${v2})`,
        zh: `同一字母连乘要写成指数——省略乘号后整理(依次是系数、${v1}的指数、${v2}的指数)` },
      tex: `${c} \\times ${chain1} \\times ${chain2} = \\square ${v1}^{\\square} ${v2}^{\\square}`,
      answer, answerType: 'number', widget: 'numpad', negative: false,
      solution: [
        { tex: `${chain1} = ${v1}^{${e1}},\\quad ${chain2} = ${v2}^{${e2}}` },
        { tex: `${c} \\times ${v1}^{${e1}} \\times ${v2}^{${e2}} = \\square ${v1}^{\\square} ${v2}^{\\square}`, blank: answer }
      ]
    };
  }

  /* singleVar(기본) */
  const c = R(rng, 2, 9);
  const n = R(rng, 2, params.wide ? 5 : 4);
  const v = pick(rng, VARS);
  const chain = new Array(n).fill(v).join('\\times ');
  const answer = [c, n];
  return {
    prompt: { ko: `곱셈 기호(×)는 생략하고, 숫자는 문자 앞에, 같은 문자를 여러 번 곱한 건 지수로 써요`,
      en: `Drop the multiplication sign(×), put the number before the letter, and write a repeated letter as an exponent`,
      zh: `乘号(×)省略，数字写在字母前面，同一字母连乘写成指数` },
    tex: `${c} \\times ${chain} = \\square ${v}^{\\square}`,
    answer, answerType: 'number', widget: 'numpad', negative: false,
    solution: [
      { tex: `${chain} = ${v}^{${n}}` },
      { tex: `${c} \\times ${v}^{${n}} = \\square ${v}^{\\square}`, blank: answer }
    ]
  };
};

/* ── MD48 — 식의 값 ── 문자에 정수를 대입해 계산. 곱셈·덧셈뿐이라
   항상 정수. mode: 'linear'(ax+b) · 'quadratic'(ax²+bx+c, 음수 대입
   포함) · 'twoVars'(ax+by, 실전). */
NM_TGEN['md48_expressionValue'] = function (params, rng) {
  const mode = params.mode || 'linear';

  if (mode === 'quadratic') {
    const a = nzInt(rng, 1, 6), b = nzInt(rng, 1, 8), c = nzInt(rng, 1, 9);
    const x = nzInt(rng, 1, params.wide ? 8 : 5);
    const answer = a * x * x + b * x + c;
    return {
      prompt: { ko: `문자에 수를 넣을 땐 곱셈 기호를 살려서 대입해요 — x=${x}를 그대로 넣어 계산해요`,
        en: `When substituting a number for a letter, restore the multiplication sign — plug in x=${x} directly`,
        zh: `代入数值时要把乘号补回来——直接代入x=${x}计算` },
      tex: `x=${x}\\text{일 때 } ${coefLead(a)}x^2 ${wrapPlusCoef(b)}x ${wrapPlus(c)} = \\square`,
      answer, answerType: 'number', widget: 'numpad', negative: answer < 0,
      solution: [
        { tex: `${a} \\times (${x})^2 = \\square`, blank: a * x * x },
        { tex: `${b} \\times ${x} = \\square`, blank: b * x },
        { tex: `${a * x * x} ${wrapPlus(b * x)} ${wrapPlus(c)} = \\square`, blank: answer }
      ]
    };
  }

  if (mode === 'twoVars') {
    const a = nzInt(rng, 1, 8), b = nzInt(rng, 1, 8);
    const x = nzInt(rng, 1, 6), y = nzInt(rng, 1, 6);
    const answer = a * x + b * y;
    return {
      prompt: { ko: `문자가 두 개면 각각 자리에 맞는 수를 대입해요`,
        en: `With two letters, substitute each one's matching value`,
        zh: `有两个字母就分别代入各自对应的数值` },
      tex: `x=${x},\\;y=${y}\\text{일 때 } ${coefLead(a)}x ${wrapPlusCoef(b)}y = \\square`,
      answer, answerType: 'number', widget: 'numpad', negative: answer < 0,
      solution: [
        { tex: `${a} \\times ${x} = \\square`, blank: a * x },
        { tex: `${b} \\times ${y} = \\square`, blank: b * y },
        { tex: `${a * x} ${wrapPlus(b * y)} = \\square`, blank: answer }
      ]
    };
  }

  /* linear(기본) */
  const a = nzInt(rng, 1, 9), b = nzInt(rng, 1, 9);
  const x = nzInt(rng, 1, params.wide ? 9 : 6);
  const answer = a * x + b;
  return {
    prompt: { ko: `문자에 수를 넣을 땐 곱셈 기호를 살려서 대입해요`,
      en: `When substituting a number for a letter, restore the multiplication sign`,
      zh: `代入数值时要把乘号补回来` },
    tex: `x=${x}\\text{일 때 } ${coefLead(a)}x ${wrapPlus(b)} = \\square`,
    answer, answerType: 'number', widget: 'numpad', negative: answer < 0,
    solution: [
      { tex: `${a} \\times ${x} = \\square`, blank: a * x },
      { tex: `${a * x} ${wrapPlus(b)} = \\square`, blank: answer }
    ]
  };
};

/* ── MD49 — 일차식의 계산(중1) ── 분배법칙·동류항 정리. MD12(중2
   다항식 곱나눗)와 달리 문자 하나짜리 일차식만 다룬다. mode:
   'distribute'(k(ax+b) 전개, [계수,상수] 2칸) · 'addSub'(두 일차식
   덧뺄, [계수,상수] 2칸) · 'mixed'(분배 후 동류항, 실전). */
NM_TGEN['md49_linearExprOps'] = function (params, rng) {
  const mode = params.mode || 'distribute';

  if (mode === 'addSub') {
    const a1 = nzInt(rng, 1, 9), b1 = nzInt(rng, 1, 9);
    const a2 = nzInt(rng, 1, 9), b2 = nzInt(rng, 1, 9);
    const op = pick(rng, ['+', '-']);
    const cx = op === '+' ? a1 + a2 : a1 - a2;
    const cc = op === '+' ? b1 + b2 : b1 - b2;
    const answer = [cx, cc];
    const rhs = `(${coefLead(a2)}x ${wrapPlus(b2)})`;
    return {
      prompt: { ko: `문자와 차수가 같은 항(동류항)끼리만 더하거나 빼요`,
        en: `Add or subtract only like terms (same letter, same degree)`,
        zh: `只把文字和次数相同的项(同类项)相加或相减` },
      tex: `(${coefLead(a1)}x ${wrapPlus(b1)}) ${op} ${rhs} = \\square x + \\square`,
      answer, answerType: 'number', widget: 'numpad', negative: hasNeg(answer),
      solution: [
        { tex: `${a1} ${op} ${a2} = \\square`, blank: cx },
        { tex: `${b1} ${op} ${b2} = \\square`, blank: cc },
        { tex: `(${coefLead(a1)}x ${wrapPlus(b1)}) ${op} ${rhs} = \\square x + \\square`, blank: answer }
      ]
    };
  }

  if (mode === 'mixed') {
    const k = nzInt(rng, 1, 5);
    const a1 = nzInt(rng, 1, 6), b1 = nzInt(rng, 1, 8);
    const a2 = nzInt(rng, 1, 6), b2 = nzInt(rng, 1, 8);
    const cx = k * a1 - a2;
    const cc = k * b1 - b2;
    const answer = [cx, cc];
    return {
      prompt: { ko: `괄호를 먼저 분배법칙으로 풀고, 그 다음 동류항끼리 정리해요`,
        en: `First expand the parentheses with the distributive law, then combine like terms`,
        zh: `先用分配律展开括号，再合并同类项` },
      tex: `${k}(${coefLead(a1)}x ${wrapPlus(b1)}) - (${coefLead(a2)}x ${wrapPlus(b2)}) = \\square x + \\square`,
      answer, answerType: 'number', widget: 'numpad', negative: hasNeg(answer),
      solution: [
        { tex: `${k} \\times ${a1} = \\square`, blank: k * a1 },
        { tex: `${k} \\times ${b1} = \\square`, blank: k * b1 },
        { tex: `${k * a1} - ${a2} = \\square,\\quad ${k * b1} - ${b2} = \\square`, blank: answer }
      ]
    };
  }

  /* distribute(기본) */
  const k = nzInt(rng, 1, params.wide ? 9 : 6);
  const a = nzInt(rng, 1, 8), b = nzInt(rng, 1, 8);
  const answer = [k * a, k * b];
  return {
    prompt: { ko: `괄호 앞의 수를 괄호 안 모든 항에 하나씩 곱해요(분배법칙)`,
      en: `Multiply the number in front of the parentheses by every term inside (distributive law)`,
      zh: `把括号前的数分别乘到括号里每一项(分配律)` },
    tex: `${k}(${coefLead(a)}x ${wrapPlus(b)}) = \\square x + \\square`,
    answer, answerType: 'number', widget: 'numpad', negative: hasNeg(answer),
    solution: [
      { tex: `${k} \\times ${a} = \\square`, blank: k * a },
      { tex: `${k} \\times ${b} = \\square`, blank: k * b },
      { tex: `${k}(${coefLead(a)}x ${wrapPlus(b)}) = \\square x + \\square`, blank: answer }
    ]
  };
};

/* ── MD50 — 일차방정식 풀이 ── x(답)를 먼저 고르고 남은 상수를
   역산해 항상 정수해. mode: 'oneStep'(ax=c) · 'twoStep'(ax+b=c) ·
   'bothSides'(ax+b=cx+d, 양변에 미지수, 실전). */
NM_TGEN['md50_linearEquation'] = function (params, rng) {
  const mode = params.mode || 'oneStep';

  if (mode === 'bothSides') {
    const x = nzInt(rng, 1, params.wide ? 9 : 6);
    let a = nzInt(rng, 1, 6), c = nzInt(rng, 1, 6);
    while (c === a) c = nzInt(rng, 1, 6);
    const d = nzInt(rng, 1, 9);
    const b = (c - a) * x + d; /* ax+b=cx+d ⟺ b-d=(c-a)x */
    return {
      prompt: { ko: `양변에 x가 있으면 x항은 한쪽으로, 상수항은 다른 쪽으로 이항해요`,
        en: `When x appears on both sides, move the x-terms to one side and the constants to the other`,
        zh: `两边都有x时，把x项移到一边，常数项移到另一边` },
      tex: `${coefLead(a)}x ${wrapPlus(b)} = ${coefLead(c)}x ${wrapPlus(d)} \\;\\Rightarrow\\; x = \\square`,
      answer: x, answerType: 'number', widget: 'numpad', negative: x < 0,
      solution: [
        { tex: `${b} - ${d} = \\square`, blank: b - d },
        { tex: `${c} - ${a} = \\square`, blank: c - a },
        { tex: `\\dfrac{${b - d}}{${c - a}} = \\square`, blank: x }
      ]
    };
  }

  if (mode === 'twoStep') {
    const x = nzInt(rng, 1, params.wide ? 12 : 8);
    const a = nzInt(rng, 1, params.wide ? 9 : 6);
    const b = nzInt(rng, 1, 9);
    const c = a * x + b;
    return {
      prompt: { ko: `등식의 성질로 상수항부터 이항하고, 마지막에 x의 계수로 나눠요`,
        en: `Use the properties of equality to move the constant first, then divide by x's coefficient`,
        zh: `先用等式性质移项常数，最后除以x的系数` },
      tex: `${coefLead(a)}x ${wrapPlus(b)} = ${c} \\;\\Rightarrow\\; x = \\square`,
      answer: x, answerType: 'number', widget: 'numpad', negative: x < 0,
      solution: [
        { tex: `${c} - ${b} = \\square`, blank: c - b },
        { tex: `\\dfrac{${c - b}}{${a}} = \\square`, blank: x }
      ]
    };
  }

  /* oneStep(기본) */
  const x = nzInt(rng, 1, params.wide ? 12 : 9);
  const a = R(rng, 2, params.wide ? 9 : 6);
  const c = a * x;
  return {
    prompt: { ko: `양변을 x의 계수로 나누면 x만 남아요`,
      en: `Divide both sides by x's coefficient to isolate x`,
      zh: `两边除以x的系数，只留下x` },
    tex: `${a}x = ${c} \\;\\Rightarrow\\; x = \\square`,
    answer: x, answerType: 'number', widget: 'numpad', negative: x < 0,
    solution: [
      { tex: `${a}x = ${c} \\;\\Rightarrow\\; x = ${c} \\div ${a}` },
      { tex: `${c} \\div ${a} = \\square`, blank: x }
    ]
  };
};

/* ── MD51 — 정비례와 반비례 값 ── y=ax(정비례)는 비율이 일정, y=a/x
   (반비례)는 곱이 일정. 반비례는 나눗셈 대신 a의 약수 중에서 x를
   고른다. mode: 'direct'(정비례, 새 x에서 y) · 'inverse'(반비례,
   약수에서 x 선택) · 'mixed'(둘 중 하나, 더 큰 범위, 실전). */
NM_TGEN['md51_proportion'] = function (params, rng) {
  const mode = params.mode || 'direct';

  function inverseCase(wide){
    const x0 = R(rng, 2, wide ? 12 : 8);
    const y0 = nzInt(rng, 1, wide ? 9 : 6);
    const a = x0 * y0; /* 반비례 상수 = 두 좌표의 곱, 항상 정수 */
    const divs = divisorsOf(a).filter(d => d !== x0);
    const x1 = divs.length ? pick(rng, divs) : x0;
    const y1 = a / x1; /* x1은 a의 약수이므로 나눗셈이 항상 정수로 떨어짐 */
    return {
      prompt: { ko: `반비례 y=a/x는 x와 y의 곱이 항상 일정해요(a) — 점(${x0},${y0})으로 a를 구하고, x=${x1}일 때 y를 구해요`,
        en: `Inverse proportion y=a/x keeps the product of x and y constant(a) — find a from the point (${x0},${y0}), then find y when x=${x1}`,
        zh: `反比例y=a/x中x与y的乘积恒为a——用点(${x0},${y0})求出a，再求x=${x1}时的y` },
      tex: `y=\\dfrac{a}{x},\\;(${x0},\\,${y0})\\text{를 지남} \\;\\Rightarrow\\; x=${x1}\\text{일 때 } y=\\square`,
      answer: y1, answerType: 'number', widget: 'numpad', negative: y1 < 0,
      solution: [
        { tex: `${x0} \\times ${y0} = \\square`, blank: a },
        { tex: `${a} \\div ${x1} = \\square`, blank: y1 }
      ]
    };
  }

  function directCase(wide){
    const a = nzInt(rng, 1, wide ? 12 : 9);
    const x0 = nzInt(rng, 1, wide ? 9 : 6);
    const x1 = nzInt(rng, 1, wide ? 9 : 6);
    const y1 = a * x1;
    return {
      prompt: { ko: `정비례 y=ax는 x와 y의 비율(a)이 항상 일정해요 — 비율을 구한 뒤 x=${x1}일 때 y를 구해요`,
        en: `Direct proportion y=ax keeps the ratio(a) of y to x constant — find the ratio, then find y when x=${x1}`,
        zh: `正比例y=ax中y与x的比值(a)恒定——求出比值后，再求x=${x1}时的y` },
      tex: `y=ax,\\;a=${a} \\;\\Rightarrow\\; x=${x1}\\text{일 때 } y=\\square`,
      answer: y1, answerType: 'number', widget: 'numpad', negative: y1 < 0,
      solution: [
        { tex: `y = ${a}x` },
        { tex: `${a} \\times ${x1} = \\square`, blank: y1 }
      ]
    };
  }

  if (mode === 'inverse') return inverseCase(false);
  if (mode === 'mixed') return pick(rng, [true, false]) ? directCase(true) : inverseCase(true);
  return directCase(false);
};

/* ============================================================
   B. 대수 심화(tier:algebra)
   ============================================================ */

/* ── MD52 — 지수방정식 ── x를 먼저 고르고 상수항을 역산 — 밑 통일 후
   지수를 비교하면 선형방정식이 되는 원리. mode: 'sameBaseSimple'
   (p=1, 연습) · 'sameBaseGeneral'(p 가변) · 'unifyBase'(우변이 아직
   밑으로 안 풀린 수 N=a^k, 실전). */
NM_TGEN['md52_expEquation'] = function (params, rng) {
  const mode = params.mode || 'sameBaseSimple';
  const a = R(rng, 2, 9);
  const x = nzInt(rng, 1, params.wide ? 9 : 6);

  if (mode === 'sameBaseGeneral' || mode === 'unifyBase') {
    const p = R(rng, 2, 4);
    const k = R(rng, 1, 8);
    const q = k - p * x;
    if (mode === 'unifyBase') {
      const N = Math.pow(a, k);
      return {
        prompt: { ko: `오른쪽을 먼저 ${a}의 거듭제곱으로 바꾼 뒤(밑 통일), 지수끼리 비교해요`,
          en: `First rewrite the right side as a power of ${a} (unify the base), then compare exponents`,
          zh: `先把右边化成${a}的幂(统一底数)，再比较指数` },
        tex: `${a}^{${p}x ${wrapPlus(q)}} = ${N} \\;\\Rightarrow\\; x = \\square`,
        answer: x, answerType: 'number', widget: 'numpad', negative: x < 0,
        solution: [
          { tex: `${N} = ${a}^{${k}}` },
          { tex: `${k} - (${q}) = \\square`, blank: k - q },
          { tex: `\\dfrac{${k - q}}{${p}} = \\square`, blank: x }
        ]
      };
    }
    return {
      prompt: { ko: `밑이 같으면 지수끼리 등식이 성립해요 — ${p}x${wrapPlus(q)}=${k}를 풀어요`,
        en: `With equal bases, the exponents themselves form an equation — solve ${p}x${wrapPlus(q)}=${k}`,
        zh: `底数相同时，指数本身构成等式——解${p}x${wrapPlus(q)}=${k}` },
      tex: `${a}^{${p}x ${wrapPlus(q)}} = ${a}^{${k}} \\;\\Rightarrow\\; x = \\square`,
      answer: x, answerType: 'number', widget: 'numpad', negative: x < 0,
      solution: [
        { tex: `${k} - (${q}) = \\square`, blank: k - q },
        { tex: `\\dfrac{${k - q}}{${p}} = \\square`, blank: x }
      ]
    };
  }

  /* sameBaseSimple(기본, p=1) */
  const k = R(rng, 1, 9);
  const q = k - x;
  return {
    prompt: { ko: `밑이 같으면 지수끼리 등식이 성립해요 — x${wrapPlus(q)}=${k}를 풀어요`,
      en: `With equal bases, the exponents themselves form an equation — solve x${wrapPlus(q)}=${k}`,
      zh: `底数相同时，指数本身构成等式——解x${wrapPlus(q)}=${k}` },
    tex: `${a}^{x ${wrapPlus(q)}} = ${a}^{${k}} \\;\\Rightarrow\\; x = \\square`,
    answer: x, answerType: 'number', widget: 'numpad', negative: x < 0,
    solution: [
      { tex: `x ${wrapPlus(q)} = ${k}` },
      { tex: `${k} - ${q} = \\square`, blank: x }
    ]
  };
};

/* ── MD53 — 로그방정식 ── log의 정의·성질로 x를 역산. mode:
   'basic'(log_a(px+q)=k) · 'sumEq'(log_a x + log_a c = log_a N) ·
   'wide'(뺄셈 성질, 실전). */
NM_TGEN['md53_logEquation'] = function (params, rng) {
  const mode = params.mode || 'basic';
  const a = R(rng, 2, 6);

  if (mode === 'sumEq') {
    const x = R(rng, 2, params.wide ? 12 : 8);
    const c = R(rng, 2, 6);
    const N = x * c;
    return {
      prompt: { ko: `log_a X + log_a Y = log_a(XY) — 두 로그의 합을 곱셈으로 바꿔서 x를 구해요`,
        en: `log_a X + log_a Y = log_a(XY) — turn the sum of two logs into a product to find x`,
        zh: `log_a X + log_a Y = log_a(XY)——把两个对数之和化成乘积来求x` },
      tex: `\\log_{${a}} x + \\log_{${a}} ${c} = \\log_{${a}} ${N} \\;\\Rightarrow\\; x = \\square`,
      answer: x, answerType: 'number', widget: 'numpad', negative: false,
      solution: [
        { tex: `\\log_{${a}}(x \\times ${c}) = \\log_{${a}} ${N} \\;\\Rightarrow\\; x \\times ${c} = ${N}` },
        { tex: `${N} \\div ${c} = \\square`, blank: x }
      ]
    };
  }

  if (mode === 'wide') {
    const x = R(rng, 1, 10);
    const p = R(rng, 2, 4);
    const c = R(rng, 2, 5);
    const k = R(rng, 1, 3);
    const N = Math.pow(a, k) * c; /* (px+q)/c = a^k ⟺ px+q = c·a^k */
    const q = N - p * x;
    return {
      prompt: { ko: `log_a X - log_a Y = log_a(X÷Y) — 뺄셈을 나눗셈으로 바꾼 뒤, log의 정의(a^k=진수)로 x를 구해요`,
        en: `log_a X - log_a Y = log_a(X÷Y) — turn the subtraction into a quotient, then use the definition (a^k=argument) to find x`,
        zh: `log_a X - log_a Y = log_a(X÷Y)——把减法化成除法，再用对数定义(a^k=真数)求x` },
      tex: `\\log_{${a}}(${p}x ${wrapPlus(q)}) - \\log_{${a}} ${c} = ${k} \\;\\Rightarrow\\; x = \\square`,
      answer: x, answerType: 'number', widget: 'numpad', negative: x < 0,
      solution: [
        { tex: `${a}^{${k}} \\times ${c} = \\square`, blank: N },
        { tex: `${N} - (${q}) = \\square`, blank: N - q },
        { tex: `\\dfrac{${N - q}}{${p}} = \\square`, blank: x }
      ]
    };
  }

  /* basic(기본) — log_a(px+q)=k ⟺ px+q=a^k */
  const x = nzInt(rng, 1, params.wide ? 8 : 5);
  const p = R(rng, 1, 4);
  const k = R(rng, 1, 3);
  const N = Math.pow(a, k);
  const q = N - p * x;
  return {
    prompt: { ko: `log_a N = k는 a^k=N — 진수를 그 값으로 바꾼 뒤 x에 대해 풀어요`,
      en: `log_a N = k means a^k=N — replace the argument with that value, then solve for x`,
      zh: `log_a N = k即a^k=N——把真数换成那个值，再解出x` },
    tex: `\\log_{${a}}(${p}x ${wrapPlus(q)}) = ${k} \\;\\Rightarrow\\; x = \\square`,
    answer: x, answerType: 'number', widget: 'numpad', negative: x < 0,
    solution: [
      { tex: `${N} - (${q}) = \\square`, blank: N - q },
      { tex: `\\dfrac{${N - q}}{${p}} = \\square`, blank: x }
    ]
  };
};

/* ── MD54 — 지수·로그 부등식 ── 밑이 1보다 크면(증가함수) 지수·진수
   비교 방향이 그대로 유지된다. 부등식을 만족하는 "경계값"(등호가
   성립하는 지점)을 정수로 역산해 묻는다. mode: 'expBasic'(p=1,
   연습) · 'expWide'(p 가변) · 'logIneq'(로그 부등식, 실전). */
NM_TGEN['md54_expLogInequality'] = function (params, rng) {
  const mode = params.mode || 'expBasic';
  const a = R(rng, 2, 9);
  const cmp = pick(rng, ['\\ge', '\\le']);
  const x0 = nzInt(rng, 1, params.wide ? 9 : 6); /* 경계값(답) */

  if (mode === 'logIneq') {
    const p = R(rng, 1, 4);
    const k = R(rng, 1, 3);
    const N = Math.pow(a, k);
    const q = N - p * x0;
    return {
      prompt: { ko: `밑(${a})이 1보다 크면 log는 증가함수 — 등호가 성립하는 경계값을 구해요(a^k=진수)`,
        en: `Since the base(${a}) exceeds 1, log is increasing — find the boundary value where equality holds (a^k=argument)`,
        zh: `底数(${a})大于1时log是增函数——求出等号成立的边界值(a^k=真数)` },
      tex: `\\log_{${a}}(${p}x ${wrapPlus(q)}) ${cmp} ${k} \\;\\Rightarrow\\; x ${cmp} \\square`,
      answer: x0, answerType: 'number', widget: 'numpad', negative: x0 < 0,
      solution: [
        { tex: `${N} - (${q}) = \\square`, blank: N - q },
        { tex: `\\dfrac{${N - q}}{${p}} = \\square`, blank: x0 }
      ]
    };
  }

  const p = mode === 'expWide' ? R(rng, 2, 4) : 1;
  const k = R(rng, 1, 9);
  const q = k - p * x0;
  return {
    prompt: { ko: `밑(${a})이 1보다 크면 지수함수는 증가함수 — 등호가 성립하는 경계값을 구해요`,
      en: `Since the base(${a}) exceeds 1, the exponential is increasing — find the boundary value where equality holds`,
      zh: `底数(${a})大于1时指数函数是增函数——求出等号成立的边界值` },
    tex: `${a}^{${p===1?'':p}x ${wrapPlus(q)}} ${cmp} ${a}^{${k}} \\;\\Rightarrow\\; x ${cmp} \\square`,
    answer: x0, answerType: 'number', widget: 'numpad', negative: x0 < 0,
    solution: [
      { tex: `${k} - (${q}) = \\square`, blank: k - q },
      { tex: `\\dfrac{${k - q}}{${p}} = \\square`, blank: x0 }
    ]
  };
};

/* ── MD55 — 사인법칙 ── a/sinA = 2R. 정수 또는 [계수,근호안]으로 딱
   떨어지는 30°·45°·90°만 쓴다(60°는 분수+근호가 겹쳐 제외).
   mode: 'basic'(30°·90°, 정수) · 'root'(45°, [계수,근호안]) ·
   'reverse'(2R→a, 실전). */
NM_TGEN['md55_lawOfSines'] = function (params, rng) {
  const mode = params.mode || 'basic';

  if (mode === 'root' || (mode === 'reverse' && pick(rng, [true, false]))) {
    /* 45° — sinA=√2/2, 2R = a÷(√2/2) = a√2. 범위(2026-08-27, 중복 감사
       대응): 변수 a 하나뿐이라 12~20으로는 20문항에서 36%까지 중복됐다
       (실측) — 크게 넓힌다. */
    const a = R(rng, 2, params.wide ? 90 : 40);
    if (mode === 'root') {
      const answer = [a, 2];
      return {
        prompt: { ko: `사인법칙 a/sinA = 2R — sin45°=√2/2이므로 2R = a÷(√2/2) = a√2`,
          en: `Law of sines a/sinA = 2R — since sin45°=√2/2, 2R = a÷(√2/2) = a√2`,
          zh: `正弦定理a/sinA = 2R——sin45°=√2/2，所以2R = a÷(√2/2) = a√2` },
        tex: `\\dfrac{${a}}{\\sin 45^\\circ} = 2R \\;\\Rightarrow\\; 2R = \\square\\sqrt{\\square}`,
        answer, answerType: 'number', widget: 'numpad', negative: false,
        solution: [
          { tex: `\\sin 45^\\circ = \\dfrac{\\sqrt2}{2}` },
          { tex: `${a} \\div \\dfrac{\\sqrt2}{2} = \\square\\sqrt{\\square}`, blank: answer }
        ]
      };
    }
    /* reverse, 45° 분기 — 2R=2a(짝수)를 주고 변 a=R√2를 구함 */
    const answer = [a, 2];
    return {
      prompt: { ko: `사인법칙을 거꾸로 — a = 2R×sinA. sin45°=√2/2이므로 a = 2R×(√2/2) = R√2`,
        en: `Reversing the law of sines — a = 2R×sinA. Since sin45°=√2/2, a = 2R×(√2/2) = R√2`,
        zh: `反过来用正弦定理——a = 2R×sinA。sin45°=√2/2，所以a = 2R×(√2/2) = R√2` },
      tex: `2R=${2*a},\\;A=45^\\circ \\;\\Rightarrow\\; a = \\square\\sqrt{\\square}`,
      answer, answerType: 'number', widget: 'numpad', negative: false,
      solution: [
        { tex: `\\sin 45^\\circ = \\dfrac{\\sqrt2}{2}` },
        { tex: `${2 * a} \\times \\dfrac{\\sqrt2}{2} = \\square\\sqrt{\\square}`, blank: answer }
      ]
    };
  }

  /* basic 또는 reverse(30°/90° 분기) — 정수 각. 범위(2026-08-27, 중복
     감사 대응): A(2종)·a 조합이 20문항에서 18%까지 중복됐다(실측) —
     a 범위를 크게 넓힌다. */
  const A = pick(rng, [30, 90]);
  const a = R(rng, 2, params.wide ? 90 : 40);
  if (mode === 'reverse') {
    /* 2R을 주고 a를 구함(30°: a=R, 90°: a=2R) */
    const R2 = A === 30 ? 2 * a : a;
    return {
      prompt: { ko: `사인법칙을 거꾸로 — a = 2R×sinA. sin${A}°=${A === 30 ? '1/2' : '1'}이니 계산해요`,
        en: `Reversing the law of sines — a = 2R×sinA. Since sin${A}°=${A === 30 ? '1/2' : '1'}, compute a`,
        zh: `反过来用正弦定理——a = 2R×sinA。sin${A}°=${A === 30 ? '1/2' : '1'}，算出a` },
      tex: `2R=${R2},\\;A=${A}^\\circ \\;\\Rightarrow\\; a = \\square`,
      answer: a, answerType: 'number', widget: 'numpad', negative: false,
      solution: [
        { tex: `\\sin ${A}^\\circ = ${A === 30 ? '\\dfrac{1}{2}' : '1'}` },
        { tex: `${R2} \\times ${A === 30 ? '\\dfrac{1}{2}' : '1'} = \\square`, blank: a }
      ]
    };
  }
  const answer = A === 30 ? 2 * a : a;
  return {
    prompt: { ko: `사인법칙 a/sinA = 2R — sin${A}°=${A === 30 ? '1/2' : '1'}이니 나눗셈이 아니라 곱셈으로 바로 나와요`,
      en: `Law of sines a/sinA = 2R — since sin${A}°=${A === 30 ? '1/2' : '1'}, it comes out by multiplication, not division`,
      zh: `正弦定理a/sinA = 2R——sin${A}°=${A === 30 ? '1/2' : '1'}，用乘法而不是除法就能算出` },
    tex: `\\dfrac{${a}}{\\sin ${A}^\\circ} = 2R \\;\\Rightarrow\\; 2R = \\square`,
    answer, answerType: 'number', widget: 'numpad', negative: false,
    solution: [
      { tex: `\\sin ${A}^\\circ = ${A === 30 ? '\\dfrac{1}{2}' : '1'}` },
      { tex: `${a} \\div ${A === 30 ? '\\dfrac{1}{2}' : '1'} = \\square`, blank: answer }
    ]
  };
};

/* ── MD56 — 코사인법칙 ── a²=b²+c²-2bc·cosA. 특수각만: 90°(cos=0,
   피타고라스 삼조를 매번 생성)·60°(cos=1/2)·120°(cos=-1/2, 두 각은
   정수 삼조가 희소해 전수 탐색으로 미리 구한 표를 쓴다 — 도출:
   b,c∈[2,40], b<c, a=b²+c²∓bc가 완전제곱, a≠b,a≠c). mode:
   'right'(90°, 연습) · 'sixty'(60°) · 'oneTwenty'(120°, 실전). */
/* 범위(2026-08-27, 중복 감사 대응): 최초 20개(b,c∈[2,40])로는 20문항
   학습지에서 22~49%까지 중복됐다(실측) — 탐색 범위를 b,c∈[2,90](60°)·
   [2,150](120°)로 넓혀 60개·98개로 늘렸다(같은 방식으로 전수 탐색,
   도출 스크립트는 이 파일 상단 주석 참조). */
const SIXTY_TRIPLES = [
  [3,8,7],[5,8,7],[5,21,19],[6,16,14],[7,15,13],[7,40,37],[8,15,13],[9,24,21],
  [9,65,61],[10,16,14],[10,42,38],[11,35,31],[12,32,28],[13,48,43],[14,30,26],
  [14,80,74],[15,24,21],[15,40,35],[15,63,57],[16,21,19],[16,30,26],[16,55,49],
  [17,80,73],[18,48,42],[20,32,28],[20,84,76],[21,45,39],[21,56,49],[22,70,62],
  [24,35,31],[24,45,39],[24,64,56],[25,40,35],[27,72,63],[28,60,52],[30,48,42],
  [30,80,70],[32,42,38],[32,60,52],[32,77,67],[33,40,37],[33,88,77],[35,48,43],
  [35,56,49],[35,75,65],[39,55,49],[40,64,56],[40,75,65],[42,90,78],[45,72,63],
  [45,77,67],[48,63,57],[48,70,62],[48,90,78],[50,80,70],[55,88,77],[56,65,61],
  [63,80,73],[64,84,76],[66,80,74]
];
const ONE20_TRIPLES = [
  [3,5,7],[5,16,19],[6,10,14],[7,8,13],[7,33,37],[9,15,21],[9,56,61],[10,32,38],
  [11,24,31],[11,85,91],[12,20,28],[13,35,43],[13,120,127],[14,16,26],[14,66,74],
  [15,25,35],[15,48,57],[16,39,49],[17,63,73],[18,30,42],[18,112,122],[19,80,91],
  [20,64,76],[21,24,39],[21,35,49],[21,99,111],[22,48,62],[23,120,133],[24,40,56],
  [24,95,109],[25,80,95],[25,143,157],[26,70,86],[27,45,63],[28,32,52],[28,132,148],
  [30,50,70],[30,96,114],[32,45,67],[32,78,98],[33,55,77],[33,72,93],[34,126,146],
  [35,40,65],[35,112,133],[36,60,84],[39,65,91],[39,105,129],[40,51,79],[40,77,103],
  [40,128,152],[42,48,78],[42,70,98],[44,96,124],[45,75,105],[45,144,171],[48,80,112],
  [48,117,147],[49,56,91],[51,85,119],[52,140,172],[54,90,126],[55,57,97],[55,120,155],
  [56,64,104],[56,115,151],[57,95,133],[60,100,140],[63,72,117],[63,105,147],
  [64,90,134],[65,88,133],[66,110,154],[66,144,186],[69,91,139],[69,115,161],
  [70,80,130],[72,120,168],[75,112,163],[75,125,175],[77,88,143],[78,130,182],
  [80,102,158],[81,135,189],[84,96,156],[84,140,196],[87,145,203],[90,150,210],
  [91,104,169],[96,135,201],[98,112,182],[104,105,181],[105,120,195],[110,114,194],
  [112,128,208],[119,136,221],[119,145,229],[126,144,234]
];
NM_TGEN['md56_lawOfCosines'] = function (params, rng) {
  const mode = params.mode || 'right';

  if (mode === 'sixty' || mode === 'oneTwenty') {
    const table = mode === 'sixty' ? SIXTY_TRIPLES : ONE20_TRIPLES;
    const deg = mode === 'sixty' ? 60 : 120;
    const cosTxt = mode === 'sixty' ? '1/2' : '-1/2';
    let [b, c, a] = pick(rng, table);
    if (pick(rng, [true, false])) { const t = b; b = c; c = t; } /* b,c 순서 변주 */
    return {
      prompt: { ko: `코사인법칙 a²=b²+c²-2bc·cosA — cos${deg}°=${cosTxt}를 대입해 a²을 구한 뒤 제곱근을 취해요`,
        en: `Law of cosines a²=b²+c²-2bc·cosA — substitute cos${deg}°=${cosTxt} to find a², then take the square root`,
        zh: `余弦定理a²=b²+c²-2bc·cosA——代入cos${deg}°=${cosTxt}求出a²，再开平方` },
      tex: `b=${b},\\;c=${c},\\;A=${deg}^\\circ \\;\\Rightarrow\\; a = \\square`,
      answer: a, answerType: 'number', widget: 'numpad', negative: false,
      solution: [
        { tex: `${b}^2 + ${c}^2 = \\square`, blank: b * b + c * c },
        { tex: `${b} \\times ${c} = \\square`, blank: b * c },
        { tex: `\\sqrt{${b * b + c * c} ${deg === 60 ? '-' : '+'} ${b * c}} = \\square`, blank: a }
      ]
    };
  }

  /* right(기본, 90°) — cos90°=0이라 항이 사라져 피타고라스 정리와 같다.
     m>n 서로소·반대 홀짝으로 매번 새 삼조를 만든다(런타임 생성). 범위
     (2026-08-27, 중복 감사 대응): m∈[2,6~8]로는 (m,n) 조합이 20문항
     학습지에서 49%까지 중복됐다(실측) — 크게 넓힌다. */
  let m, n;
  do {
    m = R(rng, 2, params.wide ? 30 : 20);
    n = R(rng, 1, m - 1);
  } while (gcd(m, n) !== 1 || (m - n) % 2 === 0);
  const b = m * m - n * n, c = 2 * m * n, a = m * m + n * n;
  return {
    prompt: { ko: `코사인법칙 a²=b²+c²-2bc·cosA — cos90°=0이라 마지막 항이 사라져요(피타고라스 정리와 같아져요)`,
      en: `Law of cosines a²=b²+c²-2bc·cosA — since cos90°=0, the last term vanishes (this is just the Pythagorean theorem)`,
      zh: `余弦定理a²=b²+c²-2bc·cosA——cos90°=0，最后一项消失(就是勾股定理)` },
    tex: `b=${b},\\;c=${c},\\;A=90^\\circ \\;\\Rightarrow\\; a = \\square`,
    answer: a, answerType: 'number', widget: 'numpad', negative: false,
    solution: [
      { tex: `${b}^2 + ${c}^2 = \\square`, blank: b * b + c * c },
      { tex: `\\sqrt{${b * b + c * c}} = \\square`, blank: a }
    ]
  };
};

/* ── MD57 — 삼각함수의 최대·최소와 주기 ── y=a·sin(bx)+c(또는 cos)의
   최댓값=a+c, 최솟값=c-a(뺄셈뿐이라 항상 정수). 주기=2π/b(sin·cos)
   또는 π/b(tan)는 π의 배수인 기약분수로 받는다(answerShape:
   'fraction' 재사용, MD39·MD36과 같은 계열). mode: 'maxmin'(연습) ·
   'period'(sin·cos 주기) · 'wide'(혼합 + tan 주기, 실전). */
NM_TGEN['md57_trigMaxMinPeriod'] = function (params, rng) {
  const mode = params.mode || 'maxmin';
  const fn = pick(rng, ['sin', 'cos']);

  function maxminCase(wide){
    const a = R(rng, 2, wide ? 15 : 9);
    const b = R(rng, 1, wide ? 6 : 4);
    const c = nzInt(rng, 1, wide ? 12 : 8);
    const answer = [a + c, c - a];
    return {
      prompt: { ko: `y=a\\${fn}(bx)+c의 최댓값은 a+c, 최솟값은 c-a예요(진폭 a가 위아래로 흔들리는 범위)`,
        en: `For y=a·${fn}(bx)+c, the max is a+c and the min is c-a (the amplitude a swings up and down)`,
        zh: `y=a\\${fn}(bx)+c的最大值是a+c，最小值是c-a(振幅a上下摆动的范围)` },
      tex: `y = ${a}\\${fn}(${b}x) ${wrapPlus(c)} \\;\\Rightarrow\\; \\text{최댓값}=\\square,\\;\\text{최솟값}=\\square`,
      answer, answerType: 'number', widget: 'numpad', negative: hasNeg(answer),
      solution: [
        { tex: `${a} + ${c} = \\square \\;(\\text{최댓값})`, blank: a + c },
        { tex: `${c} - ${a} = \\square \\;(\\text{최솟값})`, blank: c - a },
        { tex: `\\text{최댓값}=\\square,\\;\\text{최솟값}=\\square`, blank: answer }
      ]
    };
  }
  function periodCase(wide){
    /* 범위(2026-08-27, 중복 감사 대응): b·fn 조합이 6~9×2뿐이라 20문항
       에서 51%까지 중복됐다(실측) — 크게 넓힌다. */
    const b = R(rng, 1, wide ? 60 : 24);
    const g = gcd(2, b);
    const answer = [2 / g, b / g];
    return {
      prompt: { ko: `y=\\${fn}(bx)의 주기는 2π÷b예요 — π의 몇 배인지 기약분수로 나타내요`,
        en: `The period of y=${fn}(bx) is 2π÷b — express it as a reduced fraction times π`,
        zh: `y=\\${fn}(bx)的周期是2π÷b——用最简分数表示是π的几倍` },
      tex: `y = \\${fn}(${b}x) \\;\\Rightarrow\\; \\text{주기} = \\dfrac{\\square}{\\square}\\pi`,
      answer, answerShape: 'fraction', answerType: 'number', widget: 'numpad', negative: false,
      solution: [
        { tex: `\\text{주기} = \\dfrac{2}{${b}}\\pi` },
        { tex: `\\dfrac{2}{${b}} = \\dfrac{\\square}{\\square}`, blank: answer }
      ]
    };
  }
  function tanPeriodCase(){
    const b = R(rng, 1, 40); /* 범위 확장(2026-08-27, 중복 감사 대응) */
    const answer = [1, b];
    return {
      prompt: { ko: `y=\\tan(bx)의 주기는 π÷b예요(sin·cos의 절반 규칙과 다르니 주의!)`,
        en: `The period of y=tan(bx) is π÷b (different from the sin/cos rule — watch out!)`,
        zh: `y=\\tan(bx)的周期是π÷b(和sin·cos的规则不同，要小心！)` },
      tex: `y = \\tan(${b}x) \\;\\Rightarrow\\; \\text{주기} = \\dfrac{\\square}{\\square}\\pi`,
      answer, answerShape: 'fraction', answerType: 'number', widget: 'numpad', negative: false,
      solution: [
        { tex: `y=\\tan(${b}x) \\;\\Rightarrow\\; \\text{주기}=\\dfrac{\\pi}{${b}}` },
        { tex: `\\dfrac{\\pi}{${b}} = \\dfrac{\\square}{\\square}\\pi`, blank: answer }
      ]
    };
  }

  /* params.wide는 threads.js M-57 level2에서 실제로 true를 넘긴다 —
     여기서 무시하고 항상 false를 넘기면 넓힌 범위가 죽는 버그였다
     (2026-08-27, 중복 감사 대응 중 발견·수정). */
  if (mode === 'period') return periodCase(!!params.wide);
  if (mode === 'wide') {
    const choice = pick(rng, ['maxmin', 'period', 'tan']);
    if (choice === 'maxmin') return maxminCase(true);
    if (choice === 'tan') return tanPeriodCase();
    return periodCase(true);
  }
  return maxminCase(!!params.wide);
};

/* ============================================================
   C. 미적분Ⅰ 심화(tier:calculus1)
   ============================================================ */

/* ── MD58 — 0/0 유리화형 극한 ── a+p=m²이 되도록 p를 역산해 두면
   √(x+p)가 x=a에서 정확히 m. 분모에 근호가 있으면 유리화 후 남는
   값이 항상 정수(2m), 분자에 있으면 1/(2m)로 딱 떨어진다
   (answerShape:'fraction'). mode: 'denomRoot'(분모 근호, 정수, 연습)
   · 'numRoot'(분자 근호, 분수) · 'wide'(혼합+더 큰 범위, 실전). */
NM_TGEN['md58_limitRationalize'] = function (params, rng) {
  const mode = params.mode || 'denomRoot';
  const wide = mode === 'wide';
  /* 범위(2026-08-27, 중복 감사 대응): m·a 조합이 6×4=24까지밖에 안 돼
     20문항에서 17~18% 중복이 나왔다 — 넓힌다. */
  const m = R(rng, 1, wide ? 14 : 12);
  const a = nzInt(rng, 1, wide ? 10 : 9);
  const p = m * m - a; /* a+p=m² */

  function denomCase(){
    const answer = 2 * m;
    return {
      prompt: { ko: `분모의 근호를 없애려면 켤레(√(x+p)+${m})를 분모·분자에 곱해요 — 그러면 (x-a)가 약분돼요`,
        en: `To clear the root in the denominator, multiply top and bottom by the conjugate (√(x+p)+${m}) — then (x-a) cancels`,
        zh: `要去掉分母的根号，就把分子分母都乘以共轭式(√(x+p)+${m})——这样(x-a)就能约掉` },
      tex: `\\lim_{x\\to ${a}} \\dfrac{x ${wrapPlus(-a)}}{\\sqrt{x ${wrapPlus(p)}} - ${m}} = \\square`,
      answer, answerType: 'number', widget: 'numpad', negative: false,
      solution: [
        { tex: `\\sqrt{${a} ${wrapPlus(p)}} = \\sqrt{${m * m}} = ${m}` },
        { tex: `${m} + ${m} = \\square`, blank: answer }
      ]
    };
  }
  function numCase(){
    const answer = [1, 2 * m];
    return {
      prompt: { ko: `분자의 근호를 없애려면 켤레(√(x+p)+${m})를 분모·분자에 곱해요 — 분자가 (x-a)로 약분되고 분모에 근호값이 남아요`,
        en: `To clear the root in the numerator, multiply top and bottom by the conjugate (√(x+p)+${m}) — the numerator cancels to (x-a), leaving the root's value below`,
        zh: `要去掉分子的根号，就把分子分母都乘以共轭式(√(x+p)+${m})——分子约成(x-a)，根号的值留在分母` },
      tex: `\\lim_{x\\to ${a}} \\dfrac{\\sqrt{x ${wrapPlus(p)}} - ${m}}{x ${wrapPlus(-a)}} = \\dfrac{\\square}{\\square}`,
      answer, answerShape: 'fraction', answerType: 'number', widget: 'numpad', negative: false,
      solution: [
        { tex: `\\sqrt{${a} ${wrapPlus(p)}} = \\sqrt{${m * m}} = ${m}` },
        { tex: `\\dfrac{1}{${m}+${m}} = \\dfrac{\\square}{\\square}`, blank: answer }
      ]
    };
  }

  if (mode === 'numRoot') return numCase();
  if (wide) return pick(rng, [true, false]) ? denomCase() : numCase();
  return denomCase();
};

/* ── MD59 — 연속조건 상수 결정 ── 극한값 자체를 k로 두면 연속조건이
   항등적으로 성립 — 뺄셈·곱셈뿐. mode: 'basic'((x²-a²)/(x-a) 꼴) ·
   'quadraticPiece'(일반 인수분해형) · 'twoPiece'(구간별 일차함수 경계
   맞추기, 실전). */
NM_TGEN['md59_continuityConstant'] = function (params, rng) {
  const mode = params.mode || 'basic';

  if (mode === 'twoPiece') {
    const a1 = nzInt(rng, 1, 6), a2 = nzInt(rng, 1, 6);
    const e = nzInt(rng, 1, 9);
    const c = nzInt(rng, 1, params.wide ? 9 : 6);
    const b = a2 * c + e - a1 * c; /* a1c+b = a2c+e */
    return {
      prompt: { ko: `x=c에서 두 조각이 이어지려면 왼쪽 식과 오른쪽 식에 x=c를 넣은 값이 같아야 해요`,
        en: `For the two pieces to meet at x=c, plugging x=c into the left and right expressions must give the same value`,
        zh: `两段函数在x=c处相接，需要把x=c代入左右两式得到相同的值` },
      tex: `f(x)=\\begin{cases}${coefLead(a1)}x + b & (x<${c}) \\\\ ${coefLead(a2)}x ${wrapPlus(e)} & (x\\ge ${c})\\end{cases}\\text{, 연속} \\;\\Rightarrow\\; b=\\square`,
      answer: b, answerType: 'number', widget: 'numpad', negative: b < 0,
      solution: [
        { tex: `${a2} \\times ${c} ${wrapPlus(e)} = \\square`, blank: a2 * c + e },
        { tex: `${a1} \\times ${c} = \\square`, blank: a1 * c },
        { tex: `${a2 * c + e} - ${a1 * c} = \\square`, blank: b }
      ]
    };
  }

  if (mode === 'quadraticPiece') {
    const a = nzInt(rng, 1, params.wide ? 9 : 6);
    let d = nzInt(rng, 1, params.wide ? 9 : 6);
    while (d === a) d = nzInt(rng, 1, params.wide ? 9 : 6);
    const b1 = -(a + d), b0 = a * d; /* x²+b1x+b0=(x-a)(x-d) */
    const k = a - d;
    return {
      prompt: { ko: `f(x)가 x=${a}에서 연속이려면 k는 그 자리의 극한값과 같아야 해요 — 분자를 인수분해해서 약분해요`,
        en: `For f(x) to be continuous at x=${a}, k must equal the limit there — factor the numerator and cancel`,
        zh: `f(x)在x=${a}处连续，k必须等于那里的极限值——把分子因式分解后约分` },
      tex: `f(x)=\\begin{cases}\\dfrac{x^2 ${wrapPlusCoef(b1)}x ${wrapPlus(b0)}}{x ${wrapPlus(-a)}} & (x\\ne ${a}) \\\\ k & (x=${a})\\end{cases} \\;\\Rightarrow\\; k=\\square`,
      answer: k, answerType: 'number', widget: 'numpad', negative: k < 0,
      solution: [
        { tex: `\\dfrac{(x-${a})(x-${d})}{x-${a}} = x-${d}` },
        { tex: `${a} - ${d} = \\square`, blank: k }
      ]
    };
  }

  /* basic(기본) — (x²-a²)/(x-a) = x+a, x=a에서 극한값 2a. 범위(2026-08-27,
     중복 감사 대응): 변수가 a 하나뿐인 조합공간이라 6~9로는 20문항에서
     37%까지 중복됐다(실측) — 크게 넓힌다. */
  const a = nzInt(rng, 1, params.wide ? 60 : 40);
  const k = 2 * a;
  return {
    prompt: { ko: `f(x)가 x=${a}에서 연속이려면 k는 그 자리의 극한값과 같아야 해요 — (x²-a²)=(x-a)(x+a)로 약분해요`,
      en: `For f(x) to be continuous at x=${a}, k must equal the limit there — cancel using (x²-a²)=(x-a)(x+a)`,
      zh: `f(x)在x=${a}处连续，k必须等于那里的极限值——用(x²-a²)=(x-a)(x+a)约分` },
    tex: `f(x)=\\begin{cases}\\dfrac{x^2-${a * a}}{x ${wrapPlus(-a)}} & (x\\ne ${a}) \\\\ k & (x=${a})\\end{cases} \\;\\Rightarrow\\; k=\\square`,
    answer: k, answerType: 'number', widget: 'numpad', negative: k < 0,
    solution: [
      { tex: `\\dfrac{(x-${a})(x+${a})}{x-${a}} = x+${a}` },
      { tex: `${a} + ${a} = \\square`, blank: k }
    ]
  };
};

/* ── MD60 — 극값(극대·극소) ── f(x)=kx³+a2x²+a1x+a0, f'(x)=3k(x-r1)
   (x-r2)가 되도록 r1+r2를 짝수로 골라 2로 나눈 몫이 정수가 되게
   만든다(k>0이면 x=r1이 극대, x=r2가 극소, r1<r2). mode: 'points'
   (극값을 갖는 x좌표, [r1,r2]) · 'values'(극댓값·극솟값, [max,min]) ·
   'wide'(더 큰 범위 + k 가변, 실전). */
NM_TGEN['md60_extrema'] = function (params, rng) {
  const mode = params.mode || 'points';
  const wide = mode === 'wide';
  const k = wide ? R(rng, 1, 2) : 1;
  let r1 = nzInt(rng, 1, wide ? 6 : 4), r2 = nzInt(rng, 1, wide ? 6 : 4);
  while (r2 === r1 || (r1 + r2) % 2 !== 0) r2 = nzInt(rng, 1, wide ? 6 : 4);
  if (r1 > r2) { const t = r1; r1 = r2; r2 = t; }
  const a2 = -3 * k * (r1 + r2) / 2;
  const a1 = 3 * k * r1 * r2;
  const a0 = nzInt(rng, 1, wide ? 9 : 6);
  const f = x => k * x * x * x + a2 * x * x + a1 * x + a0;

  if (mode === 'points') {
    const answer = [r1, r2];
    return {
      prompt: { ko: `f'(x)=0이 되는 x를 구하면 극값을 갖는 자리가 나와요(부호가 +에서 -로 바뀌면 극대, -에서 +로 바뀌면 극소)`,
        en: `Solving f'(x)=0 gives the x-values with extrema (sign + to - is a local max, - to + is a local min)`,
        zh: `解f'(x)=0就能得到取极值的x(符号由+变-是极大，由-变+是极小)` },
      tex: `f(x)=${coefLead(k)}x^3 ${wrapPlusCoef(a2)}x^2 ${wrapPlusCoef(a1)}x ${wrapPlus(a0)} \\;\\Rightarrow\\; f'(x)=0\\text{의 해}: x=\\square,\\;\\square`,
      answer, answerType: 'number', widget: 'numpad', negative: hasNeg(answer),
      solution: [
        { tex: `\\dfrac{-2\\times(${a2})}{3\\times ${k}} = \\square \\;(r_1+r_2)`, blank: r1 + r2 },
        { tex: `\\dfrac{${a1}}{3\\times ${k}} = \\square \\;(r_1\\times r_2)`, blank: r1 * r2 },
        { tex: `x^2 - (${r1 + r2})x + ${r1 * r2} = 0 \\;\\Rightarrow\\; x=\\square,\\;\\square`, blank: answer }
      ]
    };
  }

  /* values 또는 wide — 극댓값 f(r1), 극솟값 f(r2) */
  const answer = [f(r1), f(r2)];
  return {
    prompt: { ko: `f'(x)=0인 x를 구한 뒤, 그 x를 원래 함수 f(x)에 대입하면 극댓값·극솟값이 나와요`,
      en: `Find the x where f'(x)=0, then substitute it back into f(x) to get the local max and min values`,
      zh: `求出f'(x)=0的x后，代回原函数f(x)就能得到极大值·极小值` },
    tex: `f(x)=${coefLead(k)}x^3 ${wrapPlusCoef(a2)}x^2 ${wrapPlusCoef(a1)}x ${wrapPlus(a0)} \\;\\Rightarrow\\; \\text{극댓값}=\\square,\\;\\text{극솟값}=\\square`,
    answer, answerType: 'number', widget: 'numpad', negative: hasNeg(answer),
    solution: [
      { tex: `f'(x)=0 \\;\\Rightarrow\\; x=${r1},\\;${r2}` },
      { tex: `f(${r1})=\\square,\\;f(${r2})=\\square`, blank: answer }
    ]
  };
};

/* ── MD61 — 곡선과 x축 사이의 넓이 ── f(x)=-s(x-p)(x-q)(s=6k)는
   [p,q]에서 항상 0 이상이고, 원시함수 F(x)=-2kx³+3k(p+q)x²-6kpqx는
   계수가 전부 정수(§7 "배수로 역산"). 넓이=F(q)-F(p). mode: 'basic'
   (연습) · 'wide'(음수 p 포함) · 'wider'(더 큰 범위, 실전). */
NM_TGEN['md61_areaUnderCurve'] = function (params, rng) {
  const mode = params.mode || 'basic';
  /* 범위(2026-08-27, 중복 감사 대응): 애초 범위(4~7)는 20문항 학습지에서
     조합이 금방 바닥나 중복률이 54%까지 치솟았다(실측) — p·q 두 정수뿐인
     조합공간이라 range를 크게 넓혀야 한다. */
  const range = mode === 'wider' ? 18 : mode === 'wide' ? 14 : 13;
  /* p를 고른 뒤 양의 간격을 더해 q를 만든다(q>p가 항상, 재시도 없이
     구조적으로 보장됨 — 위 끝값에서 리트라이가 못 끝나던 버그 수정).
     p+q=0(계수 B가 0이 되어 "+0x"로 어색해 보이는 것)만 드물게
     재시도한다(경우의 수가 많아 즉시 끝난다). */
  let p, q;
  if (mode === 'basic') {
    p = R(rng, 1, range - 1);
    q = p + R(rng, 1, range - p);
  } else {
    p = nzInt(rng, 1, range);
    q = p + R(rng, 1, range);
    while (p + q === 0) q = p + R(rng, 1, range);
  }
  const k = R(rng, 1, mode === 'wider' ? 3 : 2);
  /* f(x) = -6k(x-p)(x-q) = -6k x² + 6k(p+q) x - 6k p q */
  const A = -6 * k, B = 6 * k * (p + q), C = -6 * k * p * q;
  const F = x => (-2 * k) * x * x * x + (3 * k * (p + q)) * x * x + (-6 * k * p * q) * x;
  const answer = F(q) - F(p);
  return {
    prompt: { ko: `곡선과 x축 사이의 넓이는 두 교점을 적분 구간으로 삼은 정적분값이에요 — 원시함수를 구해서 F(q)-F(p)를 계산해요`,
      en: `The area between the curve and the x-axis is the definite integral over the interval between the two intersection points — find the antiderivative, then compute F(q)-F(p)`,
      zh: `曲线与x轴之间的面积，就是以两个交点为区间的定积分——求出原函数后计算F(q)-F(p)` },
    tex: `f(x) = ${coefLead(A)}x^2 ${wrapPlusCoef(B)}x ${wrapPlus(C)} \\;\\Rightarrow\\; \\int_{${p}}^{${q}} f(x)\\,dx = \\square`,
    answer, answerType: 'number', widget: 'numpad', negative: false,
    solution: [
      { tex: `F(${q}) = \\square`, blank: F(q) },
      { tex: `F(${p}) = \\square`, blank: F(p) },
      { tex: `${F(q)} - ${F(p)} = \\square`, blank: answer }
    ]
  };
};

/* ── MD62 — 속도와 거리 활용 ── 위치함수 s(t)의 계수를 짝수·3의
   배수로 미리 정해 미분·적분이 나눗셈 없이 정수. mode: 'velocity'
   (위치→속도, s'(t0)) · 'distance'(속도→거리, ∫[0,T]v(t)dt) ·
   'wide'(구간 [t1,t2], 실전). */
NM_TGEN['md62_velocityDistance'] = function (params, rng) {
  const mode = params.mode || 'velocity';

  if (mode === 'distance' || mode === 'wide') {
    if (mode === 'wide') {
      /* v(t)=3k t²+2j t+e(모두 0 이상 → v(t)≥0), 거리=S(t2)-S(t1) */
      const k = R(rng, 1, 3), j = R(rng, 1, 6), e = R(rng, 1, 9);
      const a = 3 * k, b = 2 * j;
      const t1 = R(rng, 0, 4);
      let t2 = R(rng, 1, 7);
      while (t2 <= t1) t2 = R(rng, 1, 7);
      const S = t => k * t * t * t + j * t * t + e * t;
      const answer = S(t2) - S(t1);
      return {
        prompt: { ko: `이동 거리는 속도 v(t)를 적분한 값이에요(v(t)가 항상 0 이상이면 거리=이동한 위치 변화량) — 원시함수를 구해 S(t2)-S(t1)을 계산해요`,
          en: `Distance traveled is the integral of velocity v(t) (when v(t)≥0 throughout, distance equals the change in position) — find the antiderivative, then compute S(t2)-S(t1)`,
          zh: `移动距离是速度v(t)的积分(当v(t)始终≥0时，距离等于位置变化量)——求出原函数后计算S(t2)-S(t1)` },
        tex: `v(t) = ${coefLead(a)}t^2 ${wrapPlusCoef(b)}t ${wrapPlus(e)} \\;\\Rightarrow\\; \\int_{${t1}}^{${t2}} v(t)\\,dt = \\square`,
        answer, answerType: 'number', widget: 'numpad', negative: false,
        solution: [
          { tex: `S(${t2}) = \\square`, blank: S(t2) },
          { tex: `S(${t1}) = \\square`, blank: S(t1) },
          { tex: `${S(t2)} - ${S(t1)} = \\square`, blank: answer }
        ]
      };
    }
    /* distance(기본) — v(t)=at+b(a=2k), 거리=∫[0,T]v(t)dt=S(T) */
    const k = R(rng, 1, 6), b = R(rng, 1, 9);
    const a = 2 * k;
    const T = R(rng, 1, params.wide ? 9 : 6);
    const answer = k * T * T + b * T;
    return {
      prompt: { ko: `이동 거리는 속도 v(t)를 0부터 T까지 적분한 값이에요 — 원시함수 S(t)를 구해 S(T)-S(0)을 계산해요`,
        en: `Distance traveled is the integral of velocity v(t) from 0 to T — find the antiderivative S(t), then compute S(T)-S(0)`,
        zh: `移动距离是速度v(t)从0到T的积分——求出原函数S(t)后计算S(T)-S(0)` },
      tex: `v(t) = ${coefLead(a)}t ${wrapPlus(b)} \\;\\Rightarrow\\; \\int_{0}^{${T}} v(t)\\,dt = \\square`,
      answer, answerType: 'number', widget: 'numpad', negative: false,
      solution: [
        { tex: `${k} \\times ${T}^2 = \\square`, blank: k * T * T },
        { tex: `${b} \\times ${T} = \\square`, blank: b * T },
        { tex: `${k * T * T} + ${b * T} = \\square`, blank: answer }
      ]
    };
  }

  /* velocity(기본) — s(t)=at²+bt, 속도 v(t)=2at+b, v(t0) 계산 */
  const a = nzInt(rng, 1, params.wide ? 8 : 5), b = nzInt(rng, 1, params.wide ? 9 : 6);
  const t0 = R(rng, 1, params.wide ? 8 : 5);
  const answer = 2 * a * t0 + b;
  return {
    prompt: { ko: `속도는 위치함수 s(t)를 미분한 s'(t) — s'(t)를 구한 뒤 t=${t0}을 대입해요`,
      en: `Velocity is the derivative s'(t) of the position function s(t) — find s'(t), then substitute t=${t0}`,
      zh: `速度是位置函数s(t)的导数s'(t)——求出s'(t)后代入t=${t0}` },
    tex: `s(t) = ${coefLead(a)}t^2 ${wrapPlusCoef(b)}t \\;\\Rightarrow\\; s'(${t0}) = \\square`,
    answer, answerType: 'number', widget: 'numpad', negative: answer < 0,
    solution: [
      { tex: `s'(t) = ${2 * a}t ${wrapPlus(b)}` },
      { tex: `${2 * a}\\times ${t0} ${wrapPlus(b)} = \\square`, blank: answer }
    ]
  };
};

if (typeof module !== 'undefined' && module.exports) module.exports = NM_TGEN;
})();
