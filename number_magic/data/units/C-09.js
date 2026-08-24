/* Numbers of Magic — 유닛 C-09: 자릿수 예측 마법 (중급 C 챕터1) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['C-09'] = {
  id:'C-09', tier:'intermediate', level:'C', order:9,
  generator:'ml_digit_pred',
  title:{ ko:'자릿수 예측 마법', en:'Digit Prediction Magic', zh:'位数预测魔法' },
  subtitle:{ ko:'계산 전에 답이 몇 자리일지 먼저 알아맞혀요!', en:'Predict how many digits the answer has — before computing!', zh:'计算前先预测答案有几位数！' },
  icon:'🔮',

  practice:{
    generator:'ml_digit_pred', level:'practice', count:5,
    params:{},
    intro:{
      ko:'곱셈을 하기 전에 답이 몇 자리 수일지 먼저 예측할 거야. 앞자리끼리 곱해보면 힌트가 보여! 준비됐지?',
      en:"Before multiplying, we'll predict how many digits the answer has. Multiplying the lead digits gives the clue! Ready?",
      zh:'乘之前先预测答案有几位数。前面的数字相乘就有线索！准备好了吗？'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 왜 자릿수를 예측할까?',en:'1) Why predict digits?',zh:'① 为什么预测位数？'},
        head:{ko:'답의 크기를 알면 실수가 안 보여도 보여요!',en:'Knowing the answer\'s size exposes mistakes instantly!',zh:'知道答案的大小，错误立刻现形！'},
        desc:{ko:'23×41을 계산했는데 답이 94가 나왔다면? <b>뭔가 이상해요!</b> 20×40만 해도 800이니까 답은 최소 3자리여야 해요. 이렇게 <b>계산 전에 자릿수를 예측</b>하면, 계산 실수를 스스로 잡아낼 수 있어요. 수학 마법사의 안전벨트예요!',
              en:'You computed 23×41 and got 94? <b>Something\'s wrong!</b> Even 20×40 is already 800, so the answer needs at least 3 digits. <b>Predicting the digit count first</b> lets you catch your own mistakes — a maths wizard\'s safety belt!',
              zh:'算23×41得到94？<b>不对劲！</b>光20×40就有800了，答案至少要3位数。<b>先预测位数</b>就能自己发现计算错误——这是数学魔法师的安全带！'},
        mathSteps:['23 × 41 ≈ ?','20 × 40 = 800','→ 답은 800보다 커요','→ 최소 3자리!'],
        result:{ko:'앞자리 어림 20×40=800 → 답은 3자리 이상이에요.',en:'Lead estimate 20×40=800 → the answer has 3+ digits.',zh:'前位估算20×40=800→答案至少3位。'},
        book:{ko:'두 자리×두 자리의 답은 항상 3자리(10×10=100) 이상, 4자리(99×99=9801) 이하예요. 3자리냐 4자리냐만 가려내면 돼요.',
              en:'A 2-digit × 2-digit product is always between 3 digits (10×10=100) and 4 digits (99×99=9801). You only need to decide: 3 or 4?',
              zh:'两位数×两位数的积总是在3位(10×10=100)到4位(99×99=9801)之间。只需判断是3位还是4位。'} },

      { tag:{ko:'② 십의 자리끼리 곱하기',en:'2) Multiply the tens digits',zh:'② 十位相乘'},
        head:{ko:'앞자리 곱이 10 이상이면 4자리!',en:'Lead product ≥ 10 means 4 digits!',zh:'前位积≥10就是4位数！'},
        desc:{ko:'빠른 판별법: <b>십의 자리끼리 곱해요</b>. 34×26 → 3×2=6 → 30×20=600 근처 → <b>3자리 가능성</b>. 47×38 → 4×3=12 → 40×30=1200 근처 → <b>4자리</b>! 앞자리 곱이 10을 넘으면 거의 확실히 4자리예요. 애매하면(6~9) 진짜 계산으로 확인해요.',
              en:'Quick test: <b>multiply the tens digits</b>. 34×26 → 3×2=6 → near 30×20=600 → <b>likely 3 digits</b>. 47×38 → 4×3=12 → near 40×30=1200 → <b>4 digits</b>! If the lead product exceeds 10, it\'s almost surely 4 digits. If it\'s borderline (6–9), verify by computing.',
              zh:'快速判别：<b>十位相乘</b>。34×26 → 3×2=6 → 接近30×20=600 → <b>可能是3位</b>。47×38 → 4×3=12 → 接近40×30=1200 → <b>4位</b>！前位积超过10几乎肯定是4位。模糊时(6~9)就实际算一算。'},
        mathSteps:['47 × 38','4 × 3 = 12 (앞자리 곱)','40×30 = 1200','→ 4자리 예측!'],
        result:{ko:'앞자리 곱 12 ≥ 10 → 4자리! 실제로 47×38=1786.',en:'Lead product 12 ≥ 10 → 4 digits! Indeed 47×38=1786.',zh:'前位积12≥10→4位！实际47×38=1786。'},
        book:{ko:'경계 조심: 앞자리 곱이 9라도 4자리가 될 수 있어요(예: 92×99=9108… 아님 4자리 맞음; 32×31=992는 3자리). 어림 후 일의 자리 영향을 생각해요.',
              en:'Borderline care: even a lead product of 9 can go either way (32×31=992 is 3 digits; 39×29=1131 is 4). After estimating, consider the ones digits\' push.',
              zh:'边界要小心：前位积是9也可能两种情况(32×31=992是3位；39×29=1131是4位)。估算后要考虑个位的影响。'} },

      { tag:{ko:'③ 예측 → 계산 → 확인',en:'3) Predict → compute → verify',zh:'③ 预测→计算→验证'},
        head:{ko:'마법사의 3단계 습관',en:'The wizard\'s three-step habit',zh:'魔法师的三步习惯'},
        desc:{ko:'이제 습관을 만들어요: ①<b>예측</b> — 앞자리 곱으로 자릿수 짐작 ②<b>계산</b> — 배운 전략(쪼개기·세로셈)으로 정확히 ③<b>확인</b> — 답이 예측한 자릿수와 맞는지 검사. 예측과 다르면 어딘가 실수가 있다는 신호예요!',
              en:'Build the habit: ①<b>Predict</b> — guess the digit count from the lead product ②<b>Compute</b> — use your strategies (splitting, columns) ③<b>Verify</b> — does the answer match the predicted size? A mismatch signals a mistake somewhere!',
              zh:'养成习惯：①<b>预测</b>——用前位积猜位数 ②<b>计算</b>——用学过的策略(拆分、竖式)算准 ③<b>验证</b>——答案和预测的位数一致吗？不一致就说明哪里错了！'},
        mathSteps:['① 예측: 3×2=6 → 3자리쯤','② 계산: 34×26=884','③ 확인: 884는 3자리 ✓'],
        result:{ko:'예측✓ 계산✓ 확인✓ — 세 단계가 완벽한 답을 만들어요!',en:'Predict✓ Compute✓ Verify✓ — three steps make a perfect answer!',zh:'预测✓ 计算✓ 验证✓——三步造就完美答案！'},
        book:null }
    ],
    rule:{ ko:'① 계산 전 십의 자리끼리 곱해 크기 어림  ② 앞자리 곱 10 이상이면 4자리  ③ 답과 예측을 꼭 비교',
      en:'① Before computing, multiply tens digits to estimate size  ② Lead product ≥ 10 → 4 digits  ③ Always compare answer vs prediction',
      zh:'① 计算前十位相乘估大小  ② 前位积≥10则4位  ③ 答案一定要和预测对比' }
  },

  check:{
    fills:[
      { tex:'21 \\times 43 = \\square', answer:903,
        hint:{ ko:'2×4=8 → 3자리 예측. 21×43=21×40+21×3=?', en:'2×4=8 → predict 3 digits. 21×43=21×40+21×3=?', zh:'2×4=8→预测3位。21×43=21×40+21×3=？' } },
      { tex:'42 \\times 31 = \\square', answer:1302,
        hint:{ ko:'4×3=12 → 4자리 예측. 42×31=42×30+42=?', en:'4×3=12 → predict 4 digits. 42×31=42×30+42=?', zh:'4×3=12→预测4位。42×31=42×30+42=？' } }
    ],
    open:{ ko:'친구가 28×34=252라고 답했어요. 계산하지 않고도 틀렸다고 알 수 있는 이유를 설명해 봐요.',
      en:'A friend says 28×34=252. Explain how you know it\'s wrong without computing.',
      zh:'朋友说28×34=252。解释不用计算怎么知道是错的。' },
    openHint:{ ko:'예) 앞자리만 곱해도 20×30=600. 답은 600보다 커야 하는데 252는 너무 작아요. 실제 답은 952.',
      en:'e.g. Just the lead digits give 20×30=600. The answer must exceed 600, but 252 is far too small. The real answer is 952.',
      zh:'例）光前位相乘就有20×30=600。答案必须大于600，252太小了。真正的答案是952。' }
  },

  lab:{
    generator:'ml_digit_pred', level:'main', count:4,
    params:{},
    intro:{
      ko:'자릿수 예측 마법! 앞자리 곱으로 먼저 예측하고 계산해봐.',
      en:'Digit prediction magic! Predict with the lead product, then compute.',
      zh:'位数预测魔法！先用前位积预测，再计算。'
    }
  },

  arena:{
    generator:'ml_digit_pred', level:'main', count:8, timeLimit:300,
    params:{},
    rule:{ ko:'5분 안에 예측+계산 문제를 모두 풀어요!', en:'Solve all predict-and-compute problems in 5 minutes!', zh:'5分钟内解答所有预测计算题！' }
  },

  stamp:{ label:{ ko:'예측 마법사', en:'Prediction Wizard', zh:'预测魔法师' }, coins:30 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'예측 적중! 🔮',en:'Prediction hit!',zh:'预测命中！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'십의 자리끼리 먼저 곱해봐!',en:'Multiply the tens digits first!',zh:'先把十位相乘！'}, {ko:'답의 크기를 어림해봐!',en:'Estimate the answer\'s size!',zh:'估一估答案的大小！'} ],
    finish:{ ko:'완벽해! 예측 마법사! 🔮✨', en:'Perfect! Prediction Wizard!', zh:'完美！预测魔法师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
