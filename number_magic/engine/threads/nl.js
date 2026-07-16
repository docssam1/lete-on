/* ============================================================
   Numbers of Magic — NL 수의 나라 스레드 생성기 (유아 5~7세)
   계약: NM_TGEN[genKey] = function(params, rng) { return problem; }
   절대 Math.random() 사용 금지 — R(rng,a,b) / pick(rng,arr) / shuffle(rng,arr) 만 사용
   ⚠️ 모든 장면·문구는 창작 콘텐츠(이모지) — 라이선스 교재 삽화/지문 사용 금지
   ============================================================ */
(function () {
  'use strict';

  const { R, pick, shuffle } = NM_RNG;

  /* ── 창작 이모지 풀: [이모지, ko, en, zh] ──────────────────── */
  const THINGS = [
    ['🍎', '사과',   'apples',      '苹果'],
    ['🐤', '병아리', 'chicks',      '小鸡'],
    ['⭐', '별',     'stars',       '星星'],
    ['🎈', '풍선',   'balloons',    '气球'],
    ['🐟', '물고기', 'fish',        '鱼'],
    ['🦋', '나비',   'butterflies', '蝴蝶'],
    ['🌼', '꽃',     'flowers',     '花'],
    ['🍓', '딸기',   'strawberries','草莓'],
    ['🐢', '거북이', 'turtles',     '乌龟'],
    ['🍪', '쿠키',   'cookies',     '饼干']
  ];

  /* ── NL1 — 수 세기와 개수 ─────────────────────────────────
     mode:'count'  섞인 그림에서 특정 대상만 세기 → tapCount 위젯
     mode:'make'   제시된 수만큼 만들기(탭 스탬프)   → tapMake 위젯 */
  NM_TGEN['nl1_count'] = function (params, rng) {
    const mode = (params && params.mode) || 'count';
    const lv   = (params && params.level) || 'main';
    const max  = lv === 'practice' ? 5 : 9;   /* practice: 1~5, main: 최대 9 */

    if (mode === 'make') {
      const n    = R(rng, lv === 'practice' ? 2 : 3, max);
      const [em, ko, en, zh] = pick(rng, THINGS);
      return {
        prompt: {
          ko: `${ko}를 ${n}개 만들어요! 판을 톡톡 눌러 보세요`,
          en: `Make ${n} ${en}! Tap the board`,
          zh: `做出${n}个${zh}！点一点板子`
        },
        answer:     n,
        answerType: 'number',
        widget:     'tapMake',
        emoji:      em,
        target:     n
      };
    }

    /* ---- count: 목표 이모지 + 방해 이모지 섞인 장면 ---- */
    const pool     = shuffle(rng, THINGS.slice());
    const [em, ko, en, zh] = pool[0];
    const nTarget  = R(rng, 2, max);
    const nOthers  = lv === 'practice' ? R(rng, 2, 4) : R(rng, 3, 6);

    const items = [];
    for (let i = 0; i < nTarget; i++) items.push({ e: em, t: true });
    for (let i = 0; i < nOthers; i++) {
      const other = pool[1 + (i % Math.min(2, pool.length - 1))];  /* 방해물 1~2종 */
      items.push({ e: other[0], t: false });
    }

    return {
      prompt: {
        ko: `${ko}는 모두 몇 개일까요? ${ko}만 톡톡 세어 보세요`,
        en: `How many ${en}? Tap and count only the ${en}`,
        zh: `一共有几个${zh}？只点${zh}数一数`
      },
      answer:     nTarget,
      answerType: 'number',
      widget:     'tapCount',
      emoji:      em,
      items:      shuffle(rng, items)
    };
  };

  /* ── NL4 — 모으기·가르기·0 (넘버본드 트리) ────────────────
     mode:'join'   두 부분을 모으면 전체는? (아래 두 원 → 위 원)
     mode:'split'  전체를 갈라요 — 나머지 부분은? (위 원 → 아래 원)
     0 개념: main 레벨에서 한쪽이 0인 경우가 자연스럽게 등장 */
  NM_TGEN['nl4_bond'] = function (params, rng) {
    const mode = (params && params.mode) || 'split';
    const lv   = (params && params.level) || 'main';
    const [em, ko, en, zh] = pick(rng, THINGS);

    if (mode === 'join') {
      let a, b;
      if (lv === 'practice') { a = R(rng, 1, 3); b = R(rng, 1, Math.min(4, 5 - a)); }
      else {
        a = R(rng, 0, 5); b = R(rng, 0, Math.min(9, 9 - a));
        if (a === 0 && b === 0) { a = R(rng, 1, 5); }        /* 0+0 방지 */
      }
      return {
        prompt: {
          ko: `${ko} ${a}개와 ${b}개를 모으면 모두 몇 개? 위쪽 원을 톡톡 채워요`,
          en: `Join ${a} and ${b} ${en} — how many in all? Tap to fill the top circle`,
          zh: `把${a}个和${b}个${zh}合起来一共几个？点一点填满上面的圆`
        },
        answer:     a + b,
        answerType: 'number',
        widget:     'numberBond',
        dir:        'join',
        a, b,
        emoji:      em
      };
    }

    /* ---- split: 전체와 한 부분 제시 → 나머지 부분 ---- */
    const whole = lv === 'practice' ? R(rng, 3, 5) : R(rng, 3, 9);
    const a     = lv === 'practice' ? R(rng, 1, whole - 1) : R(rng, 0, whole);
    return {
      prompt: {
        ko: `${ko} ${whole}개를 두 접시에 갈라요. 한 접시에 ${a}개면 다른 접시엔 몇 개? 빈 원을 톡톡!`,
        en: `Split ${whole} ${en} onto two plates. One has ${a} — how many on the other? Tap the empty circle!`,
        zh: `把${whole}个${zh}分到两个盘子里。一个盘子有${a}个，另一个有几个？点一点空圆！`
      },
      answer:     whole - a,
      answerType: 'number',
      widget:     'numberBond',
      dir:        'split',
      whole, a,
      emoji:      em
    };
  };

  /* ── 점 잇기 창작 도형 (viewBox 0~100 좌표, 전부 오리지널) ── */
  const DD_SHAPES = [
    { name: { ko: '집', en: 'house', zh: '房子' }, close: true,
      pts: [[15,88],[15,45],[50,12],[85,45],[85,88]] },
    { name: { ko: '로켓', en: 'rocket', zh: '火箭' }, close: true,
      pts: [[50,8],[68,32],[68,72],[50,92],[32,72],[32,32]] },
    { name: { ko: '물고기', en: 'fish', zh: '鱼' }, close: true,
      pts: [[10,50],[35,26],[70,30],[90,50],[70,70],[35,74]] },
    { name: { ko: '별', en: 'star', zh: '星星' }, close: true,
      pts: [[50,5],[61,36],[94,36],[67,57],[78,90],[50,70],[22,90],[33,57],[6,36],[39,36]] }
  ];

  /* ── NL2 — 수의 순서 ──────────────────────────────────────
     mode:'gap'   수열 빈칸 — 이어 세기·거꾸로·2씩 뛰어세기 → seqFill 위젯
     mode:'dots'  1부터 차례로 점을 이어 그림 완성 → dotToDot 위젯 */
  NM_TGEN['nl2_seq'] = function (params, rng) {
    const mode = (params && params.mode) || 'gap';
    const lv   = (params && params.level) || 'main';

    if (mode === 'dots') {
      const shape = pick(rng, lv === 'practice' ? DD_SHAPES.slice(0, 3) : DD_SHAPES);
      return {
        prompt: {
          ko: `1부터 차례대로 점을 이어 ${shape.name.ko}을(를) 완성해요!`,
          en: `Connect the dots from 1 in order to finish the ${shape.name.en}!`,
          zh: `从1开始按顺序连点，画出${shape.name.zh}！`
        },
        answer:     shape.pts.length,
        answerType: 'number',
        widget:     'dotToDot',
        pts:        shape.pts,
        close:      shape.close
      };
    }

    /* ---- gap: 수열 빈칸 ---- */
    const kind = lv === 'practice' ? 'up' : pick(rng, ['up', 'down', 'skip2']);
    const len  = 5;
    let start, step;
    if (kind === 'up')        { step = 1;  start = R(rng, 1, (lv==='practice'?10:20) - (len-1)); }
    else if (kind === 'down') { step = -1; start = R(rng, len, 20); }
    else                      { step = 2;  start = R(rng, 1, 20 - 2*(len-1)); }

    const seq = [];
    for (let i = 0; i < len; i++) seq.push(start + step * i);
    const blank = R(rng, 1, len - 1);          /* 첫 칸은 힌트로 남김 */

    return {
      prompt: kind === 'down' ? {
        ko: '거꾸로 세기! 빈 칸에 올 수를 골라요',
        en: 'Counting backwards! Pick the number for the blank',
        zh: '倒着数！选出空格里的数'
      } : kind === 'skip2' ? {
        ko: '2씩 뛰어세기! 빈 칸에 올 수를 골라요',
        en: 'Skip-count by 2! Pick the number for the blank',
        zh: '两个两个跳着数！选出空格里的数'
      } : {
        ko: '순서대로! 빈 칸에 올 수를 골라요',
        en: 'In order! Pick the number for the blank',
        zh: '按顺序！选出空格里的数'
      },
      answer:     seq[blank],
      answerType: 'number',
      widget:     'seqFill',
      seq, blank
    };
  };

  /* ── NL9 — 연쇄 합성·화폐 감각 ────────────────────────────
     mode:'coins'    10원 동전 뛰어세기 — 탭 배지가 10,20,30… (tapCount 재사용)
     mode:'pyramid'  수 피라미드 — 이웃 두 수의 합이 위 돌 → pyramid 위젯 */
  NM_TGEN['nl9_chain'] = function (params, rng) {
    const mode = (params && params.mode) || 'pyramid';
    const lv   = (params && params.level) || 'main';

    if (mode === 'coins') {
      const n = lv === 'practice' ? R(rng, 2, 5) : R(rng, 3, 9);
      const items = [];
      for (let i = 0; i < n; i++) items.push({ e: '🪙', t: true });
      return {
        prompt: {
          ko: '한 닢에 10원! 10, 20, 30… 뛰어세며 톡톡 — 모두 얼마인지 골라요',
          en: 'Each coin is 10! Tap along — 10, 20, 30… then pick the total',
          zh: '一枚10元！10、20、30……跳着数，选出一共多少'
        },
        answer:     n * 10,
        answerType: 'number',
        widget:     'tapCount',
        emoji:      '🪙',
        step:       10,
        items
      };
    }

    /* ---- pyramid: 아랫돌 3개 → 이웃 합으로 위 돌 ----
       바닥 1~3, 꼭대기 ≤ 9 보장. practice는 꼭대기만, main은 중간/꼭대기 빈칸 */
    let a, b, c, tries = 0;
    do { a = R(rng, 1, 3); b = R(rng, 1, 3); c = R(rng, 1, 3); tries++; }
    while (a + 2 * b + c > 9 && tries < 40);
    if (a + 2 * b + c > 9) { a = 1; b = 1; c = 1; }
    const m1 = a + b, m2 = b + c, top = m1 + m2;

    const spots = lv === 'practice' ? [[0, 0]] : [[0, 0], [1, 0], [1, 1]];
    const [ar, ai] = pick(rng, spots);
    const rows = [[top], [m1, m2], [a, b, c]];
    const answer = rows[ar][ai];
    rows[ar] = rows[ar].slice();
    rows[ar][ai] = null;

    return {
      prompt: {
        ko: '이웃한 두 돌을 모으면 위 돌이 돼요! 빈 돌에 올 수를 골라요',
        en: 'Two neighbor stones join into the stone above! Pick the missing one',
        zh: '相邻两块石头合起来就是上面那块！选出空石头上的数'
      },
      answer,
      answerType: 'number',
      widget:     'pyramid',
      rows
    };
  };

  /* ── NL7 — 10까지의 수 관계망 ─────────────────────────────
     mode:'tenpair'  텐프레임 — n개에서 10 만들기(10의 짝꿍) → tenframe 위젯
     mode:'oneStep'  1 큰 수 / 1 작은 수 — 세어 보고 이웃 수 고르기 → tapCount 위젯
                     (장면의 개수 자체가 함정 보기로 등장) */
  NM_TGEN['nl7_relation'] = function (params, rng) {
    const mode = (params && params.mode) || 'tenpair';

    if (mode === 'oneStep') {
      const more = pick(rng, [true, false]);          /* 1 큰 수 / 1 작은 수 */
      const [em, ko, en, zh] = pick(rng, THINGS);
      const n = more ? R(rng, 1, 8) : R(rng, 2, 9);   /* 답이 1~9 안에 있게 */
      const items = [];
      for (let i = 0; i < n; i++) items.push({ e: em, t: true });
      return {
        prompt: more ? {
          ko: `${ko}를 세어 보고, 그것보다 1 큰 수를 골라요!`,
          en: `Count the ${en}, then pick the number that is 1 more!`,
          zh: `数一数${zh}，选比它大1的数！`
        } : {
          ko: `${ko}를 세어 보고, 그것보다 1 작은 수를 골라요!`,
          en: `Count the ${en}, then pick the number that is 1 less!`,
          zh: `数一数${zh}，选比它小1的数！`
        },
        answer:     more ? n + 1 : n - 1,
        answerType: 'number',
        widget:     'tapCount',
        emoji:      em,
        items
      };
    }

    /* ---- tenpair: 텐프레임에서 10의 짝꿍 만들기 ---- */
    const n = R(rng, 3, 9);
    return {
      prompt: {
        ko: `${n}의 10 짝꿍을 찾아요! 빈 칸을 눌러 10을 가득 채워 봐요`,
        en: `Find ${n}'s partner to 10! Tap the empty squares to fill up to 10`,
        zh: `找${n}的凑十好朋友！点空格把10填满`
      },
      answer:     10 - n,
      answerType: 'number',
      widget:     'tenframe',
      cubes:      { piles: [n, 0], moveTo: 10 }
    };
  };

  if (typeof module !== 'undefined' && module.exports) module.exports = NM_TGEN;
})();
