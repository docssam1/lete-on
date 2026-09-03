/* Numbers of Magic — 유닛 B-17: 역구구 — □ 채우기 마법 (중급 F 챕터2) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['B-17'] = {
  id:'B-17', tier:'intermediate', level:'B', order:17,
  generator:'ml4_ttMix',
  title:{ ko:'역구구 — □ 채우기 마법', en:'Reverse Tables — Fill the □', zh:'逆向口诀 — 填□魔法' },
  subtitle:{ ko:'□ × 3 = 21이면 □ = 7! 거꾸로 푸는 구구', en:'□ × 3 = 21 means □ = 7! Solving backwards', zh:'□ × 3 = 21，则□ = 7！反向求口诀' },
  icon:'🔍',

  practice:{
    generator:'ml4_ttMix', level:'practice', count:5,
    params:{ missing:true },
    intro:{
      ko:'이번엔 □에 들어갈 숫자를 찾는 거야. □ × 4 = 28이면 □는 얼마일까? 구구단을 거꾸로 생각해봐! 준비됐지?',
      en:"This time, find the missing number in the □. If □ × 4 = 28, what is □? Think backwards through your times tables! Ready?",
      zh:'这次要找□里应该填的数字。□×4=28，□是多少？反向思考乘法口诀！准备好了吗？'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 역구구란?',en:'1) What is reverse tables?',zh:'① 什么是逆向口诀？'},
        head:{ko:'□×3=21: 3단에서 21을 찾아요!',en:'□×3=21: find 21 in the 3 times table!',zh:'□×3=21：在3的口诀里找21！'},
        desc:{ko:'□×3=21처럼 <b>빈칸을 찾는 문제</b>예요. 3단을 쭉 떠올려봐요: 3,6,9,12,15,18,21... 21이 몇 번째? 7번째! 그러니까 □=7이에요.',
              en:'□×3=21 asks you to find the <b>missing number</b>. Run through the 3 times table: 3,6,9,12,15,18,21... 21 is the 7th. So □=7!',
              zh:'□×3=21这类题目要找<b>缺少的数字</b>。想想3的口诀：3,6,9,12,15,18,21……21是第几个？第7个！所以□=7。'},
        mathSteps:['□×3=21',{ko:'→ 3단에서 21 찾기',en:'→ \\text{find 21 in the ×3 table}',zh:'→ 在3的口诀里找21'},'→ 3×7=21','→ □=7 ✓'],
        result:{ko:'□×3=21 → □=7! 구구단을 거꾸로 뒤집으면 답이 나와요.',en:'□×3=21 → □=7! Flip the times table backwards to find the answer.',zh:'□×3=21 → □=7！把乘法口诀反过来就能找到答案。'},
        book:{ko:'역구구는 곱셈표를 역방향으로 읽는 것이에요. 어떤 단인지 파악하고, 그 단에서 주어진 수를 찾으면 몇 번째인지가 답이에요.',
              en:'Reverse tables mean reading the multiplication chart backwards. Identify which table it is, then find the given product — its position is your answer.',
              zh:'逆向口诀就是反向阅读乘法表。确定是哪个乘法段，在该段中找到给出的数，它的位置就是答案。'} },

      { tag:{ko:'② 나눗셈과의 연결',en:'2) Connection to division',zh:'② 与除法的联系'},
        head:{ko:'□×3=21은 21÷3=□와 같아요!',en:'□×3=21 is the same as 21÷3=□!',zh:'□×3=21与21÷3=□是一样的！'},
        desc:{ko:'역구구와 나눗셈은 <b>같은 문제</b>예요. 6×□=48은 48÷6=□와 똑같아요. 구구단을 잘 알면 나눗셈도 저절로 풀려요!',
              en:'Reverse tables and division are <b>the same problem</b>. 6×□=48 is identical to 48÷6=□. Master your times tables and division comes free!',
              zh:'逆向口诀和除法是<b>同一道题</b>。6×□=48和48÷6=□完全相同。乘法口诀掌握好了，除法自然也会了！'},
        mathSteps:['□×3=21  ↔  21÷3=□','6×□=48  ↔  48÷6=□',{ko:'구구단을 알면 나눗셈도 돼요!',en:'\\text{know your tables, and division follows!}',zh:'会乘法口诀，就会除法！'}],
        result:{ko:'역구구를 잘 풀면 나눗셈도 자동으로 알 수 있어요!',en:'Solve reverse tables well, and division becomes automatic!',zh:'逆向口诀解得好，除法也就自动掌握了！'},
        book:{ko:'곱셈과 나눗셈은 역관계예요. a×b=c이면 c÷a=b이고 c÷b=a예요. 이 관계를 알면 나눗셈 문제도 구구단으로 풀 수 있어요.',
              en:'Multiplication and division are inverse operations. If a×b=c, then c÷a=b and c÷b=a. Knowing this lets you solve division problems using your times tables.',
              zh:'乘法和除法互为逆运算。若a×b=c，则c÷a=b，c÷b=a。掌握这个关系，用乘法口诀就能解决除法题。'} },

      { tag:{ko:'③ 빠른 역구구 전략',en:'3) Quick reverse-table strategy',zh:'③ 快速逆向口诀策略'},
        head:{ko:'□×7=56: 7단을 빠르게 훑어요!',en:'□×7=56: scan the 7 times table quickly!',zh:'□×7=56：快速扫描7的口诀！'},
        desc:{ko:'□×7=56을 만났을 때: 7단을 빠르게 떠올려봐요. 7,14,21,28,35,42,49,56 — 56은 8번째! 그러니까 □=8이에요. <b>빠른 훑기</b>가 핵심이에요.',
              en:'When you see □×7=56: quickly scan the 7s. 7,14,21,28,35,42,49,56 — 56 is the 8th. So □=8! The key is <b>scanning fast</b>.',
              zh:'遇到□×7=56时：快速扫一遍7的口诀。7,14,21,28,35,42,49,56——56排在第8位！所以□=8。关键在于<b>快速扫描</b>。'},
        mathSteps:['□×7=56',{ko:'7단: 7,14,21,28,35,42,49,56',en:'\\text{×7: } 7,14,21,28,35,42,49,56',zh:'7的口诀：7,14,21,28,35,42,49,56'},'56=7×8','→ □=8 ✓'],
        result:{ko:'7단을 빠르게 훑어 56을 찾으면 □=8! 연습하면 점점 빨라져요.',en:'Scan the 7s, spot 56, and □=8! Practice makes you faster and faster.',zh:'扫描7的口诀，找到56，□=8！多练习会越来越快。'},
        book:null }
    ],
    rule:{ ko:'① 어떤 단인지 파악하고 그 단에서 답을 찾는다  ② 역구구 = 나눗셈  ③ 빠른 훑기 연습!',
      en:'① Identify the table, then find the answer within it  ② Reverse tables = division  ③ Practise scanning fast!',
      zh:'① 确定是哪个乘法段，在该段中找答案  ② 逆向口诀=除法  ③ 练习快速扫描！' }
  },

  check:{
    fills:[
      { tex:'\\square \\times 6 = 42', answer:7,
        hint:{ ko:'6단에서 42를 찾아봐요: 6,12,18,24,30,36,42 — 7번째!', en:'Find 42 in the 6 times table: 6,12,18,24,30,36,42 — 7th!', zh:'在6的口诀里找42：6,12,18,24,30,36,42——第7个！' } },
      { tex:'8 \\times \\square = 56', answer:7,
        hint:{ ko:'8단에서 56을 찾아봐요: 8,16,24,32,40,48,56 — 7번째!', en:'Find 56 in the 8 times table: 8,16,24,32,40,48,56 — 7th!', zh:'在8的口诀里找56：8,16,24,32,40,48,56——第7个！' } }
    ],
    open:{ ko:'역구구와 나눗셈이 같은 문제라는 것을 알았나요? 48÷6=□를 역구구로 어떻게 풀지 설명해 봐요.',
      en:'Now you know reverse tables and division are the same thing! Explain how you\'d solve 48÷6=□ as a reverse table problem.',
      zh:'你现在知道逆向口诀和除法是同一道题了吗？解释一下如何用逆向口诀解48÷6=□。' },
    openHint:{ ko:'예) 48÷6=□는 □×6=48이랑 같아요. 6단에서 48을 찾으면: 6,12,18,24,30,36,42,48 — 8번째! 그러니까 □=8이에요.',
      en:'e.g. 48÷6=□ is the same as □×6=48. Find 48 in the 6s: 6,12,18,24,30,36,42,48 — 8th! So □=8.',
      zh:'例）48÷6=□和□×6=48是一样的。在6的口诀里找48：6,12,18,24,30,36,42,48——第8个！所以□=8。' }
  },

  lab:{
    generator:'ml4_ttMix', level:'main', count:4,
    params:{ missing:true },
    intro:{
      ko:'이제 역구구 마법사가 될 차례야! □에 알맞은 수를 찾아봐.',
      en:"Time to become a reverse-table wizard! Find the number that fits in the □.",
      zh:'是时候成为逆向口诀魔法师了！找到□里应该填的数字。'
    }
  },

  arena:{
    generator:'ml4_ttMix', level:'main', count:8, timeLimit:300,
    params:{ missing:true },
    rule:{ ko:'5분 안에 □ 채우기 문제를 모두 풀어요!', en:'Fill all the □s in 5 minutes!', zh:'5分钟内填完所有的□！' }
  },

  stamp:{ label:{ ko:'역구구 탐정', en:'Reverse Table Detective', zh:'逆向口诀侦探' }, coins:25 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'구구단 달인! 🌟',en:'Times-table master!',zh:'口诀高手！'}, {ko:'대단해! 🪄',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'음~ 다시 해볼까?',en:'Hmm, try again?',zh:'嗯，再试一次？'}, {ko:'거의 다 왔어!',en:'Almost!',zh:'就快了！'} ],
    finish:{ ko:'완벽해! 역구구 탐정이야! 🔍✨', en:'Perfect! Reverse table detective!', zh:'完美！逆向口诀侦探！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
