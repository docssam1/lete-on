/* Numbers of Magic — 유닛 C-25: 소수 곱·나눗셈 (중급 F 챕터3) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['C-25'] = {
  id:'C-25', tier:'intermediate', level:'C', order:25,
  generator:'ml_decimal_mul',
  title:{ ko:'소수 곱·나눗셈 마법', en:'Decimal ×/÷ Magic', zh:'小数乘除魔法' },
  subtitle:{ ko:'×0.1은 ÷10, ÷0.1은 ×10: 소수점이 미끄러져요!', en:'×0.1 means ÷10, ÷0.1 means ×10: the decimal point slides!', zh:'×0.1就是÷10，÷0.1就是×10：小数点会滑动！' },
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
        book:{ko:'감각 규칙: 1보다 작은 수를 곱하면 작아지고, 1보다 작은 수로 나누면 커져요. 답을 쓰기 전에 "커져야 하나, 작아져야 하나"부터 생각해요!',
              en:'Sense rule: multiplying by a number below 1 shrinks; dividing by one grows. Before writing an answer, ask "should it grow or shrink?"',
              zh:'感觉规则：乘小于1的数变小，除以小于1的数变大。写答案前先想"该变大还是变小？"'} },

      { tag:{ko:'② ÷0.1은 반대로 ×10',en:'2) ÷0.1 flips to ×10',zh:'② ÷0.1反过来是×10'},
        head:{ko:'7÷0.1 = 70: 0.1이 7에 70개!',en:'7÷0.1 = 70: seventy 0.1s fit in 7!',zh:'7÷0.1 = 70：7里有70个0.1！'},
        desc:{ko:'나눗셈은 "몇 개 들어가나?"예요. 7÷0.1은 <b>7 안에 0.1이 몇 개?</b> 1 안에 10개, 7 안에는 <b>70개</b>! 그래서 ÷0.1 = ×10이에요. 소수점이 이번엔 오른쪽으로 미끄러져요. ÷0.01이면 ×100: 7÷0.01 = 700. 곱과 나눗이 소수 세계에선 서로 역할을 바꿔요!',
              en:'Division asks "how many fit?" 7÷0.1 asks <b>how many 0.1s fit in 7?</b> Ten fit in 1, so <b>seventy</b> fit in 7! Hence ÷0.1 = ×10 — the point slides right this time. And ÷0.01 = ×100: 7÷0.01 = 700. In the decimal world, × and ÷ swap roles!',
              zh:'除法问"能装几个？"7÷0.1问<b>7里能装几个0.1？</b>1里装10个，7里装<b>70个</b>！所以÷0.1 = ×10——这次小数点向右滑。÷0.01就是×100：7÷0.01 = 700。在小数世界里，乘和除互换角色！'},
        mathSteps:['7 ÷ 0.1','= 7 × 10','= 70'],
        result:{ko:'7÷0.1=70! 나눴는데 커져요 — 0.1은 1보다 작으니까.',en:'7÷0.1=70! Dividing made it bigger — because 0.1 < 1.',zh:'7÷0.1=70！除了反而变大——因为0.1比1小。'},
        book:{ko:'정리표: ×0.1=÷10 | ×0.01=÷100 | ÷0.1=×10 | ÷0.01=×100. 0의 개수만큼 소수점이 미끄러져요(× → 왼쪽, ÷ → 오른쪽).',
              en:'Summary: ×0.1=÷10 | ×0.01=÷100 | ÷0.1=×10 | ÷0.01=×100. The point slides one place per zero (× → left, ÷ → right).',
              zh:'汇总表：×0.1=÷10 | ×0.01=÷100 | ÷0.1=×10 | ÷0.01=×100。有几个0小数点就滑几格(×→左，÷→右)。'} },

      { tag:{ko:'③ 스키 타는 소수점',en:'3) The skiing decimal point',zh:'③ 滑雪的小数点'},
        head:{ko:'왼쪽? 오른쪽? 방향만 정하면 끝!',en:'Left or right? Decide the direction and you\'re done!',zh:'向左？向右？定好方向就完成！'},
        desc:{ko:'소수 곱·나눗셈은 결국 <b>소수점 스키</b>예요. ①방향 정하기: 작아져야 하면 왼쪽(×0.1, ÷10), 커져야 하면 오른쪽(÷0.1, ×10) ②칸 수 정하기: 0.1은 한 칸, 0.01은 두 칸 ③미끄러뜨리기! 예: 5.6×0.01 → 작아짐, 두 칸 왼쪽 → 0.056. 빈 칸은 0으로 채워요.',
              en:'Decimal ×/÷ is really <b>decimal-point skiing</b>. ①Pick the direction: shrinking → left (×0.1, ÷10); growing → right (÷0.1, ×10) ②Count the places: 0.1 is one, 0.01 is two ③Slide! E.g. 5.6×0.01 → shrinks, two places left → 0.056. Fill empty spots with zeros.',
              zh:'小数乘除其实是<b>小数点滑雪</b>。①定方向：要变小→向左(×0.1、÷10)；要变大→向右(÷0.1、×10) ②数格数：0.1一格，0.01两格 ③滑！例：5.6×0.01→变小，左滑两格→0.056。空位补0。'},
        mathSteps:['5.6 × 0.01','작아짐 → 왼쪽 두 칸','= 0.056'],
        result:{ko:'방향 → 칸 수 → 미끄럼! 소수점 스키 완성.',en:'Direction → places → slide! Decimal skiing mastered.',zh:'方向→格数→滑行！小数点滑雪完成。'},
        book:null }
    ],
    rule:{ ko:'① ×0.1=÷10, ÷0.1=×10  ② 0의 개수 = 미끄러지는 칸 수  ③ 답 쓰기 전 "커질까 작아질까" 확인',
      en:'① ×0.1=÷10, ÷0.1=×10  ② Number of zeros = places to slide  ③ Before answering, ask "grow or shrink?"',
      zh:'① ×0.1=÷10，÷0.1=×10  ② 0的个数=滑动格数  ③ 答题前先问"变大还是变小？"' }
  },

  check:{
    fills:[
      { tex:'38 \\times 0.1 = \\square', answer:3.8,
        hint:{ ko:'38÷10=?', en:'38÷10=?', zh:'38÷10=？' } },
      { tex:'6 \\div 0.01 = \\square', answer:600,
        hint:{ ko:'6×100=?', en:'6×100=?', zh:'6×100=？' } }
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
    params:{ mode:'div' },
    intro:{
      ko:'이번엔 소수 나눗셈! ÷0.1은 ×10이야.',
      en:'Now decimal division! ÷0.1 means ×10.',
      zh:'现在是小数除法！÷0.1就是×10。'
    }
  },

  arena:{
    generator:'ml_decimal_mul', level:'main', count:8, timeLimit:300,
    params:{ mode:'mul' },
    rule:{ ko:'5분 안에 소수 곱·나눗셈 문제를 모두 풀어요!', en:'Solve all decimal problems in 5 minutes!', zh:'5分钟内解答所有小数题！' }
  },

  stamp:{ label:{ ko:'소수점 스키어', en:'Decimal Skier', zh:'小数点滑雪者' }, coins:30 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'멋진 활강! 🎿',en:'Nice slide!',zh:'滑得漂亮！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'커져야 할까, 작아져야 할까?',en:'Should it grow or shrink?',zh:'该变大还是变小？'}, {ko:'0의 개수만큼 미끄러뜨려!',en:'Slide one place per zero!',zh:'有几个0滑几格！'} ],
    finish:{ ko:'완벽해! 소수점 스키어! 🎿✨', en:'Perfect! Decimal Skier!', zh:'完美！小数点滑雪者！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
