/* ============================================================
   Numbers of Magic — 학습모드 로드맵 (Magic Learning Journey)
   전체 연산 여행: 작은 수 → 큰 수, 덧셈 → 뺄셈 → 곱셈 → 나눗셈 → 분수/소수
   잠금 없음 — 추천 순서. 기존 유닛을 재사용(데이터 중복 없음).
   ============================================================ */
(function(){
'use strict';

window.NM_ROADMAP = {
  id:'main-road',
  title:{ko:'마법 학습 여행',en:'Magic Learning Journey',zh:'魔法学习之旅'},
  subtitle:{ko:'작은 수부터 분수까지 — 한 걸음씩',en:'From small numbers to fractions — one step at a time',zh:'从小数字到分数——一步一步'},

  chapters:[

    /* ─────── R0 : 연산 첫걸음 ─────── */
    {
      id:'R0', icon:'🌱',
      edu:{ko:'초1~초2 연산 준비',en:'G1–G2 warm-up',zh:'小1~2年级准备'},
      theme:{ko:'연산 첫걸음 — 더하고 빼기',en:'First Steps — Add & Subtract',zh:'计算第一步——加与减'},
      units:['A-01','A-02','A-03','A-04'],
      tip:{ko:'사탕 7개를 두 접시에 나눠보는 곳이에요!',en:'Start here — share 7 candies onto two plates!',zh:'从这里开始——把7颗糖分到两个盘子里！'}
    },

    /* ─────── R1 : 덧셈 마법 ─────── */
    {
      id:'R1', icon:'➕',
      edu:{ko:'초1-2 덧셈구구',en:'G1-2 Addition Facts',zh:'小1-2加法口诀'},
      theme:{ko:'덧셈 마법 — 10 넘는 더하기',en:'Addition Magic — Carrying Over 10',zh:'加法魔法——进位加法'},
      units:['A-05','A-06','A-07','A-08','A-09'],
      tip:{ko:'8+5처럼 받아올림 있는 덧셈! 10칸 프레임 전략이에요.',en:'Addition with carrying like 8+5! Use the ten-frame strategy.',zh:'像8+5这样的进位加法！用十格框策略。'}
    },

    /* ─────── R2 : 뺄셈 마법 ─────── */
    {
      id:'R2', icon:'➖',
      edu:{ko:'초1-2 뺄셈구구',en:'G1-2 Subtraction Facts',zh:'小1-2减法口诀'},
      theme:{ko:'뺄셈 마법 — 받아내림 전략',en:'Subtraction Magic — Borrowing Strategies',zh:'减法魔法——退位策略'},
      units:['A-10','A-11','A-12','A-13','A-14'],
      tip:{ko:'13-5처럼 받아내림 있는 뺄셈을 마스터해요!',en:'Master subtraction with borrowing like 13−5!',zh:'掌握像13-5这样的退位减法！'}
    },

    /* ─────── R3 : 뺄셈 심화 ─────── */
    {
      id:'R3', icon:'🎯',
      edu:{ko:'초2-1 두자리 연산',en:'G2-1 Two-digit operations',zh:'小2-1两位数运算'},
      theme:{ko:'뺄셈 심화 — 두 자리 수 넘나들기',en:'Subtraction Deep Dive — Two-Digit Numbers',zh:'深入减法——两位数计算'},
      units:['A-15','A-16','A-17','A-18','A-19'],
      tip:{ko:'두 자리 수끼리 빼는 전략을 배워요.',en:'Learn strategies for subtracting two-digit numbers.',zh:'学习两位数相减的策略。'}
    },

    /* ─────── R4 : 큰 수 덧뺄셈 ─────── */
    {
      id:'R4', icon:'🔢',
      edu:{ko:'초2 세자리 연산',en:'G2 Three-digit operations',zh:'小2三位数运算'},
      theme:{ko:'큰 수로 넓히기 — 자릿값과 세 자리',en:'Expanding — Place Value & Three Digits',zh:'扩展——数位与三位数'},
      units:['A-20','A-21','A-22','A-23','A-24','A-25'],
      tip:{ko:'백의 자리까지! 자릿값 개념이 중요해요.',en:'Up to the hundreds place! Place value is key.',zh:'到百位！数位概念很重要。'}
    },

    /* ─────── R5 : 수열·패턴 ─────── */
    {
      id:'R5', icon:'📐',
      edu:{ko:'초2 규칙과 수열',en:'G2 Patterns & Sequences',zh:'小2规律与数列'},
      theme:{ko:'수열과 패턴 찾기',en:'Sequences & Pattern Finding',zh:'数列与规律发现'},
      units:['A-26','A-27','A-28','A-29'],
      tip:{ko:'5, 10, 15, 20... 규칙을 발견해요!',en:'Discover patterns like 5, 10, 15, 20...!',zh:'发现5, 10, 15, 20...这样的规律！'}
    },

    /* ─────── R6 : 자릿값 계산 ─────── */
    {
      id:'R6', icon:'🏙️',
      edu:{ko:'초2-2 자릿값 전략',en:'G2-2 Place-value strategies',zh:'小2-2数位计算策略'},
      theme:{ko:'자릿값 계산 전략',en:'Place-Value Calculation Strategies',zh:'数位计算策略'},
      units:['A-30','A-31','A-32','A-33','A-34'],
      tip:{ko:'10씩, 100씩 건너뛰는 계산 전략이에요!',en:'Strategies for jumping by 10s and 100s!',zh:'以10、100为单位跳跃的计算策略！'}
    },

    /* ─────── R7 : 곱셈의 시작 ─────── */
    {
      id:'R7', icon:'✖️',
      edu:{ko:'초2-2 곱셈 도입·2·5단',en:'G2-2 Intro to multiplication, 2s & 5s',zh:'小2-2乘法入门，2和5的口诀'},
      theme:{ko:'곱셈의 시작 — 배와 묶음',en:'Start of Multiplication — Doubling & Groups',zh:'乘法开始——翻倍与分组'},
      units:['B-01','B-02','B-03','B-04','B-05','B-06'],
      tip:{ko:'"사과 2개씩 5봉지" = 2×5. 묶음이 곱셈이에요!',en:'"2 apples in each of 5 bags" = 2×5. Groups are multiplication!',zh:'"每袋2个苹果，5袋" = 2×5。分组就是乘法！'}
    },

    /* ─────── R8 : 구구단 완성 ─────── */
    {
      id:'R8', icon:'🎲',
      edu:{ko:'초2-2 구구단 완성',en:'G2-2 Times tables complete',zh:'小2-2乘法口诀全覆盖'},
      theme:{ko:'구구단 완성 — 3~9단',en:'Times Tables Complete — 3s through 9s',zh:'口诀完成——3到9的口诀'},
      units:['B-07','B-08','B-09','B-10','B-11','B-12','B-13','B-14','B-15','B-16','B-17'],
      tip:{ko:'3·4·6·7·8·9단까지! 구구단 왕이 되어요.',en:'Through 3, 4, 6, 7, 8, 9 tables! Become the times-table king.',zh:'3、4、6、7、8、9的口诀！成为口诀王。'}
    },

    /* ─────── R9 : 곱셈 넓히기 ─────── */
    {
      id:'R9', icon:'💫',
      edu:{ko:'초3-1 두자리×한자리',en:'G3-1 2-digit × 1-digit',zh:'小3-1两位乘一位'},
      theme:{ko:'곱셈 넓히기 — 몇십·몇백 곱셈',en:'Expanding Multiplication — Tens & Hundreds',zh:'扩展乘法——整十整百乘法'},
      units:['B-18','B-19','B-20','B-21','B-22','B-23'],
      tip:{ko:'30×4=120! 자릿수를 올려가며 곱해요.',en:'30×4=120! Multiply by moving up place values.',zh:'30×4=120！通过提高数位来乘法。'}
    },

    /* ─────── R10 : 창의 전략 입문 ─────── */
    {
      id:'R10', icon:'🔺',
      edu:{ko:'창의수연 기초 전략',en:'Creative math basic strategies',zh:'创意数学基础策略'},
      theme:{ko:'수의 마법 — 쌍·거듭제곱·가우스',en:'Number Magic — Pairs, Powers & Gauss',zh:'数字魔法——对、幂与高斯'},
      units:['C-01','C-02','C-03','C-04','C-05'],
      tip:{ko:'1+2+3...+20을 20초 만에? 가우스의 비밀을 배워요!',en:'Sum 1+2+...+20 in 20 seconds? Learn the Gauss secret!',zh:'20秒内求1+2+...+20？学习高斯的秘密！'}
    },

    /* ─────── R11 : 곱셈 전략 I ─────── */
    {
      id:'R11', icon:'🧠',
      edu:{ko:'창의수연 곱셈 전략 I',en:'Creative math multiplication I',zh:'创意数学乘法策略I'},
      theme:{ko:'빠른 곱셈 I — ×9·분배·올림빼기',en:'Fast Multiplication I — ×9, Distribute, Over-subtract',zh:'快速乘法I——×9·分配·多乘减'},
      units:['C-06','C-07','C-08'],
      tip:{ko:'9를 곱할 땐 10을 곱하고 한 번 빼면 돼요!',en:'To multiply by 9: multiply by 10 then subtract once!',zh:'乘9时：先乘10，再减一次！'}
    },

    /* ─────── R12 : 창의 곱셈 핵심 ─────── */
    {
      id:'R12', icon:'🌸',
      edu:{ko:'창의수연 창의 곱셈법',en:'Creative multiplication methods',zh:'创意乘法方法'},
      theme:{ko:'창의 곱셈법 — 6가지 검법',en:'6 Creative Multiplication Methods',zh:'六种创意乘法'},
      units:['C-09','C-10','C-11','C-12','C-13','C-14'],
      tip:{ko:'세로식, 넓이 곱셈, 격자... 나만의 방법을 찾아봐요!',en:'Column, area model, lattice... find your own method!',zh:'竖式、面积乘法、格子法...找到自己的方法！'}
    },

    /* ─────── R13 : 자리이동과 ×5·×25 ─────── */
    {
      id:'R13', icon:'✋',
      edu:{ko:'창의수연 특수 곱셈',en:'Creative math special multiplication',zh:'创意数学特殊乘法'},
      theme:{ko:'지름길 곱셈 — 자리이동·×5·×25',en:'Shortcut Multiplication — Shift, ×5, ×25',zh:'捷径乘法——位移·×5·×25'},
      units:['C-15','C-16','C-17'],
      tip:{ko:'40×25=1000! 규칙을 찾으면 계산이 쉬워져요.',en:'40×25=1000! Find the pattern and calculation becomes easy!',zh:'40×25=1000！找到规律，计算就变简单了！'}
    },

    /* ─────── R14 : 나눗셈 3형제 ─────── */
    {
      id:'R14', icon:'🪓',
      edu:{ko:'초3-2 나눗셈',en:'G3-2 Division',zh:'小3-2除法'},
      theme:{ko:'나눗셈 3형제 — 분해·약분·부풀리기',en:'3 Division Methods — Decompose, Simplify, Expand',zh:'三种除法——分解·约分·扩张'},
      units:['C-18','C-19','C-20'],
      tip:{ko:'312÷3: 300÷3=100, 12÷3=4, 합치면 104!',en:'312÷3: 300÷3=100, 12÷3=4, combine → 104!',zh:'312÷3：300÷3=100，12÷3=4，合并→104！'}
    },

    /* ─────── R15 : 분수의 세계 ─────── */
    {
      id:'R15', icon:'🍕',
      edu:{ko:'초4-2 분수',en:'G4-2 Fractions',zh:'小4-2分数'},
      theme:{ko:'분수의 세계 — 같은 분모·다른 분모',en:'Fraction World — Same & Different Denominators',zh:'分数世界——同分母与异分母'},
      units:['C-21','C-22'],
      tip:{ko:'피자를 같은 크기로 나누면 분수가 보여요!',en:'When you cut pizza into equal pieces, fractions appear!',zh:'把比萨切成相等的块，分数就出现了！'}
    },

    /* ─────── R16 : 마스터의 길 ─────── */
    {
      id:'R16', icon:'🏆',
      edu:{ko:'창의수연 고급',en:'Creative math advanced',zh:'创意数学高级'},
      theme:{ko:'마스터의 길 — VEDA·차이곱·소수',en:'Master Path — VEDA, Difference Products, Decimals',zh:'大师之路——VEDA·差积·小数'},
      units:['C-23','C-24','C-25'],
      tip:{ko:'23×27=(25-2)(25+2)=625-4=621! 수의 아름다움이에요.',en:'23×27=(25-2)(25+2)=625-4=621! The beauty of numbers.',zh:'23×27=(25-2)(25+2)=625-4=621！数字之美。'}
    }

  ]
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_ROADMAP;
})();
