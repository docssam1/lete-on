/* A-07 — 가우스의 짝짓기 덧셈(끼리끼리 더하기의 뿌리) */
'use strict';
module.exports=function(H){
  const {C,svg,boy,sheep,pouch,arrow,paper,bubble,txt,ground}=H;
  return { panels:[
    { art: svg(
        paper(20,14,160,58)
        +txt(100,48,15,C.ink,'1+2+3+···+100=?','font-family="Georgia,serif"')
        +boy(100,108,1)),
      text: { ko:'200년 전, 선생님이 일곱 살 아이에게 1부터 100까지 더하면 얼마인지 물었어요.',
              en:'Two hundred years ago, a teacher asked a seven-year-old to add up everything from 1 to 100.',
              zh:'两百年前，老师让一个七岁的孩子把1加到100，看看是多少。' } },
    { art: svg(
        txt(35,30,20,C.blue,'1')
        +txt(165,30,20,C.blue,'100')
        +txt(100,30,16,C.grey,'···')
        +arrow(35,40,95,72,C.gold,3)
        +arrow(165,40,105,72,C.gold,3)
        +txt(100,94,24,C.red,'101')),
      text: { ko:'아이는 1과 100, 2와 99, 3과 98을 짝지었어요. 짝마다 합이 똑같이 101이었죠.',
              en:'The child paired 1 with 100, 2 with 99, 3 with 98 — every pair added up to the same 101.',
              zh:'孩子把1和100、2和99、3和98配成一对——每一对的和都一样，都是101。' } },
    { art: svg(
        paper(20,28,160,72)
        +txt(100,60,20,C.ink,'101 × 50')
        +txt(100,92,26,C.red,'= 5050')),
      text: { ko:'짝은 모두 50개였어요. 101×50=5050!',
              en:'There were fifty such pairs in all: 101×50=5,050!',
              zh:'一共有50对：101×50=5050！' } },
    { art: svg(
        paper(15,18,170,92)
        +txt(100,44,14,C.ink,'73+62+50+41')
        +txt(100,68,13,C.blue,'(70+60+50+40)')
        +txt(100,88,13,C.gold,'+(3+2+0+1)')
        +txt(100,108,16,C.red,'=226')),
      text: { ko:'하나씩 더하지 않고 더하기 좋은 것끼리 묶는 것 — 오늘 배우는 자리끼리 더하기와 같은 마법이에요!',
              en:"Instead of adding one at a time, group what adds up nicely — the same magic as adding tens with tens today!",
              zh:'不用一个一个加，把好加的凑成一组——这和今天学的"同位相加"是同一种魔法！' } },
  ]};
};
