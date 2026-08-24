/* Numbers of Magic — 유닛 C-08: 더 곱해주고 빼기 (중급 B 챕터4) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['C-08'] = {
  id:'C-08', tier:'intermediate', level:'C', order:8,
  generator:'ml_overmul',
  title:{ ko:'더 곱해주고 빼기', en:'Over-Multiply and Subtract', zh:'多乘再减法' },
  subtitle:{ ko:'6×98 = 6×100 − 6×2: 반올림해서 곱하고 넘친 만큼 빼요', en:'6×98 = 6×100 − 6×2: round up, multiply, subtract the excess', zh:'6×98 = 6×100 − 6×2：先凑整相乘，再减多余的' },
  icon:'🎯',

  practice:{
    generator:'ml_overmul', level:'practice', count:5,
    params:{},
    intro:{
      ko:'98이나 9처럼 딱 떨어지는 수보다 조금 작은 수를 곱할 때는, 먼저 딱 떨어지는 수로 곱하고 넘친 만큼 빼면 돼! 준비됐지?',
      en:"When multiplying by a number just below a round one (like 98 or 9), multiply by the round number first, then subtract the excess! Ready?",
      zh:'乘以比整数稍小的数（如98或9）时，先乘整数，再减去多算的部分！准备好了吗？'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 반올림 곱셈의 원리',en:'1) The round-up principle',zh:'① 凑整乘法原理'},
        head:{ko:'98은 100에서 2 모자라요',en:'98 is 2 short of 100',zh:'98比100少2'},
        desc:{ko:'6×98을 그대로 계산하면 복잡해요. 하지만 <b>98 = 100−2</b>라는 걸 이용하면? 6×98 = 6×100 − 6×2 = 600 − 12 = <b>588</b>. 100 곱하기는 0 두 개만 붙이면 되니까, 어려운 곱셈이 쉬운 뺄셈으로 변해요!',
              en:'Computing 6×98 directly is messy. But using <b>98 = 100−2</b>? 6×98 = 6×100 − 6×2 = 600 − 12 = <b>588</b>. Since ×100 just adds two zeros, a hard multiplication becomes an easy subtraction!',
              zh:'直接算6×98很麻烦。但利用<b>98 = 100−2</b>呢？6×98 = 6×100 − 6×2 = 600 − 12 = <b>588</b>。乘100只要加两个0，难乘法变成简单减法！'},
        mathSteps:['6 × 98','= 6 × (100 − 2)','= 600 − 12','= 588'],
        result:{ko:'6×98=588! 100으로 곱하고 넘친 6×2만 빼면 돼요.',en:'6×98=588! Multiply by 100, subtract the extra 6×2.',zh:'6×98=588！乘100，减去多算的6×2。'},
        book:{ko:'원리: a×(round−k) = a×round − a×k. 98=100−2, 97=100−3, 9=10−1, 19=20−1처럼 "딱 떨어지는 수−조금"으로 보는 눈을 길러요.',
              en:'Principle: a×(round−k) = a×round − a×k. Train your eye to see 98=100−2, 97=100−3, 9=10−1, 19=20−1.',
              zh:'原理：a×(整数−k) = a×整数 − a×k。练习把98看成100−2，97看成100−3，9看成10−1，19看成20−1。'} },

      { tag:{ko:'② 얼마나 넘쳤는지 세기',en:'2) Counting the excess',zh:'② 数一数多了多少'},
        head:{ko:'넘친 만큼 = a × 모자란 수',en:'Excess = a × the shortfall',zh:'多算的 = a × 差的数'},
        desc:{ko:'가장 중요한 건 <b>얼마를 빼야 하는지</b>예요. 12×97에서 97은 100보다 3 작으니, 12를 <b>3번 더 곱한 셈</b>이에요. 그래서 12×100=1200에서 12×3=36을 빼요: 1200−36=1164. 빼는 양은 항상 "a × 모자란 수"!',
              en:'The key is knowing <b>how much to subtract</b>. In 12×97, 97 is 3 below 100, so we multiplied 12 <b>three extra times</b>. From 12×100=1200 subtract 12×3=36: 1200−36=1164. The amount is always "a × the shortfall"!',
              zh:'最重要的是知道<b>要减多少</b>。12×97中，97比100小3，相当于12<b>多乘了3次</b>。从12×100=1200中减去12×3=36：1200−36=1164。减的量永远是"a×差的数"！'},
        mathSteps:['12 × 97','= 12×100 − 12×3','= 1200 − 36','= 1164'],
        result:{ko:'12×97=1164! 모자란 수 3 → 12×3=36을 빼요.',en:'12×97=1164! Shortfall 3 → subtract 12×3=36.',zh:'12×97=1164！差3→减去12×3=36。'},
        book:{ko:'주의: 3을 빼는 게 아니라 12×3을 빼요! "12가 3묶음 넘쳤다"고 생각하면 헷갈리지 않아요.',
              en:'Careful: subtract 12×3, not just 3! Think "12 overflowed by 3 groups" and you won\'t mix it up.',
              zh:'注意：减的是12×3，不是3！想成"12多了3组"就不会搞混。'} },

      { tag:{ko:'③ ×9, ×19에도 적용',en:'3) Apply to ×9 and ×19',zh:'③ 应用到×9和×19'},
        head:{ko:'딱 떨어지는 수 근처는 모두 이 마법!',en:'Any number near a round one gets this magic!',zh:'接近整数的数都能用这个魔法！'},
        desc:{ko:'이 전략은 10 근처에서도 통해요. 14×9 = 14×10−14 = 140−14 = 126. 7×19 = 7×20−7 = 140−7 = 133. <b>×9 전략(C-06)도 사실 이 마법의 특별한 경우</b>였던 거예요!',
              en:'This works near 10 too. 14×9 = 14×10−14 = 140−14 = 126. And 7×19 = 7×20−7 = 140−7 = 133. <b>The ×9 strategy (C-06) was really a special case of this magic!</b>',
              zh:'这个策略在10附近也适用。14×9 = 14×10−14 = 140−14 = 126。7×19 = 7×20−7 = 140−7 = 133。<b>×9策略(C-06)其实就是这个魔法的特例！</b>'},
        mathSteps:['7 × 19','= 7 × (20 − 1)','= 140 − 7','= 133'],
        result:{ko:'7×19=133! 20으로 곱하고 7 하나만 돌려줘요.',en:'7×19=133! Multiply by 20, give back one 7.',zh:'7×19=133！乘20，还回一个7。'},
        book:null }
    ],
    rule:{ ko:'① 딱 떨어지는 수(10·20·100)로 올려 곱하기  ② 넘친 양 = a×모자란 수  ③ 큰 곱에서 넘친 양 빼기',
      en:'① Round up to 10/20/100 and multiply  ② Excess = a × shortfall  ③ Subtract the excess from the big product',
      zh:'① 凑到整数(10·20·100)相乘  ② 多算的量 = a×差数  ③ 从大积中减去多算的量' }
  },

  check:{
    fills:[
      { tex:'8 \\times 99 = \\square', answer:792,
        hint:{ ko:'8×100=800, 800−8=?', en:'8×100=800, then 800−8=?', zh:'8×100=800，800−8=？' } },
      { tex:'15 \\times 8 = \\square', answer:120,
        hint:{ ko:'15×10=150, 15×2=30, 150−30=?', en:'15×10=150, 15×2=30, 150−30=?', zh:'15×10=150，15×2=30，150−30=？' } }
    ],
    open:{ ko:'4×98을 두 가지 방법(세로셈, 더 곱해주고 빼기)으로 풀고 어느 쪽이 빠른지 비교해 봐요.',
      en:'Solve 4×98 two ways (column method vs over-multiply-and-subtract) and compare which is faster.',
      zh:'用两种方法（竖式、多乘再减）计算4×98，比较哪种更快。' },
    openHint:{ ko:'예) 세로셈: 4×8=32 받아올림… 여러 단계. 마법: 4×100−4×2 = 400−8 = 392. 한 번의 뺄셈으로 끝!',
      en:'e.g. Column: 4×8=32, carry… many steps. Magic: 4×100−4×2 = 400−8 = 392. One subtraction!',
      zh:'例）竖式：4×8=32进位……好几步。魔法：4×100−4×2 = 400−8 = 392。一次减法搞定！' }
  },

  lab:{
    generator:'ml_overmul', level:'main', count:4,
    params:{},
    intro:{
      ko:'더 곱해주고 빼기 마법! 딱 떨어지는 수로 올려서 곱해봐.',
      en:'Over-multiply magic! Round up and multiply first.',
      zh:'多乘再减魔法！先凑整相乘。'
    }
  },

  arena:{
    generator:'ml_overmul', level:'main', count:8, timeLimit:300,
    params:{},
    rule:{ ko:'5분 안에 더 곱해주고 빼기 문제를 모두 풀어요!', en:'Solve all over-multiply problems in 5 minutes!', zh:'5分钟内解答所有多乘再减题！' }
  },

  stamp:{ label:{ ko:'반올림 곱셈사', en:'Round-Up Multiplier', zh:'凑整乘法师' }, coins:30 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'딱 맞게 뺐어! 🎯',en:'Perfect subtraction!',zh:'减得刚刚好！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'먼저 딱 떨어지는 수로 곱해봐!',en:'Multiply by the round number first!',zh:'先乘整数！'}, {ko:'넘친 양은 a×모자란 수야!',en:'The excess is a × the shortfall!',zh:'多算的量是a×差数！'} ],
    finish:{ ko:'완벽해! 반올림 곱셈사! 🎯✨', en:'Perfect! Round-Up Multiplier!', zh:'完美！凑整乘法师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
