/* H-12 — 배도 비행기도 없이 지구 둘레를 재다 */
'use strict';
module.exports = function(H){
  const {C,svg,stick,arrow,paper,bubble,txt,ground}=H;
  return { panels:[
    { art: svg(
        '<circle cx="150" cy="60" r="14" fill="'+C.goldbright+'" stroke="'+C.gold+'" stroke-width="2"/>'
        +'<line x1="150" y1="60" x2="40" y2="118" stroke="'+C.gold+'" stroke-width="2" stroke-dasharray="3,2"/>'
        +'<line x1="150" y1="60" x2="150" y2="118" stroke="'+C.gold+'" stroke-width="2" stroke-dasharray="3,2"/>'
        +ground(120)
        +'<line x1="40" y1="120" x2="40" y2="88" stroke="'+C.sub+'" stroke-width="3"/>'
        +'<line x1="150" y1="120" x2="150" y2="88" stroke="'+C.sub+'" stroke-width="3"/>'
        +txt(40,74,16,C.red,'7.2°')),
      text: { ko:'2000년 전, 같은 시각인데 두 도시의 해 기울기가 7.2도나 달랐어요.',
              en:'Two thousand years ago, at the same hour, the sun leaned 7.2° differently in two cities.',
              zh:'两千年前，同一时刻，两座城市的太阳角度差了7.2度。' } },
    { art: svg(
        '<circle cx="100" cy="65" r="42" fill="none" stroke="'+C.ink+'" stroke-width="2"/>'
        +'<line x1="100" y1="65" x2="100" y2="23" stroke="'+C.ink+'" stroke-width="1.5"/>'
        +'<line x1="100" y1="65" x2="130" y2="30" stroke="'+C.red+'" stroke-width="2.5"/>'
        +txt(115,35,13,C.red,'7.2°')
        +txt(100,68,16,C.ink,'360°')
        +txt(100,120,17,C.gold,'1/50')),
      text: { ko:'7.2도는 한 바퀴 360도의 딱 50분의 1이었죠.',
              en:'And 7.2° is exactly one fiftieth of the full 360°.',
              zh:'7.2度正好是一整圈360度的五十分之一。' } },
    { art: svg(
        paper(20,30,60,40)
        +txt(50,55,17,C.blue,'800km')
        +txt(105,55,22,C.ink,'×')
        +paper(125,30,60,40)
        +txt(155,55,17,C.blue,'50')
        +arrow(100,90,100,110,C.gold,3)
        +txt(100,128,20,C.ok,'40000km')),
      text: { ko:'두 도시 사이 800km에 50을 곱하면 800×50=40,000km!',
              en:'Multiply the 800 km between cities by 50: 800×50 = 40,000 km!',
              zh:'两城相距800公里，乘以50：800×50=40,000公里！' } },
    { art: svg(
        '<circle cx="100" cy="70" r="46" fill="none" stroke="'+C.blue+'" stroke-width="3"/>'
        +'<ellipse cx="100" cy="70" rx="46" ry="16" fill="none" stroke="'+C.sky+'" stroke-width="1.5"/>'
        +txt(100,72,17,C.gold,'40075km')
        +'<path d="M 70 100 L 80 110 L 98 88" fill="none" stroke="'+C.ok+'" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>'),
      text: { ko:'정밀 기구 하나 없이, 어림하고 곱한 것만으로 오늘날 값(40,075km)에 딱 맞혔어요!',
              en:"With no precise instrument at all, just an estimate and a multiplication matched today's value (40,075 km)!",
              zh:'没有任何精密仪器，只靠一次估算和乘法，就对上了今天的数值（40,075公里）！' } },
  ]};
};
