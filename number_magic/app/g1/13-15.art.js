/* G1-13-15호 새 소품 + 화면·인쇄 공용 그림 부품.
   · NM_OBJECTS.register('토큰', function(id){ return '<svg 조각>'; }) — viewBox 0 0 64 64, 기존 16종과 같은 젤리 결.
     실사 PNG 는 나중에 data/real-art.js 표('g:weight':'….png')가 덮어쓴다 — 위젯은 항상 art()/NM_OBJECTS.svg 로 그려야 덮인다.
   · window.NM_G1315 — 화면 위젯(widgets.js)과 인쇄(print.js)가 같은 모양을 읽도록 SVG/HTML 문자열을 만드는 함수 모음.
     클래스 접두는 o.pre 로 받는다('nm-g1315' 화면 · 'nm-nl-g1315' 인쇄). 이 파일은 index.html·ws.html 모두에서 로드된다. */
(function () {
  'use strict';
  var O = window.NM_OBJECTS;
  if (O && O.register && O.helpers) {
    var H = O.helpers, P = H.P, defs = H.defs, fill = H.fill, hl = H.hl, sw = H.sw, extra = H.extra;
    var STEEL = ['#f4f7fb', '#aeb9c9', '#4d586c'];

    O.register('g:weight', function (id) {          /* 분동 — 손잡이 달린 금속 원통(숫자는 앱이 얹음) */
      return defs(id, STEEL) +
        '<path d="M14 54 C13 54 12 52 13 50 L19 27 C20 24 22 23 25 23 L39 23 C42 23 44 24 45 27 L51 50 C52 52 51 54 50 54 Z" fill="' + fill(id) + '"' + sw(STEEL, 2.2) + '/>' +
        '<path d="M26 23 C26 17 28 14 32 14 C36 14 38 17 38 23" fill="' + fill(id) + '"' + sw(STEEL, 2.2) + '/>' +
        '<ellipse cx="32" cy="12" rx="6" ry="4.4" fill="' + fill(id) + '"' + sw(STEEL, 2) + '/>' + hl(21, 38, 3, 9, 14);
    });
    O.register('g:scale', function (id) {           /* 양팔저울 — 평평한 상태 */
      var c = P.tan;
      return defs(id, c) +
        '<path d="M32 22 L24 54 L40 54 Z" fill="' + fill(id) + '"' + sw(c) + '/>' +
        '<path d="M8 22 L56 22" fill="none" stroke="' + c[2] + '" stroke-width="3.4" stroke-linecap="round"/>' +
        '<path d="M8 22 L3 38 L13 38 Z M56 22 L51 38 L61 38 Z" fill="none"' + sw(c, 1.8) + '/>' +
        '<path d="M2 38 C2 44 14 44 14 38 Z M50 38 C50 44 62 44 62 38 Z" fill="' + fill(id) + '"' + sw(c, 2) + '/>' +
        '<circle cx="32" cy="22" r="4" fill="' + fill(id) + '"' + sw(c, 1.8) + '/>' + hl(30, 38, 2.2, 8, 10);
    });
    O.register('g:card', function (id) {            /* 숫자 카드 — 빈 카드(숫자는 앱이 얹음) */
      var c = P.white, b = P.blue;
      return defs(id, c) +
        '<rect x="9" y="5" width="46" height="54" rx="8" fill="' + fill(id) + '"' + sw(b, 2.4) + '/>' +
        '<rect x="14" y="10" width="36" height="44" rx="5" fill="none" stroke="' + b[0] + '" stroke-width="1.6"/>' + hl(17, 16, 3, 6, 20);
    });
    O.register('g:traincar', function (id) {        /* 기차 객차 */
      var c = P.orange, k = P.black;
      return defs(id, c) + extra(id, [['k', k]]) +
        '<rect x="5" y="14" width="54" height="30" rx="6" fill="' + fill(id) + '"' + sw(c) + '/>' +
        '<rect x="12" y="20" width="14" height="12" rx="3" fill="#e8f4ff"' + sw(c, 1.6) + '/>' +
        '<rect x="38" y="20" width="14" height="12" rx="3" fill="#e8f4ff"' + sw(c, 1.6) + '/>' +
        '<circle cx="18" cy="48" r="7" fill="url(#k' + id + ')"' + sw(k, 1.8) + '/><circle cx="46" cy="48" r="7" fill="url(#k' + id + ')"' + sw(k, 1.8) + '/>' +
        '<circle cx="18" cy="48" r="2.2" fill="#ddd"/><circle cx="46" cy="48" r="2.2" fill="#ddd"/>' + hl(14, 17, 5, 1.8, -8);
    });
    O.register('g:train', function (id) {           /* 기차 기관차 */
      var c = P.blue, k = P.black, y = P.yellow;
      return defs(id, c) + extra(id, [['k', k], ['y', y]]) +
        '<rect x="4" y="22" width="38" height="22" rx="5" fill="' + fill(id) + '"' + sw(c) + '/>' +
        '<rect x="36" y="10" width="24" height="34" rx="5" fill="' + fill(id) + '"' + sw(c) + '/>' +
        '<rect x="42" y="16" width="12" height="12" rx="3" fill="#e8f4ff"' + sw(c, 1.6) + '/>' +
        '<rect x="9" y="12" width="9" height="12" rx="2" fill="url(#y' + id + ')"' + sw(y, 1.8) + '/>' +
        '<circle cx="15" cy="48" r="7" fill="url(#k' + id + ')"' + sw(k, 1.8) + '/><circle cx="47" cy="48" r="7" fill="url(#k' + id + ')"' + sw(k, 1.8) + '/>' +
        '<circle cx="15" cy="48" r="2.2" fill="#ddd"/><circle cx="47" cy="48" r="2.2" fill="#ddd"/>' + hl(12, 28, 5, 1.8, -8);
    });
    O.register('g:pouch', function (id) {           /* 복주머니 */
      var c = P.red, y = P.yellow;
      return defs(id, c) + extra(id, [['y', y]]) +
        '<path d="M24 14 C20 22 8 30 8 44 C8 56 20 60 32 60 C44 60 56 56 56 44 C56 30 44 22 40 14 Z" fill="' + fill(id) + '"' + sw(c) + '/>' +
        '<path d="M22 14 C27 18 37 18 42 14 C40 8 24 8 22 14 Z" fill="url(#y' + id + ')"' + sw(y, 2) + '/>' +
        '<path d="M26 20 C30 23 34 23 38 20" fill="none"' + sw(y, 1.8) + '/>' +
        '<circle cx="32" cy="42" r="6" fill="url(#y' + id + ')"' + sw(y, 1.8) + '/>' + hl(18, 38, 3, 8, 22);
    });
    O.register('g:target', function (id) {          /* 과녁 — 3겹 동심원(점수 글자 없음) */
      var c = P.red;
      return defs(id, c) +
        '<circle cx="32" cy="32" r="28" fill="' + fill(id) + '"' + sw(c, 2.2) + '/>' +
        '<circle cx="32" cy="32" r="19" fill="#fff"' + sw(c, 2) + '/>' +
        '<circle cx="32" cy="32" r="11" fill="' + fill(id) + '"' + sw(c, 2) + '/>' +
        '<circle cx="32" cy="32" r="4" fill="#fff"/>' + hl(18, 17, 5, 2, -35);
    });
    O.register('g:dartpin', function (id) {         /* 화살 핀 — 한 방향(위쪽 끝이 꽂힌 곳) */
      var c = P.yellow, r = P.red;
      return defs(id, r) + extra(id, [['y', c]]) +
        '<path d="M32 6 L38 26 L26 26 Z" fill="' + fill(id) + '"' + sw(r, 2) + '/>' +
        '<rect x="29.6" y="24" width="4.8" height="26" rx="2.4" fill="url(#y' + id + ')"' + sw(c, 1.8) + '/>' +
        '<path d="M32 44 L22 58 L32 54 L42 58 Z" fill="' + fill(id) + '"' + sw(r, 1.8) + '/>';
    });
    O.register('g:box', function (id) {             /* 골판지 상자(닫힘) */
      var c = P.tan;
      return defs(id, c) +
        '<path d="M6 20 L32 10 L58 20 L58 50 L32 60 L6 50 Z" fill="' + fill(id) + '"' + sw(c) + '/>' +
        '<path d="M6 20 L32 30 L58 20 M32 30 L32 60" fill="none"' + sw(c, 1.8) + '/>' +
        '<path d="M24 14 L32 22 L40 14 L40 20 L32 28 L24 20 Z" fill="#f3d8a3" opacity=".8"/>' + hl(14, 30, 2.5, 7, 8);
    });
    O.register('g:boxopen', function (id) {         /* 골판지 상자(열림) */
      var c = P.tan;
      return defs(id, c) +
        '<path d="M6 30 L32 22 L58 30 L58 54 L32 62 L6 54 Z" fill="' + fill(id) + '"' + sw(c) + '/>' +
        '<path d="M6 30 L2 14 L26 8 L32 22 M58 30 L62 14 L38 8 L32 22" fill="#f3d8a3"' + sw(c, 1.8) + '/>' +
        '<path d="M10 33 L32 27 L54 33 L32 39 Z" fill="#7a4f1d" opacity=".55"/>';
    });
  }

  /* ================== 공용 그림 부품 ================== */
  var G = window.NM_G1315 = {};
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  G.esc = esc;
  var INK = '#1F2A3A';

  /* ── 겹친 도형(overlapSum) ── p.geom/p.regions/p.vb. o.print · o.pre · o.fillAsk(값으로 채움) · o.hiSet(강조 도형 index) */
  G.overlapSvg = function (p, o) {
    o = o || {}; var pre = o.pre || 'nm-g1315', pr = !!o.print;
    var W = p.vb[0], Hh = p.vb[1], s = '<svg class="' + pre + '-ov" viewBox="0 0 ' + W + ' ' + Hh + '" role="img" aria-label="' + esc(o.label || '') + '">';
    var fills = ['rgba(59,143,224,.20)', 'rgba(251,140,46,.22)', 'rgba(67,160,71,.20)'];
    var strokes = ['#3b8fe0', '#e07a1e', '#3c9a43'];
    p.geom.forEach(function (g, i) {
      var on = o.hiSet === i;
      var attr = pr ? ' fill="none" stroke="' + INK + '" stroke-width="1.3"' + (i === 1 ? ' stroke-dasharray="3 2"' : '')
        : ' fill="' + fills[i] + '" stroke="' + strokes[i] + '" stroke-width="' + (on ? 2.6 : 1.4) + '"';
      s += g.k === 'rect'
        ? '<rect class="' + pre + '-ovs" x="' + g.x + '" y="' + g.y + '" width="' + g.w + '" height="' + g.h + '" rx="3"' + attr + '/>'
        : '<circle class="' + pre + '-ovs" cx="' + g.cx + '" cy="' + g.cy + '" r="' + g.r + '"' + attr + '/>';
    });
    p.regions.forEach(function (r) {
      var x = r.at[0], y = r.at[1];
      var shown = r.v != null ? r.v : (o.fillAsk != null && r.id === p.askId ? o.fillAsk : null);
      if (shown != null) {
        s += '<text class="' + pre + '-ovn' + (r.v == null ? ' ' + pre + '-found' : '') + '" x="' + x + '" y="' + (y + 3.4) + '" text-anchor="middle">' + shown + '</text>';
      } else if (pr) {
        s += '<rect x="' + (x - 6) + '" y="' + (y - 6) + '" width="12" height="12" rx="2" fill="#fff" stroke="' + INK + '" stroke-width="1.3" stroke-dasharray="2.4 1.6"/>';
      } else {
        s += '<rect class="' + pre + '-ovb" x="' + (x - 6.5) + '" y="' + (y - 6.5) + '" width="13" height="13" rx="3"/><text class="' + pre + '-ovq" x="' + x + '" y="' + (y + 3.4) + '" text-anchor="middle">?</text>';
      }
      if (!pr) s += '<circle class="' + pre + '-ovhit" data-r="' + r.id + '" cx="' + x + '" cy="' + y + '" r="7.5" fill="transparent"/>';
    });
    return s + '</svg>';
  };

  /* ── 막대 기호(rodNumeral) — 1~5 = 막대 n개, 6~9 = 위 가로 막대(5) + 나머지 막대 ── */
  G.rodGlyph = function (n, o) {
    o = o || {};
    var col = o.print ? INK : '#16417c';
    var top = n >= 6, k = top ? n - 5 : n;
    var s = '<svg class="' + (o.pre || 'nm-g1315') + '-rod" viewBox="0 0 40 40" aria-hidden="true">';
    if (top) s += '<rect x="5" y="4" width="30" height="5" rx="2.5" fill="' + col + '"/>';
    var x0 = 20 - (k - 1) * 4.2, y0 = top ? 14 : 6, y1 = 36;
    for (var i = 0; i < k; i++) s += '<rect x="' + (x0 + i * 8.4 - 2) + '" y="' + y0 + '" width="4" height="' + (y1 - y0) + '" rx="2" fill="' + col + '"/>';
    return s + '</svg>';
  };

  /* ── 과녁(dartTarget) — 반지름 1 = 바깥 원. 안쪽 3점·가운데 띠 2점·바깥 띠 1점 ── */
  var RINGS = [{ s: 1, r0: 0.62, r1: 1 }, { s: 2, r0: 0.3, r1: 0.62 }, { s: 3, r0: 0, r1: 0.3 }];
  G.dartSvg = function (p, o) {
    o = o || {}; var pre = o.pre || 'nm-g1315', pr = !!o.print, R0 = 46, cx = 56, cy = 54;
    var s = '<svg class="' + pre + '-dart" viewBox="0 0 112 108" role="img" aria-label="' + esc(o.label || '') + '">';
    var fl = pr ? ['#fff', '#fff', '#fff'] : ['#ffd9d4', '#fff', '#ff8a80'];
    var st = pr ? INK : '#c0392b';
    [[R0, 1, fl[0]], [R0 * 0.62, 2, fl[1]], [R0 * 0.3, 3, fl[2]]].forEach(function (a) {
      s += '<circle class="' + pre + '-ring" data-s="' + a[1] + '" cx="' + cx + '" cy="' + cy + '" r="' + a[0] + '" fill="' + a[2] + '" stroke="' + st + '" stroke-width="' + (pr ? 1.3 : 1.8) + '"/>';
    });
    /* 점수 글자 — 각 띠 위쪽 */
    [[1, R0 * 0.81], [2, R0 * 0.46], [3, 0]].forEach(function (a) {
      s += '<text class="' + pre + '-rn" x="' + cx + '" y="' + (cy - a[1] + (a[0] === 3 ? 4 : 3.5)) + '" text-anchor="middle">' + a[0] + '</text>';
    });
    (p.hits || []).forEach(function (h) {
      var a = h.ang * Math.PI / 180, x = cx + Math.cos(a) * h.r * R0, y = cy + Math.sin(a) * h.r * R0;
      s += pr ? '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="3" fill="' + INK + '"/><circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="5" fill="none" stroke="' + INK + '" stroke-width="1"/>'
        : '<circle class="' + pre + '-pin" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="3.6" fill="#1a2233"/><circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="1.3" fill="#ffe27a"/>';
    });
    return s + '</svg>';
  };

  /* ── 화살표 사슬(arrowChain) — 노드 좌표, 화살표 선(실선/점선/숫자 라벨) ── */
  G.chainLayout = function (layout, n) {
    var pts = [], i;
    if (layout === 'loop') {
      for (i = 0; i < n; i++) { var a = -Math.PI / 2 + i * 2 * Math.PI / n; pts.push([50 + 30 * Math.cos(a), 40 + 28 * Math.sin(a)]); }
      return { pts: pts, vb: [100, 80] };
    }
    if (layout === 'snake') {
      var top = Math.ceil(n / 2);
      for (i = 0; i < n; i++) pts.push(i < top ? [18 + i * (64 / Math.max(1, top - 1)), 20] : [18 + (top - 1 - (i - top)) * (64 / Math.max(1, top - 1)), 62]);
      /* 아래 줄은 오른쪽에서 왼쪽으로 */
      return { pts: pts, vb: [100, 80] };
    }
    for (i = 0; i < n; i++) pts.push([9 + i * (82 / (n - 1)), 30]);
    return { pts: pts, vb: [100, 60] };
  };
  /* o.vals = 노드별 표시값(null = 빈 원), o.cur = 지금 채울 노드 index, o.ruleBlank = 규칙 찾기에서 legend 숫자 숨김 */
  G.chainSvg = function (p, o) {
    o = o || {}; var pre = o.pre || 'nm-g1315', pr = !!o.print;
    var L = G.chainLayout(p.layout, p.nodes.length), pts = L.pts, n = pts.length, R0 = 6.9;
    var s = '<svg class="' + pre + '-chain" viewBox="0 0 ' + L.vb[0] + ' ' + L.vb[1] + '" role="img" aria-label="' + esc(o.label || '') + '">';
    var sol = pr ? INK : '#16417c', dash = pr ? INK : '#c0392b';
    s += '<defs><marker id="' + pre + 'ah' + (o.uid || 0) + '" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 L8 4 L0 8 Z" fill="' + sol + '"/></marker>' +
      '<marker id="' + pre + 'ad' + (o.uid || 0) + '" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0 L8 4 L0 8 Z" fill="' + dash + '"/></marker></defs>';
    p.arrows.forEach(function (a, i) {
      var j = (i + 1) % n; if (i + 1 >= n && !p.loop) return;
      var x1 = pts[i][0], y1 = pts[i][1], x2 = pts[j][0], y2 = pts[j][1];
      var dx = x2 - x1, dy = y2 - y1, d = Math.hypot(dx, dy) || 1, ux = dx / d, uy = dy / d;
      var ax = x1 + ux * (R0 + 1), ay = y1 + uy * (R0 + 1), bx = x2 - ux * (R0 + 2.4), by = y2 - uy * (R0 + 2.4);
      var isD = a.style === 'dash', c = isD ? dash : sol;
      s += '<line x1="' + ax.toFixed(1) + '" y1="' + ay.toFixed(1) + '" x2="' + bx.toFixed(1) + '" y2="' + by.toFixed(1) + '" stroke="' + c + '" stroke-width="' + (pr ? 1.5 : 1.8) + '"' +
        (isD ? ' stroke-dasharray="3.2 2.4"' : '') + ' marker-end="url(#' + pre + (isD ? 'ad' : 'ah') + (o.uid || 0) + ')"/>';
      if (p.showDelta) {
        var mx = (ax + bx) / 2, my = (ay + by) / 2, nx = -uy, ny = ux, off = (p.layout === 'line' || Math.abs(dy) < 1) ? -5.5 : (nx > 0 ? 6 : -6);
        var lx = mx + (Math.abs(dy) < 1 ? 0 : nx * 6.5), ly = my + (Math.abs(dy) < 1 ? -5 : 1.5);
        s += '<text class="' + pre + '-adl" x="' + lx.toFixed(1) + '" y="' + ly.toFixed(1) + '" text-anchor="middle">' + (a.d > 0 ? '+' : '−') + Math.abs(a.d) + '</text>';
        void off;
      }
    });
    pts.forEach(function (pt, i) {
      var v = o.vals ? o.vals[i] : p.nodes[i];
      var blank = v == null, cur = o.cur === i;
      if (pr) s += '<circle cx="' + pt[0].toFixed(1) + '" cy="' + pt[1].toFixed(1) + '" r="' + R0 + '" fill="#fff" stroke="' + INK + '" stroke-width="1.4"' + (blank ? ' stroke-dasharray="2.6 1.8"' : '') + '/>' +
        (blank ? '' : '<text class="' + pre + '-an" x="' + pt[0].toFixed(1) + '" y="' + (pt[1] + 3.6).toFixed(1) + '" text-anchor="middle">' + v + '</text>');
      else s += '<circle class="' + pre + '-node' + (blank ? ' ' + pre + '-blank' : '') + (cur ? ' ' + pre + '-cur' : '') + (o.found && o.found.indexOf(i) >= 0 ? ' ' + pre + '-found' : '') + '" cx="' + pt[0].toFixed(1) + '" cy="' + pt[1].toFixed(1) + '" r="' + R0 + '"/>' +
        '<text class="' + pre + '-an" x="' + pt[0].toFixed(1) + '" y="' + (pt[1] + 3.8).toFixed(1) + '" text-anchor="middle">' + (blank ? '?' : v) + '</text>';
    });
    return s + '</svg>';
  };
  /* 규칙 상자 — 실선=a 큰 수, 점선=b 작은 수(규칙 찾기에서는 숫자 칸을 비운다) */
  G.chainLegend = function (p, o) {
    o = o || {}; var pre = o.pre || 'nm-g1315', lg = p.legend; if (!lg) return '';
    var col = o.print ? INK : '#16417c', dcol = o.print ? INK : '#c0392b', L = o.lk || function (a) { return a; };
    var box = function (v) { return v == null ? '<i class="' + pre + '-lgb"></i>' : '<b>' + v + '</b>'; };
    var a = p.askRule ? (o.ruleVals ? o.ruleVals[0] : null) : lg.a, b = p.askRule ? (o.ruleVals ? o.ruleVals[1] : null) : lg.b;
    return '<div class="' + pre + '-legend">' +
      '<span class="' + pre + '-lgi"><svg viewBox="0 0 30 8"><line x1="1" y1="4" x2="24" y2="4" stroke="' + col + '" stroke-width="2"/><path d="M22 0.8 L29 4 L22 7.2 Z" fill="' + col + '"/></svg> ' + box(a) + ' ' + L('큰 수', 'more', '多') + '</span>' +
      '<span class="' + pre + '-lgi"><svg viewBox="0 0 30 8"><line x1="1" y1="4" x2="24" y2="4" stroke="' + dcol + '" stroke-width="2" stroke-dasharray="3.2 2.4"/><path d="M22 0.8 L29 4 L22 7.2 Z" fill="' + dcol + '"/></svg> ' + box(b) + ' ' + L('작은 수', 'less', '少') + '</span></div>';
  };

  /* ── 숫자 기차(numberTrain) — 기관차 + 객차 4~5량, 칸 사이 위의 동그라미 ── */
  G.trainHtml = function (p, o) {
    o = o || {}; var pre = o.pre || 'nm-g1315', pr = !!o.print;
    var tok = function (t) { return O && O.has && O.has(t) ? O.svg(t) : ''; };
    var cell = function (v, kind, i) {
      return '<span class="' + pre + '-tc ' + pre + '-tc-' + kind + (v == null ? ' ' + pre + '-blank' : '') + '" data-k="' + kind + '" data-i="' + i + '">' + (v == null ? (pr ? '' : '?') : v) + '</span>';
    };
    var cars = '', links = '';
    p.cars.forEach(function (v, i) {
      cars += '<span class="' + pre + '-carw"><span class="' + pre + '-car">' + tok('g:traincar') + '</span>' + cell(v, 'car', i) + '</span>';
      if (i < p.links.length) links += '<span class="' + pre + '-linkw">' + cell(p.links[i], 'link', i) + '</span>';
    });
    return '<div class="' + pre + '-train"><div class="' + pre + '-trlinks">' + links + '</div>' +
      '<div class="' + pre + '-trcars"><span class="' + pre + '-eng">' + tok('g:train') + '</span>' + cars + '</div></div>';
  };

  /* ── 표(g15RuleTable) ── o.fill = 빈 칸에 채울 값 */
  G.tableHtml = function (p, o) {
    o = o || {}; var pre = o.pre || 'nm-g1315', pr = !!o.print;
    var h = '<table class="' + pre + '-table">';
    p.rows.forEach(function (row, ri) {
      h += '<tr' + (o.hiRow === ri ? ' class="' + pre + '-hirow"' : '') + '>';
      row.forEach(function (v, ci) {
        var blank = v == null && !(o.fill != null && ri === p.askRow && ci === p.askCol);
        h += '<td class="' + (blank ? pre + '-blank' : '') + (v == null && !blank ? ' ' + pre + '-found' : '') + '">' + (blank ? (pr ? '' : '?') : (v == null ? o.fill : v)) + '</td>';
      });
      h += '</tr>';
    });
    return h + '</table>';
  };

  /* ── 길 격자(pathSum) — o.sel = 고른 칸 [[r,c]…] · o.next = 다음에 갈 수 있는 칸 · 인쇄는 start/goal 표시만 ── */
  G.pathHtml = function (p, o) {
    o = o || {}; var pre = o.pre || 'nm-g1315', pr = !!o.print, sel = o.sel || [], nx = o.next || [];
    var inList = function (l, r, c) { return l.some(function (a) { return a[0] === r && a[1] === c; }); };
    var h = '<div class="' + pre + '-pgrid" style="grid-template-columns:repeat(' + p.cols + ',1fr)">';
    for (var r = 0; r < p.rows; r++) for (var c = 0; c < p.cols; c++) {
      var isS = r === p.start[0] && c === p.start[1], isG = r === p.goal[0] && c === p.goal[1];
      var cls = pre + '-pc' + (inList(sel, r, c) ? ' ' + pre + '-on' : '') + (inList(nx, r, c) ? ' ' + pre + '-nx' : '') + (isS ? ' ' + pre + '-st' : '') + (isG ? ' ' + pre + '-gl' : '');
      h += '<span class="' + cls + '" data-r="' + r + '" data-c="' + c + '"><b>' + p.cells[r][c] + '</b>' +
        (isS ? '<em>' + (o.startTxt || '▶') + '</em>' : '') + (isG ? '<em class="' + pre + '-flag">' + (o.goalTxt || '⚑') + '</em>' : '') + '</span>';
    }
    void pr;
    return h + '</div>';
  };

  /* ── 네 꼭짓점(ringSum) ── o.vals = 꼭짓점 표시값 */
  G.ringSvg = function (p, o) {
    o = o || {}; var pre = o.pre || 'nm-g1315', pr = !!o.print;
    var C = [[22, 12], [78, 12], [78, 56], [22, 56]];
    var s = '<svg class="' + pre + '-ring" viewBox="0 0 100 68">';
    s += '<polygon points="' + C.map(function (c) { return c.join(','); }).join(' ') + '" fill="none" stroke="' + (pr ? INK : '#c9a063') + '" stroke-width="' + (pr ? 1.4 : 2) + '"/>';
    var mids = [[50, 12], [78, 34], [50, 56], [22, 34]], dx = [0, 9, 0, -9], dy = [-4.5, 1.6, 9, 1.6];
    p.sides.forEach(function (v, i) {
      s += '<rect x="' + (mids[i][0] - 6) + '" y="' + (mids[i][1] - 5.5) + '" width="12" height="11" rx="2.4" fill="' + (pr ? '#fff' : '#eef3fb') + '" stroke="' + (pr ? INK : '#9bb3d6') + '" stroke-width="1"/>' +
        '<text class="' + pre + '-rs" x="' + mids[i][0] + '" y="' + (mids[i][1] + 3.2) + '" text-anchor="middle">' + v + '</text>';
      void dx; void dy;
    });
    C.forEach(function (c, i) {
      var v = o.vals ? o.vals[i] : p.corners[i], blank = v == null;
      s += '<circle class="' + pre + '-rc' + (blank ? ' ' + pre + '-blank' : '') + (o.cur === i ? ' ' + pre + '-cur' : '') + '" data-i="' + i + '" cx="' + c[0] + '" cy="' + c[1] + '" r="8.2"' +
        (pr ? ' fill="#fff" stroke="' + INK + '" stroke-width="1.4"' + (blank ? ' stroke-dasharray="2.6 1.8"' : '') : '') + '/>' +
        (blank && pr ? '' : '<text class="' + pre + '-rv" x="' + c[0] + '" y="' + (c[1] + 3.8) + '" text-anchor="middle" pointer-events="none">' + (blank ? '?' : v) + '</text>');
    });
    return s + '</svg>';
  };

  /* 칸 도형: 수 한 칸(네모/원) — 인쇄·화면 공용 작은 조각 */
  G.numBox = function (v, o) {
    o = o || {};
    return '<span class="' + (o.pre || 'nm-g1315') + '-nb' + (v == null ? ' ' + (o.pre || 'nm-g1315') + '-blank' : '') + '">' + (v == null ? '' : v) + '</span>';
  };
})();
