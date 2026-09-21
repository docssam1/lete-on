/* ============================================================
   Numbers of Magic — MD68~81(중등 교과 연산 4차) 스레드 생성기.
   근거: 원장 지시(2026-09-21) — "한 단원씩이 아니잖아. 어떻게 일차함수
   그래프를 한 번에 배워. 정비례 반비례는? 이차함수도 세부화해야지.
   일차방정식의 활용도 거리·속력·시간, 원가·정가 등 놓치지 마. 과정 확인."

   3차(mid9.js)에서 연립·부등식·일차함수·이차방정식·이차함수를 한 스레드씩
   넣었는데, 그게 **한 단원을 한 스레드에 뭉쳐 놓은 것**이었다. 교과서는
   일차함수만도 함숫값 → 그래프와 평행이동 → 절편 → 식 구하기 → 일차방정식과의
   관계 → 활용으로 여러 차시에 걸쳐 가르친다. 또 **활용(문장제)이 통째로
   없었다** — 문장제는 WP1·3·4·5 뿐인데 전부 초등 사칙이다.

   그래서 이 파일은 세 갈래를 채운다.
   A. 중1 좌표·비례 (MD68~70)   — 좌표평면·사분면 · 정비례/반비례 그래프 ·
                                  일차방정식의 활용
   B. 중2 함수·활용 (MD71~76)   — 부등식 활용 · 연립 활용 · 함수와 함숫값 ·
                                  일차함수 그래프와 절편 · 일차함수와 일차방정식 ·
                                  일차함수의 활용
   C. 중3 이차 (MD77~81)        — 이차방정식 활용 · y=ax² 그래프 · 평행이동 ·
                                  최대최소와 x축 교점 · 식 구하기

   계약: NM_TGEN[genKey] = function(params, rng) { ... }, Math.random() 금지.
   표기: KaTeX 간격 명령은 `\quad` 만 쓴다(mid9.js 상단 주석 — Bash 편집 경로에서
   백슬래시+세미콜론이 먹히는 사고가 있었다).

   답 환원 원칙(MASTER-ROADMAP §7):
   - 그래프 문항은 눈금(정수)에서 읽히는 값만 낸다 — 기울기·절편·꼭짓점·비례상수.
   - 반비례는 k 의 **약수**에서 x 를 골라 y 가 정수로 떨어지게 한다.
   - 활용(문장제)은 답을 먼저 정하고 이야기의 수를 역산한다. 거리·속력·시간은
     속력·시간을 먼저 골라 거리를 곱셈으로 만들고, 원가·정가는 원가와 이율을
     먼저 골라 정가를 계산한다 — 나눗셈이 안 떨어지는 자리가 생기지 않는다.
   - 농도는 소금의 양(정수)을 먼저 정하고 소금물의 양을 100의 배수로 잡는다.
   ============================================================ */
(function(){
'use strict';

const { R, pick } = NM_RNG;

/* ── 공용 헬퍼(mid4~9와 동일 계열, 파일별 독립 정의 관례) ── */
function nzInt(rng, lo, hi){ return R(rng, lo, hi) * pick(rng, [1, -1]); }
function wrapPlus(n){ return n < 0 ? `- ${Math.abs(n)}` : `+ ${n}`; }
function coefLead(n){ return n===1?'':n===-1?'-':String(n); }
function hasNeg(v){ return Array.isArray(v) ? v.some(x => x < 0) : v < 0; }
function divisorsOf(n){ n=Math.abs(n); const out=[]; for(let d=1; d<=n; d++) if(n%d===0) out.push(d); return out; }
/* 세 언어를 한 번에 — 활용 문항이 story·ask 를 늘 세 벌로 내야 한다(wp.js 계약). */
function L3(ko, en, zh){ return { ko, en, zh }; }
/* 문장제 한 벌 조립 — wp.js assemble 과 같은 모양(prompt·word·wordAsk·wordUnit). */
function wordItem(story, ask, unit, answer, solution){
  const prompt = {};
  ['ko','en','zh'].forEach(l => {
    prompt[l] = story[l] + (l === 'zh' ? '' : ' ') + ask[l];
  });
  return {
    prompt, word: story, wordAsk: ask, wordUnit: unit,
    answer, answerType: 'number', widget: 'numpad',
    negative: hasNeg(answer), solution: solution || []
  };
}

/* ============================================================
   A. 중1 — 좌표평면 · 비례 · 일차방정식의 활용
   ============================================================ */

/* ── MD68 — 좌표와 사분면 ──
   일차함수·이차함수 그래프를 읽으려면 **점 하나를 읽는 것**이 먼저다.
   mode: 'readPoint'(그래프의 점 → 좌표 2칸) · 'quadrant'(좌표 → 제몇사분면,
   답 1~4) · 'symmetry'(x축·y축·원점 대칭점, 2칸). */
NM_TGEN['md68_coordinate'] = function (params, rng) {
  const mode = params.mode || 'readPoint';
  const xr = [-6, 6], yr = [-6, 6];

  if (mode === 'quadrant') {
    const x = nzInt(rng, 1, 6), y = nzInt(rng, 1, 6);
    const q = x > 0 ? (y > 0 ? 1 : 4) : (y > 0 ? 2 : 3);
    return {
      prompt: { ko: `x가 양수면 오른쪽, y가 양수면 위쪽이에요 — 오른위부터 시계 반대로 1·2·3·4사분면이에요`,
        en: `Positive x is right, positive y is up — starting top-right and going counter-clockwise gives quadrants 1, 2, 3, 4`,
        zh: `x为正在右、y为正在上——从右上开始逆时针依次是第1、2、3、4象限` },
      tex: `(${x},\\, ${y}) \\quad\\Rightarrow\\quad \\text{제} \\square \\text{사분면}`,
      answer: q, answerType: 'number', widget: 'numpad',
      solution: [
        { tex: `x = ${x} \\quad\\Rightarrow\\quad \\text{${x > 0 ? '오른쪽' : '왼쪽'}}` },
        { tex: `y = ${y} \\quad\\Rightarrow\\quad \\text{${y > 0 ? '위쪽' : '아래쪽'}}` },
        { tex: `\\text{제} \\square \\text{사분면}`, blank: q }
      ]
    };
  }

  if (mode === 'symmetry') {
    const x = nzInt(rng, 1, 6), y = nzInt(rng, 1, 6);
    const kind = pick(rng, ['xaxis', 'yaxis', 'origin']);
    const ans = kind === 'xaxis' ? [x, -y] : kind === 'yaxis' ? [-x, y] : [-x, -y];
    const name = kind === 'xaxis' ? 'x축' : kind === 'yaxis' ? 'y축' : '원점';
    const why = kind === 'xaxis' ? 'y의 부호만' : kind === 'yaxis' ? 'x의 부호만' : '두 부호 모두';
    return {
      prompt: { ko: `x축 대칭은 y의 부호만, y축 대칭은 x의 부호만, 원점 대칭은 둘 다 바뀌어요`,
        en: `Reflecting in the x-axis flips only y, in the y-axis only x, and through the origin flips both`,
        zh: `关于x轴对称只变y的符号，关于y轴对称只变x的符号，关于原点对称两个都变` },
      tex: `(${x},\\, ${y}) \\quad\\Rightarrow\\quad \\text{${name} 대칭} \\left(\\square,\\, \\square\\right)`,
      answer: ans, answerType: 'number', widget: 'numpad', negative: hasNeg(ans),
      solution: [
        { tex: `\\text{${name} 대칭} \\quad\\Rightarrow\\quad \\text{${why} 바뀜}` },
        { tex: `\\left(\\square,\\, \\square\\right)`, blank: ans }
      ]
    };
  }

  /* readPoint(기본) — 그래프에 찍힌 점의 좌표를 읽는다 */
  const x = nzInt(rng, 1, 5), y = nzInt(rng, 1, 5);
  return {
    prompt: { ko: `점에서 x축으로 내려 가로 좌표를, y축으로 옮겨 세로 좌표를 읽어요`,
      en: `Drop down to the x-axis for the first number, across to the y-axis for the second`,
      zh: `从点往下看x轴读出横坐标，往旁看y轴读出纵坐标` },
    tex: `\\text{점 P의 좌표} \\left(\\square,\\, \\square\\right)`,
    answer: [x, y], answerType: 'number', widget: 'graphPlane', negative: hasNeg([x, y]),
    graph: { kind: 'points', pts: [[x, y]], xr: xr, yr: yr },
    solution: [
      { tex: `\\text{가로} = \\square`, blank: x },
      { tex: `\\text{세로} = \\square`, blank: y },
      { tex: `\\left(\\square,\\, \\square\\right)`, blank: [x, y] }
    ]
  };
};

/* ── MD69 — 정비례·반비례의 그래프 ──
   MD51 은 **값**만 다뤘다(표에서 y 구하기). 정비례가 원점을 지나는 직선이고
   반비례가 두 가지로 갈라진 곡선이라는 것은 그림으로만 보인다.
   mode: 'directGraph'(원점 지나는 직선 → y=□x) · 'inverseGraph'(쌍곡선 →
   y=□/x) · 'readValue'(그래프에서 x=k일 때 y). */
NM_TGEN['md69_proportionGraph'] = function (params, rng) {
  const mode = params.mode || 'directGraph';
  const xr = [-6, 6], yr = [-8, 8];

  if (mode === 'inverseGraph') {
    /* y=k/x — 눈금에서 읽히도록 k 를 작은 정수로, 지나는 점은 약수에서 고른다 */
    const k = pick(rng, [2, 3, 4, 6, -2, -3, -4, -6]);
    const ds = divisorsOf(k).filter(d => d <= 6 && Math.abs(k / d) <= 8);
    const px = ds.length ? ds[ds.length - 1] : 1;
    return {
      prompt: { ko: `반비례 y=a/x는 두 가지로 갈라진 곡선이에요 — 지나는 점 하나에서 x와 y를 곱하면 a가 나와요`,
        en: `Inverse proportion y=a/x is a curve in two branches — multiply x by y at any point on it to get a`,
        zh: `反比例y=a/x是分成两支的曲线——在曲线上任取一点，x乘以y就得到a` },
      tex: `y = \\dfrac{\\square}{x}`,
      answer: k, answerType: 'number', widget: 'graphPlane', negative: k < 0,
      graph: { kind: 'hyperbola', k: k, pts: [[px, k / px]], xr: xr, yr: yr },
      solution: [
        { tex: `\\text{지나는 점} \\left(${px},\\, ${k / px}\\right)` },
        { tex: `${px} \\times (${k / px}) = \\square`, blank: k },
        { tex: `y = \\dfrac{\\square}{x}`, blank: k }
      ]
    };
  }

  if (mode === 'readValue') {
    /* 그래프에서 특정 x의 y를 읽는다 — 정비례·반비례 중 하나 */
    const isDirect = pick(rng, [true, false]);
    if (isDirect) {
      const a = pick(rng, [1, 2, 3, -1, -2, -3]);
      const x0 = pick(rng, [2, 3, -2, -3].filter(v => Math.abs(a * v) <= 8));
      const y0 = a * x0;
      return {
        prompt: { ko: `그래프에서 x가 주어진 값일 때 세로로 올라가 y를 읽어요`,
          en: `Find the given x on the graph, go up or down to the line, and read y`,
          zh: `在图象上找到给定的x，竖直走到直线上读出y` },
        tex: `x = ${x0} \\quad\\Rightarrow\\quad y = \\square`,
        answer: y0, answerType: 'number', widget: 'graphPlane', negative: y0 < 0,
        graph: { kind: 'line', m: a, b: 0, pts: [[x0, y0]], xr: xr, yr: yr },
        solution: [
          { tex: `\\text{그래프는 } y = ${coefLead(a)}x` },
          { tex: `${a} \\times (${x0}) = \\square`, blank: y0 }
        ]
      };
    }
    const k = pick(rng, [4, 6, 8, 12, -4, -6, -8, -12]);
    const ds = divisorsOf(k).filter(d => d >= 2 && d <= 6 && Math.abs(k / d) <= 8);
    const x0 = ds.length ? pick(rng, ds) : 2;
    const y0 = k / x0;
    return {
      prompt: { ko: `반비례 그래프에서도 같아요 — x를 찾아 곡선까지 올라가 y를 읽어요`,
        en: `Same on an inverse-proportion graph — find x, go to the curve, and read y`,
        zh: `反比例图象也一样——找到x，走到曲线上读出y` },
      tex: `x = ${x0} \\quad\\Rightarrow\\quad y = \\square`,
      answer: y0, answerType: 'number', widget: 'graphPlane', negative: y0 < 0,
      graph: { kind: 'hyperbola', k: k, pts: [[x0, y0]], xr: xr, yr: yr },
      solution: [
        { tex: `\\text{그래프는 } y = \\dfrac{${k}}{x}` },
        { tex: `${k} \\div ${x0} = \\square`, blank: y0 }
      ]
    };
  }

  /* directGraph(기본) — 원점을 지나는 직선에서 비례상수 */
  const a = pick(rng, [1, 2, 3, 4, -1, -2, -3, -4]);
  const px = Math.abs(a) >= 3 ? 2 : 3;
  return {
    prompt: { ko: `정비례 y=ax의 그래프는 원점을 지나는 직선이에요 — 지나는 점에서 y를 x로 나누면 a가 나와요`,
      en: `The graph of a direct proportion y=ax is a straight line through the origin — divide y by x at any point to get a`,
      zh: `正比例y=ax的图象是过原点的直线——在图象上任取一点，y除以x就得到a` },
    tex: `y = \\square x`,
    answer: a, answerType: 'number', widget: 'graphPlane', negative: a < 0,
    graph: { kind: 'line', m: a, b: 0, pts: [[px, a * px]], xr: xr, yr: yr },
    solution: [
      { tex: `\\text{지나는 점} \\left(${px},\\, ${a * px}\\right)` },
      { tex: `${a * px} \\div ${px} = \\square`, blank: a },
      { tex: `y = \\square x`, blank: a }
    ]
  };
};

/* ── MD70 — 일차방정식의 활용 ──
   원장이 이름을 대 준 자리("거리·속력·시간, 원가·정가"). 식을 푸는 법(MD50)은
   있었지만 **말을 식으로 바꾸는 자리**가 중등에 하나도 없었다.
   mode: 'number'(수·나이) · 'speed'(거리·속력·시간) · 'price'(원가·정가·할인). */
NM_TGEN['md70_linearApply'] = function (params, rng) {
  const mode = params.mode || 'number';
  /* 이름마다 주격 조사를 함께 든다 — 받침 유무로 '이/가'가 갈린다(한 번 틀렸다). */
  const NAMES = [['지호','Jiho','智浩','가'], ['수아','Sua','秀雅','가'], ['민준','Minjun','敏俊','이'], ['하린','Harin','夏琳','이']];
  const nm = pick(rng, NAMES);

  if (mode === 'speed') {
    /* 속력·시간을 먼저 골라 거리를 곱셈으로 만든다 — 나눗셈이 안 떨어지는 자리가 없다. */
    const v1 = pick(rng, [3, 4, 5, 6]);
    const v2 = v1 + pick(rng, [2, 3, 4]);
    const t = R(rng, 2, 5);              /* 답: 시간 */
    const d = v2 * t - v1 * t;           /* 두 속력의 거리 차 */
    return wordItem(
      L3(`${nm[0]}${nm[3]} 같은 길을 시속 ${v1}km로 걸어가면, 시속 ${v2}km로 자전거를 탈 때보다 ${d}km만큼 덜 간다고 해요. 걸린 시간은 두 경우 모두 같아요.`,
         `Along the same road, ${nm[1]} walking at ${v1} km/h covers ${d} km less than cycling at ${v2} km/h. The time taken is the same in both cases.`,
         `在同一条路上，${nm[2]}以每小时${v1}km步行，比以每小时${v2}km骑车少走${d}km。两种情况用的时间相同。`),
      L3('걸린 시간은 몇 시간일까요?', 'How many hours did it take?', '用了几个小时？'),
      L3('시간', 'hours', '小时'),
      t,
      [
        { tex: `\\text{거리} = \\text{속력} \\times \\text{시간}` },
        { tex: `${v2}x - ${v1}x = ${d}` },
        { tex: `${v2 - v1}x = ${d} \\quad\\Rightarrow\\quad x = \\square`, blank: t }
      ]
    );
  }

  if (mode === 'price') {
    /* 원가와 이율을 먼저 골라 정가를 계산 — 정가·할인가가 모두 정수로 떨어진다. */
    /* (원가, 이익률, 할인율) 은 세 조건을 **다 만족하는 조합만** 쓴다(전수 점검에서 둘 다 걸렸다):
         ① 정가·판매가가 모두 정수    — 2500원에 25% 올리고 10% 깎으면 2812.5원이 된다
         ② 이익이 0보다 크다          — 20% 올리고 20% 내리면 1.2×0.8=0.96 이라 손해다
       "이익은 얼마인가"를 묻는데 답이 소수이거나 음수이면 문항이 성립하지 않는다. */
    const COSTS = [2000, 2500, 3000, 4000, 5000, 6000];
    const PAIRS = [[20, 10], [25, 10], [40, 10], [50, 10], [40, 20], [50, 20], [25, 20]];
    const okList = [];
    for (const cc of COSTS) for (const pr of PAIRS) {
      const mk = cc * (100 + pr[0]) / 100;
      const sl = mk * (100 - pr[1]) / 100;
      if (Number.isInteger(mk) && Number.isInteger(sl) && sl - cc > 0) okList.push([cc, pr[0], pr[1], mk, sl]);
    }
    const ch = okList.length ? pick(rng, okList) : [2000, 20, 10, 2400, 2160];
    const cost = ch[0], up = ch[1], off = ch[2], marked = ch[3], sell = ch[4];
    const profit = sell - cost;
    return wordItem(
      L3(`어떤 물건의 원가가 ${cost}원이에요. 원가에 ${up}%의 이익을 붙여 정가를 정했는데, 잘 팔리지 않아 정가에서 ${off}%를 할인해 팔았어요.`,
         `An item costs ${cost} won to buy. The price was set ${up}% above cost, but it did not sell, so it was marked down by ${off}% from that price.`,
         `某商品的成本是${cost}元。按成本加价${up}%定价，但卖不动，于是在定价基础上打了${off}%的折扣出售。`),
      L3('이때 생긴 이익은 얼마일까요?', 'How much profit was made?', '这时获得的利润是多少？'),
      L3('원', 'won', '元'),
      profit,
      [
        { tex: `\\text{정가} = ${cost} \\times \\dfrac{${100 + up}}{100} = \\square`, blank: marked },
        { tex: `\\text{판매가} = ${marked} \\times \\dfrac{${100 - off}}{100} = \\square`, blank: sell },
        { tex: `${sell} - ${cost} = \\square`, blank: profit }
      ]
    );
  }

  /* number(기본) — 연속하는 수·나이. 답을 먼저 정하고 합을 역산한다. */
  const kind = pick(rng, ['consec', 'age']);
  if (kind === 'consec') {
    const n = R(rng, 5, 30);                  /* 답: 가운데 수 */
    const sum = (n - 1) + n + (n + 1);
    return wordItem(
      L3(`연속하는 세 자연수가 있어요. 세 수의 합은 ${sum}이에요.`,
         `There are three consecutive whole numbers. Their sum is ${sum}.`,
         `有三个连续的自然数，它们的和是${sum}。`),
      L3('가운데 수는 얼마일까요?', 'What is the middle number?', '中间的数是多少？'),
      null, n,
      [
        { tex: `(x-1) + x + (x+1) = ${sum}` },
        { tex: `3x = ${sum} \\quad\\Rightarrow\\quad x = \\square`, blank: n }
      ]
    );
  }
  const child = R(rng, 8, 14);                /* 답: 지금 아이 나이 */
  const mult = pick(rng, [3, 4]);
  const parent = child * mult;
  const yr = R(rng, 4, 10);
  return wordItem(
    L3(`올해 ${nm[0]}의 아버지의 나이는 ${nm[0]}의 나이의 ${mult}배이고, ${yr}년 뒤에는 아버지가 ${parent + yr}살이 돼요.`,
       `This year ${nm[1]}'s father is ${mult} times as old as ${nm[1]}, and in ${yr} years the father will be ${parent + yr}.`,
       `今年${nm[2]}父亲的年龄是${nm[2]}的${mult}倍，${yr}年后父亲将是${parent + yr}岁。`),
    L3(`올해 ${nm[0]}는 몇 살일까요?`, `How old is ${nm[1]} this year?`, `${nm[2]}今年几岁？`),
    L3('살', 'years old', '岁'),
    child,
    [
      { tex: `${mult}x + ${yr} = ${parent + yr}` },
      { tex: `${mult}x = ${parent} \\quad\\Rightarrow\\quad x = \\square`, blank: child }
    ]
  );
};

/* ============================================================
   B. 중2 — 부등식·연립의 활용 · 함수 · 일차함수 세부
   ============================================================ */

/* ── MD71 — 일차부등식의 활용 ──
   mode: 'maxCount'(최대 개수) · 'average'(평균 조건) · 'compare'(요금 비교). */
NM_TGEN['md71_inequalityApply'] = function (params, rng) {
  const mode = params.mode || 'maxCount';
  const NAMES = [['지호','Jiho','智浩','가'], ['수아','Sua','秀雅','가'], ['민준','Minjun','敏俊','이']];
  const nm = pick(rng, NAMES);

  if (mode === 'average') {
    /* 평균 조건 — 네 번째 점수를 답으로 두고 합을 역산 */
    const want = pick(rng, [80, 85, 90]);
    const need = R(rng, 70, 98);              /* 답: 마지막 시험에서 받아야 하는 점수 */
    const total = want * 4;
    const got = total - need;
    const a = Math.min(100, R(rng, 60, 95));
    const b = Math.min(100, Math.max(0, Math.round((got - a) / 2)));
    const c = got - a - b;
    if (c < 0 || c > 100) {                   /* 배분이 어긋나면 균등하게 */
      const e = Math.floor(got / 3);
      return wordItem(
        L3(`${nm[0]}는 세 번의 시험에서 ${e}점, ${e}점, ${got - 2 * e}점을 받았어요. 네 번의 평균이 ${want}점 이상이 되게 하려고 해요.`,
           `${nm[1]} scored ${e}, ${e} and ${got - 2 * e} on three tests, and wants the average of four tests to be at least ${want}.`,
           `${nm[2]}三次考试得了${e}分、${e}分、${got - 2 * e}分，希望四次的平均分不低于${want}分。`),
        L3('네 번째 시험에서 적어도 몇 점을 받아야 할까요?', 'What is the lowest score needed on the fourth test?', '第四次考试至少要得多少分？'),
        L3('점', 'points', '分'), need,
        [
          { tex: `\\dfrac{${got} + x}{4} \\ge ${want}` },
          { tex: `${got} + x \\ge ${total} \\quad\\Rightarrow\\quad x \\ge \\square`, blank: need }
        ]
      );
    }
    return wordItem(
      L3(`${nm[0]}는 세 번의 시험에서 ${a}점, ${b}점, ${c}점을 받았어요. 네 번의 평균이 ${want}점 이상이 되게 하려고 해요.`,
         `${nm[1]} scored ${a}, ${b} and ${c} on three tests, and wants the average of four tests to be at least ${want}.`,
         `${nm[2]}三次考试得了${a}分、${b}分、${c}分，希望四次的平均分不低于${want}分。`),
      L3('네 번째 시험에서 적어도 몇 점을 받아야 할까요?', 'What is the lowest score needed on the fourth test?', '第四次考试至少要得多少分？'),
      L3('점', 'points', '分'), need,
      [
        { tex: `\\dfrac{${a} + ${b} + ${c} + x}{4} \\ge ${want}` },
        { tex: `${got} + x \\ge ${total} \\quad\\Rightarrow\\quad x \\ge \\square`, blank: need }
      ]
    );
  }

  if (mode === 'compare') {
    /* 두 요금제가 같아지는 지점 — 기본요금 차를 단가 차로 나누면 딱 떨어지게 잡는다 */
    const base = pick(rng, [2, 3, 4]) * 1000;
    const p1 = pick(rng, [700, 800, 900]);    /* 회원: 기본요금 + 싼 단가 */
    const p2 = p1 + pick(rng, [200, 250, 500]);
    const n = base / (p2 - p1);               /* 같아지는 개수 */
    const ans = Math.floor(n) + 1;            /* 답: 회원이 유리해지는 최소 개수 */
    return wordItem(
      L3(`어느 가게에서 회원은 연회비 ${base}원을 내고 물건을 한 개에 ${p1}원에 사고, 회원이 아니면 한 개에 ${p2}원에 사요.`,
         `At a shop, members pay a ${base} won yearly fee and then ${p1} won per item, while non-members pay ${p2} won per item.`,
         `某店会员缴纳年费${base}元后每件${p1}元，非会员每件${p2}元。`),
      L3('몇 개부터 회원으로 사는 것이 더 유리할까요?', 'From how many items on is membership cheaper?', '买几件以上办会员更划算？'),
      L3('개', 'items', '件'), ans,
      [
        { tex: `${base} + ${p1}x < ${p2}x` },
        { tex: `${base} < ${p2 - p1}x \\quad\\Rightarrow\\quad x > ${n}` },
        { tex: `\\text{가장 작은 정수} = \\square`, blank: ans }
      ]
    );
  }

  /* maxCount(기본) — 예산 안에서 최대 개수 */
  const price = pick(rng, [700, 800, 1200, 1500]);
  const cnt = R(rng, 4, 12);                  /* 답 */
  /* 남는 돈도 100원 단위로 — 4667원 같은 금액은 현실에 없다(첫 판에서 나왔다). */
  const budget = price * cnt + R(rng, 0, Math.floor((price - 100) / 100)) * 100;
  return wordItem(
    L3(`한 개에 ${price}원인 공책을 ${budget}원으로 사려고 해요.`,
       `Notebooks cost ${price} won each, and there is ${budget} won to spend.`,
       `笔记本每本${price}元，现有${budget}元。`),
    L3('최대 몇 권까지 살 수 있을까요?', 'What is the greatest number that can be bought?', '最多能买几本？'),
    L3('권', 'notebooks', '本'), cnt,
    [
      { tex: `${price}x \\le ${budget}` },
      { tex: `x \\le \\dfrac{${budget}}{${price}}` },
      { tex: `\\text{가장 큰 정수} = \\square`, blank: cnt }
    ]
  );
};

/* ── MD72 — 연립방정식의 활용 ──
   mode: 'countSum'(개수와 합) · 'speed'(거리·속력·시간) · 'mixture'(농도). */
NM_TGEN['md72_systemApply'] = function (params, rng) {
  const mode = params.mode || 'countSum';

  if (mode === 'speed') {
    /* 갈 때와 올 때 속력이 다른 왕복 — 두 구간의 시간을 먼저 정해 거리를 만든다 */
    const v1 = pick(rng, [2, 3, 4]);
    const v2 = pick(rng, [5, 6, 8].filter(v => v !== v1));
    const t1 = R(rng, 1, 3), t2 = R(rng, 1, 3);
    const d1 = v1 * t1, d2 = v2 * t2;
    return wordItem(
      L3(`등산을 하는데 올라갈 때는 가파른 길을 시속 ${v1}km로, 내려올 때는 다른 길을 시속 ${v2}km로 걸었어요. 걸은 거리는 모두 ${d1 + d2}km이고, 걸린 시간은 모두 ${t1 + t2}시간이에요.`,
         `On a hike the steep way up was walked at ${v1} km/h and a different way down at ${v2} km/h. The whole walk was ${d1 + d2} km and took ${t1 + t2} hours.`,
         `爬山时沿陡路上山每小时${v1}km，下山走另一条路每小时${v2}km。走的总路程是${d1 + d2}km，总共用了${t1 + t2}小时。`),
      L3('올라간 거리는 몇 km일까요?', 'How many km was the climb?', '上山的路程是多少km？'),
      L3('km', 'km', 'km'), d1,
      [
        { tex: `x + y = ${d1 + d2}` },
        { tex: `\\dfrac{x}{${v1}} + \\dfrac{y}{${v2}} = ${t1 + t2}` },
        { tex: `x = \\square`, blank: d1 }
      ]
    );
  }

  if (mode === 'mixture') {
    /* 농도 문제는 **섞은 농도까지 정수**여야 교재의 말이 된다(9.5% 같은 농도는 안 쓴다).
       그래서 (p1, p2, a, b) 네 값을 한꺼번에 훑어 조건을 만족하는 짝만 쓴다:
         ① 소금의 양 a·p1/100 과 b·p2/100 이 정수   ② 섞은 농도 (a·p1+b·p2)/(a+b) 가 정수
       전수 점검에서 소수 농도가 나온 뒤 이렇게 바꿨다. a=b 는 답이 절반으로 뻔해 뒤로 미룬다. */
    const PCT = [4, 5, 6, 8, 10, 12, 15, 20];
    const AMTS = [100, 200, 300, 400, 500];
    const cands = [];
    for (const q1 of PCT) for (const q2 of PCT) {
      if (q2 <= q1) continue;
      for (const A of AMTS) for (const B of AMTS) {
        const s1 = A * q1 / 100, s2 = B * q2 / 100;
        const pm = (A * q1 + B * q2) / (A + B);
        if (Number.isInteger(s1) && Number.isInteger(s2) && Number.isInteger(pm) && A !== B)
          cands.push([q1, q2, A, B, s1 + s2, pm]);
      }
    }
    const c = cands.length ? pick(rng, cands) : [5, 15, 100, 300, 50, 12.5];
    const p1 = c[0], p2 = c[1], a = c[2], b = c[3], salt = c[4], pMix = c[5];
    return wordItem(
      L3(`${p1}%의 소금물과 ${p2}%의 소금물을 섞어 ${pMix}%의 소금물 ${a + b}g을 만들었어요.`,
         `Salt water at ${p1}% and at ${p2}% were mixed to make ${a + b} g of ${pMix}% salt water.`,
         `把${p1}%的盐水和${p2}%的盐水混合，配成了${a + b}g的${pMix}%盐水。`),
      L3(`${p1}%의 소금물은 몇 g 썼을까요?`, `How many grams of the ${p1}% solution were used?`, `用了多少g的${p1}%盐水？`),
      L3('g', 'g', 'g'),
      a,
      [
        { tex: `x + y = ${a + b}` },
        { tex: `\\dfrac{${p1}}{100}x + \\dfrac{${p2}}{100}y = ${salt}` },
        { tex: `x = \\square`, blank: a }
      ]
    );
  }

  /* countSum(기본) — 개수와 금액(또는 다리 수) */
  const a = R(rng, 3, 12), b = R(rng, 3, 12);
  const pa = pick(rng, [500, 800, 1000]);
  const pb = pick(rng, [1200, 1500, 2000]);
  return wordItem(
    L3(`한 개에 ${pa}원인 사탕과 한 개에 ${pb}원인 초콜릿을 모두 ${a + b}개 사고 ${pa * a + pb * b}원을 냈어요.`,
       `Candies cost ${pa} won each and chocolates ${pb} won each. Buying ${a + b} of them altogether cost ${pa * a + pb * b} won.`,
       `糖果每个${pa}元、巧克力每个${pb}元，一共买了${a + b}个，付了${pa * a + pb * b}元。`),
    L3('사탕은 몇 개 샀을까요?', 'How many candies were bought?', '买了几个糖果？'),
    L3('개', 'candies', '个'), a,
    [
      { tex: `x + y = ${a + b}` },
      { tex: `${pa}x + ${pb}y = ${pa * a + pb * b}` },
      { tex: `x = \\square`, blank: a }
    ]
  );
};

/* ── MD73 — 함수와 함숫값 ──
   일차함수를 배우기 전에 f(x) 표기가 먼저다. 그게 없어서 MD65 가 갑자기
   "기울기"부터 시작하고 있었다.
   mode: 'value'(f(k) 구하기) · 'inverse'(f(k)=m 에서 k 찾기) ·
   'findCoef'(두 함숫값으로 a·b 구하기, 2칸). */
NM_TGEN['md73_functionValue'] = function (params, rng) {
  const mode = params.mode || 'value';
  const a = nzInt(rng, 1, params.wide ? 6 : 4);
  const b = nzInt(rng, 1, params.wide ? 9 : 6);

  if (mode === 'inverse') {
    const k = nzInt(rng, 1, 7);
    const m = a * k + b;
    return {
      prompt: { ko: `f(x)의 값이 정해져 있을 때 x를 찾는 건 일차방정식을 푸는 것과 같아요`,
        en: `Finding x when f(x) is given is the same as solving a linear equation`,
        zh: `已知f(x)的值求x，和解一元一次方程是一回事` },
      tex: `f(x) = ${coefLead(a)}x ${wrapPlus(b)}, \\quad f(x) = ${m} \\quad\\Rightarrow\\quad x = \\square`,
      answer: k, answerType: 'number', widget: 'numpad', negative: k < 0,
      solution: [
        { tex: `${coefLead(a)}x ${wrapPlus(b)} = ${m}` },
        { tex: `${coefLead(a)}x = ${m - b} \\quad\\Rightarrow\\quad x = \\square`, blank: k }
      ]
    };
  }

  if (mode === 'findCoef') {
    const f1 = a + b, f2 = 2 * a + b;
    return {
      prompt: { ko: `두 함숫값을 빼면 a가, 그 a를 되넣으면 b가 나와요 — 작은 순서대로 a, b를 입력해요`,
        en: `Subtracting the two values gives a; putting a back gives b — enter a first, then b`,
        zh: `两个函数值相减得a，把a代回去得b——先输入a，再输入b` },
      tex: `f(1) = ${f1}, \\quad f(2) = ${f2} \\quad\\Rightarrow\\quad f(x) = \\square x + \\square`,
      answer: [a, b], answerType: 'number', widget: 'numpad', negative: hasNeg([a, b]),
      solution: [
        { tex: `f(2) - f(1) = ${f2} - (${f1}) = \\square`, blank: a },
        { tex: `b = ${f1} - (${a}) = \\square`, blank: b },
        { tex: `f(x) = \\square x + \\square`, blank: [a, b] }
      ]
    };
  }

  /* value(기본) — f(k) 구하기 */
  const k = nzInt(rng, 1, 7);
  const v = a * k + b;
  return {
    prompt: { ko: `f(x)의 x 자리에 수를 그대로 넣어 계산해요 — 음수를 넣을 땐 괄호로 감싸요`,
      en: `Put the number straight into the x slot of f(x) — wrap a negative in brackets`,
      zh: `把数直接代入f(x)的x的位置——代入负数时要加括号` },
    tex: `f(x) = ${coefLead(a)}x ${wrapPlus(b)} \\quad\\Rightarrow\\quad f(${k}) = \\square`,
    answer: v, answerType: 'number', widget: 'numpad', negative: v < 0,
    solution: [
      { tex: `${coefLead(a)}(${k}) ${wrapPlus(b)}` },
      { tex: `${a * k} ${wrapPlus(b)} = \\square`, blank: v }
    ]
  };
};

/* ── MD74 — 일차함수의 그래프와 절편 ──
   MD65 가 기울기·절편·식·그래프를 다 안고 있었다. 그 앞 단계 — **y=ax 를
   위아래로 옮기면 y=ax+b 가 된다**는 평행이동과, x절편·y절편 — 을 떼어 낸다.
   mode: 'translate'(평행이동한 식) · 'intercepts'(x절편·y절편 2칸) ·
   'readIntercepts'(그래프에서 두 절편 읽기, 2칸). */
NM_TGEN['md74_lineGraph'] = function (params, rng) {
  const mode = params.mode || 'translate';

  if (mode === 'intercepts') {
    /* x절편이 정수로 떨어지도록 b 를 a 의 배수로 잡는다 */
    const a = pick(rng, [1, 2, 3, 4, -1, -2, -3, -4]);
    const xi = nzInt(rng, 1, 5);          /* 답: x절편 */
    const b = -a * xi;                    /* y절편 */
    return {
      prompt: { ko: `x절편은 y=0일 때의 x, y절편은 x=0일 때의 y예요 — x절편부터 차례로 입력해요`,
        en: `The x-intercept is x when y=0, the y-intercept is y when x=0 — enter the x-intercept first`,
        zh: `x截距是y=0时的x，y截距是x=0时的y——先输入x截距` },
      tex: `y = ${coefLead(a)}x ${wrapPlus(b)} \\quad\\Rightarrow\\quad \\text{x절편} \\square, \\quad \\text{y절편} \\square`,
      answer: [xi, b], answerType: 'number', widget: 'numpad', negative: hasNeg([xi, b]),
      solution: [
        { tex: `y = 0 \\quad\\Rightarrow\\quad ${coefLead(a)}x ${wrapPlus(b)} = 0` },
        { tex: `x = \\square`, blank: xi },
        { tex: `x = 0 \\quad\\Rightarrow\\quad y = \\square`, blank: b },
        { tex: `\\text{x절편} \\square, \\quad \\text{y절편} \\square`, blank: [xi, b] }
      ]
    };
  }

  if (mode === 'readIntercepts') {
    /* y절편 b = -a·xi 가 상자(|y|≤8) 를 벗어나면 **눈으로 읽을 수가 없다** — 전수 점검에서
       (0, ±9)·(0, ±12) 가 나왔다. 기울기를 먼저 고르고 x절편을 그 범위 안에서 뽑는다. */
    const a = pick(rng, [1, 2, -1, -2]);
    const lim = Math.floor(8 / Math.abs(a));
    const xi = R(rng, 1, Math.min(4, lim)) * pick(rng, [1, -1]);
    const b = -a * xi;
    return {
      prompt: { ko: `그래프가 x축을 지나는 자리가 x절편, y축을 지나는 자리가 y절편이에요`,
        en: `Where the graph crosses the x-axis is the x-intercept; where it crosses the y-axis is the y-intercept`,
        zh: `图象与x轴相交处是x截距，与y轴相交处是y截距` },
      tex: `\\text{x절편} \\square, \\quad \\text{y절편} \\square`,
      answer: [xi, b], answerType: 'number', widget: 'graphPlane', negative: hasNeg([xi, b]),
      graph: { kind: 'line', m: a, b: b, pts: [[xi, 0], [0, b]], xr: [-6, 6], yr: [-8, 8] },
      solution: [
        { tex: `\\text{x축과 만나는 곳} \\quad\\Rightarrow\\quad \\square`, blank: xi },
        { tex: `\\text{y축과 만나는 곳} \\quad\\Rightarrow\\quad \\square`, blank: b },
        { tex: `\\text{x절편} \\square, \\quad \\text{y절편} \\square`, blank: [xi, b] }
      ]
    };
  }

  /* translate(기본) — y=ax 를 q 만큼 평행이동 */
  const a = nzInt(rng, 1, 5);
  const q = nzInt(rng, 1, 8);
  return {
    prompt: { ko: `y=ax의 그래프를 위아래로 옮겨도 기울기는 그대로예요 — y절편만 그만큼 움직여요`,
      en: `Sliding the graph of y=ax up or down leaves the slope unchanged — only the y-intercept moves`,
      zh: `把y=ax的图象上下平移，斜率不变——只有y截距移动` },
    tex: `y = ${coefLead(a)}x \\quad\\text{를 } ${q > 0 ? `${q}\\text{만큼 위로}` : `${Math.abs(q)}\\text{만큼 아래로}`} \\quad\\Rightarrow\\quad y = ${coefLead(a)}x + \\square`,
    answer: q, answerType: 'number', widget: 'numpad', negative: q < 0,
    solution: [
      { tex: `\\text{기울기} = ${a} \\quad (\\text{그대로})` },
      { tex: `\\text{y절편} = \\square`, blank: q }
    ]
  };
};

/* ── MD75 — 일차함수와 일차방정식 ──
   "직선의 방정식 ax+by+c=0 이 사실은 일차함수"라는 것과, **두 직선의 교점이
   연립방정식의 해**라는 것 — 중2 함수 단원의 마무리다.
   mode: 'toSlope'(일반형 → y=ax+b, 2칸) · 'intersect'(두 직선의 교점, 2칸) ·
   'parallel'(평행 조건으로 계수 결정). */
NM_TGEN['md75_lineEquation'] = function (params, rng) {
  const mode = params.mode || 'toSlope';

  if (mode === 'intersect') {
    /* 교점을 먼저 정하고 두 직선을 그 점 위에서 만든다 */
    const x = nzInt(rng, 1, 4), y = nzInt(rng, 1, 4);
    const m1 = pick(rng, [1, 2, 3, -1, -2]);
    let m2 = pick(rng, [1, 2, 3, -1, -2]);
    let guard = 0;
    while (m2 === m1 && guard++ < 20) m2 = pick(rng, [1, 2, 3, -1, -2, -3]);
    if (m2 === m1) m2 = m1 + 1;
    /* y절편이 0 이면 식에 `+ 0` 이 찍힌다 — 교점의 y 를 한 칸씩 밀어 둘 다 0 을 피한다.
       x 는 그대로라 두 직선은 여전히 (x, y) 에서 만난다. */
    let yy = y, g2 = 0;
    while ((yy - m1 * x === 0 || yy - m2 * x === 0) && g2++ < 12) yy = yy + 1;
    const b1 = yy - m1 * x, b2 = yy - m2 * x;
    return {
      prompt: { ko: `두 직선이 만나는 점은 두 식을 모두 만족해요 — 연립방정식의 해와 같아요`,
        en: `The point where two lines meet satisfies both equations — it is the solution of the system`,
        zh: `两直线的交点同时满足两个式子——就是方程组的解` },
      tex: `y = ${coefLead(m1)}x ${wrapPlus(b1)}, \\quad y = ${coefLead(m2)}x ${wrapPlus(b2)} \\quad\\Rightarrow\\quad \\left(\\square,\\, \\square\\right)`,
      answer: [x, yy], answerType: 'number', widget: 'graphPlane', negative: hasNeg([x, yy]),
      graph: { kind: 'line', m: m1, b: b1, pts: [[x, yy]], xr: [-6, 6], yr: [-8, 8] },
      solution: [
        { tex: `${coefLead(m1)}x ${wrapPlus(b1)} = ${coefLead(m2)}x ${wrapPlus(b2)}` },
        { tex: `x = \\square`, blank: x },
        { tex: `y = \\square`, blank: yy },
        { tex: `\\left(\\square,\\, \\square\\right)`, blank: [x, yy] }
      ]
    };
  }

  if (mode === 'parallel') {
    /* 평행 = 기울기가 같다. y=ax+b 와 kx+... 의 계수를 맞춘다. */
    const a = pick(rng, [2, 3, 4, 5, -2, -3]);
    const d = pick(rng, [2, 3, 4]);
    const k = a * d;                      /* 답: kx - dy + c = 0 이 기울기 a 가 되는 k */
    const c = nzInt(rng, 1, 9);
    return {
      prompt: { ko: `두 직선이 평행하려면 기울기가 같아야 해요 — 일반형을 y=ax+b 꼴로 고쳐 기울기를 비교해요`,
        en: `Two lines are parallel when their slopes match — rewrite the general form as y=ax+b and compare`,
        zh: `两直线平行就是斜率相同——把一般式改写成y=ax+b再比较斜率` },
      tex: `\\square x - ${d}y ${wrapPlus(c)} = 0 \\quad\\text{가} \\quad y = ${coefLead(a)}x \\quad\\text{와 평행}`,
      answer: k, answerType: 'number', widget: 'numpad', negative: k < 0,
      solution: [
        { tex: `${d}y = kx ${wrapPlus(c)} \\quad\\Rightarrow\\quad y = \\dfrac{k}{${d}}x + \\dfrac{${c}}{${d}}` },
        { tex: `\\dfrac{k}{${d}} = ${a} \\quad\\Rightarrow\\quad k = \\square`, blank: k }
      ]
    };
  }

  /* toSlope(기본) — ax+by+c=0 을 y=mx+n 으로 */
  const m = nzInt(rng, 1, 5);
  const n = nzInt(rng, 1, 8);
  const d = pick(rng, [1, 2, 3]);
  const A = -m * d, B = d, C = -n * d;    /* Ax + By + C = 0 ⟺ y = mx + n */
  return {
    prompt: { ko: `y의 항만 왼쪽에 남기고 나머지를 옮긴 뒤, y의 계수로 나눠요`,
      en: `Keep only the y term on one side, move the rest across, then divide by the coefficient of y`,
      zh: `只把y的项留在一边，其余移过去，再除以y的系数` },
    tex: `${coefLead(A)}x + ${coefLead(B)}y ${wrapPlus(C)} = 0 \\quad\\Rightarrow\\quad y = \\square x + \\square`,
    answer: [m, n], answerType: 'number', widget: 'numpad', negative: hasNeg([m, n]),
    solution: [
      { tex: `${coefLead(B)}y = ${coefLead(-A)}x ${wrapPlus(-C)}` },
      { tex: `y = \\square x + \\square`, blank: [m, n] }
    ]
  };
};

/* ── MD76 — 일차함수의 활용 ──
   "변화하는 두 양"을 식으로 세우는 자리. 처음 값이 y절편, 한 단위마다 변하는
   양이 기울기다. mode: 'water'(물통) · 'candle'(양초) · 'fee'(요금). */
NM_TGEN['md76_lineApply'] = function (params, rng) {
  const mode = params.mode || 'water';

  if (mode === 'candle') {
    const h0 = pick(rng, [20, 24, 30]);
    const rate = pick(rng, [2, 3, 4]).valueOf();
    /* 다 타 버리면(0 이하) 물어볼 것이 없다 — 반드시 조금 남는 시각만 고른다. */
    const tMax = Math.max(2, Math.ceil(h0 / rate) - 1);
    const t = R(rng, 2, Math.max(2, Math.min(6, tMax)));
    const left = h0 - rate * t;
    if (left <= 0) {
      const t2 = Math.max(1, Math.ceil(h0 / rate) - 1);
      return wordItem(
        L3(`길이가 ${h0}cm인 양초에 불을 붙이면 1분에 ${rate}cm씩 짧아져요.`,
           `A candle ${h0} cm long burns down ${rate} cm every minute.`,
           `长${h0}cm的蜡烛点燃后每分钟缩短${rate}cm。`),
        L3(`${t2}분 뒤 양초의 길이는 몇 cm일까요?`, `How long is the candle after ${t2} minutes?`, `${t2}分钟后蜡烛长多少cm？`),
        L3('cm', 'cm', 'cm'), h0 - rate * t2,
        [
          { tex: `y = ${h0} - ${rate}x` },
          { tex: `y = ${h0} - ${rate} \\times ${t2} = \\square`, blank: h0 - rate * t2 }
        ]
      );
    }
    return wordItem(
      L3(`길이가 ${h0}cm인 양초에 불을 붙이면 1분에 ${rate}cm씩 짧아져요.`,
         `A candle ${h0} cm long burns down ${rate} cm every minute.`,
         `长${h0}cm的蜡烛点燃后每分钟缩短${rate}cm。`),
      L3(`${t}분 뒤 양초의 길이는 몇 cm일까요?`, `How long is the candle after ${t} minutes?`, `${t}分钟后蜡烛长多少cm？`),
      L3('cm', 'cm', 'cm'), left,
      [
        { tex: `y = ${h0} - ${rate}x` },
        { tex: `y = ${h0} - ${rate} \\times ${t} = \\square`, blank: left }
      ]
    );
  }

  if (mode === 'fee') {
    const base = pick(rng, [1200, 1500, 2000]);
    const per = pick(rng, [100, 150, 200]);
    const n = R(rng, 3, 12);
    const total = base + per * n;
    return wordItem(
      L3(`어느 주차장은 기본요금 ${base}원에 10분마다 ${per}원씩 더 받아요.`,
         `A car park charges a base fee of ${base} won plus ${per} won for every 10 minutes.`,
         `某停车场基本收费${base}元，每10分钟再加${per}元。`),
      L3(`${n * 10}분을 주차하면 요금은 얼마일까요?`, `What is the charge for ${n * 10} minutes?`, `停${n * 10}分钟要多少钱？`),
      L3('원', 'won', '元'), total,
      [
        { tex: `y = ${base} + ${per}x` },
        { tex: `y = ${base} + ${per} \\times ${n} = \\square`, blank: total }
      ]
    );
  }

  /* water(기본) — 물통에 물을 넣는다 */
  const v0 = pick(rng, [5, 10, 15, 20]);
  const rate = pick(rng, [2, 3, 4, 5]);
  const t = R(rng, 3, 10);
  const v = v0 + rate * t;
  return wordItem(
    L3(`물이 ${v0}L 들어 있는 물통에 1분에 ${rate}L씩 물을 넣어요.`,
       `A tank already holds ${v0} L of water, and ${rate} L is added every minute.`,
       `水桶里已有${v0}L水，每分钟再加${rate}L。`),
    L3(`${t}분 뒤 물의 양은 몇 L일까요?`, `How many litres are in the tank after ${t} minutes?`, `${t}分钟后水有多少L？`),
    L3('L', 'L', 'L'), v,
    [
      { tex: `y = ${v0} + ${rate}x` },
      { tex: `y = ${v0} + ${rate} \\times ${t} = \\square`, blank: v }
    ]
  );
};

/* ============================================================
   C. 중3 — 이차방정식의 활용 · 이차함수 세부
   ============================================================ */

/* ── MD77 — 이차방정식의 활용 ──
   mode: 'consecutive'(연속하는 두 수) · 'area'(도형의 넓이) ·
   'projectile'(쏘아 올린 물체). */
NM_TGEN['md77_quadApply'] = function (params, rng) {
  const mode = params.mode || 'consecutive';

  if (mode === 'area') {
    /* 가로가 세로보다 d 만큼 긴 직사각형 — 세로를 답으로 두고 넓이를 만든다 */
    const h = R(rng, 3, 12);
    const d = pick(rng, [2, 3, 4, 5]);
    const area = h * (h + d);
    return wordItem(
      L3(`가로가 세로보다 ${d}cm 더 긴 직사각형이 있어요. 이 직사각형의 넓이는 ${area}cm²예요.`,
         `A rectangle is ${d} cm wider than it is tall, and its area is ${area} cm².`,
         `一个长方形的长比宽多${d}cm，面积是${area}cm²。`),
      L3('세로의 길이는 몇 cm일까요?', 'How tall is the rectangle?', '宽是多少cm？'),
      L3('cm', 'cm', 'cm'), h,
      [
        { tex: `x(x + ${d}) = ${area}` },
        { tex: `x^2 + ${d}x - ${area} = 0` },
        { tex: `(x - ${h})(x + ${h + d}) = 0 \\quad\\Rightarrow\\quad x = \\square`, blank: h }
      ]
    );
  }

  if (mode === 'projectile') {
    /* 높이 y = vt - 5t² 꼴 — 땅에 떨어지는 시각을 답으로 */
    const t = R(rng, 2, 8);
    const v = 5 * t;                       /* y = vt - 5t² = 0 ⟹ t = v/5 */
    return wordItem(
      L3(`지면에서 초속 ${v}m로 똑바로 위로 쏘아 올린 물체의 t초 뒤 높이는 (${v}t − 5t²)m예요.`,
         `An object shot straight up from the ground at ${v} m/s is (${v}t − 5t²) m high after t seconds.`,
         `从地面以每秒${v}m竖直向上抛出的物体，t秒后的高度是(${v}t − 5t²)m。`),
      L3('이 물체가 다시 지면에 떨어지는 것은 몇 초 뒤일까요?', 'After how many seconds does it hit the ground again?', '几秒后物体重新落到地面？'),
      L3('초', 'seconds', '秒'), t,
      [
        { tex: `${v}t - 5t^2 = 0` },
        { tex: `t(${v} - 5t) = 0` },
        { tex: `t = \\square \\quad (t \\ne 0)`, blank: t }
      ]
    );
  }

  /* consecutive(기본) — 연속하는 두 자연수의 곱 */
  const n = R(rng, 4, 15);
  const prod = n * (n + 1);
  return wordItem(
    L3(`연속하는 두 자연수의 곱이 ${prod}이에요.`,
       `The product of two consecutive whole numbers is ${prod}.`,
       `两个连续自然数的乘积是${prod}。`),
    L3('두 수 중 작은 수는 얼마일까요?', 'What is the smaller of the two numbers?', '较小的那个数是多少？'),
    null, n,
    [
      { tex: `x(x + 1) = ${prod}` },
      { tex: `x^2 + x - ${prod} = 0` },
      { tex: `(x - ${n})(x + ${n + 1}) = 0 \\quad\\Rightarrow\\quad x = \\square`, blank: n }
    ]
  );
};

/* ── MD78 — 이차함수 y=ax²의 그래프 ──
   MD67 은 곧바로 꼭짓점부터였다. 그 앞 — **가장 단순한 포물선 y=ax²** —
   을 떼어 낸다. mode: 'value'(함숫값) · 'findA'(지나는 점으로 a) ·
   'readA'(그래프에서 a 읽기). */
NM_TGEN['md78_quadBasic'] = function (params, rng) {
  const mode = params.mode || 'value';

  if (mode === 'findA') {
    const a = pick(rng, [1, 2, 3, -1, -2, -3]);
    const x = pick(rng, [1, 2, 3]);
    const y = a * x * x;
    return {
      prompt: { ko: `점의 좌표를 y=ax²에 넣으면 a만 남아요 — x를 제곱한 값으로 y를 나눠요`,
        en: `Substituting the point into y=ax² leaves only a — divide y by x squared`,
        zh: `把点的坐标代入y=ax²只剩下a——用y除以x的平方` },
      tex: `y = ax^2 \\text{가 } \\left(${x},\\, ${y}\\right) \\text{를 지남} \\quad\\Rightarrow\\quad a = \\square`,
      answer: a, answerType: 'number', widget: 'numpad', negative: a < 0,
      solution: [
        { tex: `${y} = a \\times ${x}^2` },
        { tex: `a = ${y} \\div ${x * x} = \\square`, blank: a }
      ]
    };
  }

  if (mode === 'readA') {
    const a = pick(rng, [1, 2, -1, -2]);
    const px = Math.abs(a) === 1 ? 2 : 2;
    return {
      prompt: { ko: `y=ax²의 그래프는 원점이 꼭짓점이에요 — 지나는 점 하나로 a를 구해요`,
        en: `The graph of y=ax² has its vertex at the origin — one point on it gives a`,
        zh: `y=ax²的图象顶点在原点——用图象上的一个点求出a` },
      tex: `y = \\square x^2`,
      answer: a, answerType: 'number', widget: 'graphPlane', negative: a < 0,
      graph: { kind: 'parabola', a: a, p: 0, q: 0, pts: [[px, a * px * px]], xr: [-6, 6], yr: [-8, 8] },
      solution: [
        { tex: `\\text{지나는 점} \\left(${px},\\, ${a * px * px}\\right)` },
        { tex: `a = ${a * px * px} \\div ${px * px} = \\square`, blank: a },
        { tex: `y = \\square x^2`, blank: a }
      ]
    };
  }

  /* value(기본) — y=ax² 의 함숫값 */
  const a = pick(rng, [1, 2, 3, -1, -2, -3]);
  const x = nzInt(rng, 2, 5);        /* x=±1 이면 단계가 `a × 1` 이 되어 보여 줄 것이 없다 */
  const y = a * x * x;
  return {
    prompt: { ko: `x를 제곱한 다음 a를 곱해요 — 제곱하면 음수도 양수가 돼요`,
      en: `Square x first, then multiply by a — squaring turns a negative into a positive`,
      zh: `先把x平方，再乘以a——平方后负数也变成正数` },
    tex: `y = ${coefLead(a)}x^2 \\quad\\Rightarrow\\quad x = ${x} \\text{일 때 } y = \\square`,
    answer: y, answerType: 'number', widget: 'numpad', negative: y < 0,
    solution: [
      { tex: `(${x})^2 = \\square`, blank: x * x },
      { tex: `${a} \\times ${x * x} = \\square`, blank: y }
    ]
  };
};

/* ── MD79 — 이차함수의 평행이동 ──
   y=ax² 에서 y=a(x-p)²+q 로 가는 **세 걸음**을 따로 밟는다. 이걸 한 번에
   주면 "괄호 안은 반대로"가 규칙 암기가 된다.
   mode: 'upDown'(y=ax²+q) · 'leftRight'(y=a(x-p)²) · 'both'(둘 다, 2칸). */
NM_TGEN['md79_quadShift'] = function (params, rng) {
  const mode = params.mode || 'upDown';
  const a = pick(rng, [1, 2, 3, -1, -2]);

  if (mode === 'leftRight') {
    const p = nzInt(rng, 1, 5);
    return {
      prompt: { ko: `좌우로 옮기면 괄호 안에 들어가요 — 오른쪽으로 p만큼이면 (x−p)²예요`,
        en: `A left-right shift goes inside the bracket — p to the right gives (x−p)²`,
        zh: `左右平移进到括号里——向右平移p就是(x−p)²` },
      tex: `y = ${coefLead(a)}x^2 \\text{을 } x \\text{축 방향으로 } ${p} \\text{만큼} \\quad\\Rightarrow\\quad \\text{꼭짓점의 } x = \\square`,
      answer: p, answerType: 'number', widget: 'numpad', negative: p < 0,
      solution: [
        { tex: `y = ${coefLead(a)}(x ${wrapPlus(-p)})^2` },
        { tex: `\\text{꼭짓점} \\left(\\square,\\, 0\\right)`, blank: p }
      ]
    };
  }

  if (mode === 'both') {
    const p = nzInt(rng, 1, 4), q = nzInt(rng, 1, 5);
    return {
      prompt: { ko: `좌우는 괄호 안에, 위아래는 괄호 밖에 붙어요 — 꼭짓점을 차례로 입력해요`,
        en: `Left-right goes inside the bracket, up-down outside — enter the vertex in order`,
        zh: `左右在括号里，上下在括号外——按顺序输入顶点` },
      tex: `y = ${coefLead(a)}x^2 \\text{을 } x \\text{축으로 } ${p}, \\; y \\text{축으로 } ${q} \\quad\\Rightarrow\\quad \\left(\\square,\\, \\square\\right)`,
      answer: [p, q], answerType: 'number', widget: 'graphPlane', negative: hasNeg([p, q]),
      graph: { kind: 'parabola', a: a, p: p, q: q, pts: [[p, q]], xr: [-6, 6], yr: [-8, 8] },
      solution: [
        { tex: `y = ${coefLead(a)}(x ${wrapPlus(-p)})^2 ${wrapPlus(q)}` },
        { tex: `\\left(\\square,\\, \\square\\right)`, blank: [p, q] }
      ]
    };
  }

  /* upDown(기본) — y=ax²+q */
  const q = nzInt(rng, 1, 6);
  return {
    prompt: { ko: `위아래로 옮기면 뒤에 더해져요 — 위로 q만큼이면 +q예요`,
      en: `An up-down shift is added at the end — q upward gives +q`,
      zh: `上下平移加在后面——向上平移q就是+q` },
    tex: `y = ${coefLead(a)}x^2 \\text{을 } y \\text{축 방향으로 } ${q} \\text{만큼} \\quad\\Rightarrow\\quad \\text{꼭짓점의 } y = \\square`,
    answer: q, answerType: 'number', widget: 'numpad', negative: q < 0,
    solution: [
      { tex: `y = ${coefLead(a)}x^2 ${wrapPlus(q)}` },
      { tex: `\\text{꼭짓점} \\left(0,\\, \\square\\right)`, blank: q }
    ]
  };
};

/* ── MD80 — 이차함수의 최대·최소와 축과의 교점 ──
   mode: 'maxMin'(최댓값·최솟값) · 'xAxis'(x축과의 두 교점, 2칸) ·
   'yAxis'(y축과의 교점). */
NM_TGEN['md80_quadExtrema'] = function (params, rng) {
  const mode = params.mode || 'maxMin';

  if (mode === 'xAxis') {
    /* y=a(x-r1)(x-r2) — 두 근이 곧 교점 */
    let r1 = nzInt(rng, 1, 5), r2 = nzInt(rng, 1, 5);
    let guard = 0;
    while (r1 + r2 === 0 && guard++ < 20) r2 = nzInt(rng, 1, 5);
    if (r1 + r2 === 0) r2 = r2 + 1;
    if (r1 > r2) { const t = r1; r1 = r2; r2 = t; }
    const b = -(r1 + r2), c = r1 * r2;
    return {
      prompt: { ko: `x축과 만나는 곳은 y=0인 자리예요 — 이차방정식을 풀면 나와요. 작은 수부터 입력해요`,
        en: `The graph meets the x-axis where y=0 — solve the quadratic. Enter the smaller root first`,
        zh: `图象与x轴相交处就是y=0的地方——解二次方程即可。先输入较小的根` },
      tex: `y = x^2 ${wrapPlus(b)}x ${wrapPlus(c)} \\quad\\Rightarrow\\quad \\text{x축과의 교점 } \\square, \\; \\square`,
      answer: [r1, r2], answerType: 'number', widget: 'numpad', negative: hasNeg([r1, r2]),
      solution: [
        { tex: `x^2 ${wrapPlus(b)}x ${wrapPlus(c)} = 0` },
        { tex: `(x ${wrapPlus(-r1)})(x ${wrapPlus(-r2)}) = 0` },
        { tex: `\\square, \\; \\square`, blank: [r1, r2] }
      ]
    };
  }

  if (mode === 'yAxis') {
    const a = pick(rng, [1, 2, -1, -2]);
    const b = nzInt(rng, 1, 6);
    const c = nzInt(rng, 1, 9);
    return {
      prompt: { ko: `y축과 만나는 곳은 x=0인 자리예요 — 상수항이 그대로 답이에요`,
        en: `The graph meets the y-axis where x=0 — the constant term is the answer`,
        zh: `图象与y轴相交处就是x=0的地方——常数项就是答案` },
      tex: `y = ${coefLead(a)}x^2 ${wrapPlus(b)}x ${wrapPlus(c)} \\quad\\Rightarrow\\quad \\text{y축과의 교점 } \\square`,
      answer: c, answerType: 'number', widget: 'numpad', negative: c < 0,
      solution: [
        { tex: `x = 0 \\quad\\Rightarrow\\quad y = ${coefLead(a)}(0)^2 ${wrapPlus(b)}(0) ${wrapPlus(c)}` },
        { tex: `y = \\square`, blank: c }
      ]
    };
  }

  /* maxMin(기본) — y=a(x-p)²+q 의 최댓값·최솟값 */
  const a = pick(rng, [1, 2, 3, -1, -2, -3]);
  const p = nzInt(rng, 1, 5), q = nzInt(rng, 1, 8);
  return {
    prompt: { ko: `(x−p)²은 절대 음수가 못 돼요 — a가 양수면 q가 최솟값, 음수면 q가 최댓값이에요`,
      en: `(x−p)² can never be negative — when a is positive q is the minimum, when negative q is the maximum`,
      zh: `(x−p)²不可能为负——a为正时q是最小值，a为负时q是最大值` },
    tex: `y = ${coefLead(a)}(x ${wrapPlus(-p)})^2 ${wrapPlus(q)} \\quad\\Rightarrow\\quad \\text{${a > 0 ? '최솟값' : '최댓값'}} = \\square`,
    answer: q, answerType: 'number', widget: 'numpad', negative: q < 0,
    solution: [
      { tex: `x = ${p} \\quad\\Rightarrow\\quad (x ${wrapPlus(-p)})^2 = 0` },
      { tex: `y = \\square`, blank: q }
    ]
  };
};

/* ── MD81 — 이차함수의 식 구하기 ──
   그래프를 읽는 반대 방향. mode: 'vertexPoint'(꼭짓점과 한 점 → a) ·
   'twoRoots'(x축 두 교점과 한 점 → a) · 'general'(꼭짓점 → 일반형 b·c, 2칸). */
NM_TGEN['md81_quadFind'] = function (params, rng) {
  const mode = params.mode || 'vertexPoint';

  if (mode === 'twoRoots') {
    let r1 = nzInt(rng, 1, 4), r2 = nzInt(rng, 1, 4);
    let guard = 0;
    while (r2 === r1 && guard++ < 20) r2 = nzInt(rng, 1, 4);
    if (r2 === r1) r2 = r1 + 1;
    if (r1 > r2) { const t = r1; r1 = r2; r2 = t; }
    const a = pick(rng, [1, 2, 3, -1, -2]);
    const x0 = r2 + 1;
    const y0 = a * (x0 - r1) * (x0 - r2);
    return {
      prompt: { ko: `x축과 만나는 두 점을 알면 y=a(x−p)(x−q) 꼴로 쓸 수 있어요 — 나머지 한 점으로 a를 구해요`,
        en: `Knowing the two x-intercepts lets you write y=a(x−p)(x−q) — the remaining point gives a`,
        zh: `知道与x轴的两个交点就能写成y=a(x−p)(x−q)——再用另一个点求出a` },
      tex: `\\text{x축과 } \\left(${r1},\\, 0\\right), \\left(${r2},\\, 0\\right), \\quad \\left(${x0},\\, ${y0}\\right) \\text{를 지남} \\quad\\Rightarrow\\quad a = \\square`,
      answer: a, answerType: 'number', widget: 'numpad', negative: a < 0,
      solution: [
        { tex: `y = a(x ${wrapPlus(-r1)})(x ${wrapPlus(-r2)})` },
        { tex: `${y0} = a \\times ${(x0 - r1) * (x0 - r2)}` },
        { tex: `a = \\square`, blank: a }
      ]
    };
  }

  if (mode === 'general') {
    /* 꼭짓점 (p,q) 의 y=x²+bx+c 꼴 — b=-2p, c=p²+q */
    const p = nzInt(rng, 1, 5);
    let q = nzInt(rng, 1, 8);
    let guard = 0;
    while (p * p + q === 0 && guard++ < 20) q = nzInt(rng, 1, 8);
    if (p * p + q === 0) q = q + 1;
    const b = -2 * p, c = p * p + q;
    return {
      prompt: { ko: `꼭짓점이 (p, q)면 y=(x−p)²+q예요 — 전개해서 y=x²+bx+c 꼴의 b와 c를 차례로 입력해요`,
        en: `A vertex at (p, q) means y=(x−p)²+q — expand it and enter b then c for y=x²+bx+c`,
        zh: `顶点是(p, q)时y=(x−p)²+q——展开后依次输入y=x²+bx+c的b和c` },
      tex: `\\text{꼭짓점} \\left(${p},\\, ${q}\\right), \\; x^2 \\text{의 계수 } 1 \\quad\\Rightarrow\\quad y = x^2 + \\square x + \\square`,
      answer: [b, c], answerType: 'number', widget: 'numpad', negative: hasNeg([b, c]),
      solution: [
        { tex: `y = (x ${wrapPlus(-p)})^2 ${wrapPlus(q)}` },
        { tex: `= x^2 ${wrapPlus(b)}x ${wrapPlus(p * p)} ${wrapPlus(q)}` },
        { tex: `y = x^2 + \\square x + \\square`, blank: [b, c] }
      ]
    };
  }

  /* vertexPoint(기본) — 꼭짓점과 한 점으로 a */
  const p = nzInt(rng, 1, 4), q = nzInt(rng, 1, 6);
  const a = pick(rng, [1, 2, 3, -1, -2]);
  const x0 = p + pick(rng, [1, 2]);
  const y0 = a * (x0 - p) * (x0 - p) + q;
  return {
    prompt: { ko: `꼭짓점을 알면 y=a(x−p)²+q까지 쓸 수 있어요 — 남은 a는 지나는 점 하나로 구해요`,
      en: `Knowing the vertex gets you as far as y=a(x−p)²+q — one more point gives a`,
      zh: `知道顶点就能写到y=a(x−p)²+q——剩下的a用图象上的一点求出` },
    tex: `\\text{꼭짓점} \\left(${p},\\, ${q}\\right), \\; \\left(${x0},\\, ${y0}\\right) \\text{를 지남} \\quad\\Rightarrow\\quad a = \\square`,
    answer: a, answerType: 'number', widget: 'numpad', negative: a < 0,
    solution: [
      { tex: `y = a(x ${wrapPlus(-p)})^2 ${wrapPlus(q)}` },
      { tex: `${y0} = a \\times ${(x0 - p) * (x0 - p)} ${wrapPlus(q)}` },
      { tex: `a = \\square`, blank: a }
    ]
  };
};


/* ============================================================
   D. 중1 — 수직선 위의 위치 (원장 지시 2026-09-21)
   ============================================================ */

/* ── MD82 — 수직선 위의 위치 ──
   원장: "정수 또는 유리수도 위치 찾기 연습도 있어야 하고 절댓값도 위치 찾기가
   되어야지". MD1 은 절댓값을 **계산**만 시켰다 — 수직선 위 어디인지를 묻는 자리가
   없었다. 좌표평면(MD68)의 바로 앞 단계이기도 하다: 1차원에서 자리를 읽을 줄
   알아야 2차원에서 (x, y) 를 읽는다.
   mode: 'integer'(정수 위치 읽기) · 'rational'(눈금을 쪼갠 수직선에서 분수 읽기,
   답 [분자,분모]) · 'absolute'(|x|=k 인 두 수의 자리 찾기).
   그림은 graph 페이로드의 kind:'numberline' — 화면·인쇄가 같은 한 벌을 쓴다. */
NM_TGEN['md82_numberLine'] = function (params, rng) {
  const mode = params.mode || 'integer';

  if (mode === 'rational') {
    /* 눈금을 den 등분한 수직선. 답은 [분자, 분모] — 약분하지 않는다(MD3 와 같은 관례,
       "눈금 몇 칸째인가"를 그대로 읽는 것이 이 문항의 목적이기 때문). */
    const den = pick(rng, [2, 4, 5]);
    /* 범위는 −2~2 — 5등분에서 −3~3 이면 작은 눈금이 30개라 인쇄에서 붙어 버린다(실측). */
    const lo = -2, hi = 2;
    let num = R(rng, -2 * den + 1, 2 * den - 1);
    let guard = 0;
    while (num % den === 0 && guard++ < 30) num = R(rng, -2 * den + 1, 2 * den - 1);
    if (num % den === 0) num = num + 1;                 /* 정수 자리는 이 레벨의 목적이 아니다 */
    return {
      prompt: { ko: `한 칸을 ${den}등분한 수직선이에요 — 0에서 작은 눈금 몇 칸인지 세어 분수로 적어요`,
        en: `Each unit is cut into ${den} — count the small marks from 0 and write it as a fraction`,
        zh: `每一格被${den}等分——从0数小刻度有几格，写成分数` },
      tex: `\\text{점 P가 나타내는 수} = \\dfrac{\\square}{\\square}`,
      answer: [num, den], answerShape: 'fraction', answerType: 'number',
      widget: 'graphPlane', negative: num < 0,
      graph: { kind: 'numberline', lo: lo, hi: hi, den: den, pts: [{ v: num / den, label: 'P' }] },
      solution: [
        { tex: `\\text{한 칸을 } ${den} \\text{등분}` },
        { tex: `\\text{0에서 } \\square \\text{칸}`, blank: num },
        { tex: `\\dfrac{\\square}{\\square}`, blank: [num, den] }
      ]
    };
  }

  if (mode === 'absolute') {
    /* |x| = k 를 만족하는 수는 원점에서 같은 거리에 있는 **둘**이다. 수직선에 그 두 점을
       찍어 두고 왼쪽(작은 수)을 묻는다 — 절댓값을 계산이 아니라 자리로 읽게 한다. */
    const k = R(rng, 2, 6);
    return {
      prompt: { ko: `절댓값이 같은 수는 원점에서 같은 거리에 있는 두 개예요 — 왼쪽 수를 답해요`,
        en: `Two numbers share an absolute value, one on each side of zero — give the one on the left`,
        zh: `绝对值相同的数有两个，分别在0的两侧——回答左边那个` },
      tex: `|x| = ${k} \\quad\\Rightarrow\\quad \\text{작은 수} = \\square`,
      answer: -k, answerType: 'number', widget: 'graphPlane', negative: true,
      graph: { kind: 'numberline', lo: -7, hi: 7, den: 1,
        pts: [{ v: -k, label: 'A' }, { v: k, label: 'B' }] },
      solution: [
        { tex: `\\text{원점에서 거리 } ${k}` },
        { tex: `\\text{오른쪽} = ${k}, \\quad \\text{왼쪽} = \\square`, blank: -k }
      ]
    };
  }

  /* integer(기본) — 수직선 위 점의 정수 읽기 */
  const lo = -7, hi = 7;
  let v = R(rng, lo + 1, hi - 1);
  if (v === 0) v = 1;
  return {
    prompt: { ko: `0에서 오른쪽은 양수, 왼쪽은 음수예요 — 눈금을 세어 점이 나타내는 수를 읽어요`,
      en: `Right of zero is positive and left is negative — count the marks and read the number at the dot`,
      zh: `0的右边是正数、左边是负数——数刻度读出点表示的数` },
    tex: `\\text{점 P가 나타내는 수} = \\square`,
    answer: v, answerType: 'number', widget: 'graphPlane', negative: v < 0,
    graph: { kind: 'numberline', lo: lo, hi: hi, den: 1, pts: [{ v: v, label: 'P' }] },
    solution: [
      { tex: `\\text{0에서 } ${v < 0 ? '왼쪽' : '오른쪽'} \\text{으로 } \\square \\text{칸}`, blank: Math.abs(v) },
      { tex: `\\text{점 P} = \\square`, blank: v }
    ]
  };
};

if (typeof module !== 'undefined' && module.exports) module.exports = NM_TGEN;
})();
