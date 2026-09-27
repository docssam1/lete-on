/* Numbers of Magic — 유닛 M-71: 일차부등식의 활용 (중등 교과 연산 4차 2026-09-21)
   표기 주의: 이 파일의 tex 는 KaTeX 간격 명령으로 `\quad` 만 쓴다(mid9.js 상단 주석 참조). */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-71'] = {
  id:'M-71', tier:'middle2', level:'33', order:7,
  generator:'md71_inequalityApply',
  title:{ ko:'일차부등식의 활용', en:'Linear Inequalities in Use', zh:'一元一次不等式的应用' },
  subtitle:{ ko:'"최대 몇 개"는 등식이 아니라 부등식입니다', en:'"At most how many" calls for an inequality, not an equation', zh:'"最多几个"要用不等式，不是等式' },
  icon:'🧮',

  practice:{
    generator:'md71_inequalityApply', level:'practice', count:5,
    params:{mode:'maxCount'},
    intro:{ ko:'가진 돈을 넘지 않아야 하니 ≤로 식을 세우고, 마지막에 정수를 고릅니다!', en:'The cost must not exceed what you have, so use <=, then pick a whole number at the end!', zh:'花费不能超过所有的钱，所以用≤列式，最后取整数！' }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'7000원으로 800원짜리 공책을 몇 권 살 수 있을까요? 7000÷800=8.75. 그런데 공책 0.75권은 없으니 답은 8권입니다. 부등식 문제가 방정식 문제와 다른 점이 바로 여기입니다 — 계산이 끝나도 <b>한 걸음이 더</b> 남아 있습니다.', en:'With 7000 won, how many 800-won notebooks can you buy? 7000 / 800 = 8.75 - but there is no such thing as three quarters of a notebook, so the answer is 8. That is what makes these different from equation problems: <b>one more step</b> remains after the arithmetic.', zh:'用7000元能买几本800元的笔记本？7000÷800=8.75。可是没有0.75本笔记本，所以答案是8本。不等式的题和方程的题不同就在这里——算完之后<b>还有一步</b>。' },
      history:{ ko:'부등호 <와 >는 1631년 영국의 토머스 해리엇의 유고에서 처음 인쇄됐습니다. 그런데 "이상·이하"를 뜻하는 ≤와 ≥가 널리 쓰이게 된 건 그로부터 100년도 더 지나서입니다. 경계를 포함하느냐 마느냐가 생각보다 늦게 정리된 셈인데, 지금도 학생들이 가장 자주 놓치는 자리가 바로 그 경계입니다.', en:'The signs < and > were first printed in 1631, from the papers of Thomas Harriot. But <= and >=, which include the boundary, only came into wide use more than a century later. Whether the boundary counts took a surprisingly long time to settle - and it is still the thing students most often miss.', zh:'不等号<和>最早印在1631年托马斯·哈里奥特的遗稿中。而表示"不小于、不大于"的≤和≥被广泛使用，是100多年以后的事。边界算不算在内，整理得比想象中晚——而这至今仍是学生最常忽略的地方。' }
    },
    stages:[
      { tag:{ ko:'① 예산 안에서 최대 개수', en:'1) The most you can buy within a budget', zh:'① 预算内最多买几个' },
        head:{ ko:'800x \\le 7000 \\quad\\Rightarrow\\quad x \\le 8.75', en:'800x \\le 7000 \\quad\\Rightarrow\\quad x \\le 8.75', zh:'800x \\le 7000 \\quad\\Rightarrow\\quad x \\le 8.75' },
        desc:{ ko:'"넘지 않게"는 ≤입니다. 풀면 x≤8.75인데 권 수는 자연수라 <b>8권</b>이 답입니다. 9권이면 7200원이라 예산을 넘습니다 — 답을 원래 상황에 넣어 확인하는 습관을 들이세요.', en:'"Not more than" means <=. Solving gives x <= 8.75, but you buy whole notebooks, so the answer is <b>8</b>. Nine would cost 7200 and break the budget - always put your answer back into the story to check.', zh:'"不超过"就是≤。解得x≤8.75，但本数是自然数，所以答案是<b>8本</b>。9本要7200元，超预算了——要养成把答案代回原情境检验的习惯。' },
        mathSteps:['800x \\le 7000', 'x \\le 8.75', 'x = 8'],
        result:{ ko:'범위를 구한 뒤 정수를 고르는 한 걸음이 더!', en:'Find the range, then take one more step to the whole number!', zh:'求出范围后，还要多走一步取整数！' },
        book:{ ko:'"최대"를 물으면 <b>가장 큰 정수</b>, "최소"를 물으면 <b>가장 작은 정수</b>입니다. x<5처럼 등호가 없으면 5는 답이 아니고 4가 답입니다 — 경계를 포함하는지 꼭 확인하세요.', en:'Asked for the most, take the <b>largest</b> whole number; asked for the least, the <b>smallest</b>. With x < 5 and no equals sign, 5 is out and 4 is the answer - always check whether the boundary counts.', zh:'问"最多"就取<b>最大的整数</b>，问"最少"就取<b>最小的整数</b>。像x<5没有等号时，5不算，答案是4——一定要确认边界算不算。' } },

      { tag:{ ko:'② 어느 쪽이 더 싼가', en:'2) Which option is cheaper', zh:'② 哪一种更便宜' },
        head:{ ko:'3000 + 700x < 900x \\quad\\Rightarrow\\quad x > 15', en:'3000 + 700x < 900x \\quad\\Rightarrow\\quad x > 15', zh:'3000 + 700x < 900x \\quad\\Rightarrow\\quad x > 15' },
        desc:{ ko:'회원은 연회비 3000원에 한 개 700원, 비회원은 한 개 900원입니다. 회원이 <b>더 싸지는</b> 지점을 묻고 있으니 부등호로 잇고, 경계 15를 <b>넘는</b> 가장 작은 정수 16개부터 회원이 유리합니다.', en:'Members pay a 3000 fee plus 700 an item; non-members pay 900 an item. The question is when membership becomes <b>cheaper</b>, so join the two with an inequality: past the boundary of 15, membership wins from 16 items on.', zh:'会员缴3000元年费后每个700元，非会员每个900元。问的是会员什么时候<b>更便宜</b>，所以用不等号连接：超过临界值15，从16个起会员更划算。' },
        mathSteps:['3000 < 200x', 'x > 15', 'x = 16'],
        result:{ ko:'두 비용을 각각 식으로 쓰고 부등호로 잇습니다!', en:'Write each cost as an expression and join them with an inequality!', zh:'把两种花费分别写成式子，再用不等号连接！' },
        book:{ ko:'경계 15에서는 두 비용이 <b>같습니다</b>. 그래서 "더 싸다"를 물으면 16부터, "같거나 싸다"를 물으면 15부터입니다 — 문제의 말 한 글자가 답을 하나 바꿉니다.', en:'At the boundary of 15 the two costs are <b>equal</b>. So "cheaper" starts at 16, while "cheaper or the same" starts at 15 - one word in the question moves the answer by one.', zh:'在临界值15处两种花费<b>相等</b>。所以问"更便宜"从16开始，问"不贵于"从15开始——题目里一个字就让答案差一个。' } }
    ],
    rule:{ ko:'범위를 구한 다음 정수를 고르는 한 걸음이 더 있습니다 — 경계를 포함하는지 꼭 확인하세요!', en:'There is one more step after the range: pick the whole number - and always check whether the boundary is included!', zh:'求出范围后还要取整数——一定要确认边界算不算！' }
  },

  check:{
    fills:[
      { tex:{ko:'1200x \\le 9000 \\quad\\Rightarrow\\quad \\text{최대 } x = \\square',en:'1200x \\le 9000 \\quad\\Rightarrow\\quad \\text{greatest } x = \\square',zh:'1200x \\le 9000 \\quad\\Rightarrow\\quad \\text{最大的 } x = \\square'}, answer:7,
        hint:{ ko:'9000÷1200=7.5', en:'9000/1200 = 7.5', zh:'9000÷1200=7.5' } },
      { tex:{ko:'x > 12 \\quad\\Rightarrow\\quad \\text{가장 작은 정수} = \\square',en:'x > 12 \\quad\\Rightarrow\\quad \\text{smallest integer} = \\square',zh:'x > 12 \\quad\\Rightarrow\\quad \\text{最小的整数} = \\square'}, answer:13,
        hint:{ ko:'12는 포함되지 않습니다', en:'12 itself is not included', zh:'12不包含在内' } }
    ],
    open:{ ko:'"최대 몇 개"와 "몇 개부터"의 답이 왜 다른지 말해봅니다.', en:'Explain why "at most how many" and "from how many on" give different answers.', zh:'说说"最多几个"和"从几个起"的答案为什么不同。' },
    openHint:{ ko:'하나는 범위의 가장 큰 정수, 다른 하나는 경계를 넘는 가장 작은 정수', en:'One takes the largest integer in the range, the other the smallest past the boundary', zh:'一个取范围内最大的整数，另一个取刚超过边界的最小整数' }
  },

  lab:{
    generator:'md71_inequalityApply', level:'main', count:4,
    params:{mode:'average'},
    intro:{ ko:'평균이 기준 이상이 되려면 합이 얼마여야 할지 먼저 구해 보세요!', en:'To make the average reach the target, first work out what the total has to be!', zh:'要让平均数达标，先算出总和至少要多少！' }
  },

  arena:{
    generator:'md71_inequalityApply', level:'main', count:8, timeLimit:360,
    params:{mode:'compare'},
    rule:{ ko:'6분 안에 두 요금제를 식으로 쓰고 유리해지는 지점을 찾습니다!', en:'Within 6 minutes, write both plans as expressions and find where one wins!', zh:'6分钟内把两种收费写成式子，找出哪里开始更划算！' }
  },

  stamp:{ label:{ ko:'경계의 판단자', en:'Judge of Boundaries', zh:'边界的判断者' }, coins:52 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, { ko:'경계까지 정확히 판단했구나! 🧮', en:'You judged the boundary exactly right!', zh:'你把边界判断得分毫不差！' }, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ { ko:'범위를 구한 뒤 정수를 골라야 해!', en:'After the range, pick the whole number!', zh:'求出范围后还要取整数！' }, { ko:'등호가 있는지 없는지 다시 봐!', en:'Check again whether there is an equals sign!', zh:'再看看有没有等号！' } ],
    finish:{ ko:'완벽해! 경계의 판단자! 🧮✨', en:'Perfect! Judge of Boundaries!', zh:'完美！边界的判断者！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
