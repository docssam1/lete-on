/* Public planning examples only. No learner record, placement decision, or private assessment content. */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GFIELDBoardingGradeRoadmap = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const grade7Stops = Object.freeze([
    Object.freeze({ id: "nsa", title: "유리수", description: "음수와 유리수 연산을 수직선과 실제 상황으로 설명해요.", check: "음수와 유리수의 합과 곱이 왜 그런 값이 되는지 수직선이나 말로 설명할 수 있나요?", clusterId: "7.NS.A", resourceState: "review-preview" }),
    Object.freeze({ id: "rpa", title: "비례 관계", description: "단위율과 비례 관계를 표·그래프·식으로 나타내요.", check: "두 양이 비례하는지 표와 그래프를 보고 설명할 수 있나요?", clusterId: "7.RP.A", resourceState: "public" }),
    Object.freeze({ id: "ee", title: "식·방정식", description: "분배법칙으로 식을 정리하고 등식의 양쪽이 왜 같은지 확인해요.", check: "식을 바꾼 뒤에도 같은 값을 나타내는 이유를 말할 수 있나요?" }),
    Object.freeze({ id: "geometry", title: "기하·혼합 문제", description: "도형에서 찾은 관계를 그림과 식으로 나타내고 필요한 개념을 골라요.", check: "처음 보는 문제에서 쓴 개념과 다른 풀이 한 가지를 설명할 수 있나요?" })
  ]);

  const grades = [
    { grade: 3, title: "수를 쪼개고 다시 묶기", source: "provided", core: "자리값과 사칙연산의 뜻을 확인해요. 문장제에서는 무엇을 묻는지 먼저 읽어요.", bridge: "수 쪼개기 → 배열로 곱셈 보기 → 분배법칙", steps: [
      ["수 쪼개기", "같은 수를 여러 방법으로 나누어 그림과 말로 설명해요."], ["곱셈·나눗셈", "배열로 곱셈을 보고, 나눗셈이 무엇을 뜻하는지 비교해요."], ["문장제 읽기", "무엇을 묻는지 표시한 뒤 그림으로 나타내요."], ["말로 확인하기", "맞힌 문제도 왜 맞는지 설명해요."] ] },
    { grade: 4, title: "표와 그림으로 문제 읽기", source: "provided", core: "계산하기 전에 문장제의 조건을 표·그래프·그림에서 찾아요.", bridge: "같은 단위끼리 묶기 → 식 만들기 → 등식의 양쪽 비교", steps: [
      ["조건 정리", "주어진 것과 구할 것을 나눠 표에 적어요."], ["분수와 단위", "그림과 수직선에서 어느 쪽이 큰지 설명해요."], ["도형과 측정", "넓이와 둘레를 구할 때 단위를 함께 확인해요."], ["여러 방법으로 보기", "같은 관계를 그림·표·식으로 나타내요."] ] },
    { grade: 5, title: "분수와 비율을 상황에 쓰기", source: "provided", core: "분수·소수·비율을 계산하고, 문장제의 조건을 그림이나 식으로 옮겨요.", bridge: "비와 단위율 → 비례 관계 → 좌표와 함수", steps: [
      ["계산 확인", "분수·소수의 답을 어림하거나 거꾸로 계산해 확인해요."], ["비율 읽기", "한 단위당 양과 백분율이 상황에서 무엇인지 말해요."], ["문장제 나타내기", "조건을 수직선·표·식으로 바꿔 보아요."], ["막힌 곳 다시 보기", "설명하기 어려운 개념부터 다시 풀어요."] ] },
    { grade: 6, title: "비율·정수·식 연결하기", source: "provided", core: "Pre-Algebra에 필요한 비율, 정수, 식, 기하, 데이터를 차근차근 익혀요.", bridge: "비와 비율 → 단위율 → 비례식 → 일차 관계", steps: [
      ["뜻부터 확인", "분수·정수·백분율과 식이 무엇을 뜻하는지 설명해요."], ["새 문제에 써 보기", "배운 개념을 처음 보는 문장제에 적용해요."], ["원할 때 도전", "준비가 되면 AMC 8 문제나 SAT형 문장제를 접해요."], ["틀린 이유 찾기", "계산, 개념, 문제 읽기 중 어디서 막혔는지 살펴봐요."] ] },
    { grade: 7, title: "유리수에서 Algebra 1로", source: "provided", core: "유리수, 비례, 식과 방정식, 기하를 연결해 보세요. 학교 과목 순서는 실제 수업에 맞춰 확인해요.", bridge: "유리수 연산 → 비례 관계 → 식·방정식 → 기하·혼합 문제", steps: grade7Stops.map(function (stop) { return [stop.title, stop.description]; }) },
    { grade: 8, title: "대수와 기하를 함께", source: "provided", core: "함수와 기하를 함께 공부해요. 같은 관계를 그래프·식·그림으로 설명해 봐요.", bridge: "일차 관계 → 함수로 나타내기 → 이차 관계·기하", steps: [
      ["일차식·기하 점검", "일차 관계와 도형의 기본 성질을 설명할 수 있는지 확인해요."], ["그래프·식 연결", "같은 관계를 그래프·방정식·도형으로 옮기고 무엇이 같은지 말해요."], ["준비되면 심화", "앞 개념이 익숙하고 원한다면 이차식이나 AMC 10/12 문제에 도전해요."], ["풀이 비교", "맞힌 문제도 다른 풀이와 비교하고, 틀린 문제는 막힌 지점을 적어요."] ] },
    { grade: 9, title: "함수와 기하 증명 확인", source: "inferred", core: "7·8·10학년 자료를 잇는 추정안이에요. 실제 과목 순서는 학교 수업을 먼저 확인해요.", bridge: "좌표기하·닮음 → 삼각비 → 함수 → Pre-Calculus 준비", steps: [
      ["빈 곳 메우기", "Algebra 2의 함수·방정식과 기하 증명을 다시 확인해요."], ["서로 연결하기", "좌표·닮음·삼각비를 그래프와 식으로 나타내요."], ["원할 때 도전", "준비가 되면 AMC 혼합 문제나 SAT/PSAT 영역별 문제를 풀어요."], ["다음 과목 확인", "풀이와 설명을 살펴보고 Pre-Calculus 준비를 선생님과 확인해요."] ] },
    { grade: 10, title: "함수·삼각법과 증명", source: "provided", core: "Pre-Calculus의 함수와 삼각법을 깊이 이해해요. 경시와 SAT는 각각 필요한 만큼 준비해요.", bridge: "함수·삼각법 → 복소수·벡터 → 풀이 정당화·증명", steps: [
      ["개념 설명", "함수와 삼각법의 정의를 그래프와 함께 설명해요."], ["개념 섞어 풀기", "대수·기하·정수론·조합이 함께 쓰인 문제를 풀어요."], ["필요한 실전 연습", "준비도에 따라 AMC 12/AIME 또는 SAT 문제를 시간 재고 풀어요."], ["근거 쓰기", "왜 맞는지 적고 처음 보는 문제에 다시 적용해요."] ] }
  ];

  const routes = [
    { id: "secure", title: "지금 배우는 것 익히기", description: "같은 개념을 그림·표·식으로 설명하고 며칠 뒤 다시 풀어봐요.", check: "새 문제를 혼자 풀고 이유를 말할 수 있나요?" },
    { id: "continue", title: "다음 내용 배우기", description: "앞 개념을 이해했다면 학교 진도에 맞춰 다음 내용을 배워요.", check: "앞 개념과 학교 진도를 선생님과 확인했나요?" },
    { id: "repair", title: "읽기·계산 다시 보기", description: "문제를 읽거나 계산할 때 어디서 막혔는지 찾아 다시 연습해요.", check: "막힌 이유와 학습량을 확인했나요?" }
  ];

  const gradeTracks = Object.freeze({
    3: Object.freeze([["학교 수학", "자리값·사칙연산의 뜻"], ["문제 해결", "문장제를 읽고 그림으로 나타내기"]]),
    4: Object.freeze([["학교 수학", "분수·단위·도형을 그림으로 설명"], ["문제 해결", "표와 그래프에서 조건 찾기"]]),
    5: Object.freeze([["학교 수학", "분수·소수·비율을 상황에 쓰기"], ["문제 해결", "문장제 조건을 그림·표·식으로 바꾸기"]]),
    6: Object.freeze([["학교 수학", "Pre-Algebra: 비율·정수·식·기하·자료"], ["경시 · 선택", "AMC 8 문제에서 풀이 이유 말하기"], ["SAT · 맛보기", "문장제·자료 해석만 가볍게 보기"]]),
    7: Object.freeze([["학교 수학", "유리수·비례·식에서 Algebra 1로"], ["경시 · 선택", "AMC 8로 다지거나 AMC 10 입문 문제 보기"], ["SAT · 맛보기", "대수·기하 문장제를 개념과 연결하기"]]),
    8: Object.freeze([["학교 수학", "함수·기하를 배우고 준비되면 Algebra 2로"], ["경시 · 선택", "AMC 10/12 혼합 문제와 선택지 없이 풀기"], ["SAT · 선택", "대수·자료 해석 유형 점검"]]),
    9: Object.freeze([["학교 수학 · 추정", "Algebra 2·기하를 점검하고 다음 과목 정하기"], ["경시 · 선택", "AMC 혼합 문제를 풀이 과정까지 설명"], ["SAT · 선택", "학교 진도에 맞춰 필요한 영역만 보기"]]),
    10: Object.freeze([["학교 수학", "Pre-Calculus 함수·삼각법과 증명 기초"], ["경시 · 선택", "AMC 12·AIME와 증명 문제를 따로 연습"], ["SAT · 선택", "응시할 때 공식 디지털 SAT로 점검"]])
  });

  const strands = Object.freeze([
    Object.freeze({ id: "algebra", title: "식·대수" }),
    Object.freeze({ id: "number", title: "수와 정수론" }),
    Object.freeze({ id: "geometry", title: "기하·공간" }),
    Object.freeze({ id: "counting", title: "경우의 수·확률" })
  ]);

  function competitionOptions(grade) {
    const options = [{ id: "sasmo", title: "SASMO", itemCount: 25 }];
    options.push({ id: "kangaroo", title: "Math Kangaroo", itemCount: grade <= 4 ? 24 : 30 });
    if (grade >= 6 && grade <= 8) options.push({ id: "amc8", title: "AMC 8", itemCount: 25 });
    if (grade >= 7 && grade <= 10) options.push({ id: "amc10", title: "AMC 10", itemCount: 25, optional: true });
    if (grade >= 8) options.push({ id: "amc12", title: "AMC 12", itemCount: 25, optional: true });
    return options;
  }

  function analyzeCompetition(rows, itemCount) {
    if (!Array.isArray(rows) || rows.length !== strands.length) return { valid: false, reason: "네 영역의 입력을 확인하세요." };
    const parsed = rows.map(function (row, index) {
      const attempted = Number(row.attempted);
      const correct = Number(row.correct);
      return { id: strands[index].id, title: strands[index].title, attempted: attempted, correct: correct };
    });
    if (parsed.some(function (row) { return !Number.isInteger(row.attempted) || !Number.isInteger(row.correct) || row.attempted < 0 || row.correct < 0 || row.correct > row.attempted; })) {
      return { valid: false, reason: "각 영역에서 정답 수는 푼 문항 수를 넘을 수 없습니다." };
    }
    const attempted = parsed.reduce(function (sum, row) { return sum + row.attempted; }, 0);
    const correct = parsed.reduce(function (sum, row) { return sum + row.correct; }, 0);
    if (attempted === 0) return { valid: false, reason: "푼 문항 수를 입력하세요." };
    if (attempted > itemCount) return { valid: false, reason: `입력한 문항 합계가 선택한 시험의 ${itemCount}문항을 넘습니다.` };
    const analyzedRows = parsed.map(function (row) { return Object.assign({}, row, { rate: row.attempted ? Math.round(100 * row.correct / row.attempted) : null, evidence: row.attempted >= 3 ? "3문제 이상" : "3문제 미만" }); });
    const comparable = analyzedRows.filter(function (row) { return row.attempted >= 3; }).sort(function (a, b) { return a.rate - b.rate; });
    return {
      valid: true, attempted: attempted, correct: correct, itemCount: itemCount, complete: attempted === itemCount,
      rows: analyzedRows, reviewFirst: comparable.length >= 2 && comparable[0].rate < comparable[comparable.length - 1].rate ? comparable[0].title : null
    };
  }

  function getGrade(value) { return grades.find(function (entry) { return entry.grade === Number(value); }) || null; }
  function getRoute(id) { return routes.find(function (entry) { return entry.id === id; }) || null; }
  function getTracks(grade) { return gradeTracks[Number(grade)] || []; }
  return Object.freeze({ grades: Object.freeze(grades), grade7Stops: grade7Stops, routes: Object.freeze(routes), strands: strands, getGrade: getGrade, getRoute: getRoute, getTracks: getTracks, competitionOptions: competitionOptions, analyzeCompetition: analyzeCompetition });
});
