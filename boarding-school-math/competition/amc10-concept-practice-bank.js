(function (root) {
  "use strict";

  const items = [
    {
      id: "amc10-g7-algebra-01", domain: "대수", sourceConcepts: ["distributive-property", "algebraic-manipulation"], stage: "개념", title: "괄호와 동류항을 차례로 정리하기",
      prompt: "x = 5일 때 3(2x − 1) − 2(x + 4)의 값은 얼마인가요?",
      choices: [9, 3, 7, 11, 13], answer: 0,
      hint: "먼저 각 괄호에 바깥 수를 곱한 뒤, x에 5를 대입해요.",
      solution: ["3(2x − 1) − 2(x + 4) = 6x − 3 − 2x − 8", "= 4x − 11", "x = 5를 대입하면 4 × 5 − 11 = 9입니다."],
      connection: "분배법칙을 쓴 뒤 동류항을 모으면 식의 구조가 어떻게 바뀌나요?"
    },
    {
      id: "amc10-g7-algebra-02", domain: "대수", sourceConcepts: ["system-of-equations", "linear-equation"], stage: "연결", title: "두 조건을 연립해 상황을 식으로 나타내기",
      prompt: "성인 표는 8달러, 어린이 표는 5달러입니다. 표를 모두 19장 팔아 122달러를 받았습니다. 성인 표는 몇 장 팔았나요?",
      choices: [7, 9, 8, 10, 11], answer: 1,
      hint: "성인 표 수를 a라고 하면 어린이 표 수는 19 − a예요.",
      solution: ["성인 표 수를 a라 두면 8a + 5(19 − a) = 122입니다.", "3a + 95 = 122이므로 3a = 27입니다.", "a = 9이므로 성인 표는 9장입니다."],
      connection: "표 한 장을 성인 표로 바꿀 때 총액은 얼마씩 늘어나나요?"
    },
    {
      id: "amc10-g7-algebra-03", domain: "대수", sourceConcepts: ["factoring", "vietas-formulas", "algebraic-manipulation"], stage: "연결", title: "곱셈 구조를 이용해 계산 줄이기",
      prompt: "a + b = 12이고 ab = 27입니다. (a − 3)(b − 3)의 값은 얼마인가요?",
      choices: [-6, -3, 0, 3, 6], answer: 2,
      hint: "두 괄호를 전개한 다음 a + b와 ab를 한꺼번에 대입해요.",
      solution: ["(a − 3)(b − 3) = ab − 3a − 3b + 9입니다.", "ab − 3(a + b) + 9 = 27 − 3 × 12 + 9입니다.", "27 − 36 + 9 = 0입니다."],
      connection: "a와 b를 각각 구하지 않고도 답을 구할 수 있었던 이유는 무엇인가요?"
    },
    {
      id: "amc10-g7-number-01", domain: "정수론", sourceConcepts: ["modular-arithmetic", "divisibility"], stage: "개념", title: "나머지 조건을 함께 만족하는 수 찾기",
      prompt: "3으로 나누면 나머지가 2이고 5로 나누면 나머지가 4인 가장 작은 양의 정수는 무엇인가요?",
      choices: [4, 9, 19, 14, 29], answer: 3,
      hint: "5로 나누어 나머지가 4인 수를 작은 것부터 적고, 3으로 나눈 나머지를 살펴봐요.",
      solution: ["5로 나누어 나머지가 4인 양의 정수는 4, 9, 14, 19, …입니다.", "이 가운데 3으로 나누어 나머지가 2인 첫 수는 14입니다."],
      connection: "조건 하나만 사용하면 후보가 어떻게 늘어나나요? 두 번째 조건은 후보를 어떻게 줄이나요?"
    },
    {
      id: "amc10-g7-number-02", domain: "정수론", sourceConcepts: ["prime-factorization", "divisibility"], stage: "연결", title: "소인수분해로 약수의 개수 세기",
      prompt: "360의 양의 약수는 모두 몇 개인가요?",
      choices: [12, 18, 20, 30, 24], answer: 4,
      hint: "360을 소인수의 거듭제곱 곱으로 나타내요.",
      solution: ["360 = 2³ × 3² × 5입니다.", "약수를 만들 때 2의 지수는 0, 1, 2, 3 중 하나, 3의 지수는 0, 1, 2 중 하나, 5의 지수는 0, 1 중 하나입니다.", "따라서 약수의 개수는 4 × 3 × 2 = 24입니다."],
      connection: "소인수의 지수가 하나 늘어날 때 약수의 선택 수에는 어떤 변화가 생기나요?"
    },
    {
      id: "amc10-g7-number-03", domain: "정수론", sourceConcepts: ["exponent", "modular-exponentiation"], stage: "혼합", title: "거듭제곱의 일의 자리 주기 찾기",
      prompt: "7²⁰²⁶의 일의 자리 숫자는 무엇인가요?",
      choices: [1, 3, 9, 7, 6], answer: 2,
      hint: "7의 거듭제곱을 몇 개 적어 일의 자리의 반복을 찾아요.",
      solution: ["일의 자리는 7, 9, 3, 1을 반복합니다.", "반복 주기는 4이고 2026을 4로 나눈 나머지는 2입니다.", "따라서 두 번째 자리인 9가 일의 자리입니다."],
      connection: "지수가 2026 대신 2027이라면 주기의 어느 자리를 사용하나요?"
    },
    {
      id: "amc10-g7-geometry-01", domain: "기하", sourceConcepts: ["optimization", "rectangle-area", "area"], stage: "개념", title: "둘레가 정해진 직사각형의 넓이 비교",
      prompt: "둘레가 40인 직사각형 중 넓이가 가장 큰 도형의 넓이는 얼마인가요? 변의 길이는 양의 실수입니다.",
      choices: [80, 96, 99, 100, 120], answer: 3,
      hint: "가로와 세로의 합은 20입니다. 합이 같은 두 수의 곱은 두 수가 같을 때 가장 커요.",
      solution: ["가로를 x, 세로를 y라 하면 2x + 2y = 40이므로 x + y = 20입니다.", "합이 20인 양수 두 수의 곱 xy는 x = y = 10일 때 가장 큽니다.", "최대 넓이는 10 × 10 = 100입니다."],
      connection: "둘레가 같을 때 정사각형이 최대 넓이를 갖는다는 사실을 어떻게 설명할 수 있나요?"
    },
    {
      id: "amc10-g7-geometry-02", domain: "기하", sourceConcepts: ["square-geometry", "area-decomposition", "symmetry"], stage: "연결", title: "정사각형 안의 중점 연결 도형",
      prompt: "한 변의 길이가 8인 정사각형에서 네 변의 중점을 차례로 이었습니다. 안쪽 마름모의 넓이는 얼마인가요?",
      choices: [32, 16, 24, 40, 48], answer: 0,
      hint: "마름모의 두 대각선은 바깥 정사각형의 가로와 세로 길이와 같아요.",
      solution: ["마름모의 두 대각선은 각각 8입니다.", "마름모의 넓이는 대각선의 곱을 2로 나눈 값입니다.", "8 × 8 ÷ 2 = 32입니다."],
      connection: "정사각형을 네 모서리 삼각형으로 나누어도 같은 넓이를 확인할 수 있나요?"
    },
    {
      id: "amc10-g7-geometry-03", domain: "기하", sourceConcepts: ["similarity", "area-ratio", "triangle-area"], stage: "혼합", title: "닮음비를 넓이로 연결하기",
      prompt: "넓이가 6인 삼각형과 닮은 큰 삼각형의 대응하는 변의 길이는 3배입니다. 큰 삼각형의 넓이는 얼마인가요?",
      choices: [18, 54, 36, 48, 72], answer: 1,
      hint: "변의 길이가 3배가 되면 넓이는 몇 배가 되는지 생각해요.",
      solution: ["닮은 도형의 넓이는 대응하는 길이의 비를 제곱한 비율로 변합니다.", "넓이의 비는 3² = 9입니다.", "큰 삼각형의 넓이는 6 × 9 = 54입니다."],
      connection: "길이의 비와 넓이의 비가 같지 않은 이유를 작은 정사각형 격자로 설명해 보세요."
    },
    {
      id: "amc10-g7-counting-01", domain: "경우의 수", sourceConcepts: ["casework", "arrangements-with-restrictions", "permutations"], stage: "연결", title: "붙어 있는 경우를 빼서 세기",
      prompt: "서로 다른 책 5권을 한 줄로 놓습니다. 두 권 A와 B가 서로 붙어 있지 않게 놓는 방법은 몇 가지인가요?",
      choices: [24, 48, 60, 96, 72], answer: 4,
      hint: "전체 배열에서 A와 B를 한 묶음으로 보는 배열 수를 빼요.",
      solution: ["전체 배열은 5! = 120가지입니다.", "A와 B가 붙어 있으면 두 책을 한 묶음으로 보아 4! × 2 = 48가지입니다.", "붙어 있지 않은 배열은 120 − 48 = 72가지입니다."],
      connection: "A와 B가 붙어 있는 배열에서 ×2가 필요한 이유는 무엇인가요?"
    },
    {
      id: "amc10-g7-counting-02", domain: "경우의 수", sourceConcepts: ["digits", "casework", "multiplication-principle"], stage: "혼합", title: "끝 두 자리부터 나누어 세기",
      prompt: "숫자 1, 2, 3, 4를 한 번씩 써서 네 자리 수를 만듭니다. 4의 배수인 수는 몇 개인가요?",
      choices: [4, 8, 6, 12, 16], answer: 2,
      hint: "4의 배수인지는 끝 두 자리로 판단할 수 있어요. 가능한 끝 두 자리를 먼저 찾으세요.",
      solution: ["사용할 수 있는 숫자로 만든 끝 두 자리가 4의 배수인 경우는 12, 24, 32입니다.", "끝 두 자리를 하나 정하면 남은 두 숫자는 앞 두 자리에 2가지 순서로 놓입니다.", "3 × 2 = 6가지입니다."],
      connection: "끝 두 자리로 나누어 세면 같은 수를 두 번 세지 않는 이유는 무엇인가요?"
    },
    {
      id: "amc10-g7-probability-01", domain: "확률", sourceConcepts: ["basic-probability", "sampling-without-replacement", "combinations"], stage: "개념", title: "비복원 추출에서 같은 색이 나올 확률",
      prompt: "빨간 구슬 3개와 파란 구슬 2개가 있습니다. 구슬 두 개를 차례로 꺼내고 다시 넣지 않을 때, 두 구슬의 색이 같을 확률은 얼마인가요?",
      choices: ["1/5", "3/5", "1/2", "2/5", "4/5"], answer: 3,
      hint: "빨강 둘인 경우와 파랑 둘인 경우를 각각 세고, 가능한 두 구슬 조합 전체로 나누어요.",
      solution: ["전체 두 구슬 조합은 5개 중 2개를 고르는 10가지입니다.", "빨간 구슬 둘은 3가지, 파란 구슬 둘은 1가지이므로 같은 색인 경우는 4가지입니다.", "확률은 4/10 = 2/5입니다."],
      connection: "같은 색을 두 번 연속 뽑을 확률을 곱셈으로 계산해도 같은 답이 나오는지 확인해 보세요."
    },
    {
      id: "amc10-core-ratio-01", domain: "대수", sourceConcepts: ["ratio-and-proportion", "fraction", "linear-equation"], stage: "개념 연결", title: "비를 유지하며 수량을 바꾸기",
      prompt: "상자에 빨간 구슬과 파란 구슬이 3:5의 비로 들어 있습니다. 빨간 구슬 6개를 더 넣으면 빨간 구슬과 파란 구슬의 비가 3:4가 됩니다. 처음 파란 구슬은 몇 개였나요?",
      choices: ["40개", "24개", "32개", "48개", "56개"], answer: 0,
      hint: "처음 구슬 수를 3k개와 5k개로 두고, 바뀐 비를 식으로 나타내요.",
      solution: ["처음 빨간 구슬은 3k개, 파란 구슬은 5k개입니다.", "(3k + 6)/(5k) = 3/4이므로 12k + 24 = 15k입니다. 따라서 k = 8입니다.", "처음 파란 구슬은 5k = 40개입니다."],
      connection: "빨간 구슬을 더 넣은 뒤 전체 구슬 수는 처음보다 몇 개 늘었나요?"
    },
    {
      id: "amc10-core-coordinate-01", domain: "기하", sourceConcepts: ["coordinate-geometry", "pythagorean-theorem", "distance-formula"], stage: "유형", title: "좌표 차이를 직각삼각형으로 보기",
      prompt: "좌표평면에서 A(−2, 1), B(4, 9)입니다. 선분 AB의 길이는 얼마인가요?",
      choices: ["8", "10", "9", "12", "14"], answer: 1,
      hint: "가로로 6, 세로로 8만큼 이동합니다. 두 이동을 직각삼각형의 두 변으로 보세요.",
      solution: ["두 점의 x좌표 차이는 4 − (−2) = 6이고, y좌표 차이는 9 − 1 = 8입니다.", "두 차이는 직각삼각형의 두 직각변이므로 거리의 제곱은 6² + 8²입니다.", "AB = √(36 + 64) = 10입니다."],
      connection: "두 점의 중점 좌표를 구하고, 중점이 두 점에서 같은 거리에 있는지 확인해 보세요."
    },
    {
      id: "amc10-core-mean-01", domain: "대수", sourceConcepts: ["mean", "linear-equation"], stage: "개념", title: "평균이 바뀔 때 새 자료 찾기",
      prompt: "8개의 수의 평균은 14입니다. 여기에 수 하나를 더했더니 9개의 수의 평균이 15가 되었습니다. 더한 수는 얼마인가요?",
      choices: ["19", "21", "23", "22", "25"], answer: 2,
      hint: "평균에 자료의 개수를 곱해 각 묶음의 합을 먼저 구해요.",
      solution: ["처음 8개 수의 합은 8 × 14 = 112입니다.", "새로운 9개 수의 합은 9 × 15 = 135입니다.", "더한 수는 135 − 112 = 23입니다."],
      connection: "처음 평균보다 더한 수가 컸다는 사실을 평균 변화로 어떻게 확인할 수 있나요?"
    },
    {
      id: "amc10-core-percent-01", domain: "대수", sourceConcepts: ["percentage", "fraction", "multiplication-principle"], stage: "연결", title: "연속된 백분율 변화 계산하기",
      prompt: "어떤 가격을 20% 올린 뒤, 오른 가격에서 20% 내렸습니다. 처음 가격과 비교하면 최종 가격은 어떻게 되었나요?",
      choices: ["변화가 없다", "4% 높다", "20% 높다", "4% 낮다", "20% 낮다"], answer: 3,
      hint: "처음 가격을 100이라고 두고 두 번의 변화를 차례로 적용해요.",
      solution: ["처음 가격을 100으로 두면 20% 오른 가격은 120입니다.", "120의 20%는 24이므로 내린 뒤 가격은 120 − 24 = 96입니다.", "96은 처음 100보다 4만큼 작아 최종 가격은 4% 낮습니다."],
      connection: "두 번째 20%는 처음 가격이 아니라 어떤 금액을 기준으로 계산했나요?"
    },
    {
      id: "amc10-core-parity-01", domain: "정수론", sourceConcepts: ["parity", "divisibility", "casework"], stage: "개념 연결", title: "연속한 세 정수의 곱 나누어 보기",
      prompt: "연속한 세 정수의 곱은 항상 6의 배수임을 설명하려고 합니다. 그 이유로 반드시 참인 것은 무엇인가요?",
      choices: ["세 수가 모두 짝수이다", "세 수 중 정확히 하나가 소수이다", "첫째 수가 6의 배수이다", "세 수의 합이 항상 6의 배수이다", "세 수 중 적어도 하나는 3의 배수이고, 적어도 하나는 짝수이다"], answer: 4,
      hint: "연속한 정수 세 개에서 짝수와 3의 배수가 각각 반드시 나타나는지 살펴봐요.",
      solution: ["연속한 세 정수 중 하나는 3으로 나누어떨어집니다.", "연속한 정수 세 개 중 적어도 하나는 짝수입니다.", "따라서 곱에는 2와 3이 인수로 들어 있어 6의 배수입니다."],
      connection: "연속한 네 정수의 곱이 항상 24의 배수인 이유도 같은 방식으로 설명할 수 있나요?"
    },
    {
      id: "amc10-core-sequence-01", domain: "대수", sourceConcepts: ["arithmetic-sequence", "linear-equation"], stage: "연결", title: "등차수열 두 항으로 합 구하기",
      prompt: "등차수열에서 다섯째 항은 18이고 열셋째 항은 50입니다. 처음 열 항의 합은 얼마인가요?",
      choices: ["200", "180", "190", "210", "220"], answer: 0,
      hint: "두 항의 번호 차이는 8입니다. 먼저 공차를 찾고 첫째 항을 구해요.",
      solution: ["다섯째 항에서 열셋째 항까지 8번 공차가 더해져 50 − 18 = 32가 됩니다. 공차는 4입니다.", "첫째 항은 18 − 4 × 4 = 2입니다.", "처음 열 항의 평균은 (2 + 38)/2 = 20이므로 합은 10 × 20 = 200입니다."],
      connection: "처음 열 항을 첫째 항과 열째 항의 쌍으로 묶으면 같은 합을 어떻게 얻나요?"
    },
    {
      id: "amc10-core-quadratic-01", domain: "대수", sourceConcepts: ["quadratic", "factoring", "algebraic-manipulation"], stage: "유형", title: "근을 직접 구하지 않고 제곱합 계산하기",
      prompt: "x² − 5x + 6 = 0의 두 근을 r, s라 할 때 r² + s²의 값은 얼마인가요?",
      choices: ["11", "13", "12", "14", "19"], answer: 1,
      hint: "r² + s² = (r + s)² − 2rs를 이용해요.",
      solution: ["이차식의 인수분해는 (x − 2)(x − 3) = 0이므로 두 근은 2와 3입니다.", "따라서 r² + s² = 2² + 3²입니다.", "4 + 9 = 13입니다."],
      connection: "근을 각각 구하는 방법과 r + s, rs를 이용하는 방법 중 어떤 조건에서 두 번째가 더 편할까요?"
    },
    {
      id: "amc10-core-circle-01", domain: "기하", sourceConcepts: ["circle-area", "percentage", "ratio-and-proportion"], stage: "연결", title: "반지름 변화와 원의 넓이",
      prompt: "원의 반지름을 10에서 15로 늘립니다. 원의 넓이는 몇 퍼센트 증가하나요?",
      choices: ["25%", "50%", "100%", "150%", "125%"], answer: 4,
      hint: "넓이는 반지름에 비례하지 않고 반지름의 제곱에 비례합니다.",
      solution: ["처음 넓이는 100π이고 새 넓이는 225π입니다.", "넓이의 증가량은 125π입니다.", "처음 넓이에 대한 증가율은 125π ÷ 100π = 1.25, 즉 125%입니다."],
      connection: "반지름이 2배가 되면 넓이는 처음 넓이의 몇 배가 되나요?"
    },
    {
      id: "amc10-core-volume-01", domain: "기하", sourceConcepts: ["volume", "ratio-and-proportion", "multiplication-principle"], stage: "개념 연결", title: "직육면체의 부피를 차원별로 보기",
      prompt: "직육면체의 세 변 길이가 각각 4, 6, 10입니다. 세 길이를 모두 2배로 늘리면 부피는 처음보다 얼마나 커지나요?",
      choices: ["8배", "2배", "4배", "6배", "16배"], answer: 0,
      hint: "부피는 길이 세 개의 곱입니다. 각 길이에 2를 곱하면 곱 전체에는 2가 몇 번 들어가나요?",
      solution: ["처음 부피는 4 × 6 × 10입니다.", "각 변을 2배로 늘린 뒤 부피는 (2 × 4)(2 × 6)(2 × 10)입니다.", "새 부피는 처음 부피의 2 × 2 × 2 = 8배입니다."],
      connection: "넓이에서 두 길이를 각각 2배로 늘렸을 때 넓이가 4배가 되는 것과 어떤 공통점이 있나요?"
    },
    {
      id: "amc10-core-inequality-01", domain: "정수론", sourceConcepts: ["inequality", "optimization", "casework"], stage: "연결", title: "합이 고정된 서로 다른 정수의 곱",
      prompt: "서로 다른 양의 정수 두 개의 합은 20입니다. 가능한 곱의 최댓값은 얼마인가요?",
      choices: ["90", "96", "100", "99", "110"], answer: 3,
      hint: "합이 같은 두 정수의 곱은 두 수가 가까울수록 커집니다. 서로 다른 정수라는 조건도 지켜요.",
      solution: ["20을 서로 다른 두 양의 정수로 가장 가깝게 나누는 방법은 9와 11입니다.", "10과 10은 서로 다르지 않아 사용할 수 없습니다.", "가장 가까운 허용 쌍의 곱은 9 × 11 = 99입니다."],
      connection: "두 수가 같아도 된다고 바꾸면 최댓값은 얼마나 달라지나요?"
    },
    {
      id: "amc10-core-diophantine-01", domain: "정수론", sourceConcepts: ["diophantine-equation", "divisibility", "casework"], stage: "유형", title: "정수 조건으로 해의 개수 세기",
      prompt: "x와 y가 음이 아닌 정수이고 3x + 5y = 29입니다. 가능한 순서쌍 (x, y)는 몇 개 있나요?",
      choices: ["1개", "3개", "2개", "4개", "5개"], answer: 2,
      hint: "y의 값을 0부터 29 ÷ 5까지 확인하고, 29 − 5y가 3으로 나누어지는 경우를 찾으세요.",
      solution: ["y는 0, 1, 2, 3, 4, 5 중 하나입니다.", "29 − 5y가 3의 배수가 되려면 y는 3으로 나누어 나머지가 1이어야 합니다. 가능한 값은 1과 4입니다.", "y = 1이면 x = 8, y = 4이면 x = 3이므로 순서쌍은 2개입니다."],
      connection: "오른쪽 수가 29 대신 30이면 가능한 순서쌍은 몇 개가 되나요?"
    },
    {
      id: "amc10-core-equilateral-01", domain: "기하", sourceConcepts: ["equilateral-triangle", "special-right-triangle", "triangle-area", "pythagorean-theorem"], stage: "연결", title: "정삼각형을 두 직각삼각형으로 나누기",
      prompt: "한 변의 길이가 10인 정삼각형의 넓이는 얼마인가요?",
      choices: ["20√3", "30√3", "40√3", "50√3", "25√3"], answer: 4,
      hint: "꼭짓점에서 밑변에 수선을 내리면 밑변이 둘로 나뉘고 높이를 구할 수 있어요.",
      solution: ["높이가 밑변을 이등분하므로 직각삼각형의 밑변은 5, 빗변은 10입니다.", "피타고라스 정리로 높이는 √(10² − 5²) = 5√3입니다.", "넓이는 1/2 × 10 × 5√3 = 25√3입니다."],
      connection: "한 변의 길이를 2배로 하면 넓이는 몇 배가 될까요?"
    },
    {
      id: "amc10-core-fraction-01", domain: "대수", sourceConcepts: ["fraction", "ratio-and-proportion", "linear-equation"], stage: "개념 연결", title: "분수 조건을 식으로 바꾸기",
      prompt: "어떤 수의 2/3에서 4를 뺐더니 그 수의 1/2과 같았습니다. 그 수는 얼마인가요?",
      choices: ["12", "24", "18", "30", "36"], answer: 1,
      hint: "수를 x라 두고 2x/3 − 4 = x/2를 세워요.",
      solution: ["식을 세우면 2x/3 − 4 = x/2입니다.", "양변에 6을 곱하면 4x − 24 = 3x입니다.", "따라서 x = 24입니다."],
      connection: "양변에 6을 곱해도 등식이 유지되는 이유를 설명해 보세요."
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
