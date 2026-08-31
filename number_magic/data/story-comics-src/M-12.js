/* M-12 — 사과는 사과끼리, x는 x끼리 */
'use strict';
module.exports=function(H){
  const {C,svg,stick,sheep,pouch,arrow,paper,bubble,txt,ground}=H;
  return { panels:[
    { art: svg(
        '<circle cx="28" cy="62" r="11" fill="'+C.red+'"/>'
        +'<circle cx="52" cy="62" r="11" fill="'+C.red+'"/>'
        +'<circle cx="76" cy="62" r="11" fill="'+C.red+'"/>'
        +txt(96,68,20,C.ink,'+')
        +'<ellipse cx="122" cy="64" rx="10" ry="14" fill="'+C.gold+'"/>'
        +'<ellipse cx="148" cy="64" rx="10" ry="14" fill="'+C.gold+'"/>'
        +txt(178,68,20,C.ink,'=?')),
      text: { ko:'사과 3개와 배 2개를 더하면 몇 개일까요? "5개"라고 답하면 틀려요!',
              en:'3 apples plus 2 pears — how many is that? Answering "5" is wrong!',
              zh:'3个苹果加2个梨，一共几个？答"5个"是错的！' } },
    { art: svg(
        '<rect x="12" y="42" width="76" height="42" rx="8" fill="none" stroke="'+C.red+'" stroke-width="2" stroke-dasharray="4 3"/>'
        +'<circle cx="34" cy="63" r="9" fill="'+C.red+'"/>'
        +'<circle cx="54" cy="63" r="9" fill="'+C.red+'"/>'
        +'<circle cx="74" cy="63" r="9" fill="'+C.red+'"/>'
        +'<rect x="108" y="42" width="66" height="42" rx="8" fill="none" stroke="'+C.gold+'" stroke-width="2" stroke-dasharray="4 3"/>'
        +'<ellipse cx="130" cy="63" rx="9" ry="12" fill="'+C.gold+'"/>'
        +'<ellipse cx="154" cy="63" rx="9" ry="12" fill="'+C.gold+'"/>'
        +txt(50,102,15,C.red,'3')
        +txt(141,102,15,C.gold,'2')),
      text: { ko:'사과는 사과끼리, 배는 배끼리 — 종류가 다르면 합칠 수 없어요.',
              en:'Apples stay with apples, pears with pears — different kinds cannot be combined.',
              zh:'苹果归苹果，梨归梨——不同种类不能合并。' } },
    { art: svg(
        paper(18,14,164,112)
        +'<rect x="40" y="34" width="32" height="24" rx="4" fill="'+C.blue+'"/>'
        +txt(56,52,15,C.wool,'x')
        +'<rect x="95" y="30" width="32" height="24" rx="4" fill="'+C.gold+'"/>'
        +txt(111,48,15,C.wool,'y')
        +'<rect x="60" y="75" width="32" height="24" rx="4" fill="'+C.purple+'"/>'
        +txt(76,93,14,C.wool,'x²')
        +'<rect x="122" y="70" width="30" height="24" rx="4" fill="'+C.grey+'"/>'
        +txt(137,88,15,C.ink,'5')),
      text: { ko:'"다항식"이란 말은 원래 "여러(多) 개의 항(項)으로 된 식"이라는 뜻이에요.',
              en:'The word "polynomial" literally means "an expression made of many terms."',
              zh:'"多项式"这个词，字面意思就是"由多个项组成的式子"。' } },
    { art: svg(
        '<rect x="26" y="48" width="42" height="30" rx="5" fill="'+C.blue+'"/>'
        +txt(47,69,16,C.wool,'3x')
        +txt(75,69,18,C.ink,'+')
        +'<rect x="88" y="48" width="42" height="30" rx="5" fill="'+C.blue+'"/>'
        +txt(109,69,16,C.wool,'5x')
        +arrow(100,86,100,104,C.gold,2)
        +'<rect x="72" y="106" width="56" height="30" rx="5" fill="'+C.blue+'"/>'
        +txt(100,127,17,C.wool,'8x')),
      text: { ko:'그래서 3x와 5x처럼 같은 종류(동류항)끼리만 계수를 더해서 8x로 합쳐요!',
              en:'So we only add the coefficients of matching kinds (like terms), such as 3x and 5x, to get 8x!',
              zh:'所以只有像3x和5x这样的同类项，才能把系数相加合并成8x！' } },
  ]};
};
