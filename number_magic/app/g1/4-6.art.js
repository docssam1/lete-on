/* G1-4·5·6호 새 소품 + 고대 숫자 글리프.
   ① NM_OBJECTS.register('토큰', function(id){ return '<svg 조각>'; }) — viewBox 0 0 64 64, 기존 16종과 같은 젤리 결
      (둥근 몸 + 어두운 같은 색 윤곽선 + 왼쪽 위 하이라이트). 실사 PNG 가 data/real-art.js 에 오르면 그쪽이 덮어쓴다.
   ② window.NM_ANCIENT — 6체계(maya·egypt·greek·chinese·mesopotamia·roman) 숫자 기호 1~9를 직접 그린 벡터 글리프.
      원문 기호를 베끼거나 교재 사진을 트레이스하지 않았다 — 점·막대·쐐기·ㄱ자 같은 단순 도형만 쓴다.
      rect/circle/polygon/polyline/text 만 쓴다(인쇄 CSS 가 line·path 는 윤곽선으로 바꾸기 때문). 색은 currentColor.
   화면·인쇄 양쪽(index.html·drill.html·ws.html·placement-sheet.html)이 로드한다. */
(function () {
  'use strict';

  /* ─────────────── ① 소품 ─────────────── */
  var O = window.NM_OBJECTS, H = O && O.helpers;
  if (O && H && typeof O.register === 'function') {
    var P = H.P, defs = H.defs, fill = H.fill, hl = H.hl, extra = H.extra, sw = H.sw;

    /* 시상대 — 가운데 1등이 가장 높고, 왼쪽 2등·오른쪽 3등 */
    O.register('podium', function (id) {
      var g = P.yellow, s = P.white, b = P.orange;
      return defs(id, g) + extra(id, [['s', s], ['b', b]]) +
        '<rect x="22" y="14" width="20" height="44" rx="4" fill="url(#g' + id + ')"' + sw(g) + '/>' +
        '<rect x="3" y="28" width="20" height="30" rx="4" fill="url(#s' + id + ')"' + sw(s) + '/>' +
        '<rect x="41" y="38" width="20" height="20" rx="4" fill="url(#b' + id + ')"' + sw(b) + '/>' +
        '<path d="M32 3 L34.2 8.6 L40 9 L35.5 12.8 L37 18.4 L32 15.2 L27 18.4 L28.5 12.8 L24 9 L29.8 8.6 Z" fill="#ff8a1f" stroke="#9a4a00" stroke-width="1.6" stroke-linejoin="round"/>' +
        '<text x="32" y="42" text-anchor="middle" style="font:900 16px sans-serif" fill="#7a5a00">1</text>' +
        '<text x="13" y="48" text-anchor="middle" style="font:900 14px sans-serif" fill="#4a5568">2</text>' +
        '<text x="51" y="52" text-anchor="middle" style="font:900 13px sans-serif" fill="#7a3a00">3</text>' +
        hl(27, 24, 2.6, 7, 0);
    });

    /* 매표소 — 줄무늬 차양 + 창구 */
    O.register('ticket-booth', function (id) {
      var c = P.blue, r = P.red;
      var stripes = '';
      for (var i = 0; i < 6; i++) stripes += '<path d="M' + (8 + i * 8) + ' 14 L' + (16 + i * 8) + ' 14 L' + (17 + i * 8) + ' 25 L' + (7 + i * 8) + ' 25 Z" fill="' + (i % 2 ? '#fff' : '#e53935') + '" stroke="#8e1b1b" stroke-width="1.4" stroke-linejoin="round"/>';
      return defs(id, c) +
        '<rect x="8" y="24" width="48" height="34" rx="4" fill="' + fill(id) + '"' + sw(c) + '/>' +
        '<rect x="15" y="30" width="34" height="14" rx="3" fill="#1f3558" stroke="#0e1320" stroke-width="1.8"/>' +
        '<rect x="12" y="44" width="40" height="5" rx="2" fill="#e0a85c" stroke="#7a4f1d" stroke-width="1.6"/>' +
        '<path d="M22 36 L28 36 M22 40 L26 40" stroke="#ffd23f" stroke-width="2" stroke-linecap="round"/>' +
        '<rect x="35" y="33" width="9" height="6" rx="1.5" fill="#ffd23f" stroke="#a67c00" stroke-width="1.2"/>' +
        stripes +
        '<path d="M6 14 L58 14" stroke="#8e1b1b" stroke-width="2.4" stroke-linecap="round"/>' +
        hl(14, 30, 2.4, 6, 10);
    });

    /* 칠판 */
    O.register('blackboard', function (id) {
      var c = P.green;
      return defs(id, c) +
        '<rect x="4" y="8" width="56" height="40" rx="5" fill="#8a5a2b" stroke="#4a2c12" stroke-width="2.2"/>' +
        '<rect x="9" y="13" width="46" height="30" rx="3" fill="' + fill(id) + '" stroke="#1f5c25" stroke-width="1.8"/>' +
        '<path d="M15 21 L33 21 M15 28 L27 28 M15 35 L38 35" stroke="#fff" stroke-width="2.2" stroke-linecap="round" opacity=".85"/>' +
        '<circle cx="45" cy="30" r="5" fill="none" stroke="#fff" stroke-width="2" opacity=".85"/>' +
        '<rect x="12" y="49" width="40" height="5" rx="2" fill="#c9a063" stroke="#7a4f1d" stroke-width="1.6"/>' +
        '<rect x="40" y="46.5" width="8" height="3.2" rx="1" fill="#fff" stroke="#6b7688" stroke-width="1"/>' +
        hl(14, 17, 5, 1.8, -8);
    });

    /* 번호표 종이 — 숫자는 위젯이 올린다. 양옆 홈 + 점선 */
    O.register('ticket', function (id) {
      var c = P.yellow, o = P.orange;
      return defs(id, c) +
        '<path d="M6 16 H58 V26 C54 26 54 38 58 38 V48 H6 V38 C10 38 10 26 6 26 Z" fill="' + fill(id) + '"' + sw(o, 2.4) + '/>' +
        '<path d="M44 18 V46" stroke="' + o[2] + '" stroke-width="2" stroke-dasharray="3 3" fill="none"/>' +
        '<path d="M51 27 L52.6 31 L57 31.4 L53.6 34.2 L54.6 38.4 L51 36.2 L47.4 38.4 L48.4 34.2 L45 31.4 L49.4 31 Z" fill="#fb8c2e" opacity=".8"/>' +
        hl(15, 21, 6, 2.2, -8);
    });

    /* 책상 */
    O.register('desk', function (id) {
      var c = P.tan;
      return defs(id, c) +
        '<rect x="6" y="18" width="52" height="10" rx="4" fill="' + fill(id) + '"' + sw(c, 2.4) + '/>' +
        '<rect x="10" y="28" width="6" height="28" rx="2.5" fill="#c68a3c" stroke="#7a4f1d" stroke-width="2"/>' +
        '<rect x="48" y="28" width="6" height="28" rx="2.5" fill="#c68a3c" stroke="#7a4f1d" stroke-width="2"/>' +
        '<rect x="16" y="30" width="32" height="10" rx="2.5" fill="#e0a85c" stroke="#7a4f1d" stroke-width="1.8"/>' +
        hl(18, 22, 8, 1.8, 0);
    });

    /* 접시 위에서 본 모습 */
    O.register('plate', function (id) {
      var c = P.white, b = P.blue;
      return defs(id, c) + extra(id, [['b', b]]) +
        '<circle cx="32" cy="32" r="28" fill="' + fill(id) + '"' + sw(c, 2.4) + '/>' +
        '<circle cx="32" cy="32" r="19" fill="url(#b' + id + ')" stroke="' + b[2] + '" stroke-width="1.6" opacity=".55"/>' +
        '<circle cx="32" cy="32" r="14" fill="#fff" opacity=".9" stroke="' + b[2] + '" stroke-width="1.2"/>' +
        hl(19, 15, 6, 2.6, -35);
    });

    /* 양초 한 자루(불꽃 포함) */
    O.register('candle', function (id) {
      var c = P.pink;
      return defs(id, c) +
        '<path d="M32 3 C27 11 26 15 32 19 C38 15 37 11 32 3 Z" fill="#ffb300" stroke="#a65a00" stroke-width="1.8" stroke-linejoin="round"/>' +
        '<path d="M32 9 C30 13 30 15 32 17 C34 15 34 13 32 9 Z" fill="#fff3a0"/>' +
        '<path d="M32 18 V24" stroke="#3a2610" stroke-width="2" stroke-linecap="round"/>' +
        '<rect x="24" y="23" width="16" height="36" rx="4" fill="' + fill(id) + '"' + sw(c, 2.2) + '/>' +
        '<path d="M24 34 L40 28 M24 44 L40 38 M24 54 L40 48" stroke="#fff" stroke-width="3" opacity=".55"/>' +
        hl(28, 32, 2, 8, 0);
    });

    /* 접시 위 케이크 */
    O.register('cake', function (id) {
      var c = P.tan, p = P.pink;
      return defs(id, c) + extra(id, [['p', p]]) +
        '<ellipse cx="32" cy="55" rx="28" ry="6" fill="#f1f4f8" stroke="#6b7688" stroke-width="2"/>' +
        '<path d="M10 34 H54 V50 C54 54 10 54 10 50 Z" fill="' + fill(id) + '"' + sw(c, 2.2) + '/>' +
        '<path d="M10 34 C10 24 54 24 54 34 C54 40 46 38 43 42 C40 38 34 42 32 40 C28 44 24 38 20 42 C18 38 10 40 10 34 Z" fill="url(#p' + id + ')"' + sw(p, 2.2) + '/>' +
        '<circle cx="32" cy="20" r="5.2" fill="#e53935" stroke="#8e1b1b" stroke-width="1.8"/>' +
        '<path d="M32 15 C32 11 35 9 38 9" fill="none" stroke="#1f5c25" stroke-width="2" stroke-linecap="round"/>' +
        '<circle cx="21" cy="29" r="2" fill="#fff" opacity=".8"/><circle cx="44" cy="30" r="2" fill="#fff" opacity=".8"/>' +
        hl(15, 40, 3, 5, 10);
    });

    /* 자물쇠 */
    O.register('padlock', function (id) {
      var c = P.yellow, g = P.black;
      return defs(id, c) +
        '<path d="M20 28 V19 C20 4 44 4 44 19 V28" fill="none" stroke="#6b7688" stroke-width="6.5" stroke-linecap="round"/>' +
        '<path d="M20 28 V19 C20 4 44 4 44 19 V28" fill="none" stroke="#cfd6e0" stroke-width="2.4" stroke-linecap="round"/>' +
        '<rect x="9" y="27" width="46" height="31" rx="7" fill="' + fill(id) + '"' + sw(c, 2.6) + '/>' +
        '<circle cx="32" cy="40" r="4.6" fill="' + g[2] + '"/><path d="M30 42 H34 L35 51 H29 Z" fill="' + g[2] + '"/>' +
        hl(16, 33, 4, 2.2, -25);
    });

    /* 천 주머니 — 입구를 묶은 모양 */
    O.register('pouch', function (id) {
      var c = P.purple;
      return defs(id, c) +
        '<path d="M24 14 C16 22 6 34 8 46 C10 58 54 58 56 46 C58 34 48 22 40 14 Z" fill="' + fill(id) + '"' + sw(c, 2.4) + '/>' +
        '<path d="M22 14 C26 18 38 18 42 14 L44 8 C38 11 26 11 20 8 Z" fill="#c9b4ff" stroke="#4a2f8a" stroke-width="2" stroke-linejoin="round"/>' +
        '<path d="M26 16 C28 20 36 20 38 16" fill="none" stroke="#ffd23f" stroke-width="3" stroke-linecap="round"/>' +
        '<path d="M30 38 L34 34 L38 38 L34 44 Z" fill="#fff" opacity=".35"/>' +
        hl(16, 38, 3.4, 8, 18);
    });

    /* 보석 한 알 */
    O.register('gem', function (id) {
      var c = P.blue;
      return defs(id, c) +
        '<path d="M12 22 L22 8 H42 L52 22 L32 56 Z" fill="' + fill(id) + '"' + sw(c, 2.4) + '/>' +
        '<path d="M12 22 H52 M22 8 L26 22 L32 56 L38 22 L42 8 M26 22 L32 8 L38 22" fill="none" stroke="#fff" stroke-width="1.8" opacity=".6" stroke-linejoin="round"/>' +
        hl(22, 15, 4, 2, -35);
    });
  }

  /* ─────────────── ② 고대 숫자 글리프 ─────────────── */
  var W = 60, HH = 44;
  function rect(x, y, w, h, rx) { return '<rect x="' + r1(x) + '" y="' + r1(y) + '" width="' + r1(w) + '" height="' + r1(h) + '" rx="' + (rx || 0) + '" fill="currentColor"/>'; }
  function r1(v) { return Math.round(v * 10) / 10; }
  function circ(cx, cy, r) { return '<circle cx="' + r1(cx) + '" cy="' + r1(cy) + '" r="' + r + '" fill="currentColor"/>'; }
  function wedge(x, y, s) {   /* 못 모양 쐐기 — (x,y)는 머리 왼쪽 위. s=배율 */
    var P2 = [[0, 0], [12, 0], [8, 8], [6.7, 20], [5.3, 20], [4, 8]].map(function (p) { return r1(x + p[0] * s) + ',' + r1(y + p[1] * s); }).join(' ');
    return '<polygon points="' + P2 + '" fill="currentColor"/>';
  }
  /* 한 줄에 count 개를 gap 간격으로 가운데 정렬해 놓을 x 좌표들 */
  function spread(count, gap, cx) { var out = [], x0 = cx - (count - 1) * gap / 2; for (var i = 0; i < count; i++) out.push(x0 + i * gap); return out; }
  /* 줄들을 세로로 쌓아 가운데 정렬: heights 배열 → 각 줄의 y 시작 */
  function stack(heights, gap) {
    var total = heights.reduce(function (a, b) { return a + b; }, 0) + gap * (heights.length - 1);
    var y = (HH - total) / 2, ys = [];
    heights.forEach(function (h) { ys.push(y); y += h + gap; });
    return ys;
  }

  var DRAW = {
    maya: function (n) {
      var bars = Math.floor(n / 5), dots = n % 5, hs = [], parts = [], s = '';
      if (dots) hs.push(9); for (var i = 0; i < bars; i++) hs.push(8);
      var ys = stack(hs, 5), k = 0;
      if (dots) { spread(dots, 11, W / 2).forEach(function (x) { s += circ(x, ys[0] + 4.5, 4.4); }); k = 1; }
      for (var b = 0; b < bars; b++) s += rect(W / 2 - 21, ys[k + b], 42, 8, 4);
      return s;
    },
    egypt: function (n) {
      var rows = n <= 4 ? [n] : n === 5 ? [3, 2] : n === 6 ? [3, 3] : n === 7 ? [4, 3] : n === 8 ? [4, 4] : [3, 3, 3];
      var h = rows.length === 3 ? 9 : rows.length === 2 ? 14 : 22, ys = stack(rows.map(function () { return h; }), 4), s = '';
      rows.forEach(function (c, i) { spread(c, 9, W / 2).forEach(function (x) { s += rect(x - 2, ys[i], 4, h, 2); }); });
      return s;
    },
    greek: function (n) {
      var five = n >= 5, ones = five ? n - 5 : n, s = '', width = (five ? 15 : 0) + (five && ones ? 7 : 0) + (ones ? (ones - 1) * 8 + 4 : 0), x = (W - width) / 2, y0 = 11, h = 22;
      if (five) { s += '<polyline points="' + r1(x + 14) + ',' + (y0 + 2) + ' ' + r1(x + 2) + ',' + (y0 + 2) + ' ' + r1(x + 2) + ',' + (y0 + h) + '" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>'; x += 22; }
      for (var i = 0; i < ones; i++) s += rect(x + i * 8, y0, 4, h, 2);
      return s;
    },
    chinese: function (n) {   /* 1~4 = 세로 막대, 5 = 가로선, 6~9 = 가로선 + 그 아래 막대 (n-5) */
      var five = n >= 5, ones = five ? n - 5 : n, s = '', width = ones ? (ones - 1) * 9 + 4 : 0, x = (W - width) / 2;
      if (five) {
        s += rect(W / 2 - 17, ones ? 8 : 19, 34, 6, 3);
        for (var j = 0; j < ones; j++) s += rect(x + j * 9, 18, 4, 20, 2);
      } else for (var i = 0; i < ones; i++) s += rect(x + i * 9, 11, 4, 22, 2);
      return s;
    },
    mesopotamia: function (n) {
      var rows = []; for (var left = n; left > 0; left -= 3) rows.push(Math.min(3, left));
      var sc = rows.length === 3 ? .52 : rows.length === 2 ? .72 : .95, h = 20 * sc, ys = stack(rows.map(function () { return h; }), 3), s = '';
      rows.forEach(function (c, i) { spread(c, 16 * sc + 5, W / 2).forEach(function (x) { s += wedge(x - 6 * sc, ys[i], sc); }); });
      return s;
    },
    roman: function (n) {
      var T = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'][n] || String(n);
      return '<text x="30" y="31" text-anchor="middle" style="font:700 26px Georgia,\'Times New Roman\',serif;letter-spacing:1px" fill="currentColor">' + T + '</text>';
    }
  };

  /* 글리프 한 장 — 크기는 CSS(.nm-anc)가 정한다. opts.size(px) 를 주면 높이를 고정. */
  function glyph(sys, n, opts) {
    var f = DRAW[sys]; if (!f || !(n >= 1 && n <= 9)) return '';
    var sz = opts && opts.size ? ' style="height:' + opts.size + 'px;width:auto"' : '';
    return '<svg class="nm-anc nm-anc-' + sys + '" viewBox="0 0 ' + W + ' ' + HH + '" role="img" aria-label="' + sys + ' ' + n + '"' + sz + '>' + f(n) + '</svg>';
  }
  /* 부품 단추용 아이콘 — kind: 'one' | 'five' */
  function part(sys, kind) {
    var s = '';
    if (sys === 'maya') s = kind === 'five' ? rect(9, 17, 42, 10, 5) : circ(30, 22, 8);
    else if (sys === 'egypt') s = rect(26, 7, 8, 30, 4);
    else if (sys === 'mesopotamia') s = wedge(21, 5, 1.5);
    else if (sys === 'greek') s = kind === 'five' ? '<polyline points="40,10 20,10 20,36" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>' : rect(26, 7, 8, 30, 4);
    else if (sys === 'chinese') s = kind === 'five' ? rect(8, 17, 44, 9, 4.5) : rect(26, 7, 8, 30, 4);
    return '<svg class="nm-anc nm-anc-part" viewBox="0 0 ' + W + ' ' + HH + '" aria-hidden="true">' + s + '</svg>';
  }
  /* 체계 이름(문항 소개 문구용) */
  var NAME = { maya: ['마야', 'Maya', '玛雅'], egypt: ['이집트', 'Egypt', '埃及'], greek: ['그리스', 'Greece', '希腊'], chinese: ['중국', 'China', '中国'], mesopotamia: ['메소포타미아', 'Mesopotamia', '美索不达米亚'], roman: ['로마', 'Rome', '罗马'] };
  window.NM_ANCIENT = { glyph: glyph, part: part, systems: Object.keys(DRAW), names: NAME,
    /* 5를 쓰는 체계(5 묶음 안에서 낱개는 4개까지) */
    hasFive: function (sys) { return sys === 'maya' || sys === 'greek' || sys === 'chinese'; } };
})();
