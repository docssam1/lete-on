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
      id: "amc10-g7-geometry-01", domain: "기하", sourceConcepts: ["optimization", "rectangle", "area"], stage: "개념", title: "둘레가 정해진 직사각형의 넓이 비교",
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
      prompt: "어떤 수의 ⅔에서 4를 뺐더니 그 수의 ½과 같았습니다. 그 수는 얼마인가요?",
      choices: ["12", "24", "18", "30", "36"], answer: 1,
      hint: "수를 x라 두고 ⅔x − 4 = ½x를 세워요.",
      solution: ["식을 세우면 ⅔x − 4 = ½x입니다.", "양변에 6을 곱하면 4x − 24 = 3x입니다.", "따라서 x = 24입니다."],
      connection: "양변에 6을 곱해도 등식이 유지되는 이유를 설명해 보세요."
    },
    {
      id: "amc10-gap-pattern-01", domain: "대수", sourceConcepts: ["pattern-recognition", "arithmetic-sequence", "quadratic"], stage: "유형", title: "차이의 규칙으로 다음 항 찾기",
      prompt: "수열 3, 8, 15, 24, 35, …에서 다음 항은 무엇인가요?",
      choices: [46, 47, 48, 49, 50], answer: 2,
      hint: "연속한 항의 차이를 먼저 적어 보세요.",
      solution: ["연속한 항의 차이는 5, 7, 9, 11로 홀수들이 2씩 커집니다.", "다음 차이는 13입니다.", "따라서 다음 항은 35 + 13 = 48입니다."],
      connection: "각 항을 n으로 나타내는 식을 찾아 같은 답을 확인해 보세요."
    },
    {
      id: "amc10-gap-integer-range-01", domain: "대수", sourceConcepts: ["counting-integers-in-a-range", "casework"], stage: "개념", title: "부등식 범위 안의 정수 개수 세기",
      prompt: "정수 n이 −7 < 2n + 1 ≤ 13을 만족합니다. 가능한 n은 몇 개인가요?",
      choices: [8, 9, 10, 11, 12], answer: 2,
      hint: "부등식의 세 부분에서 같은 수를 빼고, 양수를 나누어 정수 범위를 구해요.",
      solution: ["모든 부분에서 1을 빼면 −8 < 2n ≤ 12입니다.", "2로 나누면 −4 < n ≤ 6입니다.", "가능한 정수는 −3부터 6까지이므로 10개입니다."],
      connection: "왼쪽 끝이 −4 이하라면 세지 않는 이유는 무엇인가요?"
    },
    {
      id: "amc10-gap-rate-01", domain: "대수", sourceConcepts: ["distance-rate-and-time", "rate", "ratio-and-proportion"], stage: "유형", title: "왕복 속력으로 전체 시간 구하기",
      prompt: "두 도시 사이의 거리는 180km입니다. 한 방향은 시속 60km, 돌아오는 길은 시속 45km로 이동했습니다. 왕복에 걸린 시간은 몇 시간인가요?",
      choices: [6, 6.5, 7, 7.5, 8], answer: 2,
      hint: "각 방향에서 시간 = 거리 ÷ 속력으로 계산해 더해요.",
      solution: ["갈 때 걸린 시간은 180 ÷ 60 = 3시간입니다.", "돌아올 때 걸린 시간은 180 ÷ 45 = 4시간입니다.", "왕복 시간은 3 + 4 = 7시간입니다."],
      connection: "평균 속력을 두 속력의 산술평균으로 구할 수 없는 이유를 설명해 보세요."
    },
    {
      id: "amc10-gap-square-01", domain: "정수론", sourceConcepts: ["perfect-square", "prime-factorization", "divisibility"], stage: "개념 연결", title: "완전제곱수가 되도록 곱할 수 찾기",
      prompt: "540에 곱하여 완전제곱수를 만들 수 있는 가장 작은 양의 정수는 무엇인가요?",
      choices: [6, 10, 12, 15, 30], answer: 3,
      hint: "540을 소인수의 거듭제곱 곱으로 나타내고 지수가 홀수인 소인수를 살펴봐요.",
      solution: ["540 = 2² × 3³ × 5입니다.", "완전제곱수가 되려면 모든 소인수의 지수가 짝수여야 합니다.", "3과 5를 곱하면 540 × 15 = 2² × 3⁴ × 5² = 90²이므로 가장 작은 수는 15입니다."],
      connection: "소인수 지수 중 홀수인 항목만 골라 곱하는 이유는 무엇인가요?"
    },
    {
      id: "amc10-gap-logic-01", domain: "경우의 수", sourceConcepts: ["logical-deduction", "casework"], stage: "연결", title: "진실인 문장 수로 색 정하기",
      prompt: "상자 안 공은 빨강 또는 파랑입니다. A는 ‘빨강이다’, B는 ‘파랑이다’, C는 ‘빨강이다’라고 말했습니다. 세 문장 중 정확히 하나만 참일 때 공은 무슨 색인가요?",
      choices: ["빨강", "파랑", "두 색 모두 가능", "조건을 만족할 수 없음", "초록"], answer: 1,
      hint: "색이 빨강인 경우와 파랑인 경우를 나누어 참인 문장 수를 세어요.",
      solution: ["빨강이라고 가정하면 A와 C가 참이어서 참인 문장이 두 개입니다.", "파랑이라고 가정하면 B만 참이어서 참인 문장이 정확히 하나입니다.", "따라서 공은 파랑입니다."],
      connection: "두 문장이 같은 주장을 하는 점이 경우 나누기에 어떤 영향을 주나요?"
    },
    {
      id: "amc10-gap-absolute-value-01", domain: "대수", sourceConcepts: ["absolute-value", "casework"], stage: "유형", title: "거리의 합이 일정한 점 찾기",
      prompt: "수직선에서 |x − 2| + |x − 8| = 10을 만족하는 실수 x는 몇 개 있나요?",
      choices: [0, 1, 2, 3, 4], answer: 2,
      hint: "x가 2보다 작은 경우, 2와 8 사이인 경우, 8보다 큰 경우를 나누어요.",
      solution: ["2 ≤ x ≤ 8이면 두 거리의 합은 항상 6이므로 해가 없습니다.", "x < 2이면 10 − 2x = 10이므로 x = 0입니다.", "x > 8이면 2x − 10 = 10이므로 x = 10입니다. 해는 두 개입니다."],
      connection: "두 기준점 사이의 거리보다 큰 합을 만들 수 있는 위치가 어디인지 수직선으로 설명해 보세요."
    },
    {
      id: "amc10-gap-custom-operation-01", domain: "대수", sourceConcepts: ["custom-operation", "algebraic-manipulation"], stage: "유형", title: "새 연산의 정의를 순서대로 적용하기",
      prompt: "연산 a ★ b = a + 2b로 정의합니다. (3 ★ 4) ★ 2의 값은 얼마인가요?",
      choices: [13, 14, 15, 16, 17], answer: 2,
      hint: "괄호 안의 3 ★ 4를 먼저 계산해요.",
      solution: ["3 ★ 4 = 3 + 2 × 4 = 11입니다.", "따라서 (3 ★ 4) ★ 2 = 11 ★ 2입니다.", "11 ★ 2 = 11 + 2 × 2 = 15입니다."],
      connection: "★가 일반적인 곱셈 기호와 다른 점을 정의로 설명해 보세요."
    },
    {
      id: "amc10-gap-summation-01", domain: "경우의 수", sourceConcepts: ["summation", "arithmetic-sequence", "pairing-and-grouping"], stage: "연결", title: "등차수열의 합을 짝지어 계산하기",
      prompt: "2 + 4 + 6 + ··· + 40의 값은 얼마인가요?",
      choices: [380, 400, 410, 420, 440], answer: 3,
      hint: "첫 항과 끝 항, 두 번째 항과 끝에서 두 번째 항을 짝지어 보세요.",
      solution: ["짝수 항은 2부터 40까지 20개입니다.", "첫 항과 끝 항의 합은 42이고, 같은 방식으로 짝지으면 10쌍이 생깁니다.", "합은 10 × 42 = 420입니다."],
      connection: "첫 항과 마지막 항을 짝지으면 각 쌍의 합이 같은 이유를 설명해 보세요."
    },
    {
      id: "amc10-gap-bounded-quadratic-01", domain: "대수", sourceConcepts: ["bounding-to-limit-cases", "counting-integers-in-a-range", "quadratic", "optimization"], stage: "연결", title: "곱의 범위를 이차식으로 바꾸기",
      prompt: "0보다 크고 30보다 작은 정수 x 중 x(30 − x) ≥ 200을 만족하는 값은 몇 개 있나요?",
      choices: [9, 10, 11, 12, 13], answer: 2,
      hint: "이차식을 한쪽으로 옮기고, 곱이 0 이하가 되는 두 경계값을 찾아요.",
      solution: ["x(30 − x) ≥ 200은 x² − 30x + 200 ≤ 0과 같습니다.", "x² − 30x + 200 = (x − 10)(x − 20)이므로 조건을 만족하는 실수 x의 범위는 10 ≤ x ≤ 20입니다.", "포함되는 정수는 10부터 20까지 모두 11개입니다."],
      connection: "부등호가 ≥에서 >로 바뀌면 경계 정수 두 개 중 무엇이 제외되나요?"
    },
    {
      id: "amc10-gap-sector-area-01", domain: "기하", sourceConcepts: ["sector", "circle-area", "ratio-and-proportion", "fraction"], stage: "유형", title: "부채꼴 넓이에서 중심각 찾기",
      prompt: "반지름이 12인 원에서 부채꼴의 넓이가 30π입니다. 이 부채꼴의 중심각은 몇 도인가요?",
      choices: ["60°", "75°", "90°", "120°", "150°"], answer: 1,
      hint: "부채꼴 넓이가 원 전체 넓이에서 차지하는 비율을 먼저 구해요.",
      solution: ["원 전체의 넓이는 π × 12² = 144π입니다.", "부채꼴이 전체에서 차지하는 비율은 30π ÷ 144π = 5/24입니다.", "중심각은 360° × 5/24 = 75°입니다."],
      connection: "반지름을 바꾸지 않고 중심각을 두 배로 만들면 부채꼴 넓이는 어떻게 되나요?"
    },
    {
      id: "amc10-gap-ticket-system-01", domain: "대수", sourceConcepts: ["money", "system-of-equations", "linear-equation"], stage: "유형", title: "두 종류 표의 합계로 개수 찾기",
      prompt: "어른 표는 한 장에 12달러, 학생 표는 8달러입니다. 표 18장을 사는 데 모두 184달러를 냈다면 어른 표는 몇 장 샀나요?",
      choices: [6, 8, 10, 12, 14], answer: 2,
      hint: "어른 표 수를 a, 학생 표 수를 s라 하고 장수와 금액에 대한 식을 각각 세워요.",
      solution: ["a + s = 18이고 12a + 8s = 184입니다.", "첫 식에서 s = 18 − a를 구해 둘째 식에 넣으면 12a + 8(18 − a) = 184입니다.", "4a = 40이므로 어른 표는 10장입니다."],
      connection: "학생 표 가격이 9달러라면 같은 18장 조건에서 금액 식은 어떻게 달라지나요?"
    },
    {
      id: "amc10-gap-tangent-circles-01", domain: "기하", sourceConcepts: ["tangent-circles", "circle", "pythagorean-theorem"], stage: "연결", title: "공통 접선 길이를 직각삼각형으로 보기",
      prompt: "반지름이 5cm와 2cm인 두 원이 서로 바깥에서 접합니다. 두 원의 공통 외접선이 각각 닿는 점 사이의 선분 길이는 얼마인가요?",
      choices: ["2√10cm", "4√3cm", "3√5cm", "5√2cm", "2√13cm"], answer: 0,
      hint: "두 중심을 이은 선분과 두 반지름의 차로 직각삼각형을 만들어요.",
      solution: ["두 원이 바깥에서 접하므로 중심 사이 거리는 5 + 2 = 7cm입니다.", "두 중심에서 외접선까지의 수직 거리는 반지름의 차 5 − 2 = 3cm입니다.", "접점 사이 길이를 x라 하면 x² + 3² = 7²이므로 x = √40 = 2√10cm입니다."],
      connection: "두 원이 서로 바깥에서 접한다는 조건이 중심 사이 거리를 어떻게 정하나요?"
    },
    {
      id: "amc10-gap-regular-polygon-01", domain: "기하", sourceConcepts: ["regular-polygon", "angle-sum"], stage: "개념 연결", title: "내각에서 정다각형의 변의 수 찾기",
      prompt: "정다각형의 한 내각의 크기가 156°입니다. 이 다각형의 변은 몇 개인가요?",
      choices: [12, 15, 18, 20, 24], answer: 1,
      hint: "한 외각의 크기는 180°에서 한 내각을 뺀 값이고, 다각형의 외각 합은 360°예요.",
      solution: ["한 외각의 크기는 180° − 156° = 24°입니다.", "정다각형의 외각 합은 360°이므로 변의 수는 360° ÷ 24°입니다.", "따라서 변은 15개입니다."],
      connection: "한 내각이 150°인 정다각형과 이 다각형의 변의 수를 비교해 보세요."
    },
    {
      id: "amc10-gap-rectangle-diagonal-area-01", domain: "기하", sourceConcepts: ["rectangle", "area", "pythagorean-theorem"], stage: "연결", title: "직사각형의 둘레와 대각선으로 넓이 구하기",
      prompt: "직사각형의 둘레는 34cm이고 대각선의 길이는 13cm입니다. 이 직사각형의 넓이는 몇 cm²인가요?",
      choices: [48, 54, 60, 65, 72], answer: 2,
      hint: "가로와 세로의 합과 두 변으로 만든 직각삼각형의 빗변을 이용해요.",
      solution: ["가로를 a, 세로를 b라 하면 a + b = 17이고 a² + b² = 13² = 169입니다.", "(a + b)² = a² + 2ab + b²이므로 289 = 169 + 2ab입니다.", "따라서 ab = 60이고, 직사각형의 넓이는 60cm²입니다."],
      connection: "둘레를 그대로 두고 대각선이 더 길어지면 직사각형의 넓이는 어떻게 변할까요?"
    },
    {
      id: "amc10-gap-cube-space-diagonal-01", domain: "기하", sourceConcepts: ["cube-geometry", "3d-geometry", "pythagorean-theorem"], stage: "유형", title: "정육면체의 공간 대각선 구하기",
      prompt: "한 모서리의 길이가 8cm인 정육면체에서 서로 마주 보는 꼭짓점 사이의 거리는 얼마인가요?",
      choices: ["8√2cm", "8√3cm", "12cm", "16cm", "16√2cm"], answer: 1,
      hint: "먼저 한 면의 대각선을 구한 뒤, 그 대각선과 높이로 직각삼각형을 만들어요.",
      solution: ["정사각형 한 면의 대각선 길이는 √(8²+8²)=8√2cm입니다.", "공간 대각선 d는 d²=(8√2)²+8²=128+64=192를 만족합니다.", "따라서 d=√192=8√3cm입니다."],
      connection: "모서리 길이를 두 배로 늘리면 공간 대각선은 몇 배가 되나요?"
    },
    {
      id: "amc10-gap-prime-factor-divisors-01", domain: "정수론", sourceConcepts: ["prime", "factor-counting", "divisibility"], stage: "연결", title: "소인수 지수로 약수의 개수 세기",
      prompt: "360의 양의 약수 중 6의 배수인 것은 몇 개 있나요?",
      choices: [6, 8, 10, 12, 16], answer: 3,
      hint: "360을 소인수분해한 다음, 약수가 6의 배수가 되기 위해 필요한 지수를 따져요.",
      solution: ["360=2³×3²×5입니다. 약수는 2^a×3^b×5^c 꼴이며 0≤a≤3, 0≤b≤2, 0≤c≤1입니다.", "6의 배수가 되려면 a≥1, b≥1이어야 합니다. a는 1,2,3의 3가지, b는 1,2의 2가지입니다.", "c는 0 또는 1이라 2가지이므로 약수는 3×2×2=12개입니다."],
      connection: "12의 배수인 약수만 세려면 a와 b의 조건이 어떻게 달라지나요?"
    },
    {
      id: "amc10-gap-systematic-listing-01", domain: "경우의 수", sourceConcepts: ["systematic-listing", "digits", "divisibility"], stage: "유형", title: "끝자리 조건으로 세 자리 수 체계적으로 세기",
      prompt: "1, 2, 3, 4, 5를 각각 한 번 이하로 사용해 만들 수 있는 세 자리 수 중 5의 배수는 몇 개 있나요?",
      choices: [6, 8, 10, 12, 16], answer: 3,
      hint: "5의 배수는 일의 자리가 5여야 합니다. 그 뒤 백의 자리와 십의 자리를 차례로 골라요.",
      solution: ["5의 배수이려면 일의 자리는 5로 정해집니다.", "백의 자리는 남은 1,2,3,4 중 하나라 4가지입니다.", "십의 자리는 남은 숫자 중 하나라 3가지이므로 모두 4×3=12개입니다."],
      connection: "같은 숫자를 반복해 써도 된다면 만들 수 있는 수는 몇 개로 바뀌나요?"
    },
    {
      id: "amc10-gap-two-dice-sum-01", domain: "확률", sourceConcepts: ["dice-probability", "basic-probability", "systematic-listing"], stage: "연결", title: "두 주사위의 합을 순서쌍으로 세기",
      prompt: "서로 구별되는 공정한 6면체 주사위 두 개를 던집니다. 눈의 합이 8일 확률은 얼마인가요?",
      choices: ["1/9", "5/36", "1/6", "7/36", "1/4"], answer: 1,
      hint: "두 주사위 눈을 순서가 있는 쌍으로 나타내고 합이 8인 경우만 세어요.",
      solution: ["전체 결과는 (첫째 주사위, 둘째 주사위)의 순서쌍 6×6=36가지입니다.", "합이 8인 경우는 (2,6),(3,5),(4,4),(5,3),(6,2)로 5가지입니다.", "따라서 확률은 5/36입니다."],
      connection: "두 주사위 눈의 합이 7일 확률을 같은 순서쌍 방법으로 구해 보세요."
    },
    {
      id: "amc10-gap-difference-of-squares-01", domain: "대수", sourceConcepts: ["difference-of-squares", "factoring", "algebraic-manipulation"], stage: "유형", title: "가까운 제곱수의 차를 빠르게 계산하기",
      prompt: "1003²−997²의 값은 얼마인가요?",
      choices: [6000, 10000, 12000, 14000, 18000], answer: 2,
      hint: "두 제곱수의 차를 (첫 수−둘째 수)(첫 수+둘째 수)로 바꿔요.",
      solution: ["1003²−997²=(1003−997)(1003+997)입니다.", "차는 6이고 합은 2000입니다.", "따라서 값은 6×2000=12000입니다."],
      connection: "1003²−997² 대신 1004²−996²을 계산할 때도 같은 구조가 어떻게 쓰이나요?"
    },
    {
      id: "amc10-gap-recursion-sequence-01", domain: "대수", sourceConcepts: ["recursion", "geometric-sequence", "exponent"], stage: "연결", title: "점화식의 반복을 등비수열로 바꾸기",
      prompt: "수열이 a₁=1, aₙ₊₁=2aₙ+3으로 정의됩니다. a₅의 값은 얼마인가요?",
      choices: [31, 45, 61, 63, 125], answer: 2,
      hint: "각 항에 3을 더한 새 수열의 항 사이 관계를 살펴보세요.",
      solution: ["bₙ=aₙ+3으로 놓으면 bₙ₊₁=aₙ₊₁+3=2aₙ+6=2bₙ입니다.", "b₁=4이므로 bₙ은 첫째 항 4, 공비 2인 등비수열입니다.", "b₅=4×2⁴=64이므로 a₅=64−3=61입니다."],
      connection: "점화식의 +3을 다른 상수로 바꾸면 등비수열을 만들기 위해 각 항에 더할 수는 어떻게 찾나요?"
    },
    {
      id: "amc10-gap-right-triangle-inradius-01", domain: "기하", sourceConcepts: ["right-triangle", "pythagorean-theorem", "triangle-area"], stage: "연결", title: "직각삼각형의 내접원 반지름 구하기",
      prompt: "직각삼각형의 두 직각변의 길이가 9cm와 12cm입니다. 이 삼각형의 내접원 반지름은 몇 cm인가요?",
      choices: [2, 3, 4, 5, 6], answer: 1,
      hint: "빗변을 구한 뒤 넓이를 두 방식으로 나타내요: 직각변으로 계산한 넓이와 내접원 반지름×반둘레.",
      solution: ["빗변은 √(9²+12²)=15cm입니다.", "삼각형 넓이는 9×12÷2=54cm²이고 반둘레는 (9+12+15)÷2=18cm입니다.", "넓이=내접원 반지름×반둘레이므로 반지름은 54÷18=3cm입니다."],
      connection: "직각변이 5cm와 12cm인 직각삼각형에도 같은 넓이 관계를 적용해 내접원 반지름을 구해 보세요."
    },
    {
      id: "amc10-gap-factorial-trailing-zeros-01", domain: "정수론", sourceConcepts: ["factorial", "prime-factorization", "divisibility"], stage: "유형", title: "계승의 끝에 붙는 0의 개수 세기",
      prompt: "125!을 계산한 정수의 끝에는 0이 몇 개 연속해서 붙나요?",
      choices: [25, 30, 31, 32, 125], answer: 2,
      hint: "끝자리 0 하나마다 2와 5가 한 쌍씩 필요하지만, 계승에서는 2보다 5가 더 드물어요.",
      solution: ["1부터 125까지의 수에 포함된 5의 인수 개수를 세면 됩니다.", "5의 배수에서 25개, 25의 배수에서 추가로 5개, 125에서 추가로 1개가 나옵니다.", "따라서 끝의 0은 25+5+1=31개입니다."],
      connection: "125!에서 2의 인수 개수는 왜 끝자리 0의 개수를 제한하지 않나요?"
    },
    {
      id: "amc10-gap-isosceles-area-01", domain: "기하", sourceConcepts: ["isosceles-triangle", "triangle-area", "pythagorean-theorem"], stage: "유형", title: "이등변삼각형의 높이와 넓이 구하기",
      prompt: "두 같은 변이 각각 10cm이고 밑변이 12cm인 이등변삼각형의 넓이는 몇 cm²인가요?",
      choices: [36, 42, 48, 54, 60], answer: 2,
      hint: "꼭짓점에서 내린 높이는 밑변을 6cm씩 나눕니다.",
      solution: ["높이 h는 h²+6²=10²을 만족하므로 h²=64, h=8cm입니다.", "삼각형 넓이는 밑변×높이÷2입니다.", "따라서 넓이는 12×8÷2=48cm²입니다."],
      connection: "밑변을 16cm로 늘리고 같은 두 변의 길이를 10cm로 두면 삼각형을 만들 수 있는지 먼저 판단해 보세요."
    },
    {
      id: "amc10-gap-radical-simplify-01", domain: "대수", sourceConcepts: ["radical", "perfect-square", "algebraic-manipulation"], stage: "개념 연결", title: "제곱인수를 꺼내 근호식 정리하기",
      prompt: "√50 + √8을 간단히 하면 무엇인가요?",
      choices: ["5√2", "6√2", "7√2", "8√2", "9√2"], answer: 2,
      hint: "각 근호 안에서 가장 큰 완전제곱인수를 찾아 꺼내요.",
      solution: ["√50=√(25×2)=5√2입니다.", "√8=√(4×2)=2√2입니다.", "동류 근호를 더하면 5√2+2√2=7√2입니다."],
      connection: "√18+√32도 같은 근호끼리 모아 정리해 보세요."
    },
    {
      id: "amc10-gap-geometric-probability-circle-01", domain: "확률", sourceConcepts: ["geometric-probability", "circle-area", "area"], stage: "연결", title: "정사각형 안에서 원에 들어갈 확률 구하기",
      prompt: "한 변이 10인 정사각형 안에 꼭 맞게 들어가는 원이 있습니다. 정사각형 안에서 임의의 점을 고를 때 그 점이 원 안에 있을 확률은 얼마인가요?",
      choices: ["1/8 π", "1/4 π", "1/2", "3/4 π", "π"], answer: 1,
      hint: "확률은 원의 넓이를 정사각형의 넓이로 나눈 값이에요.",
      solution: ["정사각형의 넓이는 10²=100입니다.", "내접원의 반지름은 5이므로 넓이는 25π입니다.", "원 안에 있을 확률은 넓이의 비 (25/100)π=(1/4)π입니다."],
      connection: "정사각형 한 변의 길이를 20으로 키우고 원을 계속 꼭 맞게 넣으면 확률은 변하나요?"
    },
    {
      id: "amc10-gap-speed-unit-conversion-01", domain: "수 감각", sourceConcepts: ["unit-conversion", "ratio-and-proportion", "rate"], stage: "유형", title: "시속 킬로미터를 초속 미터로 바꾸기",
      prompt: "시속 72km는 초속 몇 m인가요?",
      choices: ["10", "15", "18", "20", "25"], answer: 3,
      hint: "1km는 1000m, 1시간은 3600초입니다.",
      solution: ["72km/h는 72,000m를 3,600초 동안 간다는 뜻입니다.", "72,000÷3,600=20입니다.", "따라서 속력은 20m/s입니다."],
      connection: "시속 90km를 초속으로 바꾸면 몇 m/s인가요?"
    },
    {
      id: "amc10-gap-coordinate-reflection-translation-01", domain: "기하", sourceConcepts: ["transformation", "coordinate-geometry"], stage: "연결", title: "반사한 점을 평행이동하기",
      prompt: "점 P=(-2, 5)를 x축에 대하여 반사한 뒤, 벡터 (3, -1)만큼 평행이동합니다. 최종 좌표는 무엇인가요?",
      choices: ["(1, -6)", "(1, 4)", "(-5, -6)", "(5, -4)", "(-1, 6)"], answer: 0,
      hint: "x축 반사는 x좌표를 유지하고 y좌표의 부호를 바꿉니다.",
      solution: ["P=(-2, 5)를 x축에 반사하면 (-2, -5)입니다.", "벡터 (3, -1)을 더하면 (-2+3, -5-1)=(1, -6)입니다."],
      connection: "반사와 평행이동을 반대 순서로 하면 최종 좌표가 같을까요? 직접 계산해 보세요."
    },
    {
      id: "amc10-gap-parallel-corresponding-angles-01", domain: "기하", sourceConcepts: ["angle-chasing", "parallel-lines"], stage: "유형", title: "평행선의 동위각으로 식 풀기",
      prompt: "한 직선이 두 평행선을 가로지를 때, 서로 동위 위치에 있는 각의 크기가 각각 (3x+15)°와 (5x−25)°입니다. x의 값은 얼마인가요?",
      choices: ["10", "15", "20", "25", "30"], answer: 2,
      hint: "평행선에서 동위각의 크기는 서로 같습니다.",
      solution: ["동위각이므로 3x+15=5x−25입니다.", "양변에서 3x를 빼고 25를 더하면 40=2x입니다.", "따라서 x=20입니다."],
      connection: "두 직선이 평행하지 않다면 동위각의 크기가 같다고 결론 내릴 수 있나요?"
    },
    {
      id: "amc10-gap-median-data-01", domain: "대수", sourceConcepts: ["median-data"], stage: "유형", title: "중앙값 조건으로 빠진 자료 찾기",
      prompt: "자료 5, 7, 9, 12, 18, 20에 정수 x 하나를 더했더니 중앙값이 11이 되었습니다. x의 값은 무엇인가요?",
      choices: ["9", "10", "11", "12", "13"], answer: 2,
      hint: "자료가 7개가 되므로 크기순으로 배열했을 때 네 번째 값이 중앙값이에요.",
      solution: ["기존 수를 크기순으로 쓰면 5, 7, 9, 12, 18, 20입니다.", "중앙값이 11이 되려면 네 번째 수가 11이어야 하므로 x는 9와 12 사이에 놓여야 합니다.", "x가 정수이므로 가능한 값은 10, 11, 12입니다. 이 중 네 번째 값이 11이 되게 하는 값은 x=11입니다."],
      connection: "중앙값이 10이 되도록 x를 고를 수 있나요? 조건을 확인해 보세요."
    },
    {
      id: "amc10-gap-lcm-repeating-events-01", domain: "수 감각", sourceConcepts: ["least-common-multiple", "date-and-time"], stage: "연결", title: "반복되는 두 일정이 다시 만나는 때",
      prompt: "두 알림이 지금 동시에 울렸습니다. 첫 알림은 8분마다, 둘째 알림은 12분마다 울립니다. 두 알림이 다음으로 동시에 울리는 때는 지금부터 몇 분 뒤인가요?",
      choices: ["16", "20", "24", "32", "48"], answer: 2,
      hint: "두 간격의 공배수 중 가장 작은 수를 찾아요.",
      solution: ["동시에 울리는 시간은 8과 12의 공배수입니다.", "8의 배수는 8, 16, 24, …이고 12의 배수는 12, 24, …입니다.", "최소공배수는 24이므로 24분 뒤에 다시 동시에 울립니다."],
      connection: "두 간격이 9분과 12분이면 다음 동시 알림은 몇 분 뒤인가요?"
    },
    {
      id: "amc10-gap-place-value-reversed-digits-01", domain: "대수", sourceConcepts: ["place-value"], stage: "개념 연결", title: "자리값으로 두 자리 수 복원하기",
      prompt: "십의 자리와 일의 자리 숫자의 합은 11입니다. 원래 수는 숫자를 거꾸로 쓴 수보다 27만큼 큽니다. 원래 수는 무엇인가요?",
      choices: ["47", "56", "65", "74", "83"], answer: 3,
      hint: "십의 자리 숫자를 a, 일의 자리 숫자를 b라 하고 수를 10a+b로 나타내요.",
      solution: ["십의 자리 숫자를 a, 일의 자리 숫자를 b라 하면 a+b=11입니다.", "원래 수와 뒤집은 수의 차는 (10a+b)−(10b+a)=9(a−b)=27이므로 a−b=3입니다.", "두 식을 풀면 a=7, b=4이므로 원래 수는 74입니다."],
      connection: "숫자 합이 9이고 두 수의 차이가 45라면 각 자리 숫자는 무엇인가요?"
    },
    {
      id: "amc10-gap-complementary-count-digit-zero-01", domain: "경우의 수", sourceConcepts: ["complementary-counting", "digits"], stage: "연결", title: "0이 한 번 이상 들어가는 세 자리 수 세기",
      prompt: "각 자리에서 숫자를 반복해도 될 때, 0부터 9까지의 숫자로 만들 수 있는 세 자리 양의 정수 중 적어도 한 자리에 0이 들어가는 수는 몇 개입니까?",
      choices: ["171", "180", "189", "271", "300"], answer: 0,
      hint: "전체 세 자리 수에서 0이 한 번도 나오지 않는 수를 빼면 됩니다.",
      solution: ["전체 세 자리 양의 정수는 100부터 999까지 900개입니다.", "0이 없는 수는 각 자리에 1부터 9까지 9가지씩 선택하므로 9³=729개입니다.", "따라서 적어도 한 자리에 0이 있는 수는 900−729=171개입니다."],
      connection: "네 자리 양의 정수 중 적어도 한 자리에 0이 있는 수는 몇 개일까요?"
    },
    {
      id: "amc10-gap-work-backwards-square-01", domain: "대수", sourceConcepts: ["work-backwards"], stage: "연결", title: "역연산으로 처음 수 찾기",
      prompt: "양의 정수에 2를 곱하고 3을 뺀 다음, 그 결과를 제곱했더니 81이 되었습니다. 처음 수는 무엇인가요?",
      choices: ["3", "4", "5", "6", "7"], answer: 3,
      hint: "제곱하기 전 수는 9 또는 −9일 수 있습니다. 양의 정수 조건도 확인하세요.",
      solution: ["제곱하기 전 수는 9 또는 −9입니다.", "2n−3=9이면 n=6이고, 2n−3=−9이면 n=−3입니다.", "n은 양의 정수이므로 처음 수는 6입니다."],
      connection: "처음 수가 음수도 될 수 있다고 조건을 바꾸면 해는 몇 개가 되나요?"
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
