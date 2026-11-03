(function (root) {
  "use strict";

  const items = [
    {
      id: "amc10-g7-algebra-01", domain: "대수", stage: "개념", title: "괄호와 동류항을 차례로 정리하기",
      prompt: "x = 5일 때 3(2x − 1) − 2(x + 4)의 값은 얼마인가요?",
      choices: [9, 3, 7, 11, 13], answer: 0,
      hint: "먼저 각 괄호에 바깥 수를 곱한 뒤, x에 5를 대입해요.",
      solution: ["3(2x − 1) − 2(x + 4) = 6x − 3 − 2x − 8", "= 4x − 11", "x = 5를 대입하면 4 × 5 − 11 = 9입니다."],
      connection: "분배법칙을 쓴 뒤 동류항을 모으면 식의 구조가 어떻게 바뀌나요?"
    },
    {
      id: "amc10-g7-algebra-02", domain: "대수", stage: "연결", title: "두 조건을 연립해 상황을 식으로 나타내기",
      prompt: "성인 표는 8달러, 어린이 표는 5달러입니다. 표를 모두 19장 팔아 122달러를 받았습니다. 성인 표는 몇 장 팔았나요?",
      choices: [7, 9, 8, 10, 11], answer: 1,
      hint: "성인 표 수를 a라고 하면 어린이 표 수는 19 − a예요.",
      solution: ["성인 표 수를 a라 두면 8a + 5(19 − a) = 122입니다.", "3a + 95 = 122이므로 3a = 27입니다.", "a = 9이므로 성인 표는 9장입니다."],
      connection: "표 한 장을 성인 표로 바꿀 때 총액은 얼마씩 늘어나나요?"
    },
    {
      id: "amc10-g7-algebra-03", domain: "대수", stage: "연결", title: "곱셈 구조를 이용해 계산 줄이기",
      prompt: "a + b = 12이고 ab = 27입니다. (a − 3)(b − 3)의 값은 얼마인가요?",
      choices: [-6, -3, 0, 3, 6], answer: 2,
      hint: "두 괄호를 전개한 다음 a + b와 ab를 한꺼번에 대입해요.",
      solution: ["(a − 3)(b − 3) = ab − 3a − 3b + 9입니다.", "ab − 3(a + b) + 9 = 27 − 3 × 12 + 9입니다.", "27 − 36 + 9 = 0입니다."],
      connection: "a와 b를 각각 구하지 않고도 답을 구할 수 있었던 이유는 무엇인가요?"
    },
    {
      id: "amc10-g7-number-01", domain: "정수론", stage: "개념", title: "나머지 조건을 함께 만족하는 수 찾기",
      prompt: "3으로 나누면 나머지가 2이고 5로 나누면 나머지가 4인 가장 작은 양의 정수는 무엇인가요?",
      choices: [4, 9, 19, 14, 29], answer: 3,
      hint: "5로 나누어 나머지가 4인 수를 작은 것부터 적고, 3으로 나눈 나머지를 살펴봐요.",
      solution: ["5로 나누어 나머지가 4인 양의 정수는 4, 9, 14, 19, …입니다.", "이 가운데 3으로 나누어 나머지가 2인 첫 수는 14입니다."],
      connection: "조건 하나만 사용하면 후보가 어떻게 늘어나나요? 두 번째 조건은 후보를 어떻게 줄이나요?"
    },
    {
      id: "amc10-g7-number-02", domain: "정수론", stage: "연결", title: "소인수분해로 약수의 개수 세기",
      prompt: "360의 양의 약수는 모두 몇 개인가요?",
      choices: [12, 18, 20, 30, 24], answer: 4,
      hint: "360을 소인수의 거듭제곱 곱으로 나타내요.",
      solution: ["360 = 2³ × 3² × 5입니다.", "약수를 만들 때 2의 지수는 0, 1, 2, 3 중 하나, 3의 지수는 0, 1, 2 중 하나, 5의 지수는 0, 1 중 하나입니다.", "따라서 약수의 개수는 4 × 3 × 2 = 24입니다."],
      connection: "소인수의 지수가 하나 늘어날 때 약수의 선택 수에는 어떤 변화가 생기나요?"
    },
    {
      id: "amc10-g7-number-03", domain: "정수론", stage: "혼합", title: "거듭제곱의 일의 자리 주기 찾기",
      prompt: "7²⁰²⁶의 일의 자리 숫자는 무엇인가요?",
      choices: [1, 3, 9, 7, 6], answer: 2,
      hint: "7의 거듭제곱을 몇 개 적어 일의 자리의 반복을 찾아요.",
      solution: ["일의 자리는 7, 9, 3, 1을 반복합니다.", "반복 주기는 4이고 2026을 4로 나눈 나머지는 2입니다.", "따라서 두 번째 자리인 9가 일의 자리입니다."],
      connection: "지수가 2026 대신 2027이라면 주기의 어느 자리를 사용하나요?"
    },
    {
      id: "amc10-g7-geometry-01", domain: "기하", stage: "개념", title: "둘레가 정해진 직사각형의 넓이 비교",
      prompt: "둘레가 40인 직사각형 중 넓이가 가장 큰 도형의 넓이는 얼마인가요? 변의 길이는 양의 실수입니다.",
      choices: [80, 96, 99, 100, 120], answer: 3,
      hint: "가로와 세로의 합은 20입니다. 합이 같은 두 수의 곱은 두 수가 같을 때 가장 커요.",
      solution: ["가로를 x, 세로를 y라 하면 2x + 2y = 40이므로 x + y = 20입니다.", "합이 20인 양수 두 수의 곱 xy는 x = y = 10일 때 가장 큽니다.", "최대 넓이는 10 × 10 = 100입니다."],
      connection: "둘레가 같을 때 정사각형이 최대 넓이를 갖는다는 사실을 어떻게 설명할 수 있나요?"
    },
    {
      id: "amc10-g7-geometry-02", domain: "기하", stage: "연결", title: "정사각형 안의 중점 연결 도형",
      prompt: "한 변의 길이가 8인 정사각형에서 네 변의 중점을 차례로 이었습니다. 안쪽 마름모의 넓이는 얼마인가요?",
      choices: [32, 16, 24, 40, 48], answer: 0,
      hint: "마름모의 두 대각선은 바깥 정사각형의 가로와 세로 길이와 같아요.",
      solution: ["마름모의 두 대각선은 각각 8입니다.", "마름모의 넓이는 대각선의 곱을 2로 나눈 값입니다.", "8 × 8 ÷ 2 = 32입니다."],
      connection: "정사각형을 네 모서리 삼각형으로 나누어도 같은 넓이를 확인할 수 있나요?"
    },
    {
      id: "amc10-g7-geometry-03", domain: "기하", stage: "혼합", title: "닮음비를 넓이로 연결하기",
      prompt: "넓이가 6인 삼각형과 닮은 큰 삼각형의 대응하는 변의 길이는 3배입니다. 큰 삼각형의 넓이는 얼마인가요?",
      choices: [18, 54, 36, 48, 72], answer: 1,
      hint: "변의 길이가 3배가 되면 넓이는 몇 배가 되는지 생각해요.",
      solution: ["닮은 도형의 넓이는 대응하는 길이의 비를 제곱한 비율로 변합니다.", "넓이의 비는 3² = 9입니다.", "큰 삼각형의 넓이는 6 × 9 = 54입니다."],
      connection: "길이의 비와 넓이의 비가 같지 않은 이유를 작은 정사각형 격자로 설명해 보세요."
    },
    {
      id: "amc10-g7-counting-01", domain: "경우의 수", stage: "연결", title: "붙어 있는 경우를 빼서 세기",
      prompt: "서로 다른 책 5권을 한 줄로 놓습니다. 두 권 A와 B가 서로 붙어 있지 않게 놓는 방법은 몇 가지인가요?",
      choices: [24, 48, 60, 96, 72], answer: 4,
      hint: "전체 배열에서 A와 B를 한 묶음으로 보는 배열 수를 빼요.",
      solution: ["전체 배열은 5! = 120가지입니다.", "A와 B가 붙어 있으면 두 책을 한 묶음으로 보아 4! × 2 = 48가지입니다.", "붙어 있지 않은 배열은 120 − 48 = 72가지입니다."],
      connection: "A와 B가 붙어 있는 배열에서 ×2가 필요한 이유는 무엇인가요?"
    },
    {
      id: "amc10-g7-counting-02", domain: "경우의 수", stage: "혼합", title: "끝 두 자리부터 나누어 세기",
      prompt: "숫자 1, 2, 3, 4를 한 번씩 써서 네 자리 수를 만듭니다. 4의 배수인 수는 몇 개인가요?",
      choices: [4, 8, 6, 12, 16], answer: 2,
      hint: "4의 배수인지는 끝 두 자리로 판단할 수 있어요. 가능한 끝 두 자리를 먼저 찾으세요.",
      solution: ["사용할 수 있는 숫자로 만든 끝 두 자리가 4의 배수인 경우는 12, 24, 32입니다.", "끝 두 자리를 하나 정하면 남은 두 숫자는 앞 두 자리에 2가지 순서로 놓입니다.", "3 × 2 = 6가지입니다."],
      connection: "끝 두 자리로 나누어 세면 같은 수를 두 번 세지 않는 이유는 무엇인가요?"
    },
    {
      id: "amc10-g7-probability-01", domain: "확률", stage: "개념", title: "비복원 추출에서 같은 색이 나올 확률",
      prompt: "빨간 구슬 3개와 파란 구슬 2개가 있습니다. 구슬 두 개를 차례로 꺼내고 다시 넣지 않을 때, 두 구슬의 색이 같을 확률은 얼마인가요?",
      choices: ["1/5", "3/5", "1/2", "2/5", "4/5"], answer: 3,
      hint: "빨강 둘인 경우와 파랑 둘인 경우를 각각 세고, 가능한 두 구슬 조합 전체로 나누어요.",
      solution: ["전체 두 구슬 조합은 5개 중 2개를 고르는 10가지입니다.", "빨간 구슬 둘은 3가지, 파란 구슬 둘은 1가지이므로 같은 색인 경우는 4가지입니다.", "확률은 4/10 = 2/5입니다."],
      connection: "같은 색을 두 번 연속 뽑을 확률을 곱셈으로 계산해도 같은 답이 나오는지 확인해 보세요."
    }
  ];

  const domains = ["대수", "정수론", "기하", "경우의 수", "확률"];
  root.GFIELDAMC10ConceptPractice = Object.freeze({
    title: "AMC 10 개념 연결 연습",
    scope: "elementary algebra, basic geometry, area and volume, elementary number theory, and elementary probability",
    sourceUrl: "https://maa.org/student-programs/amc/",
    domains: Object.freeze(domains),
    items: Object.freeze(items.map(function (entry) { return Object.freeze(Object.assign({}, entry, { choices: Object.freeze(entry.choices), solution: Object.freeze(entry.solution) })); }))
  });
})(typeof window !== "undefined" ? window : globalThis);
