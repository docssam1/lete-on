/* Numbers of Magic — 유닛 M-16: 근호의 정리 (중등 W10 · 중3 제곱근과 실수)
   '숨은 짝 찾기' 서사는 계보1을 되새기지만 공식 lineage 태그는 붙이지 않는다 —
   계보1의 혈통은 2·5 특정('10 만들기')이고 여기는 임의 소인수의 제곱 짝이라 결이 다름 */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-16'] = {
  id:'M-16', tier:'middle3', level:'34', order:16,
  generator:'md16_simplifyRadical',
  title:{ ko:'근호의 정리', en:'Simplifying Radicals', zh:'根号的化简' },
  subtitle:{ ko:'같은 소인수가 두 번 만나면(짝) 근호 밖으로 나올 수 있어요', en:'When the same prime factor appears twice (a pair), it can step outside the root', zh:'同一个质因数出现两次(配对)，就能走出根号' },
  icon:'🔓',

  practice:{
    generator:'md16_simplifyRadical', level:'practice', count:5,
    params:{mode:'basic'},
    intro:{
      ko:'√48 = √(16×3) = √16×√3 = 4√3. 근호 안에서 완전제곱수를 찾아 밖으로 꺼내요!',
      en:'√48 = √(16×3) = √16×√3 = 4√3. Find the perfect-square factor inside the root and pull it out!',
      zh:'√48 = √(16×3) = √16×√3 = 4√3。在根号内找到完全平方因数，把它提到根号外！'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'√48은 완전제곱수가 아니라서 정수로 안 떨어져요. 그런데 48 안에는 16(=4²)이 숨어 있어요 — 근호를 계산기 없이 더 간단하게 쓸 방법이 있을까요?',
        en:'√48 isn\'t a whole number, since 48 isn\'t a perfect square. But hiding inside 48 is 16 (=4²) — is there a way to write the root more simply without a calculator?',
        zh:'√48不是完全平方数，所以不是整数。但48里面藏着16(=4²)——有没有办法不用计算器就把根号写得更简单？' },
      history:{ ko:'2와 5가 만나 10이 되는 이야기, 기억하죠? 소인수분해에서 "숨은 짝"을 찾아내는 습관은 그때부터 계속 이어지고 있어요 — 이번엔 짝이 "같은 수 두 번"으로 바뀐 것뿐이에요.',
        en:'Remember how 2 and 5 meet to make 10? The habit of hunting for "hidden pairs" in prime factorization has carried on ever since — this time the pair is just "the same number twice."',
        zh:'还记得2和5相遇变成10的故事吗？在质因数分解中寻找"隐藏配对"的习惯，从那时起就一直延续着——这次的配对只是变成了"同一个数出现两次"。' }
    },
    stages:[
      { tag:{ko:'① 완전제곱수 짝을 찾아 꺼내기',en:'1) Find the perfect-square pair and pull it out',zh:'① 找到完全平方数配对，提出来'},
        head:{ko:'\\sqrt{48} = 4\\sqrt{3}',en:'\\sqrt{48} = 4\\sqrt{3}',zh:'\\sqrt{48} = 4\\sqrt{3}'},
        desc:{ko:'48 = 16×3이고 16은 4²예요. √48 = √(4²×3) = √4²×√3 = <b>4√3</b>. 소인수분해하면 48=2×2×2×2×3 — 2가 네 번(짝 두 쌍)이라 2×2=4가 근호 밖으로 나올 수 있어요.',
              en:'48 = 16×3, and 16 is 4². So √48 = √(4²×3) = √4²×√3 = <b>4√3</b>. Factoring into primes, 48=2×2×2×2×3 — since 2 appears four times (two pairs), 2×2=4 can step outside the root.',
              zh:'48 = 16×3，而16是4²。所以√48 = √(4²×3) = √4²×√3 = <b>4√3</b>。质因数分解48=2×2×2×2×3——2出现了4次(两对配对)，所以2×2=4能走出根号。'},
        mathSteps:['48=16\\times3', '\\sqrt{48}=\\sqrt{16}\\times\\sqrt{3}', '=4\\sqrt3'],
        result:{ko:'근호 안의 완전제곱수 인수를 찾아 밖으로 꺼내요!',en:'Find the perfect-square factor inside the root and step it outside!',zh:'找到根号内的完全平方因数，提到根号外！'},
        book:{ko:'a²×b (b는 제곱인 인수가 없는 수) 꼴이면 √(a²b) = a√b로 정리해요. 이게 근호의 "가장 간단한 꼴"이에요.',
              en:'If a number has the form a²×b (where b has no square factors), then √(a²b) = a√b — this is the "simplest form" of a radical.',
              zh:'如果一个数是a²×b的形式(b没有平方因数)，就化简为√(a²b) = a√b——这就是根号的"最简形式"。'} },

      { tag:{ko:'② 이미 계수가 있으면 곱해서 합침',en:'2) With an existing coefficient, multiply it in',zh:'② 已有系数时相乘合并'},
        head:{ko:'5\\sqrt{48} = 20\\sqrt{3}',en:'5\\sqrt{48} = 20\\sqrt{3}',zh:'5\\sqrt{48} = 20\\sqrt{3}'},
        desc:{ko:'근호 앞에 이미 5가 있어도 방법은 같아요. √48을 먼저 4√3으로 정리한 뒤, 원래 있던 5와 새로 꺼낸 4를 곱해요(5×4=20). <b>정리 → 곱하기</b> 순서만 지키면 돼요.',
              en:'Even with a 5 already in front, the method is the same. First simplify √48 to 4√3, then multiply the original 5 by the newly pulled-out 4 (5×4=20). Just keep the order: <b>simplify, then multiply</b>.',
              zh:'就算根号前已经有5，方法也一样。先把√48化简成4√3，再把原来的5和新提出的4相乘(5×4=20)。只要按<b>先化简、再相乘</b>的顺序就行。'},
        mathSteps:['5\\sqrt{48}', '=5\\times4\\sqrt3', '=20\\sqrt3'],
        result:{ko:'원래 있던 계수와 새로 꺼낸 수를 곱해요!',en:'Multiply the original coefficient by the newly pulled-out number!',zh:'把原来的系数和新提出的数相乘！'},
        book:{ko:'c√(a²b) = ca√b — 원래 계수 c와 근호에서 꺼낸 a를 곱해 하나의 계수로 합쳐요.',
              en:'c√(a²b) = ca√b — multiply the original coefficient c by a (pulled from the root) into one coefficient.',
              zh:'c√(a²b) = ca√b——把原系数c和从根号里提出的a相乘，合成一个系数。'} }
    ],
    rule:{ ko:'① 근호 안을 소인수분해해 완전제곱 인수를 찾기  ② 그 인수를 근호 밖으로 꺼내기  ③ 원래 계수가 있으면 꺼낸 수와 곱해 합치기',
      en:'① Factor inside the root to find the perfect-square factor  ② Pull that factor outside the root  ③ If there\'s an existing coefficient, multiply it by what you pulled out',
      zh:'① 对根号内质因数分解，找出完全平方因数  ② 把这个因数提到根号外  ③ 若已有系数，与提出的数相乘合并' }
  },

  check:{
    fills:[
      { tex:'\\sqrt{18} = \\square\\sqrt{\\square}', answer:[3,2],
        hint:{ ko:'18=9×2, 9=3²', en:'18=9×2, 9=3²', zh:'18=9×2，9=3²' } },
      { tex:'\\sqrt{75} = \\square\\sqrt{\\square}', answer:[5,3],
        hint:{ ko:'75=25×3, 25=5²', en:'75=25×3, 25=5²', zh:'75=25×3，25=5²' } }
    ],
    open:{ ko:'√200을 가장 간단한 꼴로 정리하는 과정을 설명해봐요.',
      en:'Explain the process of simplifying √200 to its simplest form.',
      zh:'说说把√200化成最简形式的过程。' },
    openHint:{ ko:'200=100×2, 100=10² → √200=10√2',
      en:'200=100×2, 100=10² → √200=10√2',
      zh:'200=100×2，100=10² → √200=10√2' }
  },

  lab:{
    generator:'md16_simplifyRadical', level:'main', count:4,
    params:{mode:'wide'},
    intro:{
      ko:'이번엔 더 큰 수! 소인수분해부터 차근차근 해봐.',
      en:'Bigger numbers this time! Factor into primes step by step.',
      zh:'这次数字更大！一步步做质因数分解。'
    }
  },

  arena:{
    generator:'md16_simplifyRadical', level:'main', count:8, timeLimit:300,
    params:{mode:'withCoeff'},
    rule:{ ko:'5분 안에 계수가 있는 근호 정리를 모두 풀어요!', en:'Solve all the radicals-with-a-coefficient problems in 5 minutes!', zh:'5分钟内解答所有带系数的根号化简题！' }
  },

  stamp:{ label:{ ko:'근호 해방가', en:'Radical Liberator', zh:'根号解放者' }, coins:46 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'숨은 짝을 정확히 찾아냈어! 🔓',en:'You spotted the hidden pair perfectly!',zh:'精准找到了隐藏的配对！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'근호 안을 소인수분해해서 완전제곱 인수를 찾아봐!',en:'Factor inside the root to find a perfect-square factor!',zh:'对根号内质因数分解，找找完全平方因数！'}, {ko:'같은 소인수가 두 번 만나면 짝이 돼서 밖으로 나올 수 있어!',en:'When the same prime factor appears twice, it pairs up and can step outside!',zh:'同一个质因数出现两次就能配对走出根号！'} ],
    finish:{ ko:'완벽해! 근호 해방가! 🔓✨', en:'Perfect! Radical Liberator!', zh:'完美！根号解放者！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
