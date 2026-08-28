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
          visual: { kind: "book04-hidden-cubes-original" },
          items: [
            { id: "hidden-1", prompt: "(1) 전체 4개 중 그림에 보이는 것은 3개입니다.", answerMode: "input", inputMode: "numeric", answer: "1" },
            { id: "hidden-2", prompt: "(2) 전체 9개 중 그림에 보이는 것은 7개입니다.", answerMode: "input", inputMode: "numeric", answer: "2" },
            { id: "hidden-3", prompt: "(3) 전체 10개 중 그림에 보이는 것은 6개입니다.", answerMode: "input", inputMode: "numeric", answer: "4" }
          ]
        },
        extension: {
          title: "이야기",
          structureKey: "visible-cubes-subtract-from-total",
          story: "블록 창고에는 2×2×2 크기의 정육면체를 만들 블록 8개가 쌓여 있습니다.",
          prompt: "밖에서 보이는 블록이 5개라면 보이지 않는 블록은 몇 개일까요?",
          visual: { kind: "book04-hidden-cubes-story" },
          answerMode: "input",
          inputMode: "numeric",
          answer: "3",
          explanation: "전체 8개에서 보이는 5개를 빼면 보이지 않는 블록은 3개입니다."
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
          headline: "층마다 1, 3, 6, 10처럼 삼각수만큼 놓입니다.",
          steps: [
            "맨 위층부터 각 층에 놓인 쌓기나무 수를 셉니다.",
            "다음 층은 앞 층보다 한 줄 더 긴 삼각형입니다.",
            "목표 층까지 각 층의 개수를 모두 더합니다."
          ]
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
  ...[
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
