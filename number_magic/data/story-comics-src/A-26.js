/* A-26 — 옛 숫자 이름과 999의 마법(은하철도 999의 뿌리) */
'use strict';
module.exports=function(H){
  const {C,svg,stick,sheep,pouch,arrow,paper,bubble,txt,ground}=H;
  return { panels:[
    { art: svg(
        paper(20,32,160,64)
        +txt(100,60,16,C.ink,'999+1=1000')
        +txt(100,84,18,C.red,'?')),
      text: { ko:'999에 1을 더하면 1000이 돼요. 옛날엔 1000을 뭐라고 불렀을까요?',
              en:'Add 1 to 999 and you get 1,000. What did people call a thousand long ago?',
              zh:'999加1就是1000。很久以前，人们把一千叫做什么呢？' } },
    { art: svg(
        paper(30,24,140,80)
        +txt(100,68,34,C.blue,'1000')
        +txt(100,94,13,C.gold,'100 · 1000')),
      text: { ko:'옛 우리말로 1000은 즈믄, 100은 온이라 불렀어요. 지금은 한자말 백·천에 밀려 거의 안 쓰여요.',
              en:'Old Korean called a thousand jeumeun and a hundred on — words nearly pushed out today by Sino-Korean baek and cheon.',
              zh:'古时候的韩语把一千叫做jeumeun，一百叫做on——如今几乎被汉字词"百""千"取代了。' } },
    { art: svg(
        txt(50,60,22,C.grey,'999')
        +arrow(80,55,120,55,C.gold,3)
        +txt(160,60,20,C.ink,'1000-1')),
      text: { ko:'999에 1을 더해 딱 떨어지는 1000을 만드는 마법은 그때나 지금이나 같아요.',
              en:'The trick of adding 1 to 999 to land on a clean 1,000 is the same now as it was then.',
              zh:'给999加1、凑成整整1000的魔法，古今都一样。' } },
    { art: svg(
        paper(12,20,176,90)
        +txt(100,48,15,C.ink,'348+999')
        +txt(100,70,15,C.blue,'=348+1000-1')
        +txt(100,96,20,C.red,'=1347')),
      text: { ko:'그래서 348+999도 348+1000-1=1347로 순식간에 풀려요!',
              en:'So 348+999 becomes 348+1000−1=1,347, solved in a flash!',
              zh:'所以348+999也能秒解成348+1000-1=1347！' } },
  ]};
};
