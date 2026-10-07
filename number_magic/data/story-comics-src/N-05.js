/* N-05 — 생활 서수: 가게 앞 줄서기와 다람쥐의 계단(2026-10-05 새로 그림).
   같은 자리도 세는 방향에 따라 몇째가 달라지고, 계단은 아래에서부터 센다. 그림 속 글자는 숫자뿐. */
'use strict';
module.exports=function(H){
  const {C,svg,meadow,cloud,stall,real,girl,boy,txt,ring,stairs,hop,arrow}=H;
  /* 앞(가게 쪽)부터: 곰 · 소녀 · 토끼 · 소년 · 여우 */
  const queue=()=> real('bear',136,116,32)+girl(110,98,0.6)+real('rabbit',84,116,26)+boy(60,98,0.6)+real('fox',34,116,28);
  return { panels:[
    { art: svg(cloud(60,22,0.9)+meadow(116)+stall(152,116,44)+queue()+arrow(70,128,120,128,C.gold,3)),
      text:{ ko:'가게 앞에 다섯 친구가 줄을 섰어요. 가게 쪽 맨 앞에서부터 첫째, 둘째… 하고 세어요.',
             en:'Five friends line up at the shop. We count from the front, by the shop: first, second…',
             zh:'五个朋友在小店前排队。从靠店的最前面开始数：第一、第二……' } },
    { art: svg(meadow(116)+stall(152,116,44)+queue()+ring(110,82,20,C.red)
        +txt(136,58,13,C.gold,'1')+txt(110,52,14,C.red,'2')
        +txt(34,136,12,C.blue,'1')+txt(60,136,12,C.blue,'2')+txt(84,136,12,C.blue,'3')+txt(110,136,13,C.red,'4')),
      text:{ ko:'소녀는 앞에서 둘째예요. 그런데 뒤에서 세면 넷째! 어느 쪽에서 세는지가 중요해요.',
             en:'The girl is second from the front — but fourth from the back! Which end you count from matters.',
             zh:'小女孩从前面数是第二个，可从后面数是第四个！从哪一头数很重要。' } },
    { art: svg(cloud(170,24,0.8)+meadow(126)+stairs(40,126,5,26,16,true,2)+real('squirrel',105,76,26)),
      text:{ ko:'계단은 맨 아래에서부터 세어요. 다람쥐는 아래에서 셋째 계단에 앉아 있어요.',
             en:'Stairs are counted from the bottom. The squirrel sits on the third step from the bottom.',
             zh:'台阶要从最下面开始数。小松鼠坐在从下往上数的第三级台阶上。' } },
    { art: svg(meadow(126)+stairs(40,126,5,26,16,true,4)+hop(108,134,54,14)+hop(134,158,38,14)+real('squirrel',157,44,26)),
      text:{ ko:'다람쥐가 두 칸 더 올라가요. 셋째에서 넷째, 다섯째! 한 칸 오를 때마다 1씩 커져요.',
             en:'The squirrel climbs two more steps: from third to fourth, then fifth! Each step up adds 1.',
             zh:'小松鼠又往上爬了两级：从第三到第四，再到第五！每爬一级就大1。' } },
  ]};
};
