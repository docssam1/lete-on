const inputItem = ({ id, sourceNo, printGroup, typeLabel, prompt, answer, solution, visual, parts, options, inputMode = "numeric", sourceLocator, sourceDiscrepancy }) => ({
  id,
  sourceNo,
  printGroup,
  typeLabel,
  sourceLocator,
  prompt,
  ...(visual ? { visual } : {}),
  ...(parts ? { parts } : options ? { options, answer } : { answerMode: "input", inputMode, answer }),
  ...(sourceDiscrepancy ? { sourceDiscrepancy } : {}),
  solution
});

const numericPart = (id, label, answer, unit = "") => ({ id, label, answer: String(answer), ...(unit ? { unit } : {}) });
const textPart = (id, label, answer) => ({ id, label, answer, inputMode: "text" });
const aliases = (...values) => values;

const mirrorLesson = {
  id: "mirror-reflection",
  unit: "도형 움직이기",
  title: "거울에 비친 모양을 찾아요",
  sourceLocator: "교사용 슬라이드 3, 활동 02",
  sourceTypeIds: ["shape-mirror-direction"],
  representativeConcept: "거울에 가까운 부분은 그대로 가까이 두고, 좌우 거울은 좌우만, 위아래 거울은 위아래만 바꿈",
  experience: {
    kind: "guided-concept",
    family: "mirror-direction",
    title: "거울 쪽으로 모양을 접어 보듯 살펴요",
    hint: "거울과 맞닿은 쪽부터 비교하세요. 오른쪽 거울과 왼쪽 거울의 결과는 같고, 위쪽과 아래쪽 거울의 결과도 같습니다.",
    model: { source: "top-left" },
    beats: [
      { phase: "source", caption: "세로선 위쪽이 왼쪽으로 뻗은 처음 모양을 봅니다." },
      { phase: "side", caption: "옆 거울에서는 왼쪽과 오른쪽만 바뀝니다." },
      { phase: "vertical", caption: "위아래 거울에서는 위쪽과 아래쪽만 바뀝니다." },
      { phase: "compare", caption: "거울에 가까운 부분끼리 맞대어 네 방향을 확인합니다." }
    ],
    check: {
      prompt: "세로선의 위쪽이 왼쪽으로 뻗은 모양을 오른쪽 거울에 비추면 선은 어디로 뻗을까요?",
      options: ["위쪽 오른편", "아래쪽 왼편", "아래쪽 오른편"],
      answer: "위쪽 오른편",
      explanation: "오른쪽 거울에서는 좌우만 바뀌므로 위쪽 선이 오른쪽으로 뻗습니다."
    }
  },
  story: {
    title: "네 방향 거울 방",
    text: "가운데 모양을 둘러싼 네 거울에는 서로 다른 모습이 보입니다. 거울 가까이에 있던 선이 어디로 옮겨지는지 따라가 봅니다.",
    mission: "좌우 변화와 위아래 변화를 구별해 같은 결과끼리 짝지어 보세요."
  },
  explanation: {
    headline: "거울의 방향에 따라 바뀌는 자리만 찾습니다.",
    steps: [
      "처음 모양에서 비스듬한 선이 세로선의 위인지 아래인지 봅니다.",
      "오른쪽·왼쪽 거울은 좌우만 바꾸고 높이는 그대로 둡니다.",
      "위쪽·아래쪽 거울은 높이만 바꾸고 좌우는 그대로 둡니다."
    ]
  },
  original: {
    title: "골든벨",
    mode: "paged",
    sourceQuestionCount: 4,
    structureKey: "four-direction-mirror-choice",
    prompt: "가운데 모양을 네 방향 거울에 비추었을 때의 모양을 고르세요.",
    items: [
      inputItem({ id: "mirror-right", sourceNo: "3-(1)", printGroup: 1, typeLabel: "오른쪽 거울", sourceLocator: "교사용 슬라이드 3 (1)", prompt: "오른쪽 거울에 비친 모양은 몇 번입니까?", visual: { kind: "book1", subtype: "mirror-compass", target: "right" }, options: ["1번", "2번", "3번", "4번"], answer: "2번", solution: "옆 거울은 좌우만 바꿉니다. 위쪽 왼편으로 뻗은 선이 위쪽 오른편으로 옮겨진 2번입니다." }),
      inputItem({ id: "mirror-left", sourceNo: "3-(2)", printGroup: 1, typeLabel: "왼쪽 거울", sourceLocator: "교사용 슬라이드 3 (2)", prompt: "왼쪽 거울에 비친 모양은 몇 번입니까?", visual: { kind: "book1", subtype: "mirror-compass", target: "left" }, options: ["1번", "2번", "3번", "4번"], answer: "2번", solution: "왼쪽 거울도 좌우만 바꾸므로 오른쪽 거울과 같은 2번입니다." }),
      inputItem({ id: "mirror-top", sourceNo: "3-(3)", printGroup: 2, typeLabel: "위쪽 거울", sourceLocator: "교사용 슬라이드 3 (3)", prompt: "위쪽 거울에 비친 모양은 몇 번입니까?", visual: { kind: "book1", subtype: "mirror-compass", target: "top" }, options: ["1번", "2번", "3번", "4번"], answer: "3번", solution: "위쪽 거울은 위아래만 바꿉니다. 왼쪽으로 뻗은 선이 세로선의 아래쪽으로 옮겨진 3번입니다." }),
      inputItem({ id: "mirror-bottom", sourceNo: "3-(4)", printGroup: 2, typeLabel: "아래쪽 거울", sourceLocator: "교사용 슬라이드 3 (4)", prompt: "아래쪽 거울에 비친 모양은 몇 번입니까?", visual: { kind: "book1", subtype: "mirror-compass", target: "bottom" }, options: ["1번", "2번", "3번", "4번"], answer: "3번", solution: "아래쪽 거울도 위아래만 바꾸므로 위쪽 거울과 같은 3번입니다." })
    ]
  },
  extension: {
    title: "추가 학습",
    structureKey: "four-direction-mirror-choice",
    story: "세로선 아래쪽이 오른쪽으로 뻗은 새 모양을 옆 거울에 비춥니다.",
    prompt: "오른쪽 거울에서는 비스듬한 선이 어느 쪽으로 뻗을까요?",
    visual: { kind: "book1", subtype: "mirror-compass", target: "right", source: "bottom-right" },
    options: ["아래쪽 왼편", "아래쪽 오른편", "위쪽 왼편"],
    answer: "아래쪽 왼편",
    explanation: "옆 거울은 높이는 그대로 두고 좌우만 바꾸므로 아래쪽 오른편이 아래쪽 왼편으로 옮겨집니다."
  }
};

const digitalItem = (id, sourceNo, printGroup, prompt, digits, operation, answer, solution) => inputItem({
  id,
  sourceNo,
  printGroup,
  typeLabel: operation === "mirror-left-right" ? "오른쪽으로 뒤집기" : "반 바퀴 돌리기",
  sourceLocator: `교사용 슬라이드 ${sourceNo.split("-")[0]}`,
  prompt,
  visual: { kind: "book1", subtype: "digital-transform", digits, operation },
  answer,
  inputMode: "text",
  solution
});

const arithmeticItem = (id, sourceNo, printGroup, typeLabel, expressions) => inputItem({
  id,
  sourceNo,
  printGroup,
  typeLabel,
  sourceLocator: `교사용 슬라이드 ${sourceNo.split("-")[0]}`,
  prompt: `${typeLabel}을 계산하세요.`,
  visual: { kind: "book1", subtype: "arithmetic-list", expressions: expressions.map(({ expression }) => expression) },
  parts: expressions.map(({ id: partId, label, answer }) => numericPart(partId, label, answer)),
  solution: expressions.map(({ expression, answer }) => `${expression}=${answer}`).join(" · ")
});

const digitalLesson = {
  id: "digital-turn-flip",
  unit: "도형 움직이기",
  title: "디지털 숫자를 뒤집고 돌려요",
  sourceLocator: "교사용 슬라이드 4~8, 활동 03~04·진도 골든벨·연산",
  sourceTypeIds: ["digital-digit-transform", "digital-two-digit-transform", "digital-flip-addition-horizontal", "digital-transform-addition"],
  representativeConcept: "디지털 숫자의 선분 위치를 실제로 옮겨 뒤집힌 수를 먼저 읽고, 원래 수와 바뀐 수를 자리에 맞춰 계산함",
  experience: {
    kind: "guided-concept",
    family: "digital-transform",
    title: "선분을 함께 움직여 새 숫자를 읽어요",
    hint: "숫자를 글자로 외우지 말고 켜진 선 전체를 움직이세요. 옆으로 뒤집기와 반 바퀴 돌리기는 결과가 다를 수 있습니다.",
    model: { source: 2, flipped: 5, halfTurned: 2 },
    beats: [
      { phase: "source", caption: "숫자 2를 이루는 다섯 선분의 자리를 봅니다." },
      { phase: "flip", caption: "오른쪽으로 뒤집으면 왼쪽과 오른쪽 선분이 바뀌어 5가 됩니다." },
      { phase: "half", caption: "반 바퀴 돌리면 위아래와 좌우가 함께 바뀌어 다시 2가 됩니다." },
      { phase: "equation", caption: "두 자리 수는 자리 순서도 함께 바뀐 뒤 원래 수와 계산합니다." }
    ],
    check: { prompt: "디지털 숫자 5를 오른쪽으로 뒤집으면 어떤 수가 될까요?", options: ["숫자 2", "숫자 5", "숫자 6"], answer: "숫자 2", explanation: "옆으로 뒤집으면 2와 5가 서로 바뀝니다." }
  },
  story: {
    title: "뒤집히는 전광판",
    text: "전광판을 거울처럼 뒤집거나 반 바퀴 돌리면 켜진 선의 자리가 함께 움직입니다. 두 자리 수는 숫자의 모양뿐 아니라 자리 순서도 바뀝니다.",
    mission: "움직인 뒤 똑바로 읽히는 숫자인지 확인하고, 계산은 새 수를 모두 적은 뒤 시작하세요."
  },
  explanation: {
    headline: "한 자리의 모양과 두 자리의 순서를 차례로 확인합니다.",
    steps: [
      "켜진 선분을 하나씩 반대편 자리로 옮겨 새 숫자를 읽습니다.",
      "두 자리 수는 판 전체가 움직이므로 왼쪽과 오른쪽 자리 순서도 바뀝니다.",
      "바뀐 수를 적고 원래 수와 덧셈·뺄셈을 세로로 맞추어 계산합니다."
    ]
  },
  original: {
    title: "골든벨과 기초 연산",
    mode: "paged",
    sourceQuestionCount: 34,
    structureKey: "digital-display-transform-and-arithmetic",
    prompt: "디지털 숫자를 실제로 움직여 읽고, 이어지는 연산을 계산하세요.",
    items: [
      digitalItem("flip-0", "4-(1)", 1, "디지털 숫자 0을 오른쪽으로 뒤집으면 어떤 수가 됩니까?", [0], "mirror-left-right", "0", "0은 좌우가 대칭이므로 오른쪽으로 뒤집어도 0입니다."),
      digitalItem("flip-2", "4-(2)", 1, "디지털 숫자 2를 오른쪽으로 뒤집으면 어떤 수가 됩니까?", [2], "mirror-left-right", "5", "2의 왼쪽·오른쪽 선분을 바꾸면 5가 됩니다."),
      digitalItem("flip-5", "4-(3)", 1, "디지털 숫자 5를 오른쪽으로 뒤집으면 어떤 수가 됩니까?", [5], "mirror-left-right", "2", "5의 왼쪽·오른쪽 선분을 바꾸면 2가 됩니다."),
      digitalItem("half-0", "4-(4-1)", 2, "디지털 숫자 0을 반 바퀴 돌리면 어떤 수가 됩니까?", [0], "rotate-half", "0", "0은 위아래와 좌우가 모두 대칭이므로 반 바퀴 돌려도 그대로 0입니다."),
      digitalItem("half-2", "4-(4-2)", 2, "디지털 숫자 2를 반 바퀴 돌리면 어떤 수가 됩니까?", [2], "rotate-half", "2", "2의 선분을 반 바퀴 돌리면 다시 2의 모양입니다."),
      digitalItem("half-5", "4-(4-3)", 2, "디지털 숫자 5를 반 바퀴 돌리면 어떤 수가 됩니까?", [5], "rotate-half", "5", "5의 선분을 반 바퀴 돌리면 다시 5의 모양입니다."),
      digitalItem("half-6", "4-(4-4)", 2, "디지털 숫자 6을 반 바퀴 돌리면 어떤 수가 됩니까?", [6], "rotate-half", "9", "6을 이루는 선분 전체를 반 바퀴 돌리면 위아래가 바뀌어 9가 됩니다."),
      digitalItem("half-9", "4-(4-5)", 2, "디지털 숫자 9를 반 바퀴 돌리면 어떤 수가 됩니까?", [9], "rotate-half", "6", "9를 이루는 선분 전체를 반 바퀴 돌리면 위아래가 바뀌어 6이 됩니다."),
      arithmeticItem("arithmetic-5-basic", "5-연산", 3, "한 자리 덧셈과 빈칸", [
        { id: "a", label: "7+5", expression: "7 + 5", answer: 12 }, { id: "b", label: "6+9", expression: "6 + 9", answer: 15 },
        { id: "c", label: "5+□=13", expression: "5 + □ = 13", answer: 8 }, { id: "d", label: "9+□=16", expression: "9 + □ = 16", answer: 7 }
      ]),
      arithmeticItem("arithmetic-5-two-digit", "5-연산", 4, "두 자리 덧셈", [
        { id: "a", label: "12+51", expression: "12 + 51", answer: 63 }, { id: "b", label: "23+55", expression: "23 + 55", answer: 78 },
        { id: "c", label: "25+25", expression: "25 + 25", answer: 50 }, { id: "d", label: "33+28", expression: "33 + 28", answer: 61 }
      ]),
      inputItem({ id: "flip-self-digits", sourceNo: "6-(1)", printGroup: 5, typeLabel: "뒤집어도 같은 숫자", sourceLocator: "교사용 슬라이드 6 (1)", prompt: "0부터 9까지의 디지털 숫자를 오른쪽으로 뒤집었을 때 자기 자신이 되는 숫자를 모두 쓰세요.", visual: { kind: "book1", subtype: "digital-rule-board", digits: [0,1,2,3,4,5,6,7,8,9], operation: "mirror-left-right" }, answer: aliases("0,1,8", "0 1 8", "0·1·8"), inputMode: "text", solution: "각 숫자의 좌우 선분을 바꾸어도 같은 모양인 것은 0, 1, 8입니다." }),
      inputItem({ id: "flip-pair-digits", sourceNo: "6-(2)", printGroup: 5, typeLabel: "뒤집으면 서로 바뀌는 숫자", sourceLocator: "교사용 슬라이드 6 (2)", prompt: "오른쪽으로 뒤집었을 때 서로 상대방이 되는 숫자를 모두 쓰세요.", visual: { kind: "book1", subtype: "digital-rule-board", digits: [0,1,2,3,4,5,6,7,8,9], operation: "mirror-left-right" }, answer: aliases("2,5", "5,2", "2와5", "2 5"), inputMode: "text", solution: "2를 뒤집으면 5, 5를 뒤집으면 2가 되므로 2와 5입니다." }),
      inputItem({ id: "flip-two-digit", sourceNo: "6-(3)", printGroup: 6, typeLabel: "두 자리 수 뒤집기", sourceLocator: "교사용 슬라이드 6 (3)", prompt: "두 자리 수를 오른쪽으로 뒤집어 읽은 수를 각각 쓰세요.", visual: { kind: "book1", subtype: "digital-rule-board", digits: [18,12,51,25], operation: "mirror-left-right", grouped: true }, parts: [numericPart("a", "18", 81), numericPart("b", "12", 51), numericPart("c", "51", 12), numericPart("d", "25", 25)], solution: "판 전체를 옆으로 뒤집으므로 자리 순서도 바뀝니다. 18→81, 12→51, 51→12, 25→25입니다." }),
      inputItem({ id: "flip-addition", sourceNo: "6-(4)", printGroup: 6, typeLabel: "원래 수와 뒤집은 수의 합", sourceLocator: "교사용 슬라이드 6 (4)", prompt: "원래 두 자리 수와 오른쪽으로 뒤집어 읽은 수를 더하세요.", visual: { kind: "book1", subtype: "digital-related-addition", source: [8,1], operation: "mirror-left-right", layout: "horizontal" }, parts: [numericPart("a", "81+18", 99), numericPart("b", "15+21", 36)], solution: "81을 뒤집으면 18이므로 81+18=99입니다. 15를 뒤집으면 21이므로 15+21=36입니다." }),
      inputItem({ id: "half-self-digits", sourceNo: "7-(1)", printGroup: 7, typeLabel: "돌려도 같은 숫자", sourceLocator: "교사용 슬라이드 7 (1)", prompt: "0부터 9까지의 디지털 숫자를 반 바퀴 돌렸을 때 자기 자신이 되는 숫자를 모두 쓰세요.", visual: { kind: "book1", subtype: "digital-rule-board", digits: [0,1,2,3,4,5,6,7,8,9], operation: "rotate-half" }, answer: aliases("0,1,2,5,8", "0 1 2 5 8", "0·1·2·5·8"), inputMode: "text", solution: "반 바퀴 돌린 뒤에도 같은 모양인 숫자는 0, 1, 2, 5, 8입니다." }),
      inputItem({ id: "half-pair-digits", sourceNo: "7-(2)", printGroup: 7, typeLabel: "돌리면 서로 바뀌는 숫자", sourceLocator: "교사용 슬라이드 7 (2)", prompt: "반 바퀴 돌렸을 때 서로 상대방이 되는 숫자를 모두 쓰세요.", visual: { kind: "book1", subtype: "digital-rule-board", digits: [0,1,2,3,4,5,6,7,8,9], operation: "rotate-half" }, answer: aliases("6,9", "9,6", "6와9", "6 9"), inputMode: "text", solution: "6을 반 바퀴 돌리면 9, 9를 돌리면 6이 되므로 6과 9입니다." }),
      inputItem({ id: "half-two-digit", sourceNo: "7-(3)", printGroup: 8, typeLabel: "두 자리 수 반 바퀴", sourceLocator: "교사용 슬라이드 7 (3)", prompt: "두 자리 수를 반 바퀴 돌려 읽은 수를 각각 쓰세요.", visual: { kind: "book1", subtype: "digital-rule-board", digits: [18,12,25,61], operation: "rotate-half", grouped: true }, parts: [numericPart("a", "18", 81), numericPart("b", "12", 21), numericPart("c", "25", 52), numericPart("d", "61", 19)], solution: "반 바퀴 돌리면 자리 순서도 바뀝니다. 18→81, 12→21, 25→52, 61→19입니다." }),
      inputItem({ id: "half-addition", sourceNo: "7-(4)", printGroup: 8, typeLabel: "원래 수와 돌린 수의 합", sourceLocator: "교사용 슬라이드 7 (4)", prompt: "원래 두 자리 수와 반 바퀴 돌려 읽은 수를 더하세요.", visual: { kind: "book1", subtype: "digital-related-addition", source: [1,5], operation: "rotate-half", layout: "horizontal" }, parts: [numericPart("a", "15+51", 66), numericPart("b", "19+61", 80)], solution: "15를 반 바퀴 돌리면 51이므로 15+51=66입니다. 19를 돌리면 61이므로 19+61=80입니다." }),
      arithmeticItem("arithmetic-8-add", "8-연산", 9, "받아올림이 있는 덧셈", [
        { id: "a", label: "13+47", expression: "13 + 47", answer: 60 }, { id: "b", label: "17+26", expression: "17 + 26", answer: 43 },
        { id: "c", label: "26+35", expression: "26 + 35", answer: 61 }, { id: "d", label: "38+47", expression: "38 + 47", answer: 85 }, { id: "e", label: "49+38", expression: "49 + 38", answer: 87 }
      ]),
      arithmeticItem("arithmetic-8-subtract", "8-연산", 10, "두 자리 뺄셈", [
        { id: "a", label: "83-53", expression: "83 - 53", answer: 30 }, { id: "b", label: "32-11", expression: "32 - 11", answer: 21 },
        { id: "c", label: "57-25", expression: "57 - 25", answer: 32 }, { id: "d", label: "69-28", expression: "69 - 28", answer: 41 }, { id: "e", label: "51-23", expression: "51 - 23", answer: 28 }
      ])
    ]
  },
  extension: {
    title: "추가 학습",
    structureKey: "digital-display-transform-and-arithmetic",
    story: "새 전광판에 26이 켜졌습니다.",
    prompt: "26을 반 바퀴 돌려 읽은 수를 쓰세요.",
    visual: { kind: "book1", subtype: "digital-transform", digits: [2,6], operation: "rotate-half" },
    answerMode: "input",
    inputMode: "numeric",
    answer: "92",
    explanation: "판 전체를 반 바퀴 돌리면 오른쪽의 6이 왼쪽에서 9가 되고, 왼쪽의 2가 오른쪽에서 2가 되어 92입니다."
  }
};

const splitParts = (values, divisor) => values.map((value) => numericPart(`n${value}`, `${value}÷${divisor}`, value / divisor));

const lineBoard = (layout, cards, shown, lineSum = null) => ({ kind: "book1", subtype: "line-card-board", layout, cards, shown, lineSum });

const lineCandidateItem = (id, sourceNo, layout, cards, answer) => inputItem({
  id,
  sourceNo,
  printGroup: 1,
  typeLabel: "교차점에 가능한 수 모두 찾기",
  sourceLocator: `교사용 슬라이드 ${sourceNo}`,
  prompt: "주어진 수를 한 번씩 사용하여 모든 줄의 합을 같게 만들 때, 교차점에 들어갈 수를 모두 쓰세요.",
  visual: lineBoard(layout, cards, []),
  answer,
  inputMode: "text",
  solution: `교차점의 후보를 하나씩 놓고, 남은 수를 같은 합의 짝으로 묶습니다. 가능한 교차점은 ${Array.isArray(answer) ? answer[0] : answer}입니다.`
});

const linePlacementItem = ({ id, sourceNo, layout, cards, shown, values, lineSum, blankIndexes }) => inputItem({
  id,
  sourceNo,
  printGroup: 1,
  typeLabel: "숫자 카드로 같은 합 만들기",
  sourceLocator: `교사용 슬라이드 ${sourceNo}`,
  prompt: "주어진 숫자 카드를 한 번씩 빈자리에 놓아 모든 줄의 합을 같게 만들고, 한 줄의 합을 구하세요.",
  visual: lineBoard(layout, cards, shown, lineSum),
  parts: [
    ...blankIndexes.map((index) => numericPart(`p${index}`, `${index + 1}번 자리`, values[index])),
    numericPart("sum", "한 줄의 합", lineSum)
  ],
  solution: `한 칸만 비어 있는 줄부터 카드 값을 정하고 사용한 카드를 지웁니다. 완성 배열은 ${values.join("-")}이고 모든 줄의 합은 ${lineSum}입니다.`
});

const equalLinePlacementLesson = {
  id: "equal-line-placement",
  unit: "마방진과 가쿠로 퍼즐",
  title: "숫자 카드로 모든 줄의 합을 같게 해요",
  sourceLocator: "교사용 슬라이드 21~23, 활동 02~03·연산",
  sourceTypeIds: ["circular-magic-line-sum", "five-card-line-sum", "digit-sum-enumeration"],
  representativeConcept: "교차점은 여러 줄에 함께 들어가므로 후보를 하나씩 놓고, 남은 수를 같은 합이 되는 짝이나 묶음으로 배치함",
  experience: {
    kind: "guided-concept",
    family: "line-card-placement",
    title: "교차점 하나를 정하고 남은 카드를 짝지어요",
    hint: "교차점의 수는 모든 줄에 공통으로 들어갑니다. 그 수를 빼고 남은 카드끼리 같은 합이 되는지 확인하세요.",
    model: { cards: [1,2,3,4,5], center: 3, pairs: [[1,5],[2,4]] },
    beats: [
      { phase: "cards", caption: "사용할 카드 1, 2, 3, 4, 5를 빠짐없이 확인합니다." },
      { phase: "center", caption: "교차점에 3을 놓아 두 줄에 공통으로 사용합니다." },
      { phase: "pairs", caption: "남은 카드를 1+5와 2+4처럼 같은 합의 두 짝으로 묶습니다." },
      { phase: "verify", caption: "1+3+5와 2+3+4가 모두 9인지 확인합니다." }
    ],
    check: { prompt: "1, 2, 3, 4, 5에서 교차점에 3을 놓으면 남은 같은 합의 두 짝은 무엇인가요?", options: ["1+5와 2+4", "1+2와 4+5", "1+4와 2+3"], answer: "1+5와 2+4", explanation: "교차점 3을 뺀 남은 카드에서 1+5=6, 2+4=6으로 두 짝의 합이 같습니다." }
  },
  story: {
    title: "같은 빛을 만드는 카드 길",
    text: "여러 길이 한 교차점을 지나갑니다. 숫자 카드를 한 번씩 놓아 어느 길로 더해도 같은 밝기가 되게 합니다.",
    mission: "교차점 후보를 정한 뒤 남은 카드를 같은 합의 짝으로 묶고 모든 줄을 다시 더하세요."
  },
  explanation: {
    headline: "공통인 교차점을 고정하면 남은 수의 짝이 보입니다.",
    steps: [
      "교차점에 들어갈 후보를 하나 정합니다.",
      "남은 카드들을 각 줄에 필요한 수만큼 나누어 같은 합이 되는지 봅니다.",
      "카드를 한 번씩만 썼는지와 모든 줄의 전체 합이 같은지 확인합니다."
    ]
  },
  original: {
    title: "골든벨과 기초 연산",
    mode: "paged",
    sourceQuestionCount: 17,
    structureKey: "equal-line-card-placement-source",
    prompt: "숫자 카드를 한 번씩 사용해 모든 줄의 합을 같게 만들고, 조건에 맞는 수를 구하세요.",
    items: [
      lineCandidateItem("cross-center-1", "21-(1)-①", "cross", [1,2,3,4,5], aliases("1,3,5", "1 3 5", "1·3·5")),
      lineCandidateItem("cross-center-2", "21-(1)-②", "cross", [2,3,4,5,6], aliases("2,4,6", "2 4 6", "2·4·6")),
      lineCandidateItem("tee-center-1", "21-(2)-①", "t-shape", [2,5,8,11,14], aliases("2,8,14", "2 8 14", "2·8·14")),
      lineCandidateItem("tee-center-2", "21-(2)-②", "t-shape", [3,4,5,6,7], aliases("3,5,7", "3 5 7", "3·5·7")),
      lineCandidateItem("flower-center-1", "21-(3)-①", "flower", [1,2,3,4,5,6,7,8,9], aliases("1,5,9", "1 5 9", "1·5·9")),
      lineCandidateItem("flower-center-2", "21-(3)-②", "flower", [2,4,6,8,10,12,14,16,18], aliases("2,10,18", "2 10 18", "2·10·18")),
      linePlacementItem({ id: "place-t-12", sourceNo: "22-(1)", layout: "t-shape", cards: [4,5,6], shown: [1,null,null,null,2], values: [1,5,6,4,2], lineSum: 12, blankIndexes: [1,2,3] }),
      linePlacementItem({ id: "place-corner-15", sourceNo: "22-(2)", layout: "corner", cards: [2,5,7], shown: [6,null,null,null,3], values: [6,2,7,5,3], lineSum: 15, blankIndexes: [1,2,3] }),
      linePlacementItem({ id: "place-triangle-9", sourceNo: "22-(3)", layout: "triangle", cards: [3,4,5,6], shown: [1,null,null,2,null,null], values: [1,6,5,2,4,3], lineSum: 9, blankIndexes: [1,2,4,5] }),
      linePlacementItem({ id: "place-triangle-11", sourceNo: "22-(4)", layout: "triangle", cards: [1,3,4,5], shown: [2,null,null,null,null,6], values: [2,5,3,4,1,6], lineSum: 11, blankIndexes: [1,2,3,4] }),
      inputItem({
        id: "digit-sum-table",
        sourceNo: "23-연산",
        printGroup: 1,
        typeLabel: "각 자리 숫자의 합이 같은 두 자리 수",
        sourceLocator: "교사용 슬라이드 23 연산",
        prompt: "각 자리 숫자의 합이 4부터 10까지인 두 자리 수를 빠짐없이 쓰세요.",
        visual: { kind: "book1", subtype: "digit-sum-table", from: 1, to: 10, revealedThrough: 3 },
        parts: [
          textPart("sum4", "합 4", aliases("13,22,31,40", "13 22 31 40")),
          textPart("sum5", "합 5", aliases("14,23,32,41,50", "14 23 32 41 50")),
          textPart("sum6", "합 6", aliases("15,24,33,42,51,60", "15 24 33 42 51 60")),
          textPart("sum7", "합 7", aliases("16,25,34,43,52,61,70", "16 25 34 43 52 61 70")),
          textPart("sum8", "합 8", aliases("17,26,35,44,53,62,71,80", "17 26 35 44 53 62 71 80")),
          textPart("sum9", "합 9", aliases("18,27,36,45,54,63,72,81,90", "18 27 36 45 54 63 72 81 90")),
          textPart("sum10", "합 10", aliases("19,28,37,46,55,64,73,82,91", "19 28 37 46 55 64 73 82 91"))
        ],
        sourceDiscrepancy: "교사용 표는 합 10의 개수를 10개로 적었지만 두 자리 수를 독립 열거하면 19부터 91까지 9개이므로 9개로 잠금",
        solution: "십의 자리를 1부터 9까지 놓고 일의 자리를 목표 합에서 빼면 됩니다. 합 10에서는 19, 28, 37, 46, 55, 64, 73, 82, 91의 9개이며 100은 두 자리 수가 아닙니다."
      })
    ]
  },
  extension: {
    title: "추가 학습",
    structureKey: "equal-line-card-placement-source",
    story: "새 교차로에 2, 4, 6, 8, 10 카드를 놓습니다.",
    prompt: "십자 모양의 교차점에 들어갈 수 있는 카드를 모두 쓰세요.",
    visual: lineBoard("cross", [2,4,6,8,10], []),
    answerMode: "input",
    inputMode: "text",
    answer: aliases("2,6,10", "2 6 10", "2·6·10"),
    explanation: "교차점이 2이면 4+10=6+8, 6이면 2+10=4+8, 10이면 2+8=4+6으로 남은 카드가 같은 합의 두 짝이 됩니다."
  }
};

const gakuroLesson = {
  id: "gakuro-sum-grid",
  unit: "마방진과 가쿠로 퍼즐",
  title: "가로와 세로의 합을 맞춰요",
  sourceLocator: "교사용 슬라이드 24~26, 활동 01~02·연산",
  sourceTypeIds: ["gakuro-card-placement", "gakuro-card-rectangle-placement", "gakuro-grid-sum"],
  representativeConcept: "가로합과 세로합에서 이미 있는 수를 빼 빈칸의 수를 찾고, 숫자 카드는 한 번씩만 사용함",
  experience: {
    kind: "guided-concept",
    family: "sum-grid-placement",
    title: "한 줄씩 합을 맞추며 카드를 놓아요",
    hint: "숫자가 하나만 비어 있는 줄부터 계산하고, 사용한 카드는 후보에서 지우세요.",
    model: { cards: [4,5,6], known: 3, rowSums: [8,10], columnSums: [9,9] },
    beats: [
      { phase: "given", caption: "이미 놓인 3과 네 줄의 합을 확인합니다." },
      { phase: "row", caption: "윗줄은 8이므로 오른쪽 칸은 8-3=5입니다." },
      { phase: "column", caption: "왼쪽 세로줄은 9이므로 아래 칸은 9-3=6입니다." },
      { phase: "complete", caption: "남은 카드 4를 놓고 모든 줄의 합을 다시 확인합니다." }
    ],
    check: { prompt: "윗줄의 합이 8이고 왼쪽 칸이 3이면 오른쪽 칸은 얼마일까요?", options: ["4개", "5개", "6개"], answer: "5개", explanation: "8-3=5입니다." }
  },
  story: {
    title: "합을 지키는 숫자 카드",
    text: "숫자 카드를 한 번씩만 사용해 가로와 세로 끝의 합을 맞춥니다. 쉬운 줄에서 구한 수가 다음 줄의 단서가 됩니다.",
    mission: "한 칸만 비어 있는 줄부터 풀고 마지막에 모든 행과 열의 합을 확인하세요."
  },
  explanation: {
    headline: "확정할 수 있는 한 칸을 먼저 찾습니다.",
    steps: [
      "행과 열 중 빈칸이 하나뿐인 줄을 고릅니다.",
      "줄의 합에서 알려진 수를 빼 빈칸을 구합니다.",
      "사용한 카드를 지우고 모든 행·열의 합을 다시 더합니다."
    ]
  },
  original: {
    title: "골든벨과 기초 연산",
    mode: "paged",
    sourceQuestionCount: 18,
    structureKey: "gakuro-card-grid-source",
    prompt: "주어진 숫자 카드를 한 번씩 넣어 가로와 세로의 합을 맞추세요.",
    items: [
      inputItem({ id: "grid-24-1", sourceNo: "24-(1)", printGroup: 1, typeLabel: "2×2 카드 가쿠로", sourceLocator: "교사용 슬라이드 24 (1)", prompt: "빈 세 칸에 4, 5, 6을 한 번씩 넣으세요.", visual: { kind: "book1", subtype: "sum-grid", rows: 2, columns: 2, shown: [3,null,null,null], rowSums: [8,10], columnSums: [9,9], cards: [4,5,6] }, parts: [numericPart("tr", "윗줄 오른쪽", 5), numericPart("bl", "아랫줄 왼쪽", 6), numericPart("br", "아랫줄 오른쪽", 4)], solution: "윗줄 8에서 3을 빼면 5, 왼쪽 세로줄 9에서 3을 빼면 6입니다. 남은 카드는 4이고 6+4=10, 5+4=9가 맞습니다." }),
      inputItem({ id: "grid-24-2", sourceNo: "24-(2)", printGroup: 1, typeLabel: "2×2 카드 가쿠로", sourceLocator: "교사용 슬라이드 24 (2)", prompt: "1, 3, 5, 7을 한 번씩 넣으세요.", visual: { kind: "book1", subtype: "sum-grid", rows: 2, columns: 2, shown: [null,null,null,null], rowSums: [6,10], columnSums: [4,12], cards: [1,3,5,7] }, parts: [numericPart("tl", "윗줄 왼쪽", 1), numericPart("tr", "윗줄 오른쪽", 5), numericPart("bl", "아랫줄 왼쪽", 3), numericPart("br", "아랫줄 오른쪽", 7)], solution: "합이 4인 왼쪽 세로줄에는 1과 3이 옵니다. 윗줄 합 6을 맞추면 1 옆은 5이고, 아래에는 3과 7이 남습니다." }),
      inputItem({ id: "grid-24-3", sourceNo: "24-(3)", printGroup: 2, typeLabel: "3×2 카드 가쿠로", sourceLocator: "교사용 슬라이드 24 (3)", prompt: "2, 3, 5, 6을 빈칸에 한 번씩 넣으세요.", visual: { kind: "book1", subtype: "sum-grid", rows: 3, columns: 2, shown: [null,4,1,null,null,null], rowSums: [10,4,7], columnSums: [12,9], cards: [2,3,5,6] }, parts: [numericPart("r1c1", "1행 1열", 6), numericPart("r2c2", "2행 2열", 3), numericPart("r3c1", "3행 1열", 5), numericPart("r3c2", "3행 2열", 2)], solution: "첫째 행은 10-4=6, 둘째 행은 4-1=3입니다. 남은 5와 2를 셋째 행에 놓으면 세로합 12와 9가 모두 맞습니다." }),
      inputItem({ id: "grid-24-4", sourceNo: "24-(4)", printGroup: 2, typeLabel: "2×3 카드 가쿠로", sourceLocator: "교사용 슬라이드 24 (4)", prompt: "4, 5, 7, 8을 빈칸에 한 번씩 넣으세요.", visual: { kind: "book1", subtype: "sum-grid", rows: 2, columns: 3, shown: [null,null,2,9,null,null], rowSums: [13,22], columnSums: [13,12,10], cards: [4,5,7,8] }, parts: [numericPart("r1c1", "1행 1열", 4), numericPart("r1c2", "1행 2열", 7), numericPart("r2c2", "2행 2열", 5), numericPart("r2c3", "2행 3열", 8)], solution: "첫째 세로줄은 13-9=4, 셋째 세로줄은 10-2=8입니다. 윗줄은 13-4-2=7, 아랫줄은 22-9-8=5입니다." }),
      inputItem({ id: "grid-25-1", sourceNo: "25-(1)", printGroup: 3, typeLabel: "3×2 카드 가쿠로", sourceLocator: "교사용 슬라이드 25 (1)", prompt: "1, 2, 3, 4, 6을 빈칸에 한 번씩 넣으세요.", visual: { kind: "book1", subtype: "sum-grid", rows: 3, columns: 2, shown: [5,null,null,null,null,null], rowSums: [9,3,9], columnSums: [10,11], cards: [1,2,3,4,6] }, parts: [numericPart("r1c2", "1행 2열", 4), numericPart("r2c1", "2행 1열", 2), numericPart("r2c2", "2행 2열", 1), numericPart("r3c1", "3행 1열", 3), numericPart("r3c2", "3행 2열", 6)], solution: "윗줄은 9-5=4입니다. 둘째 행의 합 3은 2와 1, 셋째 행의 합 9는 3과 6입니다. 세로합 10과 11에 맞추면 2·1, 3·6의 자리가 정해집니다." }),
      inputItem({ id: "grid-25-2", sourceNo: "25-(2)", printGroup: 3, typeLabel: "3×3 카드 가쿠로", sourceLocator: "교사용 슬라이드 25 (2)", prompt: "1, 3, 4, 5, 7, 8을 빈칸에 한 번씩 넣으세요.", visual: { kind: "book1", subtype: "sum-grid", rows: 3, columns: 3, shown: [null,null,9,6,null,null,2,null,null], rowSums: [21,10,14], columnSums: [12,14,19], cards: [1,3,4,5,7,8] }, parts: [numericPart("r1c1", "1행 1열", 4), numericPart("r1c2", "1행 2열", 8), numericPart("r2c2", "2행 2열", 1), numericPart("r2c3", "2행 3열", 3), numericPart("r3c2", "3행 2열", 5), numericPart("r3c3", "3행 3열", 7)], solution: "첫째 세로줄은 12-6-2=4입니다. 첫째 행에서 21-4-9=8, 둘째 행과 셋째 행을 차례로 맞추면 1,3,5,7이 정해집니다." }),
      inputItem({ id: "equal-halves", sourceNo: "26-연산", printGroup: 4, typeLabel: "같은 두 수로 나누기", sourceLocator: "교사용 슬라이드 26", prompt: "각 수를 같은 두 수로 나누세요.", visual: { kind: "book1", subtype: "equal-split-set", values: [20,40,60,24,48,86,30,50,70,32,54,76], divisor: 2 }, parts: splitParts([20,40,60,24,48,86,30,50,70,32,54,76], 2), solution: "같은 두 수이므로 각 수를 2로 나눕니다. 차례로 10, 20, 30, 12, 24, 43, 15, 25, 35, 16, 27, 38입니다." })
    ]
  },
  extension: {
    title: "추가 학습",
    structureKey: "gakuro-card-grid-source",
    story: "새 숫자 카드 2, 4, 6을 2×2 표의 빈칸에 넣습니다.",
    prompt: "왼쪽 위가 3이고 윗줄 합이 7일 때 오른쪽 위 칸은 얼마일까요?",
    visual: { kind: "book1", subtype: "sum-grid", rows: 2, columns: 2, shown: [3,null,null,null], rowSums: [7,8], columnSums: [9,6], cards: [2,4,6] },
    answerMode: "input",
    inputMode: "numeric",
    answer: "4",
    explanation: "윗줄의 합은 7이므로 7-3=4입니다."
  }
};

const conditionItem = (id, sourceNo, printGroup, title, clues, prompt, answer, solution, parts) => inputItem({
  id,
  sourceNo,
  printGroup,
  typeLabel: title,
  sourceLocator: `교사용 슬라이드 ${sourceNo.split("-")[0]}`,
  prompt,
  visual: { kind: "book1", subtype: "condition-card", title, clues },
  answer,
  parts,
  inputMode: "text",
  solution
});

const numberInferenceLesson = {
  id: "number-inference",
  unit: "수 추리와 논리 추리",
  title: "조건에 맞는 수를 찾아요",
  sourceLocator: "교사용 슬라이드 28~31, 활동 01~02·연산",
  sourceTypeIds: ["digit-sum-enumeration", "three-digit-step-sequence", "two-digit-condition", "place-value-condition-three", "place-value-condition-four"],
  representativeConcept: "자리 수와 자릿값을 읽고, 여러 조건을 하나씩 적용해 남는 수를 빠짐없이 찾음",
  experience: {
    kind: "guided-concept",
    family: "number-condition-filter",
    title: "조건을 하나씩 통과시켜요",
    hint: "조건을 한꺼번에 보지 말고 첫 조건을 통과한 수만 남긴 뒤 다음 조건을 적용하세요.",
    model: { candidates: [13,22,31,40], answer: [13,31] },
    beats: [
      { phase: "candidates", caption: "십의 자리와 일의 자리 합이 4인 수를 모두 적습니다." },
      { phase: "first", caption: "13, 22, 31, 40이 첫 조건을 통과합니다." },
      { phase: "second", caption: "그중 홀수만 남기면 13과 31입니다." },
      { phase: "verify", caption: "남은 두 수가 두 조건을 모두 만족하는지 다시 확인합니다." }
    ],
    check: { prompt: "십의 자리와 일의 자리 합이 4인 홀수는 무엇인가요?", options: ["13과 31", "22와 40", "13과 40"], answer: "13과 31", explanation: "합이 4인 13,22,31,40 중 홀수는 13과 31입니다." }
  },
  story: {
    title: "조건을 통과하는 숫자 문",
    text: "수들은 자리 수, 홀짝, 자릿값 관계가 적힌 문을 차례로 통과합니다. 조건을 모두 만족한 수만 마지막에 남습니다.",
    mission: "각 조건을 적용한 중간 후보를 적고 마지막 답을 원래 조건에 다시 넣어 확인하세요."
  },
  explanation: {
    headline: "후보를 만들고 조건을 하나씩 적용합니다.",
    steps: [
      "자리 수와 자릿값을 먼저 읽어 가능한 수를 만듭니다.",
      "홀수·짝수와 자리 사이의 차 같은 조건을 하나씩 적용합니다.",
      "남은 수를 모든 조건에 다시 대어 빠진 답과 잘못 남은 답이 없는지 확인합니다."
    ]
  },
  original: {
    title: "골든벨과 기초 연산",
    mode: "paged",
    sourceQuestionCount: 20,
    structureKey: "number-condition-enumeration-source",
    prompt: "자리 수와 여러 조건을 읽고 알맞은 수를 구하세요.",
    items: [
      conditionItem("digit-count-2", "28-(1)", 1, "자리 수 세기", ["6, 72, 846, 84, 5387"], "주어진 수 중 두 자리 수는 몇 개입니까?", "2", "두 자리 수는 72와 84이므로 2개입니다."),
      conditionItem("digit-count-4", "28-(2)", 1, "자리 수 세기", ["6, 85, 5487, 844, 6412, 9787"], "주어진 수 중 네 자리 수는 몇 개입니까?", "3", "네 자리 수는 5487, 6412, 9787이므로 3개입니다."),
      conditionItem("place-325", "28-(3)", 1, "자릿값으로 수 만들기", ["100이 3개", "10이 2개", "1이 5개"], "나타내는 수와 십의 자리 숫자를 각각 쓰세요.", null, "300+20+5=325이고 십의 자리 숫자는 2입니다.", [numericPart("number", "나타내는 수", 325), numericPart("tens", "십의 자리", 2)]),
      conditionItem("place-651", "28-(4)", 1, "자릿값으로 수 만들기", ["100이 6개", "10이 5개", "1이 1개"], "나타내는 수와 백의 자리 숫자를 각각 쓰세요.", null, "600+50+1=651이고 백의 자리 숫자는 6입니다.", [numericPart("number", "나타내는 수", 651), numericPart("hundreds", "백의 자리", 6)]),
      inputItem({ id: "place-1435", sourceNo: "28-(5)", printGroup: 2, typeLabel: "수 모형 읽기", sourceLocator: "교사용 슬라이드 28 (5)", prompt: "수 모형이 나타내는 수와 천의 자리 숫자를 각각 쓰세요.", visual: { kind: "book1", subtype: "place-value-blocks", thousands: 1, hundreds: 4, tens: 3, ones: 5 }, parts: [numericPart("number", "나타내는 수", 1435), numericPart("thousands", "천의 자리", 1)], solution: "천 모형 1개, 백 모형 4개, 십 모형 3개, 낱개 5개이므로 1435이고 천의 자리 숫자는 1입니다." }),
      inputItem({ id: "place-2365", sourceNo: "28-(6)", printGroup: 2, typeLabel: "수 모형 읽기", sourceLocator: "교사용 슬라이드 28 (6)", prompt: "수 모형이 나타내는 수와 천의 자리 숫자를 각각 쓰세요.", visual: { kind: "book1", subtype: "place-value-blocks", thousands: 2, hundreds: 3, tens: 6, ones: 5 }, parts: [numericPart("number", "나타내는 수", 2365), numericPart("thousands", "천의 자리", 2)], sourceDiscrepancy: "교사용 붉은 필기의 천의 자리 숫자가 1처럼 보이지만, 수 모형과 2365의 천의 자리를 독립 계산하면 2이므로 2로 잠금", solution: "천 모형 2개, 백 모형 3개, 십 모형 6개, 낱개 5개이므로 2365이고 천의 자리 숫자는 2입니다." }),
      conditionItem("two-sum-3", "29-(1)", 3, "두 자리 수 모두 찾기", ["십의 자리 + 일의 자리 = 3"], "조건에 맞는 두 자리 수를 모두 쓰세요.", aliases("12,21,30", "12 21 30", "12·21·30"), "십의 자리를 1,2,3으로 차례로 놓으면 일의 자리는 2,1,0이 되어 12,21,30입니다."),
      conditionItem("two-sum-6", "29-(2)", 3, "두 자리 수 모두 찾기", ["십의 자리 + 일의 자리 = 6"], "조건에 맞는 두 자리 수를 모두 쓰세요.", aliases("15,24,33,42,51,60", "15 24 33 42 51 60", "15·24·33·42·51·60"), "십의 자리를 1부터 6까지 늘리며 일의 자리를 줄이면 15,24,33,42,51,60입니다."),
      conditionItem("two-sum-4-odd", "29-(3)", 3, "두 조건의 두 자리 수", ["십의 자리 + 일의 자리 = 4", "홀수"], "두 조건에 모두 맞는 수를 쓰세요.", aliases("13,31", "31,13", "13 31", "13과31"), "합이 4인 13,22,31,40 중 홀수는 13과 31입니다."),
      conditionItem("two-sum-7-gap", "29-(4)", 3, "두 조건의 두 자리 수", ["십의 자리 + 일의 자리 = 7", "십의 자리 숫자가 일의 자리 숫자보다 3 큼"], "두 조건에 모두 맞는 수를 쓰세요.", "52", "합이 7인 수를 적고 자리 차가 3인지 확인하면 52만 남습니다."),
      conditionItem("two-gap-7-odd", "29-(5)", 4, "두 조건의 두 자리 수", ["십의 자리 숫자가 일의 자리 숫자보다 7 큼", "홀수"], "두 조건에 모두 맞는 수를 쓰세요.", "81", "자리 차가 7인 92,81,70 중 홀수는 81입니다."),
      conditionItem("two-over-60-odd", "29-(6)", 4, "세 조건의 두 자리 수", ["60보다 큰 홀수", "일의 자리 숫자가 십의 자리 숫자보다 2 큼"], "조건에 맞는 수를 쓰세요.", "79", "60보다 크고 자리 차가 2인 후보 68과 79 중 홀수는 79입니다."),
      conditionItem("three-descend-3", "30-(1)", 5, "세 자리 수 모두 찾기", ["963을 포함", "자리가 내려가며 3씩 작아짐"], "조건에 맞는 세 자리 수를 모두 쓰세요.", aliases("963,852,741,630", "963 852 741 630"), "백의 자리부터 3씩 작아지는 수를 963에서 시작해 적으면 963,852,741,630입니다."),
      conditionItem("three-descend-2", "30-(2)", 5, "세 자리 수 모두 찾기", ["975를 포함", "자리가 내려가며 2씩 작아짐"], "조건에 맞는 세 자리 수를 모두 쓰세요.", aliases("975,864,753,642,531,420", "975 864 753 642 531 420"), "각 자리 차가 2인 수를 차례로 적으면 975,864,753,642,531,420입니다."),
      conditionItem("three-descend-2-eight", "30-(3)", 5, "조건을 더해 하나 찾기", ["자리가 내려가며 2씩 작아짐", "8이 들어감"], "조건에 맞는 수를 쓰세요.", "864", "975와 864가 자리마다 2씩 작아지는 후보이고 그중 8이 들어간 수는 864입니다."),
      conditionItem("three-ascend-1-small-sum", "30-(4)", 5, "조건을 더해 하나 찾기", ["자리가 내려가며 1씩 커짐", "각 자리 합이 8보다 작음"], "조건에 맞는 수를 쓰세요.", "123", "123은 자리가 1씩 커지고 자리 합이 1+2+3=6으로 8보다 작습니다. 다음 후보 234는 합이 9라서 제외됩니다."),
      conditionItem("three-odd-sum-11", "30-(5)", 6, "세 조건의 세 자리 수", ["세 자리 숫자가 모두 홀수", "각 자리 합이 11", "백의 자리 숫자가 가장 작음", "일의 자리 숫자가 가장 큼"], "조건에 맞는 수를 쓰세요.", "137", "서로 다른 홀수 1, 3, 7의 합은 11입니다. 가장 작은 1을 백의 자리, 가장 큰 7을 일의 자리에 놓고 3을 가운데에 놓으면 137입니다."),
      conditionItem("three-363", "30-(6)", 6, "세 조건의 세 자리 수", ["300보다 큰 세 자리 홀수", "백의 자리 = 일의 자리", "백의 자리 + 일의 자리 = 십의 자리"], "조건에 맞는 수를 쓰세요.", "363", "백과 일이 같은 3이면 십의 자리는 3+3=6이므로 363입니다."),
      inputItem({ id: "equal-four-split", sourceNo: "31-연산1", printGroup: 7, typeLabel: "같은 네 수로 나누기", sourceLocator: "교사용 슬라이드 31 연산 1", prompt: "각 수를 같은 네 수로 나누세요.", visual: { kind: "book1", subtype: "equal-split-set", values: [40,48,64,56], divisor: 4 }, parts: splitParts([40,48,64,56], 4), solution: "각 수를 4로 나누면 차례로 10, 12, 16, 14입니다." }),
      inputItem({ id: "equal-three-split", sourceNo: "31-연산2", printGroup: 7, typeLabel: "같은 세 수로 나누기", sourceLocator: "교사용 슬라이드 31 연산 2", prompt: "각 수를 같은 세 수로 나누세요.", visual: { kind: "book1", subtype: "equal-split-set", values: [6,12,18,15,30,63], divisor: 3 }, parts: splitParts([6,12,18,15,30,63], 3), solution: "각 수를 3으로 나누면 차례로 2, 4, 6, 5, 10, 21입니다." })
    ]
  },
  extension: {
    title: "추가 학습",
    structureKey: "number-condition-enumeration-source",
    story: "두 자리 수가 두 조건의 문을 통과합니다.",
    prompt: "십의 자리와 일의 자리 합이 8이고 홀수인 두 자리 수를 모두 쓰세요.",
    visual: { kind: "book1", subtype: "condition-card", title: "두 자리 수", clues: ["십의 자리 + 일의 자리 = 8", "홀수"] },
    answerMode: "input",
    answer: aliases("17,35,53,71", "17 35 53 71", "17·35·53·71"),
    explanation: "합이 8인 수는 17,26,35,44,53,62,71,80이고 그중 홀수는 17,35,53,71입니다."
  }
};

const orderVisual = (order, hidden = []) => ({ kind: "book1", subtype: "order-line", order, hidden });

const orderLogicLesson = {
  id: "relative-order-running",
  unit: "수 추리와 논리 추리",
  title: "앞뒤 순서를 찾아요",
  sourceLocator: "교사용 슬라이드 33, 활동 02~03",
  sourceTypeIds: ["relative-order-logic"],
  representativeConcept: "앞·뒤·사이·바로 앞뒤 조건을 선 위에 놓고 확정된 사람부터 순서를 정함",
  experience: {
    kind: "guided-concept",
    family: "relative-order",
    title: "확정된 앞뒤 관계를 한 줄로 이어요",
    hint: "'바로'라는 말이 있으면 두 사람을 붙여 하나의 묶음처럼 움직이세요.",
    model: { people: ["A","B","C","D"], answer: ["B","D","C","A"] },
    beats: [
      { phase: "empty", caption: "앞에서 뒤로 네 자리를 그립니다." },
      { phase: "last", caption: "A가 제일 뒤라는 조건으로 마지막 자리를 확정합니다." },
      { phase: "pair", caption: "C가 A 바로 앞이므로 C와 A를 붙여 놓습니다." },
      { phase: "complete", caption: "D가 B와 C 사이이므로 최종 순서는 B-D-C-A입니다." }
    ],
    check: { prompt: "앞에서 가-나-다-라 순서로 서 있을 때 뒤에서 첫 번째는 누구인가요?", options: ["가", "나", "라"], answer: "라", explanation: "맨 뒤에 있는 라가 뒤에서 첫 번째입니다." }
  },
  story: {
    title: "달리기 결승선 순서",
    text: "친구들이 결승선에 들어온 순서를 조건으로 찾아봅니다. 앞과 뒤의 기준을 먼저 표시하면 헷갈리지 않습니다.",
    mission: "조건마다 순서 선을 다시 그리고 물은 방향이 앞인지 뒤인지 확인하세요."
  },
  explanation: {
    headline: "기준 방향을 표시하고 붙어 있는 관계부터 놓습니다.",
    steps: [
      "선의 왼쪽을 앞, 오른쪽을 뒤로 정해 표시합니다.",
      "제일 앞·제일 뒤·바로 앞뒤처럼 확정되는 조건부터 놓습니다.",
      "사이 조건을 넣고 앞에서 또는 뒤에서 차례로 세어 답합니다."
    ]
  },
  original: {
    title: "골든벨",
    mode: "paged",
    sourceQuestionCount: 6,
    structureKey: "relative-order-source",
    prompt: "친구들의 달리기 또는 서 있는 순서를 조건으로 찾으세요.",
    items: [
      conditionItem("race-third", "33-(1)", 1, "달리기 순서", ["A의 앞에는 C만 있습니다."], "A, B, C 중 3등은 누구입니까?", "B", "A의 앞에는 C만 있으므로 C가 1등, A가 2등이고 남은 B가 3등입니다."),
      conditionItem("race-first", "33-(2)", 1, "달리기 순서", ["B는 A와 C 사이에 있습니다.", "A 뒤에는 아무도 없습니다."], "A, B, C 중 1등은 누구입니까?", "C", "A가 마지막이고 B가 A와 C 사이이므로 순서는 C-B-A입니다. 1등은 C입니다."),
      conditionItem("race-first-if-not-a", "33-(3)", 1, "달리기 순서", ["A 바로 뒤에 D가 도착했습니다.", "C가 가장 마지막에 도착했습니다."], "A가 1등이 아니라면 1등은 누구입니까?", "B", "A와 D는 붙어 있고 C가 마지막입니다. A가 1등이 아니므로 앞자리는 B가 차지합니다."),
      inputItem({ id: "standing-front-second", sourceNo: "33-(4-1)", printGroup: 2, typeLabel: "앞에서 세기", sourceLocator: "교사용 슬라이드 33 활동 02 (1)", prompt: "앞에서 두 번째에 서 있는 친구는 누구입니까?", visual: orderVisual(["A","B","C","D"]), answer: "B", inputMode: "text", solution: "앞에서 A를 첫 번째로 세면 두 번째는 B입니다." }),
      inputItem({ id: "standing-back-first", sourceNo: "33-(4-2)", printGroup: 2, typeLabel: "뒤에서 세기", sourceLocator: "교사용 슬라이드 33 활동 02 (2)", prompt: "뒤에서 첫 번째에 서 있는 친구는 누구입니까?", visual: orderVisual(["A","B","C","D"]), answer: "D", inputMode: "text", solution: "뒤쪽 끝에 있는 D가 뒤에서 첫 번째입니다." }),
      conditionItem("standing-back-third", "33-(5)", 3, "조건으로 순서 정하기", ["A는 제일 뒤에 서 있습니다.", "A 바로 앞에 C가 서 있습니다.", "D는 B와 C 사이에 서 있습니다."], "뒤에서 세 번째에 서 있는 친구를 쓰세요.", "D", "A가 마지막, C가 A 바로 앞입니다. D가 B와 C 사이이므로 앞에서 B-D-C-A이고 뒤에서 세 번째는 D입니다.")
    ]
  },
  extension: {
    title: "추가 학습",
    structureKey: "relative-order-source",
    story: "하나, 두리, 세모, 네모가 한 줄로 섰습니다.",
    prompt: "네모가 제일 뒤, 세모가 네모 바로 앞, 하나가 두리보다 앞일 때 앞에서 두 번째는 누구일까요?",
    visual: orderVisual(["하나","두리","세모","네모"], [1]),
    answerMode: "input",
    answer: "두리",
    explanation: "세모-네모가 뒤의 두 자리이고 하나가 두리보다 앞이므로 하나-두리-세모-네모입니다."
  }
};

const equalizeTransferLesson = {
  id: "book1-equalize-transfer",
  unit: "수 추리와 논리 추리",
  title: "같아지도록 몇 개를 줄까요",
  sourceLocator: "교사용 슬라이드 34, 연산 1",
  sourceTypeIds: ["equalize-transfer"],
  representativeConcept: "두 양의 차를 구한 뒤 그 차의 절반을 많은 쪽에서 적은 쪽으로 옮김",
  experience: {
    kind: "guided-concept",
    family: "equalize-transfer",
    title: "차이의 절반만 옮겨요",
    hint: "하나를 옮기면 많은 쪽은 1 줄고 적은 쪽은 1 늘어 차이가 2씩 줄어듭니다.",
    model: { left: 9, right: 5, transfer: 2 },
    beats: [
      { phase: "start", caption: "A는 9개, B는 5개로 4개 차이입니다." },
      { phase: "difference", caption: "차이 4를 두 사람 쪽으로 똑같이 나눕니다." },
      { phase: "move", caption: "A에서 B로 2개를 옮깁니다." },
      { phase: "equal", caption: "A와 B가 각각 7개가 되어 같아집니다." }
    ],
    check: { prompt: "A가 13개, B가 7개일 때 A가 몇 개를 주면 같아질까요?", options: ["2개", "3개", "6개"], answer: "3개", explanation: "차이는 6개이고 그 절반인 3개를 옮깁니다." }
  },
  story: {
    title: "사탕을 똑같이 나누는 두 친구",
    text: "많이 가진 친구가 적게 가진 친구에게 몇 개를 주어 두 사람이 같은 수를 갖게 합니다.",
    mission: "두 양을 더해 반으로 나누거나, 두 양의 차를 구해 절반만 옮기세요."
  },
  explanation: {
    headline: "차이를 두 몫으로 나누면 옮길 양이 됩니다.",
    steps: [
      "많은 수에서 적은 수를 빼 두 사람의 차이를 구합니다.",
      "한 개를 옮길 때 차이는 2 줄어드므로 차이를 2로 나눕니다.",
      "옮긴 뒤 두 사람이 가진 수가 같은지 덧셈으로 확인합니다."
    ]
  },
  original: {
    title: "기초 연산",
    mode: "paged",
    sourceQuestionCount: 8,
    structureKey: "equalize-by-transfer-source",
    prompt: "A가 B에게 몇 개를 주어야 두 사람이 가진 수가 같아지는지 구하세요.",
    items: [[9,5,2],[13,7,3],[16,4,6],[19,3,8],[25,7,9],[31,19,6],[43,17,13],[57,19,19]].map(([left,right,answer], index) => inputItem({
      id: `transfer-${index + 1}`,
      sourceNo: `34-(${index + 1})`,
      printGroup: Math.floor(index / 2) + 1,
      typeLabel: "같아지도록 주기",
      sourceLocator: `교사용 슬라이드 34 (${index + 1})`,
      prompt: `A는 ${left}개, B는 ${right}개를 가지고 있습니다. A가 B에게 몇 개를 주어야 같아집니까?`,
      visual: { kind: "book1", subtype: "equalize-transfer", left, right },
      answer: String(answer),
      solution: `${left}-${right}=${left-right}이고 차이를 반으로 나누면 ${(left-right)}÷2=${answer}입니다. A가 ${answer}개를 주면 둘 다 ${(left+right)/2}개입니다.`
    }))
  },
  extension: {
    title: "추가 학습",
    structureKey: "equalize-by-transfer-source",
    story: "지우는 구슬 35개, 민호는 17개를 가지고 있습니다.",
    prompt: "지우가 민호에게 몇 개를 주면 같아질까요?",
    visual: { kind: "book1", subtype: "equalize-transfer", left: 35, right: 17 },
    answerMode: "input",
    inputMode: "numeric",
    answer: "9",
    explanation: "차이는 35-17=18개이고 그 절반은 9개입니다. 옮기면 둘 다 26개입니다."
  }
};

function completePreferenceLogic(lesson) {
  if (!lesson) return lesson;
  lesson.sourceLocator = "교사용 슬라이드 32, 논리 추리 (1)~(4)";
  lesson.original.mode = "paged";
  lesson.original.sourceQuestionCount = 4;
  const sourceItems = [
    {
      ...lesson.original.items[0], sourceNo: "32-(1)", printGroup: 1, typeLabel: "두 사람의 과일 추리", sourceLocator: "교사용 슬라이드 32 (1)",
      visual: { kind: "book1", subtype: "logic-clues", names: ["A","B"], items: ["사과","딸기"], clues: ["A의 친구인 B는 사과를 좋아합니다."], question: "A가 좋아하는 과일은 무엇입니까?" },
      solution: "B가 사과를 좋아하므로 서로 다른 과일을 좋아하는 A에게는 딸기가 남습니다."
    },
    {
      ...lesson.original.items[1], sourceNo: "32-(2)", printGroup: 2, typeLabel: "세 사람의 운동 추리", sourceLocator: "교사용 슬라이드 32 (2)",
      visual: { kind: "book1", subtype: "logic-clues", names: ["A","B","C"], items: ["축구","수영","스키"], clues: ["A는 겨울에만 할 수 있는 운동을 좋아합니다.", "B는 물을 무서워합니다."], question: "C가 좋아하는 운동은 무엇입니까?" },
      solution: "겨울에만 할 수 있는 운동은 스키이므로 A는 스키입니다. B는 물을 무서워해 수영이 아니므로 축구이고, C에게 수영이 남습니다."
    },
    {
      ...lesson.original.items[2], sourceNo: "32-(3)", printGroup: 3, typeLabel: "세 사람의 과일 추리", sourceLocator: "교사용 슬라이드 32 (3)",
      visual: { kind: "book1", subtype: "logic-clues", names: ["A","B","C"], items: ["키위","멜론","포도"], clues: ["A는 키위와 포도를 싫어합니다.", "C는 포도를 좋아합니다."], question: "B가 좋아하는 과일은 무엇입니까?" },
      solution: "A는 키위와 포도를 싫어하므로 멜론을 좋아합니다. C가 포도를 좋아하므로 남은 키위는 B가 좋아합니다."
    },
    inputItem({
      id: "logic-4", sourceNo: "32-(4)", printGroup: 4, typeLabel: "직업과 동물 추리", sourceLocator: "교사용 슬라이드 32 (4)",
      prompt: "A, B, C는 사자, 고래, 문어 중에서 서로 다른 동물을 좋아합니다. B가 좋아하는 동물을 구하세요.",
      visual: { kind: "book1", subtype: "logic-clues", names: ["A","B","C"], items: ["사자","고래","문어"], clues: ["선생님은 땅에 사는 동물을 좋아합니다.", "A의 직업은 의사이고 C의 직업은 경찰입니다."], question: "B가 좋아하는 동물은 무엇입니까?" },
      conditions: ["선생님은 땅에 사는 동물을 좋아합니다.", "A의 직업은 의사이고 C의 직업은 경찰입니다."],
      answer: "사자", inputMode: "text",
      solution: "A는 의사이고 C는 경찰이므로 남은 B의 직업은 선생님입니다. 선생님은 땅에 사는 동물을 좋아하고, 보기 중 땅에 사는 동물은 사자이므로 B는 사자를 좋아합니다."
    })
  ];
  lesson.original.items = sourceItems;
  delete lesson.sourceHold;
  return lesson;
}

export const BOOK01_GOLDEN_BELL_SOURCE_PAGES = Object.freeze([
  { pages: [2], lessonId: "clock-turning", status: "implemented" },
  { pages: [3], lessonId: "mirror-reflection", status: "implemented" },
  { pages: [4,5,6,7,8], lessonId: "digital-turn-flip", status: "implemented" },
  { pages: [10,11,12,13], lessonId: "fold-one-cut", status: "partial" },
  { pages: [14,15,16,17], lessonId: "fold-two-cut", status: "pending" },
  { pages: [20], lessonId: "equal-line-sums", status: "implemented" },
  { pages: [21,22,23], lessonId: "equal-line-placement", status: "implemented" },
  { pages: [24,25,26], lessonId: "gakuro-sum-grid", status: "implemented" },
  { pages: [28,29,30,31], lessonId: "number-inference", status: "implemented" },
  { pages: [32], lessonId: "preference-logic", status: "implemented" },
  { pages: [33], lessonId: "relative-order-running", status: "implemented" },
  { pages: [34], lessonId: "book1-equalize-transfer", status: "implemented" }
]);

export function expandBookOneGoldenBell(book) {
  if (!book || book.id !== "book-01") return book;
  const current = new Map(book.lessons.map((lesson) => [lesson.id, lesson]));
  const preferenceLogic = completePreferenceLogic(current.get("preference-logic"));
  book.lessons = [
    current.get("clock-turning"),
    mirrorLesson,
    digitalLesson,
    current.get("fold-one-cut"),
    current.get("equal-line-sums"),
    equalLinePlacementLesson,
    gakuroLesson,
    numberInferenceLesson,
    preferenceLogic,
    orderLogicLesson,
    equalizeTransferLesson
  ];
  const perSheet = new Map([
    ["mirror-reflection", 1],
    ["digital-turn-flip", 2],
    ["equal-line-placement", 1],
    ["gakuro-sum-grid", 1],
    ["number-inference", 2],
    ["relative-order-running", 2],
    ["preference-logic", 1],
    ["book1-equalize-transfer", 2]
  ]);
  for (const lesson of book.lessons) {
    const size = perSheet.get(lesson.id);
    if (!size || lesson.original.mode !== "paged") continue;
    lesson.original.items.forEach((item, index) => { item.printGroup = Math.floor(index / size) + 1; });
  }
  book.sourceCoverage = BOOK01_GOLDEN_BELL_SOURCE_PAGES;
  book.source.note = "교사용 정답본 34장을 문항 단위로 대조 중. 구현 문항은 출처·공식 답·풀이를 잠그고, 접기·원형진의 미완료 페이지는 공개 완료로 세지 않음";
  return book;
}
