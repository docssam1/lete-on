/* Numbers of Magic — 유닛 C-21: 분수 덧뺄셈 · 동분모 (중급 E 챕터4) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['C-21'] = {
  id:'C-21', tier:'intermediate', level:'C', order:21,
  generator:'ml_frac_same',
  title:{ ko:'분수 덧뺄셈 (같은 분모)', en:'Fractions: Same Denominator', zh:'分数加减法(同分母)' },
  subtitle:{ ko:'분모가 같으면 분자끼리만! 2/7 + 3/7 = 5/7', en:'Same denominator? Just add the numerators! 2/7 + 3/7 = 5/7', zh:'分母相同就只加分子！2/7 + 3/7 = 5/7' },
  icon:'🍕',

  practice:{
    generator:'ml_frac_same', level:'practice', count:5,
    params:{ op:'add' },
    intro:{
      ko:'분모가 같은 분수의 덧셈이야. 분모는 조각의 크기, 분자는 조각의 개수 — 개수끼리만 더하면 돼! 준비됐지?',
      en:"Adding fractions with the same denominator. The denominator is the piece size, the numerator is the piece count — just add the counts! Ready?",
      zh:'同分母分数加法。分母是块的大小，分子是块的个数——只加个数就行！准备好了吗？'
    }
  },

  discover:{
    story:{
      hook:{ ko:'어제 3타수 2안타, 오늘 4타수 3안타. 이틀 평균 타율은 2/3 + 3/4을 반으로 나눈 값일까요?',
        en:'Two hits in three at-bats yesterday, three in four today. Is the two-day average just half of 2/3 + 3/4?',
        zh:'昨天3打数2安打，今天4打数3安打。两天的平均打击率是2/3 + 3/4的一半吗？' },
      history:{ ko:'아니에요. 이틀 동안 타석은 3+4=7번, 안타는 2+3=5개니까 5/7이에요. 분수를 더할 때 분모끼리 분자끼리 더하면 안 되지만, 타율은 원래 그렇게 세는 수라서 다르게 계산해야 해요. 분수는 무엇을 몇 등분한 것인지 먼저 확인하는 게 언제나 첫걸음이에요.',
        en:'No. Over the two days there were 3+4 = 7 at-bats and 2+3 = 5 hits, so the average is 5/7. You never add fractions by adding tops and bottoms — but a batting average counts that way by definition, so it needs its own arithmetic. Always start by asking what is being divided into how many parts.',
        zh:'不是。两天一共3+4=7次打数、2+3=5次安打，所以是5/7。加分数时绝不能分子加分子、分母加分母——但打击率本来就是那样统计的，所以要另外算。先弄清楚是把什么分成了几份，永远是第一步。' }
    },
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 분수는 피자 조각',en:'1) Fractions are pizza slices',zh:'① 分数是披萨块'},
        head:{ko:'2/7 = 7조각 중 2조각',en:'2/7 = 2 slices out of 7',zh:'2/7 = 7块中的2块'},
        desc:{ko:'피자 한 판을 <b>7조각</b>으로 잘랐어요. 내가 2조각을 가지면 <b>2/7</b>. 아래 수(분모 7)는 <b>조각의 크기</b>(한 판을 몇 개로 잘랐나), 위 수(분자 2)는 <b>내가 가진 개수</b>예요. 분수를 읽을 때 항상 "몇 조각짜리 중의 몇 개"로 떠올려요!',
              en:'A pizza cut into <b>7 slices</b>. Take 2 slices — that\'s <b>2/7</b>. The bottom number (denominator 7) is the <b>slice size</b> (how many cuts per pizza); the top (numerator 2) is <b>how many you hold</b>. Always read a fraction as "this many pieces of that size"!',
              zh:'一张披萨切成<b>7块</b>。我拿2块就是<b>2/7</b>。下面的数(分母7)是<b>块的大小</b>(一张切成几块)，上面的数(分子2)是<b>我拿的个数</b>。读分数时永远想成"某种大小的块拿了几个"！'},
        mathSteps:['\\text{분모 = 조각 크기 (몇 등분?)}','\\text{분자 = 조각 개수 (몇 개?)}','\\dfrac{2}{7} = \\text{7등분 중 2개}'],
        result:{ko:'분모는 크기, 분자는 개수! 이것만 기억하면 분수가 쉬워요.',en:'Denominator = size, numerator = count! Remember this and fractions get easy.',zh:'分母是大小，分子是个数！记住这个，分数就简单。'},
        book:{ko:'분모(分母)는 "나눈 어머니", 분자(分子)는 "가진 아이"라는 한자예요. 어머니(분모)가 조각 세계를 만들고, 아이(분자)가 그 안에서 개수를 세요.',
              en:'In the Korean/Chinese terms, the denominator is the "mother" that creates the world of pieces, and the numerator is the "child" counting inside it.',
              zh:'分母是"分的母亲"，分子是"数的孩子"。母亲(分母)创造块的世界，孩子(分子)在里面数个数。'} },

      { tag:{ko:'② 같은 크기면 개수만 더해요',en:'2) Same size → just add counts',zh:'② 大小相同→只加个数'},
        head:{ko:'2/7 + 3/7 = 5/7 (분모는 그대로!)',en:'2/7 + 3/7 = 5/7 (denominator unchanged!)',zh:'2/7 + 3/7 = 5/7（分母不变！）'},
        desc:{ko:'2조각 + 3조각 = 5조각. 조각의 <b>크기(분모)는 변하지 않으니</b> 2/7+3/7 = <b>5/7</b>. 가장 흔한 실수는 분모까지 더해서 5/14라고 하는 것! 피자로 생각해요 — 조각을 합쳐도 <b>피자가 더 잘게 잘리진 않죠?</b> 분모는 절대 더하지 않아요!',
              en:'2 slices + 3 slices = 5 slices. The <b>size (denominator) doesn\'t change</b>, so 2/7+3/7 = <b>5/7</b>. The classic mistake is adding denominators to get 5/14! Think pizza — combining slices <b>doesn\'t re-cut the pizza finer</b>, does it? Never add the denominators!',
              zh:'2块+3块=5块。块的<b>大小(分母)不变</b>，所以2/7+3/7 = <b>5/7</b>。最常见的错误是把分母也加起来得5/14！想想披萨——把块合起来<b>披萨不会被切得更碎</b>吧？分母绝对不加！'},
        mathSteps:['\\dfrac{2}{7} + \\dfrac{3}{7}','= \\dfrac{2+3}{7}','= \\dfrac{5}{7}'],
        result:{ko:'분자끼리만 더하기! 분모는 조각 크기라 그대로예요.',en:'Add numerators only! The denominator is the size — it stays.',zh:'只加分子！分母是块的大小，保持不变。'},
        book:{ko:'주의: 답이 가분수가 되면(예: 4/5+3/5=7/5) 대분수 1과 2/5로 바꿔 쓸 수 있어요. 분자가 분모보다 크면 "피자 한 판이 넘는다"는 뜻!',
              en:'Note: if the sum tops the denominator (4/5+3/5=7/5), you can rewrite it as the mixed number 1 and 2/5 — "more than one whole pizza"!',
              zh:'注意：结果成假分数时(4/5+3/5=7/5)可写成带分数1又2/5——表示"超过一整张披萨"！'} },

      { tag:{ko:'③ 뺄셈도 똑같아요',en:'3) Subtraction works the same',zh:'③ 减法也一样'},
        head:{ko:'5/8 − 2/8 = 3/8',en:'5/8 − 2/8 = 3/8',zh:'5/8 − 2/8 = 3/8'},
        desc:{ko:'빼기도 마찬가지! 5조각에서 2조각을 먹으면 3조각 남아요: 5/8−2/8 = <b>3/8</b>. 규칙은 하나 — <b>분모가 같을 때는 분자끼리만 계산</b>. 덧셈이든 뺄셈이든 조각의 크기는 변하지 않으니까요.',
              en:'Subtracting is the same! Eat 2 of your 5 slices and 3 remain: 5/8−2/8 = <b>3/8</b>. One rule — <b>with equal denominators, operate on numerators only</b>. Adding or subtracting, the slice size never changes.',
              zh:'减法也一样！5块吃掉2块剩3块：5/8−2/8 = <b>3/8</b>。规则只有一条——<b>分母相同时只算分子</b>。不管加还是减，块的大小都不变。'},
        mathSteps:['\\dfrac{5}{8} - \\dfrac{2}{8}','= \\dfrac{5-2}{8}','= \\dfrac{3}{8}'],
        result:{ko:'5/8−2/8=3/8! 빼기도 분자끼리만.',en:'5/8−2/8=3/8! Subtract numerators only.',zh:'5/8−2/8=3/8！减法也只算分子。'},
        book:null }
    ],
    rule:{ ko:'① 분모 = 조각 크기, 분자 = 조각 개수  ② 분모가 같으면 분자끼리만 더하고 빼기  ③ 분모는 절대 더하지 않기',
      en:'① Denominator = size, numerator = count  ② Equal denominators → add/subtract numerators only  ③ Never add the denominators',
      zh:'① 分母=大小，分子=个数  ② 分母相同只算分子  ③ 分母绝对不相加' }
  },

  check:{
    fills:[
      { tex:'\\dfrac{3}{9} + \\dfrac{4}{9} = \\dfrac{\\square}{9}', answer:7,
        hint:{ ko:'분자만: 3+4=?', en:'Numerators only: 3+4=?', zh:'只算分子：3+4=？' } },
      { tex:'\\dfrac{7}{10} - \\dfrac{3}{10} = \\dfrac{\\square}{10}', answer:4,
        hint:{ ko:'분자만: 7−3=?', en:'Numerators only: 7−3=?', zh:'只算分子：7−3=？' } }
    ],
    open:{ ko:'친구가 1/4 + 2/4 = 3/8이라고 답했어요. 피자 그림으로 왜 틀렸는지 설명해 봐요.',
      en:'A friend claims 1/4 + 2/4 = 3/8. Use a pizza picture to explain the mistake.',
      zh:'朋友说1/4 + 2/4 = 3/8。用披萨图解释为什么错了。' },
    openHint:{ ko:'예) 4등분 피자에서 1조각+2조각=3조각, 즉 3/4. 조각을 모아도 피자가 8등분으로 변하지 않아요. 분모를 더한 3/8은 실제(3/4)의 절반밖에 안 돼요!',
      en:'e.g. On a pizza cut in 4: 1 slice + 2 slices = 3 slices = 3/4. Combining slices doesn\'t re-cut the pizza into 8. The "3/8" answer is only half the true amount (3/4)!',
      zh:'例）切成4块的披萨：1块+2块=3块，即3/4。合并块不会把披萨变成8等分。加了分母的3/8只有真实量(3/4)的一半！' }
  },

  lab:{
    generator:'ml_frac_same', level:'main', count:4,
    params:{ op:'sub' },
    intro:{
      ko:'이번엔 분수 뺄셈! 분자끼리만 빼봐.',
      en:'Now fraction subtraction! Subtract the numerators only.',
      zh:'现在是分数减法！只减分子。'
    }
  },

  arena:{
    generator:'ml_frac_same', level:'main', count:8, timeLimit:300,
    params:{ op:'add' },
    rule:{ ko:'5분 안에 분수 덧뺄셈 문제를 모두 풀어요!', en:'Solve all fraction problems in 5 minutes!', zh:'5分钟内解答所有分数题！' }
  },

  stamp:{ label:{ ko:'분수 견습생', en:'Fraction Apprentice', zh:'分数学徒' }, coins:30 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'조각을 잘 셌어! 🍕',en:'Counted the slices!',zh:'块数得好！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'분모는 그대로야!',en:'The denominator stays!',zh:'分母不变！'}, {ko:'분자끼리만 계산해봐!',en:'Operate on numerators only!',zh:'只算分子！'} ],
    finish:{ ko:'완벽해! 분수 견습생 합격! 🍕✨', en:'Perfect! Fraction Apprentice!', zh:'完美！分数学徒过关！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
