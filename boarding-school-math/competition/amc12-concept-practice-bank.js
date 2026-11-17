(function (root) {
  "use strict";

  // All questions and worked solutions below are original GFIELD practice items.
  const items = [
    {
      id: "amc12-g9-algebra-01", sourceConcepts: ["vietas-formulas", "quadratic"], domain: "대수", stage: "개념", title: "근의 합과 곱으로 제곱의 합 구하기",
      prompt: "두 실수 r, s가 t² − 7t + 5 = 0의 두 근입니다. r² + s²의 값은 얼마인가요?",
      choices: [29, 44, 39, 49, 59], answer: 2,
      hint: "근을 각각 구하지 말고 r² + s² = (r + s)² − 2rs를 써요.",
      solution: ["비에타 정리에 따라 r + s = 7, rs = 5입니다.", "r² + s² = (r + s)² − 2rs = 7² − 2 × 5입니다.", "따라서 값은 39입니다."],
      connection: "계수가 바뀌어도 이차방정식의 근을 직접 구하지 않고 같은 방식으로 계산할 수 있나요?"
    },
    {
      id: "amc12-g9-algebra-02", sourceConcepts: ["algebraic-manipulation", "factoring"], domain: "대수", stage: "유형", title: "유리식의 공통 구조 묶기",
      prompt: "x = 5일 때 (x² − 1)/(x − 1) − (x² − 9)/(x − 3)의 값은 얼마인가요?",
      choices: [0, 2, 4, 8, -2], answer: 4,
      hint: "각 분자를 인수분해하고, 약분이 가능한 조건인지 확인해요.",
      solution: ["x² − 1 = (x − 1)(x + 1)이므로 첫째 항은 x + 1입니다.", "x² − 9 = (x − 3)(x + 3)이므로 둘째 항은 x + 3입니다. x = 5는 두 분모를 0으로 만들지 않습니다.", "차는 (x + 1) − (x + 3) = −2입니다."],
      connection: "약분할 수 없는 x의 값은 원래 식의 정의역에서 어떻게 처리해야 하나요?"
    },
    {
      id: "amc12-g9-algebra-03", sourceConcepts: ["system-of-equations", "coefficient-comparison", "polynomial"], domain: "대수", stage: "연결", title: "계수 비교로 두 식을 함께 구하기",
      prompt: "모든 실수 x에 대해 (x + a)(x + b) = x² + 9x + 14입니다. a² + b²의 값은 얼마인가요?",
      choices: [39, 53, 67, 81, 95], answer: 1,
      hint: "양변을 전개하고 x의 계수와 상수항을 각각 비교해요.",
      solution: ["왼쪽을 전개하면 x² + (a + b)x + ab입니다.", "계수를 비교하면 a + b = 9, ab = 14입니다.", "a² + b² = (a + b)² − 2ab = 81 − 28 = 53입니다."],
      connection: "a와 b를 실제로 구하는 방법과 대칭식을 바로 계산하는 방법은 언제 각각 편리할까요?"
    },
    {
      id: "amc12-g9-functions-01", sourceConcepts: ["quadratic", "completing-the-square", "optimization"], domain: "함수·삼각함수", stage: "개념", title: "완전제곱식으로 이차함수의 최솟값 찾기",
      prompt: "모든 실수 x에 대하여 f(x) = x² − 6x + 11입니다. f(x)의 최솟값은 얼마인가요?",
      choices: [1, 3, 5, 2, 11], answer: 3,
      hint: "x² − 6x의 일부를 이용해 완전제곱식을 만들어요.",
      solution: ["f(x) = (x − 3)² + 2입니다.", "제곱은 0보다 작을 수 없고 x = 3일 때 0이 됩니다.", "따라서 최솟값은 2입니다."],
      connection: "이차항의 계수가 양수에서 음수로 바뀌면 꼭짓점은 최댓값과 최솟값 중 무엇을 나타내나요?"
    },
    {
      id: "amc12-g9-functions-02", sourceConcepts: ["exponent", "exponential-equation"], domain: "함수·삼각함수", stage: "유형", title: "지수 방정식의 밑을 같게 하기",
      prompt: "2^(x + 1) = 8^(2x − 1)을 만족하는 실수 x는 얼마인가요?",
      choices: ["4/5", "2/5", 1, "5/4", 2], answer: 0,
      hint: "8을 2의 거듭제곱으로 나타내고, 양변의 밑을 같게 해요.",
      solution: ["8 = 2³이므로 오른쪽은 2^(6x − 3)입니다.", "밑이 같은 양수의 거듭제곱이 같으므로 x + 1 = 6x − 3입니다.", "4 = 5x이므로 x = 4/5입니다."],
      connection: "밑이 1보다 큰 양수라는 조건이 지수 비교에서 어떤 역할을 하나요?"
    },
    {
      id: "amc12-g9-functions-03", sourceConcepts: ["trigonometry"], domain: "함수·삼각함수", stage: "연결", title: "삼각함수 합을 하나의 사인 함수로 묶기",
      prompt: "실수 x가 변할 때 sin x + cos x의 최댓값은 얼마인가요?",
      choices: ["1", "2", "2√2", "√3", "√2"], answer: 4,
      hint: "sin x + cos x를 √2 sin(x + π/4) 꼴로 나타내요.",
      solution: ["√2 sin(x + π/4) = √2(sin x cos π/4 + cos x sin π/4)입니다.", "cos π/4 = sin π/4 = 1/√2이므로 이 식은 sin x + cos x와 같습니다.", "사인 함수의 최댓값은 1이므로 최댓값은 √2입니다."],
      connection: "A sin x + B cos x의 최댓값을 벡터의 길이로 표현하면 어떤 식이 되나요?"
    },
    {
      id: "amc12-g9-number-01", sourceConcepts: ["greatest-common-divisor", "least-common-multiple", "prime-factorization"], domain: "정수론", stage: "개념", title: "최대공약수와 최소공배수로 두 수 구하기",
      prompt: "양의 정수 n에 대해 gcd(n, 18) = 6이고 lcm(n, 18) = 90입니다. n은 얼마인가요?",
      choices: [24, 36, 30, 42, 54], answer: 2,
      hint: "두 양의 정수의 곱은 최대공약수와 최소공배수의 곱과 같아요.",
      solution: ["n × 18 = gcd(n, 18) × lcm(n, 18)입니다.", "18n = 6 × 90 = 540이므로 n = 30입니다.", "확인하면 gcd(30,18)=6, lcm(30,18)=90입니다."],
      connection: "최대공약수와 최소공배수의 곱 관계를 소인수의 지수로 설명할 수 있나요?"
    },
    {
      id: "amc12-g9-number-02", sourceConcepts: ["modular-arithmetic", "chinese-remainder-theorem"], domain: "정수론", stage: "유형", title: "두 합동 조건을 하나의 주기로 정리하기",
      prompt: "가장 작은 양의 정수 n이 n ≡ 2 (mod 7), n ≡ 4 (mod 9)를 만족합니다. n은 얼마인가요?",
      choices: [58, 32, 49, 67, 121], answer: 0,
      hint: "n = 2 + 7k로 놓고 두 번째 조건에 대입해요.",
      solution: ["n = 2 + 7k로 놓으면 2 + 7k ≡ 4 (mod 9)입니다.", "7k ≡ 2 (mod 9)이고 7의 역원은 4이므로 k ≡ 8 (mod 9)입니다.", "가장 작은 가능한 k는 8이고 n = 2 + 7 × 8 = 58입니다."],
      connection: "서로소인 두 법의 나머지 조건을 합치면 해가 어떤 간격으로 반복되나요?"
    },
    {
      id: "amc12-g9-number-03", sourceConcepts: ["factorial", "trailing-zeros", "prime-factorization"], domain: "정수론", stage: "연결", title: "팩토리얼의 끝자리 0 개수 세기",
      prompt: "100!의 십진법 표현에서 끝에 연속으로 붙는 0은 몇 개인가요?",
      choices: [20, 24, 22, 25, 30], answer: 1,
      hint: "10을 만드는 2와 5 중 더 적은 소인수 5의 지수를 세어요.",
      solution: ["100!에는 2가 충분히 많으므로 끝자리 0의 수는 소인수 5의 개수로 정해집니다.", "5의 배수에서 20개, 25의 배수에서 추가 4개, 125의 배수에서는 추가 개수가 없습니다.", "따라서 100!의 끝에 붙는 0은 20 + 4 = 24개입니다."],
      connection: "끝자리 0 개수를 셀 때 25의 배수를 별도로 더해야 하는 이유는 무엇인가요?"
    },
    {
      id: "amc12-g9-geometry-01", sourceConcepts: ["right-triangle", "circumcircle"], domain: "기하", stage: "개념", title: "직각삼각형의 외접원 반지름 구하기",
      prompt: "빗변의 길이가 15인 직각삼각형의 외접원의 반지름은 얼마인가요?",
      choices: [15, "5√3", "3√5", "15/2", 10], answer: 3,
      hint: "직각삼각형의 외심은 빗변의 중점입니다.",
      solution: ["직각삼각형에서 빗변의 중점은 세 꼭짓점과 같은 거리에 있습니다.", "따라서 외접원의 지름은 빗변의 길이 15와 같습니다.", "반지름은 15/2입니다."],
      connection: "이 성질은 왜 직각삼각형에서만 간단히 빗변의 중점을 외심으로 정할 수 있나요?"
    },
    {
      id: "amc12-g9-geometry-02", sourceConcepts: ["chord", "circle"], domain: "기하", stage: "유형", title: "현의 길이와 중심까지 거리 연결하기",
      prompt: "반지름이 13인 원에서 길이가 10인 현이 있습니다. 원의 중심에서 현까지의 거리는 얼마인가요?",
      choices: [10, 5, 12, 11, 13], answer: 2,
      hint: "중심에서 현에 내린 수선은 현을 반으로 나눠요.",
      solution: ["현의 절반은 5입니다. 반지름과 현의 절반은 직각삼각형의 두 변입니다.", "중심에서 현까지의 거리를 d라 하면 d² + 5² = 13²입니다.", "d² = 144이므로 d = 12입니다."],
      connection: "현의 길이가 같으면 같은 원에서 중심으로부터의 거리도 같은 이유를 설명해 보세요."
    },
    {
      id: "amc12-g9-geometry-03", sourceConcepts: ["circle-area", "square-geometry", "area-ratio"], domain: "기하", stage: "연결", title: "정사각형 안의 원 넓이 비 구하기",
      prompt: "반지름이 1인 원에 내접하는 정사각형의 넓이는 얼마인가요?",
      choices: [1, "π/2", 4, "√2", 2], answer: 4,
      hint: "정사각형의 대각선은 원의 지름입니다.",
      solution: ["정사각형의 대각선 길이는 원의 지름인 2입니다.", "변의 길이를 s라 하면 s√2 = 2이므로 s = √2입니다.", "넓이는 s² = 2입니다."],
      connection: "같은 원에 외접하는 정사각형의 넓이와 비교하면 두 넓이의 비는 얼마인가요?"
    },
    {
      id: "amc12-g9-counting-01", sourceConcepts: ["parity", "combinations"], domain: "경우의 수", stage: "개념", title: "홀짝을 이용해 합이 짝수인 쌍 세기",
      prompt: "집합 {1, 2, 3, 4, 5, 6, 7, 8}에서 서로 다른 두 수를 고릅니다. 두 수의 합이 짝수일 확률은 얼마인가요?",
      choices: ["3/7", "1/2", "4/7", "5/14", "2/7"], answer: 0,
      hint: "합이 짝수가 되려면 두 수가 모두 홀수이거나 모두 짝수여야 해요.",
      solution: ["홀수 4개 중 2개를 고르는 방법은 6가지이고, 짝수에서도 6가지입니다.", "유리한 경우는 12가지입니다. 전체 두 수의 선택은 C(8,2) = 28가지입니다.", "확률은 12/28 = 3/7입니다."],
      connection: "두 수를 순서 있게 뽑는 방식으로 세어도 같은 확률을 얻을 수 있나요?"
    },
    {
      id: "amc12-g9-counting-02", sourceConcepts: ["permutations", "digits"], domain: "경우의 수", stage: "유형", title: "중복 문자가 있는 배열 세기",
      prompt: "문자열 LEVEL의 다섯 글자를 모두 사용해 만들 수 있는 서로 다른 배열은 몇 가지인가요?",
      choices: [60, 30, 20, 10, 120], answer: 1,
      hint: "다섯 글자가 모두 다르다고 세었을 때 중복으로 나누어요.",
      solution: ["다섯 글자가 서로 다르면 배열은 5!가지입니다.", "L 두 개를 서로 바꾸어도 새 배열이 아니므로 2!로 나누고, E 두 개도 2!로 나눕니다.", "서로 다른 배열은 5!/(2!2!) = 30가지입니다."],
      connection: "같은 문자가 세 번 나타나는 문자열이라면 분모에는 어떤 인수가 추가되나요?"
    },
    {
      id: "amc12-g9-counting-03", sourceConcepts: ["inclusion-exclusion", "basic-probability"], domain: "경우의 수", stage: "연결", title: "포함·배제로 합집합 확률 구하기",
      prompt: "공정한 주사위 두 개를 던집니다. 두 눈의 합이 7이거나 곱이 12일 확률은 얼마인가요?",
      choices: ["1/3", "5/18", "7/18", "2/9", "1/2"], answer: 3,
      hint: "합이 7인 순서쌍과 곱이 12인 순서쌍을 각각 세고 겹치는 경우를 한 번 빼요.",
      solution: ["합이 7인 순서쌍은 6개입니다. 곱이 12인 순서쌍은 (2,6),(6,2),(3,4),(4,3)의 4개입니다.", "두 조건을 모두 만족하는 경우는 (3,4),(4,3)의 2개입니다.", "포함·배제로 6 + 4 − 2 = 8개이므로 확률은 8/36 = 2/9입니다."],
      connection: "합이 7인 결과와 곱이 12인 결과가 겹치는 경우를 직접 확인해 보세요."
    },
    {
      id: "amc12-core-coordinate-01", sourceConcepts: ["coordinate-geometry", "pythagorean-theorem"], domain: "기하", stage: "개념 연결", title: "좌표의 가로·세로 차이로 거리 구하기",
      prompt: "좌표평면에서 A(1, 2), B(5, 5)입니다. 선분 AB의 길이는 얼마인가요?",
      choices: [5, 3, "√34", 6, 7], answer: 0,
      hint: "두 점 사이를 가로와 세로로 나누면 직각삼각형이 생겨요.",
      solution: ["가로 차이는 5 − 1 = 4, 세로 차이는 5 − 2 = 3입니다.", "선분 AB는 직각삼각형의 빗변이므로 길이의 제곱은 4² + 3²입니다.", "AB = √25 = 5입니다."],
      connection: "두 점 사이의 거리가 5일 때 가능한 정수 가로·세로 차이는 어떤 조합이 있나요?"
    },
    {
      id: "amc12-core-casework-01", sourceConcepts: ["casework", "combinations", "counting-integers-in-a-range"], domain: "경우의 수", stage: "유형", title: "조건을 만족하는 정수 분할 세기",
      prompt: "x < y < z인 양의 정수이고 x + y + z = 10입니다. 가능한 순서쌍 (x, y, z)는 몇 개 있나요?",
      choices: [3, 4, 5, 6, 7], answer: 1,
      hint: "가장 작은 수 x부터 가능한 값을 나누어 보고, y와 z의 합을 확인해요.",
      solution: ["x = 1이면 y + z = 9이고 1 < y < z를 만족하는 쌍은 (2,7), (3,6), (4,5)입니다.", "x = 2이면 y + z = 8이고 2 < y < z를 만족하는 쌍은 (3,5)입니다.", "x ≥ 3이면 합이 10이 되도록 서로 다른 더 큰 y, z를 고를 수 없습니다. 모두 4개입니다."],
      connection: "합이 11로 바뀌면 x의 가능한 값이 어떻게 달라지는지 같은 방식으로 나누어 보세요."
    },
    {
      id: "amc12-core-similarity-01", sourceConcepts: ["ratio-and-proportion", "similarity", "area-ratio"], domain: "기하", stage: "연결", title: "닮음비에서 두 넓이의 차 구하기",
      prompt: "서로 닮은 두 삼각형의 대응변 길이의 비가 작은 삼각형 대 큰 삼각형으로 2:3입니다. 두 삼각형 넓이의 차가 45cm²일 때 작은 삼각형의 넓이는 얼마인가요?",
      choices: ["27cm²", "45cm²", "36cm²", "54cm²", "81cm²"], answer: 2,
      hint: "넓이의 비는 대응변 비의 제곱입니다.",
      solution: ["넓이의 비는 2²:3², 즉 4:9입니다.", "두 넓이는 4k와 9k로 둘 수 있습니다. 차 5k가 45이므로 k = 9입니다.", "작은 삼각형의 넓이는 4k = 36cm²입니다."],
      connection: "두 도형의 대응변 비가 m:n일 때 넓이 비를 제곱으로 바꾸는 이유를 설명해 보세요."
    },
    {
      id: "amc12-core-logarithm-01", sourceConcepts: ["logarithm", "quadratic", "factoring"], domain: "함수·삼각함수", stage: "유형", title: "로그의 정의역과 곱의 성질 함께 쓰기",
      prompt: "log₂(x − 1) + log₂(x − 3) = 3을 만족하는 실수 x는 얼마인가요?",
      choices: [4, 3, -1, 5, 6], answer: 3,
      hint: "먼저 두 로그의 진수가 모두 양수여야 한다는 조건을 적어요.",
      solution: ["정의역에서 x > 3입니다.", "로그의 합을 곱으로 합치면 log₂((x − 1)(x − 3)) = 3이므로 (x − 1)(x − 3) = 8입니다.", "x² − 4x − 5 = 0의 근은 5와 −1입니다. 정의역 x > 3을 만족하는 해는 5입니다."],
      connection: "로그 방정식에서 대수적으로 구한 해를 정의역에 다시 대입해야 하는 이유는 무엇인가요?"
    },
    {
      id: "amc12-core-inequality-01", sourceConcepts: ["inequality", "optimization", "fraction"], domain: "대수", stage: "개념 연결", title: "양수의 역수 항이 만드는 최솟값",
      prompt: "x가 양수일 때 x + 9/x의 최솟값은 얼마인가요?",
      choices: [3, 5, 9, 12, 6], answer: 4,
      hint: "두 양수의 산술평균과 기하평균의 관계를 적용해요.",
      solution: ["x > 0이므로 x와 9/x는 모두 양수입니다.", "x + 9/x ≥ 2√(x · 9/x) = 2√9 = 6입니다.", "x = 3일 때 등호가 성립하므로 최솟값은 6입니다."],
      connection: "x + a/x에서 a가 양수일 때 등호가 성립하는 x를 찾아 최솟값을 일반화해 보세요."
    },
    {
      id: "amc12-core-substitution-01", sourceConcepts: ["substitution", "system-of-equations", "algebraic-manipulation"], domain: "대수", stage: "연결", title: "대칭식으로 곱을 바로 구하기",
      prompt: "실수 x, y가 x + y = 7, x² + y² = 29를 만족합니다. xy는 얼마인가요?",
      choices: [10, 8, 9, 12, 14], answer: 0,
      hint: "(x + y)²을 전개해 x² + y²와 비교해요.",
      solution: ["(x + y)² = x² + 2xy + y²입니다.", "49 = 29 + 2xy이므로 2xy = 20입니다.", "따라서 xy = 10입니다."],
      connection: "x와 y를 각각 구하지 않아도 대칭식의 값을 알 수 있는 이유는 무엇인가요?"
    },
    {
      id: "amc12-core-divisibility-01", sourceConcepts: ["divisibility", "chinese-remainder-theorem", "modular-arithmetic"], domain: "정수론", stage: "유형", title: "두 나머지 조건을 차례로 만족하기",
      prompt: "n을 5로 나누면 나머지가 1이고, 7로 나누면 나머지가 2입니다. 이 조건을 만족하는 가장 작은 양의 정수 n은 무엇인가요?",
      choices: [15, 16, 21, 30, 36], answer: 1,
      hint: "1에 5의 배수를 더한 수를 작은 것부터 확인해요.",
      solution: ["5로 나누어 나머지가 1인 수는 1, 6, 11, 16, …입니다.", "이 가운데 7로 나누어 나머지가 2인 첫 수는 16입니다.", "따라서 가장 작은 양의 정수는 16입니다."],
      connection: "두 나누는 수가 서로소일 때 이런 조건의 해는 어떤 간격으로 되풀이되나요?"
    },
    {
      id: "amc12-core-pythagorean-01", sourceConcepts: ["pythagorean-theorem", "right-triangle", "triangle-area"], domain: "기하", stage: "개념 연결", title: "직각삼각형의 길이와 넓이 연결하기",
      prompt: "직각삼각형의 두 직각변 길이가 9cm와 12cm입니다. 이 삼각형의 넓이는 얼마인가요?",
      choices: ["36cm²", "45cm²", "54cm²", "60cm²", "72cm²"], answer: 2,
      hint: "넓이를 구할 때는 서로 직각인 두 변을 밑변과 높이로 사용할 수 있어요.",
      solution: ["두 직각변이 서로 수직이므로 한 변을 밑변, 다른 변을 높이로 둡니다.", "삼각형의 넓이는 1/2 × 9 × 12입니다.", "넓이는 54cm²입니다."],
      connection: "빗변 길이도 구해 피타고라스 정리가 성립하는지 확인해 보세요."
    },
    {
      id: "amc12-core-sequence-01", sourceConcepts: ["arithmetic-sequence", "linear-equation"], domain: "대수", stage: "연결", title: "서로 떨어진 두 항으로 등차수열의 합 구하기",
      prompt: "등차수열의 셋째 항은 11이고 여덟째 항은 31입니다. 처음 12개 항의 합은 얼마인가요?",
      choices: [240, 288, 312, 300, 360], answer: 3,
      hint: "두 항 사이의 공차 횟수를 세어 공차와 첫째 항을 구해요.",
      solution: ["셋째 항에서 여덟째 항까지 공차가 5번 더해져 31 − 11 = 20입니다. 공차는 4입니다.", "첫째 항은 11 − 2 × 4 = 3이고, 열둘째 항은 3 + 11 × 4 = 47입니다.", "처음 12개 항의 합은 12(3 + 47)/2 = 300입니다."],
      connection: "처음과 끝 항을 짝지으면 왜 각 쌍의 합이 모두 같아지나요?"
    },
    {
      id: "amc12-core-percentage-01", sourceConcepts: ["percentage", "exponent", "multiplication-principle"], domain: "대수", stage: "개념 연결", title: "연속 증가율을 곱셈으로 나타내기",
      prompt: "가격이 해마다 10%씩 두 해 연속 올랐습니다. 처음 가격과 비교한 전체 증가율은 얼마인가요?",
      choices: ["10%", "20%", "22%", "100%", "21%"], answer: 4,
      hint: "처음 가격을 100으로 놓고 매해 1.1을 곱해요.",
      solution: ["처음 가격을 100으로 두면 첫해 뒤에는 110입니다.", "다음 해에는 110의 10%만큼 올라 121이 됩니다.", "처음 100에서 121이 되었으므로 전체 증가율은 21%입니다."],
      connection: "매년 10%씩 내릴 때 두 해 뒤 변화율도 단순히 20% 감소가 아닌 이유를 설명해 보세요."
    },
    {
      id: "amc12-core-complex-01", sourceConcepts: ["complex-number", "exponent"], domain: "대수", stage: "유형", title: "복소수 거듭제곱의 반복 주기 찾기",
      prompt: "(1 + i)⁸의 값은 무엇인가요? 단, i² = −1입니다.",
      choices: [16, 4, -4, 8, 32], answer: 0,
      hint: "먼저 (1 + i)²을 계산한 뒤 제곱을 거듭해요.",
      solution: ["(1 + i)² = 1 + 2i + i² = 2i입니다.", "따라서 (1 + i)⁴ = (2i)² = −4입니다.", "그러므로 (1 + i)⁸ = (−4)² = 16입니다."],
      connection: "(1 + i)의 거듭제곱에서 실수부와 허수부가 어떤 주기로 반복되나요?"
    },
    {
      id: "amc12-core-radical-01", sourceConcepts: ["radical", "algebraic-manipulation"], domain: "대수", stage: "연결", title: "제곱해 근호 안의 구조 찾기",
      prompt: "√(3 + 2√2)를 간단히 나타내면 무엇인가요?",
      choices: ["√2 − 1", "1 + √2", "2 + √2", "√3 + √2", "3"], answer: 1,
      hint: "(a + b√2)²을 전개해 근호 안의 항과 비교해요.",
      solution: ["(1 + √2)² = 1 + 2√2 + 2입니다.", "정리하면 3 + 2√2입니다.", "1 + √2는 양수이므로 √(3 + 2√2) = 1 + √2입니다."],
      connection: "근호를 간단히 한 뒤 양수 조건이 필요한 이유는 무엇인가요?"
    },
    {
      id: "amc12-core-equilateral-01", sourceConcepts: ["equilateral-triangle", "special-right-triangle", "triangle-area"], domain: "기하", stage: "연결", title: "정삼각형의 변에서 높이와 넓이 구하기",
      prompt: "한 변의 길이가 12cm인 정삼각형의 넓이는 얼마인가요?",
      choices: ["12√3cm²", "24√3cm²", "36√3cm²", "48√3cm²", "72cm²"], answer: 2,
      hint: "높이를 그으면 밑변이 6cm씩 나뉘는 직각삼각형이 됩니다.",
      solution: ["높이는 √(12² − 6²) = √108 = 6√3cm입니다.", "넓이는 1/2 × 12 × 6√3입니다.", "따라서 넓이는 36√3cm²입니다."],
      connection: "정삼각형의 변을 2배로 하면 넓이는 몇 배가 되는지 닮음비로 설명해 보세요."
    },
    {
      id: "amc12-core-fraction-01", sourceConcepts: ["fraction", "linear-equation", "algebraic-manipulation"], domain: "대수", stage: "개념", title: "분수 계수의 일차방정식 정리하기",
      prompt: "(5/6)x − 1/4 = 3/4를 만족하는 x는 얼마인가요?",
      choices: [1, "6/5", "5/6", "3/2", 2], answer: 1,
      hint: "먼저 양변에 1/4을 더한 뒤, 5/6을 나누어요.",
      solution: ["양변에 1/4을 더하면 (5/6)x = 1입니다.", "양변에 6/5를 곱하면 x = 6/5입니다.", "따라서 해는 6/5입니다."],
      connection: "방정식의 분모를 없애려고 양변에 12를 곱해도 해가 바뀌지 않는 이유는 무엇인가요?"
    },
    {
      id: "amc12-gap-summation-01", sourceConcepts: ["summation", "factorization"], domain: "대수", stage: "유형", title: "부분분수로 유한합을 간단히 계산하기",
      prompt: "1/(1·2) + 1/(2·3) + 1/(3·4) + ⋯ + 1/(8·9)의 값은 얼마인가요?",
      choices: ["7/8", "8/9", "9/10", "1", "5/6"], answer: 1,
      hint: "각 항을 1/k − 1/(k+1)로 바꾸어 보세요.",
      solution: ["1/(k(k+1)) = 1/k − 1/(k+1)이므로 합은 (1−1/2)+(1/2−1/3)+⋯+(1/8−1/9)입니다.", "중간 항이 서로 지워져 1−1/9만 남습니다.", "따라서 합은 8/9입니다."],
      connection: "마지막 분모가 20이면 같은 합은 얼마가 되나요?"
    },
    {
      id: "amc12-gap-geometric-sequence-01", sourceConcepts: ["geometric-sequence"], domain: "대수", stage: "개념", title: "등비수열에서 공비와 항 찾기",
      prompt: "공비가 양수인 등비수열에서 둘째 항은 6, 넷째 항은 54입니다. 다섯째 항은 얼마인가요?",
      choices: [54, 108, 162, 486, 18], answer: 2,
      hint: "넷째 항을 둘째 항으로 나누면 공비의 제곱이 됩니다.",
      solution: ["넷째 항 ÷ 둘째 항 = r² = 54/6 = 9입니다.", "공비가 양수이므로 r=3이고, 셋째 항은 18입니다.", "다섯째 항은 54×3=162입니다."],
      connection: "공비가 음수일 수도 있다고 하면 다섯째 항이 달라지는지 살펴보세요."
    },
    {
      id: "amc12-gap-symmetry-01", sourceConcepts: ["symmetry", "polynomial", "vietas-formulas"], domain: "대수", stage: "연결", title: "근의 대칭식으로 세제곱 합 구하기",
      prompt: "x² − 5x + 6 = 0의 두 근을 a, b라 할 때 a³ + b³의 값은 얼마인가요?",
      choices: [25, 35, 29, 31, 45], answer: 1,
      hint: "a³+b³=(a+b)³−3ab(a+b)를 이용해요.",
      solution: ["비에타 정리에서 a+b=5, ab=6입니다.", "a³+b³=(a+b)³−3ab(a+b)=5³−3×6×5입니다.", "따라서 값은 125−90=35입니다."],
      connection: "두 근의 합과 곱만으로 a⁴+b⁴도 구할 수 있나요?"
    },
    {
      id: "amc12-gap-mean-01", sourceConcepts: ["mean"], domain: "대수", stage: "개념", title: "평균에서 빠진 자료 복원하기",
      prompt: "6개의 실수의 평균은 12입니다. 그중 다섯 수가 8, 9, 11, 14, 15라면 나머지 수는 얼마인가요?",
      choices: [12, 14, 15, 16, 18], answer: 2,
      hint: "평균에 자료 개수를 곱하면 전체 합이 됩니다.",
      solution: ["여섯 수의 합은 6×12=72입니다.", "알려진 다섯 수의 합은 8+9+11+14+15=57입니다.", "빠진 수는 72−57=15입니다."],
      connection: "자료 하나를 15에서 21로 바꾸면 평균은 얼마만큼 커지나요?"
    },
    {
      id: "amc12-gap-trigonometric-identity-01", sourceConcepts: ["trigonometric-identity", "trigonometry"], domain: "함수·삼각함수", stage: "유형", title: "배각 공식으로 삼각비 계산하기",
      prompt: "θ가 예각이고 sin θ = 5/13일 때 cos(2θ)는 얼마인가요?",
      choices: ["119/169", "25/169", "144/169", "12/13", "1/2"], answer: 0,
      hint: "cos(2θ)=1−2sin²θ를 사용해요.",
      solution: ["배각 공식 cos(2θ)=1−2sin²θ를 적용합니다.", "sin²θ=25/169이므로 cos(2θ)=1−50/169입니다.", "따라서 cos(2θ)=119/169입니다."],
      connection: "sin θ가 12/13이라면 cos(2θ)는 어떻게 달라지나요?"
    },
    {
      id: "amc12-gap-rational-equation-01", sourceConcepts: ["rational-equation", "algebraic-manipulation"], domain: "대수", stage: "유형", title: "유리방정식의 해와 정의역 확인하기",
      prompt: "(2x − 1)/(x + 3) = 3/5를 만족하는 x는 얼마인가요?",
      choices: [-2, 1, 2, 3, -3], answer: 2,
      hint: "먼저 x=−3은 제외하고, 양변에 5(x+3)을 곱해요.",
      solution: ["정의역에서 x≠−3입니다.", "양변에 5(x+3)을 곱하면 5(2x−1)=3(x+3)입니다.", "10x−5=3x+9이므로 7x=14, x=2입니다. 이 값은 제외 조건을 만족합니다."],
      connection: "방정식의 해를 원래 식에 대입해 확인하는 절차가 왜 필요한가요?"
    },
    {
      id: "amc12-gap-function-01", sourceConcepts: ["function", "polynomial"], domain: "함수·삼각함수", stage: "연결", title: "함숫값의 차에서 변화 구조 찾기",
      prompt: "f(x)=x²−3x+1일 때 f(x+1)−f(x)는 무엇인가요?",
      choices: ["2x−2", "2x+2", "x−2", "x²−2x", "2x−1"], answer: 0,
      hint: "f(x+1)을 먼저 전개한 뒤 f(x)를 빼요.",
      solution: ["f(x+1)=(x+1)²−3(x+1)+1=x²−x−1입니다.", "f(x+1)−f(x)=(x²−x−1)−(x²−3x+1)입니다.", "동류항을 정리하면 2x−2입니다."],
      connection: "이차함수 f에서 f(x+1)−f(x)가 일차식이 되는 이유를 전개로 설명해 보세요."
    },
    {
      id: "amc12-gap-area-01", sourceConcepts: ["area", "optimization"], domain: "기하", stage: "연결", title: "둘레가 고정된 직사각형의 최대 넓이",
      prompt: "둘레가 28인 직사각형 가운데 넓이가 가장 큰 직사각형의 넓이는 얼마인가요?",
      choices: [45, 48, 49, 50, 56], answer: 2,
      hint: "가로와 세로의 합은 14이고, 두 수의 곱은 두 수가 같을 때 가장 커요.",
      solution: ["가로를 x라 하면 세로는 14−x이고 넓이는 x(14−x)입니다.", "x(14−x)=49−(x−7)²이므로 최댓값은 x=7일 때입니다.", "최대 넓이는 7×7=49입니다."],
      connection: "둘레가 40으로 바뀌면 최대 넓이는 몇이 되나요?"
    },
    {
      id: "amc12-gap-diophantine-01", sourceConcepts: ["diophantine-equation", "casework"], domain: "정수론", stage: "유형", title: "양의 정수해를 나머지 조건으로 세기",
      prompt: "2x+3y=17을 만족하는 양의 정수 순서쌍 (x,y)는 몇 개 있나요?",
      choices: [2, 3, 4, 5, 6], answer: 1,
      hint: "2x가 짝수이므로 y의 홀짝부터 확인해요.",
      solution: ["2x=17−3y가 짝수여야 하므로 y는 홀수입니다.", "양의 정수 y는 1, 3, 5이고, 각각 x=7, 4, 1을 줍니다.", "따라서 순서쌍은 3개입니다."],
      connection: "오른쪽이 18이면 가능한 양의 정수해는 몇 개일까요?"
    },
    {
      id: "amc12-gap-absolute-value-01", sourceConcepts: ["absolute-value", "casework", "symmetry"], domain: "대수", stage: "유형", title: "절댓값 거리 합의 해 나누어 찾기",
      prompt: "|x−2|+|x+4|=10을 만족하는 실수 x들의 곱은 얼마인가요?",
      choices: [-24, -12, 0, 12, 24], answer: 0,
      hint: "수직선에서 −4와 2를 기준으로 세 구간을 나누어요.",
      solution: ["x≤−4이면 좌변은 −2x−2이므로 x=−6입니다.", "−4≤x≤2에서는 두 거리의 합이 6이어서 해가 없습니다.", "x≥2이면 좌변은 2x+2이므로 x=4입니다. 두 해의 곱은 −24이므로 정답은 첫 번째 선택지입니다."],
      connection: "우변이 6이면 해가 구간 전체에 걸쳐 생기는 이유를 설명해 보세요."
    },
    {
      id: "amc12-gap-recurrence-01", sourceConcepts: ["recursion", "geometric-sequence", "exponent"], domain: "대수", stage: "연결", title: "점화식의 반복을 거듭제곱으로 바꾸기",
      prompt: "수열이 a₀ = 2, aₙ₊₁ = 3aₙ + 2로 정의됩니다. a₆의 값은 얼마인가요?",
      choices: [728, 1092, 2186, 2187, 6560], answer: 2,
      hint: "각 항에 1을 더한 수열의 점화식을 살펴보세요.",
      solution: ["aₙ₊₁ + 1 = 3aₙ + 3 = 3(aₙ + 1)이므로, aₙ + 1은 공비 3인 등비수열입니다.", "a₀ + 1 = 3이므로 a₆ + 1 = 3 × 3⁶ = 3⁷ = 2187입니다.", "따라서 a₆ = 2186입니다."],
      connection: "점화식의 상수항이 2가 아닌 다른 값이면 어떤 수를 각 항에 더해 같은 방법을 쓸 수 있을까요?"
    },
    {
      id: "amc12-gap-area-decomposition-01", sourceConcepts: ["area-decomposition", "rectangle", "triangle-area"], domain: "기하", stage: "유형", title: "직사각형에서 바깥 삼각형 넓이 빼기",
      prompt: "직사각형 ABCD의 가로와 세로 길이는 각각 12와 8입니다. AB 위의 점 E는 AE = 5, BC 위의 점 F는 BF = 3을 만족합니다. 삼각형 DEF의 넓이는 얼마인가요?",
      choices: ["34.5", "35", "35.5", "36", "40.5"], answer: 2,
      hint: "직사각형 전체 넓이에서 삼각형 DEF 바깥에 있는 세 직각삼각형의 넓이를 빼요.",
      solution: ["직사각형 넓이는 12 × 8 = 96입니다.", "바깥 세 삼각형의 넓이는 각각 5 × 8 ÷ 2 = 20, (12 − 5) × 3 ÷ 2 = 10.5, 12 × (8 − 3) ÷ 2 = 30입니다.", "따라서 삼각형 DEF의 넓이는 96 − 20 − 10.5 − 30 = 35.5입니다."],
      connection: "E와 F의 위치를 바꿀 때 세 바깥 삼각형의 밑변과 높이는 어떻게 달라지나요?"
    },
    {
      id: "amc12-gap-integer-product-01", sourceConcepts: ["bounding-to-limit-cases", "optimization", "counting-integers-in-a-range", "inequality"], domain: "대수", stage: "연결", title: "합이 고정된 정수의 곱 최대로 만들기",
      prompt: "양의 정수 a, b, c의 합이 20입니다. abc가 가질 수 있는 가장 큰 값은 얼마인가요?",
      choices: [280, 288, 294, 300, 343], answer: 2,
      hint: "두 수의 차이가 2 이상이면 큰 수에서 1을 작은 수로 옮길 때 곱이 커지는지 살펴보세요.",
      solution: ["합이 고정된 두 양의 정수 x, y에서 차이가 2 이상이면 (x − 1)(y + 1) − xy = x − y − 1입니다. y가 작은 쪽일 때 곱이 커집니다.", "따라서 곱이 가장 클 때 세 수는 서로 1 이하만큼 차이 납니다.", "합이 20이므로 세 수는 6, 7, 7이고 곱의 최댓값은 6 × 7 × 7 = 294입니다."],
      connection: "세 양의 실수의 합이 20일 때는 가장 큰 곱을 만드는 수가 어떻게 달라지나요?"
    },
    {
      id: "amc12-gap-boat-rate-01", sourceConcepts: ["distance-rate-and-time", "rate", "algebraic-manipulation"], domain: "대수", stage: "유형", title: "왕복 속력으로 정지한 물에서의 속력 구하기",
      prompt: "보트가 강을 따라 하류로 24마일을 2시간 동안 간 뒤 같은 길을 상류로 돌아오는 데 3시간이 걸렸습니다. 물이 흐르지 않을 때 보트의 속력은 시속 몇 마일인가요?",
      choices: [8, 9, 10, 11, 12], answer: 2,
      hint: "하류와 상류 속력은 각각 거리 ÷ 시간입니다. 물의 흐름은 한쪽 속력을 늘리고 다른 쪽 속력을 같은 만큼 줄여요.",
      solution: ["하류 속력은 24 ÷ 2 = 12mph, 상류 속력은 24 ÷ 3 = 8mph입니다.", "정지한 물에서의 보트 속력을 b, 물의 속력을 c라 하면 b + c = 12, b − c = 8입니다.", "두 식을 더하면 2b = 20이므로 보트 속력은 10mph입니다."],
      connection: "강물의 속력은 두 이동 방향의 속력 차에서 어떻게 구할 수 있나요?"
    },
    {
      id: "amc12-gap-difference-squares-ratio-01", sourceConcepts: ["difference-of-squares", "factoring", "algebraic-manipulation"], domain: "대수", stage: "연결", title: "연속한 제곱수 차의 비 간단히 하기",
      prompt: "(2026² − 2024²) ÷ (2028² − 2026²)의 값은 얼마인가요?",
      choices: ["2023/2025", "2024/2026", "2025/2027", "2026/2028", "2027/2029"], answer: 2,
      hint: "큰 제곱수를 직접 계산하지 말고 각 차를 두 수의 합과 차의 곱으로 바꿔요.",
      solution: ["2026² − 2024² = (2026 − 2024)(2026 + 2024) = 2 × 4050입니다.", "2028² − 2026² = (2028 − 2026)(2028 + 2026) = 2 × 4054입니다.", "비는 4050/4054 = 2025/2027입니다."],
      connection: "두 제곱수의 차에서 두 수의 간격이 같으면 합의 비가 어떻게 남나요?"
    },
    {
      id: "amc12-gap-digit-place-value-01", sourceConcepts: ["place-value", "digit-reversal", "linear-equation"], domain: "대수", stage: "유형", title: "자릿값과 뒤집은 수의 차로 두 자리 수 찾기",
      prompt: "두 자리 자연수가 각 자리 숫자의 합의 4배보다 27 큽니다. 두 숫자의 순서를 바꾼 수는 원래 수보다 36 작습니다. 원래 수는 얼마인가요?",
      choices: ["15", "42", "51", "60", "84"], answer: 2,
      hint: "십의 자리 숫자를 a, 일의 자리 숫자를 b라 하고 원래 수를 10a+b로 나타내요.",
      solution: ["첫 조건은 10a+b=4(a+b)+27이므로 2a−b=9입니다.", "두 수의 차는 (10a+b)−(10b+a)=9(a−b)=36이므로 a−b=4입니다.", "두 식을 빼면 a=5, b=1이고 원래 수는 51입니다."],
      connection: "두 수의 차가 54라면 두 자리 숫자 a와 b 사이의 차는 어떻게 바뀌나요?"
    },
    {
      id: "amc12-gap-angle-chase-01", sourceConcepts: ["triangle-angle-sum", "angle-sum", "triangle"], domain: "기하", stage: "연결", title: "삼각형 안의 선분으로 각 추적하기",
      prompt: "삼각형 ABC에서 ∠A=40°, ∠B=60°입니다. 점 D는 AC 위에 있고 ∠ABD=20°입니다. ∠BDC의 크기는 몇 도인가요?",
      choices: ["40°", "50°", "60°", "70°", "80°"], answer: 2,
      hint: "먼저 ∠DBC를 구한 다음, 삼각형 BDC의 세 각의 합을 이용해요.",
      solution: ["∠DBC = ∠ABC − ∠ABD = 60° − 20° = 40°입니다.", "삼각형 ABC에서 ∠C = 180° − 40° − 60° = 80°입니다. D가 AC 위에 있으므로 ∠BCD=80°입니다.", "삼각형 BDC에서 ∠BDC = 180° − 40° − 80° = 60°입니다."],
      connection: "∠ABD가 20°가 아니라 25°이면 ∠BDC는 어떻게 바뀌나요?"
    },
    {
      id: "amc12-gap-angle-bisector-01", sourceConcepts: ["angle-bisector", "triangle-angle-sum", "angle-chasing"], domain: "기하", stage: "유형", title: "각의 이등분선과 삼각형 각의 합 연결하기",
      prompt: "삼각형 ABC에서 ∠A=30°, ∠B=70°입니다. AD는 ∠A의 이등분선이고 D는 BC 위에 있습니다. ∠ADB는 몇 도인가요?",
      choices: ["75°", "80°", "85°", "90°", "95°"], answer: 4,
      hint: "각의 이등분선이 만드는 삼각형 ABD에서 A의 각은 30°의 절반이에요.",
      solution: ["AD가 ∠A를 이등분하므로 ∠BAD=15°입니다.", "D가 BC 위에 있으므로 ∠ABD=∠ABC=70°입니다.", "삼각형 ABD에서 ∠ADB=180°−15°−70°=95°입니다."],
      connection: "∠B를 80°로 바꾸면 ∠ADB는 어떻게 변하나요?"
    },
    {
      id: "amc12-gap-coordinate-distance-01", sourceConcepts: ["distance-formula", "coordinate-geometry", "pythagorean-theorem"], domain: "기하", stage: "연결", title: "같은 거리에 있는 점의 좌표 구하기",
      prompt: "점 P는 y축 위에 있고 A=(1,2), B=(5,6)에서 같은 거리에 있습니다. P의 y좌표는 얼마인가요?",
      choices: ["5", "6", "7", "8", "9"], answer: 2,
      hint: "P=(0,y)라 두고 PA²=PB²를 세우면 제곱근을 계산하지 않아도 돼요.",
      solution: ["P=(0,y)라고 놓으면 PA²=1+(y−2)²이고 PB²=25+(y−6)²입니다.", "두 거리가 같으므로 1+(y−2)²=25+(y−6)²입니다.", "전개해 정리하면 8y=56이므로 y=7입니다."],
      connection: "P가 y축 대신 x축 위에 있을 때는 어떤 좌표를 미지수로 두나요?"
    },
    {
      id: "amc12-gap-cone-cylinder-volume-01", sourceConcepts: ["volume", "cylinder", "cone"], domain: "기하", stage: "개념 연결", title: "원기둥과 원뿔의 부피 관계 활용하기",
      prompt: "반지름이 같은 원기둥과 원뿔의 부피가 같습니다. 원기둥의 높이가 4cm라면 원뿔의 높이는 몇 cm인가요?",
      choices: ["4", "8", "10", "12", "16"], answer: 3,
      hint: "두 입체의 부피를 πr²과 높이로 나타내고 같다고 놓아요.",
      solution: ["원기둥의 부피는 πr²×4입니다.", "원뿔의 높이를 h라 하면 부피는 (1/3)πr²h입니다.", "부피가 같으므로 4πr²=(1/3)πr²h이고 h=12cm입니다."],
      connection: "밑면 반지름이 같은 원기둥과 원뿔의 높이도 같다면 부피의 비는 얼마인가요?"
    },
    {
      id: "amc12-gap-logical-deduction-01", sourceConcepts: ["logical-deduction", "casework"], domain: "경우의 수", stage: "연결", title: "참·거짓 조건으로 진술 판별하기",
      prompt: "A, B, C가 각각 한 문장씩 말합니다. A: ‘B는 거짓말을 한다.’ B: ‘C는 거짓말을 한다.’ C: ‘A와 B는 모두 거짓말을 한다.’ 세 사람 중 정확히 한 사람만 참말을 한다면 참말을 한 사람은 누구인가요?",
      choices: ["A", "B", "C", "A와 C", "정확히 한 명이라는 조건과 모순"], answer: 1,
      hint: "참말을 하는 사람을 한 명씩 가정하고, 각 문장이 실제 참·거짓과 맞는지 대입해요.",
      solution: ["A가 참이라고 가정하면 B는 거짓입니다. B의 문장이 거짓이므로 C는 참이고, 참말이 두 명이 되어 조건에 어긋납니다.", "B가 참이면 C는 거짓입니다. C의 문장도 거짓이어야 하므로 A와 B가 모두 거짓인 것은 아닙니다. B가 참이므로 A는 거짓입니다.", "이 경우 참말은 B 한 명뿐이므로 조건을 만족합니다. C가 참이면 A와 B가 모두 거짓이어야 하지만 A의 말이 참이 되어 모순입니다. 따라서 B가 참말을 합니다."],
      connection: "‘정확히 두 명이 참말을 한다’로 조건을 바꾸면 가능한 경우를 어떻게 찾을 수 있을까요?"
    },
    {
      id: "amc12-gap-tangent-quadrilateral-area-01", sourceConcepts: ["tangent-line", "circle", "pythagorean-theorem"], domain: "기하", stage: "연결", title: "두 접선으로 만든 사각형의 넓이 구하기",
      prompt: "중심이 O이고 반지름이 5인 원 밖의 점 P에서 두 접선 PA와 PB를 그었습니다. OP=13일 때 사각형 OAPB의 넓이는 얼마인가요?",
      choices: [48, 50, 60, 65, 72], answer: 2,
      hint: "반지름과 접선은 수직이고, 두 접선의 길이는 같습니다.",
      solution: ["OA는 접점 A에서 접선 PA와 수직이므로 삼각형 OAP는 직각삼각형입니다.", "PA²=OP²−OA²=13²−5²=144이므로 PA=12입니다. 점 P에서 그은 두 접선은 같으므로 PB=12입니다.", "사각형 OAPB는 넓이가 각각 (1/2)×5×12인 직각삼각형 두 개로 나뉩니다. 전체 넓이는 60입니다."],
      connection: "반지름이 5이고 외부 점까지 거리가 17이라면 같은 사각형의 넓이는 어떻게 계산하나요?"
    },
    {
      id: "amc12-gap-perfect-square-multiplier-01", sourceConcepts: ["perfect-square", "prime-factorization"], domain: "정수론", stage: "유형", title: "완전제곱수가 되게 하는 최소 인수 찾기",
      prompt: "756에 곱하여 완전제곱수를 만드는 가장 작은 양의 정수는 무엇인가요?",
      choices: [3, 7, 14, 21, 42], answer: 3,
      hint: "소인수분해에서 완전제곱수는 모든 소인수의 지수가 짝수여야 해요.",
      solution: ["756=2²×3³×7입니다.", "2의 지수는 이미 짝수이고, 3과 7의 지수는 홀수입니다. 두 지수를 짝수로 만들려면 각각 3과 7을 한 번씩 곱해야 합니다.", "가장 작은 인수는 3×7=21입니다. 실제로 756×21=2²×3⁴×7²=126²입니다."],
      connection: "756에 21을 곱한 결과가 제곱수임을 소인수 지수 대신 직접 확인하려면 어떻게 할 수 있나요?"
    },
    {
      id: "amc12-gap-successive-discounts-01", sourceConcepts: ["money", "percentage", "algebraic-manipulation"], domain: "대수", stage: "연결", title: "할인과 세금의 순서를 역으로 계산하기",
      prompt: "정가 200달러인 물건에 먼저 일정한 할인율을 적용하고, 할인된 가격에 8%의 세금을 더했더니 최종 가격이 172.80달러였습니다. 할인율은 몇 퍼센트인가요?",
      choices: ["10%", "15%", "20%", "25%", "28%"], answer: 2,
      hint: "세금을 붙이기 전 가격을 먼저 구한 다음 정가와 비교해요.",
      solution: ["세금 전 가격은 172.80÷1.08=160달러입니다.", "200달러에서 160달러로 줄었으므로 할인액은 40달러입니다.", "할인율은 40÷200=20%입니다."],
      connection: "할인과 세금의 적용 순서를 바꾸면 최종 가격이 달라지는 이유를 설명해 보세요."
    },
    {
      id: "amc12-gap-isosceles-triangle-area-01", sourceConcepts: ["isosceles-triangle", "triangle-area", "pythagorean-theorem"], domain: "기하", stage: "유형", title: "이등변삼각형의 높이와 넓이 구하기",
      prompt: "두 같은 변의 길이가 각각 13cm이고 밑변이 10cm인 이등변삼각형의 넓이는 몇 cm²인가요?",
      choices: ["50", "55", "60", "65", "70"], answer: 2,
      hint: "꼭짓점에서 밑변에 수선을 내리면 밑변이 둘로 똑같이 나뉘어요.",
      solution: ["높이가 밑변을 5cm씩 나누므로 높이 h는 h²+5²=13²을 만족합니다.", "h²=169−25=144이므로 높이는 12cm입니다.", "넓이는 10×12÷2=60cm²입니다."],
      connection: "같은 두 변의 길이를 유지한 채 밑변을 더 짧게 하면 높이는 어떻게 달라지나요?"
    },
    {
      id: "amc12-gap-law-of-cosines-01", sourceConcepts: ["law-of-cosines", "triangle", "angle-measure"], domain: "기하", stage: "연결", title: "코사인 법칙으로 세 번째 변 구하기",
      prompt: "삼각형에서 길이가 7과 8인 두 변 사이의 끼인각은 60°입니다. 이 각의 맞은편 변의 길이는 얼마인가요?",
      choices: ["√41", "7", "√57", "8", "√113"], answer: 2,
      hint: "코사인 법칙에서 cos 60°는 1/2입니다.",
      solution: ["코사인 법칙에 따라 c²=7²+8²−2×7×8×cos60°입니다.", "cos60°=1/2이므로 c²=49+64−56=57입니다.", "변의 길이는 양수이므로 c=√57입니다."],
      connection: "끼인각이 90°라면 코사인 법칙은 어떤 익숙한 정리로 단순해지나요?"
    },
    {
      id: "amc12-gap-polygon-diagonals-01", sourceConcepts: ["regular-polygon", "diagonal", "combinations"], domain: "기하", stage: "유형", title: "대각선 개수로 정다각형의 변 수 찾기",
      prompt: "정다각형의 대각선이 90개입니다. 이 정다각형은 몇 개의 변을 가지고 있나요?",
      choices: ["12", "13", "14", "15", "18"], answer: 3,
      hint: "n개의 꼭짓점 쌍은 모두 n(n−1)/2개이고, 그중 변 n개는 대각선이 아니에요.",
      solution: ["대각선 수는 n(n−1)/2−n=n(n−3)/2입니다.", "n(n−3)/2=90이므로 n²−3n−180=0입니다.", "(n−15)(n+12)=0이고 변의 수는 양수이므로 n=15입니다."],
      connection: "정다각형의 꼭짓점이 n개일 때 대각선 수를 조합 기호로 어떻게 나타낼 수 있나요?"
    },
    {
      id: "amc12-gap-common-internal-tangent-01", sourceConcepts: ["tangent-circles", "pythagorean-theorem", "circle"], domain: "기하", stage: "연결", title: "두 원의 공통 내접선 길이 구하기",
      prompt: "반지름이 6과 8인 두 원의 중심 사이 거리는 17입니다. 공통 내접선이 두 원에 닿는 점 사이의 길이는 얼마인가요?",
      choices: ["√69", "√77", "√93", "√105", "√193"], answer: 2,
      hint: "공통 내접선에서는 두 중심에서 접선까지의 수직 거리 합이 두 반지름의 합과 같아요.",
      solution: ["두 중심 사이 거리 17은 만들어지는 직각삼각형의 빗변입니다.", "수직 변의 길이는 두 반지름의 합 6+8=14입니다.", "접점 사이 거리를 x라 하면 x²+14²=17²이므로 x²=93, x=√93입니다."],
      connection: "공통 외접선으로 바꾸면 반지름의 합 대신 어떤 길이가 직각삼각형의 한 변이 되나요?"
    },
    {
      id: "amc12-gap-triangle-inequality-integer-01", sourceConcepts: ["triangle-inequality", "triangle", "integer-triangles"], domain: "기하", stage: "유형", title: "삼각형을 만드는 정수 길이 세기",
      prompt: "두 변의 길이가 5와 8인 삼각형에서 나머지 한 변의 길이가 양의 정수일 때, 가능한 길이는 몇 가지인가요?",
      choices: [7, 8, 9, 10, 11], answer: 2,
      hint: "세 변 중 어느 두 변의 합도 나머지 변보다 커야 해요.",
      solution: ["나머지 변을 x라 하면 삼각형 부등식에서 x+5>8이므로 x>3입니다.", "또 5+8>x이므로 x<13입니다.", "가능한 정수는 4부터 12까지라서 9가지입니다."],
      connection: "변의 길이를 모두 양의 정수로 제한하면 퇴화한 삼각형을 제외해야 하는 이유는 무엇인가요?"
    },
    {
      id: "amc12-gap-perpendicular-slope-01", sourceConcepts: ["slope", "perpendicular-lines"], domain: "대수", stage: "개념 연결", title: "수직인 두 직선의 기울기 구하기",
      prompt: "직선 3x+2y=7에 수직인 직선의 기울기는 얼마인가요?",
      choices: ["−3/2", "−2/3", "2/3", "3/2", "2"], answer: 2,
      hint: "먼저 주어진 직선을 y=mx+b 꼴로 바꾸고, 수직인 기울기끼리의 곱을 확인해요.",
      solution: ["3x+2y=7에서 y=−(3/2)x+7/2이므로 기울기는 −3/2입니다.", "수직인 두 직선의 기울기 곱은 −1이므로 구하는 기울기는 2/3입니다."],
      connection: "주어진 직선과 평행한 직선의 기울기는 얼마인가요?"
    },
    {
      id: "amc12-gap-second-difference-sequence-01", sourceConcepts: ["pattern-recognition"], domain: "대수", stage: "연결", title: "차이가 일정하게 늘어나는 수열",
      prompt: "수열 3, 8, 15, 24, 35에서 연속한 항의 차이가 5, 7, 9, 11처럼 2씩 커집니다. 이 규칙을 이어 다음 항을 구하세요.",
      choices: ["44", "46", "48", "50", "52"], answer: 2,
      hint: "다음 차이는 11보다 2 큰 수입니다.",
      solution: ["연속한 항의 차이는 5, 7, 9, 11입니다.", "다음 차이는 13이므로 다음 항은 35+13=48입니다."],
      connection: "이 수열의 n번째 항을 n을 사용한 식으로 나타낼 수 있나요?"
    },
    {
      id: "amc12-gap-inscribed-circle-probability-01", sourceConcepts: ["geometric-probability", "circle-area"], domain: "경우의 수", stage: "연결", title: "정사각형 안의 원에 점이 들어갈 확률",
      prompt: "한 변의 길이가 2인 정사각형 안에 내접원이 있습니다. 정사각형 안에서 점 하나를 무작위로 고를 때, 점이 원 안에 있을 확률은 얼마인가요?",
      choices: ["π/8", "π/4", "1/2", "3π/4", "π"], answer: 1,
      hint: "점이 원 안에 있을 확률은 원의 넓이를 정사각형의 넓이로 나눈 값입니다.",
      solution: ["정사각형의 넓이는 2²=4입니다.", "내접원의 지름은 2이므로 반지름은 1, 원의 넓이는 π입니다.", "확률은 넓이의 비이므로 π/4입니다."],
      connection: "정사각형의 한 변을 10배로 키우고 원을 계속 내접시키면 이 확률이 달라지나요?"
    },
    {
      id: "amc12-gap-number-base-equation-01", sourceConcepts: ["number-base"], domain: "정수론", stage: "개념 연결", title: "자리값 식으로 진법 구하기",
      prompt: "세 자리 수 132_b를 십진수로 나타내면 42입니다. 밑 b는 얼마인가요?",
      choices: ["4", "5", "6", "7", "8"], answer: 1,
      hint: "132_b는 b²+3b+2와 같은 값입니다.",
      solution: ["132_b=b²+3b+2이므로 b²+3b+2=42입니다.", "b²+3b−40=0이고 (b+8)(b−5)=0입니다.", "진법의 밑은 3보다 커야 하므로 b=5입니다."],
      connection: "같은 방식으로 121_b가 십진수 16일 때 b를 구해 보세요."
    },
    {
      id: "amc12-gap-space-diagonal-01", sourceConcepts: ["3d-geometry", "pythagorean-theorem"], domain: "기하", stage: "유형", title: "직육면체의 공간 대각선 구하기",
      prompt: "모서리 길이가 3, 4, 12인 직육면체의 공간 대각선 길이는 얼마인가요?",
      choices: ["12", "13", "14", "15", "19"], answer: 1,
      hint: "공간 대각선의 제곱은 세 모서리 길이의 제곱의 합입니다.",
      solution: ["공간 대각선의 길이를 d라 하면 d²=3²+4²+12²입니다.", "d²=9+16+144=169이므로 d=13입니다."],
      connection: "직육면체의 부피가 3×4×12인 것과 공간 대각선 길이를 구하는 계산이 어떻게 다른가요?"
    },
    {
      id: "amc12-gap-no-repeat-code-count-01", sourceConcepts: ["basic-counting", "permutations"], domain: "경우의 수", stage: "유형", title: "중복 없는 숫자 코드 세기",
      prompt: "첫 자리는 0이 될 수 없고 숫자를 반복하지 않는 다섯 자리 코드를 0부터 9까지의 숫자로 만들 때, 가능한 코드는 몇 개인가요?",
      choices: ["22,680", "27,216", "30,240", "32,400", "45,360"], answer: 1,
      hint: "첫 자리를 정한 다음에는 남은 숫자 중에서 차례대로 고릅니다.",
      solution: ["첫 자리는 0을 제외한 9가지입니다.", "둘째 자리는 남은 숫자 9가지, 셋째부터 다섯째 자리는 각각 8, 7, 6가지입니다.", "곱의 법칙에 따라 9×9×8×7×6=27,216가지입니다."],
      connection: "첫 자리도 0을 허용하면 코드 수가 몇 개 늘어나나요?"
    },
    {
      id: "amc12-gap-roots-of-unity-sum-01", sourceConcepts: ["roots-of-unity"], domain: "대수", stage: "개념 연결", title: "단위근의 거듭제곱 합 구하기",
      prompt: "z⁵=1이고 z≠1인 복소수 z에 대하여 1+z+z²+z³+z⁴의 값은 얼마인가요?",
      choices: ["−1", "0", "1", "z", "5"], answer: 1,
      hint: "1+z+z²+z³+z⁴는 1−z⁵를 1−z로 나눈 식입니다.",
      solution: ["등비급수의 합에 따라 1+z+z²+z³+z⁴=(1−z⁵)/(1−z)입니다.", "z⁵=1이므로 분자는 0입니다.", "z≠1이라 분모는 0이 아니므로 합은 0입니다."],
      connection: "zⁿ=1이고 z≠1일 때 1+z+⋯+zⁿ⁻¹의 합은 무엇인가요?"
    },
    {
      id: "amc12-gap-counterexample-prime-polynomial-01", sourceConcepts: ["counterexample", "prime"], domain: "정수론", stage: "연결", title: "소수라는 주장에 반례 찾기",
      prompt: "‘모든 음이 아닌 정수 n에 대해 n²+n+41은 소수이다’라는 주장을 반박하는 값은 무엇인가요? 보기 중 해당 식이 합성수가 되는 n을 고르세요.",
      choices: ["0", "1", "2", "5", "40"], answer: 4,
      hint: "n=40을 대입하면 제곱수로 인수분해되는지 살펴보세요.",
      solution: ["n=40이면 n²+n+41=40²+40+41=1681입니다.", "1681=41²이므로 합성수입니다.", "따라서 n=40은 주장을 반박하는 반례입니다."],
      connection: "반례 하나로 모든 n에 대한 주장을 왜 반박할 수 있는지 설명해 보세요."
    },
    {
      id: "amc12-gap-distance-unit-conversion-01", sourceConcepts: ["unit-conversion", "distance-rate-and-time"], domain: "대수", stage: "유형", title: "분 단위 시간을 시간 단위로 바꾸어 거리 계산하기",
      prompt: "자동차가 시속 72km로 25분 동안 일정하게 달립니다. 이동 거리는 몇 km인가요?",
      choices: ["24", "28", "30", "32", "36"], answer: 2,
      hint: "25분을 시간 단위로 바꾸고 거리=속력×시간을 사용하세요.",
      solution: ["25분은 25/60시간, 즉 5/12시간입니다.", "이동 거리는 72×5/12=30km입니다."],
      connection: "같은 속력으로 40분 동안 달리면 몇 km를 이동하나요?"
    }
  ];

  const domains = Object.freeze(["대수", "함수·삼각함수", "정수론", "기하", "경우의 수"]);
  root.GFIELDAMC12ConceptPractice = Object.freeze({
    title: "AMC 12 개념 연결 연습",
    scope: "Full high school mathematics through trigonometry, excluding calculus; AMC 12 scope reference only, not official preparation material.",
    sourceUrl: "https://maa.org/student-programs/amc/",
    domains: domains,
    items: Object.freeze(items.map(function (entry) { return Object.freeze(Object.assign({}, entry, { choices: Object.freeze(entry.choices), solution: Object.freeze(entry.solution) })); }))
  });
})(typeof window !== "undefined" ? window : globalThis);
