/* ============================================================
   Numbers of Magic — 유닛 데이터: A-05
   초급 A · 챕터5 "보정 빼기 마법"
   교재 개념 기반(창작 재구성). generator=sb5_subAdjust.
   핵심: 54-9 = 54-10+1 = 44+1 = 45
   "더 많이 뺐으니 더 뺀 만큼 돌려받아요!"
   ============================================================ */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['A-05'] = {
  id:'A-05', tier:'beginner', level:'A', order:5,
  generator:'sb5_subAdjust',
  title:{ ko:'보정 빼기 마법', en:'Compensation Subtraction', zh:'补偿减法魔法' },
  subtitle:{ ko:'10을 빼고 더 뺀 만큼 돌려받아요', en:'Subtract 10, then give back the extra', zh:'减去10，再补回多减的部分' },
  icon:'🔄',

  /* ── STEP1 프랙티스: sb3_sub2d1d 내림 없는 두 자리 빼기 ── */
  practice:{
    generator:'sb3_sub2d1d', level:'practice', count:5,
    intro:{
      ko:'먼저 워밍업! 내림 없이 두 자리에서 한 자리를 빼는 연습을 해봐요.',
      en:"Let's warm up — subtract a 1-digit number from a 2-digit number (no borrowing).",
      zh:'先热热身！练习两位数减一位数（不退位）。'
    }
  },

  /* ── STEP2 디스커버: 보정 빼기 개념 3단 ── */
  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ ko:'① 왜 10을 빼나요?', en:'1) Why subtract 10?', zh:'① 为什么减10？' },
        head:{ ko:'9, 8, 7을 빼는 건 어렵지만 10은 쉬워요', en:'Subtracting 9, 8, 7 is tricky — but 10 is easy!', zh:'减9、8、7很麻烦，减10却很简单！' },
        desc:{ ko:'54에서 9를 빼려면 머릿속이 복잡해요. 하지만 10을 빼는 건 쉽죠. <b>9 대신 10을 빼면 어떨까요?</b>',
               en:"Subtracting 9 from 54 takes a lot of brain power. But subtracting 10 is easy! What if we subtract 10 instead of 9?",
               zh:'从54里减去9要费很多脑力，但减10很简单！如果把减9换成减10会怎样呢？' },
        mathSteps:['54 - 9 = ?','54 - 10 = 44 (쉬워요!)','하지만 9 대신 10을 뺐으니 1이 더 빠졌어요'],
        result:{ ko:'10을 빼면 1이 더 빠진 거예요 → 1을 돌려받아야 해요!', en:'We subtracted 1 too many → we need to give that 1 back!', zh:'多减了1 → 要把1还回来！' },
        book:{ ko:'9 = 10 - 1 이에요. 그래서 9를 빼는 것과 10을 빼고 1을 더하는 것은 완전히 같아요.',
               en:'9 = 10 - 1, so subtracting 9 is the same as subtracting 10 and adding 1 back.',
               zh:'9 = 10 - 1，所以减9等于减10后加1。' } },

      { tag:{ ko:'② 더 뺀 만큼 돌려받아요', en:'2) Give back what you over-subtracted', zh:'② 多减了多少就补回多少' },
        head:{ ko:'10을 빼고 돌려받는 금액을 계산해요', en:'Subtract 10, then figure out what to return', zh:'减10后，算出要补回多少' },
        desc:{ ko:'8을 빼야 할 때 10을 빼면 2를 더 뺀 거예요. 7을 빼야 할 때 10을 빼면 3이 더 빠진 것! 이 법칙이에요: <b>더 뺀 만큼 = 10 - 빼야 할 수</b>',
               en:"When subtracting 8, using 10 means 2 too many. For 7, it's 3. The rule: extra subtracted = 10 − the number you needed to subtract.",
               zh:'减8时用了10，多减了2；减7时多减了3。规律：多减了多少 = 10 − 要减的数。' },
        mathSteps:['72 - 8 = ?','72 - 10 + 2','= 62 + 2','= 64'],
        result:{ ko:'72 - 8 = 64! 8 대신 10을 빼고, 2를 돌려받았어요.', en:'72 - 8 = 64! Subtracted 10 instead of 8, returned 2.', zh:'72 - 8 = 64！减10后补回2。' },
        book:{ ko:'돌려받는 수(보정량) = 10 - 빼는 수. 9를 빼면 1 돌려받기, 8은 2, 7은 3.',
               en:'Compensation = 10 − the subtracted digit. Subtract 9 → return 1; subtract 8 → return 2; subtract 7 → return 3.',
               zh:'补偿量 = 10 - 减数。减9补1，减8补2，减7补3。' } },

      { tag:{ ko:'③ 실전 연습', en:'3) Practice in action', zh:'③ 实战练习' },
        head:{ ko:'여러 수로 보정 빼기 연습해요', en:'Practice with different numbers', zh:'用不同的数练习补偿减法' },
        desc:{ ko:'이제 직접 해봐요! 빼는 수가 9, 8, 7이면 보정 빼기를 써요.',
               en:"Now let's try it! Use compensation when subtracting 9, 8, or 7.",
               zh:'现在自己来！减数是9、8、7时就用补偿减法。' },
        mathSteps:['86 - 7 = 86 - 10 + 3 = 76 + 3 = 79','53 - 9 = 53 - 10 + 1 = 43 + 1 = 44','61 - 8 = 61 - 10 + 2 = 51 + 2 = 53'],
        result:{ ko:'항상 두 단계: ① 10 빼기 ② 차이만큼 더하기', en:'Always two steps: ① subtract 10 ② add back the difference', zh:'永远两步：①减10 ②补回差值' },
        book:null }
    ],
    rule:{ ko:'① 빼는 수(7~9) 대신 10을 뺀다  ② 더 뺀 양(10-빼는 수)을 더해 돌려받는다',
      en:'① Subtract 10 instead of 7-9  ② Add back the extra (10 − the number).',
      zh:'①用10代替7~9来减 ②再把多减的(10-减数)补回来。' }
  },

  /* ── STEP3 핵심체크 ── */
  check:{
    fills:[
      { tex:'45 - 9 = 45 - 10 + \\square', answer:1,
        hint:{ ko:'9 대신 10을 뺐어요. 10 - 9 = 1이니까 1을 돌려받아요!', en:'We subtracted 10 instead of 9. 10 − 9 = 1, so return 1!', zh:'用10代替9来减，10-9=1，所以补1！' } },
      { tex:'72 - 8 = 72 - 10 + \\square', answer:2,
        hint:{ ko:'8 대신 10을 뺐어요. 10 - 8 = 2이니까 2를 돌려받아요!', en:'We subtracted 10 instead of 8. 10 − 8 = 2, so return 2!', zh:'用10代替8来减，10-8=2，所以补2！' } }
    ],
    open:{
      ko:'보정 빼기는 덧셈에서도 쓸 수 있을까요? 예를 들어 35 + 9를 어떻게 하면 쉬울까요?',
      en:'Can compensation work for addition too? For example, how would you make 35 + 9 easy?',
      zh:'补偿法也能用在加法里吗？比如35 + 9怎么算更简单？'
    },
    openHint:{
      ko:'예) 35 + 9 = 35 + 10 - 1 = 45 - 1 = 44. 더하는 수(9)를 10으로 올리고, 더 더한 1을 빼면 돼요!',
      en:'e.g. 35 + 9 = 35 + 10 − 1 = 45 − 1 = 44. Round up to 10, then subtract the extra!',
      zh:'例）35 + 9 = 35 + 10 - 1 = 45 - 1 = 44。先凑到10，再减去多加的1！'
    }
  },

  /* ── STEP4 매직랩 ── */
  lab:{
    generator:'sb5_subAdjust', level:'main', count:4,
    intro:{
      ko:'이제 진짜 마법! 두 단계 빈칸을 채우면서 보정 빼기를 직접 해봐요.',
      en:'Real magic time! Fill in the two-step blanks to complete compensation subtraction.',
      zh:'真正的魔法时刻！填写两步骤的空格，完成补偿减法！'
    }
  },

  /* ── STEP5 아레나: 스피드 배틀 ── */
  arena:{
    generator:'sb5_subAdjust', level:'main', count:8, timeLimit:300,
    rule:{ ko:'5분 안에 최대한 많이! 보정 마법을 써서 빠르게 풀어요.', en:'Solve as many as you can in 5 minutes using compensation!', zh:'5分钟内尽量多解题，用补偿魔法加速！' }
  },

  stamp:{ label:{ ko:'보정 마법사', en:'Compensator', zh:'补偿魔法师' }, coins:20 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'돌려받기 성공! 🔄',en:'Got it back!',zh:'补回来啦！'}, {ko:'보정 마법 완성! 🪄',en:'Compensation complete!',zh:'补偿魔法成功！'} ],
    wrong:[ {ko:'음~ 다시 해볼까? 10을 빼고 돌려받는 거야!',en:'Hmm, try again! Subtract 10, then return the extra!',zh:'嗯，再试试！先减10，再补回来！'}, {ko:'거의 다 왔어!',en:'Almost!',zh:'就快了！'} ],
    finish:{ ko:'완벽해! 이제 넌 보정 마법사야 🔄✨', en:"Perfect! You're a Compensation Wizard now!", zh:'完美！你现在是补偿魔法师啦！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
