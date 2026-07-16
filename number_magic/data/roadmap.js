/* ============================================================
   Numbers of Magic — 학습모드 로드맵 (Magic Learning Journey)
   전체 연산 여행: 작은 수 → 큰 수, 덧셈 → 뺄셈 → 곱셈 → 나눗셈 → 분수/소수
   잠금 없음 — 추천 순서. 기존 유닛을 재사용(데이터 중복 없음).
   bridge(T-*) + mini-game(G-*) 챕터 포함.
   ============================================================ */
(function(){
'use strict';

window.NM_ROADMAP = {
  id:'main-road',
  title:{ko:'마법 학습 여행',en:'Magic Learning Journey',zh:'魔法学习之旅'},
  subtitle:{ko:'작은 수부터 분수까지 — 한 걸음씩',en:'From small numbers to fractions — one step at a time',zh:'从小数字到分数——一步一步'},

  chapters:[

    /* ─────── N0 : 수의 나라 — 수 세기와 개수 (유아 프롤로그 섬) ─────── */
    {
      id:'N0', icon:'🐤', grade:'유아',
      edu:{ko:'유아 5~7세 · 수 감각',en:'Ages 5–7 · Number sense',zh:'幼儿5~7岁 · 数感'},
      theme:{ko:'수 세기와 개수 — 하나, 둘, 셋!',en:'Counting & Quantity — One, Two, Three!',zh:'数数与数量——一、二、三！'},
      units:['N-01','N-06','N-07'],
      tip:{ko:'병아리를 톡톡 짚으면서 세어 봐요. 마지막 수가 전체 개수!',en:'Tap the chicks one by one — the last number is how many!',zh:'点着小鸡一个一个数——最后的数就是总数！'}
    },

    /* ─────── N1 : 수의 나라 — 순서와 뛰어세기 ─────── */
    {
      id:'N1', icon:'🪜', grade:'유아',
      edu:{ko:'유아 5~7세 · 수 감각',en:'Ages 5–7 · Number sense',zh:'幼儿5~7岁 · 数感'},
      theme:{ko:'순서와 뛰어세기 — 앞으로, 거꾸로, 폴짝!',en:'Order & Skip-Counting — Forward, Backward, Hop!',zh:'顺序与跳数——往前、倒着、跳一跳！'},
      units:['N-02','N-09','N-11'],
      tip:{ko:'1부터 차례로 점을 이으면 숨은 그림이 짠! 나타나요.',en:'Connect the dots from 1 in order — a hidden picture appears!',zh:'从1开始按顺序连点——藏着的图案就出现啦！'}
    },

    /* ─────── N2 : 수의 나라 — 몇째와 크기 비교 ─────── */
    {
      id:'N2', icon:'🥇', grade:'유아',
      edu:{ko:'유아 5~7세 · 수 감각',en:'Ages 5–7 · Number sense',zh:'幼儿5~7岁 · 数感'},
      theme:{ko:'몇째와 크기 비교 — 콕 짚고, 딱 맞게 칠해요!',en:'Ordinals & Size — Tap it, paint it just right!',zh:'第几个与大小比较——点一点，涂对数量！'},
      units:['N-03'],
      tip:{ko:'개수(몇 개)와 순서(몇째)는 달라요 — 방향을 먼저 정하고 세어 봐요.',en:'Amount and order are different — pick a direction first, then count!',zh:'数量和顺序不一样——先定方向，再数一数！'}
    },

    /* ─────── R0 : 연산 첫걸음 ─────── */
    {
      id:'R0', icon:'🌱', grade:'초1',
      edu:{ko:'초1 연산 준비',en:'G1 warm-up',zh:'小1年级准备'},
      theme:{ko:'연산 첫걸음 — 더하고 빼기',en:'First Steps — Add & Subtract',zh:'计算第一步——加与减'},
      units:['A-01','A-02','A-03','A-04'],
      tip:{ko:'사탕 7개를 두 접시에 나눠보는 곳이에요!',en:'Start here — share 7 candies onto two plates!',zh:'从这里开始——把7颗糖分到两个盘子里！'}
    },

    /* ─────── R1 : 덧셈 마법 ─────── */
    {
      id:'R1', icon:'➕', grade:'초1',
      edu:{ko:'초1-2 덧셈구구',en:'G1-2 Addition Facts',zh:'小1-2加法口诀'},
      theme:{ko:'덧셈 마법 — 10 넘는 더하기',en:'Addition Magic — Carrying Over 10',zh:'加法魔法——进位加法'},
      units:['A-05','A-06','A-07','A-08','A-09'],
      tip:{ko:'8+5처럼 받아올림 있는 덧셈! 10칸 프레임 전략이에요.',en:'Addition with carrying like 8+5! Use the ten-frame strategy.',zh:'像8+5这样的进位加法！用十格框策略。'}
    },

    /* ─────── G0 : Make 10 게임 ─────── */
    {
      id:'G0', icon:'🎮', grade:'초1',
      edu:{ko:'초1 덧셈 게임',en:'G1 Addition Game',zh:'小1加法游戏'},
      theme:{ko:'Make 10 게임 — 합이 10인 짝 찾기',en:'Make 10 Game — Find Pairs that Sum to 10',zh:'凑10游戏——找加起来等于10的配对'},
      game:'make10',
      tip:{ko:'1+9, 2+8, 3+7... 짝을 찾으면 사라져요! 몇 쌍이나 맞출 수 있을까요?',en:'1+9, 2+8, 3+7... matched pairs vanish! How many can you clear?',zh:'1+9、2+8、3+7……配对就消失！你能配几对？'}
    },

    /* ─────── G1 : 3수 Make 10 게임 ─────── */
    {
      id:'G1', icon:'🎯', grade:'초1',
      edu:{ko:'초1-2 세 수 덧셈',en:'G1-2 Three-Addend Addition',zh:'小1-2三数加法'},
      theme:{ko:'3수 Make 10 — 세 수 더해서 10 만들기',en:'Make 10 with 3 — Three Numbers That Sum to 10',zh:'三数凑10游戏'},
      game:'make10_3',
      tip:{ko:'1+2+7=10, 2+3+5=10... 세 수를 골라요! 더 어렵지만 더 재미있어요 😄',en:'1+2+7=10, 2+3+5=10... pick three! Harder but more fun 😄',zh:'1+2+7=10，2+3+5=10……选三个数！更难但更有趣 😄'}
    },

    /* ─────── R2 : 뺄셈 마법 ─────── */
    {
      id:'R2', icon:'➖', grade:'초1',
      edu:{ko:'초1-2 뺄셈구구',en:'G1-2 Subtraction Facts',zh:'小1-2减法口诀'},
      theme:{ko:'뺄셈 마법 — 받아내림 전략',en:'Subtraction Magic — Borrowing Strategies',zh:'减法魔法——退位策略'},
      units:['A-10','A-11','A-12','A-13','A-14'],
      tip:{ko:'13-5처럼 받아내림 있는 뺄셈을 마스터해요!',en:'Master subtraction with borrowing like 13−5!',zh:'掌握像13-5这样的退位减法！'}
    },

    /* ─────── R3 : 뺄셈 심화 ─────── */
    {
      id:'R3', icon:'🎯', grade:'초2',
      edu:{ko:'초2-1 두자리 연산',en:'G2-1 Two-digit operations',zh:'小2-1两位数运算'},
      theme:{ko:'뺄셈 심화 — 두 자리 수 넘나들기',en:'Subtraction Deep Dive — Two-Digit Numbers',zh:'深入减法——两位数计算'},
      units:['A-15','A-16','A-17','A-18','A-19'],
      tip:{ko:'두 자리 수끼리 빼는 전략을 배워요.',en:'Learn strategies for subtracting two-digit numbers.',zh:'学习两位数相减的策略。'}
    },

    /* ─────── R4 : 큰 수 덧뺄셈 ─────── */
    {
      id:'R4', icon:'🔢', grade:'초2',
      edu:{ko:'초2 세자리 연산',en:'G2 Three-digit operations',zh:'小2三位数运算'},
      theme:{ko:'큰 수로 넓히기 — 자릿값과 세 자리',en:'Expanding — Place Value & Three Digits',zh:'扩展——数位与三位数'},
      units:['A-20','A-21','A-22','A-23','A-24','A-25'],
      tip:{ko:'백의 자리까지! 자릿값 개념이 중요해요.',en:'Up to the hundreds place! Place value is key.',zh:'到百位！数位概念很重要。'}
    },

    /* ─────── T4 : 큰 수·네 자리 덧뺄셈 (초2-2~초4-1 보강) ─────── */
    {
      id:'T4', icon:'🏙️', grade:'초2',
      edu:{ko:'초2-2 ~ 초4-1 큰 수',en:'G2-2 ~ G4-1 Large Numbers',zh:'小2-2~小4-1大数'},
      theme:{ko:'큰 수 탐험 — 네 자리부터 만까지',en:'Large Number Explorer — Four Digits to 10,000',zh:'大数探险——四位数到万'},
      units:['T-AD1','T-NS1'],
      tip:{ko:'3450+2380처럼 네 자리, 그리고 만의 자리까지! 자리끼리 더하는 규칙은 항상 같아요.',en:'From 3450+2380 to ten-thousands! The place-by-place rule always stays the same.',zh:'从3450+2380到万位！按数位计算的规则永远不变。'}
    },

    /* ─────── R5 : 수열·패턴 ─────── */
    {
      id:'R5', icon:'📐', grade:'초2',
      edu:{ko:'초2 규칙과 수열',en:'G2 Patterns & Sequences',zh:'小2规律与数列'},
      theme:{ko:'수열과 패턴 찾기',en:'Sequences & Pattern Finding',zh:'数列与规律发现'},
      units:['A-26','A-27','A-28','A-29'],
      tip:{ko:'5, 10, 15, 20... 규칙을 발견해요!',en:'Discover patterns like 5, 10, 15, 20...!',zh:'发现5, 10, 15, 20...这样的规律！'}
    },

    /* ─────── R6 : 자릿값 계산 ─────── */
    {
      id:'R6', icon:'🧮', grade:'초2',
      edu:{ko:'초2-2 자릿값 전략',en:'G2-2 Place-value strategies',zh:'小2-2数位计算策略'},
      theme:{ko:'자릿값 계산 전략',en:'Place-Value Calculation Strategies',zh:'数位计算策略'},
      units:['A-30','A-31','A-32','A-33','A-34'],
      tip:{ko:'10씩, 100씩 건너뛰는 계산 전략이에요!',en:'Strategies for jumping by 10s and 100s!',zh:'以10、100为单位跳跃的计算策略！'}
    },

    /* ─────── R7 : 곱셈의 시작 ─────── */
    {
      id:'R7', icon:'✖️', grade:'초2',
      edu:{ko:'초2-2 곱셈 도입·2·5단',en:'G2-2 Intro to multiplication, 2s & 5s',zh:'小2-2乘法入门，2和5的口诀'},
      theme:{ko:'곱셈의 시작 — 배와 묶음',en:'Start of Multiplication — Doubling & Groups',zh:'乘法开始——翻倍与分组'},
      units:['B-01','B-02','B-03','B-04','B-05','B-06'],
      tip:{ko:'"사과 2개씩 5봉지" = 2×5. 묶음이 곱셈이에요!',en:'"2 apples in each of 5 bags" = 2×5. Groups are multiplication!',zh:'"每袋2个苹果，5袋" = 2×5。分组就是乘法！'}
    },

    /* ─────── R8 : 구구단 완성 ─────── */
    {
      id:'R8', icon:'🎲', grade:'초2',
      edu:{ko:'초2-2 구구단 완성',en:'G2-2 Times tables complete',zh:'小2-2乘法口诀全覆盖'},
      theme:{ko:'구구단 완성 — 3~9단',en:'Times Tables Complete — 3s through 9s',zh:'口诀完成——3到9的口诀'},
      units:['B-07','B-08','B-09','B-10','B-11','B-12','B-13','B-14','B-15','B-16','B-17'],
      tip:{ko:'3·4·6·7·8·9단까지! 구구단 왕이 되어요.',en:'Through 3, 4, 6, 7, 8, 9 tables! Become the times-table king.',zh:'3、4、6、7、8、9的口诀！成为口诀王。'}
    },

    /* ─────── T8 : 초3 나눗셈·분수 입문 ─────── */
    {
      id:'T8', icon:'🍕', grade:'초3',
      edu:{ko:'초3-1 나눗셈·분수 첫걸음',en:'G3-1 Division & Fraction Intro',zh:'小3-1除法与分数入门'},
      theme:{ko:'나눗셈과 분수 첫걸음 — 묶음 나누기·똑같이 나누기',en:'Division & Fraction Intro — Groups & Equal Shares',zh:'除法与分数入门——分组与平均分'},
      units:['T-DV1','T-FR1'],
      tip:{ko:'12÷3=4 (묶음 나누기), 그리고 케이크를 4등분하면 1/4! 나눗셈과 분수는 사촌이에요.',en:'12÷3=4 (grouping), and cut cake into 4 = 1/4! Division and fractions are cousins.',zh:'12÷3=4（分组），蛋糕切4份=1/4！除法和分数是近亲。'}
    },

    /* ─────── R9 : 곱셈 넓히기 ─────── */
    {
      id:'R9', icon:'💫', grade:'초3',
      edu:{ko:'초3-1 두자리×한자리',en:'G3-1 2-digit × 1-digit',zh:'小3-1两位乘一位'},
      theme:{ko:'곱셈 넓히기 — 몇십·몇백 곱셈',en:'Expanding Multiplication — Tens & Hundreds',zh:'扩展乘法——整十整百乘法'},
      units:['B-18','B-19','B-20','B-21','B-22','B-23'],
      tip:{ko:'30×4=120! 자릿수를 올려가며 곱해요.',en:'30×4=120! Multiply by moving up place values.',zh:'30×4=120！通过提高数位来乘法。'}
    },

    /* ─────── T9 : 초3-2 곱셈·나눗셈 보강 ─────── */
    {
      id:'T9', icon:'⚙️', grade:'초3',
      edu:{ko:'초3-2 세자리 곱셈·나눗셈 심화',en:'G3-2 3-digit Mult & Division',zh:'小3-2三位数乘除法'},
      theme:{ko:'초3 보강 — 세 자리 곱셈·몫과 나머지',en:'G3 Boost — 3-Digit Mult & Remainders',zh:'小3强化——三位数乘法与余数'},
      units:['T-ML1','T-DV2'],
      tip:{ko:'246×3처럼 세 자리 곱셈과 17÷5=3···2처럼 나머지가 있는 나눗셈을 배워요!',en:'Multiply like 246×3 and divide with remainders like 17÷5=3 r2!',zh:'像246×3这样的三位数乘法，和17÷5=3余2这样带余数的除法！'}
    },

    /* ─────── R10 : 창의 전략 입문 ─────── */
    {
      id:'R10', icon:'🔺', grade:'창의',
      edu:{ko:'창의수연 기초 전략',en:'Creative math basic strategies',zh:'创意数学基础策略'},
      theme:{ko:'수의 마법 — 쌍·거듭제곱·가우스',en:'Number Magic — Pairs, Powers & Gauss',zh:'数字魔法——对、幂与高斯'},
      units:['C-01','C-02','C-03','C-04','C-05'],
      tip:{ko:'1+2+3...+20을 20초 만에? 가우스의 비밀을 배워요!',en:'Sum 1+2+...+20 in 20 seconds? Learn the Gauss secret!',zh:'20秒内求1+2+...+20？学习高斯的秘密！'}
    },

    /* ─────── R11 : 곱셈 전략 I ─────── */
    {
      id:'R11', icon:'🧠', grade:'창의',
      edu:{ko:'창의수연 곱셈 전략 I',en:'Creative math multiplication I',zh:'创意数学乘法策略I'},
      theme:{ko:'빠른 곱셈 I — ×9·분배·올림빼기',en:'Fast Multiplication I — ×9, Distribute, Over-subtract',zh:'快速乘法I——×9·分配·多乘减'},
      units:['C-06','C-07','C-08'],
      tip:{ko:'9를 곱할 땐 10을 곱하고 한 번 빼면 돼요!',en:'To multiply by 9: multiply by 10 then subtract once!',zh:'乘9时：先乘10，再减一次！'}
    },

    /* ─────── R12 : 창의 곱셈 핵심 ─────── */
    {
      id:'R12', icon:'🌸', grade:'창의',
      edu:{ko:'창의수연 창의 곱셈법',en:'Creative multiplication methods',zh:'创意乘法方法'},
      theme:{ko:'창의 곱셈법 — 6가지 검법',en:'6 Creative Multiplication Methods',zh:'六种创意乘法'},
      units:['C-09','C-10','C-11','C-12','C-13','C-14'],
      tip:{ko:'세로식, 넓이 곱셈, 격자... 나만의 방법을 찾아봐요!',en:'Column, area model, lattice... find your own method!',zh:'竖式、面积乘法、格子法...找到自己的方法！'}
    },

    /* ─────── R13 : 자리이동과 ×5·×25 ─────── */
    {
      id:'R13', icon:'✋', grade:'창의',
      edu:{ko:'창의수연 특수 곱셈',en:'Creative math special multiplication',zh:'创意数学特殊乘法'},
      theme:{ko:'지름길 곱셈 — 자리이동·×5·×25',en:'Shortcut Multiplication — Shift, ×5, ×25',zh:'捷径乘法——位移·×5·×25'},
      units:['C-15','C-16','C-17'],
      tip:{ko:'40×25=1000! 규칙을 찾으면 계산이 쉬워져요.',en:'40×25=1000! Find the pattern and calculation becomes easy!',zh:'40×25=1000！找到规律，计算就变简单了！'}
    },

    /* ─────── R14 : 나눗셈 3형제 ─────── */
    {
      id:'R14', icon:'🪓', grade:'창의',
      edu:{ko:'초3-2 나눗셈',en:'G3-2 Division',zh:'小3-2除法'},
      theme:{ko:'나눗셈 3형제 — 분해·약분·부풀리기',en:'3 Division Methods — Decompose, Simplify, Expand',zh:'三种除法——分解·约分·扩张'},
      units:['C-18','C-19','C-20'],
      tip:{ko:'312÷3: 300÷3=100, 12÷3=4, 합치면 104!',en:'312÷3: 300÷3=100, 12÷3=4, combine → 104!',zh:'312÷3：300÷3=100，12÷3=4，合并→104！'}
    },

    /* ─────── T14 : 초4~초5 분수·약수 확장 ─────── */
    {
      id:'T14', icon:'🔍', grade:'초4',
      edu:{ko:'초4-2 ~ 초5-1 분수·약수',en:'G4-2 ~ G5-1 Fractions & Factors',zh:'小4-2~小5-1分数与因数'},
      theme:{ko:'분수 확장 — 가분수·약분·약수 찾기',en:'Fraction Expansion — Improper, Simplify, Factors',zh:'分数扩展——假分数·约分·求因数'},
      units:['T-FR2','T-FR3','T-DV3'],
      tip:{ko:'7/3처럼 분자가 더 큰 분수(가분수), 6/9→2/3 약분, 그리고 약수 구하기까지!',en:'Fractions > 1 like 7/3 (improper), simplifying 6/9→2/3, and finding factors!',zh:'像7/3这样分子更大的假分数、约分6/9→2/3、以及求因数！'}
    },

    /* ─────── R15 : 분수의 세계 ─────── */
    {
      id:'R15', icon:'🎨', grade:'창의',
      edu:{ko:'초4-2 분수',en:'G4-2 Fractions',zh:'小4-2分数'},
      theme:{ko:'분수의 세계 — 같은 분모·다른 분모',en:'Fraction World — Same & Different Denominators',zh:'分数世界——同分母与异分母'},
      units:['C-21','C-22'],
      tip:{ko:'피자를 같은 크기로 나누면 분수가 보여요!',en:'When you cut pizza into equal pieces, fractions appear!',zh:'把比萨切成相等的块，分数就出现了！'}
    },

    /* ─────── T15 : 초4-2~초5-1 소수·혼합계산 ─────── */
    {
      id:'T15', icon:'🔢', grade:'초4',
      edu:{ko:'초4-2 소수·초5-1 혼합계산',en:'G4-2 Decimals · G5-1 Order of Ops',zh:'小4-2小数·小5-1混合运算'},
      theme:{ko:'소수와 혼합계산 — 소수 알기·순서 지키기',en:'Decimals & Mixed Operations — Intro & Order',zh:'小数与混合运算——认识小数·运算顺序'},
      units:['T-DC1','T-MX1'],
      tip:{ko:'0.1이 5개면 0.5! 그리고 (3+4)×2는 괄호 먼저 — 순서를 지켜야 답이 맞아요.',en:'Five 0.1s = 0.5! And (3+4)×2 needs brackets first — order matters!',zh:'五个0.1等于0.5！(3+4)×2要先算括号——顺序很重要！'}
    },

    /* ─────── R16 : 마스터의 길 ─────── */
    {
      id:'R16', icon:'🏆', grade:'창의',
      edu:{ko:'창의수연 고급',en:'Creative math advanced',zh:'创意数学高级'},
      theme:{ko:'마스터의 길 — VEDA·차이곱·소수',en:'Master Path — VEDA, Difference Products, Decimals',zh:'大师之路——VEDA·差积·小数'},
      units:['C-23','C-24','C-25'],
      tip:{ko:'23×27=(25-2)(25+2)=625-4=621! 수의 아름다움이에요.',en:'23×27=(25-2)(25+2)=625-4=621! The beauty of numbers.',zh:'23×27=(25-2)(25+2)=625-4=621！数字之美。'}
    },

    /* ─────── R17 : 약수와 배수 ─────── */
    {
      id:'R17', icon:'🔢', grade:'초5',
      edu:{ko:'초5-1 약수·배수',en:'G5-1 Factors & Multiples',zh:'小5-1因数与倍数'},
      theme:{ko:'약수와 배수 — 공약수·공배수·배수 판정법',en:'Factors & Multiples — GCD, LCM & Divisibility Rules',zh:'因数与倍数——公因数·公倍数·整除规律'},
      units:['T-DV4','T-DV5'],
      tip:{ko:'GCD로 피자를 공평하게 나누고, LCM으로 두 버스가 다시 만나는 시간을 계산해요!',en:'Use GCD to share pizza fairly, LCM to find when two buses next meet!',zh:'用最大公因数公平分披萨，用最小公倍数计算两路公交何时再次相遇！'}
    }

  ]
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_ROADMAP;
})();
