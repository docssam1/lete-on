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
      id: "amc8-g7-practice-date-time-01", domain: "data", sourceConcepts: ["date-and-time", "modular-arithmetic"], standard: "수 감각·비율", focus: "경과한 날짜의 요일 구하기", stage: "유형",
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
    },
    {
      id: "amc8-g7-practice-digit-system-01", domain: "algebra", sourceConcepts: ["system-of-equations", "digits", "place-value", "linear-equation"], standard: "대수·규칙", focus: "자릿값 조건을 두 식으로 나타내기", stage: "연결",
      prompt: "두 자리 자연수의 십의 자리와 일의 자리 숫자의 합은 11입니다. 두 자리 숫자를 거꾸로 쓴 수는 원래 수보다 27 작습니다. 원래 수는 얼마인가요?",
      choices: ["47", "65", "74", "83", "92"], answer: 2,
      hint: "십의 자리 숫자를 a, 일의 자리 숫자를 b라 두고 두 조건을 각각 식으로 만들어요.",
      solution: ["십의 자리 숫자를 a, 일의 자리 숫자를 b라 하면 a + b = 11입니다.", "원래 수와 거꾸로 쓴 수의 차는 (10a + b) − (10b + a) = 9(a − b)입니다. 차가 27이므로 a − b = 3입니다.", "두 식을 더하면 2a = 14이므로 a = 7, b = 4입니다. 원래 수는 74입니다."],
      connection: "숫자를 거꾸로 쓴 수가 원래 수보다 18 작다면 두 자리 숫자의 차는 얼마가 되나요?"
    },
    {
      id: "amc8-g7-practice-equilateral-area-01", domain: "geometry", sourceConcepts: ["equilateral-triangle", "triangle-area", "pythagorean-theorem"], standard: "기하·공간", focus: "정삼각형의 높이와 넓이 연결하기", stage: "개념",
      prompt: "한 변의 길이가 10cm인 정삼각형의 넓이는 얼마인가요?",
      choices: ["10√3cm²", "20√3cm²", "25√3cm²", "50√3cm²", "100√3cm²"], answer: 2,
      hint: "꼭짓점에서 밑변에 수선을 내리면 밑변이 반으로 나뉘어요.",
      solution: ["높이를 내리면 밑변 10cm가 5cm씩 나뉩니다.", "피타고라스 정리로 높이는 √(10² − 5²) = 5√3cm입니다.", "넓이는 1/2 × 10 × 5√3 = 25√3cm²입니다."],
      connection: "정삼각형의 한 변이 2배가 되면 넓이가 몇 배가 되는지 높이와 밑변으로 설명해 보세요."
    },
    {
      id: "amc8-g7-practice-cube-net-01", domain: "geometry", sourceConcepts: ["net-3d-geometry", "3d-geometry", "paper-folding"], standard: "기하·공간", focus: "정육면체 전개도에서 마주 보는 면 찾기", stage: "유형",
      prompt: "정육면체 전개도에서 1번 정사각형을 가운데 놓고, 2·3·4·5번 정사각형을 각각 왼쪽·오른쪽·위·아래에 붙였습니다. 6번 정사각형은 4번의 바깥쪽 변에 붙였습니다. 접어서 정육면체를 만들면 1번 면의 맞은편은 몇 번 면인가요?",
      choices: ["2번", "3번", "4번", "5번", "6번"], answer: 4,
      hint: "가운데 1번 면 주위의 네 칸을 옆면으로 접고, 4번 바깥에 붙은 칸을 마지막에 접어요.",
      solution: ["1번에 바로 붙은 2, 3, 4, 5번은 접은 뒤 네 옆면을 이룹니다.", "4번의 바깥쪽에 붙은 6번은 4번과 반대쪽에서 닫히는 면입니다.", "따라서 1번 면과 마주 보는 면은 6번입니다."],
      connection: "6번을 5번의 바깥쪽에 붙인 전개도에서는 어느 면이 1번과 마주 보나요?"
    },
    {
      id: "amc8-g7-practice-domino-coloring-01", domain: "counting", sourceConcepts: ["tiling", "parity", "invariant"], standard: "경우의 수·확률", focus: "색칠 불변량으로 타일링 가능성 판단하기", stage: "연결",
      prompt: "8×8 체스판에서 서로 대각선으로 마주 보는 두 모서리 칸을 제거했습니다. 남은 칸을 1×2 도미노 31개로 빈틈없이 덮을 수 있을까요?",
      choices: ["항상 덮을 수 있어요", "덮을 수 없어요", "도미노를 회전하면 돼요", "모서리 칸 하나를 더 제거해야 해요", "주어진 정보로는 정할 수 없어요"], answer: 1,
      hint: "체스판의 두 색 칸 수를 세고, 도미노 하나가 각 색 칸을 몇 개씩 덮는지 확인해요.",
      solution: ["대각선으로 마주 보는 두 모서리는 체스판에서 같은 색입니다.", "두 칸을 제거하면 한 색은 30칸, 다른 색은 32칸 남습니다.", "도미노 하나는 각 색 칸을 한 칸씩 덮으므로 두 색의 수가 같아야 합니다. 따라서 이 판은 덮을 수 없습니다."],
      connection: "서로 다른 색의 모서리 칸 두 개를 제거하면 이 색칠 논증으로는 어떤 결론까지 내릴 수 있나요?"
    },
    {
      id: "amc8-g7-practice-count-integer-range-01", domain: "counting", sourceConcepts: ["counting-integers-in-a-range", "divisibility"], standard: "수 감각·경우의 수", focus: "음수를 포함한 범위에서 배수 세기", stage: "유형",
      prompt: "−8 이상 15 미만인 정수 중 4의 배수는 몇 개 있나요?",
      choices: ["4개", "5개", "6개", "7개", "8개"], answer: 2,
      hint: "범위의 양 끝에 가까운 4의 배수를 수직선에 차례로 적어요.",
      solution: ["조건을 만족하는 4의 배수는 −8, −4, 0, 4, 8, 12입니다.", "15는 포함하지 않으며, 16은 범위 밖입니다.", "따라서 모두 6개입니다."],
      connection: "범위를 −8 이상 16 이하로 바꾸면 몇 개가 더 포함되나요?"
    },
    {
      id: "amc8-g7-practice-circumference-ratio-01", domain: "geometry", sourceConcepts: ["circumference", "circle", "ratio-and-proportion"], standard: "기하·공간", focus: "원의 반지름과 둘레의 비례 관계", stage: "개념 연결",
      prompt: "반지름이 4cm인 원과 반지름이 7cm인 원의 둘레의 차는 얼마인가요?",
      choices: ["3πcm", "6πcm", "8πcm", "11πcm", "22πcm"], answer: 1,
      hint: "두 원의 둘레를 각각 2πr로 나타내고 큰 쪽에서 작은 쪽을 빼요.",
      solution: ["반지름 7cm인 원의 둘레는 2π × 7 = 14πcm입니다.", "반지름 4cm인 원의 둘레는 2π × 4 = 8πcm입니다.", "둘레의 차는 14π − 8π = 6πcm입니다."],
      connection: "두 원의 반지름이 모두 3배가 되면 둘레의 차는 몇 배가 되나요?"
    },
    {
      id: "amc8-g7-practice-coordinate-rotation-01", domain: "geometry", sourceConcepts: ["transformation", "coordinate-geometry"], standard: "기하·공간", focus: "원점을 중심으로 한 회전 좌표 읽기", stage: "유형",
      prompt: "점 (2, −3)을 원점을 중심으로 반시계 방향으로 90° 회전했습니다. 회전한 점의 좌표는 무엇인가요?",
      choices: ["(−3, −2)", "(−2, 3)", "(3, 2)", "(3, −2)", "(−3, 2)"], answer: 2,
      hint: "반시계 방향 90° 회전은 (x, y)를 (−y, x)로 바꾸어요.",
      solution: ["회전 규칙은 (x, y) → (−y, x)입니다.", "(2, −3)을 대입하면 (−(−3), 2)입니다.", "따라서 회전한 점은 (3, 2)입니다."],
      connection: "같은 점을 시계 방향으로 90° 회전하면 좌표가 어떻게 되나요?"
    },
    {
      id: "amc8-g7-practice-permutation-01", domain: "counting", sourceConcepts: ["permutations", "arrangements-with-restrictions"], standard: "경우의 수·확률", focus: "서로 다른 세 글자를 순서 있게 고르기", stage: "개념 연결",
      prompt: "A, B, C, D 네 글자 중 서로 다른 세 글자를 골라 순서 있게 나열하는 방법은 모두 몇 가지인가요?",
      choices: ["12가지", "18가지", "24가지", "36가지", "64가지"], answer: 2,
      hint: "첫째 자리는 4가지, 둘째 자리는 남은 3가지, 셋째 자리는 남은 2가지예요.",
      solution: ["첫째 자리에 올 글자는 4가지입니다.", "둘째 자리는 남은 글자 중 3가지, 셋째 자리는 남은 글자 중 2가지입니다.", "곱의 법칙으로 4 × 3 × 2 = 24가지입니다."],
      connection: "순서를 무시하고 세 글자만 고른다면 왜 같은 세 글자를 여러 번 세게 되나요?"
    },
    {
      id: "amc8-g7-practice-cryptarithm-01", domain: "number", sourceConcepts: ["cryptarithm", "digits", "place-value"], standard: "수 감각·대수", focus: "두 자리 수와 자리 바꾼 수를 식으로 나타내기", stage: "연결",
      prompt: "서로 다른 0이 아닌 숫자 A와 B로 만든 두 자리 수 AB와 BA가 있습니다. AB+BA=99이고 AB−BA=27일 때 AB는 얼마인가요?",
      choices: ["36", "45", "54", "63", "72"], answer: 3,
      hint: "AB를 10A+B로, BA를 10B+A로 나타내 두 식을 각각 정리해요.",
      solution: ["합 조건은 11(A+B)=99이므로 A+B=9입니다.", "차 조건은 9(A−B)=27이므로 A−B=3입니다.", "두 식을 더해 2A=12이므로 A=6, B=3입니다. 따라서 AB=63입니다."],
      connection: "합은 그대로 두고 차가 45라면 숫자 A와 B는 어떻게 바뀌나요?"
    },
    {
      id: "amc8-g7-practice-arc-length-01", domain: "geometry", sourceConcepts: ["arc", "circle", "ratio-and-proportion"], standard: "기하·공간", focus: "원의 일부에 해당하는 호의 길이 구하기", stage: "유형",
      prompt: "반지름이 9cm인 원에서 한 호의 길이가 원둘레의 1/3입니다. 그 호의 길이는 얼마인가요?",
      choices: ["3πcm", "6πcm", "9πcm", "12πcm", "18πcm"], answer: 1,
      hint: "먼저 원 전체의 둘레를 구한 뒤 그 1/3을 계산해요.",
      solution: ["원둘레는 2π×9=18πcm입니다.", "호의 길이는 원둘레의 1/3이므로 18π÷3입니다.", "따라서 호의 길이는 6πcm입니다."],
      connection: "같은 원에서 호가 원둘레의 1/6이면 길이는 얼마인가요?"
    },
    {
      id: "amc8-g7-practice-telescoping-sum-01", domain: "algebra", sourceConcepts: ["telescoping", "fraction", "pattern-recognition"], standard: "대수·규칙", focus: "차례로 소거되는 분수 합 살피기", stage: "연결",
      prompt: "1/2 + 1/6 + 1/12 + 1/20 + 1/30 + 1/42 + 1/56 + 1/72 + 1/90의 값은 얼마인가요?",
      choices: ["1/2", "7/10", "4/5", "9/10", "1"], answer: 3,
      hint: "각 분수를 앞뒤 두 단위분수의 차로 나타내면 중간 항들이 서로 지워져요.",
      solution: ["각 항은 1/n에서 1/(n+1)을 뺀 값입니다. 예를 들어 1/6=1/2−1/3, 1/12=1/3−1/4입니다.", "모든 항을 이런 식으로 쓰면 +1/2와 −1/2, +1/3과 −1/3처럼 중간 항이 차례로 소거됩니다.", "처음의 1과 마지막의 −1/10만 남으므로 합은 9/10입니다."],
      connection: "같은 규칙으로 1/2 + 1/6 + ··· + 1/(99×100)을 더하면 어떤 두 항만 남나요?"
    },
    {
      id: "amc8-g7-practice-dice-divisibility-01", domain: "probability", sourceConcepts: ["dice-probability", "basic-probability", "divisibility"], standard: "경우의 수·확률", focus: "여사건으로 곱이 3의 배수일 확률 구하기", stage: "연결",
      prompt: "서로 구별되는 공정한 6면체 주사위 두 개를 던집니다. 두 눈의 곱이 3의 배수일 확률은 얼마인가요?",
      choices: ["1/3", "4/9", "1/2", "5/9", "2/3"], answer: 3,
      hint: "곱이 3의 배수가 아닌 경우, 두 눈 모두 3의 배수가 아닌 경우를 먼저 세어요.",
      solution: ["전체 결과는 6×6=36가지입니다.", "곱이 3의 배수가 아니려면 두 눈 모두 1, 2, 4, 5 중 하나여야 합니다. 그런 결과는 4×4=16가지입니다.", "곱이 3의 배수인 결과는 36−16=20가지이므로 확률은 20/36=5/9입니다."],
      connection: "두 주사위 눈의 합이 3의 배수일 확률은 어떤 순서쌍을 세어야 하나요?"
    },
    {
      id: "amc8-g7-practice-volume-scale-01", domain: "geometry", sourceConcepts: ["power-scaling-of-length-area-and-volume", "volume", "ratio-and-proportion"], standard: "기하·공간", focus: "모서리 배율과 정육면체 부피 배율 연결하기", stage: "개념 연결",
      prompt: "모서리가 2cm인 정육면체 모형을 같은 모양으로 모서리 6cm까지 확대했습니다. 확대 전후 부피의 비는 작은 정육면체:큰 정육면체로 얼마인가요?",
      choices: ["1:3", "1:6", "1:9", "1:18", "1:27"], answer: 4,
      hint: "모서리 길이의 배율을 먼저 구하고, 정육면체의 부피는 세 방향 길이를 곱해요.",
      solution: ["모서리 길이는 2cm에서 6cm로 3배가 되었습니다.", "부피는 길이 배율을 세 번 곱하므로 3×3×3=27배가 됩니다.", "따라서 부피의 비는 작은 것:큰 것 = 1:27입니다."],
      connection: "모서리를 4배로 키우면 부피는 몇 배가 되는지 세 방향 그림으로 설명해 보세요."
    },
    {
      id: "amc8-g7-practice-handshake-double-counting-01", domain: "counting", sourceConcepts: ["double-counting", "basic-counting", "combinations"], standard: "경우의 수·확률", focus: "서로 다른 두 사람의 만남을 한 번씩 세기", stage: "연결",
      prompt: "9명이 모여 서로 다른 모든 사람과 한 번씩 악수합니다. 악수는 모두 몇 번 이루어지나요?",
      choices: ["18번", "27번", "36번", "45번", "72번"], answer: 2,
      hint: "각 사람이 8번 악수하지만, 이 방법은 한 악수를 두 사람 쪽에서 각각 셉니다.",
      solution: ["각 사람은 나머지 8명과 악수하므로 사람별로 세면 9×8=72회가 됩니다.", "각 악수는 두 사람 모두의 악수로 한 번씩 세어져 두 번 계산됐습니다.", "실제 악수 횟수는 72÷2=36번입니다."],
      connection: "n명이 모두 서로 한 번씩 악수할 때 중복 세기를 바로잡는 식을 써 보세요."
    },
    {
      id: "amc8-g7-practice-complement-probability-01", domain: "probability", sourceConcepts: ["complementary-probability", "basic-probability", "sampling-without-replacement"], standard: "경우의 수·확률", focus: "여사건으로 적어도 하나가 나올 확률 구하기", stage: "연결",
      prompt: "주머니에 빨간 구슬 4개, 파란 구슬 3개, 초록 구슬 2개가 있습니다. 구슬 2개를 되돌려 놓지 않고 꺼낼 때 빨간 구슬이 적어도 하나 나올 확률은 얼마인가요?",
      choices: ["5/9", "11/18", "13/18", "2/3", "3/4"], answer: 2,
      hint: "빨간 구슬이 하나도 나오지 않는 경우를 먼저 구해 전체 확률에서 빼요.",
      solution: ["전체 구슬은 9개이고 빨간색이 아닌 구슬은 5개입니다.", "빨간 구슬이 하나도 안 나올 확률은 첫 번째가 빨간색 아님일 확률 5/9에, 두 번째도 빨간색 아님일 확률 4/8을 곱한 5/18입니다.", "적어도 하나 빨간 구슬이 나올 확률은 1−5/18=13/18입니다."],
      connection: "구슬을 한 번 꺼낸 뒤 되돌려 놓으면 여사건의 확률 계산이 어떻게 달라지나요?"
    },
    {
      id: "amc8-g7-practice-mode-01", domain: "data", sourceConcepts: ["mode", "data-and-graph-interpretation"], standard: "자료·확률", focus: "자료에서 가장 자주 나온 값 찾기", stage: "개념",
      prompt: "자료 2, 3, 3, 4, 5, 5, 5, 6, 8의 최빈값은 무엇인가요?",
      choices: [2, 3, 4, 5, 6], answer: 3,
      hint: "최빈값은 자료에서 가장 자주 나타나는 값이에요.",
      solution: ["2, 4, 6, 8은 한 번씩 나타납니다.", "3은 두 번, 5는 세 번 나타납니다.", "가장 자주 나타나는 값은 5이므로 최빈값은 5입니다."],
      connection: "자료에 5를 하나 더 추가하면 최빈값은 어떻게 달라지나요?"
    },
    {
      id: "amc8-g7-practice-even-sum-01", domain: "algebra", sourceConcepts: ["summation", "arithmetic-sequence"], standard: "대수·규칙", focus: "등차수열의 합을 짝지어 구하기", stage: "유형",
      prompt: "2+4+6+8+···+30의 값은 얼마인가요?",
      choices: [210, 225, 240, 255, 270], answer: 2,
      hint: "첫 항과 끝 항, 두 번째 항과 끝에서 두 번째 항을 짝지어요.",
      solution: ["2부터 30까지 짝수는 15개입니다.", "첫째와 마지막 항의 합은 32이고, 같은 방식으로 짝지으면 7쌍과 가운데 항 16이 남습니다.", "합은 7×32+16=240입니다."],
      connection: "2부터 40까지 짝수를 더할 때도 끝에서부터 짝지어 합을 구해 보세요."
    },
    {
      id: "amc8-g7-practice-clock-angle-01", domain: "geometry", sourceConcepts: ["clock", "angle-chasing"], standard: "기하·공간", focus: "시침과 분침의 위치로 작은 각 구하기", stage: "유형",
      prompt: "시계가 4시 20분을 가리킬 때 시침과 분침이 이루는 작은 각은 몇 도인가요?",
      choices: ["0°", "5°", "10°", "15°", "20°"], answer: 2,
      hint: "분침은 20분 동안 120°를 돌고, 시침도 그동안 조금 움직여요.",
      solution: ["분침은 12에서 20분만큼 움직여 120° 위치에 있습니다.", "시침은 4시에서 20분 동안 10° 더 움직여 130° 위치에 있습니다.", "두 바늘의 작은 각은 130°−120°=10°입니다."],
      connection: "4시 30분에는 두 바늘 사이의 작은 각이 얼마인지 같은 방식으로 구해 보세요."
    },
    {
      id: "amc8-g7-practice-difference-squares-01", domain: "algebra", sourceConcepts: ["difference-of-squares"], standard: "대수·규칙", focus: "제곱수의 차를 곱셈으로 바꾸기", stage: "개념",
      prompt: "38²−37²의 값을 계산하세요.",
      choices: ["37", "38", "74", "75", "1,425"], answer: 3,
      hint: "두 제곱수의 차는 두 수의 합과 차의 곱으로 나타낼 수 있어요.",
      solution: ["a²−b²=(a−b)(a+b)입니다.", "38²−37²=(38−37)(38+37)=1×75입니다.", "따라서 값은 75입니다."],
      connection: "102²−98²를 직접 제곱하지 않고 계산해 보세요."
    },
    {
      id: "amc8-g7-practice-gcd-equal-packs-01", domain: "number-theory", sourceConcepts: ["greatest-common-divisor"], standard: "수와 연산", focus: "최대공약수로 같은 묶음 수 찾기", stage: "유형",
      prompt: "빨간 카드 84장과 파란 카드 126장을 남김없이 똑같은 구성의 봉투에 나누어 담으려 합니다. 만들 수 있는 봉투의 최대 개수는 몇 개인가요?",
      choices: ["21", "28", "36", "42", "63"], answer: 3,
      hint: "봉투 수는 84와 126을 모두 나누는 수여야 해요.",
      solution: ["봉투 수가 두 카드 수를 모두 나누어야 모든 봉투의 구성이 같아집니다.", "84=2×42이고 126=3×42이므로 42는 두 수의 공약수입니다.", "두 수의 최대공약수는 42이므로 최대 42개 봉투를 만들 수 있습니다."],
      connection: "42개 봉투에 카드 색깔별로 몇 장씩 들어가는지 확인해 보세요."
    },
    {
      id: "amc8-g7-practice-factorial-trailing-zeroes-01", domain: "number-theory", sourceConcepts: ["factorial"], standard: "수와 연산", focus: "계승의 끝자리 0 개수 세기", stage: "연결",
      prompt: "25!의 끝에 붙는 0은 몇 개입니까?",
      choices: ["4", "5", "6", "7", "10"], answer: 2,
      hint: "끝자리 0 하나마다 10을 만들 인수 2와 5가 필요합니다. 25!에는 2가 충분하므로 5의 개수를 세어요.",
      solution: ["1부터 25까지 곱할 때 5의 배수마다 인수 5가 하나 생깁니다. 5, 10, 15, 20, 25에서 다섯 개입니다.", "25에는 5가 두 번 들어 있으므로 인수 5가 하나 더 있습니다.", "인수 5가 모두 6개이므로 끝자리 0도 6개입니다."],
      connection: "50!에서는 5의 배수와 25의 배수를 각각 몇 번 세어야 하나요?"
    },
    {
      id: "amc8-g7-practice-lattice-segment-points-01", domain: "geometry", sourceConcepts: ["lattice-point"], standard: "기하·공간", focus: "격자 선분 위의 정수 좌표 세기", stage: "연결",
      prompt: "좌표평면에서 (0,0)과 (12,8)을 잇는 선분 위에 양 끝점을 포함해 격자점이 몇 개 있나요?",
      choices: ["3", "4", "5", "8", "9"], answer: 2,
      hint: "x좌표와 y좌표가 각각 같은 비율로 정수씩 변하는 점들을 찾아요.",
      solution: ["선분의 방향 변화량은 x가 12, y가 8입니다.", "두 변화량의 최대공약수는 4이므로 선분은 같은 간격의 4개 구간으로 나뉩니다.", "격자점은 구간 수보다 하나 많으므로 양 끝점을 포함해 5개입니다."],
      connection: "(0,0)과 (15,10)을 잇는 선분 위에는 격자점이 몇 개 있나요?"
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
