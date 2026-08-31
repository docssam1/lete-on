/* M-19 — 넓이 그림에서 곱셈공식까지 */
'use strict';
module.exports=function(H){
  const {C,svg,stick,sheep,pouch,arrow,paper,bubble,txt,ground}=H;
  return { panels:[
    { art: svg(
        paper(30,18,140,104)
        +'<rect x="72" y="46" width="50" height="50" fill="none" stroke="'+C.blue+'" stroke-width="2.5"/>'
        +'<line x1="45" y1="30" x2="60" y2="45" stroke="'+C.gold+'" stroke-width="2.5"/>'
        +'<line x1="45" y1="30" x2="60" y2="15" stroke="'+C.gold+'" stroke-width="2.5"/>'),
      text: { ko:'고대 그리스 유클리드의 『원론』에도 곱셈공식이 나와요 — 그런데 문자식이 아니라 도형으로 등장했어요.',
              en:'Even ancient Greek Euclid’s "Elements" contains multiplication formulas — but they appeared as shapes, not algebra.',
              zh:'古希腊欧几里得的《几何原本》中也有乘法公式——不过是以图形而不是代数式出现的。' } },
    { art: svg(
        '<rect x="30" y="20" width="120" height="90" fill="none" stroke="'+C.ink+'" stroke-width="2.5"/>'
        +'<line x1="100" y1="20" x2="100" y2="110" stroke="'+C.ink+'" stroke-width="2"/>'
        +'<line x1="30" y1="70" x2="150" y2="70" stroke="'+C.ink+'" stroke-width="2"/>'
        +txt(65,50,18,C.blue,'x²')
        +txt(125,50,16,C.gold,'bx')
        +txt(65,94,16,C.gold,'ax')
        +txt(125,94,16,C.purple,'ab')),
      text: { ko:'정사각형과 직사각형을 나눠서 넓이를 더하면 (x+a)(x+b)의 답이 나와요.',
              en:'Split it into a square and rectangles, add up the areas, and you get the answer to (x+a)(x+b).',
              zh:'把它分成正方形和长方形，把面积加起来，就得到(x+a)(x+b)的答案。' } },
    { art: svg(
        '<rect x="15" y="40" width="60" height="46" fill="none" stroke="'+C.ink+'" stroke-width="2"/>'
        +'<line x1="45" y1="40" x2="45" y2="86" stroke="'+C.ink+'" stroke-width="1.6"/>'
        +'<line x1="15" y1="62" x2="75" y2="62" stroke="'+C.ink+'" stroke-width="1.6"/>'
        +arrow(88,63,118,63,C.gold,3)
        +txt(150,68,13,C.ink,'x²+(a+b)x+ab')),
      text: { ko:'옛날 사람들이 넓이 그림으로 보던 것을, 지금 우리는 문자식으로 배워요.',
              en:'What people once saw through area diagrams, we now learn as algebraic formulas.',
              zh:'古人通过面积图看到的东西，我们现在用代数式来学习。' } },
    { art: svg(
        txt(100,45,22,C.blue,'(x+a)(x+b)')
        +txt(100,80,18,C.ink,'=x²+(a+b)x+ab')
        +'<rect x="14" y="108" width="18" height="18" fill="none" stroke="'+C.gold+'" stroke-width="2"/>'),
      text: { ko:'그 옛날 넓이 그림에서 시작된 공식이, 오늘 (x+a)(x+b)=x²+(a+b)x+ab로 이어지고 있어요!',
              en:'The formula that began with those ancient area diagrams lives on today as (x+a)(x+b)=x²+(a+b)x+ab!',
              zh:'从那时的面积图开始的公式，如今就是(x+a)(x+b)=x²+(a+b)x+ab！' } },
  ]};
};
