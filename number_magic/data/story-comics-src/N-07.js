/* N-07 — 빈 칸을 채워 찾는 10 짝꿍 (검증되지 않은 수 이름 어원은 싣지 않는다) */
'use strict';
module.exports=function(H){
  const {C,svg,arrow,txt,numi}=H;
  const frame=(x0,y0,filled)=>{ let s=''; for(let i=0;i<10;i++){
      const cx=x0+(i%5)*24, cy=y0+Math.floor(i/5)*26;
      s+='<rect x="'+(cx-11)+'" y="'+(cy-11)+'" width="22" height="22" rx="4" fill="#fff" stroke="'+C.ink+'" stroke-width="1"/>';
      if(i<filled)s+='<image href="assets/images/concepts/counting-tile.png" x="'+(cx-13)+'" y="'+(cy-13)+'" width="26" height="26"/>';
    } return s; };
  return { panels:[
    { art: svg(
        frame(28,34,8)
        +txt(174,45,20,C.ink,'8')+numi(172,103,0.9)),
      text:{ ko:'10칸 중 8칸을 채웠어요. 빈 칸은 몇 개일까요?',
             en:'8 of the 10 spaces are filled. How many are empty?',
             zh:'10格中填满了8格。还空着几格呢？' } },
    { art: svg(
        frame(28,34,8)
        +txt(100,110,20,C.ink,'8 + 2 = 10')),
      text:{ ko:'빈 칸 2개를 더 채우면 10이 돼요. 8의 10 짝꿍은 2예요!',
             en:'Fill the 2 empty spaces to make 10. The partner of 8 is 2!',
             zh:'再填满2个空格就是10。8的凑十朋友是2！' } },
    { art: svg(
        frame(28,34,9)
        +txt(100,110,20,C.ink,'9 + 1 = 10')),
      text:{ ko:'9칸을 채우면 1칸이 비어요. 9와 1을 모으면 10이에요.',
             en:'With 9 filled spaces, 1 is empty. 9 and 1 make 10.',
             zh:'填满9格，就空着1格。9和1合起来是10。' } },
    { art: svg(
        frame(28,44,7)
        +txt(100,110,20,C.ink,'7 + 3 = 10')),
      text:{ ko:'7칸을 채우면 빈 칸은 3개예요. 채운 칸과 빈 칸을 모으면 언제나 10이에요.',
             en:'With 7 filled spaces, 3 are empty. Filled and empty spaces always total 10.',
             zh:'填满7格，就空着3格。已填的格子和空格合起来总是10格。' } },
  ]};
};
