/* Numbers of Magic — 유닛 C-26: 차근차근 곱하기 (중급 창의전략 4단계) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['C-26'] = {
  id:'C-26', tier:'intermediate', level:'C', order:26,
  generator:'ml_partial',
  title:{ ko:'차근차근 곱하기', en:'Step-by-Step Multiplication', zh:'逐步乘法' },
  subtitle:{ ko:'자리별로 쪼개 곱하고, 맨 마지막에 한 번만 더해요', en:'Multiply place by place, then add just once at the end', zh:'按数位拆开相乘，最后只加一次' },
  icon:'🪜',

  practice:{
    generator:'ml_partial', level:'practice', count:5,
    params:{ level:'practice' },
    intro:{
      ko:'큰 수 곱셈도 자리별로 쪼개면 쉬워져. 일의 자리 곱하고, 십의 자리 곱하고, 마지막에 더하면 끝! 준비됐지?',
      en:"Big multiplication gets easy when you split it by place value: multiply the ones, multiply the tens, then add at the end. Ready?",
      zh:'大数乘法拆开数位就简单了：先乘个位，再乘十位，最后相加就行！准备好了吗？'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 두 자리 × 한 자리부터',en:'1) Start with 2-digit × 1-digit',zh:'① 从两位数×一位数开始'},
        head:{ko:'47×3: 7 먼저, 40 나중에!',en:'47×3: the ones first, then the tens!',zh:'47×3：先算个位，再算十位！'},
        desc:{ko:'곱셈을 자리별로 <b>쪼개서 각각 곱한 뒤 모두 더하면</b> 실수가 확 줄어요. 47×3이면 47을 40과 7로 나눠서: 3×7=21, 3×40=120. 두 곱을 <b>맨 마지막에 딱 한 번만</b> 더해요: 21+120=<b>141</b>. 받아올림을 자리마다 미루지 않고 끝에서 한 번에 처리하니까 헷갈릴 일이 없어요!',
              en:'When you <b>split multiplication by place and multiply each part, then add once</b>, mistakes drop a lot. For 47×3, split 47 into 40 and 7: 3×7=21, 3×40=120. Add the two products <b>just once, at the very end</b>: 21+120=<b>141</b>. No juggling carries digit by digit — you handle it all in one clean add!',
              zh:'把乘法<b>按数位拆开分别相乘，最后只加一次</b>，出错就少多了。47×3拆成40和7：3×7=21，3×40=120。两个积<b>只在最后加一次</b>：21+120=<b>141</b>。不用一位一位处理进位，最后一次搞定！'},
        mathSteps:['3 × 7 = 21','3 × 40 = 120','21 + 120 = 141'],
        result:{ko:'47×3=141! 자리별로 나눠 곱하고 한 번만 더해요.',en:'47×3=141! Multiply by place, add once.',zh:'47×3=141！按数位相乘，只加一次。'},
        book:{ko:'세로셈에서 자리마다 받아올림하다 실수하기 쉬운데, 이 방법은 곱셈 두 번과 덧셈 한 번으로 끝나서 각 단계가 단순해요.',
              en:'Column multiplication invites carry mistakes at every digit, but this way is just two multiplications and one addition — each step stays simple.',
              zh:'竖式乘法容易在每位进位时出错，这个方法只有两次乘法和一次加法——每步都很简单。'} },

      { tag:{ko:'② 두 자리 × 두 자리로',en:'2) Now 2-digit × 2-digit',zh:'② 进阶到两位数×两位数'},
        head:{ko:'47×53: 곱이 네 조각으로!',en:'47×53: four little products!',zh:'47×53：拆成四个小积！'},
        desc:{ko:'두 수 다 두 자리면 조각이 <b>네 개</b>로 늘어나요. 47(=40+7) × 53(=50+3): 3×7=21, 3×40=120, 50×7=350, 50×40=2000. 네 조각을 <b>마지막에 한 번</b>에 더해요: 21+120+350+2000=<b>2491</b>. 조각이 늘어도 원리는 똑같아요 — 곱하기 먼저, 더하기는 맨 끝에!',
              en:'When both numbers are 2-digit, you get <b>four</b> little pieces. 47(=40+7) × 53(=50+3): 3×7=21, 3×40=120, 50×7=350, 50×40=2000. Add all four pieces <b>once at the end</b>: 21+120+350+2000=<b>2491</b>. More pieces, same idea — multiply first, add last!',
              zh:'两个数都是两位数时会多出四个小块。47(=40+7) × 53(=50+3)：3×7=21，3×40=120，50×7=350，50×40=2000。四块<b>最后加一次</b>：21+120+350+2000=<b>2491</b>。块多了道理不变——先乘后加！'},
        mathSteps:['3 × 7 = 21','3 × 40 = 120','50 × 7 = 350','50 × 40 = 2000','21+120+350+2000 = 2491'],
        result:{ko:'47×53=2491! 조각 네 개, 덧셈 한 번.',en:'47×53=2491! Four pieces, one final add.',zh:'47×53=2491！四块，一次相加。'},
        book:{ko:'이 네 조각은 사실 창살격자·세로셈이 계산하는 것과 똑같은 조각이에요. 방법은 달라도 속을 들여다보면 같은 곱셈을 하고 있어요.',
              en:'These four pieces are the very same pieces that other methods (like the lattice or standard column method) compute — different look, same multiplication underneath.',
              zh:'这四块其实和其他方法(比如格子法、竖式)算的是同样的东西——方法不同，本质相同。'} },

      { tag:{ko:'③ 곱하는 순서는 자유예요',en:'3) The order is up to you',zh:'③ 相乘顺序随你定'},
        head:{ko:'어느 조각부터 곱해도 답은 같아요',en:'Start with any piece — the answer stays the same',zh:'从哪块开始都一样'},
        desc:{ko:'네 조각을 어떤 순서로 곱하든 상관없어요! 큰 조각(50×40=2000)부터 해도, 작은 조각(3×7=21)부터 해도 결과는 똑같아요. <b>먼저 다 곱해서 적어두고, 마지막에 한꺼번에 더하기</b> — 이게 이 전략의 전부예요. 암산이 헷갈리면 종이에 네 조각을 쭉 적어두고 더해보세요.',
              en:'It doesn\'t matter which piece you multiply first! Start big (50×40=2000) or small (3×7=21) — the total is the same. <b>Multiply all the pieces first, write them down, then add them all at once</b> — that\'s the whole strategy. If mental math gets tricky, jot down all four pieces on paper and add.',
              zh:'先乘哪块都没关系！先算大的(50×40=2000)还是小的(3×7=21)结果都一样。<b>先把每块都乘出来写下，最后一次性相加</b>——这就是整个策略。心算吃力就把四块写在纸上再加。'},
        mathSteps:['조각들을 순서 상관없이 계산','종이에 네 조각 적기','한 번에 더하기'],
        result:{ko:'순서는 자유! 다 곱하고 마지막에 딱 한 번 더해요.',en:'Any order works! Multiply everything, then add once.',zh:'顺序随意！全部乘完再加一次。'},
        book:null }
    ],
    rule:{ ko:'① 두 수를 자리별로 쪼개기  ② 조각끼리 하나씩 곱하기  ③ 모든 조각을 마지막에 한 번만 더하기',
      en:'① Split both numbers by place value  ② Multiply each pair of pieces  ③ Add every piece just once at the end',
      zh:'① 把两个数按数位拆开  ② 每对小块分别相乘  ③ 最后把所有小块加一次' }
  },

  check:{
    fills:[
      { tex:'58 \\times 6 = \\square', answer:348,
        hint:{ ko:'6×8=48, 6×50=300, 둘을 더하면?', en:'6×8=48, 6×50=300, add them?', zh:'6×8=48，6×50=300，相加？' } },
      { tex:'34 \\times 26 = \\square', answer:884,
        hint:{ ko:'6×4=24, 6×30=180, 20×4=80, 20×30=600, 넷을 더하면?', en:'6×4=24, 6×30=180, 20×4=80, 20×30=600, sum all four?', zh:'6×4=24，6×30=180，20×4=80，20×30=600，四个相加？' } }
    ],
    open:{ ko:'자리별로 쪼개 곱하는 방법이 세로셈보다 실수가 적은 이유를 설명해 봐요.',
      en:'Explain why splitting multiplication by place value causes fewer mistakes than column multiplication.',
      zh:'解释为什么按数位拆开相乘比竖式乘法更不容易出错。' },
    openHint:{ ko:'예) 세로셈은 매 자리마다 받아올림을 바로바로 처리해야 하지만, 이 방법은 곱셈을 다 끝낸 뒤 덧셈 한 번으로 모아서 처리하니까 한 번에 신경 쓸 게 적어요.',
      en:'e.g. Column multiplication forces you to handle carries at every single digit, but this method finishes all the multiplying first and folds everything into one final addition — less to track at once.',
      zh:'例）竖式乘法要在每一位立刻处理进位，而这个方法先把乘法全部做完，最后用一次加法收尾——每次要顾的事更少。' }
  },

  lab:{
    generator:'ml_partial', level:'main', count:4,
    params:{ level:'main' },
    intro:{
      ko:'이번엔 두 자리 × 두 자리! 네 조각으로 쪼개서 곱하고 마지막에 더해봐.',
      en:'Now 2-digit × 2-digit! Split into four pieces, multiply, then add.',
      zh:'现在是两位数×两位数！拆成四块相乘，最后相加。'
    }
  },

  arena:{
    generator:'ml_partial', level:'main', count:6, timeLimit:360,
    params:{ level:'main' },
    rule:{ ko:'6분 안에 차근차근 곱하기 문제를 모두 풀어요!', en:'Solve all step-by-step multiplication problems in 6 minutes!', zh:'6分钟内解答所有逐步乘法题！' }
  },

  stamp:{ label:{ ko:'차근차근 마법사', en:'Step-by-Step Wizard', zh:'逐步魔法师' }, coins:30 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'조각조각 완벽! 🪜',en:'Every piece perfect!',zh:'每块都对！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'자리별로 쪼개서 곱해봐!',en:'Split by place value first!',zh:'先按数位拆开！'}, {ko:'조각을 다 곱한 다음 한 번에 더해봐!',en:'Multiply every piece, then add once!',zh:'全部乘完再一次性相加！'} ],
    finish:{ ko:'완벽해! 차근차근 마법사! 🪜✨', en:'Perfect! Step-by-Step Wizard!', zh:'完美！逐步魔法师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
