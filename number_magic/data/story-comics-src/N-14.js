/* N-14 — 산가지와 규칙(2026-10-06 다시 그림). 유닛 story 그대로: 처음엔 막대를 늘어놓아 세었고(로마 Ⅰ Ⅱ Ⅲ),
   중국은 붉은 산가지를 더하는 수·검은 산가지를 빼는 수로 썼다. 뒤 두 컷은 유닛 rule(묶음 5부터, 화살표 규칙).
   그림 속 글자는 숫자·Ⅰ Ⅱ Ⅲ·+1 뿐. */
'use strict';
module.exports=function(H){
  const {C,svg,meadow,scribe,sage,tallyMarks,paper,txt,arrow}=H;
  const rod=(x,y,col,len)=>'<rect x="'+(x-3)+'" y="'+(y-(len||40))+'" width="6" height="'+(len||40)+'" rx="3" fill="'+col+'" stroke="'+C.ink+'" stroke-width="1.6"/>';
  const box=(x,y,n,hi)=>'<rect x="'+(x-15)+'" y="'+(y-15)+'" width="30" height="30" rx="6" fill="'+(hi?C.goldbright:'#fff')+'" stroke="'+C.blue+'" stroke-width="2.4"/>'+txt(x,y+6,16,C.ink,n);
  return { panels:[
    { art: svg(meadow(118)+scribe(40,88,1)+rod(96,114,C.soil)+rod(112,114,C.soil)+rod(128,114,C.soil)
        +txt(150,40,14,C.sub,'Ⅰ')+txt(166,40,14,C.sub,'Ⅱ')+txt(186,40,14,C.sub,'Ⅲ')),
      text:{ ko:'연필도 종이도 없던 시절, 사람들은 막대를 하나씩 늘어놓아 수를 셌어요. 로마의 Ⅰ, Ⅱ, Ⅲ도 막대 모양이에요.',
             en:'Before pencils and paper, people laid out sticks one by one to count. Roman Ⅰ, Ⅱ, Ⅲ look like sticks too.',
             zh:'没有铅笔和纸的时候，人们一根根摆小棍来数数。罗马的Ⅰ、Ⅱ、Ⅲ也像小棍。' } },
    { art: svg(meadow(118)+sage(36,88,1)+rod(86,108,C.red)+rod(100,108,C.red)+rod(114,108,C.red)
        +rod(148,108,C.ink)+rod(162,108,C.ink)+txt(100,50,18,C.red,'+')+txt(155,50,18,C.ink,'−')),
      text:{ ko:'중국에서는 막대를 산가지라고 했어요. 붉은 산가지는 더하는 수, 검은 산가지는 빼는 수로 나눠 썼대요.',
             en:'In China the sticks were called counting rods. Red rods stood for numbers to add, black rods for numbers to take away.',
             zh:'在中国，小棍叫算筹。红色算筹表示加的数，黑色算筹表示减的数。' } },
    { art: svg(paper(24,30,152,80)+tallyMarks(52,92,8,40)+txt(154,84,24,C.red,'8')),
      text:{ ko:'탤리는 묶음부터 세면 빨라요. 다섯 묶음 하나에 낱개 셋, 5와 3을 모으면 8이에요.',
             en:'Count tallies by the bundle first — it is faster. One bundle of five and three more: 5 and 3 make 8.',
             zh:'计数符号先数一捆，数得快。一捆5道再加3道，5和3合起来是8。' } },
    { art: svg(box(30,70,'5')+box(80,70,'6')+box(130,70,'7')+box(180,70,'?',true)
        +arrow(46,70,62,70,C.gold,3)+arrow(96,70,112,70,C.gold,3)+arrow(146,70,162,70,C.gold,3)
        +txt(55,52,11,C.ok,'+1')+txt(105,52,11,C.ok,'+1')+txt(155,52,11,C.ok,'+1')),
      text:{ ko:'화살표는 규칙을 보여 줘요. 5, 6, 7… 한 칸마다 1씩 커지니 다음은 8이에요.',
             en:'The arrows show the rule. 5, 6, 7… each step adds 1, so the next one is 8.',
             zh:'箭头告诉我们规则。5、6、7……每走一格大1，下一个就是8。' } },
  ]};
};
