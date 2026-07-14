/* Numbers of Magic — 유닛 B-03: 네 배 마법 = 두 배 × 두 배 (중급 A 챕터3) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['B-03'] = {
  id:'B-03', tier:'intermediate', level:'B', order:3,
  generator:'ml1_double',
  title:{ ko:'네 배 마법 = 두 배 × 두 배', en:'Quadrupling = Double the Double', zh:'四倍魔法 = 翻倍再翻倍' },
  subtitle:{ ko:'×4는 ×2를 두 번 하면 돼요!', en:'×4 means doubling twice!', zh:'×4就是翻两次倍！' },
  icon:'⁴⃣',

  practice:{
    generator:'ml1_double', level:'practice', count:5,
    params:{ op:'x2', max:25 },
    intro:{
      ko:'두 배를 두 번 하면 네 배가 돼! 먼저 두 배 감각을 기르는 연습부터 해볼게. 준비됐지?',
      en:"Double twice and you get four times! Let's warm up with doubling first. Ready?",
      zh:'翻两次倍就是四倍！先来热身练习翻倍。准备好了吗？'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① ×4 = ×2 × ×2', en:'1) ×4 = double twice', zh:'① ×4 = 翻倍两次'},
        head:{ko:'두 배를 두 번 하면 네 배!', en:'Double it, then double again — that\'s ×4!', zh:'翻一次倍，再翻一次，就是×4！'},
        desc:{ko:'<b>네 배(×4)</b>를 한 번에 계산하기 어렵다면, <b>두 배를 두 번</b> 하면 돼요! 5×4를 예로 들어볼게요.',
              en:'If ×4 feels tricky, just <b>double twice</b>! Let\'s try 5 × 4.',
              zh:'如果×4太难，就<b>翻两次倍</b>！来试试5 × 4。'},
        mathSteps:['5 × 4', '= (5 × 2) × 2', '= 10 × 2 = 20'],
        result:{ko:'5×4=20! 두 번 두 배 하면 끝! 5→10→20', en:'5×4=20! Double twice: 5 → 10 → 20', zh:'5×4=20！翻两次倍：5 → 10 → 20'},
        book:{ko:'× 4는 두 번 두 배 하는 것과 같아요. 5×4 = (5×2)×2 = 10×2 = 20. 두 단계로 나눠 계산해요.', en:'×4 = double twice. 5×4 = (5×2)×2 = 10×2 = 20. Two steps, easy!', zh:'×4 = 翻倍两次。5×4 = (5×2)×2 = 10×2 = 20。分两步，很简单！'} },

      { tag:{ko:'② ×8 = 두 배 세 번!', en:'2) ×8 = triple doubling!', zh:'② ×8 = 翻三次倍！'},
        head:{ko:'더 나아가면: 8은 두 배의 두 배의 두 배', en:'Going further: 8 = 2 × 2 × 2', zh:'再进一步：8 = 2 × 2 × 2'},
        desc:{ko:'패턴이 보이나요? <b>×8은 두 배를 세 번</b> 하면 돼요! 3×8을 예로 들어볼게요. 3에서 시작해서 두 배씩 세 번!',
              en:'See the pattern? <b>×8 = double three times!</b> Try 3×8: start at 3, double it three times.',
              zh:'发现规律了吗？<b>×8 = 翻倍三次！</b>试试3×8：从3开始，连续翻三次倍。'},
        mathSteps:['3 × 8', '= 3 → ×2 → 6 → ×2 → 12 → ×2 → 24', '= 24'],
        result:{ko:'3×8=24! 3→6→12→24, 두 배 세 번이면 끝!', en:'3×8=24! 3 → 6 → 12 → 24, three doublings!', zh:'3×8=24！3 → 6 → 12 → 24，翻三次倍搞定！'},
        book:{ko:'× 8 = 세 번 두 배. 3×8 = ((3×2)×2)×2 = 6→12→24. 이 원리로 2의 거듭제곱을 모두 계산할 수 있어요.', en:'×8 = triple double. 3×8 = ((3×2)×2)×2 = 6→12→24. Works for any power of 2.', zh:'×8 = 三次翻倍。3×8 = ((3×2)×2)×2 = 6→12→24。对2的所有次幂都适用。'} },

      { tag:{ko:'③ ÷4도 같은 원리', en:'3) ÷4 works the same way', zh:'③ ÷4也是同样的道理'},
        head:{ko:'반으로 두 번 = 4분의 1', en:'Halve twice = divide by 4', zh:'减半两次 = 除以4'},
        desc:{ko:'÷4도 어렵지 않아요! <b>반으로 나누기를 두 번</b> 하면 돼요. 24÷4를 예로 들어볼게요.',
              en:'÷4 is just as easy! <b>Halve it twice</b>. Let\'s try 24 ÷ 4.',
              zh:'÷4也不难！<b>减半两次</b>就行。来试试24 ÷ 4。'},
        mathSteps:['24 ÷ 4', '= 24÷2 ÷2', '= 12 ÷ 2 = 6'],
        result:{ko:'24÷4=6! 24→12→6, 반씩 두 번이면 끝!', en:'24÷4=6! 24 → 12 → 6, halve twice!', zh:'24÷4=6！24 → 12 → 6，减半两次搞定！'},
        book:null }
    ],
    rule:{ ko:'① ×4 = 두 배 두 번  ② ×8 = 두 배 세 번  ③ ÷4 = 반으로 두 번', en:'① ×4 = double twice  ② ×8 = double three times  ③ ÷4 = halve twice', zh:'① ×4 = 翻倍两次  ② ×8 = 翻倍三次  ③ ÷4 = 减半两次' }
  },

  check:{
    fills:[
      { tex:'6 \\times 4 = \\square', answer:24,
        hint:{ ko:'6×2=12, 다시 12×2=?', en:'6×2=12, then 12×2=?', zh:'6×2=12，再12×2=？' } },
      { tex:'7 \\times 4 = \\square', answer:28,
        hint:{ ko:'7×2=14, 다시 14×2=?', en:'7×2=14, then 14×2=?', zh:'7×2=14，再14×2=？' } }
    ],
    open:{ ko:'두 배를 여러 번 반복하면 어떤 수가 나올까요? 1에서 시작해서 두 배씩 10번 해보세요. 얼마나 커지나요?', en:'What happens if you keep doubling? Start at 1 and double 10 times. How big does it get?', zh:'如果一直翻倍会怎样？从1开始翻倍10次，会变得多大？' },
    openHint:{ ko:'예) 1→2→4→8→16→32→64→128→256→512→1024! 엄청 커지죠?', en:'e.g. 1→2→4→8→16→32→64→128→256→512→1024! Huge!', zh:'例）1→2→4→8→16→32→64→128→256→512→1024！变得超大！' }
  },

  lab:{
    generator:'ml1_double', level:'main', count:4,
    params:{ op:'x2', max:25 },
    intro:{
      ko:'두 배를 두 번 해서 네 배를 구해볼까? 차근차근 두 단계로!',
      en:"Let's find ×4 by doubling twice — take it step by step!",
      zh:'通过翻两次倍来求四倍——一步一步来！'
    }
  },

  arena:{
    generator:'ml1_double', level:'main', count:8, timeLimit:300,
    params:{ op:'x2', max:25 },
    rule:{ ko:'5분 안에 네 배 문제를 모두 풀어요!', en:'Solve all ×4 problems in 5 minutes!', zh:'5分钟内解答所有×4题！' }
  },

  stamp:{ label:{ ko:'배수 마법사', en:'Multiplier Wizard', zh:'倍数魔法师' }, coins:25 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'배수 마법사! 🌟',en:'Multiplier wizard!',zh:'倍数魔法师！'}, {ko:'대단해! 🪄',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'음~ 다시 해볼까?',en:'Hmm, try again?',zh:'嗯，再试一次？'}, {ko:'거의 다 왔어!',en:'Almost!',zh:'就快了！'} ],
    finish:{ ko:'완벽해! 이제 넌 배수 마법사야 ×4✨', en:"Perfect! You're a Multiplier Wizard now!", zh:'完美！你现在是倍数魔法师啦！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
