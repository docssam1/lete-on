/* N-04 — 눈금 막대와 통장 이야기 (기수법 놀이) */
'use strict';
module.exports=function(H){
  const {C,svg,numi,sheep,pouch,arrow,paper,bubble,txt,ground,shepherd}=H;
  const bird=(x,y)=>'<ellipse cx="'+x+'" cy="'+y+'" rx="9" ry="7" fill="'+C.wool+'" stroke="'+C.ink+'" stroke-width="2"/>'
    +'<polygon points="'+(x+9)+','+y+' '+(x+16)+','+(y-2)+' '+(x+9)+','+(y+4)+'" fill="'+C.gold+'"/>'
    +'<circle cx="'+(x+3)+'" cy="'+(y-3)+'" r="1.4" fill="'+C.ink+'"/>';
  const sun=(x,y)=>'<circle cx="'+x+'" cy="'+y+'" r="8" fill="'+C.goldbright+'" stroke="'+C.ink+'" stroke-width="2"/>'
    +'<line x1="'+x+'" y1="'+(y-12)+'" x2="'+x+'" y2="'+(y-16)+'" stroke="'+C.gold+'" stroke-width="2"/>'
    +'<line x1="'+(x+10)+'" y1="'+y+'" x2="'+(x+14)+'" y2="'+y+'" stroke="'+C.gold+'" stroke-width="2"/>';
  return { panels:[
    { art: svg(
        ground(112)
        +sheep(55,96,0.9,false)
        +shepherd(122,88,1.1)
        +'<rect x="148" y="56" width="7" height="56" rx="2" fill="'+C.brown+'" stroke="'+C.ink+'" stroke-width="2.5"/>'
        +[0,1,2].map(i=>'<line x1="145" y1="'+(66+i*14)+'" x2="159" y2="'+(66+i*14)+'" stroke="'+C.ink+'" stroke-width="2"/>').join('')),
      text:{ ko:'옛날 사람들은 숫자를 못 썼어요. 양이 한 마리 나갈 때마다 나무 막대에 눈금 하나를 새겼죠.',
             en:'Long ago people could not write numbers. Each time a sheep went out, they cut one notch into a stick.',
             zh:'很久以前人们不会写数字。每出去一只羊，就在木棍上刻一道痕。' } },
    { art: svg(
        '<rect x="70" y="20" width="14" height="100" rx="3" fill="'+C.brown+'" stroke="'+C.ink+'" stroke-width="2.5"/>'
        +[0,1,2,3,4,5,6].map(i=>'<line x1="66" y1="'+(30+i*13)+'" x2="88" y2="'+(30+i*13)+'" stroke="'+C.ink+'" stroke-width="2"/>').join('')
        +arrow(98,90,130,90,C.gold,3)
        +pouch(160,90,3)),
      text:{ ko:'눈금이 새겨진 막대는 그 사람이 가진 것을 보여주는 통장과 같았어요.',
             en:'A stick full of notches was like a bank book, showing all that a person owned.',
             zh:'刻满痕迹的木棍就像存折，记着一个人拥有的东西。' } },
    { art: svg(
        txt(45,26,16,C.ink,'2')
        +bird(28,58)+bird(53,58)
        +txt(160,26,16,C.ink,'2')
        +sun(140,58)+sun(170,58)
        +txt(100,95,30,C.gold,'=')),
      text:{ ko:'철학자 러셀은 말했어요. 닭 두 마리의 2와 이틀의 2가 같은 수라는 걸 알기까지 수천 년이 걸렸다고요.',
             en:'The philosopher Russell said it took thousands of years to see that two chickens\' 2 and two days\' 2 are the same number.',
             zh:'哲学家罗素说过，人类花了几千年才明白两只鸡的2和两天的2是同一个数。' } },
    { art: svg(
        [0,1,2,3].map(i=>'<line x1="'+(58+i*14)+'" y1="92" x2="'+(58+i*14)+'" y2="50" stroke="'+C.blue+'" stroke-width="4" stroke-linecap="round"/>').join('')
        +'<line x1="53" y1="80" x2="115" y2="55" stroke="'+C.red+'" stroke-width="4" stroke-linecap="round"/>'
        +txt(140,75,30,C.gold,'5')
        +numi(172,100,0.9)
        +ground(112)),
      text:{ ko:'그 긴 시간이 지금 우리가 탤리 막대로 척척 세는 1, 2, 3 안에 담겨 있답니다!',
             en:'All that long time is folded into the 1, 2, 3 we count so easily with tally marks today!',
             zh:'那段漫长的时光，就藏在我们现在用计数符号轻松数出的1、2、3里！' } },
  ]};
};
