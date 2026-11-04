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
      choices: [1, "6/5", "5/6", "3/2", 2], answer: 3,
      hint: "먼저 양변에 1/4을 더한 뒤, 5/6을 나누어요.",
      solution: ["양변에 1/4을 더하면 (5/6)x = 1입니다.", "양변에 6/5를 곱하면 x = 6/5입니다.", "따라서 해는 6/5입니다."],
      connection: "방정식의 분모를 없애려고 양변에 12를 곱해도 해가 바뀌지 않는 이유는 무엇인가요?"
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
