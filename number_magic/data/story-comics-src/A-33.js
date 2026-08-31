/* A-33 — 골드바흐의 풀리지 않은 질문(합과 차의 뿌리) */
'use strict';
module.exports=function(H){
  const {C,svg,stick,sheep,pouch,arrow,paper,bubble,txt,ground}=H;
  return { panels:[
    { art: svg(
        paper(14,16,172,90)
        +txt(100,42,13,C.ink,'4=2+2   6=3+3')
        +txt(100,64,13,C.ink,'8=3+5   10=5+5')
        +txt(100,92,17,C.red,'?')),
      text: { ko:'4=2+2, 6=3+3, 8=3+5, 10=5+5. 2보다 큰 짝수는 언제나 소수 둘의 합일까요?',
              en:'4=2+2, 6=3+3, 8=3+5, 10=5+5. Is every even number above 2 the sum of two primes?',
              zh:'4=2+2、6=3+3、8=3+5、10=5+5。大于2的偶数，总能写成两个质数之和吗？' } },
    { art: svg(
        stick(60,84,1.1,C.blue)
        +bubble(130,50,36,24,96,74)
        +txt(130,56,18,C.ink,'?')
        +txt(100,120,13,C.sub,'300')),
      text: { ko:'300년 전 골드바흐가 물었어요. 그 뒤로 지금까지 아무도 증명하지 못했죠.',
              en:'Goldbach asked this three hundred years ago, and no one has proved it since.',
              zh:'三百年前哥德巴赫提出了这个问题，此后至今无人证明。' } },
    { art: svg(
        paper(10,30,180,64)
        +txt(100,58,13,C.ink,'4×10¹⁸')
        +txt(100,82,22,C.ok,'✓ ✓ ✓')),
      text: { ko:'컴퓨터로 4,000,000,000,000,000,000까지 다 확인했지만 전부 맞았어요. 그래도 증명은 아니었죠.',
              en:'Computers checked every even number up to 4,000,000,000,000,000,000 — all worked. But checking isn\'t proving.',
              zh:'计算机把4,000,000,000,000,000,000以内的偶数全查了一遍，都成立——但查过不等于证明。' } },
    { art: svg(
        txt(60,55,15,C.ink,'S=18, D=4')
        +arrow(30,80,170,80,C.gold,3)
        +txt(140,55,20,C.red,'(S+D)÷2')),
      text: { ko:'초등학생도 아는 질문을 아직 못 풀었지만, 오늘처럼 합과 차를 알면 두 수를 정확히 찾아낼 수 있어요!',
              en:'The smartest minds still can\'t solve a question a child understands — but knowing a sum and difference finds two numbers exactly!',
              zh:'连最聪明的人都解不开一个小学生能懂的问题——但知道和与差，就能精确找出两个数！' } },
  ]};
};
