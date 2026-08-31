/* M-56 — 코사인법칙 */
'use strict';
module.exports=function(H){
  const {C,svg,sheep,pouch,arrow,paper,bubble,txt,ground,wig}=H;
  return { panels:[
    { art: svg(
        '<polygon points="30,110 150,110 30,30" fill="none" stroke="'+C.blue+'" stroke-width="2.5"/>'
        +'<rect x="30" y="95" width="15" height="15" fill="none" stroke="'+C.ink+'" stroke-width="1.5"/>'
        +txt(95,128,15,C.ink,'a²=b²+c²')),
      text: { ko:'피타고라스 정리(a²=b²+c²)는 각이 딱 90°일 때만 쓸 수 있어요.',
              en:'The Pythagorean theorem (a²=b²+c²) only works when the angle is exactly 90°.',
              zh:'勾股定理(a²=b²+c²)只有在角正好是90°时才能用。' } },
    { art: svg(
        '<polygon points="30,110 160,110 90,30" fill="none" stroke="'+C.blue+'" stroke-width="2.5"/>'
        +'<path d="M 78 45 Q 90 55 100 45" fill="none" stroke="'+C.gold+'" stroke-width="2"/>'
        +txt(90,22,13,C.gold,'A')
        +arrow(105,60,150,60,C.gold,2.5)
        +txt(178,60,13,C.ink,'cosA')),
      text: { ko:'각이 90°가 아니라면 어떡하죠? 코사인법칙은 이걸 어떤 각에서도 쓰게 확장한 공식이에요.',
              en:'What about other angles? The law of cosines extends the idea to work for any angle.',
              zh:'角不是90°怎么办？余弦定理把它推广到能用于任意角。' } },
    { art: svg(
        '<polygon points="70,100 140,100 100,50" fill="none" stroke="'+C.ink+'" stroke-width="2"/>'
        +'<rect x="70" y="105" width="70" height="20" fill="'+C.mist+'" stroke="'+C.gold+'" stroke-width="1.5"/>'
        +'<rect x="112" y="62" width="20" height="20" fill="'+C.mist+'" stroke="'+C.gold+'" stroke-width="1.5"/>'
        +'<rect x="72" y="62" width="20" height="20" fill="'+C.mist+'" stroke="'+C.gold+'" stroke-width="1.5"/>'),
      text: { ko:'이 원형은 기원전 3세기 유클리드의 『원론』에 이미 도형으로 담겨 있었대요.',
              en:"An early form already appeared as a geometric figure in Euclid's Elements, 3rd century BCE.",
              zh:'这个雏形早在公元前3世纪欧几里得的《几何原本》里就以图形出现过。' } },
    { art: svg(
        '<polygon points="40,105 160,105 90,30" fill="none" stroke="'+C.blue+'" stroke-width="2.5"/>'
        +txt(100,122,11,C.ink,'a')+txt(58,72,11,C.ink,'b')+txt(132,72,11,C.ink,'c')+txt(90,20,11,C.gold,'A')
        +wig(175,100,0.8)
        +txt(100,134,10,C.sub,'a²=b²+c²-2bc·cosA')),
      text: { ko:'16세기 프랑스의 비에트가 지금 쓰는 식 a²=b²+c²-2bc·cosA로 정리했어요.',
              en:"16th-century Frenchman François Viète organized it into today's formula.",
              zh:'16世纪法国的韦达把它整理成今天的公式：a²=b²+c²-2bc·cosA。' } },
  ]};
};
