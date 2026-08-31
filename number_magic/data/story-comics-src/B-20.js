/* B-20 — 지구가 정한 1미터, 두 0의 마법 */
'use strict';
module.exports=function(H){
  const {C,svg,stick,sheep,pouch,arrow,paper,bubble,txt,ground}=H;
  return { panels:[
    { art: svg(
        ground(112)
        +'<line x1="28" y1="104" x2="52" y2="60" stroke="'+C.blue+'" stroke-width="4" stroke-linecap="round"/>'
        +'<line x1="68" y1="104" x2="82" y2="72" stroke="'+C.red+'" stroke-width="4" stroke-linecap="round"/>'
        +'<line x1="100" y1="104" x2="128" y2="46" stroke="'+C.gold+'" stroke-width="4" stroke-linecap="round"/>'
        +'<line x1="146" y1="104" x2="158" y2="78" stroke="'+C.purple+'" stroke-width="4" stroke-linecap="round"/>'
        +stick(50,44,0.9)
        +txt(140,30,13,C.sub,'?')),
      text: { ko:'1미터는 누가 정했을까요? 1790년 프랑스에는 저마다 다른 자가 400종이나 있어 뒤죽박죽이었대요.',
              en:'Who decided how long one metre is? In 1790 France had some 400 different rulers, and it was chaos.',
              zh:'一米是谁定的？1790年的法国有大约400种不同的尺子，一片混乱。' } },
    { art: svg(
        '<circle cx="100" cy="150" r="86" fill="none" stroke="'+C.blue+'" stroke-width="3"/>'
        +arrow(100,64,100,20,C.gold,3)
        +'<circle cx="100" cy="20" r="4" fill="'+C.red+'"/>'
        +'<circle cx="158" cy="70" r="4" fill="'+C.ok+'"/>'
        +txt(60,34,11,C.ink,'1/10,000,000')),
      text: { ko:'그래서 북극에서 적도까지 거리의 1천만분의 1을 1 m로 정했어요.',
              en:'So one metre was set as one ten-millionth of the distance from the North Pole to the equator.',
              zh:'于是把北极到赤道距离的一千万分之一定为1米。' } },
    { art: svg(
        '<circle cx="100" cy="80" r="52" fill="none" stroke="'+C.blue+'" stroke-width="3"/>'
        +'<path d="M 100 28 A 52 52 0 0 1 152 80" fill="none" stroke="'+C.gold+'" stroke-width="4"/>'
        +txt(100,80,13,C.ink,'×4')
        +txt(100,132,13,C.red,'40,000 km')),
      text: { ko:'그러면 지구 한 바퀴는 1천만 × 4 = 4천만 m, 곧 40,000 km가 돼요.',
              en:'That makes one trip around the Earth 10,000,000 × 4 = 40,000,000 m, or 40,000 km.',
              zh:'这样绕地球一圈就是10,000,000×4=40,000,000米，也就是40,000公里。' } },
    { art: svg(
        txt(50,50,26,C.blue,'3×4')
        +arrow(50,60,50,80,C.gold,3)
        +txt(50,102,26,C.ink,'12')
        +txt(140,102,26,C.ink,'1200')
        +txt(96,102,20,C.red,'00')
        +arrow(70,102,110,102,C.gold,2.4)),
      text: { ko:'0의 개수만 세도 지구 크기가 나와요 — 30×40=1200처럼, 3×4=12에 00만 붙이면 되는 마법과 같아요!',
              en:'Just counting the zeros gives Earth\'s size — the same magic as 30×40=1200: take 3×4=12 and add two zeros!',
              zh:'数一数0就得到地球的大小——正像30×40=1200：把3×4=12后面加两个0一样！' } },
  ]};
};
