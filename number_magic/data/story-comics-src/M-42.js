/* M-42 — Σ(시그마) 계산 */
'use strict';
module.exports=function(H){
  const {C,svg,stick,numi,sheep,pouch,arrow,paper,bubble,txt,ground}=H;
  return { panels:[
    { art: svg(
        paper(10,10,180,60)
        +txt(100,48,15,C.ink,'1+2+3+…+100')
        +numi(100,100,1)),
      text: { ko:'1부터 100까지 더하는 식을 쓰려면 매번 숫자를 길게 늘어놓아야 했어요.',
              en:'Writing out the sum from 1 to 100 meant lining up a long row of numbers each time.',
              zh:'要写出1加到100的算式，每次都得列出一长串数字。' } },
    { art: svg(
        stick(60,90,1.1,C.blue)
        +bubble(140,50,32,20,110,75)
        +txt(140,55,24,C.ink,'S?')),
      text: { ko:'오일러는 이 긴 덧셈을 짧게 줄여 쓸 기호가 없을까 고민했어요.',
              en:'Euler wondered if there was a short symbol to stand in for that long addition.',
              zh:'欧拉想，能不能找个简短的符号来代替这一长串加法。' } },
    { art: svg(
        txt(50,60,30,C.ink,'S')
        +arrow(80,60,130,60,C.gold,3)
        +txt(160,65,34,C.blue,'Σ')
        +txt(105,105,14,C.sub,'1755')),
      text: { ko:"1755년, 오일러는 '합(Sum)'의 S에 해당하는 그리스 대문자 시그마(Σ)를 골랐어요.",
              en:'In 1755, Euler picked the Greek capital sigma (Σ), the Greek equivalent of S for Sum.',
              zh:'1755年，欧拉选择了希腊大写字母西格玛(Σ)，相当于表示"求和"的S。' } },
    { art: svg(
        '<path d="M 20 110 Q 100 50 180 110" fill="none" stroke="'+C.gold+'" stroke-width="3"/>'
        +'<path d="M 30 110 Q 100 65 170 110" fill="none" stroke="'+C.blue+'" stroke-width="3"/>'
        +'<path d="M 40 110 Q 100 80 160 110" fill="none" stroke="'+C.red+'" stroke-width="3"/>'
        +txt(100,35,15,C.ink,'Σk=n(n+1)/2')),
      text: { ko:'Σ는 새 계산이 아니라, 이미 알던 무지개 덧셈법에 붙은 새 이름표였답니다.',
              en:"Σ wasn't new math — it was just a new name tag for the rainbow-sum trick you already knew.",
              zh:'Σ不是新的计算，只是给你早就会的彩虹加法法贴上的新名牌。' } },
  ]};
};
