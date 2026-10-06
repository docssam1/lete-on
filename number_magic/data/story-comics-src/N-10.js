/* N-10 — 이야기와 자료 정리(2026-10-06 다시 그림): 섞인 과일 → 종류별로 나누기 → 세어 그림그래프 → 비교.
   유닛 rule "나눠 담고, 세고, 비교해요"를 그대로 따른다. 과일은 실사 소품. 그림 속 글자는 숫자뿐. */
'use strict';
module.exports=function(H){
  const {C,svg,real,girl,txt,ring}=H;
  const mat='<rect x="10" y="60" width="180" height="70" rx="10" fill="'+C.cream+'" stroke="'+C.gold+'" stroke-width="2.4"/>';
  const KINDS=[['apple',5],['banana',3],['strawberry',4]];
  const grid=(counts)=>{ let s='<line x1="16" y1="124" x2="190" y2="124" stroke="'+C.ink+'" stroke-width="2"/>';
    KINDS.forEach(([k],ci)=>{ const x=44+ci*56;
      for(let j=0;j<counts[ci];j++) s+=real(k,x,120-j*20,18);
      if(counts.show) s+=txt(x+20,120-(counts[ci]-1)*20-4,12,C.red,String(counts[ci])); });
    return s; };
  return { panels:[
    { art: svg(mat+girl(178,48,0.55)
        +[['apple',30,88],['banana',54,80],['strawberry',76,96],['apple',98,84],['strawberry',122,90],['apple',144,100],['banana',40,118],['apple',66,122],['strawberry',96,120],['banana',124,124],['apple',150,124],['strawberry',172,112]]
          .map(([k,x,y])=>real(k,x,y,20)).join('')),
      text:{ ko:'과일이 뒤섞여 있어요. 사과, 바나나, 딸기가 각각 몇 개인지 한눈에 알 수 있을까요?',
             en:'The fruit is all mixed up. Can you tell at a glance how many apples, bananas and strawberries there are?',
             zh:'水果混在一起。能一眼看出苹果、香蕉、草莓各有几个吗？' } },
    { art: svg('<rect x="10" y="24" width="180" height="32" rx="8" fill="'+C.cream+'" stroke="'+C.gold+'" stroke-width="2"/><rect x="10" y="62" width="180" height="32" rx="8" fill="'+C.cream+'" stroke="'+C.gold+'" stroke-width="2"/><rect x="10" y="100" width="180" height="32" rx="8" fill="'+C.cream+'" stroke="'+C.gold+'" stroke-width="2"/>'
        +[0,1,2,3,4].map(i=>real('apple',30+i*26,52,22)).join('')+[0,1,2].map(i=>real('banana',30+i*26,90,22)).join('')+[0,1,2,3].map(i=>real('strawberry',30+i*26,128,22)).join('')),
      text:{ ko:'같은 것끼리 나눠 담아요. 사과는 사과끼리, 바나나는 바나나끼리, 딸기는 딸기끼리!',
             en:'Sort them into groups: apples with apples, bananas with bananas, strawberries with strawberries!',
             zh:'同类放在一起：苹果和苹果，香蕉和香蕉，草莓和草莓！' } },
    { art: svg(grid(Object.assign([5,3,4],{show:true}))),
      text:{ ko:'종류마다 위로 하나씩 쌓아 그림그래프를 만들어요. 사과 5, 바나나 3, 딸기 4.',
             en:'Stack each kind upward, one by one, to make a picture graph: 5 apples, 3 bananas, 4 strawberries.',
             zh:'每种水果往上一个一个摞，做成图画统计图：苹果5个，香蕉3个，草莓4个。' } },
    { art: svg(grid([5,3,4])+'<rect x="28" y="18" width="32" height="108" rx="10" fill="none" stroke="'+C.gold+'" stroke-width="3"/>'+txt(74,30,14,C.gold,'5')),
      text:{ ko:'가장 높이 쌓인 것은 사과예요. 나눠 담고, 세고, 비교하면 어느 것이 많은지 바로 보여요!',
             en:'The tallest stack is the apples. Sort, count and compare, and you can see right away which there is most of!',
             zh:'摞得最高的是苹果。分一分、数一数、比一比，就能马上看出哪种最多！' } },
  ]};
};
