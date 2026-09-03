/* M-14 — 저울의 균형에서 algebra까지 */
'use strict';
module.exports=function(H){
  const {C,svg,sheep,scholar,pouch,arrow,paper,bubble,txt,ground}=H;
  return { panels:[
    { art: svg(
        '<polygon points="100,110 84,132 116,132" fill="'+C.brown+'"/>'
        +'<line x1="100" y1="58" x2="100" y2="110" stroke="'+C.brown+'" stroke-width="3.5"/>'
        +'<line x1="38" y1="58" x2="162" y2="58" stroke="'+C.ink+'" stroke-width="3"/>'
        +'<line x1="38" y1="58" x2="38" y2="82" stroke="'+C.ink+'" stroke-width="2"/>'
        +'<line x1="162" y1="58" x2="162" y2="82" stroke="'+C.ink+'" stroke-width="2"/>'
        +'<ellipse cx="38" cy="86" rx="22" ry="7" fill="'+C.wool+'" stroke="'+C.ink+'" stroke-width="2"/>'
        +'<ellipse cx="162" cy="86" rx="22" ry="7" fill="'+C.wool+'" stroke="'+C.ink+'" stroke-width="2"/>'
        +'<rect x="28" y="70" width="9" height="9" fill="'+C.gold+'"/>'
        +'<rect x="41" y="70" width="9" height="9" fill="'+C.gold+'"/>'
        +'<rect x="152" y="70" width="9" height="9" fill="'+C.gold+'"/>'
        +'<rect x="165" y="70" width="9" height="9" fill="'+C.gold+'"/>'
        +txt(100,32,17,C.gold,'−5')),
      text: { ko:'양팔저울이 평형이에요. 한쪽에서 추 5개를 덜어내면, 반대쪽은 어떻게 해야 평형이 유지될까요?',
              en:'A balance scale is level. If you remove 5 weights from one side, what must the other side do to stay level?',
              zh:'天平是平衡的。如果从一边拿掉5个砝码，另一边要怎么做才能保持平衡？' } },
    { art: svg(
        '<polygon points="100,110 84,132 116,132" fill="'+C.brown+'"/>'
        +'<line x1="100" y1="58" x2="100" y2="110" stroke="'+C.brown+'" stroke-width="3.5"/>'
        +'<line x1="38" y1="58" x2="162" y2="58" stroke="'+C.ink+'" stroke-width="3"/>'
        +'<line x1="38" y1="58" x2="38" y2="82" stroke="'+C.ink+'" stroke-width="2"/>'
        +'<line x1="162" y1="58" x2="162" y2="82" stroke="'+C.ink+'" stroke-width="2"/>'
        +'<ellipse cx="38" cy="86" rx="22" ry="7" fill="'+C.wool+'" stroke="'+C.ink+'" stroke-width="2"/>'
        +'<ellipse cx="162" cy="86" rx="22" ry="7" fill="'+C.wool+'" stroke="'+C.ink+'" stroke-width="2"/>'
        +'<rect x="34" y="70" width="9" height="9" fill="'+C.gold+'"/>'
        +'<rect x="158" y="70" width="9" height="9" fill="'+C.gold+'"/>'
        +txt(100,32,20,C.ok,'=')),
      text: { ko:'정답은 "반대쪽도 똑같이 덜어내기"예요 — 그래야 평형(등식)이 유지돼요.',
              en:'The answer is "remove the same amount from the other side too" — only then does the balance (equation) stay true.',
              zh:'答案是"另一边也要拿掉一样多"——这样天平(等式)才能保持平衡。' } },
    { art: svg(
        scholar(45,86,1.25)
        +paper(80,32,100,80)
        +txt(130,80,17,C.ink,'al-jabr','font-style="italic" font-family="Georgia,serif"')),
      text: { ko:'9세기 수학자 알콰리즈미는 책 제목에 "al-jabr"(복원하다, 맞추다)라는 말을 썼어요.',
              en:'In the 9th century, mathematician al-Khwarizmi used the word "al-jabr" (to restore, to balance) in his book’s title.',
              zh:'9世纪数学家花拉子米在书名中用了"al-jabr"(复原、配平)这个词。' } },
    { art: svg(
        txt(52,50,17,C.sub,'al-jabr','font-style="italic" font-family="Georgia,serif"')
        +arrow(90,50,128,50,C.gold,3)
        +txt(165,50,19,C.ink,'algebra','font-weight="800" font-style="italic" font-family="Georgia,serif"')
        +txt(100,100,17,C.blue,'x+7=12→x=12−7')),
      text: { ko:'"al-jabr"가 오늘날 "algebra"(대수학)의 어원이 됐어요 — 등식을 맞추는 이 기술 자체가 학문의 이름이 된 거죠!',
              en:'"Al-jabr" became the origin of the word "algebra" — the very technique of balancing equations gave the subject its name!',
              zh:'"al-jabr"成了今天"algebra"(代数学)的词源——配平等式这项技术本身，就成了这门学科的名字！' } },
  ]};
};
