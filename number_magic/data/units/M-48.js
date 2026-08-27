/* Numbers of Magic — 유닛 M-48: 식의 값 (중1 W8 · 문자와 식, 심화 유형 2차 2026-08-27) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-48'] = {
  id:'M-48', tier:'middle1', level:'29', order:11,
  generator:'md48_expressionValue',
  title:{ ko:'식의 값', en:'Evaluating Expressions', zh:'代数式的值' },
  subtitle:{ ko:'문자 자리에 수를 넣어 계산해요', en:'Substitute a number for the letter and calculate', zh:'把数代入字母的位置计算' },
  icon:'🎯',

  practice:{
    generator:'md48_expressionValue', level:'practice', count:5,
    params:{mode:'linear'},
    intro:{
      ko:'문자 자리에 수를 넣을 땐 곱셈 기호를 다시 살려서 계산해요. x=4면 3x는 3×4예요!',
      en:'When substituting a number for a letter, restore the multiplication sign before you calculate. If x=4, then 3x means 3×4!',
      zh:'把数代入字母时要把乘号补回来再计算。x=4时，3x就是3×4！'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'문자식 "3x+2"는 x가 어떤 수인지에 따라 값이 달라져요. x=1이면 5, x=10이면 32예요. 문자에 실제 수를 넣어서 값을 구하는 걸 "식의 값을 구한다"고 해요.',
        en:'The expression "3x+2" changes value depending on what x is. If x=1, it\'s 5; if x=10, it\'s 32. Substituting an actual number for the letter to find the result is called "evaluating the expression".',
        zh:'代数式"3x+2"的值会随x的不同而变化。x=1时是5，x=10时是32。把实际的数代入字母求出结果，叫做"求代数式的值"。' },
      history:{ ko:'문자에 수를 대입해 값을 구하는 방법은 방정식·함수 등 수학 전체의 기초예요. 컴퓨터 프로그램의 "변수"도 사실 이 문자식의 아이디어에서 나왔어요.',
        en:'Substituting a value for a letter is the foundation of equations, functions, and much of mathematics. Even the "variables" in computer programs come from this same idea of algebraic notation.',
        zh:'把数代入字母求值的方法是方程、函数等整个数学的基础。计算机程序里的"变量"其实也来自这个代数式的思想。' }
    },
    stages:[
      { tag:{ko:'① 곱셈 기호를 살려서 대입',en:'1) Restore the × before substituting',zh:'① 补回乘号再代入'},
        head:{ko:'x=4 \\;\\Rightarrow\\; 3x+2 = 3\\times 4+2 = 14',en:'x=4 \\;\\Rightarrow\\; 3x+2 = 3\\times 4+2 = 14',zh:'x=4 \\;\\Rightarrow\\; 3x+2 = 3\\times 4+2 = 14'},
        desc:{ko:'"3x"는 사실 "3×x"예요. x=4를 넣을 땐 지워졌던 곱셈 기호를 <b>다시 살려서</b> 3×4로 계산해요. 그다음 +2를 더하면 14가 나와요.',
              en:'"3x" is really "3×x". When you substitute x=4, <b>restore</b> the dropped multiplication sign and compute 3×4. Then add 2 to get 14.',
              zh:'"3x"其实是"3×x"。代入x=4时要把省略的乘号<b>补回来</b>算3×4，再加2得到14。'},
        mathSteps:['3\\times 4', '12+2', '=14'],
        result:{ko:'문자에 수를 넣을 땐 곱셈 기호를 살려서!',en:'Restore the multiplication sign when substituting!',zh:'代入数值时要补回乘号！'},
        book:{ko:'식의 값은 문자에 넣는 수가 바뀌면 매번 달라져요 — 그래서 "변수"라고 불러요.',
              en:'The value of the expression changes every time the substituted number changes — that\'s why it\'s called a "variable".',
              zh:'代入的数一变，代数式的值就跟着变——所以叫"变量"。'} },

      { tag:{ko:'② 음수를 대입할 땐 괄호로 감싸요',en:'2) Wrap a negative value in parentheses',zh:'② 代入负数要用括号括起来'},
        head:{ko:'x=-2 \\;\\Rightarrow\\; 2x^2-5x = 2(-2)^2-5(-2) = 18',en:'x=-2 \\;\\Rightarrow\\; 2x^2-5x = 2(-2)^2-5(-2) = 18',zh:'x=-2 \\;\\Rightarrow\\; 2x^2-5x = 2(-2)^2-5(-2) = 18'},
        desc:{ko:'음수 x=−2를 대입할 땐 <b>괄호로 감싸서</b> (−2)로 넣어야 부호 실수가 줄어요. (−2)²=4(짝수 번 곱하면 +), −5×(−2)=+10이 돼요.',
              en:'When substituting a negative x=−2, <b>wrap it in parentheses</b> as (−2) to avoid sign mistakes. (−2)²=4 (an even number of multiplications gives +), and −5×(−2)=+10.',
              zh:'代入负数x=−2时要<b>用括号括起来</b>写成(−2)，能减少符号出错。(−2)²=4(乘偶数次得正)，−5×(−2)=+10。'},
        mathSteps:['2(-2)^2-5(-2)', '2(4)-(-10)', '=18'],
        result:{ko:'음수를 대입할 땐 괄호로 감싸서 부호 실수를 줄여요!',en:'Wrap negative substitutions in parentheses to avoid sign errors!',zh:'代入负数用括号括起来，减少符号错误！'},
        book:{ko:'거듭제곱이 있으면 지수부터 계산하고, 그다음 곱셈, 마지막에 덧뺄셈 순서예요(연산 순서는 그대로!).',
              en:'With a power involved, compute the exponent first, then multiplication, then addition/subtraction — the order of operations still applies!',
              zh:'有乘方时先算指数，再算乘法，最后算加减——运算顺序不变！'} }
    ],
    rule:{ ko:'식의 값 = 문자에 수를 넣어 곱셈 기호를 살려 계산. 음수는 반드시 괄호로 감싸서 대입해요!',
      en:'To evaluate an expression, substitute the number, restoring the multiplication sign. Always wrap negative substitutions in parentheses!',
      zh:'求代数式的值：代入数值，补回乘号计算。代入负数一定要用括号括起来！' }
  },

  check:{
    fills:[
      { tex:'x=3\\text{일 때 } 2x+1 = \\square', answer:7,
        hint:{ ko:'2×3+1', en:'2×3+1', zh:'2×3+1' } },
      { tex:'x=-2\\text{일 때 } x^2+3x = \\square', answer:-2,
        hint:{ ko:'(-2)^2+3(-2) = 4-6', en:'(-2)^2+3(-2) = 4-6', zh:'(-2)^2+3(-2) = 4-6' } }
    ],
    open:{ ko:'x=−1일 때 3x²−2x의 값을 계산 과정과 함께 설명해봐요.',
      en:'Explain the value of 3x²−2x when x=−1, including the steps.',
      zh:'说说x=−1时3x²−2x的值，包括计算过程。' },
    openHint:{ ko:'3(-1)^2-2(-1) = 3(1)+2 = 5',
      en:'3(-1)^2-2(-1) = 3(1)+2 = 5',
      zh:'3(-1)^2-2(-1) = 3(1)+2 = 5' }
  },

  lab:{
    generator:'md48_expressionValue', level:'main', count:4,
    params:{mode:'quadratic'},
    intro:{
      ko:'이차식에 음수를 대입할 땐 꼭 괄호로 감싸서 계산해요!',
      en:'When substituting a negative into a quadratic expression, always wrap it in parentheses!',
      zh:'代入负数到二次式时一定要用括号括起来计算！'
    }
  },

  arena:{
    generator:'md48_expressionValue', level:'main', count:8, timeLimit:300,
    params:{mode:'twoVars'},
    rule:{ ko:'5분 안에 문자가 두 개인 식의 값을 모두 구해요!', en:'Evaluate all the two-letter expressions within 5 minutes!', zh:'5分钟内求出所有含两个字母的代数式的值！' }
  },

  stamp:{ label:{ ko:'대입 전문가', en:'Substitution Specialist', zh:'代入专家' }, coins:42 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'음수를 괄호로 감싸서 완벽하게 계산했구나! 🎯',en:'You wrapped the negative in parentheses and got it perfectly!',zh:'你把负数括起来算得很完美！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'곱셈 기호를 살려서 다시 대입해봐!',en:'Restore the multiplication sign and substitute again!',zh:'补回乘号再代入一次！'}, {ko:'음수는 꼭 괄호로 감싸서 넣어야 해!',en:'Negative numbers must be wrapped in parentheses!',zh:'负数一定要用括号括起来！'} ],
    finish:{ ko:'완벽해! 대입 전문가! 🎯✨', en:'Perfect! Substitution Specialist!', zh:'完美！代入专家！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
