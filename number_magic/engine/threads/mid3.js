/* ============================================================
   Numbers of Magic — MD15~20(중등 W10 · 중3 제곱근과 다항식의 곱셈)
   스레드 생성기. 근거: MASTER-ROADMAP.md §5(중3 W10) — 2022 개정
   교육과정 중3 '제곱근과 실수'·'다항식의 곱셈과 인수분해' 성취기준
   범위의 표준 연산 유형을 자체 설계(교과서 문장 인용 없음).
   engine/threads/mid2.js(W9, MD10~14)에 이어지는 번호.
   계약: NM_TGEN[genKey] = function(params, rng) { return problem; }
   절대 Math.random() 사용 금지 — R(rng,a,b) / pick(rng,arr)만.
   답 환원 원칙(MASTER-ROADMAP §7): 4√3 같은 근호식은 [계수,근호안]
   두 정수로, 분모의 유리화는 [분자근호안,분모] 두 정수로 받는다 —
   수식 문자열 파서는 절대 쓰지 않는다.
   다칸 답 tex 규약: mid2.js와 동일 — 이어지는 항은 "+\square"로
   통일, 음수는 numpad − 키로 직접 입력(problem.negative로 노출).
   ============================================================ */
(function(){
'use strict';

const { R, pick } = NM_RNG;

/* ── 공용 헬퍼 ── */
function nzInt(rng, lo, hi){ return R(rng, lo, hi) * pick(rng, [1, -1]); }
function wrapPlus(n){ return n < 0 ? `- ${Math.abs(n)}` : `+ ${n}`; }
function gcd(a, b){ a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a || 1; }
function divisorsOf(n){
  n = Math.abs(n);
  const out = [];
  for (let k = 1; k <= n; k++) if (n % k === 0) out.push(k);
  return out;
}
/* 제곱수가 아닌 자연수 중 "소인수 제곱이 하나도 없는" 수 — 근호가
   더 이상 안 줄어드는 상태(근호 정리의 도착점). */
function isSquareFree(n){
  for (let p = 2; p * p <= n; p++) if (n % (p * p) === 0) return false;
  return true;
}
/* N을 coeff·√rad 꼴로 완전히 정리(coeff²×rad=N, rad는 제곱인수 없음) */
function simplifyRadical(N){
  let coeff = 1, rad = N;
  for (let p = 2; p * p <= rad; p++) {
    while (rad % (p * p) === 0) { rad /= (p * p); coeff *= p; }
  }
  return { coeff, rad };
}
/* [lo,hi] 구간의 제곱인수 없는 수 목록(중복률 확보용 — 하드코딩 목록
   대신 범위로 만들어 풀을 넓힌다, 연산문제-감사.md §3 조치 방식 그대로) */
function squarefreeRange(lo, hi){
  const out = [];
  for (let n = lo; n <= hi; n++) if (isSquareFree(n)) out.push(n);
  return out;
}
const SQFREE_NARROW = squarefreeRange(2, 30);   /* MD16 basic·withCoeff, MD18 coef */
const SQFREE_WIDE = squarefreeRange(2, 120);    /* MD16 wide, MD18 plain */
const SQFREE_SMALL = squarefreeRange(2, 22);    /* MD18 messyDenom(분모 배수라 작게 유지) */

/* ── MD15 — 제곱근의 값 ──
   mode: 'perfect'(완전제곱수의 제곱근) · 'squareOfSqrt'((√a)²=a) ·
   'absValue'(√(a²)=|a|, a가 음수일 수 있음 — 결과는 항상 0 이상). */
NM_TGEN['md15_sqrtValue'] = function (params, rng) {
  const mode = params.mode || 'perfect';

  if (mode === 'perfect') {
    const k = R(rng, 2, 80);
    const N = k * k;
    return {
      prompt: {
        ko: `${N}가 어떤 수의 제곱인지 찾아요 — 제곱해서 ${N}이 되는 수`,
        en: `Find the number whose square is ${N}`,
        zh: `找出平方等于${N}的数`
      },
      tex: `\\sqrt{${N}} = \\square`,
      answer: k, answerType: 'number', widget: 'numpad'
    };
  }

  if (mode === 'squareOfSqrt') {
    const a = R(rng, 2, 200);
    return {
      prompt: {
        ko: `제곱근을 다시 제곱하면 근호가 사라지고 원래 수로 돌아가요`,
        en: `Squaring a square root cancels the root and returns the original number`,
        zh: `平方根再平方，根号消失，回到原来的数`
      },
      tex: `(\\sqrt{${a}})^2 = \\square`,
      answer: a, answerType: 'number', widget: 'numpad'
    };
  }

  /* absValue — √(a²) = |a|, a는 음수일 수 있다 */
  const a = nzInt(rng, 2, 40);
  return {
    prompt: {
      ko: `${a}의 제곱을 다시 제곱근으로 풀면 절댓값 |${a}|이 나와요 — 결과는 항상 0 이상이에요`,
      en: `The square root of ${a}² gives the absolute value |${a}| — the result is always nonnegative`,
      zh: `${a}的平方再开方，结果是绝对值|${a}|——结果永远不小于0`
    },
    tex: `\\sqrt{(${a})^2} = \\square`,
    answer: Math.abs(a), answerType: 'number', widget: 'numpad'
  };
};

/* ── MD16 — 근호의 정리 (√48 = 4√3) ──
   N=a²×b(b는 제곱인수 없는 수)로 두고 답은 [계수 a, 근호 안 b].
   discover에서 이 "숨은 짝(같은 소인수 두 번)을 찾아 밖으로 꺼내는"
   감각을 계보1 '2와 5는 친구'(소인수를 짝지어 보는 습관)와 이어
   붙인다(lineage:['ten-friends'] — 짝을 찾아 밖으로 꺼낸다는 동작
   자체가 같은 계보의 다음 진화라는 판단, MASTER-ROADMAP 작업지시).
   mode: 'basic'(연습) · 'wide'(실전, 더 큰 수) · 'withCoeff'(이미
   계수가 있는 근호, 5√48=20√3처럼 계수끼리도 곱함). */
NM_TGEN['md16_simplifyRadical'] = function (params, rng) {
  const mode = params.mode || 'basic';

  if (mode === 'wide') {
    const a = R(rng, 2, 12), b = pick(rng, SQFREE_WIDE);
    const N = a * a * b;
    return {
      prompt: {
        ko: `근호 안의 수에서 완전제곱수를 찾아 밖으로 꺼내요`,
        en: `Find the perfect-square factor inside the root and pull it out`,
        zh: `在根号内找出完全平方因数，把它提到根号外`
      },
      tex: `\\sqrt{${N}} = \\square\\sqrt{\\square}`,
      answer: [a, b], answerType: 'number', widget: 'numpad'
    };
  }

  if (mode === 'withCoeff') {
    const c = R(rng, 2, 6);
    const a = R(rng, 2, 9), b = pick(rng, SQFREE_NARROW);
    const N = a * a * b;
    return {
      prompt: {
        ko: `근호 앞에 이미 계수가 있어도 방법은 같아요 — 밖으로 꺼낸 수를 원래 계수와 곱해요`,
        en: `Even with a coefficient already outside, the method is the same — multiply it by what you pull out`,
        zh: `根号前已有系数也一样——把提出来的数和原来的系数相乘`
      },
      tex: `${c}\\sqrt{${N}} = \\square\\sqrt{\\square}`,
      answer: [c * a, b], answerType: 'number', widget: 'numpad'
    };
  }

  /* basic — 연습 */
  const a = R(rng, 2, 9), b = pick(rng, SQFREE_NARROW);
  const N = a * a * b;
  return {
    prompt: {
      ko: `48 = 16×3처럼, 근호 안에서 같은 소인수가 두 번 만나면(짝) 밖으로 나올 수 있어요 — 2와 5가 만나 10이 되던 것과 같은 이치예요`,
      en: `Like 48 = 16×3, when the same prime factor appears twice (a pair) inside the root, it can step outside — the same idea as 2 and 5 meeting to make 10`,
      zh: `就像48=16×3，根号内同一个质因数出现两次(配对)就能提到根号外——和2与5相遇变成10是同一个道理`
    },
    tex: `\\sqrt{${N}} = \\square\\sqrt{\\square}`,
    answer: [a, b], answerType: 'number', widget: 'numpad'
  };
};

/* ── MD17 — 제곱근의 곱셈과 나눗셈 ──
   mode: 'mul'(정수로 떨어짐) · 'div'(정수로 떨어짐) · 'mixed'(완전
   제곱수가 안 되어 근호가 남음 — MD16의 정리 감각을 재사용). */
NM_TGEN['md17_sqrtMulDiv'] = function (params, rng) {
  const mode = params.mode || 'mul';

  if (mode === 'mul') {
    const k = R(rng, 3, 30);
    const N = k * k;
    const divs = divisorsOf(N).filter(d => d > 1 && d < N);
    const a = divs.length ? pick(rng, divs) : N;
    const b = N / a;
    return {
      prompt: {
        ko: `√a × √b = √(ab) — 근호 안을 먼저 곱한 뒤 정리해요`,
        en: `√a × √b = √(ab) — multiply what's under the roots first, then simplify`,
        zh: `√a × √b = √(ab)——先把根号内的数相乘，再化简`
      },
      tex: `\\sqrt{${a}} \\times \\sqrt{${b}} = \\sqrt{\\square} = \\square`,
      answer: k, answerType: 'steps', widget: 'steps',
      steps: [
        { tex: `\\sqrt{${a}} \\times \\sqrt{${b}} = \\sqrt{\\square}`, blank: N },
        { tex: `\\sqrt{${N}} = \\square`, blank: k }
      ]
    };
  }

  if (mode === 'div') {
    const k = R(rng, 2, 12);
    const b = R(rng, 2, 9);
    const a = k * k * b;
    return {
      prompt: {
        ko: `√a ÷ √b = √(a÷b) — 근호 안을 먼저 나눈 뒤 정리해요`,
        en: `√a ÷ √b = √(a÷b) — divide what's under the roots first, then simplify`,
        zh: `√a ÷ √b = √(a÷b)——先把根号内的数相除，再化简`
      },
      tex: `\\sqrt{${a}} \\div \\sqrt{${b}} = \\sqrt{\\square} = \\square`,
      answer: k, answerType: 'steps', widget: 'steps',
      steps: [
        { tex: `\\sqrt{${a}} \\div \\sqrt{${b}} = \\sqrt{\\square}`, blank: k * k },
        { tex: `\\sqrt{${k * k}} = \\square`, blank: k }
      ]
    };
  }

  /* mixed — 곱해도 완전제곱수가 안 되어 근호가 남는 경우 */
  let a, b, N, simp;
  let tries = 0;
  do {
    a = R(rng, 2, 18); b = R(rng, 2, 18);
    N = a * b;
    simp = simplifyRadical(N);
    tries++;
  } while ((simp.rad === 1 || simp.coeff === 1) && tries < 200);
  return {
    prompt: {
      ko: `곱해도 완전제곱수가 안 되면, 곱한 뒤 근호를 정리해요`,
      en: `If the product isn't a perfect square, multiply first, then simplify the radical`,
      zh: `相乘后若不是完全平方数，就先相乘再化简根号`
    },
    tex: `\\sqrt{${a}} \\times \\sqrt{${b}} = \\square\\sqrt{\\square}`,
    answer: [simp.coeff, simp.rad], answerType: 'number', widget: 'numpad'
  };
};

/* ── MD18 — 분모의 유리화 ──
   답은 [분자근호안, 분모] 다칸(항상 근호가 √b/b 꼴이 되는 형태로
   맞춘다 — 분자의 계수는 항상 1이라 blank 대상이 아니다). mode:
   'plain'(1/√n) · 'coef'(c/√n, c는 n과 서로소라 더 못 줄어듦) ·
   'messyDenom'(분모의 근호 자체가 먼저 정리돼야 하는 경우, MD16 연계). */
NM_TGEN['md18_rationalize'] = function (params, rng) {
  const lv = params.level || 'plain';

  if (lv === 'plain') {
    const n = pick(rng, SQFREE_WIDE);
    return {
      prompt: {
        ko: `분모의 근호를 없애려면 분자·분모에 같은 근호를 곱해요`,
        en: `To remove the root from the denominator, multiply top and bottom by the same root`,
        zh: `要去掉分母的根号，就把分子分母同乘一个相同的根号`
      },
      tex: `\\dfrac{1}{\\sqrt{${n}}} = \\dfrac{\\sqrt{\\square}}{\\square}`,
      answer: [n, n], answerShape: 'radicalFraction', answerType: 'number', widget: 'numpad'
    };
  }

  if (lv === 'coef') {
    const n = pick(rng, SQFREE_NARROW);
    let c; do { c = R(rng, 2, 12); } while (gcd(c, n) !== 1);
    return {
      prompt: {
        ko: `분자에 계수가 있어도 방법은 같아요 — 분모의 근호를 분자·분모에 곱해요`,
        en: `Even with a numerator coefficient, the method is the same — multiply by the denominator's root`,
        zh: `分子有系数也一样——把分母的根号乘到分子分母上`
      },
      tex: `\\dfrac{${c}}{\\sqrt{${n}}} = \\dfrac{${c}\\sqrt{\\square}}{\\square}`,
      answer: [n, n], answerShape: 'radicalFraction', answerType: 'number', widget: 'numpad'
    };
  }

  /* messyDenom — 분모의 근호 자체가 정리부터 필요한 경우 */
  let a, b, N;
  do { a = R(rng, 2, 11); b = pick(rng, SQFREE_SMALL); N = a * a * b; } while (N > 500);
  return {
    prompt: {
      ko: `먼저 분모의 근호부터 정리(√${N}=${a}√${b})하고, 그다음 분자·분모에 √${b}를 곱해 유리화해요`,
      en: `First simplify the denominator's root (√${N}=${a}√${b}), then multiply top and bottom by √${b} to rationalize`,
      zh: `先化简分母的根号(√${N}=${a}√${b})，再用√${b}乘分子分母进行有理化`
    },
    tex: `\\dfrac{1}{\\sqrt{${N}}} = \\dfrac{1}{${a}\\sqrt{${b}}} = \\dfrac{\\sqrt{\\square}}{\\square}`,
    answer: [b, a * b], answerShape: 'radicalFraction', answerType: 'number', widget: 'numpad'
  };
};

/* ── MD19 — 곱셈공식의 전개 ──
   lineage: 계보4 '무지개 덧셈법'의 종착(과정-로드맵.md §6 — 무지개
   덧셈법 → 차가 2인 두 수의 곱 → 평균값 곱셈 → 합차공식으로 자란
   줄기의 마지막 걸음). mode: 'twoFactors'((x+a)(x+b)=x²+□x+□, 답
   [a+b,ab]) · 'square'((x+a)²=x²+□x+□, 답[2a,a²]) · 'diffSquares'
   ((x+a)(x-a)=x²-□, 답 a², 계보4가 이름 그대로 완성되는 지점). */
NM_TGEN['md19_expandFormula'] = function (params, rng) {
  const mode = params.mode || 'twoFactors';

  if (mode === 'twoFactors') {
    const a = nzInt(rng, 1, 9), b = nzInt(rng, 1, 9);
    return {
      prompt: {
        ko: `(x+a)(x+b) = x² + (a+b)x + ab — 두 수를 더하고, 곱해요`,
        en: `(x+a)(x+b) = x² + (a+b)x + ab — add the two numbers, then multiply them`,
        zh: `(x+a)(x+b) = x² + (a+b)x + ab——先把两数相加，再相乘`
      },
      tex: `(x ${wrapPlus(a)})(x ${wrapPlus(b)}) = x^2 + \\square x + \\square`,
      answer: [a + b, a * b], answerType: 'number', widget: 'numpad', negative: (a + b < 0) || (a * b < 0)
    };
  }

  if (mode === 'square') {
    const a = nzInt(rng, 1, 45);
    return {
      prompt: {
        ko: `(x+a)² = x² + 2ax + a² — 가운데 항은 2배, 마지막 항은 제곱이에요`,
        en: `(x+a)² = x² + 2ax + a² — double it for the middle term, square it for the last`,
        zh: `(x+a)² = x² + 2ax + a²——中间项翻倍，最后一项平方`
      },
      tex: `(x ${wrapPlus(a)})^2 = x^2 + \\square x + \\square`,
      answer: [2 * a, a * a], answerType: 'number', widget: 'numpad', negative: (2 * a < 0)
    };
  }

  /* diffSquares — 합차공식(계보4 종착): (x+a)(x-a)=x²-a² */
  const a = R(rng, 1, 70);
  return {
    prompt: {
      ko: `(x+a)(x-a) = x² - a² — 가운데 항끼리 사라지고 제곱의 차만 남아요`,
      en: `(x+a)(x-a) = x² - a² — the middle terms cancel out, leaving only the difference of squares`,
      zh: `(x+a)(x-a) = x² - a²——中间项互相抵消，只剩平方差`
    },
    tex: `(x + ${a})(x - ${a}) = x^2 - \\square`,
    answer: a * a, answerType: 'number', widget: 'numpad'
  };
};

/* ── MD20 — 인수분해 기초 ──
   x²+bx+c = (x+p)(x+q)에서 p+q=b, pq=c를 만족하는 p,q를 찾는다.
   두 수의 순서는 곱셈공식(MD19)과 달리 뒤집어도 값이 같은 표현이라
   채점이 순서에 흔들리면 안 된다 — 이 생성기가 항상 p≤q로 정렬해
   내보내고(정렬 규약), 프롬프트도 "작은 수부터"를 명시해 입력 순서를
   고정한다. mode: 'positive'(연습, b·c 모두 양수) · 'mixed'(실전,
   음수 섞임). */
NM_TGEN['md20_factorBasic'] = function (params, rng) {
  const lv = params.level || 'positive';

  let p, q;
  if (lv === 'positive') {
    p = R(rng, 1, 15); q = R(rng, 1, 15);
  } else {
    p = nzInt(rng, 1, 12); q = nzInt(rng, 1, 12);
  }
  if (p > q) { const t = p; p = q; q = t; }   /* 정렬 규약: 작은 수부터 */
  const b = p + q, c = p * q;
  return {
    prompt: {
      ko: `x² + bx + c = (x+p)(x+q)일 때, 더하면 b, 곱하면 c가 되는 두 수를 찾아요 — 작은 수부터 순서대로 입력해요`,
      en: `For x² + bx + c = (x+p)(x+q), find two numbers that add to b and multiply to c — enter the smaller one first`,
      zh: `x² + bx + c = (x+p)(x+q)时，找相加得b、相乘得c的两个数——先输入较小的那个`
    },
    tex: `x^2 ${wrapPlus(b)}x ${wrapPlus(c)} = (x + \\square)(x + \\square)`,
    answer: [p, q], answerType: 'number', widget: 'numpad', negative: (p < 0) || (q < 0)
  };
};

if (typeof module !== 'undefined' && module.exports) module.exports = NM_TGEN;
})();
