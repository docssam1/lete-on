/* ============================================================
   Numbers of Magic — 유아 교재 G1-13·14·15호 생성기 (NL57~NL66)
   계약: NM_TGEN[이름] = function(params, rng){ return problem }  — rng 만 사용(Math.random 금지).
   위젯 답은 숫자 하나: 여러 칸·여러 답은 위젯이 규칙으로 안에서 판정해 맞으면 problem.answer 를 낸다.
   여러 값을 한 숫자로 줄일 때는 enc([a,b,c]) = 한 자리씩 이어 붙인 수(모든 값 0~9). 정답지는 label 훅이 풀어서 적는다.
   ⚠️ 모든 문구·장면은 창작(교재 문장 그대로 아님). 수는 화면 전체에서 9 이내.
   ============================================================ */
(function () {
  'use strict';

  const { R, pick, shuffle } = NM_RNG;
  const T3 = (ko, en, zh) => ({ ko, en, zh });
  const enc = arr => arr.reduce((s, v) => s * 10 + v, 0);

  /* 받침 유무로 조사 고르기(nl.js josa 와 같은 규칙) */
  function josa(w, withB, noB) {
    const c = String(w).charCodeAt(String(w).length - 1);
    const b = c >= 0xAC00 && c <= 0xD7A3 && ((c - 0xAC00) % 28) !== 0;
    return w + (b ? withB : noB);
  }

  /* 정답 + 이웃 수 2개(범위 lo~hi) — 섞어서 3개 */
  /* 숫자 뒤 조사 — 0 영·1 일·3 삼·6 육·7 칠·8 팔은 받침 있음 */
  const HB = n => '013678'.indexOf(String(n)) >= 0;
  const nI = n => n + (HB(n) ? '이' : '가'), nIeyo = n => n + (HB(n) ? '이에요' : '예요'), nEul = n => n + (HB(n) ? '을' : '를');
  function near3(rng, ans, lo, hi) {
    const near = [], far = [];
    for (let v = lo; v <= hi; v++) {
      if (v === ans) continue;
      (Math.abs(v - ans) <= 2 ? near : far).push(v);
    }
    const src = near.length >= 2 ? near : near.concat(far);
    const two = shuffle(rng, src).slice(0, 2);
    return shuffle(rng, [ans].concat(two));
  }

  /* 소품 풀: [토큰, ko, en, zh] — 'animal:…' 은 동물 그림 */
  const FRUITS = [
    ['🍎', '사과', 'apples', '苹果'], ['🍌', '바나나', 'bananas', '香蕉'], ['🍓', '딸기', 'strawberries', '草莓'],
    ['🍪', '쿠키', 'cookies', '饼干'], ['⭐', '별', 'stars', '星星'], ['🎈', '풍선', 'balloons', '气球'],
    ['🐟', '물고기', 'fish', '鱼'], ['🍬', '사탕', 'candies', '糖果']
  ];
  const ANIMALS = [
    ['animal:rabbit', '토끼', 'rabbit', '小兔'], ['animal:bear', '곰', 'bear', '小熊'], ['animal:turtle', '거북이', 'turtle', '乌龟'],
    ['animal:fox', '여우', 'fox', '狐狸'], ['animal:duck', '오리', 'duck', '小鸭'], ['animal:squirrel', '다람쥐', 'squirrel', '松鼠']
  ];

  /* ============================================================
     G1-13 — 더하기와 빼기 Ⅱ (제약 조건 퍼즐)
     ============================================================ */

  /* ── NL57 g13_overlap — 겹친 도형 안의 수의 합 ──────────────
     shape:'square'|'circle'(0 이면 섞음), n:2|3 (0 이면 섞음). 빈 칸 하나, 보기 3개. */
  const OVERLAP_GEOM = {
    'square2': { vb: [100, 60], geom: [{ k: 'rect', x: 4, y: 6, w: 54, h: 40 }, { k: 'rect', x: 42, y: 14, w: 54, h: 40 }],
      ids: ['a', 'x', 'b'], at: { a: [22, 26], x: [50, 30], b: [77, 34] }, sets: [['a', 'x'], ['x', 'b']] },
    'square3': { vb: [100, 58], geom: [{ k: 'rect', x: 3, y: 6, w: 38, h: 38 }, { k: 'rect', x: 27, y: 14, w: 46, h: 38 }, { k: 'rect', x: 59, y: 6, w: 38, h: 38 }],
      ids: ['a', 'x', 'm', 'y', 'b'], at: { a: [15, 25], x: [34, 29], m: [50, 33], y: [66, 29], b: [85, 25] }, sets: [['a', 'x'], ['x', 'm', 'y'], ['y', 'b']] },
    'circle2': { vb: [100, 60], geom: [{ k: 'circle', cx: 35, cy: 30, r: 26 }, { k: 'circle', cx: 65, cy: 30, r: 26 }],
      ids: ['a', 'x', 'b'], at: { a: [21, 30], x: [50, 30], b: [79, 30] }, sets: [['a', 'x'], ['x', 'b']] },
    'circle3': { vb: [100, 56], geom: [{ k: 'circle', cx: 24, cy: 28, r: 21 }, { k: 'circle', cx: 50, cy: 28, r: 21 }, { k: 'circle', cx: 76, cy: 28, r: 21 }],
      ids: ['a', 'x', 'm', 'y', 'b'], at: { a: [14, 28], x: [37, 28], m: [50, 28], y: [63, 28], b: [86, 28] }, sets: [['a', 'x'], ['x', 'm', 'y'], ['y', 'b']] }
  };
  NM_TGEN['g13_overlap'] = function (params, rng) {
    const shape = (params && params.shape) || pick(rng, ['square', 'circle']);
    const n = (params && params.n) || pick(rng, [2, 3]);
    const G = OVERLAP_GEOM[shape + n];
    const v = {};
    if (n === 2) {                       /* A+X = X+B = T → A = B */
      let T;
      do { v.a = R(rng, 1, 5); v.x = R(rng, 1, 4); T = v.a + v.x; } while (T > 9);
      v.b = v.a;
    } else {
      let T;
      do { v.x = R(rng, 1, 4); v.y = R(rng, 1, 4); v.m = R(rng, 1, 5); T = v.x + v.m + v.y; } while (T > 9);
      v.a = T - v.x; v.b = T - v.y;
    }
    const T = G.sets[0].reduce((s, id) => s + v[id], 0);
    const askId = pick(rng, G.ids);
    const answer = v[askId];
    const regions = G.ids.map(id => ({ id, v: id === askId ? null : v[id], at: G.at[id] }));
    const sq = shape === 'square';
    return {
      prompt: sq ? T3(`큰 네모 하나 안의 수를 모두 더하면 ${nIeyo(T)}. 빈 칸에 올 수를 골라요`,
        `Add up the numbers inside one big square — it makes ${T}. Pick the number for the blank`,
        `一个大方块里的数加起来是${T}。选出空格里的数`)
        : T3(`큰 원 하나 안의 수를 모두 더하면 ${nIeyo(T)}. 빈 칸에 올 수를 골라요`,
        `Add up the numbers inside one big circle — it makes ${T}. Pick the number for the blank`,
        `一个大圆圈里的数加起来是${T}。选出空格里的数`),
      answer, answerType: 'number', widget: 'overlapSum',
      shape, n, vb: G.vb, geom: G.geom, sets: G.sets, regions, target: T, askId,
      choices: near3(rng, answer, 1, 9),
      keyFields: ['shape', 'n', 'regions', 'target']
    };
  };

  /* ── NL58 g13_weights — 분동 만들기 / 균형 저울 ─────────────
     mode:'weigh'  level 'practice'(분동 3종 아무거나, 답 여러 개) | 'main'(1·2·4g 이진 분해)
     mode:'balance' level 'practice'(물체 반대쪽 접시) | 'main'(물체와 같은 접시의 분동) */
  function subsetsSum(ws, t, maxPick) {
    const out = [], n = ws.length;
    for (let m = 1; m < (1 << n); m++) {
      const s = []; let sum = 0;
      for (let i = 0; i < n; i++) if (m & (1 << i)) { s.push(ws[i]); sum += ws[i]; }
      if (sum === t && s.length <= maxPick) out.push(s);
    }
    return out.sort((a, b) => a.length - b.length || (a.join() < b.join() ? -1 : 1));
  }
  const W3 = [];
  for (let a = 1; a <= 5; a++) for (let b = a + 1; b <= 5; b++) for (let c = b + 1; c <= 5; c++) W3.push([a, b, c]);
  NM_TGEN['g13_weights'] = function (params, rng) {
    const mode = (params && params.mode) || 'weigh';
    const lv = (params && params.level) || 'main';
    if (mode === 'balance') {
      let objW, objSide = R(rng, 0, 1), fixedW, q;
      if (lv === 'practice') {            /* 물체 반대쪽: 알려진 분동 w1 + 빈 분동 = 물체 */
        do { fixedW = R(rng, 1, 5); q = R(rng, 1, 5); objW = fixedW + q; } while (objW > 9);
        return {
          prompt: T3('저울이 평평해요! 빈 분동은 몇 g일까요?', 'The scale is level! How many g is the blank weight?', '天平是平的！空白的砝码是几克？'),
          answer: q, answerType: 'number', widget: 'balanceEq',
          objW, objSide, fixed: [{ side: 1 - objSide, w: fixedW }], blank: { side: 1 - objSide },
          choices: near3(rng, q, 1, 5), keyFields: ['objW', 'objSide', 'fixed', 'blank']
        };
      }
      /* main: 물체와 같은 접시에 빈 분동이 있고, 반대쪽에 큰 분동 하나 */
      const w2 = R(rng, 2, 5); objW = R(rng, 1, w2 - 1); q = w2 - objW;
      return {
        prompt: T3('저울이 평평해요! 빈 분동은 몇 g일까요?', 'The scale is level! How many g is the blank weight?', '天平是平的！空白的砝码是几克？'),
        answer: q, answerType: 'number', widget: 'balanceEq',
        objW, objSide, fixed: [{ side: 1 - objSide, w: w2 }], blank: { side: objSide },
        choices: near3(rng, q, 1, 5), keyFields: ['objW', 'objSide', 'fixed', 'blank']
      };
    }
    /* weigh */
    let weights, target;
    if (lv === 'practice') {
      weights = pick(rng, W3);
      const sums = []; for (let t = 3; t <= 9; t++) if (subsetsSum(weights, t, 3).length) sums.push(t);
      target = pick(rng, sums);
    } else {
      weights = pick(rng, [[1, 2, 4], [1, 2, 4, 8]]);
      const hi = weights.length === 3 ? 7 : 9;
      target = R(rng, 3, hi);
    }
    const solutions = subsetsSum(weights, target, 3);
    return {
      prompt: T3(`분동을 올려 ${target}g을 만들어요`, `Put weights on the pan to make ${target} g`, `把砝码放到盘里，凑成${target}克`),
      answer: target, answerType: 'number', widget: 'weightPick',
      weights, target, maxPick: 3, solutions, keyFields: ['weights', 'target']
    };
  };

  /* ── NL59 g13_pathsum — 합이 가장 작은 길 ───────────────────
     rows·cols·moves:'ru'|'dr'·lo·hi. 최소 합 길이 하나뿐이고 ≤9. 3칸 이상 판은 '작은 수만 쫓는 길'이 최소가
     아닌 판을 절반쯤 섞는다. */
  function pathEnum(cells, rows, cols, moves) {
    const start = moves === 'ru' ? [rows - 1, 0] : [0, 0];
    const goal = moves === 'ru' ? [0, cols - 1] : [rows - 1, cols - 1];
    const dr = moves === 'ru' ? -1 : 1;
    const all = [];
    (function walk(r, c, path) {
      path = path.concat([[r, c]]);
      if (r === goal[0] && c === goal[1]) { all.push(path); return; }
      if (c < cols - 1) walk(r, c + 1, path);
      if (r + dr >= 0 && r + dr < rows && (moves === 'ru' ? r > goal[0] : r < goal[0])) walk(r + dr, c, path);
    })(start[0], start[1], []);
    const sums = all.map(p => p.reduce((s, [r, c]) => s + cells[r][c], 0));
    const min = Math.min.apply(null, sums);
    const mins = all.filter((p, i) => sums[i] === min);
    /* 탐욕: 다음 두 칸 중 작은 쪽(같으면 오른쪽) */
    let r = start[0], c = start[1], gs = cells[r][c];
    while (!(r === goal[0] && c === goal[1])) {
      const opts = [];
      if (c < cols - 1) opts.push([r, c + 1]);
      if (r !== goal[0]) opts.push([r + dr, c]);
      opts.sort((p, q) => cells[p[0]][p[1]] - cells[q[0]][q[1]]);
      [r, c] = opts[0]; gs += cells[r][c];
    }
    return { start, goal, min, mins, greedy: gs, nPaths: all.length };
  }
  NM_TGEN['g13_pathsum'] = function (params, rng) {
    const P = params || {};
    const rows = P.rows || 3, cols = P.cols || 3, moves = P.moves || 'ru', lo = P.lo || 1, hi = P.hi || 3;
    let best = null;
    const wantTrap = rows * cols >= 6 && R(rng, 0, 1) === 1;
    for (let tries = 0; tries < 400; tries++) {
      const cells = [];
      for (let r = 0; r < rows; r++) { const row = []; for (let c = 0; c < cols; c++) row.push(R(rng, lo, hi)); cells.push(row); }
      const info = pathEnum(cells, rows, cols, moves);
      if (info.min > 9 || info.mins.length !== 1) continue;
      if (info.nPaths > 1 && wantTrap && info.greedy === info.min) continue;
      best = { cells, info }; break;
    }
    if (!best) {                          /* 안전장치 — 고정 판 */
      const cells = rows === 2 && cols === 2 ? [[2, 1], [1, 3]] : [[2, 1, 3], [1, 2, 1], [3, 1, 1]];
      best = { cells, info: pathEnum(cells, rows, cols, moves) };
    }
    const { cells, info } = best;
    return {
      prompt: T3('출발에서 도착까지 지나는 수를 더해요. 합이 가장 작은 길을 찾아요',
        'Add the numbers on your way from start to finish. Find the smallest total',
        '从起点走到终点，把经过的数加起来。找出和最小的路'),
      answer: info.min, answerType: 'number', widget: 'pathSum',
      rows, cols, cells, start: info.start, goal: info.goal, moves, minPath: info.mins[0],
      keyFields: ['cells', 'moves']
    };
  };

  /* ── NL60 g13_sumpuzzle — 가로·세로 합 / 십자 / 짝짓기 / 꼭짓점 ─
     mode:'gridsum' n·T 범위·blanks / 'crossplace' level / 'pairs' k / 'ring' level */
  function peelable(grid, blanks, n) {
    const known = grid.map(r => r.map(() => true));
    blanks.forEach(([r, c]) => { known[r][c] = false; });
    let prog = true;
    while (prog) {
      prog = false;
      for (let i = 0; i < n; i++) {
        let unk = [];
        for (let c = 0; c < n; c++) if (!known[i][c]) unk.push([i, c]);
        if (unk.length === 1) { known[unk[0][0]][unk[0][1]] = true; prog = true; }
        unk = [];
        for (let r = 0; r < n; r++) if (!known[r][i]) unk.push([r, i]);
        if (unk.length === 1) { known[unk[0][0]][unk[0][1]] = true; prog = true; }
      }
    }
    return known.every(r => r.every(Boolean));
  }
  const CROSS_SOL = { 8: { c: 1, pairs: [[2, 5], [3, 4]] }, 9: { c: 3, pairs: [[1, 5], [2, 4]] } };
  NM_TGEN['g13_sumpuzzle'] = function (params, rng) {
    const P = params || {};
    const mode = P.mode || 'gridsum';

    if (mode === 'gridsum') {
      const n = P.n || 3;
      const T = n === 3 ? pick(rng, [4, 5]) : pick(rng, [5, 6, 7]);
      const bmin = P.blanks ? P.blanks[0] : 1, bmax = P.blanks ? P.blanks[1] : 2;
      let grid, blanks, ok = false;
      for (let tries = 0; tries < 600 && !ok; tries++) {
        grid = []; for (let r = 0; r < n; r++) grid.push(new Array(n).fill(0));
        for (let t = 0; t < T; t++) { const p = shuffle(rng, [...Array(n).keys()]); for (let r = 0; r < n; r++) grid[r][p[r]]++; }
        if (grid.some(r => r.some(v => v > 4))) continue;
        const k = R(rng, bmin, bmax);
        const cells = shuffle(rng, [].concat(...grid.map((r, ri) => r.map((_, ci) => [ri, ci]))));
        blanks = cells.slice(0, k).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
        ok = peelable(grid, blanks, n);
      }
      const shown = grid.map(r => r.slice());
      blanks.forEach(([r, c]) => { shown[r][c] = null; });
      return {
        prompt: T3(`가로줄과 세로줄의 합이 모두 ${nI(T)} 되도록 빈 칸을 채워요`,
          `Fill the blanks so every row and every column adds up to ${T}`,
          `填空，让每一行、每一列的和都是${T}`),
        answer: T, answerType: 'number', widget: 'gridSum',
        n, T, grid: shown, blanks, sol: grid, keyFields: ['grid', 'T', 'n']
      };
    }

    if (mode === 'crossplace') {
      const T = pick(rng, [8, 9]);
      const S = CROSS_SOL[T];
      const pp = shuffle(rng, S.pairs.map(p => shuffle(rng, p)));
      const sol = { c: S.c, u: pp[0][0], d: pp[0][1], l: pp[1][0], r: pp[1][1] };
      const lv = P.level || 'main';
      const keep = lv === 'practice' ? 2 : (R(rng, 1, 100) <= 85 ? 1 : 0);
      const arms = shuffle(rng, ['u', 'd', 'l', 'r']).slice(0, keep);
      const cells = { c: sol.c, u: null, d: null, l: null, r: null };
      arms.forEach(k => { cells[k] = sol[k]; });
      return {
        prompt: T3(`1부터 5까지를 한 번씩 넣어서, 가로 세 수와 세로 세 수의 합이 모두 ${nI(T)} 되게 해요`,
          `Use 1 to 5 once each so the row of three and the column of three both add to ${T}`,
          `1到5各用一次，让横着三个数和竖着三个数的和都是${T}`),
        answer: T, answerType: 'number', widget: 'crossPlace',
        T, nums: [1, 2, 3, 4, 5], cells, sol, keyFields: ['cells', 'T']
      };
    }

    if (mode === 'pairs') {
      const k = P.k || 2;
      const T = R(rng, 5, 9);
      const pr = [];
      for (let a = 0; a < T - a; a++) if (T - a <= 9) pr.push([a, T - a]);
      if (pr.length < k) return NM_TGEN['g13_sumpuzzle'](P, rng);   /* 쌍이 모자란 합은 다시 */
      const use = shuffle(rng, pr).slice(0, k);
      const cards = shuffle(rng, [].concat(...use));
      const sig = cards.slice().sort((a, b) => a - b).join('-');
      return {
        prompt: T3('카드를 두 장씩 묶어요. 묶은 합이 모두 같아지게!',
          'Pair up the cards two by two so every pair adds to the same number',
          '把卡片两张两张配对，让每一对的和都相同'),
        answer: T, answerType: 'number', widget: 'pairUp',
        cards, k, T, sig, pairs: use, keyFields: ['sig']
      };
    }

    /* ring — 네 꼭짓점 합(P3) */
    const lv = P.level || 'practice';
    const nb = lv === 'practice' ? 1 : 2;
    for (let tries = 0; tries < 200; tries++) {
      const corners = shuffle(rng, [1, 2, 3, 4, 5]).slice(0, 4);
      const sides = corners.map((c, i) => c + corners[(i + 1) % 4]);
      const idx = shuffle(rng, [0, 1, 2, 3]).slice(0, nb).sort();
      /* 해가 하나뿐인지 — 빈 꼭짓점에 1~5 를 서로 다르게 넣어 보며 센다 */
      let count = 0;
      (function fill(k, cur, used) {
        if (k === idx.length) {
          if (cur.every((c, i) => c + cur[(i + 1) % 4] === sides[i])) count++;
          return;
        }
        for (let v = 1; v <= 5; v++) if (!used.includes(v)) { const nx = cur.slice(); nx[idx[k]] = v; fill(k + 1, nx, used.concat([v])); }
      })(0, corners.map((c, i) => idx.includes(i) ? 0 : c), corners.filter((c, i) => !idx.includes(i)));
      if (count !== 1) continue;
      const shown = corners.map((c, i) => idx.includes(i) ? null : c);
      const vals = idx.map(i => corners[i]);
      return {
        prompt: T3('네 꼭짓점의 수를 더하면 변 위의 수가 돼요. 빈 꼭짓점에 알맞은 수를 넣어요',
          'Two neighboring corners add up to the number on the side between them. Fill the empty corners',
          '相邻两个顶点的数相加，就是它们之间边上的数。把空顶点填上'),
        answer: enc(vals), answerType: 'number', widget: 'ringSum',
        corners: shown, sides, blanks: idx, sol: corners, nums: [1, 2, 3, 4, 5],
        choices: nb === 1 ? near3(rng, vals[0], 1, 5) : null, keyFields: ['corners', 'sides']
      };
    }
    return NM_TGEN['g13_sumpuzzle'](P, rng);
  };

  /* ============================================================
     G1-14 — 규칙·약속·모양수
     ============================================================ */

  /* ── NL61 g14_rules — 규칙 표 / 숫자 기차 / 막대 기호 ───────
     mode:'table' level 1(합) 2(차) 3(4열 합) · 'train' level 1(차 일정) 2(차 제각각) · 'rod' level read|add */
  NM_TGEN['g14_rules'] = function (params, rng) {
    const P = params || {};
    const mode = P.mode || 'table';

    if (mode === 'table') {
      const lv = P.level || 1;
      const rows = [], seen = {};
      while (rows.length < 4) {
        let row;
        if (lv === 1) { const a = R(rng, 1, 5), b = R(rng, 1, 5); if (a + b > 9) continue; row = [a, b, a + b]; }
        else if (lv === 2) { const a = R(rng, 2, 9), b = R(rng, 1, Math.min(5, a - 1)); row = [a, b, a - b]; }
        else { const a = R(rng, 1, 3), b = R(rng, 1, 3), c = R(rng, 1, 3); row = [a, b, c, a + b + c]; }
        const k = row.slice(0, -1).join(',');
        if (seen[k]) continue;
        seen[k] = 1; rows.push(row);
      }
      const cols = rows[0].length;
      const answer = rows[3][cols - 1];
      const shown = rows.map(r => r.slice());
      shown[3][cols - 1] = null;
      const hint = lv < 3;
      return {
        prompt: hint
          ? T3(`표에서 ${cols === 3 ? '셋째' : '마지막'} 칸은 앞의 칸들과 관계가 있어요. 빈 칸에 올 수를 골라요`,
            'The last column is linked to the columns before it. Pick the number for the blank', '最后一列和前面的列有关系。选出空格里的数')
          : T3('표의 규칙을 찾아 빈 칸에 올 수를 골라요', 'Find the rule in the table. Pick the number for the blank', '找出表里的规律，选出空格里的数'),
        answer, answerType: 'number', widget: 'g15RuleTable',
        cols, rows: shown, askRow: 3, askCol: cols - 1, rule: lv === 1 ? 'a+b' : lv === 2 ? 'a-b' : 'a+b+c',
        choices: near3(rng, answer, 1, 9), keyFields: ['rows']
      };
    }

    if (mode === 'train') {
      const lv = P.level || 1;
      const n = R(rng, 4, 5);
      let cars, links;
      for (let tries = 0; tries < 200; tries++) {
        links = [];
        if (lv === 1) { const d = R(rng, 1, 2); for (let i = 0; i < n - 1; i++) links.push(d); }
        else { for (let i = 0; i < n - 1; i++) links.push(R(rng, 1, 3)); if (links.every(v => v === links[0])) continue; }
        const total = links.reduce((s, v) => s + v, 0);
        if (total > 9) continue;
        const s = R(rng, 0, 9 - total);
        cars = [s]; links.forEach(d => cars.push(cars[cars.length - 1] + d));
        break;
      }
      if (!cars) { links = [1, 2, 3]; cars = [0, 1, 3, 6]; }
      const askKind = pick(rng, ['car', 'link']);
      const askIndex = askKind === 'car' ? R(rng, 0, cars.length - 1) : R(rng, 0, links.length - 1);
      const answer = askKind === 'car' ? cars[askIndex] : links[askIndex];
      const sc = cars.slice(), sl = links.slice();
      if (askKind === 'car') sc[askIndex] = null; else sl[askIndex] = null;
      return {
        prompt: lv === 1
          ? T3('동그라미는 이웃한 두 칸의 차예요. 기차의 빈 곳에 올 수를 골라요',
            'Each circle is the difference between two neighboring cars. Pick the missing number', '圆圈是相邻两节车厢的差。选出缺的数')
          : T3('기차 칸의 수와 위의 동그라미는 규칙이 있어요. 빈 곳에 올 수를 골라요',
            'The train cars and the circles above follow a rule. Pick the missing number', '火车车厢上的数和上面的圆圈有规律。选出缺的数'),
        answer, answerType: 'number', widget: 'numberTrain',
        cars: sc, links: sl, askKind, askIndex, showRule: lv === 1,
        choices: near3(rng, answer, 0, 9), keyFields: ['cars', 'links', 'askKind']
      };
    }

    /* rod — 막대 기호(P3): 읽기 / 더하기 */
    const level = P.level || 'read';
    if (level === 'read') {
      const g = R(rng, 1, 9);
      return {
        prompt: T3('막대 기호는 어떤 수일까요? 위의 표를 보고 골라요', 'Which number is this rod sign? Use the table above', '这个棒形符号是几？看上面的表选出来'),
        answer: g, answerType: 'number', widget: 'rodNumeral', level, expr: { glyph: g },
        choices: near3(rng, g, 1, 9), keyFields: ['expr', 'level']
      };
    }
    let a, b;
    do { a = R(rng, 1, 5); b = R(rng, 1, 5); } while (a + b > 9);
    return {
      prompt: T3('막대 기호로 쓴 덧셈이에요. 결과를 나타내는 기호를 골라요', 'A sum written with rod signs. Pick the sign for the result', '用棒形符号写的加法。选出结果的符号'),
      answer: a + b, answerType: 'number', widget: 'rodNumeral', level, expr: { a, op: '+', b },
      choices: near3(rng, a + b, 1, 9), keyFields: ['expr', 'level']
    };
  };

  /* ── NL62 g14_symbols — 약속(두 수 연산) / 모양수 ───────────
     mode:'promise' shown:true(규칙 보임)|false(예시로 추리), askPos:'result'|'b'
     mode:'shapenum' kind:'obj'|'shape'|'pair'|'sumdiff' */
  const PRULES = {
    add1:  { f: (a, b) => a + b + 1,  ok: (a, b) => a + b + 1 <= 9, t: T3('앞 수 + 뒤 수 + 1', 'first + second + 1', '前数 + 后数 + 1') },
    dbl:   { f: (a, b) => 2 * (a - b), ok: (a, b) => a > b && 2 * (a - b) <= 9, t: T3('(앞 수 − 뒤 수)를 두 번 더하기', '(first − second), added twice', '(前数 − 后数) 加两次') },
    back2: { f: (a, b) => a - 2 * b,  ok: (a, b) => a - 2 * b >= 1, t: T3('앞 수에서 뒤 수를 두 번 빼기', 'first minus second, twice', '前数连减两次后数') },
    addm1: { f: (a, b) => a + b - 1,  ok: (a, b) => a + b - 1 >= 1 && a + b - 1 <= 9, t: T3('앞 수 + 뒤 수 − 1', 'first + second − 1', '前数 + 后数 − 1') },
    diff:  { f: (a, b) => a - b,      ok: (a, b) => a > b, t: T3('앞 수 − 뒤 수', 'first − second', '前数 − 后数') }
  };
  window.NM_G1315_PRULES = PRULES;
  const PSYM = ['◆', '◎', '▲', '■'];
  function promisePair(rng, rule) {
    for (let t = 0; t < 200; t++) {
      const a = R(rng, 1, 9), b = R(rng, 1, 9);
      if (PRULES[rule].ok(a, b)) return [a, b];
    }
    return [5, 2];
  }
  const SHAPE_GLYPH = ['▲', '●', '■', '★'];
  NM_TGEN['g14_symbols'] = function (params, rng) {
    const P = params || {};
    const mode = P.mode || 'promise';

    if (mode === 'promise') {
      const sym = pick(rng, PSYM);
      if (P.shown) {
        const rule = pick(rng, Object.keys(PRULES));
        const [a, b] = promisePair(rng, rule);
        const res = PRULES[rule].f(a, b);
        return {
          prompt: T3(`${sym}는 약속이에요. 약속대로 앞 수와 뒤 수를 계산해요`, `${sym} is a rule. Work out the sum using the rule`, `${sym}是个约定。按约定计算前后两个数`),
          answer: res, answerType: 'number', widget: 'promiseBox',
          sym, examples: [], target: [a, b], ruleShown: rule, askPos: 'result', result: res, rule,
          choices: near3(rng, res, 1, 9), keyFields: ['sym', 'ruleShown', 'target']
        };
      }
      const askPos = P.askPos || 'result';
      const cand = ['add1', 'dbl', 'back2'];
      for (let tries = 0; tries < 500; tries++) {
        const rule = pick(rng, cand);
        const ex = [];
        const seen = {};
        while (ex.length < 3) {
          const [a, b] = promisePair(rng, rule);
          if (seen[a + ',' + b]) continue; seen[a + ',' + b] = 1;
          ex.push([a, b, PRULES[rule].f(a, b)]);
        }
        /* 다른 약속 후보(5종)에는 예시가 하나라도 안 맞아야 추리가 하나로 정해진다 */
        const alone = Object.keys(PRULES).every(k => k === rule || ex.some(([a, b, r]) => !PRULES[k].ok(a, b) || PRULES[k].f(a, b) !== r));
        if (!alone) continue;
        const [ta, tb] = promisePair(rng, rule);
        if (seen[ta + ',' + tb]) continue;
        const res = PRULES[rule].f(ta, tb);
        const answer = askPos === 'b' ? tb : res;
        return {
          prompt: askPos === 'b'
            ? T3(`${sym}는 비밀 규칙이에요. 예시를 보고 규칙을 찾아서 빈 칸에 올 수를 골라요`, `${sym} has a secret rule. Look at the examples, then find the missing number`, `${sym}有个秘密规则。看例子找出规则，再选出空格里的数`)
            : T3(`${sym}는 비밀 규칙이에요. 예시를 보고 규칙을 찾아서 마지막 식을 계산해요`, `${sym} has a secret rule. Look at the examples to find it, then solve the last one`, `${sym}有个秘密规则。看例子找出规则，再算最后一题`),
          answer, answerType: 'number', widget: 'promiseBox',
          sym, examples: ex, target: [ta, tb], ruleShown: null, askPos, result: res, rule,
          choices: near3(rng, answer, 1, 9), keyFields: ['sym', 'examples', 'target', 'askPos']
        };
      }
    }

    /* ── 모양수: 같은 그림 = 같은 수 ── */
    const kind = P.kind || 'obj';
    const useObj = kind === 'obj' || kind === 'sumdiff';
    const keys = ['X', 'Y', 'Z'];
    const pool = useObj ? shuffle(rng, FRUITS.map(f => f[0])) : shuffle(rng, SHAPE_GLYPH);
    const syms = { X: pool[0], Y: pool[1], Z: pool[2] };
    function distinct(v) { const u = [v.X, v.Y].concat(v.Z != null ? [v.Z] : []); return new Set(u).size === u.length; }

    if (kind === 'pair' || kind === 'sumdiff') {
      for (let t = 0; t < 300; t++) {
        const s = R(rng, 4, 9), d = R(rng, 1, s - 2);
        if ((s + d) % 2) continue;
        const X = (s + d) / 2, Y = (s - d) / 2;
        if (Y < 1 || X === Y) continue;
        const eqs = kind === 'sumdiff'
          ? [{ l: ['X', '+', 'Y'], r: s }, { l: ['X', '-', 'Y'], r: d }]
          : [{ l: ['X', '+', 'Y'], r: s }, { l: ['X', '-', 'Y'], r: d }];
        return {
          prompt: T3('같은 그림은 같은 수예요. 두 식을 보고 두 그림의 수를 차례로 골라요', 'Same picture, same number. Use both lines to find each number, one after the other', '相同的图案代表相同的数。看两个算式，依次选出两个图案的数'),
          answer: enc([X, Y]), answerType: 'number', widget: 'shapeEq', kind,
          syms: { X: syms.X, Y: syms.Y }, eqs, ask: ['X', 'Y'], vals: { X, Y },
          choices: [near3(rng, X, 1, 9), near3(rng, Y, 1, 9)], keyFields: ['syms', 'eqs']
        };
      }
    }

    /* 한 칸씩 대입하는 식 줄 */
    const tmpl = pick(rng, kind === 'obj' ? ['A', 'A', 'B', 'C'] : ['E', 'F', 'H', 'E']);
    for (let t = 0; t < 400; t++) {
      let v = {}, eqs, ask;
      if (tmpl === 'A') {                 /* X=a, X+Y=s, ? Y */
        v.X = R(rng, 1, 5); v.Y = R(rng, 1, 5); if (v.X + v.Y > 9) continue;
        eqs = [{ l: ['X'], r: v.X }, { l: ['X', '+', 'Y'], r: v.X + v.Y }]; ask = ['Y'];
      } else if (tmpl === 'B') {          /* X+X=s, ? X */
        v.X = R(rng, 1, 4);
        eqs = [{ l: ['X', '+', 'X'], r: 2 * v.X }]; ask = ['X'];
      } else if (tmpl === 'C') {          /* X+Y=s, X+X=t, ? Y */
        v.X = R(rng, 1, 4); v.Y = R(rng, 1, 5); if (v.X + v.Y > 9) continue;
        eqs = [{ l: ['X', '+', 'Y'], r: v.X + v.Y }, { l: ['X', '+', 'X'], r: 2 * v.X }]; ask = ['Y'];
      } else if (tmpl === 'E') {          /* Y=a, X+Y=s, X+Z=t, ? Z */
        v.Y = R(rng, 1, 4); v.X = R(rng, 1, 5); v.Z = R(rng, 1, 5);
        if (v.X + v.Y > 9 || v.X + v.Z > 9) continue;
        eqs = [{ l: ['Y'], r: v.Y }, { l: ['X', '+', 'Y'], r: v.X + v.Y }, { l: ['X', '+', 'Z'], r: v.X + v.Z }]; ask = ['Z'];
      } else if (tmpl === 'F') {          /* X+X=s, X+Y=t, ? Y */
        v.X = R(rng, 1, 4); v.Y = R(rng, 1, 5); if (v.X + v.Y > 9) continue;
        eqs = [{ l: ['X', '+', 'X'], r: 2 * v.X }, { l: ['X', '+', 'Y'], r: v.X + v.Y }]; ask = ['Y'];
      } else {                            /* H: Y=a, X−Y=d, ? X */
        v.Y = R(rng, 1, 5); const d = R(rng, 1, 4); v.X = v.Y + d; if (v.X > 9) continue;
        eqs = [{ l: ['Y'], r: v.Y }, { l: ['X', '-', 'Y'], r: d }]; ask = ['X'];
      }
      if (!distinct(v)) continue;
      const used = {};
      eqs.forEach(e => e.l.concat([e.r]).forEach(k => { if (typeof k === 'string' && keys.includes(k)) used[k] = 1; }));
      const sy = {}; Object.keys(used).forEach(k => { sy[k] = syms[k]; });
      const ans = v[ask[0]];
      return {
        prompt: useObj
          ? T3('같은 그림은 같은 수예요. 빈 칸에 알맞은 수를 골라요', 'Same picture, same number. Pick the number for the blank', '相同的图案代表相同的数。选出空格里的数')
          : T3('같은 모양은 같은 수예요. 빈 칸에 알맞은 수를 골라요', 'Same shape, same number. Pick the number for the blank', '相同的形状代表相同的数。选出空格里的数'),
        answer: ans, answerType: 'number', widget: 'shapeEq', kind,
        syms: sy, eqs, ask, vals: v, choices: [near3(rng, ans, 1, 9)], keyFields: ['syms', 'eqs', 'ask']
      };
    }
    return NM_TGEN['g14_symbols']({ mode: 'promise', shown: true }, rng);
  };

  /* ── NL63 g14_chain — 화살표 사슬 ───────────────────────────
     level 1 규칙 보임·1칸 / 2 규칙 보임·2~3칸 / 3 숫자 라벨 S자 / 4 규칙 찾기 / 5 고리(P3) */
  NM_TGEN['g14_chain'] = function (params, rng) {
    const lv = (params && params.level) || 1;
    for (let guard = 0; guard < 600; guard++) {
      let a = R(rng, 1, 3), b = R(rng, 1, 3);
      if (a === b) b = a === 3 ? 1 : a + 1;
      let n, layout, nAsk = 0, style = 'legend', askRule = false, loop = false;
      if (lv === 1) { n = 4; layout = 'line'; nAsk = 1; }
      else if (lv === 2) { n = 5; layout = 'line'; nAsk = R(rng, 2, 3); }
      else if (lv === 3) { n = R(rng, 4, 5); layout = 'snake'; nAsk = R(rng, 1, 2); style = 'plain'; }
      else if (lv === 4) { n = 5; layout = 'line'; askRule = true; }
      else { n = 5; layout = 'loop'; nAsk = R(rng, 1, 2); loop = true; }

      const arrows = [];
      if (lv === 3) {
        for (let i = 0; i < n - 1; i++) arrows.push({ d: pick(rng, [1, -1]) * R(rng, 1, 5), style: 'plain' });
      } else if (loop) {
        const rule = pick(rng, [[2, 3, 3, 2], [3, 2, 2, 3]]);          /* [+a, −b, 실선 수, 점선 수] — 한 바퀴 합 0 */
        a = rule[0]; b = rule[1];
        shuffle(rng, [].concat(new Array(rule[2]).fill('solid'), new Array(rule[3]).fill('dash')))
          .forEach(s => arrows.push({ d: s === 'solid' ? a : -b, style: s }));
      } else if (lv === 4) {
        shuffle(rng, ['solid', 'solid', 'dash', 'dash']).forEach(s => arrows.push({ d: s === 'solid' ? a : -b, style: s }));
      } else {
        for (let i = 0; i < n - 1; i++) { const s = pick(rng, ['solid', 'dash']); arrows.push({ d: s === 'solid' ? a : -b, style: s }); }
        if (arrows.every(x => x.style === arrows[0].style)) {            /* 두 종류가 다 보이게 */
          const j = R(rng, 0, arrows.length - 1), flip = arrows[0].style === 'solid' ? 'dash' : 'solid';
          arrows[j] = { d: flip === 'solid' ? a : -b, style: flip };
        }
      }
      /* 값 — 모두 0~9 안에서 움직여야 한다 */
      const s0 = R(rng, 0, 9);
      const vals = [s0];
      let ok = true;
      const steps = loop ? n - 1 : arrows.length;
      for (let i = 0; i < steps; i++) { const nx = vals[vals.length - 1] + arrows[i].d; if (nx < 0 || nx > 9) { ok = false; break; } vals.push(nx); }
      if (!ok || vals.length !== n) continue;
      if (loop && vals[n - 1] + arrows[n - 1].d !== vals[0]) continue;

      let asks = [];
      if (!askRule) {
        const idx = []; for (let i = 1; i < n; i++) idx.push(i);
        asks = lv === 1 ? [R(rng, 1, n - 1)] : shuffle(rng, idx).slice(0, nAsk).sort((x, y) => x - y);
      }
      const nodes = vals.map((v, i) => asks.includes(i) ? null : v);
      const answer = askRule ? enc([a, b]) : (asks.length === 1 ? vals[asks[0]] : enc(asks.map(i => vals[i])));
      const choices = askRule ? [near3(rng, a, 1, 5), near3(rng, b, 1, 5)] : asks.map(i => near3(rng, vals[i], 0, 9));
      const prompt = askRule
        ? T3('실선은 몇 큰 수, 점선은 몇 작은 수일까요?', 'How much more is the solid arrow, and how much less is the dashed arrow?', '实线是多几？虚线是少几？')
        : style === 'plain'
          ? T3('화살표 위의 수만큼 더하거나 빼서 빈 원을 채워요', 'Add or subtract the number on each arrow to fill the blank circles', '按箭头上的数加或减，填空圆')
          : T3(`화살표 규칙대로 빈 원을 채워요. 실선은 ${a} 큰 수, 점선은 ${b} 작은 수`,
            `Follow the arrow rule to fill the blank circles. Solid = ${a} more, dashed = ${b} less`,
            `按箭头规则填空圆。实线是多${a}，虚线是少${b}`);
      return {
        prompt, answer, answerType: 'number', widget: 'arrowChain',
        layout, nodes, arrows, legend: style === 'legend' || askRule ? { a, b } : null, showDelta: style === 'plain', asks, vals, askRule, loop,
        choices, keyFields: ['nodes', 'arrows', 'layout', 'asks', 'askRule']
      };
    }
    throw new Error('g14_chain: 문항을 만들지 못함');
  };

  /* ── NL64 g14_order — 모든 가르기 / 수열 / 수 삼각형 ─────────
     mode:'split' level practice|main|cmp|caps · 'seq' kinds[]·blanks · 'pascal' */
  function enumPairs(whole, minPart, caps, ordered, cmp) {
    const out = [];
    for (let x = minPart; x <= whole - minPart; x++) {
      const y = whole - x;
      if (caps && (x > caps[0] || y > caps[1])) continue;
      if (!ordered && !cmp && x > y) continue;
      if (cmp === 'more' && !(x > y)) continue;
      out.push([x, y]);
    }
    return out;
  }
  const SEQ_KIND_TXT = {
    down2: T3('2씩 줄어들어요! 빈 칸에 올 수를 골라요', 'It goes down by 2! Pick the number for the blank', '每次减2！选出空格里的数'),
    even: T3('짝수만 이어 세요! 빈 칸에 올 수를 골라요', 'Count on even numbers only! Pick the number for the blank', '只数双数！选出空格里的数'),
    odd: T3('홀수만 이어 세요! 빈 칸에 올 수를 골라요', 'Count on odd numbers only! Pick the number for the blank', '只数单数！选出空格里的数'),
    grow: T3('더하는 수가 1씩 커져요! 빈 칸에 올 수를 골라요', 'The number you add grows by 1 each time! Pick the number for the blank', '每次加的数多1！选出空格里的数')
  };
  function seqBuild(rng, kind) {
    const len = R(rng, 4, 5);
    let seq = [];
    if (kind === 'down2') { const s = R(rng, 2 * (len - 1), 9); for (let i = 0; i < len; i++) seq.push(s - 2 * i); }
    else if (kind === 'even') { const hi = 8 - 2 * (len - 1); const s = 2 * R(rng, 0, hi / 2); for (let i = 0; i < len; i++) seq.push(s + 2 * i); }
    else if (kind === 'odd') { const hi = 9 - 2 * (len - 1); const s = 1 + 2 * R(rng, 0, (hi - 1) / 2); for (let i = 0; i < len; i++) seq.push(s + 2 * i); }
    else {
      const i0 = pick(rng, [1, 2]);
      const inc = [i0, i0 + 1, i0 + 2];
      const tot = inc.reduce((a, b) => a + b, 0);
      const b0 = R(rng, 0, 9 - tot);
      seq = [b0]; inc.forEach(d => seq.push(seq[seq.length - 1] + d));
    }
    return seq;
  }
  NM_TGEN['g14_order'] = function (params, rng) {
    const P = params || {};
    const mode = P.mode || 'split';

    if (mode === 'split') {
      const lv = P.level || 'practice';
      let whole, minPart = 1, caps = null, ordered = false, cmp = null, prompt;
      if (lv === 'practice') whole = R(rng, 4, 6);
      else if (lv === 'main') whole = R(rng, 7, 9);
      else if (lv === 'cmp') {
        whole = R(rng, 5, 9); cmp = 'more';
        prompt = T3(`색종이 ${whole}장을 두 친구가 나눠 가져요. 한 장 이상씩, 첫째 친구가 더 많게! 나누는 방법을 모두 찾아요`,
          `Two friends share ${whole} sheets of paper, at least 1 each, and the first friend gets more. Find every way`,
          `两个小朋友分${whole}张彩纸，每人至少1张，第一个人要更多！找出所有分法`);
      } else {
        whole = R(rng, 5, 7); caps = [5, 5]; ordered = true; minPart = 0;
        prompt = T3(`파란 구슬 5개, 빨간 구슬 5개가 있어요. ${whole}개를 꺼내는 방법을 모두 찾아요. 색이 달라서 순서도 달라요`,
          `There are 5 blue and 5 red beads. Find every way to take out ${whole}. The colours differ, so the order counts`,
          `有5颗蓝珠、5颗红珠。找出取出${whole}颗的所有方法。颜色不同，顺序也算`);
      }
      const pairs = enumPairs(whole, minPart, caps, ordered, cmp);
      const example = pick(rng, pairs);
      const fr = pick(rng, FRUITS);
      if (!prompt) prompt = T3(`${josa(fr[1], '을', '를')} ${whole}개 두 접시에 나눠 담는 방법을 모두 찾아요. 순서가 달라도 같은 방법이에요`,
        `Find every way to share ${whole} ${fr[2]} between two plates. The same two numbers in a different order count once`,
        `找出把${whole}个${fr[3]}分到两个盘子里的所有方法。两个数一样只是顺序不同算同一种`);
      return {
        prompt, answer: pairs.length, answerType: 'number', widget: 'splitList',
        whole, example, ordered, minPart, caps, cmp, pairs, k: pairs.length, emoji: fr[0], keyFields: ['whole', 'example', 'cmp', 'caps', 'emoji']
      };
    }

    if (mode === 'pascal') {
      const combos = [[1, 3], [1, 4], [1, 5], [2, 3], [2, 4], [3, 3]];
      const [k, nr] = pick(rng, combos);
      const rows = [[k]];
      for (let r = 1; r < nr; r++) {
        const prev = rows[r - 1], row = [k];
        for (let i = 0; i < prev.length - 1; i++) row.push(prev[i] + prev[i + 1]);
        row.push(k);
        rows.push(row);
      }
      const spots = [];
      for (let r = 2; r < nr; r++) for (let c = 1; c < rows[r].length - 1; c++) spots.push([r, c]);
      const [ar, ac] = pick(rng, spots);
      const answer = rows[ar][ac];
      rows[ar] = rows[ar].slice(); rows[ar][ac] = null;
      return {
        prompt: T3('위의 두 수를 모으면 아래 수가 돼요! 빈 돌에 올 수를 골라요', 'Two stones above join into the stone below! Pick the missing one', '上面两块石头合起来就是下面那块！选出空石头上的数'),
        answer, answerType: 'number', widget: 'pyramid', dir: 'down', rows, keyFields: ['rows', 'dir']
      };
    }

    /* seq — 수열 빈칸(신규 종류·빈 칸 둘) */
    const kinds = P.kinds || ['down2', 'even', 'odd'];
    const kind = pick(rng, kinds);
    const seq = seqBuild(rng, kind);
    const nb = P.blanks === 2 ? 2 : 1;
    const idx = [];
    for (let i = 1; i < seq.length; i++) idx.push(i);
    const blanks = shuffle(rng, idx).slice(0, nb).sort((a, b) => a - b);
    const answer = nb === 1 ? seq[blanks[0]] : enc(blanks.map(i => seq[i]));
    return {
      prompt: nb === 2 ? T3('빈 칸 두 개를 차례로 채워요. 규칙을 먼저 찾아요', 'Fill the two blanks one after the other. Find the rule first', '依次填两个空格。先找规律') : SEQ_KIND_TXT[kind],
      answer, answerType: 'number', widget: 'seqGap', kind, seq, blanks,
      choices: blanks.map(i => near3(rng, seq[i], 0, 9)), keyFields: ['seq', 'blanks']
    };
  };

  /* ============================================================
     G1-15 — 문장제·어떤 수
     ============================================================ */

  /* 문장 한 벌(ko/en/zh) — op: add(□+k=t) · subL(s−□=r) · subR(□−k=r) */
  function storySentence(op, A, B, f) {       /* f = FRUITS 항목 [토큰, ko, en, zh] */
    const ko = f[1], en = f[2], zh = f[3];
    if (op === 'add') return T3(
      `상자에 ${josa(ko, '이', '가')} 몇 개 있어요. 밖에 ${A}개를 더 놓았더니 모두 ${B}개가 되었어요. 상자 안에는 몇 개 있을까요?`,
      `Some ${en} are in the box. ${A} more are put outside, and now there are ${B} in all. How many are in the box?`,
      `盒子里有一些${zh}。外面又放了${A}个，一共${B}个。盒子里有几个？`);
    if (op === 'subL') return T3(
      `${josa(ko, '이', '가')} ${A}개 있었어요. 몇 개를 상자에 숨겼더니 ${B}개가 남았어요. 상자에 숨긴 건 몇 개일까요?`,
      `There were ${A} ${en}. Some were hidden in the box, and ${B} are left. How many are in the box?`,
      `原来有${A}个${zh}。藏了一些进盒子，还剩${B}个。盒子里有几个？`);
    return T3(
      `상자 안의 ${josa(ko, '을', '를')} ${A}개 꺼냈더니 ${B}개가 남았어요. 처음 상자 안에는 몇 개 있었을까요?`,
      `${A} ${en} were taken out of the box and ${B} are left in it. How many were in the box at first?`,
      `从盒子里拿出${A}个${zh}，盒子里还剩${B}个。盒子里原来有几个？`);
  }
  const OPFORM = {
    add: (A, B) => `□ + ${A} = ${B}`, subL: (A, B) => `${A} − □ = ${B}`, subR: (A, B) => `□ − ${A} = ${B}`
  };
  function opNumbers(rng, op) {
    let A, B, q;                            /* q = 답(상자 안 개수) */
    if (op === 'add') { A = R(rng, 1, 7); q = R(rng, 1, 9 - A); B = A + q; }
    else if (op === 'subL') { A = R(rng, 2, 9); B = R(rng, 1, A - 1); q = A - B; }
    else { A = R(rng, 1, 7); B = R(rng, 1, 9 - A); q = A + B; }
    return { A, B, q };
  }

  /* ── NL65 g15_unknown — 이야기 빈칸 / 숨은 수 / 식 고르기 / 잘못 계산 ──
     mode:'fill' level practice(3칸)|main(4칸) · 'unknown' ops·eq · 'eqpick' · 'wrong' */
  function slotsOk(tmpl, s) {
    if (tmpl === 'score') return s[2] === s[0] + s[1] && s[0] > s[1];
    return s[0] === s[1] + s[2] && s[3] === s[1] - s[2] && s[1] > s[2];
  }
  function countAssign(tmpl, chips) {
    const n = chips.length, seen = {};
    let count = 0;
    (function perm(cur, rest) {
      if (!rest.length) { const key = cur.join(); if (!seen[key] && slotsOk(tmpl, cur)) { seen[key] = 1; count++; } return; }
      rest.forEach((v, i) => perm(cur.concat([v]), rest.slice(0, i).concat(rest.slice(i + 1))));
    })([], chips);
    return count;
  }
  NM_TGEN['g15_unknown'] = function (params, rng) {
    const P = params || {};
    const mode = P.mode || 'fill';

    if (mode === 'fill') {
      const tmpl = (P.level || 'practice') === 'practice' ? 'score' : 'group';
      const an = pick(rng, ANIMALS);
      let sol, chips;
      for (let t = 0; t < 500; t++) {
        if (tmpl === 'score') { const b = R(rng, 1, 7), a = R(rng, b + 1, 8); if (a + b > 9) continue; sol = [a, b, a + b]; }
        else { const q = R(rng, 1, 3), p = R(rng, q + 1, 8); if (p + q > 9) continue; sol = [p + q, p, q, p - q]; if (new Set(sol).size !== 4) continue; }
        chips = shuffle(rng, sol);
        if (countAssign(tmpl, chips) === 1) break;
      }
      const [tok, ko, en, zh] = an;
      const story = tmpl === 'score'
        ? T3(`${ko} 팀이 이겼어요. 이긴 팀은 {0}점, 진 팀은 {1}점이에요. 모두 합쳐 {2}점이에요.`,
          `The ${en} team won. The winners scored {0}, the losers scored {1}, and together they scored {2}.`,
          `${zh}队赢了。赢的队得了{0}分，输的队得了{1}分，一共{2}分。`)
        : T3(`${ko} 반 친구는 모두 {0}명이에요. 빨간 모자는 {1}명, 파란 모자는 {2}명이고, 빨간 모자가 {3}명 더 많아요.`,
          `The ${en} class has {0} friends in all. {1} wear red hats and {2} wear blue hats, so {3} more wear red.`,
          `${zh}班一共有{0}个朋友。戴红帽子的有{1}个，戴蓝帽子的有{2}个，红帽子多{3}个。`);
      return {
        prompt: T3('이야기에 알맞은 수를 주머니에서 찾아 빈 칸에 넣어요', 'Find the right number in the pouch for each blank in the story', '从口袋里找出合适的数，填进故事的空格'),
        answer: enc(sol), answerType: 'number', widget: 'storyFill',
        tmpl, story, slots: sol.length, chips, sol, scene: { emoji: tok },
        sig: tmpl + ':' + sol.join('-') + ':' + tok, keyFields: ['sig']
      };
    }

    if (mode === 'unknown') {
      const ops = P.ops || ['add', 'subL'];
      const op = pick(rng, ops);
      const f = pick(rng, FRUITS);
      const { A, B, q } = opNumbers(rng, op);
      return {
        prompt: storySentence(op, A, B, f),
        answer: q, answerType: 'number', widget: 'mysteryBox',
        op, emoji: f[0], loose: A, total: B, eq: P.eq ? OPFORM[op](A, B) : null,
        choices: near3(rng, q, 1, 9), keyFields: ['op', 'emoji', 'loose', 'total', 'eq']
      };
    }

    if (mode === 'eqpick') {
      const f = pick(rng, FRUITS);
      const op = pick(rng, ['add', 'subL', 'subR']);
      const { A, B, q } = opNumbers(rng, op);
      const correct = OPFORM[op](A, B);
      const strip = s => ({ ko: s.ko.replace(/ (상자 안에는|처음 상자 안에는|상자에 숨긴 건) 몇 개.*$/, ''), en: s.en.replace(/ How many.*$/, ''), zh: s.zh.replace(/[^。]*？$/, '') });
      const valid = (o, x, y) => x >= 1 && x <= 9 && y >= 1 && y <= 9 && (o === 'add' ? y > x : o === 'subL' ? x > y : true);
      const solv = (o, x, y) => o === 'add' ? y - x : o === 'subL' ? x - y : x + y;
      const dir = P.dir || pick(rng, ['sentence', 'eq']);
      if (dir === 'sentence') {
        const pool = [];
        ['add', 'subL', 'subR'].forEach(o => [[A, B], [B, A]].forEach(([x, y]) => {
          const s = OPFORM[o](x, y);
          if (s !== correct && solv(o, x, y) !== q && !pool.includes(s)) pool.push(s);
        }));
        const wrong = shuffle(rng, pool).slice(0, 2);
        const choices = shuffle(rng, [correct].concat(wrong)).map(t => ({ kind: 'eq', txt: t }));
        return {
          prompt: T3('이야기에 맞는 식을 골라요', 'Pick the number sentence that matches the story', '选出和故事相符的算式'),
          answer: choices.findIndex(c => c.txt === correct), answerType: 'number', widget: 'eqChoice',
          stem: Object.assign({ kind: 'sentence' }, strip(storySentence(op, A, B, f))), choices, emoji: f[0], op, keyFields: ['stem', 'choices']
        };
      }
      /* eq → 문장: 오답은 연산이 다른 문장, 숫자를 바꾼 문장 */
      const cands = [];
      ['add', 'subL', 'subR'].forEach(o => [[A, B], [B, A], [A, B + 1], [A + 1, B], [A, B - 1]].forEach(([x, y]) => {
        if (!valid(o, x, y) || (o === op && x === A && y === B)) return;
        const key = o + x + ',' + y;
        if (!cands.some(c => c.key === key)) cands.push({ key, o, x, y });
      }));
      const two = shuffle(rng, cands).slice(0, 2);
      const sents = [strip(storySentence(op, A, B, f))].concat(two.map(c => strip(storySentence(c.o, c.x, c.y, f))));
      const order = shuffle(rng, [0, 1, 2]);
      return {
        prompt: T3('식에 어울리는 이야기를 골라요', 'Pick the story that fits the equation', '选出和算式相配的故事'),
        answer: order.indexOf(0), answerType: 'number', widget: 'eqChoice',
        stem: { kind: 'eq', txt: correct }, choices: order.map(i => Object.assign({ kind: 'sentence' }, sents[i])), emoji: f[0], op, keyFields: ['stem', 'choices']
      };
    }

    /* wrong — 잘못 계산한 수(P3): 두 번 고르기 */
    const kind = pick(rng, ['sub', 'add']);          /* 바르게는 빼기 / 더하기 */
    let x, k;
    for (;;) {
      k = R(rng, 1, 4); x = R(rng, k + 1, 9);
      if (kind === 'sub' ? x + k <= 9 : x + k <= 9) break;
    }
    const R2 = kind === 'sub' ? x + k : x - k;       /* 잘못 계산한 결과 */
    const final = kind === 'sub' ? x - k : x + k;
    return {
      prompt: kind === 'sub'
        ? T3(`어떤 수에서 ${nEul(k)} 빼야 하는데 잘못하여 더했더니 ${nI(R2)} 되었어요. 바르게 계산하면 얼마일까요?`,
          `Some number should have had ${k} taken away, but ${k} was added by mistake and it became ${R2}. What is the correct answer?`,
          `一个数应该减去${k}，却错加了${k}，结果是${R2}。正确的结果是多少？`)
        : T3(`어떤 수에 ${nEul(k)} 더해야 하는데 잘못하여 뺐더니 ${nI(R2)} 되었어요. 바르게 계산하면 얼마일까요?`,
          `Some number should have had ${k} added, but ${k} was taken away by mistake and it became ${R2}. What is the correct answer?`,
          `一个数应该加上${k}，却错减了${k}，结果是${R2}。正确的结果是多少？`),
      answer: enc([x, final]), answerType: 'number', widget: 'mysteryBox',
      op: 'wrong', intended: kind, k, mistakenResult: R2, x, final,
      phases: [{ ask: 'x', choices: near3(rng, x, 1, 9) }, { ask: 'final', choices: near3(rng, final, 1, 9) }],
      keyFields: ['intended', 'k', 'mistakenResult']
    };
  };

  /* ── NL66 g15_scene — 틀린 수 / 과녁 / 숫자판 / 계단 / 나이 / 세 바구니 ── */
  NM_TGEN['g15_scene'] = function (params, rng) {
    const P = params || {};
    const mode = P.mode || 'tapwrong';

    if (mode === 'tapwrong') {
      const [f1, f2] = shuffle(rng, FRUITS).slice(0, 2);
      const type = P.type || pick(rng, ['sum', 'part', 'diff']);
      let a, b;
      do { a = R(rng, 1, 5); b = R(rng, 1, 5); } while (a + b > 9 || (type === 'diff' && a === b));
      const wrongOf = (v, lo, hi) => { let w; do { w = R(rng, lo, hi); } while (w === v); return w; };
      let tokens, answer;
      const t = (s) => ({ t: s });
      const nn = (n, wrong) => wrong ? { n, wrong: true } : { n };
      const [k1, e1, z1] = [f1[1], f1[2], f1[3]], [k2, e2, z2] = [f2[1], f2[2], f2[3]];
      if (type === 'sum') {
        answer = a + b;
        const w = wrongOf(answer, Math.max(2, answer - 2), Math.min(9, answer + 2));
        tokens = {
          ko: [t(`${k1} `), nn(a), t(`개와 ${k2} `), nn(b), t('개, 모두 '), nn(w, 1), t('개예요.')],
          en: [nn(a), t(` ${e1} and `), nn(b), t(` ${e2}, `), nn(w, 1), t(' in all.')],
          zh: [nn(a), t(`个${z1}和`), nn(b), t(`个${z2}，一共`), nn(w, 1), t('个。')]
        };
      } else if (type === 'part') {
        answer = a;
        const w = wrongOf(a, Math.max(1, a - 2), Math.min(6, a + 2));
        tokens = {
          ko: [t(`${k1} `), nn(w, 1), t(`개와 ${k2} `), nn(b), t('개, 모두 '), nn(a + b), t('개예요.')],
          en: [nn(w, 1), t(` ${e1} and `), nn(b), t(` ${e2}, `), nn(a + b), t(' in all.')],
          zh: [nn(w, 1), t(`个${z1}和`), nn(b), t(`个${z2}，一共`), nn(a + b), t('个。')]
        };
      } else {
        const hi = Math.max(a, b), lo = Math.min(a, b);
        answer = hi - lo;
        const w = wrongOf(answer, 1, Math.min(6, answer + 3));
        const [big, small] = a > b ? [f1, f2] : [f2, f1];
        tokens = {
          ko: [t(`${big[1]} `), nn(hi), t(`개, ${small[1]} `), nn(lo), t(`개예요. ${josa(big[1], '이', '가')} ${small[1]}보다 `), nn(w, 1), t('개 더 많아요.')],
          en: [nn(hi), t(` ${big[2]}, `), nn(lo), t(` ${small[2]}. There are `), nn(w, 1), t(` more ${big[2]} than ${small[2]}.`)],
          zh: [nn(hi), t(`个${big[3]}，`), nn(lo), t(`个${small[3]}。${big[3]}比${small[3]}多`), nn(w, 1), t('个。')]
        };
      }
      return {
        prompt: T3('그림과 다른 곳을 찾아요! 틀린 수를 누르고 바르게 고쳐요', "Find what doesn't match the picture! Tap the wrong number and fix it", '找出和图不一样的地方！点一下错的数，再改正'),
        answer, answerType: 'number', widget: 'tapWrong',
        type, scene: { items: [{ e: f1[0], n: a }, { e: f2[0], n: b }] }, tokens,
        choices: near3(rng, answer, 1, 9), keyFields: ['type', 'scene', 'tokens']
      };
    }

    if (mode === 'dart') {
      const lv = P.level || 'sum';
      const RING_R = { 3: [0.05, 0.2], 2: [0.36, 0.56], 1: [0.68, 0.9] };
      function place(rings) {
        for (let t = 0; t < 200; t++) {
          const hits = rings.map(rg => ({ ring: rg, ang: R(rng, 0, 359), r: R(rng, Math.round(RING_R[rg][0] * 100), Math.round(RING_R[rg][1] * 100)) / 100 }));
          const pt = h => [Math.cos(h.ang * Math.PI / 180) * h.r, Math.sin(h.ang * Math.PI / 180) * h.r];
          let ok = true;
          for (let i = 0; i < hits.length; i++) for (let j = i + 1; j < hits.length; j++) {
            const p = pt(hits[i]), q = pt(hits[j]);
            if (Math.hypot(p[0] - q[0], p[1] - q[1]) < 0.3) ok = false;
          }
          if (ok) return hits;
        }
        return null;
      }
      for (let g = 0; g < 100; g++) {
        const n = lv === 'sum' ? R(rng, 2, 3) : 3;
        const rings = []; for (let i = 0; i < n; i++) rings.push(R(rng, 1, 3));
        const total = rings.reduce((s, v) => s + v, 0);
        const hits = place(rings);
        if (!hits) continue;
        if (lv === 'sum') {
          return {
            prompt: T3('화살이 박힌 곳의 점수를 모두 더해요', 'Add up the points where the arrows landed', '把箭射中的分数加起来'),
            answer: total, answerType: 'number', widget: 'dartTarget', rings: [3, 2, 1], hits, ask: 'sum', total,
            choices: near3(rng, total, 1, 9), keyFields: ['hits', 'ask']
          };
        }
        const hidIdx = R(rng, 0, 2);
        const shown = hits.map((h, i) => i === hidIdx ? { ring: null } : h).filter(h => h.ring !== null);
        const ans = rings[hidIdx];
        return {
          prompt: T3(`화살 하나는 구름에 가려졌어요. 모두 합쳐 ${total}점이에요. 가려진 화살은 몇 점일까요?`,
            `One arrow is hidden in the cloud. The total is ${total}. How many points is the hidden arrow?`,
            `有一支箭藏在云里。一共${total}分。藏起来的箭是几分？`),
          answer: ans, answerType: 'number', widget: 'dartTarget', rings: [3, 2, 1], hits: shown, hidden: 1, ask: 'missing', total,
          choices: [1, 2, 3], keyFields: ['hits', 'ask', 'total']
        };
      }
    }

    if (mode === 'digits') {
      const nk = P.kinds || 3;
      const ask = P.ask || pick(rng, ['most', 'least', 'diff']);
      for (let t = 0; t < 400; t++) {
        const counts = [];
        let left = 20;
        for (let i = 0; i < nk - 1; i++) { const c = R(rng, 1, 7); counts.push(c); left -= c; }
        if (left < 1 || left > 7) continue;
        counts.push(left);
        const mx = Math.max.apply(null, counts), mn = Math.min.apply(null, counts);
        if (counts.filter(c => c === mx).length !== 1 || counts.filter(c => c === mn).length !== 1) continue;
        const kinds = shuffle(rng, [1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, nk).sort((a, b) => a - b);
        let cells = [];
        counts.forEach((c, i) => { for (let j = 0; j < c; j++) cells.push(kinds[i]); });
        cells = shuffle(rng, cells);
        const grid = []; for (let r = 0; r < 4; r++) grid.push(cells.slice(r * 5, r * 5 + 5));
        const iMax = counts.indexOf(mx), iMin = counts.indexOf(mn);
        let answer, choices;
        if (ask === 'diff') { answer = mx - mn; choices = near3(rng, answer, 1, 9); }
        else {
          answer = kinds[ask === 'most' ? iMax : iMin];
          choices = shuffle(rng, kinds).filter(v => v !== answer).slice(0, 2).concat([answer]);
          choices = shuffle(rng, choices);
        }
        return {
          prompt: ask === 'most' ? T3('숫자판에서 가장 많이 나온 숫자는 무엇일까요? 눌러서 세어 봐요', 'Which number shows up the most on the board? Tap to count', '数字板上出现最多的是哪个数？点一点数一数')
            : ask === 'least' ? T3('숫자판에서 가장 적게 나온 숫자는 무엇일까요? 눌러서 세어 봐요', 'Which number shows up the least on the board? Tap to count', '数字板上出现最少的是哪个数？点一点数一数')
              : T3('가장 많이 나온 수와 가장 적게 나온 수는 몇 개 차이일까요? 눌러서 세어 봐요', 'How many more is the most common number than the least common? Tap to count', '出现最多的数比出现最少的数多几个？点一点数一数'),
          answer, answerType: 'number', widget: 'digitBoard',
          grid, kinds, counts, ask, choices, keyFields: ['grid', 'ask']
        };
      }
    }

    if (mode === 'game') {
      const lv = P.level || 1;
      const an = pick(rng, ANIMALS);
      let w, l = 0;
      for (;;) {
        w = R(rng, 1, 4); l = lv === 1 ? 0 : R(rng, 1, 3);
        const pos = 2 * w - l;
        if (pos >= 1 && pos <= 9) break;
      }
      const pos = 2 * w - l;
      return {
        prompt: lv === 1
          ? T3(`이기면 2칸 올라가요. ${w}번 이겼어요. 지금 몇 번째 계단일까요?`, `Win: go up 2 steps. You won ${w} times. Which step are you on now?`, `赢了上2级。赢了${w}次。现在在第几级？`)
          : T3(`이기면 2칸 올라가고, 지면 1칸 내려가요. ${w}번 이기고 ${l}번 졌어요. 지금 몇 번째 계단일까요?`,
            `Win: go up 2. Lose: go down 1. You won ${w} times and lost ${l}. Which step are you on now?`, `赢了上2级，输了下1级。赢了${w}次，输了${l}次。现在在第几级？`),
        answer: pos, answerType: 'number', widget: 'stairsGame',
        interaction: 'numpad', layout: 'stairs', total: 9, mark: -1, emoji: an[0], game: { up: 2, down: 1, wins: w, losses: l },
        keyFields: ['game', 'emoji']
      };
    }

    if (mode === 'age') {
      const type = P.type || pick(rng, ['num', 'diff', 'youngest']);
      const [x1, x2, x3] = shuffle(rng, ANIMALS).slice(0, 3);
      if (type === 'youngest') {
        let base, d1, d2;
        do { base = R(rng, 4, 8); d1 = R(rng, 1, 3); d2 = R(rng, 1, 3); } while (base + d1 > 9 || base - d2 < 2 || d1 === d2);
        const ages = [base, base + d1, base - d2];
        const order = shuffle(rng, [0, 1, 2]);
        const chars = order.map(i => [x1, x2, x3][i][0]);
        const youngestIdx = order.indexOf(2);
        return {
          prompt: T3(`${x1[1]}는 ${base}살이에요. ${x2[1]}는 ${x1[1]}보다 ${d1}살 많고, ${x3[1]}는 ${x1[1]}보다 ${d2}살 적어요. 가장 어린 친구를 콕! 짚어요`,
            `The ${x1[2]} is ${base}. The ${x2[2]} is ${d1} older than the ${x1[2]}, and the ${x3[2]} is ${d2} younger. Tap the youngest friend`,
            `${x1[3]}${base}岁。${x2[3]}比${x1[3]}大${d1}岁，${x3[3]}比${x1[3]}小${d2}岁。点一点年纪最小的朋友`),
          answer: youngestIdx, answerType: 'number', widget: 'ageStory',
          interaction: 'tap', layout: 'row', total: 3, chars, targetIndex: youngestIdx, ages: order.map(i => ages[i]),
          keyFields: ['chars', 'ages', 'targetIndex']
        };
      }
      let base, d;
      do { base = R(rng, 3, 8); d = R(rng, 1, 4); } while (base + d > 9);
      const older = R(rng, 0, 1) === 1;
      const other = older ? base + d : base - d;
      if (other < 2) return NM_TGEN['g15_scene'](P, rng);
      const chars = [x1[0], x2[0]];
      if (type === 'num') {
        return {
          prompt: older
            ? T3(`${x2[1]}는 ${x1[1]}보다 ${d}살 많아요. ${x1[1]}는 ${base}살이에요. ${x2[1]}는 몇 살일까요?`,
              `The ${x2[2]} is ${d} years older than the ${x1[2]}. The ${x1[2]} is ${base}. How old is the ${x2[2]}?`, `${x2[3]}比${x1[3]}大${d}岁。${x1[3]}${base}岁。${x2[3]}几岁？`)
            : T3(`${x2[1]}는 ${x1[1]}보다 ${d}살 적어요. ${x1[1]}는 ${base}살이에요. ${x2[1]}는 몇 살일까요?`,
              `The ${x2[2]} is ${d} years younger than the ${x1[2]}. The ${x1[2]} is ${base}. How old is the ${x2[2]}?`, `${x2[3]}比${x1[3]}小${d}岁。${x1[3]}${base}岁。${x2[3]}几岁？`),
          answer: other, answerType: 'number', widget: 'ageStory', interaction: 'numpad', layout: 'row', total: 2, chars,
          unit: 'age', keyFields: ['chars', 'unit']
        };
      }
      /* diff — 차를 묻는다 */
      return {
        prompt: older
          ? T3(`${x1[1]}는 ${base}살, ${x2[1]}는 ${other}살이에요. ${x2[1]}는 ${x1[1]}보다 몇 살 많을까요?`,
            `The ${x1[2]} is ${base} and the ${x2[2]} is ${other}. How many years older is the ${x2[2]}?`, `${x1[3]}${base}岁，${x2[3]}${other}岁。${x2[3]}比${x1[3]}大几岁？`)
          : T3(`${x1[1]}는 ${base}살, ${x2[1]}는 ${other}살이에요. ${x2[1]}는 ${x1[1]}보다 몇 살 적을까요?`,
            `The ${x1[2]} is ${base} and the ${x2[2]} is ${other}. How many years younger is the ${x2[2]}?`, `${x1[3]}${base}岁，${x2[3]}${other}岁。${x2[3]}比${x1[3]}小几岁？`),
        answer: d, answerType: 'number', widget: 'ageStory', interaction: 'numpad', layout: 'row', total: 2, chars,
        unit: 'age', keyFields: ['chars', 'unit']
      };
    }

    /* sort3 — 세 바구니(종류별 개수 2~6, 총 ≤12, 동점 없음) */
    {
      const ask = P.ask || pick(rng, ['diff', 'most', 'least']);
      const kinds = shuffle(rng, FRUITS).slice(0, 3);
      for (let t = 0; t < 400; t++) {
        const c = [R(rng, 2, 6), R(rng, 2, 6), R(rng, 2, 6)];
        if (c[0] + c[1] + c[2] > 12 || new Set(c).size !== 3) continue;
        const mx = Math.max.apply(null, c), mn = Math.min.apply(null, c);
        const items = [];
        c.forEach((n, i) => { for (let j = 0; j < n; j++) items.push({ e: kinds[i][0], type: 'ABC'[i] }); });
        const answer = ask === 'diff' ? mx - mn : c.indexOf(ask === 'most' ? mx : mn);
        return {
          prompt: ask === 'diff'
            ? T3('세 종류를 바구니에 나눠 담아요. 가장 많은 것과 가장 적은 것은 몇 개 차이일까요?', 'Sort the three kinds into baskets. How many more is the biggest group than the smallest?', '把三种东西分进篮子。最多的比最少的多几个？')
            : ask === 'most'
              ? T3('세 종류를 바구니에 나눠 담아요. 가장 많은 바구니를 콕! 짚어요', 'Sort the three kinds into baskets. Tap the basket with the most', '把三种东西分进篮子。点一点最多的篮子')
              : T3('세 종류를 바구니에 나눠 담아요. 가장 적은 바구니를 콕! 짚어요', 'Sort the three kinds into baskets. Tap the basket with the fewest', '把三种东西分进篮子。点一点最少的篮子'),
          answer, answerType: 'number', widget: 'sortBasket3',
          items: shuffle(rng, items), baskets: kinds.map(k => ({ emoji: k[0] })), counts: c, askMode: ask,
          choices: ask === 'diff' ? near3(rng, answer, 1, 9) : null,
          keyFields: ['counts', 'baskets', 'askMode']
        };
      }
    }
    throw new Error('g15_scene: 문항을 만들지 못함');
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = NM_TGEN;
})();
