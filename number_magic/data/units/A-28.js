/* Numbers of Magic — 유닛 A-28: 가우스 덧셈 1 (초급 G 챕터3) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};
window.NM_UNITS['A-28'] = {
  id:'A-28', tier:'beginner', level:'A', order:28,
  lineage:['rainbow-sum'],
  generator:'gaussAdd1',
  title:{ ko:'가우스 덧셈 1', en:'Gauss Addition 1', zh:'高斯加法 1' },
  subtitle:{ ko:'1부터 N까지 합은 (N×(N+1))÷2예요', en:'Sum from 1 to N equals N×(N+1)÷2', zh:'1到N的和等于N×(N+1)÷2' },
  icon:'🧮',

  practice:{
    generator:'gaussAdd1', level:'practice', count:5,
    intro:{ ko:'짝을 지어 합을 구하는 가우스 마법이에요!', en:'Gauss\'s pairing trick to find the sum!', zh:'用高斯配对法求和！' }
  },

  discover:{
    story:{
      hook:{ ko:'1부터 100까지 더하려면 99번을 더해야 해요. 짝을 지으면 몇 번이면 될까요?',
        en:'Adding 1 to 100 one at a time takes 99 additions. How many do you need if you pair them up?',
        zh:'从1加到100要加99次。如果两两配对，需要几次呢？' },
      history:{ ko:'수열 문제 중 가장 오래된 것은 약 4,000년 전 이집트의 린드 파피루스에 있어요 — 곡물을 다섯 사람에게 일정한 차이로 나누는 문제였죠. 어린 가우스가 1~100의 합을 몇 초 만에 구했다는 이야기는 전해지는 일화예요.',
        en:'The oldest known sequence problem is in the Egyptian Rhind Papyrus, about 4,000 years old — sharing grain among five people with a constant difference. The tale of young Gauss summing 1 to 100 in seconds is a story handed down, not a record.',
        zh:'已知最古老的数列问题出现在约4000年前的埃及莱因德纸草书中——把谷物按固定差额分给五个人。年幼高斯几秒内算出1到100之和的故事，是流传下来的轶事。' }
    },
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ ko:'① 앞뒤를 짝지으면 항상 같아요', en:'1) Pairing front and back always gives the same sum', zh:'① 首尾配对，每对和相同' },
        head:{ ko:'1+2+...+10을 짝으로 묶어봐요', en:'Group 1+2+...+10 into pairs', zh:'把1+2+...+10配成对' },
        desc:{ ko:'1+10=11, 2+9=11, 3+8=11, 4+7=11, 5+6=11. 짝이 5개니까 11×5=55!',
               en:'1+10=11, 2+9=11, 3+8=11, 4+7=11, 5+6=11. Five pairs: 11×5=55!',
               zh:'1+10=11，2+9=11，3+8=11，4+7=11，5+6=11。5对，所以11×5=55！' },
        mathSteps:['1+2+3+...+10 = □','짝의 합: 1+10 = 11','짝의 수: 10 ÷ 2 = 5','11 × 5 = 55'],
        result:{ ko:'1~10의 합 = 55 ✓', en:'Sum 1 to 10 = 55 ✓', zh:'1到10的和=55 ✓' },
        book:{ ko:'가우스 공식: (첫수+끝수) × 개수 ÷ 2 = (1+N) × N ÷ 2', en:'Gauss formula: (first+last) × count ÷ 2 = (1+N) × N ÷ 2', zh:'高斯公式：(首+末)×个数÷2=(1+N)×N÷2' } },
      { tag:{ ko:'② 공식으로 빠르게 계산해요', en:'2) Fast calculation with the formula', zh:'② 用公式快速计算' },
        head:{ ko:'N×(N+1)÷2를 기억해요', en:'Remember N×(N+1)÷2', zh:'记住N×(N+1)÷2' },
        desc:{ ko:'1부터 12까지 합: 12×13÷2=156÷2=78!',
               en:'Sum from 1 to 12: 12×13÷2=156÷2=78!',
               zh:'1到12的和：12×13÷2=156÷2=78！' },
        mathSteps:['1+2+...+12 = □','N=12, N×(N+1) = 12×13 = 156','156 ÷ 2 = 78'],
        result:{ ko:'1~12의 합 = 78 ✓', en:'Sum 1 to 12 = 78 ✓', zh:'1到12的和=78 ✓' },
        book:null }
    ],
    rule:{ ko:'① 짝의 합 = 1 + N  ② 짝의 개수 = N ÷ 2  ③ 합 = (1+N) × N ÷ 2',
      en:'① Pair sum = 1 + N  ② Number of pairs = N ÷ 2  ③ Total = (1+N) × N ÷ 2',
      zh:'①每对的和=1+N ②对数=N÷2 ③总和=(1+N)×N÷2' }
  },

  check:{
    fills:[
      { tex:'1+2+\\cdots+10: (1+10)\\times \\square =55', answer:5,
        hint:{ ko:'짝의 수: 10÷2=5', en:'Pairs: 10÷2=5', zh:'对数：10÷2=5' } },
      { tex:'1+2+\\cdots+12=12\\times 13\\div 2=\\square', answer:78,
        hint:{ ko:'12×13=156, 156÷2=78', en:'12×13=156, 156÷2=78', zh:'12×13=156，156÷2=78' } }
    ],
    open:{ ko:'가우스가 1부터 100까지 순식간에 더한 방법을 설명해봐요.', en:'Explain how Gauss instantly summed numbers from 1 to 100.', zh:'说说高斯怎样瞬间算出1到100的和。' },
    openHint:{ ko:'1+100=101이 되는 짝이 50개. 101×50=5050. 직접 100번 더하지 않아도 돼요!', en:'50 pairs each summing to 101: 101×50=5050. No need to add 100 times!', zh:'50对，每对和101：101×50=5050。不用真的加100次！' }
  },

  lab:{ generator:'gaussAdd1', level:'main', count:4,
    intro:{ ko:'가우스처럼 빠르게! 짝을 찾아요!', en:'Fast as Gauss! Find the pairs!', zh:'像高斯一样快！找出配对！' } },

  arena:{ generator:'gaussAdd1', level:'main', count:8, timeLimit:300,
    rule:{ ko:'5분 안에 최대한! (1+N)×N÷2!', en:'As many as you can! (1+N)×N÷2!', zh:'5分钟内尽量多做！(1+N)×N÷2！' } },

  stamp:{ label:{ ko:'가우스 마법사', en:'Gauss Wizard', zh:'高斯魔法师' }, coins:20 },

  voice:{
    correct:[ {ko:'가우스 완성! 🧮✨',en:'Gauss formula!',zh:'高斯公式！✨'}, {ko:'짝 짓기 성공!',en:'Pairing perfect!',zh:'配对成功！'} ],
    wrong:[ {ko:'(1+N)×N÷2를 써봐!',en:'Use (1+N)×N÷2!',zh:'用(1+N)×N÷2！'}, {ko:'짝을 만들어서 계산해봐!',en:'Make pairs first!',zh:'先配对再算！'} ],
    finish:{ ko:'완벽해! 가우스 마법사야! 🧮✨', en:"Perfect! You're a Gauss wizard!", zh:'完美！你是高斯魔法师！' }
  }
};
if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
