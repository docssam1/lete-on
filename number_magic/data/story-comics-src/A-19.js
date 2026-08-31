/* A-19 — 지갑 이야기를 거꾸로 풀기(반대로 채우기의 뿌리) */
'use strict';
module.exports=function(H){
  const {C,svg,stick,sheep,pouch,arrow,paper,bubble,txt,ground}=H;
  return { panels:[
    { art: svg(
        pouch(45,80,0)
        +txt(45,86,18,C.red,'?')
        +arrow(66,80,92,80,C.gold,3)
        +txt(104,86,13,C.sub,'×2')
        +arrow(116,80,142,80,C.gold,3)
        +txt(156,86,13,C.red,'-8000')),
      text: { ko:'지갑에 얼마 있었는지 몰라요. 두 배로 늘린 뒤 8000원을 내는 걸 세 번 했더니 0원이 됐어요.',
              en:'You forget what was in your wallet. Three times you doubled it, then paid 8,000 won — and ended at zero.',
              zh:'忘了钱包里原本有多少钱。做了三次：先翻倍，再付8000元——最后变成了0元。' } },
    { art: svg(
        txt(16,50,20,C.grey,'0')
        +arrow(34,50,76,50,C.gold,3)
        +txt(56,38,11,C.sub,'+8000')
        +txt(98,50,20,C.blue,'8000')
        +arrow(120,50,158,50,C.gold,3)
        +txt(139,38,11,C.sub,'÷2')
        +txt(170,50,20,C.blue,'4000')),
      text: { ko:'거꾸로 되짚어요. 끝나기 직전은 8000원, 두 배 하기 전은 4000원이었어요.',
              en:'Walk the story backwards: right before the end it was 8,000, and before doubling, 4,000.',
              zh:'倒着推：结尾之前是8000元，翻倍之前是4000元。' } },
    { art: svg(
        paper(28,26,144,80)
        +txt(100,60,15,C.ink,'4000+8000=12000')
        +txt(100,84,15,C.ink,'÷2=6000, +8000')
        +txt(100,106,20,C.red,'= 7000')),
      text: { ko:'그렇게 계속 거꾸로 이으면, 처음엔 7000원이 있었다는 걸 알 수 있어요.',
              en:'Keep tracing back and you find the wallet started with exactly 7,000 won.',
              zh:'继续这样倒着推，就能算出一开始钱包里有7000元。' } },
    { art: svg(
        txt(60,60,18,C.ink,'A-B=□')
        +arrow(96,58,124,58,C.gold,3)
        +txt(164,60,18,C.blue,'B+□=A')),
      text: { ko:'뺄셈을 거꾸로 짚어 푸는 것 — 오늘 배울 "반대로 채우기"와 똑같은 마법이에요!',
              en:'Solving by tracing backwards — that\'s the very same magic as today\'s "Reverse Fill"!',
              zh:'倒着推算——这和今天要学的"反向填空"是同一种魔法！' } },
  ]};
};
