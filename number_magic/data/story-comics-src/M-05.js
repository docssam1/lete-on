/* M-05 — 없는 수를 만들어 세상을 계산하다 (i의 탄생) */
'use strict';
module.exports=function(H){
  const {C,svg,stick,sheep,numi,pouch,arrow,paper,bubble,txt,ground}=H;
  return { panels:[
    { art: svg(
        '<line x1="15" y1="90" x2="185" y2="90" stroke="'+C.ink+'" stroke-width="2.5"/>'
        + [-2,-1,0,1,2].map((n,i)=>{const x=35+i*33; return '<line x1="'+x+'" y1="85" x2="'+x+'" y2="95" stroke="'+C.ink+'" stroke-width="2"/>'+txt(x,108,11,C.sub,String(n));}).join('')
        + txt(100,45,26,C.red,'x²=−1')
        + txt(100,65,20,C.sub,'?')),
      text: { ko:'같은 수를 두 번 곱해서 음수가 나올 수 있을까요? x²=−1을 만족하는 수를 찾아봐요.',
              en:'Can multiplying a number by itself give a negative? Let\'s look for a number satisfying x²=−1.',
              zh:'同一个数自乘两次，能得到负数吗？我们来找一个满足x²=−1的数。' } },
    { art: svg(
        numi(30,107,0.6)
        + txt(80,50,18,C.blue,'1²=1')
        + txt(150,50,18,C.blue,'(−1)²=1')
        + txt(115,95,22,C.red,'−1')
        + '<line x1="97" y1="82" x2="133" y2="108" stroke="'+C.red+'" stroke-width="3.5" stroke-linecap="round"/>'
        + '<line x1="133" y1="82" x2="97" y2="108" stroke="'+C.red+'" stroke-width="3.5" stroke-linecap="round"/>'),
      text: { ko:'1²=1, (−1)²=1 — 실수 안에서는 아무리 찾아도 답이 없어요.',
              en:'1²=1, (−1)²=1 — search all you like among the real numbers, there\'s no answer.',
              zh:'1²=1，(−1)²=1——在实数范围内怎么找都没有答案。' } },
    { art: svg(
        numi(30,102,0.6)
        + bubble(115,55,46,30,115,95)
        + txt(115,50,34,C.purple,'i')
        + txt(115,80,15,C.sub,'i²=−1')),
      text: { ko:'그래서 수학자들은 제곱하면 −1이 되는 새 수 i를 만들었어요. 처음엔 "상상의 수"라 놀림받았죠.',
              en:'So mathematicians simply invented a new number, i, whose square is −1. At first it was mocked as "imaginary".',
              zh:'于是数学家们造了一个新数i，它的平方是−1。起初它被嘲笑为"虚数"。' } },
    { art: svg(
        ground(115)
        + '<path d="M20 90 L40 90 L50 60 L65 100 L80 60 L95 90 L115 90" fill="none" stroke="'+C.blue+'" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'
        + '<rect x="140" y="55" width="34" height="34" fill="none" stroke="'+C.purple+'" stroke-width="3"/>'
        + arrow(174,60,174,90,C.gold,2.5)
        + txt(157,110,15,C.ink,'i')),
      text: { ko:'지금은 전기 신호를 다루는 공학과 3D 게임의 회전 계산에서 매일 쓰여요 — 없는 수로 진짜 세상을 계산한 거예요.',
              en:'Today it runs through electrical engineering and the rotation math behind 3D games, every single day — a number that didn\'t exist ended up computing the real world.',
              zh:'如今它每天都用在处理电信号的工程学和3D游戏的旋转计算中——用一个本不存在的数，算出了真实的世界。' } },
  ]};
};
