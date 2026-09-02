/* M-38 — 로그의 성질 */
'use strict';
module.exports=function(H){
  const {C,svg,sheep,scholar,wig,pouch,arrow,paper,bubble,txt,ground}=H;
  return { panels:[
    { art: svg(
        paper(20,15,160,55)
        +txt(95,50,20,C.ink,'347×892')
        +txt(150,50,22,C.red,'?')
        +scholar(55,100,1.1)
        +ground(120)),
      text: { ko:'옛날 사람들은 큰 수끼리 곱하고 나누는 계산에 오랜 시간을 쏟아야 했어요.',
              en:'Long ago, multiplying and dividing large numbers took people a very long time.',
              zh:'很久以前，人们乘除大数字要花费很长时间。' } },
    { art: svg(
        wig(70,85,1.3)
        +paper(105,25,75,75)
        +txt(142,55,14,C.ink,'1550–1617')
        +txt(142,92,26,C.gold,'log')),
      text: { ko:"1550년부터 1617년까지 산 네이피어는 이 번거로움을 덜려고 '로그'를 만들었어요.",
              en:'John Napier (1550-1617) invented logarithms to ease that heavy burden.',
              zh:'生活在1550年至1617年的纳皮尔发明了对数，用来减轻这个负担。' } },
    { art: svg(
        txt(45,50,30,C.red,'×')
        +arrow(75,50,125,50,C.gold,3)
        +txt(155,50,30,C.ok,'+')
        +txt(100,100,16,C.ink,'log₂4+log₂8=log₂32')),
      text: { ko:'로그표를 쓰면 어려운 곱셈이 간단한 덧셈으로 바뀌었죠. 계산이 훨씬 빨라졌어요.',
              en:'With a log table, hard multiplication turned into simple addition — much faster.',
              zh:'用对数表，困难的乘法变成了简单的加法，计算快多了。' } },
    { art: svg(
        '<rect x="15" y="25" width="55" height="85" rx="6" fill="'+C.paper+'" stroke="'+C.ink+'" stroke-width="2.5"/>'
        +'<rect x="23" y="33" width="39" height="20" fill="'+C.mist+'" stroke="'+C.grey+'" stroke-width="1.5"/>'
        +'<circle cx="30" cy="68" r="5" fill="'+C.blue+'"/><circle cx="48" cy="68" r="5" fill="'+C.blue+'"/><circle cx="66" cy="68" r="5" fill="'+C.blue+'"/>'
        +paper(85,25,55,75)
        +'<line x1="90" y1="30" x2="135" y2="95" stroke="'+C.red+'" stroke-width="2.5"/>'
        +'<line x1="135" y1="30" x2="90" y2="95" stroke="'+C.red+'" stroke-width="2.5"/>'
        +'<circle cx="160" cy="55" r="9" fill="none" stroke="'+C.purple+'" stroke-width="2"/>'
        +'<ellipse cx="160" cy="55" rx="20" ry="8" fill="none" stroke="'+C.purple+'" stroke-width="1.5"/>'
        +'<ellipse cx="160" cy="55" rx="8" ry="20" fill="none" stroke="'+C.purple+'" stroke-width="1.5"/>'
        +txt(160,95,15,C.gold,'log')),
      text: { ko:'오늘날엔 계산기로 계산하니 로그표는 안 써도, 로그의 덧셈=곱셈 성질은 과학 곳곳에 살아있어요.',
              en:'Today calculators do the math, so no one opens a log table — but this rule still lives on in science.',
              zh:'如今用计算器计算，没人再翻对数表——但这条性质仍活跃在科学的各个角落。' } },
  ]};
};
