/* Numbers of Magic — 유닛 B-07: 3단 곱셈구구 (중급 C 챕터7) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['B-07'] = {
  id:'B-07', tier:'intermediate', level:'B', order:7,
  generator:'ml2_tt25',
  title:{ ko:'3단 곱셈구구', en:'Times Table: 3', zh:'乘法口诀：3的乘法' },
  subtitle:{ ko:'3×1부터 3×9까지 — 3씩 뛰어요!', en:'3×1 to 3×9 — skip count by 3!', zh:'3×1到3×9 — 3个3个地数！' },
  icon:'3️⃣',

  practice:{
    generator:'ml2_tt25', level:'practice', count:5,
    params:{ tables:[3] },
    intro:{
      ko:'3단을 연습해 볼 거야. 내가 3단 곱셈을 보여주면, 정답을 눌러줘. 준비됐지?',
      en:"Let's practise the 3 times table. I'll show you a multiplication — tap the answer. Ready?",
      zh:'我们来练习3的乘法口诀。我会给你看一道乘法题，你按出答案。准备好了吗？'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 3단이란?', en:'1) What is the 3 times table?', zh:'① 什么是3的乘法？'},
        head:{ko:'3씩 뛰어 세어 봐요', en:'Skip-count by 3', zh:'3个3个地数'},
        desc:{ko:'3단은 <b>3씩 계속 더해 가는</b> 것이에요. 3, 6, 9, 12… 처럼 3씩 뛰어 세면 3단이 완성돼요!',
              en:'The 3 times table means <b>adding 3 each time</b>. 3, 6, 9, 12 … skip-counting by 3 gives you the whole table!',
              zh:'3的乘法就是<b>每次加3</b>。3、6、9、12……3个3个地数，就能得出整张口诀表！'},
        mathSteps:['3×1=3','3×2=6 (+3)','3×3=9 (+3)','3×4=12 (+3)','…','3×9=27'],
        result:{ko:'3, 6, 9, 12, 15, 18, 21, 24, 27 — 3씩 늘어나요!', en:'3, 6, 9, 12, 15, 18, 21, 24, 27 — goes up by 3 each time!', zh:'3、6、9、12、15、18、21、24、27——每次增加3！'},
        book:{ko:'3단의 답은 3씩 커져요. 앞 답에 3을 더하면 다음 답이 나와요. 3×5=15라면, 3×6=15+3=18!', en:'Each 3× answer is 3 more than the last. 3×5=15, so 3×6=15+3=18!', zh:'3的乘法每个答案比上一个多3。3×5=15，所以3×6=15+3=18！'} },

      { tag:{ko:'② 자릿수 합 = 3의 배수', en:'2) Digit sum is always a multiple of 3', zh:'② 数位之和是3的倍数'},
        head:{ko:'각 자리 숫자를 더해봐요', en:'Add up the digits', zh:'把各位数字加起来'},
        desc:{ko:'3단의 결과를 각 자리 숫자끼리 더하면 <b>항상 3의 배수</b>가 나와요! 이 비밀을 알면 검산이 쉬워져요.',
              en:'Add up the digits of any 3× answer and you always get <b>a multiple of 3</b>! This trick makes checking your work easy.',
              zh:'把3的倍数的各位数字加起来，总是<b>3的倍数</b>！掌握这个秘诀，验算就变得简单了。'},
        mathSteps:['12: 1+2=3 ✓','18: 1+8=9 ✓','27: 2+7=9 ✓','→ 3의 배수 특징!'],
        result:{ko:'3단의 모든 답은 자릿수 합이 3 또는 9예요. 기억해 두세요!', en:'Every answer in the 3 times table has a digit sum of 3, 6, or 9. Remember that!', zh:'3的乘法表中每个答案的数位之和都是3、6或9。记住这一点！'},
        book:{ko:'어떤 수의 각 자리 숫자 합이 3의 배수이면 그 수는 3의 배수예요. 3단 결과는 모두 이 규칙을 따릅니다.', en:'If the digit sum of a number is divisible by 3, so is the number itself. All 3× results follow this rule.', zh:'如果一个数的数位之和能被3整除，那么这个数本身也能被3整除。3的乘法表所有结果都遵循这个规律。'} },

      { tag:{ko:'③ 3단 외우기 팁', en:'3) Tips for memorising the 3s', zh:'③ 记忆3的口诀的技巧'},
        head:{ko:'이전 답에 3 더하기 전략!', en:'Add 3 to the previous answer!', zh:'在上一个答案上加3！'},
        desc:{ko:'잊었을 때는 <b>이전 답에 3을 더해요</b>. 3×4=12를 알면, 3×5는 12+3=15! 손가락으로 3씩 묶어 세는 것도 좋아요.',
              en:'If you forget, <b>add 3 to the previous answer</b>. Know 3×4=12? Then 3×5 is just 12+3=15! You can also group fingers in threes.',
              zh:'如果忘了，就<b>在上一个答案上加3</b>。知道3×4=12？那么3×5就是12+3=15！也可以用手指3个一组来数。'},
        mathSteps:['3×4 = 3+3+3+3 = 12','3×7 = 3×6 + 3 = 18+3 = 21','이전 답에 3 더하기 전략!'],
        result:{ko:'3×6=18, 3×7=21, 3×8=24, 3×9=27 — 이전+3!', en:'3×6=18, 3×7=21, 3×8=24, 3×9=27 — previous+3!', zh:'3×6=18，3×7=21，3×8=24，3×9=27——上一个答案+3！'},
        book:null }
    ],
    rule:{ ko:'① 3단 = 3씩 더하기  ② 자릿수 합은 항상 3의 배수  ③ 잊으면 이전 답 + 3',
      en:'① 3× = skip-count by 3  ② Digit sum is always a multiple of 3  ③ Forget? Previous answer + 3',
      zh:'① 3的乘法 = 每次加3  ② 数位之和总是3的倍数  ③ 忘了？上一个答案+3' }
  },

  check:{ fills:[
    { tex:'3 \\times 7 = \\square', answer:21, hint:{ko:'3×6=18이면, 18+3=?', en:'3×6=18, so 18+3=?', zh:'3×6=18，那么18+3=？'} },
    { tex:'3 \\times 9 = \\square', answer:27, hint:{ko:'3×8=24이면, 24+3=?', en:'3×8=24, so 24+3=?', zh:'3×8=24，那么24+3=？'} }
  ], open:{ko:'3단 중에 가장 기억하기 어려운 것은 몇 단인가요? 어떻게 기억하면 좋을까요?', en:'Which 3× fact is hardest to remember? How would you memorise it?', zh:'3的乘法中哪个最难记？你会怎么记住它？'}, openHint:{ko:'예) 3×7=21이 어려워요. 21=7×3, "삼 칠 이십일"처럼 소리로 외워요!', en:'e.g. 3×7=21 is tricky. Say "three sevens are twenty-one" as a rhyme!', zh:'例）3×7=21最难记。可以像顺口溜一样说"三七二十一"来记住！'} },

  lab:{ generator:'ml2_tt25', level:'main', count:4, params:{tables:[3]}, intro:{ko:'이제 진짜 3단 마법을 써볼 차례야! 3단 곱셈을 빠르게 풀어봐.', en:"Time to cast the real 3-times spell! Solve the 3× problems quickly.", zh:'是时候施展真正的3的乘法魔法了！快速解答3的乘法题。'} },
  arena:{ generator:'ml2_tt25', level:'main', count:8, timeLimit:300, params:{tables:[3]}, rule:{ko:'5분 안에 3단 문제를 모두 풀어요!', en:'Solve all 3× problems in 5 minutes!', zh:'5分钟内解答所有3的乘法题！'} },

  stamp:{ label:{ ko:'3단 마스터', en:'Three-Times Master', zh:'3的口诀达人' }, coins:25 },
  voice:{
    correct:[{ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'},{ko:'구구단 달인! 🌟',en:'Times-table master!',zh:'口诀高手！'},{ko:'대단해! 🪄',en:'Amazing!',zh:'太棒了！'}],
    wrong:[{ko:'음~ 다시 해볼까?',en:'Hmm, try again?',zh:'嗯，再试一次？'},{ko:'거의 다 왔어!',en:'Almost!',zh:'就快了！'}],
    finish:{ ko:'완벽해! 3단 마스터 달성! 🎯✨', en:'Perfect! 3-times table master!', zh:'完美！3的乘法口诀达人！' }
  }
};
if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
