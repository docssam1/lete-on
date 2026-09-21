/* Numbers of Magic — 유닛 M-72: 연립방정식의 활용 (중등 교과 연산 4차 2026-09-21)
   표기 주의: 이 파일의 tex 는 KaTeX 간격 명령으로 `\quad` 만 쓴다(mid9.js 상단 주석 참조). */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-72'] = {
  id:'M-72', tier:'middle2', level:'33', order:9,
  generator:'md72_systemApply',
  title:{ ko:'연립방정식의 활용', en:'Systems of Equations in Use', zh:'二元一次方程组的应用' },
  subtitle:{ ko:'모르는 것이 둘이면 식도 둘 — 관계를 두 개 찾습니다', en:'Two unknowns need two relations, so look for two', zh:'有两个未知数就要两个关系——找出两个来' },
  icon:'⚖️',

  practice:{
    generator:'md72_systemApply', level:'practice', count:5,
    params:{mode:'countSum'},
    intro:{ ko:'개수의 합이 한 식, 금액의 합이 또 한 식입니다!', en:'The counts add up for one equation and the money adds up for the other!', zh:'个数之和是一个式子，金额之和是另一个式子！' }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'사탕 몇 개, 초콜릿 몇 개를 샀는지 묻는데 모르는 것이 둘입니다. "모두 10개를 샀다"만으로는 알 수 없습니다 — 1개와 9개일 수도, 5개와 5개일 수도 있기 때문입니다. 그런데 "모두 8000원을 냈다"가 더해지는 순간 짝이 딱 하나로 좁혀집니다. 두 관계가 만나 답 하나를 만드는 거입니다.', en:'How many sweets and how many chocolates? Two things are unknown. Knowing that there were ten in all is not enough - it could be one and nine, or five and five. But add "and it came to 8000 won" and exactly one pair survives. Two relations meeting is what pins the answer down.', zh:'买了几个糖果、几块巧克力？未知的有两个。只知道"一共10个"还不够——可能是1和9，也可能是5和5。但一加上"一共付了8000元"，就只剩下唯一一对了。两个关系相遇，才定下一个答案。' },
      history:{ ko:'『구장산술』 제8장은 제목 자체가 "방정"이고, 벼의 수확량을 묻는 연립방정식이 실려 있습니다. 계수만 네모나게 늘어놓고 줄끼리 빼 나가는 풀이법이 적혀 있는데, 이것이 1800년대 서양에서 "가우스 소거법"이라 부르게 된 방법과 같습니다 — 2000년 앞선 셈입니다.', en:'Chapter 8 of the Chinese Nine Chapters is named for this very topic and solves systems about rice yields. It lays the coefficients out in a square and subtracts row from row - the same method the West would later call Gaussian elimination, arrived at some two thousand years earlier.', zh:'《九章算术》第八章的标题就是"方程"，里面是求稻谷产量的方程组。解法是把系数排成方阵、一行减一行——这正是19世纪西方称为"高斯消元法"的方法，早了约两千年。' }
    },
    stages:[
      { tag:{ ko:'① 전체와 속내용, 두 관계', en:'1) The whole and what is in it - two relations', zh:'① 总量与内含量，两个关系' },
        head:{ ko:'x + y = 10, \\quad 500x + 1500y = 8000', en:'x + y = 10, \\quad 500x + 1500y = 8000', zh:'x + y = 10, \\quad 500x + 1500y = 8000' },
        desc:{ ko:'개수의 합이 첫 식, <b>금액</b>의 합이 둘째 식입니다. 두 식이 서로 다른 것을 말해야 합니다 — 같은 말을 두 번 쓰면 아무것도 좁혀지지 않습니다.', en:'The counts give one equation and the <b>money</b> gives the other. The two must say different things - saying the same thing twice narrows nothing down.', zh:'个数之和是第一个式子，<b>金额</b>之和是第二个。两个式子必须说不同的事——说两遍同一件事什么也定不下来。' },
        mathSteps:['x + y = 10', '500x + 1500y = 8000', 'x = 7, \\; y = 3'],
        result:{ ko:'"몇 개"와 "얼마" — 서로 다른 두 관계!', en:'How many and how much - two different relations!', zh:'"几个"和"多少钱"——两个不同的关系！' },
        book:{ ko:'구한 뒤에는 반드시 <b>두 식 모두</b>에 넣어 확인하세요. 한 식만 맞는 답은 계산을 어딘가에서 틀린 것입니다.', en:'Once you have an answer, put it back into <b>both</b> equations. An answer that fits only one of them means a slip somewhere.', zh:'求出后一定要代回<b>两个式子</b>检验。只满足一个式子的答案，说明某处算错了。' } },

      { tag:{ ko:'② 농도 — 소금의 양은 변하지 않는다', en:'2) Concentration - the salt does not change', zh:'② 浓度——盐的量不变' },
        head:{ ko:'x + y = 400, \\quad \\dfrac{5}{100}x + \\dfrac{15}{100}y = 40', en:'x + y = 400, \\quad \\dfrac{5}{100}x + \\dfrac{15}{100}y = 40', zh:'x + y = 400, \\quad \\dfrac{5}{100}x + \\dfrac{15}{100}y = 40' },
        desc:{ ko:'소금물을 섞어도 <b>소금의 양은 그대로</b>입니다. 소금물의 양의 합이 첫 식, 소금의 양의 합이 둘째 식입니다. 소금의 양 = 소금물의 양 × 농도 ÷ 100입니다.', en:'Mixing does not change <b>how much salt there is</b>. The solutions add up for one equation and the salt adds up for the other, where the salt is the amount of solution times the percent over a hundred.', zh:'盐水混合后<b>盐的量不变</b>。盐水的量之和是第一个式子，盐的量之和是第二个。盐的量 = 盐水的量 × 浓度 ÷ 100。' },
        mathSteps:['x + y = 400', '5x + 15y = 4000', 'x = 200, \\; y = 200'],
        result:{ ko:'섞여도 변하지 않는 것을 찾으면 둘째 식이 나옵니다!', en:'Find what mixing leaves unchanged and the second equation appears!', zh:'找出混合后不变的量，第二个式子就出来了！' },
        book:{ ko:'분모 100은 양변에 100을 곱해 먼저 없애세요. 분수를 달고 풀면 계산이 길어지고 실수가 늘어납니다 — 정수로 고친 뒤 푸는 것이 정석입니다.', en:'Clear the hundreds first by multiplying both sides by 100. Dragging fractions through the working makes it longer and more error-prone; tidy to whole numbers, then solve.', zh:'先两边同乘100把分母去掉。带着分数解会变长也容易出错——化成整数再解才是正道。' } }
    ],
    rule:{ ko:'모르는 것이 둘이면 서로 다른 관계를 둘 찾습니다 — 전체와 속내용, 거리와 시간, 소금물과 소금!', en:'Two unknowns need two different relations - the whole and its contents, distance and time, solution and salt!', zh:'有两个未知数就找两个不同的关系——总量与内含量、路程与时间、盐水与盐！' }
  },

  check:{
    fills:[
      { tex:'x + y = 10, \\; 500x + 1500y = 8000 \\quad\\Rightarrow\\quad x = \\square', answer:7,
        hint:{ ko:'금액 식에서 500x+1500(10−x)=8000', en:'From 500x + 1500(10-x) = 8000', zh:'由500x+1500(10−x)=8000' } },
      { tex:{ ko:'\\text{8\\%의 소금물 } 200g \\quad\\Rightarrow\\quad \\text{소금} = \\square g', en:'\\text{200 g of 8\\% solution} \\quad\\Rightarrow\\quad \\text{salt} = \\square \\text{ g}', zh:'\\text{8\\%的盐水} 200g \\quad\\Rightarrow\\quad \\text{盐} = \\square g' }, answer:16,
        hint:{ ko:'200 × 8 ÷ 100', en:'200 x 8 / 100', zh:'200×8÷100' } }
    ],
    open:{ ko:'농도 문제에서 둘째 식을 어떻게 세우는지 말해봅니다.', en:'Explain how you build the second equation in a mixing problem.', zh:'说说浓度问题里第二个式子是怎么列的。' },
    openHint:{ ko:'섞기 전후로 소금의 양이 같다는 데서', en:'From the salt being the same before and after mixing', zh:'由混合前后盐的总量相等' }
  },

  lab:{
    generator:'md72_systemApply', level:'main', count:4,
    params:{mode:'speed'},
    intro:{ ko:'거리의 합이 한 식, 시간의 합이 또 한 식입니다!', en:'The distances add up for one equation and the times for the other!', zh:'路程之和是一个式子，时间之和是另一个！' }
  },

  arena:{
    generator:'md72_systemApply', level:'main', count:8, timeLimit:360,
    params:{mode:'mixture'},
    rule:{ ko:'6분 안에 소금물의 양과 소금의 양, 두 식을 세워 풉니다!', en:'Within 6 minutes, build both equations - the solution and the salt - and solve!', zh:'6分钟内列出盐水的量和盐的量两个式子并解出！' }
  },

  stamp:{ label:{ ko:'두 관계의 추적자', en:'Tracker of Two Relations', zh:'双关系追踪者' }, coins:56 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, { ko:'서로 다른 두 관계를 잘 찾았구나! ⚖️', en:'You found two genuinely different relations!', zh:'你找出了两个真正不同的关系！' }, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ { ko:'두 식이 서로 다른 것을 말하고 있는지 봐!', en:'Check the two equations are saying different things!', zh:'看看两个式子说的是不是不同的事！' }, { ko:'소금의 양은 소금물 × 농도 ÷ 100이야!', en:'Salt is solution times percent over a hundred!', zh:'盐的量是盐水×浓度÷100！' } ],
    finish:{ ko:'완벽해! 두 관계의 추적자! ⚖️✨', en:'Perfect! Tracker of Two Relations!', zh:'完美！双关系追踪者！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
