/* M-44 — 같은 뜻, 다른 옷: f′과 d/dx */
'use strict';
module.exports=function(H){
  const {C,svg,txt,ground}=H;
  return { panels:[
    { art: svg(
        '<path d="M 20 110 Q 100 20 180 60" fill="none" stroke="'+C.blue+'" stroke-width="3"/>'
        +'<line x1="90" y1="70" x2="118" y2="70" stroke="'+C.gold+'" stroke-width="2.5"/>'
        +'<line x1="118" y1="70" x2="118" y2="46" stroke="'+C.red+'" stroke-width="2.5"/>'
        +'<line x1="90" y1="70" x2="118" y2="46" stroke="'+C.grey+'" stroke-width="2" stroke-dasharray="3 3"/>'
        +txt(104,84,13,C.gold,'dx')
        +txt(134,58,13,C.red,'dy')),
      text: { ko:'x가 아주 조금(dx) 변할 때 y도 아주 조금(dy) 변해요 — 이 둘의 비율에 이름을 붙이고 싶었어요.',
              en:'When x changes by a tiny amount (dx), y also changes by a tiny amount (dy) — mathematicians wanted a name for that ratio.',
              zh:'x发生极小的变化(dx)时，y也会发生极小的变化(dy)——数学家想给这个比率起个名字。' } },
    { art: svg(
        txt(100,54,30,C.blue,'dy')
        +'<line x1="66" y1="70" x2="134" y2="70" stroke="'+C.ink+'" stroke-width="3"/>'
        +txt(100,104,30,C.blue,'dx')),
      text: { ko:'1670년대, 라이프니츠는 dx(아주 작은 x 조각)분의 dy(그때 y가 변한 조각)라고 적었어요.',
              en:'In the 1670s, Leibniz wrote it as dy — the tiny piece y changed — over dx, a tiny piece of x.',
              zh:'1670年代，莱布尼茨把它写成dy(y变化的极小部分)比dx(x的极小部分)。' } },
    { art: svg(
        txt(100,90,56,C.blue,"f'")
        +'<line x1="150" y1="30" x2="168" y2="46" stroke="'+C.gold+'" stroke-width="2.5" stroke-linecap="round"/>'
        +'<line x1="158" y1="20" x2="176" y2="36" stroke="'+C.gold+'" stroke-width="2.5" stroke-linecap="round"/>'
        +'<line x1="166" y1="10" x2="184" y2="26" stroke="'+C.gold+'" stroke-width="2.5" stroke-linecap="round"/>'),
      text: { ko:'라그랑주는 짧고 빠르게 쓰려고 프라임(′) 기호 하나로 같은 뜻을 나타냈어요.',
              en:'Lagrange wanted something short and fast to write, so he used a single prime symbol (′) for the same idea.',
              zh:'拉格朗日想要写得又短又快，就用一个撇号(′)表示同样的意思。' } },
    { art: svg(
        '<rect x="24" y="40" width="56" height="70" rx="10" fill="'+C.mist+'" stroke="'+C.blue+'" stroke-width="2.5"/>'
        +txt(52,82,26,C.blue,"f'")
        +txt(100,80,26,C.ink,'=')
        +'<rect x="120" y="40" width="56" height="70" rx="10" fill="'+C.mist+'" stroke="'+C.gold+'" stroke-width="2.5"/>'
        +txt(148,80,17,C.gold,'d/dx')),
      text: { ko:'f′과 d/dx는 완전히 같은 뜻이에요 — 같은 개념이 입은 옷만 다를 뿐, 오늘도 둘 다 쓰여요.',
              en:'f′ and d/dx mean exactly the same thing — the same idea in different clothes, and both are still used today.',
              zh:'f′和d/dx意思完全相同——同一个概念穿了不同的外衣，今天两种都在用。' } },
  ]};
};
