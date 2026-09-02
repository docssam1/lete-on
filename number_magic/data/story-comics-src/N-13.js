/* N-13 — 스티커 색깔 추리 (수 퍼즐과 추론) */
'use strict';
module.exports=function(H){
  const {C,svg,stick,sheep,pouch,arrow,paper,bubble,txt,ground}=H;
  const person=(x,y,col,unknown)=>{
    const head=unknown
      ? '<circle cx="'+x+'" cy="'+(y-14)+'" r="4" fill="none" stroke="'+C.gold+'" stroke-width="2" stroke-dasharray="2 2"/>'
      : '<circle cx="'+x+'" cy="'+(y-14)+'" r="4" fill="'+col+'"/>';
    return '<rect x="'+(x-8)+'" y="'+(y-6)+'" width="16" height="26" rx="6" fill="#fff" stroke="'+C.ink+'" stroke-width="2"/>'
      +'<circle cx="'+x+'" cy="'+(y-14)+'" r="9" fill="#fff" stroke="'+C.ink+'" stroke-width="2"/>'+head;
  };
  const box=(x,y,label,col)=>'<rect x="'+(x-11)+'" y="'+(y-11)+'" width="22" height="22" rx="4" fill="'+(col||C.paper)+'" stroke="'+C.blue+'" stroke-width="2"/>'+txt(x,y+5,12,C.ink,label);
  return { panels:[
    { art: svg(
        person(40,90,C.blue)+person(100,90,C.red)+person(160,90,null,true)
        +txt(160,55,14,C.gold,'?')),
      text:{ ko:'친구 셋이 한 줄로 서서 머리에 스티커를 붙였어요. 빨강 셋 파랑 둘 중 하나씩요.',
             en:'Three friends stand in a line, each with a sticker on their head — from three red and two blue.',
             zh:'三个小朋友排成一列，头上各贴一张贴纸——红色三张、蓝色两张里选。' } },
    { art: svg(
        person(40,90,C.blue)+person(100,90,C.red)+person(160,90,null,true)
        +bubble(40,48,20,14,40,70)+txt(40,52,16,C.ink,'?')),
      text:{ ko:'맨 뒤 친구가 "모르겠다"고 말했어요. 그런데 이 말도 힌트가 된대요!',
             en:'The friend at the back said "I don\'t know." But even that answer is a clue!',
             zh:'最后面的小朋友说"不知道"。可是这句话也是一条线索！' } },
    { art: svg(
        '<circle cx="60" cy="55" r="9" fill="'+C.blue+'"/>'
        +'<circle cx="90" cy="55" r="9" fill="'+C.blue+'"/>'
        +'<line x1="45" y1="40" x2="105" y2="70" stroke="'+C.red+'" stroke-width="3"/>'
        +'<line x1="105" y1="40" x2="45" y2="70" stroke="'+C.red+'" stroke-width="3"/>'
        +arrow(118,55,150,55,C.gold,3)
        +'<circle cx="172" cy="55" r="9" fill="'+C.red+'"/>'),
      text:{ ko:'앞 두 친구가 둘 다 파랑이었다면 맨 뒤 친구는 바로 빨강인 걸 알았겠죠. 모른다니 그건 아니에요!',
             en:'If the two in front were both blue, the one at the back would know they were red at once. Not knowing rules that out!',
             zh:'如果前面两人都是蓝色，最后面的人立刻就知道自己是红色。说不知道，就排除了这种情况！' } },
    { art: svg(
        person(70,90,null,true)
        +'<path d="M 58 66 L 66 76 L 84 52" fill="none" stroke="'+C.ok+'" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'
        +box(160,46,'2')+box(160,94,'3')+box(136,70,'1')+box(184,70,'4')),
      text:{ ko:'맨 앞 친구는 이렇게 힌트를 모아 답을 알아냈어요. 오늘 우리 십자 퍼즐도 힌트로 빈 칸을 찾아요!',
             en:'The friend in front worked it out by gathering clues just like this. Our cross puzzle finds the blank the same way!',
             zh:'最前面的小朋友就这样收集线索猜出了答案。我们今天的十字谜题也是靠线索找出空格！' } },
  ]};
};
