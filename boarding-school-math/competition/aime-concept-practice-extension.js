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
    },
    {
      id: "aime-gap-recursive-counting-01", sourceConcepts: ["recursive-counting", "subsets", "combinations"], domain: "경우의 수", stage: "연결", title: "점화식으로 이웃하지 않는 부분집합 세기",
      prompt: "집합 {1, 2, …, 8}의 부분집합 중 연속한 두 정수를 함께 포함하지 않는 것은 몇 개인가요? 빈 집합도 셉니다.", answer: 55,
      hint: "8을 포함하는 경우와 포함하지 않는 경우를 나누어 n개의 수에 대한 점화식을 세워요.",
      solution: ["aₙ을 {1, …, n}에서 연속한 두 수를 함께 고르지 않는 부분집합 수라고 해요.", "n을 고르지 않으면 aₙ₋₁가지, n을 고르면 n−1은 고를 수 없어 aₙ₋₂가지이므로 aₙ = aₙ₋₁ + aₙ₋₂입니다.", "a₀ = 1, a₁ = 2에서 차례로 계산하면 a₂ = 3, a₃ = 5, …, a₈ = 55입니다."],
      connection: "연속한 세 수를 함께 고르지 않는 조건으로 바꾸면 어떤 이전 항들이 필요할까요?"
    },
    {
      id: "aime-gap-integer-range-01", sourceConcepts: ["counting-integers-in-a-range", "divisibility", "prime-factorization"], domain: "정수론", stage: "유형", title: "제곱이 12의 배수인 정수 개수 세기",
      prompt: "1 이상 1000 이하의 정수 n 중 n²이 12의 배수인 것은 몇 개인가요?", answer: 166,
      hint: "12 = 2² × 3으로 소인수분해하고 n에 필요한 인수 조건을 구해요.",
      solution: ["12 = 2² × 3입니다. n²이 2²의 배수이려면 n은 짝수이고, n²이 3의 배수이려면 n은 3의 배수여야 합니다.", "따라서 조건은 6의 배수인 n을 세는 것과 같습니다.", "1부터 1000까지 6의 배수는 ⌊1000/6⌋ = 166개입니다."],
      connection: "n²이 72의 배수가 되도록 조건을 바꾸면 n은 어떤 수의 배수여야 하나요?"
    },
    {
      id: "aime-gap-difference-squares-01", sourceConcepts: ["difference-of-squares", "factoring", "counting-integers-in-a-range"], domain: "정수론", stage: "유형", title: "두 제곱수의 차를 인수쌍으로 바꾸기",
      prompt: "양의 정수 x > y가 x² − y² = 45를 만족합니다. 가능한 순서쌍 (x, y)는 몇 개인가요?", answer: 3,
      hint: "x² − y²를 두 인수의 곱으로 나타내고 45의 인수쌍을 찾아요.",
      solution: ["(x − y)(x + y) = 45입니다. 두 인수는 홀수이고 첫 인수가 둘째 인수보다 작습니다.", "가능한 양의 홀수 인수쌍은 (1,45), (3,15), (5,9)입니다.", "각 쌍에서 x와 y는 양의 정수로 정해지므로 가능한 순서쌍은 3개입니다."],
      connection: "45가 짝수였다면 x − y와 x + y의 홀짝 관계는 어떻게 달라질까요?"
    },
    {
      id: "aime-gap-parity-subsets-01", sourceConcepts: ["parity", "subsets", "casework"], domain: "경우의 수", stage: "개념 연결", title: "부분집합 합의 홀짝 균형 세기",
      prompt: "집합 {1, 2, …, 8}의 부분집합 중 원소의 합이 홀수인 것은 몇 개인가요?", answer: 128,
      hint: "홀수 1을 포함하거나 빼는 짝짓기가 합의 홀짝을 어떻게 바꾸는지 살펴봐요.",
      solution: ["모든 부분집합은 1을 포함한 쌍과 1을 포함하지 않은 쌍으로 짝지을 수 있습니다.", "한 쌍에서는 1을 넣고 빼는 차이만 있으므로 두 부분집합의 합 홀짝이 서로 다릅니다.", "전체 2⁸ = 256개 중 정확히 절반인 128개가 홀수 합입니다."],
      connection: "집합에 홀수가 하나 이상 있다는 조건이 절반씩 나뉘는 이유에 꼭 필요한가요?"
    },
    {
      id: "aime-gap-small-subsets-01", sourceConcepts: ["subsets", "combinations", "basic-counting"], domain: "경우의 수", stage: "개념", title: "크기가 작은 부분집합 세기",
      prompt: "원소가 8개인 집합에서 크기가 2 이하인 부분집합은 모두 몇 개인가요?", answer: 37,
      hint: "크기가 0, 1, 2인 경우를 각각 세어 더해요.",
      solution: ["크기 0인 부분집합은 1개입니다.", "크기 1은 8개이고 크기 2는 8개 중 2개를 고르는 C(8,2) = 28개입니다.", "모두 1 + 8 + 28 = 37개입니다."],
      connection: "크기가 3 이하로 바뀌면 어떤 항을 더해야 하나요?"
    },
    {
      id: "aime-gap-summation-01", sourceConcepts: ["summation", "arithmetic-sequence", "polynomial"], domain: "대수", stage: "연결", title: "곱의 합을 제곱합 공식으로 계산하기",
      prompt: "1×2 + 2×3 + 3×4 + ··· + 10×11의 값은 얼마인가요?", answer: 440,
      hint: "k(k + 1)을 k² + k로 나누어 제곱합과 등차수열의 합을 사용해요.",
      solution: ["합은 Σ(k² + k), k = 1부터 10까지입니다.", "제곱합은 10×11×21/6 = 385이고, 1부터 10까지의 합은 55입니다.", "따라서 전체 합은 385 + 55 = 440입니다."],
      connection: "마지막 항을 n(n + 1)로 바꾸면 합을 n에 대한 식으로 쓸 수 있나요?"
    },
    {
      id: "aime-gap-vector-dot-product-01", sourceConcepts: ["vector", "algebraic-manipulation"], domain: "기하", stage: "연결", title: "벡터의 길이로 내적 구하기",
      prompt: "두 벡터 u, v에 대하여 |u| = 5, |v| = 13, |u + v| = 16입니다. |2u − v|²의 값을 구하세요.", answer: 145,
      hint: "|u + v|²을 전개하면 u·v를 구할 수 있어요.",
      solution: ["|u + v|² = |u|² + 2u·v + |v|²이므로 256 = 25 + 2u·v + 169입니다. 따라서 u·v = 31입니다.", "|2u − v|² = 4|u|² − 4u·v + |v|²입니다.", "값은 4 × 25 − 4 × 31 + 169 = 145입니다."],
      connection: "u와 v가 이루는 각의 코사인을 구하려면 내적에 어떤 관계식을 더 적용하면 되나요?"
    },
    {
      id: "aime-gap-restricted-arrangements-01", sourceConcepts: ["arrangements-with-restrictions", "multiplication-principle", "inclusion-exclusion"], domain: "경우의 수", stage: "유형", title: "서로 붙고 끝자리를 피하는 배열 세기",
      prompt: "서로 다른 여섯 글자 A, B, C, D, E, F를 한 줄로 배열합니다. C와 D는 이웃해야 하고, A는 첫 자리에, B는 마지막 자리에 오면 안 됩니다. 가능한 배열은 몇 개인가요?", answer: 156,
      hint: "C와 D를 하나의 묶음으로 세고, A가 첫 자리이거나 B가 마지막 자리인 경우를 포함·배제로 빼요.",
      solution: ["C와 D의 묶음은 CD 또는 DC 두 가지입니다. 묶음, A, B, E, F 다섯 대상을 배열하는 방법은 2 × 5! = 240입니다.", "A가 첫 자리인 배열은 2 × 4! = 48개이고, B가 마지막 자리인 배열도 48개입니다.", "두 조건을 모두 어기는 배열은 2 × 3! = 12개이므로 포함·배제로 240 − 48 − 48 + 12 = 156개입니다."],
      connection: "A가 첫 자리이고 B가 마지막 자리인 배열을 두 번 더한 셈이므로 한 번 다시 더하는 이유는 무엇인가요?"
    },
    {
      id: "aime-gap-floor-sum-01", sourceConcepts: ["floor-and-ceiling-functions", "bounding-to-limit-cases", "counting-integers-in-a-range"], domain: "정수론", stage: "연결", title: "바닥 함수 합의 가능한 정수 범위 좁히기",
      prompt: "양의 정수 n 중 ⌊n/2⌋ + ⌊n/3⌋ = 100을 만족하는 n은 몇 개인가요?", answer: 2,
      hint: "각 바닥 함수는 안의 수 이하이고 1보다 큰 수만큼 작지는 않으므로 n의 범위를 먼저 좁혀요.",
      solution: ["100 ≤ n/2 + n/3 = 5n/6이므로 n ≥ 120입니다.", "또 ⌊n/2⌋ + ⌊n/3⌋ > 5n/6 − 2입니다. 합이 100이므로 n < 122.4이고, 따라서 n ≤ 122입니다.", "n은 120, 121, 122만 확인하면 됩니다. 두 바닥 함수의 합은 각각 100, 100, 101이므로 가능한 n은 2개입니다."],
      connection: "바닥 함수 두 개 대신 천장 함수가 들어가면 같은 방식의 위·아래 경계가 어떻게 바뀌나요?"
    },
    {
      id: "aime-gap-square-divisibility-01", sourceConcepts: ["perfect-square", "prime-factorization", "divisibility", "factor-counting"], domain: "정수론", stage: "유형", title: "제곱수의 약수 조건으로 배수 세기",
      prompt: "1보다 크고 10,000보다 작은 양의 정수 n 중 n²이 360으로 나누어떨어지는 n은 모두 몇 개인가요?", answer: 166,
      hint: "360을 소인수분해하고, n²에 필요한 각 소인수 지수가 되려면 n이 무엇의 배수여야 하는지 구해요.",
      solution: ["360 = 2³ × 3² × 5입니다.", "n²이 360으로 나누어떨어지려면 n에는 2², 3, 5가 각각 적어도 한 번씩 있어야 하므로 n은 60의 배수여야 합니다.", "1 ≤ n < 10,000인 60의 배수 개수는 ⌊9999/60⌋ = 166개입니다."],
      connection: "360 대신 720으로 나누어떨어져야 하면 n의 소인수 조건 중 무엇이 달라지나요?"
    },
    {
      id: "aime-gap-number-base-01", sourceConcepts: ["number-base", "place-value", "quadratic"], domain: "정수론", stage: "연결", title: "진법 표기를 십진수 식으로 바꾸기",
      prompt: "밑이 b인 수 143_b의 값이 십진수로 63입니다. 밑 b는 얼마인가요?",
      answer: 6,
      hint: "143_b를 b² + 4b + 3으로 쓰고, 숫자 4가 쓰일 수 있는 밑의 조건도 확인해요.",
      solution: ["143_b = b² + 4b + 3이므로 b² + 4b + 3 = 63입니다.", "정리하면 b² + 4b − 60 = 0이고, (b + 10)(b − 6) = 0입니다.", "밑은 양의 정수이며 숫자 4보다 커야 하므로 b=6입니다."],
      connection: "수 213_b를 십진수로 나타낼 때 각 자리의 가중치는 무엇인가요?"
    },
    {
      id: "aime-gap-common-internal-tangent-01", sourceConcepts: ["tangent-circles", "pythagorean-theorem", "circle"], domain: "기하", stage: "유형", title: "두 원의 공통 내접선 길이 구하기",
      prompt: "반지름이 2와 3인 서로 만나지 않는 두 원의 중심 사이 거리는 13입니다. 공통 내접선이 두 원에 닿는 점 사이의 길이를 구하세요.",
      answer: 12,
      hint: "두 중심을 잇는 선분과 두 반지름의 합이 직각삼각형의 빗변과 한 변을 이룹니다.",
      solution: ["공통 내접선의 접점과 두 중심으로 직각삼각형을 만들면 중심 사이 거리가 빗변 13입니다.", "두 원의 중심에서 접선까지의 수직 거리 차는 반지름의 합 2+3=5입니다.", "접점 사이 길이를 x라 하면 x²+5²=13²이므로 x²=144, x=12입니다."],
      connection: "공통 외접선으로 바꾸면 직각삼각형의 반지름 관련 변은 합과 차 중 무엇이 되나요?"
    },
    {
      id: "aime-gap-complement-adjacent-bits-01", sourceConcepts: ["complementary-counting", "recursive-counting"], domain: "경우의 수", stage: "연결", title: "여러 조건을 여집합과 점화식으로 세기",
      prompt: "길이가 8인 0과 1의 수열 중 이웃한 두 항이 모두 1인 곳이 적어도 한 군데 있는 수열은 몇 개인가요?",
      answer: 201,
      hint: "전체 수열에서 이웃한 두 1이 없는 수열을 빼고, 그 개수는 길이에 대한 점화식으로 세어요.",
      solution: ["길이 8인 이진 수열은 모두 2⁸=256개입니다.", "이웃한 두 1이 없는 길이 n 수열 수를 aₙ이라 하겠습니다. 첫 자리가 0이면 aₙ₋₁가지, 첫 자리가 1이면 다음 자리는 0으로 고정되어 aₙ₋₂가지이므로 aₙ=aₙ₋₁+aₙ₋₂입니다.", "a₀=1, a₁=2에서 계산하면 a₈=55입니다. 따라서 적어도 한 쌍의 이웃한 1이 있는 수열은 256−55=201개입니다."],
      connection: "수열 길이가 9로 늘면 전체 경우와 이웃한 1이 없는 경우는 각각 어떻게 바뀌나요?"
    },
    {
      id: "aime-gap-gcd-sum-pairs-01", sourceConcepts: ["greatest-common-divisor", "divisibility", "linear-equation"], domain: "정수론", stage: "유형", title: "최대공약수로 나누어 서로소인 쌍 세기",
      prompt: "최대공약수가 6이고 합이 60인 양의 정수 순서쌍 (a,b)는 몇 개 있나요? 순서가 바뀌면 다른 순서쌍으로 셉니다.",
      answer: 4,
      hint: "a=6x, b=6y로 놓으면 x+y=10이고 x와 y는 서로소여야 해요.",
      solution: ["a=6x, b=6y라 놓으면 x+y=10이고 gcd(x,y)=1입니다.", "y=10−x이므로 gcd(x,y)=gcd(x,10)입니다. 가능한 x는 1≤x≤9입니다.", "10과 서로소인 x는 1,3,7,9로 네 개이므로 순서쌍도 4개입니다."],
      connection: "합을 30으로 바꾸면 같은 최대공약수 조건을 만족하는 순서쌍은 몇 개인가요?"
    },
    {
      id: "aime-gap-cylinder-cone-volume-01", sourceConcepts: ["volume", "cylinder", "cone"], domain: "기하", stage: "유형", title: "원기둥과 원뿔의 부피 합 구하기",
      prompt: "반지름이 3이고 높이가 8인 원기둥과 원뿔이 있습니다. 두 입체의 부피의 합은 kπ입니다. k를 구하세요.",
      answer: 96,
      hint: "같은 반지름과 높이를 가진 원뿔의 부피는 원기둥 부피의 1/3이에요.",
      solution: ["원기둥의 부피는 π×3²×8=72π입니다.", "원뿔의 부피는 (1/3)π×3²×8=24π입니다.", "두 부피의 합은 96π이므로 k=96입니다."],
      connection: "두 입체의 높이를 모두 2배로 늘리면 부피의 합은 어떻게 변하나요?"
    },
    {
      id: "aime-gap-circle-tangent-equation-01", sourceConcepts: ["tangent-line", "circle", "pythagorean-theorem"], domain: "기하", stage: "연결", title: "접점의 반지름으로 접선의 식 구하기",
      prompt: "원 x²+y²=25 위의 점 (3,4)에서 그은 접선의 방정식을 Ax+By=25로 나타냅니다. A+B의 값을 구하세요.",
      answer: 7,
      hint: "원점에서 접점까지의 반지름은 접선에 수직인 법선입니다.",
      solution: ["원점에서 (3,4)까지의 반지름 벡터는 (3,4)입니다.", "접선은 점 (3,4)를 지나고 법선 벡터 (3,4)에 수직이므로 3(x−3)+4(y−4)=0입니다.", "정리하면 3x+4y=25이므로 A=3, B=4, A+B=7입니다."],
      connection: "원점을 중심으로 반지름이 r인 원에서 점 (u,v)가 원 위에 있다면 그 점에서 접선의 방정식은 어떻게 쓸 수 있나요?"
    },
    {
      id: "aime-gap-equilateral-area-coefficient-01", sourceConcepts: ["equilateral-triangle", "triangle-area", "pythagorean-theorem"], domain: "기하", stage: "유형", title: "정삼각형 넓이의 무리수 계수 구하기",
      prompt: "한 변의 길이가 14인 정삼각형의 넓이는 k√3입니다. k를 구하세요.",
      answer: 49,
      hint: "높이를 내리면 밑변이 7씩 나뉘고, 높이는 7√3이 됩니다.",
      solution: ["높이 h는 h²+7²=14²이므로 h²=147, h=7√3입니다.", "삼각형 넓이는 (1/2)×14×7√3=49√3입니다.", "따라서 k=49입니다."],
      connection: "한 변의 길이가 n인 정삼각형 넓이에서 √3의 계수는 n으로 어떻게 나타나나요?"
    },
    {
      id: "aime-gap-chord-distance-01", sourceConcepts: ["chord", "circle", "pythagorean-theorem"], domain: "기하", stage: "연결", title: "원의 중심에서 현까지 거리 구하기",
      prompt: "반지름이 13인 원에서 길이가 10인 현이 있습니다. 원의 중심에서 이 현까지의 거리를 구하세요.",
      answer: 12,
      hint: "중심에서 현에 수선을 내리면 현이 둘로 똑같이 나뉩니다.",
      solution: ["중심에서 현에 내린 수선은 현을 5와 5로 나눕니다.", "반지름 13이 빗변인 직각삼각형에서 중심과 현 사이 거리 d는 d²+5²=13²을 만족합니다.", "d²=144이므로 거리는 12입니다."],
      connection: "반지름과 현의 길이를 알면 현까지 거리를 항상 구할 수 있는 이유를 피타고라스 정리로 설명해 보세요."
    },
    {
      id: "aime-gap-extremal-largest-01", sourceConcepts: ["extremal-argument", "optimization", "inequality"], domain: "정수론", stage: "연결", title: "합 조건에서 가능한 최댓값의 하한 찾기",
      prompt: "서로 다른 양의 정수 6개의 합은 72입니다. 이 6개 중 가장 큰 수의 가능한 최솟값을 구하세요.",
      answer: 15,
      hint: "가장 큰 수가 14 이하라면 만들 수 있는 가장 큰 합은 어떤 여섯 수를 골랐을 때인가요?",
      solution: ["최댓값이 14 이하라면 서로 다른 양의 정수 여섯 개의 합은 최대 9+10+11+12+13+14=69입니다.", "69는 72보다 작으므로 최댓값은 적어도 15여야 합니다.", "최댓값 15는 실제로 가능해요. 8+10+12+13+14+15=72이므로 가능한 최솟값은 15입니다."],
      connection: "여섯 수의 합이 70이면 가능한 최댓값의 최솟값은 어떻게 달라지나요?"
    },
    {
      id: "aime-gap-permutation-adjacent-digits-01", sourceConcepts: ["permutations", "arrangements-with-restrictions", "multiplication-principle"], domain: "경우의 수", stage: "유형", title: "붙어야 하는 숫자를 묶어 배열하기",
      prompt: "숫자 0, 1, 2, 3, 4, 5를 한 번씩 사용해 여섯 자리 수를 만듭니다. 1과 2가 서로 이웃하는 수는 몇 개 있나요?",
      answer: 192,
      hint: "1과 2를 한 묶음으로 보고, 맨 앞자리가 0인 경우를 빼세요.",
      solution: ["1과 2의 묶음은 12 또는 21의 두 순서입니다. 묶음과 0,3,4,5를 배열하면 2×5!=240가지입니다.", "맨 앞자리가 0인 경우에는 나머지 네 대상(묶음,3,4,5)을 배열하므로 2×4!=48가지입니다.", "여섯 자리 수는 0으로 시작할 수 없으므로 240−48=192개입니다."],
      connection: "1과 2가 이웃해야 한다는 조건을 없애면 여섯 자리 수는 몇 개 가능한가요?"
    },
    {
      id: "aime-gap-law-of-sines-circumradius-01", sourceConcepts: ["law-of-sines", "circumcircle-circumcenter-and-circumradius"], domain: "기하", stage: "연결", title: "사인 법칙으로 외접원 반지름 구하기",
      prompt: "삼각형에서 30° 각의 맞은편 변 길이가 10입니다. 이 삼각형의 외접원 반지름은 얼마인가요?",
      answer: 10,
      hint: "사인 법칙에서 한 변의 길이는 외접원 지름과 그 맞은편 각의 사인으로 연결돼요.",
      solution: ["사인 법칙에서 a/sin A=2R입니다.", "A=30°, a=10이므로 10/(1/2)=2R입니다.", "따라서 2R=20이고 외접원 반지름은 R=10입니다."],
      connection: "같은 삼각형에서 90° 각의 맞은편 변은 외접원 지름과 어떤 관계인가요?"
    },
    {
      id: "aime-gap-isosceles-trapezoid-area-01", sourceConcepts: ["trapezoid", "triangle-area", "pythagorean-theorem"], domain: "기하", stage: "유형", title: "이등변사다리꼴의 높이와 넓이 구하기",
      prompt: "이등변사다리꼴의 평행한 두 변은 10과 20이고, 두 옆변은 각각 13입니다. 사다리꼴의 넓이를 구하세요.",
      answer: 180,
      hint: "긴 밑변에서 짧은 밑변을 양쪽에 똑같이 나누어 붙이면 두 직각삼각형이 생깁니다.",
      solution: ["두 밑변의 차는 10이므로 양쪽 직각삼각형의 밑변은 각각 5입니다.", "옆변 13이 빗변인 직각삼각형의 높이는 √(13²−5²)=12입니다.", "사다리꼴 넓이는 (10+20)×12÷2=180입니다."],
      connection: "옆변 길이를 그대로 두고 밑변의 차이를 더 크게 하면 높이는 어떻게 바뀌나요?"
    },
    {
      id: "aime-gap-binomial-coefficient-01", sourceConcepts: ["binomial-theorem", "combinations"], domain: "대수", stage: "개념 연결", title: "이항정리로 계수 구하기",
      prompt: "(1+2x)^6을 전개했을 때 x⁴의 계수는 얼마인가요?",
      answer: 240,
      hint: "x를 네 번 고르는 항의 계수와 그때 선택되는 2의 곱을 계산해요.",
      solution: ["x⁴ 항은 6개 인수 중 4개에서 2x를 선택할 때 생깁니다.", "선택하는 방법은 C(6,4)=15가지이고, 계수 2를 네 번 곱하므로 2⁴=16입니다.", "따라서 계수는 15×16=240입니다."],
      connection: "(1+3x)^6에서 x⁴의 계수는 어떻게 바뀌나요?"
    },
    {
      id: "aime-gap-odd-sum-integer-pairs-01", sourceConcepts: ["counting-pairs", "parity"], domain: "경우의 수", stage: "유형", title: "합이 홀수인 순서쌍 세기",
      prompt: "1≤x<y≤20인 정수 순서쌍 가운데 x+y가 홀수인 것은 몇 개입니까?",
      answer: 100,
      hint: "두 수의 합이 홀수이려면 한 수는 짝수, 다른 수는 홀수여야 합니다.",
      solution: ["1부터 20까지 홀수는 10개, 짝수도 10개입니다.", "홀수 하나와 짝수 하나를 고르는 방법은 10×10=100가지입니다.", "서로 다른 홀짝 수를 고르면 작은 수가 x, 큰 수가 y로 정해지므로 각 조합은 조건을 만족하는 순서쌍 하나와 대응합니다."],
      connection: "x와 y가 서로 다른 홀짝 집합에서 선택될 때 x<y 조건을 세는 순서에 어떻게 반영했나요?"
    },
    {
      id: "aime-gap-complex-rotation-reflection-01", sourceConcepts: ["transformation"], domain: "대수", stage: "연결", title: "복소평면에서 회전과 반사 적용하기",
      prompt: "복소수 z=3+4i를 원점 중심으로 90° 반시계 방향 회전한 뒤 실수축에 대하여 반사합니다. 변환된 복소수의 허수부의 절댓값을 구하세요.",
      answer: 3,
      hint: "90° 반시계 회전은 i를 곱하는 것과 같고, 실수축 반사는 켤레복소수를 취하는 것과 같습니다.",
      solution: ["회전하면 iz=i(3+4i)=−4+3i입니다.", "실수축에 대하여 반사하면 허수부의 부호가 바뀌므로 변환 결과는 −4−3i이고, 허수부의 절댓값은 3입니다."],
      connection: "반사를 먼저 하고 회전을 나중에 하면 결과가 같은지 계산해 보세요."
    },
    {
      id: "aime-gap-second-difference-pattern-01", sourceConcepts: ["pattern-recognition"], domain: "대수", stage: "유형", title: "차이의 규칙으로 수열 이어가기",
      prompt: "수열 1, 5, 12, 22, 35에서 연속한 항의 차이가 4, 7, 10, 13으로 3씩 증가합니다. 이 규칙을 이어 다음 항을 구하세요.",
      answer: 51,
      hint: "다음 항을 구하려면 직전 항에 다음 차이를 더하면 됩니다.",
      solution: ["연속한 항의 차이는 4, 7, 10, 13으로 매번 3씩 증가합니다.", "다음 차이는 16이므로 다음 항은 35+16=51입니다."],
      connection: "이 수열의 n번째 항을 이차식으로 나타내면 어떤 식이 되나요?"
    },
    {
      id: "aime-gap-regular-polygon-interior-angle-01", sourceConcepts: ["regular-polygon"], domain: "기하", stage: "개념 연결", title: "내각으로 정다각형의 변 수 찾기",
      prompt: "정다각형의 한 내각의 크기가 150°입니다. 이 다각형의 변은 몇 개입니까?",
      answer: 12,
      hint: "한 내각의 크기와 한 외각의 크기를 합하면 180°입니다.",
      solution: ["한 외각은 180°−150°=30°입니다.", "정다각형의 외각의 합은 360°이므로 변의 수는 360°÷30°=12입니다."],
      connection: "내각이 165°인 정다각형은 몇 개의 변을 가지는지 구해 보세요."
    },
    {
      id: "aime-gap-telescoping-reciprocals-01", sourceConcepts: ["telescoping", "partial-fractions"], domain: "대수", stage: "유형", title: "망원합으로 분수 합 구하기",
      prompt: "100×(1/2+1/6+1/12+⋯+1/990)의 값을 구하세요. 각 항은 1/(k(k+1)) 꼴이며 k는 1부터 99까지입니다.",
      answer: 99,
      hint: "각 항을 1/k−1/(k+1) 꼴로 나누어 써 보세요.",
      solution: ["1/(k(k+1))=1/k−1/(k+1)입니다.", "따라서 괄호 안의 합은 (1−1/2)+(1/2−1/3)+⋯+(1/99−1/100)=1−1/100=99/100입니다.", "전체 식은 100×99/100=99입니다."],
      connection: "합의 마지막 항이 1/(n(n+1))이면 전체 합은 n/(n+1)임을 일반적으로 보여 보세요."
    },
    {
      id: "aime-gap-power-of-point-secant-01", sourceConcepts: ["power-of-a-point", "circle"], domain: "기하", stage: "개념 연결", title: "두 할선의 길이 관계로 미지수 구하기",
      prompt: "원 밖의 점 P에서 두 할선을 그었습니다. 첫 번째 할선에서 PA=3, PB=12이고, 두 번째 할선에서 PC=4, PD=x입니다. P가 각 할선에서 먼저 만나는 점은 A와 C일 때 x를 구하세요.",
      answer: 9,
      hint: "두 할선의 바깥 부분과 전체 길이를 곱한 값이 서로 같습니다.",
      solution: ["할선 정리에 따라 PA×PB=PC×PD입니다.", "3×12=4×x이므로 36=4x입니다.", "따라서 x=9입니다."],
      connection: "한 할선의 바깥 부분이 5이고 전체 길이가 20, 다른 할선의 바깥 부분이 8이면 전체 길이는 얼마인가요?"
    },
    {
      id: "aime-gap-roots-of-unity-geometric-sum-01", sourceConcepts: ["roots-of-unity"], domain: "대수", stage: "연결", title: "단위근 거듭제곱의 합 0 확인하기",
      prompt: "복소수 z가 z⁸=1과 z≠1을 만족합니다. 1+z+z²+⋯+z⁷의 값을 구하세요.",
      answer: 0,
      hint: "등비수열 합 공식을 사용해 분자와 분모를 확인합니다.",
      solution: ["1+z+⋯+z⁷=(1−z⁸)/(1−z)입니다.", "z⁸=1이므로 분자는 0이고, z≠1이므로 분모는 0이 아닙니다.", "따라서 합은 0입니다."],
      connection: "z가 1이면 분수 형태의 등비수열 공식을 바로 쓸 수 없는 이유는 무엇인가요?"
    },
    {
      id: "aime-gap-regular-graph-degree-sum-01", sourceConcepts: ["graph-theory", "basic-counting"], domain: "경우의 수", stage: "유형", title: "꼭짓점 차수의 합으로 변 수 세기",
      prompt: "단순 그래프에 꼭짓점이 10개 있고 각 꼭짓점의 차수가 모두 5입니다. 그래프의 변은 몇 개인가요?",
      answer: 25,
      hint: "모든 꼭짓점의 차수를 더하면 각 변이 양 끝에서 두 번 세어집니다.",
      solution: ["차수의 합은 10×5=50입니다.", "각 변은 양 끝 꼭짓점에서 한 번씩 세어지므로 변의 수는 차수의 합의 절반입니다.", "따라서 변은 50÷2=25개입니다."],
      connection: "차수의 합이 항상 짝수여야 하는 이유를 변 하나씩 세어 설명해 보세요."
    },
    {
      id: "aime-gap-symmetric-cubes-identity-01", sourceConcepts: ["symmetry-algebra", "algebraic-manipulation"], domain: "대수", stage: "개념 연결", title: "대칭식으로 세제곱의 합 구하기",
      prompt: "실수 x와 y가 x+y=5, xy=6을 만족합니다. x³+y³의 값을 구하세요.",
      answer: 35,
      hint: "(x+y)³을 전개해 x³+y³와 xy(x+y)를 연결하세요.",
      solution: ["항등식 x³+y³=(x+y)³−3xy(x+y)를 사용합니다.", "주어진 값을 넣으면 5³−3×6×5입니다.", "125−90=35이므로 답은 35입니다."],
      connection: "x⁴+y⁴도 x+y와 xy만으로 나타낼 수 있는지 식을 만들어 보세요."
    },
    {
      id: "aime-gap-cyclic-quadrilateral-angle-01", sourceConcepts: ["angle-chasing", "cyclic-quadrilateral"], domain: "기하", stage: "유형", title: "원에 내접한 사각형의 마주 보는 각",
      prompt: "원에 내접한 사각형의 서로 마주 보는 두 각의 크기가 (3x+10)°와 (2x+20)°입니다. x의 값을 구하세요.",
      answer: 30,
      hint: "원에 내접한 사각형에서 마주 보는 두 내각의 합은 180°입니다.",
      solution: ["마주 보는 각의 합이 180°이므로 (3x+10)+(2x+20)=180입니다.", "5x+30=180이므로 5x=150입니다.", "따라서 x=30입니다."],
      connection: "원에 내접한 사각형의 한 외각은 맞은편 내각과 어떤 관계가 있나요?"
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
