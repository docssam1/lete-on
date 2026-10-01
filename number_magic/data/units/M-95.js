/* Numbers of Magic — 유닛 M-95: 복소수의 사칙계산 (고등 공통수학1 · 과정 40 복소수, 2026-09-29)
   근거: docs/high-build-spec.md MD95. 예시는 새로 만들었다. 역사 문단은 널리 알려진 사실만. */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-95'] = {
  id:'M-95', tier:'highmath1', level:'40', order:95,
  generator:'md95_complexArith',
  title:{ ko:'복소수의 사칙계산', en:'Arithmetic with Complex Numbers', zh:'复数的四则运算' },
  subtitle:{ ko:'i를 문자처럼 계산하고 i²은 −1로 바꿉니다', en:'Treat i like a letter and turn i² into −1', zh:'把i当字母计算，i²换成−1' },
  icon:'🌀',

  practice:{
    generator:'md95_complexArith', level:'practice', count:6,
    params:{mode:'addSub'},
    intro:{
      ko:'실수부분은 실수부분끼리, 허수부분은 허수부분끼리 계산해 두 칸에 씁니다.',
      en:'Combine real parts with real parts and imaginary parts with imaginary parts, and fill in the two boxes.',
      zh:'实部与实部、虚部与虚部分别计算，填入两格。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'제곱해서 −1이 되는 실수는 없습니다. 그래서 그런 수를 새로 정하고 i라고 부릅니다(i²=−1). a+bi 꼴의 수는 i를 문자처럼 두고 다항식처럼 더하고 곱할 수 있습니다.',
        en:'No real number squares to −1, so we define a new number i with i²=−1. Numbers of the form a+bi can be added and multiplied like polynomials, treating i as a letter.',
        zh:'没有平方等于−1的实数，于是规定一个新数i，使i²=−1。形如a+bi的数可以把i当作字母，像多项式一样加减乘。' },
      history:{ ko:'16세기 이탈리아의 카르다노는 『아르스 마그나』(1545)에서 음수의 제곱근이 나오는 계산을 다루었습니다. 허수 단위를 기호 i로 쓴 사람은 18세기의 오일러입니다.',
        en:'In 16th-century Italy, Cardano dealt with calculations involving square roots of negative numbers in his Ars Magna (1545). Writing the imaginary unit as the symbol i is due to Euler in the 18th century.',
        zh:'16世纪意大利的卡尔达诺在《大术》(1545)中处理过出现负数平方根的计算。用符号i表示虚数单位的是18世纪的欧拉。' }
    },
    stages:[
      { tag:{ko:'① 덧셈·뺄셈은 부분끼리',en:'1) Add and subtract part by part',zh:'① 加减按部分计算'},
        head:{ko:'(3+2i)+(1-5i)=4-3i',en:'(3+2i)+(1-5i)=4-3i',zh:'(3+2i)+(1-5i)=4-3i'},
        desc:{ko:'실수부분 3+1=4, 허수부분 2+(−5)=−3이므로 <b>4−3i</b>입니다.',
              en:'Real parts 3+1=4 and imaginary parts 2+(−5)=−3, so <b>4−3i</b>.',
              zh:'实部3+1=4，虚部2+(−5)=−3，所以是<b>4−3i</b>。'},
        mathSteps:['(3+1)+(2-5)i', '=4-3i'],
        result:{ko:'동류항끼리 모으는 것과 같습니다!',en:'Just like collecting like terms!',zh:'和合并同类项一样！'},
        book:{ko:'답은 a+bi의 a와 b를 두 칸에 씁니다. 허수부분이 −3이면 b칸에 −3을 씁니다.',
              en:'Answers go in two boxes for a and b in a+bi; if the imaginary part is −3, enter −3 for b.',
              zh:'答案把a+bi的a、b填入两格；虚部是−3就在b格填−3。'} },

      { tag:{ko:'② 곱셈은 전개 후 i²=−1',en:'2) Multiply, then use i²=−1',zh:'② 乘法展开后i²=−1'},
        head:{ko:'(1+2i)(3-i)=5+5i',en:'(1+2i)(3-i)=5+5i',zh:'(1+2i)(3-i)=5+5i'},
        desc:{ko:'분배법칙으로 3−i+6i−2i²입니다. <b>i²=−1</b>이므로 −2i²=+2가 되어 5+5i입니다.',
              en:'The distributive law gives 3−i+6i−2i². Since <b>i²=−1</b>, −2i² becomes +2, giving 5+5i.',
              zh:'用分配律得3−i+6i−2i²。因为<b>i²=−1</b>，−2i²变成+2，得5+5i。'},
        mathSteps:['=3-i+6i-2i^2', '=3+5i+2', '=5+5i'],
        result:{ko:'i²이 보이면 바로 −1로 바꿉니다!',en:'Whenever i² appears, turn it into −1!',zh:'看到i²就换成−1！'},
        book:{ko:'(a+bi)(a−bi)=a²+b²처럼 켤레끼리 곱하면 실수가 됩니다.',
              en:'Multiplying conjugates gives a real number: (a+bi)(a−bi)=a²+b².',
              zh:'共轭相乘得实数：(a+bi)(a−bi)=a²+b²。'} },

      { tag:{ko:'③ 나눗셈은 켤레복소수를 곱한다',en:'3) Divide by multiplying by the conjugate',zh:'③ 除法乘以共轭复数'},
        head:{ko:'\\dfrac{5+5i}{1+2i}=\\dfrac{(5+5i)(1-2i)}{5}',en:'\\dfrac{5+5i}{1+2i}=\\dfrac{(5+5i)(1-2i)}{5}',zh:'\\dfrac{5+5i}{1+2i}=\\dfrac{(5+5i)(1-2i)}{5}'},
        desc:{ko:'분모 1+2i의 켤레 1−2i를 위아래에 곱하면 분모는 1+4=5가 됩니다. 분자는 5−10i+5i+10=15−5i이므로 <b>3−i</b>입니다.',
              en:'Multiply top and bottom by 1−2i, the conjugate of 1+2i; the denominator becomes 1+4=5. The numerator is 5−10i+5i+10=15−5i, giving <b>3−i</b>.',
              zh:'分子分母同乘1+2i的共轭1−2i，分母变成1+4=5。分子是5−10i+5i+10=15−5i，得<b>3−i</b>。'},
        mathSteps:['=\\dfrac{15-5i}{5}', '=3-i'],
        result:{ko:'분모를 실수로 만들면 나눗셈이 끝납니다!',en:'Make the denominator real and the division is done!',zh:'分母变成实数，除法就完成了！'},
        book:{ko:'분모의 유리화에서 켤레 무리수를 곱하던 것과 같은 방법입니다.',
              en:'It is the same move as multiplying by a conjugate surd when rationalizing a denominator.',
              zh:'这与分母有理化时乘共轭根式是同样的方法。'} }
    ],
    rule:{ ko:'① 덧셈·뺄셈은 실수부분끼리, 허수부분끼리  ② 곱셈은 전개 후 i²=−1  ③ 나눗셈은 분모의 켤레를 위아래에 곱합니다',
      en:'① Add and subtract real with real, imaginary with imaginary  ② Multiply out and use i²=−1  ③ Divide by multiplying top and bottom by the conjugate',
      zh:'① 加减时实部与实部、虚部与虚部  ② 乘法展开后用i²=−1  ③ 除法时分子分母同乘分母的共轭' }
  },

  check:{
    fills:[
      { tex:'(2+i)(2-i)=\\square', answer:5,
        hint:{ ko:'4−i²=4+1', en:'4−i²=4+1', zh:'4−i²=4+1' } },
      { tex:'(4+3i)-(1+5i)=3+\\square i', answer:-2,
        hint:{ ko:'3−5=−2', en:'3−5=−2', zh:'3−5=−2' } }
    ],
    open:{ ko:'2/(1+i)를 a+bi 꼴로 바꾸는 과정을 설명해 봅니다.',
      en:'Explain how to write 2/(1+i) in the form a+bi.',
      zh:'说说把2/(1+i)化成a+bi形式的过程。' },
    openHint:{ ko:'위아래에 1−i를 곱하면 2(1−i)/2=1−i입니다.',
      en:'Multiply top and bottom by 1−i: 2(1−i)/2=1−i.',
      zh:'分子分母同乘1−i：2(1−i)/2=1−i。' }
  },

  lab:{
    generator:'md95_complexArith', level:'main', count:6,
    params:{mode:'mul'},
    intro:{
      ko:'다항식처럼 전개하고 i²을 −1로 바꿉니다.',
      en:'Expand like a polynomial and replace i² with −1.',
      zh:'像多项式一样展开，把i²换成−1。'
    }
  },

  arena:{
    generator:'md95_complexArith', level:'main', count:6, timeLimit:480,
    params:{mode:'div'},
    rule:{ ko:'8분 안에 켤레복소수를 곱해 나눗셈을 모두 끝냅니다!', en:'Finish every division by multiplying by the conjugate within 8 minutes!', zh:'8分钟内乘共轭复数完成所有除法！' }
  },

  stamp:{ label:{ ko:'허수 조련사', en:'Imaginary Tamer', zh:'虚数驯服师' }, coins:51 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'i를 완벽하게 다뤘구나! 🌀',en:'You handled i perfectly!',zh:'把i处理得很完美！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'i²은 −1이야, 부호를 다시 봐!',en:'i² is −1 — check the sign again!',zh:'i²是−1，再看看符号！'}, {ko:'나눗셈은 분모의 켤레를 위아래에 곱해 봐!',en:'For division, multiply top and bottom by the conjugate!',zh:'除法就在分子分母同乘分母的共轭！'} ],
    finish:{ ko:'완벽해! 허수 조련사! 🌀✨', en:'Perfect! Imaginary Tamer!', zh:'完美！虚数驯服师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
