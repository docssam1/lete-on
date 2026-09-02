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
        experience: {
          kind: "clock-turning",
          family: "rotation",
          learnerStage: "필즈 더 클래식 1과정 1권",
          start: 2,
          beats: [
            { id: "start", action: "draw", quarterTurns: 0, result: 2, caption: "먼저 바늘을 2에 놓고 출발합니다." },
            { id: "full-turn", action: "transform", quarterTurns: 4, result: 2, caption: "한 바퀴는 시계판을 모두 돌아 처음 자리 2로 옵니다." },
            { id: "half-turn", action: "transform", quarterTurns: 2, result: 8, caption: "반 바퀴는 맞은편입니다. 2의 맞은편은 8입니다." },
            { id: "quarter-turn", action: "transform", quarterTurns: 1, result: 5, caption: "반의 반 바퀴는 세 칸 이동입니다. 2에서 시계 방향으로 가면 5입니다." },
            { id: "counter-quarter-turn", action: "transform", quarterTurns: -1, result: 11, caption: "반대 방향으로 세 칸 가면 11입니다." }
          ],
          check: {
            prompt: "2를 가리키는 바늘을 시계 방향으로 반 바퀴 돌리면 어디를 가리킬까요?",
            options: ["5", "8", "11"],
            answer: "8"
          },
          finalStill: { visibleBeatIds: ["start", "full-turn", "half-turn", "quarter-turn", "counter-quarter-turn"], standsAlone: true }
        },
        story: {
          title: "시간 박물관의 잠긴 문",
          text: "시간 박물관의 문은 시계 바늘을 정확히 돌려야 열립니다. 바늘이 어느 방향으로 얼마나 움직이는지 먼저 몸으로 따라 해 봅시다.",
          mission: "한 바퀴, 반 바퀴, 반의 반 바퀴를 구별해 문을 열어 보세요."
        },
        explanation: {
          headline: "2에서 출발하는 다른 예로 회전량을 읽어 봅니다.",
          steps: [
            "2에서 한 바퀴를 돌면 다시 2, 반 바퀴를 돌면 맞은편 8을 가리킵니다.",
            "반의 반 바퀴는 시계판을 네 부분으로 나눈 한 구간입니다.",
            "2에서 시계 방향으로 돌리면 5, 반대 방향으로 돌리면 11을 가리킵니다."
          ]
        },
        original: {
          title: "골든벨",
          structureKey: "clock-turn-landing",
          prompt: "12를 가리키고 있는 시계 바늘을 다음과 같이 돌리면 어떤 수를 가리키는지 구하시오.",
          visual: { kind: "clock", value: 12 },
          items: [
            { id: "one-turn", prompt: "(1) 시계 방향으로 한 바퀴 돌리면 어떤 수를 가리키는지 쓰시오.", answerMode: "input", inputMode: "numeric", answer: "12" },
            { id: "half-clockwise", prompt: "(2) 시계 방향으로 반 바퀴 돌리면 어떤 수를 가리키는지 쓰시오.", answerMode: "input", inputMode: "numeric", answer: "6" },
            { id: "half-counter", prompt: "(3) 시계 반대 방향으로 반 바퀴 돌리면 어떤 수를 가리키는지 쓰시오.", answerMode: "input", inputMode: "numeric", answer: "6" },
            { id: "quarter-clockwise", prompt: "(4) 시계 방향으로 반의 반 바퀴 돌리면 어떤 수를 가리키는지 쓰시오.", answerMode: "input", inputMode: "numeric", answer: "3" },
            { id: "quarter-counter", prompt: "(5) 시계 반대 방향으로 반의 반 바퀴 돌리면 어떤 수를 가리키는지 쓰시오.", answerMode: "input", inputMode: "numeric", answer: "9" }
          ]
        },
        extension: {
          title: "이야기 속 새 미션",
          structureKey: "clock-turn-landing",
          story: "박물관의 두 번째 문에서는 바늘이 3에서 출발합니다.",
          prompt: "3을 가리키는 바늘을 시계 방향으로 반 바퀴 돌리면 어디를 가리킬까요?",
          visual: { kind: "clock", value: 3 },
          answerMode: "input",
          inputMode: "numeric",
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
        experience: {
          kind: "guided-concept",
          family: "fold-symmetry",
          title: "접은 선을 거울처럼 펼쳐요",
          hint: "접은 선에서 같은 거리만큼 반대쪽을 찾아보세요. 모양은 서로 마주 봅니다.",
          beats: [
            { phase: "flat", caption: "색종이의 가운데 접은 선을 먼저 찾습니다." },
            { phase: "folded", caption: "왼쪽 반을 접은 선을 따라 오른쪽으로 포갭니다." },
            { phase: "cut", caption: "포개진 종이를 한 번 자르면 두 겹이 함께 잘립니다." },
            { phase: "unfolded", caption: "펼치면 접은 선 양쪽 같은 거리에 마주 보는 모양이 생깁니다." }
          ],
          check: { prompt: "종이를 펼쳤을 때 두 잘린 모양은 어떤 관계인가요?", options: ["접은 선에서 같은 거리에 마주 봐요", "같은 방향으로 나란히 옮겨져요", "한쪽에만 남아요"], answer: "접은 선에서 같은 거리에 마주 봐요", explanation: "접은 선이 거울선이므로 두 모양은 같은 거리에서 서로 마주 봅니다." }
        },
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
          title: "골든벨",
          structureKey: "single-fold-unfold-choice",
          prompt: "왼쪽 색종이를 한 번 접은 후 칠해진 부분을 잘라내었습니다. 남은 부분을 펼쳤을 때의 그림을 고르시오.",
          visual: { kind: "fold-notch-options" },
          items: [
            { id: "fold-choice", prompt: "펼친 모양", options: ["1번", "2번", "3번", "4번"], answer: "3번" }
          ]
        },
        extension: {
          title: "이야기 속 새 미션",
          structureKey: "single-fold-unfold-choice",
          story: "별빛 초대장을 반으로 접은 뒤 별 모양 펀치로 한 번 뚫었습니다.",
          prompt: "초대장을 완전히 펼쳤을 때의 별 모양 위치를 고르세요.",
          visual: { kind: "fold-story-options" },
          options: ["1번", "2번", "3번", "4번"],
          answer: "2번",
          explanation: "접은 선을 거울로 보면 펀치 자리가 반대쪽 같은 거리에도 생기므로 2번입니다."
        }
      },
      {
        id: "equal-line-sums",
        unit: "마방진과 가쿠로 퍼즐",
        title: "모든 줄의 합을 같게",
        sourceLocator: "교사용·학생용 슬라이드 20, 활동 01 (1)~(3)",
        sourceTypeIds: ["equal-line-sum"],
        representativeConcept: "겹치는 수를 제외한 나머지 부분의 합을 서로 같게 맞춤",
        experience: {
          kind: "guided-concept",
          family: "equal-line",
          title: "두 줄이 함께 쓰는 수를 찾아요",
          hint: "가운데 수는 두 줄에 똑같이 들어가므로, 바깥 두 수끼리 먼저 비교하면 계산이 짧아집니다.",
          model: { left: 6, center: 4, right: 2, bottom: 3, answer: 5 },
          beats: [
            { phase: "lines", caption: "가로줄과 세로줄을 각각 따라가 봅니다." },
            { phase: "center", caption: "두 줄에 공통으로 들어간 가운데 수를 찾습니다." },
            { phase: "compare", caption: "공통 수를 잠시 빼고 바깥 수의 합을 맞춥니다." },
            { phase: "solve", caption: "빈칸을 채운 뒤 두 줄의 전체 합을 다시 확인합니다." }
          ],
          check: { prompt: "가로 바깥 수가 8과 2, 세로 아래 수가 3일 때 위 빈칸은 얼마인가요?", options: ["5", "7", "9"], answer: "7", explanation: "가로 바깥 수의 합은 8 + 2 = 10입니다. 위 수 + 3도 10이어야 하므로 위 수는 7입니다." }
        },
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
          title: "골든벨",
          structureKey: "equal-line-missing-value",
          prompt: "모든 줄의 합이 같을 때, 빈 칸에 들어갈 수를 구하시오.",
          visual: {
            kind: "equal-line-set",
            diagrams: [
              { shape: "cross", top: null, left: 5, center: 3, right: 1, bottom: 4 },
              { shape: "cross", top: 6, left: null, center: 8, right: null, bottom: 2, verticalMiddle: 10 },
              { shape: "tee", left: 1, center: 13, right: null, down1: 4, down2: 7 }
            ]
          },
          items: [
            { id: "sum-1", prompt: "(1) 빈 칸에 들어갈 수", answerMode: "input", inputMode: "numeric", answer: "2" },
            { id: "sum-2", prompt: "(2) 빈 칸에 들어갈 수", answerMode: "input", inputMode: "numeric", answer: "4" },
            { id: "sum-3", prompt: "(3) 빈 칸에 들어갈 수", answerMode: "input", inputMode: "numeric", answer: "10" }
          ]
        },
        extension: {
          title: "이야기 속 새 미션",
          structureKey: "equal-line-missing-value",
          story: "새 광장의 가로 길에는 7, 5, 3이 놓이고 세로 길 아래에는 4가 놓였습니다.",
          prompt: "두 길의 합이 같아지려면 위쪽 빈칸에는 어떤 수가 들어갈까요?",
          visual: { kind: "equal-line", top: null, left: 7, center: 5, right: 3, bottom: 4 },
          answerMode: "input",
          inputMode: "numeric",
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
        experience: {
          kind: "guided-concept",
          family: "one-to-one-logic",
          title: "가능한 답을 하나씩 지워요",
          hint: "확정된 답은 같은 줄에서는 하나만 남기고, 같은 선택지의 세로줄에서는 다른 사람에게서 지웁니다.",
          model: { people: ["민", "준", "소"], choices: ["사과", "포도", "배"] },
          beats: [
            { phase: "start", caption: "각 사람에게 가능한 선택을 모두 표시합니다." },
            { phase: "fixed", caption: "민이 사과를 골랐다는 확실한 조건부터 표시합니다." },
            { phase: "eliminate", caption: "준은 배가 아니므로 포도를 고르고, 사용한 답을 지웁니다." },
            { phase: "solved", caption: "마지막으로 소에게 배 하나가 남습니다." }
          ],
          check: { prompt: "하나, 두리, 세모가 빨강·파랑·노랑을 하나씩 고릅니다. 하나는 빨강, 두리는 노랑이 아닙니다. 세모가 고른 색은 무엇인가요?", options: ["빨강", "파랑", "노랑"], answer: "노랑", explanation: "하나가 빨강을 사용했고 두리는 노랑이 아니므로 파랑입니다. 세모에게 노랑이 남습니다." }
        },
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
          title: "골든벨",
          structureKey: "one-to-one-preference-elimination",
          prompt: "각자 하나씩을 좋아할 때, 다음 조건을 읽고 물음에 답하시오.",
          visual: { kind: "logic-cards" },
          items: [
            { id: "logic-1", prompt: "(1) A와 B는 사과, 딸기 중에서 서로 다른 과일을 좋아합니다. A가 좋아하는 과일을 구하시오.", conditions: ["A의 친구는 사과를 좋아합니다."], answerMode: "input", answer: "딸기" },
            { id: "logic-2", prompt: "(2) A, B, C는 축구, 수영, 스키 중에서 서로 다른 운동을 좋아합니다. C가 좋아하는 운동을 구하시오.", conditions: ["A는 겨울에만 할 수 있는 운동을 좋아합니다.", "B는 물을 무서워합니다."], answerMode: "input", answer: "수영" },
            { id: "logic-3", prompt: "(3) A, B, C는 키위, 멜론, 포도 중에서 서로 다른 과일을 좋아합니다. B가 좋아하는 과일을 구하시오.", conditions: ["A는 키위와 포도를 싫어합니다.", "C는 포도를 좋아합니다."], answerMode: "input", answer: "키위" }
          ]
        },
        extension: {
          title: "이야기 속 새 미션",
          structureKey: "one-to-one-preference-elimination",
          story: "민지, 서윤, 도윤은 김밥, 샌드위치, 떡볶이를 하나씩 골랐습니다.",
          prompt: "민지는 떡볶이를 골랐고, 서윤은 김밥을 고르지 않았습니다. 도윤이 고른 음식은 무엇일까요?",
          visual: { kind: "logic-food" },
          answerMode: "input",
          answer: "김밥",
          explanation: "민지가 떡볶이를 사용했습니다. 서윤은 김밥이 아니므로 샌드위치이고, 도윤에게는 김밥이 남습니다."
        }
      }
    ]
  },
  {
    id: "book-02",
    label: "2권",
    title: "규칙찾기와 매트릭스",
    status: "ready",
    source: {
      file: "더클래식_1과정_2N30권_골든벨_220415.ppt",
      studentFile: "더클래식_1과정_2N30권_학생new(무답)골든벨_220415(수정).pptx",
      verified: true,
      note: "교사용 41슬라이드와 학생용 40슬라이드를 대응 문항으로 대조"
    },
    lessons: [
      {
        id: "addition-matrix",
        unit: "매트릭스와 주고받기",
        title: "가로와 세로의 합을 맞춰요",
        sourceLocator: "교사용·학생용 슬라이드 4, 활동 01",
        sourceTypeIds: ["shape-sum-table"],
        representativeConcept: "같은 도형은 같은 수이며, 가로와 세로의 합을 함께 보아 도형의 수를 찾음",
        experience: {
          kind: "guided-concept",
          family: "shape-substitution",
          title: "같은 모양부터 값을 찾아요",
          hint: "같은 모양 두 개의 합을 먼저 반으로 나누고, 찾은 값을 다른 식에 넣어 보세요.",
          model: { pairShape: "diamond", pairTotal: 18, pairValue: 9, targetShape: "circle", mixedTotal: 16, targetValue: 7 },
          beats: [
            { phase: "equations", caption: "두 식에서 같은 모양을 찾아 표시합니다." },
            { phase: "pair", caption: "마름모 두 개의 합 18을 똑같이 나누면 마름모는 9입니다." },
            { phase: "substitute", caption: "동그라미와 마름모의 합 16에 마름모 9를 넣습니다." },
            { phase: "verify", caption: "동그라미 7과 마름모 9를 다시 더해 16인지 확인합니다." }
          ],
          check: { prompt: "세모 두 개의 합은 12이고, 별과 세모의 합은 17입니다. 별이 나타내는 수는 얼마인가요?", options: ["5", "6", "11"], answer: "11", explanation: "세모 두 개가 12이므로 세모는 6입니다. 17에서 6을 빼면 별은 11입니다." }
        },
        story: {
          title: "모양 우체국의 비밀 번호",
          text: "모양 우체국에서는 같은 모양마다 늘 같은 수를 붙입니다. 두 모양을 더한 수를 보면 숨은 수를 찾을 수 있습니다.",
          mission: "먼저 같은 모양끼리 더한 줄을 찾고, 이미 아는 수를 빼 보세요."
        },
        explanation: {
          headline: "같은 모양 두 개의 합부터 살펴봅니다.",
          steps: [
            "같은 모양 두 개의 합을 두 수로 똑같이 나눕니다.",
            "알게 된 도형의 수를 다른 줄에 넣습니다.",
            "가로와 세로의 합을 다시 더해 확인합니다."
          ]
        },
        original: {
          title: "골든벨",
          structureKey: "shape-addition-matrix",
          prompt: "같은 모양은 같은 수를 나타냅니다. 각 물음의 빈칸에 알맞은 수를 쓰시오.",
          visual: { kind: "book02-matrix-original" },
          items: [
            { id: "matrix-1", prompt: "(1) 세모가 나타내는 수", answerMode: "input", inputMode: "numeric", answer: "3" },
            { id: "matrix-2", prompt: "(2) 동그라미가 나타내는 수", answerMode: "input", inputMode: "numeric", answer: "4" },
            { id: "matrix-3", prompt: "(3)-1 동그라미가 나타내는 수", answerMode: "input", inputMode: "numeric", answer: "6" },
            { id: "matrix-4", prompt: "(3)-2 아래 가로줄의 합", answerMode: "input", inputMode: "numeric", answer: "10" },
            { id: "matrix-5", prompt: "(4) 아래 가로줄의 합", answerMode: "input", inputMode: "numeric", answer: "16" },
            { id: "matrix-6", prompt: "(5) 오른쪽 세로줄의 합", answerMode: "input", inputMode: "numeric", answer: "8" }
          ]
        },
        extension: {
          title: "이야기",
          structureKey: "shape-addition-matrix",
          story: "축제 배지에는 동그라미와 네모의 수가 적혀 있습니다.",
          prompt: "동그라미와 네모의 합은 14이고, 네모 두 개의 합은 18입니다. 동그라미가 나타내는 수를 쓰세요.",
          visual: { kind: "book02-matrix-story" },
          answerMode: "input",
          inputMode: "numeric",
          answer: "5",
          explanation: "네모 두 개가 18이므로 네모는 9입니다. 14에서 9를 빼면 동그라미는 5입니다."
        }
      },
      {
        id: "balance-order",
        unit: "양팔저울",
        title: "무게의 순서를 찾아요",
        sourceLocator: "교사용·학생용 슬라이드 14, 활동 02",
        sourceTypeIds: ["balance-order-chain"],
        representativeConcept: "저울에서 아래로 내려간 쪽이 더 무거우며, 여러 저울의 관계를 이어 전체 순서를 정함",
        experience: {
          kind: "guided-concept",
          family: "balance-order-chain",
          title: "내려간 쪽을 이어 순서를 만들어요",
          hint: "저울마다 아래로 내려간 물체를 먼저 표시한 뒤, 가운데에서 이어지는 물체를 찾으세요.",
          model: { first: ["곰", "토끼", "left"], second: ["토끼", "병아리", "left"], order: ["곰", "토끼", "병아리"] },
          beats: [
            { phase: "first", caption: "첫 저울은 곰 쪽이 내려가므로 곰이 토끼보다 무겁습니다." },
            { phase: "second", caption: "둘째 저울은 토끼 쪽이 내려가므로 토끼가 병아리보다 무겁습니다." },
            { phase: "chain", caption: "두 관계에서 함께 나온 토끼를 가운데에 놓고 이어 봅니다." },
            { phase: "verify", caption: "곰, 토끼, 병아리 순서가 두 저울과 모두 맞는지 확인합니다." }
          ],
          check: { prompt: "고양이가 강아지보다 무겁고, 강아지가 오리보다 무겁습니다. 가장 무거운 동물은 누구인가요?", options: ["고양이", "강아지", "오리"], answer: "고양이", explanation: "고양이 > 강아지 > 오리로 이어지므로 고양이가 가장 무겁습니다." }
        },
        story: {
          title: "장난감 가게의 무게표",
          text: "장난감마다 무게가 다르지만 저울 세 개를 보면 어느 것이 더 무거운지 알 수 있습니다.",
          mission: "각 저울에서 더 무거운 것을 표시한 뒤 관계를 한 줄로 이어 보세요."
        },
        explanation: {
          headline: "내려간 쪽이 더 무겁습니다.",
          steps: [
            "첫 저울에서 A와 B를 비교합니다.",
            "둘째 저울에서 A와 C를 비교합니다.",
            "셋째 저울로 C와 B의 순서까지 확인합니다."
          ]
        },
        original: {
          title: "골든벨",
          structureKey: "three-object-balance-order",
          prompt: "세 양팔저울을 보고 물음에 답하시오.",
          visual: { kind: "book02-balance-original" },
          items: [
            { id: "balance-1", prompt: "(1) A보다 가벼운 것을 모두 쓰시오. 두 기호는 쉼표로 나누어 쓰시오.", answerMode: "input", answer: "B,C" },
            { id: "balance-2", prompt: "(2) 가장 가벼운 것을 쓰시오.", answerMode: "input", answer: "B" },
            { id: "balance-3", prompt: "(3) 무거운 것부터 차례로 쓰시오. 예: A>C>B", answerMode: "input", answer: "A>C>B" }
          ]
        },
        extension: {
          title: "이야기",
          structureKey: "three-object-balance-order",
          story: "토끼, 거북이, 다람쥐 인형을 저울에 올렸습니다.",
          prompt: "두 저울을 보고 무거운 인형부터 차례로 쓰세요. 예: 토끼>거북이>다람쥐",
          visual: { kind: "book02-balance-story" },
          answerMode: "input",
          answer: "토끼>거북이>다람쥐",
          explanation: "첫 저울에서 토끼가 거북이보다 무겁고, 둘째 저울에서 거북이가 다람쥐보다 무겁습니다."
        }
      },
      {
        id: "dual-shape-color-pattern",
        unit: "규칙찾기와 수열",
        title: "모양과 색의 규칙을 함께 찾아요",
        sourceLocator: "교사용 슬라이드 24·학생용 슬라이드 23, 활동 04 (1)",
        sourceTypeIds: ["repeating-symbol-sequence"],
        representativeConcept: "모양 반복과 색 반복을 따로 찾은 뒤 같은 자리에서 두 규칙을 합침",
        experience: {
          kind: "guided-concept",
          family: "dual-shape-color-cycle",
          title: "모양 주기와 색 주기를 따로 봐요",
          hint: "먼저 색을 가리고 모양만 읽고, 다음에는 모양을 가리고 빈 모양과 색칠한 모양만 읽어 보세요.",
          model: { shapes: ["circle", "triangle", "square"], fills: [false, true], count: 6 },
          beats: [
            { phase: "combined", caption: "한 줄에 모양 규칙과 색 규칙이 함께 들어 있습니다." },
            { phase: "shape", caption: "색을 가리면 동그라미, 세모, 네모가 세 칸마다 반복됩니다." },
            { phase: "fill", caption: "모양을 가리면 빈 모양, 색칠한 모양이 두 칸마다 반복됩니다." },
            { phase: "merge", caption: "같은 자리의 모양과 색을 다시 합쳐 다음 항을 정합니다." }
          ],
          check: { prompt: "모양은 동그라미·네모가 반복되고, 색은 빈 모양·빈 모양·색칠한 모양이 반복됩니다. 7번째는 무엇인가요?", options: ["빈 동그라미 ○", "색칠한 동그라미 ●", "빈 네모 □"], answer: "빈 동그라미 ○", explanation: "7번째 모양은 동그라미이고, 7번째 색 차례는 빈 모양이므로 빈 동그라미입니다." }
        },
        story: {
          title: "축제 전구의 두 가지 규칙",
          text: "전구는 모양도 반복되고 색도 따로 반복됩니다. 모양만 본 다음 색만 보면 다음 전구가 보입니다.",
          mission: "모양 규칙과 색 규칙을 각각 표시하고 마지막에 하나로 합쳐 보세요."
        },
        explanation: {
          headline: "모양과 색을 한꺼번에 보지 않고 나누어 봅니다.",
          steps: [
            "모양은 동그라미, 마름모, 별, 하트가 반복됩니다.",
            "검은색은 세 칸마다 나타납니다.",
            "두 규칙이 만나는 다음 모양을 정합니다."
          ]
        },
        original: {
          title: "골든벨",
          structureKey: "dual-shape-color-repeat",
          prompt: "모양과 색의 규칙을 찾아 빈칸에 들어갈 모양을 쓰시오.",
          visual: { kind: "book02-dual-pattern-original" },
          items: [
            { id: "pattern-1", prompt: "빈칸에 들어갈 모양", answerMode: "input", answer: "◆" }
          ]
        },
        extension: {
          title: "이야기",
          structureKey: "dual-shape-color-repeat",
          story: "무대 조명이 네 가지 모양과 세 칸마다 켜지는 색 규칙으로 이어집니다.",
          prompt: "규칙에 따라 빈칸에 들어갈 모양을 쓰세요.",
          visual: { kind: "book02-dual-pattern-story" },
          answerMode: "input",
          answer: "△",
          explanation: "모양은 세모, 네모, 동그라미, 별이 반복되어 다음은 세모입니다. 검은색 자리가 아니므로 빈 세모 △입니다."
        }
      },
      {
        id: "diamond-number-promise",
        unit: "약속과 스도쿠",
        title: "네 수의 약속을 찾아요",
        sourceLocator: "교사용 슬라이드 32·학생용 슬라이드 31, 활동 01 (1)",
        sourceTypeIds: ["four-number-center-rule"],
        representativeConcept: "앞의 완성된 그림에서 네 수의 계산 약속을 찾고 같은 약속으로 빈 수를 구함",
        experience: {
          kind: "guided-concept",
          family: "four-number-promise",
          title: "완성된 그림에서 숫자 약속을 찾아요",
          hint: "위 수와 왼쪽·아래·오른쪽 세 수를 비교하세요. 빈자리가 바뀌면 덧셈을 거꾸로 계산합니다.",
          model: { examples: [{ top: 17, left: 4, bottom: 6, right: 7 }, { top: 20, left: 5, bottom: 8, right: 7 }] },
          beats: [
            { phase: "observe", caption: "완성된 첫 그림의 위, 왼쪽, 아래, 오른쪽 수를 살펴봅니다." },
            { phase: "rule", caption: "왼쪽, 아래, 오른쪽 세 수를 더하면 위 수가 됩니다." },
            { phase: "confirm", caption: "둘째 그림에도 같은 덧셈 약속이 맞는지 확인합니다." },
            { phase: "reverse", caption: "옆 수가 비면 위 수에서 나머지 두 수를 빼서 찾습니다." }
          ],
          check: { prompt: "위 수가 25이고 왼쪽은 6, 아래는 8일 때 오른쪽 수는 얼마인가요?", options: ["9", "10", "11"], answer: "11", explanation: "6 + 8 + 오른쪽 수 = 25이므로 25 - 6 - 8 = 11입니다." }
        },
        story: {
          title: "보석 문의 숫자 약속",
          text: "보석 문의 위, 아래, 왼쪽, 오른쪽 수에는 같은 약속이 숨어 있습니다. 완성된 보석부터 비교하면 약속을 찾을 수 있습니다.",
          mission: "위의 수가 왼쪽, 아래쪽, 오른쪽 수와 어떤 관계인지 살펴보세요."
        },
        explanation: {
          headline: "위의 수는 나머지 세 수를 더한 값입니다.",
          steps: [
            "첫 그림에서 1+3+2=6인지 확인합니다.",
            "둘째 그림에서도 2+7+3=12인지 확인합니다.",
            "같은 방법으로 빈칸을 구합니다."
          ]
        },
        original: {
          title: "골든벨",
          structureKey: "diamond-three-sum-promise",
          prompt: "앞의 그림에서 네 수의 약속을 찾아 빈칸에 알맞은 수를 쓰시오.",
          visual: { kind: "book02-promise-original" },
          items: [
            { id: "promise-1", prompt: "(1) 위쪽 빈칸에 들어갈 수", answerMode: "input", inputMode: "numeric", answer: "18" },
            { id: "promise-2", prompt: "(2) 오른쪽 빈칸에 들어갈 수", answerMode: "input", inputMode: "numeric", answer: "9" }
          ]
        },
        extension: {
          title: "이야기",
          structureKey: "diamond-three-sum-promise",
          story: "마지막 보석 문의 위쪽 수가 지워졌습니다.",
          prompt: "왼쪽은 6, 아래쪽은 8, 오른쪽은 7일 때 위쪽 수를 쓰세요.",
          visual: { kind: "book02-promise-story" },
          answerMode: "input",
          inputMode: "numeric",
          answer: "21",
          explanation: "6+8+7=21이므로 위쪽 수는 21입니다."
        }
      }
    ]
  },
  {
    id: "book-03",
    label: "3권",
    title: "단위넓이와 복면산",
    status: "ready",
    source: {
      file: "더클래식_1과정_3N30권_골든벨_220609.ppt",
      studentFile: "더클래식_1과정_3N30권_학생용(무답)_.골든벨_.pptx",
      verified: true,
      note: "교사용·학생용 각 30슬라이드를 같은 위치의 그림과 빈칸으로 대조"
    },
    lessons: [
      {
        id: "six-multiple-equations",
        unit: "단위넓이와 분수",
        title: "6의 배수로 식을 바꿔요",
        sourceLocator: "교사용·학생용 슬라이드 6, 6의 배수",
        sourceTypeIds: ["constant-step-number-sequence"],
        representativeConcept: "6을 여러 번 더하거나 6의 배수만큼 더하고 뺀 식을 6×□ 꼴로 바꿈",
        experience: {
          kind: "guided-concept",
          family: "six-bundle-equation",
          title: "6개짜리 묶음 수로 식을 바꿔요",
          hint: "각 수가 6이 몇 묶음인지 먼저 표시한 뒤 묶음 수끼리 더하세요.",
          model: { base: 6, startGroups: 4, extraGroups: 2, totalGroups: 6 },
          beats: [
            { phase: "groups", caption: "6을 네 번 더한 식은 6개짜리 묶음이 4개입니다." },
            { phase: "extra", caption: "더해진 12는 6개짜리 묶음 2개입니다." },
            { phase: "combine", caption: "묶음 수 4와 2를 더하면 모두 6묶음입니다." },
            { phase: "verify", caption: "6×4+12와 6×6을 계산해 두 값이 같은지 확인합니다." }
          ],
          check: { prompt: "8×14+16=8×□입니다. 빈칸에 들어갈 수는 무엇인가요?", options: ["14", "16", "30"], answer: "16", explanation: "16은 8이 2묶음이므로 14+2=16입니다." }
        },
        story: {
          title: "여섯 칸 기차의 묶음표",
          text: "기차 한 칸에는 블록이 6개씩 들어갑니다. 블록 수를 모두 6개짜리 묶음으로 바꾸면 긴 식도 짧아집니다.",
          mission: "6이 몇 묶음인지 세고, 더하거나 뺀 6도 묶음 수에 반영하세요."
        },
        explanation: {
          headline: "모든 수를 6개짜리 묶음으로 바꿉니다.",
          steps: [
            "6을 더한 횟수는 그대로 6의 묶음 수가 됩니다.",
            "6을 한 번 더하면 묶음 수에 1을 더하고, 12를 빼면 2를 뺍니다.",
            "마지막에 양쪽 값을 계산해 같은지 확인합니다."
          ]
        },
        original: {
          title: "골든벨",
          structureKey: "multiple-base-equivalent-equations",
          prompt: "각 식이 성립하도록 빈칸에 알맞은 수를 쓰시오.",
          visual: { kind: "book03-six-original" },
          items: [
            { id: "six-1", prompt: "6+6+6+6+60=6×□", answerMode: "input", inputMode: "numeric", answer: "14" },
            { id: "six-2", prompt: "6×20+6=6×□", answerMode: "input", inputMode: "numeric", answer: "21" },
            { id: "six-3", prompt: "6×28+6+6=6×□", answerMode: "input", inputMode: "numeric", answer: "30" },
            { id: "six-4", prompt: "6+6+6+6=6×□", answerMode: "input", inputMode: "numeric", answer: "4" },
            { id: "six-5", prompt: "6+6+6+6=12×□", answerMode: "input", inputMode: "numeric", answer: "2" },
            { id: "six-6", prompt: "6+6+6+6=24×□", answerMode: "input", inputMode: "numeric", answer: "1" },
            { id: "six-7", prompt: "12×7=6×□", answerMode: "input", inputMode: "numeric", answer: "14" },
            { id: "six-8", prompt: "12×7=3×□", answerMode: "input", inputMode: "numeric", answer: "28" },
            { id: "six-9", prompt: "12×7=2×□", answerMode: "input", inputMode: "numeric", answer: "42" },
            { id: "six-10", prompt: "6×124-6=6×□", answerMode: "input", inputMode: "numeric", answer: "123" },
            { id: "six-11", prompt: "6×79-12=6×□", answerMode: "input", inputMode: "numeric", answer: "77" },
            { id: "six-12", prompt: "275×6-18=6×□", answerMode: "input", inputMode: "numeric", answer: "272" }
          ]
        },
        extension: {
          title: "이야기",
          structureKey: "multiple-base-equivalent-equations",
          story: "블록 8개짜리 묶음으로 식을 바꿉니다.",
          prompt: "8×25+16=8×□일 때 빈칸에 알맞은 수를 쓰세요.",
          visual: { kind: "book03-six-story" },
          answerMode: "input",
          inputMode: "numeric",
          answer: "27",
          explanation: "16은 8이 두 묶음이므로 25+2=27입니다."
        }
      },
      {
        id: "multiple-comparison",
        unit: "단위길이와 배수",
        title: "몇 배인지 찾아요",
        sourceLocator: "교사용·학생용 슬라이드 16, 활동 01 배수",
        sourceTypeIds: ["unit-length-multiple"],
        representativeConcept: "큰 양 안에 작은 양이 몇 번 들어가는지 같은 길이 또는 같은 개수의 묶음으로 셈",
        experience: {
          kind: "guided-concept",
          family: "multiple-direction",
          title: "기준량을 먼저 잡고 몇 배인지 세어요",
          hint: "‘비교하는 양은 기준량의 몇 배’인지 읽고, 비교하는 양을 기준량으로 나누세요.",
          model: { unit: 3, comparison: 12, ratio: 4, unitLabel: "기준 A", comparisonLabel: "비교 B" },
          beats: [
            { phase: "unit", caption: "먼저 기준 A의 길이 3을 한 묶음으로 정합니다." },
            { phase: "repeat", caption: "비교 B 안에 기준 A 묶음이 몇 번 들어가는지 표시합니다." },
            { phase: "divide", caption: "비교하는 양 12를 기준량 3으로 나눕니다." },
            { phase: "verify", caption: "12÷3=4이므로 B는 A의 4배인지 그림과 다시 확인합니다." }
          ],
          check: { prompt: "20은 5의 몇 배인가요?", options: ["2", "4", "5"], answer: "4", explanation: "20÷5=4이므로 20은 5의 4배입니다." }
        },
        story: {
          title: "운동장 줄과 공 묶음",
          text: "길이나 개수가 달라도 같은 크기의 한 묶음을 기준으로 하면 몇 배인지 알 수 있습니다.",
          mission: "큰 양을 작은 양과 같은 묶음으로 나누어 묶음 수를 세어 보세요."
        },
        explanation: {
          headline: "큰 수를 작은 수로 나누면 몇 배인지 알 수 있습니다.",
          steps: [
            "막대는 같은 길이의 칸 수를 비교합니다.",
            "그림은 작은 묶음이 큰 묶음 안에 몇 번 들어가는지 셉니다.",
            "수로 확인할 때는 큰 수를 작은 수로 나눕니다."
          ]
        },
        original: {
          title: "골든벨",
          structureKey: "multiple-comparison-groups",
          prompt: "그림과 식을 보고 빈칸에 알맞은 수를 쓰시오.",
          visual: { kind: "book03-multiple-original" },
          items: [
            { id: "multiple-1", prompt: "B는 A의 몇 배입니까?", answerMode: "input", inputMode: "numeric", answer: "4" },
            { id: "multiple-2", prompt: "A는 B의 몇 배입니까?", answerMode: "input", inputMode: "numeric", answer: "6" },
            { id: "multiple-3", prompt: "42는 6의 몇 배입니까?", answerMode: "input", inputMode: "numeric", answer: "7" },
            { id: "multiple-4", prompt: "16은 8의 몇 배입니까?", answerMode: "input", inputMode: "numeric", answer: "2" },
            { id: "multiple-5", prompt: "16은 2의 몇 배입니까?", answerMode: "input", inputMode: "numeric", answer: "8" },
            { id: "multiple-6", prompt: "35는 7의 몇 배입니까?", answerMode: "input", inputMode: "numeric", answer: "5" },
            { id: "multiple-7", prompt: "35는 5의 몇 배입니까?", answerMode: "input", inputMode: "numeric", answer: "7" }
          ]
        },
        extension: {
          title: "이야기",
          structureKey: "multiple-comparison-groups",
          story: "리본 48cm를 6cm씩 똑같이 나눕니다.",
          prompt: "48은 6의 몇 배인지 쓰세요.",
          visual: { kind: "book03-multiple-story" },
          answerMode: "input",
          inputMode: "numeric",
          answer: "8",
          explanation: "48 안에는 6이 8번 들어가므로 48은 6의 8배입니다."
        }
      },
      {
        id: "basic-vertical-cryptarithm",
        unit: "복면산",
        title: "반복되는 도형의 수를 찾아요",
        sourceLocator: "교사용·학생용 슬라이드 20, 활동 02",
        sourceTypeIds: ["cryptarithm-single-double"],
        representativeConcept: "같은 도형은 같은 숫자라는 약속으로 반복 덧셈과 받아올림을 거꾸로 풂",
        experience: {
          kind: "guided-concept",
          family: "vertical-cryptarithm-carry",
          title: "세로셈의 일의 자리부터 모양 수를 찾아요",
          hint: "세로줄을 맞춘 채 일의 자리 합을 먼저 보고, 생긴 받아올림을 십의 자리 모양과 연결하세요.",
          model: { symbol: "□", resultTens: "△", resultOnes: 2, symbolValue: 4, repeat: 3, carryValue: 1 },
          beats: [
            { phase: "layout", caption: "같은 네모 세 개를 세로로 같은 자리에 맞춰 놓습니다." },
            { phase: "ones", caption: "일의 자리에서 같은 수를 세 번 더해 끝자리 2가 되는 수를 찾습니다." },
            { phase: "carry", caption: "4+4+4=12이므로 십의 자리로 1이 올라갑니다." },
            { phase: "verify", caption: "네모는 4, 세모는 1을 넣어 세로셈 4+4+4=12를 확인합니다." }
          ],
          check: { prompt: "같은 동그라미를 세 번 더했더니 네모5가 되었습니다. 동그라미는 얼마인가요?", options: ["3", "5", "8"], answer: "5", explanation: "5+5+5=15이므로 동그라미는 5입니다." }
        },
        story: {
          title: "숫자를 숨긴 모양 계산기",
          text: "계산기는 같은 숫자를 같은 모양으로 가립니다. 세로셈의 결과를 보면 가려진 숫자를 되찾을 수 있습니다.",
          mission: "같은 도형이 몇 번 더해졌는지 세고, 두 자리 결과에서는 받아올림도 확인하세요."
        },
        explanation: {
          headline: "같은 도형을 같은 수로 놓고 세로로 더합니다.",
          steps: [
            "네모가 두 번이면 같은 수를 두 번 더한 값입니다.",
            "네모가 세 번이면 같은 수를 세 번 더합니다.",
            "결과가 두 자리이면 십의 자리 도형도 함께 확인합니다."
          ]
        },
        original: {
          title: "골든벨",
          structureKey: "repeated-symbol-vertical-addition",
          prompt: "같은 모양은 같은 숫자를 나타냅니다. 각 모양이 나타내는 수를 쓰시오.",
          visual: { kind: "book03-cryptarithm-original" },
          items: [
            { id: "crypt-1-square", prompt: "(1) 네모", answerMode: "input", inputMode: "numeric", answer: "3" },
            { id: "crypt-2-square", prompt: "(2) 네모", answerMode: "input", inputMode: "numeric", answer: "8" },
            { id: "crypt-2-triangle", prompt: "(2) 세모", answerMode: "input", inputMode: "numeric", answer: "1" },
            { id: "crypt-3-square", prompt: "(3) 네모", answerMode: "input", inputMode: "numeric", answer: "2" },
            { id: "crypt-4-square", prompt: "(4) 네모", answerMode: "input", inputMode: "numeric", answer: "7" },
            { id: "crypt-4-triangle", prompt: "(4) 세모", answerMode: "input", inputMode: "numeric", answer: "2" }
          ]
        },
        extension: {
          title: "이야기",
          structureKey: "repeated-symbol-vertical-addition",
          story: "모양 계산기에 같은 네모를 세 번 넣었더니 세모2가 나왔습니다.",
          prompt: "네모, 세모가 나타내는 수를 차례로 쉼표로 나누어 쓰세요.",
          visual: { kind: "book03-cryptarithm-story" },
          answerMode: "input",
          answer: "4,1",
          explanation: "4+4+4=12이므로 네모는 4, 세모는 1입니다."
        }
      },
      {
        id: "magic-square-targets",
        unit: "마법카드와 마방진",
        title: "마방진의 합과 빈칸을 찾아요",
        sourceLocator: "교사용·학생용 슬라이드 28, 활동 01",
        sourceTypeIds: ["magic-square-three-target"],
        representativeConcept: "3×3 마방진에서 가로·세로·대각선의 합이 같다는 성질로 한 줄의 합과 빈칸을 구함",
        experience: {
          kind: "guided-concept",
          family: "magic-line-target",
          title: "완성된 한 줄로 마방진의 목표 합을 찾아요",
          hint: "숫자 세 개가 모두 보이는 줄의 합을 먼저 구한 뒤, 빈칸이 있는 줄에서 보이는 두 수를 빼세요.",
          model: { grid: [2, 7, 6, 9, 5, 1, 4, null, 8], lineSum: 15, targetIndex: 7, target: 3 },
          beats: [
            { phase: "complete", caption: "숫자 세 개가 모두 보이는 첫째 줄을 찾습니다." },
            { phase: "target", caption: "2+7+6=15이므로 모든 줄의 목표 합은 15입니다." },
            { phase: "solve", caption: "아랫줄에서 15-4-8을 계산해 빈칸을 구합니다." },
            { phase: "verify", caption: "빈칸 3을 넣고 가로·세로·대각선의 합이 모두 15인지 확인합니다." }
          ],
          check: { prompt: "한 줄의 합이 15인 마방진에서 아랫줄이 4, 9, □입니다. □는 얼마인가요?", options: ["2", "4", "6"], answer: "2", explanation: "15-4-9=2이므로 빈칸은 2입니다." }
        },
        story: {
          title: "아홉 칸 숫자 문의 약속",
          text: "숫자 문의 가로, 세로, 대각선은 모두 같은 합이 되어야 열립니다.",
          mission: "숫자가 세 개 모두 보이는 줄에서 합을 먼저 구한 뒤 빈칸이 있는 줄에 적용하세요."
        },
        explanation: {
          headline: "완성된 한 줄의 합을 먼저 찾습니다.",
          steps: [
            "숫자 세 개가 모두 보이는 가로·세로·대각선을 찾습니다.",
            "그 줄의 합을 다른 모든 줄의 목표로 사용합니다.",
            "목표 합에서 이미 보이는 두 수를 빼 빈칸을 구합니다."
          ]
        },
        original: {
          title: "골든벨",
          structureKey: "three-by-three-magic-targets",
          prompt: "모든 줄의 합이 같도록 물음에 답하시오.",
          visual: { kind: "book03-magic-original" },
          items: [
            { id: "magic-1-sum", prompt: "(1) 첫째 마방진의 한 줄의 합", answerMode: "input", inputMode: "numeric", answer: "30" },
            { id: "magic-1-first", prompt: "(2) 첫째 마방진에서 가장 먼저 구할 수 있는 칸의 수", answerMode: "input", inputMode: "numeric", answer: ["12", "16"] },
            { id: "magic-1-triangle", prompt: "(3) 첫째 마방진의 세모", answerMode: "input", inputMode: "numeric", answer: "18" },
            { id: "magic-2-sum", prompt: "둘째 마방진의 합", answerMode: "input", inputMode: "numeric", answer: "45" },
            { id: "magic-2-triangle", prompt: "둘째 마방진의 세모", answerMode: "input", inputMode: "numeric", answer: "27" },
            { id: "magic-3-sum", prompt: "셋째 마방진의 합", answerMode: "input", inputMode: "numeric", answer: "27" },
            { id: "magic-3-triangle", prompt: "셋째 마방진의 세모", answerMode: "input", inputMode: "numeric", answer: "5" },
            { id: "magic-4-sum", prompt: "넷째 마방진의 합", answerMode: "input", inputMode: "numeric", answer: "21" },
            { id: "magic-4-triangle", prompt: "넷째 마방진의 세모", answerMode: "input", inputMode: "numeric", answer: "9" }
          ]
        },
        extension: {
          title: "이야기",
          structureKey: "three-by-three-magic-targets",
          story: "새 숫자 문에서도 모든 줄의 합은 같습니다.",
          prompt: "세모에 들어갈 수를 쓰세요.",
          visual: { kind: "book03-magic-story" },
          answerMode: "input",
          inputMode: "numeric",
          answer: "3",
          explanation: "첫째 줄의 합은 2+7+6=15입니다. 아래줄에서 4+세모+8=15이므로 세모는 3입니다."
        }
      }
    ]
  },
  {
    id: "book-04",
    label: "4권",
    title: "도형분할과 쌓기나무",
    status: "ready",
    source: {
      file: "더클래식_1과정_4N30권_골든벨_220805(E2용).pptx",
      pdfFile: "더클래식_1과정_4N30권_골든벨_220805.pdf",
      verified: true,
      note: "교사용 PPTX·47쪽 PDF의 같은 그림과 빨간 정답층을 대조하고, 답 표시를 분리할 수 있는 대표 문항만 공개"
    },
    lessons: [
      {
        id: "polyomino-family-count",
        unit: "도형분할과 움직이기",
        title: "붙인 정사각형의 모양을 세어요",
        sourceLocator: "교사용 PPTX·PDF 3쪽, 활동 02",
        sourceTypeIds: ["tetromino-family-choice"],
        representativeConcept: "정사각형을 변끼리 붙인 뒤 돌리거나 뒤집어 같아지는 모양은 한 종류로 셈",
        story: {
          title: "모양 공방의 네모 조각",
          text: "네모 조각을 변끼리 붙이면 여러 모양을 만들 수 있습니다. 돌리거나 뒤집어서 포개지는 것은 같은 모양입니다.",
          mission: "한 칸부터 네 칸까지 서로 다른 모양이 몇 개인지 겹치지 않게 세어 보세요."
        },
        explanation: {
          headline: "돌리고 뒤집어 포개지면 같은 종류입니다.",
          steps: [
            "정사각형은 꼭 변끼리 붙입니다.",
            "새 모양을 돌리거나 뒤집어 이미 만든 모양과 포개 봅니다.",
            "포개지지 않는 모양만 새 종류로 세어 표에 적습니다."
          ]
        },
        original: {
          title: "골든벨",
          structureKey: "polyomino-free-family-count",
          prompt: "크기가 같은 정사각형을 변끼리 붙여 만들 수 있는 서로 다른 도형의 종류를 쓰시오.",
          visual: { kind: "book04-polyomino-original" },
          items: [
            { id: "poly-1", prompt: "(1) 정사각형 1개로 만들 수 있는 도형의 종류", answerMode: "input", inputMode: "numeric", answer: "1" },
            { id: "poly-2", prompt: "(2) 정사각형 2개로 만들 수 있는 도형의 종류", answerMode: "input", inputMode: "numeric", answer: "1" },
            { id: "poly-3", prompt: "(3) 정사각형 3개로 만들 수 있는 도형의 종류", answerMode: "input", inputMode: "numeric", answer: "2" },
            { id: "poly-4", prompt: "(4) 정사각형 4개로 만들 수 있는 도형의 종류", answerMode: "input", inputMode: "numeric", answer: "5" }
          ]
        },
        extension: {
          title: "이야기",
          structureKey: "polyomino-free-family-count",
          story: "전시 선반에는 세 칸 조각과 네 칸 조각의 서로 다른 모양을 모두 올립니다.",
          prompt: "세 칸 조각과 네 칸 조각의 서로 다른 모양은 모두 몇 종류일까요?",
          visual: { kind: "book04-polyomino-story" },
          answerMode: "input",
          inputMode: "numeric",
          answer: "7",
          explanation: "세 칸 조각은 2종류, 네 칸 조각은 5종류이므로 모두 2+5=7종류입니다."
        }
      },
      {
        id: "hidden-cube-count",
        unit: "색종이 접기와 쌓기나무",
        title: "보이지 않는 쌓기나무를 찾아요",
        sourceLocator: "교사용 PPTX·PDF 18쪽, 쌓기나무의 개수 활동 02",
        sourceTypeIds: ["cube-hidden-count"],
        representativeConcept: "각 기둥의 전체 높이에서 그림에 보이는 쌓기나무를 빼 가려진 개수를 찾음",
        story: {
          title: "블록 도시의 숨은 방",
          text: "앞의 블록에 가려지거나 위 블록을 받치고 있어 보이지 않는 블록이 있습니다. 보이는 블록만 세면 전체보다 작습니다.",
          mission: "기둥마다 필요한 전체 개수를 센 뒤 보이는 개수를 빼 보세요."
        },
        explanation: {
          headline: "전체 개수에서 보이는 개수를 뺍니다.",
          steps: [
            "가장 위 블록을 보고 그 아래에 몇 개가 받치고 있어야 하는지 셉니다.",
            "모든 기둥의 높이를 더해 전체 개수를 구합니다.",
            "전체 개수에서 그림에 보이는 개수를 빼 숨은 블록 수를 확인합니다."
          ]
        },
        original: {
          title: "골든벨",
          structureKey: "visible-cubes-subtract-from-total",
          prompt: "다음 그림에서 보이지 않는 쌓기나무의 개수를 구하시오.",
          visual: {
            kind: "book04-hidden-cubes-original",
            scenes: [
              { map: [[2, 1], [1, 0]] },
              { map: [[3, 2], [2, 2]] },
              { map: [[3, 2, 1], [2, 1, 0], [1, 0, 0]] }
            ]
          },
          items: [
            { id: "hidden-1", prompt: "(1) 전체 4개 중 그림에 보이는 것은 3개입니다.", answerMode: "input", inputMode: "numeric", answer: "1" },
            { id: "hidden-2", prompt: "(2) 전체 9개 중 그림에 보이는 것은 7개입니다.", answerMode: "input", inputMode: "numeric", answer: "2" },
            { id: "hidden-3", prompt: "(3) 전체 10개 중 그림에 보이는 것은 6개입니다.", answerMode: "input", inputMode: "numeric", answer: "4" }
          ]
        },
        extension: {
          title: "이야기",
          structureKey: "visible-cubes-subtract-from-total",
          story: "블록 창고에는 모두 9개의 블록이 쌓여 있습니다.",
          prompt: "밖에서 보이는 블록이 6개라면 보이지 않는 블록은 몇 개일까요?",
          visual: { kind: "book04-hidden-cubes-story", scenes: [{ map: [[3, 2, 1], [2, 1, 0], [0, 0, 0]] }] },
          answerMode: "input",
          inputMode: "numeric",
          answer: "3",
          explanation: "전체 9개에서 보이는 6개를 빼면 보이지 않는 블록은 3개입니다."
        }
      },
      {
        id: "balance-substitution",
        unit: "양팔저울과 비교하기",
        title: "도형을 바꾸어 넣어요",
        sourceLocator: "교사용 PPTX·PDF 31쪽, 양팔저울과 바꾸어 넣기",
        sourceTypeIds: ["balance-unit-ratio"],
        representativeConcept: "첫 저울에서 한 도형을 네모 몇 개와 같은지 찾고 다음 저울의 같은 도형을 네모로 바꿈",
        sourceHold: "같은 쪽에 여러 관계가 이어져 교사용 표시만으로 원문을 확정하기 어려운 셋째 묶음은 잠금 유지",
        story: {
          title: "무게 연구소의 도형 상자",
          text: "평형인 저울의 양쪽 무게는 같습니다. 한 도형을 네모로 바꾼 뒤 다음 저울에 그대로 넣으면 목표 도형의 무게를 찾을 수 있습니다.",
          mission: "첫 저울의 관계를 다음 저울에 차례로 바꾸어 넣어 보세요."
        },
        explanation: {
          headline: "먼저 한 도형을 네모로 바꾸고 다음 저울에 넣습니다.",
          steps: [
            "첫 저울에서 세모 한 개가 네모 몇 개와 같은지 찾습니다.",
            "다음 저울의 세모를 같은 수의 네모로 바꿉니다.",
            "양쪽 네모 수가 같은지 세어 답을 확인합니다."
          ]
        },
        original: {
          title: "골든벨",
          structureKey: "balance-shape-unit-substitution",
          prompt: "다음 그림의 양팔저울은 모두 평형을 이루고 있습니다. 물음에 답하시오.",
          visual: { kind: "book04-balance-original" },
          items: [
            { id: "balance-circle", prompt: "(1) 동그라미 1개는 네모 몇 개의 무게와 같습니까?", answerMode: "input", inputMode: "numeric", answer: "3" },
            { id: "balance-empty", prompt: "(2) 두 번째 빈 접시에 네모 몇 개를 놓아야 합니까?", answerMode: "input", inputMode: "numeric", answer: "8" }
          ]
        },
        extension: {
          title: "이야기",
          structureKey: "balance-shape-unit-substitution",
          story: "보석 저울에서 별 1개는 네모 2개와 같고, 동그라미 1개는 별 1개와 네모 1개를 합한 무게와 같습니다.",
          prompt: "동그라미 1개는 네모 몇 개의 무게와 같을까요?",
          visual: { kind: "book04-balance-story" },
          answerMode: "input",
          inputMode: "numeric",
          answer: "3",
          explanation: "별 1개를 네모 2개로 바꾸면 동그라미는 네모 2개와 1개를 합한 3개입니다."
        }
      },
      {
        id: "cardinal-placement",
        unit: "논리추리와 자리배치",
        title: "동서남북으로 자리를 찾아요",
        sourceLocator: "교사용 PPTX·PDF 42쪽, 자리배치 활동 01",
        sourceTypeIds: ["directional-seat-placement", "directional-landmark-placement-book4"],
        representativeConcept: "한 장소를 기준으로 동·서·남·북 위치를 차례로 표시해 빈 자리의 이름을 찾음",
        story: {
          title: "네 거리 마을 안내판",
          text: "마을의 네 건물은 동서남북 조건에 맞춰 한 칸씩 놓입니다. 기준이 되는 장소를 먼저 쓰면 나머지 자리도 정해집니다.",
          mission: "동쪽과 서쪽, 북쪽과 남쪽을 화살표 방향에 맞게 표시해 보세요."
        },
        explanation: {
          headline: "기준 장소를 먼저 놓고 한 조건씩 이어 갑니다.",
          steps: [
            "동·서는 같은 가로줄, 남·북은 같은 세로줄에 놓습니다.",
            "두 조건에 함께 나오는 장소를 먼저 기준 칸에 씁니다.",
            "모든 조건을 다시 읽어 서로 겹치는 장소가 없는지 확인합니다."
          ]
        },
        original: {
          title: "골든벨",
          structureKey: "two-by-two-cardinal-placement",
          prompt: "조건에 맞게 네 칸에 위치를 찾아 쓰고, ㉮에 들어갈 이름을 구하시오.",
          visual: { kind: "book04-direction-original" },
          items: [
            {
              id: "direction-place",
              prompt: "(1) 마트, 서점, 은행, 학원을 놓을 때 ㉮에 있는 장소",
              conditions: ["마트는 은행의 서쪽에 있습니다.", "서점은 은행의 북쪽에 있고, 학원의 동쪽에 있습니다."],
              answerMode: "input",
              answer: "학원"
            },
            {
              id: "direction-home",
              prompt: "(2) 서연, 도윤, 준서, 시우의 집을 놓을 때 ㉮에 사는 친구",
              conditions: ["서연이네 집 남쪽에 도윤이네 집이 있습니다.", "준서네 집 동쪽에 도윤이네 집이 있고, 북쪽에는 시우네 집이 있습니다."],
              answerMode: "input",
              answer: "도윤"
            }
          ]
        },
        extension: {
          title: "이야기",
          structureKey: "two-by-two-cardinal-placement",
          story: "공원, 빵집, 도서관, 우체국이 네 거리의 네 칸에 하나씩 있습니다.",
          prompt: "빵집은 도서관의 서쪽에 있습니다. 우체국은 도서관의 북쪽에 있고 공원의 동쪽에 있습니다. ㉮에 있는 장소는 무엇일까요?",
          visual: { kind: "book04-direction-story" },
          answerMode: "input",
          answer: "공원",
          explanation: "도서관의 서쪽은 빵집, 북쪽은 우체국입니다. 우체국의 서쪽에 있는 ㉮는 공원입니다."
        }
      }
    ]
  },
  {
    id: "book-05",
    label: "5권",
    title: "곱셈매트릭스와 삼각수",
    status: "ready",
    source: {
      file: "더클래식_1과정_5N30권_골든벨_221111(E2용).pptx",
      pdfFile: "더클래식_1과정_5N30권_골든벨_220815.pdf",
      verified: true,
      note: "60슬라이드 교사용 PPTX를 주차별로 시각 대조하고, 구조와 빨간 정답을 분리할 수 있는 대표 문항만 공개"
    },
    lessons: [
      {
        id: "path-number-grid",
        unit: "수 배열표와 달력",
        title: "길을 따라 수를 이어요",
        sourceLocator: "교사용 PPTX 슬라이드 2, 수 배열표 활동",
        sourceTypeIds: ["sequential-path-number-grid"],
        representativeConcept: "화살표가 지나가는 칸을 첫 칸부터 하나씩 세어 목표 칸의 수를 찾음",
        story: {
          title: "숫자 마을의 세 갈래 길",
          text: "숫자는 네모 칸을 따라 한 칸씩 커집니다. 길이 꺾이거나 빙글 돌아도 지나온 칸의 순서는 바뀌지 않습니다.",
          mission: "화살표를 손가락으로 따라가며 물음표가 몇 번째 칸인지 세어 보세요."
        },
        explanation: {
          headline: "길의 모양보다 지나온 칸의 순서가 중요합니다.",
          steps: [
            "숫자 1이 있는 첫 칸을 찾습니다.",
            "화살표 방향으로 한 칸 갈 때마다 수를 1씩 크게 셉니다.",
            "물음표 칸까지 몇 번째인지 다시 따라가 답을 확인합니다."
          ]
        },
        original: {
          title: "골든벨",
          structureKey: "sequential-path-number-grid",
          prompt: "화살표를 따라 수를 차례로 쓸 때 물음표에 들어갈 수를 쓰시오.",
          visual: {
            kind: "book5-set",
            panels: [
              { label: "(1)", visual: { subtype: "path-number-grid", rows: 4, columns: 4, path: [[0,0],[0,1],[0,2],[0,3],[1,3],[1,2],[1,1],[1,0],[2,0],[2,1],[2,2],[2,3],[3,3],[3,2],[3,1],[3,0]], values: [[1,2,3,4],[8,7,6,5],[9,10,11,12],[16,15,14,13]], clues: [0,1,2,3,4,5,6,7,8], target: { index: 13 } } },
              { label: "(2)", visual: { subtype: "path-number-grid", rows: 4, columns: 4, path: [[0,0],[0,1],[0,2],[0,3],[1,3],[2,3],[3,3],[3,2],[3,1],[3,0],[2,0],[1,0],[1,1],[1,2],[2,2],[2,1]], values: [[1,2,3,4],[12,13,14,5],[11,16,15,6],[10,9,8,7]], clues: [0,1,2,3,4,5,6,7,8], target: { index: 15 } } },
              { label: "(3)", visual: { subtype: "path-number-grid", rows: 4, columns: 4, path: [[0,0],[0,1],[1,0],[2,0],[1,1],[0,2],[0,3],[1,2],[2,1],[3,0],[3,1],[2,2],[1,3],[2,3],[3,2],[3,3]], values: [[1,2,6,7],[3,5,8,13],[4,9,12,14],[10,11,15,16]], clues: [0,1,2,3,4,5,6,7,8], target: { index: 10 } } }
            ]
          },
          items: [
            { id: "path-1", prompt: "(1) 물음표에 들어갈 수", answerMode: "input", inputMode: "numeric", answer: "14" },
            { id: "path-2", prompt: "(2) 물음표에 들어갈 수", answerMode: "input", inputMode: "numeric", answer: "16" },
            { id: "path-3", prompt: "(3) 물음표에 들어갈 수", answerMode: "input", inputMode: "numeric", answer: "11" }
          ]
        },
        extension: {
          title: "이야기",
          structureKey: "sequential-path-number-grid",
          story: "숫자 기차가 5에서 출발해 소용돌이 선로를 한 칸씩 달립니다.",
          prompt: "물음표에 들어갈 수를 쓰세요.",
          visual: { kind: "book5", subtype: "path-number-grid", rows: 4, columns: 4, path: [[0,0],[0,1],[0,2],[0,3],[1,3],[2,3],[3,3],[3,2],[3,1],[3,0],[2,0],[1,0],[1,1],[1,2],[2,2],[2,1]], values: [[5,6,7,8],[16,17,18,9],[15,20,19,10],[14,13,12,11]], clues: [0,1,2,3,4,5,6,7,8], target: { index: 15 } },
          answerMode: "input",
          inputMode: "numeric",
          answer: "20",
          explanation: "5에서 시작해 화살표를 따라 15번 더 이동하면 수는 20이 됩니다."
        }
      },
      {
        id: "digit-card-ranked-number",
        unit: "최단거리와 숫자 카드",
        title: "숫자 카드로 만든 수의 차례를 찾아요",
        sourceLocator: "교사용 PPTX 슬라이드 29, 숫자 카드 활동",
        sourceTypeIds: ["digit-card-ranked-number"],
        representativeConcept: "숫자 카드를 한 번씩만 골라 만든 수를 크기순으로 늘어놓고 지정한 차례의 수를 찾음",
        sourceHold: "같은 슬라이드의 네 자리 수 여섯째 큰 수는 교사용 나열에서 더 큰 수가 누락되어 잠금 유지",
        story: {
          title: "숫자 카드 전시회",
          text: "같은 카드는 한 수에 한 번만 쓸 수 있습니다. 맨 앞자리에 0이 오면 약속한 자리 수가 되지 않습니다.",
          mission: "자리 수를 먼저 지키고, 작은 수 또는 큰 수부터 차례로 정리해 보세요."
        },
        explanation: {
          headline: "가장 큰 자리의 숫자부터 비교합니다.",
          steps: [
            "필요한 카드 수만큼 서로 다른 카드를 고릅니다.",
            "0은 맨 앞에 놓지 않고 약속한 자리 수를 만듭니다.",
            "가장 큰 자리부터 비교해 작은 수 또는 큰 수 순서로 늘어놓습니다."
          ]
        },
        original: {
          title: "골든벨",
          structureKey: "digit-card-ranked-number",
          prompt: "주어진 숫자 카드를 한 번씩만 사용하여 만든 수를 차례대로 늘어놓을 때 물음에 답하시오.",
          visual: {
            kind: "book5-set",
            panels: [
              { label: "작은 수부터", visual: { subtype: "digit-cards", digits: [0,6,7,8], length: 3, targetRank: 5 } }
            ]
          },
          items: [
            { id: "cards-small", prompt: "세 자리 수를 작은 수부터 늘어놓았을 때 다섯째 수", answerMode: "input", inputMode: "numeric", answer: "680" }
          ]
        },
        extension: {
          title: "이야기",
          structureKey: "digit-card-ranked-number",
          story: "카드 가게에서 2, 4, 6, 8 카드 중 세 장을 골라 진열 번호를 만듭니다.",
          prompt: "만든 세 자리 수를 작은 수부터 늘어놓았을 때 넷째 수를 쓰세요.",
          visual: { kind: "book5", subtype: "digit-cards", digits: [2,4,6,8], length: 3, targetRank: 4 },
          answerMode: "input",
          inputMode: "numeric",
          answer: "268",
          explanation: "작은 수부터 246, 248, 264, 268이므로 넷째 수는 268입니다."
        }
      },
      {
        id: "checkerboard-product-matrix",
        unit: "곱셈 매트릭스",
        title: "가로와 세로의 곱으로 카드를 놓아요",
        sourceLocator: "교사용 PPTX 슬라이드 40, 첫째 곱셈 매트릭스",
        sourceTypeIds: ["multiplication-matrix-placement", "checkerboard-product-matrix-book5"],
        representativeConcept: "2부터 9까지의 수 카드를 한 번씩 놓아 각 가로줄과 세로줄의 곱을 동시에 맞춤",
        sourceHold: "같은 슬라이드의 둘째 표는 2~9를 한 번씩 쓰는 조건과 교사용 표시가 함께 성립하지 않아 잠금 유지",
        story: {
          title: "곱셈 타일 연구소",
          text: "색칠된 여덟 칸에 2부터 9까지를 한 번씩 놓습니다. 가로줄과 세로줄 끝의 수는 그 줄에 놓인 두 수의 곱입니다.",
          mission: "한 줄만 맞추지 말고 가로와 세로의 곱을 모두 확인해 보세요."
        },
        explanation: {
          headline: "곱을 만들 수 있는 두 수를 찾고 교차하는 칸을 확인합니다.",
          steps: [
            "줄 끝의 곱을 2부터 9까지의 두 수로 가릅니다.",
            "가로줄과 세로줄에 함께 들어가는 수를 교차 칸에 놓습니다.",
            "2부터 9까지가 정확히 한 번씩 쓰였는지 마지막에 확인합니다."
          ]
        },
        original: {
          title: "골든벨",
          structureKey: "checkerboard-product-matrix",
          prompt: "2부터 9까지의 수 카드를 한 번씩 놓아 가로와 세로의 곱을 맞출 때 ㉮, ㉯, ㉰를 구하시오.",
          visual: { kind: "book5", subtype: "checkerboard-products", cardPool: [2,3,4,5,6,7,8,9], active: [[0,1],[0,2],[1,0],[1,3],[2,0],[2,1],[3,2],[3,3]], revealed: [[0,1],[2,0],[3,2]], cells: [["", "㉮", "", ""],["", "", "", ""],["㉯", "", "", ""],["", "", "㉰", ""]], rowProducts: [28,6,40,54], columnProducts: [15,56,36,12] },
          items: [
            { id: "matrix-a", prompt: "㉮에 들어갈 수", answerMode: "input", inputMode: "numeric", answer: "7" },
            { id: "matrix-b", prompt: "㉯에 들어갈 수", answerMode: "input", inputMode: "numeric", answer: "5" },
            { id: "matrix-c", prompt: "㉰에 들어갈 수", answerMode: "input", inputMode: "numeric", answer: "9" }
          ]
        },
        extension: {
          title: "이야기",
          structureKey: "checkerboard-product-matrix",
          story: "새 타일판에도 2부터 9까지의 수 카드를 한 번씩 놓습니다.",
          prompt: "모든 가로와 세로의 곱을 맞출 때 ㉮에 들어갈 수를 쓰세요.",
          visual: { kind: "book5", subtype: "checkerboard-products", cardPool: [2,3,4,5,6,7,8,9], active: [[0,1],[0,2],[1,0],[1,3],[2,0],[2,1],[3,2],[3,3]], revealed: [[0,1]], cells: [["", "㉮", "", ""],["", "", "", ""],["", "", "", ""],["", "", "", ""]], rowProducts: [24,18,35,24], columnProducts: [45,42,12,16] },
          answerMode: "input",
          inputMode: "numeric",
          answer: "6",
          explanation: "가로 24와 세로 42를 함께 만족하는 교차 칸의 수는 6입니다. 나머지 카드까지 놓으면 모든 곱이 맞습니다."
        }
      },
      {
        id: "cube-tetrahedral-growth",
        unit: "삼각수와 사각수",
        title: "삼각 계단의 쌓기나무를 세어요",
        sourceLocator: "교사용 PPTX 슬라이드 59, 삼각 계단 쌓기 활동",
        sourceTypeIds: ["cube-tetrahedral-growth"],
        representativeConcept: "각 층의 삼각수만큼 쌓인 쌓기나무를 아래층부터 차례로 더해 전체 개수를 구함",
        story: {
          title: "삼각 계단 블록 무대",
          text: "첫 층은 1개, 둘째 층은 3개, 셋째 층은 6개처럼 층마다 삼각 모양으로 블록이 늘어납니다.",
          mission: "각 층의 개수를 따로 센 뒤 아래층까지 모두 더해 보세요."
        },
        explanation: {
          headline: "삼각수는 1, 3, 6… / 사각수는 1, 4, 9…처럼 규칙을 만듭니다.",
          steps: [
            "삼각수는 1개, 1 + 2개, 1 + 2 + 3개처럼 한 줄씩 더해 만든 삼각형의 수입니다.",
            "사각수는 1개, 1 + 3개, 1 + 3 + 5개처럼 홀수 줄을 더해 만든 정사각형의 수입니다.",
            "삼각 계단 쌓기나무는 한 층마다 삼각수를 만들고, 그 층의 수를 아래층까지 더합니다."
          ]
        },
        experience: {
          kind: "triangular-stair",
          family: "tetrahedral-growth",
          learnerStage: "필즈 더 클래식 1과정 5권",
          title: "한 층씩 삼각형 바닥을 넓혀 쌓아요",
          hint: "새 층의 바닥은 바로 전 층보다 한 줄이 더 많은 삼각형이에요. 줄마다 놓인 쌓기나무 수를 1부터 차례로 더해 보세요.",
          typeTracks: [
            {
              id: "triangle-row-total",
              group: "삼각수",
              label: "한 줄씩 더한 삼각수",
              sourceTypeIds: ["staircase-tile-growth"],
              explanation: "첫째 줄 1개, 둘째 줄 2개, 셋째 줄 3개를 더하면 1, 3, 6처럼 삼각형 모양의 수가 됩니다.",
              visual: { kind: "triangular-rows", rows: [1, 2, 3], formula: "1 + 2 + 3 = 6" },
              check: { prompt: "1개, 2개, 3개, 4개를 줄마다 놓아 만든 다음 삼각수는 몇 개인가요?", options: ["9", "10", "12"], answer: "10", explanation: "1 + 2 + 3 + 4 = 10입니다." },
              practice: { prompt: "삼각수 10을 만들 때, 마지막 줄에는 몇 개를 놓았나요?", options: ["3", "4", "5"], answer: "4", explanation: "1 + 2 + 3 + 4 = 10이므로 마지막 줄은 4개입니다." }
            },
            {
              id: "triangle-row-boundaries",
              group: "삼각수",
              label: "삼각수 줄의 처음과 끝",
              sourceTypeIds: ["triangular-row-boundary-number"],
              explanation: "수를 1개, 2개, 3개씩 다음 줄에 이어 쓰면 각 줄의 처음과 끝이 달라집니다. 앞줄까지의 수를 더해 다음 줄의 자리를 찾습니다.",
              visual: { kind: "triangle-boundaries", rows: [[1], [2, 3], [4, 5, 6]] },
              check: { prompt: "1개, 2개, 3개씩 이어 쓴 뒤 다음 4번째 줄의 첫 수는 무엇인가요?", options: ["6", "7", "8"], answer: "7", explanation: "앞의 세 줄에는 1 + 2 + 3 = 6개가 있으므로 다음 줄은 7부터 시작합니다." },
              practice: { prompt: "4번째 줄에 4개를 썼다면, 그 줄의 마지막 수는 무엇인가요?", options: ["9", "10", "11"], answer: "10", explanation: "4번째 줄은 7, 8, 9, 10이므로 마지막 수는 10입니다." }
            },
            {
              id: "square-odd-rows",
              group: "사각수",
              label: "홀수 줄을 더한 사각수",
              sourceTypeIds: ["square-number-odd-sum", "square-row-boundary-number"],
              explanation: "정사각형을 한 줄씩 넓히면 새로 늘어나는 수는 1개, 3개, 5개처럼 홀수입니다. 그래서 1, 4, 9처럼 사각수가 됩니다.",
              visual: { kind: "square-odd-rows", odds: [1, 3, 5] },
              check: { prompt: "1 + 3 + 5 + 7을 더해 만든 정사각형에는 작은 칸이 몇 개인가요?", options: ["14", "15", "16"], answer: "16", explanation: "1 + 3 + 5 + 7 = 16이므로 4칸 × 4칸 정사각형입니다." },
              practice: { prompt: "1, 4, 9 다음에 오는 사각수는 무엇인가요?", options: ["12", "15", "16"], answer: "16", explanation: "한 줄이 4개인 정사각형은 4 × 4 = 16칸입니다." }
            },
            {
              id: "square-array-growth",
              group: "사각수",
              label: "정사각형 배열의 성장",
              sourceTypeIds: ["square-tile-growth"],
              explanation: "가로와 세로가 함께 한 칸씩 늘어나면 1칸, 2칸 × 2칸, 3칸 × 3칸처럼 1, 4, 9로 커집니다.",
              visual: { kind: "square-array", stages: [1, 2, 3] },
              check: { prompt: "가로와 세로가 4칸인 정사각형 배열에는 작은 칸이 몇 개인가요?", options: ["12", "14", "16"], answer: "16", explanation: "4 × 4 = 16이므로 16칸입니다." },
              practice: { prompt: "1, 4, 9 다음에 16이 오는 까닭으로 알맞은 것은 무엇인가요?", options: ["한 변이 한 칸씩 늘어나기 때문", "매번 3만 더하기 때문", "짝수만 더하기 때문"], answer: "한 변이 한 칸씩 늘어나기 때문", explanation: "정사각형의 한 변이 1, 2, 3, 4칸으로 늘어나므로 전체 칸 수는 1, 4, 9, 16입니다." }
            },
            {
              id: "triangle-tile-square-growth",
              group: "사각수",
              label: "삼각형 조각으로 만든 사각수",
              sourceTypeIds: ["triangle-tile-growth"],
              explanation: "조각은 삼각형이어도 한 변의 조각 수가 1, 2, 3으로 늘면 전체 조각 수는 1, 4, 9가 됩니다. 이 규칙은 사각수로 읽고, 모양만 보고 삼각수라고 부르지 않습니다.",
              visual: { kind: "triangle-tile-square", stages: [1, 4, 9] },
              check: { prompt: "한 변에 작은 삼각형 조각을 4개씩 놓으면 전체 조각 수는 몇 개인가요?", options: ["12", "14", "16"], answer: "16", explanation: "한 변의 조각 수가 4개이면 4 × 4 = 16개의 작은 삼각형 조각입니다." },
              practice: { prompt: "1, 4, 9, 16처럼 늘어나는 이 조각 수는 무엇으로 읽는 것이 알맞은가요?", options: ["사각수", "삼각수", "홀수"], answer: "사각수", explanation: "조각이 삼각형이어도 전체 수는 1², 2², 3², 4²처럼 사각수 규칙입니다." }
            },
            {
              id: "one-line-cube-stair",
              group: "쌓기나무",
              label: "한 줄 계단 쌓기",
              sourceTypeIds: ["cube-triangular-wall-growth"],
              explanation: "한 줄로 쌓는 계단은 높은 곳부터 1개, 2개, 3개처럼 한 칸씩 늘어납니다. 3단계는 1 + 2 + 3 = 6개입니다.",
              visual: { kind: "cube-stair", stage: 3 },
              check: { prompt: "한 줄 계단을 4단계까지 쌓으면 쌓기나무는 모두 몇 개인가요?", options: ["9", "10", "12"], answer: "10", explanation: "1 + 2 + 3 + 4 = 10개입니다." },
              practice: { prompt: "3단계 한 줄 계단에서 가장 높은 기둥은 몇 층인가요?", options: ["2층", "3층", "4층"], answer: "3층", explanation: "3단계이므로 가장 높은 기둥은 3층입니다." }
            },
            {
              id: "triangular-cube-stair",
              group: "쌓기나무",
              label: "삼각 계단 쌓기",
              sourceTypeIds: ["cube-tetrahedral-growth"],
              explanation: "삼각 계단은 한 층의 바닥부터 삼각수입니다. 1층은 1개, 2층은 3개, 3층은 6개이므로 아래층까지 모두 더해 셉니다.",
              visual: { kind: "tetrahedral", stage: 3 },
              check: { prompt: "3층까지 삼각 계단을 쌓으면 모두 몇 개인가요?", options: ["9", "10", "12"], answer: "10", explanation: "1층 1개 + 2층 3개 + 3층 6개 = 10개입니다." },
              practice: { prompt: "삼각 계단의 4층 바닥은 쌓기나무 몇 개인가요?", options: ["6", "9", "10"], answer: "10", explanation: "4층 바닥은 1 + 2 + 3 + 4 = 10개인 삼각형입니다." }
            }
          ],
          beats: [
            { id: "layer-1", stage: 1, layerCount: 1, totalCount: 1, caption: "맨 위에 쌓기나무 1개를 놓아 1층을 만들었어요.", check: { prompt: "1층에 놓인 쌓기나무는 몇 개인가요?", options: ["1", "2", "3"], answer: "1", success: "맞아요. 1층은 1개예요. 이제 그 아래에 더 넓은 삼각형 층을 만들어요." } },
            { id: "layer-2", stage: 2, layerCount: 3, totalCount: 4, caption: "1층 아래에 3개가 삼각형 모양으로 놓여 2단계가 되었어요.", check: { prompt: "새로 놓은 2층에는 쌓기나무가 몇 개인가요?", options: ["2", "3", "4"], answer: "3", success: "맞아요. 둘째 층은 1 + 2 = 3개예요. 지금까지는 1 + 3 = 4개가 쌓였어요." } },
            { id: "layer-3", stage: 3, layerCount: 6, totalCount: 10, caption: "이번에는 6개가 삼각형으로 넓어져 3층까지 차례로 쌓였어요.", check: { prompt: "새로 놓은 3층에는 쌓기나무가 몇 개인가요?", options: ["5", "6", "7"], answer: "6", success: "맞아요. 셋째 층은 1 + 2 + 3 = 6개예요. 1 + 3 + 6 = 10개가 되어 삼각 계단이 자라요." } }
          ],
          practice: [
            { id: "triangle-row-sum", kind: "triangular", rows: [1, 2, 3], prompt: "작은 삼각형을 만들기 위해 1개, 2개, 3개씩 놓았습니다. 모두 몇 개인가요?", options: ["5", "6", "7"], answer: "6", explanation: "1 + 2 + 3 = 6이므로 세 번째 삼각수는 6입니다." },
            { id: "square-odd-sum", kind: "square", rows: [1, 3, 5], prompt: "정사각형을 만들기 위해 1개, 3개, 5개씩 늘렸습니다. 모두 몇 개인가요?", options: ["8", "9", "10"], answer: "9", explanation: "1 + 3 + 5 = 9이므로 3칸 × 3칸 정사각형이 됩니다." },
            { id: "square-pattern", kind: "pattern", values: [1, 4, 9], prompt: "1, 4, 9처럼 정사각형으로 늘어나는 수를 무엇이라고 하나요?", options: ["삼각수", "사각수", "짝수"], answer: "사각수", explanation: "1 = 1 × 1, 4 = 2 × 2, 9 = 3 × 3이므로 사각수입니다." }
          ],
          finalStill: { visibleBeatIds: ["layer-1", "layer-2", "layer-3"], standsAlone: true }
        },
        original: {
          title: "골든벨",
          structureKey: "cube-tetrahedral-growth",
          prompt: "삼각 계단 모양으로 쌓기나무를 쌓을 때 물음에 답하시오.",
          visual: { kind: "book5", subtype: "tetrahedral-stair", previewStages: [1,2,3,4], targetStages: [4,7] },
          items: [
            { id: "stair-four", prompt: "(1) 4단계에 필요한 쌓기나무의 수", answerMode: "input", inputMode: "numeric", answer: "20" },
            { id: "stair-seven", prompt: "(2) 7단계에 필요한 쌓기나무의 수", answerMode: "input", inputMode: "numeric", answer: "84" }
          ]
        },
        extension: {
          title: "이야기",
          structureKey: "cube-tetrahedral-growth",
          story: "블록 무대가 같은 삼각 계단 규칙으로 5단계까지 자랐습니다.",
          prompt: "5단계 무대에 필요한 쌓기나무는 모두 몇 개일까요?",
          visual: { kind: "book5", subtype: "tetrahedral-stair", previewStages: [1,2,3,4,5], targetStages: [5] },
          answerMode: "input",
          inputMode: "numeric",
          answer: "35",
          explanation: "각 층의 1, 3, 6, 10, 15개를 더하면 35개입니다."
        }
      }
    ]
  },
  {
    id: "book-06",
    label: "6권",
    title: "수직선·둘레·연속수",
    status: "ready",
    source: {
      file: "더클래식_1과정_6N30권_골든벨_221212(E2용).pptx",
      answerFile: "더클래식_1과정_6N30권_골든벨 답안.pptx",
      companionFile: "더클래식_1과정_6N30권_골든벨_221208(E2용)1,2호.pptx",
      verified: true,
      note: "32슬라이드 전체 자료·답안 자료와 16슬라이드 1·2주차 자료를 화면별로 대조하고, 답 표시와 문항 구조를 분리할 수 있는 대표 활동만 공개"
    },
    lessons: [
      {
        id: "number-line-unit-distance",
        unit: "수직선의 분할과 비",
        title: "수직선 한 칸의 거리를 찾아요",
        sourceLocator: "전체·답안 PPTX 슬라이드 3, 수직선 활동",
        sourceTypeIds: ["number-line-unit-distance-book6"],
        representativeConcept: "두 끝 수의 차를 똑같이 나눈 칸 수로 나누어 수직선 한 칸의 거리를 구함",
        story: {
          title: "정류장 사이의 같은 거리",
          text: "출발점과 도착점 사이를 같은 길이의 구간으로 나누었습니다. 수직선의 작은 한 칸은 정류장 사이의 같은 거리를 뜻합니다.",
          mission: "두 끝 수를 빼 전체 거리를 구한 뒤, 나눈 칸 수로 똑같이 가르세요."
        },
        explanation: {
          headline: "끝 수의 차를 칸 수로 나누면 한 칸의 거리입니다.",
          steps: [
            "큰 끝 수에서 작은 끝 수를 빼 전체 거리를 구합니다.",
            "눈금이 아니라 눈금 사이의 칸 수를 셉니다.",
            "전체 거리를 칸 수로 나누어 한 칸의 거리를 확인합니다."
          ]
        },
        original: {
          title: "골든벨",
          structureKey: "number-line-equal-unit-distance",
          prompt: "두 끝 수 사이를 똑같이 나누었을 때 수직선 한 칸의 거리를 쓰시오.",
          visual: {
            kind: "book6-set",
            panels: [
              { label: "(1) 8등분", visual: { subtype: "number-line", intervals: 8, labels: [15,"","","","","","","",47] } },
              { label: "(2) 7등분", visual: { subtype: "number-line", intervals: 7, labels: [39,"","","","","","",95] } }
            ]
          },
          items: [
            { id: "line-eight", prompt: "15부터 47까지를 8등분한 한 칸의 거리", answerMode: "input", inputMode: "numeric", answer: "4" },
            { id: "line-seven", prompt: "39부터 95까지를 7등분한 한 칸의 거리", answerMode: "input", inputMode: "numeric", answer: "8" }
          ]
        },
        extension: {
          title: "이야기",
          structureKey: "number-line-equal-unit-distance",
          story: "12번 정류장에서 52번 정류장까지의 길을 같은 거리로 5구간 나누었습니다.",
          prompt: "한 구간의 거리는 얼마일까요?",
          visual: { kind: "book6", subtype: "number-line", intervals: 5, labels: [12,"","","","",52] },
          answerMode: "input",
          inputMode: "numeric",
          answer: "8",
          explanation: "52-12=40이고, 40을 5구간으로 똑같이 나누면 한 구간은 8입니다."
        }
      },
      {
        id: "rectangle-missing-side",
        unit: "도형의 둘레",
        title: "둘레로 빠진 변을 찾아요",
        sourceLocator: "전체·답안 PPTX 슬라이드 13, 직사각형의 한 변 활동",
        sourceTypeIds: ["quadrilateral-perimeter"],
        representativeConcept: "직사각형 둘레의 절반에서 알고 있는 한 변을 빼 다른 한 변의 길이를 구함",
        story: {
          title: "액자 공방의 빠진 길이표",
          text: "직사각형 액자의 네 변 중 한 변의 길이표가 지워졌습니다. 마주 보는 변끼리는 길이가 같습니다.",
          mission: "둘레를 2로 나눈 뒤, 알고 있는 한 변을 빼세요."
        },
        explanation: {
          headline: "직사각형 둘레의 절반은 서로 다른 두 변의 합입니다.",
          steps: [
            "둘레를 2로 나누어 가로와 세로의 합을 구합니다.",
            "그 합에서 알고 있는 한 변을 뺍니다.",
            "찾은 두 변을 더해 2배 했을 때 처음 둘레가 되는지 확인합니다."
          ]
        },
        original: {
          title: "골든벨",
          structureKey: "rectangle-perimeter-missing-side",
          prompt: "직사각형의 둘레와 한 변의 길이를 보고 다른 한 변의 길이를 쓰시오.",
          visual: {
            kind: "book6-set",
            panels: [
              { label: "(1)", visual: { subtype: "rectangle", widthLabel: "?", heightLabel: "9cm", perimeterLabel: "36cm" } },
              { label: "(2)", visual: { subtype: "rectangle", widthLabel: "32cm", heightLabel: "?", perimeterLabel: "100cm" } },
              { label: "(3)", visual: { subtype: "rectangle", widthLabel: "18cm", heightLabel: "?", perimeterLabel: "144cm" } },
              { label: "(4)", visual: { subtype: "rectangle", widthLabel: "?", heightLabel: "30cm", perimeterLabel: "150cm" } }
            ]
          },
          items: [
            { id: "perimeter-36", prompt: "(1) 빠진 한 변의 길이(cm)", answerMode: "input", inputMode: "numeric", answer: "9" },
            { id: "perimeter-100", prompt: "(2) 빠진 한 변의 길이(cm)", answerMode: "input", inputMode: "numeric", answer: "18" },
            { id: "perimeter-144", prompt: "(3) 빠진 한 변의 길이(cm)", answerMode: "input", inputMode: "numeric", answer: "54" },
            { id: "perimeter-150", prompt: "(4) 빠진 한 변의 길이(cm)", answerMode: "input", inputMode: "numeric", answer: "45" }
          ]
        },
        extension: {
          title: "이야기",
          structureKey: "rectangle-perimeter-missing-side",
          story: "둘레가 84cm인 직사각형 사진 액자의 한 변은 17cm입니다.",
          prompt: "다른 한 변은 몇 cm일까요?",
          visual: { kind: "book6", subtype: "rectangle", widthLabel: "17cm", heightLabel: "?", perimeterLabel: "84cm" },
          answerMode: "input",
          inputMode: "numeric",
          answer: "25",
          explanation: "84÷2=42이고, 42-17=25이므로 다른 한 변은 25cm입니다."
        }
      },
      {
        id: "inclusive-range-count",
        unit: "연속수의 합",
        title: "처음과 끝을 넣어 수를 세어요",
        sourceLocator: "전체·답안 PPTX 슬라이드 22, 수의 개수 활동",
        sourceTypeIds: ["inclusive-range-count"],
        representativeConcept: "처음 수와 끝 수를 모두 포함하므로 끝 수에서 처음 수를 뺀 뒤 1을 더함",
        story: {
          title: "연속 좌석의 번호표",
          text: "첫 좌석 번호와 마지막 좌석 번호가 모두 실제 좌석에 붙어 있습니다. 두 끝 번호를 빼기만 하면 첫 좌석 하나가 빠집니다.",
          mission: "끝 수-처음 수를 계산하고, 포함한 첫 수 한 개를 더하세요."
        },
        explanation: {
          headline: "양끝을 포함한 수의 개수는 끝 수-처음 수+1입니다.",
          steps: [
            "큰 끝 수에서 작은 시작 수를 뺍니다.",
            "처음 수와 끝 수를 모두 세므로 1을 더합니다.",
            "작은 범위로 직접 세어 같은 규칙인지 확인합니다."
          ]
        },
        original: {
          title: "골든벨",
          structureKey: "inclusive-consecutive-range-count",
          prompt: "처음 수와 끝 수를 모두 포함할 때 수는 모두 몇 개인지 쓰시오.",
          visual: {
            kind: "book6-set",
            panels: [
              { label: "(1)", visual: { subtype: "range-count", start: 5, end: 15, mode: "numbers" } },
              { label: "(2)", visual: { subtype: "range-count", start: 10, end: 69, mode: "numbers" } },
              { label: "(3)", visual: { subtype: "range-count", start: 21, end: 78, mode: "numbers" } },
              { label: "(4)", visual: { subtype: "range-count", start: 47, end: 96, mode: "numbers" } }
            ]
          },
          items: [
            { id: "range-5-15", prompt: "(1) 5부터 15까지 수의 개수", answerMode: "input", inputMode: "numeric", answer: "11" },
            { id: "range-10-69", prompt: "(2) 10부터 69까지 수의 개수", answerMode: "input", inputMode: "numeric", answer: "60" },
            { id: "range-21-78", prompt: "(3) 21부터 78까지 수의 개수", answerMode: "input", inputMode: "numeric", answer: "58" },
            { id: "range-47-96", prompt: "(4) 47부터 96까지 수의 개수", answerMode: "input", inputMode: "numeric", answer: "50" }
          ]
        },
        extension: {
          title: "이야기",
          structureKey: "inclusive-consecutive-range-count",
          story: "공연장 좌석이 28번부터 73번까지 빠짐없이 이어져 있습니다.",
          prompt: "좌석은 모두 몇 개일까요?",
          visual: { kind: "book6", subtype: "range-count", start: 28, end: 73, mode: "numbers" },
          answerMode: "input",
          inputMode: "numeric",
          answer: "46",
          explanation: "73-28+1=46이므로 좌석은 모두 46개입니다."
        }
      },
      {
        id: "number-and-digit-count",
        unit: "수와 숫자의 개수",
        title: "수의 개수와 쓴 숫자를 구별해요",
        sourceLocator: "전체·답안 PPTX 슬라이드 27, 수와 숫자의 개수 활동",
        sourceTypeIds: ["range-number-digit-count", "total-written-digits"],
        representativeConcept: "수의 개수는 항목 수를 세고, 숫자의 개수는 각 수를 적는 데 사용한 자리 수를 모두 더함",
        story: {
          title: "번호표 인쇄소의 두 장부",
          text: "한 장부에는 만든 번호표의 개수를, 다른 장부에는 번호를 쓰느라 인쇄한 숫자의 개수를 적습니다.",
          mission: "문제가 수를 묻는지, 수를 쓰는 데 사용한 숫자를 묻는지 먼저 표시하세요."
        },
        explanation: {
          headline: "수 한 개와 그 수를 적는 숫자 여러 개는 다릅니다.",
          steps: [
            "수의 개수는 끝 수-처음 수+1로 셉니다.",
            "숫자의 개수는 한 자리 수, 두 자리 수, 세 자리 수를 나누어 셉니다.",
            "각 구간의 수 개수에 자리 수를 곱해 모두 더합니다."
          ]
        },
        original: {
          title: "골든벨",
          structureKey: "range-number-versus-written-digit-count",
          prompt: "물음이 수의 개수인지 쓴 숫자의 개수인지 구별하여 답하시오.",
          visual: {
            kind: "book6-set",
            panels: [
              { label: "(1) 수", visual: { subtype: "range-count", start: 9, end: 26, mode: "numbers" } },
              { label: "(2) 수", visual: { subtype: "range-count", start: 14, end: 57, mode: "numbers" } },
              { label: "(3) 숫자", visual: { subtype: "range-count", start: 12, end: 39, mode: "digits" } },
              { label: "(4) 숫자", visual: { subtype: "range-count", start: 1, end: 100, mode: "digits" } }
            ]
          },
          items: [
            { id: "numbers-9-26", prompt: "(1) 9부터 26까지 수의 개수", answerMode: "input", inputMode: "numeric", answer: "18" },
            { id: "numbers-14-57", prompt: "(2) 14부터 57까지 수의 개수", answerMode: "input", inputMode: "numeric", answer: "44" },
            { id: "digits-12-39", prompt: "(3) 12부터 39까지 쓴 숫자의 개수", answerMode: "input", inputMode: "numeric", answer: "56" },
            { id: "digits-1-100", prompt: "(4) 1부터 100까지 쓴 숫자의 개수", answerMode: "input", inputMode: "numeric", answer: "192" }
          ]
        },
        extension: {
          title: "이야기",
          structureKey: "range-number-versus-written-digit-count",
          story: "번호표 인쇄소에서 1번부터 35번까지 번호를 빠짐없이 인쇄했습니다.",
          prompt: "번호를 쓰는 데 숫자를 모두 몇 개 인쇄했을까요?",
          visual: { kind: "book6", subtype: "range-count", start: 1, end: 35, mode: "digits" },
          answerMode: "input",
          inputMode: "numeric",
          answer: "61",
          explanation: "1부터 9까지 9개, 10부터 35까지 26×2=52개이므로 모두 61개입니다."
        }
      }
    ]
  },
  {
    id: "book-07",
    label: "7권",
    title: "달력·수열·가로수·집합",
    status: "ready",
    source: {
      file: "더클래식_1과정_7N30권_골든벨_230112(E2용).pptx",
      companionFile: "교사용지도서_더클래식_1과정_7N30권_달력과_우기기(230825).pdf",
      verified: true,
      note: "66슬라이드 교사용 자료와 지도서를 대조하고, 검은 지문·그림과 빨간 답 표시를 분리해 독립 계산할 수 있는 대표 활동만 공개"
    },
    lessons: [
      {
        id: "elapsed-time",
        unit: "달력과 시계",
        title: "시작과 끝 사이의 시간을 구해요",
        sourceLocator: "교사용 PPTX 슬라이드 7, 시간 계산 활동",
        sourceTypeIds: ["elapsed-time-analog-b7", "find-end-time-b7"],
        representativeConcept: "오전·오후와 60분 받아올림을 살피며 시작 시각, 끝 시각, 걸린 시간 중 빈 값을 구함",
        story: {
          title: "하루 일정표의 빈칸",
          text: "시작 시각과 끝 시각 사이에는 몇 시간이 지났는지, 또는 시작 시각에 걸린 시간을 더하면 몇 시가 되는지 찾습니다.",
          mission: "정오를 지나는지 먼저 보고, 분이 60을 넘거나 모자라면 1시간과 바꾸세요."
        },
        explanation: {
          headline: "시간과 분을 따로 계산하고 60분을 1시간으로 바꿉니다.",
          steps: [
            "시작 시각과 끝 시각을 같은 오전·오후 기준으로 놓습니다.",
            "분끼리 계산하며 60분이 되면 1시간으로 받아올리거나 받아내립니다.",
            "구한 시간을 시작 시각에 다시 더해 끝 시각이 맞는지 확인합니다."
          ]
        },
        original: {
          title: "골든벨",
          structureKey: "clock-elapsed-and-end-time",
          prompt: "시작 시각과 끝 시각 또는 걸린 시간을 보고 물음에 답하시오.",
          visual: {
            kind: "book7-set",
            panels: [
              { label: "(1)", visual: { subtype: "time-equation", expression: "오전 9시 40분 → 오후 2시 30분" } },
              { label: "(2)", visual: { subtype: "time-equation", expression: "오전 10시 53분 → 오후 3시 16분" } },
              { label: "(3)", visual: { subtype: "time-equation", expression: "오전 11시 10분 + 2시간 35분" } },
              { label: "(4)", visual: { subtype: "time-equation", expression: "오전 5시 45분 → 오전 10시 15분" } }
            ]
          },
          items: [
            { id: "elapsed-940-230", prompt: "(1) 걸린 시간", answerMode: "input", answer: "4시간 50분" },
            { id: "elapsed-1053-316", prompt: "(2) 걸린 시간", answerMode: "input", answer: "4시간 23분" },
            { id: "end-1110", prompt: "(3) 끝나는 시각", answerMode: "input", answer: "오후 1시 45분" },
            { id: "elapsed-545-1015", prompt: "(4) 걸린 시간", answerMode: "input", answer: "4시간 30분" }
          ]
        },
        extension: {
          title: "이야기",
          structureKey: "clock-elapsed-and-end-time",
          story: "체험 학습 버스가 오전 8시 25분에 출발해 3시간 50분 동안 달렸습니다.",
          prompt: "버스가 도착한 시각을 쓰세요.",
          visual: { kind: "book7", subtype: "time-equation", expression: "오전 8시 25분 + 3시간 50분" },
          answerMode: "input",
          answer: "오후 12시 15분",
          explanation: "8시 25분에 3시간을 더하면 11시 25분이고, 50분을 더하면 오후 12시 15분입니다."
        }
      },
      {
        id: "shared-polygon-matchsticks",
        unit: "규칙 찾기와 수열",
        title: "맞닿은 도형의 성냥개비를 세어요",
        sourceLocator: "교사용 PPTX 슬라이드 18, 도형에서의 등차수열 활동 12",
        sourceTypeIds: ["shared-polygon-matchsticks-b7"],
        representativeConcept: "첫 다각형의 변 수에서 시작해 도형을 하나 붙일 때마다 맞닿은 한 변을 제외한 변 수만큼 더함",
        story: {
          title: "성냥개비 도형 전시장",
          text: "도형을 한 변씩 맞대어 이어 붙이면 맞닿은 변은 새 성냥개비가 필요하지 않습니다.",
          mission: "첫 도형을 센 뒤 새 도형 하나를 붙일 때 몇 개가 늘어나는지 찾으세요."
        },
        explanation: {
          headline: "첫 도형의 변 수와 그다음부터 늘어나는 수가 다릅니다.",
          steps: [
            "첫 도형에 필요한 성냥개비 수를 셉니다.",
            "새 도형은 한 변을 함께 쓰므로 변 수보다 1개 적게 늘어납니다.",
            "목표 개수보다 하나 적은 횟수만큼 늘어난 수를 더합니다."
          ]
        },
        original: {
          title: "골든벨",
          structureKey: "shared-polygon-matchstick-sequence",
          prompt: "정삼각형을 한 변씩 맞대어 이어 붙일 때 필요한 성냥개비 수를 구하시오.",
          visual: {
            kind: "book7-set",
            panels: [
              { label: "정삼각형 10개", visual: { subtype: "matchsticks", sides: 3, shown: 4, count: 10 } },
              { label: "정삼각형 34개", visual: { subtype: "matchsticks", sides: 3, shown: 4, count: 34 } }
            ]
          },
          items: [
            { id: "triangle-ten", prompt: "(1) 정삼각형 10개에 필요한 성냥개비 수", answerMode: "input", inputMode: "numeric", answer: "21" },
            { id: "triangle-thirty-four", prompt: "(2) 정삼각형 34개에 필요한 성냥개비 수", answerMode: "input", inputMode: "numeric", answer: "69" }
          ]
        },
        extension: {
          title: "이야기",
          structureKey: "shared-polygon-matchstick-sequence",
          story: "정사각형 방을 한 변씩 맞대어 일렬로 8개 만들려고 합니다.",
          prompt: "필요한 성냥개비는 모두 몇 개일까요?",
          visual: { kind: "book7", subtype: "matchsticks", sides: 4, shown: 4, count: 8 },
          answerMode: "input",
          inputMode: "numeric",
          answer: "25",
          explanation: "첫 정사각형은 4개이고 이후에는 3개씩 7번 늘어나므로 4+3×7=25개입니다."
        }
      },
      {
        id: "closed-loop-planting",
        unit: "가로수 심기",
        title: "닫힌 둘레의 간격과 개수를 연결해요",
        sourceLocator: "교사용 PPTX 슬라이드 50, 원 모양 호수 활동 05~07",
        sourceTypeIds: ["closed-perimeter-from-spacing-count-b7", "between-object-perimeter-b7"],
        representativeConcept: "원처럼 닫힌 둘레에서는 물체 수와 간격 수가 같음을 이용해 둘레 또는 물체 수를 구함",
        story: {
          title: "호숫가 산책길",
          text: "원 모양 길은 시작점과 끝점이 이어집니다. 그래서 나무 한 그루마다 다음 나무까지의 간격이 하나씩 생깁니다.",
          mission: "닫힌 길에서는 물체 수와 간격 수가 같다는 것을 먼저 표시하세요."
        },
        explanation: {
          headline: "닫힌 길의 둘레는 물체 수×한 간격의 길이입니다.",
          steps: [
            "길이 닫혀 있는지, 양끝이 따로 있는지 확인합니다.",
            "닫힌 길에서는 물체 수와 간격 수가 같습니다.",
            "간격 수와 한 간격의 길이를 곱해 둘레를 구합니다."
          ]
        },
        original: {
          title: "골든벨",
          structureKey: "closed-loop-spacing-count",
          prompt: "원 모양 호수 주위의 물체 수와 간격을 보고 호수의 둘레를 구하시오.",
          visual: {
            kind: "book7-set",
            panels: [
              { label: "(1) 나무 20그루", visual: { subtype: "perimeter-loop", spacing: 15, count: 20, perimeter: "?" } },
              { label: "(2) 가로등 8개", visual: { subtype: "perimeter-loop", spacing: 12, count: 8, perimeter: "?" } },
              { label: "(3) 가로등 사이 나무 2그루", visual: { subtype: "between-loop", oldCount: 15, newPerGap: 2 } }
            ]
          },
          items: [
            { id: "trees-twenty", prompt: "(1) 나무 사이가 15m일 때 호수의 둘레(m)", answerMode: "input", inputMode: "numeric", answer: "300" },
            { id: "lamps-eight", prompt: "(2) 가로등 사이가 12m일 때 호수의 둘레(m)", answerMode: "input", inputMode: "numeric", answer: "96" },
            { id: "trees-between-lamps", prompt: "(3) 나무 30그루가 가로등 사이마다 2그루씩 있고 가로등 사이가 8m일 때 둘레(m)", answerMode: "input", inputMode: "numeric", answer: "120" }
          ]
        },
        extension: {
          title: "이야기",
          structureKey: "closed-loop-spacing-count",
          story: "둥근 화단 둘레에 꽃나무 18그루를 9m 간격으로 심었습니다.",
          prompt: "화단의 둘레는 몇 m일까요?",
          visual: { kind: "book7", subtype: "perimeter-loop", spacing: 9, count: 18, perimeter: "?" },
          answerMode: "input",
          inputMode: "numeric",
          answer: "162",
          explanation: "닫힌 둘레에서는 나무 18그루와 간격 18곳이 같으므로 18×9=162m입니다."
        }
      },
      {
        id: "venn-overlap-all",
        unit: "대칭수와 벤다이어그램",
        title: "겹친 곳을 먼저 찾아요",
        sourceLocator: "교사용 PPTX 슬라이드 63, 벤다이어그램 활동 01",
        sourceTypeIds: ["venn-overlap-all-b7", "venn-exactly-one-b7"],
        representativeConcept: "모두 적어도 한 조건에 속할 때 두 조건의 수를 더해 전체보다 많이 센 만큼을 겹친 수로 구함",
        story: {
          title: "과일 취향 조사표",
          text: "두 과일을 모두 좋아하는 친구는 왼쪽 원과 오른쪽 원에서 한 번씩, 모두 두 번 세어집니다.",
          mission: "두 조건의 수를 더한 뒤 전체보다 많이 센 수를 겹친 곳에 적으세요."
        },
        explanation: {
          headline: "두 집합의 합에서 전체를 빼면 겹친 수가 됩니다.",
          steps: [
            "두 조건에 해당하는 수를 먼저 더합니다.",
            "모두 적어도 한 조건에 속하므로 전체 수를 한 번 뺍니다.",
            "각 조건의 수에서 겹친 수를 빼 왼쪽만, 오른쪽만을 확인합니다."
          ]
        },
        original: {
          title: "골든벨",
          structureKey: "two-set-all-in-union",
          prompt: "친구 15명이 모두 사과나 포도 중 적어도 하나를 좋아합니다. 사과 7명, 포도 12명일 때 물음에 답하시오.",
          visual: { kind: "book7", subtype: "venn", labels: ["사과", "포도"], total: 15, leftTotal: 7, rightTotal: 12, leftOnly: 3, overlap: 4, rightOnly: 8, neither: 0 },
          items: [
            { id: "both-fruits", prompt: "(1) 사과와 포도를 모두 좋아하는 친구 수", answerMode: "input", inputMode: "numeric", answer: "4" },
            { id: "apple-only", prompt: "(2) 사과만 좋아하는 친구 수", answerMode: "input", inputMode: "numeric", answer: "3" },
            { id: "grape-only", prompt: "(3) 포도만 좋아하는 친구 수", answerMode: "input", inputMode: "numeric", answer: "8" },
            { id: "exactly-one-fruit", prompt: "(4) 두 과일 중 하나만 좋아하는 친구 수", answerMode: "input", inputMode: "numeric", answer: "11" }
          ]
        },
        extension: {
          title: "이야기",
          structureKey: "two-set-all-in-union",
          story: "친구 24명이 모두 고양이나 강아지 중 적어도 하나를 좋아합니다. 고양이를 좋아하는 친구는 14명, 강아지를 좋아하는 친구는 17명입니다.",
          prompt: "두 동물을 모두 좋아하는 친구는 몇 명일까요?",
          visual: { kind: "book7", subtype: "venn", labels: ["고양이", "강아지"], total: 24, leftTotal: 14, rightTotal: 17, leftOnly: "?", overlap: "?", rightOnly: "?", neither: 0 },
          answerMode: "input",
          inputMode: "numeric",
          answer: "7",
          explanation: "14+17=31명으로 전체 24명보다 7명을 더 세었으므로 두 동물을 모두 좋아하는 친구는 7명입니다."
        }
      }
    ]
  },
  {
    id: "book-08",
    label: "8권",
    title: "매트릭스와 복면산",
    status: "ready",
    source: {
      file: "더클래식_1과정_8N30권_골든벨_230227(E2용) (2).pptx",
      companionFile: "교사용지도서_더클래식_1과정_8N30권_매트릭스와_복면산(230802).pdf",
      verified: true,
      note: "39슬라이드 교사용 자료와 지도서를 대조하고, 문제 구조와 빨간 풀이를 분리해 독립 계산한 대표 활동만 공개"
    },
    lessons: [
      {
        id: "addition-sum-matrix",
        unit: "묶음수와 매트릭스",
        title: "가로와 세로의 합으로 도형값을 찾아요",
        sourceLocator: "교사용 PPTX 슬라이드 2, 덧셈 매트릭스 연습 (1)~(4)",
        sourceTypeIds: ["addition-matrix-complete-b8"],
        representativeConcept: "같은 도형은 같은 수임을 이용해 같은 도형만 모인 줄부터 값을 찾고 다른 줄의 합을 차례로 완성함",
        story: {
          title: "도형 암호판의 합",
          text: "가로줄과 세로줄 끝의 수는 그 줄에 있는 세 도형의 합입니다.",
          mission: "같은 도형이 여러 번 나온 줄을 먼저 찾아 도형 하나의 값을 구하세요."
        },
        explanation: {
          headline: "한 종류의 도형만 있는 줄이 가장 좋은 출발점입니다.",
          steps: [
            "같은 도형 세 개의 합을 3으로 나누어 도형 하나의 값을 찾습니다.",
            "알게 된 도형값을 다른 가로줄이나 세로줄에 바꾸어 넣습니다.",
            "마지막 빈 합을 계산한 뒤 모든 줄의 합이 맞는지 확인합니다."
          ]
        },
        original: {
          title: "골든벨",
          structureKey: "three-by-three-symbol-sum-matrix",
          prompt: "같은 도형은 같은 수를 나타냅니다. 빈칸에 알맞은 합을 쓰시오.",
          visual: {
            kind: "book8-set",
            panels: [
              { label: "(1)", visual: { subtype: "sum-matrix", cells: [["□", "□", "□"], ["□", "△", "☆"], ["△", "◎", "◎"]], rowTotals: [24, 17, 10], columnTotals: [20, 15, "?"] } },
              { label: "(2)", visual: { subtype: "sum-matrix", cells: [["□", "△", "☆"], ["□", "□", "△"], ["□", "◎", "△"]], rowTotals: [14, 15, 10], columnTotals: [18, "?", 11] } },
              { label: "(3)", visual: { subtype: "sum-matrix", cells: [["☆", "△", "△"], ["□", "□", "□"], ["□", "◎", "☆"]], rowTotals: [5, 12, 10], columnTotals: [9, 11, "?"] } },
              { label: "(4)", visual: { subtype: "sum-matrix", cells: [["△", "☆", "◎"], ["□", "△", "☆"], ["□", "□", "□"]], rowTotals: [20, 29, 36], columnTotals: [34, 29, "?"] } }
            ]
          },
          items: [
            { id: "matrix-sum-1", prompt: "(1) 빈칸의 합", answerMode: "input", inputMode: "numeric", answer: "16" },
            { id: "matrix-sum-2", prompt: "(2) 빈칸의 합", answerMode: "input", inputMode: "numeric", answer: "10" },
            { id: "matrix-sum-3", prompt: "(3) 빈칸의 합", answerMode: "input", inputMode: "numeric", answer: "7" },
            { id: "matrix-sum-4", prompt: "(4) 빈칸의 합", answerMode: "input", inputMode: "numeric", answer: "22" }
          ]
        },
        extension: {
          title: "이야기",
          structureKey: "three-by-three-symbol-sum-matrix",
          story: "박물관의 도형 암호판에서 한 세로줄의 합이 지워졌습니다.",
          prompt: "물음표 자리에 들어갈 합을 쓰세요.",
          visual: { kind: "book8", subtype: "sum-matrix", cells: [["□", "□", "△"], ["□", "○", "☆"], ["△", "○", "○"]], rowTotals: [18, 14, 8], columnTotals: [18, "?", 11] },
          answerMode: "input",
          inputMode: "numeric",
          answer: "11",
          explanation: "첫째 가로줄과 첫째 세로줄에서 네모는 7, 세모는 4입니다. 셋째 가로줄에서 동그라미는 2이므로 가운데 세로줄은 7+2+2=11입니다."
        }
      },
      {
        id: "vertical-shape-cryptarithm",
        unit: "복면산",
        title: "세로셈의 자리값으로 도형 수를 찾아요",
        sourceLocator: "교사용 PPTX 슬라이드 16, 복면산 연습 (1)~(4)",
        sourceTypeIds: ["repeated-symbol-cryptarithm-b8", "multi-symbol-cryptarithm-b8"],
        representativeConcept: "일의 자리부터 더하며 같은 도형의 값과 받아올림을 찾고 십의 자리와 백의 자리에 다시 확인함",
        story: {
          title: "도형 숫자 금고",
          text: "같은 도형에는 언제나 같은 숫자가 들어갑니다. 세로셈의 각 자리에서 합과 받아올림을 맞추면 도형의 수를 찾을 수 있습니다.",
          mission: "일의 자리부터 계산하고, 10이 넘으면 받아올림 1을 다음 자리에 표시하세요."
        },
        explanation: {
          headline: "세로셈은 일의 자리부터 한 칸씩 확인합니다.",
          steps: [
            "일의 자리의 같은 도형을 더해 끝자리 숫자를 맞춥니다.",
            "합이 10 이상이면 십의 자리에 받아올림 1을 더합니다.",
            "찾은 도형값을 전체 세로셈에 넣어 결과가 정확한지 확인합니다."
          ]
        },
        original: {
          title: "골든벨",
          structureKey: "vertical-symbol-addition-with-carry",
          prompt: "같은 모양은 같은 숫자를 나타냅니다. 물음에 답하시오.",
          visual: {
            kind: "book8-set",
            panels: [
              { label: "(1)", visual: { subtype: "vertical", top: "□4", bottom: "2□", operator: "+", result: "○○2" } },
              { label: "(2)", visual: { subtype: "vertical", top: "3□", bottom: "□5", operator: "+", result: "◇◇2" } },
              { label: "(3)", visual: { subtype: "vertical", top: "□○", bottom: "□○", operator: "+", result: "◇◇6" } },
              { label: "(4)", visual: { subtype: "vertical", top: "7◇◇", bottom: "○5◇", operator: "+", result: "□22" } }
            ]
          },
          items: [
            { id: "cryptarithm-square-1", prompt: "(1) 네모가 나타내는 수", answerMode: "input", inputMode: "numeric", answer: "8" },
            { id: "cryptarithm-square-2", prompt: "(2) 네모가 나타내는 수", answerMode: "input", inputMode: "numeric", answer: "7" },
            { id: "cryptarithm-circle-3", prompt: "(3) 동그라미가 나타내는 수", answerMode: "input", inputMode: "numeric", answer: "8" },
            { id: "cryptarithm-square-4", prompt: "(4) 네모가 나타내는 수", answerMode: "input", inputMode: "numeric", answer: "9" }
          ]
        },
        extension: {
          title: "이야기",
          structureKey: "vertical-symbol-addition-with-carry",
          story: "도형 숫자 금고의 마지막 세로셈에서 네모의 숫자를 찾아야 문이 열립니다.",
          prompt: "네모가 나타내는 수를 쓰세요.",
          visual: { kind: "book8", subtype: "vertical", top: "□8", bottom: "3□", operator: "+", result: "○○5" },
          answerMode: "input",
          inputMode: "numeric",
          answer: "7",
          explanation: "일의 자리에서 네모+8의 끝이 5이므로 네모는 7이고 1을 받아올립니다. 7+3+1=11이 되어 78+37=115가 맞습니다."
        }
      },
      {
        id: "equalize-transfer",
        unit: "합차와 배수문제",
        title: "차의 절반만큼 옮겨 같게 만들어요",
        sourceLocator: "교사용 PPTX 슬라이드 22, 주고 받기 (1)~(3)",
        sourceTypeIds: ["equalize-transfer-b8"],
        representativeConcept: "두 양의 차를 구한 뒤 많은 쪽에서 적은 쪽으로 차의 절반을 옮기면 두 양이 같아짐",
        story: {
          title: "두 접시의 구슬",
          text: "많은 접시에서 구슬 하나를 옮기면 많은 쪽은 1개 줄고 적은 쪽은 1개 늘어 차이는 2개 줄어듭니다.",
          mission: "먼저 두 수의 차를 구하고 그 차를 똑같이 둘로 나누세요."
        },
        explanation: {
          headline: "같게 만들기 위해 옮기는 수는 차의 절반입니다.",
          steps: [
            "많은 수에서 적은 수를 빼 차를 구합니다.",
            "한 번 옮길 때 차가 2씩 줄어드므로 차를 2로 나눕니다.",
            "옮긴 뒤 두 수가 실제로 같은지 더하고 빼서 확인합니다."
          ]
        },
        original: {
          title: "골든벨",
          structureKey: "equalize-by-half-difference-transfer",
          prompt: "많은 쪽에서 적은 쪽으로 몇 개를 옮기면 두 수가 같아지는지 구하시오.",
          visual: {
            kind: "book8-set",
            panels: [
              { label: "(1)", visual: { subtype: "transfer", people: [{ label: "가 접시", value: 10 }, { label: "나 접시", value: 6 }], steps: ["많은 쪽에서 ?개 옮기기"] } },
              { label: "(2)", visual: { subtype: "transfer", people: [{ label: "가 접시", value: 22 }, { label: "나 접시", value: 14 }], steps: ["많은 쪽에서 ?개 옮기기"] } },
              { label: "(3)", visual: { subtype: "transfer", people: [{ label: "가 접시", value: 35 }, { label: "나 접시", value: 17 }], steps: ["많은 쪽에서 ?개 옮기기"] } }
            ]
          },
          items: [
            { id: "equalize-10-6", prompt: "(1) 옮겨야 하는 구슬 수", answerMode: "input", inputMode: "numeric", answer: "2" },
            { id: "equalize-22-14", prompt: "(2) 옮겨야 하는 구슬 수", answerMode: "input", inputMode: "numeric", answer: "4" },
            { id: "equalize-35-17", prompt: "(3) 옮겨야 하는 구슬 수", answerMode: "input", inputMode: "numeric", answer: "9" }
          ]
        },
        extension: {
          title: "이야기",
          structureKey: "equalize-by-half-difference-transfer",
          story: "첫 번째 책꽂이에는 책이 28권, 두 번째 책꽂이에는 16권 있습니다.",
          prompt: "첫 번째 책꽂이에서 두 번째 책꽂이로 몇 권을 옮기면 같아질까요?",
          visual: { kind: "book8", subtype: "transfer", people: [{ label: "첫째 책꽂이", value: 28 }, { label: "둘째 책꽂이", value: 16 }], steps: ["첫째에서 둘째로 ?권 옮기기"] },
          answerMode: "input",
          inputMode: "numeric",
          answer: "6",
          explanation: "28-16=12이고 차의 절반은 6입니다. 28-6=22, 16+6=22로 같아집니다."
        }
      },
      {
        id: "reverse-operation-chain",
        unit: "거꾸로 생각하기",
        title: "마지막 수에서 반대 계산으로 돌아가요",
        sourceLocator: "교사용 PPTX 슬라이드 31, 거꾸로 풀기 (1)~(4)",
        sourceTypeIds: ["reverse-arithmetic-chain-b8", "reverse-multiply-divide-b8"],
        representativeConcept: "마지막 결과에서 계산 순서를 뒤집고 더하기와 빼기, 곱하기와 나누기를 서로 반대로 적용해 처음 수를 찾음",
        story: {
          title: "수 기계의 출발점",
          text: "수 기계는 차례대로 계산해 마지막 수를 만듭니다. 출발 수를 찾을 때는 마지막에서 시작해 계산을 반대 순서로 되돌립니다.",
          mission: "화살표를 오른쪽에서 왼쪽으로 읽고 각 계산의 반대 계산을 적으세요."
        },
        explanation: {
          headline: "계산의 순서도, 계산 방법도 모두 반대로 합니다.",
          steps: [
            "마지막 수에서 시작해 가장 마지막 계산부터 되돌립니다.",
            "+는 −로, −는 +로, ×는 ÷로, ÷는 ×로 바꿉니다.",
            "찾은 처음 수를 원래 계산 순서에 넣어 마지막 수가 나오는지 확인합니다."
          ]
        },
        original: {
          title: "골든벨",
          structureKey: "reverse-ordered-operation-chain",
          prompt: "물음표에서 시작해 화살표의 계산을 차례로 했습니다. 처음 수를 구하시오.",
          visual: {
            kind: "book8-set",
            panels: [
              { label: "(1)", visual: { subtype: "process", start: "?", steps: ["+6", "-2"], result: 10 } },
              { label: "(2)", visual: { subtype: "process", start: "?", steps: ["+2", "-5", "+9", "-7"], result: 17 } },
              { label: "(3)", visual: { subtype: "process", start: "?", steps: ["×5", "-4", "÷9"], result: 4 } },
              { label: "(4)", visual: { subtype: "process", start: "?", steps: ["-5", "×3", "+6", "÷9"], result: 3 } }
            ]
          },
          items: [
            { id: "reverse-chain-1", prompt: "(1) 처음 수", answerMode: "input", inputMode: "numeric", answer: "6" },
            { id: "reverse-chain-2", prompt: "(2) 처음 수", answerMode: "input", inputMode: "numeric", answer: "18" },
            { id: "reverse-chain-3", prompt: "(3) 처음 수", answerMode: "input", inputMode: "numeric", answer: "8" },
            { id: "reverse-chain-4", prompt: "(4) 처음 수", answerMode: "input", inputMode: "numeric", answer: "12" }
          ]
        },
        extension: {
          title: "이야기",
          structureKey: "reverse-ordered-operation-chain",
          story: "비밀 수 기계가 출발 수에 8을 더하고 3을 빼고 6을 더한 뒤 4를 빼서 22를 만들었습니다.",
          prompt: "수 기계의 출발 수를 쓰세요.",
          visual: { kind: "book8", subtype: "process", start: "?", steps: ["+8", "-3", "+6", "-4"], result: 22 },
          answerMode: "input",
          inputMode: "numeric",
          answer: "15",
          explanation: "22에서 거꾸로 +4, -6, +3, -8을 계산하면 15입니다. 15+8-3+6-4=22로 확인됩니다."
        }
      }
    ]
  },
  {
    id: "book-09",
    label: "9권",
    title: "도형분할과 논리",
    status: "ready",
    source: {
      file: "더클래식_1과정_9N30권_골든벨_230817 (1).pdf",
      companionFile: "교사용지도서_더클래식_1과정_9N30권_도형분할과_논리(230606) (1).pdf",
      verified: true,
      note: "11쪽 교사용 골든벨 자료와 150쪽 지도서를 대조하고, 원문 도형과 조건만으로 독립 계산되는 대표 활동만 공개"
    },
    lessons: [
      {
        id: "unit-area-and-half",
        unit: "도형의 분할과 넓이",
        title: "단위넓이와 반으로 나눈 넓이를 찾아요",
        sourceLocator: "교사용 PDF 1쪽, Q1 도형의 넓이 (1)~(2)의 네 도형",
        sourceTypeIds: ["unit-square-area-b9", "half-rectangle-triangle-area-b9"],
        representativeConcept: "한 칸의 넓이를 1로 보고 직사각형의 칸 수를 세거나, 대각선으로 반을 나눈 삼각형은 직사각형 넓이의 절반으로 계산함",
        story: {
          title: "모눈 유리 조각",
          text: "모눈 한 칸의 넓이는 1입니다. 선을 따라 둘러싸인 부분의 넓이를 칸으로 비교합니다.",
          mission: "직사각형은 가로와 세로의 칸 수를 곱하고, 정확히 반으로 나뉜 삼각형은 2로 나누세요."
        },
        explanation: {
          headline: "단위 정사각형 몇 개와 같은지 세면 넓이가 됩니다.",
          steps: [
            "가로 칸 수와 세로 칸 수를 곱해 직사각형의 넓이를 구합니다.",
            "대각선이 직사각형을 똑같이 둘로 나누면 삼각형 하나는 전체의 절반입니다.",
            "모양을 옮겨 붙여도 넓이는 달라지지 않는지 칸 수로 확인합니다."
          ]
        },
        original: {
          title: "골든벨",
          structureKey: "unit-grid-area-and-diagonal-half",
          prompt: "모눈 한 칸의 넓이가 1일 때 색칠한 도형의 넓이를 구하시오.",
          visual: {
            kind: "book9-set",
            panels: [
              { label: "(1)-가", visual: { subtype: "area-grid", gridWidth: 2, gridHeight: 1, points: [[0, 0], [2, 0], [2, 1], [0, 1]] } },
              { label: "(1)-나", visual: { subtype: "area-grid", gridWidth: 3, gridHeight: 2, points: [[0, 0], [3, 0], [3, 2], [0, 2]] } },
              { label: "(2)-가", visual: { subtype: "area-grid", gridWidth: 2, gridHeight: 1, points: [[0, 0], [2, 1], [0, 1]] } },
              { label: "(2)-나", visual: { subtype: "area-grid", gridWidth: 1, gridHeight: 2, points: [[1, 0], [1, 2], [0, 2]] } }
            ]
          },
          items: [
            { id: "area-rectangle-2", prompt: "(1)-가의 넓이", answerMode: "input", inputMode: "numeric", answer: "2" },
            { id: "area-rectangle-6", prompt: "(1)-나의 넓이", answerMode: "input", inputMode: "numeric", answer: "6" },
            { id: "area-half-horizontal", prompt: "(2)-가의 넓이", answerMode: "input", inputMode: "numeric", answer: "1" },
            { id: "area-half-vertical", prompt: "(2)-나의 넓이", answerMode: "input", inputMode: "numeric", answer: "1" }
          ]
        },
        extension: {
          title: "이야기",
          structureKey: "unit-grid-area-and-diagonal-half",
          story: "가로 4칸, 세로 3칸인 모눈 유리를 대각선으로 정확히 반으로 나누었습니다.",
          prompt: "색칠한 삼각형의 넓이를 쓰세요.",
          visual: { kind: "book9", subtype: "area-grid", gridWidth: 4, gridHeight: 3, points: [[0, 0], [4, 0], [0, 3]] },
          answerMode: "input",
          inputMode: "numeric",
          answer: "6",
          explanation: "직사각형의 넓이는 4×3=12이고 대각선으로 똑같이 나뉘므로 삼각형의 넓이는 12÷2=6입니다."
        }
      },
      {
        id: "cube-map-total",
        unit: "쌓기나무의 개수",
        title: "위에서 본 층수를 더해 전체 개수를 찾아요",
        sourceLocator: "교사용 PDF 3쪽, 쌓기나무 입체와 위에서 본 층수 첫째 줄 세 모양",
        sourceTypeIds: ["cube-top-height-total-b9", "hidden-cube-count-b9"],
        representativeConcept: "위에서 본 각 자리에 쌓인 층수를 적고 모든 자리의 층수를 더하면 보이는 것과 보이지 않는 쌓기나무를 모두 셀 수 있음",
        story: {
          title: "계단 블록 창고",
          text: "위에서 보이는 한 칸에는 쌓기나무가 한 개만 있는 것이 아니라 여러 층이 쌓여 있을 수 있습니다.",
          mission: "각 자리에 몇 층이 쌓였는지 확인한 뒤 모든 층수를 더하세요."
        },
        explanation: {
          headline: "입체를 위에서 본 자리별 높이표로 바꾸면 숨은 블록도 셀 수 있습니다.",
          steps: [
            "위에서 보이는 바닥 자리를 하나씩 찾습니다.",
            "각 자리에 쌓인 쌓기나무의 높이를 적습니다.",
            "높이표의 모든 수를 더해 전체 개수를 구합니다."
          ]
        },
        original: {
          title: "골든벨",
          structureKey: "isometric-cube-to-top-height-total",
          prompt: "각 쌓기나무 모양의 전체 개수를 구하시오.",
          visual: {
            kind: "book9-set",
            panels: [
              { label: "(1)", visual: { subtype: "cube-solid-views", map: [[2, 2], [2, 2]] } },
              { label: "(2)", visual: { subtype: "cube-solid-views", map: [[1, 4, 3, 1], [0, 0, 1, 0]] } },
              { label: "(3)", visual: { subtype: "cube-solid-views", map: [[4, 3, 1], [3, 2, 0], [1, 0, 0]] } }
            ]
          },
          items: [
            { id: "cube-total-8", prompt: "(1) 전체 쌓기나무 수", answerMode: "input", inputMode: "numeric", answer: "8" },
            { id: "cube-total-10", prompt: "(2) 전체 쌓기나무 수", answerMode: "input", inputMode: "numeric", answer: "10" },
            { id: "cube-total-14", prompt: "(3) 전체 쌓기나무 수", answerMode: "input", inputMode: "numeric", answer: "14" }
          ]
        },
        extension: {
          title: "이야기",
          structureKey: "isometric-cube-to-top-height-total",
          story: "창고에 네 자리의 블록 기둥이 있고 높이는 차례로 3층, 2층, 1층, 1층입니다.",
          prompt: "쌓기나무는 모두 몇 개인지 쓰세요.",
          visual: { kind: "book9", subtype: "cube-solid-views", map: [[3, 2], [1, 1]] },
          answerMode: "input",
          inputMode: "numeric",
          answer: "7",
          explanation: "네 자리의 높이를 모두 더하면 3+2+1+1=7개입니다."
        }
      },
      {
        id: "magic-square-missing",
        unit: "마방진",
        title: "가로·세로·대각선의 같은 합으로 빈칸을 찾아요",
        sourceLocator: "교사용 PDF 7쪽, Q1 마방진의 성질 첫째·둘째 표",
        sourceTypeIds: ["magic-square-single-blank-b9"],
        representativeConcept: "마방진의 모든 가로줄과 세로줄과 대각선의 합이 같다는 성질을 이용해 빈칸이 포함된 한 줄을 계산함",
        story: {
          title: "숫자 유리창",
          text: "숫자 유리창은 어느 방향으로 세 수를 더해도 같은 합이 됩니다.",
          mission: "빈칸이 있는 가로줄이나 세로줄에서 이미 아는 두 수를 먼저 더하세요."
        },
        explanation: {
          headline: "한 줄의 합에서 보이는 두 수를 빼면 빈칸의 수가 됩니다.",
          steps: [
            "완성된 가로줄이나 세로줄을 더해 한 줄의 합을 확인합니다.",
            "빈칸이 있는 줄에서 이미 적힌 수들을 더합니다.",
            "한 줄의 합에서 그 수를 빼고 다른 방향의 합도 맞는지 확인합니다."
          ]
        },
        original: {
          title: "골든벨",
          structureKey: "three-by-three-magic-square-single-blank",
          prompt: "가로, 세로, 대각선의 합이 모두 같을 때 빈칸에 알맞은 수를 쓰시오.",
          visual: {
            kind: "book9-set",
            panels: [
              { label: "(1)", visual: { subtype: "magic-grid", size: 3, shown: [9, 2, 7, 4, 6, 8, 5, "□", 3], lineSum: 18 } },
              { label: "(2)", visual: { subtype: "magic-grid", size: 3, shown: [10, 3, 8, 5, 7, "□", 6, 11, 4], lineSum: 21 } }
            ]
          },
          items: [
            { id: "magic-blank-10", prompt: "(1) 빈칸의 수", answerMode: "input", inputMode: "numeric", answer: "10" },
            { id: "magic-blank-9", prompt: "(2) 빈칸의 수", answerMode: "input", inputMode: "numeric", answer: "9" }
          ]
        },
        extension: {
          title: "이야기",
          structureKey: "three-by-three-magic-square-single-blank",
          story: "박물관의 3×3 숫자 유리창 한 칸이 지워졌습니다. 어느 줄의 합도 15입니다.",
          prompt: "빈칸에 들어갈 수를 쓰세요.",
          visual: { kind: "book9", subtype: "magic-grid", size: 3, shown: [8, 1, 6, 3, 5, 7, 4, "□", 2], lineSum: 15 },
          answerMode: "input",
          inputMode: "numeric",
          answer: "9",
          explanation: "아래 가로줄의 합이 15이므로 4+□+2=15입니다. 빈칸은 15-6=9입니다."
        }
      },
      {
        id: "consecutive-sum-pairing",
        unit: "연속수의 합",
        title: "처음 수와 끝 수를 짝지어 더해요",
        sourceLocator: "교사용 PDF 11쪽, Q1 연속수의 합 여섯 식 중 앞 네 식",
        sourceTypeIds: ["consecutive-sum-pairing-b9"],
        representativeConcept: "처음 수와 끝 수의 합이 같은 짝을 만들고 그 짝의 합에 짝의 개수를 곱해 연속수의 합을 구함",
        story: {
          title: "계단 번호의 합",
          text: "첫 계단과 마지막 계단, 둘째 계단과 끝에서 둘째 계단을 짝지으면 같은 합이 반복됩니다.",
          mission: "처음 수와 끝 수의 합, 수의 개수, 짝의 개수를 차례로 찾으세요."
        },
        explanation: {
          headline: "양끝을 짝지으면 같은 합이 반복됩니다.",
          steps: [
            "처음 수와 끝 수를 더해 한 짝의 합을 구합니다.",
            "연속수의 개수를 세고 2로 나누어 짝의 개수를 구합니다.",
            "한 짝의 합과 짝의 개수를 곱합니다."
          ]
        },
        original: {
          title: "골든벨",
          structureKey: "consecutive-sum-by-end-pairing",
          prompt: "연속수의 합을 구하시오.",
          visual: {
            kind: "book9-set",
            panels: [
              { label: "(1)", visual: { subtype: "consecutive-sum", from: 1, to: 6 } },
              { label: "(2)", visual: { subtype: "consecutive-sum", from: 1, to: 10 } },
              { label: "(3)", visual: { subtype: "consecutive-sum", from: 1, to: 14 } },
              { label: "(4)", visual: { subtype: "consecutive-sum", from: 1, to: 20 } }
            ]
          },
          items: [
            { id: "sum-1-to-6", prompt: "(1) 1부터 6까지의 합", answerMode: "input", inputMode: "numeric", answer: "21" },
            { id: "sum-1-to-10", prompt: "(2) 1부터 10까지의 합", answerMode: "input", inputMode: "numeric", answer: "55" },
            { id: "sum-1-to-14", prompt: "(3) 1부터 14까지의 합", answerMode: "input", inputMode: "numeric", answer: "105" },
            { id: "sum-1-to-20", prompt: "(4) 1부터 20까지의 합", answerMode: "input", inputMode: "numeric", answer: "210" }
          ]
        },
        extension: {
          title: "이야기",
          structureKey: "consecutive-sum-by-end-pairing",
          story: "전시관 계단에 1번부터 18번까지 번호가 붙어 있습니다.",
          prompt: "모든 계단 번호의 합을 쓰세요.",
          visual: { kind: "book9", subtype: "consecutive-sum", from: 1, to: 18 },
          answerMode: "input",
          inputMode: "numeric",
          answer: "171",
          explanation: "1+18=19인 짝이 9개이므로 19×9=171입니다."
        }
      }
    ]
  },
  {
    id: "book-10",
    label: "10권",
    title: "연속수와 따라잡기",
    status: "ready",
    source: {
      file: "수업용_더클래식_1과정_10N30권_연속수와_따라잡기(240216)-잠금 해제됨.pdf",
      verified: true,
      origin: "textbook-derived",
      note: "별도 골든벨 원본 없음 · 10권 교재의 검증된 대표 개념으로 구성한 교재 기반 골든벨 학습"
    },
    lessons: [
      {
        id: "consecutive-page-range",
        unit: "연속수의 합",
        title: "연속된 쪽수의 가운데를 찾아요",
        sourceLocator: "수업용 교재 42쪽, 연습 14번",
        sourceTypeIds: ["consecutive-page-range-b10"],
        representativeConcept: "연속된 수의 개수와 합을 이용해 가운데 수를 찾고 처음 수와 끝 수를 구함",
        story: {
          title: "책갈피 탐정",
          text: "연속된 쪽수는 가운데를 기준으로 같은 간격만큼 작아지고 커집니다.",
          mission: "쪽수의 합을 개수로 나눈 가운데 값에서 양쪽으로 차례로 펼쳐 보세요."
        },
        explanation: {
          headline: "합을 개수로 나누면 연속된 쪽수의 가운데를 찾을 수 있습니다.",
          steps: [
            "연속된 다섯 수의 합이 110이면 110÷5=22가 가운데 수입니다.",
            "가운데 수에서 양쪽으로 한 칸씩 벌리면 20, 21, 22, 23, 24가 됩니다.",
            "마지막에는 만든 수들을 다시 더해 처음 주어진 합과 맞는지 확인합니다."
          ]
        },
        original: {
          title: "교재 확인",
          structureKey: "consecutive-page-range-from-count-and-total",
          prompt: "연속된 6쪽의 쪽수 합이 75일 때 처음 쪽수와 마지막 쪽수를 쓰세요.",
          visual: { kind: "book10", subtype: "page-strip", count: 6, total: 75 },
          items: [
            { id: "page-range-first", prompt: "처음 쪽수", answerMode: "input", inputMode: "numeric", answer: "10" },
            { id: "page-range-last", prompt: "마지막 쪽수", answerMode: "input", inputMode: "numeric", answer: "15" }
          ]
        },
        extension: {
          title: "이야기",
          structureKey: "consecutive-page-range-from-count-and-total",
          story: "박물관에서 연속된 5개의 보관함 번호를 확인했더니 번호의 합이 85였습니다.",
          prompt: "가장 처음 보관함 번호를 쓰세요.",
          visual: { kind: "book10", subtype: "page-strip", count: 5, total: 85 },
          answerMode: "input",
          inputMode: "numeric",
          answer: "15",
          explanation: "85÷5=17이 가운데 번호입니다. 15, 16, 17, 18, 19이므로 처음 번호는 15입니다."
        }
      },
      {
        id: "catch-up-acorns",
        unit: "따라잡기",
        title: "처음 차이와 하루 차이로 만나는 날을 찾아요",
        sourceLocator: "수업용 교재 61쪽, 확인 2번",
        sourceTypeIds: ["catch-up-growing-amount-b10"],
        representativeConcept: "처음 양의 차이가 하루마다 얼마나 줄어드는지 계산해 두 양이 같아지는 때를 구함",
        story: {
          title: "도토리 모으기",
          text: "뒤에 있는 쪽이 하루마다 더 많이 모으면 처음 차이가 조금씩 줄어듭니다.",
          mission: "처음 차이를 구한 뒤 하루에 줄어드는 차이로 나누세요."
        },
        explanation: {
          headline: "처음 차이 ÷ 하루에 줄어드는 차이로 따라잡는 날을 구합니다.",
          steps: [
            "새 예시에서 처음에는 24-12=12장 차이입니다.",
            "하루에 6-2=4장씩 차이가 줄어듭니다.",
            "12÷4=3이므로 3일 뒤에 두 양이 같아집니다."
          ]
        },
        original: {
          title: "교재 확인",
          structureKey: "catch-up-from-start-gap-and-daily-gap",
          prompt: "두 다람쥐가 같은 수의 도토리를 가지게 되는 것은 며칠 뒤인지 쓰세요.",
          visual: { kind: "book10", subtype: "catch-up-table", labels: ["엄마 다람쥐", "아빠 다람쥐"], starts: [30, 50], changes: [7, 3], unit: "개/일" },
          items: [
            { id: "catch-up-days", prompt: "같아지는 날", answerMode: "input", inputMode: "numeric", answer: "5" }
          ]
        },
        extension: {
          title: "이야기",
          structureKey: "catch-up-from-start-gap-and-daily-gap",
          story: "아라는 스티커 18장으로 시작해 하루에 6장씩, 보라는 38장으로 시작해 하루에 2장씩 모읍니다.",
          prompt: "두 사람의 스티커 수가 같아지는 것은 며칠 뒤인지 쓰세요.",
          visual: { kind: "book10", subtype: "catch-up-table", labels: ["아라", "보라"], starts: [18, 38], changes: [6, 2], unit: "장/일" },
          answerMode: "input",
          inputMode: "numeric",
          answer: "5",
          explanation: "처음 차이는 20장이고 하루에 4장씩 줄어듭니다. 20÷4=5이므로 5일 뒤에 같습니다."
        }
      },
      {
        id: "digit-card-four-place",
        unit: "조건에 맞는 수",
        title: "자리마다 남은 숫자 카드 수를 세어요",
        sourceLocator: "수업용 교재 79쪽, 활동 1번",
        sourceTypeIds: ["digit-card-number-enumeration"],
        representativeConcept: "서로 다른 숫자 카드를 한 번씩 놓을 때 각 자리에 놓을 수 있는 카드 수를 차례로 곱해 경우의 수를 구함",
        story: {
          title: "네 자리 암호 카드",
          text: "서로 다른 카드 여섯 장을 한 줄에 배열하면 한 자리에 카드를 놓을 때마다 남은 카드가 한 장씩 줄어듭니다.",
          mission: "첫 자리를 정한 경우와 정하지 않은 경우의 선택 수를 따로 세어 보세요."
        },
        explanation: {
          headline: "첫 자리를 정한 뒤 남은 카드 수를 차례로 곱합니다.",
          steps: [
            "첫 자리를 고정하면 남은 자리에는 5장, 4장, 3장, 2장, 1장을 차례로 고릅니다.",
            "5×4×3×2×1=120이므로 첫 자리를 고정한 배열은 120가지입니다.",
            "첫 자리까지 고르면 전체는 6×5×4×3×2×1=720가지입니다."
          ]
        },
        original: {
          title: "교재 확인",
          structureKey: "four-distinct-digit-cards-used-once",
          prompt: "1, 3, 5, 7을 한 번씩 사용해 네 자리 수를 만듭니다.",
          visual: { kind: "book10", subtype: "digit-slots", digits: [1, 3, 5, 7], length: 4 },
          items: [
            { id: "fixed-first-digit-count", prompt: "천의 자리 숫자가 1인 수의 개수", answerMode: "input", inputMode: "numeric", answer: "6" },
            { id: "all-four-digit-count", prompt: "만들 수 있는 네 자리 수의 개수", answerMode: "input", inputMode: "numeric", answer: "24" }
          ]
        },
        extension: {
          title: "이야기",
          structureKey: "four-distinct-digit-cards-used-once",
          story: "전시관 암호판에서 2, 4, 6, 8 카드를 한 번씩 사용해 네 자리 암호를 만듭니다.",
          prompt: "천의 자리 숫자가 2인 암호는 모두 몇 개인지 쓰세요.",
          visual: { kind: "book10", subtype: "digit-slots", digits: [2, 4, 6, 8], length: 4 },
          answerMode: "input",
          inputMode: "numeric",
          answer: "6",
          explanation: "첫 자리에 2를 놓으면 남은 세 자리는 3×2×1가지이므로 6개입니다."
        }
      },
      {
        id: "number-baseball-secret",
        unit: "숫자 야구게임",
        title: "스트라이크와 볼로 비밀 수를 찾아요",
        sourceLocator: "수업용 교재 109쪽, 활동 1번",
        sourceTypeIds: ["number-baseball-b10"],
        representativeConcept: "숫자와 자리가 모두 맞는 스트라이크와 숫자만 맞는 볼 조건을 함께 적용해 서로 다른 세 자리 비밀 수를 찾음",
        story: {
          title: "비밀 금고 번호",
          text: "S는 숫자와 자리가 모두 맞고, B는 숫자는 있지만 자리가 다르다는 뜻입니다.",
          mission: "0B인 줄에서 없는 숫자를 먼저 지우고, 두 줄을 비교해 새로 맞은 자리를 찾으세요."
        },
        explanation: {
          headline: "기호 단서를 표로 옮겨 숫자와 자리의 조건을 차례로 좁힙니다.",
          steps: [
            "기호 A, B, C를 세 자리 후보라고 정하고, 숫자가 없는 줄의 기호를 먼저 제외합니다.",
            "같은 숫자가 들어 있는지와 자리가 같은지를 표에 따로 표시합니다.",
            "남은 후보를 각 단서와 대조해 모든 조건을 만족하는지만 확인합니다."
          ]
        },
        original: {
          title: "교재 확인",
          structureKey: "three-distinct-digit-number-baseball",
          prompt: "1부터 9까지 서로 다른 숫자로 만든 세 자리 비밀 수를 쓰세요.",
          visual: { kind: "book10", subtype: "number-baseball", clues: [
            { guess: [2, 3, 6], strikes: 1, balls: 1 },
            { guess: [8, 3, 2], strikes: 1, balls: 0 },
            { guess: [8, 3, 4], strikes: 2, balls: 0 }
          ] },
          items: [
            { id: "baseball-secret", prompt: "비밀 수", answerMode: "input", inputMode: "numeric", answer: "634" }
          ]
        },
        extension: {
          title: "이야기",
          structureKey: "three-distinct-digit-number-baseball",
          story: "보물 상자의 비밀번호는 1부터 9까지 서로 다른 숫자로 만든 세 자리 수입니다.",
          prompt: "세 번의 단서를 모두 만족하는 비밀번호를 쓰세요.",
          visual: { kind: "book10", subtype: "number-baseball", clues: [
            { guess: [5, 2, 7], strikes: 1, balls: 2 },
            { guess: [5, 8, 2], strikes: 2, balls: 0 },
            { guess: [1, 7, 2], strikes: 2, balls: 0 }
          ] },
          answerMode: "input",
          inputMode: "numeric",
          answer: "572",
          explanation: "582에서 5와 2가 제자리이고 8은 없습니다. 172에서는 7과 2가 제자리이고 1은 없으므로 비밀번호는 572입니다."
        }
      }
    ]
  }
]);

export const goldenBellBookById = (id) => GOLDEN_BELL_BOOKS.find((book) => book.id === id) || GOLDEN_BELL_BOOKS[0];
