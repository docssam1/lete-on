/* ============================================================
   Numbers of Magic — 수학 팁(기억 고리) 데이터  ※ 생성 파일, 손으로 고치지 말 것
   만드는 법: node scripts/build-math-tips.js /tmp/md-tips-A.json /tmp/md-tips-B.json
   원장 2026-09-08: "중고등 수학 팁 — 잘 기억하고 이해할 수 있는 스킬이나 팁들",
   "이런 것들을 검색해서 제일 꿀팁을 넣어".

   학습지 회차 첫 장의 개념 패널(exam.js w2ConceptPanelHtml) 안, 개념 문장 아래에 붙는다.
   온라인 회차 탭도 같은 마크업이라 화면에도 같이 나온다. 팁이 없는 스레드는 조용히 생략.

   형식: NM_MATH_TIPS[스레드id] = { source, hook, why, mistake }  (뒤 셋은 {ko,en,zh})
     hook    — 기억 고리. 외워지는 한 줄.
     why     — 왜 그런지 한 문장. 규칙을 되풀이하지 않는다.
     mistake — 가장 흔한 실수 하나와 그걸 잡는 확인법.
     source  — 'owner' 원장이 직접 준 문장 · 'known' 실제로 쓰이는 암기법 · 'own' 자체 작성
   평문만(LaTeX 금지 — 개념 패널은 esc() 로 그대로 찍는다).
   ============================================================ */
(function(){
'use strict';
window.NM_MATH_TIPS = window.NM_MATH_TIPS || {};
const T = window.NM_MATH_TIPS;

T["DV8"] = { source:"owner",
  hook:{ ko:"제곱수만 약수가 홀수 개! 소수의 제곱은 딱 3개.",
         en:"Only perfect squares have an odd number of divisors — a prime squared has exactly 3.",
         zh:"只有平方数的约数是奇数个——质数的平方恰好3个。" },
  why:{ ko:"약수는 a×b 짝으로 세는데, 제곱수는 √n×√n 한 짝이 같은 수라 하나로만 세어져요.",
         en:"Divisors come in pairs a×b; for a square the pair √n×√n is one number, so it counts once.",
         zh:"约数按a×b成对出现，平方数里√n×√n这一对是同一个数，只算一次。" },
  mistake:{ ko:"36의 약수를 짝으로 세다 6을 두 번 세지 않기 — 답은 9개.",
         en:"Counting 6 twice in the pairs of 36 — the answer is 9, not 10.",
         zh:"数36的约数时把6算两次——答案是9个，不是10个。" } };

T["MD42"] = { source:"owner",
  hook:{ ko:"Σ는 \"여기서부터 저기까지 더해라\"예요 — 그냥 가우스 덧셈!",
         en:"Σ just says \"add from here to there\" — it is Gauss addition in a coat.",
         zh:"Σ就是\"从这里加到那里\"——不过是高斯求和换了件衣服。" },
  why:{ ko:"아래 k=1은 시작, 위 n은 끝. 항을 하나씩 늘어놓으면 늘 하던 덧셈이에요.",
         en:"k=1 below is the start, n on top is the end; write the terms out and it is ordinary addition.",
         zh:"下面的k=1是起点，上面的n是终点；把各项写出来，就是普通的加法。" },
  mistake:{ ko:"상수를 Σ 안에 두면 개수만큼 더해요 — Σ(k=1~n) 3은 3이 아니라 3n.",
         en:"A constant inside Σ is added n times — Σ 3 from 1 to n is 3n, not 3.",
         zh:"常数在Σ里要加n次——Σ 3（k从1到n）是3n，不是3。" } };
})();
