/* M-48 — 대입, 방정식·함수·변수의 뿌리 */
'use strict';
module.exports=function(H){
  const {C,svg,stick,sheep,pouch,arrow,paper,bubble,txt,ground}=H;
  return { panels:[
    { art: svg(
        txt(100,35,22,C.ink,'3x+2')
        + arrow(75,45,45,80,C.blue,2.5)
        + arrow(125,45,155,80,C.red,2.5)
        + txt(45,100,17,C.blue,'x=1→5')
        + txt(155,100,17,C.red,'x=10→32')),
      text: { ko:'3x+2는 x가 무엇이냐에 따라 값이 달라져요. x=1이면 5, x=10이면 32예요.',
              en:'The value of 3x+2 changes depending on x. If x=1, it\'s 5; if x=10, it\'s 32.',
              zh:'3x+2的值会随x不同而变化。x=1时是5，x=10时是32。' } },
    { art: svg(
        '<rect x="60" y="40" width="30" height="30" rx="4" fill="'+C.cream+'" stroke="'+C.ink+'" stroke-width="2.5"/>'
        + txt(75,63,20,C.ink,'x')
        + arrow(95,55,125,55,C.gold,3)
        + '<rect x="135" y="40" width="30" height="30" rx="4" fill="'+C.cream+'" stroke="'+C.ok+'" stroke-width="2.5"/>'
        + txt(150,63,20,C.ok,'4')),
      text: { ko:'문자 자리에 실제 수를 넣어 값을 구하는 것을 "식의 값을 구한다"고 해요.',
              en:'Putting an actual number in place of the letter to find the result is called "evaluating the expression".',
              zh:'把实际的数代入字母求出结果，叫做"求代数式的值"。' } },
    { art: svg(
        '<rect x="85" y="55" width="30" height="26" rx="4" fill="'+C.cream+'" stroke="'+C.ink+'" stroke-width="2.5"/>'
        + txt(100,75,16,C.ink,'x')
        + arrow(85,58,42,30,C.blue,2.5)
        + arrow(115,58,160,30,C.purple,2.5)
        + txt(35,25,22,C.blue,'=')
        + '<path d="M140 40 Q160 15 180 35" fill="none" stroke="'+C.purple+'" stroke-width="2.5"/>'),
      text: { ko:'문자에 수를 대입해 값을 구하는 방법은 방정식과 함수 등 수학 전체의 기초가 돼요.',
              en:'Substituting a value for a letter is the foundation behind equations, functions, and much of mathematics.',
              zh:'把数代入字母求值的方法是方程、函数等整个数学的基础。' } },
    { art: svg(
        '<rect x="55" y="30" width="90" height="60" rx="6" fill="'+C.paper+'" stroke="'+C.ink+'" stroke-width="3"/>'
        + '<rect x="90" y="90" width="20" height="14" fill="'+C.ink+'"/>'
        + txt(90,65,22,C.ok,'x=4')
        + txt(130,65,20,C.sub,'→')
        + txt(165,65,26,C.red,'9')),
      text: { ko:'컴퓨터 프로그램의 "변수"도 사실 이 문자식의 아이디어에서 나왔어요.',
              en:'Even the "variables" in computer programs come from this very same idea.',
              zh:'计算机程序里的"变量"其实也来自这个代数式的思想。' } },
  ]};
};
