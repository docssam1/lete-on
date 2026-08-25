/* Numbers of Magic — 유닛 M-01: 정수 개념·수직선 (중등 W8 · 중1 정수와 유리수) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-01'] = {
  id:'M-01', tier:'middle1', level:'29', order:1,
  generator:'md1_intConcept',
  title:{ ko:'정수 개념·수직선', en:'Integers & the Number Line', zh:'整数概念与数轴' },
  subtitle:{ ko:'해발과 해저, 득점과 실점 — 0을 기준으로 반대 방향에 이름을 붙여요', en:'Above and below sea level, points scored and lost — naming the two directions from 0', zh:'海拔与海拔以下，得分与失分——给0两侧的方向起名字' },
  icon:'🌋',

  practice:{
    generator:'md1_intConcept', level:'practice', count:5,
    params:{mode:'abs', level:'practice'},
    intro:{
      ko:'절댓값은 원점(0)에서 그 수까지의 거리예요. 부호는 떼고 거리만 재봐!',
      en:'Absolute value is the distance from 0 to a number. Drop the sign and just measure the distance!',
      zh:'绝对值是这个数到原点(0)的距离。去掉符号，只量距离！'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'해발 500m인 산도 있고, 해저 500m인 바다도 있어요. 둘 다 "500"인데 왜 반대일까요?',
        en:'There is a mountain 500m above sea level, and an ocean floor 500m below it. Both are "500" — so why are they opposites?',
        zh:'有座山海拔500米，也有片海底500米深。都是"500"，为什么方向相反？' },
      history:{ ko:'2,000년 전 중국의 『구장산술』은 붉은 산가지(+)와 검은 산가지(−)로 이미 이런 계산을 했어요. 유럽에서는 오랫동안 음수를 "거짓 수"라 부르며 의심했대요 — 지금 낯설게 느껴지는 게 당연해요.',
        en:'2,000 years ago, the Chinese text "The Nine Chapters" already computed with red rods (+) and black rods (−). Europe doubted negative numbers for centuries, calling them "false numbers" — so it is completely normal if they feel strange right now.',
        zh:'2000年前，中国的《九章算术》就已经用红色算筹(+)和黑色算筹(−)来计算了。欧洲曾长期怀疑负数，称它们为"假数"——所以现在觉得陌生是很正常的。' }
    },
    stages:[
      { tag:{ko:'① 0을 기준으로 반대 방향',en:'1) Opposite directions from 0',zh:'① 以0为基准的两个方向'},
        head:{ko:'해발 +500m, 해저 −500m',en:'+500m above sea level, −500m below',zh:'海拔+500米，海底−500米'},
        desc:{ko:'0(해수면)을 기준으로 위로 500m 올라가면 <b>+500</b>, 아래로 500m 내려가면 <b>−500</b>이에요. 두 수는 부호만 다르고 0에서 떨어진 거리(절댓값)는 똑같이 500이에요. 축구에서 3득점은 <b>+3</b>, 3실점은 <b>−3</b>인 것도 같은 원리예요.',
              en:'From 0 (sea level), going up 500m is <b>+500</b>, going down 500m is <b>−500</b>. They differ only in sign — the distance from 0 (absolute value) is the same, 500. Scoring 3 in soccer is <b>+3</b>, conceding 3 is <b>−3</b>, by the same idea.',
              zh:'以0(海平面)为基准，向上500米是<b>+500</b>，向下500米是<b>−500</b>。这两个数只有符号不同，到0的距离(绝对值)都是500。足球里进3球是<b>+3</b>，丢3球是<b>−3</b>，也是同样的道理。'},
        mathSteps:['+500\\,(\\text{해발}) \\;\\; -500\\,(\\text{해저})', '|+500| = 500', '|-500| = 500'],
        result:{ko:'부호는 다르지만 절댓값은 같아요 — 방향만 반대일 뿐이에요!',en:'Different signs, same absolute value — only the direction is opposite!',zh:'符号不同，绝对值相同——只是方向相反！'},
        book:{ko:'양의 정수, 0, 음의 정수를 통틀어 <b>정수</b>라고 해요. 양의 부호 +는 흔히 생략해서 그냥 500이라고 써요.',
              en:'Positive integers, 0, and negative integers together are called <b>integers</b>. The positive sign + is usually omitted, so we just write 500.',
              zh:'正整数、0、负整数合起来叫<b>整数</b>。正号+通常省略，直接写成500。'} },

      { tag:{ko:'② 수직선 — 오른쪽일수록 큰 수',en:'2) The number line — bigger to the right',zh:'② 数轴——越往右越大'},
        head:{ko:'−3 < −1 < 0 < 2',en:'−3 < −1 < 0 < 2',zh:'−3 < −1 < 0 < 2'},
        desc:{ko:'수직선 위에서는 오른쪽으로 갈수록 큰 수예요. 그래서 <b>−1이 −3보다 커요</b> — 마이너스 수는 숫자가 클수록(절댓값이 클수록) 오히려 더 작아요! 두 점 사이의 칸 수를 세면 거리도 알 수 있어요.',
              en:'On the number line, numbers grow bigger to the right. So <b>−1 is greater than −3</b> — for negative numbers, a bigger digit (bigger absolute value) actually means a smaller number! Counting the steps between two points also gives you the distance.',
              zh:'在数轴上，越往右数越大。所以<b>−1比−3大</b>——负数的数字越大(绝对值越大)，这个数反而越小！数一数两点间的格数，也能知道距离。'},
        mathSteps:['-3,\\,-1,\\,0,\\,2', '-3 < -1 < 0 < 2', '|-1 - (-3)| = 2\\,(\\text{칸})'],
        result:{ko:'수직선을 그려보면 대소 비교와 거리가 한눈에 보여요!',en:'Draw the number line and both comparison and distance become obvious!',zh:'画出数轴，大小比较和距离一目了然！'},
        book:{ko:'0을 원점이라 하고, 원점에서 어떤 수까지의 거리를 그 수의 <b>절댓값</b>이라고 해요. 절댓값 기호는 |  |예요.',
              en:'0 is called the origin. The distance from the origin to a number is that number\'s <b>absolute value</b>, written with the symbol |  |.',
              zh:'0叫做原点。从原点到某个数的距离叫做这个数的<b>绝对值</b>，符号是|  |。'} }
    ],
    rule:{ ko:'① 0 기준 반대 방향에 부호로 이름 붙이기  ② 절댓값 = 원점에서 그 수까지 거리  ③ 수직선에서 오른쪽일수록 큰 수',
      en:'① Name opposite directions from 0 with signs  ② Absolute value = distance from the origin  ③ On the number line, bigger to the right',
      zh:'① 以0为基准，用符号给相反方向命名  ② 绝对值＝到原点的距离  ③ 数轴上越往右越大' }
  },

  check:{
    fills:[
      { tex:'|-9| = \\square', answer:9,
        hint:{ ko:'절댓값은 부호를 떼고 거리만!', en:'Absolute value: drop the sign, keep the distance!', zh:'绝对值：去掉符号，只看距离！' } },
      { tex:'\\max(-4,\\,2) = \\square', answer:2,
        hint:{ ko:'수직선에서 더 오른쪽에 있는 수', en:'The number further right on the number line', zh:'数轴上更靠右的那个数' } }
    ],
    open:{ ko:'−7과 3 중 어느 수가 더 크고, 두 수 사이는 수직선에서 몇 칸 떨어져 있을까요?',
      en:'Which is bigger, −7 or 3, and how many steps apart are they on the number line?',
      zh:'−7和3哪个更大？它们在数轴上相距几格？' },
    openHint:{ ko:'3이 더 커요(오른쪽). 거리는 |3-(-7)| = 10칸.',
      en:'3 is bigger (further right). Distance = |3-(-7)| = 10 steps.',
      zh:'3更大(更靠右)。距离＝|3-(-7)|＝10格。' }
  },

  lab:{
    generator:'md1_intConcept', level:'main', count:4,
    params:{mode:'compare'},
    intro:{
      ko:'수직선을 머릿속에 그리면서 더 큰 수를 찾아봐!',
      en:'Picture the number line in your head and find the bigger number!',
      zh:'在脑海里画出数轴，找出更大的数！'
    }
  },

  arena:{
    generator:'md1_intConcept', level:'main', count:8, timeLimit:300,
    params:{mode:'distance'},
    rule:{ ko:'5분 안에 수직선 위 거리 문제를 모두 풀어요!', en:'Solve all number-line distance problems in 5 minutes!', zh:'5分钟内解答所有数轴距离题！' }
  },

  stamp:{ label:{ ko:'정수 탐험가', en:'Integer Explorer', zh:'整数探险家' }, coins:30 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'수직선이 눈에 보이는구나! 🧭',en:'You can see the number line!',zh:'你已经能看见数轴了！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'절댓값은 부호를 떼고 거리만 재는 거야!',en:'Absolute value drops the sign — just measure the distance!',zh:'绝对值要去掉符号，只量距离！'}, {ko:'수직선에서 오른쪽이 더 큰 수야!',en:'On the number line, further right is bigger!',zh:'数轴上越靠右越大！'} ],
    finish:{ ko:'완벽해! 정수 탐험가! 🌋✨', en:'Perfect! Integer Explorer!', zh:'完美！整数探险家！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
