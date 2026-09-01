/* M-40 — 등차수열 */
'use strict';
module.exports=function(H){
  const {C,svg,numi,sheep,scribe,pouch,arrow,paper,bubble,txt,ground}=H;
  return { panels:[
    { art: svg(
        paper(15,10,170,35)
        +scribe(55,95,1.1)
        +pouch(135,95,4)
        +txt(165,60,20,C.sub,'?')
        +ground(120)),
      text: { ko:'약 4,000년 전 이집트에는 곡물을 여러 사람에게 나누는 문제가 있었어요.',
              en:'About 4,000 years ago in Egypt, there was a problem: dividing grain among people.',
              zh:'大约4000年前的埃及，有一个把谷物分给几个人的问题。' } },
    { art: svg(
        ground(110)
        +'<rect x="25" y="104" width="16" height="6" fill="'+C.blue+'"/>'
        +'<rect x="55" y="95" width="16" height="15" fill="'+C.blue+'"/>'
        +'<rect x="85" y="86" width="16" height="24" fill="'+C.blue+'"/>'
        +'<rect x="115" y="77" width="16" height="33" fill="'+C.blue+'"/>'
        +'<rect x="145" y="68" width="16" height="42" fill="'+C.blue+'"/>'
        +txt(33,120,10,C.ink,'2')
        +txt(90,25,14,C.gold,'d=3')),
      text: { ko:'다섯 사람에게 곡물을 나누는데, 받는 양이 사람마다 일정하게 차이가 났대요.',
              en:'Grain was shared among five people, and each share differed by the same fixed gap.',
              zh:'谷物要分给五个人，每人所得之间的差额固定不变。' } },
    { art: svg(
        paper(45,15,115,65)
        +'<line x1="65" y1="35" x2="65" y2="45" stroke="'+C.brown+'" stroke-width="2"/>'
        +'<line x1="80" y1="35" x2="80" y2="50" stroke="'+C.brown+'" stroke-width="2"/>'
        +'<line x1="95" y1="35" x2="95" y2="42" stroke="'+C.brown+'" stroke-width="2"/>'
        +numi(150,100,0.9)
        +'<circle cx="172" cy="60" r="12" fill="none" stroke="'+C.ink+'" stroke-width="2"/>'
        +'<line x1="180" y1="69" x2="190" y2="80" stroke="'+C.ink+'" stroke-width="2.5"/>'),
      text: { ko:"이 문제는 '린드 파피루스'라는 아주 오래된 기록에 남아 있어요.",
              en:'This problem survives in a very old record called the Rhind Papyrus.',
              zh:'这个问题记录在一份很古老的文献——莱因德纸草书里。' } },
    { art: svg(
        '<rect x="20" y="90" width="14" height="30" fill="'+C.blue+'"/>'
        +'<rect x="45" y="80" width="14" height="40" fill="'+C.blue+'"/>'
        +'<rect x="70" y="70" width="14" height="50" fill="'+C.blue+'"/>'
        +arrow(80,90,112,90,C.gold,3)
        +txt(154,88,12,C.ink,'aₙ=a₁+(n-1)d')
        +ground(120)),
      text: { ko:'오늘날 등차수열은 aₙ=a₁+(n-1)d로 쓰지만, 곡식 창고가 교과서보다 먼저였답니다.',
              en:'Today we write aₙ=a₁+(n-1)d, but the grain store used it long before any textbook.',
              zh:'如今写作aₙ=a₁+(n-1)d，但粮仓用它的时间比课本早得多。' } },
  ]};
};
