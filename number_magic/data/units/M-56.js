/* Numbers of Magic — 유닛 M-56: 코사인법칙 (대수 W13 심화, 2026-08-27) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-56'] = {
  id:'M-56', tier:'algebra', level:'44', order:5,
  generator:'md56_lawOfCosines',
  title:{ ko:'코사인법칙', en:'Law of Cosines', zh:'余弦定理' },
  subtitle:{ ko:'두 변과 낀각으로 나머지 한 변을 구해요', en:'Find the third side from two sides and the included angle', zh:'用两边及夹角求第三边' },
  icon:'📐',

  practice:{
    generator:'md56_lawOfCosines', level:'practice', count:5,
    params:{mode:'right'},
    intro:{
      ko:'코사인법칙 a²=b²+c²-2bc·cosA — cos90°=0이면 마지막 항이 사라져서 피타고라스 정리와 똑같아져요!',
      en:'The law of cosines a²=b²+c²-2bc·cosA — when cos90°=0, the last term vanishes and it becomes exactly the Pythagorean theorem!',
      zh:'余弦定理a²=b²+c²-2bc·cosA——cos90°=0时最后一项消失，就和勾股定理一模一样！'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'피타고라스 정리(a²=b²+c²)는 직각(90°)일 때만 쓸 수 있어요. 그런데 각이 90°가 아니라면 어떻게 할까요? 코사인법칙은 피타고라스 정리를 어떤 각에서도 쓸 수 있게 "확장"한 공식이에요.',
        en:'The Pythagorean theorem (a²=b²+c²) only works for a right angle (90°). But what if the angle isn\'t 90°? The law of cosines is a formula that "extends" the Pythagorean theorem to work for any angle.',
        zh:'勾股定理(a²=b²+c²)只在直角(90°)时才能用。但如果角不是90°呢？余弦定理正是把勾股定理"推广"到能用于任意角的公式。' },
      history:{ ko:'코사인법칙의 원형은 유클리드의 『원론』(기원전 3세기)에 도형으로 이미 나와 있었어요. 지금과 같은 대수식 형태로 정리된 건 16세기 프랑스 수학자 비에트예요.',
        en:'An early form of the law of cosines already appeared geometrically in Euclid\'s "Elements" (3rd century BCE). It was organized into today\'s algebraic form by the 16th-century French mathematician François Viète.',
        zh:'余弦定理的雏形早在欧几里得《几何原本》(公元前3世纪)中就以图形形式出现。整理成今天这样的代数式形式，是16世纪法国数学家韦达完成的。' }
    },
    stages:[
      { tag:{ko:'① cos90°=0이면 피타고라스 정리와 같아요',en:'1) With cos90°=0, it\'s the same as the Pythagorean theorem',zh:'① cos90°=0时就和勾股定理相同'},
        head:{ko:'b=3,\\;c=4,\\;A=90^\\circ \\;\\Rightarrow\\; a=5',en:'b=3,\\;c=4,\\;A=90^\\circ \\;\\Rightarrow\\; a=5',zh:'b=3,\\;c=4,\\;A=90^\\circ \\;\\Rightarrow\\; a=5'},
        desc:{ko:'a²=b²+c²-2bc·cosA에서 cos90°=0이니 마지막 항이 통째로 사라져요: <b>a²=b²+c²=3²+4²=25</b>. 제곱근을 취하면 a=5(피타고라스 정리와 똑같아요).',
              en:'In a²=b²+c²-2bc·cosA, since cos90°=0, the last term vanishes entirely: <b>a²=b²+c²=3²+4²=25</b>. Taking the square root gives a=5 (exactly the Pythagorean theorem).',
              zh:'a²=b²+c²-2bc·cosA中，cos90°=0，最后一项整个消失：<b>a²=b²+c²=3²+4²=25</b>。开平方得a=5(和勾股定理一模一样)。'},
        mathSteps:['3^2+4^2', '=9+16=25', 'a=5'],
        result:{ko:'A=90°이면 코사인법칙이 피타고라스 정리로 그대로 돌아가요!',en:'When A=90°, the law of cosines reduces exactly to the Pythagorean theorem!',zh:'A=90°时，余弦定理直接变回勾股定理！'},
        book:{ko:'a²이 나오면 마지막에 반드시 제곱근을 취해야 진짜 변의 길이 a가 나와요.',
              en:'Once you get a², you must take the square root at the end to get the actual side length a.',
              zh:'求出a²后一定要开平方才能得到真正的边长a。'} },

      { tag:{ko:'② cos60°=1/2이면 항이 그대로 남아요',en:'2) With cos60°=1/2, the term stays',zh:'② cos60°=1/2时那一项会留下来'},
        head:{ko:'b=3,\\;c=8,\\;A=60^\\circ \\;\\Rightarrow\\; a=7',en:'b=3,\\;c=8,\\;A=60^\\circ \\;\\Rightarrow\\; a=7',zh:'b=3,\\;c=8,\\;A=60^\\circ \\;\\Rightarrow\\; a=7'},
        desc:{ko:'cos60°=1/2이니 −2bc×(1/2)=<b>−bc</b>로 정리돼요: a²=b²+c²−bc=9+64−24=49. 제곱근을 취하면 a=7.',
              en:'Since cos60°=1/2, −2bc×(1/2) simplifies to <b>−bc</b>: a²=b²+c²−bc=9+64−24=49. Taking the square root gives a=7.',
              zh:'cos60°=1/2，−2bc×(1/2)化简为<b>−bc</b>：a²=b²+c²−bc=9+64−24=49。开平方得a=7。'},
        mathSteps:['3^2+8^2-3\\times 8', '=9+64-24', '=49\\;\\Rightarrow\\;a=7'],
        result:{ko:'cos60°=1/2이면 −2bc·cosA는 −bc로 간단해져요!',en:'When cos60°=1/2, the term −2bc·cosA simplifies to −bc!',zh:'cos60°=1/2时，−2bc·cosA化简为−bc！'},
        book:{ko:'A=120°(cos=−1/2)이면 부호가 반대가 되어 −2bc×(−1/2)=+bc가 돼요 — 세 변이 모두 더 길게 벌어지는 둔각 삼각형이에요.',
              en:'At A=120° (cos=−1/2), the sign flips: −2bc×(−1/2)=+bc — this is an obtuse triangle where the third side stretches out longer.',
              zh:'A=120°(cos=−1/2)时符号反转：−2bc×(−1/2)=+bc——这是第三边更长的钝角三角形。'} }
    ],
    rule:{ ko:'코사인법칙 a²=b²+c²-2bc·cosA — cos90°=0(사라짐), cos60°=1/2(−bc), cos120°=−1/2(+bc)로 딱 떨어지는 각만 다뤄요!',
      en:'The law of cosines a²=b²+c²-2bc·cosA — we only use angles landing cleanly: cos90°=0 (vanishes), cos60°=1/2 (−bc), cos120°=−1/2 (+bc)!',
      zh:'余弦定理a²=b²+c²-2bc·cosA——只处理能干净落定的角：cos90°=0(消失)、cos60°=1/2(−bc)、cos120°=−1/2(+bc)！' }
  },

  check:{
    fills:[
      { tex:'b=6,\\;c=8,\\;A=90^\\circ \\;\\Rightarrow\\; a = \\square', answer:10,
        hint:{ ko:'6²+8²=100', en:'6²+8²=100', zh:'6²+8²=100' } },
      { tex:'b=5,\\;c=8,\\;A=60^\\circ \\;\\Rightarrow\\; a = \\square', answer:7,
        hint:{ ko:'25+64-40=49', en:'25+64-40=49', zh:'25+64-40=49' } }
    ],
    open:{ ko:'b=6, c=10, A=120°일 때 a를 구하는 과정을 설명해봐요.',
      en:'Explain how to find a when b=6, c=10, A=120°.',
      zh:'说说b=6，c=10，A=120°时求a的过程。' },
    openHint:{ ko:'a²=36+100+60=196, a=14',
      en:'a²=36+100+60=196, a=14',
      zh:'a²=36+100+60=196，a=14' }
  },

  lab:{
    generator:'md56_lawOfCosines', level:'main', count:4,
    params:{mode:'sixty'},
    intro:{
      ko:'cos60°=1/2 — −2bc·cosA는 −bc로 간단해져요!',
      en:'cos60°=1/2 — the term −2bc·cosA simplifies to −bc!',
      zh:'cos60°=1/2——−2bc·cosA化简为−bc！'
    }
  },

  arena:{
    generator:'md56_lawOfCosines', level:'main', count:8, timeLimit:300,
    params:{mode:'oneTwenty'},
    rule:{ ko:'5분 안에 둔각(120°) 삼각형의 변까지 모두 구해요!', en:'Find every side of an obtuse (120°) triangle, all within 5 minutes!', zh:'5分钟内求出所有120°钝角三角形的边！' }
  },

  stamp:{ label:{ ko:'삼각형 측량사', en:'Triangle Surveyor', zh:'三角形测量师' }, coins:66 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'코사인법칙으로 세 번째 변까지 완벽하게 구했구나! 📐',en:'You used the law of cosines to find the third side perfectly!',zh:'你用余弦定理完美求出了第三边！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'cos90°=0이면 마지막 항이 사라져!',en:'When cos90°=0, the last term vanishes!',zh:'cos90°=0时最后一项就消失！'}, {ko:'a²을 구했으면 마지막에 제곱근을 잊지 마!',en:'Once you have a², don\'t forget the square root at the end!',zh:'求出a²后别忘了最后开平方！'} ],
    finish:{ ko:'완벽해! 삼각형 측량사! 📐✨', en:'Perfect! Triangle Surveyor!', zh:'完美！三角形测量师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
