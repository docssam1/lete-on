(function (root, factory) {
  const course = factory();
  if (typeof module === "object" && module.exports) module.exports = course;
  if (root) root.GFIELDAlgebra1Course = course;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  // GFIELD authored sequence. Common Core codes describe scope, not borrowed lesson text.
  const units = Object.freeze([
    Object.freeze({
      id: "expressions-equations",
      title: "식의 구조와 방정식",
      question: "같은 값을 나타내는 식은 어떻게 알아볼까요?",
      goals: ["문장에서 변수와 조건을 찾아 식으로 나타낸다", "분배법칙과 동류항으로 동치식을 만든다", "등식의 각 변형을 근거와 함께 설명하고 해를 검산한다"],
      standards: ["HSA-SSE.A.1", "HSA-SSE.A.2", "HSA-CED.A.1", "HSA-REI.A.1", "HSA-REI.B.3"],
      lesson: Object.freeze({ title: "동아리 티셔츠 값을 식으로 나타내기", prompt: "티셔츠 한 장의 가격이 p달러이고 6장을 주문할 때 총액에서 12달러를 할인해요. 총액을 나타내는 식을 쓰고, p = 9일 때 총액을 구하세요.", solution: "총액은 6p − 12예요. p = 9를 넣으면 6 × 9 − 12 = 42달러예요. 6p는 같은 가격 p를 6번 더한 값이고, 할인액 12달러를 빼요.", extension: "총액이 42달러였을 때 한 장 가격 p를 방정식으로 구하고, 식에 다시 넣어 확인해 보세요." })
    }),
    Object.freeze({
      id: "linear-functions",
      title: "일차 관계와 함수",
      question: "표·그래프·식은 같은 관계를 어떻게 다르게 보여줄까요?",
      goals: ["기울기와 시작값을 상황의 단위로 해석한다", "함수 규칙을 표·그래프·식으로 바꾸어 읽는다", "두 일차 관계의 교점과 해의 의미를 설명한다"],
      standards: ["HSA-CED.A.2", "HSF-IF.A.1", "HSF-IF.B.4", "HSF-IF.C.7", "HSF-LE.A.1"],
      lesson: Object.freeze({ title: "기본 요금과 이용 횟수", prompt: "체험 교실은 등록비 7달러와 수업 한 번당 2.50달러를 받아요. x번 참여할 때 비용 C를 식으로 나타내고, 6번 참여한 비용을 구하세요. 기울기와 시작값이 각각 무엇을 뜻하는지도 적으세요.", solution: "C(x) = 2.5x + 7이고 C(6) = 22달러예요. 기울기 2.5는 수업 한 번마다 늘어나는 비용(달러/회), 시작값 7은 수업 전 등록비예요.", extension: "표에서 x = 0, 1, 2, 6일 때 비용을 채우고, 네 점이 한 직선 위에 놓이는 이유를 말해 보세요." })
    }),
    Object.freeze({
      id: "systems-inequalities",
      title: "연립방정식과 부등식",
      question: "조건이 여러 개일 때 가능한 해를 어떻게 찾고 걸러낼까요?",
      goals: ["대입·소거 풀이가 같은 해를 보존하는 이유를 설명한다", "연립방정식의 해를 그래프의 교점과 연결한다", "부등식과 연립부등식의 해를 수직선·좌표평면으로 나타낸다"],
      standards: ["HSA-REI.C.5", "HSA-REI.C.6", "HSA-REI.D.10", "HSA-REI.D.12", "HSA-CED.A.3"],
      lesson: Object.freeze({ title: "축제 입장권 수 알아보기", prompt: "성인 입장권은 8달러, 학생 입장권은 5달러예요. 표 28장을 팔아 179달러를 모았다면 성인과 학생 표를 각각 몇 장 팔았나요? 두 조건을 식으로 나타내어 풀어 보세요.", solution: "성인 표를 a장, 학생 표를 s장이라 하면 a + s = 28, 8a + 5s = 179예요. 첫 식에서 s = 28 − a를 얻어 둘째 식에 넣으면 3a = 39, a = 13, s = 15예요. 두 식을 모두 만족하는지 확인해요.", extension: "두 직선을 좌표평면에 그렸을 때 교점 (13, 15)가 문제의 답인 이유를 설명해 보세요." })
    }),
    Object.freeze({
      id: "exponents-polynomials",
      title: "지수와 다항식의 표현",
      question: "반복되는 곱셈과 식의 모양은 어떤 규칙을 드러낼까요?",
      goals: ["정수 지수의 성질을 근거로 식을 간단히 한다", "다항식의 연산과 인수분해를 구조로 설명한다", "지수 관계를 표·그래프로 비교하고 변화 양상을 해석한다"],
      standards: ["HSA-SSE.B.3", "HSA-APR.A.1", "HSF-LE.A.1", "HSF-LE.B.5"],
      lesson: Object.freeze({ title: "두 배씩 늘어나는 수량", prompt: "처음에 6개인 수량이 한 단계마다 두 배가 돼요. 단계 수를 n이라 할 때 수량 N을 식으로 나타내고, 4단계 뒤의 수량을 계산하세요. 덧셈으로 늘어나는 규칙과 무엇이 다른지도 설명하세요.", solution: "N(n) = 6 × 2ⁿ이고 N(4) = 6 × 16 = 96개예요. 매 단계 2개씩 더하는 것이 아니라 현재 수량에 2를 곱하므로 지수 관계로 나타내요.", extension: "같은 시작값에서 단계마다 6개씩 더하는 규칙과 표를 만들어 비교해 보세요." })
    }),
    Object.freeze({
      id: "quadratic-models",
      title: "이차 관계와 모델링",
      question: "직선으로 설명되지 않는 변화는 어떻게 나타낼까요?",
      goals: ["이차식의 인수분해·표·그래프를 연결한다", "영점과 꼭짓점이 상황에서 뜻하는 바를 읽는다", "자료에 맞는 선형·지수·이차 모델을 고르고 한계를 말한다"],
      standards: ["HSA-SSE.B.3", "HSA-REI.B.4", "HSF-IF.C.8", "HSF-LE.A.2", "HSA-CED.A.1"],
      lesson: Object.freeze({ title: "직사각형 화단의 넓이 비교", prompt: "길이 18m의 울타리로 직사각형 화단의 네 변을 모두 둘러요. 한 변의 길이를 x m라 하면 다른 변은 얼마인지 쓰고 넓이 A(x)를 나타내세요. 가능한 직사각형 중 넓이가 가장 클 때를 찾아보세요.", solution: "2x + 2y = 18이므로 y = 9 − x예요. 넓이는 A(x) = x(9 − x) = −(x − 4.5)² + 20.25예요. 두 변이 4.5m일 때 넓이가 가장 크고, 최대 넓이는 20.25m²예요.", extension: "x = 3, 4, 4.5, 5, 6일 때 넓이를 표에 적어 꼭짓점과 대칭을 찾아보세요." })
    })
  ]);

  const starterLesson = Object.freeze({
    title: "첫 수업 · 등식 변형의 이유",
    prompt: "3(2x − 1) = 15를 풀어 보세요. 각 줄에서 등식이 계속 참인 이유를 한 문장으로 적고, 마지막에 원래 식에 대입해 확인하세요.",
    steps: Object.freeze([
      Object.freeze({ expression: "3(2x − 1) = 15", reason: "처음 주어진 관계예요." }),
      Object.freeze({ expression: "2x − 1 = 5", reason: "양변을 같은 0이 아닌 수 3으로 나누었어요." }),
      Object.freeze({ expression: "2x = 6", reason: "양변에 1을 더했어요." }),
      Object.freeze({ expression: "x = 3", reason: "양변을 2로 나누었어요." })
    ]),
    check: "x = 3을 원래 식에 넣으면 왼쪽은 3(6 − 1) = 15가 됩니다. 각 단계에서 양변에 같은 연산을 했으므로 해가 보존돼요.",
    extension: "2(3x + 4) = 5x + 17로 바꾸면 풀이의 어느 단계에서 변수가 한쪽에 모이나요? 두 식에서 같은 연산을 했는지 말로 확인해 보세요."
  });

  return Object.freeze({
    id: "gfield-algebra-1-v1",
    title: "지필드 Algebra 1",
    status: "first-original-lesson-published",
    scope: "미국 고등학교 공통 기준의 대수·함수 영역을 참고해 만든 지필드 학습 순서예요. 학교별 단원 순서와 깊이는 교사가 조정해요.",
    units: units,
    starterLesson: starterLesson,
    source: Object.freeze({ title: "Common Core State Standards · High School Algebra", url: "https://www.thecorestandards.org/Math/Content/HSA/" }),
    originalContentNotice: "이 설명과 연습 문제는 지필드가 새로 작성했어요. 공개 기준의 코드만 범위 확인에 사용했어요."
  });
});
