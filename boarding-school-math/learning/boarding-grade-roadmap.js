/* Public planning examples only. No learner record, placement decision, or private assessment content. */
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GFIELDBoardingGradeRoadmap = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  const grade7Stops = Object.freeze([
    Object.freeze({ id: "nsa", title: "유리수", description: "유리수의 덧셈·뺄셈에서 곱셈·나눗셈으로 확장하고, 소수 표현과 문장제까지 연결해요.", checks: Object.freeze([
      Object.freeze({ standard: "7.NS.A.1", prompt: "덧셈·뺄셈: 수직선에서 이동과 거리를 나타내고, 빼기를 반대수 더하기로 설명할 수 있나요?" }),
      Object.freeze({ standard: "7.NS.A.2", prompt: "곱셈·나눗셈: 부호와 연산 성질을 적용하고, 0이 아닌 수로 나누는 이유를 설명할 수 있나요?" }),
      Object.freeze({ standard: "7.NS.A.2d", prompt: "분수와 소수: 분수를 소수로 나타내고, 소수가 끝나는지 반복되는지 판별할 수 있나요?" }),
      Object.freeze({ standard: "7.NS.A.3", prompt: "문장제: 상황에 맞게 유리수 네 연산을 골라 식을 세우고 답의 의미를 설명할 수 있나요?" })
    ]), clusterId: "7.NS.A", resourceState: "public" }),
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
    { grade: 7, title: "유리수에서 Algebra 1로", source: "provided", pathNote: "가속 학습 예시 · 학교 학년 기준 아님", core: "유리수, 비례, 식과 방정식, 기하를 연결해 보세요. 학교 과목 순서는 실제 수업에 맞춰 확인해요.", bridge: "유리수 연산 → 비례 관계 → 식·방정식 → 기하·혼합 문제", steps: grade7Stops.map(function (stop) { return [stop.title, stop.description]; }) },
    { grade: 8, title: "대수와 기하를 함께", source: "provided", pathNote: "가속 학습 예시 · 학교 학년 기준 아님", core: "함수와 기하를 함께 공부해요. 같은 관계를 그래프·식·그림으로 설명해 봐요.", bridge: "일차 관계 → 함수로 나타내기 → 이차 관계·기하", steps: [
      ["일차식·기하 점검", "일차 관계와 도형의 기본 성질을 설명할 수 있는지 확인해요."], ["그래프·식 연결", "같은 관계를 그래프·방정식·도형으로 옮기고 무엇이 같은지 말해요."], ["준비되면 심화", "앞 개념이 익숙하고 원한다면 이차식이나 AMC 10/12 문제에 도전해요."], ["풀이 비교", "맞힌 문제도 다른 풀이와 비교하고, 틀린 문제는 막힌 지점을 적어요."] ] },
    { grade: 9, title: "함수와 기하 증명 확인", source: "inferred", core: "7·8·10학년 자료를 잇는 추정안이에요. 실제 과목 순서는 학교 수업을 먼저 확인해요.", bridge: "좌표기하·닮음 → 삼각비 → 함수 → Pre-Calculus 준비", steps: [
      ["빈 곳 메우기", "Algebra 2의 함수·방정식과 기하 증명을 다시 확인해요."], ["서로 연결하기", "좌표·닮음·삼각비를 그래프와 식으로 나타내요."], ["원할 때 도전", "준비가 되면 AMC 혼합 문제나 SAT/PSAT 영역별 문제를 풀어요."], ["다음 과목 확인", "풀이와 설명을 살펴보고 Pre-Calculus 준비를 선생님과 확인해요."] ] },
    { grade: 10, title: "함수·삼각법과 증명", source: "provided", pathNote: "가속 학습 예시 · 학교 학년 기준 아님", core: "Pre-Calculus의 함수와 삼각법을 깊이 이해해요. 경시와 SAT는 각각 필요한 만큼 준비해요.", bridge: "함수·삼각법 → 복소수·벡터 → 풀이 정당화·증명", steps: [
      ["개념 설명", "함수와 삼각법의 정의를 그래프와 함께 설명해요."], ["개념 섞어 풀기", "대수·기하·정수론·조합이 함께 쓰인 문제를 풀어요."], ["필요한 실전 연습", "준비도에 따라 AMC 12/AIME 또는 SAT 문제를 시간 재고 풀어요."], ["근거 쓰기", "왜 맞는지 적고 처음 보는 문제에 다시 적용해요."] ] },
    { grade: 11, title: "학교 과목 순서에 맞춰 연결", source: "inferred", core: "11학년의 수학 과목은 학교와 학생의 이수 경로에 따라 달라요. 현재 과목과 선수 개념을 확인한 뒤 함수·모델링·자료·증명을 필요한 범위에서 연결해요.", bridge: "현재 수강 과목 확인 → 함수·모델·자료 연결 → 선택 심화", steps: [
      ["과목과 선수 개념 확인", "성적표와 학교 과목 안내에서 현재 수업, 선수 조건, 다음 선택지를 확인해요."], ["표현을 오가며 설명", "현재 배우는 내용을 식·그래프·표·말로 나타내고 서로 어떻게 이어지는지 설명해요."], ["관심 영역 선택", "수업에서 다루는 함수·모델링·자료·기하 중 필요한 연결을 골라 더 살펴봐요."], ["시험은 필요할 때만", "응시 계획과 참가 자격을 확인한 뒤 SAT 또는 해당 연도 규정에 맞는 AMC 12 연습을 선택해요."] ] },
    { grade: 12, title: "배운 수학을 선택 과목과 문제에 적용", source: "inferred", core: "12학년에는 모두에게 같은 수학 과목 순서가 있는 것이 아니에요. 실제 이수 과목과 졸업·대학 계획을 확인해 모델링, 통계, 심화 함수, 이산 수학이나 증명 중 필요한 내용을 이어 가요.", bridge: "이수 과목·계획 확인 → 자료·모델·논리 적용 → 다음 학습 설계", steps: [
      ["현재 이수 내용 정리", "학교 성적표와 과목 안내를 기준으로 이미 배운 내용과 남은 선수 조건을 정리해요."], ["실제 문제에 적용", "관심 주제의 자료나 상황을 식·그래프·확률 모형으로 나타내고 가정과 한계를 설명해요."], ["관심에 따라 더 배우기", "학교가 제공하고 선수 조건을 충족하는 과목 중 통계·미적분·이산 수학·증명 등을 살펴봐요."], ["다음 경로 정리", "대학·진로 계획에 맞춰 다음 과목이나 선택 시험을 확인해요. AMC 12는 해당 연도 참가 자격을 먼저 확인해요."] ] }
  ];

  const annualPlans = Object.freeze({
    6: Object.freeze({ source: "provided", title: "Pre-Algebra에서 SAT 기초까지", note: "학습 계획 예시예요. 실제 속도와 시험 일정에 맞춰 조정해요.", periods: Object.freeze([
      ["1–3개월", "Pre-Algebra 개념 익히기", "분수·소수·정수·비율·식·기하·자료를 이해하고, 풀이 이유를 말해요.", "AoPS Pre-Algebra · Khan Academy · Singapore Math Challenging Word Problems 6"],
      ["4–6개월", "AMC 8 유형과 논리", "단원별 문제를 풀고, 한 문제를 여러 방법으로 설명해요.", "AoPS Challenge Problems · AMC 8 기출 · Beast Academy 5D"],
      ["7–9개월", "SAT 기초 유형 맛보기", "문장제와 자료 해석을 배운 개념에 연결해요.", "Khan Academy SAT Math · College Board 공식 자료 · PWN the SAT Math Guide"],
      ["10–12개월", "복습과 실전 연습", "오답 이유를 나누어 보고, 준비된 범위에서 시간 연습을 해요.", "AoPS 복습 · AMC 8 기출 · SAT 기초 문제"]
    ]) }),
    7: Object.freeze({ source: "provided", title: "Algebra 1에서 경시·SAT 기초로", note: "경시와 SAT는 학교 수학과 분리한 선택 경로예요. 먼저 현재 개념 이해를 확인해요.", periods: Object.freeze([
      ["1–3개월", "Algebra 1 개념과 풀이", "식·방정식의 뜻을 이해하고 변형한 이유를 설명해요.", "AoPS Introduction to Algebra · 개념별 연습"],
      ["4–6개월", "기하 기초와 AMC 입문", "기하 개념을 다지고, 준비되면 AMC 10 문제를 선택해 접근해요.", "중학교 기하 · AMC 10 유형 문제"],
      ["7–9개월", "대수 강화와 SAT 유형", "대수·기하 문장제를 그래프·식·그림으로 연결해요.", "Digital SAT Math 영역별 기초 연습"],
      ["10–12개월", "누적 복습과 모의 연습", "배운 개념을 섞어 풀고 막힌 이유를 기록해요.", "개념 혼합 문제 · 준비도에 맞춘 모의 문제"]
    ]) }),
    8: Object.freeze({ source: "provided", title: "대수·기하에서 AIME·SAT 선택까지", note: "학습 계획 예시예요. 과목 선행이나 AIME 진출을 보장하지 않아요.", periods: Object.freeze([
      ["1–3개월", "대수 개념과 문제 해결", "함수와 대수 개념을 확인하고 풀이 선택의 이유를 설명해요.", "AoPS Intermediate Algebra · Khan Academy Algebra 2"],
      ["4–6개월", "기하 심화와 AMC 10/12", "도형 관계를 증명하고 대수와 연결해 풀어요.", "AoPS Introduction to Geometry · Geometry Revisited · AMC 기출"],
      ["7–9개월", "AIME형 문제와 SAT 심화", "준비된 학생은 서술형 풀이와 SAT 영역별 연습을 병행해요.", "AoPS Volume 2 · College Board 공식 SAT 자료"],
      ["10–12개월", "실전 연습과 풀이 복습", "시간을 재서 풀고 개념·아이디어·계산 실수를 구분해요.", "AMC/AIME 기출 · SAT 모의 문제 · AoPS 복습"]
    ]) }),
    9: Object.freeze({ source: "inferred", title: "Algebra 2·기하를 점검하고 Pre-Calculus로", note: "9학년 월별 계획은 제공되지 않아 8·10학년 자료 사이를 잇는 추정안이에요. 학교 과목과 선수 개념을 먼저 확인해요.", periods: Object.freeze([
      ["1–3개월 · 추정", "Algebra 2 핵심 개념 확인", "함수·다항식·방정식의 이해도를 확인하고 필요한 부분을 보완해요.", "학교 수업 자료 · 현재 교재의 단원 점검"],
      ["4–6개월 · 추정", "기하와 대수 연결", "좌표·닮음·기하 증명을 식과 그래프로 연결해요.", "기하 복습 · 혼합 문제"],
      ["7–9개월 · 추정", "선택 심화와 SAT 영역 확인", "관심과 준비도에 따라 AMC 혼합 문제 또는 SAT 영역을 골라요.", "AMC 선택 연습 · Digital SAT 공식 연습 자료"],
      ["10–12개월 · 추정", "다음 과목 준비 확인", "함수·삼각비의 기초를 살펴보고 Pre-Calculus 준비를 교사와 확인해요.", "학교 과목 계획 · 선수 개념 복습"]
    ]) }),
    10: Object.freeze({ source: "provided", title: "Pre-Calculus에서 증명·시험 선택까지", note: "학습 목표 예시예요. AIME·USAMO·SAT 결과는 이 계획만으로 예측할 수 없어요.", periods: Object.freeze([
      ["1–3개월", "Pre-Calculus와 AMC 12 준비", "함수와 삼각법을 그래프로 이해하고 문제에 적용해요.", "AoPS Precalculus · AoPS Volume 1 · AMC 12 기출"],
      ["4–6개월", "AIME형 정수론·조합", "풀이를 외우기보다 어떤 개념을 왜 썼는지 설명해요.", "AoPS Intermediate Counting & Probability · Intermediate Number Theory · AIME 기출"],
      ["7–9개월", "SAT Math 점검", "응시 계획이 있을 때 공식 형식에 맞춰 약한 영역을 확인해요.", "College Board 공식 디지털 SAT 자료 · Khan Academy SAT Math"],
      ["10–12개월", "증명과 다음 단계", "증명 문제는 준비도와 목표에 맞춰 선택하고 풀이 근거를 써요.", "AoPS Volume 2 · 증명 연습 · 선택한 경시 문제"]
    ]) }),
    11: Object.freeze({ source: "inferred", title: "학교의 과목 경로를 확인하고 연결하기", note: "11학년 자료가 제공되지 않아 고등학교 수학의 공통 내용 범주를 바탕으로 만든 추정안이에요. 과목명·순서·시험 선택은 학교의 실제 과목 안내와 선수 조건을 먼저 확인해요.", periods: Object.freeze([
      ["1–3개월 · 추정", "현재 수업과 선수 조건 확인", "성적표와 학교 안내에서 지금 배우는 과목, 필요한 선수 개념, 다음 선택지를 정리해요.", "학교 course catalog · 교사 상담 · 현재 수업 자료"],
      ["4–6개월 · 추정", "함수·표현 연결", "현재 과목의 함수를 식·그래프·표로 나타내고 표현 사이의 관계를 설명해요.", "현재 과목 교재 · 함수와 그래프 복습"],
      ["7–9개월 · 추정", "모델·자료·추론 적용", "수업과 관심 주제에 맞춰 자료를 분석하거나 수학적 모델의 가정과 한계를 설명해요.", "학교 통계·모델링·심화 선택 단원"],
      ["10–12개월 · 추정", "다음 과목과 시험 선택", "학교의 다음 과목 선수 조건을 확인해요. 시험 응시 계획이 있으면 SAT 공식 범위 또는 AMC 12 해당 연도 자격을 별도로 살펴봐요.", "학교 과목 안내 · College Board · MAA 공식 규정"]
    ]) }),
    12: Object.freeze({ source: "inferred", title: "이수 과목과 다음 목표를 연결하기", note: "12학년 자료가 제공되지 않아 공통 고등학교 수학 범주를 바탕으로 만든 추정안이에요. 졸업 요건·대학 계획·학교 과목 순서에 따라 필요한 학습을 고르세요.", periods: Object.freeze([
      ["1–3개월 · 추정", "이수 과목과 목표 정리", "성적표, 졸업 요건, 다음 학습 계획을 확인하고 아직 필요한 선수 개념을 정리해요.", "학교 졸업 요건 · 과목 안내 · 상담 교사"],
      ["4–6개월 · 추정", "관심 분야에 수학 적용", "관심 주제를 표·그래프·함수나 확률 모델로 나타내고 해석의 범위를 설명해요.", "학교에서 선택 가능한 통계·모델링 단원"],
      ["7–9개월 · 추정", "선택 심화 학습", "선수 조건을 충족하고 학교에서 제공하는 과목 중 미적분·통계·이산 수학·증명 등을 선택해요.", "학교 course catalog · 해당 과목의 공식 학습 자료"],
      ["10–12개월 · 추정", "다음 단계로 이어가기", "대학·진로에 필요한 수학을 확인해 다음 학습 계획을 정리해요. 선택 시험은 응시 계획과 현재 자격이 확인될 때만 포함해요.", "대학·진로 요구 사항 · 해당 시험 주관 기관 안내"]
    ]) })
  });

  const conceptFlows = Object.freeze([
    Object.freeze({ id: "arithmetic-algebra", title: "연산에서 대수식으로", steps: Object.freeze(["곱셈 구조", "분배법칙", "다항식 전개", "식 정리", "AMC 10 식 변형"]) }),
    Object.freeze({ id: "ratio-coordinate", title: "비와 비율에서 좌표기하로", steps: Object.freeze(["비·비율·속력", "단위 변환", "비례식", "일차 함수", "좌표기하"]) }),
    Object.freeze({ id: "parity-counting", title: "짝·홀수에서 경우의 수로", steps: Object.freeze(["짝·홀수·배수", "조건별 추론", "경우의 수", "조합", "AMC/AIME 논리 문제"]) }),
    Object.freeze({ id: "sequence-number-theory", title: "수열에서 정수론으로", steps: Object.freeze(["수열·규칙", "일반항·닫힌식", "나머지", "합동식", "AIME 정수론"]) })
  ]);

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
    10: Object.freeze([["학교 수학", "Pre-Calculus 함수·삼각법과 증명 기초"], ["경시 · 선택", "AMC 12·AIME와 증명 문제를 따로 연습"], ["SAT · 선택", "응시할 때 공식 디지털 SAT로 점검"]]),
    11: Object.freeze([["학교 수학 · 추정", "수강 과목과 선수 조건을 확인하고 개념 연결"], ["경시 · 선택", "AMC 12는 해당 연도 참가 자격 확인 후 선택"], ["SAT · 선택", "응시 계획이 있을 때 공식 영역을 점검"]]),
    12: Object.freeze([["학교 수학 · 추정", "졸업 요건·과목 경로·다음 목표에 맞춰 선택"], ["경시 · 선택", "AMC 12는 해당 연도 참가 자격 확인 후 선택"], ["SAT · 선택", "응시 계획이 있을 때 공식 영역을 점검"]])
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
  function getAnnualPlan(grade) { return annualPlans[Number(grade)] || null; }
  function getRoute(id) { return routes.find(function (entry) { return entry.id === id; }) || null; }
  function getTracks(grade) {
    const tracks = gradeTracks[Number(grade)] || [];
    if (tracks.some(function (track) { return /경시/.test(track[0]); })) return tracks;
    return tracks.concat([Object.freeze(["경시 · 선택", "이 학년 계획 자료에는 별도 경시 과정이 제시되지 않았어요."])]);
  }
  return Object.freeze({ grades: Object.freeze(grades), grade7Stops: grade7Stops, routes: Object.freeze(routes), strands: strands, conceptFlows: conceptFlows, getGrade: getGrade, getAnnualPlan: getAnnualPlan, getRoute: getRoute, getTracks: getTracks, competitionOptions: competitionOptions, analyzeCompetition: analyzeCompetition });
});
