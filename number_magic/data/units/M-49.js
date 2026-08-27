/* Numbers of Magic — 유닛 M-49: 일차식의 계산 (중1 W8 · 문자와 식, 심화 유형 2차 2026-08-27) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-49'] = {
  id:'M-49', tier:'middle1', level:'30', order:12,
  generator:'md49_linearExprOps',
  title:{ ko:'일차식의 계산', en:'Linear Expression Operations', zh:'一次式的运算' },
  subtitle:{ ko:'괄호를 풀고, 동류항끼리 더해요', en:'Expand the parentheses, then combine like terms', zh:'展开括号，合并同类项' },
  icon:'📎',

  practice:{
    generator:'md49_linearExprOps', level:'practice', count:5,
    params:{mode:'distribute'},
    intro:{
      ko:'괄호 앞의 수는 괄호 안 모든 항에 하나씩 곱해요(분배법칙) — 한 항이라도 빠뜨리면 안 돼요!',
      en:'The number in front of parentheses multiplies every term inside, one by one (the distributive law) — don\'t skip a single term!',
      zh:'括号前的数要分别乘到括号里每一项(分配律)——一项都不能漏！'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'상자 안에 여러 물건이 들어 있을 때, 상자 앞의 숫자는 상자 "안의 모든 것"에 곱해져요. 3(2x+5)는 상자 안의 2x와 5 둘 다에 3을 곱하라는 뜻이에요.',
        en:'When a box contains several items, the number in front of the box multiplies "everything inside" it. 3(2x+5) means multiply both the 2x and the 5 inside the box by 3.',
        zh:'当箱子里装着几样东西时，箱子前面的数字要乘到"里面的所有东西"。3(2x+5)的意思是箱子里的2x和5都要乘以3。' },
      history:{ ko:'분배법칙(a(b+c)=ab+ac)은 고대 바빌로니아·이집트 사람들도 넓이를 나눠 계산할 때 무의식중에 쓰던 원리예요. 유클리드가 기원전 3세기 『원론』에서 처음 도형으로 증명했어요.',
        en:'The distributive law (a(b+c)=ab+ac) was used, even unconsciously, by the ancient Babylonians and Egyptians when splitting areas to calculate. Euclid was the first to prove it geometrically in his 3rd-century BCE "Elements".',
        zh:'分配律(a(b+c)=ab+ac)其实是古巴比伦人、埃及人分割面积计算时不自觉用到的原理。欧几里得在公元前3世纪的《几何原本》中首次用图形证明了它。' }
    },
    stages:[
      { tag:{ko:'① 분배법칙 — 괄호 안 모든 항에 곱해요',en:'1) The distributive law — multiply every term inside',zh:'① 分配律——乘到括号内每一项'},
        head:{ko:'3(2x+5) = 6x+15',en:'3(2x+5) = 6x+15',zh:'3(2x+5) = 6x+15'},
        desc:{ko:'괄호 앞의 3은 괄호 안의 <b>2x와 5 둘 다</b>에 곱해져요. 3×2x=6x, 3×5=15 — 두 계산을 각각 하고 더하면 6x+15가 나와요.',
              en:'The 3 in front of the parentheses multiplies <b>both 2x and 5</b> inside. 3×2x=6x and 3×5=15 — compute each and add to get 6x+15.',
              zh:'括号前的3要乘到<b>2x和5两项</b>。3×2x=6x，3×5=15——分别算出来再相加得到6x+15。'},
        mathSteps:['3\\times 2x', '3\\times 5', '6x+15'],
        result:{ko:'괄호 앞의 수는 안의 모든 항에 하나씩 곱해요!',en:'The number in front multiplies every term inside, one by one!',zh:'括号前的数分别乘到里面每一项！'},
        book:{ko:'괄호 앞에 −가 있으면(예: −(2x+5)) 안의 모든 항의 부호가 바뀌어요: −2x−5.',
              en:'If there\'s a − in front of the parentheses (e.g., −(2x+5)), every term inside flips sign: −2x−5.',
              zh:'括号前有−号时(如−(2x+5))，里面每一项的符号都要变：−2x−5。'} },

      { tag:{ko:'② 동류항끼리만 더하거나 빼요',en:'2) Add or subtract only like terms',zh:'② 只把同类项相加减'},
        head:{ko:'(2x+5)+(3x-1) = 5x+4',en:'(2x+5)+(3x-1) = 5x+4',zh:'(2x+5)+(3x-1) = 5x+4'},
        desc:{ko:'문자와 차수가 같은 항(<b>동류항</b>)끼리만 더하거나 빼요. 2x와 3x는 동류항이라 더하면 5x, 5와 −1도 동류항(상수항)이라 더하면 4예요.',
              en:'Add or subtract only terms with the same letter and degree (<b>like terms</b>). 2x and 3x are like terms, adding to 5x; 5 and −1 are also like terms(constants), adding to 4.',
              zh:'只有文字和次数相同的项(<b>同类项</b>)才能相加减。2x和3x是同类项，相加得5x；5和−1也是同类项(常数项)，相加得4。'},
        mathSteps:['2x+3x=5x', '5+(-1)=4', '5x+4'],
        result:{ko:'문자와 차수가 같은 항끼리만 더하거나 빼요!',en:'Combine only terms with matching letters and degrees!',zh:'只合并文字和次数都相同的项！'},
        book:{ko:'x항과 상수항은 절대 서로 더할 수 없어요 — 종류가 다른 항이기 때문이에요.',
              en:'An x-term and a constant term can never be added together — they\'re different kinds of terms.',
              zh:'x项和常数项绝不能相加——它们是不同种类的项。'} }
    ],
    rule:{ ko:'괄호는 분배법칙으로 풀고(모든 항에 곱하기), 그다음 동류항(문자·차수가 같은 항)끼리만 더하거나 빼요!',
      en:'Expand parentheses with the distributive law (multiply every term), then combine only like terms (same letter and degree)!',
      zh:'先用分配律展开括号(乘到每一项)，再只合并同类项(文字和次数相同的项)！' }
  },

  check:{
    fills:[
      { tex:'4(x+2) = \\square x + \\square', answer:[4,8],
        hint:{ ko:'4×x, 4×2', en:'4×x, 4×2', zh:'4×x, 4×2' } },
      { tex:'(3x+2)+(x+5) = \\square x + \\square', answer:[4,7],
        hint:{ ko:'3x+x=4x, 2+5=7', en:'3x+x=4x, 2+5=7', zh:'3x+x=4x, 2+5=7' } }
    ],
    open:{ ko:'2(x+3)−(x+1)을 분배법칙과 동류항 정리 순서로 설명해봐요.',
      en:'Explain 2(x+3)−(x+1) using the distributive law and then combining like terms.',
      zh:'按分配律和合并同类项的顺序说说2(x+3)−(x+1)。' },
    openHint:{ ko:'2x+6-x-1 = x+5',
      en:'2x+6-x-1 = x+5',
      zh:'2x+6-x-1 = x+5' }
  },

  lab:{
    generator:'md49_linearExprOps', level:'main', count:4,
    params:{mode:'addSub'},
    intro:{
      ko:'동류항끼리만 더하거나 빼요 — x항은 x항끼리, 상수항은 상수항끼리!',
      en:'Combine only like terms — x-terms with x-terms, constants with constants!',
      zh:'只合并同类项——x项归x项，常数项归常数项！'
    }
  },

  arena:{
    generator:'md49_linearExprOps', level:'main', count:8, timeLimit:300,
    params:{mode:'mixed'},
    rule:{ ko:'5분 안에 분배법칙과 동류항 정리를 한 번에 해내요!', en:'Distribute and combine like terms all in one go, within 5 minutes!', zh:'5分钟内一次完成分配律和合并同类项！' }
  },

  stamp:{ label:{ ko:'괄호 해체 마스터', en:'Parentheses-Expansion Master', zh:'括号展开大师' }, coins:44 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'괄호를 풀고 동류항까지 완벽하게 정리했구나! 📎',en:'You expanded the parentheses and combined the like terms perfectly!',zh:'你展开括号又完美合并了同类项！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'괄호 앞의 수를 안의 모든 항에 곱해봐!',en:'Multiply every term inside by the number in front!',zh:'把括号前的数乘到里面每一项！'}, {ko:'문자와 차수가 같은 항끼리만 더해!',en:'Only combine terms with the same letter and degree!',zh:'只合并文字和次数相同的项！'} ],
    finish:{ ko:'완벽해! 괄호 해체 마스터! 📎✨', en:'Perfect! Parentheses-Expansion Master!', zh:'完美！括号展开大师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
