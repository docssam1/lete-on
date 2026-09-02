/* ============================================================
   Numbers of Magic — 개념 애니메이션 렌더러 + 재생기 (NM_CANIM)
   설계: number_magic/개념애니-설계.md §6-1(렌더러 재사용) · §6-2(완료 기준)

   ── 렌더러를 새로 만들지 않았다 ──
   좌표·문자열 원시함수는 geometry/worksheet/render.js(GW_RENDER)의 것을
   그대로 쓴다: fmt(소수 둘째 자리 반올림) · polygon(점 목록 → 다각형) ·
   wrapSvg(bbox → viewBox). 그 파일과 같은 계약이다 — DOM을 만지지 않고
   SVG "문자열"을 돌려주므로 인쇄에 그대로 실리고 Node에서 검사도 된다.
   좌표는 전부 NM_SCENE(engine/scene-model.js)의 frame에서 나온다. 이 파일에
   눈대중으로 찍은 좌표는 없다 — 여기 있는 상수는 획 두께·모서리 반경 같은
   "그리기 스타일"뿐이고 위치는 하나도 정하지 않는다.

   ── 칠판 수업이 원형 ──
   완성된 그림에 색을 입히는 방식이 아니라, 빈 판에서 beat마다 하나씩
   그려 나가고 앞의 것은 지우지 않는다. 그래서 마지막 beat의 화면이 곧
   finalOverview이고, 인쇄(A4)에는 그 상태 한 장이 나간다.
   ============================================================ */
(function (global) {
'use strict';

/* GW_RENDER가 없으면 조용히 대체하지 않고 그 자리에서 실패한다.
   렌더러 재사용이 이 기능의 전제라서(개념애니-설계.md §6-1), 몰래 다른 코드로
   그리면 "재사용했다"는 말이 거짓이 되고 결함도 눈에 안 띈다.
   main.js의 mountConceptScene이 이 예외를 받아 화면에 빨간 안내를 남긴다. */
function need(){
  const GR = global.GW_RENDER;
  if (!GR || !GR.fmt || !GR.polygon || !GR.wrapSvg) {
    throw new Error('GW_RENDER(geometry/worksheet/render.js)를 못 불러왔습니다 — ' +
      '서빙 루트를 확인하세요(저장소 루트 기준 ../geometry/…).');
  }
  return GR;
}
const fmt = n => need().fmt(n);
const polygon = (pts, f, s) => need().polygon(pts, f, s);
const wrapSvg = (inner, bbox, cls, attrs) => need().wrapSvg(inner, bbox, cls, attrs);

/* 짝 색 — app/main.js의 conceptExpr()가 쓰는 색 그대로 (초록·주황·보라).
   같은 앱에서 "짝"을 뜻하는 색이 화면마다 달라지지 않게 한다. */
const PAIR_COLORS = ['#2E9E6B', '#E0682F', '#8A5CD0'];
const INK = '#1A2233', SUB = '#4a5468', LINE = '#E4E2DC';
const BLUE = '#16417C', GOLD = '#C9A063';
const R = 8;            /* 칩 모서리 반경 */

function esc(s){ return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

/* ── 그리기 원시함수 ──────────────────────────────────────────
   GW_RENDER는 <rect>/<text>/<line>을 각 격자 함수 안에 직접 문자열로 적어
   두었고 원시함수로 내보내지 않는다(renderNumberGrid·renderSolveTable 등
   5곳). 그것을 GW_RENDER 쪽으로 끌어올리려면 그 5개 함수를 다시 쓰고
   도형 학습지를 다시 검증해야 해서 이번 프로토타입 범위 밖으로 뒀다
   — 대신 같은 형식으로 여기 둔다. 좌표는 전부 인자로 받는다. */
function rect(x, y, w, h, o){
  o = o || {};
  return '<rect x="' + fmt(x) + '" y="' + fmt(y) + '" width="' + fmt(w) + '" height="' + fmt(h) + '"' +
    (o.r != null ? ' rx="' + o.r + '" ry="' + o.r + '"' : '') +
    ' fill="' + (o.fill || 'none') + '" stroke="' + (o.stroke || 'none') + '"' +
    ' stroke-width="' + (o.sw == null ? 1 : o.sw) + '"' +
    (o.dash ? ' stroke-dasharray="' + o.dash + '"' : '') + '/>';
}
function text(x, y, s, o){
  o = o || {};
  return '<text x="' + fmt(x) + '" y="' + fmt(y) + '" text-anchor="' + (o.anchor || 'middle') +
    '" dominant-baseline="central" font-weight="' + (o.weight || 800) +
    '" font-size="' + fmt(o.size) + '" fill="' + (o.fill || INK) + '">' + esc(s) + '</text>';
}
function line(x1, y1, x2, y2, o){
  o = o || {};
  return '<line x1="' + fmt(x1) + '" y1="' + fmt(y1) + '" x2="' + fmt(x2) + '" y2="' + fmt(y2) +
    '" stroke="' + (o.stroke || LINE) + '" stroke-width="' + (o.sw == null ? 1 : o.sw) + '"' +
    (o.dash ? ' stroke-dasharray="' + o.dash + '"' : '') +
    ' stroke-linecap="round"/>';
}
function path(d, o){
  o = o || {};
  return '<path d="' + d + '" fill="' + (o.fill || 'none') + '" stroke="' + (o.stroke || INK) +
    '" stroke-width="' + (o.sw == null ? 2 : o.sw) + '" stroke-linecap="round"/>';
}
/* 화살촉 — GW_RENDER.polygon 재사용. 점 목록은 방향 벡터에서 계산한다. */
function arrowHead(tipX, tipY, dirX, dirY, size, color){
  const len = Math.hypot(dirX, dirY) || 1;
  const ux = dirX / len, uy = dirY / len, px = -uy, py = ux;
  const pts = [
    { px: tipX, py: tipY },
    { px: tipX - ux * size + px * size * 0.5, py: tipY - uy * size + py * size * 0.5 },
    { px: tipX - ux * size - px * size * 0.5, py: tipY - uy * size - py * size * 0.5 }
  ];
  return polygon(pts, color, color);
}

/* ── 객체 하나 → SVG 조각 ──────────────────────────────────── */
const CHIP_TYPES = { 'num-chip': 1, 'sum-chip': 1, 'coef-chip': 1, 'letter-chip': 1, 'place-cell': 1, 'answer': 1, 'exp-chip': 1 };

function objSvg(o, byId, fs){
  const f = o.frame, cx = f.x + f.width / 2, cy = f.y + f.height / 2;
  const color = o.data && o.data.colorIndex != null ? PAIR_COLORS[o.data.colorIndex % PAIR_COLORS.length] : null;
  const isAnswer = o.role === 'answer';

  if (o.type === 'op') return text(cx, cy, o.data.text, { size: fs * 0.85, fill: SUB });
  if (o.type === 'label') return text(f.x, cy, o.data.text, { size: fs * 0.7, fill: SUB, anchor: 'start', weight: 700 });
  if (o.type === 'lane-dot') return '<circle cx="' + fmt(cx) + '" cy="' + fmt(cy) + '" r="' + fmt(f.width / 2) +
      '" fill="' + (o.data.lane === 'number' ? BLUE : GOLD) + '"/>';
  if (o.type === 'place-guide') return line(f.x, f.y, f.x, f.y + f.height, { stroke: LINE, sw: 1, dash: '4 4' });
  if (o.type === 'rule-line') return line(f.x, f.y, f.x + f.width, f.y, { stroke: INK, sw: 2.2 });

  if (o.type === 'pair-arc') {
    /* 두 칩 중심을 잇는 호. 제어점은 frame(=모델이 계산한 span·rise)에서만 나온다. */
    const y0 = f.y + f.height, c = color || PAIR_COLORS[0];
    const d = 'M ' + fmt(f.x) + ' ' + fmt(y0) + ' C ' + fmt(f.x) + ' ' + fmt(f.y) + ', ' +
      fmt(f.x + f.width) + ' ' + fmt(f.y) + ', ' + fmt(f.x + f.width) + ' ' + fmt(y0);
    return path(d, { stroke: c, sw: 2.6 }) +
      rect(cx - fs * 0.95, f.y - fs * 0.42, fs * 1.9, fs * 0.84, { r: 10, fill: '#fff', stroke: c, sw: 1.6 }) +
      text(cx, f.y, o.data.label, { size: fs * 0.56, fill: c });
  }

  if (o.type === 'shift-arrow') {
    const from = byId[o.data.fromId], to = byId[o.data.toId];
    const x1 = from.frame.x + from.frame.width / 2, y1 = from.frame.y + from.frame.height;
    const x2 = to.frame.x + to.frame.width / 2, y2 = to.frame.y;
    const my = (y1 + y2) / 2;
    return path('M ' + fmt(x1) + ' ' + fmt(y1) + ' C ' + fmt(x1) + ' ' + fmt(my) + ', ' +
                fmt(x2) + ' ' + fmt(my) + ', ' + fmt(x2) + ' ' + fmt(y2 - 6),
                { stroke: BLUE, sw: 1.8 }) +
      arrowHead(x2, y2 - 1, x2 - x1, y2 - my, 7, BLUE);
  }

  if (CHIP_TYPES[o.type]) {
    const isExp = o.type === 'exp-chip';
    const size = isExp ? fs * 0.6 : fs;
    const ty = isExp ? f.y + f.height * 0.3 : cy;      /* 지수는 위첨자 위치 */
    /* place-cell·letter-chip은 상자가 없다 — 자릿값 안내선/문자는 글자만 */
    let box = '';
    if (o.type === 'num-chip' || o.type === 'sum-chip' || o.type === 'coef-chip') {
      box = rect(f.x, f.y, f.width, f.height, {
        r: R, fill: color ? '#fff' : '#fff', stroke: color || LINE, sw: color ? 2 : 1.4 });
    }
    if (o.type === 'sum-chip') {
      box = rect(f.x, f.y, f.width, f.height, { r: R, fill: (color || BLUE) + '1a', stroke: color || BLUE, sw: 2 });
    }
    /* 정답 칸은 칩마다 상자를 두르지 않는다 — 답이 여러 칸으로 이루어질 때
       (28080의 자릿수 5칸, 12x^5의 계수·문자·지수) 상자가 여러 개면 답이
       여러 개처럼 보인다. 대신 renderScene()이 정답 객체 전체를 감싸는
       띠 하나를 그린다. */
    if (isAnswer) box = '';
    const fill = isAnswer ? '#8a5a12' : (color || INK);
    return box + text(cx, ty, o.data.text, { size: size, fill: fill });
  }
  return '';
}

/* ── manifest → SVG 문자열 ─────────────────────────────────── */
function renderScene(man){
  const fs = (global.NM_SCENE && NM_SCENE.metrics.FS) || 26;
  const byId = {};
  man.objects.forEach(o => { byId[o.id] = o; });
  /* beat 순서대로 "언제 등장하는가"를 정한다 — 칠판이라 한 번 나오면 남는다. */
  const bornAt = {};
  man.beats.forEach((b, i) => {
    b.targetIds.forEach(id => { if (bornAt[id] == null) bornAt[id] = i; });
    (b.actions || []).forEach(a => (a.targetIds || []).forEach(id => { if (bornAt[id] == null) bornAt[id] = i; }));
  });
  /* 정답 띠 — 정답 객체들의 frame 합집합. 좌표를 새로 찍는 게 아니라 이미
     계산된 frame에서 나오고, 답 beat에 맞춰 함께 등장한다. */
  const ansObjs = man.objects.filter(o => o.role === 'answer');
  let band = '';
  if (ansObjs.length) {
    const pad = 6;
    const bx = Math.min.apply(null, ansObjs.map(o => o.frame.x)) - pad;
    const by = Math.min.apply(null, ansObjs.map(o => o.frame.y)) - pad * 0.5;
    const bw = Math.max.apply(null, ansObjs.map(o => o.frame.x + o.frame.width)) + pad - bx;
    const bh = Math.max.apply(null, ansObjs.map(o => o.frame.y + o.frame.height)) + pad * 0.5 - by;
    const bornBand = man.beats.map(b => b.id).indexOf(man.problem.answerRevealBeatId);
    band = '<g class="cs-obj cs-answer-band" data-oid="_answerBand" data-born="' + bornBand + '">' +
      rect(bx, by, bw, bh, { r: R + 2, fill: '#fff6e4', stroke: GOLD, sw: 2.4 }) + '</g>';
  }
  const body = band + man.objects.map(o => {
    const ef = o.data && o.data.enterFrom;
    return '<g class="cs-obj cs-' + o.type + (o.role === 'answer' ? ' cs-answer' : '') + '"' +
      ' data-oid="' + esc(o.id) + '" data-born="' + (bornAt[o.id] == null ? 0 : bornAt[o.id]) + '"' +
      (ef ? ' data-dx="' + ef.dx + '" data-dy="' + ef.dy + '"' : '') + '>' +
      objSvg(o, byId, fs) + '</g>';
  }).join('');
  const bbox = { xMin: 0, yMin: 0, w: man.scene.width, h: man.scene.height };
  /* 확대 상한 — 좁은 화면에서는 줄어들지만, 넓은 화면에서 마냥 커지면 한 장면이
     화면 밖으로 나간다. 상한을 픽셀로 찍지 않고 모델의 글자 크기에서 낸다:
     칩 글자를 MAXFS 이상으로는 키우지 않는다(= 모델 폭 × MAXFS/FS). */
  const MAXFS = 40;
  const maxW = fmt(man.scene.width * MAXFS / fs);
  const attrs = ' role="img" aria-label="' + esc(man.title) + '"' +
                ' style="max-width:' + maxW + 'px"';
  return wrapSvg(body, bbox, 'cs-svg', attrs);
}

/* ── 재생기 ────────────────────────────────────────────────── */
const UI = {
  ko: { play: '재생', pause: '멈춤', prev: '이전', next: '다음', again: '처음부터', reroll: '다른 수로',
        beat: '장면', of: '/', title: '움직이는 예' },
  en: { play: 'Play', pause: 'Pause', prev: 'Prev', next: 'Next', again: 'Replay', reroll: 'New numbers',
        beat: 'Beat', of: '/', title: 'Watch it happen' },
  zh: { play: '播放', pause: '暂停', prev: '上一步', next: '下一步', again: '重播', reroll: '换个数',
        beat: '场景', of: '/', title: '动起来看看' }
};

/* 인쇄 잠금 해제를 이 화면에만 걸기 위한 표식.
   앱 껍데기는 화면 앱이라 html·body·#app·#screen이 전부 100dvh + overflow:hidden이다.
   그대로 인쇄하면 **백지 한 장**이 나온다 — 실제로 그랬고, "객체가 보이는가"를
   computed style로만 확인한 검사는 이걸 못 잡았다(화면에선 멀쩡했다).
   그렇다고 전역으로 풀면 학습지·시험 인쇄(app/exam.js·print.html)까지 건드린다.
   그래서 개념 장면이 화면에 있을 때만 <html>에 클래스를 달고, CSS도 그 클래스
   아래로만 잠금을 푼다. MutationObserver가 화면 전환을 따라가며 켜고 끈다. */
let sceneWatcher = null;
function markScenePresent(){
  const sync = () => {
    try { document.documentElement.classList.toggle('nm-has-cscene', !!document.querySelector('.cs-wrap')); }
    catch (e) {}
  };
  sync();
  if (!sceneWatcher && global.MutationObserver && document.body) {
    sceneWatcher = new MutationObserver(sync);
    sceneWatcher.observe(document.body, { childList: true, subtree: true });
  }
}

function mount(host, opts){
  const lang = (opts && opts.lang) || 'ko';
  const T = UI[lang] || UI.ko;
  const make = opts.make;                 /* () => manifest */
  let man = make();
  let idx = 0, timer = null;

  host.classList.add('cs-wrap');
  host.innerHTML =
    '<div class="cs-head"><span class="cs-badge">🪄 ' + esc(T.title) + '</span>' +
      '<span class="cs-sub">' + esc(opts.title || '') + '</span>' +
      '<button type="button" class="cs-reroll" data-a="reroll">🎲 ' + esc(T.reroll) + '</button></div>' +
    '<div class="cs-stage"></div>' +
    '<div class="cs-nar" aria-live="polite"></div>' +
    '<div class="cs-ctl">' +
      '<button type="button" class="cs-b" data-a="prev" aria-label="' + esc(T.prev) + '">◀</button>' +
      '<button type="button" class="cs-b cs-play" data-a="play">▶ ' + esc(T.play) + '</button>' +
      '<button type="button" class="cs-b" data-a="next" aria-label="' + esc(T.next) + '">▶</button>' +
      '<span class="cs-dots"></span>' +
    '</div>' +
    /* 대본 — G·MAP 계약이 요구하는 "보이는 transcript". 화면에서는 지금
       장면이 굵게 표시되고, 인쇄물에서는 이 목록이 곧 설명글이 된다
       (인쇄에는 애니메이션이 없으므로). */
    '<ol class="cs-transcript"></ol>';

  const stage = host.querySelector('.cs-stage');
  const narEl = host.querySelector('.cs-nar');
  const dots = host.querySelector('.cs-dots');
  const playBtn = host.querySelector('.cs-play');
  const script = host.querySelector('.cs-transcript');
  const narOf = b => (b.narrationI18n && b.narrationI18n[lang]) || b.narration;

  function reduced(){
    try { return global.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches; }
    catch (e) { return false; }
  }

  function draw(){
    stage.innerHTML = renderScene(man);
    dots.innerHTML = man.beats.map((b, i) => '<i class="cs-dot' + (i === idx ? ' on' : '') + '"></i>').join('');
    script.innerHTML = man.beats.map(b => '<li>' + esc(narOf(b)) + '</li>').join('');
    apply(true);
  }

  function apply(instant){
    const nodes = stage.querySelectorAll('.cs-obj');
    for (let i = 0; i < nodes.length; i++) {
      const g = nodes[i];
      const born = Number(g.getAttribute('data-born'));
      const shown = born <= idx;
      const isNew = born === idx;
      g.classList.toggle('cs-on', shown);
      g.classList.toggle('cs-new', shown && isNew);
      if (shown && isNew && !instant && !reduced()) {
        const dx = g.getAttribute('data-dx'), dy = g.getAttribute('data-dy');
        if (dx != null) {
          g.style.transition = 'none';
          g.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
          void g.getBoundingClientRect();
          g.style.transition = '';
          g.style.transform = '';
        }
      } else {
        g.style.transition = ''; g.style.transform = '';
      }
    }
    narEl.textContent = narOf(man.beats[idx]);
    const ds = dots.querySelectorAll('.cs-dot');
    for (let i = 0; i < ds.length; i++) ds[i].classList.toggle('on', i === idx);
    const ls = script.querySelectorAll('li');
    for (let i = 0; i < ls.length; i++) ls[i].classList.toggle('on', i === idx);
  }

  function go(i){
    idx = Math.max(0, Math.min(man.beats.length - 1, i));
    apply(false);
  }
  function stop(){ if (timer) { clearTimeout(timer); timer = null; } playBtn.innerHTML = '▶ ' + esc(T.play); }
  function tick(){
    if (idx >= man.beats.length - 1) { stop(); return; }
    go(idx + 1);
    timer = setTimeout(tick, man.beats[idx].durationMs);
  }
  function play(){
    if (timer) { stop(); return; }
    if (idx >= man.beats.length - 1) { go(0); }
    playBtn.innerHTML = '⏸ ' + esc(T.pause);
    timer = setTimeout(tick, man.beats[idx].durationMs);
  }

  host.addEventListener('click', ev => {
    const b = ev.target.closest('[data-a]');
    if (!b || !host.contains(b)) return;
    const a = b.getAttribute('data-a');
    if (a === 'prev') { stop(); go(idx - 1); }
    else if (a === 'next') { stop(); go(idx + 1); }
    else if (a === 'play') play();
    else if (a === 'reroll') { stop(); man = make(); idx = 0; draw(); }
  });

  draw();
  markScenePresent();
  return { redraw: draw, stop: stop, manifest: () => man };
}

global.NM_CANIM = { mount: mount, renderScene: renderScene, PAIR_COLORS: PAIR_COLORS };
if (typeof module !== 'undefined' && module.exports) module.exports = global.NM_CANIM;
})(typeof window !== 'undefined' ? window : globalThis);
