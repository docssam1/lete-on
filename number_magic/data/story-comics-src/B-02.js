/* B-02 — A4 용지가 완벽하게 반으로 접히는 이유(반으로 나누기의 뿌리) */
'use strict';
module.exports=function(H){
  const {C,svg,stick,sheep,pouch,arrow,paper,bubble,txt,ground}=H;
  return { panels:[
    { art: svg(
        '<rect x="55" y="15" width="90" height="110" fill="'+C.paper+'" stroke="'+C.gold+'" stroke-width="2.5"/>'
        +txt(100,64,15,C.ink,'297×210')
        +txt(100,100,18,C.red,'?')),
      text: { ko:'A4 용지는 297×210mm예요. 왜 딱 떨어지는 300×200이 아닐까요?',
              en:'A4 paper is 297mm×210mm. Why not a tidy 300×200?',
              zh:'A4纸是297×210毫米。为什么不做成整齐的300×200？' } },
    { art: svg(
        '<rect x="55" y="15" width="90" height="110" fill="'+C.paper+'" stroke="'+C.gold+'" stroke-width="2.5"/>'
        +'<line x1="55" y1="70" x2="145" y2="70" stroke="'+C.red+'" stroke-width="2.5" stroke-dasharray="4 3"/>'
        +txt(100,50,12,C.ink,'210×148.5')
        +txt(100,100,14,C.blue,'1.414')),
      text: { ko:'반으로 자르면 210×148.5가 돼요. 가로세로 비율이 처음과 똑같이 1.414예요!',
              en:'Cut in half and you get 210×148.5 — the same 1.414 side ratio as before!',
              zh:'对折后是210×148.5——长宽比依然是1.414，和原来一样！' } },
    { art: svg(
        '<rect x="30" y="15" width="90" height="110" fill="none" stroke="'+C.gold+'" stroke-width="2.5"/>'
        +'<rect x="120" y="15" width="45" height="110" fill="none" stroke="'+C.blue+'" stroke-width="2"/>'
        +'<rect x="120" y="70" width="45" height="55" fill="none" stroke="'+C.purple+'" stroke-width="1.6"/>'
        +txt(75,132,12,C.gold,'A4')+txt(142,132,11,C.blue,'A5')+txt(142,72,10,C.purple,'A6')),
      text: { ko:'A4를 반으로 자르면 A5, 또 반으로 자르면 A6 — 모양이 끝까지 똑같고 종이도 버려지지 않아요.',
              en:'Halve A4 to get A5, halve again for A6 — the shape never changes, and no paper is wasted.',
              zh:'A4对折是A5，再对折是A6——形状始终不变，也不浪费一张纸。' } },
    { art: svg(
        '<rect x="20" y="20" width="80" height="60" fill="none" stroke="'+C.ok+'" stroke-width="2"/>'
        +'<line x1="20" y1="50" x2="100" y2="50" stroke="'+C.ok+'" stroke-width="2" stroke-dasharray="3 3"/>'
        +txt(60,98,20,C.ok,'✓')
        +'<rect x="115" y="20" width="70" height="45" fill="none" stroke="'+C.red+'" stroke-width="2"/>'
        +'<line x1="115" y1="42" x2="185" y2="42" stroke="'+C.red+'" stroke-width="2" stroke-dasharray="3 3"/>'
        +txt(150,98,20,C.red,'✗')),
      text: { ko:'300×200이었다면 자를 때마다 모양이 뭉툭해졌을 거예요. 오늘 배우는 반으로 나누기의 마법 덕분에 A4는 완벽해요!',
              en:'If it were 300×200, the shape would go stubby with every cut. Thanks to today\'s halving magic, A4 stays perfect!',
              zh:'如果是300×200，每次对折形状都会变钝。多亏了今天学的减半魔法，A4才如此完美！' } },
  ]};
};
