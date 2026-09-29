/* Numbers of Magic — 유닛 M-145: 삼각형과 사각형의 넓이 (고등 대수 · 과정 67 예정, 2026-09-29)
   근거: docs/high-build-spec.md MD145. 예시는 새로 만들었다. */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-145'] = {
  id:'M-145', tier:'algebra', level:'67', order:145,
  generator:'md145_area',
  title:{ ko:'삼각형과 사각형의 넓이', en:'Areas of Triangles & Quadrilaterals', zh:'三角形与四边形的面积' },
  subtitle:{ ko:'높이를 몰라도 sin 이 높이를 대신합니다', en:'No height? The sine stands in for it', zh:'不知道高？sin来代替' },
  icon:'📐',

  practice:{
    generator:'md145_area', level:'practice', count:6,
    params:{mode:'sas'},
    intro:{
      ko:'두 변과 그 끼인각으로 S=½ab sinC 를 계산합니다. sin 값에 √3, √2 가 있으면 □√3, □√2 의 □ 를 답합니다. 넓이에서 변을 거꾸로 구하기도 합니다.',
      en:'Compute S=½ab sinC from two sides and the included angle. If the sine has √3 or √2, give the □ in □√3 or □√2. Sometimes you work back from the area to a side.',
      zh:'由两边及夹角计算S=½ab sinC。sin值含√3、√2时，填□√3、□√2中的□。有时由面积反求边长。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'삼각형의 넓이는 ½×밑변×높이입니다. 높이를 모르고 두 변과 그 사이의 각만 알아도, 높이는 b sinC 로 바로 나옵니다. 세 변만 알 때, 사각형일 때도 같은 생각으로 넓이를 구합니다.',
        en:'A triangle’s area is ½×base×height. Even without the height, knowing two sides and the angle between them gives the height at once as b sinC. The same idea works with only three sides, and for quadrilaterals.',
        zh:'三角形面积是½×底×高。不知道高，只要知道两边及其夹角，高就是b sinC。只知三边时、四边形时也用同样的思路求面积。' }
    },
    stages:[
      { tag:{ko:'① 두 변과 끼인각',en:'1) Two sides and the included angle',zh:'① 两边及夹角'},
        head:{ko:'a=6,\\ b=8,\\ C=30^\\circ\\ \\Rightarrow\\ S=\\frac{1}{2}\\times6\\times8\\times\\frac{1}{2}=12',en:'a=6,\\ b=8,\\ C=30^\\circ\\ \\Rightarrow\\ S=\\frac{1}{2}\\times6\\times8\\times\\frac{1}{2}=12',zh:'a=6,\\ b=8,\\ C=30^\\circ\\ \\Rightarrow\\ S=\\frac{1}{2}\\times6\\times8\\times\\frac{1}{2}=12'},
        desc:{ko:'높이는 8×sin30°=4 이므로 넓이는 ½×6×4=<b>12</b> 입니다.',en:'The height is 8×sin30°=4, so the area is ½×6×4=<b>12</b>.',zh:'高为8×sin30°=4，所以面积为½×6×4=<b>12</b>。'},
        mathSteps:['S=\\frac{1}{2}ab\\sin C','\\frac{1}{2}\\times6\\times8\\times\\frac{1}{2}=12'],
        result:{ko:'높이 대신 sin!',en:'Sine instead of height!',zh:'用sin代替高！'},
        book:{ko:'C=150° 이어도 sin150°=½ 이라 넓이는 같습니다. 둔각이어도 sin 은 양수입니다.',en:'With C=150°, sin150°=½ too, so the area is the same. The sine is positive even for an obtuse angle.',zh:'C=150°时sin150°=½，面积相同。钝角的sin也是正数。'} },

      { tag:{ko:'② 세 변',en:'2) Three sides',zh:'② 三边'},
        head:{ko:'a=13,\\ b=14,\\ c=15:\\ s=21,\\ S=\\sqrt{21\\times8\\times7\\times6}=84',en:'a=13,\\ b=14,\\ c=15:\\ s=21,\\ S=\\sqrt{21\\times8\\times7\\times6}=84',zh:'a=13,\\ b=14,\\ c=15:\\ s=21,\\ S=\\sqrt{21\\times8\\times7\\times6}=84'},
        desc:{ko:'s=(13+14+15)/2=21 이고 헤론의 공식으로 S=√7056=<b>84</b> 입니다.',en:'s=(13+14+15)/2=21, and Heron’s formula gives S=√7056=<b>84</b>.',zh:'s=(13+14+15)/2=21，由海伦公式S=√7056=<b>84</b>。'},
        mathSteps:['s=\\frac{a+b+c}{2}','S=\\sqrt{s(s-a)(s-b)(s-c)}'],
        result:{ko:'세 변만 알아도 넓이가 나온다!',en:'Three sides are enough for the area!',zh:'只知三边也能求面积！'},
        book:{ko:'넓이를 알면 S=rs 로 내접원의 반지름도 나옵니다. 84=r×21 이므로 r=4 입니다.',en:'From the area, S=rs gives the inradius: 84=r×21, so r=4.',zh:'知道面积后由S=rs可求内切圆半径：84=r×21，r=4。'} },

      { tag:{ko:'③ 사각형',en:'3) Quadrilaterals',zh:'③ 四边形'},
        head:{ko:'\\overline{AB}=5,\\ \\overline{AD}=8,\\ \\angle A=60^\\circ\\ \\Rightarrow\\ S=5\\times8\\times\\frac{\\sqrt{3}}{2}=20\\sqrt{3}',en:'\\overline{AB}=5,\\ \\overline{AD}=8,\\ \\angle A=60^\\circ\\ \\Rightarrow\\ S=5\\times8\\times\\frac{\\sqrt{3}}{2}=20\\sqrt{3}',zh:'\\overline{AB}=5,\\ \\overline{AD}=8,\\ \\angle A=60^\\circ\\ \\Rightarrow\\ S=5\\times8\\times\\frac{\\sqrt{3}}{2}=20\\sqrt{3}'},
        desc:{ko:'평행사변형은 대각선이 합동인 삼각형 둘로 나누므로 넓이는 ab sinA=<b>20√3</b> 입니다.',en:'A diagonal splits a parallelogram into two congruent triangles, so its area is ab sinA=<b>20√3</b>.',zh:'平行四边形被对角线分成两个全等三角形，面积为ab sinA=<b>20√3</b>。'},
        mathSteps:['S=ab\\sin A','S=\\frac{1}{2}pq\\sin\\theta'],
        result:{ko:'삼각형 두 개면 ½ 이 사라진다!',en:'Two triangles: the ½ disappears!',zh:'两个三角形，½就没了！'},
        book:{ko:'대각선이 p=6, q=10 이고 이루는 각이 30° 인 사각형은 S=½×6×10×½=15 입니다.',en:'A quadrilateral with diagonals p=6, q=10 at an angle of 30° has S=½×6×10×½=15.',zh:'对角线p=6、q=10且夹角为30°的四边形，S=½×6×10×½=15。'} }
    ],
    rule:{ ko:'① S=½ab sinC  ② S=√(s(s−a)(s−b)(s−c))=rs  ③ 평행사변형 S=ab sinθ, 사각형 S=½pq sinθ',
      en:'① S=½ab sinC  ② S=√(s(s−a)(s−b)(s−c))=rs  ③ Parallelogram S=ab sinθ, quadrilateral S=½pq sinθ',
      zh:'① S=½ab sinC  ② S=√(s(s−a)(s−b)(s−c))=rs  ③ 平行四边形S=ab sinθ，四边形S=½pq sinθ' }
  },

  check:{
    fills:[
      { tex:{ko:'a=4,\\ b=10,\\ C=150^\\circ\\ \\Rightarrow\\ S=\\square',en:'a=4,\\ b=10,\\ C=150^\\circ\\ \\Rightarrow\\ S=\\square',zh:'a=4,\\ b=10,\\ C=150^\\circ\\ \\Rightarrow\\ S=\\square'}, answer:10,
        hint:{ko:'½×4×10×½',en:'½×4×10×½',zh:'½×4×10×½'} },
      { tex:{ko:'a=5,\\ b=12,\\ c=13\\ \\Rightarrow\\ S=\\square',en:'a=5,\\ b=12,\\ c=13\\ \\Rightarrow\\ S=\\square',zh:'a=5,\\ b=12,\\ c=13\\ \\Rightarrow\\ S=\\square'}, answer:30,
        hint:{ko:'s=15',en:'s=15',zh:'s=15'} }
    ],
    open:{ ko:'평행사변형의 넓이가 ab sinθ 인 까닭을 삼각형의 넓이로 설명해 봅니다.',
      en:'Use triangle areas to explain why a parallelogram has area ab sinθ.',
      zh:'用三角形面积说明为什么平行四边形面积是ab sinθ。' },
    openHint:{ ko:'대각선 하나로 나누면 합동인 삼각형 두 개가 생기고, 각각의 넓이가 ½ab sinθ 입니다. 둘을 더하면 ab sinθ 입니다.',
      en:'One diagonal splits it into two congruent triangles, each with area ½ab sinθ. Together they make ab sinθ.',
      zh:'用一条对角线分成两个全等三角形，每个面积为½ab sinθ，合起来就是ab sinθ。' }
  },

  lab:{
    generator:'md145_area', level:'main', count:6,
    params:{mode:'heron'},
    intro:{
      ko:'세 변만 주어지면 헤론의 공식으로 넓이를 구하고, S=rs, S=abc/(4R) 로 내접원·외접원의 반지름도 구합니다. 60°·120° 인 각이 숨어 있으면 넓이에 √3 이 붙습니다.',
      en:'With only three sides, use Heron’s formula, and get the inradius and circumradius from S=rs and S=abc/(4R). If a 60° or 120° angle is hidden, the area carries √3.',
      zh:'只给三边时用海伦公式求面积，再由S=rs、S=abc/(4R)求内切圆、外接圆半径。若藏着60°或120°的角，面积带√3。'
    }
  },

  arena:{
    generator:'md145_area', level:'main', count:6, timeLimit:420,
    params:{mode:'quad'},
    rule:{ ko:'7분 안에 평행사변형과 사각형의 넓이를 모두 구합니다!', en:'Find every parallelogram and quadrilateral area within 7 minutes!', zh:'7分钟内求出所有平行四边形与四边形的面积！' }
  },

  stamp:{ label:{ ko:'넓이 측량사', en:'Area Surveyor', zh:'面积测量员' }, coins:52 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'넓이를 정확히 쟀어! 📐',en:'Measured the area exactly!',zh:'面积量得正好！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'½ 을 곱했는지 봐!',en:'Did you multiply by ½?',zh:'乘½了吗？'}, {ko:'끼인각인지 확인해!',en:'Check that it is the included angle!',zh:'确认是夹角！'} ],
    finish:{ ko:'완벽해! 넓이 측량사! 📐✨', en:'Perfect! Area Surveyor!', zh:'完美！面积测量员！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
