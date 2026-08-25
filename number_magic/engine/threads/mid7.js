/* ============================================================
   Numbers of Magic — MD43~46(고등 W14 · 미적분Ⅰ) 스레드 생성기.
   근거: MASTER-ROADMAP.md §6(W14 미적분Ⅰ) — 2022 개정 교육과정
   '미적분Ⅰ' 과목 '함수의 극한과 연속'·'다항함수의 미분법'·'다항함수의
   적분법' 성취기준 범위의 표준 연산 유형을 자체 설계(교재 원문 없음).
   연속 조건 상수 결정·극값·넓이는 이번 범위에서 제외(작업지시 — 극한
   계산·미분계수/도함수·접선의 기울기·다항 적분 4종만).
   engine/threads/mid6.js(W13, MD36~42)에 이어지는 번호. 계약:
   NM_TGEN[genKey] = function(params, rng) { ... }, Math.random() 금지.

   답 환원 원칙 — 극한·미분·적분의 답이 항상 정수가 되도록 역설계:
   - 극한(MD43) 'directSub': 다항식 계수를 forward로 골라 그대로 대입.
     'factorCancel': 분자를 (x-a)(x-c) 형태로 역산해 만들어 약분 후
     남는 값(a-c)이 항상 정수(나눗셈 자체가 없다 — 애초에 정수 인수
     둘을 곱해서 분자를 만든다).
   - 미분계수·도함수(MD44) 'polyPrime': axⁿ의 도함수 naxⁿ⁻¹을 그대로
     계산 — 정수 계수에 정수를 곱하므로 항상 정수. 'evalPrime': f'(x)
     계산 후 정수 x를 대입 — 곱셈·덧셈뿐이라 항상 정수.
   - 접선(MD45): m=f'(x₀), n=f(x₀)-m·x₀ — 전부 정수 연산(곱셈·뺄셈)뿐.
   - 적분(MD46) 'antiderivative': f(x)의 계수를 (n+1)의 배수로 역산해
     (a=(n+1)k) 몫 a/(n+1)=k가 항상 정수가 되도록 만든다(나눗셈이
     아니라 애초에 배수로 구성). 'definiteInt': 그렇게 만든 정수계수
     원시함수 F(x)에 정수 p,q를 대입해 F(q)-F(p)를 직접 계산(뺄셈뿐).
   이 네 유형이 "답 환원 원칙의 마지막 시험대"(작업지시) — 나눗셈이
   필요한 자리는 전부 "나눗셈이 아니라 배수로 역산"하는 방식으로
   피해서, 검증 하네스가 다항식을 수치 미분·적분과 대조해도 항상
   정수/유한소수로 떨어진다.

   기호 전환 교육(§13) — lim(MD43)·f′,d/dx(MD44)·∫(MD46)이 처음
   등장한다. 세 생성기 모두 mode:'decode'를 갖고, 유닛 practice
   (discover보다 먼저 나오는 첫 단계)에서만 쓴다 — 완성된 식을 그대로
   보여주고 "화살표 오른쪽 값"·"괄호 안의 수"·"적분 구간의 끝/시작"처럼
   계산 없이 표기 자체를 읽게 한다. threads.js에 등록하는 1~3레벨은
   전부 실제 계산 모드다.
   ============================================================ */
(function(){
'use strict';

const { R, pick } = NM_RNG;

/* ── 공용 헬퍼(mid4~6과 동일 계열, 파일별 독립 정의 관례) ── */
function nzInt(rng, lo, hi){ return R(rng, lo, hi) * pick(rng, [1, -1]); }
function wrapPlus(n){ return n < 0 ? `- ${Math.abs(n)}` : `+ ${n}`; }
/* 변수 항 전용 — 계수 ±1은 숫자를 감춰 '1x²' 노출 방지 */
function coefLead(n){ return n===1?'':n===-1?'-':String(n); }
function wrapPlusCoef(n){ return n===1?'+ ':n===-1?'- ':(n<0?`- ${Math.abs(n)}`:`+ ${n}`); }
function hasNeg(v){ return Array.isArray(v) ? v.some(x => x < 0) : v < 0; }

/* ── MD43 — 함수의 극한값 계산 ── mode: 'directSub'(다항식 대입형) ·
   'factorCancel'(0/0꼴 인수분해·약분, 기본) · 'decode'(§13 — x가
   가까워지는 값을 계산 없이 읽기, 유닛 practice 전용). params.wide로
   두 모드 모두 더 큰 범위(실전)를 공유한다. */
NM_TGEN['md43_limit'] = function (params, rng) {
  const mode = params.mode || 'factorCancel';
  const wide = !!params.wide;

  if (mode === 'decode') {
    const a = nzInt(rng, 1, 9);
    const p = R(rng, 1, 4);
    return {
      prompt: { ko: `lim은 "x가 어떤 값에 한없이 가까워질 때"를 뜻해요 — 화살표(→) 오른쪽 수를 그대로 읽어요(계산 없이!)`,
        en: `lim means "as x approaches..." — just read the number to the right of the arrow(→), no calculation`,
        zh: `lim的意思是"当x无限接近……时"——直接读出箭头(→)右边的数字(不用计算)` },
      tex: `\\lim_{x\\to ${a}} (${coefLead(p)}x^2+1)`,
      answer: a, answerType: 'number', widget: 'numpad', negative: a < 0
    };
  }

  if (mode === 'directSub') {
    const a = nzInt(rng, 1, wide ? 9 : 5);
    const p = nzInt(rng, 1, wide ? 6 : 4);
    const q = nzInt(rng, 1, wide ? 10 : 6);
    const answer = p * a + q;
    return {
      prompt: { ko: `다항함수는 x=a를 그대로 대입하면 극한값이 나와요(연속이니까 극한값=함숫값)`,
        en: `For polynomial functions, just substitute x=a directly to get the limit (continuous, so the limit equals the function value)`,
        zh: `多项式函数直接代入x=a就是极限值(连续函数的极限值=函数值)` },
      tex: `\\lim_{x\\to ${a}} (${coefLead(p)}x ${wrapPlus(q)}) = \\square`,
      answer, answerType: 'number', widget: 'numpad', negative: answer < 0
    };
  }

  /* factorCancel — 분자를 (x-a)(x-c)로 역산해 분모 (x-a)와 약분되면
     x→a일 때 남는 값은 항상 (a-c)(나눗셈 없이 곱셈으로 분자를 만든
     것이라 약분 결과가 항상 정수). */
  const a = nzInt(rng, 1, wide ? 9 : 6);
  let c = nzInt(rng, 1, wide ? 9 : 6);
  while (c === a) c = nzInt(rng, 1, wide ? 9 : 6);
  const b1 = -(a + c), b0 = a * c; /* x^2+b1x+b0 = (x-a)(x-c) */
  const answer = a - c;
  return {
    prompt: { ko: `0/0 꼴이면 분자를 인수분해해서 분모와 같은 인수 (x-a)를 약분해요`,
      en: `For a 0/0 form, factor the numerator and cancel the factor (x-a) that matches the denominator`,
      zh: `遇到0/0型，先把分子因式分解，再约去和分母相同的因式(x-a)` },
    tex: `\\lim_{x\\to ${a}} \\dfrac{x^2 ${wrapPlusCoef(b1)}x ${wrapPlus(b0)}}{x ${wrapPlus(-a)}} = \\square`,
    answer, answerType: 'number', widget: 'numpad', negative: answer < 0
  };
};

/* ── MD44 — 미분계수와 도함수 ── mode: 'polyPrime'(도함수 계수 다칸,
   params.cubic로 이차/삼차 전환) · 'evalPrime'(f'(x₀) 정수 값) ·
   'decode'(§13 — f'(a)의 a를 계산 없이 읽기, 유닛 practice 전용).
   두 표기(f′ vs d/dx)의 병렬 비교는 M-44 discover에서 다룬다(§13
   규칙 — 같은 것의 두 표기는 나란히). */
NM_TGEN['md44_derivative'] = function (params, rng) {
  const mode = params.mode || 'polyPrime';
  const wide = !!params.wide;

  if (mode === 'decode') {
    const a = nzInt(rng, 1, 9);
    return {
      prompt: { ko: `f'(a)는 "x=a에서 순간의 기울기를 구하라"는 뜻이에요 — 괄호 안의 수를 그대로 읽어요(계산 없이!)`,
        en: `f'(a) means "find the instantaneous slope at x=a" — just read the number inside the parentheses, no calculation`,
        zh: `f'(a)的意思是"求x=a处的瞬时斜率"——直接读出括号里的数(不用计算)` },
      tex: `f'(${a})`,
      answer: a, answerType: 'number', widget: 'numpad', negative: a < 0
    };
  }

  if (mode === 'polyPrime') {
    if (params.cubic) {
      const a3 = nzInt(rng, 1, 6), a2 = nzInt(rng, 1, 9), a1 = nzInt(rng, 1, 9);
      const answer = [3 * a3, 2 * a2, a1];
      return {
        prompt: { ko: `axⁿ의 도함수는 naxⁿ⁻¹ — 지수를 앞으로 곱해 내리고 1 줄여요. 항마다 따로 적용해요`,
          en: `The derivative of ax^n is n·a·x^(n-1) — bring the exponent down as a multiplier and reduce it by 1, term by term`,
          zh: `ax^n的导数是n·a·x^(n-1)——把指数乘到前面再减1，逐项进行` },
        tex: `f(x)=${coefLead(a3)}x^3 ${wrapPlusCoef(a2)}x^2 ${wrapPlusCoef(a1)}x \\;\\Rightarrow\\; f'(x)=\\square x^2 + \\square x + \\square`,
        answer, answerType: 'number', widget: 'numpad', negative: hasNeg(answer)
      };
    }
    const a2 = nzInt(rng, 1, 9), a1 = nzInt(rng, 1, 12);
    const answer = [2 * a2, a1];
    return {
      prompt: { ko: `axⁿ의 도함수는 naxⁿ⁻¹ — 지수를 앞으로 곱해 내리고 1 줄여요`,
        en: `The derivative of ax^n is n·a·x^(n-1) — bring the exponent down as a multiplier and reduce it by 1`,
        zh: `ax^n的导数是n·a·x^(n-1)——把指数乘到前面再减1` },
      tex: `f(x)=${coefLead(a2)}x^2 ${wrapPlusCoef(a1)}x \\;\\Rightarrow\\; f'(x)=\\square x + \\square`,
      answer, answerType: 'number', widget: 'numpad', negative: hasNeg(answer)
    };
  }

  /* evalPrime — f'(x)를 구한 뒤 x₀ 대입 */
  const a2 = nzInt(rng, 1, wide ? 9 : 6), a1 = nzInt(rng, 1, wide ? 12 : 8);
  const x0 = nzInt(rng, 1, wide ? 6 : 4);
  const answer = 2 * a2 * x0 + a1;
  return {
    prompt: { ko: `f'(x)=2ax+b를 먼저 구한 뒤 x=x₀를 대입해요`,
      en: `First find f'(x)=2ax+b, then substitute x=x₀`,
      zh: `先求出f'(x)=2ax+b，再代入x=x₀` },
    tex: `f(x)=${coefLead(a2)}x^2 ${wrapPlusCoef(a1)}x \\;\\Rightarrow\\; f'(${x0}) = \\square`,
    answer, answerType: 'number', widget: 'numpad', negative: answer < 0
  };
};

/* ── MD45 — 접선의 기울기와 방정식 ── m=f'(x₀)(기울기), 접선
   y=m(x-x₀)+f(x₀)를 y=mx+n 꼴로 정리하면 n=f(x₀)-m·x₀. 곱셈·뺄셈뿐이라
   항상 정수. mode: 'slope'(기울기만) · 'lineEq'(y=mx+n 두 계수). */
NM_TGEN['md45_tangentLine'] = function (params, rng) {
  const mode = params.mode || 'slope';
  const wide = !!params.wide;
  const a2 = nzInt(rng, 1, wide ? 8 : 5), a1 = nzInt(rng, 1, wide ? 10 : 6), a0 = nzInt(rng, 1, wide ? 10 : 6);
  const x0 = nzInt(rng, 1, wide ? 6 : 4);
  const slope = 2 * a2 * x0 + a1;
  const y0 = a2 * x0 * x0 + a1 * x0 + a0;

  if (mode === 'slope') {
    return {
      prompt: { ko: `접선의 기울기는 그 점에서의 미분계수 f'(x₀)와 같아요`,
        en: `The slope of the tangent line equals the derivative f'(x₀) at that point`,
        zh: `切线的斜率就等于该点的导数f'(x₀)` },
      tex: `f(x)=${coefLead(a2)}x^2 ${wrapPlusCoef(a1)}x ${wrapPlus(a0)} \\;\\Rightarrow\\; x=${x0}\\text{에서 접선의 기울기} = \\square`,
      answer: slope, answerType: 'number', widget: 'numpad', negative: slope < 0
    };
  }

  /* lineEq */
  const intercept = y0 - slope * x0;
  const answer = [slope, intercept];
  return {
    prompt: { ko: `접선은 y=f'(x₀)(x-x₀)+f(x₀) — 정리하면 y=mx+n 꼴, m=f'(x₀), n=f(x₀)-m·x₀`,
      en: `The tangent line y=f'(x₀)(x-x₀)+f(x₀) rearranges to y=mx+n, where m=f'(x₀) and n=f(x₀)-m·x₀`,
      zh: `切线y=f'(x₀)(x-x₀)+f(x₀)整理成y=mx+n，其中m=f'(x₀)，n=f(x₀)-m·x₀` },
    tex: `f(x)=${coefLead(a2)}x^2 ${wrapPlusCoef(a1)}x ${wrapPlus(a0)} \\;\\Rightarrow\\; x=${x0}\\text{에서 접선}: y=\\square x + \\square`,
    answer, answerType: 'number', widget: 'numpad', negative: hasNeg(answer)
  };
};

/* ── MD46 — 다항함수의 적분법 ── mode: 'antiderivative'(부정적분 계수
   다칸, +C 고정 표기 · params.deg2로 일차/이차 전환) ·
   'definiteInt'(정적분 값 정수) · 'decode'(§13 — 적분 구간의 시작·끝·
   폭 중 하나를 계산 없이 읽기, 유닛 practice 전용). 계수는 항상
   (차수+1)의 배수로 역산해 원시함수 계수가 나눗셈 없이 정수가 된다. */
NM_TGEN['md46_polyIntegral'] = function (params, rng) {
  const mode = params.mode || 'antiderivative';
  const wide = !!params.wide;

  if (mode === 'decode') {
    const p = R(rng, 1, 6);
    const q = p + R(rng, 1, 9);
    const which = pick(rng, ['start', 'end', 'width']);
    const answer = which === 'start' ? p : which === 'end' ? q : (q - p);
    const promptMap = {
      start: { ko: `∫ 아래의 수는 적분이 시작하는 값(구간의 처음)이에요 — 그대로 읽어요`,
        en: `The number below ∫ is where the integral starts (the beginning of the interval) — just read it off`,
        zh: `∫下方的数是积分开始的值(区间的起点)——直接读出来` },
      end: { ko: `∫ 위의 수는 적분이 끝나는 값(구간의 끝)이에요 — 그대로 읽어요`,
        en: `The number above ∫ is where the integral ends (the end of the interval) — just read it off`,
        zh: `∫上方的数是积分结束的值(区间的终点)——直接读出来` },
      width: { ko: `∫는 그 구간을 잘게 쪼개 다 더하라는 뜻이에요 — 구간의 폭(끝-처음)을 계산 없이 구해봐요(뺄셈만!)`,
        en: `∫ means slice the interval finely and add it all up — find the interval's width (end minus start), just one subtraction!`,
        zh: `∫的意思是把区间切碎再全部相加——求出区间的宽度(终点减起点)，只需一次减法！` }
    };
    return {
      prompt: promptMap[which],
      tex: `\\int_{${p}}^{${q}} f(x)\\,dx`,
      answer, answerType: 'number', widget: 'numpad', negative: false
    };
  }

  if (mode === 'antiderivative') {
    if (params.deg2) {
      const k = R(rng, 1, wide ? 4 : 3), j = nzInt(rng, 1, wide ? 5 : 4);
      const a = 3 * k, b = 2 * j;
      const c = nzInt(rng, 1, wide ? 9 : 6);
      const answer = [k, j, c];
      return {
        prompt: { ko: `∫axⁿdx = (a÷(n+1))xⁿ⁺¹ — 계수를 (n+1)로 나누고 지수를 하나 늘려요. 적분상수는 +C로 둬요`,
          en: `∫ax^n dx = (a÷(n+1))x^(n+1) — divide the coefficient by (n+1) and raise the exponent by one. Keep the constant of integration as +C`,
          zh: `∫ax^n dx = (a÷(n+1))x^(n+1)——系数除以(n+1)，指数加1。积分常数记为+C` },
        tex: `f(x)=${coefLead(a)}x^2 ${wrapPlusCoef(b)}x ${wrapPlus(c)} \\;\\Rightarrow\\; \\int f(x)\\,dx = \\square x^3 + \\square x^2 + \\square x + C`,
        answer, answerType: 'number', widget: 'numpad', negative: hasNeg(answer)
      };
    }
    const k = nzInt(rng, 1, wide ? 6 : 4);
    const a = 2 * k;
    const b = nzInt(rng, 1, wide ? 9 : 6);
    const answer = [k, b];
    return {
      prompt: { ko: `∫axdx = (a÷2)x² — 계수를 2로 나누고 지수를 하나 늘려요. 적분상수는 +C로 둬요`,
        en: `∫ax dx = (a÷2)x² — divide the coefficient by 2 and raise the exponent by one. Keep the constant of integration as +C`,
        zh: `∫ax dx = (a÷2)x²——系数除以2，指数加1。积分常数记为+C` },
      tex: `f(x)=${coefLead(a)}x ${wrapPlus(b)} \\;\\Rightarrow\\; \\int f(x)\\,dx = \\square x^2 + \\square x + C`,
      answer, answerType: 'number', widget: 'numpad', negative: hasNeg(answer)
    };
  }

  /* definiteInt — antiderivative(deg2)와 같은 방식으로 정수계수
     원시함수 F(x)=kx³+jx²+cx를 만든 뒤 F(q)-F(p)를 직접 계산 */
  const k = R(rng, 1, wide ? 4 : 3), j = nzInt(rng, 1, wide ? 5 : 4);
  const a = 3 * k, b = 2 * j;
  const c = nzInt(rng, 1, wide ? 9 : 6);
  const p = nzInt(rng, 1, wide ? 5 : 3);
  let q = nzInt(rng, 1, wide ? 5 : 3);
  while (q === p) q = nzInt(rng, 1, wide ? 5 : 3);
  const F = x => k * x * x * x + j * x * x + c * x;
  const answer = F(q) - F(p);
  return {
    prompt: { ko: `정적분은 원시함수 F(x)를 구한 뒤 F(끝값)-F(처음값)을 계산해요`,
      en: `A definite integral is F(end) − F(start), where F is the antiderivative`,
      zh: `定积分是先求出原函数F(x)，再算F(终点)-F(起点)` },
    tex: `f(x)=${coefLead(a)}x^2 ${wrapPlusCoef(b)}x ${wrapPlus(c)} \\;\\Rightarrow\\; \\int_{${p}}^{${q}} f(x)\\,dx = \\square`,
    answer, answerType: 'number', widget: 'numpad', negative: answer < 0
  };
};

if (typeof module !== 'undefined' && module.exports) module.exports = NM_TGEN;
})();
