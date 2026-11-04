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
