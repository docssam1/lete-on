/* M-23 — 항등식과 미정계수법: 언제나 참인 식 */
'use strict';
module.exports=function(H){
  const {C,svg,arrow,txt}=H;
  return { panels:[
    { art: svg(
        '<line x1="15" y1="80" x2="185" y2="80" stroke="'+C.ink+'" stroke-width="2"/>'
        +[1,2,3,4,5].map(function(n,i){var x=35+i*33;
          return '<line x1="'+x+'" y1="75" x2="'+x+'" y2="85" stroke="'+C.ink+'" stroke-width="1.6"/>'
            +txt(x,100,11,C.sub,String(n));}).join('')
        +'<circle cx="101" cy="80" r="6" fill="'+C.red+'"/>'
        +txt(101,45,15,C.blue,'x+1=4')),
      text: { ko:'방정식 x+1=4는 x=3일 때만 참이에요 — 딱 하나의 값에서만 성립하죠.',
              en:'The equation x+1=4 is true only when x=3 — it holds for just one value.',
              zh:'方程x+1=4只有当x=3时才成立——只在一个值上成立。' } },
    { art: svg(
        txt(100,35,26,C.ok,'≡')
        +txt(40,75,13,C.blue,'x=0')
        +txt(100,75,13,C.blue,'x=1')
        +txt(160,75,13,C.blue,'x=2')
        +txt(40,100,14,C.ok,'✓')+txt(100,100,14,C.ok,'✓')+txt(160,100,14,C.ok,'✓')),
      text: { ko:"그런데 '항등식'은 x가 무엇이든 늘 참이에요. '항상 같다(恒等)'는 말 그대로죠.",
              en:"But an 'identity' is true no matter what x is — true to its name, 'always equal.'",
              zh:"但'恒等式'不管x是多少都恒成立——正如它的名字'恒等'。" } },
    { art: svg(
        txt(60,45,18,C.blue,'ax+b')
        +txt(60,90,18,C.ink,'5x-3')
        +'<line x1="45" y1="52" x2="45" y2="83" stroke="'+C.gold+'" stroke-width="1.6" stroke-dasharray="3 2"/>'
        +'<line x1="75" y1="52" x2="75" y2="83" stroke="'+C.gold+'" stroke-width="1.6" stroke-dasharray="3 2"/>'
        +txt(140,45,16,C.gold,'a=5')
        +txt(140,90,16,C.gold,'b=-3')),
      text: { ko:'이 성질 덕분에 양변의 계수끼리 직접 비교하는 것만으로도 미지수를 구할 수 있어요.',
              en:'Thanks to this property, you can find the unknowns just by comparing the coefficients on both sides directly.',
              zh:'正因如此，只需直接比较两边的系数就能求出未知数。' } },
    { art: svg(
        txt(60,45,16,C.blue,'ax+b')
        +txt(60,90,16,C.ink,'cx+d')
        +arrow(90,60,90,80,C.gold,2)
        +txt(140,60,18,C.ok,'a=c')
        +txt(140,90,18,C.ok,'b=d')
        +txt(175,30,16,C.ok,'✓')),
      text: { ko:'방정식을 풀지 않고 계수만 비교해 미지수를 찾는 방법 — 그게 바로 미정계수법이에요.',
              en:"Finding unknowns by comparing coefficients alone, without solving an equation — that's the method of undetermined coefficients.",
              zh:'不解方程、只比较系数就求出未知数——这就是待定系数法。' } },
  ]};
};
