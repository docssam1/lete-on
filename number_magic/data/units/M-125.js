/* Numbers of Magic — 유닛 M-125: 진리집합과 필요충분조건 (고등 공통수학2 · 과정 55 예정, 2026-09-29)
   근거: docs/high-build-spec.md MD125. 예시는 새로 만들었다. */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-125'] = {
  id:'M-125', tier:'highmath2', level:'55', order:125,
  generator:'md125_truthSet',
  title:{ ko:'진리집합과 필요충분조건', en:'Truth Sets & Conditions', zh:'真值集合与充要条件' },
  subtitle:{ ko:'조건을 집합으로 바꾸어 봅니다', en:'Turn conditions into sets', zh:'把条件变成集合' },
  icon:'🔍',

  practice:{
    generator:'md125_truthSet', level:'practice', count:6,
    params:{mode:'truth'},
    intro:{
      ko:'전체집합 U 의 원소를 하나씩 조건에 넣어 참이 되는 것만 모읍니다. 그 모임이 진리집합이고, 원소의 개수를 셉니다.',
      en:'Put each element of the universal set U into the condition and keep those that make it true. That collection is the truth set; count its elements.',
      zh:'把全集U的元素逐个代入条件，只留下使其成立的元素。这就是真值集合，数出元素个数。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'"x 는 4 이하이다" 같은 조건은 x 에 따라 참이 되기도 하고 거짓이 되기도 합니다. 참이 되게 하는 x 를 모두 모으면 집합이 되고, 조건 사이의 관계는 집합 사이의 관계로 바뀝니다.',
        en:'A condition such as "x is at most 4" is true for some x and false for others. Collect every x that makes it true and you get a set — and relations between conditions become relations between sets.',
        zh:'像"x不大于4"这样的条件，随x不同可能成立也可能不成立。把使它成立的x全部收集起来就是一个集合，条件之间的关系就变成集合之间的关系。' }
    },
    stages:[
      { tag:{ko:'① 진리집합',en:'1) Truth set',zh:'① 真值集合'},
        head:{ko:'(x-1)(x-4)\\le 0\\ \\Rightarrow\\ P=\\{1,2,3,4\\}',en:'(x-1)(x-4)\\le 0\\ \\Rightarrow\\ P=\\{1,2,3,4\\}',zh:'(x-1)(x-4)\\le 0\\ \\Rightarrow\\ P=\\{1,2,3,4\\}'},
        desc:{ko:'U={1, 2, …, 10} 에서 p: x²−5x+4≤0 은 (x−1)(x−4)≤0 이므로 1≤x≤4 입니다. P={1, 2, 3, 4}, n(P)=<b>4</b> 입니다.',
              en:'In U={1, 2, …, 10}, p: x²−5x+4≤0 means (x−1)(x−4)≤0, so 1≤x≤4. P={1, 2, 3, 4} and n(P)=<b>4</b>.',
              zh:'在U={1, 2, …, 10}中，p: x²−5x+4≤0即(x−1)(x−4)≤0，所以1≤x≤4。P={1, 2, 3, 4}，n(P)=<b>4</b>。'},
        mathSteps:['x^2-5x+4\\le 0','1\\le x\\le 4'],
        result:{ko:'참이 되는 것만 모으기!',en:'Keep only what makes it true!',zh:'只收集成立的！'},
        book:{ko:'~p 의 진리집합은 P^C 입니다. 위의 예에서 n(P^C)=10−4=6 입니다.',
              en:'The truth set of ~p is P^C. In the example above, n(P^C)=10−4=6.',
              zh:'~p的真值集合是P^C。上例中n(P^C)=10−4=6。'} },

      { tag:{ko:'② 충분조건',en:'2) Sufficient condition',zh:'② 充分条件'},
        head:{ko:'-1\\le x\\le 2\\ \\Longrightarrow\\ x\\le a+1',en:'-1\\le x\\le 2\\ \\Longrightarrow\\ x\\le a+1',zh:'-1\\le x\\le 2\\ \\Longrightarrow\\ x\\le a+1'},
        desc:{ko:'p: −1≤x≤2 가 q: x≤a+1 이기 위한 충분조건이려면 p 의 가장 큰 값 2 도 q 를 만족해야 합니다. 2≤a+1 에서 a≥<b>1</b> 입니다.',
              en:'For p: −1≤x≤2 to be sufficient for q: x≤a+1, even the largest value 2 must satisfy q. From 2≤a+1, a≥<b>1</b>.',
              zh:'要使p: −1≤x≤2是q: x≤a+1的充分条件，p的最大值2也要满足q。由2≤a+1得a≥<b>1</b>。'},
        mathSteps:['2\\le a+1','a\\ge 1'],
        result:{ko:'끝점이 들어가면 전부 들어갑니다!',en:'If the end fits, everything fits!',zh:'端点进去了，就全进去了！'},
        book:{ko:'p⟹q 가 참이면 P 는 Q 의 부분집합이고, p 는 q 이기 위한 충분조건, q 는 p 이기 위한 필요조건입니다.',
              en:'If p⟹q is true, P is a subset of Q: p is sufficient for q, and q is necessary for p.',
              zh:'若p⟹q为真，则P是Q的子集：p是q的充分条件，q是p的必要条件。'} },

      { tag:{ko:'③ 필요충분조건',en:'3) Necessary and sufficient',zh:'③ 充要条件'},
        head:{ko:'x^2+ax+b\\le 0\\ \\Longleftrightarrow\\ -1\\le x\\le 5',en:'x^2+ax+b\\le 0\\ \\Longleftrightarrow\\ -1\\le x\\le 5',zh:'x^2+ax+b\\le 0\\ \\Longleftrightarrow\\ -1\\le x\\le 5'},
        desc:{ko:'두 진리집합이 같아야 하므로 x²+ax+b=(x+1)(x−5)=x²−4x−5 입니다. a=<b>−4</b>, b=<b>−5</b> 입니다.',
              en:'The truth sets must be equal, so x²+ax+b=(x+1)(x−5)=x²−4x−5, giving a=<b>−4</b> and b=<b>−5</b>.',
              zh:'两个真值集合必须相等，所以x²+ax+b=(x+1)(x−5)=x²−4x−5，a=<b>−4</b>，b=<b>−5</b>。'},
        mathSteps:['(x+1)(x-5)=x^2-4x-5'],
        result:{ko:'같은 집합이면 같은 식!',en:'Same set, same inequality!',zh:'集合相同，式子就相同！'},
        book:{ko:'−1≤x≤5 는 |x−2|≤3 과도 같습니다. 가운데 2 에서 3 만큼 떨어진 범위입니다.',
              en:'−1≤x≤5 is also |x−2|≤3: everything within 3 of the midpoint 2.',
              zh:'−1≤x≤5也就是|x−2|≤3：离中点2不超过3的范围。'} }
    ],
    rule:{ ko:'① 진리집합은 조건을 참이 되게 하는 원소의 모임  ② p⟹q 이면 P 는 Q 의 부분집합  ③ p⟺q 이면 P=Q',
      en:'① The truth set collects the elements that make the condition true  ② If p⟹q, P is a subset of Q  ③ If p⟺q, P=Q',
      zh:'① 真值集合是使条件成立的元素的集合  ② 若p⟹q，则P是Q的子集  ③ 若p⟺q，则P=Q' }
  },

  check:{
    fills:[
      { tex:{ko:'U=\\{1,2,\\cdots,10\\},\\ p:\\ |x-5|\\le 2\\ \\Rightarrow\\ n(P)=\\square',en:'U=\\{1,2,\\cdots,10\\},\\ p:\\ |x-5|\\le 2\\ \\Rightarrow\\ n(P)=\\square',zh:'U=\\{1,2,\\cdots,10\\},\\ p:\\ |x-5|\\le 2\\ \\Rightarrow\\ n(P)=\\square'}, answer:5,
        hint:{ ko:'3≤x≤7', en:'3≤x≤7', zh:'3≤x≤7' } },
      { tex:{ko:'p:\\ 1\\le x\\le 4,\\ q:\\ x\\le a,\\ p\\Longrightarrow q\\ \\Rightarrow\\ a\\ge\\square',en:'p:\\ 1\\le x\\le 4,\\ q:\\ x\\le a,\\ p\\Longrightarrow q\\ \\Rightarrow\\ a\\ge\\square',zh:'p:\\ 1\\le x\\le 4,\\ q:\\ x\\le a,\\ p\\Longrightarrow q\\ \\Rightarrow\\ a\\ge\\square'}, answer:4,
        hint:{ ko:'가장 큰 값 4 도 x≤a 를 만족해야 합니다', en:'The largest value 4 must also satisfy x≤a', zh:'最大值4也要满足x≤a' } }
    ],
    open:{ ko:'명제 p⟹q 가 참이면 진리집합 P 가 Q 의 부분집합이 되는 까닭을 설명해 봅니다.',
      en:'Explain why the truth set P is a subset of Q whenever the proposition p⟹q is true.',
      zh:'说说为什么命题p⟹q为真时，真值集合P是Q的子集。' },
    openHint:{ ko:'P 의 어느 원소를 골라도 p 가 참이고, p⟹q 이므로 q 도 참입니다. 그러니 그 원소는 Q 에도 들어 있습니다.',
      en:'Any element of P makes p true, and since p⟹q it makes q true too, so it also belongs to Q.',
      zh:'P中的任一元素都使p成立，而p⟹q，所以q也成立，这个元素也属于Q。' }
  },

  lab:{
    generator:'md125_truthSet', level:'main', count:6,
    params:{mode:'suff'},
    intro:{
      ko:'충분조건이면 p 의 범위 전체가 q 안에, 필요조건이면 q 의 범위 전체가 p 안에 들어가야 합니다. 끝점으로 a 의 범위를 정합니다.',
      en:'Sufficient: all of p’s range must lie inside q. Necessary: all of q’s range must lie inside p. Use the ends to fix the range of a.',
      zh:'充分条件时p的范围要全部落在q内，必要条件时q的范围要全部落在p内。用端点确定a的范围。'
    }
  },

  arena:{
    generator:'md125_truthSet', level:'main', count:6, timeLimit:420,
    params:{mode:'iff'},
    rule:{ ko:'7분 안에 두 진리집합이 같아지는 a, b 를 모두 찾습니다!', en:'Find every a and b that make the two truth sets equal within 7 minutes!', zh:'7分钟内求出使两个真值集合相等的所有a、b！' }
  },

  stamp:{ label:{ ko:'조건 감정사', en:'Condition Appraiser', zh:'条件鉴定师' }, coins:52 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'진리집합을 정확히 모았어! 🔍',en:'You gathered the truth set exactly!',zh:'真值集合收集得很准确！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'원소를 하나씩 넣어 봐!',en:'Try each element one by one!',zh:'把元素一个个代进去试试！'}, {ko:'끝점이 조건을 만족하는지 봐!',en:'Check whether the end point satisfies the condition!',zh:'看看端点是否满足条件！'} ],
    finish:{ ko:'완벽해! 조건 감정사! 🔍✨', en:'Perfect! Condition Appraiser!', zh:'完美！条件鉴定师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
