/* Public planning examples only. No learner record, placement decision, or private assessment content. */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GFIELDBoardingGradeRoadmap = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const grades = [
    { grade: 3, title: "수의 뜻을 설명하는 시작", source: "provided", core: "자리값·기본 연산을 점검하고 문장제의 조건을 읽어 말합니다.", bridge: "수의 분해 → 배열 모델 → 곱셈의 분배 성질", steps: [
      ["수를 나누어 보기", "자리값과 수의 분해를 그림·말로 설명"], ["연산의 뜻 찾기", "곱셈 배열과 나눗셈의 두 의미 비교"], ["문장제 읽기", "무엇을 묻는지 표시하고 그림으로 바꾸기"], ["설명으로 확인", "맞힌 문제도 왜 맞는지 말하기"] ] },
    { grade: 4, title: "표와 그림으로 관계 읽기", source: "provided", core: "문장제, 표·그래프, 도형을 계산 전에 해석합니다.", bridge: "같은 단위 묶기 → 식 만들기 → 등식의 균형", steps: [
      ["문장제 구조", "조건과 질문을 분리해 표로 정리"], ["분수와 단위", "그림과 수직선으로 크기 비교"], ["도형과 측정", "넓이·둘레의 단위를 설명"], ["다른 표현", "그림·표·식으로 같은 관계 나타내기"] ] },
    { grade: 5, title: "수 감각을 대수로 연결", source: "provided", core: "분수·소수·비율의 뜻과 문장제 모델링을 깊게 다집니다.", bridge: "비와 단위율 → 비례 관계 → 좌표와 함수 준비", steps: [
      ["연산 점검", "분수·소수 계산을 추정과 역산으로 확인"], ["비율 해석", "한 단위당 양과 백분율을 상황에 연결"], ["모델링", "문장 조건을 수직선·표·식으로 옮기기"], ["약점 재확인", "설명할 수 없는 개념을 다시 다루기"] ] },
    { grade: 6, title: "Pre-Algebra 토대", source: "provided", core: "수와 연산, 비례, 초기 대수, 기하·데이터를 연결합니다.", bridge: "비·비율 → 단위율 → 비례식 → 선형 관계 준비", steps: [
      ["개념의 이유", "분수·정수·백분율과 식의 의미 설명"], ["문제 해결", "익힌 개념을 새 문장제에 적용"], ["선택 도전", "관심과 준비가 확인되면 AMC 8·SAT형 읽기 경험"], ["누적 확인", "오류 이유를 분류하고 다른 풀이 비교"] ] },
    { grade: 7, title: "유리수에서 Algebra 1로", source: "provided", core: "7.NS.A 유리수 연산을 설명하고, 비례·식·방정식·기하로 이어갑니다.", bridge: "음수와 유리수 연산 → 분배법칙 → 식의 정리 → 방정식", steps: [
      ["유리수의 의미", "수직선·상황으로 음수와 연산 설명"], ["식과 등식", "분배법칙과 등식의 균형으로 식 다루기"], ["기하 연결", "도형 관계를 그림·식으로 설명"], ["혼합 문제", "개념을 고르고 여러 방법을 비교"] ] },
    { grade: 8, title: "대수와 기하를 함께", source: "provided", core: "함수·이차 관계·기하의 설명력을 키우며 학교 과정을 안정화합니다.", bridge: "일차 관계 → 함수 표현 → 이차 관계와 기하의 연결", steps: [
      ["학교 과정 확인", "함수·식과 기하의 선수개념 점검"], ["깊은 연결", "그래프·방정식·도형으로 같은 관계 설명"], ["선택 심화", "준비가 된 경우 Algebra 2·AMC 10/12 문제 탐구"], ["정확성 검토", "오답 원인과 풀이 길이 비교"] ] },
    { grade: 9, title: "함수와 증명의 다리", source: "inferred", core: "앞뒤 학년 자료를 연결한 검토용 제안입니다. 학교의 실제 수학 순서가 우선입니다.", bridge: "좌표기하·닮음 → 삼각비 → 함수 표현 → Pre-Calculus 준비 판단", steps: [
      ["결손 보완", "Algebra 2 함수·방정식과 기하 증명 확인"], ["표현 연결", "좌표·닮음·삼각비를 그래프와 식으로 연결"], ["선택 도전", "근거가 있으면 혼합 AMC 또는 SAT/PSAT 영역별 연습"], ["다음 과목 판단", "누적 설명과 교사 검토로 Pre-Calculus 준비 확인"] ] },
    { grade: 10, title: "함수·삼각법과 증명", source: "provided", core: "Pre-Calculus의 개념을 깊게 이해하고 필요에 따라 시험 목표를 분리합니다.", bridge: "함수와 삼각법 → 복소수·벡터 → 정당화와 증명", steps: [
      ["개념 구조", "함수·삼각법의 정의와 그래프 설명"], ["문제 연결", "대수·기하·정수론·조합의 혼합 문제 탐구"], ["선택 실전", "준비도에 따라 AMC 12/AIME 또는 SAT 정확성 연습"], ["증명과 재확인", "풀이의 근거를 쓰고 새로운 문제에 적용"] ] }
  ];

  const routes = [
    { id: "secure", title: "충분히 익히기", description: "현재 학년의 개념을 다른 표현으로 설명하고 유지되는지 확인합니다.", check: "설명·새 문제·간격을 둔 재확인" },
    { id: "continue", title: "이어서 배우기", description: "선수개념이 안정적일 때 다음 연결 개념을 탐색합니다.", check: "학교 진도와 선수개념을 교사가 함께 확인" },
    { id: "repair", title: "읽기·연산 보완", description: "조건 해석이나 연산의 뜻에서 막힌 지점을 좁혀 다시 다룹니다.", check: "오류 이유와 학습 부담을 확인" }
  ];

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
    if (grade >= 7 && grade <= 10) options.push({ id: "amc10", title: "AMC 10 · 선택 탐구", itemCount: 25 });
    if (grade >= 8) options.push({ id: "amc12", title: "AMC 12 · 선택 탐구", itemCount: 25 });
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
    const analyzedRows = parsed.map(function (row) { return Object.assign({}, row, { rate: row.attempted ? Math.round(100 * row.correct / row.attempted) : null, evidence: row.attempted >= 3 ? "비교 가능" : "표본 부족" }); });
    const comparable = analyzedRows.filter(function (row) { return row.attempted >= 3; }).sort(function (a, b) { return a.rate - b.rate; });
    return {
      valid: true, attempted: attempted, correct: correct, itemCount: itemCount, complete: attempted === itemCount,
      rows: analyzedRows, reviewFirst: comparable.length >= 2 && comparable[0].rate < comparable[comparable.length - 1].rate ? comparable[0].title : null
    };
  }

  function getGrade(value) { return grades.find(function (entry) { return entry.grade === Number(value); }) || null; }
  function getRoute(id) { return routes.find(function (entry) { return entry.id === id; }) || null; }
  return Object.freeze({ grades: Object.freeze(grades), routes: Object.freeze(routes), strands: strands, getGrade: getGrade, getRoute: getRoute, competitionOptions: competitionOptions, analyzeCompetition: analyzeCompetition });
});
