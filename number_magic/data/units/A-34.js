/* Numbers of Magic — 유닛 A-34: 합과 차 2 (초급 H 챕터5) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};
window.NM_UNITS['A-34'] = {
  id:'A-34', tier:'beginner', level:'A', order:34,
  generator:'sumAndDiff2',
  title:{ ko:'합과 차 2', en:'Sum and Difference 2', zh:'和与差 2' },
  subtitle:{ ko:'더 복잡한 합과 차 문제를 풀어봐요', en:'Solve more complex sum-and-difference problems', zh:'解决更复杂的和差问题' },
  icon:'🌟',

  practice:{
    generator:'sumAndDiff2', level:'practice', count:5,
    intro:{ ko:'합과 차 마법을 더 큰 수에 적용해봐요!', en:'Apply the sum-difference magic to larger numbers!', zh:'把和差魔法用于更大的数！' }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ ko:'① 더 큰 수로 합과 차를 적용해요', en:'1) Apply sum-difference to larger numbers', zh:'① 将和差法用于更大的数' },
        head:{ ko:'공식: 큰 수 = (합+차)÷2, 작은 수 = (합-차)÷2', en:'Formula: large=(sum+diff)÷2, small=(sum−diff)÷2', zh:'公式：大数=(和+差)÷2，小数=(和-差)÷2' },
        desc:{ ko:'합=150, 차=30. 큰 수=(150+30)÷2=90, 작은 수=(150-30)÷2=60!',
               en:'Sum=150, diff=30. Larger=(150+30)÷2=90, Smaller=(150−30)÷2=60!',
               zh:'和=150，差=30。大数=(150+30)÷2=90，小数=(150-30)÷2=60！' },
        mathSteps:[{ko:'합=150, 차=30',en:'\\text{sum}=150, \\text{diff}=30',zh:'和=150，差=30'},{ko:'큰 수 = (150+30) ÷ 2 = 180 ÷ 2 = 90',en:'\\text{bigger number} = (150+30) ÷ 2 = 180 ÷ 2 = 90',zh:'大数 = (150+30) ÷ 2 = 180 ÷ 2 = 90'},{ko:'작은 수 = (150-30) ÷ 2 = 120 ÷ 2 = 60',en:'\\text{smaller number} = (150-30) ÷ 2 = 120 ÷ 2 = 60',zh:'小数 = (150-30) ÷ 2 = 120 ÷ 2 = 60'},{ko:'검증: 90+60=150 ✓, 90-60=30 ✓',en:'\\text{check: } 90+60=150 ✓, 90-60=30 ✓',zh:'验算：90+60=150 ✓, 90-60=30 ✓'}],
        result:{ ko:'두 수는 90과 60 ✓', en:'The two numbers are 90 and 60 ✓', zh:'两数为90和60 ✓' },
        book:{ ko:'작은 수 구하는 공식: (합-차)÷2도 기억해요. 두 공식이 항상 맞는지 검증하는 습관을 들여요!', en:'Also remember: small=(sum−diff)÷2. Always verify both formulas!', zh:'也要记住：小数=(和-差)÷2。养成验证两个公式的好习惯！' } },
      { tag:{ ko:'② 실생활 문제에 적용해요', en:'2) Apply to real-life problems', zh:'② 应用于实际问题' },
        head:{ ko:'합과 차로 이야기 문제 풀기', en:'Solve word problems using sum and difference', zh:'用和差法解决应用题' },
        desc:{ ko:'두 학생의 점수 합이 160점이고 차이가 20점이에요. 높은 점수=(160+20)÷2=90점, 낮은 점수=160-90=70점!',
               en:'Two students: scores sum to 160, differ by 20. Higher=(160+20)÷2=90, Lower=160−90=70!',
               zh:'两位学生：分数之和160分，差20分。高分=(160+20)÷2=90，低分=160-90=70！' },
        mathSteps:[{ko:'합=160, 차=20',en:'\\text{sum}=160, \\text{diff}=20',zh:'和=160，差=20'},{ko:'높은 점수 = (160+20) ÷ 2 = 90',en:'\\text{higher score} = (160+20) ÷ 2 = 90',zh:'高分 = (160+20) ÷ 2 = 90'},{ko:'낮은 점수 = 160 - 90 = 70',en:'\\text{lower score} = 160 - 90 = 70',zh:'低分 = 160 - 90 = 70'}],
        result:{ ko:'90점과 70점 ✓', en:'90 and 70 points ✓', zh:'90分和70分 ✓' },
        book:null }
    ],
    rule:{ ko:'① 큰 수 = (합+차)÷2  ② 작은 수 = (합-차)÷2  ③ 또는 작은 수 = 합 - 큰 수',
      en:'① Larger = (sum+diff)÷2  ② Smaller = (sum−diff)÷2  ③ Or: smaller = sum − larger',
      zh:'①大数=(和+差)÷2 ②小数=(和-差)÷2 ③或：小数=和-大数' }
  },

  check:{
    fills:[
      { tex:{ko:'\\text{합}=150,\\text{차}=30: (150+30)\\div 2=\\square',en:'\\text{sum}=150,\\text{diff}=30: (150+30)\\div 2=\\square',zh:'\\text{和}=150,\\text{差}=30: (150+30)\\div 2=\\square'}, answer:90,
        hint:{ ko:'180÷2=90', en:'180÷2=90', zh:'180÷2=90' } },
      { tex:{ko:'(150-30)\\div 2=\\square \\text{(작은 수)}',en:'(150-30)\\div 2=\\square \\text{(smaller number)}',zh:'(150-30)\\div 2=\\square \\text{（较小的数）}'}, answer:60, hint:{ ko:'120÷2=60', en:'120÷2=60', zh:'120÷2=60' } }
    ],
    open:{ ko:'합과 차로 두 수를 구하는 공식 두 가지를 설명하고, 왜 두 공식이 모두 옳은지 설명해봐요.', en:'Explain both formulas for finding two numbers from their sum and difference, and why both are correct.', zh:'说说用和差求两数的两个公式，并解释为什么两个公式都正确。' },
    openHint:{ ko:'큰수=(합+차)÷2: 합에 차를 더하면 큰수 2배. 작은수=(합-차)÷2: 합에서 차를 빼면 작은수 2배.', en:'Large=(sum+diff)÷2: adding diff removes the smaller. Small=(sum−diff)÷2: subtracting diff removes the larger.', zh:'大数=(和+差)÷2：和加差后较小数消去；小数=(和-差)÷2：和减差后较大数消去。' }
  },

  lab:{ generator:'sumAndDiff2', level:'main', count:4,
    intro:{ ko:'합과 차 마법 Level 2! 더 큰 수로!', en:'Sum-difference magic level 2! Bigger numbers!', zh:'和差魔法2级！更大的数！' } },

  arena:{ generator:'sumAndDiff2', level:'main', count:8, timeLimit:300,
    rule:{ ko:'5분 안에 최대한! (합±차)÷2!', en:'As many as you can! (sum±diff)÷2!', zh:'5分钟内尽量多做！(和±差)÷2！' } },

  stamp:{ label:{ ko:'합과차2 마법사', en:'Sum-Diff2 Wizard', zh:'和差2魔法师' }, coins:20 },

  voice:{
    correct:[ {ko:'합과 차 2 완성! 🌟✨',en:'Sum-diff 2 complete!',zh:'和差2完成！✨'}, {ko:'큰 수와 작은 수 모두 찾았어!',en:'Found both numbers!',zh:'两数都找到了！'} ],
    wrong:[ {ko:'(합+차)÷2가 큰 수, (합-차)÷2가 작은 수야!',en:'(sum+diff)÷2 is larger, (sum−diff)÷2 is smaller!',zh:'(和+差)÷2是大数，(和-差)÷2是小数！'}, {ko:'두 공식을 기억해봐!',en:'Remember both formulas!',zh:'记住两个公式！'} ],
    finish:{ ko:'완벽해! 합과차2 마법사야! 🌟✨', en:"Perfect! You're a sum-diff2 wizard!", zh:'完美！你是和差2魔法师！' }
  }
};
if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
