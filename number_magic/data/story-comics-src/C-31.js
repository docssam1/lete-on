/* C-31 — 낙타 17마리와 이웃의 마법 같은 한 마리 */
'use strict';
module.exports = function(H){
  const {C,svg,arrow,paper,bubble,txt,ground,sage}=H;
  function camel(x,y,s,col){
    col=col||C.brown;
    return '<g transform="translate('+x+','+y+') scale('+s+')" stroke="'+col+'" stroke-width="2.4" stroke-linecap="round" fill="none">'
      +'<path d="M -14 10 Q -10 -8 -2 -2 Q 4 -10 10 -4 Q 16 0 14 10"/>'
      +'<line x1="-10" y1="10" x2="-10" y2="18"/><line x1="10" y1="10" x2="10" y2="18"/></g>';
  }
  return { panels:[
    { art: svg(
        ground(120)
        +paper(20,20,60,36)
        +txt(50,42,12,C.ink,'17')
        +camel(120,90,1.5)
        +camel(155,95,1.3)
        +sage(90,55,1)),
      text: { ko:'아버지가 낙타 17마리를 남기며 유언했어요: 첫째 1/2, 둘째 1/3, 막내 1/9.',
              en:'A father left 17 camels with a will: half to the eldest, a third to the second, a ninth to the youngest.',
              zh:'父亲留下17头骆驼和遗嘱：老大1/2、老二1/3、老幺1/9。' } },
    { art: svg(
        camel(60,80,1.3)
        +camel(90,85,1.1)
        +camel(120,80,1.3)
        +camel(150,85,1.1)
        +txt(105,35,26,C.red,'17')
        +txt(150,35,22,C.ink,'?')),
      text: { ko:'그런데 17은 2로도 3으로도 9로도 딱 안 나눠져요. 삼 형제는 발을 굴렀죠.',
              en:"But 17 can't be split evenly by 2, 3, or 9. The three brothers were stuck.",
              zh:'可17既除不尽2，也除不尽3和9。三兄弟一筹莫展。' } },
    { art: svg(
        camel(40,90,1.4)+camel(90,88,1.4)+camel(135,90,1.4)
        +txt(88,40,16,C.sub,'9·6·2')
        +'<g stroke-dasharray="3,3">'+camel(178,70,1.1,C.gold)+'</g>'
        +arrow(178,90,178,112,C.red,2.5)),
      text: { ko:'이웃이 낙타 한 마리를 보태 18마리로! 9+6+2=17을 나눠주고 자기 낙타는 도로 데려갔어요.',
              en:'A neighbor lent one camel, making 18! They gave out 9+6+2=17, then took their own camel back.',
              zh:'邻居借出一头凑成18头！分掉9+6+2=17头后，又把自己的牵了回去。' } },
    { art: svg(
        paper(20,25,70,70)
        +txt(55,52,14,C.ink,'1/2+1/3')
        +txt(55,72,14,C.ink,'+1/9')
        +arrow(100,60,130,60,C.gold,3)
        +txt(165,54,22,C.red,'17')
        +'<line x1="150" y1="66" x2="180" y2="66" stroke="'+C.ink+'" stroke-width="2"/>'
        +txt(165,86,22,C.red,'18')),
      text: { ko:'따져보면 1/2+1/3+1/9=17/18, 1이 안 돼요 — 세 사람 다 원래보다 살짝 더 받은 거예요!',
              en:'Add them up: 1/2+1/3+1/9=17/18, never reaching 1 — all three got a little more than their true share!',
              zh:'加起来1/2+1/3+1/9=17/18，凑不满1——三个人其实都多拿了一点点！' } },
  ]};
};
