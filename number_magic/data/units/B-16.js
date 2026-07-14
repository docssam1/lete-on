/* Numbers of Magic — 유닛 B-16: 2~9단 총정리 마라톤 (중급 F 챕터1) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['B-16'] = {
  id:'B-16', tier:'intermediate', level:'B', order:16,
  generator:'ml4_ttMix',
  title:{ ko:'2~9단 총정리 마라톤', en:'Full Times Table Marathon', zh:'2~9乘法口诀大总结' },
  subtitle:{ ko:'2단부터 9단까지 — 모두 한번에!', en:'2 through 9 — all at once!', zh:'2到9的乘法口诀——全部一起来！' },
  icon:'📊',

  practice:{
    generator:'ml4_ttMix', level:'practice', count:5,
    params:{ missing:false },
    intro:{
      ko:'2~9단 전체를 섞어서 연습할 거야. 어떤 단이 나와도 당황하지 말고 침착하게! 준비됐지?',
      en:"We'll mix all times tables from 2 to 9. Stay calm no matter which one appears! Ready?",
      zh:'我们要混合练习2到9的所有乘法口诀。不管出现哪个，冷静应对！准备好了吗？'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 구구단의 대칭',en:'1) Times table symmetry',zh:'① 乘法口诀的对称性'},
        head:{ko:'반쪽만 알면 전부 알 수 있어요!',en:'Know half, know it all!',zh:'只要知道一半，就能知道全部！'},
        desc:{ko:'3×7=21이고 7×3=21이에요. <b>순서를 바꿔도 답이 같아요</b>(교환법칙). 72개 전부 외울 필요 없이 36개만 알면 나머지는 뒤집으면 돼요!',
              en:'3×7=21 and 7×3=21. <b>Flip the order, same answer!</b> (commutative law) You only need to memorise 36 facts — the rest are just mirrors.',
              zh:'3×7=21，7×3也等于21。<b>交换顺序，答案相同！</b>（交换律）只需记住36个，其余的翻转一下就行了！'},
        mathSteps:['전체 72개 곱','= 중복 제거하면 36개','+ 1×1~9×9 대각선 9개','→ 효율적 학습 가능!'],
        result:{ko:'3×7과 7×3은 같아요! 36개만 외우면 72개가 완성돼요.',en:'3×7 = 7×3! Master 36 facts and you have all 72.',zh:'3×7=7×3！记住36个，72个口诀全部搞定。'},
        book:{ko:'곱셈에서 두 수의 순서를 바꿔도 결과가 같아요. 이것을 교환법칙이라 해요. 이 성질 덕분에 36개만 완벽하게 외우면 나머지는 자동으로 알 수 있어요.',
              en:'Swapping the order of two numbers in multiplication gives the same product. This is the commutative law. Thanks to this, mastering 36 facts gives you all 72 for free.',
              zh:'乘法中交换两数的顺序，结果不变，这叫交换律。利用这个性质，只需熟记36个，其余72个自动掌握。'} },

      { tag:{ko:'② 단별 기억 전략 모음',en:'2) Memory tricks by table',zh:'② 各乘法段的记忆技巧'},
        head:{ko:'단마다 쉽게 외우는 방법이 있어요!',en:'Each table has its own trick!',zh:'每个乘法段都有自己的记忆方法！'},
        desc:{ko:'<b>2단</b>: 짝수만 나와요(2,4,6…). <b>5단</b>: 끝이 0 아니면 5. <b>9단</b>: 10n−n 전략! <b>7·8단</b>: 이전 결과에 7(또는 8)을 더해요.',
              en:'<b>2s</b>: only even numbers. <b>5s</b>: ends in 0 or 5. <b>9s</b>: 10n−n trick! <b>7s & 8s</b>: add 7 (or 8) to the previous answer.',
              zh:'<b>2的口诀</b>：全是偶数。<b>5的口诀</b>：结果以0或5结尾。<b>9的口诀</b>：10n−n！<b>7·8的口诀</b>：在前一个结果上加7（或8）。'},
        mathSteps:['2단: 2,4,6,8,10,12...','5단: 5,10,15,20,25...','9단: 10n-n (예: 9×7=70-7=63)','7·8단: 이전값+7(8)'],
        result:{ko:'단별 전략을 외워두면 막힐 때 바로 쓸 수 있어요!',en:'Keep these tricks in mind for when you get stuck!',zh:'记住各段的技巧，遇到困难时随时可以用！'},
        book:{ko:'각 단마다 고유한 패턴이 있어요. 2단은 짝수, 5단은 0/5로 끝, 9단은 십의 자리+일의 자리=9. 이런 패턴을 활용하면 답이 맞는지 빠르게 확인할 수 있어요.',
              en:'Each table has a unique pattern. 2s: even numbers. 5s: ends in 0 or 5. 9s: digits sum to 9. Use these patterns to verify answers quickly.',
              zh:'每个乘法段都有独特的规律。2的口诀全是偶数，5的口诀以0或5结尾，9的口诀各位数字之和等于9。利用这些规律可以快速验证答案。'} },

      { tag:{ko:'③ 어려운 4개만 집중 공략!',en:'3) Tackle the 4 trickiest!',zh:'③ 专攻最难的4个！'},
        head:{ko:'6×7, 6×8, 7×8, 7×9만 외우면 완벽!',en:'Just memorise 6×7, 6×8, 7×8, 7×9!',zh:'只需记住6×7、6×8、7×8、7×9！'},
        desc:{ko:'대부분의 구구단은 패턴으로 해결돼요. 하지만 <b>6×7=42, 6×8=48, 7×8=56, 7×9=63</b> 이 4개는 특별히 눈에 익혀두세요. 이것만 알면 진짜 완벽!',
              en:'Most tables have patterns, but <b>6×7=42, 6×8=48, 7×8=56, 7×9=63</b> need extra attention. Nail these four and you\'re unstoppable!',
              zh:'大多数口诀都有规律可循，但<b>6×7=42、6×8=48、7×8=56、7×9=63</b>这四个需要特别记忆。记住这四个，真的完美无缺！'},
        mathSteps:['6×7=42 (기억!)', '6×8=48 (기억!)', '7×8=56 (기억!)', '7×9=63 (기억!)'],
        result:{ko:'이 4개만 특별히 외우면 2~9단 완전 정복!',en:'Commit these 4 to memory and you\'ve conquered all tables 2–9!',zh:'特别记住这4个，2~9的乘法口诀全部攻克！'},
        book:null }
    ],
    rule:{ ko:'① 교환법칙: 36개만 알면 72개 완성  ② 단별 패턴 활용  ③ 어려운 4개(42·48·56·63)는 특별 암기!',
      en:'① Commutative law: 36 facts = 72 total  ② Use table-specific patterns  ③ Special memorise: 42, 48, 56, 63',
      zh:'① 交换律：36个=72个全部  ② 利用各段规律  ③ 特别记忆四个难题：42·48·56·63' }
  },

  check:{
    fills:[
      { tex:'7 \\times 8 = \\square', answer:56,
        hint:{ ko:'7단에서 56이에요! 7×8=56 기억해요.', en:'7×8=56 — one of the four to memorise!', zh:'7×8=56——这是需要特别记忆的四个之一！' } },
      { tex:'6 \\times 9 = \\square', answer:54,
        hint:{ ko:'6단에서 9번째: 6,12,18,24,30,36,42,48,54!', en:'Count up the 6s: 6,12,18,24,30,36,42,48,54!', zh:'数6的口诀：6,12,18,24,30,36,42,48,54！' } }
    ],
    open:{ ko:'2~9단 중 가장 어렵게 느껴지는 단은 무엇인가요? 그 단을 쉽게 외울 수 있는 나만의 방법을 생각해 봐요.',
      en:'Which times table (2–9) feels hardest for you? Come up with your own trick to memorise it.',
      zh:'2~9的乘法口诀中，你觉得哪个最难？想一想你自己记忆它的方法。' },
    openHint:{ ko:'예) 8단이 어려우면? 8×5=40 (절반인 4×5=20의 두 배), 8×6=48(6×8=48로 교환), 8×7=56 특별암기!',
      en:'e.g. Struggling with 8s? 8×5=40 (double 4×5=20), 8×6=48 (swap from 6×8), 8×7=56 — special memorise!',
      zh:'例）8的口诀难？8×5=40（4×5=20翻倍），8×6=48（交换6×8），8×7=56特别记忆！' }
  },

  lab:{
    generator:'ml4_ttMix', level:'main', count:4,
    params:{ missing:false },
    intro:{
      ko:'이제 2~9단 전부를 섞어서 도전! 패턴과 전략을 활용해 봐.',
      en:'Now mix it all up — 2 through 9! Use your patterns and tricks.',
      zh:'现在混合2到9的全部口诀来挑战！运用你的规律和技巧。'
    }
  },

  arena:{
    generator:'ml4_ttMix', level:'main', count:8, timeLimit:300,
    params:{ missing:false },
    rule:{ ko:'5분 안에 2~9단 문제를 모두 풀어요!', en:'Solve all 2–9 times table problems in 5 minutes!', zh:'5分钟内解答所有2~9口诀题！' }
  },

  stamp:{ label:{ ko:'구구단 마라토너', en:'Times Table Marathoner', zh:'口诀马拉松选手' }, coins:25 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'구구단 달인! 🌟',en:'Times-table master!',zh:'口诀高手！'}, {ko:'대단해! 🪄',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'음~ 다시 해볼까?',en:'Hmm, try again?',zh:'嗯，再试一次？'}, {ko:'거의 다 왔어!',en:'Almost!',zh:'就快了！'} ],
    finish:{ ko:'완벽해! 2~9단 완전 정복! 📊✨', en:'Perfect! 2-9 times tables fully conquered!', zh:'完美！2~9的口诀全部掌握！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
