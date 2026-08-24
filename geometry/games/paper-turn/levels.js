export const levelMeta = [
  {
    id: 1,
    color: "#57bba6",
    title: { ko: "접힌 종이 뒤집기", zh: "翻转折纸", ja: "おった紙を うらがえす", en: "Flip the Folded Paper" },
    description: { ko: "접힌 종이를 뒤집은 뒤의 모양을 찾아요.", zh: "找出折纸翻转后的样子。", ja: "折った紙を裏返した形を探します。", en: "Find the folded paper after it flips." }
  },
  {
    id: 2,
    color: "#ec8c72",
    title: { ko: "자른 선 되짚기", zh: "反推剪切线", ja: "切った線を たどろう", en: "Trace the Cut Back" },
    description: { ko: "펼친 결과를 보고 접힌 종이의 자른 선을 찾아요.", zh: "根据展开结果找出折纸上的剪切线。", ja: "開いた形から、折った紙の切り線を探します。", en: "Use the open result to find the cut on the folded paper." }
  },
  {
    id: 3,
    color: "#59a8da",
    title: { ko: "모양 돌리기", zh: "旋转图形", ja: "形を まわそう", en: "Rotate the Shape" },
    description: { ko: "모눈의 모양을 90도씩 돌려 보아요.", zh: "把网格中的图形旋转90度。", ja: "ます目の形を90度ずつ回します。", en: "Turn the grid shape by 90 degrees." }
  },
  {
    id: 4,
    color: "#8d75c9",
    title: { ko: "모양 뒤집기", zh: "翻转图形", ja: "形を うらがえそう", en: "Mirror the Shape" },
    description: { ko: "가로·세로 거울선에 맞춰 모양을 뒤집어요.", zh: "沿水平或垂直镜线翻转图形。", ja: "横・縦の鏡の線で形を裏返します。", en: "Mirror the shape across a horizontal or vertical line." }
  },
  {
    id: 5,
    color: "#e5b548",
    title: { ko: "순서대로 추적하기", zh: "按顺序追踪", ja: "じゅんばんに たどろう", en: "Follow the Sequence" },
    description: { ko: "돌리기와 뒤집기를 순서대로 따라가요.", zh: "按顺序完成旋转与翻转。", ja: "回転と裏返しを順番に追います。", en: "Follow rotations and flips in order." }
  }
];

const seeds = [
  ["0000", "0110", "0100", "0000"],
  ["0100", "0110", "0010", "0000"],
  ["1100", "0100", "0110", "0000"],
  ["0010", "0110", "0100", "0100"],
  ["0000", "1110", "0010", "0000"],
  ["1000", "1110", "0000", "0000"],
  ["0100", "1100", "0110", "0000"],
  ["0000", "0100", "0111", "0000"],
  ["0010", "1110", "1000", "0000"],
  ["0100", "0111", "0001", "0000"]
];

const clone = (matrix) => matrix.map((row) => [...row]);
const toMatrix = (rows) => rows.map((row) => [...row].map(Number));
const keyOf = (matrix) => matrix.map((row) => row.join("")).join("/");
const rotateCw = (matrix) => matrix[0].map((_, col) => matrix.map((row) => row[col]).reverse());
const rotateCcw = (matrix) => rotateCw(rotateCw(rotateCw(matrix)));
const flipVertical = (matrix) => matrix.map((row) => [...row].reverse());
const flipHorizontal = (matrix) => [...matrix].reverse().map((row) => [...row]);

export const operationMeta = {
  "rotate-cw": { symbol: "↻", ko: "오른쪽으로 돌리기", zh: "向右旋转", ja: "右に回す", en: "Turn right" },
  "rotate-ccw": { symbol: "↺", ko: "왼쪽으로 돌리기", zh: "向左旋转", ja: "左に回す", en: "Turn left" },
  "flip-vertical": { symbol: "↔", ko: "좌우로 뒤집기", zh: "左右翻转", ja: "左右に裏返す", en: "Flip left-right" },
  "flip-horizontal": { symbol: "↕", ko: "위아래로 뒤집기", zh: "上下翻转", ja: "上下に裏返す", en: "Flip up-down" }
};

export function applyOperation(matrix, operation) {
  const source = clone(matrix);
  return ({
    "rotate-cw": rotateCw,
    "rotate-ccw": rotateCcw,
    "flip-vertical": flipVertical,
    "flip-horizontal": flipHorizontal
  })[operation](source);
}

export function applyOperations(matrix, operations) {
  return operations.reduce((current, operation) => applyOperation(current, operation), clone(matrix));
}

const operationSets = {
  1: [
    ["flip-vertical"], ["flip-horizontal"], ["flip-vertical"], ["flip-horizontal"], ["flip-vertical"],
    ["flip-horizontal"], ["flip-vertical"], ["flip-horizontal"], ["flip-vertical"], ["flip-horizontal"]
  ],
  2: [
    ["flip-vertical"], ["flip-horizontal"], ["flip-vertical"], ["flip-horizontal"], ["flip-vertical"],
    ["flip-horizontal"], ["flip-vertical"], ["flip-horizontal"], ["flip-vertical"], ["flip-horizontal"]
  ],
  3: [
    ["rotate-cw"], ["rotate-ccw"], ["rotate-cw"], ["rotate-cw", "rotate-cw"], ["rotate-ccw"],
    ["rotate-cw", "rotate-cw"], ["rotate-cw"], ["rotate-ccw"], ["rotate-cw"], ["rotate-cw", "rotate-cw"]
  ],
  4: [
    ["flip-vertical"], ["flip-horizontal"], ["flip-vertical"], ["flip-horizontal"], ["flip-vertical"],
    ["flip-horizontal"], ["flip-vertical"], ["flip-horizontal"], ["flip-vertical"], ["flip-horizontal"]
  ],
  5: [
    ["rotate-cw", "flip-vertical"],
    ["flip-horizontal", "rotate-cw"],
    ["rotate-ccw", "flip-vertical"],
    ["flip-vertical", "rotate-cw", "flip-horizontal"],
    ["rotate-cw", "rotate-cw", "flip-vertical"],
    ["flip-horizontal", "rotate-ccw", "flip-vertical"],
    ["rotate-cw", "flip-horizontal", "rotate-cw"],
    ["flip-vertical", "rotate-ccw"],
    ["rotate-ccw", "flip-horizontal", "rotate-cw"],
    ["flip-horizontal", "rotate-cw", "flip-vertical"]
  ]
};

function choiceSet(start, operations, index) {
  const correct = applyOperations(start, operations);
  const candidates = [
    correct,
    rotateCw(correct),
    rotateCcw(correct),
    flipVertical(correct),
    flipHorizontal(correct),
    start
  ];
  const unique = [];
  candidates.forEach((matrix) => {
    if (!unique.some((item) => keyOf(item) === keyOf(matrix))) unique.push(matrix);
  });
  const selected = unique.slice(0, 3);
  if (selected.length < 3) throw new Error("Paper-turn needs three unique choices.");
  const answer = index % 3;
  const correctIndex = selected.findIndex((matrix) => keyOf(matrix) === keyOf(correct));
  [selected[answer], selected[correctIndex]] = [selected[correctIndex], selected[answer]];
  return { choices: selected, answer };
}

function buildLevel(level) {
  return {
    ...levelMeta[level - 1],
    problems: seeds.map((rows, index) => {
      const start = toMatrix(rows);
      const operations = operationSets[level][index];
      const choices = choiceSet(start, operations, index);
      return {
        id: `paper-turn-l${level}-${String(index + 1).padStart(2, "0")}`,
        level,
        interaction: level === 2 ? "cut-backtrack" : "transform-choice",
        start,
        operations,
        ...choices
      };
    })
  };
}

export const levels = levelMeta.map((_, index) => buildLevel(index + 1));

export function validateLevels() {
  const ids = new Set();
  if (levels.length !== 5) throw new Error("Paper-turn must contain five levels.");
  levels.forEach((level, levelIndex) => {
    if (level.id !== levelIndex + 1 || level.problems.length !== 10) throw new Error(`Invalid paper-turn level ${level.id}`);
    level.problems.forEach((problem) => {
      if (ids.has(problem.id)) throw new Error(`Duplicate paper-turn problem ${problem.id}`);
      ids.add(problem.id);
      if (problem.choices.length !== 3 || new Set(problem.choices.map(keyOf)).size !== 3) throw new Error(`Ambiguous choices: ${problem.id}`);
      const expected = applyOperations(problem.start, problem.operations);
      if (keyOf(problem.choices[problem.answer]) !== keyOf(expected)) throw new Error(`Wrong answer index: ${problem.id}`);
    });
  });
  return true;
}
