/* M-61 — 삼각형을 채우다 뺄셈이 된 넓이 */
'use strict';
module.exports=function(H){
  const {C,svg,stick,arrow,txt,ground}=H;
  return { panels:[
    { art: svg(
        ground(104)
        +'<path d="M 40 104 Q 100 34 160 104 Z" fill="'+C.sky+'" stroke="'+C.blue+'" stroke-width="2.5"/>'
        +txt(100,80,22,C.red,'?')),
      text: { ko:'포물선이 볼록 솟은 부분과 x축 사이, 이 넓이는 대체 어떻게 구할 수 있을까요?',
              en:'How could anyone possibly find the area enclosed between a bulging parabola and the x-axis?',
              zh:'抛物线鼓起的部分和x轴之间，这块面积到底该怎么求呢？' } },
    { art: svg(
        ground(112)
        +'<polygon points="42,112 158,112 100,40" fill="none" stroke="'+C.gold+'" stroke-width="2"/>'
        +'<polygon points="42,112 100,40 71,112" fill="'+C.mist+'" stroke="'+C.gold+'" stroke-width="1.5"/>'
        +'<polygon points="158,112 100,40 129,112" fill="'+C.mist+'" stroke="'+C.gold+'" stroke-width="1.5"/>'
        +stick(30,90,0.85,C.sub)),
      text: { ko:"기원전 3세기, 아르키메데스는 그 안을 작은 삼각형으로 채우고 또 채우는 '소진법'으로 넓이에 다가갔어요.",
              en:"In the 3rd century BCE, Archimedes approached the area with 'exhaustion' — filling it with smaller and smaller triangles, over and over.",
              zh:"公元前3世纪，阿基米德用'穷竭法'逼近这块面积——不断用更小的三角形填满它。" } },
    { art: svg(
        '<polygon points="20,112 60,112 40,60" fill="none" stroke="'+C.grey+'" stroke-width="1.5"/>'
        +'<polygon points="20,112 40,60 30,112" fill="none" stroke="'+C.grey+'" stroke-width="1"/>'
        +'<polygon points="60,112 40,60 50,112" fill="none" stroke="'+C.grey+'" stroke-width="1"/>'
        +arrow(80,80,120,80,C.ink,2.5)
        +txt(160,86,15,C.ok,'F(q)−F(p)')),
      text: { ko:'훗날 뉴턴과 라이프니츠의 미적분학은 이 지루한 과정을 F(q)−F(p)라는 간단한 뺄셈으로 바꿔놓았어요.',
              en:'Later, Newton and Leibniz\'s calculus turned that tedious process into a simple subtraction: F(q)−F(p).',
              zh:'后来，牛顿和莱布尼茨的微积分把这个繁琐的过程变成了简单的减法：F(q)−F(p)。' } },
    { art: svg(
        ground(104)
        +'<path d="M 40 104 Q 100 34 160 104 Z" fill="'+C.sky+'" stroke="'+C.blue+'" stroke-width="2.5"/>'
        +'<circle cx="40" cy="104" r="4" fill="'+C.red+'"/>'
        +'<circle cx="160" cy="104" r="4" fill="'+C.red+'"/>'
        +txt(40,120,13,C.red,'p')
        +txt(160,120,13,C.red,'q')
        +txt(100,64,15,C.ok,'F(q)−F(p)')),
      text: { ko:'그래서 오늘 우리는 곡선이 x축과 만나는 두 점 p, q만 찾아 F(q)−F(p)를 계산하면 넓이가 나와요.',
              en:'So today, we just find the two points p and q where the curve meets the x-axis, and F(q)−F(p) gives the area.',
              zh:'所以今天我们只需找到曲线与x轴相交的两点p、q，算出F(q)−F(p)就是面积。' } },
  ]};
};
