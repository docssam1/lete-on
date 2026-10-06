/* G1-7-9호 새 소품 — NM_OBJECTS.register('토큰', function(id){ return '<svg 조각>'; }) (viewBox 0 0 64 64, NM_OBJECTS.helpers 의 P·defs·fill·hl·eye·sw 사용). 화면·인쇄 모두 로드된다.
   기존 16종과 같은 젤리 결(둥근 몸 + 어두운 같은 색 윤곽 + 왼쪽 위 하이라이트)이고, 실사 PNG 는 data/real-art.js 표로 나중에 덮어쓴다.
   토큰: die0(굴리기 전 ?)·die1~die6(주사위 눈) · bead-red/blue/green/yellow(유리구슬) · coin-star/coin-moon(동전 앞·뒷면) · frog(개구리) */
(function () {
  'use strict';
  const O = window.NM_OBJECTS; if (!O || !O.register) return;
  const H = O.helpers, P = H.P, defs = H.defs, fill = H.fill, hl = H.hl, eye = H.eye, sw = H.sw, extra = H.extra;

  /* ── 주사위 눈 1~6 — 눈 배열은 인쇄용 .nm-nl-dice 와 같은 규칙 ── */
  const PIPS = {
    1: [[32, 32]],
    2: [[20, 20], [44, 44]],
    3: [[20, 20], [32, 32], [44, 44]],
    4: [[20, 20], [44, 20], [20, 44], [44, 44]],
    5: [[20, 20], [44, 20], [32, 32], [20, 44], [44, 44]],
    6: [[20, 18], [44, 18], [20, 32], [44, 32], [20, 46], [44, 46]]
  };
  [1, 2, 3, 4, 5, 6].forEach(function (n) {
    O.register('die' + n, function (id) {
      const c = P.white;
      return defs(id, c) +
        '<rect x="6" y="8" width="52" height="52" rx="12" fill="#c9d0dc"/>' +
        '<rect x="6" y="5" width="52" height="52" rx="12" fill="' + fill(id) + '"' + sw(c, 2.4) + '/>' +
        PIPS[n].map(function (p) {
          return '<circle cx="' + p[0] + '" cy="' + (p[1] - 2) + '" r="5.2" fill="' + (n === 1 ? '#e53935' : '#2b3345') + '"/>' +
            '<circle cx="' + (p[0] - 1.6) + '" cy="' + (p[1] - 3.8) + '" r="1.5" fill="#fff" opacity=".55"/>';
        }).join('') + hl(15, 14, 5, 2.4, -35);
    });
  });

  /* 굴리기 전 주사위 — 눈 대신 물음표 */
  O.register('die0', function (id) {
    const c = P.white;
    return defs(id, c) +
      '<rect x="6" y="8" width="52" height="52" rx="12" fill="#c9d0dc"/>' +
      '<rect x="6" y="5" width="52" height="52" rx="12" fill="' + fill(id) + '"' + sw(c, 2.4) + '/>' +
      '<text x="32" y="43" text-anchor="middle" style="font-size:34px;font-weight:900;fill:#16417c;font-family:inherit">?</text>' + hl(15, 14, 5, 2.4, -35);
  });

  /* ── 유리구슬 4색 — 속이 비치는 구와 하이라이트, 안쪽 소용돌이 ── */
  const BEADS = { red: P.red, blue: P.blue, green: P.green, yellow: P.yellow };
  Object.keys(BEADS).forEach(function (name) {
    O.register('bead-' + name, function (id) {
      const c = BEADS[name];
      return defs(id, c) +
        '<circle cx="32" cy="32" r="25" fill="' + fill(id) + '"' + sw(c, 2.4) + '/>' +
        '<path d="M14 36 C20 26 30 40 38 30 C44 24 50 30 51 36" fill="none" stroke="#fff" stroke-width="2.2" opacity=".35" stroke-linecap="round"/>' +
        '<path d="M16 44 C24 40 32 50 46 42" fill="none" stroke="' + c[2] + '" stroke-width="1.6" opacity=".3" stroke-linecap="round"/>' +
        hl(22, 20, 7, 4, -35) + '<circle cx="42" cy="44" r="2.2" fill="#fff" opacity=".5"/>';
    });
  });

  /* ── 동전 앞면(별)·뒷면(달) — 글자·숫자·나라 표식 없이 무늬만 ── */
  O.register('coin-star', function (id) {
    const c = P.yellow;
    return defs(id, c) +
      '<circle cx="32" cy="32" r="26" fill="' + fill(id) + '"' + sw(c, 2.6) + '/>' +
      '<circle cx="32" cy="32" r="19.5" fill="none" stroke="' + c[2] + '" stroke-width="2" opacity=".5"/>' +
      '<path d="M32 17 L36.2 27.4 L47.4 28.2 L38.8 35.4 L41.6 46.2 L32 40.2 L22.4 46.2 L25.2 35.4 L16.6 28.2 L27.8 27.4 Z" fill="' + c[2] + '" opacity=".55"/>' +
      hl(20, 16, 6, 2.6, -35);
  });
  O.register('coin-moon', function (id) {
    const c = P.tan, s = P.yellow;
    return defs(id, s) +
      '<circle cx="32" cy="32" r="26" fill="' + fill(id) + '"' + sw(s, 2.6) + '/>' +
      '<circle cx="32" cy="32" r="19.5" fill="none" stroke="' + s[2] + '" stroke-width="2" opacity=".5"/>' +
      '<path d="M38 15 C25 16 19 29 24 40 C28 49 38 51 45 46 C36 46 29 38 31 29 C32 23 35 18 38 15 Z" fill="' + s[2] + '" opacity=".55"/>' +
      hl(20, 16, 6, 2.6, -35);
  });

  /* ── 개구리 — 수직선 뛰기 ── */
  O.register('frog', function (id) {
    const c = P.green;
    return defs(id, c) +
      '<ellipse cx="14" cy="53" rx="9" ry="5" fill="' + c[1] + '"' + sw(c, 2) + '/>' +
      '<ellipse cx="50" cy="53" rx="9" ry="5" fill="' + c[1] + '"' + sw(c, 2) + '/>' +
      '<ellipse cx="32" cy="40" rx="23" ry="17" fill="' + fill(id) + '"' + sw(c) + '/>' +
      '<circle cx="21" cy="21" r="9" fill="' + c[1] + '"' + sw(c, 2) + '/>' +
      '<circle cx="43" cy="21" r="9" fill="' + c[1] + '"' + sw(c, 2) + '/>' +
      eye(21, 21, 4.2) + eye(43, 21, 4.2) +
      '<path d="M21 40 C27 47 37 47 43 40" fill="none" stroke="' + c[2] + '" stroke-width="2.4" stroke-linecap="round"/>' +
      '<ellipse cx="16" cy="38" rx="3.4" ry="2.2" fill="#ff9e9e" opacity=".7"/><ellipse cx="48" cy="38" rx="3.4" ry="2.2" fill="#ff9e9e" opacity=".7"/>' +
      hl(24, 32, 6, 3, -25);
  });
})();
