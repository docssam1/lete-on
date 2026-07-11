/* ============================================================
   Numbers of Magic — 유닛 데이터: A-09
   초급 A · 챕터9 "분배 암산 마법"
   교재 개념 기반(창작 재구성). generator=ml6_mul2d1dMental + dv3_divRem.
   핵심: 24×3 = (20+4)×3 = 20×3 + 4×3 = 60+12 = 72
   "십의 자리와 일의 자리를 따로따로 곱해요!"
   나눗셈: 75÷3 → (60+15)÷3 = 20+5 = 25
   ============================================================ */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['A-09'] = {
  id:'A-09', tier:'beginner', level:'A', order:9,
  generator:'ml6_mul2d1dMental',
  title:{ ko:'분배 암산 마법', en:'Distributive Mental Multiplication', zh:'分配心算魔法' },
  subtitle:{ ko:'십의 자리와 일의 자리를 따로따로 곱하고 더해요', en:'Multiply tens and ones separately, then add', zh:'分别乘十位和个位，再相加' },
  icon:'🎯',

  /* ── STEP1 프랙티스: ml5_tensMul 몇십 곱 워밍업 ── */
  practice:{
    generator:'ml5_tensMul', level:'practice', count:5,
    intro:{
      ko:'먼저 몇십 곱 워밍업! 0을 분리해서 빠르게 풀어봐요.',
      en:"Warm up with tens multiplication — separate those zeros and answer fast!",
      zh:'先热热身，练习整十乘法——去掉0快速解答！'
    }
  },

  /* ── STEP2 디스커버: 분배 암산 개념 3단 ── */
  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ ko:'① 두 자리 수를 쪼개요', en:'1) Split the 2-digit number', zh:'① 把两位数拆开' },
        head:{ ko:'24 = 20 + 4 로 쪼개요', en:'Split 24 into 20 + 4', zh:'把24拆成20 + 4' },
        desc:{ ko:'24×3을 바로 계산하기 어렵지만, 24를 20과 4로 나누면 쉬워져요. 20×3은 몇십 곱이라 쉽고, 4×3도 구구단이라 쉬워요. 마지막에 더하면 끝!',
               en:"24×3 looks hard, but split 24 into 20 and 4 and it's easy. 20×3 is a tens multiplication (easy!), and 4×3 is a times table (easy!). Just add them together at the end!",
               zh:'24×3看起来难，但把24拆成20和4就简单了。20×3是整十乘法（简单！），4×3是口诀（简单！）。最后加起来就完成！' },
        mathSteps:['24 × 3','= (20 + 4) × 3','= 20 × 3 + 4 × 3  ← 분배!'],
        result:{ ko:'나눠서 따로 곱하고 더하면 돼요. 이게 분배 법칙이에요!', en:'Split, multiply separately, then add — this is the distributive law!', zh:'拆开分别乘，再相加——这就是分配律！' },
        book:{ ko:'(A + B) × C = A×C + B×C. 덧셈 안의 두 수에 각각 C를 곱한 거예요.',
               en:'(A + B) × C = A×C + B×C. Each number inside is multiplied by C separately.',
               zh:'(A + B) × C = A×C + B×C。括号里的两个数各自与C相乘。' } },

      { tag:{ ko:'② 쪼개서 곱하고 더해요', en:'2) Split, multiply each, then add', zh:'② 拆开分别乘，再相加' },
        head:{ ko:'24×3을 단계별로 풀어봐요', en:"Let's solve 24×3 step by step", zh:'一步一步解24×3' },
        desc:{ ko:'20×3 = 60 (몇십 곱), 4×3 = 12 (구구단). 두 결과를 더해요: 60 + 12 = 72. 이제 두 자리 곱셈이 어렵지 않아요!',
               en:'20×3 = 60 (tens multiplication), 4×3 = 12 (times table). Add the results: 60 + 12 = 72. Two-digit multiplication is easy now!',
               zh:'20×3 = 60（整十乘法），4×3 = 12（口诀）。把结果相加：60 + 12 = 72。两位数乘法不难了！' },
        mathSteps:['24 × 3','= 20 × 3 + 4 × 3','= 60 + 12','= 72'],
        result:{ ko:'24×3 = 72! 두 단계로 완성이에요.', en:'24×3 = 72! Two steps and done.', zh:'24×3 = 72！两步搞定。' },
        book:{ ko:'세 수 이상도 같아요: 123×4 = 100×4 + 20×4 + 3×4 = 400+80+12 = 492.',
               en:'Works for more digits too: 123×4 = 100×4 + 20×4 + 3×4 = 400+80+12 = 492.',
               zh:'更多位数也一样：123×4 = 100×4 + 20×4 + 3×4 = 400+80+12 = 492。' } },

      { tag:{ ko:'③ 나눗셈도 쪼갤 수 있어요', en:'3) Division can be split too', zh:'③ 除法也可以拆开' },
        head:{ ko:'75÷3 → 쪼개서 나눠요', en:'75÷3 → split and divide', zh:'75÷3 → 拆开再除' },
        desc:{ ko:'75÷3을 계산해봐요. 75를 "3으로 딱 나뉘는 수"로 쪼개면 편해요. 60÷3=20이고 15÷3=5이니까 75÷3=(60+15)÷3=20+5=25!',
               en:"Let's compute 75÷3. Split 75 into numbers that divide evenly by 3: 60÷3=20 and 15÷3=5, so 75÷3 = (60+15)÷3 = 20+5 = 25!",
               zh:'来算75÷3。把75拆成能被3整除的数：60÷3=20，15÷3=5，所以75÷3=(60+15)÷3=20+5=25！' },
        mathSteps:['75 ÷ 3','= (60 + 15) ÷ 3','= 60÷3 + 15÷3','= 20 + 5','= 25'],
        result:{ ko:'75÷3 = 25! 나눗셈도 쪼개면 쉬워져요.', en:'75÷3 = 25! Division is easier when split too.', zh:'75÷3 = 25！除法拆开也简单！' },
        book:null }
    ],
    rule:{ ko:'① 두 자리 수를 십의 자리와 일의 자리로 쪼갠다  ② 각각 따로 곱하거나 나눈다  ③ 결과를 더한다',
      en:'① Split the 2-digit number into tens and ones  ② Multiply or divide each part separately  ③ Add the results.',
      zh:'①把两位数拆成十位和个位 ②分别相乘或相除 ③把结果相加。' }
  },

  /* ── STEP3 핵심체크 ── */
  check:{
    fills:[
      { tex:'32 \\times 3 = 30 \\times 3 + \\square \\times 3', answer:2,
        hint:{ ko:'32 = 30 + 2예요. 일의 자리 2를 쪼개요!', en:'32 = 30 + 2. Split out the ones digit, 2!', zh:'32 = 30 + 2。拆出个位数2！' } },
      { tex:'24 \\times 4 = \\square', answer:96,
        hint:{ ko:'24 = 20+4. 20×4=80, 4×4=16. 80+16=?', en:'24 = 20+4. 20×4=80, 4×4=16. 80+16=?', zh:'24 = 20+4。20×4=80，4×4=16。80+16=？' } }
    ],
    open:{
      ko:'분배 암산을 이용해서 35×6을 계산해보세요. 어떻게 쪼갰나요?',
      en:'Use distributive mental math to calculate 35×6. How did you split it?',
      zh:'用分配心算计算35×6。你是怎么拆开的？'
    },
    openHint:{
      ko:'35 = 30 + 5. 30×6=180, 5×6=30. 180+30=210.',
      en:'35 = 30 + 5. 30×6=180, 5×6=30. 180+30=210.',
      zh:'35 = 30 + 5。30×6=180，5×6=30。180+30=210。'
    }
  },

  /* ── STEP4 매직랩 ── */
  lab:{
    generator:'ml6_mul2d1dMental', level:'main', count:4,
    intro:{
      ko:'이제 직접 쪼개봐! 빈칸을 채우면서 분배 암산을 완성해요.',
      en:"Now split it yourself! Fill in the blanks to complete distributive multiplication.",
      zh:'现在自己来拆！填写空格，完成分配心算。'
    }
  },

  /* ── STEP5 아레나 ── */
  arena:{
    generator:'ml6_mul2d1dMental', level:'main', count:8, timeLimit:300,
    rule:{ ko:'5분 안에 최대한 많이! 마음속으로 쪼개서 빠르게!', en:'5 minutes — split mentally and go fast!', zh:'5分钟内尽量多！脑子里拆开，快速答题！' }
  },

  stamp:{ label:{ ko:'분배 마법사', en:'Distribution Wizard', zh:'分配魔法师' }, coins:20 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'분배 마법 완성! 🎯',en:'Distribution magic works!',zh:'分配魔法成功！'}, {ko:'쪼개기 성공! 🪄',en:'Split and conquer!',zh:'拆分成功！'} ],
    wrong:[ {ko:'음~ 십의 자리와 일의 자리로 쪼개봐!',en:'Hmm — try splitting into tens and ones!',zh:'嗯，试试拆成十位和个位！'}, {ko:'거의 다 왔어!',en:'Almost!',zh:'就快了！'} ],
    finish:{ ko:'완벽해! 이제 넌 분배 마법사야 🎯✨', en:"Perfect! You're a Distribution Wizard now!", zh:'完美！你现在是分配魔法师啦！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
