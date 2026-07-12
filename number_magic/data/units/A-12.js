/* ============================================================
   Numbers of Magic — 유닛 데이터: A-12
   초급 C · 챕터4 "덧셈, 뺄셈 끼리끼리 1 (두 자릿수의 덧셈)"
   창의수연 초급 C 실제 교재 내용 기반. generator=addSubGroup.
   핵심: 35-14+21-22 → (35+21)-(14+22) = 56-36 = 20
   "더하는 수끼리, 빼는 수끼리 묶어서 계산해요!"
   ============================================================ */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['A-12'] = {
  id:'A-12', tier:'beginner', level:'A', order:12,
  generator:'addSubGroup',
  title:{ ko:'덧셈, 뺄셈 끼리끼리 1', en:'Group the Plus & Minus Terms', zh:'加减各自归类 1' },
  subtitle:{ ko:'더하는 수끼리, 빼는 수끼리 묶어요', en:'Group all the plus-terms, group all the minus-terms', zh:'加数归加数，减数归减数' },
  icon:'🧲',

  practice:{
    generator:'addSubGroup', level:'practice', count:5,
    intro:{
      ko:'준비 운동! 더하는 수끼리 먼저 더해보는 연습이야.',
      en:"Warm up! Practice adding the plus-terms together first.",
      zh:'热热身！先练习把加数加在一起。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ ko:'① 더하기 뺴기가 섞여 있을 때', en:'1) When plus and minus mix', zh:'① 加减混在一起时' },
        head:{ ko:'뺄셈을 여러 번 할 땐 한꺼번에 묶어서 빼도 돼요', en:'When subtracting multiple times, you can group them and subtract all at once', zh:'多次相减时，可以合起来一次减完' },
        desc:{ ko:'35-14+21-22처럼 더하기와 빼기가 섞여 있으면, 더하는 수(35, 21)끼리 먼저 더하고, 빼는 수(14, 22)끼리 먼저 더한 다음, 마지막에 큰 합에서 작은 합을 빼요.',
               en:'For 35-14+21-22, add the plus-terms (35, 21) together, add the minus-terms (14, 22) together, then subtract the second sum from the first.',
               zh:'像35-14+21-22这样加减混合，先把加数(35、21)加起来，减数(14、22)加起来，再用前者减后者。' },
        mathSteps:['35 - 14 + 21 - 22','= (35 + 21) - (14 + 22)','= 56 - 36','= 20'],
        result:{ ko:'더하는 수의 합에서 빼는 수의 합을 빼면 답이 나와요!', en:'Subtract the minus-sum from the plus-sum to get the answer!', zh:'加数之和减去减数之和就是答案！' },
        book:{ ko:'덧셈끼리 뺄셈끼리 묶어도 되는 이유는, 결국 더하고 빼는 순서를 바꿔도 전체 결과는 같기 때문이에요.',
               en:'Grouping plus-terms and minus-terms works because changing the order of addition and subtraction doesn\'t change the total result.',
               zh:'之所以能把加数、减数分别归类，是因为加减的顺序改变，最终结果不变。' } },

      { tag:{ ko:'② 수가 더 많아져도 똑같아요', en:'2) Works with more terms too', zh:'② 数再多也一样' },
        head:{ ko:'6개, 8개 수여도 같은 방법!', en:'Same method with 6 or 8 numbers!', zh:'6个、8个数也用同样的方法！' },
        desc:{ ko:'수가 많아져도 걱정 없어요. 더하는 수는 모두 한쪽으로, 빼는 수는 모두 다른 쪽으로 모아서 각각 더한 다음 빼주면 돼요.',
               en:'Even with more numbers, just gather all the plus-terms on one side and all the minus-terms on the other, add each group, then subtract.',
               zh:'数再多也不怕，把所有加数放一边，减数放另一边，各自相加后再相减。' },
        mathSteps:['97-32+72-50+15-23','= (97+72+15) - (32+50+23)','= 184 - 105','= 79'],
        result:{ ko:'97-32+72-50+15-23 = 184-105 = 79', en:'97-32+72-50+15-23 = 184-105 = 79', zh:'97-32+72-50+15-23 = 184-105 = 79' },
        book:null },

      { tag:{ ko:'③ 앞에서부터 계산이 안 될 때 특히 좋아요', en:'3) Especially good when order-by-order gets stuck', zh:'③ 从前往后算不通时特别好用' },
        head:{ ko:'중간에 뺄 수 없어도 끼리끼리로는 풀려요', en:'Even if you get stuck mid-way, grouping solves it', zh:'中途减不出来，用归类法也能算' },
        desc:{ ko:'27-53+72-15을 앞에서부터 차례로 계산하면 27에서 53을 뺄 수 없어 막혀요. 하지만 더하는 수끼리, 빼는 수끼리 묶으면 문제없이 풀 수 있어요.',
               en:'Calculating 27-53+72-15 step by step gets stuck since 27 is smaller than 53. But grouping plus-terms and minus-terms solves it easily.',
               zh:'按顺序计算27-53+72-15会卡住，因为27减不了53。但用归类法就能顺利算出。' },
        mathSteps:['27 - 53 + 72 - 15','= (27 + 72) - (53 + 15)','= 99 - 68','= 31'],
        result:{ ko:'막혔던 계산도 끼리끼리로 묶으면 술술 풀려요!', en:'A stuck calculation flows smoothly once you group the terms!', zh:'卡住的计算，归类之后就顺畅了！' },
        book:{ ko:'전체 더하는 수의 합(27+72=99)이 전체 빼는 수의 합(53+15=68)보다 크기만 하면, 중간 순서와 상관없이 항상 답을 구할 수 있어요.',
               en:'As long as the total plus-sum (27+72=99) is bigger than the total minus-sum (53+15=68), you can always find the answer regardless of the middle steps.',
               zh:'只要加数总和(27+72=99)大于减数总和(53+15=68)，不管中间顺序如何，都能算出答案。' } }
    ],
    rule:{ ko:'① 더하는 수끼리 모아서 더한다  ② 빼는 수끼리 모아서 더한다  ③ (덧셈의 합) − (뺄셈의 합)을 계산한다',
      en:'① Add all the plus-terms together  ② Add all the minus-terms together  ③ Compute (plus-sum) − (minus-sum)',
      zh:'①把加数加在一起 ②把减数加在一起 ③计算(加数之和)−(减数之和)' }
  },

  check:{
    fills:[
      { tex:'35 - 14 + 21 - 22 = (35 + 21) - (14 + \\square)', answer:22,
        hint:{ ko:'빼는 수는 14와 무엇이었나요?', en:'What are the two minus-terms besides 14?', zh:'减数除了14还有什么？' } },
      { tex:'97 - 32 + 72 - 50 + 15 - 23 = 184 - \\square', answer:105,
        hint:{ ko:'빼는 수 32, 50, 23을 모두 더하면?', en:'Add up all the minus-terms: 32+50+23=?', zh:'把减数32、50、23加起来是多少？' } }
    ],
    open:{
      ko:'27-53+72-15을 앞에서부터 차례로 계산하면 왜 막힐까요? 끼리끼리 방법으로는 왜 풀 수 있는지 설명해봐요.',
      en:'Why does calculating 27-53+72-15 step by step get stuck? Explain why grouping solves it.',
      zh:'为什么按顺序计算27-53+72-15会卡住？说说为什么归类法能解决。'
    },
    openHint:{
      ko:'예) 27은 53보다 작아서 그 자리에서 바로 뺄 수 없어요. 하지만 전체 더하는 수의 합이 전체 빼는 수의 합보다 크면, 순서를 바꿔 묶어서 계산해도 결과는 같고 막히지 않아요.',
      en:'e.g. 27 is smaller than 53, so you can\'t subtract right there. But if the total plus-sum is bigger than the total minus-sum, grouping avoids getting stuck and gives the same result.',
      zh:'例）27比53小，当场减不了。但只要加数总和大于减数总和，归类计算就不会卡住，结果也一样。'
    }
  },

  lab:{
    generator:'addSubGroup', level:'main', count:4,
    intro:{
      ko:'이제 진짜 마법! 더하는 수끼리, 빼는 수끼리 묶어서 풀어봐요.',
      en:'Real magic time! Group the plus-terms and minus-terms to solve.',
      zh:'真正的魔法时刻！把加数、减数分别归类来解题。'
    }
  },

  arena:{
    generator:'addSubGroup', level:'main', count:8, timeLimit:300,
    rule:{ ko:'5분 안에 최대한 많이! 더하는 수와 빼는 수를 먼저 묶어요!', en:'As many as you can in 5 minutes — group first!', zh:'5分钟内尽量多做！先归类！' }
  },

  stamp:{ label:{ ko:'끼리끼리 마법사', en:'Grouping Wizard', zh:'归类魔法师' }, coins:20 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'끼리끼리 묶기 성공! 🧲',en:'Grouped it perfectly!',zh:'归类成功！'}, {ko:'대단해! 🪄',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'음~ 더하는 수끼리, 빼는 수끼리 먼저 모아봐!',en:'Hmm — gather the plus-terms and minus-terms first!',zh:'嗯，先把加数、减数分别归类！'}, {ko:'거의 다 왔어!',en:'Almost!',zh:'就快了！'} ],
    finish:{ ko:'완벽해! 이제 넌 끼리끼리 마법사야 🧲✨', en:"Perfect! You're a Grouping Wizard now!", zh:'完美！你现在是归类魔法师啦！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
