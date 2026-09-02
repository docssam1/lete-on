/* N-10 — 넘어진 곳 통계의 함정 (자료 분류와 표) */
'use strict';
module.exports=function(H){
  const {C,svg,stick,sheep,pouch,arrow,paper,bubble,txt,ground}=H;
  const bar=(x,h,col)=>'<rect x="'+x+'" y="'+(112-h)+'" width="26" height="'+h+'" fill="'+col+'" stroke="'+C.ink+'" stroke-width="2"/>';
  const clock=(x,y,r)=>'<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="#fff" stroke="'+C.ink+'" stroke-width="2.4"/>'
    +'<line x1="'+x+'" y1="'+y+'" x2="'+x+'" y2="'+(y-r*0.6)+'" stroke="'+C.ink+'" stroke-width="2"/>'
    +'<line x1="'+x+'" y1="'+y+'" x2="'+(x+r*0.4)+'" y2="'+y+'" stroke="'+C.ink+'" stroke-width="2"/>';
  return { panels:[
    { art: svg(
        ground(112)
        +bar(30,70,C.blue)+txt(43,36,14,C.ink,'7')
        +bar(90,40,C.gold)+txt(103,66,14,C.ink,'4')
        +bar(150,25,C.purple)+txt(163,81,14,C.ink,'2')),
      text:{ ko:'우리 반에서 넘어진 곳을 세어 보니 교실이 제일 많았어요.',
             en:'We counted where classmates tripped, and the classroom came out on top.',
             zh:'统计了同学们摔倒的地点，教室最多。' } },
    { art: svg(
        ground(112)
        +bar(30,70,C.red)
        +'<polygon points="43,10 54,30 32,30" fill="'+C.red+'"/>'+txt(43,27,11,'#fff','!')
        +bar(90,40,C.gold)+bar(150,25,C.purple)
        +txt(43,58,16,C.ink,'?')),
      text:{ ko:'그러면 교실이 제일 위험한 곳일까요?',
             en:'Does that mean the classroom is the most dangerous place?',
             zh:'那教室就是最危险的地方吗？' } },
    { art: svg(
        ground(112)
        +bar(30,70,C.ok)
        +clock(130,50,26)
        +arrow(64,55,100,50,C.gold,3)),
      text:{ ko:'아니에요, 교실에서 가장 오래 있었기 때문이에요. 얼마나 자주 있었는지도 함께 봐야 해요.',
             en:'No — it\'s because we spend the most time there. You have to look at how often you were there too.',
             zh:'不是，因为在教室待的时间最长。除了发生次数，还要看在那儿待了多久。' } },
    { art: svg(
        pouch(55,85,5)
        +pouch(145,85,3)
        +txt(100,88,24,C.gold,'>')),
      text:{ ko:'어른들의 통계도 똑같은 함정에 빠져요. 나눠 담고 셀 땐, 시간도 함께 생각해야 해요!',
             en:'Even grown-up statistics fall into the same trap. When you sort and count, think about time too!',
             zh:'大人的统计也会掉进同样的陷阱。分类数数的时候，也要想想时间才行！' } },
  ]};
};
