(function (root) {
  "use strict";
  const items = [
    { id: "amc8-g7-m01", standard: "수 감각·비율", focus: "곱셈과 뺄셈", prompt: "연필이 한 상자에 6자루씩 들어 있습니다. 5상자에서 연필 7자루를 쓰고 나면 몇 자루가 남나요?", choices: ["23자루", "25자루", "27자루", "30자루"], answer: 0, solution: "처음 연필은 6×5=30자루입니다. 7자루를 쓰면 30−7=23자루가 남습니다." },
    { id: "amc8-g7-m02", standard: "수 감각·비율", focus: "분수의 양", prompt: "28개의 구슬 중 3/4은 몇 개인가요?", choices: ["18개", "21개", "24개", "25개"], answer: 1, solution: "28×3/4=(28÷4)×3=7×3=21개입니다." },
    { id: "amc8-g7-m03", standard: "수 감각·비율", focus: "비의 몫", prompt: "빨간 구슬과 파란 구슬의 수의 비는 2:5입니다. 구슬이 모두 42개라면 파란 구슬은 몇 개인가요?", choices: ["12개", "24개", "30개", "35개"], answer: 2, solution: "비의 전체 몫은 2+5=7입니다. 한 몫은 42÷7=6개이므로 파란 구슬은 5×6=30개입니다." },
    { id: "amc8-g7-m04", standard: "수 감각·비율", focus: "백분율", prompt: "80의 15%는 얼마인가요?", choices: ["8", "10", "11", "12"], answer: 3, solution: "15%=0.15이므로 80×0.15=12입니다." },
    { id: "amc8-g7-m05", standard: "수 감각·비율", focus: "단위율", prompt: "자동차가 3시간 동안 156마일을 일정한 속력으로 달렸습니다. 1시간 동안 달린 거리는 몇 마일인가요?", choices: ["52마일", "48마일", "54마일", "60마일"], answer: 0, solution: "시간당 거리는 전체 거리를 시간으로 나눈 값입니다. 156÷3=52마일입니다." },
    { id: "amc8-g7-m06", standard: "대수·규칙", focus: "수열의 규칙", prompt: "수열 4, 7, 10, 13, …에서 다음 수는 무엇인가요?", choices: ["15", "16", "17", "18"], answer: 1, solution: "각 항에 3을 더합니다. 다음 수는 13+3=16입니다." },
    { id: "amc8-g7-m07", standard: "대수·규칙", focus: "일차방정식", prompt: "5x−4=31을 만족하는 x는 무엇인가요?", choices: ["5", "6", "7", "8"], answer: 2, solution: "양변에 4를 더하면 5x=35이고, 양변을 5로 나누면 x=7입니다." },
    { id: "amc8-g7-m08", standard: "대수·규칙", focus: "제곱수의 규칙", prompt: "1, 4, 9, 16, …은 연속한 양의 정수의 제곱입니다. 다음 수는 무엇인가요?", choices: ["20", "24", "30", "25"], answer: 3, solution: "주어진 수는 1², 2², 3², 4²입니다. 다음 수는 5²=25입니다." },
    { id: "amc8-g7-m09", standard: "대수·규칙", focus: "상황을 식으로 나타내기", prompt: "공책 한 권의 가격은 x달러입니다. 공책 2권과 $1짜리 지우개 하나의 가격이 모두 $9라면, 공책 한 권의 가격은 얼마인가요?", choices: ["$4", "$3", "$4.50", "$5"], answer: 0, solution: "2x+1=9이므로 2x=8, x=4입니다." },
    { id: "amc8-g7-m10", standard: "대수·규칙", focus: "나눗셈 관계", prompt: "어떤 수를 3으로 나누면 8입니다. 그 수는 무엇인가요?", choices: ["11", "24", "27", "32"], answer: 1, solution: "나누어지는 수는 몫과 나누는 수의 곱입니다. 8×3=24입니다." },
    { id: "amc8-g7-m11", standard: "기하·좌표", focus: "직사각형의 넓이", prompt: "가로가 7cm이고 세로가 5cm인 직사각형의 넓이는 얼마인가요?", choices: ["24cm²", "30cm²", "35cm²", "40cm²"], answer: 2, solution: "직사각형의 넓이는 가로×세로입니다. 7×5=35cm²입니다." },
    { id: "amc8-g7-m12", standard: "기하·좌표", focus: "삼각형 내각의 합", prompt: "삼각형의 두 각이 38°와 72°입니다. 나머지 각은 몇 도인가요?", choices: ["60°", "68°", "72°", "70°"], answer: 3, solution: "삼각형의 내각의 합은 180°입니다. 180°−38°−72°=70°입니다." },
    { id: "amc8-g7-m13", standard: "기하·좌표", focus: "합성 도형의 넓이", prompt: "한 변이 8cm인 정사각형에서 3cm×4cm 직사각형 조각을 잘라 냈습니다. 남은 넓이는 얼마인가요?", choices: ["52cm²", "48cm²", "56cm²", "60cm²"], answer: 0, solution: "정사각형의 넓이는 8×8=64cm²이고 잘라 낸 넓이는 3×4=12cm²입니다. 64−12=52cm²입니다." },
    { id: "amc8-g7-m14", standard: "기하·좌표", focus: "좌표평면에서 수평 거리", prompt: "좌표평면에서 A=(-2, 1), B=(5, 1)입니다. 선분 AB의 길이는 얼마인가요?", choices: ["5", "7", "8", "9"], answer: 1, solution: "두 점의 y좌표가 같으므로 수평 거리입니다. |5−(−2)|=7입니다." },
    { id: "amc8-g7-m15", standard: "기하·좌표", focus: "직사각형의 둘레", prompt: "직사각형의 둘레가 34cm이고 긴 변이 11cm입니다. 짧은 변은 몇 cm인가요?", choices: ["5", "7", "6", "12"], answer: 2, solution: "둘레는 2(11+w)=34이므로 11+w=17, w=6cm입니다." },
    { id: "amc8-g7-m16", standard: "경우의 수·확률", focus: "곱의 법칙", prompt: "셔츠가 3종류, 바지가 4종류 있습니다. 셔츠 한 장과 바지 한 벌을 고르는 방법은 모두 몇 가지인가요?", choices: ["7", "10", "11", "12"], answer: 3, solution: "셔츠를 고르는 3가지 선택마다 바지 선택이 4가지 있습니다. 3×4=12가지입니다." },
    { id: "amc8-g7-m17", standard: "경우의 수·확률", focus: "여사건의 확률", prompt: "공정한 동전을 두 번 던집니다. 적어도 한 번 뒷면이 나올 확률은 얼마인가요?", choices: ["3/4", "1/4", "1/2", "1"], answer: 0, solution: "가능한 결과는 HH, HT, TH, TT 네 가지입니다. 적어도 한 번 뒷면인 경우는 HT, TH, TT이므로 3/4입니다." },
    { id: "amc8-g7-m18", standard: "경우의 수·확률", focus: "짝수 합의 경우의 수", prompt: "1, 2, 3, 4 중 서로 다른 두 수를 뽑습니다. 뽑은 두 수의 합이 짝수일 확률은 얼마인가요?", choices: ["1/2", "1/3", "2/3", "1/6"], answer: 1, solution: "전체 쌍은 6개입니다. 합이 짝수인 쌍은 (1,3), (2,4) 두 개이므로 확률은 2/6=1/3입니다." },
    { id: "amc8-g7-m19", standard: "경우의 수·확률", focus: "순열", prompt: "서로 다른 책 3권을 책장에 한 줄로 놓는 방법은 몇 가지인가요?", choices: ["3", "5", "6", "9"], answer: 2, solution: "첫 자리에 3가지, 둘째 자리에 2가지, 마지막 자리에 1가지가 있습니다. 3×2×1=6가지입니다." },
    { id: "amc8-g7-m20", standard: "경우의 수·확률", focus: "비복원 추출", prompt: "흰 공 3개와 검은 공 2개가 든 주머니에서 공 2개를 차례로, 되돌려 놓지 않고 꺼냅니다. 두 공의 색이 같을 확률은 얼마인가요?", choices: ["1/5", "1/3", "1/2", "2/5"], answer: 3, solution: "전체 두 공 조합은 5개 중 2개를 고르는 10가지입니다. 같은 색은 흰 공 쌍 3가지와 검은 공 쌍 1가지, 모두 4가지이므로 4/10=2/5입니다." },
    { id: "amc8-g7-m21", standard: "정수·자료 해석", focus: "배수의 합집합", prompt: "1부터 30까지의 정수 중 3 또는 5의 배수는 몇 개인가요?", choices: ["14", "12", "15", "16"], answer: 0, solution: "3의 배수는 10개, 5의 배수는 6개입니다. 15와 30이 두 번 세어졌으므로 10+6−2=14개입니다." },
    { id: "amc8-g7-m22", standard: "정수·자료 해석", focus: "연속한 정수", prompt: "연속한 세 정수의 합이 72입니다. 가운데 정수는 무엇인가요?", choices: ["22", "24", "25", "26"], answer: 1, solution: "세 수를 n−1, n, n+1로 두면 합은 3n입니다. 3n=72이므로 가운데 수 n=24입니다." },
    { id: "amc8-g7-m23", standard: "정수·자료 해석", focus: "평균으로 빠진 값 찾기", prompt: "6개의 점수의 평균이 11입니다. 그중 다섯 점수가 8, 9, 10, 12, 13이라면 나머지 점수는 얼마인가요?", choices: ["12", "13", "14", "15"], answer: 2, solution: "전체 합은 6×11=66입니다. 알려진 다섯 점수의 합은 52이므로 나머지는 66−52=14입니다." },
    { id: "amc8-g7-m24", standard: "정수·자료 해석", focus: "격자에서 정사각형 세기", prompt: "정사각형 격자가 4칸×4칸입니다. 격자선을 변으로 하는 정사각형은 크기를 모두 합해 몇 개인가요?", choices: ["24", "25", "28", "30"], answer: 3, solution: "한 칸짜리 16개, 2칸짜리 9개, 3칸짜리 4개, 4칸짜리 1개입니다. 합은 16+9+4+1=30개입니다." },
    { id: "amc8-g7-m25", standard: "정수·자료 해석", focus: "최소공배수와 나머지", prompt: "2, 3, 4, 5로 각각 나누었을 때 나머지가 그 수보다 1 작은 가장 작은 양의 정수는 무엇인가요?", choices: ["59", "60", "119", "29"], answer: 0, solution: "찾는 수에 1을 더하면 2, 3, 4, 5의 공배수입니다. 최소공배수는 60이므로 가장 작은 양의 답은 60−1=59입니다." }
  ];
  const exam = Object.freeze({
    id: "gfield-grade7-amc8-style-mock-v1", formVersion: "2026-11-04-v1", grade: 7, clusterId: "AMC8",
    title: "지필드 AMC 8 스타일 모의고사 · 1회", durationMinutes: 40,
    standards: Object.freeze(["수 감각·비율", "대수·규칙", "기하·좌표", "경우의 수·확률", "정수·자료 해석"]),
    nextStudyHref: "./competition-practice.html?program=amc8", nextStudyLabel: "지필드 경시 유형 연습으로 이어가기 →",
    items: Object.freeze(items.map(function (item) { return Object.freeze(item); }))
  });
  root.GFIELDGrade7UnitMock = exam;
})(typeof window === "undefined" ? globalThis : window);
