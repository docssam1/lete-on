/* ============================================================
   Numbers of Magic — object-art.js
   유아 단계의 '세는 물건'(사과·병아리·별·풍선·물고기·…)을 이모지 글자 대신
   젤리 질감의 원본 SVG로 그린다. 기호 친구(jelly-char.js)와 같은 결:
   둥근 몸 + 어두운 같은 색 윤곽선 + 왼쪽 위 하이라이트 + 부드러운 그라데이션.
   widgets.js 의 art() 한 곳이 이 모듈을 부른다 — 위젯마다 따로 고치지 않는다.
   window.NM_OBJECTS = { svg(token,{size}), has(token), tokens() }
   외부 의존 0. 도형은 전부 직접 그린 것(이모지 폰트·타사 그림 아님).
   ============================================================ */
(function () {
  'use strict';
  var UID = 0;

  /* [밝은색, 기본색, 어두운색(윤곽)] */
  var P = {
    red:    ['#ff8a80', '#e53935', '#8e1b1b'],
    green:  ['#9be39b', '#43a047', '#1f5c25'],
    yellow: ['#fff1a0', '#ffd23f', '#a67c00'],
    orange: ['#ffc58a', '#fb8c2e', '#9a4a00'],
    pink:   ['#ffc1de', '#ec6aa8', '#8c2a5e'],
    purple: ['#d7c2ff', '#8e6bd8', '#4a2f8a'],
    blue:   ['#a8d8ff', '#3b8fe0', '#16417c'],
    tan:    ['#ffe2b0', '#e0a85c', '#7a4f1d'],
    white:  ['#ffffff', '#f1f4f8', '#6b7688'],
    black:  ['#7a8497', '#2b3345', '#0e1320']
  };

  function defs(id, c) {
    return '<defs>' +
      '<radialGradient id="g' + id + '" cx=".34" cy=".28" r=".85"><stop offset="0" stop-color="' + c[0] + '"/><stop offset=".55" stop-color="' + c[1] + '"/><stop offset="1" stop-color="' + c[2] + '"/></radialGradient>' +
      '</defs>';
  }
  function fill(id) { return 'url(#g' + id + ')'; }
  function hl(x, y, rx, ry, rot) {
    return '<ellipse cx="' + x + '" cy="' + y + '" rx="' + rx + '" ry="' + ry + '" fill="#fff" opacity=".62"' +
      (rot ? ' transform="rotate(' + rot + ' ' + x + ' ' + y + ')"' : '') + '/>';
  }
  function eye(x, y, r) {
    r = r || 2.6;
    return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="#1a2233"/><circle cx="' + (x - r * .3) + '" cy="' + (y - r * .35) + '" r="' + (r * .38) + '" fill="#fff"/>';
  }
  function grad(id, name, c) { // 같은 defs 안에 보조 그라데이션이 더 필요할 때
    return '<radialGradient id="' + name + id + '" cx=".34" cy=".28" r=".85"><stop offset="0" stop-color="' + c[0] + '"/><stop offset=".55" stop-color="' + c[1] + '"/><stop offset="1" stop-color="' + c[2] + '"/></radialGradient>';
  }
  function extra(id, list) {
    return '<defs>' + list.map(function (l) { return grad(id, l[0], l[1]); }).join('') + '</defs>';
  }
  function sw(c, w) { return ' stroke="' + c[2] + '" stroke-width="' + (w || 2.2) + '" stroke-linejoin="round" stroke-linecap="round"'; }

  var ART = {
    '🍎': function (id) {
      var c = P.red, g = P.green;
      return defs(id, c) + extra(id, [['l', g]]) +
        '<path d="M32 18 C24 11 8 14 9 33 C10 50 22 58 32 54 C42 58 54 50 55 33 C56 14 40 11 32 18 Z" fill="' + fill(id) + '"' + sw(c) + '/>' +
        '<path d="M32 18 C32 13 34 9 38 6" fill="none"' + sw(P.tan, 3).replace(P.tan[2], '#6b4a1e') + '/>' +
        '<path d="M36 12 C41 5 50 6 52 10 C47 15 40 15 36 12 Z" fill="url(#l' + id + ')"' + sw(g, 1.8) + '/>' +
        hl(20, 28, 5, 9, 25);
    },
    '🐤': function (id) {
      var c = P.yellow, o = P.orange;
      return defs(id, c) +
        '<path d="M26 56 L24 61 M38 56 L40 61" stroke="' + o[2] + '" stroke-width="2.6" stroke-linecap="round"/>' +
        '<ellipse cx="32" cy="36" rx="22" ry="21" fill="' + fill(id) + '"' + sw(c) + '/>' +
        '<path d="M31 12 C29 8 31 6 33 8 C35 6 37 9 34 12" fill="' + c[1] + '"' + sw(c, 1.6) + '/>' +
        '<path d="M26 37 L38 37 L32 44 Z" fill="' + o[1] + '"' + sw(o, 1.8) + '/>' +
        eye(22, 31) + eye(42, 31) +
        '<ellipse cx="17" cy="39" rx="3.4" ry="2.2" fill="#ff9e9e" opacity=".75"/><ellipse cx="47" cy="39" rx="3.4" ry="2.2" fill="#ff9e9e" opacity=".75"/>' +
        '<path d="M8 38 C3 40 5 48 11 47" fill="' + c[1] + '"' + sw(c, 1.8) + '/>' +
        '<path d="M56 38 C61 40 59 48 53 47" fill="' + c[1] + '"' + sw(c, 1.8) + '/>' +
        hl(20, 21, 5, 3, -30);
    },
    '⭐': function (id) {
      var c = P.yellow;
      return defs(id, c) +
        '<path d="M32 5 L39.5 23 L59 24.6 L44.2 37.4 L48.8 56.5 L32 46.4 L15.2 56.5 L19.8 37.4 L5 24.6 L24.5 23 Z" fill="' + fill(id) + '"' + sw(c, 2.6) + '/>' +
        hl(26, 22, 4.5, 2.6, -40) + '<circle cx="32" cy="32" r="0" />';
    },
    '🎈': function (id) {
      var c = P.red;
      return defs(id, c) +
        '<path d="M32 62 C28 56 36 56 32 50" fill="none" stroke="#6b7688" stroke-width="1.8" stroke-linecap="round"/>' +
        '<path d="M32 4 C14 4 8 20 12 32 C16 43 26 48 30 49 L28 53 L36 53 L34 49 C38 48 48 43 52 32 C56 20 50 4 32 4 Z" fill="' + fill(id) + '"' + sw(c) + '/>' +
        hl(22, 20, 4.2, 8, 25);
    },
    '🐟': function (id) {
      var c = P.orange, b = P.blue;
      return defs(id, c) +
        '<path d="M46 32 L61 18 C59 28 59 36 61 46 Z" fill="' + c[1] + '"' + sw(c, 2) + '/>' +
        '<path d="M6 32 C14 12 40 12 48 32 C40 52 14 52 6 32 Z" fill="' + fill(id) + '"' + sw(c) + '/>' +
        '<path d="M30 16 C34 9 40 10 41 15" fill="' + c[1] + '"' + sw(c, 1.8) + '/>' +
        '<path d="M28 20 C31 28 31 36 28 44 M36 22 C38 29 38 35 36 42" fill="none" stroke="' + c[2] + '" stroke-width="1.5" opacity=".45" stroke-linecap="round"/>' +
        eye(16, 28, 2.8) + '<path d="M9 36 C11 38 14 39 16 38" fill="none" stroke="' + c[2] + '" stroke-width="1.6" stroke-linecap="round"/>' +
        hl(22, 22, 5, 2.4, -20);
    },
    '🦋': function (id) {
      var p = P.purple, k = P.pink;
      return defs(id, p) + extra(id, [['k', k]]) +
        '<path d="M32 30 C20 6 4 10 6 26 C8 36 22 36 32 32 Z" fill="' + fill(id) + '"' + sw(p) + '/>' +
        '<path d="M32 30 C44 6 60 10 58 26 C56 36 42 36 32 32 Z" fill="' + fill(id) + '"' + sw(p) + '/>' +
        '<path d="M32 33 C20 34 10 42 16 53 C22 60 30 50 32 36 Z" fill="url(#k' + id + ')"' + sw(k) + '/>' +
        '<path d="M32 33 C44 34 54 42 48 53 C42 60 34 50 32 36 Z" fill="url(#k' + id + ')"' + sw(k) + '/>' +
        '<circle cx="17" cy="20" r="3.6" fill="#fff" opacity=".6"/><circle cx="47" cy="20" r="3.6" fill="#fff" opacity=".6"/>' +
        '<ellipse cx="32" cy="36" rx="3.2" ry="13" fill="#3a2a5e"' + sw(['', '', '#1a1230'], 1.4) + '/>' +
        '<path d="M31 24 C29 16 25 12 22 11 M33 24 C35 16 39 12 42 11" fill="none" stroke="#3a2a5e" stroke-width="1.6" stroke-linecap="round"/>';
    },
    '🌼': function (id) {
      var c = P.pink, y = P.yellow, pet = '';
      for (var i = 0; i < 6; i++) {
        pet += '<ellipse cx="32" cy="14" rx="8.5" ry="12" fill="' + fill(id) + '"' + sw(c, 1.8) + ' transform="rotate(' + (i * 60) + ' 32 32)"/>';
      }
      return defs(id, c) + extra(id, [['y', y]]) + pet +
        '<circle cx="32" cy="32" r="9.5" fill="url(#y' + id + ')"' + sw(y, 2) + '/>' + hl(29, 29, 3, 2, -30);
    },
    '🍓': function (id) {
      var c = P.red, g = P.green, seeds = '';
      [[22, 30], [32, 27], [42, 30], [26, 40], [38, 40], [32, 48], [20, 41], [44, 41]].forEach(function (s) {
        seeds += '<ellipse cx="' + s[0] + '" cy="' + s[1] + '" rx="1.6" ry="2.4" fill="#ffe27a"/>';
      });
      return defs(id, c) + extra(id, [['l', g]]) +
        '<path d="M32 58 C14 50 6 34 9 24 C12 15 22 17 32 20 C42 17 52 15 55 24 C58 34 50 50 32 58 Z" fill="' + fill(id) + '"' + sw(c) + '/>' +
        seeds +
        '<path d="M32 21 L24 12 L30 15 L32 7 L34 15 L40 12 Z" fill="url(#l' + id + ')"' + sw(g, 1.8) + '/>' +
        hl(18, 28, 3.4, 6, 20);
    },
    '🍪': function (id) {
      var c = P.tan, ch = P.black;
      return defs(id, c) +
        '<circle cx="32" cy="32" r="25" fill="' + fill(id) + '"' + sw(c, 2.4) + '/>' +
        [[22, 22, 4], [38, 18, 3.4], [42, 33, 4.2], [26, 38, 3.6], [34, 46, 3.2], [18, 34, 2.8], [47, 44, 2.6]].map(function (d) {
          return '<ellipse cx="' + d[0] + '" cy="' + d[1] + '" rx="' + d[2] + '" ry="' + (d[2] * .8) + '" fill="#4a2c17" transform="rotate(20 ' + d[0] + ' ' + d[1] + ')"/>';
        }).join('') + hl(20, 17, 6, 2.6, -35);
    },
    '🪙': function (id) {
      var c = P.yellow;
      return defs(id, c) +
        '<circle cx="32" cy="32" r="26" fill="' + fill(id) + '"' + sw(c, 2.6) + '/>' +
        '<circle cx="32" cy="32" r="18.5" fill="none" stroke="' + c[2] + '" stroke-width="2" opacity=".55"/>' +
        '<path d="M32 21 L35 29 L43 29.6 L37 35 L39 43 L32 38.6 L25 43 L27 35 L21 29.6 L29 29 Z" fill="' + c[2] + '" opacity=".35"/>' +
        hl(20, 17, 6, 2.6, -35);
    },
    '⚫': function (id) {
      var c = P.black;
      return defs(id, c) + '<circle cx="32" cy="32" r="24" fill="' + fill(id) + '"' + sw(c, 2.2) + '/>' + hl(23, 21, 6, 3.4, -35);
    },
    '🍌': function (id) {
      var c = P.yellow;
      return defs(id, c) +
        '<path d="M10 20 C14 44 34 58 56 46 C58 44 57 41 54 41 C38 46 24 36 22 14 C21 11 17 10 14 12 C11 13 9 17 10 20 Z" fill="' + fill(id) + '"' + sw(c, 2.4) + '/>' +
        '<path d="M14 12 L18 6 L21 9" fill="#6b4a1e" stroke="#3a2610" stroke-width="1.8" stroke-linejoin="round"/>' +
        '<path d="M54 41 L58 44" stroke="#3a2610" stroke-width="3" stroke-linecap="round"/>' +
        hl(20, 26, 2.8, 8, -10);
    },
    '⚽': function (id) {
      var c = P.white, k = '#1f2a3d';
      return defs(id, c) +
        '<circle cx="32" cy="32" r="26" fill="' + fill(id) + '"' + sw(c, 2.2) + '/>' +
        '<polygon points="32,21 40,27 37,36.5 27,36.5 24,27" fill="' + k + '"/>' +
        '<path d="M32 21 L32 8 M40 27 L52 22 M37 36.5 L45 47 M27 36.5 L19 47 M24 27 L12 22" stroke="' + k + '" stroke-width="2.2" stroke-linecap="round"/>' +
        hl(21, 16, 5, 2.4, -35);
    },
    '🏀': function (id) {
      var c = P.orange;
      return defs(id, c) +
        '<circle cx="32" cy="32" r="26" fill="' + fill(id) + '"' + sw(c, 2.2) + '/>' +
        '<path d="M32 6 L32 58 M6 32 L58 32" stroke="#6b3200" stroke-width="2.2" opacity=".7"/>' +
        '<path d="M13 12 C25 22 25 42 13 52 M51 12 C39 22 39 42 51 52" fill="none" stroke="#6b3200" stroke-width="2.2" opacity=".7"/>' +
        hl(21, 15, 5, 2.4, -35);
    },
    '🍬': function (id) {
      var c = P.pink, b = P.blue;
      return defs(id, c) + extra(id, [['b', b]]) +
        '<path d="M14 32 L4 22 L6 42 Z" fill="url(#b' + id + ')"' + sw(b, 1.8) + '/>' +
        '<path d="M50 32 L60 22 L58 42 Z" fill="url(#b' + id + ')"' + sw(b, 1.8) + '/>' +
        '<ellipse cx="32" cy="32" rx="20" ry="15" fill="' + fill(id) + '"' + sw(c) + '/>' +
        '<path d="M22 19 C18 28 18 36 22 45 M32 17 C29 28 29 36 32 47 M42 19 C38 28 38 36 42 45" fill="none" stroke="#fff" stroke-width="2.6" opacity=".55" stroke-linecap="round"/>' +
        hl(22, 24, 4.2, 2.2, -25);
    },
    '🐞': function (id) {
      var c = P.red, k = P.black;
      return defs(id, c) +
        '<circle cx="32" cy="14" r="9" fill="#2b3345"' + sw(k, 1.8) + '/>' +
        eye(28, 13, 1.9) + eye(36, 13, 1.9) +
        '<ellipse cx="32" cy="38" rx="22" ry="21" fill="' + fill(id) + '"' + sw(c) + '/>' +
        '<path d="M32 18 L32 58" stroke="#2b3345" stroke-width="2"/>' +
        [[22, 30, 3.6], [42, 30, 3.6], [20, 44, 3.2], [44, 44, 3.2], [32, 50, 0]].map(function (d) {
          return d[2] ? '<circle cx="' + d[0] + '" cy="' + d[1] + '" r="' + d[2] + '" fill="#2b3345"/>' : '';
        }).join('') + hl(20, 28, 4, 6.5, 25);
    }
  };


  /* ── 숫자 0~9 — 글꼴이 아니라 직접 그은 획(둥근 끝)으로. 5가지 모양(f0~f4)은 색·굵기·장식이 다르다 ── */
  var DIGIT_D = {
    '0': 'M20 6 C6 6 6 50 20 50 C34 50 34 6 20 6 Z',
    '1': 'M11 17 L22 6 L22 50',
    '2': 'M8 17 C8 3 32 3 32 18 C32 31 8 38 8 50 L32 50',
    '3': 'M9 8 L30 8 L19 23 C35 21 36 49 19 50 C12 50 8 47 7 42',
    '4': 'M28 50 L28 6 L6 36 L36 36',
    '5': 'M31 7 L11 7 L9 26 C27 18 38 33 30 44 C24 52 12 50 8 44',
    '6': 'M30 9 C16 5 8 20 8 34 C8 54 34 54 32 36 C30 23 11 24 8 34',
    '7': 'M7 8 L34 8 L16 50',
    '8': 'M20 28 C8 26 8 6 20 6 C32 6 32 26 20 28 C6 30 6 50 20 50 C34 50 34 30 20 28 Z',
    '9': 'M32 22 C32 4 8 4 8 18 C8 32 32 34 32 22 C32 40 26 50 12 50'
  };
  var DIGIT_STYLE = [
    { c: '#3b8fe0', o: '#16417c', w: 11 },
    { c: '#ec6aa8', o: '#8c2a5e', w: 9 },
    { c: '#fb8c2e', o: '#9a4a00', w: 12 },
    { c: '#43a047', o: '#1f5c25', w: 10 },
    { c: '#8e6bd8', o: '#4a2f8a', w: 11 }
  ];
  function digitSvg(d, f) {
    var path = DIGIT_D[d]; if (!path) return '';
    var s = DIGIT_STYLE[(f | 0) % DIGIT_STYLE.length];
    var inner;
    if ((f | 0) % 5 === 1) {            /* 속이 빈 글자 — 어두운 윤곽 + 흰 속 */
      inner = '<path d="' + path + '" fill="none" stroke="' + s.o + '" stroke-width="' + (s.w + 5) + '" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<path d="' + path + '" fill="none" stroke="#fff" stroke-width="' + (s.w - 1) + '" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<path d="' + path + '" fill="none" stroke="' + s.c + '" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="1 7" opacity=".9"/>';
    } else {
      inner = '<path d="' + path + '" fill="none" stroke="' + s.o + '" stroke-width="' + (s.w + 4.5) + '" stroke-linecap="round" stroke-linejoin="round" transform="translate(1.6 2.2)" opacity=".35"/>' +
        '<path d="' + path + '" fill="none" stroke="' + s.o + '" stroke-width="' + (s.w + 4) + '" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<path d="' + path + '" fill="none" stroke="' + s.c + '" stroke-width="' + s.w + '" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<path d="' + path + '" fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" opacity=".55" transform="translate(-2 -2)"/>';
    }
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-9 -8 58 70" class="nm-obj-svg nm-obj-dg" aria-hidden="true" focusable="false" style="overflow:visible">' + inner + '</svg>';
  }

  /* 실사 PNG(assets/images/real/, data/real-art.js 표) 가 있으면 그것을, 없으면 아래 직접 그린 SVG 를. */
  function realImg(token, opts) {
    var m = window.NM_REAL_ART, f = m && m[token + (opts && opts.f != null && String(token).indexOf('num:') === 0 ? '#' + (opts.f | 0) : '')] || (m && m[token]);
    if (!f) return '';
    return '<img src="assets/images/real/' + f + '" alt="" draggable="false" class="nm-obj-img" style="width:100%;height:100%;object-fit:contain;display:block">';
  }
  function svg(token, opts) {
    var real = realImg(token, opts);
    if (real) return real;
    if (typeof token === 'string' && token.indexOf('num:') === 0) return digitSvg(token.slice(4), opts && opts.f);
    var f = ART[token];
    if (!f) return '';
    UID += 1;
    var size = (opts && opts.size) || null;
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" class="nm-obj-svg"' +
      (size ? ' width="' + size + '" height="' + size + '"' : '') +
      ' aria-hidden="true" focusable="false" style="overflow:visible">' + f('o' + UID) + '</svg>';
  }

  window.NM_OBJECTS = {
    /* 확장 소품 등록 — 유아 교재 묶음 파일(app/g1/*.art.js)이 새 물건을 같은 결로 그려 넣는다.
       draw(id) 는 viewBox 0 0 64 64 안에 그린 SVG 조각 문자열을 돌려준다(id 는 그라데이션 id 접두). */
    register: function (token, draw) { if (typeof draw === 'function') ART[token] = draw; },
    helpers: { P: P, defs: defs, fill: fill, hl: hl, eye: eye, extra: extra, sw: sw },
    svg: svg,
    real: function (t) { return !!realImg(t); },
    has: function (t) { return !!realImg(t) || (typeof t === 'string' && t.indexOf('num:') === 0 && !!DIGIT_D[t.slice(4)]) || Object.prototype.hasOwnProperty.call(ART, t); },
    tokens: function () { return Object.keys(ART); }
  };
})();
