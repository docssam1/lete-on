export const GOLDEN_BELL_BOOKS = Object.freeze([
  {
    id: "book-01",
    label: "1권",
    title: "도형 움직이기와 마방진",
    status: "ready",
    source: {
      file: "더클래식_1과정_1N30권_골든벨_220222.pptx",
      studentFile: "더클래식_1과정_1N30권_학생new(무답)_골든벨_220222.pptx",
      verified: true,
      note: "교사용 정답과 학생용 무답본을 슬라이드 번호로 대조"
    },
    lessons: [
      {
        id: "clock-turning",
        unit: "도형 움직이기",
        title: "시계 바늘을 돌려요",
        sourceLocator: "교사용·학생용 슬라이드 2, 활동 01",
        sourceTypeIds: ["shape-rotation-clock"],
        representativeConcept: "한 바퀴는 처음 자리, 반 바퀴는 맞은편, 반의 반 바퀴는 세 칸 이동",
        story: {
          title: "시간 박물관의 잠긴 문",
          text: "시간 박물관의 문은 시계 바늘을 정확히 돌려야 열립니다. 바늘이 어느 방향으로 얼마나 움직이는지 먼저 몸으로 따라 해 봅시다.",
          mission: "한 바퀴, 반 바퀴, 반의 반 바퀴를 구별해 문을 열어 보세요."
        },
        explanation: {
          headline: "12에서 출발하면 움직인 칸 수를 눈으로 세어요.",
          steps: [
            "한 바퀴를 돌면 처음 자리인 12로 돌아옵니다.",
            "반 바퀴를 돌면 맞은편인 6에 도착합니다.",
            "반의 반 바퀴는 3칸입니다. 시계 방향은 3, 반대 방향은 9입니다."
          ]
        },
        original: {
          title: "원본 골든벨 확인",
          prompt: "12를 가리키는 시계 바늘을 다음과 같이 돌리면 어떤 수를 가리키는지 고르세요.",
          visual: { kind: "clock", value: 12 },
          items: [
            { id: "one-turn", prompt: "시계 방향으로 한 바퀴", options: ["3", "6", "9", "12"], answer: "12" },
            { id: "half-clockwise", prompt: "시계 방향으로 반 바퀴", options: ["3", "6", "9", "12"], answer: "6" },
            { id: "half-counter", prompt: "시계 반대 방향으로 반 바퀴", options: ["3", "6", "9", "12"], answer: "6" },
            { id: "quarter-clockwise", prompt: "시계 방향으로 반의 반 바퀴", options: ["3", "6", "9", "12"], answer: "3" },
            { id: "quarter-counter", prompt: "시계 반대 방향으로 반의 반 바퀴", options: ["3", "6", "9", "12"], answer: "9" }
          ]
        },
        extension: {
          title: "이야기 속 새 미션",
          story: "박물관의 두 번째 문에서는 바늘이 3에서 출발합니다.",
          prompt: "3을 가리키는 바늘을 시계 방향으로 반 바퀴 돌리면 어디를 가리킬까요?",
          visual: { kind: "clock", value: 3 },
          options: ["6", "9", "12", "3"],
          answer: "9",
          explanation: "반 바퀴는 맞은편으로 가므로 3의 맞은편인 9입니다."
        }
      },
      {
        id: "fold-one-cut",
        unit: "색종이 접기",
        title: "한 번 접고 잘라요",
        sourceLocator: "교사용·학생용 슬라이드 10, 활동 01 (1)",
        sourceTypeIds: ["fold-cut-unfold-choice"],
        representativeConcept: "접은 종이를 펼치면 접은 선을 기준으로 같은 모양이 대칭으로 나타남",
        story: {
          title: "별빛 초대장 만들기",
          text: "초대장을 반으로 접은 채 한쪽을 오려 냈습니다. 종이를 펼치면 잘린 모양이 접은 선의 반대쪽에도 똑같이 나타납니다.",
          mission: "접은 선을 거울이라고 생각하며 펼친 모양을 찾아보세요."
        },
        explanation: {
          headline: "접은 선은 거울선입니다.",
          steps: [
            "접힌 종이의 잘린 자리를 먼저 찾습니다.",
            "접은 선에서 같은 거리만큼 반대쪽에 같은 모양을 그립니다.",
            "두 모양은 접은 선을 사이에 두고 서로 마주 봅니다."
          ]
        },
        original: {
          title: "원본 골든벨 확인",
          prompt: "색종이를 한 번 접은 뒤 칠해진 부분을 잘라 냈습니다. 남은 부분을 펼쳤을 때의 모양을 고르세요.",
          visual: { kind: "fold-notch-options" },
          items: [
            { id: "fold-choice", prompt: "펼친 모양", options: ["1번", "2번", "3번", "4번"], answer: "3번" }
          ]
        },
        extension: {
          title: "이야기 속 새 미션",
          story: "별 모양 펀치로 반으로 접은 초대장을 한 번 뚫었습니다.",
          prompt: "접은 종이를 완전히 펼치면 별 모양 구멍은 몇 개가 될까요?",
          visual: { kind: "fold-star" },
          options: ["1개", "2개", "3개", "4개"],
          answer: "2개",
          explanation: "한 번 접힌 두 겹을 함께 뚫었으므로 펼치면 거울처럼 마주 보는 구멍 2개가 생깁니다."
        }
      },
      {
        id: "equal-line-sums",
        unit: "마방진과 가쿠로 퍼즐",
        title: "모든 줄의 합을 같게",
        sourceLocator: "교사용·학생용 슬라이드 20, 활동 01 (1)~(3)",
        sourceTypeIds: ["equal-line-sum"],
        representativeConcept: "겹치는 수를 제외한 나머지 부분의 합을 서로 같게 맞춤",
        story: {
          title: "네 갈래 별빛 길",
          text: "별빛 광장의 가로 길과 세로 길은 지나가는 빛의 합이 같아야 환하게 켜집니다. 가운데 수는 두 길에 함께 들어갑니다.",
          mission: "가운데 수를 두 번 계산하지 말고, 바깥쪽 수들의 합을 비교해 보세요."
        },
        explanation: {
          headline: "가운데 수는 양쪽 줄에 함께 있으니 잠시 빼고 비교합니다.",
          steps: [
            "가로줄과 세로줄에서 공통인 가운데 수를 찾습니다.",
            "가운데를 뺀 나머지 두 수의 합을 서로 같게 만듭니다.",
            "빈칸에 들어갈 수를 더해 두 줄을 다시 확인합니다."
          ]
        },
        original: {
          title: "원본 골든벨 확인",
          prompt: "모든 줄의 합이 같을 때 빈칸에 들어갈 수를 차례로 고르세요.",
          visual: {
            kind: "equal-line-set",
            diagrams: [
              { shape: "cross", top: null, left: 5, center: 3, right: 1, bottom: 4 },
              { shape: "cross", top: 6, left: null, center: 8, right: null, bottom: 2, verticalMiddle: 10 },
              { shape: "tee", left: 1, center: 13, right: null, down1: 4, down2: 7 }
            ]
          },
          items: [
            { id: "sum-1", prompt: "(1) 위쪽 빈칸", options: ["1", "2", "3", "4"], answer: "2" },
            { id: "sum-2", prompt: "(2) 오른쪽 빈칸", options: ["2", "4", "6", "8"], answer: "4" },
            { id: "sum-3", prompt: "(3) 오른쪽 빈칸", options: ["7", "9", "10", "12"], answer: "10" }
          ]
        },
        extension: {
          title: "이야기 속 새 미션",
          story: "새 광장의 가로 길에는 7, 5, 3이 놓이고 세로 길 아래에는 4가 놓였습니다.",
          prompt: "두 길의 합이 같아지려면 위쪽 빈칸에는 어떤 수가 들어갈까요?",
          visual: { kind: "equal-line", top: null, left: 7, center: 5, right: 3, bottom: 4 },
          options: ["4", "5", "6", "7"],
          answer: "6",
          explanation: "가로줄은 7+5+3=15입니다. 세로줄도 15가 되어야 하므로 빈칸+5+4=15, 빈칸은 6입니다."
        }
      },
      {
        id: "preference-logic",
        unit: "수추리와 논리추리",
        title: "좋아하는 것을 찾아요",
        sourceLocator: "교사용·학생용 슬라이드 32, 논리 추리 (1)~(3)",
        sourceTypeIds: ["preference-count-matrix-b9", "profession-assignment-b9"],
        representativeConcept: "한 사람씩 서로 다른 것을 고를 때 확정된 것부터 지우며 남은 답을 찾음",
        sourceHold: "슬라이드 32의 (4)는 공개 문장만으로 인물 조건이 완전하지 않아 원본 확인 트랙에서 보류",
        story: {
          title: "축제 준비 모둠",
          text: "친구들은 서로 다른 과일이나 운동을 하나씩 좋아합니다. 누가 무엇을 좋아하는지 확실한 조건부터 표시하면 남은 답이 보입니다.",
          mission: "좋아할 수 없는 것을 하나씩 지우고 마지막 하나를 찾아보세요."
        },
        explanation: {
          headline: "먼저 확정하고, 사용한 답은 다른 사람에게서 지워요.",
          steps: [
            "조건이 하나뿐인 사람을 먼저 찾습니다.",
            "그 사람이 고른 것은 다른 사람이 고를 수 없습니다.",
            "싫어한다는 조건도 지운 뒤 마지막 남은 것을 답으로 정합니다."
          ]
        },
        original: {
          title: "원본 골든벨 확인",
          prompt: "각자 하나씩 서로 다른 것을 좋아할 때 조건을 읽고 답을 고르세요.",
          visual: { kind: "logic-cards" },
          items: [
            { id: "logic-1", prompt: "A와 B는 사과와 딸기 중 서로 다른 과일을 좋아합니다. B는 사과를 좋아합니다. A가 좋아하는 과일은?", options: ["사과", "딸기"], answer: "딸기" },
            { id: "logic-2", prompt: "A, B, C는 축구, 수영, 스키를 하나씩 좋아합니다. A는 겨울에만 하는 운동을 좋아하고 B는 물을 무서워합니다. C가 좋아하는 운동은?", options: ["축구", "수영", "스키"], answer: "수영" },
            { id: "logic-3", prompt: "A, B, C는 키위, 멜론, 포도를 하나씩 좋아합니다. A는 키위와 포도를 싫어하고 C는 포도를 좋아합니다. B가 좋아하는 과일은?", options: ["키위", "멜론", "포도"], answer: "키위" }
          ]
        },
        extension: {
          title: "이야기 속 새 미션",
          story: "민지, 서윤, 도윤은 김밥, 샌드위치, 떡볶이를 하나씩 골랐습니다.",
          prompt: "민지는 떡볶이를 골랐고, 서윤은 김밥을 고르지 않았습니다. 도윤이 고른 음식은 무엇일까요?",
          visual: { kind: "logic-food" },
          options: ["김밥", "샌드위치", "떡볶이"],
          answer: "김밥",
          explanation: "민지가 떡볶이를 사용했습니다. 서윤은 김밥이 아니므로 샌드위치이고, 도윤에게는 김밥이 남습니다."
        }
      }
    ]
  },
  ...[
    ["book-02", "2권", "규칙찾기와 매트릭스", "더클래식_1과정_2N30권_골든벨_220415.ppt", "source-located"],
    ["book-03", "3권", "분수와 입체도형", "더클래식_1과정_3N30권_학생용(무답)_.골든벨_.pptx", "source-located"],
    ["book-04", "4권", "도형분할과 쌓기나무", "더클래식_1과정_4N30권_골든벨_220805(E2용).pptx", "source-located"],
    ["book-05", "5권", "곱셈매트릭스와 삼각수", "더클래식_1과정_5N30권_골든벨_221111(E2용).pptx", "source-located"],
    ["book-06", "6권", "논리와 수 퍼즐", "더클래식_1과정_6N30권_골든벨_221212(E2용).pptx", "source-located"],
    ["book-07", "7권", "규칙과 달력", "더클래식_1과정_7N30권_골든벨_230112(E2용).pptx", "source-located"],
    ["book-08", "8권", "매트릭스와 수 카드", "더클래식_1과정_8N30권_골든벨_230227(E2용) (2).pptx", "source-located"],
    ["book-09", "9권", "도형분할과 논리", "더클래식_1과정_9N30권_골든벨_230817 (1).pdf", "source-located"],
    ["book-10", "10권", "연속수와 따라잡기", "", "source-needed"]
  ].map(([id, label, title, file, status]) => ({
    id,
    label,
    title,
    status,
    source: {
      file,
      verified: false,
      note: status === "source-needed" ? "골든벨 원본 자료 보강 필요" : "비공개 원본 위치 확인 · 문항별 대조 중"
    },
    lessons: []
  }))
]);

export const goldenBellBookById = (id) => GOLDEN_BELL_BOOKS.find((book) => book.id === id) || GOLDEN_BELL_BOOKS[0];
