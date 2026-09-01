/* Numbers of Magic — 유닛 B-02: 반으로 나누기 (중급 A 챕터2) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['B-02'] = {
  id:'B-02', tier:'intermediate', level:'B', order:2,
  lineage:['halves-doubles'],
  generator:'ml1_double',
  title:{ ko:'반으로 나누기', en:'The Halving Magic', zh:'减半魔法' },
  subtitle:{ ko:'짝수를 둘로 똑같이 나눠요: n ÷ 2', en:'Split any even number in half: n ÷ 2', zh:'把偶数平均分成两份：n ÷ 2' },
  icon:'÷2️⃣',

  practice:{
    generator:'ml1_double', level:'practice', count:5,
    params:{ op:'d2', max:50 },
    intro:{
      ko:'이번엔 반으로 나누기 연습이야. 내가 수를 보여주면, 그 수의 절반을 눌러줘. 준비됐지?',
      en:"Now let's practise halving! I'll show a number — tap its half. Ready?",
      zh:'现在来练习减半！我给你看一个数，你按出它的一半。准备好了吗？'
    }
  },

  discover:{
    story:{
      hook:{ ko:'A4 용지는 297 mm × 210 mm예요. 왜 300 × 200처럼 딱 떨어지게 안 만들었을까요?',
        en:'A4 paper is 297 mm × 210 mm. Why not a tidy 300 × 200?',
        zh:'A4纸是297毫米×210毫米。为什么不做成整齐的300×200呢？' },
      history:{ ko:'반으로 잘라도 모양이 그대로이게 하려고요. 297 × 210을 반으로 자르면 210 × 148.5인데, 가로세로 비가 둘 다 약 1.414로 똑같아요. 그래서 A4를 반 자르면 A5, 또 반 자르면 A6 — 모양이 끝까지 안 변하고 종이도 한 조각 안 버려집니다. 300 × 200이었다면 자를 때마다 모양이 뭉툭해져서 잘라 버려야 했을 거예요.',
        en:'So that halving it keeps the same shape. Cut 297 × 210 in half and you get 210 × 148.5 — both have a side ratio of about 1.414. Halve an A4 and you get A5, halve again for A6, and the shape never changes and no scrap is wasted. With 300 × 200 the shape would go stubby at every cut, and the excess would have to be trimmed off.',
        zh:'为了对折之后形状不变。把297 × 210对折得到210 × 148.5——两者的长宽比都约为1.414。A4对折是A5，再对折是A6，形状始终不变，也不浪费一条边角。若是300 × 200，每切一次形状就变得更方钝，多出来的部分只能裁掉。' }
    },
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 반이란?', en:'1) What is halving?', zh:'① 什么是减半？'},
        head:{ko:'똑같이 두 그룹으로 나눠요', en:'Split into two equal groups', zh:'分成两个相等的组'},
        desc:{ko:'<b>반으로 나누기</b>는 수를 <b>똑같이 두 그룹</b>으로 나누는 거예요. 8개의 사과를 두 친구에게 똑같이 나눠 주면 몇 개씩 받을까요?',
              en:'<b>Halving</b> means splitting into <b>two equal groups</b>. If 8 apples are shared equally between two friends, how many does each get?',
              zh:'<b>减半</b>就是把一个数<b>平均分成两份</b>。8个苹果平均分给两个朋友，每人能得到几个？'},
        mathSteps:['8 ÷ 2', {ko:'= 8을 두 그룹으로',en:'= \\text{8 split into two groups}',zh:'= 把8分成两组'}, '= 4'],
        result:{ko:'8을 반으로 나누면 4! 두 그룹에 각각 4개씩이에요.', en:'Half of 8 is 4! 4 in each group.', zh:'8的一半是4！每组各4个。'},
        book:{ko:'반으로 나누기(÷2)는 수를 두 개의 같은 크기로 가르는 것이에요. 8÷2=4, 두 그룹에 4씩.', en:'÷2 means sharing equally into 2 groups. 8÷2 = 4 per group.', zh:'÷2就是平均分成2组。8÷2 = 每组4个。'} },

      { tag:{ko:'② 두 배의 역!', en:'2) Reverse of doubling!', zh:'② 翻倍的逆运算！'},
        head:{ko:'두 배를 거꾸로 하면 반이 돼요', en:'Reverse a double to get the half', zh:'翻倍反过来就是减半'},
        desc:{ko:'두 배와 반 나누기는 서로 거꾸로예요! 4×2=8을 알면 8÷2=4도 바로 알 수 있어요. <b>두 배 곱셈표</b>를 거꾸로 읽으면 반 나누기 완성!',
              en:'Doubling and halving are <b>opposites</b>! If you know 4×2=8, you instantly know 8÷2=4. Read the doubles table backwards!',
              zh:'翻倍和减半是<b>互逆运算</b>！知道4×2=8，就立刻知道8÷2=4。把翻倍表倒过来读就是减半！'},
        mathSteps:['4 × 2 = 8', {ko:'거꾸로: 8 ÷ 2 = 4',en:'\\text{backwards: } 8 ÷ 2 = 4',zh:'反过来：8 ÷ 2 = 4'}, '14 × 2 = 28 → 28 ÷ 2 = 14'],
        result:{ko:'두 배 짝을 알면 반 나누기도 술술!', en:'Know your doubles → halving is instant!', zh:'记住翻倍，减半手到擒来！'},
        book:{ko:'× 2와 ÷ 2는 역연산 관계. 4×2=8을 외우면 8÷2=4가 자동으로 나와요.', en:'× 2 and ÷ 2 are inverse operations. Doubles facts give halves for free.', zh:'×2与÷2是逆运算。记住翻倍就能免费得到减半的答案。'} },

      { tag:{ko:'③ 큰 짝수도 반으로', en:'3) Halving bigger even numbers', zh:'③ 大偶数也能减半'},
        head:{ko:'자릿수별로 나눠서 반 구하기', en:'Split by place value, then halve each part', zh:'按位分拆后分别减半'},
        desc:{ko:'26 같은 큰 수도 걱정 없어요. <b>십의 자리와 일의 자리를 따로 반으로</b> 나눈 뒤 더하면 돼요!',
              en:'For bigger even numbers like 26, <b>halve the tens and ones separately</b>, then add.',
              zh:'像26这样的大数也没关系，<b>分别对十位和个位减半</b>，再相加。'},
        mathSteps:['26 ÷ 2', '= 20÷2 + 6÷2', '= 10 + 3 = 13'],
        result:{ko:'26의 반은 13! 자릿수별로 나누면 아무리 큰 짝수도 반으로 뚝!', en:'Half of 26 is 13! Place-value splitting works for any even number.', zh:'26的一半是13！按位分拆对任何偶数都有效。'},
        book:null }
    ],
    rule:{ ko:'① 반 = 두 그룹으로 똑같이 나누기  ② ÷2는 ×2의 거꾸로  ③ 두 자리는 십·일의 자리 따로 반으로', en:'① Half = split into 2 equal groups  ② ÷2 reverses ×2  ③ 2-digit: halve tens & ones separately', zh:'① 减半 = 平均分成2份  ② ÷2是×2的逆运算  ③ 两位数分位减半' }
  },

  check:{
    fills:[
      { tex:'12 \\div 2 = \\square', answer:6,
        hint:{ ko:'6 × 2 = 12니까 12 ÷ 2 = ?', en:'6 × 2 = 12, so 12 ÷ 2 = ?', zh:'6 × 2 = 12，所以12 ÷ 2 = ？' } },
      { tex:'36 \\div 2 = \\square', answer:18,
        hint:{ ko:'30÷2=15, 6÷2=3, 더하면?', en:'30÷2=15, 6÷2=3, add them!', zh:'30÷2=15，6÷2=3，加起来是？' } }
    ],
    open:{ ko:'짝수만 딱 나눠지고 홀수는 나눠지지 않는 이유가 뭘까요? 왜 홀수는 반으로 쪼개면 나머지가 생길까요?', en:'Why do only even numbers halve perfectly? What happens when you halve an odd number?', zh:'为什么只有偶数才能整除2？奇数减半会发生什么？' },
    openHint:{ ko:'예) 7은 3과 4로 쪼개지는데, 그럼 7÷2는 정확히 반이 아니에요!', en:'e.g. 7 splits into 3 and 4 — not equal halves!', zh:'例）7分成3和4，不是相等的两半！' }
  },

  lab:{
    generator:'ml1_double', level:'main', count:4,
    params:{ op:'d2', max:50 },
    intro:{
      ko:'이제 반으로 나누기 마법을 써볼 차례야! 수를 보고 정확히 반을 구해봐.',
      en:"Time to cast the halving spell! Find the exact half of each number.",
      zh:'是时候施展减半魔法了！找出每个数的精确一半。'
    }
  },

  arena:{
    generator:'ml1_double', level:'main', count:8, timeLimit:300,
    params:{ op:'d2', max:50 },
    rule:{ ko:'5분 안에 반 나누기 문제를 모두 풀어요!', en:'Solve all halving problems in 5 minutes!', zh:'5分钟内解答所有减半题！' }
  },

  stamp:{ label:{ ko:'반 나누기 마법사', en:'Halving Wizard', zh:'减半魔法师' }, coins:25 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'반 나누기 마법사! 🌟',en:'Halving wizard!',zh:'减半魔法师！'}, {ko:'대단해! 🪄',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'음~ 다시 해볼까?',en:'Hmm, try again?',zh:'嗯，再试一次？'}, {ko:'거의 다 왔어!',en:'Almost!',zh:'就快了！'} ],
    finish:{ ko:'완벽해! 이제 넌 반 나누기 마법사야 ÷2✨', en:"Perfect! You're a Halving Wizard now!", zh:'完美！你现在是减半魔法师啦！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
