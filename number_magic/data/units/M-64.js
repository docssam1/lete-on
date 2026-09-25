/* Numbers of Magic — 유닛 M-64: 일차부등식 (중2 W9 · 중등 교과 연산 3차 2026-09-20)
   표기 주의: 이 파일의 tex 는 KaTeX 간격 명령으로 `\quad` 만 쓴다(mid9.js 상단 주석 참조). */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-64'] = {
  id:'M-64', tier:'middle2', level:'33', order:6,
  generator:'md64_linearInequality',
  title:{ ko:'일차부등식', en:'Linear Inequalities', zh:'一元一次不等式' },
  subtitle:{ ko:'방정식과 똑같이 풀되, 음수로 나눌 때만 방향을 뒤집습니다', en:'Solve it just like an equation — flip the sign only when you divide by a negative', zh:'解法和方程一样，只在除以负数时把方向反过来' },
  icon:'📶',

  practice:{
    generator:'md64_linearInequality', level:'practice', count:5,
    params:{mode:'positive'},
    intro:{
      ko:'부등식도 방정식처럼 이항하고 나누면 됩니다 — 양수로 나눌 때는 방향이 그대로입니다!',
      en:'Transpose and divide just as with an equation — dividing by a positive keeps the direction the same!',
      zh:'不等式也是移项、相除——除以正数时方向不变！'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'3 < 5는 누가 봐도 맞습니다. 그런데 양변에 −1을 곱하면 −3과 −5가 되는데, 이번엔 −3이 더 큽니다. 수직선에서 두 수를 원점 반대쪽으로 옮기면 왼쪽·오른쪽이 통째로 뒤바뀌기 때문입니다. 부등식에서 조심할 건 이 한 가지뿐입니다.',
        en:'Everyone agrees 3 < 5. But multiply both sides by minus one and you get −3 and −5, where now −3 is the bigger one. Flipping both numbers to the other side of zero swaps left and right entirely. That one fact is the only thing to watch in inequalities.',
        zh:'3 < 5谁都认同。可两边同乘−1得到−3和−5，这时反而是−3更大。把两个数翻到0的另一侧，左右就整个调换了。不等式里要小心的就只有这一件事。' },
      history:{ ko:'"<"와 ">" 기호는 1631년 영국의 토머스 해리엇이 남긴 유고에서 처음 인쇄됐습니다. 그보다 앞서 등호 "="를 만든 로버트 레코드는 "평행한 두 선분보다 더 같은 것은 없으니까"라고 이유를 적어 뒀는데, 부등호도 같은 발상입니다 — 벌어진 쪽이 큰 수입니다.',
        en:'The two inequality signs were first printed in 1631, in the posthumous papers of the English mathematician Thomas Harriot. Robert Recorde, who had invented the equals sign earlier, explained his choice by saying that no two things can be more equal than a pair of parallel lines. The inequality signs follow the same visual logic: the open end faces the larger number.',
        zh:'"<"和">"最早印在1631年英国数学家托马斯·哈里奥特的遗稿里。更早发明"="的罗伯特·雷科德曾解释说"没有比两条平行线更相等的东西了"——不等号也是同样的视觉道理：张开的一侧对着大数。' }
    },
    stages:[
      { tag:{ko:'① 양수로 나눌 때 — 방향 그대로',en:'1) Dividing by a positive — direction unchanged',zh:'① 除以正数时——方向不变'},
        head:{ko:'3x + 2 > 11 \\quad\\Rightarrow\\quad x > 3',en:'3x + 2 > 11 \\quad\\Rightarrow\\quad x > 3',zh:'3x + 2 > 11 \\quad\\Rightarrow\\quad x > 3'},
        desc:{ko:'2를 이항해 3x>9, 양변을 3으로 나눠 x>3. 방정식을 풀 때와 <b>한 글자도 다르지 않습니다</b> — 부등호만 그대로 따라 내려옵니다.',
              en:'Transpose the 2 to get 3x>9, then divide both sides by 3 for x>3. This is <b>identical</b> to solving an equation — the inequality sign just comes along unchanged.',
              zh:'把2移项得3x>9，两边除以3得x>3。这和解方程<b>一模一样</b>——不等号原样跟下来就行。'},
        mathSteps:['3x > 11 - 2', '3x > 9', 'x > 3'],
        result:{ko:'답은 하나가 아니라 3보다 큰 수 전부입니다!',en:'The answer is not one number but every number greater than 3!',zh:'答案不是一个数，而是所有大于3的数！'},
        book:{ko:'방정식의 답은 점 하나, 부등식의 답은 <b>범위</b>입니다. 수직선에 그리면 3에서 시작해 오른쪽으로 뻗은 반직선이 됩니다(3 자리는 비운 동그라미).',
              en:'An equation gives a single point; an inequality gives a <b>range</b>. On a number line it is a ray starting at 3 and running right, with an open circle at 3 itself.',
              zh:'方程的答案是一个点，不等式的答案是一个<b>范围</b>。画在数轴上就是从3开始向右的射线，3那里画空心圆。'} },

      { tag:{ko:'② 음수로 나눌 때 — 방향 뒤집기',en:'2) Dividing by a negative — flip the direction',zh:'② 除以负数时——方向反转'},
        head:{ko:'-2x + 1 \\ge 7 \\quad\\Rightarrow\\quad x \\le -3',en:'-2x + 1 \\ge 7 \\quad\\Rightarrow\\quad x \\le -3',zh:'-2x + 1 \\ge 7 \\quad\\Rightarrow\\quad x \\le -3'},
        desc:{ko:'1을 이항해 −2x≥6까지는 그대로입니다. 마지막에 −2로 나누는 순간 <b>≥가 ≤로</b> 뒤집혀 x≤−3이 됩니다. x=−4를 넣어 확인해 보면 −2(−4)+1=9로 정말 7 이상입니다.',
              en:'Transposing the 1 gives −2x≥6, still unchanged. The moment you divide by −2, <b>the sign turns around</b> and you get x≤−3. Check with x=−4: −2(−4)+1 = 9, which really is at least 7.',
              zh:'把1移项得−2x≥6，这一步没变。最后除以−2的瞬间，<b>≥变成≤</b>，得到x≤−3。代入x=−4验证：−2(−4)+1=9，确实不小于7。'},
        mathSteps:['-2x \\ge 7 - 1', '-2x \\ge 6', 'x \\le -3'],
        result:{ko:'음수로 곱하거나 나눌 때만 뒤집습니다 — 더하기·빼기는 그대로!',en:'Flip only when multiplying or dividing by a negative — adding and subtracting never flip!',zh:'只有乘除负数时才反转——加减永远不变！'},
        book:{ko:'헷갈리면 항상 <b>수를 하나 넣어 확인</b>합니다. 답의 범위 안에 있는 수를 원래 식에 넣었을 때 참이 되면 맞게 푼 거입니다.',
              en:'When in doubt, <b>test a number</b>: pick one inside your answer range, put it into the original inequality, and see whether it comes out true.',
              zh:'拿不准时就<b>代一个数验证</b>：在答案范围里取一个数代回原式，看看是否成立。'} }
    ],
    rule:{ ko:'부등식은 방정식과 똑같이 풉니다 — 단, 음수로 곱하거나 나눌 때만 부등호의 방향을 뒤집습니다!',
      en:'Solve inequalities exactly like equations — except flip the sign when you multiply or divide by a negative!',
      zh:'不等式和方程一样解——只是乘除负数时要把不等号方向反过来！' }
  },

  check:{
    fills:[
      { tex:'2x + 1 > 9 \\quad\\Rightarrow\\quad x > \\square', answer:4,
        hint:{ ko:'2x>8이니 양변을 2로 나눕니다', en:'2x>8, so divide both sides by 2', zh:'2x>8，两边除以2' } },
      { tex:'-3x \\ge 12 \\quad\\Rightarrow\\quad x \\le \\square', answer:-4,
        hint:{ ko:'−3으로 나누며 방향을 뒤집습니다', en:'Divide by −3 and flip the direction', zh:'除以−3并反转方向' } }
    ],
    open:{ ko:'−x+5<2를 풀고, 왜 부등호가 뒤집히는지 설명해봅니다.',
      en:'Solve −x+5<2 and explain why the inequality sign flips.',
      zh:'解−x+5<2，并说明为什么不等号会反转。' },
    openHint:{ ko:'−x<−3 → x>3',
      en:'−x<−3 → x>3',
      zh:'−x<−3 → x>3' }
  },

  lab:{
    generator:'md64_linearInequality', level:'main', count:4,
    params:{mode:'flip',wide:true},
    intro:{
      ko:'x의 계수가 음수입니다 — 마지막에 나눌 때 방향을 뒤집는 걸 잊지 마세요!',
      en:'The coefficient of x is negative — do not forget to flip the direction at the last division!',
      zh:'x的系数是负数——最后相除时别忘了把方向反过来！'
    }
  },

  arena:{
    generator:'md64_linearInequality', level:'main', count:8, timeLimit:360,
    params:{mode:'integer',wide:true},
    rule:{ ko:'6분 안에 범위를 구하고, 그 범위의 가장 큰 정수까지 답합니다!', en:'Within 6 minutes, find the range and then the largest integer in it!', zh:'6分钟内求出范围，再答出范围内最大的整数！' }
  },

  stamp:{ label:{ ko:'방향 감시자', en:'Keeper of Direction', zh:'方向守护者' }, coins:50 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'부등호 방향까지 정확했어! 📶',en:'You got the direction of the sign right too!',zh:'连不等号的方向都答对了！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'음수로 나눴다면 방향을 뒤집어야 해!',en:'If you divided by a negative, the sign has to flip!',zh:'如果除以了负数，方向就要反过来！'}, {ko:'답 범위의 수를 하나 넣어 확인해 보자!',en:'Test a number from your answer range and check!',zh:'从答案范围里取一个数代回去验证！'} ],
    finish:{ ko:'완벽해! 방향 감시자! 📶✨', en:'Perfect! Keeper of Direction!', zh:'完美！方向守护者！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
