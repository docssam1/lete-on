/* Numbers of Magic — 유닛 B-14: 9단 비밀 — 10단에서 1 빼기 (중급 E 챕터14) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['B-14'] = {
  id:'B-14', tier:'intermediate', level:'B', order:14,
  generator:'ml3_tt69',
  title:{ ko:'9단 비밀 — 10단에서 1 빼기', en:'9s Secret — Ten Minus One!', zh:'9的乘法秘诀 — 用10减1！' },
  subtitle:{ ko:'9×n = 10×n - n. 10단에서 n을 빼면 끝!', en:'9×n = 10×n − n. Subtract n from 10×n!', zh:'9×n = 10×n - n，从10倍中减去n即可！' },
  icon:'9️⃣',

  practice:{
    generator:'ml3_tt69', level:'practice', count:5,
    params:{ tables:[9] },
    intro:{
      ko:'이번엔 9단 연습이야! 10×n에서 n을 빼면 돼. 준비됐지?',
      en:"9 times table practice! Try 10×n − n. Ready?",
      zh:'现在练习9的乘法！用10×n减去n。准备好了吗？'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 10단에서 1 빼기', en:'1) Ten Minus One Trick', zh:'① 10的乘法减1'},
        head:{ko:'9×n = 10×n − n', en:'9×n = 10×n − n', zh:'9×n = 10×n − n'},
        desc:{ko:'9단의 비밀은 <b>10단에서 n을 빼는 것</b>이에요! 10×n은 쉽게 계산할 수 있으니까, 거기서 n을 한 번 빼면 9×n이 돼요!',
              en:"The secret of the 9s: <b>multiply by 10, then subtract n</b>! 10×n is easy to calculate, and subtracting n once gives 9×n!",
              zh:'9的乘法秘诀：<b>先乘以10，再减去n</b>！10×n很容易计算，再减去n就得到9×n！'},
        mathSteps:['9×6 = 10×6 - 6','= 60 - 6','= 54 ✓'],
        result:{ko:'9×6=54! 10단은 쉽고, 거기서 6을 빼면 끝이에요. 9단이 이렇게 간단할 줄이야!', en:'9×6=54! 10×6=60 is easy, then subtract 6. The 9s are so simple!', zh:'9×6=54！10×6=60很容易，再减6就好了。9的乘法就这么简单！'},
        book:{ko:'9×n = 10×n − n. 예: 9×7=70−7=63, 9×8=80−8=72. 십의 자리는 n−1, 일의 자리는 10−n이 돼요.', en:'9×n = 10×n − n. e.g. 9×7 = 70−7 = 63, 9×8 = 80−8 = 72. Tens digit = n−1, units digit = 10−n.', zh:'9×n = 10×n − n。例：9×7 = 70−7 = 63，9×8 = 80−8 = 72。十位变成n−1，个位变成10−n。'} },

      { tag:{ko:'② 자릿수 합 9 규칙', en:'2) Digit-Sum = 9 Rule', zh:'② 各位数字之和=9规律'},
        head:{ko:'9단 결과의 자릿수 합은 항상 9예요', en:'9s results always have a digit-sum of 9', zh:'9的乘法结果各位数字之和总是9'},
        desc:{ko:'9단의 신기한 규칙: 결과의 <b>각 자릿수를 더하면 항상 9</b>가 나와요! 18→1+8=9, 27→2+7=9, 36→3+6=9… 이걸 알면 답을 빠르게 확인할 수 있어요!',
              en:'A magical pattern in the 9s: <b>the digits of each product always add up to 9</b>! 18→1+8=9, 27→2+7=9, 36→3+6=9… Use this to check your answers fast!',
              zh:'9的乘法有个神奇规律：每个积的<b>各位数字之和总是9</b>！18→1+8=9，27→2+7=9，36→3+6=9……用这个来快速检验答案！'},
        mathSteps:['18: 1+8=9 ✓','27: 2+7=9 ✓','36: 3+6=9 ✓','→ 자릿수 합이 9면 9의 배수!'],
        result:{ko:'9, 18, 27, 36, 45, 54, 63, 72, 81 — 전부 자릿수 합이 9! 틀린 답을 금방 찾을 수 있어요.', en:'9, 18, 27, 36, 45, 54, 63, 72, 81 — all digit-sums are 9! A quick way to spot wrong answers.', zh:'9、18、27、36、45、54、63、72、81——各位数字之和都是9！能快速发现错误答案。'},
        book:{ko:'9×n에서 십의 자리는 n−1, 일의 자리는 10−n. 두 자리 합은 (n−1)+(10−n)=9. 항상 성립해요!', en:'For 9×n: tens digit = n−1, units digit = 10−n. Sum = (n−1)+(10−n) = 9. Always true!', zh:'9×n的十位 = n−1，个位 = 10−n。之和 = (n−1)+(10−n) = 9。永远成立！'} },

      { tag:{ko:'③ 손가락 9단법', en:'3) Finger Method for 9s', zh:'③ 手指9乘法'},
        head:{ko:'손가락으로 9단을 바로 구해요', en:'Use your fingers to find 9×n instantly', zh:'用手指立刻求出9×n'},
        desc:{ko:'양 손가락 10개를 펴고, <b>n번째 손가락을 내리면</b> 왼쪽 손가락 수가 십의 자리, 오른쪽 손가락 수가 일의 자리예요! 9×3이면 3번째 손가락을 내려요.',
              en:'Spread all 10 fingers, then <b>fold down the n-th finger</b>. The fingers to the left = tens digit, fingers to the right = units digit! For 9×3, fold the 3rd finger.',
              zh:'张开10根手指，<b>弯下第n根手指</b>。弯下手指左边的手指数 = 十位，右边的 = 个位！9×3就弯下第3根手指。'},
        mathSteps:['9×3: 3번째 손가락 ↓','왼쪽 2개 → 20','오른쪽 7개 → 7','= 27 ✓'],
        result:{ko:'손가락만 있으면 9단은 언제든지! 도구 없이도 정확하게 계산할 수 있어요.', en:'With just your fingers you can do 9× anything! No tools needed — just your hands.', zh:'只要有手指，随时随地都能算9的乘法！不需要任何工具。'},
        book:null }
    ],
    rule:{ ko:'① 9×n = 10×n−n으로 계산  ② 결과의 자릿수 합은 항상 9  ③ 손가락으로 십의 자리·일의 자리 확인', en:'① 9×n = 10×n−n  ② Digit-sum of result is always 9  ③ Fold the n-th finger to read tens and ones', zh:'① 9×n = 10×n−n  ② 结果各位数字之和总是9  ③ 弯下第n根手指读出十位和个位' }
  },

  check:{
    fills:[
      { tex:'9 \\times 7 = \\square', answer:63,
        hint:{ ko:'10×7=70, 거기서 7을 빼면?', en:'10×7=70, subtract 7!', zh:'10×7=70，再减去7是多少？' } },
      { tex:'9 \\times 8 = \\square', answer:72,
        hint:{ ko:'10×8=80, 거기서 8을 빼면?', en:'10×8=80, subtract 8!', zh:'10×8=80，再减去8是多少？' } }
    ],
    open:{ ko:'손가락 9단법이 왜 항상 맞을까요? 자릿수 합이 항상 9인 이유를 수학적으로 설명해 볼 수 있나요?', en:'Why does the finger method always work for the 9s? Can you explain mathematically why the digit-sum is always 9?', zh:'手指9乘法为什么总是有效？你能用数学方法解释为什么各位数字之和总是9吗？' },
    openHint:{ ko:'예) 9×3에서 손가락 3번째 내리면 왼쪽 2개=20, 오른쪽 7개=7, 합=27. 그리고 2+7=9!', en:'e.g. 9×3: fold the 3rd finger → 2 left (tens) + 7 right (ones) = 27, and 2+7=9!', zh:'例）9×3：弯下第3根手指→左边2根（十位）+ 右边7根（个位）= 27，而2+7=9！' }
  },

  lab:{
    generator:'ml3_tt69', level:'main', count:4,
    params:{ tables:[9] },
    intro:{
      ko:'이제 9단 비밀 무기를 써볼 차례야! ×10에서 n을 빼는 전략을 써봐.',
      en:"Time to use your 9s secret weapon! Try the ×10−n strategy.",
      zh:'是时候使出9的秘密武器了！试试×10−n的策略。'
    }
  },

  arena:{
    generator:'ml3_tt69', level:'main', count:8, timeLimit:300,
    params:{ tables:[9] },
    rule:{ ko:'5분 안에 9단 문제를 모두 풀어요! ×10−n 전략을 써봐요!', en:'Solve all 9s problems in 5 minutes! Use the ×10−n strategy!', zh:'5分钟内解答所有9的口诀题！用×10−n策略！' }
  },

  stamp:{ label:{ ko:'9단 마스터', en:'Nine-Times Master', zh:'9的口诀达人' }, coins:25 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'구구단 달인! 🌟',en:'Times-table master!',zh:'口诀高手！'}, {ko:'대단해! 🪄',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'음~ 다시 해볼까?',en:'Hmm, try again?',zh:'嗯，再试一次？'}, {ko:'거의 다 왔어!',en:'Almost!',zh:'就快了！'} ],
    finish:{ ko:'완벽해! 9단 마스터야! 9️⃣✨', en:'Perfect! 9-times master!', zh:'完美！9的口诀达人！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
