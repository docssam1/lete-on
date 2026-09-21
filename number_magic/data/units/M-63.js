/* Numbers of Magic — 유닛 M-63: 연립방정식 풀이 (중2 W9 · 중등 교과 연산 3차 2026-09-20)
   표기 주의: 이 파일의 tex 는 KaTeX 간격 명령으로 `\quad` 만 쓴다(mid9.js 상단 주석 참조). */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-63'] = {
  id:'M-63', tier:'middle2', level:'33', order:8,
  generator:'md63_simultaneous',
  title:{ ko:'연립방정식 풀이', en:'Solving Systems of Equations', zh:'二元一次方程组的解法' },
  subtitle:{ ko:'한 문자를 없애면 아는 문제로 돌아와요', en:'Get rid of one letter and it becomes a problem you already know', zh:'消去一个字母，就回到已经会的问题' },
  icon:'🔗',

  practice:{
    generator:'md63_simultaneous', level:'practice', count:5,
    params:{mode:'substitution'},
    intro:{
      ko:'y가 무엇인지 이미 알려 준 식이 있어요 — 그대로 다른 식의 y 자리에 넣어 보세요!',
      en:'One equation already tells you what y is — just put it into the other equation where y sits!',
      zh:'有一个式子已经告诉你y是什么——把它直接放进另一个式子的y的位置！'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'사과 2개와 배 1개가 1100원, 사과 1개와 배 1개가 800원이에요. 사과 한 개 값은? 두 줄을 나란히 놓고 빼 보면 사과 한 개가 딱 300원이라는 게 보여요. 미지수가 둘이어도 식이 둘이면 답은 하나로 정해져요.',
        en:'Two apples and a pear cost 1100 won; one apple and a pear cost 800 won. How much is one apple? Line the two facts up and subtract: one apple is exactly 300 won. Two unknowns are fine as long as you have two equations.',
        zh:'2个苹果加1个梨1100元，1个苹果加1个梨800元。一个苹果多少钱？把两行并排相减就看出来了：一个苹果正好300元。未知数有两个也没关系，只要有两个方程，答案就唯一。' },
      history:{ ko:'연립방정식은 서양보다 동양이 훨씬 빨랐어요. 기원전 중국의 『구장산술』 제8장의 이름이 바로 "방정(方程)"인데, 벼의 수확량을 묻는 연립방정식을 계수만 네모나게 늘어놓고 줄끼리 빼 나가며 풀어요 — 1800년대 서양에서 "가우스 소거법"이라 부르게 된 방법과 같아요.',
        en:'Systems of equations appeared in the East long before the West. Chapter 8 of the Chinese Nine Chapters on the Mathematical Art (BCE) is named for exactly this topic, and it solves systems about rice yields by laying the coefficients out in a square and subtracting row from row — the same method the West later named Gaussian elimination.',
        zh:'方程组在东方比西方早得多。公元前中国的《九章算术》第八章就叫"方程"，用求稻谷产量的题目讲解法：把系数排成方阵，一行减一行——这正是19世纪西方称为"高斯消元法"的方法。' }
    },
    stages:[
      { tag:{ko:'① 대입법 — 이미 풀린 식을 그대로 넣기',en:'1) Substitution — put the solved equation straight in',zh:'① 代入法——把已解出的式子直接代入'},
        head:{ko:'y = 2x - 1, \\quad 3x + y = 9 \\quad\\Rightarrow\\quad x = 2',en:'y = 2x - 1, \\quad 3x + y = 9 \\quad\\Rightarrow\\quad x = 2',zh:'y = 2x - 1, \\quad 3x + y = 9 \\quad\\Rightarrow\\quad x = 2'},
        desc:{ko:'첫 식이 y가 무엇인지 알려 주니, 둘째 식의 y 자리에 <b>그대로</b> 넣어요. 그러면 x만 남은 일차방정식이 되고, 우리는 이미 그걸 풀 줄 알아요.',
              en:'The first equation tells you what y is, so drop it <b>as is</b> into the y slot of the second. What remains is a linear equation in x alone — and you already know how to solve that.',
              zh:'第一个式子告诉了你y是什么，就把它<b>原样</b>放进第二个式子的y的位置。剩下的是只含x的一元一次方程——这个你已经会解了。'},
        mathSteps:['3x + (2x - 1) = 9', '5x = 10', 'x = 2, \\quad y = 3'],
        result:{ko:'미지수를 하나로 줄이는 게 목적이에요!',en:'The whole point is to cut the unknowns down to one!',zh:'目的就是把未知数减到一个！'},
        book:{ko:'x를 구하고 끝내면 안 돼요 — 연립방정식의 답은 x와 y의 <b>짝</b>이에요. 구한 x를 다시 넣어 y까지 구해야 끝나요.',
              en:'Finding x is not the end — the answer to a system is a <b>pair</b>, x and y. Put x back in to get y as well.',
              zh:'只求出x还不算完——方程组的答案是x和y这一<b>对</b>。要把x代回去，把y也求出来。'} },

      { tag:{ko:'② 가감법 — 계수를 맞춘 뒤 빼기',en:'2) Elimination — match the coefficients, then subtract',zh:'② 加减法——配好系数再相减'},
        head:{ko:'2x + 3y = 13, \\quad 2x + y = 7 \\quad\\Rightarrow\\quad y = 3',en:'2x + 3y = 13, \\quad 2x + y = 7 \\quad\\Rightarrow\\quad y = 3',zh:'2x + 3y = 13, \\quad 2x + y = 7 \\quad\\Rightarrow\\quad y = 3'},
        desc:{ko:'두 식의 x 계수가 둘 다 2예요. 위에서 아래를 빼면 x가 통째로 사라지고 2y=6만 남아요. 계수가 다를 때는 서로 곱해서 같게 만든 다음 빼요.',
              en:'Both equations have 2 as the coefficient of x, so subtracting the second from the first wipes x out entirely and leaves 2y=6. When the coefficients differ, scale them until they match, then subtract.',
              zh:'两个式子中x的系数都是2，上式减下式就把x整个消掉，只剩2y=6。系数不同时，先乘成相同再相减。'},
        mathSteps:['(2x + 3y) - (2x + y) = 13 - 7', '2y = 6', 'y = 3, \\quad x = 2'],
        result:{ko:'계수를 같게 만들면 빼기만으로 사라져요!',en:'Once the coefficients match, one subtraction makes it vanish!',zh:'系数变成相同后，只要一减就消失了！'},
        book:{ko:'부호가 반대면(+2y와 −2y) 빼는 대신 <b>더해요</b>. 그래서 이름이 "가감법" — 더하거나 빼거나 둘 중 편한 쪽이에요.',
              en:'If the signs are opposite (+2y and −2y) you <b>add</b> instead of subtracting. That is why the Korean name means "add-or-subtract method" — whichever is easier.',
              zh:'符号相反时(+2y和−2y)就<b>相加</b>而不是相减。所以叫"加减法"——加还是减，哪个方便用哪个。'} }
    ],
    rule:{ ko:'미지수가 둘이면 식도 둘 — 대입법이든 가감법이든 한 문자를 없애 일차방정식으로 되돌리는 게 전부예요!',
      en:'Two unknowns need two equations — substitution or elimination, it is all about removing one letter to get back to a linear equation!',
      zh:'两个未知数就要两个方程——无论代入法还是加减法，做的都是消去一个字母，回到一元一次方程！' }
  },

  check:{
    fills:[
      { tex:'y = x + 1, \\quad 2x + y = 7 \\quad\\Rightarrow\\quad x = \\square', answer:2,
        hint:{ ko:'2x+(x+1)=7이니 3x=6', en:'2x+(x+1)=7 gives 3x=6', zh:'2x+(x+1)=7，得3x=6' } },
      { tex:'x + y = 5, \\quad x - y = 1 \\quad\\Rightarrow\\quad x = \\square', answer:3,
        hint:{ ko:'두 식을 더하면 2x=6', en:'Adding the two gives 2x=6', zh:'两式相加得2x=6' } }
    ],
    open:{ ko:'2x+y=8, x−y=1을 가감법으로 푸는 과정을 말해봐요.',
      en:'Explain how to solve 2x+y=8 and x−y=1 by elimination.',
      zh:'说说怎样用加减法解2x+y=8和x−y=1。' },
    openHint:{ ko:'더하면 3x=9 → x=3, y=2',
      en:'Add them: 3x=9 → x=3, y=2',
      zh:'相加得3x=9 → x=3，y=2' }
  },

  lab:{
    generator:'md63_simultaneous', level:'main', count:4,
    params:{mode:'elimination',wide:true},
    intro:{
      ko:'한 문자의 계수를 같게 만든 다음, 두 식을 빼서 없애 보세요!',
      en:'Make one letter’s coefficients match, then subtract the equations to remove it!',
      zh:'把一个字母的系数变成相同，再把两式相减消去它！'
    }
  },

  arena:{
    generator:'md63_simultaneous', level:'main', count:8, timeLimit:360,
    params:{mode:'mixed',wide:true},
    rule:{ ko:'6분 안에 계수를 보고 더 빠른 방법을 골라 풀어요!', en:'Within 6 minutes, look at the coefficients and pick the faster method!', zh:'6分钟内看系数选出更快的方法来解！' }
  },

  stamp:{ label:{ ko:'두 식의 연결사', en:'Linker of Two Equations', zh:'双式连接师' }, coins:52 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'한 문자를 깔끔하게 없앴구나! 🔗',en:'You eliminated one letter cleanly!',zh:'你干净利落地消去了一个字母！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'x를 구했으면 다시 넣어 y까지 구해야 해!',en:'Once you have x, put it back in and find y too!',zh:'求出x后要代回去把y也求出来！'}, {ko:'계수를 같게 만든 뒤에 빼 보자!',en:'Match the coefficients first, then subtract!',zh:'先把系数配成相同，再相减！'} ],
    finish:{ ko:'완벽해! 두 식의 연결사! 🔗✨', en:'Perfect! Linker of Two Equations!', zh:'完美！双式连接师！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
