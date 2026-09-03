/* M-15 — √ 기호의 뿌리(기존 손그림을 소스 파트로 이관) */
'use strict';
module.exports=function(H){
  const {C,svg,stick,sheep,pouch,arrow,paper,bubble,txt,ground}=H;
  return { panels:[
    { art: svg(
        '<line x1="0" y1="92" x2="200" y2="92" stroke="#C9A063" stroke-width="3"/>'
        +'<rect x="92" y="58" width="14" height="34" fill="#8a6d46"/>'
        +'<circle cx="99" cy="40" r="28" fill="#2E9E6B"/>'
        +'<path d="M 99 92 L 84 116 M 99 92 L 99 122 M 99 92 L 114 116" stroke="#8a6d46" stroke-width="3.5" stroke-linecap="round" fill="none"/>'
        +'<text x="99" y="136" text-anchor="middle" font-size="15" font-style="italic" font-weight="700" fill="#1A2233" font-family="Georgia,serif">radix</text>'),
      text: { ko:'라틴어 radix는 "뿌리"라는 뜻이에요. 제곱근을 영어로 root(뿌리)라 부르는 이유죠.',
              en:'The Latin word radix means "root" — which is exactly why we call it the square root.',
              zh:'拉丁语radix的意思是"根"。这正是平方根叫root的原因。' } },
    { art: svg(
        '<text x="100" y="96" text-anchor="middle" font-size="72" font-style="italic" fill="#16417C" font-family="Georgia,serif">r</text>'
        +'<path d="M 140 40 Q 158 30 168 44" fill="none" stroke="#C9A063" stroke-width="2.5" stroke-dasharray="4 3"/>'),
      text: { ko:'radix의 첫 글자 r. 수학자들은 이 글자를 빠르게 흘려 썼는데…',
              en:'Its first letter is r. Mathematicians wrote it faster and faster, in a flowing hand …',
              zh:'radix的第一个字母是r。数学家们写得越来越快、越来越潦草……' } },
    { art: svg(
        '<text x="52" y="92" text-anchor="middle" font-size="52" font-style="italic" fill="#b0b7c3" font-family="Georgia,serif">r</text>'
        +'<path d="M 82 70 L 116 70 M 108 62 L 116 70 L 108 78" fill="none" stroke="#C9A063" stroke-width="3" stroke-linecap="round"/>'
        +'<path d="M 132 78 L 140 96 L 152 44 L 184 44" fill="none" stroke="#16417C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>'),
      text: { ko:'흘려 쓴 r이 점점 지금의 √ 모양이 됐다고 전해져요.',
              en:'That hurried r, the story goes, slowly turned into the √ sign we use today.',
              zh:'据说那个潦草的r，渐渐变成了今天的√。' } },
    { art: svg(
        '<line x1="0" y1="86" x2="200" y2="86" stroke="#C9A063" stroke-width="3"/>'
        +'<rect x="92" y="56" width="14" height="30" fill="#8a6d46"/>'
        +'<circle cx="99" cy="38" r="26" fill="#2E9E6B"/>'
        +'<text x="99" y="45" text-anchor="middle" font-size="20" font-weight="800" fill="#fff">9</text>'
        +'<path d="M 99 86 L 86 108 M 99 86 L 99 114 M 99 86 L 112 108" stroke="#8a6d46" stroke-width="3.5" stroke-linecap="round" fill="none"/>'
        +'<text x="99" y="132" text-anchor="middle" font-size="15" font-weight="800" fill="#8a6d46">3</text>'
        +'<text x="164" y="70" text-anchor="middle" font-size="17" font-weight="800" fill="#16417C">√9=3</text>'),
      text: { ko:'나무(9)를 보고 땅속의 뿌리(3)를 찾기 — 기호 하나에 이야기가 숨어 있죠!',
              en:'See the tree (9), find its root (3) underground — a whole story hides inside one symbol!',
              zh:'看见树(9)，找出地下的根(3)——一个符号里藏着一个故事！' } },
  ]};
};
