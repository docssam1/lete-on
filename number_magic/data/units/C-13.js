/* Numbers of Magic — 유닛 C-13: ×11 마법 (중급 C 챕터5) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['C-13'] = {
  id:'C-13', tier:'intermediate', level:'C', order:13,
  generator:'ml_x11',
  title:{ ko:'×11 마법', en:'The ×11 Magic', zh:'×11魔法' },
  subtitle:{ ko:'27×11: 2와 7을 벌리고 그 사이에 2+7을 넣어요!', en:'27×11: spread 2 and 7 apart and put 2+7 in between!', zh:'27×11：把2和7分开，中间放2+7！' },
  icon:'1️⃣',

  practice:{
    generator:'ml_x11', level:'practice', count:5,
    params:{},
    intro:{
      ko:'11을 곱하는 초스피드 마법이야. 두 자리 수의 앞뒤를 벌리고, 그 사이에 두 숫자의 합을 넣으면 끝! 준비됐지?',
      en:"Super-speed ×11 magic: spread the two digits apart and drop their sum in the middle. Done! Ready?",
      zh:'乘11的超速魔法：把两位数的前后分开，中间放两个数字的和就完成！准备好了吗？'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 사이에 넣기 마법',en:'1) The drop-in-the-middle trick',zh:'① 中间插入魔法'},
        head:{ko:'27×11 = 2 (2+7) 7 = 297',en:'27×11 = 2 (2+7) 7 = 297',zh:'27×11 = 2 (2+7) 7 = 297'},
        desc:{ko:'27×11을 순식간에! ①앞 숫자 2와 뒤 숫자 7을 <b>양옆으로 벌려요</b>: 2□7 ②가운데에 <b>2+7=9</b>를 넣어요: 297. 끝! 27×11=<b>297</b>이에요. 세로셈 없이 덧셈 한 번으로 답이 나오는 마법!',
              en:'27×11 in a flash! ①<b>Spread</b> the 2 and the 7 apart: 2□7 ②Drop <b>2+7=9</b> in the middle: 297. Done! 27×11=<b>297</b>. One little addition instead of column multiplication!',
              zh:'瞬间算出27×11！①把2和7<b>向两边分开</b>：2□7 ②中间放<b>2+7=9</b>：297。完成！27×11=<b>297</b>。不用竖式，一次加法出答案！'},
        mathSteps:['27 × 11','앞:2  가운데:2+7=9  뒤:7','= 297'],
        result:{ko:'27×11=297! 벌리고-더해서-끼우면 끝.',en:'27×11=297! Spread, add, insert — done.',zh:'27×11=297！分开-相加-插入，完成。'},
        book:{ko:'왜 될까? 27×11 = 27×10 + 27 = 270+27. 십의 자리에서 2+7이 만나요. 즉 "사이에 합 넣기"는 ×10과 ×1을 자리 맞춰 더한 것이에요.',
              en:'Why does it work? 27×11 = 27×10 + 27 = 270+27 — the 2 and 7 meet in the tens place. "Dropping the sum in the middle" is just ×10 plus ×1 aligned by place.',
              zh:'为什么行？27×11 = 27×10 + 27 = 270+27——2和7在十位相遇。"中间放和"其实就是×10和×1按位相加。'} },

      { tag:{ko:'② 올림이 있을 때',en:'2) When there\'s a carry',zh:'② 有进位时'},
        head:{ko:'85×11: 8+5=13이면 1을 앞으로!',en:'85×11: if 8+5=13, carry the 1 forward!',zh:'85×11：8+5=13时，1向前进！'},
        desc:{ko:'가운데 합이 <b>10을 넘으면</b> 어떻게 할까요? 85×11: 8+5=13. 가운데엔 3만 넣고 <b>1은 앞 숫자에 올려줘요</b>: 8+1=9 → 935. 확인: 85×11=850+85=935 ✓. 올림 한 번만 조심하면 어떤 수든 OK!',
              en:'What if the middle sum <b>exceeds 10</b>? 85×11: 8+5=13. Keep the 3 in the middle and <b>carry the 1 to the front digit</b>: 8+1=9 → 935. Check: 85×11=850+85=935 ✓. Mind that single carry and any number works!',
              zh:'中间的和<b>超过10</b>怎么办？85×11：8+5=13。中间只放3，<b>1进到前面</b>：8+1=9 → 935。验证：85×11=850+85=935 ✓。注意这一次进位，任何数都行！'},
        mathSteps:['85 × 11','8+5 = 13 → 가운데 3, 올림 1','앞: 8+1=9','= 935'],
        result:{ko:'85×11=935! 합이 두 자리면 1을 앞으로 올려요.',en:'85×11=935! A two-digit sum sends its 1 forward.',zh:'85×11=935！和是两位数时1向前进。'},
        book:{ko:'연습 세트: 45×11=495(올림 없음), 67×11=737(6+7=13, 올림), 99×11=1089(9+9=18, 9+1=10 → 자리가 하나 늘어남!).',
              en:'Practice set: 45×11=495 (no carry), 67×11=737 (6+7=13, carry), 99×11=1089 (9+9=18, then 9+1=10 → an extra digit appears!).',
              zh:'练习组：45×11=495(无进位)，67×11=737(6+7=13，进位)，99×11=1089(9+9=18，9+1=10→多出一位！)。'} },

      { tag:{ko:'③ 11의 비밀',en:'3) The secret of 11',zh:'③ 11的秘密'},
        head:{ko:'11 = 10+1이라서 생기는 마법',en:'The magic comes from 11 = 10+1',zh:'魔法来自11 = 10+1'},
        desc:{ko:'×11 마법의 정체는 분배법칙이에요: a×11 = a×10 + a. 자기 자신을 <b>한 칸 밀어서 자기와 더하는 것</b>! 27이면 270+27 — 세로로 쓰면 왜 가운데에서 2+7이 만나는지 한눈에 보여요. 마법 뒤에는 언제나 수학 원리가 숨어 있답니다.',
              en:'The ×11 trick is really the distributive law: a×11 = a×10 + a — <b>the number shifted one place, added to itself</b>! For 27: 270+27. Written vertically, you can see exactly why 2 and 7 meet in the middle. Behind every trick hides a maths principle.',
              zh:'×11魔法的真面目是分配律：a×11 = a×10 + a——<b>把数错开一位加上自己</b>！27就是270+27。竖着写就能一眼看出为什么2和7在中间相遇。每个魔法背后都藏着数学原理。'},
        mathSteps:['  2 7 0','+   2 7','= 2 9 7'],
        result:{ko:'한 칸 밀어 자기와 더하기 = ×11! 원리를 알면 안 까먹어요.',en:'Shift one place and add itself = ×11! Know the why, never forget.',zh:'错一位加自己 = ×11！懂了原理就忘不了。'},
        book:null }
    ],
    rule:{ ko:'① 앞뒤 숫자 벌리기  ② 두 숫자의 합을 가운데에  ③ 합이 10 이상이면 1을 앞으로 올림',
      en:'① Spread the two digits apart  ② Put their sum in the middle  ③ If the sum ≥ 10, carry the 1 forward',
      zh:'① 前后数字分开  ② 两数之和放中间  ③ 和≥10时1向前进位' }
  },

  check:{
    fills:[
      { tex:'53 \\times 11 = \\square', answer:583,
        hint:{ ko:'5□3, 가운데 5+3=8', en:'5□3, middle 5+3=8', zh:'5□3，中间5+3=8' } },
      { tex:'78 \\times 11 = \\square', answer:858,
        hint:{ ko:'7+8=15 → 가운데 5, 앞 7+1=8', en:'7+8=15 → middle 5, front 7+1=8', zh:'7+8=15→中间5，前面7+1=8' } }
    ],
    open:{ ko:'99×11을 ×11 마법으로 풀어 봐요. 올림이 두 번 생기는 특별한 경우예요!',
      en:'Solve 99×11 with the ×11 magic — a special case with two carries!',
      zh:'用×11魔法算99×11——会出现两次进位的特殊情况！' },
    openHint:{ ko:'예) 9+9=18 → 가운데 8, 올림 1. 앞 9+1=10 → 답이 네 자리가 돼요: 1089. 확인: 990+99=1089.',
      en:'e.g. 9+9=18 → middle 8, carry 1. Front 9+1=10 → the answer grows to four digits: 1089. Check: 990+99=1089.',
      zh:'例）9+9=18→中间8，进1。前面9+1=10→答案变成四位数：1089。验证：990+99=1089。' }
  },

  lab:{
    generator:'ml_x11', level:'main', count:4,
    params:{},
    intro:{
      ko:'×11 마법 시작! 벌리고, 더하고, 끼워봐.',
      en:'×11 magic! Spread, add, insert.',
      zh:'×11魔法开始！分开、相加、插入。'
    }
  },

  arena:{
    generator:'ml_x11', level:'main', count:8, timeLimit:300,
    params:{},
    rule:{ ko:'5분 안에 ×11 문제를 모두 풀어요!', en:'Solve all ×11 problems in 5 minutes!', zh:'5分钟内解答所有×11题！' }
  },

  stamp:{ label:{ ko:'×11 마법사', en:'×11 Wizard', zh:'×11魔法师' }, coins:30 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'번개처럼 빨라! ⚡',en:'Lightning fast!',zh:'快如闪电！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'두 숫자의 합을 가운데에!',en:'Put the digit sum in the middle!',zh:'两数之和放中间！'}, {ko:'합이 10을 넘으면 올림!',en:'Carry if the sum exceeds 10!',zh:'和超过10要进位！'} ],
    finish:{ ko:'완벽해! ×11 마법사! 1️⃣✨', en:'Perfect! ×11 Wizard!', zh:'完美！×11魔法师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
