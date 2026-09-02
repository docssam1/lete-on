/* M-25 — 인수분해 심화: 거꾸로 읽기와 치환, 같은 전략 두 가지 */
'use strict';
module.exports=function(H){
  const {C,svg,arrow,txt}=H;
  return { panels:[
    { art: svg(
        txt(50,45,15,C.blue,'x²+bx+c')
        +txt(50,70,18,C.ok,'✓')
        +txt(150,40,14,C.ink,'x³+27')
        +txt(150,65,14,C.ink,'x⁴+5x²+6')
        +txt(150,95,22,C.gold,'?')),
      text: { ko:'x²+bx+c 인수분해는 이제 익숙해요. 그런데 x³+27처럼 차수가 더 높으면 어떻게 할까요?',
              en:'Factoring x²+bx+c feels familiar now. But what about higher-degree expressions like x³+27?',
              zh:'因式分解x²+bx+c已经很熟悉了。但x³+27这种更高次的式子怎么办？' } },
    { art: svg(
        txt(45,30,13,C.sub,'x³+a³')
        +arrow(70,45,25,45,C.red,2)
        +txt(45,65,13,C.blue,'(x+a)(x²-ax+a²)')
        +'<line x1="100" y1="15" x2="100" y2="125" stroke="'+C.grey+'" stroke-width="1.5"/>'
        +txt(150,35,20,C.gold,'x²')
        +arrow(150,50,150,70,C.purple,2)
        +txt(150,90,20,C.purple,'t')),
      text: { ko:'새로운 무기가 두 가지 필요해요 — 곱셈공식을 거꾸로 읽거나, 낯선 문자를 t로 바꿔치기하거나.',
              en:'Two new weapons are needed — read a multiplication formula backward, or swap the unfamiliar part for a letter t.',
              zh:'需要两件新武器——把乘法公式反着读，或者把陌生的部分换成字母t。' } },
    { art: svg(
        txt(40,40,13,C.ink,'x³±a³')
        +txt(160,40,13,C.ink,'t²+bt+c')
        +arrow(60,55,90,80,C.gold,2)
        +arrow(150,55,120,80,C.purple,2)
        +'<rect x="80" y="82" width="40" height="30" rx="5" fill="'+C.paper+'" stroke="'+C.ink+'" stroke-width="2"/>'
        +txt(100,102,13,C.ok,'known')),
      text: { ko:"사실 둘 다 같은 전략이에요 — 낯선 식을 '이미 아는 모양'으로 바꾸는 거죠.",
              en:'Really, both are the same strategy — turning an unfamiliar expression into a shape you already know.',
              zh:'其实两者是同一个策略——把陌生的式子变成已经认识的形状。' } },
    { art: svg(
        txt(45,35,13,C.ink,'x³+27')
        +arrow(45,45,45,65,C.gold,2)
        +txt(45,85,12,C.blue,'(x+3)(x²-3x+9)')
        +txt(150,35,13,C.ink,'x⁴+5x²+6')
        +arrow(150,45,150,65,C.purple,2)
        +txt(150,85,12,C.blue,'(x²+2)(x²+3)')
        +txt(100,110,18,C.ok,'✓')),
      text: { ko:'그래서 x³+27도, x⁴+5x²+6도 결국 이미 아는 인수분해 모양으로 되돌아와요.',
              en:'So both x³+27 and x⁴+5x²+6 eventually turn back into factoring shapes you already know.',
              zh:'所以x³+27和x⁴+5x²+6最终都会变回你已经熟悉的因式分解形状。' } },
  ]};
};
