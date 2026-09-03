/* Numbers of Magic — 유닛 C-24: 차가 2인 두 수의 곱 (중급 F 챕터2) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['C-24'] = {
  id:'C-24', tier:'intermediate', level:'C', order:24,
  lineage:['rainbow-sum'],
  generator:'ml_diff2sq',
  title:{ ko:'차가 2인 두 수의 곱', en:'Products of Numbers 2 Apart', zh:'相差2的两数之积' },
  subtitle:{ ko:'12×14 = 13²−1: 가운데 수의 제곱에서 1만 빼요!', en:'12×14 = 13²−1: the middle number squared, minus one!', zh:'12×14 = 13²−1：中间数的平方减1！' },
  icon:'👯',

  practice:{
    generator:'ml_diff2sq', level:'practice', count:5,
    params:{},
    intro:{
      ko:'12×14처럼 2 차이 나는 두 수의 곱은, 가운데 수 13의 제곱에서 1만 빼면 돼. 신기하지? 준비됐지?',
      en:"For numbers 2 apart like 12×14, just square the middle number 13 and subtract 1. Neat, right? Ready?",
      zh:'像12×14这样相差2的两数之积，只要中间数13的平方减1。神奇吧？准备好了吗？'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 가운데 수의 비밀',en:'1) The middle number\'s secret',zh:'① 中间数的秘密'},
        head:{ko:'12×14 = 13² − 1 = 168',en:'12×14 = 13² − 1 = 168',zh:'12×14 = 13² − 1 = 168'},
        desc:{ko:'12와 14 사이엔 <b>가운데 수 13</b>이 있어요. 놀랍게도 12×14는 <b>13²에서 딱 1 작아요</b>! 13²=169, 그래서 12×14=<b>168</b>. 두 수가 2 차이면 언제나: 가운데 수를 제곱하고 1을 빼면 끝. 제곱수를 외워두면(11²=121, 12²=144, 13²=169…) 순식간이에요!',
              en:'Between 12 and 14 sits <b>the middle number 13</b>. Amazingly, 12×14 is <b>exactly 1 less than 13²</b>! 13²=169, so 12×14=<b>168</b>. Whenever two numbers are 2 apart: square the middle, subtract 1. Knowing your squares (11²=121, 12²=144, 13²=169…) makes it instant!',
              zh:'12和14之间有<b>中间数13</b>。神奇的是，12×14<b>恰好比13²小1</b>！13²=169，所以12×14=<b>168</b>。只要两数相差2：中间数平方减1即可。记住平方数(11²=121，12²=144，13²=169…)就能瞬间算出！'},
        mathSteps:['12 × 14',{ko:'가운데 수 = 13',en:'\\text{middle number} = 13',zh:'中间数 = 13'},'13² = 169','169 − 1 = 168'],
        result:{ko:'12×14=168! 가운데 수 제곱 − 1.',en:'12×14=168! Middle squared, minus 1.',zh:'12×14=168！中间数平方减1。'},
        book:{ko:'공식: (n−1)(n+1) = n²−1. "합차 공식"이라 불리는 유명한 항등식의 가장 간단한 모습이에요.',
              en:'Formula: (n−1)(n+1) = n²−1 — the simplest form of the famous difference-of-squares identity.',
              zh:'公式：(n−1)(n+1) = n²−1——著名的平方差公式最简单的形态。'} },

      { tag:{ko:'② 왜 딱 1 작을까?',en:'2) Why exactly 1 less?',zh:'② 为什么恰好小1？'},
        head:{ko:'한 줄 옮기기 그림으로 확인!',en:'See it by moving one row!',zh:'移一行就看明白！'},
        desc:{ko:'13×13 정사각형 타일을 상상해요. 한 줄(13개)을 떼서 옆에 붙이면 <b>12×14 직사각형 + 남는 타일 1개</b>가 돼요! 정사각형에서 줄 하나를 옮기면 가로는 1 줄고 세로는 1 늘어나는데, 모퉁이 1칸이 남죠. 그래서 12×14 = 13²−1. 그림 한 장이 공식을 증명해요!',
              en:'Picture a 13×13 square of tiles. Peel off one row (13 tiles) and stick it on the side: you get a <b>12×14 rectangle plus 1 leftover tile</b>! Moving a row shrinks one side by 1 and grows the other by 1, leaving one corner tile over. Hence 12×14 = 13²−1. One picture proves the formula!',
              zh:'想象13×13的方块瓷砖。撕下一行(13块)贴到旁边：得到<b>12×14的长方形+多出的1块</b>！移动一行使一边减1、另一边加1，角上剩1块。所以12×14 = 13²−1。一张图证明了公式！'},
        mathSteps:[{ko:'13×13 정사각형',en:'13×13 \\text{ square}',zh:'13×13的正方形'},{ko:'한 줄을 옆으로 이동',en:'\\text{move one row to the side}',zh:'把一行移到旁边'},'= 12×14 + 1','∴ 12×14 = 169−1'],
        result:{ko:'정사각형 − 모퉁이 1칸 = 직사각형! 그림이 증명이에요.',en:'Square minus one corner tile = rectangle! The picture is the proof.',zh:'正方形减角上1块=长方形！图就是证明。'},
        book:{ko:'대수로도: (n−1)(n+1) = n²+n−n−1 = n²−1. 풀풀곱셈(C-10)으로 펼치면 가운데 항 +n과 −n이 서로 지워져요.',
              en:'Algebraically: (n−1)(n+1) = n²+n−n−1 = n²−1. Expanding full-full style (C-10), the middle terms +n and −n cancel.',
              zh:'代数上：(n−1)(n+1) = n²+n−n−1 = n²−1。用全全乘法(C-10)展开，中间项+n和−n互相抵消。'} },

      { tag:{ko:'③ 제곱수 무기고',en:'3) Your arsenal of squares',zh:'③ 平方数武器库'},
        head:{ko:'제곱수를 알면 이웃 곱이 공짜!',en:'Know a square, get its neighbours free!',zh:'会平方数，相邻乘积免费送！'},
        desc:{ko:'제곱수 하나를 외우면 <b>이웃한 곱 하나가 공짜</b>예요! 15²=225를 알면 → 14×16=224. 20²=400 → 19×21=399. 25²=625 → 24×26=624. 반대로도 써요: 19×21 같은 문제를 보면 "가운데 수 20!"이 바로 떠올라야 해요. 11²~20²을 무기고에 채워 넣어요!',
              en:'Memorise one square and <b>get a neighbouring product free</b>! Know 15²=225 → 14×16=224. 20²=400 → 19×21=399. 25²=625 → 24×26=624. Use it in reverse too: seeing 19×21 should instantly whisper "middle number 20!" Stock your arsenal with 11² through 20²!',
              zh:'记住一个平方数，<b>免费得到一个相邻乘积</b>！知道15²=225→14×16=224。20²=400→19×21=399。25²=625→24×26=624。反过来也一样：看到19×21要立刻想到"中间数20！"把11²~20²装进武器库！'},
        mathSteps:['15²=225 → 14×16=224','20²=400 → 19×21=399','25²=625 → 24×26=624'],
        result:{ko:'제곱수 하나 = 곱셈 하나 공짜! 11²~20²을 외워요.',en:'One square = one free product! Learn 11²–20².',zh:'一个平方数=一个免费乘积！记住11²~20²。'},
        book:{ko:'고급 과정에서는 "차가 2"라는 제한을 풀어요: 기준수와 차이가 얼마든, 심지어 평균을 직접 구해서든 같은 평균²−차² 마법이 통해요.',
              en:'The advanced course drops the "2 apart" limit — any anchor, any gap (even one you compute as an average yourself) still obeys the same average²−gap² magic.',
              zh:'高级课程会打破"相差2"的限制——不管基准数和差是多少，甚至自己求出平均值，同样的平均²−差²魔法都成立。'} }
    ],
    rule:{ ko:'① 두 수의 차가 2인지 확인  ② 가운데 수의 제곱 구하기  ③ 1 빼면 답',
      en:'① Check the two numbers are 2 apart  ② Square the middle number  ③ Subtract 1',
      zh:'① 确认两数相差2  ② 求中间数的平方  ③ 减1即答案' }
  },

  check:{
    fills:[
      { tex:'9 \\times 11 = \\square', answer:99,
        hint:{ ko:'가운데 10, 10²−1=?', en:'Middle 10, 10²−1=?', zh:'中间数10，10²−1=？' } },
      { tex:'14 \\times 16 = \\square', answer:224,
        hint:{ ko:'가운데 15, 15²=225, −1=?', en:'Middle 15, 15²=225, −1=?', zh:'中间数15，15²=225，−1=？' } }
    ],
    open:{ ko:'19×21을 이 마법으로 풀고, 타일 그림으로 왜 1이 남는지 설명해 봐요.',
      en:'Solve 19×21 with this magic, and use the tile picture to explain the leftover 1.',
      zh:'用这个魔法算19×21，并用瓷砖图解释为什么会剩1。' },
    openHint:{ ko:'예) 가운데 수 20, 20²=400, 400−1=399. 20×20 정사각형에서 한 줄(20개)을 옮기면 19×21이 되는데 모퉁이 1칸이 남아요 — 그래서 1 작아요.',
      en:'e.g. Middle 20, 20²=400, so 399. Moving one row of a 20×20 square makes 19×21 with one corner tile left over — hence 1 less.',
      zh:'例）中间数20，20²=400，400−1=399。把20×20正方形的一行移过去变成19×21，角上剩1块——所以小1。' }
  },

  lab:{
    generator:'ml_diff2sq', level:'main', count:4,
    params:{},
    intro:{
      ko:'차가 2인 곱 마법! 가운데 수를 찾아 제곱해봐.',
      en:'Two-apart magic! Find the middle number and square it.',
      zh:'相差2魔法！找中间数求平方。'
    }
  },

  arena:{
    generator:'ml_diff2sq', level:'main', count:8, timeLimit:300,
    params:{},
    rule:{ ko:'5분 안에 차가 2인 곱 문제를 모두 풀어요!', en:'Solve all two-apart problems in 5 minutes!', zh:'5分钟内解答所有相差2乘积题！' }
  },

  stamp:{ label:{ ko:'제곱−1 마법사', en:'Square-Minus-One Wizard', zh:'平方减一魔法师' }, coins:30 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'쌍둥이 곱 성공! 👯',en:'Twin product!',zh:'双子乘积成功！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'가운데 수를 먼저 찾아봐!',en:'Find the middle number first!',zh:'先找中间数！'}, {ko:'제곱에서 1을 빼는 거야!',en:'Square it, then subtract 1!',zh:'平方后减1！'} ],
    finish:{ ko:'완벽해! 제곱−1 마법사! 👯✨', en:'Perfect! Square-Minus-One Wizard!', zh:'完美！平方减一魔法师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
