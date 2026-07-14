/* Numbers of Magic — 유닛 B-15: 7단·9단 혼합 — 구구 완성! (중급 E 챕터15) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['B-15'] = {
  id:'B-15', tier:'intermediate', level:'B', order:15,
  generator:'ml3_tt69',
  title:{ ko:'7단·9단 혼합 — 구구 완성!', en:'7s & 9s Mix — Times Tables Complete!', zh:'7和9的口诀混合 — 口诀全完成！' },
  subtitle:{ ko:'7단과 9단을 마스터하면 구구는 끝!', en:'Master 7s and 9s — times tables complete!', zh:'7和9的口诀掌握了，乘法口诀就全会了！' },
  icon:'🏆',

  practice:{
    generator:'ml3_tt69', level:'practice', count:5,
    params:{ tables:[7,9] },
    intro:{
      ko:'7단과 9단을 섞어 연습해 볼 거야! 어떤 단인지 잘 보고 답을 눌러줘. 준비됐지?',
      en:"Mix of 7s and 9s! Check which table it is, then tap the answer. Ready?",
      zh:'7和9的混合练习！看清是哪个口诀，再按出答案。准备好了吗？'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    stages:[
      { tag:{ko:'① 7과 9의 만남', en:'1) Where 7 and 9 Meet', zh:'① 7和9相遇'},
        head:{ko:'7×9=9×7=63 — 교환법칙!', en:'7×9 = 9×7 = 63 — Commutative law!', zh:'7×9 = 9×7 = 63 — 交换律！'},
        desc:{ko:'7단과 9단이 만나는 곳: <b>7×9=63</b>! 곱셈은 순서를 바꿔도 결과가 같아요. 교환법칙 덕분에 두 단을 배우면 사실 두 배의 곱셈식을 알게 되는 거예요!',
              en:"Where 7s and 9s meet: <b>7×9=63</b>! Multiplication is commutative — swap the order and the result stays the same. Knowing both tables means you cover twice as many facts!",
              zh:'7和9的交汇点：<b>7×9=63</b>！乘法满足交换律——交换顺序结果不变。掌握这两个口诀，实际上记住了双倍数量的乘法事实！'},
        mathSteps:['7×9 = 63','9×7 = 63','교환법칙: 순서 바꿔도 같아요!'],
        result:{ko:'7×9와 9×7은 모두 63! 하나를 외우면 다른 것도 자동으로 알아요.', en:'7×9 and 9×7 are both 63! Know one and you know the other automatically.', zh:'7×9和9×7都等于63！知道一个就自动知道另一个。'},
        book:{ko:'교환법칙: a×b = b×a. 7단과 9단을 각 9개씩 배우면, 교환법칙으로 18쌍 36가지 곱셈식을 커버해요.', en:'Commutative property: a×b = b×a. Learn 9 facts each for 7s and 9s; commutativity doubles your coverage.', zh:'交换律：a×b = b×a。学会7和9各9个事实；利用交换律覆盖范围翻倍。'} },

      { tag:{ko:'② 두 단 속도 전략', en:'2) Speed Strategy for Both', zh:'② 两个口诀的速算策略'},
        head:{ko:'7단: 이전+7 / 9단: ×10−n', en:'7s: prev+7 / 9s: ×10−n', zh:'7的口诀：前一个+7 / 9的口诀：×10−n'},
        desc:{ko:'모르는 문제가 나왔을 때! <b>7단이면 이전 답+7</b>, <b>9단이면 10배에서 n 빼기</b>. 두 가지 전략을 기억하면 어떤 문제도 풀 수 있어요!',
              en:"When you're stuck! <b>For 7s, add 7 to the previous answer</b>; <b>for 9s, multiply by 10 then subtract n</b>. Two strategies to solve any problem!",
              zh:'遇到不会的题！<b>7的口诀就在前一个答案上加7</b>，<b>9的口诀就用10倍减去n</b>。记住这两个策略，任何题都能解决！'},
        mathSteps:['7×8: 7×7=49, 49+7=56','9×8: 10×8=80, 80-8=72','패턴 전략으로 빠르게!'],
        result:{ko:'7단엔 이전+7, 9단엔 ×10−n! 두 전략으로 모든 7단·9단 문제를 해결해요.', en:'For 7s use prev+7, for 9s use ×10−n! Two strategies to conquer all 7s and 9s.', zh:'7的口诀用前一个+7，9的口诀用×10−n！两个策略搞定7和9的全部口诀！'},
        book:{ko:'7단 전략: 7×n = 7×(n−1)+7. 9단 전략: 9×n = 10×n−n. 두 전략을 기억해 두면 암산 속도가 훨씬 빨라져요.', en:'7s: 7×n = 7×(n−1)+7. 9s: 9×n = 10×n−n. Both strategies dramatically speed up mental calculation.', zh:'7的口诀：7×n = 7×(n−1)+7。9的口诀：9×n = 10×n−n。两个策略都能大幅提升心算速度。'} },

      { tag:{ko:'③ 구구단 완성!', en:'3) Times Tables Complete!', zh:'③ 乘法口诀全完成！'},
        head:{ko:'2~9단이 모두 완성되었어요', en:'All times tables 2–9 are complete!', zh:'2到9的乘法口诀全都完成了！'},
        desc:{ko:'7단과 9단을 마스터하면 <b>2단부터 9단까지 모두 완성</b>! 한 자리 수끼리의 모든 곱셈, 총 72가지를 알게 되는 거예요. 이건 정말 엄청난 성취예요!',
              en:'With 7s and 9s mastered, <b>all times tables from 2 to 9 are complete</b>! That covers all 72 single-digit multiplication facts — a truly amazing achievement!',
              zh:'掌握了7和9的口诀，<b>从2到9的乘法口诀就全部完成了</b>！这涵盖了所有72个一位数乘法事实——真是了不起的成就！'},
        mathSteps:['2~9단: 각 9개씩','= 72가지 곱셈','→ 이제 모든 한 자리 곱셈 OK!'],
        result:{ko:'2단, 3단, 4단, 5단, 6단, 7단, 8단, 9단 — 전부 완성! 이제 세 자리 곱셈도 무섭지 않아요!', en:'2s, 3s, 4s, 5s, 6s, 7s, 8s, 9s — all done! Now even 3-digit multiplication has no secrets for you!', zh:'2、3、4、5、6、7、8、9的口诀——全部完成！现在就连三位数乘法也不再可怕了！'},
        book:null }
    ],
    rule:{ ko:'① 7×9=9×7=63 교환법칙 활용  ② 7단=이전+7, 9단=×10−n  ③ 2~9단 72가지 곱셈 완성!', en:'① Use commutativity: 7×9=9×7=63  ② 7s: prev+7, 9s: ×10−n  ③ All 72 multiplication facts for 2–9 complete!', zh:'① 利用交换律：7×9=9×7=63  ② 7：前一个+7，9：×10−n  ③ 2到9共72个乘法事实全完成！' }
  },

  check:{
    fills:[
      { tex:'7 \\times 9 = \\square', answer:63,
        hint:{ ko:'7×8=56, 거기에 7을 더하면? 또는 9×7: 10×7=70, 70−7=?', en:'7×8=56, add 7; or 9×7: 10×7=70, subtract 7!', zh:'7×8=56，加7；或者9×7：10×7=70，减7！' } },
      { tex:'9 \\times 6 = \\square', answer:54,
        hint:{ ko:'10×6=60, 거기서 6을 빼면?', en:'10×6=60, subtract 6!', zh:'10×6=60，再减去6是多少？' } }
    ],
    open:{ ko:'7단과 9단 중 어느 단이 더 기억하기 쉬웠나요? 두 단에서 가장 기억하기 어려운 곱셈은 어떤 것이고, 어떤 전략으로 외웠나요?', en:'Which was easier to learn — the 7s or the 9s? What was the hardest fact in each table, and which strategy did you use to master it?', zh:'7的口诀和9的口诀，哪个更容易记住？每个口诀中最难记的是哪道，你用了什么策略记住它的？' },
    openHint:{ ko:'예) 7×8=56이 어려워서 7×7=49에서 +7로 외웠어요!', en:'e.g. 7×8=56 was tricky — I used 7×7=49 then added 7!', zh:'例）7×8=56最难记，我用7×7=49再加7来记住它！' }
  },

  lab:{
    generator:'ml3_tt69', level:'main', count:4,
    params:{ tables:[7,9] },
    intro:{
      ko:'7단과 9단이 섞여 나와! 어떤 단인지 보고 맞는 전략을 써봐.',
      en:"7s and 9s are mixed together! Spot which table and use the right strategy.",
      zh:'7和9的口诀混在一起了！看清是哪个口诀，用对策略！'
    }
  },

  arena:{
    generator:'ml3_tt69', level:'main', count:8, timeLimit:300,
    params:{ tables:[7,9] },
    rule:{ ko:'5분 안에 7단·9단 혼합 문제를 모두 풀어요! 최고의 실력을 보여줘!', en:'Solve all 7s and 9s mixed problems in 5 minutes! Show your best!', zh:'5分钟内解答所有7和9的混合口诀题！展示你的最强实力！' }
  },

  stamp:{ label:{ ko:'구구단 완성!', en:'Times Tables Complete!', zh:'口诀全达人！' }, coins:25 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'구구단 달인! 🌟',en:'Times-table master!',zh:'口诀高手！'}, {ko:'대단해! 🪄',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'음~ 다시 해볼까?',en:'Hmm, try again?',zh:'嗯，再试一次？'}, {ko:'거의 다 왔어!',en:'Almost!',zh:'就快了！'} ],
    finish:{ ko:'완벽해! 이제 진짜 구구단 완성이야! 🏆✨', en:'Perfect! Times tables fully conquered!', zh:'完美！口诀全部完成啦！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
