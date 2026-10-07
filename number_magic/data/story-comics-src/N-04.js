/* N-04 — 기수법 놀이: 눈금 막대에서 다섯 묶음 탤리까지(2026-10-05 새로 그림). 캡션은 유닛 story.history 안의 사실만
   (가축 한 마리마다 막대에 눈금). 수 이름 어원 등 검증되지 않은 사실은 싣지 않는다. 그림 속 글자는 숫자 7 하나. */
'use strict';
module.exports=function(H){
  const {C,svg,meadow,fence,cloud,sunDisc,shepherd,boy,tallyStick,tallyMarks,paper,real,txt,arrow}=H;
  const hills='<path d="M 0 96 Q 40 72 84 92 Q 124 74 164 90 Q 186 82 200 88 L 200 140 L 0 140 Z" fill="#dfe7db"/>';
  return { panels:[
    { art: svg(sunDisc(176,22,10)+cloud(70,22,0.9)+hills+meadow(108)+fence(138,112,56,3)
        +shepherd(48,86,1.1)+tallyStick(80,104,40,1)+real('sheep',122,112,40)),
      text:{ ko:'옛날 사람들은 가축이 한 마리 지나갈 때마다 나무 막대에 눈금을 하나씩 새겼어요.',
             en:'Long ago, people cut one notch into a wooden stick for every animal that went by.',
             zh:'从前，每走过一头牲畜，人们就在木棍上刻一道刻痕。' } },
    { art: svg(hills+meadow(112)
        +real('sheep',32,66,32)+real('sheep',76,66,32)+real('sheep',120,66,32)+real('sheep',54,106,32)
        +arrow(132,82,150,82,C.gold,3)+tallyStick(174,124,96,4)),
      text:{ ko:'양 네 마리에 눈금 네 개. 막대만 보아도 양이 몇 마리인지 알 수 있어요.',
             en:'Four sheep, four notches. Just by looking at the stick, you know how many sheep there are.',
             zh:'四只羊，四道刻痕。只看木棍，就知道有几只羊。' } },
    { art: svg(meadow(120)+boy(34,90,0.75)+paper(78,40,108,62)+tallyMarks(98,90,5,34)),
      text:{ ko:'종이에 그을 때는 네 개를 세로로 긋고, 다섯째는 비스듬히 그어 묶어요. 한 묶음이 5예요.',
             en:'On paper, draw four lines down, then cross them with the fifth. One bundle is 5.',
             zh:'在纸上先竖着画四道，第五道斜着划过去捆起来。一捆就是5。' } },
    { art: svg(meadow(124)
        +[22,46,70,94,118,142,166].map(x=>real('apple',x+6,52,22)).join('')
        +paper(24,64,152,50)+tallyMarks(44,104,7,30)+txt(150,100,24,C.red,'7')),
      text:{ ko:'사과 일곱 개는 묶음 하나와 막대 둘 — 5와 2를 모아 7이에요. 다섯씩 묶으면 세기가 쉬워요.',
             en:'Seven apples are one bundle and two lines — 5 and 2 make 7. Bundling by fives makes counting easy.',
             zh:'七个苹果是一捆加两道——5和2合起来是7。五个一捆，数起来就容易了。' } },
  ]};
};
