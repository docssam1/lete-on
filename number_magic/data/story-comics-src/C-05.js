/* C-05 — 홀수의 합과 가우스 덧셈 마법 */
'use strict';
module.exports=function(H){
  const {C,svg,stick,sheep,pouch,numi,arrow,paper,bubble,txt,ground}=H;
  return { panels:[
    { art: svg(
        txt(100,30,14,C.sub,'1, 1+3, 1+3+5…')
        +'<circle cx="100" cy="70" r="8" fill="'+C.blue+'"/>'
        +txt(150,74,16,C.ink,'?')
        +numi(35,105,0.75)),
      text: { ko:'홀수만 차례로 더해 보세요. 1, 1+3, 1+3+5… 어떤 모양이 자꾸 나올까요?',
              en:'Add up the odd numbers in order: 1, 1+3, 1+3+5 … what shape keeps appearing?',
              zh:'按顺序把奇数加起来：1、1+3、1+3+5……总是出现什么形状呢？' } },
    { art: svg(
        '<circle cx="80" cy="50" r="7" fill="'+C.blue+'"/>'
        +'<circle cx="100" cy="50" r="7" fill="'+C.gold+'"/>'
        +'<circle cx="100" cy="70" r="7" fill="'+C.gold+'"/>'
        +'<circle cx="80" cy="70" r="7" fill="'+C.gold+'"/>'
        +txt(140,64,15,C.ink,'1+3=4')),
      text: { ko:'점 1개에 ㄱ자로 3개를 더 두르면 2×2 정사각형이 돼요.',
              en:'Wrap one dot with an L-shaped layer of 3 more and you get a 2×2 square.',
              zh:'给1个点围上"⌐"形的3个点，就变成了2×2的正方形。' } },
    { art: svg(
        [0,1,2].map(r=>[0,1,2].map(c=>'<circle cx="'+(64+c*16)+'" cy="'+(46+r*16)+'" r="6.4" fill="'+((r<2&&c<2)?C.gold:C.red)+'"/>').join('')).join('')
        +txt(150,72,15,C.ink,'9')),
      text: { ko:'5개를 또 두르면 3×3=9. 홀수를 더할 때마다 정사각수가 되는 거예요.',
              en:'Wrap 5 more and you get 3×3=9 — every time, the sum lands on a perfect square.',
              zh:'再围上5个就是3×3=9。每加一次奇数，得到的都是平方数。' } },
    { art: svg(
        [1,2,3,98,99,100].map((n,i)=>txt(20+i*30,90,10,C.blue,n)).join('')
        +'<path d="M 20 84 Q 100 30 170 84" fill="none" stroke="'+C.gold+'" stroke-width="2"/>'
        +'<path d="M 50 84 Q 100 46 140 84" fill="none" stroke="'+C.red+'" stroke-width="2"/>'
        +txt(100,108,16,C.ok,'50×101=5050')),
      text: { ko:'양 끝을 짝지어 더해도 답이 한눈에 보여요. 이게 이 유닛의 가우스 덧셈 마법이에요!',
              en:'Pairing numbers from both ends reveals the sum at a glance — that\'s this unit\'s Gauss addition magic!',
              zh:'把首尾两两配对相加，答案一眼就能看出——这正是本单元的高斯加法魔法！' } },
  ]};
};
