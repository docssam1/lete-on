/* M-41 — 등비수열 */
'use strict';
module.exports=function(H){
  const {C,svg,stick,sheep,pouch,arrow,paper,bubble,txt,ground}=H;
  return { panels:[
    { art: svg(
        '<rect x="20" y="50" width="45" height="45" fill="'+C.paper+'" stroke="'+C.ink+'" stroke-width="2"/>'
        +'<rect x="65" y="50" width="45" height="45" fill="'+C.mist+'" stroke="'+C.ink+'" stroke-width="2"/>'
        +'<rect x="110" y="50" width="45" height="45" fill="'+C.paper+'" stroke="'+C.ink+'" stroke-width="2"/>'
        +'<circle cx="42" cy="72" r="4" fill="'+C.gold+'"/>'
        +'<circle cx="80" cy="65" r="4" fill="'+C.gold+'"/><circle cx="95" cy="80" r="4" fill="'+C.gold+'"/>'
        +'<circle cx="122" cy="60" r="3.5" fill="'+C.gold+'"/><circle cx="140" cy="60" r="3.5" fill="'+C.gold+'"/><circle cx="122" cy="82" r="3.5" fill="'+C.gold+'"/><circle cx="140" cy="82" r="3.5" fill="'+C.gold+'"/>'
        +txt(42,112,12,C.ink,'1')+txt(87,112,12,C.ink,'2')+txt(132,112,12,C.ink,'4')),
      text: { ko:'체스판 첫 칸에 쌀 1알, 다음 칸엔 2알, 그다음 칸엔 4알을 놓기로 했어요.',
              en:'They agreed to place 1 grain of rice on the first square, 2 on the next, 4 after that.',
              zh:'他们说好在棋盘第一格放1粒米，下一格2粒，再下一格4粒。' } },
    { art: svg(
        '<rect x="15" y="55" width="45" height="40" fill="'+C.mist+'" stroke="'+C.ink+'" stroke-width="2"/>'
        +'<rect x="78" y="55" width="45" height="40" fill="'+C.mist+'" stroke="'+C.ink+'" stroke-width="2"/>'
        +'<rect x="141" y="55" width="45" height="40" fill="'+C.mist+'" stroke="'+C.ink+'" stroke-width="2"/>'
        +txt(37,80,16,C.blue,'8')+txt(100,80,16,C.blue,'16')+txt(163,80,16,C.blue,'32')
        +arrow(60,75,78,75,C.gold,2.5)+arrow(123,75,141,75,C.gold,2.5)
        +txt(69,68,9,C.sub,'×2')+txt(132,68,9,C.sub,'×2')),
      text: { ko:'한 칸씩 넘어갈 때마다 쌀알 수를 계속 두 배로 늘렸어요.',
              en:'Each square doubled the number of grains from the one before.',
              zh:'每往后一格，米粒数就翻一倍。' } },
    { art: svg(
        '<rect x="70" y="40" width="60" height="60" fill="'+C.mist+'" stroke="'+C.gold+'" stroke-width="3"/>'
        +txt(100,75,20,C.gold,'64')
        +'<circle cx="55" cy="35" r="3" fill="'+C.red+'"/><circle cx="145" cy="35" r="3" fill="'+C.red+'"/>'
        +'<circle cx="50" cy="60" r="3" fill="'+C.red+'"/><circle cx="150" cy="60" r="3" fill="'+C.red+'"/>'
        +'<circle cx="55" cy="105" r="3" fill="'+C.red+'"/><circle cx="145" cy="105" r="3" fill="'+C.red+'"/>'
        +'<circle cx="65" cy="115" r="3" fill="'+C.red+'"/><circle cx="135" cy="115" r="3" fill="'+C.red+'"/>'
        +'<line x1="70" y1="40" x2="55" y2="25" stroke="'+C.red+'" stroke-width="2"/>'
        +'<line x1="130" y1="40" x2="145" y2="25" stroke="'+C.red+'" stroke-width="2"/>'),
      text: { ko:'64번째 칸까지 채우면 나라의 곳간으로도 감당 못 할 만큼 어마어마한 수가 됐대요.',
              en:'By the 64th square, legend says the total grew too huge for any kingdom to hold.',
              zh:'填满第64格时，传说中的总数大到连一个王国的粮仓都装不下。' } },
    { art: svg(
        '<circle cx="40" cy="70" r="10" fill="'+C.blue+'"/><circle cx="100" cy="70" r="10" fill="'+C.blue+'"/><circle cx="160" cy="70" r="10" fill="'+C.blue+'"/>'
        +arrow(52,70,88,70,C.gold,3)+arrow(112,70,148,70,C.gold,3)
        +txt(100,115,15,C.ink,'aₙ=a₁×r^(n-1)')),
      text: { ko:'이렇게 같은 수를 계속 곱하는 규칙이 바로 등비수열, aₙ=a₁×r^(n-1)이에요.',
              en:'That rule — multiplying by the same number again and again — is a geometric sequence.',
              zh:'这种不断乘以同一个数的规律，就是等比数列aₙ=a₁×r^(n-1)。' } },
  ]};
};
