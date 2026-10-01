/* Numbers of Magic — 유닛 M-91: 곱셈공식의 변형 (고등 공통수학1 · 과정 38 다항식의 연산, 2026-09-29)
   근거: docs/high-build-spec.md MD91. 교재는 챕터 제목만 근거로 쓰고 예시는 새로 만들었다. */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-91'] = {
  id:'M-91', tier:'highmath1', level:'38', order:91,
  generator:'md91_formulaVariant',
  title:{ ko:'곱셈공식의 변형', en:'Rearranging Multiplication Formulas', zh:'乘法公式的变形' },
  subtitle:{ ko:'a, b를 몰라도 합과 곱만으로 식의 값을 구합니다', en:'Find the value from the sum and product, without knowing a and b', zh:'不知道a、b，只用和与积也能求值' },
  icon:'🔁',

  practice:{
    generator:'md91_formulaVariant', level:'practice', count:6,
    params:{mode:'sq'},
    intro:{
      ko:'a+b와 ab가 주어지면 a²+b²는 (a+b)²−2ab로 바로 구합니다.',
      en:'Given a+b and ab, a²+b² is simply (a+b)²−2ab.',
      zh:'已知a+b和ab，a²+b²直接用(a+b)²−2ab求出。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'a+b=5, ab=3입니다. a와 b를 하나씩 구하려면 근의 공식이 필요하고 무리수가 나옵니다. 그런데 a²+b²는 a, b를 몰라도 구할 수 있습니다 — 곱셈공식을 거꾸로 읽으면 됩니다.',
        en:'Suppose a+b=5 and ab=3. Finding a and b one by one needs the quadratic formula and gives irrational numbers. Yet a²+b² can be found without them — just read a multiplication formula backwards.',
        zh:'设a+b=5、ab=3。要分别求a、b得用求根公式，还会出现无理数。可是不知道a、b也能求a²+b²——把乘法公式倒过来读就行。' },
      history:{ ko:'(a+b)²=a²+2ab+b²은 한 변이 a+b인 정사각형을 넓이 a², b²인 정사각형 둘과 넓이 ab인 직사각형 둘로 나누어 보면 그림으로 확인됩니다. 고대 그리스의 유클리드 『원론』 제2권에도 이 관계가 도형의 넓이로 실려 있습니다.',
        en:'(a+b)²=a²+2ab+b² can be seen in a picture: a square of side a+b splits into squares of area a² and b² and two rectangles of area ab. Book II of Euclid\'s Elements from ancient Greece states this relation in terms of areas of figures.',
        zh:'(a+b)²=a²+2ab+b²可以用图来确认：边长为a+b的正方形可分成面积为a²、b²的两个正方形和两个面积为ab的长方形。古希腊欧几里得《几何原本》第二卷就以图形面积的形式记载了这个关系。' }
    },
    stages:[
      { tag:{ko:'① 제곱의 합은 합의 제곱에서 2ab를 뺀다',en:'1) A sum of squares is the square of the sum minus 2ab',zh:'① 平方和等于和的平方减2ab'},
        head:{ko:'a^2+b^2=(a+b)^2-2ab',en:'a^2+b^2=(a+b)^2-2ab',zh:'a^2+b^2=(a+b)^2-2ab'},
        desc:{ko:'(a+b)²을 펼치면 a²+2ab+b²입니다. 여기서 <b>2ab만 빼면</b> a²+b²가 남습니다. a+b=5, ab=3이면 25−6=19입니다.',
              en:'Expanding (a+b)² gives a²+2ab+b². <b>Subtract just 2ab</b> and a²+b² remains. With a+b=5 and ab=3 this is 25−6=19.',
              zh:'展开(a+b)²得a²+2ab+b²。<b>只要减去2ab</b>就剩下a²+b²。a+b=5、ab=3时就是25−6=19。'},
        mathSteps:['a^2+b^2=(a+b)^2-2ab', '=5^2-2\\times3', '=19'],
        result:{ko:'a, b를 구하지 않고 합과 곱만으로 끝났습니다!',en:'Done with only the sum and product — no need to find a and b!',zh:'不求a、b，只用和与积就算完了！'},
        book:{ko:'a−b와 ab가 주어지면 a²+b²=(a−b)²+2ab입니다. 이번에는 2ab를 더합니다.',
              en:'If a−b and ab are given instead, a²+b²=(a−b)²+2ab — this time add 2ab.',
              zh:'如果已知a−b和ab，则a²+b²=(a−b)²+2ab——这次是加2ab。'} },

      { tag:{ko:'② 합의 제곱과 차의 제곱은 4ab 차이',en:'2) The squares of the sum and difference differ by 4ab',zh:'② 和的平方与差的平方相差4ab'},
        head:{ko:'(a-b)^2=(a+b)^2-4ab',en:'(a-b)^2=(a+b)^2-4ab',zh:'(a-b)^2=(a+b)^2-4ab'},
        desc:{ko:'(a+b)²=a²+2ab+b², (a−b)²=a²−2ab+b²이므로 둘은 <b>4ab</b>만큼 차이 납니다. a+b=5, ab=6이면 (a−b)²=25−24=1입니다.',
              en:'Since (a+b)²=a²+2ab+b² and (a−b)²=a²−2ab+b², they differ by <b>4ab</b>. With a+b=5 and ab=6, (a−b)²=25−24=1.',
              zh:'(a+b)²=a²+2ab+b²，(a−b)²=a²−2ab+b²，两者相差<b>4ab</b>。a+b=5、ab=6时(a−b)²=25−24=1。'},
        mathSteps:['(a-b)^2=5^2-4\\times6', '=1', {ko:'a>b \\text{이면 } a-b=1',en:'a>b \\text{ gives } a-b=1',zh:'a>b \\text{时 } a-b=1'}],
        result:{ko:'a−b 자체를 물으면 (a−b)²의 제곱근을 부호에 맞게 고릅니다!',en:'When asked for a−b itself, take the square root of (a−b)² with the right sign!',zh:'问a−b本身时，取(a−b)²的平方根并注意符号！'},
        book:{ko:'(a−b)²은 음수가 될 수 없으니 계산 결과가 음수라면 조건을 다시 확인해야 합니다.',
              en:'(a−b)² can never be negative, so a negative result means the conditions should be checked again.',
              zh:'(a−b)²不可能是负数，算出负数就要重新检查条件。'} },

      { tag:{ko:'③ 세제곱의 합과 x+1/x',en:'3) Sums of cubes and x+1/x',zh:'③ 立方和与x+1/x'},
        head:{ko:'a^3+b^3=(a+b)^3-3ab(a+b)',en:'a^3+b^3=(a+b)^3-3ab(a+b)',zh:'a^3+b^3=(a+b)^3-3ab(a+b)'},
        desc:{ko:'(a+b)³=a³+3a²b+3ab²+b³에서 가운데 두 항을 묶으면 3ab(a+b)입니다. x+1/x=3이면 a=x, b=1/x로 보아 ab=1이므로 x³+1/x³=27−9=18입니다.',
              en:'In (a+b)³=a³+3a²b+3ab²+b³ the middle two terms group into 3ab(a+b). If x+1/x=3, take a=x and b=1/x so ab=1, giving x³+1/x³=27−9=18.',
              zh:'(a+b)³=a³+3a²b+3ab²+b³中间两项合起来是3ab(a+b)。x+1/x=3时，把a=x、b=1/x看作一组，ab=1，所以x³+1/x³=27−9=18。'},
        mathSteps:['x^3+\\dfrac{1}{x^3}=3^3-3\\times1\\times3', '=27-9', '=18'],
        result:{ko:'x와 1/x의 곱은 언제나 1이라 계산이 가벼워집니다!',en:'x times 1/x is always 1, which keeps the work light!',zh:'x与1/x之积总是1，计算就轻松了！'},
        book:{ko:'x²+1/x²=(x+1/x)²−2도 같은 원리입니다. x−1/x가 주어지면 (x−1/x)²+2입니다.',
              en:'x²+1/x²=(x+1/x)²−2 works the same way; if x−1/x is given, use (x−1/x)²+2.',
              zh:'x²+1/x²=(x+1/x)²−2也是同样的原理；已知x−1/x时用(x−1/x)²+2。'} }
    ],
    rule:{ ko:'① a²+b²=(a+b)²−2ab=(a−b)²+2ab  ② (a−b)²=(a+b)²−4ab  ③ a³+b³=(a+b)³−3ab(a+b)',
      en:'① a²+b²=(a+b)²−2ab=(a−b)²+2ab  ② (a−b)²=(a+b)²−4ab  ③ a³+b³=(a+b)³−3ab(a+b)',
      zh:'① a²+b²=(a+b)²−2ab=(a−b)²+2ab  ② (a−b)²=(a+b)²−4ab  ③ a³+b³=(a+b)³−3ab(a+b)' }
  },

  check:{
    fills:[
      { tex:'a+b=4,\\ ab=1 \\;\\Rightarrow\\; a^2+b^2=\\square', answer:14,
        hint:{ ko:'16−2=14', en:'16−2=14', zh:'16−2=14' } },
      { tex:'x+\\dfrac{1}{x}=4 \\;\\Rightarrow\\; x^2+\\dfrac{1}{x^2}=\\square', answer:14,
        hint:{ ko:'4²−2=14', en:'4²−2=14', zh:'4²−2=14' } }
    ],
    open:{ ko:'a+b=3, ab=2일 때 a³+b³을 구하는 과정을 설명해 봅니다.',
      en:'Explain how to find a³+b³ when a+b=3 and ab=2.',
      zh:'说说a+b=3、ab=2时求a³+b³的过程。' },
    openHint:{ ko:'(a+b)³−3ab(a+b)=27−18=9입니다.',
      en:'(a+b)³−3ab(a+b)=27−18=9.',
      zh:'(a+b)³−3ab(a+b)=27−18=9。' }
  },

  lab:{
    generator:'md91_formulaVariant', level:'main', count:6,
    params:{mode:'diff'},
    intro:{
      ko:'이번에는 (a−b)²과 (a+b)²입니다. 두 식이 4ab만큼 차이 난다는 것을 씁니다.',
      en:'Now (a−b)² and (a+b)². Use the fact that they differ by 4ab.',
      zh:'这次是(a−b)²和(a+b)²。利用两者相差4ab。'
    }
  },

  arena:{
    generator:'md91_formulaVariant', level:'main', count:8, timeLimit:360,
    params:{mode:'cube'},
    rule:{ ko:'6분 안에 세제곱 꼴과 x+1/x 꼴의 식의 값을 모두 구합니다!', en:'Find every value of the cube and x+1/x forms within 6 minutes!', zh:'6分钟内求出所有立方型与x+1/x型式子的值！' }
  },

  stamp:{ label:{ ko:'공식 변형가', en:'Formula Shifter', zh:'公式变形师' }, coins:49 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'a, b를 몰라도 척척 구했구나! 🔁',en:'You found it without knowing a and b!',zh:'不知道a、b也算出来了！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'(a+b)²을 펼쳐 보고 무엇을 빼야 하는지 찾아봐!',en:'Expand (a+b)² and see what has to be taken away!',zh:'展开(a+b)²，看看要减去什么！'}, {ko:'2ab를 뺄지, 4ab를 뺄지 다시 확인해 봐!',en:'Check again: subtract 2ab or 4ab?',zh:'再确认一下：减2ab还是减4ab？'} ],
    finish:{ ko:'완벽해! 공식 변형가! 🔁✨', en:'Perfect! Formula Shifter!', zh:'完美！公式变形师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
