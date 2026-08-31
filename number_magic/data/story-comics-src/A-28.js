/* A-28 — 4000년 전 파피루스와 가우스의 전설(가우스 덧셈 공식의 뿌리) */
'use strict';
module.exports=function(H){
  const {C,svg,stick,sheep,pouch,arrow,paper,bubble,txt,ground}=H;
  return { panels:[
    { art: svg(
        paper(16,26,168,72)
        +'<polygon points="100,34 70,90 130,90" fill="none" stroke="'+C.brown+'" stroke-width="2.5"/>'
        +txt(100,80,13,C.sub,'÷5')),
      text: { ko:'수열 문제 중 가장 오래된 것은 4000년 전 이집트 파피루스에 있어요. 곡물을 다섯 사람에게 나누는 문제였죠.',
              en:'The oldest known sequence problem sits on a 4,000-year-old Egyptian papyrus — sharing grain among five people.',
              zh:'已知最古老的数列问题出现在4000年前的埃及纸草书上——把谷物分给五个人。' } },
    { art: svg(
        stick(70,90,1,C.blue)
        +bubble(140,52,42,26,110,74)
        +txt(140,58,14,C.ink,'1+2+···+100')),
      text: { ko:'그로부터 오랜 세월 뒤, 어린 가우스가 1부터 100까지의 합을 몇 초 만에 구했다는 이야기가 전해져요.',
              en:'Long after, legend has it a young boy named Gauss found the sum from 1 to 100 in just seconds.',
              zh:'很久以后，据说一个叫高斯的孩子几秒内就算出了1加到100的和。' } },
    { art: svg(
        txt(35,32,17,C.blue,'1')
        +txt(165,32,17,C.blue,'100')
        +arrow(35,42,95,74,C.gold,3)
        +arrow(165,42,105,74,C.gold,3)
        +txt(100,94,22,C.red,'101')
        +txt(100,116,12,C.sub,'× 50')),
      text: { ko:'1과 100을 짝지으면 101, 2와 99도 101 — 이런 짝이 50개였어요.',
              en:'Pair 1 with 100 to get 101, 2 with 99 for another 101 — fifty such pairs in all.',
              zh:'把1和100配对得101，2和99也得101——一共有50对。' } },
    { art: svg(
        paper(18,30,164,66)
        +txt(100,60,17,C.ink,'(1+N)×N÷2')
        +txt(100,86,20,C.red,'=5050')),
      text: { ko:'101×50=5050! 오늘 배우는 (1+N)×N÷2 공식이 바로 이 마법이에요.',
              en:'101×50=5,050! Today\'s (1+N)×N÷2 formula is exactly this same trick.',
              zh:'101×50=5050！今天学的(1+N)×N÷2公式，正是这个魔法。' } },
  ]};
};
