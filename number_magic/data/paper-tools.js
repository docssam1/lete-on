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
    buy:{ name:{ko:"연결 큐브 100개",en:"Snap cubes, 100",zh:"连接方块100个"}, why:{ko:"붙였다 떼며 10을 만듭니다. 8에 2를 붙여 열 칸짜리 막대를 완성하는 그 손동작이 곧 보수입니다.",en:"Snap and unsnap to make ten. Completing a ten-stick by adding 2 to 8 is the complement, in the hand.",zh:"拼上再拆开来凑十。给8接上2凑成一条十，就是补数。"}, pick:{ko:"100개 이상, 한 손에 잡히는 2cm 안팎. 색이 여러 가지인 것.",en:"100 or more, about 2cm, several colours.",zh:"100个以上，约2厘米，多种颜色。"}, q:"연결큐브 수학교구" },
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
    buy:{ name:{ko:"십진 블록 세트",en:"Base-ten blocks",zh:"十进制积木"}, why:{ko:"낱개 열 개와 십 막대 하나가 손에서 같은 무게로 느껴집니다. 받아올림이 머리가 아니라 손에서 일어납니다.",en:"Ten ones and one rod feel the same in the hand, so carrying happens in the hand, not the head.",zh:"十个个位块和一根十条在手里一样重，进位发生在手上而不是脑子里。"}, pick:{ko:"낱개 100개, 십 막대 20개 이상. 백 판이 들어 있으면 더 좋습니다.",en:"100 ones and 20 rods at least; a hundred flat is a plus.",zh:"至少100个个位块和20根十条，有百板更好。"}, q:"십진블록" },
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
    buy:{ name:{ko:"천 줄자 2m",en:"Cloth tape measure, 2m",zh:"软尺2米"}, why:{ko:"수직선이 실제 길이가 됩니다. 52에서 48까지가 네 칸 거리라는 것을 손으로 재어 봅니다.",en:"The number line becomes real length; the gap from 48 to 52 is measured, not counted.",zh:"数轴变成真实长度，48到52的距离是量出来的，不是数出来的。"}, pick:{ko:"숫자가 큼직한 것. 쇠 줄자보다 천 줄자가 아이에게 안전합니다.",en:"Large numerals; a cloth tape is safer for a child than a steel one.",zh:"数字要大，软尺比钢卷尺对孩子更安全。"}, q:"천 줄자" },
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
    buy:{ name:{ko:"색 타일 100개",en:"Colour tiles, 100",zh:"彩色方块100个"}, why:{ko:"3 곱하기 4를 직사각형으로 깔면 곱셈이 넓이가 됩니다. 판을 돌려 보면 4 곱하기 3과 같다는 것도 바로 압니다.",en:"Laying 3 by 4 as a rectangle turns multiplication into area; turning it shows 4 by 3 is the same.",zh:"把3×4摆成长方形，乘法就成了面积；转一下就知道4×3一样。"}, pick:{ko:"같은 크기 정사각형 100개. 2.5cm 안팎이면 배열이 눈에 잘 들어옵니다.",en:"100 identical squares, about 2.5cm.",zh:"100个大小相同的方块，约2.5厘米。"}, q:"색타일 수학교구" },
    make:{ name:{ko:"종이 배열판과 계란판",en:"Paper array board and an egg carton",zh:"纸阵列板和鸡蛋盒"}, how:{ko:"위 배열판과 가림판을 오립니다. 계란판은 그 자체가 2 곱하기 5 배열이라 열 개 묶음을 보여 주기 좋습니다.",en:"Cut out the board and covers above. An egg carton is already a 2 by 5 array, good for seeing groups of ten.",zh:"剪下上面的阵列板和遮板。鸡蛋盒本身就是2×5的阵列，正好看十个一组。"} } },

  { key:'balance', courses:{from:11,to:12}, build:balanceMat,
    name:{ko:'등식 저울판과 수 카드',en:'Balance mat and number cards',zh:'等式天平板与数字卡'},
    why:{ko:"등호는 답이 나온다는 신호가 아니라 양쪽이 같다는 뜻입니다. 저울이 평평해지는 순간 아이는 그것을 처음으로 눈으로 봅니다.",en:"The equals sign is not a signal that an answer follows; it means both sides are the same, and a level beam shows that for the first time.",zh:"等号不是答案要来了的信号，而是两边一样。天平放平的那一刻，孩子第一次看见。"},
    steps:{ko:['저울판과 수 카드를 오립니다.','왼쪽 접시에 7과 + 와 5를, 오른쪽에 12를 놓고 평평한지 봅니다.','오른쪽에 네모를 놓고 양쪽이 같아지려면 얼마여야 하는지 찾습니다.'],
      en:['Cut out the mat and the number cards.','Put 7 + 5 on the left pan and 12 on the right, and see whether it balances.','Put the empty box on the right and find what makes both sides the same.'],
      zh:['剪下天平板和数字卡。','左盘放7加5，右盘放12，看是否平衡。','右盘放方框，找出放多少两边才一样。']},
    buy:{ name:{ko:"양팔 저울",en:"Balance scale",zh:"天平"}, why:{ko:"등호는 답이 나온다는 신호가 아니라 양쪽이 같다는 뜻입니다. 저울이 평평해지는 순간 아이는 그것을 처음으로 눈으로 봅니다. 중학교의 방정식이 여기서 시작합니다.",en:"The equals sign is not a signal that an answer follows; it means both sides are the same. A level beam shows that for the first time, and equations start here.",zh:"等号不是答案要来了的信号，而是两边一样。天平放平的那一刻孩子第一次看见，初中的方程也从这里开始。"}, pick:{ko:"접시가 크고 추가 함께 오는 것. 플라스틱이면 충분합니다.",en:"Large pans with a set of weights; plastic is fine.",zh:"托盘大、带砝码的即可，塑料的就够。"}, q:"양팔저울 학습교구" },
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
    buy:{ name:{ko:"분수 원판 세트",en:"Fraction disc set",zh:"分数圆盘套装"}, why:{ko:"조각을 겹쳐 보면 3분의 1이 4분의 1보다 크다는 것을 설명 없이 압니다. 종이보다 튼튼해 오래 씁니다.",en:"Overlapping the pieces shows that a third beats a quarter without any explanation, and plastic lasts.",zh:"把块叠起来，不用讲就知道三分之一比四分之一大，塑料的也更耐用。"}, pick:{ko:"1, 2분의 1, 3분의 1, 4분의 1, 6분의 1, 8분의 1이 다 들어 있는 것. 분모마다 색이 다르면 좋습니다.",en:"A set with 1, 1/2, 1/3, 1/4, 1/6 and 1/8; colour-coded is better.",zh:"要有1、1/2、1/3、1/4、1/6、1/8，按颜色区分更好。"}, q:"분수 원판 교구" },
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
    buy:{ name:{ko:"주방 저울",en:"Kitchen scale",zh:"厨房秤"}, why:{ko:"0.1이 화면에 실제 숫자로 찍힙니다. 0.3에 0.4를 더하면 0.7이 되는 것을 눈금으로 확인합니다.",en:"A tenth appears as a real number on the display, and adding 0.3 and 0.4 is checked on the readout.",zh:"0.1真的以数字显示在屏幕上，0.3加0.4也能用读数确认。"}, pick:{ko:"0.1g 또는 1g 단위로 읽히는 것. 화면 숫자가 큰 것이 좋습니다.",en:"Reads in 0.1g or 1g steps, with a large display.",zh:"能读到0.1克或1克，屏幕数字要大。"}, q:"주방저울 0.1g" },
    make:{ name:{ko:"종이 모눈판과 종이컵",en:"Paper grids and paper cups",zh:"纸方格板和纸杯"}, how:{ko:"위 모눈판과 0.1 띠를 오립니다. 물을 종이컵 열 개에 똑같이 나눠 담아 한 컵의 0.1이 얼마인지 봅니다.",en:"Cut out the grids and the 0.1 strips above. Pour water equally into ten cups to see what a tenth of one cup is.",zh:"剪下上面的方格板和0.1纸条。把水平均倒进十个纸杯，看看一杯的十分之一是多少。"} } }
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
