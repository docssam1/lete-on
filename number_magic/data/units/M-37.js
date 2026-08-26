/* Numbers of Magic — 유닛 M-37: 로그의 정의 (고등 W13 · 대수 지수와 로그) — §13 기호 전환: log 첫 등장 */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-37'] = {
  id:'M-37', tier:'algebra', level:'40', order:2,
  generator:'md37_logDefinition',
  title:{ ko:'로그의 정의', en:'The Definition of Logarithms', zh:'对数的定义' },
  subtitle:{ ko:'지수 사다리를 반대 방향으로 오르는 새 기호, log', en:'log — climbing the exponent ladder in reverse', zh:'log——反向攀爬指数梯子的新符号' },
  icon:'📜',
  symbols:[
    { sym:'log', read:'로그', translate:'"a를 몇 번 곱해야 이 수가 되는가"를 묻는, 지수 사다리를 거꾸로 읽는 기호',
      birth:'로그를 처음 만든 네이피어(1614)는 큰 수의 곱셈을 덧셈으로 바꾸려 했어요 — log라는 이름은 그리스어 logos(비율)와 arithmos(수)를 합친 말이에요.' }
  ],

  practice:{
    generator:'md37_logDefinition', level:'practice', count:5,
    params:{mode:'decode'},
    intro:{
      ko:'아직 계산하지 않아도 돼! log_2 8 = 3이라는 식만 보고, 밑·진수·값 중 하나를 그대로 읽어봐.',
      en:'No calculation yet! Just look at log_2 8 = 3 and read off the base, argument, or value.',
      zh:'先不用计算！看着log_2 8 = 3这个式子，读出底数、真数或值中的一个就好。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'2×2×2=8이라는 걸 알아요. 그럼 "2를 몇 번 곱해야 8이 될까?"라는 질문에는 어떻게 답을 적을까요? 지수 사다리를 거꾸로 오르는 새 이름표가 필요해요 — 그게 바로 <b>log</b>예요.',
        en:'You know 2×2×2=8. But how do you write the answer to "how many times must you multiply 2 to get 8?" You need a new name tag for climbing the exponent ladder in reverse — that\'s <b>log</b>.',
        zh:'你知道2×2×2=8。但"2要乘几次才能得到8？"这个问题的答案该怎么写呢？需要一个反向攀爬指数梯子的新名字——那就是<b>log</b>。' },
      history:{ ko:'로그는 계산기가 없던 시절 천문학자들의 골칫거리(엄청 큰 수의 곱셈)를 덧셈으로 바꿔주는 발명품이었어요. 네이피어가 1614년에 처음 만들었고, "logos(비율)"와 "arithmos(수)"를 합쳐 이름 붙였어요.',
        en:'Before calculators, astronomers struggled with multiplying huge numbers — logarithms were invented to turn that multiplication into addition. Napier created them in 1614, naming them from Greek "logos" (ratio) and "arithmos" (number).',
        zh:'在没有计算器的年代，天文学家为巨大数字的乘法而头疼——对数的发明就是把乘法变成加法。纳皮尔在1614年首创，名字取自希腊语"logos"(比率)和"arithmos"(数)。' }
    },
    stages:[
      { tag:{ko:'① log는 지수 사다리를 거꾸로 읽는 것',en:'1) log reads the exponent ladder backward',zh:'① log是反过来读指数梯子'},
        head:{ko:'2^3=8 \\;\\Longleftrightarrow\\; \\log_2 8 = 3',en:'2^3=8 \\;\\Longleftrightarrow\\; \\log_2 8 = 3',zh:'2^3=8 \\;\\Longleftrightarrow\\; \\log_2 8 = 3'},
        desc:{ko:'지수 사다리에서 2¹=2, 2²=4, 2³=8이었죠. "2를 3번 곱하면 8"이라는 이 사실을 <b>log₂8=3</b>이라고 적어요. 밑(아래 작은 수) 2는 "몇을 곱했는지", 진수(오른쪽 수) 8은 "결과", 값 3은 "몇 번 곱했는지"예요.',
              en:'On the exponent ladder, 2¹=2, 2²=4, 2³=8. The fact "multiplying 2 three times gives 8" is written as <b>log₂8=3</b>. The base (small subscript) 2 is "what was multiplied," the argument (right side) 8 is "the result," and the value 3 is "how many times."',
              zh:'在指数梯子上，2¹=2，2²=4，2³=8。"2乘3次得到8"这件事写成<b>log₂8=3</b>。底数(下方小数字)2是"乘的是什么"，真数(右边的数)8是"结果"，值3是"乘了几次"。'},
        mathSteps:['2^1=2,\\;2^2=4,\\;2^3=8', '\\log_2 8 = 3'],
        result:{ko:'log_a N = x는 aˣ=N을 다르게 적은 것뿐이에요!',en:'log_a N = x is just another way to write aˣ=N!',zh:'log_a N = x只是aˣ=N的另一种写法！'},
        book:{ko:'log_a N = x ⟺ a^x = N (a>0, a≠1, N>0) — 이 동치 관계가 로그의 정의예요.',
              en:'log_a N = x ⟺ a^x = N (a>0, a≠1, N>0) — this equivalence is the definition of a logarithm.',
              zh:'log_a N = x ⟺ a^x = N (a>0, a≠1, N>0)——这个等价关系就是对数的定义。'} },

      { tag:{ko:'② 세 자리의 이름 — 밑·진수·값',en:'2) Three positions: base, argument, value',zh:'② 三个位置——底数·真数·值'},
        head:{ko:'\\log_{5} 125 = 3',en:'\\log_{5} 125 = 3',zh:'\\log_{5} 125 = 3'},
        desc:{ko:'5×5×5=125이니까 log₅125=3이에요. 여기서 <b>밑(5)</b>은 "반복해서 곱하는 수", <b>진수(125)</b>는 "곱해서 나온 결과", <b>값(3)</b>은 "몇 번 곱했는지"를 뜻해요. 이 세 자리를 헷갈리지 않는 게 로그를 다루는 첫걸음이에요.',
              en:'Since 5×5×5=125, log₅125=3. Here, the <b>base (5)</b> is "the number being multiplied repeatedly," the <b>argument (125)</b> is "the result of multiplying," and the <b>value (3)</b> is "how many times." Keeping these three positions straight is the first step in working with logs.',
              zh:'因为5×5×5=125，所以log₅125=3。这里<b>底数(5)</b>是"反复相乘的数"，<b>真数(125)</b>是"相乘得到的结果"，<b>值(3)</b>是"乘了几次"。分清这三个位置是掌握对数的第一步。'},
        mathSteps:['5\\times5\\times5=125', '\\log_5 125=3'],
        result:{ko:'밑은 곱하는 수, 진수는 결과, 값은 곱한 횟수!',en:'Base = what\'s multiplied, argument = the result, value = the count!',zh:'底数=被乘的数，真数=结果，值=乘的次数！'},
        book:{ko:'a=1이거나 a≤0이면 로그를 정의할 수 없어요 — 1을 아무리 곱해도 1이고, 음수는 사다리를 오를수록 부호가 튀니까요.',
              en:'A logarithm can\'t be defined when a=1 or a≤0 — 1 stays 1 no matter how many times you multiply it, and a negative base flips sign unpredictably as you climb.',
              zh:'当a=1或a≤0时无法定义对数——1无论乘多少次都还是1，负数的底数在攀爬时符号会不断跳变。'} }
    ],
    rule:{ ko:'log_a N = x ⟺ a^x = N — 밑(a)을 x번 곱하면 진수(N). 지수 사다리를 거꾸로 읽는 것뿐이에요!',
      en:'log_a N = x ⟺ a^x = N — multiplying the base (a) x times gives the argument (N). It\'s just reading the exponent ladder backward!',
      zh:'log_a N = x ⟺ a^x = N——底数(a)乘x次得到真数(N)。只是反过来读指数梯子而已！' }
  },

  check:{
    fills:[
      { tex:'\\log_{3} 27 = \\square', answer:3,
        hint:{ ko:'3×3×3=27', en:'3×3×3=27', zh:'3×3×3=27' } },
      { tex:'\\log_{2} \\square = 5', answer:32,
        hint:{ ko:'2를 5번 곱하면? 2⁵=32', en:'What is 2 multiplied 5 times? 2⁵=32', zh:'2乘5次是多少？2⁵=32' } }
    ],
    open:{ ko:'log₄64는 얼마인지, "몇 번 곱하는가"의 관점으로 설명해봐요.',
      en:'What is log₄64? Explain it in terms of "how many times you multiply."',
      zh:'log₄64是多少？用"乘几次"的角度说说看。' },
    openHint:{ ko:'4×4×4=64이므로 log₄64=3',
      en:'Since 4×4×4=64, log₄64=3',
      zh:'因为4×4×4=64，所以log₄64=3' }
  },

  lab:{
    generator:'md37_logDefinition', level:'main', count:4,
    params:{mode:'findN'},
    intro:{
      ko:'이번엔 반대 방향! log_a □ = x 에서 □(진수)를 찾아봐.',
      en:'This time, the other direction! Find the missing argument in log_a □ = x.',
      zh:'这次是反方向！在log_a □ = x中找出真数(□)。'
    }
  },

  arena:{
    generator:'md37_logDefinition', level:'main', count:8, timeLimit:300,
    params:{mode:'wide'},
    rule:{ ko:'5분 안에 더 큰 범위의 로그값을 모두 구해요!', en:'Find all the wider-range log values in 5 minutes!', zh:'5分钟内求出所有更大范围的对数值！' }
  },

  stamp:{ label:{ ko:'로그 사다리꾼', en:'Logarithm Ladder-Reader', zh:'对数梯子解读者' }, coins:52 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'지수 사다리를 거꾸로도 잘 오르는구나! 📜',en:'You can climb the exponent ladder backward too!',zh:'你也能倒着爬指数梯子了！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'log_a N = x는 aˣ=N과 같은 뜻이야!',en:'log_a N = x means the same thing as aˣ=N!',zh:'log_a N = x的意思和aˣ=N一样！'}, {ko:'밑을 몇 번 곱해야 진수가 되는지 세어봐!',en:'Count how many times the base must be multiplied to reach the argument!',zh:'数一数底数要乘几次才能得到真数！'} ],
    finish:{ ko:'완벽해! 로그 사다리꾼! 📜✨', en:'Perfect! Logarithm Ladder-Reader!', zh:'完美！对数梯子解读者！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
