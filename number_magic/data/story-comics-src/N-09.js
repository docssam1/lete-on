/* N-09 — 완전수와 명절 이야기 (수 피라미드와 동전 세기) */
'use strict';
module.exports=function(H){
  const {C,svg,stick,sheep,pouch,arrow,paper,bubble,txt,ground}=H;
  const stone=(x,y,label,col)=>'<rect x="'+(x-16)+'" y="'+(y-14)+'" width="32" height="28" rx="6" fill="'+(col||C.paper)+'" stroke="'+C.gold+'" stroke-width="2.5"/>'+txt(x,y+5,16,C.ink,label);
  const chip=(x,y,label)=>'<rect x="'+(x-15)+'" y="'+(y-13)+'" width="30" height="26" rx="5" fill="'+C.paper+'" stroke="'+C.gold+'" stroke-width="2"/>'+txt(x,y+5,12,C.ink,label);
  return { panels:[
    { art: svg(
        txt(100,20,18,C.ink,'6')
        +stone(46,80,'1')+txt(64,86,16,C.gold,'+')
        +stone(84,80,'2')+txt(104,86,16,C.gold,'+')
        +stone(124,80,'3')
        +txt(150,86,20,C.ink,'=')
        +txt(172,86,20,C.red,'?')),
      text:{ ko:'6을 나누어 떨어지게 하는 수를 모두 찾아 더해 볼까요? 1 더하기 2 더하기 3은 얼마일까요?',
             en:'Find every number that divides 6 evenly, then add them: 1 plus 2 plus 3, how much?',
             zh:'找出所有能整除6的数，再加起来：1加2加3等于多少？' } },
    { art: svg(
        stone(40,50,'1')+txt(58,56,16,C.gold,'+')
        +stone(78,50,'2')+txt(98,56,16,C.gold,'+')
        +stone(118,50,'3')
        +txt(144,56,20,C.ink,'=')
        +txt(168,56,22,C.ok,'6')
        +txt(100,112,18,C.sub,'28')
        +txt(122,108,14,C.gold,'✨')),
      text:{ ko:'딱 6이 나와요! 이렇게 자기 약수를 더하면 자기 자신이 되는 수를 완전수라 해요. 28도 그래요.',
             en:'It makes exactly 6! A number whose own divisors add back to itself is called perfect — 28 is one too.',
             zh:'正好是6！把一个数的约数加起来又变回它自己，这样的数叫完全数，28也是。' } },
    { art: svg(
        chip(24,70,'1/1')+chip(64,70,'3/3')+chip(104,70,'5/5')
        +chip(144,70,'7/7')+chip(184,70,'9/9')),
      text:{ ko:'우리 조상님도 수에 뜻을 담았어요. 1일 3일 5일 7일 9일처럼 홀수가 겹치는 날을 명절로 삼았죠.',
             en:'Our ancestors gave numbers meaning too — they marked holidays on days when an odd number doubled, like 1/1, 3/3, 5/5.',
             zh:'我们的祖先也给数字赋予了含义，把1日3日5日7日9日这样奇数相重的日子定为节日。' } },
    { art: svg(
        stone(50,112,'1')+stone(90,112,'2')+stone(130,112,'1')
        +stone(70,82,'3')+stone(110,82,'3')
        +stone(90,52,'6',C.ok)
        +txt(112,48,14,C.gold,'✨')
        +ground(126)),
      text:{ ko:'숨은 규칙을 찾는 건 오늘 쌓을 피라미드도 똑같아요. 작은 돌이 모여 특별한 꼭대기가 돼요!',
             en:'Finding the hidden rule works just like our pyramid today — small stones join into a special top!',
             zh:'找出隐藏的规律，和今天要叠的金字塔一样！小石头合起来，就变成特别的塔顶！' } },
  ]};
};
