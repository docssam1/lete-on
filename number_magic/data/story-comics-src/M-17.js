/* M-17 — 히파소스와 √2의 전설 */
'use strict';
module.exports=function(H){
  const {C,svg,stick,sheep,numi,pouch,arrow,paper,bubble,txt,ground}=H;
  return { panels:[
    { art: svg(
        paper(58,12,84,34)
        +txt(100,36,20,C.ink,'a/b','font-style="italic" font-family="Georgia,serif"')
        +stick(55,98,1,C.blue)
        +stick(145,98,1,C.blue)),
      text: { ko:'피타고라스 학파는 "모든 길이는 분수로 나타낼 수 있다"고 믿었어요.',
              en:'The Pythagoreans believed every length could be written as a fraction.',
              zh:'毕达哥拉斯学派相信，任何长度都能写成分数。' } },
    { art: svg(
        '<rect x="55" y="28" width="60" height="60" fill="none" stroke="'+C.ink+'" stroke-width="2.5"/>'
        +'<line x1="55" y1="88" x2="115" y2="28" stroke="'+C.red+'" stroke-width="3"/>'
        +txt(46,62,14,C.ink,'1')
        +txt(85,20,14,C.ink,'1')
        +txt(98,66,16,C.red,'√2','font-family="Georgia,serif"')
        +txt(158,60,26,C.grey,'a/b')
        +'<line x1="140" y1="48" x2="176" y2="72" stroke="'+C.red+'" stroke-width="3"/>'),
      text: { ko:'그런데 한 변이 1인 정사각형의 대각선(√2)은 어떤 분수로도 나타낼 수 없었어요.',
              en:'But the diagonal (√2) of a square with side 1 could not be written as any fraction.',
              zh:'可是边长为1的正方形，其对角线(√2)写不成任何分数。' } },
    { art: svg(
        '<path d="M 0 112 Q 25 102 50 112 T 100 112 T 150 112 T 200 112" stroke="'+C.blue+'" stroke-width="3" fill="none"/>'
        +'<g transform="rotate(25 100 60)">'+stick(100,60,1,C.grey)+'</g>'
        +bubble(150,38,26,16,122,55)
        +txt(150,42,15,C.red,'√2','font-family="Georgia,serif"')),
      text: { ko:'이 비밀을 밖으로 알린 히파소스가 바다에 던져졌다는 이야기가 전해져요 — 사실인지는 아무도 몰라요.',
              en:'Legend says Hippasus, who revealed this secret, was thrown into the sea — but no one knows if it is true.',
              zh:'传说泄露这个秘密的希帕索斯被投入大海——是真是假，无人知晓。' } },
    { art: svg(
        txt(100,64,26,C.ink,'√2×√3=√6','font-family="Georgia,serif"')
        +numi(35,106,1)
        +txt(168,102,20,C.gold,'✨')),
      text: { ko:'이제 우리는 √2×√3=√6처럼, 그 시절엔 두려웠던 수들을 자유롭게 계산해요.',
              en:'Now we freely calculate with numbers once feared back then, like √2×√3=√6.',
              zh:'现在我们能自由计算那时令人恐惧的数，比如√2×√3=√6。' } },
  ]};
};
