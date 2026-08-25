/* Numbers of Magic — 유닛 M-36: 거듭제곱근과 유리수 지수 (고등 W13 · 대수 지수와 로그) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-36'] = {
  id:'M-36', tier:'algebra', level:'40', order:1,
  generator:'md36_rationalExponent',
  title:{ ko:'거듭제곱근과 유리수 지수', en:'Radicals & Rational Exponents', zh:'方根与有理数指数' },
  subtitle:{ ko:'근호 속 지수를 분수 지수로 옮겨 적어요', en:'Rewrite a radical\'s exponent as a fraction', zh:'把根号里的指数写成分数指数' },
  icon:'🪜',

  practice:{
    generator:'md36_rationalExponent', level:'practice', count:5,
    params:{mode:'basic'},
    intro:{
      ko:'⁵√(2³)은 2^(3/5)와 같아요 — 근호의 지수(5)는 분모, 거듭제곱의 지수(3)는 분자로!',
      en:'The 5th root of 2³ equals 2^(3/5) — the root\'s index (5) becomes the denominator, the power\'s exponent (3) the numerator!',
      zh:'2³的5次方根等于2^(3/5)——根指数(5)作分母，幂指数(3)作分子！'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 근호 지수를 분수 지수로',en:'1) A root\'s index becomes a fraction exponent',zh:'① 把根号的指数写成分数指数'},
        head:{ko:'\\sqrt[3]{2^2} = 2^{\\frac{2}{3}}',en:'\\sqrt[3]{2^2} = 2^{\\frac{2}{3}}',zh:'\\sqrt[3]{2^2} = 2^{\\frac{2}{3}}'},
        desc:{ko:'³√(2²)을 지수로 옮겨 쓰면 밑은 그대로 2, 지수는 분수 2/3가 돼요. 근호의 작은 숫자(3, 몇 제곱근인지)는 분모로, 근호 안의 지수(2)는 분자로 가요 — <b>"근호는 분모, 거듭제곱은 분자"</b>로 외워요.',
              en:'Rewriting ³√(2²) with an exponent keeps the base 2 and turns the exponent into the fraction 2/3. The root\'s small number (3, which root) becomes the denominator, and the exponent inside the root (2) becomes the numerator — remember it as <b>"root goes to the denominator, power goes to the numerator."</b>',
              zh:'把³√(2²)改写成指数形式，底数仍是2，指数变成分数2/3。根号的小数字(3，几次方根)作分母，根号内的指数(2)作分子——记成<b>"根号进分母，乘方进分子"</b>。'},
        mathSteps:['\\sqrt[3]{2^2}', '=2^{\\frac{2}{3}}'],
        result:{ko:'근호 지수(n)는 분모로, 거듭제곱 지수(m)는 분자로!',en:'The root\'s index (n) to the denominator, the power (m) to the numerator!',zh:'根号指数(n)进分母，乘方指数(m)进分子！'},
        book:{ko:'ⁿ√(aᵐ) = a^(m/n) — 이 식이 유리수 지수의 정의예요.',
              en:'ⁿ√(aᵐ) = a^(m/n) — this is the definition of a rational exponent.',
              zh:'ⁿ√(aᵐ) = a^(m/n)——这就是有理数指数的定义。'} },

      { tag:{ko:'② 지수를 항상 기약분수로 줄여요',en:'2) Always reduce the exponent to lowest terms',zh:'② 指数一定要约成最简分数'},
        head:{ko:'\\sqrt[6]{2^4} = 2^{\\frac{4}{6}} = 2^{\\frac{2}{3}}',en:'\\sqrt[6]{2^4} = 2^{\\frac{4}{6}} = 2^{\\frac{2}{3}}',zh:'\\sqrt[6]{2^4} = 2^{\\frac{4}{6}} = 2^{\\frac{2}{3}}'},
        desc:{ko:'⁶√(2⁴)을 그대로 옮기면 2^(4/6)인데, 4/6은 아직 기약분수가 아니에요. 분자·분모를 2로 나누면 2/3 — 방금 본 것과 <b>똑같은 수</b>예요. 분수처럼 지수도 항상 끝까지 약분해서 답해야 해요.',
              en:'Directly rewriting ⁶√(2⁴) gives 2^(4/6), but 4/6 isn\'t fully reduced. Dividing numerator and denominator by 2 gives 2/3 — the <b>exact same number</b> as before. Just like fractions, exponents must always be reduced all the way.',
              zh:'把⁶√(2⁴)直接改写得到2^(4/6)，但4/6还没约到最简。分子分母都除以2得到2/3——和刚才是<b>完全相同的数</b>。和分数一样，指数也必须一直约到最简。'},
        mathSteps:['\\sqrt[6]{2^4} = 2^{\\frac{4}{6}}', '\\gcd(4,6)=2', '=2^{\\frac{2}{3}}'],
        result:{ko:'지수 분수도 기약분수로 끝까지 줄여요!',en:'Reduce the exponent fraction all the way, just like any fraction!',zh:'指数分数也要约到最简为止！'},
        book:{ko:'m,n의 공약수로 먼저 나누면 항상 같은 기약분수 지수가 나와요 — 나누는 순서는 결과에 영향이 없어요.',
              en:'Dividing out a common factor of m and n first always leads to the same reduced exponent — the order doesn\'t change the result.',
              zh:'先约去m、n的公因数，最后总会得到同一个最简指数——约分的顺序不影响结果。'} }
    ],
    rule:{ ko:'ⁿ√(aᵐ) = a^(m/n) — 근호 지수는 분모, 거듭제곱 지수는 분자, 답은 항상 기약분수로!',
      en:'ⁿ√(aᵐ) = a^(m/n) — the root\'s index to the denominator, the power to the numerator, always reduced!',
      zh:'ⁿ√(aᵐ) = a^(m/n)——根号指数进分母，乘方指数进分子，答案一定要约到最简！' }
  },

  check:{
    fills:[
      { tex:'\\sqrt[4]{3^2} = 3^{\\frac{\\square}{\\square}}', answer:[1,2],
        hint:{ ko:'2/4를 기약분수로 줄이면 1/2', en:'Reduce 2/4 to lowest terms: 1/2', zh:'把2/4约到最简：1/2' } },
      { tex:'\\sqrt[3]{5^6} = 5^{\\square}', answer:2,
        hint:{ ko:'6/3=2, 정수로 딱 떨어져요', en:'6/3=2, comes out as a whole integer', zh:'6/3=2，正好是整数' } }
    ],
    open:{ ko:'⁴√(2⁶)을 유리수 지수로 나타내고, 기약분수로 줄이는 과정을 설명해봐요.',
      en:'Express ⁴√(2⁶) as a rational exponent and explain how you reduce it.',
      zh:'把⁴√(2⁶)写成有理数指数，并说说约分的过程。' },
    openHint:{ ko:'⁴√(2⁶)=2^(6/4). gcd(6,4)=2이므로 6÷2=3, 4÷2=2 → 2^(3/2)',
      en:'⁴√(2⁶)=2^(6/4). Since gcd(6,4)=2, dividing gives 3 and 2 → 2^(3/2)',
      zh:'⁴√(2⁶)=2^(6/4)。gcd(6,4)=2，所以6÷2=3，4÷2=2 → 2^(3/2)' }
  },

  lab:{
    generator:'md36_rationalExponent', level:'main', count:4,
    params:{mode:'reduce'},
    intro:{
      ko:'이번엔 진짜 약분이 필요해! 분자·분모의 공약수를 찾아서 줄여봐.',
      en:'This time you really need to reduce! Find the common factor of numerator and denominator.',
      zh:'这次真的需要约分了！找出分子分母的公因数来化简。'
    }
  },

  arena:{
    generator:'md36_rationalExponent', level:'main', count:8, timeLimit:300,
    params:{mode:'wide'},
    rule:{ ko:'5분 안에 더 큰 범위의 유리수 지수 문제를 모두 풀어요!', en:'Solve all the wider-range rational exponent problems in 5 minutes!', zh:'5分钟内解答所有更大范围的有理数指数题！' }
  },

  stamp:{ label:{ ko:'지수 사다리 등반가', en:'Exponent-Ladder Climber', zh:'指数梯攀登者' }, coins:50 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'근호와 지수가 같은 말인 걸 알아챘구나! 🪜',en:'You spotted that roots and exponents say the same thing!',zh:'你发现了根号和指数说的是同一件事！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'근호의 지수는 분모, 거듭제곱의 지수는 분자로 가!',en:'The root\'s index goes to the denominator, the power to the numerator!',zh:'根号的指数进分母，乘方的指数进分子！'}, {ko:'분수 지수는 끝까지 기약분수로 줄여야 해!',en:'Reduce the fraction exponent all the way to lowest terms!',zh:'分数指数一定要约到最简！'} ],
    finish:{ ko:'완벽해! 지수 사다리 등반가! 🪜✨', en:'Perfect! Exponent-Ladder Climber!', zh:'完美！指数梯攀登者！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
