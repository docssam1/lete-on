/* N-11 — 동그랗게 앉아 세는 이야기 (수 배열·이어 세기) */
'use strict';
module.exports=function(H){
  const {C,svg,stick,numi,sheep,pouch,arrow,paper,bubble,txt,ground}=H;
  const ring=(highlightIdx,xIdx)=>{ let s=''; const n=10,cx=100,cy=66,r=40;
    for(let i=0;i<n;i++){ const a=-Math.PI/2+i*(2*Math.PI/n); const x=(cx+r*Math.cos(a)).toFixed(1), y=(cy+r*Math.sin(a)).toFixed(1);
      if(i===highlightIdx) s+='<circle cx="'+x+'" cy="'+y+'" r="7" fill="'+C.goldbright+'" stroke="'+C.ink+'" stroke-width="2.4"/>';
      else if(xIdx&&xIdx.indexOf(i)>=0) s+='<circle cx="'+x+'" cy="'+y+'" r="6" fill="#fff" stroke="'+C.red+'" stroke-width="2"/>';
      else s+='<circle cx="'+x+'" cy="'+y+'" r="6" fill="'+C.sky+'" stroke="'+C.ink+'" stroke-width="2"/>';
    } return s; };
  const seqBox=(x,y,label,col)=>'<rect x="'+(x-14)+'" y="'+(y-14)+'" width="28" height="28" rx="6" fill="'+(col||C.paper)+'" stroke="'+C.blue+'" stroke-width="2.2"/>'+txt(x,y+5,15,C.ink,label);
  return { panels:[
    { art: svg(
        ring(null,null)
        +txt(100,70,20,C.ink,'?')
        +numi(32,120,0.55)),
      text:{ ko:'친구 41명이 동그랗게 앉아 셋째마다 한 명씩 빠지는 놀이를 해요. 누가 끝까지 남을까요?',
             en:'Forty-one friends sit in a circle, and every third one drops out. Who will survive to the end?',
             zh:'41个小朋友围成圈，每数到第三个就出局。谁能留到最后呢？' } },
    { art: svg(
        ring(null,[2,5,8])),
      text:{ ko:'1, 2, 3을 세다가 셋째 자리마다 한 명씩 빠져나가요.',
             en:'Counting 1, 2, 3 — every third seat drops out of the circle.',
             zh:'数着1、2、3，每到第三个位子就出局。' } },
    { art: svg(
        ring(0,null)
        +txt(100,26,15,C.gold,'31')),
      text:{ ko:'규칙대로 끝까지 세어 보면, 31번째 자리에 앉은 친구가 끝까지 남는대요!',
             en:'Count it all the way through by the rule — the friend in seat 31 is the one who stays till the end!',
             zh:'按规则一直数下去，坐在第31个位子的小朋友会留到最后！' } },
    { art: svg(
        seqBox(24,70,'3')+arrow(46,70,66,70,C.gold,3)
        +seqBox(88,70,'4')+arrow(110,70,130,70,C.gold,3)
        +seqBox(152,70,'?',C.goldbright)),
      text:{ ko:'세는 규칙이 정해지면 답도 정해져요. 오늘 우리가 빈 칸을 채우는 것도 똑같은 규칙이에요!',
             en:'When a counting rule is fixed, the answer is fixed too — filling today\'s blanks works the same way!',
             zh:'数数的规则定了，答案也就定了！我们今天填空格用的也是同一个规律！' } },
  ]};
};
