/* Numbers of Magic — 유닛 M-112: 사전식 배열과 자연수의 개수 (고등 공통수학1 · 과정 46, 2026-09-29)
   근거: docs/high-build-spec.md MD112. 예시는 새로 만들었다. */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-112'] = {
  id:'M-112', tier:'highmath1', level:'46', order:112,
  generator:'md112_lexOrder',
  title:{ ko:'사전식 배열과 자연수의 개수', en:'Dictionary Order & Counting Numbers', zh:'字典排列与自然数的个数' },
  subtitle:{ ko:'맨 앞자리부터 묶음으로 셉니다', en:'Count in blocks from the first place', zh:'从首位开始按组计数' },
  icon:'📖',

  practice:{
    generator:'md112_lexOrder', level:'practice', count:6,
    params:{mode:'rank'},
    intro:{
      ko:'맨 앞자리가 더 작은 것들이 몇 개인지 묶음으로 세고, 다음 자리로 넘어가며 더합니다.',
      en:'Count in blocks how many items start with a smaller first symbol, then move to the next place and keep adding.',
      zh:'按组数出首位更小的有多少个，再看下一位，依次相加。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'사전에서 낱말을 찾을 때 첫 글자로 먼저 쪽을 넘기고, 그다음 둘째 글자를 봅니다. 수를 작은 순서로 늘어놓을 때도 똑같이 맨 앞자리 묶음부터 셉니다.',
        en:'In a dictionary you jump by the first letter, then look at the second. Listing numbers from smallest works the same way: count by first-place blocks first.',
        zh:'查字典时先按首字母翻页，再看第二个字母。把数从小到大排列也一样，先按首位分组计数。' }
    },
    stages:[
      { tag:{ko:'① 몇 번째인가',en:'1) Which position?',zh:'① 第几个'},
        head:{ko:'1,\\ 2,\\ 3,\\ 4 \\;\\Rightarrow\\; 3124',en:'1,\\ 2,\\ 3,\\ 4 \\;\\Rightarrow\\; 3124',zh:'1,\\ 2,\\ 3,\\ 4 \\;\\Rightarrow\\; 3124'},
        desc:{ko:'맨 앞이 1 인 수가 3!=6 개, 2 인 수가 6 개입니다. 3 으로 시작하는 수 가운데 3124 는 가장 작으므로 <b>13 번째</b> 입니다.',
              en:'3!=6 numbers start with 1 and 6 start with 2. Among those starting with 3, 3124 is the smallest, so it is <b>13th</b>.',
              zh:'首位为1的有3!=6个，为2的有6个。以3开头的数中3124最小，所以是<b>第13个</b>。'},
        mathSteps:['2\\times6+1=13'],
        result:{ko:'앞자리 묶음 크기는 (남은 자리)! 입니다!',en:'Each first-place block has size (remaining places)!',zh:'首位每组的大小是(剩余位数)!！'},
        book:{ko:'k 번째 수를 찾을 때는 거꾸로 k−1 을 묶음 크기로 나누어 나갑니다.',
              en:'To find the k-th number, go the other way: divide k−1 by the block sizes.',
              zh:'求第k个数时反过来，用k−1依次除以各组的大小。'} },

      { tag:{ko:'② 짝수의 개수',en:'2) Counting even numbers',zh:'② 偶数的个数'},
        head:{ko:'2\\times{}_{4}\\mathrm{P}_{2}=24',en:'2\\times{}_{4}\\mathrm{P}_{2}=24',zh:'2\\times{}_{4}\\mathrm{P}_{2}=24'},
        desc:{ko:'1~5 에서 세 자리 짝수를 만들면 일의 자리는 2 또는 4 로 2가지, 나머지 두 자리는 남은 4 장에서 ₄P₂=12 가지이므로 <b>24</b> 개입니다.',
              en:'For three-digit even numbers from 1–5, the ones digit is 2 or 4 (2 ways) and the other two places come from the remaining 4 cards, ₄P₂=12, so <b>24</b>.',
              zh:'用1~5组成三位偶数：个位是2或4(2种)，其余两位从剩下4张中取₄P₂=12种，共<b>24</b>个。'},
        mathSteps:['2\\times12=24'],
        result:{ko:'조건이 걸린 자리부터 정합니다!',en:'Fill the restricted place first!',zh:'先定有条件的位置！'},
        book:{ko:'5 의 배수는 일의 자리가 0 또는 5 입니다.',
              en:'A multiple of 5 ends in 0 or 5.',
              zh:'5的倍数个位是0或5。'} },

      { tag:{ko:'③ 0 이 있으면 맨 앞 조심',en:'3) With 0, watch the first place',zh:'③ 有0时注意首位'},
        head:{ko:'0,\\ 1,\\ 2,\\ 3',en:'0,\\ 1,\\ 2,\\ 3',zh:'0,\\ 1,\\ 2,\\ 3'},
        desc:{ko:'세 자리 수는 맨 앞에 0 이 올 수 없어 3×3×2=18 개입니다. 짝수는 일의 자리가 0 인 경우 3×2=6, 2 인 경우 2×2=4 로 <b>10</b> 개입니다.',
              en:'Three-digit numbers cannot start with 0: 3×3×2=18. Even ones: ones digit 0 gives 3×2=6 and ones digit 2 gives 2×2=4, so <b>10</b>.',
              zh:'三位数首位不能是0：3×3×2=18个。偶数：个位为0有3×2=6个，为2有2×2=4个，共<b>10</b>个。'},
        mathSteps:['3\\times3\\times2=18', '6+4=10'],
        result:{ko:'0 이 일의 자리에 가는지로 나눕니다!',en:'Split on whether 0 takes the ones place!',zh:'按0是否在个位分情况！'},
        book:{ko:'일의 자리가 0 이면 맨 앞자리 걱정이 사라집니다.',
              en:'If the ones digit is 0, the first place is no longer a worry.',
              zh:'个位是0时，首位就不用担心了。'} }
    ],
    rule:{ ko:'① 앞자리 묶음 크기는 (남은 자리)!  ② 조건이 걸린 자리부터 정한다  ③ 0 은 맨 앞에 올 수 없습니다',
      en:'① First-place blocks have size (remaining places)!  ② Fill restricted places first  ③ 0 cannot be the first digit',
      zh:'① 首位每组大小为(剩余位数)!  ② 先定有条件的位置  ③ 0不能在首位' }
  },

  check:{
    fills:[
      { tex:{ko:'1,\\ 2,\\ 3\\ \\text{으로 만든 세 자리 수 중 } 231\\ \\text{은 }\\square\\text{번째}',en:'231\\ \\text{is number }\\square\\text{ among three-digit numbers made from }1,\\ 2,\\ 3',zh:'1,\\ 2,\\ 3\\ \\text{组成的三位数中 } 231\\ \\text{是第}\\square\\text{个}'}, answer:4,
        hint:{ ko:'123, 132, 213, 231', en:'123, 132, 213, 231', zh:'123, 132, 213, 231' } },
      { tex:{ko:'0,\\ 1,\\ 2,\\ 3\\ \\text{으로 만든 두 자리 수의 개수}=\\square',en:'\\text{two-digit numbers from }0,\\ 1,\\ 2,\\ 3=\\square',zh:'0,\\ 1,\\ 2,\\ 3\\ \\text{组成的两位数个数}=\\square'}, answer:9,
        hint:{ ko:'3×3', en:'3×3', zh:'3×3' } }
    ],
    open:{ ko:'a, b, c, d 를 사전식으로 늘어놓을 때 cabd 가 몇 번째인지 구하는 과정을 설명해 봅니다.',
      en:'Explain how to find the position of cabd when a, b, c, d are arranged in dictionary order.',
      zh:'说说a、b、c、d按字典顺序排列时cabd是第几个的求法。' },
    openHint:{ ko:'a 로 시작 6 개, b 로 시작 6 개, 그다음 cabd 가 c 묶음의 첫째이므로 13 번째입니다.',
      en:'6 start with a, 6 with b, and cabd is first in the c block, so it is 13th.',
      zh:'以a开头6个，以b开头6个，cabd是c组的第一个，所以是第13个。' }
  },

  lab:{
    generator:'md112_lexOrder', level:'main', count:6,
    params:{mode:'even'},
    intro:{
      ko:'일의 자리를 먼저 정하고 남은 카드로 나머지 자리를 채웁니다.',
      en:'Fix the ones digit first, then fill the other places with the remaining cards.',
      zh:'先定个位，再用剩下的卡片填其余位。'
    }
  },

  arena:{
    generator:'md112_lexOrder', level:'main', count:6, timeLimit:480,
    params:{mode:'zero'},
    rule:{ ko:'8분 안에 0 이 든 카드로 만든 수를 모두 셉니다!', en:'Count every number made from cards including 0 within 8 minutes!', zh:'8分钟内数完含0卡片组成的所有数！' }
  },

  stamp:{ label:{ ko:'사전 탐험가', en:'Dictionary Explorer', zh:'字典探险家' }, coins:50 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'묶음으로 척척 셌구나! 📖',en:'You counted in blocks with ease!',zh:'按组数得真快！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'맨 앞자리 묶음부터 세 봐!',en:'Start with the first-place blocks!',zh:'从首位的组开始数！'}, {ko:'맨 앞에 0 이 오면 안 돼!',en:'0 cannot come first!',zh:'首位不能是0！'} ],
    finish:{ ko:'완벽해! 사전 탐험가! 📖✨', en:'Perfect! Dictionary Explorer!', zh:'完美！字典探险家！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
