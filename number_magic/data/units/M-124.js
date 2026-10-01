/* Numbers of Magic — 유닛 M-124: 원소의 개수 공식 (고등 공통수학2 · 과정 54 예정, 2026-09-29)
   근거: docs/high-build-spec.md MD124. 예시는 새로 만들었다. */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-124'] = {
  id:'M-124', tier:'highmath2', level:'54', order:124,
  generator:'md124_setSize',
  title:{ ko:'원소의 개수 공식', en:'Counting Elements of Unions', zh:'元素个数公式' },
  subtitle:{ ko:'두 번 센 것을 한 번 뺍니다', en:'Subtract what was counted twice', zh:'减去数了两次的部分' },
  icon:'🧮',

  practice:{
    generator:'md124_setSize', level:'practice', count:6,
    params:{mode:'union'},
    intro:{
      ko:'n(A∪B)=n(A)+n(B)−n(A∩B) 에서 모르는 값 하나를 구합니다. 여집합은 n(U) 에서 뺍니다.',
      en:'Use n(A∪B)=n(A)+n(B)−n(A∩B) to find the one unknown value; complements are subtracted from n(U).',
      zh:'由n(A∪B)=n(A)+n(B)−n(A∩B)求出一个未知值；补集用n(U)去减。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'축구를 좋아하는 학생 12 명과 농구를 좋아하는 학생 9 명을 그냥 더하면 둘 다 좋아하는 학생을 두 번 센 것입니다. 그 겹친 부분을 한 번 빼면 정확한 인원이 나옵니다.',
        en:'Adding 12 soccer fans and 9 basketball fans counts the fans of both twice. Subtract that overlap once and you get the true total.',
        zh:'把喜欢足球的12人和喜欢篮球的9人直接相加，两种都喜欢的人被数了两次。减去一次重叠部分，就得到准确人数。' }
    },
    stages:[
      { tag:{ko:'① 두 집합',en:'1) Two sets',zh:'① 两个集合'},
        head:{ko:'n(A\\cup B)=12+9-4=17',en:'n(A\\cup B)=12+9-4=17',zh:'n(A\\cup B)=12+9-4=17'},
        desc:{ko:'n(A)=12, n(B)=9, n(A∩B)=4 이면 n(A∪B)=<b>17</b> 입니다.',
              en:'If n(A)=12, n(B)=9, n(A∩B)=4, then n(A∪B)=<b>17</b>.',
              zh:'n(A)=12、n(B)=9、n(A∩B)=4时，n(A∪B)=<b>17</b>。'},
        mathSteps:['12+9-4=17'],
        result:{ko:'겹친 만큼 빼기!',en:'Subtract the overlap!',zh:'减去重叠部分！'},
        book:{ko:'n(A^C∩B^C)=n(U)−n(A∪B) 처럼 드모르간의 법칙과 함께 씁니다.',
              en:'It combines with De Morgan’s law, e.g. n(A^C∩B^C)=n(U)−n(A∪B).',
              zh:'与德摩根律结合使用，如n(A^C∩B^C)=n(U)−n(A∪B)。'} },

      { tag:{ko:'② 세 집합',en:'2) Three sets',zh:'② 三个集合'},
        head:{ko:'10+8+7-3-2-4+1=17',en:'10+8+7-3-2-4+1=17',zh:'10+8+7-3-2-4+1=17'},
        desc:{ko:'n(A)=10, n(B)=8, n(C)=7, n(A∩B)=3, n(B∩C)=2, n(C∩A)=4, n(A∩B∩C)=1 이면 n(A∪B∪C)=<b>17</b> 입니다.',
              en:'With n(A)=10, n(B)=8, n(C)=7, n(A∩B)=3, n(B∩C)=2, n(C∩A)=4, n(A∩B∩C)=1: n(A∪B∪C)=<b>17</b>.',
              zh:'n(A)=10、n(B)=8、n(C)=7、n(A∩B)=3、n(B∩C)=2、n(C∩A)=4、n(A∩B∩C)=1时，n(A∪B∪C)=<b>17</b>。'},
        mathSteps:['25-9+1=17'],
        result:{ko:'더하고, 빼고, 다시 더하고!',en:'Add, subtract, add back!',zh:'加、减、再加回！'},
        book:{ko:'가운데 A∩B∩C 는 세 번 더해지고 세 번 빠지므로 한 번 다시 더합니다.',
              en:'The centre A∩B∩C is added three times and removed three times, so add it back once.',
              zh:'中间的A∩B∩C加了三次又减了三次，所以再加回一次。'} },

      { tag:{ko:'③ 최댓값과 최솟값',en:'3) Greatest and least',zh:'③ 最大值与最小值'},
        head:{ko:'M=18,\\quad m=18+20-30=8',en:'M=18,\\quad m=18+20-30=8',zh:'M=18,\\quad m=18+20-30=8'},
        desc:{ko:'n(U)=30, n(A)=18, n(B)=20 일 때 n(A∩B) 는 A 전체가 B 안에 들어갈 때 가장 커서 <b>18</b>, A∪B 가 U 전체가 될 때 가장 작아서 <b>8</b> 입니다.',
              en:'With n(U)=30, n(A)=18, n(B)=20, n(A∩B) is largest (<b>18</b>) when A sits inside B, and smallest (<b>8</b>) when A∪B fills U.',
              zh:'n(U)=30、n(A)=18、n(B)=20时，n(A∩B)在A全部含于B时最大为<b>18</b>，在A∪B等于U时最小为<b>8</b>。'},
        mathSteps:['n(A\\cup B)\\le30'],
        result:{ko:'한쪽 끝은 포함, 다른 끝은 꽉 채우기!',en:'One end: containment; the other: fill U!',zh:'一端是包含，另一端是填满！'},
        book:{ko:'n(A)+n(B) 가 n(U) 보다 작거나 같으면 A∩B 가 비어 있을 수 있어 최솟값은 0 입니다.',
              en:'If n(A)+n(B) is at most n(U), the intersection can be empty, so the least value is 0.',
              zh:'若n(A)+n(B)不大于n(U)，交集可以为空，最小值为0。'} }
    ],
    rule:{ ko:'① n(A∪B)=n(A)+n(B)−n(A∩B)  ② 세 집합은 둘씩 빼고 셋을 다시 더합니다  ③ 최대는 포함될 때, 최소는 U 를 채울 때',
      en:'① n(A∪B)=n(A)+n(B)−n(A∩B)  ② Three sets: subtract the pairs, add back the triple  ③ Greatest when one contains the other, least when U is filled',
      zh:'① n(A∪B)=n(A)+n(B)−n(A∩B)  ② 三个集合减去两两交集，再加回三者交集  ③ 包含时最大，填满U时最小' }
  },

  check:{
    fills:[
      { tex:{ko:'n(A)=7,\\ n(B)=5,\\ n(A\\cup B)=10\\ \\Rightarrow\\ n(A\\cap B)=\\square',en:'n(A)=7,\\ n(B)=5,\\ n(A\\cup B)=10\\ \\Rightarrow\\ n(A\\cap B)=\\square',zh:'n(A)=7,\\ n(B)=5,\\ n(A\\cup B)=10\\ \\Rightarrow\\ n(A\\cap B)=\\square'}, answer:2,
        hint:{ ko:'7+5−10', en:'7+5−10', zh:'7+5−10' } },
      { tex:{ko:'n(U)=20,\\ n(A\\cup B)=14\\ \\Rightarrow\\ n(A^{C}\\cap B^{C})=\\square',en:'n(U)=20,\\ n(A\\cup B)=14\\ \\Rightarrow\\ n(A^{C}\\cap B^{C})=\\square',zh:'n(U)=20,\\ n(A\\cup B)=14\\ \\Rightarrow\\ n(A^{C}\\cap B^{C})=\\square'}, answer:6,
        hint:{ ko:'20−14', en:'20−14', zh:'20−14' } }
    ],
    open:{ ko:'세 집합의 공식에서 n(A∩B∩C) 를 다시 더해야 하는 까닭을 벤 다이어그램의 가운데 영역으로 설명해 봅니다.',
      en:'Using the centre region of a Venn diagram, explain why n(A∩B∩C) must be added back in the three-set formula.',
      zh:'用韦恩图的中间区域说说三个集合的公式中为什么要加回n(A∩B∩C)。' },
    openHint:{ ko:'가운데 영역은 n(A)+n(B)+n(C) 에서 3 번 세고, 둘씩의 교집합에서 3 번 빠져 0 번이 되므로 1 번 더합니다.',
      en:'The centre is counted 3 times in n(A)+n(B)+n(C) and removed 3 times with the pairs, leaving 0, so add it once.',
      zh:'中间区域在n(A)+n(B)+n(C)中数了3次，在两两交集中减了3次，变成0次，所以加回1次。' }
  },

  lab:{
    generator:'md124_setSize', level:'main', count:6,
    params:{mode:'three'},
    intro:{
      ko:'세 집합의 공식에 아는 값을 모두 넣고, 모르는 하나를 구합니다.',
      en:'Put every known value into the three-set formula and solve for the one unknown.',
      zh:'把已知值全部代入三个集合的公式，求出唯一的未知值。'
    }
  },

  arena:{
    generator:'md124_setSize', level:'main', count:6, timeLimit:420,
    params:{mode:'bound'},
    rule:{ ko:'7분 안에 원소의 개수의 최댓값과 최솟값을 모두 찾습니다!', en:'Find every greatest and least count within 7 minutes!', zh:'7分钟内求出所有元素个数的最大值与最小值！' }
  },

  stamp:{ label:{ ko:'겹침 계산사', en:'Overlap Accountant', zh:'重叠会计师' }, coins:51 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'겹친 부분까지 정확해! 🧮',en:'Overlap handled exactly!',zh:'重叠部分也算得准确！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'겹친 부분을 한 번 빼!',en:'Subtract the overlap once!',zh:'把重叠部分减去一次！'}, {ko:'가운데를 다시 더했는지 봐!',en:'Did you add the centre back?',zh:'看看有没有加回中间部分！'} ],
    finish:{ ko:'완벽해! 겹침 계산사! 🧮✨', en:'Perfect! Overlap Accountant!', zh:'完美！重叠会计师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
