/* C-09 — 62자리 수의 50제곱근과 자릿수 예측 마법 */
'use strict';
module.exports=function(H){
  const {C,svg,stick,sheep,pouch,arrow,paper,bubble,txt,ground}=H;
  return { panels:[
    { art: svg(
        paper(70,30,100,50)
        +'<path d="M 78 46 L 162 46 M 78 54 L 162 54 M 78 62 L 162 62 M 78 70 L 162 70" stroke="'+C.grey+'" stroke-width="2"/>'
        +txt(50,60,11,C.sub,'62')
        +stick(30,96,1,C.blue)
        +bubble(150,100,30,18,132,86)
        +txt(150,104,15,C.blue,'17')),
      text: { ko:'62자리나 되는 수의 50제곱근을, 그 수를 보지도 않고 17이라고 맞힌 사람이 있었어요!',
              en:'Someone named 17 as the 50th root of a 62-digit number — without ever seeing the number!',
              zh:'有人没看那个62位的数，就说出它的50次方根是17！' } },
    { art: svg(
        stick(70,90,0.95)
        +stick(130,90,0.95,C.sub)
        +txt(100,26,20,C.sub,'?!')),
      text: { ko:'주변 사람들이 깜짝 놀랐어요. "계산도 안 하고 어떻게 알았어요?"',
              en:'Everyone around was stunned: "You never even calculated it — how did you know?"',
              zh:'周围的人都惊呆了："都没算，你怎么知道的？"' } },
    { art: svg(
        '<rect x="30" y="90" width="26" height="14" fill="'+C.mist+'"/>'
        +txt(43,86,9,C.sub,'16⁵⁰')
        +txt(43,116,9,C.sub,'61')
        +'<rect x="86" y="70" width="26" height="34" fill="'+C.ok+'"/>'
        +txt(99,66,9,C.ok,'17⁵⁰')
        +txt(99,116,9,C.ok,'62')
        +'<rect x="142" y="82" width="26" height="22" fill="'+C.mist+'"/>'
        +txt(155,78,9,C.sub,'18⁵⁰')
        +txt(155,116,9,C.sub,'63')),
      text: { ko:'16을 50번 곱하면 61자리, 18을 50번 곱하면 63자리라 낄 자리가 없어요. 17만 남아요!',
              en:'16 to the 50th has 61 digits, 18 to the 50th has 63 — nothing fits between. Only 17 remains!',
              zh:'16的50次方是61位，18的50次方是63位，中间没空隙。只剩17！' } },
    { art: svg(
        '<circle cx="80" cy="60" r="30" fill="none" stroke="'+C.gold+'" stroke-width="3"/>'
        +'<line x1="100" y1="80" x2="120" y2="100" stroke="'+C.gold+'" stroke-width="4" stroke-linecap="round"/>'
        +txt(80,64,16,C.blue,'2³')
        +arrow(120,80,150,60,C.ok,2.6)
        +'<rect x="150" y="40" width="14" height="16" rx="2" fill="none" stroke="'+C.ok+'" stroke-width="2.4"/>'
        +txt(157,52,10,C.ok,'8')),
      text: { ko:'답을 구하지 않고 몇 자리인지만 따져도 답이 하나로 좁혀져요. 그게 이 유닛의 마법이에요!',
              en:'Without computing anything, just counting digits narrows it to one answer — this unit\'s magic!',
              zh:'什么都不算，只数位数，答案就被逼成唯一一个——这正是本单元的魔法！' } },
  ]};
};
