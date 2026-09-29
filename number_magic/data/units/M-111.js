/* Numbers of Magic — 유닛 M-111: 순열 (고등 공통수학1 · 과정 46, 2026-09-29)
   근거: docs/high-build-spec.md MD111. 예시는 새로 만들었다. 역사 문단은 널리 알려진 사실만. */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-111'] = {
  id:'M-111', tier:'highmath1', level:'46', order:111,
  generator:'md111_perm',
  title:{ ko:'순열', en:'Permutations', zh:'排列' },
  subtitle:{ ko:'골라서 한 줄로 늘어놓는 경우의 수', en:'Counting ways to choose and line up', zh:'选出并排成一列的方法数' },
  icon:'🚂',

  practice:{
    generator:'md111_perm', level:'practice', count:6,
    params:{mode:'value'},
    intro:{
      ko:'ₙPᵣ 는 n 부터 1 씩 줄여 가며 r 개를 곱합니다. n! 은 n 부터 1 까지 모두 곱한 것입니다.',
      en:'ₙPᵣ multiplies r numbers starting at n and going down by 1. n! multiplies everything from n down to 1.',
      zh:'ₙPᵣ从n开始每次减1，连乘r个数。n!是从n乘到1。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'다섯 명 가운데 세 명을 뽑아 1·2·3등 자리에 세우면, 첫 자리는 5가지, 둘째 자리는 남은 4가지, 셋째 자리는 3가지입니다. 곱의 법칙으로 5×4×3 입니다.',
        en:'To pick three of five people for 1st, 2nd and 3rd place: 5 choices for the first spot, 4 left for the second, 3 for the third. By the multiplication rule, 5×4×3.',
        zh:'从五人中选三人站到第一、二、三名的位置：第一个位置5种，第二个剩4种，第三个3种。由乘法原理得5×4×3。' },
      history:{ ko:'n! 기호는 1808년 프랑스의 크람프가 처음 쓴 것으로 알려져 있습니다.',
        en:'The notation n! is known to have been introduced by the French mathematician Christian Kramp in 1808.',
        zh:'n!这个记号一般认为是法国数学家克拉姆于1808年首先使用的。' }
    },
    stages:[
      { tag:{ko:'① ₙPᵣ 의 뜻',en:'1) What ₙPᵣ means',zh:'① ₙPᵣ的意义'},
        head:{ko:'{}_{5}\\mathrm{P}_{3}=5\\times4\\times3=60',en:'{}_{5}\\mathrm{P}_{3}=5\\times4\\times3=60',zh:'{}_{5}\\mathrm{P}_{3}=5\\times4\\times3=60'},
        desc:{ko:'서로 다른 5 개에서 3 개를 골라 한 줄로 늘어놓는 경우는 <b>60</b> 가지입니다.',
              en:'There are <b>60</b> ways to choose 3 of 5 different things and line them up.',
              zh:'从5个不同元素中选3个排成一列有<b>60</b>种。'},
        mathSteps:['5\\times4\\times3=60'],
        result:{ko:'자리마다 선택지가 하나씩 줄어듭니다!',en:'Each place has one fewer choice!',zh:'每个位置少一个选择！'},
        book:{ko:'ₙPₙ=n! 이고, 0!=1 로 약속합니다.',
              en:'ₙPₙ=n!, and we agree that 0!=1.',
              zh:'ₙPₙ=n!，并规定0!=1。'} },

      { tag:{ko:'② 이웃하는 것은 한 묶음',en:'2) Neighbours form one block',zh:'② 相邻的看成一组'},
        head:{ko:'4!\\times2!=48',en:'4!\\times2!=48',zh:'4!\\times2!=48'},
        desc:{ko:'5 명 가운데 A, B 가 이웃하려면 A, B 를 한 사람처럼 묶어 4 명을 늘어놓고(4!), 묶음 안에서 A, B 의 순서(2!)를 곱합니다. <b>48</b> 가지입니다.',
              en:'For A and B to be neighbours among 5 people, tie them into one unit, arrange 4 units (4!) and multiply by the order inside (2!): <b>48</b> ways.',
              zh:'5人中要A、B相邻，把A、B捆成一个人，排4个单位(4!)，再乘组内顺序(2!)：<b>48</b>种。'},
        mathSteps:['4!\\times2!', '24\\times2=48'],
        result:{ko:'묶고, 늘어놓고, 묶음 안을 바꿉니다!',en:'Tie, arrange, then reorder inside!',zh:'捆绑、排列、再调换组内顺序！'},
        book:{ko:'남학생끼리, 여학생끼리 이웃하면 두 묶음의 순서 2! 도 곱합니다.',
              en:'If boys stay together and girls stay together, also multiply by 2! for the order of the two blocks.',
              zh:'男生相邻、女生也相邻时，还要乘两组的顺序2!。'} },

      { tag:{ko:'③ 이웃하지 않게는 사이에 넣기',en:'3) Keep apart by using the gaps',zh:'③ 不相邻就插空'},
        head:{ko:'5!-4!\\times2!=72',en:'5!-4!\\times2!=72',zh:'5!-4!\\times2!=72'},
        desc:{ko:'A, B 가 이웃하지 않는 경우는 전체 120 에서 이웃하는 48 을 빼서 <b>72</b> 입니다. 여러 명을 떨어뜨릴 때는 나머지를 먼저 세우고 그 사이사이와 양 끝에 넣습니다.',
              en:'A and B apart: the total 120 minus the 48 with them together gives <b>72</b>. To separate several people, line up the rest first and place them in the gaps and at the ends.',
              zh:'A、B不相邻：用全部120减去相邻的48得<b>72</b>。要让多人不相邻，先排好其余的人，再插入空隙和两端。'},
        mathSteps:['120-48=72'],
        result:{ko:'"아닌 것"과 "적어도"는 전체에서 빼기!',en:'"Not" and "at least": subtract from the total!',zh:'"不"和"至少"用全部去减！'},
        book:{ko:'남학생 3 명 사이사이와 양 끝 4 자리에 여학생 2 명을 넣으면 3!×₄P₂=72 입니다.',
              en:'Putting 2 girls into the 4 gaps around 3 boys gives 3!×₄P₂=72.',
              zh:'把2名女生放进3名男生之间及两端的4个位置：3!×₄P₂=72。'} }
    ],
    rule:{ ko:'① ₙPᵣ=n(n−1)…(n−r+1)  ② 이웃하면 묶어서 늘어놓고 안을 바꾼다  ③ 이웃하지 않게는 사이에 넣거나 전체에서 뺍니다',
      en:'① ₙPᵣ=n(n−1)…(n−r+1)  ② Neighbours: tie, arrange, reorder inside  ③ Apart: use the gaps or subtract from the total',
      zh:'① ₙPᵣ=n(n−1)…(n−r+1)  ② 相邻：捆绑、排列、组内调换  ③ 不相邻：插空或用全部去减' }
  },

  check:{
    fills:[
      { tex:'{}_{6}\\mathrm{P}_{2}=\\square', answer:30,
        hint:{ ko:'6×5', en:'6×5', zh:'6×5' } },
      { tex:'4!=\\square', answer:24,
        hint:{ ko:'4×3×2×1', en:'4×3×2×1', zh:'4×3×2×1' } }
    ],
    open:{ ko:'6 명이 한 줄로 설 때 A 가 맨 앞에 서는 경우의 수를 구하는 과정을 설명해 봅니다.',
      en:'Explain how to count the ways 6 people can line up with A at the front.',
      zh:'说说6人排成一排、A站在最前面的排法数的求法。' },
    openHint:{ ko:'A 의 자리를 고정하면 나머지 5 명만 늘어놓으므로 5!=120 입니다.',
      en:'Fix A\'s place; only the other 5 are arranged, so 5!=120.',
      zh:'固定A的位置，只排其余5人，所以5!=120。' }
  },

  lab:{
    generator:'md111_perm', level:'main', count:6,
    params:{mode:'adjacent'},
    intro:{
      ko:'이웃하는 것들을 한 묶음으로 보고 늘어놓은 뒤, 묶음 안의 순서를 곱합니다.',
      en:'Treat the neighbours as one block, arrange, then multiply by the order inside the block.',
      zh:'把相邻的看成一组排列，再乘以组内的顺序。'
    }
  },

  arena:{
    generator:'md111_perm', level:'main', count:6, timeLimit:480,
    params:{mode:'apart'},
    rule:{ ko:'8분 안에 이웃하지 않는 경우와 "적어도"를 모두 셉니다!', en:'Count every "apart" and "at least" case within 8 minutes!', zh:'8分钟内数完所有不相邻与"至少"的情况！' }
  },

  stamp:{ label:{ ko:'줄 세우기 대장', en:'Line-up Captain', zh:'排队队长' }, coins:50 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'줄을 척척 세웠구나! 🚂',en:'You lined them up in no time!',zh:'排得又快又准！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'묶음 안의 순서도 곱했는지 봐!',en:'Did you multiply by the order inside the block?',zh:'组内的顺序也乘了吗？'}, {ko:'전체에서 반대 경우를 빼 봐!',en:'Try subtracting the opposite case from the total!',zh:'试试用全部减去相反情况！'} ],
    finish:{ ko:'완벽해! 줄 세우기 대장! 🚂✨', en:'Perfect! Line-up Captain!', zh:'完美！排队队长！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
