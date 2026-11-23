(function (root) {
  "use strict";
  const items = [
    { id: "rp-a-m01", standard: "7.RP.A.1", focus: "거리와 시간의 단위율", prompt: "자전거가 3시간 동안 156마일을 이동했습니다. 일정한 속력이라면 1시간에 몇 마일을 이동하나요?", choices: ["48마일", "50마일", "52마일", "54마일"], answer: 2, solution: "단위율은 전체 거리를 시간으로 나눕니다. 156 ÷ 3 = 52이므로 시속 52마일입니다." },
    { id: "rp-a-m02", standard: "7.RP.A.1", focus: "가격의 단위율", prompt: "공책 6권의 가격이 $15.30입니다. 공책 한 권의 가격은 얼마인가요?", choices: ["$2.35", "$2.45", "$2.55", "$2.65"], answer: 2, solution: "권당 가격은 전체 가격을 공책 수로 나눈 값입니다. $15.30 ÷ 6 = $2.55입니다." },
    { id: "rp-a-m03", standard: "7.RP.A.1", focus: "분수 시간의 단위율", prompt: "프린터가 2/3시간 동안 18쪽을 인쇄합니다. 같은 속력으로 1시간 동안 인쇄하는 쪽수는 얼마인가요?", choices: ["12쪽", "24쪽", "27쪽", "30쪽"], answer: 2, solution: "시간당 쪽수는 18 ÷ (2/3)입니다. 18 × 3/2 = 27이므로 1시간에 27쪽을 인쇄합니다." },
    { id: "rp-a-m04", standard: "7.RP.A.1", focus: "조리법의 단위율", prompt: "4인분에 올리브유 2/5컵을 사용합니다. 같은 비율로 1인분을 만들 때 필요한 양은 얼마인가요?", choices: ["1/20컵", "1/10컵", "1/5컵", "2/5컵"], answer: 1, solution: "1인분 양은 2/5 ÷ 4입니다. 2/5 × 1/4 = 2/20 = 1/10컵입니다." },
    { id: "rp-a-m05", standard: "7.RP.A.2", focus: "표에서 비례 상수 찾기", prompt: "표에서 x가 2, 4, 6일 때 y가 7, 14, 21입니다. y=kx에서 비례 상수 k는 얼마인가요?", choices: ["2.5", "3", "3.5", "4"], answer: 2, solution: "각 쌍에서 y를 x로 나눕니다. 7/2 = 14/4 = 21/6 = 3.5이므로 k=3.5입니다." },
    { id: "rp-a-m06", standard: "7.RP.A.2", focus: "비례 관계 판별", prompt: "다음 표 중 x와 y가 비례 관계인 것은 무엇인가요?", choices: ["x: 1, 3, 5 · y: 4, 12, 21", "x: 2, 4, 6 · y: 5, 10, 15", "x: 1, 2, 4 · y: 3, 6, 13", "x: 3, 6, 9 · y: 2, 5, 6"], answer: 1, solution: "비례 관계에서는 y/x가 항상 같습니다. 두 번째 표는 5/2 = 10/4 = 15/6 = 2.5입니다. 다른 표는 비가 일정하지 않습니다." },
    { id: "rp-a-m07", standard: "7.RP.A.2", focus: "비례식으로 나타내기", prompt: "사과의 가격이 1kg에 $3.60으로 일정합니다. x kg의 가격을 y달러라고 할 때 이를 나타내는 식은 무엇인가요?", choices: ["y = x + 3.60", "y = 3.60x", "x = 3.60y", "y = x/3.60"], answer: 1, solution: "가격은 kg당 $3.60에 무게 x를 곱한 값입니다. 따라서 y=3.60x입니다." },
    { id: "rp-a-m08", standard: "7.RP.A.2", focus: "그래프의 원점과 비례 관계", prompt: "직선 그래프가 (2, 5)와 (4, 10)을 지납니다. 이 관계가 비례 관계라면 그래프가 반드시 지나는 점은 무엇인가요?", choices: ["(0, 0)", "(0, 2)", "(1, 5)", "(5, 2)"], answer: 0, solution: "비례 관계의 식은 y=kx이고 그래프는 원점을 지납니다. 주어진 두 점에서 y/x=2.5로 일정하므로 (0,0)을 지납니다." },
    { id: "rp-a-m09", standard: "7.RP.A.2", focus: "단위율과 좌표의 의미", prompt: "비례 관계 y=4.5x에서 점 (1, 4.5)는 상황에서 무엇을 뜻하나요?", choices: ["x가 1일 때 y는 4.5이다", "x=4.5일 때 y=1이다", "처음 값이 4.5이고 증가량은 1이다", "x와 y의 합이 4.5이다"], answer: 0, solution: "비례 상수 4.5는 x 한 단위당 y의 변화량입니다. 점 (1,4.5)는 x가 1단위일 때 y가 4.5임을 나타냅니다." },
    { id: "rp-a-m10", standard: "7.RP.A.3", focus: "할인율 적용", prompt: "$120인 가방을 25% 할인합니다. 할인 후 가격은 얼마인가요?", choices: ["$30", "$90", "$95", "$100"], answer: 1, solution: "할인액은 120×0.25=$30입니다. 할인 후 가격은 120−30=$90입니다." },
    { id: "rp-a-m11", standard: "7.RP.A.3", focus: "할인 후 판매세", prompt: "$150인 코트를 20% 할인한 뒤 할인된 가격에 6% 판매세를 붙입니다. 최종 가격은 얼마인가요?", choices: ["$120.00", "$126.00", "$127.20", "$129.00"], answer: 2, solution: "할인 후 가격은 150×0.80=$120입니다. 판매세를 더하면 120×1.06=$127.20입니다." },
    { id: "rp-a-m12", standard: "7.RP.A.3", focus: "축척으로 실제 거리 구하기", prompt: "지도에서 1.5cm가 실제 거리 4km를 나타냅니다. 지도에서 6cm인 두 지점 사이의 실제 거리는 얼마인가요?", choices: ["12km", "14km", "16km", "18km"], answer: 2, solution: "6cm는 1.5cm의 4배입니다. 실제 거리도 4km의 4배이므로 16km입니다." },
    { id: "rp-a-m13", standard: "7.RP.A.3", focus: "팁과 총액", prompt: "$48 식사비에 15% 팁을 더합니다. 팁을 포함한 총액은 얼마인가요?", choices: ["$53.20", "$54.80", "$55.20", "$56.40"], answer: 2, solution: "팁은 48×0.15=$7.20입니다. 총액은 48+7.20=$55.20입니다." },
    { id: "rp-a-m14", standard: "7.RP.A.3", focus: "백분율 증가", prompt: "한 동아리 회원 수가 40명에서 50명으로 늘었습니다. 증가율은 몇 퍼센트인가요?", choices: ["10%", "20%", "25%", "125%"], answer: 2, solution: "증가량은 50−40=10명입니다. 처음 수를 기준으로 10/40=0.25이므로 증가율은 25%입니다." }
  ];
  const exam = Object.freeze({
    id: "gfield-grade7-rp-a-mock-v1", formVersion: "2026-11-04-v1", grade: 7, clusterId: "7.RP.A",
    title: "7.RP.A 비와 비례 관계 단원 모의고사 · 1회", durationMinutes: 40,
    standards: Object.freeze(["7.RP.A.1", "7.RP.A.2", "7.RP.A.3"]), items: Object.freeze(items.map(function (item) { return Object.freeze(item); }))
  });
  root.GFIELDGrade7UnitMock = exam;
})(typeof window === "undefined" ? globalThis : window);
