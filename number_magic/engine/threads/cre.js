/* ============================================================
   Numbers of Magic — 창의 연산(초급 창의 기법) Thread Generators (2026-09-26)
   설계: docs/creative-stages-design-2026-09-26.md §2-2(M1~M4) · §5 T2
   원장 "창의수연 재탕인 것들 조치해 — 그러면 안 되지. 상황에 맞는 창의 연산으로 확장해도 돼."

   왜 새 파일인가: 초급 38단원의 기법은 앱 전용 window.NM_GEN(engine/generators.js)에만 있어서
   학습지 경로(NM_THREADS → NM_TGEN)가 못 썼다 — 과정 1~10 의 창의 칸이 구구단·필산 드릴로 채워진
   까닭이다. 여기서 **같은 절차**를 rng 주입형으로 옮긴다(Math.random 없음, 인쇄 재현성).
   수 범위: 원본 E·F·G·H·I권에서 확인한 범위(설계 §5 T2 표의 ✔), 그 밖에는 앱 유닛의 범위.

   스레드: AD11 수 이사 · AD12 계단식 · AD13 끼리끼리 · AD14 끊어서 · AD15 앞부터 · AD16 기준수
           SB8 자리별·쉬었다 · SB10 백을 떼어 · SB12 같은 수 ± · SB13 쪼개서 빼기 · SB14 999·부족한 수
           MX7 덧셈끼리·뺄셈끼리 · MX8 수는 몇 개·짝지어 더하기 · EL6 합과 차
           SB9 반대로 채우기(설계의 EL1 countUp — EL1 선수 DV3 가 과정 9 라 따로 세웠다)
   레벨 추가(기존 스레드, 기존 생성기 첫 줄에서 mode 로 여기 함수를 부른다):
           AD8 L4 새치기 · L5 100 짝 묶기 / ML1 L4 둘로 쪼개기(자리마다 반)

   계약(data/threads.js 머리말): NM_TGEN[gen] = (params, rng) => problem
     · prompt {ko,en,zh} — 초등 해요체, 수치는 문자열에 포함
     · steps[].blank 는 정수 하나, 줄마다 \square 하나, **마지막 줄 blank === answer**
     · answer 는 정수(소수 끼리끼리는 합이 자연수가 되는 짝으로 만든다 — MX7 L3)
     · 줄은 계산 가능한 식으로만 쓴다(설명 글 \text 없음) — 과정 빈칸(applyProcessBlank)이
       한 줄의 수 하나를 가리고 식을 다시 계산해 확인하기 때문이다.
     · 가르기·바꾸기 줄은 "= 8 + 2 + □"처럼 **원래 식과 값이 같은 사슬**로 쓴다. Training Course 칸은 줄마다
       앞에 "=" 를 붙여 찍으므로, `7 = 2 + □` 로 쓰면 "8 + 7 = 7 = 2 + □" 가 되어 틀린 등식으로 읽힌다
       (2026-09-26 C5 학습지 렌더에서 발견 — "96 − 12 = 12 = 6 + □").
   ============================================================ */
(function(){
'use strict';

const {R, pick, shuffle} = NM_RNG;
const SQ = '\\square';
const P = (ko, en, zh) => ({ ko, en, zh });
function mk(prompt, tex, answer, steps){
  return { prompt, tex, answer, answerType:'steps', widget:'steps', steps };
}
/* 자리 숫자(높은 자리부터) */
const digitsOf = n => String(n).split('').map(Number);

/* ── AD11 — 수를 이사시켜 10(몇십) 만들기 ──────────────────────
   A-02 move10(8+7 → 8+2+5) · A-08 move10_2d(39+25 → 40+24) 와 같은 절차.
   ★마법 자리 = 작은 수를 "옮길 몫 + 남는 몫"으로 가르는 줄.
   mode: 'one'(1d+1d, 합 11~18) · 'twoOne'(2d+1d) · 'twoTwo'(2d+2d, A-08 범위) */
NM_TGEN['cre_ad11_moveTen'] = function(params, rng){
  const mode = (params && params.mode) || 'one';
  let a, b, big, small;
  if(mode === 'one'){
    do { a = R(rng, 2, 9); b = R(rng, 2, 9); } while(a + b < 11);
    big = Math.max(a, b); small = Math.min(a, b);
  } else if(mode === 'twoOne'){
    const o = R(rng, 5, 9);
    a = big = R(rng, 1, 8) * 10 + o;
    b = small = R(rng, 10 - o + 1, 9);
  } else {
    const o = pick(rng, [7, 8, 9]);
    a = big = R(rng, 2, 8) * 10 + o;
    b = small = R(rng, 1, 4) * 10 + R(rng, 10 - o, 9);
  }
  const target = Math.ceil((big + 1) / 10) * 10;   /* big 바로 위 몇십 */
  const need = target - big, rest = small - need, ans = a + b;
  return mk(
    P(`${a} + ${b}: ${small}에서 ${need}만큼 옮겨 ${big}을(를) ${target}(으)로 만들어요.`,
      `${a} + ${b}: move ${need} from ${small} so that ${big} becomes ${target}.`,
      `${a} + ${b}：从${small}里搬${need}过去，把${big}凑成${target}。`),
    `${a} + ${b} = ${SQ}`, ans,
    [ { tex:`${big} + ${need} + ${SQ}`, blank:rest },          /* 8 + 7 = 8 + 2 + □ */
      { tex:`${SQ} + ${rest}`, blank:target },                  /*       = □ + 5     */
      { tex:`${target} + ${rest} = ${SQ}`, blank:ans } ]);
};

/* ── AD12 — 계단식 덧셈(십 먼저, 일 나중) ──────────────────────
   A-04 stairAdd(generators.js:139)와 같은 절차: 두 번째 수부터 십을 먼저, 일을 나중에 누적.
   수 범위 11~79(A-04 그대로). 일의 자리가 0인 수는 "+0" 줄이 생겨 뺀다.
   mode: 'two'(두 수) · 'three'(세 수) */
NM_TGEN['cre_ad12_stair'] = function(params, rng){
  const count = ((params && params.mode) === 'three') ? 3 : 2;
  const nums = [];
  while(nums.length < count){ const n = R(rng, 11, 79); if(n % 10) nums.push(n); }
  let acc = nums[0];
  const steps = [];
  for(let i = 1; i < count; i++){
    const t = Math.floor(nums[i] / 10) * 10, o = nums[i] % 10;
    steps.push({ tex:`${acc} + ${t} = ${SQ}`, blank:acc + t }); acc += t;
    steps.push({ tex:`${acc} + ${o} = ${SQ}`, blank:acc + o }); acc += o;
  }
  return mk(
    P(`${nums.join(' + ')}: 십의 자리 먼저, 일의 자리 나중에 계단처럼 더해요.`,
      `${nums.join(' + ')}: add the tens first, then the ones — like climbing stairs.`,
      `${nums.join(' + ')}：先加十位，再加个位，像爬楼梯一样。`),
    `${nums.join(' + ')} = ${SQ}`, acc, steps);
};

/* ── AD13 — 끼리끼리 더하기(십끼리·일끼리) ─────────────────────
   A-07 splitPlace 와 같은 절차: 같은 자리끼리 모아 더한 뒤 합친다.
   mode: 'two'(두 자리 두 수) · 'three'(두 자리 세 수) · 'hundreds'(세 자리 세 수) */
NM_TGEN['cre_ad13_placewise'] = function(params, rng){
  const mode = (params && params.mode) || 'two';
  const count = mode === 'two' ? 2 : 3;
  const hund = mode === 'hundreds';
  const nums = [];
  while(nums.length < count){
    const n = hund ? R(rng, 101, 499) : R(rng, 12, 89);
    const d = digitsOf(n);
    if(d.slice(1).some(x => x === 0)) continue;     /* 0 자리는 "+0" 이 되어 뺀다 */
    nums.push(n);
  }
  const place = (n, p) => Math.floor(n / p) % 10 * p;
  const places = hund ? [100, 10, 1] : [10, 1];
  const steps = places.map(p => {
    const parts = nums.map(n => place(n, p));
    return { tex:`${parts.join(' + ')} = ${SQ}`, blank:parts.reduce((s, x) => s + x, 0) };
  });
  const sums = steps.map(s => s.blank), ans = sums.reduce((s, x) => s + x, 0);
  steps.push({ tex:`${sums.join(' + ')} = ${SQ}`, blank:ans });
  return mk(
    P(`${nums.join(' + ')}: 같은 자리끼리 모아서 더해요.`,
      `${nums.join(' + ')}: add each place with its own kind, then combine.`,
      `${nums.join(' + ')}：相同数位的数放在一起相加，再合起来。`),
    `${nums.join(' + ')} = ${SQ}`, ans, steps);
};

/* ── AD14 — 끊어서 더하기 ─────────────────────────────────────
   'place'(L1): A-16 splitAddByDigit — 세 자리 두 수를 자리마다 따로 더하고 마지막에 합친다.
                끊는 뜻이 살도록 십·일의 자리 합이 모두 10 이상인 것만(받아올림을 머릿속에 들고 있지 않는다).
   'pairs'(L2): A-17 splitAdd2Digit ✔ 초급 E권(1234+5678, 7342+6533) — 네 자리를 앞 두 자리·뒤 두 자리로 끊는다. */
NM_TGEN['cre_ad14_chunkAdd'] = function(params, rng){
  const mode = (params && params.mode) || 'place';
  if(mode === 'place'){
    let d1, d2;
    do {
      d1 = [R(rng, 1, 8), R(rng, 1, 9), R(rng, 1, 9)];
      d2 = [R(rng, 1, 8), R(rng, 1, 9), R(rng, 1, 9)];
    } while(d1[1] + d2[1] < 10 || d1[2] + d2[2] < 10);
    const a = d1[0] * 100 + d1[1] * 10 + d1[2], b = d2[0] * 100 + d2[1] * 10 + d2[2];
    const H = (d1[0] + d2[0]) * 100, T = (d1[1] + d2[1]) * 10, O = d1[2] + d2[2];
    return mk(
      P(`${a} + ${b}: 자리마다 따로 더한 뒤, 마지막에 모두 더해요.`,
        `${a} + ${b}: add each place separately, then add the parts.`,
        `${a} + ${b}：每一位分别相加，最后全部加起来。`),
      `${a} + ${b} = ${SQ}`, a + b,
      [ { tex:`${d1[0] * 100} + ${d2[0] * 100} = ${SQ}`, blank:H },
        { tex:`${d1[1] * 10} + ${d2[1] * 10} = ${SQ}`, blank:T },
        { tex:`${d1[2]} + ${d2[2]} = ${SQ}`, blank:O },
        { tex:`${H} + ${T} + ${O} = ${SQ}`, blank:a + b } ]);
  }
  const h1 = R(rng, 11, 89), l1 = R(rng, 10, 99), h2 = R(rng, 11, 89), l2 = R(rng, 10, 99);
  const a = h1 * 100 + l1, b = h2 * 100 + l2;
  const hi = (h1 + h2) * 100, lo = l1 + l2;
  return mk(
    P(`${a} + ${b}: 앞 두 자리와 뒤 두 자리로 끊어서 따로 더해요.`,
      `${a} + ${b}: cut each number into its front two digits and back two digits, and add them separately.`,
      `${a} + ${b}：把每个数分成前两位和后两位，分别相加。`),
    `${a} + ${b} = ${SQ}`, a + b,
    [ { tex:`${h1 * 100} + ${h2 * 100} = ${SQ}`, blank:hi },
      { tex:`${l1} + ${l2} = ${SQ}`, blank:lo },
      { tex:`${hi} + ${lo} = ${SQ}`, blank:a + b } ]);
};

/* ── AD15 — 앞부터 계산하기 ───────────────────────────────────
   'add3'·'add4': A-18 addFromFront ✔ 초급 E권(3584+5685) — 큰 자리부터 차례로 누적해 더한다.
   'sub3'·'sub4': A-30 subFromFront ✔ 초급 H권(837−545, 5342−1267) — 큰 자리부터 차례로 뺀다.
   'subEasy'    : A-31 subEasyFirst — A−B−C 에서 B+C 가 몇십이면 먼저 묶어 한 번에 뺀다.
   앞부터 계산은 받아올림·받아내림이 있을 때 뜻이 있으므로 한 자리 이상 올림(내림)이 나는 것만. */
function frontParts(n, len){ const d = digitsOf(n); return d.map((x, i) => x * Math.pow(10, len - 1 - i)); }
NM_TGEN['cre_ad15_frontFirst'] = function(params, rng){
  const mode = (params && params.mode) || 'add3';
  if(mode === 'subEasy'){
    let a, b, c, round;
    do {
      const base = pick(rng, [20, 30, 40, 50, 60]), diff = R(rng, 1, 9);
      b = base - diff; c = diff + pick(rng, [0, 1]) * 10;
      round = b + c; a = R(rng, round + 10, round + 60);
    } while(round % 10 !== 0 || a <= round);
    return mk(
      P(`${a} - ${b} - ${c}: 빼는 두 수를 먼저 묶으면 몇십이 돼요. 묶어서 한 번에 빼요.`,
        `${a} - ${b} - ${c}: the two numbers you take away make a whole ten — group them and subtract once.`,
        `${a} - ${b} - ${c}：两个减数先合起来是整十数，合起来一次减掉。`),
      `${a} - ${b} - ${c} = ${SQ}`, a - round,
      [ { tex:`${b} + ${c} = ${SQ}`, blank:round },
        { tex:`${a} - ${round} = ${SQ}`, blank:a - round } ]);
  }
  const four = mode === 'add4' || mode === 'sub4', len = four ? 4 : 3;
  const lo = Math.pow(10, len - 1), hi = Math.pow(10, len) - 1;
  const sub = mode === 'sub3' || mode === 'sub4';
  let a, b;
  for(;;){
    if(sub){ a = R(rng, lo * 3, hi); b = R(rng, lo, a - lo); }
    else { a = R(rng, lo, Math.floor(hi / 2)); b = R(rng, lo, Math.floor(hi / 2)); }
    const da = digitsOf(a), db = digitsOf(b);
    if(db[len - 1] === 0) continue;                       /* 마지막 줄이 "−0/+0" 이 되지 않게 */
    let crosses = false;
    for(let i = 1; i < len; i++) if(sub ? da[i] < db[i] : da[i] + db[i] >= 10) crosses = true;
    if(crosses) break;
  }
  const parts = frontParts(b, len).filter(x => x > 0);
  const steps = [];
  let acc = a;
  parts.forEach(x => {
    const nx = sub ? acc - x : acc + x;
    steps.push({ tex:`${acc} ${sub ? '-' : '+'} ${x} = ${SQ}`, blank:nx }); acc = nx;
  });
  return mk(sub
      ? P(`${a} - ${b}: 큰 자리부터 차례로 빼요.`, `${a} - ${b}: subtract from the biggest place first, one place at a time.`, `${a} - ${b}：从最高位开始依次减。`)
      : P(`${a} + ${b}: 큰 자리부터 차례로 더해요.`, `${a} + ${b}: add from the biggest place first, one place at a time.`, `${a} + ${b}：从最高位开始依次加。`),
    `${a} ${sub ? '-' : '+'} ${b} = ${SQ}`, acc, steps);
};

/* ── AD16 — 기준수로 더하기(크기가 비슷한 수) ✔ 초급 F권 ─────────
   104+97+109+93 → 기준 100: 100×4 + (4+9) − (3+7). 355+369+357+363 → 기준 350.
   'three'(L1): 3항, 기준 50·100 · 'four'(L2): 4항, 기준 100~800(50의 배수) · 'five'(L3): 5항.
   기준보다 큰 수·작은 수가 섞이게 한다(차의 합을 ±로 모으는 것이 이 기법의 핵심). */
NM_TGEN['cre_ad16_anchorSum'] = function(params, rng){
  const mode = (params && params.mode) || 'three';
  const n = mode === 'three' ? 3 : mode === 'four' ? 4 : 5;
  const base = mode === 'three' ? pick(rng, [50, 100]) : R(rng, 2, 16) * 50;
  const dmax = mode === 'three' ? 9 : 19;     /* F권 355+369+357+363(기준 350)은 차가 19 까지 */
  let devs;
  do {
    devs = [];
    while(devs.length < n){ const d = R(rng, -dmax, dmax); if(d && devs.indexOf(d) < 0) devs.push(d); }
  } while(!devs.some(d => d > 0) || !devs.some(d => d < 0) || devs.reduce((s, d) => s + d, 0) === 0);
  const nums = devs.map(d => base + d);
  const over = devs.filter(d => d > 0), under = devs.filter(d => d < 0).map(d => -d);
  const B = base * n, O = over.reduce((s, x) => s + x, 0), U = under.reduce((s, x) => s + x, 0);
  const ans = B + O - U;
  const steps = [ { tex:`${base} \\times ${n} = ${SQ}`, blank:B } ];
  if(over.length > 1) steps.push({ tex:`${over.join(' + ')} = ${SQ}`, blank:O });
  if(under.length > 1) steps.push({ tex:`${under.join(' + ')} = ${SQ}`, blank:U });
  steps.push({ tex:`${B} + ${O} - ${U} = ${SQ}`, blank:ans });
  const tx = nums.join(' + ');
  return mk(n === 5
      ? P(`${tx}: 기준수를 정하고, 기준보다 많은 만큼 더하고 모자란 만큼 빼요.`,
          `${tx}: choose a base number, then add what is over it and take away what is under it.`,
          `${tx}：先定一个基准数，比它多的加上，比它少的减去。`)
      : P(`${tx}: ${base}을(를) 기준으로 모두 ${base}(으)로 보고, 많은 만큼 더하고 모자란 만큼 빼요.`,
          `${tx}: treat every number as ${base}, then add what is over and take away what is under.`,
          `${tx}：都看作${base}，比它多的加上，比它少的减去。`),
    `${tx} = ${SQ}`, ans, steps);
};

/* ── SB8 — 자리별 빼기 · 쉬었다 빼기 ──────────────────────────
   'place'(L1): A-10 subByPlace — 십 먼저, 일 나중. 받아내림 없는 2d−2d(설계 표).
   'rest'(L2) : A-11 restSubtract — 몇십까지만 먼저 빼고, 쉬었다가 나머지를 뺀다.
   'place3'(L3): 3d−2d 를 십 먼저·일 나중으로. */
NM_TGEN['cre_sb8_placeSub'] = function(params, rng){
  const mode = (params && params.mode) || 'place';
  if(mode === 'rest'){
    const a = R(rng, 2, 9) * 10 + R(rng, 1, 9), x = a % 10;
    let b; do { b = R(rng, x + 1, x + 9); } while(b % 10 === 0);   /* 32 − 10 처럼 그냥 빼면 되는 수는 뺀다 */
    const y = b - x, t = a - x;
    return mk(
      P(`${a} - ${b}: 먼저 ${x}만 빼서 ${t}을(를) 만들고, 쉬었다가 남은 ${y}을(를) 빼요.`,
        `${a} - ${b}: first take away just ${x} to reach ${t}, then rest and take away the other ${y}.`,
        `${a} - ${b}：先只减${x}得到${t}，歇一下再减剩下的${y}。`),
      `${a} - ${b} = ${SQ}`, a - b,
      [ { tex:`${a} - ${x} - ${SQ}`, blank:y },                 /* 43 − 8 = 43 − 3 − □ */
        { tex:`${SQ} - ${y}`, blank:t },                        /*        = □ − 5      */
        { tex:`${t} - ${y} = ${SQ}`, blank:a - b } ]);
  }
  let a, tb, ob;
  if(mode === 'place3'){
    a = R(rng, 120, 999); tb = R(rng, 1, 9); ob = R(rng, 1, 9);
  } else {
    const ta = R(rng, 3, 9), oa = R(rng, 1, 9);
    a = ta * 10 + oa; tb = R(rng, 1, ta - 1); ob = R(rng, 1, oa);
  }
  const b = tb * 10 + ob, s1 = a - tb * 10;
  return mk(
    P(`${a} - ${b}: 십의 자리를 먼저 빼고, 일의 자리를 나중에 빼요.`,
      `${a} - ${b}: subtract the tens first, then the ones.`,
      `${a} - ${b}：先减十位，再减个位。`),
    `${a} - ${b} = ${SQ}`, a - b,
    [ { tex:`${a} - ${tb * 10} = ${SQ}`, blank:s1 },
      { tex:`${s1} - ${ob} = ${SQ}`, blank:a - b } ]);
};

/* ── SB10 — 백을 떼어 빼기(L1 백 쪼개기) ─────────────────────
   234 − 78 → 234 = 134 + 100 → 100 − 78 = 22 → 134 + 22. A-13 splitHundred 의 일반형(몇백이 아니어도 된다).
   받아내림이 있는 것만(뒤 두 자리 < 빼는 수) — 그래야 100 을 떼는 까닭이 선다.
   TODO(원장 결정 Q1): L2 자릿수 이동(A-14)·L3 수를 풀어서 쓰기(A-15)는 초급 C·D권 원본(해설집 D권은
   텍스트층이 없음) 차례·메모장 사진으로 절차와 수 범위를 확정한 뒤에 만든다. 지어내지 않는다. */
NM_TGEN['cre_sb10_borrowHundred'] = function(params, rng){
  let a, b;
  do { a = R(rng, 200, 999); b = R(rng, 11, 99); } while(a % 100 >= b || b % 10 === 0);
  const rest = a - 100, comp = 100 - b;
  return mk(
    P(`${a} - ${b}: 100을 하나 떼어 ${b}을(를) 빼고, 남은 수와 더해요.`,
      `${a} - ${b}: take one hundred out, subtract ${b} from it, then add what is left.`,
      `${a} - ${b}：拿出一个100来减${b}，再和剩下的数相加。`),
    `${a} - ${b} = ${SQ}`, a - b,
    [ { tex:`${SQ} + 100 - ${b}`, blank:rest },               /* 234 − 78 = □ + 100 − 78 */
      { tex:`${rest} + ${SQ}`, blank:comp },                   /*          = 134 + □      */
      { tex:`${rest} + ${comp} = ${SQ}`, blank:a - b } ]);
};

/* ── SB12 — 같은 수를 더해서·빼서 빼기(차는 그대로) ✔ 초급 E권 ─────
   'add'(L1)  : 53−38 → (53+2)−(38+2)=55−40. A-20 addSameSub. 더하는 수 1~6(E권).
   'sub'(L2)  : 62−28 → (62−2)−(28−2)=60−26. A-21 subSameSub. 빼는 수 1~6.
   'choose'(L3): 세 자리(826−129, 933−764) — 더 적게 바꾸는 쪽을 고른다.
   받아내림이 있는 것만(원래 식이 번거로워야 바꾸는 뜻이 있다). */
NM_TGEN['cre_sb12_constDiff'] = function(params, rng){
  const mode = (params && params.mode) || 'add';
  let a, b, k, dir;
  if(mode === 'add'){
    do { b = R(rng, 14, 79); a = b + R(rng, 5, 40); } while(b % 10 < 4 || a > 99 || a % 10 >= b % 10);
    dir = '+'; k = 10 - b % 10;
  } else if(mode === 'sub'){
    do { a = R(rng, 21, 99); b = R(rng, 11, a - 5); } while(a % 10 < 1 || a % 10 > 6 || b % 10 <= a % 10);
    dir = '-'; k = a % 10;
  } else {
    do { a = R(rng, 201, 999); b = R(rng, 101, a - 20); } while(a % 10 === 0 || a % 10 >= b % 10);
    const kAdd = 10 - b % 10, kSub = a % 10;
    if(kAdd <= kSub){ dir = '+'; k = kAdd; } else { dir = '-'; k = kSub; }
  }
  const a2 = dir === '+' ? a + k : a - k, b2 = dir === '+' ? b + k : b - k;
  const sgn = dir === '+' ? '+' : '-';
  const prompt = mode === 'choose'
    ? P(`${a} - ${b}: 두 수에 같은 수를 더하거나 빼서 한쪽을 몇십으로 만들어요. 차는 그대로예요.`,
        `${a} - ${b}: add or subtract the same number on both so one becomes a whole ten. The difference stays the same.`,
        `${a} - ${b}：两个数同时加上或减去同一个数，把一个数变成整十数。差不变。`)
    : dir === '+'
      ? P(`${a} - ${b}: 두 수에 똑같이 ${k}을(를) 더해 빼는 수를 몇십으로 만들어요. 차는 그대로예요.`,
          `${a} - ${b}: add ${k} to both numbers so the number you take away is a whole ten. The difference stays the same.`,
          `${a} - ${b}：两个数都加上${k}，让减数变成整十数。差不变。`)
      : P(`${a} - ${b}: 두 수에서 똑같이 ${k}을(를) 빼서 빼지는 수를 몇십으로 만들어요. 차는 그대로예요.`,
          `${a} - ${b}: take ${k} from both numbers so the first number is a whole ten. The difference stays the same.`,
          `${a} - ${b}：两个数都减去${k}，让被减数变成整十数。差不变。`);
  return mk(prompt, `${a} - ${b} = ${SQ}`, a - b,
    [ { tex:`${b} ${sgn} ${k} = ${SQ}`, blank:b2 },
      { tex:`${a} ${sgn} ${k} = ${SQ}`, blank:a2 },
      { tex:`${a2} - ${b2} = ${SQ}`, blank:a - b } ]);
};

/* ── SB13 — 쪼개서 빼기(빼지는 수 끝이 0) ✔ 초급 F권 ────────────
   460 − 29 → 460 = 430 + 30 → 30 − 29 = 1 → 430 + 1. F권 100−48 … 4800−2325.
   'three'(L1): 세 자리 몇십 − 두 자리 · 'four'(L2): 네 자리 몇백 − 세·네 자리(몇백만큼 떼어 낸다). */
NM_TGEN['cre_sb13_splitMinuend'] = function(params, rng){
  const four = (params && params.mode) === 'four';
  let a, b, T;
  for(;;){
    if(four){ a = R(rng, 11, 99) * 100; b = R(rng, 101, a - 101); T = Math.ceil(b / 100) * 100; if(b % 100 && b % 10 && T < a) break; }
    else { a = R(rng, 10, 99) * 10; b = R(rng, 11, 99); T = Math.ceil(b / 10) * 10; if(b % 10 && T < a) break; }
  }
  const rest = a - T, part = T - b;
  return mk(
    P(`${a} - ${b}: ${a}을(를) ${rest}와(과) ${T}(으)로 쪼개서, ${T}에서 먼저 빼요.`,
      `${a} - ${b}: split ${a} into ${rest} and ${T}, and take ${b} away from ${T} first.`,
      `${a} - ${b}：把${a}分成${rest}和${T}，先从${T}里减去${b}。`),
    `${a} - ${b} = ${SQ}`, a - b,
    [ { tex:`${SQ} + ${T} - ${b}`, blank:rest },               /* 460 − 29 = □ + 30 − 29 */
      { tex:`${rest} + ${SQ}`, blank:part },                   /*          = 430 + □     */
      { tex:`${rest} + ${part} = ${SQ}`, blank:a - b } ]);
};

/* ── SB14 — 999 마법과 10에서 부족한 수 ✔ 초급 G권 ────────────
   'n100'(L1) 100−n · 'n1000'(L2) 1000−n · 'big'(L3) 10000·100000−n :
      1000 = 999 + 1 → 999 − 349 = 650 → 650 + 1 (9에서 빼면 받아내림이 없다).
   'short'(L4) 10에서 부족한 수: 자리마다 10−숫자, 일의 자리를 빼고는 1씩 더 뺀다(1000−349: 6·5·1 → 651).
   일의 자리가 0 인 수는 뺀다(10−0 = 10 이 되어 이 규칙이 안 선다). */
NM_TGEN['cre_sb14_nines'] = function(params, rng){
  const mode = (params && params.mode) || 'n100';
  let N;
  if(mode === 'n100') N = 100;
  else if(mode === 'n1000') N = 1000;
  else if(mode === 'big') N = pick(rng, [10000, 100000]);
  else N = pick(rng, [100, 1000, 10000]);
  const len = String(N).length - 1;
  let n;
  /* 부족한 수(L4)는 일의 자리가 아닌 곳에 9 가 있으면 그 자리가 0 이 되어 모으는 줄이 한 항만 남는다 — 뺀다 */
  do { n = R(rng, Math.pow(10, len - 1) + 1, N - 1); }
  while(n % 10 === 0 || (mode === 'short' && digitsOf(n).slice(0, -1).indexOf(9) >= 0));
  if(mode === 'short'){
    const d = digitsOf(n), steps = [], vals = [];
    d.forEach((x, i) => {
      const last = i === len - 1, v = last ? 10 - x : 9 - x;
      steps.push({ tex: last ? `10 - ${x} = ${SQ}` : `10 - ${x} - 1 = ${SQ}`, blank:v });
      vals.push(v * Math.pow(10, len - 1 - i));
    });
    const shown = vals.filter(v => v > 0);
    steps.push({ tex:`${shown.join(' + ')} = ${SQ}`, blank:N - n });
    return mk(
      P(`${N} - ${n}: 자리마다 10에서 부족한 수를 구하고, 일의 자리가 아니면 1을 더 빼요.`,
        `${N} - ${n}: for each place find how far the digit is from 10, and take 1 more except in the ones place.`,
        `${N} - ${n}：每一位求与10的差，个位以外再减1。`),
      `${N} - ${n} = ${SQ}`, N - n, steps);
  }
  const nine = N - 1;
  return mk(
    P(`${N} - ${n}: ${N}을(를) ${nine} + 1로 보고, ${nine}에서 먼저 빼요.`,
      `${N} - ${n}: think of ${N} as ${nine} + 1 and subtract from ${nine} first.`,
      `${N} - ${n}：把${N}看成${nine} + 1，先从${nine}里减。`),
    `${N} - ${n} = ${SQ}`, N - n,
    [ { tex:`${SQ} + 1 - ${n}`, blank:nine },                  /* 1000 − 349 = □ + 1 − 349 */
      { tex:`${SQ} + 1`, blank:nine - n },                     /*            = □ + 1       */
      { tex:`${nine - n} + 1 = ${SQ}`, blank:N - n } ]);
};

/* ── MX7 — 덧셈끼리·뺄셈끼리 ───────────────────────────────
   'two'(L1): A-12 addSubGroup (35−14+21−22 → (35+21)−(14+22)).
   'three'(L2): ✔ 초급 F권 263−174+372−235.
   'dec'(L3): ✔ 초급 I권 12.56−4.7+5.44−5.3 → (12.56+5.44)−(4.7+5.3) = 18 − 10.
              더하는 두 소수·빼는 두 소수가 각각 자연수가 되는 짝으로 만든다 — 끼리끼리 묶는 까닭이
              바로 그것이고, 답이 정수로 떨어진다(정수 답 계약). */
function decStr(whole, part, places){ return `${whole}.${String(part).padStart(places, '0')}`; }
NM_TGEN['cre_mx7_sortAddSub'] = function(params, rng){
  const mode = (params && params.mode) || 'two';
  let a, b, c, d, texA, texB, texC, texD, Pp, Mm;
  if(mode === 'dec'){
    let w1, w2, v1, v2;
    do { w1 = R(rng, 10, 19); w2 = R(rng, 1, 9); v1 = R(rng, 1, 9); v2 = R(rng, 1, 9); } while(w1 + w2 <= v1 + v2);
    let f; do { f = R(rng, 11, 89); } while(f % 10 === 0);
    const g = R(rng, 1, 9);
    texA = decStr(w1, f, 2); texC = decStr(w2, 100 - f, 2);
    texB = decStr(v1, g, 1); texD = decStr(v2, 10 - g, 1);
    Pp = w1 + w2 + 1; Mm = v1 + v2 + 1;
  } else {
    do {
      if(mode === 'three'){ a = R(rng, 150, 499); c = R(rng, 150, 499); b = R(rng, 100, 399); d = R(rng, 100, 399); }
      else { b = R(rng, 10, 40); d = R(rng, 10, 40); a = R(rng, b + 5, b + 50); c = R(rng, d + 5, d + 50); }
    } while(a <= b || a + c <= b + d || a === c || b === d);
    texA = a; texB = b; texC = c; texD = d; Pp = a + c; Mm = b + d;
  }
  const expr = `${texA} - ${texB} + ${texC} - ${texD}`;
  return mk(
    P(`${expr}: 더하는 수끼리, 빼는 수끼리 모아서 계산해요.`,
      `${expr}: gather the numbers you add and the numbers you take away, then calculate.`,
      `${expr}：把加的数放在一起，减的数放在一起，再计算。`),
    `${expr} = ${SQ}`, Pp - Mm,
    [ { tex:`${texA} + ${texC} = ${SQ}`, blank:Pp },
      { tex:`${texB} + ${texD} = ${SQ}`, blank:Mm },
      { tex:`${Pp} - ${Mm} = ${SQ}`, blank:Pp - Mm } ]);
};

/* ── MX8 — 수는 몇 개 · 짝지어 더하기 ✔ 초급 G권 ────────────────
   'count2'(L1): 8부터 16까지 → 16 − 8 + 1 = 9개(1~7 은 필요 없는 수 — 설계 ★`16 − 7` 과 같은 값). 두 자리.
   'count3'(L2): 같은 방법, 세 자리(257~965).
   'pair'(L3): 가우스 덧셈 1(덧셈만) — 첫수+끝수 짝이 몇 개인지 보고 **덧셈으로** 모은다.
               곱으로 모으는 것은 MX6(곱을 이용한 가우스 덧셈, 과정 23)의 몫이라 짝은 5개까지만 둔다. */
NM_TGEN['cre_mx8_countPair'] = function(params, rng){
  const mode = (params && params.mode) || 'count2';
  if(mode === 'pair'){
    const len = pick(rng, [6, 8, 10]), s = pick(rng, [1, 2]), f = R(rng, 1, 40);
    const terms = []; for(let i = 0; i < len; i++) terms.push(f + i * s);
    const l = terms[len - 1], S = f + l, k = len / 2;
    const shown = `${terms[0]} + ${terms[1]} + ${terms[2]} + \\cdots + ${l}`;
    return mk(
      P(`${shown}: 첫 수와 끝 수를 짝지으면 합이 모두 같아요. 짝의 합을 짝의 개수만큼 더해요.`,
        `${shown}: pair the first and last numbers — every pair has the same sum. Add that sum once for each pair.`,
        `${shown}：首尾配对，每对的和都一样。有几对就把这个和加几次。`),
      `${shown} = ${SQ}`, S * k,
      [ { tex:`${f} + ${l} = ${SQ}`, blank:S },
        { tex:`${new Array(k).fill(S).join(' + ')} = ${SQ}`, blank:S * k } ]);
  }
  let a, b;
  if(mode === 'count3'){ a = R(rng, 101, 800); b = R(rng, a + 20, 999); }
  else { a = R(rng, 3, 40); b = R(rng, a + 5, Math.min(99, a + 60)); }
  /* 줄은 앱 유닛 A-27(마법 노트)과 같은 모양 — 끝 수 − 첫 수 + 1. 같은 주의 노트와 칸이 다른 식을 쓰지 않게 */
  const cnt = b - a + 1;
  return mk(
    P(`${a}부터 ${b}까지의 수는 모두 몇 개일까요? 끝 수에서 첫 수를 빼고, 첫 수도 세어야 하니 1을 더해요.`,
      `How many numbers are there from ${a} to ${b}? Subtract the first from the last, then add 1 because the first number counts too.`,
      `从${a}到${b}一共有几个数？用最后一个数减去第一个数，第一个数也要算，所以再加1。`),
    `${a},\\ ${a + 1},\\ ${a + 2},\\ \\cdots,\\ ${b}\\ \\rightarrow\\ ${SQ}`, cnt,
    [ { tex:`${b} - ${a} = ${SQ}`, blank:b - a },
      { tex:`${b - a} + 1 = ${SQ}`, blank:cnt } ]);
};

/* ── EL6 — 합과 차로 두 수 찾기 ✔ 초급 H권 ─────────────────────
   'diffFirst'(L1): 합 49·차 5 → 49 − 5 = 44 → 44 ÷ 2 = 22(작은 수) → 22 + 5 = 27(큰 수).
   'half'(L2)     : (합 + 차) ÷ 2 = 큰 수, (합 − 차) ÷ 2 = 작은 수. 세 자리(합 837·차 561).
   'average'(L3)  : 평균수 기준 — 합 ÷ 2 가 두 수의 한가운데, 거기서 차 ÷ 2 만큼 오르내린다.
                    합과 차의 홀짝이 같아야 두 자연수가 나온다(H권) — 둘 다 짝수인 것만 낸다.
   원장 결정 전(설계 L3 "가능/불가능 판별")은 답이 가능·불가능이라 정수 답 계약에 안 맞아 평균수 기준으로 냈다. */
NM_TGEN['cre_el6_sumDiff'] = function(params, rng){
  const mode = (params && params.mode) || 'diffFirst';
  let small, d;
  if(mode === 'diffFirst'){ do { small = R(rng, 10, 40); d = R(rng, 2, 19); } while(2 * small + d > 99); }
  else if(mode === 'half'){ small = R(rng, 60, 400); d = R(rng, 20, 500); if(2 * small + d > 999) d = 999 - 2 * small; }
  else { small = R(rng, 60, 400); d = R(rng, 5, 150) * 2; }
  const big = small + d, s = big + small;
  const head = `\\bigcirc + \\triangle = ${s},\\ \\bigcirc - \\triangle = ${d}`;
  if(mode === 'diffFirst'){
    return mk(
      P(`합이 ${s}, 차가 ${d}인 두 수 중 큰 수(○)를 구해요. 차를 먼저 빼고 나머지를 반으로 나눠요.`,
        `Two numbers have sum ${s} and difference ${d}. Find the bigger one (○): take away the difference first, then halve the rest.`,
        `两个数的和是${s}，差是${d}。求较大的数(○)：先减去差，再把剩下的平分。`),
      `${head},\\ \\bigcirc = ${SQ}`, big,
      [ { tex:`${s} - ${d} = ${SQ}`, blank:s - d },
        { tex:`${s - d} \\div 2 = ${SQ}`, blank:small },
        { tex:`${small} + ${d} = ${SQ}`, blank:big } ]);
  }
  if(mode === 'half'){
    const askBig = rng() < 0.5;
    const stBig = { tex:`(${s} + ${d}) \\div 2 = ${SQ}`, blank:big };
    const stSmall = { tex:`(${s} - ${d}) \\div 2 = ${SQ}`, blank:small };
    return mk(askBig
        ? P(`합이 ${s}, 차가 ${d}인 두 수 중 큰 수(○)를 구해요.`, `Sum ${s}, difference ${d}: find the bigger number (○).`, `和是${s}，差是${d}，求较大的数(○)。`)
        : P(`합이 ${s}, 차가 ${d}인 두 수 중 작은 수(△)를 구해요.`, `Sum ${s}, difference ${d}: find the smaller number (△).`, `和是${s}，差是${d}，求较小的数(△)。`),
      `${head},\\ ${askBig ? '\\bigcirc' : '\\triangle'} = ${SQ}`, askBig ? big : small,
      askBig ? [stSmall, stBig] : [stBig, stSmall]);
  }
  const avg = s / 2, hd = d / 2;
  return mk(
    P(`합이 ${s}, 차가 ${d}인 두 수 중 작은 수(△)를 구해요. 합의 반이 두 수의 한가운데예요.`,
      `Sum ${s}, difference ${d}: find the smaller number (△). Half the sum is right between the two numbers.`,
      `和是${s}，差是${d}，求较小的数(△)。和的一半正好在两个数的中间。`),
    `${head},\\ \\triangle = ${SQ}`, small,
    [ { tex:`${s} \\div 2 = ${SQ}`, blank:avg },
      { tex:`${d} \\div 2 = ${SQ}`, blank:hd },
      { tex:`${avg} - ${hd} = ${SQ}`, blank:small } ]);
};

/* ────────────────────────────────────────────────────────────
   기존 스레드에 더한 레벨 — 기존 생성기가 첫 줄에서 params.mode 로 여기를 부른다
   (ns_ad.js ad8_multiAdd10 · ml.js ml1_double). 기존 레벨의 출력은 그대로다.
   ──────────────────────────────────────────────────────────── */

/* AD8 L4 'jump' — 새치기 덧셈(A-09 jumpAdd): 일의 자리 합이 10인 짝을 먼저 새치기시켜 더한다. */
NM_TGEN['cre_ad8_jump'] = function(params, rng){
  const o1 = R(rng, 1, 9), o2 = 10 - o1;
  const a1 = R(rng, 1, 8) * 10 + o1, a2 = R(rng, 2, 8) * 10 + o2;
  let b1, b2;
  do { b1 = R(rng, 11, 79); b2 = R(rng, 11, 79); }
  while((b1 % 10 + b2 % 10) % 10 === 0 || (b1 % 10 + o1) % 10 === 0 || (b1 % 10 + o2) % 10 === 0
        || (b2 % 10 + o1) % 10 === 0 || (b2 % 10 + o2) % 10 === 0);   /* 짝이 하나뿐이게 */
  const nums = shuffle(rng, [a1, a2, b1, b2]);
  const ps = a1 + a2, s2 = ps + b1, sum = s2 + b2;
  return mk(
    P(`${nums.join(' + ')}: 일의 자리가 10이 되는 짝을 먼저 새치기시켜 더해요.`,
      `${nums.join(' + ')}: let the pair whose ones make 10 jump the queue and add it first.`,
      `${nums.join(' + ')}：个位凑成10的一对先"插队"相加。`),
    `${nums.join(' + ')} = ${SQ}`, sum,
    [ { tex:`${a1} + ${a2} = ${SQ}`, blank:ps },
      { tex:`${ps} + ${b1} = ${SQ}`, blank:s2 },
      { tex:`${s2} + ${b2} = ${SQ}`, blank:sum } ]);
};

/* AD8 L5 'hundred' — 100 짝 묶기(A-05 comp100): 더해서 100 이 되는 짝을 먼저 묶고 남는 수를 더한다.
   A-01(10 짝)처럼 짝이 안 되는 "남는 수"를 섞어 답이 늘 200 이 되지 않게 한다. */
NM_TGEN['cre_ad8_hundred'] = function(params, rng){
  const pairs = R(rng, 1, 2), nums = [], pairList = [];
  for(let i = 0; i < pairs; i++){
    const a = R(rng, 1, 8) * 10 + R(rng, 1, 9), b = 100 - a;
    if(nums.indexOf(a) >= 0 || nums.indexOf(b) >= 0 || a === b){ i--; continue; }
    nums.push(a, b); pairList.push([a, b]);
  }
  const orphans = [];
  while(orphans.length < 3 - pairs){
    const o = R(rng, 11, 89);
    if(o % 10 === 0 || nums.indexOf(o) >= 0 || nums.some(n => n + o === 100) || orphans.some(n => n + o === 100)) continue;
    orphans.push(o); nums.push(o);
  }
  const shown = shuffle(rng, nums), sum = nums.reduce((s, n) => s + n, 0);
  const steps = pairList.map(p => ({ tex:`${p[0]} + ${p[1]} = ${SQ}`, blank:100 }));
  steps.push({ tex:`${pairs * 100} + ${orphans.join(' + ')} = ${SQ}`, blank:sum });
  return mk(
    P(`${shown.join(' + ')}: 더해서 100이 되는 짝을 먼저 묶어요.`,
      `${shown.join(' + ')}: group the pairs that make 100 first.`,
      `${shown.join(' + ')}：先把凑成100的数配成一对。`),
    `${shown.join(' + ')} = ${SQ}`, sum, steps);
};

/* SB9 'countUp' — 반대로 채우기 ✔ 초급 E권(40−22 … 960−72, 790−574), A-19 fillReverse:
   73−48 을 48 + □ = 73 으로 생각한다. 몇십까지 먼저 채우고, 거기서 나머지를 채운다.
   (설계는 EL1 의 새 레벨로 적었으나 EL1 의 선수 DV3 가 과정 9 라 과정 6 에 둘 수 없어 SB9 로 세웠다.) */
NM_TGEN['cre_sb9_countUp'] = function(params, rng){
  const form = R(rng, 0, 2);
  let a, b;
  do {
    if(form === 0){ a = R(rng, 3, 9) * 10; b = R(rng, 11, a - 11); }           /* 40 − 22 */
    else if(form === 1){ a = R(rng, 20, 99) * 10; b = R(rng, 11, 99); }         /* 960 − 72 */
    else { a = R(rng, 30, 99) * 10; b = R(rng, 101, a - 30); }                  /* 790 − 574 */
  } while(b % 10 === 0 || Math.ceil(b / 10) * 10 >= a);
  const up = Math.ceil(b / 10) * 10, x = up - b, y = a - up;
  /* 사슬: 73 − 48 = □(48→50) + (73 − 50) = 2 + □ = 2 + 23 = □ — 줄마다 "=" 가 붙어도 참인 식이 되게 */
  const steps = [ { tex:`${SQ} + (${a} - ${up})`, blank:x },
                  { tex:`${x} + ${SQ}`, blank:y },
                  { tex:`${x} + ${y} = ${SQ}`, blank:a - b } ];
  return mk(
    P(`${a} - ${b}: 거꾸로 ${b}에 얼마를 더하면 ${a}이(가) 되는지 채워 가요.`,
      `${a} - ${b}: go the other way — how much do you add to ${b} to reach ${a}?`,
      `${a} - ${b}：反过来想，${b}加上多少才能得到${a}？`),
    `${a} - ${b} = ${SQ}`, a - b, steps);
};

/* ML1 L4 'halvePlace' — 둘로 쪼개기 ✔ 초급 H권(12~880): 자리마다 반으로 — 846 → 400+20+3,
   456 → 200+25+3(십의 자리가 홀수면 50 → 25). 짝수만(반이 자연수). ×5 = ×10÷2(ML16)·합과 차(EL6)의 선수. */
NM_TGEN['cre_ml1_halvePlace'] = function(params, rng){
  let n;
  do { n = R(rng, 6, 440) * 2; } while(n % 10 === 0);
  const parts = frontParts(n, String(n).length).filter(x => x > 0);
  const halves = parts.map(x => x / 2);
  const steps = parts.map((x, i) => ({ tex:`${x} \\div 2 = ${SQ}`, blank:halves[i] }));
  steps.push({ tex:`${halves.join(' + ')} = ${SQ}`, blank:n / 2 });
  return mk(
    P(`${n} ÷ 2: 자리마다 따로 반으로 나누고 모아요.`,
      `${n} ÷ 2: halve each place separately, then put the halves together.`,
      `${n} ÷ 2：每一位分别除以2，再合起来。`),
    `${n} \\div 2 = ${SQ}`, n / 2, steps);
};

})();
