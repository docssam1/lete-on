/* N-08 — 별 모양 수 퍼즐 (수 기계와 매직 퍼즐) */
'use strict';
module.exports=function(H){
  const {C,svg,arrow,txt}=H;
  /* Six tips + six crossings. Each straight line passes through four spots;
     each spot belongs to two lines. Blank spots are intentional, not a solution. */
  const nodes=[[100,12],[40,41],[160,41],[40,99],[160,99],[100,128],
    [80,41],[120,41],[60,70],[140,70],[80,99],[120,99]];
  const lines=[[1,6,7,2],[3,10,11,4],[0,6,8,3],[0,7,9,4],[1,8,10,5],[2,9,11,5]];
  const star=(highlight=-1)=>'<g data-star="twelve-spots">'+lines.map((line,i)=>{
    const a=nodes[line[0]],b=nodes[line[3]];
    return '<line data-star-line="'+i+'" x1="'+a[0]+'" y1="'+a[1]+'" x2="'+b[0]+'" y2="'+b[1]+'" stroke="'+(i===highlight?C.gold:C.blue)+'" stroke-width="'+(i===highlight?5:2)+'" stroke-linecap="round"/>';
  }).join('')+nodes.map((p,i)=>'<circle data-star-node="'+i+'" cx="'+p[0]+'" cy="'+p[1]+'" r="7" fill="'+C.cream+'" stroke="'+C.blue+'" stroke-width="1.5"/>').join('')+'</g>';
  return { panels:[
    { art: svg(star()),
      text:{ ko:'별 모양 자리에 1부터 12까지 수를 놓아, 어느 줄을 더해도 26이 되게 할 수 있을까요?',
             en:'Can we place the numbers 1 to 12 on a star so every line adds up to the same 26?',
             zh:'把1到12放在星形的位置上，能让每条线相加都是26吗？' } },
    { art: svg(
        txt(100,18,15,C.ink,'1, 2, 3, …, 12')
        +'<g transform="translate(16,24) scale(0.84)">'+star()+'</g>'),
      text:{ ko:'1부터 12까지 수를 별의 열두 자리에 하나씩 놓아 보아요.',
             en:'Try placing the numbers 1 through 12 into the star\'s twelve spots.',
             zh:'把1到12逐个放进星形的十二个位置试试。' } },
    { art: svg(
        txt(100,18,13,C.ink,'□ + □ + □ + □ = 26')
        +'<g transform="translate(16,24) scale(0.84)">'+star(0)+'</g>'),
      text:{ ko:'한 줄에는 수가 네 개 있어요. 여섯 줄을 하나씩 따라가며 합이 모두 26인지 확인해요.',
             en:'Each straight line has four numbers. Follow all six lines and check that every sum is 26.',
             zh:'每条直线上有四个数。沿着六条直线逐一检查，每条线的和都要是26。' } },
    { art: svg(
        '<rect x="70" y="35" width="60" height="55" rx="8" fill="'+C.blue+'" stroke="'+C.ink+'" stroke-width="2"/>'
        +txt(100,68,15,'#fff','+2')
        +arrow(30,62,68,62,C.gold,3)
        +txt(16,68,18,C.ink,'5')
        +arrow(132,62,174,62,C.gold,3)
        +txt(186,68,18,C.ink,'7')),
      text:{ ko:'수를 넣으면 규칙대로 바뀌는 수 기계처럼, 이 퍼즐도 숫자보다 규칙이 먼저였답니다.',
             en:'Just like a number machine that changes whatever you feed it, this puzzle was about the rule first, digits second.',
             zh:'就像放进数字就按规则变身的数字机器，这个谜题也是规则先于数字。' } },
  ]};
};
