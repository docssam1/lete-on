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

  if (typeof module !== 'undefined' && module.exports) module.exports = NM_TGEN;
})();
