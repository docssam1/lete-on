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
      goals: ["함수 표기법으로 입력에 따른 출력을 구한다", "일차 관계의 기울기와 시작값을 상황의 단위로 해석한다", "식을 표·그래프로 나타내고 입력 범위와 교점의 의미를 설명한다"],
      standards: ["HSA-CED.A.2", "HSF-IF.A.1", "HSF-IF.A.2", "HSF-IF.B.4", "HSF-IF.B.5", "HSF-IF.B.6", "HSF-IF.C.7", "HSF-IF.C.9", "HSF-LE.B.5"],
      lesson: Object.freeze({ title: "기본 요금과 이용 횟수", prompt: "체험 교실은 등록비 7달러와 수업 한 번당 2.50달러를 받아요. x번 참여할 때 비용 C를 식으로 나타내고, 6번 참여한 비용을 구하세요. 기울기와 시작값이 각각 무엇을 뜻하는지도 적으세요.", solution: "C(x) = 2.5x + 7이고 C(6) = 22달러예요. 기울기 2.5는 수업 한 번마다 늘어나는 비용(달러/회), 시작값 7은 수업 전 등록비예요.", extension: "표에서 x = 0, 1, 2, 6일 때 비용을 채우고, 네 점이 한 직선 위에 놓이는 이유를 말해 보세요." }),
      lessons: Object.freeze([
        Object.freeze({
          title: "함수 표기법으로 출력 구하기",
          objective: "함수가 각 입력에 하나의 출력을 대응시킨다는 뜻을 설명하고, 함수 표기법으로 출력값을 계산한다.",
          idea: "f(3)은 f에 3을 곱한다는 뜻이 아니에요. 입력 x가 3일 때 함수가 내놓는 출력값을 뜻해요.",
          example: Object.freeze({ prompt: "f(x) = 3x + 2일 때 f(4)를 구하고, 식의 각 수가 무엇을 하는지 설명하세요.", solution: "x에 4를 넣으면 f(4) = 3 × 4 + 2 = 14예요. 입력 4를 세 배 하고 2를 더해 출력을 만들어요." }),
          practice: Object.freeze([
            Object.freeze({ prompt: "g(x) = 3x + 1일 때 g(5)를 구하세요.", answer: "g(5) = 16", feedback: "입력 x 자리에 5를 넣어 3 × 5 + 1을 계산해요." }),
            Object.freeze({ prompt: "h(t) = 20 − 4t일 때 h(3)을 구하고 문장으로 설명하세요.", answer: "h(3) = 8", feedback: "입력이 3일 때 출력은 20에서 4를 세 번 뺀 값이에요." })
          ])
        }),
        Object.freeze({
          title: "상황에 맞는 입력과 출력 범위 정하기",
          objective: "표와 상황에서 함수의 입력값·출력값을 구하고, 문제 맥락에 맞는 정의역을 정한다.",
          idea: "식에 대입할 수 있는 모든 수가 상황에서 가능한 입력인 것은 아니에요. 횟수는 보통 음이 아닌 정수이고, 시간은 상황에 따라 연속된 값이 될 수 있어요.",
          example: Object.freeze({ prompt: "인쇄소는 기본료 12달러와 포스터 한 장당 3달러를 받아요. P(n) = 12 + 3n일 때 n이 0, 1, 2, 3이면 비용은 각각 얼마인가요? 입력 n의 범위도 말하세요.", solution: "비용은 차례로 12, 15, 18, 21달러예요. 포스터 수 n은 0 이상의 정수이므로 정의역은 0, 1, 2, 3, …이고 출력은 그에 맞는 총비용이에요." }),
          practice: Object.freeze([
            Object.freeze({ prompt: "같은 규칙 P(n) = 12 + 3n에서 포스터가 0~3장일 때 정의역과 치역을 쓰세요.", answer: "정의역 {0, 1, 2, 3}, 치역 {12, 15, 18, 21}달러", feedback: "입력은 가능한 포스터 장수이고, 치역은 그 입력에 대응하는 비용이에요." }),
            Object.freeze({ prompt: "물통에 물 24L가 있고 한 시간마다 3L씩 빠져나가요. W(t) = 24 − 3t일 때 물이 바닥나기 전까지 가능한 정수 시간 t와 W(8)을 구하세요.", answer: "t = 0, 1, …, 8; W(8) = 0L", feedback: "시간은 0부터 시작하고 물의 양이 음수가 되지 않는 동안만 이 모형을 사용해요." })
          ])
        }),
        Object.freeze({
          title: "기울기와 시작값을 상황의 단위로 읽기",
          objective: "y = mx + b에서 기울기 m과 시작값 b를 찾아 각 값의 단위와 상황적 의미를 설명한다.",
          idea: "기울기는 입력이 한 단위 늘 때 출력이 얼마나 변하는지 나타내요. 시작값은 입력이 0일 때의 출력이에요.",
          example: Object.freeze({ prompt: "택시 요금 T(m) = 6 + 1.5m에서 6과 1.5가 각각 뜻하는 바를 말하고, 4분 이동한 요금을 구하세요.", solution: "시작값 6은 처음 요금 6달러이고, 기울기 1.5는 분당 1.5달러예요. T(4) = 6 + 1.5 × 4 = 12달러예요." }),
          practice: Object.freeze([
            Object.freeze({ prompt: "복사 비용 C(x) = 10 + 2.5x에서 기본료와 한 장당 비용을 찾아 x = 4일 때 전체 비용을 구하세요.", answer: "기본료 10달러, 장당 2.50달러, C(4) = 20달러", feedback: "상수항은 시작 비용이고 x의 계수는 복사 한 장이 더해질 때 증가하는 비용이에요." }),
            Object.freeze({ prompt: "주간 저축액 S(w) = 20 + 4w에서 시작값과 매주 증가량을 말하세요.", answer: "시작값 20달러, 매주 4달러 증가", feedback: "w의 계수 4는 주당 저축액의 변화량이고, 상수항 20은 w = 0일 때 금액이에요." })
          ])
        }),
        Object.freeze({
          title: "표·식·그래프 연결하기",
          objective: "표의 일정한 변화량에서 일차함수의 규칙을 찾고, 입력·출력 쌍을 좌표와 그래프의 점으로 나타낸다.",
          idea: "표에서 입력이 같은 만큼 늘 때 출력도 같은 양만큼 늘면 일차 관계일 수 있어요. x = 0의 출력은 세로축과 만나는 점을 알려 줘요.",
          example: Object.freeze({ prompt: "x가 0, 1, 2, 3일 때 y가 2, 5, 8, 11인 표를 보고 함수식을 찾으세요. 좌표평면에 처음 두 점을 쓴다면 어떤 점인가요?", solution: "x가 1 늘 때 y는 3씩 늘고 x = 0일 때 y = 2예요. 따라서 y = 3x + 2이고, 처음 두 점은 (0, 2), (1, 5)예요." }),
          practice: Object.freeze([
            Object.freeze({ prompt: "x가 0, 1, 2, 3일 때 y가 −1, 2, 5, 8이에요. 변화량과 시작값을 이용해 식을 쓰세요.", answer: "y = 3x − 1", feedback: "y는 x가 1 늘 때 3씩 증가하고, x = 0일 때 −1이에요." }),
            Object.freeze({ prompt: "x가 0, 2, 4일 때 y가 5, 11, 17이에요. 기울기와 시작값, 함수식을 구하세요.", answer: "기울기 3, 시작값 5, y = 3x + 5", feedback: "x가 2 늘 때 y가 6 늘므로 한 단위당 변화량은 6 ÷ 2 = 3이에요." })
          ])
        }),
        Object.freeze({
          title: "두 일차 관계 비교하고 만나는 지점 해석하기",
          objective: "두 함수를 표·식으로 비교하고, 교점의 입력과 출력이 상황에서 뜻하는 바를 설명한다.",
          idea: "두 그래프가 만나는 점에서는 같은 입력에 대한 출력이 같아요. 교점 전후에는 어느 함수의 출력이 더 큰지 비교할 수 있어요.",
          example: Object.freeze({ prompt: "체험 A의 비용은 A(w) = 15 + 3w, 체험 B는 B(w) = 7 + 4w예요. 비용이 같아지는 이용 횟수와 그때의 비용을 구하세요.", solution: "15 + 3w = 7 + 4w를 풀면 w = 8이에요. 비용은 15 + 3 × 8 = 39달러예요. 8회 전에는 B가 더 저렴하고, 8회 뒤에는 A가 더 저렴해요." }),
          practice: Object.freeze([
            Object.freeze({ prompt: "A(n) = 9 + 2n, B(n) = 3 + 3n일 때 두 비용이 같아지는 n과 비용을 구하세요.", answer: "n = 6, 두 비용은 각각 21달러", feedback: "9 + 2n = 3 + 3n을 풀어 n = 6을 얻고 두 식에 넣어 확인해요." }),
            Object.freeze({ prompt: "P(x) = 10 + 5x, Q(x) = 22 + 2x일 때 두 함수가 같은 값을 갖는 입력과 출력을 구하세요.", answer: "x = 4일 때 출력은 30", feedback: "10 + 5x = 22 + 2x의 해를 구한 뒤 두 함수에 대입해 출력이 같은지 확인해요." })
          ])
        }),
        Object.freeze({
          title: "상황에 맞는 일차함수 만들기",
          objective: "두 양 사이의 일정한 변화율을 함수식으로 나타내고 입력 범위와 결과의 단위를 함께 해석한다.",
          idea: "선형 모형은 같은 입력 간격에서 출력이 같은 양만큼 변하는 관계를 나타내요. 모델을 쓰기 전에 입력과 출력의 단위를 확인해요.",
          example: Object.freeze({ prompt: "자전거가 일정한 속력 48km/h로 이동해요. 출발 후 t시간의 이동거리 d를 나타내고, 1.5시간 뒤 거리와 4시간 동안 사용할 때의 입력 범위를 설명하세요.", solution: "d(t) = 48t예요. d(1.5) = 72km이고, 4시간 이동을 나타낼 때 시간의 범위는 0 ≤ t ≤ 4예요. 입력은 시간, 출력은 이동거리예요." }),
          practice: Object.freeze([
            Object.freeze({ prompt: "입장료 14달러와 시간당 2달러를 내는 공간을 3.5시간 이용했어요. 비용 함수를 쓰고 전체 비용을 구하세요.", answer: "C(t) = 14 + 2t; C(3.5) = 21달러", feedback: "기본료를 시작값으로, 시간당 요금을 기울기로 두어요." }),
            Object.freeze({ prompt: "호출료 3달러와 거리 1km마다 1.80달러를 받는 이동 서비스에서 5km 이동한 비용을 구하고 기울기의 단위를 쓰세요.", answer: "12달러, 기울기 단위는 달러/km", feedback: "비용식은 C(d) = 3 + 1.8d이고 기울기는 거리 1km당 늘어나는 비용이에요." })
          ])
        })
      ])
    }),
    Object.freeze({
      id: "systems-inequalities",
      title: "연립방정식과 부등식",
      question: "조건이 여러 개일 때 가능한 해를 어떻게 찾고 걸러낼까요?",
      goals: ["연립일차방정식을 그래프·대입·소거로 풀고 같은 해를 갖는 이유를 설명한다", "해를 두 조건을 모두 만족하는 순서쌍과 그래프의 교점으로 해석한다", "일변수 부등식과 이변수 일차부등식의 해를 나타내고 상황의 제약 조건을 모델링한다"],
      standards: ["HSA-REI.B.3", "HSA-REI.C.5", "HSA-REI.C.6", "HSA-REI.D.10", "HSA-REI.D.12", "HSA-CED.A.3"],
      lesson: Object.freeze({ title: "축제 입장권 수 알아보기", prompt: "성인 입장권은 8달러, 학생 입장권은 5달러예요. 표 28장을 팔아 179달러를 모았다면 성인과 학생 표를 각각 몇 장 팔았나요? 두 조건을 식으로 나타내어 풀어 보세요.", solution: "성인 표를 a장, 학생 표를 s장이라 하면 a + s = 28, 8a + 5s = 179예요. 첫 식에서 s = 28 − a를 얻어 둘째 식에 넣으면 3a = 39, a = 13, s = 15예요. 두 식을 모두 만족하는지 확인해요.", extension: "두 직선을 좌표평면에 그렸을 때 교점 (13, 15)가 문제의 답인 이유를 설명해 보세요." }),
      lessons: Object.freeze([
        Object.freeze({
          title: "연립방정식의 해와 그래프의 교점",
          objective: "연립일차방정식의 해가 두 방정식을 모두 참으로 만드는 순서쌍이며 두 그래프의 교점임을 설명한다.",
          idea: "순서쌍을 두 식에 각각 대입해 확인할 수 있어요. 두 직선이 만나는 점의 좌표는 두 관계를 동시에 만족해요.",
          example: Object.freeze({ prompt: "y = 2x + 1과 y = −x + 7의 교점을 구하고 두 식에 대입해 확인하세요.", solution: "두 식의 y값이 같으므로 2x + 1 = −x + 7이에요. 3x = 6에서 x = 2이고 y = 5예요. (2, 5)를 두 식에 넣으면 모두 참이므로 교점은 (2, 5)예요." }),
          practice: Object.freeze([
            Object.freeze({ prompt: "y = x + 2와 y = 10 − 2x의 교점 좌표를 구하세요.", answer: "(x, y) = (8/3, 14/3)", feedback: "두 y값을 같게 두어 x + 2 = 10 − 2x를 풀고, 구한 x를 한 식에 넣어요." }),
            Object.freeze({ prompt: "(3, 4)가 2x + y = 10과 y = x + 1을 모두 만족하는지 확인하세요.", answer: "두 식을 모두 만족해요. (3, 4)는 연립방정식의 해예요.", feedback: "x = 3, y = 4를 각각의 식에 대입해 양변이 같은지 확인해요." })
          ])
        }),
        Object.freeze({
          title: "대입법으로 연립방정식 풀기",
          objective: "한 변수가 이미 고립된 식을 다른 식에 대입해 연립일차방정식을 풀고 원래 식에서 검산한다.",
          idea: "같은 변수는 같은 수를 뜻해요. 한 식에서 변수와 같은 표현을 다른 식의 그 변수 자리에 넣어도 해는 유지돼요.",
          example: Object.freeze({ prompt: "x + y = 11, y = 2x + 2를 대입법으로 풀고 검산하세요.", solution: "둘째 식의 y를 첫째 식에 대입하면 x + 2x + 2 = 11이므로 x = 3이에요. y = 2 × 3 + 2 = 8이고, 3 + 8 = 11이므로 해는 (3, 8)예요." }),
          practice: Object.freeze([
            Object.freeze({ prompt: "x + y = 13, y = 3x + 1을 풀어 순서쌍으로 쓰세요.", answer: "(3, 10)", feedback: "y 자리에 3x + 1을 넣으면 x + 3x + 1 = 13이에요." }),
            Object.freeze({ prompt: "a = 2b − 1, a + b = 14를 풀고 두 식에서 확인하세요.", answer: "(a, b) = (9, 5)", feedback: "첫 식의 a를 둘째 식에 대입해 b를 구한 뒤 a를 계산해요." })
          ])
        }),
        Object.freeze({
          title: "소거법으로 연립방정식 풀기",
          objective: "두 식을 더하거나 빼서 한 변수를 소거하고, 변형된 식이 원래 연립방정식과 같은 해를 갖는 이유를 설명한다.",
          idea: "같은 계수의 변수를 가진 식을 빼거나, 반대 계수의 변수를 가진 식을 더하면 그 변수가 없어져요. 식에 같은 배수를 더하거나 빼는 것은 해를 보존해요.",
          example: Object.freeze({ prompt: "2x + 3y = 14, 2x − y = 6을 소거법으로 풀어 보세요.", solution: "첫째 식에서 둘째 식을 빼면 4y = 8이므로 y = 2예요. 2x − 2 = 6에서 x = 4예요. (4, 2)를 두 식에 대입하면 둘 다 참이에요." }),
          practice: Object.freeze([
            Object.freeze({ prompt: "3x + 2y = 17, 3x − y = 5를 소거법으로 풀어 보세요.", answer: "(x, y) = (3, 4)", feedback: "둘째 식을 첫째 식에서 빼면 3y = 12가 돼요." }),
            Object.freeze({ prompt: "2a + b = 11, 2a − b = 1을 더해 연립방정식의 해를 구하세요.", answer: "(a, b) = (3, 5)", feedback: "두 식을 더하면 4a = 12예요. a를 구한 뒤 원래 식에 넣어 b를 찾아요." })
          ])
        }),
        Object.freeze({
          title: "상황을 연립방정식으로 나타내기",
          objective: "두 미지수와 두 조건을 정하고 연립방정식으로 모델링해 해를 구한 뒤 해가 맥락에 맞는지 설명한다.",
          idea: "두 수량 사이의 합 조건과 비용·개수 같은 별도의 조건이 함께 주어지면 각각 식으로 나타내요. 해는 두 조건을 모두 만족해야 해요.",
          example: Object.freeze({ prompt: "어른 표는 8달러, 학생 표는 5달러예요. 어른 표와 학생 표를 합해 5장을 사고 34달러를 냈다면 각각 몇 장인가요?", solution: "어른 표를 a장, 학생 표를 s장이라 하면 a + s = 5, 8a + 5s = 34예요. 첫 식에서 s = 5 − a를 대입하면 8a + 25 − 5a = 34라서 a = 3, s = 2예요. 표 수가 음이 아닌 정수이고 두 조건도 모두 맞아요." }),
          practice: Object.freeze([
            Object.freeze({ prompt: "학생들이 작은 공책과 큰 공책을 합해 18권 샀어요. 작은 공책은 4달러, 큰 공책은 7달러이고 총 99달러예요. 각각 몇 권 샀나요?", answer: "작은 공책 9권, 큰 공책 9권", feedback: "작은 공책 수를 x, 큰 공책 수를 y로 두고 x + y = 18, 4x + 7y = 99를 풀어요." }),
            Object.freeze({ prompt: "두 수의 합은 26이고 큰 수는 작은 수보다 8 커요. 두 수를 연립방정식으로 구하세요.", answer: "작은 수 9, 큰 수 17", feedback: "작은 수를 x, 큰 수를 y로 두면 x + y = 26, y − x = 8이에요." })
          ])
        }),
        Object.freeze({
          title: "일변수 부등식의 해 나타내기",
          objective: "일차부등식을 풀고 부등식 기호·수직선·구간으로 해를 나타내며 경계 포함 여부를 해석한다.",
          idea: "양변에 같은 수를 더하거나 빼도 부등호 방향은 유지돼요. 양변에 음수를 곱하거나 나누면 부등호 방향을 바꿔야 해요.",
          example: Object.freeze({ prompt: "−3 ≤ 2x + 1 < 9를 풀고 구간으로 나타내세요.", solution: "모든 변에서 1을 빼면 −4 ≤ 2x < 8이고, 2로 나누면 −2 ≤ x < 4예요. 구간으로는 [−2, 4)이며 왼쪽 끝은 포함하고 오른쪽 끝은 포함하지 않아요." }),
          practice: Object.freeze([
            Object.freeze({ prompt: "−5 < 3x + 1 ≤ 10을 풀고 구간으로 나타내세요.", answer: "−2 < x ≤ 3, 즉 (−2, 3]", feedback: "모든 변에서 1을 빼고 3으로 나눠요. 엄격한 부등호와 등호가 붙은 경계를 구분해요." }),
            Object.freeze({ prompt: "4 − 2y > 8을 풀어 보세요.", answer: "y < −2", feedback: "양변에서 4를 빼고 −2로 나눌 때 부등호 방향을 바꿔요." })
          ])
        }),
        Object.freeze({
          title: "연립부등식과 가능한 영역",
          objective: "두 변수 일차부등식을 반평면으로 나타내고, 여러 제약 조건을 동시에 만족하는 영역을 해로 해석한다.",
          idea: "각 부등식의 해는 좌표평면의 한쪽 영역이에요. 연립부등식의 해는 모든 영역이 겹치는 부분이며, 등호가 있으면 경계선도 포함해요.",
          example: Object.freeze({ prompt: "x ≥ 2, y ≥ 1, x + y ≤ 8을 만족하는 점인지 (3, 4)와 (1, 5)를 각각 확인하세요.", solution: "(3, 4)는 3 ≥ 2, 4 ≥ 1, 3 + 4 ≤ 8을 모두 만족해요. (1, 5)는 x ≥ 2를 만족하지 않으므로 해가 아니에요." }),
          practice: Object.freeze([
            Object.freeze({ prompt: "x ≥ 0, y ≥ 0, x + y ≤ 6에서 (2, 3), (4, 3), (−1, 2) 중 해가 되는 점을 고르세요.", answer: "(2, 3)만 해예요.", feedback: "각 점이 두 좌표의 비음수 조건과 합이 6 이하인 조건을 모두 만족하는지 확인해요." }),
            Object.freeze({ prompt: "동아리에서 과일 주스 x잔과 물 y병을 준비해요. x + y ≤ 20, x ≥ 6, y ≥ 4의 뜻을 말하고 (10, 8)이 가능한지 확인하세요.", answer: "총 20개 이하, 주스 6잔 이상, 물 4병 이상이에요. (10, 8)은 세 조건을 모두 만족해요.", feedback: "각 부등식은 준비 수량의 한 가지 제약을 나타내며, 가능한 조합은 조건을 모두 만족해야 해요." })
          ])
        })
      ])
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
    status: "units-1-3-sequences-published",
    scope: "미국 고등학교 공통 기준의 대수·함수 영역을 참고해 만든 지필드 학습 순서예요. 학교별 단원 순서와 깊이는 교사가 조정해요.",
    units: units,
    starterLesson: starterLesson,
    sources: Object.freeze([
      Object.freeze({ id: "algebra", shortTitle: "공통 기준 · 대수", title: "Common Core State Standards · High School Algebra", url: "https://www.thecorestandards.org/Math/Content/HSA/" }),
      Object.freeze({ id: "functions", shortTitle: "공통 기준 · 함수", title: "Common Core State Standards · High School Functions", url: "https://www.thecorestandards.org/Math/Content/HSF/" })
    ]),
    originalContentNotice: "이 설명과 연습 문제는 지필드가 새로 작성했어요. 공개 기준의 코드만 범위 확인에 사용했어요."
  });
});
