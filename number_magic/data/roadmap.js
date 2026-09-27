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
  subtitle:{ko:'유아부터 미적분Ⅰ까지 — 한 걸음씩',en:'From age 5 to Calculus I — one step at a time',zh:'从幼儿到微积分Ⅰ——一步一步'},

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
      units:['N-03','N-05','N-12'],
      tip:{ko:'개수(몇 개)와 순서(몇째)는 달라요 — 방향을 먼저 정하고 세어 봐요.',en:'Amount and order are different — pick a direction first, then count!',zh:'数量和顺序不一样——先定方向，再数一数！'}
    },

    /* ─────── N3 : 수의 나라 — 수 퍼즐과 논리 ─────── */
    {
      id:'N3', icon:'🧩', grade:'유아',
      edu:{ko:'유아 5~7세 · 수 감각',en:'Ages 5–7 · Number sense',zh:'幼儿5~7岁 · 数感'},
      theme:{ko:'수 퍼즐과 논리 — 비밀 규칙을 찾아라!',en:'Number Puzzles & Logic — Find the secret rule!',zh:'数字谜题与逻辑——找出秘密规则！'},
      units:['N-08','N-13','N-15'],
      tip:{ko:'예시 두 개를 비교하면 숨은 규칙이 보여요!',en:'Compare two examples and the hidden rule appears!',zh:'比较两个例子，就能看出隐藏的规则！'}
    },

    /* ─────── N4 : 수의 나라 — 수의 여러 표현 ─────── */
    {
      id:'N4', icon:'🎨', grade:'유아',
      edu:{ko:'유아 5~7세 · 수 감각',en:'Ages 5–7 · Number sense',zh:'幼儿5~7岁 · 数感'},
      theme:{ko:'수의 여러 표현 — 탤리 막대로 수를 그려요!',en:'Many Ways to Show Numbers — Draw them with tally marks!',zh:'数字的多种表示——用计数符号画数字！'},
      units:['N-04','N-10','N-14'],
      tip:{ko:'막대 4개까지는 그대로, 5번째는 사선으로 묶어요!',en:'Up to 4 strokes stay plain — the 5th is bundled with a diagonal!',zh:'4笔以内直接画，第5笔斜着捆一下！'}
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
      /* A-35 고대의 수(로마 수, 2026-09-23) — 학습지 과정 10 의 "쉼표 노드"인데 이 지도에 없었다.
         로마 수는 자릿값이 없던 옛 기수법이라, 자릿값 전략을 다 배운 끝에 두면 대비가 된다.
         과정 10 과 이 챕터는 같은 단계(계산의 새싹)다. */
      units:['A-30','A-31','A-32','A-33','A-34','A-35'],
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
      units:['B-24','T-DV1','T-FR1'],
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
      id:'R10', icon:'🚪', grade:'창의',
      edu:{ko:'곱셈의 문',en:'Creative strategy',zh:'创意策略'},
      theme:{ko:'1단계 · 곱셈의 문 — 표기와 자리별 곱',en:'Stage 1 · Gateway to Multiplication',zh:'第1阶 · 乘法之门'},
      units:['C-01','C-26','C-09'] },

    /* ─────── R11 : 곱셈 전략 I ─────── */
    {
      id:'R11', icon:'✂️', grade:'창의',
      edu:{ko:'쪼개기',en:'Creative strategy',zh:'创意策略'},
      theme:{ko:'2단계 · 쪼개기 — 분배법칙 +와 −',en:'Stage 2 · Splitting',zh:'第2阶 · 拆分'},
      units:['C-07','C-08','C-06','C-27'] },

    /* ─────── R12 : 창의 곱셈 핵심 ─────── */
    {
      id:'R12', icon:'🤝', grade:'창의',
      edu:{ko:'짝 만들기',en:'Creative strategy',zh:'创意策略'},
      theme:{ko:'3단계 · 짝 만들기 — 10·100·1000을 만들어라',en:'Stage 3 · Making Pairs',zh:'第3阶 · 配对'},
      units:['C-02','C-04','C-03','C-34'] },

    /* ─────── R13 : 자리이동과 ×5·×25 ─────── */
    {
      id:'R13', icon:'✋', grade:'창의',
      edu:{ko:'반과 배',en:'Creative strategy',zh:'创意策略'},
      theme:{ko:'4단계 · 반과 배 — ×5·×25와 그 나눗셈',en:'Stage 4 · Halves and Doubles',zh:'第4阶 · 折半与翻倍'},
      units:['C-16','C-17','C-28','C-29'] },

    /* ─────── R14 : 나눗셈 3형제 ─────── */
    {
      id:'R14', icon:'🪓', grade:'창의',
      edu:{ko:'나눗셈 3법',en:'Creative strategy',zh:'创意策略'},
      theme:{ko:'5단계 · 나눗셈 세 가지 길',en:'Stage 5 · Three Roads of Division',zh:'第5阶 · 除法三法'},
      units:['C-18','C-19','C-20'] },

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
      id:'R15', icon:'🌸', grade:'창의',
      edu:{ko:'곱셈 알고리즘',en:'Creative strategy',zh:'创意策略'},
      theme:{ko:'6단계 · 곱셈 알고리즘 여행',en:'Stage 6 · A Tour of Multiplication',zh:'第6阶 · 乘法算法之旅'},
      units:['C-15','C-13','C-10','C-11','C-14','C-30'] },

    /* ─────── T15 : 초4-2~초5-1 소수·혼합계산 ─────── */
    {
      id:'T15', icon:'🔢', grade:'초4',
      edu:{ko:'초4-2 소수·초5-1 혼합계산',en:'G4-2 Decimals · G5-1 Order of Ops',zh:'小4-2小数·小5-1混合运算'},
      theme:{ko:'소수와 혼합계산 — 소수 알기·더하고 빼기·순서 지키기',en:'Decimals & Mixed Operations — Intro, Add & Subtract, Order',zh:'小数与混合运算——认识小数·加减·运算顺序'},
      /* A-36~38(2026-09-23) — 소수 덧뺄셈. 과정-로드맵.md 가 "초급이 아니라 Level 3 소수 지점이
         맞다"며 학습지 과정 17로 옮겼는데, 이 지도는 따라 옮기지 않아 어디에도 없었다.
         소수 알기(T-DC1) 바로 다음, 혼합계산 앞. 과정 17 과 이 챕터는 같은 단계(관계의 발견)다. */
      units:['T-DC1','A-36','A-37','A-38','T-MX1'],
      tip:{ko:'0.1이 5개면 0.5! 그리고 (3+4)×2는 괄호 먼저 — 순서를 지켜야 답이 맞아요.',en:'Five 0.1s = 0.5! And (3+4)×2 needs brackets first — order matters!',zh:'五个0.1等于0.5！(3+4)×2要先算括号——顺序很重要！'}
    },

    /* ─────── R16 : 마스터의 길 ─────── */
    {
      id:'R16', icon:'🔗', grade:'창의',
      edu:{ko:'수의 관계',en:'Creative strategy',zh:'创意策略'},
      theme:{ko:'7단계 · 수의 관계 — VEDA·차이곱·가우스',en:'Stage 7 · Relationships Between Numbers',zh:'第7阶 · 数的关系'},
      units:['C-23','C-24','C-12','C-05'] },

    /* ─────── CR8 : 창의 8단계 · 분수와 소수 ─────── */
    {
      id:'CR8', icon:'🎨', grade:'창의',
      edu:{ko:'분수와 소수',en:'Creative strategy',zh:'创意策略'},
      theme:{ko:'8단계 · 분수와 소수',en:'Stage 8 · Fractions and Decimals',zh:'第8阶 · 分数与小数'},
      units:['C-21','C-22','C-31','C-32','C-25','C-33','C-35'] },

    /* ─────── R17 : 약수와 배수 ─────── */
    {
      id:'R17', icon:'🔢', grade:'초5',
      edu:{ko:'초5-1 약수·배수',en:'G5-1 Factors & Multiples',zh:'小5-1因数与倍数'},
      theme:{ko:'약수와 배수 — 공약수·공배수·배수 판정법',en:'Factors & Multiples — GCD, LCM & Divisibility Rules',zh:'因数与倍数——公因数·公倍数·整除规律'},
      units:['T-DV4','T-DV5'],
      tip:{ko:'최대공약수로 피자를 공평하게 나누고, 최소공배수로 두 버스가 다시 만나는 시간을 계산해요!',en:'Use GCD to share pizza fairly, LCM to find when two buses next meet!',zh:'用最大公因数公平分披萨，用最小公倍数计算两路公交何时再次相遇！'}
    },

    /* ─────── CR9~CR11 + CRB : 경시의 탑 (과정 26~28 + Level 3 보강, 2026-08-25 Phase 2) ─────────
       고급-목차.md 신규 13종. 스토리 여행의 맨 끝에 이어 붙여 findNextRoadUnit()의
       추천 순서를 흐트러뜨리지 않는다 — 기존 관례(그대로 grade:'창의' 탭 재사용)를 따름. */
    {
      id:'CR9', icon:'🏔️', grade:'창의',
      edu:{ko:'경시의 탑 26',en:'Tower of Challenges · 26',zh:'竞赛之塔·26'},
      theme:{ko:'26 곱셈의 정점 — 한쪽으로 모으기·100 보수 곱',en:'26 · Peak of Multiplication',zh:'26·乘法之巅'},
      units:['H-01','H-02'],
      tip:{ko:'곱하는 수를 나눈 만큼 곱해지는 수를 키워봐요 — 어떤 곱셈도 쉬워져요!',en:'Shrink the multiplier, grow the multiplicand by the same amount — any multiplication gets easy!',zh:'把乘数缩小多少，就把被乘数放大多少——再难的乘法也变简单！'}
    },
    {
      id:'CR10', icon:'🔐', grade:'창의',
      edu:{ko:'경시의 탑 27',en:'Tower of Challenges · 27',zh:'竞赛之塔·27'},
      theme:{ko:'27 수의 비밀 — 진법·1001 법칙·순환소수·100 근처 나눗셈',en:'27 · Secrets of Numbers',zh:'27·数的秘密'},
      units:['H-03','H-04','H-05','H-06'],
      tip:{ko:'1001을 곱하면 세 자리 수가 통째로 다시 나타나요 — 비밀은 7×11×13!',en:'Multiply by 1001 and a 3-digit number reappears whole — the secret is 7×11×13!',zh:'乘以1001，三位数会原样再出现一次——秘密是7×11×13！'}
    },
    {
      id:'CR11', icon:'⛰️', grade:'창의',
      edu:{ko:'경시의 탑 28',en:'Tower of Challenges · 28',zh:'竞赛之塔·28'},
      theme:{ko:'28 제곱의 산 — 근처 수의 제곱·분리 제곱법·제곱수의 합',en:'28 · Mountain of Squares',zh:'28·平方之山'},
      units:['H-07','H-08','H-09','H-10'],
      tip:{ko:'다섯 자리 수도 앞부분·뒷부분으로 쪼개면 이미 배운 마법으로 다 풀려요!',en:'Even a 5-digit number splits into a front and back part you can solve with tricks you already know!',zh:'五位数也能拆成前后两部分，用学过的魔法就能解开！'}
    },
    {
      id:'CRB', icon:'🎁', grade:'창의',
      edu:{ko:'경시의 탑 보강',en:'Tower of Challenges · Booster',zh:'竞赛之塔·补强'},
      theme:{ko:'보강 · 몰아주기 곱·어림하기·큰 수 정복',en:'Booster · Anchoring, Estimating & Big Numbers',zh:'补强·集中相乘·估算·大数'},
      units:['H-11','H-12','H-13'],
      tip:{ko:'0의 개수만 세어도 억인지 조인지 바로 알 수 있어요!',en:'Just count the zeros to know if it\'s a hundred-million or a trillion!',zh:'只要数一数0的个数，就能立刻知道是亿还是万亿！'}
    },

    /* ─────── W8 : 음수의 동굴 — 중1 정수와 유리수 (2026-08-25) ─────────
       MASTER-ROADMAP.md §3 "W8 음수의 동굴(중1)" 스토리 스테이지. 경시의
       탑(CR9~CRB) 다음, 초등 트랙 끝에 이어 붙는다 — 필수 연산 관문
       §4 "CHALLENGE 1부 ← W8 정수·유리수 사칙"과도 정합. */
    {
      id:'W8-1', icon:'🌋', grade:'중1',
      edu:{ko:'중1 정수의 세계',en:'G7 World of Integers',zh:'初一整数的世界'},
      theme:{ko:'W8-1 · 정수의 세계 — 개념·수직선 위의 자리·덧셈·뺄셈',en:'W8-1 · World of Integers — Concept, Places on the Line, ±',zh:'W8-1·整数的世界——概念·数轴上的位置·加减法'},
      units:['M-01','M-82','M-02','M-03'],
      tip:{ko:'해발과 해저, 득점과 실점 — 0을 기준으로 반대 방향에 이름을 붙이는 거예요! 그 이름들이 수직선 위에 제 자리를 얻어요.',en:'Above and below sea level, points scored and lost — naming the two directions from 0, and giving each name a place on the line!',zh:'海拔与海底，得分与失分——给0两侧的方向起名字，再让每个名字在数轴上有自己的位置！'}
    },
    {
      id:'W8-2', icon:'🎲', grade:'중1',
      edu:{ko:'중1 부호의 규칙',en:'G7 Rules of Sign',zh:'初一符号的规则'},
      theme:{ko:'W8-2 · 부호의 규칙 — 곱셈·나눗셈·거듭제곱·혼합',en:'W8-2 · Rules of Sign — ×÷, Powers & Mixed Ops',zh:'W8-2·符号的规则——乘除·乘方·混合运算'},
      units:['M-04','M-05','M-06'],
      tip:{ko:'음수 개수가 짝이면 +, 홀이면 − — 부호부터 정하고 시작해요!',en:'Even negatives = +, odd = − : decide the sign first!',zh:'负数个数为偶得正，为奇得负——先定符号！'}
    },
    {
      id:'W8-3', icon:'🔁', grade:'중1',
      edu:{ko:'중1 유리수 정복',en:'G7 Conquering Rationals',zh:'初一征服有理数'},
      theme:{ko:'W8-3 · 유리수 정복 — 곱나눗·유한소수·순환소수',en:'W8-3 · Conquering Rationals — × ÷, Terminating & Repeating',zh:'W8-3·征服有理数——乘除·有限小数·循环小数'},
      units:['M-07','M-08','M-09'],
      tip:{ko:'분모 속 2와 5만 있으면 끝나는 소수, 다른 수가 숨어 있으면 영원히 반복돼요!',en:'Only 2s and 5s in the denominator? It ends. Anything else hiding? It repeats forever!',zh:'分母只有2和5就会结束，藏着别的数就会永远循环！'}
    },

    /* ─────── W8-4·5 : 심화 유형 2차(2026-08-27) — 중1 문자와 식 ────
       MASTER-ROADMAP.md는 W8을 "정수·유리수, 문자와 식, 일차방정식,
       정비례반비례"로 정의했지만 원본이 없어 문자와 식 부분은 미착수
       상태였다(engine/threads/mid.js 상단 주석). 작업지시로 자체
       설계해 채운다(MD47~51). */
    {
      id:'W8-4', icon:'🔤', grade:'중1',
      edu:{ko:'중1 문자와 식',en:'G7 Letters & Expressions',zh:'初一文字与式'},
      theme:{ko:'W8-4 · 문자와 식 — 문자식 표현·식의 값·일차식 계산',en:'W8-4 · Letters & Expressions — Notation, Values, Linear Expression Operations',zh:'W8-4·文字与式——代数式表示·代数式的值·一次式运算'},
      units:['M-47','M-48','M-49'],
      tip:{ko:'곱셈 기호(×)는 생략, 숫자는 문자 앞에, 나눗셈은 분수로 — 세 가지 표기 규칙만 기억하면 돼요!',en:'Drop the ×, put numbers before letters, write division as a fraction — just three notation rules to remember!',zh:'省略乘号(×)、数字写在字母前、除法写成分数——记住这三条记法规则就行！'}
    },
    {
      id:'W8-5', icon:'⚖️', grade:'중1',
      edu:{ko:'중1 방정식과 비례',en:'G7 Equations & Proportion',zh:'初一方程与比例'},
      theme:{ko:'W8-5 · 방정식과 비례 — 일차방정식 풀이·정비례와 반비례',en:'W8-5 · Equations & Proportion — Solving Linear Equations, Direct & Inverse Proportion',zh:'W8-5·方程与比例——一元一次方程的解法·正比例与反比例'},
      units:['M-50','M-51'],
      tip:{ko:'등식의 성질은 저울과 같아요 — 양쪽에 같은 걸 더하거나 빼거나 곱하거나 나눠도 저울은 그대로 균형을 유지해요!',en:'The properties of equality are like a balance scale — add, subtract, multiply, or divide both sides by the same thing and it stays balanced!',zh:'等式的性质就像天平——两边同时加、减、乘或除以相同的数，天平依然平衡！'}
    },
    {
      /* W8-6·W8-7 신설(2026-09-21, 원장 "일차방정식의 활용도 거리·속력·시간, 원가·정가 등
         놓치지 마", "정비례 반비례는") — 푸는 법(M-50) 다음에 쓰는 법이, 값(M-51) 다음에
         그래프가 와야 한다. 둘 다 통째로 비어 있던 자리다. */
      id:'W8-6', icon:'🗺️', grade:'중1',
      edu:{ko:'중1 일차방정식의 활용',en:'G7 Linear Equations in Use',zh:'初一一元一次方程的应用'},
      theme:{ko:'W8-6 · 일차방정식의 활용 — 수·나이·거리속력시간·원가정가',en:'W8-6 · Linear Equations in Use — Numbers, Ages, Speed, Price',zh:'W8-6·一元一次方程的应用——数·年龄·路程速度时间·成本定价'},
      units:['M-70'],
      tip:{ko:'구하려는 것을 x로 놓고 문장을 그대로 식으로 옮겨요 — 거리=속력×시간, 정가=원가×(1+이익률)!',en:'Let x be what you want and turn the sentences into an equation - distance = speed x time, price = cost x (1 + markup)!',zh:'把要求的量设为x，把句子直接写成算式——路程=速度×时间，定价=成本×(1+利润率)！'}
    },
    {
      id:'W8-7', icon:'📍', grade:'중1',
      edu:{ko:'중1 좌표평면과 비례 그래프',en:'G7 Coordinates & Proportion Graphs',zh:'初一坐标平面与比例图象'},
      theme:{ko:'W8-7 · 좌표평면 — 사분면·대칭점·정비례와 반비례의 그래프',en:'W8-7 · The Coordinate Plane — Quadrants, Reflections, Graphs of Proportion',zh:'W8-7·坐标平面——象限·对称点·正比例与反比例的图象'},
      units:['M-68','M-69'],
      tip:{ko:'가로 먼저 세로 나중 — 정비례는 원점을 지나는 직선, 반비례는 두 가지로 갈라진 곡선이에요!',en:'Across first, up second - direct proportion draws a line through the origin, inverse a curve in two branches!',zh:'先横后纵——正比例是过原点的直线，反比例是分成两支的曲线！'}
    },
    {
      /* 중1-2 비기하 통계. 원본에서 확인된 p.224~230 대표값까지만 공개한다. */
      id:'W8-8', icon:'📊', grade:'중1',
      edu:{ko:'중1 대표값',en:'G7 Measures of Center',zh:'初一代表值'},
      theme:{ko:'W8-8 · 대표값 — 평균·홀짝 중앙값·단일·복수·범주 최빈값',en:'W8-8 · Measures of Center — Mean, Median & Mode',zh:'W8-8·代表值——平均数·中位数·众数'},
      units:['M-84'],
      tip:{ko:'중앙값은 반드시 정렬부터, 최빈값은 가장 많이 나온 값을 모두 — 숫자가 아닌 범주에도 쓸 수 있어요!',en:'Sort before finding the median, and include every value tied for the mode — categories can have modes too!',zh:'求中位数先排序，众数要把并列最多的值全部写出——类别资料也能求众数！'}
    },

    /* ─────── W9 : 식의 탑 — 중2 식의 계산 (2026-08-25) ─────────
       MASTER-ROADMAP.md §3 "W9 식의 탑(중2)" 스토리 스테이지. W8(음수의
       동굴) 다음, 문자로 된 식을 다루는 첫 관문. */
    {
      id:'W9-1', icon:'📐', grade:'중2',
      edu:{ko:'중2 지수와 단항식',en:'G8 Exponents & Monomials',zh:'初二指数与单项式'},
      theme:{ko:'W9-1 · 지수와 단항식 — 지수법칙·곱나눗·동류항',en:'W9-1 · Exponents & Monomials — Laws, × ÷, Like Terms',zh:'W9-1·指数与单项式——法则·乘除·同类项'},
      units:['M-10','M-11','M-12'],
      tip:{ko:'큰 수를 짧게 쓰려는 게으름이 지수법칙을 만들었어요 — 곱한 횟수만 세면 끝!',en:'Laziness about writing big numbers invented the exponent laws — just count how many times you multiplied!',zh:'懒得写长数字，于是发明了指数法则——只需数一数乘了几次！'}
    },
    {
      id:'W9-2', icon:'🎁', grade:'중2',
      edu:{ko:'중2 다항식과 등식',en:'G8 Polynomials & Equations',zh:'初二多项式与等式'},
      theme:{ko:'W9-2 · 다항식과 등식 — 전개·이항 감각',en:'W9-2 · Polynomials & Equations — Expanding & Transposing',zh:'W9-2·多项式与等式——展开·移项感'},
      units:['M-13','M-14'],
      tip:{ko:'괄호 밖의 하나가 안의 모든 항을 하나씩 찾아가 곱해요 — 절대 빠뜨리지 마요!',en:'The one outside the brackets visits every term inside, one by one — never skip one!',zh:'括号外的那个乘遍括号里每一项——千万别漏掉！'}
    },
    {
      /* W9-3 신설(2026-09-20, 중등 교과 연산 3차) — 중2 교과 연산의 기둥 셋이
         로드맵에 아예 없었다(연립방정식·일차부등식·일차함수). 원장 지시
         "교과연산과 창의연산이 같이 되어야 한다"의 중2 쪽 답이다. */
      id:'W9-3', icon:'🔗', grade:'중2',
      edu:{ko:'중2 부등식과 연립방정식',en:'G8 Inequalities & Systems',zh:'初二不等式与方程组'},
      theme:{ko:'W9-3 · 부등식과 연립방정식 — 범위·미지수 둘·활용',en:'W9-3 · Inequalities & Systems — Ranges, Two Unknowns, Applications',zh:'W9-3·不等式与方程组——范围·两个未知数·应用'},
      units:['M-64','M-71','M-63','M-72'],
      tip:{ko:'미지수가 둘이면 식도 둘 — 한 문자를 없애면 이미 아는 일차방정식으로 돌아와요!',en:'Two unknowns need two equations — remove one letter and you are back to a linear equation you already know!',zh:'两个未知数就要两个方程——消去一个字母，就回到你已经会的一元一次方程！'}
    },
    {
      /* W9-4 신설(2026-09-21, 원장 "어떻게 일차함수 그래프를 한 번에 배워") — 일차함수를
         한 마디에 뭉쳐 두었던 것을 교과 차시대로 다섯으로 편다. */
      id:'W9-4', icon:'📈', grade:'중2',
      edu:{ko:'중2 일차함수',en:'G8 Linear Functions',zh:'初二一次函数'},
      theme:{ko:'W9-4 · 일차함수 — 함숫값·평행이동·절편·교점·활용',en:'W9-4 · Linear Functions — Values, Translation, Intercepts, Crossings, Uses',zh:'W9-4·一次函数——函数值·平移·截距·交点·应用'},
      units:['M-73','M-74','M-65','M-75','M-76'],
      tip:{ko:'f(x)는 x를 넣으면 나오는 값 — 처음 값이 y절편, 한 칸마다 변하는 양이 기울기예요!',en:'f(x) is what comes out when x goes in - the starting value is the y-intercept and the change per step is the slope!',zh:'f(x)是代入x得到的值——起始值是y截距，每一步的变化量是斜率！'}
    },
    {
      /* 중2-2 비기하 연산 중 실제 원본이 확인된 경우의 수(p.216~230)만 편입한다.
         p.232 이후와 확률은 근거가 없으므로 이 장에 넣지 않는다. */
      id:'W9-5',icon:'⋮',grade:'중2',
      edu:{ko:'중2 경우의 수',en:'G8 Counting Possibilities',zh:'初二情况数'},
      theme:{ko:'W9-5 · 경우의 수 — 직접 세기·덧셈법칙·곱셈법칙·줄 세우기',en:'W9-5 · Counting — direct counts, sum rule, product rule, lineups',zh:'W9-5·情况数——直接计数·加法法则·乘法法则·排队'},
      units:['M-88'],
      tip:{ko:'겹치지 않는 둘 중 하나는 더하고, 두 단계를 모두 거치면 곱해요. 자리가 고정되면 먼저 놓고 남은 자리만 셉니다.',en:'Add disjoint alternatives, multiply stages that both happen, and place fixed seats before counting the rest.',zh:'互斥的二选一用加法，两个步骤都要完成用乘法；先固定指定位置，再数剩余位置。'}
    },

    /* ─────── W10 : 근호의 산맥 — 중3 제곱근과 실수 · 다항식의 곱셈과
       인수분해 (2026-08-25) ───────────────────────────────────
       MASTER-ROADMAP.md §3 "W10 근호의 산맥(중3)" 스토리 스테이지. */
    {
      id:'W10-1', icon:'🔓', grade:'중3',
      edu:{ko:'중3 제곱근의 세계',en:'G9 World of Square Roots',zh:'初三平方根的世界'},
      theme:{ko:'W10-1 · 제곱근의 세계 — 값·근호 정리·곱나눗·덧뺄',en:'W10-1 · World of Square Roots — Values, Simplifying, × ÷, + −',zh:'W10-1·平方根的世界——值·化简·乘除·加减'},
      /* M-83(2026-09-21) — 학습지 과정 35에는 넣었는데 학습모드 로드맵에는 빠져 있었다.
         유닛이 두 곳(courses.js 의 magic · roadmap.js 의 chapters)에 각각 실리는 구조라
         한 쪽만 넣으면 조용히 절반만 보인다. */
      units:['M-15','M-16','M-17','M-83'],
      tip:{ko:'같은 소인수가 두 번 만나면(짝) 근호 밖으로 나올 수 있어요 — 2와 5가 만나 10이 되던 것과 같은 이치!',en:'When the same prime factor appears twice (a pair), it can step outside the root — the same idea as 2 and 5 meeting to make 10!',zh:'同一质因数出现两次(配对)就能走出根号——和2与5相遇变成10是同样的道理！'}
    },
    {
      /* 개념실험실 5호 — §7 훅 "수직선을 다 이으려면 어떤 수가 필요할까"를 그대로 구현.
         근거: 데데킨트의 절단(유리수에는 빈틈이 있고 실수에는 없다). 제곱근 유닛 뒤,
         무리수·실수를 배우기 직전에 둔다 — "왜 새 수가 필요한가"가 먼저다. */
      id:'LAB-NUMLINE', icon:'🕳', grade:'중3',
      edu:{ko:'수직선의 구멍',en:'The Hole in the Number Line',zh:'数轴上的缺口'},
      theme:{ko:'🕳 개념 실험실 — 분수를 아무리 촘촘히 찍어도 남는 자리, 10배씩 확대해 직접 확인',en:'🕳 Concept Lab — the spot no fraction ever lands on; zoom in 10× at a time and see it',zh:'🕳概念实验室——分数再密也填不满的位置，每次放大10倍亲眼确认'},
      link:'labs/number-line-hole.html',
      tip:{ko:'10배 확대를 여섯 번 눌러 보세요. 구간은 100만분의 1로 좁아지는데 빨간 자리는 끝까지 눈금 사이에 있어요. 그다음 √2를 한 자리씩 직접 캐 봐요(새 탭에서 열려요).',en:'Press zoom six times: the interval shrinks to one millionth, yet the red spot stays between the ticks. Then dig out √2 one digit at a time (opens in a new tab).',zh:'连按六次放大：区间缩小到百万分之一，红点始终夹在刻度之间。然后一位一位地把√2挖出来(会在新标签页打开)。'}
    },
    {
      id:'W10-2', icon:'🌈', grade:'중3',
      edu:{ko:'중3 곱셈공식과 인수분해',en:'G9 Formulas & Factoring',zh:'初三乘法公式与因式分解'},
      theme:{ko:'W10-2 · 곱셈공식과 인수분해 — 전개와 거꾸로 읽기',en:'W10-2 · Formulas & Factoring — Expanding & Reading Backward',zh:'W10-2·乘法公式与因式分解——展开与反着读'},
      units:['M-18','M-19','M-20'],
      tip:{ko:'무지개 덧셈법에서 시작된 여정의 마지막 걸음 — 곱셈공식을 거꾸로 읽으면 인수분해가 돼요!',en:'The final step of a journey that began with rainbow addition — read the multiplication formula backward and you get factoring!',zh:'从彩虹加法法出发的旅程终点——把乘法公式反着读就是因式分解！'}
    },
    {
      /* W10-3 신설(2026-09-20, 중등 교과 연산 3차) — 인수분해까지 와 놓고
         "그 식을 =0으로 놓는" 한 걸음이 없었다. 중3 교과 연산의 마지막 두 기둥. */
      id:'W10-3', icon:'🎯', grade:'중3',
      edu:{ko:'중3 이차방정식과 활용',en:'G9 Quadratic Equations & Their Uses',zh:'初三二次方程与应用'},
      theme:{ko:'W10-3 · 이차방정식 — 근을 읽고 활용하기',en:'W10-3 · Quadratic Equations — Reading the Roots and Using Them',zh:'W10-3·二次方程——读出根并应用'},
      units:['M-66','M-77'],
      tip:{ko:'곱해서 0이면 둘 중 하나가 0 — 인수분해한 식을 =0으로 놓는 순간 근이 그냥 보여요!',en:'A product of zero means one factor is zero — set the factored form to zero and the roots are simply there to read!',zh:'乘积为0就有一个因式为0——把分解好的式子令为0，根就直接看出来了！'}
    },
    {
      /* W10-4 신설(2026-09-21, 원장 "이차함수도 세부화해야지") — 꼭짓점 하나로 뭉쳐 있던
         것을 y=ax² → 평행이동 → 꼭짓점 → 최대최소·교점 → 식 구하기 다섯으로 편다. */
      id:'W10-4', icon:'🥣', grade:'중3',
      edu:{ko:'중3 이차함수',en:'G9 Quadratic Functions',zh:'初三二次函数'},
      theme:{ko:'W10-4 · 이차함수 — y=ax²·평행이동·최대최소·축과의 교점·식 구하기',en:'W10-4 · Quadratic Functions — y=ax2, Translation, Extremes, Crossings, Building the Formula',zh:'W10-4·二次函数——y=ax²·平移·最值·轴交点·求解析式'},
      units:['M-78','M-79','M-67','M-80','M-81'],
      tip:{ko:'위아래는 뒤에 그대로, 좌우는 괄호 안에 반대 부호로 — 꼭짓점의 y가 최댓값·최솟값이에요!',en:'Up and down at the end as they read, sideways inside the bracket with the sign flipped - and the y at the vertex is the extreme!',zh:'上下照原样加在后面，左右进括号并反号——顶点的y就是最值！'}
    },
    {
      id:'W10-5', icon:'📊', grade:'중3',
      edu:{ko:'중3 산포도',en:'G9 Dispersion',zh:'初三离散程度'},
      theme:{ko:'W10-5 · 산포도 — 편차·분산·표준편차·두 자료 비교',en:'W10-5 · Dispersion — deviations, variance, standard deviation, comparison',zh:'W10-5·离散程度——偏差·方差·标准差·两组数据比较'},
      units:['M-85'],
      tip:{ko:'편차는 모두 더하면 0, 분산은 편차 제곱의 평균, 표준편차는 분산의 양의 제곱근이에요. 더 고른 자료는 산포도가 작은 쪽입니다.',en:'Deviations sum to zero; variance is the mean squared deviation; standard deviation is its positive square root. The smaller spread is more consistent.',zh:'偏差之和为0；方差是偏差平方的平均数；标准差是方差的正平方根。离散程度较小的数据更均匀。'}
    },
    {
      id:'W10-6', icon:'📦', grade:'중3',
      edu:{ko:'중3 사분위수와 상자그림',en:'G9 Quartiles & Box Plots',zh:'初三四分位数与箱形图'},
      theme:{ko:'W10-6 · 사분위수와 상자그림 — 다섯 수 요약·IQR·읽기·직접 그리기',en:'W10-6 · Quartiles & Box Plots — five-number summary, IQR, reading and drawing',zh:'W10-6·四分位数与箱形图——五数概括·四分位距·读取·绘制'},
      units:['M-86'],
      tip:{ko:'정렬한 뒤 Q1·중앙값·Q3을 찾고, 다섯 수를 눈금에 먼저 표시한 다음 상자와 수염을 그립니다.',en:'Sort first, find Q1, median and Q3, then mark all five values before drawing the box and whiskers.',zh:'先排序求Q1、中位数、Q3，再标出五个数，最后画箱体和须。'}
    },
    {
      id:'W10-7', icon:'⠿', grade:'중3',
      edu:{ko:'중3 산점도와 상관관계',en:'G9 Scatter Plots & Correlation',zh:'初三散点图与相关关系'},
      theme:{ko:'W10-7 · 산점도와 상관관계 — 순서쌍 찍기·방향·강도',en:'W10-7 · Scatter Plots & Correlation — plotting pairs, direction and strength',zh:'W10-7·散点图与相关关系——描点·方向·强弱'},
      units:['M-87'],
      tip:{ko:'점을 선으로 잇지 말고 점구름 전체가 오른쪽으로 갈수록 올라가는지, 내려가는지, 방향이 없는지 봅니다.',en:'Do not join the dots; judge whether the whole cloud rises, falls or has no direction as x increases.',zh:'不要把点连线；观察整个点云随x增大是上升、下降还是没有方向。'}
    },

    /* ─────── W11 : 다항식의 탑 — 공통수학1 (2026-08-25) ─────────
       MASTER-ROADMAP.md §3 "W11 공통수학1" 스토리 스테이지. "고1"
       대신 2022 개정 과목명 "공통수학1"을 grade에 그대로 쓴다(과목명
       준수 원칙, 작업지시). */
    {
      id:'W11-1', icon:'📦', grade:'공통수학1',
      edu:{ko:'공통수학1 다항식과 나머지정리',en:'Common Math 1 Polynomials & the Remainder Theorem',zh:'公共数学1多项式与余数定理'},
      theme:{ko:'W11-1 · 다항식과 나머지정리 — 곱셈공식 확장·항등식·인수분해 심화',en:'W11-1 · Polynomials & the Remainder Theorem — Extended Formulas, Identities, Advanced Factoring',zh:'W11-1·多项式与余数定理——乘法公式扩展·恒等式·因式分解进阶'},
      units:['M-21','M-22','M-23','M-24','M-25'],
      tip:{ko:'나눗셈을 다 하지 않아도 P(a)만 계산하면 나머지가 바로 나와요 — 대입 한 번의 지름길!',en:'You don\'t need long division — just compute P(a) and the remainder appears, a one-substitution shortcut!',zh:'不用做完整除法，算出P(a)余数就出来了——一次代入的捷径！'}
    },
    {
      id:'W11-2', icon:'🔭', grade:'공통수학1',
      edu:{ko:'공통수학1 이차방정식과 행렬',en:'Common Math 1 Quadratics & Matrices',zh:'公共数学1二次方程与矩阵'},
      theme:{ko:'W11-2 · 이차방정식과 행렬 — 판별식·근과 계수·근의 공식·부등식·행렬',en:'W11-2 · Quadratics & Matrices — Discriminant, Roots & Coefficients, Formula, Inequalities, Matrices',zh:'W11-2·二次方程与矩阵——判别式·根与系数·求根公式·不等式·矩阵'},
      units:['M-26','M-27','M-28','M-29','M-30'],
      tip:{ko:'판별식은 근을 구하기 전에 몇 개인지 미리 아는 정찰병이에요!',en:'The discriminant scouts ahead and tells you the root count before you even solve!',zh:'判别式是求根之前先知道有几个根的侦察兵！'}
    },

    /* ─────── W12 : 도형의 방정식 나라 — 공통수학2 (2026-08-25) ────
       MASTER-ROADMAP.md §3 "W12 공통수학2" 스토리 스테이지. */
    {
      id:'W12-1', icon:'📏', grade:'공통수학2',
      edu:{ko:'공통수학2 점과 직선',en:'Common Math 2 Points & Lines',zh:'公共数学2点与直线'},
      theme:{ko:'W12-1 · 점과 직선 — 두 점 사이의 거리·중점과 내분점·직선의 방정식',en:'W12-1 · Points & Lines — Distance, Midpoints & Division Points, Line Equations',zh:'W12-1·点与直线——两点间距离·中点与内分点·直线方程'},
      units:['M-31','M-32','M-33'],
      tip:{ko:'두 점 사이의 거리는 결국 피타고라스 정리 — 가로·세로 차를 제곱해 더하고 제곱근을 씌워요!',en:'Distance between two points is just the Pythagorean theorem — square the differences, add, take the root!',zh:'两点间距离其实就是勾股定理——差平方后相加，再开方！'}
    },
    {
      id:'W12-2', icon:'⭕', grade:'공통수학2',
      edu:{ko:'공통수학2 직선의 관계와 원',en:'Common Math 2 Relations Between Lines & Circles',zh:'公共数学2直线的关系与圆'},
      theme:{ko:'W12-2 · 직선의 관계와 원 — 평행·수직 조건·원의 방정식',en:'W12-2 · Relations Between Lines & Circles — Parallel/Perpendicular, Circle Equations',zh:'W12-2·直线的关系与圆——平行·垂直条件·圆的方程'},
      units:['M-34','M-35'],
      tip:{ko:'x항·y항을 완전제곱으로 묶으면 원의 중심과 반지름이 한눈에 보여요!',en:'Complete the square on x and y, and a circle\'s center and radius appear at a glance!',zh:'把x、y项配成完全平方，圆的中心和半径一眼就看出来！'}
    },

    /* ─────── W13 : 기호의 탑 — 대수 (2026-08-25) ─────────
       MASTER-ROADMAP.md §3 "W13 대수" 스토리 스테이지. log(M-37)·
       Σ(M-42)가 §13 기호 전환 교육 대상 — 두 유닛 모두 practice가
       "기호 해독"으로 시작한다(계산은 discover 이후). 2022 개정
       과목명 준수 — "고3" 표기 없음(전부 "대수"). */
    {
      id:'W13-1', icon:'🪜', grade:'대수',
      edu:{ko:'대수 지수와 로그',en:'Algebra Exponents & Logarithms',zh:'代数指数与对数'},
      theme:{ko:'W13-1 · 지수와 로그 — 유리수 지수·log의 정의와 성질',en:'W13-1 · Exponents & Logarithms — Rational Exponents, log Definition & Properties',zh:'W13-1·指数与对数——有理数指数·log的定义与性质'},
      units:['M-36','M-37','M-38'],
      tip:{ko:'log_a N = x는 "a를 몇 번 곱해야 N이 되는가" — 지수 사다리를 거꾸로 읽는 것뿐이에요!',en:'log_a N = x asks "how many times must a be multiplied to reach N" — just reading the exponent ladder backward!',zh:'log_a N = x问的是"a要乘几次才能得到N"——只是反过来读指数梯子而已！'}
    },
    {
      id:'W13-2', icon:'📐', grade:'대수',
      edu:{ko:'대수 삼각함수와 수열',en:'Algebra Trigonometry & Sequences',zh:'代数三角函数与数列'},
      theme:{ko:'W13-2 · 삼각함수와 수열 — 특수각의 값·등차수열·등비수열',en:'W13-2 · Trigonometry & Sequences — Special-Angle Values, Arithmetic & Geometric Sequences',zh:'W13-2·三角函数与数列——特殊角的值·等差数列·等比数列'},
      units:['M-39','M-40','M-41'],
      tip:{ko:'30-60-90 삼각형의 변의 비는 1:√3:2 — 이 하나만 알면 특수각 값이 다 나와요!',en:'A 30-60-90 triangle has side ratio 1:√3:2 — know this one thing and every special-angle value follows!',zh:'30-60-90三角形的边比是1:√3:2——知道这一点，特殊角的值全都能推出来！'}
    },
    {
      id:'W13-3', icon:'🌈', grade:'대수',
      edu:{ko:'대수 Σ와 무지개 덧셈법',en:'Algebra Σ & the Rainbow-Sum Trick',zh:'代数Σ与彩虹加法法'},
      theme:{ko:'W13-3 · Σ(시그마) — 이미 아는 마법이 새 기호 옷을 입어요',en:'W13-3 · Sigma (Σ) — Magic You Already Know, in New Symbolic Clothes',zh:'W13-3·Σ(西格玛)——早就会的魔法换上新符号的外衣'},
      units:['M-42'],
      tip:{ko:'Σk=n(n+1)÷2는 무지개 덧셈법 그 공식이고, Σk²=n(n+1)(2n+1)÷6은 제곱수의 합이에요 — 새로 외울 게 없어요!',en:'Σk=n(n+1)÷2 is exactly the rainbow-sum formula, and Σk²=n(n+1)(2n+1)÷6 is the sum of squares — nothing new to memorize!',zh:'Σk=n(n+1)÷2正是彩虹加法法的公式，Σk²=n(n+1)(2n+1)÷6就是平方数之和——完全不用背新东西！'}
    },

    /* ─────── W13-4·5 : 심화 유형 2차(2026-08-27) — 대수 심화 ───────
       mid6.js(MD36~42)가 작업지시로 제외했던 지수·로그 방정식/부등식·
       사인법칙·코사인법칙·삼각함수 최대최소주기(MD52~57). */
    {
      id:'W13-4', icon:'🧩', grade:'대수',
      edu:{ko:'대수 지수·로그 방정식과 부등식',en:'Algebra Exponential & Log Equations/Inequalities',zh:'代数指数·对数方程与不等式'},
      theme:{ko:'W13-4 · 지수·로그 방정식과 부등식 — 밑 통일부터 경계값까지',en:'W13-4 · Exponential & Log Equations/Inequalities — From Unifying the Base to Boundary Values',zh:'W13-4·指数·对数方程与不等式——从统一底数到边界值'},
      units:['M-52','M-53','M-54'],
      tip:{ko:'밑이 같으면 지수함수는 일대일 대응 — 지수끼리 등식(또는 부등식)이 그대로 성립해요!',en:'With equal bases, the exponential function is one-to-one — the exponents themselves form the equation (or inequality)!',zh:'底数相同时，指数函数一一对应——指数本身就构成等式(或不等式)！'}
    },
    {
      id:'W13-5', icon:'🔺', grade:'대수',
      edu:{ko:'대수 삼각형의 법칙과 삼각함수',en:'Algebra Triangle Laws & Trig Functions',zh:'代数三角形定律与三角函数'},
      theme:{ko:'W13-5 · 사인법칙·코사인법칙과 삼각함수 최대최소주기',en:'W13-5 · Law of Sines/Cosines & Trig Max/Min/Period',zh:'W13-5·正弦定理·余弦定理与三角函数最大最小值·周期'},
      units:['M-55','M-56','M-57'],
      tip:{ko:'사인법칙(a/sinA=2R)은 변과 외접원을, 코사인법칙(a²=b²+c²-2bc·cosA)은 두 변과 낀각을 이어줘요!',en:'The law of sines (a/sinA=2R) links a side to the circumscribed circle; the law of cosines (a²=b²+c²-2bc·cosA) links two sides and the included angle!',zh:'正弦定理(a/sinA=2R)连接边与外接圆；余弦定理(a²=b²+c²-2bc·cosA)连接两边与夹角！'}
    },

    /* ─────── W14 : 변화의 정상 — 미적분Ⅰ (2026-08-25) ─────────
       MASTER-ROADMAP.md §3 "W14 미적분Ⅰ" 스토리 스테이지 — 로드맵의
       마지막 월드. lim(M-43)·f′·d/dx(M-44)·∫(M-46)가 §13 기호 전환
       교육 대상. W14-2 다음에 🔬 미적분 실험실(기존
       fields-classic/calculus 이식, 새로 만들지 않음)을 외부 링크
       노드로 연결한다 — MASTER-ROADMAP.md §2 "개념 실험실 원칙"·
       작업지시 반영. */
    {
      id:'W14-1', icon:'🧭', grade:'미적분Ⅰ',
      edu:{ko:'미적분Ⅰ 극한과 미분',en:'Calculus Ⅰ Limits & Derivatives',zh:'微积分Ⅰ极限与导数'},
      theme:{ko:'W14-1 · 극한과 미분 — 극한값 계산·미분계수와 도함수',en:'W14-1 · Limits & Derivatives — Evaluating Limits, Derivatives',zh:'W14-1·极限与导数——极限值计算·导数与导函数'},
      units:['M-43','M-44'],
      tip:{ko:'0/0 꼴이 나오면 당황하지 말고 분자를 인수분해해서 분모와 약분해요!',en:'Hit a 0/0 form? Don\'t panic — factor the numerator and cancel with the denominator!',zh:'遇到0/0型别慌——把分子因式分解后和分母约分！'}
    },
    {
      id:'W14-2', icon:'📏', grade:'미적분Ⅰ',
      edu:{ko:'미적분Ⅰ 접선과 적분',en:'Calculus Ⅰ Tangent Lines & Integration',zh:'微积分Ⅰ切线与积分'},
      theme:{ko:'W14-2 · 접선과 적분 — 접선의 방정식·다항함수의 적분',en:'W14-2 · Tangent Lines & Integration — Tangent Line Equations, Integrating Polynomials',zh:'W14-2·切线与积分——切线方程·多项式函数的积分'},
      units:['M-45','M-46'],
      tip:{ko:'∫는 미분의 반대 방향 — 계수를 (n+1)로 나누고 지수를 하나 늘리면 돼요!',en:'∫ reverses differentiation — divide the coefficient by (n+1) and raise the exponent by one!',zh:'∫是求导的反方向——系数除以(n+1)，指数加1就行！'}
    },

    /* ─────── W14-3·4 : 심화 유형 2차(2026-08-27) — 미적분Ⅰ 심화 ─────
       mid7.js(MD43~46)가 작업지시로 제외했던 유리화형 극한·연속조건·
       극값·넓이·속도(MD58~62). 🔬 실험실(LAB-CALC1)이 다루는 극값·
       넓이 개념이 이제 실제 문항으로도 뒷받침되므로, 실험실 링크를
       로드맵의 마지막(이 두 챕터 다음)으로 옮겨 "실험 → 문제로 마무리"
       원칙(MASTER-ROADMAP.md §2)을 전체 W14의 진짜 마지막 매듭으로
       삼는다. */
    {
      id:'W14-3', icon:'√', grade:'미적분Ⅰ',
      edu:{ko:'미적분Ⅰ 극한 심화와 연속',en:'Calculus Ⅰ Advanced Limits & Continuity',zh:'微积分Ⅰ极限进阶与连续'},
      theme:{ko:'W14-3 · 유리화형 극한과 연속조건 — 켤레를 곱해 근호를 없애요',en:'W14-3 · Limits via Rationalization & Continuity — Clear the root by multiplying the conjugate',zh:'W14-3·有理化型极限与连续条件——乘以共轭式去掉根号'},
      units:['M-58','M-59'],
      tip:{ko:'근호가 있는 0/0 꼴은 켤레(부호만 반대인 짝)를 곱해 근호를 없애면 (x-a)가 약분돼요!',en:'For a 0/0 form with a root, multiply by the conjugate (same expression, opposite sign) to clear the root — then (x-a) cancels!',zh:'带根号的0/0型，乘以共轭式(符号相反的搭档)去掉根号后，(x-a)就能约掉！'}
    },
    {
      id:'W14-4', icon:'⛰️', grade:'미적분Ⅰ',
      edu:{ko:'미적분Ⅰ 극값·넓이·속도',en:'Calculus Ⅰ Extrema, Area & Velocity',zh:'微积分Ⅰ极值·面积·速度'},
      theme:{ko:'W14-4 · 극값·곡선과 x축 사이 넓이·속도와 거리 활용',en:'W14-4 · Extrema, Area Between Curve & x-axis, Velocity & Distance',zh:'W14-4·极值·曲线与x轴间面积·速度与距离应用'},
      units:['M-60','M-61','M-62'],
      tip:{ko:"f'(x)=0인 자리가 극값의 후보 — 그 x를 f(x)에 다시 대입하면 극댓값·극솟값이 나와요!",en:"Where f'(x)=0 are the candidates for extrema — substitute that x back into f(x) to get the local max/min!",zh:"f'(x)=0的位置是极值的候选——把那个x代回f(x)就能得到极大值·极小值！"}
    },
    {
      /* 미적분을 "왜" 배우는지부터 여는 실험실 — 기법(LAB-CALC1)보다 앞에 둔다.
         원장 지시(2026-08-25): 추상 곡선만이 아니라 실감나는 쓰임새와 흥미가 먼저. */
      id:'LAB-WHYCALC', icon:'🍎', grade:'미적분Ⅰ',
      edu:{ko:'미적분은 왜 태어났나',en:'Why Calculus Was Born',zh:'微积分为何诞生'},
      theme:{ko:'🍎 개념 실험실 — 뉴턴·라이프니츠가 왜 만들었나, 롤러코스터·속도계·AI까지 어디에 쓰이나',en:'🍎 Concept Lab — why Newton & Leibniz created it, and where it lives today: coasters, speedometers, even AI',zh:'🍎概念实验室——牛顿与莱布尼茨为何创造它，以及它今天用在哪里：过山车、速度表、甚至AI'},
      link:'labs/why-calculus.html',
      tip:{ko:'롤러코스터에서 가장 무서운 지점을 직접 찾아보면 "기울기"가 몸으로 느껴져요. 카드를 눌러 실생활 쓰임새도 확인해요(새 탭에서 열려요).',en:'Find the scariest spot on a roller coaster yourself and you feel what "slope" means. Tap the cards for real-life uses (opens in a new tab).',zh:'亲手找出过山车最可怕的位置，就能体会什么是"斜率"。点击卡片看看现实中的用途(会在新标签页打开)。'}
    },
    {
      id:'LAB-CALC1', icon:'🔬', grade:'미적분Ⅰ',
      edu:{ko:'미적분Ⅰ 개념 실험실',en:'Calculus Ⅰ Concept Lab',zh:'微积分Ⅰ概念实验室'},
      theme:{ko:'🔬 미적분 실험실 — 극값·부정적분·적분조건·유사문제를 직접 조작해봐요',en:'🔬 Calculus Lab — manipulate extrema, antiderivatives, integral conditions & practice problems yourself',zh:'🔬微积分实验室——亲手操作极值·不定积分·积分条件与相似题'},
      link:'../fields-classic/calculus/',
      tip:{ko:'그래프를 직접 움직여 보면서 극한·접선·극값·넓이가 왜 그렇게 되는지 눈으로 확인해요(새 탭에서 열려요).',en:'Drag the graph yourself to see why limits, tangents, extrema, and area work the way they do (opens in a new tab).',zh:'亲自拖动图像，用眼睛确认极限、切线、极值和面积为什么是那样(会在新标签页打开)。'}
    }

  ]
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_ROADMAP;
})();
