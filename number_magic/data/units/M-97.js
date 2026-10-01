/* Numbers of Magic — 유닛 M-97: i의 거듭제곱과 음수의 제곱근 (고등 공통수학1 · 과정 40 복소수, 2026-09-29)
   근거: docs/high-build-spec.md MD97. 예시는 새로 만들었다. */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-97'] = {
  id:'M-97', tier:'highmath1', level:'40', order:97,
  generator:'md97_iPower',
  title:{ ko:'i의 거듭제곱과 음수의 제곱근', en:'Powers of i & Square Roots of Negatives', zh:'i的幂与负数的平方根' },
  subtitle:{ ko:'i는 네 번마다 제자리로 돌아옵니다', en:'Every four steps, i comes back to where it started', zh:'i每四次回到原处' },
  icon:'🔄',

  practice:{
    generator:'md97_iPower', level:'practice', count:6,
    params:{mode:'power'},
    intro:{
      ko:'i⁴=1이므로 iⁿ은 n을 4로 나눈 나머지만 보면 됩니다. 결과를 a+bi 꼴로 두 칸에 씁니다.',
      en:'Since i⁴=1, iⁿ depends only on n mod 4. Write the result as a+bi in the two boxes.',
      zh:'因为i⁴=1，iⁿ只看n除以4的余数。把结果写成a+bi填入两格。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'i를 계속 곱해 봅니다. i, −1, −i, 1, 그리고 다시 i, −1, −i, 1…. 네 개가 끝없이 되풀이됩니다. i¹⁰⁰도 이 순환 안 어딘가에 있습니다.',
        en:'Keep multiplying by i: i, −1, −i, 1, then i, −1, −i, 1 again… The same four values repeat forever, and even i¹⁰⁰ sits somewhere in this cycle.',
        zh:'不断乘以i：i、−1、−i、1，然后又是i、−1、−i、1……四个值无限循环，i¹⁰⁰也在这个循环里的某处。' },
      history:{ ko:'허수 단위를 기호 i로 나타낸 사람은 18세기의 수학자 오일러입니다. i를 쓰면 음수의 제곱근을 √2·i처럼 간단히 적을 수 있습니다.',
        en:'The 18th-century mathematician Euler introduced the symbol i for the imaginary unit. With i, square roots of negatives can be written simply, like √2·i.',
        zh:'18世纪的数学家欧拉用符号i表示虚数单位。有了i，负数的平方根就能简单地写成√2·i这样。' }
    },
    stages:[
      { tag:{ko:'① 넷씩 도는 순환',en:'1) A cycle of four',zh:'① 四个一循环'},
        head:{ko:'i^{23}=i^{4\\times5+3}=i^3=-i',en:'i^{23}=i^{4\\times5+3}=i^3=-i',zh:'i^{23}=i^{4\\times5+3}=i^3=-i'},
        desc:{ko:'23을 4로 나누면 몫 5, 나머지 3입니다. i⁴=1이 다섯 번 곱해져도 1이므로 <b>i²³=i³=−i</b>입니다.',
              en:'23 divided by 4 is 5 remainder 3. Five factors of i⁴=1 still make 1, so <b>i²³=i³=−i</b>.',
              zh:'23除以4商5余3。五个i⁴=1相乘还是1，所以<b>i²³=i³=−i</b>。'},
        mathSteps:['23=4\\times5+3', 'i^{23}=(i^4)^5\\times i^3', '=-i'],
        result:{ko:'지수를 4로 나눈 나머지만 봅니다!',en:'Only the remainder mod 4 matters!',zh:'只看指数除以4的余数！'},
        book:{ko:'나머지가 0이면 1, 1이면 i, 2이면 −1, 3이면 −i입니다.',
              en:'Remainder 0 gives 1, 1 gives i, 2 gives −1 and 3 gives −i.',
              zh:'余数0得1，余1得i，余2得−1，余3得−i。'} },

      { tag:{ko:'② 넷씩 묶으면 합이 0',en:'2) Blocks of four sum to 0',zh:'② 每四项之和为0'},
        head:{ko:'i+i^2+i^3+i^4=0',en:'i+i^2+i^3+i^4=0',zh:'i+i^2+i^3+i^4=0'},
        desc:{ko:'i−1−i+1=0이므로 연속한 네 항의 합은 항상 0입니다. i+i²+…+i¹⁰은 앞의 8개가 0이 되고 <b>i⁹+i¹⁰=i−1</b>만 남습니다.',
              en:'i−1−i+1=0, so any four consecutive terms add to 0. In i+i²+…+i¹⁰ the first 8 cancel, leaving <b>i⁹+i¹⁰=i−1</b>.',
              zh:'i−1−i+1=0，所以连续四项之和总是0。i+i²+…+i¹⁰前8项抵消，只剩<b>i⁹+i¹⁰=i−1</b>。'},
        mathSteps:['i+i^2+\\cdots+i^8=0', 'i^9+i^{10}=i-1', '=-1+i'],
        result:{ko:'남은 항만 더하면 끝입니다!',en:'Just add the leftover terms!',zh:'只加剩下的项就行！'},
        book:{ko:'1부터 시작하는 1+i+i²+…도 넷씩 묶는 방법은 같습니다. 어디서 끊기는지만 셉니다.',
              en:'A sum starting from 1, like 1+i+i²+…, is grouped the same way; just count where it stops.',
              zh:'从1开始的1+i+i²+…也同样四项一组，只要数清在哪里结束。'} },

      { tag:{ko:'③ 음수의 제곱근은 i부터 꺼낸다',en:'3) Pull out i before computing',zh:'③ 负数的平方根先提出i'},
        head:{ko:'\\sqrt{-2}\\times\\sqrt{-8}=-4',en:'\\sqrt{-2}\\times\\sqrt{-8}=-4',zh:'\\sqrt{-2}\\times\\sqrt{-8}=-4'},
        desc:{ko:'√(−2)=√2i, √(−8)=√8i로 바꾸면 √16·i²=4×(−1)=<b>−4</b>입니다. √(−2)·√(−8)을 곧바로 √16=4로 합치면 틀립니다.',
              en:'Rewrite √(−2)=√2i and √(−8)=√8i to get √16·i²=4×(−1)=<b>−4</b>. Merging √(−2)·√(−8) straight into √16=4 is wrong.',
              zh:'改写成√(−2)=√2i、√(−8)=√8i，得√16·i²=4×(−1)=<b>−4</b>。直接把√(−2)·√(−8)合并成√16=4是错的。'},
        mathSteps:['=\\sqrt{2}\\,i\\times\\sqrt{8}\\,i', '=\\sqrt{16}\\,i^2', '=-4'],
        result:{ko:'근호 안이 음수면 먼저 i로 바꿉니다!',en:'Negative under the root? Switch to i first!',zh:'根号内是负数，先换成i！'},
        book:{ko:'나눗셈 √(−18)/√(−2)는 분자·분모의 i가 약분되어 √9=3입니다.',
              en:'For the quotient √(−18)/√(−2), the i on top and bottom cancel, giving √9=3.',
              zh:'除法√(−18)/√(−2)中分子分母的i约去，得√9=3。'} }
    ],
    rule:{ ko:'① iⁿ은 n을 4로 나눈 나머지로  ② 연속한 네 항의 합은 0  ③ √(−a)=√a·i로 바꾼 뒤 계산합니다',
      en:'① iⁿ follows n mod 4  ② Any four consecutive powers sum to 0  ③ Rewrite √(−a) as √a·i before computing',
      zh:'① iⁿ由n除以4的余数决定  ② 连续四项之和为0  ③ 先把√(−a)写成√a·i再计算' }
  },

  check:{
    fills:[
      { tex:'i^{50}=\\square', answer:-1,
        hint:{ ko:'50=4×12+2', en:'50=4×12+2', zh:'50=4×12+2' } },
      { tex:'\\sqrt{-3}\\times\\sqrt{-12}=\\square', answer:-6,
        hint:{ ko:'√36·i²', en:'√36·i²', zh:'√36·i²' } }
    ],
    open:{ ko:'i+i²+i³+…+i²⁰의 값이 0인 까닭을 설명해 봅니다.',
      en:'Explain why i+i²+i³+…+i²⁰ equals 0.',
      zh:'说说i+i²+i³+…+i²⁰等于0的原因。' },
    openHint:{ ko:'항이 20개라 넷씩 다섯 묶음이 되고, 각 묶음의 합이 0입니다.',
      en:'There are 20 terms, five blocks of four, and each block sums to 0.',
      zh:'共20项，分成五组四项，每组之和为0。' }
  },

  lab:{
    generator:'md97_iPower', level:'main', count:6,
    params:{mode:'sum'},
    intro:{
      ko:'넷씩 묶어 0으로 지우고, 남은 항만 더해 a+bi로 씁니다.',
      en:'Cancel blocks of four to 0, add only the leftovers and write a+bi.',
      zh:'四项一组消为0，只加剩下的项，写成a+bi。'
    }
  },

  arena:{
    generator:'md97_iPower', level:'main', count:8, timeLimit:360,
    params:{mode:'negRoot'},
    rule:{ ko:'6분 안에 음수의 제곱근 계산을 모두 끝냅니다!', en:'Finish every computation with roots of negatives within 6 minutes!', zh:'6分钟内完成所有负数平方根的计算！' }
  },

  stamp:{ label:{ ko:'순환 마법사', en:'Cycle Wizard', zh:'循环魔法师' }, coins:49 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'i의 순환을 꿰뚫었구나! 🔄',en:'You saw right through the cycle of i!',zh:'看透了i的循环！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'지수를 4로 나눈 나머지를 다시 구해 봐!',en:'Find the remainder of the exponent mod 4 again!',zh:'再算一遍指数除以4的余数！'}, {ko:'근호 안이 음수면 먼저 i로 바꿔 봐!',en:'If it is negative under the root, switch to i first!',zh:'根号内是负数就先换成i！'} ],
    finish:{ ko:'완벽해! 순환 마법사! 🔄✨', en:'Perfect! Cycle Wizard!', zh:'完美！循环魔法师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
