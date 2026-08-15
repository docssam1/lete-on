export const levelMeta = [
  {
    id: 1,
    color: "mint",
    title: { ko: "반으로 쏙", zh: "对折入门", ja: "はんぶんに おろう", en: "Fold in Half" },
    description: {
      ko: "한 번 접은 색종이의 펼친 모양을 찾아요.",
      zh: "找出一次对折后展开的图形。",
      ja: "一回折って開いた形を見つけます。",
      en: "Find the shape after one fold opens."
    }
  },
  {
    id: 2,
    color: "sky",
    title: { ko: "대각선 한 번 접기", zh: "对角线折叠", ja: "ななめに おろう", en: "Diagonal Fold" },
    description: {
      ko: "대각선으로 접은 뒤 펼친 모양을 찾아요.",
      zh: "找出沿对角线折叠后展开的图形。",
      ja: "斜めに折って開いた形を見つけます。",
      en: "Find the reflection after one diagonal fold."
    }
  },
  {
    id: 3,
    color: "violet",
    title: { ko: "작업 위치 찾기", zh: "找到位置", ja: "ばしょを さがそう", en: "Find the Place" },
    description: {
      ko: "자르거나 구멍 뚫을 모눈 위치를 찾아요.",
      zh: "找出剪切或打孔的网格位置。",
      ja: "切る場所や穴の位置を見つけます。",
      en: "Find where to cut or punch on the grid."
    }
  },
  {
    id: 4,
    color: "coral",
    title: { ko: "대칭 도형 놓기", zh: "放置对称图形", ja: "たいしょうを おこう", en: "Place the Shapes" },
    description: {
      ko: "대칭이 되는 도형을 끌어 놓아요.",
      zh: "拖动并放置对称图形。",
      ja: "対称になる形を置きます。",
      en: "Drag reflected shapes into place."
    }
  },
  {
    id: 5,
    color: "gold",
    title: { ko: "잘려 나간 수 더하기", zh: "剪去数字相加", ja: "きった かずを たそう", en: "Cut-away Sum" },
    description: {
      ko: "잘린 위치를 찾고 그 수를 더해요.",
      zh: "找出剪去的位置并把数字相加。",
      ja: "切り取った場所を見つけて数を足します。",
      en: "Find the cut-away cells, then add the numbers."
    }
  }
];

const id = (level, index) => `paper-l${level}-${String(index).padStart(2, "0")}`;
const cells = (values) => values.flatMap((row, r) => row.map((value, c) => ({ id: `r${r + 1}c${c + 1}`, value })));
const grid = (values) => ({ size: 4, values });

const result = (key, marks) => ({ key, marks });
const choice = (key, marks) => ({ key, result: result(key, marks) });

export const levels = [
  {
    ...levelMeta[0],
    problems: [
      { id: id(1, 1), level: 1, interaction: "result-choice", fold: { axis: "vertical", side: "left", target: "right" }, action: { type: "punch", point: [0.72, 0.3] }, choices: [choice("a", [[0.28, 0.3], [0.72, 0.3]]), choice("b", [[0.72, 0.3], [0.72, 0.7]])], answer: "a" },
      { id: id(1, 2), level: 1, interaction: "result-choice", fold: { axis: "horizontal", side: "bottom", target: "top" }, action: { type: "cut", point: [0.32, 0.28] }, choices: [choice("a", [[0.32, 0.28], [0.32, 0.72]]), choice("b", [[0.32, 0.28], [0.68, 0.28]])], answer: "a" },
      { id: id(1, 3), level: 1, interaction: "result-choice", fold: { axis: "vertical", side: "right", target: "left" }, action: { type: "punch", point: [0.24, 0.64] }, choices: [choice("a", [[0.24, 0.64], [0.76, 0.64]]), choice("b", [[0.24, 0.36], [0.76, 0.64]])], answer: "a" },
      { id: id(1, 4), level: 1, interaction: "result-choice", fold: { axis: "horizontal", side: "top", target: "bottom" }, action: { type: "cut", point: [0.68, 0.7] }, choices: [choice("a", [[0.32, 0.7], [0.68, 0.7]]), choice("b", [[0.68, 0.3], [0.68, 0.7]])], answer: "b" },
      { id: id(1, 5), level: 1, interaction: "result-choice", fold: { axis: "vertical", side: "left", target: "right" }, action: { type: "punch", point: [0.62, 0.5] }, choices: [choice("a", [[0.38, 0.5], [0.62, 0.5]]), choice("b", [[0.38, 0.35], [0.62, 0.65]])], answer: "a" },
      { id: id(1, 6), level: 1, interaction: "result-choice", fold: { axis: "vertical", side: "right", target: "left" }, action: { type: "punch", point: [0.3, 0.22] }, choices: [choice("a", [[0.3, 0.22], [0.7, 0.78]]), choice("b", [[0.3, 0.22], [0.7, 0.22]])], answer: "b" },
      { id: id(1, 7), level: 1, interaction: "result-choice", fold: { axis: "horizontal", side: "top", target: "bottom" }, action: { type: "cut", point: [0.76, 0.65] }, choices: [choice("a", [[0.24, 0.35], [0.76, 0.65]]), choice("b", [[0.76, 0.35], [0.76, 0.65]])], answer: "b" },
      { id: id(1, 8), level: 1, interaction: "result-choice", fold: { axis: "vertical", side: "left", target: "right" }, action: { type: "punch", point: [0.67, 0.72] }, choices: [choice("a", [[0.33, 0.72], [0.67, 0.72]]), choice("b", [[0.33, 0.28], [0.67, 0.72]])], answer: "a" },
      { id: id(1, 9), level: 1, interaction: "result-choice", fold: { axis: "horizontal", side: "bottom", target: "top" }, action: { type: "cut", point: [0.55, 0.22] }, choices: [choice("a", [[0.45, 0.22], [0.55, 0.78]]), choice("b", [[0.55, 0.22], [0.55, 0.78]])], answer: "b" },
      { id: id(1, 10), level: 1, interaction: "result-choice", fold: { axis: "vertical", side: "right", target: "left" }, action: { type: "cut", point: [0.18, 0.45] }, choices: [choice("a", [[0.18, 0.45], [0.82, 0.45]]), choice("b", [[0.18, 0.45], [0.82, 0.55]])], answer: "a" }
    ]
  },
  {
    ...levelMeta[1],
    problems: [
      { id: id(2, 1), level: 2, interaction: "result-choice", fold: { axis: "diag-main", side: "upper", target: "lower" }, action: { type: "punch", point: [0.72, 0.34] }, choices: [choice("a", [[0.72, 0.34], [0.34, 0.72]]), choice("b", [[0.72, 0.34], [0.28, 0.66]])], answer: "a" },
      { id: id(2, 2), level: 2, interaction: "match", fold: { axis: "diag-anti", side: "upper", target: "lower" }, action: { type: "cut", point: [0.65, 0.3] }, choices: [choice("a", [[0.65, 0.3], [0.3, 0.65]]), choice("b", [[0.65, 0.3], [0.7, 0.35]])], answer: "b" },
      { id: id(2, 3), level: 2, interaction: "result-choice", fold: { axis: "diag-anti", side: "upper", target: "lower" }, action: { type: "punch", point: [0.7, 0.64] }, choices: [choice("a", [[0.7, 0.64], [0.36, 0.3]]), choice("b", [[0.7, 0.64], [0.3, 0.36]])], answer: "a" },
      { id: id(2, 4), level: 2, interaction: "match", fold: { axis: "diag-main", side: "lower", target: "upper" }, action: { type: "punch", point: [0.26, 0.64] }, choices: [choice("a", [[0.26, 0.64], [0.74, 0.36]]), choice("b", [[0.26, 0.64], [0.64, 0.26]])], answer: "b" },
      { id: id(2, 5), level: 2, interaction: "result-choice", fold: { axis: "diag-anti", side: "lower", target: "upper" }, action: { type: "cut", point: [0.38, 0.25] }, choices: [choice("a", [[0.38, 0.25], [0.75, 0.62]]), choice("b", [[0.38, 0.25], [0.62, 0.75]])], answer: "a" },
      { id: id(2, 6), level: 2, interaction: "result-choice", fold: { axis: "diag-main", side: "upper", target: "lower" }, action: { type: "punch", point: [0.8, 0.42] }, choices: [choice("a", [[0.8, 0.42], [0.58, 0.2]]), choice("b", [[0.8, 0.42], [0.42, 0.8]])], answer: "b" },
      { id: id(2, 7), level: 2, interaction: "match", fold: { axis: "diag-anti", side: "lower", target: "upper" }, action: { type: "cut", point: [0.72, 0.52] }, choices: [choice("a", [[0.72, 0.52], [0.48, 0.28]]), choice("b", [[0.72, 0.52], [0.52, 0.72]])], answer: "a" },
      { id: id(2, 8), level: 2, interaction: "result-choice", fold: { axis: "diag-main", side: "lower", target: "upper" }, action: { type: "punch", point: [0.2, 0.68] }, choices: [choice("a", [[0.2, 0.68], [0.8, 0.32]]), choice("b", [[0.2, 0.68], [0.68, 0.2]])], answer: "b" },
      { id: id(2, 9), level: 2, interaction: "match", fold: { axis: "diag-anti", side: "upper", target: "lower" }, action: { type: "cut", point: [0.26, 0.55] }, choices: [choice("a", [[0.26, 0.55], [0.45, 0.74]]), choice("b", [[0.26, 0.55], [0.55, 0.26]])], answer: "a" },
      { id: id(2, 10), level: 2, interaction: "result-choice", fold: { axis: "diag-main", side: "upper", target: "lower" }, action: { type: "punch", point: [0.63, 0.18] }, choices: [choice("a", [[0.63, 0.18], [0.37, 0.82]]), choice("b", [[0.63, 0.18], [0.18, 0.63]])], answer: "b" }
    ]
  },
  {
    ...levelMeta[2],
    problems: [
      { id: id(3, 1), level: 3, interaction: "grid-select", fold: { axis: "vertical", side: "left", target: "right" }, action: { type: "cut" }, sourceRegions: ["r1c4"], targetRegions: ["r1c1", "r1c4"] },
      { id: id(3, 2), level: 3, interaction: "punch-select", fold: { axis: "horizontal", side: "bottom", target: "top" }, action: { type: "punch" }, sourceRegions: ["r2c3"], targetRegions: ["r2c3", "r3c3"] },
      { id: id(3, 3), level: 3, interaction: "grid-select", fold: { axis: "diag-main", side: "upper", target: "lower" }, action: { type: "cut" }, sourceRegions: ["r1c3-se"], targetRegions: ["r1c3-se", "r3c1-se"] },
      { id: id(3, 4), level: 3, interaction: "punch-select", fold: { axis: "diag-anti", side: "upper", target: "lower" }, action: { type: "punch" }, sourceRegions: ["r1c2-sw"], targetRegions: ["r1c2-sw", "r3c4-sw"] },
      { id: id(3, 5), level: 3, interaction: "grid-select", fold: { axis: "vertical", side: "right", target: "left" }, action: { type: "cut" }, sourceRegions: ["r2c1", "r4c1"], targetRegions: ["r2c1", "r2c4", "r4c1", "r4c4"] },
      { id: id(3, 6), level: 3, interaction: "punch-select", fold: { axis: "vertical", side: "left", target: "right" }, action: { type: "punch" }, sourceRegions: ["r2c4", "r4c3"], targetRegions: ["r2c1", "r2c4", "r4c2", "r4c3"] },
      { id: id(3, 7), level: 3, interaction: "grid-select", fold: { axis: "horizontal", side: "top", target: "bottom" }, action: { type: "cut" }, sourceRegions: ["r1c2", "r2c4"], targetRegions: ["r1c2", "r2c4", "r3c4", "r4c2"] },
      { id: id(3, 8), level: 3, interaction: "punch-select", fold: { axis: "diag-main", side: "upper", target: "lower" }, action: { type: "punch" }, sourceRegions: ["r1c4-ne"], targetRegions: ["r1c4-ne", "r4c1-sw"] },
      { id: id(3, 9), level: 3, interaction: "grid-select", fold: { axis: "diag-anti", side: "upper", target: "lower" }, action: { type: "cut" }, sourceRegions: ["r1c3-se"], targetRegions: ["r1c3-se", "r2c4-nw"] },
      { id: id(3, 10), level: 3, interaction: "grid-select", fold: { axis: "diag-main", side: "upper", target: "lower" }, action: { type: "cut" }, sourceRegions: ["r2c4", "r3c4"], targetRegions: ["r2c4", "r3c4", "r4c2", "r4c3"] }
    ]
  },
  {
    ...levelMeta[3],
    problems: [
      { id: id(4, 1), level: 4, interaction: "shape-place", fold: { axis: "vertical", side: "left", target: "right" }, family: "triangle", tray: ["triangle"], givens: [{ shape: "triangle", x: .75, y: .3, rotation: 0, flipped: false }], targets: [{ shape: "triangle", x: .25, y: .3, rotation: 0, flipped: true }] },
      { id: id(4, 2), level: 4, interaction: "shape-place", fold: { axis: "horizontal", side: "bottom", target: "top" }, family: "triangle", tray: ["triangle", "triangle"], givens: [{ shape: "triangle", x: .32, y: .75, rotation: 270, flipped: true }, { shape: "triangle", x: .7, y: .75, rotation: 90, flipped: false }], targets: [{ shape: "triangle", x: .32, y: .25, rotation: 270, flipped: false }, { shape: "triangle", x: .7, y: .25, rotation: 90, flipped: true }] },
      { id: id(4, 3), level: 4, interaction: "shape-place", fold: { axis: "diag-main", side: "upper", target: "lower" }, family: "right-triangle", tray: ["right-triangle", "right-triangle"], givens: [{ shape: "right-triangle", x: .72, y: .2, rotation: 90, flipped: false }, { shape: "right-triangle", x: .75, y: .48, rotation: 0, flipped: false }], targets: [{ shape: "right-triangle", x: .2, y: .72, rotation: 180, flipped: true }, { shape: "right-triangle", x: .48, y: .75, rotation: 270, flipped: true }] },
      { id: id(4, 4), level: 4, interaction: "shape-place", fold: { axis: "vertical", side: "right", target: "left" }, family: "square", tray: ["square", "square", "square"], givens: [{ shape: "square", x: .76, y: .28, rotation: 0, flipped: false }, { shape: "square", x: .76, y: .7, rotation: 0, flipped: false }, { shape: "square", x: .7, y: .5, rotation: 0, flipped: false }], targets: [{ shape: "square", x: .24, y: .28, rotation: 0, flipped: false }, { shape: "square", x: .24, y: .7, rotation: 0, flipped: false }, { shape: "square", x: .3, y: .5, rotation: 0, flipped: false }] },
      { id: id(4, 5), level: 4, interaction: "shape-place", fold: { axis: "diag-anti", side: "upper", target: "lower" }, family: "right-triangle", tray: ["right-triangle", "right-triangle", "right-triangle"], givens: [{ shape: "right-triangle", x: .2, y: .2, rotation: 0, flipped: false }, { shape: "right-triangle", x: .25, y: .5, rotation: 90, flipped: false }, { shape: "right-triangle", x: .5, y: .25, rotation: 0, flipped: false }], targets: [{ shape: "right-triangle", x: .8, y: .8, rotation: 90, flipped: true }, { shape: "right-triangle", x: .5, y: .75, rotation: 0, flipped: true }, { shape: "right-triangle", x: .75, y: .5, rotation: 90, flipped: true }] },
      { id: id(4, 6), level: 4, interaction: "shape-place", fold: { axis: "vertical", side: "left", target: "right" }, family: "circle", tray: ["circle", "circle"], givens: [{ shape: "circle", x: .72, y: .3, rotation: 0, flipped: false }, { shape: "circle", x: .78, y: .68, rotation: 0, flipped: false }], targets: [{ shape: "circle", x: .28, y: .3, rotation: 0, flipped: false }, { shape: "circle", x: .22, y: .68, rotation: 0, flipped: false }] },
      { id: id(4, 7), level: 4, interaction: "shape-place", fold: { axis: "horizontal", side: "top", target: "bottom" }, family: "triangle", tray: ["triangle"], givens: [{ shape: "triangle", x: .42, y: .24, rotation: 0, flipped: false }], targets: [{ shape: "triangle", x: .42, y: .76, rotation: 180, flipped: true }] },
      { id: id(4, 8), level: 4, interaction: "shape-place", fold: { axis: "diag-main", side: "lower", target: "upper" }, family: "square", tray: ["square", "square"], givens: [{ shape: "square", x: .24, y: .7, rotation: 0, flipped: false }, { shape: "square", x: .46, y: .78, rotation: 0, flipped: false }], targets: [{ shape: "square", x: .7, y: .24, rotation: 0, flipped: false }, { shape: "square", x: .78, y: .46, rotation: 0, flipped: false }] },
      { id: id(4, 9), level: 4, interaction: "shape-place", fold: { axis: "vertical", side: "right", target: "left" }, family: "right-triangle", tray: ["right-triangle", "right-triangle"], givens: [{ shape: "right-triangle", x: .76, y: .28, rotation: 180, flipped: false }, { shape: "right-triangle", x: .7, y: .7, rotation: 270, flipped: true }], targets: [{ shape: "right-triangle", x: .24, y: .28, rotation: 180, flipped: true }, { shape: "right-triangle", x: .3, y: .7, rotation: 90, flipped: false }] },
      { id: id(4, 10), level: 4, interaction: "shape-place", fold: { axis: "diag-anti", side: "lower", target: "upper" }, family: "triangle", tray: ["triangle", "triangle"], givens: [{ shape: "triangle", x: .22, y: .58, rotation: 270, flipped: false }, { shape: "triangle", x: .38, y: .8, rotation: 0, flipped: true }], targets: [{ shape: "triangle", x: .42, y: .78, rotation: 180, flipped: true }, { shape: "triangle", x: .2, y: .62, rotation: 90, flipped: false }] }
    ]
  },
  {
    ...levelMeta[4],
    problems: [
      { id: id(5, 1), level: 5, interaction: "cut-number-sum", fold: { axis: "vertical", side: "left", target: "right" }, grid: grid([[1, 3, 4, 2], [8, 6, 7, 5], [4, 1, 2, 3], [6, 5, 7, 8]]), cutRegions: ["r1c1", "r3c1"], answer: { cells: ["r1c1", "r3c1", "r1c4", "r3c4"], values: [1, 4, 2, 3], expression: "1 + 4 + 2 + 3", sum: 10 } },
      { id: id(5, 2), level: 5, interaction: "cut-number-sum", fold: { axis: "horizontal", side: "bottom", target: "top" }, grid: grid([[2, 5, 1, 4], [7, 3, 8, 6], [1, 4, 2, 9], [5, 6, 3, 7]]), cutRegions: ["r1c2", "r2c4"], answer: { cells: ["r1c2", "r2c4", "r4c2", "r3c4"], values: [5, 6, 6, 9], expression: "5 + 6 + 6 + 9", sum: 26 } },
      { id: id(5, 3), level: 5, interaction: "cut-number-sum", fold: { axis: "vertical", side: "right", target: "left" }, grid: grid([[3, 7, 2, 6], [4, 1, 5, 8], [9, 2, 4, 3], [6, 8, 1, 7]]), cutRegions: ["r2c4", "r4c4"], answer: { cells: ["r2c4", "r4c4", "r2c1", "r4c1"], values: [8, 7, 4, 6], expression: "8 + 7 + 4 + 6", sum: 25 } },
      { id: id(5, 4), level: 5, interaction: "cut-number-sum", fold: { axis: "diag-main", side: "upper", target: "lower" }, grid: grid([[1, 8, 3, 4], [2, 6, 7, 5], [9, 3, 2, 1], [4, 5, 6, 8]]), cutRegions: ["r1c3", "r2c4"], answer: { cells: ["r1c3", "r2c4", "r3c1", "r4c2"], values: [3, 5, 9, 5], expression: "3 + 5 + 9 + 5", sum: 22 } },
      { id: id(5, 5), level: 5, interaction: "cut-number-sum", fold: { axis: "diag-anti", side: "upper", target: "lower" }, grid: grid([[8, 2, 4, 1], [3, 7, 5, 6], [2, 4, 9, 3], [5, 1, 6, 8]]), cutRegions: ["r1c2", "r2c1"], answer: { cells: ["r1c2", "r2c1", "r3c4", "r4c3"], values: [2, 3, 3, 6], expression: "2 + 3 + 3 + 6", sum: 14 } },
      { id: id(5, 6), level: 5, interaction: "cut-number-sum", fold: { axis: "vertical", side: "left", target: "right" }, grid: grid([[4, 1, 7, 2], [6, 3, 5, 8], [2, 9, 4, 1], [7, 5, 6, 3]]), cutRegions: ["r2c1", "r4c2"], answer: { cells: ["r2c1", "r4c2", "r2c4", "r4c3"], values: [6, 5, 8, 6], expression: "6 + 5 + 8 + 6", sum: 25 } },
      { id: id(5, 7), level: 5, interaction: "cut-number-sum", fold: { axis: "horizontal", side: "top", target: "bottom" }, grid: grid([[7, 2, 6, 3], [1, 8, 4, 5], [9, 3, 2, 7], [4, 6, 5, 1]]), cutRegions: ["r1c1", "r2c3"], answer: { cells: ["r1c1", "r2c3", "r4c1", "r3c3"], values: [7, 4, 4, 2], expression: "7 + 4 + 4 + 2", sum: 17 } },
      { id: id(5, 8), level: 5, interaction: "cut-number-sum", fold: { axis: "vertical", side: "right", target: "left" }, grid: grid([[5, 9, 1, 4], [2, 7, 6, 3], [8, 4, 5, 1], [3, 6, 2, 7]]), cutRegions: ["r1c4", "r3c3", "r4c4"], answer: { cells: ["r1c4", "r3c3", "r4c4", "r1c1", "r3c2", "r4c1"], values: [4, 5, 7, 5, 4, 3], expression: "4 + 5 + 7 + 5 + 4 + 3", sum: 28 } },
      { id: id(5, 9), level: 5, interaction: "cut-number-sum", fold: { axis: "diag-main", side: "upper", target: "lower" }, grid: grid([[2, 6, 8, 1], [5, 3, 7, 4], [9, 1, 6, 2], [4, 8, 3, 5]]), cutRegions: ["r1c3", "r2c4"], answer: { cells: ["r1c3", "r2c4", "r3c1", "r4c2"], values: [8, 4, 9, 8], expression: "8 + 4 + 9 + 8", sum: 29 } },
      { id: id(5, 10), level: 5, interaction: "cut-number-sum", fold: { axis: "diag-anti", side: "lower", target: "upper" }, grid: grid([[6, 4, 2, 9], [1, 8, 5, 3], [7, 2, 6, 4], [3, 5, 1, 8]]), cutRegions: ["r1c2", "r2c1"], answer: { cells: ["r1c2", "r2c1", "r3c4", "r4c3"], values: [4, 1, 4, 1], expression: "4 + 1 + 4 + 1", sum: 10 } }
    ]
  }
];

const regionPattern = /^r[1-4]c[1-4](?:-(?:ne|nw|se|sw))?$/;
const baseCellId = (region) => region.replace(/-(?:ne|nw|se|sw)$/, "");
const isUniqueRegionList = (regions) => Array.isArray(regions) && regions.length > 0 && new Set(regions).size === regions.length && regions.every((region) => regionPattern.test(region));
const reflectPoint = ([x, y], axis) => ({
  vertical: [1 - x, y], horizontal: [x, 1 - y],
  "diag-main": [y, x], "diag-anti": [1 - y, 1 - x]
})[axis];
const triangleReflection = {
  vertical: { nw: "ne", ne: "nw", sw: "se", se: "sw" },
  horizontal: { nw: "sw", sw: "nw", ne: "se", se: "ne" },
  "diag-main": { nw: "nw", ne: "sw", sw: "ne", se: "se" },
  "diag-anti": { nw: "se", ne: "ne", sw: "sw", se: "nw" }
};
const reflectRegion = (region, axis) => {
  const [, rowText, colText, part] = /^r([1-4])c([1-4])(?:-(ne|nw|se|sw))?$/.exec(region) || [];
  if (!rowText) return region;
  const row = Number(rowText), col = Number(colText);
  const [nextRow, nextCol] = ({
    vertical: [row, 5 - col], horizontal: [5 - row, col],
    "diag-main": [col, row], "diag-anti": [5 - col, 5 - row]
  })[axis];
  return `r${nextRow}c${nextCol}${part ? `-${triangleReflection[axis][part]}` : ""}`;
};
const equalRegionSets = (actual, expected) => actual.length === expected.length && expected.every((region) => actual.includes(region));
const pointsMatch = (actual, expected) => actual.length === expected.length && expected.every(([x, y]) => actual.some(([ax, ay]) => Math.abs(ax - x) < 1e-8 && Math.abs(ay - y) < 1e-8));
const reflectedOrientation = (rotation, flipped, axis) => {
  const maps = {
    vertical: { 0: 0, 90: 270, 180: 180, 270: 90 },
    horizontal: { 0: 180, 90: 90, 180: 0, 270: 270 },
    "diag-main": { 0: 270, 90: 180, 180: 90, 270: 0 },
    "diag-anti": { 0: 90, 90: 0, 180: 270, 270: 180 }
  };
  return { rotation: maps[axis][rotation], flipped: !flipped };
};

export function validateLevels() {
  const ids = new Set();
  if (levels.length !== 5) throw new Error("Paper-fold must contain five levels.");
  levels.forEach((level, index) => {
    if (level.id !== index + 1 || level.problems.length !== 10) throw new Error(`Invalid paper-fold level ${level.id}`);
    level.problems.forEach((problem) => {
      if (ids.has(problem.id)) throw new Error(`Duplicate paper-fold problem ${problem.id}`);
      ids.add(problem.id);
      if (!problem.fold?.axis || !problem.action && problem.interaction !== "shape-place" && problem.interaction !== "cut-number-sum") throw new Error(`Missing fold/action: ${problem.id}`);
      if (["result-choice", "match"].includes(problem.interaction)) {
        const answerChoice = problem.choices.find((item) => item.key === problem.answer);
        const expectedMarks = [problem.action.point, reflectPoint(problem.action.point, problem.fold.axis)];
        if (problem.choices.length !== 2 || new Set(problem.choices.map((item) => JSON.stringify(item.result.marks))).size !== 2 || !answerChoice || !pointsMatch(answerChoice.result.marks, expectedMarks)) throw new Error(`Ambiguous result choices: ${problem.id}`);
      }
      if (["grid-select", "punch-select"].includes(problem.interaction)) {
        const expectedRegions = [...new Set(problem.sourceRegions.flatMap((region) => [region, reflectRegion(region, problem.fold.axis)]))];
        if (!isUniqueRegionList(problem.targetRegions) || !isUniqueRegionList(problem.sourceRegions) || !equalRegionSets(problem.targetRegions, expectedRegions)) throw new Error(`Invalid target regions: ${problem.id}`);
      }
      if (problem.interaction === "shape-place") {
        const validPiece = (item) => item.shape === problem.family && item.x > 0 && item.x < 1 && item.y > 0 && item.y < 1;
        const reflectedPieces = problem.givens?.map((item) => {
          const [x, y] = reflectPoint([item.x, item.y], problem.fold.axis);
          const orientation = ["circle", "square"].includes(item.shape) ? { rotation: 0, flipped: false } : reflectedOrientation(item.rotation, item.flipped, problem.fold.axis);
          return { ...item, x, y, ...orientation };
        });
        const piecesMatch = reflectedPieces?.every((expected) => problem.targets.some((item) => item.shape === expected.shape && Math.abs(item.x - expected.x) < 1e-8 && Math.abs(item.y - expected.y) < 1e-8 && item.rotation === expected.rotation && item.flipped === expected.flipped));
        if (!problem.targets?.length || problem.targets.length > 3 || problem.targets.length !== problem.tray.length || problem.givens?.length !== problem.targets.length || !problem.targets.every(validPiece) || !problem.givens.every(validPiece) || !piecesMatch) throw new Error(`Invalid shape placement: ${problem.id}`);
      }
      if (problem.interaction === "cut-number-sum") {
        const available = cells(problem.grid.values);
        const answer = problem.answer;
        const expectedValues = answer.cells?.map((region) => available.find((item) => item.id === baseCellId(region))?.value);
        const expectedExpression = expectedValues?.join(" + ");
        if (
          problem.grid.size !== 4 ||
          available.length !== 16 ||
          !isUniqueRegionList(problem.cutRegions) ||
          !isUniqueRegionList(answer.cells) ||
          !equalRegionSets(answer.cells, [...new Set(problem.cutRegions.flatMap((region) => [region, reflectRegion(region, problem.fold.axis)]))]) ||
          !expectedValues?.every(Number.isFinite) ||
          answer.values.join(",") !== expectedValues.join(",") ||
          answer.expression !== expectedExpression ||
          answer.sum !== expectedValues.reduce((sum, value) => sum + value, 0)
        ) throw new Error(`Invalid cut-number sum: ${problem.id}`);
      }
    });
  });
  return true;
}
