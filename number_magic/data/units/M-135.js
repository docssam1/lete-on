/* Numbers of Magic — 유닛 M-135: 상용로그 (고등 대수 · 과정 61 예정, 2026-09-29)
   근거: docs/high-build-spec.md MD135. 예시는 새로 만들었다. */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-135'] = {
  id:'M-135', tier:'algebra', level:'61', order:135,
  generator:'md135_commonLog',
  title:{ ko:'상용로그', en:'Common Logarithms', zh:'常用对数' },
  subtitle:{ ko:'엄청나게 큰 수의 자릿수를 세는 법', en:'Counting the digits of enormous numbers', zh:'数出巨大数字的位数' },
  icon:'📏',

  practice:{
    generator:'md135_commonLog', level:'practice', count:6,
    params:{mode:'int'},
    intro:{
      ko:'log aⁿ=n log a 로 바꾸고, 주어진 log 2, log 3 등의 값을 넣어 계산합니다. 정수 부분은 그 값을 넘지 않는 가장 큰 정수입니다.',
      en:'Rewrite log aⁿ as n log a and use the given values of log 2, log 3 and so on. The integer part is the greatest integer not exceeding that value.',
      zh:'把log aⁿ写成n log a，代入所给的log 2、log 3等的值计算。整数部分是不超过该值的最大整数。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'2²⁰ 을 끝까지 곱하지 않아도 몇 자리 수인지 알 수 있을까요? 밑이 10 인 로그 하나면 됩니다.',
        en:'Can you tell how many digits 2²⁰ has without multiplying it all out? One logarithm to base 10 is enough.',
        zh:'不把2²⁰乘出来，能知道它是几位数吗？一个以10为底的对数就够了。' },
      history:{ ko:'영국의 브리그스는 네이피어와 의견을 나눈 뒤 밑이 10 인 로그를 계산했고, 1624년 『Arithmetica Logarithmica』 에 그 로그표를 펴냈습니다.',
        en:'After exchanging ideas with Napier, the Englishman Henry Briggs computed logarithms to base 10 and published the tables in Arithmetica Logarithmica in 1624.',
        zh:'英国的布里格斯与纳皮尔交流之后计算了以10为底的对数，并于1624年在《Arithmetica Logarithmica》中出版了对数表。' }
    },
    stages:[
      { tag:{ko:'① 정수 부분',en:'1) The integer part',zh:'① 整数部分'},
        head:{ko:'\\log 2=0.3010:\\ \\log 2^{20}=6.0200',en:'\\log 2=0.3010:\\ \\log 2^{20}=6.0200',zh:'\\log 2=0.3010:\\ \\log 2^{20}=6.0200'},
        desc:{ko:'log 2²⁰=20×0.3010=6.0200=6+0.0200 이므로 정수 부분은 <b>6</b> 입니다.',
              en:'log 2²⁰=20×0.3010=6.0200=6+0.0200, so the integer part is <b>6</b>.',
              zh:'log 2²⁰=20×0.3010=6.0200=6+0.0200，所以整数部分是<b>6</b>。'},
        mathSteps:['\\log 2^{20}=20\\log 2','20\\times0.3010=6.0200'],
        result:{ko:'지수는 앞으로 내려와 곱해진다!',en:'The exponent comes down as a factor!',zh:'指数移到前面相乘！'},
        book:{ko:'log 5 는 log(10÷2)=1−log 2=0.6990 으로 구합니다.',
              en:'Find log 5 as log(10÷2)=1−log 2=0.6990.',
              zh:'log 5用log(10÷2)=1−log 2=0.6990求出。'} },

      { tag:{ko:'② 자릿수',en:'2) Number of digits',zh:'② 位数'},
        head:{ko:'10^{6}\\le 2^{20}<10^{7}',en:'10^{6}\\le 2^{20}<10^{7}',zh:'10^{6}\\le 2^{20}<10^{7}'},
        desc:{ko:'6≤log 2²⁰<7 이므로 10⁶≤2²⁰<10⁷, 곧 2²⁰ 은 <b>7</b> 자리의 수입니다. 실제로 2²⁰=1048576 입니다.',
              en:'6≤log 2²⁰<7 means 10⁶≤2²⁰<10⁷, so 2²⁰ has <b>7</b> digits. Indeed 2²⁰=1048576.',
              zh:'6≤log 2²⁰<7即10⁶≤2²⁰<10⁷，所以2²⁰是<b>7</b>位数。实际上2²⁰=1048576。'},
        mathSteps:['6\\le\\log 2^{20}<7','n=6+1=7'],
        result:{ko:'정수 부분 + 1 = 자릿수!',en:'Integer part + 1 = number of digits!',zh:'整数部分+1=位数！'},
        book:{ko:'10⁶=1000000 은 7 자리의 가장 작은 수입니다. 그래서 정수 부분보다 하나 많습니다.',
              en:'10⁶=1000000 is the smallest 7-digit number, which is why the count is one more than the integer part.',
              zh:'10⁶=1000000是最小的7位数，所以位数比整数部分多1。'} },

      { tag:{ko:'③ 소수점 아래',en:'3) Below the decimal point',zh:'③ 小数点以下'},
        head:{ko:'\\log\\bigl(\\frac{1}{2}\\bigr)^{20}=-6.0200=-7+0.9800',en:'\\log\\bigl(\\frac{1}{2}\\bigr)^{20}=-6.0200=-7+0.9800',zh:'\\log\\bigl(\\frac{1}{2}\\bigr)^{20}=-6.0200=-7+0.9800'},
        desc:{ko:'소수 부분이 0 이상이 되도록 −7+0.9800 으로 씁니다. 10⁻⁷≤(1/2)²⁰<10⁻⁶ 이므로 소수점 아래 <b>7</b> 째 자리에서 처음으로 0 이 아닌 숫자가 나타납니다.',
              en:'Write it as −7+0.9800 so the decimal part is at least 0. Since 10⁻⁷≤(1/2)²⁰<10⁻⁶, the first nonzero digit appears in the <b>7</b>th decimal place.',
              zh:'为使小数部分不小于0，写成−7+0.9800。由10⁻⁷≤(1/2)²⁰<10⁻⁶，在小数点后第<b>7</b>位首次出现不为0的数字。'},
        mathSteps:['-6.0200=-7+0.9800','10^{-7}\\le\\bigl(\\frac{1}{2}\\bigr)^{20}<10^{-6}'],
        result:{ko:'음의 정수 부분이 −n 이면 n 째 자리!',en:'Integer part −n means the nth place!',zh:'整数部分为−n就是第n位！'},
        book:{ko:'−6.0200 을 −6 과 −0.0200 으로 나누면 소수 부분이 음수가 되어 틀립니다. 소수 부분은 언제나 0 이상 1 미만입니다.',
              en:'Splitting −6.0200 into −6 and −0.0200 is wrong because the decimal part would be negative. The decimal part is always from 0 up to 1.',
              zh:'把−6.0200分成−6和−0.0200是错的，因为小数部分成了负数。小数部分总是不小于0且小于1。'} }
    ],
    rule:{ ko:'① log aⁿ=n log a 로 계산  ② 자릿수 = 정수 부분+1  ③ 0<N<1 이면 log N=−n+α 로 써서 소수점 아래 n 째 자리',
      en:'① Compute log aⁿ=n log a  ② Digits = integer part+1  ③ For 0<N<1 write log N=−n+α: the nth decimal place',
      zh:'① 用log aⁿ=n log a计算  ② 位数=整数部分+1  ③ 0<N<1时写成log N=−n+α：小数点后第n位' }
  },

  check:{
    fills:[
      { tex:{ko:'\\log 2=0.3010,\\ \\log 2^{30}=n+\\alpha\\ (0\\le\\alpha<1)\\ \\Rightarrow\\ n=\\square',en:'\\log 2=0.3010,\\ \\log 2^{30}=n+\\alpha\\ (0\\le\\alpha<1)\\ \\Rightarrow\\ n=\\square',zh:'\\log 2=0.3010,\\ \\log 2^{30}=n+\\alpha\\ (0\\le\\alpha<1)\\ \\Rightarrow\\ n=\\square'}, answer:9,
        hint:{ ko:'30×0.3010=9.03', en:'30×0.3010=9.03', zh:'30×0.3010=9.03' } },
      { tex:{ko:'\\log 3=0.4771,\\ 10^{n-1}\\le 3^{10}<10^{n}\\ \\Rightarrow\\ n=\\square',en:'\\log 3=0.4771,\\ 10^{n-1}\\le 3^{10}<10^{n}\\ \\Rightarrow\\ n=\\square',zh:'\\log 3=0.4771,\\ 10^{n-1}\\le 3^{10}<10^{n}\\ \\Rightarrow\\ n=\\square'}, answer:5,
        hint:{ ko:'10×0.4771=4.771', en:'10×0.4771=4.771', zh:'10×0.4771=4.771' } }
    ],
    open:{ ko:'log N 의 정수 부분에 1 을 더하면 N 의 자릿수가 되는 까닭을 설명해 봅니다.',
      en:'Explain why adding 1 to the integer part of log N gives the number of digits of N.',
      zh:'说说为什么log N的整数部分加1就是N的位数。' },
    openHint:{ ko:'정수 부분이 k 이면 k≤log N<k+1, 곧 10ᵏ≤N<10ᵏ⁺¹ 입니다. 10ᵏ 은 1 뒤에 0 이 k 개 있는 k+1 자리의 수이고, 10ᵏ⁺¹ 보다 작은 수는 k+1 자리를 넘지 않습니다.',
      en:'If the integer part is k, then k≤log N<k+1, i.e. 10ᵏ≤N<10ᵏ⁺¹. 10ᵏ is a 1 followed by k zeros, a (k+1)-digit number, and anything below 10ᵏ⁺¹ has at most k+1 digits.',
      zh:'整数部分为k时，k≤log N<k+1，即10ᵏ≤N<10ᵏ⁺¹。10ᵏ是1后面有k个0的k+1位数，小于10ᵏ⁺¹的数不超过k+1位。' }
  },

  lab:{
    generator:'md135_commonLog', level:'main', count:6,
    params:{mode:'digits'},
    intro:{
      ko:'log N 을 계산해 10ⁿ⁻¹≤N<10ⁿ 을 만족하는 n 을 찾습니다. 두 수의 곱이면 로그의 합으로 계산합니다.',
      en:'Compute log N and find n with 10ⁿ⁻¹≤N<10ⁿ. For a product of two numbers, add their logarithms.',
      zh:'计算log N，找出满足10ⁿ⁻¹≤N<10ⁿ的n。两个数的积就用对数的和计算。'
    }
  },

  arena:{
    generator:'md135_commonLog', level:'main', count:6, timeLimit:420,
    params:{mode:'decimal'},
    rule:{ ko:'7분 안에 처음으로 0 이 아닌 숫자가 나타나는 자리를 모두 찾습니다!', en:'Find every first nonzero decimal place within 7 minutes!', zh:'7分钟内找出所有首个非零数字所在的位置！' }
  },

  stamp:{ label:{ ko:'자릿수 탐정', en:'Digit Detective', zh:'位数侦探' }, coins:52 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'자릿수를 정확히 셌어! 📏',en:'Digits counted exactly!',zh:'位数数得很准！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'지수를 앞으로 내려 곱해 봐!',en:'Bring the exponent down and multiply!',zh:'把指数移到前面相乘！'}, {ko:'소수 부분은 0 이상이어야 해!',en:'The decimal part must be at least 0!',zh:'小数部分必须不小于0！'} ],
    finish:{ ko:'완벽해! 자릿수 탐정! 📏✨', en:'Perfect! Digit Detective!', zh:'完美！位数侦探！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
