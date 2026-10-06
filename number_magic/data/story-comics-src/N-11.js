/* N-11 — 식과 숫자 카드(2026-10-06 새로 그림 — 옛 컷 "동그랗게 앉아 세기"는 유닛과 어긋났다).
   유닛 story 그대로: 별 5개 중 몇 개를 가져가 2개가 남음 → 5 − □ = 2 → 3. 등호는 한 영국 수학자가 "같은 길이의 두 줄"로.
   그림 속 글자는 숫자 카드 한 장에 한 글자. 별은 실사 소품. */
'use strict';
module.exports=function(H){
  const {C,svg,real,girl,numi,recorde,txt,arrow}=H;
  const table='<rect x="0" y="110" width="200" height="30" fill="'+C.soil+'"/><rect x="0" y="110" width="200" height="5" fill="'+C.soil2+'" opacity=".6"/>';
  const stars=(xs,y)=>xs.map(x=>real('star',x,y,22)).join('');
  const card=(x,y,ch,col)=>'<rect x="'+(x-14)+'" y="'+(y-18)+'" width="28" height="36" rx="5" fill="#fff" stroke="'+C.gold+'" stroke-width="2.2"/>'
    +'<text x="'+x+'" y="'+(y+8)+'" text-anchor="middle" font-size="20" font-weight="800" fill="'+(col||C.ink)+'">'+ch+'</text>';
  return { panels:[
    { art: svg(table+girl(26,92,0.72)+stars([84,108,132,156,180],110)+txt(132,58,22,C.ink,'5')),
      text:{ ko:'탁자 위에 별이 5개 있어요. 누미가 몇 개를 가져가기로 했어요.',
             en:'There are 5 stars on the table. Numi is going to take some of them.',
             zh:'桌上有5颗星星。努米要拿走几颗。' } },
    { art: svg(table+stars([40,64],110)+numi(156,94,0.85)+stars([138,160,182],60)+arrow(84,92,124,70,C.gold,3)+txt(52,62,22,C.ink,'2')),
      text:{ ko:'누미가 가져가고 나니 2개가 남았어요. 누미가 가져간 별은 몇 개일까요?',
             en:'After Numi took some, 2 were left. How many stars did Numi take?',
             zh:'努米拿走以后，还剩2颗。努米拿走了几颗星星？' } },
    { art: svg('<rect x="0" y="0" width="200" height="140" fill="'+C.cream+'" opacity=".35"/>'
        +card(36,70,'5')+card(68,70,'−')+card(100,70,'□',C.red)+card(132,70,'=')+card(164,70,'2')),
      text:{ ko:'숫자 카드로 식을 만들면 5 − □ = 2예요. 5에서 3을 빼야 2가 남으니 □는 3이에요.',
             en:'With number cards the problem reads 5 − □ = 2. Taking 3 from 5 leaves 2, so the box is 3.',
             zh:'用数字卡片写成算式就是5 − □ = 2。5减去3才剩2，所以□是3。' } },
    { art: svg('<path d="M 0 140 L 0 116 Q 100 110 200 116 L 200 140 Z" fill="'+C.grass+'" opacity=".55"/>'
        +recorde(44,90,1)
        +'<rect x="96" y="50" width="84" height="10" rx="5" fill="'+C.blue+'" stroke="'+C.ink+'" stroke-width="1.8"/>'
        +'<rect x="96" y="74" width="84" height="10" rx="5" fill="'+C.blue+'" stroke="'+C.ink+'" stroke-width="1.8"/>'),
      text:{ ko:'등호(=)는 오래전 영국의 한 수학자가 만들었어요. 길이가 같은 두 줄만큼 똑같은 것은 없다고 생각했대요.',
             en:'The equals sign (=) was made long ago by an English mathematician. He thought nothing is more equal than two lines of the same length.',
             zh:'等号（=）是很久以前一位英国数学家发明的。他认为没有什么比两条一样长的线更相等了。' } },
  ]};
};
