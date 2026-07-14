/* Numbers of Magic — 유닛 B-01: 두 배 마법 (중급 A 챕터1) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['B-01'] = {
  id:'B-01', tier:'intermediate', level:'B', order:1,
  generator:'ml1_double',
  title:{ ko:'두 배 마법', en:'The Doubling Magic', zh:'翻倍魔法' },
  subtitle:{ ko:'어떤 수든 두 배로! n × 2 = n + n', en:'Double any number! n × 2 = n + n', zh:'任意数翻倍！n × 2 = n + n' },
  icon:'×2️⃣',

  practice:{
    generator:'ml1_double', level:'practice', count:5,
    params:{ op:'x2', max:50 },
    intro:{
      ko:'두 배 마법을 연습해 볼 거야. 내가 수를 보여주면, 그 수의 두 배를 눌러줘. 준비됐지?',
      en:"I'll show you a number — tap its double. Ready?",
      zh:'我会给你看一个数，你按出它的两倍。准备好了吗？'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 두 배란?', en:'1) What is doubling?', zh:'① 什么是翻倍？'},
        head:{ko:'같은 수를 두 번 더해요', en:'Add the same number twice', zh:'把同一个数加两次'},
        desc:{ko:'<b>두 배</b>는 같은 수를 두 번 더하는 것이에요. 4의 두 배는 4를 두 줄로 늘어놓은 것! 한 줄에 4개, 두 줄이면 모두 몇 개일까요?',
              en:'<b>Doubling</b> means adding the same number twice. 4 doubled = 4 in one row + 4 in another row.',
              zh:'<b>翻倍</b>就是把同一个数加两次。4翻倍 = 第一行4个 + 第二行4个。'},
        mathSteps:['4의 두 배', '= 4 + 4', '= 8'],
        result:{ko:'4의 두 배는 8! 2행 배열로 시각화하면 한눈에 보여요.', en:'4 doubled is 8! A 2-row array makes it clear.', zh:'4的两倍是8！用两行排列一目了然。'},
        book:{ko:'두 배(×2)는 같은 수를 두 번 더하는 것과 같아요. n × 2 = n + n. 배열로 그리면 실수 없이 셀 수 있어요.', en:'n × 2 = n + n. Drawing arrays helps avoid mistakes.', zh:'n × 2 = n + n。画成排列图能避免数错。'} },

      { tag:{ko:'② 큰 수도 똑같아요', en:'2) Works for bigger numbers too', zh:'② 大数也一样'},
        head:{ko:'십의 자리와 일의 자리를 따로 두 배 해요', en:'Double the tens and ones separately', zh:'分别对十位和个位翻倍'},
        desc:{ko:'13처럼 두 자리 수도 걱정 없어요. <b>십의 자리와 일의 자리를 따로 두 배</b> 해서 더하면 돼요!',
              en:'For 2-digit numbers like 13, <b>double the tens and ones separately</b>, then add.',
              zh:'像13这样的两位数也没关系，<b>分别对十位和个位翻倍</b>再相加就好。'},
        mathSteps:['13 × 2', '= 10×2 + 3×2', '= 20 + 6 = 26'],
        result:{ko:'13의 두 배는 26! 자릿수별로 나눠 계산하면 쉬워요.', en:'13 doubled is 26! Splitting by place value keeps it easy.', zh:'13的两倍是26！按位分拆计算很简单。'},
        book:{ko:'두 자리 수는 십의 자리와 일의 자리를 각각 두 배 한 뒤 더합니다. 10×2=20, 3×2=6이니 13×2=26.', en:'Double tens (10×2=20) + double ones (3×2=6) = 26.', zh:'十位翻倍(10×2=20) + 个位翻倍(3×2=6) = 26。'} },

      { tag:{ko:'③ 두 배 패턴을 알면 빨라요', en:'3) Know the pattern — go faster!', zh:'③ 掌握规律，速度更快！'},
        head:{ko:'두 배는 항상 짝수가 나와요', en:'Doubling always gives an even number', zh:'翻倍的结果总是偶数'},
        desc:{ko:'신기한 규칙을 발견했나요? 어떤 수든 두 배 하면 <b>항상 짝수</b>가 나와요! 홀수의 두 배도 마찬가지예요. 두 배 결과를 빨리 외우면 암산이 쑥쑥 빨라진답니다!',
              en:'Notice the pattern? Doubling <b>always gives an even number</b> — even for odd numbers! Memorise these to speed up your mental maths.',
              zh:'发现规律了吗？翻倍的结果<b>总是偶数</b>——奇数也不例外！记住这些倍数，心算会越来越快！'},
        mathSteps:['5 × 2 = 10', '7 × 2 = 14', '9 × 2 = 18'],
        result:{ko:'홀수의 두 배도 언제나 짝수! 2, 4, 6, 8, 10… 두 배 수열이 보이나요?', en:'Odd × 2 is always even! 2, 4, 6, 8, 10 … see the sequence?', zh:'奇数×2也总是偶数！2、4、6、8、10……看到规律了吗？'},
        book:null }
    ],
    rule:{ ko:'① 두 배 = 같은 수 + 같은 수  ② 두 자리는 십·일의 자리 따로 두 배  ③ 결과는 항상 짝수', en:'① Double = same + same  ② 2-digit: double tens & ones separately  ③ Result is always even', zh:'① 翻倍 = 同数相加  ② 两位数分位翻倍  ③ 结果总是偶数' }
  },

  check:{
    fills:[
      { tex:'6 \\times 2 = \\square', answer:12,
        hint:{ ko:'6 + 6을 계산해 봐요!', en:'Try 6 + 6!', zh:'试试6 + 6！' } },
      { tex:'14 \\times 2 = \\square', answer:28,
        hint:{ ko:'10×2=20, 4×2=8, 더하면?', en:'10×2=20, 4×2=8, add them!', zh:'10×2=20，4×2=8，加起来是？' } }
    ],
    open:{ ko:'두 배를 이용하면 어떤 때 계산이 편리할까요? 실생활에서 두 배가 나오는 상황을 찾아봐요.', en:'When is doubling useful in real life? Can you think of an example?', zh:'生活中哪些情况会用到翻倍？你能举个例子吗？' },
    openHint:{ ko:'예) 사과가 한 봉지에 7개인데 두 봉지를 사면? 7×2=14개!', en:'e.g. 7 apples per bag, 2 bags → 7×2 = 14 apples!', zh:'例）每袋7个苹果，买2袋 → 7×2 = 14个！' }
  },

  lab:{
    generator:'ml1_double', level:'main', count:4,
    params:{ op:'x2', max:50 },
    intro:{
      ko:'이제 진짜 두 배 마법을 써볼 차례야! 수를 보고 두 배를 구해봐.',
      en:"Time to cast the real doubling spell! Find the double of each number.",
      zh:'是时候施展真正的翻倍魔法了！找出每个数的两倍。'
    }
  },

  arena:{
    generator:'ml1_double', level:'main', count:8, timeLimit:300,
    params:{ op:'x2', max:50 },
    rule:{ ko:'5분 안에 두 배 문제를 모두 풀어요!', en:'Solve all doubling problems in 5 minutes!', zh:'5分钟内解答所有翻倍题！' }
  },

  stamp:{ label:{ ko:'두 배 마법사', en:'Doubling Wizard', zh:'翻倍魔法师' }, coins:25 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'두 배 마법사! 🌟',en:'Doubling wizard!',zh:'翻倍魔法师！'}, {ko:'대단해! 🪄',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'음~ 다시 해볼까?',en:'Hmm, try again?',zh:'嗯，再试一次？'}, {ko:'거의 다 왔어!',en:'Almost!',zh:'就快了！'} ],
    finish:{ ko:'완벽해! 이제 넌 두 배 마법사야 ×2✨', en:"Perfect! You're a Doubling Wizard now!", zh:'完美！你现在是翻倍魔法师啦！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
