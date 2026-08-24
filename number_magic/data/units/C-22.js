/* Numbers of Magic — 유닛 C-22: 분수 덧뺄셈 · 다른 분모 (중급 E 챕터5) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['C-22'] = {
  id:'C-22', tier:'intermediate', level:'C', order:22,
  generator:'ml_frac_diff',
  title:{ ko:'분수 덧뺄셈 (다른 분모)', en:'Fractions: Different Denominators', zh:'分数加减法(异分母)' },
  subtitle:{ ko:'1/2 + 1/3: 조각 크기를 6등분으로 맞춘 뒤 더해요!', en:'1/2 + 1/3: match the sizes as sixths, then add!', zh:'1/2 + 1/3：先统一成6等分再相加！' },
  icon:'🧮',

  practice:{
    generator:'ml_frac_diff', level:'practice', count:5,
    params:{ op:'add' },
    intro:{
      ko:'분모가 다르면 바로 더할 수 없어. 먼저 조각 크기를 똑같이 맞추는 통분을 하고 나서 분자끼리 더하는 거야! 준비됐지?',
      en:"Different denominators can't be added directly. First make the piece sizes equal (common denominator), then add the numerators! Ready?",
      zh:'分母不同不能直接加。先通分把块的大小统一，再加分子！准备好了吗？'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 크기가 다르면 못 더해요',en:'1) Different sizes can\'t be added',zh:'① 大小不同不能加'},
        head:{ko:'반쪽 + 3분의 1쪽 = ? 조각이 달라요!',en:'A half + a third = ? The slices differ!',zh:'半块+三分之一块=？块不一样！'},
        desc:{ko:'1/2 + 1/3을 분자끼리 더해 2/5라고 하면 <b>틀려요!</b> 반쪽(1/2)과 3분의 1쪽(1/3)은 <b>조각 크기가 달라서</b> 개수만 더하면 안 돼요. 사과 2개+귤 3개를 "5사과"라고 못 부르는 것과 같아요. 먼저 <b>같은 크기의 조각으로 바꿔야</b> 해요!',
              en:'Adding numerators in 1/2 + 1/3 to get 2/5 is <b>wrong!</b> A half and a third are <b>different-sized pieces</b>, so counting them together fails — like calling 2 apples + 3 oranges "5 apples". We must first <b>convert to equal-sized pieces</b>!',
              zh:'把1/2 + 1/3的分子直接相加得2/5是<b>错的！</b>半块和三分之一块<b>大小不同</b>，不能只数个数——就像2个苹果+3个橘子不能叫"5个苹果"。必须先<b>换成同样大小的块</b>！'},
        mathSteps:['1/2 + 1/3 ≠ 2/5!','조각 크기가 다르다','→ 크기를 맞춰야 함'],
        result:{ko:'분모가 다르면 먼저 크기 맞추기 — 이것이 통분이에요!',en:'Different denominators need size-matching first — that\'s finding a common denominator!',zh:'分母不同先统一大小——这就是通分！'},
        book:{ko:'검산으로 확인: 1/2=0.5, 1/3≈0.33이니 합은 0.83쯤. 2/5=0.4는 터무니없이 작죠? 크기 감각으로 잘못된 답을 걸러내요.',
              en:'Sanity check: 1/2=0.5 and 1/3≈0.33 sum to about 0.83. The wrong answer 2/5=0.4 is absurdly small — size sense filters bad answers.',
              zh:'检验：1/2=0.5，1/3≈0.33，和约0.83。错误答案2/5=0.4小得离谱——用大小感觉过滤错误。'} },

      { tag:{ko:'② 통분: 공통 조각 찾기',en:'2) Finding the common piece',zh:'② 通分：找公共块'},
        head:{ko:'2등분과 3등분의 공통 크기 = 6등분!',en:'The common size for halves and thirds: sixths!',zh:'2等分和3等分的公共大小=6等分！'},
        desc:{ko:'반쪽도, 3분의 1쪽도 <b>6등분 조각으로 다시 자를 수 있어요</b>: 1/2 = 3/6 (반쪽 = 6등분 3개), 1/3 = 2/6 (3분의 1 = 6등분 2개). 이제 크기가 같으니 개수만 더해요: 3/6+2/6 = <b>5/6</b>! 공통 분모는 보통 <b>두 분모의 곱(2×3=6)</b>이나 최소공배수로 찾아요.',
              en:'Both a half and a third can be <b>re-cut into sixths</b>: 1/2 = 3/6 (a half is three sixths), 1/3 = 2/6 (a third is two sixths). Sizes now match, so add counts: 3/6+2/6 = <b>5/6</b>! Find the common denominator as <b>the product of denominators (2×3=6)</b> or their least common multiple.',
              zh:'半块和三分之一块都能<b>再切成6等分</b>：1/2 = 3/6(半块=3个六分之一)，1/3 = 2/6(三分之一=2个六分之一)。大小一致了，只加个数：3/6+2/6 = <b>5/6</b>！公分母一般用<b>分母的乘积(2×3=6)</b>或最小公倍数。'},
        mathSteps:['1/2 = 3/6','1/3 = 2/6','3/6 + 2/6 = 5/6'],
        result:{ko:'1/2+1/3=5/6! 6등분으로 맞추면 개수 덧셈이 돼요.',en:'1/2+1/3=5/6! Match as sixths and it becomes count-adding.',zh:'1/2+1/3=5/6！统一成6等分就变成数个数。'},
        book:{ko:'분자·분모에 같은 수를 곱해도 분수의 크기는 그대로예요(1/2=2/4=3/6). 약분 나눗셈(C-19)의 "양쪽 똑같이" 규칙이 분수에도!',
              en:'Multiplying top and bottom by the same number keeps a fraction\'s value (1/2=2/4=3/6) — the "both sides equally" rule from C-19 again!',
              zh:'分子分母同乘一个数，分数大小不变(1/2=2/4=3/6)——又是C-19的"两边同样"规则！'} },

      { tag:{ko:'③ 통분 3단계 완성',en:'3) The three-step routine',zh:'③ 通分三步曲'},
        head:{ko:'맞추고 → 바꾸고 → 더하고!',en:'Match → convert → add!',zh:'统一→转换→相加！'},
        desc:{ko:'어떤 이분모 분수도 3단계로: ①<b>공통 분모 정하기</b>(분모끼리 곱하면 항상 성공) ②<b>각 분수 바꾸기</b> — 분모에 곱한 수를 분자에도 똑같이 ③<b>분자끼리 더하기</b>. 예: 2/3+1/4 → 공통분모 12 → 8/12+3/12 = <b>11/12</b>. 뺄셈도 같은 3단계예요!',
              en:'Any unlike-denominator pair takes three steps: ①<b>Pick the common denominator</b> (the product always works) ②<b>Convert each fraction</b> — whatever multiplies the bottom multiplies the top ③<b>Add the numerators</b>. E.g. 2/3+1/4 → common 12 → 8/12+3/12 = <b>11/12</b>. Subtraction uses the same three steps!',
              zh:'任何异分母分数都是三步：①<b>定公分母</b>(分母相乘一定行) ②<b>转换每个分数</b>——分母乘几分子也乘几 ③<b>分子相加</b>。例：2/3+1/4→公分母12→8/12+3/12 = <b>11/12</b>。减法也是同样三步！'},
        mathSteps:['2/3 + 1/4  (공통분모 12)','2/3=8/12, 1/4=3/12','8/12 + 3/12 = 11/12'],
        result:{ko:'2/3+1/4=11/12! 맞추고, 바꾸고, 더하면 끝.',en:'2/3+1/4=11/12! Match, convert, add — done.',zh:'2/3+1/4=11/12！统一、转换、相加，完成。'},
        book:null }
    ],
    rule:{ ko:'① 분모가 다르면 바로 못 더함  ② 공통 분모(분모의 곱)로 통분  ③ 분모에 곱한 수를 분자에도 똑같이',
      en:'① Unlike denominators can\'t add directly  ② Convert to a common denominator (the product works)  ③ Whatever multiplies the bottom multiplies the top',
      zh:'① 分母不同不能直接加  ② 用公分母(分母之积)通分  ③ 分母乘几分子也乘几' }
  },

  check:{
    fills:[
      { tex:'\\dfrac{1}{2} + \\dfrac{1}{4} = \\dfrac{\\square}{4}', answer:3,
        hint:{ ko:'1/2=2/4, 2/4+1/4=?', en:'1/2=2/4, then 2/4+1/4=?', zh:'1/2=2/4，2/4+1/4=？' } },
      { tex:'\\dfrac{2}{3} - \\dfrac{1}{2} = \\dfrac{\\square}{6}', answer:1,
        hint:{ ko:'2/3=4/6, 1/2=3/6, 4/6−3/6=?', en:'2/3=4/6, 1/2=3/6, 4/6−3/6=?', zh:'2/3=4/6，1/2=3/6，4/6−3/6=？' } }
    ],
    open:{ ko:'1/2 + 1/3이 2/5가 아닌 이유를 피자 그림으로 설명하고 진짜 답을 구해 봐요.',
      en:'Using pizza pictures, explain why 1/2 + 1/3 isn\'t 2/5, and find the real answer.',
      zh:'用披萨图解释为什么1/2 + 1/3不是2/5，并求出真正的答案。' },
    openHint:{ ko:'예) 반쪽과 3분의 1쪽은 크기가 달라 개수로 못 더해요. 둘 다 6등분으로 자르면 3조각+2조각=5조각 → 5/6. 참고로 2/5(=0.4)는 1/2(=0.5)보다도 작아서 말이 안 돼요!',
      en:'e.g. A half and a third are different sizes. Re-cut both into sixths: 3+2=5 sixths → 5/6. Note 2/5 (=0.4) is even smaller than 1/2 (=0.5) alone — impossible!',
      zh:'例）半块和三分之一块大小不同不能直接数。都切成6等分：3块+2块=5块→5/6。而且2/5(=0.4)比单独的1/2(=0.5)还小——不可能！' }
  },

  lab:{
    generator:'ml_frac_diff', level:'main', count:4,
    params:{ op:'add' },
    intro:{
      ko:'통분 마법! 조각 크기를 맞추고 더해봐.',
      en:'Common-denominator magic! Match the sizes, then add.',
      zh:'通分魔法！统一大小再相加。'
    }
  },

  arena:{
    generator:'ml_frac_diff', level:'main', count:8, timeLimit:360,
    params:{ op:'add' },
    rule:{ ko:'6분 안에 통분 문제를 모두 풀어요!', en:'Solve all common-denominator problems in 6 minutes!', zh:'6分钟内解答所有通分题！' }
  },

  stamp:{ label:{ ko:'통분 마법사', en:'Common-Denominator Wizard', zh:'通分魔法师' }, coins:30 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'크기를 딱 맞췄어! 🧮',en:'Sizes matched!',zh:'大小统一了！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'먼저 분모를 맞춰야 해!',en:'Match the denominators first!',zh:'先统一分母！'}, {ko:'분모에 곱한 수를 분자에도!',en:'Multiply the top by the same number!',zh:'分母乘几分子也乘几！'} ],
    finish:{ ko:'완벽해! 통분 마법사! 🧮✨', en:'Perfect! Common-Denominator Wizard!', zh:'完美！通分魔法师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
