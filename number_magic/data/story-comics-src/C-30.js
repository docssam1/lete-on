/* C-30 — 알고리즘이라는 이름을 가진 사람 */
'use strict';
module.exports = function(H){
  const {C,svg,stick,arrow,paper,bubble,txt,ground}=H;
  return { panels:[
    { art: svg(
        ground(120)
        +'<path d="M 30 120 L 30 70 Q 30 45 55 45 Q 80 45 80 70 L 80 120" fill="none" stroke="'+C.gold+'" stroke-width="3"/>'
        +'<path d="M 120 120 L 120 70 Q 120 45 145 45 Q 170 45 170 70 L 170 120" fill="none" stroke="'+C.gold+'" stroke-width="3"/>'
        +stick(100,95,1.1,C.blue)
        +bubble(140,42,30,18,120,60)
        +txt(140,46,15,C.ink,'?')),
      text: { ko:'1200년쯤 전 바그다드. algorithm이라는 말은 원래 무엇이었을까요?',
              en:'Baghdad, about 1,200 years ago. The word algorithm — what was it originally?',
              zh:'大约1200年前的巴格达。algorithm这个词原本是什么？' } },
    { art: svg(
        stick(60,80,1.15,C.blue)
        +paper(90,45,80,50)
        +txt(130,74,20,C.ink,'?')
        +arrow(130,100,130,118,C.gold,3)
        +txt(130,132,17,C.red,'algorithm')),
      text: { ko:'수학자 알콰리즈미의 이름이 라틴어로 옮겨지면서 algorithm이 되었대요.',
              en:"A mathematician's name, Al-Khwarizmi, was rendered into Latin as Algoritmi — algorithm.",
              zh:'数学家花拉子米的名字被译成拉丁语，就成了algorithm这个词。' } },
    { art: svg(
        paper(30,20,60,40)
        +txt(60,45,15,C.ink,'al-jabr')
        +arrow(94,40,120,40,C.gold,3)
        +txt(155,45,17,C.blue,'algebra')
        +stick(60,100,1.1,C.blue)
        +'<rect x="100" y="80" width="70" height="40" rx="4" fill="'+C.mist+'" stroke="'+C.sub+'" stroke-width="2"/>'
        +'<line x1="123" y1="80" x2="123" y2="120" stroke="'+C.sub+'" stroke-width="1.5"/>'
        +'<line x1="147" y1="80" x2="147" y2="120" stroke="'+C.sub+'" stroke-width="1.5"/>'),
      text: { ko:'그의 책 속 낱말 al-jabr는 algebra가 됐고, 인도에서 배운 격자 계산법도 함께 전했어요.',
              en:'A word from his book, al-jabr, became algebra — and he passed on a grid method learned from India too.',
              zh:'他书中的al-jabr一词变成了algebra，他还传下了从印度学来的格子算法。' } },
    { art: svg(
        '<rect x="30" y="30" width="60" height="40" fill="none" stroke="'+C.ink+'" stroke-width="2"/>'
        +'<line x1="60" y1="30" x2="60" y2="70" stroke="'+C.ink+'" stroke-width="1.5"/>'
        +'<line x1="30" y1="50" x2="90" y2="50" stroke="'+C.ink+'" stroke-width="1.5"/>'
        +'<line x1="30" y1="30" x2="60" y2="50" stroke="'+C.sub+'" stroke-width="1"/>'
        +'<line x1="60" y1="30" x2="90" y2="50" stroke="'+C.sub+'" stroke-width="1"/>'
        +txt(120,55,20,C.gold,'234×56')
        +arrow(120,70,120,95,C.gold,3)
        +txt(120,115,26,C.ok,'13104')),
      text: { ko:'그 격자가 오늘날 우리가 그리는 격자 곱셈법 — 234×56=13104를 함께 풀어요!',
              en:"That very grid is the grid multiplication we draw today — solving 234×56=13104!",
              zh:'那正是我们今天画的格子乘法——一起算出234×56=13104！' } },
  ]};
};
