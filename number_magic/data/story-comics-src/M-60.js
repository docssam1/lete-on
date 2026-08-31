/* M-60 — 산꼭대기가 평평해지는 순간 */
'use strict';
module.exports=function(H){
  const {C,svg,stick,numi,arrow,txt,ground}=H;
  return { panels:[
    { art: svg(
        ground(114)
        +'<path d="M 20 108 Q 100 20 180 108" fill="none" stroke="'+C.blue+'" stroke-width="3"/>'
        +'<line x1="70" y1="30" x2="130" y2="30" stroke="'+C.grey+'" stroke-width="2" stroke-dasharray="3 3"/>'
        +txt(100,20,20,C.red,'?')
        +numi(188,102,0.7)),
      text: { ko:'곡선이 가장 높이 올라간 지점의 정확한 자리를 어떻게 찾을 수 있을까요?',
              en:'How can you find the exact spot where a curve reaches its highest point?',
              zh:'怎样才能找到曲线升到最高点的确切位置呢？' } },
    { art: svg(
        ground(118)
        +'<path d="M 60 112 Q 130 40 190 100" fill="none" stroke="'+C.sub+'" stroke-width="3"/>'
        +'<line x1="112" y1="46" x2="150" y2="46" stroke="'+C.gold+'" stroke-width="2.5" stroke-dasharray="4 3"/>'
        +stick(34,84,1,C.sub)),
      text: { ko:'17세기, 미적분이 발명되기도 전에 페르마는 산꼭대기에서 곡선이 잠깐 수평이 된다는 걸 알아챘어요.',
              en:'In the 17th century — even before calculus was invented — Fermat noticed that a curve momentarily levels out at the top of a hill.',
              zh:'17世纪，在微积分被发明之前，费马就注意到曲线在山顶处会短暂变得水平。' } },
    { art: svg(
        stick(50,70,1,C.blue)
        +stick(78,70,1,C.gold)
        +arrow(100,68,138,68,C.ink,2.5)
        +txt(168,76,18,C.red,"f'=0")),
      text: { ko:"훗날 뉴턴과 라이프니츠의 미적분학이 이 발견을 f'(x)=0이라는 정확한 방정식으로 다듬었어요.",
              en:"Later, Newton and Leibniz's calculus refined this discovery into the precise equation f'(x)=0.",
              zh:"后来，牛顿和莱布尼茨的微积分把这个发现精炼成f'(x)=0这个精确方程。" } },
    { art: svg(
        ground(112)
        +'<path d="M 16 100 Q 55 30 90 78 Q 125 126 160 40 Q 175 20 188 40" fill="none" stroke="'+C.ok+'" stroke-width="3"/>'
        +'<circle cx="90" cy="78" r="5" fill="'+C.red+'"/>'
        +'<circle cx="160" cy="40" r="5" fill="'+C.red+'"/>'
        +txt(90,20,15,C.red,"f'(x)=0")),
      text: { ko:"그래서 오늘 우리는 f'(x)=0을 풀어서 산꼭대기와 골짜기, 즉 극값의 자리를 정확히 찾아요.",
              en:"So today, we solve f'(x)=0 to find the exact spots of hilltops and valleys — the extrema.",
              zh:"所以今天我们解f'(x)=0，就能准确找到山顶和谷底，也就是极值的位置。" } },
  ]};
};
