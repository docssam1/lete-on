/* Numbers of Magic — 유닛 C-33: 소수를 나누기 (중급 창의전략 8단계) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['C-33'] = {
  id:'C-33', tier:'intermediate', level:'C', order:33,
  generator:'ml_decimal_div',
  title:{ ko:'소수를 나누기', en:'Decimal Division', zh:'小数除法' },
  subtitle:{ ko:'나누는 수를 자연수로 만들면 나눗셈이 쉬워져요', en:'Turn the divisor into a whole number and division gets easy', zh:'把除数变成整数，除法就简单了' },
  icon:'🎢',

  practice:{
    generator:'ml_decimal_div', level:'practice', count:5,
    params:{ level:'practice' },
    intro:{
      ko:'0.8처럼 소수로 나누는 건 헷갈리지? 나누는 수를 자연수로 만들면 훨씬 쉬워져. 대신 나누어지는 수도 똑같이 옮겨야 해! 준비됐지?',
      en:"Dividing by a decimal like 0.8 feels tricky, right? Turn the divisor into a whole number and it gets much easier — just move the dividend's point the same way! Ready?",
      zh:'用0.8这样的小数做除数很容易搞混吧？把除数变成整数就简单多了——被除数也要同样移动小数点！准备好了吗？'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 나누는 수를 자연수로',en:'1) Make the divisor whole',zh:'① 把除数变成整数'},
        head:{ko:'48.96÷0.8: 489.6÷8 = 61.2!',en:'48.96÷0.8: 489.6÷8 = 61.2!',zh:'48.96÷0.8：489.6÷8=61.2！'},
        desc:{ko:'0.8처럼 소수로 나누면 헷갈려요. 그래서 나누는 수를 <b>자연수로</b> 만들어요: 0.8에 10을 곱하면 8. 대신 <b>나누어지는 수도 똑같이 10배</b>: 48.96×10=489.6. 이제 489.6÷8을 계산하면 <b>61.2</b> — 원래 답과 정확히 같아요! 몫은 두 수를 <b>같은 비율로 늘려도 변하지 않기</b> 때문이에요.',
              en:'Dividing by a decimal like 0.8 is confusing. So make the divisor <b>a whole number</b>: multiply 0.8 by 10 to get 8. But you must <b>scale the dividend by the same 10</b>: 48.96×10=489.6. Now 489.6÷8 gives <b>61.2</b> — exactly the original answer! That\'s because a quotient <b>doesn\'t change when both numbers are scaled by the same amount</b>.',
              zh:'用0.8这样的小数做除数很乱。所以把除数变成<b>整数</b>：0.8乘10得8。但被除数也要<b>同样乘10</b>：48.96×10=489.6。现在489.6÷8=<b>61.2</b>——和原来答案完全一样！因为两个数<b>按相同比例放大，商不会变</b>。'},
        mathSteps:['0.8 × 10 = 8','48.96 × 10 = 489.6','489.6 ÷ 8 = 61.2'],
        result:{ko:'48.96÷0.8=61.2! 두 수를 똑같이 옮기면 몫은 그대로.',en:'48.96÷0.8=61.2! Shift both numbers equally, the quotient stays the same.',zh:'48.96÷0.8=61.2！两数同步移动，商不变。'},
        book:{ko:'분수로 보면: 48.96/0.8 = 489.6/8. 분자·분모(나누어지는 수·나누는 수)에 똑같이 10을 곱해도 분수의 값(몫)은 그대로예요.',
              en:'In fractions: 48.96/0.8 = 489.6/8. Multiplying both the numerator (dividend) and denominator (divisor) by 10 keeps the value of the fraction (the quotient) unchanged.',
              zh:'用分数看：48.96/0.8 = 489.6/8。分子分母(被除数·除数)同乘10，分数值(商)不变。'} },

      { tag:{ko:'② 소수 두 자리 나누는 수는 100배',en:'2) A 2-place divisor scales by 100',zh:'② 两位小数除数就乘100'},
        head:{ko:'7.35÷0.15: 735÷15 = 49!',en:'7.35÷0.15: 735÷15 = 49!',zh:'7.35÷0.15：735÷15=49！'},
        desc:{ko:'나누는 수가 소수 <b>두 자리</b>(0.15)면 자연수로 만드는 데 <b>100배</b>가 필요해요: 0.15×100=15. 나누어지는 수도 똑같이 100배: 7.35×100=735. 이제 735÷15=<b>49</b>. 소수점이 몇 칸 있는지에 따라 옮기는 배수(10, 100, 1000…)가 정해져요.',
              en:'If the divisor has <b>two decimal places</b> (0.15), you need <b>×100</b> to make it whole: 0.15×100=15. Scale the dividend the same way: 7.35×100=735. Now 735÷15=<b>49</b>. The number of decimal places tells you the scaling factor (10, 100, 1000…).',
              zh:'如果除数有<b>两位小数</b>(0.15)，需要<b>×100</b>才能变成整数：0.15×100=15。被除数也同样×100：7.35×100=735。现在735÷15=<b>49</b>。小数位数决定了要放大多少倍(10、100、1000…)。'},
        mathSteps:['0.15 × 100 = 15','7.35 × 100 = 735','735 ÷ 15 = 49'],
        result:{ko:'7.35÷0.15=49! 소수 두 자리면 100배로 옮겨요.',en:'7.35÷0.15=49! Two decimal places means scale by 100.',zh:'7.35÷0.15=49！两位小数就放大100倍。'},
        book:null },

      { tag:{ko:'③ 몫이 정수가 되기도 해요',en:'3) The quotient can be whole, too',zh:'③ 商也可能是整数'},
        head:{ko:'6.4÷0.8 = 8: 딱 떨어질 수도!',en:'6.4÷0.8 = 8: it can divide evenly too!',zh:'6.4÷0.8 = 8：也可能整除！'},
        desc:{ko:'항상 소수 답이 나오는 건 아니에요. 6.4÷0.8: 0.8×10=8, 6.4×10=64, 64÷8=<b>8</b> — 딱 떨어지는 정수예요! 방법은 똑같아요: 나누는 수를 자연수로 만들고, 나누어지는 수도 같은 만큼 옮기고, 계산하기. 답이 정수든 소수든 이 세 단계는 변하지 않아요.',
              en:'The answer isn\'t always a decimal. 6.4÷0.8: 0.8×10=8, 6.4×10=64, 64÷8=<b>8</b> — a clean whole number! The method is identical: make the divisor whole, scale the dividend the same way, then divide. Whether the answer is whole or decimal, these three steps never change.',
              zh:'答案不一定都是小数。6.4÷0.8：0.8×10=8，6.4×10=64，64÷8=<b>8</b>——正好整除！方法一样：把除数变整数，被除数同步放大，再计算。不管答案是整数还是小数，这三步都不变。'},
        mathSteps:['0.8 × 10 = 8','6.4 × 10 = 64','64 ÷ 8 = 8'],
        result:{ko:'6.4÷0.8=8! 몫이 정수여도 방법은 똑같아요.',en:'6.4÷0.8=8! Same method, even when the quotient is whole.',zh:'6.4÷0.8=8！商是整数，方法照样一样。'},
        book:null }
    ],
    rule:{ ko:'① 나누는 수를 자연수로 만들 배수 정하기(소수점 자리 수만큼)  ② 나누어지는 수도 같은 배수로 옮기기  ③ 자연수끼리 나누기 — 답은 정수일 수도 소수일 수도',
      en:'① Pick the scale factor (by decimal places) to make the divisor whole  ② Scale the dividend the same way  ③ Divide the whole numbers — the answer may be whole or decimal',
      zh:'① 按小数位数定放大倍数，让除数变整数  ② 被除数同步放大  ③ 整数相除——答案可能是整数也可能是小数' }
  },

  check:{
    fills:[
      { tex:'6.4 \\div 0.8 = \\square', answer:8,
        hint:{ ko:'둘 다 10배: 64÷8=?', en:'Scale both by 10: 64÷8=?', zh:'两者都×10：64÷8=？' } },
      { tex:'12.6 \\div 0.14 = \\square', answer:90,
        hint:{ ko:'둘 다 100배: 1260÷14=?', en:'Scale both by 100: 1260÷14=?', zh:'两者都×100：1260÷14=？' } }
    ],
    open:{ ko:'소수로 나눌 때 나누어지는 수와 나누는 수를 똑같은 배수로 옮겨도 몫이 변하지 않는 이유를 설명해 봐요.',
      en:'Explain why scaling both the dividend and divisor by the same factor doesn\'t change the quotient in decimal division.',
      zh:'解释为什么在小数除法中，被除数和除数按相同倍数放大，商不会改变。' },
    openHint:{ ko:'예) 나눗셈은 분수 a/b와 같아요. 분자·분모에 똑같은 수를 곱하면 크기만 다른 분수가 아니라 <b>값이 같은</b> 분수가 돼요(약분의 반대). 그래서 몫은 그대로예요.',
      en:'e.g. Division is the same as the fraction a/b. Multiplying both the numerator and denominator by the same number gives an equivalent fraction with the <b>same value</b> (the reverse of simplifying). So the quotient stays unchanged.',
      zh:'例）除法就等于分数a/b。分子分母同乘一个数得到的是<b>值相等</b>的等价分数(约分的反向操作)，所以商不变。' }
  },

  lab:{
    generator:'ml_decimal_div', level:'main', count:4,
    params:{ level:'main' },
    intro:{
      ko:'이번엔 소수 두 자리 나누는 수! 100배로 옮겨서 계산해봐.',
      en:'Now with a 2-place decimal divisor! Scale by 100 and divide.',
      zh:'现在除数是两位小数！放大100倍再算。'
    }
  },

  arena:{
    generator:'ml_decimal_div', level:'main', count:8, timeLimit:300,
    params:{ level:'main' },
    rule:{ ko:'5분 안에 소수 나눗셈 문제를 모두 풀어요!', en:'Solve all decimal division problems in 5 minutes!', zh:'5分钟内解答所有小数除法题！' }
  },

  stamp:{ label:{ ko:'소수 나눗셈 마법사', en:'Decimal Division Wizard', zh:'小数除法魔法师' }, coins:30 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'멋진 이동! 🎢',en:'Nice shift!',zh:'移动得漂亮！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'나누는 수를 자연수로 만들어봐!',en:'Turn the divisor into a whole number first!',zh:'先把除数变成整数！'}, {ko:'나누어지는 수도 똑같이 옮겨봐!',en:'Scale the dividend the same way!',zh:'被除数也要同样移动！'} ],
    finish:{ ko:'완벽해! 소수 나눗셈 마법사! 🎢✨', en:'Perfect! Decimal Division Wizard!', zh:'完美！小数除法魔法师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
