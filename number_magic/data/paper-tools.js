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
   - courseIds는 현재 커리큘럼에 명시적으로 연결하며 서로 겹치지 않는다.
   ============================================================ */
(function(){
'use strict';

var CUT = 'fill:none;stroke:#191511;stroke-width:.5;stroke-dasharray:2.5 1.6';
/* 작은 조각(낱개·동그라미)은 점선 간격을 줄인다 — 6mm 사각형에 2.5mm 점선을 쓰면 모서리가 끊겨 보인다. */
var CUT_S = 'fill:none;stroke:#191511;stroke-width:.45;stroke-dasharray:1.2 .9';
var LINE = 'fill:none;stroke:#191511;stroke-width:.4';
var THIN = 'fill:none;stroke:#918777;stroke-width:.25';
var TXT = 'font-family:Pretendard,sans-serif;font-size:3.8px;fill:#191511';

var P={ink:'#191511',green:'#2f6b4a',soft:'#e9f0e7',gold:'#a87c22',tint:'#fff1d1'};
var STRONG='fill:none;stroke:#2f6b4a;stroke-width:.7';
function segment(x,y,xx,yy,style){return '<line x1="'+x+'" y1="'+y+'" x2="'+xx+'" y2="'+yy+'" style="'+style+'"/>';}
function text(x,y,t,size,anchor){return '<text x="'+x+'" y="'+y+'" text-anchor="'+(anchor||'start')+'" style="font-family:Pretendard,sans-serif;font-size:'+(size||3.8)+'px;fill:#191511">'+t+'</text>';}
function arrow(x,y,d,color){return '<path d="M'+(x-2*d)+' '+(y-1.6)+' L'+x+' '+y+' L'+(x-2*d)+' '+(y+1.6)+'" fill="none" stroke="'+color+'" stroke-width=".6"/>';}
function fraction(x,y,n,d){return text(x,y-1,n,3.5,'middle')+segment(x-3,y+1,x+3,y+1,LINE)+text(x,y+5,d,3.5,'middle');}


function svg(w, h, body){
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + w + ' ' + h + '" ' +
    'width="' + w + 'mm" height="' + h + 'mm" role="img" aria-hidden="true">' + body + '</svg>';
}
function rect(x, y, w, h, style){ return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" style="' + style + '"/>'; }
function label(x, y, t){ return '<text x="' + x + '" y="' + y + '" style="' + TXT + '">' + t + '</text>'; }

/* 10칸 수판은 2×5의 빈 칸, 십막대는 낱개 10개를 한 줄로 묶은 수 모형이다.
   인쇄 치수: 수판 한 칸 19mm, 원 조각 지름 17mm. 칸과 조각을 같은 배율로 인쇄한다. */
function words(lang, ko, en, zh){ return lang === 'en' ? en : lang === 'zh' ? zh : ko; }
function tenFrame(lang){
  var c = 19, x = 3, b = '';
  for(var f = 0; f < 2; f++){
    var y = 15 + f * 62;
    b += label(x, y - 6, words(lang, '10칸 수판 ' + (f + 1), 'Ten-frame ' + (f + 1), '十格框 ' + (f + 1)));
    // 바깥 점선만 자르면 칸 전체가 한 장의 놀이판으로 남는다.
    b += '<rect data-part="frame" x=".5" y="' + (y - 2.5) + '" width="100" height="43" rx="2" style="' + CUT + '"/>';
    b += rect(x, y, c * 5, c * 2, 'fill:#f5f8f2;stroke:#2f6b4a;stroke-width:.65');
    b += rect(x, y, c * 5, c, 'fill:#e9f0e7;stroke:none');
    for(var i = 1; i < 5; i++) b += '<line x1="' + (x + c * i) + '" y1="' + y + '" x2="' + (x + c * i) + '" y2="' + (y + c * 2) + '" style="' + LINE + '"/>';
    b += '<line x1="' + x + '" y1="' + (y + c) + '" x2="' + (x + c * 5) + '" y2="' + (y + c) + '" style="stroke:#2f6b4a;stroke-width:.65"/>';
  }
  b += label(105, 9, words(lang, '동그라미 20개', '20 counters', '20个圆片'));
  for(var k = 0; k < 20; k++){
    var cx = 113.5 + (k % 4) * 18.5, cy = 24 + Math.floor(k / 4) * 22;
    var first = k < 10;
    b += '<circle data-part="counter" cx="' + cx + '" cy="' + cy + '" r="8.5" style="fill:' + (first ? '#e9f0e7' : '#fff1d1') + ';stroke:#191511;stroke-width:.45;stroke-dasharray:1.5 1"/>';
    // 색을 볼 수 없어도 가운데 점/고리로 두 묶음을 구별한다.
    b += '<circle cx="' + cx + '" cy="' + cy + '" r="' + (first ? 2.2 : 3.4) + '" style="fill:' + (first ? '#2f6b4a' : 'none') + ';stroke:' + (first ? '#2f6b4a' : '#765614') + ';stroke-width:.65"/>';
  }
  b += label(3, 133, words(lang, '한 칸에 하나씩 놓아요. 한 줄은 5개, 두 줄은 10개예요.', 'One counter per box. One row holds 5; two rows hold 10.', '每格放一个。一行5个，两行10个。'));
  return svg(180, 140, b);
}

/* 백 모형·십 모형·일 모형은 같은 단위 길이(8mm)를 공유한다. */
function placeValue(lang){
  var b = '', ox = 3, oy = 14, u = 8;
  b += label(ox, oy - 5, words(lang, '백 모형 1개', '1 hundred flat', '1个百板'));
  b += rect(ox, oy, u * 10, u * 10, 'fill:#f5f8f2;stroke:#191511;stroke-width:.5;stroke-dasharray:2.5 1.6');
  for(var i = 1; i < 10; i++){
    b += '<line x1="' + (ox + u * i) + '" y1="' + oy + '" x2="' + (ox + u * i) + '" y2="' + (oy + u * 10) + '" style="' + (i === 5 ? LINE : THIN) + '"/>';
    b += '<line x1="' + ox + '" y1="' + (oy + u * i) + '" x2="' + (ox + u * 10) + '" y2="' + (oy + u * i) + '" style="' + (i === 5 ? LINE : THIN) + '"/>';
  }
  var bx = 92;
  b += label(bx, oy - 5, words(lang, '십막대 8개', '8 ten rods', '8根十条'));
  for(var m = 0; m < 8; m++){
    var x = bx + m * 11;
    b += '<rect data-part="rod" x="' + x + '" y="' + oy + '" width="' + u + '" height="' + (u * 10) + '" style="fill:#e9f0e7;stroke:#191511;stroke-width:.5;stroke-dasharray:2.5 1.6"/>';
    for(var j = 1; j < 10; j++) b += '<line x1="' + x + '" y1="' + (oy + u * j) + '" x2="' + (x + u) + '" y2="' + (oy + u * j) + '" style="' + (j === 5 ? LINE : THIN) + '"/>';
  }
  var sy = 108;
  b += label(ox, sy - 5, words(lang, '일 모형 20개 (낱개)', '20 ones', '20个个位方块'));
  for(var r = 0; r < 2; r++) for(var k = 0; k < 10; k++)
    b += '<rect data-part="one" x="' + (ox + k * 12) + '" y="' + (sy + r * 12) + '" width="' + u + '" height="' + u + '" style="fill:#fff1d1;stroke:#191511;stroke-width:.45;stroke-dasharray:1.2 .9"/>';
  b += label(3, 140, words(lang, '낱개 10개를 모으면 십막대 1개와 같아요.', 'Ten ones have the same value as one ten rod.', '10个一与1根十条表示的数一样大。'));
  return svg(180, 146, b);
}

/* 13. 백판 — 1~100 수 배열판과 수 칩(2026-11-10). 아래로 한 칸은 10 큰 수, 오른쪽으로 한 칸은 1 큰 수. */
function hundredBoard(lang){
  var b = '', ox = 3, oy = 9, c = 13;
  b += label(ox, oy - 3.5, words(lang, '백판 · 1부터 100까지', 'Hundred board · 1 to 100', '百数表 · 1到100'));
  b += '<rect data-part="frame" x="' + (ox - 2) + '" y="' + (oy - 2) + '" width="' + (c * 10 + 4) + '" height="' + (c * 10 + 4) + '" rx="2" style="' + CUT + '"/>';
  for(var r = 0; r < 10; r++) for(var k = 0; k < 10; k++){
    var n = r * 10 + k + 1;
    b += '<rect data-part="hundred-cell" x="' + (ox + k * c) + '" y="' + (oy + r * c) + '" width="' + c + '" height="' + c + '" style="fill:' + (k === 9 ? '#e9f0e7' : '#fff') + ';stroke:#2f6b4a;stroke-width:.3"/>';
    b += text(ox + k * c + c / 2, oy + r * c + c / 2 + 1.8, n, n === 100 ? 4.3 : 5, 'middle');
  }
  var cx0 = 144;
  b += label(cx0 - 6, oy - 3.5, words(lang, '수 칩 14개', '14 counters', '14个圆片'));
  for(var i = 0; i < 14; i++){
    var x = cx0 + (i % 2) * 17, y = oy + 7 + Math.floor(i / 2) * 17, first = i % 2 === 0;
    b += '<circle data-part="counter" cx="' + x + '" cy="' + y + '" r="7" style="fill:' + (first ? '#e9f0e7' : '#fff1d1') + ';fill-opacity:.9;stroke:#191511;stroke-width:.45;stroke-dasharray:1.5 1"/>';
    b += '<circle cx="' + x + '" cy="' + y + '" r="' + (first ? 1.8 : 2.8) + '" style="fill:' + (first ? '#2f6b4a' : 'none') + ';stroke:' + (first ? '#2f6b4a' : '#765614') + ';stroke-width:.6"/>';
  }
  b += label(3, 146, words(lang, '아래로 한 칸 가면 10 큰 수, 오른쪽으로 한 칸 가면 1 큰 수예요.', 'One box down is 10 more. One box to the right is 1 more.', '往下一格大10，往右一格大1。'));
  return svg(180, 149, b);
}

/* 14. 수막대 — 1~10. 한 줄에 놓인 두 막대를 이으면 언제나 10이다(2026-11-10). 곧은 선만 오린다. */
/* 유아 과정(C0)은 19주 전까지 +, −, = 기호를 쓰지 않는다(check-c0-cognitive). 이 교구 지면에도 식을 쓰지 않고 말로만 적는다. */
function numberRods(lang){
  var b = '', ox = 3, oy = 12, u = 14, h = 13, gap = 4;
  var rows = [[1,9],[2,8],[3,7],[4,6],[5,5],[10],[1,2,3,4]];
  b += label(ox, oy - 5, words(lang, '수막대 · 한 줄의 막대를 이으면 10', 'Number rods · each row makes 10', '数棒 · 每一行合起来是10'));
  rows.forEach(function(row, r){
    var x = ox, y = oy + r * (h + 4);
    row.forEach(function(n, i){
      b += '<rect data-part="rod-strip" data-n="' + n + '" x="' + x + '" y="' + y + '" width="' + (u * n) + '" height="' + h + '" style="fill:' + (n % 2 ? '#e9f0e7' : '#fff1d1') + ';stroke:#191511;stroke-width:.5;stroke-dasharray:2.5 1.6"/>';
      for(var j = 1; j < n; j++) b += '<line x1="' + (x + u * j) + '" y1="' + y + '" x2="' + (x + u * j) + '" y2="' + (y + h) + '" style="' + THIN + '"/>';
      b += text(x + u * n / 2, y + h / 2 + 2, n, 5.5, 'middle');
      x += u * n + (row.length > 1 && r < 5 ? gap : 2);
    });
  });
  b += label(3, 137, words(lang, '막대 안의 가는 선은 자르지 않아요. 한 칸이 1이에요.', 'Do not cut the thin lines inside a rod. One box is 1.', '棒里面的细线不要剪。一格是1。'));
  return svg(180, 140, b);
}

/* 15. 자릿값 판과 수 칩 — 천·백·십·일(2026-11-10). 네 자리 수 과정용. 칩은 네모라 곧게 자른다. */
function placeChips(lang){
  var b = '', ox = 3, oy = 12, cw = 34, bh = 46;
  var heads = [words(lang,'천','Thousands','千'), words(lang,'백','Hundreds','百'), words(lang,'십','Tens','十'), words(lang,'일','Ones','个')];
  b += label(ox, oy - 5, words(lang, '자릿값 판', 'Place-value mat', '数位板'));
  b += '<rect data-part="frame" x="' + (ox - 2) + '" y="' + (oy - 2) + '" width="' + (cw * 4 + 4) + '" height="' + (bh + 4) + '" rx="2" style="' + CUT + '"/>';
  heads.forEach(function(t, i){
    b += rect(ox + i * cw, oy, cw, bh, 'fill:' + (i % 2 ? '#fff' : '#f5f8f2') + ';stroke:#2f6b4a;stroke-width:.5');
    b += rect(ox + i * cw, oy, cw, 9, 'fill:#e9f0e7;stroke:#2f6b4a;stroke-width:.5');
    b += text(ox + i * cw + cw / 2, oy + 6.5, t, 4.4, 'middle');
  });
  var sets = [[1000,4,'#fff'],[100,12,'#e9f0e7'],[10,12,'#fff1d1'],[1,12,'#fff']], y = oy + bh + 12, u = 13.5;
  b += label(ox, y - 4, words(lang, '수 칩 · 1000 네 개, 100·10·1 열두 개씩', 'Chips · four 1000s; twelve each of 100, 10, 1', '数片 · 1000四个，100、10、1各十二个'));
  sets.forEach(function(st, r){
    for(var k = 0; k < st[1]; k++){
      var x = ox + k * u, yy = y + r * (u + 2.5);
      b += '<rect data-part="value-chip" data-v="' + st[0] + '" x="' + x + '" y="' + yy + '" width="' + u + '" height="' + u + '" style="fill:' + st[2] + ';stroke:#191511;stroke-width:.45;stroke-dasharray:1.5 1"/>';
      b += text(x + u / 2, yy + u / 2 + 1.5, st[0], st[0] === 1000 ? 3.6 : 4.2, 'middle');
    }
  });
  return svg(180, 142, b);
}

/* 3. 수직선 띠 — 0~20 두 개(뛰어세기·덧뺄), 0~100 한 개(십의 자리로 건너뛰기). */
function numberLine(lang){
  var b='',ox=7,w=166;
  [0,1,2].forEach(function(k){
    var y=17+k*36,max=k===2?100:20,step=k===2?10:1,n=max/step,dx=w/n;
    b+=label(ox,y-9,k===2?words(lang,'0~100 · 한 칸은 10','0–100 · each step is 10','0~100，每格10'):words(lang,'0~20 · 한 칸은 1','0–20 · each step is 1','0~20，每格1'));
    b+=rect(2,y-6,176,23,CUT);
    b+='<line data-part="number-axis" x1="5" y1="'+y+'" x2="175" y2="'+y+'" style="'+LINE+'"/>';
    b+=arrow(174,y,1,P.green);
    for(var i=0;i<=n;i++){
      var x=ox+dx*i;
      b+=segment(x,y-2,x,y+2,i%5===0?STRONG:LINE);
      b+=text(x,y+10,i*step,3.6,'middle');
    }
  });
  b+=label(7,127,words(lang,'0에서 20까지는 똑같은 간격으로 1씩 커져요.','Equal spaces show equal steps.','相同的间隔表示相同的增加量。'));
  return svg(180,134,b);
}

/* 4. 곱셈 배열판 — 10×10 점 격자와 ㄱ자 가림판 2장. 3×4 를 "직사각형"으로 본다. */
function arrayBoard(lang){
  var b='',u=11,ox=4,oy=15;
  b+=label(ox,8,words(lang,'점 배열판 · 10줄, 한 줄에 10개','Dot array · 10 rows of 10','点阵板：10行，每行10个'));
  b+=rect(ox,oy,110,110,'fill:#fdfbf5;stroke:#191511;stroke-width:.5;stroke-dasharray:2.5 1.6');
  for(var r=0;r<10;r++)for(var c=0;c<10;c++)b+='<circle data-part="array-dot" cx="'+(ox+(c+.5)*u)+'" cy="'+(oy+(r+.5)*u)+'" r="2.1" fill="'+P.green+'"/>';
  b+=label(121,8,words(lang,'모서리 표시자 2개','2 corner markers','2个角标'));
  for(var k=0;k<2;k++){
    var x=122,y=oy+k*60;
    b+='<path data-part="corner-marker" d="M'+x+' '+y+' h55 v7 h-48 v48 h-7 z" style="fill:'+P.soft+';stroke:'+P.ink+';stroke-width:.5;stroke-dasharray:2.5 1.6"/>';
  }
  b+=label(4,139,words(lang,'표시자는 범위의 모서리를 짚어요. 점을 가리는 종이가 아니에요.','Markers show the corners of your chosen array.','角标标出选定范围的角，不是把点全部遮住。'));
  return svg(180,146,b);
}

/* 5. 등식 저울판 — 양팔 저울 그림 위에 수 카드를 올려 "="을 눈으로 맞춘다.
   원장 2026-09-08: 사는 쪽 예로 양팔 저울을 들었다. 저울은 =를 "답이 나온다"가 아니라
   "양쪽이 같다"로 보게 하는 유일한 교구다(과정 11~12 역연산·네모 구하기와 직결). */
function balanceMat(lang){
  var b='',cx=90;
  // Printed comparison mat. The beam is a diagram, not a mechanical scale.
  b+='<path d="M82 18 L98 18 L106 61 L74 61 Z" fill="'+P.soft+'" stroke="'+P.green+'" stroke-width=".5"/>';
  b+=rect(68,61,44,4,'fill:'+P.green+';stroke:none');
  b+=segment(30,15,150,15,STRONG)+'<circle cx="90" cy="15" r="3" fill="'+P.gold+'"/>';
  [40,140].forEach(function(x){b+=segment(x,15,x,28,LINE);b+='<path d="M'+(x-32)+' 28 H'+(x+32)+' L'+(x+25)+' 57 H'+(x-25)+' Z" fill="#fdfbf5" stroke="'+P.green+'" stroke-width=".6"/>';});
  b+=label(9,74,words(lang,'왼쪽 식을 놓아요','Left expression','左边的算式'));
  b+=label(104,74,words(lang,'오른쪽 수를 놓아요','Right value','右边的数'));
  b+=rect(7,78,66,24,'fill:'+P.soft+';stroke:'+P.green+';stroke-width:.4');
  b+=rect(102,78,66,24,'fill:'+P.soft+';stroke:'+P.green+';stroke-width:.4');
  b+=text(87.5,94,'=',10,'middle');
  b+=label(7,114,words(lang,'수 카드 · 바깥 점선을 따라 오려요','Cards · cut dashed outlines','数字卡：沿外侧虚线剪'));
  var cards=['0','1','2','3','4','5','6','7','8','9','10','+','−','×','÷','□'];
  cards.forEach(function(c,i){var x=7+i%8*21,y=119+Math.floor(i/8)*23;b+='<rect data-part="number-card" data-value="'+c+'" x="'+x+'" y="'+y+'" width="19" height="19" rx="1.3" style="fill:'+(i>10?P.tint:P.soft)+';stroke:'+P.ink+';stroke-width:.45;stroke-dasharray:1.5 1"/>';b+=text(x+9.5,y+13,c,8,'middle');});
  return svg(180,165,b);
}

/* 5. 분수 원판 — 1 · 1/2 · 1/3 · 1/4 · 1/6 · 1/8. 겹쳐서 크기를 비교한다. */
function fractionDisc(lang){
  var b='',R=25,parts=[1,2,3,4,6,8];
  parts.forEach(function(n,i){
    var cx=32+i%3*58,cy=30+Math.floor(i/3)*66;
    b+='<circle data-part="fraction-disc" data-parts="'+n+'" cx="'+cx+'" cy="'+cy+'" r="'+R+'" fill="'+(i%2?P.tint:P.soft)+'" stroke="'+P.ink+'" stroke-width=".5" stroke-dasharray="2 1.5"/>';
    for(var k=0;k<n&&n>1;k++){var a=2*Math.PI*k/n-Math.PI/2;b+=segment(cx,cy,cx+R*Math.cos(a),cy+R*Math.sin(a),CUT_S);}
    var fy=cy+R+8;
    if(n===1)b+=text(cx,fy,words(lang,'전체 1','1 whole','整体1'),3.8,'middle');
    else b+='<g data-part="fraction-label">'+fraction(cx-14,fy,'1',n)+text(cx-6,fy+1,words(lang,n+'조각',n+' pieces',n+'块'),3.5)+'</g>';
  });
  return svg(180,143,b);
}

/* 6. 소수 모눈 — 1을 100칸으로. 0.1 띠는 **판의 한 줄과 정확히 같은 크기**여야 덮어 볼 수 있다
   (2026-09-08 첫 판은 띠가 작은 사각형이라 판과 안 맞았다 — 교구로서 틀린 그림이었다). */
function decimalGrid(lang){
 var b='',u=7.4,side=74;
 [4,99].forEach(function(x,k){var y=13;b+=label(x,7,words(lang,'전체 1 = 100칸','1 whole = 100 cells','整体1＝100格'));b+='<rect data-part="decimal-whole" x="'+x+'" y="'+y+'" width="74" height="74" style="fill:#fdfbf5;stroke:'+P.ink+';stroke-width:.5;stroke-dasharray:2.5 1.6"/>';for(var i=1;i<10;i++){b+=segment(x+u*i,y,x+u*i,y+side,i===5?LINE:THIN);b+=segment(x,y+u*i,x+side,y+u*i,i===5?LINE:THIN);}});
 b+=label(4,99,words(lang,'한 줄 띠 10개 · 한 줄은 0.1, 한 칸은 0.01','10 strips · each strip is 0.1; each cell is 0.01','10条纸条：每条0.1，每格0.01'));
 for(var k=0;k<10;k++){var x=4+k%2*95,y=105+Math.floor(k/2)*11;b+='<rect data-part="decimal-strip" x="'+x+'" y="'+y+'" width="74" height="7.4" style="fill:'+(k<6?P.soft:P.tint)+';stroke:'+P.ink+';stroke-width:.45;stroke-dasharray:1.5 1"/>';for(var j=1;j<10;j++)b+=segment(x+u*j,y,x+u*j,y+u,THIN);}
 return svg(180,160,b);
}


/* 7. 펜토미노 12조각 + 6×10 판 — 경시의 탑(과정 26~28). 원장이 준 교재 목록에도 표준으로 들어 있다.
   조각 경계만 자르는 선이고 안쪽 칸 금은 얇은 선이다(칸마다 자르면 조각이 부서진다). */
function pentomino(lang){
  var S = {
    F:[[1,0],[2,0],[0,1],[1,1],[1,2]], I:[[0,0],[1,0],[2,0],[3,0],[4,0]],
    L:[[0,0],[0,1],[0,2],[0,3],[1,3]], N:[[1,0],[1,1],[0,1],[0,2],[0,3]],
    P:[[0,0],[1,0],[0,1],[1,1],[0,2]], T:[[0,0],[1,0],[2,0],[1,1],[1,2]],
    U:[[0,0],[2,0],[0,1],[1,1],[2,1]], V:[[0,0],[0,1],[0,2],[1,2],[2,2]],
    W:[[0,0],[0,1],[1,1],[1,2],[2,2]], X:[[1,0],[0,1],[1,1],[2,1],[1,2]],
    Y:[[1,0],[1,1],[0,1],[1,2],[1,3]], Z:[[0,0],[1,0],[1,1],[1,2],[2,2]]
  };
  var u = 8, b = '', keys = Object.keys(S), ox = 3, oy = 18;
  b += label(ox, 8, words(lang,'6 × 10 판','6 × 10 board','6 × 10方格板'));
  b += rect(ox, oy, u * 6, u * 10, CUT);
  for(var i = 1; i < 6; i++) b += '<line x1="' + (ox + u * i) + '" y1="' + oy + '" x2="' + (ox + u * i) + '" y2="' + (oy + u * 10) + '" style="' + THIN + '"/>';
  for(var j = 1; j < 10; j++) b += '<line x1="' + ox + '" y1="' + (oy + u * j) + '" x2="' + (ox + u * 6) + '" y2="' + (oy + u * j) + '" style="' + THIN + '"/>';
  var px = 54, py = oy - 4, colw = 42, rowh = 40;
  b += label(px, 8, words(lang,'조각 12개 · 점선만 오려요','12 pieces · cut dashed outlines','12块：只剪虚线'));
  keys.forEach(function(k, n){
    var gx = px + (n % 3) * colw, gy = py + 4 + Math.floor(n / 3) * rowh;
    var cells = S[k], has = {};
    cells.forEach(function(c){ has[c[0] + ',' + c[1]] = 1; });
    b += '<g data-part="pento-piece" data-piece="'+k+'">';
    cells.forEach(function(c){
      var x = gx + c[0] * u, y = gy + c[1] * u;
      b += rect(x, y, u, u, 'fill:'+(n%2?P.tint:P.soft)+';stroke:#8a8374;stroke-width:.25');
      /* 이웃이 없는 변만 자르는 선 */
      if(!has[(c[0]) + ',' + (c[1] - 1)]) b += '<line x1="' + x + '" y1="' + y + '" x2="' + (x + u) + '" y2="' + y + '" style="' + CUT + '"/>';
      if(!has[(c[0]) + ',' + (c[1] + 1)]) b += '<line x1="' + x + '" y1="' + (y + u) + '" x2="' + (x + u) + '" y2="' + (y + u) + '" style="' + CUT + '"/>';
      if(!has[(c[0] - 1) + ',' + (c[1])]) b += '<line x1="' + x + '" y1="' + y + '" x2="' + x + '" y2="' + (y + u) + '" style="' + CUT + '"/>';
      if(!has[(c[0] + 1) + ',' + (c[1])]) b += '<line x1="' + (x + u) + '" y1="' + y + '" x2="' + (x + u) + '" y2="' + (y + u) + '" style="' + CUT + '"/>';
    });
    b += '<text x="' + gx + '" y="' + (gy - 1.5) + '" style="' + TXT + '">' + k + '</text></g>';
  });
  b += label(3, 112, words(lang,'완성 예시','One solution','拼成的例子'));
  b += pentoPicture(3,117,4.3);
  b += text(3,169,'5 × 12 = 60',3.8);
  return svg(180, 174, b);
}

/* 8. 정수 수직선 — 0 을 가운데 두고 양쪽으로. 음수는 "작은 수"가 아니라 반대 방향이다(과정 29~31). */
function intLine(lang){
 var b='',ox=8,w=164;
 [17,53].forEach(function(y,k){b+=label(ox,y-8,words(lang,k?'한 번 더 놓아 보는 수직선':'0의 왼쪽은 음수, 오른쪽은 양수',k?'A second number line':'Negative left of zero; positive right','0左边是负数，右边是正数'));b+=rect(2,y-6,176,23,CUT);b+=segment(5,y,175,y,STRONG)+arrow(5,y,-1,P.green)+arrow(175,y,1,P.green);for(var i=0;i<=20;i++){var v=i-10,x=ox+w*i/20;b+=segment(x,y-2,x,y+2,v%5===0?STRONG:LINE);b+=text(x,y+10,v===0?'0':String(v).replace('-','−'),3.2,'middle');}b+='<circle cx="90" cy="'+y+'" r="1.3" fill="'+P.green+'"/>';});
 b+=label(5,87,words(lang,'정수 카드 12장 + 연산 카드 2장','12 integer cards + 2 operation cards','12张整数卡＋2张运算卡'));
 var vals=[1,2,3,5,7,-1,-2,-3,-5,-7,10,-10,'+','−'];
 vals.forEach(function(v,i){var x=5+i%7*24,y=94+Math.floor(i/7)*25,op=i>=12;b+='<rect data-part="'+(op?'operation-card':'integer-card')+'" data-value="'+v+'" x="'+x+'" y="'+y+'" width="22" height="21" rx="1.3" style="fill:'+(op?P.tint:P.soft)+';stroke:'+P.ink+';stroke-width:.45;stroke-dasharray:1.5 1"/>';b+=text(x+11,y+13,op?v:v>0?'+'+v:String(v).replace('-','−'),7.5,'middle');});
 b+=label(5,151,words(lang,'양수를 더하면 오른쪽, 음수를 더하면 왼쪽으로 가요.','Add a positive: move right. Add a negative: move left.','加正数向右，加负数向左。'));
 return svg(180,158,b);
}

/* 9. 대수 타일 — x² · x · 1. 다항식을 넓이로 본다(과정 32~35). 인수분해는 직사각형 맞추기가 된다. */
function algebraTiles(lang){
 var b='',X=30,U=10;
 b+=label(4,8,words(lang,'x² 타일 4개','4 x² tiles','4块x²'));
 for(var i=0;i<4;i++){var x=4+i*39;b+='<rect data-part="algebra-square" x="'+x+'" y="14" width="30" height="30" style="fill:'+P.soft+';stroke:'+P.ink+';stroke-width:.5;stroke-dasharray:2.5 1.6"/>';b+=text(x+15,33,'x²',9,'middle');}
 b+=label(4,55,words(lang,'x 타일 8개 · 가로 1, 세로 x','8 x tiles · sides 1 and x','8块x：两边长为1和x'));
 for(var j=0;j<8;j++){var x=4+j*21;b+='<rect data-part="algebra-x" x="'+x+'" y="61" width="10" height="30" style="fill:'+P.tint+';stroke:'+P.ink+';stroke-width:.5;stroke-dasharray:2.5 1.6"/>';b+=text(x+5,80,'x',7,'middle');}
 b+=label(4,103,words(lang,'1 타일 20개 · 한 변 1','20 unit tiles · side 1','20块单位方块：边长1'));
 for(var k=0;k<20;k++){var x=4+k%10*16,y=110+Math.floor(k/10)*16;b+='<rect data-part="algebra-one" x="'+x+'" y="'+y+'" width="10" height="10" style="fill:#fdfbf5;stroke:'+P.ink+';stroke-width:.45;stroke-dasharray:1.5 1"/>';b+=text(x+5,y+7,'1',4,'middle');}
 b+=label(4,146,words(lang,'x > 0인 넓이 모형입니다. 그림의 길이 비는 예시예요.','Area model for x > 0. Length proportions are illustrative.','这是x＞0的面积模型，图中的长度比仅作示意。'));
 return svg(180,153,b);
}

/* 10. 좌표 모눈판 — 사분면. 점과 직선·원을 손으로 찍어 본다(과정 36~39). */
function coordGrid(lang){
 var b='',u=7,ox=20,oy=13,cx=90,cy=83;
 b+=rect(12,3,156,159,CUT);
 b+=rect(ox,oy,140,140,'fill:#fdfbf5;stroke:'+P.green+';stroke-width:.4');
 for(var i=1;i<20;i++){b+=segment(ox+u*i,oy,ox+u*i,oy+140,i%5===0?LINE:THIN);b+=segment(ox,oy+u*i,ox+140,oy+u*i,i%5===0?LINE:THIN);}
 b+=segment(16,cy,164,cy,STRONG)+arrow(164,cy,1,P.green);
 b+=segment(cx,157,cx,9,STRONG)+'<path d="M88 12 L90 9 L92 12" fill="none" stroke="'+P.green+'" stroke-width=".6"/>';
 for(var v=-10;v<=10;v+=5){if(!v)continue;b+=text(cx+u*v,cy+5,v,3.4,'middle');b+=text(cx-3,cy-u*v+1,v,3.4,'end');}
 b+=text(cx-3,cy+5,'0',3.4,'end')+text(164,cy-3,'x',4,'end')+text(cx+3,10,'y',4);
 return svg(180,169,b);
}

/* 11. 단위원 판 — 반지름 1, 30\u00b0\u00b745\u00b0 눈금. 삼각함수를 좌표로 읽는다(과정 40~45). */
function unitCircle(lang){
 var b='',R=50,cx=90,cy=64;
 b+=rect(25,.5,130,124,CUT);
 b+='<circle data-part="unit-circle" cx="90" cy="64" r="50" fill="#fdfbf5" stroke="'+P.green+'" stroke-width=".6"/>';
 b+=segment(29,cy,151,cy,LINE)+arrow(151,cy,1,P.green)+segment(cx,122,cx,6,LINE);
 b+='<path d="M88 9 L90 6 L92 9" fill="none" stroke="'+P.green+'" stroke-width=".5"/>';
 for(var v=-1;v<=1.01;v+=.5){if(!v)continue;var x=cx+v*R,y=cy-v*R;b+=segment(x,cy-1.5,x,cy+1.5,LINE)+text(x,cy+6,v,3.3,'middle');b+=segment(cx-1.5,y,cx+1.5,y,LINE)+text(cx+3,y+1,v,3.3);}
 b+=text(cx-3,cy+6,'0',3.3,'end')+text(151,cy-3,'x',3.5)+text(cx+4,8,'y',3.5);
 for(var a=0;a<360;a+=15){var th=-a*Math.PI/180,r0=a%45===0?R-4:R-2;b+=segment(cx+r0*Math.cos(th),cy+r0*Math.sin(th),cx+R*Math.cos(th),cy+R*Math.sin(th),LINE);if(a%90===0||[30,45,60].indexOf(a)>=0){var lx=cx+(R+7)*Math.cos(th),ly=cy+(R+7)*Math.sin(th)+1;if(a===90)lx-=8;if(a===0||a===180)ly-=10;b+=text(lx,ly,a+'°',3.3,'middle');}}
 b+='<circle data-part="disc-pivot" cx="90" cy="64" r="1" fill="'+P.ink+'"/>';
 b+=label(7,133,words(lang,'반지름 자'+' · 두 점 사이가 반지름 1','Radius arm · distance between the dots is 1','半径尺：两点间的长度为半径1'));
 b+=rect(8,138,60,12,'fill:'+P.soft+';stroke:'+P.ink+';stroke-width:.5;stroke-dasharray:2.5 1.6');
 b+='<circle data-part="arm-pivot" cx="12" cy="144" r="1" fill="'+P.ink+'"/><circle data-part="arm-tip" cx="62" cy="144" r="1" fill="'+P.green+'"/>';
 b+=segment(12,144,62,144,LINE)+text(37,142,'1',3.4,'middle');
 return svg(180,157,b);
}

var PENTO_EXAMPLE=[["F", "I", "I", "I", "I", "I"], ["F", "F", "F", "X", "U", "U"], ["L", "F", "X", "X", "X", "U"], ["L", "P", "P", "X", "U", "U"], ["L", "P", "P", "V", "V", "V"], ["L", "L", "P", "Z", "N", "V"], ["Y", "Z", "Z", "Z", "N", "V"], ["Y", "Z", "T", "W", "N", "N"], ["Y", "Y", "T", "W", "W", "N"], ["Y", "T", "T", "T", "W", "W"]];
function pentoPicture(x,y,u){
 var b='',names='FILNPTUVWXYZ';
 PENTO_EXAMPLE.forEach(function(row,r){row.forEach(function(k,c){var fill=names.indexOf(k)%2?P.tint:P.soft;b+='<rect data-part="pento-example-cell" data-piece="'+k+'" x="'+(x+c*u)+'" y="'+(y+r*u)+'" width="'+u+'" height="'+u+'" fill="'+fill+'"/>';[[0,-1],[0,1],[-1,0],[1,0]].forEach(function(d){var rr=r+d[1],cc=c+d[0];if(PENTO_EXAMPLE[rr]&&PENTO_EXAMPLE[rr][cc]===k)return;var xa=x+c*u,ya=y+r*u;b+=segment(xa+(d[0]===1?u:0),ya+(d[1]===1?u:0),xa+(d[0]===-1?0:u),ya+(d[1]===-1?0:u),'stroke:'+P.ink+';stroke-width:.35');});});});return b;
}
/* Small worked states are separate from pieces that will be cut out. */
function paperDemo(key,lang){
 var b='',g=P.green,t=P.gold;
 function dot(x,y,ring){return '<circle data-kind="'+(ring?'ring':'dot')+'" cx="'+x+'" cy="'+y+'" r="1.9" fill="'+(ring?'none':g)+'" stroke="'+(ring?t:g)+'" stroke-width=".6"/>';}
 if(key==='tenframe'){
  [10,5].forEach(function(n,f){var x=4+f*48,y=5,c=7;b+=rect(x,y,35,14,LINE);for(var j=1;j<5;j++)b+=segment(x+j*c,y,x+j*c,y+14,THIN);b+=segment(x,y+7,x+35,y+7,LINE);for(var k=0;k<n;k++)b+=dot(x+(k%5+.5)*c,y+(Math.floor(k/5)+.5)*c,f===1||(f===0&&k>=8));});
 }else if(key==='place'){
  b+=rect(2,1,25,25,'fill:#f5f8f2;stroke:'+g+';stroke-width:.4');for(var q=1;q<10;q++)b+=segment(2+2.5*q,1,2+2.5*q,26,THIN)+segment(2,1+2.5*q,27,1+2.5*q,THIN);
  for(var r=0;r<3;r++){b+=rect(32+r*5,1,2.5,25,'fill:'+P.soft+';stroke:'+g+';stroke-width:.4');for(var k=1;k<10;k++)b+=segment(32+r*5,1+2.5*k,34.5+r*5,1+2.5*k,THIN);}
  for(var i=0;i<7;i++)b+=rect(50+i%4*5,6+Math.floor(i/4)*8,2.5,2.5,'fill:'+P.tint+';stroke:'+t+';stroke-width:.4');b+=text(86,18,'137',9,'middle');
 }else if(key==='hundred'){
  var c=8,x=30,y=1;[[23,24,25],[33,34,35],[43,44,45]].forEach(function(row,r){row.forEach(function(n,k){var on=n===34,to=n===44;b+=rect(x+k*c*1.6,y+r*c*1.1,c*1.6,c*1.1,'fill:'+(on?P.soft:to?P.tint:'#fff')+';stroke:'+g+';stroke-width:.35');b+=text(x+k*c*1.6+c*.8,y+r*c*1.1+6.3,n,4.2,'middle');});});
  b+=segment(x+c*2.4,y+c*1.9,x+c*2.4,y+c*2.3,'stroke:'+g+';stroke-width:.7')+text(84,17,'+10',5.5,'middle');
 }else if(key==='rods'){
  var u=5.2,x=14,y=3;b+=rect(x,y,u*10,8,'fill:'+P.tint+';stroke:'+g+';stroke-width:.45')+text(x+u*5,y+6,'10',4.5,'middle');
  b+=rect(x,y+11,u*3,8,'fill:'+P.soft+';stroke:'+g+';stroke-width:.45')+text(x+u*1.5,y+17,'3',4.5,'middle');
  b+=rect(x+u*3,y+11,u*7,8,'fill:#fff;stroke:'+t+';stroke-width:.45;stroke-dasharray:1.4 1')+text(x+u*6.5,y+17,'7',4.5,'middle');
 }else if(key==='placechips'){
  var u=5.4,x=4;for(var i=0;i<12;i++){var cx=x+(i%6)*(u+.8),cy=3+Math.floor(i/6)*(u+.8);b+=rect(cx,cy,u,u,'fill:'+P.soft+';stroke:'+g+';stroke-width:.35');}
  b+=rect(x-1.2,1.8,5*(u+.8)+u+1.6,u+2.4,'fill:none;stroke:'+t+';stroke-width:.6;stroke-dasharray:1.6 1')+rect(x+4*(u+.8)-1.2,3+u+.8-1.2,2*(u+.8)+.6,u+2.4,'fill:none;stroke:'+t+';stroke-width:.6;stroke-dasharray:1.6 1');
  b+=text(52,17,'→',6,'middle')+rect(62,8,11,11,'fill:#fff;stroke:'+g+';stroke-width:.45')+text(67.5,15.3,'1000',3,'middle');
  b+=rect(76,8,7,7,'fill:'+P.soft+';stroke:'+g+';stroke-width:.35')+rect(84,8,7,7,'fill:'+P.soft+';stroke:'+g+';stroke-width:.35');
 }else if(key==='numberline'){
  b+=segment(5,17,96,17,LINE)+arrow(96,17,1,g);for(var i=0;i<6;i++){var x=8+i*16;b+=segment(x,15,x,19,LINE)+text(x,25,8+i,3.7,'middle');if(i<5)b+='<path d="M'+x+' 15 Q'+(x+8)+' 1 '+(x+16)+' 15" fill="none" stroke="'+g+'" stroke-width=".6"/>'+arrow(x+16,15,1,g);}
 }else if(key==='array'){
  b+=rect(17,2,48,24,'fill:'+P.soft+';stroke:'+g+';stroke-width:.5');for(var r=0;r<3;r++)for(var c=0;c<4;c++)b+=dot(23+c*12,6+r*8);b+=text(78,18,'12',10,'middle');
 }else if(key==='balance'){
  b+=rect(3,4,36,19,'fill:'+P.soft+';stroke:'+g+';stroke-width:.5')+rect(61,4,36,19,'fill:'+P.soft+';stroke:'+g+';stroke-width:.5');b+=text(21,17,'7 + 5',7,'middle')+text(50,17,'=',8,'middle')+text(79,17,'12',7,'middle');
 }else if(key==='fraction'){
  [26,74].forEach(function(x,f){var y=13,R=11;b+='<path d="M'+x+' '+(y-R)+' A'+R+' '+R+' 0 0 1 '+x+' '+(y+R)+' L'+x+' '+y+' Z" fill="'+(f?P.tint:P.soft)+'"/>';b+='<circle cx="'+x+'" cy="'+y+'" r="'+R+'" fill="none" stroke="'+g+'" stroke-width=".5"/>'+segment(x,y-R,x,y+R,LINE);if(f)b+=segment(x-R,y,x+R,y,LINE);});b+=text(50,17,'=',7,'middle');
 }else if(key==='decimal'){
  var u=2.2,x=12,y=2;for(var r=0;r<10;r++)for(var c=0;c<10;c++)b+=rect(x+c*u,y+r*u,u,u,'fill:'+(r<3?P.soft:r<7?P.tint:'#fff')+';stroke:'+g+';stroke-width:.15');b+=text(63,16,'0.3 + 0.4',5,'middle')+text(63,24,'= 0.7',5,'middle');
 }else if(key==='pentomino'){
  b+='<g transform="translate(67 1) rotate(90)">'+pentoPicture(0,0,4)+'</g>';
 }else if(key==='intline'){
  b+=segment(7,17,94,17,LINE)+arrow(7,17,-1,g)+arrow(94,17,1,g);for(var i=0;i<=10;i++){var x=10+i*8;b+=segment(x,15,x,19,THIN);if([0,2,7,10].indexOf(i)>=0)b+=text(x,25,i-10,3.5,'middle');}b+='<path d="M66 13 Q46 -1 26 13" fill="none" stroke="'+t+'" stroke-width=".7"/>'+arrow(26,13,-1,t)+text(46,5,'−5',4,'middle');
 }else if(key==='algtiles'){
  var x=17,y=3,X=12,U=4;b+=rect(x,y,X,X,'fill:'+P.soft+';stroke:'+g+';stroke-width:.4');
  b+=rect(x+X,y,U,X,'fill:'+P.tint+';stroke:'+g+';stroke-width:.4');
  for(var r=0;r<2;r++){b+=rect(x,y+X+r*U,X,U,'fill:'+P.tint+';stroke:'+g+';stroke-width:.4')+rect(x+X,y+X+r*U,U,U,LINE);}
  b+=text(42,16,'x + 2',3.5)+text(17,27,'x + 1',3.5)+text(75,13,'x² + 3x + 2',4,'middle');
 }else if(key==='coord'){
  for(var i=0;i<=6;i++){b+=segment(5+i*4,1,5+i*4,25,THIN)+segment(5,1+i*4,29,1+i*4,THIN);}b+=segment(5,21,30,21,LINE)+arrow(30,21,1,g)+segment(9,25,9,1,LINE);b+=segment(9,25,29,5,'stroke:'+g+';stroke-width:.6');b+='<circle cx="17" cy="17" r=".9" fill="'+g+'"/><circle cx="25" cy="9" r=".9" fill="'+g+'"/>'+text(40,10,'A(2,1)',4)+text(40,22,'B(4,3)',4);
 }else if(key==='unitcircle'){
  var x=22,y=14,R=10,px=x+R*Math.sqrt(3)/2,py=y-R/2;b+='<circle cx="'+x+'" cy="'+y+'" r="10" fill="none" stroke="'+g+'" stroke-width=".5"/>'+segment(9,y,37,y,THIN)+segment(x,26,x,1,THIN)+segment(x,y,px,py,'stroke:'+g+';stroke-width:.7')+segment(px,py,px,y,'stroke:'+t+';stroke-width:.5;stroke-dasharray:1 1')+'<circle cx="'+px+'" cy="'+py+'" r=".9" fill="'+g+'"/>';b+=text(46,10,'cos 30° =',3.8)+fraction(77,9,'√3','2')+text(46,23,'sin 30° =',3.8)+fraction(77,22,'1','2');
 }
 return svg(100,30,b);
}

window.NM_PAPER_TOOLS = [
  {
    "key": "tenframe",
    "name": {
      "ko": "10칸 수판과 수 조각",
      "en": "Ten-frame and counters",
      "zh": "十格框与圆片"
    },
    "why": {
      "ko": "10칸 수판(십틀)은 동그라미를 놓는 빈 칸이에요. 낱개 10개를 한 줄로 묶은 십막대와는 달라요.",
      "en": "A ten-frame has ten spaces for counters. A ten rod is different: ten units joined in a row.",
      "zh": "十格框是放圆片的十个空格。十条则是把十个单位连成一行，两者不同。"
    },
    "steps": {
      "ko": [
        "첫 수판에 8개, 둘째 수판에 7개를 놓아요.",
        "둘째 수판에서 2개를 옮겨 첫 수판의 빈 칸을 채워요.",
        "꽉 찬 10개와 남은 5개! 모두 15개인지 세어 봐요."
      ],
      "en": [
        "Place 8 counters on the first frame and 7 on the second.",
        "Move 2 from the second frame to fill the first frame.",
        "A full ten and 5 more! Count to check that there are 15."
      ],
      "zh": [
        "第一张放8个，第二张放7个。",
        "从第二张移2个，把第一张填满。",
        "满满的10个和剩下的5个！数一数，共15个。"
      ]
    },
    "buy": {
      "name": {
        "ko": "연결 큐브",
        "en": "Linking cubes",
        "zh": "连接积木"
      },
      "why": {
        "ko": "수판 대신 큐브를 10개씩 연결해도 10 만들기를 할 수 있어요.",
        "en": "As an alternative to frames, join cubes in groups of ten.",
        "zh": "也可以不用框，把积木每10个连成一条来凑十。"
      },
      "pick": {
        "ko": "아이 손으로 쉽게 붙이고 뗄 수 있는 크기.",
        "en": "Easy for small hands to join and separate.",
        "zh": "选择孩子容易拼接和拆开的大小。"
      },
      "key": "cubes"
    },
    "make": {
      "name": {
        "ko": "이 종이 교구로 충분해요",
        "en": "Use this paper set",
        "zh": "用这套纸教具就够了"
      },
      "how": {
        "ko": "바깥 점선을 따라 수판 2장과 동그라미를 오려요. 수판 안쪽 선은 자르지 않아요. 가위는 보호자와 함께 써요.",
        "en": "Cut out both frames and the counters along the dashed outlines. Keep the grid lines intact. An adult helps with scissors.",
        "zh": "沿外侧虚线剪下两张框和圆片，框内的实线不要剪。请大人协助使用剪刀。"
      }
    },
    "courseIds": [
      2
    ],
    "secondCourseIds": [
      1
    ],
    "order": 1,
    "audience": "early",
    "portrait": "numi-0-happy.png",
    "exampleTex": "8+7=10+5=15",
    "exampleText": {
      "ko": "8개에 2개를 옮겨 10개를 만들었어요.",
      "en": "Move 2 to the 8 to complete ten.",
      "zh": "给8个移来2个，凑成10个。"
    },
    "build": tenFrame,
    "demo": function(lang){return paperDemo("tenframe",lang);}
  },
  {
    "key": "place",
    "name": {
      "ko": "수 모형: 백 모형·십막대·낱개",
      "en": "Hundred board, ten rods, ones",
      "zh": "百板·十条·个"
    },
    "why": {
      "ko": "작은 정사각형 1개는 1, 십막대 1개는 10, 큰 정사각형 1개는 100을 나타내요. 낱개 10개를 십막대 1개와 바꾸며 수를 만들어요.",
      "en": "Bundling ten into one is place value itself. Carrying is trading ten ones for one rod.",
      "zh": "把十个捆成一个，就是位值本身。进位就是用十个\"个\"换一根\"十条\"。"
    },
    "steps": {
      "ko": [
        "바깥 점선을 따라 백 모형, 십막대, 낱개를 오려요.",
        "백 모형 1개, 십막대 3개, 낱개 7개를 놓아 137을 만들어요.",
        "낱개 10개를 모아 십막대 1개와 바꾸어 봐요."
      ],
      "en": [
        "Cut along the outer dashed lines.",
        "Place 1 hundred, 3 tens and 7 ones to represent 137.",
        "Trade ten ones for one ten rod."
      ],
      "zh": [
        "沿外侧虚线剪下数模型。",
        "摆1个百板、3根十条、7个一，表示137。",
        "把10个一换成1根十条。"
      ]
    },
    "buy": {
      "name": {
        "ko": "십진 블록 세트",
        "en": "Base-ten blocks",
        "zh": "十进制积木"
      },
      "why": {
        "ko": "낱개 10개와 십막대 1개를 바꾸며 자릿값을 살펴봐요.",
        "en": "Trade ten unit blocks for one ten rod to explore place value.",
        "zh": "把10个个位块换成1根十条，观察位值。"
      },
      "pick": {
        "ko": "낱개 100개, 십막대 20개 이상. 백 모형이 들어 있으면 더 좋습니다.",
        "en": "100 ones and 20 rods at least; a hundred flat is a plus.",
        "zh": "至少100个个位块和20根十条，有百板更好。"
      },
      "key": "baseten"
    },
    "make": {
      "name": {
        "ko": "빨대와 고무줄",
        "en": "Straws and rubber bands",
        "zh": "吸管与橡皮筋"
      },
      "how": {
        "ko": "빨대 10개를 고무줄로 묶어 10을 나타내요. 묶음 하나와 낱개 10개를 바꾸어 보세요.",
        "en": "Bundle ten straws with a band. The bundling and unbundling is the carrying itself, which a pre-made block cannot show.",
        "zh": "用橡皮筋把十根吸管捆成一条。捆和解的动作就是进位，现成的积木反而看不到这一步。"
      }
    },
    "courseIds": [
      3,
      5
    ],
    "order": 2,
    "audience": "early",
    "portrait": "numi-0-think.png",
    "exampleTex": "137=100+30+7",
    "exampleText": {
      "ko": "백 모형 1개, 십막대 3개, 낱개 7개로 137을 만들어요.",
      "en": "One hundred, three tens and seven ones represent 137.",
      "zh": "1个百板、3根十条和7个一表示137。"
    },
    "build": placeValue,
    "demo": function(lang){return paperDemo("place",lang);}
  },
  {
    "key": "numberline",
    "name": {
      "ko": "수직선 띠",
      "en": "Number line strips",
      "zh": "数轴纸条"
    },
    "why": {
      "ko": "한 칸이 얼마인지 먼저 보세요. 같은 간격만큼 이동하며 덧셈과 뺄셈을 해 봐요.",
      "en": "Check the value of one space. Move equal steps to add or subtract.",
      "zh": "先看一格表示多少，再移动相同的间隔来做加减法。"
    },
    "steps": {
      "ko": [
        "수직선 띠를 오려요. 칸 하나가 1인지 10인지 확인해요.",
        "0~20 띠의 8에 연필 끝을 놓아요. 오른쪽으로 5칸 가요.",
        "13에서 왼쪽으로 5칸 돌아가면 어디에 오는지 보세요."
      ],
      "en": [
        "Cut the strips. Check whether one step is 1 or 10.",
        "On a 0–20 strip, start at 8 and move right 5 steps.",
        "From 13, move left 5 steps. Where do you land?"
      ],
      "zh": [
        "剪下数轴纸条，先看每格是1还是10。",
        "在0~20的数轴上，从8向右移5格。",
        "再从13向左移5格，看看回到哪里。"
      ]
    },
    "buy": {
      "name": {
        "ko": "천 줄자 2m",
        "en": "Cloth tape measure, 2m",
        "zh": "软尺2米"
      },
      "why": {
        "ko": "줄자의 같은 간격을 보며 10씩 커지는 수를 읽어 봐요.",
        "en": "Read equal increments on the tape to count by tens.",
        "zh": "观察卷尺等间隔的刻度，练习十个十个数。"
      },
      "pick": {
        "ko": "숫자가 큼직한 것. 쇠 줄자보다 천 줄자가 아이에게 안전합니다.",
        "en": "Large numerals; a cloth tape is safer for a child than a steel one.",
        "zh": "数字要大，软尺比钢卷尺对孩子更安全。"
      },
      "key": "tape"
    },
    "make": {
      "name": {
        "ko": "종이 띠와 바닥 테이프",
        "en": "Paper strips and floor tape",
        "zh": "纸条和地上的胶带"
      },
      "how": {
        "ko": "위 띠 세 개를 오려 책상에 붙입니다. 바닥에 마스킹테이프로 0부터 20까지 크게 그려 두면 아이가 직접 뛰어 셉니다.",
        "en": "Cut the three strips above. Tape a big 0 to 20 line on the floor and let the child hop along it.",
        "zh": "剪下上面三条纸条。用美纹胶带在地上画一条大的0到20，让孩子亲自跳着数。"
      }
    },
    "courseIds": [
      7
    ],
    "order": 3,
    "audience": "elementary",
    "portrait": "numi-0-happy.png",
    "exampleTex": "8+5=13",
    "exampleText": {
      "ko": "8에서 오른쪽으로 한 칸씩 5번 가면 13이에요.",
      "en": "Start at 8 and move right five steps to 13.",
      "zh": "从8向右走5格，到13。"
    },
    "build": numberLine,
    "demo": function(lang){return paperDemo("numberline",lang);}
  },
  {
    "key": "array",
    "name": {
      "ko": "곱셈 배열판과 모서리 표시자",
      "en": "Multiplication array and corner markers",
      "zh": "乘法点阵板与角标"
    },
    "why": {
      "ko": "한 줄에 같은 수의 점이 있어요. 줄 수와 한 줄의 개수를 곱하면 전체 개수를 알 수 있어요.",
      "en": "Every row has the same number of dots. Multiply rows by dots per row to find the total.",
      "zh": "每行的点数相同。行数乘每行点数，就是总数。"
    },
    "steps": {
      "ko": [
        "점 배열판과 모서리 표시자 두 개를 오려요.",
        "표시자로 3줄, 한 줄에 4개인 범위를 짚고 점을 세요.",
        "종이를 돌려 4줄에 3개씩 보세요. 전체 개수는 같아요."
      ],
      "en": [
        "Cut the dot board and both corner markers.",
        "Mark 3 rows of 4 dots and count the selected dots.",
        "Rotate the sheet to see 4 rows of 3. The total is unchanged."
      ],
      "zh": [
        "剪下点阵板和两个角标。",
        "标出3行、每行4个的范围，数出点数。",
        "转动纸张，变成4行、每行3个，总数不变。"
      ]
    },
    "buy": {
      "name": {
        "ko": "투명 색타일 100개",
        "en": "Transparent colour tiles, 100",
        "zh": "彩色方块100个"
      },
      "why": {
        "ko": "3 곱하기 4를 직사각형으로 깔면 곱셈이 넓이가 됩니다. 판을 돌려 보면 4 곱하기 3과 같다는 것도 바로 압니다.",
        "en": "Laying 3 by 4 as a rectangle turns multiplication into area; turning it shows 4 by 3 is the same.",
        "zh": "把3×4摆成长方形，乘法就成了面积；转一下就知道4×3一样。"
      },
      "pick": {
        "ko": "같은 크기 정사각형 100개. 2.5cm 안팎이면 배열이 눈에 잘 들어옵니다.",
        "en": "100 identical squares, about 2.5cm.",
        "zh": "100个大小相同的方块，约2.5厘米。"
      },
      "key": "tiles"
    },
    "make": {
      "name": {
        "ko": "종이 배열판과 계란판",
        "en": "Paper array board and an egg carton",
        "zh": "纸阵列板和鸡蛋盒"
      },
      "how": {
        "ko": "이 점 배열판과 모서리 표시자를 사용해요. 색연필로 선택한 범위를 둘러도 좋아요.",
        "en": "Use this board and its corner markers, or outline an array with a coloured pencil.",
        "zh": "使用本点阵板与角标，也可用彩色笔圈定范围。"
      }
    },
    "courseIds": [
      4,
      8,
      9,
      10,
      11,
      12,
      13,
      15,
      17,
      21
    ],
    "order": 4,
    "audience": "elementary",
    "portrait": "sym-times.png",
    "exampleTex": "3\\times4=4\\times3=12",
    "exampleText": {
      "ko": "3줄에 4개씩 있어요. 돌려도 모두 12개예요.",
      "en": "Three rows of four. Rotate: still twelve dots.",
      "zh": "3行，每行4个。转一转，仍有12个。"
    },
    "build": arrayBoard,
    "demo": function(lang){return paperDemo("array",lang);}
  },
  {
    "key": "balance",
    "name": {
      "ko": "등식 저울판과 수 카드",
      "en": "Balance mat and number cards",
      "zh": "等式天平板与数字卡"
    },
    "why": {
      "ko": "등호는 양쪽의 값이 같다는 뜻이에요. 종이 저울은 실제로 기울지 않으니, 양쪽 카드의 값을 구해서 비교해요.",
      "en": "The equals sign means both sides have the same value. This paper mat does not tilt: calculate and compare the cards on each side.",
      "zh": "等号表示两边的值相同。纸天平不会真的倾斜，要算出两边卡片的值来比较。"
    },
    "steps": {
      "ko": [
        "수 카드를 오려요. 저울 그림이 있는 종이는 놀이판으로 두어요.",
        "왼쪽에 7, +, 5를 놓고 오른쪽에 1과 2로 12를 만들어요.",
        "왼쪽의 5 대신 □를 놓아요. 알맞은 수 카드를 찾아 바꾸어요."
      ],
      "en": [
        "Cut out the cards; keep the printed scale as the mat.",
        "Place 7, +, 5 on the left. Form 12 with 1 and 2 on the right.",
        "Replace the left 5 with □. Find the card that belongs there."
      ],
      "zh": [
        "剪下卡片，把天平图保留为操作板。",
        "左边放7、+、5，右边用1和2组成12。",
        "把左边的5换成□，找出合适的数卡。"
      ]
    },
    "buy": {
      "name": {
        "ko": "양팔 저울",
        "en": "Balance scale",
        "zh": "天平"
      },
      "why": {
        "ko": "실물 저울은 같은 수의 동일한 추로 양쪽 무게를 비교할 수 있어요.",
        "en": "A real balance compares equal numbers of identical weights.",
        "zh": "实物天平可以用相同砝码比较两边的重量。"
      },
      "pick": {
        "ko": "접시가 크고 추가 함께 오는 것. 플라스틱이면 충분합니다.",
        "en": "Large pans with a set of weights; plastic is fine.",
        "zh": "托盘大、带砝码的即可，塑料的就够。"
      },
      "key": "balance"
    },
    "make": {
      "name": {
        "ko": "옷걸이와 종이컵 저울",
        "en": "A coat-hanger and paper-cup balance",
        "zh": "衣架和纸杯做的天平"
      },
      "how": {
        "ko": "옷걸이 양 끝에 실로 종이컵 두 개를 매답니다. 문고리에 걸면 저울이 됩니다. 양쪽에 동전을 같은 수만큼 넣어 평평해지는 것을 봅니다.",
        "en": "Hang two paper cups from a coat-hanger with string and hook it on a door handle. Put the same number of coins in each and watch it level out.",
        "zh": "用绳子在衣架两端各挂一个纸杯，挂在门把手上。两边放一样多的硬币，看它变平。"
      }
    },
    "courseIds": [
      19,
      25,
      33,
      41
    ],
    "order": 5,
    "audience": "elementary",
    "portrait": "numi-0-think.png",
    "exampleTex": "7+5=12",
    "exampleText": {
      "ko": "7에 5를 더한 값과 12는 같아요.",
      "en": "Seven plus five has the same value as twelve.",
      "zh": "7加5的值与12相同。"
    },
    "build": balanceMat,
    "demo": function(lang){return paperDemo("balance",lang);}
  },
  {
    "key": "fraction",
    "name": {
      "ko": "분수 원판",
      "en": "Fraction discs",
      "zh": "分数圆盘"
    },
    "why": {
      "ko": "크기가 같은 원을 똑같이 나눈 조각이에요. 한 조각의 크기와 조각 수를 함께 살펴봐요.",
      "en": "Each same-sized whole is divided into equal parts. Compare both part size and number of parts.",
      "zh": "同样大的圆被平均分成小块，比较每块大小和块数。"
    },
    "steps": {
      "ko": [
        "바깥 점선을 오려요. 전체 1은 두고 나머지 원은 점선을 따라 나누어요.",
        "1/3 조각과 1/4 조각의 꼭짓점을 맞춰 크기를 비교해요.",
        "1/4 두 조각을 모아 1/2 위에 덮어 보아요."
      ],
      "en": [
        "Cut dashed lines. Keep the whole disc intact; divide the others.",
        "Align a third and a quarter at their centre points to compare.",
        "Place two quarter pieces over one half."
      ],
      "zh": [
        "沿虚线剪，整体1保留，其余圆再沿虚线分开。",
        "把三分之一与四分之一的圆心角顶点对齐比较。",
        "用两个四分之一盖住一个二分之一。"
      ]
    },
    "buy": {
      "name": {
        "ko": "분수 원판 세트",
        "en": "Fraction disc set",
        "zh": "分数圆盘套装"
      },
      "why": {
        "ko": "조각을 겹쳐 보면 3분의 1이 4분의 1보다 크다는 것을 설명 없이 압니다. 종이보다 튼튼해 오래 씁니다.",
        "en": "Overlapping the pieces shows that a third beats a quarter without any explanation, and plastic lasts.",
        "zh": "把块叠起来，不用讲就知道三分之一比四分之一大，塑料的也更耐用。"
      },
      "pick": {
        "ko": "1, 2분의 1, 3분의 1, 4분의 1, 6분의 1, 8분의 1이 다 들어 있는 것. 분모마다 색이 다르면 좋습니다.",
        "en": "A set with 1, 1/2, 1/3, 1/4, 1/6 and 1/8; colour-coded is better.",
        "zh": "要有1、1/2、1/3、1/4、1/6、1/8，按颜色区分更好。"
      },
      "key": "fracdisc"
    },
    "make": {
      "name": {
        "ko": "종이 원판과 색종이 접기",
        "en": "Paper discs and folded origami paper",
        "zh": "纸圆盘和折纸"
      },
      "how": {
        "ko": "위 원판 여섯 장을 오려 선을 따라 자릅니다. 색종이를 반으로, 또 반으로 접으면 2분의 1, 4분의 1, 8분의 1이 그대로 나옵니다.",
        "en": "Cut the six discs above along the lines. Folding origami paper in half again and again gives a half, a quarter and an eighth.",
        "zh": "剪下上面六个圆盘并沿线剪开。把色纸对折再对折，就得到1/2、1/4、1/8。"
      }
    },
    "courseIds": [
      14,
      18,
      20,
      22
    ],
    "order": 6,
    "audience": "elementary",
    "portrait": "sym-divide.png",
    "exampleTex": "\\frac12=\\frac14+\\frac14",
    "exampleText": {
      "ko": "같은 크기 원에서 4분의 1 두 조각이 2분의 1과 같아요.",
      "en": "Two quarters equal one half of the same-sized whole.",
      "zh": "同样大的圆中，两个四分之一等于二分之一。"
    },
    "build": fractionDisc,
    "demo": function(lang){return paperDemo("fraction",lang);}
  },
  {
    "key": "decimal",
    "name": {
      "ko": "소수 모눈판",
      "en": "Decimal grids",
      "zh": "小数方格板"
    },
    "why": {
      "ko": "큰 모눈판 한 장을 1로 보아요. 한 줄은 0.1, 작은 한 칸은 0.01이에요.",
      "en": "One large grid represents 1. A row is 0.1 and one small cell is 0.01.",
      "zh": "一大块方格板表示1，一行是0.1，一小格是0.01。"
    },
    "steps": {
      "ko": [
        "모눈판과 띠를 오려요. 띠 안쪽의 칸은 자르지 않아요.",
        "한 판을 1로 보고, 한 줄 띠 10개로 모두 덮어 보아요.",
        "0.3은 세 줄, 0.4는 네 줄이에요. 합쳐 몇 줄인지 확인해요."
      ],
      "en": [
        "Cut out the grids and strips. Keep each strip in one piece.",
        "Let one grid be 1. Cover it with ten strips.",
        "Use 3 strips for 0.3 and 4 for 0.4. Count the total."
      ],
      "zh": [
        "剪下方格板和纸条，纸条内部的小格不要剪。",
        "把整板看作1，用10条纸条盖满。",
        "0.3是3条，0.4是4条，合起来数一数。"
      ]
    },
    "buy": {
      "name": {
        "ko": "십진 블록 세트",
        "en": "Base-ten blocks",
        "zh": "十进制积木"
      },
      "why": {
        "ko": "백 모형을 1로 정하면 십막대는 0.1, 낱개는 0.01이 돼요.",
        "en": "Let a hundred flat represent 1: a ten rod is 0.1 and a unit block is 0.01.",
        "zh": "把百板定为1，则十条是0.1，个位块是0.01。"
      },
      "pick": {
        "ko": "백 모형·십막대·낱개가 같은 단위 크기로 맞는 것.",
        "en": "Flats, rods and units must have matching unit lengths.",
        "zh": "百板、十条、个位块的单位长度应相同。"
      },
      "key": "baseten"
    },
    "make": {
      "name": {
        "ko": "모눈종이와 색연필",
        "en": "Graph paper and coloured pencils",
        "zh": "方格纸与彩色笔"
      },
      "how": {
        "ko": "10×10칸을 그리고 전체를 1로 정해요. 한 줄씩 칠하며 소수를 나타내요.",
        "en": "Draw a 10×10 grid and define the whole as 1. Shade rows to show decimals.",
        "zh": "画10×10方格，把整体定为1，逐行涂色表示小数。"
      }
    },
    "courseIds": [
      16,
      23,
      24
    ],
    "order": 7,
    "audience": "elementary",
    "portrait": "numi-0-think.png",
    "exampleTex": "0.3+0.4=0.7",
    "exampleText": {
      "ko": "전체를 1로 볼 때, 세 줄과 네 줄은 일곱 줄이에요.",
      "en": "With the whole worth one, three strips plus four make seven.",
      "zh": "把整块看作1，3条加4条共7条。"
    },
    "build": decimalGrid,
    "demo": function(lang){return paperDemo("decimal",lang);}
  },
  {
    "key": "pentomino",
    "embeddedExample": true,
    "name": {
      "ko": "펜토미노 12조각과 6×10 판",
      "en": "Twelve pentominoes and a 6×10 board",
      "zh": "十二块五格骨牌与6×10板"
    },
    "why": {
      "ko": "모두 5칸으로 된 조각이에요. 돌리거나 뒤집어서 6×10 판을 빈틈없이 채워 봐요.",
      "en": "Every piece has five cells. Turn or flip them to fill a 6×10 board without gaps.",
      "zh": "每块都是5格。旋转或翻面，试着填满6×10方格板。"
    },
    "steps": {
      "ko": [
        "판과 조각 열두 개를 오립니다. 굵은 점선만 자르고 안쪽 얇은 금은 그냥 둡니다.",
        "모든 조각은 5칸이에요. 모서리부터 맞춰 보세요.",
        "다 채우면 다른 방법으로 또 채워 봅니다. 답은 하나가 아닙니다."
      ],
      "en": [
        "Cut out the board and the twelve pieces, following the bold dotted lines only.",
        "Every piece has five cells. Try filling a corner first.",
        "When it is full, fill it a second way — there is more than one answer."
      ],
      "zh": [
        "剪下板和十二块骨牌，只沿粗虚线剪。",
        "每块都有5格。试着从角落开始拼。",
        "铺满之后换一种方法再铺一次——答案不止一个。"
      ]
    },
    "buy": {
      "name": {
        "ko": "펜토미노 세트",
        "en": "Pentomino set",
        "zh": "五格骨牌套装"
      },
      "why": {
        "ko": "조각이 두꺼워 잘 밀리지 않고, 색이 달라 어느 조각을 썼는지 한눈에 보입니다.",
        "en": "Thick pieces do not slide, and the colours show at a glance which piece went where.",
        "zh": "块厚不易滑动，颜色不同一眼看出用了哪块。"
      },
      "pick": {
        "ko": "12조각이 다 있는 것. 판이 함께 오면 더 좋습니다.",
        "en": "All twelve pieces; a board included is better.",
        "zh": "要12块齐全，附板更好。"
      },
      "key": "pentomino"
    },
    "make": {
      "name": {
        "ko": "종이 조각과 두꺼운 종이",
        "en": "Paper pieces on card",
        "zh": "纸块与厚纸"
      },
      "how": {
        "ko": "위 조각을 오립니다. 우유갑이나 택배 상자에 붙여 오리면 두꺼워져 훨씬 잘 다뤄집니다.",
        "en": "Cut out the pieces above. Glue them to a milk carton or cardboard first and they handle far better.",
        "zh": "剪下上面的骨牌。先贴在牛奶盒或纸箱上再剪，会好用得多。"
      }
    },
    "courseIds": [
      26,
      27,
      28
    ],
    "order": 8,
    "audience": "elementary",
    "portrait": "poco-3-think.png",
    "exampleTex": "5\\times12=60",
    "exampleText": {
      "ko": "5칸짜리 12조각으로 60칸을 채운 한 가지 예예요.",
      "en": "One way to fill sixty cells with twelve five-cell pieces.",
      "zh": "用12块五格骨牌填满60格的一种方法。"
    },
    "build": pentomino,
    "demo": function(lang){return paperDemo("pentomino",lang);}
  },
  {
    "key": "intline",
    "name": {
      "ko": "정수 수직선과 수·연산 카드",
      "en": "Integer line, number and operation cards",
      "zh": "整数数轴、数字卡与运算卡"
    },
    "why": {
      "ko": "0보다 작은 정수는 왼쪽에 있습니다. 수 카드의 부호와 더하기·빼기 연산기호를 구분합니다.",
      "en": "Negative integers lie left of zero. Distinguish a number’s sign from the addition or subtraction operation.",
      "zh": "负整数在0左边。区分数的正负号与加减运算符号。"
    },
    "steps": {
      "ko": [
        "수직선과 카드를 오립니다. 연산 카드는 따로 놓습니다.",
        "−3에서 + (−5)를 해 봅니다. 왼쪽으로 5칸 가면 −8입니다.",
        "같은 자리에서 − (−5)를 해 봅니다. 오른쪽으로 5칸 가면 2입니다."
      ],
      "en": [
        "Cut the lines and cards. Keep operation cards separate.",
        "Start at −3 and add −5. Move left five steps to −8.",
        "Start at −3 and subtract −5. Move right five steps to 2."
      ],
      "zh": [
        "剪下数轴与卡片，把运算卡单独放好。",
        "从−3加上−5，向左5格到−8。",
        "从−3减去−5，向右5格到2。"
      ]
    },
    "buy": {
      "name": {
        "ko": "실내 온도계",
        "en": "Indoor thermometer",
        "zh": "室内温度计"
      },
      "why": {
        "ko": "영하가 실제로 눈금 아래에 있습니다. 아침 기온을 매일 읽으면 음수가 생활 속 수가 됩니다.",
        "en": "Below zero really sits below the mark. Reading the morning temperature makes negatives an everyday number.",
        "zh": "零下就在刻度下面。每天读早上的气温，负数就成了生活里的数。"
      },
      "pick": {
        "ko": "영하 20도까지 읽히고 눈금이 큼직한 것. 알코올식이면 충분합니다.",
        "en": "Reads to −20°C with large marks; an alcohol type is fine.",
        "zh": "能读到零下20度、刻度大的即可，酒精式就够。"
      },
      "key": "thermo"
    },
    "make": {
      "name": {
        "ko": "종이 수직선과 지우개 말",
        "en": "Paper line and an eraser counter",
        "zh": "纸数轴与橡皮棋子"
      },
      "how": {
        "ko": "위 수직선을 오려 책상에 붙이고 지우개를 말로 씁니다. 엘리베이터 버튼(지하 −1, −2)도 훌륭한 수직선입니다.",
        "en": "Cut out the line above and use an eraser as the counter. A lift panel with basement floors is a fine number line too.",
        "zh": "剪下上面的数轴贴在桌上，用橡皮当棋子。电梯的地下楼层按钮也是很好的数轴。"
      }
    },
    "courseIds": [
      29,
      30
    ],
    "order": 9,
    "audience": "secondary",
    "portrait": "",
    "exampleTex": "-3+(-5)=-8",
    "exampleText": {
      "ko": "−5를 더하면 왼쪽으로 5칸 이동합니다.",
      "en": "Adding −5 moves five steps left.",
      "zh": "加上−5，要向左移5格。"
    },
    "build": intLine,
    "demo": function(lang){return paperDemo("intline",lang);}
  },
  {
    "key": "algtiles",
    "name": {
      "ko": "대수 타일 (x² · x · 1)",
      "en": "Algebra tiles (x², x, 1)",
      "zh": "代数瓷砖（x²·x·1）"
    },
    "why": {
      "ko": "x가 양수일 때, 타일의 넓이로 다항식을 나타냅니다. 타일을 직사각형으로 맞추면 인수분해를 살펴볼 수 있습니다.",
      "en": "For positive x, tile areas represent polynomials. Arrange a rectangle to explore factorisation.",
      "zh": "当x为正数时，用方块面积表示多项式，拼成长方形来观察因式分解。"
    },
    "steps": {
      "ko": [
        "타일의 바깥 점선을 따라 오립니다. x는 양수로 봅니다.",
        "x² 타일 1개, x 타일 3개, 1 타일 2개를 준비합니다.",
        "그림처럼 직사각형을 만들고 두 변 x+1, x+2를 확인합니다."
      ],
      "en": [
        "Cut the tile outlines. Use the model for positive x.",
        "Take 1 square x² tile, 3 x tiles and 2 unit tiles.",
        "Build the shown rectangle and identify the sides x+1 and x+2."
      ],
      "zh": [
        "沿外侧虚线剪，模型中的x为正数。",
        "取1块x²、3块x和2块单位方块。",
        "照图拼成长方形，确认边长x+1与x+2。"
      ]
    },
    "buy": {
      "name": {
        "ko": "대수 타일 세트",
        "en": "Algebra tile set",
        "zh": "代数瓷砖套装"
      },
      "why": {
        "ko": "앞뒤 색이 달라 양수와 음수를 뒤집어 나타냅니다. 종이로는 그 뒤집기가 잘 안 됩니다.",
        "en": "The two faces are different colours, so flipping a tile makes it negative — paper cannot do that well.",
        "zh": "正反两面颜色不同，翻过来就是负数——纸做的很难表现这一点。"
      },
      "pick": {
        "ko": "x², x, 1 세 종류가 다 있고 앞뒤 색이 다른 것.",
        "en": "All three sizes, with different colours front and back.",
        "zh": "三种规格齐全、正反异色。"
      },
      "key": "algtile"
    },
    "make": {
      "name": {
        "ko": "종이 타일과 색칠한 뒷면",
        "en": "Paper tiles with a coloured back",
        "zh": "纸瓷砖与涂色的背面"
      },
      "how": {
        "ko": "위 타일을 오리고 뒷면을 색연필로 칠합니다. 뒤집으면 음수 — 색이 다르니 앞뒤가 구별됩니다.",
        "en": "Cut out the tiles and colour the backs. Flipped over means negative, and the colour tells them apart.",
        "zh": "剪下瓷砖，把背面涂上颜色。翻过来就是负数，颜色一看就分得清。"
      }
    },
    "courseIds": [
      31,
      32,
      36,
      38,
      39,
      43,
      44
    ],
    "order": 10,
    "audience": "secondary",
    "portrait": "",
    "exampleTex": "x^2+3x+2=(x+1)(x+2)",
    "exampleText": {
      "ko": "직사각형의 두 변은 x+1, x+2이고 넓이는 두 길이의 곱입니다.",
      "en": "The sides are x+1 and x+2; their product is the area.",
      "zh": "两边长为x+1和x+2，它们的乘积就是面积。"
    },
    "build": algebraTiles,
    "demo": function(lang){return paperDemo("algtiles",lang);}
  },
  {
    "key": "coord",
    "name": {
      "ko": "좌표 모눈판",
      "en": "Coordinate grid",
      "zh": "坐标方格板"
    },
    "why": {
      "ko": "원점은 두 축이 만나는 0입니다. x좌표만큼 가로로, y좌표만큼 세로로 움직여 점을 찍습니다.",
      "en": "The origin is where the axes meet. Move horizontally by x, then vertically by y to plot a point.",
      "zh": "原点是两轴相交的0。先按x坐标横向移动，再按y坐标纵向移动来描点。"
    },
    "steps": {
      "ko": [
        "바깥 점선을 오려 판을 만듭니다. 얇은 모눈선은 그대로 둡니다.",
        "원점에서 오른쪽 2칸, 위로 1칸 가서 A(2,1)을 찍습니다.",
        "B(4,3)을 찍고 두 점을 지나도록 직선을 그립니다."
      ],
      "en": [
        "Cut the outer border, keeping the grid intact.",
        "From the origin move 2 right and 1 up; plot A(2,1).",
        "Plot B(4,3) and draw a straight line through both points."
      ],
      "zh": [
        "剪下外框，保留内部网格线。",
        "从原点向右2格、向上1格，描出A(2,1)。",
        "再描B(4,3)，画直线通过这两点。"
      ]
    },
    "buy": {
      "name": {
        "ko": "모눈 공책 (5mm)",
        "en": "Graph notebook (5mm)",
        "zh": "方格本（5毫米）"
      },
      "why": {
        "ko": "매번 새 판에 그릴 수 있습니다. 시험지에 손으로 좌표를 그리는 연습도 됩니다.",
        "en": "A fresh grid every time, and it trains drawing axes by hand on an exam paper.",
        "zh": "每次都有新的方格，也练习在试卷上手画坐标。"
      },
      "pick": {
        "ko": "5mm 모눈, 줄이 옅은 것. 두꺼우면 그린 선이 안 보입니다.",
        "en": "5mm squares with faint rules; dark rules hide your line.",
        "zh": "5毫米方格、格线要淡，太深会盖住画的线。"
      },
      "key": "graphpad"
    },
    "make": {
      "name": {
        "ko": "종이 좌표판과 투명 파일",
        "en": "Paper grid in a clear file",
        "zh": "纸坐标板与透明文件夹"
      },
      "how": {
        "ko": "위 좌표판을 오려 투명 파일에 끼우면 보드마카로 쓰고 지울 수 있습니다. 몇 번이고 다시 씁니다.",
        "en": "Slip the grid into a clear file and write on it with a whiteboard marker — wipe and reuse.",
        "zh": "把坐标板夹进透明文件夹，用白板笔写了擦、擦了写。"
      }
    },
    "courseIds": [
      34,
      37,
      42,
      45,
      49,
      50,
      51,
      52,
      55,
      56,
      57,
      60,
      70,
      71,
      72,
      73
    ],
    "order": 11,
    "audience": "secondary",
    "portrait": "",
    "exampleTex": "y=x-1",
    "exampleText": {
      "ko": "A(2,1)과 B(4,3)을 찍어 직선을 그린 예입니다.",
      "en": "Plot A(2,1) and B(4,3), then draw the line.",
      "zh": "描出A(2,1)、B(4,3)，再画直线。"
    },
    "build": coordGrid,
    "demo": function(lang){return paperDemo("coord",lang);}
  },
  {
    "key": "unitcircle",
    "name": {
      "ko": "단위원 판과 반지름 자",
      "en": "Unit circle and a radius arm",
      "zh": "单位圆板与半径尺"
    },
    "why": {
      "ko": "반지름의 길이를 1로 정한 원입니다. 회전하는 자의 끝점을 원 위에 맞추고 x좌표와 y좌표를 읽습니다.",
      "en": "The circle has radius 1. Align the rotating arm’s tip with the circle and read its x and y coordinates.",
      "zh": "把半径长定为1。将转动尺的端点对准圆周，读取x、y坐标。"
    },
    "steps": {
      "ko": [
        "판과 자의 바깥 점선을 오립니다. 원 둘레는 자르지 않습니다.",
        "판의 중심점과 자의 시작점을 맞춰 할핀으로 고정합니다.",
        "자 끝점을 30°에 맞춥니다. x는 cos, y는 sin이며 눈금값은 근삿값입니다."
      ],
      "en": [
        "Cut the dashed outlines, not the circle circumference.",
        "Align the two pivot dots and fasten with a split pin.",
        "Turn to 30°. Read x=cos and y=sin; scale readings are approximate."
      ],
      "zh": [
        "沿外侧虚线剪，圆周不要剪。",
        "对准板与尺上的中心点，用两脚钉固定。",
        "转到30°，x是cos、y是sin，刻度读数为近似值。"
      ]
    },
    "buy": {
      "name": {
        "ko": "각도기와 컴퍼스 세트",
        "en": "Protractor and compass set",
        "zh": "量角器与圆规套装"
      },
      "why": {
        "ko": "각을 정확히 재고 원을 직접 그립니다. 고등 도형 문제는 결국 손으로 그려 봐야 보입니다.",
        "en": "Measure angles exactly and draw the circle yourself; high-school geometry opens up once it is drawn.",
        "zh": "准确量角、亲手画圆。高中的图形题，画出来才看得明白。"
      },
      "pick": {
        "ko": "반투명 각도기(밑에 선이 비치는 것)와 나사로 고정되는 컴퍼스.",
        "en": "A translucent protractor and a screw-locking compass.",
        "zh": "半透明量角器和带螺丝固定的圆规。"
      },
      "key": "protractor"
    },
    "make": {
      "name": {
        "ko": "종이 단위원과 할핀",
        "en": "Paper circle and a split pin",
        "zh": "纸单位圆与工字钉"
      },
      "how": {
        "ko": "두 중심점을 맞춰 할핀으로 고정하고, 두 번째 점이 원 위를 따라가는지 확인합니다.",
        "en": "Join the pivot dots with a split pin. Check that the second dot follows the circle.",
        "zh": "用两脚钉连接两个中心点，确认另一点沿圆周移动。"
      }
    },
    "courseIds": [
      62,
      63,
      64,
      65
    ],
    "order": 12,
    "audience": "secondary",
    "portrait": "",
    "exampleTex": "\\cos30^\\circ=\\frac{\\sqrt3}{2},\\quad\\sin30^\\circ=\\frac12",
    "exampleText": {
      "ko": "반지름을 1로 볼 때 끝점의 x좌표는 cos, y좌표는 sin입니다.",
      "en": "On the unit circle the point has x=cos θ and y=sin θ.",
      "zh": "单位圆上端点的x坐标是cos θ，y坐标是sin θ。"
    },
    "build": unitCircle,
    "demo": function(lang){return paperDemo("unitcircle",lang);}
  },
  {
    "key": "hundred",
    "name": {"ko": "백판과 수 칩", "en": "Hundred board and counters", "zh": "百数表与圆片"},
    "why": {
      "ko": "백판은 1부터 100까지 수를 열 개씩 줄지어 놓은 판이에요. 수가 어디에 있는지 보면 얼마나 큰지 알 수 있어요.",
      "en": "A hundred board lines up the numbers 1 to 100 in rows of ten. Where a number sits shows how big it is.",
      "zh": "百数表把1到100每十个排成一行。看一个数在哪里，就知道它有多大。"
    },
    "steps": {
      "ko": ["34를 찾아 칩을 놓아요.", "바로 아래 칸을 읽어요. 10 큰 수 44예요.", "4, 14, 24처럼 10씩 뛰어 세며 칩을 놓아요."],
      "en": ["Find 34 and put a counter on it.", "Read the box just below. It is 44, which is 10 more.", "Count on by tens — 4, 14, 24 — and place counters."],
      "zh": ["找到34，放一个圆片。", "读正下方的一格，是大10的44。", "像4、14、24这样十个十个地数，放上圆片。"]
    },
    "buy": {
      "name": {"ko": "백판(100 숫자판)", "en": "Hundred number board", "zh": "百数板"},
      "why": {"ko": "판과 숫자 타일이 따로 있어 수를 직접 채워 넣을 수 있어요.", "en": "A board with loose number tiles lets a child build the chart.", "zh": "板和数字片分开，孩子可以自己把数填上去。"},
      "pick": {"ko": "숫자가 큼직하고 칩이 함께 오는 것.", "en": "Large numerals, with counters included.", "zh": "数字大、附带圆片的。"},
      "key": "hundred"
    },
    "make": {
      "name": {"ko": "이 종이 교구로 충분해요", "en": "Use this paper set", "zh": "用这套纸教具就够了"},
      "how": {
        "ko": "바깥 점선을 따라 백판 한 장과 칩을 오려요. 칩 대신 바둑알이나 단추를 써도 돼요. 가위는 보호자와 함께 써요.",
        "en": "Cut out the board and counters along the dashed outlines. Buttons or game stones also work. An adult helps with scissors.",
        "zh": "沿外侧虚线剪下百数表和圆片。也可以用围棋子或纽扣代替。请大人协助使用剪刀。"
      }
    },
    "courseIds": [1],
    "order": 13,
    "audience": "early",
    "portrait": "numi-0-happy.png",
    "exampleTex": "34+10=44",
    "exampleText": {"ko": "34에서 아래로 한 칸 가면 44예요.", "en": "One box below 34 is 44.", "zh": "从34往下一格是44。"},
    "build": hundredBoard,
    "demo": function(lang){return paperDemo("hundred",lang);}
  },
  {
    "key": "rods",
    "name": {"ko": "수막대", "en": "Number rods", "zh": "数棒"},
    "why": {
      "ko": "수막대는 길이로 수를 보여 줘요. 두 막대를 이어 10 막대와 길이가 같으면, 두 수를 모아 10이 돼요.",
      "en": "Number rods show a number as a length. If two rods together match the 10 rod, the two numbers make 10.",
      "zh": "数棒用长度表示数。两根接起来和10的棒一样长，这两个数合起来就是10。"
    },
    "steps": {
      "ko": ["10 막대 아래에 3 막대를 놓아요.", "남은 자리에 꼭 맞는 막대를 찾아요.", "7 막대예요. 3과 7을 모으면 10이에요."],
      "en": ["Put the 3 rod under the 10 rod.", "Find the rod that fills the space exactly.", "It is the 7 rod. 3 and 7 make 10."],
      "zh": ["把3的棒放在10的棒下面。", "找一根正好填满空位的棒。", "是7的棒。3和7合起来是10。"]
    },
    "buy": {
      "name": {"ko": "연결 큐브", "en": "Linking cubes", "zh": "连接积木"},
      "why": {"ko": "큐브를 1개부터 10개까지 이어 붙이면 수막대와 같아요.", "en": "Joining 1 to 10 cubes makes the same set of rods.", "zh": "把积木1个到10个连起来，就和数棒一样。"},
      "pick": {"ko": "아이 손으로 쉽게 붙이고 뗄 수 있는 크기.", "en": "Easy for small hands to join and separate.", "zh": "选择孩子容易拼接和拆开的大小。"},
      "key": "cubes"
    },
    "make": {
      "name": {"ko": "이 종이 교구로 충분해요", "en": "Use this paper set", "zh": "用这套纸教具就够了"},
      "how": {
        "ko": "굵은 점선을 따라 막대를 오려요. 모두 곧은 선이에요. 막대 안의 가는 선은 자르지 않아요. 가위는 보호자와 함께 써요.",
        "en": "Cut the rods along the dashed lines — all straight cuts. Do not cut the thin lines inside. An adult helps with scissors.",
        "zh": "沿虚线剪下数棒，都是直线。棒里面的细线不要剪。请大人协助使用剪刀。"
      }
    },
    "courseIds": [0],
    "order": 14,
    "audience": "early",
    "portrait": "numi-0-happy.png",
    "exampleTex": "",
    "exampleText": {"ko": "3 막대와 7 막대를 이으면 10 막대와 길이가 같아요.", "en": "The 3 rod and the 7 rod together match the 10 rod.", "zh": "3的棒和7的棒接起来，和10的棒一样长。"},
    "build": numberRods,
    "demo": function(lang){return paperDemo("rods",lang);}
  },
  {
    "key": "placechips",
    "name": {"ko": "자릿값 판과 수 칩", "en": "Place-value mat and chips", "zh": "数位板与数片"},
    "why": {
      "ko": "천, 백, 십, 일의 자리에 칩을 놓아 네 자리 수를 만들어요. 같은 칩 10개는 바로 윗자리 칩 1개와 바꿔요.",
      "en": "Place chips in the thousands, hundreds, tens and ones columns to build four-digit numbers. Ten of one chip trade for one chip of the next place.",
      "zh": "在千、百、十、个位上放数片，摆出四位数。同一种数片满10个，就换成上一位的1个。"
    },
    "steps": {
      "ko": ["백의 자리에 100 칩 7개를 놓고, 5개를 더 놓아요.", "100 칩이 12개예요. 10개를 모아 1000 칩 1개와 바꿔요.", "천의 자리 1개, 백의 자리 2개. 1200이에요."],
      "en": ["Put seven 100 chips in the hundreds column, then five more.", "There are twelve 100 chips. Trade ten of them for one 1000 chip.", "One thousand and two hundreds: 1200."],
      "zh": ["在百位放7个100，再放5个。", "有12个100。把其中10个换成1个1000。", "千位1个，百位2个，是1200。"]
    },
    "buy": {
      "name": {"ko": "십진 블록 세트", "en": "Base-ten blocks", "zh": "十进制积木"},
      "why": {"ko": "천 모형까지 들어 있는 세트면 크기로도 비교할 수 있어요.", "en": "A set that includes a thousand cube also shows the sizes.", "zh": "带千位立方体的一套，还可以比较大小。"},
      "pick": {"ko": "천 모형이 1개 이상 들어 있는 것.", "en": "At least one thousand cube included.", "zh": "至少含1个千位立方体。"},
      "key": "baseten"
    },
    "make": {
      "name": {"ko": "이 종이 교구로 충분해요", "en": "Use this paper set", "zh": "用这套纸教具就够了"},
      "how": {
        "ko": "자릿값 판은 바깥 점선만 오려요. 칩은 네모라 곧게 자르면 돼요. 가위는 보호자와 함께 써요.",
        "en": "Cut the mat along its outer dashed line only. The chips are squares, so every cut is straight. An adult helps with scissors.",
        "zh": "数位板只剪外侧虚线。数片是方形，直着剪就行。请大人协助使用剪刀。"
      }
    },
    "courseIds": [6],
    "order": 15,
    "audience": "early",
    "portrait": "numi-0-think.png",
    "exampleTex": "700+500=1200",
    "exampleText": {"ko": "100 칩 10개를 1000 칩 1개와 바꿨어요.", "en": "Ten 100 chips were traded for one 1000 chip.", "zh": "把10个100换成了1个1000。"},
    "build": placeChips,
    "demo": function(lang){return paperDemo("placechips",lang);}
  }
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

/* 현재 과정 번호 → 종이 교구. 없으면 null(그 주는 교구 지면이 안 붙는다). */
window.NM_PAPER_TOOL_OF_COURSE = function(n){
  var num = (typeof n === 'string') ? parseInt(String(n).replace(/^C/i, ''), 10) : n;
  if(!(num >= 0)) return null;
  for(var i = 0; i < window.NM_PAPER_TOOLS.length; i++){
    var t = window.NM_PAPER_TOOLS[i];
    if(t.courseIds.indexOf(num) >= 0) return t;
  }
  return null;
};
/* 그 과정에서 쓰는 교구를 차례로(2026-11-10). [첫 주에 싣는 교구, 둘째 주에 싣는 교구].
   같은 교구 지면을 매주 다시 싣지 않는다 — 한 번 오려 봉투에 두고 계속 쓴다. */
window.NM_PAPER_TOOLS_OF_COURSE = function(n){
  var num = (typeof n === 'string') ? parseInt(String(n).replace(/^C/i, ''), 10) : n, out = [];
  var first = window.NM_PAPER_TOOL_OF_COURSE(num);
  if(first) out.push(first);
  window.NM_PAPER_TOOLS.forEach(function(t){ if((t.secondCourseIds || []).indexOf(num) >= 0 && out.indexOf(t) < 0) out.push(t); });
  return out;
};

if(typeof module !== 'undefined' && module.exports) module.exports = window.NM_PAPER_TOOLS;
})();
