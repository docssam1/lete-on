/* C-18 — ÷ 기호의 비밀과 분해 나눗셈 마법 */
'use strict';
module.exports=function(H){
  const {C,svg,stick,sheep,pouch,numi,arrow,paper,bubble,txt,ground}=H;
  return { panels:[
    { art: svg(
        '<circle cx="100" cy="46" r="8" fill="'+C.ink+'"/>'
        +'<line x1="60" y1="70" x2="140" y2="70" stroke="'+C.ink+'" stroke-width="6" stroke-linecap="round"/>'
        +'<circle cx="100" cy="94" r="8" fill="'+C.ink+'"/>'
        +txt(150,74,20,C.sub,'?')
        +numi(30,100,0.8)),
      text: { ko:'나누기 기호 ÷는 가운데 선 하나에 점 두 개예요. 무엇을 그린 걸까요?',
              en:'The division sign ÷ is a bar with a dot above and below. What is it a picture of?',
              zh:'除号÷是一条线加上下两个点。它画的是什么？' } },
    { art: svg(
        txt(60,60,26,C.blue,'●')
        +'<line x1="40" y1="72" x2="80" y2="72" stroke="'+C.ink+'" stroke-width="5"/>'
        +txt(60,96,26,C.gold,'●')
        +arrow(90,72,120,72,C.gold,2.6)
        +'<rect x="130" y="46" width="30" height="56" fill="none" stroke="'+C.ink+'" stroke-width="2.5"/>'
        +'<line x1="130" y1="74" x2="160" y2="74" stroke="'+C.ink+'" stroke-width="3"/>'),
      text: { ko:'많은 사람이 이걸 분수라고 봐요 — 점은 분자와 분모, 가운데 선은 분수선이죠.',
              en:'Many read it as a fraction — the dots are numerator and denominator, the bar is the fraction line.',
              zh:'很多人把它读成分数——两个点是分子和分母，中间的线是分数线。' } },
    { art: svg(
        paper(34,30,132,66)
        +txt(100,64,30,C.ink,'÷')
        +txt(100,92,14,C.gold,'1659')
        +stick(160,96,0.85)),
      text: { ko:'1659년 스위스의 라안이 이 기호를 나눗셈 기호로 쓰기 시작했어요.',
              en:'In 1659, Switzerland\'s Johann Rahn began using this symbol for division.',
              zh:'1659年瑞士人拉恩开始用这个符号表示除法。' } },
    { art: svg(
        txt(46,60,18,C.blue,'312÷3')
        +arrow(46,70,46,90,C.gold,3)
        +'<rect x="82" y="40" width="46" height="26" fill="none" stroke="'+C.ink+'" stroke-width="2"/>'
        +'<line x1="82" y1="53" x2="128" y2="53" stroke="'+C.ink+'" stroke-width="2.4"/>'
        +txt(105,50,12,C.gold,'300+12')
        +txt(105,64,12,C.sub,'3')
        +txt(150,60,14,C.ok,'104')),
      text: { ko:'나눗셈을 분수로 바꿔 푸는 마법이 기호 안에 이미 숨어 있었어요 — 312÷3=(300+12)÷3!',
              en:'The trick of turning division into a fraction was already hiding in the sign — 312÷3=(300+12)÷3!',
              zh:'把除法变成分数来算的魔法，早就藏在符号里了——312÷3=(300+12)÷3！' } },
  ]};
};
