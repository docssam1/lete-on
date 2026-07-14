/* Numbers of Magic — 유닛 B-20: 몇십 × 몇십 — 두 0의 마법 (중급 G 챕터3) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['B-20'] = {
  id:'B-20', tier:'intermediate', level:'B', order:20,
  generator:'ml5_tensMul',
  title:{ ko:'몇십 × 몇십 — 두 0의 마법', en:'Tens × Tens — The Double-Zero Magic', zh:'几十 × 几十 — 两个零的魔法' },
  subtitle:{ ko:'30×40=1200: 3×4=12에 00을 붙여요!', en:'30×40=1200: 3×4=12 plus two zeros!', zh:'30×40=1200：3×4=12后面加两个0！' },
  icon:'✖️',

  practice:{
    generator:'ml5_tensMul', level:'practice', count:5,
    params:{ mode:'tt' },
    intro:{
      ko:'몇십 곱하기 몇십을 연습할 거야. 30×40처럼 각각 0이 한 개씩이니까 합이 두 개! 준비됐지?',
      en:"Let's practise tens times tens. 30×40: each has one zero, so two zeros total in the answer! Ready?",
      zh:'我们来练习几十乘几十。30×40：各有一个0，合计两个0！准备好了吗？'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 몇십×몇십 = 구구 + 00',en:'1) Tens×tens = times table + two zeros',zh:'① 几十×几十 = 口诀 + 两个0'},
        head:{ko:'30×40: 3×4=12, 0이 두 개 → 1200!',en:'30×40: do 3×4=12, then two zeros → 1200!',zh:'30×40：先算3×4=12，再加两个0→1200！'},
        desc:{ko:'30×40을 계산할 때: 30에 0이 한 개, 40에 0이 한 개 — 합쳐서 <b>0이 두 개</b>예요. 앞 숫자끼리 구구단(3×4=12)을 하고 0을 두 개 붙이면 <b>1200</b>!',
              en:'For 30×40: 30 has one zero and 40 has one zero — together that\'s <b>two zeros</b>. Do the times table for the leading digits (3×4=12), attach two zeros → <b>1200</b>!',
              zh:'计算30×40时：30有一个0，40有一个0——合计<b>两个0</b>。用前面的数字做口诀（3×4=12），加两个0→<b>1200</b>！'},
        mathSteps:['30×40','= (3×10)×(4×10)','= 3×4×10×10','= 12×100 = 1200'],
        result:{ko:'30×40=1200! 3×4=12에 0 두 개. 두 0의 마법이 완성됐어요!',en:'30×40=1200! 3×4=12 plus two zeros. The double-zero magic works!',zh:'30×40=1200！3×4=12加两个0。两个零的魔法成功了！'},
        book:{ko:'30×40 = (3×10)×(4×10) = 3×4×10×10 = 12×100 = 1200. 몇십×몇십을 계산할 때는 앞 숫자끼리 구구단을 하고 0의 총 개수(각 수의 0 개수 합)만큼 뒤에 붙여요.',
              en:'30×40 = (3×10)×(4×10) = 3×4×10×10 = 12×100 = 1200. For tens×tens, use the times table for the leading digits and append as many zeros as the two numbers have combined.',
              zh:'30×40=(3×10)×(4×10)=3×4×10×10=12×100=1200。几十×几十时，用前面数字做口诀，再加上两个数中0的总个数。'} },

      { tag:{ko:'② 0의 개수 세기',en:'2) Counting the zeros',zh:'② 数0的个数'},
        head:{ko:'각 수의 0 개수를 더해요!',en:'Add up the zeros from each number!',zh:'把每个数字中0的个数加起来！'},
        desc:{ko:'20×50: 20에 0이 하나, 50에 0이 하나 → 합 2개. 2×5=10이니까 10에 0이 하나 더 있어요. <b>최종 0의 개수 = 10의 0(1개) + 추가(2개) = 3개</b>!',
              en:'20×50: one zero in 20, one in 50 → two from the multiplicands. But 2×5=10 already has a zero! <b>Total zeros = 1 (from 10) + 2 (from tens) = 3</b>!',
              zh:'20×50：20中一个0，50中一个0→两个。但2×5=10本身有一个0！<b>总共0的个数=1（来自10）+2（来自十位）=3个</b>！'},
        mathSteps:['20×50: 0이 각 1개씩 → 합 2개','2×5=10','→ 1000 (0이 3개! 10의 0 포함)'],
        result:{ko:'20×50=1000! 구구단 결과에도 0이 있으면 함께 세야 해요.',en:'20×50=1000! If the times-table result also ends in zero, count that one too.',zh:'20×50=1000！如果口诀结果本身也有0，要一起数！'},
        book:{ko:'0의 개수를 셀 때는 두 수의 0 개수를 더하고, 구구단 결과에도 0이 있으면 그것도 더해요. 예: 20×50=2×5×100=10×100=1000. 10에서 0이 하나, 100에서 0이 둘 → 총 0이 세 개.',
              en:'Count zeros: add the zeros from both multipliers, and also count any zeros in the times-table result. e.g. 20×50=2×5×100=10×100=1000. One zero from 10, two from 100 → three zeros total.',
              zh:'数0时：将两个乘数中的0相加，如果口诀结果本身有0也要加上。例：20×50=2×5×100=10×100=1000。10中一个0，100中两个0→共三个0。'} },

      { tag:{ko:'③ 혼합 응용 — 50×60',en:'3) Mixed application — 50×60',zh:'③ 混合应用——50×60'},
        head:{ko:'50×60: 5×6=30, 0이 세 개 → 3000!',en:'50×60: 5×6=30, three zeros total → 3000!',zh:'50×60：5×6=30，共三个0→3000！'},
        desc:{ko:'50×60: 5×6=30 (결과에 이미 0이 하나!). 50에 0 하나, 60에 0 하나 → 추가 0이 두 개. 30에 0을 두 개 더 붙이면 <b>3000</b>! 0의 총 개수는 3개예요.',
              en:'50×60: 5×6=30 (already one zero in the result!). 50 and 60 each add one zero → two more zeros. Attach those two zeros to 30 → <b>3000</b>! Three zeros total.',
              zh:'50×60：5×6=30（结果本身已有一个0！）。50和60各自带一个0→额外两个0。在30后加两个0→<b>3000</b>！共三个0。'},
        mathSteps:['50×60','= 5×6×100','= 30×100','= 3000'],
        result:{ko:'50×60=3000! 5×6=30의 0 포함, 추가 00까지 → 0이 세 개.',en:'50×60=3000! Count the zero in 30 plus the two appended zeros → three zeros.',zh:'50×60=3000！30中的0加上额外的两个0→共三个0。'},
        book:null }
    ],
    rule:{ ko:'① 몇십×몇십: 앞 숫자 구구단 + 각 수의 0 개수 합만큼 붙임  ② 구구단 결과의 0도 포함!  ③ 50×60처럼 구구단 결과에 0 있으면 함께 세기',
      en:'① Tens×tens: times table of leading digits + combined zero count  ② Include zeros already in the times-table result!  ③ Like 50×60 — count the zero in 30 too',
      zh:'① 几十×几十：前面数字口诀+两个数中0的总个数  ② 口诀结果中的0也要算！  ③ 像50×60一样，30中的0也要数进去' }
  },

  check:{
    fills:[
      { tex:'40 \\times 30 = \\square', answer:1200,
        hint:{ ko:'4×3=12, 0이 두 개(40의 0 + 30의 0) → 1200', en:'4×3=12, two zeros (one from 40, one from 30) → 1200', zh:'4×3=12，两个0（40的0和30的0）→1200' } },
      { tex:'50 \\times 60 = \\square', answer:3000,
        hint:{ ko:'5×6=30, 여기서 0이 하나! 추가로 00 두 개 → 3000', en:'5×6=30, that\'s one zero already! Plus two more → 3000', zh:'5×6=30，本身有一个0！再加两个0→3000' } }
    ],
    open:{ ko:'30×40=1200이 되는 이유를 설명해 봐요. 0이 왜 두 개 붙는지 이야기해 봐요.',
      en:'Explain why 30×40=1200. Tell me why two zeros get attached.',
      zh:'解释为什么30×40=1200。说说为什么要加两个0。' },
    openHint:{ ko:'예) 30에 0이 하나, 40에 0이 하나. 합쳐서 0이 두 개. 3×4=12이고 뒤에 00을 붙이면 1200. 30과 40은 각각 10의 배수니까 10×10=100배가 돼요.',
      en:'e.g. 30 has one zero, 40 has one zero — two zeros combined. 3×4=12, append two zeros → 1200. Both 30 and 40 are multiples of 10, so together that\'s ×100.',
      zh:'例）30有一个0，40有一个0，合计两个0。3×4=12，加两个0→1200。30和40都是10的倍数，合在一起就是×100。' }
  },

  lab:{
    generator:'ml5_tensMul', level:'main', count:4,
    params:{ mode:'tt' },
    intro:{
      ko:'이제 두 0의 마법을 써볼 시간! 앞 숫자 구구단을 하고 0의 개수를 세어봐.',
      en:'Time to cast the double-zero spell! Do the times table for the leading digits, then count and append your zeros.',
      zh:'是时候施展两个零的魔法了！用前面的数字做口诀，再数清楚0的个数。'
    }
  },

  arena:{
    generator:'ml5_tensMul', level:'main', count:8, timeLimit:300,
    params:{ mode:'tt' },
    rule:{ ko:'5분 안에 몇십×몇십 문제를 모두 풀어요!', en:'Solve all tens×tens problems in 5 minutes!', zh:'5分钟内解答所有几十×几十的题目！' }
  },

  stamp:{ label:{ ko:'몇십곱 마법사', en:'Tens-Times Wizard', zh:'整十乘法魔法师' }, coins:25 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'구구단 달인! 🌟',en:'Times-table master!',zh:'口诀高手！'}, {ko:'대단해! 🪄',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'음~ 다시 해볼까?',en:'Hmm, try again?',zh:'嗯，再试一次？'}, {ko:'거의 다 왔어!',en:'Almost!',zh:'就快了！'} ],
    finish:{ ko:'완벽해! 두 0의 마법 마스터! ✖️✨', en:'Perfect! Double-zero multiplication master!', zh:'完美！两个零的魔法达人！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
