/* Numbers of Magic — 유닛 C-25: 소수를 곱하기 (중급 창의전략 8단계) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['C-25'] = {
  id:'C-25', tier:'intermediate', level:'C', order:25,
  generator:'ml_decimal_mul',
  title:{ ko:'소수를 곱하기', en:'Decimal Multiplication', zh:'小数乘法' },
  subtitle:{ ko:'×0.1은 ÷10: 소수점이 왼쪽으로 미끄러져요!', en:'×0.1 means ÷10: the decimal point slides left!', zh:'×0.1就是÷10：小数点向左滑！' },
  icon:'🎿',

  practice:{
    generator:'ml_decimal_mul', level:'practice', count:5,
    params:{ mode:'mul' },
    intro:{
      ko:'0.1을 곱하는 건 10으로 나누는 것과 같아. 소수점이 왼쪽으로 미끄러지는 거야! 준비됐지?',
      en:"Multiplying by 0.1 is the same as dividing by 10 — the decimal point slides left! Ready?",
      zh:'乘0.1和除以10一样——小数点向左滑！准备好了吗？'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 0.1은 10분의 1',en:'1) 0.1 is one tenth',zh:'① 0.1是十分之一'},
        head:{ko:'×0.1 = ÷10: 소수점이 왼쪽으로 한 칸!',en:'×0.1 = ÷10: the point slides one left!',zh:'×0.1 = ÷10：小数点左滑一格！'},
        desc:{ko:'0.1은 <b>1을 10으로 나눈 수</b>(1/10)예요. 그래서 <b>×0.1은 ÷10과 완전히 같아요</b>! 43×0.1 = 43÷10 = <b>4.3</b>. 소수점이 왼쪽으로 한 칸 미끄러진 것처럼 보이죠? ×0.01(1/100)이면 두 칸: 43×0.01 = 0.43. "0.1을 곱하면 커진다"고 착각하기 쉬운데, 사실은 <b>10배 작아져요</b>!',
              en:'0.1 is <b>1 divided by 10</b> (1/10). So <b>×0.1 is exactly ÷10</b>! 43×0.1 = 43÷10 = <b>4.3</b>. The decimal point slides one place left. With ×0.01 (1/100) it slides two: 43×0.01 = 0.43. It\'s tempting to think multiplying makes things bigger — but ×0.1 makes it <b>ten times smaller</b>!',
              zh:'0.1是<b>1除以10</b>(1/10)。所以<b>×0.1和÷10完全一样</b>！43×0.1 = 43÷10 = <b>4.3</b>。小数点向左滑一格。×0.01(1/100)就滑两格：43×0.01 = 0.43。容易误以为"乘了会变大"——其实×0.1会<b>变小10倍</b>！'},
        mathSteps:['43 × 0.1','= 43 ÷ 10','= 4.3'],
        result:{ko:'43×0.1=4.3! 곱했는데 작아져요 — 0.1은 1보다 작으니까.',en:'43×0.1=4.3! Multiplying made it smaller — because 0.1 < 1.',zh:'43×0.1=4.3！乘了反而变小——因为0.1比1小。'},
        book:{ko:'감각 규칙: 1보다 작은 수를 곱하면 작아져요. 답을 쓰기 전에 "1보다 큰 수를 곱하나, 작은 수를 곱하나"부터 생각해요!',
              en:'Sense rule: multiplying by a number below 1 shrinks the result. Before writing an answer, ask "am I multiplying by more or less than 1?"',
              zh:'感觉规则：乘小于1的数会变小。写答案前先想"乘的是大于1还是小于1的数？"'} },

      { tag:{ko:'② ×0.01은 두 칸',en:'2) ×0.01 slides two places',zh:'② ×0.01滑两格'},
        head:{ko:'7×0.01 = 0.07: 소수점이 두 칸!',en:'7×0.01 = 0.07: two places this time!',zh:'7×0.01 = 0.07：这次滑两格！'},
        desc:{ko:'0.01은 <b>1을 100으로 나눈 수</b>(1/100)예요. 그래서 ×0.01은 <b>÷100</b>과 같아요: 7×0.01 = 7÷100 = <b>0.07</b>. 소수점 아래 자리가 하나 늘 때마다(0.1→0.01→0.001) 미끄러지는 칸 수도 하나씩 늘어요. 0이 부족하면 <b>빈 자리를 0으로 채워요</b>.',
              en:'0.01 is <b>1 divided by 100</b> (1/100). So ×0.01 equals <b>÷100</b>: 7×0.01 = 7÷100 = <b>0.07</b>. Every extra decimal place (0.1→0.01→0.001) means one more place to slide. If there aren\'t enough digits, <b>fill the gap with zeros</b>.',
              zh:'0.01是<b>1除以100</b>(1/100)。所以×0.01等于<b>÷100</b>：7×0.01 = 7÷100 = <b>0.07</b>。每多一位小数(0.1→0.01→0.001)，滑动的格数就多一格。位数不够就<b>用0补齐</b>。'},
        mathSteps:['7 × 0.01','= 7 ÷ 100','= 0.07'],
        result:{ko:'7×0.01=0.07! 빈 자리는 0으로 채워요.',en:'7×0.01=0.07! Fill empty spots with zeros.',zh:'7×0.01=0.07！空位用0补齐。'},
        book:{ko:'정리표: ×0.1=÷10 | ×0.01=÷100 | ×0.001=÷1000. 소수점 아래 0의 개수만큼 소수점이 왼쪽으로 미끄러져요.',
              en:'Summary: ×0.1=÷10 | ×0.01=÷100 | ×0.001=÷1000. The point slides left one place per zero after the decimal.',
              zh:'汇总表：×0.1=÷10 | ×0.01=÷100 | ×0.001=÷1000。小数点后有几个0，小数点就左滑几格。'} },

      { tag:{ko:'③ 스키 타는 소수점',en:'3) The skiing decimal point',zh:'③ 滑雪的小数点'},
        head:{ko:'몇 칸 미끄러질지만 정하면 끝!',en:'Just count the places, and you\'re done!',zh:'数好格数就完成！'},
        desc:{ko:'소수 곱셈은 결국 <b>소수점 스키</b>예요. ①0.1인지 0.01인지 확인 ②칸 수 정하기: 0.1은 한 칸, 0.01은 두 칸 ③왼쪽으로 미끄러뜨리기! 예: 5.6×0.01 → 두 칸 왼쪽 → 0.056. 빈 칸은 0으로 채워요.',
              en:'Decimal multiplication is really <b>decimal-point skiing</b>. ①Check whether it\'s 0.1 or 0.01 ②Count the places: 0.1 is one, 0.01 is two ③Slide left! E.g. 5.6×0.01 → two places left → 0.056. Fill empty spots with zeros.',
              zh:'小数乘法其实是<b>小数点滑雪</b>。①看清是0.1还是0.01 ②数格数：0.1一格，0.01两格 ③向左滑！例：5.6×0.01→左滑两格→0.056。空位补0。'},
        mathSteps:['5.6 × 0.01',{ko:'왼쪽 두 칸',en:'\\text{left two cells}',zh:'左边两格'},'= 0.056'],
        result:{ko:'칸 수만 세면 끝! 소수점 스키 완성.',en:'Just count the places! Decimal skiing mastered.',zh:'数好格数就行！小数点滑雪完成。'},
        book:null }
    ],
    rule:{ ko:'① ×0.1=÷10, ×0.01=÷100  ② 0의 개수 = 왼쪽으로 미끄러지는 칸 수  ③ 빈 자리는 0으로 채우기',
      en:'① ×0.1=÷10, ×0.01=÷100  ② Number of zeros = places to slide left  ③ Fill empty spots with zeros',
      zh:'① ×0.1=÷10，×0.01=÷100  ② 0的个数=向左滑动的格数  ③ 空位补0' }
  },

  check:{
    fills:[
      { tex:'38 \\times 0.1 = \\square', answer:3.8,
        hint:{ ko:'38÷10=?', en:'38÷10=?', zh:'38÷10=？' } },
      { tex:'6 \\times 0.01 = \\square', answer:0.06,
        hint:{ ko:'6÷100=?', en:'6÷100=?', zh:'6÷100=？' } }
    ],
    open:{ ko:'"곱하면 항상 커진다"가 왜 틀린 말인지 0.1을 예로 들어 설명해 봐요.',
      en:'Using 0.1 as an example, explain why "multiplying always makes bigger" is false.',
      zh:'以0.1为例，解释为什么"乘法总是让数变大"是错的。' },
    openHint:{ ko:'예) 40×0.1=4로 오히려 10배 작아져요. 0.1을 곱한다 = 전체의 10분의 1만 갖는다는 뜻. 1보다 작은 수를 곱하면 언제나 작아져요.',
      en:'e.g. 40×0.1=4 — ten times smaller! Multiplying by 0.1 means taking just one tenth of the whole. Any factor below 1 shrinks the number.',
      zh:'例）40×0.1=4——反而小了10倍！乘0.1意味着只取整体的十分之一。乘任何小于1的数都会变小。' }
  },

  lab:{
    generator:'ml_decimal_mul', level:'main', count:4,
    params:{ mode:'mul' },
    intro:{
      ko:'이번엔 ×0.01 마법! 두 칸 미끄러뜨려봐.',
      en:'Now ×0.01 magic! Slide two places.',
      zh:'现在是×0.01魔法！滑两格。'
    }
  },

  arena:{
    generator:'ml_decimal_mul', level:'main', count:8, timeLimit:300,
    params:{ mode:'mul' },
    rule:{ ko:'5분 안에 소수 곱셈 문제를 모두 풀어요!', en:'Solve all decimal multiplication problems in 5 minutes!', zh:'5分钟内解答所有小数乘法题！' }
  },

  stamp:{ label:{ ko:'소수점 스키어', en:'Decimal Skier', zh:'小数点滑雪者' }, coins:30 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'멋진 활강! 🎿',en:'Nice slide!',zh:'滑得漂亮！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'0.1은 ÷10과 같아!',en:'×0.1 is the same as ÷10!',zh:'×0.1就是÷10！'}, {ko:'0의 개수만큼 미끄러뜨려!',en:'Slide one place per zero!',zh:'有几个0滑几格！'} ],
    finish:{ ko:'완벽해! 소수점 스키어! 🎿✨', en:'Perfect! Decimal Skier!', zh:'完美！小数点滑雪者！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
