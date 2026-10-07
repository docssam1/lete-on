/* N-01 — 숫자가 없던 시절의 양치기. 2026-10-04 셀셰이딩 소품(sheep2·pouch2·pebble·fence·meadow)으로 다시 그림.
   사람(양치기)은 캐릭터 PNG, 나머지는 전부 원본 도형. 느낌표·구름·해·달도 글자가 아니라 그린 도형. */
'use strict';
module.exports=function(H){
  const {C,svg,sheep2,pouch2,pebble,fence,meadow,flower,sunDisc,moonDisc,cloud,star4,bang,rope,shepherd}=H;
  const hills='<path d="M 0 96 Q 40 70 84 92 Q 120 74 160 90 Q 184 80 200 88 L 200 140 L 0 140 Z" fill="#dfe7db"/>';
  return { panels:[
    { art: svg(
        sunDisc(172,24,11)+cloud(52,22,1)+cloud(116,34,0.7)+hills+meadow(108)
        +fence(8,112,52,3)
        +sheep2(88,92,0.9,false)
        +shepherd(132,86,1.1)
        +pouch2(172,126,1)
        +'<path d="M 144 98 Q 158 94 166 104" fill="none" stroke="'+C.ok+'" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="1 6"/>'
        +pebble(160,100,4.6)
        +flower(24,128)+flower(108,130,C.goldbright)),
      text: { ko:'옛날 양치기는 숫자를 몰랐어요. 양이 한 마리 나갈 때마다 조약돌 하나를 주머니에 넣었죠.',
              en:'Long ago, a shepherd knew no numbers. Each time a sheep went out, he dropped one pebble into his pouch.',
              zh:'很久以前，牧羊人不认识数字。每出去一只羊，他就往袋子里放一颗小石子。' } },
    { art: svg(
        '<path d="M 0 116 Q 50 111 100 116 T 200 116 L 200 140 L 0 140 Z" fill="'+C.grass+'" stroke="'+C.grass2+'" stroke-width="2.4"/>'
        +sheep2(36,36,0.78,false)+sheep2(100,36,0.78,false)+sheep2(164,36,0.78,false)
        +rope(38,74,50,96,C.gold,4)+rope(100,74,100,96,C.gold,0)+rope(162,74,150,96,C.gold,4)
        +pebble(50,108,7.5)+pebble(100,108,7.5)+pebble(150,108,7.5)),
      text: { ko:'양 세 마리 = 조약돌 세 개. 수를 몰라도 하나씩 짝을 지으면 돼요!',
              en:'Three sheep = three pebbles. No numbers needed — just pair them one to one!',
              zh:'三只羊＝三颗石子。不用数字，一一配对就行！' } },
    { art: svg(
        moonDisc(168,26,12)+star4(138,18,5)+star4(186,52,4)+star4(110,36,3.4)+hills+meadow(108)
        +sheep2(62,92,0.9,true)
        +shepherd(112,86,1.1)
        +pouch2(162,126,2)
        +'<path d="M 156 98 Q 146 90 128 86" fill="none" stroke="'+C.red+'" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="1 6"/>'
        +pebble(124,86,4.6)),
      text: { ko:'저녁이 되어 양이 돌아올 때마다 조약돌을 하나씩 꺼냈어요.',
              en:'In the evening, for every sheep that came home, he took one pebble back out.',
              zh:'到了傍晚，每回来一只羊，他就取出一颗石子。' } },
    { art: svg(
        cloud(150,22,0.9)+'<path d="M 120 100 Q 150 74 200 98 L 200 140 L 120 140 Z" fill="#dfe7db"/>'+meadow(116,[14,80,140,190])
        +sheep2(166,98,0.62,true)
        +pouch2(52,130,1)
        +bang(52,52,1.15)
        +flower(104,130)),
      text: { ko:'돌이 하나 남았다면? 아직 한 마리가 안 돌아온 거예요. 이것이 수 세기의 시작이었답니다!',
              en:'One pebble left? Then one sheep is still missing. That was the very beginning of counting!',
              zh:'还剩一颗石子？说明还有一只羊没回来。这就是数数的开始！' } },
  ]};
};
