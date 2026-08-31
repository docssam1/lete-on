/* M-51 — 비례론에서 함수까지 */
'use strict';
module.exports=function(H){
  const {C,svg,stick,sheep,pouch,arrow,paper,bubble,txt,ground}=H;
  return { panels:[
    { art: svg(
        ground(112)
        +'<rect x="68" y="86" width="18" height="26" fill="'+C.blue+'"/>'
        +'<rect x="112" y="62" width="18" height="50" fill="'+C.gold+'"/>'
        +txt(77,80,15,C.blue,'1')
        +txt(121,56,15,C.gold,'2')
        +stick(35,96,0.95,C.sub)),
      text: { ko:'2,300년 전 고대 그리스 사람들은 두 길이를 나란히 놓고 "몇 배인가"부터 따졌어요 — 그게 비(比)예요.',
              en:'2,300 years ago, ancient Greeks laid two lengths side by side and asked "how many times as long?" — that was called a ratio.',
              zh:'2300年前，古希腊人把两条长度放在一起，问"是几倍"——这就是比。' } },
    { art: svg(
        paper(30,20,140,100)
        +txt(100,78,46,C.gold,'V')
        +txt(100,104,20,C.ink,'a:b','font-style="italic" font-family="Georgia,serif"')),
      text: { ko:'유클리드의 『원론』은 5권 전체를 통째로 비례론에 바쳤어요 — 비와 비율을 다루는 책이죠.',
              en:'Euclid’s "Elements" devoted the whole of Book V to the theory of proportions — a book entirely about ratios.',
              zh:'欧几里得的《几何原本》整整用第五卷讲比例论——一本专讲比和比例的书。' } },
    { art: svg(
        paper(15,45,55,55)
        +txt(42,78,20,C.gold,'V')
        +arrow(85,70,140,70,C.gold,3)
        +'<line x1="150" y1="30" x2="150" y2="110" stroke="'+C.ink+'" stroke-width="2"/>'
        +'<line x1="150" y1="110" x2="188" y2="110" stroke="'+C.ink+'" stroke-width="2"/>'),
      text: { ko:'그 비례론이 수천 년을 건너, 오늘날 그래프 속 개념으로 이어지고 있어요.',
              en:'That theory of proportions crossed thousands of years to live on inside today’s graphs.',
              zh:'这套比例论跨越千年，如今活在图像的概念里。' } },
    { art: svg(
        '<line x1="18" y1="112" x2="188" y2="112" stroke="'+C.ink+'" stroke-width="2"/>'
        +'<line x1="40" y1="20" x2="40" y2="118" stroke="'+C.ink+'" stroke-width="2"/>'
        +'<line x1="40" y1="112" x2="168" y2="34" stroke="'+C.blue+'" stroke-width="3"/>'
        +'<path d="M 56 42 Q 90 55 118 92 Q 132 108 150 108" stroke="'+C.red+'" stroke-width="3" fill="none"/>'
        +txt(150,26,13,C.blue,'y=ax')
        +txt(168,100,13,C.red,'y=a/x')),
      text: { ko:'비율이 일정하면 정비례(직선), 곱이 일정하면 반비례(곡선) — 그 뿌리는 바로 그 비례론이었죠!',
              en:'A constant ratio gives a straight line (direct proportion); a constant product gives a curve (inverse proportion) — both rooted in that ancient theory of ratios!',
              zh:'比值恒定就是直线(正比例)，乘积恒定就是曲线(反比例)——两者的根都在那套比例论里！' } },
  ]};
};
