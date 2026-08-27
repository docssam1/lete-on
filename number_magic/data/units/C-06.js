/* Numbers of Magic — 유닛 C-06: ×9 전략 마법 (중급 B 챕터2) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['C-06'] = {
  id:'C-06', tier:'intermediate', level:'C', order:6,
  lineage:['nine-next-door'],
  generator:'ml_x9',
  title:{ ko:'×9 전략 마법', en:'The ×9 Strategy Magic', zh:'×9策略魔法' },
  subtitle:{ ko:'×9는 ×10 하고 한 번 빼기! 37×9=370-37=333', en:'×9 is ×10 minus one copy! 37×9=370-37=333', zh:'×9就是×10再减一次！37×9=370-37=333' },
  icon:'9️⃣',

  practice:{
    generator:'ml_x9', level:'practice', count:5,
    params:{},
    intro:{
      ko:'9를 곱할 때는 10을 곱한 뒤 원래 수를 한 번 빼면 돼. ×10은 0만 붙이면 되니까 아주 쉬워! 준비됐지?',
      en:"To multiply by 9, multiply by 10 then subtract the number once. ×10 just adds a zero — super easy! Ready?",
      zh:'乘9时先乘10再减去原数一次。×10只要加个0，超简单！准备好了吗？'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 9는 10보다 1 작아요',en:'1) 9 is one less than 10',zh:'① 9比10小1'},
        head:{ko:'×9 = ×10 − ×1',en:'×9 = ×10 − ×1',zh:'×9 = ×10 − ×1'},
        desc:{ko:'9묶음은 <b>10묶음에서 1묶음을 뺀 것</b>과 같아요. 그래서 어떤 수든 ×9는 <b>×10 하고 그 수를 한 번 빼면</b> 돼요. 예: 7×9 = 7×10−7 = 70−7 = 63. 구구단 9단도 사실 이 원리로 만들어져 있어요!',
              en:'Nine groups is the same as <b>ten groups minus one group</b>. So any number ×9 is just <b>×10 then subtract the number once</b>. E.g. 7×9 = 7×10−7 = 70−7 = 63. Even the 9 times table works this way!',
              zh:'9组等于<b>10组减去1组</b>。所以任何数×9，只要<b>×10再减去这个数一次</b>。例：7×9 = 7×10−7 = 70−7 = 63。九九表的9段其实就是这个原理！'},
        mathSteps:['7 × 9','= 7 × (10 − 1)','= 70 − 7','= 63'],
        result:{ko:'7×9=63! 10묶음에서 1묶음 빼기 = ×9.',en:'7×9=63! Ten groups minus one group = ×9.',zh:'7×9=63！10组减1组 = ×9。'},
        book:{ko:'분배법칙: a×9 = a×(10−1) = a×10 − a×1. 곱셈을 (10−1)로 쪼개어 쉬운 두 계산으로 바꾸는 거예요.',
              en:'Distributive law: a×9 = a×(10−1) = a×10 − a×1. We split the multiplication into two easy steps.',
              zh:'分配律：a×9 = a×(10−1) = a×10 − a×1。把乘法拆成两个简单的计算。'} },

      { tag:{ko:'② 두 자리 수도 똑같이',en:'2) Works for two-digit numbers too',zh:'② 两位数也一样'},
        head:{ko:'37×9 = 370 − 37 = 333',en:'37×9 = 370 − 37 = 333',zh:'37×9 = 370 − 37 = 333'},
        desc:{ko:'큰 수일수록 이 전략이 빛나요! <b>37×9</b>를 세로셈 없이: 37×10=370(0만 붙임), 370−37=333. 끝! 두 자리 수 곱셈이 <b>뺄셈 한 번</b>으로 바뀌었어요.',
              en:'The bigger the number, the more this strategy shines! <b>37×9</b> without column multiplication: 37×10=370 (just add a zero), then 370−37=333. Done! A two-digit multiplication became <b>one subtraction</b>.',
              zh:'数越大这个策略越厉害！<b>37×9</b>不用竖式：37×10=370（加个0），370−37=333。搞定！两位数乘法变成了<b>一次减法</b>。'},
        mathSteps:['37 × 9','= 37 × 10 − 37','= 370 − 37','= 333'],
        result:{ko:'37×9=333! 0 붙이고 한 번 빼면 끝.',en:'37×9=333! Add a zero, subtract once, done.',zh:'37×9=333！加个0，减一次，完成。'},
        book:{ko:'같은 원리로 ×99도 가능: a×99 = a×100 − a. 예: 23×99 = 2300−23 = 2277. ×999도 마찬가지!',
              en:'Same idea for ×99: a×99 = a×100 − a. E.g. 23×99 = 2300−23 = 2277. Works for ×999 too!',
              zh:'同样的原理可用于×99：a×99 = a×100 − a。例：23×99 = 2300−23 = 2277。×999也一样！'} },

      { tag:{ko:'③ 뺄셈 요령',en:'3) Subtraction know-how',zh:'③ 减法技巧'},
        head:{ko:'370−37: 뒤에서부터 차분하게',en:'370−37: subtract calmly from the right',zh:'370−37：从右边冷静地减'},
        desc:{ko:'×10 뒤의 뺄셈이 열쇠예요. <b>370−37</b>은 370−30=340, 340−7=333처럼 <b>두 번에 나눠 빼면</b> 실수가 없어요. 또는 370−40=330, 330+3=333(3을 더 뺐으니 돌려주기)도 좋아요.',
              en:'The subtraction after ×10 is the key. For <b>370−37</b>, split it: 370−30=340, then 340−7=333 — no mistakes. Or over-subtract: 370−40=330, then give back 3: 330+3=333.',
              zh:'×10之后的减法是关键。<b>370−37</b>分两步：370−30=340，340−7=333——不会出错。或者多减再补：370−40=330，330+3=333。'},
        mathSteps:['370 − 37','= 370 − 30 − 7','= 340 − 7','= 333'],
        result:{ko:'뺄셈도 쪼개면 쉬워요! 십의 자리 먼저, 일의 자리 다음.',en:'Split the subtraction too! Tens first, then ones.',zh:'减法也拆开做！先减十位，再减个位。'},
        book:null }
    ],
    rule:{ ko:'① ×9 = ×10 − 원래 수  ② ×10은 0만 붙이기  ③ 뺄셈은 십의 자리→일의 자리 순서로',
      en:'① ×9 = ×10 − the number  ② ×10 just adds a zero  ③ Subtract tens first, then ones',
      zh:'① ×9 = ×10 − 原数  ② ×10只要加0  ③ 减法先减十位再减个位' }
  },

  check:{
    fills:[
      { tex:'26 \\times 9 = \\square', answer:234,
        hint:{ ko:'26×10=260, 260−26=?', en:'26×10=260, then 260−26=?', zh:'26×10=260，260−26=？' } },
      { tex:'45 \\times 9 = \\square', answer:405,
        hint:{ ko:'45×10=450, 450−45=?', en:'45×10=450, then 450−45=?', zh:'45×10=450，450−45=？' } }
    ],
    open:{ ko:'63×9를 ×9 전략으로 계산하고, 왜 ×10에서 한 번만 빼면 되는지 설명해 봐요.',
      en:'Compute 63×9 with the ×9 strategy, and explain why subtracting just once from ×10 works.',
      zh:'用×9策略计算63×9，并解释为什么从×10只减一次就行。' },
    openHint:{ ko:'예) 63×10=630, 630−63=567. 9묶음은 10묶음보다 딱 1묶음(63) 적으니까 한 번만 빼면 돼요.',
      en:'e.g. 63×10=630, 630−63=567. Nine groups is exactly one group (63) less than ten groups, so subtract once.',
      zh:'例）63×10=630，630−63=567。9组正好比10组少1组（63），所以只减一次。' }
  },

  lab:{
    generator:'ml_x9', level:'main', count:4,
    params:{},
    intro:{
      ko:'×9 마법 시작! ×10 하고 한 번 빼봐.',
      en:'×9 magic begins! Multiply by 10, subtract once.',
      zh:'×9魔法开始！乘10，减一次。'
    }
  },

  arena:{
    generator:'ml_x9', level:'main', count:8, timeLimit:300,
    params:{},
    rule:{ ko:'5분 안에 ×9 문제를 모두 풀어요!', en:'Solve all ×9 problems in 5 minutes!', zh:'5分钟内解答所有×9题！' }
  },

  stamp:{ label:{ ko:'×9 달인', en:'×9 Master', zh:'×9达人' }, coins:30 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'×9 마법 성공! 9️⃣',en:'×9 magic!',zh:'×9魔法成功！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'먼저 ×10을 해봐!',en:'Do ×10 first!',zh:'先乘10！'}, {ko:'그 다음 원래 수를 한 번 빼!',en:'Then subtract the number once!',zh:'然后减去原数一次！'} ],
    finish:{ ko:'완벽해! ×9 달인! 9️⃣✨', en:'Perfect! ×9 Master!', zh:'完美！×9达人！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
