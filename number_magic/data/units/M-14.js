/* Numbers of Magic — 유닛 M-14: 등식의 변형(이항 감각) (중등 W9 · 중2 식의 계산) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-14'] = {
  id:'M-14', tier:'middle2', level:'33', order:14,
  generator:'md14_isolateX',
  title:{ ko:'등식의 변형', en:'Transforming Equations', zh:'等式的变形' },
  subtitle:{ ko:'등호를 건너가면 부호가 옷을 갈아입어요', en:'Cross the equals sign and the sign changes its coat', zh:'跨过等号，符号就要换件衣服' },
  icon:'⚖️',

  practice:{
    generator:'md14_isolateX', level:'practice', count:5,
    params:{mode:'add'},
    intro:{
      ko:'저울이 평형이면(=), 한쪽에서 뭔가를 빼면 반대쪽도 똑같이 빼야 평형이 유지돼요. 이걸 식으로 나타낸 게 "이항"이에요.',
      en:'When a scale is balanced (=), if you remove something from one side, you must remove the same from the other to keep it balanced. Writing this as an equation is called "transposition."',
      zh:'天平平衡时(=)，一边拿掉一些东西，另一边也要拿掉一样多才能保持平衡。用式子表示这个过程就叫"移项"。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'양팔저울이 평형을 이루고 있어요. 한쪽 접시에서 추 5개를 덜어내면, 평형을 유지하려면 반대쪽은 어떻게 해야 할까요?',
        en:'A two-pan balance is level. If you take 5 weights off one pan, what must happen on the other side to keep it balanced?',
        zh:'天平处于平衡状态。如果从一边拿掉5个砝码，另一边要怎么做才能保持平衡？' },
      history:{ ko:'"이항"의 영어 transposition은 "자리를 바꾼다"는 뜻의 라틴어에서 왔어요. 9세기 수학자 알콰리즈미의 책 제목에 있는 "al-jabr"(복원하다, 맞추다)가 바로 지금의 "algebra"(대수학)의 어원이에요 — 등식을 맞추는 이 기술 자체가 대수학의 이름이 된 거예요.',
        en:'The word "transposition" comes from Latin meaning "to change places." The 9th-century mathematician al-Khwarizmi wrote a book whose title included "al-jabr" (to restore, to balance) — the very origin of the word "algebra." The technique of balancing equations literally became algebra\'s name.',
        zh:'"移项"(transposition)一词源自拉丁语，意为"换位置"。9世纪数学家花拉子米的书名中有"al-jabr"(复原、配平)一词——这正是"代数"(algebra)一词的来源。配平等式的这项技术，本身就成了代数学的名字。' }
    },
    stages:[
      { tag:{ko:'① 등호를 넘어가면 부호가 바뀜',en:'1) Cross the equals sign and the sign flips',zh:'① 跨过等号，符号就变'},
        head:{ko:'x + 7 = 12 \\;\\Rightarrow\\; x = 12 - 7',en:'x + 7 = 12 \\;\\Rightarrow\\; x = 12 - 7',zh:'x + 7 = 12 \\;\\Rightarrow\\; x = 12 - 7'},
        desc:{ko:'양변에서 7을 똑같이 빼면 x + 7 - 7 = 12 - 7, 즉 x = 12 - 7이 돼요. 결과만 보면 <b>좌변의 +7이 우변으로 넘어가며 -7로 바뀐 것</b>과 똑같아요 — 이게 "이항"이에요.',
              en:'Subtract 7 from both sides equally: x + 7 - 7 = 12 - 7, giving x = 12 - 7. Looking only at the result, it\'s exactly as if <b>the +7 on the left crossed over to the right and became -7</b> — that\'s "transposition."',
              zh:'两边同时减去7：x + 7 - 7 = 12 - 7，也就是x = 12 - 7。只看结果，就好像<b>左边的+7跨到了右边变成-7</b>——这就是"移项"。'},
        mathSteps:['x+7=12', 'x+7-7=12-7', 'x=12-7'],
        result:{ko:'양변에서 같은 걸 빼는 것 = 부호를 바꿔 반대쪽으로 넘기는 것!',en:'Subtracting the same thing from both sides = flipping the sign and moving it across!',zh:'两边同时减去相同的数＝变号后移到对面！'},
        book:{ko:'등식의 성질: 양변에 같은 수를 더하거나 빼도 등식은 유지돼요. 그 결과를 "이항(부호를 바꿔 반대쪽으로 옮김)"으로 간단히 나타내요.',
              en:'Property of equality: adding or subtracting the same number from both sides keeps the equation true. We express the result simply as "transposition" — moving a term across with its sign flipped.',
              zh:'等式的性质：两边同时加上或减去相同的数，等式仍然成立。这个结果可以简单地表示为"移项"(变号后移到对面)。'} },

      { tag:{ko:'② 계수가 있으면 나눗셈까지 완주',en:'2) With a coefficient, finish by dividing',zh:'② 有系数时，最后再除一次'},
        head:{ko:'3x + 4 = 19 \\;\\Rightarrow\\; x = 5',en:'3x + 4 = 19 \\;\\Rightarrow\\; x = 5',zh:'3x + 4 = 19 \\;\\Rightarrow\\; x = 5'},
        desc:{ko:'먼저 상수항 4를 이항해요: 3x = 19 - 4 = 15. 그다음 x의 계수 3으로 양변을 나눠요: x = 15÷3 = 5. <b>이항 → 나눗셈</b>, 이 두 단계면 x가 완전히 혼자 남아요.',
              en:'First transpose the constant 4: 3x = 19 - 4 = 15. Then divide both sides by the coefficient of x, 3: x = 15÷3 = 5. <b>Transpose, then divide</b> — those two steps leave x completely alone.',
              zh:'先移项常数4：3x = 19 - 4 = 15。再用x的系数3除以两边：x = 15÷3 = 5。<b>先移项，再除</b>，这两步就能让x单独留下。'},
        mathSteps:['3x+4=19', '3x=19-4=15', 'x=15\\div3=5'],
        result:{ko:'상수항을 이항하고, x의 계수로 나누면 x만 남아요!',en:'Transpose the constant, then divide by the coefficient of x, and x stands alone!',zh:'移项常数，再除以x的系数，x就单独留下了！'},
        book:{ko:'ax+b=c 꼴의 등식은 ①b를 이항(ax=c-b) ②양변을 a로 나누기(x=(c-b)/a) 두 단계로 x를 구해요.',
              en:'For an equation shaped ax+b=c, find x in two steps: ① transpose b (ax=c-b) ② divide both sides by a (x=(c-b)/a).',
              zh:'ax+b=c形式的等式，求x分两步：①移项b(ax=c-b) ②两边除以a(x=(c-b)/a)。'} }
    ],
    rule:{ ko:'① 양변에 같은 수를 더하거나 빼도 등식은 유지  ② 결과적으로 등호를 넘어가면 부호가 바뀜(이항)  ③ 계수가 있으면 이항 후 그 계수로 나눔',
      en:'① Adding/subtracting the same number from both sides keeps the equation true  ② The result: crossing the equals sign flips the sign (transposition)  ③ With a coefficient, transpose first, then divide by it',
      zh:'① 两边同加减相同的数，等式仍成立  ② 结果：跨过等号符号就变(移项)  ③ 有系数时先移项，再除以这个系数' }
  },

  check:{
    fills:[
      { tex:'x + 9 = 20 \\;\\Rightarrow\\; x = 20 - \\square', answer:9,
        hint:{ ko:'넘어간 수는 그대로, 부호만 바뀜', en:'The number stays the same, only the sign flips', zh:'数不变，只是符号变了' } },
      { tex:'x - 6 = 11 \\;\\Rightarrow\\; x = 11 + \\square', answer:6,
        hint:{ ko:'-6이 이항하면 +6', en:'-6 becomes +6 when transposed', zh:'-6移项后变成+6' } }
    ],
    open:{ ko:'2x + 3 = 17에서 x는 어떻게 구할까요?',
      en:'How do you find x in 2x + 3 = 17?',
      zh:'2x + 3 = 17怎么求x？' },
    openHint:{ ko:'3을 이항: 2x=17-3=14, 2로 나눔: x=14÷2=7',
      en:'Transpose 3: 2x=17-3=14, divide by 2: x=14÷2=7',
      zh:'移项3：2x=17-3=14，除以2：x=14÷2=7' }
  },

  lab:{
    generator:'md14_isolateX', level:'main', count:4,
    params:{mode:'sub'},
    intro:{
      ko:'이번엔 뺄셈이 있는 식! -가 이항하면 +로 바뀌는 걸 확인해봐.',
      en:'This time there\'s subtraction! Watch how − becomes + when transposed.',
      zh:'这次是有减法的式子！看看−移项后是怎么变成+的。'
    }
  },

  arena:{
    generator:'md14_isolateX', level:'main', count:8, timeLimit:300,
    params:{mode:'solve'},
    rule:{ ko:'5분 안에 이항→나눗셈까지 완주하는 문제를 모두 풀어요!', en:'Solve all the transpose-then-divide problems in 5 minutes!', zh:'5分钟内解答所有先移项再除法的题目！' }
  },

  stamp:{ label:{ ko:'등식 저울사', en:'Equation Balancer', zh:'等式天平师' }, coins:44 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'저울의 균형을 정확히 맞췄어! ⚖️',en:'You kept the scale perfectly balanced!',zh:'天平配平得很准确！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'등호를 넘어가면 부호가 바뀌는 걸 기억해!',en:'Remember: the sign flips when it crosses the equals sign!',zh:'记得跨过等号符号会变！'}, {ko:'상수항을 먼저 이항하고 계수로 나눠봐!',en:'Transpose the constant first, then divide by the coefficient!',zh:'先移项常数，再除以系数试试！'} ],
    finish:{ ko:'완벽해! 등식 저울사! ⚖️✨', en:'Perfect! Equation Balancer!', zh:'完美！等式天平师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
