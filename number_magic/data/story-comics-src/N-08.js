/* N-08 — 수 기계와 매직 퍼즐(2026-10-06 다시 그림). 1~3컷의 별(12자리·6줄)은 check-star-topology 가 hero 그림과 좌표를
   대조하므로 기하는 그대로 두고, 아이와 수 카드·합 표시로 이야기를 입혔다. 예시 답은 넣지 않는다(빈 자리 그대로).
   그림 속 글자는 숫자와 = 기호뿐. */
'use strict';
module.exports=function(H){
  const {C,svg,txt,girl,boy,numi}=H;
  const nodes=[[100,12],[40,41],[160,41],[40,99],[160,99],[100,128],
    [80,41],[120,41],[60,70],[140,70],[80,99],[120,99]];
  const lines=[[1,6,7,2],[3,10,11,4],[0,6,8,3],[0,7,9,4],[1,8,10,5],[2,9,11,5]];
  const star=(highlight=-1)=>'<g data-star="twelve-spots">'+lines.map((line,i)=>{
    const a=nodes[line[0]],b=nodes[line[3]];
    return '<line data-star-line="'+i+'" x1="'+a[0]+'" y1="'+a[1]+'" x2="'+b[0]+'" y2="'+b[1]+'" stroke="'+(i===highlight?C.gold:C.blue)+'" stroke-width="'+(i===highlight?5:2)+'" stroke-linecap="round"/>';
  }).join('')+nodes.map((p,i)=>'<circle data-star-node="'+i+'" cx="'+p[0]+'" cy="'+p[1]+'" r="7" fill="'+C.cream+'" stroke="'+C.blue+'" stroke-width="1.5"/>').join('')+'</g>';
  const card=(x,y,n)=>'<rect x="'+(x-8)+'" y="'+(y-8)+'" width="16" height="16" rx="3" fill="#fff" stroke="'+C.gold+'" stroke-width="1.6"/>'
    +'<text x="'+x+'" y="'+(y+4)+'" text-anchor="middle" font-size="9" font-weight="800" fill="'+C.ink+'">'+n+'</text>';
  const ball=(x,y,n,col)=>'<circle cx="'+x+'" cy="'+y+'" r="11" fill="'+(col||C.goldbright)+'" stroke="'+C.ink+'" stroke-width="2"/><ellipse cx="'+(x-4)+'" cy="'+(y-4)+'" rx="3" ry="1.8" fill="#fff" opacity=".7"/>'
    +'<text x="'+x+'" y="'+(y+5)+'" text-anchor="middle" font-size="13" font-weight="800" fill="'+C.ink+'">'+n+'</text>';
  return { panels:[
    { art: svg(star()+girl(16,102,0.6)+numi(184,104,0.6)),
      text:{ ko:'별 모양에 자리가 열두 개 있어요. 1부터 12까지 놓아 어느 줄을 더해도 26이 되게 할 수 있을까요?',
             en:'The star has twelve spots. Can we place 1 to 12 so that every line adds up to 26?',
             zh:'星形上有十二个位置。能把1到12放进去，让每条线相加都是26吗？' } },
    { art: svg('<g transform="translate(4,8) scale(0.84)">'+star()+'</g>'
        +[1,2,3,4,5,6,7,8,9,10,11,12].map((n,i)=>card(164+(i%2)*20,14+Math.floor(i/2)*20,n)).join('')),
      text:{ ko:'수 카드 1부터 12까지를 별의 열두 자리에 하나씩 놓아 보아요. 한 자리에 카드 하나씩!',
             en:'Place the number cards 1 to 12 into the twelve spots, one card per spot.',
             zh:'把1到12的数字卡片逐一放进星形的十二个位置，每个位置一张！' } },
    { art: svg('<g transform="translate(4,8) scale(0.84)">'+star(0)+'</g>'
        +txt(176,48,15,C.gold,'= 26')),
      text:{ ko:'금빛 줄처럼 한 줄에는 자리가 네 개예요. 여섯 줄 모두 네 수의 합이 26인지 하나씩 따라가 봐요.',
             en:'Like the gold line, each line has four spots. Follow all six lines and check that each four-number sum is 26.',
             zh:'像金色这条线一样，每条线上有四个位置。沿着六条线逐一看，四个数的和是不是都等于26。' } },
    { art: svg('<path d="M 0 140 L 0 112 Q 100 106 200 112 L 200 140 Z" fill="'+C.grass+'" opacity=".55"/>'
        +'<path d="M 82 30 L 118 30 L 110 44 L 90 44 Z" fill="'+C.gold+'" stroke="'+C.ink+'" stroke-width="2" stroke-linejoin="round"/>'
        +'<rect x="70" y="44" width="60" height="54" rx="9" fill="'+C.blue+'" stroke="'+C.ink+'" stroke-width="2.4"/>'
        +'<rect x="78" y="52" width="44" height="22" rx="5" fill="'+C.bluedeep+'"/>'+txt(100,69,15,'#fff','+2')
        +'<circle cx="86" cy="86" r="4" fill="'+C.goldbright+'" stroke="'+C.ink+'" stroke-width="1.4"/><circle cx="100" cy="86" r="4" fill="'+C.red+'" stroke="'+C.ink+'" stroke-width="1.4"/><circle cx="114" cy="86" r="4" fill="'+C.ok+'" stroke="'+C.ink+'" stroke-width="1.4"/>'
        +'<path d="M 130 82 L 150 82 L 150 92 L 130 92 Z" fill="'+C.grey+'" stroke="'+C.ink+'" stroke-width="2"/>'
        +ball(100,16,'5')+ball(166,88,'7',C.ok)+boy(30,94,0.7)),
      text:{ ko:'수 기계는 넣은 수를 규칙대로 바꿔요. 규칙이 +2인 기계에 5를 넣으면 7이 나와요. 별 퍼즐도 규칙을 먼저 찾아요.',
             en:'A number machine changes what goes in by its rule. Put 5 into a +2 machine and 7 comes out. The star puzzle also starts with finding the rule.',
             zh:'数字机器按规则改变放进去的数。往“+2”的机器里放5，出来的是7。星形谜题也要先找规则。' } },
  ]};
};
