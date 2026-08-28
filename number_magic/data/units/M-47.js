/* Numbers of Magic — 유닛 M-47: 문자식 표현 (중1 W8 · 문자와 식, 심화 유형 2차 2026-08-27) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-47'] = {
  id:'M-47', tier:'middle1', level:'29', order:10,
  generator:'md47_expressionNotation',
  title:{ ko:'문자식 표현', en:'Algebraic Expression Notation', zh:'代数式的表示' },
  subtitle:{ ko:'곱셈 기호를 지우고, 나눗셈을 분수로 바꿔요', en:'Drop the multiplication sign, turn division into a fraction', zh:'省略乘号，把除法变成分数' },
  icon:'🔤',

  practice:{
    generator:'md47_expressionNotation', level:'practice', count:5,
    params:{mode:'singleVar'},
    intro:{
      ko:'문자식에는 세 가지 규칙이 있어. ①×는 지워요 ②숫자는 문자 앞 ③같은 문자가 반복되면 지수로!',
      en:'Algebraic notation has three rules: 1) drop ×, 2) numbers go before letters, 3) a repeated letter becomes an exponent!',
      zh:'代数式有三条规则：①省略×②数字写在字母前③同一字母重复就写成指数！'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'사탕 가게에서 사탕 한 개의 가격을 모를 때, 우리는 그 가격을 a원이라고 문자로 이름 붙여요. 사탕을 3개 사면 얼마일까요? "a×3"이라고 쓸 수도 있지만, 수학자들은 훨씬 짧게 쓰는 약속을 만들었어요.',
        en:'When we don\'t know the price of one candy at a shop, we name it with a letter — a won. If you buy 3 candies, how much is that? You could write "a×3", but mathematicians agreed on a much shorter way to write it.',
        zh:'糖果店里不知道一颗糖的价格时，我们就用字母给它取名——a元。买3颗糖要多少钱呢？可以写成"a×3"，但数学家们约定了一种短得多的写法。' },
      history:{ ko:'문자를 수 대신 쓰는 방법은 16세기 프랑스 수학자 비에트가 널리 퍼뜨렸어요. 곱셈 기호를 생략하는 관습은 그 뒤로 점점 자리 잡아, 지금은 전 세계 수학자가 똑같은 방식으로 문자식을 써요.',
        en:'Using letters instead of numbers was popularized by the 16th-century French mathematician François Viète. Dropping the multiplication sign gradually became the standard, and today mathematicians everywhere write algebraic expressions the same way.',
        zh:'用字母代替数字的方法由16世纪法国数学家韦达推广。省略乘号的习惯逐渐固定下来，如今全世界的数学家都用同样的方式写代数式。' }
    },
    stages:[
      { tag:{ko:'① × 기호는 지우고, 숫자는 앞으로',en:'1) Drop ×, put the number first',zh:'① 省略×，数字放前面'},
        head:{ko:'a \\times 3 = 3a',en:'a \\times 3 = 3a',zh:'a \\times 3 = 3a'},
        desc:{ko:'"a×3"과 "3×a"는 같은 값이지만, 문자식에서는 <b>숫자를 문자 앞</b>에 쓰기로 약속해요. 그리고 곱셈 기호 ×는 아예 생략해요 — 그래서 "a×3"은 "3a"가 돼요.',
              en:'"a×3" and "3×a" have the same value, but in algebraic notation we agree to write <b>the number before the letter</b>. And the multiplication sign × is dropped entirely — so "a×3" becomes "3a".',
              zh:'"a×3"和"3×a"值相同，但代数式的约定是<b>数字写在字母前面</b>。乘号×则完全省略——所以"a×3"就写成"3a"。'},
        mathSteps:['a\\times 3', '3\\times a', '3a'],
        result:{ko:'곱셈 기호는 지우고, 숫자를 문자 앞으로!',en:'Drop the ×, put the number in front!',zh:'省略乘号，数字放到字母前面！'},
        book:{ko:'계수가 1이면(1×a) 숫자 1도 생략해서 그냥 "a"라고만 써요.',
              en:'If the coefficient is 1 (1×a), even the 1 is dropped, leaving just "a".',
              zh:'系数是1时(1×a)，连1也省略，只写"a"。'} },

      { tag:{ko:'② 같은 문자의 반복은 지수로',en:'2) A repeated letter becomes an exponent',zh:'② 同一字母重复就写成指数'},
        head:{ko:'x \\times x \\times x = x^3',en:'x \\times x \\times x = x^3',zh:'x \\times x \\times x = x^3'},
        desc:{ko:'같은 문자를 여러 번 곱하면 <b>지수</b>로 몇 번 곱했는지 나타내요. x를 3번 곱한 건 x³이에요. 나눗셈은 분수로 바꿔 써요 — "a÷4"는 "a/4"가 돼요.',
              en:'Multiplying the same letter several times is shown with an <b>exponent</b> — x multiplied 3 times is x³. Division is rewritten as a fraction — "a÷4" becomes "a/4".',
              zh:'同一字母连乘多次用<b>指数</b>表示——x连乘3次就是x³。除法要改写成分数——"a÷4"变成"a/4"。'},
        mathSteps:['x\\times x\\times x', 'x^3', ''],
        result:{ko:'반복된 문자는 지수로, 나눗셈은 분수로!',en:'A repeated letter becomes an exponent, division becomes a fraction!',zh:'重复的字母写成指数，除法写成分数！'},
        book:{ko:'"−1×x"는 "−x"로 쓰고, 숫자 1은 생략하지만 부호(−)는 남겨요.',
              en:'"−1×x" is written as "−x" — the 1 is dropped, but the sign(−) stays.',
              zh:'"−1×x"写成"−x"，1省略但符号(−)保留。'} }
    ],
    rule:{ ko:'문자식 표기의 세 규칙: ×는 지우고, 숫자는 문자 앞에, 반복된 문자는 지수로, 나눗셈은 분수로!',
      en:'Three rules of algebraic notation: drop ×, put numbers before letters, repeated letters become exponents, and division becomes a fraction!',
      zh:'代数式记法的三条规则：省略×，数字写在字母前，重复的字母写成指数，除法写成分数！' }
  },

  check:{
    fills:[
      { tex:'a \\times 5 = \\square a', answer:5,
        hint:{ ko:'숫자를 문자 앞으로', en:'Put the number in front', zh:'数字放到字母前面' } },
      { tex:'x \\times x = x^{\\square}', answer:2,
        hint:{ ko:'x를 2번 곱했어요', en:'x is multiplied twice', zh:'x连乘了2次' } }
    ],
    open:{ ko:'b×7÷2를 문자식 표기 규칙에 맞게 정리해봐요.',
      en:'Simplify b×7÷2 following the algebraic notation rules.',
      zh:'按代数式记法规则整理b×7÷2。' },
    openHint:{ ko:'곱셈은 숫자를 앞으로(7b), 나눗셈은 분수로(7b/2)',
      en:'Multiplication first (7b), then division as a fraction (7b/2)',
      zh:'先乘法把数字放前面(7b)，再除法写成分数(7b/2)' }
  },

  lab:{
    generator:'md47_expressionNotation', level:'main', count:4,
    params:{mode:'singleVar'},
    intro:{
      ko:'곱셈 기호를 지우고, 숫자를 앞으로, 반복된 문자는 지수로!',
      en:'Drop the ×, move the number to the front, and turn repeated letters into exponents!',
      zh:'省略乘号，数字移到前面，重复的字母写成指数！'
    }
  },

  arena:{
    generator:'md47_expressionNotation', level:'main', count:8, timeLimit:300,
    params:{mode:'twoVars'},
    rule:{ ko:'5분 안에 문자가 두 개인 식도 빠르게 정리해요!', en:'Simplify expressions with two letters quickly, all within 5 minutes!', zh:'5分钟内快速整理含两个字母的式子！' }
  },

  stamp:{ label:{ ko:'문자식 서기관', en:'Algebraic-Notation Scribe', zh:'代数式书记官' }, coins:40 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'곱셈 기호를 완벽하게 지웠구나! 🔤',en:'You dropped the multiplication sign perfectly!',zh:'你完美地省略了乘号！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'숫자는 문자 앞으로, ×는 지워요!',en:'Numbers go before letters, and drop the ×!',zh:'数字放到字母前面，省略×！'}, {ko:'같은 문자가 반복되면 지수로 써요!',en:'A repeated letter becomes an exponent!',zh:'重复的字母写成指数！'} ],
    finish:{ ko:'완벽해! 문자식 서기관! 🔤✨', en:'Perfect! Algebraic-Notation Scribe!', zh:'完美！代数式书记官！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
