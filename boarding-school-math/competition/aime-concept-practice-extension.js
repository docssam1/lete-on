(function (root) {
  "use strict";

  // Additional original GFIELD practice linked from source-item concept tags.
  const items = [
    {
      id: "aime-core-coordinate-01", sourceConcepts: ["coordinate-geometry", "triangle-area"], domain: "기하", stage: "유형", title: "좌표로 삼각형 넓이 계산하기",
      prompt: "좌표평면의 점 A(0, 0), B(8, 0), C(3, 6)이 꼭짓점인 삼각형 ABC의 넓이는 얼마인가요?", answer: 24,
      hint: "AB를 밑변으로 잡고 C에서 x축까지의 높이를 확인해요.", solution: ["AB의 길이는 8이고, 점 C의 y좌표가 6이므로 높이는 6입니다.", "삼각형 넓이는 1/2 × 8 × 6 = 24입니다."], connection: "꼭짓점 C를 같은 높이의 수평선 위에서 옮기면 넓이는 어떻게 되나요?"
    },
    {
      id: "aime-core-system-01", sourceConcepts: ["system-of-equations", "substitution", "algebraic-manipulation"], domain: "대수", stage: "연결", title: "두 대칭 조건으로 제곱의 합 구하기",
      prompt: "실수 x, y가 x + y = 10, xy = 21을 만족합니다. x² + y²의 값은 얼마인가요?", answer: 58,
      hint: "(x + y)²을 전개해 x² + y²와 xy를 연결해요.", solution: ["(x + y)² = x² + 2xy + y²입니다.", "100 = x² + y² + 42이므로 x² + y² = 58입니다."], connection: "x와 y를 각각 구한 뒤에도 같은 결과가 나오는지 확인해 보세요."
    },
    {
      id: "aime-core-trig-identity-01", sourceConcepts: ["trigonometric-identity", "trigonometry"], domain: "대수", stage: "개념", title: "삼각함수 합의 제곱 정리하기",
      prompt: "sin θ cos θ = 3/10일 때, 10(sin θ + cos θ)²의 값은 얼마인가요?", answer: 16,
      hint: "(sin θ + cos θ)²에서 sin² θ + cos² θ = 1을 이용해요.", solution: ["제곱을 전개하면 sin² θ + cos² θ + 2 sin θ cos θ입니다.", "이는 1 + 6/10 = 8/5이므로, 10을 곱한 값은 16입니다."], connection: "sin θ cos θ만으로 sin θ + cos θ의 부호까지 정할 수 있나요?"
    },
    {
      id: "aime-core-optimization-01", sourceConcepts: ["optimization", "inequality", "casework"], domain: "정수론", stage: "유형", title: "합이 고정된 정수의 곱 최댓값 찾기",
      prompt: "서로 다른 양의 정수 x, y의 합이 20입니다. xy의 최댓값은 얼마인가요?", answer: 99,
      hint: "합이 같은 두 정수는 서로 가까울수록 곱이 커집니다. 단, 두 수는 달라야 해요.", solution: ["20에 가장 가까운 서로 다른 양의 정수 쌍은 9와 11입니다.", "따라서 가능한 최대 곱은 9 × 11 = 99입니다."], connection: "두 수가 같아도 되는 경우와 비교해 최댓값이 얼마나 달라지나요?"
    },
    {
      id: "aime-core-complex-01", sourceConcepts: ["complex-number", "algebraic-manipulation"], domain: "대수", stage: "개념", title: "켤레복소수의 곱 계산하기",
      prompt: "i² = −1일 때 (2 + i)(2 − i)의 값은 얼마인가요?", answer: 5,
      hint: "(a + b)(a − b) 꼴로 묶어요.", solution: ["(2 + i)(2 − i) = 2² − i²입니다.", "i² = −1이므로 값은 4 − (−1) = 5입니다."], connection: "켤레복소수끼리 곱했을 때 허수부가 사라지는 이유를 전개로 설명해 보세요."
    },
    {
      id: "aime-core-logarithm-01", sourceConcepts: ["logarithm", "quadratic", "factoring"], domain: "대수", stage: "유형", title: "로그 방정식의 해와 정의역 확인하기",
      prompt: "log₂ x + log₂(x − 2) = 3을 만족하는 실수 x는 얼마인가요?", answer: 4,
      hint: "두 진수가 양수여야 한다는 조건을 먼저 적은 뒤 로그를 합쳐요.", solution: ["정의역에서 x > 2입니다.", "로그의 합을 곱으로 바꾸면 x(x − 2) = 8입니다.", "이차방정식의 근은 4와 −2이며, 정의역을 만족하는 해는 4입니다."], connection: "구한 대수적 근을 원래 로그 방정식에 다시 확인해야 하는 까닭은 무엇인가요?"
    },
    {
      id: "aime-core-probability-01", sourceConcepts: ["basic-probability", "combinations", "casework"], domain: "경우의 수", stage: "개념", title: "같은 색 구슬 두 개를 고르는 경우 세기",
      prompt: "빨간 구슬 5개와 파란 구슬 3개에서 구슬 2개를 동시에 고릅니다. 두 구슬의 색이 같도록 고르는 방법은 몇 가지인가요?", answer: 13,
      hint: "빨간 구슬끼리 고르는 경우와 파란 구슬끼리 고르는 경우를 더해요.", solution: ["빨간 구슬 5개 중 2개를 고르는 방법은 10가지입니다.", "파란 구슬 3개 중 2개를 고르는 방법은 3가지입니다.", "같은 색인 경우는 서로 겹치지 않으므로 10 + 3 = 13가지입니다."], connection: "전체 선택 수로 나누면 같은 색이 나올 확률은 얼마인가요?"
    },
    {
      id: "aime-core-similarity-01", sourceConcepts: ["similarity", "area-ratio", "triangle-area"], domain: "기하", stage: "연결", title: "닮음비로 작은 도형의 넓이 찾기",
      prompt: "닮은 두 삼각형에서 작은 삼각형과 큰 삼각형의 대응변 비는 3:5입니다. 큰 삼각형의 넓이가 100cm²라면 두 넓이의 차는 얼마인가요?", answer: 64,
      hint: "넓이의 비는 변의 비를 제곱한 비율입니다.", solution: ["넓이 비는 9:25입니다.", "큰 삼각형 100cm²는 25부분이므로 한 부분은 4cm²입니다.", "작은 삼각형은 36cm²이고 차이는 100 − 36 = 64cm²입니다."], connection: "길이의 비를 그대로 넓이의 비에 사용하면 어떤 오류가 생기나요?"
    },
    {
      id: "aime-core-diophantine-01", sourceConcepts: ["diophantine-equation", "casework", "divisibility"], domain: "정수론", stage: "유형", title: "정수 조건을 만족하는 해의 수 세기",
      prompt: "양의 정수 x, y가 2x + 3y = 24를 만족합니다. 가능한 순서쌍 (x, y)는 몇 개 있나요?", answer: 3,
      hint: "y가 양의 정수일 때 24 − 3y가 양수이고 짝수인 경우를 찾아요.", solution: ["x = (24 − 3y)/2이므로 y는 짝수여야 합니다.", "양수인 x를 얻는 짝수 y는 2, 4, 6입니다.", "각각 x = 9, 6, 3이므로 순서쌍은 3개입니다."], connection: "x, y에 음이 아닌 정수를 허용하면 해의 개수는 어떻게 바뀌나요?"
    },
    {
      id: "aime-core-quadratic-01", sourceConcepts: ["quadratic", "vietas-formulas", "algebraic-manipulation"], domain: "대수", stage: "연결", title: "이차방정식의 두 근 차 제곱 구하기",
      prompt: "t² − 6t + 1 = 0의 두 근을 r, s라 할 때 (r − s)²의 값은 얼마인가요?", answer: 32,
      hint: "(r − s)² = (r + s)² − 4rs를 사용해요.", solution: ["근과 계수의 관계에서 r + s = 6, rs = 1입니다.", "(r − s)² = (r + s)² − 4rs = 36 − 4 = 32입니다."], connection: "두 근을 직접 구하는 방법과 근과 계수의 관계를 이용하는 방법을 비교해 보세요."
    },
    {
      id: "aime-core-recursion-01", sourceConcepts: ["recursion", "exponent"], domain: "대수", stage: "유형", title: "점화식의 반복을 닫힌 식으로 바꾸기",
      prompt: "수열이 a₁ = 1, aₙ₊₁ = 2aₙ + 1로 정의됩니다. a₈은 얼마인가요?", answer: 255,
      hint: "처음 몇 항에서 aₙ + 1이 어떤 거듭제곱인지 확인해요.", solution: ["첫 항부터 1, 3, 7, 15, …입니다.", "aₙ₊₁ + 1 = 2(aₙ + 1)이므로 aₙ + 1 = 2ⁿ입니다.", "따라서 a₈ = 2⁸ − 1 = 255입니다."], connection: "점화식에서 2 대신 3을 곱하고 1을 더하면 일반항은 어떻게 달라지나요?"
    },
    {
      id: "aime-core-symmetry-01", sourceConcepts: ["symmetry", "casework", "combinations"], domain: "경우의 수", stage: "연결", title: "회전으로 같은 정사각형 색칠 묶기",
      prompt: "정사각형의 네 꼭짓점을 빨강 또는 파랑으로 색칠합니다. 정사각형을 회전해 같아지는 색칠은 같은 것으로 볼 때 서로 다른 색칠은 몇 가지인가요?", answer: 6,
      hint: "0°, 90°, 180°, 270° 회전에서 각각 그대로 유지되는 색칠 수를 세어요.", solution: ["회전하지 않으면 2⁴ = 16가지입니다.", "90°와 270° 회전에서 유지되는 색칠은 2가지씩, 180° 회전에서는 마주 보는 두 쌍이 같도록 색칠하는 4가지입니다.", "회전 대칭 평균은 (16 + 2 + 4 + 2) ÷ 4 = 6가지입니다."], connection: "뒤집기도 같은 것으로 취급하면 어떤 변환을 더 고려해야 하나요?"
    },
    {
      id: "aime-core-cosine-01", sourceConcepts: ["law-of-cosines", "trigonometry", "triangle-area"], domain: "기하", stage: "연결", title: "코사인 법칙으로 세 번째 변 계산하기",
      prompt: "두 변의 길이가 5와 7이고 그 끼인각이 60°인 삼각형에서 나머지 한 변 길이의 제곱은 얼마인가요?", answer: 39,
      hint: "코사인 법칙에서 cos 60° = 1/2를 대입해요.", solution: ["코사인 법칙에 따라 c² = 5² + 7² − 2 × 5 × 7 × cos 60°입니다.", "cos 60° = 1/2이므로 c² = 25 + 49 − 35 = 39입니다."], connection: "끼인각이 90°라면 코사인 법칙은 피타고라스 정리와 어떻게 연결되나요?"
    },
    {
      id: "aime-core-3d-geometry-01", sourceConcepts: ["3d-geometry", "pythagorean-theorem"], domain: "기하", stage: "개념", title: "정육면체 공간 대각선의 제곱 구하기",
      prompt: "한 변의 길이가 6인 정육면체의 공간 대각선 길이의 제곱은 얼마인가요?", answer: 108,
      hint: "먼저 한 면의 대각선을 구하고, 그 대각선과 높이로 직각삼각형을 만들어요.", solution: ["면 대각선의 제곱은 6² + 6² = 72입니다.", "공간 대각선 d는 d² = 72 + 6²을 만족합니다.", "따라서 d² = 108입니다."], connection: "한 변을 k로 바꾸면 공간 대각선의 제곱은 어떤 식이 되나요?"
    },
    {
      id: "aime-core-arithmetic-sequence-01", sourceConcepts: ["arithmetic-sequence"], domain: "대수", stage: "개념", title: "등차수열의 첫 항과 끝 항 짝짓기",
      prompt: "1 + 3 + 5 + … + 31의 값은 얼마인가요?", answer: 256,
      hint: "항의 개수를 구한 뒤 첫 항과 마지막 항의 평균을 곱해요.", solution: ["공차는 2이고 31 = 1 + 2(n − 1)이므로 항은 16개입니다.", "합은 16 × (1 + 31)/2 = 256입니다."], connection: "처음과 끝에서부터 두 항씩 짝지으면 같은 합이 몇 번 나오나요?"
    },
    {
      id: "aime-core-geometric-sequence-01", sourceConcepts: ["geometric-sequence", "exponent"], domain: "대수", stage: "유형", title: "등비수열의 유한합 계산하기",
      prompt: "2 + 6 + 18 + 54 + 162의 값은 얼마인가요?", answer: 242,
      hint: "항을 차례로 더하거나 등비수열의 공비를 확인해요.", solution: ["첫 항은 2이고 공비는 3입니다.", "2 + 6 + 18 + 54 + 162 = 242입니다."], connection: "항을 하나 더 추가하면 합이 얼마나 증가하나요?"
    }
  ];

  root.GFIELDAimeConceptPracticeExtension = Object.freeze({
    items: Object.freeze(items.map(function (item) {
      return Object.freeze(Object.assign({}, item, {
        sourceConcepts: Object.freeze(item.sourceConcepts),
        solution: Object.freeze(item.solution)
      }));
    }))
  });
})(typeof window !== "undefined" ? window : globalThis);
