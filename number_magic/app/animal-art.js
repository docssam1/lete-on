/* ============================================================
   Numbers of Magic — animal-art.js
   필즈 더 클래식 자체 창작 동물 캐릭터 10종을 SVG로 이식.
   원본: fields-classic/problem-bank/prescription/scripts/
         confirmed_sources/animals_v2.py (matplotlib, Ellipse/Circle/
         Polygon/plt.plot). 색상 hex·비례를 그대로 옮김 — 임의 재디자인 없음.
   외부 의존 0. window.NM_ANIMALS = { kinds, svg(kind) }
   ============================================================ */
(function () {
  'use strict';

  /* 선 굵기 변환 계수 — matplotlib lw(points, s와 무관)를 SVG stroke-width로.
     ≈ 원본 프리뷰(dpi130, fig h2.6in ≈ 338px / y범위 ≈3.3 data단위 ⇒ 102px/단위)에서
     1.4pt ≈ 2.53px ≈ 0.0248 data단위 — 이 근처에서 시작해 스크린샷으로 미세조정. */
  var LK = 0.022;

  function fx(n) {
    return Math.round(n * 1000) / 1000;
  }

  /* ── SVG 프리미티브 (matplotlib patch 대응) ── */
  function E(cx, cy, w, h, fc, opts) {
    opts = opts || {};
    var attrs = 'cx="' + fx(cx) + '" cy="' + fx(cy) + '" rx="' + fx(w / 2) + '" ry="' + fx(h / 2) + '" fill="' + fc + '"';
    if (opts.ec) attrs += ' stroke="' + opts.ec + '" stroke-width="' + fx(opts.lw * LK) + '"';
    if (opts.angle) attrs += ' transform="rotate(' + fx(opts.angle) + ' ' + fx(cx) + ' ' + fx(cy) + ')"';
    return '<ellipse ' + attrs + '/>';
  }
  function Ci(cx, cy, r, fc, opts) {
    opts = opts || {};
    var attrs = 'cx="' + fx(cx) + '" cy="' + fx(cy) + '" r="' + fx(r) + '" fill="' + fc + '"';
    if (opts.ec) attrs += ' stroke="' + opts.ec + '" stroke-width="' + fx(opts.lw * LK) + '"';
    return '<circle ' + attrs + '/>';
  }
  function Pg(pts, fc, opts) {
    opts = opts || {};
    var d = pts.map(function (p) { return fx(p[0]) + ',' + fx(p[1]); }).join(' ');
    var attrs = 'points="' + d + '" fill="' + fc + '"';
    if (opts.ec) attrs += ' stroke="' + opts.ec + '" stroke-width="' + fx(opts.lw * LK) + '"';
    return '<polygon ' + attrs + '/>';
  }
  function Ln(x1, y1, x2, y2, color, lw) {
    return '<line x1="' + fx(x1) + '" y1="' + fx(y1) + '" x2="' + fx(x2) + '" y2="' + fx(y2) +
      '" stroke="' + color + '" stroke-width="' + fx(lw * LK) + '" stroke-linecap="round"/>';
  }
  function Rc(x, y, w, h, fc, opts) {
    opts = opts || {};
    var attrs = 'x="' + fx(x) + '" y="' + fx(y) + '" width="' + fx(w) + '" height="' + fx(h) + '" fill="' + fc + '"';
    if (opts.ec) attrs += ' stroke="' + opts.ec + '" stroke-width="' + fx(opts.lw * LK) + '"';
    return '<rect ' + attrs + '/>';
  }
  function Arc(fxf, fyf, t0, t1, n, color, lw) {
    var pts = [];
    for (var i = 0; i < n; i++) {
      var t = t0 + (t1 - t0) * i / (n - 1);
      pts.push(fx(fxf(t)) + ',' + fx(fyf(t)));
    }
    return '<path d="M' + pts.join(' L') + '" fill="none" stroke="' + color +
      '" stroke-width="' + fx(lw * LK) + '" stroke-linecap="round" stroke-linejoin="round"/>';
  }

  /* ── zorder 레이어: matplotlib처럼 (zorder, 추가순서) 안정정렬로 페인트 순서 결정 ── */
  function Layer() {
    var items = [];
    var seq = 0;
    return {
      add: function (z, s) { items.push([z, seq++, s]); },
      out: function () {
        items.sort(function (a, b) { return (a[0] - b[0]) || (a[1] - b[1]); });
        return items.map(function (it) { return it[2]; }).join('');
      }
    };
  }

  /* ── _eye / _nose / _smile (원본 헬퍼 대응) ── */
  function eye(L, x, y, r, z, closed) {
    if (closed) {
      L.add(z, Arc(
        function (t) { return x + r * 1.2 * Math.cos(t); },
        function (t) { return y + r * 0.8 * Math.sin(t); },
        Math.PI * 0.1, Math.PI * 0.9, 20, '#2C2C2C', 1.4));
    } else {
      L.add(z, Ci(x, y, r, '#2C2C2C'));
      L.add(z + 1, Ci(x + r * 0.3, y + r * 0.35, r * 0.36, '#fff'));
    }
  }
  function nose(L, x, y, s, z, color, w, h) {
    w = (w == null) ? 0.11 : w;
    h = (h == null) ? 0.085 : h;
    L.add(z, E(x, y, w * s, h * s, color));
  }
  function smile(L, x, y, s, z, width) {
    width = (width == null) ? 0.07 : width;
    [-width, width].forEach(function (dx) {
      L.add(z, Arc(
        function (t) { return x + dx * s + width * s * Math.cos(t); },
        function (t) { return y - 0.04 * s * Math.sin(t) * 1.2; },
        Math.PI * 0.15, Math.PI * 0.85, 20, '#3A3A3A', 1.0));
    });
  }

  /* ═══════════════════════════════════════════
     10종 — animals_v2.py 각 함수를 그대로 이식 (x=0,y=0,s=1,z=10 고정)
     ═══════════════════════════════════════════ */
  function rabbit(L) {
    var B = '#FFFAF5', IN = '#FFD9DC', LN = '#C9A98F', z = 10;
    L.add(z, E(0, -0.45, 0.68, 0.82, B, { ec: LN, lw: 1.3 }));
    L.add(z + 1, E(0, -0.52, 0.40, 0.52, '#FFF0F0'));
    [[-0.17, 14], [0.17, -14]].forEach(function (p) {
      var dx = p[0], ang = p[1];
      L.add(z + 1, E(dx, 0.92, 0.17, 0.62, B, { ec: LN, lw: 1.3, angle: ang }));
      L.add(z + 2, E(dx, 0.90, 0.08, 0.44, IN, { angle: ang }));
    });
    L.add(z + 3, Ci(0, 0.30, 0.38, B, { ec: LN, lw: 1.3 }));
    eye(L, -0.14, 0.34, 0.055, z + 5); eye(L, 0.14, 0.34, 0.055, z + 5);
    nose(L, 0, 0.18, 1, z + 6, '#F09090', 0.10, 0.075);
    smile(L, 0, 0.11, 1, z + 6, 0.055);
    [-0.20, 0.20].forEach(function (dx) {
      L.add(z + 2, E(dx, -0.86, 0.22, 0.13, '#F5EAE0', { ec: LN, lw: 1 }));
    });
    L.add(z + 1, Ci(-0.38, -0.58, 0.11, '#fff', { ec: LN, lw: 1 }));
  }

  function turtle(L) {
    var SH = '#7FA860', B = '#A8CC8E', LN = '#4F7038', z = 10;
    L.add(z + 3, E(0, -0.18, 1.05, 0.68, SH, { ec: LN, lw: 1.4 }));
    for (var ang = 30; ang < 360; ang += 60) {
      var a = ang * Math.PI / 180, a2 = (ang + 60) * Math.PI / 180;
      L.add(z + 4, Pg([
        [0, -0.18],
        [0.38 * Math.cos(a), -0.18 + 0.24 * Math.sin(a)],
        [0.38 * Math.cos(a2), -0.18 + 0.24 * Math.sin(a2)]
      ], '#93BC7A', { ec: LN, lw: 0.8 }));
    }
    L.add(z + 2, E(0.62, -0.02, 0.42, 0.34, B, { ec: LN, lw: 1.3 }));
    eye(L, 0.70, 0.04, 0.05, z + 6);
    nose(L, 0.80, -0.06, 1, z + 6, '#4F7038', 0.05, 0.04);
    [[-0.42, -0.42], [0.30, -0.42], [-0.48, -0.30], [0.36, -0.30]].forEach(function (p) {
      L.add(z + 1, E(p[0], p[1], 0.26, 0.16, B, { ec: LN, lw: 1, angle: -15 }));
    });
    L.add(z + 1, Pg([[-0.52, -0.20], [-0.72, -0.26], [-0.52, -0.30]], B, { ec: LN, lw: 1 }));
  }

  function bear(L) {
    var B = '#B2835A', SH = '#966944', IN = '#DCBE9C', LN = '#6E4A2C', z = 10;
    L.add(z, E(0, -0.42, 1.00, 0.90, B, { ec: LN, lw: 1.4 }));
    L.add(z + 1, E(0, -0.48, 0.62, 0.60, IN));
    [-0.36, 0.36].forEach(function (dx) {
      L.add(z + 1, Ci(dx, 0.62, 0.20, B, { ec: LN, lw: 1.3 }));
      L.add(z + 2, Ci(dx, 0.62, 0.11, IN));
    });
    L.add(z + 3, Ci(0, 0.28, 0.48, B, { ec: LN, lw: 1.4 }));
    L.add(z + 4, E(0, 0.14, 0.36, 0.26, IN));
    eye(L, -0.17, 0.38, 0.06, z + 5); eye(L, 0.17, 0.38, 0.06, z + 5);
    nose(L, 0, 0.20, 1, z + 6, '#3A2A1A', 0.14, 0.10);
    smile(L, 0, 0.10, 1, z + 6);
    [-0.46, 0.46].forEach(function (dx) {
      L.add(z + 2, E(dx, -0.36, 0.24, 0.34, SH, { ec: LN, lw: 1, angle: dx * 20 }));
    });
    [-0.26, 0.26].forEach(function (dx) {
      L.add(z + 2, E(dx, -0.86, 0.30, 0.18, SH, { ec: LN, lw: 1 }));
    });
  }

  function fox(L) {
    var B = '#F0954E', IN = '#FFF2E4', LN = '#A85820', W = '#FFFFFF', z = 10;
    L.add(z, E(-0.62, -0.36, 0.66, 0.32, B, { ec: LN, lw: 1.3, angle: 28 }));
    L.add(z + 1, E(-0.86, -0.24, 0.24, 0.20, W, { ec: LN, lw: 1, angle: 28 }));
    L.add(z + 2, E(0, -0.42, 0.78, 0.72, B, { ec: LN, lw: 1.3 }));
    L.add(z + 3, E(0, -0.50, 0.44, 0.46, IN));
    [-0.30, 0.30].forEach(function (dx) {
      L.add(z + 3, Pg([[dx, 0.88], [dx - 0.20, 0.28], [dx + 0.20, 0.32]], B, { ec: LN, lw: 1.3 }));
      L.add(z + 4, Pg([[dx, 0.74], [dx - 0.10, 0.36], [dx + 0.10, 0.38]], '#3A3A3A'));
    });
    L.add(z + 5, Ci(0, 0.30, 0.42, B, { ec: LN, lw: 1.3 }));
    L.add(z + 6, Pg([[-0.20, 0.20], [0.20, 0.20], [0, -0.10]], IN, { ec: LN, lw: 1 }));
    eye(L, -0.16, 0.38, 0.055, z + 7); eye(L, 0.16, 0.38, 0.055, z + 7);
    nose(L, 0, -0.04, 1, z + 8, '#2C2C2C', 0.10, 0.075);
  }

  function raccoon(L) {
    var B = '#AEAEAE', IN = '#E6E6E6', LN = '#5F5F5F', D = '#4A4A4A', z = 10;
    [B, D, B, D].forEach(function (cc, i) {
      L.add(z + 1 - i * 0.1, E(-0.58 - i * 0.13, -0.30 - i * 0.05, 0.22, 0.19, cc, { ec: LN, lw: 0.9, angle: 25 }));
    });
    L.add(z + 2, E(0, -0.42, 0.82, 0.74, B, { ec: LN, lw: 1.3 }));
    L.add(z + 3, E(0, -0.50, 0.46, 0.46, IN));
    [-0.32, 0.32].forEach(function (dx) {
      L.add(z + 3, Pg([[dx, 0.76], [dx - 0.18, 0.32], [dx + 0.18, 0.34]], B, { ec: LN, lw: 1.3 }));
    });
    L.add(z + 5, Ci(0, 0.30, 0.44, B, { ec: LN, lw: 1.3 }));
    [-0.17, 0.17].forEach(function (dx) {
      L.add(z + 6, E(dx, 0.36, 0.28, 0.22, D, { angle: dx * 30 }));
    });
    eye(L, -0.17, 0.36, 0.055, z + 7); eye(L, 0.17, 0.36, 0.055, z + 7);
    L.add(z + 6, E(0, 0.16, 0.30, 0.20, IN));
    nose(L, 0, 0.20, 1, z + 8, '#2C2C2C', 0.11, 0.08);
  }

  function squirrel(L) {
    var B = '#DFA860', IN = '#F7E3C6', LN = '#8F6432', z = 10;
    var tailPts = [];
    for (var i = 0; i < 40; i++) {
      var t = -Math.PI * 0.4 + (Math.PI * 1.1 - (-Math.PI * 0.4)) * i / 39;
      tailPts.push([-0.52 + 0.34 * Math.cos(t), -0.10 + 0.52 * Math.sin(t)]);
    }
    var tailD = 'M' + tailPts.map(function (p) { return fx(p[0]) + ',' + fx(p[1]); }).join(' L');
    L.add(z, '<path d="' + tailD + '" fill="none" stroke="' + B + '" stroke-width="' + fx(13 * LK) + '" stroke-linecap="round" stroke-linejoin="round"/>');
    L.add(z + 1, '<path d="' + tailD + '" fill="none" stroke="#F0D0A0" stroke-width="' + fx(6 * LK) + '" stroke-linecap="round" stroke-linejoin="round"/>');
    L.add(z + 2, E(0, -0.40, 0.62, 0.66, B, { ec: LN, lw: 1.3 }));
    L.add(z + 3, E(0, -0.46, 0.36, 0.42, IN));
    [-0.26, 0.26].forEach(function (dx) {
      L.add(z + 3, E(dx, 0.60, 0.16, 0.26, B, { ec: LN, lw: 1.2, angle: dx * 18 }));
    });
    L.add(z + 5, Ci(0, 0.26, 0.36, B, { ec: LN, lw: 1.3 }));
    eye(L, -0.13, 0.32, 0.055, z + 7); eye(L, 0.13, 0.32, 0.055, z + 7);
    L.add(z + 6, E(0, 0.14, 0.24, 0.17, IN));
    nose(L, 0, 0.17, 1, z + 8, '#5A3A1A', 0.09, 0.07);
    L.add(z + 8, Rc(-0.05, 0.02, 0.10, 0.09, '#fff', { ec: '#999', lw: 0.7 }));
  }

  function deer(L) {
    var B = '#D4A876', IN = '#F2DFC4', LN = '#8A6740', z = 10;
    L.add(z, E(0, -0.52, 0.82, 0.62, B, { ec: LN, lw: 1.3 }));
    [[-0.20, -0.44], [0.14, -0.56], [0.26, -0.38], [-0.06, -0.62]].forEach(function (p) {
      L.add(z + 1, Ci(p[0], p[1], 0.055, '#F7EBD8'));
    });
    L.add(z + 1, E(0, -0.06, 0.28, 0.46, B, { ec: LN, lw: 1.3 }));
    [-1, 1].forEach(function (dx) {
      L.add(z + 2, Ln(dx * 0.16, 0.56, dx * 0.30, 1.02, LN, 2.6));
      L.add(z + 2, Ln(dx * 0.24, 0.80, dx * 0.46, 0.94, LN, 2.2));
      L.add(z + 2, Ln(dx * 0.27, 0.90, dx * 0.24, 1.10, LN, 2.0));
    });
    [-0.36, 0.36].forEach(function (dx) {
      L.add(z + 3, E(dx, 0.46, 0.26, 0.14, B, { ec: LN, lw: 1.2, angle: dx * 38 }));
    });
    L.add(z + 5, E(0, 0.28, 0.40, 0.46, B, { ec: LN, lw: 1.3 }));
    L.add(z + 6, E(0, 0.12, 0.26, 0.22, IN));
    eye(L, -0.14, 0.38, 0.055, z + 7); eye(L, 0.14, 0.38, 0.055, z + 7);
    nose(L, 0, 0.14, 1, z + 8, '#3A2A1A', 0.11, 0.08);
    [-0.24, 0.24].forEach(function (dx) {
      L.add(z - 1, Ln(dx, -0.78, dx, -1.00, B, 4));
    });
  }

  function wolf(L) {
    var B = '#96A0AE', IN = '#DCE2EA', LN = '#565E6C', z = 10;
    L.add(z, E(-0.58, -0.44, 0.52, 0.26, B, { ec: LN, lw: 1.2, angle: 20 }));
    L.add(z + 2, E(0, -0.44, 0.86, 0.74, B, { ec: LN, lw: 1.3 }));
    L.add(z + 3, E(0, -0.52, 0.48, 0.46, IN));
    [-0.32, 0.32].forEach(function (dx) {
      L.add(z + 3, Pg([[dx, 0.86], [dx - 0.17, 0.30], [dx + 0.17, 0.32]], B, { ec: LN, lw: 1.3 }));
      L.add(z + 4, Pg([[dx, 0.72], [dx - 0.08, 0.36], [dx + 0.08, 0.38]], '#4A4A4A'));
    });
    L.add(z + 5, Ci(0, 0.30, 0.44, B, { ec: LN, lw: 1.3 }));
    L.add(z + 6, E(0, 0.06, 0.34, 0.30, IN, { ec: LN, lw: 1 }));
    eye(L, -0.17, 0.40, 0.055, z + 7); eye(L, 0.17, 0.40, 0.055, z + 7);
    nose(L, 0, -0.02, 1, z + 8, '#2C2C2C', 0.13, 0.09);
  }

  function duck(L) {
    var B = '#FCE07C', LN = '#B89A28', BK = '#F0921E', z = 10;
    L.add(z + 2, E(-0.10, -0.36, 0.98, 0.72, B, { ec: LN, lw: 1.3 }));
    L.add(z + 3, E(-0.02, -0.36, 0.46, 0.34, '#F5D45C', { ec: LN, lw: 1, angle: -12 }));
    L.add(z + 1, Pg([[-0.56, -0.28], [-0.82, -0.16], [-0.58, -0.44]], B, { ec: LN, lw: 1 }));
    L.add(z + 3, E(0.26, 0.06, 0.26, 0.44, B, { ec: LN, lw: 1.3 }));
    L.add(z + 5, Ci(0.30, 0.40, 0.32, B, { ec: LN, lw: 1.3 }));
    eye(L, 0.38, 0.46, 0.05, z + 7);
    L.add(z + 6, E(0.62, 0.34, 0.40, 0.16, BK, { ec: '#B06D10', lw: 1 }));
    [-0.16, 0.14].forEach(function (dx) {
      L.add(z + 1, Pg([[dx, -0.72], [dx - 0.14, -0.88], [dx + 0.16, -0.88]], BK, { ec: '#B06D10', lw: 1 }));
    });
  }

  function tiger(L) {
    var B = '#F2A94E', IN = '#FFF0DC', LN = '#A05F1E', ST = '#6B3A0A', z = 10;
    L.add(z, E(0, -0.42, 0.98, 0.86, B, { ec: LN, lw: 1.4 }));
    L.add(z + 1, E(0, -0.48, 0.58, 0.56, IN));
    [[-0.40, -0.30], [0.40, -0.30], [-0.38, -0.56], [0.38, -0.56]].forEach(function (p) {
      var dx = p[0], dy = p[1];
      L.add(z + 2, Ln(dx, dy, dx * 0.7, dy - 0.10, ST, 2.4));
    });
    [-0.34, 0.34].forEach(function (dx) {
      L.add(z + 1, Ci(dx, 0.62, 0.19, B, { ec: LN, lw: 1.3 }));
      L.add(z + 2, Ci(dx, 0.62, 0.10, IN));
    });
    L.add(z + 5, Ci(0, 0.28, 0.50, B, { ec: LN, lw: 1.4 }));
    [[-0.26, 0.56], [0, 0.62], [0.26, 0.56]].forEach(function (p) {
      var dx = p[0], h = p[1];
      L.add(z + 7, Ln(dx, h, dx, h - 0.14, ST, 2.2));
    });
    [-1, 1].forEach(function (dx) {
      L.add(z + 7, Ln(dx * 0.44, 0.30, dx * 0.36, 0.24, ST, 2));
    });
    L.add(z + 6, E(0, 0.12, 0.40, 0.28, IN));
    eye(L, -0.18, 0.36, 0.062, z + 8); eye(L, 0.18, 0.36, 0.062, z + 8);
    nose(L, 0, 0.18, 1, z + 9, '#C4614A', 0.13, 0.09);
    smile(L, 0, 0.08, 1, z + 9);
    [-1, 1].forEach(function (dx) {
      [0.14, 0.08].forEach(function (dy) {
        L.add(z + 9, Ln(dx * 0.22, dy, dx * 0.52, dy + 0.03, '#8A6740', 0.8));
      });
    });
  }

  var BUILD = {
    rabbit: rabbit, turtle: turtle, bear: bear, fox: fox, raccoon: raccoon,
    squirrel: squirrel, deer: deer, wolf: wolf, duck: duck, tiger: tiger
  };

  /* [minX, minY(svg), width, height] — math bbox를 y반전 후 svg 좌표로 환산 + 여백.
     동물별로 타이트하게(꼬리·뿔 등 돌출부 포함), 스크린샷으로 미세조정. */
  var VIEWBOX = {
    rabbit:   [-0.55, -1.30, 1.00, 2.28],
    turtle:   [-0.80, -0.25, 1.70, 0.85],
    bear:     [-0.70, -0.88, 1.40, 1.88],
    fox:      [-1.10, -0.95, 1.70, 1.80],
    raccoon:  [-1.18, -0.82, 1.73, 1.67],
    squirrel: [-1.08, -0.85, 1.56, 1.70],
    deer:     [-0.56, -1.16, 1.12, 2.22],
    wolf:     [-1.01, -0.92, 1.56, 1.79],
    duck:     [-0.88, -0.78, 1.76, 1.72],
    tiger:    [-0.59, -0.87, 1.18, 1.78]
  };

  var KINDS = ['rabbit', 'turtle', 'bear', 'fox', 'raccoon', 'squirrel', 'deer', 'wolf', 'duck', 'tiger'];

  function svg(kind) {
    var fn = BUILD[kind];
    if (!fn) return '';
    var L = Layer();
    fn(L);
    var vb = VIEWBOX[kind] || [-1, -1.3, 2, 2.6];
    return '<svg viewBox="' + vb.join(' ') + '" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">' +
      '<g transform="scale(1,-1)">' + L.out() + '</g></svg>';
  }

  window.NM_ANIMALS = { kinds: KINDS, svg: svg };

  if (typeof module !== 'undefined' && module.exports) module.exports = window.NM_ANIMALS;
})();
