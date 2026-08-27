/* Numbers of Magic — 유닛 M-06: 정수의 사칙 혼합 계산 (중등 W8 · 중1 정수와 유리수) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-06'] = {
  id:'M-06', tier:'middle1', level:'30', order:6,
  generator:'md6_intMixed',
  title:{ ko:'정수의 사칙 혼합 계산', en:'Mixed Integer Operations', zh:'整数四则混合运算' },
  subtitle:{ ko:'괄호 → 곱셈·나눗셈 → 덧셈·뺄셈, 순서는 부호가 있어도 그대로', en:'Brackets → × ÷ → + − , the order never changes even with signs', zh:'括号→乘除→加减，顺序不因符号而改变' },
  icon:'🔀',

  practice:{
    generator:'md6_intMixed', level:'practice', count:5,
    params:{mode:'noBrackets', level:'practice'},
    intro:{
      ko:'괄호가 없으면 곱셈·나눗셈을 먼저! 부호가 있어도 순서는 똑같아.',
      en:'No brackets? Multiply or divide first! The order stays the same even with signs.',
      zh:'没有括号就先算乘除！有符号也遵循同样的顺序。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 곱셈·나눗셈이 항상 먼저',en:'1) × and ÷ always come first',zh:'① 乘除永远优先'},
        head:{ko:'−5 + 3 × (−4) = −17',en:'−5 + 3 × (−4) = −17',zh:'−5 + 3 × (−4) = −17'},
        desc:{ko:'덧셈보다 <b>곱셈을 먼저</b> 계산해요: 3×(−4)=−12. 그다음 −5+(−12)=<b>−17</b>. 부호가 섞여 있어도 "곱셈·나눗셈 먼저"라는 순서 규칙은 똑같이 적용돼요.',
              en:'<b>Multiply before</b> adding: 3×(−4)=−12. Then −5+(−12)=<b>−17</b>. Even with mixed signs, the "× and ÷ first" order rule applies exactly the same way.',
              zh:'先算<b>乘法</b>再加：3×(−4)=−12。然后−5+(−12)=<b>−17</b>。就算符号混杂，"先乘除"的顺序规则依然适用。'},
        mathSteps:['-5 + 3\\times(-4)', '3\\times(-4) = -12', '-5+(-12) = -17'],
        result:{ko:'부호가 있어도 순서 규칙은 흔들리지 않아요!',en:'Signs never shake the order rule!',zh:'有符号也不会动摇顺序规则！'},
        book:null },

      { tag:{ko:'② 괄호는 그보다 더 먼저',en:'2) Brackets come before even that',zh:'② 括号比乘除更优先'},
        head:{ko:'(−4+7) × (−2) − 5 = −11',en:'(−4+7) × (−2) − 5 = −11',zh:'(−4+7) × (−2) − 5 = −11'},
        desc:{ko:'가장 먼저 <b>괄호 안</b>을 계산해요: −4+7=3. 그다음 곱셈: 3×(−2)=−6. 마지막에 뺄셈: −6−5=<b>−11</b>. "괄호 → 곱나눗 → 덧뺄"의 순서를 지키면 아무리 복잡해도 헷갈리지 않아요.',
              en:'<b>Brackets</b> go first: −4+7=3. Then multiply: 3×(−2)=−6. Finally subtract: −6−5=<b>−11</b>. Following "brackets → × ÷ → + −" keeps even a complicated expression from being confusing.',
              zh:'先算<b>括号</b>：−4+7=3。再乘：3×(−2)=−6。最后减：−6−5=<b>−11</b>。遵循"括号→乘除→加减"，再复杂的算式也不会乱。'},
        mathSteps:['(-4+7)\\times(-2)-5', '(-4+7)=3', '3\\times(-2)-5 = -11'],
        result:{ko:'순서만 지키면 부호가 있는 사칙 혼합도 두렵지 않아요!',en:'Keep the order and signed mixed operations stop being scary!',zh:'守住顺序，带符号的四则混合运算也不可怕！'},
        book:{ko:'나눗셈이 섞여 있어도 곱셈과 같은 우선순위예요 — 곱셈·나눗셈끼리는 앞에서부터 차례로 계산해요.',
              en:'Division has the same priority as multiplication — among × and ÷, work strictly left to right.',
              zh:'除法和乘法优先级相同——乘除之间从左到右依次计算。'} }
    ],
    rule:{ ko:'① 괄호 안이 가장 먼저  ② 그다음 곱셈·나눗셈(앞에서부터)  ③ 마지막에 덧셈·뺄셈(앞에서부터)',
      en:'① Brackets first  ② Then × and ÷ (left to right)  ③ Finally + and − (left to right)',
      zh:'① 括号最先  ② 然后乘除(从左到右)  ③ 最后加减(从左到右)' }
  },

  check:{
    fills:[
      { tex:'6 + (-2) \\times 5 = \\square', answer:-4,
        hint:{ ko:'곱셈 먼저: (-2)×5=-10', en:'Multiply first: (-2)×5=-10', zh:'先乘：(-2)×5=-10' } },
      { tex:'(3 + (-8)) \\times 2 = \\square', answer:-10,
        hint:{ ko:'괄호 먼저: 3+(-8)=-5', en:'Brackets first: 3+(-8)=-5', zh:'先算括号：3+(-8)=-5' } }
    ],
    open:{ ko:'−10 + 6 ÷ (−2)를 순서에 맞춰 계산해봐요.',
      en:'Compute −10 + 6 ÷ (−2) following the correct order.',
      zh:'按正确顺序计算−10 + 6 ÷ (−2)。' },
    openHint:{ ko:'나눗셈 먼저: 6÷(−2)=−3. 그다음 −10+(−3)=−13.',
      en:'Divide first: 6÷(−2)=−3. Then −10+(−3)=−13.',
      zh:'先除：6÷(−2)=−3。再算−10+(−3)=−13。' }
  },

  lab:{
    generator:'md6_intMixed', level:'main', count:4,
    params:{mode:'brackets', level:'main'},
    intro:{
      ko:'괄호부터, 그다음 곱셈, 마지막에 뺄셈 — 순서를 지켜봐!',
      en:'Brackets first, then multiply, subtract last — keep the order!',
      zh:'先括号，再乘法，最后减法——守住顺序！'
    }
  },

  arena:{
    generator:'md6_intMixed', level:'main', count:8, timeLimit:300,
    params:{mode:'withDivChain', level:'main'},
    rule:{ ko:'5분 안에 나눗셈이 섞인 혼합 계산을 모두 풀어요!', en:'Solve all mixed operations with division in 5 minutes!', zh:'5分钟内解答所有含除法的混合运算！' }
  },

  stamp:{ label:{ ko:'순서 지킴이', en:'Order Keeper', zh:'顺序守护者' }, coins:34 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'순서를 완벽히 지켰어! 🔀',en:'Perfect order!',zh:'顺序守得很好！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'괄호 안부터 계산했는지 확인해봐!',en:'Check that you did the brackets first!',zh:'检查一下有没有先算括号！'}, {ko:'곱셈·나눗셈이 덧셈·뺄셈보다 먼저야!',en:'× and ÷ come before + and −!',zh:'乘除要先于加减！'} ],
    finish:{ ko:'완벽해! 순서 지킴이! 🔀✨', en:'Perfect! Order Keeper!', zh:'完美！顺序守护者！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
