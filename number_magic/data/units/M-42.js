/* Numbers of Magic — 유닛 M-42: Σ(시그마) 계산 (고등 W13 · 대수 삼각함수와 수열) — §13 기호 전환: Σ 첫 등장 */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-42'] = {
  id:'M-42', tier:'algebra', level:'41', order:4,
  lineage:['rainbow-sum'],
  generator:'md42_sigmaSum',
  title:{ ko:'Σ(시그마) 계산', en:'Sigma Notation', zh:'Σ(求和符号)计算' },
  subtitle:{ ko:'무지개 덧셈법이 새 기호 옷을 입었어요', en:'The rainbow-sum trick, wearing a new symbol', zh:'彩虹加法法换上了新符号的外衣' },
  icon:'🌈',
  symbols:[
    { sym:'Σ', read:'시그마', translate:'k에 시작 번호부터 끝 번호까지 하나씩 넣어서 나온 값을 전부 더해라',
      birth:'오일러(1755)가 합(Sum)을 뜻하는 그리스 대문자 시그마(Σ)를 이 용도로 처음 썼어요 — S를 그리스 글자로 바꾼 것뿐이에요.' }
  ],

  practice:{
    generator:'md42_sigmaSum', level:'practice', count:5,
    params:{mode:'decode'},
    intro:{
      ko:'아직 더하지 않아도 돼! Σ(k=2부터 5까지) k라는 식만 보고, 시작 k·끝 k·항의 개수 중 하나를 읽어봐.',
      en:'No adding yet! Just look at Σ(k=2 to 5) k and read off the start k, end k, or how many terms there are.',
      zh:'先不用求和！看着Σ(k=2到5) k这个式子，读出起始k、结束k或项数中的一个。'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'1부터 100까지 더하는 걸 매번 "1+2+3+…+100"이라고 길게 쓰긴 힘들어요. 이미 무지개 덧셈법으로 답(n(n+1)÷2)까지 아는데, 식 자체를 짧게 쓰는 방법은 없을까요? <b>Σ</b>가 그 줄임말이에요.',
        en:'Writing out "1+2+3+…+100" every time is exhausting. You already know the rainbow-sum answer, n(n+1)÷2 — but is there a short way to write the expression itself? <b>Σ</b> is that shorthand.',
        zh:'每次都写"1+2+3+…+100"这么长实在太累。你已经知道彩虹加法法的答案n(n+1)÷2了——但有没有办法把式子本身写短一点？<b>Σ</b>就是这个简写。' },
      history:{ ko:'오일러는 1755년에 합(Sum)을 나타내려고 그리스 대문자 S에 해당하는 <b>시그마(Σ)</b>를 골랐어요. 알파벳 S를 그리스 글자로 바꿔 쓴 것뿐이라, 사실 낯선 기호가 아니라 "합"이라는 익숙한 뜻의 새 옷이에요.',
        en:'In 1755, Euler chose the Greek capital letter <b>sigma (Σ)</b>, the Greek equivalent of S, to represent a sum. It\'s really just the letter S dressed in Greek clothes — the familiar meaning "sum" wearing an unfamiliar outfit.',
        zh:'1755年，欧拉选择了希腊大写字母<b>西格玛(Σ)</b>——相当于希腊语里的S——来表示求和。它其实就是字母S换上了希腊字母的外衣，含义还是熟悉的"求和"。' }
    },
    stages:[
      { tag:{ko:'① Σ는 "k에 하나씩 넣어서 더하라"',en:'1) Σ means "plug in k, one by one, and add"',zh:'① Σ的意思是"把k依次代入再相加"'},
        head:{ko:'\\sum_{k=1}^{4} k = 1+2+3+4=10',en:'\\sum_{k=1}^{4} k = 1+2+3+4=10',zh:'\\sum_{k=1}^{4} k = 1+2+3+4=10'},
        desc:{ko:'Σ 아래의 k=1은 "1부터 시작", 위의 4는 "4에서 끝"이라는 뜻이에요. k자리에 1,2,3,4를 차례로 넣고(이 경우는 k 자체가 식이라 그대로) 다 더하면 10. <b>Σ는 계산 방법이 아니라 "무엇을 하라"는 지시문</b>이에요 — 계산은 그다음이에요.',
        en:'The k=1 below Σ means "start at 1," and the 4 above means "end at 4." You plug 1,2,3,4 into k in turn (here the expression is just k itself) and add them all: 10. <b>Σ isn\'t a calculation method — it\'s an instruction for what to do</b>; the calculation comes after.',
        zh:'Σ下方的k=1表示"从1开始"，上方的4表示"到4结束"。把1、2、3、4依次代入k(这里表达式就是k本身)再相加：10。<b>Σ不是计算方法，而是"该做什么"的指示</b>——计算是之后的事。' },
        mathSteps:['k=1,2,3,4', '1+2+3+4', '=10'],
        result:{ko:'Σ 아래는 시작, 위는 끝 — 그 사이를 다 더하라는 뜻!',en:'Below Σ is the start, above is the end — add everything in between!',zh:'Σ下方是起点，上方是终点——把中间全部加起来！'},
        book:{ko:'Σ(k=a부터 b까지) f(k) = f(a)+f(a+1)+⋯+f(b) — 이게 Σ 기호의 완전한 뜻이에요.',
              en:'Σ(k=a to b) f(k) = f(a)+f(a+1)+⋯+f(b) — this is the full meaning of the Σ symbol.',
              zh:'Σ(k从a到b) f(k) = f(a)+f(a+1)+⋯+f(b)——这就是Σ符号的完整含义。'} },

      { tag:{ko:'② 이미 아는 마법이 공식으로',en:'2) Magic you already know, now as a formula',zh:'② 早就会的魔法变成了公式'},
        head:{ko:'\\sum_{k=1}^{n} k = \\dfrac{n(n+1)}{2},\\quad \\sum_{k=1}^{n} k^2 = \\dfrac{n(n+1)(2n+1)}{6}',en:'\\sum_{k=1}^{n} k = \\dfrac{n(n+1)}{2},\\quad \\sum_{k=1}^{n} k^2 = \\dfrac{n(n+1)(2n+1)}{6}',zh:'\\sum_{k=1}^{n} k = \\dfrac{n(n+1)}{2},\\quad \\sum_{k=1}^{n} k^2 = \\dfrac{n(n+1)(2n+1)}{6}'},
        desc:{ko:'Σk(k=1~n)는 무지개 덧셈법 그 공식(n(n+1)÷2)이고, Σk²(k=1~n)은 제곱수의 합 공식(n(n+1)(2n+1)÷6)이에요. <b>새로 외울 건 없어요</b> — 예전에 배운 두 마법에 Σ라는 짧은 이름표를 붙인 것뿐이에요.',
              en:'Σk from 1 to n is exactly the rainbow-sum formula (n(n+1)÷2), and Σk² from 1 to n is exactly the sum-of-squares formula (n(n+1)(2n+1)÷6). <b>Nothing new to memorize</b> — it\'s the same two tricks you already learned, just wearing the short Σ name tag.',
              zh:'Σk(k=1~n)正是彩虹加法法的公式(n(n+1)÷2)，Σk²(k=1~n)正是平方数之和的公式(n(n+1)(2n+1)÷6)。<b>不用背新东西</b>——只是给早就学过的两个魔法贴上了Σ这个简短的名牌。'},
        mathSteps:[{ko:'\\sum k \\to \\text{무지개 덧셈법}',en:'\\sum k \\to \\text{the rainbow sum}',zh:'\\sum k \\to \\text{彩虹加法法}'}, {ko:'\\sum k^2 \\to \\text{제곱수의 합}',en:'\\sum k^2 \\to \\text{sum of squares}',zh:'\\sum k^2 \\to \\text{平方数之和}'}],
        result:{ko:'Σ는 새 계산이 아니라, 이미 아는 공식에 붙는 새 이름이에요!',en:'Σ isn\'t new math — it\'s a new name for formulas you already know!',zh:'Σ不是新的计算，而是给已知公式贴上的新名字！'},
        book:{ko:'Σ(pk+q)처럼 항이 여러 조각이면 p·Σk + q·Σ1로 쪼개서 각각 계산한 뒤 더해요.',
              en:'For a term with several pieces like Σ(pk+q), split it into p·Σk + q·Σ1, compute each, then add.',
              zh:'像Σ(pk+q)这种由多部分组成的项，拆成p·Σk + q·Σ1分别计算再相加。'} }
    ],
    rule:{ ko:'Σ는 "k에 시작부터 끝까지 하나씩 넣어 더하라"는 지시문. Σk=n(n+1)÷2(무지개 덧셈법), Σk²=n(n+1)(2n+1)÷6(제곱수의 합) — 이미 아는 공식이에요!',
      en:'Σ is the instruction "plug k in from start to end and add." Σk=n(n+1)÷2 (rainbow sum), Σk²=n(n+1)(2n+1)÷6 (sum of squares) — formulas you already know!',
      zh:'Σ是"把k从起点到终点依次代入相加"的指示。Σk=n(n+1)÷2(彩虹加法法)，Σk²=n(n+1)(2n+1)÷6(平方数之和)——都是你已经会的公式！' }
  },

  check:{
    fills:[
      { tex:'\\sum_{k=1}^{6} k = \\square', answer:21,
        hint:{ ko:'6×7÷2=21', en:'6×7÷2=21', zh:'6×7÷2=21' } },
      { tex:'\\sum_{k=1}^{3} k^2 = \\square', answer:14,
        hint:{ ko:'1+4+9=14, 또는 3×4×7÷6=14', en:'1+4+9=14, or 3×4×7÷6=14', zh:'1+4+9=14，或3×4×7÷6=14' } }
    ],
    open:{ ko:'Σ(k=1~5) k가 왜 무지개 덧셈법과 같은 계산인지 설명해봐요.',
      en:'Explain why Σ(k=1 to 5) k is the same calculation as the rainbow-sum trick.',
      zh:'说说为什么Σ(k=1到5) k和彩虹加法法是同一种计算。' },
    openHint:{ ko:'Σ(k=1~5)k=1+2+3+4+5 — 무지개 덧셈법이 구하던 바로 그 합이에요. n=5로 n(n+1)÷2=15',
      en:'Σ(k=1 to 5)k=1+2+3+4+5 — exactly the sum the rainbow-sum trick finds. With n=5, n(n+1)÷2=15',
      zh:'Σ(k=1到5)k=1+2+3+4+5——正是彩虹加法法要求的那个和。n=5时，n(n+1)÷2=15' }
  },

  lab:{
    generator:'md42_sigmaSum', level:'main', count:4,
    params:{mode:'sumK2'},
    intro:{
      ko:'이번엔 Σk²! 제곱수의 합 공식 n(n+1)(2n+1)÷6을 그대로 써봐.',
      en:'Σk² this time! Use the sum-of-squares formula n(n+1)(2n+1)÷6 directly.',
      zh:'这次是Σk²！直接用平方数之和公式n(n+1)(2n+1)÷6。'
    }
  },

  arena:{
    generator:'md42_sigmaSum', level:'main', count:8, timeLimit:300,
    params:{mode:'sumAffine',wide:true},
    rule:{ ko:'5분 안에 Σ(pk+q) 문제를 모두 쪼개서 풀어요!', en:'Split and solve all the Σ(pk+q) problems in 5 minutes!', zh:'5分钟内拆解并解答所有Σ(pk+q)题目！' }
  },

  stamp:{ label:{ ko:'시그마 마법사', en:'Sigma Sorcerer', zh:'西格玛法师' }, coins:56 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'무지개 덧셈법이 Σ로 옷을 갈아입어도 알아보는구나! 🌈',en:'You recognized the rainbow-sum trick even in its Σ costume!',zh:'彩虹加法法换上Σ的外衣你也认得出来！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'Σk는 무지개 덧셈법 공식 n(n+1)÷2를 그대로 써!',en:'For Σk, just use the rainbow-sum formula n(n+1)÷2!',zh:'Σk直接用彩虹加法法公式n(n+1)÷2！'}, {ko:'Σk²는 제곱수의 합 공식 n(n+1)(2n+1)÷6이야!',en:'Σk² is the sum-of-squares formula n(n+1)(2n+1)÷6!',zh:'Σk²是平方数之和公式n(n+1)(2n+1)÷6！'} ],
    finish:{ ko:'완벽해! 시그마 마법사! 🌈✨', en:'Perfect! Sigma Sorcerer!', zh:'完美！西格玛法师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
