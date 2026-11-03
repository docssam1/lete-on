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
      goals: ["문장에서 변수와 조건을 찾아 식으로 나타낸다", "분배법칙과 동류항으로 동치식을 만든다", "문제 상황을 한 변수 방정식·부등식으로 나타내고 해의 범위를 해석한다", "등식의 각 변형을 근거와 함께 설명하고 해를 검산한다"],
      standards: ["HSA-SSE.A.1", "HSA-SSE.A.2", "HSA-CED.A.1", "HSA-REI.A.1", "HSA-REI.B.3"],
      lesson: Object.freeze({ title: "동아리 티셔츠 값을 식으로 나타내기", prompt: "티셔츠 한 장의 가격이 p달러이고 6장을 주문할 때 총액에서 12달러를 할인해요. 총액을 나타내는 식을 쓰고, p = 9일 때 총액을 구하세요.", solution: "총액은 6p − 12예요. p = 9를 넣으면 6 × 9 − 12 = 42달러예요. 6p는 같은 가격 p를 6번 더한 값이고, 할인액 12달러를 빼요.", extension: "총액이 42달러였을 때 한 장 가격 p를 방정식으로 구하고, 식에 다시 넣어 확인해 보세요." }),
      lessons: Object.freeze([
        Object.freeze({
          title: "변수로 상황을 식으로 나타내기",
          objective: "상황에서 변하는 양을 문자로 정하고, 그 관계를 식으로 나타낸 뒤 주어진 값을 대입해 계산한다.",
          idea: "식의 문자는 정해지지 않은 수량을 나타내요. 고정된 비용과 반복되는 비용을 구분하면 어떤 연산이 필요한지 보여요.",
          example: Object.freeze({ prompt: "공방 체험은 재료비 7달러와 작품 하나당 4달러예요. 작품을 x개 만들 때 비용 C를 식으로 나타내고, x = 3일 때 값을 구하세요.", solution: "C = 7 + 4x예요. x = 3이면 C = 7 + 4 × 3 = 19달러예요. 7은 한 번 내는 비용이고, 4x는 작품 수에 따라 달라지는 비용이에요." }),
          practice: Object.freeze([
            Object.freeze({ prompt: "놀이 공간은 입장료 7달러와 놀이기구 한 번당 2달러를 받아요. r번 탔을 때 비용을 나타내고, r = 5일 때 계산하세요.", answer: "7 + 2r; r = 5이면 17달러", feedback: "입장료는 고정되어 한 번 더하고, 놀이기구 비용은 횟수 r에 2를 곱해요." }),
            Object.freeze({ prompt: "상자마다 연필이 6자루 있고 여분 연필 4자루가 있어요. 상자가 x개일 때 전체 연필 수를 나타내고 x = 3일 때 구하세요.", answer: "6x + 4; x = 3이면 22자루", feedback: "상자 안 연필은 6x자루이고, 여분 4자루를 더해요." })
          ])
        }),
        Object.freeze({
          title: "식의 항·계수·인수 읽기",
          objective: "식에서 항, 계수, 상수, 인수를 구별하고 각 부분이 계산에서 맡는 역할을 말한다.",
          idea: "더하기와 빼기로 나뉘는 덩어리는 항이에요. 곱해지는 수와 문자는 인수이고, 문자 앞 수는 계수예요.",
          example: Object.freeze({ prompt: "식 4x + 7에서 항, 계수, 상수를 찾아보세요.", solution: "항은 4x와 7이에요. 4x의 계수는 4, 상수항은 7이에요. x는 값이 달라질 수 있는 변수예요." }),
          practice: Object.freeze([
            Object.freeze({ prompt: "−3a + 8에서 항과 a의 계수를 말해 보세요.", answer: "항은 −3a와 8, a의 계수는 −3", feedback: "계수에는 부호도 포함해요. −3a에서 a에 곱해진 수는 −3이에요." }),
            Object.freeze({ prompt: "2(b + 5)에서 곱해지는 인수를 찾고, 괄호 안의 항을 말해 보세요.", answer: "인수는 2와 (b + 5), 괄호 안의 항은 b와 5", feedback: "괄호 바깥의 2가 괄호 전체에 곱해져요." })
          ])
        }),
        Object.freeze({
          title: "말로 된 관계를 변수식으로 쓰기",
          objective: "말로 주어진 연산의 순서와 수량 관계를 식으로 나타내고 괄호의 필요성을 설명한다.",
          idea: "‘어떤 수보다 몇 큰 수’와 ‘어떤 수에 몇을 더한 값’은 덧셈 순서가 달라요. ‘뺀 값의 두 배’처럼 먼저 할 계산은 괄호로 나타내요.",
          example: Object.freeze({ prompt: "수 n에서 3을 뺀 값의 두 배를 식으로 나타내세요.", solution: "먼저 n에서 3을 빼고 그 결과를 두 배로 하므로 2(n − 3)이에요. 2n − 3은 3을 뺀 뒤 두 배를 한 식이 아니에요." }),
          practice: Object.freeze([
            Object.freeze({ prompt: "한 수 t의 5배보다 4 큰 수를 나타내세요.", answer: "5t + 4", feedback: "먼저 수 t를 5배 한 뒤 4를 더해요." }),
            Object.freeze({ prompt: "수 y와 6의 합을 세 배 한 값을 나타내세요.", answer: "3(y + 6)", feedback: "합 y + 6 전체를 세 배 하므로 괄호로 묶어요." })
          ])
        }),
        Object.freeze({
          title: "연산의 성질로 동치식 만들기",
          objective: "분배법칙과 동류항의 결합을 이용해 식의 값을 바꾸지 않는 동치식을 만들고 각 변형의 이유를 설명한다.",
          idea: "같은 문자가 곱해진 항은 계수끼리 더하거나 뺄 수 있어요. 괄호 앞의 수는 괄호 안 각 항에 곱해요.",
          example: Object.freeze({ prompt: "4(x + 3) + 2x를 동치식으로 정리하세요.", solution: "분배법칙으로 4x + 12 + 2x가 돼요. 동류항 4x와 2x를 결합하면 6x + 12예요. 예를 들어 x = 2를 넣으면 두 식 모두 24예요." }),
          practice: Object.freeze([
            Object.freeze({ prompt: "3(2a + 1) + a를 간단히 하세요.", answer: "7a + 3", feedback: "먼저 3을 괄호 안에 분배해 6a + 3 + a로 쓴 뒤 동류항을 결합해요." }),
            Object.freeze({ prompt: "5(b − 2) + 3b + 4를 간단히 하세요.", answer: "8b − 6", feedback: "분배하면 5b − 10 + 3b + 4이고, 동류항을 결합하면 8b − 6이에요." })
          ])
        }),
        Object.freeze({
          title: "한 변수 방정식 세우기",
          objective: "문제의 미지량을 변수로 정하고 등식의 양쪽에 놓일 수량이 무엇인지 설명하며 방정식을 세운다.",
          idea: "방정식은 두 식의 값이 같다는 조건을 나타내요. 변수와 단위를 먼저 정하면 등식이 문제 상황을 제대로 옮겼는지 살펴보기 쉬워요.",
          example: Object.freeze({ prompt: "수업 등록비는 7달러이고 수업 한 번마다 4달러예요. 총 31달러를 냈다면 수업 횟수 x를 구하는 방정식을 세우세요.", solution: "총비용은 7 + 4x이므로 7 + 4x = 31이에요. 4x = 24, x = 6이므로 수업은 6번이에요." }),
          practice: Object.freeze([
            Object.freeze({ prompt: "기본료 3달러와 한 번당 5달러인 활동을 이용해 28달러를 냈어요. 횟수 n을 구하는 방정식을 세우고 풀어 보세요.", answer: "3 + 5n = 28; n = 5", feedback: "기본료와 횟수에 따른 비용의 합이 전체 금액 28달러예요." }),
            Object.freeze({ prompt: "36쪽에서 매일 3쪽씩 읽었더니 15쪽이 남았어요. 읽은 날 수 d를 나타내는 방정식을 세우고 구하세요.", answer: "36 − 3d = 15; d = 7", feedback: "처음 분량에서 읽은 쪽수를 빼면 남은 분량이 돼요." })
          ])
        }),
        Object.freeze({
          title: "등식의 성질로 방정식 풀기",
          objective: "양변에 같은 연산을 적용해 해를 구하고 각 단계가 해를 보존하는 이유를 설명한다.",
          idea: "등식 양변에 같은 수를 더하거나 빼고, 같은 0이 아닌 수를 곱하거나 나누면 등식은 유지돼요. 변수항을 한쪽에 남기는 순서를 선택해요.",
          example: Object.freeze({ prompt: "3(x − 2) = 18을 풀고 풀이 단계를 설명하세요.", solution: "양변을 3으로 나누면 x − 2 = 6이고, 양변에 2를 더하면 x = 8이에요. 처음 식에 대입하면 3(8 − 2) = 18이므로 맞아요." }),
          practice: Object.freeze([
            Object.freeze({ prompt: "2x + 7 = 25를 풀고 원래 식에 대입해 확인하세요.", answer: "x = 9", feedback: "양변에서 7을 빼면 2x = 18이고, 양변을 2로 나누면 x = 9예요. 대입하면 18 + 7 = 25예요." }),
            Object.freeze({ prompt: "3(2y + 1) = 21을 풀어 보세요.", answer: "y = 3", feedback: "양변을 3으로 나누면 2y + 1 = 7, 양변에서 1을 빼면 2y = 6이에요." })
          ])
        }),
        Object.freeze({
          title: "부등식으로 가능한 범위 나타내기",
          objective: "상황의 제한을 부등식으로 나타내고 해의 경계와 문제 맥락에 맞는 값을 구별한다.",
          idea: "부등식의 해는 조건을 만족하는 모든 값이에요. 양변에 음수를 곱하거나 나누면 부등호 방향이 바뀌어요. 횟수처럼 정수로 세는 수량은 범위에서 가능한 정수만 골라요.",
          example: Object.freeze({ prompt: "입장료 7달러와 한 번당 4달러인 체험을 예산 27달러 안에서 몇 번까지 할 수 있을까요? 횟수를 m으로 나타내세요.", solution: "비용이 예산을 넘지 않아야 하므로 7 + 4m ≤ 27이에요. 양변에서 7을 빼고 4로 나누면 m ≤ 5예요. 체험 횟수는 음수가 아닌 정수이므로 0회부터 5회까지 가능해요." }),
          practice: Object.freeze([
            Object.freeze({ prompt: "5x − 3 < 17을 풀어 보세요.", answer: "x < 4", feedback: "양변에 3을 더하면 5x < 20이고, 양변을 양수 5로 나누면 부등호 방향은 그대로예요." }),
            Object.freeze({ prompt: "가입비 12달러와 수업 한 번당 3달러를 내요. 예산이 30달러 이하일 때 수업 횟수 p의 범위를 쓰세요.", answer: "12 + 3p ≤ 30, 따라서 p ≤ 6; 정수 횟수는 0회부터 6회", feedback: "고정된 가입비와 횟수별 비용의 합이 30달러를 넘지 않아야 해요." })
          ])
        })
      ])
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
    status: "unit-1-sequence-published",
    scope: "미국 고등학교 공통 기준의 대수·함수 영역을 참고해 만든 지필드 학습 순서예요. 학교별 단원 순서와 깊이는 교사가 조정해요.",
    units: units,
    starterLesson: starterLesson,
    source: Object.freeze({ title: "Common Core State Standards · High School Algebra", url: "https://www.thecorestandards.org/Math/Content/HSA/" }),
    originalContentNotice: "이 설명과 연습 문제는 지필드가 새로 작성했어요. 공개 기준의 코드만 범위 확인에 사용했어요."
  });
});
