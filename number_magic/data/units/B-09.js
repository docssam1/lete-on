/* Numbers of Magic — 유닛 B-09: 3단·6단 혼합 — 자릿수 합 마법 (중급 C 챕터9) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['B-09'] = {
  id:'B-09', tier:'intermediate', level:'B', order:9,
  generator:'ml3_tt69',
  title:{ ko:'3단·6단 혼합 — 자릿수 합 마법', en:'3s & 6s Mix — Digit Sum Magic', zh:'3和6的口诀混合 — 数位和魔法' },
  subtitle:{ ko:'자릿수 합이 3의 배수면 3의 배수!', en:'If digit sum is divisible by 3, so is the number!', zh:'数位之和是3的倍数，则该数是3的倍数！' },
  icon:'🔢',

  practice:{
    generator:'ml3_tt69', level:'practice', count:5,
    params:{ tables:[3,6] },
    intro:{
      ko:'3단과 6단이 섞여 나올 거야. 잘 보고 정답을 눌러줘! 준비됐지?',
      en:"3× and 6× problems are mixed together. Look carefully and tap the answer! Ready?",
      zh:'3的乘法和6的乘法混在一起出现。仔细看，按出答案！准备好了吗？'
    }
  },

  discover:{
    story:{
      hook:{ ko:'우유갑 바코드 아래 13자리 숫자, 맨 끝 한 자리는 왜 붙어 있을까요?',
        en:'The 13 digits under a milk carton barcode — why is that last one there?',
        zh:'牛奶盒条形码下面的13位数字，最后一位是干什么的？' },
      history:{ ko:'앞 12자리 중 짝수 번째 수만 3을 곱해 전부 더한 뒤, 일의 자리를 10에서 빼면 13번째 수가 나와요. 계산기가 바코드를 잘못 읽으면 이 수가 맞지 않아 삑 소리가 나죠. 자릿수를 더해 3의 배수인지 알아보는 마법과 뿌리가 같은 방법이에요.',
        en:'Multiply every even-position digit of the first 12 by 3, add them all, then subtract the ones place from 10 — that gives the 13th digit. If the scanner misreads, the number no longer matches and it beeps. Same root as checking multiples of 3 by adding digits.',
        zh:'把前12位中偶数位的数字乘以3后全部相加，再用10减去个位，就得到第13位数。扫描仪读错时这个数对不上，就会报错。和用数位和判断3的倍数是同一个根。' }
    },
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 3단·6단은 한 가족', en:'1) 3× and 6× are a family', zh:'① 3的乘法和6的乘法是一家人'},
        head:{ko:'6의 배수는 모두 3의 배수예요', en:'Every multiple of 6 is also a multiple of 3', zh:'6的倍数都是3的倍数'},
        desc:{ko:'3과 6은 특별한 관계예요. <b>6의 배수는 모두 3의 배수</b>이고, 3의 배수 중 <b>짝수는 6의 배수</b>예요. 두 단을 함께 외우면 더욱 강해져요!',
              en:'3 and 6 have a special relationship. <b>Every multiple of 6 is also a multiple of 3</b>, and any <b>even multiple of 3 is also a multiple of 6</b>. Learning them together makes you twice as strong!',
              zh:'3和6有特殊关系。<b>6的每个倍数都是3的倍数</b>，而3的倍数中<b>偶数也是6的倍数</b>。一起学两张口诀表，实力翻倍！'},
        mathSteps:[{ko:'3의 배수: 3,6,9,12,15,18,21,24,27',en:'\\text{multiples of 3: } 3,6,9,12,15,18,21,24,27',zh:'3的倍数：3,6,9,12,15,18,21,24,27'},{ko:'6의 배수: 6,12,18,24,30,36,42,48,54',en:'\\text{multiples of 6: } 6,12,18,24,30,36,42,48,54',zh:'6的倍数：6,12,18,24,30,36,42,48,54'},{ko:'6의 배수 ⊂ 3의 배수!',en:'\\text{multiples of 6} ⊂ \\text{multiples of 3!}',zh:'6的倍数 ⊂ 3的倍数！'}],
        result:{ko:'6의 배수(6,12,18,24…)는 전부 3의 배수에 들어 있어요. 집합 관계!', en:'All 6× answers (6, 12, 18, 24 …) appear inside the 3× list. It is a subset!', zh:'所有6的倍数（6、12、18、24……）都包含在3的倍数中，是子集关系！'},
        book:{ko:'6의 배수 ⊂ 3의 배수. 이 집합 관계를 알면 "이 수가 3의 배수인가? 6의 배수인가?" 두 가지를 한꺼번에 판단할 수 있어요.', en:'6× ⊂ 3×. Knowing this subset relationship lets you decide at once whether a number is a multiple of 3, of 6, or both.', zh:'6的倍数 ⊂ 3的倍数。知道这个子集关系，就能一次判断一个数是3的倍数、6的倍数还是两者都是。'} },

      { tag:{ko:'② 자릿수 합 = 3의 배수 판별법', en:'2) Digit-sum divisibility rule for 3', zh:'② 数位之和判断是否是3的倍数'},
        head:{ko:'자릿수를 더해 3으로 나눠봐요', en:'Add the digits and divide by 3', zh:'把各位数字相加，看能否被3整除'},
        desc:{ko:'신기한 마법이에요! 어떤 수의 <b>각 자리 숫자를 더해서</b> 그 합이 3의 배수이면, 그 수도 3의 배수예요. 세 자리 수도 같아요!',
              en:'Here is amazing magic! <b>Add up all the digits</b> of a number. If the sum is divisible by 3, so is the whole number — even for three-digit numbers!',
              zh:'这是神奇的魔法！把一个数的<b>各位数字加起来</b>，如果和能被3整除，那么这个数也能被3整除——三位数也一样！'},
        mathSteps:[{ko:'123 → 1+2+3=6 ✓ (3의 배수)',en:'123 → 1+2+3=6 ✓ \\text{ (multiple of 3)}',zh:'123 → 1+2+3=6 ✓（3的倍数）'},{ko:'124 → 1+2+4=7 ✗ (3의 배수 아님)',en:'124 → 1+2+4=7 ✗ \\text{ (not a multiple of 3)}',zh:'124 → 1+2+4=7 ✗（不是3的倍数）'},{ko:'126 → 1+2+6=9 ✓ (6의 배수도!)',en:'126 → 1+2+6=9 ✓ \\text{ (multiple of 6 too!)}',zh:'126 → 1+2+6=9 ✓（也是6的倍数！）'}],
        result:{ko:'123은 3의 배수! 126은 3의 배수이자 6의 배수(짝수라서)! 124는 둘 다 아니에요.', en:'123 is a multiple of 3! 126 is a multiple of both 3 and 6 (it is even)! 124 is neither.', zh:'123是3的倍数！126既是3的倍数又是6的倍数（因为是偶数）！124两者都不是。'},
        book:{ko:'3의 배수 판별: 자릿수 합이 3의 배수인지 확인. 6의 배수 판별: 짝수이면서 자릿수 합이 3의 배수인지 확인. 두 조건 모두 만족해야 6의 배수예요.', en:'Multiple of 3 test: digit sum divisible by 3. Multiple of 6 test: number is even AND digit sum divisible by 3. Both conditions must hold for 6.', zh:'3的倍数判断：数位之和能被3整除。6的倍数判断：数是偶数且数位之和能被3整除。两个条件都满足才是6的倍数。'} },

      { tag:{ko:'③ 3×□, 6×□ 빠르게', en:'3) Fast recall for 3× and 6×', zh:'③ 快速回忆3的乘法和6的乘法'},
        head:{ko:'이전 값에 3(또는 6)을 더하는 전략!', en:'Add 3 (or 6) to the previous answer!', zh:'在上一个答案上加3（或6）！'},
        desc:{ko:'3단과 6단을 모두 빠르게 구하려면 <b>이전 답 + 단수</b> 전략이 최고예요. 3단은 이전+3, 6단은 이전+6! 패턴 암기보다 이 전략이 훨씬 믿음직해요.',
              en:'To quickly find any 3× or 6× answer, the <b>previous answer + table number</b> strategy is best. For 3×: previous+3. For 6×: previous+6! This strategy is far more reliable than brute memorisation.',
              zh:'要快速算出3的乘法和6的乘法，<b>上一个答案+口诀数字</b>的策略最好用。3的乘法：上一个答案+3；6的乘法：上一个答案+6！这个策略比死记硬背可靠多了。'},
        mathSteps:[{ko:'3×8: 3×7=21이면, 21+3=24',en:'3×8: \\text{if } 3×7=21, \\text{then } 21+3=24',zh:'3×8：若3×7=21，则21+3=24'},{ko:'6×8: 6×7=42이면, 42+6=48',en:'6×8: \\text{if } 6×7=42, \\text{then } 42+6=48',zh:'6×8：若6×7=42，则42+6=48'},{ko:'패턴 암기보다 이전값+단 전략!',en:'\\text{previous value + table number beats rote!}',zh:'与其死记，不如上一个值+口诀数！'}],
        result:{ko:'3×9: 3×8=24이면, 24+3=27. 6×9: 6×8=48이면, 48+6=54. 이전+단수로 OK!', en:'3×9: know 3×8=24, so 24+3=27. 6×9: know 6×8=48, so 48+6=54. Previous + table number = done!', zh:'3×9：知道3×8=24，所以24+3=27。6×9：知道6×8=48，所以48+6=54。上一个答案+口诀数字=搞定！'},
        book:null }
    ],
    rule:{ ko:'① 6의 배수는 3의 배수에 포함  ② 자릿수 합이 3의 배수 → 3의 배수  ③ 짝수이면서 ②이면 → 6의 배수  ④ 모르면 이전 답 + 단수',
      en:'① Every 6× answer is also a 3× answer  ② Digit sum divisible by 3 → multiple of 3  ③ Even + ② → multiple of 6  ④ Forget? Previous answer + table number',
      zh:'① 6的每个倍数也是3的倍数  ② 数位之和是3的倍数→3的倍数  ③ 偶数且②→6的倍数  ④ 忘了？上一个答案+口诀数字' }
  },

  check:{ fills:[
    { tex:'3 \\times 8 = \\square', answer:24, hint:{ko:'3×7=21이면, 21+3=?', en:'3×7=21, so 21+3=?', zh:'3×7=21，那么21+3=？'} },
    { tex:'6 \\times 8 = \\square', answer:48, hint:{ko:'3×8=24이면, 24×2=?', en:'3×8=24, so 24×2=?', zh:'3×8=24，那么24×2=？'} }
  ], open:{ko:'어떤 수를 보고 3의 배수인지 6의 배수인지 빨리 판단하려면 어떻게 하면 좋을까요?', en:'How can you quickly tell whether a number is a multiple of 3, a multiple of 6, or neither?', zh:'看到一个数，怎样快速判断它是3的倍数、6的倍数，还是两者都不是？'}, openHint:{ko:'예) 72: 7+2=9 → 3의 배수 ✓. 짝수 ✓ → 6의 배수도! 자릿수 합과 홀짝 확인!', en:'e.g. 72: 7+2=9 → multiple of 3 ✓. Even ✓ → multiple of 6 too! Check digit sum, then odd/even.', zh:'例）72：7+2=9→3的倍数✓，偶数✓→也是6的倍数！检查数位之和，再看奇偶性。'} },

  lab:{ generator:'ml3_tt69', level:'main', count:4, params:{tables:[3,6]}, intro:{ko:'이제 3단과 6단을 섞어서 풀어볼 차례야! 어떤 전략을 쓸지 생각하면서 풀어봐.', en:"Now mix it up — 3× and 6× together! Think about which strategy to use as you solve.", zh:'现在混合练习3的乘法和6的乘法！解题时思考用哪种策略。'} },
  arena:{ generator:'ml3_tt69', level:'main', count:8, timeLimit:300, params:{tables:[3,6]}, rule:{ko:'5분 안에 3단·6단 혼합 문제를 모두 풀어요!', en:'Solve all mixed 3× and 6× problems in 5 minutes!', zh:'5分钟内解答所有3的乘法和6的乘法混合题！'} },

  stamp:{ label:{ ko:'3·6단 달인', en:'3 & 6 Times Pro', zh:'3和6口诀达人' }, coins:25 },
  voice:{
    correct:[{ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'},{ko:'구구단 달인! 🌟',en:'Times-table master!',zh:'口诀高手！'},{ko:'대단해! 🪄',en:'Amazing!',zh:'太棒了！'}],
    wrong:[{ko:'음~ 다시 해볼까?',en:'Hmm, try again?',zh:'嗯，再试一次？'},{ko:'거의 다 왔어!',en:'Almost!',zh:'就快了！'}],
    finish:{ ko:'완벽해! 3단·6단 달인 등극! 🎯✨', en:'Perfect! You are a 3 & 6 Times Pro!', zh:'完美！3和6口诀达人！' }
  }
};
if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
