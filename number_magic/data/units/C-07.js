/* Numbers of Magic — 유닛 C-07: 쪼개서 곱하기 (중급 B 챕터3) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['C-07'] = {
  id:'C-07', tier:'intermediate', level:'C', order:7,
  generator:'ml6_mul2d1dMental',
  title:{ ko:'쪼개서 곱하기', en:'Split-and-Multiply', zh:'拆开乘法' },
  subtitle:{ ko:'47×6 = 40×6 + 7×6: 십과 일로 쪼개요!', en:'47×6 = 40×6 + 7×6: split into tens and ones!', zh:'47×6 = 40×6 + 7×6：拆成十位和个位！' },
  icon:'✂️',

  practice:{
    generator:'ml6_mul2d1dMental', level:'practice', count:5,
    params:{ easy:false },
    intro:{
      ko:'두 자리 수를 십의 자리와 일의 자리로 쪼개서 각각 곱한 뒤 더할 거야. 분배법칙 마법이지! 준비됐지?',
      en:"We'll split a two-digit number into tens and ones, multiply each, then add. Distributive law magic! Ready?",
      zh:'把两位数拆成十位和个位，分别相乘再相加。这就是分配律魔法！准备好了吗？'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 분배법칙이란?',en:'1) The distributive law',zh:'① 什么是分配律？'},
        head:{ko:'(40+7)×6 = 40×6 + 7×6',en:'(40+7)×6 = 40×6 + 7×6',zh:'(40+7)×6 = 40×6 + 7×6'},
        desc:{ko:'47×6이 어려워 보여요? <b>47을 40+7로 쪼개면</b> 쉬워져요! (40+7)×6 = <b>40×6 + 7×6</b> = 240+42 = 282. 큰 수를 통째로 곱하는 대신, 쉬운 두 조각으로 나누어 곱하고 더하는 거예요. 이것이 <b>분배법칙</b>이에요.',
              en:'Does 47×6 look hard? <b>Split 47 into 40+7</b> and it gets easy! (40+7)×6 = <b>40×6 + 7×6</b> = 240+42 = 282. Instead of multiplying the whole number, split it into two easy pieces, multiply each, and add. This is the <b>distributive law</b>.',
              zh:'47×6看起来难吗？<b>把47拆成40+7</b>就简单了！(40+7)×6 = <b>40×6 + 7×6</b> = 240+42 = 282。不用整个数一起乘，拆成两个简单的部分分别乘再相加。这就是<b>分配律</b>。'},
        mathSteps:['47 × 6','= (40 + 7) × 6','= 240 + 42','= 282'],
        result:{ko:'47×6=282! 쪼개면 어려운 곱셈이 쉬운 곱셈 2개가 돼요.',en:'47×6=282! Splitting turns one hard product into two easy ones.',zh:'47×6=282！拆开后，一个难题变成两个简单题。'},
        book:{ko:'분배법칙: (a+b)×c = a×c + b×c. 곱셈이 덧셈 위에 "분배"되는 성질이에요. 모든 세로셈 곱셈의 원리이기도 해요.',
              en:'Distributive law: (a+b)×c = a×c + b×c. Multiplication "distributes" over addition — this is also how column multiplication works.',
              zh:'分配律：(a+b)×c = a×c + b×c。乘法"分配"到加法上——竖式乘法也是这个原理。'} },

      { tag:{ko:'② 머릿속 순서',en:'2) The mental order',zh:'② 心算顺序'},
        head:{ko:'큰 조각 먼저, 작은 조각 나중!',en:'Big piece first, small piece second!',zh:'先算大块，再算小块！'},
        desc:{ko:'암산할 때는 <b>십의 자리(큰 조각)부터</b> 곱해요. 68×7: ①60×7=420 ②8×7=56 ③420+56=476. 큰 수부터 계산하면 답의 크기를 먼저 알 수 있어서 실수를 바로 알아차릴 수 있어요.',
              en:'When calculating mentally, multiply <b>the tens (big piece) first</b>. 68×7: ①60×7=420 ②8×7=56 ③420+56=476. Starting with the big piece tells you the answer\'s size early, so mistakes stand out.',
              zh:'心算时<b>先乘十位（大块）</b>。68×7：①60×7=420 ②8×7=56 ③420+56=476。先算大的部分能提前知道答案的大小，容易发现错误。'},
        mathSteps:['68 × 7','= 60×7 + 8×7','= 420 + 56','= 476'],
        result:{ko:'68×7=476! 큰 조각 먼저 → 답의 어림값이 바로 보여요.',en:'68×7=476! Big piece first → you instantly see the estimate.',zh:'68×7=476！先算大块→马上看出估算值。'},
        book:{ko:'어림 습관: 68×7은 70×7=490보다 조금 작아야 해요. 답이 476이니 맞는 범위! 이렇게 항상 어림으로 검산해요.',
              en:'Estimation habit: 68×7 must be a bit less than 70×7=490. Our 476 fits! Always check with an estimate.',
              zh:'估算习惯：68×7应该比70×7=490略小。答案476符合！要养成估算检验的习惯。'} },

      { tag:{ko:'③ 덧셈 마무리 요령',en:'3) Finishing the addition',zh:'③ 加法收尾技巧'},
        head:{ko:'420+56: 받아올림을 조심!',en:'420+56: watch the carry!',zh:'420+56：注意进位！'},
        desc:{ko:'마지막 덧셈에서 실수가 가장 많아요. <b>420+56</b>은 420+50=470, 470+6=476처럼 <b>십 먼저, 일 나중</b>으로 더해요. 받아올림이 있는 경우(예: 280+63=343)는 특히 천천히!',
              en:'Most mistakes happen in the final addition. For <b>420+56</b>, add <b>tens first, then ones</b>: 420+50=470, 470+6=476. Be extra careful when there\'s a carry (e.g. 280+63=343)!',
              zh:'最后的加法最容易出错。<b>420+56</b>要<b>先加十位再加个位</b>：420+50=470，470+6=476。有进位时（如280+63=343）要特别小心！'},
        mathSteps:['420 + 56','= 420 + 50 + 6','= 470 + 6','= 476'],
        result:{ko:'덧셈도 쪼개서! 십 먼저 더하면 받아올림이 무섭지 않아요.',en:'Split the addition too! Tens first makes carries harmless.',zh:'加法也拆开！先加十位，进位就不可怕了。'},
        book:null }
    ],
    rule:{ ko:'① 두 자리 수를 십+일로 쪼개기  ② 큰 조각부터 곱하기  ③ 두 결과를 십 먼저 더하기',
      en:'① Split the two-digit number into tens+ones  ② Multiply the big piece first  ③ Add the results, tens first',
      zh:'① 把两位数拆成十位+个位  ② 先乘大块  ③ 两个结果先加十位' }
  },

  check:{
    fills:[
      { tex:'53 \\times 7 = \\square', answer:371,
        hint:{ ko:'50×7=350, 3×7=21, 350+21=?', en:'50×7=350, 3×7=21, 350+21=?', zh:'50×7=350，3×7=21，350+21=？' } },
      { tex:'86 \\times 4 = \\square', answer:344,
        hint:{ ko:'80×4=320, 6×4=24, 320+24=?', en:'80×4=320, 6×4=24, 320+24=?', zh:'80×4=320，6×4=24，320+24=？' } }
    ],
    open:{ ko:'분배법칙 (a+b)×c = a×c + b×c가 왜 성립하는지 그림이나 예로 설명해 봐요.',
      en:'Explain with a picture or example why the distributive law (a+b)×c = a×c + b×c is true.',
      zh:'用图或例子解释为什么分配律(a+b)×c = a×c + b×c成立。' },
    openHint:{ ko:'예) 가로 47칸(40+7), 세로 6칸인 사각형을 세로선으로 자르면 40×6 사각형과 7×6 사각형. 두 넓이를 더하면 전체 넓이와 같아요.',
      en:'e.g. A 47-by-6 rectangle cut vertically gives a 40×6 piece and a 7×6 piece. The two areas add up to the whole.',
      zh:'例）把47×6的长方形竖着切开，得到40×6和7×6两块。两块面积加起来等于整体。' }
  },

  lab:{
    generator:'ml6_mul2d1dMental', level:'main', count:4,
    params:{ easy:false },
    intro:{
      ko:'쪼개서 곱하기 마법! 십의 자리부터 곱해봐.',
      en:'Split-and-multiply magic! Start with the tens.',
      zh:'拆开乘法魔法！从十位开始乘。'
    }
  },

  arena:{
    generator:'ml6_mul2d1dMental', level:'main', count:8, timeLimit:300,
    params:{ easy:false },
    rule:{ ko:'5분 안에 쪼개서 곱하기 문제를 모두 풀어요!', en:'Solve all split-multiply problems in 5 minutes!', zh:'5分钟内解答所有拆开乘法题！' }
  },

  stamp:{ label:{ ko:'분배법칙 마법사', en:'Distributive Wizard', zh:'分配律魔法师' }, coins:30 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'멋지게 쪼갰어! ✂️',en:'Nice split!',zh:'拆得漂亮！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'십의 자리부터 곱해봐!',en:'Multiply the tens first!',zh:'先乘十位！'}, {ko:'두 조각을 더하는 걸 잊지 마!',en:'Don\'t forget to add the pieces!',zh:'别忘了把两块加起来！'} ],
    finish:{ ko:'완벽해! 분배법칙 마법사! ✂️✨', en:'Perfect! Distributive Wizard!', zh:'完美！分配律魔法师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
