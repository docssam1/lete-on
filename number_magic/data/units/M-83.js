/* Numbers of Magic — 유닛 M-83: 제곱근의 덧셈과 뺄셈 (중등 W10 · 중3 제곱근의 세계)
   2026-09-21 추가. 디딤돌 개념연산 중3-1A 대조(p.68~78)로 찾은 구멍 — MD15~18이
   "정리하는 법"만 가르치고 "더하거나 빼는 법"이 없었다. course35(제곱근의 세계)에
   MD15·16·17 뒤로 이어 붙인다. */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-83'] = {
  id:'M-83', tier:'middle3', level:'35', order:4,
  generator:'md83_radicalAddSub',
  title:{ ko:'제곱근의 덧셈과 뺄셈', en:'Adding & Subtracting Square Roots', zh:'平方根的加减法' },
  subtitle:{ ko:'근호 안의 수가 같아야 더하거나 뺄 수 있습니다 — 다항식의 동류항과 같은 규칙입니다', en:'You can only add or subtract when the number under the root matches — the same rule as combining like terms', zh:'根号内的数相同才能相加或相减——和多项式的同类项是同一条规则' },
  icon:'➕',

  practice:{
    generator:'md83_radicalAddSub', level:'practice', count:5,
    params:{mode:'sameRadicand'},
    intro:{
      ko:'3√2와 5√2는 둘 다 "√2가 몇 개"인 항입니다 — 사과 3개와 5개를 더하듯, 계수만 더합니다.',
      en:'3√2 and 5√2 are both terms of "how many √2s" — just like adding 3 apples and 5 apples, only the coefficients add.',
      zh:'3√2和5√2都是"有几个√2"的项——就像3个苹果加5个苹果，只把系数相加。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'x+x=2x라는 걸 압니다. 그럼 √2+√2는 얼마일까요? √2를 하나의 문자처럼 생각하면 답이 보입니다.',
        en:'You know x+x=2x. So what is √2+√2? Think of √2 as if it were a single letter, and the answer appears.',
        zh:'你知道x+x=2x。那√2+√2是多少呢？把√2当成一个字母来看，答案就出来了。' },
      history:{ ko:'제곱근의 덧셈·뺄셈은 다항식의 동류항 정리와 똑같은 규칙을 씁니다. 문자 x 대신 √a가 있다고 생각하면, 지금까지 배운 모든 요령을 그대로 쓸 수 있습니다 — 새로 외울 것은 "근호 안이 같아야 한다"는 조건 하나뿐입니다.',
        en:'Adding and subtracting square roots follows the exact same rule as combining like terms in a polynomial. Think of √a in place of the letter x, and every trick you already know still works — the only new rule to remember is that the number under the root must match.',
        zh:'平方根的加减法和多项式合并同类项用的是同一条规则。把√a当成字母x，之前学过的技巧全都还能用——唯一要记住的新规则是根号内的数必须相同。' }
    },
    stages:[
      { tag:{ko:'① 근호 안이 같으면 계수만',en:'1) Same root — only the coefficients move',zh:'① 根号内相同时只动系数'},
        head:{ko:'3\\sqrt2+5\\sqrt2=8\\sqrt2',en:'3\\sqrt2+5\\sqrt2=8\\sqrt2',zh:'3\\sqrt2+5\\sqrt2=8\\sqrt2'},
        desc:{ko:'√2를 하나의 단위로 보면 3√2는 "√2가 3개", 5√2는 "√2가 5개"입니다. 더하면 <b>√2가 8개</b>, 곧 8√2입니다. 근호 안의 수(2)는 그대로 둡니다.',
              en:'Treating √2 as one unit, 3√2 means "3 copies of √2" and 5√2 means "5 copies." Adding them gives <b>8 copies</b>, that is 8√2. The number under the root (2) never changes.',
              zh:'把√2看成一个单位，3√2就是"3个√2"，5√2就是"5个√2"。相加就是<b>8个</b>，即8√2。根号内的数(2)始终不变。'},
        mathSteps:['3+5=8', '3\\sqrt2+5\\sqrt2', '=8\\sqrt2'],
        result:{ko:'근호 안이 같으면 계수끼리만 더하거나 뺍니다!',en:'When the roots match, only the coefficients add or subtract!',zh:'根号内相同时，只把系数相加或相减！'},
        book:{ko:'m√a+n√a=(m+n)√a, m√a−n√a=(m−n)√a. 근호 안(a)이 다르면 이 규칙을 쓸 수 없습니다.',
              en:'m√a+n√a=(m+n)√a and m√a−n√a=(m−n)√a. If the number under the root (a) differs, this rule does not apply.',
              zh:'m√a+n√a=(m+n)√a，m√a−n√a=(m−n)√a。根号内的数(a)不同时不能用这条规则。'} },

      { tag:{ko:'② 다르게 보여도 정리하면 같아질 수 있음',en:'2) Different at first, but simplifying can reveal the same root',zh:'② 看起来不同，化简后可能相同'},
        head:{ko:'\\sqrt{12}+\\sqrt3=3\\sqrt3',en:'\\sqrt{12}+\\sqrt3=3\\sqrt3',zh:'\\sqrt{12}+\\sqrt3=3\\sqrt3'},
        desc:{ko:'√12와 √3은 근호 안이 달라 보이지만, √12=√(4×3)=2√3으로 <b>먼저 정리</b>하면 √3으로 똑같아집니다. 그다음은 ①과 같은 방법 — 2√3+√3=3√3입니다.',
              en:'√12 and √3 look different, but <b>simplifying first</b> — √12=√(4×3)=2√3 — makes them both √3. From there it is the same as ① — 2√3+√3=3√3.',
              zh:'√12和√3看起来不同，但<b>先化简</b>——√12=√(4×3)=2√3——就都变成了√3。接下来和①一样——2√3+√3=3√3。'},
        mathSteps:['\\sqrt{12}=2\\sqrt3', '2\\sqrt3+\\sqrt3', '=3\\sqrt3'],
        result:{ko:'정리부터 하면 근호 안이 같아지는 경우가 많습니다!',en:'Simplifying first often reveals a shared root!',zh:'先化简，往往就能发现根号内其实相同！'},
        book:{ko:'MD16(근호의 정리)에서 배운 그대로 — 근호 안에서 완전제곱 인수를 찾아 밖으로 꺼낸 뒤에 덧셈·뺄셈을 합니다. √a+√b(정리해도 다름)는 더 이상 간단히 할 수 없습니다.',
              en:'Exactly the MD16 skill — pull out perfect-square factors first, then add or subtract. If √a+√b still differ after simplifying, it cannot be simplified further.',
              zh:'和MD16学的一样——先把完全平方因数提出根号外，再做加减。若化简后√a+√b仍然不同，就不能再化简了。'} }
    ],
    rule:{ ko:'① 근호 안의 완전제곱 인수를 먼저 꺼내 정리  ② 근호 안이 같은 것끼리 계수를 더하거나 뺀다  ③ 근호 안이 다르면 더 이상 합칠 수 없다',
      en:'① Pull out any perfect-square factor first  ② Add or subtract coefficients only when the roots match  ③ If the roots differ, they cannot be combined further',
      zh:'① 先提取根号内的完全平方因数  ② 根号内相同才把系数相加或相减  ③ 根号内不同就无法再合并' }
  },

  check:{
    fills:[
      { tex:'4\\sqrt5+3\\sqrt5=\\square\\sqrt5', answer:[7],
        hint:{ ko:'√5가 몇 개인지 셉니다 — 4개+3개', en:'Count how many √5s — 4 plus 3', zh:'数一数有几个√5——4个加3个' } },
      { tex:'\\sqrt{20}-\\sqrt5=\\square\\sqrt5', answer:[1],
        hint:{ ko:'√20=2√5로 먼저 정리합니다', en:'First simplify √20 to 2√5', zh:'先把√20化简成2√5' } }
    ],
    open:{ ko:'√18+√2를 계산하는 과정을 설명해봅니다.',
      en:'Explain the process of computing √18+√2.',
      zh:'说说计算√18+√2的过程。' },
    openHint:{ ko:'√18=3√2로 정리 → 3√2+√2=4√2',
      en:'Simplify √18 to 3√2 → 3√2+√2=4√2',
      zh:'把√18化简成3√2 → 3√2+√2=4√2' }
  },

  lab:{
    generator:'md83_radicalAddSub', level:'main', count:4,
    params:{mode:'sameRadicand'},
    intro:{
      ko:'근호 안이 이미 같은 것부터! √2가 몇 개인지만 세면 됩니다.',
      en:'Start where the roots already match — just count how many copies of the root there are.',
      zh:'先从根号内已经相同的开始！只要数一数有几个根号就行。'
    }
  },

  arena:{
    generator:'md83_radicalAddSub', level:'main', count:8, timeLimit:300,
    params:{mode:'simplifyThenCombine'},
    rule:{ ko:'5분 안에 정리부터 하는 제곱근 덧셈·뺄셈을 모두 풉니다!', en:'Solve all the simplify-first square root problems in 5 minutes!', zh:'5分钟内解答所有需要先化简的平方根加减题！' }
  },

  stamp:{ label:{ ko:'제곱근 결합가', en:'Root Combiner', zh:'平方根合并师' }, coins:50 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'근호 안을 딱 맞춰 봤어! ➕',en:'You matched the roots perfectly!',zh:'根号内对得很准！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'근호 안의 수가 같은지부터 확인해봐!',en:'Check whether the numbers under the roots match first!',zh:'先看看根号内的数是不是相同！'}, {ko:'다르게 보이면 먼저 정리부터 해봐 — 같아질 수도 있어!',en:'If they look different, simplify first — they might turn out the same!',zh:'看起来不同就先化简——说不定会变成一样的！'} ],
    finish:{ ko:'완벽해! 제곱근 결합가! ➕✨', en:'Perfect! Root Combiner!', zh:'完美！平方根合并师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
