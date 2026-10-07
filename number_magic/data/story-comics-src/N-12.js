/* N-12 — 세 수 가르기와 양팔저울 식(2026-10-06 새로 그림, 첫 만화). 유닛 discover 그대로: 6은 1+2+3, 2+2+2…로 갈라지고,
   저울은 양쪽 합이 같을 때 수평. 무당벌레·사과는 실사 소품. 그림 속 글자는 숫자뿐. */
'use strict';
module.exports=function(H){
  const {C,svg,real,girl,txt,meadow}=H;
  const leaf=(x,y,w)=>'<ellipse cx="'+x+'" cy="'+y+'" rx="'+w+'" ry="'+(w*0.48)+'" fill="'+C.grass+'" stroke="'+C.grass2+'" stroke-width="2.4"/>'
    +'<path d="M '+(x-w+4)+' '+y+' L '+(x+w-4)+' '+y+'" stroke="'+C.grass2+'" stroke-width="1.6"/>';
  const bugs=(x,y,n)=>{ let s=''; const off=n===1?[0]:n===2?[-10,10]:n===3?[-14,0,14]:[-18,-6,6,18]; off.forEach(o=>s+=real('ladybug',x+o,y,16)); return s; };
  const scale=(left,right)=>'<rect x="94" y="62" width="12" height="54" fill="'+C.soil+'" stroke="'+C.ink+'" stroke-width="2"/><path d="M 74 120 L 126 120 L 112 108 L 88 108 Z" fill="'+C.soil+'" stroke="'+C.ink+'" stroke-width="2"/>'
    +'<rect x="26" y="56" width="148" height="7" rx="3.5" fill="'+C.gold+'" stroke="'+C.ink+'" stroke-width="2"/><circle cx="100" cy="59" r="5" fill="'+C.goldbright+'" stroke="'+C.ink+'" stroke-width="1.8"/>'
    +'<line x1="36" y1="62" x2="30" y2="88" stroke="'+C.ink+'" stroke-width="1.4"/><line x1="36" y1="62" x2="66" y2="88" stroke="'+C.ink+'" stroke-width="1.4"/>'
    +'<line x1="164" y1="62" x2="134" y2="88" stroke="'+C.ink+'" stroke-width="1.4"/><line x1="164" y1="62" x2="170" y2="88" stroke="'+C.ink+'" stroke-width="1.4"/>'
    +'<path d="M 24 88 L 72 88 Q 48 102 24 88 Z" fill="'+C.cream+'" stroke="'+C.ink+'" stroke-width="2"/><path d="M 128 88 L 176 88 Q 152 102 128 88 Z" fill="'+C.cream+'" stroke="'+C.ink+'" stroke-width="2"/>'
    +left+right;
  return { panels:[
    { art: svg(meadow(118)+girl(24,96,0.66)+leaf(122,84,56)+bugs(100,84,3)+bugs(140,92,3)+txt(122,36,22,C.ink,'6')),
      text:{ ko:'커다란 잎 위에 무당벌레가 6마리 있어요. 이 무당벌레들을 잎 세 장에 나눠 앉혀 볼까요?',
             en:'Six ladybugs sit on a big leaf. Shall we split them onto three leaves?',
             zh:'一片大叶子上有6只瓢虫。把它们分到三片叶子上好吗？' } },
    { art: svg(meadow(122)+leaf(36,92,28)+leaf(100,92,28)+leaf(164,92,28)+bugs(36,92,1)+bugs(100,92,2)+bugs(164,92,3)
        +txt(36,56,18,C.ink,'1')+txt(100,56,18,C.ink,'2')+txt(164,56,18,C.ink,'3')),
      text:{ ko:'1마리, 2마리, 3마리로 나눴어요. 셋을 모두 합하면 6마리 그대로예요.',
             en:'One, two and three ladybugs. Put all three together and it is still 6.',
             zh:'分成1只、2只、3只。三份全部合起来还是6只。' } },
    { art: svg(meadow(122)+leaf(36,92,28)+leaf(100,92,28)+leaf(164,92,28)+bugs(36,92,2)+bugs(100,92,2)+bugs(164,92,2)
        +txt(36,56,18,C.ink,'2')+txt(100,56,18,C.ink,'2')+txt(164,56,18,C.ink,'2')),
      text:{ ko:'2마리씩 나눠도 돼요. 합이 6이면 어떻게 나눠도 모두 맞아요.',
             en:'Two on each leaf works too. If the total is 6, every way of splitting is right.',
             zh:'每片叶子2只也可以。只要合起来是6，怎么分都对。' } },
    { art: svg(scale(real('apple',38,88,16)+real('apple',58,88,16)+real('apple',30,74,14)+real('apple',48,74,14)+real('apple',66,74,14)+real('apple',48,62,14),
                     real('apple',138,88,16)+real('apple',158,88,16)+real('apple',148,76,16)+real('apple',138,64,14)+real('apple',158,64,14)+real('apple',148,52,14))
        +txt(48,124,13,C.ink,'2 + 4')+txt(152,124,13,C.ink,'3 + 3')),
      text:{ ko:'양팔저울에 2개와 4개, 다른 쪽에 3개와 3개를 올렸어요. 양쪽 모두 6이라 저울이 수평이에요!',
             en:'On the scale: 2 and 4 on one side, 3 and 3 on the other. Both sides make 6, so the scale is level!',
             zh:'天平一边放2个和4个，另一边放3个和3个。两边都是6，天平平衡了！' } },
  ]};
};
