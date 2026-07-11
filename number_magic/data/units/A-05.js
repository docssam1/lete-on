/* ============================================================
   Numbers of Magic — 유닛 데이터: A-05
   초급 B · 챕터1 "100의 보수 찾기"
   창의수연 초급 B 실제 교재 내용 기반. generator=comp100.
   핵심: 25+54+75+46 → (25+75)+(54+46) = 100+100 = 200
   "더해서 100이 되는 짝을 찾아 먼저 더해요!"
   ============================================================ */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['A-05'] = {
  id:'A-05', tier:'beginner', level:'A', order:5,
  generator:'comp100',
  title:{ ko:'100의 보수 찾기', en:'Find Pairs to 100', zh:'找出凑百数' },
  subtitle:{ ko:'더해서 100이 되는 짝을 먼저 묶어요', en:'Group pairs that sum to 100 and add first', zh:'先把凑成100的配对圈起来' },
  icon:'💯',

  practice:{
    generator:'comp100', level:'practice', count:5,
    intro:{
      ko:'준비 운동! 내가 수를 부르면, 더해서 100이 되는 짝꿍을 눌러줘.',
      en:"Warm up! I'll say a number — tap its partner that makes 100.",
      zh:'热热身！我说一个数，你按出凑成100的另一半。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ ko:'① 100의 짝이란?', en:'1) What are 100-pairs?', zh:'① 什么是凑百配对？' },
        head:{ ko:'10의 짝처럼 100의 짝도 있어요!', en:'Just like pairs to 10, there are pairs to 100!', zh:'就像凑十一样，凑百也有配对！' },
        desc:{ ko:'A-01에서 더해서 10이 되는 짝을 배웠어요. 이번엔 더해서 <b>100이 되는 짝</b>이에요. 25와 75, 35와 65처럼요. 이 짝을 먼저 찾아 더하면 계산이 훨씬 쉬워져요!',
               en:'In A-01 you learned pairs to 10. Now it\'s pairs to 100: like 25+75 or 35+65. Find these pairs first and the calculation becomes much easier!',
               zh:'在A-01里学了凑十的配对。这次是凑成100的配对：像25和75、35和65。先找到这些配对，计算就容易多了！' },
        mathSteps:['25 + 75 = 100  (짝!)', '40 + 60 = 100  (짝!)', '63 + 37 = 100  (짝!)'],
        result:{ ko:'두 수를 더했을 때 꼭 100이 되면 "100의 짝"이에요!', en:'Two numbers summing to exactly 100 are a "100-pair"!', zh:'两数之和恰好等于100，就是"凑百配对"！' },
        book:{ ko:'25+75: 십의 자리 2+7=9, 일의 자리 5+5=10 → 올림 → 100. 짝의 일의 자리는 합이 10, 십의 자리는 합이 9(올림 포함)가 돼요.',
               en:'25+75: tens 2+7=9, ones 5+5=10 → carry → 100. Ones must sum to 10, tens to 9 (plus carry).',
               zh:'25+75：十位2+7=9，个位5+5=10→进位→100。个位之和为10，十位之和为9（含进位）。' } },

      { tag:{ ko:'② 짝을 찾아 먼저 더해요', en:'2) Find pairs, add them first', zh:'② 找出配对先相加' },
        head:{ ko:'100의 짝을 먼저 묶으면 계산이 쉬워요', en:'Group 100-pairs first — the rest becomes simple', zh:'先把凑百的配对圈起来，其余的就简单了' },
        desc:{ ko:'여러 수가 섞여 있어도 걱정 없어요. 먼저 더해서 100이 되는 짝을 찾아 묶고, 그 짝들을 먼저 더하면 돼요.',
               en:'Even with many mixed numbers, find the 100-pairs first, group them, and add the pairs first.',
               zh:'即使有很多数混在一起，也先找出凑百的配对圈起来，再先加这些配对。' },
        mathSteps:['25 + 54 + 75 + 46','= (25 + 75) + (54 + 46)  ← 짝끼리!','= 100 + 100','= 200'],
        result:{ ko:'25와 75, 54와 46이 각각 100의 짝! → 100+100 = 200', en:'25+75 and 54+46 are 100-pairs! → 100+100 = 200', zh:'25和75、54和46各是凑百配对！→ 100+100 = 200' },
        book:{ ko:'35+63+65+37 → (35+65)+(63+37) = 100+100 = 200. 짝을 찾으면 덧셈이 마법처럼 쉬워져요!',
               en:'35+63+65+37 → (35+65)+(63+37) = 100+100 = 200. Finding pairs makes addition feel like magic!',
               zh:'35+63+65+37 → (35+65)+(63+37) = 100+100 = 200。找到配对，加法就像魔法一样简单！' } },

      { tag:{ ko:'③ 100이 하나뿐이어도 괜찮아요', en:'3) Even one 100-pair helps!', zh:'③ 只有一组凑百配对也没关系！' },
        head:{ ko:'짝이 한 쌍뿐이어도 먼저 찾아요', en:'Even a single pair is worth finding first', zh:'哪怕只有一组配对，也先找出来' },
        desc:{ ko:'항상 두 쌍이 있지는 않아요. 하나만 찾아도 그 짝을 먼저 더하면 나머지 계산이 훨씬 쉬워져요.',
               en:'There won\'t always be two pairs. Even finding one 100-pair first makes the remaining calculation much easier.',
               zh:'不总是有两组配对。哪怕只找到一组凑百配对，先加它，其余的也会容易很多。' },
        mathSteps:['48 + 52 + 37','= (48 + 52) + 37  ← 짝 먼저!','= 100 + 37','= 137'],
        result:{ ko:'48과 52가 짝 → 100+37 = 137! 훨씬 쉬워요.', en:'48+52 is the pair → 100+37 = 137! So much easier.', zh:'48和52是配对 → 100+37 = 137！容易多了。' },
        book:null }
    ],
    rule:{ ko:'① 더해서 100이 되는 짝을 찾는다  ② 짝을 먼저 더해 100을 만든다  ③ 나머지를 더한다',
      en:'① Find pairs summing to 100  ② Add those pairs first to make 100s  ③ Add the rest.',
      zh:'①找凑成100的配对 ②先加这些配对凑成100 ③再加其余的数。' }
  },

  check:{
    fills:[
      { tex:'25 + 54 + 75 + 46 = (25 + \\square) + (54 + 46)', answer:75,
        hint:{ ko:'25와 짝을 이루어 100이 되는 수는? 25+?=100', en:'What pairs with 25 to make 100? 25+?=100', zh:'25的凑百配对是什么？25+?=100' } },
      { tex:'35 + 63 + 65 + 37 = \\square + \\square', answer:200,
        hint:{ ko:'(35+65)=100, (63+37)=100 → 100+100=?', en:'(35+65)=100 and (63+37)=100 → 100+100=?', zh:'(35+65)=100，(63+37)=100 → 100+100=？' } }
    ],
    open:{
      ko:'100의 짝 찾기 방법을 설명해봐요. 두 자리 수에서 어떤 자리를 먼저 봐야 하나요?',
      en:'Explain how to find 100-pairs. Which digit place should you look at first in a 2-digit number?',
      zh:'说一说怎么找凑百配对。两位数应该先看哪个数位？'
    },
    openHint:{
      ko:'예) 일의 자리가 합해서 10이 되는지 먼저 봐요. 그다음 십의 자리가 합해서 9인지 확인해요(올림 포함 10).',
      en:'e.g. Check if ones sum to 10 first. Then check if tens sum to 9 (making 10 with the carry).',
      zh:'例）先看个位之和是否为10，再看十位之和是否为9（加上进位变成10）。'
    }
  },

  lab:{
    generator:'comp100', level:'main', count:4,
    intro:{
      ko:'이제 진짜 마법! 100의 짝을 찾아 먼저 묶어서 계산해봐요.',
      en:'Real magic time! Find the 100-pairs and group them to calculate.',
      zh:'真正的魔法时刻！找出凑百配对，先圈起来再计算。'
    }
  },

  arena:{
    generator:'comp100', level:'main', count:8, timeLimit:300,
    rule:{ ko:'5분 안에 최대한 많이! 100의 짝을 먼저 찾아요!', en:'As many as you can in 5 minutes — find the 100-pairs first!', zh:'5分钟内尽量多做！先找凑百配对！' }
  },

  stamp:{ label:{ ko:'100 마법사', en:'Century Maker', zh:'凑百魔法师' }, coins:20 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'100 짝 발견! 💯',en:'100-pair found!',zh:'找到凑百配对啦！'}, {ko:'대단해! 🪄',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'음~ 더해서 100이 되는 짝을 찾아봐!',en:'Hmm — look for a pair that sums to 100!',zh:'嗯，找找凑成100的配对！'}, {ko:'거의 다 왔어!',en:'Almost!',zh:'就快了！'} ],
    finish:{ ko:'완벽해! 이제 넌 100 마법사야 💯✨', en:"Perfect! You're a Century Maker now!", zh:'完美！你现在是凑百魔法师啦！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
