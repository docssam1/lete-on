/* ============================================================
   Numbers of Magic — 종이 교구(Paper Tools) · 2026-09-08
   원장: "교구 학습도 있으면 좋겠어" → "쿠팡이나 네이버 수학 교구는 너무 비싸"

   왜 사는 대신 인쇄인가.
   파는 교구가 비싼 이유는 사출과 유통이지 활동 자체가 아니다. 우리는 이미 매주 인쇄물을
   보내므로, 그 뒤에 한 쪽 더 붙이면 학부모 비용이 0원이다. 게다가 열 개씩 묶어 보는
   행위(빨대·종이 십막대)는 완제품 십진블록보다 오히려 자릿값을 더 잘 보여 준다.

   ── 규칙 ──
   - 순수 함수만. DOM·window 상태에 손대지 않는다(ws.html 에는 앱이 없다).
   - 그림은 전부 **원본 도형**(rect·circle·line·path). 어떤 교재의 그림도 베끼지 않는다.
   - 치수는 mm. A4 좌우 여백을 빼고 쓸 수 있는 폭은 약 180mm 로 잡는다.
   - 자르는 선은 점선(dash), 접는 선은 짧은 점선 + 회색. 흑백 프린터를 기준으로 그린다
     (색으로만 구분되는 표시를 두지 않는다).
   - courses 범위는 겹치지 않는다. 먼저 맞는 것 하나만 그 주 학습지에 붙는다.
   ============================================================ */
(function(){
'use strict';

var CUT = 'fill:none;stroke:#1A2233;stroke-width:.5;stroke-dasharray:2.5 1.6';
/* 작은 조각(낱개·동그라미)은 점선 간격을 줄인다 — 6mm 사각형에 2.5mm 점선을 쓰면 모서리가 끊겨 보인다. */
var CUT_S = 'fill:none;stroke:#1A2233;stroke-width:.45;stroke-dasharray:1.2 .9';
var LINE = 'fill:none;stroke:#1A2233;stroke-width:.4';
var THIN = 'fill:none;stroke:#8a92a3;stroke-width:.25';
var TXT = 'font-family:Pretendard,sans-serif;font-size:3.4px;fill:#4a5468';

function svg(w, h, body){
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + ' ' + h + '" ' +
    'width="' + w + 'mm" height="' + h + 'mm" role="img" aria-hidden="true">' + body + '</svg>';
}
function rect(x, y, w, h, style){ return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" style="' + style + '"/>'; }
function label(x, y, t){ return '<text x="' + x + '" y="' + y + '" style="' + TXT + '">' + t + '</text>'; }

/* 1. 십틀 — 5칸씩 두 줄. 10을 "채워야 할 자리"로 보게 한다. */
function tenFrame(){
  var c = 15, ox = 6, oy = 8, b = '';
  for(var f = 0; f < 2; f++){
    var y0 = oy + f * (c * 2 + 14);
    b += label(ox, y0 - 2, f === 0 ? '십틀 1' : '십틀 2');
    b += rect(ox, y0, c * 5, c * 2, CUT);
    for(var i = 1; i < 5; i++) b += '<line x1="' + (ox + c * i) + '" y1="' + y0 + '" x2="' + (ox + c * i) + '" y2="' + (y0 + c * 2) + '" style="' + LINE + '"/>';
    b += '<line x1="' + ox + '" y1="' + (y0 + c) + '" x2="' + (ox + c * 5) + '" y2="' + (y0 + c) + '" style="' + LINE + '"/>';
  }
  /* 동그라미 20개 — 오려서 칸에 올린다 */
  var sy = oy + (c * 2 + 14) * 2 - 2;
  b += label(ox, sy - 2, '동그라미 20개 — 오려서 칸에 올려요');
  for(var r = 0; r < 2; r++) for(var k = 0; k < 10; k++){
    b += '<circle cx="' + (ox + 6 + k * 13) + '" cy="' + (sy + 6 + r * 13) + '" r="5.5" style="' + CUT_S + '"/>';
  }
  return svg(180, sy + 26, b);
}

/* 2. 십진 묶음 — 100판 1개 · 10막대 8개 · 낱개 20개. 열 개를 묶는 행위가 자릿값이다. */
function placeValue(){
  var b = '', ox = 6, oy = 10, u = 6;
  b += label(ox, oy - 3, '백 판 (10 × 10)');
  b += rect(ox, oy, u * 10, u * 10, CUT);
  for(var i = 1; i < 10; i++){
    b += '<line x1="' + (ox + u * i) + '" y1="' + oy + '" x2="' + (ox + u * i) + '" y2="' + (oy + u * 10) + '" style="' + THIN + '"/>';
    b += '<line x1="' + ox + '" y1="' + (oy + u * i) + '" x2="' + (ox + u * 10) + '" y2="' + (oy + u * i) + '" style="' + THIN + '"/>';
  }
  var bx = ox + u * 10 + 14;
  b += label(bx, oy - 3, '십 막대 8개');
  for(var m = 0; m < 8; m++){
    var x = bx + m * (u + 5);
    b += rect(x, oy, u, u * 10, CUT);
    for(var j = 1; j < 10; j++) b += '<line x1="' + x + '" y1="' + (oy + u * j) + '" x2="' + (x + u) + '" y2="' + (oy + u * j) + '" style="' + THIN + '"/>';
  }
  var sy = oy + u * 10 + 12;
  b += label(ox, sy - 3, '낱개 20개');
  for(var r = 0; r < 2; r++) for(var k = 0; k < 10; k++) b += rect(ox + k * (u + 4), sy + r * (u + 4), u, u, CUT_S);
  return svg(180, sy + (u + 4) * 2 + 8, b);
}

/* 3. 수직선 띠 — 0~20 두 개(뛰어세기·덧뺄), 0~100 한 개(십의 자리로 건너뛰기). */
function numberLine(){
  var b = '', ox = 8, y = 14, w = 164;
  function strip(y0, from, to, step, title){
    var n = (to - from) / step, dx = w / n;
    b += label(ox, y0 - 8, title);
    b += rect(ox - 3, y0 - 6, w + 6, 14, CUT);
    b += '<line x1="' + ox + '" y1="' + y0 + '" x2="' + (ox + w) + '" y2="' + y0 + '" style="' + LINE + '"/>';
    for(var i = 0; i <= n; i++){
      var x = ox + dx * i, big = (i % 5 === 0);
      b += '<line x1="' + x + '" y1="' + (y0 - (big ? 3.5 : 2)) + '" x2="' + x + '" y2="' + (y0 + (big ? 3.5 : 2)) + '" style="' + LINE + '"/>';
      if(big) b += '<text x="' + x + '" y="' + (y0 + 7) + '" text-anchor="middle" style="' + TXT + '">' + (from + step * i) + '</text>';
    }
  }
  strip(y, 0, 20, 1, '0 → 20');
  strip(y + 26, 0, 20, 1, '0 → 20 (한 장 더)');
  strip(y + 52, 0, 100, 5, '0 → 100 (다섯씩)');
  /* 뛰는 화살표 표시 — 손으로 그려 보라는 안내용 얇은 곡선 하나 */
  b += label(ox, y + 74, '연필로 뛴 자리를 곡선으로 이어 보세요.');
  return svg(180, y + 82, b);
}

/* 4. 곱셈 배열판 — 10×10 점 격자와 ㄱ자 가림판 2장. 3×4 를 "직사각형"으로 본다. */
function arrayBoard(){
  var b = '', ox = 8, oy = 12, u = 12;
  b += label(ox, oy - 3, '배열판 (10 × 10)');
  b += rect(ox - 3, oy - 3, u * 10 + 6, u * 10 + 6, CUT);
  for(var r = 0; r < 10; r++) for(var c = 0; c < 10; c++)
    b += '<circle cx="' + (ox + u * c + u / 2) + '" cy="' + (oy + u * r + u / 2) + '" r="2.2" style="fill:#1A2233"/>';
  var gx = ox + u * 10 + 12;
  b += label(gx, oy - 3, 'ㄱ자 가림판 2장');
  for(var g = 0; g < 2; g++){
    var y0 = oy + g * 44;
    /* ㄱ자: 가로 팔 + 세로 팔 */
    b += '<path d="M' + gx + ' ' + y0 + ' h34 v10 h-24 v24 h-10 z" style="' + CUT + '"/>';
  }
  b += label(ox, oy + 132, '가림판 두 장을 겹쳐 만든 직사각형이 곱셈이에요.');
  return svg(180, oy + u * 10 + 26, b);
}

/* 5. 등식 저울판 — 양팔 저울 그림 위에 수 카드를 올려 "="을 눈으로 맞춘다.
   원장 2026-09-08: 사는 쪽 예로 양팔 저울을 들었다. 저울은 =를 "답이 나온다"가 아니라
   "양쪽이 같다"로 보게 하는 유일한 교구다(과정 11~12 역연산·네모 구하기와 직결). */
function balanceMat(){
  var b = '', cx = 90, top = 16, arm = 62, pan = 30, panY = 78; // panY: 기둥 받침(top+52) 아래로
  b += '<path d="M' + (cx - 12) + ' ' + (top + 44) + ' h24 l-6 -40 h-12 z" style="' + LINE + '"/>';
  b += '<path d="M' + (cx - 22) + ' ' + (top + 52) + ' h44 v4 h-44 z" style="' + LINE + '"/>';
  b += '<line x1="' + (cx - arm) + '" y1="' + top + '" x2="' + (cx + arm) + '" y2="' + top + '" style="fill:none;stroke:#1A2233;stroke-width:1"/>';
  b += '<circle cx="' + cx + '" cy="' + top + '" r="2.4" style="fill:#1A2233"/>';
  [-1, 1].forEach(function(s){
    var x = cx + s * arm;
    b += '<line x1="' + x + '" y1="' + top + '" x2="' + x + '" y2="' + (top + 14) + '" style="' + LINE + '"/>';
    b += '<path d="M' + (x - pan / 2) + ' ' + (top + 14) + ' h' + pan + ' l-5 8 h-' + (pan - 10) + ' z" style="' + LINE + '"/>';
    b += rect(x - pan / 2 - 4, panY, pan + 8, 26, THIN);
    b += '<text x="' + x + '" y="' + (panY + 15) + '" text-anchor="middle" style="' + TXT + '">' + (s < 0 ? '왼쪽 접시' : '오른쪽 접시') + '</text>';
  });
  b += '<text x="' + cx + '" y="' + (panY + 16) + '" text-anchor="middle" style="font-family:Pretendard,sans-serif;font-size:10px;font-weight:800;fill:#0E2C57">=</text>';
  var sy = panY + 38, cw = 18, ch = 15, cols = 8; // cw 20 이면 여덟 장이 180mm 를 넘어 마지막 카드가 잘렸다
  b += label(8, sy - 3, '수 카드 — 오려서 접시에 올려요');
  var cards = ['0','1','2','3','4','5','6','7','8','9','10','+','\u2212','\u00d7','\u00f7','\u25a1'];
  cards.forEach(function(c, i){
    var x = 8 + (i % cols) * (cw + 2.5), y = sy + Math.floor(i / cols) * (ch + 4);
    b += rect(x, y, cw, ch, CUT);
    b += '<text x="' + (x + cw / 2) + '" y="' + (y + ch / 2 + 3) + '" text-anchor="middle" style="font-family:Pretendard,sans-serif;font-size:8px;font-weight:700;fill:#1A2233">' + c + '</text>';
  });
  return svg(180, sy + (ch + 4) * 2 + 10, b);
}

/* 5. 분수 원판 — 1 · 1/2 · 1/3 · 1/4 · 1/6 · 1/8. 겹쳐서 크기를 비교한다. */
function fractionDisc(){
  var b = '', R = 26, parts = [1, 2, 3, 4, 6, 8], cols = 3;
  parts.forEach(function(n, i){
    var cx = 32 + (i % cols) * 58, cy = 34 + Math.floor(i / cols) * 62;
    b += '<circle cx="' + cx + '" cy="' + cy + '" r="' + R + '" style="' + CUT + '"/>';
    for(var k = 0; k < n && n > 1; k++){
      var a = (Math.PI * 2 * k) / n - Math.PI / 2;
      b += '<line x1="' + cx + '" y1="' + cy + '" x2="' + (cx + R * Math.cos(a)).toFixed(2) + '" y2="' + (cy + R * Math.sin(a)).toFixed(2) + '" style="' + LINE + '"/>';
    }
    b += '<text x="' + cx + '" y="' + (cy + R + 7) + '" text-anchor="middle" style="' + TXT + '">' + (n === 1 ? '1 (전체)' : '1/' + n + ' 조각 ' + n + '개') + '</text>';
  });
  return svg(180, 34 + 62 * 2 + 12, b);
}

/* 6. 소수 모눈 — 1을 100칸으로. 0.1 띠는 **판의 한 줄과 정확히 같은 크기**여야 덮어 볼 수 있다
   (2026-09-08 첫 판은 띠가 작은 사각형이라 판과 안 맞았다 — 교구로서 틀린 그림이었다). */
function decimalGrid(){
  var b = '', u = 7, ox = 8, oy = 12, side = u * 10;
  for(var g = 0; g < 2; g++){
    var x0 = ox + g * (side + 20);
    b += label(x0, oy - 3, '1 = 100칸  (' + (g + 1) + ')');
    b += rect(x0, oy, side, side, CUT);
    for(var i = 1; i < 10; i++){
      var st = (i === 5) ? LINE : THIN;
      b += '<line x1="' + (x0 + u * i) + '" y1="' + oy + '" x2="' + (x0 + u * i) + '" y2="' + (oy + side) + '" style="' + st + '"/>';
      b += '<line x1="' + x0 + '" y1="' + (oy + u * i) + '" x2="' + (x0 + side) + '" y2="' + (oy + u * i) + '" style="' + st + '"/>';
    }
  }
  var sy = oy + side + 14;
  b += label(ox, sy - 3, '0.1 띠 10개 — 판의 한 줄과 크기가 같아요. 오려서 덮어 보세요');
  for(var k = 0; k < 10; k++){
    var cx = ox + (k % 2) * (side + 20), cy = sy + Math.floor(k / 2) * (u + 4);
    b += rect(cx, cy, side, u, CUT);
    for(var j = 1; j < 10; j++)
      b += '<line x1="' + (cx + u * j) + '" y1="' + cy + '" x2="' + (cx + u * j) + '" y2="' + (cy + u) + '" style="' + THIN + '"/>';
  }
  return svg(180, sy + (u + 4) * 5 + 8, b);
}


/* 7. 펜토미노 12조각 + 6×10 판 — 경시의 탑(과정 26~28). 원장이 준 교재 목록에도 표준으로 들어 있다.
   조각 경계만 자르는 선이고 안쪽 칸 금은 얇은 선이다(칸마다 자르면 조각이 부서진다). */
function pentomino(){
  var S = {
    F:[[1,0],[2,0],[0,1],[1,1],[1,2]], I:[[0,0],[0,1],[0,2],[0,3],[0,4]],
    L:[[0,0],[0,1],[0,2],[0,3],[1,3]], N:[[1,0],[1,1],[0,1],[0,2],[0,3]],
    P:[[0,0],[1,0],[0,1],[1,1],[0,2]], T:[[0,0],[1,0],[2,0],[1,1],[1,2]],
    U:[[0,0],[2,0],[0,1],[1,1],[2,1]], V:[[0,0],[0,1],[0,2],[1,2],[2,2]],
    W:[[0,0],[0,1],[1,1],[1,2],[2,2]], X:[[1,0],[0,1],[1,1],[2,1],[1,2]],
    Y:[[1,0],[1,1],[0,1],[1,2],[1,3]], Z:[[0,0],[1,0],[1,1],[1,2],[2,2]]
  };
  var u = 6, b = '', keys = Object.keys(S), ox = 6, oy = 14;
  b += label(ox, oy - 4, '6 × 10 판');
  b += rect(ox, oy, u * 6, u * 10, LINE);
  for(var i = 1; i < 6; i++) b += '<line x1="' + (ox + u * i) + '" y1="' + oy + '" x2="' + (ox + u * i) + '" y2="' + (oy + u * 10) + '" style="' + THIN + '"/>';
  for(var j = 1; j < 10; j++) b += '<line x1="' + ox + '" y1="' + (oy + u * j) + '" x2="' + (ox + u * 6) + '" y2="' + (oy + u * j) + '" style="' + THIN + '"/>';
  var px = ox + u * 6 + 12, py = oy - 4, colw = 26, rowh = 32;
  b += label(px, py, '조각 12개 — 굵은 점선만 오려요 (안쪽 얇은 금은 그냥 둡니다)');
  keys.forEach(function(k, n){
    var gx = px + (n % 5) * colw, gy = py + 4 + Math.floor(n / 5) * rowh;
    var cells = S[k], has = {};
    cells.forEach(function(c){ has[c[0] + ',' + c[1]] = 1; });
    cells.forEach(function(c){
      var x = gx + c[0] * u, y = gy + c[1] * u;
      b += rect(x, y, u, u, THIN);
      /* 이웃이 없는 변만 자르는 선 */
      if(!has[(c[0]) + ',' + (c[1] - 1)]) b += '<line x1="' + x + '" y1="' + y + '" x2="' + (x + u) + '" y2="' + y + '" style="' + CUT + '"/>';
      if(!has[(c[0]) + ',' + (c[1] + 1)]) b += '<line x1="' + x + '" y1="' + (y + u) + '" x2="' + (x + u) + '" y2="' + (y + u) + '" style="' + CUT + '"/>';
      if(!has[(c[0] - 1) + ',' + (c[1])]) b += '<line x1="' + x + '" y1="' + y + '" x2="' + x + '" y2="' + (y + u) + '" style="' + CUT + '"/>';
      if(!has[(c[0] + 1) + ',' + (c[1])]) b += '<line x1="' + (x + u) + '" y1="' + y + '" x2="' + (x + u) + '" y2="' + (y + u) + '" style="' + CUT + '"/>';
    });
    b += '<text x="' + gx + '" y="' + (gy - 1.5) + '" style="' + TXT + '">' + k + '</text>';
  });
  return svg(180, oy + u * 10 + 10, b);
}

/* 8. 정수 수직선 — 0 을 가운데 두고 양쪽으로. 음수는 "작은 수"가 아니라 반대 방향이다(과정 29~31). */
function intLine(){
  var b = '', ox = 8, w = 164, y = 16;
  function strip(y0, title){
    var n = 20, dx = w / n;
    b += label(ox, y0 - 8, title);
    b += rect(ox - 3, y0 - 6, w + 6, 16, CUT);
    b += '<line x1="' + ox + '" y1="' + y0 + '" x2="' + (ox + w) + '" y2="' + y0 + '" style="' + LINE + '"/>';
    for(var i = 0; i <= n; i++){
      var v = i - 10, x = ox + dx * i, big = (v % 5 === 0);
      b += '<line x1="' + x + '" y1="' + (y0 - (big ? 4 : 2)) + '" x2="' + x + '" y2="' + (y0 + (big ? 4 : 2)) + '" style="' + LINE + '"/>';
      if(big) b += '<text x="' + x + '" y="' + (y0 + 9) + '" text-anchor="middle" style="' + TXT + '">' + (v > 0 ? '+' + v : v) + '</text>';
    }
    b += '<circle cx="' + (ox + dx * 10) + '" cy="' + y0 + '" r="1.8" style="fill:#0E2C57"/>';
  }
  strip(y, '\u221210 \u2190 0 \u2192 +10');
  strip(y + 30, '\u221210 \u2190 0 \u2192 +10 (한 장 더)');
  var sy = y + 56, cw = 20, ch = 14;
  b += label(ox, sy - 3, '이동 카드 — 오려서 뽑아 쓰세요');
  var moves = ['+1','+2','+3','+5','+7','\u22121','\u22122','\u22123','\u22125','\u22127','+10','\u221210'];
  moves.forEach(function(m, i){
    var x = ox + (i % 6) * (cw + 6), yy = sy + Math.floor(i / 6) * (ch + 5);
    b += rect(x, yy, cw, ch, CUT);
    b += '<text x="' + (x + cw / 2) + '" y="' + (yy + ch / 2 + 3) + '" text-anchor="middle" style="font-family:Pretendard,sans-serif;font-size:8px;font-weight:700;fill:#1A2233">' + m + '</text>';
  });
  b += label(ox, sy + (ch + 5) * 2 + 6, '카드를 뽑아 말을 옮기고, 어디에 서는지 봅니다. 뺄셈은 반대 방향으로 갑니다.');
  return svg(180, sy + (ch + 5) * 2 + 14, b);
}

/* 9. 대수 타일 — x² · x · 1. 다항식을 넓이로 본다(과정 32~35). 인수분해는 직사각형 맞추기가 된다. */
function algebraTiles(){
  var b = '', ox = 8, oy = 14, X = 26, U = 8;
  /* 한 줄에 다 넣으면 x 타일이 180mm 를 넘는다(2026-09-08 실측) — 세 줄로 쌓는다. */
  b += label(ox, oy - 4, 'x\u00b2 타일 4개 (한 변 x)');
  for(var i = 0; i < 4; i++){
    var x = ox + i * (X + 5);
    b += rect(x, oy, X, X, CUT);
    b += '<text x="' + (x + X / 2) + '" y="' + (oy + X / 2 + 3) + '" text-anchor="middle" style="font-family:Pretendard,sans-serif;font-size:9px;font-weight:700;fill:#1A2233">x\u00b2</text>';
  }
  var y2 = oy + X + 12;
  b += label(ox, y2 - 4, 'x 타일 8개 (x \u00d7 1)');
  for(var j = 0; j < 8; j++){
    var xx = ox + j * (U + 5);
    b += rect(xx, y2, U, X, CUT);
    b += '<text x="' + (xx + U / 2) + '" y="' + (y2 + X / 2 + 3) + '" text-anchor="middle" style="font-family:Pretendard,sans-serif;font-size:8px;font-weight:700;fill:#1A2233">x</text>';
  }
  var sy = y2 + X + 12;
  b += label(ox, sy - 4, '1 타일 20개 (1 \u00d7 1)');
  for(var k = 0; k < 20; k++){
    var x2 = ox + (k % 10) * (U + 4), y3 = sy + Math.floor(k / 10) * (U + 4);
    b += rect(x2, y3, U, U, CUT_S);
  }
  b += label(ox, sy + (U + 4) * 2 + 8, 'x\u00b2 + 3x + 2 \ub97c \ud0c0\uc77c\ub85c \uae54\uace0 \uc9c1\uc0ac\uac01\ud615\uc744 \ub9cc\ub4e4\uc5b4 \ubcf4\uc138\uc694 \u2014 \uac00\ub85c\uc640 \uc138\ub85c\uac00 (x+1)(x+2) \uc785\ub2c8\ub2e4.');
  return svg(180, sy + (U + 4) * 2 + 14, b);
}

/* 10. 좌표 모눈판 — 사분면. 점과 직선·원을 손으로 찍어 본다(과정 36~39). */
function coordGrid(){
  var b = '', u = 7, n = 20, side = u * n, ox = (180 - side) / 2, oy = 12, cx = ox + side / 2, cy = oy + side / 2;
  b += label(ox, oy - 4, '좌표판 (\u221210 \u2264 x, y \u2264 10)');
  b += rect(ox, oy, side, side, CUT);
  for(var i = 1; i < n; i++){
    b += '<line x1="' + (ox + u * i) + '" y1="' + oy + '" x2="' + (ox + u * i) + '" y2="' + (oy + side) + '" style="' + THIN + '"/>';
    b += '<line x1="' + ox + '" y1="' + (oy + u * i) + '" x2="' + (ox + side) + '" y2="' + (oy + u * i) + '" style="' + THIN + '"/>';
  }
  b += '<line x1="' + ox + '" y1="' + cy + '" x2="' + (ox + side) + '" y2="' + cy + '" style="fill:none;stroke:#1A2233;stroke-width:.7"/>';
  b += '<line x1="' + cx + '" y1="' + oy + '" x2="' + cx + '" y2="' + (oy + side) + '" style="fill:none;stroke:#1A2233;stroke-width:.7"/>';
  for(var v = -10; v <= 10; v += 5){
    if(!v) continue;
    b += '<text x="' + (cx + u * v) + '" y="' + (cy + 5) + '" text-anchor="middle" style="' + TXT + '">' + v + '</text>';
    b += '<text x="' + (cx - 3) + '" y="' + (cy - u * v + 1.5) + '" text-anchor="end" style="' + TXT + '">' + v + '</text>';
  }
  b += '<text x="' + (ox + side - 2) + '" y="' + (cy - 2) + '" text-anchor="end" style="' + TXT + '">x</text>';
  b += '<text x="' + (cx + 2) + '" y="' + (oy + 4) + '" style="' + TXT + '">y</text>';
  return svg(180, oy + side + 8, b);
}

/* 11. 단위원 판 — 반지름 1, 30\u00b0\u00b745\u00b0 눈금. 삼각함수를 좌표로 읽는다(과정 40~45). */
function unitCircle(){
  var b = '', R = 58, cx = 90, cy = 12 + R;
  b += label(8, 8, '단위원 판 \u2014 반지름을 1 로 봅니다. 각을 그려 x \u00b7 y 를 읽어요');
  b += '<circle cx="' + cx + '" cy="' + cy + '" r="' + R + '" style="' + CUT + '"/>';
  b += '<line x1="' + (cx - R - 6) + '" y1="' + cy + '" x2="' + (cx + R + 6) + '" y2="' + cy + '" style="' + LINE + '"/>';
  b += '<line x1="' + cx + '" y1="' + (cy - R - 6) + '" x2="' + cx + '" y2="' + (cy + R + 6) + '" style="' + LINE + '"/>';
  for(var a = 0; a < 360; a += 15){
    var r0 = (a % 45 === 0) ? R - 5 : R - 2.5, th = -a * Math.PI / 180;
    b += '<line x1="' + (cx + r0 * Math.cos(th)).toFixed(2) + '" y1="' + (cy + r0 * Math.sin(th)).toFixed(2) +
         '" x2="' + (cx + R * Math.cos(th)).toFixed(2) + '" y2="' + (cy + R * Math.sin(th)).toFixed(2) + '" style="' + LINE + '"/>';
    if(a % 90 === 0 || a === 30 || a === 45 || a === 60){
      var rt = R + 5;
      b += '<text x="' + (cx + rt * Math.cos(th)).toFixed(2) + '" y="' + (cy + rt * Math.sin(th) + 1.5).toFixed(2) + '" text-anchor="middle" style="' + TXT + '">' + a + '\u00b0</text>';
    }
  }
  b += '<text x="' + (cx + R + 3) + '" y="' + (cy - 3) + '" style="' + TXT + '">1</text>';
  var sy = cy + R + 14;
  b += label(8, sy, '반지름 자 \u2014 오려서 가운데 핀으로 꽂으면 각을 돌려 볼 수 있어요');
  b += rect(8, sy + 3, R + 14, 9, CUT);
  b += '<circle cx="12" cy="' + (sy + 7.5) + '" r="1.2" style="fill:#1A2233"/>';
  b += '<text x="' + (R + 6) + '" y="' + (sy + 9.5) + '" text-anchor="end" style="' + TXT + '">\uc911\uc2ec \u2192 \ub05d = 1</text>';
  return svg(180, sy + 18, b);
}

window.NM_PAPER_TOOLS = [
  { key:'tenframe', courses:{from:1,to:2}, build:tenFrame,
    name:{ko:'십틀과 동그라미',en:'Ten-frame and counters',zh:'十格框与圆片'},
    why:{ko:'10을 "채워야 할 자리"로 보게 합니다. 8 + 7에서 7에서 2를 빌려 오는 그 습관이 여기서 생깁니다.',
      en:'It makes 10 a place to be filled. The habit of borrowing 2 from the 7 in 8 + 7 starts here.',
      zh:'把10看成"要填满的位置"。8＋7时从7里借2的习惯从这里开始。'},
    steps:{ko:['점선을 따라 십틀 두 장과 동그라미 20개를 오립니다.',
      '한쪽 십틀에 8개를 놓고 "몇 칸 남았지?"를 먼저 묻습니다.',
      '남은 2칸을 7에서 가져와 채우고, 남은 5개는 옆 십틀에 놓습니다.'],
      en:['Cut out the two frames and 20 counters along the dotted lines.',
        'Put 8 counters on one frame and ask "how many spaces are left?" first.',
        'Fill those 2 from the 7, and put the remaining 5 on the second frame.'],
      zh:['沿虚线剪下两张十格框和20个圆片。','在一张框里放8个，先问"还剩几格？"。','从7里拿2个填满，剩下的5个放到另一张框。']},
    buy:{ name:{ko:"멀티큐브 100개",en:"Snap cubes, 100",zh:"多连方块100个"}, why:{ko:"붙였다 떼며 10을 만듭니다. 8에 2를 붙여 열 칸짜리 막대를 완성하는 그 손동작이 곧 보수입니다.",en:"Snap and unsnap to make ten. Completing a ten-stick by adding 2 to 8 is the complement, in the hand.",zh:"拼上再拆开来凑十。给8接上2凑成一条十，就是补数。"}, pick:{ko:"100개 이상, 한 손에 잡히는 2cm 안팎. 색이 여러 가지인 것.",en:"100 or more, about 2cm, several colours.",zh:"100个以上，约2厘米，多种颜色。"}, key:"cubes" },
    make:{ name:{ko:"종이 십틀과 병뚜껑",en:"Paper ten-frame and bottle caps",zh:"纸十格框和瓶盖"}, how:{ko:"위 십틀 두 장과 동그라미를 오립니다. 동그라미 대신 병뚜껑, 단추, 콩을 써도 똑같이 됩니다.",en:"Cut out the two frames above. Bottle caps, buttons or beans work just as well as the paper counters.",zh:"剪下上面两张十格框。用瓶盖、纽扣或豆子代替纸圆片一样好用。"} } },

  { key:'place', courses:{from:3,to:4}, build:placeValue,
    name:{ko:'백 판 · 십 막대 · 낱개',en:'Hundred board, ten rods, ones',zh:'百板·十条·个'},
    why:{ko:'열 개를 하나로 묶는 행위가 곧 자릿값입니다. 받아올림은 낱개 열 개를 십 막대 하나로 바꾸는 일입니다.',
      en:'Bundling ten into one is place value itself. Carrying is trading ten ones for one rod.',
      zh:'把十个捆成一个，就是位值本身。进位就是用十个"个"换一根"十条"。'},
    steps:{ko:['백 판 1장, 십 막대 8개, 낱개 20개를 오립니다.',
      '37을 십 막대 3개와 낱개 7개로 놓아 봅니다.',
      '낱개가 10개가 되면 반드시 십 막대 하나로 바꿉니다 — 이것이 받아올림입니다.'],
      en:['Cut out one hundred board, eight ten-rods and twenty ones.',
        'Lay out 37 as three rods and seven ones.',
        'Whenever ten ones gather, trade them for one rod — that is carrying.'],
      zh:['剪下1张百板、8根十条、20个个位方块。','用3根十条和7个方块摆出37。','个位满十就换成一根十条——这就是进位。']},
    buy:{ name:{ko:"십진 블록 세트",en:"Base-ten blocks",zh:"十进制积木"}, why:{ko:"낱개 열 개와 십 막대 하나가 손에서 같은 무게로 느껴집니다. 받아올림이 머리가 아니라 손에서 일어납니다.",en:"Ten ones and one rod feel the same in the hand, so carrying happens in the hand, not the head.",zh:"十个个位块和一根十条在手里一样重，进位发生在手上而不是脑子里。"}, pick:{ko:"낱개 100개, 십 막대 20개 이상. 백 판이 들어 있으면 더 좋습니다.",en:"100 ones and 20 rods at least; a hundred flat is a plus.",zh:"至少100个个位块和20根十条，有百板更好。"}, key:"baseten" },
    make:{ name:{ko:"빨대와 고무줄",en:"Straws and rubber bands",zh:"吸管与橡皮筋"}, how:{ko:"빨대 열 개를 고무줄로 묶어 십 막대를 만듭니다. 묶었다 푸는 그 동작이 곧 받아올림이라, 이미 묶여 있는 완제품보다 낫습니다.",en:"Bundle ten straws with a band. The bundling and unbundling is the carrying itself, which a pre-made block cannot show.",zh:"用橡皮筋把十根吸管捆成一条。捆和解的动作就是进位，现成的积木反而看不到这一步。"} } },

  { key:'numberline', courses:{from:5,to:6}, build:numberLine,
    name:{ko:'수직선 띠',en:'Number line strips',zh:'数轴纸条'},
    why:{ko:'뺄셈을 "빼앗는 것"이 아니라 "거리"로 보게 합니다. 52 − 48을 세는 대신 건너뛰어 세게 됩니다.',
      en:'It turns subtraction from taking away into distance. Instead of counting down from 52 to 48, the child hops.',
      zh:'把减法从"拿走"变成"距离"。不是从52一个个数到48，而是跳着数。'},
    steps:{ko:['띠 세 개를 오려 책상에 나란히 붙입니다.',
      '연필 끝으로 8에서 출발해 5칸 뛰어 보고, 뛴 자리를 곡선으로 잇습니다.',
      '큰 수에서는 10씩 먼저 뛰고 남은 칸만 하나씩 뜁니다.'],
      en:['Cut the three strips and lay them side by side.',
        'Start the pencil at 8, hop 5 steps, and join the hops with a curve.',
        'For big numbers hop by ten first, then walk the leftover steps.'],
      zh:['剪下三条纸条并排放好。','铅笔从8出发跳5格，用曲线把跳跃连起来。','大数先跳10，再一格格走剩下的。']},
    buy:{ name:{ko:"천 줄자 2m",en:"Cloth tape measure, 2m",zh:"软尺2米"}, why:{ko:"수직선이 실제 길이가 됩니다. 52에서 48까지가 네 칸 거리라는 것을 손으로 재어 봅니다.",en:"The number line becomes real length; the gap from 48 to 52 is measured, not counted.",zh:"数轴变成真实长度，48到52的距离是量出来的，不是数出来的。"}, pick:{ko:"숫자가 큼직한 것. 쇠 줄자보다 천 줄자가 아이에게 안전합니다.",en:"Large numerals; a cloth tape is safer for a child than a steel one.",zh:"数字要大，软尺比钢卷尺对孩子更安全。"}, key:"tape" },
    make:{ name:{ko:"종이 띠와 바닥 테이프",en:"Paper strips and floor tape",zh:"纸条和地上的胶带"}, how:{ko:"위 띠 세 개를 오려 책상에 붙입니다. 바닥에 마스킹테이프로 0부터 20까지 크게 그려 두면 아이가 직접 뛰어 셉니다.",en:"Cut the three strips above. Tape a big 0 to 20 line on the floor and let the child hop along it.",zh:"剪下上面三条纸条。用美纹胶带在地上画一条大的0到20，让孩子亲自跳着数。"} } },

  { key:'array', courses:{from:7,to:10}, build:arrayBoard,
    name:{ko:'곱셈 배열판과 가림판',en:'Array board and L-covers',zh:'乘法阵列板与遮板'},
    why:{ko:'구구단을 외운 소리가 아니라 직사각형으로 보게 합니다. 47 × 6을 40 × 6과 7 × 6으로 쪼개는 것도 여기서 눈에 보입니다.',
      en:'Times tables become rectangles, not chanted sounds. Splitting 47 × 6 into 40 × 6 and 7 × 6 becomes visible here.',
      zh:'让乘法口诀变成长方形，而不是背出来的声音。把47×6拆成40×6和7×6也在这里看得见。'},
    steps:{ko:['배열판과 ㄱ자 가림판 2장을 오립니다.',
      '가림판 두 장을 겹쳐 3줄 4칸 직사각형을 만들고 점을 셉니다.',
      '가림판을 옆으로 넓혀 4줄이 되면 점이 몇 개 늘었는지 봅니다.'],
      en:['Cut out the board and the two L-shaped covers.',
        'Overlap the covers to frame a 3-by-4 rectangle and count the dots.',
        'Widen it to 4 rows and see how many dots were added.'],
      zh:['剪下阵列板和两张ㄱ形遮板。','用遮板围出3行4列的长方形，数一数点。','扩到4行，看看多了几个点。']},
    buy:{ name:{ko:"투명 색타일 100개",en:"Transparent colour tiles, 100",zh:"彩色方块100个"}, why:{ko:"3 곱하기 4를 직사각형으로 깔면 곱셈이 넓이가 됩니다. 판을 돌려 보면 4 곱하기 3과 같다는 것도 바로 압니다.",en:"Laying 3 by 4 as a rectangle turns multiplication into area; turning it shows 4 by 3 is the same.",zh:"把3×4摆成长方形，乘法就成了面积；转一下就知道4×3一样。"}, pick:{ko:"같은 크기 정사각형 100개. 2.5cm 안팎이면 배열이 눈에 잘 들어옵니다.",en:"100 identical squares, about 2.5cm.",zh:"100个大小相同的方块，约2.5厘米。"}, key:"tiles" },
    make:{ name:{ko:"종이 배열판과 계란판",en:"Paper array board and an egg carton",zh:"纸阵列板和鸡蛋盒"}, how:{ko:"위 배열판과 가림판을 오립니다. 계란판은 그 자체가 2 곱하기 5 배열이라 열 개 묶음을 보여 주기 좋습니다.",en:"Cut out the board and covers above. An egg carton is already a 2 by 5 array, good for seeing groups of ten.",zh:"剪下上面的阵列板和遮板。鸡蛋盒本身就是2×5的阵列，正好看十个一组。"} } },

  { key:'balance', courses:{from:11,to:12}, build:balanceMat,
    name:{ko:'등식 저울판과 수 카드',en:'Balance mat and number cards',zh:'等式天平板与数字卡'},
    why:{ko:"등호는 답이 나온다는 신호가 아니라 양쪽이 같다는 뜻입니다. 저울이 평평해지는 순간 아이는 그것을 처음으로 눈으로 봅니다.",en:"The equals sign is not a signal that an answer follows; it means both sides are the same, and a level beam shows that for the first time.",zh:"等号不是答案要来了的信号，而是两边一样。天平放平的那一刻，孩子第一次看见。"},
    steps:{ko:['저울판과 수 카드를 오립니다.','왼쪽 접시에 7과 + 와 5를, 오른쪽에 12를 놓고 평평한지 봅니다.','오른쪽에 네모를 놓고 양쪽이 같아지려면 얼마여야 하는지 찾습니다.'],
      en:['Cut out the mat and the number cards.','Put 7 + 5 on the left pan and 12 on the right, and see whether it balances.','Put the empty box on the right and find what makes both sides the same.'],
      zh:['剪下天平板和数字卡。','左盘放7加5，右盘放12，看是否平衡。','右盘放方框，找出放多少两边才一样。']},
    buy:{ name:{ko:"양팔 저울",en:"Balance scale",zh:"天平"}, why:{ko:"등호는 답이 나온다는 신호가 아니라 양쪽이 같다는 뜻입니다. 저울이 평평해지는 순간 아이는 그것을 처음으로 눈으로 봅니다. 중학교의 방정식이 여기서 시작합니다.",en:"The equals sign is not a signal that an answer follows; it means both sides are the same. A level beam shows that for the first time, and equations start here.",zh:"等号不是答案要来了的信号，而是两边一样。天平放平的那一刻孩子第一次看见，初中的方程也从这里开始。"}, pick:{ko:"접시가 크고 추가 함께 오는 것. 플라스틱이면 충분합니다.",en:"Large pans with a set of weights; plastic is fine.",zh:"托盘大、带砝码的即可，塑料的就够。"}, key:"balance" },
    make:{ name:{ko:"옷걸이와 종이컵 저울",en:"A coat-hanger and paper-cup balance",zh:"衣架和纸杯做的天平"}, how:{ko:"옷걸이 양 끝에 실로 종이컵 두 개를 매답니다. 문고리에 걸면 저울이 됩니다. 양쪽에 동전을 같은 수만큼 넣어 평평해지는 것을 봅니다.",en:"Hang two paper cups from a coat-hanger with string and hook it on a door handle. Put the same number of coins in each and watch it level out.",zh:"用绳子在衣架两端各挂一个纸杯，挂在门把手上。两边放一样多的硬币，看它变平。"} } },
  { key:'fraction', courses:{from:13,to:16}, build:fractionDisc,
    name:{ko:'분수 원판',en:'Fraction discs',zh:'分数圆盘'},
    why:{ko:'분수는 기호보다 조각이 먼저입니다. 1/3이 1/4보다 크다는 것은 설명이 아니라 겹쳐 보면 압니다.',
      en:'For fractions the pieces come before the symbol. That 1/3 beats 1/4 is not explained — it is seen by overlapping.',
      zh:'分数先有块，才有符号。1/3比1/4大，不是讲出来的，是叠在一起看出来的。'},
    steps:{ko:['원판 6장을 오리고, 1을 뺀 나머지는 선을 따라 조각으로 자릅니다.',
      '1/3 조각과 1/4 조각을 겹쳐 어느 쪽이 큰지 봅니다.',
      '1/2 위에 1/4 두 조각을 올려 같아지는 것을 확인합니다.'],
      en:['Cut out the six discs and cut all but the whole into pieces along the lines.',
        'Overlap a 1/3 piece and a 1/4 piece and see which is bigger.',
        'Lay two 1/4 pieces on the 1/2 and check they match.'],
      zh:['剪下6个圆盘，除"1"以外都沿线剪成小块。','把1/3和1/4叠在一起，看哪个大。','在1/2上放两块1/4，确认正好一样。']},
    buy:{ name:{ko:"분수 원판 세트",en:"Fraction disc set",zh:"分数圆盘套装"}, why:{ko:"조각을 겹쳐 보면 3분의 1이 4분의 1보다 크다는 것을 설명 없이 압니다. 종이보다 튼튼해 오래 씁니다.",en:"Overlapping the pieces shows that a third beats a quarter without any explanation, and plastic lasts.",zh:"把块叠起来，不用讲就知道三分之一比四分之一大，塑料的也更耐用。"}, pick:{ko:"1, 2분의 1, 3분의 1, 4분의 1, 6분의 1, 8분의 1이 다 들어 있는 것. 분모마다 색이 다르면 좋습니다.",en:"A set with 1, 1/2, 1/3, 1/4, 1/6 and 1/8; colour-coded is better.",zh:"要有1、1/2、1/3、1/4、1/6、1/8，按颜色区分更好。"}, key:"fracdisc" },
    make:{ name:{ko:"종이 원판과 색종이 접기",en:"Paper discs and folded origami paper",zh:"纸圆盘和折纸"}, how:{ko:"위 원판 여섯 장을 오려 선을 따라 자릅니다. 색종이를 반으로, 또 반으로 접으면 2분의 1, 4분의 1, 8분의 1이 그대로 나옵니다.",en:"Cut the six discs above along the lines. Folding origami paper in half again and again gives a half, a quarter and an eighth.",zh:"剪下上面六个圆盘并沿线剪开。把色纸对折再对折，就得到1/2、1/4、1/8。"} } },

  { key:'decimal', courses:{from:17,to:25}, build:decimalGrid,
    name:{ko:'소수 모눈판',en:'Decimal grids',zh:'小数方格板'},
    why:{ko:'0.1은 작은 수가 아니라 1을 열로 나눈 한 줄입니다. 1/5 = 0.2도 두 줄로 바로 보입니다.',
      en:'0.1 is not a small number but one row of a whole cut into ten. That 1/5 = 0.2 shows up as two rows.',
      zh:'0.1不是"小数字"，而是把1分成十份中的一行。1/5＝0.2也就是两行。'},
    steps:{ko:['모눈판 2장과 0.1 띠 10개를 오립니다.',
      '0.1 띠를 모눈판에 덮어 열 개가 딱 1이 되는 것을 확인합니다.',
      '0.3 + 0.4를 띠로 놓아 보고, 0.7이 일곱 줄임을 눈으로 봅니다.'],
      en:['Cut out the two grids and the ten 0.1 strips.',
        'Cover a grid with the strips and confirm ten of them make exactly 1.',
        'Lay out 0.3 + 0.4 with strips and see that 0.7 is seven rows.'],
      zh:['剪下2张方格板和10条0.1纸条。','用纸条铺满一张板，确认10条正好是1。','用纸条摆0.3＋0.4，亲眼看到0.7就是七行。']},
    buy:{ name:{ko:"주방 저울",en:"Kitchen scale",zh:"厨房秤"}, why:{ko:"0.1이 화면에 실제 숫자로 찍힙니다. 0.3에 0.4를 더하면 0.7이 되는 것을 눈금으로 확인합니다.",en:"A tenth appears as a real number on the display, and adding 0.3 and 0.4 is checked on the readout.",zh:"0.1真的以数字显示在屏幕上，0.3加0.4也能用读数确认。"}, pick:{ko:"0.1g 또는 1g 단위로 읽히는 것. 화면 숫자가 큰 것이 좋습니다.",en:"Reads in 0.1g or 1g steps, with a large display.",zh:"能读到0.1克或1克，屏幕数字要大。"}, key:"scale" },
    make:{ name:{ko:"종이 모눈판과 종이컵",en:"Paper grids and paper cups",zh:"纸方格板和纸杯"}, how:{ko:"위 모눈판과 0.1 띠를 오립니다. 물을 종이컵 열 개에 똑같이 나눠 담아 한 컵의 0.1이 얼마인지 봅니다.",en:"Cut out the grids and the 0.1 strips above. Pour water equally into ten cups to see what a tenth of one cup is.",zh:"剪下上面的方格板和0.1纸条。把水平均倒进十个纸杯，看看一杯的十分之一是多少。"} } },
  { key:'pentomino', courses:{from:26,to:28}, build:pentomino,
    name:{ko:"펜토미노 12조각과 6×10 판",en:"Twelve pentominoes and a 6×10 board",zh:"十二块五格骨牌与6×10板"},
    why:{ko:"다섯 칸짜리 조각 열둘로 판을 빈틈없이 채웁니다. 돌리고 뒤집어 보는 그 손놀림이 경시 문제의 공간 사고 그 자체입니다.",en:"Twelve five-cell pieces fill the board exactly. Turning and flipping them is the spatial thinking olympiad problems ask for.",zh:"用十二块五格骨牌把板铺满。转一转、翻一翻，就是竞赛题要的空间思维。"},
    steps:{ko:["판과 조각 열두 개를 오립니다. 굵은 점선만 자르고 안쪽 얇은 금은 그냥 둡니다.","먼저 큰 조각부터 놓고 모서리를 채웁니다.","다 채우면 다른 방법으로 또 채워 봅니다. 답은 하나가 아닙니다."],en:["Cut out the board and the twelve pieces, following the bold dotted lines only.","Place the big pieces first and work into the corners.","When it is full, fill it a second way — there is more than one answer."],zh:["剪下板和十二块骨牌，只沿粗虚线剪。","先放大块，再补角落。","铺满之后换一种方法再铺一次——答案不止一个。"]},
    buy:{ name:{ko:"펜토미노 세트",en:"Pentomino set",zh:"五格骨牌套装"}, why:{ko:"조각이 두꺼워 잘 밀리지 않고, 색이 달라 어느 조각을 썼는지 한눈에 보입니다.",en:"Thick pieces do not slide, and the colours show at a glance which piece went where.",zh:"块厚不易滑动，颜色不同一眼看出用了哪块。"}, pick:{ko:"12조각이 다 있는 것. 판이 함께 오면 더 좋습니다.",en:"All twelve pieces; a board included is better.",zh:"要12块齐全，附板更好。"}, key:"pentomino" },
    make:{ name:{ko:"종이 조각과 두꺼운 종이",en:"Paper pieces on card",zh:"纸块与厚纸"}, how:{ko:"위 조각을 오립니다. 우유갑이나 택배 상자에 붙여 오리면 두꺼워져 훨씬 잘 다뤄집니다.",en:"Cut out the pieces above. Glue them to a milk carton or cardboard first and they handle far better.",zh:"剪下上面的骨牌。先贴在牛奶盒或纸箱上再剪，会好用得多。"} } },
  { key:'intline', courses:{from:29,to:31}, build:intLine,
    name:{ko:"정수 수직선과 이동 카드",en:"Integer number line and move cards",zh:"整数数轴与移动卡"},
    why:{ko:"음수는 작은 수가 아니라 0에서 반대 방향입니다. 말을 옮겨 보면 −3 − 5 가 왜 −8 인지 세지 않고 압니다.",en:"A negative is not a small number but the opposite direction from zero. Moving a counter shows why −3 − 5 is −8 without counting.",zh:"负数不是小的数，而是从0往反方向。移动棋子就明白为什么−3−5是−8，不用数。"},
    steps:{ko:["수직선 두 장과 이동 카드를 오립니다.","지우개를 말 삼아 0에 놓고 카드를 뽑아 옮깁니다.","뺄셈 카드는 반대 방향으로 갑니다. 어디에 서는지 확인합니다."],en:["Cut out the two lines and the move cards.","Put an eraser on 0 as a counter and move it by the card you draw.","A minus card moves the other way. See where the counter lands."],zh:["剪下两条数轴和移动卡。","把橡皮当棋子放在0上，抽卡移动。","减号卡往反方向走，看落在哪里。"]},
    buy:{ name:{ko:"실내 온도계",en:"Indoor thermometer",zh:"室内温度计"}, why:{ko:"영하가 실제로 눈금 아래에 있습니다. 아침 기온을 매일 읽으면 음수가 생활 속 수가 됩니다.",en:"Below zero really sits below the mark. Reading the morning temperature makes negatives an everyday number.",zh:"零下就在刻度下面。每天读早上的气温，负数就成了生活里的数。"}, pick:{ko:"영하 20도까지 읽히고 눈금이 큼직한 것. 알코올식이면 충분합니다.",en:"Reads to −20°C with large marks; an alcohol type is fine.",zh:"能读到零下20度、刻度大的即可，酒精式就够。"}, key:"thermo" },
    make:{ name:{ko:"종이 수직선과 지우개 말",en:"Paper line and an eraser counter",zh:"纸数轴与橡皮棋子"}, how:{ko:"위 수직선을 오려 책상에 붙이고 지우개를 말로 씁니다. 엘리베이터 버튼(지하 −1, −2)도 훌륭한 수직선입니다.",en:"Cut out the line above and use an eraser as the counter. A lift panel with basement floors is a fine number line too.",zh:"剪下上面的数轴贴在桌上，用橡皮当棋子。电梯的地下楼层按钮也是很好的数轴。"} } },
  { key:'algtiles', courses:{from:32,to:35}, build:algebraTiles,
    name:{ko:"대수 타일 (x² · x · 1)",en:"Algebra tiles (x², x, 1)",zh:"代数瓷砖（x²·x·1）"},
    why:{ko:"다항식을 넓이로 봅니다. x² + 3x + 2 를 깔아 직사각형을 만들면 가로세로가 (x+1)(x+2) — 인수분해가 눈에 보입니다.",en:"A polynomial becomes area. Lay out x² + 3x + 2 as a rectangle and the sides read (x+1)(x+2) — factorisation, seen.",zh:"把多项式看成面积。把x²+3x+2铺成长方形，边长就是(x+1)(x+2)——因式分解看得见。"},
    steps:{ko:["x² 타일 4개, x 타일 8개, 1 타일 20개를 오립니다.","x² + 3x + 2 만큼 골라 직사각형이 되게 맞춥니다.","가로와 세로에 놓인 타일을 세어 (x+1)(x+2) 를 읽습니다."],en:["Cut out four x² tiles, eight x tiles and twenty 1 tiles.","Take x² + 3x + 2 worth of tiles and fit them into a rectangle.","Count the tiles along each side to read (x+1)(x+2)."],zh:["剪下4块x²、8块x、20块1。","取出x²+3x+2的块，拼成长方形。","数一数两边的块，读出(x+1)(x+2)。"]},
    buy:{ name:{ko:"대수 타일 세트",en:"Algebra tile set",zh:"代数瓷砖套装"}, why:{ko:"앞뒤 색이 달라 양수와 음수를 뒤집어 나타냅니다. 종이로는 그 뒤집기가 잘 안 됩니다.",en:"The two faces are different colours, so flipping a tile makes it negative — paper cannot do that well.",zh:"正反两面颜色不同，翻过来就是负数——纸做的很难表现这一点。"}, pick:{ko:"x², x, 1 세 종류가 다 있고 앞뒤 색이 다른 것.",en:"All three sizes, with different colours front and back.",zh:"三种规格齐全、正反异色。"}, key:"algtile" },
    make:{ name:{ko:"종이 타일과 색칠한 뒷면",en:"Paper tiles with a coloured back",zh:"纸瓷砖与涂色的背面"}, how:{ko:"위 타일을 오리고 뒷면을 색연필로 칠합니다. 뒤집으면 음수 — 색이 다르니 앞뒤가 구별됩니다.",en:"Cut out the tiles and colour the backs. Flipped over means negative, and the colour tells them apart.",zh:"剪下瓷砖，把背面涂上颜色。翻过来就是负数，颜色一看就分得清。"} } },
  { key:'coord', courses:{from:36,to:39}, build:coordGrid,
    name:{ko:"좌표 모눈판",en:"Coordinate grid",zh:"坐标方格板"},
    why:{ko:"점과 직선, 원이 좌표 위에서 손으로 찍힙니다. 식만 보고 푸는 것과 그려 보고 아는 것은 다릅니다.",en:"Points, lines and circles get plotted by hand. Solving from the equation alone is not the same as seeing it.",zh:"点、直线和圆用手画在坐标上。只看式子解题，和画出来看明白，不一样。"},
    steps:{ko:["좌표판을 오려 책상에 붙이거나 투명 파일에 끼웁니다.","두 점을 찍고 직선을 그어 기울기를 읽습니다.","중심과 반지름을 정해 원을 그리고 식과 맞춰 봅니다."],en:["Cut out the grid and tape it down, or slip it into a clear file.","Plot two points, draw the line and read its slope.","Choose a centre and radius, draw the circle and match it to the equation."],zh:["剪下坐标板贴在桌上，或夹进透明文件夹。","标两个点画直线，读出斜率。","定圆心和半径画圆，再和方程对照。"]},
    buy:{ name:{ko:"모눈 공책 (5mm)",en:"Graph notebook (5mm)",zh:"方格本（5毫米）"}, why:{ko:"매번 새 판에 그릴 수 있습니다. 시험지에 손으로 좌표를 그리는 연습도 됩니다.",en:"A fresh grid every time, and it trains drawing axes by hand on an exam paper.",zh:"每次都有新的方格，也练习在试卷上手画坐标。"}, pick:{ko:"5mm 모눈, 줄이 옅은 것. 두꺼우면 그린 선이 안 보입니다.",en:"5mm squares with faint rules; dark rules hide your line.",zh:"5毫米方格、格线要淡，太深会盖住画的线。"}, key:"graphpad" },
    make:{ name:{ko:"종이 좌표판과 투명 파일",en:"Paper grid in a clear file",zh:"纸坐标板与透明文件夹"}, how:{ko:"위 좌표판을 오려 투명 파일에 끼우면 보드마카로 쓰고 지울 수 있습니다. 몇 번이고 다시 씁니다.",en:"Slip the grid into a clear file and write on it with a whiteboard marker — wipe and reuse.",zh:"把坐标板夹进透明文件夹，用白板笔写了擦、擦了写。"} } },
  { key:'unitcircle', courses:{from:40,to:45}, build:unitCircle,
    name:{ko:"단위원 판과 반지름 자",en:"Unit circle and a radius arm",zh:"单位圆板与半径尺"},
    why:{ko:"sin 과 cos 은 외우는 표가 아니라 단위원 위 점의 y 와 x 입니다. 반지름을 돌려 보면 그 값이 어디서 오는지 보입니다.",en:"Sine and cosine are not a table to memorise but the y and x of a point on the unit circle. Turning the arm shows where the values come from.",zh:"sin和cos不是要背的表，而是单位圆上一点的y和x。转动半径就看见这些值从哪来。"},
    steps:{ko:["단위원 판과 반지름 자를 오립니다.","가운데를 압정이나 할핀으로 꽂아 자를 돌립니다.","30°, 45°, 60° 에 맞추고 끝점의 x 와 y 를 읽습니다."],en:["Cut out the circle and the radius arm.","Pin the centre with a split pin so the arm turns.","Set it to 30°, 45° and 60° and read the x and y of the tip."],zh:["剪下单位圆板和半径尺。","用图钉或工字钉固定中心，让尺可以转。","转到30°、45°、60°，读出端点的x和y。"]},
    buy:{ name:{ko:"각도기와 컴퍼스 세트",en:"Protractor and compass set",zh:"量角器与圆规套装"}, why:{ko:"각을 정확히 재고 원을 직접 그립니다. 고등 도형 문제는 결국 손으로 그려 봐야 보입니다.",en:"Measure angles exactly and draw the circle yourself; high-school geometry opens up once it is drawn.",zh:"准确量角、亲手画圆。高中的图形题，画出来才看得明白。"}, pick:{ko:"반투명 각도기(밑에 선이 비치는 것)와 나사로 고정되는 컴퍼스.",en:"A translucent protractor and a screw-locking compass.",zh:"半透明量角器和带螺丝固定的圆规。"}, key:"protractor" },
    make:{ name:{ko:"종이 단위원과 할핀",en:"Paper circle and a split pin",zh:"纸单位圆与工字钉"}, how:{ko:"위 판과 자를 오려 가운데를 할핀으로 꽂습니다. 할핀이 없으면 이쑤시개를 꽂고 뒤에서 테이프로 고정합니다.",en:"Cut both out and pin the centre with a split pin; a toothpick taped at the back works too.",zh:"剪下两件，用工字钉固定中心；没有的话用牙签，背面用胶带固定。"} } }
];

/* 사야 하는 것은 이 셋뿐이다. 상품 번호·가격은 박지 않는다 — 가격은 매일 바뀌고 링크는 죽는다.
   검색 링크로 걸어 두면 학부모가 오늘 가격으로 직접 고른다(원장 "가성비"). */
window.NM_BUY_TOOLS = [
  { key:'stones', name:{ko:'바둑돌 또는 단추',en:'Go stones or buttons',zh:'围棋子或纽扣'},
    use:{ko:'모으기·가르기. 종이접시 두 장과 함께 씁니다.',en:'Gathering and splitting, with two paper plates.',zh:'合与分，配两个纸盘。'},
    pick:{ko:'50개 이상, 아이 손에 잡히는 크기. 색이 두 가지면 더 좋습니다.',
      en:'50 or more, big enough for small hands. Two colours is better.',zh:'50个以上，孩子手好拿。两种颜色更好。'},
    q:'바둑돌' },
  { key:'straw', name:{ko:'빨대와 고무줄',en:'Straws and rubber bands',zh:'吸管与橡皮筋'},
    use:{ko:'십진 묶음. 열 개씩 묶는 그 행위가 자릿값입니다.',en:'Bundles of ten — the bundling itself is place value.',zh:'十个一捆——捆的动作就是位值。'},
    pick:{ko:'100개 이상, 굵기가 일정한 것. 파는 십진블록보다 오히려 낫습니다.',
      en:'100 or more, even thickness. Better than a bought base-ten set for this.',zh:'100根以上，粗细一致。这件事上比买的十进制积木还好。'},
    q:'빨대 100개' },
  { key:'dice', name:{ko:'주사위',en:'Dice',zh:'骰子'},
    use:{ko:'게임 회차. 수를 만들고 비교합니다.',en:'Game rounds — making and comparing numbers.',zh:'游戏课次——造数、比大小。'},
    pick:{ko:'2~4개. 점이 큼직하게 찍힌 것.',en:'Two to four, with clearly printed pips.',zh:'2~4个，点子印得清楚。'},
    q:'주사위' }
];

/* 과정 번호(1~45) → 종이 교구. 없으면 null(그 주는 교구 지면이 안 붙는다). */
window.NM_PAPER_TOOL_OF_COURSE = function(n){
  var num = (typeof n === 'string') ? parseInt(String(n).replace(/^C/i, ''), 10) : n;
  if(!(num >= 1)) return null;
  for(var i = 0; i < window.NM_PAPER_TOOLS.length; i++){
    var t = window.NM_PAPER_TOOLS[i];
    if(num >= t.courses.from && num <= t.courses.to) return t;
  }
  return null;
};

if(typeof module !== 'undefined' && module.exports) module.exports = window.NM_PAPER_TOOLS;
})();
