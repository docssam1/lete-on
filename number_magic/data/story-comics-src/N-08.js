/* N-08 — 별 모양 수 퍼즐 (수 기계와 매직 퍼즐) */
'use strict';
module.exports=function(H){
  const {C,svg,stick,sheep,pouch,arrow,paper,bubble,txt,ground}=H;
  const star='<polygon points="100,26 108.8,51.9 136.1,52.3 114.3,68.6 122.3,94.7 100,79 77.7,94.7 85.7,68.6 63.9,52.3 91.2,51.9" fill="none" stroke="'+C.gold+'" stroke-width="2.5"/>';
  return { panels:[
    { art: svg(
        star
        +txt(100,20,13,C.red,'?')+txt(140,48,13,C.red,'?')+txt(126,100,13,C.red,'?')
        +txt(74,100,13,C.red,'?')+txt(60,48,13,C.red,'?')),
      text:{ ko:'별 모양 자리에 1부터 12까지 수를 놓아, 어느 줄을 더해도 26이 되게 할 수 있을까요?',
             en:'Can we place the numbers 1 to 12 on a star so every line adds up to the same 26?',
             zh:'把1到12放在星形的位置上，能让每条线相加都是26吗？' } },
    { art: svg(
        paper(15,30,65,60)
        +txt(47,58,14,C.ink,'1…12')
        +arrow(90,62,120,62,C.gold,3)
        +'<g transform="translate(95,35) scale(0.55)">'+star+'</g>'),
      text:{ ko:'1부터 12까지 수를 별의 열두 자리에 하나씩 놓아 보아요.',
             en:'Try placing the numbers 1 through 12 into the star\'s twelve spots.',
             zh:'把1到12逐个放进星形的十二个位置试试。' } },
    { art: svg(
        txt(100,20,13,C.ink,'1+2+…+12=78')
        +star
        +txt(140,48,15,C.red,'12')
        +txt(60,48,15,C.red,'11')
        +'<circle cx="100" cy="20" r="3" fill="'+C.blue+'"/>'
        +'<circle cx="126" cy="100" r="3" fill="'+C.blue+'"/>'
        +'<circle cx="74" cy="100" r="3" fill="'+C.blue+'"/>'),
      text:{ ko:'1부터 12를 다 더하면 언제나 78이에요! 그래서 큰 수를 어디에 놓느냐가 전부죠.',
             en:'The numbers 1 to 12 always add up to 78 — so it all comes down to where the big numbers go.',
             zh:'1到12加起来永远是78！所以关键全在于把大数放在哪里。' } },
    { art: svg(
        '<rect x="70" y="35" width="60" height="55" rx="8" fill="'+C.blue+'" stroke="'+C.ink+'" stroke-width="2"/>'
        +txt(100,68,15,'#fff','+2')
        +arrow(30,62,68,62,C.gold,3)
        +txt(16,68,18,C.ink,'5')
        +arrow(132,62,174,62,C.gold,3)
        +txt(186,68,18,C.ink,'7')),
      text:{ ko:'수를 넣으면 규칙대로 바뀌는 수 기계처럼, 이 퍼즐도 숫자보다 규칙이 먼저였답니다.',
             en:'Just like a number machine that changes whatever you feed it, this puzzle was about the rule first, digits second.',
             zh:'就像放进数字就按规则变身的数字机器，这个谜题也是规则先于数字。' } },
  ]};
};
