/* G1-10-12호 새 소품 — NM_OBJECTS.register('토큰', function(id){ return '<svg 조각>'; }) (viewBox 0 0 64 64).
   기존 16종과 같은 젤리 결(둥근 몸 + 어두운 같은 색 윤곽선 + 왼쪽 위 하이라이트 + 부드러운 그라데이션).
   참외·수박·포도(조사하기 6쪽 과일 격자) · 맑음·흐림·비(분류하기 12쪽 날씨표).
   실사 PNG 는 나중에 data/real-art.js 표(토큰 → 파일)가 이 SVG 를 덮어쓴다 — 이 SVG 는 임시지만 보기 좋게. 화면·인쇄 모두 로드된다. */
(function () {
  'use strict';
  var O = window.NM_OBJECTS;
  if (!O || !O.register || !O.helpers) return;
  var H = O.helpers, P = H.P, defs = H.defs, fill = H.fill, hl = H.hl, extra = H.extra, sw = H.sw;

  /* 참외 — 노란 몸통에 흰 세로줄, 위에 작은 꼭지 */
  O.register('melon', function (id) {
    var c = P.yellow, o = P.orange;
    return defs(id, c) +
      '<ellipse cx="32" cy="35" rx="20" ry="24" fill="' + fill(id) + '"' + sw(c, 2.4) + '/>' +
      '<path d="M32 12 C27 26 27 44 32 58 M22 15 C14 28 14 42 22 56 M42 15 C50 28 50 42 42 56" fill="none" stroke="#fffbe6" stroke-width="2.6" opacity=".85" stroke-linecap="round"/>' +
      '<path d="M32 12 C32 8 34 6 37 5" fill="none" stroke="#6b4a1e" stroke-width="3" stroke-linecap="round"/>' +
      '<ellipse cx="32" cy="58" rx="3" ry="1.6" fill="' + o[2] + '" opacity=".45"/>' +
      hl(22, 24, 4, 8, 20);
  });

  /* 수박 — 한 조각(빨간 속살 + 초록 껍질 + 씨) */
  O.register('watermelon', function (id) {
    var r = P.red, g = P.green;
    return defs(id, r) + extra(id, [['g', g]]) +
      '<path d="M5 24 C7 46 19 58 32 58 C45 58 57 46 59 24 Z" fill="url(#g' + id + ')"' + sw(g, 2.4) + '/>' +
      '<path d="M9 24 C11 42 21 53 32 53 C43 53 53 42 55 24 Z" fill="#fff3d6"/>' +
      '<path d="M11 24 C13 40 22 49 32 49 C42 49 51 40 53 24 Z" fill="' + fill(id) + '"/>' +
      '<path d="M5 24 L59 24" stroke="' + g[2] + '" stroke-width="2.6" stroke-linecap="round"/>' +
      [[22, 32], [32, 28], [42, 32], [27, 40], [37, 40]].map(function (s) {
        return '<ellipse cx="' + s[0] + '" cy="' + s[1] + '" rx="1.9" ry="3" fill="#2b2230" transform="rotate(-15 ' + s[0] + ' ' + s[1] + ')"/>';
      }).join('') +
      hl(17, 31, 3, 5, 25);
  });

  /* 포도 — 보라 알갱이가 역삼각형으로 모인 송이 + 줄기와 잎 */
  O.register('grapes', function (id) {
    var c = P.purple, g = P.green, balls = '';
    [[19, 25], [32, 25], [45, 25], [25.5, 37.5], [38.5, 37.5], [32, 50]].forEach(function (b) {
      balls += '<circle cx="' + b[0] + '" cy="' + b[1] + '" r="9" fill="' + fill(id) + '"' + sw(c, 2) + '/>' +
        '<ellipse cx="' + (b[0] - 3) + '" cy="' + (b[1] - 3.4) + '" rx="2.2" ry="1.4" fill="#fff" opacity=".6" transform="rotate(-30 ' + (b[0] - 3) + ' ' + (b[1] - 3.4) + ')"/>';
    });
    return defs(id, c) + extra(id, [['l', g]]) +
      '<path d="M32 14 C32 9 34 6 38 4" fill="none" stroke="#6b4a1e" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M36 8 C42 1 53 3 55 8 C49 14 41 14 36 8 Z" fill="url(#l' + id + ')"' + sw(g, 1.8) + '/>' +
      balls;
  });

  /* 맑음 — 노란 해와 둥근 광선 */
  O.register('weather-sun', function (id) {
    var c = P.yellow, o = P.orange, rays = '';
    for (var i = 0; i < 8; i++) {
      rays += '<path d="M32 3 L36 12 L28 12 Z" fill="' + o[1] + '"' + sw(o, 1.6) + ' transform="rotate(' + (i * 45) + ' 32 32)"/>';
    }
    return defs(id, c) + rays +
      '<circle cx="32" cy="32" r="16" fill="' + fill(id) + '"' + sw(c, 2.4) + '/>' +
      hl(26, 26, 5, 3, -35);
  });

  /* 흐림 — 회청색 구름 */
  O.register('weather-cloud', function (id) {
    var c = ['#f2f5fa', '#b6c3d6', '#566680'];
    return defs(id, c) +
      '<path d="M16 46 C6 46 4 32 14 29 C14 17 30 12 36 22 C46 16 58 24 54 36 C62 38 60 46 52 46 Z" fill="' + fill(id) + '"' + sw(c, 2.4) + '/>' +
      hl(22, 27, 6, 3, -25);
  });

  /* 비 — 먹구름 + 파란 빗방울 */
  O.register('weather-rain', function (id) {
    var c = ['#dbe3ee', '#8e9db6', '#3f4c66'], b = P.blue, drops = '';
    [[18, 52], [32, 56], [46, 52]].forEach(function (d) {
      drops += '<path d="M' + d[0] + ' ' + (d[1] - 6) + ' C' + (d[0] + 5) + ' ' + (d[1] - 1) + ' ' + (d[0] + 4) + ' ' + (d[1] + 5) + ' ' + d[0] + ' ' + (d[1] + 5) +
        ' C' + (d[0] - 4) + ' ' + (d[1] + 5) + ' ' + (d[0] - 5) + ' ' + (d[1] - 1) + ' ' + d[0] + ' ' + (d[1] - 6) + ' Z" fill="' + b[1] + '"' + sw(b, 1.6) + '/>';
    });
    return defs(id, c) +
      '<path d="M16 38 C6 38 4 24 14 21 C14 9 30 4 36 14 C46 8 58 16 54 28 C62 30 60 38 52 38 Z" fill="' + fill(id) + '"' + sw(c, 2.4) + '/>' +
      drops + hl(22, 19, 6, 3, -25);
  });
})();
