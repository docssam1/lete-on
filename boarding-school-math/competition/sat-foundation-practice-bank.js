(function (root) {
  "use strict";
  const items = [
    {
      id: "sat-foundation-rate-01", domain: "문제 해결·자료 분석", stage: "기본", title: "같은 비율로 분량 늘리기",
      prompt: "머핀 12개를 만들 때 밀가루 3/4컵이 필요합니다. 같은 비율로 머핀 20개를 만들 때 필요한 밀가루는 몇 컵인가요?",
      choices: ["1컵", "5/4컵", "3/2컵", "2컵", "5/2컵"], answer: 1,
      hint: "머핀 한 개에 필요한 양을 먼저 구한 다음 20을 곱해 보세요.",
      solution: ["12개에 3/4컵이므로 한 개에는 (3/4) ÷ 12 = 1/16컵이 필요합니다.", "20개에는 20 × 1/16 = 20/16 = 5/4컵이 필요합니다."],
      connection: "머핀 수가 두 배가 되면 필요한 밀가루 양도 어떻게 변하나요?"
    },
    {
      id: "sat-foundation-rate-02", domain: "문제 해결·자료 분석", stage: "기본", title: "시간당 이동 거리 읽기",
      prompt: "자전거가 3시간 동안 54마일을 일정한 속력으로 이동했습니다. 시간당 이동 거리는 얼마인가요?",
      choices: ["15마일/시간", "16마일/시간", "18마일/시간", "21마일/시간", "162마일/시간"], answer: 2,
      hint: "전체 거리를 시간으로 나누어 단위율을 구합니다.",
      solution: ["시간당 이동 거리는 전체 거리 ÷ 시간입니다.", "54 ÷ 3 = 18이므로 속력은 18마일/시간입니다."],
      connection: "같은 속력으로 5시간 이동하면 거리는 어떻게 계산하나요?"
    },
    {
      id: "sat-foundation-percent-01", domain: "문제 해결·자료 분석", stage: "기본", title: "할인율을 가격에 적용하기",
      prompt: "80달러인 가방을 15% 할인합니다. 할인 후 가격은 얼마인가요?",
      choices: ["12달러", "65달러", "68달러", "72달러", "92달러"], answer: 2,
      hint: "먼저 80달러의 15%를 구하고, 그 할인액을 원래 가격에서 빼세요.",
      solution: ["할인액은 80 × 0.15 = 12달러입니다.", "할인 후 가격은 80 − 12 = 68달러입니다."],
      connection: "할인 후 가격이 원래 가격의 몇 퍼센트인지 두 가지 방법으로 설명해 보세요."
    },
    {
      id: "sat-foundation-percent-02", domain: "문제 해결·자료 분석", stage: "연결", title: "증가량을 원래 양과 비교하기",
      prompt: "도서관의 방문자 수가 한 달에 48명에서 다음 달 60명으로 늘었습니다. 증가율은 얼마인가요?",
      choices: ["12%", "20%", "25%", "48%", "125%"], answer: 2,
      hint: "증가량을 먼저 구한 뒤, 처음 방문자 수 48명으로 나눕니다.",
      solution: ["증가량은 60 − 48 = 12명입니다.", "증가율은 12/48 = 1/4 = 25%입니다. 기준은 처음 수량 48명입니다."],
      connection: "방문자 수가 60명에서 72명으로 늘 때 증가율도 같은가요? 기준량을 비교해 보세요."
    },
    {
      id: "sat-foundation-algebra-01", domain: "대수", stage: "기본", title: "고정 비용과 횟수 비용",
      prompt: "미술 교실은 등록비 9달러와 수업 한 번당 7달러를 받습니다. 총비용이 51달러라면 수업을 몇 번 들었나요?",
      choices: ["5번", "6번", "7번", "8번", "9번"], answer: 1,
      hint: "수업 횟수를 n이라 놓고 등록비와 수업료의 합을 식으로 나타내세요.",
      solution: ["총비용은 9 + 7n = 51입니다.", "양변에서 9를 빼면 7n = 42이고, n = 6입니다."],
      connection: "등록비가 없다면 같은 수업 6회의 비용은 얼마인가요?"
    },
    {
      id: "sat-foundation-algebra-02", domain: "대수", stage: "기본", title: "저축 표에서 변화량 찾기",
      prompt: "민지는 첫날에 20달러를 저축하고 이후 매주 7달러씩 더 저축합니다. 8주 뒤 저축액을 나타내는 식은 무엇이며, 저축액은 얼마인가요?",
      choices: ["20 + 7 × 8 = 76달러", "7 + 20 × 8 = 167달러", "20 × 7 × 8 = 1,120달러", "20 + 8 = 28달러", "(20 + 7) × 8 = 216달러"], answer: 0,
      hint: "처음 가진 금액과 매주 더하는 금액을 구분해 식을 세우세요.",
      solution: ["처음 저축액은 20달러이고 매주 7달러씩 늘어납니다.", "8주 뒤 금액은 20 + 7 × 8 = 76달러입니다."],
      connection: "주 수를 w로 두면 저축액을 나타내는 식은 무엇인가요?"
    },
    {
      id: "sat-foundation-algebra-03", domain: "대수", stage: "연결", title: "두 양의 표를 식으로 나타내기",
      prompt: "표에서 x가 1일 때 y는 7, x가 4일 때 y는 13입니다. 두 점을 잇는 직선에서 x가 10일 때 y는 얼마인가요?",
      choices: ["19", "21", "23", "25", "27"], answer: 3,
      hint: "x가 3 늘 때 y가 6 늘므로, x가 1 늘 때 y는 얼마나 늘까요?",
      solution: ["변화율은 (13 − 7) ÷ (4 − 1) = 2입니다.", "y = 2x + b에 (1, 7)을 넣으면 b = 5이므로 y = 2x + 5입니다.", "x = 10이면 y = 20 + 5 = 25입니다."],
      connection: "표에 x = 0인 행을 추가한다면 y값은 얼마여야 하나요?"
    },
    {
      id: "sat-foundation-data-01", domain: "문제 해결·자료 분석", stage: "기본", title: "짝수 개 자료의 중앙값",
      prompt: "8일 동안 읽은 쪽수는 순서대로 12, 15, 15, 18, 20, 20, 22, 25쪽입니다. 중앙값은 몇 쪽인가요?",
      choices: ["15쪽", "18쪽", "19쪽", "20쪽", "22쪽"], answer: 2,
      hint: "자료가 8개이므로 가운데 두 값의 평균을 구합니다.",
      solution: ["가운데 두 값은 네 번째 18과 다섯 번째 20입니다.", "중앙값은 (18 + 20) ÷ 2 = 19쪽입니다."],
      connection: "가장 큰 값 25가 35로 바뀌어도 중앙값은 달라지나요?"
    },
    {
      id: "sat-foundation-data-02", domain: "문제 해결·자료 분석", stage: "연결", title: "평균에서 빠진 점수 구하기",
      prompt: "퀴즈 점수 4개의 평균은 84점입니다. 이미 확인한 세 점수가 72점, 81점, 89점이라면 나머지 점수는 몇 점인가요?",
      choices: ["84점", "90점", "92점", "94점", "96점"], answer: 3,
      hint: "평균에 점수 개수를 곱해 네 점수의 합을 구합니다.",
      solution: ["네 점수의 합은 84 × 4 = 336점입니다.", "확인한 세 점수의 합은 72 + 81 + 89 = 242점입니다.", "나머지 점수는 336 − 242 = 94점입니다."],
      connection: "네 번째 점수가 94점보다 높으면 네 점수의 평균은 어떻게 변하나요?"
    },
    {
      id: "sat-foundation-data-03", domain: "문제 해결·자료 분석", stage: "기본", title: "상자에서 파란 카드 뽑기",
      prompt: "상자에 파란 카드 4장, 빨간 카드 3장, 초록 카드 1장이 있습니다. 카드를 한 장 무작위로 뽑을 때 파란 카드가 나올 확률은 얼마인가요?",
      choices: ["1/8", "1/4", "3/8", "1/2", "5/8"], answer: 3,
      hint: "전체 카드 수와 파란 카드 수를 세어 분수로 나타냅니다.",
      solution: ["카드는 모두 4 + 3 + 1 = 8장입니다.", "파란 카드는 4장이므로 확률은 4/8 = 1/2입니다."],
      connection: "초록 카드가 한 장 더 들어가면 파란 카드가 나올 확률은 커지나요, 작아지나요?"
    },
    {
      id: "sat-foundation-data-04", domain: "문제 해결·자료 분석", stage: "연결", title: "표본에서 말할 수 있는 범위",
      prompt: "학생회가 수학 동아리 학생 40명에게 가장 좋아하는 방과 후 활동을 물었습니다. 그중 75%가 체스를 골랐습니다. 이 조사로 뒷받침되는 결론은 무엇인가요?",
      choices: ["모든 학생의 75%가 체스를 좋아합니다.", "응답한 수학 동아리 학생 중 75%가 체스를 골랐습니다.", "학교의 모든 동아리에서 체스가 가장 인기 있습니다.", "체스를 고르지 않은 학생은 체스를 싫어합니다.", "학생회가 조사한 40명은 모두 체스 동아리에 가입합니다."], answer: 1,
      hint: "조사에 참여한 집단과 결론에서 말하는 집단이 같은지 살펴보세요.",
      solution: ["조사 대상은 수학 동아리 학생 40명입니다.", "따라서 직접 말할 수 있는 것은 응답자 중 75%가 체스를 골랐다는 사실입니다. 전체 학생으로 확대하려면 대표성 있는 표본이 필요합니다."],
      connection: "전체 학생의 선호를 조사하려면 누구를 어떤 방법으로 뽑아야 할까요?"
    },
    {
      id: "sat-foundation-algebra-04", domain: "대수", stage: "연결", title: "두 요금제가 같아지는 횟수",
      prompt: "기구 대여 A는 기본료 8달러와 1회당 2달러를 받습니다. 대여 B는 기본료 14달러와 1회당 1달러를 받습니다. 두 요금이 같아지는 대여 횟수는 몇 회인가요?",
      choices: ["4회", "5회", "6회", "7회", "8회"], answer: 2,
      hint: "대여 횟수를 n이라 하고 두 요금식을 같게 놓으세요.",
      solution: ["A 요금은 8 + 2n, B 요금은 14 + n입니다.", "8 + 2n = 14 + n을 풀면 n = 6입니다.", "6회일 때 두 요금은 모두 20달러입니다."],
      connection: "6회보다 적거나 많을 때 어느 요금제가 더 저렴한지 식으로 확인해 보세요."
    },
    {
      id: "sat-foundation-advanced-01", domain: "고급 대수", stage: "선택 확장", title: "동치인 식 찾기",
      prompt: "모든 x에 대해 3(x + 4) + 2x와 같은 값을 갖는 식은 무엇인가요?",
      choices: ["5x + 7", "5x + 12", "6x + 14", "3x + 20", "5(x + 12)"], answer: 1,
      hint: "괄호에 분배법칙을 적용한 다음 x가 있는 항끼리 모아 보세요.",
      solution: ["3(x + 4)에서 3x + 12를 얻습니다.", "3x + 12 + 2x = 5x + 12이므로 동치인 식은 5x + 12입니다."],
      connection: "x에 여러 값을 넣어 두 식의 값이 같은지 확인하고, 전개한 식으로도 설명해 보세요."
    },
    {
      id: "sat-foundation-advanced-02", domain: "고급 대수", stage: "선택 확장", title: "제곱식의 값 구하기",
      prompt: "f(x) = x² − 2x + 1일 때, f(4)의 값은 얼마인가요?",
      choices: ["5", "7", "9", "11", "13"], answer: 2,
      hint: "x가 있는 자리에 4를 넣고 거듭제곱을 먼저 계산합니다.",
      solution: ["f(4) = 4² − 2 × 4 + 1입니다.", "16 − 8 + 1 = 9이므로 f(4) = 9입니다."],
      connection: "x가 1씩 변할 때 f(x)의 값이 항상 같은 양만큼 변하는지 표를 만들어 살펴보세요."
    },
    {
      id: "sat-foundation-advanced-03", domain: "고급 대수", stage: "선택 확장", title: "이차방정식의 해 확인하기",
      prompt: "x² = 49를 만족하는 모든 수 x를 고르면 무엇인가요?",
      choices: ["7만", "−7만", "−7과 7", "0과 7", "−49와 49"], answer: 2,
      hint: "양수뿐 아니라 제곱하면 49가 되는 음수도 확인해 보세요.",
      solution: ["7² = 49이고 (−7)² = 49입니다.", "따라서 해는 −7과 7 두 개입니다."],
      connection: "x² = 36의 해를 먼저 예상한 다음, 제곱으로 확인해 보세요."
    },
    {
      id: "sat-foundation-advanced-04", domain: "고급 대수", stage: "선택 확장", title: "반복해서 두 배가 되는 양",
      prompt: "처음에 세 개가 있고 일정한 시간 간격마다 두 배가 됩니다. 네 번의 간격이 지난 뒤 몇 개가 되나요?",
      choices: ["24개", "36개", "48개", "64개", "96개"], answer: 2,
      hint: "처음 값에 2를 네 번 곱하는 식으로 나타내 보세요.",
      solution: ["네 번 두 배가 되는 식은 3 × 2⁴입니다.", "2⁴ = 16이므로 3 × 16 = 48개입니다."],
      connection: "간격 수를 n이라 할 때 전체 개수를 나타내는 식을 써 보세요."
    },
    {
      id: "sat-foundation-geometry-01", domain: "기하·삼각법", stage: "기본", title: "삼각형의 각 구하기",
      prompt: "삼각형의 세 각은 48°, 67°, x°입니다. x의 값은 얼마인가요?",
      choices: ["55°", "60°", "65°", "67°", "75°"], answer: 2,
      hint: "삼각형 안쪽 세 각의 합을 이용합니다.",
      solution: ["삼각형의 내각의 합은 180°입니다.", "x = 180° − 48° − 67° = 65°입니다."],
      connection: "세 각 중 하나를 모를 때 나머지 두 각만으로 그 값을 찾을 수 있는 이유를 설명해 보세요."
    },
    {
      id: "sat-foundation-geometry-02", domain: "기하·삼각법", stage: "기본", title: "원의 넓이를 반지름으로 나타내기",
      prompt: "반지름이 3cm인 원의 넓이를 π를 사용해 나타내면 얼마인가요?",
      choices: ["3πcm²", "6πcm²", "9πcm²", "12πcm²", "18πcm²"], answer: 2,
      hint: "원의 넓이 공식은 반지름 × 반지름 × π입니다.",
      solution: ["원의 넓이는 πr²입니다.", "r = 3을 넣으면 π × 3² = 9πcm²입니다."],
      connection: "반지름이 6cm로 두 배가 되면 넓이는 몇 배가 되는지 생각해 보세요."
    },
    {
      id: "sat-foundation-geometry-03", domain: "기하·삼각법", stage: "기본", title: "평행사변형 넓이 구하기",
      prompt: "밑변이 8cm이고 그 밑변에 대한 높이가 5cm인 평행사변형의 넓이는 얼마인가요?",
      choices: ["13cm²", "26cm²", "32cm²", "40cm²", "80cm²"], answer: 3,
      hint: "평행사변형의 넓이는 밑변과 그에 대응하는 높이를 곱합니다.",
      solution: ["넓이 = 밑변 × 높이입니다.", "8 × 5 = 40이므로 넓이는 40cm²입니다."],
      connection: "높이가 아니라 기울어진 변의 길이를 사용하면 왜 넓이가 달라질 수 있는지 그림으로 설명해 보세요."
    },
    {
      id: "sat-foundation-geometry-04", domain: "기하·삼각법", stage: "기본", title: "직육면체의 부피와 높이",
      prompt: "밑면의 가로가 3cm, 세로가 4cm인 직육면체의 부피가 60cm³입니다. 높이는 몇 cm인가요?",
      choices: ["3cm", "4cm", "5cm", "12cm", "20cm"], answer: 2,
      hint: "밑면의 넓이를 먼저 구하고, 부피를 그 넓이로 나누세요.",
      solution: ["밑면의 넓이는 3 × 4 = 12cm²입니다.", "높이는 부피 ÷ 밑면 넓이이므로 60 ÷ 12 = 5cm입니다."],
      connection: "높이를 두 배로 하면 밑면이 같을 때 부피는 어떻게 변하나요?"
    }
  ];
  const domains = ["대수", "고급 대수", "문제 해결·자료 분석", "기하·삼각법"];
  root.GFIELDSATFoundationPractice = Object.freeze({
    title: "SAT Math 기초 연결 연습",
    scope: "Original Grade 6–7 bridge practice sampling selected skills from all four SAT Math content domains. Advanced Math and Geometry items are optional extensions. Not a SAT form, score, readiness measure, or diagnostic.",
    domains: Object.freeze(domains),
    items: Object.freeze(items.map(function (entry) { return Object.freeze(Object.assign({}, entry, { choices: Object.freeze(entry.choices), solution: Object.freeze(entry.solution) })); }))
  });
})(typeof window !== "undefined" ? window : globalThis);
