/* Numbers of Magic — 유닛 C-03: 분해곱셈법 (중급 A 챕터3) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['C-03'] = {
  id:'C-03', tier:'intermediate', level:'C', order:3,
  generator:'ml_pair10',
  title:{ ko:'분해곱셈법', en:'Decomposition Multiplication', zh:'分解乘法法' },
  subtitle:{ ko:'48×25: 48을 12×4로 분해하면 12×100=1200!', en:'48×25: decompose 48 as 12×4, then 12×100=1200!', zh:'48×25：把48分解为12×4，则12×100=1200！' },
  icon:'🧩',

  practice:{
    generator:'ml_pair10', level:'practice', count:5,
    params:{ target:100, mode:'decomp' },
    intro:{
      ko:'숫자를 분해해서 4×25=100 쌍을 만들어봐. 그러면 100 곱하기가 되거든! 준비됐지?',
      en:"Decompose a number to create a 4×25=100 pair — then you're just multiplying by 100! Ready?",
      zh:'把数字分解，创造出4×25=100的对——就变成乘100了！准备好了吗？'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 분해해서 쌍 만들기',en:'1) Decompose to create a pair',zh:'① 分解创造对'},
        head:{ko:'48×25 → 12×4×25 → 12×100!',en:'48×25 → 12×4×25 → 12×100!',zh:'48×25 → 12×4×25 → 12×100！'},
        desc:{ko:'48×25를 어떻게 쉽게 계산할까요? <b>48=12×4</b>로 분해해요! 그러면 48×25 = 12×4×25 = 12×(4×25) = 12×100 = 1200이에요. 25에 4를 곱하면 100이 되는 것을 이용한 거예요!',
              en:'How to compute 48×25 easily? <b>Decompose 48 = 12×4</b>! Then 48×25 = 12×4×25 = 12×(4×25) = 12×100 = 1200. We used the fact that 4×25=100!',
              zh:'怎么轻松计算48×25？<b>把48分解为12×4</b>！那么48×25 = 12×4×25 = 12×(4×25) = 12×100 = 1200。利用了4×25=100这个事实！'},
        mathSteps:['48 × 25','= (12 × 4) × 25','= 12 × (4 × 25)','= 12 × 100 = 1200'],
        result:{ko:'48×25=1200! 분해+쌍 = 100 곱하기로 변신!',en:'48×25=1200! Decompose + pair = multiply by 100!',zh:'48×25=1200！分解+对=乘100！'},
        book:{ko:'분해곱셈법: 한 인수를 분해해 4×25=100 쌍을 만든 뒤 나머지와 100을 곱해요. 핵심 쌍: 4×25=100, 2×50=100.',
              en:'Decomposition method: split one factor to create a 4×25=100 pair, then multiply the rest by 100. Key pair: 4×25=100, 2×50=100.',
              zh:'分解乘法：把一个因数分解，创造4×25=100的对，再将其余部分乘100。核心对：4×25=100，2×50=100。'} },

      { tag:{ko:'② 어떤 수를 분해할까?',en:'2) Which number to decompose?',zh:'② 分解哪个数？'},
        head:{ko:'25가 있으면 짝수를 분해해요!',en:'When you see 25, decompose the other number if it\'s even!',zh:'看到25时，分解另一个偶数！'},
        desc:{ko:'25와 곱할 때는 다른 수에 4의 인수가 있는지 확인해요. <b>4의 배수</b>면 ÷4 후 ×100. 예: 36×25 = (9×4)×25 = 9×(4×25) = 9×100 = 900. 8의 배수면 더 쉬워요!',
              en:'When multiplying by 25, check if the other number has a factor of 4. If it\'s <b>a multiple of 4</b>, divide by 4 then ×100. E.g. 36×25=(9×4)×25=9×(4×25)=9×100=900.',
              zh:'乘以25时，检查另一个数是否有因数4。如果是<b>4的倍数</b>，÷4然后×100。例：36×25=(9×4)×25=9×(4×25)=9×100=900。'},
        mathSteps:['36 × 25','= (9 × 4) × 25','= 9 × (4 × 25)','= 9 × 100 = 900'],
        result:{ko:'36×25=900! 4의 배수는 ÷4하면 딱 떨어져요.',en:'36×25=900! Multiples of 4 divide evenly to give clean results.',zh:'36×25=900！4的倍数÷4恰好整除。'},
        book:{ko:'n×25 계산법: ①n이 4의 배수이면: n÷4가 깔끔 → (n÷4)×100. ②n이 2의 배수이면: 2×50=100쌍 이용 → (n÷2)×50. ③나머지는 일반 계산.',
              en:'Computing n×25: ①if n is a multiple of 4: (n÷4)×100. ②if n is a multiple of 2: use 2×50=100 pair → (n÷2)×50. ③otherwise, standard calculation.',
              zh:'计算n×25：①n是4的倍数：(n÷4)×100。②n是2的倍数：用2×50=100→(n÷2)×50。③其他：常规计算。'} },

      { tag:{ko:'③ 2×50=100도 활용',en:'3) Also use 2×50=100',zh:'③ 也用2×50=100'},
        head:{ko:'50과 곱할 때는 2의 배수를 찾아요',en:'When multiplying by 50, look for a factor of 2',zh:'乘50时找因数2'},
        desc:{ko:'4×25=100 말고 <b>2×50=100</b>도 쌍이에요. 36×50 = (18×2)×50 = 18×(2×50) = 18×100 = 1800. 또는 더 간단하게: 36×50 = 36×100÷2 = 3600÷2 = 1800.',
              en:'Besides 4×25=100, <b>2×50=100</b> is also a pair. 36×50=(18×2)×50=18×(2×50)=18×100=1800. Or simpler: 36×50=36×100÷2=3600÷2=1800.',
              zh:'除了4×25=100，<b>2×50=100</b>也是一个对。36×50=(18×2)×50=18×(2×50)=18×100=1800。或者更简单：36×50=36×100÷2=3600÷2=1800。'},
        mathSteps:['36 × 50','= 36 × 100 ÷ 2','= 3600 ÷ 2','= 1800'],
        result:{ko:'36×50=1800! ×50=×100÷2로 변환하는 것도 좋은 방법!',en:'36×50=1800! Converting ×50=×100÷2 is also great!',zh:'36×50=1800！把×50转换为×100÷2也是好方法！'},
        book:null }
    ],
    rule:{ ko:'① 4의 배수×25: (÷4)×100  ② 2의 배수×50: (÷2)×100  ③ 분해 후 4×25=100 또는 2×50=100 쌍 만들기',
      en:'① Mult-of-4 × 25: (÷4)×100  ② Mult-of-2 × 50: (÷2)×100  ③ Decompose to create 4×25=100 or 2×50=100 pair',
      zh:'① 4的倍数×25：(÷4)×100  ② 2的倍数×50：(÷2)×100  ③ 分解后创造4×25=100或2×50=100的对' }
  },

  check:{
    fills:[
      { tex:'12 \\times 25 = \\square', answer:300,
        hint:{ ko:'12=3×4, 3×(4×25)=3×100=?', en:'12=3×4, so 3×(4×25)=3×100=?', zh:'12=3×4，3×(4×25)=3×100=？' } },
      { tex:'28 \\times 25 = \\square', answer:700,
        hint:{ ko:'28=7×4, 7×(4×25)=7×100=?', en:'28=7×4, so 7×(4×25)=7×100=?', zh:'28=7×4，7×(4×25)=7×100=？' } }
    ],
    open:{ ko:'48×25=1200이 되는 과정을 분해곱셈법으로 설명해요. 왜 이 방법이 효과적일까요?',
      en:'Explain 48×25=1200 step by step using decomposition. Why is this method effective?',
      zh:'用分解乘法法解释48×25=1200的过程。为什么这个方法有效？' },
    openHint:{ ko:'예) 48=12×4. 48×25=12×4×25=12×(4×25)=12×100=1200. 4×25=100이라는 쌍을 만들어서 곱하기 100으로 변환했어요.',
      en:'e.g. 48=12×4. 48×25=12×4×25=12×(4×25)=12×100=1200. Creating the 4×25=100 pair transforms it into ×100.',
      zh:'例）48=12×4。48×25=12×4×25=12×(4×25)=12×100=1200。创造4×25=100的对，转化为乘100。' }
  },

  lab:{
    generator:'ml_pair10', level:'main', count:4,
    params:{ target:100, mode:'decomp' },
    intro:{
      ko:'분해곱셈법 마법 시작! 숫자를 분해해서 ×100으로 만들어봐.',
      en:'Decomposition magic begins! Break the number down to create ×100.',
      zh:'分解乘法魔法开始！分解数字创造×100。'
    }
  },

  arena:{
    generator:'ml_pair10', level:'main', count:8, timeLimit:300,
    params:{ target:100, mode:'decomp' },
    rule:{ ko:'5분 안에 분해곱셈 문제를 모두 풀어요!', en:'Solve all decomposition problems in 5 minutes!', zh:'5分钟内解答所有分解乘法题！' }
  },

  stamp:{ label:{ ko:'분해 마법사', en:'Decomposition Wizard', zh:'分解魔法师' }, coins:30 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'분해 성공! 🧩',en:'Decomposed!',zh:'分解成功！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'4의 배수인지 확인해봐!',en:'Check if it\'s a multiple of 4!',zh:'检查是否是4的倍数！'}, {ko:'거의 다 왔어!',en:'Almost!',zh:'就快了！'} ],
    finish:{ ko:'완벽해! 분해 마법사! 🧩✨', en:'Perfect! Decomposition Wizard!', zh:'完美！分解魔法师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
