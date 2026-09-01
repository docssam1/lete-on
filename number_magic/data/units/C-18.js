/* Numbers of Magic — 유닛 C-18: 분해 나눗셈 (중급 E 챕터1) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['C-18'] = {
  id:'C-18', tier:'intermediate', level:'C', order:18,
  generator:'ml_div_decomp',
  title:{ ko:'분해 나눗셈', en:'Decomposition Division', zh:'分解除法' },
  subtitle:{ ko:'312÷3 = (300+12)÷3: 나누기 쉬운 조각으로 쪼개요!', en:'312÷3 = (300+12)÷3: split into easy-to-divide pieces!', zh:'312÷3 = (300+12)÷3：拆成容易除的块！' },
  icon:'🪓',

  practice:{
    generator:'ml_div_decomp', level:'practice', count:5,
    params:{},
    intro:{
      ko:'큰 수 나눗셈은 나누기 쉬운 조각으로 쪼개면 돼. 조각마다 나누고 몫을 더하는 거야! 준비됐지?',
      en:"Big divisions get easy when you split the number into divisible pieces — divide each, add the quotients! Ready?",
      zh:'大数除法拆成容易除的块就简单了——每块分别除，再把商相加！准备好了吗？'
    }
  },

  discover:{
    story:{
      hook:{ ko:'나누기 기호 ÷ 는 가운데 선 하나에 점 두 개예요. 무엇을 그린 걸까요?',
        en:'The division sign ÷ is a line with a dot above and below. What is it a picture of?',
        zh:'除号÷是一条线加上下两个点。它画的是什么？' },
      history:{ ko:'분수라고 보는 사람이 많아요 — 점은 분자와 분모, 선은 분수선이죠. 1659년 스위스의 라안이 나눗셈 기호로 쓰기 시작했어요. 그 전 책들은 기호와 나누기라는 말을 함께 적다가 나중에 말만 지웠답니다. 나눗셈을 분수로 바꿔 푸는 마법이 기호 안에 이미 들어 있던 셈이에요.',
        en:'Many read it as a fraction — the dots are the top and bottom numbers, the bar is the fraction line. Johann Rahn started using it for division in 1659. Older books wrote the symbol and the word divide side by side, then dropped the word. The trick of turning a division into a fraction was already hiding inside the sign.',
        zh:'很多人把它读成一个分数——两个点是分子和分母，中间的线是分数线。1659年瑞士人拉恩开始用它表示除法。更早的书里符号和除这个字是并排写的，后来才把字去掉。把除法变成分数来算的魔法，早就藏在这个符号里了。' }
    },
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 나누기 쉬운 조각',en:'1) Easy-to-divide pieces',zh:'① 容易除的块'},
        head:{ko:'312÷3 = 300÷3 + 12÷3',en:'312÷3 = 300÷3 + 12÷3',zh:'312÷3 = 300÷3 + 12÷3'},
        desc:{ko:'312÷3이 어렵게 보이면 <b>312를 300+12로 쪼개요</b>. 두 조각 다 3으로 딱 나눠져요! 300÷3=100, 12÷3=4 → 100+4=<b>104</b>. 핵심은 <b>나누는 수로 딱 떨어지는 조각</b>을 고르는 것. 곱셈의 분배법칙(C-07)이 나눗셈에도 통해요!',
              en:'If 312÷3 looks hard, <b>split 312 into 300+12</b> — both pieces divide cleanly by 3! 300÷3=100, 12÷3=4 → 100+4=<b>104</b>. The key is choosing <b>pieces the divisor goes into evenly</b>. The distributive law from multiplication (C-07) works for division too!',
              zh:'312÷3看着难？<b>把312拆成300+12</b>——两块都能被3整除！300÷3=100，12÷3=4 → 100+4=<b>104</b>。关键是选<b>能被除数整除的块</b>。乘法的分配律(C-07)在除法也适用！'},
        mathSteps:['312 ÷ 3','= (300 + 12) ÷ 3','= 100 + 4','= 104'],
        result:{ko:'312÷3=104! 조각마다 나누고 몫을 더해요.',en:'312÷3=104! Divide each piece, add the quotients.',zh:'312÷3=104！每块分别除，商相加。'},
        book:{ko:'원리: (a+b)÷c = a÷c + b÷c. 단, 나눗셈에서는 나누어지는 수만 쪼갤 수 있어요 — 나누는 수를 쪼개면 안 돼요! 예: 12÷(2+1) ≠ 12÷2+12÷1.',
              en:'Principle: (a+b)÷c = a÷c + b÷c. Careful: only the dividend may be split — never the divisor! E.g. 12÷(2+1) ≠ 12÷2+12÷1.',
              zh:'原理：(a+b)÷c = a÷c + b÷c。注意：只能拆被除数——不能拆除数！例：12÷(2+1) ≠ 12÷2+12÷1。'} },

      { tag:{ko:'② 좋은 조각 고르는 법',en:'2) Choosing good pieces',zh:'② 怎么选好块'},
        head:{ko:'가장 큰 "딱 떨어지는 몇백"을 먼저!',en:'Take the biggest clean hundreds first!',zh:'先取最大的"整除的几百"！'},
        desc:{ko:'조각을 잘 고르는 요령: <b>나누는 수의 배수인 몇백</b>을 최대한 크게 떼어내요. 434÷7이라면? 700은 너무 커요. <b>420(=7×60)</b>을 떼면: 420÷7=60, 14÷7=2 → <b>62</b>. 구구단에서 가까운 배수를 찾는 눈이 핵심이에요!',
              en:'The knack for good pieces: peel off <b>the largest clean multiple of the divisor</b>. For 434÷7? 700 is too big. Take <b>420 (=7×60)</b>: 420÷7=60, 14÷7=2 → <b>62</b>. Spotting nearby multiples from the times tables is the key skill!',
              zh:'选块的窍门：尽量取<b>除数的最大整倍数</b>。434÷7？700太大。取<b>420(=7×60)</b>：420÷7=60，14÷7=2 → <b>62</b>。从乘法口诀里找相近倍数是关键眼力！'},
        mathSteps:['434 ÷ 7','= (420 + 14) ÷ 7','= 60 + 2','= 62'],
        result:{ko:'434÷7=62! 7×6=42를 알면 420이 보여요.',en:'434÷7=62! Knowing 7×6=42 reveals the 420.',zh:'434÷7=62！知道7×6=42就能看见420。'},
        book:{ko:'구구단 거꾸로 읽기: "7로 나누기"가 보이면 7단(7,14,21,…63)을 떠올려요. 몇백 근처의 배수(420, 560, 630…)가 좋은 조각 후보예요.',
              en:'Read the times table backwards: dividing by 7 means recalling the 7s (7,14,21,…63). Multiples near round hundreds (420, 560, 630…) are prime piece candidates.',
              zh:'倒着用口诀：除以7就回想7的倍数(7,14,21,…63)。接近整百的倍数(420、560、630…)是好块的候选。'} },

      { tag:{ko:'③ 세 조각도 문제없어요',en:'3) Three pieces work too',zh:'③ 三块也没问题'},
        head:{ko:'645÷5 = 500÷5 + 100÷5 + 45÷5',en:'645÷5 = 500÷5 + 100÷5 + 45÷5',zh:'645÷5 = 500÷5 + 100÷5 + 45÷5'},
        desc:{ko:'조각이 꼭 두 개일 필요는 없어요! 645÷5는 <b>500+100+45</b>로 쪼개면: 100+20+9=<b>129</b>. 또는 600+45로 두 조각: 120+9=129. 어떻게 쪼개도 <b>몫의 합은 같아요</b> — 자기가 나누기 편한 조각을 고르면 그게 정답 경로!',
              en:'Pieces needn\'t be exactly two! Split 645÷5 as <b>500+100+45</b>: 100+20+9=<b>129</b>. Or two pieces, 600+45: 120+9=129. However you split, <b>the quotients sum the same</b> — whichever pieces feel easiest are your correct path!',
              zh:'不一定非要两块！645÷5拆成<b>500+100+45</b>：100+20+9=<b>129</b>。或两块600+45：120+9=129。不管怎么拆，<b>商的和都一样</b>——选自己好除的块就是正确路线！'},
        mathSteps:['645 ÷ 5','= (500+100+45) ÷ 5','= 100 + 20 + 9','= 129'],
        result:{ko:'645÷5=129! 쪼개는 방법은 여러 가지, 답은 하나.',en:'645÷5=129! Many ways to split, one answer.',zh:'645÷5=129！拆法多样，答案唯一。'},
        book:null }
    ],
    rule:{ ko:'① 나누어지는 수를 나누는 수의 배수 조각으로 쪼개기  ② 큰 조각(몇백)부터  ③ 조각별 몫을 모두 더하기',
      en:'① Split the dividend into clean multiples of the divisor  ② Biggest piece (hundreds) first  ③ Add all the partial quotients',
      zh:'① 把被除数拆成除数的整倍数块  ② 从大块(几百)开始  ③ 把各块的商全部相加' }
  },

  check:{
    fills:[
      { tex:'624 \\div 6 = \\square', answer:104,
        hint:{ ko:'600÷6=100, 24÷6=4', en:'600÷6=100, 24÷6=4', zh:'600÷6=100，24÷6=4' } },
      { tex:'536 \\div 4 = \\square', answer:134,
        hint:{ ko:'400÷4=100, 120÷4=30, 16÷4=4', en:'400÷4=100, 120÷4=30, 16÷4=4', zh:'400÷4=100，120÷4=30，16÷4=4' } }
    ],
    open:{ ko:'곱셈과 달리 나눗셈에서는 나누는 수를 쪼개면 안 되는 이유를 예를 들어 설명해 봐요.',
      en:'Give an example showing why, unlike in multiplication, you must not split the divisor.',
      zh:'举例说明为什么除法里不能拆除数（和乘法不同）。' },
    openHint:{ ko:'예) 12÷6=2인데, 6을 4+2로 쪼개서 12÷4+12÷2=3+6=9라고 하면 완전히 달라져요. 쪼갤 수 있는 건 나누어지는 수(12)뿐: (8+4)÷6은 안 되지만 (6+6)÷6=1+1=2는 맞아요.',
      en:'e.g. 12÷6=2, but splitting the divisor as 12÷4+12÷2=3+6=9 is completely wrong. Only the dividend splits: (6+6)÷6=1+1=2 works.',
      zh:'例）12÷6=2，但把除数拆成12÷4+12÷2=3+6=9完全错了。只能拆被除数：(6+6)÷6=1+1=2才对。' }
  },

  lab:{
    generator:'ml_div_decomp', level:'main', count:4,
    params:{},
    intro:{
      ko:'분해 나눗셈 마법! 딱 떨어지는 조각으로 쪼개봐.',
      en:'Decomposition division magic! Split into clean pieces.',
      zh:'分解除法魔法！拆成整除的块。'
    }
  },

  arena:{
    generator:'ml_div_decomp', level:'main', count:8, timeLimit:360,
    params:{},
    rule:{ ko:'6분 안에 분해 나눗셈 문제를 모두 풀어요!', en:'Solve all decomposition division problems in 6 minutes!', zh:'6分钟内解答所有分解除法题！' }
  },

  stamp:{ label:{ ko:'분해 나눗셈사', en:'Decomposition Divider', zh:'分解除法师' }, coins:30 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'멋진 분해! 🪓',en:'Nice split!',zh:'拆得漂亮！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'딱 떨어지는 몇백부터 떼어봐!',en:'Peel off the clean hundreds first!',zh:'先取整除的几百！'}, {ko:'조각의 몫을 모두 더했어?',en:'Did you add all the partial quotients?',zh:'各块的商都加了吗？'} ],
    finish:{ ko:'완벽해! 분해 나눗셈사! 🪓✨', en:'Perfect! Decomposition Divider!', zh:'完美！分解除法师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
