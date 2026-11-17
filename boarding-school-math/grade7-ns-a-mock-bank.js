(function (root) {
  "use strict";
  const items = [
    { id: "ns-a-m01", standard: "7.NS.A.1", focus: "유리수의 덧셈", prompt: "계산하세요: −3/4 + 5/6", choices: ["−19/12", "1/12", "−1/12", "19/12"], answer: 1, solution: "공통분모 12를 사용하면 −9/12 + 10/12 = 1/12입니다." },
    { id: "ns-a-m02", standard: "7.NS.A.1", focus: "유리수의 뺄셈", prompt: "계산하세요: 2/5 − (−7/10)", choices: ["−3/10", "3/10", "11/10", "−11/10"], answer: 2, solution: "음수를 빼는 것은 그 반대수인 양수를 더하는 것과 같아요. 4/10 + 7/10 = 11/10입니다." },
    { id: "ns-a-m03", standard: "7.NS.A.1", focus: "소수의 덧셈", prompt: "계산하세요: −1.8 + 2.35", choices: ["−4.15", "−0.55", "0.55", "4.15"], answer: 2, solution: "−1.80 + 2.35 = 0.55입니다. 수직선에서 2.35만큼 오른쪽으로 이동해도 확인할 수 있어요." },
    { id: "ns-a-m04", standard: "7.NS.A.1", focus: "상황에서 정수 연산", prompt: "새벽 기온은 −4.5°C였고 낮 동안 7.25°C 올랐습니다. 낮 기온은 몇 °C인가요?", choices: ["−11.75°C", "−2.75°C", "2.75°C", "11.75°C"], answer: 2, solution: "처음 기온에 변화를 더해 −4.5 + 7.25 = 2.75°C입니다." },
    { id: "ns-a-m05", standard: "7.NS.A.1", focus: "수직선에서 유리수의 이동", prompt: "수직선에서 −3/4에서 시작해 왼쪽으로 1/2만큼 이동합니다. 도착한 수는 무엇인가요?", choices: ["−5/4", "−1/4", "1/4", "5/4"], answer: 0, solution: "왼쪽으로 1/2 이동하는 것은 −1/2을 더하는 것과 같아요. −3/4 + (−1/2) = −3/4 − 2/4 = −5/4입니다." },
    { id: "ns-a-m06", standard: "7.NS.A.2", focus: "유리수의 곱셈", prompt: "계산하세요: (−3/5) × (10/9)", choices: ["−2/3", "2/3", "−3/2", "3/2"], answer: 0, solution: "부호가 다르므로 곱은 음수입니다. 약분하면 −(3×10)/(5×9) = −2/3입니다." },
    { id: "ns-a-m07", standard: "7.NS.A.2", focus: "유리수의 나눗셈", prompt: "계산하세요: (−7/8) ÷ (14/15)", choices: ["−15/16", "15/16", "−16/15", "16/15"], answer: 0, solution: "0이 아닌 분수로 나누는 것은 그 역수를 곱하는 것과 같아요. (−7/8)×(15/14)=−15/16입니다." },
    { id: "ns-a-m08", standard: "7.NS.A.2", focus: "부호와 곱셈", prompt: "계산하세요: (−2/3) × (−9/4)", choices: ["−3/2", "−1/2", "1/2", "3/2"], answer: 3, solution: "음수 두 수의 곱은 양수예요. 약분하면 (2×9)/(3×4)=18/12=3/2입니다." },
    { id: "ns-a-m09", standard: "7.NS.A.2", focus: "소수 나눗셈", prompt: "계산하세요: 4.2 ÷ (−0.7)", choices: ["−6", "−0.6", "0.6", "6"], answer: 0, solution: "42 ÷ 7 = 6이고 부호가 다르므로 −6입니다." },
    { id: "ns-a-m10", standard: "7.NS.A.2", focus: "분수를 소수로 나타내기", prompt: "7/12를 소수로 나타낸 것은 무엇인가요?", choices: ["0.58", "0.58333…", "0.571428…", "0.712"], answer: 1, solution: "7 ÷ 12 = 0.58333…입니다. 3이 반복되는 순환소수예요." },
    { id: "ns-a-m11", standard: "7.NS.A.3", focus: "연산 순서와 유리수", prompt: "계산하세요: 2/3 − 3/4 × (−8/9)", choices: ["−4/3", "−1/3", "1/3", "4/3"], answer: 3, solution: "곱셈을 먼저 합니다. 3/4×(−8/9)=−2/3이므로 2/3−(−2/3)=4/3입니다." },
    { id: "ns-a-m12", standard: "7.NS.A.3", focus: "상황에 맞는 곱셈", prompt: "잠수부가 해수면 아래로 분당 12m씩 내려갑니다. 2.5분 동안 이동한 위치 변화는 몇 m인가요?", choices: ["−30m", "−9.5m", "9.5m", "30m"], answer: 0, solution: "아래 방향을 음수로 나타내면 −12×2.5=−30m입니다. 위치 변화는 해수면 아래 30m예요." },
    { id: "ns-a-m13", standard: "7.NS.A.3", focus: "나눗셈의 의미", prompt: "주스 3/4L를 6개의 컵에 똑같이 나눕니다. 한 컵에 담기는 양은 몇 L인가요?", choices: ["1/8L", "1/6L", "1/2L", "4 1/2L"], answer: 0, solution: "각 컵의 양은 3/4÷6 = 3/24 = 1/8L입니다." },
    { id: "ns-a-m14", standard: "7.NS.A.3", focus: "여러 단계 상황 문제", prompt: "계좌 잔액이 −$18.00입니다. 매주 $2.50씩 4주 동안 입금하면 잔액은 얼마인가요?", choices: ["−$28.00", "−$8.00", "$8.00", "$28.00"], answer: 1, solution: "입금액은 2.50×4=$10입니다. −18+10=−$8이므로 잔액은 −$8.00입니다." }
  ];
  root.GFIELDGrade7NSAExam = Object.freeze({
    id: "gfield-grade7-ns-a-mock-v1",
    formVersion: "2026-11-03-v1",
    grade: 7,
    clusterId: "7.NS.A",
    title: "7.NS.A 유리수 연산 단원 모의고사 · 1회",
    durationMinutes: 40,
    standards: ["7.NS.A.1", "7.NS.A.2", "7.NS.A.3"],
    items: Object.freeze(items.map(function (item) { return Object.freeze(item); }))
  });
  root.GFIELDGrade7UnitMock = root.GFIELDGrade7NSAExam;
})(typeof window === "undefined" ? globalThis : window);
