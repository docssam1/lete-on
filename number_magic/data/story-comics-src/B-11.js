/* B-11 — 하노이의 탑과 8=2×2×2 마법 */
'use strict';
module.exports=function(H){
  const {C,svg,stick,sheep,pouch,arrow,paper,bubble,txt,ground}=H;
  return { panels:[
    { art: svg(
        ground(112)
        +[40,100,160].map(x=>'<line x1="'+x+'" y1="30" x2="'+x+'" y2="112" stroke="'+C.brown+'" stroke-width="4" stroke-linecap="round"/>').join('')
        +'<rect x="24" y="92" width="32" height="12" rx="3" fill="'+C.blue+'"/>'
        +'<rect x="28" y="78" width="24" height="12" rx="3" fill="'+C.gold+'"/>'
        +'<rect x="31" y="64" width="18" height="12" rx="3" fill="'+C.red+'"/>'
        +txt(100,20,14,C.sub,'?')),
      text: { ko:'원판 3개를 규칙대로 다른 기둥에 모두 옮기려면 몇 번 옮겨야 할까요? 큰 원판을 작은 원판 위에 놓으면 안 돼요!',
              en:'How many moves to shift 3 discs to another peg — never placing a bigger disc on a smaller one?',
              zh:'把3个圆盘按规则全部移到另一根柱子，需要移动几次？大盘不能压在小盘上哦！' } },
    { art: svg(
        ground(112)
        +[40,100,160].map(x=>'<line x1="'+x+'" y1="30" x2="'+x+'" y2="112" stroke="'+C.brown+'" stroke-width="4" stroke-linecap="round"/>').join('')
        +'<rect x="84" y="92" width="32" height="12" rx="3" fill="'+C.blue+'"/>'
        +'<rect x="148" y="92" width="24" height="12" rx="3" fill="'+C.gold+'"/>'
        +'<rect x="151" y="78" width="18" height="12" rx="3" fill="'+C.red+'"/>'
        +arrow(60,60,84,60,C.gold,2.6)
        +txt(72,50,10,C.sub,'1')
        +arrow(120,44,148,44,C.gold,2.6)
        +txt(134,36,10,C.sub,'2,3')),
      text: { ko:'한 번에 하나씩, 원판을 이 기둥 저 기둥으로 옮겨 봐요. 옮길수록 순서가 점점 까다로워져요.',
              en:'One disc at a time, moving them peg to peg — the more you move, the trickier the order gets.',
              zh:'一次移动一个，把圆盘搬来搬去——移得越多，顺序就越讲究。' } },
    { art: svg(
        txt(60,50,32,C.blue,'2×2×2')
        +arrow(60,60,60,84,C.gold,3)
        +txt(60,110,30,C.red,'−1')
        +txt(150,70,40,C.ink,'7')),
      text: { ko:'답은 7번! 두 배를 세 번 한 8에서 하나 뺀 수예요.',
              en:'The answer is seven — three doublings make eight, minus one.',
              zh:'答案是7次！也就是翻三次倍得到的8再减1。' } },
    { art: svg(
        '<polygon points="60,110 90,40 120,110" fill="'+C.mist+'" stroke="'+C.gold+'" stroke-width="2.5"/>'
        +'<polygon points="72,110 90,66 108,110" fill="'+C.paper+'"/>'
        +'<rect x="84" y="46" width="12" height="12" fill="'+C.gold+'"/>'
        +txt(90,132,11,C.sub,'64')
        +txt(150,50,16,C.red,'!')
        +stick(160,90,1,C.sub)),
      text: { ko:'전설 속 인도 사원엔 원판이 64개! 1초에 한 번씩 옮겨도 약 6000억 년이 걸린대요.',
              en:'Legend says the temple has 64 discs — one move a second would still take about 600 billion years.',
              zh:'传说寺庙里有64个圆盘！就算每秒移一次，也要约6000亿年。' } },
  ]};
};
