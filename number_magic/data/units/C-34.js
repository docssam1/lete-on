/* Numbers of Magic — 유닛 C-34: 곱해서 1000 만들기 (중급 A 챕터4 · 계보1 '2와 5는 친구' 3번째 관문) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['C-34'] = {
  id:'C-34', tier:'intermediate', level:'C', order:34,
  generator:'ml_pair10',
  lineage:['ten-friends'],
  title:{ ko:'곱해서 1000 만들기', en:'Making Pairs of 1000', zh:'凑1000乘法' },
  subtitle:{ ko:'8×125=1000! 100의 쌍이 한 번 더 친구를 만나면 1000이 돼요', en:'8×125=1000! When the 100-pair meets a friend once more, it becomes 1000', zh:'8×125=1000！100的对再遇到一次朋友，就变成1000了' },
  icon:'🏆',

  practice:{
    generator:'ml_pair10', level:'practice', count:5,
    params:{ target:1000 },
    intro:{
      ko:'2와 5는 친구야. 둘이 만나면 10, 두 번 만나면 100, 세 번 만나면 1000! 8×125 같은 쌍을 찾아 먼저 곱해봐.',
      en:'2 and 5 are friends. Meet once → 10, twice → 100, three times → 1000! Find pairs like 8×125 and multiply them first.',
      zh:'2和5是朋友。见一次面变10，两次变100，三次变1000！先找到像8×125这样的对，先乘它们。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 2와 5가 세 번 만나면 1000',en:'1) When 2 and 5 meet three times: 1000',zh:'① 2和5见三次面：1000'},
        head:{ko:'8×125=1000: 숨은 2와 5를 세어 봐요',en:'8×125=1000: count the hidden 2s and 5s',zh:'8×125=1000：数一数藏着的2和5'},
        desc:{ko:'<b>8=2×2×2</b>, <b>125=5×5×5</b>예요. 2가 세 번, 5가 세 번 만나니까 8×125=(2×5)×(2×5)×(2×5)=10×10×10=1000! 2×5=10 쌍이 <b>세 번</b> 겹치면 1000이 돼요.',
              en:'<b>8=2×2×2</b> and <b>125=5×5×5</b>. Three 2s meet three 5s: 8×125=(2×5)×(2×5)×(2×5)=10×10×10=1000! When the 2×5=10 pair repeats <b>three times</b>, you get 1000.',
              zh:'<b>8=2×2×2</b>，<b>125=5×5×5</b>。三个2遇到三个5：8×125=(2×5)×(2×5)×(2×5)=10×10×10=1000！2×5=10这个对<b>重复三次</b>就变成1000。'},
        mathSteps:['8 × 125','= (2×2×2) × (5×5×5)','= (2×5) × (2×5) × (2×5)','= 10 × 10 × 10 = 1000'],
        result:{ko:'8×125=1000! 100의 쌍(4×25)이 한 번 더 친구를 만나면 1000의 쌍이 돼요.',en:'8×125=1000! When the 100-pair (4×25) meets a friend once more, it becomes a 1000-pair.',zh:'8×125=1000！100的对（4×25）再遇到一次朋友，就变成1000的对了。'},
        book:{ko:'1000을 만드는 쌍들: 8×125, 2×500, 4×250, 40×25, 5×200, 20×50, 10×100. 전부 2와 5의 조합이에요.',
              en:'Pairs that make 1000: 8×125, 2×500, 4×250, 40×25, 5×200, 20×50, 10×100. All are combinations of 2 and 5.',
              zh:'凑成1000的对：8×125，2×500，4×250，40×25，5×200，20×50，10×100。全都是2和5的组合。'} },

      { tag:{ko:'② 다른 인수와 곱하기',en:'2) Multiply by the remaining factor',zh:'② 再乘其余因数'},
        head:{ko:'8×7×125 = ?',en:'8×7×125 = ?',zh:'8×7×125 = ?'},
        desc:{ko:'세 수를 곱할 때도 똑같아요. 8과 125를 먼저 찾아 곱하면 1000, 그 다음 나머지 수(7)를 곱해요. 8×7×125=(8×125)×7=1000×7=7000.',
              en:'Same idea with three numbers. Find 8 and 125 first, multiply to make 1000, then multiply by the remaining factor (7). 8×7×125=(8×125)×7=1000×7=7000.',
              zh:'三数相乘也一样。先找到8和125相乘得1000，再乘其余的数（7）。8×7×125=(8×125)×7=1000×7=7000。'},
        mathSteps:['8 × 7 × 125','= (8 × 125) × 7','= 1000 × 7','= 7000'],
        result:{ko:'8×7×125=7000! 곱하기 1000은 뒤에 000만 붙이면 끝!',en:'8×7×125=7000! Multiplying by 1000 just means adding three zeros!',zh:'8×7×125=7000！乘1000就是在后面加三个0！'},
        book:null },

      { tag:{ko:'③ 계보의 완성으로 가는 길',en:'3) On the way to completing the lineage',zh:'③ 通往完成家族的路'},
        head:{ko:'10 → 100 → 1000, 다음은?',en:'10 → 100 → 1000, what comes next?',zh:'10 → 100 → 1000，接下来呢？'},
        desc:{ko:'2×5=10 (한 번), 4×25=100 (두 번), 8×125=1000 (세 번)! 이 계보는 나중에 분수를 소수로 바꾸는 마법(1/5=2/10=0.2)으로 이어져요. 분모 속에 숨은 2와 5를 찾는 게 똑같은 마법이에요.',
              en:'2×5=10 (once), 4×25=100 (twice), 8×125=1000 (three times)! This lineage later becomes the magic that turns fractions into decimals (1/5=2/10=0.2) — finding the hidden 2s and 5s in the denominator is the very same trick.',
              zh:'2×5=10（一次），4×25=100（两次），8×125=1000（三次）！这条家族之后会变成把分数化成小数的魔法（1/5=2/10=0.2）——在分母里找到藏着的2和5，正是同一个魔法。'},
        mathSteps:['2×5=10','4×25=100','8×125=1000'],
        result:{ko:'2와 5는 몇 번을 만나도 계속 친구예요!',en:'No matter how many times, 2 and 5 stay friends!',zh:'不管见几次面，2和5永远是朋友！'},
        book:null }
    ],
    rule:{ ko:'① 8×125, 2×500, 4×250 같은 1000의 쌍 외우기  ② 쌍을 먼저 곱해 1000 만들기  ③ 나머지 인수와 곱하고 000 붙이기',
      en:'① Memorise 1000-pairs like 8×125, 2×500, 4×250  ② Multiply the pair first to make 1000  ③ Multiply the rest and add three zeros',
      zh:'① 记住8×125，2×500，4×250这样凑1000的对  ② 先乘这个对凑成1000  ③ 再乘其余因数，加三个0' }
  },

  check:{
    fills:[
      { tex:'8 \\times 3 \\times 125 = \\square', answer:3000,
        hint:{ ko:'(8×125)×3=1000×3=?', en:'(8×125)×3=1000×3=?', zh:'(8×125)×3=1000×3=？' } },
      { tex:'2 \\times 500 \\times 6 = \\square', answer:6000,
        hint:{ ko:'(2×500)×6=1000×6=?', en:'(2×500)×6=1000×6=?', zh:'(2×500)×6=1000×6=？' } }
    ],
    open:{ ko:'40×25를 계산해 봐요. 1000의 쌍인지 확인하고 계산해요.',
      en:'Compute 40×25. Check whether it is a 1000-pair first.',
      zh:'计算40×25。先确认它是不是凑1000的对。' },
    openHint:{ ko:'40×25=1000. 40과 25도 1000을 만드는 쌍이에요(2와 5가 세 번 만나요: 40=2³×5, 25=5²).',
      en:'40×25=1000. 40 and 25are also a 1000-pair (2 and 5 meet three times: 40=2³×5, 25=5²).',
      zh:'40×25=1000。40和25也是凑1000的对（2和5见了三次面：40=2³×5，25=5²）。' }
  },

  lab:{
    generator:'ml_pair10', level:'main', count:4,
    params:{ target:1000 },
    intro:{
      ko:'곱해서 1000 만들기 마법! 8×125 같은 쌍을 먼저 찾아봐.',
      en:'Make 1000 magic! Find a pair like 8×125 first.',
      zh:'凑1000魔法！先找到像8×125这样的对。'
    }
  },

  arena:{
    generator:'ml_pair10', level:'main', count:8, timeLimit:300,
    params:{ target:1000 },
    rule:{ ko:'5분 안에 ×1000 쌍 문제를 모두 풀어요!', en:'Solve all ×1000 pair problems in 5 minutes!', zh:'5分钟内解答所有×1000对题！' }
  },

  stamp:{ label:{ ko:'1000 쌍 달인', en:'Pairs-of-1000 Master', zh:'凑1000达人' }, coins:35 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'1000 완성! 🏆',en:'Made 1000!',zh:'凑出1000了！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'8×125=1000 쌍을 찾아봐!',en:'Find the 8×125=1000 pair!',zh:'找找8×125=1000的对！'}, {ko:'거의 다 왔어!',en:'Almost!',zh:'就快了！'} ],
    finish:{ ko:'완벽해! 1000 쌍 달인! 🏆✨', en:'Perfect! Pairs-of-1000 Master!', zh:'完美！凑1000达人！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
