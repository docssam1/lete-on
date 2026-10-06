/* N-03 — 몇째와 크기 비교: 동물 친구들의 줄서기(2026-10-05 새로 그림). 몇째는 한 자리, 몇 개는 전부 — 그리고 > 는 큰 쪽으로 벌어진다.
   그림 속 글자는 숫자와 > 뿐. 동물·과일은 실사 소품. */
'use strict';
module.exports=function(H){
  const {C,svg,meadow,cloud,real,girl,arrow,ring,txt}=H;
  const xs=[52,86,120,154,188], who=['rabbit','chick','bear','fox','turtle'];
  const line=()=>who.map((w,i)=>real(w,xs[i],112,w==='bear'?34:28)).join('');
  return { panels:[
    { art: svg(cloud(120,22,0.9)+meadow(112)+girl(16,92,0.62)+line()+arrow(36,122,84,122,C.gold,3)),
      text:{ ko:'동물 친구들이 한 줄로 섰어요. 왼쪽부터 세면 첫째는 토끼, 둘째는 병아리예요.',
             en:'Animal friends stand in one line. Counting from the left, the first is the rabbit and the second is the chick.',
             zh:'动物朋友们排成一行。从左边数，第一个是小兔，第二个是小鸡。' } },
    { art: svg(meadow(112)+line()+txt(52,60,14,C.gold,'1')+txt(86,60,14,C.gold,'2')+txt(120,60,16,C.red,'3')+ring(120,96,22,C.red)),
      text:{ ko:'왼쪽에서 셋째는 누구일까요? 하나, 둘, 셋 — 세다가 멈춘 곰이 셋째예요.',
             en:'Who is third from the left? One, two, three — the bear, where we stopped, is third.',
             zh:'从左边数第三个是谁？一、二、三——数到停下的小熊就是第三个。' } },
    { art: svg(meadow(118)
        +real('apple',28,104,24)+real('apple',50,104,24)+real('apple',72,104,24)
        +'<rect x="12" y="76" width="76" height="34" rx="12" fill="none" stroke="'+C.gold+'" stroke-width="3"/>'+txt(50,66,15,C.gold,'3')
        +'<line x1="100" y1="54" x2="100" y2="116" stroke="'+C.grey+'" stroke-width="2" stroke-dasharray="3 4"/>'
        +[114,133,152,171,190].map(x=>real('apple',x,104,18)).join('')+ring(152,95,12,C.red)),
      text:{ ko:'사과 3개는 세 개 모두를 말해요. 셋째 사과는 줄에서 딱 하나뿐이에요.',
             en:'Three apples means all three of them. The third apple is just one apple in the line.',
             zh:'3个苹果说的是全部三个。第三个苹果只是队伍里的那一个。' } },
    { art: svg(meadow(118)
        +real('strawberry',22,96,22)+real('strawberry',44,96,22)+real('strawberry',66,96,22)+real('strawberry',33,116,22)+real('strawberry',55,116,22)
        +real('strawberry',144,104,22)+real('strawberry',166,104,22)+real('strawberry',155,122,22)
        +txt(100,98,34,C.red,'&gt;')+txt(44,46,18,C.ink,'5')+txt(155,46,18,C.ink,'3')),
      text:{ ko:'딸기 5개와 3개를 견주어요. 입을 크게 벌린 쪽이 더 많아요. 5 > 3이에요.',
             en:'Compare 5 strawberries with 3. The wide-open side points at the bigger amount: 5 > 3.',
             zh:'比一比5个草莓和3个草莓。开口大的一边更多：5 > 3。' } },
  ]};
};
