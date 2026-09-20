/* T-FR1 — 분수 알기 · 현의 길이를 분수로 누르면 음이 바뀐다 */
'use strict';
module.exports=function(H){
  const {C,svg,arrow,txt,numi}=H;
  /* 팽팽한 줄 하나 — 양 끝 기둥 + 줄. 누르는 자리는 x로 준다 */
  const string=(y,press)=>
    '<rect x="18" y="'+(y-16)+'" width="7" height="32" rx="2" fill="'+C.brown+'"/>'
    +'<rect x="175" y="'+(y-16)+'" width="7" height="32" rx="2" fill="'+C.brown+'"/>'
    +'<line x1="25" y1="'+y+'" x2="175" y2="'+y+'" stroke="'+C.ink+'" stroke-width="3"/>'
    +(press?'<circle cx="'+press+'" cy="'+y+'" r="6" fill="'+C.red+'"/>':'');
  return { panels:[
    { art: svg(
        string(70)
        +txt(100,44,17,C.blue,'1')
        +'<line x1="25" y1="96" x2="175" y2="96" stroke="'+C.blue+'" stroke-width="2"/>'
        +txt(100,122,20,C.ink,'do')
        +numi(160,118,0.75)),
      text:{ ko:'줄을 팽팽히 매고 튕기면 소리가 나요. 이 줄 전체가 낼 소리를 도라고 해 봅시다.',
             en:'Pull a string tight, pluck it, and it sings. Let the whole string be the note do.',
             zh:'把弦拉紧一拨就响。就把整根弦发出的音当作do。' } },
    { art: svg(
        string(58,100)
        +'<line x1="25" y1="84" x2="100" y2="84" stroke="'+C.red+'" stroke-width="3"/>'
        +txt(62,108,19,C.red,'1')
        +'<line x1="50" y1="114" x2="74" y2="114" stroke="'+C.red+'" stroke-width="2"/>'
        +txt(62,132,19,C.red,'2')
        +txt(150,112,26,C.grey,'?')),
      text:{ ko:'이번엔 한가운데를 손가락으로 누르고 튕겨요. 울리는 줄은 딱 절반, 1/2이 됐어요.',
             en:'Now press the exact middle and pluck. The part that rings is exactly half of the string — one half.',
             zh:'这次按住正中间再拨。振动的只有一半弦长，也就是二分之一。' } },
    { art: svg(
        string(62,100)
        +'<line x1="25" y1="86" x2="100" y2="86" stroke="'+C.red+'" stroke-width="3"/>'
        +arrow(100,104,100,122,C.gold,3)
        +txt(62,134,19,C.ok,'do')
        +txt(150,50,17,C.blue,'×2')),
      text:{ ko:'다시 도가 나요! 줄이 반이 되면 떨리는 횟수가 두 배가 돼서, 한 옥타브 높은 도가 됩니다.',
             en:'It is do again! Halve the string and it vibrates twice as fast, so the note is do one octave higher.',
             zh:'又是do！弦长减半，振动快一倍，于是就成了高八度的do。' } },
    { art: svg(
        string(58,125)
        +'<line x1="25" y1="82" x2="125" y2="82" stroke="'+C.ok+'" stroke-width="3"/>'
        +txt(74,108,19,C.ok,'2')
        +'<line x1="62" y1="114" x2="86" y2="114" stroke="'+C.ok+'" stroke-width="2"/>'
        +txt(74,130,19,C.ok,'3')
        +txt(155,110,20,C.ink,'sol')),
      text:{ ko:'2/3 지점을 누르면 솔이 나요. 음계의 이름은 사실 분수의 이름이었던 거예요!',
             en:'Press at two thirds and out comes sol. The names of the scale were the names of fractions all along!',
             zh:'按在三分之二处就出来sol。原来音阶的名字，一直都是分数的名字！' } },
  ]};
};
