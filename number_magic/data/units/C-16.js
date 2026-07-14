/* Numbers of Magic — 유닛 C-16: ×5 / ÷5 전략 (중급 D 챕터2) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['C-16'] = {
  id:'C-16', tier:'intermediate', level:'C', order:16,
  generator:'ml_x5',
  title:{ ko:'×5 / ÷5 전략', en:'The ×5 / ÷5 Strategy', zh:'×5/÷5策略' },
  subtitle:{ ko:'5는 10의 절반! ×5=×10÷2, ÷5=×2÷10', en:'5 is half of 10! ×5=×10÷2 and ÷5=×2÷10', zh:'5是10的一半！×5=×10÷2，÷5=×2÷10' },
  icon:'✋',

  practice:{
    generator:'ml_x5', level:'practice', count:5,
    params:{ mode:'mul' },
    intro:{
      ko:'5를 곱할 때는 10을 곱하고 반으로 나누면 돼. 5는 10의 절반이니까! 준비됐지?',
      en:"To multiply by 5, multiply by 10 and halve it — because 5 is half of 10! Ready?",
      zh:'乘5时先乘10再除以2——因为5是10的一半！准备好了吗？'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① ×5 = ×10 ÷ 2',en:'1) ×5 = ×10 ÷ 2',zh:'① ×5 = ×10 ÷ 2'},
        head:{ko:'48×5: 480의 절반 = 240!',en:'48×5: half of 480 = 240!',zh:'48×5：480的一半=240！'},
        desc:{ko:'5는 <b>10의 절반</b>이에요. 그래서 어떤 수든 ×5는 <b>×10 하고 반으로</b> 나누면 돼요. 48×5 = 48×10÷2 = 480÷2 = <b>240</b>. 0을 붙이고 반 나누기 — 5단 구구단을 몰라도 큰 수에 5를 순식간에 곱할 수 있어요!',
              en:'Five is <b>half of ten</b>. So any number ×5 is just <b>×10 then halve</b>. 48×5 = 48×10÷2 = 480÷2 = <b>240</b>. Add a zero, halve — you can multiply big numbers by 5 instantly!',
              zh:'5是<b>10的一半</b>。所以任何数×5就是<b>×10再除以2</b>。48×5 = 48×10÷2 = 480÷2 = <b>240</b>。加个0再折半——大数乘5也能瞬间完成！'},
        mathSteps:['48 × 5','= 48 × 10 ÷ 2','= 480 ÷ 2','= 240'],
        result:{ko:'48×5=240! 0 붙이고 절반 — 두 단계로 끝.',en:'48×5=240! Add a zero, halve — two steps.',zh:'48×5=240！加0折半——两步完成。'},
        book:{ko:'순서를 바꿔도 돼요: 먼저 반으로(48÷2=24) 그다음 ×10(=240). 짝수면 먼저 반 나누는 게 더 쉬워요!',
              en:'You may swap the order: halve first (48÷2=24) then ×10 (=240). For even numbers, halving first is easier!',
              zh:'顺序可以换：先折半(48÷2=24)再×10(=240)。偶数先折半更容易！'} },

      { tag:{ko:'② ÷5 = ×2 ÷ 10',en:'2) ÷5 = ×2 ÷ 10',zh:'② ÷5 = ×2 ÷ 10'},
        head:{ko:'85÷5: 두 배 하고 10으로 나눠요 = 17!',en:'85÷5: double it, divide by 10 = 17!',zh:'85÷5：翻倍再除以10=17！'},
        desc:{ko:'나누기 5도 마법이 있어요! ÷5는 <b>×2 하고 ÷10</b>과 같아요. 85÷5 = 85×2÷10 = 170÷10 = <b>17</b>. 왜냐하면 5로 나누기 = 10/2로 나누기 = 2를 곱하고 10으로 나누기니까요. 나눗셈이 두 배 만들기로 변신!',
              en:'Dividing by 5 has magic too! ÷5 equals <b>×2 then ÷10</b>. 85÷5 = 85×2÷10 = 170÷10 = <b>17</b>. Because dividing by 5 = dividing by 10/2 = multiplying by 2 and dividing by 10. Division becomes doubling!',
              zh:'除以5也有魔法！÷5等于<b>×2再÷10</b>。85÷5 = 85×2÷10 = 170÷10 = <b>17</b>。因为除以5=除以10/2=乘2再除以10。除法变成了翻倍！'},
        mathSteps:['85 ÷ 5','= 85 × 2 ÷ 10','= 170 ÷ 10','= 17'],
        result:{ko:'85÷5=17! 두 배 하고 0 하나 지우기.',en:'85÷5=17! Double, then drop a zero.',zh:'85÷5=17！翻倍，去掉一个0。'},
        book:{ko:'분수로 보면: ÷5 = ÷(10/2) = ×(2/10). 곱하기와 나누기를 뒤집는 이 기술은 ÷25, ÷50에도 그대로 통해요.',
              en:'In fractions: ÷5 = ÷(10/2) = ×(2/10). This invert trick extends to ÷25 and ÷50 as well.',
              zh:'用分数看：÷5 = ÷(10/2) = ×(2/10)。这个倒转技巧同样适用于÷25、÷50。'} },

      { tag:{ko:'③ 절반 만들기 연습',en:'3) Practising halving',zh:'③ 练习折半'},
        head:{ko:'반 나누기가 빠르면 ×5가 빨라요',en:'Fast halving makes fast ×5',zh:'折半快，×5就快'},
        desc:{ko:'이 전략의 심장은 <b>절반 만들기</b>예요. 홀수 십의 절반도 연습해요: 340÷2 → 300÷2=150, 40÷2=20 → 170. 큰 수도 쪼개서 반으로: 760÷2 = 380. 절반 만들기가 손에 익으면 ×5·÷5·×50·×25가 모두 내 것이 돼요!',
              en:'The heart of this strategy is <b>halving</b>. Practise halving awkward numbers too: 340÷2 → 300÷2=150, 40÷2=20 → 170. Split big numbers to halve them: 760÷2 = 380. Master halving, and ×5, ÷5, ×50, ×25 all become yours!',
              zh:'这个策略的核心是<b>折半</b>。也要练不顺手的数：340÷2 → 300÷2=150，40÷2=20 → 170。大数拆开折半：760÷2=380。折半熟练了，×5、÷5、×50、×25都是你的！'},
        mathSteps:['340÷2: 300÷2=150','40÷2=20','150+20=170'],
        result:{ko:'절반도 쪼개서! 백 먼저, 십 나중 — 반 나누기 달인.',en:'Split to halve! Hundreds first, tens next — a halving master.',zh:'折半也拆开！先百位后十位——折半达人。'},
        book:null }
    ],
    rule:{ ko:'① ×5 = ×10 후 ÷2 (짝수면 ÷2 먼저)  ② ÷5 = ×2 후 ÷10  ③ 절반 만들기는 자리별로 쪼개서',
      en:'① ×5 = ×10 then ÷2 (halve first if even)  ② ÷5 = ×2 then ÷10  ③ Halve place by place',
      zh:'① ×5 = ×10后÷2(偶数先÷2)  ② ÷5 = ×2后÷10  ③ 折半按数位拆开' }
  },

  check:{
    fills:[
      { tex:'64 \\times 5 = \\square', answer:320,
        hint:{ ko:'640÷2=? 또는 64÷2=32, ×10', en:'640÷2=? Or 64÷2=32, then ×10', zh:'640÷2=？或64÷2=32再×10' } },
      { tex:'95 \\div 5 = \\square', answer:19,
        hint:{ ko:'95×2=190, 190÷10=?', en:'95×2=190, 190÷10=?', zh:'95×2=190，190÷10=？' } }
    ],
    open:{ ko:'×5=×10÷2가 항상 성립하는 이유를 설명하고, 같은 원리로 ×50은 어떻게 계산할지 말해 봐요.',
      en:'Explain why ×5=×10÷2 always works, and using the same idea, how would you compute ×50?',
      zh:'解释为什么×5=×10÷2总是成立，用同样的思路×50该怎么算？' },
    openHint:{ ko:'예) 5=10÷2이므로 a×5=a×10÷2. 마찬가지로 50=100÷2이니까 ×50 = ×100÷2. 예: 18×50=1800÷2=900.',
      en:'e.g. Since 5=10÷2, a×5=a×10÷2. Likewise 50=100÷2, so ×50 = ×100÷2. E.g. 18×50=1800÷2=900.',
      zh:'例）因为5=10÷2，所以a×5=a×10÷2。同理50=100÷2，×50 = ×100÷2。例：18×50=1800÷2=900。' }
  },

  lab:{
    generator:'ml_x5', level:'main', count:4,
    params:{ mode:'div' },
    intro:{
      ko:'이번엔 ÷5 마법! 두 배 하고 10으로 나눠봐.',
      en:'Now ÷5 magic! Double it, then divide by 10.',
      zh:'现在是÷5魔法！翻倍再除以10。'
    }
  },

  arena:{
    generator:'ml_x5', level:'main', count:8, timeLimit:300,
    params:{ mode:'mul' },
    rule:{ ko:'5분 안에 ×5/÷5 문제를 모두 풀어요!', en:'Solve all ×5/÷5 problems in 5 minutes!', zh:'5分钟内解答所有×5/÷5题！' }
  },

  stamp:{ label:{ ko:'절반 마법사', en:'Halving Wizard', zh:'折半魔法师' }, coins:30 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'절반의 마법! ✋',en:'Halving magic!',zh:'折半魔法！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'×10 하고 반으로 나눠봐!',en:'×10 then halve!',zh:'×10再折半！'}, {ko:'÷5는 ×2 하고 ÷10이야!',en:'÷5 is ×2 then ÷10!',zh:'÷5是×2再÷10！'} ],
    finish:{ ko:'완벽해! 절반 마법사! ✋✨', en:'Perfect! Halving Wizard!', zh:'完美！折半魔法师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
