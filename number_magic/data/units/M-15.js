/* Numbers of Magic — 유닛 M-15: 제곱근의 값 (중등 W10 · 중3 제곱근과 실수) */
(function(){
'use strict';
window.NM_UNITS = window.NM_UNITS || {};

window.NM_UNITS['M-15'] = {
  id:'M-15', tier:'middle3', level:'34', order:15,
  generator:'md15_sqrtValue',
  title:{ ko:'제곱근의 값', en:'Values of Square Roots', zh:'平方根的值' },
  subtitle:{ ko:'제곱해서 그 수가 되는 수를 거꾸로 찾아요', en:'Work backward to find the number whose square gives that value', zh:'反过来找出平方后等于那个数的数' },
  icon:'🌱',

  practice:{
    generator:'md15_sqrtValue', level:'practice', count:5,
    params:{mode:'perfect'},
    intro:{
      ko:'√25는 "제곱해서 25가 되는 수"예요. 5×5=25니까 √25=5!',
      en:'√25 means "the number whose square is 25." Since 5×5=25, √25=5!',
      zh:'√25就是"平方后等于25的数"。因为5×5=25，所以√25=5！'
    }
  },

  discover:{
    title:{ ko:'누미의 마법 노트', en:"Numi's Magic Note", zh:'努米的魔法笔记' },
    story:{
      hook:{ ko:'넓이가 49인 정사각형이 있어요. 한 변의 길이는 얼마일까요? "제곱해서 49가 되는 수"를 찾아야 해요 — 곱셈을 거꾸로 하는 거예요.',
        en:'A square has an area of 49. How long is one side? You need to find "the number whose square is 49" — that\'s multiplication in reverse.',
        zh:'一个正方形的面积是49。它的边长是多少？需要找出"平方后等于49的数"——这是乘法的逆运算。' },
      history:{ ko:'제곱근 기호 √는 라틴어 radix(뿌리)의 첫 글자 r에서 변형됐다고 알려져 있어요. "근(root)"이라는 이름처럼, 어떤 수의 "뿌리"가 되는 수를 찾는 셈이에요.',
        en:'The radical symbol √ is believed to have evolved from the letter r, the first letter of the Latin radix ("root"). Just like the name "root," you\'re finding the number that "roots" a given value.',
        zh:'根号√据说是从拉丁语radix("根")的首字母r演变而来。正如"根"这个名字一样，这是在寻找某个数的"根"。' }
    },
    stages:[
      { tag:{ko:'① 루트는 진짜 "뿌리"예요',en:'1) A root is literally a root',zh:'① 根号真的是"根"'},
        head:{ko:'\\sqrt{9} = 3',en:'\\sqrt{9} = 3',zh:'\\sqrt{9} = 3'},
        desc:{ko:'<svg viewBox="0 0 200 130" style="width:min(230px,70vw);display:block;margin:0 auto 8px" aria-hidden="true"><circle cx="100" cy="38" r="30" fill="#5FB876"/><rect x="95" y="60" width="10" height="24" fill="#8a6b4a"/><line x1="0" y1="84" x2="200" y2="84" stroke="#C9A063" stroke-width="2"/><path d="M100 84 L88 108 M100 84 L100 112 M100 84 L112 108" stroke="#8a6b4a" stroke-width="3" fill="none"/><text x="100" y="44" text-anchor="middle" font-size="20" font-weight="900" fill="#fff">9</text><text x="100" y="126" text-anchor="middle" font-size="16" font-weight="900" fill="#8a6b4a">3</text></svg>땅 위의 나무가 9라면, 땅속의 <b>뿌리</b>가 3이에요. 뿌리 3이 자라서(3×3) 나무 9가 됐으니까요. 루트(root)라는 이름이 진짜 "뿌리"라는 뜻 — 나무를 보고 뿌리를 찾는 게 제곱근이에요.',
              en:'<svg viewBox="0 0 200 130" style="width:min(230px,70vw);display:block;margin:0 auto 8px" aria-hidden="true"><circle cx="100" cy="38" r="30" fill="#5FB876"/><rect x="95" y="60" width="10" height="24" fill="#8a6b4a"/><line x1="0" y1="84" x2="200" y2="84" stroke="#C9A063" stroke-width="2"/><path d="M100 84 L88 108 M100 84 L100 112 M100 84 L112 108" stroke="#8a6b4a" stroke-width="3" fill="none"/><text x="100" y="44" text-anchor="middle" font-size="20" font-weight="900" fill="#fff">9</text><text x="100" y="126" text-anchor="middle" font-size="16" font-weight="900" fill="#8a6b4a">3</text></svg>If the tree above ground is 9, its <b>root</b> below ground is 3 — the root 3 grew (3×3) into the tree 9. "Root" really means root: finding the square root is looking at a tree and finding its root.',
              zh:'<svg viewBox="0 0 200 130" style="width:min(230px,70vw);display:block;margin:0 auto 8px" aria-hidden="true"><circle cx="100" cy="38" r="30" fill="#5FB876"/><rect x="95" y="60" width="10" height="24" fill="#8a6b4a"/><line x1="0" y1="84" x2="200" y2="84" stroke="#C9A063" stroke-width="2"/><path d="M100 84 L88 108 M100 84 L100 112 M100 84 L112 108" stroke="#8a6b4a" stroke-width="3" fill="none"/><text x="100" y="44" text-anchor="middle" font-size="20" font-weight="900" fill="#fff">9</text><text x="100" y="126" text-anchor="middle" font-size="16" font-weight="900" fill="#8a6b4a">3</text></svg>如果地上的树是9，地下的<b>根</b>就是3——根3长成(3×3)了树9。"根号"的根真的就是树根的意思：求平方根，就是看着树找它的根。'},
        mathSteps:['3 \\xrightarrow{\\;\\times3\\;} 9', '\\sqrt{9}=3'],
        result:{ko:'나무(제곱)를 보고 뿌리(제곱근)를 찾아요!',en:'Look at the tree (square), find the root!',zh:'看着树(平方)，找到根(平方根)！'} },

      { tag:{ko:'② 말의 방향 — "제곱"과 "제곱근"',en:'2) Word direction — square vs square root',zh:'② 词的方向——平方与平方根'},
        head:{ko:'9\\text{의 제곱}=81,\\quad 9\\text{의 제곱근}=\\pm3',en:'\\text{square of }9=81,\\quad \\text{square roots of }9=\\pm3',zh:'9\\text{的平方}=81,\\quad 9\\text{的平方根}=\\pm3'},
        desc:{ko:'말의 방향이 반대예요! <b>"9의 제곱"</b>은 나무를 키우는 것(81), <b>"9의 제곱근"</b>은 뿌리를 캐는 것(3과 -3, 둘 다!). 그리고 <b>"제곱근 9"</b>라고 하면 그중 양수 뿌리 √9=3 하나만 가리켜요. 이 세 가지를 구분하면 중3 시험의 함정 절반이 사라져요.',
              en:'The word points in opposite directions! <b>"The square of 9"</b> grows the tree (81); <b>"the square roots of 9"</b> digs up the roots (both 3 and -3!). And <b>"root 9"</b> (√9) names only the positive root, 3. Telling these three apart removes half the traps.',
              zh:'词的方向正好相反！<b>"9的平方"</b>是把树养大(81)；<b>"9的平方根"</b>是把根挖出来(3和-3，两个都是！)。而<b>"√9"</b>只指其中正的那个根，3。分清这三个，考试陷阱少一半。'},
        mathSteps:['9^2=81', '9\\text{의 제곱근}: \\pm3', '\\sqrt{9}=3'],
        result:{ko:'제곱은 키우기, 제곱근은 캐기 — 방향이 반대!',en:'Squaring grows, rooting digs — opposite directions!',zh:'平方是养大，开方是挖根——方向相反！'},
        book:{ko:'a>0일 때 a의 제곱근은 ±√a로 두 개, "제곱근 a"(√a)는 양수인 것 하나예요.',
              en:'For a>0 there are two square roots of a, ±√a; "√a" names only the positive one.',
              zh:'当a>0时，a的平方根有两个：±√a；√a只表示其中正的那个。'} },

      { tag:{ko:'③ 뿌리 속에 음수가 들어가면?',en:'3) What if a negative hides under the root?',zh:'③ 根号里是负数会怎样？'},
        head:{ko:'\\sqrt{-9} = ?',en:'\\sqrt{-9} = ?',zh:'\\sqrt{-9} = ?'},
        desc:{ko:'그림으로 그려 보면 답이 보여요 — <b>넓이가 -9인 정사각형은 그릴 수가 없어요.</b> 어떤 수든 제곱하면 0 이상이 되니까(3²=9, (-3)²도 9), 제곱해서 음수가 되는 수는 우리가 아는 수 중엔 없어요. 그래서 √ 안에 음수가 있으면 "(실수 중엔) 없음"이 답이에요.',
              en:'Draw it and the answer appears — <b>you cannot draw a square with area -9.</b> Any number squared is at least 0 (3²=9, and (-3)² is also 9), so no number we know squares to a negative. A negative under the root means "no (real) answer."',
              zh:'画出来答案就明白了——<b>画不出面积是-9的正方形。</b>任何数的平方都不小于0(3²=9，(-3)²也是9)，所以我们认识的数里没有平方后是负数的。根号里是负数，答案就是"(实数中)不存在"。'},
        mathSteps:['3^2=9,\\;(-3)^2=9', '\\text{제곱은 항상 } \\ge 0', '\\sqrt{-9}\\;\\text{는 없음}'],
        result:{ko:'넓이가 음수인 정사각형은 못 그려요 — 그래서 없음!',en:'No square can have negative area — so no answer!',zh:'画不出负面积的正方形——所以不存在！'},
        book:{ko:'√2처럼 딱 떨어지지 않는 뿌리를 끝까지 계산하려던 히파소스가 "분수로도 못 쓴다"는 걸 알게 됐고, 그 비밀을 말했다가 바다에 던져졌다는 이야기가 전해져요 — 무리수(다 쓸 수 없는 수)의 탄생 전설이에요.',
              en:'Legend says Hippasus, computing a root like √2 that never resolves, realized it can\'t even be written as a fraction — and was thrown into the sea for telling. That\'s the legendary birth of irrational numbers.',
              zh:'传说希帕索斯在计算√2这类算不尽的根时，发现它连分数都写不成——因为说出这个秘密而被扔进了大海。这就是无理数诞生的传说。'} },

      { tag:{ko:'④ 제곱을 거꾸로 — 완전제곱수',en:'4) Undo the square — perfect squares',zh:'④ 平方的逆运算——完全平方数'},
        head:{ko:'\\sqrt{36} = 6',en:'\\sqrt{36} = 6',zh:'\\sqrt{36} = 6'},
        desc:{ko:'6×6=36이니까 √36=6이에요. 이렇게 어떤 정수의 제곱으로 정확히 나오는 수(1,4,9,16,25,36…)를 <b>완전제곱수</b>라고 해요. 완전제곱수의 제곱근은 항상 정수로 딱 떨어져요.',
              en:'Since 6×6=36, √36=6. Numbers that are exactly the square of an integer (1,4,9,16,25,36…) are called <b>perfect squares</b>. The square root of a perfect square always comes out to a whole integer.',
              zh:'因为6×6=36，所以√36=6。像这样正好是某个整数平方的数(1,4,9,16,25,36…)叫做<b>完全平方数</b>。完全平方数的平方根总是恰好是整数。'},
        mathSteps:['6\\times6=36', '\\sqrt{36}=\\square', '\\sqrt{36}=6'],
        result:{ko:'완전제곱수의 제곱근은 항상 정수예요!',en:'The square root of a perfect square is always an integer!',zh:'完全平方数的平方根总是整数！'},
        book:{ko:'어떤 수 a의 제곱근 중 양수인 것을 √a로 나타내요. a가 완전제곱수면 √a는 정수예요.',
              en:'Among the square roots of a number a, the positive one is written √a. If a is a perfect square, √a is an integer.',
              zh:'一个数a的平方根中，正的那个记作√a。如果a是完全平方数，√a就是整数。'} },

      { tag:{ko:'⑤ 제곱근을 다시 제곱하면 원래대로',en:'5) Squaring a root undoes it',zh:'⑤ 平方根再平方，回到原数'},
        head:{ko:'(\\sqrt{7})^2 = 7,\\quad \\sqrt{(-7)^2}=7',en:'(\\sqrt{7})^2 = 7,\\quad \\sqrt{(-7)^2}=7',zh:'(\\sqrt{7})^2 = 7,\\quad \\sqrt{(-7)^2}=7'},
        desc:{ko:'√7을 다시 제곱하면 근호가 사라지고 그냥 7이 돼요 — 제곱과 제곱근은 서로 반대 동작이니까요. 그런데 (-7)²을 다시 제곱근으로 풀면 -7이 <b>아니라 7</b>이 나와요 — 결과는 늘 0 이상이거든요(절댓값).',
              en:'Squaring √7 again cancels the root and just gives 7 — squaring and square-rooting undo each other. But taking the square root of (-7)² gives <b>7, not -7</b> — the result is always nonnegative (it\'s the absolute value).',
              zh:'√7再平方，根号消失，就变回7——因为平方和开平方是互逆运算。但(-7)²再开平方得到的是<b>7而不是-7</b>——结果永远不小于0(其实就是绝对值)。'},
        mathSteps:['(\\sqrt7)^2', '=\\sqrt7\\times\\sqrt7', '=7'],
        result:{ko:'제곱근은 항상 0 이상 — 음수가 숨어 있어도 절댓값으로 나와요!',en:'A square root is always nonnegative — even a hidden negative comes out as its absolute value!',zh:'平方根永远不小于0——就算藏着负数，出来的也是绝对值！'},
        book:{ko:'(√a)²=a(a≥0), √(a²)=|a| — 두 식의 차이를 헷갈리지 않도록 주의해요.',
              en:'(√a)²=a (a≥0), and √(a²)=|a| — be careful not to confuse these two expressions.',
              zh:'(√a)²=a(a≥0)，√(a²)=|a|——注意不要把这两个式子搞混。'} }
    ],
    rule:{ ko:'① 루트=뿌리(나무 9의 뿌리는 3)  ② a의 제곱근은 ±√a 두 개, √a는 양수 하나  ③ √ 안이 음수면 (실수 중엔) 없음  ④ (√a)²=a, √(a²)=|a|',
      en:'① Root means root (the root of tree 9 is 3)  ② a has two square roots ±√a; √a is the positive one  ③ a negative under the root → no real answer  ④ (√a)²=a, √(a²)=|a|',
      zh:'① 根号就是根(树9的根是3)  ② a的平方根有±√a两个，√a是正的那个  ③ 根号里是负数则(实数中)不存在  ④ (√a)²=a，√(a²)=|a|' }
  },

  check:{
    fills:[
      { tex:'\\sqrt{81} = \\square', answer:9,
        hint:{ ko:'9×9=81', en:'9×9=81', zh:'9×9=81' } },
      { tex:'(\\sqrt{15})^2 = \\square', answer:15,
        hint:{ ko:'제곱근을 다시 제곱하면 근호가 사라져요', en:'Squaring a root cancels the root', zh:'平方根再平方，根号就消失' } }
    ],
    open:{ ko:'√((-9)²)의 값은 무엇일까요? -9가 아닌 이유도 설명해봐요.',
      en:'What is √((-9)²)? Explain why the answer isn\'t -9.',
      zh:'√((-9)²)是多少？说说为什么答案不是-9。' },
    openHint:{ ko:'(-9)²=81, √81=9. 결과는 항상 0 이상이라 -9가 될 수 없어요.',
      en:'(-9)²=81, √81=9. The result is always nonnegative, so it can\'t be -9.',
      zh:'(-9)²=81，√81=9。结果永远不小于0，所以不可能是-9。' }
  },

  lab:{
    generator:'md15_sqrtValue', level:'main', count:4,
    params:{mode:'squareOfSqrt'},
    intro:{
      ko:'제곱근을 다시 제곱하면? 근호가 사라지는 걸 확인해봐!',
      en:'What happens when you square a square root again? Watch the root disappear!',
      zh:'平方根再平方会怎样？看看根号是怎么消失的！'
    }
  },

  arena:{
    generator:'md15_sqrtValue', level:'main', count:8, timeLimit:300,
    params:{mode:'absValue'},
    rule:{ ko:'5분 안에 절댓값이 되는 제곱근 문제를 모두 풀어요!', en:'Solve all the absolute-value square-root problems in 5 minutes!', zh:'5分钟内解答所有变成绝对值的平方根题目！' }
  },

  stamp:{ label:{ ko:'제곱근 탐정', en:'Square Root Detective', zh:'平方根侦探' }, coins:45 },

  voice:{
    correct:[ {ko:'정답이야! ✨',en:'Correct!',zh:'答对了！'}, {ko:'제곱을 거꾸로 찾아냈어! 🌱',en:'You found it by working the square backward!',zh:'成功逆向找到了平方！'}, {ko:'대단해! 🌟',en:'Amazing!',zh:'太棒了！'} ],
    wrong:[ {ko:'제곱해서 그 수가 되는 정수를 찾아봐!',en:'Find the integer whose square gives that number!',zh:'找找看平方后等于那个数的整数！'}, {ko:'제곱근의 값은 항상 0 이상이야!',en:'A square root\'s value is always nonnegative!',zh:'平方根的值永远不小于0！'} ],
    finish:{ ko:'완벽해! 제곱근 탐정! 🌱✨', en:'Perfect! Square Root Detective!', zh:'完美！平方根侦探！' }
  }
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_UNITS;
})();
