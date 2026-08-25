/* Numbers of Magic — 유닛 M-20: 인수분해 기초 (중등 W10 · 중3 다항식의 곱셈과 인수분해) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-20'] = {
  id:'M-20', tier:'middle3', level:'35', order:20,
  generator:'md20_factorBasic',
  title:{ ko:'인수분해 기초', en:'Basic Factoring', zh:'因式分解基础' },
  subtitle:{ ko:'곱셈공식을 거꾸로 — 더해서 b, 곱해서 c가 되는 두 수를 찾아요', en:'Multiplication formulas in reverse — find two numbers that add to b and multiply to c', zh:'把乘法公式反过来——找相加得b、相乘得c的两个数' },
  icon:'🔍',

  practice:{
    generator:'md20_factorBasic', level:'practice', count:5,
    params:{level:'positive'},
    intro:{
      ko:'x²+5x+6을 (x+□)(x+□)로 되돌리려면, 더해서 5·곱해서 6이 되는 두 수를 찾으면 돼요 — 2와 3!',
      en:'To turn x²+5x+6 back into (x+□)(x+□), find two numbers that add to 5 and multiply to 6 — that\'s 2 and 3!',
      zh:'要把x²+5x+6变回(x+□)(x+□)，找相加得5、相乘得6的两个数就行——是2和3！'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'이전 유닛에서 (x+2)(x+3)을 전개하면 x²+5x+6이 된다는 걸 배웠어요. 그럼 거꾸로, x²+5x+6이 주어졌을 때 원래 곱셈식으로 되돌릴 수 있을까요?',
        en:'You learned that expanding (x+2)(x+3) gives x²+5x+6. So working backward — given x²+5x+6, can you return it to the original multiplication?',
        zh:'之前学过展开(x+2)(x+3)会得到x²+5x+6。那反过来，给出x²+5x+6，能不能还原成原来的乘法式？' },
      history:{ ko:'"인수분해"의 영어 factor는 라틴어로 "만드는 사람"이라는 뜻이에요. 곱셈을 만드는 재료(인수)를 찾아내는 일이라, 곱셈공식을 정확히 알수록 인수분해가 쉬워져요 — 외운 공식을 거꾸로 읽는 연습이거든요.',
        en:'The word "factor" comes from Latin meaning "one who makes." Factoring means finding the pieces (factors) that make up a product — the better you know the multiplication formulas, the easier factoring becomes, since it\'s really reading a memorized formula backward.',
        zh:'"因式分解"的英文factor源自拉丁语，意为"制造者"。因式分解就是找出构成乘积的材料(因数)——乘法公式记得越熟，因式分解就越容易，因为这其实是在反着读已经记住的公式。' }
    },
    stages:[
      { tag:{ko:'① 더해서 b, 곱해서 c가 되는 두 수',en:'1) Two numbers that add to b and multiply to c',zh:'① 相加得b、相乘得c的两个数'},
        head:{ko:'x^2+7x+12=(x+3)(x+4)',en:'x^2+7x+12=(x+3)(x+4)',zh:'x^2+7x+12=(x+3)(x+4)'},
        desc:{ko:'곱셈공식 (x+a)(x+b)=x²+(a+b)x+ab을 거꾸로 읽어요. x²+7x+12에서 b=7, c=12니까, <b>더해서 7, 곱해서 12</b>가 되는 두 수를 찾으면 돼요 — 3과 4예요(3+4=7, 3×4=12).',
              en:'Read the formula (x+a)(x+b)=x²+(a+b)x+ab backward. In x²+7x+12, b=7 and c=12, so find two numbers that <b>add to 7 and multiply to 12</b> — that\'s 3 and 4 (3+4=7, 3×4=12).',
              zh:'把公式(x+a)(x+b)=x²+(a+b)x+ab反着读。在x²+7x+12中，b=7，c=12，所以找<b>相加得7、相乘得12</b>的两个数——是3和4(3+4=7，3×4=12)。'},
        mathSteps:['3+4=7,\\;\\;3\\times4=12', 'x^2+7x+12', '=(x+3)(x+4)'],
        result:{ko:'곱셈공식을 거꾸로 읽으면 인수분해가 돼요!',en:'Reading the multiplication formula backward gives you factoring!',zh:'把乘法公式反着读就是因式分解！'},
        book:{ko:'x²+bx+c = (x+p)(x+q) (단, p+q=b, pq=c). 곱해서 c인 짝을 먼저 나열해보고, 그중 더해서 b가 되는 걸 고르는 게 요령이에요.',
              en:'x²+bx+c = (x+p)(x+q), where p+q=b and pq=c. A good trick: list pairs that multiply to c first, then pick the pair that also adds to b.',
              zh:'x²+bx+c = (x+p)(x+q)(其中p+q=b，pq=c)。技巧是先列出相乘得c的数对，再从中挑出相加也等于b的那一对。'} },

      { tag:{ko:'② 부호가 섞이면 곱해서 음수',en:'2) Mixed signs — the product is negative',zh:'② 符号混合时，乘积为负'},
        head:{ko:'x^2-2x-15=(x-5)(x+3)',en:'x^2-2x-15=(x-5)(x+3)',zh:'x^2-2x-15=(x-5)(x+3)'},
        desc:{ko:'곱해서 -15가 되려면 두 수의 부호가 <b>반드시 반대</b>예요(음수×양수=음수). -15를 만드는 짝(-15·1, -5·3, -3·5, -1·15…) 중 더해서 -2가 되는 건 -5와 3이에요.',
              en:'For the product to be -15, the two numbers <b>must have opposite signs</b> (negative × positive = negative). Among the pairs making -15 (-15·1, -5·3, -3·5, -1·15…), the pair that also adds to -2 is -5 and 3.',
              zh:'乘积为-15，两数<b>必须符号相反</b>(负×正=负)。在能凑出-15的数对中(-15·1、-5·3、-3·5、-1·15…)，相加也等于-2的是-5和3。'},
        mathSteps:['-5+3=-2,\\;\\;-5\\times3=-15', 'x^2-2x-15', '=(x-5)(x+3)'],
        result:{ko:'곱이 음수면 부호가 반대인 두 수를 찾아요!',en:'If the product is negative, look for two numbers with opposite signs!',zh:'乘积为负，就找符号相反的两个数！'},
        book:{ko:'곱 c가 양수면 두 수는 같은 부호, c가 음수면 서로 다른 부호예요. 그 뒤 합 b의 부호로 어느 쪽이 더 큰지 정해요.',
              en:'If the product c is positive, the two numbers share a sign; if c is negative, they differ. Then the sign of the sum b tells you which one is larger.',
              zh:'如果积c是正数，两数同号；c是负数，两数异号。然后根据和b的符号判断哪个数绝对值更大。'} }
    ],
    rule:{ ko:'① 곱해서 c가 되는 두 수 짝을 나열  ② 그중 더해서 b가 되는 짝을 선택  ③ c가 음수면 부호가 반대인 짝을 찾기',
      en:'① List pairs that multiply to c  ② Pick the pair that also adds to b  ③ If c is negative, look for a pair with opposite signs',
      zh:'① 列出相乘得c的数对  ② 选出相加也等于b的那一对  ③ c为负就找符号相反的数对' }
  },

  check:{
    fills:[
      { tex:'x^2+8x+15=(x+\\square)(x+\\square)', answer:[3,5],
        hint:{ ko:'더해서 8, 곱해서 15', en:'Add to 8, multiply to 15', zh:'相加得8，相乘得15' } },
      { tex:'x^2+2x-8=(x+\\square)(x+\\square)', answer:[-2,4],
        hint:{ ko:'더해서 2, 곱해서 -8 → 작은 수부터', en:'Add to 2, multiply to -8 — enter the smaller one first', zh:'相加得2，相乘得-8——先输入较小的' } }
    ],
    open:{ ko:'x²-9x+20을 인수분해하는 과정을 설명해봐요.',
      en:'Explain the process of factoring x²-9x+20.',
      zh:'说说因式分解x²-9x+20的过程。' },
    openHint:{ ko:'곱해서 20, 더해서 -9인 두 수: -4와 -5 → (x-4)(x-5)',
      en:'Two numbers multiplying to 20 and adding to -9: -4 and -5 → (x-4)(x-5)',
      zh:'相乘得20、相加得-9的两个数：-4和-5 → (x-4)(x-5)' }
  },

  lab:{
    generator:'md20_factorBasic', level:'main', count:4,
    params:{level:'positive'},
    intro:{
      ko:'모두 양수인 기본형부터! 곱해서 c인 짝을 먼저 떠올려봐.',
      en:'Start with the basic all-positive case! Think of pairs that multiply to c first.',
      zh:'先从全是正数的基本型开始！先想想相乘得c的数对。'
    }
  },

  arena:{
    generator:'md20_factorBasic', level:'main', count:8, timeLimit:300,
    params:{level:'mixed'},
    rule:{ ko:'5분 안에 부호가 섞인 인수분해를 모두 풀어요!', en:'Solve all the mixed-sign factoring problems in 5 minutes!', zh:'5分钟内解答所有符号混合的因式分解题！' }
  },

  stamp:{ label:{ ko:'인수분해 탐험가', en:'Factoring Explorer', zh:'因式分解探险家' }, coins:50 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'곱셈공식을 거꾸로 정확히 읽어냈어! 🔍',en:'You read the multiplication formula backward perfectly!',zh:'把乘法公式反着读得很准确！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'곱해서 c가 되는 두 수 중 더해서 b가 되는 걸 찾아봐!',en:'Among pairs multiplying to c, find the one that also adds to b!',zh:'在相乘得c的数对中，找出相加也等于b的！'}, {ko:'곱이 음수면 부호가 반대인 두 수를 찾아야 해!',en:'If the product is negative, the two numbers must have opposite signs!',zh:'乘积为负，两数必须符号相反！'} ],
    finish:{ ko:'완벽해! 인수분해 탐험가! 🔍✨', en:'Perfect! Factoring Explorer!', zh:'完美！因式分解探险家！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
