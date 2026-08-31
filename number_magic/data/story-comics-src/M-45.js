/* M-45 — 접선을 향한 경주(기존 손그림을 소스 파트로 이관) */
'use strict';
module.exports=function(H){
  const {C,svg,sheep,wig,pouch,arrow,paper,bubble,txt,ground}=H;
  return { panels:[
    { art: svg(
        '<path d="M 20 116 Q 100 -30 180 116" fill="none" stroke="#16417C" stroke-width="3"/>'
        +'<circle cx="100" cy="43" r="4.5" fill="#D9534F"/>'
        +'<line x1="100" y1="43" x2="100" y2="20" stroke="#4a5468" stroke-width="2"/>'
        +'<polygon points="100,20 122,25 100,32" fill="#D9534F"/>'
        +wig(38,58,1.1)),
      text: { ko:'가장 먼저 페르마가 곡선의 꼭대기와 바닥을 찾는 방법을 고안했어요 — 뉴턴보다 13년이나 앞서서요!',
              en:'Fermat was first to find the tops and bottoms of curves — a full 13 years before Newton!',
              zh:'费马最早想出找曲线顶点和谷底的方法——比牛顿早了整整13年！' } },
    { art: svg(
        '<path d="M 10 96 Q 40 84 70 96 T 130 96 T 190 96" fill="none" stroke="#16417C" stroke-width="3"/>'
        +'<path d="M 10 110 Q 40 98 70 110 T 130 110 T 190 110" fill="none" stroke="#7ea4d6" stroke-width="2.5"/>'
        +'<text x="100" y="52" text-anchor="middle" font-size="30" font-style="italic" font-weight="700" fill="#1A2233" font-family="Georgia,serif">ẋ</text>'
        +'<polygon points="168,90 184,96 168,102" fill="#16417C"/>'),
      text: { ko:'뉴턴은 "흐르는 양"의 순간 변화를 유율(fluxion)이라 부르고, 점을 찍은 ẋ로 적었어요.',
              en:'Newton called the instant change of a "flowing quantity" a fluxion, writing it with a dot: ẋ.',
              zh:'牛顿把"流动的量"的瞬时变化叫作流数，用带点的ẋ表示。' } },
    { art: svg(
        '<text x="100" y="86" text-anchor="middle" font-size="44" font-style="italic" font-weight="700" fill="#16417C" font-family="Georgia,serif">dy/dx</text>'
        +'<path d="M 30 108 Q 100 122 170 108" fill="none" stroke="#C9A063" stroke-width="2.5" stroke-dasharray="4 3"/>'),
      text: { ko:'라이프니츠는 dy/dx라는 기호를 만들었죠. 오늘 교과서에 있는 바로 그 기호예요!',
              en:'Leibniz invented the symbol dy/dx — the very notation in your textbook today!',
              zh:'莱布尼茨发明了dy/dx这个符号——正是今天课本里用的那个！' } },
    { art: svg(
        '<path d="M 20 120 Q 100 -20 180 120" fill="none" stroke="#16417C" stroke-width="3"/>'
        +'<circle cx="140" cy="66" r="4.5" fill="#D9534F"/>'
        +'<line x1="96" y1="110 " x2="184" y2="22" stroke="#D9534F" stroke-width="2.5"/>'
        +wig(38,52,1)+wig(66,52,1)
        +'<path d="M 47 44 Q 52 40 57 44" fill="none" stroke="#2E9E6B" stroke-width="2.5" stroke-linecap="round"/>'),
      text: { ko:'두 사람은 서로 다투었지만 — 우리는 오늘 두 발명을 모두 물려받아 쓰고 있답니다!',
              en:'The two men quarrelled bitterly — yet today we happily use both of their inventions!',
              zh:'两人曾激烈争论——但今天我们把他们的发明都继承下来用了！' } },
  ]};
};
