/* M-50 — 저울, aequare, 그리고 al-jabr */
'use strict';
module.exports=function(H){
  const {C,svg,stick,sheep,pouch,arrow,paper,bubble,txt,ground}=H;
  return { panels:[
    { art: svg(
        '<line x1="100" y1="25" x2="100" y2="55" stroke="'+C.ink+'" stroke-width="3"/>'
        + '<line x1="45" y1="55" x2="155" y2="55" stroke="'+C.ink+'" stroke-width="3"/>'
        + '<rect x="30" y="62" width="24" height="24" fill="'+C.cream+'" stroke="'+C.ink+'" stroke-width="2.5"/>'
        + txt(42,80,16,C.ink,'x')
        + [0,1,2].map(i=>'<circle cx="'+(65+i*9)+'" cy="80" r="4" fill="'+C.gold+'"/>').join('')
        + txt(140,85,22,C.gold,'9')
        + ground(110)),
      text: { ko:'양팔저울 왼쪽엔 상자 하나와 추 3개, 오른쪽엔 추 9개가 있고 평형이에요. 상자 속 무게는 얼마일까요?',
              en:'On a balance scale, the left pan holds a box plus 3 weights, the right pan holds 9 weights, and it balances. How heavy is the box?',
              zh:'天平左边放着一个箱子和3个砝码，右边放着9个砝码，正好平衡。箱子有多重呢？' } },
    { art: svg(
        paper(25,20,150,95)
        + txt(100,60,20,C.ink,'aequare')
        + arrow(100,72,100,95,C.gold,3)
        + txt(100,110,26,C.blue,'=')),
      text: { ko:'"방정식(equation)"이라는 말은 "같게 하다"라는 뜻의 라틴어 "aequare"에서 왔어요.',
              en:'The word "equation" comes from the Latin "aequare", meaning "to make equal".',
              zh:'"方程(equation)"一词，来自意为"使相等"的拉丁语"aequare"。' } },
    { art: svg(
        stick(50,90,0.9,C.brown)
        + paper(90,35,90,75)
        + txt(135,80,20,C.ink,'al-jabr')),
      text: { ko:'9세기 페르시아 수학자 알콰리즈미는 『al-jabr(복원)』이라는 책을 썼어요.',
              en:'In the 9th century, the Persian mathematician al-Khwarizmi wrote a book titled "al-Jabr" (restoration).',
              zh:'9世纪，波斯数学家花拉子米写了一本名为《al-jabr(还原)》的书。' } },
    { art: svg(
        txt(58,60,18,C.ink,'al-jabr')
        + arrow(90,60,130,60,C.gold,3)
        + txt(165,60,20,C.blue,'algebra')
        + txt(100,105,22,C.ok,'x=4')),
      text: { ko:'오늘날의 "대수(algebra)"라는 단어는 바로 이 책 제목에서 나온 거예요.',
              en:'Today\'s word "algebra" comes directly from the title of that very book.',
              zh:'今天的"代数(algebra)"一词，正是源自这本书的书名。' } },
  ]};
};
