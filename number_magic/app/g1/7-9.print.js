/* ============================================================
   G1-7·8·9호 인쇄 — window.NM_NL_PRINT['위젯이름'] = { visual(p,K), label(p,K), ask(p,K) }
   K = exam.js nlPrintKit(): nlCard·nlStage·nlAnsBox·nlObjHtml·esc·lk·pickL·EA·NL_CIRC …
   색은 화면 위젯과 같은 팔레트(INK·LINE·GOLD …)를 쓰고, 흑백 레이저에서도 칸이 남게 테두리는 진한 쪽을 고른다. 한 칸 너비는 54mm 안쪽.
   SVG 에는 nm-obj-svg 를 붙여 exam.js 의 '.nm-nl svg path/line → 검정 선' 규칙에서 빠지고, 선 색을 직접 준다.
   빈칸이 여럿인 그림은 빈칸 안에 ①②③ 번호를 작게 넣고 정답지가 "①3 ②1" 로 적는다.
   이 파일은 화면 위젯(7-9.widgets.js)이 쓰는 모양 계산(NM_G79_GEO)도 함께 둔다 — 인쇄 페이지는 위젯 파일을 안 싣는다.
   ============================================================ */
(function () {
  'use strict';
  window.NM_NL_PRINT = window.NM_NL_PRINT || {};
  const MN = '−';
  /* 화면 위젯과 같은 팔레트(7-9.css·7-9.widgets.js) */
  const INK = '#0E2C57', LINE = '#16417c', GOLD = '#C9A063', CREAM = '#fffaf0', BUTTER = '#fff3c9', PALE = '#e7ebf4', MIST = '#eef1f6',
    SUB = '#4a5468', ADD = '#2e7d57', SUBC = '#b5651d', ARC = ['#3b8fe0', '#fb8c2e'], PIP = '#1a2233', GUIDE = '#c8b583';

  /* ── 공용 모양 계산: 화면과 인쇄가 같은 좌표를 쓴다 ───────────────── */
  const GEO = window.NM_G79_GEO = window.NM_G79_GEO || {};
  /* 수나무 — 잎을 왼쪽에서 오른쪽으로 놓고 부모는 두 자식의 가운데, 가지가 갈라지는(split)·합쳐지는(merge) 방향은 y 만 뒤집는다 */
  GEO.treeLayout = function (nodes, flow) {
    const order = [], depth = [];
    (function dfs(i, d) { depth[i] = d; const n = nodes[i]; if (!n.kids) { order.push(i); return; } n.kids.forEach(k => dfs(k, d + 1)); })(0, 0);
    const maxD = Math.max.apply(null, depth), L = order.length, xs = [];
    const sp = 46, W = Math.max(150, 48 + sp * (L - 1)), x0 = (W - sp * (L - 1)) / 2;
    order.forEach((id, i) => { xs[id] = x0 + i * sp; });
    (function fill(i) { const n = nodes[i]; if (n.kids) { n.kids.forEach(fill); xs[i] = (xs[n.kids[0]] + xs[n.kids[1]]) / 2; } })(0);
    const rowH = 46, top = 22, H = top * 2 + maxD * rowH;
    const pts = nodes.map((n, i) => ({ x: xs[i], y: flow === 'merge' ? top + (maxD - depth[i]) * rowH : top + depth[i] * rowH }));
    return { pts, W, H, r: 15 };
  };
  /* 꼭지점 도형 — 변 i = verts[i] + verts[(i+1)%n]. 꼭지점은 네모, 변의 합은 원 */
  GEO.vertexLayout = function (shape) {
    if (shape === 'quad') {
      const v = [{ x: 42, y: 26 }, { x: 158, y: 26 }, { x: 158, y: 124 }, { x: 42, y: 124 }];
      return { W: 200, H: 150, v, e: v.map((p, i) => { const q = v[(i + 1) % 4]; return { x: (p.x + q.x) / 2, y: (p.y + q.y) / 2 }; }) };
    }
    const v = [{ x: 100, y: 24 }, { x: 34, y: 126 }, { x: 166, y: 126 }];
    return { W: 200, H: 150, v, e: v.map((p, i) => { const q = v[(i + 1) % 3]; return { x: (p.x + q.x) / 2, y: (p.y + q.y) / 2 }; }) };
  };
  /* 바퀴 — 6등분(마주 보는 칸 i ↔ i+3)과 5등분 이중 원 */
  GEO.wheelOpposite = function () {
    const out = [];
    for (let i = 0; i < 6; i++) {
      const a0 = -Math.PI / 2 - Math.PI / 6 + i * Math.PI / 3, a1 = a0 + Math.PI / 3, am = (a0 + a1) / 2, R = 80, cx = 100, cy = 100;
      out.push({ d: `M${cx} ${cy} L${(cx + R * Math.cos(a0)).toFixed(1)} ${(cy + R * Math.sin(a0)).toFixed(1)} A${R} ${R} 0 0 1 ${(cx + R * Math.cos(a1)).toFixed(1)} ${(cy + R * Math.sin(a1)).toFixed(1)} Z`,
        tx: +(cx + 52 * Math.cos(am)).toFixed(1), ty: +(cy + 52 * Math.sin(am)).toFixed(1) });
    }
    return out;
  };
  GEO.wheelSectors = function () {
    const out = [], cx = 100, cy = 100, r0 = 24, r1 = 54, r2 = 86;
    const pt = (r, a) => [+(cx + r * Math.cos(a)).toFixed(1), +(cy + r * Math.sin(a)).toFixed(1)];
    for (let i = 0; i < 5; i++) {
      const a0 = -Math.PI / 2 + i * 2 * Math.PI / 5, a1 = a0 + 2 * Math.PI / 5, am = (a0 + a1) / 2;
      const ring = (ra, rb) => { const p = pt(ra, a0), q = pt(ra, a1), s = pt(rb, a1), t = pt(rb, a0);
        return `M${p[0]} ${p[1]} A${ra} ${ra} 0 0 1 ${q[0]} ${q[1]} L${s[0]} ${s[1]} A${rb} ${rb} 0 0 0 ${t[0]} ${t[1]} Z`; };
      out.push({ inner: { d: ring(r0, r1), t: pt((r0 + r1) / 2, am) }, outer: { d: ring(r1, r2), t: pt((r1 + r2) / 2, am) } });
    }
    return { sec: out, cx, cy, r0 };
  };
  /* 도미노 점 배열(0~6) — 주사위와 같은 규칙, 반쪽 칸 안의 상대 좌표(0~1) */
  GEO.pips = function (n) {
    const q = { l: .27, m: .5, r: .73 };
    const t = { 0: [], 1: [[q.m, q.m]], 2: [[q.l, q.l], [q.r, q.r]], 3: [[q.l, q.l], [q.m, q.m], [q.r, q.r]],
      4: [[q.l, q.l], [q.r, q.l], [q.l, q.r], [q.r, q.r]], 5: [[q.l, q.l], [q.r, q.l], [q.m, q.m], [q.l, q.r], [q.r, q.r]],
      6: [[q.l, q.l], [q.r, q.l], [q.l, q.m], [q.r, q.m], [q.l, q.r], [q.r, q.r]] };
    return t[n] || [];
  };
  /* 수직선 눈금 x(0~9) — 호의 좌표 */
  GEO.hopX = (v, W) => 8 + v * ((W - 16) / 9);

  /* ── 인쇄용 CSS ──────────────────────────────────────────
     색은 화면 위젯(7-9.css·7-9.widgets.js)의 것을 그대로 쓴다 — 숫자 #0E2C57, 선 #16417c, 빈칸 점선 #C9A063,
     칸 바탕 #fffaf0, 지붕·기호 #fff3c9, 꼭지점·가운데 #e7ebf4. 흑백 프린터에서도 칸이 남도록 칸 테두리는
     화면의 연한 #e3d3ac 대신 같은 계열의 #C9A063 을 쓰고, 글자는 진한 남색으로 둔다. */
  const css = document.createElement('style');
  css.id = 'nm-nl-g79-style';
  css.textContent = `
.nm-nl [class*="nm-nl-g79"], .nm-nl .nm-nl-g79-tbl td, .nm-nl .nm-nl-g79-tbl th { -webkit-print-color-adjust:exact; print-color-adjust:exact; }
.nm-nl .nm-nl-g79-eq { display:flex; align-items:center; justify-content:center; gap:1.4mm; font-size:19px; font-weight:800; color:${INK}; flex-wrap:wrap; }
.nm-nl .nm-nl-g79-n { display:inline-flex; align-items:center; justify-content:center; min-width:7mm; height:9mm; font-variant-numeric:tabular-nums; color:${INK}; }
.nm-nl .nm-nl-g79-n.op { color:${SUB}; }
.nm-nl .nm-nl-g79-bl { position:relative; display:inline-flex; align-items:flex-start; justify-content:flex-start; width:10mm; height:9.5mm; box-sizing:border-box; border:2px dashed ${GOLD}; border-radius:2mm; background:${CREAM}; font-size:8px; font-weight:800; color:${GOLD}; padding:.3mm .6mm; line-height:1; }
.nm-nl .nm-nl-g79-bl.rnd { border-radius:50%; align-items:center; justify-content:center; padding:0; }
.nm-nl .nm-nl-g79-ico { display:inline-block; width:9mm; height:9mm; vertical-align:middle; }
.nm-nl .nm-nl-g79-ico svg { display:block; width:100%; height:100%; }
.nm-nl .nm-nl-g79-ico.s { width:6.4mm; height:6.4mm; }
.nm-nl .nm-nl-g79-chips { display:flex; flex-wrap:wrap; justify-content:center; gap:1.6mm; max-width:52mm; }
.nm-nl .nm-nl-g79-chip { display:inline-flex; align-items:center; gap:1mm; padding:1mm 2.2mm; border:1.4px solid ${GOLD}; border-radius:2mm; font-size:15px; font-weight:800; color:${INK}; background:#fff; }
.nm-nl .nm-nl-g79-chip .nm-nl-g79-ico { width:6mm; height:6mm; }
.nm-nl .nm-nl-g79-chip .rk { display:inline-block; width:5mm; height:5mm; border:1.4px dashed ${GOLD}; border-radius:1mm; margin-left:.5mm; background:${CREAM}; }
.nm-nl .nm-nl-g79-vert { display:inline-flex; flex-direction:column; align-items:flex-end; font-size:21px; font-weight:800; gap:.4mm; color:${INK}; }
.nm-nl .nm-nl-g79-vert .r { display:flex; align-items:center; gap:1.5mm; }
.nm-nl .nm-nl-g79-vert .ln { align-self:stretch; border-top:2px solid ${INK}; margin:.4mm 0; }
.nm-nl .nm-nl-g79-row { display:flex; align-items:center; justify-content:center; gap:3mm; flex-wrap:wrap; }
.nm-nl .nm-nl-g79-tag { position:relative; display:inline-flex; flex-direction:column; align-items:center; font-size:12px; font-weight:800; color:${INK}; }
.nm-nl .nm-nl-g79-tag > span:last-child { padding:.1mm 1.6mm; border:1.3px solid ${GOLD}; border-radius:3mm; background:#fff; }
.nm-nl .nm-nl-g79-box { display:inline-flex; flex-wrap:wrap; justify-content:center; align-items:center; gap:.6mm; min-width:14mm; padding:1.2mm 1.6mm; border:1.4px solid ${GOLD}; border-radius:2.4mm; background:${CREAM}; }
.nm-nl .nm-nl-g79-mid { font-size:13px; font-weight:800; color:${SUB}; }
.nm-nl .nm-nl-g79-tile { display:inline-block; vertical-align:middle; }
.nm-nl .nm-nl-g79-svg { display:block; max-width:100%; height:auto; }
.nm-nl .nm-nl-g79-svg text { font-family:inherit; }
.nm-nl .nm-nl-g79-cap { font-size:13px; font-weight:800; color:${INK}; }
.nm-nl .nm-nl-g79-cap.arr { color:${GOLD}; font-size:15px; }
.nm-nl .nm-nl-g79-cap .add { color:${ADD}; } .nm-nl .nm-nl-g79-cap .sub { color:${SUBC}; }
.nm-nl .nm-nl-g79-area { width:48mm; height:11mm; border:1.4px dashed ${GOLD}; border-radius:2mm; background:${CREAM}; display:flex; align-items:center; gap:1.2mm; padding:0 2mm; box-sizing:border-box; }
.nm-nl .nm-nl-g79-dot { display:inline-block; width:5.4mm; height:5.4mm; border-radius:50%; background:${LINE}; }
.nm-nl .nm-nl-g79-pos { position:relative; width:var(--w,52mm); height:var(--h,40mm); }
.nm-nl .nm-nl-g79-pos > span { position:absolute; transform:translate(-50%,-50%); }
.nm-nl .nm-nl-g79-pn { display:inline-flex; align-items:center; justify-content:center; min-width:7.4mm; height:7.4mm; padding:0 .8mm; border:1.4px solid ${GOLD}; border-radius:50%; background:#fff; font-size:15px; font-weight:800; color:${INK}; box-sizing:border-box; }
.nm-nl .nm-nl-g79-pn.sq { border-radius:1.4mm; }
.nm-nl .nm-nl-g79-grid { display:grid; border:1.6px solid ${GOLD}; background:${CREAM}; }
.nm-nl .nm-nl-g79-grid > span { display:flex; align-items:center; justify-content:center; border:1px solid ${GOLD}; font-size:16px; font-weight:800; color:${INK}; box-sizing:border-box; }
.nm-nl .nm-nl-g79-cards { display:flex; flex-wrap:wrap; justify-content:center; gap:1.6mm; max-width:52mm; }
.nm-nl .nm-nl-g79-card { display:inline-flex; align-items:center; justify-content:center; width:8.4mm; height:11mm; border:1.4px solid ${GOLD}; border-radius:1.6mm; font-size:18px; font-weight:800; color:${INK}; background:#fff; }
.nm-nl .nm-nl-g79-tbl { border-collapse:separate; border-spacing:.8mm; font-size:16px; font-weight:800; color:${INK}; }
.nm-nl .nm-nl-g79-tbl td { height:5.6mm; min-width:7mm; padding:0 1mm; text-align:center; border:1.3px solid ${GOLD}; border-radius:1.2mm; background:${CREAM}; box-sizing:border-box; }
.nm-nl .nm-nl-g79-tbl td.bk { border:1.8px dashed ${GOLD}; background:#fff; }
.nm-nl .nm-nl-g79-tbl td.bk > span { font-size:10px; font-weight:800; color:${GOLD}; }
.nm-nl .nm-nl-g79-tbl td.ar { border:0; background:none; min-width:4mm; padding:0; color:${GOLD}; }
.nm-nl .nm-nl-g79-tbl.code td { border:0; border-radius:0; background:${CREAM}; }
.nm-nl .nm-nl-g79-tbl.code .ans { display:inline-block; width:9mm; height:5mm; border:1.4px dashed ${GOLD}; border-radius:1.4mm; background:#fff; vertical-align:middle; }
.nm-nl .nm-nl-g79-tbl.opg { border:1.6px solid ${GOLD}; border-radius:2mm; background:${CREAM}; }
.nm-nl .nm-nl-g79-tbl.opg td { background:#fff; }
.nm-nl .nm-nl-g79-tbl.opg td.bk { background:${CREAM}; }
.nm-nl .nm-nl-g79-pyr { display:flex; flex-direction:column; align-items:center; gap:.5mm; }
.nm-nl .nm-nl-g79-pyr > div { display:flex; gap:.8mm; }
.nm-nl .nm-nl-g79-pyr span { display:inline-flex; align-items:center; justify-content:center; width:6.8mm; height:5.2mm; border:1.3px solid ${GOLD}; border-radius:1mm; font-size:14px; font-weight:800; color:${INK}; background:#fdfbf5; box-sizing:border-box; }
.nm-nl .nm-nl-g79-pyr span.bk { border:1.8px dashed ${GOLD}; background:${CREAM}; }
.nm-nl .nm-nl-g79-tbl th { border:1.4px solid ${GOLD}; border-radius:99px; text-align:center; padding:.2mm 1mm; min-width:8mm; height:7mm; box-sizing:border-box; background:${BUTTER}; font-size:12px; color:${INK}; }
.nm-nl .nm-nl-g79-tbl th.e { border:0; background:none; }
.nm-nl .nm-nl-g79-beads { display:flex; align-items:center; gap:.4mm; }
.nm-nl .nm-nl-g79-beads .str { display:inline-block; width:2mm; border-top:1.6px solid #8a6a3a; }
.nm-nl .nm-nl-g79-hidebox { display:inline-flex; align-items:center; justify-content:center; width:15mm; height:8.6mm; border:1.6px solid ${LINE}; border-radius:1.4mm; background:repeating-linear-gradient(135deg,#fff 0 1.4mm,#e4e8f2 1.4mm 2.4mm); font-size:15px; font-weight:800; color:${LINE}; }
.nm-nl .nm-nl-g79-mb .nm-nl-mach { border-color:${LINE}; background:${MIST}; color:${LINE}; }
.nm-nl .nm-nl-g79-mb .nm-nl-cell { border-color:${GOLD}; background:${CREAM}; color:${INK}; }
.nm-nl .nm-nl-g79-mb .nm-nl-g79-bl { width:9.5mm; }
.nm-nl .nm-nl-g79-mb .nm-nl-arrow { color:${GOLD}; }
.nm-nl .nm-nl-g79-sm .nm-nl-mcard { border-color:${GOLD}; background:#fff; color:${INK}; }
.nm-nl .nm-nl-g79-sm .nm-nl-tag { color:${SUB}; font-weight:800; }
`;
  document.head.appendChild(css);

  /* ── 작은 부품 ─────────────────────────────────────────── */
  const C = (K, i) => K.NL_CIRC[i] || String(i + 1);
  const numC = v => `<span class="nm-nl-g79-n">${v}</span>`;
  const blankC = (idx, K, rnd) => `<span class="nm-nl-g79-bl${rnd ? ' rnd' : ''}">${idx != null ? C(K, idx) : ''}</span>`;
  const ico = (K, tok, small) => `<span class="nm-nl-g79-ico${small ? ' s' : ''}">${K.nlObjHtml(tok)}</span>`;
  const opTxt = op => op === '-' ? MN : op;
  const listLabel = (p, K) => (Array.isArray(p.solution) ? p.solution.map((v, i) => `${C(K, i)} ${v}`).join('  ') : null);

  /* 식 한 줄 — 빈칸 한 개(또는 부호). 값 대신 기호 그림(symA·symB)이 올 수 있다 */
  function eqRow(p, K, opt) {
    opt = opt || {};
    const e = p.eq, bk = p.blank;
    const cell = (k) => {
      if (bk === k) return blankC(null, K);
      if (k === 'a' && e.symA) return ico(K, e.symA);
      if (k === 'b' && e.symB) return ico(K, e.symB);
      return numC(e[k]);
    };
    const op = bk === 'op' ? `<span class="nm-nl-g79-bl rnd" style="width:8.6mm;height:8.6mm"></span>` : `<span class="nm-nl-g79-n op" style="min-width:5mm">${opTxt(e.op)}</span>`;
    return `<div class="nm-nl-g79-eq">${cell('a')}${op}${cell('b')}<span class="nm-nl-g79-n op" style="min-width:5mm">=</span>${cell('c')}</div>`;
  }
  function vertEq(p, K, diceSlot) {
    const e = p.eq, bk = p.blank;
    const cell = k => {
      if (bk === k) return blankC(null, K);
      if (p.scene && p.scene.kind === 'dice' && p.scene.slot === k) return ico(K, 'die' + p.scene.face);
      return numC(e[k]);
    };
    return `<div class="nm-nl-g79-vert"><div class="r"><span class="nm-nl-g79-n" style="min-width:5mm"></span>${cell('a')}</div>`
      + `<div class="r"><span class="nm-nl-g79-n op" style="min-width:5mm">${opTxt(e.op)}</span>${cell('b')}</div><div class="ln"></div>`
      + `<div class="r"><span class="nm-nl-g79-n" style="min-width:5mm"></span>${cell('c')}</div></div>`;
  }
  /* 도미노 타일 SVG — 반쪽 하나가 비면(hidden) 점을 그리지 않고 점선 */
  function dominoSvg(a, b, hidden) {
    const w = 30, h = 15, pip = (cx, cy, n) => GEO.pips(n).map(q => `<circle cx="${(cx + q[0] * 15).toFixed(1)}" cy="${(cy + q[1] * 15).toFixed(1)}" r="1.5" fill="${PIP}" stroke="none"/>`).join('');
    const empty = side => hidden === side ? `<rect x="${side === 'a' ? 1.5 : 16.5}" y="1.5" width="12" height="12" rx="1.5" fill="${CREAM}" stroke="${GOLD}" stroke-dasharray="1.6 1.4" stroke-width="1"/><text x="${side === 'a' ? 7.5 : 22.5}" y="10.6" text-anchor="middle" style="font-size:8.5px;font-weight:900;fill:${GOLD}">?</text>` : '';
    return `<svg class="nm-nl-g79-tile nm-obj-svg" viewBox="0 0 ${w} ${h}" width="30mm" height="15mm" role="img"><rect x=".7" y=".7" width="${w - 1.4}" height="${h - 1.4}" rx="2.4" fill="#fff" stroke="${LINE}" stroke-width="1.2"/>`
      + `<line x1="15" y1="1.6" x2="15" y2="13.4" stroke="${LINE}" stroke-width="1"/>` + (hidden === 'a' ? '' : pip(0, 0, a)) + (hidden === 'b' ? '' : pip(15, 0, b)) + empty('a') + empty('b') + `</svg>`;
  }

  /* ── eqFill ───────────────────────────────────────────── */
  NM_NL_PRINT.eqFill = {
    visual(p, K) {
      const sc = p.scene, e = p.eq, EA = K.EA;
      let inner = '';
      if (sc && sc.kind === 'dice') return K.nlCard(K.nlStage(vertEq(p, K)), '');
      if (sc && sc.kind === 'price') {
        const it = sc.items.map(x => `<span class="nm-nl-g79-tag">${ico(K, x.e)}<span>${x.price}${K.lk('원', '', '元')}</span></span>`).join('<span class="nm-nl-g79-n op" style="min-width:3mm">+</span>');
        return K.nlCard(K.nlStage(`<div class="nm-nl-g79-row">${it}</div>`), K.nlAnsBox(K.lk('원', 'coins', '元')));
      }
      if (sc && sc.kind === 'domino') {
        const cap = sc.hidden ? `<span class="nm-nl-g79-cap">${K.lk('합', 'Total', '合')} ${e.c}</span>` : '';
        return K.nlCard(K.nlStage(`<div class="nm-nl-g79-row">${dominoSvg(sc.a, sc.b, sc.hidden)}${cap}</div>`), K.nlAnsBox(K.EA));
      }
      if (sc && sc.kind === 'legend') {
        const lg = sc.map.map(m => `<span class="nm-nl-g79-tag">${ico(K, m.e, true)}<span>= ${m.v}</span></span>`).join('');
        return K.nlCard(K.nlStage(`<div class="nm-nl-g79-row">${lg}</div>` + eqRow(p, K)));
      }
      if (sc && sc.kind === 'dots') {
        const given = Array.from({ length: sc.given }, () => '<span class="nm-nl-g79-dot"></span>').join('');
        return K.nlCard(K.nlStage(eqRow(p, K) + `<div class="nm-nl-g79-area">${given}</div>`
          + `<span class="nm-nl-g79-cap">${K.lk('○를 더 그려 넣어요', 'Draw more circles', '再画上○')}</span>`));
      }
      if (sc && sc.kind === 'coins') {
        const coins = sc.faces.map(f => ico(K, f === 's' ? 'coin-star' : 'coin-moon', true)).join('');
        return K.nlCard(K.nlStage(`<div class="nm-nl-g79-chips" style="gap:.8mm">${coins}</div>` + eqRow(p, K)));
      }
      if (sc && sc.kind === 'group2') {
        const g = x => `<span class="nm-nl-g79-box">${Array.from({ length: x.n }, () => ico(K, x.e, true)).join('')}</span>`;
        return K.nlCard(K.nlStage(`<div class="nm-nl-g79-row" style="gap:2mm">${g(sc.a)}${g(sc.b)}</div>` + eqRow(p, K)));
      }
      if (p.given) {
        const g = p.given;
        const gl = `<div class="nm-nl-g79-eq">${numC(g.a)}<span class="nm-nl-g79-n op" style="min-width:5mm">${opTxt(g.op)}</span>${numC(g.b)}<span class="nm-nl-g79-n op" style="min-width:5mm">=</span>${numC(g.c)}</div>`;
        return K.nlCard(K.nlStage(gl + `<span class="nm-nl-g79-cap arr">⇩</span>` + eqRow(p, K)));
      }
      if (p.layout === 'v') inner = `<div class="nm-nl-g79-row">${vertEq(p, K)}</div>`; else inner = eqRow(p, K);
      return K.nlCard(K.nlStage(inner));
    },
    label(p, K) {
      if (p.blank === 'op') return p.opTrue === '+' ? '+' : p.opTrue === '-' ? MN : '✕';
      return null;
    },
    ask(p, K) {
      let s = String(K.pickL(p.prompt) || '');
      const sub = [['돋보기가 가린 기호는 더하기(+)일까요, 빼기(−)일까요?', '돋보기가 가린 기호를 써요. +일까요, −일까요?'],
        ['가려진 기호가 +인지 −인지 찾아요. 어느 쪽도 맞지 않으면 ✕를 눌러요', '가려진 기호를 써요. + 또는 −, 어느 쪽도 안 맞으면 ✕를 써요'],
        ['The magnifier hides a sign. Is it + or −?', 'Write the sign the magnifier hides: + or −.'],
        ['Is the hidden sign + or −? Pick ✕ if neither works.', 'Write the hidden sign (+ or −), or ✕ if neither works.'],
        ['放大镜遮住了符号，是＋还是－？', '写出放大镜遮住的符号：＋还是－。'],
        ['找出被遮住的符号是＋还是－；哪个都不对就选✕。', '写出被遮住的符号（＋或－），哪个都不对就写✕。']];
      sub.forEach(([a, b]) => { if (s === a) s = b; });
      return s.replace('주사위를 굴려 나온 수와 더해요', '주사위의 눈과 더해요').replace('주사위를 굴려 나온 수로 빼요', '주사위의 눈으로 빼요')
        .replace('Roll the die, then add the number it shows.', 'Add the number the die shows.').replace('Roll the die, then subtract using the number it shows.', 'Subtract using the number the die shows.')
        .replace('掷骰子，再和点数相加', '和骰子的点数相加').replace('掷骰子，再用点数相减', '用骰子的点数相减')
        .replace('나온 그림을 보고', '나온 그림을 보고').replace('식에 맞게 ○를 더 놓아요', '식에 맞게 ○를 더 그려요')
        .replace('Add more circles to make the sum true', 'Draw more circles to make the sum true').replace('按算式再放上○', '按算式再画上○');
    }
  };

  /* ── valuePick ────────────────────────────────────────── */
  NM_NL_PRINT.valuePick = {
    visual(p, K) {
      const chips = p.chips.map(c => `<span class="nm-nl-g79-chip">${c.e ? ico(K, c.e) : ''}${K.esc(c.txt)}${p.mode === 'order' ? '<i class="rk"></i>' : ''}</span>`).join('');
      return K.nlCard(K.nlStage(`<div class="nm-nl-g79-chips">${chips}</div>`), p.mode === 'count' ? K.nlAnsBox(K.EA) : '');
    },
    label(p, K) {
      if (p.mode === 'count') return null;
      if (p.mode === 'order') return p.chips.slice().sort((a, b) => a.rank - b.rank).map(c => `${c.e || ''}${c.txt}`).join(' > ');
      return p.chips.filter(c => c.ok).map(c => c.txt).join(', ');
    },
    ask(p, K) {
      let s = String(K.pickL(p.prompt) || '');
      return s.replace('모두 골라 세어 봐요', '모두 ○표 하고 세어 봐요').replace('모두 골라요', '모두 ○표 해요').replace('골라요', '○표 해요')
        .replace('합이 큰 것부터 차례로 눌러요', '합이 큰 것부터 차례로 1, 2, 3, 4를 써요')
        .replace('Pick them all and count', 'Circle them all and count').replace('Pick every', 'Circle every').replace('Pick the', 'Circle the')
        .replace('Tap the pairs from the biggest sum to the smallest', 'Number the pairs 1, 2, 3, 4 from the biggest sum to the smallest')
        .replace('把它们都选出来数一数', '把它们都圈出来数一数').replace('选出', '圈出').replace('按和从大到小的顺序点一点', '按和从大到小的顺序写上1、2、3、4');
    }
  };

  /* ── hopLine ──────────────────────────────────────────── */
  NM_NL_PRINT.hopLine = {
    visual(p, K) {
      const W = 100, H = 40, y0 = 28, X = v => GEO.hopX(v, W);
      let s = `<line x1="4" y1="${y0}" x2="${W - 4}" y2="${y0}" stroke="${LINE}" stroke-width="1.3" stroke-linecap="round"/>`;
      for (let v = 0; v <= 9; v++) s += `<line x1="${X(v).toFixed(1)}" y1="${y0 - 2}" x2="${X(v).toFixed(1)}" y2="${y0 + 2}" stroke="${LINE}" stroke-width="1"/><text x="${X(v).toFixed(1)}" y="${y0 + 9}" text-anchor="middle" style="font-size:6.4px;font-weight:800;fill:${INK}">${v}</text>`;
      if (p.mode === 'read') {
        p.hops.forEach((h, i) => {
          if (h.from === h.to) return;
          const x1 = X(h.from), x2 = X(h.to), mx = (x1 + x2) / 2, up = 17 - i * 3, dir = x2 > x1 ? 1 : -1;
          const col = ARC[i ? 1 : 0];
          s += `<path d="M${x1.toFixed(1)} ${y0} Q${mx.toFixed(1)} ${(y0 - up * 1.6).toFixed(1)} ${x2.toFixed(1)} ${y0}" fill="none" stroke="${col}" stroke-width="1.5" stroke-linecap="round"${i ? ' stroke-dasharray="2.6 1.6"' : ''}/>`
            + `<polygon points="${x2.toFixed(1)},${y0} ${(x2 - 3.4 * dir).toFixed(1)},${(y0 - 3.2).toFixed(1)} ${(x2 - 0.6 * dir).toFixed(1)},${(y0 - 4.2).toFixed(1)}" fill="${col}" stroke="none"/>`;
        });
      }
      const e = p.eq;
      const cell = k => (p.blank === k || (p.blank === 'ab' && (k === 'a' || k === 'b'))) ? blankC(null, K) : numC(e[k]);
      const eq = `<div class="nm-nl-g79-eq">${cell('a')}<span class="nm-nl-g79-n op" style="min-width:5mm">${opTxt(e.op)}</span>${cell('b')}<span class="nm-nl-g79-n op" style="min-width:5mm">=</span>${cell('c')}</div>`;
      return K.nlCard(K.nlStage(`<svg class="nm-nl-g79-svg nm-obj-svg" viewBox="0 0 ${W} ${H}" width="54mm" role="img">${s}</svg>${eq}`));
    },
    label(p, K) {
      if (p.free) { const a = p.range[0], c = p.eq.c; return p.eq.op === '+' ? `${a}+${c - a}=${c}` : `${a}${MN}${a - c}=${c}`; }
      return null;
    },
    ask(p, K) {
      return String(K.pickL(p.prompt) || '').replace('눈금 위에서 뛰어 □ 두 칸을 채워요. 아무 수나 괜찮아요', '눈금 위에 호를 그리고 □ 두 칸을 채워요. 맞는 수면 아무거나 괜찮아요')
        .replace('눈금 위에서 뛰는 길을 그리고 빈 칸을 채워요', '눈금 위에 뛰는 길(호)을 그리고 빈 칸을 채워요')
        .replace('Hop on the number line to fill both boxes. Any answer that works is fine.', 'Draw the hops on the number line and fill both boxes. Any answer that works is fine.')
        .replace('Draw the hops on the number line, then fill the box.', 'Draw the hops on the number line, then fill the box.')
        .replace('在数轴上跳一跳，把两个□填出来，只要成立就行。', '在数轴上画出跳的路线，把两个□填出来，只要成立就行。');
    }
  };

  /* ── pairFind ─────────────────────────────────────────── */
  const GR = ['', ''];
  NM_NL_PRINT.pairFind = {
    visual(p, K) {
      const it = p.items;
      if (p.layout === 'ring') {
        const shape = p.shape === 'circle'
          ? `<ellipse cx="50" cy="50" rx="38" ry="38" fill="none" stroke="${GUIDE}" stroke-width="1" stroke-dasharray="1.4 1.2" vector-effect="non-scaling-stroke"/>`
          : `<rect x="12" y="12" width="76" height="76" fill="none" stroke="${GUIDE}" stroke-width="1" stroke-dasharray="1.4 1.2" vector-effect="non-scaling-stroke"/>`;
        const nums = it.map(x => `<span style="left:${x.x}%;top:${x.y}%"><span class="nm-nl-g79-pn">${x.v}</span></span>`).join('');
        return K.nlCard(K.nlStage(`<div class="nm-nl-g79-pos" style="--w:40mm;--h:40mm"><svg class="nm-obj-svg" viewBox="0 0 100 100" style="position:absolute;inset:0;width:100%;height:100%">${shape}</svg>${nums}</div>`));
      }
      if (p.layout === 'scatter') {
        const nums = it.map(x => `<span style="left:${x.x}%;top:${x.y}%;transform:translate(-50%,-50%) rotate(${x.r | 0}deg) scale(${x.s})"><span class="nm-nl-g79-ico" style="width:7.4mm;height:8.6mm">${K.nlObjHtml('num:' + x.v, x.f)}</span></span>`).join('');
        return K.nlCard(K.nlStage(`<div class="nm-nl-g79-pos" style="--w:54mm;--h:42mm">${nums}</div>`));
      }
      if (p.layout === 'grid') {
        const sz = p.size, cell = sz === 2 ? 10 : 7.6;
        const cells = it.map(x => `<span>${x.v}</span>`).join('');
        const fish = false && p.skin === 'fish' ? `<span class="nm-nl-g79-cap" style="display:inline-flex;align-items:center;gap:1mm">${ico(K, '🐟', true)}</span>` : '';
        return K.nlCard(K.nlStage(`<div class="nm-nl-g79-grid" style="grid-template-columns:repeat(${sz},${cell}mm);grid-auto-rows:${cell}mm">${cells}</div>${fish}`));
      }
      if (p.layout === 'row') {
        const w = Math.min(8.4, 64 / it.length);
        return K.nlCard(K.nlStage(`<div class="nm-nl-g79-row" style="gap:0;flex-wrap:nowrap">${it.map(x => `<span class="nm-nl-g79-card" style="width:${w}mm;height:9mm;border-radius:1mm;margin-left:-1.3px;font-size:${it.length > 9 ? 15 : 17}px">${x.v}</span>`).join('')}</div>`));
      }
      const eqs = p.showEq ? `<div class="nm-nl-g79-row" style="gap:2mm">${Array.from({ length: Math.min(p.need, 4) }, () => '<span class="nm-nl-g79-bl" style="width:20mm;height:8mm"></span>').join('')}</div>` : '';
      return K.nlCard(K.nlStage(`<div class="nm-nl-g79-cards">${it.map(x => `<span class="nm-nl-g79-card">${x.v}</span>`).join('')}</div>${eqs}`));
    },
    label(p, K) {
      const byId = {}; p.items.forEach(x => { byId[x.id] = x; });
      const posName = x => p.size === 2
        ? K.lk(`${x.r ? '아래' : '위'} ${x.c ? '오른쪽' : '왼쪽'}`, `${x.r ? 'bottom' : 'top'}-${x.c ? 'right' : 'left'}`, `${x.r ? '下' : '上'}${x.c ? '右' : '左'}`)
        : K.lk(`${x.r + 1}행 ${x.c + 1}열`, `row ${x.r + 1}, col ${x.c + 1}`, `第${x.r + 1}行第${x.c + 1}列`);
      const sym = p.rule.op === 'sum' ? '+' : MN;
      return p.solution.map(([a, b]) => {
        const x = byId[a], y = byId[b];
        if (p.layout === 'grid') return `${x.v}(${posName(x)})·${y.v}(${posName(y)})`;
        const hi = Math.max(x.v, y.v), lo = Math.min(x.v, y.v);
        return p.rule.op === 'sum' ? `${x.v}+${y.v}` : `${hi}${MN}${lo}`;
      }).join(', ') + (p.any ? K.lk(' (그 밖에도 가능)', ' (others work too)', '（还有别的答案）') : (p.layout === 'grid' && p.size === 4 ? K.lk(' (그 밖에도 가능)', ' (others work too)', '（还有别的答案）') : ''));
    },
    ask(p, K) {
      let s = String(K.pickL(p.prompt) || '');
      return s.replace('짝지어 이어요', '선으로 이어요').replace('두 수를 선으로 이어요', '두 수를 선으로 이어요')
        .replace('찾아 색칠해요', '찾아 색칠해요').replace('찾아 묶어요', '찾아 ○로 묶어요').replace('두 수를 골라 묶어요', '두 수를 ○로 묶어요')
        .replace('모두 찾아요', '모두 찾아 선으로 이어요').replace('3쌍 이어요', '3쌍을 선으로 이어요').replace('3개 찾아요', '3개 찾아 ○로 묶어요')
        .replace('만들어요', '만들어 써요')
        .replace('Join the two numbers', 'Draw a line to join the two numbers').replace('Find every pair', 'Find every pair and join it with a line')
        .replace('Pick the two numbers', 'Circle the two numbers').replace('Find 3 pairs', 'Circle 3 pairs').replace('Join 3 pairs', 'Join 3 pairs with lines')
        .replace('把和是', '把和是').replace('Pick two cards', 'Pick two cards and write')
        .replace('选出和是', '圈出和是').replace('找出所有和是', '找出并连起所有和是').replace('选两张卡片', '选两张卡片并写出');
    }
  };

  /* ── treeFill ─────────────────────────────────────────── */
  NM_NL_PRINT.treeFill = {
    visual(p, K) {
      const g = GEO.treeLayout(p.nodes, p.flow);
      let s = '';
      p.nodes.forEach(n => { if (n.kids) n.kids.forEach(k => { s += `<line x1="${g.pts[n.id].x.toFixed(1)}" y1="${g.pts[n.id].y.toFixed(1)}" x2="${g.pts[k].x.toFixed(1)}" y2="${g.pts[k].y.toFixed(1)}" stroke="${LINE}" stroke-width="1.8" stroke-linecap="round"/>`; }); });
      p.nodes.forEach(n => {
        const q = g.pts[n.id], bi = p.blanks.indexOf(n.id);
        s += n.v == null
          ? `<circle cx="${q.x.toFixed(1)}" cy="${q.y.toFixed(1)}" r="${g.r}" fill="${CREAM}" stroke="${GOLD}" stroke-width="2.2" stroke-dasharray="3 2.4"/><text x="${q.x.toFixed(1)}" y="${(q.y + 4).toFixed(1)}" text-anchor="middle" style="font-size:11px;font-weight:800;fill:${GOLD}">${C(K, bi)}</text>`
          : `<circle cx="${q.x.toFixed(1)}" cy="${q.y.toFixed(1)}" r="${g.r}" fill="#fff" stroke="${LINE}" stroke-width="1.8"/><text x="${q.x.toFixed(1)}" y="${(q.y + 6).toFixed(1)}" text-anchor="middle" style="font-size:17px;font-weight:800;fill:${INK}">${n.v}</text>`;
      });
      return K.nlCard(K.nlStage(`<svg class="nm-nl-g79-svg nm-obj-svg" viewBox="0 0 ${g.W} ${g.H}" style="height:${p.shape === 'sym4' ? 28 : 34}mm;width:auto" role="img">${s}</svg>`));
    },
    label: listLabel,
    ask(p, K) { return String(K.pickL(p.prompt) || ''); }
  };

  /* ── vertexSum ────────────────────────────────────────── */
  NM_NL_PRINT.vertexSum = {
    visual(p, K) {
      const g = GEO.vertexLayout(p.shape), n = p.shape === 'quad' ? 4 : 3;
      let s = '';
      const outline = g.v.map(q => `${q.x},${q.y}`).join(' ');
      s += `<polygon points="${outline}" fill="none" stroke="${LINE}" stroke-width="1.8" stroke-linejoin="round"/>`;
      const bl = (kind, idx) => p.blanks.findIndex(b => b.kind === kind && b.idx === idx);
      for (let i = 0; i < n; i++) {
        const q = g.v[i], v = p.verts[i], bi = bl('v', i);
        s += `<rect x="${q.x - 17}" y="${q.y - 14}" width="34" height="28" rx="4"${v == null ? ` fill="${CREAM}" stroke="${GOLD}" stroke-width="2.2" stroke-dasharray="3 2.4"` : ` fill="${PALE}" stroke="${LINE}" stroke-width="1.8"`}/>`
          + (v == null ? `<text x="${q.x}" y="${q.y + 4}" text-anchor="middle" style="font-size:11px;font-weight:800;fill:${GOLD}">${C(K, bi)}</text>`
            : `<text x="${q.x}" y="${q.y + 6}" text-anchor="middle" style="font-size:17px;font-weight:800;fill:${INK}">${v}</text>`);
      }
      for (let i = 0; i < n; i++) {
        const q = g.e[i], v = p.edges[i], bi = bl('e', i);
        s += `<circle cx="${q.x}" cy="${q.y}" r="14"${v == null ? ` fill="${CREAM}" stroke="${GOLD}" stroke-width="2.2" stroke-dasharray="3 2.4"` : ` fill="#fff" stroke="${LINE}" stroke-width="1.8"`}/>`
          + (v == null ? `<text x="${q.x}" y="${q.y + 4}" text-anchor="middle" style="font-size:11px;font-weight:800;fill:${GOLD}">${C(K, bi)}</text>`
            : `<text x="${q.x}" y="${q.y + 6}" text-anchor="middle" style="font-size:17px;font-weight:800;fill:${INK}">${v}</text>`);
      }
      return K.nlCard(K.nlStage(`<svg class="nm-nl-g79-svg nm-obj-svg" viewBox="0 0 ${g.W} ${g.H}" style="height:30mm;width:auto" role="img">${s}</svg>`));
    },
    label: listLabel,
    ask(p, K) { return String(K.pickL(p.prompt) || ''); }
  };

  /* ── wheelFill ────────────────────────────────────────── */
  NM_NL_PRINT.wheelFill = {
    visual(p, K) {
      let s = '';
      if (p.mode === 'opposite') {
        GEO.wheelOpposite().forEach((w, i) => {
          const v = p.wedges[i], bi = p.blanks.indexOf(i);
          s += `<path d="${w.d}" fill="${v == null ? CREAM : '#fff'}" stroke="${LINE}" stroke-width="1.8" stroke-linejoin="round"/>`
            + (v == null ? `<text x="${w.tx}" y="${w.ty + 4}" text-anchor="middle" style="font-size:12px;font-weight:800;fill:${GOLD}">${C(K, bi)}</text>` : `<text x="${w.tx}" y="${w.ty + 7}" text-anchor="middle" style="font-size:20px;font-weight:800;fill:${INK}">${v}</text>`);
        });
      } else {
        const g = GEO.wheelSectors();
        g.sec.forEach((sc, i) => {
          [['inner', sc.inner], ['outer', sc.outer]].forEach(([k, part]) => {
            const v = p.sectors[i][k], bi = p.blanks.findIndex(b => b.s === i && b.side === k);
            s += `<path d="${part.d}" fill="${v == null ? CREAM : '#fff'}" stroke="${LINE}" stroke-width="1.8" stroke-linejoin="round"/>`
              + (v == null ? `<text x="${part.t[0]}" y="${part.t[1] + 4}" text-anchor="middle" style="font-size:12px;font-weight:800;fill:${GOLD}">${C(K, bi)}</text>` : `<text x="${part.t[0]}" y="${part.t[1] + 6}" text-anchor="middle" style="font-size:17px;font-weight:800;fill:${INK}">${v}</text>`);
          });
        });
        s += `<circle cx="${g.cx}" cy="${g.cx}" r="${g.r0}" fill="${PALE}" stroke="${LINE}" stroke-width="1.8"/><text x="${g.cx}" y="${g.cx + 7}" text-anchor="middle" style="font-size:20px;font-weight:800;fill:${INK}">${p.center}</text>`;
      }
      return K.nlCard(K.nlStage(`<svg class="nm-nl-g79-svg nm-obj-svg" viewBox="0 0 200 200" style="height:36mm;width:auto" role="img">${s}</svg>`));
    },
    label: listLabel,
    ask(p, K) { return String(K.pickL(p.prompt) || ''); }
  };

  /* ── opGrid ───────────────────────────────────────────── */
  NM_NL_PRINT.opGrid = {
    visual(p, K) {
      const cell = (r, c) => {
        const v = p.g[r][c], bi = p.blanks.findIndex(b => b[0] === r && b[1] === c);
        return v == null ? `<td class="bk"><span>${C(K, bi)}</span></td>` : `<td>${v}</td>`;
      };
      const rows = [0, 1, 2].map(r => `<tr><th style="border:0;background:none;min-width:6mm;font-size:13px">${r === 1 ? '' : ''}</th>${cell(r, 0)}${cell(r, 1)}${cell(r, 2)}</tr>`).join('');
      const head = `<div class="nm-nl-g79-cap" style="display:flex;gap:6mm">${'<span class="add">' + K.lk('가로: 더하기 ＋', 'across: add +', '横：加＋') + '</span><span class="sub">' + K.lk('세로: 빼기 －', 'down: subtract −', '竖：减－') + '</span>'}</div>`;
      return K.nlCard(K.nlStage(head + `<table class="nm-nl-g79-tbl opg"><tbody>${rows.replace(/<th[^>]*><\/th>/g, '')}</tbody></table>`));
    },
    label: listLabel,
    ask(p, K) { return String(K.pickL(p.prompt) || ''); }
  };

  /* ── ruleTable ────────────────────────────────────────── */
  NM_NL_PRINT.ruleTable = {
    visual(p, K) {
      const bi = (pred) => p.blanks.findIndex(pred);
      const cellV = (v, idx) => v == null ? `<td class="bk"><span>${C(K, idx)}</span></td>` : `<td>${v}</td>`;
      if (p.layout === 'house') {
        const roof = `<svg class="nm-nl-g79-svg nm-obj-svg" viewBox="0 0 100 34" width="36mm" role="img"><polygon points="4,32 50,3 96,32" fill="${BUTTER}" stroke="${GOLD}" stroke-width="1.8" stroke-linejoin="round"/><text x="50" y="28" text-anchor="middle" style="font-size:17px;font-weight:800;fill:${INK}">${p.roof[0]}</text></svg>`;
        const rows = p.rows.map((r, i) => `<tr>${cellV(r.in, bi(b => b.row === i && b.side === 'in'))}<td class="ar">→</td>${cellV(r.out, bi(b => b.row === i && b.side === 'out'))}</tr>`).join('');
        return K.nlCard(K.nlStage(roof + `<table class="nm-nl-g79-tbl" style="margin-top:-1mm"><tbody>${rows}</tbody></table>`));
      }
      if (p.layout === 'strip') {
        const top = p.cols.map((c, i) => cellV(c.top, bi(b => b.col === i && b.row === 'top'))).join('');
        const bot = p.cols.map((c, i) => cellV(c.bottom, bi(b => b.col === i && b.row === 'bottom'))).join('');
        return K.nlCard(K.nlStage(`<table class="nm-nl-g79-tbl"><tbody><tr>${top}</tr><tr>${bot}</tr></tbody></table>`));
      }
      const rows = p.rows.map((r, i) => `<tr>${cellV(r.in, bi(b => b.row === i && b.side === 'in'))}${cellV(r.mid, bi(b => b.row === i && b.side === 'mid'))}${cellV(r.out, bi(b => b.row === i && b.side === 'out'))}</tr>`).join('');
      return K.nlCard(K.nlStage(`<table class="nm-nl-g79-tbl"><thead><tr><th class="e"></th><th>${p.roof[0]}</th><th>${p.roof[1]}</th></tr></thead><tbody>${rows}</tbody></table>`));
    },
    label: listLabel,
    ask(p, K) { return String(K.pickL(p.prompt) || ''); }
  };

  /* ── machineBox ───────────────────────────────────────── */
  NM_NL_PRINT.machineBox = {
    visual(p, K) {
      const box = `<span class="nm-nl-mach">${p.kind === 'rule' ? '?' : '⚙'}</span>`;
      const arrow = '<span class="nm-nl-arrow">→</span>';
      const cell = v => v == null ? blankC(null, K) : `<span class="nm-nl-cell nm-nl-num">${v}</span>`;
      const num = v => `<span class="nm-nl-cell nm-nl-num">${v}</span>`;
      let rows = '';
      if (p.kind === 'rule') {
        rows = p.rows.map(r => `<div class="nm-nl-row nm-nl-mrow">${num(r.in)}${arrow}${box}${arrow}${num(r.out)}</div>`).join('')
          + `<div class="nm-nl-row nm-nl-mrow">${cell(p.q.in)}${arrow}${box}${arrow}${cell(p.q.out)}</div>`;
      } else {
        rows = p.rows.map(r => `<div class="nm-nl-row nm-nl-mrow">${num(r.a)}${num(r.b)}${arrow}${box}${arrow}${num(r.out)}</div>`).join('')
          + `<div class="nm-nl-row nm-nl-mrow">${cell(p.q.a)}${cell(p.q.b)}${arrow}${box}${arrow}${cell(p.q.out)}</div>`;
      }
      return K.nlCard(K.nlStage(`<div class="nm-nl-g79-mb">${rows}</div>`));
    },
    label: () => null,
    ask(p, K) { return String(K.pickL(p.prompt) || ''); }
  };

  /* ── hiddenBeads ──────────────────────────────────────── */
  NM_NL_PRINT.hiddenBeads = {
    visual(p, K) {
      const names = ['bead-red', 'bead-blue', 'bead-green', 'bead-yellow'];
      const tokOf = c => names[['#e53935', '#3b8fe0', '#43a047', '#ffd23f'].indexOf(c)] || names[0];
      const sz = p.whole > 7 ? 5.2 : 6;
      const vis = p.colors.slice(0, p.visible).map(c => `<span class="nm-nl-g79-ico" style="width:${sz}mm;height:${sz}mm">${K.nlObjHtml(tokOf(c))}</span>`).join('');
      const beads = `<div class="nm-nl-g79-beads"><span class="str"></span>${vis}<span class="nm-nl-g79-hidebox">?</span><span class="str"></span></div>`;
      const b = p.bond, circ = (x, y, v, idx) => v == null
        ? `<circle cx="${x}" cy="${y}" r="15" fill="${CREAM}" stroke="${GOLD}" stroke-width="2.2" stroke-dasharray="3 2.4"/>`
        : `<circle cx="${x}" cy="${y}" r="15" fill="#fff" stroke="${LINE}" stroke-width="1.8"/><text x="${x}" y="${y + 6}" text-anchor="middle" style="font-size:17px;font-weight:800;fill:${INK}">${v}</text>`;
      const bond = `<svg class="nm-nl-g79-svg nm-obj-svg" viewBox="0 0 120 84" style="height:14mm;width:auto" role="img"><line x1="60" y1="30" x2="32" y2="52" stroke="${LINE}" stroke-width="1.8"/><line x1="60" y1="30" x2="88" y2="52" stroke="${LINE}" stroke-width="1.8"/>${circ(60, 17, b.top)}${circ(30, 66, b.left)}${circ(90, 66, b.right)}</svg>`;
      return K.nlCard(K.nlStage(beads + bond), K.nlAnsBox(K.EA));
    },
    label: () => null,
    ask(p, K) { return String(K.pickL(p.prompt) || ''); }
  };

  /* ── codeBreak ────────────────────────────────────────── */
  NM_NL_PRINT.codeBreak = {
    visual(p, K) {
      const rows = p.symbols.map(s => `<tr><td style="min-width:9mm">${ico(K, s.e, true)}</td><td style="min-width:20mm;font-size:15px">${s.a} ${opTxt(s.op)} ${s.b}</td><td><span class="ans"></span></td></tr>`).join('');
      const digits = p.secret.map(i => p.symbols[i].v).join('  ');
      const slots = p.secret.map(() => '<span class="nm-nl-g79-bl" style="width:8mm;height:8mm"></span>').join('');
      return K.nlCard(K.nlStage(`<table class="nm-nl-g79-tbl code"><tbody>${rows}</tbody></table><div class="nm-nl-g79-cap" style="font-size:18px;letter-spacing:.4mm">${digits}</div><div class="nm-nl-g79-row" style="gap:2mm">${slots}</div>`));
    },
    label(p, K) { return p.secret.map(i => p.symbols[i].e).join(' '); },
    ask(p, K) {
      return K.lk('그림마다 식을 계산해 □를 채우고, 아래 숫자에 맞는 그림을 그려요', 'Fill each □, then draw the pictures that match the numbers.', '算出每个图案的得数填□，再按下面的数字画出图案。');
    }
  };

  /* ── pyramid4 — 4줄 뒤집힌 피라미드(기존 pyramid 인쇄가 3줄 높이라 따로) ── */
  NM_NL_PRINT.pyramid4 = {
    visual(p, K) {
      const rows = p.rows.map(r => `<div>${r.map(v => v == null ? '<span class="bk"></span>' : `<span>${v}</span>`).join('')}</div>`).join('');
      return K.nlCard(K.nlStage(`<div class="nm-nl-g79-pyr">${rows}</div>`));
    },
    label: () => null,
    ask(p, K) { return K.lk('아래 수는 위 두 수의 합이에요. 빈 칸을 채워요', 'Each number is the sum of the two above it. Write the number for the empty box.', '下面的数是上面相邻两个数的和。在空格里填上合适的数。'); }
  };

  /* ── sumMatch ─────────────────────────────────────────── */
  NM_NL_PRINT.sumMatch = {
    visual(p, K) {
      const card = (q, tag) => `<div class="nm-nl-mcard">(${q.p[0]}, ${q.p[1]})${tag ? `<span class="nm-nl-tag">${tag}</span>` : ''}</div>`;
      const Lc = p.left.map(q => card(q)).join(''), Rc = p.right.map((q, i) => card(q, K.NL_CIRC[i])).join('');
      return K.nlCard(K.nlStage(`<div class="nm-nl-match nm-nl-g79-sm"><div class="nm-nl-mcol">${Lc}</div><div class="nm-nl-mgap"></div><div class="nm-nl-mcol">${Rc}</div></div>`));
    },
    label(p, K) { return p.left.map(q => `(${q.p[0]}, ${q.p[1]})→${K.NL_CIRC[p.right.findIndex(r => r.s === q.s)]}`).join('  '); },
    ask(p, K) { return String(K.pickL(p.prompt) || '').replace('선으로 이어요', '선으로 이어요'); }
  };
})();
