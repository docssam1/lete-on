/* Numbers of Magic — 유닛 C-32: 분수 전환 나눗셈 (중급 창의전략 8단계) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['C-32'] = {
  id:'C-32', tier:'intermediate', level:'C', order:32,
  generator:'ml_frac_conv',
  title:{ ko:'분수 전환 나눗셈', en:'Fraction-Conversion Division', zh:'分数转换除法' },
  subtitle:{ ko:'나눗셈을 분수로 보고, 배수들로 쪼개서 소수로 나타내요', en:'See division as a fraction, split it into multiples, and write it as a decimal', zh:'把除法看成分数，拆成倍数再写成小数' },
  icon:'🧩',

  practice:{
    generator:'ml_frac_conv', level:'practice', count:5,
    params:{ level:'practice' },
    intro:{
      ko:'675÷4처럼 딱 안 떨어지는 나눗셈도, 나누는 수의 배수로 쪼개면 소수로 정확히 구할 수 있어. 준비됐지?',
      en:"A division like 675÷4 that doesn't come out even can still be found exactly as a decimal — just split it into multiples of the divisor. Ready?",
      zh:'像675÷4这种除不尽的算式，只要拆成除数的倍数，也能精确算出小数。准备好了吗？'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 나눗셈 = 분수',en:'1) Division is a fraction',zh:'① 除法就是分数'},
        head:{ko:'675÷4 = 675/4: 배수로 쪼개요!',en:'675÷4 = 675/4: split it by multiples!',zh:'675÷4 = 675/4：拆成倍数！'},
        desc:{ko:'675÷4는 <b>675/4라는 분수</b>와 같아요. 675를 4의 배수로 쪼개면: <b>600</b>(=4×150), <b>40</b>(=4×10), 그리고 남는 <b>35</b>. 셋으로 나눠서 각각 4로 나눠요: 600/4=150, 40/4=10, 35/4=8.75. 마지막에 더하면: 150+10+8.75=<b>168.75</b>!',
              en:'675÷4 is the same as the <b>fraction 675/4</b>. Split 675 into multiples of 4: <b>600</b>(=4×150), <b>40</b>(=4×10), and the leftover <b>35</b>. Divide each piece by 4: 600/4=150, 40/4=10, 35/4=8.75. Add them up: 150+10+8.75=<b>168.75</b>!',
              zh:'675÷4就等于<b>分数675/4</b>。把675拆成4的倍数：<b>600</b>(=4×150)、<b>40</b>(=4×10)，剩下<b>35</b>。分别除以4：600/4=150，40/4=10，35/4=8.75。加起来：150+10+8.75=<b>168.75</b>！'},
        mathSteps:['675 = 600 + 40 + 35','600÷4=150, 40÷4=10, 35÷4=8.75','150+10+8.75 = 168.75'],
        result:{ko:'675÷4=168.75! 배수로 쪼개면 딱 안 떨어져도 정확한 소수가 나와요.',en:'675÷4=168.75! Split by multiples, even uneven division becomes an exact decimal.',zh:'675÷4=168.75！拆成倍数，除不尽也能精确成小数。'},
        book:{ko:'왜 35÷4가 8.75일까요? 35=32+3이고, 32÷4=8, 남은 3÷4=0.75(3을 4등분하면 0.75). 이렇게 나머지도 계속 쪼개면 소수가 나와요.',
              en:'Why is 35÷4=8.75? Because 35=32+3, and 32÷4=8, while 3÷4=0.75 (splitting 3 into 4 equal parts). Keep splitting the remainder and a decimal appears.',
              zh:'为什么35÷4=8.75？因为35=32+3，32÷4=8，剩下3÷4=0.75(把3分成4等份)。这样不断拆余数就能得到小数。'} },

      { tag:{ko:'② 어떤 배수로 쪼갤까',en:'2) Which multiples to pick',zh:'② 挑哪些倍数'},
        head:{ko:'딱 나눠지는 가장 가까운 배수부터!',en:'Start from the nearest multiple that divides evenly!',zh:'从最近能整除的倍数开始！'},
        desc:{ko:'쪼갤 때는 <b>딱 나눠지는 가장 큰 덩어리</b>부터 골라요. 253÷5라면: 5의 배수 중 253에 가장 가까운 <b>250</b>(=5×50)을 먼저 떼고, 남은 <b>3</b>은 3÷5=0.6. 그래서 253÷5 = 250/5+3/5 = 50+0.6=<b>50.6</b>. 큰 덩어리를 먼저 떼면 계산이 훨씬 간단해져요.',
              en:'Pick the <b>biggest chunk that divides evenly</b> first. For 253÷5: the nearest multiple of 5 is <b>250</b>(=5×50) — split that off first, leaving <b>3</b>, and 3÷5=0.6. So 253÷5 = 250/5+3/5 = 50+0.6=<b>50.6</b>. Taking the big chunk first makes everything simpler.',
              zh:'拆分时先挑<b>能整除的最大一块</b>。253÷5：5的倍数中最接近253的是<b>250</b>(=5×50)，先拆出来，剩下<b>3</b>，3÷5=0.6。所以253÷5 = 250/5+3/5 = 50+0.6=<b>50.6</b>。先拆大块，计算就简单多了。'},
        mathSteps:['253 = 250 + 3','250÷5=50, 3÷5=0.6','50+0.6 = 50.6'],
        result:{ko:'253÷5=50.6! 가장 큰 배수 덩어리부터 떼어내요.',en:'253÷5=50.6! Take the biggest multiple-chunk first.',zh:'253÷5=50.6！先拆出最大的倍数块。'},
        book:null },

      { tag:{ko:'③ 네 자리 수도 똑같이',en:'3) Even 4-digit numbers',zh:'③ 四位数也一样'},
        head:{ko:'3417÷8도 같은 방법으로!',en:'3417÷8, same method!',zh:'3417÷8也一样！'},
        desc:{ko:'수가 커져도 방법은 그대로예요. 3417÷8: 8의 배수로 쪼개면 <b>3200</b>(=8×400), <b>200</b>(=8×25), 남은 <b>17</b>은 17÷8=2.125. 합치면: 400+25+2.125=<b>427.125</b>. 배수를 몇 개로 쪼개든, 마지막에 다 더하면 답이 나와요!',
              en:'The method stays the same for bigger numbers. 3417÷8: split into multiples of 8 — <b>3200</b>(=8×400), <b>200</b>(=8×25), and the leftover <b>17</b> gives 17÷8=2.125. Add them up: 400+25+2.125=<b>427.125</b>. However many pieces you split into, adding them all gives the answer!',
              zh:'数变大方法不变。3417÷8：拆成8的倍数——<b>3200</b>(=8×400)、<b>200</b>(=8×25)，剩下<b>17</b>，17÷8=2.125。加起来：400+25+2.125=<b>427.125</b>。不管拆成几块，最后加起来就是答案！'},
        mathSteps:['3417 = 3200 + 200 + 17','3200÷8=400, 200÷8=25, 17÷8=2.125','400+25+2.125 = 427.125'],
        result:{ko:'3417÷8=427.125! 조각이 늘어도 마지막엔 다 더해요.',en:'3417÷8=427.125! More pieces, same final add.',zh:'3417÷8=427.125！块再多，最后都要相加。'},
        book:null }
    ],
    rule:{ ko:'① 나눗셈을 분수로 보기  ② 나누는 수의 배수로 큰 덩어리부터 쪼개기  ③ 각 조각을 나누고 마지막에 더해 소수로',
      en:'① See division as a fraction  ② Split off the biggest multiple-chunks first  ③ Divide each piece, then add for a decimal answer',
      zh:'① 把除法看成分数  ② 先拆出最大的倍数块  ③ 每块分别除，最后相加得小数' }
  },

  check:{
    fills:[
      { tex:'250 \\div 8 = \\square', answer:31.25,
        hint:{ ko:'240÷8=30, 10÷8=1.25, 더하면?', en:'240÷8=30, 10÷8=1.25, add them?', zh:'240÷8=30，10÷8=1.25，相加？' } },
      { tex:'4750 \\div 20 = \\square', answer:237.5,
        hint:{ ko:'4000÷20=200, 750÷20=37.5, 더하면?', en:'4000÷20=200, 750÷20=37.5, add them?', zh:'4000÷20=200，750÷20=37.5，相加？' } }
    ],
    open:{ ko:'딱 나눠떨어지지 않는 나눗셈도 배수로 쪼개면 정확한 소수 답이 나오는 이유를 설명해 봐요.',
      en:'Explain why splitting into multiples gives an exact decimal answer even for division that doesn\'t come out even.',
      zh:'解释为什么把除不尽的算式拆成倍数也能得到精确的小数答案。' },
    openHint:{ ko:'예) 나누어지는 수를 나누는 수의 배수들의 합으로 정확히 쪼갤 수 있고(예: 675=600+40+35), 각 조각을 나눈 몫들의 합은 원래 나눗셈의 답과 똑같아요. 마지막 남는 조각만 소수가 될 뿐이에요.',
      en:'e.g. Any dividend can be split exactly into a sum of multiples of the divisor (e.g. 675=600+40+35), and the sum of each piece\'s quotient equals the original answer exactly — only the last leftover piece becomes a decimal.',
      zh:'例）被除数总能精确拆成除数倍数之和(如675=600+40+35)，各块商的和正好等于原来除法的答案——只有最后剩下的那块会变成小数。' }
  },

  lab:{
    generator:'ml_frac_conv', level:'main', count:4,
    params:{ level:'main' },
    intro:{
      ko:'이번엔 더 큰 수! 배수로 쪼개서 소수까지 정확하게 구해봐.',
      en:'Bigger numbers now! Split by multiples and find the exact decimal.',
      zh:'现在数更大了！拆成倍数，精确算出小数。'
    }
  },

  arena:{
    generator:'ml_frac_conv', level:'main', count:6, timeLimit:360,
    params:{ level:'main' },
    rule:{ ko:'6분 안에 분수 전환 나눗셈 문제를 모두 풀어요!', en:'Solve all fraction-conversion division problems in 6 minutes!', zh:'6分钟内解答所有分数转换除法题！' }
  },

  stamp:{ label:{ ko:'분수 전환 달인', en:'Fraction-Conversion Master', zh:'分数转换达人' }, coins:30 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'조각조각 완벽! 🧩',en:'Every piece perfect!',zh:'每块都完美！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'배수로 쪼개서 나눠봐!',en:'Split into multiples first!',zh:'先拆成倍数！'}, {ko:'조각을 다 나눈 다음 더해봐!',en:'Divide each piece, then add!',zh:'每块分别除，再相加！'} ],
    finish:{ ko:'완벽해! 분수 전환 달인! 🧩✨', en:'Perfect! Fraction-Conversion Master!', zh:'完美！分数转换达人！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
