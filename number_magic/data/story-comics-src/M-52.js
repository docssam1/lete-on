/* M-52 — 지수방정식 */
'use strict';
module.exports=function(H){
  const {C,svg,stick,sheep,pouch,arrow,paper,bubble,txt,ground}=H;
  return { panels:[
    { art: svg(
        txt(90,55,26,C.ink,'2ˣ=8')
        +txt(150,55,26,C.red,'?')
        +stick(60,100,1.1,C.sub)),
      text: { ko:'2ˣ=8이라는 방정식을 보면, x를 어떻게 구해야 할지 막막해요.',
              en:"Looking at 2ˣ=8, it's not obvious at first how to find x.",
              zh:'看到2ˣ=8这个方程，一开始不知道该怎么求x。' } },
    { art: svg(
        txt(50,65,28,C.ink,'8')
        +arrow(80,65,130,65,C.gold,3)
        +txt(160,65,26,C.blue,'2³')),
      text: { ko:'8을 2의 거듭제곱으로 바꿔 봐요 — 8=2³이 되죠.',
              en:'Rewrite 8 as a power of 2 — 8 becomes 2³.',
              zh:'把8改写成2的幂——8就是2³。' } },
    { art: svg(
        '<circle cx="40" cy="30" r="6" fill="'+C.blue+'"/><circle cx="40" cy="70" r="6" fill="'+C.blue+'"/><circle cx="40" cy="110" r="6" fill="'+C.blue+'"/>'
        +'<circle cx="160" cy="30" r="6" fill="'+C.gold+'"/><circle cx="160" cy="70" r="6" fill="'+C.gold+'"/><circle cx="160" cy="110" r="6" fill="'+C.gold+'"/>'
        +arrow(48,30,152,30,C.sub,2)+arrow(48,70,152,70,C.sub,2)+arrow(48,110,152,110,C.sub,2)
        +txt(100,20,13,C.ink,'log')
        +txt(100,130,11,C.sub,'17c')),
      text: { ko:'지수함수는 입력 하나에 결과가 하나뿐인 일대일 대응이에요. 17세기 로그의 발명과 함께 뚜렷해졌죠.',
              en:'An exponential function is one-to-one, one input to one output. This became clear with 17th-century logarithms.',
              zh:'指数函数是一一对应的，这一性质随17世纪对数的发明而变得清晰。' } },
    { art: svg(
        txt(80,60,20,C.ink,'2ˣ=2³')
        +txt(100,100,22,C.ok,'x=3')
        +txt(160,40,20,C.gold,'✨')),
      text: { ko:'그러니 2ˣ=2³에서 밑이 같으면, 지수끼리 비교해서 x=3이 바로 나와요.',
              en:'So in 2ˣ=2³, matching bases mean the exponents compare directly — x=3 appears at once.',
              zh:'所以2ˣ=2³里，底数相同，指数就能直接比较——马上得到x=3。' } },
  ]};
};
