/* H-08 — 제단의 부피를 두 배로 만들라는 신탁 */
'use strict';
module.exports = function(H){
  const {C,svg,stick,arrow,paper,bubble,txt,ground}=H;
  function cube(x,y,s,col){
    col=col||C.gold;
    return '<g transform="translate('+x+','+y+') scale('+s+')" stroke="'+col+'" stroke-width="2" fill="none">'
      +'<rect x="-14" y="-4" width="28" height="24"/>'
      +'<polygon points="-14,-4 -6,-16 22,-16 14,-4"/>'
      +'<polygon points="14,-4 22,-16 22,8 14,20"/></g>';
  }
  return { panels:[
    { art: svg(
        ground(122)
        +'<line x1="30" y1="122" x2="30" y2="60" stroke="'+C.sub+'" stroke-width="3"/>'
        +'<line x1="170" y1="122" x2="170" y2="60" stroke="'+C.sub+'" stroke-width="3"/>'
        +'<polygon points="20,60 180,60 165,44 35,44" fill="none" stroke="'+C.sub+'" stroke-width="2.5"/>'
        +cube(100,95,1.3)
        +bubble(140,35,34,18,110,50)
        +txt(140,40,16,C.red,'×2')),
      text: { ko:'신전 제단의 부피를 두 배로 만들라는 명령이 내려왔어요.',
              en:'The order came: double the volume of the stone altar.',
              zh:'神谕降下命令：把石祭坛的体积加倍。' } },
    { art: svg(
        cube(60,90,1.1)
        +arrow(90,90,120,90,C.gold,3)
        +cube(160,90,1.9)
        +txt(60,55,14,C.blue,'n')
        +txt(160,45,14,C.red,'2n')),
      text: { ko:'사람들은 각 변의 길이를 그냥 두 배로 늘렸어요. n을 2n으로요.',
              en:'People simply doubled every edge — turning n into 2n.',
              zh:'人们把每条边都直接加长一倍，让n变成2n。' } },
    { art: svg(
        [0,1].map(r=>[0,1].map(c=>cube(55+c*45,55+r*38,0.75)).join('')).join('')
        +txt(170,75,30,C.red,'×8')),
      text: { ko:'그런데 변이 2배면 부피는 2×2×2=8배! 여덟 개의 작은 제단이 되어버렸죠.',
              en:'But double the edge and the volume goes 2×2×2=8 times — eight little altars appeared!',
              zh:'可边长翻倍，体积却是2×2×2=8倍！结果变成了八个小祭坛。' } },
    { art: svg(
        cube(60,80,1.3,C.blue)
        +txt(60,120,15,C.blue,'2³=8')
        +arrow(105,80,135,80,C.gold,2.5)
        +cube(160,60,1.5,C.purple)
        +txt(160,120,15,C.purple,'n³')),
      text: { ko:'변을 키운 만큼 세제곱으로 커지는 것 — 그게 이번 유닛의 핵심 마법이에요!',
              en:'Growth by the cube of the edge — that\'s the core magic of this unit!',
              zh:'边长变化会以立方的速度放大——这正是本单元的核心魔法！' } },
  ]};
};
