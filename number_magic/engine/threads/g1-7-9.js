/* ============================================================
   유아 교재 G1-7·8·9호 생성기(NM_TGEN) — 더하기와 빼기 I ③④⑤
   계약은 engine/threads/nl.js 머리말과 같다: NM_TGEN[이름] = (params, rng) => problem.
   rng 만 쓴다 — Math.random 금지(R/pick/shuffle). 모든 수·합·차는 0~9.
   문항 하나 = 칸 하나(또는 한 번의 완주). 정답 `answer` 는 숫자 하나이고, 칸이 여럿인
   위젯은 `answer` 가 완주 신호(칸 수·쌍 수)이며 실제 값은 `solution` 에 싣는다.
   스레드: NL37 식 채우기 · NL38 그림으로 식 · NL39 짝 찾기 · NL40 수나무·꼭지점·바퀴 ·
           NL41 수직선 뛰기 · NL42 규칙표·수 상자 · NL43 구슬·암호·잇기
   ⚠ 교재 문장·삽화는 쓰지 않는다 — 활동의 형식만 이어받은 창작 문항이다.
   ============================================================ */
(function () {
  'use strict';

  const { R, pick, shuffle } = NM_RNG;
  const MN = '−';
  const P = (ko, en, zh) => ({ ko, en, zh });
  const range = (a, b) => { const o = []; for (let i = a; i <= b; i++) o.push(i); return o; };
  const sample = (rng, arr, k) => shuffle(rng, arr).slice(0, k);
  const OBJS = ['🍎', '🐤', '⭐', '🎈', '🐟', '🦋', '🌼', '🍓', '🍪', '🍌', '⚽', '🏀', '🍬', '🐞'];

  /* 숫자 뒤 조사 — 0~9 를 읽는 말(영일이삼사오육칠팔구)의 받침으로 고른다 */
  const BAT = [1, 1, 0, 1, 0, 0, 1, 1, 1, 0];
  function jn(n, k) {
    const d = ((n % 10) + 10) % 10, b = BAT[d];
    if (k === 'eul') return b ? '을' : '를';
    if (k === 'i')   return b ? '이' : '가';
    if (k === 'eun') return b ? '은' : '는';
    if (k === 'wa')  return b ? '과' : '와';
    return '';
  }
  const ieyo = n => (BAT[((n % 10) + 10) % 10] ? '이에요' : '예요');

  /* 쌍 찾기·짝 규칙 공용 ------------------------------------------------- */
  function validPair(rule, a, b) { return rule.op === 'sum' ? a + b === rule.target : Math.abs(a - b) === rule.target; }
  function adjOK(adj, x, y) {
    if (adj === 'any') return true;
    if (adj === 'row') return Math.abs(x.i - y.i) === 1;
    const dr = Math.abs(x.r - y.r), dc = Math.abs(x.c - y.c);
    if (adj === '4') return dr + dc === 1;
    if (adj === '8') return Math.max(dr, dc) === 1 && dr + dc > 0;
    return true;
  }
  function edgesOf(items, rule, adj) {
    const e = [];
    for (let i = 0; i < items.length; i++) for (let j = i + 1; j < items.length; j++) {
      if (!validPair(rule, items[i].v, items[j].v)) continue;
      if (!adjOK(adj, Object.assign({ i }, items[i]), Object.assign({ i: j }, items[j]))) continue;
      e.push([items[i].id, items[j].id]);
    }
    return e;
  }
  function maxMatching(edges) {
    let best = [];
    (function go(idx, used, cur) {
      if (cur.length > best.length) best = cur.slice();
      for (let k = idx; k < edges.length; k++) {
        const [a, b] = edges[k];
        if (used.has(a) || used.has(b)) continue;
        used.add(a); used.add(b); cur.push(edges[k]);
        go(k + 1, used, cur);
        cur.pop(); used.delete(a); used.delete(b);
      }
    })(0, new Set(), []);
    return best;
  }
  function isMatching(edges) {
    const seen = new Set();
    for (const [a, b] of edges) { if (seen.has(a) || seen.has(b)) return false; seen.add(a); seen.add(b); }
    return true;
  }

  /* ============================================================
     NL37 식 채우기 — nl37_eqplay
     mode: same · pick(odd|max|between) · count · order · blank · pm · sign · wrong
     ============================================================ */
  /* 식·짝 칩 한 개 — of: 'expr'(a + b / a − b), 'sum'((a, b) 합이 v), 'diff'((a, b) 차가 v) */
  function chipFor(of, v, rng) {
    if (of === 'expr') {
      if (R(rng, 0, 1) === 0) {
        const lo = v >= 2 && R(rng, 0, 3) > 0 ? 1 : 0, a = R(rng, lo, v - lo), b = v - a;
        return { txt: a + ' + ' + b, v, key: '+' + Math.min(a, b) + ',' + Math.max(a, b) };
      }
      const b = R(rng, v === 9 ? 1 : 0, 9 - v), a = v + b;
      return { txt: a + ' ' + MN + ' ' + b, v, key: '-' + a + ',' + b };
    }
    if (of === 'sum') {
      const a = R(rng, 0, v), b = v - a, sw = R(rng, 0, 1) === 1;
      return { txt: sw ? '(' + b + ', ' + a + ')' : '(' + a + ', ' + b + ')', v, key: Math.min(a, b) + ',' + Math.max(a, b) };
    }
    const lo = R(rng, 0, 9 - v), hi = lo + v, sw = R(rng, 0, 1) === 1;
    return { txt: sw ? '(' + lo + ', ' + hi + ')' : '(' + hi + ', ' + lo + ')', v, key: lo + ',' + hi };
  }
  const clean = c => ({ txt: c.txt, v: c.v, ok: !!c.ok });

  function genSame(pa, rng) {
    const of = pa.of || 'expr';
    const T = Array.isArray(pa.target) ? pick(rng, pa.target) : (pa.target != null ? pa.target : 7);
    const N = pa.n || 6;
    const need = R(rng, 2, 3);
    const near = range(0, 9).filter(v => v !== T && Math.abs(v - T) <= 3 && (of !== 'expr' || v >= 1));
    for (let t = 0; t < 300; t++) {
      const used = new Set(), chips = [];
      const add = (v, ok) => {
        for (let k = 0; k < 30; k++) {
          const c = chipFor(of, v, rng);
          if (used.has(c.key)) continue;
          used.add(c.key); c.ok = ok; chips.push(c); return true;
        }
        return false;
      };
      let ok = true;
      for (let i = 0; i < need && ok; i++) ok = add(T, true);
      for (let i = need; i < N && ok; i++) ok = add(pick(rng, near), false);
      if (!ok) continue;
      const word = of === 'expr' ? P(`값이 ${T}인 식을 모두 골라요`, `Pick every expression that equals ${T}`, `选出所有等于${T}的算式`)
        : of === 'sum' ? P(`합이 ${T}인 짝을 모두 골라요`, `Pick every pair whose sum is ${T}`, `选出所有和是${T}的一组`)
        : P(`차가 ${T}인 짝을 모두 골라요`, `Pick every pair whose difference is ${T}`, `选出所有差是${T}的一组`);
      return { prompt: word, answer: need, answerType: 'number', widget: 'valuePick', mode: 'same',
        chips: shuffle(rng, chips).map(clean), cond: { kind: 'equals', value: T, of }, need, keyFields: ['chips', 'cond'] };
    }
    throw new Error('nl37 same: 칩을 못 만들었다');
  }

  function pairWithSum(s, rng) { const a = R(rng, 0, s), b = s - a; return R(rng, 0, 1) ? [a, b] : [b, a]; }
  const pairTxt = p => '(' + p[0] + ', ' + p[1] + ')';
  const pairKey = p => Math.min(p[0], p[1]) + ',' + Math.max(p[0], p[1]);

  function genPick(pa, rng) {
    const kind = pa.kind || 'odd';
    const used = new Set(), chips = [];
    const addSum = (s, ok) => {
      for (let k = 0; k < 40; k++) {
        const p = pairWithSum(s, rng);
        if (used.has(pairKey(p))) continue;
        used.add(pairKey(p)); chips.push({ txt: pairTxt(p), v: s, ok }); return true;
      }
      return false;
    };
    let prompt, cond;
    if (kind === 'odd') {
      for (;;) {
        used.clear(); chips.length = 0;
        const S = pick(rng, pa.sums || [6, 7, 8, 9]);
        const S2 = pick(rng, range(1, 9).filter(v => v !== S));
        let ok = true;
        for (let i = 0; i < 4 && ok; i++) ok = addSum(S, false);
        if (ok && addSum(S2, true)) break;
      }
      prompt = P('합이 다른 하나를 골라요', 'Pick the one whose sum is different', '选出和不一样的那一个');
      cond = { kind: 'odd', of: 'sum' };
    } else if (kind === 'max') {
      const sums = sample(rng, range(1, 9), 5), top = Math.max.apply(null, sums);
      sums.forEach(s => addSum(s, s === top));
      prompt = P('합이 가장 큰 짝을 골라요', 'Pick the pair with the biggest sum', '选出和最大的一组');
      cond = { kind: 'max', of: 'sum' };
    } else {
      const lo = R(rng, 1, 7), hi = lo + 2, S = lo + 1;
      addSum(S, true);
      const others = range(0, 9).filter(v => v !== S);
      const trap = [lo, hi].filter(v => others.indexOf(v) >= 0);
      const take = [];
      if (R(rng, 0, 1)) take.push(pick(rng, trap));
      sample(rng, others.filter(v => take.indexOf(v) < 0), 4).forEach(v => { if (take.length < 4) take.push(v); });
      take.forEach(s => addSum(s, false));
      prompt = P(`합이 ${lo}보다 크고 ${hi}보다 작은 짝을 골라요`, `Pick the pair whose sum is more than ${lo} and less than ${hi}`, `选出和大于${lo}且小于${hi}的一组`);
      cond = { kind: 'between', lo, hi, of: 'sum' };
    }
    return { prompt, answer: 1, answerType: 'number', widget: 'valuePick', mode: 'pick', chips: shuffle(rng, chips), cond, need: 1, keyFields: ['chips', 'cond'] };
  }

  function genCount(pa, rng) {
    for (let t = 0; t < 500; t++) {
      const v = Array.isArray(pa.value) ? pick(rng, pa.value) : (pa.value != null ? pa.value : R(rng, 3, 6));
      const N = R(rng, 6, 8);
      const used = new Set(), chips = [];
      while (chips.length < N) {
        const p = pairWithSum(R(rng, 1, 9), rng);
        if (used.has(pairKey(p))) continue;
        used.add(pairKey(p)); chips.push({ txt: pairTxt(p), v: p[0] + p[1], ok: p[0] + p[1] > v });
      }
      const need = chips.filter(c => c.ok).length;
      if (need < 2 || need > 5 || N - need < 2) continue;
      return { prompt: P(`합이 ${v}보다 큰 짝은 모두 몇 개일까요? 맞는 짝을 모두 골라 세어 봐요`,
        `How many pairs have a sum greater than ${v}? Pick them all and count`, `和大于${v}的一组有几个？把它们都选出来数一数`),
        answer: need, answerType: 'number', widget: 'valuePick', mode: 'count', chips, cond: { kind: 'gt', value: v, of: 'sum' }, need, keyFields: ['chips', 'cond'] };
    }
    throw new Error('nl37 count');
  }

  function genOrder(pa, rng) {
    for (;;) {
      const sums = sample(rng, range(1, 9), 4);
      const toks = sample(rng, ['🍎', '⭐', '🎈', '🐟', '🍓', '🐤'], 4);
      const used = new Set(); const chips = [];
      sums.forEach((s, i) => {
        for (;;) { const p = pairWithSum(s, rng); if (!used.has(pairKey(p))) { used.add(pairKey(p)); chips.push({ txt: pairTxt(p), v: s, e: toks[i] }); break; } }
      });
      const desc = chips.map(c => c.v).sort((a, b) => b - a);
      chips.forEach(c => { c.rank = desc.indexOf(c.v) + 1; });
      return { prompt: P('합이 큰 것부터 차례로 눌러요', 'Tap the pairs from the biggest sum to the smallest', '按和从大到小的顺序点一点'),
        answer: 4, answerType: 'number', widget: 'valuePick', mode: 'order', chips: shuffle(rng, chips), cond: { kind: 'order', dir: 'desc', of: 'sum' }, need: 4, keyFields: ['chips', 'cond'] };
    }
  }

  /* 빈칸 하나짜리 식 공통 모양 */
  function eqProblem(prompt, eq, blank, extra) {
    const ans = blank === 'op' ? null : eq[blank];
    return Object.assign({ prompt, answer: ans, answerType: 'number', widget: 'eqFill', layout: 'h', eq, blank, showEq: true, scene: null,
      keyFields: ['eq', 'blank', 'scene', 'given', 'layout'] }, extra || {});
  }

  function genBlank(pa, rng) {
    const op = pa.op || '+';
    if (pa.whole != null || pa.wholes) {
      const W = pa.wholes ? pick(rng, pa.wholes) : pa.whole;
      if (pa.twin && W % 2 === 0 && W >= 2 && R(rng, 1, 100) <= (pa.twinPct || 25)) {
        const h = W / 2;
        return eqProblem(P(`${W}${jn(W, 'eul')} 똑같은 두 수로 가르면 □는 몇일까요?`, `Split ${W} into two equal numbers. What is □ in □ + □ = ${W}?`, `把${W}分成相同的两个数，□＋□＝${W}，□是几？`),
          { a: h, op: '+', b: h, c: W }, 'a', { twin: true });
      }
      const a = R(rng, W >= 4 ? 1 : 0, W >= 4 ? W - 1 : W), b = W - a;
      return eqProblem(P(`${W}${jn(W, 'eul')} 두 수로 가르는 식이에요. 빈 칸을 채워요`, `Split ${W} into two numbers. Fill the empty box.`, `把${W}分成两个数，填空。`),
        { a, op: '+', b, c: W }, pick(rng, ['a', 'b']));
    }
    /* 일반 가로식: a ± b = c, 빈칸은 a|b|c */
    const o = op === 'mix' ? pick(rng, ['+', '-']) : op;
    let a, b, c;
    if (o === '+') { a = R(rng, 0, 8); b = R(rng, 1, 9 - a); c = a + b; }
    else { a = R(rng, 1, 9); b = R(rng, 1, a); c = a - b; }
    return eqProblem(P('빈 칸에 알맞은 수를 써요', 'Write the number that fits in the empty box.', '在空格里填上合适的数。'),
      { a, op: o, b, c }, pick(rng, pa.blanks || ['a', 'b', 'c']));
  }

  function genPM(pa, rng) {
    const d = pa.d || 1;
    const o = pa.op === 'mix' || !pa.op ? pick(rng, ['+', '-']) : pa.op;
    const a = o === '+' ? R(rng, 0, 9 - d) : R(rng, d, 9);
    const c = o === '+' ? a + d : a - d;
    const blank = pa.blank === 'mix' ? pick(rng, ['a', 'c']) : (pa.blank || 'c');
    const word = o === '+'
      ? P(`${d}${jn(d, 'eul')} 더하는 식이에요. 빈 칸을 채워요`, `Add ${d} — fill the empty box.`, `加${d}，填空。`)
      : P(`${d}${jn(d, 'eul')} 빼는 식이에요. 빈 칸을 채워요`, `Subtract ${d} — fill the empty box.`, `减${d}，填空。`);
    return eqProblem(word, { a, op: o, b: d, c }, blank);
  }

  function genSign(pa, rng) {
    const o = pick(rng, ['+', '-']), b = R(rng, 1, 9);
    let a, c;
    if (o === '+') { a = R(rng, 0, 9 - b); c = a + b; } else { a = R(rng, b, 9); c = a - b; }
    return eqProblem(P('돋보기가 가린 기호는 더하기(+)일까요, 빼기(−)일까요?', 'The magnifier hides a sign. Is it + or −?', '放大镜遮住了符号，是＋还是－？'),
      { a, op: null, b, c }, 'op', { layout: pick(rng, ['v', 'h']), opChoices: ['+', '-'], opTrue: o, answer: o === '+' ? 1 : 2 });
  }

  function genWrong(pa, rng) {
    const roll = R(rng, 1, 10);
    const kind = roll <= 4 ? 'none' : roll <= 7 ? '+' : '-';
    let a, b, c;
    if (kind === '+') { b = R(rng, 1, 9); a = R(rng, 0, 9 - b); c = a + b; }
    else if (kind === '-') { b = R(rng, 1, 9); a = R(rng, b, 9); c = a - b; }
    else {
      for (;;) { a = R(rng, 0, 9); b = R(rng, 1, 9); c = R(rng, 0, 9); if (c !== a + b && c !== a - b) break; }
    }
    return eqProblem(P('가려진 기호가 +인지 −인지 찾아요. 어느 쪽도 맞지 않으면 ✕를 눌러요', 'Is the hidden sign + or −? Pick ✕ if neither works.', '找出被遮住的符号是＋还是－；哪个都不对就选✕。'),
      { a, op: null, b, c }, 'op', { layout: pick(rng, ['v', 'h']), opChoices: ['+', '-', 'none'], opTrue: kind, answer: kind === '+' ? 1 : kind === '-' ? 2 : 3 });
  }

  NM_TGEN['nl37_eqplay'] = function (pa, rng) {
    pa = pa || {};
    switch (pa.mode || 'same') {
      case 'pick': return genPick(pa, rng);
      case 'count': return genCount(pa, rng);
      case 'order': return genOrder(pa, rng);
      case 'blank': return genBlank(pa, rng);
      case 'pm': return genPM(pa, rng);
      case 'sign': return genSign(pa, rng);
      case 'wrong': return genWrong(pa, rng);
      default: return genSame(pa, rng);
    }
  };

  /* ============================================================
     NL38 그림으로 식 — nl38_scene
     mode: dice · price · domino · symbols · dots · coins · group2 · invert
     ============================================================ */
  function sceneDice(pa, rng) {
    const practice = pa.level === 'practice';
    const op = pa.op === 'mix' ? pick(rng, ['+', '-']) : (pa.op || '+');
    const slot = pick(rng, ['a', 'b']);
    const d = R(rng, 1, practice ? 4 : 6);
    let a, b;
    if (op === '+') {
      const x = R(rng, 0, Math.min(practice ? 5 : 9, 9 - d));
      if (slot === 'a') { a = d; b = x; } else { a = x; b = d; }
    } else if (slot === 'a') { a = d; b = R(rng, 0, d); }
    else { b = d; a = R(rng, d, 9); }
    const c = op === '+' ? a + b : a - b;
    const word = op === '+' ? P('주사위를 굴려 나온 수와 더해요. 답을 써요', 'Roll the die, then add the number it shows.', '掷骰子，再和点数相加。写出答案。')
      : P('주사위를 굴려 나온 수로 빼요. 답을 써요', 'Roll the die, then subtract using the number it shows.', '掷骰子，再用点数相减。写出答案。');
    return eqProblem(word, { a, op, b, c }, 'c', { layout: 'v', scene: { kind: 'dice', slot, face: d } });
  }

  function scenePrice(pa, rng) {
    const max = pa.max || 4;
    const toks = sample(rng, OBJS, 2);
    let p1, p2; do { p1 = R(rng, 1, max); p2 = R(rng, 1, max); } while (p1 + p2 > 9);
    return eqProblem(P('두 물건을 사려면 모두 얼마가 필요할까요?', 'How much money do you need to buy both?', '买这两样东西一共需要多少钱？'),
      { a: p1, op: '+', b: p2, c: p1 + p2 }, 'c',
      { showEq: false, scene: { kind: 'price', items: [{ e: toks[0], price: p1 }, { e: toks[1], price: p2 }] }, unit: P('원', 'coins', '元') });
  }

  function sceneDomino(pa, rng) {
    const kind = pa.kind === 'mix' ? pick(rng, ['sum', 'missing']) : (pa.kind || 'sum');
    let a, b; do { a = R(rng, 0, 6); b = R(rng, 0, 6); } while (a + b > 9 || a + b === 0);
    const c = a + b;
    if (kind === 'sum')
      return eqProblem(P('도미노의 점을 모두 세어 몇 개인지 써요', 'Count all the dots on the domino.', '数一数多米诺上一共有几个点。'),
        { a, op: '+', b, c }, 'c', { showEq: false, scene: { kind: 'domino', a, b, hidden: null } });
    const hid = pick(rng, ['a', 'b']);
    return eqProblem(P(`합이 ${c}${ieyo(c)}. 빈 쪽에는 점이 몇 개일까요?`, `The total is ${c}. How many dots go in the empty half?`, `一共是${c}，空的一边有几个点？`),
      { a, op: '+', b, c }, hid, { showEq: false, scene: { kind: 'domino', a, b, hidden: hid } });
  }

  function sceneSymbols(pa, rng) {
    const toks = sample(rng, OBJS, 3), vals = sample(rng, range(1, 5), 3);
    const map = toks.map((e, i) => ({ e, v: vals[i] }));
    for (;;) {
      const x = pick(rng, map), y = pick(rng, map);
      const o = pa.op || pick(rng, ['+', '-']);
      if (o === '+' ? x.v + y.v > 9 : x.v < y.v) continue;
      const c = o === '+' ? x.v + y.v : x.v - y.v;
      return eqProblem(P('그림마다 정해진 수가 있어요. 식을 계산해요', 'Each picture stands for a number. Work out the sum.', '每个图案代表一个数，算出得数。'),
        { a: x.v, op: o, b: y.v, c, symA: x.e, symB: y.e }, 'c', { scene: { kind: 'legend', map }, keyFields: ['eq', 'blank', 'scene'] });
    }
  }

  function sceneDots(pa, rng) {
    const given = R(rng, 1, 4), c = R(rng, given + 1, 9), a = c - given;
    const swap = R(rng, 0, 1) === 1;
    const eq = swap ? { a: given, op: '+', b: a, c } : { a, op: '+', b: given, c };
    return eqProblem(P(`식에 맞게 ○를 더 놓아요. □는 몇 개일까요?`, `Add more circles to make the sum true. How many is □?`, `按算式再放上○，□是几个？`),
      eq, swap ? 'b' : 'a', { scene: { kind: 'dots', given } });
  }

  function sceneCoins(pa, rng) {
    const toss = !!pa.toss;
    const n = R(rng, toss ? 6 : 4, 9), a = R(rng, 1, n - 1), b = n - a;
    const faces = shuffle(rng, range(0, n - 1).map(i => (i < a ? 's' : 'm')));
    const sw = R(rng, 0, 1) === 1, x = sw ? b : a, y = sw ? a : b;
    const form = pick(rng, ['sum', 'addend', 'minuend', 'subtrahend']);
    let eq, blank;
    if (form === 'sum') { eq = { a: x, op: '+', b: y, c: n }; blank = 'c'; }
    else if (form === 'addend') { eq = { a: x, op: '+', b: y, c: n }; blank = 'a'; }
    else if (form === 'minuend') { eq = { a: n, op: '-', b: x, c: y }; blank = 'a'; }
    else { eq = { a: n, op: '-', b: y, c: x }; blank = 'b'; }
    const word = toss
      ? P(`동전 ${n}개를 던져요. 나온 그림을 보고 빈 칸에 알맞은 수를 써요`, `Toss ${n} coins. Look at what shows up and fill the blank.`, `扔${n}枚硬币，看看出现的图案，填空。`)
      : P('동전을 보고 □ 안에 알맞은 수를 써요', 'Look at the coins and fill the box.', '看硬币，把□里的数填出来。');
    return eqProblem(word, eq, blank, { scene: { kind: 'coins', n, a, b, faces, toss }, form });
  }

  function sceneGroup2(pa, rng) {
    const toks = sample(rng, OBJS, 2);
    let n1, n2; do { n1 = R(rng, 1, 8); n2 = R(rng, 1, 8); } while (n1 + n2 > 9);
    const t = n1 + n2;
    const form = pick(rng, ['add12', 'add21', 'sub2', 'sub1']);
    const eq = form === 'add12' ? { a: n1, op: '+', b: n2, c: t } : form === 'add21' ? { a: n2, op: '+', b: n1, c: t }
      : form === 'sub2' ? { a: t, op: '-', b: n2, c: n1 } : { a: t, op: '-', b: n1, c: n2 };
    return eqProblem(P('그림을 보고 식의 빈 칸을 채워요', 'Look at the picture and fill the blank in the sum.', '看图，填出算式里的空格。'),
      eq, 'c', { scene: { kind: 'group2', a: { e: toks[0], n: n1 }, b: { e: toks[1], n: n2 } }, form });
  }

  function sceneInvert(pa, rng) {
    const dir = pa.dir === 'mix' || !pa.dir ? pick(rng, ['sub', 'add']) : pa.dir;
    let given, eq;
    if (dir === 'sub') {                     /* a + b = c  ⇒  c − b = □ 또는 c − a = □ */
      const a = R(rng, 1, 8), b = R(rng, 1, 9 - a), c = a + b;
      given = { a, op: '+', b, c };
      eq = R(rng, 0, 1) ? { a: c, op: '-', b, c: a } : { a: c, op: '-', b: a, c: b };
    } else {                                 /* a − b = c  ⇒  c + b = □ 또는 b + c = □ */
      const b = R(rng, 1, 8), c = R(rng, 1, 9 - b), a = b + c;
      given = { a, op: '-', b, c };
      eq = R(rng, 0, 1) ? { a: c, op: '+', b, c: a } : { a: b, op: '+', b: c, c: a };
    }
    return eqProblem(P('위 식을 보고 아래 식의 빈 칸을 채워요', 'Use the top equation to fill the blank in the bottom one.', '看上面的算式，填出下面算式的空格。'),
      eq, 'c', { given });
  }

  NM_TGEN['nl38_scene'] = function (pa, rng) {
    pa = pa || {};
    switch (pa.mode || 'dice') {
      case 'price': return scenePrice(pa, rng);
      case 'domino': return sceneDomino(pa, rng);
      case 'symbols': return sceneSymbols(pa, rng);
      case 'dots': return sceneDots(pa, rng);
      case 'coins': return sceneCoins(pa, rng);
      case 'group2': return sceneGroup2(pa, rng);
      case 'invert': return sceneInvert(pa, rng);
      default: return sceneDice(pa, rng);
    }
  };

  /* ============================================================
     NL39 짝 찾기 — nl39_pairfind
     layout: ring · scatter · grid · row · cards
     ============================================================ */
  const ringPos = (n, shape) => {
    const out = [];
    for (let i = 0; i < n; i++) {
      if (shape === 'circle') {
        const ang = -Math.PI / 2 + i * 2 * Math.PI / n;
        out.push({ x: +(50 + 38 * Math.cos(ang)).toFixed(1), y: +(50 + 38 * Math.sin(ang)).toFixed(1) });
      } else {                                   /* 정사각형 둘레를 같은 간격으로 */
        const per = 4 * 76, step = per / n, s = (step / 2 + i * step) % per;
        let x, y;
        if (s < 76) { x = 12 + s; y = 12; } else if (s < 152) { x = 88; y = 12 + (s - 76); }
        else if (s < 228) { x = 88 - (s - 152); y = 88; } else { x = 12; y = 88 - (s - 228); }
        out.push({ x: +x.toFixed(1), y: +y.toFixed(1) });
      }
    }
    return out;
  };
  function scatterPlace(rng, n, minD) {
    const pts = []; let md = minD;
    while (pts.length < n) {
      let ok = false;
      for (let t = 0; t < 80 && !ok; t++) {
        const x = 12 + R(rng, 0, 760) / 10, y = 14 + R(rng, 0, 720) / 10;
        if (pts.every(p => Math.hypot(p.x - x, p.y - y) >= md)) { pts.push({ x: +x.toFixed(1), y: +y.toFixed(1) }); ok = true; }
      }
      if (!ok) md -= 2;
    }
    return pts;
  }
  /* 합이 t 인 서로 다른 보수쌍 목록(x < t−x) */
  const compPairs = t => { const o = []; for (let x = 0; 2 * x < t; x++) if (t - x <= 9) o.push([x, t - x]); return o; };
  /* 짝이 없는 홀로 수 — 이미 놓인 수의 보수도, 서로의 보수도 아닌 것만 고른다 */
  function loners(rng, t, have, count) {
    const set = new Set(have), out = [];
    shuffle(rng, range(0, 9)).forEach(v => {
      if (out.length >= count || set.has(v) || set.has(t - v) || v === t - v) return;
      set.add(v); out.push(v);
    });
    return out;
  }
  const wordPair = (op, t) => op === 'sum'
    ? P(`합이 ${t}인 두 수를 짝지어 이어요`, `Join the two numbers whose sum is ${t}.`, `把和是${t}的两个数连起来。`)
    : P(`차가 ${t}인 두 수를 짝지어 이어요`, `Join the two numbers whose difference is ${t}.`, `把差是${t}的两个数连起来。`);

  function pfBase(layout, rule, items, adj, need, extra) {
    const edges = edgesOf(items, rule, adj);
    const match = maxMatching(edges).slice(0, need);
    return Object.assign({ answer: need, answerType: 'number', widget: 'pairFind', layout, rule, items, adj, need, reuse: false, showEq: false,
      solution: match, keyFields: ['items', 'rule', 'layout', 'need'] }, extra || {});
  }

  /* 모든 보수쌍(합)·사슬 없는 쌍(차)로 이뤄진 값 목록 → 항목 */
  function valuesAllPairs(rng, op, t, k) {
    if (op === 'sum') {
      const cp = compPairs(t); if (cp.length < k) return null;
      return shuffle(rng, sample(rng, cp, k).reduce((a, p) => a.concat(p), []));
    }
    for (let tr = 0; tr < 200; tr++) {
      const vals = [], pairs = [];
      for (let i = 0; i < k; i++) { const lo = R(rng, 0, 9 - t); pairs.push([lo, lo + t]); vals.push(lo, lo + t); }
      if (new Set(vals).size !== vals.length) continue;
      const its = vals.map((v, i) => ({ id: i, v }));
      const ed = edgesOf(its, { op: 'diff', target: t }, 'any');
      if (ed.length === k && isMatching(ed)) return shuffle(rng, vals);
    }
    return null;
  }

  function genRing(pa, rng) {
    const op = pa.op || 'sum', k = pa.pairs || 3, shape = pa.shape || 'square';
    for (let tr = 0; tr < 400; tr++) {
      const t = op === 'sum' ? (Array.isArray(pa.targets) ? pick(rng, pa.targets) : R(rng, 3, 9)) : R(rng, 1, 4);
      const vals = valuesAllPairs(rng, op, t, k);
      if (!vals) continue;
      const pos = ringPos(vals.length, shape);
      const items = vals.map((v, i) => ({ id: i, v, x: pos[i].x, y: pos[i].y }));
      return pfBase('ring', { op, target: t }, items, 'any', k, { shape, prompt: wordPair(op, t) });
    }
    throw new Error('nl39 ring');
  }

  function genScatter(pa, rng) {
    const n = pa.n || 8;
    for (let tr = 0; tr < 400; tr++) {
      const t = Array.isArray(pa.targets) ? pick(rng, pa.targets) : R(rng, 6, 9);
      const cp = compPairs(t);
      let vals;
      if (n >= 10) vals = range(0, 9);
      else {
        const k = Math.min(cp.length, R(rng, pa.kMin || 2, pa.kMax || 3));
        const chosen = sample(rng, cp, k), have = new Set(); chosen.forEach(p => { have.add(p[0]); have.add(p[1]); });
        vals = Array.from(have).concat(loners(rng, t, Array.from(have), n - have.size));
        if (vals.length < n) continue;
      }
      vals = shuffle(rng, vals);
      const pos = scatterPlace(rng, vals.length, vals.length >= 9 ? 17 : 22);
      const items = vals.map((v, i) => ({ id: i, v, x: pos[i].x, y: pos[i].y, r: R(rng, -18, 18), s: R(rng, 88, 118) / 100, f: R(rng, 0, 4) }));
      const rule = { op: 'sum', target: t };
      const ed = edgesOf(items, rule, 'any');
      if (!isMatching(ed) || ed.length < 2) continue;
      return pfBase('scatter', rule, items, 'any', ed.length, { prompt: P(`합이 ${t}${jn(t, 'i')} 되는 두 수를 선으로 이어요`, `Join each pair of numbers that add up to ${t}.`, `把和是${t}的两个数用线连起来。`) });
    }
    throw new Error('nl39 scatter');
  }

  function genGrid2(pa, rng) {
    const op = pa.op || 'diff';
    for (let tr = 0; tr < 800; tr++) {
      const t = op === 'sum' ? R(rng, 6, 9) : R(rng, 0, 4);
      const vals = [R(rng, 0, 9), R(rng, 0, 9), R(rng, 0, 9), R(rng, 0, 9)];
      const items = vals.map((v, i) => ({ id: i, v, r: i >> 1, c: i & 1 }));
      const rule = { op, target: t };
      const ed = edgesOf(items, rule, 'any');
      if (ed.length !== 1) continue;
      const word = op === 'sum' ? P(`합이 ${t}인 두 수를 찾아 색칠해요`, `Find the two numbers whose sum is ${t} and color them.`, `找出和是${t}的两个数并涂色。`)
        : P(`차가 ${t}인 두 수를 찾아 색칠해요`, `Find the two numbers whose difference is ${t} and color them.`, `找出差是${t}的两个数并涂色。`);
      return pfBase('grid', rule, items, 'any', 1, { size: 2, prompt: word });
    }
    throw new Error('nl39 grid2');
  }

  function genGrid4(pa, rng) {
    for (let tr = 0; tr < 4000; tr++) {
      const d = R(rng, 1, 3);
      const vals = range(0, 15).map(() => R(rng, 0, 9));
      const items = vals.map((v, i) => ({ id: i, v, r: i >> 2, c: i & 3 }));
      const rule = { op: 'diff', target: d };
      const ed = edgesOf(items, rule, '8');
      const strict = tr < 3000;
      if (strict ? !(ed.length === 3 && isMatching(ed)) : (maxMatching(ed).length < 3 || ed.length > 5)) continue;
      return pfBase('grid', rule, items, '8', 3, { size: 4, skin: 'fish',
        prompt: P(`옆·위·아래·비스듬히 이웃한 수 중 차가 ${d}인 짝을 3개 찾아요`, `Find 3 pairs of neighbours (including diagonals) that differ by ${d}.`, `找出3组相邻（含斜着）的、差是${d}的数。`) });
    }
    throw new Error('nl39 grid4');
  }

  function genRow(pa, rng) {
    const n = pa.n || 10, need = pa.need || 1;
    for (let tr = 0; tr < 6000; tr++) {
      const t = R(rng, 1, 4);
      const vals = range(0, n - 1).map(() => R(rng, 0, 9));
      const items = vals.map((v, i) => ({ id: i, v }));
      const rule = { op: 'diff', target: t };
      const ed = edgesOf(items, rule, 'row');
      if (ed.length !== need || !isMatching(ed)) continue;
      return pfBase('row', rule, items, 'row', need, { prompt: P(`옆에 붙은 두 수의 차가 ${t}인 쌍을 찾아 묶어요`, `Circle the neighbours whose difference is ${t}.`, `圈出相邻的、差是${t}的两个数。`) });
    }
    throw new Error('nl39 row');
  }

  function genCards(pa, rng) {
    const kind = pa.kind || 'all';           /* all(모든 쌍·식 보임) · one(합 t 쌍 하나만) · diff3(차 d, 3쌍) · any(차 k, 아무 쌍) */
    if (kind === 'diff3') {
      const d = pick(rng, pa.ds || [2, 3, 4]);
      const items = shuffle(rng, range(0, 9)).map((v, i) => ({ id: i, v }));
      return pfBase('cards', { op: 'diff', target: d }, items, 'any', 3, { showEq: true,
        prompt: P(`차가 ${d}인 두 장을 짝지어 3쌍 이어요`, `Join 3 pairs of cards whose difference is ${d}.`, `把差是${d}的两张卡片连成3组。`) });
    }
    if (kind === 'any') {
      for (let tr = 0; tr < 500; tr++) {
        const k = R(rng, 1, 8), n = R(rng, 7, 8);
        const vals = sample(rng, range(0, 9), n);
        const items = vals.map((v, i) => ({ id: i, v }));
        const rule = { op: 'diff', target: k };
        const ed = edgesOf(items, rule, 'any');
        if (ed.length < 1 || ed.length > 2) continue;
        const need = 1;
        return pfBase('cards', rule, items, 'any', need, { showEq: true, any: true,
          prompt: P(`두 장을 골라 차가 ${k}${jn(k, 'i')} 되는 뺄셈식을 만들어요`, `Pick two cards whose difference is ${k} and make a subtraction.`, `选两张卡片，使它们的差是${k}，列出减法算式。`) });
      }
      throw new Error('nl39 any');
    }
    for (let tr = 0; tr < 500; tr++) {
      const t = pa.t != null ? pa.t : R(rng, 5, 9);
      const cp = compPairs(t);
      const k = kind === 'one' ? 1 : Math.min(cp.length, R(rng, pa.kMin || 2, pa.kMax || 3));
      const chosen = sample(rng, cp, k), have = [];
      chosen.forEach(p => { have.push(p[0], p[1]); });
      const n = pa.n || (R(rng, 6, 7));
      const vals = shuffle(rng, have.concat(loners(rng, t, have, n - have.length)));
      if (vals.length < n) continue;
      const items = vals.map((v, i) => ({ id: i, v }));
      const rule = { op: 'sum', target: t };
      const ed = edgesOf(items, rule, 'any');
      if (ed.length !== k || !isMatching(ed)) continue;
      const word = kind === 'one'
        ? P(`합이 ${t}인 두 수를 골라 묶어요`, `Pick the two numbers that add up to ${t}.`, `选出和是${t}的两个数。`)
        : P(`두 장을 골라 합이 ${t}${jn(t, 'i')} 되는 짝을 모두 찾아요`, `Find every pair of cards that adds up to ${t}.`, `找出所有和是${t}的两张卡片。`);
      return pfBase('cards', rule, items, 'any', k, { showEq: kind !== 'one', prompt: word });
    }
    throw new Error('nl39 cards');
  }

  NM_TGEN['nl39_pairfind'] = function (pa, rng) {
    pa = pa || {};
    switch (pa.layout || 'ring') {
      case 'scatter': return genScatter(pa, rng);
      case 'grid': return pa.size === 4 ? genGrid4(pa, rng) : genGrid2(pa, rng);
      case 'row': return genRow(pa, rng);
      case 'cards': return genCards(pa, rng);
      default: return genRing(pa, rng);
    }
  };

  /* ============================================================
     NL40 수나무·꼭지점·바퀴·표 — nl40_diagram
     mode: tree · vertex · wheel · opgrid
     ============================================================ */
  /* 수나무 모양: 안쪽 마디 = [왼쪽, 오른쪽], 잎 = 0 */
  const TREE_ASYM = [
    [[0, 0], [0, [0, 0]]],
    [0, [0, [0, 0]]],
    [[0, [0, 0]], [0, 0]],
    [[0, 0], [[0, 0], 0]],
    [[[0, 0], 0], [0, 0]],
    [0, [[0, 0], 0]],
    [[0, 0], [0, [0, 0]]]
  ];
  function buildTree(shape, rng) {
    const nodes = [];
    const walk = (t) => {
      const id = nodes.length; nodes.push({ id, v: null, kids: null });
      if (Array.isArray(t)) {
        const k = shuffle(rng, t).map(walk);                 /* 왼쪽·오른쪽을 섞어 거울상도 나오게 */
        nodes[id].kids = k;
      }
      return id;
    };
    walk(shape === 'sym4' ? [[0, 0], [0, 0]] : pick(rng, TREE_ASYM));
    return nodes;
  }
  function treeFill(nodes, rng) {
    const leaves = nodes.filter(n => !n.kids);
    for (let t = 0; t < 200; t++) {
      leaves.forEach(l => { l.v = R(rng, 1, 3); });
      const calc = id => { const n = nodes[id]; if (n.kids) n.v = calc(n.kids[0]) + calc(n.kids[1]); return n.v; };
      if (calc(0) <= 9) return true;
    }
    return false;
  }
  function treeSolvable(nodes, blankSet) {
    const known = nodes.map(n => !blankSet.has(n.id));
    let ch = true;
    while (ch) {
      ch = false;
      nodes.forEach(n => {
        if (!n.kids) return;
        const [x, y] = n.kids;
        if (!known[n.id] && known[x] && known[y]) { known[n.id] = true; ch = true; }
        else if (known[n.id] && known[x] && !known[y]) { known[y] = true; ch = true; }
        else if (known[n.id] && !known[x] && known[y]) { known[x] = true; ch = true; }
      });
    }
    return known.every(Boolean);
  }
  function genTree(pa, rng) {
    const shape = pa.shape || 'sym4', flow = pa.flow || 'merge';
    const kMin = pa.kMin || 1, kMax = pa.kMax || 2;
    for (let tr = 0; tr < 800; tr++) {
      const nodes = buildTree(shape, rng);
      if (!treeFill(nodes, rng)) continue;
      const full = nodes.map(n => n.v);
      const k = R(rng, kMin, Math.min(kMax, nodes.length - 1));
      const blanks = sample(rng, nodes.map(n => n.id), k);
      const bs = new Set(blanks);
      if (!treeSolvable(nodes, bs)) continue;
      if (pa.noRoot && bs.has(0)) continue;
      const sorted = blanks.slice().sort((a, b) => a - b);
      const out = nodes.map(n => ({ id: n.id, v: bs.has(n.id) ? null : n.v, kids: n.kids }));
      const word = flow === 'split'
        ? P('위 원의 수는 아래 두 원을 더한 값이에요. 빈 원에 알맞은 수를 써요', 'A circle is the sum of the two circles below it. Fill the empty circles.', '每个圆圈里的数等于它下面两个圆圈的和，把空圆圈填出来。')
        : P('아래 원의 수는 위 두 원을 더한 값이에요. 빈 원에 알맞은 수를 써요', 'A circle is the sum of the two circles above it. Fill the empty circles.', '每个圆圈里的数等于它上面两个圆圈的和，把空圆圈填出来。');
      return { prompt: word, answer: sorted.length, answerType: 'number', widget: 'treeFill', shape, flow, nodes: out, root: 0,
        blanks: sorted, solution: sorted.map(i => full[i]), keyFields: ['nodes', 'flow'] };
    }
    throw new Error('nl40 tree');
  }

  /* 꼭지점 합 도형 — tri: 꼭지점 3 · 변 3, quad: 꼭지점 4 · 변 4. 변 i = verts[i] + verts[(i+1)%n] */
  function vertexSolvable(n, blanksV, blanksE) {
    const kv = range(0, n - 1).map(i => !blanksV.has(i)), ke = range(0, n - 1).map(i => !blanksE.has(i));
    let ch = true;
    while (ch) {
      ch = false;
      for (let i = 0; i < n; i++) {
        const j = (i + 1) % n;
        const kn = [kv[i], kv[j], ke[i]].filter(Boolean).length;
        if (kn === 2) { kv[i] = kv[j] = ke[i] = true; ch = true; }
      }
    }
    return kv.every(Boolean) && ke.every(Boolean);
  }
  function genVertex(pa, rng) {
    const shape = pa.shape || 'tri', n = shape === 'quad' ? 4 : 3, reverse = !!pa.reverse;
    for (let tr = 0; tr < 800; tr++) {
      const verts = range(0, n - 1).map(() => R(rng, 0, shape === 'quad' ? 4 : 5));
      const edges = range(0, n - 1).map(i => verts[i] + verts[(i + 1) % n]);
      if (edges.some(e => e > 9)) continue;
      if (new Set(verts).size < 2) continue;
      let bv = new Set(), be = new Set();
      if (!reverse) { sample(rng, range(0, n - 1), R(rng, 1, n)).forEach(i => be.add(i)); }
      else {
        sample(rng, range(0, n - 1), R(rng, 1, n === 3 ? 2 : 2)).forEach(i => bv.add(i));
        if (R(rng, 0, 1)) be.add(R(rng, 0, n - 1));
      }
      if (!vertexSolvable(n, bv, be)) continue;
      const blanks = [];
      range(0, n - 1).forEach(i => { if (bv.has(i)) blanks.push({ kind: 'v', idx: i }); });
      range(0, n - 1).forEach(i => { if (be.has(i)) blanks.push({ kind: 'e', idx: i }); });
      return { prompt: P('네모 안의 수는 양쪽 꼭지점을 더한 값이에요. 빈 곳에 알맞은 수를 써요', 'Each circle is the sum of the two corners next to it. Fill the blanks.', '圆圈里是两边顶点的和，把空格填出来。'),
        answer: blanks.length, answerType: 'number', widget: 'vertexSum', shape,
        verts: verts.map((v, i) => bv.has(i) ? null : v), edges: edges.map((e, i) => be.has(i) ? null : e),
        blanks, solution: blanks.map(b => b.kind === 'v' ? verts[b.idx] : edges[b.idx]), keyFields: ['verts', 'edges', 'shape'] };
    }
    throw new Error('nl40 vertex');
  }

  function genWheel(pa, rng) {
    if (pa.wheel === 'opposite') {
      for (;;) {
        const S = R(rng, 3, 9);
        const w = range(0, 2).map(() => R(rng, 0, S));
        const wedges = [w[0], w[1], w[2], S - w[0], S - w[1], S - w[2]];
        const full = pick(rng, [0, 1, 2]);
        const others = [0, 1, 2].filter(i => i !== full);
        const blanks = others.map(i => (R(rng, 0, 1) ? i : i + 3));
        const shown = wedges.map((v, i) => blanks.indexOf(i) >= 0 ? null : v);
        const sorted = blanks.slice().sort((a, b) => a - b);
        /* 다 알려진 쌍이 둘이라 합이 하나로 읽히려면 그 쌍의 합이 같아야 한다 — 위는 항상 S */
        return { prompt: P('마주 보는 두 수의 합이 모두 같도록 빈 칸을 채워요', 'Fill the blanks so opposite numbers always have the same sum.', '填空，使相对的两个数的和都一样。'),
          answer: sorted.length, answerType: 'number', widget: 'wheelFill', mode: 'opposite', wedges: shown,
          blanks: sorted, solution: sorted.map(i => wedges[i]), keyFields: ['wedges', 'mode'] };
      }
    }
    const S = R(rng, 5, 9), inner = range(0, 4).map(() => R(rng, 0, S));
    const outer = inner.map(v => S - v);
    const nb = R(rng, 3, 4), secs = sample(rng, [0, 1, 2, 3, 4], nb);
    const blankKeys = secs.map(s => ({ s, side: R(rng, 0, 1) ? 'inner' : 'outer' }));
    const sectors = range(0, 4).map(i => ({ inner: inner[i], outer: outer[i] }));
    blankKeys.forEach(b => { sectors[b.s][b.side] = null; });
    const order = blankKeys.slice().sort((a, b) => a.s - b.s);
    return { prompt: P('가운데 수와 같아지도록 빈 칸을 채워요', 'Fill the blanks so each pair adds up to the center number.', '填空，使每一对数相加都等于中间的数。'),
      answer: order.length, answerType: 'number', widget: 'wheelFill', mode: 'sectors', center: S, sectors,
      blanks: order.map(b => ({ s: b.s, side: b.side })), solution: order.map(b => b.side === 'inner' ? inner[b.s] : outer[b.s]), keyFields: ['sectors', 'center', 'mode'] };
  }

  function genOpGrid(pa, rng) {
    const nb = pa.blanks || 3;
    for (let tr = 0; tr < 2000; tr++) {
      const g00 = R(rng, 1, 9), g01 = R(rng, 0, 9 - g00), g10 = R(rng, 0, g00), g11 = R(rng, 0, g01);
      const g = [[g00, g01, g00 + g01], [g10, g11, g10 + g11], [g00 - g10, g01 - g11, 0]];
      g[2][2] = g[2][0] + g[2][1];
      if (g[0][2] - g[1][2] !== g[2][2]) continue;
      if (g.some(r => r.some(v => v < 0 || v > 9))) continue;
      if (new Set(g.reduce((a, r) => a.concat(r), [])).size < 5) continue;
      const cells = sample(rng, range(0, 8), nb);
      const known = range(0, 8).map(i => cells.indexOf(i) < 0);
      let ch = true;
      const lines = [];
      for (let r = 0; r < 3; r++) lines.push([r * 3, r * 3 + 1, r * 3 + 2]);
      for (let c = 0; c < 3; c++) lines.push([c, 3 + c, 6 + c]);
      while (ch) {
        ch = false;
        lines.forEach(L => { const un = L.filter(i => !known[i]); if (un.length === 1) { known[un[0]] = true; ch = true; } });
      }
      if (!known.every(Boolean)) continue;
      const sorted = cells.slice().sort((a, b) => a - b);
      const flat = g.reduce((a, r) => a.concat(r), []);
      const shown = g.map((r, ri) => r.map((v, ci) => cells.indexOf(ri * 3 + ci) >= 0 ? null : v));
      return { prompt: P('가로로는 더하고, 세로로는 빼요. 빈 칸을 채워요', 'Add across, subtract down. Fill the blanks.', '横着加，竖着减，把空格填出来。'),
        answer: sorted.length, answerType: 'number', widget: 'opGrid', g: shown,
        blanks: sorted.map(i => [Math.floor(i / 3), i % 3]), solution: sorted.map(i => flat[i]), keyFields: ['g'] };
    }
    throw new Error('nl40 opgrid');
  }

  NM_TGEN['nl40_diagram'] = function (pa, rng) {
    pa = pa || {};
    switch (pa.mode || 'tree') {
      case 'vertex': return genVertex(pa, rng);
      case 'wheel': return genWheel(pa, rng);
      case 'opgrid': return genOpGrid(pa, rng);
      default: return genTree(pa, rng);
    }
  };

  /* ============================================================
     NL41 수직선 뛰기 — nl41_hop
     mode: read(호가 그려져 있음) · draw(눈금을 눌러 호를 그림) , free(□+□=c)
     ============================================================ */
  NM_TGEN['nl41_hop'] = function (pa, rng) {
    pa = pa || {};
    const mode = pa.mode || 'read';
    const op = pa.dir === 'mix' || !pa.dir ? pick(rng, ['+', '-']) : pa.dir;
    const mover = pick(rng, ['frog', 'animal:rabbit', 'animal:turtle']);
    if (pa.free) {
      const c = op === '+' ? R(rng, 2, 9) : R(rng, 1, 8);
      const lo = op === '+' ? 1 : c + 1, hi = op === '+' ? c - 1 : 9;
      return { prompt: P('눈금 위에서 뛰어 □ 두 칸을 채워요. 아무 수나 괜찮아요', 'Hop on the number line to fill both boxes. Any answer that works is fine.', '在数轴上跳一跳，把两个□填出来，只要成立就行。'),
        answer: c, answerType: 'number', widget: 'hopLine', mode: 'draw', free: true, max: 9, mover, hops: [], eq: { a: null, op, b: null, c }, blank: 'ab',
        range: [lo, hi], keyFields: ['eq', 'mover', 'free'] };
    }
    let a, b, c;
    if (op === '+') { a = R(rng, 1, 8); b = R(rng, 1, 9 - a); c = a + b; }
    else { a = R(rng, 2, 9); b = R(rng, 1, a - (pa.zero ? 0 : 1)); c = a - b; }
    const blank = pick(rng, pa.blanks || ['a', 'b', 'c']);
    const word = mode === 'read'
      ? P('뛴 모습이에요. 빈 칸에 알맞은 수를 써요', 'Look at the hops. Fill the empty box.', '看跳的样子，把空格填出来。')
      : P('눈금 위에서 뛰는 길을 그리고 빈 칸을 채워요', 'Draw the hops on the number line, then fill the box.', '在数轴上画出跳的路线，再填空。');
    return { prompt: word, answer: { a, b, c }[blank], answerType: 'number', widget: 'hopLine', mode, max: 9, mover,
      hops: [{ from: 0, to: a }, { from: a, to: c }], eq: { a, op, b, c }, blank, keyFields: ['eq', 'blank', 'mover', 'mode'] };
  };

  /* ============================================================
     NL42 규칙표·수 상자 — nl42_rules
     mode: house(지붕 규칙) · strip(두 줄 숨은 규칙) · chain(두 번 연산) · box(수 상자) · sum2(입구 둘)
     ============================================================ */
  const signed = k => (k > 0 ? '+' : MN) + Math.abs(k);
  function genHouse(pa, rng) {
    const k = pa.plusOnly ? R(rng, 1, 4) : pick(rng, [-4, -3, -2, -1, 1, 2, 3, 4]);
    const nrows = R(rng, 3, 4);
    const ins = k > 0 ? range(0, 9 - k) : range(-k, 9);
    const inVals = sample(rng, ins, Math.min(nrows, ins.length));
    const rows = inVals.map(v => ({ in: v, out: v + k }));
    const blanks = [];
    rows.forEach((r, i) => {
      const askIn = pa.mixIn && R(rng, 0, 2) === 0;
      if (askIn) blanks.push({ row: i, side: 'in' }); else blanks.push({ row: i, side: 'out' });
    });
    if (pa.mixIn && !blanks.some(b => b.side === 'in')) blanks[0].side = 'in';
    const solution = blanks.map(b => rows[b.row][b.side]);
    const shown = rows.map((r, i) => { const b = blanks[i]; return { in: b.side === 'in' ? null : r.in, out: b.side === 'out' ? null : r.out }; });
    return { prompt: P('지붕의 약속대로 계산해서 빈 칸을 채워요', 'Follow the roof rule and fill the empty boxes.', '按屋顶上的规则计算，填空。'),
      answer: blanks.length, answerType: 'number', widget: 'ruleTable', layout: 'house', rule: { kind: k > 0 ? 'add' : 'sub', k: Math.abs(k), shown: true },
      roof: [signed(k)], rows: shown, blanks, solution, keyFields: ['rows', 'roof'] };
  }

  function genStrip(pa, rng) {
    const kind = pa.rule || 'delta';
    const ncols = pa.cols || R(rng, 5, 6);
    for (let tr = 0; tr < 500; tr++) {
      let k, tops, bottoms;
      if (kind === 'colsum') {
        k = R(rng, 3, 9);
        tops = sample(rng, range(0, k), ncols); if (tops.length < ncols) continue;
        bottoms = tops.map(t => k - t);
      } else {
        k = pick(rng, [-4, -3, -2, -1, 1, 2, 3, 4]);
        const pool = k > 0 ? range(0, 9 - k) : range(-k, 9);
        tops = sample(rng, pool, ncols); if (tops.length < ncols) continue;
        bottoms = tops.map(t => t + k);
      }
      if (new Set(tops).size !== tops.length) continue;
      const nb = R(rng, 2, 3);
      const blankCols = sample(rng, range(0, ncols - 1), nb);
      const blanks = blankCols.sort((a, b) => a - b).map(c => ({ col: c, row: R(rng, 0, 1) ? 'top' : 'bottom' }));
      const cols = tops.map((t, i) => { const b = blanks.find(x => x.col === i); return { top: b && b.row === 'top' ? null : t, bottom: b && b.row === 'bottom' ? null : bottoms[i] }; });
      const solution = blanks.map(b => b.row === 'top' ? tops[b.col] : bottoms[b.col]);
      return { prompt: P('위와 아래 수에 숨은 규칙을 찾아 빈 칸을 채워요', 'Find the hidden rule between the top and bottom numbers and fill the blanks.', '找出上下两行数字之间的规律，填空。'),
        answer: blanks.length, answerType: 'number', widget: 'ruleTable', layout: 'strip', rule: { kind: kind === 'colsum' ? 'colsum' : (k > 0 ? 'add' : 'sub'), k: Math.abs(k), shown: false },
        cols, blanks, solution, keyFields: ['cols'] };
    }
    throw new Error('nl42 strip');
  }

  function genChain(pa, rng) {
    for (let tr = 0; tr < 500; tr++) {
      const k1 = pick(rng, [-4, -3, -2, -1, 1, 2, 3, 4]), k2 = pick(rng, [-4, -3, -2, -1, 1, 2, 3, 4]);
      if (k1 === k2) continue;
      const ok = range(0, 9).filter(s => s + k1 >= 0 && s + k1 <= 9 && s + k1 + k2 >= 0 && s + k1 + k2 <= 9);
      if (ok.length < 3) continue;
      const starts = sample(rng, ok, 3);
      const rows = starts.map(s => ({ in: s, mid: s + k1, out: s + k1 + k2 }));
      const sides = ['in', 'mid', 'out'];
      const blanks = rows.map((r, i) => ({ row: i, side: pick(rng, sides) }));
      if (new Set(blanks.map(b => b.side)).size < 2) continue;
      const shown = rows.map((r, i) => { const o = { in: r.in, mid: r.mid, out: r.out }; o[blanks[i].side] = null; return o; });
      return { prompt: P('두 가지 약속을 차례로 따라가며 빈 칸을 채워요', 'Follow the two rules in order and fill the empty boxes.', '依次按两个规则计算，填空。'),
        answer: blanks.length, answerType: 'number', widget: 'ruleTable', layout: 'chain', rule: { kind: 'chain', shown: true }, roof: [signed(k1), signed(k2)],
        rows: shown, blanks, solution: blanks.map(b => rows[b.row][b.side]), keyFields: ['rows', 'roof'] };
    }
    throw new Error('nl42 chain');
  }

  function genBox(pa, rng) {
    const askIn = pa.ask === 'in' || (pa.ask === 'mix' && R(rng, 0, 1) === 1);
    const ds = pa.plusOnly ? [1, 2, 3] : [-4, -3, -2, -1, 1, 2, 3, 4];
    const d = pick(rng, ds);
    const ok = d > 0 ? range(0, 9 - d) : range(-d, 9);
    const ins = sample(rng, ok, 3);
    if (ins.length < 3) return genBox(pa, rng);
    const rows = [ins[0], ins[1]].map(v => ({ in: v, out: v + d }));
    const q = { in: ins[2], out: ins[2] + d };
    const shown = askIn ? { in: null, out: q.out } : { in: q.in, out: null };
    return { prompt: P('상자마다 같은 규칙이에요. 규칙을 찾아 빈 칸에 알맞은 수를 써요', 'Every box follows the same rule. Find it and fill in the blank.', '每个盒子的规则都一样，找出规则填空。'),
      answer: askIn ? q.in : q.out, answerType: 'number', widget: 'machineBox', kind: 'rule', ask: askIn ? 'in' : 'out', rows, q: shown, rule: signed(d), keyFields: ['rows', 'q'] };
  }

  function genSum2(pa, rng) {
    const ask = pa.ask === 'mix' || !pa.ask ? pick(rng, ['out', 'a', 'b']) : pa.ask;
    const mk = () => { const a = R(rng, pa.zero ? 0 : 1, 8), b = R(rng, pa.zero ? 0 : 1, 9 - a); return { a, b, out: a + b }; };
    const r1 = mk(); let r2 = mk(); while (r2.a === r1.a && r2.b === r1.b) r2 = mk();
    const q = mk();
    const shown = { a: ask === 'a' ? null : q.a, b: ask === 'b' ? null : q.b, out: ask === 'out' ? null : q.out };
    return { prompt: P('두 수를 상자에 넣으면 합이 나와요. 빈 칸에 알맞은 수를 써요', 'Put two numbers in the box and their sum comes out. Fill the blank.', '往盒子里放两个数，出来的是它们的和。填空。'),
      answer: q[ask], answerType: 'number', widget: 'machineBox', kind: 'sum2', ask, rows: [r1, r2], q: shown, keyFields: ['rows', 'q'] };
  }

  NM_TGEN['nl42_rules'] = function (pa, rng) {
    pa = pa || {};
    switch (pa.mode || 'house') {
      case 'strip': return genStrip(pa, rng);
      case 'chain': return genChain(pa, rng);
      case 'box': return genBox(pa, rng);
      case 'sum2': return genSum2(pa, rng);
      default: return genHouse(pa, rng);
    }
  };

  /* ============================================================
     NL43 구슬·암호·잇기 — nl43_hidden
     mode: beads(숨은 구슬) · hands(바둑돌 두 손) · code(그림 암호) · sumMatch(합이 같은 짝 잇기) · pyramid4(4줄 피라미드)
     ============================================================ */
  const BEAD_COLORS = ['#e53935', '#3b8fe0', '#43a047', '#ffd23f', '#8e6bd8'];
  function genBeads(pa, rng) {
    const whole = R(rng, 3, 9), visible = R(rng, 0, whole - 1), hidden = whole - visible;
    const ask = pa.ask === 'mix' || !pa.ask ? pick(rng, ['hidden', 'whole']) : pa.ask;
    const colors = range(0, whole - 1).map(() => pick(rng, BEAD_COLORS.slice(0, 4)));
    const word = ask === 'hidden'
      ? P(`구슬이 모두 ${whole}개예요. 상자 속에는 몇 개 숨어 있을까요?`, `There are ${whole} beads in all. How many are hidden in the box?`, `一共有${whole}颗珠子，盒子里藏着几颗？`)
      : P(`밖에 보이는 구슬이 ${visible}개, 상자 속에 ${hidden}개예요. 구슬은 모두 몇 개일까요?`, `${visible} beads show and ${hidden} are in the box. How many beads in all?`, `外面看到${visible}颗，盒子里有${hidden}颗。一共有几颗？`);
    return { prompt: word, answer: ask === 'hidden' ? hidden : whole, answerType: 'number', widget: 'hiddenBeads', whole, visible, hidden, ask, colors,
      bond: { top: ask === 'whole' ? null : whole, left: visible, right: ask === 'hidden' ? null : hidden }, keyFields: ['whole', 'visible', 'ask', 'colors'] };
  }

  function genHands(pa, rng) {
    const whole = R(rng, 5, 8), a = R(rng, 0, whole);
    return { prompt: P(`바둑돌 ${whole}개를 두 손에 나눠 쥐었어요. 왼손에 ${a}개면 오른손에는 몇 개일까요?`, `${whole} stones are split between two hands. The left hand has ${a}. How many in the right hand?`, `把${whole}颗棋子分在两只手里，左手有${a}颗，右手有几颗？`),
      answer: whole - a, answerType: 'number', widget: 'numberBond', dir: 'split', whole, a, emoji: '⚫' };
  }

  function genCode(pa, rng) {
    for (let tr = 0; tr < 500; tr++) {
      const n = 3, toks = sample(rng, OBJS, n);   /* 인쇄 칸 높이 때문에 3개로 고정 */
      const symbols = toks.map(e => {
        const op = pick(rng, ['+', '-']);
        let a, b;
        if (op === '+') { a = R(rng, 1, 8); b = R(rng, 1, 9 - a); } else { a = R(rng, 2, 9); b = R(rng, 1, a - 1); }
        return { e, a, op, b, v: op === '+' ? a + b : a - b };
      });
      if (new Set(symbols.map(s => s.v)).size !== n) continue;
      const secret = shuffle(rng, range(0, n - 1)).slice(0, 3);
      return { prompt: P('그림마다 식을 계산해서 암호표를 만들어요. 숫자를 보고 그림을 맞춰요', "Solve each picture's sum to make a code table, then decode the numbers.", '先算出每个图案的得数做成密码表，再根据数字找出图案。'),
        answer: 3, answerType: 'number', widget: 'codeBreak', symbols, secret, keyFields: ['symbols', 'secret'] };
    }
    throw new Error('nl43 code');
  }

  function genSumMatch(pa, rng) {
    for (let tr = 0; tr < 800; tr++) {
      const sums = sample(rng, range(3, 9), 3);
      const mk = s => { const a = R(rng, 0, s), b = s - a; return [a, b]; };
      const L = sums.map(mk), Rr = sums.map(mk);
      const key = p => pairKey(p);
      if (L.some((p, i) => key(p) === key(Rr[i]))) continue;
      const right = shuffle(rng, Rr.map((p, i) => ({ p, s: sums[i] })));
      return { prompt: P('합이 같은 짝끼리 선으로 이어요', 'Join the pairs that have the same sum.', '把和相同的两组用线连起来。'),
        answer: 3, answerType: 'number', widget: 'sumMatch', left: L.map((p, i) => ({ p, s: sums[i] })), right, keyFields: ['left', 'right'] };
    }
    throw new Error('nl43 sumMatch');
  }

  /* 4줄 뒤집힌 피라미드: 윗줄 4칸이 보이고 한 줄씩 이웃 합으로 내려와 맨 아래 한 칸이 물음 */
  function genPyramid4(pa, rng) {
    for (let tr = 0; tr < 800; tr++) {
      const t = range(0, 3).map(() => R(rng, 0, 3));
      const r2 = [t[0] + t[1], t[1] + t[2], t[2] + t[3]], r3 = [r2[0] + r2[1], r2[1] + r2[2]], r4 = r3[0] + r3[1];
      if (r4 > 9 || r4 < 1 || t.every(v => v === 0)) continue;
      if (t.filter(v => v === 0).length > 1) continue;
      return { prompt: P('아래 수는 위의 이웃한 두 수의 합이에요. ?에 알맞은 수를 골라요', 'Each number is the sum of the two above it. Pick the number for ?.', '下面的数是上面相邻两个数的和。选出?处的数。'),
        answer: r4, answerType: 'number', widget: 'pyramid4', rows: [t, r2, r3, [null]], inverted: true };
    }
    throw new Error('nl43 pyramid4');
  }

  NM_TGEN['nl43_hidden'] = function (pa, rng) {
    pa = pa || {};
    switch (pa.mode || 'beads') {
      case 'hands': return genHands(pa, rng);
      case 'code': return genCode(pa, rng);
      case 'sumMatch': return genSumMatch(pa, rng);
      case 'pyramid4': return genPyramid4(pa, rng);
      default: return genBeads(pa, rng);
    }
  };
})();
