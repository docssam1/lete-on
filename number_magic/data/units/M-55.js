/* Numbers of Magic — 유닛 M-55: 사인법칙 (대수 W13 심화, 2026-08-27) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-55'] = {
  id:'M-55', tier:'algebra', level:'44', order:4,
  generator:'md55_lawOfSines',
  title:{ ko:'사인법칙', en:'Law of Sines', zh:'正弦定理' },
  subtitle:{ ko:'변과 대각을 외접원의 지름으로 이어요', en:'A side and its opposite angle connect to the circumscribed circle', zh:'边与对角连接着外接圆的直径' },
  icon:'🔺',

  practice:{
    generator:'md55_lawOfSines', level:'practice', count:5,
    params:{mode:'basic'},
    intro:{
      ko:'사인법칙 a/sinA = 2R — 한 변을 그 대각의 sin값으로 나누면 항상 외접원의 지름(2R)이 나와요!',
      en:'The law of sines a/sinA = 2R — dividing a side by the sine of its opposite angle always gives the diameter(2R) of the circumscribed circle!',
      zh:'正弦定理a/sinA = 2R——一条边除以它对角的sin值，总能得到外接圆的直径(2R)！'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'어떤 삼각형이든 세 변과 그 대각의 사인값의 비(변÷sin각)는 항상 똑같아요 — 심지어 그 값은 삼각형을 둘러싼 원(외접원)의 지름(2R)과도 같아요! 삼각형이 아무리 달라 보여도 이 관계는 변하지 않아요.',
        en:'In any triangle, the ratio of each side to the sine of its opposite angle (side÷sinAngle) is always the same — and that value even equals the diameter(2R) of the circle surrounding the triangle (its circumscribed circle)! No matter how different the triangles look, this relationship never changes.',
        zh:'在任何三角形中，每条边与其对角正弦值之比(边÷sin角)总是相同的——这个值甚至等于围绕三角形的圆(外接圆)的直径(2R)！不管三角形看起来多不一样，这个关系永远不变。' },
      history:{ ko:'사인법칙은 10~11세기 페르시아 수학자 아부 알와파와 알비루니가 천문학(별의 위치 계산)을 위해 연구했어요. 삼각법은 원래 하늘의 별을 측량하려는 필요에서 태어난 학문이에요.',
        en:'The law of sines was studied by 10th–11th-century Persian mathematicians Abu al-Wafa and al-Biruni for astronomy (calculating star positions). Trigonometry was originally born from the need to measure the stars in the sky.',
        zh:'正弦定理由10至11世纪的波斯数学家阿布·瓦法和比鲁尼为天文学(计算星体位置)而研究。三角学最初正是为了测量天空中的星星而诞生的学问。' }
    },
    stages:[
      { tag:{ko:'① 변÷sin(대각) = 2R(외접원의 지름)',en:'1) side÷sin(opposite angle) = 2R (diameter of the circumcircle)',zh:'① 边÷sin(对角) = 2R(外接圆直径)'},
        head:{ko:'\\dfrac{6}{\\sin 30^\\circ} = 2R \\;\\Rightarrow\\; 2R=12',en:'\\dfrac{6}{\\sin 30^\\circ} = 2R \\;\\Rightarrow\\; 2R=12',zh:'\\dfrac{6}{\\sin 30^\\circ} = 2R \\;\\Rightarrow\\; 2R=12'},
        desc:{ko:'sin30°=1/2예요. 그러니 6÷(1/2)는 나눗셈이 아니라 <b>6×2=12</b>로 바로 계산돼요(분수로 나누는 건 그 역수를 곱하는 것과 같아요).',
              en:'sin30°=1/2. So 6÷(1/2) isn\'t really division at all — it\'s just <b>6×2=12</b> (dividing by a fraction means multiplying by its reciprocal).',
              zh:'sin30°=1/2。所以6÷(1/2)其实不是除法，直接是<b>6×2=12</b>(除以分数就是乘以它的倒数)。'},
        mathSteps:['\\sin 30^\\circ=\\dfrac{1}{2}', '6\\div\\dfrac{1}{2}', '=6\\times 2=12'],
        result:{ko:'sinA가 1/2이면 나눗셈이 곱셈(×2)으로 바뀌어요!',en:'When sinA is 1/2, the division turns into multiplication (×2)!',zh:'sinA是1/2时，除法就变成了乘法(×2)！'},
        book:{ko:'sin90°=1이면 6÷1=6, 그러니 90°일 땐 변의 길이가 곧 2R이 돼요.',
              en:'When sin90°=1, 6÷1=6 — so at 90°, the side length equals 2R directly.',
              zh:'sin90°=1时，6÷1=6——所以90°时边长本身就是2R。'} },

      { tag:{ko:'② 45°는 √2/2 — 근호가 그대로 남아요',en:'2) At 45°, √2/2 leaves a root behind',zh:'② 45°是√2/2——根号会留下来'},
        head:{ko:'\\dfrac{4}{\\sin 45^\\circ} = 2R \\;\\Rightarrow\\; 2R=4\\sqrt{2}',en:'\\dfrac{4}{\\sin 45^\\circ} = 2R \\;\\Rightarrow\\; 2R=4\\sqrt{2}',zh:'\\dfrac{4}{\\sin 45^\\circ} = 2R \\;\\Rightarrow\\; 2R=4\\sqrt{2}'},
        desc:{ko:'sin45°=√2/2예요. 4÷(√2/2)=4×(2/√2)=8/√2인데, 분모의 근호를 없애면(유리화) <b>4√2</b>가 돼요. 결과는 계수와 근호 안의 수, 두 정수로 받아요.',
              en:'sin45°=√2/2. So 4÷(√2/2)=4×(2/√2)=8/√2, and rationalizing the denominator gives <b>4√2</b>. The answer is entered as two integers: the coefficient and the number under the root.',
              zh:'sin45°=√2/2。4÷(√2/2)=4×(2/√2)=8/√2，把分母有理化后就是<b>4√2</b>。答案输入两个整数：系数和根号内的数。'},
        mathSteps:['\\sin 45^\\circ=\\dfrac{\\sqrt2}{2}', '4\\div\\dfrac{\\sqrt2}{2}', '=4\\sqrt2'],
        result:{ko:'45°는 √2/2라서 답에 근호가 그대로 남아요!',en:'At 45°, since sin is √2/2, the root stays in the answer!',zh:'45°时sin是√2/2，答案会留下根号！'},
        book:{ko:'60°(sin=√3/2)는 근호와 분수가 겹쳐 더 복잡해져서, 이 유닛에서는 정수·근호 두 형태로 딱 떨어지는 30°·45°·90°만 다뤄요.',
              en:'At 60° (sin=√3/2), root and fraction overlap and get messier — this unit sticks to 30°/45°/90°, which land cleanly on an integer or a root form.',
              zh:'60°(sin=√3/2)根号和分数叠在一起会更复杂——本单元只处理能干净落在整数或根号形式的30°·45°·90°。'} }
    ],
    rule:{ ko:'사인법칙 a/sinA = 2R — 30°·90°는 정수로, 45°는 [계수,근호안] 두 정수로 딱 떨어져요!',
      en:'The law of sines a/sinA = 2R — 30° and 90° land on an integer, while 45° lands on [coefficient, radicand], two integers!',
      zh:'正弦定理a/sinA = 2R——30°·90°得到整数，45°得到[系数,根号内]两个整数！' }
  },

  check:{
    fills:[
      { tex:'\\dfrac{8}{\\sin 90^\\circ} = 2R \\;\\Rightarrow\\; 2R = \\square', answer:8,
        hint:{ ko:'sin90°=1', en:'sin90°=1', zh:'sin90°=1' } },
      { tex:'\\dfrac{5}{\\sin 30^\\circ} = 2R \\;\\Rightarrow\\; 2R = \\square', answer:10,
        hint:{ ko:'5÷(1/2)=5×2', en:'5÷(1/2)=5×2', zh:'5÷(1/2)=5×2' } }
    ],
    open:{ ko:'6/sin45° = 2R을 유리화 과정과 함께 설명해봐요.',
      en:'Explain 6/sin45° = 2R, including the rationalizing step.',
      zh:'说说6/sin45° = 2R，包括有理化的过程。' },
    openHint:{ ko:'6÷(√2/2)=6×2/√2=12/√2=6√2',
      en:'6÷(√2/2)=6×2/√2=12/√2=6√2',
      zh:'6÷(√2/2)=6×2/√2=12/√2=6√2' }
  },

  lab:{
    generator:'md55_lawOfSines', level:'main', count:4,
    params:{mode:'root',wide:true},
    intro:{
      ko:'45°는 sinA=√2/2 — 나눗셈을 곱셈으로 바꾸고 유리화해요!',
      en:'At 45°, sinA=√2/2 — turn the division into multiplication and rationalize!',
      zh:'45°时sinA=√2/2——把除法变成乘法再有理化！'
    }
  },

  arena:{
    generator:'md55_lawOfSines', level:'main', count:8, timeLimit:300,
    params:{mode:'reverse',wide:true},
    rule:{ ko:'5분 안에 사인법칙을 거꾸로 써서 변까지 구해요!', en:'Reverse the law of sines to find the side, all within 5 minutes!', zh:'5分钟内反过来用正弦定理求出边长！' }
  },

  stamp:{ label:{ ko:'외접원 측량사', en:'Circumcircle Surveyor', zh:'外接圆测量师' }, coins:64 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'특수각의 사인값으로 외접원 지름까지 완벽하게 구했구나! 🔺',en:'You used the special-angle sine value to find the circumcircle diameter perfectly!',zh:'你用特殊角的正弦值完美求出了外接圆直径！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'분수로 나누는 건 그 역수를 곱하는 것과 같아!',en:'Dividing by a fraction is the same as multiplying by its reciprocal!',zh:'除以分数就是乘以它的倒数！'}, {ko:'45°는 sinA=√2/2 — 답에 근호가 남아!',en:'At 45°, sinA=√2/2 — the root stays in the answer!',zh:'45°时sinA=√2/2——答案里会留下根号！'} ],
    finish:{ ko:'완벽해! 외접원 측량사! 🔺✨', en:'Perfect! Circumcircle Surveyor!', zh:'完美！外接圆测量师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
