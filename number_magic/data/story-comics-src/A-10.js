/* A-10 — 빼기 기호의 탄생(기존 손그림을 소스 파트로 이관) */
'use strict';
module.exports=function(H){
  const {C,svg,scribe,sheep,pouch,arrow,paper,bubble,txt,ground}=H;
  return { panels:[
    { art: svg(
        '<rect x="34" y="24" width="132" height="92" rx="6" fill="#fdf6e3" stroke="#C9A063" stroke-width="2.5"/>'
        +'<line x1="48" y1="44" x2="152" y2="44" stroke="#e0d6bd" stroke-width="2"/>'
        +'<line x1="48" y1="96" x2="152" y2="96" stroke="#e0d6bd" stroke-width="2"/>'
        +'<text x="100" y="78" text-anchor="middle" font-size="24" font-style="italic" fill="#1A2233" font-family="Georgia,serif">minus</text>'),
      text: { ko:'옛날 책은 "모자라다"를 라틴어로 minus라고 길게 적었어요.',
              en:'Old books wrote out the Latin word minus — meaning "less" — in full.',
              zh:'从前的书要把"不足"完整写成拉丁语minus。' } },
    { art: svg(
        scribe(36,74,1.2)
        +'<rect x="70" y="34" width="112" height="72" rx="6" fill="#fdf6e3" stroke="#C9A063" stroke-width="2.5"/>'
        +'<text x="106" y="80" text-anchor="middle" font-size="20" font-style="italic" fill="#b0b7c3" font-family="Georgia,serif" text-decoration="line-through">minus</text>'
        +'<text x="156" y="80" text-anchor="middle" font-size="24" font-weight="700" fill="#16417C" font-family="Georgia,serif">−m</text>'),
      text: { ko:'바쁜 필경사들은 점점 줄여서 −m이라고만 썼죠.',
              en:'Busy scribes shortened it more and more, down to just −m.',
              zh:'忙碌的抄写员越写越短，只剩下−m。' } },
    { art: svg(
        '<text x="60" y="84" text-anchor="middle" font-size="34" font-weight="700" fill="#b0b7c3" font-family="Georgia,serif">−m</text>'
        +'<path d="M 92 74 L 128 74 M 120 66 L 128 74 L 120 82" fill="none" stroke="#C9A063" stroke-width="3" stroke-linecap="round"/>'
        +'<text x="158" y="86" text-anchor="middle" font-size="44" font-weight="800" fill="#16417C">−</text>'),
      text: { ko:'나중엔 m마저 떨어져 나가고, 작대기 하나만 남았어요.',
              en:'In the end even the m fell away, leaving only the little stroke.',
              zh:'最后连m也掉了，只剩下一道小横杠。' } },
    { art: svg(
        '<rect x="56" y="20" width="88" height="104" rx="5" fill="#16417C"/>'
        +'<rect x="64" y="28" width="72" height="88" rx="3" fill="#fdf6e3"/>'
        +'<text x="100" y="58" text-anchor="middle" font-size="16" font-weight="800" fill="#1A2233">1489</text>'
        +'<text x="100" y="102" text-anchor="middle" font-size="40" font-weight="800" fill="#D9534F">−</text>'),
      text: { ko:'1489년 독일 책에 처음 등장! 빼기 기호는 스스로도 "빼기"로 만들어진 셈이에요.',
              en:'It first appeared in a German book in 1489. The minus sign was itself made by subtracting!',
              zh:'它最早出现在1489年的一本德文书里。减号本身就是"减"出来的！' } },
  ]};
};
