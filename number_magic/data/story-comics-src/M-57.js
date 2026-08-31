/* M-57 — 라디안 하나에 숨은 2π */
'use strict';
module.exports=function(H){
  const {C,svg,arrow,txt,ground}=H;
  return { panels:[
    { art: svg(
        '<circle cx="70" cy="72" r="34" fill="none" stroke="'+C.blue+'" stroke-width="3"/>'
        +'<line x1="36" y1="72" x2="104" y2="72" stroke="'+C.gold+'" stroke-width="3"/>'
        +'<path d="M 70 38 A 34 34 0 1 1 69.9 38" fill="none" stroke="'+C.red+'" stroke-width="2" stroke-dasharray="3 3"/>'
        +txt(70,26,15,C.red,'C')
        +txt(70,124,15,C.gold,'d')
        +txt(150,80,40,C.blue,'π')),
      text: { ko:'원의 둘레(C)를 지름(d)으로 나누면 언제나 π가 나와요 — 원과 뗄 수 없는 숫자죠.',
              en:"Divide a circle's circumference (C) by its diameter (d), and you always get π — a number inseparable from the circle.",
              zh:'把圆的周长(C)除以直径(d)，总会得到π——一个和圆密不可分的数字。' } },
    { art: svg(
        '<circle cx="100" cy="76" r="40" fill="none" stroke="'+C.blue+'" stroke-width="2.5"/>'
        +'<line x1="100" y1="76" x2="140" y2="76" stroke="'+C.grey+'" stroke-width="2.5"/>'
        +'<line x1="100" y1="76" x2="121.6" y2="42.4" stroke="'+C.gold+'" stroke-width="2.5"/>'
        +'<path d="M 140 76 A 40 40 0 0 0 121.6 42.4" fill="none" stroke="'+C.red+'" stroke-width="3.5"/>'
        +txt(122,68,12,C.grey,'r')
        +txt(114,42,12,C.gold,'r')
        +txt(148,50,13,C.red,'1rad')),
      text: { ko:"각도를 '호의 길이'로 재는 라디안에서는, 반지름과 길이가 같은 호가 만드는 각을 1 라디안이라 불러요.",
              en:'In radians, angles are measured by arc length — the angle traced by an arc as long as the radius is called 1 radian.',
              zh:'弧度制用弧长来量角度——弧长等于半径所对应的角，就叫1弧度。' } },
    { art: svg(
        '<circle cx="38" cy="34" r="20" fill="none" stroke="'+C.blue+'" stroke-width="2.5"/>'
        +arrow(58,50,90,80,C.gold,2.5)
        +'<path d="M 10 92 Q 40 62 70 92 T 130 92 T 190 92" fill="none" stroke="'+C.blue+'" stroke-width="3"/>'
        +'<line x1="190" y1="70" x2="190" y2="112" stroke="'+C.red+'" stroke-width="2" stroke-dasharray="3 3"/>'
        +txt(178,112,14,C.red,'2π')),
      text: { ko:'원이 한 바퀴(360°) 도는 데 필요한 호의 길이는 반지름의 2π배예요 — 그래서 한 바퀴는 2π 라디안!',
              en:"The arc length for one full turn (360°) of a circle is 2π times the radius — so a full turn is 2π radians!",
              zh:'圆转一整圈(360°)所需的弧长是半径的2π倍——所以一整圈就是2π弧度！' } },
    { art: svg(
        '<path d="M 10 76 Q 40 40 70 76 T 130 76 T 190 76" fill="none" stroke="'+C.blue+'" stroke-width="3"/>'
        +'<line x1="10" y1="100" x2="10" y2="112" stroke="'+C.gold+'" stroke-width="2"/>'
        +'<line x1="130" y1="100" x2="130" y2="112" stroke="'+C.gold+'" stroke-width="2"/>'
        +arrow(14,106,126,106,C.gold,2)
        +txt(70,122,13,C.gold,'2π÷b')
        +txt(70,30,14,C.red,'T')),
      text: { ko:'sin·cos 곡선이 처음 모양으로 돌아오는 데 걸리는 x의 길이(주기)가 2π인 것도 바로 이 라디안 덕분이에요.',
              en:"That's exactly why the period of a sin/cos curve — the x-length it takes to return to its starting shape — is 2π.",
              zh:'这正是sin·cos曲线回到起始形状所需的x长度(周期)是2π的原因。' } },
  ]};
};
