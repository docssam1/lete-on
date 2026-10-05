/* ============================================================
   유아 교재 G1-10·11·12호 생성기 (NM_TGEN) — 스레드 NL47~NL56
   계약은 engine/threads/nl.js 머리말과 같다: NM_TGEN[key](params, rng) → problem. Math.random 금지(rng 만).
   · 모든 생성기는 params.mode 로 갈라진다(스레드 하나 = 생성기 하나). 난이도는 params.lv(숫자) — 유닛이
     넘기는 params.level('practice'|'main') 문자열과 섞이지 않게 일부러 다른 이름을 쓴다.
   · 위젯 답은 숫자 하나(호스트가 +val===answer). 정답이 여럿인 열린 활동은 위위젯이 규칙으로 판정해
     맞으면 onAnswer(answer) 를 올린다. 화면 위젯은 app/g1/10-12.widgets.js, 인쇄는 10-12.print.js.
   · 창작 콘텐츠(이모지·젤리 소품)만 쓴다 — 라이선스 교재 문장·삽화 없음. 수 범위는 9 이내.
   · 화면·인쇄가 같이 쓰는 순수 함수(식 표기, 분해 목록, 틀 좌표)는 window.NM_G1012 에 둔다.
   ============================================================ */
(function () {
  'use strict';

  const { R, pick, shuffle } = NM_RNG;
  const G = (window.NM_G1012 = window.NM_G1012 || {});
  const L3 = (ko, en, zh) => ({ ko, en, zh });
  const PLUS = '+', MINUS = '−';

  /* 받침 유무로 조사 고르기 — nl.js 와 같은 규칙 */
  function josa(w, withB, noB) {
    const c = String(w).charCodeAt(String(w).length - 1);
    const b = c >= 0xAC00 && c <= 0xD7A3 && ((c - 0xAC00) % 28) !== 0;
    return w + (b ? withB : noB);
  }
  G.josa = josa;
  /* 숫자 뒤 조사 — 우리말 읽기(영·일·삼·육·칠·팔은 받침 있음, 이·사·오·구는 없음)로 고른다 */
  function josaN(n, withB, noB) { return String(n) + ([0, 1, 3, 6, 7, 8].indexOf(+n) >= 0 ? withB : noB); }
  G.josaN = josaN;

  /* ── 세는 물건 사전 — [토큰] → 3개 언어 낱말과 세는 단위 ── */
  const IT = {
    '🍬':        { ko: '사탕',   kc: '개',   enS: 'candy',      enP: 'candies',      zh: '糖果', zc: '颗' },
    '🍓':        { ko: '딸기',   kc: '개',   enS: 'strawberry', enP: 'strawberries', zh: '草莓', zc: '个' },
    '⭐':        { ko: '별',     kc: '개',   enS: 'star',       enP: 'stars',        zh: '星星', zc: '颗' },
    '🎈':        { ko: '풍선',   kc: '개',   enS: 'balloon',    enP: 'balloons',     zh: '气球', zc: '个' },
    '🍪':        { ko: '쿠키',   kc: '개',   enS: 'cookie',     enP: 'cookies',      zh: '饼干', zc: '块' },
    '🍎':        { ko: '사과',   kc: '개',   enS: 'apple',      enP: 'apples',       zh: '苹果', zc: '个' },
    '🍌':        { ko: '바나나', kc: '개',   enS: 'banana',     enP: 'bananas',      zh: '香蕉', zc: '根' },
    '🌼':        { ko: '꽃',     kc: '송이', enS: 'flower',     enP: 'flowers',      zh: '花',   zc: '朵' },
    'melon':      { ko: '참외',   kc: '개',   enS: 'melon',      enP: 'melons',       zh: '甜瓜', zc: '个' },
    'watermelon': { ko: '수박',   kc: '개',   enS: 'watermelon', enP: 'watermelons',  zh: '西瓜', zc: '个' },
    'grapes':     { ko: '포도',   kc: '송이', enS: 'grape bunch', enP: 'grape bunches', zh: '葡萄', zc: '串' }
  };
  const ANI = {
    'animal:rabbit':   { ko: '토끼',   enS: 'rabbit',   en: 'rabbits',  zh: '兔子', zc: '只' },
    'animal:duck':     { ko: '오리',   enS: 'duck',     en: 'ducks',    zh: '鸭子', zc: '只' },
    'animal:bear':     { ko: '곰',     enS: 'bear',     en: 'bears',    zh: '小熊', zc: '只' },
    'animal:turtle':   { ko: '거북이', enS: 'turtle',   en: 'turtles',  zh: '乌龟', zc: '只' },
    'animal:fox':      { ko: '여우',   enS: 'fox',      en: 'foxes',    zh: '狐狸', zc: '只' },
    'animal:deer':     { ko: '사슴',   enS: 'deer',     en: 'deer',     zh: '小鹿', zc: '只' },
    'animal:squirrel': { ko: '다람쥐', enS: 'squirrel', en: 'squirrels', zh: '松鼠', zc: '只' }
  };
  G.IT = IT; G.ANI = ANI;
  const EAT = ['🍓', '🍪', '🍎', '🍬', '🍌'];
  const qk = (t, n) => `${IT[t].ko} ${n}${IT[t].kc}`;
  const qe = (t, n) => `${n} ${n === 1 ? IT[t].enS : IT[t].enP}`;
  const qz = (t, n) => `${n}${IT[t].zc}${IT[t].zh}`;

  /* 칩 배정 전수 검사 — 칸 n개에 칩을 겹치지 않게 넣어 test 가 참인 배정이 몇 개인가 */
  function countAssign(chips, n, test) {
    let c = 0; const used = new Array(chips.length).fill(false), cur = [];
    (function rec() {
      if (cur.length === n) { if (test(cur)) c++; return; }
      for (let i = 0; i < chips.length; i++) {
        if (used[i]) continue;
        used[i] = true; cur.push(chips[i]); rec(); cur.pop(); used[i] = false;
      }
    })();
    return c;
  }
  const sortedNums = a => a.slice().sort((x, y) => x - y);

  /* 식 표기 — 화면·인쇄 공용(기존 tex 경로를 쓰지 않는다) */
  G.eqStr = function (a, op, b, c) {
    const s = v => (v === null || v === undefined || v === '' ? '□' : String(v));
    return `${s(a)} ${op === '-' || op === MINUS ? MINUS : PLUS} ${s(b)}` + (c === undefined ? '' : ` = ${s(c)}`);
  };

  /* ==========================================================
     G1-10 — 숫자 이야기 · 정보 찾기 · 틀린 곳 · 그림↔식↔이야기 · 조사 · 이야기 셈
     ========================================================== */

  /* ── NL47 nlg10_text — mode 'storyfill' | 'facts' ── */
  const THEMES2 = [
    { ko: ['모자를 쓴', '모자를 안 쓴'], en: ['wearing hats', 'not wearing hats'], zh: ['戴帽子的', '没戴帽子的'] },
    { ko: ['우산을 가져온', '우산을 안 가져온'], en: ['carrying umbrellas', 'without umbrellas'], zh: ['带了雨伞的', '没带雨伞的'] },
    { ko: ['장갑을 낀', '장갑을 안 낀'], en: ['wearing gloves', 'not wearing gloves'], zh: ['戴手套的', '没戴手套的'] }
  ];
  const PLACES = [
    { ko: '놀이터', en: 'the playground', zh: '操场' }, { ko: '공원', en: 'the park', zh: '公园' },
    { ko: '집', en: 'home', zh: '家里' }, { ko: '학교', en: 'school', zh: '学校' }, { ko: '마당', en: 'the yard', zh: '院子' }
  ];

  function storyFill(lv, rng) {
    const hard = lv >= 2;
    const tmpl = hard ? pick(rng, ['whole2', 'take', 'give2']) : 'whole2';
    for (let tries = 0; tries < 400; tries++) {
      let sol, test, nslots, text;
      if (tmpl === 'whole2' || tmpl === 'give2') {
        const W = R(rng, 3, 9), small = R(rng, 1, Math.floor((W - 1) / 2)), big = W - small;
        nslots = 3;
        if (tmpl === 'whole2') {
          sol = [W, big, small];
          test = v => v[0] === v[1] + v[2] && v[1] > v[2];
          const th = pick(rng, THEMES2);
          text = L3(
            `우리 모둠은 모두 {0}명이에요. ${th.ko[0]} 친구가 {1}명, ${th.ko[1]} 친구가 {2}명이에요. ${th.ko[0]} 친구가 더 많아요.`,
            `Our group has {0} kids. {1} kids are ${th.en[0]} and {2} kids are ${th.en[1]}. More kids are ${th.en[0]}.`,
            `我们小组一共有{0}个小朋友。${th.zh[0]}有{1}个，${th.zh[1]}有{2}个。${th.zh[0]}更多。`);
        } else {
          sol = [W, small, big];
          test = v => v[0] === v[1] + v[2] && v[2] > v[1];
          const tk = pick(rng, ['⭐', '🍬', '🍪', '🍎']), it = IT[tk];
          const ps = shuffle(rng, PLACES), p1 = ps[0], p2 = ps[1];
          text = L3(
            `${josa(it.ko, '을', '를')} 모두 {0}개 모았어요. ${p1.ko}에서 {1}개, ${p2.ko}에서 {2}개를 모았어요. ${p2.ko}에서 모은 것이 더 많아요.`,
            `I collected {0} ${it.enP} in all. {1} came from ${p1.en} and {2} came from ${p2.en}. More came from ${p2.en}.`,
            `我一共收集了{0}${it.zc}${it.zh}。在${p1.zh}收集了{1}${it.zc}，在${p2.zh}收集了{2}${it.zc}。在${p2.zh}收集的更多。`);
        }
      } else {
        /* take: W = r + x + y, 따로 둔 것(r) < 적게 먹은(y) < 많이 먹은(x) */
        const r = R(rng, 1, 3), y = R(rng, r + 1, r + 3), x = R(rng, y + 1, y + 3), W = r + x + y;
        if (W > 9) continue;
        nslots = 4; sol = [W, r, x, y];
        test = v => v[0] === v[1] + v[2] + v[3] && v[2] > v[3] && v[1] < v[3];
        const tk = pick(rng, EAT), it = IT[tk];
        text = L3(
          `${it.ko} {0}개가 있어요. 그중 {1}개를 따로 두었어요. 나머지는 두 친구가 나눠 먹었는데, 많이 먹은 친구는 {2}개, 적게 먹은 친구는 {3}개예요. 따로 둔 것이 가장 적어요.`,
          `There are {0} ${it.enP}. {1} are put aside. Two friends share the rest: the friend who eats more gets {2}, the friend who eats less gets {3}. The ones put aside are the fewest.`,
          `有{0}${it.zc}${it.zh}。先留下{1}${it.zc}，剩下的两个朋友分着吃，吃得多的吃了{2}${it.zc}，吃得少的吃了{3}${it.zc}。留下的最少。`);
      }
      let chips = sol.slice();
      if (hard) {
        const rest = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(n => sol.indexOf(n) < 0);
        if (!rest.length) continue;
        chips.push(pick(rng, rest));
      }
      chips = shuffle(rng, chips);
      if (countAssign(chips, nslots, test) !== 1) continue;
      return {
        prompt: L3('이야기를 읽고, 빈칸에 알맞은 수를 골라 넣어요', 'Read the story and put the right numbers in the blanks', '读故事，把合适的数选进空格里'),
        answer: sol[0], answerType: 'number', widget: 'g10_slotFill',
        text, slots: nslots, chips, solution: sol, tmpl,
        keyFields: ['tmpl', 'chips', 'text', 'slots']
      };
    }
    throw new Error('storyFill: 유일해 문항을 만들지 못함');
  }

  const FSCENES = [
    { tok: '🎈', cat: L3('풍선', 'balloons', '气球'), zc: '个',
      k: [L3('빨간 풍선', 'red balloons', '红气球'), L3('파란 풍선', 'blue balloons', '蓝气球')] },
    { tok: '🍬', cat: L3('사탕', 'candies', '糖果'), zc: '颗',
      k: [L3('딸기맛 사탕', 'strawberry candies', '草莓糖'), L3('포도맛 사탕', 'grape candies', '葡萄糖')] },
    { tok: '⭐', cat: L3('별', 'stars', '星星'), zc: '颗',
      k: [L3('노란 별', 'yellow stars', '黄星星'), L3('하얀 별', 'white stars', '白星星')] },
    { tok: '🍎', cat: L3('사과', 'apples', '苹果'), zc: '个',
      k: [L3('빨간 사과', 'red apples', '红苹果'), L3('초록 사과', 'green apples', '青苹果')] },
    { tok: '🍪', cat: L3('쿠키', 'cookies', '饼干'), zc: '块',
      k: [L3('땅콩 쿠키', 'peanut cookies', '花生饼干'), L3('초코 쿠키', 'choco cookies', '巧克力饼干')] }
  ];
  const FTRAP = [
    { tok: '🐟', ko: '물고기', kc: '마리', en: 'fish', zh: '鱼', zc: '条' },
    { tok: '🦋', ko: '나비', kc: '마리', en: 'butterflies', zh: '蝴蝶', zc: '只' },
    { tok: 'animal:turtle', ko: '거북이', kc: '마리', en: 'turtles', zh: '乌龟', zc: '只' }
  ];

  function factsProblem(lv, rng) {
    const hard = lv >= 2;
    for (let tries = 0; tries < 200; tries++) {
      const sc = pick(rng, FSCENES), ask = pick(rng, hard ? ['sum', 'diff', 'pick'] : ['pick', 'sum']);
      const order = shuffle(rng, [0, 1]);                    /* 카드 k[0]/k[1] 의 역할 순서 */
      let a = R(rng, 2, 8), b = R(rng, 2, 8);
      if (ask === 'sum' && a + b > 9) continue;
      if (ask === 'diff') { if (a === b) continue; if (a < b) { const t = a; a = b; b = t; } }
      if (ask === 'pick' && a === b) continue;
      const vals = [a, b];                                    /* vals[i] = 종류 k[i] 의 개수(i=0 이 '질문의 앞쪽') */
      const trap = hard ? pick(rng, FTRAP) : null, tn = hard ? R(rng, 1, 9) : 0;
      if (hard && (tn === a || tn === b)) continue;
      const kinds = [sc.k[order[0]], sc.k[order[1]]];         /* kinds[i] 는 vals[i] 의 이름 */
      const card = (k, n) => ({
        icon: sc.tok, use: true,
        text: L3(`${josa(k.ko, '이', '가')} ${n}개 있어요.`, `There are ${n} ${k.en}.`, `有${n}${sc.zc}${k.zh}。`)
      });
      let facts = [card(kinds[0], vals[0]), card(kinds[1], vals[1])];
      if (hard) facts.push({ icon: trap.tok, use: false,
        text: L3(`${josa(trap.ko, '이', '가')} ${tn}${trap.kc} 있어요.`, `There are ${tn} ${trap.en}.`, `有${tn}${trap.zc}${trap.zh}。`) });
      facts = shuffle(rng, facts);
      let prompt, answer;
      const k0 = kinds[0], k1 = kinds[1];
      if (ask === 'sum') {
        answer = a + b;
        prompt = L3(`${josa(sc.cat.ko, '은', '는')} 모두 몇 개일까요?`, `How many ${sc.cat.en} are there in all?`, `${sc.cat.zh}一共有几个？`);
      } else if (ask === 'diff') {
        answer = a - b;
        prompt = L3(`${josa(k0.ko, '은', '는')} ${k1.ko}보다 몇 개 더 많을까요?`, `How many more ${k0.en} than ${k1.en} are there?`, `${k0.zh}比${k1.zh}多几个？`);
      } else {
        answer = b;
        prompt = L3(`${josa(k1.ko, '은', '는')} 몇 개일까요?`, `How many ${k1.en} are there?`, `有几个${k1.zh}？`);
      }
      return { prompt, answer, answerType: 'number', widget: 'g10_factsCard', facts, ask, keyFields: ['facts', 'ask'] };
    }
    throw new Error('facts: 생성 실패');
  }

  NM_TGEN['nlg10_text'] = function (params, rng) {
    const mode = (params && params.mode) || 'storyfill';
    const lv = (params && params.lv) || 1;
    return mode === 'facts' ? factsProblem(lv, rng) : storyFill(lv, rng);
  };

  /* ── NL48 nlg10_check — mode 'errorfind' | 'pic2eq' | 'eq2story' ── */

  /* 틀린 곳 찾기 — 그림이 진실을 못 박는다(수 세 곳 중 어느 곳이 틀렸는지 하나로 정해진다) */
  function errorFind(lv, rng) {
    const kind = pick(rng, lv >= 2 ? ['rest', 'sum', 'add'] : ['rest', 'sum']);
    for (let tries = 0; tries < 200; tries++) {
      const tk = pick(rng, EAT), it = IT[tk];
      let t, rows, segs;
      let truth;                                             /* [part0, part1, part2] 진짜 값 */
      if (kind === 'rest') {
        const W = R(rng, 3, lv >= 2 ? 9 : 7), r = R(rng, 1, W - 1);
        truth = [W, r, W - r]; rows = [{ n: W, gone: r }];
      } else {
        const a = R(rng, 1, lv >= 2 ? 7 : 5), b = R(rng, 1, lv >= 2 ? 9 - a : 6 - a < 1 ? 1 : 6 - a);
        if (a + b > 9) continue;
        truth = [a, b, a + b]; rows = [{ n: a }, { n: b, plus: true }];
      }
      const bad = R(rng, 0, 2), tv = truth[bad];
      const wrongs = [];
      for (const d of [-2, -1, 1, 2]) { const w = tv + d; if (w >= 0 && w <= 9 && w !== tv) wrongs.push(w); }
      if (!wrongs.length) continue;
      const shownBad = pick(rng, wrongs);
      const neigh = wrongs.filter(w => w !== shownBad);
      if (!neigh.length) continue;
      const choices = shuffle(rng, [tv, shownBad, pick(rng, neigh)]);
      const sv = truth.map((v, i) => (i === bad ? shownBad : v));
      /* 문장 — 세 언어 모두 같은 순서로 세 수(part 0,1,2)가 나온다 */
      const P = (i, ko, en, zh) => ({ part: i, t: L3(ko, en, zh) });
      const T = (ko, en, zh) => ({ t: L3(ko, en, zh) });
      const pk = i => P(i, `${sv[i]}개`, qe(tk, sv[i]), `${sv[i]}${it.zc}`);
      const pn = i => P(i, `${sv[i]}개`, `${sv[i]}`, `${sv[i]}${it.zc}`);
      if (kind === 'rest') {
        segs = [T(`${it.ko} `, 'Of ', `${it.zh}有`), pk(0), T(' 중 ', ', ', '，吃了'), pn(1),
          T('를 먹었더니 ', ' eaten, so ', '，还剩'), pn(2), T('가 남았어요.', ' left.', '。')];
      } else if (kind === 'sum') {
        segs = [T(`${it.ko} `, '', ''), pk(0), T('와 ', ' and ', `${it.zh}和`), pk(1),
          T('를 모으면 ', ' together make ', `${it.zh}合起来是`), pk(2), T('가 돼요.', '.', '。')];
      } else {
        segs = [T(`${it.ko} `, '', `${it.zh}`), pk(0), T('에 ', ' plus ', '，又放进'), P(1, `${sv[1]}개`, `${sv[1]} more`, `${sv[1]}${it.zc}`),
          T('를 더 넣었더니 ', ' makes ', '，变成了'), pk(2), T('가 되었어요.', '.', '。')];
      }
      return {
        prompt: L3('그림과 다른 곳을 눌러 보고, 맞게 고쳐 봐요', 'Tap the part that does not match the picture, then fix it', '点一点和图画不同的地方，再改对'),
        answer: tv, answerType: 'number', widget: 'g10_errorFind',
        segs, badPart: bad, fix: { choices, correct: tv }, kind,
        pic: { tok: tk, rows },
        keyFields: ['segs', 'badPart', 'kind', 'fix']
      };
    }
    throw new Error('errorFind: 생성 실패');
  }

  /* 그림 행 — 개수 n, gone(먹어서 없어진 수), plus(다른 무리) */
  function eqText(a, op, b, c) { return G.eqStr(a, op, b, c); }   /* 그림 행: {n, gone(없어진 수), plus(다른 무리)} */

  function pickCards(lv, rng, mode) {
    const tk = pick(rng, EAT), it = IT[tk];
    const mk = (cards, ci) => ({ cards, answer: ci });
    if (mode === 'pic2eq') {
      const sub = pick(rng, [true, false]);
      let rows, good, d1, d2;
      if (sub) {
        const n = R(rng, 3, 9), r = R(rng, 1, n - 1), s = n - r;
        rows = [{ n, gone: r }];
        good = eqText(n, '-', r, s);
        d1 = n + r <= 9 ? eqText(n, '+', r, n + r) : eqText(n, '-', r + 1, n - r - 1);
        d2 = eqText(n, '-', r, s + (s >= 2 ? -1 : 1));
      } else {
        const a = R(rng, 1, 7), b = R(rng, 1, 9 - a), t = a + b;
        rows = [{ n: a }, { n: b, plus: true }];
        good = eqText(a, '+', b, t);
        const hi = Math.max(a, b), lo = Math.min(a, b);
        d1 = eqText(hi, '-', lo, hi - lo);
        d2 = eqText(a, '+', b, t + (t <= 8 ? 1 : -1));
      }
      const arr = [good, d1, d2];
      if (new Set(arr).size < 3) return null;
      const order = shuffle(rng, [0, 1, 2]);
      const cards = order.map(i => ({ text: L3(arr[i], arr[i], arr[i]) }));
      return {
        prompt: L3('그림에 맞는 식을 골라요', 'Pick the equation that matches the picture', '选出和图画相符的算式'),
        answer: order.indexOf(0), answerType: 'number', widget: 'g10_choiceCards', mode,
        stem: { tok: tk, rows }, cards, keyFields: ['stem', 'cards', 'mode']
      };
    }
    /* eq2story — 식을 주고 어울리는 이야기 카드를 고른다 */
    const sub = pick(rng, [true, false]);
    const storySub = (n, r) => ({
      rows: [{ n, gone: r }],
      text: L3(`${it.ko} ${n}개 중 ${r}개를 먹었어요.`, `${n} ${it.enP}, and ${r} ${r === 1 ? 'was' : 'were'} eaten.`, `${n}${it.zc}${it.zh}，吃了${r}个。`)
    });
    const storyAdd = (a, b) => ({
      rows: [{ n: a }, { n: b, plus: true }],
      text: L3(`${it.ko} ${a}개에 ${b}개를 더 얻었어요.`, `${a} ${it.enP}, then ${b} more ${b === 1 ? 'was' : 'were'} added.`, `${a}${it.zc}${it.zh}，又来了${b}个。`)
    });
    let eq, good, d1, d2;
    if (sub) {
      const n = R(rng, 3, 8), r = R(rng, 1, Math.min(3, n - 1));
      eq = `${n} ${MINUS} ${r}`;
      good = storySub(n, r); d1 = storyAdd(n, r); d2 = storySub(n + 1, r);
    } else {
      const a = R(rng, 2, 6), b = R(rng, 1, 3);
      eq = `${a} ${PLUS} ${b}`;
      good = storyAdd(a, b); d1 = a > b ? storySub(a, b) : storySub(a + 1, b); d2 = storyAdd(a + 1, b);
    }
    const arr = [good, d1, d2];
    if (new Set(arr.map(c => c.text.ko)).size < 3) return null;
    const order = shuffle(rng, [0, 1, 2]);
    return {
      prompt: L3('식에 어울리는 이야기를 골라요', 'Pick the story that fits the equation', '选出和算式相配的故事'),
      answer: order.indexOf(0), answerType: 'number', widget: 'g10_choiceCards', mode,
      stem: { eq, tok: tk }, cards: order.map(i => arr[i]), keyFields: ['stem', 'cards', 'mode']
    };
  }

  NM_TGEN['nlg10_check'] = function (params, rng) {
    const mode = (params && params.mode) || 'errorfind';
    const lv = (params && params.lv) || 1;
    if (mode === 'errorfind') return errorFind(lv, rng);
    for (let i = 0; i < 100; i++) { const p = pickCards(lv, rng, mode); if (p) return p; }
    throw new Error('nlg10_check: 생성 실패');
  };

  /* ── NL49 nlg10_survey — 조사하기·분류하기 ── */
  const SN = {
    '🍎': L3('사과', 'apples', '苹果'), '🍌': L3('바나나', 'bananas', '香蕉'), '🍓': L3('딸기', 'strawberries', '草莓'),
    'melon': L3('참외', 'melons', '甜瓜'), 'watermelon': L3('수박', 'watermelons', '西瓜'), 'grapes': L3('포도', 'grapes', '葡萄'),
    'weather-sun': L3('맑은 날', 'sunny days', '晴天'), 'weather-cloud': L3('흐린 날', 'cloudy days', '阴天'),
    'weather-rain': L3('비 온 날', 'rainy days', '雨天')
  };
  G.SN = SN;
  function randomCounts(rng, k, total, cap) {
    const c = new Array(k).fill(1);
    let left = total - k;
    while (left > 0) {
      const i = R(rng, 0, k - 1);
      if (c[i] < cap) { c[i]++; left--; }
    }
    return c;
  }

  function surveyProblem(lv, rng, mode) {
    const weather = mode === 'weather-tally' || mode === 'weather-ask';
    const asking = mode === 'ask' || mode === 'weather-ask';
    for (let tries = 0; tries < 300; tries++) {
      let kinds, cols, rows;
      if (weather) {
        kinds = ['weather-sun', 'weather-cloud', 'weather-rain'];
        const sh = pick(rng, [[1, 7], [2, 4], [3, 3]]); rows = sh[0]; cols = sh[1];
      } else if (mode === 'tally3') {
        kinds = shuffle(rng, ['🍎', '🍌', '🍓']);
        const sh = pick(rng, [[3, 3], [3, 4]]); rows = sh[0]; cols = sh[1];
      } else {
        const k = mode === 'tally5' ? pick(rng, [4, 5]) : pick(rng, [3, 4, 5]);
        kinds = shuffle(rng, ['🍎', '🍌', '🍓', 'melon', 'watermelon', 'grapes']).slice(0, k);
        const sh = k === 5 ? pick(rng, [[4, 4], [4, 5]]) : pick(rng, [[3, 4], [4, 4]]);
        rows = sh[0]; cols = sh[1];
      }
      const total = rows * cols, k = kinds.length;
      if (total > k * 9) continue;
      const counts = randomCounts(rng, k, total, 9);
      const cellsArr = [];
      kinds.forEach((t, i) => { for (let j = 0; j < counts[i]; j++) cellsArr.push(t); });
      const cells = shuffle(rng, cellsArr);
      const unit = weather ? L3('일', 'days', '天') : L3('개', '', '个');
      const p = {
        widget: 'g10_surveyGrid', cols, rows, cells, kinds, counts,
        askMode: asking ? 'ask' : 'tally', unit, weather,
        keyFields: ['cells', 'kinds', 'ask', 'cols', 'rows', 'askMode']
      };
      if (!asking) {
        p.prompt = L3('종류별로 세어서 표에 알맞은 수를 써요', 'Count each kind and write the numbers in the table', '按种类数一数，把数填进表里');
        p.answer = counts[0]; p.answerType = 'number'; p.ask = null;
        return p;
      }
      const type = pick(rng, ['count', 'sum', 'diff', 'most']);
      let ask = null, answer, prompt;
      const nm = i => SN[kinds[i]];
      if (type === 'count') {
        const a = R(rng, 0, k - 1);
        ask = { type, a }; answer = counts[a];
        prompt = weather ? L3(`${josa(nm(a).ko, '은', '는')} 며칠일까요?`, `How many ${nm(a).en} are there?`, `${nm(a).zh}有几天？`)
          : L3(`${josa(nm(a).ko, '은', '는')} 몇 개일까요?`, `How many ${nm(a).en} are there?`, `${nm(a).zh}有几个？`);
      } else if (type === 'sum') {
        const pairs = [];
        for (let i = 0; i < k; i++) for (let j = i + 1; j < k; j++) if (counts[i] + counts[j] <= 9) pairs.push([i, j]);
        if (!pairs.length) continue;
        const [a, b] = pick(rng, pairs); ask = { type, a, b }; answer = counts[a] + counts[b];
        prompt = weather ? L3(`${josa(nm(a).ko, '과', '와')} ${nm(b).ko}은(는) 모두 며칠일까요?`, `How many ${nm(a).en} and ${nm(b).en} are there in all?`, `${nm(a).zh}和${nm(b).zh}一共有几天？`)
          : L3(`${josa(nm(a).ko, '과', '와')} ${josa(nm(b).ko, '은', '는')} 모두 몇 개일까요?`, `How many ${nm(a).en} and ${nm(b).en} are there in all?`, `${nm(a).zh}和${nm(b).zh}一共有几个？`);
      } else if (type === 'diff') {
        const pairs = [];
        for (let i = 0; i < k; i++) for (let j = 0; j < k; j++) if (counts[i] > counts[j]) pairs.push([i, j]);
        if (!pairs.length) continue;
        const [a, b] = pick(rng, pairs); ask = { type, a, b }; answer = counts[a] - counts[b];
        prompt = weather ? L3(`${josa(nm(a).ko, '은', '는')} ${nm(b).ko}보다 며칠 더 많을까요?`, `How many more ${nm(a).en} than ${nm(b).en} are there?`, `${nm(a).zh}比${nm(b).zh}多几天？`)
          : L3(`${josa(nm(a).ko, '은', '는')} ${nm(b).ko}보다 몇 개 더 많을까요?`, `How many more ${nm(a).en} than ${nm(b).en} are there?`, `${nm(a).zh}比${nm(b).zh}多几个？`);
      } else {
        const mx = Math.max.apply(null, counts);
        if (counts.filter(c => c === mx).length !== 1) continue;
        ask = { type, a: counts.indexOf(mx) }; answer = mx;
        prompt = weather ? L3('가장 많은 날씨는 며칠일까요?', 'On how many days was the most common weather?', '出现最多的天气有几天？')
          : L3('가장 많은 것은 몇 개일까요?', 'How many are there of the kind with the most?', '最多的那一种有几个？');
      }
      p.ask = ask; p.answer = answer; p.answerType = 'number'; p.prompt = prompt;
      return p;
    }
    throw new Error('survey: 생성 실패');
  }
  NM_TGEN['nlg10_survey'] = function (params, rng) {
    return surveyProblem((params && params.lv) || 1, rng, (params && params.mode) || 'tally3');
  };

  /* ── NL50 nlg10_stories — 같게 옮기기·똑같이 나누기·두 단계·묶음·두 줄 비교 ── */
  const PLATE_IT = ['🍪', '🍬', '🍎', '🍓', '🍌', '⭐', '🎈'];
  const STORY_ANI = Object.keys(ANI);
  NM_TGEN['nlg10_stories'] = function (params, rng) {
    const mode = (params && params.mode) || 'move';
    if (mode === 'move' || mode === 'share') {
      const tk = pick(rng, PLATE_IT), it = IT[tk];
      let pans, answer, prompt;
      if (mode === 'move') {
        const d = pick(rng, [1, 2, 3]);                                /* 옮겨야 할 개수 */
        const b = R(rng, 0, Math.min(4, 9 - 2 * d)), a = b + 2 * d;
        pans = shuffle(rng, [a, b]); answer = d;
        prompt = L3(`두 접시의 ${josa(it.ko, '이', '가')} 똑같아지게 옮겨 봐요!`, `Move ${it.enP} so both plates have the same amount!`, `把${it.zh}移一移，让两个盘子里一样多！`);
      } else {
        const n = pick(rng, [2, 4, 6, 8]);
        pans = [n, 0]; answer = n / 2;
        prompt = L3(`${it.ko} ${n}개를 두 접시에 똑같이 나눠 담아요!`, `Share ${n} ${it.enP} equally between two plates!`, `把${n}${it.zc}${it.zh}平均分到两个盘子里！`);
      }
      return { prompt, answer, answerType: 'number', widget: 'g10_moveEqual', pans, tok: tk, mode, keyFields: ['pans', 'mode', 'tok'] };
    }
    /* storyRows 위젯 — 숫자 패드로 답한다 */
    if (mode === 'take') {
      for (let t = 0; t < 100; t++) {
        const r = R(rng, 1, 3), x = R(rng, 1, 4), y = R(rng, 1, 4), W = r + x + y;
        if (W > 9 || W < 4) continue;
        const tk = pick(rng, ['🍬', '🍪', '🍎', '🍓']), noun = IT[tk];
        return {
          prompt: L3(`${noun.ko} ${W}개 중 ${r}개를 따로 두고, 나머지를 두 손에 나눠 담았어요. 한 손에 ${x}개면 다른 손에는 몇 개일까요?`,
            `Out of ${W} ${noun.enP}, ${r} are put aside and the rest are split between two hands. One hand has ${x}. How many does the other hand have?`,
            `${W}${noun.zc}${noun.zh}里先留下${r}${noun.zc}，剩下的分在两只手里。一只手有${x}${noun.zc}，另一只手有几${noun.zc}？`),
          answer: y, answerType: 'number', widget: 'g10_storyRows', layout: 'rows',
          rows: [{ tok: tk, n: W, gone: r }], kind: 'take', keyFields: ['rows', 'kind', 'layout']
        };
      }
    }
    if (mode === 'more') {
      for (let t = 0; t < 100; t++) {
        const N = R(rng, 1, 4), k = R(rng, 1, 3);
        if (2 * N + k > 9) continue;
        const [a, b] = shuffle(rng, STORY_ANI).slice(0, 2), A = ANI[a], B = ANI[b];
        return {
          prompt: L3(`${josa(A.ko, '이', '가')} ${N}마리 있어요. ${josa(B.ko, '은', '는')} ${A.ko}보다 ${k}마리 더 많아요. 모두 몇 마리일까요?`,
            `There are ${N} ${A.en}. There are ${k} more ${B.en} than ${A.en}. How many animals are there in all?`,
            `有${N}${A.zc}${A.zh}。${B.zh}比${A.zh}多${k}${B.zc}。一共有几${B.zc}？`),
          answer: N + N + k, answerType: 'number', widget: 'g10_storyRows', layout: 'rows',
          rows: [{ tok: a, n: N }], kind: 'more', keyFields: ['rows', 'kind', 'layout']
        };
      }
    }
    if (mode === 'pair') {
      const [t1, t2] = shuffle(rng, ['🍎', '🍌', '🍓', '🍪']).slice(0, 2);
      const a = R(rng, 4, 9), b = R(rng, 1, a - 1), I1 = IT[t1], I2 = IT[t2];
      return {
        prompt: L3(`${josa(I1.ko, '은', '는')} ${I2.ko}보다 몇 개 더 많을까요?`, `How many more ${I1.enP} than ${I2.enP} are there?`, `${I1.zh}比${I2.zh}多几个？`),
        answer: a - b, answerType: 'number', widget: 'g10_storyRows', layout: 'rows',
        rows: [{ tok: t1, n: a }, { tok: t2, n: b }], kind: 'pair', keyFields: ['rows', 'kind', 'layout']
      };
    }
    /* groups — 똑같이 모아 세기 */
    const combos = [[2, 2], [2, 3], [2, 4], [3, 2], [3, 3], [4, 2]];
    const [g, n] = pick(rng, combos), tk = pick(rng, PLATE_IT), it = IT[tk];
    return {
      prompt: L3(`${josa(it.ko, '이', '가')} ${n}개씩 든 봉지가 ${g}개 있어요. ${josa(it.ko, '은', '는')} 모두 몇 개일까요?`,
        `There are ${g} bags with ${n} ${it.enP} in each. How many ${it.enP} are there in all?`,
        `有${g}个袋子，每个袋子里有${n}${it.zc}${it.zh}。一共有几${it.zc}${it.zh}？`),
      answer: g * n, answerType: 'number', widget: 'g10_storyRows', layout: 'groups',
      groups: new Array(g).fill(n), tok: tk, kind: 'groups', keyFields: ['groups', 'tok', 'kind', 'layout']
    };
  };

  /* ==========================================================
     G1-11 — 식(+ − = □) 표기를 처음 들여오는 호
     ========================================================== */

  /* ── NL51 nlg11_numpick — 칩 여러 개 누르기 ── */
  function sumsOf(cards) {
    const s = new Set();
    for (let i = 0; i < cards.length; i++) for (let j = i + 1; j < cards.length; j++) s.add(cards[i] + cards[j]);
    return s;
  }
  G.sumsOf = sumsOf;
  function numpickCmp(lv, rng) {
    const maxV = lv < 2 ? 5 : 9, chipMax = lv < 2 ? 6 : 9;
    for (let t = 0; t < 400; t++) {
      const op = pick(rng, ['+', '-']);
      let a, b;
      const b0 = lv < 2 ? 1 : 0;
      if (op === '+') { a = R(rng, b0, maxV); b = R(rng, b0, maxV - a); } else { a = R(rng, 1 + b0, maxV); b = R(rng, b0, a); }
      if (b < b0 || (op === '+' && a < b0)) continue;
      const v = op === '+' ? a + b : a - b;
      const rel = pick(rng, ['lt', 'gt', 'eq']);
      const chips = []; for (let i = 0; i <= chipMax; i++) chips.push(i);
      const sol = chips.filter(x => (rel === 'lt' ? x < v : rel === 'gt' ? x > v : x === v));
      const cap = lv < 2 ? 4 : 7;
      if (sol.length < 1 || sol.length > cap) continue;
      const E = G.eqStr(a, op, b);
      const kw = { lt: ['보다 작은 수', 'smaller than', '小'], gt: ['보다 큰 수', 'bigger than', '大'] };
      const prompt = rel === 'eq'
        ? L3(`${E}의 답과 같은 수를 모두 눌러요`, `Tap every number equal to ${E}`, `点出所有和${E}的得数相等的数`)
        : L3(`${E}${kw[rel][0]}를 모두 눌러요`, `Tap every number ${kw[rel][1]} ${E}`, `点出所有比${E}${kw[rel][2]}的数`);
      return {
        prompt,
        answer: sol.length, answerType: 'number', widget: 'g11_numPick', kind: 'cmp',
        expr: { a, op, b }, rel, chips, solution: sol, keyFields: ['expr', 'rel', 'chips', 'kind']
      };
    }
    throw new Error('numpickCmp: 생성 실패');
  }
  function cardsNumpick(lv, rng, kind) {
    const nCards = lv >= 2 ? 4 : 3;
    for (let t = 0; t < 600; t++) {
      const pool = shuffle(rng, [0, 1, 2, 3, 4, 5, 6, 7, 8]).slice(0, nCards);
      const S = sumsOf(pool);
      if (Math.max.apply(null, Array.from(S)) > 9) continue;
      const sArr = shuffle(rng, Array.from(S));
      const non = shuffle(rng, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(n => !S.has(n)));
      let chips;
      if (kind === 'cards-can') {
        const take = Math.min(sArr.length, R(rng, 2, 4)), other = R(rng, 3, 4);
        if (non.length < other) continue;
        chips = sArr.slice(0, take).concat(non.slice(0, other));
      } else {
        const take = Math.min(sArr.length, R(rng, 2, 4)), other = R(rng, 1, 3);
        if (non.length < other) continue;
        chips = sArr.slice(0, take).concat(non.slice(0, other));
      }
      chips = sortedNums(chips);
      const sol = chips.filter(n => (kind === 'cards-can' ? S.has(n) : !S.has(n)));
      if (sol.length < 1) continue;
      return {
        prompt: kind === 'cards-can'
          ? L3('카드 두 장을 골라 더해서 만들 수 있는 수를 모두 눌러요', 'Tap every number you can make by adding two cards', '点出两张卡片相加能得到的所有数')
          : L3('카드 두 장을 더해서 만들 수 없는 수를 모두 눌러요', 'Tap every number you cannot make by adding two cards', '点出两张卡片相加得不到的所有数'),
        answer: sol.length, answerType: 'number', widget: 'g11_numPick', kind,
        cards: pool, chips, solution: sol, keyFields: ['cards', 'chips', 'kind']
      };
    }
    throw new Error('cardsNumpick: 생성 실패');
  }
  function rangePick(lv, rng) {
    for (let t = 0; t < 300; t++) {
      const A = R(rng, 1, 5), s = R(rng, 1, 3), lo = R(rng, A, A + 6), hi = lo + s + 1;
      const chips = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      const sol = chips.filter(x => A + x > lo && A + x < hi);
      if (sol.length !== s || hi > 10) continue;
      return {
        prompt: L3(`두 카드의 합이 ${lo}보다 크고 ${hi}보다 작아요. 첫 카드가 ${josaN(A, '이면', '면')} 둘째 카드가 될 수 있는 수를 모두 눌러요`,
          `The sum of two cards is more than ${lo} and less than ${hi}. The first card is ${A}. Tap every number the second card can be`,
          `两张卡片的和比${lo}大、比${hi}小。第一张是${A}，点出第二张可能是的所有数`),
        answer: sol.length, answerType: 'number', widget: 'g11_numPick', kind: 'range',
        expr: { a: A, op: '+', b: '□' }, bounds: [lo, hi], chips, solution: sol, keyFields: ['expr', 'bounds', 'chips', 'kind']
      };
    }
    throw new Error('rangePick: 생성 실패');
  }
  function sumPick(lv, rng) {
    for (let t = 0; t < 800; t++) {
      const chips = sortedNums(shuffle(rng, [1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 6));
      const T = R(rng, 6, 12);
      const hits = [];
      for (let i = 0; i < 6; i++) for (let j = i + 1; j < 6; j++) for (let k = j + 1; k < 6; k++)
        if (chips[i] + chips[j] + chips[k] === T) hits.push([chips[i], chips[j], chips[k]]);
      if (hits.length !== 1) continue;
      return {
        prompt: L3(`수 카드 중 세 장을 골라 합이 ${josaN(T, '이', '가')} 되게 눌러요`, `Tap three cards that add up to ${T}`, `选出三张卡片，让它们的和是${T}`),
        answer: 3, answerType: 'number', widget: 'g11_numPick', kind: 'sumpick',
        chips, target: T, solution: hits[0], keyFields: ['chips', 'target', 'kind']
      };
    }
    throw new Error('sumPick: 생성 실패');
  }
  NM_TGEN['nlg11_numpick'] = function (params, rng) {
    const kind = (params && params.kind) || 'cmp', lv = (params && params.lv) || 1;
    if (kind === 'cmp') return numpickCmp(lv, rng);
    if (kind === 'range') return rangePick(lv, rng);
    if (kind === 'sumpick') return sumPick(lv, rng);
    return cardsNumpick(lv, rng, kind);
  };

  /* ── NL52 nlg11_eqvert — mode 'eq'(□의 값) | 'vert'(세로셈 빈칸) ── */
  function eqFill(lv, rng) {
    const wMax = lv >= 2 ? 9 : 6;
    const slot = pick(rng, lv >= 2 ? ['add-res', 'add-part', 'sub-sub', 'sub-res', 'sub-top'] : ['add-res', 'add-part', 'sub-sub', 'sub-res']);
    const w = R(rng, 4, wMax);
    let b = R(rng, lv >= 2 ? 0 : 1, w - 1), c = w - b;
    if (c < 1) { b = 1; c = w - 1; }
    let eq, blanks, vals;
    if (slot === 'add-res')      { eq = { a: b, op: '+', b: c, c: null }; blanks = ['c']; vals = [w]; }
    else if (slot === 'add-part') {
      if (pick(rng, [true, false])) { eq = { a: null, op: '+', b: c, c: w }; blanks = ['a']; vals = [b]; }
      else { eq = { a: b, op: '+', b: null, c: w }; blanks = ['b']; vals = [c]; }
    }
    else if (slot === 'sub-sub') { eq = { a: w, op: '-', b: null, c: c }; blanks = ['b']; vals = [b]; }
    else if (slot === 'sub-res') { eq = { a: w, op: '-', b: b, c: null }; blanks = ['c']; vals = [c]; }
    else                         { eq = { a: null, op: '-', b: b, c: null }; blanks = ['a', 'c']; vals = [w, c]; }
    return {
      prompt: L3('별의 수를 보고, 식의 빈칸에 알맞은 수를 써요', 'Look at the stars and write the right number in the blank', '看星星的数量，在算式的空格里写出合适的数'),
      answer: vals[0], answerType: 'number', widget: 'g11_eqFill',
      eq, star: w, blanks, vals, slot, keyFields: ['eq', 'star']
    };
  }
  function vertFill(lv, rng, op) {
    const anyPos = lv >= 2;
    for (let t = 0; t < 200; t++) {
      let a, b, r;
      if (op === '+') { a = R(rng, 0, 9); b = R(rng, 0, 9 - a); r = a + b; if (a + b === 0) continue; }
      else { a = R(rng, 1, 9); b = R(rng, 0, a); r = a - b; }
      const pos = anyPos ? pick(rng, ['a', 'b', 'r']) : 'r';
      const p = { op, a, b, r };
      const answer = p[pos]; p[pos] = null;
      return {
        prompt: L3('빈칸에 알맞은 수를 써요', 'Write the right number in the blank', '在空格里写出合适的数'),
        answer, answerType: 'number', widget: 'g11_vertFill', op, a: p.a, b: p.b, r: p.r, keyFields: ['op', 'a', 'b', 'r']
      };
    }
    throw new Error('vertFill: 생성 실패');
  }
  NM_TGEN['nlg11_eqvert'] = function (params, rng) {
    const mode = (params && params.mode) || 'eq', lv = (params && params.lv) || 1;
    if (mode === 'eq') return eqFill(lv, rng);
    return vertFill(lv, rng, (params && params.op) || '+');
  };

  /* ── NL53 nlg11_make — mode 'cardeq'(식 만들기) | 'purse'(동전 합·차) ── */
  /* 식 하나 = {a, op, b, c}. + 는 {a,b} 정렬(교환은 같은 식 — triple 만 예외로 따로 센다) */
  G.eqKey = function (e, ordered) {
    const x = e.op === '+' && !ordered ? sortedNums([e.a, e.b]) : [e.a, e.b];
    return `${x[0]}${e.op}${x[1]}=${e.c}`;
  };
  G.eqText = e => `${e.a} ${e.op === '-' ? MINUS : PLUS} ${e.b} = ${e.c}`;
  /* 카드 4장에서 서로 다른 카드 셋(a,b,c)으로 만들 수 있는 식들 */
  G.eqFromCards = function (cards, ops) {
    const out = new Map();
    for (let i = 0; i < cards.length; i++) for (let j = 0; j < cards.length; j++) for (let k = 0; k < cards.length; k++) {
      if (i === j || j === k || i === k) continue;
      if (ops.indexOf('+') >= 0 && cards[i] + cards[j] === cards[k] && i < j) { const e = { a: cards[i], op: '+', b: cards[j], c: cards[k] }; out.set(G.eqKey(e), e); }
      if (ops.indexOf('-') >= 0 && cards[i] - cards[j] === cards[k]) { const e = { a: cards[i], op: '-', b: cards[j], c: cards[k] }; out.set(G.eqKey(e), e); }
    }
    return Array.from(out.values());
  };
  G.eqFromTarget = function (t, ops) {
    const out = new Map();
    for (let a = 1; a <= 9; a++) for (let b = 1; b <= 9; b++) {
      if (ops.indexOf('+') >= 0 && a + b === t && a <= b) { const e = { a, op: '+', b, c: t }; out.set(G.eqKey(e), e); }
      if (ops.indexOf('-') >= 0 && a - b === t) { const e = { a, op: '-', b, c: t }; out.set(G.eqKey(e), e); }
    }
    return Array.from(out.values());
  };
  function cardEq(lv, rng, kind) {
    for (let tr = 0; tr < 500; tr++) {
      if (kind === 'target') {
        const t = R(rng, 2, 9);
        if (lv < 2) {
          /* 카드 트레이(서로 다른 카드 두 장) — 한 장은 한 번만 쓴다 */
          const cards = shuffle(rng, [1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 6), need = 2, ops = ['+', '-'];
          const all = G.eqFromTarget(t, ops).filter(e => {
            const ia = cards.indexOf(e.a), ib = cards.indexOf(e.b);
            return ia >= 0 && ib >= 0 && ia !== ib;
          });
          if (all.length < need) continue;
          const sample = shuffle(rng, all).slice(0, need).map(G.eqText).join(' · ');
          return {
            prompt: L3(`카드 두 장으로 답이 ${josaN(t, '이', '가')} 되는 식을 만들어요. 서로 다른 식을 ${need}개 만들어 봐요`, `Use two cards to make equations whose answer is ${t}. Make ${need} different equations`, `用两张卡片做得数是${t}的算式。做出${need}个不同的算式`),
            answer: need, answerType: 'number', widget: 'g11_cardEq', kind, cards, target: t, ops, need,
            sample, keyFields: ['kind', 'cards', 'target', 'need', 'ops']
          };
        }
        const need = R(rng, 2, 3), ops = pick(rng, [['+', '-'], ['+'], ['-']]);
        const all = G.eqFromTarget(t, ops);
        if (all.length < need + (ops.length > 1 ? 1 : 0)) continue;
        const sample = shuffle(rng, all).slice(0, need).map(G.eqText).join(' · ');
        const opW = ops.length > 1 ? L3('덧셈식이나 뺄셈식', 'addition or subtraction equations', '加法或减法算式') : ops[0] === '+' ? L3('덧셈식', 'addition equations', '加法算式') : L3('뺄셈식', 'subtraction equations', '减法算式');
        return {
          prompt: L3(`1부터 9까지 카드로 답이 ${josaN(t, '이', '가')} 되는 ${opW.ko}을 만들어요. 서로 다른 식을 ${need}개 만들어 봐요`, `Use cards 1 to 9 to make ${opW.en} whose answer is ${t}. Make ${need} different equations`, `用1到9的卡片做得数是${t}的${opW.zh}，做出${need}个不同的算式`),
          answer: need, answerType: 'number', widget: 'g11_cardEq', kind, cards: 'all9', target: t, ops, need,
          sample, keyFields: ['kind', 'cards', 'target', 'need', 'ops']
        };
      }
      if (kind === 'free') {
        const cards = shuffle(rng, [1, 2, 3, 4, 5, 6, 7, 8, 9].concat([1, 2, 3, 4])).slice(0, 4);
        const ops = ['+', '-'], need = lv >= 3 ? 3 : 2;
        const all = G.eqFromCards(cards, ops);
        if (all.length < need || all.length > need + 3) continue;
        const sample = shuffle(rng, all).slice(0, need).map(G.eqText).join(' · ');
        return {
          prompt: L3(`카드 세 장으로 덧셈식이나 뺄셈식을 만들어요. 서로 다른 식을 ${need}개 만들어 봐요`, `Use three of the cards to make addition or subtraction equations. Make ${need} different equations`, `用其中三张卡片做加法或减法算式，做出${need}个不同的算式`),
          answer: need, answerType: 'number', widget: 'g11_cardEq', kind, cards, ops, need,
          sample, keyFields: ['kind', 'cards', 'need', 'ops']
        };
      }
      /* triple — 주머니 속 세 수 a+b=c 로 덧셈 2식(교환) + 뺄셈 2식 */
      const a = R(rng, 1, 7), b = R(rng, 1, 8 - a), c = a + b;
      if (a === b || c > 9) continue;
      const addOnly = lv < 2;
      const eqs = [{ a, op: '+', b, c }, { a: b, op: '+', b: a, c }];
      if (!addOnly) { eqs.push({ a: c, op: '-', b: a, c: b }); eqs.push({ a: c, op: '-', b, c: a }); }
      const need = eqs.length;
      return {
        prompt: addOnly
          ? L3(`주머니 속 세 수: ${a}, ${b}, ${c}. 덧셈식을 ${need}개 만들어요`, `Make ${need} addition equations with the three numbers ${a}, ${b} and ${c}`, `用三个数${a}、${b}、${c}做${need}个加法算式`)
          : L3(`주머니 속 세 수: ${a}, ${b}, ${c}. 덧셈식 2개와 뺄셈식 2개를 만들어요`, `Make 2 addition and 2 subtraction equations with the three numbers ${a}, ${b} and ${c}`, `用三个数${a}、${b}、${c}做2个加法和2个减法算式`),
        answer: need, answerType: 'number', widget: 'g11_cardEq', kind: 'triple',
        cards: shuffle(rng, [a, b, c]), ops: addOnly ? ['+'] : ['+', '-'], need,
        sample: eqs.map(G.eqText).join(' · '), keyFields: ['kind', 'cards', 'need', 'ops']
      };
    }
    throw new Error('cardEq: 생성 실패');
  }
  function purse(lv, rng) {
    const pool = shuffle(rng, ['animal:bear', 'animal:rabbit', 'animal:duck', 'animal:turtle', 'animal:fox', 'animal:deer', 'animal:squirrel']);
    if (lv < 2) {
      const n = R(rng, 2, 9), A = ANI[pool[0]];
      return {
        prompt: L3(`동전은 한 닢에 1원이에요. ${A.ko}의 동전은 모두 얼마일까요?`, `Each coin is 1 won. How much money does the ${A.enS} have?`, `每枚硬币是1元。${A.zh}一共有多少钱？`),
        answer: n, answerType: 'number', widget: 'g11_purse', who: [{ tok: pool[0], n }], needDiff: false, keyFields: ['who']
      };
    }
    for (let t = 0; t < 100; t++) {
      const x = R(rng, 1, 8), y = R(rng, 1, 8);
      if (x + y > 9 || x === y) continue;
      const A = ANI[pool[0]], B = ANI[pool[1]], needDiff = lv >= 3;
      return {
        prompt: needDiff
          ? L3(`동전은 한 닢에 1원이에요. 두 친구의 돈을 합하면 얼마이고, 차는 얼마일까요?`, `Each coin is 1 won. How much do the two friends have together, and what is the difference?`, `每枚硬币是1元。两个朋友的钱合起来是多少，相差多少？`)
          : L3(`동전은 한 닢에 1원이에요. ${josa(A.ko, '과', '와')} ${B.ko}의 돈을 합하면 얼마일까요?`, `Each coin is 1 won. How much money do the ${A.enS} and the ${B.enS} have together?`, `每枚硬币是1元。${A.zh}和${B.zh}的钱合起来是多少？`),
        answer: x + y, answerType: 'number', widget: 'g11_purse',
        who: [{ tok: pool[0], n: x }, { tok: pool[1], n: y }], needDiff, diff: Math.abs(x - y), keyFields: ['who', 'needDiff']
      };
    }
    throw new Error('purse: 생성 실패');
  }
  NM_TGEN['nlg11_make'] = function (params, rng) {
    const mode = (params && params.mode) || 'cardeq', lv = (params && params.lv) || 1;
    if (mode === 'purse') return purse(lv, rng);
    return cardEq(lv, rng, (params && params.kind) || 'target');
  };

  /* ==========================================================
     G1-12 — 세 수·네 수 가르기·모으기 · 수 묶기 · 양팔저울 식
     ========================================================== */

  /* 합이 w 인 parts 개의 수(각 min 이상) 비내림차순 목록 */
  G.partitions = function (w, parts, min) {
    const out = [];
    (function rec(left, k, lo, cur) {
      if (k === 1) { if (left >= lo) out.push(cur.concat(left)); return; }
      for (let v = lo; v * k <= left; v++) rec(left - v, k - 1, v, cur.concat(v));
    })(w, parts, min, []);
    return out;
  };
  /* 틀 좌표(0~100 x, 0~80 y) — 화면과 인쇄가 같이 쓴다. cells[i] 는 입력칸 중심, whole 은 전체 수 자리 */
  const PF = {
    ladybug: { 2: [[32, 48], [68, 48]], 3: [[30, 42], [70, 42], [50, 64]], 4: [[30, 38], [70, 38], [32, 62], [68, 62]], whole: [50, 12] },
    plane:   { 2: [[30, 62], [70, 62]], 3: [[18, 62], [50, 62], [82, 62]], 4: [[13, 62], [38, 62], [62, 62], [87, 62]], whole: [50, 14] },
    gather:  { 2: [[30, 12], [70, 12]], 3: [[18, 12], [50, 12], [82, 12]], 4: [[13, 12], [38, 12], [62, 12], [87, 12]], whole: [50, 64] },
    balloons: { 2: [[32, 20], [68, 20]], 3: [[20, 20], [50, 20], [80, 20]], 4: [[13, 20], [38, 20], [62, 20], [87, 20]], whole: [50, 64] },
    triangle: { 3: [[50, 15], [17, 65], [83, 65]], whole: [50, 52] },
    diamond: { 4: [[50, 12], [84, 40], [50, 68], [16, 40]], whole: [50, 40] },
    tree:    { 2: [[30, 62], [70, 62]], 3: [[20, 62], [50, 62], [80, 62]], 4: [[13, 62], [38, 62], [62, 62], [87, 62]], whole: [50, 12] }
  };
  G.PF = PF;
  const ART_DIR = { ladybug: 'split', plane: 'split', tree: 'split', gather: 'join', balloons: 'join', triangle: 'join', diamond: 'join' };
  G.ART_DIR = ART_DIR;

  /* 가르기·모으기 틀 HTML — 화면(X='nm-g1012')과 인쇄(X='nm-nl-g1012')가 같이 쓴다.
     cellFn(i) 가 칸 i 의 안쪽 HTML, wholeFn() 이 전체 수 자리의 안쪽 HTML. 도형은 전부 직접 그린 원본 SVG. */
  G.partsFrame = function (X, p, cellFn, wholeFn) {
    const art = p.art, n = p.parts, lay = PF[art], pos = lay[n], wp = lay.whole;
    const B = `class="${X}-pf-b"`, H = `class="${X}-pf-h"`, Ln = `class="${X}-pf-l"`;
    let svg = '';
    if (art === 'ladybug') {
      svg = `<ellipse ${B} cx="50" cy="46" rx="37" ry="31"/><path ${Ln} d="M50 23 L50 77"/>` +
        `<path ${Ln} d="M44 4 C41 2 39 2 37 3 M56 4 C59 2 61 2 63 3"/><circle ${H} cx="50" cy="12" r="11"/>`;
    } else if (art === 'plane') {
      svg = `<polygon ${B} points="22,15 6,28 13,29 42,19"/><polygon ${B} points="78,15 94,28 87,29 58,19"/>` +
        `<polygon ${B} points="72,8 80,1 83,10"/><ellipse ${B} cx="50" cy="14" rx="27" ry="10"/>`;
      pos.forEach(c => {
        const x = c[0], rx = n === 4 ? 11 : 13;
        svg += `<path ${Ln} d="M50 24 L${x} 33"/><ellipse ${B} cx="${x}" cy="41" rx="${rx}" ry="8"/>` +
          `<path ${Ln} d="M${x - rx + 2} 45 L${x} 55 M${x + rx - 2} 45 L${x} 55"/>`;
      });
    } else if (art === 'gather') {
      pos.forEach(c => { svg += `<path ${Ln} d="M${c[0]} 21 L50 52"/>`; });
      svg += `<path ${Ln} d="M44 46 L50 53 L57 47"/><rect ${B} x="33" y="54" width="34" height="23" rx="10"/>`;
    } else if (art === 'balloons') {
      pos.forEach(c => { svg += `<path ${Ln} d="M${c[0]} 34 C${c[0]} 44 50 46 50 54"/><ellipse ${B} cx="${c[0]}" cy="20" rx="11" ry="13"/>`; });
      let st = '';
      for (let k = 0; k < 10; k++) { const r = k % 2 ? 7 : 15, a = -Math.PI / 2 + k * Math.PI / 5; st += `${(50 + r * Math.cos(a)).toFixed(1)},${(65 + r * Math.sin(a)).toFixed(1)} `; }
      svg += `<polygon ${B} points="${st.trim()}"/>`;
    } else if (art === 'triangle') {
      svg = `<polygon ${B} points="50,3 96,76 4,76"/><circle ${H} cx="50" cy="52" r="13"/>`;
    } else if (art === 'diamond') {
      svg = `<polygon ${B} points="50,2 97,40 50,78 3,40"/><circle ${H} cx="50" cy="40" r="13"/>`;
    } else {
      svg = `<path ${Ln} d="M50 23 L50 36"/>`;
      pos.forEach(c => { svg += `<path ${Ln} d="M50 36 C50 47 ${c[0]} 45 ${c[0]} 54"/>`; });
      svg += `<circle ${B} cx="50" cy="13" r="11"/>`;
    }
    const at = c => `left:${c[0]}%;top:${(c[1] / 80 * 100).toFixed(2)}%`;
    const cells = pos.map((c, i) => `<span class="${X}-pf-cell" data-i="${i}" style="${at(c)}">${cellFn(i)}</span>`).join('');
    const whole = `<span class="${X}-pf-whole" style="${at(wp)}">${wholeFn()}</span>`;
    return `<div class="${X}-pf ${X}-pf-${art} ${X}-skin-${(p.skin | 0) % 6}"><svg class="${X}-pf-svg" viewBox="0 0 100 80" aria-hidden="true">${svg}</svg>${cells}${whole}</div>`;
  };

  function partsProblem(lv, rng, P) {
    const art = P.art, dir = ART_DIR[art];
    for (let t = 0; t < 600; t++) {
      const parts = P.partsAny ? pick(rng, P.partsAny) : P.parts;
      let w;
      if (P.equal) w = parts === 2 ? pick(rng, [2, 4, 6, 8]) : pick(rng, [3, 6, 9]);
      else w = R(rng, P.wmin, P.wmax);
      const min = 1;
      const all = G.partitions(w, parts, min);
      if (!all.length) continue;
      if (P.equal && !all.some(x => x.every(v => v === x[0]))) continue;
      let distinct = 1;
      if (P.distinct) {
        const cap = Math.min(P.distinct === 'all' ? 4 : P.distinct, all.length);
        if (cap < 2) continue;
        distinct = R(rng, 2, cap);
      }
      let given = {};
      if (P.given && !P.equal && distinct === 1) {
        const base = pick(rng, all), order = shuffle(rng, base);
        const idx = shuffle(rng, order.map((_, i) => i)).slice(0, P.given);
        idx.forEach(i => { given[i] = order[i]; });
      } else if (P.equal) {
        /* 같은 수 모으기 — 칸은 모두 빈칸, 한 칸에 쓰면 나머지가 따라 채워진다 */
      }
      const nameN = { 2: L3('두', 'two', '两'), 3: L3('세', 'three', '三'), 4: L3('네', 'four', '四') }[parts];
      let prompt;
      if (P.equal) prompt = L3(`${josaN(w, '이', '가')} 되도록 같은 수 ${parts}개를 모아요`, `Gather ${parts} equal numbers to make ${w}`, `把${parts}个相同的数合起来得到${w}`);
      else if (distinct > 1) prompt = L3(`${josaN(w, '을', '를')} ${nameN.ko} 수로 가르는 서로 다른 방법을 ${distinct}가지 찾아요`, `Find ${distinct} different ways to split ${w} into ${nameN.en} numbers`, `把${w}分成${nameN.zh}个数，找出${distinct}种不同的分法`);
      else if (dir === 'split') prompt = L3(`${josaN(w, '을', '를')} ${nameN.ko} 수로 갈라 봐요. 빈 칸에 수를 써요`, `Split ${w} into ${nameN.en} numbers. Write the numbers in the blanks`, `把${w}分成${nameN.zh}个数，在空格里写数`);
      else prompt = L3(`${nameN.ko} 수를 모아 ${josaN(w, '이', '가')} 되게 해요. 빈 칸에 수를 써요`, `Gather ${nameN.en} numbers to make ${w}. Write the numbers in the blanks`, `把${nameN.zh}个数合起来得到${w}，在空格里写数`);
      return {
        prompt, answer: distinct > 1 ? distinct : w, answerType: 'number', widget: 'g12_partsFill',
        art, dir, whole: w, parts, given, equal: !!P.equal, distinct, min, skin: art === 'ladybug' ? pick(rng, [0, 1, 4, 5]) : R(rng, 0, 5),
        keyFields: ['art', 'whole', 'parts', 'dir', 'given', 'equal', 'distinct', 'skin']
      };
    }
    throw new Error('parts: 생성 실패');
  }
  NM_TGEN['nlg12_parts'] = function (params, rng) {
    const P = Object.assign({ art: 'ladybug', parts: 3, wmin: 4, wmax: 6 }, params || {});
    if (Array.isArray(P.arts)) P.art = pick(rng, P.arts);
    return partsProblem((params && params.lv) || 1, rng, P);
  };

  /* ── NL55 nlg12_gridgroup — 수 묶기 ── */
  function neighbors8(n) {
    const nb = [];
    for (let i = 0; i < n * n; i++) {
      const r = Math.floor(i / n), c = i % n, a = [];
      for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
        if (!dr && !dc) continue;
        const rr = r + dr, cc = c + dc;
        if (rr >= 0 && rr < n && cc >= 0 && cc < n) a.push(rr * n + cc);
      }
      nb.push(a);
    }
    return nb;
  }
  G.connectedSubsets = function (n, s) {
    const nb = neighbors8(n);
    let level = new Map();
    for (let i = 0; i < n * n; i++) level.set(String(i), [i]);
    for (let size = 1; size < s; size++) {
      const next = new Map();
      level.forEach(set => {
        set.forEach(cell => nb[cell].forEach(x => {
          if (set.indexOf(x) >= 0) return;
          const ns = set.concat(x).sort((p, q) => p - q);
          next.set(ns.join(','), ns);
        }));
      });
      level = next;
    }
    return Array.from(level.values());
  };
  G.findDisjoint = function (groups, need) {
    const used = new Set(), picked = [];
    let found = null;
    (function rec(start) {
      if (found) return;
      if (picked.length === need) { found = picked.slice(); return; }
      for (let i = start; i < groups.length; i++) {
        if (groups[i].some(c => used.has(c))) continue;
        groups[i].forEach(c => used.add(c)); picked.push(groups[i]);
        rec(i + 1);
        picked.pop(); groups[i].forEach(c => used.delete(c));
        if (found) return;
      }
    })(0);
    return found;
  };
  const SUBSET_CACHE = {};
  function gridGroup(lv, rng, P) {
    const n = P.n, size = P.size, need = P.need;
    const key = n + ':' + size;
    const subs = SUBSET_CACHE[key] || (SUBSET_CACHE[key] = G.connectedSubsets(n, size));
    const nb = neighbors8(n);
    for (let tr = 0; tr < 400; tr++) {
      const target = R(rng, P.tmin, P.tmax);
      const grid = new Array(n * n).fill(-1);
      /* 정답 묶음 need 개를 겹치지 않게 심는다 */
      let ok = true;
      for (let g = 0; g < need && ok; g++) {
        let placed = false;
        for (let at = 0; at < 60 && !placed; at++) {
          const start = R(rng, 0, n * n - 1);
          if (grid[start] !== -1) continue;
          const cur = [start];
          while (cur.length < size) {
            const cand = [];
            cur.forEach(c => nb[c].forEach(x => { if (grid[x] === -1 && cur.indexOf(x) < 0 && cand.indexOf(x) < 0) cand.push(x); }));
            if (!cand.length) break;
            cur.push(pick(rng, cand));
          }
          if (cur.length < size) continue;
          /* target 을 size 개 칸에 나눠 담는다(칸 값 0~6, 0 은 레벨1 에서 드물게) */
          const minV = P.zeros ? 0 : 1;
          const vals = new Array(size).fill(minV);
          let left = target - minV * size;
          if (left < 0) continue;
          let guard = 0;
          while (left > 0 && guard++ < 200) { const i = R(rng, 0, size - 1); if (vals[i] < 6) { vals[i]++; left--; } }
          if (left > 0) continue;
          shuffle(rng, vals).forEach((v, i) => { grid[cur[i]] = v; });
          placed = true;
        }
        if (!placed) ok = false;
      }
      if (!ok) continue;
      let zeros = grid.filter(v => v === 0).length;
      for (let i = 0; i < grid.length; i++) if (grid[i] === -1) {
        let v = R(rng, P.zeros ? 0 : 1, 5);
        if (v === 0) { if (zeros >= (P.zeros || 0)) v = R(rng, 1, 5); else zeros++; }
        grid[i] = v;
      }
      const valid = subs.filter(g => g.reduce((s, c) => s + grid[c], 0) === target);
      if (valid.length / subs.length > 0.3) continue;
      const sol = G.findDisjoint(valid, need);
      if (!sol) continue;
      const rows = []; for (let r = 0; r < n; r++) rows.push(grid.slice(r * n, r * n + n));
      return {
        prompt: L3(`이웃한 ${size === 3 ? '세' : '네'} 수의 합이 ${josaN(target, '이', '가')} 되게 묶어요. ${need}묶음을 찾아요`, `Group ${size === 3 ? 'three' : 'four'} neighbouring numbers that add up to ${target}. Find ${need} groups`, `把相邻的${size === 3 ? '三' : '四'}个数圈起来，使它们的和是${target}。找出${need}组`),
        answer: need, answerType: 'number', widget: 'g12_gridGroup',
        grid: rows, size, target, need, solutionGroups: sol.map(g => g.map(c => [Math.floor(c / n) + 1, (c % n) + 1])),
        keyFields: ['grid', 'size', 'target', 'need']
      };
    }
    throw new Error('gridGroup: 생성 실패');
  }
  NM_TGEN['nlg12_gridgroup'] = function (params, rng) {
    const P = Object.assign({ n: 4, size: 3, need: 2, tmin: 7, tmax: 9, zeros: 0 }, params || {});
    return gridGroup(P.lv || 1, rng, P);
  };

  /* ── NL56 nlg12_eqscale — 양팔저울 식(＋/－ 고르기, 유일해) ── */
  G.panVal = function (p, op) { const o = p.op || op; return o === '+' ? p.a + p.b : (p.a > p.b ? p.a - p.b : null); };
  G.eqScaleSolutions = function (pans) {
    const blanks = []; pans.forEach((p, i) => { if (!p.op) blanks.push(i); });
    const sols = [];
    const total = 1 << blanks.length;
    for (let m = 0; m < total; m++) {
      const ops = pans.map(p => p.op);
      blanks.forEach((bi, k) => { ops[bi] = (m >> k) & 1 ? '+' : '-'; });
      const v = pans.map((p, i) => G.panVal({ a: p.a, b: p.b }, ops[i]));
      if (v.every(x => x !== null) && v[0] === v[1] && v[0] <= 9) sols.push(ops.slice());
    }
    return sols;
  };
  NM_TGEN['nlg12_eqscale'] = function (params, rng) {
    const both = !!(params && params.both);
    for (let t = 0; t < 2000; t++) {
      const mk = () => ({ a: R(rng, 1, 9), b: R(rng, 1, 9) });
      const L = mk(), Rr = mk();
      if (both) { L.op = null; Rr.op = null; }
      else {
        L.op = null;
        Rr.op = pick(rng, ['+', '-']);
        if (Rr.op === '-' && Rr.a <= Rr.b) continue;
        if (Rr.op === '+' && Rr.a + Rr.b > 9) continue;
      }
      const pans = [L, Rr];
      const sols = G.eqScaleSolutions(pans);
      if (sols.length !== 1) continue;
      const ops = sols[0];
      const bits = []; pans.forEach((p, i) => { if (!p.op) bits.push(ops[i] === '+' ? 1 : 0); });
      const answer = bits.length === 1 ? bits[0] : bits[0] * 2 + bits[1];
      return {
        prompt: L3('양쪽 식의 결과가 같아지게 ＋ 또는 －를 골라요', 'Pick + or − so both sides come out equal', '选＋或－，让两边的结果一样'),
        answer, answerType: 'number', widget: 'g12_eqScale',
        pans: pans.map(p => ({ a: p.a, b: p.b, op: p.op })), sol: bits,
        value: G.panVal({ a: L.a, b: L.b }, ops[0]),
        keyFields: ['pans']
      };
    }
    throw new Error('eqScale: 생성 실패');
  };
})();
