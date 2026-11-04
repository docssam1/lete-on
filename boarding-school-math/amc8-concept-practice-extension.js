(function (root) {
  "use strict";

  // Additional original GFIELD practice for frequent uncovered AMC 8 concepts.
  const items = [
    {
      id: "amc8-g7-practice-listing-01", domain: "counting", sourceConcepts: ["systematic-listing", "digits", "parity"], standard: "경우의 수·확률", focus: "조건별로 두 자리 수를 나열해 세기", stage: "유형",
      prompt: "숫자 1, 2, 3, 4, 5 중 서로 다른 두 숫자를 골라 두 자리 수를 만듭니다. 두 숫자의 합이 홀수인 수는 몇 개인가요?",
      choices: ["8개", "10개", "14개", "16개", "12개"], answer: 4,
      hint: "합이 홀수가 되려면 홀수와 짝수를 하나씩 골라야 합니다.",
      solution: ["홀수 숫자는 1, 3, 5의 3개이고 짝수 숫자는 2, 4의 2개입니다.", "홀수를 십의 자리에 놓거나 일의 자리에 놓을 수 있으므로 3 × 2 × 2 = 12개입니다."],
      connection: "두 숫자를 반복해서 사용할 수 있다고 바꾸면 경우의 수는 어떻게 달라지나요?"
    },
    {
      id: "amc8-g7-practice-square-01", domain: "geometry", sourceConcepts: ["square-geometry", "symmetry", "area-ratio"], standard: "기하·공간", focus: "정사각형 안의 중점 연결 넓이", stage: "연결",
      prompt: "한 변이 10cm인 정사각형의 네 변 중점을 차례로 이어 작은 정사각형을 만들었습니다. 작은 정사각형의 넓이는 얼마인가요?",
      choices: ["25cm²", "40cm²", "45cm²", "60cm²", "50cm²"], answer: 4,
      hint: "작은 정사각형을 네 모서리의 같은 직각삼각형과 함께 살펴봐요.",
      solution: ["네 변의 중점을 이으면 바깥 정사각형은 넓이가 같은 네 모서리 삼각형과 가운데 정사각형으로 나뉩니다.", "가운데 정사각형의 넓이는 바깥 정사각형 넓이의 절반입니다.", "바깥 넓이는 100cm²이므로 작은 정사각형의 넓이는 50cm²입니다."],
      connection: "중점을 이은 작은 정사각형의 변 길이는 얼마인지 피타고라스 정리로 확인해 보세요."
    },
    {
      id: "amc8-g7-practice-money-01", domain: "number", sourceConcepts: ["money", "percentage", "decimal"], standard: "수 감각·비율", focus: "할인 뒤 세금 계산하기", stage: "연결",
      prompt: "가격이 $50인 물건을 20% 할인한 뒤 할인된 가격에 10% 세금을 붙입니다. 최종 가격은 얼마인가요?",
      choices: ["$40", "$42", "$43", "$45", "$44"], answer: 4,
      hint: "할인한 금액에 세금을 붙인다는 순서를 지켜요.",
      solution: ["$50의 20% 할인액은 $10이므로 할인 뒤 가격은 $40입니다.", "$40의 10%는 $4입니다.", "최종 가격은 $40 + $4 = $44입니다."],
      connection: "세금을 먼저 붙이고 그 뒤 20% 할인하면 가격이 같을까요? 이유를 말해 보세요."
    },
    {
      id: "amc8-g7-practice-median-01", domain: "data", sourceConcepts: ["median-data", "mean"], standard: "정수·자료 해석", focus: "평균으로 빠진 자료를 찾고 중앙값 읽기", stage: "유형",
      prompt: "오름차순으로 정리한 다섯 수는 3, 7, 8, x, 14입니다. 이들의 평균이 9일 때 중앙값은 얼마인가요?",
      choices: ["8", "10", "12", "13", "14"], answer: 0,
      hint: "평균과 자료 개수로 다섯 수의 합을 구해 x를 찾으세요.",
      solution: ["다섯 수의 합은 5 × 9 = 45입니다.", "이미 알려진 네 수의 합은 32이므로 x = 45 − 32 = 13입니다.", "가운데 수는 8이므로 중앙값은 8입니다."],
      connection: "x가 13보다 작았다면 오름차순에서 중앙값을 읽기 전에 어떤 점을 확인해야 하나요?"
    },
    {
      id: "amc8-g7-practice-divisors-01", domain: "number", sourceConcepts: ["prime-factorization", "exponent", "factor-counting"], standard: "수 감각·비율", focus: "소인수분해의 지수로 약수 개수 세기", stage: "연결",
      prompt: "360의 양의 약수는 모두 몇 개인가요?",
      choices: ["24개", "18개", "20개", "30개", "36개"], answer: 0,
      hint: "360을 소인수의 거듭제곱 곱으로 나타내세요.",
      solution: ["360 = 2³ × 3² × 5입니다.", "약수에서 2의 지수는 0부터 3까지, 3의 지수는 0부터 2까지, 5의 지수는 0 또는 1입니다.", "약수의 수는 4 × 3 × 2 = 24개입니다."],
      connection: "소인수의 지수가 하나씩 늘 때 약수의 선택 수가 어떻게 변하나요?"
    },
    {
      id: "amc8-g7-practice-decimal-01", domain: "number", sourceConcepts: ["decimal", "fraction", "whole-number-operations"], standard: "수 감각·비율", focus: "소수 곱을 자리값으로 계산하기", stage: "개념",
      prompt: "0.4 × 0.25의 값은 얼마인가요?",
      choices: ["0.1", "0.01", "0.04", "1", "10"], answer: 0,
      hint: "0.4는 4/10, 0.25는 25/100으로 바꾸어 곱해요.",
      solution: ["0.4 × 0.25 = 4/10 × 25/100입니다.", "분자는 4 × 25 = 100이고 분모는 1000이므로 값은 100/1000 = 0.1입니다."],
      connection: "0.25를 1/4로 바꾸어 계산하면 어떤 계산이 더 간단해지나요?"
    },
    {
      id: "amc8-g7-practice-backwards-01", domain: "algebra", sourceConcepts: ["work-backwards", "linear-equation"], standard: "대수·규칙", focus: "마지막 결과에서 처음 수로 거슬러 풀기", stage: "유형",
      prompt: "어떤 수를 3배 한 뒤 4를 빼고, 그 결과를 2로 나누었더니 10이 되었습니다. 처음 수는 무엇인가요?",
      choices: ["6", "7", "9", "8", "10"], answer: 3,
      hint: "마지막에 한 나눗셈부터 역순으로 되돌려요.",
      solution: ["나누기 2를 되돌리면 10 × 2 = 20입니다.", "4를 뺀 것을 되돌리면 20 + 4 = 24입니다.", "3배를 되돌리면 처음 수는 24 ÷ 3 = 8입니다."],
      connection: "같은 상황을 x를 사용한 방정식으로 나타내면 어떻게 되나요?"
    },
    {
      id: "amc8-g7-practice-surface-area-01", domain: "geometry", sourceConcepts: ["surface-area", "cube-geometry", "multiplication-principle"], standard: "기하·공간", focus: "정육면체의 여섯 면 넓이 더하기", stage: "개념",
      prompt: "한 변이 3cm인 정육면체의 겉넓이는 얼마인가요?",
      choices: ["36cm²", "27cm²", "45cm²", "54cm²", "60cm²"], answer: 3,
      hint: "정육면체에는 같은 크기의 정사각형 면이 몇 개 있나요?",
      solution: ["한 면의 넓이는 3 × 3 = 9cm²입니다.", "면이 6개이므로 겉넓이는 6 × 9 = 54cm²입니다."],
      connection: "모든 모서리 길이를 2배로 하면 겉넓이는 몇 배가 되나요?"
    },
    {
      id: "amc8-g7-practice-square-factor-01", domain: "number", sourceConcepts: ["perfect-square", "prime-factorization", "multiple"], standard: "수 감각·비율", focus: "완전제곱수가 되도록 소인수 보완하기", stage: "연결",
      prompt: "180에 곱하여 완전제곱수를 만들 수 있는 가장 작은 양의 정수는 무엇인가요?",
      choices: ["2", "3", "5", "6", "10"], answer: 2,
      hint: "완전제곱수의 소인수분해에서는 각 소인수의 지수가 짝수입니다.",
      solution: ["180 = 2² × 3² × 5입니다.", "소인수 5의 지수만 홀수이므로 5를 한 번 더 곱해야 합니다.", "180 × 5 = 900 = 30²이므로 가장 작은 수는 5입니다."],
      connection: "180에 5 대신 2를 곱하면 왜 완전제곱수가 되지 않나요?"
    },
    {
      id: "amc8-g7-practice-pairing-01", domain: "number", sourceConcepts: ["pairing-and-grouping", "arithmetic-sequence", "systematic-listing"], standard: "수 감각·비율", focus: "짝을 지어 같은 합을 만들기", stage: "유형",
      prompt: "2 + 4 + 6 + … + 100의 값은 얼마인가요?",
      choices: ["2500", "2505", "2550", "2600", "2750"], answer: 2,
      hint: "처음과 끝, 두 번째와 끝에서 두 번째를 짝지어 보세요.",
      solution: ["짝수는 2부터 100까지 50개입니다.", "첫째 수와 마지막 수의 합은 102이고, 각 쌍의 합이 같습니다.", "합은 50 × 102 ÷ 2 = 2550입니다."],
      connection: "1부터 100까지 모두 더할 때 같은 짝짓기 방법을 쓰면 합은 얼마인가요?"
    },
    {
      id: "amc8-g7-practice-order-operations-01", domain: "algebra", sourceConcepts: ["order-of-operations", "exponent", "fraction"], standard: "대수·규칙", focus: "거듭제곱과 나눗셈의 순서", stage: "개념 연결",
      prompt: "식 3² + 24 ÷ 6 × 2의 값은 얼마인가요?",
      choices: ["11", "13", "15", "17", "25"], answer: 3,
      hint: "거듭제곱을 먼저 계산한 뒤, 나눗셈과 곱셈은 왼쪽부터 차례로 해요.",
      solution: ["3² = 9입니다.", "24 ÷ 6 × 2는 왼쪽부터 계산해 4 × 2 = 8입니다.", "9 + 8 = 17입니다."],
      connection: "괄호를 24 ÷ (6 × 2)로 바꾸면 값이 어떻게 달라지는지 설명해 보세요."
    },
    {
      id: "amc8-g7-practice-prime-units-01", domain: "number", sourceConcepts: ["prime", "factor", "units-digit", "divisibility"], standard: "수 감각·비율", focus: "소수의 배수에서 일의 자리 찾기", stage: "유형",
      prompt: "소수 13의 양의 배수 중 100보다 작은 수는 모두 몇 개이며, 그중 일의 자리가 9인 수는 몇 개인가요?",
      choices: ["7개와 1개", "7개와 2개", "8개와 1개", "8개와 2개", "9개와 2개"], answer: 1,
      hint: "13의 배수를 차례로 적고, 100을 넘기기 직전에서 멈춰요.",
      solution: ["13의 1배부터 7배까지는 13, 26, 39, 52, 65, 78, 91입니다. 13 × 8 = 104이므로 100보다 작은 배수는 7개입니다.", "일의 자리가 9인 수는 39와 91, 두 개입니다."],
      connection: "13 대신 다른 소수를 곱할 때 일의 자리의 반복 주기를 어떻게 확인할 수 있을까요?"
    },
    {
      id: "amc8-g7-practice-volume-01", domain: "geometry", sourceConcepts: ["volume", "rectangular-prism", "unit-conversion"], standard: "기하·공간", focus: "직육면체의 부피와 단위 변환", stage: "개념 연결",
      prompt: "가로 30cm, 세로 20cm, 높이 15cm인 상자의 부피는 몇 리터인가요? (1L = 1000cm³)",
      choices: ["6L", "9L", "12L", "15L", "90L"], answer: 1,
      hint: "먼저 세 길이를 곱해 cm³로 구한 다음 1000으로 나누세요.",
      solution: ["상자의 부피는 30 × 20 × 15 = 9000cm³입니다.", "1000cm³가 1L이므로 9000cm³ = 9L입니다."],
      connection: "세 길이를 모두 2배로 늘리면 부피가 몇 배가 되는지 곱셈으로 설명해 보세요."
    },
    {
      id: "amc8-g7-practice-date-time-01", domain: "data", sourceConcepts: ["date-and-time", "modular-arithmetic", "elapsed-time"], standard: "수 감각·비율", focus: "경과한 날짜의 요일 구하기", stage: "유형",
      prompt: "어느 달의 1일이 월요일입니다. 100일 뒤는 무슨 요일인가요?",
      choices: ["월요일", "화요일", "수요일", "목요일", "금요일"], answer: 2,
      hint: "한 주가 7일마다 반복되므로 100을 7로 나눈 나머지를 살펴보세요.",
      solution: ["100 = 7 × 14 + 2이므로 100일은 14주와 2일입니다.", "월요일에서 이틀 뒤는 수요일입니다."],
      connection: "‘100일 뒤’가 아니라 ‘100일째’를 세는 상황이라면 시작일을 포함해야 하는지 먼저 따져 보세요."
    },
    {
      id: "amc8-g7-practice-custom-operation-01", domain: "algebra", sourceConcepts: ["custom-operation", "order-of-operations", "substitution"], standard: "대수·규칙", focus: "새 연산 기호를 식에 대입하기", stage: "개념 연결",
      prompt: "실수 a, b에 대해 a ★ b = 2a − b로 정합니다. (4 ★ 3) ★ 2의 값은 얼마인가요?",
      choices: ["3", "5", "6", "8", "10"], answer: 3,
      hint: "괄호 안의 4 ★ 3부터 정의에 따라 계산해요.",
      solution: ["4 ★ 3 = 2 × 4 − 3 = 5입니다.", "따라서 (4 ★ 3) ★ 2 = 5 ★ 2 = 2 × 5 − 2 = 8입니다."],
      connection: "★의 정의에서 2a − b 대신 a − 2b를 쓰면 같은 식의 값은 어떻게 바뀌나요?"
    },
    {
      id: "amc8-g7-practice-complement-counting-01", domain: "counting", sourceConcepts: ["complementary-counting", "divisibility", "inclusion-exclusion"], standard: "경우의 수·확률", focus: "배수의 여집합을 세고 겹침 조정하기", stage: "연결",
      prompt: "1부터 100까지의 정수 중 3의 배수도 5의 배수도 아닌 수는 몇 개인가요?",
      choices: ["47", "50", "53", "57", "60"], answer: 2,
      hint: "전체 100개에서 3의 배수와 5의 배수를 빼고, 두 번 뺀 공배수는 한 번 더해요.",
      solution: ["3의 배수는 ⌊100 ÷ 3⌋ = 33개, 5의 배수는 20개입니다.", "두 번 센 15의 배수 6개를 한 번 더해, 3 또는 5의 배수는 33 + 20 − 6 = 47개입니다.", "둘 다 아닌 수는 100 − 47 = 53개입니다."],
      connection: "‘3이나 5 중 하나만 나누는 수’를 세려면 공배수를 어떻게 다뤄야 할까요?"
    },
    {
      id: "amc8-g7-practice-angle-chasing-01", domain: "geometry", sourceConcepts: ["angle-chasing", "isosceles-triangle", "angle-sum"], standard: "기하·공간", focus: "이등변삼각형에서 바깥각으로 밑각 구하기", stage: "유형",
      prompt: "이등변삼각형의 꼭짓점에서 한 변을 연장했더니 바깥각이 128°입니다. 두 밑각은 각각 몇 도인가요?",
      choices: ["24°", "26°", "52°", "64°", "76°"], answer: 3,
      hint: "먼저 바깥각과 꼭짓점 안쪽 각이 일직선의 각임을 이용해요.",
      solution: ["꼭짓점 안쪽 각은 180° − 128° = 52°입니다.", "삼각형의 나머지 두 각의 합은 180° − 52° = 128°입니다.", "이등변삼각형의 밑각은 같으므로 각 밑각은 128° ÷ 2 = 64°입니다."],
      connection: "바깥각을 바꾸어도 두 밑각이 같은 이유를 이등변삼각형의 성질로 설명해 보세요."
    },
    {
      id: "amc8-g7-practice-extremal-01", domain: "counting", sourceConcepts: ["extremal-argument", "pigeonhole-principle", "casework"], standard: "경우의 수·확률", focus: "연속한 두 수를 반드시 고르는 최소 개수", stage: "연결",
      prompt: "1부터 12까지의 정수 중 몇 개를 골라야 연속한 두 정수를 반드시 포함한다고 보장할 수 있나요?",
      choices: ["5개", "6개", "7개", "8개", "12개"], answer: 2,
      hint: "연속한 수끼리 (1,2), (3,4), …처럼 짝지어 보세요.",
      solution: ["짝은 (1,2), (3,4), (5,6), (7,8), (9,10), (11,12)의 6개입니다.", "각 짝에서 하나씩만 고르면 6개를 골라도 연속한 두 수를 피할 수 있습니다.", "7개를 고르면 어떤 짝에서는 두 수를 모두 골라야 하므로 연속한 두 수가 반드시 있습니다."],
      connection: "1부터 20까지라면 연속한 두 수를 보장하려면 최소 몇 개를 골라야 할까요?"
    },
    {
      id: "amc8-g7-practice-geometric-sequence-01", domain: "algebra", sourceConcepts: ["geometric-sequence", "exponent", "pattern-recognition"], standard: "대수·규칙", focus: "공비가 일정한 수열의 항 구하기", stage: "유형",
      prompt: "수열 2, 6, 18, 54, …에서 7번째 항은 얼마인가요?",
      choices: ["486", "729", "1458", "2187", "4374"], answer: 2,
      hint: "각 항에 같은 수를 곱해 다음 항을 만들어요.",
      solution: ["공비는 3이므로 각 항은 앞 항의 3배입니다.", "7번째 항은 2 × 3⁶ = 2 × 729 = 1458입니다."],
      connection: "이 수열의 n번째 항을 2와 3을 사용해 나타내 보세요."
    },
    {
      id: "amc8-g7-practice-coordinate-distance-01", domain: "geometry", sourceConcepts: ["coordinate-geometry", "distance-formula", "pythagorean-theorem"], standard: "기하·공간", focus: "좌표 차이로 두 점 사이 거리 구하기", stage: "연결",
      prompt: "좌표평면의 두 점 A(−3, 2), B(5, 2) 사이의 거리는 얼마인가요?",
      choices: ["6", "8", "10", "12", "14"], answer: 1,
      hint: "두 점의 y좌표가 같으므로 가로 방향 차이만 계산하면 돼요.",
      solution: ["두 점은 같은 수평선 위에 있습니다.", "가로 좌표의 차이는 5 − (−3) = 8이므로 거리는 8입니다."],
      connection: "두 점의 y좌표가 다르면 수평·수직 이동을 직각삼각형으로 어떻게 나타낼 수 있나요?"
    },
    {
      id: "amc8-g7-practice-similarity-scale-01", domain: "geometry", sourceConcepts: ["similarity", "ratio-and-proportion", "area-ratio"], standard: "기하·공간", focus: "닮음비와 넓이비 연결하기", stage: "개념 연결",
      prompt: "닮은 두 삼각형의 대응하는 변의 길이비가 작은 삼각형 대 큰 삼각형 = 2:3입니다. 작은 삼각형의 넓이가 20cm²라면 큰 삼각형의 넓이는 얼마인가요?",
      choices: ["30cm²", "40cm²", "45cm²", "60cm²", "80cm²"], answer: 2,
      hint: "넓이는 길이비가 아니라 길이비의 제곱에 따라 변해요.",
      solution: ["닮음비는 2:3이므로 넓이비는 2²:3² = 4:9입니다.", "작은 넓이 20cm²는 넓이비의 4에 해당하므로 한 몫은 5cm²입니다.", "큰 삼각형의 넓이는 9 × 5 = 45cm²입니다."],
      connection: "대응하는 길이가 3배가 되면 넓이가 몇 배가 되는지 그림으로 설명해 보세요."
    },
    {
      id: "amc8-g7-practice-trapezoid-01", domain: "geometry", sourceConcepts: ["trapezoid", "area", "unit-conversion"], standard: "기하·공간", focus: "평행한 두 변을 이용해 사다리꼴 넓이 구하기", stage: "유형",
      prompt: "평행한 두 변의 길이가 8cm와 14cm이고 높이가 5cm인 사다리꼴의 넓이는 얼마인가요?",
      choices: ["45cm²", "50cm²", "55cm²", "60cm²", "70cm²"], answer: 2,
      hint: "평행한 두 변의 평균 길이에 높이를 곱해요.",
      solution: ["사다리꼴 넓이는 (평행한 두 변의 합) × 높이 ÷ 2입니다.", "(8 + 14) × 5 ÷ 2 = 22 × 2.5 = 55cm²입니다."],
      connection: "두 평행한 변의 길이가 같아지면 어떤 도형의 넓이 공식으로 이어지나요?"
    },
    {
      id: "amc8-g7-practice-lcm-overlap-01", domain: "counting", sourceConcepts: ["least-common-multiple", "inclusion-exclusion", "basic-counting"], standard: "수 감각·경우의 수", focus: "공배수로 겹치는 항목 빼기", stage: "유형",
      prompt: "1부터 120까지 번호가 붙은 카드 중 6의 배수 또는 8의 배수인 카드는 몇 장인가요?",
      choices: ["25장", "30장", "35장", "40장", "45장"], answer: 1,
      hint: "6의 배수와 8의 배수를 각각 세고, 양쪽에 모두 포함된 수는 한 번 빼요.",
      solution: ["6의 배수는 120 ÷ 6 = 20개, 8의 배수는 120 ÷ 8 = 15개입니다.", "두 수의 최소공배수는 24이므로 둘 다의 배수는 120 ÷ 24 = 5개입니다.", "겹친 5개를 한 번 빼면 20 + 15 − 5 = 30장입니다."],
      connection: "두 배수 조건이 겹치는 수를 한 번 빼지 않으면 왜 중복해서 세게 되나요?"
    },
    {
      id: "amc8-g7-practice-even-digit-cases-01", domain: "counting", sourceConcepts: ["basic-counting", "digits", "parity", "arrangements-with-restrictions"], standard: "경우의 수·확률", focus: "자리 조건을 나누어 세기", stage: "연결",
      prompt: "0, 1, 2, 3, 4, 5, 6 중 서로 다른 세 숫자를 써서 400보다 큰 짝수 세 자리 수를 만들려고 합니다. 만들 수 있는 수는 모두 몇 개인가요?",
      choices: ["40개", "45개", "50개", "55개", "60개"], answer: 2,
      hint: "백의 자리 숫자를 4, 5, 6으로 나누고, 각 경우에 일의 자리부터 고르세요.",
      solution: ["백의 자리가 4이면 일의 자리는 0, 2, 6 중 하나라서 3가지입니다. 각 경우 십의 자리는 남은 5가지이므로 15개입니다.", "백의 자리가 5이면 일의 자리는 0, 2, 4, 6 중 하나라서 4 × 5 = 20개입니다.", "백의 자리가 6이면 일의 자리는 0, 2, 4 중 하나라서 3 × 5 = 15개입니다. 모두 15 + 20 + 15 = 50개입니다."],
      connection: "서로 다른 숫자 조건을 없애면 각 백의 자리 경우의 수가 어떻게 바뀌나요?"
    }
  ];

  root.GFIELDAMC8ConceptPracticeExtension = Object.freeze({
    items: Object.freeze(items.map(function (item) {
      return Object.freeze(Object.assign({}, item, {
        sourceConcepts: Object.freeze(item.sourceConcepts),
        choices: Object.freeze(item.choices),
        solution: Object.freeze(item.solution)
      }));
    }))
  });
})(typeof window !== "undefined" ? window : globalThis);
