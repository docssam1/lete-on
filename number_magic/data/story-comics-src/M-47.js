/* M-47 — 비에트, 수 대신 문자를 쓰다 */
'use strict';
module.exports=function(H){
  const {C,svg,stick,sheep,pouch,arrow,paper,bubble,txt,ground}=H;
  return { panels:[
    { art: svg(
        ground(110)
        + stick(45,90,0.9,C.blue)
        + '<circle cx="120" cy="70" r="8" fill="'+C.red+'"/>'
        + '<circle cx="140" cy="70" r="8" fill="'+C.gold+'"/>'
        + '<circle cx="160" cy="70" r="8" fill="'+C.ok+'"/>'
        + txt(140,105,18,C.ink,'a×3')),
      text: { ko:'사탕 가게에서 사탕 한 개 값 a원짜리를 3개 사면 얼마일까요? "a×3"이라고 적어봤어요.',
              en:'At the candy shop, if one candy costs a won, buying 3 costs how much? We wrote "a×3".',
              zh:'糖果店里一颗糖a元，买3颗要多少钱呢？我们写下了"a×3"。' } },
    { art: svg(
        paper(30,25,140,90)
        + txt(70,75,26,C.ink,'a,b,c')
        + stick(160,95,0.75,C.brown)),
      text: { ko:'16세기 프랑스 수학자 비에트는 수 대신 문자를 쓰는 방법을 널리 퍼뜨렸어요.',
              en:'In the 16th century, the French mathematician Viète popularized using letters instead of numbers.',
              zh:'16世纪，法国数学家韦达把用字母代替数字的方法推广开来。' } },
    { art: svg(
        txt(45,55,30,C.sub,'×')
        + '<line x1="30" y1="40" x2="60" y2="70" stroke="'+C.red+'" stroke-width="3.5" stroke-linecap="round"/>'
        + '<line x1="60" y1="40" x2="30" y2="70" stroke="'+C.red+'" stroke-width="3.5" stroke-linecap="round"/>'
        + arrow(75,55,115,55,C.gold,3)
        + txt(150,55,28,C.blue,'3a')),
      text: { ko:'그 뒤로 곱셈 기호를 생략하는 관습이 자리 잡았어요 — "a×3"은 "3a"가 됐죠.',
              en:'After that, the habit of dropping the multiplication sign took hold — "a×3" became "3a".',
              zh:'从那以后，省略乘号的习惯逐渐固定下来——"a×3"变成了"3a"。' } },
    { art: svg(
        '<circle cx="100" cy="65" r="40" fill="none" stroke="'+C.blue+'" stroke-width="2.5"/>'
        + '<ellipse cx="100" cy="65" rx="40" ry="16" fill="none" stroke="'+C.blue+'" stroke-width="1.5"/>'
        + '<line x1="60" y1="65" x2="140" y2="65" stroke="'+C.blue+'" stroke-width="1.5"/>'
        + '<line x1="100" y1="25" x2="100" y2="105" stroke="'+C.blue+'" stroke-width="1.5"/>'
        + txt(100,70,22,C.gold,'3a')),
      text: { ko:'지금은 전 세계 수학자가 똑같은 방식으로 문자식을 써요 — 숫자는 앞에, ×는 생략!',
              en:'Today, mathematicians everywhere write algebraic expressions the same way — number first, × dropped!',
              zh:'如今全世界的数学家都用同样的方式写代数式——数字在前，省略×！' } },
  ]};
};
