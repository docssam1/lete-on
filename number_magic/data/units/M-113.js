/* Numbers of Magic — 유닛 M-113: 조합 (고등 공통수학1 · 과정 47, 2026-09-29)
   근거: docs/high-build-spec.md MD113. 예시는 새로 만들었다. 역사 문단은 널리 알려진 사실만. */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-113'] = {
  id:'M-113', tier:'highmath1', level:'47', order:113,
  generator:'md113_comb',
  title:{ ko:'조합', en:'Combinations', zh:'组合' },
  subtitle:{ ko:'순서 없이 고르는 경우의 수', en:'Counting choices without order', zh:'不计顺序的选法数' },
  icon:'🧺',

  practice:{
    generator:'md113_comb', level:'practice', count:6,
    params:{mode:'value'},
    intro:{
      ko:'ₙCᵣ 는 ₙPᵣ 를 r! 로 나눈 값입니다. ₙCᵣ=ₙCₙ₋ᵣ 도 씁니다.',
      en:'ₙCᵣ is ₙPᵣ divided by r!. Also use ₙCᵣ=ₙCₙ₋ᵣ.',
      zh:'ₙCᵣ等于ₙPᵣ除以r!。也会用到ₙCᵣ=ₙCₙ₋ᵣ。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'대표 두 명을 뽑을 때 "A, B" 와 "B, A" 는 같은 뽑기입니다. 순열로 센 뒤, 같은 묶음이 몇 번씩 겹쳐 세어졌는지로 나누면 조합이 됩니다.',
        en:'When picking two representatives, "A, B" and "B, A" are the same choice. Count as permutations, then divide by how many times each group was counted.',
        zh:'选两名代表时，"A, B"和"B, A"是同一种选法。先按排列计数，再除以每组被重复计算的次数，就是组合。' },
      history:{ ko:'17세기 프랑스의 파스칼은 ₙCᵣ 가 늘어선 수의 삼각형을 자세히 연구했습니다. 이 삼각형은 13세기 중국의 양휘도 소개해 중국에서는 "양휘의 삼각형"이라 부릅니다.',
        en:'In 17th-century France, Pascal studied in detail the triangle of numbers formed by the ₙCᵣ. The same triangle had been described in 13th-century China by Yang Hui, and there it is called Yang Hui\'s triangle.',
        zh:'17世纪法国的帕斯卡详细研究了由ₙCᵣ排成的数字三角形。13世纪中国的杨辉也介绍过这个三角形，在中国称为"杨辉三角"。' }
    },
    stages:[
      { tag:{ko:'① ₙCᵣ=ₙPᵣ÷r!',en:'1) ₙCᵣ=ₙPᵣ÷r!',zh:'① ₙCᵣ=ₙPᵣ÷r!'},
        head:{ko:'{}_{5}\\mathrm{C}_{2}=\\dfrac{5\\times4}{2\\times1}=10',en:'{}_{5}\\mathrm{C}_{2}=\\dfrac{5\\times4}{2\\times1}=10',zh:'{}_{5}\\mathrm{C}_{2}=\\dfrac{5\\times4}{2\\times1}=10'},
        desc:{ko:'5 명에서 2 명을 줄 세우면 20 가지이고, 뽑힌 두 사람의 순서 2! 만큼 겹쳐 셌으므로 나누어 <b>10</b> 가지입니다.',
              en:'Lining up 2 of 5 people gives 20, but each pair was counted 2! times, so divide: <b>10</b>.',
              zh:'从5人中选2人排队有20种，每对被计算了2!次，除去得<b>10</b>种。'},
        mathSteps:['20\\div2=10'],
        result:{ko:'순서를 지우려면 r! 로 나눕니다!',en:'Divide by r! to forget the order!',zh:'除以r!就去掉了顺序！'},
        book:{ko:'ₙC₀=1, ₙCₙ=1 로 약속합니다.',
              en:'We agree that ₙC₀=1 and ₙCₙ=1.',
              zh:'规定ₙC₀=1，ₙCₙ=1。'} },

      { tag:{ko:'② 고르는 것과 남기는 것',en:'2) Choosing equals leaving',zh:'② 选出与留下'},
        head:{ko:'{}_{10}\\mathrm{C}_{8}={}_{10}\\mathrm{C}_{2}=45',en:'{}_{10}\\mathrm{C}_{8}={}_{10}\\mathrm{C}_{2}=45',zh:'{}_{10}\\mathrm{C}_{8}={}_{10}\\mathrm{C}_{2}=45'},
        desc:{ko:'10 명에서 8 명을 뽑는 것은 뽑히지 않을 2 명을 고르는 것과 같습니다. 그래서 <b>ₙCᵣ=ₙCₙ₋ᵣ</b> 입니다.',
              en:'Choosing 8 of 10 is the same as choosing the 2 who are left out, so <b>ₙCᵣ=ₙCₙ₋ᵣ</b>.',
              zh:'从10人中选8人，等于选出不被选的2人，所以<b>ₙCᵣ=ₙCₙ₋ᵣ</b>。'},
        mathSteps:['\\dfrac{10\\times9}{2\\times1}=45'],
        result:{ko:'작은 쪽으로 바꾸어 계산하면 빠릅니다!',en:'Switch to the smaller side for speed!',zh:'换成小的一边算更快！'},
        book:{ko:'A 를 반드시 뽑으면 A 를 빼고 남은 사람에서 한 명 적게 뽑습니다.',
              en:'If A must be chosen, remove A and choose one fewer from the rest.',
              zh:'A一定被选时，去掉A，从其余人中少选一人。'} },

      { tag:{ko:'③ "적어도"는 전체에서 빼기',en:'3) "At least": subtract from the total',zh:'③ "至少"用全部去减'},
        head:{ko:'{}_{7}\\mathrm{C}_{3}-{}_{4}\\mathrm{C}_{3}=31',en:'{}_{7}\\mathrm{C}_{3}-{}_{4}\\mathrm{C}_{3}=31',zh:'{}_{7}\\mathrm{C}_{3}-{}_{4}\\mathrm{C}_{3}=31'},
        desc:{ko:'남학생 4 명, 여학생 3 명에서 3 명을 뽑을 때 여학생이 적어도 한 명인 경우는 전체 35 에서 남학생만 뽑는 4 를 빼서 <b>31</b> 입니다.',
              en:'Choosing 3 from 4 boys and 3 girls with at least one girl: the total 35 minus the 4 all-boy choices gives <b>31</b>.',
              zh:'从4名男生、3名女生中选3人，至少一名女生：全部35减去只选男生的4，得<b>31</b>。'},
        mathSteps:['35-4=31'],
        result:{ko:'반대 경우가 하나뿐이면 빼기가 빠릅니다!',en:'When the opposite is one case, subtract!',zh:'相反情况只有一种时，用减法更快！'},
        book:{ko:'"남학생 2 명, 여학생 1 명"처럼 정해지면 ₄C₂×₃C₁=18 로 곱합니다.',
              en:'For an exact split such as 2 boys and 1 girl, multiply ₄C₂×₃C₁=18.',
              zh:'像"2名男生、1名女生"这样确定时，相乘₄C₂×₃C₁=18。'} }
    ],
    rule:{ ko:'① ₙCᵣ=ₙPᵣ÷r!  ② ₙCᵣ=ₙCₙ₋ᵣ  ③ "적어도"는 전체에서 반대 경우를 뺍니다',
      en:'① ₙCᵣ=ₙPᵣ÷r!  ② ₙCᵣ=ₙCₙ₋ᵣ  ③ "At least": total minus the opposite case',
      zh:'① ₙCᵣ=ₙPᵣ÷r!  ② ₙCᵣ=ₙCₙ₋ᵣ  ③ "至少"用全部减去相反情况' }
  },

  check:{
    fills:[
      { tex:'{}_{6}\\mathrm{C}_{2}=\\square', answer:15,
        hint:{ ko:'(6×5)÷2', en:'(6×5)÷2', zh:'(6×5)÷2' } },
      { tex:'{}_{8}\\mathrm{C}_{6}=\\square', answer:28,
        hint:{ ko:'₈C₂=(8×7)÷2', en:'₈C₂=(8×7)÷2', zh:'₈C₂=(8×7)÷2' } }
    ],
    open:{ ko:'A 를 포함한 7 명 가운데 3 명을 뽑을 때 A 가 반드시 뽑히는 경우의 수를 구하는 과정을 설명해 봅니다.',
      en:'Explain how to count the ways to choose 3 of 7 people including A so that A is always chosen.',
      zh:'说说从包括A在内的7人中选3人且A一定被选的方法数的求法。' },
    openHint:{ ko:'A 를 먼저 넣고 나머지 6 명에서 2 명을 뽑으므로 ₆C₂=15 입니다.',
      en:'Put A in first and choose 2 of the other 6: ₆C₂=15.',
      zh:'先放入A，再从其余6人中选2人：₆C₂=15。' }
  },

  lab:{
    generator:'md113_comb', level:'main', count:6,
    params:{mode:'include'},
    intro:{
      ko:'반드시 뽑는 사람은 먼저 넣고, 빼는 사람은 후보에서 지운 뒤 나머지에서 뽑습니다.',
      en:'Put required people in first, remove excluded people from the pool, then choose from the rest.',
      zh:'一定要选的先放入，排除的从候选中去掉，再从其余中选。'
    }
  },

  arena:{
    generator:'md113_comb', level:'main', count:6, timeLimit:480,
    params:{mode:'atLeast'},
    rule:{ ko:'8분 안에 "적어도"와 조건 있는 뽑기를 모두 셉니다!', en:'Count every "at least" and conditional choice within 8 minutes!', zh:'8分钟内数完所有"至少"与有条件的选法！' }
  },

  stamp:{ label:{ ko:'바구니 선별사', en:'Basket Picker', zh:'篮子挑选师' }, coins:50 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'순서 없이 딱 골랐구나! 🧺',en:'Chosen perfectly, no order needed!',zh:'不计顺序选得正好！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'순서가 없으면 r! 로 나눠!',en:'No order? Divide by r!!',zh:'不计顺序就除以r!！'}, {ko:'"적어도"는 전체에서 빼 봐!',en:'For "at least", subtract from the total!',zh:'"至少"就用全部去减！'} ],
    finish:{ ko:'완벽해! 바구니 선별사! 🧺✨', en:'Perfect! Basket Picker!', zh:'完美！篮子挑选师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
