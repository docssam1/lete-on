/* Numbers of Magic — 유닛 M-39: 삼각함수의 값(특수각) (고등 W13 · 대수 삼각함수와 수열) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-39'] = {
  id:'M-39', tier:'algebra', level:'41', order:1,
  generator:'md39_trigSpecialAngle',
  title:{ ko:'삼각함수의 값(특수각)', en:'Trig Values of Special Angles', zh:'特殊角三角函数值' },
  subtitle:{ ko:'0°·30°·45°·60°·90° 다섯 각의 sin·cos·tan을 외워요', en:'Memorize sin·cos·tan at five special angles', zh:'记住五个特殊角的sin·cos·tan' },
  icon:'📐',

  practice:{
    generator:'md39_trigSpecialAngle', level:'practice', count:5,
    params:{mode:'basic'},
    intro:{
      ko:'sin30° = 1/2 — 정삼각형을 반으로 잘랐을 때 나오는 직각삼각형의 변의 비예요.',
      en:'sin30° = 1/2 — the side ratio of the right triangle you get by bisecting an equilateral triangle.',
      zh:'sin30° = 1/2——把等边三角形对半切开得到的直角三角形边比。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 정삼각형을 반으로 자르면 30°·60°',en:'1) Bisect an equilateral triangle: 30° & 60°',zh:'① 等边三角形对半切开：30°·60°'},
        head:{ko:'\\sin 30^\\circ = \\dfrac{1}{2},\\;\\; \\cos 30^\\circ=\\dfrac{\\sqrt3}{2}',en:'\\sin 30^\\circ = \\dfrac{1}{2},\\;\\; \\cos 30^\\circ=\\dfrac{\\sqrt3}{2}',zh:'\\sin 30^\\circ = \\dfrac{1}{2},\\;\\; \\cos 30^\\circ=\\dfrac{\\sqrt3}{2}'},
        desc:{ko:'한 변이 2인 정삼각형을 반으로 자르면, 빗변 2·높이 √3·밑변 1인 직각삼각형이 나와요. <b>30°와 마주 보는 변은 1(가장 짧은 변)</b> → sin30°=1/2. 60°와 마주 보는 변은 √3 → sin60°=√3/2.',
              en:'Bisecting an equilateral triangle with side 2 gives a right triangle with hypotenuse 2, height √3, base 1. <b>The side opposite 30° is 1 (shortest side)</b> → sin30°=1/2. The side opposite 60° is √3 → sin60°=√3/2.',
              zh:'把边长为2的等边三角形对半切开，得到斜边2、高√3、底1的直角三角形。<b>30°对边是1(最短边)</b>→sin30°=1/2。60°对边是√3→sin60°=√3/2。'},
        mathSteps:[{ko:'\\text{변: }1,\\;\\sqrt3,\\;2',en:'\\text{sides: }1,\\;\\sqrt3,\\;2',zh:'\\text{边：}1,\\;\\sqrt3,\\;2'}, '\\sin30^\\circ=\\dfrac{1}{2}', '\\sin60^\\circ=\\dfrac{\\sqrt3}{2}'],
        result:{ko:'30°-60°-90° 삼각형의 변의 비는 1:√3:2!',en:'A 30-60-90 triangle has side ratio 1:√3:2!',zh:'30-60-90三角形的边比是1:√3:2！'},
        book:{ko:'sin=마주보는 변÷빗변, cos=붙어 있는 변÷빗변, tan=마주보는 변÷붙어 있는 변이에요.',
              en:'sin = opposite÷hypotenuse, cos = adjacent÷hypotenuse, tan = opposite÷adjacent.',
              zh:'sin=对边÷斜边，cos=邻边÷斜边，tan=对边÷邻边。'} },

      { tag:{ko:'② 직각이등변삼각형은 45°',en:'2) The right-isosceles triangle: 45°',zh:'② 等腰直角三角形：45°'},
        head:{ko:'\\sin 45^\\circ = \\dfrac{\\sqrt2}{2},\\;\\; \\tan 60^\\circ=\\sqrt3',en:'\\sin 45^\\circ = \\dfrac{\\sqrt2}{2},\\;\\; \\tan 60^\\circ=\\sqrt3',zh:'\\sin 45^\\circ = \\dfrac{\\sqrt2}{2},\\;\\; \\tan 60^\\circ=\\sqrt3'},
        desc:{ko:'두 변이 1인 직각이등변삼각형은 빗변이 √2예요(피타고라스). 그래서 sin45°=1/√2=√2/2. tan은 마주보는 변÷붙어 있는 변이라 <b>빗변이 사라져요</b> — tan60°=(√3/2)÷(1/2)=√3, 근호만 남고 분모가 없어져요.',
              en:'A right-isosceles triangle with legs 1 has hypotenuse √2 (Pythagoras). So sin45°=1/√2=√2/2. Since tan is opposite÷adjacent, <b>the hypotenuse cancels</b> — tan60°=(√3/2)÷(1/2)=√3, leaving only the root with no denominator.',
              zh:'两条直角边都是1的等腰直角三角形，斜边是√2(勾股定理)。所以sin45°=1/√2=√2/2。tan是对边÷邻边，<b>斜边会消掉</b>——tan60°=(√3/2)÷(1/2)=√3，只剩根号，没有分母。'},
        mathSteps:['1^2+1^2=2\\Rightarrow\\sqrt2', '\\sin45^\\circ=\\dfrac{\\sqrt2}{2}', '\\tan60^\\circ=\\dfrac{\\sqrt3/2}{1/2}=\\sqrt3'],
        result:{ko:'45°는 √2가, 60°의 tan은 분모 없이 √3만 남아요!',en:'45° brings in √2, and tan60° leaves only √3 with no denominator!',zh:'45°带出√2，tan60°只剩下没有分母的√3！'},
        book:{ko:'0°와 90°는 축 위의 값이라 근호 없이 0과 1만 나와요 — 다섯 각 전체를 표로 외워두면 계산 없이 바로 답할 수 있어요.',
              en:'0° and 90° sit right on the axes, giving only 0 and 1 with no roots — memorizing all five angles as a table lets you answer instantly, no calculation.',
              zh:'0°和90°正好落在坐标轴上，只有0和1，没有根号——把五个角整理成表格背下来，就能不用计算立刻回答。'} }
    ],
    rule:{ ko:'30-60-90 삼각형의 변의 비는 1:√3:2, 45-45-90은 1:1:√2 — 이 두 삼각형이 특수각 값의 전부예요.',
      en:'A 30-60-90 triangle has ratio 1:√3:2, and a 45-45-90 has ratio 1:1:√2 — these two triangles give every special-angle value.',
      zh:'30-60-90三角形边比1:√3:2，45-45-90是1:1:√2——这两个三角形就是所有特殊角的值。' }
  },

  check:{
    fills:[
      { tex:'\\cos 60^\\circ = \\dfrac{\\square}{\\square}', answer:[1,2],
        hint:{ ko:'cos60°는 sin30°와 같은 값이에요', en:'cos60° has the same value as sin30°', zh:'cos60°和sin30°的值相同' } },
      { tex:'\\tan 45^\\circ = \\square', answer:1,
        hint:{ ko:'직각이등변삼각형은 두 변의 길이가 같아요', en:'A right-isosceles triangle has two equal legs', zh:'等腰直角三角形两条直角边相等' } }
    ],
    open:{ ko:'cos45°의 값을 직각이등변삼각형의 변의 비로 설명해봐요.',
      en:'Explain the value of cos45° using the side ratio of a right-isosceles triangle.',
      zh:'用等腰直角三角形的边比说说cos45°的值。' },
    openHint:{ ko:'변의 비 1:1:√2에서 붙어 있는 변 1, 빗변 √2 → cos45°=1/√2=√2/2',
      en:'With ratio 1:1:√2, the adjacent side is 1, hypotenuse √2 → cos45°=1/√2=√2/2',
      zh:'边比1:1:√2中，邻边是1，斜边是√2 → cos45°=1/√2=√2/2' }
  },

  lab:{
    generator:'md39_trigSpecialAngle', level:'main', count:4,
    params:{mode:'mixed'},
    intro:{
      ko:'이번엔 근호가 있는 값들! √가 들어간 특수각 값을 [계수,근호안,분모] 순서로 입력해봐.',
      en:'Values with a root this time! Enter the special-angle values as [coefficient, radicand, denominator].',
      zh:'这次是带根号的值！按[系数,根号内,分母]顺序输入特殊角的值。'
    }
  },

  arena:{
    generator:'md39_trigSpecialAngle', level:'main', count:8, timeLimit:300,
    params:{mode:'wide'},
    rule:{ ko:'5분 안에 sin·cos·tan 특수각 값을 모두 맞혀요!', en:'Answer all the sin·cos·tan special-angle values in 5 minutes!', zh:'5分钟内答对所有sin·cos·tan特殊角的值！' }
  },

  stamp:{ label:{ ko:'특수각 측량사', en:'Special-Angle Surveyor', zh:'特殊角测量师' }, coins:50 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'삼각형의 변의 비를 정확히 기억하는구나! 📐',en:'You remembered the triangle\'s side ratio exactly right!',zh:'你准确记住了三角形的边比！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'30-60-90 삼각형의 변의 비는 1:√3:2야!',en:'A 30-60-90 triangle has ratio 1:√3:2!',zh:'30-60-90三角形边比是1:√3:2！'}, {ko:'sin=마주보는 변÷빗변, cos=붙어 있는 변÷빗변이야!',en:'sin = opposite÷hypotenuse, cos = adjacent÷hypotenuse!',zh:'sin=对边÷斜边，cos=邻边÷斜边！'} ],
    finish:{ ko:'완벽해! 특수각 측량사! 📐✨', en:'Perfect! Special-Angle Surveyor!', zh:'完美！特殊角测量师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
