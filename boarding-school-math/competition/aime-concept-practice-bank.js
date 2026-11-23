(function (root) {
  "use strict";

  const items = [
    {
      id: "aime-g8-algebra-01", sourceConcepts: ["vietas-formulas", "algebraic-manipulation"], domain: "대수", stage: "개념", title: "합과 곱으로 식의 값 구하기",
      prompt: "실수 x, y에 대하여 x + y = 17, xy = 60입니다. (x − 2)(y − 2)의 값은 얼마인가요?",
      answer: 30,
      hint: "두 괄호를 전개한 다음 x + y와 xy를 찾아 넣어요.",
      solution: ["(x − 2)(y − 2) = xy − 2x − 2y + 4입니다.", "xy − 2(x + y) + 4 = 60 − 2 × 17 + 4입니다.", "따라서 값은 30입니다."],
      connection: "x와 y를 각각 구하지 않아도 된 이유를 식의 구조로 설명해 보세요."
    },
    {
      id: "aime-g8-number-01", sourceConcepts: ["modular-arithmetic", "chinese-remainder-theorem"], domain: "정수론", stage: "개념", title: "두 나머지 조건을 함께 만족하기",
      prompt: "양의 정수 n을 5로 나누면 나머지가 2이고, 7로 나누면 나머지가 3입니다. 이런 조건을 만족하는 가장 작은 n은 얼마인가요?",
      answer: 17,
      hint: "5로 나누어 나머지가 2인 수를 작은 것부터 적어요.",
      solution: ["후보는 2, 7, 12, 17, 22, …입니다.", "이 가운데 7로 나누어 나머지가 3인 첫 수는 17입니다.", "따라서 가장 작은 양의 정수는 17입니다."],
      connection: "첫 조건을 만족하는 후보가 일정한 간격으로 나타나는 까닭을 말해 보세요."
    },
    {
      id: "aime-g8-algebra-02", sourceConcepts: ["polynomial", "factoring"], domain: "대수", stage: "개념", title: "다항식의 영점을 이용하기",
      prompt: "최고차항의 차수가 2 이하인 다항식 P가 P(1) = P(2) = 0, P(3) = 2를 만족합니다. P(4)의 값은 얼마인가요?",
      answer: 6,
      hint: "P는 (x − 1)(x − 2)의 상수배로 나타낼 수 있어요.",
      solution: ["P(1)과 P(2)가 0이고 차수가 2 이하이므로 P(x) = c(x − 1)(x − 2)입니다.", "P(3) = 2에서 2c = 2이므로 c = 1입니다.", "따라서 P(4) = (4 − 1)(4 − 2) = 6입니다."],
      connection: "다항식의 차수 조건이 없으면 P(1), P(2), P(3)만으로 P(4)를 정할 수 있을까요?"
    },
    {
      id: "aime-g8-geometry-01", sourceConcepts: ["triangle-area"], domain: "기하", stage: "개념", title: "세 변의 길이로 삼각형 넓이 구하기",
      prompt: "세 변의 길이가 13, 14, 15인 삼각형의 넓이는 얼마인가요?",
      answer: 84,
      hint: "헤론의 공식에서 먼저 반둘레를 구해요.",
      solution: ["반둘레는 (13 + 14 + 15) ÷ 2 = 21입니다.", "헤론의 공식에 따라 넓이는 √(21 × 8 × 7 × 6) = 84입니다.", "밑변을 14로 잡으면 높이는 12이므로, 넓이 공식으로도 1/2 × 14 × 12 = 84입니다."],
      connection: "높이를 직접 그려 구하는 방법과 헤론의 공식은 어떤 정보가 다르게 필요한가요?"
    },
    {
      id: "aime-g8-number-02", sourceConcepts: ["divisibility", "prime-factorization", "factor-counting"], domain: "정수론", stage: "유형", title: "약수의 개수 조건으로 최소 정수 찾기",
      prompt: "18의 배수 중 양의 약수가 정확히 12개인 가장 작은 정수는 얼마인가요?",
      answer: 72,
      hint: "소인수분해의 지수에 1을 더한 수들의 곱이 12가 되어야 해요.",
      solution: ["18의 배수는 2^a × 3^b × … 꼴이고 a ≥ 1, b ≥ 2입니다.", "2와 3만 쓰면 가능한 최소 지수쌍은 (a, b) = (3, 2)이므로 2^3 × 3^2 = 72입니다. 이 수의 약수는 (3 + 1)(2 + 1) = 12개입니다.", "다른 소인수를 하나 더 쓰면 최소 형태도 2 × 3^2 × 5 = 90 이상입니다. 두 소인수만 쓰는 다른 가능한 형태도 72보다 크므로 답은 72입니다."],
      connection: "약수의 개수를 유지하면서 소인수를 하나 더 넣으면 최소값이 왜 커지는지 설명해 보세요."
    },
    {
      id: "aime-g8-counting-01", sourceConcepts: ["digits", "casework"], domain: "경우의 수", stage: "유형", title: "자리 조건을 나누어 세기",
      prompt: "0, 1, 2, 3, 4, 5 중 서로 다른 네 숫자를 골라 네 자리 수를 만듭니다. 3000보다 크고 5의 배수인 수는 모두 몇 개인가요?",
      answer: 60,
      hint: "마지막 자리가 0인 경우와 5인 경우를 나누고, 천의 자리부터 정해요.",
      solution: ["마지막 자리가 0이면 천의 자리는 3, 4, 5 중 하나입니다. 남은 두 자리를 채우는 방법은 4 × 3이므로 3 × 4 × 3 = 36가지입니다.", "마지막 자리가 5이면 천의 자리는 3 또는 4입니다. 남은 두 자리는 각각 4 × 3가지이므로 2 × 4 × 3 = 24가지입니다.", "두 경우는 겹치지 않으므로 36 + 24 = 60가지입니다."],
      connection: "끝자리를 먼저 정하면 어떤 조건을 바로 처리할 수 있나요?"
    },
    {
      id: "aime-g8-counting-02", sourceConcepts: ["stars-and-bars", "combinations"], domain: "경우의 수", stage: "유형", title: "합이 정해진 정수해 세기",
      prompt: "0 이상의 정수 a, b, c가 a + b + c = 20을 만족합니다. a ≤ 4인 순서 있는 세 쌍 (a, b, c)는 몇 개 있나요?",
      answer: 95,
      hint: "전체 해에서 a가 5 이상인 해를 빼요.",
      solution: ["제한이 없으면 0 이상 정수해의 수는 별과 막대 원리로 C(22, 2) = 231입니다.", "a ≥ 5인 경우 a' = a − 5로 두면 a' + b + c = 15이고 해의 수는 C(17, 2) = 136입니다.", "따라서 a ≤ 4인 해는 231 − 136 = 95개입니다."],
      connection: "변수 하나의 범위 제한을 전체 경우에서 빼는 방식으로 바꾸면 어떤 점이 편해지나요?"
    },
    {
      id: "aime-g8-number-03", sourceConcepts: ["factorial", "prime-factorization"], domain: "정수론", stage: "유형", title: "팩토리얼에서 소인수의 지수 세기",
      prompt: "1부터 100까지의 정수 중 n!이 2^8로 나누어떨어지는 n은 몇 개인가요?",
      answer: 91,
      hint: "n!에 들어 있는 2의 개수를 10 근처에서 확인해요.",
      solution: ["n!에 들어 있는 2의 개수는 ⌊n/2⌋ + ⌊n/4⌋ + ⌊n/8⌋ + …입니다.", "9!에서는 4 + 2 + 1 = 7개이고, 10!에서는 5 + 2 + 1 = 8개입니다.", "따라서 처음 조건을 만족하는 수는 n = 10이고, 10부터 100까지 91개입니다."],
      connection: "n이 2의 배수일 때마다 2의 지수가 한 번씩 늘어나는 이유를 설명해 보세요."
    },
    {
      id: "aime-g8-number-04", sourceConcepts: ["exponent", "modular-exponentiation"], domain: "정수론", stage: "연결", title: "거듭제곱의 나머지 주기 찾기",
      prompt: "7^2026을 100으로 나눌 때 나머지는 얼마인가요?",
      answer: 49,
      hint: "7^20을 100으로 나눈 나머지와 2026을 20으로 나눈 나머지를 살펴봐요.",
      solution: ["7^20을 100으로 나누면 나머지가 1입니다.", "2026 = 20 × 101 + 6이므로 7^2026의 나머지는 7^6의 나머지와 같습니다.", "7^6 = 117649이므로 100으로 나눈 나머지는 49입니다."],
      connection: "지수가 2027로 바뀌면 같은 주기에서 어느 나머지를 확인해야 하나요?"
    },
    {
      id: "aime-g8-number-05", sourceConcepts: ["inclusion-exclusion", "divisibility"], domain: "정수론", stage: "연결", title: "배수의 합을 겹침 없이 계산하기",
      prompt: "1부터 100까지의 정수 중 3 또는 5로 나누어떨어지는 수의 합을 S라 합니다. S를 1000으로 나눈 나머지는 얼마인가요?",
      answer: 418,
      hint: "3의 배수 합과 5의 배수 합을 더한 뒤, 15의 배수 합을 한 번 빼요.",
      solution: ["3의 배수 합은 3(1 + … + 33) = 1683입니다.", "5의 배수 합은 5(1 + … + 20) = 1050이고, 두 번 더해진 15의 배수 합은 15(1 + … + 6) = 315입니다.", "포함·배제 원리로 S = 1683 + 1050 − 315 = 2418입니다. 1000으로 나눈 나머지는 418입니다."],
      connection: "두 조건을 모두 만족하는 수를 빼지 않으면 어떤 수들이 중복되나요?"
    },
    {
      id: "aime-g8-counting-03", sourceConcepts: ["absolute-value", "casework"], domain: "경우의 수", stage: "연결", title: "절댓값 조건을 네 영역으로 나누기",
      prompt: "정수 순서쌍 (x, y) 중 |x| + |y| = 12를 만족하는 것은 몇 개인가요?",
      answer: 48,
      hint: "x축이나 y축 위의 해와 네 사분면의 해를 따로 세어요.",
      solution: ["축 위의 해는 (±12, 0), (0, ±12)로 4개입니다.", "각 사분면에서는 양의 정수 두 개의 합이 12가 되어야 하므로 11개씩, 모두 4 × 11 = 44개입니다.", "따라서 전체는 4 + 44 = 48개입니다."],
      connection: "x나 y가 0인 축 위의 해를 사분면의 해에 포함하면 왜 중복 계산이 되나요?"
    },
    {
      id: "aime-g8-geometry-02", sourceConcepts: ["square-geometry", "triangle-area", "area-decomposition"], domain: "기하", stage: "연결", title: "정사각형 안의 삼각형 넓이 구하기",
      prompt: "정사각형 ABCD의 한 변은 10입니다. A(0, 0), B(10, 0), C(10, 10), D(0, 10)으로 놓고, AB 위에 AP = 2인 점 P, BC 위에 BQ = 3인 점 Q를 잡습니다. 삼각형 DPQ의 넓이는 얼마인가요?",
      answer: 43,
      hint: "D를 꼭짓점으로 하는 두 변의 좌표 차를 이용해 넓이를 구할 수 있어요.",
      solution: ["좌표는 P = (2, 0), Q = (10, 3), D = (0, 10)입니다.", "D를 기준으로 한 두 벡터는 (2, −10), (10, −7)이고, 행렬식의 절댓값은 |2 × (−7) − (−10) × 10| = 86입니다.", "삼각형 넓이는 1/2 × 86 = 43입니다."],
      connection: "같은 넓이를 정사각형에서 바깥의 직각삼각형 넓이를 빼는 방법으로도 구해 보세요."
    },
    {
      id: "aime-gap-lattice-circle-01", sourceConcepts: ["distance-formula", "pythagorean-theorem", "circle"], domain: "기하", stage: "연결", title: "원 위의 격자점 세기",
      prompt: "x²+y²=65를 만족하는 정수 순서쌍 (x,y)는 몇 개 있나요?",
      answer: 16,
      hint: "65를 두 정수 제곱의 합으로 나타내고, 좌표의 부호와 순서를 세어요.",
      solution: ["65=1²+8²=4²+7²입니다.", "서로 다른 양의 정수 제곱수 쌍은 (1,8)과 (4,7) 두 가지입니다.", "각 쌍은 좌표 순서를 바꾸는 2가지와 두 좌표의 부호를 정하는 4가지가 있어 모두 2×2×4=16개입니다."],
      connection: "x²+y²=25에서는 좌표가 0인 해를 부호와 순서 세기에 어떻게 반영해야 하나요?"
    },
    {
      id: "aime-gap-incircle-13-14-15-01", sourceConcepts: ["incircle-incenter-and-inradius", "triangle-area", "pythagorean-theorem"], domain: "기하", stage: "유형", title: "삼각형의 넓이와 반둘레로 내접원 반지름 구하기",
      prompt: "변의 길이가 13, 14, 15인 삼각형의 내접원 반지름을 구하세요.",
      answer: 4,
      hint: "길이 14인 변을 밑변으로 잡고 높이를 피타고라스 정리로 구한 뒤, 넓이와 반둘레의 관계를 이용해요.",
      solution: ["길이 14인 변에 꼭짓점에서 수선을 내립니다. 밑변의 한쪽 조각을 x라 하면 x²+h²=13², (14−x)²+h²=15²입니다.", "두 식을 빼면 196−28x=56이므로 x=5이고, h=12입니다. 삼각형 넓이는 14×12÷2=84입니다.", "반둘레는 (13+14+15)÷2=21입니다. 넓이=내접원 반지름×반둘레이므로 반지름은 84÷21=4입니다."],
      connection: "삼각형의 넓이와 반둘레가 주어졌을 때 내접원 반지름을 바로 구할 수 있는 이유를 그림으로 설명해 보세요."
    }
  ];

  const domains = Object.freeze(["대수", "정수론", "기하", "경우의 수"]);
  const stages = Object.freeze(["개념", "유형", "연결"]);
  root.GFIELDAimeConceptPractice = Object.freeze({
    title: "AIME형 풀이 연습",
    responseRange: Object.freeze([0, 999]),
    sourceUrl: "https://maa.org/maa-invitational-competitions/",
    domains: domains,
    stages: stages,
    items: Object.freeze(items.map(function (entry) { return Object.freeze(entry); }))
  });
})(typeof window !== "undefined" ? window : globalThis);
