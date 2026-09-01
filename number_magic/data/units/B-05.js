/* Numbers of Magic — 유닛 B-05: 5단 곱셈구구 (중급 B 챕터5) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['B-05'] = {
  id:'B-05', tier:'intermediate', level:'B', order:5,
  generator:'ml2_tt25',
  title:{ ko:'5단 곱셈구구', en:'Times Table: 5', zh:'乘法口诀：5的乘法' },
  subtitle:{ ko:'5×1부터 5×9까지 — 5씩 뛰어요!', en:'5×1 to 5×9 — skip count by 5!', zh:'5×1到5×9 — 5个5个地数！' },
  icon:'5️⃣',

  practice:{
    generator:'ml2_tt25', level:'practice', count:5,
    params:{ tables:[5] },
    intro:{
      ko:'자, 5단 곱셈구구를 연습해 볼까! 5×□를 말할게, 바로 답을 눌러줘. 준비됐지?',
      en:"Let's practice the 5s table! I'll give you a 5× problem — tap the answer fast. Ready?",
      zh:'来练习5的乘法口诀！我出5×□，你快速按出答案。准备好了吗？'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ ko:'① 5단 = 5씩 뛰어세기!', en:'1) ×5 = skip count by 5!', zh:'① 乘5=5个5个地数！' },
        head:{ ko:'5, 10, 15, 20... 시계 분침처럼 뛰어요', en:'5, 10, 15, 20 … like clock minute marks!', zh:'5, 10, 15, 20……像时钟的分钟刻度！' },
        desc:{ ko:'5×1=5, 5×2=10, 5×3=15... <b>시계의 분 단위와 똑같아요</b>! 5씩 뛰어 세면 5단이 완성돼요.',
               en:'5×1=5, 5×2=10, 5×3=15 … <b>just like the minute hand on a clock</b>! Skip by 5 and you know the 5s table.',
               zh:'5×1=5，5×2=10，5×3=15……<b>和时钟的分钟刻度一模一样</b>！5个5个跳就能记住5的乘法。' },
        mathSteps:['5×1=5','5×2=10','5×3=15','5×4=20','5×5=25'],
        result:{ ko:'5×5=25까지: 5, 10, 15, 20, 25!', en:'Up to 5×5=25: 5, 10, 15, 20, 25!', zh:'到5×5=25：5, 10, 15, 20, 25！' },
        book:{ ko:'5단 = 시계 분침처럼 5씩 뛰어세기! 5, 10, 15, 20, 25, 30, 35, 40, 45', en:'5s table = skip count by 5 like clock minutes! 5, 10, 15 … 45', zh:'5的乘法=像时钟分针一样5个5个跳！5, 10, 15……45' } },

      { tag:{ ko:'② 끝자리 패턴', en:'2) Last-digit pattern', zh:'② 末位规律' },
        head:{ ko:'5단 결과는 끝이 항상 0 또는 5예요', en:'5s results always end in 0 or 5', zh:'5的乘法结果末位总是0或5' },
        desc:{ ko:'5×1=5(끝:5), 5×2=10(끝:0), 5×3=15(끝:5), 5×4=20(끝:0)... <b>0과 5가 번갈아 나와요</b>!',
               en:'5×1=5 (ends 5), 5×2=10 (ends 0), 5×3=15 (ends 5), 5×4=20 (ends 0) … <b>0 and 5 take turns</b>!',
               zh:'5×1=5（末位5），5×2=10（末位0），5×3=15（末位5），5×4=20（末位0）……<b>0和5交替出现</b>！' },
        mathSteps:[{ko:'5×1=5 (끝:5)',en:'5×1=5 \\text{ (ends in 5)}',zh:'5×1=5（末位5）'},{ko:'5×2=10 (끝:0)',en:'5×2=10 \\text{ (ends in 0)}',zh:'5×2=10（末位0）'},{ko:'5×3=15 (끝:5)',en:'5×3=15 \\text{ (ends in 5)}',zh:'5×3=15（末位5）'},{ko:'5×4=20 (끝:0)',en:'5×4=20 \\text{ (ends in 0)}',zh:'5×4=20（末位0）'},{ko:'→ 0과 5 반복!',en:'→ \\text{0 and 5 repeat!}',zh:'→ 0和5循环！'}],
        result:{ ko:'5단 끝자리: 5, 0, 5, 0, 5, 0, 5, 0, 5 — 완벽한 규칙! ✓', en:'5s last digits: 5,0,5,0,5,0,5,0,5 — perfect pattern! ✓', zh:'5的乘法末位：5,0,5,0,5,0,5,0,5——完美规律！✓' },
        book:null },

      { tag:{ ko:'③ 2단과의 관계', en:'3) Connection to the 2s table', zh:'③ 与2的乘法的关系' },
        head:{ ko:'5와 2는 서로의 짝꿍이에요', en:'5 and 2 are partners!', zh:'5和2是好伙伴！' },
        desc:{ ko:'5×4=20, 2×10=20 — 같아요! 5×짝수는 2와 연결돼요. 5×6=30, 30÷2=15=5×3. 신기하죠?',
               en:'5×4=20 and 2×10=20 — equal! ×5 with even numbers connects to ×2. 5×6=30, half of 30=15=5×3.',
               zh:'5×4=20，2×10=20——相等！5乘偶数与2的乘法有联系。5×6=30，30÷2=15=5×3。' },
        mathSteps:['5×4 = 2×10?','5×4=20, 2×10=20 ✓',{ko:'5 × 짝수 = 2 × (5배의 절반)',en:'5 × \\text{even} = 2 × \\text{(5 × the half)}',zh:'5 × 偶数 = 2 ×（一半的5倍）'}],
        result:{ ko:'5×4 = 2×10 = 20 ✓', en:'5×4 = 2×10 = 20 ✓', zh:'5×4 = 2×10 = 20 ✓' },
        book:null }
    ],
    rule:{ ko:'① 5단 = 5씩 뛰어세기  ② 결과 끝자리는 항상 0 또는 5  ③ 5×짝수 = 2×(같은 수의 절반×5)',
      en:'① ×5 = skip count by 5  ② results always end in 0 or 5  ③ 5×even connects to the 2s table',
      zh:'①乘5=5个5个跳 ②结果末位总是0或5 ③5×偶数与2的乘法相关' }
  },

  check:{
    fills:[
      { tex:'5 \\times 6 = \\square', answer:30,
        hint:{ ko:'5씩 6번: 5, 10, 15, 20, 25, 30!', en:'Count by 5s, 6 times: 5, 10, 15, 20, 25, 30!', zh:'5个5个数6次：5, 10, 15, 20, 25, 30！' } },
      { tex:'5 \\times 9 = \\square', answer:45,
        hint:{ ko:'5씩 9번: 5, 10, 15, 20, 25, 30, 35, 40, 45!', en:'Count by 5s, 9 times: 5, 10 … 45!', zh:'5个5个数9次：5, 10……45！' } }
    ],
    open:{ ko:'5단 결과의 끝자리가 항상 0 또는 5인 이유를 설명해볼까요?',
           en:'Can you explain why 5s-table results always end in 0 or 5?',
           zh:'你能解释为什么5的乘法结果末位总是0或5吗？' },
    openHint:{ ko:'예) 0+5=5, 5+5=10, 10+5=15, 15+5=20... 5를 더할 때마다 끝자리가 0→5→0→5 반복해요!',
               en:'e.g. 0+5=5, 5+5=10, 10+5=15 … Adding 5 each time makes the last digit alternate 0→5→0→5!',
               zh:'例）0+5=5，5+5=10，10+5=15……每次加5，末位交替0→5→0→5！' }
  },

  lab:{
    generator:'ml2_tt25', level:'main', count:4,
    params:{ tables:[5] },
    intro:{ ko:'이제 5단 마법 실험실! 5씩 뛰는 마법으로 문제를 풀어봐!',
            en:'Welcome to the 5s Magic Lab! Use the skip-by-5 power to solve these!',
            zh:'欢迎来到5的魔法实验室！用5个5个跳的魔法解题！' }
  },

  arena:{
    generator:'ml2_tt25', level:'main', count:8, timeLimit:300,
    params:{ tables:[5] },
    rule:{ ko:'5분 안에 5단 문제를 최대한 많이 풀어봐!', en:'Solve as many 5s-table problems as you can in 5 minutes!', zh:'5分钟内尽量多做5的乘法题！' }
  },

  stamp:{ label:{ ko:'5단 마스터', en:'Five-Times Master', zh:'5的口诀达人' }, coins:25 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'구구단 달인! 🌟',en:'Times-table master!',zh:'口诀高手！'}, {ko:'대단해! 🪄',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'음~ 다시 해볼까?',en:'Hmm, try again?',zh:'嗯，再试一次？'}, {ko:'거의 다 왔어!',en:'Almost!',zh:'就快了！'} ],
    finish:{ ko:'완벽해! 이제 넌 5단 마스터야! 5️⃣✨', en:"Perfect! You're a Five-Times Master now! 5️⃣✨", zh:'完美！你现在是5的口诀达人啦！5️⃣✨' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
