/* N-01 — 숫자가 없던 시절의 양치기(기존 손그림을 소스 파트로 이관) */
'use strict';
module.exports=function(H){
  const {C,svg,stick,sheep,pouch,arrow,paper,bubble,txt,ground}=H;
  return { panels:[
    { art: svg(
        '<line x1="0" y1="112" x2="200" y2="112" stroke="#C9A063" stroke-width="3"/>'
        +'<rect x="18" y="62" width="6" height="50" fill="#8a6d46"/><rect x="52" y="62" width="6" height="50" fill="#8a6d46"/>'
        +'<line x1="21" y1="70" x2="55" y2="70" stroke="#8a6d46" stroke-width="4"/>'
        +sheep(95,98,1,false)
        +stick(150,92,1.15)
        +pouch(150,120,1)
        +'<path d="M 138 92 Q 132 104 144 112" fill="none" stroke="#2E9E6B" stroke-width="2" stroke-dasharray="3 3" marker-end="none"/>'),
      text: { ko:'옛날 양치기는 숫자를 몰랐어요. 양이 한 마리 나갈 때마다 조약돌 하나를 주머니에 넣었죠.',
              en:'Long ago, a shepherd knew no numbers. Each time a sheep went out, he dropped one pebble into his pouch.',
              zh:'很久以前，牧羊人不认识数字。每出去一只羊，他就往袋子里放一颗小石子。' } },
    { art: svg(
        sheep(40,40,0.9,false)+sheep(100,40,0.9,false)+sheep(160,40,0.9,false)
        +'<line x1="40" y1="62" x2="60" y2="96" stroke="#b0b7c3" stroke-width="1.5" stroke-dasharray="3 3"/>'
        +'<line x1="100" y1="62" x2="100" y2="96" stroke="#b0b7c3" stroke-width="1.5" stroke-dasharray="3 3"/>'
        +'<line x1="160" y1="62" x2="140" y2="96" stroke="#b0b7c3" stroke-width="1.5" stroke-dasharray="3 3"/>'
        +'<circle cx="60" cy="106" r="6" fill="#4a5468"/><circle cx="100" cy="106" r="6" fill="#4a5468"/><circle cx="140" cy="106" r="6" fill="#4a5468"/>'),
      text: { ko:'양 세 마리 = 조약돌 세 개. 수를 몰라도 하나씩 짝을 지으면 돼요!',
              en:'Three sheep = three pebbles. No numbers needed — just pair them one to one!',
              zh:'三只羊＝三颗石子。不用数字，一一配对就行！' } },
    { art: svg(
        '<circle cx="170" cy="26" r="14" fill="#F5D98B"/><circle cx="164" cy="22" r="12" fill="#fdfaf3"/>'
        +'<line x1="0" y1="112" x2="200" y2="112" stroke="#C9A063" stroke-width="3"/>'
        +sheep(70,98,1,true)
        +stick(140,92,1.15)
        +pouch(140,120,2)
        +'<path d="M 152 112 Q 162 100 156 92" fill="none" stroke="#D9534F" stroke-width="2" stroke-dasharray="3 3"/>'
        +'<circle cx="158" cy="88" r="3.2" fill="#4a5468"/>'),
      text: { ko:'저녁이 되어 양이 돌아올 때마다 조약돌을 하나씩 꺼냈어요.',
              en:'In the evening, for every sheep that came home, he took one pebble back out.',
              zh:'到了傍晚，每回来一只羊，他就取出一颗石子。' } },
    { art: svg(
        '<path d="M 120 112 Q 150 78 200 104 L 200 140 L 120 140 Z" fill="#dfe7db"/>'
        +sheep(168,96,0.8,true)
        +pouch(56,100,1)
        +'<text x="56" y="60" text-anchor="middle" font-size="34" font-weight="800" fill="#D9534F">!</text>'
        +'<line x1="0" y1="126" x2="200" y2="126" stroke="#C9A063" stroke-width="3"/>'),
      text: { ko:'돌이 하나 남았다면? 아직 한 마리가 안 돌아온 거예요. 이것이 수 세기의 시작이었답니다!',
              en:'One pebble left? Then one sheep is still missing. That was the very beginning of counting!',
              zh:'还剩一颗石子？说明还有一只羊没回来。这就是数数的开始！' } },
  ]};
};
