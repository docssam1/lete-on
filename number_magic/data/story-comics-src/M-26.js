/* M-26 — 이차방정식의 판별식: b²-4ac가 근의 운명을 정한다 */
'use strict';
module.exports=function(H){
  const {C,svg,ground,txt}=H;
  return { panels:[
    { art: svg(
        ground(100)
        +'<path d="M15,20 Q40,115 65,20" fill="none" stroke="'+C.blue+'" stroke-width="2.5"/>'
        +'<circle cx="27" cy="100" r="3" fill="'+C.red+'"/>'
        +'<circle cx="53" cy="100" r="3" fill="'+C.red+'"/>'
        +'<path d="M75,20 Q100,100 125,20" fill="none" stroke="'+C.gold+'" stroke-width="2.5"/>'
        +'<circle cx="100" cy="100" r="3" fill="'+C.gold+'"/>'
        +'<path d="M135,20 Q160,55 185,20" fill="none" stroke="'+C.purple+'" stroke-width="2.5"/>'
        +txt(40,132,10,C.red,'D>0')
        +txt(100,132,10,C.gold,'D=0')
        +txt(160,132,10,C.purple,'D<0')),
      text: { ko:'이차방정식은 근이 2개, 1개, 또는 0개일 수 있어요 — 미리 알 방법이 있을까요?',
              en:'A quadratic equation can have 2, 1, or 0 roots — is there a way to know in advance?',
              zh:'二次方程可能有2个、1个或0个根——有没有办法提前知道？' } },
    { art: svg(
        txt(100,35,14,C.ink,'x=(-b±√(b²-4ac))/(2a)')
        +'<line x1="100" y1="50" x2="100" y2="75" stroke="'+C.gold+'" stroke-width="2"/>'
        +'<polygon points="100,78 96,70 104,70" fill="'+C.gold+'"/>'
        +'<rect x="60" y="80" width="80" height="30" rx="5" fill="'+C.paper+'" stroke="'+C.gold+'" stroke-width="2.5"/>'
        +txt(100,100,18,C.gold,'b²-4ac')),
      text: { ko:'근의 공식 안을 들여다보면, 근호 속의 b²-4ac라는 값이 눈에 띄어요.',
              en:'Peer inside the quadratic formula, and the value b²-4ac under the root stands out.',
              zh:'细看求根公式，根号里的b²-4ac这个值格外醒目。' } },
    { art: svg(
        txt(100,25,18,C.gold,'D')
        +'<line x1="100" y1="35" x2="100" y2="55" stroke="'+C.grey+'" stroke-width="2"/>'
        +'<line x1="30" y1="60" x2="170" y2="60" stroke="'+C.ink+'" stroke-width="2"/>'
        +'<line x1="100" y1="60" x2="40" y2="95" stroke="'+C.red+'" stroke-width="2"/>'
        +'<line x1="100" y1="60" x2="160" y2="95" stroke="'+C.blue+'" stroke-width="2"/>'
        +'<line x1="100" y1="60" x2="100" y2="95" stroke="'+C.ok+'" stroke-width="2"/>'
        +txt(40,112,11,C.red,'D<0')
        +txt(100,112,11,C.ok,'D=0')
        +txt(160,112,11,C.blue,'D>0')
        +txt(40,128,10,C.sub,'no roots')
        +txt(100,128,10,C.sub,'1 root')
        +txt(160,128,10,C.sub,'2 roots')),
      text: { ko:'이 값이 양수·0·음수 중 무엇이냐에 따라 근이 몇 개인지, 겹치는지가 갈려요.',
              en:'Whether this value is positive, zero, or negative decides how many roots there are, and whether they coincide.',
              zh:'这个值是正、是零还是负，决定了根有几个、是否重合。' } },
    { art: svg(
        '<path d="M 35 45 L 135 45 L 148 65 L 135 85 L 35 85 Z" fill="'+C.paper+'" stroke="'+C.gold+'" stroke-width="2.5"/>'
        +txt(85,70,18,C.ink,'D=b²-4ac')
        +'<circle cx="148" cy="65" r="4" fill="'+C.gold+'"/>'
        +txt(170,30,18,C.ok,'✓')),
      text: { ko:"그래서 이 값에는 '판별식'이라는 이름이 붙었어요 — 근을 구하지 않고도 운명을 미리 알려주죠.",
              en:"That's why this value is called the 'discriminant' — it reveals the roots' fate before you ever solve for them.",
              zh:"因此这个值被称为'判别式'——不用求根就能提前揭示根的命运。" } },
  ]};
};
