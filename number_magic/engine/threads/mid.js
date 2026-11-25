/* ============================================================
   Numbers of Magic — MD(중등 W8 · 중1 정수와 유리수) 스레드 생성기
   근거: MASTER-ROADMAP.md §5(중1 W8) + 중등연산-목차.md(G03~G25, 정수와
   유리수 사칙연산·거듭제곱만 다루는 실측 목차) — 문자와 식·일차방정식·
   정비례반비례는 G목차에 없어 이번 배치 범위 밖(다음 세션).
   계약: NM_TGEN[genKey] = function(params, rng) { return problem; }
   절대 Math.random() 사용 금지 — R(rng,a,b) / pick(rng,arr) / shuffle(rng,arr)만.
   답 환원 원칙(MASTER-ROADMAP §7): 모든 답은 정수 몇 개(또는 분수 페어
   [분자,분모])로 받는다 — 문자식·근호식 문자열 입력 없음.
   음수 답은 반드시 problem.negative=true (또는 배열 정답이면 동일하게
   negative:true) — steps의 개별 blank는 s.blank<0이면 위젯이 자동으로
   마이너스 키를 켜주지만, 최종 numpad(단일 또는 다칸) 값은 자동 감지가
   없어 명시적으로 켜야 한다(app/widgets.js, app/main.js 둘 다 동일 계약).
   ============================================================ */
(function(){
'use strict';

const { R, pick } = NM_RNG;

/* ── 공용 헬퍼 ── */
function nzMag(rng, lo, hi){ return R(rng, lo, hi); }              /* 항상 양의 크기(lo>=1) */
function signOf(rng){ return pick(rng, [1, -1]); }
function gcd(a, b){ a = Math.abs(a); b = Math.abs(b); while(b){ [a, b] = [b, a % b]; } return a || 1; }
function lcm(a, b){ return Math.abs(a * b) / gcd(a, b); }
/* 분수를 분모>0으로 정규화(부호는 분자로 몰아줌) — CH5 등 기존 관례(약분은 안 함) 유지 */
/* 분수 답 정규화 — 부호를 분자로 몰고 기약분수로 줄인다.
   약분 정책(2026-08-29 원장): 4학년까지는 약분하지 않은 값, 5학년부터는 기약분수가
   정답이다. 이 파일의 MD3·MD7은 중1 과정이라 기약분수가 정답이어야 하는데
   예전엔 부호만 정리하고 약분을 안 해 4/4·(-12)/30 같은 답이 정답키로 나갔다.
   normFrac을 쓰는 곳은 MD3·MD7뿐이라 여기서 한 번에 처리한다. */
function normFrac(n, d){
  if(d < 0){ n = -n; d = -d; }
  const g = gcd(n, d);
  return [n / g, d / g];
}
function divisorsOf(n){
  n = Math.abs(n);
  const out = [];
  for(let k = 1; k <= n; k++) if(n % k === 0) out.push(k);
  return out;
}
/* 부호 있는 수를 다른 연산자 옆에 그대로 찍으면 "4 + -5"나 "20 - -7"처럼
   부호 두 개가 붙어 읽기 힘들어진다(교재는 항상 괄호로 묶어 "(-5)"로 쓴다).
   음수만 괄호로 감싸 그 문제를 없앤다 — 양수는 그대로. */
function wrapSigned(x){ return x < 0 ? `(${x})` : String(x); }
/* ── 중1-1 세분화 공용(2026-11-25, 원장 「시중 교재와 너무 차이」 — 디딤돌 개념연산 중1-1A 44유형 대조) ── */
const shuffleM = NM_RNG.shuffle;
function L3m(ko, en, zh){ return { ko, en, zh }; }
/* 분수 TeX — 부호는 분수 밖(교과서 표기 −2/3), 분모 1은 정수 */
function fT(n, d){ if(d === 1) return String(n); return (n < 0 ? '-' : '') + `\\dfrac{${Math.abs(n)}}{${d}}`; }
/* 연산 기호 옆에 올 때 — 음수만 괄호 */
function pT(n, d){ const t = fT(n, d); return n < 0 ? `\\left(${t}\\right)` : t; }
/* 부호를 늘 붙인 정수 (+5)·(−7) — 중1 첫 단원 표기 */
function sT(n){ return n < 0 ? `(${n})` : `(+${n})`; }
function fracAns(n, d){ const [a, b] = normFrac(n, d); return b === 1 ? { answer: a } : { answer: [a, b], answerShape: 'fraction' }; }
function wordM(story, ask, unit, answer, solution, tex){
  const prompt = {}; ['ko','en','zh'].forEach(l => { prompt[l] = story[l] + (l === 'zh' ? '' : ' ') + ask[l]; });
  const p = { prompt, word: story, wordAsk: ask, wordUnit: unit, answer, answerType: 'number', widget: 'numpad',
    negative: Array.isArray(answer) ? answer.some(x => x < 0) : answer < 0, solution: solution || [] };
  if(tex) p.tex = tex;
  return p;
}


/* ── MD1 — 정수 개념·수직선 (G03·G05: 절댓값·대소 비교·수직선 위 거리) ──
   mode: 'abs'(절댓값) · 'compare'(대소 비교) · 'distance'(수직선 위 두 점 거리).
   compare는 결과 자체가 음수일 수 있어 problem.negative가 필요, abs·distance는
   항상 0 이상이라 필요 없다. */
NM_TGEN['md1_intConcept'] = function (params, rng) {
  const mode = params.mode || 'abs';
  /* ── 중1-1 세분화 단계(2026-11-25) ── */
  if (mode === 'absProps') {
    /* 절댓값의 성질 — 절댓값이 n인 두 수 · 절댓값이 n 이하/미만인 정수의 개수 */
    const n = R(rng, 1, 15), kind = pick(rng, ['two', 'le', 'lt']);
    if (kind === 'two') return {
      prompt: L3m(`절댓값이 ${n}인 수를 작은 것부터 모두 쓰시오.`, `Write every number whose absolute value is ${n}, smallest first.`, `从小到大写出绝对值为${n}的所有数。`),
      tex: `|x| = ${n} \\;\\Rightarrow\\; x = \\square,\\,\\square`, answer: [-n, n], answerType: 'number', widget: 'numpad', negative: true,
      solution: [{ tex: `\\text{원점에서 거리가 } ${n}\\text{인 점}: -${n},\\, +${n}` }] };
    const cnt = kind === 'le' ? 2 * n + 1 : 2 * n - 1, rel = kind === 'le' ? '\\le' : '<';
    return {
      prompt: L3m(`절댓값이 ${n} ${kind === 'le' ? '이하' : '미만'}인 정수의 개수를 구하시오.`, `How many integers have absolute value ${kind === 'le' ? 'at most' : 'less than'} ${n}?`, `绝对值${kind === 'le' ? '不大于' : '小于'}${n}的整数有几个？`),
      tex: `|x| ${rel} ${n} \\;\\Rightarrow\\; \\text{정수 x의 개수} = \\square`, answer: cnt, answerType: 'number', widget: 'numpad',
      solution: [{ tex: kind === 'le' ? `-${n},\\,\\cdots,\\,0,\\,\\cdots,\\,${n}` : `-${n - 1},\\,\\cdots,\\,0,\\,\\cdots,\\,${n - 1}` },
                 { tex: `\\text{개수} = \\square`, blank: cnt }] };
  }

  if (mode === 'sign') {
    /* 양의 부호와 음의 부호 — 서로 반대인 성질을 +, −로 */
    const n = R(rng, 2, 40), pos = R(rng, 0, 1) === 1;
    const S = pick(rng, [
      [L3m(`영상 ${n}°C`, `${n}°C above zero`, `零上${n}°C`), L3m(`영하 ${n}°C`, `${n}°C below zero`, `零下${n}°C`)],
      [L3m(`해발 ${n * 10}m`, `${n * 10} m above sea level`, `海拔${n * 10}m`), L3m(`해저 ${n * 10}m`, `${n * 10} m below sea level`, `海平面下${n * 10}m`)],
      [L3m(`${n * 100}원 이익`, `a profit of ${n * 100} won`, `盈利${n * 100}韩元`), L3m(`${n * 100}원 손해`, `a loss of ${n * 100} won`, `亏损${n * 100}韩元`)],
      [L3m(`몸무게 ${Math.min(n, 9)}kg 증가`, `a weight gain of ${Math.min(n, 9)} kg`, `体重增加${Math.min(n, 9)}kg`), L3m(`몸무게 ${Math.min(n, 9)}kg 감소`, `a weight loss of ${Math.min(n, 9)} kg`, `体重减少${Math.min(n, 9)}kg`)],
      [L3m(`지상 ${Math.min(n, 30)}층`, `floor ${Math.min(n, 30)} above ground`, `地上${Math.min(n, 30)}层`), L3m(`지하 ${Math.min(n, 9)}층`, `basement floor ${Math.min(n, 9)}`, `地下${Math.min(n, 9)}层`)],
      [L3m(`출발 ${Math.min(n, 12)}시간 후`, `${Math.min(n, 12)} hours after departure`, `出发后${Math.min(n, 12)}小时`), L3m(`출발 ${Math.min(n, 12)}시간 전`, `${Math.min(n, 12)} hours before departure`, `出发前${Math.min(n, 12)}小时`)],
      [L3m(`${n * 1000}원 수입`, `an income of ${n * 1000} won`, `收入${n * 1000}韩元`), L3m(`${n * 1000}원 지출`, `spending of ${n * 1000} won`, `支出${n * 1000}韩元`)]
    ]);
    const phrase = pos ? S[0] : S[1];
    const m = +((pos ? S[0] : S[1]).ko.match(/\d+/)[0]);
    const answer = pos ? m : -m;
    return wordM(phrase, L3m('→ 부호 +, −를 붙여 수로 나타내면?', '→ write it as a number with a + or − sign.', '→ 用带+、−号的数表示。'), L3m('', '', ''), answer,
      [{ tex: `${pos ? '+' : '-'}${m}` }]);
  }

  if (mode === 'intClassify' || mode === 'ratClassify') {
    /* 정수·유리수의 분류 — 약분하면 정수가 되는 분수(−12/3)를 섞는다 */
    const pool = [];
    const addInt = () => { const v = R(rng, -9, 9); pool.push({ t: v > 0 && R(rng, 0, 1) ? `+${v}` : String(v), v, int: true }); };
    const addFracInt = () => { const k = R(rng, 1, 5) * (R(rng, 0, 1) ? 1 : -1), d = R(rng, 2, 4); pool.push({ t: (k > 0 ? '+' : '-') + `\\dfrac{${Math.abs(k) * d}}{${d}}`, v: k, int: true }); };
    const addFrac = () => { let a, d; do { d = R(rng, 2, 7); a = R(rng, 1, 3 * d); } while (a % d === 0); const s = R(rng, 0, 1) ? 1 : -1; pool.push({ t: (s > 0 ? '+' : '-') + `\\dfrac{${a}}{${d}}`, v: s * a / d, int: false }); };
    const addDec = () => { const v = (R(rng, 1, 49) / 10) * (R(rng, 0, 1) ? 1 : -1); if (Number.isInteger(v)) return addFrac(); pool.push({ t: v > 0 ? `+${v}` : String(v), v, int: false }); };
    for (let i = 0; i < 3; i++) addInt();
    addFracInt(); addFrac(); addDec(); if (R(rng, 0, 1)) pool.push({ t: '0', v: 0, int: true }); else addFrac();
    const seenV = new Set(), list = shuffleM(rng, pool.filter(x => !seenV.has(x.t) && !seenV.has(String(x.v)) && seenV.add(x.t) && seenV.add(String(x.v))));
    const kinds = mode === 'intClassify'
      ? [['양의 정수의 개수', x => x.int && x.v > 0], ['음의 정수의 개수', x => x.int && x.v < 0], ['정수의 개수', x => x.int]]
      : [['정수가 아닌 유리수의 개수', x => !x.int], ['양의 유리수의 개수', x => x.v > 0], ['음의 유리수의 개수', x => x.v < 0]];
    const [name, test] = pick(rng, kinds), cnt = list.filter(test).length;
    return {
      prompt: L3m(`다음 수 가운데 ${name.replace('의 개수', '')}의 개수를 구하시오.`, `Count the numbers of the asked kind in the list.`, `数一数下列数中符合要求的数有几个。`),
      tex: `${list.map(x => x.t).join(',\\;\\; ')} \\;\\Rightarrow\\; \\text{${name}} = \\square`,
      answer: cnt, answerType: 'number', widget: 'numpad',
      solution: [{ tex: list.filter(test).map(x => x.t).join(',\\;') || '\\text{없음}' }, { tex: `\\text{${name}} = \\square`, blank: cnt }] };
  }

  if (mode === 'inequality') {
    /* 부등호의 사용 — 문장 → 부등호(< 1, ≤ 2) 또는 그 범위의 정수 개수 */
    let a, b; do { a = R(rng, -6, 3); b = R(rng, -2, 8); } while (b - a < 2);
    const lowStrict = R(rng, 0, 1) === 1, upStrict = R(rng, 0, 1) === 1;
    const lowKo = lowStrict ? pick(rng, [`${a}보다 크고`, `${a} 초과이고`]) : pick(rng, [`${a}보다 크거나 같고`, `${a} 이상이고`, `${a}보다 작지 않고`]);
    const upKo = upStrict ? pick(rng, [`${b}보다 작다`, `${b} 미만이다`]) : pick(rng, [`${b}보다 작거나 같다`, `${b} 이하이다`, `${b}보다 크지 않다`]);
    const lowEn = lowStrict ? `greater than ${a}` : `greater than or equal to ${a}`, upEn = upStrict ? `less than ${b}` : `less than or equal to ${b}`;
    const lowZh = lowStrict ? `大于${a}` : `大于或等于${a}`, upZh = upStrict ? `小于${b}` : `小于或等于${b}`;
    const r1 = lowStrict ? '<' : '\\le', r2 = upStrict ? '<' : '\\le';
    if (R(rng, 0, 1) === 1) return wordM(L3m(`x는 ${lowKo} ${upKo}.`, `x is ${lowEn} and ${upEn}.`, `x${lowZh}且${upZh}。`),
      L3m('→ 부등호로 나타낼 때 <이면 1, ≤이면 2를 쓰시오.', '→ write 1 for < or 2 for ≤ in each box.', '→ 用不等号表示：<填1，≤填2。'), L3m('', '', ''),
      [lowStrict ? 1 : 2, upStrict ? 1 : 2], [{ tex: `${a} ${r1} x ${r2} ${b}` }], `${a} \\;\\square\\; x \\;\\square\\; ${b}`);
    const lo = lowStrict ? a + 1 : a, hi = upStrict ? b - 1 : b, cnt = hi - lo + 1;
    return wordM(L3m(`x는 ${lowKo} ${upKo}.`, `x is ${lowEn} and ${upEn}.`, `x${lowZh}且${upZh}。`),
      L3m('→ 이를 만족하는 정수 x의 개수는?', '→ how many integers x satisfy this?', '→ 满足条件的整数x有几个？'), L3m('개', '', '个'), cnt,
      [{ tex: `${a} ${r1} x ${r2} ${b}` }, { tex: `x = ${lo},\\,${lo + 1},\\,\\cdots,\\,${hi}` }, { tex: `\\text{개수} = \\square`, blank: cnt }]);
  }


  if (mode === 'abs') {
    const lv = params.level || 'main';
    const mag = lv === 'practice' ? nzMag(rng, 1, 40) : nzMag(rng, 10, 99);
    const a = signOf(rng) * mag;
    return {
      prompt: {
        ko: `|${a}|의 값을 구합니다 — 절댓값은 원점(0)에서 그 수까지의 거리입니다`,
        en: `Find |${a}| — absolute value is the distance from 0 to that number`,
        zh: `求|${a}|——绝对值是这个数到原点(0)的距离`
      },
      tex: `|${a}| = \\square`,
      answer: mag, answerType: 'number', widget: 'numpad',
      solution: [
        { tex: `|${a}| \\;\\Rightarrow\\; \\text{0까지 거리}` },
        { tex: `|${a}| = \\square`, blank: mag }
      ]
    };
  }

  if (mode === 'compare') {
    let a, b;
    do { a = R(rng, -50, 50); b = R(rng, -50, 50); } while (a === b);
    const askMax = pick(rng, [true, false]);
    const answer = askMax ? Math.max(a, b) : Math.min(a, b);
    const cmp = a > b ? '>' : '<';
    /* 교육과정 말로(2026-09-25, 원장 "정수 개념에 max라는 표현을 어떻게 써 교육과정 용어에 안맞아").
       중1 은 수의 대소를 부등호와 "두 수 중 더 큰 수"로 말한다 — max·min 기호는 교과서에 없다.
       식에는 두 수와 답 칸만 두고(= 없음), 물음은 인쇄 질문 줄(printAskText)이 3개 언어로 싣는다. */
    return {
      prompt: {
        ko: `두 수 중 ${askMax ? '더 큰' : '더 작은'} 수를 구하시오.`,
        en: `Write the ${askMax ? 'greater' : 'smaller'} of the two numbers.`,
        zh: `写出两个数中${askMax ? '较大' : '较小'}的数。`
      },
      tex: `${a},\\;\\; ${b} \\qquad \\square`,
      answer, answerType: 'number', widget: 'numpad', negative: answer < 0,
      solution: [
        { tex: `${a} ${cmp} ${b}` },
        { tex: `${a} ${cmp} ${b} \\;\\Rightarrow\\; \\square`, blank: answer }
      ]
    };
  }

  /* distance — 수직선 위 두 점 사이 칸 수(|a-b|) : G05의 수직선 접근 예고 */
  let a, b;
  do { a = R(rng, -50, 50); b = R(rng, -50, 50); } while (a === b);
  const dist = Math.abs(a - b);
  return {
    prompt: {
      ko: `수직선 위에서 ${a}와 ${b} 사이는 몇 칸 떨어져 있을까요?`,
      en: `On the number line, how many steps apart are ${a} and ${b}?`,
      zh: `在数轴上，${a}和${b}相距几格？`
    },
    tex: `|${a} - (${b})| = \\square`,
    answer: dist, answerType: 'number', widget: 'numpad',
    /* 2026-09-20: 첫 줄이 `|-10 - (-49)| = |39|` 라 답이 이미 적혀 있었다. 빼기를 먼저
       시키고, 그 결과에 절댓값을 씌우는 두 걸음으로 나눈다(음수가 나올 수도 있어야 한다). */
    solution: [
      { tex: `${a} - (${b}) = \\square`, blank: a - b },
      { tex: `|${a - b}| = \\square`, blank: dist }
    ]
  };
};

/* ── MD2 — 정수의 덧셈과 뺄셈 (G04·G06·G07·G12) ──
   mode: 'same'(같은 부호) · 'diff'(다른 부호) · 'brackets'(괄호 풀기) ·
   'chain3'(세 정수 혼합, 앞에서부터 차례로). steps의 blank는 규칙 그대로
   드러나도록 절댓값 계산을 먼저 보여준다. */
NM_TGEN['md2_intAddSub'] = function (params, rng) {
  const mode = params.mode || 'same';
  const lv = params.level || 'main';
  const mag = () => lv === 'practice' ? nzMag(rng, 1, 20) : nzMag(rng, 10, 50);
  /* ── 중1-1 세분화 단계(2026-11-25) ── */
  if (mode === 'addLaws') {
    /* 덧셈의 계산 법칙 — 바꾸고(교환) 묶어서(결합) 양수끼리 · 음수끼리 먼저 */
    const P = [R(rng, 2, 25), R(rng, 2, 25)], N = [-R(rng, 2, 25), -R(rng, 2, 25)];
    const order = shuffleM(rng, [P[0], N[0], P[1], N[1]]);
    if (order[0] > 0 && order[2] > 0) { const t = order[1]; order[1] = order[2]; order[2] = t; }
    const ps = P[0] + P[1], ns = N[0] + N[1], ans = ps + ns;
    const steps = [{ tex: `${sT(P[0])}+${sT(P[1])} = \\square`, blank: ps }, { tex: `${sT(N[0])}+${sT(N[1])} = \\square`, blank: ns },
                   { tex: `${sT(ps)}+${sT(ns)} = \\square`, blank: ans }];
    return { prompt: L3m('덧셈의 교환법칙·결합법칙으로 양수끼리, 음수끼리 먼저 더해요', 'Use the commutative and associative laws: add the positives together and the negatives together first.', '用加法交换律、结合律：先把正数相加，负数相加。'),
      tex: `${order.map(sT).join('+')} = \\square`, answer: ans, answerType: 'steps', widget: 'steps', negative: ans < 0, steps, solution: steps };
  }

  if (mode === 'addSubRelation') {
    /* 덧셈과 뺄셈 사이의 관계 — 어떤 수(□) 구하기 */
    const a = signOf(rng) * nzMag(rng, 2, 15), c = R(rng, -15, 15), kind = pick(rng, ['xPlus', 'plusX', 'xMinus', 'minusX']);
    const X = { xPlus: c - a, plusX: c - a, xMinus: c + a, minusX: a - c }[kind];
    const tex = { xPlus: `\\square + ${sT(a)} = ${c}`, plusX: `${sT(a)} + \\square = ${c}`, xMinus: `\\square - ${sT(a)} = ${c}`, minusX: `${sT(a)} - \\square = ${c}` }[kind];
    const sol = { xPlus: `\\square = ${c} - ${sT(a)}`, plusX: `\\square = ${c} - ${sT(a)}`, xMinus: `\\square = ${c} + ${sT(a)}`, minusX: `\\square = ${sT(a)} - ${sT(c)}` }[kind];
    return { prompt: L3m('덧셈과 뺄셈 사이의 관계를 이용해 □ 안에 알맞은 수를 구해요', 'Use the link between addition and subtraction to find the missing number.', '利用加法与减法的关系求□里的数。'),
      tex, answer: X, answerType: 'number', widget: 'numpad', negative: true, solution: [{ tex: sol }, { tex: `\\square = ${X}` }] };
  }

  if (mode === 'absPair') {
    /* 절댓값이 주어진 두 수의 덧셈과 뺄셈 */
    const m = R(rng, 1, 12), n = R(rng, 1, 12), kind = pick(rng, ['maxSum', 'minSum', 'maxDiff', 'minDiff', 'signed']);
    const ask = { maxSum: ['a+b', '의 가장 큰 값', m + n], minSum: ['a+b', '의 가장 작은 값', -(m + n)], maxDiff: ['a-b', '의 가장 큰 값', m + n], minDiff: ['a-b', '의 가장 작은 값', -(m + n)] }[kind];
    if (kind === 'signed') {
      const ans = m - n;
      return { prompt: L3m('절댓값과 부호로 a, b를 정해 계산해요', 'Use the absolute values and signs to fix a and b, then calculate.', '由绝对值和符号确定a、b再计算。'),
        tex: `|a| = ${m},\\;\\; |b| = ${n},\\;\\; a>0,\\;\\; b<0 \\;\\Rightarrow\\; a+b = \\square`, answer: ans, answerType: 'number', widget: 'numpad', negative: true,
        solution: [{ tex: `a = ${m},\\;\\; b = -${n}` }, { tex: `a+b = ${m}+(-${n}) = \\square`, blank: ans }] };
    }
    return { prompt: L3m('a, b가 될 수 있는 수를 모두 생각해 가장 큰(작은) 값을 구해요', 'Try every possible a and b and find the largest (smallest) value.', '考虑a、b所有可能的值，求最大(最小)值。'),
      tex: `|a| = ${m},\\;\\; |b| = ${n} \\;\\Rightarrow\\; ${ask[0]}\\text{${ask[1]}} = \\square`, answer: ask[2], answerType: 'number', widget: 'numpad', negative: true,
      solution: [{ tex: `a = \\pm ${m},\\;\\; b = \\pm ${n}` }, { tex: `${ask[0]}\\text{${ask[1]}} = \\square`, blank: ask[2] }] };
  }


  if (mode === 'same') {
    const s = signOf(rng);
    const ma = mag(), mb = mag();
    const a = s * ma, b = s * mb;
    const absSum = ma + mb;
    const sum = a + b;
    const wa = wrapSigned(a), wb = wrapSigned(b);
    return {
      prompt: {
        ko: `${wa} + ${wb}: 부호가 같은 두 수의 덧셈입니다 — 절댓값끼리 더하고 공통 부호를 붙입니다`,
        en: `${wa} + ${wb}: same-sign addition — add the absolute values, keep the shared sign`,
        zh: `${wa} + ${wb}：同号相加——先加绝对值，再带上共同的符号`
      },
      tex: `${wa} + ${wb} = \\square`,
      answer: sum, answerType: 'steps', widget: 'steps',
      steps: [
        { tex: `|${a}| + |${b}| = \\square`, blank: absSum },
        { tex: `${wa} + ${wb} = \\square`, blank: sum }
      ],
      solution: [
        { tex: `|${a}| + |${b}| = \\square`, blank: absSum },
        { tex: `${wa} + ${wb} = \\square`, blank: sum }
      ]
    };
  }

  if (mode === 'diff') {
    const ma = mag(), mb = mag();
    const s = signOf(rng);
    const a = s * ma, b = -s * mb;
    const diff = Math.abs(ma - mb);
    // 절댓값의 차는 큰 쪽에서 작은 쪽을 뺀다. 문항/정답/난수 흐름은 그대로 둔다.
    const larger = ma >= mb ? a : b, smaller = ma >= mb ? b : a;
    const sum = a + b;
    const wa = wrapSigned(a), wb = wrapSigned(b);
    return {
      prompt: {
        ko: `${wa} + ${wb}: 부호가 다른 두 수의 덧셈입니다 — 절댓값의 차에 절댓값이 큰 쪽 부호를 붙입니다`,
        en: `${wa} + ${wb}: different-sign addition — subtract the absolute values, keep the sign of the larger one`,
        zh: `${wa} + ${wb}：异号相加——用绝对值的差，符号跟绝对值大的那个数一致`
      },
      tex: `${wa} + ${wb} = \\square`,
      answer: sum, answerType: 'steps', widget: 'steps',
      steps: [
        { tex: `|${larger}| - |${smaller}| = \\square \\;(\\text{절댓값 차})`, blank: diff },
        { tex: `${wa} + ${wb} = \\square`, blank: sum }
      ],
      solution: [
        { tex: `|${larger}| - |${smaller}| = \\square \\;(\\text{절댓값 차})`, blank: diff },
        { tex: `${wa} + ${wb} = \\square`, blank: sum }
      ]
    };
  }

  if (mode === 'brackets') {
    /* G06·G07: 괄호가 있는 정수의 덧뺄셈 — 괄호를 풀어서(빼는 수의 부호를
       바꾸어 덧셈으로) 계산하는 것이 편리하다는 규칙을 그대로 스텝으로. */
    const op = pick(rng, ['+', '-']);
    const x = signOf(rng) * mag();
    const y = signOf(rng) * mag();
    const flipped = op === '+' ? y : -y;
    const answer = x + flipped;
    return {
      prompt: {
        ko: `${x} ${op} (${y}): 괄호를 풀어서 덧셈으로 바꿔 계산합니다`,
        en: `${x} ${op} (${y}): open the brackets and turn it into addition`,
        zh: `${x} ${op} (${y})：把括号打开，变成加法来算`
      },
      tex: `${x} ${op} (${y}) = \\square`,
      answer, answerType: 'steps', widget: 'steps',
      steps: [
        { tex: `${x} ${op} (${y}) = ${x} + \\square`, blank: flipped },
        { tex: `${x} + (${flipped}) = \\square`, blank: answer }
      ],
      solution: [
        { tex: `${x} ${op} (${y}) = ${x} + \\square`, blank: flipped },
        { tex: `${x} + (${flipped}) = \\square`, blank: answer }
      ]
    };
  }

  /* numberLine — G05: 수직선을 이용한 정수의 덧셈·뺄셈 (2026-09-29 신규).
     출발점 a 에서 화살표 위의 수만큼 움직인다. +k 와 −(−k) 는 오른쪽, −k 와 +(−k) 는 왼쪽 —
     "음수를 빼는 것은 반대쪽(오른쪽)으로 가는 것"을 수직선 위의 방향으로 보게 하는 것이 핵심이다.
     식에는 = 이 없어 인쇄물에 물음 줄(prompt)이 함께 실린다. 문제는 새로 지었다. */
  if (mode === 'numberLine') {
    const a = R(rng, -12, 12);
    const k = R(rng, 1, 12);
    const kind = pick(rng, ['plusPos', 'plusNeg', 'minusPos', 'minusNeg']);
    const label = { plusPos: `+${k}`, plusNeg: `+(-${k})`, minusPos: `-(+${k})`, minusNeg: `-(-${k})` }[kind];
    const right = kind === 'plusPos' || kind === 'minusNeg';
    const move = right ? k : -k;
    const answer = a + move;
    const exprTex = { plusPos: `${a} + ${k}`, plusNeg: `${a} + (-${k})`, minusPos: `${a} - (+${k})`, minusNeg: `${a} - (-${k})` }[kind];
    const tex = `${a} \\;\\xrightarrow{\\;${label}\\;}\\; \\square`;
    const dirKo = right ? '오른쪽' : '왼쪽', dirEn = right ? 'right' : 'left', dirZh = right ? '右' : '左';
    const steps = [
      { tex: `${a} ${right ? '+' : '-'} ${k} = \\square`, blank: answer },
      { tex, blank: answer }
    ];
    /* 괄호가 있는 꼴은 먼저 괄호를 풀어 방향(+ 오른쪽 / − 왼쪽)을 정한다 */
    if (kind !== 'plusPos') steps.unshift({ tex: `${exprTex} = ${a} ${right ? '+' : '-'} \\square`, blank: k });
    return {
      prompt: {
        ko: `수직선 위의 ${a}에서 ${label}만큼(${dirKo}으로 ${k}칸) 움직인 점이 나타내는 수를 구하시오.`,
        en: `On the number line, start at ${a} and move by ${label} (${k} steps to the ${dirEn}). What number do you land on?`,
        zh: `在数轴上从${a}出发，移动${label}（向${dirZh}${k}格），求到达的点表示的数。`
      },
      tex, answer, answerType: 'steps', widget: 'steps', negative: answer < 0,
      steps, solution: steps
    };
  }

  /* chain3 — 반은 부호가 있는 꼴 (+5) − (−3) + (−8)(2026-11-25, 디딤돌 중1-1A 「덧셈과 뺄셈의 혼합 계산」 — 예전엔 양수만 나왔다) */
  if (R(rng, 0, 1) === 1) {
    const v = [signOf(rng) * mag(), signOf(rng) * mag(), signOf(rng) * mag()];
    const ops = [pick(rng, ['+', '-']), pick(rng, ['+', '-'])];
    const w = [v[0], ops[0] === '+' ? v[1] : -v[1], ops[1] === '+' ? v[2] : -v[2]];
    const answer = w[0] + w[1] + w[2];
    const steps = [{ tex: `= ${w.map(sT).join(' + ')}` }, { tex: `${sT(w[0])} + ${sT(w[1])} = \\square`, blank: w[0] + w[1] },
                   { tex: `${sT(w[0] + w[1])} + ${sT(w[2])} = \\square`, blank: answer }];
    return { prompt: L3m('뺄셈은 빼는 수의 부호를 바꾸어 덧셈으로 고친 뒤 계산합니다', 'Turn each subtraction into adding the opposite, then add.', '把减法改成加上相反数，再计算。'),
      tex: `${sT(v[0])} ${ops[0]} ${sT(v[1])} ${ops[1]} ${sT(v[2])} = \\square`, answer, answerType: 'steps', widget: 'steps', negative: answer < 0,
      steps: steps.filter(s => s.blank !== undefined), solution: steps };
  }

  /* chain3 — G12: 세 정수의 덧셈과 뺄셈 혼합, 앞에서부터 차례로 */
  const m1 = mag(), m2 = mag(), m3 = mag();
  const op1 = pick(rng, ['+', '-']);
  const op2 = pick(rng, ['+', '-']);
  const step1 = op1 === '+' ? m1 + m2 : m1 - m2;
  const answer = op2 === '+' ? step1 + m3 : step1 - m3;
  return {
    prompt: {
      ko: `${m1} ${op1} ${m2} ${op2} ${m3}: 세 수의 덧뺄셈은 앞에서부터 차례로 계산합니다`,
      en: `${m1} ${op1} ${m2} ${op2} ${m3}: solve three-number ± left to right`,
      zh: `${m1} ${op1} ${m2} ${op2} ${m3}：三个数的加减法从左往右依次计算`
    },
    tex: `${m1} ${op1} ${m2} ${op2} ${m3} = \\square`,
    answer, answerType: 'steps', widget: 'steps',
    steps: [
      { tex: `${m1} ${op1} ${m2} = \\square`, blank: step1 },
      { tex: `${step1} ${op2} ${m3} = \\square`, blank: answer }
    ],
    solution: [
      { tex: `${m1} ${op1} ${m2} = \\square`, blank: step1 },
      { tex: `${step1} ${op2} ${m3} = \\square`, blank: answer }
    ]
  };
};

/* ── MD3 — 유리수의 덧셈과 뺄셈 (G08·G10·G11·G13~G15: 통분) ──
   답은 항상 [분자,분모] 페어(answerShape:'fraction', 약분 안 함 — CH5와
   같은 관례). mode: 'sameDenom' · 'diffDenom'(통분) · 'chain3'(세 유리수 혼합). */
NM_TGEN['md3_ratAddSub'] = function (params, rng) {
  const mode = params.mode || 'sameDenom';
  const DENOMS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 12];
  /* ── 소수가 섞인 유리수의 덧셈·뺄셈(2026-11-25) — 소수를 분수로 바꾸어 통분 ── */
  if (mode === 'decFrac') {
    const DEC = [[0.5, 1, 2], [0.25, 1, 4], [0.75, 3, 4], [0.2, 1, 5], [0.4, 2, 5], [0.6, 3, 5], [0.8, 4, 5], [1.5, 3, 2], [1.2, 6, 5], [0.3, 3, 10], [0.7, 7, 10]];
    const [dv, dn, dd] = pick(rng, DEC), ds = signOf(rng);
    let fd, fn; do { fd = pick(rng, [2, 3, 4, 5, 6, 8, 10, 12]); fn = R(rng, 1, fd - 1); } while (fd === dd || gcd(fn, fd) !== 1);
    const fs = signOf(rng), op = pick(rng, ['+', '-']), decFirst = R(rng, 0, 1) === 1;
    const A = decFirst ? [ds * dn, dd] : [fs * fn, fd], B = decFirst ? [fs * fn, fd] : [ds * dn, dd];
    const At = decFirst ? sT(ds * dv) : `\\left(${fs < 0 ? '-' : '+'}\\dfrac{${fn}}{${fd}}\\right)`;
    const Bt = decFirst ? `\\left(${fs < 0 ? '-' : '+'}\\dfrac{${fn}}{${fd}}\\right)` : sT(ds * dv);
    const L = lcm(A[1], B[1]), num = A[0] * (L / A[1]) + (op === '+' ? 1 : -1) * B[0] * (L / B[1]);
    const r = fracAns(num, L);
    return Object.assign({ prompt: L3m('소수를 분수로 바꾼 뒤 통분하여 계산합니다', 'Change the decimal to a fraction, use a common denominator, then calculate.', '先把小数化成分数，通分后再计算。'),
      tex: `${At} ${op} ${Bt} = \\square`, answerType: 'number', widget: 'numpad', negative: num < 0,
      solution: [{ tex: `${ds * dv} = ${fT(ds * dn, dd)}` }, { tex: `= ${fT(num, L)}` }] }, r);
  }


  if (mode === 'sameDenom') {
    const d = pick(rng, DENOMS);
    const a1 = signOf(rng) * R(rng, 1, d - 1);
    const a2 = signOf(rng) * R(rng, 1, d - 1);
    const [n, den] = normFrac(a1 + a2, d);
    return {
      prompt: {
        ko: `분모가 같으면 정수처럼 분자끼리만 계산합니다`,
        en: `Same denominator — just combine the numerators, like integers`,
        zh: `分母相同——像整数一样只算分子'`
      },
      tex: `\\dfrac{${a1}}{${d}} + \\dfrac{${a2}}{${d}} = \\square`,
      answer: [n, den], answerShape: 'fraction', answerType: 'number', widget: 'numpad',
      negative: (a1 + a2) < 0,
      solution: [
        { tex: `\\dfrac{${a1}}{${d}} + \\dfrac{${a2}}{${d}} = \\dfrac{${a1 + a2}}{${d}}` },
        { tex: `\\dfrac{${a1 + a2}}{${d}} = \\dfrac{\\square}{\\square}`, blank: [n, den] }
      ]
    };
  }

  if (mode === 'diffDenom') {
    let d1 = pick(rng, DENOMS), d2;
    do { d2 = pick(rng, DENOMS); } while (d2 === d1);
    const LCD = lcm(d1, d2);
    const a1 = signOf(rng) * R(rng, 1, d1 - 1);
    const a2 = signOf(rng) * R(rng, 1, d2 - 1);
    const conv1 = a1 * (LCD / d1);
    const conv2 = a2 * (LCD / d2);
    const [n, den] = normFrac(conv1 + conv2, LCD);
    return {
      prompt: {
        ko: `분모가 다르면 분모의 최소공배수로 통분한 뒤 더합니다 (최소공배수=${LCD})`,
        en: `Different denominators — convert to the LCM first, then add (LCM=${LCD})`,
        zh: `分母不同——先通分到最小公倍数再相加(最小公倍数=${LCD})`
      },
      tex: `\\dfrac{${a1}}{${d1}} + \\dfrac{${a2}}{${d2}} = \\square`,
      answer: [n, den], answerShape: 'fraction', answerType: 'number', widget: 'numpad',
      negative: (conv1 + conv2) < 0,
      solution: [
        { tex: `\\dfrac{${a1}}{${d1}} + \\dfrac{${a2}}{${d2}} = \\dfrac{${conv1}}{${LCD}} + \\dfrac{${conv2}}{${LCD}}` },
        { tex: `\\dfrac{${conv1}}{${LCD}} + \\dfrac{${conv2}}{${LCD}} = \\dfrac{\\square}{\\square}`, blank: [n, den] }
      ]
    };
  }

  /* chain3 — G13~G15: 분모가 다른 세 유리수의 덧뺄셈 혼합 */
  const ds = [pick(rng, DENOMS), pick(rng, DENOMS), pick(rng, DENOMS)];
  const LCD = ds.reduce((acc, d) => lcm(acc, d), 1);
  const terms = ds.map(d => signOf(rng) * R(rng, 1, d - 1));
  const convs = terms.map((a, i) => a * (LCD / ds[i]));
  const sumNum = convs.reduce((a, b) => a + b, 0);
  const [n, den] = normFrac(sumNum, LCD);
  const exprTex = terms.map((a, i) => (i === 0 ? `\\dfrac{${a}}{${ds[i]}}` : ` + \\dfrac{${a}}{${ds[i]}}`)).join('');
  return {
    prompt: {
      ko: `세 유리수의 덧뺄셈 혼합입니다. 분모의 최소공배수로 통분한 뒤 앞에서부터 계산합니다 (최소공배수=${LCD})`,
      en: `Mixed addition of three rational numbers — convert to the LCM, then combine left to right (LCM=${LCD})`,
      zh: `三个有理数的混合加减——先通分到最小公倍数，再从左到右计算(最小公倍数=${LCD})`
    },
    tex: `${exprTex} = \\square`,
    answer: [n, den], answerShape: 'fraction', answerType: 'number', widget: 'numpad',
    negative: sumNum < 0,
    /* 2026-09-20: 통분한 모습을 통째로 건너뛰고 합만 보여 줬었다 — 정작 어려운 부분(최소공배수
       찾기·세 분수 고치기)이 한 줄에 감춰지고, 유일하게 채우는 칸은 윗줄 숫자를 옮겨 적는
       것뿐이었다. 같은 생성기의 diffDenom(두 항)은 이미 통분 줄을 보여 준다. */
    solution: [
      { tex: `${exprTex} = ${convs.map((c, i) => (i === 0 ? '' : ' + ') + `\\dfrac{${c}}{${LCD}}`).join('')}` },
      { tex: `${convs.map((c, i) => (i === 0 ? '' : ' + ') + `\\dfrac{${c}}{${LCD}}`).join('')} = \\dfrac{\\square}{${LCD}}`, blank: sumNum },
      { tex: `\\dfrac{${sumNum}}{${LCD}} = \\dfrac{\\square}{\\square}`, blank: [n, den] }
    ]
  };
};

/* ── MD4 — 정수·유리수의 곱셈과 나눗셈 (G16·G17·G18: 부호 결정) ──
   mode: 'mul2' · 'div2' · 'mulChain'(3~4개, 음수 개수 홀짝) ·
   'mixedChain'(곱셈·나눗셈 혼합, 앞에서부터). 규칙("음수 개수가 짝이면 +,
   홀이면 -")을 steps 첫 칸에 그대로 노출. */
NM_TGEN['md4_intMulDiv'] = function (params, rng) {
  const mode = params.mode || 'mul2';
  const lv = params.level || 'main';
  const mag = (hi) => nzMag(rng, 2, lv === 'practice' ? Math.min(hi, 12) : hi);
  /* ── 중1-1 세분화 단계(2026-11-25) ── */
  if (mode === 'mulLaws') {
    /* 곱셈의 계산 법칙 — 곱이 10·100이 되는 두 수를 먼저(교환·결합) */
    const [p, q] = pick(rng, [[4, 25], [2, 50], [5, 20], [8, 125], [2, 5], [4, 5], [25, 8]]);
    const m = nzMag(rng, 3, 13), sp = signOf(rng), sq = signOf(rng), sm = signOf(rng);
    const A = sp * p, B = sq * q, M = sm * m, pair = A * B, ans = pair * M;
    const order = pick(rng, [[A, M, B], [B, M, A], [M, A, B].reverse()]);
    const steps = [{ tex: `${sT(A)}\\times${sT(B)} = \\square`, blank: pair }, { tex: `${sT(pair)}\\times${sT(M)} = \\square`, blank: ans }];
    return { prompt: L3m('곱셈의 교환법칙·결합법칙으로 계산이 쉬운 두 수를 먼저 곱해요', 'Use the commutative and associative laws: multiply the easy pair first.', '用乘法交换律、结合律：先把容易相乘的两个数相乘。'),
      tex: `${order.map(sT).join('\\times')} = \\square`, answer: ans, answerType: 'steps', widget: 'steps', negative: ans < 0, steps, solution: steps };
  }

  if (mode === 'distributive') {
    /* 분배법칙 — 100 가까운 수로 나누기 · 공통인 수로 묶기 · a×b, a×c로 a×(b+c) */
    const kind = pick(rng, ['near', 'factor', 'given', 'frac']);
    if (kind === 'near') {
      const a = signOf(rng) * nzMag(rng, 2, 9), d = R(rng, 1, 3), up = R(rng, 0, 1) === 1, b = up ? 100 + d : 100 - d, ans = a * b;
      const steps = [{ tex: `${sT(a)}\\times 100 = \\square`, blank: a * 100 }, { tex: `${sT(a)}\\times ${sT(up ? d : -d)} = \\square`, blank: a * (up ? d : -d) },
                     { tex: `${a * 100} + ${sT(a * (up ? d : -d))} = \\square`, blank: ans }];
      return { prompt: L3m('100에 가까운 수를 (100 ± 몇)으로 나누어 분배법칙으로 계산해요', 'Split the number near 100 as 100 ± something and use the distributive law.', '把接近100的数拆成100±几，用分配律计算。'),
        tex: `${sT(a)}\\times ${b} = \\square`, answer: ans, answerType: 'steps', widget: 'steps', negative: ans < 0, steps, solution: [{ tex: `= ${sT(a)}\\times(100 ${up ? '+' : '-'} ${d})` }].concat(steps) };
    }
    if (kind === 'factor') {
      const T = pick(rng, [100, 100, 50, 200]), a = signOf(rng) * nzMag(rng, 2, 15), b = R(rng, 11, T - 11), c = T - b;
      const ans = a * (b + c);
      const steps = [{ tex: `${b} + ${c} = \\square`, blank: b + c }, { tex: `${sT(a)}\\times ${b + c} = \\square`, blank: ans }];
      return { prompt: L3m('공통인 수로 묶어 분배법칙으로 계산해요', 'Factor out the common number and use the distributive law.', '提取公因数，用分配律计算。'),
        tex: `${sT(a)}\\times ${b} + ${sT(a)}\\times ${c} = \\square`, answer: ans, answerType: 'steps', widget: 'steps', negative: ans < 0, steps,
        solution: [{ tex: `= ${sT(a)}\\times(${b} + ${c})` }].concat(steps) };
    }
    if (kind === 'given') {
      const x = R(rng, -30, 30), y = R(rng, -30, 30), ans = x + y;
      return { prompt: L3m('분배법칙 a×(b+c) = a×b + a×c 를 써서 값을 구해요', 'Use a×(b+c) = a×b + a×c.', '利用 a×(b+c)=a×b+a×c 求值。'),
        tex: `a\\times b = ${x},\\;\\; a\\times c = ${y} \\;\\Rightarrow\\; a\\times(b+c) = \\square`, answer: ans, answerType: 'number', widget: 'numpad', negative: true,
        solution: [{ tex: `a\\times(b+c) = a\\times b + a\\times c` }, { tex: `= ${x} + ${sT(y)} = \\square`, blank: ans }] };
    }
    const [d1, d2] = shuffleM(rng, [2, 3, 4, 6]).slice(0, 2), L = d1 * d2 / gcd(d1, d2), m = signOf(rng) * L * R(rng, 1, 2), op = pick(rng, ['+', '-']);
    const t1 = m / d1, t2 = m / d2, ans = op === '+' ? t1 + t2 : t1 - t2;
    const steps = [{ tex: `\\dfrac{1}{${d1}}\\times${sT(m)} = \\square`, blank: t1 }, { tex: `\\dfrac{1}{${d2}}\\times${sT(m)} = \\square`, blank: t2 },
                   { tex: `${t1} ${op} ${sT(t2)} = \\square`, blank: ans }];
    return { prompt: L3m('분배법칙으로 괄호 안 분수에 각각 곱해요', 'Use the distributive law: multiply each fraction in the brackets.', '用分配律，把括号里的每个分数分别相乘。'),
      tex: `\\left(\\dfrac{1}{${d1}} ${op} \\dfrac{1}{${d2}}\\right)\\times${sT(m)} = \\square`, answer: ans, answerType: 'steps', widget: 'steps', negative: ans < 0, steps, solution: steps };
  }


  if (mode === 'mul2') {
    const a = signOf(rng) * mag(30), b = signOf(rng) * mag(30);
    const negCount = (a < 0 ? 1 : 0) + (b < 0 ? 1 : 0);
    const absProduct = Math.abs(a) * Math.abs(b);
    const product = a * b;
    return {
      prompt: {
        ko: `${a} × ${wrapSigned(b)}: 곱의 부호를 먼저 정하고 절댓값끼리 곱합니다`,
        en: `${a} × ${b}: decide the sign of the product first, then multiply the absolute values`,
        zh: `${a} × ${b}：先确定积的符号，再把绝对值相乘`
      },
      tex: `${a} \\times ${wrapSigned(b)} = \\square`,
      answer: product, answerType: 'steps', widget: 'steps',
      steps: [
        { tex: `\\text{음수 개수}: \\square`, blank: negCount },
        { tex: `|${a}| \\times |${b}| = \\square`, blank: absProduct },
        { tex: `${a} \\times ${wrapSigned(b)} = \\square`, blank: product }
      ],
      solution: [
        { tex: `\\text{음수 개수}: \\square`, blank: negCount },
        { tex: `|${a}| \\times |${b}| = \\square`, blank: absProduct },
        { tex: `${a} \\times ${wrapSigned(b)} = \\square`, blank: product }
      ]
    };
  }

  if (mode === 'div2') {
    const b = signOf(rng) * mag(12);
    const q = signOf(rng) * mag(12);
    const a = b * q;
    const negCount = (a < 0 ? 1 : 0) + (b < 0 ? 1 : 0);
    return {
      prompt: {
        ko: `${a} ÷ ${wrapSigned(b)}: 몫의 부호를 먼저 정하고 절댓값끼리 나눕니다`,
        en: `${a} ÷ ${b}: decide the sign of the quotient first, then divide the absolute values`,
        zh: `${a} ÷ ${b}：先确定商的符号，再把绝对值相除`
      },
      tex: `${a} \\div ${wrapSigned(b)} = \\square`,
      answer: q, answerType: 'steps', widget: 'steps',
      steps: [
        { tex: `\\text{음수 개수}: \\square`, blank: negCount },
        { tex: `|${a}| \\div |${b}| = \\square`, blank: Math.abs(q) },
        { tex: `${a} \\div ${wrapSigned(b)} = \\square`, blank: q }
      ],
      solution: [
        { tex: `\\text{음수 개수}: \\square`, blank: negCount },
        { tex: `|${a}| \\div |${b}| = \\square`, blank: Math.abs(q) },
        { tex: `${a} \\div ${wrapSigned(b)} = \\square`, blank: q }
      ]
    };
  }

  if (mode === 'mulChain') {
    const n = lv === 'practice' ? 3 : R(rng, 3, 4);
    const factors = [];
    for (let i = 0; i < n; i++) factors.push(signOf(rng) * mag(15));
    const negCount = factors.filter(f => f < 0).length;
    const absProduct = factors.reduce((p, f) => p * Math.abs(f), 1);
    const product = factors.reduce((p, f) => p * f, 1);
    const exprTex = factors.map((f,i) => i ? wrapSigned(f) : String(f)).join(' \\times ');
    const absTex = factors.map(f => `|${f}|`).join(' \\times ');
    return {
      prompt: {
        ko: `세 개 이상의 정수의 곱셈 — 음수가 짝수 개면 +, 홀수 개면 -입니다`,
        en: `Multiplying three or more integers — an even count of negatives gives +, odd gives -`,
        zh: `三个以上整数相乘——负数个数为偶数得正，为奇数得负`
      },
      tex: `${exprTex} = \\square`,
      answer: product, answerType: 'steps', widget: 'steps',
      steps: [
        { tex: `\\text{음수 개수}: \\square`, blank: negCount },
        { tex: `${absTex} = \\square`, blank: absProduct },
        { tex: `${exprTex} = \\square`, blank: product }
      ],
      solution: [
        { tex: `\\text{음수 개수}: \\square`, blank: negCount },
        { tex: `${absTex} = \\square`, blank: absProduct },
        { tex: `${exprTex} = \\square`, blank: product }
      ]
    };
  }

  /* bracketChain — G18: 괄호가 겹친 정수의 곱셈·나눗셈 혼합 (2026-09-29 신규).
     소괄호 → 중괄호 → 대괄호 순서로 안쪽부터 계산한다. 두 모양:
       flat   A op1 [ B op2 C ]                 — 대괄호 안을 먼저
       nested A op1 [ B op2 { C op3 D } ]       — 중괄호, 대괄호, 바깥 순서
     나눗셈은 늘 나누어떨어지게 거꾸로 만든다. 문제는 새로 지었다. */
  if (mode === 'bracketChain') {
    const sm = hi => signOf(rng) * nzMag(rng, 2, hi);
    const OPS = ['\\times', '\\div'];
    /* x op y 를 정수로 떨어지게 — op 이 ÷ 이면 x 를 y 의 배수로 다시 만든다 */
    const pair = (x, op, y) => op === '\\times' ? { x, y, v: x * y } : { x: x * y, y, v: x };
    let tex, steps, answer, tries = 0;
    for (;;) {
      tries++;
      const shape = pick(rng, ['flat', 'nested']);
      const op1 = pick(rng, OPS), op2 = pick(rng, OPS), op3 = pick(rng, OPS);
      if (shape === 'flat') {
        const inner = pair(sm(9), op2, sm(6));
        if (Math.abs(inner.v) < 2 && op1 === '\\div') continue;
        const outer = op1 === '\\times' ? { A: sm(9), v: 0 } : { A: inner.v * sm(6), v: 0 };
        answer = op1 === '\\times' ? outer.A * inner.v : outer.A / inner.v;
        if (Math.abs(outer.A) > 200 || Math.abs(inner.x) > 60 || Math.abs(answer) > 400) continue;
        const inTex = `${wrapSigned(inner.x)} ${op2} ${wrapSigned(inner.y)}`;
        tex = `${outer.A} ${op1} [\\, ${inTex} \\,] = \\square`;
        steps = [
          { tex: `${inTex} = \\square \\;(\\text{대괄호 먼저})`, blank: inner.v },
          { tex: `${outer.A} ${op1} ${wrapSigned(inner.v)} = \\square`, blank: answer },
          { tex, blank: answer }
        ];
      } else {
        const inn = pair(sm(9), op3, sm(5));
        if (Math.abs(inn.v) < 2 && op2 === '\\div') continue;
        const mid = op2 === '\\times' ? { B: sm(6), v: 0 } : { B: inn.v * sm(4), v: 0 };
        mid.v = op2 === '\\times' ? mid.B * inn.v : mid.B / inn.v;
        if (Math.abs(mid.v) < 2 && op1 === '\\div') continue;
        const A = op1 === '\\times' ? sm(5) : mid.v * sm(4);
        answer = op1 === '\\times' ? A * mid.v : A / mid.v;
        if (Math.abs(A) > 300 || Math.abs(mid.B) > 120 || Math.abs(inn.x) > 60 || Math.abs(answer) > 400) continue;
        const innTex = `${wrapSigned(inn.x)} ${op3} ${wrapSigned(inn.y)}`;
        tex = `${A} ${op1} [\\, ${wrapSigned(mid.B)} ${op2} \\{ ${innTex} \\} \\,] = \\square`;
        steps = [
          { tex: `${innTex} = \\square \\;(\\text{중괄호 먼저})`, blank: inn.v },
          { tex: `${wrapSigned(mid.B)} ${op2} ${wrapSigned(inn.v)} = \\square \\;(\\text{대괄호})`, blank: mid.v },
          { tex: `${A} ${op1} ${wrapSigned(mid.v)} = \\square`, blank: answer },
          { tex, blank: answer }
        ];
      }
      if (Number.isInteger(answer) && answer !== 0 && /-/.test(tex)) break;   /* 음수가 하나는 있어야 부호 단원이다 */
      if (tries > 400) break;
    }
    return {
      prompt: {
        ko: `괄호가 겹쳐 있으면 소괄호 → 중괄호 → 대괄호 순서로 안쪽부터 계산합니다`,
        en: `With nested brackets, work from the inside out: ( ) first, then { }, then [ ]`,
        zh: `括号套括号时从里往外算：先小括号，再中括号，最后大括号`
      },
      tex, answer, answerType: 'steps', widget: 'steps', steps, solution: steps
    };
  }

  /* mixedChain — G18: 곱셈과 나눗셈 혼합, 앞에서부터 차례로 */
  const shape = pick(rng, ['ab_div_c', 'a_div_b_c']);
  if (shape === 'a_div_b_c') {
    const b = signOf(rng) * mag(9);
    const q1 = signOf(rng) * mag(9);
    const a = b * q1;
    const c = signOf(rng) * mag(9);
    const answer = q1 * c;
    return {
      prompt: {
        ko: `${a} \\div ${b} \\times ${c}: 곱셈·나눗셈 혼합은 앞에서부터 차례로 계산합니다`,
        en: `${a} ÷ ${b} × ${c}: mixed × and ÷ — work left to right`,
        zh: `${a} ÷ ${b} × ${c}：乘除混合运算从左到右依次计算`
      },
      tex: `${a} \\div ${wrapSigned(b)} \\times ${wrapSigned(c)} = \\square`,
      answer, answerType: 'steps', widget: 'steps',
      steps: [
        { tex: `${a} \\div ${wrapSigned(b)} = \\square`, blank: q1 },
        { tex: `${q1} \\times ${wrapSigned(c)} = \\square`, blank: answer }
      ],
      solution: [
        { tex: `${a} \\div ${wrapSigned(b)} = \\square`, blank: q1 },
        { tex: `${q1} \\times ${wrapSigned(c)} = \\square`, blank: answer }
      ]
    };
  }
  const a = signOf(rng) * mag(9), b = signOf(rng) * mag(9);
  const interim = a * b;
  const divisors = divisorsOf(interim).filter(d => d >= 2);
  const cMag = divisors.length ? pick(rng, divisors) : 1;
  const c = signOf(rng) * cMag;
  const answer = interim / c;
  return {
    prompt: {
      ko: `${a} \\times ${b} \\div ${c}: 곱셈·나눗셈 혼합은 앞에서부터 차례로 계산합니다`,
      en: `${a} × ${b} ÷ ${c}: mixed × and ÷ — work left to right`,
      zh: `${a} × ${b} ÷ ${c}：乘除混合运算从左到右依次计算`
    },
    tex: `${a} \\times ${wrapSigned(b)} \\div ${wrapSigned(c)} = \\square`,
    answer, answerType: 'steps', widget: 'steps',
    steps: [
      { tex: `${a} \\times ${wrapSigned(b)} = \\square`, blank: interim },
      { tex: `${interim} \\div ${wrapSigned(c)} = \\square`, blank: answer }
    ],
    solution: [
      { tex: `${a} \\times ${wrapSigned(b)} = \\square`, blank: interim },
      { tex: `${interim} \\div ${wrapSigned(c)} = \\square`, blank: answer }
    ]
  };
};

/* ── MD5 — 거듭제곱과 부호 (G19) ──
   (-a)^n(밑에 괄호) vs -a^n(지수가 밑보다 우선, -(a^n))의 차이를 정확히
   구분한다 — 짝수 지수에서만 값이 갈린다((-2)^4=16, -2^4=-16), 홀수
   지수는 둘 다 음수로 같다((-2)^3=-8=-2^3). mode: 'paren' · 'bare' · 'mixed'. */
/* ratPower — G26: 유리수의 거듭제곱이 섞인 곱셈·나눗셈 (2026-09-29 신규). 답은 늘 정수.
     mulK  (±p/q)ⁿ × K        K 가 qⁿ 의 배수   (−1/2)³ × 16 = −2
     divK  K ÷ (±p/q)ⁿ        K 가 pⁿ 의 배수   8 ÷ (−2/3)³ = −27
     twoPw (±p/q)ⁿ × (±q)ᵐ   m ≥ n              (−1/2)² × (−2)³ = −2
   부호는 음수의 거듭제곱 규칙(지수가 짝수면 +, 홀수면 −)으로 마지막에 붙인다. 풀이 칸은 모두
   정수(분모의 거듭제곱 → 약분 → 분자의 거듭제곱)라 □ 가 분수 안에 들어가지 않는다.
   분수는 \bigl(\bigr) 로 묶는다(\left\right 는 인쇄 칸을 넘친 적이 있다). 문제는 새로 지었다. */
function md5RatPower(rng){
  const COPRIME = [[1,2],[1,3],[1,4],[1,5],[2,3],[3,2],[3,4],[4,3],[2,5],[5,2],[1,6],[3,5],[5,3]];
  for (let tries = 0; tries < 500; tries++) {
    const [p, q] = pick(rng, COPRIME);
    const n = R(rng, 2, 3);
    const s = signOf(rng);                      /* 밑의 부호 */
    const kind = pick(rng, ['mulK', 'divK', 'twoPw']);
    const lead = kind !== 'twoPw' && pick(rng, [0, 0, 1]) ? -1 : 1;   /* 맨 앞 −(…)ⁿ */
    const baseTex = `\\bigl(${s < 0 ? '-' : ''}\\frac{${p}}{${q}}\\bigr)^{${n}}`;
    const powSign = (s < 0 && n % 2) ? -1 : 1;
    const pn = Math.pow(p, n), qn = Math.pow(q, n);
    const leadTex = lead < 0 ? '-' : '';
    if (kind === 'mulK') {
      const m = R(rng, 1, 4), K = qn * m * signOf(rng);
      const absAns = pn * m, answer = lead * powSign * Math.sign(K) * absAns;
      if (qn > 64 || absAns > 200 || Math.abs(K) > 250) continue;
      const tex = `${leadTex}${baseTex} \\times ${wrapSigned(K)} = \\square`;
      const steps = [ { tex: `${q}^{${n}} = \\square`, blank: qn },
                      { tex: `${Math.abs(K)} \\div ${qn} = \\square`, blank: m } ];
      if (p > 1) steps.push({ tex: m === 1 ? `${p}^{${n}} = \\square` : `${p}^{${n}} \\times ${m} = \\square`, blank: absAns });
      steps.push({ tex, blank: answer });
      return { tex, answer, steps };
    }
    if (kind === 'divK') {
      const m = R(rng, 1, 4), K = pn * m * signOf(rng);
      const absAns = qn * m, answer = lead * powSign * Math.sign(K) * absAns;
      if (p === 1 || absAns > 200 || Math.abs(K) > 250) continue;   /* p=1 이면 K÷(1/qⁿ) 로 너무 쉽다 */
      const tex = `${K} \\div ${leadTex}${baseTex} = \\square`;
      if (lead < 0) continue;                    /* `÷ −(…)ⁿ` 는 교과 표기가 아니다 */
      const steps = [ { tex: `${p}^{${n}} = \\square`, blank: pn },
                      { tex: `${Math.abs(K)} \\div ${pn} = \\square`, blank: m },
                      { tex: m === 1 ? `${q}^{${n}} = \\square` : `${q}^{${n}} \\times ${m} = \\square`, blank: absAns },
                      { tex, blank: answer } ];
      return { tex, answer, steps };
    }
    /* twoPw */
    const mExp = n + R(rng, 0, 1);
    const t = signOf(rng);
    const T = Math.pow(t * q, mExp);                          /* (±q)ᵐ, 부호 포함 */
    const answer = powSign * pn * T / qn;
    if (Math.abs(T) > 250 || Math.abs(answer) > 200) continue;
    const qPow = t < 0 ? `(-${q})^{${mExp}}` : `${q}^{${mExp}}`;
    const tex = `${baseTex} \\times ${qPow} = \\square`;
    const steps = [ { tex: `${qPow} = \\square`, blank: T },
                    { tex: `${wrapSigned(T)} \\div ${qn} = \\square`, blank: T / qn } ];
    if (p > 1) steps.push({ tex: `${wrapSigned(T / qn)} \\times ${wrapSigned(powSign * pn)} = \\square`, blank: T / qn * powSign * pn });
    steps.push({ tex, blank: answer });
    return { tex, answer, steps };
  }
  const tex = `\\bigl(-\\frac{1}{2}\\bigr)^{3} \\times 16 = \\square`;
  return { tex, answer: -2, steps: [ { tex: `2^{3} = \\square`, blank: 8 }, { tex: `16 \\div 8 = \\square`, blank: 2 }, { tex, blank: -2 } ] };
}

NM_TGEN['md5_signedPower'] = function (params, rng) {
  const mode = params.mode || 'mixed';
  if (mode === 'ratPower') {
    const r = md5RatPower(rng);
    return {
      prompt: {
        ko: `유리수의 거듭제곱을 먼저 계산합니다 — 부호는 지수가 짝수면 +, 홀수면 −입니다`,
        en: `Work out the power of the rational number first — an even exponent gives +, an odd one gives −`,
        zh: `先算有理数的乘方——指数为偶数得正，为奇数得负`
      },
      tex: r.tex, answer: r.answer, answerType: 'steps', widget: 'steps',
      steps: r.steps, solution: r.steps
    };
  }
  const form = mode === 'mixed' ? pick(rng, ['paren', 'bare']) : mode;
  const a = R(rng, 2, 30);
  const n = R(rng, 2, 4);

  if (form === 'paren') {
    /* (-a)^n = (-a)×(-a)×…×(-a) — 반복 곱셈을 그대로 스텝으로 노출 */
    const steps = [];
    let prod = -a;
    for (let i = 1; i < n; i++) {
      const next = prod * (-a);
      steps.push({ tex: `${wrapSigned(prod)} \\times (${-a}) = \\square`, blank: next });
      prod = next;
    }
    const answer = prod;
    const repeated = Array(n).fill(`(${-a})`).join(' \\times ');
    return {
      prompt: {
        ko: `(-${a})^{${n}}: 밑이 통째로 괄호 안에 있습니다 — (-${a})를 ${n}번 곱합니다`,
        en: `(-${a})^${n}: the base itself is negative — multiply (-${a}) by itself ${n} times`,
        zh: `(-${a})^{${n}}：整个底数都在括号里——把(-${a})连乘${n}次`
      },
      tex: `(-${a})^{${n}} = \\square`,
      answer, answerType: 'steps', widget: 'steps', steps,
      solution: [
        { tex: `(-${a})^{${n}} = ${repeated}` },
        { tex: `${repeated} = \\square`, blank: answer }
      ]
    };
  }

  /* bare — -a^n = -(a^n): 지수가 a에만 걸리고, 맨 앞 -는 마지막에 붙는다 */
  const pw = Math.pow(a, n);
  const answer = -pw;
  return {
    prompt: {
      ko: `-${a}^{${n}}: 지수는 ${a}에만 걸립니다 — ${a}^{${n}}을 먼저 구하고 마지막에 -를 붙입니다`,
      en: `-${a}^${n}: the exponent applies only to ${a} — find ${a}^${n} first, then attach the minus sign`,
      zh: `-${a}^{${n}}：指数只作用于${a}——先求${a}^{${n}}，最后再加负号`
    },
    tex: `-${a}^{${n}} = \\square`,
    answer, answerType: 'steps', widget: 'steps',
    steps: [
      { tex: `${a}^{${n}} = \\square`, blank: pw },
      { tex: `-${pw} = \\square`, blank: answer }
    ],
    solution: [
      { tex: `${a}^{${n}} = \\square`, blank: pw },
      { tex: `-${pw} = \\square`, blank: answer }
    ]
  };
};

/* ── MD6 — 정수의 사칙 혼합 계산 (G18 확장: +-×÷ 전체 혼합·괄호) ──
   mode: 'noBrackets' · 'brackets' · 'withDivChain'. MD2(덧뺄만)·MD4(곱나눗만)와
   달리 네 연산이 한 문제에 다 섞인다 — 곱셈·나눗셈을 먼저, 괄호를 더 먼저. */
NM_TGEN['md6_intMixed'] = function (params, rng) {
  const mode = params.mode || 'noBrackets';
  const lv = params.level || 'main';
  const mag = (hi) => nzMag(rng, 2, lv === 'practice' ? Math.min(hi, 9) : hi);
  /* ── 거듭제곱·괄호가 있는 혼합 계산(2026-11-25, 디딤돌 중1-1A 「덧셈, 뺄셈, 곱셈, 나눗셈의 혼합 계산」) ── */
  if (mode === 'powMixed') {
    const kind = pick(rng, ['powFrac', 'brace', 'cube', 'bracket']);
    if (kind === 'powFrac') {
      const a = pick(rng, [2, 3, 4, 6]), sq = a * a, c = pick(rng, [2, 3, 4, 6, 9].filter(v => sq % v === 0)), b = R(rng, 1, 5);
      const e = nzMag(rng, 2, 6), k = signOf(rng) * nzMag(rng, 2, 6), d = e * k, op = pick(rng, ['+', '-']);
      const t1 = sq * b / c, t2 = d / -e, ans = op === '+' ? t1 + t2 : t1 - t2;
      const steps = [{ tex: `(-${a})^{2} = \\square`, blank: sq }, { tex: `${sq}\\times\\dfrac{${b}}{${c}} = \\square`, blank: t1 },
                     { tex: `${sT(d)}\\div(-${e}) = \\square`, blank: t2 }, { tex: `${t1} ${op} ${sT(t2)} = \\square`, blank: ans }];
      return { prompt: L3m('거듭제곱 → 곱셈·나눗셈 → 덧셈·뺄셈 차례로 계산합니다', 'Powers first, then × and ÷, then + and −.', '先算乘方，再算乘除，最后算加减。'),
        tex: `(-${a})^{2}\\times\\dfrac{${b}}{${c}} ${op} ${sT(d)}\\div(-${e}) = \\square`, answer: ans, answerType: 'steps', widget: 'steps', negative: ans < 0, steps, solution: steps };
    }
    if (kind === 'brace') {
      const a = nzMag(rng, 2, 12), b = R(rng, -9, 12), c = nzMag(rng, 2, 4), d = R(rng, -20, 20);
      const s = -a + b, p = c * c, ans = s * p - d;
      const steps = [{ tex: `(-${a}) + ${sT(b)} = \\square`, blank: s }, { tex: `(-${c})^{2} = \\square`, blank: p },
                     { tex: `${sT(s)}\\times ${p} - ${sT(d)} = \\square`, blank: ans }];
      return { prompt: L3m('괄호 안 → 거듭제곱 → 곱셈 → 뺄셈 차례로 계산합니다', 'Brackets first, then powers, then ×, then −.', '先算括号，再算乘方、乘法，最后算减法。'),
        tex: `\\{(-${a}) + ${sT(b)}\\}\\times(-${c})^{2} - ${sT(d)} = \\square`, answer: ans, answerType: 'steps', widget: 'steps', negative: ans < 0, steps, solution: steps };
    }
    if (kind === 'cube') {
      const a = nzMag(rng, 2, 6), b = nzMag(rng, 2, 4), cube = -b * b * b, c = pick(rng, [2, 4, 8, 1].filter(v => (b * b * b) % v === 0 && v > 1).concat([b]));
      const t1 = -a * a, t2 = cube / c, ans = t1 + t2;
      const steps = [{ tex: `-${a}^{2} = \\square`, blank: t1 }, { tex: `(-${b})^{3} = \\square`, blank: cube },
                     { tex: `${sT(cube)}\\div ${c} = \\square`, blank: t2 }, { tex: `${t1} + ${sT(t2)} = \\square`, blank: ans }];
      return { prompt: L3m('−a² 와 (−a)³ 의 부호에 주의해 거듭제곱부터 계산합니다', 'Watch the signs of −a² and (−a)³ and work out the powers first.', '注意−a²与(−a)³的符号，先算乘方。'),
        tex: `-${a}^{2} + (-${b})^{3}\\div ${c} = \\square`, answer: ans, answerType: 'steps', widget: 'steps', negative: ans < 0, steps, solution: steps };
    }
    const a = R(rng, -10, 10), b = nzMag(rng, 2, 9), c = nzMag(rng, 2, 4), d = R(rng, 1, 15), e = signOf(rng) * nzMag(rng, 2, 4);
    const inner = c * c - d, mid = b + inner, ans = a - mid * e;
    const steps = [{ tex: `(-${c})^{2} - ${d} = \\square`, blank: inner }, { tex: `${b} + ${sT(inner)} = \\square`, blank: mid },
                   { tex: `${sT(mid)}\\times ${sT(e)} = \\square`, blank: mid * e }, { tex: `${sT(a)} - ${sT(mid * e)} = \\square`, blank: ans }];
    return { prompt: L3m('소괄호 → 중괄호 → 대괄호 차례로, 안쪽부터 계산합니다', 'Work from the inside out: ( ), then { }, then [ ].', '由内向外：先小括号，再中括号，最后大括号。'),
      tex: `${sT(a)} - [\\,${b} + \\{(-${c})^{2} - ${d}\\}\\,]\\times ${sT(e)} = \\square`,
      answer: ans, answerType: 'steps', widget: 'steps', negative: ans < 0, steps, solution: steps };
  }


  if (mode === 'noBrackets') {
    /* a + b×c (부호 있는 a,b,c) */
    const a = signOf(rng) * mag(20);
    const b = signOf(rng) * mag(9);
    const c = signOf(rng) * mag(9);
    const bc = b * c;
    const answer = a + bc;
    return {
      prompt: {
        ko: `${a} + ${b} \\times ${c}: 괄호가 없으면 곱셈을 먼저 계산합니다`,
        en: `${a} + ${b} × ${c}: no brackets — multiply first`,
        zh: `${a} + ${b} × ${c}：没有括号先算乘法`
      },
      tex: `${a} + ${wrapSigned(b)} \\times ${wrapSigned(c)} = \\square`,
      answer, answerType: 'steps', widget: 'steps',
      steps: [
        { tex: `${wrapSigned(b)} \\times ${wrapSigned(c)} = \\square \\;(\\text{먼저!})`, blank: bc },
        { tex: `${a} + ${wrapSigned(bc)} = \\square`, blank: answer }
      ],
      solution: [
        { tex: `${wrapSigned(b)} \\times ${wrapSigned(c)} = \\square \\;(\\text{먼저!})`, blank: bc },
        { tex: `${a} + ${wrapSigned(bc)} = \\square`, blank: answer }
      ]
    };
  }

  if (mode === 'brackets') {
    /* (a+b)×c − d (부호 있는 a,b,c,d) — 괄호가 연산 순서를 바꾼다 */
    const a = signOf(rng) * mag(15);
    const b = signOf(rng) * mag(15);
    const c = signOf(rng) * mag(9);
    const d = signOf(rng) * mag(20);
    const ab = a + b;
    const abc = ab * c;
    const answer = abc - d;
    const wa = wrapSigned(a), wb = wrapSigned(b), wc = wrapSigned(c), wd = wrapSigned(d);
    return {
      prompt: {
        ko: `(${wa}+${wb}) \\times ${wc} - ${wd}: 괄호 안을 가장 먼저, 그다음 곱셈, 마지막 뺄셈`,
        en: `(${wa}+${wb}) × ${wc} - ${wd}: brackets first, then multiply, then subtract`,
        zh: `(${wa}+${wb}) × ${wc} - ${wd}：先算括号，再乘法，最后减法`
      },
      tex: `(${wa} + ${wb}) \\times ${wc} - ${wd} = \\square`,
      answer, answerType: 'steps', widget: 'steps',
      steps: [
        { tex: `${wa} + ${wb} = \\square \\;(\\text{괄호 먼저})`, blank: ab },
        { tex: `${ab} \\times ${wc} = \\square`, blank: abc },
        { tex: `${abc} - ${wd} = \\square`, blank: answer }
      ],
      solution: [
        { tex: `${wa} + ${wb} = \\square \\;(\\text{괄호 먼저})`, blank: ab },
        { tex: `${ab} \\times ${wc} = \\square`, blank: abc },
        { tex: `${abc} - ${wd} = \\square`, blank: answer }
      ]
    };
  }

  /* withDivChain — a + b×c÷d (나눗셈 포함 사칙 혼합, d는 b×c의 약수) */
  const a = signOf(rng) * mag(20);
  const b = signOf(rng) * mag(9);
  const c = signOf(rng) * mag(9);
  const bc = b * c;
  const divisors = divisorsOf(bc).filter(x => x >= 2);
  const dMag = divisors.length ? pick(rng, divisors) : 1;
  const d = signOf(rng) * dMag;
  const bcd = bc / d;
  const answer = a + bcd;
  return {
    prompt: {
      ko: `${a} + ${b} \\times ${c} \\div ${d}: 곱셈·나눗셈을 먼저 앞에서부터, 그다음 덧셈`,
      en: `${a} + ${b} × ${c} ÷ ${d}: do × and ÷ first (left to right), then add`,
      zh: `${a} + ${b} × ${c} ÷ ${d}：先从左到右做乘除法，再做加法`
    },
    tex: `${a} + ${wrapSigned(b)} \\times ${wrapSigned(c)} \\div ${wrapSigned(d)} = \\square`,
    answer, answerType: 'steps', widget: 'steps',
    steps: [
      { tex: `${wrapSigned(b)} \\times ${wrapSigned(c)} = \\square`, blank: bc },
      { tex: `${wrapSigned(bc)} \\div ${wrapSigned(d)} = \\square`, blank: bcd },
      { tex: `${a} + ${wrapSigned(bcd)} = \\square`, blank: answer }
    ],
    solution: [
      { tex: `${wrapSigned(b)} \\times ${wrapSigned(c)} = \\square`, blank: bc },
      { tex: `${wrapSigned(bc)} \\div ${wrapSigned(d)} = \\square`, blank: bcd },
      { tex: `${a} + ${wrapSigned(bcd)} = \\square`, blank: answer }
    ]
  };
};

/* ── MD7 — 유리수의 곱셈과 나눗셈 (G20~G25) ──
   답은 [분자,분모] 페어(약분 안 함). mode: 'mul' · 'div'(역수) · 'mixedChain'. */
NM_TGEN['md7_ratMulDiv'] = function (params, rng) {
  const mode = params.mode || 'mul';
  const DENOMS = [2, 3, 4, 5, 6, 7, 8, 9];
  /* ── 역수 구하기(2026-11-25, 디딤돌 중1-1A 「역수」) — 곱해서 1이 되는 수 ── */
  if (mode === 'reciprocal') {
    const kind = pick(rng, ['frac', 'int', 'dec', 'mixed']);
    let n, d, show;
    if (kind === 'frac') { do { d = R(rng, 2, 9); n = R(rng, 1, d * 2); } while (n % d === 0 || gcd(n, d) !== 1 || n === 1); n *= signOf(rng); show = fT(n, d); }
    else if (kind === 'int') { n = signOf(rng) * R(rng, 2, 12); d = 1; show = String(n); }
    else if (kind === 'dec') { [n, d] = pick(rng, [[1, 2], [1, 5], [1, 4], [2, 5], [3, 2], [6, 5], [3, 5], [7, 10], [3, 10]]); n *= signOf(rng); show = String(n / d); }
    else { const w = R(rng, 1, 3); let r; do { d = R(rng, 2, 5); r = R(rng, 1, d - 1); } while (gcd(r, d) !== 1); const sg = signOf(rng); n = sg * (w * d + r); show = (sg < 0 ? '-' : '') + `${w}\\dfrac{${r}}{${d}}`; }
    const [rn, rd] = normFrac(d * Math.sign(n), Math.abs(n)), r = fracAns(rn, rd);
    return Object.assign({ prompt: L3m('곱해서 1이 되는 수가 역수예요 — 소수·대분수는 먼저 분수로 바꿉니다', 'The reciprocal is the number that multiplies to 1; change decimals and mixed numbers to fractions first.', '乘积为1的两个数互为倒数；小数、带分数先化成分数。'),
      tex: `${show}\\text{의 역수} = ${rd === 1 ? '\\square' : '\\dfrac{\\square}{\\square}'}`, answerType: 'number', widget: 'numpad', negative: n < 0,
      solution: [{ tex: `${show} = ${fT(n, d)}` }, { tex: `${fT(n, d)}\\times ${pT(rn, rd)} = 1` }] }, r);
  }


  if (mode === 'mul') {
    const d1 = pick(rng, DENOMS), d2 = pick(rng, DENOMS);
    const a1 = signOf(rng) * R(rng, 1, d1 - 1);
    const a2 = signOf(rng) * R(rng, 1, d2 - 1);
    const [n, den] = normFrac(a1 * a2, d1 * d2);
    return {
      prompt: {
        ko: `유리수의 곱셈은 곱의 부호를 먼저 정한 뒤, 분자는 분자끼리 분모는 분모끼리 곱합니다`,
        en: `Multiplying rationals: decide the sign first, then multiply numerators and denominators separately`,
        zh: `有理数乘法：先确定积的符号，再分子乘分子、分母乘分母`
      },
      tex: `\\dfrac{${a1}}{${d1}} \\times \\dfrac{${a2}}{${d2}} = \\square`,
      answer: [n, den], answerShape: 'fraction', answerType: 'number', widget: 'numpad',
      negative: (a1 * a2) < 0,
      solution: [
        { tex: `\\dfrac{${a1}}{${d1}} \\times \\dfrac{${a2}}{${d2}} = \\dfrac{${a1 * a2}}{${d1 * d2}}` },
        { tex: `\\dfrac{${a1 * a2}}{${d1 * d2}} = \\dfrac{\\square}{\\square}`, blank: [n, den] }
      ]
    };
  }

  if (mode === 'div') {
    const d1 = pick(rng, DENOMS), d2 = pick(rng, DENOMS);
    const a1 = signOf(rng) * R(rng, 1, d1 - 1);
    let a2; do { a2 = signOf(rng) * R(rng, 1, d2 - 1); } while (a2 === 0);
    /* a1/d1 ÷ a2/d2 = a1/d1 × d2/a2 (나누는 수의 역수) */
    const [n, den] = normFrac(a1 * d2, d1 * a2);
    return {
      prompt: {
        ko: `나눗셈은 나누는 수의 역수를 곱해요: \\dfrac{${a2}}{${d2}}의 역수는 \\dfrac{${d2}}{${a2}}`,
        en: `Division = multiply by the reciprocal of the divisor: the reciprocal of ${a2}/${d2} is ${d2}/${a2}`,
        zh: `除法＝乘以除数的倒数：${a2}/${d2}的倒数是${d2}/${a2}`
      },
      tex: `\\dfrac{${a1}}{${d1}} \\div \\dfrac{${a2}}{${d2}} = \\square`,
      answer: [n, den], answerShape: 'fraction', answerType: 'number', widget: 'numpad',
      negative: (a1 * d2 * (d1 * a2)) < 0,
      solution: [
        { tex: `\\dfrac{${a1}}{${d1}} \\div \\dfrac{${a2}}{${d2}} = \\dfrac{${a1}}{${d1}} \\times \\dfrac{${d2}}{${a2}}` },
        { tex: `\\dfrac{${a1}}{${d1}} \\times \\dfrac{${d2}}{${a2}} = \\dfrac{\\square}{\\square}`, blank: [n, den] }
      ]
    };
  }

  /* bracketChain — G24·G25: 대괄호가 있는 유리수의 곱셈·나눗셈 혼합 (2026-09-29 신규).
     답은 늘 정수 하나. 모양 두 가지:
       A op1 [ X op2 Y ]    ·    [ X op2 Y ] op1 A
     정수 답을 먼저 정하고 대괄호 안의 값 v 에서 A 를 거꾸로 구해 만든다. 네 수 가운데 적어도
     둘은 분모가 1 이 아닌 분수다. 분수는 \bigl(\bigr) 로 묶는다. 문제는 새로 지었다. */
  if (mode === 'bracketChain') {
    const F = (n, d) => { const [a, b] = normFrac(n, d); return { n: a, d: b }; };
    const mul = (x, y) => F(x.n * y.n, x.d * y.d);
    const div = (x, y) => F(x.n * y.d, x.d * y.n);
    const raw = x => x.d === 1 ? String(x.n) : `${x.n < 0 ? '-' : ''}\\frac{${Math.abs(x.n)}}{${x.d}}`;
    const wrapQ = x => x.n < 0 ? (x.d === 1 ? `(${x.n})` : `\\bigl(${raw(x)}\\bigr)`) : raw(x);
    const rndQ = (maxN, maxD) => { const d = R(rng, 1, maxD); return F(signOf(rng) * R(rng, 1, maxN), d); };
    let tex, answer, sol;
    for (let tries = 0; tries < 2000; tries++) {
      const X = rndQ(9, 9), Y = rndQ(9, 9);
      const op2 = pick(rng, ['\\times', '\\div']), op1 = pick(rng, ['\\times', '\\div']);
      const before = pick(rng, [true, false]);                 /* A 가 대괄호 앞인가 */
      const v = op2 === '\\times' ? mul(X, Y) : div(X, Y);
      const ans = signOf(rng) * R(rng, 1, 12);
      const Ans = { n: ans, d: 1 };
      /* A op1 v = ans  또는  v op1 A = ans 에서 A 를 푼다 */
      let A;
      if (before) A = op1 === '\\times' ? div(Ans, v) : mul(Ans, v);
      else        A = op1 === '\\times' ? div(Ans, v) : div(v, Ans);
      const terms = [X, Y, A];
      if (terms.some(t => Math.abs(t.n) > 30 || t.d > 30)) continue;
      if (terms.filter(t => t.d > 1).length < 2) continue;
      if (terms.some(t => t.d === 1 && Math.abs(t.n) === 1)) continue;   /* ×1·÷1 은 빈 연산이다 */
      if (v.d > 60 || Math.abs(v.n) > 60) continue;
      const inTex = `${wrapQ(X)} ${op2} ${wrapQ(Y)}`;
      tex = before ? `${raw(A)} ${op1} \\bigl[ ${inTex} \\bigr] = \\square`
                   : `\\bigl[ ${raw(X)} ${op2} ${wrapQ(Y)} \\bigr] ${op1} ${wrapQ(A)} = \\square`;
      answer = ans;
      sol = [
        { tex: `${before ? inTex : `${raw(X)} ${op2} ${wrapQ(Y)}`} = ${raw(v)} \\;(\\text{대괄호 먼저})` },
        { tex: before ? `${raw(A)} ${op1} ${wrapQ(v)} = \\square` : `${raw(v)} ${op1} ${wrapQ(A)} = \\square`, blank: answer },
        { tex, blank: answer }
      ];
      break;
    }
    if (!tex) {                                    /* 사실상 닿지 않는 안전판 */
      tex = `-\\frac{15}{2} \\times \\bigl[ \\frac{7}{5} \\times \\bigl(-\\frac{2}{3}\\bigr) \\bigr] = \\square`; answer = 7;
      sol = [ { tex: `\\frac{7}{5} \\times \\bigl(-\\frac{2}{3}\\bigr) = -\\frac{14}{15}` }, { tex, blank: 7 } ];
    }
    return {
      prompt: {
        ko: `대괄호 안을 먼저 계산합니다 — 음수의 개수로 부호를 정하고, 나눗셈은 역수의 곱셈으로 바꿉니다`,
        en: `Work out the square brackets first — fix the sign from the number of negatives and turn ÷ into × by the reciprocal`,
        zh: `先算大括号里的——用负数的个数定符号，除法改成乘倒数`
      },
      tex, answer, answerType: 'number', widget: 'numpad', negative: answer < 0,
      solution: sol
    };
  }

  /* mixedChain — G24·G25: 곱셈·나눗셈 혼합, 음수 개수로 부호 먼저 결정 */
  const d1 = pick(rng, DENOMS), d2 = pick(rng, DENOMS), d3 = pick(rng, DENOMS);
  const a1 = signOf(rng) * R(rng, 1, d1 - 1);
  const a2 = signOf(rng) * R(rng, 1, d2 - 1);
  let a3; do { a3 = signOf(rng) * R(rng, 1, d3 - 1); } while (a3 === 0);
  const op2 = pick(rng, ['\\times', '\\div']);
  /* a1/d1 × a2/d2 (×) a3/d3  또는 (÷, 즉 ×역수) */
  let num = a1 * a2, den = d1 * d2;
  if (op2 === '\\times') { num = num * a3; den = den * d3; }
  else { num = num * d3; den = den * a3; }
  const [n, dd] = normFrac(num, den);
  return {
    prompt: {
      ko: `세 유리수의 곱셈·나눗셈 혼합 — 음수 개수로 부호를 먼저 정하고, 나눗셈은 역수의 곱셈으로 바꿉니다`,
      en: `Mixed × and ÷ of three rationals — count negatives for the sign first, turn ÷ into × by the reciprocal`,
      zh: `三个有理数的乘除混合——先用负数个数定符号，除法换成乘倒数'`
    },
    tex: `\\dfrac{${a1}}{${d1}} \\times \\dfrac{${a2}}{${d2}} ${op2} \\dfrac{${a3}}{${d3}} = \\square`,
    answer: [n, dd], answerShape: 'fraction', answerType: 'number', widget: 'numpad',
    negative: n < 0,  /* den(=d1*d2*(op2==='÷'?a3:d3))이 ÷일 때 a3의 부호를 타고 음수가 될 수
                          있어 normFrac()이 부호를 뒤집을 수 있다 — 정규화 이후 값 n을 봐야 한다 */
    solution: [
      { tex: `\\dfrac{${a1}}{${d1}} \\times \\dfrac{${a2}}{${d2}} ${op2} \\dfrac{${a3}}{${d3}} = \\dfrac{${num}}{${den}}` },
      { tex: `\\dfrac{${num}}{${den}} = \\dfrac{\\square}{\\square}`, blank: [n, dd] }
    ]
  };
};

/* ── MD8 — 유한소수 판별 (과정-로드맵.md §6 계보1 '2와 5는 친구'의 종착) ──
   기약분수로 약분했을 때 분모의 소인수가 2와 5뿐이면 유한소수(답 1),
   그 외의 소인수가 하나라도 있으면 순환소수(답 0). level:'reduced'(이미
   기약분수) · 'unreduced'(약분해야 진짜 분모가 드러남 — 더 어려움). */
NM_TGEN['md8_terminating'] = function (params, rng) {
  const lv = params.level || 'reduced';
  const willTerminate = pick(rng, [true, false]);

  let redDen;
  if (willTerminate) {
    const p = R(rng, 0, 3), q = R(rng, 0, 3);
    redDen = Math.pow(2, p) * Math.pow(5, q);
    if (redDen === 1) redDen = pick(rng, [2, 5]);
  } else {
    const other = pick(rng, [3, 7, 9, 11, 13]);
    const withTwoFive = pick(rng, [true, false]);
    redDen = withTwoFive ? other * pick(rng, [2, 4, 5, 10]) : other;
  }

  let num;
  do { num = R(rng, 1, redDen - 1); } while (gcd(num, redDen) !== 1);

  let dispNum = num, dispDen = redDen;
  if (lv === 'unreduced') {
    const k = R(rng, 2, 5);
    dispNum = num * k; dispDen = redDen * k;
  }

  const answer = willTerminate ? 1 : 0;
  let remaining = redDen;
  while (remaining % 2 === 0) remaining /= 2;
  while (remaining % 5 === 0) remaining /= 5;
  return {
    prompt: {
      ko: `\\dfrac{${dispNum}}{${dispDen}}를 소수로 나타내면 유한소수일까요? 유한소수면 1, 순환소수(무한소수)면 0을 누릅니다`,
      en: `Does ${dispNum}/${dispDen} become a terminating decimal? Press 1 if terminating, 0 if repeating`,
      zh: `${dispNum}/${dispDen}化成小数是有限小数吗？有限小数按1，循环小数按0`
    },
    tex: `\\dfrac{${dispNum}}{${dispDen}} \\;\\Rightarrow\\; \\square \\;(1=\\text{유한},\\,0=\\text{순환})`,
    answer, answerType: 'number', widget: 'numpad',
    solution: [
      { tex: `\\dfrac{${dispNum}}{${dispDen}} = \\dfrac{${num}}{${redDen}} \\;(\\text{기약분수})` },
      { tex: `${redDen} \\;\\to\\; \\text{2,5 이외 소인수} = ${remaining}` },
      { tex: `\\Rightarrow \\square \\;(1=\\text{유한},\\,0=\\text{순환})`, blank: answer }
    ]
  };
};

/* ── MD9 — 순환소수 → 분수 (섞인 순환소수, CH5와 차별화) ──
   CH5(adv_repeatDec.toFraction)는 처음부터 반복되는 0.\overline{R} 만 다룬다.
   여기는 반복 전 자리(비순환부, k자리)가 있는 중2 표준형 0.P\overline{R}까지
   일반화한다 — 공식: 분자 = "P뒤에 R을 이어붙인 수" - P, 분모 = 10^k×(10^m-1).
   (예: 0.41\overline{6} → 416-41=375, 100×9=900 → 375/900 = 5/12) */
/* n번째 자리 모드는 중2-1의 별도 손동작이다. 순환마디 길이로 n을 나눈
   나머지를 1-based 위치로 바꾼다. 나머지가 0이면 마지막 자리다.
   고정 블록×자리의 196개 유한 풀에서 한 번만 뽑아, 숨은 난수 차이가 같은
   학습자 노출 문항을 만드는 일이 없게 한다. */
const MD9_DIGIT_BLOCKS = Object.freeze([
  '13','26','37','58','107','125','208','314','427','503','1247','2031','142857','076923'
]);
const MD9_DIGIT_POSITIONS = Object.freeze([5,7,8,10,11,12,17,20,23,30,41,50,73,99]);
const MD9_DIGIT_AT_POOL = Object.freeze((function(){
  const pool = [];
  for(const block of MD9_DIGIT_BLOCKS){
    for(const n of MD9_DIGIT_POSITIONS) pool.push(Object.freeze({ block, n }));
  }
  return pool;
})());
NM_TGEN['md9_repeatToFrac'] = function (params, rng) {
  if (params.mode === 'digitAt') {
    const chosen = pick(rng, MD9_DIGIT_AT_POOL);
    const block = chosen.block;
    const n = chosen.n;
    const cycleLength = block.length;
    const quotient = Math.floor(n / cycleLength);
    const remainder = n % cycleLength;
    const cyclePosition = remainder === 0 ? cycleLength : remainder;
    const answer = Number(block.charAt(cyclePosition - 1));
    return {
      prompt: {
        ko: `0.${block}${block}…의 소수점 아래 ${n}번째 자리 숫자를 구합니다 — ${n}을 순환마디 길이 ${cycleLength}로 나눈 나머지를 봅니다`,
        en: `Find digit number ${n} after the decimal point of 0.${block}${block}… — divide ${n} by the repeating-block length ${cycleLength}`,
        zh: `求0.${block}${block}…小数点后第${n}位数字——用${n}除以循环节长度${cycleLength}看余数`
      },
      tex: `0.\\overline{${block}} \\;\\Rightarrow\\; d_{${n}}=\\square`,
      answer, answerType: 'number', widget: 'numpad',
      repeatBlock: block, digitIndex: n, cycleLength, remainder,
      solution: [
        { tex: `a=${cycleLength},\\quad n=${n}` },
        { tex: `${n} = ${cycleLength} \\times ${quotient} + ${remainder}` },
        { tex: remainder === 0
          ? `r=0 \\Rightarrow j=a=${cycleLength} \\Rightarrow d_{${n}}=\\square`
          : `r=${remainder} \\Rightarrow j=${cyclePosition} \\Rightarrow d_{${n}}=\\square`, blank: answer }
      ]
    };
  }

  const k = params.k != null ? params.k : 1;   /* 비순환부 자리 수 */
  const m = params.m != null ? params.m : 1;   /* 순환마디 자리 수 */

  const P = R(rng, 0, Math.pow(10, k) - 1);
  const R_ = R(rng, 1, Math.pow(10, m) - 1);
  const Ppad = String(P).padStart(k, '0');
  const Rpad = String(R_).padStart(m, '0');

  const PRconcat = P * Math.pow(10, m) + R_;
  /* 기약분수로 줄여서 답한다 — 중2 과정이라 5학년 이상 약분 정책이 적용된다
     (2026-08-29 원장 지시). 예전엔 48/90처럼 계산 직후 값이 정답키였다. */
  const [numerator, denominator] = normFrac(PRconcat - P,
    Math.pow(10, k) * (Math.pow(10, m) - 1));

  return {
    prompt: {
      ko: `순환소수를 분수로! 반복 전 자리(${Ppad})까지 포함해 이어붙인 수에서 반복 전 자리 수를 빼고, 분모는 10^{${k}}×(10^{${m}}-1)입니다 — 마지막엔 기약분수로 줄입니다`,
      en: `Turn the repeating decimal into a fraction: subtract the non-repeating prefix from the concatenated number, and the denominator is 10^${k}×(10^${m}-1)`,
      zh: `把循环小数化成分数：用"前缀+循环节"连成的数减去前缀，分母是10^{${k}}×(10^{${m}}-1)`
    },
    tex: `0.${Ppad}\\overline{${Rpad}} = \\square`,
    answer: [numerator, denominator], answerShape: 'fraction', answerType: 'number', widget: 'numpad',
    solution: [
      { tex: `${PRconcat} - ${P} = ${PRconcat - P}` },
      { tex: `10^{${k}} \\times (10^{${m}}-1) = ${Math.pow(10, k) * (Math.pow(10, m) - 1)}` },
      { tex: `\\dfrac{${PRconcat - P}}{${Math.pow(10, k) * (Math.pow(10, m) - 1)}} = \\dfrac{\\square}{\\square}`, blank: [numerator, denominator] }
    ]
  };
};

if (typeof module !== 'undefined' && module.exports) module.exports = NM_TGEN;
})();
