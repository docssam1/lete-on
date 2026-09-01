/* B-04 — 아무도 이유를 모르는 × 기호(2단 곱셈구구의 뿌리) */
'use strict';
module.exports=function(H){
  const {C,svg,wig,sheep,pouch,numi,arrow,paper,bubble,txt,ground}=H;
  return { panels:[
    { art: svg(
        txt(100,66,50,C.blue,'×')
        +txt(100,104,18,C.red,'?')
        +numi(30,108,0.75)),
      text: { ko:'곱하기 기호 ×는 누가 만들었을까요?',
              en:'Who invented the multiplication sign ×?',
              zh:'乘号×是谁发明的？' } },
    { art: svg(
        wig(48,80,1.1)
        +paper(80,30,110,66)
        +txt(135,66,30,C.ink,'×')
        +txt(135,90,13,C.sub,'1631')),
      text: { ko:'1631년, 영국의 오트레드가 처음 이 기호를 썼어요.',
              en:"In 1631, England's William Oughtred first wrote this sign.",
              zh:'1631年，英国的奥特雷德第一次写下了这个符号。' } },
    { art: svg(
        txt(100,72,44,C.ink,'×')
        +txt(140,42,28,C.red,'?')
        +'<path d="M 40 30 Q 60 20 80 30" fill="none" stroke="'+C.grey+'" stroke-width="2" stroke-dasharray="2 3"/>'
        +'<path d="M 40 110 Q 60 120 80 110" fill="none" stroke="'+C.grey+'" stroke-width="2" stroke-dasharray="2 3"/>'),
      text: { ko:'그런데 왜 하필 이 모양인지는 아직도 아무도 몰라요. 수학에도 이런 미스터리가 있답니다.',
              en:'But to this day, nobody knows why he chose that shape. Even math has such little mysteries.',
              zh:'可直到今天也没人知道他为什么选这个形状。数学里也有这样说不清来由的谜。' } },
    { art: svg(
        txt(100,40,17,C.ink,'2×1=2')
        +txt(100,66,17,C.ink,'2×5=10')
        +txt(100,94,20,C.red,'2×9=18')),
      text: { ko:'2단은 이 알 수 없는 기호를 우리가 처음 만나는 곱셈이에요. 2×1부터 2×9까지, 오늘 함께 만나봐요!',
              en:'The 2 times table is where we first meet this mysterious sign — from 2×1 to 2×9, let\'s meet it today!',
              zh:'2的乘法口诀，就是我们第一次遇见这个神秘符号的地方——从2×1到2×9，今天一起认识它！' } },
  ]};
};
