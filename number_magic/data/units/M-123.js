/* Numbers of Magic — 유닛 M-123: 집합의 연산 (고등 공통수학2 · 과정 54 예정, 2026-09-29)
   근거: docs/high-build-spec.md MD123. 예시는 새로 만들었다. */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-123'] = {
  id:'M-123', tier:'highmath2', level:'54', order:123,
  generator:'md123_setOps',
  title:{ ko:'집합의 연산', en:'Set Operations', zh:'集合的运算' },
  subtitle:{ ko:'합집합·교집합·차집합·여집합', en:'Union, intersection, difference, complement', zh:'并集·交集·差集·补集' },
  icon:'🔀',

  practice:{
    generator:'md123_setOps', level:'practice', count:6,
    params:{mode:'basic'},
    intro:{
      ko:'A∪B 는 둘 중 어느 하나에라도 있는 원소, A∩B 는 둘 다에 있는 원소입니다. 나열한 뒤 셉니다.',
      en:'A∪B has the elements in either set; A∩B those in both. List, then count.',
      zh:'A∪B是属于其中任一集合的元素，A∩B是两个集合都有的元素。列出后再数。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'축구부 명단과 합창부 명단을 합치면 합집합, 두 명단에 모두 있는 친구들이 교집합, 축구부에만 있는 친구들이 차집합입니다. 학교 전체에서 축구부가 아닌 친구들은 여집합입니다.',
        en:'Merge the soccer list and the choir list: that is the union. Friends on both lists form the intersection, those only in soccer the difference, and everyone in school not in soccer the complement.',
        zh:'把足球队名单和合唱团名单合起来是并集，两份名单都有的朋友是交集，只在足球队的是差集，全校不在足球队的是补集。' }
    },
    stages:[
      { tag:{ko:'① 합집합과 교집합',en:'1) Union and intersection',zh:'① 并集与交集'},
        head:{ko:'A\\cup B=\\{1,2,3,4,5\\},\\ A\\cap B=\\{3,4\\}',en:'A\\cup B=\\{1,2,3,4,5\\},\\ A\\cap B=\\{3,4\\}',zh:'A\\cup B=\\{1,2,3,4,5\\},\\ A\\cap B=\\{3,4\\}'},
        desc:{ko:'A={1, 2, 3, 4}, B={3, 4, 5} 이면 n(A∪B)=<b>5</b>, n(A∩B)=<b>2</b> 입니다.',
              en:'For A={1, 2, 3, 4}, B={3, 4, 5}: n(A∪B)=<b>5</b> and n(A∩B)=<b>2</b>.',
              zh:'A={1, 2, 3, 4}、B={3, 4, 5}时，n(A∪B)=<b>5</b>，n(A∩B)=<b>2</b>。'},
        mathSteps:['n(A\\cup B)=5,\\quad n(A\\cap B)=2'],
        result:{ko:'또는 ∪, 그리고 ∩!',en:'Or is ∪, and is ∩!',zh:'或是∪，且是∩！'},
        book:{ko:'공통인 원소는 합집합에 한 번만 씁니다.',
              en:'Shared elements appear only once in the union.',
              zh:'公共元素在并集中只写一次。'} },

      { tag:{ko:'② 차집합과 여집합',en:'2) Difference and complement',zh:'② 差集与补集'},
        head:{ko:'A-B=\\{1,2\\},\\ A^{C}=\\{5,6,7,8\\}',en:'A-B=\\{1,2\\},\\ A^{C}=\\{5,6,7,8\\}',zh:'A-B=\\{1,2\\},\\ A^{C}=\\{5,6,7,8\\}'},
        desc:{ko:'U={1, 2, …, 8}, A={1, 2, 3, 4}, B={3, 4, 5} 이면 A−B 는 A 에만 있는 <b>{1, 2}</b>, A^C 는 U 에서 A 를 뺀 <b>{5, 6, 7, 8}</b> 입니다.',
              en:'With U={1, 2, …, 8}, A={1, 2, 3, 4}, B={3, 4, 5}: A−B is <b>{1, 2}</b> (only in A), and A^C is <b>{5, 6, 7, 8}</b> (U without A).',
              zh:'U={1, 2, …, 8}、A={1, 2, 3, 4}、B={3, 4, 5}时，A−B是只在A中的<b>{1, 2}</b>，A^C是U去掉A的<b>{5, 6, 7, 8}</b>。'},
        mathSteps:['A-B=A\\cap B^{C}'],
        result:{ko:'빼기는 "에만", 여집합은 "전체에서"!',en:'Difference: "only in"; complement: "from the whole"!',zh:'差集是"只在"，补集是"从全集中"！'},
        book:{ko:'A−B 와 B−A 는 다릅니다. 순서에 주의합니다.',
              en:'A−B and B−A are different: watch the order.',
              zh:'A−B与B−A不同，注意顺序。'} },

      { tag:{ko:'③ 연산 법칙',en:'3) Laws of operations',zh:'③ 运算律'},
        head:{ko:'(A\\cup B)^{C}=A^{C}\\cap B^{C}=\\{6,7,8\\}',en:'(A\\cup B)^{C}=A^{C}\\cap B^{C}=\\{6,7,8\\}',zh:'(A\\cup B)^{C}=A^{C}\\cap B^{C}=\\{6,7,8\\}'},
        desc:{ko:'위의 U, A, B 에서 A^C∩B^C 는 드모르간의 법칙으로 (A∪B)^C 와 같으므로 U 에서 {1, 2, 3, 4, 5} 를 뺀 <b>{6, 7, 8}</b> 입니다.',
              en:'With the same U, A, B, De Morgan’s law gives A^C∩B^C=(A∪B)^C: U without {1, 2, 3, 4, 5}, which is <b>{6, 7, 8}</b>.',
              zh:'对上面的U、A、B，由德摩根律A^C∩B^C=(A∪B)^C，即U去掉{1, 2, 3, 4, 5}，得<b>{6, 7, 8}</b>。'},
        mathSteps:['n=3'],
        result:{ko:'법칙으로 짧게!',en:'Shorter with the laws!',zh:'用运算律更简洁！'},
        book:{ko:'분배법칙 A∩(B∪C)=(A∩B)∪(A∩C) 도 벤 다이어그램으로 확인할 수 있습니다.',
              en:'The distributive law A∩(B∪C)=(A∩B)∪(A∩C) can also be checked with a Venn diagram.',
              zh:'分配律A∩(B∪C)=(A∩B)∪(A∩C)也可以用韦恩图验证。'} }
    ],
    rule:{ ko:'① A∪B: 또는, A∩B: 그리고  ② A−B=A∩B^C, A^C=U−A  ③ (A∪B)^C=A^C∩B^C, (A∩B)^C=A^C∪B^C',
      en:'① A∪B: or, A∩B: and  ② A−B=A∩B^C, A^C=U−A  ③ (A∪B)^C=A^C∩B^C, (A∩B)^C=A^C∪B^C',
      zh:'① A∪B：或，A∩B：且  ② A−B=A∩B^C，A^C=U−A  ③ (A∪B)^C=A^C∩B^C，(A∩B)^C=A^C∪B^C' }
  },

  check:{
    fills:[
      { tex:{ko:'A=\\{1,3,5,7\\},\\ B=\\{3,6,7\\}\\ \\Rightarrow\\ n(A\\cap B)=\\square',en:'A=\\{1,3,5,7\\},\\ B=\\{3,6,7\\}\\ \\Rightarrow\\ n(A\\cap B)=\\square',zh:'A=\\{1,3,5,7\\},\\ B=\\{3,6,7\\}\\ \\Rightarrow\\ n(A\\cap B)=\\square'}, answer:2,
        hint:{ ko:'{3, 7}', en:'{3, 7}', zh:'{3, 7}' } },
      { tex:{ko:'U=\\{1,2,3,4,5,6\\},\\ A=\\{2,4,6\\}\\ \\Rightarrow\\ n(A^{C})=\\square',en:'U=\\{1,2,3,4,5,6\\},\\ A=\\{2,4,6\\}\\ \\Rightarrow\\ n(A^{C})=\\square',zh:'U=\\{1,2,3,4,5,6\\},\\ A=\\{2,4,6\\}\\ \\Rightarrow\\ n(A^{C})=\\square'}, answer:3,
        hint:{ ko:'{1, 3, 5}', en:'{1, 3, 5}', zh:'{1, 3, 5}' } }
    ],
    open:{ ko:'(A∩B)^C=A^C∪B^C 가 성립하는 까닭을 벤 다이어그램을 그려 설명해 봅니다.',
      en:'Draw a Venn diagram to explain why (A∩B)^C=A^C∪B^C.',
      zh:'画韦恩图说说为什么(A∩B)^C=A^C∪B^C成立。' },
    openHint:{ ko:'A∩B 에 들지 않는 원소는 A 에 없거나 B 에 없는 원소입니다.',
      en:'An element outside A∩B is missing from A or missing from B.',
      zh:'不属于A∩B的元素，要么不在A中，要么不在B中。' }
  },

  lab:{
    generator:'md123_setOps', level:'main', count:6,
    params:{mode:'diff'},
    intro:{
      ko:'전체집합 U 를 먼저 보고, 차집합은 "한쪽에만", 여집합은 "U 에서 빼고" 로 원소를 나열합니다.',
      en:'Look at U first; list differences as "only in one set" and complements as "U minus the set".',
      zh:'先看全集U；差集按"只在一边"、补集按"从U中去掉"列出元素。'
    }
  },

  arena:{
    generator:'md123_setOps', level:'main', count:6, timeLimit:480,
    params:{mode:'laws'},
    rule:{ ko:'8분 안에 여러 연산이 섞인 식의 원소를 모두 셉니다!', en:'Count the elements of every mixed expression within 8 minutes!', zh:'8分钟内数完所有混合运算式的元素！' }
  },

  stamp:{ label:{ ko:'벤 다이어그램 요리사', en:'Venn Chef', zh:'韦恩图厨师' }, coins:50 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'연산이 척척이야! 🔀',en:'Operations on point!',zh:'运算得心应手！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'괄호 안부터 차례로!',en:'Inside the brackets first!',zh:'先算括号里面！'}, {ko:'여집합은 U 에서 빼는 거야!',en:'The complement is taken from U!',zh:'补集是从U中去掉！'} ],
    finish:{ ko:'완벽해! 벤 다이어그램 요리사! 🔀✨', en:'Perfect! Venn Chef!', zh:'完美！韦恩图厨师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
