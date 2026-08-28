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
  ...[
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
