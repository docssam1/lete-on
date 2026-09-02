/* ============================================================
   Numbers of Magic — 유닛 데이터: A-06
   초급 B · 챕터2 "더해서 10이 되는 수를 찾아라 2"
   창의수연 초급 B 실제 교재 내용 기반. generator=pair10_2d.
   핵심: 13+86+67+24 → 일의 자리 3+7=10(13,67 짝), 6+4=10(86,24 짝) → 190
   "두 자리 수도 일의 자리만 보면 짝을 찾을 수 있어요!"
   ============================================================ */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['A-06'] = {
  id:'A-06', tier:'beginner', level:'A', order:6,
  generator:'pair10_2d',
  title:{ ko:'두 자리도 짝꿍 찾기', en:'Two-Digit Pairs to 10', zh:'两位数也找凑十配对' },
  subtitle:{ ko:'두 자리 수에서 일의 자리끼리 짝꿍을 찾아요', en:'Look at ones digits to find pairs that make 10', zh:'看两位数的个位，找出凑成10的配对' },
  icon:'🔢',

  practice:{
    generator:'pair10_2d', level:'practice', count:5,
    intro:{
      ko:'준비 운동! 일의 자리를 보고 짝꿍이 되는 일의 자리를 맞혀봐요.',
      en:"Warm up! Look at the ones digit and find its partner that makes 10.",
      zh:'热热身！看个位数，找出凑成10的另一半。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ ko:'① 두 자리 수도 일의 자리가 열쇠', en:'1) Ones digit is the key for 2-digit numbers too', zh:'① 两位数个位才是关键' },
        head:{ ko:'일의 자리만 보면 짝을 찾을 수 있어요', en:'Just look at the ones digit to find the pair', zh:'只看个位就能找到配对' },
        desc:{ ko:'A-01에서 한 자리 수의 짝을 배웠어요. 두 자리 수도 <b>일의 자리만 보면</b> 짝을 찾을 수 있어요! 13에서 일의 자리는 3이고, 67에서 일의 자리는 7이에요. 3+7=10이니까 짝꿍이에요!',
               en:'In A-01 you found pairs with single digits. For 2-digit numbers, just look at the ones place! The ones of 13 is 3, and the ones of 67 is 7. Since 3+7=10, they\'re a pair!',
               zh:'在A-01里学了一位数的配对。两位数也只看个位就行！13的个位是3，67的个位是7。因为3+7=10，所以它们是配对！' },
        mathSteps:[{ko:'13 → 일의 자리: 3',en:'13 → \\text{ones digit: } 3',zh:'13 → 个位：3'}, {ko:'67 → 일의 자리: 7',en:'67 → \\text{ones digit: } 7',zh:'67 → 个位：7'}, {ko:'3 + 7 = 10 → 짝꿍!',en:'3 + 7 = 10 → \\text{partners!}',zh:'3 + 7 = 10 → 是一对！'}],
        result:{ ko:'13과 67은 일의 자리가 3과 7 → 3+7=10이라서 짝꿍이에요!', en:'13 and 67 have ones 3 and 7 → 3+7=10 so they\'re a pair!', zh:'13和67的个位分别是3和7 → 3+7=10，所以它们是配对！' },
        book:{ ko:'두 자리 수는 십의 자리는 잠깐 무시하고, 일의 자리만 봐서 짝을 찾아요. 짝이 되면 그 두 수를 먼저 더해요.',
               en:'For 2-digit numbers, ignore the tens for now — just pair the ones. Once paired, add those two numbers first.',
               zh:'对于两位数，暂时忽略十位，只看个位来配对。找到配对后，先把这两个数加起来。' } },

      { tag:{ ko:'② 짝꿍 두 쌍 찾기', en:'2) Finding two pairs', zh:'② 找出两组配对' },
        head:{ ko:'짝꿍을 모두 찾아 먼저 더해요', en:'Find all pairs and add them first', zh:'找出所有配对先相加' },
        desc:{ ko:'네 수가 있을 때 짝꿍 두 쌍을 동시에 찾을 수 있어요. 각 수의 일의 자리를 확인하고, 합이 10이 되는 쌍을 모두 찾아요.',
               en:'With four numbers you can find two pairs at once. Check each ones digit and find all pairs that sum to 10.',
               zh:'四个数里可以同时找到两组配对。检查每个数的个位，找出所有个位之和为10的配对。' },
        mathSteps:['13 + 86 + 67 + 24',{ko:'일의 자리: 3, 6, 7, 4',en:'\\text{ones digits: } 3, 6, 7, 4',zh:'个位：3, 6, 7, 4'},{ko:'3+7=10 (13과 67 짝!), 6+4=10 (86과 24 짝!)',en:'3+7=10 \\text{ (13 \\& 67 pair!)}, 6+4=10 \\text{ (86 \\& 24 pair!)}',zh:'3+7=10（13和67凑对！），6+4=10（86和24凑对！）'},'= (13 + 67) + (86 + 24)','= 80 + 110 = 190'],
        result:{ ko:'13+86+67+24 = 190! 일의 자리만 보고 짝을 찾으니 쉬워요.', en:'13+86+67+24 = 190! Easy when you just check the ones digits.', zh:'13+86+67+24 = 190！只看个位找配对，超简单！' },
        book:{ ko:'22+35+78+65 → 일의 자리 2+8=10(22,78 짝), 5+5=10(35,65 짝) → (22+78)+(35+65) = 100+100 = 200.',
               en:'22+35+78+65 → ones 2+8=10 (22,78 pair), 5+5=10 (35,65 pair) → (22+78)+(35+65) = 100+100 = 200.',
               zh:'22+35+78+65 → 个位2+8=10(22,78配对)，5+5=10(35,65配对) → (22+78)+(35+65) = 100+100 = 200。' } },

      { tag:{ ko:'③ 실전 연습', en:'3) Practice in action', zh:'③ 实战练习' },
        head:{ ko:'일의 자리 먼저 → 짝 찾기 → 먼저 더하기', en:'Ones first → find pairs → add pairs first', zh:'先看个位 → 找配对 → 先加配对' },
        desc:{ ko:'이제 직접 해봐요! 수들을 보면 제일 먼저 일의 자리를 확인하고 합이 10이 되는 짝을 찾아요. 그 짝을 먼저 더하면 나머지 계산이 훨씬 쉬워진답니다.',
               en:"Now let's try! First check the ones digits of each number, find pairs that sum to 10, then add those pairs first. The rest becomes much easier!",
               zh:'现在自己来！先检查每个数的个位，找出凑成10的配对，先加这些配对，其余就简单了！' },
        mathSteps:['45 + 31 + 55 + 69',{ko:'일의 자리: 5+5=10 (45,55 짝), 1+9=10 (31,69 짝)',en:'\\text{ones: } 5+5=10 \\text{ (45,55 pair)}, 1+9=10 \\text{ (31,69 pair)}',zh:'个位：5+5=10（45,55凑对），1+9=10（31,69凑对）'},'= (45+55)+(31+69)','= 100+100 = 200'],
        result:{ ko:'45+31+55+69 = 200! 짝 찾기로 순식간에 풀었어요!', en:'45+31+55+69 = 200! Solved in a flash by finding pairs!', zh:'45+31+55+69 = 200！找配对，一瞬间就解出来了！' },
        book:null }
    ],
    rule:{ ko:'① 각 수의 일의 자리를 확인한다  ② 일의 자리 합이 10이 되는 짝을 찾는다  ③ 짝을 먼저 더한다',
      en:'① Check each ones digit  ② Find pairs where ones sum to 10  ③ Add those pairs first.',
      zh:'①检查每个数的个位 ②找个位之和为10的配对 ③先加这些配对。' }
  },

  check:{
    fills:[
      { tex:'13 + 86 + 67 + 24 = (13 + \\square) + (86 + 24)', answer:67,
        hint:{ ko:'13의 일의 자리는 3. 3과 짝이 되는 일의 자리는 7(3+7=10). 일의 자리가 7인 수는?', en:'Ones of 13 is 3. Pair ones: 3+7=10. Which number has ones digit 7?', zh:'13的个位是3。配对个位：3+7=10。哪个数的个位是7？' } },
      { tex:'22 + 35 + 78 + 65 = \\square + \\square', answer:200,
        hint:{ ko:'일의 자리: 2+8=10(22,78 짝), 5+5=10(35,65 짝) → 100+100=?', en:'Ones: 2+8=10 (22,78 pair), 5+5=10 (35,65 pair) → 100+100=?', zh:'个位：2+8=10(22,78配对)，5+5=10(35,65配对) → 100+100=？' } }
    ],
    open:{
      ko:'일의 자리가 5인 수가 세 개 있으면 어떻게 하면 좋을까요? (예: 15+25+35)',
      en:'What if there are three numbers with ones digit 5? (e.g. 15+25+35)',
      zh:'如果有三个个位是5的数怎么办？（例如15+25+35）'
    },
    openHint:{
      ko:'예) 5+5=10이니까 두 개를 먼저 묶고, 나머지 하나는 따로 더해요. 15+25+35 = (15+25)+35 = 40+35 = 75.',
      en:'e.g. 5+5=10 so pair two of them, then add the third separately. 15+25+35 = (15+25)+35 = 40+35 = 75.',
      zh:'例）5+5=10，先把两个配对，再单独加第三个。15+25+35 = (15+25)+35 = 40+35 = 75。'
    }
  },

  lab:{
    generator:'pair10_2d', level:'main', count:4,
    intro:{
      ko:'이제 진짜 마법! 두 자리 수에서 일의 자리 짝꿍을 찾아 먼저 더해봐요.',
      en:"Real magic! Find the ones-pairs in two-digit numbers and add them first.",
      zh:'真正的魔法！在两位数里找出个位配对，先加它们。'
    }
  },

  arena:{
    generator:'pair10_2d', level:'main', count:8, timeLimit:300,
    rule:{ ko:'5분 안에 최대한 많이! 일의 자리 짝꿍을 빠르게 찾아요!', en:'As many as you can in 5 minutes — find those ones-pairs fast!', zh:'5分钟内尽量多做！快速找出个位配对！' }
  },

  stamp:{ label:{ ko:'짝꿍 탐정', en:'Pair Detective', zh:'配对侦探' }, coins:20 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'짝꿍 발견! 🔢',en:'Pair found!',zh:'找到配对啦！'}, {ko:'일의 자리 마법 성공! 🪄',en:'Ones magic works!',zh:'个位魔法成功！'} ],
    wrong:[ {ko:'음~ 각 수의 일의 자리를 다시 봐봐!',en:'Hmm — check the ones digit of each number again!',zh:'嗯，再看看每个数的个位！'}, {ko:'거의 다 왔어!',en:'Almost!',zh:'就快了！'} ],
    finish:{ ko:'완벽해! 이제 넌 짝꿍 탐정이야 🔢✨', en:"Perfect! You're a Pair Detective now!", zh:'完美！你现在是配对侦探啦！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
