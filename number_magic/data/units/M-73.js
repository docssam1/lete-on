/* Numbers of Magic — 유닛 M-73: 함수와 함숫값 (중등 교과 연산 4차 2026-09-21)
   표기 주의: 이 파일의 tex 는 KaTeX 간격 명령으로 `\quad` 만 쓴다(mid9.js 상단 주석 참조). */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-73'] = {
  id:'M-73', tier:'middle2', level:'34', order:10,
  generator:'md73_functionValue',
  title:{ ko:'함수와 함숫값', en:'Functions & Function Values', zh:'函数与函数值' },
  subtitle:{ ko:'f(x)는 "x를 넣으면 나오는 값"이라는 뜻입니다', en:'f(x) means "what comes out when you put x in"', zh:'f(x)的意思是"代入x后得到的值"' },
  icon:'🎰',

  practice:{
    generator:'md73_functionValue', level:'practice', count:5,
    params:{mode:'value'},
    intro:{ ko:'x 자리에 수를 그대로 넣어 계산해 보세요 — 음수는 괄호로 감쌉니다!', en:'Put the number straight into the x slot - and wrap a negative in brackets!', zh:'把数直接代入x的位置——负数要加括号！' }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'자판기에 동전을 넣으면 음료가 나옵니다. 같은 동전을 넣으면 언제나 같은 음료가 나오죠. 함수도 똑같습니다 — x를 넣으면 정해진 하나의 y가 나옵니다. f(3)은 "3을 넣었을 때 나오는 값"이지, f와 3을 곱한 것이 <b>아닙니다</b>. 이 표기를 오해하면 그 뒤가 전부 어긋납니다.', en:'Put a coin into a vending machine and a drink comes out - the same coin always gives the same drink. A function works the same way: put in x and exactly one y comes out. So f(3) is "what comes out for 3", and it is <b>not</b> f times 3. Misread that notation and everything after it goes wrong.', zh:'往自动售货机投币就出来饮料，投同样的币总出同样的饮料。函数也一样——代入x就得到唯一确定的y。所以f(3)是"代入3得到的值"，<b>不是</b>f乘以3。看错这个记号，后面就全乱了。' },
      history:{ ko:'f(x)라는 표기를 만든 사람은 18세기 스위스의 오일러입니다. function의 첫 글자를 따서 f라 썼고, 괄호 안에 넣는 것을 적기로 했습니다. 그 전에는 "어떤 양이 다른 양에 따라 변한다"는 말을 문장으로 길게 써야 했는데, 기호 하나가 생기자 그 관계를 식처럼 다룰 수 있게 됐습니다.', en:'The notation f(x) is due to Euler, an eighteenth-century Swiss mathematician: f for function, with whatever goes in written inside the brackets. Before that, saying that one quantity varies with another took a long sentence. One symbol turned the relation itself into something you could calculate with.', zh:'f(x)这个记号出自18世纪瑞士的欧拉：取function的首字母f，把代入的东西写在括号里。在那以前，"一个量随另一个量变化"要用一长句话来说。有了这个符号，这种关系本身就能像式子一样运算了。' }
    },
    stages:[
      { tag:{ ko:'① 넣으면 나온다', en:'1) Put in, get out', zh:'① 代进去，得出来' },
        head:{ ko:'f(x) = 2x + 1 \\quad\\Rightarrow\\quad f(3) = 7', en:'f(x) = 2x + 1 \\quad\\Rightarrow\\quad f(3) = 7', zh:'f(x) = 2x + 1 \\quad\\Rightarrow\\quad f(3) = 7' },
        desc:{ ko:'x 자리에 3을 그대로 넣습니다. 2×3+1=7이니 f(3)=7입니다. f(−2)처럼 음수를 넣을 때는 <b>괄호로 감싸</b> 2×(−2)+1=−3이라고 계산합니다.', en:'Put 3 straight into the x slot: 2x3+1 = 7, so f(3) = 7. For a negative like f(-2), <b>wrap it in brackets</b>: 2x(-2)+1 = -3.', zh:'把3直接代入x的位置：2×3+1=7，所以f(3)=7。代入f(−2)这样的负数时要<b>加括号</b>：2×(−2)+1=−3。' },
        mathSteps:['f(3) = 2 \\times 3 + 1', 'f(3) = 7'],
        result:{ ko:'f(3)은 곱셈이 아니라 "3을 넣은 결과"입니다!', en:'f(3) is not a product - it is the result for 3!', zh:'f(3)不是乘法，是"代入3的结果"！' },
        book:{ ko:'하나의 x에 <b>하나의 y</b>만 대응해야 함수입니다. x 하나에 y가 둘이면(예: y²=x) 함수가 아닙니다 — 자판기가 같은 동전에 매번 다른 것을 내놓으면 고장인 것과 같습니다.', en:'A function must give <b>exactly one</b> y for each x. If one x could give two y values - as in y2 = x - it is not a function, just as a vending machine giving something different each time would be broken.', zh:'一个x只能对应<b>一个y</b>才叫函数。一个x对应两个y(如y²=x)就不是函数——就像自动售货机对同样的币每次给不同的东西，那是坏了。' } },

      { tag:{ ko:'② 거꾸로 — 나온 값에서 넣은 값 찾기', en:'2) Backwards - from the output to the input', zh:'② 反过来——由输出求输入' },
        head:{ ko:'f(x) = 2x + 1 = 11 \\quad\\Rightarrow\\quad x = 5', en:'f(x) = 2x + 1 = 11 \\quad\\Rightarrow\\quad x = 5', zh:'f(x) = 2x + 1 = 11 \\quad\\Rightarrow\\quad x = 5' },
        desc:{ ko:'나온 값이 11이라면 2x+1=11을 풀면 됩니다 — 지금까지 푼 <b>일차방정식 그대로</b>입니다. 함수는 새로운 계산이 아니라, 이미 아는 계산을 담는 새 표기입니다.', en:'If the output is 11, solve 2x+1 = 11 - <b>exactly the linear equations</b> you have been solving. A function is not new arithmetic; it is new notation for arithmetic you already know.', zh:'如果输出是11，解2x+1=11即可——就是<b>你一直在解的一元一次方程</b>。函数不是新的计算，而是装已知计算的新记号。' },
        mathSteps:['2x + 1 = 11', '2x = 10', 'x = 5'],
        result:{ ko:'함숫값이 주어지면 방정식 풀이로 돌아옵니다!', en:'Given the value, you are back to solving an equation!', zh:'已知函数值，就回到解方程！' },
        book:{ ko:'f(1)과 f(2)를 알면 <b>기울기 a</b>가 나옵니다 — 두 값의 차가 곧 a입니다(x가 1 늘 때 y가 느는 양). a를 알면 f(1)에서 b가 나오고, 이것이 두 점으로 직선을 정하는 일과 같습니다.', en:'Knowing f(1) and f(2) gives the <b>slope</b> - their difference is a, the rise for one step in x. With a in hand, f(1) gives b. This is the same work as fixing a line from two points.', zh:'知道f(1)和f(2)就能得到<b>斜率a</b>——两值之差就是a(x增加1时y的增量)。有了a，由f(1)就能求出b。这和用两点确定直线是同一件事。' } }
    ],
    rule:{ ko:'f(x)는 x를 넣으면 나오는 값 — 넣으면 계산, 나온 값이 주어지면 방정식입니다!', en:'f(x) is what comes out when x goes in - putting in means calculating, and a given output means solving!', zh:'f(x)是代入x得到的值——代入就是计算，给出输出就是解方程！' }
  },

  check:{
    fills:[
      { tex:'f(x) = 3x - 2 \\quad\\Rightarrow\\quad f(4) = \\square', answer:10,
        hint:{ ko:'3×4−2', en:'3 x 4 - 2', zh:'3×4−2' } },
      { tex:'f(x) = 2x + 5, \\; f(x) = 13 \\quad\\Rightarrow\\quad x = \\square', answer:4,
        hint:{ ko:'2x=8', en:'2x = 8', zh:'2x=8' } }
    ],
    open:{ ko:'f(3)이 왜 f×3이 아닌지 말해봅니다.', en:'Explain why f(3) is not f times 3.', zh:'说说f(3)为什么不是f乘以3。' },
    openHint:{ ko:'f는 수가 아니라 "넣으면 내놓는 규칙"이기 때문', en:'Because f is not a number but a rule that turns an input into an output', zh:'因为f不是数，而是"代进去就给出结果"的规则' }
  },

  lab:{
    generator:'md73_functionValue', level:'main', count:4,
    params:{mode:'inverse'},
    intro:{ ko:'나온 값이 주어졌습니다 — 방정식으로 바꿔 x를 찾으세요!', en:'The output is given - turn it into an equation and find x!', zh:'已知输出——化成方程求x！' }
  },

  arena:{
    generator:'md73_functionValue', level:'main', count:8, timeLimit:360,
    params:{mode:'findCoef'},
    rule:{ ko:'6분 안에 두 함숫값의 차로 a를, 그 a로 b를 구합니다!', en:'Within 6 minutes, get a from the difference of two values and then b!', zh:'6分钟内用两个函数值之差求a，再用a求b！' }
  },

  stamp:{ label:{ ko:'자판기의 해독가', en:'Decoder of the Machine', zh:'售货机解读者' }, coins:50 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, { ko:'넣는 값과 나오는 값을 정확히 구분했구나! 🎰', en:'You kept input and output exactly straight!', zh:'你把输入和输出分得清清楚楚！' }, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ { ko:'음수를 넣을 땐 괄호로 감싸!', en:'Wrap a negative in brackets before substituting!', zh:'代入负数时要加括号！' }, { ko:'f(3)은 곱셈이 아니라 3을 넣은 결과야!', en:'f(3) is the result for 3, not a product!', zh:'f(3)是代入3的结果，不是乘法！' } ],
    finish:{ ko:'완벽해! 자판기의 해독가! 🎰✨', en:'Perfect! Decoder of the Machine!', zh:'完美！售货机解读者！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
