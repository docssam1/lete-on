/* ============================================================
   Numbers of Magic — 유닛 데이터: A-08
   초급 A · 챕터8 "몇십 곱 마법"
   교재 개념 기반(창작 재구성). generator=ml5_tensMul + dv2_div2d1d.
   핵심: 30×4 = 3×4×10 = 120 → 결과에 0을 붙이면 돼요!
   60÷3 = 6÷3×10 = 20 → 0을 떼고 나눈 다음 0을 붙여요.
   ============================================================ */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['A-08'] = {
  id:'A-08', tier:'beginner', level:'A', order:8,
  generator:'ml5_tensMul',
  title:{ ko:'몇십 곱 마법', en:'Multiplying Tens', zh:'整十乘法魔法' },
  subtitle:{ ko:'0을 빼고 곱하고 다시 0을 붙여요', en:'Remove the zero, multiply, then put it back', zh:'去掉0相乘，再加回0' },
  icon:'0️⃣',

  /* ── STEP1 프랙티스: ml2_tt25 구구 2~5단 워밍업 ── */
  practice:{
    generator:'ml2_tt25', level:'practice', count:5,
    intro:{
      ko:'먼저 구구단 워밍업! 2~5단을 빠르게 풀어봐요.',
      en:"Let's warm up with times tables 2-5 — answer them fast!",
      zh:'先热热身，快速答2~5的乘法口诀！'
    }
  },

  /* ── STEP2 디스커버: 몇십 곱 개념 3단 ── */
  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ ko:'① 왜 0이 붙을까요?', en:'1) Why does a zero appear?', zh:'① 为什么会多出一个0？' },
        head:{ ko:'30 = 3 × 10 이에요', en:'30 is just 3 × 10', zh:'30就是3 × 10' },
        desc:{ ko:'30×4를 계산해볼게요. 30은 3이 10개 있는 수예요. 그러니까 30×4 = 3×10×4 = 3×4×10이에요. 3×4=12를 구하고 거기에 10을 곱하면 0이 하나 붙어요!',
               en:"Let's compute 30×4. 30 is the same as 3×10. So 30×4 = 3×10×4 = 3×4×10. Calculate 3×4=12, then multiply by 10 — that's why a 0 appears!",
               zh:'来算30×4。30就是3×10，所以30×4 = 3×10×4 = 3×4×10。先算3×4=12，再乘以10，结果末尾就多了一个0！' },
        mathSteps:['30 × 4','= 3 × 10 × 4','= 3 × 4 × 10','= 12 × 10','= 120'],
        result:{ ko:'30×4 = 120! 0을 빼고 계산해서 결과에 0 붙이기!', en:'30×4 = 120! Remove the 0, multiply, add the 0 back!', zh:'30×4 = 120！去掉0计算，结果再加回0！' },
        book:{ ko:'몇십을 곱할 때는: ① 0을 잠깐 떼기 ② 한 자리 곱셈 하기 ③ 결과에 0 붙이기.',
               en:'When multiplying by a multiple of 10: ① remove the 0 ② do the 1-digit multiplication ③ attach the 0.',
               zh:'乘以整十数时：①先去掉0 ②做一位数乘法 ③结果末尾加回0。' } },

      { tag:{ ko:'② 몇십×몇십도 같아요', en:'2) Tens × tens works the same way', zh:'② 整十乘整十也是同样的道理' },
        head:{ ko:'20×30 = 2×3 한 다음 0 두 개 붙이기', en:'20×30 = first do 2×3, then attach two zeros', zh:'20×30 = 先算2×3，再加两个0' },
        desc:{ ko:'20×30에서는 0이 두 개예요. 20 = 2×10, 30 = 3×10이니까 20×30 = 2×10×3×10 = 2×3×100 = 6×100. 결과에 0이 두 개 붙어요!',
               en:'20×30 has two zeros. Since 20=2×10 and 30=3×10, we get 20×30 = 2×10×3×10 = 2×3×100 = 600. Two zeros attach to the result!',
               zh:'20×30有两个0。因为20=2×10，30=3×10，所以20×30 = 2×10×3×10 = 2×3×100 = 600。结果末尾加两个0！' },
        mathSteps:['20 × 30','= 2 × 3 × 100','= 6 × 100','= 600'],
        result:{ ko:'0의 개수를 세어서 결과에 그 수만큼 0을 붙여요!', en:'Count the zeros and attach that many to the result!', zh:'数一下0的个数，在结果末尾加上相同数量的0！' },
        book:{ ko:'곱하는 두 수의 0 개수를 합해서 결과에 붙이면 돼요. 20×30에는 0이 두 개니까 결과에도 0 두 개.',
               en:'Add the number of zeros in both factors — that many zeros go on the result.',
               zh:'把两个乘数末尾0的数量加起来，结果末尾就加上那么多个0。' } },

      { tag:{ ko:'③ 나눗셈도 같은 방법이에요', en:'3) Division works the same way', zh:'③ 除法也是同样的方法' },
        head:{ ko:'60÷3은 0을 떼고 나눠요', en:'60÷3: remove the 0, then divide', zh:'60÷3：先去掉0，再除' },
        desc:{ ko:'60÷3에서 60=6×10이에요. 그러면 60÷3 = 6×10÷3 = (6÷3)×10 = 2×10 = 20. 나눗셈도 0을 떼고 계산한 다음, 결과에 0을 붙여요!',
               en:'In 60÷3, since 60=6×10, we get 60÷3 = 6×10÷3 = (6÷3)×10 = 2×10 = 20. For division too — remove the 0, divide, then attach it back!',
               zh:'60÷3中，60=6×10，所以60÷3 = 6×10÷3 = (6÷3)×10 = 2×10 = 20。除法也是去掉0，除完再加回来！' },
        mathSteps:['60 ÷ 3','= (6 × 10) ÷ 3','= 6 ÷ 3 × 10','= 2 × 10','= 20'],
        result:{ ko:'60÷3 = 20! 나눗셈도 0을 분리하면 쉬워져요.', en:'60÷3 = 20! Division with zeros is easy once you separate them.', zh:'60÷3 = 20！把0分开处理，除法也简单了。' },
        book:null }
    ],
    rule:{ ko:'① 0을 잠깐 분리한다  ② 남은 수끼리 구구단으로 계산  ③ 분리했던 0을 결과에 다시 붙인다',
      en:'① Separate the zeros  ② Multiply/divide the remaining digits using times tables  ③ Reattach the zeros to the result.',
      zh:'①把0暂时分开 ②用乘法口诀计算剩下的数 ③把0重新加回结果末尾。' }
  },

  /* ── STEP3 핵심체크 ── */
  check:{
    fills:[
      { tex:'40 \\times 3 = 4 \\times 3 \\times \\square', answer:10,
        hint:{ ko:'40 = 4 × 10이에요. 빠진 수는 10!', en:'40 = 4 × 10. The missing number is 10!', zh:'40 = 4 × 10，空格里是10！' } },
      { tex:'60 \\div 2 = \\square', answer:30,
        hint:{ ko:'6÷2=3이고 거기에 0을 붙이면 30!', en:'6÷2=3, then attach the zero → 30!', zh:'6÷2=3，再加0就是30！' } }
    ],
    open:{
      ko:'300×4를 계산하려면 어떻게 해야 할까요? 0의 개수를 세어보세요.',
      en:'How would you calculate 300×4? Count the zeros!',
      zh:'怎么计算300×4？数一数0的个数！'
    },
    openHint:{
      ko:'300 = 3×100이에요. 3×4=12이고, 여기에 100을 곱하면 0이 두 개! 300×4 = 1200.',
      en:'300 = 3×100. So 3×4=12, then ×100 → two zeros! 300×4 = 1200.',
      zh:'300 = 3×100。3×4=12，再乘以100加两个0！300×4 = 1200。'
    }
  },

  /* ── STEP4 매직랩 ── */
  lab:{
    generator:'ml5_tensMul', level:'main', count:4,
    intro:{
      ko:'0을 분리해서 계산해봐! 빈칸을 채우면서 몇십 곱을 완성해요.',
      en:'Separate those zeros and compute! Fill in the blanks to complete tens multiplication.',
      zh:'把0分开来算！填写空格完成整十乘法。'
    }
  },

  /* ── STEP5 아레나 ── */
  arena:{
    generator:'ml5_tensMul', level:'main', count:8, timeLimit:300,
    rule:{ ko:'5분 안에 최대한 많이! 0을 분리하면 다 쉬워요.', en:'5 minutes — separate the zeros and it all gets easy!', zh:'5分钟内尽量多！把0分开，一切都简单！' }
  },

  stamp:{ label:{ ko:'0 마법사', en:'Zero Wizard', zh:'零的魔法师' }, coins:20 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'0 마법 성공! 0️⃣',en:'Zero magic works!',zh:'零的魔法成功！'}, {ko:'0 분리 완벽! 🪄',en:'Zero separation complete!',zh:'分离0完美！'} ],
    wrong:[ {ko:'음~ 0을 잠깐 떼어놓고 생각해봐!',en:'Hmm — try removing the zero first!',zh:'嗯，先把0去掉再想想！'}, {ko:'거의 다 왔어!',en:'Almost!',zh:'就快了！'} ],
    finish:{ ko:'완벽해! 이제 넌 0 마법사야 0️⃣✨', en:"Perfect! You're a Zero Wizard now!", zh:'完美！你现在是零的魔法师啦！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
