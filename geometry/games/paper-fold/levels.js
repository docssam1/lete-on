export const levelMeta = [
  { id: 1, color: "mint", title: { ko: "반으로 쏙", zh: "对折入门", ja: "はんぶんに おろう", en: "Fold in Half" }, description: { ko: "반짝이는 선을 따라 한 번씩 접어요.", zh: "沿着发光的线一步一步折。", ja: "光る線にそって一回ずつ折ります。", en: "Follow one glowing fold at a time." } },
  { id: 2, color: "sky", title: { ko: "구멍 탐정", zh: "小孔侦探", ja: "あなの たんてい", en: "Hole Detective" }, description: { ko: "접은 종이를 펼쳤을 때 구멍을 찾아요.", zh: "推理纸张展开后的孔。", ja: "ひらいたときの穴を考えます。", en: "Predict the holes after unfolding." } },
  { id: 3, color: "violet", title: { ko: "숫자 접기", zh: "数字折纸", ja: "すうじ おりがみ", en: "Number Folds" }, description: { ko: "겹치거나 잘린 수를 찾아 계산해요.", zh: "找出重叠或被剪掉的数字。", ja: "重なる数や切られた数を考えます。", en: "Track numbers that overlap or are cut away." } },
  { id: 4, color: "coral", title: { ko: "자르고 펼치기", zh: "剪开再展开", ja: "きって ひらこう", en: "Cut & Unfold" }, description: { ko: "가위선을 보고 펼친 모양을 예상해요.", zh: "根据剪线预测展开后的形状。", ja: "切る線から開いた形を予想します。", en: "Predict the shape made by each cut." } },
  { id: 5, color: "gold", title: { ko: "겹침 마스터", zh: "叠放大师", ja: "かさなり マスター", en: "Layer Master" }, description: { ko: "위아래 순서와 여러 접기 규칙을 함께 풀어요.", zh: "综合判断上下顺序与折纸规则。", ja: "上下の順番と折り方を組み合わせます。", en: "Combine layer order with every folding rule." } }
];

const make = (level, index, type, folds, answer, choices, extra = {}) => ({
  id: `paper-l${level}-${String(index).padStart(2, "0")}`,
  level, type, folds, answer: String(answer), choices: choices.map(String), ...extra
});

export const levels = [
  {
    ...levelMeta[0],
    problems: [
      make(1, 1, "hole", ["left"], 2, [1, 2, 4], { punches: 1 }),
      make(1, 2, "hole", ["up"], 2, [2, 3, 4], { punches: 1 }),
      make(1, 3, "hole", ["right", "down"], 4, [2, 4, 6], { punches: 1 }),
      make(1, 4, "top", ["left", "up"], 3, [1, 2, 3], { numbers: [1, 2, 3, 4] }),
      make(1, 5, "hole", ["down", "right"], 8, [4, 6, 8], { punches: 2 })
    ]
  },
  {
    ...levelMeta[1],
    problems: [
      make(2, 1, "hole", ["diag-main"], 2, [2, 3, 4], { punches: 1 }),
      make(2, 2, "hole", ["diag-anti", "left"], 4, [2, 4, 8], { punches: 1 }),
      make(2, 3, "punch", ["left", "up"], 8, [4, 6, 8], { punches: 2 }),
      make(2, 4, "hole", ["diag-main", "down"], 8, [4, 8, 12], { punches: 2 }),
      make(2, 5, "punch", ["right", "diag-anti"], 4, [4, 6, 8], { punches: 1 })
    ]
  },
  {
    ...levelMeta[2],
    problems: [
      make(3, 1, "number-remain", ["left", "up"], 12, [8, 10, 12], { numbers: [2, 4, 3, 5], removed: [0] }),
      make(3, 2, "number-cut", ["right", "down"], 7, [7, 9, 11], { numbers: [1, 3, 4, 5], removed: [1, 2] }),
      make(3, 3, "number-remain", ["diag-main"], 15, [12, 15, 18], { numbers: [6, 2, 5, 4], removed: [1] }),
      make(3, 4, "top", ["left", "down", "right"], 7, [5, 6, 7], { numbers: [7, 2, 4, 6] }),
      make(3, 5, "number-cut", ["diag-anti", "up"], 11, [9, 11, 13], { numbers: [5, 3, 6, 2], removed: [0, 2] })
    ]
  },
  {
    ...levelMeta[3],
    problems: [
      make(4, 1, "cut", ["left"], 2, [2, 3, 4], { cuts: 1 }),
      make(4, 2, "cut", ["left", "up"], 4, [3, 4, 6], { cuts: 1 }),
      make(4, 3, "cut", ["diag-main", "right"], 6, [4, 6, 8], { cuts: 2 }),
      make(4, 4, "shape", ["down", "left"], "B", ["A", "B", "C"], { cuts: 1 }),
      make(4, 5, "shape", ["diag-anti", "up", "right"], "C", ["A", "B", "C"], { cuts: 2 })
    ]
  },
  {
    ...levelMeta[4],
    problems: [
      make(5, 1, "stack-bottom", [], "C", ["A", "B", "C"], { layers: ["A", "B", "C"] }),
      make(5, 2, "stack-order", [], "B-A-C", ["A-B-C", "B-A-C", "C-B-A"], { layers: ["B", "A", "C"] }),
      make(5, 3, "hole", ["diag-main", "left", "up"], 8, [6, 8, 12], { punches: 1 }),
      make(5, 4, "number-remain", ["right", "down"], 18, [15, 18, 21], { numbers: [8, 5, 6, 4], removed: [1] }),
      make(5, 5, "cut", ["diag-anti", "right", "up"], 8, [6, 8, 10], { cuts: 2 })
    ]
  }
];

export function validateLevels() {
  const ids = new Set();
  levels.forEach((level, index) => {
    if (level.id !== index + 1 || level.problems.length !== 5) throw new Error(`Invalid paper-fold level ${level.id}`);
    level.problems.forEach((problem) => {
      if (ids.has(problem.id)) throw new Error(`Duplicate paper-fold problem ${problem.id}`);
      ids.add(problem.id);
      if (!problem.choices.includes(problem.answer)) throw new Error(`Answer missing from choices: ${problem.id}`);
    });
  });
}
