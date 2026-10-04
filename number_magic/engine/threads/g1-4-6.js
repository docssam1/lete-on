/* ============================================================
   유아 교재 G1-4·5·6호 생성기(NM_TGEN) — 계약은 engine/threads/nl.js 머리말과 같다.
   rng(R/pick/shuffle) 만 쓴다 — Math.random 금지. 같은 씨앗이면 같은 문항(인쇄·재현).
   스레드 NL27~NL36 이 쓰는 생성기 10개:
     g46_numset    NL27 홀짝·조건 수       parity pick count who lock
     g46_cellcode  NL28 도형수             read make make2 pickMax
     g46_ancient   NL29 고대의 숫자        match read build mix
     g46_seq       NL30 수 채우기          hop rule4 path
     g46_ordinal   NL31 양의 수와 순서수   qtyOrd fix
     g46_seat      NL32 자리와 줄          seat around convert behind
     g46_rank      NL33 순위·그래프·규칙   rank graph rule
     g46_machine   NL34 수 기계·주고받기   chain trade
     g46_split     NL35 가르기 그리기      splitDraw (5 겉모습)
     g46_addsub    NL36 모형·남기기·덧셈식  bondNum bondMax leave addEq sameSum pairPick pairSum exprMatch objMatch grid
   ⚠️ 장면·문구는 전부 창작(이모지·직접 그린 도형) — 라이선스 교재 삽화/지문을 쓰지 않는다.
   ⚠️ 위젯 답 계약: 위젯은 onAnswer(숫자 하나)만 부르고 호스트가 +val===problem.answer 로 채점한다.
        열린 활동은 위젯이 안에서 판정해 맞으면 answer, 틀리면 -1. 보기 고르기는 answer = 1부터 센 보기 번호.
   ============================================================ */
(function () {
  'use strict';
  const { R, pick, shuffle } = NM_RNG;
  const T = (ko, en, zh) => ({ ko, en, zh });

  /* ── 공용 도구 ─────────────────────────────────────────── */
  /* 받침 유무로 조사 고르기(nl.js 와 같은 규칙) */
  function josa(w, withB, noB) {
    const c = String(w).charCodeAt(String(w).length - 1);
    const b = c >= 0xAC00 && c <= 0xD7A3 && ((c - 0xAC00) % 28) !== 0;
    return w + (b ? withB : noB);
  }
  /* 숫자를 우리말로 읽을 때 받침이 있는 수: 0 영 · 1 일 · 3 삼 · 6 육 · 7 칠 · 8 팔 */
  const NUM_BATCHIM = { 0: 1, 1: 1, 3: 1, 6: 1, 7: 1, 8: 1 };
  function nj(n, withB, noB) { return n + (NUM_BATCHIM[n] ? withB : noB); }
  /* 서수: 첫째~아홉째 / first~ninth / 第n */
  const ORD_KO = ['', '첫째', '둘째', '셋째', '넷째', '다섯째', '여섯째', '일곱째', '여덟째', '아홉째'];
  const ORD_EN = ['', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth'];
  const ord = n => T(ORD_KO[n] || n + '째', ORD_EN[n] || n + 'th', '第' + n);
  /* 보기 숫자 3개: 정답 + 이웃 수 함정(범위 안에서만). 순서는 rng 로 섞는다. */
  function chips(rng, ans, lo, hi, n) {
    n = n || 3;
    const set = [ans];
    const near = shuffle(rng, [ans - 2, ans - 1, ans + 1, ans + 2].filter(v => v >= lo && v <= hi && v !== ans));
    near.forEach(v => { if (set.length < n) set.push(v); });
    for (let v = lo; v <= hi && set.length < n; v++) if (!set.includes(v)) set.push(v);
    return shuffle(rng, set);
  }
  const range = (a, b) => { const o = []; for (let i = a; i <= b; i++) o.push(i); return o; };
  const sum = a => a.reduce((x, y) => x + y, 0);

  /* 세는 물건 16종(object-art) — 토큰과 3언어 이름(문항 문구용) */
  const TOK = {
    '🍎': ['사과', 'apples', '苹果'], '🐤': ['병아리', 'chicks', '小鸡'], '⭐': ['별', 'stars', '星星'], '🎈': ['풍선', 'balloons', '气球'],
    '🐟': ['물고기', 'fish', '鱼'], '🦋': ['나비', 'butterflies', '蝴蝶'], '🌼': ['꽃', 'flowers', '花'], '🍓': ['딸기', 'strawberries', '草莓'],
    '🍪': ['쿠키', 'cookies', '饼干'], '🪙': ['동전', 'coins', '硬币'], '⚫': ['바둑돌', 'stones', '棋子'], '🍌': ['바나나', 'bananas', '香蕉'],
    '⚽': ['축구공', 'footballs', '足球'], '🏀': ['농구공', 'basketballs', '篮球'], '🍬': ['사탕', 'candies', '糖果'], '🐞': ['무당벌레', 'ladybugs', '瓢虫']
  };
  const TOK16 = Object.keys(TOK);
  const tn = (e, i) => (TOK[e] || ['것', 'items', '个'])[i];

  /* 동물(animal-art) 3언어 이름 */
  const ANI = {
    'animal:rabbit': ['토끼', 'rabbit', '兔子'], 'animal:turtle': ['거북이', 'turtle', '乌龟'], 'animal:bear': ['곰', 'bear', '熊'],
    'animal:fox': ['여우', 'fox', '狐狸'], 'animal:raccoon': ['너구리', 'raccoon', '浣熊'], 'animal:squirrel': ['다람쥐', 'squirrel', '松鼠'],
    'animal:deer': ['사슴', 'deer', '鹿'], 'animal:duck': ['오리', 'duck', '鸭子'], 'animal:tiger': ['호랑이', 'tiger', '老虎']
  };
  const ANIMALS = Object.keys(ANI);

  /* 사람 그림(줄 서기) */
  const FRIENDS = ['🧒', '👧', '👦', '🧑', '👩', '👨', '🧓', '👴', '👵'];

  function base(prompt, widget, answer, extra) {
    return Object.assign({ prompt, answer, answerType: 'number', widget }, extra);
  }

  /* ============================================================
     NL27  g46_numset — 홀수·짝수와 조건에 맞는 수
     ============================================================ */
  const PAR = { odd: ['홀수', 'odd', '奇数'], even: ['짝수', 'even', '偶数'] };
  /* 조건 → 말. 항상 '…수'로 끝나서 조사는 를/는 로 고정된다. */
  function condText(c) {
    const w = c.parity ? PAR[c.parity] : ['수', 'numbers', '数'];
    const both = c.gt != null && c.lt != null;
    const ko = both ? `${c.gt}보다 크고 ${c.lt}보다 작은 ${w[0]}` : c.gt != null ? `${c.gt}보다 큰 ${w[0]}` : c.lt != null ? `${c.lt}보다 작은 ${w[0]}` : w[0];
    const enP = c.parity ? PAR[c.parity][1] + ' numbers' : 'numbers';
    const en = both ? `${enP} greater than ${c.gt} and less than ${c.lt}` : c.gt != null ? `${enP} greater than ${c.gt}` : c.lt != null ? `${enP} less than ${c.lt}` : enP;
    const zh = both ? `比${c.gt}大、比${c.lt}小的${w[2]}` : c.gt != null ? `比${c.gt}大的${w[2]}` : c.lt != null ? `比${c.lt}小的${w[2]}` : w[2];
    return T(ko, en, zh);
  }
  const condOk = (c, v) => (c.gt == null || v > c.gt) && (c.lt == null || v < c.lt) && (!c.parity || (c.parity === 'odd' ? v % 2 === 1 : v % 2 === 0));
  function clueText(k) {
    if (k.k === 'gt') return T(`${k.n}보다 커요`, `It is greater than ${k.n}`, `比${k.n}大`);
    if (k.k === 'lt') return T(`${k.n}보다 작아요`, `It is less than ${k.n}`, `比${k.n}小`);
    if (k.k === 'odd') return T('홀수예요', 'It is odd', '是奇数');
    if (k.k === 'even') return T('짝수예요', 'It is even', '是偶数');
    return T(`${nj(k.n, '이', '가')} 아니에요`, `It is not ${k.n}`, `不是${k.n}`);
  }
  const clueOk = (k, v) => k.k === 'gt' ? v > k.n : k.k === 'lt' ? v < k.n : k.k === 'odd' ? v % 2 === 1 : k.k === 'even' ? v % 2 === 0 : v !== k.n;
  const joinT = (arr, ko, en, zh) => T(arr.map(x => x.ko).join(ko), arr.map(x => x.en).join(en), arr.map(x => x.zh).join(zh));

  /* 단서로 비밀 수가 하나로 정해지는지 — 단서를 하나씩 더하며 후보가 줄 때만 채택 */
  function buildClues(rng, tiles, target) {
    const lo = tiles[0], hi = tiles[tiles.length - 1], pool = [];
    for (let n = lo; n < target; n++) pool.push({ k: 'gt', n });
    for (let n = target + 1; n <= hi; n++) pool.push({ k: 'lt', n });
    pool.push({ k: target % 2 ? 'odd' : 'even' });
    tiles.forEach(v => { if (v !== target) pool.push({ k: 'not', n: v }); });
    for (let tries = 0; tries < 80; tries++) {
      let cand = tiles.slice(); const out = [];
      for (const c of shuffle(rng, pool.slice())) {
        const next = cand.filter(v => clueOk(c, v));
        if (next.length < cand.length) { out.push(c); cand = next; }
        if (cand.length === 1 || out.length > 3) break;
      }
      if (cand.length === 1 && out.length >= 2 && out.length <= 3) return out;
    }
    return null;
  }

  NM_TGEN['g46_numset'] = function (params, rng) {
    const mode = (params && params.mode) || 'pick';
    const lv = (params && params.level) || 'main';
    const practice = lv === 'practice', max = practice ? 5 : 9;

    /* ---- parity: 둘씩 짝 짓기 — 짝이 다 맞으면 짝수, 하나 남으면 홀수 ---- */
    if (mode === 'parity') {
      const n = R(rng, practice ? 1 : 0, max);
      const e = pick(rng, ['🍎', '⭐', '🎈', '🐤', '🍓', '🍪', '🌼', '🐞']);
      const ev = { t: T('짝수', 'Even', '偶数') }, od = { t: T('홀수', 'Odd', '奇数') };
      const choices = shuffle(rng, [ev, od]);
      const answer = choices.findIndex(c => (n % 2 === 0) === (c === ev)) + 1;
      return base(T('둘씩 짝을 지어 봐요. 짝이 모두 맞으면 짝수, 하나가 남으면 홀수예요. 이 수는 어느 쪽일까요?',
        'Pair them up two by two. Even means every one has a partner; odd means one is left over. Which is it?',
        '两个两个配对。都配上对是偶数，剩下一个是奇数。这个数是哪一种？'),
      'pickCard', answer, {
        stemParts: [{ k: 'pairs', n, e }], choices, keyFields: ['stemParts'],
        printAsk: T('둘씩 짝을 지어 보고, 짝수인지 홀수인지 ○표 하세요.', 'Pair them up. Circle even or odd.', '两个两个配对，圈出偶数或奇数。')
      });
    }

    /* ---- who · lock: 단서로 비밀 수 하나 찾기 ---- */
    if (mode === 'who' || mode === 'lock') {
      const tiles = mode === 'lock' ? range(1, practice ? 5 : 9) : range(practice ? 1 : 0, max);
      let target, clues = null;
      for (let t = 0; t < 40 && !clues; t++) { target = pick(rng, tiles); clues = buildClues(rng, tiles, target); }
      if (!clues) { target = tiles[tiles.length - 1]; clues = [{ k: 'gt', n: target - 1 }, { k: 'odd' }].slice(0, tiles.length > 2 ? 2 : 1); }
      const said = joinT(clues.map(clueText), '. ', '. ', '。');
      const lock = mode === 'lock';
      return base(lock
        ? T(`자물쇠 비밀번호 한 자리를 찾아요! ${said.ko}. 어떤 숫자일까요? 숫자를 콕!`, `Find one digit of the lock code! ${said.en}. Which digit? Tap it!`, `找出密码锁的一位数字！${said.zh}。是几？点一点！`)
        : T(`비밀 수를 찾아요! ${said.ko}. 어떤 수일까요? 그 수를 콕!`, `Find the secret number! ${said.en}. Which number? Tap it!`, `找出秘密数字！${said.zh}。是几？点一点！`),
      'tilePick', target, {
        interaction: 'single', theme: lock ? 'lock' : 'tile', tiles, clues, ok: [target], keyFields: ['tiles', 'clues', 'interaction', 'theme'],
        clueText: clues.map(clueText),
        printAsk: lock ? T(`${said.ko}. 비밀번호 한 자리에 ○표 하세요.`, `${said.en}. Circle the digit.`, `${said.zh}。圈出这位数字。`)
          : T(`${said.ko}. 비밀 수에 ○표 하세요.`, `${said.en}. Circle the secret number.`, `${said.zh}。圈出秘密数字。`)
      });
    }

    /* ---- pick · count: 조건에 맞는 수 ---- */
    const windows = practice ? [[0, 5], [1, 5]] : [[0, 9], [1, 9], [2, 9], [0, 7]];
    const conds = [];
    ['odd', 'even'].forEach(p => conds.push({ parity: p }));
    for (let n = 0; n <= max - 1; n++) { conds.push({ gt: n }); }
    for (let n = 2; n <= max; n++) { conds.push({ lt: n }); }
    if (practice) {
      for (let n = 0; n <= 3; n++) ['odd', 'even'].forEach(p => conds.push({ gt: n, parity: p }));
      for (let n = 3; n <= 5; n++) ['odd', 'even'].forEach(p => conds.push({ lt: n, parity: p }));
    }
    if (!practice) {
      for (let n = 0; n <= 6; n += 1) ['odd', 'even'].forEach(p => { conds.push({ gt: n, parity: p }); });
      for (let n = 3; n <= 9; n += 1) ['odd', 'even'].forEach(p => { conds.push({ lt: n, parity: p }); });
      for (let a = 0; a <= 5; a++) for (let b = a + 3; b <= 9; b++) conds.push({ gt: a, lt: b });
    }
    for (let tries = 0; tries < 200; tries++) {
      const w = pick(rng, windows), tiles = range(w[0], w[1]), c = pick(rng, conds);
      const ok = tiles.filter(v => condOk(c, v));
      if (mode === 'pick' ? (ok.length < 1 || ok.length > tiles.length - 2) : (ok.length < 1 || ok.length > 6)) continue;
      const cond = condText(c);
      if (mode === 'count') {
        return base(T(`${cond.ko}는 모두 몇 개일까요? 타일을 눌러 표시해 보세요`, `How many are ${cond.en}? Tap the tiles to mark them, then count`, `${cond.zh}一共有几个？点一点方块做记号再数`),
          'tilePick', ok.length, {
            interaction: 'count', theme: 'tile', tiles, cond: c, ok, chips: chips(rng, ok.length, 1, 6), keyFields: ['tiles', 'cond', 'interaction'],
            printAsk: T(`${cond.ko}에 ○표 하고, 모두 몇 개인지 쓰세요.`, `Circle the ${cond.en}, then write how many.`, `圈出${cond.zh}，再写出一共有几个。`)
          });
      }
      return base(T(`${cond.ko}를 모두 눌러요`, `Tap all the ${cond.en}`, `点出所有${cond.zh}`),
        'tilePick', ok.length, {
          interaction: 'multi', theme: 'tile', tiles, cond: c, ok, keyFields: ['tiles', 'cond', 'interaction'],
          printAsk: T(`${cond.ko}를 모두 찾아 ○표 하세요.`, `Circle all the ${cond.en}.`, `圈出所有${cond.zh}。`)
        });
    }
    /* 여기까지 못 온다(조건이 넓다) — 안전장치 */
    return base(T('홀수를 모두 눌러요', 'Tap all the odd numbers', '点出所有奇数'), 'tilePick', 3, { interaction: 'multi', theme: 'tile', tiles: range(0, 5), cond: { parity: 'odd' }, ok: [1, 3, 5], keyFields: ['tiles', 'cond'] });
  };

  /* ============================================================
     NL28  g46_cellcode — 도형수: 칸마다 정해진 값의 합이 수
     ============================================================ */
  function cellSubsets(vals, maxSum) {
    const out = [], n = vals.length;
    for (let m = 1; m < (1 << n) - 1; m++) {      /* 전부 켠 것(합 10)은 뺀다 */
      const lit = []; for (let i = 0; i < n; i++) if (m & (1 << i)) lit.push(i);
      const s = sum(lit.map(i => vals[i]));
      if (s <= maxSum) out.push({ lit, s });
    }
    return out;
  }
  NM_TGEN['g46_cellcode'] = function (params, rng) {
    let mode = (params && params.mode) || 'read';
    const lv = (params && params.level) || 'main';
    let vertical = !!(params && params.layout === 'v');
    if (mode === 'mixv') { mode = pick(rng, ['read', 'make', 'pickMax']); vertical = true; }
    if (mode === 'make2' && !(params && params.layout)) vertical = R(rng, 0, 1) === 1;
    const practice = lv === 'practice', maxSum = practice ? 5 : 9;
    const layout = vertical ? { cols: 1, rows: 4 } : { cols: 2, rows: 2 };
    const vals = vertical ? [4, 3, 2, 1] : shuffle(rng, [1, 2, 3, 4]);   /* 세로는 아래부터 1·2·3·4 */
    const subs = cellSubsets(vals, maxSum);
    const legend = vals.map((v, i) => ({ lit: [i], n: v })).sort((a, b) => a.n - b.n);
    const common = { layout, vals, showVals: practice, legend, keyFields: ['layout', 'vals', 'lit', 'target', 'figs', 'interaction'] };
    const how = T('칸마다 정해진 수가 있어요. ○가 있는 칸의 수를 모두 더해요.', 'Each box has its own value. Add the values of the boxes that have a circle.', '每个格子有自己的数。把有圆圈的格子的数加起来。');

    if (mode === 'make' || mode === 'make2') {
      const lo = mode === 'make2' ? 3 : 1, hi = mode === 'make2' ? 7 : maxSum;
      const target = R(rng, lo, hi);
      const two = mode === 'make2';
      return base(T(`${how.ko} ${nj(target, '을', '를')} ${two ? '서로 다른 두 가지 방법으로 ' : ''}나타내요. 칸을 눌러 ○를 놓아요`,
        `${how.en} Show ${target}${two ? ' in two different ways' : ''}. Tap boxes to place circles.`,
        `${how.zh}用圆圈表示${target}${two ? '，想出两种不同的方法' : ''}。点格子放圆圈。`),
      'cellCode', target, Object.assign({}, common, {
        interaction: two ? 'make2' : 'make', target,
        printAsk: T(`${nj(target, '을', '를')} ${two ? '서로 다른 두 가지 방법으로 ' : ''}나타내도록 ○를 그려요.`, `Draw circles to show ${target}${two ? ' in two different ways' : ''}.`, `画圆圈表示${target}${two ? '，要画出两种不同的方法' : ''}。`)
      }));
    }
    if (mode === 'pickMax') {
      const pool = shuffle(rng, subs.slice()), figs = [], seen = new Set();
      for (const s of pool) { if (!seen.has(s.s) && figs.length < 4) { seen.add(s.s); figs.push(s); } }
      const top = Math.max.apply(null, figs.map(f => f.s));
      return base(T('칸마다 정해진 수의 합이 그림이 나타내는 수예요. 가장 큰 수를 나타내는 그림을 눌러요', 'Add the values of the circled boxes to read each picture. Tap the picture with the biggest number.', '把有圆圈的格子的数加起来就是图表示的数。点出表示最大数的图。'),
        'cellCode', figs.findIndex(f => f.s === top) + 1, Object.assign({}, common, {
          interaction: 'pickMax', figs: figs.map(f => ({ lit: f.lit })), showVals: false,
          printAsk: T('가장 큰 수를 나타내는 그림에 ○표 하세요.', 'Circle the picture that shows the biggest number.', '圈出表示最大数的图。')
        }));
    }
    const s = pick(rng, subs);
    return base(T(`${how.ko} 이 그림이 나타내는 수는?`, `${how.en} What number does the picture show?`, `${how.zh}这幅图表示几？`),
      'cellCode', s.s, Object.assign({}, common, {
        interaction: 'read', lit: s.lit, chips: chips(rng, s.s, 1, maxSum),
        printAsk: T(`${how.ko} 이 그림이 나타내는 수를 쓰세요.`, `${how.en} Write the number.`, `${how.zh}写出这幅图表示的数。`)
      }));
  };

  /* ============================================================
     NL29  g46_ancient — 고대의 숫자(6체계) 읽기·쌓기·잇기
     ============================================================ */
  const SYS_PRACTICE = ['maya', 'egypt', 'roman', 'mesopotamia'];
  const SYS_ALL = ['maya', 'egypt', 'greek', 'chinese', 'mesopotamia', 'roman'];
  const BUILD_WORD = {
    maya: ['점과 막대', 'dots and bars', '点和横线'], egypt: ['막대', 'strokes', '竖线'], greek: ['막대와 ㄱ자 표', 'bars and the hook sign', '竖线和钩形符号'],
    chinese: ['막대와 가로선', 'sticks and the flat bar', '竖线和横线'], mesopotamia: ['쐐기', 'wedges', '楔形']
  };
  const RULE_Q = T('규칙을 찾아봐요! 이 기호가 나타내는 수는?', 'Find the rule! What number does this symbol show?', '找规律！这个符号表示几？');
  /* 읽기 문항에 보여 줄 예시 3개 — 정답이 아니고, 정답에 5-기호가 쓰이면(n≥6) 5를 반드시 넣는다 */
  function readRefSets(n) {
    const o = [];
    if (n >= 6) { [[1, 2], [1, 3], [2, 3]].forEach(p => o.push([5].concat(p).filter(v => v !== n))); }
    else { const base4 = [1, 2, 3, 5].filter(v => v !== n); for (let i = 0; i < base4.length; i++) o.push(base4.filter((_, j) => j !== i)); if (base4.length === 3) return [base4]; }
    return o.filter(a => a.length === 3);
  }
  const buildRefs = (sys, practice) => practice ? (sys === 'maya' ? [1, 5] : [1, 3]) : (sys === 'maya' || sys === 'greek' || sys === 'chinese' ? [1, 5, 6] : [1, 5]);
  function readSpecs(systems, max, deep) {
    const out = [];
    systems.forEach(sys => {
      const ns = [2, 3, 4, 6, 7, 8, 9].filter(n => n <= max && !(sys === 'roman' && (n === 4 || n === 9)));
      ns.forEach(n => {
        if (deep) { if (n >= 2) out.push({ k: 'read', sys, n, refs: [1, 5] }); }
        else readRefSets(n).forEach(refs => out.push({ k: 'read', sys, n, refs }));
      });
    });
    return out;
  }
  function buildSpecs(systems, max, practice, deep) {
    const out = [];
    systems.filter(s => s !== 'roman').forEach(sys => {
      const refs = deep ? [1, 5] : buildRefs(sys, practice);
      range(2, max).forEach(n => { if (!(deep && n === 5) && (practice || deep || !refs.includes(n))) out.push({ k: 'build', sys, n, refs }); });
    });
    return out;
  }
  NM_TGEN['g46_ancient'] = function (params, rng) {
    const mode = (params && params.mode) || 'match';
    const lv = (params && params.level) || 'main';
    const practice = lv === 'practice', max = practice ? 5 : 9;
    const systems = practice ? SYS_PRACTICE : SYS_ALL;
    const deep = !!(params && params.deep);

    if (mode === 'match') {
      const sys = pick(rng, systems), N = practice ? 3 : 4;
      const chosen = shuffle(rng, range(1, max)).slice(0, N);
      const left = shuffle(rng, chosen.slice()), right = shuffle(rng, chosen.slice());
      return base(T('같은 수끼리 이어요! 숫자를 톡 → 기호를 톡!', 'Match the same numbers! Tap a number, then its symbol!', '连一连相同的数！先点数字，再点符号！'),
        'g46Match', N, { left, right, rightType: 'ancient', sys, keyFields: ['left', 'right', 'rightType', 'sys'],
          printAsk: T('같은 수끼리 선으로 이어요.', 'Draw lines to match the same numbers.', '用线连一连相同的数。') });
    }
    let specs;
    if (mode === 'read') specs = readSpecs(deep ? ['greek', 'chinese', 'mesopotamia'] : systems, max, deep);
    else if (mode === 'build') specs = buildSpecs(deep ? ['greek', 'chinese', 'mesopotamia', 'egypt'] : systems, max, practice, deep);
    else specs = readSpecs(systems, max, false).concat(buildSpecs(systems, max, practice, false));
    const s = pick(rng, specs);
    if (s.k === 'read') {
      const refs = shuffle(rng, s.refs.slice()).map(n => ({ n, sys: s.sys }));
      return base(RULE_Q, 'pickCard', s.n, {
        stemParts: [{ k: 'refs', list: refs }, { k: 'glyph', sys: s.sys, n: s.n }], chips: chips(rng, s.n, 1, max), sys: s.sys, n: s.n, refs: s.refs,
        keyFields: ['stemParts', 'sys', 'n'],
        printAsk: T('규칙을 찾아 쓰세요. 마지막 기호가 나타내는 수는?', 'Find the rule. What number does the last symbol show?', '找规律并写出。最后一个符号表示几？')
      });
    }
    const w = BUILD_WORD[s.sys];
    const refList = s.refs.map(n => ({ n }));
    return base(T(`${josa(w[0], '으로', '로')} ${nj(s.n, '을', '를')} 만들어요. 단추를 눌러 쌓아요`, `Make ${s.n} with ${w[1]}. Tap the buttons to build it.`, `用${w[2]}做出${s.n}。点按钮来拼。`),
      'glyphBuild', s.n, {
        sys: s.sys, target: s.n, refs: refList, parts: NM_ANCIENT_HAS_FIVE(s.sys) ? [{ v: 1 }, { v: 5 }] : [{ v: 1 }], keyFields: ['sys', 'target', 'refs'],
        printAsk: T(`${josa(w[0], '으로', '로')} ${nj(s.n, '을', '를')} 그려요.`, `Draw ${s.n} with ${w[1]}.`, `用${w[2]}画出${s.n}。`)
      });
  };
  function NM_ANCIENT_HAS_FIVE(sys) { return sys === 'maya' || sys === 'greek' || sys === 'chinese'; }

  /* ============================================================
     NL30  g46_seq — 수 채우기: 하나 건너 세기(hop) · 규칙 빈칸(rule4) · 달팽이·뱀 길(path)
     ============================================================ */
  /* 길 모양 좌표(0~100) — 달팽이 10칸(ㄷ자로 한 바퀴)·뱀 9칸(지그재그). 격자 칸 중심을 옮겨 적었다. */
  function gridPts(cols, rows, order) {
    return order.map(rc => ({ x: Math.round(14 + rc[0] * (72 / (cols - 1))), y: Math.round(18 + rc[1] * (64 / (rows - 1))) }));
  }
  const PATH_LAYOUTS = {
    snail: gridPts(4, 3, [[0, 0], [1, 0], [2, 0], [3, 0], [3, 1], [3, 2], [2, 2], [1, 2], [0, 2], [0, 1]]),
    snake: gridPts(3, 3, [[0, 0], [1, 0], [2, 0], [2, 1], [1, 1], [0, 1], [0, 2], [1, 2], [2, 2]])
  };
  NM_TGEN['g46_seq'] = function (params, rng) {
    const mode = (params && params.mode) || 'rule4';
    const lv = (params && params.level) || 'main';
    const practice = lv === 'practice';

    if (mode === 'path') {
      const layout = (params && params.layout) || pick(rng, ['snail', 'snake']);
      const pts = PATH_LAYOUTS[layout], n = pts.length;
      const down = R(rng, 0, 1) === 1;
      const first = layout === 'snail' ? 0 : R(rng, 0, 1);      /* 달팽이 0~9, 뱀 0~8 또는 1~9 */
      const vals = range(0, n - 1).map(i => first + i);
      if (down) vals.reverse();
      const ask = R(rng, 1, n - 1);
      const show = new Set([0, ask - 1]);
      if (ask + 1 < n) show.add(ask + 1);
      const rest = shuffle(rng, range(0, n - 1).filter(i => !show.has(i) && i !== ask));
      while (show.size < (R(rng, 0, 1) ? 5 : 4) && rest.length) show.add(rest.pop());
      const cells = pts.map((p, i) => ({ x: p.x, y: p.y, v: show.has(i) ? vals[i] : null }));
      const answer = vals[ask];
      return base(T('길을 따라 수가 이어져요. 빛나는 칸에는 어떤 수가 들어갈까요?', 'The numbers follow the path. Which number goes in the glowing spot?', '数字沿着小路排下去。发光的格子里是几？'),
        'g46Seq', answer, {
          layout, cells, ask, chips: chips(rng, answer, 0, 9), keyFields: ['layout', 'cells', 'ask'],
          printAsk: T('길을 따라 수가 이어져요. 빈 칸에 올 수를 쓰세요.', 'Follow the path. Write the missing number.', '沿着小路数下去，写出空格里的数。')
        });
    }

    if (mode === 'hop') {
      const specs = [];
      const dirs = practice ? [1] : [1, -1];
      dirs.forEach(dir => range(0, 9).forEach(s => [4, 5].forEach(len => {
        const last = s + dir * 2 * (len - 1);
        if (last < 0 || last > 9) return;
        if (practice && s > 3) return;
        if (!practice && dir === 1 && s > 3) return;
        if (!practice && dir === -1 && s < 6) return;
        for (let b = 0; b < len; b++) specs.push({ s, dir, len, b });
      })));
      const sp = pick(rng, specs);
      const seq = range(0, sp.len - 1).map(i => sp.s + sp.dir * 2 * i);
      const answer = seq[sp.b];
      return base(T('하나씩 건너뛰며 세어요. 빈 동그라미에는 어떤 수가 들어갈까요?', 'Count by skipping one each time. Which number goes in the empty circle?', '隔一个数一个。空圆圈里是几？'),
        'g46Seq', answer, {
          seq, blank: sp.b, chain: true, hopStep: 2, chips: chips(rng, answer, 0, 9), keyFields: ['seq', 'blank', 'chain'],
          printAsk: T('하나씩 건너뛰며 세어 빈 동그라미에 수를 쓰세요.', 'Count by skipping one each time. Write the missing number.', '隔一个数一个，在空圆圈里写出数。')
        });
    }

    /* rule4: 길이 4, 공차 ±1·±2 (practice 는 ±1) */
    const specs = [];
    (practice ? [1, -1] : [1, 2, -1, -2]).forEach(d => range(0, 9).forEach(s => {
      const last = s + d * 3; if (last < 0 || last > 9) return;
      for (let b = 0; b < 4; b++) specs.push({ s, d, b });
    }));
    const sp = pick(rng, specs);
    const seq = range(0, 3).map(i => sp.s + sp.d * i);
    const answer = seq[sp.b];
    return base(T('규칙을 찾아요! 빈 칸에 들어갈 수는?', 'Find the rule! Which number goes in the empty box?', '找规律！空格里是几？'),
      'g46Seq', answer, {
        seq, blank: sp.b, chain: false, chips: chips(rng, answer, 0, 9), keyFields: ['seq', 'blank', 'chain'],
        printAsk: T('규칙을 찾아 빈 칸에 올 수를 쓰세요.', 'Find the rule. Write the missing number.', '找出规律，写出空格里的数。')
      });
  };

  /* ============================================================
     NL31  g46_ordinal — 양의 수와 순서수 구분 · 틀린 말 고치기
     ============================================================ */
  const NAMES3 = [T('민수', 'Min', '小民'), T('영희', 'Yuri', '小英'), T('철수', 'Chul', '小哲')];
  NM_TGEN['g46_ordinal'] = function (params, rng) {
    const mode = (params && params.mode) || 'qtyOrd';
    const lv = (params && params.level) || 'main';
    const practice = lv === 'practice';

    if (mode === 'fix') {
      const kinds = (params && params.kinds) || ['frontFromBack'];
      const kind = pick(rng, kinds);
      if (kind === 'chainCompare') {
        const d1 = R(rng, 1, 2), d2 = R(rng, 1, 2), a = R(rng, 1, 9 - d1 - d2);
        const n = [a, a + d1, a + d1 + d2], right = d1 + d2;
        const third = right + 1 <= 5 ? right + 1 : right - 1;
        const opts = shuffle(rng, [right, d1, third]);
        const names = shuffle(rng, NAMES3.slice());
        return base(T(`${names[0].ko}는 사탕이 ${a}개, ${names[1].ko}는 ${names[0].ko}보다 ${d1}개 많고, ${names[2].ko}는 ${names[1].ko}보다 ${d2}개 많아요. "${names[2].ko}는 ${names[0].ko}보다 ${d1}개 많다"는 틀린 말이에요. 맞는 수를 골라요`,
          `${names[0].en} has ${a} candies. ${names[1].en} has ${d1} more than ${names[0].en}, and ${names[2].en} has ${d2} more than ${names[1].en}. "${names[2].en} has ${d1} more than ${names[0].en}" is wrong. Pick the right number.`,
          `${names[0].zh}有${a}颗糖，${names[1].zh}比${names[0].zh}多${d1}颗，${names[2].zh}比${names[1].zh}多${d2}颗。“${names[2].zh}比${names[0].zh}多${d1}颗”是错的。选出对的数。`),
        'pickCard', opts.indexOf(right) + 1, {
          stemParts: [{ k: 'rows', list: names.map((nm, i) => ({ label: nm, e: '🍬', n: n[i] })) },
            { k: 'text', t: T(`틀린 말: ${names[2].ko}는 ${names[0].ko}보다 ${d1}개 많다`, `Wrong: ${names[2].en} has ${d1} more than ${names[0].en}`, `错的说法：${names[2].zh}比${names[0].zh}多${d1}颗`) }],
          choices: opts.map(v => ({ t: T(`${v}개`, `${v}`, `${v}颗`) })), keyFields: ['stemParts'],
          printAsk: T(`틀린 말을 바르게 고쳐요. ${names[2].ko}는 ${names[0].ko}보다 몇 개 많을까요? 알맞은 번호에 ○표 하세요.`, `Fix the wrong sentence. How many more does ${names[2].en} have than ${names[0].en}? Circle the number.`, `改正错的说法：${names[2].zh}比${names[0].zh}多几颗？圈出对的序号。`)
        });
      }
      const stairs = kind === 'floor';
      const Tn = R(rng, 3, 9);
      const specs = range(1, Tn).filter(k => k !== Tn - k + 1);
      const k = pick(rng, specs), c = Tn - k + 1;
      const third = pick(rng, range(1, Tn).filter(v => v !== k && v !== c));
      const opts = shuffle(rng, [c, k, third]);
      const choices = opts.map(v => ({ t: ord(v) }));
      if (stairs) {
        const e = pick(rng, ['🐢', '🐰', '🐻', '🦊']);
        return base(T(`계단이 ${Tn}칸 있어요. 표시한 계단은 아래에서 ${ORD_KO[k]}인데, "위에서 ${ORD_KO[k]}"라고 말했어요. 맞는 말이 되려면 위에서 몇째일까요?`,
          `There are ${Tn} steps. The marked step is ${ORD_EN[k]} from the bottom, but someone said "${ORD_EN[k]} from the top". Which place from the top is right?`,
          `台阶有${Tn}级。做记号的那级是从下往上数第${k}，却说成“从上往下数第${k}”。从上往下数应该是第几？`),
        'pickCard', opts.indexOf(c) + 1, {
          stemParts: [{ k: 'stairs', total: Tn, mark: k - 1, e }, { k: 'text', t: T(`틀린 말: 위에서 ${ORD_KO[k]}`, `Wrong: ${ORD_EN[k]} from the top`, `错的说法：从上往下数第${k}`) }],
          choices, keyFields: ['stemParts'],
          printAsk: T('틀린 말을 바르게 고쳐요. 표시한 계단은 위에서 몇째일까요? 알맞은 번호에 ○표 하세요.', 'Fix the wrong sentence. Which step from the top is it? Circle the number.', '改正错的说法：做记号的台阶从上往下数是第几？圈出序号。')
        });
      }
      const chars = shuffle(rng, FRIENDS.slice()).slice(0, Tn);
      return base(T(`줄에 ${Tn}명이 서 있어요. 표시한 친구는 뒤에서 ${ORD_KO[k]}인데, "앞에서 ${ORD_KO[k]}"라고 말했어요. 맞는 말이 되려면 앞에서 몇째일까요?`,
        `${Tn} friends stand in a line. The marked friend is ${ORD_EN[k]} from the back, but someone said "${ORD_EN[k]} from the front". Which place from the front is right?`,
        `${Tn}个小朋友排成一队。做记号的小朋友从后往前数是第${k}，却说成“从前往后数第${k}”。从前往后数应该是第几？`),
      'pickCard', opts.indexOf(c) + 1, {
        stemParts: [{ k: 'row', total: Tn, mark: Tn - k, chars, front: 'left' }, { k: 'text', t: T(`틀린 말: 앞에서 ${ORD_KO[k]}`, `Wrong: ${ORD_EN[k]} from the front`, `错的说法：从前往后数第${k}`) }],
        choices, keyFields: ['stemParts'],
        printAsk: T('틀린 말을 바르게 고쳐요. 표시한 친구는 앞에서 몇째일까요? 알맞은 번호에 ○표 하세요.', 'Fix the wrong sentence. Which place from the front is it? Circle the number.', '改正错的说法：做记号的小朋友从前往后数是第几？圈出序号。')
      });
    }

    /* ---- qtyOrd ---- */
    const kinds = (params && params.kinds) || ['line'];
    const kind = pick(rng, kinds);
    const ask = R(rng, 0, 1) ? 'ord' : 'qty';
    let total, rank, e, scene, qty, pr, pa, chars;
    const qOrd = T('몇째를 나타내는 수에 콕!', 'Tap the number that tells the place.', '点一点表示第几的数。');
    if (kind === 'prize') {
      rank = R(rng, 1, 3); qty = R(rng, 2, 9); while (qty === rank) qty = R(rng, 2, 9);
      e = pick(rng, ['🍬', '🍎', '⭐', '🍪']);
      scene = { kind: 'prize', total: qty, rank, e, q: qty };
      pr = T(`${rank}등을 한 친구가 ${tn(e, 0)} ${qty}개를 받았어요. `, `The friend in ${ORD_EN[rank]} place got ${qty} ${tn(e, 1)}. `, `得第${rank}名的小朋友得到${qty}个${tn(e, 2)}。`);
      pa = ask === 'ord' ? T('몇 등을 나타내는 수에 콕!', 'Tap the number that tells the place.', '点一点表示第几名的数。') : T('몇 개를 나타내는 수에 콕!', 'Tap the number that tells how many.', '点一点表示有几个的数。');
    } else if (kind === 'coins') {
      total = R(rng, 3, 9); rank = R(rng, 1, total - 1); e = '🪙'; qty = total;
      scene = { kind: 'coins', total, rank, e };
      pr = T(`동전 ${total}개가 한 줄로 놓여 있어요. 큰 동전은 왼쪽에서 ${ORD_KO[rank]}예요. `, `${total} coins are in a row. The big coin is ${ORD_EN[rank]} from the left. `, `${total}枚硬币排成一排，大硬币在左边第${rank}个。`);
      pa = ask === 'ord' ? qOrd : T('몇 개를 나타내는 수에 콕!', 'Tap the number that tells how many.', '点一点表示有几个的数。');
    } else {
      total = R(rng, 3, practice ? 6 : 9); rank = R(rng, 1, total - 1); qty = total; e = '🎩';
      chars = shuffle(rng, FRIENDS.slice()).slice(0, total);
      scene = { kind: 'line', total, rank, e, chars };
      pr = T(`모두 ${total}명이에요. 모자 쓴 친구는 앞에서 ${ORD_KO[rank]}예요. `, `There are ${total} friends in all. The friend with the hat is ${ORD_EN[rank]} from the front. `, `一共有${total}个小朋友，戴帽子的排在前面第${rank}。`);
      pa = ask === 'ord' ? qOrd : T('몇 명을 나타내는 수에 콕!', 'Tap the number that tells how many friends.', '点一点表示一共有几个小朋友的数。');
    }
    const cards = shuffle(rng, [{ n: qty, role: 'qty' }, { n: rank, role: 'ord' }]);
    return base(T(pr.ko + pa.ko, pr.en + pa.en, pr.zh + pa.zh), 'qtyOrd', ask === 'qty' ? qty : rank, {
      scene, cards, ask, keyFields: ['scene', 'cards', 'ask'],
      printAsk: T(`${pr.ko}${ask === 'ord' ? '몇째를' : kind === 'line' ? '몇 명을' : '몇 개를'} 나타내는 수에 ○표 하세요.`, `${pr.en}Circle the number that tells ${ask === 'ord' ? 'the place' : 'how many'}.`, `${pr.zh}圈出表示${ask === 'ord' ? '第几' : '有几个'}的数。`)
    });
  };

  /* ============================================================
     NL32  g46_seat — 자리 콕·줄 앞뒤 수·방향 바꿔 세기·뒤에 그리기
     ============================================================ */
  NM_TGEN['g46_seat'] = function (params, rng) {
    const mode = (params && params.mode) || 'seat';
    const lv = (params && params.level) || 'main';
    const practice = lv === 'practice';

    if (mode === 'seat') {
      const kinds = (params && params.kinds) || ['find'];
      const kind = pick(rng, kinds);
      const dims = practice ? [[3, 3]] : [[3, 4], [4, 4]];
      const d = pick(rng, dims), rows = d[0], cols = d[1];
      const occ = range(0, rows * cols - 1).map(() => pick(rng, ANIMALS));
      const r = R(rng, 0, rows - 1), c = R(rng, 0, cols - 1);
      if (kind === 'find') {
        return base(T(`앞에서 ${ORD_KO[r + 1]} 줄, 왼쪽에서 ${ORD_KO[c + 1]} 칸 친구를 콕!`, `Tap the friend in the ${ORD_EN[r + 1]} row from the front and the ${ORD_EN[c + 1]} seat from the left!`, `点一点前面第${r + 1}排、左边第${c + 1}个的小朋友！`),
          'seatGrid', r * cols + c, {
            interaction: 'find', rows, cols, occ, target: [r, c], keyFields: ['rows', 'cols', 'occ', 'target', 'interaction'],
            printAsk: T(`앞에서 ${ORD_KO[r + 1]} 줄, 왼쪽에서 ${ORD_KO[c + 1]} 칸 친구에게 ○표 하세요.`, `Circle the friend in the ${ORD_EN[r + 1]} row from the front and the ${ORD_EN[c + 1]} seat from the left.`, `圈出前面第${r + 1}排、左边第${c + 1}个的小朋友。`)
          });
      }
      const askRow = (params && params.ask) ? params.ask === 'row' : R(rng, 0, 1) === 0;
      const ans = askRow ? r + 1 : c + 1;
      return base(askRow ? T('색이 칠해진 친구는 앞에서 몇째 줄에 있을까요?', 'In which row from the front is the marked friend?', '做记号的小朋友在前面数第几排？')
        : T('색이 칠해진 친구는 왼쪽에서 몇째 칸에 있을까요?', 'Which seat from the left is the marked friend in?', '做记号的小朋友在左边数第几个？'),
      'seatGrid', ans, {
        interaction: 'read', rows, cols, occ, target: [r, c], ask: askRow ? 'row' : 'col', chips: chips(rng, ans, 1, askRow ? rows : cols),
        keyFields: ['rows', 'cols', 'occ', 'target', 'ask', 'interaction'],
        printAsk: askRow ? T('표시한 친구는 앞에서 몇째 줄일까요? 번호를 쓰세요.', 'Which row from the front? Write the number.', '做记号的小朋友在前面数第几排？写出序号。')
          : T('표시한 친구는 왼쪽에서 몇째 칸일까요? 번호를 쓰세요.', 'Which seat from the left? Write the number.', '做记号的小朋友在左边数第几个？写出序号。')
      });
    }

    if (mode === 'around') {
      const total = R(rng, 3, practice ? 5 : 9);
      const ask = pick(rng, ['ahead', 'behind', 'total']);
      const textOnly = ask === 'total' && R(rng, 0, 1) === 1;
      let mark = R(rng, 0, total - 1);
      if (ask === 'ahead') mark = R(rng, 1, total - 1);
      if (ask === 'behind') mark = R(rng, 0, total - 2);
      if (textOnly) mark = R(rng, 1, total - 2);          /* "내 앞에 0명"은 이상하다 — 앞뒤 모두 1명 이상 */
      const chars = shuffle(rng, FRIENDS.slice()).slice(0, total);
      const ahead = mark, behind = total - mark - 1;
      const answer = ask === 'ahead' ? ahead : ask === 'behind' ? behind : total;
      const pr = textOnly
        ? T(`매표소 줄이에요. 내 앞에는 ${ahead}명, 내 뒤에는 ${behind}명이 서 있어요. 줄에 선 친구는 모두 몇 명일까요?`, `A ticket line. ${ahead} friends are ahead of me and ${behind} are behind me. How many friends are in line?`, `排队买票。我前面有${ahead}个人，后面有${behind}个人。队里一共有几个人？`)
        : ask === 'ahead' ? T('매표소 줄이에요. 표시한 친구 앞에는 몇 명이 서 있을까요?', 'A ticket line. How many friends are ahead of the marked friend?', '排队买票。做记号的小朋友前面有几个人？')
          : ask === 'behind' ? T('매표소 줄이에요. 표시한 친구 뒤에는 몇 명이 서 있을까요?', 'A ticket line. How many friends are behind the marked friend?', '排队买票。做记号的小朋友后面有几个人？')
            : T('매표소 줄이에요. 줄에 선 친구는 모두 몇 명일까요?', 'A ticket line. How many friends are in line?', '排队买票。队里一共有几个人？');
      return base(pr, 'g46Line', answer, {
        interaction: 'numpad', layout: 'row', total, mark, ask, chars, textOnly, ahead, behind, keyFields: ['total', 'mark', 'ask', 'textOnly', 'chars'],
        printAsk: pr
      });
    }

    if (mode === 'convert') {
      const total = R(rng, 3, practice ? 6 : 9), k = R(rng, 1, total);
      const answer = total - k + 1;
      const scene = (!practice && R(rng, 0, 1)) ? 'silhouette' : 'full';
      const chars = shuffle(rng, FRIENDS.slice()).slice(0, total);
      const pr = T(`줄에 ${total}명이 서 있어요. 뒤에서 ${ORD_KO[k]}인 친구는 앞에서 몇째일까요?`, `${total} friends stand in a line. The friend who is ${ORD_EN[k]} from the back is which place from the front?`, `队里有${total}个小朋友。从后往前数第${k}的小朋友，从前往后数是第几？`);
      return base(pr, 'g46Line', answer, {
        interaction: 'numpad', layout: 'row', total, mark: total - k, ask: 'convert', fromBack: k, scene, chars, keyFields: ['total', 'fromBack', 'scene', 'chars'],
        printAsk: pr
      });
    }

    /* behind: 앞 줄은 그려져 있고 내 뒤에 b명을 그린다 */
    const maxT = practice ? 6 : 9;
    const specs = [];
    for (let a = 0; a <= maxT - 2; a++) for (let b = 1; a + 1 + b <= maxT; b++) specs.push({ a, b });
    const s = pick(rng, specs);
    const chars = shuffle(rng, FRIENDS.slice()).slice(0, s.a + 1);
    const pr = T(`나는 줄에서 앞에서 ${ORD_KO[s.a + 1]}예요. 내 뒤에 ${s.b}명이 서요. 뒤에 서는 친구를 ${s.b}명 그려요`, `I am ${ORD_EN[s.a + 1]} from the front. ${s.b} more friends line up behind me. Draw those ${s.b} friends.`, `我排在前面第${s.a + 1}个。我后面又排了${s.b}个人。把后面的${s.b}个人画出来。`);
    return base(pr, 'g46LineDraw', s.b, {
      context: { chars, mark: s.a }, behindN: s.b, keyFields: ['context', 'behindN'],
      printAsk: T(`나는 줄에서 앞에서 ${ORD_KO[s.a + 1]}예요. 내 뒤에 ${s.b}명이 서요. 뒤에 서는 친구를 ○로 ${s.b}명 그려요.`, `I am ${ORD_EN[s.a + 1]} from the front. ${s.b} friends line up behind me. Draw ${s.b} circles for them.`, `我排在前面第${s.a + 1}个。我后面排了${s.b}个人。用圆圈画出后面的${s.b}个人。`)
    });
  };

  /* ============================================================
     NL33  g46_rank — 달리기 순위 단서 · 그림그래프 읽기 · 번호표 규칙
     ============================================================ */
  function perms(n) {
    if (n <= 1) return [[0]];
    const out = [];
    (function rec(cur, left) { if (!left.length) { out.push(cur); return; } left.forEach((v, i) => rec(cur.concat(v), left.slice(0, i).concat(left.slice(i + 1)))); })([], range(0, n - 1));
    return out;
  }
  /* ranks[i] = i번 동물의 등수(1이 가장 빠름) */
  function clueSat(c, ranks, N) {
    if (c.k === 'ahead') return ranks[c.a] < ranks[c.b];
    if (c.k === 'first') return ranks[c.a] === 1;
    if (c.k === 'last') return ranks[c.a] === N;
    if (c.k === 'right_after') return ranks[c.a] === ranks[c.b] + 1;
    return (ranks[c.b] < ranks[c.a] && ranks[c.a] < ranks[c.c]) || (ranks[c.c] < ranks[c.a] && ranks[c.a] < ranks[c.b]);
  }
  function rankClueText(c, names) {
    const nm = i => names[i];
    const A = c.a != null ? nm(c.a) : null, B = c.b != null ? nm(c.b) : null, C = c.c != null ? nm(c.c) : null;
    if (c.k === 'ahead') return T(`${josa(A[0], '은', '는')} ${B[0]}보다 앞에서 달려요`, `The ${A[1]} runs ahead of the ${B[1]}`, `${A[2]}跑在${B[2]}前面`);
    if (c.k === 'first') return T(`${josa(A[0], '은', '는')} 맨 앞에서 달려요`, `The ${A[1]} runs first`, `${A[2]}跑在最前面`);
    if (c.k === 'last') return T(`${josa(A[0], '은', '는')} 맨 뒤에서 달려요`, `The ${A[1]} runs last`, `${A[2]}跑在最后面`);
    if (c.k === 'right_after') return T(`${josa(A[0], '은', '는')} ${B[0]} 바로 뒤에서 달려요`, `The ${A[1]} runs right behind the ${B[1]}`, `${A[2]}紧跟在${B[2]}后面`);
    return T(`${josa(A[0], '은', '는')} ${josa(B[0], '과', '와')} ${C[0]} 사이에서 달려요`, `The ${A[1]} runs between the ${B[1]} and the ${C[1]}`, `${A[2]}跑在${B[2]}和${C[2]}之间`);
  }
  const GTOK = ['🍎', '🍓', '🍌', '🍪', '🍬'];

  NM_TGEN['g46_rank'] = function (params, rng) {
    const mode = (params && params.mode) || 'rank';
    const lv = (params && params.level) || 'main';
    const practice = lv === 'practice';

    /* ---- rule: 번호표 규칙 판단 ---- */
    if (mode === 'rule') {
      const hi = practice ? 5 : 9, less = R(rng, 0, 1) === 1;
      const m = less ? R(rng, 2, hi) : R(rng, 1, hi - 1); let n = R(rng, 1, hi); while (n === m) n = R(rng, 1, hi);
      const yes = { t: T('예', 'Yes', '能') }, no = { t: T('아니요', 'No', '不能') };
      const choices = shuffle(rng, [yes, no]);
      const ok = less ? n < m : n > m;
      const rule = less ? T(`${m}보다 작은 번호표는 상품!`, `Tickets smaller than ${m} win a prize!`, `比${m}小的号码牌有奖品！`) : T(`${m}보다 큰 번호표는 상품!`, `Tickets bigger than ${m} win a prize!`, `比${m}大的号码牌有奖品！`);
      return base(T(`번호표가 ${n}번이에요. "${rule.ko}" 이 번호표는 상품을 받을 수 있을까요?`, `The ticket number is ${n}. "${rule.en}" Does this ticket win?`, `号码牌是${n}号。“${rule.zh}”这张号码牌有奖品吗？`),
        'pickCard', choices.findIndex(c => (c === yes) === ok) + 1, {
          stemParts: [{ k: 'ticket', n }, { k: 'text', t: rule }], choices, keyFields: ['stemParts'],
          printAsk: T(`번호표가 ${n}번이에요. "${rule.ko}" 상품을 받을 수 있으면 ‘예’에 ○표 하세요.`, `Ticket ${n}. "${rule.en}" Circle Yes if it wins.`, `号码牌是${n}号。“${rule.zh}”能拿奖品就圈“能”。`)
        });
    }

    /* ---- graph: 물건 쌓기 그림그래프 ---- */
    if (mode === 'graph') {
      const kind = pick(rng, (params && params.kinds) || ['count']);
      const N = practice ? 3 : R(rng, 4, 5), maxV = practice ? 5 : 9;
      const toks = shuffle(rng, GTOK.slice()).slice(0, N);
      let vals;
      const pool = shuffle(rng, range(1, maxV));
      if (kind === 'same') {
        const v = pool.pop(), idx = shuffle(rng, range(0, N - 1));
        vals = range(0, N - 1).map(() => 0);
        vals[idx[0]] = v; vals[idx[1]] = v;
        for (let q = 2; q < N; q++) vals[idx[q]] = pool.pop();
      } else vals = pool.slice(0, N);        /* 같은 수가 없어야 가장 많은/적은/둘째가 하나로 정해진다 */
      const cats = n => toks.map((e, i) => ({ e, n: n[i] }));
      const gp = { keyFields: ['cats', 'kind', 'focus', 'rankN', 'hidden'] };
      if (kind === 'count') {
        const i = R(rng, 0, N - 1), ans = vals[i];
        return base(T(`그림그래프예요. ${josa(tn(toks[i], 0), '은', '는')} 몇 개일까요?`, `Look at the picture graph. How many ${tn(toks[i], 1)} are there?`, `看图表。${tn(toks[i], 2)}有几个？`), 'barRead', ans,
          Object.assign({ cats: cats(vals), kind, focus: [i], chips: chips(rng, ans, 1, maxV), printAsk: T(`그림그래프에서 ${josa(tn(toks[i], 0), '은', '는')} 몇 개인지 쓰세요.`, `How many ${tn(toks[i], 1)}? Write the number.`, `写出${tn(toks[i], 2)}有几个。`) }, gp));
      }
      if (kind === 'most' || kind === 'least') {
        const top = kind === 'most' ? Math.max.apply(null, vals) : Math.min.apply(null, vals), ans = vals.indexOf(top);
        return base(kind === 'most' ? T('가장 많은 것을 콕!', 'Tap the one with the most!', '点一点最多的！') : T('가장 적은 것을 콕!', 'Tap the one with the fewest!', '点一点最少的！'), 'barRead', ans,
          Object.assign({ cats: cats(vals), kind, printAsk: kind === 'most' ? T('가장 많은 것에 ○표 하세요.', 'Circle the one with the most.', '圈出最多的。') : T('가장 적은 것에 ○표 하세요.', 'Circle the one with the fewest.', '圈出最少的。') }, gp));
      }
      if (kind === 'diff') {
        let i = R(rng, 0, N - 1), j = R(rng, 0, N - 1); while (j === i) j = R(rng, 0, N - 1);
        if (vals[i] < vals[j]) { const t = i; i = j; j = t; }
        const ans = vals[i] - vals[j];
        return base(T(`${josa(tn(toks[i], 0), '은', '는')} ${tn(toks[j], 0)}보다 몇 개 더 많을까요?`, `How many more ${tn(toks[i], 1)} than ${tn(toks[j], 1)} are there?`, `${tn(toks[i], 2)}比${tn(toks[j], 2)}多几个？`), 'barRead', ans,
          Object.assign({ cats: cats(vals), kind, focus: [i, j], chips: chips(rng, ans, 1, maxV - 1), printAsk: T(`${josa(tn(toks[i], 0), '은', '는')} ${tn(toks[j], 0)}보다 몇 개 더 많은지 쓰세요.`, `How many more ${tn(toks[i], 1)} than ${tn(toks[j], 1)}? Write the number.`, `写出${tn(toks[i], 2)}比${tn(toks[j], 2)}多几个。`) }, gp));
      }
      if (kind === 'rank') {
        const rankN = 2, sorted = vals.slice().sort((a, b) => b - a), ans = vals.indexOf(sorted[rankN - 1]);
        return base(T(`${ORD_KO[rankN]}로 많은 것을 콕!`, `Tap the ${ORD_EN[rankN]} most!`, `点一点第${rankN}多的！`), 'barRead', ans,
          Object.assign({ cats: cats(vals), kind, rankN, printAsk: T(`${ORD_KO[rankN]}로 많은 것에 ○표 하세요.`, `Circle the ${ORD_EN[rankN]} most.`, `圈出第${rankN}多的。`) }, gp));
      }
      if (kind === 'same') {
        const v = vals.find((x, i) => vals.indexOf(x) !== i);
        return base(T('개수가 같은 두 가지를 모두 콕!', 'Tap the two that have the same number!', '点一点数量相同的两个！'), 'barRead', v,
          Object.assign({ cats: cats(vals), kind, printAsk: T('개수가 같은 두 가지에 ○표 하세요.', 'Circle the two with the same number.', '圈出数量相同的两个。') }, gp));
      }
      /* hidden: 한 칸을 가리고 '○보다 많고 △보다 적어요'(사이 한 수) → 유일해 */
      const v = R(rng, 2, maxV - 1), idx = shuffle(rng, range(0, N - 1));
      const h = idx[0], lo = idx[1], up = idx[2];
      vals = range(0, N - 1).map(() => R(rng, 1, maxV));
      vals[h] = v; vals[lo] = v - 1; vals[up] = v + 1;
      return base(T(`?로 가린 칸은 몇 개일까요? ${tn(toks[lo], 0)}보다 많고 ${tn(toks[up], 0)}보다 적어요`, `How many are hidden by the ?. More than the ${tn(toks[lo], 1)} and fewer than the ${tn(toks[up], 1)}.`, `被?盖住的有几个？比${tn(toks[lo], 2)}多，比${tn(toks[up], 2)}少。`), 'barRead', v,
        Object.assign({ cats: cats(vals), kind, hidden: h, focus: [lo, up], chips: chips(rng, v, 1, maxV), printAsk: T(`?로 가린 칸은 몇 개일까요? ${tn(toks[lo], 0)}보다 많고 ${tn(toks[up], 0)}보다 적어요. 수를 쓰세요.`, `How many are hidden? More than the ${tn(toks[lo], 1)}, fewer than the ${tn(toks[up], 1)}. Write the number.`, `被?盖住的有几个？比${tn(toks[lo], 2)}多，比${tn(toks[up], 2)}少。写出数。`) }, gp));
    }

    /* ---- rank: 달리기 단서로 순위 알아내기 ---- */
    const N = (params && params.n) || (practice ? 3 : 4);
    const animals = shuffle(rng, ANIMALS.slice()).slice(0, N);
    const names = animals.map(a => ANI[a]);
    const all = perms(N).map(p => p.map(x => x + 1));     /* ranks 배열 후보 */
    const target = pick(rng, all);
    const clueSpace = [];
    for (let a = 0; a < N; a++) {
      clueSpace.push({ k: 'first', a }, { k: 'last', a });
      for (let b = 0; b < N; b++) if (a !== b) { clueSpace.push({ k: 'ahead', a, b }); clueSpace.push({ k: 'right_after', a, b }); }
      if (N >= 4) for (let b = 0; b < N; b++) for (let c = b + 1; c < N; c++) if (a !== b && a !== c) clueSpace.push({ k: 'between', a, b, c });
    }
    const trueClues = clueSpace.filter(c => clueSat(c, target, N));
    const want = N === 3 ? 2 : 3;
    let chosen = null;
    for (let tries = 0; tries < 300 && !chosen; tries++) {
      let cand = all, out = [];
      for (const c of shuffle(rng, trueClues.slice())) {
        const next = cand.filter(r => clueSat(c, r, N));
        if (next.length < cand.length) { out.push(c); cand = next; }
        if (cand.length === 1 || out.length > want) break;
      }
      if (cand.length === 1 && out.length <= want + (tries > 150 ? 1 : 0)) chosen = out;
    }
    if (!chosen) chosen = trueClues.slice(0, 4);
    const askRank = R(rng, 1, N), answer = target.indexOf(askRank);
    const said = chosen.map(c => rankClueText(c, names));
    return base(T(`달리기 대회예요. ${said.map(s => s.ko).join('. ')}. ${askRank}등은 누구일까요? 그 친구를 콕!`, `A running race! ${said.map(s => s.en).join('. ')}. Who comes in ${ORD_EN[askRank]}? Tap that animal!`, `赛跑比赛！${said.map(s => s.zh).join('。')}。第${askRank}名是谁？点一点它！`),
      'rankClue', answer, {
        animals, clues: chosen, clueText: said, askRank, ranks: target, keyFields: ['animals', 'clues', 'askRank'],
        printAsk: T(`달리기 대회예요. ${said.map(s => s.ko).join('. ')}. ${askRank}등인 동물에 ○표 하세요.`, `A running race! ${said.map(s => s.en).join('. ')}. Circle the animal that comes in ${ORD_EN[askRank]}.`, `赛跑比赛！${said.map(s => s.zh).join('。')}。圈出第${askRank}名的动物。`)
      });
  };

  /* ============================================================
     NL34  g46_machine — 수 기계 연쇄(chain) · 주고받기(trade)
     ============================================================ */
  const QUIZ_WORD = { ko: ['맞음', '틀림'], en: ['Right', 'wrong'], zh: ['对', '错'] };
  NM_TGEN['g46_machine'] = function (params, rng) {
    const mode = (params && params.mode) || 'chain';
    const lv = (params && params.level) || 'main';
    const practice = lv === 'practice';

    if (mode === 'trade') {
      const inter = (params && params.interaction) || 'after';
      const max = practice ? 6 : 9;
      const e = pick(rng, ['⚫', '🍬', '🍪', '🍎']);
      const nm = shuffle(rng, NAMES3.slice());
      const A = nm[0], B = nm[1];
      if (inter === 'equal') {
        const specs = [];
        for (let a = 1; a <= 8; a++) for (let b = 1; b <= 8; b++) if (a !== b && (a - b) % 2 === 0 && a + b <= max) specs.push([a, b]);
        const [a, b] = pick(rng, specs), ans = Math.abs(a - b) / 2;
        return base(T(`${A.ko}는 ${josa(tn(e, 0), '이', '가')} ${a}개, ${B.ko}는 ${b}개 있어요. 둘이 똑같아지려면 몇 개를 옮겨야 할까요? ${josa(tn(e, 0), '을', '를')} 눌러 옮겨 봐요`, `${A.en} has ${a} ${tn(e, 1)} and ${B.en} has ${b}. How many must move so both have the same? Tap one to move it.`, `${A.zh}有${a}个${tn(e, 2)}，${B.zh}有${b}个。要移几个才能一样多？点一点来移动。`),
          'tradeScene', ans, {
            interaction: 'equal', a: { e, n: a, name: A }, b: { e, n: b, name: B }, keyFields: ['a', 'b', 'interaction'],
            printAsk: T(`${A.ko}는 ${josa(tn(e, 0), '이', '가')} ${a}개, ${B.ko}는 ${b}개 있어요. 둘이 똑같아지려면 몇 개를 옮겨야 할까요? 개수를 쓰세요.`, `${A.en} has ${a} ${tn(e, 1)} and ${B.en} has ${b}. How many must move so both have the same? Write the number.`, `${A.zh}有${a}个${tn(e, 2)}，${B.zh}有${b}个。要移几个才一样多？写出个数。`)
          });
      }
      const specs = [];
      for (let a = 1; a <= 8; a++) for (let b = 1; b <= 8; b++) if (a + b <= max) ['a', 'b'].forEach(from => { const have = from === 'a' ? a : b; for (let k = 1; k < have; k++) ['a', 'b'].forEach(ask => specs.push({ a, b, from, k, ask })); });
      const s = pick(rng, specs);
      const after = { a: s.a + (s.from === 'a' ? -s.k : s.k), b: s.b + (s.from === 'b' ? -s.k : s.k) };
      const giver = s.from === 'a' ? A : B, taker = s.from === 'a' ? B : A, who = s.ask === 'a' ? A : B, ans = after[s.ask];
      return base(T(`${A.ko}는 ${josa(tn(e, 0), '이', '가')} ${s.a}개, ${B.ko}는 ${s.b}개 있어요. ${giver.ko}가 ${taker.ko}에게 ${s.k}개를 주면 ${who.ko}는 몇 개가 될까요?`,
        `${A.en} has ${s.a} ${tn(e, 1)} and ${B.en} has ${s.b}. ${giver.en} gives ${s.k} to ${taker.en}. How many does ${who.en} have now?`, `${A.zh}有${s.a}个${tn(e, 2)}，${B.zh}有${s.b}个。${giver.zh}给${taker.zh}${s.k}个。${who.zh}现在有几个？`),
      'tradeScene', ans, {
        interaction: 'after', a: { e, n: s.a, name: A }, b: { e, n: s.b, name: B }, give: { from: s.from, n: s.k }, ask: s.ask, chips: chips(rng, ans, 1, 9),
        keyFields: ['a', 'b', 'give', 'ask', 'interaction'],
        printAsk: T(`${A.ko}는 ${josa(tn(e, 0), '이', '가')} ${s.a}개, ${B.ko}는 ${s.b}개 있어요. ${giver.ko}가 ${taker.ko}에게 ${s.k}개를 주면 ${who.ko}는 몇 개가 될까요? 수를 쓰세요.`, `${A.en} has ${s.a} ${tn(e, 1)} and ${B.en} has ${s.b}. ${giver.en} gives ${s.k} to ${taker.en}. How many does ${who.en} have now? Write the number.`, `${A.zh}有${s.a}个${tn(e, 2)}，${B.zh}有${s.b}个。${giver.zh}给${taker.zh}${s.k}个。${who.zh}现在有几个？写出个数。`)
      });
    }

    /* ---- chain ---- */
    const theme = (params && params.theme) || 'quiz';
    const pickTheme = theme === 'mix' ? pick(rng, ['quiz', 'age', 'birds', 'stairs']) : theme;
    const nm = pick(rng, NAMES3);
    let start, rules, pr, printSym;
    for (let tries = 0; tries < 200; tries++) {
      const len = practice ? 2 : R(rng, 2, 3);
      if (pickTheme === 'quiz') rules = range(1, len).map(() => (R(rng, 0, 1) ? { sym: '✓', d: 1 } : { sym: '✕', d: -1 }));
      else if (pickTheme === 'age') rules = range(1, R(rng, 2, 4)).map(() => ({ sym: '🎂', d: 1 }));
      else if (pickTheme === 'birds') rules = range(1, len).map(() => ({ sym: '🐦', d: R(rng, 1, 3) }));
      else rules = range(1, len).map(() => (R(rng, 0, 1) ? { sym: '🙂', d: 2 } : { sym: '😢', d: -1 }));
      start = R(rng, 1, 8);
      let v = start, ok = true;
      for (const r of rules) { v += r.d; if (v < 0 || v > 9) { ok = false; break; } }
      if (ok) break;
    }
    const answer = rules.reduce((v, r) => v + r.d, start);
    let ps;
    if (pickTheme === 'quiz') {
      const w = rules.map(r => r.d > 0 ? 0 : 1);
      pr = T(`${start}점에서 시작! ✓맞음은 +1, ✕틀림은 −1. ${w.map(i => QUIZ_WORD.ko[i]).join(', ')}이면 몇 점일까요?`, `Start at ${start} points! Right is +1, wrong is −1. ${w.map((i, j) => (j ? QUIZ_WORD.en[i].toLowerCase() : QUIZ_WORD.en[i])).join(', ')} — how many points?`, `从${start}分开始！答对+1，答错−1。${w.map(i => QUIZ_WORD.zh[i]).join('、')}，现在几分？`);
    } else if (pickTheme === 'age') {
      pr = T(`${nm.ko}는 ${start}살이에요. 생일이 ${rules.length}번 지나면 몇 살이 될까요? 생일마다 한 살씩 더 먹어요(+1)`, `${nm.en} is ${start}. After ${rules.length} birthdays, how old is ${nm.en}? One more year each birthday (+1).`, `${nm.zh}今年${start}岁。过${rules.length}次生日，几岁？每次生日长一岁(+1)。`);
    } else if (pickTheme === 'birds') {
      pr = T(`전깃줄에 새가 ${start}마리 앉아 있어요. ${rules.map((r, i) => (i ? '또 ' : '') + r.d + '마리가 날아오면').join(', ')} 모두 몇 마리일까요?`, `There are ${start} birds on the wire. ${rules.map((r, i) => (i ? 'Then ' : '') + r.d + ' more fly in').join('. ')}. How many birds now?`, `电线上有${start}只小鸟。${rules.map((r, i) => (i ? '又' : '') + '飞来' + r.d + '只').join('，')}。现在一共几只？`);
    } else {
      const w = rules.map(r => r.d > 0 ? 0 : 1), K = [['이김', '짐'], ['Win', 'lose'], ['赢', '输']];
      pr = T(`계단 ${start}칸에서 시작! 이기면 2칸 올라가고(+2), 지면 1칸 내려가요(−1). ${w.map(i => K[0][i]).join(', ')}이면 몇 칸일까요?`, `Start on step ${start}! Win to go up 2 (+2), lose to go down 1 (−1). ${w.map((i, j) => (j ? K[1][i].toLowerCase() : K[1][i])).join(', ')} — which step now?`, `从第${start}级台阶出发！赢了上2级(+2)，输了下1级(−1)。${w.map(i => K[2][i]).join('、')}，现在在第几级？`);
    }
    return base(pr, 'chainMachine', answer, { theme: pickTheme, input: start, rules, keyFields: ['theme', 'input', 'rules'], printAsk: pr });
  };

  /* ============================================================
     NL35  g46_split — 한 수를 서로 다르게 가르기(열린 활동). 접시·케이크·색칠·동그라미·막대 5가지 겉모습
     ============================================================ */
  const PALETTES = [['#e53935', '#3b8fe0'], ['#fb8c2e', '#43a047'], ['#8e6bd8', '#ffb300'], ['#ec6aa8', '#2aa8a0']];
  function unorderedSplits(t) { const o = []; for (let k = t >> 1; k >= 1; k--) o.push([t - k, k]); return o; }   /* [큰, 작은] */
  NM_TGEN['g46_split'] = function (params, rng) {
    const skin = (params && params.skin) || 'plate';
    const lv = (params && params.level) || 'main';
    const lo = (params && params.lo) || (lv === 'practice' ? 3 : 6), hi = (params && params.hi) || (lv === 'practice' ? 5 : 9);
    const total = R(rng, lo, hi);
    const U = unorderedSplits(total);
    const ordered = skin === 'paint';
    const e = skin === 'paint' ? pick(rng, ['🌼', '⚫', '🪙', '⭐']) : skin === 'circle' ? pick(rng, ['⚫', '🍎', '⭐', '🐤']) : skin === 'plate' ? pick(rng, TOK16) : skin === 'cake' ? 'candle' : null;
    const colors = pick(rng, PALETTES);
    const flip = ab => (R(rng, 0, 1) ? { a: ab[0], b: ab[1] } : { a: ab[1], b: ab[0] });
    let preset = [], rows = 1, parts = 0;
    if (skin === 'plate') {
      if (lv === 'practice') rows = 1;
      else { preset = [flip(pick(rng, U))]; rows = Math.min(2, U.length - 1); }
    } else if (skin === 'cake') {
      preset = [flip(pick(rng, U))]; rows = Math.min(3, U.length - 1);   /* 완성형: 남은 가르기를 전부 */
    } else if (skin === 'paint') {
      const pa = R(rng, 1, total - 1); preset = [{ a: pa, b: total - pa }];
      rows = Math.min(R(rng, 2, 4), total - 2);
    } else if (skin === 'bar') {
      const sp = pick(rng, U); preset = [flip(sp)]; rows = Math.min(2, U.length - 1);
    } else {                         /* circle: 동그라미 ⌊T/2⌋개를 서로 다르게 */
      parts = U.length;
      if (R(rng, 0, 1)) { preset = [flip(pick(rng, U))]; }
      rows = parts - preset.length;
    }
    const tot = total;
    const nameT = (e && TOK[e]) ? { ko: josa(TOK[e][0], '을', '를'), en: TOK[e][1], zh: TOK[e][2] } : null;
    let pr, pp;
    const T0 = tot;
    if (skin === 'plate') {
      pr = T(`접시에 ${nameT.ko} 모두 ${T0}개가 되게 올려요. 서로 다른 방법으로!`, `Put ${T0} ${nameT.en} on the two plates in all. Find different ways!`, `在两个盘子里一共放${T0}个${nameT.zh}。想想不同的分法！`);
      pp = T(`접시에 ${nameT.ko} 모두 ${T0}개가 되게 그려요. 서로 다른 방법으로!`, `Draw ${T0} ${nameT.en} on the two plates in all. Find different ways!`, `在两个盘子里一共画${T0}个${nameT.zh}。想想不同的分法！`);
    } else if (skin === 'cake') {
      pr = pp = T(`양초를 모두 ${T0}개가 되게 그려요. 서로 다른 방법으로!`, `Draw candles so there are ${T0} in all. Find different ways!`, `把蜡烛画成一共${T0}根，试试不同的分法！`);
    } else if (skin === 'paint') {
      pr = T(`두 가지 색으로 ${T0}개를 칠해요. 줄마다 서로 다르게!`, `Color all ${T0} with two colors. Make every row different!`, `用两种颜色给${T0}个涂色。每一行都不一样！`);
      pp = T(`두 가지 색으로 ${T0}개를 색칠해요. 줄마다 서로 다르게!`, `Color all ${T0} with two colors. Make every row different!`, `用两种颜色给${T0}个涂色。每一行都不一样！`);
    } else if (skin === 'bar') {
      pr = pp = T(`${T0}칸 막대를 두 가지 색으로 나눠 칠해요. 서로 다른 방법으로!`, `Split the ${T0}-box bar into two colors. Find different ways!`, `把${T0}格的横条涂成两种颜色。试试不同的分法！`);
    } else {
      pr = T(`점 ${T0}개를 동그라미 양쪽에 나눠 놓아요. 동그라미 ${parts}개를 서로 다르게 채워요!`, `Split ${T0} dots across the line in each circle. Fill all ${parts} circles in different ways!`, `把${T0}个点分在每个圆圈的两边。${parts}个圆圈要分得各不相同！`);
      pp = T(`점 ${T0}개를 동그라미 양쪽에 나눠 그려요. 동그라미 ${parts}개를 서로 다르게 채워요!`, `Draw ${T0} dots on the two sides of each circle. Fill all ${parts} circles in different ways!`, `把${T0}个点画在每个圆圈的两边。${parts}个圆圈要分得各不相同！`);
    }
    const extra = (skin !== 'circle' && preset.length)
      ? T(` 한 가지는 이미 있어요. ${rows}가지를 더 찾아요!`, ` One way is already there. Find ${rows} more!`, ` 已经有一种了，再找${rows}种！`) : T('', '', '');
    return base(T(pr.ko + extra.ko, pr.en + extra.en, pr.zh + extra.zh), 'splitDraw', T0, {
      skin, total: T0, rows, preset, parts, distinct: ordered ? 'ordered' : 'unordered', e, colors, keyFields: ['skin', 'total', 'rows', 'preset', 'parts', 'distinct', 'e', 'colors'],
      printAsk: T(pp.ko + extra.ko, pp.en + extra.en, pp.zh + extra.zh)
    });
  };

  /* ============================================================
     NL36  g46_addsub — 가르기 모형(숫자판)·남기기·덧셈식·같은 값·짝 잇기·토끼 합 칸
     ============================================================ */
  const ADD_ANI = ['animal:rabbit', 'animal:duck', 'animal:turtle', 'animal:squirrel', 'animal:bear', 'animal:deer', '🦋', '🐤', '🐟', '🐞'];
  const MINUS = '−';
  function exprVal(x) { return x.op === '+' ? x.a + x.b : x.a - x.b; }
  const exprStr = x => `${x.a} ${x.op === '+' ? '+' : MINUS} ${x.b}`;
  function allExprs(maxV) {
    const o = [];
    for (let a = 0; a <= 9; a++) for (let b = 0; b <= 9; b++) {
      if (a + b <= maxV && a >= 1 && b >= 1) o.push({ a, b, op: '+' });
      if (a - b >= 0 && a >= 1 && b >= 1 && a <= maxV + 2) o.push({ a, b, op: '-' });
    }
    return o;
  }
  const bondTree = (w, a, hide) => ({ whole: w, a, b: w - a, hide });

  NM_TGEN['g46_addsub'] = function (params, rng) {
    const mode = (params && params.mode) || 'bondNum';
    const lv = (params && params.level) || 'main';
    const practice = lv === 'practice', maxN = practice ? 5 : 9;

    /* ---- bondNum: 숫자 가르기 모형의 빈 동그라미 ---- */
    if (mode === 'bondNum') {
      const bar = !!(params && params.bar);
      const whole = bar ? R(rng, 5, 7) : R(rng, 2, maxN);
      const a = bar ? R(rng, 1, whole - 1) : R(rng, practice ? 1 : 0, practice ? whole - 1 : whole);
      const hide = (params && params.hide) || pick(rng, ['whole', 'a', 'b']);
      const val = hide === 'whole' ? whole : hide === 'a' ? a : whole - a;
      return base(bar ? T('막대를 보고 가르기 모형의 빈 동그라미에 들어갈 수는?', 'Look at the bar. What number goes in the empty circle?', '看着横条，空圆圈里填几？') : T('빈 동그라미에 들어갈 수는?', 'What number goes in the empty circle?', '空圆圈里填几？'),
        'bondNum', val, {
          interaction: 'fill', whole, a, b: whole - a, hide, bar: bar ? { T: whole, k: a } : null, chips: chips(rng, val, 0, maxN), keyFields: ['whole', 'a', 'hide', 'bar'],
          printAsk: T('빈 동그라미에 알맞은 수를 쓰세요.', 'Write the number for the empty circle.', '在空圆圈里写出合适的数。')
        });
    }
    if (mode === 'bondMax') {
      let trees, vals;
      for (let t = 0; t < 80; t++) {
        trees = range(0, 3).map(() => { const w = R(rng, 2, maxN); return bondTree(w, R(rng, practice ? 1 : 0, practice ? w - 1 : w), pick(rng, ['whole', 'a', 'b'])); });
        vals = trees.map(x => x[x.hide]);
        if (new Set(vals).size === 4) break;
      }
      const top = Math.max.apply(null, vals);
      return base(T('빈 동그라미에 들어갈 수가 가장 큰 모형을 눌러요', 'Tap the diagram whose empty circle needs the biggest number.', '点出空圆圈里要填的数最大的那个图。'),
        'bondNum', vals.indexOf(top) + 1, { interaction: 'max', trees, keyFields: ['trees', 'interaction'],
          printAsk: T('빈 동그라미에 들어갈 수가 가장 큰 모형에 ○표 하세요.', 'Circle the diagram whose empty circle needs the biggest number.', '圈出空圆圈里要填的数最大的那个图。') });
    }

    /* ---- leave: 몇 개를 없애야 R 개가 남을까 ---- */
    if (mode === 'leave') {
      const skin = pick(rng, (params && params.skins) || ['balloon']);
      const Tn = R(rng, practice ? 2 : 3, maxN), Rk = R(rng, 0, Tn - 1);
      let head, tap, tail;
      if (skin === 'balloon') {
        head = T(`풍선이 ${Tn}개 있어요. ${Rk ? Rk + '개만 남으려면' : '하나도 안 남으려면'} 몇 개를 날려 보내야 할까요?`, `There are ${Tn} balloons. To leave ${Rk ? 'only ' + Rk : 'none'}, how many must fly away?`, `有${Tn}个气球。${Rk ? '只留下' + Rk + '个' : '一个也不留'}，要飞走几个？`);
        tap = T('날릴 풍선을 눌러요', 'Tap the ones to send away.', '点一点要飞走的气球。');
        tail = T('날릴 풍선에 ×표 하고, 몇 개인지 쓰세요.', 'Cross out the balloons to send away, then write how many.', '在要飞走的气球上画×，再写出个数。');
      } else if (skin === 'cookie') {
        head = T(`쿠키가 ${Tn}개 있어요. ${Rk ? Rk + '개만 남기려면' : '하나도 안 남기려면'} 몇 개를 먹어야 할까요?`, `There are ${Tn} cookies. To leave ${Rk ? 'only ' + Rk : 'none'}, how many must be eaten?`, `有${Tn}块饼干。${Rk ? '只留下' + Rk + '块' : '一块也不留'}，要吃掉几块？`);
        tap = T('먹을 쿠키를 눌러요', 'Tap the ones to eat.', '点一点要吃掉的饼干。');
        tail = T('먹을 쿠키에 ×표 하고, 몇 개인지 쓰세요.', 'Cross out the cookies to eat, then write how many.', '在要吃掉的饼干上画×，再写出个数。');
      } else {
        head = T(`막대가 ${Tn}칸 있어요. ${Rk ? Rk + '칸만 남기려면' : '하나도 안 남기려면'} 몇 칸을 지워야 할까요?`, `A bar has ${Tn} boxes. To leave ${Rk ? 'only ' + Rk : 'none'}, how many must be erased?`, `横条有${Tn}格。${Rk ? '只留下' + Rk + '格' : '一格也不留'}，要擦掉几格？`);
        tap = T('지울 칸을 눌러요', 'Tap the boxes to erase.', '点一点要擦掉的格子。');
        tail = T('지울 칸에 ×표 하고, 몇 칸인지 쓰세요.', 'Cross out the boxes to erase, then write how many.', '在要擦掉的格子上画×，再写出格数。');
      }
      return base(T(`${head.ko} ${tap.ko}`, `${head.en} ${tap.en}`, `${head.zh}${tap.zh}`), 'crossLeave', Tn - Rk, {
        skin, total: Tn, keep: Rk, e: skin === 'balloon' ? '🎈' : skin === 'cookie' ? '🍪' : null, eq: skin === 'bar' && !!(params && params.eq), keyFields: ['skin', 'total', 'keep', 'eq'],
        printAsk: T(`${head.ko} ${tail.ko}`, `${head.en} ${tail.en}`, `${head.zh}${tail.zh}`)
      });
    }

    /* ---- addEq: 두 무리를 합한 덧셈식 (고르기 / 합 쓰기) ---- */
    if (mode === 'addEq') {
      const input = (params && params.input) || 'pick';
      const a = R(rng, 1, practice ? 3 : 6), b = R(rng, 1, practice ? 4 - 0 : 6);
      let A = a, B = b;
      while (A + B > maxN) { A = R(rng, 1, practice ? 3 : 6); B = R(rng, 1, practice ? 3 : 6); }
      const s = A + B, ea = pick(rng, ADD_ANI);
      let eb = pick(rng, ADD_ANI); while (eb === ea) eb = pick(rng, ADD_ANI);
      const groups = [{ e: ea, n: A }, { e: eb, n: B }];
      if (input === 'write') {
        return base(T('두 무리를 합하면 모두 몇 마리일까요? 합을 써요', 'How many animals in all? Write the sum.', '两群合起来一共几只？写出和。'),
          'g46Sum', s, { groups, eqLine: `${A} + ${B} = ?`, keyFields: ['groups'], printAsk: T('두 무리를 합하면 모두 몇 마리일까요? 합을 쓰세요.', 'How many animals in all? Write the sum.', '两群合起来一共几只？写出和。') });
      }
      const B2 = B + 1 <= 6 && A + B + 1 <= 9 ? B + 1 : B - 1;
      const right = `${A} + ${B} = ${s}`;
      const cands = [`${A} + ${B} = ${s + 1 <= 9 ? s + 1 : s - 1}`, `${A} + ${B2} = ${A + B2}`, `${A + 1} + ${B} = ${A + 1 + B}`, `${A} + ${B} = ${s + 2 <= 9 ? s + 2 : s - 2}`];
      const list = [right];
      cands.forEach(c => { if (!list.includes(c) && list.length < 3) list.push(c); });
      const choices = shuffle(rng, list);
      return base(T('두 무리를 합하면 모두 몇 마리일까요? 맞는 식을 골라요', 'How many animals in all? Pick the right equation.', '两群合起来一共几只？选出正确的算式。'),
        'pickCard', choices.indexOf(right) + 1, {
          stemParts: [{ k: 'groups', list: groups, sign: '+' }], choices: choices.map(t => ({ t })), keyFields: ['stemParts'],
          printAsk: T('두 무리를 합하면 모두 몇 마리일까요? 맞는 식에 ○표 하세요.', 'How many animals in all? Circle the right equation.', '两群合起来一共几只？圈出正确的算式。')
        });
    }

    /* ---- sameSum: 답이 같은 식 ---- */
    if (mode === 'sameSum') {
      const ex = allExprs(maxN), stem = pick(rng, ex), v = exprVal(stem);
      const same = shuffle(rng, ex.filter(x => exprVal(x) === v && exprStr(x) !== exprStr(stem)));
      const diff = shuffle(rng, ex.filter(x => exprVal(x) !== v));
      if (!same.length) return NM_TGEN['g46_addsub'](params, rng);
      const seen = new Set([exprStr(stem), exprStr(same[0])]), wrong = [];
      for (const x of diff) { if (!seen.has(exprStr(x)) && wrong.length < 3) { seen.add(exprStr(x)); wrong.push(x); } }
      const choices = shuffle(rng, [same[0]].concat(wrong)), ans = choices.indexOf(same[0]) + 1;
      const last = Math.abs(stem.b) % 10, eqL = exprStr(stem);
      return base(T(`${eqL}${NUM_BATCHIM[last] ? '과' : '와'} 답이 같은 식을 골라요`, `Pick the expression with the same answer as ${eqL}.`, `选出和${eqL}答案相同的算式。`),
        'pickCard', ans, {
          stemParts: [{ k: 'eq', t: eqL }], choices: choices.map(x => ({ t: exprStr(x) })), keyFields: ['stemParts'],
          printAsk: T(`${eqL}${NUM_BATCHIM[last] ? '과' : '와'} 답이 같은 식에 ○표 하세요.`, `Circle the expression with the same answer as ${eqL}.`, `圈出和${eqL}答案相同的算式。`)
        });
    }

    /* ---- pairPick: 합이 t 인 짝 ---- */
    if (mode === 'pairPick') {
      const t = R(rng, 3, maxN);
      const a = R(rng, 1, t - 1), right = [a, t - a];
      const wrongs = [];
      for (let g = 0; g < 80 && wrongs.length < (practice ? 2 : 3); g++) {
        const w = pick(rng, [t - 2, t - 1, t + 1, t + 2]);
        if (w < 2 || w > 9) continue;
        const x = R(rng, 1, w - 1), p = [x, w - x];
        if (!wrongs.some(q => q[0] === p[0] && q[1] === p[1]) && !(p[0] === right[0] && p[1] === right[1])) wrongs.push(p);
      }
      const choices = shuffle(rng, [right].concat(wrongs));
      return base(T(`두 수를 더해서 ${nj(t, '이', '가')} 되는 짝을 골라요`, `Pick the pair that adds up to ${t}.`, `选出相加等于${t}的一对数。`),
        'pickCard', choices.indexOf(right) + 1, {
          stemParts: [{ k: 'text', t: T(`합이 ${t}`, `Sum: ${t}`, `和是${t}`) }], choices: choices.map(p => ({ t: `(${p[0]}, ${p[1]})` })), keyFields: ['stemParts'],
          printAsk: T(`두 수를 더해서 ${nj(t, '이', '가')} 되는 짝에 ○표 하세요.`, `Circle the pair that adds up to ${t}.`, `圈出相加等于${t}的一对数。`)
        });
    }

    /* ---- pairSum · exprMatch · objMatch: 짝 잇기(g46Match) ---- */
    if (mode === 'pairSum') {
      const N = practice ? 3 : 4, S = R(rng, N + 1, practice ? 5 : 9);
      const left = shuffle(rng, range(1, S - 1)).slice(0, N), right = shuffle(rng, left.map(v => S - v));
      return base(T(`합이 ${nj(S, '이', '가')} 되도록 두 수를 이어요`, `Match two numbers that add up to ${S}.`, `把相加等于${S}的两个数连起来。`), 'g46Match', N,
        { left, right, rightType: 'num', matchRule: 'sum', sumTo: S, keyFields: ['left', 'right', 'matchRule', 'sumTo'],
          printAsk: T(`합이 ${nj(S, '이', '가')} 되도록 두 수를 선으로 이어요.`, `Draw lines between two numbers that add up to ${S}.`, `用线把相加等于${S}的两个数连起来。`) });
    }
    if (mode === 'exprMatch') {
      const N = 3, ex = allExprs(maxN), picked = [], seen = new Set();
      for (const x of shuffle(rng, ex)) { const v = exprVal(x); if (!seen.has(v) && picked.length < N) { seen.add(v); picked.push(x); } }
      const left = picked.map(exprVal), right = shuffle(rng, left.slice());
      return base(T('식과 같은 수를 이어요', 'Match each expression to its answer.', '把算式和得数连起来。'), 'g46Match', N,
        { left, leftLabels: picked.map(exprStr), right, rightType: 'num', keyFields: ['left', 'leftLabels', 'right'],
          printAsk: T('식과 값이 같은 수를 선으로 이어요.', 'Draw lines from each expression to its answer.', '用线把算式和得数连起来。') });
    }
    if (mode === 'objMatch') {
      const N = 3, nums = shuffle(rng, range(1, maxN)).slice(0, N), toks = shuffle(rng, ['⚽', '🏀', '🐞', '🍎', '⭐']).slice(0, N);
      const order = shuffle(rng, range(0, N - 1));
      return base(T('그림의 수와 같은 수를 이어요', 'Match each number to the picture with that many.', '把数字和同样多的图连起来。'), 'g46Match', N,
        { left: shuffle(rng, nums.slice()), right: order.map(i => nums[i]), rightEm: order.map(i => toks[i]), rightType: 'objs', keyFields: ['left', 'right', 'rightEm', 'rightType'],
          printAsk: T('수와 같은 개수의 그림을 선으로 이어요.', 'Draw lines from each number to the picture with that many.', '用线把数字和同样多的图连起来。') });
    }

    /* ---- grid: 토끼 2×2 칸의 줄·열 합 ---- */
    const lim = practice ? 3 : 4, cap = practice ? 5 : 9;
    let cells, ask;
    for (let t = 0; t < 200; t++) {
      cells = [[R(rng, 1, lim), R(rng, 1, lim)], [R(rng, 1, lim), R(rng, 1, lim)]];
      const s = cells[0][0] + cells[0][1] + cells[1][0] + cells[1][1];
      const sums = [cells[0][0] + cells[0][1], cells[1][0] + cells[1][1], cells[0][0] + cells[1][0], cells[0][1] + cells[1][1]];
      if (Math.max.apply(null, sums) <= cap && s <= 9) break;
    }
    ask = pick(rng, practice ? ['row0', 'row1', 'col0', 'col1'] : ['row0', 'row1', 'col0', 'col1', 'all']);
    const rs = [cells[0][0] + cells[0][1], cells[1][0] + cells[1][1]], cs = [cells[0][0] + cells[1][0], cells[0][1] + cells[1][1]], total = rs[0] + rs[1];
    const answer = ask === 'row0' ? rs[0] : ask === 'row1' ? rs[1] : ask === 'col0' ? cs[0] : ask === 'col1' ? cs[1] : total;
    const show = ['row0', 'row1', 'col0', 'col1'].filter(k => k !== ask);
    const where = { row0: T('윗줄', 'top row', '上面一行'), row1: T('아랫줄', 'bottom row', '下面一行'), col0: T('왼쪽 줄', 'left column', '左边一列'), col1: T('오른쪽 줄', 'right column', '右边一列'), all: T('전체', 'all', '全部') }[ask];
    return base(ask === 'all' ? T('토끼는 모두 몇 마리일까요?', 'How many rabbits in all?', '一共有几只兔子？') : T(`${where.ko}에 있는 토끼는 모두 몇 마리일까요?`, `How many rabbits in the ${where.en}?`, `${where.zh}一共有几只兔子？`),
      'rabbitGrid', answer, { cells, e: 'animal:rabbit', ask, show, chips: chips(rng, answer, 1, 9), keyFields: ['cells', 'ask', 'show'],
        printAsk: ask === 'all' ? T('토끼는 모두 몇 마리일까요? 수를 쓰세요.', 'How many rabbits in all? Write the number.', '一共有几只兔子？写出数。') : T(`${where.ko}에 있는 토끼는 모두 몇 마리일까요? 수를 쓰세요.`, `How many rabbits in the ${where.en}? Write the number.`, `${where.zh}一共有几只兔子？写出数。`) });
  };
})();
