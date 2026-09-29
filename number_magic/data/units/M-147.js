/* Numbers of Magic — 유닛 M-147: 등차수열의 합의 최대·최소 (고등 대수 · 과정 68 예정, 2026-09-29)
   근거: docs/high-build-spec.md MD147. 예시는 새로 만들었다. */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-147'] = {
  id:'M-147', tier:'algebra', level:'68', order:147,
  generator:'md147_apExtreme',
  title:{ ko:'등차수열의 합의 최대·최소', en:'Max & Min of Arithmetic Series', zh:'等差数列前n项和的最值' },
  subtitle:{ ko:'양수를 다 더한 곳이 꼭대기', en:'The peak is where the positive terms run out', zh:'正项加完的地方就是顶峰' },
  icon:'⛰️',

  practice:{
    generator:'md147_apExtreme', level:'practice', count:6,
    params:{mode:'sign'},
    intro:{
      ko:'aₙ=a₁+(n−1)d 로 aₙ<0(또는 aₙ>0)을 풀어 부호가 바뀌는 곳을 찾습니다. n 은 자연수이므로 경계에 가장 가까운 자연수를 답합니다.',
      en:'Solve aₙ<0 (or aₙ>0) with aₙ=a₁+(n−1)d to find where the sign changes. Since n is a natural number, answer with the natural number nearest the boundary.',
      zh:'用aₙ=a₁+(n−1)d解aₙ<0(或aₙ>0)，找出符号改变的地方。n是自然数，答离边界最近的自然数。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'산을 오를 때 오르막이 끝나는 곳이 꼭대기입니다. 공차가 음수인 등차수열의 합도 양수인 항을 더하는 동안 커지다가, 음수인 항을 더하기 시작하면 줄어듭니다. 그 꼭대기를 찾아봅니다.',
        en:'Climbing a hill, the top is where the uphill ends. The sum of an arithmetic sequence with a negative difference grows while positive terms are added and shrinks once negative terms start. Let us find that top.',
        zh:'爬山时上坡结束的地方就是山顶。公差为负的等差数列的和，加正项时变大，开始加负项就变小。我们来找这个顶点。' }
    },
    stages:[
      { tag:{ko:'① 부호가 바뀌는 항',en:'1) Where the sign changes',zh:'① 符号改变的项'},
        head:{ko:'a_1=40,\\ d=-3\\ \\Rightarrow\\ (a_n<0\\ \\Leftrightarrow\\ n\\ge15)',en:'a_1=40,\\ d=-3\\ \\Rightarrow\\ (a_n<0\\ \\Leftrightarrow\\ n\\ge15)',zh:'a_1=40,\\ d=-3\\ \\Rightarrow\\ (a_n<0\\ \\Leftrightarrow\\ n\\ge15)'},
        desc:{ko:'40−3(n−1)<0 에서 n−1>13.3… 이므로 n≥<b>15</b> 입니다. a₁₄=1, a₁₅=−2 입니다.',en:'From 40−3(n−1)<0, n−1>13.3…, so n≥<b>15</b>. Indeed a₁₄=1 and a₁₅=−2.',zh:'由40−3(n−1)<0得n−1>13.3…，所以n≥<b>15</b>。a₁₄=1，a₁₅=−2。'},
        mathSteps:['40-3(n-1)<0','n-1>\\frac{40}{3}'],
        result:{ko:'경계 다음 자연수!',en:'The natural number just past the boundary!',zh:'边界之后的自然数！'},
        book:{ko:'공차가 양수이고 첫째항이 음수이면 반대로 aₙ>0 이 되는 첫 항을 찾습니다.',en:'With a positive difference and a negative first term, look instead for the first term with aₙ>0.',zh:'公差为正、首项为负时，反过来找第一个aₙ>0的项。'} },

      { tag:{ko:'② 합의 최댓값',en:'2) The greatest sum',zh:'② 和的最大值'},
        head:{ko:'a_1=40,\\ d=-3\\ \\Rightarrow\\ M=S_{14}=\\frac{14(40+1)}{2}=287',en:'a_1=40,\\ d=-3\\ \\Rightarrow\\ M=S_{14}=\\frac{14(40+1)}{2}=287',zh:'a_1=40,\\ d=-3\\ \\Rightarrow\\ M=S_{14}=\\frac{14(40+1)}{2}=287'},
        desc:{ko:'양수인 항은 a₁₄ 까지이므로 S₁₄ 가 가장 큽니다. M=<b>287</b> 입니다.',en:'The positive terms end at a₁₄, so S₁₄ is the greatest: M=<b>287</b>.',zh:'正项到a₁₄为止，所以S₁₄最大：M=<b>287</b>。'},
        mathSteps:['a_{14}=1>0,\\ a_{15}=-2<0','M=S_{14}=287'],
        result:{ko:'양수를 다 더하면 꼭대기!',en:'Add every positive term: the peak!',zh:'加完所有正项就是顶峰！'},
        book:{ko:'0 인 항이 있으면 그 항을 더해도 합이 그대로라 최댓값이 되는 n 이 두 개입니다.',en:'If some term is 0, adding it leaves the sum unchanged, so two values of n give the maximum.',zh:'若有一项为0，加上它和不变，使和最大的n有两个。'} },

      { tag:{ko:'③ Sₚ=S_q 조건',en:'3) The condition Sₚ=S_q',zh:'③ Sₚ=S_q的条件'},
        head:{ko:'S_{5}=S_{13},\\ d<0\\ \\Rightarrow\\ a_6+a_{13}=0\\ \\Rightarrow\\ S_n=M,\\ n=9',en:'S_{5}=S_{13},\\ d<0\\ \\Rightarrow\\ a_6+a_{13}=0\\ \\Rightarrow\\ S_n=M,\\ n=9',zh:'S_{5}=S_{13},\\ d<0\\ \\Rightarrow\\ a_6+a_{13}=0\\ \\Rightarrow\\ S_n=M,\\ n=9'},
        desc:{ko:'a₆+a₇+…+a₁₃=0 이고 짝을 지으면 a₆+a₁₃=0 입니다. 가운데를 넘기 전까지 양수이므로 n=<b>9</b> 에서 최대입니다.',en:'a₆+a₇+…+a₁₃=0, and pairing terms gives a₆+a₁₃=0. The terms are positive up to the middle, so the maximum is at n=<b>9</b>.',zh:'a₆+a₇+…+a₁₃=0，配对得a₆+a₁₃=0。到中间之前都是正项，所以在n=<b>9</b>处最大。'},
        mathSteps:['S_{13}-S_{5}=a_6+\\cdots+a_{13}=0','n=\\frac{5+13}{2}=9'],
        result:{ko:'같은 두 합의 한가운데!',en:'Right in the middle of the equal sums!',zh:'两个相等的和的正中间！'},
        book:{ko:'두 항이 주어지면 공차와 첫째항부터 구한 뒤 ① 처럼 부호가 바뀌는 곳을 찾습니다.',en:'Given two terms, first find the difference and first term, then find the sign change as in ①.',zh:'给出两项时先求公差与首项，再像①那样找符号改变的地方。'} }
    ],
    rule:{ ko:'① 부호가 바뀌는 첫 항을 aₙ<0(또는 >0)으로  ② 감소하면 양수를 다 더한 합이 M  ③ Sₚ=S_q 이면 가운데에서 최대',
      en:'① Find the first sign change from aₙ<0 (or >0)  ② If decreasing, M is the sum of all positive terms  ③ If Sₚ=S_q, the maximum is in the middle',
      zh:'① 用aₙ<0(或>0)找符号改变的第一项  ② 递减时加完所有正项得M  ③ 若Sₚ=S_q，在中间取最大' }
  },

  check:{
    fills:[
      { tex:{ko:'a_1=30,\\ d=-4\\ \\Rightarrow\\ (a_n<0\\ \\Leftrightarrow\\ n\\ge\\square)',en:'a_1=30,\\ d=-4\\ \\Rightarrow\\ (a_n<0\\ \\Leftrightarrow\\ n\\ge\\square)',zh:'a_1=30,\\ d=-4\\ \\Rightarrow\\ (a_n<0\\ \\Leftrightarrow\\ n\\ge\\square)'}, answer:9,
        hint:{ko:'a₈=2, a₉=−2',en:'a₈=2, a₉=−2',zh:'a₈=2, a₉=−2'} },
      { tex:{ko:'a_1=20,\\ d=-4\\ \\Rightarrow\\ M=\\square',en:'a_1=20,\\ d=-4\\ \\Rightarrow\\ M=\\square',zh:'a_1=20,\\ d=-4\\ \\Rightarrow\\ M=\\square'}, answer:60,
        hint:{ko:'20+16+12+8+4',en:'20+16+12+8+4',zh:'20+16+12+8+4'} }
    ],
    open:{ ko:'0 인 항이 있으면 합의 최댓값을 만드는 n 이 두 개인 까닭을 설명해 봅니다.',
      en:'Explain why two values of n give the greatest sum when some term is 0.',
      zh:'说说为什么有一项为0时使和最大的n有两个。' },
    openHint:{ ko:'aₖ=0 이면 Sₖ=Sₖ₋₁+0=Sₖ₋₁ 입니다. 그 앞은 모두 양수, 뒤는 모두 음수이므로 Sₖ₋₁ 과 Sₖ 가 똑같이 최대입니다.',
      en:'If aₖ=0 then Sₖ=Sₖ₋₁+0=Sₖ₋₁. Everything before is positive and everything after negative, so Sₖ₋₁ and Sₖ are both the maximum.',
      zh:'若aₖ=0，则Sₖ=Sₖ₋₁+0=Sₖ₋₁。前面都是正项，后面都是负项，所以Sₖ₋₁与Sₖ同为最大。' }
  },

  lab:{
    generator:'md147_apExtreme', level:'main', count:6,
    params:{mode:'max'},
    intro:{
      ko:'양수인 항(증가하면 음수인 항)을 모두 더한 합이 최댓값 M(최솟값 m)입니다. 최대가 되는 n 을 묻기도 합니다.',
      en:'The sum of all positive terms (negative terms, if increasing) is the greatest value M (least value m). Sometimes the n at which it happens is asked.',
      zh:'所有正项(递增时所有负项)之和就是最大值M(最小值m)。有时问取最值时的n。'
    }
  },

  arena:{
    generator:'md147_apExtreme', level:'main', count:6, timeLimit:420,
    params:{mode:'cond'},
    rule:{ ko:'7분 안에 조건에서 합의 최댓값·최솟값을 모두 찾습니다!', en:'Find every greatest and least sum from the conditions within 7 minutes!', zh:'7分钟内由条件求出所有和的最值！' }
  },

  stamp:{ label:{ ko:'꼭대기 탐험가', en:'Summit Explorer', zh:'峰顶探险家' }, coins:52 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'꼭대기를 정확히 찾았어! ⛰️',en:'Found the summit exactly!',zh:'准确找到了山顶！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'부호가 바뀌는 항을 먼저 찾아!',en:'Find where the sign changes first!',zh:'先找符号改变的项！'}, {ko:'n 은 자연수야!',en:'n is a natural number!',zh:'n是自然数！'} ],
    finish:{ ko:'완벽해! 꼭대기 탐험가! ⛰️✨', en:'Perfect! Summit Explorer!', zh:'完美！峰顶探险家！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
