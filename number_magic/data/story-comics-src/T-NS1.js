/* T-NS1 — 큰 수의 세계 · 3천5백만 명에게 다 묻지 않고도 아는 법 */
'use strict';
module.exports=function(H){
  const {C,svg,paper,txt,numi}=H;
  /* 사람 무리 — 점선 한 줄이 곧 한 줄로 선 사람들이다(점을 하나씩 찍으면 요소가 수십 개가 된다) */
  const rows=(y0,n,col)=>{
    let s='';
    for(let r=0;r<n;r++)
      s+='<line x1="24" y1="'+(y0+r*13)+'" x2="176" y2="'+(y0+r*13)+'" stroke="'+col
        +'" stroke-width="5" stroke-linecap="round" stroke-dasharray="1 10"/>';
    return s;
  };
  return { panels:[
    { art: svg(
        rows(40,5,C.grey)
        +txt(100,126,19,C.blue,'35 000 000')),
      text:{ ko:'투표할 수 있는 사람이 3천5백만 명이에요. 누가 이길지 알려면 다 물어봐야 할까요?',
             en:'Thirty-five million people can vote. To know who will win, must every one of them be asked?',
             zh:'有三千五百万人可以投票。要知道谁会赢，必须每个人都问一遍吗？' } },
    { art: svg(
        rows(40,5,C.grey)
        +'<circle cx="46" cy="40" r="4.5" fill="'+C.red+'"/><circle cx="123" cy="53" r="4.5" fill="'+C.red+'"/>'
        +'<circle cx="68" cy="66" r="4.5" fill="'+C.red+'"/><circle cx="156" cy="79" r="4.5" fill="'+C.red+'"/>'
        +'<circle cx="101" cy="92" r="4.5" fill="'+C.red+'"/>'
        +txt(100,126,19,C.red,'1 500')),
      text:{ ko:'아니에요. 골고루 뽑은 1천5백 명에게만 물어봅니다.',
             en:'No. Only fifteen hundred people, picked evenly from everywhere, are asked.',
             zh:'不用。只问从各地均匀抽出的一千五百人。' } },
    { art: svg(
        paper(18,22,164,74)
        +txt(100,48,18,C.ink,'35 000 000')
        +txt(100,72,18,C.blue,'÷ 1 500')
        +txt(84,124,21,C.red,'≈ 23 000')
        +numi(172,120,0.7)),
      text:{ ko:'2만 3천 명 가운데 한 명꼴이에요. 그 한 명이 나머지 전부를 대신 말해 주는 셈이죠.',
             en:'That is about one person in twenty-three thousand — and that one stands in for all the rest.',
             zh:'大约每两万三千人里才问一个——这一个人替其余所有人说话。' } },
    { art: svg(
        '<line x1="20" y1="86" x2="180" y2="86" stroke="'+C.grey+'" stroke-width="2"/>'
        +'<rect x="70" y="72" width="60" height="28" rx="4" fill="'+C.goldbright+'" stroke="'+C.gold+'" stroke-width="2.5"/>'
        +'<line x1="100" y1="66" x2="100" y2="106" stroke="'+C.red+'" stroke-width="3"/>'
        +txt(100,44,20,C.blue,'40.3%')
        +txt(100,62,14,C.sub,'± 2.0')
        +txt(46,122,14,C.ink,'38.3')+txt(154,122,14,C.ink,'42.3')),
      text:{ ko:'대신 오차를 꼭 같이 말해요. 40.3%에 오차 2.0%면 진짜 값은 38.3%와 42.3% 사이랍니다.',
             en:'In return the error is always stated: 40.3% with a margin of 2.0% means the true figure lies between 38.3% and 42.3%.',
             zh:'作为交换，一定要把误差一起说出来：40.3%、误差2.0%，意思是真实数值在38.3%到42.3%之间。' } },
  ]};
};
