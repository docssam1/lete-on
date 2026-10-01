/* Numbers of Magic — 유닛 M-150: 군수열 (고등 대수 · 과정 68, 2026-09-29)
   근거: docs/high-build-spec.md MD150. 예시는 새로 만들었다. */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-150'] = {
  id:'M-150', tier:'algebra', level:'68', order:150,
  generator:'md150_groupSeq',
  title:{ ko:'군수열', en:'Grouped Sequences', zh:'分群数列' },
  subtitle:{ ko:'괄호로 묶으면 규칙이 보입니다', en:'Brackets reveal the pattern', zh:'用括号分组，规律就出现了' },
  icon:'🗂️',

  practice:{
    generator:'md150_groupSeq', level:'practice', count:6,
    params:{mode:'group'},
    intro:{
      ko:'제 g 군까지의 항의 수나 제 g 군의 마지막 수로 범위를 잡아, 어떤 수나 aₘ 이 몇 번째 군에 있는지 찾습니다.',
      en:'Bound a number or aₘ using the number of terms up to group g or the last number of group g, and find which group it is in.',
      zh:'用到第g群为止的项数或第g群的最后一个数夹出范围，找出某数或aₘ在第几群。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'1, 1, 2, 1, 2, 3, 1, 2, 3, 4, … 는 규칙이 잘 안 보입니다. (1), (1, 2), (1, 2, 3), … 처럼 괄호로 묶으면 군마다 1 부터 다시 세는 수열이 됩니다. 묶음의 크기로 멀리 있는 항도 찾아갑니다.',
        en:'1, 1, 2, 1, 2, 3, 1, 2, 3, 4, … hides its rule. Bracketed as (1), (1, 2), (1, 2, 3), …, each group simply counts from 1 again. Using the group sizes, we can reach terms far along.',
        zh:'1, 1, 2, 1, 2, 3, 1, 2, 3, 4, …看不太出规律。像(1), (1, 2), (1, 2, 3), …这样用括号分组，每群都从1重新数起。用群的大小就能找到很远的项。' }
    },
    stages:[
      { tag:{ko:'① 몇 번째 군',en:'1) Which group',zh:'① 第几群'},
        head:{ko:'(1),\\ (2,\\ 3),\\ (4,\\ 5,\\ 6),\\ \\cdots:\\ 45<50\\le55\\ \\Rightarrow\\ g=10',en:'(1),\\ (2,\\ 3),\\ (4,\\ 5,\\ 6),\\ \\cdots:\\ 45<50\\le55\\ \\Rightarrow\\ g=10',zh:'(1),\\ (2,\\ 3),\\ (4,\\ 5,\\ 6),\\ \\cdots:\\ 45<50\\le55\\ \\Rightarrow\\ g=10'},
        desc:{ko:'제 g 군의 마지막 수는 1+2+…+g=g(g+1)/2 입니다. 제9군이 45, 제10군이 55 에서 끝나므로 50 은 제<b>10</b>군입니다.',en:'Group g ends at 1+2+…+g=g(g+1)/2. Group 9 ends at 45 and group 10 at 55, so 50 is in group <b>10</b>.',zh:'第g群的最后一个数是1+2+…+g=g(g+1)/2。第9群到45结束，第10群到55结束，所以50在第<b>10</b>群。'},
        mathSteps:['\\frac{9\\times10}{2}=45','\\frac{10\\times11}{2}=55'],
        result:{ko:'마지막 수로 울타리 치기!',en:'Fence it in with the last numbers!',zh:'用最后一个数围起来！'},
        book:{ko:'항의 번호 aₘ 으로 물으면 제 g 군까지의 항의 수로 같은 방법을 씁니다.',en:'When asked by position aₘ, do the same with the number of terms up to group g.',zh:'按项的序号aₘ问时，用到第g群为止的项数同样处理。'} },

      { tag:{ko:'② 군 안의 순서',en:'2) Position in the group',zh:'② 群内的位置'},
        head:{ko:'50-45=5\\ \\Rightarrow\\ h=5',en:'50-45=5\\ \\Rightarrow\\ h=5',zh:'50-45=5\\ \\Rightarrow\\ h=5'},
        desc:{ko:'제9군까지 45 개의 수가 있으므로 50 은 제10군의 <b>5</b> 번째 수입니다.',en:'Groups 1–9 hold 45 numbers, so 50 is the <b>5</b>th number of group 10.',zh:'到第9群共有45个数，所以50是第10群的第<b>5</b>个数。'},
        mathSteps:['1+2+\\cdots+9=45','50-45=5'],
        result:{ko:'앞 군들을 빼면 순서!',en:'Subtract the earlier groups to get the position!',zh:'减去前面各群就是位置！'},
        book:{ko:'(1), (1, 2), (1, 2, 3), … 에서 a₂₀ 은 제6군의 5 번째 항이라 값이 5 입니다(제5군까지 15 개).',en:'In (1), (1, 2), (1, 2, 3), …, a₂₀ is the 5th term of group 6 (15 terms up to group 5), so its value is 5.',zh:'在(1), (1, 2), (1, 2, 3), …中，到第5群共15项，a₂₀是第6群的第5项，值为5。'} },

      { tag:{ko:'③ 군의 합',en:'3) Group sums',zh:'③ 群的和'},
        head:{ko:'T_{10}=46+47+\\cdots+55=\\frac{10(46+55)}{2}=505',en:'T_{10}=46+47+\\cdots+55=\\frac{10(46+55)}{2}=505',zh:'T_{10}=46+47+\\cdots+55=\\frac{10(46+55)}{2}=505'},
        desc:{ko:'제10군은 46 부터 55 까지 10 개이므로 합은 <b>505</b> 입니다.',en:'Group 10 is the 10 numbers from 46 to 55, so its sum is <b>505</b>.',zh:'第10群是从46到55共10个数，和为<b>505</b>。'},
        mathSteps:['\\frac{10(46+55)}{2}','T_{10}=505'],
        result:{ko:'한 군은 작은 등차수열!',en:'Each group is a little arithmetic sequence!',zh:'每群都是一个小等差数列！'},
        book:{ko:'(1), (3, 5), (7, 9, 11), … 은 제 g 군의 합이 g³ 이 됩니다. 1, 8, 27, … 로 확인해 봅니다.',en:'For (1), (3, 5), (7, 9, 11), …, group g sums to g³. Check with 1, 8, 27, ….',zh:'(1), (3, 5), (7, 9, 11), …中第g群的和为g³，用1, 8, 27, …验证。'} }
    ],
    rule:{ ko:'① 마지막 수(또는 항의 수)로 범위를 잡아 g  ② 앞 군들의 항의 수를 빼서 h  ③ 한 군의 합은 (첫 수+끝 수)×개수÷2',
      en:'① Bound with last numbers (or term counts) to get g  ② Subtract earlier groups’ terms to get h  ③ A group sum is (first+last)×count÷2',
      zh:'① 用最后一个数(或项数)夹出g  ② 减去前面各群的项数得h  ③ 一群的和=(首数+末数)×个数÷2' }
  },

  check:{
    fills:[
      { tex:{ko:'(1),\\ (1,\\ 2),\\ (1,\\ 2,\\ 3),\\ \\cdots\\ \\Rightarrow\\ a_{20}=\\square',en:'(1),\\ (1,\\ 2),\\ (1,\\ 2,\\ 3),\\ \\cdots\\ \\Rightarrow\\ a_{20}=\\square',zh:'(1),\\ (1,\\ 2),\\ (1,\\ 2,\\ 3),\\ \\cdots\\ \\Rightarrow\\ a_{20}=\\square'}, answer:5,
        hint:{ko:'1+2+3+4+5=15',en:'1+2+3+4+5=15',zh:'1+2+3+4+5=15'} },
      { tex:{ko:'(1),\\ (3,\\ 5),\\ (7,\\ 9,\\ 11),\\ \\cdots\\ \\Rightarrow\\ T_{5}=\\square',en:'(1),\\ (3,\\ 5),\\ (7,\\ 9,\\ 11),\\ \\cdots\\ \\Rightarrow\\ T_{5}=\\square',zh:'(1),\\ (3,\\ 5),\\ (7,\\ 9,\\ 11),\\ \\cdots\\ \\Rightarrow\\ T_{5}=\\square'}, answer:125,
        hint:{ko:'21+23+25+27+29',en:'21+23+25+27+29',zh:'21+23+25+27+29'} }
    ],
    open:{ ko:'(1), (3, 5), (7, 9, 11), … 에서 제 g 군의 합이 g³ 인 까닭을 설명해 봅니다.',
      en:'Explain why group g of (1), (3, 5), (7, 9, 11), … sums to g³.',
      zh:'说说为什么(1), (3, 5), (7, 9, 11), …中第g群的和是g³。' },
    openHint:{ ko:'처음부터 m 개의 홀수의 합은 m² 입니다. 제 g 군까지 홀수가 g(g+1)/2 개, 제 (g−1) 군까지 (g−1)g/2 개이므로 T_g=(g(g+1)/2)²−((g−1)g/2)²=g³ 입니다.',
      en:'The first m odd numbers add to m². Up to group g there are g(g+1)/2 odd numbers and up to group g−1 there are (g−1)g/2, so T_g=(g(g+1)/2)²−((g−1)g/2)²=g³.',
      zh:'从头起m个奇数之和为m²。到第g群有g(g+1)/2个奇数，到第(g−1)群有(g−1)g/2个，所以T_g=(g(g+1)/2)²−((g−1)g/2)²=g³。' }
  },

  lab:{
    generator:'md150_groupSeq', level:'main', count:6,
    params:{mode:'pos'},
    intro:{
      ko:'앞 군들의 항의 수를 빼서 군 안의 순서 h 를 구하고, 그 순서를 군의 규칙에 넣어 항의 값을 구합니다.',
      en:'Subtract the terms of earlier groups to get the position h within the group, then put h into the group’s rule to get the value.',
      zh:'减去前面各群的项数得群内位置h，再把h代入群的规律求项的值。'
    }
  },

  arena:{
    generator:'md150_groupSeq', level:'main', count:6, timeLimit:420,
    params:{mode:'gsum'},
    rule:{ ko:'7분 안에 군의 합과 첫째항부터의 합을 모두 구합니다!', en:'Find every group sum and partial sum within 7 minutes!', zh:'7分钟内求出所有群的和与前若干项的和！' }
  },

  stamp:{ label:{ ko:'묶음 탐정', en:'Group Detective', zh:'分群侦探' }, coins:52 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'군을 정확히 짚었어! 🗂️',en:'Pinned down the group!',zh:'准确找到了群！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'제 g 군까지 몇 개인지 먼저 세어 봐!',en:'First count the terms up to group g!',zh:'先数到第g群为止有几项！'}, {ko:'경계의 등호를 확인해!',en:'Check the equality at the boundary!',zh:'检查边界的等号！'} ],
    finish:{ ko:'완벽해! 묶음 탐정! 🗂️✨', en:'Perfect! Group Detective!', zh:'完美！分群侦探！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
