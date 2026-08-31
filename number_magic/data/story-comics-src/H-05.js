/* H-05 — 끝나지 않는 소수, 그리고 수직선의 빈틈 */
'use strict';
module.exports = function(H){
  const {C,svg,stick,numi,arrow,paper,bubble,txt,ground}=H;
  return { panels:[
    { art: svg(
        numi(50,76,1.05)
        +paper(90,45,90,55)
        +txt(135,72,20,C.ink,'1÷3')
        +arrow(135,100,135,118,C.gold,3)
        +txt(135,132,18,C.red,'0.333…')),
      text: { ko:'1을 3으로 나누면 0.333… 이 답이 영영 끝나지 않아요.',
              en:'Divide 1 by 3 and the answer is 0.333… — it never stops.',
              zh:'1除以3是0.333……这个答案永远写不完。' } },
    { art: svg(
        paper(20,20,70,44)
        +txt(55,45,18,C.ok,'1÷4')
        +txt(55,60,15,C.ok,'0.25')
        +paper(110,20,70,44)
        +txt(145,45,18,C.red,'1÷3')
        +txt(145,60,15,C.red,'0.333…')
        +bubble(100,100,50,26,100,120)
        +txt(100,105,15,C.ink,'?')
        +numi(25,110,0.65)),
      text: { ko:'1÷4는 딱 끝나는데 1÷3은 왜 안 끝날까요?',
              en:'1÷4 ends cleanly — why does 1÷3 never end?',
              zh:'1÷4能除尽，为什么1÷3不行呢？' } },
    { art: svg(
        '<line x1="16" y1="80" x2="184" y2="80" stroke="'+C.ink+'" stroke-width="2.5"/>'
        +'<polygon points="184,80 176,76 176,84" fill="'+C.ink+'"/>'
        +[0,1,2,3,4,5].map(i=>{const x=34+i*28;return '<line x1="'+x+'" y1="75" x2="'+x+'" y2="85" stroke="'+C.ink+'" stroke-width="2"/>';}).join('')
        +'<circle cx="90" cy="80" r="7" fill="none" stroke="'+C.red+'" stroke-width="2.5" stroke-dasharray="2,2"/>'
        +txt(90,58,15,C.red,'?')),
      text: { ko:'수직선을 아무리 촘촘히 봐도 채워지지 않는 빈틈이 있대요.',
              en:'No matter how closely you look, some gaps on the number line stay unfilled.',
              zh:'不管把数轴看得多细，总有些缝隙填不满。' } },
    { art: svg(
        paper(20,25,70,60)
        +txt(55,52,18,C.blue,'1÷9')
        +txt(55,72,16,C.blue,'0.111…')
        +paper(110,25,70,60)
        +txt(145,52,18,C.blue,'7÷9')
        +txt(145,72,16,C.blue,'0.777…')
        +txt(100,115,15,C.gold,'23÷99=0.2323…')),
      text: { ko:'9로 나누면 몫이 나눈 수 그대로 반복돼요 — 순환소수의 첫 번째 규칙이에요!',
              en:'Divide by 9 and the quotient just repeats the dividend — the first rule of repeating decimals!',
              zh:'除以9，商就原样重复被除数——这是循环小数的第一条规律！' } },
  ]};
};
