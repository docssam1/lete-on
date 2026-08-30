/* ============================================================
   Numbers of Magic — 유닛 데이터: A-15
   초급 D · 챕터3 "수를 풀어서 쓰기"
   창의수연 초급 D 실제 교재 내용 기반. generator=expandRewrite.
   핵심: 87-59 = 90-3-60+1 = 30-3+1 = 28
   "두 수를 모두 몇십으로 올려 쓰고, 올린 만큼 보정해요!"
   ============================================================ */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['A-15'] = {
  id:'A-15', tier:'beginner', level:'A', order:15,
  generator:'expandRewrite',
  title:{ ko:'수를 풀어서 쓰기', en:'Rewrite Numbers as Tens', zh:'把数字拆开写' },
  subtitle:{ ko:'두 수를 모두 몇십으로 올려 쓰고 보정해요', en:'Round both numbers up to a ten, then adjust', zh:'把两个数都凑成整十再修正' },
  icon:'📝',

  practice:{
    generator:'expandRewrite', level:'practice', count:5,
    intro:{
      ko:'준비 운동! 다음 몇십보다 얼마나 작은지 맞혀봐.',
      en:"Warm up! Figure out how much less a number is than the next ten.",
      zh:'热热身！算算比下一个整十小多少。'
    }
  },

  discover:{
    story:{
      hook:{ ko:'= 라는 기호는 왜 하필 나란한 선 두 개일까요?',
        en:'Why is the equals sign two parallel lines, of all things?',
        zh:'等号为什么偏偏是两条平行线？' },
      history:{ ko:'1557년 영국의 레코드가 처음 쓰면서 이렇게 말했어요 — 나란한 두 선보다 더 같은 것은 없으니까. 그때 기호는 지금보다 옆으로 훨씬 길었답니다. 그 전까지는 같다는 말을 매번 글로 풀어 썼어요. 수를 풀어서 쓸 때 =로 이어 가는 것도 그 덕분이죠.',
        en:'Robert Recorde introduced it in 1557 with a simple reason: no two things can be more equal than a pair of parallel lines. His version was much longer than ours. Before that, people wrote the word equals out in full every time. Every chain of = we write when expanding a number rests on his idea.',
        zh:'1557年英国人雷科德第一次使用它，理由很简单——没有什么比两条平行线更相等了。他写的符号比现在长得多。在那之前，人们每次都要把相等两个字写出来。我们把数展开时用=一路连下去，靠的正是他的这个主意。' }
    },
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ ko:'① 두 수를 모두 몇십으로 올려요', en:'1) Round both numbers up', zh:'① 把两个数都凑成整十' },
        head:{ ko:'87은 90보다 3 작은 수예요', en:'87 is 3 less than 90', zh:'87比90小3' },
        desc:{ ko:'87-59처럼 받아내림이 헷갈리는 뺄셈은, 두 수를 모두 가까운 몇십으로 올려 써요. 87=90-3, 59=60-1이에요.',
               en:'For tricky subtraction like 87-59, rewrite both numbers as the nearest ten above minus a small amount: 87=90-3, 59=60-1.',
               zh:'像87-59这样容易搞混的减法，把两个数都写成最近的整十减去一点：87=90-3，59=60-1。' },
        mathSteps:['87 - 59','= (90-3) - (60-1)',{ko:'= 90 - 3 - 60 + 1  ← 부호 조심!',en:'= 90 - 3 - 60 + 1 ← \\text{watch the signs!}',zh:'= 90 - 3 - 60 + 1 ← 注意符号！'},'= 30 - 3 + 1','= 28'],
        result:{ ko:'빼는 수의 보정(-1)은 부호가 바뀌어 더하기가 돼요!', en:"The subtrahend's adjustment (-1) flips sign to become addition!", zh:'减数的修正(-1)符号会翻转变成加法！' },
        book:{ ko:'67-49: 67=70-3, 49=50-1 → 70-3-50+1 = 20-3+1 = 18.',
               en:'67-49: 67=70-3, 49=50-1 → 70-3-50+1 = 20-3+1 = 18.',
               zh:'67-49：67=70-3，49=50-1 → 70-3-50+1 = 20-3+1 = 18。' } },

      { tag:{ ko:'② 몇십끼리 먼저, 보정은 나중에', en:'2) Tens first, adjustments last', zh:'② 先算整十，修正放最后' },
        head:{ ko:'몇십 - 몇십을 먼저 계산해요', en:'Calculate the tens-minus-tens first', zh:'先算整十减整十' },
        desc:{ ko:'90-60처럼 몇십끼리는 암산하기 쉬워요. 그 다음 두 보정 값(-3과 +1)을 순서대로 적용하면 끝이에요.',
               en:'90-60 (tens minus tens) is easy mental math. Then just apply the two adjustments (-3 and +1) in order.',
               zh:'90-60这样整十减整十很容易心算。然后依次应用两个修正值(-3和+1)即可。' },
        mathSteps:['47 - 39','= (50-3) - (40-1)','= 50 - 40 - 3 + 1','= 10 - 3 + 1','= 8'],
        result:{ ko:'47-39 = 50-40-3+1 = 10-3+1 = 8', en:'47-39 = 50-40-3+1 = 10-3+1 = 8', zh:'47-39 = 50-40-3+1 = 10-3+1 = 8' },
        book:null }
    ],
    rule:{ ko:'① 두 수를 각각 (몇십)-(보정값)으로 쓴다  ② 몇십끼리 먼저 뺀다  ③ 보정값을 부호에 맞게 더하고 뺀다',
      en:'① Rewrite both numbers as (ten) minus (adjustment)  ② Subtract the tens first  ③ Apply the adjustments with correct signs',
      zh:'①把两数各写成(整十)-(修正值) ②先减整十 ③按符号加减修正值' }
  },

  check:{
    fills:[
      { tex:'87 - 59 = 90 - 3 - 60 + \\square', answer:1,
        hint:{ ko:'59는 60보다 얼마나 작은가요?', en:'How much less than 60 is 59?', zh:'59比60小多少？' } },
      { tex:'47 - 39 = 10 - 3 + \\square', answer:1,
        hint:{ ko:'39는 40보다 얼마나 작은가요?', en:'How much less than 40 is 39?', zh:'39比40小多少？' } }
    ],
    open:{
      ko:'87-59를 계산할 때 -59가 -60+1로 바뀌는 이유를 설명해봐요.',
      en:'Explain why -59 becomes -60+1 when computing 87-59.',
      zh:'说说为什么算87-59时，-59会变成-60+1。'
    },
    openHint:{
      ko:'예) 59는 60보다 1 작은 수라서, 59를 빼는 건 60을 뺀 다음 1을 다시 더해주는 것과 같아요.',
      en:'e.g. Since 59 is 1 less than 60, subtracting 59 is the same as subtracting 60 and then adding 1 back.',
      zh:'例）因为59比60小1，减59就相当于减60后再加回1。'
    }
  },

  lab:{
    generator:'expandRewrite', level:'main', count:4,
    intro:{
      ko:'이제 진짜 마법! 두 수를 몇십으로 풀어서 계산해봐요.',
      en:'Real magic time! Rewrite both numbers as tens to calculate.',
      zh:'真正的魔法时刻！把两数拆成整十来计算。'
    }
  },

  arena:{
    generator:'expandRewrite', level:'main', count:8, timeLimit:300,
    rule:{ ko:'5분 안에 최대한 많이! 몇십으로 풀어서 써요!', en:'As many as you can in 5 minutes — rewrite as tens!', zh:'5分钟内尽量多做！拆成整十！' }
  },

  stamp:{ label:{ ko:'수 풀어쓰기 마법사', en:'Number-Rewriter', zh:'拆数魔法师' }, coins:20 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'보정까지 완벽해! 📝',en:'Adjusted perfectly!',zh:'修正得很完美！'}, {ko:'대단해! 🪄',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'음~ 두 수를 몇십으로 먼저 써봐!',en:'Hmm — try rewriting both numbers as tens first!',zh:'嗯，试试先把两数写成整十！'}, {ko:'거의 다 왔어!',en:'Almost!',zh:'就快了！'} ],
    finish:{ ko:'완벽해! 이제 넌 수 풀어쓰기 마법사야 📝✨', en:"Perfect! You're a Number-Rewriter now!", zh:'完美！你现在是拆数魔法师啦！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
