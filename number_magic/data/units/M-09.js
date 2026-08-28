/* Numbers of Magic — 유닛 M-09: 순환소수를 분수로 (중등 W8 · 중1 정수와 유리수 · 계보3 '9는 10의 옆집' 연장) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-09'] = {
  id:'M-09', tier:'middle1', level:'31', order:9,
  lineage:['nine-next-door'],
  generator:'md9_repeatToFrac',
  title:{ ko:'순환소수를 분수로', en:'Repeating Decimal to Fraction', zh:'循环小数化分数' },
  subtitle:{ ko:'반복 전 자리가 있어도 걱정 마 — 이어붙이고 빼면 분수가 나와요', en:'Even with digits before the repeat, concatenate and subtract to get a fraction', zh:'就算前面有不循环的部分，连起来再相减就能得到分数' },
  icon:'🔁',

  practice:{
    generator:'md9_repeatToFrac', level:'practice', count:5,
    params:{k:1,m:1},
    intro:{
      ko:'9로 나누면 반복마디가 그대로 분자가 됐던 거, 기억나? 이번엔 반복 전 자리가 껴 있는 경우야!',
      en:'Remember how dividing by 9 made the repeating block become the numerator? This time there are digits before the repeat!',
      zh:'还记得除以9时循环节直接变成分子吗？这次前面还多了不循环的部分！'
    }
  },

  discover:{
    story:{
      hook:{ ko:'0.333…을 분수로 되돌릴 수 있을까요? 끝나지 않는 소수인데요.',
        en:'Can 0.333… be turned back into a fraction, even though it never ends?',
        zh:'0.333……写不完，还能变回分数吗？' },
      history:{ ko:'분수를 소수로 바꾸면 끝나거나 되풀이되는 두 가지뿐이에요. 거꾸로도 참이라서, 끝나지 않고 되풀이되는 소수는 반드시 어떤 분수로 되돌아가요. 되풀이되지도 않고 끝나지도 않는 소수는 분수로 돌아갈 수 없고, 그런 수를 무리수라고 불러요.',
        en:'A fraction becomes a decimal that either stops or repeats — only those two. The converse holds too: any repeating decimal must come back to some fraction. A decimal that neither stops nor repeats can never return to a fraction, and those numbers are called irrational.',
        zh:'分数化成小数，只有终止和循环两种。反过来也成立：任何循环小数都一定能还原成某个分数。既不终止也不循环的小数无法还原成分数，这样的数叫无理数。' }
    },
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 이어붙이고 빼면 분자',en:'1) Concatenate and subtract for the numerator',zh:'① 连起来相减就是分子'},
        head:{ko:'0.4\\overline{6} = \\dfrac{42}{90} = \\dfrac{7}{15}',en:'0.4\\overline{6} = \\dfrac{42}{90} = \\dfrac{7}{15}',zh:'0.4\\overline{6} = \\dfrac{42}{90} = \\dfrac{7}{15}'},
        desc:{ko:'"4"까지는 반복이 안 되고 "6"만 반복돼요. <b>"4"와 "6"을 이어붙인 46에서, 반복 전 자리 "4"를 빼면</b> 46−4=42 — 이게 분자예요! CH5에서 배운 0.\\overline{6}=6/9(처음부터 반복)의 일반화예요.',
              en:'The "4" does not repeat, only "6" repeats. <b>Concatenate "4" and "6" to get 46, then subtract the non-repeating "4"</b>: 46−4=42 — that\'s the numerator! This generalizes what CH5 taught for 0.\\overline{6}=6/9 (repeating from the very start).',
              zh:'"4"不循环，只有"6"循环。<b>把"4"和"6"连成46，再减去不循环的"4"</b>：46−4=42——这就是分子！这是CH5学过的0.\\overline{6}=6/9(从头就循环)的推广。'},
        mathSteps:['0.4\\overline{6}', '\\text{46}-\\text{4}=42', '\\dfrac{42}{90}'],
        result:{ko:'반복 전 자리를 빼주는 게 핵심이에요!',en:'Subtracting the non-repeating prefix is the key move!',zh:'关键就是减去不循环的前缀！'},
        book:null },

      { tag:{ko:'② 분모는 9와 0의 조합',en:'2) The denominator mixes 9s and 0s',zh:'② 分母是9和0的组合'},
        head:{ko:'분모 = 10^{비순환 자리수} \\times (10^{순환 자리수}-1)',en:'denominator = 10^{prefix digits} \\times (10^{repeat digits}-1)',zh:'分母＝10^{不循环位数} \\times (10^{循环位数}-1)'},
        desc:{ko:'0.4\\overline{6}은 비순환 1자리(10¹), 순환 1자리(10¹−1=9)니까 분모는 <b>10×9=90</b>. 반복마디가 2자리면 99, 3자리면 999가 되고, 비순환 자리 수만큼 뒤에 0이 붙어요 — 규칙만 알면 몇 자리든 바로 분모를 만들 수 있어요.',
              en:'0.4\\overline{6} has 1 prefix digit (10¹) and 1 repeating digit (10¹−1=9), so the denominator is <b>10×9=90</b>. Two repeating digits give 99, three give 999, and the prefix length adds that many trailing zeros — knowing the rule lets you build the denominator for any length instantly.',
              zh:'0.4\\overline{6}前缀1位(10¹)，循环1位(10¹−1=9)，所以分母是<b>10×9=90</b>。循环2位就是99，3位就是999，前缀位数决定后面加几个0——掌握规律，几位数都能立刻算出分母。'},
        mathSteps:['10^1=10,\\;\\;10^1-1=9', '10\\times9=90', '\\dfrac{42}{90}=\\dfrac{7}{15}'],
        result:{ko:'분모는 9(순환 자리)와 0(비순환 자리)이 규칙적으로 섞여요!',en:'The denominator regularly mixes 9s (repeat) and 0s (prefix)!',zh:'分母规律地混合着9(循环位)和0(不循环位)！'},
        book:{ko:'약분이 되면 기약분수로 나타내요 — 42/90은 6으로 약분해서 7/15가 돼요.',
              en:'If it can be simplified, write it in lowest terms — 42/90 simplifies to 7/15.',
              zh:'如果能约分就化成最简分数——42/90约分后是7/15。'} }
    ],
    rule:{ ko:'① 비순환+순환을 이어붙이고 비순환부를 빼면 분자  ② 분모=10^비순환자리×(10^순환자리−1)  ③ 약분이 되면 기약분수로',
      en:'① Concatenate prefix+repeat, subtract the prefix for the numerator  ② Denominator = 10^prefix × (10^repeat − 1)  ③ Simplify if possible',
      zh:'① 前缀+循环连起来，减前缀得分子  ② 分母＝10^前缀×(10^循环−1)  ③ 能约分就约分' }
  },

  check:{
    fills:[
      { tex:'0.1\\overline{6} = \\dfrac{\\square}{90}', answer:15,
        hint:{ ko:'16-1=15', en:'16-1=15', zh:'16-1=15' } },
      { tex:'10^2 - 1 = \\square', answer:99,
        hint:{ ko:'순환 2자리의 분모 재료', en:'the denominator piece for a 2-digit repeat', zh:'循环2位的分母材料' } }
    ],
    open:{ ko:'0.2\\overline{5}를 분수로 나타내는 과정을 설명해봐요.',
      en:'Explain the process of writing 0.2\\overline{5} as a fraction.',
      zh:'说说把0.2\\overline{5}化成分数的过程。' },
    openHint:{ ko:'25-2=23, 분모=10×9=90 → 23/90 (더 못 약분됨).',
      en:'25-2=23, denominator=10×9=90 → 23/90 (already in lowest terms).',
      zh:'25-2=23，分母=10×9=90 → 23/90(已是最简)。' }
  },

  lab:{
    generator:'md9_repeatToFrac', level:'main', count:4,
    params:{k:2,m:1},
    intro:{
      ko:'비순환부가 두 자리로 늘어나도 방법은 똑같아!',
      en:'Even with a two-digit prefix, the method stays the same!',
      zh:'就算前缀变成两位，方法还是一样！'
    }
  },

  arena:{
    generator:'md9_repeatToFrac', level:'main', count:8, timeLimit:300,
    params:{k:1,m:2},
    rule:{ ko:'5분 안에 순환마디 두 자리 문제를 모두 풀어요!', en:'Solve all two-digit repeating-block problems in 5 minutes!', zh:'5分钟内解答所有循环节两位的题目！' }
  },

  stamp:{ label:{ ko:'순환소수 해독가', en:'Repeating-Decimal Decoder', zh:'循环小数解码员' }, coins:38 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'이어붙이고 빼는 걸 완벽히 했어! 🔁',en:'Concatenate-and-subtract, nailed it!',zh:'连接相减做得很完美！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'비순환부를 빼는 걸 잊지 않았는지 확인해봐!',en:'Check that you subtracted the non-repeating prefix!',zh:'检查一下有没有减去不循环的前缀！'}, {ko:'분모는 9와 0을 규칙대로 조합해봐!',en:'Build the denominator with 9s and 0s by the rule!',zh:'按规律组合9和0得到分母！'} ],
    finish:{ ko:'완벽해! 순환소수 해독가! 🔁✨', en:'Perfect! Repeating-Decimal Decoder!', zh:'完美！循环小数解码员！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
