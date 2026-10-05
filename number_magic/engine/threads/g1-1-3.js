/* ============================================================
   Numbers of Magic — G1-1~3호(N-01 수 세기 · N-02 수의 순서 · N-03 몇째와 크기 비교) 생성기
   계약: NM_TGEN['이름'] = function(params, rng) → problem. Math.random 금지 — R/pick/shuffle 만.
   위젯 이름은 전부 g13 접두(다른 묶음의 numPick 등과 NM_WIDGET_EXT 가 겹치지 않게).
   ⚠️ 모든 장면·문구는 창작(교재 문장·삽화 사용 금지). 문구는 ko/en/zh 3개 언어.
   구성:
     g13_n1  N-01  modes: count|make(원본 nl1_count) family shapes table grid rowpaint rep repFill cut length blocks odd turn
     g13_n2  N-02  modes: gap(원본) dots repeat between path skipPaint nearMark nearest nearOrder pinball
     g13_n3  N-03  modes: position|paint(원본) ord build flip find word order cmp range candy minmax arrowTri rest blocksCmp more
   기존 스레드 NL1·NL4·NL8 에 덧붙인 레벨은 params.g13 로 이쪽에 들어온다(원본 생성기를 한 겹 감싼다 — nl.js 불변).
   ============================================================ */
(function () {
  'use strict';
  const { R, pick, shuffle } = NM_RNG;
  const L3 = (ko, en, zh) => ({ ko, en, zh });

  function josa(w, withB, noB) {
    const c = String(w).charCodeAt(String(w).length - 1);
    const b = c >= 0xAC00 && c <= 0xD7A3 && ((c - 0xAC00) % 28) !== 0;
    return w + (b ? withB : noB);
  }
  const NATIVE = { ko: ['', '하나', '둘', '셋', '넷', '다섯', '여섯', '일곱', '여덟', '아홉'],
                   en: ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'],
                   zh: ['', '一', '二', '三', '四', '五', '六', '七', '八', '九'] };
  const SINO_KO = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];
  const ORD = { ko: ['', '첫째', '둘째', '셋째', '넷째', '다섯째', '여섯째', '일곱째', '여덟째', '아홉째'],
                en: ['', 'first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh', 'eighth', 'ninth'],
                zh: ['', '第一', '第二', '第三', '第四', '第五', '第六', '第七', '第八', '第九'] };

  /* 보기 만들기 — 정답 근처 수를 섞어 n개(정답 포함). lo~hi 안. rng 만 쓴다. */
  function choicesOf(rng, ans, n, lo, hi) {
    n = n || 3; lo = lo == null ? 1 : lo; hi = hi == null ? 9 : hi;
    let near = [], far = [];
    for (let d = 1; d <= 9; d++) [ans - d, ans + d].forEach(v => { if (v >= lo && v <= hi && v !== ans) (d <= 2 ? near : far).push(v); });
    const out = shuffle(rng, near).concat(shuffle(rng, far)).slice(0, n - 1);
    return shuffle(rng, [ans].concat(out));
  }

  /* ── 흩어진 장면 좌표(nl.js 와 같은 방식 — 비공개라 같은 규칙으로 다시 쓴다) ── */
  function scatterPos(rng, sizes) {
    const rad = sizes.map(s => 8.8 * s), pts = [];
    let k = 1.0;
    while (pts.length < sizes.length) {
      const i = pts.length; let ok = false;
      for (let tries = 0; tries < 70 && !ok; tries++) {
        const m = Math.min(rad[i] * 1.12, 30);
        const x = m + R(rng, 0, Math.round((100 - 2 * m) * 10)) / 10, y = m + R(rng, 0, Math.round((100 - 2 * m) * 10)) / 10;
        if (pts.every((p, j) => Math.hypot(p.x - x, p.y - y) >= (rad[i] + rad[j]) * k)) { pts.push({ x, y }); ok = true; }
      }
      if (!ok) k -= 0.06;
    }
    return pts;
  }
  function dress(rng, items) {
    const sizes = items.map(() => R(rng, 70, 145) / 100);
    const pos = scatterPos(rng, sizes);
    return items.map((it, i) => Object.assign({}, it, {
      x: Math.round(pos[i].x * 10) / 10, y: Math.round(pos[i].y * 10) / 10, r: R(rng, -28, 28), s: sizes[i], f: R(rng, 0, 4) }));
  }
  const plain = items => items.map(it => Object.assign({}, it));

  /* ── 같은 부류 물건(교재의 '같은 종류 안에서 하나만 세기') [토큰, ko, en, zh, 단위?] ── */
  const U_GAE = L3('개', '', '个'), U_MARI = L3('마리', '', '只');
  const FAM = {
    ball: { unit: U_GAE, items: [['⚽', '축구공', 'soccer balls', '足球'], ['🏀', '농구공', 'basketballs', '篮球'],
      ['baseball', '야구공', 'baseballs', '棒球'], ['rugby-ball', '럭비공', 'rugby balls', '橄榄球']] },
    animal: { unit: U_MARI, items: [['animal:bear', '곰', 'bears', '熊'], ['animal:rabbit', '토끼', 'rabbits', '兔子'],
      ['animal:squirrel', '다람쥐', 'squirrels', '松鼠'], ['animal:fox', '여우', 'foxes', '狐狸'],
      ['animal:turtle', '거북이', 'turtles', '乌龟'], ['animal:deer', '사슴', 'deer', '鹿']] },
    fruit: { unit: U_GAE, items: [['🍎', '사과', 'apples', '苹果'], ['🍌', '바나나', 'bananas', '香蕉'], ['🍓', '딸기', 'strawberries', '草莓'],
      ['grapes', '포도', 'grapes', '葡萄', L3('송이', '', '串')], ['watermelon', '수박', 'watermelons', '西瓜'], ['pear', '배', 'pears', '梨']] },
    sky: { unit: U_GAE, items: [['⭐', '별', 'stars', '星星'], ['moon', '달', 'moons', '月亮'], ['sun', '해', 'suns', '太阳']] }
  };
  const SHAPES = [['shape:circle', '동그라미', 'circles', '圆形'], ['shape:square', '네모', 'squares', '正方形'], ['shape:triangle', '세모', 'triangles', '三角形']];
  const WEATHER = [['sun', '맑은 날', 'sunny days', '晴天'], ['rain', '비 온 날', 'rainy days', '雨天'], ['cloud', '흐린 날', 'cloudy days', '阴天']];
  const DAYS = { ko: ['일', '월', '화', '수', '목', '금', '토'], en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], zh: ['日', '一', '二', '三', '四', '五', '六'] };
  /* 만들기·색칠 소재 */
  const THINGS = [['🍎', '사과', 'apples', '苹果'], ['🐤', '병아리', 'chicks', '小鸡'], ['⭐', '별', 'stars', '星星'], ['🎈', '풍선', 'balloons', '气球'],
    ['🐟', '물고기', 'fish', '鱼'], ['🦋', '나비', 'butterflies', '蝴蝶'], ['🌼', '꽃', 'flowers', '花'], ['🍓', '딸기', 'strawberries', '草莓'], ['🍪', '쿠키', 'cookies', '饼干']];

  /* 문항 하나를 완성 — 인쇄용 문구(printAsk)와 변별 필드(keyFields)를 한 곳에서 붙인다 */
  function done(base, printAsk, keyFields) {
    base.answerType = 'number';
    if (printAsk) base.printAsk = printAsk;
    base.keyFields = keyFields || [];
    return base;
  }
  function numTxt(n, form, lang) {
    if (form === 'digit') return String(n);
    if (form === 'sino' && lang === 'ko') return SINO_KO[n];
    return NATIVE[lang][n];
  }

  /* ── 격자 위의 붙어 있는 모양(폴리오미노) ── */
  function polyomino(rng, rows, cols, n) {
    const at = (r, c) => r * cols + c;
    const set = new Set([at(R(rng, 0, rows - 1), R(rng, 0, cols - 1))]);
    let guard = 0;
    while (set.size < n && guard++ < 400) {
      const fr = [];
      set.forEach(i => { const r = Math.floor(i / cols), c = i % cols;
        [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]].forEach(([a, b]) => { if (a >= 0 && a < rows && b >= 0 && b < cols && !set.has(at(a, b))) fr.push(at(a, b)); }); });
      if (!fr.length) break;
      set.add(pick(rng, fr));
    }
    return Array.from(set).sort((a, b) => a - b);
  }
  function canonShape(cells) {           /* 8가지 회전·뒤집기 중 사전순 최소 표기 — 모양이 같은지 */
    let best = null;
    for (let m = 0; m < 8; m++) {
      let pts = cells.map(([r, c]) => { let x = c, y = r; if (m & 1) x = -x; if (m & 2) y = -y; if (m & 4) { const t = x; x = y; y = t; } return [y, x]; });
      const mr = Math.min.apply(null, pts.map(p => p[0])), mc = Math.min.apply(null, pts.map(p => p[1]));
      const key = pts.map(([r, c]) => (r - mr) + ',' + (c - mc)).sort().join('|');
      if (best === null || key < best) best = key;
    }
    return best;
  }

  /* ── 원 위의 현으로 나뉘는 조각 수(위젯과 같은 규칙: 새 현은 안쪽 교점 수 + 1 만큼 늘린다) ── */
  const NODE12 = Array.from({ length: 12 }, (_, i) => { const t = (i * 30 - 90) * Math.PI / 180; return [Math.cos(t), Math.sin(t)]; });
  function chordCross(a, b) {            /* 두 현의 안쪽 교점(없으면 null) */
    const [p, q] = a, [r, s] = b;
    if (p === r || p === s || q === r || q === s) return null;
    const inb = x => (x > Math.min(p, q) && x < Math.max(p, q));
    if (inb(r) === inb(s)) return null;
    const A = NODE12[p], B = NODE12[q], C = NODE12[r], D = NODE12[s];
    const d = (B[0] - A[0]) * (D[1] - C[1]) - (B[1] - A[1]) * (D[0] - C[0]);
    const t = ((C[0] - A[0]) * (D[1] - C[1]) - (C[1] - A[1]) * (D[0] - C[0])) / d;
    return [Math.round((A[0] + t * (B[0] - A[0])) * 1e6) / 1e6, Math.round((A[1] + t * (B[1] - A[1])) * 1e6) / 1e6];
  }
  function pieces(chords) {
    let n = 1;
    chords.forEach((ch, i) => {
      const pts = new Set();
      for (let j = 0; j < i; j++) { const x = chordCross(ch, chords[j]); if (x) pts.add(x.join(',')); }
      n += 1 + pts.size;
    });
    return n;
  }
  function concurrent(chords) {          /* 세 현 이상이 한 점에서 만나면 true — 그림이 헷갈린다 */
    const cnt = {};
    for (let i = 0; i < chords.length; i++) for (let j = i + 1; j < chords.length; j++) { const x = chordCross(chords[i], chords[j]); if (x) { const k = x.join(','); cnt[k] = (cnt[k] || 0) + 1; } }
    return Object.keys(cnt).some(k => cnt[k] > 1);
  }

  /* ── 쌓기나무: 완전히 가려진 블록 수(표본점으로 판정 — 위젯 그림 NM_G13.isoSvg 와 같은 투영) ── */
  function hiddenCubes(H) {
    const cubes = [];
    for (let r = 0; r < H.length; r++) for (let c = 0; c < H[r].length; c++) for (let z = 0; z < H[r][c]; z++) cubes.push({ r, c, z });
    cubes.sort((a, b) => (a.r + a.c + a.z) - (b.r + b.c + b.z) || a.z - b.z || a.r - b.r);
    const pj = (gx, gy, gz) => [(gx - gy), (gx + gy) / 2 - gz];
    const faces = [];
    cubes.forEach((q, id) => {
      const T = k => pj(q.c + k[0], q.r + k[1], q.z + k[2]);
      faces.push({ id, pts: [T([0, 1, 1]), T([1, 1, 1]), T([1, 1, 0]), T([0, 1, 0])] });
      faces.push({ id, pts: [T([1, 1, 1]), T([1, 0, 1]), T([1, 0, 0]), T([1, 1, 0])] });
      faces.push({ id, pts: [T([0, 0, 1]), T([1, 0, 1]), T([1, 1, 1]), T([0, 1, 1])] });
    });
    const inside = (pts, x, y) => { let sg = 0; for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length];
      const cr = (b[0] - a[0]) * (y - a[1]) - (b[1] - a[1]) * (x - a[0]); if (Math.abs(cr) < 1e-12) continue; const s = cr > 0 ? 1 : -1; if (sg && s !== sg) return false; sg = s; } return true; };
    const seen = new Set();
    faces.forEach(f => {
      const cx = f.pts.reduce((s, p) => s + p[0], 0) / 4, cy = f.pts.reduce((s, p) => s + p[1], 0) / 4;
      [[cx, cy]].concat(f.pts.map(p => [cx + .55 * (p[0] - cx), cy + .55 * (p[1] - cy)])).forEach(([px, py]) => {
        const x = px + 0.0137, y = py + 0.0071;
        let top = -1; for (let i = 0; i < faces.length; i++) if (inside(faces[i].pts, x, y)) top = faces[i].id;
        if (top >= 0) seen.add(top);
      });
    });
    return cubes.length - seen.size;
  }
  function randomHeights(rng, rows, cols, total, maxH) {
    const H = []; for (let r = 0; r < rows; r++) { H.push([]); for (let c = 0; c < cols; c++) H[r].push(0); }
    let s = 0, g = 0;
    while (s < total && g++ < 300) { const r = R(rng, 0, rows - 1), c = R(rng, 0, cols - 1); if (H[r][c] < maxH) { H[r][c]++; s++; } }
    return H;
  }
  function makeBlocks(rng, lv, maxHidden) {
    const rows = lv === 'practice' ? R(rng, 1, 2) : 3, cols = lv === 'practice' ? R(rng, 2, 3) : 3;
    for (let t = 0; t < 400; t++) {
      const want = lv === 'practice' ? R(rng, 3, 5) : R(rng, 6, 9);
      const H = randomHeights(rng, rows, cols, want, lv === 'practice' ? 2 : 3);
      const total = [].concat.apply([], H).reduce((a, b) => a + b, 0);
      if (total < (lv === 'practice' ? 3 : 6)) continue;
      const used = [].concat.apply([], H).filter(v => v > 0).length;
      if (used < (lv === 'practice' ? 2 : 4)) continue;
      if (hiddenCubes(H) <= maxHidden) return { H, total };
    }
    return { H: [[2, 1], [1, 0]], total: 4 };
  }

  /* ── 점 잇기 도형(0~100 뷰박스, 전부 원본 윤곽 — 닫힌 도형, 교차 없음, 점 ≤ 9) ── */
  const DOT_SHAPES = [
    { name: L3('집', 'house', '房子'), pts: [[15,88],[15,45],[50,12],[85,45],[85,88]] },
    { name: L3('로켓', 'rocket', '火箭'), pts: [[50,8],[68,32],[68,72],[50,92],[32,72],[32,32]] },
    { name: L3('물고기', 'fish', '鱼'), pts: [[10,50],[35,26],[70,30],[90,50],[70,70],[35,74]] },
    { name: L3('왕관', 'crown', '王冠'), pts: [[12,72],[20,28],[42,52],[58,20],[76,52],[90,28],[86,82],[18,82]] },
    { name: L3('배', 'boat', '小船'), pts: [[12,58],[88,58],[72,82],[30,82],[18,68]] },
    { name: L3('연', 'kite', '风筝'), pts: [[50,8],[84,46],[50,80],[16,46]] },
    { name: L3('고깔모자', 'party hat', '尖顶帽'), pts: [[50,10],[84,84],[16,84]] },
    { name: L3('봉투', 'envelope', '信封'), pts: [[12,25],[88,25],[88,78],[12,78],[50,48]] },
    { name: L3('고양이 얼굴', 'cat face', '猫脸'), pts: [[18,32],[18,10],[38,24],[62,24],[82,10],[82,58],[68,82],[32,82],[18,58]] },
    { name: L3('버섯', 'mushroom', '蘑菇'), pts: [[14,52],[24,26],[50,12],[76,26],[86,52],[64,52],[66,88],[34,88],[36,52]] },
    { name: L3('우산', 'umbrella', '雨伞'), pts: [[10,52],[24,28],[50,16],[76,28],[90,52],[70,48],[50,56],[30,48]] },
    { name: L3('연필', 'pencil', '铅笔'), pts: [[12,70],[58,24],[80,24],[88,32],[88,46],[42,92],[16,88]] },
    { name: L3('작은 새', 'bird', '小鸟'), pts: [[12,56],[34,34],[52,50],[72,28],[88,52],[68,72],[38,76]] },
    { name: L3('화분', 'flowerpot', '花盆'), pts: [[30,52],[18,34],[34,18],[50,36],[66,18],[82,34],[70,52],[76,88],[24,88]] },
    { name: L3('자동차', 'car', '小汽车'), pts: [[8,64],[8,50],[24,48],[34,32],[64,32],[78,48],[92,50],[92,64]] },
    { name: L3('햄스터', 'hamster', '仓鼠'), pts: [[14,56],[22,36],[40,26],[44,12],[56,20],[74,28],[88,46],[80,74],[30,76]] },
    { name: L3('토끼', 'rabbit', '兔子'), pts: [[30,92],[22,62],[34,46],[30,14],[44,10],[50,40],[62,48],[78,62],[74,92]] },
    { name: L3('다람쥐', 'squirrel', '松鼠'), pts: [[20,90],[14,60],[24,34],[40,22],[56,34],[60,56],[78,44],[88,66],[70,90]] }
  ];

  /* ═══════════════ N-01 ═══════════════ */
  const N1 = {};

  N1.family = function (lv, rng) {
    const fam = FAM[pick(rng, Object.keys(FAM))];
    const pool = shuffle(rng, fam.items.slice());
    const tgt = pool[0], unit = tgt[4] || fam.unit;
    const nT = R(rng, 2, lv === 'practice' ? 5 : 9);
    const kinds = lv === 'practice' ? R(rng, 1, 2) : R(rng, 2, Math.min(3, pool.length - 1));
    const others = pool.slice(1, 1 + kinds);
    const nO = lv === 'practice' ? R(rng, 2, 3) : R(rng, 3, Math.min(7, 15 - nT));
    const items = []; for (let i = 0; i < nT; i++) items.push({ e: tgt[0], t: true });
    for (let i = 0; i < nO; i++) items.push({ e: others[i % others.length][0], t: false });
    const ko = tgt[1], en = tgt[2], zh = tgt[3];
    return done({
      prompt: L3(`${josa(ko, '은', '는')} 모두 몇 ${unit.ko}일까요? ${ko}만 톡톡 세어 보세요`,
        `How many ${en}? Tap and count only the ${en}`, `一共有几${unit.zh}${zh}？只点${zh}数一数`),
      answer: nT, widget: 'g13Count', ask: 'count', layout: 'scatter', emoji: tgt[0], unit,
      items: dress(rng, shuffle(rng, items)), choices: choicesOf(rng, nT, 3, 1, 9)
    }, L3(`${josa(ko, '은', '는')} 모두 몇 ${unit.ko}일까요? ${ko}만 세어 보세요`, `How many ${en}? Count only the ${en}`, `一共有几${unit.zh}${zh}？只数${zh}`),
      ['items', 'choices', 'ask']);
  };

  N1.shapes = function (lv, rng) {
    const sub = pick(rng, ['count', 'count', 'kinds', 'labeled']);
    const order = shuffle(rng, SHAPES.slice());
    if (sub === 'kinds') {
      const k = R(rng, 1, 3), used = order.slice(0, k), n = R(rng, Math.max(5, k + 2), 11);
      const items = []; for (let i = 0; i < n; i++) items.push({ e: used[i < k ? i : R(rng, 0, k - 1)][0], t: false });
      return done({
        prompt: L3('그림에 모양이 모두 몇 가지 있을까요?', 'How many different shapes are there?', '图里一共有几种形状？'),
        answer: k, widget: 'g13Count', ask: 'kinds', layout: 'scatter', emoji: used[0][0], unit: L3('가지', '', '种'),
        items: dress(rng, shuffle(rng, items)), choices: [1, 2, 3]
      }, null, ['items', 'ask']);
    }
    const labeled = sub === 'labeled';
    const tgt = order[0], nT = R(rng, 1, lv === 'practice' ? 4 : 6);
    const cap = labeled ? 9 : 12;
    const nO = R(rng, Math.max(3, 5 - nT), Math.min(cap - nT, 7));
    const items = []; for (let i = 0; i < nT; i++) items.push({ e: tgt[0], t: true });
    for (let i = 0; i < nO; i++) items.push({ e: order[1 + (i % 2)][0], t: false });
    const sh = shuffle(rng, items);
    const lead = labeled ? L3('번호 줄에서 ', 'In the numbered row, ', '编号这一行里') : L3('', '', '');
    return done({
      prompt: L3(`${lead.ko}${tgt[1]} 모양은 모두 몇 개일까요? ${tgt[1]}만 톡톡 세어 보세요`,
        `${lead.en}How many ${tgt[2]}? Tap and count only the ${tgt[2]}`, `${lead.zh}${tgt[3]}一共有几个？只点${tgt[3]}数一数`),
      answer: nT, widget: 'g13Count', ask: 'count', layout: labeled ? 'labeled' : 'scatter', emoji: tgt[0], unit: U_GAE,
      items: labeled ? plain(sh).map((it, i) => Object.assign(it, { label: i + 1 })) : dress(rng, sh), choices: choicesOf(rng, nT, 3, 1, 9)
    }, L3(`${lead.ko}${tgt[1]} 모양은 모두 몇 개일까요? ${tgt[1]}만 세어 보세요`, `${lead.en}How many ${tgt[2]}? Count only the ${tgt[2]}`, `${lead.zh}${tgt[3]}一共有几个？只数${tgt[3]}`),
      ['items', 'choices', 'ask', 'layout']);
  };

  N1.table = function (lv, rng) {
    const order = shuffle(rng, WEATHER.slice()), tgt = order[0];
    const nT = R(rng, 2, lv === 'practice' ? 5 : 9), rest = 14 - nT;
    const a = R(rng, 1, rest - 1);
    const items = []; for (let i = 0; i < nT; i++) items.push({ e: tgt[0], t: true });
    for (let i = 0; i < a; i++) items.push({ e: order[1][0], t: false });
    for (let i = 0; i < rest - a; i++) items.push({ e: order[2][0], t: false });
    return done({
      prompt: L3(`${josa(tgt[1], '은', '는')} 모두 며칠일까요? ${tgt[1]}만 톡톡 세어 보세요`,
        `How many ${tgt[2]} are there? Tap and count only the ${tgt[2]}`, `一共有几天是${tgt[3]}？只点${tgt[3]}数一数`),
      answer: nT, widget: 'g13Count', ask: 'count', layout: 'grid', cols: 7, headers: DAYS, emoji: tgt[0], unit: L3('일', '', '天'),
      items: plain(shuffle(rng, items)), choices: choicesOf(rng, nT, 3, 1, 9)
    }, L3(`${josa(tgt[1], '은', '는')} 모두 며칠일까요? ${tgt[1]}만 세어 보세요`, `How many ${tgt[2]} are there? Count only the ${tgt[2]}`, `一共有几天是${tgt[3]}？只数${tgt[3]}`),
      ['items', 'choices', 'layout']);
  };

  N1.grid = function (lv, rng) {
    if (R(rng, 0, 1) === 0) {                              /* read — 칠해진 네모 개수 */
      const rows = lv === 'practice' ? R(rng, 3, 4) : 5, cols = rows, n = lv === 'practice' ? R(rng, 3, 6) : R(rng, 4, 9);
      const cells = polyomino(rng, rows, cols, n);
      return done({
        prompt: L3('색칠된 네모는 모두 몇 개일까요?', 'How many squares are colored?', '涂了颜色的方格一共有几个？'),
        answer: cells.length, widget: 'g13Grid', gmode: 'read', rows, cols, cells, choices: choicesOf(rng, cells.length, 3, 1, 9)
      }, null, ['rows', 'cols', 'cells', 'choices']);
    }
    const rows = lv === 'practice' ? 3 : R(rng, 3, 5), cols = rows === 3 ? 3 : R(rng, 3, 5);
    const n = R(rng, 3, Math.min(9, rows * cols - 1)), form = pick(rng, ['digit', 'native']);
    const w = ['ko', 'en', 'zh'].map(l => form === 'digit' ? String(n) : NATIVE[l][n]);
    return done({
      prompt: L3(`칸을 ${w[0]}만큼 칠해요. 칸을 톡톡 눌러요`, `Color ${w[1]} boxes. Tap the boxes`, `涂${w[2]}个方格，点一点格子`),
      answer: n, widget: 'g13Grid', gmode: 'paint', rows, cols, target: n
    }, L3(`칸을 ${w[0]}만큼 칠해요`, `Color ${w[1]} boxes`, `涂${w[2]}个方格`), ['rows', 'cols', 'target', 'prompt']);
  };

  N1.rowpaint = function (lv, rng) {
    const n = R(rng, 2, 9), form = pick(rng, ['digit', 'native', 'sino']);
    const thing = pick(rng, [['🎈', '풍선을', 'balloons', '气球'], ['kite', '연을', 'kites', '风筝']]);
    const ko = form === 'sino' ? SINO_KO[n] : form === 'native' ? NATIVE.ko[n] : String(n);
    const en = form === 'digit' ? String(n) : NATIVE.en[n], zh = form === 'digit' ? String(n) : NATIVE.zh[n];
    const sep = form === 'sino' ? ' ' : '';
    return done({
      prompt: L3(`${thing[1]} ${ko}${sep}만큼 칠해요. 칸을 톡톡 눌러요`, `Color ${en} ${thing[2]}. Tap the boxes`, `给${zh}个${thing[3]}涂色，点一点格子`),
      answer: n, widget: 'g13Grid', gmode: 'paint', rows: 1, cols: 10, target: n, emoji: thing[0], form
    }, L3(`${thing[1]} ${ko}${sep}만큼 칠해요`, `Color ${en} ${thing[2]}`, `给${zh}个${thing[3]}涂色`), ['target', 'emoji', 'form', 'prompt']);
  };

  N1.rep = function (lv, rng) {
    const N = lv === 'practice' ? 3 : 4;
    const max = lv === 'practice' ? 5 : 9;
    const nums = shuffle(rng, Array.from({ length: max }, (_, i) => i + 1)).slice(0, N).sort((a, b) => a - b);
    const rts = lv === 'practice' ? ['dice', 'frame', 'fingers'] : ['frame', 'fingers', 'native', 'sino', 'native'];
    let rightType = pick(rng, rts), leftType = 'num';
    if (lv !== 'practice' && R(rng, 1, 5) === 1) { leftType = 'native'; rightType = 'sino'; }
    if (rightType === 'fingers' && Math.max.apply(null, nums) > 9) rightType = 'frame';
    const left = shuffle(rng, nums), right = shuffle(rng, nums);
    return done({
      prompt: L3('같은 수끼리 이어요. 왼쪽 카드를 누르고, 짝꿍 카드를 눌러요', 'Match the same numbers. Tap a card on the left, then its partner', '把相同的数连起来：先点左边的卡片，再点它的好朋友'),
      answer: N, widget: 'g13Rep', left, right, leftType, rightType
    }, L3('같은 수끼리 선으로 이어요', 'Draw lines to match the same numbers', '用线把相同的数连起来'), ['left', 'right', 'leftType', 'rightType']);
  };

  N1.repFill = function (lv, rng) {
    const n = R(rng, 1, lv === 'practice' ? 5 : 9);
    const blank = pick(rng, lv === 'practice' ? ['num', 'frame', 'native'] : ['num', 'sino', 'native', 'frame']);
    const shown = ['num', 'sino', 'native', 'frame'].filter(k => k !== blank);
    return done({
      prompt: L3('표의 빈칸에 알맞은 카드를 골라요', 'Pick the card that fits the empty box', '选出适合空格的卡片'),
      answer: n, widget: 'g13RepFill', n, shown, blank, choices: choicesOf(rng, n, 3, 1, lv === 'practice' ? 5 : 9)
    }, L3('표의 빈칸에 알맞은 것에 ○표 해요', 'Circle the one that fits the empty box', '在适合空格的选项上画○'), ['n', 'blank', 'choices']);
  };

  N1.cut = function (lv, rng) {
    if (R(rng, 0, 1) === 0) {                              /* read */
      for (let t = 0; t < 300; t++) {
        const k = R(rng, 1, lv === 'practice' ? 2 : 3), ch = [], used = new Set();
        let ok = true;
        for (let i = 0; i < k; i++) {
          let a, b, g = 0; do { a = R(rng, 0, 11); b = R(rng, 0, 11); g++; } while ((a === b || Math.abs(a - b) < 3 || Math.abs(a - b) > 9 || used.has(a) || used.has(b)) && g < 60);
          if (g >= 60) { ok = false; break; }
          used.add(a); used.add(b); ch.push([Math.min(a, b), Math.max(a, b)]);
        }
        if (!ok || concurrent(ch)) continue;
        const pc = pieces(ch);
        if (pc < 2 || pc > 7) continue;
        return done({
          prompt: L3('동그라미가 선으로 나뉘었어요. 모두 몇 조각일까요?', 'The circle is cut by lines. How many pieces are there?', '圆被线分开了，一共有几块？'),
          answer: pc, widget: 'g13CircleCut', cmode: 'read', chords: ch, choices: choicesOf(rng, pc, 3, 1, 9)
        }, L3('동그라미가 선으로 나뉘었어요. 모두 몇 조각일까요?', 'The circle is cut by lines. How many pieces?', '圆被线分开了，一共有几块？'), ['chords', 'choices']);
      }
    }
    const T = lv === 'practice' ? R(rng, 3, 5) : R(rng, 4, 7);
    for (let t = 0; t < 3000; t++) {
      const k = R(rng, 2, 4), ch = [], used = new Set();
      for (let i = 0; i < k; i++) { const a = R(rng, 0, 11), b = R(rng, 0, 11); if (a === b || Math.abs(a - b) < 2) { i--; if (t > 2900) break; continue; } const c = [Math.min(a, b), Math.max(a, b)]; if (used.has(c.join())) { i--; continue; } used.add(c.join()); ch.push(c); }
      if (ch.length === k && pieces(ch) === T) {
        return done({
          prompt: L3(`선을 그어 동그라미를 ${T}조각으로 나눠요`, `Draw lines to cut the circle into ${T} pieces`, `画线把圆分成${T}块`),
          answer: T, widget: 'g13CircleCut', cmode: 'draw', target: T, maxChords: 4, sample: ch
        }, L3(`연필로 선을 그어 동그라미를 ${T}조각으로 나눠요`, `Draw lines with a pencil to cut the circle into ${T} pieces`, `用铅笔画线把圆分成${T}块`), ['target', 'cmode']);
      }
    }
    return done({ prompt: L3('선을 그어 동그라미를 4조각으로 나눠요', 'Draw lines to cut the circle into 4 pieces', '画线把圆分成4块'),
      answer: 4, widget: 'g13CircleCut', cmode: 'draw', target: 4, maxChords: 4, sample: [[0, 6], [3, 9]] }, null, ['target', 'cmode']);
  };

  /* 점판 — 자기회피 걷기 */
  function walk(rng, cols, rows, len) {
    for (let t = 0; t < 200; t++) {
      const path = [[R(rng, 0, cols - 1), R(rng, 0, rows - 1)]];
      const has = (c, r) => path.some(p => p[0] === c && p[1] === r);
      while (path.length <= len) {
        const [c, r] = path[path.length - 1];
        const nb = [[c + 1, r], [c - 1, r], [c, r + 1], [c, r - 1]].filter(([a, b]) => a >= 0 && a < cols && b >= 0 && b < rows && !has(a, b));
        if (!nb.length) break;
        path.push(pick(rng, nb));
      }
      if (path.length === len + 1) return path;
    }
    return null;
  }
  N1.length = function (lv, rng) {
    const cols = 4, rows = 4;
    const L = lv === 'practice' ? R(rng, 2, 5) : R(rng, 5, 9);
    const path = walk(rng, cols, rows, L) || [[0, 0], [1, 0], [2, 0]];
    const len = path.length - 1;
    if (R(rng, 0, 1) === 0) {
      return done({
        prompt: L3('점과 점 사이를 1이라 할 때, 선의 길이는 얼마일까요?', 'If each gap between dots is 1, how long is the line?', '点与点之间为1，这条线有多长？'),
        answer: len, widget: 'g13DotLength', lmode: 'read', cols, rows, path, choices: choicesOf(rng, len, 3, 1, 12)
      }, null, ['path', 'choices']);
    }
    return done({
      prompt: L3(`점과 점 사이를 1이라 할 때, 길이가 ${len}인 선을 그어요. 점을 차례로 눌러요`, `If each gap is 1, draw a line of length ${len}. Tap the dots in order`, `点与点之间为1，画一条长${len}的线，依次点一点`),
      answer: len, widget: 'g13DotLength', lmode: 'draw', cols, rows, target: len, sample: path
    }, L3(`점과 점 사이를 1이라 할 때, 길이가 ${len}인 선을 점을 이어 그어요`, `If each gap is 1, connect dots to draw a line of length ${len}`, `点与点之间为1，连点画一条长${len}的线`), ['target', 'lmode']);
  };

  N1.blocks = function (lv, rng) {
    const maxHidden = lv === 'practice' ? 0 : (R(rng, 0, 2) === 0 ? 1 : 0);
    const { H, total } = makeBlocks(rng, lv, maxHidden);
    return done({
      prompt: L3('쌓기나무는 모두 몇 개일까요?', 'How many blocks are there?', '一共有几块积木？'),
      answer: total, widget: 'g13Blocks', bmode: 'read', heights: H, choices: choicesOf(rng, total, 3, 1, 12), hidden: maxHidden
    }, null, ['heights', 'choices']);
  };

  N1.odd = function (lv, rng) {
    for (let t = 0; t < 400; t++) {
      const k = R(rng, lv === 'practice' ? 3 : 4, lv === 'practice' ? 5 : 7), odd = pick(rng, [k - 1, k + 1]);
      if (odd < 2) continue;
      const mk = n => polyomino(rng, 3, 3, n).map(i => [Math.floor(i / 3), i % 3]);
      const sizes = [k, k, k, odd], shapes = sizes.map(mk);
      if (shapes.some((s, i) => s.length !== sizes[i])) continue;
      if (new Set(shapes.map(canonShape)).size < 4) continue;
      const order = shuffle(rng, [0, 1, 2, 3]);
      const sh = order.map(i => shapes[i]), ans = order.indexOf(3) + 1;
      return done({
        prompt: L3('칸 수가 다른 하나를 골라요', 'Pick the one with a different number of squares', '选出方格数不同的那一个'),
        answer: ans, widget: 'g13Odd', shapes: sh
      }, L3('칸 수가 다른 하나에 ○표 해요', 'Circle the one with a different number of squares', '在方格数不同的那一个上画○'), ['shapes']);
    }
    return null;
  };

  N1.turn = function (lv, rng) {
    const MAP = { 0: 0, 6: 9, 8: 8, 9: 6 };
    const d = pick(rng, [0, 6, 8, 9]), ans = MAP[d];
    const pool = [0, 6, 8, 9, 1, 2, 3, 4, 5, 7].filter(x => x !== ans);
    const ch = shuffle(rng, [ans].concat(shuffle(rng, pool).slice(0, 2)));
    return done({
      prompt: L3('카드를 거꾸로 뒤집으면(180도 돌리면) 어떤 숫자로 보일까요?', 'Turn the card upside down (180 degrees). Which digit does it look like?', '把卡片倒过来（转180度），看起来是哪个数字？'),
      answer: ans, widget: 'g13Turn', digit: d, choices: ch
    }, L3('카드를 거꾸로 돌리면 어떤 숫자로 보일까요?', 'Turn the card upside down. Which digit does it look like?', '把卡片倒过来，看起来是哪个数字？'), ['digit', 'choices']);
  };

  const N1_PRACTICE = ['family', 'shapes', 'rep', 'repFill', 'rowpaint'];
  NM_TGEN['g13_n1'] = function (params, rng) {
    const lv = (params && params.level) || 'main';
    const modes = (params && params.modes) || [(params && params.mode) || 'family'];
    const mode = modes.length > 1 ? pick(rng, modes) : modes[0];
    if (mode === 'count' || mode === 'make') return ORIG.nl1_count(Object.assign({}, params, { mode, level: lv, g13: null }), rng);
    const fn = N1[mode] || N1.family;
    for (let t = 0; t < 20; t++) { const p = fn(lv, rng); if (p) return p; }
    return N1.family(lv, rng);
  };
  void N1_PRACTICE;

  /* ═══════════════ N-02 ═══════════════ */
  const N2 = {};

  N2.dots = function (lv, rng) {
    const max = 9, pool = DOT_SHAPES.filter(s => s.pts.length <= max && (lv !== 'practice' || s.pts.length <= 7));
    const shape = pick(rng, pool), n = shape.pts.length;
    let order = 'up';
    if (lv !== 'practice') order = R(rng, 0, 1) ? 'down' : 'up';
    return dotsProblem(rng, shape, order, lv === 'practice' ? R(rng, 0, 2) : 0);
  };
  function dotsProblem(rng, shape, order, pre) {
    const n = shape.pts.length; pre = Math.min(pre || 0, n - 2);
    const labels = shape.pts.map((_, i) => order === 'down' ? n - i : i + 1);
    const nm = shape.name;
    return done({
      prompt: order === 'down'
        ? L3(`가장 큰 수부터 거꾸로 점을 이어 ${nm.ko}을(를) 완성해요!`, `Connect the dots from the biggest number backward to finish the ${nm.en}!`, `从最大的数开始倒着连点，画出${nm.zh}！`)
        : L3(`1부터 차례대로 점을 이어 ${nm.ko}을(를) 완성해요!`, `Connect the dots from 1 in order to finish the ${nm.en}!`, `从1开始按顺序连点，画出${nm.zh}！`),
      answer: n, widget: 'g13Dots', pts: shape.pts, close: true, order, labels, pre: pre || 0
    }, L3(order === 'down' ? `가장 큰 수부터 점을 이어 ${nm.ko}을(를) 완성해요. 점은 모두 몇 개일까요?` : `1부터 차례대로 점을 이어 ${nm.ko}을(를) 완성해요. 점은 모두 몇 개일까요?`,
      order === 'down' ? `Connect the dots from the biggest number to finish the ${nm.en}. How many dots are there?` : `Connect the dots from 1 in order to finish the ${nm.en}. How many dots are there?`,
      order === 'down' ? `从最大的数开始连点，画出${nm.zh}。一共有几个点？` : `从1开始按顺序连点，画出${nm.zh}。一共有几个点？`),
      ['pts', 'order', 'pre']);
  }

  const REPEATS = [[1, 2, 3, 4], [9, 8, 7, 6], [1, 2, 3], [3, 2, 1], [3, 2, 1, 3]];
  N2.repeat = function (lv, rng) {
    if (R(rng, 0, 3) === 0) {                              /* 교차 수열 1 9 2 9 3 9 … */
      const a = R(rng, 1, 4), seq = [];
      let c; do { c = R(rng, 1, 9); } while (c >= a && c <= a + 4);
      for (let i = 0; i < 9; i++) seq.push(i % 2 === 0 ? a + i / 2 : c);
      const blank = pick(rng, [6, 8]), ans = seq[blank];
      if (ans === c) return N2.repeat(lv, rng);
      const s2 = seq.slice(); s2[blank] = null;
      return done({
        prompt: L3('규칙을 찾아 빈 칸에 올 수를 골라요', 'Find the pattern! Pick the number for the blank', '找规律！选出空格里的数'),
        answer: ans, widget: 'g13Seq', seq: s2, blank, kind: 'inter', choices: shuffle(rng, [ans, c, ans + 1 <= 9 ? ans + 1 : ans - 1])
      }, null, ['seq', 'blank', 'choices']);
    }
    const pat = pick(rng, REPEATS), len = R(rng, 8, 9), seq = [];
    for (let i = 0; i < len; i++) seq.push(pat[i % pat.length]);
    const blank = R(rng, pat.length, len - 1), ans = seq[blank];
    let vals = Array.from(new Set(pat)).filter(v => v !== ans);
    vals = shuffle(rng, vals).slice(0, 2);
    for (let v = 1; vals.length < 2 && v <= 9; v++) if (v !== ans && !vals.includes(v)) vals.push(v);
    const s2 = seq.slice(); s2[blank] = null;
    return done({
      prompt: L3('규칙을 찾아 빈 칸에 올 수를 골라요', 'Find the pattern! Pick the number for the blank', '找规律！选出空格里的数'),
      answer: ans, widget: 'g13Seq', seq: s2, blank, kind: 'repeat', choices: shuffle(rng, [ans].concat(vals))
    }, null, ['seq', 'blank', 'choices']);
  };
  N2.between = function (lv, rng) {
    const a = R(rng, 1, 7), down = R(rng, 0, 1) === 1, mid = a + 1;
    const seq = down ? [a + 2, null, a] : [a, null, a + 2];
    return done({
      prompt: L3('두 수 사이에 있는 수를 골라요', 'Pick the number between the two numbers', '选出两个数中间的数'),
      answer: mid, widget: 'g13Seq', seq, blank: 1, kind: 'between', choices: choicesOf(rng, mid, 3, 1, 9)
    }, null, ['seq', 'choices']);
  };

  /* 길 채우기 — 배치 템플릿 */
  const LAYOUTS = {
    row: m => ({ vw: 100, vh: 40, pos: Array.from({ length: m }, (_, i) => [12 + i * (76 / (m - 1)), 20]), shape: 'circle' }),
    zig: m => ({ vw: 100, vh: 56, pos: Array.from({ length: m }, (_, i) => [10 + i * (80 / (m - 1)), i % 2 === 0 ? 38 : 16]), shape: 'circle' }),
    snake: m => {
      const pos = []; for (let i = 0; i < m; i++) { const row = Math.floor(i / 3), col = i % 3; pos.push([20 + (row % 2 === 0 ? col : 2 - col) * 30, 14 + row * 26]); }
      return { vw: 100, vh: 14 + Math.ceil(m / 3) * 26, pos, shape: 'circle' };
    },
    ring: m => ({ vw: 100, vh: 56, pos: Array.from({ length: m }, (_, i) => { const th = (200 - i * 220 / (m - 1)) * Math.PI / 180; return [50 + 36 * Math.cos(th), 34 - 24 * Math.sin(th)]; }), shape: 'circle' }),
    grid: m => {
      const pos = []; for (let i = 0; i < m; i++) { const row = Math.floor(i / 3), col = i % 3; pos.push([22 + (row % 2 === 0 ? col : 2 - col) * 28, 14 + row * 28]); }
      return { vw: 100, vh: 8 + Math.ceil(m / 3) * 28, pos, shape: 'box' };
    }
  };
  N2.path = function (lv, rng) {
    const kinds = lv === 'practice' ? ['row', 'zig'] : ['zig', 'snake', 'ring', 'ring', 'grid', 'row'];
    const layout = pick(rng, kinds);
    return pathProblem(rng, lv, layout);
  };
  function pathProblem(rng, lv, layout, force) {
    force = force || {};
    const practice = lv === 'practice';
    let m, rule = 'step', pat = null;
    if (layout === 'grid') { rule = 'pattern'; pat = pick(rng, [[1, 2, 3], [1, 2, 3, 4], [3, 2, 1, 3], [2, 1, 3]]); m = 9; }
    else m = layout === 'row' ? R(rng, 4, 5) : layout === 'zig' ? R(rng, 5, 6) : layout === 'snake' ? R(rng, 6, 7) : R(rng, 4, 6);
    if (force.step === 2 && (m - 1) * 2 > 8) m = 5;
    const lay = LAYOUTS[layout](m);
    let vals = [], edges = [], legend = null, styleSet = null;
    if (rule === 'pattern') {
      for (let i = 0; i < m; i++) vals.push(pat[i % pat.length]);
      legend = L3(`${pat.join(', ')}이(가) 차례대로 반복돼요`, `${pat.join(', ')} repeat in order`, `${pat.join('、')}依次重复`);
    } else {
      const down = !practice && R(rng, 0, 9) < 4;                           /* 큰 수부터 */
      const mixed = !practice && (layout === 'ring' || layout === 'snake' || layout === 'zig') && R(rng, 0, 2) > 0;
      styleSet = mixed ? pick(rng, ['arrows', 'lines']) : 'arrows';
      const deltas = []; for (let i = 0; i < m - 1; i++) deltas.push(mixed ? pick(rng, [1, 2]) : (force.step || 1));
      if (!mixed && !practice && R(rng, 0, 2) === 0 && !force.step && (m - 1) * 2 <= 8) deltas.fill(2);
      if (mixed) for (let i = 0; i < deltas.length; i++) if (deltas[i] === 2 && deltas.reduce((a, b) => a + b, 0) > 8) deltas[i] = 1;
      const span = deltas.reduce((a, b) => a + b, 0);
      const lo = R(rng, 1, 9 - span);
      let v = down ? lo + span : lo; vals.push(v);
      for (let i = 0; i < m - 1; i++) { v += down ? -deltas[i] : deltas[i]; vals.push(v); }
      for (let i = 0; i < m - 1; i++) {
        const d = deltas[i], a = down ? i + 1 : i, b = down ? i : i + 1;            /* 화살표는 큰 수 쪽을 가리킨다 */
        edges.push({ a, b, style: styleSet === 'arrows' ? (d === 1 ? 'single' : 'double') : (d === 1 ? 'solid' : 'dashed') });
      }
      legend = styleSet === 'arrows'
        ? L3('화살표 끝이 더 큰 수예요. → 는 1 큰 수, ⇒ 는 2 큰 수', 'The arrow points to the bigger number. → is 1 more, ⇒ is 2 more', '箭头指向较大的数。→ 大1，⇒ 大2')
        : L3('화살표 끝이 더 큰 수예요. 실선은 1 큰 수, 점선은 2 큰 수', 'The arrow points to the bigger number. A solid line is 1 more, a dashed line is 2 more', '箭头指向较大的数。实线大1，虚线大2');
      if (!mixed) legend = L3(`화살표 끝이 더 큰 수예요. ${deltas[0] === 1 ? '1씩' : '2씩'} 커져요`, `The arrow points to the bigger number. It grows by ${deltas[0]} each step`, `箭头指向较大的数。每次大${deltas[0]}`);
      if (practice) legend = L3('화살표 끝이 더 큰 수예요', 'The arrow points to the bigger number', '箭头指向较大的数');
    }
    /* 빈칸 고르기 */
    const B = practice ? R(rng, 1, 2) : R(rng, 2, Math.min(4, m - 2));
    let idxs = Array.from({ length: m }, (_, i) => i);
    if (rule === 'pattern') idxs = idxs.filter(i => i >= pat.length);
    const blanks = shuffle(rng, idxs).slice(0, Math.min(B, idxs.length)).sort((a, b) => a - b);
    const nodes = vals.map((v, i) => ({ x: Math.round(lay.pos[i][0] * 10) / 10, y: Math.round(lay.pos[i][1] * 10) / 10, v, show: !blanks.includes(i), shape: lay.shape }));
    const bankVals = blanks.map(i => vals[i]);
    const extraV = shuffle(rng, [1, 2, 3, 4, 5, 6, 7, 8, 9].filter(x => !bankVals.includes(x))).slice(0, practice ? R(rng, 0, 1) : R(rng, 1, 2));
    const bank = shuffle(rng, bankVals.concat(extraV));
    const down = rule === 'step' && vals[0] > vals[1];
    const askTxt = rule === 'pattern' ? L3('규칙에 맞게 빈 칸을 채워요', 'Follow the rule and fill the blanks', '按规律填空')
      : down ? L3('큰 수부터 거꾸로 세어 빈 칸을 채워요', 'Count down from the big number and fill the blanks', '从大到小倒着数，填空')
      : L3('작은 수부터 차례로 세어 빈 칸을 채워요', 'Count up in order and fill the blanks', '从小到大按顺序数，填空');
    const prompt = L3(`${askTxt.ko}. 숫자 타일을 눌러 채워요`, `${askTxt.en}. Tap a number tile`, `${askTxt.zh}。点一点数字`);
    return done({
      prompt, answer: blanks.length, widget: 'g13Path', layout, rule, vw: lay.vw, vh: lay.vh, nodes, edges, bank, legend,
      printAsk: L3(`${askTxt.ko}. 빈 칸에 알맞은 수를 써요`, `${askTxt.en}. Write the number in each blank`, `${askTxt.zh}。在空格里写出合适的数`)
    }, null, ['nodes', 'edges', 'bank', 'layout']);
  }

  /* 수 표시 — 뛰어 센 수 색칠 / 가장 가까운 수 ○ · 가장 먼 수 × / 범위 / 최대·최소 */
  N2.skipPaint = function (lv, rng) {
    const step = lv === 'practice' ? 2 : pick(rng, [2, 2, 3]), s = R(rng, 1, step), set = [], tiles = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    tiles.forEach((v, i) => { if (v >= s && (v - s) % step === 0) set.push(i); });
    const pre = lv === 'practice' ? [set[0]] : [];
    const pr = L3(`${s}부터 ${step}씩 뛰어 센 수에 색칠해요`, `Color the numbers you reach counting by ${step} from ${s}`, `从${s}开始每次数${step}，给数到的数涂色`);
    return done({
      prompt: pr, answer: set.length, widget: 'g13NumPick', tiles, marks: [{ sym: 'color', set }], pre, printAsk: pr
    }, null, ['tiles', 'marks', 'pre', 'prompt']);
  };
  N2.nearMark = function (lv, rng) {
    for (let t = 0; t < 400; t++) {
      const b = R(rng, 2, 8), n = lv === 'practice' ? 4 : R(rng, 4, 5);
      const tiles = shuffle(rng, Array.from({ length: 9 }, (_, i) => i + 1).filter(v => v !== b)).slice(0, n);
      const d = tiles.map(v => Math.abs(v - b)), mn = Math.min.apply(null, d), mx = Math.max.apply(null, d);
      if (d.filter(x => x === mn).length !== 1 || d.filter(x => x === mx).length !== 1 || mn === mx) continue;
      const near = d.indexOf(mn), far = d.indexOf(mx);
      const marks = lv === 'practice' ? [{ sym: '○', set: [near] }] : [{ sym: '○', set: [near] }, { sym: '×', set: [far] }];
      const pr = lv === 'practice'
        ? L3(`${b}와 가장 가까운 수에 ○표 해요`, `Mark the number closest to ${b} with ○`, `在离${b}最近的数上画○`)
        : L3(`${b}와 가장 가까운 수에 ○, 가장 먼 수에 ×표 해요`, `Mark the number closest to ${b} with ○ and the farthest with ×`, `离${b}最近的数画○，最远的数画×`);
      return done({ prompt: pr, answer: marks.length, widget: 'g13NumPick', tiles, marks, base: b, printAsk: pr }, null, ['tiles', 'marks', 'base']);
    }
    return null;
  };

  N2.nearest = function (lv, rng) {
    for (let t = 0; t < 400; t++) {
      const [em, ko, en, zh] = pick(rng, THINGS), c = R(rng, 3, 9);
      const cand = shuffle(rng, Array.from({ length: 9 }, (_, i) => i + 1)).slice(0, 4);
      const hasC = cand.includes(c);
      if (lv === 'practice' ? !hasC && R(rng, 0, 1) : hasC) continue;
      const d = cand.map(v => Math.abs(v - c)), mn = Math.min.apply(null, d);
      if (d.filter(x => x === mn).length !== 1) continue;
      const ans = cand[d.indexOf(mn)];
      const items = []; for (let i = 0; i < c; i++) items.push({ e: em, t: true });
      return done({
        prompt: L3('개수를 세어 보고, 그 수에 가장 가까운 수를 골라요', 'Count them, then pick the number closest to the amount', '数一数，选出最接近这个数量的数'),
        answer: ans, widget: 'g13Count', ask: 'nearest', layout: 'scatter', emoji: em, unit: U_GAE, count: c,
        items: dress(rng, items), choices: cand
      }, L3('개수를 세어 보고, 그 수에 가장 가까운 수에 ○표 해요', 'Count them, then circle the number closest to the amount', '数一数，在最接近这个数量的数上画○'), ['items', 'choices', 'ask']);
    }
    return null;
  };

  N2.nearOrder = function (lv, rng) {
    for (let t = 0; t < 600; t++) {
      const N = lv === 'practice' ? 3 : R(rng, 4, 5), b = R(rng, 2, 8);
      const tiles = shuffle(rng, Array.from({ length: 9 }, (_, i) => i + 1).filter(v => v !== b)).slice(0, N);
      const d = tiles.map(v => Math.abs(v - b));
      if (new Set(d).size !== N) continue;
      if (!tiles.some(v => v < b) || !tiles.some(v => v > b)) continue;
      return done({
        prompt: L3(`기준 수 ${b}와 가까운 수부터 차례로 눌러요`, `Tap from the number closest to ${b} to the farthest`, `从离${b}最近的数开始依次点`),
        answer: N, widget: 'g13Order', otype: 'near', base: b, tiles, line: { min: 0, max: 9 },
        printAsk: L3(`기준 수 ${b}와 가까운 수부터 차례로 써요`, `Write the numbers from the closest to ${b} to the farthest`, `从离${b}最近的数开始依次写出`)
      }, null, ['tiles', 'base']);
    }
    return null;
  };

  /* 핀볼 — 막힌 칸을 피해 1 → L */
  function countSolutions(rows, cols, blocked, given, L, cap) {
    const key = (r, c) => r + ',' + c, numAt = {};
    Object.keys(given).forEach(k => { numAt[given[k]] = k; });
    const start = numAt[1]; if (!start) return 0;
    let n = 0; const seen = new Set([start]);
    const go = (r, c, k) => {
      if (n >= cap) return;
      if (k === L) { n++; return; }
      [[r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]].forEach(([a, b]) => {
        if (a < 0 || b < 0 || a >= rows || b >= cols) return;
        const kk = key(a, b);
        if (blocked.has(kk) || seen.has(kk)) return;
        const g = given[kk]; if (g != null && g !== k + 1) return;
        if (numAt[k + 1] && numAt[k + 1] !== kk) return;
        seen.add(kk); go(a, b, k + 1); seen.delete(kk);
      });
    };
    const [sr, sc] = start.split(',').map(Number); go(sr, sc, 1);
    return n;
  }
  N2.pinball = function (lv, rng) {
    for (let t = 0; t < 300; t++) {
      const rows = lv === 'practice' ? R(rng, 3, 4) : R(rng, 4, 5), cols = lv === 'practice' ? 3 : R(rng, 4, 5);
      const L = lv === 'practice' ? R(rng, 4, 5) : R(rng, 6, 9);
      const path = [[R(rng, 0, rows - 1), R(rng, 0, cols - 1)]];
      while (path.length < L) {
        const [r, c] = path[path.length - 1];
        const nb = [[r + 1, c], [r - 1, c], [r, c + 1], [r, c - 1]].filter(([a, b]) => a >= 0 && b >= 0 && a < rows && b < cols && !path.some(p => p[0] === a && p[1] === b));
        if (!nb.length) break; path.push(pick(rng, nb));
      }
      if (path.length < L) continue;
      const onPath = new Set(path.map(p => p.join(',')));
      const free = []; for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) if (!onPath.has(r + ',' + c)) free.push(r + ',' + c);
      const nb = Math.min(free.length, lv === 'practice' ? R(rng, 0, 1) : R(rng, 1, 3));
      const blocks = shuffle(rng, free).slice(0, nb);
      const given = {}; given[path[0].join(',')] = 1; given[path[L - 1].join(',')] = L;
      const extra = shuffle(rng, Array.from({ length: L - 2 }, (_, i) => i + 2)).slice(0, lv === 'practice' ? R(rng, 0, 1) : R(rng, 1, 3));
      extra.forEach(k => { given[path[k - 1].join(',')] = k; });
      const sol = countSolutions(rows, cols, new Set(blocks), given, L, 30);
      if (sol < 1 || sol > 12) continue;
      return done({
        prompt: L3(`1에서 시작해 ${L}까지 이웃한 칸을 차례로 눌러 길을 만들어요. ●는 지날 수 없어요`, `Start at 1 and tap neighboring boxes in order up to ${L}. You cannot pass a ●`, `从1出发，依次点相邻的格子一直到${L}。不能经过●`),
        answer: L, widget: 'g13Pinball', rows, cols, blocks: blocks.map(s => s.split(',').map(Number)), given, solution: path, L,
        printAsk: L3(`1에서 시작해 ${L}까지 이웃한 칸에 번호를 차례로 써요. ●는 지날 수 없어요`, `Start at 1 and write the numbers up to ${L} in neighboring boxes. You cannot pass a ●`, `从1出发，在相邻的格子里依次写数字，一直到${L}。不能经过●`)
      }, null, ['blocks', 'given', 'rows', 'cols']);
    }
    return null;
  };

  const GAP_LEGACY = { gap: 1 };
  NM_TGEN['g13_n2'] = function (params, rng) {
    const lv = (params && params.level) || 'main';
    const modes = (params && params.modes) || [(params && params.mode) || 'gap'];
    const mode = modes.length > 1 ? pick(rng, modes) : modes[0];
    if (GAP_LEGACY[mode]) return ORIG.nl2_seq(Object.assign({}, params, { mode, level: lv, g13: null }), rng);
    if (mode === 'dotsDown') { const sh = pick(rng, DOT_SHAPES.filter(s => s.pts.length <= 9)); return dotsProblem(rng, sh, 'down', 0); }
    if (mode === 'dotsPre') { const sh = pick(rng, DOT_SHAPES.filter(s => s.pts.length <= 9)); return dotsProblem(rng, sh, 'up', 2); }
    if (mode === 'pathRow') return pathProblem(rng, lv, 'row');
    if (mode === 'pathZig') return pathProblem(rng, lv, 'zig', { step: 2 });
    if (mode === 'pathRing') return pathProblem(rng, lv, 'ring');
    if (mode === 'pathGrid') return pathProblem(rng, lv, 'grid');
    if (mode === 'pathSnake') return pathProblem(rng, lv, 'snake');
    const fn = N2[mode] || N2.dots;
    for (let t = 0; t < 20; t++) { const p = fn(lv, rng); if (p) return p; }
    return N2.dots(lv, rng);
  };

  /* ═══════════════ N-03 ═══════════════ */
  const N3 = {};

  function ordCaption(kind, n, from) {
    const side = { ko: from === 'right' ? '오른쪽' : '왼쪽', en: from === 'right' ? 'right' : 'left', zh: from === 'right' ? '右边' : '左边' };
    return kind === 'ordinal'
      ? L3(`${side.ko}에서 ${ORD.ko[n]}`, `The ${ORD.en[n]} from the ${side.en}`, `从${side.zh}数第${n}个`)
      : L3(`${side.ko}에서 ${NATIVE.ko[n]}`, `${NATIVE.en[n]} from the ${side.en}`, `从${side.zh}数${NATIVE.zh[n]}个`);
  }
  N3.ord = function (lv, rng) {
    const from = pick(rng, ['left', 'right']);
    const n = lv === 'practice' ? R(rng, 2, 6) : R(rng, 2, 9);
    let rows;
    if (lv === 'practice') rows = [{ kind: pick(rng, ['ordinal', 'cardinal']), n, from }];
    else rows = shuffle(rng, [{ kind: 'ordinal', n, from }, { kind: 'cardinal', n, from }]);
    rows.forEach(r => { r.cap = ordCaption(r.kind, r.n, r.from); });
    return done({
      prompt: L3('줄마다 쓰여 있는 말대로 칸을 칠해요', 'Color each row just as the words say', '按每一行的说法涂色'),
      answer: n, widget: 'g13OrdPaint', total: 10, rows, emoji: pick(rng, ['⭐', '🍎', '🍪', '🎈']),
      printAsk: L3('줄마다 쓰여 있는 말대로 칸을 칠해요', 'Color each row just as the words say', '按每一行的说法涂色')
    }, null, ['rows', 'emoji']);
  };

  const SIDE = { row: [L3('왼쪽', 'left', '左边'), L3('오른쪽', 'right', '右边')], col: [L3('위', 'top', '上面'), L3('아래', 'bottom', '下面')], queue: [L3('앞', 'front', '前面'), L3('뒤', 'back', '后面')] };
  N3.build = function (lv, rng) {
    const axis = pick(rng, lv === 'practice' ? ['row', 'row', 'col'] : ['row', 'col', 'queue']);
    let a, b; const cap = lv === 'practice' ? 4 : 6;
    do { a = R(rng, 1, cap); b = R(rng, 1, cap); } while (a + b - 1 > 9 || a + b - 1 < 3);
    const total = a + b - 1, s = SIDE[axis];
    return done({
      prompt: L3(`${s[0].ko}에서 ${ORD.ko[a]}, ${s[1].ko}에서 ${ORD.ko[b]}예요. 칸을 모두 몇 칸 그려야 할까요?`,
        `It is the ${ORD.en[a]} from the ${s[0].en} and the ${ORD.en[b]} from the ${s[1].en}. How many boxes are there in all?`,
        `从${s[0].zh}数是第${a}个，从${s[1].zh}数是第${b}个。一共有几格？`),
      answer: total, widget: 'g13OrdRow', ordMode: 'build', axis, a, b, total, choices: choicesOf(rng, total, 3, 2, 9),
      printAsk: L3(`${s[0].ko}에서 ${ORD.ko[a]}, ${s[1].ko}에서 ${ORD.ko[b]}예요. 모두 몇 칸일까요?`, `It is the ${ORD.en[a]} from the ${s[0].en} and the ${ORD.en[b]} from the ${s[1].en}. How many boxes in all?`, `从${s[0].zh}数是第${a}个，从${s[1].zh}数是第${b}个。一共有几格？`)
    }, null, ['a', 'b', 'axis', 'choices']);
  };
  N3.flip = function (lv, rng) {
    const total = R(rng, 5, 9), a = R(rng, 1, total), b = total - a + 1;
    return done({
      prompt: L3(`색칠한 칸은 왼쪽에서 ${ORD.ko[a]}예요. 오른쪽에서는 몇째일까요?`, `The colored box is the ${ORD.en[a]} from the left. What place is it from the right?`, `涂色的格子从左边数是第${a}个。从右边数是第几个？`),
      answer: b, widget: 'g13OrdRow', ordMode: 'flip', total, a, choices: choicesOf(rng, b, 3, 1, total),
      printAsk: L3(`색칠한 칸은 왼쪽에서 ${ORD.ko[a]}예요. 오른쪽에서는 몇째일까요?`, `The colored box is the ${ORD.en[a]} from the left. What place is it from the right?`, `涂色的格子从左边数是第${a}个。从右边数是第几个？`)
    }, null, ['total', 'a', 'choices']);
  };
  N3.find = function (lv, rng) {
    const n = R(rng, 5, 7), cards = shuffle(rng, [1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, n);
    const ri = R(rng, 0, n - 1); let ai; do { ai = R(rng, 0, n - 1); } while (ai === ri);
    const ref = cards[ri], ask = cards[ai], pos = ri + 1, ans = ai + 1;
    return done({
      prompt: L3(`${ref}은(는) 왼쪽에서 ${ORD.ko[pos]}예요. 그러면 ${ask}은(는) 왼쪽에서 몇째일까요?`, `${ref} is the ${ORD.en[pos]} from the left. What place is ${ask} from the left?`, `${ref}从左边数是第${pos}个。那么${ask}从左边数是第几个？`),
      answer: ans, widget: 'g13OrdRow', ordMode: 'find', cards, ref: { v: ref, pos }, ask, choices: choicesOf(rng, ans, 3, 1, n),
      printAsk: L3(`${ref}은(는) 왼쪽에서 ${ORD.ko[pos]}예요. 그러면 ${ask}은(는) 왼쪽에서 몇째일까요?`, `${ref} is the ${ORD.en[pos]} from the left. What place is ${ask} from the left?`, `${ref}从左边数是第${pos}个。那么${ask}从左边数是第几个？`)
    }, null, ['cards', 'ref', 'ask', 'choices']);
  };
  N3.word = function (lv, rng) {
    const total = R(rng, 7, 9), n = R(rng, 2, 6), kind = pick(rng, ['cardinal', 'ordinal']), from = pick(rng, ['left', 'right']);
    const code = (k, m) => m * 10 + (k === 'ordinal' ? 1 : 0);
    const other = n === 2 ? 4 : n - 1;
    const ch = shuffle(rng, [code(kind, n), code(kind === 'ordinal' ? 'cardinal' : 'ordinal', n), code(kind, other)]);
    return done({
      prompt: L3('그림에 알맞은 말을 골라요', 'Pick the words that match the picture', '选出和图相符的说法'),
      answer: code(kind, n), widget: 'g13OrdRow', ordMode: 'word', total, n, kind, from, choices: ch,
      printAsk: L3('그림에 알맞은 말에 ○표 해요', 'Circle the words that match the picture', '在和图相符的说法上画○')
    }, null, ['total', 'n', 'kind', 'from', 'choices']);
  };

  N3.order = function (lv, rng) {
    const otype = lv === 'practice' ? 'asc' : pick(rng, ['asc', 'desc']);
    const N = lv === 'practice' ? 4 : R(rng, 5, 6);
    const tiles = shuffle(rng, [1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, N);
    const txt = otype === 'asc' ? L3('작은 수부터', 'smallest to biggest', '从小到大') : L3('큰 수부터', 'biggest to smallest', '从大到小');
    return done({
      prompt: L3(`${txt.ko} 차례로 눌러요`, `Tap from ${txt.en}`, `${txt.zh}依次点`),
      answer: N, widget: 'g13Order', otype, tiles,
      printAsk: L3(`${txt.ko} 차례로 써요`, `Write the numbers from ${txt.en}`, `${txt.zh}依次写出`)
    }, null, ['tiles', 'otype']);
  };

  N3.cmp = function (lv, rng) {
    let a, b;
    do { a = R(rng, lv === 'practice' ? 1 : 0, 9); b = R(rng, lv === 'practice' ? 1 : 0, 9); }
    while (a === b || (lv === 'practice' && Math.abs(a - b) < 3));
    const word = lv !== 'practice' && R(rng, 0, 2) === 0;
    return done({
      prompt: word
        ? L3(`${a} ○ ${b}. 알맞은 기호를 누르고, 알맞은 말도 골라요`, `${a} ○ ${b}. Pick the sign and the matching word`, `${a} ○ ${b}。选出合适的符号和说法`)
        : L3(`${a}와 ${b} 중 어느 쪽이 더 클까요? 알맞은 기호를 눌러요`, `Which sign fits? ${a} ○ ${b}`, `${a} ○ ${b}，选出合适的符号`),
      answer: a > b ? 1 : 2, widget: 'g13Cmp', left: a, right: b, ask: word ? 'word' : 'sign',
      printAsk: word ? L3(`○ 안에 >, <를 쓰고, 알맞은 말에 ○표 해요`, `Write > or < in the ○, then circle the matching word`, `在○里写>或<，再给相符的说法画○`) : L3('○ 안에 >, <를 써요', 'Write > or < in the ○', '在○里写>或<')
    }, null, ['left', 'right', 'ask']);
  };

  N3.range = function (lv, rng) {
    for (let t = 0; t < 300; t++) {
      const k = R(rng, 1, 8), form = pick(rng, ['□>k', 'k<□', '□<k', 'k>□']);
      const ok = v => form === '□>k' || form === 'k<□' ? v > k : v < k;
      const set = []; for (let v = 0; v <= 9; v++) if (ok(v)) set.push(v);
      if (set.length < 1 || set.length > (lv === 'practice' ? 4 : 7)) continue;
      const tiles = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
      const expr = form === '□>k' ? `□ > ${k}` : form === 'k<□' ? `${k} < □` : form === '□<k' ? `□ < ${k}` : `${k} > □`;
      const count = lv !== 'practice' && R(rng, 0, 2) === 0;
      return done({
        prompt: count
          ? L3(`${expr} 에서 □ 안에 들어갈 수 있는 수를 모두 ○표 하고, 몇 개인지 골라요`, `In ${expr}, circle every number that can go in □, then pick how many there are`, `${expr}：把能填进□的数都画○，再选出一共有几个`)
          : L3(`${expr} 에서 □ 안에 들어갈 수 있는 수를 모두 ○표 해요`, `In ${expr}, circle every number that can go in □`, `${expr}：把能填进□的数都画○`),
        answer: count ? set.length : set.length, widget: 'g13NumPick', tiles, marks: [{ sym: '○', set: set.slice() }], expr, ask: count ? 'count' : 'mark',
        choices: count ? choicesOf(rng, set.length, 3, 1, 9) : undefined,
        printAsk: count
          ? L3(`${expr} 에서 □ 안에 들어갈 수 있는 수를 모두 ○표 하고, 몇 개인지 써요`, `In ${expr}, circle every number that can go in □, then write how many`, `${expr}：把能填进□的数都画○，再写出一共有几个`)
          : L3(`${expr} 에서 □ 안에 들어갈 수 있는 수를 모두 ○표 해요`, `In ${expr}, circle every number that can go in □`, `${expr}：把能填进□的数都画○`)
      }, null, ['tiles', 'expr', 'ask']);
    }
    return null;
  };

  N3.candy = function (lv, rng) {
    const n = R(rng, 3, 7), tok = pick(rng, ['🍬', '🍪', '🍎', '⭐']);
    const tiles = [n - 2, n - 1, n, n + 1, n + 2].filter(v => v >= 1);
    const more = tiles.indexOf(n + 1), less = tiles.indexOf(n - 1);
    return done({
      prompt: L3('그림보다 하나 더 많은 수에 ○, 하나 더 적은 수에 △표 해요', 'Mark the number that is one more than the picture with ○ and one less with △', '比图多1的数画○，少1的数画△'),
      answer: 2, widget: 'g13NumPick', tiles, marks: [{ sym: '○', set: [more] }, { sym: '△', set: [less] }], scene: { e: tok, n },
      printAsk: L3('그림보다 하나 더 많은 수에 ○, 하나 더 적은 수에 △표 해요', 'Mark the number that is one more than the picture with ○ and one less with △', '比图多1的数画○，少1的数画△')
    }, null, ['tiles', 'scene']);
  };

  N3.minmax = function (lv, rng) {
    const N = R(rng, 5, 7), tiles = shuffle(rng, [1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, N);
    const sub = pick(rng, ['both', 'max', 'min', 'gt5', 'lt5']);
    const idx = f => tiles.map((v, i) => f(v) ? i : -1).filter(i => i >= 0);
    const mx = Math.max.apply(null, tiles), mn = Math.min.apply(null, tiles);
    let marks, txt;
    if (sub === 'both') { marks = [{ sym: '○', set: idx(v => v === mx) }, { sym: '△', set: idx(v => v === mn) }]; txt = L3('가장 큰 수에 ○, 가장 작은 수에 △표 해요', 'Mark the biggest number with ○ and the smallest with △', '最大的数画○，最小的数画△'); }
    else if (sub === 'max') { marks = [{ sym: '○', set: idx(v => v === mx) }]; txt = L3('가장 큰 수에 ○표 해요', 'Circle the biggest number', '给最大的数画○'); }
    else if (sub === 'min') { marks = [{ sym: '○', set: idx(v => v === mn) }]; txt = L3('가장 작은 수에 ○표 해요', 'Circle the smallest number', '给最小的数画○'); }
    else if (sub === 'gt5') { marks = [{ sym: '○', set: idx(v => v > 5) }]; txt = L3('5보다 큰 수에 모두 ○표 해요', 'Circle every number bigger than 5', '把比5大的数都画○'); }
    else { marks = [{ sym: '○', set: idx(v => v < 5) }]; txt = L3('5보다 작은 수에 모두 ○표 해요', 'Circle every number smaller than 5', '把比5小的数都画○'); }
    if (marks.some(m => m.set.length < 1)) return null;
    if ((sub === 'gt5' || sub === 'lt5') && marks[0].set.length === N) return null;
    return done({ prompt: txt, answer: marks.reduce((s, m) => s + m.set.length, 0), widget: 'g13NumPick', tiles, marks, printAsk: txt }, null, ['tiles', 'marks']);
  };

  N3.arrowTri = function (lv, rng) {
    const vals = shuffle(rng, [1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3);
    if (lv === 'practice') { vals.sort((a, b) => a - b); if (vals[1] - vals[0] < 2 || vals[2] - vals[1] < 2) return N3.arrowTri(lv, rng); }
    const sorted = vals.slice().sort((a, b) => b - a);
    if (R(rng, 0, 1) === 0) {                              /* draw */
      return done({
        prompt: L3('큰 수에서 작은 수 쪽으로 화살표를 그려요. 변을 눌러요', 'Draw each arrow from the bigger number to the smaller one. Tap a side', '箭头从大数指向小数，点一点边'),
        answer: sorted[0], widget: 'g13ArrowTri', amode: 'draw', vals,
        printAsk: L3('큰 수에서 작은 수 쪽으로 화살표를 그려요', 'Draw each arrow from the bigger number to the smaller one', '箭头从大数指向小数')
      }, null, ['vals', 'amode']);
    }
    /* fill — 꼭짓점 0(위)·1(왼쪽 아래)·2(오른쪽 아래)에 수를 놓아 순환 없는 화살표를 만든다 */
    const rank = shuffle(rng, [0, 1, 2]);                  /* rank[i] = 꼭짓점 i 의 크기 순위(0 이 가장 큼) */
    const arrows = [];
    [[0, 1], [0, 2], [1, 2]].forEach(([i, j]) => { arrows.push(rank[i] < rank[j] ? [i, j] : [j, i]); });
    const pre = lv === 'practice' ? (() => { const v = R(rng, 0, 2); return { [v]: sorted[rank[v]] }; })() : null;
    return done({
      prompt: L3('화살표는 큰 수에서 작은 수 쪽을 가리켜요. 수를 눌러 알맞은 자리에 놓아요', 'Arrows go from the bigger to the smaller number. Tap a number, then tap its place', '箭头从大数指向小数。点一点数字，再点它的位置'),
      answer: sorted[0], widget: 'g13ArrowTri', amode: 'fill', arrows, bank: shuffle(rng, vals), rank, pre, vals: sorted,
      printAsk: L3('화살표는 큰 수에서 작은 수 쪽을 가리켜요. 빈 칸에 알맞은 수를 써요', 'Arrows go from the bigger to the smaller number. Write the numbers in the blanks', '箭头从大数指向小数。在空格里写出合适的数')
    }, null, ['arrows', 'bank', 'amode', 'pre']);
  };

  N3.rest = function (lv, rng) {
    const T = R(rng, 6, 9), k = R(rng, 2, Math.min(5, T - 1)), ans = T - k;
    const tok = pick(rng, ['⭐', '🍎', '🍪', '🎈']);
    const items = []; for (let i = 0; i < T; i++) items.push({ e: tok, t: i >= k, ring: i < k });
    return done({
      prompt: L3(`왼쪽 ${k}개를 묶었어요. 묶지 않은 것은 몇 개일까요?`, `The ${k} on the left are grouped. How many are not grouped?`, `左边${k}个圈起来了，没圈的有几个？`),
      answer: ans, widget: 'g13Count', ask: 'rest', layout: 'row', emoji: tok, unit: U_GAE, items, ring: k, choices: choicesOf(rng, ans, 3, 1, 9),
      printAsk: L3(`왼쪽 ${k}개를 묶었어요. 묶지 않은 것은 몇 개일까요?`, `The ${k} on the left are grouped. How many are not grouped?`, `左边${k}个圈起来了，没圈的有几个？`)
    }, null, ['items', 'ring', 'choices']);
  };

  N3.blocksCmp = function (lv, rng) {
    for (let t = 0; t < 300; t++) {
      const maxHidden = 0;
      const A = makeBlocks(rng, lv, maxHidden), B = makeBlocks(rng, lv, maxHidden);
      if (A.total === B.total) continue;
      return done({
        prompt: L3('두 쌓기나무 중 어느 쪽이 더 많을까요? 알맞은 기호를 눌러요', 'Which stack has more blocks? Pick the sign', '哪一堆积木更多？选出合适的符号'),
        answer: A.total > B.total ? 1 : 2, widget: 'g13Blocks', bmode: 'cmp', heightsA: A.H, heightsB: B.H, sumA: A.total, sumB: B.total,
        printAsk: L3('두 쌓기나무의 개수를 □에 쓰고, ○ 안에 >, <를 써요', 'Write how many blocks in each □, then write > or < in the ○', '把两堆积木的块数写进□，再在○里写>或<')
      }, null, ['heightsA', 'heightsB']);
    }
    return null;
  };

  N3.more = function (lv, rng) {
    const tok = pick(rng, ['🍬', '🍪', '🍎', '⭐']), fixed = R(rng, lv === 'practice' ? 2 : 3, lv === 'practice' ? 5 : 8), target = fixed + 1;
    return done({
      prompt: L3(`그림 ${fixed}개보다 하나 더 많게 놓아요`, `Make one more than the ${fixed} shown`, `比图里的${fixed}个多放一个`),
      answer: target, widget: 'g13Make', emoji: tok, fixed, target,
      printAsk: L3(`그림 ${fixed}개보다 하나 더 많게 그리고, 몇 개인지 써요`, `Draw one more than the ${fixed} shown, then write how many`, `比图里的${fixed}个多画一个，再写出一共有几个`)
    }, null, ['fixed', 'emoji']);
  };

  NM_TGEN['g13_n3'] = function (params, rng) {
    const lv = (params && params.level) || 'main';
    const modes = (params && params.modes) || [(params && params.mode) || 'ord'];
    const mode = modes.length > 1 ? pick(rng, modes) : modes[0];
    if (mode === 'position' || mode === 'paint') return ORIG.nl3_ordinal(Object.assign({}, params, { mode, level: lv, g13: null }), rng);
    if (mode === 'ordRow') { const m = pick(rng, ['flip', 'find', 'word']); return N3[m](lv, rng); }
    const fn = N3[mode] || N3.ord;
    for (let t = 0; t < 20; t++) { const p = fn(lv, rng); if (p) return p; }
    return N3.ord(lv, rng);
  };

  /* ── 원본 생성기를 한 겹 감싼다 — NL1·NL4·NL8 에 덧붙인 레벨(params.g13)이 이쪽으로 들어오게(nl.js 불변) ── */
  const ORIG = { nl1_count: NM_TGEN['nl1_count'], nl2_seq: NM_TGEN['nl2_seq'], nl3_ordinal: NM_TGEN['nl3_ordinal'] };
  const WRAP = { nl1_count: 'g13_n1', nl2_seq: 'g13_n2', nl3_ordinal: 'g13_n3' };
  Object.keys(WRAP).forEach(k => {
    if (typeof ORIG[k] !== 'function') return;
    NM_TGEN[k] = function (params, rng) {
      if (params && params.g13) return NM_TGEN[WRAP[k]](params, rng);
      return ORIG[k](params, rng);
    };
  });
  /* 테스트용 — 순수 함수 */
  NM_TGEN.__g13 = { pieces, concurrent, hiddenCubes, chordCross, canonShape, DOT_SHAPES, countSolutions };
})();
