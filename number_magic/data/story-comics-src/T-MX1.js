/* T-MX1 — 혼합 계산의 규칙 · 계산 순서는 모호함을 없애려는 약속 */
'use strict';
module.exports=function(H){
  const {C,svg,bubble,arrow,txt,numi,boy,girl}=H;
  return { panels:[
    { art: svg(
        bubble(62,44,50,26,96,74)
        +txt(62,52,17,C.ink,'3+5×2')
        +boy(46,112,0.9)+girl(150,112,0.9)
        +txt(150,56,30,C.grey,'?')),
      text:{ ko:'선생님이 한 줄을 칠판에 적었어요. 3에 5를 더하고 2를 곱하라는 걸까요?',
             en:'The teacher wrote one line on the board. Does it mean: add 5 to 3, then multiply by 2?',
             zh:'老师在黑板上写下一行。意思是先把3加5，再乘2吗？' } },
    { art: svg(
        txt(100,46,20,C.ink,'(3+5)×2')
        +arrow(72,58,72,76,C.blue,3)
        +txt(100,96,20,C.blue,'8×2')
        +txt(100,126,24,C.red,'16')
        +boy(28,60,0.7)),
      text:{ ko:'먼저 더한 아이는 8에 2를 곱해서 16이 나왔어요.',
             en:'The child who added first got 8, multiplied by 2, and landed on 16.',
             zh:'先做加法的孩子得到8，再乘2，算出16。' } },
    { art: svg(
        txt(100,46,20,C.ink,'3+(5×2)')
        +arrow(128,58,128,76,C.gold,3)
        +txt(100,96,20,C.gold,'3+10')
        +txt(100,126,24,C.red,'13')
        +girl(172,60,0.7)),
      text:{ ko:'먼저 곱한 아이는 10에 3을 더해서 13이 나왔고요. 같은 한 줄인데 답이 달라졌어요!',
             en:'The child who multiplied first got 10, added 3, and landed on 13. Same line, different answers!',
             zh:'先做乘法的孩子得到10，再加3，算出13。同样一行，答案却不同！' } },
    { art: svg(
        '<rect x="22" y="26" width="156" height="42" rx="6" fill="'+C.paper+'" stroke="'+C.gold+'" stroke-width="2.5"/>'
        +txt(100,54,19,C.bluedeep,'×÷ → +−')
        +txt(100,92,20,C.ink,'3+5×2')
        +txt(100,124,24,C.ok,'13')
        +numi(166,116,0.7)),
      text:{ ko:'그래서 곱셈과 나눗셈을 먼저 한다고 약속했어요. 규칙은 잔소리가 아니라, 한 줄의 뜻을 하나로 정하는 약속이에요.',
             en:'So everyone agreed: multiplication and division go first. The rule is not nagging — it is the agreement that gives one line one meaning.',
             zh:'于是大家约定：先乘除后加减。规则不是唠叨，而是让同一行只有一种意思的约定。' } },
  ]};
};
