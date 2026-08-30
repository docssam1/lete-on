/* Numbers of Magic — 유닛 H-11: 몰아주기 곱 (고급 A-3·A-4·B-5 · 과정 19 보강) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['H-11'] = {
  id:'H-11', tier:'advanced', level:'boost', order:1,
  lineage:['nine-next-door'],
  generator:'adv_anchorTens',
  title:{ ko:'몰아주기 곱', en:'Anchor-the-Tens Multiplication', zh:'集中相乘法' },
  subtitle:{ ko:'78×73 = 70×(70+8+3)+8×3! 십의 자리에 다 몰아줘요.', en:'78×73 = 70×(70+8+3)+8×3! Anchor it all on the tens.', zh:'78×73 = 70×(70+8+3)+8×3！都集中在十位上。' },
  icon:'🎁',

  practice:{
    generator:'adv_anchorTens', level:'practice', count:5,
    params:{mode:'sameTens'},
    intro:{
      ko:'십의 자리가 같은 두 수를 곱해봐. 기준수 하나로 다 몰아줄 수 있어!',
      en:'Multiply two numbers with the same tens digit — anchor everything on one base!',
      zh:'算算十位相同的两个数相乘——都集中在一个基准上！'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 기준수에 다 몰아줘요',en:'1) Anchor everything on the base',zh:'① 都集中到基准数上'},
        head:{ko:'78×73 = 70×81+24 = 5694',en:'78×73 = 70×81+24 = 5694',zh:'78×73 = 70×81+24 = 5694'},
        desc:{ko:'78과 73은 둘 다 십의 자리가 7예요. 기준수 70에 두 일의 자리(8과 3)를 <b>더 얹어서</b> 곱해요: 70×(70+8+3)=70×81=5670. 여기에 일의 자리끼리 곱한 걸 더해요: 8×3=24. 5670+24=<b>5694</b>! (10a+b)(10a+c)=10a(10a+b+c)+bc라는 원리예요.',
              en:'Both 78 and 73 have tens digit 7. Multiply the base 70 by itself <b>plus both ones digits</b> (8 and 3): 70×(70+8+3)=70×81=5670. Then add the product of the ones: 8×3=24. 5670+24=<b>5694</b>! The rule: (10a+b)(10a+c)=10a(10a+b+c)+bc.',
              zh:'78和73的十位都是7。用基准70乘以（自己加上两个个位数8和3）：70×(70+8+3)=70×81=5670。再加上个位相乘：8×3=24。5670+24=<b>5694</b>！原理是(10a+b)(10a+c)=10a(10a+b+c)+bc。'},
        mathSteps:['70 × (70+8+3) = 70×81 = 5670','8 × 3 = 24','5670 + 24 = 5694'],
        result:{ko:'78×73=5694! 기준수에 일의 자리 둘을 얹어 곱하고, 일의 자리끼리 곱한 걸 더해요.',en:'78×73=5694! Anchor on the base plus both ones digits, then add their product.',zh:'78×73=5694！基准加上两个个位相乘，再加个位之积。'},
        book:{ko:'십의 자리가 살짝 달라도(78×82처럼) 더 가까운 쪽을 기준으로 삼으면 여전히 통해요 — 기준수는 자유롭게 골라도 돼요.',
              en:'Even when the tens digits differ slightly (like 78×82), anchoring on the nearer one still works — you get to pick the base freely.',
              zh:'即使十位略有不同（比如78×82），以较近的那个为基准同样有效——基准数可以自由选择。'} },

      { tag:{ko:'② 합이 딱 10이면 더 빨라요',en:'2) When the sum is exactly 10, it\'s even faster',zh:'② 恰好和为10，速度更快'},
        head:{ko:'36×34: 십의 자리 같고 일의 자리 합 10',en:'36×34: same tens, ones sum to 10',zh:'36×34：十位相同，个位和为10'},
        desc:{ko:'36과 34는 십의 자리가 3으로 같고, 일의 자리 6+4=10이에요! 이럴 땐 앞자리를 <b>3×4=12</b>로 바로 구하고, 뒷자리는 <b>6×4=24</b>로 이어붙이면 끝: <b>1224</b>. 일의 자리는 같고 십의 자리 합이 10인 경우(36×76)도 있어요 — 이땐 앞자리=3×7+6=27, 뒷자리=6²=36 → <b>2736</b>. 두 조건을 동시에 만족하면(55×55) 둘 다 써도 답은 같아요!',
              en:'36 and 34 share tens digit 3, and their ones digits sum to 6+4=10! Here the front is instantly <b>3×4=12</b>, and the back is <b>6×4=24</b> attached: <b>1224</b>. There\'s also the mirror case — same ones, tens summing to 10 (36×76): front=3×7+6=27, back=6²=36 → <b>2736</b>. And when both conditions hold at once (55×55), either shortcut gives the same answer!',
              zh:'36和34十位都是3，个位6+4=10！这时前面直接是<b>3×4=12</b>，后面接上<b>6×4=24</b>：<b>1224</b>。还有镜像情况——个位相同、十位和为10（36×76）：前=3×7+6=27，后=6²=36 → <b>2736</b>。两个条件同时成立时（比如55×55），用哪个捷径答案都一样！'},
        mathSteps:[{ko:'3×4=12 (앞자리)',en:'3×4=12 \\text{ (front part)}',zh:'3×4=12（前段）'},{ko:'6×4=24 (뒷자리)',en:'6×4=24 \\text{ (back part)}',zh:'6×4=24（后段）'},'1224'],
        result:{ko:'36×34=1224! 십의 자리×(십의 자리+1)과 일의 자리끼리의 곱만 붙이면 끝나요.',en:'36×34=1224! Just attach tens×(tens+1) to the product of the ones.',zh:'36×34=1224！只需把十位×(十位+1)接上个位之积。'},
        book:{ko:'일반형(몰아주기)이 특수형(합10) 두 가지를 모두 품고 있어요 — 특수형은 일반형의 빠른 지름길일 뿐이에요.',
              en:'The general anchor formula contains both special cases — the sum-of-10 shortcuts are just faster paths through it.',
              zh:'通用的集中相乘公式其实涵盖了这两种特殊情况——和为10的捷径只是它的快速通道。'} }
    ],
    rule:{ ko:'① 십의 자리가 같으면(또는 가까우면) 기준수로 삼기  ② 기준×(기준+두 일의자리 합)+두 일의자리끼리의 곱  ③ 합이 10이면 더 빠른 지름길',
      en:'① Anchor on the tens digit (or a nearby one)  ② base×(base+sum of ones)+product of ones  ③ Ones or tens summing to 10 gives an even faster shortcut',
      zh:'① 以十位（或相近的数）为基准  ② 基准×(基准+两个个位之和)+两个个位之积  ③ 和为10时有更快的捷径' }
  },

  check:{
    fills:[
      { tex:'85 \\times 85 = \\square', answer:7225,
        hint:{ ko:'80×90+25', en:'80×90+25', zh:'80×90+25' } },
      { tex:'42 \\times 48 = \\square', answer:2016,
        hint:{ ko:'일의 자리 합 10: 4×5=20, 2×8=16 → 2016', en:'ones sum to 10: 4×5=20, 2×8=16 → 2016', zh:'个位和为10：4×5=20，2×8=16 → 2016' } }
    ],
    open:{ ko:'23×83을 일의 자리 같고 십의 자리 합 10인 방법으로 풀고, 앞자리·뒷자리를 어떻게 만들었는지 설명해 봐요.',
      en:'Solve 23×83 using the same-ones, tens-sum-10 method, and explain how you built the front and back digits.',
      zh:'用"个位相同、十位和为10"的方法算23×83，说说前后两部分是怎么得到的。' },
    openHint:{ ko:'예) 앞: 2×8+3=19, 뒤: 3²=9 → 1909.',
      en:'e.g. front: 2×8+3=19, back: 3²=9 → 1909.',
      zh:'例）前：2×8+3=19，后：3²=9 → 1909。' }
  },

  lab:{
    generator:'adv_anchorTens', level:'main', count:4,
    params:{mode:'sameTensSum10'},
    intro:{
      ko:'일의 자리 합이 10인 지름길을 연습해보자!',
      en:'Practice the shortcut for ones digits summing to 10!',
      zh:'练习个位之和为10的捷径吧！'
    }
  },

  arena:{
    generator:'adv_anchorTens', level:'main', count:8, timeLimit:300,
    params:{mode:'nearTens'},
    rule:{ ko:'5분 안에 몰아주기 곱 문제를 모두 풀어요!', en:'Solve all anchor-multiplication problems in 5 minutes!', zh:'5分钟内解答所有集中相乘题！' }
  },

  stamp:{ label:{ ko:'몰아주기 곱 마법사', en:'Anchor-the-Tens Wizard', zh:'集中相乘魔法师' }, coins:34 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'기준에 딱 몰아줬어! 🎁',en:'Perfectly anchored!',zh:'集中得真好！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'기준수에 일의 자리 두 개를 다 더했는지 확인해봐!',en:'Check you added both ones digits to the base!',zh:'检查一下是否把两个个位都加到基准上了！'}, {ko:'일의 자리끼리 곱한 걸 뒷자리로 붙였는지 봐!',en:'Did you attach the product of the ones as the back digits?',zh:'个位相乘的结果接在后面了吗？' } ],
    finish:{ ko:'완벽해! 몰아주기 곱 마법사! 🎁✨', en:'Perfect! Anchor-the-Tens Wizard!', zh:'完美！集中相乘魔法师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
