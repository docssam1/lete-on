/* M-62 — 행성의 순간 속도, 미적분의 탄생 */
'use strict';
module.exports=function(H){
  const {C,svg,stick,numi,arrow,txt,ground}=H;
  return { panels:[
    { art: svg(
        ground(100)
        +'<rect x="30" y="80" width="34" height="16" rx="3" fill="'+C.blue+'" stroke="'+C.ink+'" stroke-width="1.5"/>'
        +'<circle cx="38" cy="98" r="5" fill="'+C.ink+'"/>'
        +'<circle cx="58" cy="98" r="5" fill="'+C.ink+'"/>'
        +'<line x1="70" y1="88" x2="150" y2="88" stroke="'+C.grey+'" stroke-width="2" stroke-dasharray="4 3"/>'
        +txt(160,92,20,C.red,'?')
        +numi(178,64,0.7)),
      text: { ko:"평균 속도(전체 거리÷전체 시간)는 알아도, '바로 이 순간'의 속도는 어떻게 구할까요?",
              en:"We know average speed — total distance divided by total time — but how do we find the speed at this exact instant?",
              zh:'我们知道平均速度(总路程÷总时间)，但这一瞬间的速度该怎么求呢？' } },
    { art: svg(
        '<circle cx="100" cy="76" r="5" fill="'+C.gold+'"/>'
        +'<path d="M 60 76 A 40 32 0 1 1 140 76 A 40 32 0 1 1 60 76" fill="none" stroke="'+C.blue+'" stroke-width="2"/>'
        +'<circle cx="140" cy="76" r="5" fill="'+C.red+'"/>'
        +stick(40,102,0.85,C.sub)),
      text: { ko:'뉴턴은 행성의 위치가 시시각각 바뀌는 걸 보며, 그 순간의 속도를 구하고 싶어 했어요.',
              en:"Watching a planet's position change moment by moment, Newton wanted to find the speed at that exact instant.",
              zh:'牛顿看着行星的位置每时每刻都在变化，很想求出那一刻的速度。' } },
    { art: svg(
        '<path d="M 20 108 Q 100 30 180 70" fill="none" stroke="'+C.blue+'" stroke-width="3"/>'
        +'<circle cx="120" cy="60" r="4.5" fill="'+C.red+'"/>'
        +arrow(120,60,168,44,C.gold,2.5)
        +txt(150,100,17,C.ok,"s'(t)")),
      text: { ko:'그래서 뉴턴은 위치의 순간 변화를 구하는 도구, 즉 미분을 발명했어요 — 미적분학의 시작이었죠.',
              en:'So Newton invented a tool for the instant change of position — the derivative — and that was the birth of calculus.',
              zh:'于是牛顿发明了求位置瞬时变化的工具——求导，这就是微积分的开端。' } },
    { art: svg(
        txt(58,80,30,C.blue,'s(t)')
        +arrow(90,74,124,74,C.gold,3)
        +txt(164,80,26,C.ok,"s'(t)")),
      text: { ko:"그렇게 미적분학은 원래 '운동을 다루는 수학'으로 태어났어요 — s(t)를 미분하면 오늘도 여전히 속도예요.",
              en:"That's why calculus was originally born as the mathematics of motion — differentiating s(t) still gives velocity today.",
              zh:'所以微积分最初正是作为研究运动的数学诞生的——对s(t)求导，今天仍然得到速度。' } },
  ]};
};
