/* A-15 — 나란한 두 선, = 기호의 탄생 */
'use strict';
module.exports=function(H){
  const {C,svg,stick,sheep,pouch,arrow,paper,bubble,txt,ground}=H;
  return { panels:[
    { art: svg(
        paper(24,20,152,80)
        +txt(46,64,20,C.ink,'A','font-family="Georgia,serif" font-style="italic"')
        +'<path d="M 66 60 Q 90 50 110 60 Q 130 70 154 60" fill="none" stroke="'+C.grey+'" stroke-width="3" stroke-linecap="round"/>'
        +txt(164,64,20,C.ink,'B','font-family="Georgia,serif" font-style="italic"')
        +txt(100,96,20,C.red,'?')),
      text: { ko:'옛날엔 "같다"는 말을 매번 글로 길게 풀어 썼어요. 더 짧게 쓸 방법은 없었을까요?',
              en:'Long ago people wrote out the word "equals" in full, every single time. Was there no shorter way?',
              zh:'很久以前，人们每次都要把"相等"两个字完整写出来。难道没有更简短的写法吗？' } },
    { art: svg(
        stick(34,80,1.1,C.blue)
        +paper(64,26,120,72)
        +'<line x1="86" y1="56" x2="164" y2="56" stroke="'+C.bluedeep+'" stroke-width="4"/>'
        +'<line x1="86" y1="70" x2="164" y2="70" stroke="'+C.bluedeep+'" stroke-width="4"/>'),
      text: { ko:'1557년 영국의 레코드가 말했어요. "나란한 두 선보다 더 같은 것은 없다!"',
              en:'In 1557, England\'s Robert Recorde declared: nothing could be more equal than a pair of parallel lines.',
              zh:'1557年，英国的雷科德说："没有什么比两条平行线更相等了！"' } },
    { art: svg(
        '<line x1="30" y1="50" x2="120" y2="50" stroke="'+C.grey+'" stroke-width="5"/>'
        +'<line x1="30" y1="66" x2="120" y2="66" stroke="'+C.grey+'" stroke-width="5"/>'
        +arrow(130,58,155,58,C.gold,3)
        +'<line x1="164" y1="52" x2="184" y2="52" stroke="'+C.red+'" stroke-width="6"/>'
        +'<line x1="164" y1="64" x2="184" y2="64" stroke="'+C.red+'" stroke-width="6"/>'),
      text: { ko:'그때 기호는 지금보다 훨씬 길었어요. 점점 짧아져 오늘의 =가 되었죠.',
              en:'His symbol was much longer than ours — it slowly shrank into today\'s neat =.',
              zh:'当时的符号比现在长得多，渐渐缩短，变成了今天的=。' } },
    { art: svg(
        paper(10,42,180,56)
        +txt(60,76,15,C.ink,'87 = 90-3')
        +txt(140,76,15,C.red,'= 28')),
      text: { ko:'수를 여러 단계로 풀어 쓸 때 =로 죽 이어가는 것도 레코드 덕분이에요!',
              en:'Every time we chain steps together with =, we have Robert Recorde to thank!',
              zh:'我们把算式一步步用=连起来，也是多亏了雷科德！' } },
  ]};
};
