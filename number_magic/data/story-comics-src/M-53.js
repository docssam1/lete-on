/* M-53 — 로그방정식 */
'use strict';
module.exports=function(H){
  const {C,svg,stick,numi,sheep,pouch,arrow,paper,bubble,txt,ground}=H;
  return { panels:[
    { art: svg(
        txt(100,50,17,C.ink,'log₂(2x+1)=3')
        +numi(60,100,1)
        +'<path d="M 45 60 Q 50 50 55 60 Q 60 70 65 60" fill="none" stroke="'+C.red+'" stroke-width="2"/>'),
      text: { ko:'log₂(2x+1)=3 같은 식은 언뜻 보면 무척 복잡해 보여요.',
              en:'An equation like log₂(2x+1)=3 looks quite complicated at first glance.',
              zh:'像log₂(2x+1)=3这样的式子乍看非常复杂。' } },
    { art: svg(
        txt(40,55,15,C.ink,'2×2×2')
        +arrow(75,55,115,55,C.gold,3)
        +txt(155,55,17,C.blue,'2x+1')),
      text: { ko:"log의 정의를 떠올려봐요 — '2를 3번 곱하면 (2x+1)이 된다'는 뜻이에요.",
              en:"Recall the definition of log — it means '2 multiplied 3 times gives (2x+1)'.",
              zh:'想起log的定义——意思是"2乘3次得到(2x+1)"。' } },
    { art: svg(
        txt(45,60,22,C.blue,'log')
        +txt(150,60,22,C.gold,'exp')
        +arrow(70,42,125,42,C.ok,2.5)
        +arrow(125,78,70,78,C.red,2.5)),
      text: { ko:'사실 log와 지수는 서로 반대 방향으로 가는 역함수 관계예요.',
              en:'In fact, log and exponentiation are inverse functions, running in opposite directions.',
              zh:'其实log和指数互为反函数，方向正好相反。' } },
    { art: svg(
        txt(100,55,20,C.ink,'2x+1=8')
        +numi(150,100,1)
        +txt(55,105,20,C.gold,'✨')),
      text: { ko:'그러니 2x+1=2³=8로 바꾸면, 남는 건 그냥 일차방정식이에요.',
              en:'So rewriting it as 2x+1=2³=8 leaves nothing but a plain linear equation.',
              zh:'于是改写成2x+1=2³=8，剩下的就只是一个一次方程了。' } },
  ]};
};
