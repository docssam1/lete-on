/* N-02 — 수의 순서: 토끼의 징검다리(2026-10-05 새로 그림). 앞으로 1씩 커지고, 거꾸로 1씩 작아지고, 두 칸씩 뛰어세기.
   그림 속 글자는 돌 위의 숫자뿐. 토끼는 실사 소품(assets/images/real). */
'use strict';
module.exports=function(H){
  const {C,svg,cloud,sunDisc,water,stepStone,hop,real,girl,flower}=H;
  const bank='<path d="M 0 84 L 22 84 Q 30 110 24 140 L 0 140 Z" fill="'+C.grass+'" stroke="'+C.grass2+'" stroke-width="2"/>';
  const hills='<path d="M 0 84 Q 50 64 100 80 Q 150 62 200 78 L 200 90 L 0 90 Z" fill="#dfe7db"/>';
  const xs5=[48,82,116,150,184];
  const stones=(xs,hi)=>xs.map((x,i)=>stepStone(x,108,String(i+1),hi&&hi.includes(i+1))).join('');
  return { panels:[
    { art: svg(sunDisc(176,22,10)+cloud(60,24,0.9)+hills+water(88)+bank
        +stones(xs5)+girl(12,70,0.62)+real('rabbit',48,104,30)+flower(10,132)),
      text:{ ko:'개울에 징검돌이 놓여 있어요. 돌마다 1부터 5까지 번호가 순서대로 적혀 있지요.',
             en:'Stepping stones cross the stream. They are numbered in order, from 1 to 5.',
             zh:'小溪上摆着垫脚石，每块石头上按顺序写着1到5。' } },
    { art: svg(cloud(150,22,0.8)+hills+water(88)+bank
        +stones(xs5,[1,2,3])+hop(48,82,96,22)+hop(82,116,96,22)+real('rabbit',116,104,30)),
      text:{ ko:'토끼가 앞으로 폴짝폴짝! 1, 2, 3. 한 칸 갈 때마다 수가 1씩 커져요.',
             en:'The rabbit hops forward — 1, 2, 3. Each hop makes the number 1 bigger.',
             zh:'小兔子往前跳——1、2、3。每跳一格，数就大1。' } },
    { art: svg(cloud(46,20,0.8)+hills+water(88)+bank
        +stones(xs5,[5,4,3])+hop(184,150,96,22,C.blue)+hop(150,116,96,22,C.blue)+real('rabbit',116,104,30,true)),
      text:{ ko:'이번엔 거꾸로 돌아와요. 5, 4, 3. 한 칸 갈 때마다 1씩 작아져요.',
             en:'Now it comes back the other way — 5, 4, 3. Each hop makes the number 1 smaller.',
             zh:'这次倒着跳回来——5、4、3。每跳一格，数就小1。' } },
    { art: svg(sunDisc(26,22,9)+hills+water(88)
        +[36,64,92,120,148,176].map((x,i)=>stepStone(x,108,String(i+1),(i+1)%2===0)).join('')
        +hop(64,120,96,30)+hop(120,176,96,30)+real('rabbit',176,104,30)),
      text:{ ko:'폴짝! 두 칸씩 크게 뛰면 2, 4, 6. 이렇게 건너뛰며 세는 것을 뛰어세기라고 해요.',
             en:'Big hops, two stones at a time — 2, 4, 6. Counting like this is called skip counting.',
             zh:'一次跳两块——2、4、6。像这样跳着数，叫作跳数。' } },
  ]};
};
