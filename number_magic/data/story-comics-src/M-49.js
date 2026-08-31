/* M-49 — 상자 속 모든 것에 곱하기, 분배법칙의 역사 */
'use strict';
module.exports=function(H){
  const {C,svg,sheep,scholar,greek,pouch,arrow,paper,bubble,txt,ground}=H;
  return { panels:[
    { art: svg(
        '<rect x="70" y="40" width="80" height="45" rx="6" fill="'+C.cream+'" stroke="'+C.ink+'" stroke-width="2.5"/>'
        + txt(95,68,18,C.blue,'2x')
        + txt(135,68,18,C.gold,'5')
        + txt(35,68,26,C.ink,'3')
        + arrow(45,68,68,55,C.red,2.5)
        + arrow(45,68,68,80,C.red,2.5)),
      text: { ko:'상자 안에 2x와 5가 들어 있고, 상자 앞의 3은 안의 모든 것에 곱해져요.',
              en:'Inside the box are 2x and 5, and the 3 in front multiplies everything inside.',
              zh:'箱子里装着2x和5，箱子前面的3要乘到里面所有东西。' } },
    { art: svg(
        '<rect x="30" y="35" width="60" height="60" fill="none" stroke="'+C.gold+'" stroke-width="2.5"/>'
        + '<rect x="90" y="35" width="40" height="60" fill="none" stroke="'+C.gold+'" stroke-width="2.5"/>'
        + txt(60,105,14,C.sub,'b')
        + txt(110,105,14,C.sub,'c')
        + scholar(165,90,0.75)),
      text: { ko:'고대 바빌로니아와 이집트 사람들도 넓이를 나눠 계산할 때 이 원리를 무의식중에 썼어요.',
              en:'Ancient Babylonians and Egyptians used this same idea, without even realizing it, when splitting areas to calculate.',
              zh:'古巴比伦人和埃及人在分割面积计算时，也不自觉地用到了这个原理。' } },
    { art: svg(
        paper(20,20,100,100)
        + '<rect x="35" y="45" width="70" height="45" fill="none" stroke="'+C.ink+'" stroke-width="2"/>'
        + '<line x1="70" y1="45" x2="70" y2="90" stroke="'+C.ink+'" stroke-width="2"/>'
        + greek(160,90,0.85)),
      text: { ko:'기원전 3세기, 유클리드가 『원론』에서 이 원리를 도형으로 처음 증명했어요.',
              en:'In the 3rd century BCE, Euclid was the first to prove this principle geometrically, in his "Elements".',
              zh:'公元前3世纪，欧几里得在《几何原本》中首次用图形证明了这个原理。' } },
    { art: svg(
        txt(100,60,22,C.ink,'a(b+c)')
        + arrow(100,72,100,92,C.gold,3)
        + txt(100,112,22,C.blue,'ab+ac')),
      text: { ko:'이게 바로 분배법칙이에요 — a(b+c)=ab+ac, 괄호를 풀 때마다 쓰는 그 규칙이요.',
              en:'This is the distributive law — a(b+c)=ab+ac, the very rule you use every time you expand parentheses.',
              zh:'这就是分配律——a(b+c)=ab+ac，每次展开括号时都会用到的那条规则。' } },
  ]};
};
