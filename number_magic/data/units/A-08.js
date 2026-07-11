/* ============================================================
   Numbers of Magic — 유닛 데이터: A-08
   초급 B · 챕터4 "수를 이사시켜요 2"
   창의수연 초급 B 실제 교재 내용 기반. generator=move10_2d.
   핵심: 39+25 → 39+1+24 = 40+24 = 64; 79+17 → 80+16 = 96
   "한 수에서 몇을 빌려 다른 수를 딱 떨어지는 10으로 만들어요!"
   ============================================================ */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['A-08'] = {
  id:'A-08', tier:'beginner', level:'A', order:8,
  generator:'move10_2d',
  title:{ ko:'수를 이사시켜요 2', en:'Move Digits (Two-Digit)', zh:'搬数字 2' },
  subtitle:{ ko:'한 수에서 조금 빌려 다른 수를 딱 떨어지는 10으로 만들어요', en:'Borrow a little to round one number to the nearest ten', zh:'从一个数借一点，把另一个数凑成整十' },
  icon:'🚚',

  practice:{
    generator:'move10_2d', level:'practice', count:5,
    intro:{
      ko:'준비 운동! 이 수에서 얼마를 더하면 다음 딱 떨어지는 10이 될까요?',
      en:"Warm up! How much more does this number need to reach the next multiple of 10?",
      zh:'热热身！这个数再加多少才能到下一个整十？'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ ko:'① 딱 떨어지는 10이 편해요', en:'1) Multiples of 10 are easy to work with', zh:'① 整十数好算' },
        head:{ ko:'40, 50, 60처럼 딱 떨어지는 수가 더하기 쉬워요', en:'Round numbers like 40, 50, 60 are easier to add', zh:'像40、50、60这样的整十数更好算' },
        desc:{ ko:'A-02에서 한 자리 수를 이사시켜 10을 만드는 걸 배웠어요. 이번엔 두 자리 수! 38+25라면 38을 40으로 만들고 싶어요. 38에서 40까지는 얼마가 필요할까요? <b>2</b>가 필요해요!',
               en:'In A-02, you moved digits to make 10. Now with two-digit numbers! With 38+25, you\'d want to round 38 up to 40. How much does 38 need to reach 40? It needs 2!',
               zh:'在A-02里，学了把一个数搬成整十。现在换成两位数！38+25，想把38凑成40。38到40还需要多少？需要2！' },
        mathSteps:['38 → 40까지 2 필요 (2를 이사시켜요)','39 → 40까지 1 필요 (1을 이사시켜요)','68 → 70까지 2 필요 (2를 이사시켜요)'],
        result:{ ko:'일의 자리를 보면 얼마를 이사시켜야 하는지 알 수 있어요!', en:'Look at the ones digit to know how much to move!', zh:'看个位就知道要搬多少！' },
        book:{ ko:'일의 자리가 8이면 2를 이사, 9이면 1을 이사, 7이면 3을 이사시키면 딱 떨어지는 10이 돼요.',
               en:'Ones digit 8: move 2. Ones digit 9: move 1. Ones digit 7: move 3. That rounds to the next ten.',
               zh:'个位是8，搬2；个位是9，搬1；个位是7，搬3。这样就能凑成整十。' } },

      { tag:{ ko:'② 빌려서 이사시켜요', en:'2) Borrow and move', zh:'② 借过来再搬' },
        head:{ ko:'더하는 수에서 조금 빌려 먼저 10을 만들어요', en:'Borrow a little from the second number to make a ten first', zh:'从第二个数借一点，先凑成整十' },
        desc:{ ko:'39+25에서 39를 40으로 만들고 싶어요. 25에서 1을 빌려와요. 25는 1+24가 되고, 39+1 = 40이 돼요. 이제 40+24를 계산하면 돼요!',
               en:'With 39+25, we want to round 39 to 40. Borrow 1 from 25. 25 becomes 1+24, and 39+1 = 40. Now just calculate 40+24!',
               zh:'39+25，想把39凑成40。从25借1过来。25变成1+24，39+1=40。现在只需算40+24！' },
        mathSteps:['39 + 25','= 39 + 1 + 24  ← 25에서 1을 이사!','= 40 + 24','= 64'],
        result:{ ko:'39+25 = 64! 39를 40으로 만든 뒤 나머지 24를 더했어요.', en:'39+25 = 64! Rounded 39 to 40, then added the remaining 24.', zh:'39+25 = 64！把39凑成40后，再加剩下的24。' },
        book:{ ko:'79+17 → 79에 1을 이사(17에서) → 80+16 = 96. 68+35 → 68에 2를 이사(35에서) → 70+33 = 103.',
               en:'79+17 → move 1 from 17 to 79 → 80+16 = 96. 68+35 → move 2 from 35 to 68 → 70+33 = 103.',
               zh:'79+17 → 从17搬1给79 → 80+16 = 96。68+35 → 从35搬2给68 → 70+33 = 103。' } },

      { tag:{ ko:'③ 실전 연습', en:'3) Practice in action', zh:'③ 实战练习' },
        head:{ ko:'두 단계로 빠르게 풀어요', en:'Solve quickly in two steps', zh:'两步快速解题' },
        desc:{ ko:'이제 자신 있게 해봐요! ① 첫 번째 수의 일의 자리를 보고 얼마를 이사시킬지 정한다. ② 두 번째 수에서 그만큼 빌려와서 이사시킨다. ③ 딱 떨어지는 수+나머지를 더한다.',
               en:'Now with confidence! ① Check the ones of the first number to decide how much to move. ② Borrow that amount from the second number. ③ Add the rounded number + remainder.',
               zh:'现在自信地来！①看第一个数的个位，决定要搬多少。②从第二个数借那么多。③整十数加余数。' },
        mathSteps:['58 + 34','58에 2를 이사 → 60 + 32 = 92','47 + 36','47에 3을 이사 → 50 + 33 = 83'],
        result:{ ko:'58+34=92, 47+36=83! 이사 마법으로 쉽게 풀었어요.', en:'58+34=92, 47+36=83! Moving digits makes it easy.', zh:'58+34=92，47+36=83！搬数字魔法，轻松解题！' },
        book:null }
    ],
    rule:{ ko:'① 첫 번째 수의 일의 자리를 보고 필요한 이사량을 결정한다  ② 두 번째 수에서 이사량을 빌려 첫 번째 수를 딱 떨어지는 10으로 만든다  ③ 나머지를 더한다',
      en:'① Check the ones digit to decide how much to move  ② Borrow that amount from the second number to round the first to the nearest ten  ③ Add the remainder.',
      zh:'①看个位决定要搬多少 ②从第二个数借那么多，把第一个数凑成整十 ③再加余数。' }
  },

  check:{
    fills:[
      { tex:'39 + 25 = 39 + 1 + \\square', answer:24,
        hint:{ ko:'25에서 1을 이사보냈으니까 25-1=?', en:'We moved 1 from 25, so 25-1=?', zh:'从25搬走了1，所以25-1=？' } },
      { tex:'79 + 17 = \\square + 16', answer:80,
        hint:{ ko:'79에서 다음 10은 몇일까요? 17에서 얼마를 이사시키면 될까요?', en:'What is the next ten after 79? How much should you move from 17?', zh:'79的下一个整十是多少？从17搬多少过来？' } }
    ],
    open:{
      ko:'이사 마법을 쓰면 어떤 덧셈이 가장 편해질까요? 어떤 수일 때 이 방법을 쓰면 좋을까요?',
      en:'Which additions does the "moving digits" trick help the most? What kinds of numbers work best with this method?',
      zh:'"搬数字"魔法对哪类加法最有帮助？什么样的数用这个方法效果最好？'
    },
    openHint:{
      ko:'예) 일의 자리가 7, 8, 9인 수가 있을 때 특히 편해요. 1, 2, 3만 이사시키면 바로 10이 되거든요!',
      en:'e.g. It\'s especially helpful when one number has ones digit 7, 8, or 9 — you only need to move 1, 2, or 3 to reach the next ten!',
      zh:'例）当一个数的个位是7、8、9时特别有用——只需搬1、2、3就能到下一个整十！'
    }
  },

  lab:{
    generator:'move10_2d', level:'main', count:4,
    intro:{
      ko:'이제 진짜 마법! 두 자리 수에서 이사량을 정하고 딱 떨어지는 수를 만들어봐요.',
      en:'Real magic! Decide how much to move, round to the nearest ten, and solve!',
      zh:'真正的魔法！决定要搬多少，凑成整十，再解题！'
    }
  },

  arena:{
    generator:'move10_2d', level:'main', count:8, timeLimit:300,
    rule:{ ko:'5분 안에 최대한 많이! 이사 마법으로 빠르게 풀어요!', en:'As many as you can in 5 minutes — use moving magic to solve fast!', zh:'5分钟内尽量多做！用搬数字魔法快速解题！' }
  },

  stamp:{ label:{ ko:'이사 마법사', en:'Moving Wizard', zh:'搬数字魔法师' }, coins:20 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'이사 성공! 🚚',en:'Moved it!',zh:'搬成功了！'}, {ko:'딱 10 마법! 🪄',en:'Perfect ten magic!',zh:'整十魔法！'} ],
    wrong:[ {ko:'음~ 일의 자리를 보고 얼마를 이사시킬지 다시 생각해봐!',en:'Hmm — look at the ones digit and think again about how much to move!',zh:'嗯，再看看个位，重新想想要搬多少！'}, {ko:'거의 다 왔어!',en:'Almost!',zh:'就快了！'} ],
    finish:{ ko:'완벽해! 이제 넌 이사 마법사야 🚚✨', en:"Perfect! You're a Moving Wizard now!", zh:'完美！你现在是搬数字魔法师啦！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
