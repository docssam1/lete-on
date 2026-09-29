/* Numbers of Magic — 유닛 M-153: 수학적 귀납법 (고등 대수 · 과정 71 예정, 2026-09-29)
   근거: docs/high-build-spec.md MD153. 예시는 새로 만들었다. */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-153'] = {
  id:'M-153', tier:'algebra', level:'71', order:153,
  generator:'md153_induction',
  title:{ ko:'수학적 귀납법', en:'Mathematical Induction', zh:'数学归纳法' },
  subtitle:{ ko:'첫 도미노와 넘어가는 규칙', en:'The first domino and the rule that topples the next', zh:'第一块多米诺与推倒下一块的规则' },
  icon:'🧱',

  practice:{
    generator:'md153_induction', level:'practice', count:6,
    params:{mode:'base'},
    intro:{
      ko:'부등식은 몇부터 성립하는지(n₀), 배수 명제는 모든 n 에서 나누어떨어지게 하는 가장 큰 수(d)를 찾습니다. 처음 몇 개의 n 을 직접 넣어 봅니다.',
      en:'For an inequality find from where it holds (n₀); for a divisibility statement find the largest number dividing it for every n (d). Try the first few values of n yourself.',
      zh:'不等式求从几开始成立(n₀)，整除命题求对所有n都整除的最大数(d)。先亲自代入前几个n。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'도미노를 모두 쓰러뜨리려면 두 가지가 필요합니다. 첫 번째 도미노가 쓰러질 것, 그리고 어느 도미노든 쓰러지면 다음 것도 쓰러질 것. 수학적 귀납법은 이 두 가지로 모든 자연수에 대한 명제를 증명합니다.',
        en:'To topple every domino you need two things: the first one falls, and whenever one falls, the next one falls too. Mathematical induction proves statements about every natural number with exactly these two steps.',
        zh:'要推倒所有多米诺骨牌需要两件事：第一块倒下，并且任何一块倒下时下一块也倒下。数学归纳法正是用这两步证明关于所有自然数的命题。' }
    },
    stages:[
      { tag:{ko:'① 첫 도미노',en:'1) The first domino',zh:'① 第一块'},
        head:{ko:'1+3+\\cdots+(2n-1)=n^2:\\ n=1\\ \\Rightarrow\\ 1=1^2',en:'1+3+\\cdots+(2n-1)=n^2:\\ n=1\\ \\Rightarrow\\ 1=1^2',zh:'1+3+\\cdots+(2n-1)=n^2:\\ n=1\\ \\Rightarrow\\ 1=1^2'},
        desc:{ko:'n=1 일 때 좌변도 1, 우변도 1 이므로 성립합니다. 이것이 <b>첫 단계</b>입니다.',en:'At n=1 the left side is 1 and the right side is 1, so it holds. This is the <b>first step</b>.',zh:'n=1时左边为1，右边也为1，成立。这是<b>第一步</b>。'},
        mathSteps:['n=1:\\ 1=1^2','\\sum_{i=1}^{1}(2i-1)=1'],
        result:{ko:'첫 도미노가 쓰러졌다!',en:'The first domino falls!',zh:'第一块倒下了！'},
        book:{ko:'2ⁿ>n² 은 n=1 에서 참이지만 n=2, 3, 4 에서 거짓이고 n≥5 에서 다시 참입니다. 그래서 첫 도미노를 n=5 로 잡습니다.',en:'2ⁿ>n² is true at n=1 but false at n=2, 3, 4 and true again for n≥5. So the first domino is set at n=5.',zh:'2ⁿ>n²在n=1时成立，n=2、3、4时不成立，n≥5时又成立。所以第一块定在n=5。'} },

      { tag:{ko:'② 다음 도미노',en:'2) The next domino',zh:'② 下一块'},
        head:{ko:'1+3+\\cdots+(2k-1)+(2k+1)=k^2+2k+1=(k+1)^2',en:'1+3+\\cdots+(2k-1)+(2k+1)=k^2+2k+1=(k+1)^2',zh:'1+3+\\cdots+(2k-1)+(2k+1)=k^2+2k+1=(k+1)^2'},
        desc:{ko:'n=k 일 때 합이 k² 이라 하면, (k+1) 번째 항 2k+1 을 더해 <b>(k+1)²</b> 이 됩니다. n=k+1 일 때도 성립합니다.',en:'If the sum is k² at n=k, adding the (k+1)th term 2k+1 gives <b>(k+1)²</b>, so it holds at n=k+1 too.',zh:'若n=k时和为k²，加上第(k+1)项2k+1得<b>(k+1)²</b>，n=k+1时也成立。'},
        mathSteps:['k^2+(2k+1)','(k+1)^2'],
        result:{ko:'하나가 쓰러지면 다음도 쓰러진다!',en:'One falls, so the next falls!',zh:'一块倒下，下一块也倒下！'},
        book:{ko:'더하는 항은 일반항 2i−1 의 i 에 k+1 을 넣은 2(k+1)−1=2k+1 입니다.',en:'The added term is the general term 2i−1 with k+1 for i: 2(k+1)−1=2k+1.',zh:'所加的项是把通项2i−1中的i换成k+1：2(k+1)−1=2k+1。'} },

      { tag:{ko:'③ 빈칸 정하기',en:'3) Filling the blank',zh:'③ 确定空格'},
        head:{ko:'\\sum_{k=1}^{n}(2k+1)=n(n+2)',en:'\\sum_{k=1}^{n}(2k+1)=n(n+2)',zh:'\\sum_{k=1}^{n}(2k+1)=n(n+2)'},
        desc:{ko:'n=1 이면 좌변 3, 우변 1×3=3 이고, n=2 이면 3+5=8=2×4 입니다. 빈칸의 수는 <b>2</b> 이고 k→k+1 도 성립합니다.',en:'At n=1 the left side is 3 and the right 1×3=3; at n=2, 3+5=8=2×4. The blank is <b>2</b>, and the step k→k+1 works too.',zh:'n=1时左边为3，右边1×3=3；n=2时3+5=8=2×4。空格中的数为<b>2</b>，k→k+1也成立。'},
        mathSteps:['n=1:\\ 3=1\\times3','n=2:\\ 8=2\\times4'],
        result:{ko:'작은 n 으로 짐작하고 귀납법으로 확인!',en:'Guess with small n, confirm by induction!',zh:'用小的n猜，用归纳法验证！'},
        book:{ko:'n=1 하나만 맞추면 틀린 식도 통과할 수 있으니 n=2 로 한 번 더 확인합니다.',en:'Matching only n=1 can let a wrong formula through, so check once more with n=2.',zh:'只对n=1成立的话错的式子也可能通过，所以再用n=2验证一次。'} }
    ],
    rule:{ ko:'① 처음 값(n=1 또는 n₀)에서 성립  ② n=k 이면 n=k+1 에서도 성립  ③ ①②로 모든 자연수(n≥n₀)에서 성립',
      en:'① It holds at the first value (n=1 or n₀)  ② If it holds at n=k, it holds at n=k+1  ③ ① and ② give every natural number (n≥n₀)',
      zh:'① 在最初的值(n=1或n₀)成立  ② n=k时成立则n=k+1时也成立  ③ 由①②对所有自然数(n≥n₀)成立' }
  },

  check:{
    fills:[
      { tex:{ko:'\\sum_{i=1}^{k+1}i=\\frac{k(k+1)}{2}+(k+\\square)',en:'\\sum_{i=1}^{k+1}i=\\frac{k(k+1)}{2}+(k+\\square)',zh:'\\sum_{i=1}^{k+1}i=\\frac{k(k+1)}{2}+(k+\\square)'}, answer:1,
        hint:{ko:'i=k+1',en:'i=k+1',zh:'i=k+1'} },
      { tex:{ko:'\\sum_{k=1}^{n}(2k+1)=n(n+\\square)',en:'\\sum_{k=1}^{n}(2k+1)=n(n+\\square)',zh:'\\sum_{k=1}^{n}(2k+1)=n(n+\\square)'}, answer:2,
        hint:{ko:'n=1: 3',en:'n=1: 3',zh:'n=1: 3'} }
    ],
    open:{ ko:'2ⁿ>n² 이 n=1 에서 참인데도 "모든 자연수 n 에서 성립한다"고 할 수 없는 까닭을 설명해 봅니다.',
      en:'Explain why 2ⁿ>n² cannot be claimed for every natural number n even though it is true at n=1.',
      zh:'说说为什么2ⁿ>n²在n=1时成立，却不能说对所有自然数n成立。' },
    openHint:{ ko:'n=2, 3, 4 에서는 4>4, 8>9, 16>16 이 모두 거짓입니다. n=1 에서 n=2 로 넘어가는 단계가 성립하지 않으므로, 귀납법은 n=5 에서 시작해야 합니다.',
      en:'At n=2, 3, 4, the statements 4>4, 8>9 and 16>16 are all false. The step from n=1 to n=2 fails, so induction must start at n=5.',
      zh:'n=2、3、4时4>4、8>9、16>16都不成立。从n=1到n=2这一步不成立，所以归纳法要从n=5开始。' }
  },

  lab:{
    generator:'md153_induction', level:'main', count:6,
    params:{mode:'step'},
    intro:{
      ko:'n=k 일 때의 식에 (k+1) 번째 항을 더하는 단계에서, 더하는 항을 k 에 대한 식으로 정리해 빈칸을 채웁니다.',
      en:'In the step that adds the (k+1)th term to the equation for n=k, write the added term in k and fill in the blank.',
      zh:'在给n=k时的等式加上第(k+1)项的步骤中，把所加的项整理成关于k的式子并填空。'
    }
  },

  arena:{
    generator:'md153_induction', level:'main', count:6, timeLimit:420,
    params:{mode:'coef'},
    rule:{ ko:'7분 안에 모든 등식의 빈칸을 채웁니다!', en:'Fill every identity’s blank within 7 minutes!', zh:'7分钟内填好所有等式的空格！' }
  },

  stamp:{ label:{ ko:'도미노 증명가', en:'Domino Prover', zh:'多米诺证明家' }, coins:52 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'도미노가 끝까지 쓰러졌어! 🧱',en:'Every domino fell!',zh:'多米诺全倒下了！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'처음 몇 개의 n 을 직접 넣어 봐!',en:'Try the first few values of n yourself!',zh:'亲自代入前几个n试试！'}, {ko:'i 자리에 k+1 을 넣었는지 봐!',en:'Did you put k+1 in place of i?',zh:'把i换成k+1了吗？'} ],
    finish:{ ko:'완벽해! 도미노 증명가! 🧱✨', en:'Perfect! Domino Prover!', zh:'完美！多米诺证明家！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
