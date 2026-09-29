/* Numbers of Magic — 유닛 M-114: 뽑아서 나열하기와 도형의 개수 (고등 공통수학1 · 과정 47, 2026-09-29)
   근거: docs/high-build-spec.md MD114. 예시는 새로 만들었다. */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-114'] = {
  id:'M-114', tier:'highmath1', level:'47', order:114,
  generator:'md114_selectArrange',
  title:{ ko:'뽑아서 나열하기와 도형의 개수', en:'Choose-then-Arrange & Counting Figures', zh:'先选后排与图形的个数' },
  subtitle:{ ko:'먼저 고르고(조합) 그다음 늘어놓습니다(순열)', en:'Choose first (combination), then arrange (permutation)', zh:'先选(组合)后排(排列)' },
  icon:'✳️',

  practice:{
    generator:'md114_selectArrange', level:'practice', count:6,
    params:{mode:'arrange'},
    intro:{
      ko:'조건에 맞게 사람을 먼저 고르고(조합), 고른 사람을 한 줄로 세우는 수(r!)를 곱합니다.',
      en:'First choose people to meet the condition (combination), then multiply by the ways to line them up (r!).',
      zh:'先按条件选人(组合)，再乘以把选出的人排成一排的方法数(r!)。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'"남학생 둘, 여학생 하나를 뽑아 줄 세우기"는 두 단계입니다. 누구를 뽑을지는 순서가 없고, 줄 세우기에는 순서가 있습니다. 점으로 직선이나 삼각형을 만들 때도 결국 점을 고르는 조합입니다.',
        en:'"Choose two boys and one girl and line them up" has two stages: who is chosen has no order, but the line-up does. Making lines or triangles from points is also just choosing points.',
        zh:'"选两名男生一名女生并排队"分两步：选谁不计顺序，排队计顺序。用点构成直线或三角形，归根到底也是选点的组合。' }
    },
    stages:[
      { tag:{ko:'① 고르고 나서 늘어놓기',en:'1) Choose, then arrange',zh:'① 先选再排'},
        head:{ko:'{}_{4}\\mathrm{C}_{2}\\times{}_{3}\\mathrm{C}_{1}\\times3!=108',en:'{}_{4}\\mathrm{C}_{2}\\times{}_{3}\\mathrm{C}_{1}\\times3!=108',zh:'{}_{4}\\mathrm{C}_{2}\\times{}_{3}\\mathrm{C}_{1}\\times3!=108'},
        desc:{ko:'남학생 4 명에서 2 명(6가지), 여학생 3 명에서 1 명(3가지)을 고르고, 세 사람을 줄 세우는 3!=6 을 곱해 <b>108</b> 가지입니다.',
              en:'Choose 2 of 4 boys (6 ways) and 1 of 3 girls (3 ways), then multiply by 3!=6 line-ups: <b>108</b>.',
              zh:'从4名男生选2人(6种)，从3名女生选1人(3种)，再乘3人排队的3!=6，得<b>108</b>种。'},
        mathSteps:['6\\times3\\times6=108'],
        result:{ko:'조합 × 순열!',en:'Combination × permutation!',zh:'组合×排列！'},
        book:{ko:'A 를 반드시 포함하면 A 를 넣고 나머지에서 한 명 적게 고른 뒤 줄 세웁니다.',
              en:'If A must be included, put A in, choose one fewer from the rest, then line up.',
              zh:'必须包括A时，先放入A，从其余人中少选一人，再排队。'} },

      { tag:{ko:'② 직선과 대각선',en:'2) Lines and diagonals',zh:'② 直线与对角线'},
        head:{ko:'{}_{6}\\mathrm{C}_{2}=15',en:'{}_{6}\\mathrm{C}_{2}=15',zh:'{}_{6}\\mathrm{C}_{2}=15'},
        desc:{ko:'원 위의 점 6 개에서 두 점을 고르면 직선이 하나씩 생겨 <b>15</b> 개입니다. 육각형이라면 변 6 개를 빼서 대각선은 <b>9</b> 개입니다.',
              en:'Each pair of the 6 points on a circle gives one line: <b>15</b>. For a hexagon, remove the 6 sides to get <b>9</b> diagonals.',
              zh:'圆上6个点每取两点得一条直线，共<b>15</b>条。若是六边形，减去6条边得<b>9</b>条对角线。'},
        mathSteps:['15-6=9'],
        result:{ko:'두 점을 고르면 직선 하나!',en:'Two points, one line!',zh:'两点确定一条直线！'},
        book:{ko:'k 개의 점이 한 직선 위에 있으면 ₖC₂ 개가 한 직선으로 겹치므로 ₖC₂ 를 빼고 1 을 더합니다.',
              en:'If k points lie on one line, their ₖC₂ lines are the same line: subtract ₖC₂ and add 1.',
              zh:'若k点共线，它们的ₖC₂条直线重合为一条：减去ₖC₂再加1。'} },

      { tag:{ko:'③ 삼각형',en:'3) Triangles',zh:'③ 三角形'},
        head:{ko:'{}_{7}\\mathrm{C}_{3}-{}_{4}\\mathrm{C}_{3}=31',en:'{}_{7}\\mathrm{C}_{3}-{}_{4}\\mathrm{C}_{3}=31',zh:'{}_{7}\\mathrm{C}_{3}-{}_{4}\\mathrm{C}_{3}=31'},
        desc:{ko:'점 7 개 가운데 4 개가 한 직선 위에 있으면, 그 4 개에서 고른 세 점은 삼각형이 되지 않습니다. 35−4=<b>31</b> 개입니다.',
              en:'If 4 of 7 points lie on one line, any three chosen from those 4 make no triangle: 35−4=<b>31</b>.',
              zh:'7个点中有4个共线时，从这4个中取的三点不能构成三角形：35−4=<b>31</b>个。'},
        mathSteps:['35-4=31'],
        result:{ko:'한 직선 위의 세 점은 삼각형이 아닙니다!',en:'Three points on one line are not a triangle!',zh:'共线的三点不是三角形！'},
        book:{ko:'평행한 두 직선 위의 점이면 한 직선에서 두 점, 다른 직선에서 한 점을 고릅니다.',
              en:'With points on two parallel lines, take two points from one line and one from the other.',
              zh:'点在两条平行线上时，从一条线取两点，另一条取一点。'} }
    ],
    rule:{ ko:'① 뽑아서 나열 = 조합 × r!  ② 직선은 ₙC₂, 겹치는 직선은 빼고 1 을 더한다  ③ 삼각형은 ₙC₃ 에서 한 직선 위의 세 점을 뺍니다',
      en:'① Choose-then-arrange = combination × r!  ② Lines: ₙC₂, merge coinciding lines  ③ Triangles: ₙC₃ minus collinear triples',
      zh:'① 先选后排=组合×r!  ② 直线ₙC₂，重合的合并  ③ 三角形ₙC₃减去共线的三点组' }
  },

  check:{
    fills:[
      { tex:{ko:'\\text{원 위의 점 }5\\text{개로 만드는 삼각형의 개수}=\\square',en:'\\text{triangles from }5\\text{ points on a circle}=\\square',zh:'\\text{圆上}5\\text{个点构成的三角形个数}=\\square'}, answer:10,
        hint:{ ko:'₅C₃', en:'₅C₃', zh:'₅C₃' } },
      { tex:{ko:'\\text{오각형의 대각선의 개수}=\\square',en:'\\text{diagonals of a pentagon}=\\square',zh:'\\text{五边形的对角线条数}=\\square'}, answer:5,
        hint:{ ko:'₅C₂−5', en:'₅C₂−5', zh:'₅C₂−5' } }
    ],
    open:{ ko:'평행한 두 직선 위에 점이 각각 3 개, 4 개 있을 때 삼각형의 개수를 구하는 과정을 설명해 봅니다.',
      en:'Explain how to count the triangles when two parallel lines carry 3 and 4 points.',
      zh:'说说两条平行线上分别有3个和4个点时三角形个数的求法。' },
    openHint:{ ko:'₃C₂×4+3×₄C₂=12+18=30 개입니다.',
      en:'₃C₂×4+3×₄C₂=12+18=30.',
      zh:'₃C₂×4+3×₄C₂=12+18=30个。' }
  },

  lab:{
    generator:'md114_selectArrange', level:'main', count:6,
    params:{mode:'lines'},
    intro:{
      ko:'두 점을 고르면 직선 하나입니다. 한 직선 위의 점이 있으면 겹치는 직선을 하나로 합칩니다.',
      en:'Two points make one line; if some points are collinear, merge the coinciding lines into one.',
      zh:'两点确定一条直线；有共线点时把重合的直线合为一条。'
    }
  },

  arena:{
    generator:'md114_selectArrange', level:'main', count:6, timeLimit:480,
    params:{mode:'triangles'},
    rule:{ ko:'8분 안에 삼각형의 개수를 모두 셉니다!', en:'Count every set of triangles within 8 minutes!', zh:'8分钟内数完所有三角形！' }
  },

  stamp:{ label:{ ko:'도형 셈꾼', en:'Figure Counter', zh:'图形计数师' }, coins:51 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'고르고 세우기까지 완벽해! ✳️',en:'Choosing and arranging, both perfect!',zh:'选和排都完美！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'먼저 고르고, 그다음 줄 세워!',en:'Choose first, then line up!',zh:'先选，再排！'}, {ko:'한 직선 위의 점을 빼는 걸 잊지 마!',en:'Do not forget to remove collinear points!',zh:'别忘了去掉共线的点！'} ],
    finish:{ ko:'완벽해! 도형 셈꾼! ✳️✨', en:'Perfect! Figure Counter!', zh:'完美！图形计数师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
