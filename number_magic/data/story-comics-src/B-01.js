/* B-01 — 체스판과 두 배의 마법(기존 손그림을 소스 파트로 이관) */
'use strict';
module.exports=function(H){
  const {C,svg,stick,sheep,pouch,arrow,paper,bubble,txt,ground}=H;
  return { panels:[
    { art: svg(
        stick(40,80,1.3)
        +'<path d="M 28 50 L 34 40 L 40 48 L 46 38 L 52 48 L 58 40 L 62 50 Z" fill="#F5D98B" stroke="#C9A063" stroke-width="2"/>'
        +stick(160,84,1.15,'#4a5468')
        +'<g transform="translate(84,92)">'
        +'<rect x="0" y="0" width="48" height="24" fill="#fff" stroke="#1A2233" stroke-width="2"/>'
        +'<rect x="0" y="0" width="12" height="12" fill="#1A2233"/><rect x="24" y="0" width="12" height="12" fill="#1A2233"/>'
        +'<rect x="12" y="12" width="12" height="12" fill="#1A2233"/><rect x="36" y="12" width="12" height="12" fill="#1A2233"/></g>'),
      text: { ko:'체스를 만든 현자에게 왕이 상을 내리려 했어요. 현자의 소원: "첫 칸에 쌀 1톨, 다음 칸마다 두 배씩만 주세요."',
              en:'A king offered a reward to the sage who invented chess. The wish: "One grain of rice on the first square, then double it on each next square."',
              zh:'国王要奖赏发明国际象棋的智者。他的愿望是："第一格放1粒米，之后每格翻一倍。"' } },
    { art: svg(
        '<g transform="translate(20,50)">'
        +'<rect x="0" y="0" width="40" height="40" fill="#fff" stroke="#1A2233" stroke-width="2"/>'
        +'<rect x="40" y="0" width="40" height="40" fill="#f1f0ec" stroke="#1A2233" stroke-width="2"/>'
        +'<rect x="80" y="0" width="40" height="40" fill="#fff" stroke="#1A2233" stroke-width="2"/>'
        +'<rect x="120" y="0" width="40" height="40" fill="#f1f0ec" stroke="#1A2233" stroke-width="2"/>'
        +'<text x="20" y="26" text-anchor="middle" font-size="15" font-weight="800" fill="#16417C">1</text>'
        +'<text x="60" y="26" text-anchor="middle" font-size="15" font-weight="800" fill="#16417C">2</text>'
        +'<text x="100" y="26" text-anchor="middle" font-size="15" font-weight="800" fill="#16417C">4</text>'
        +'<text x="140" y="26" text-anchor="middle" font-size="15" font-weight="800" fill="#16417C">8</text></g>'
        +'<text x="100" y="122" text-anchor="middle" font-size="14" font-weight="800" fill="#C9A063">×2 → ×2 → ×2</text>'),
      text: { ko:'왕은 웃으며 승낙했어요. 1, 2, 4, 8, 16… 칸마다 겨우 두 배인걸요?',
              en:'The king laughed and agreed. 1, 2, 4, 8, 16 … it is only doubling, after all?',
              zh:'国王笑着答应了。1、2、4、8、16……不过是翻倍而已嘛？' } },
    { art: svg(
        '<polyline points="16,120 44,118 72,112 100,100 128,76 156,40 180,14" fill="none" stroke="#D9534F" stroke-width="3.5" stroke-linecap="round"/>'
        +'<polygon points="180,14 168,18 174,28" fill="#D9534F"/>'
        +'<line x1="16" y1="124" x2="184" y2="124" stroke="#1A2233" stroke-width="2"/>'
        +'<circle cx="44" cy="118" r="3" fill="#16417C"/><circle cx="100" cy="100" r="3" fill="#16417C"/><circle cx="156" cy="40" r="3" fill="#16417C"/>'),
      text: { ko:'그런데 두 배는 반복될수록 무섭게 커져요. 64번째 칸에는 온 나라의 쌀을 다 모아도 모자랐대요!',
              en:'But doubling grows frighteningly fast. By the 64th square, all the rice in the kingdom was not enough!',
              zh:'可是翻倍越来越吓人。到第64格，全国的米加起来都不够！' } },
    { art: svg(
        stick(50,84,1.3)
        +'<path d="M 38 54 L 44 44 L 50 52 L 56 42 L 62 52 L 68 44 L 72 54 Z" fill="#F5D98B" stroke="#C9A063" stroke-width="2"/>'
        +'<text x="44" y="34" text-anchor="middle" font-size="22" font-weight="800" fill="#D9534F">!</text>'
        +'<polygon points="130,116 160,56 190,116" fill="#f5f1e6" stroke="#C9A063" stroke-width="2.5"/>'
        +'<polygon points="142,92 160,56 178,92" fill="#fdf6e3"/>'
        +'<text x="160" y="134" text-anchor="middle" font-size="12" font-weight="800" fill="#4a5468">2⁶³</text>'),
      text: { ko:'두 배(×2)의 반복 = 거듭제곱. 몇 번만 반복돼도 감당할 수 없이 커지는 것, 그게 이 유닛의 마법이에요!',
              en:'Repeated doubling is a power of 2. Just a few repeats and it grows beyond control — that is the magic of this unit!',
              zh:'反复翻倍就是2的乘方。重复几次就大得不得了——这正是本单元的魔法！' } },
  ]};
};
