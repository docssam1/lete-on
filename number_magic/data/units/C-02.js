/* Numbers of Magic — 유닛 C-02: 곱해서 10 만들기 (중급 A 챕터2) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['C-02'] = {
  id:'C-02', tier:'intermediate', level:'C', order:2,
  lineage:['ten-friends'],
  generator:'ml_pair10',
  title:{ ko:'곱해서 10 만들기', en:'Making Pairs of 10', zh:'凑10乘法' },
  subtitle:{ ko:'2×5=10! 쌍을 찾으면 곱셈이 쉬워져요', en:'2×5=10! Find the pair and make multiplication easy', zh:'2×5=10！找到对，乘法变简单' },
  icon:'🔟',

  practice:{
    generator:'ml_pair10', level:'practice', count:5,
    params:{ target:10 },
    intro:{
      ko:'세 수의 곱에서 2와 5를 먼저 곱하면 10이 나와. 그러면 계산이 훨씬 쉬워져! 준비됐지?',
      en:"In a product of three numbers, multiply 2 and 5 first to get 10 — then the rest is easy! Ready?",
      zh:'在三个数的乘积中，先乘2和5得到10，然后就好算了！准备好了吗？'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 2×5=10 쌍의 마법',en:'1) The 2×5=10 pair magic',zh:'① 2×5=10对的魔法'},
        head:{ko:'2와 5를 먼저! 10이 되면 계산이 쉬워요',en:'Multiply 2 and 5 first! Getting 10 makes the rest easy',zh:'先乘2和5！得到10后就好算了'},
        desc:{ko:'<b>2×5=10</b>은 특별한 쌍이에요. 세 수를 곱할 때 2와 5를 찾으면, 이 둘을 먼저 곱해서 10을 만들어요. 예: 4×7×5 에서 <b>4÷2=2, 2×5=10</b> → 4×5=20, 20×7=140이 더 빨라요! 또는 3×2×5 = (2×5)×3 = 10×3 = 30.',
              en:'<b>2×5=10</b> is a special pair. In a three-number product, if you spot 2 and 5, multiply them first to make 10. E.g. 3×2×5 = (2×5)×3 = 10×3 = 30.',
              zh:'<b>2×5=10</b>是一个特殊的对。三数相乘时，找到2和5先乘，凑成10。例：3×2×5 = (2×5)×3 = 10×3 = 30。'},
        mathSteps:['3 × 2 × 5','= 3 × (2 × 5)','= 3 × 10','= 30'],
        result:{ko:'(2×5)=10을 먼저 만들면 나머지 곱셈이 쉬워요!',en:'Make (2×5)=10 first — the rest multiplies easily!',zh:'先凑出(2×5)=10，剩下的乘法就简单了！'},
        book:{ko:'세 수 곱셈에서 2와 5가 보이면 먼저 곱해 10을 만들어요. 곱셈은 순서를 바꿔도 결과가 같아요(교환법칙).',
              en:'When you see 2 and 5 in a product, multiply them first to make 10. Multiplication is commutative — order doesn\'t change the result.',
              zh:'三数相乘时看到2和5，先乘凑成10。乘法交换律：顺序不影响结果。'} },

      { tag:{ko:'② 4×5=20도 활용해요',en:'2) Also use 4×5=20',zh:'② 也可用4×5=20'},
        head:{ko:'4×5=20, 이것도 편리한 쌍!',en:'4×5=20 is also a useful pair!',zh:'4×5=20，也是好用的对！'},
        desc:{ko:'2×5=10 말고 <b>4×5=20</b>도 외워두면 좋아요. 예: 4×8×5=(4×5)×8=20×8=160. 또 2×5=10을 여러 번 쓸 수도 있어요: 2×3×5×4=(2×5)×(3×4)=10×12=120.',
              en:'Besides 2×5=10, remember <b>4×5=20</b> too. E.g. 4×8×5=(4×5)×8=20×8=160. You can also use 2×5=10 multiple times: 2×3×5×4=(2×5)×(3×4)=10×12=120.',
              zh:'除了2×5=10，记住<b>4×5=20</b>也很有用。例：4×8×5=(4×5)×8=20×8=160。也可多次用2×5=10：2×3×5×4=(2×5)×(3×4)=10×12=120。'},
        mathSteps:['4 × 8 × 5','= (4 × 5) × 8','= 20 × 8','= 160'],
        result:{ko:'4×5=20 쌍도 활용! 쌍을 찾으면 계산이 빨라져요.',en:'Use the 4×5=20 pair too! Finding pairs speeds up your maths.',zh:'利用4×5=20这个对！找到对就能加速计算。'},
        book:{ko:'주요 쌍: 2×5=10, 4×5=20, 1×10=10, 2×10=20. 이런 쌍들을 미리 알아두면 계산이 훨씬 빨라져요.',
              en:'Key pairs: 2×5=10, 4×5=20, 1×10=10, 2×10=20. Knowing these pairs in advance speeds computation greatly.',
              zh:'常用对：2×5=10，4×5=20，1×10=10，2×10=20。提前记住这些对，计算快多了。'} },

      { tag:{ko:'③ 쌍 찾기 전략',en:'3) Strategy for finding pairs',zh:'③ 找对的策略'},
        head:{ko:'쌍을 먼저 눈으로 찾아요!',en:'Scan for pairs first!',zh:'先用眼睛找对！'},
        desc:{ko:'계산하기 전에 먼저 눈으로 <b>2와 5가 있는지</b> 스캔해요. 2×□×5 패턴이 보이면 바로 10 만들기. 여러 수를 곱할 때 이 전략이 특히 강력해요.',
              en:'Before computing, scan visually for <b>2 and 5</b>. When you see 2×□×5, make 10 first. This strategy is especially powerful when multiplying many numbers.',
              zh:'计算前先扫描有没有<b>2和5</b>。看到2×□×5的模式，先凑10。多数相乘时这个策略特别强大。'},
        mathSteps:['5×3×2→(2×5)×3=30','5×4×7→(4×5)×7=140','2×9×5→(2×5)×9=90'],
        result:{ko:'눈으로 쌍 먼저 찾기 → 쌍 먼저 곱하기 → 쉬운 계산!',en:'Spot the pair first → multiply the pair → easy calculation!',zh:'先找对→先乘对→简单计算！'},
        book:null }
    ],
    rule:{ ko:'① 2×5=10, 4×5=20 쌍을 찾아요  ② 쌍을 먼저 곱해요  ③ 교환법칙: 순서 바꿔도 답 같아요',
      en:'① Find pairs like 2×5=10, 4×5=20  ② Multiply the pair first  ③ Commutative law: order doesn\'t matter',
      zh:'① 找2×5=10、4×5=20的对  ② 先乘这个对  ③ 交换律：顺序不影响结果' }
  },

  check:{
    fills:[
      { tex:'5 \\times 7 \\times 2 = \\square', answer:70,
        hint:{ ko:'2×5=10, 10×7=?', en:'2×5=10, then 10×7=?', zh:'2×5=10，然后10×7=？' } },
      { tex:'4 \\times 9 \\times 5 = \\square', answer:180,
        hint:{ ko:'4×5=20, 20×9=?', en:'4×5=20, then 20×9=?', zh:'4×5=20，然后20×9=？' } }
    ],
    open:{ ko:'3×2×5×4를 두 가지 방법으로 계산해 봐요. 쌍을 어떻게 찾을 수 있나요?',
      en:'Compute 3×2×5×4 two different ways. How do you spot the pairs?',
      zh:'用两种方法计算3×2×5×4。你怎么找到这些对？' },
    openHint:{ ko:'예) (2×5)×(3×4) = 10×12 = 120. 또는 (4×5)×(2×3) = 20×6 = 120. 두 가지 모두 120!',
      en:'e.g. (2×5)×(3×4) = 10×12 = 120. Or (4×5)×(2×3) = 20×6 = 120. Both give 120!',
      zh:'例）(2×5)×(3×4) = 10×12 = 120。或(4×5)×(2×3) = 20×6 = 120。两种都是120！' }
  },

  lab:{
    generator:'ml_pair10', level:'main', count:4,
    params:{ target:10 },
    intro:{
      ko:'쌍 찾기 마법을 써볼 시간! 2와 5를 먼저 곱해봐.',
      en:'Time to find the pair! Multiply 2 and 5 first.',
      zh:'是时候找对了！先把2和5乘起来。'
    }
  },

  arena:{
    generator:'ml_pair10', level:'main', count:8, timeLimit:300,
    params:{ target:10 },
    rule:{ ko:'5분 안에 쌍 찾기 문제를 모두 풀어요!', en:'Solve all pair-finding problems in 5 minutes!', zh:'5分钟内解答所有找对题！' }
  },

  stamp:{ label:{ ko:'쌍 곱 달인', en:'Pair Product Master', zh:'凑10乘法达人' }, coins:30 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'쌍을 찾았어! 🔟',en:'Found the pair!',zh:'找到对了！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'2와 5를 찾아봐!',en:'Look for 2 and 5!',zh:'找找2和5！'}, {ko:'거의 다 왔어!',en:'Almost!',zh:'就快了！'} ],
    finish:{ ko:'완벽해! 쌍 곱 달인! 🔟✨', en:'Perfect! Pair Product Master!', zh:'完美！凑10乘法达人！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
