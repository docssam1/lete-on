const SOURCE_QUESTIONS = new Set([1, 2, 22]);

function shuffled(list) {
  const result = [...list];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(Math.random() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

function distinctValues(difficulty, count) {
  const bounds = difficulty === 1 ? [1, 7] : difficulty === 3 ? [3, 12] : [2, 9];
  return shuffled(Array.from({ length: bounds[1] - bounds[0] + 1 }, (_, index) => bounds[0] + index)).slice(0, count);
}

function matrixProblem01(difficulty) {
  const [diamond, square, triangle, circle] = distinctValues(difficulty, 4);
  const cells = [
    ["diamond", "square", "triangle"],
    ["square", "square", "diamond"],
    ["triangle", "square", "circle"]
  ];
  const rowSums = [diamond + square + triangle, square * 2 + diamond, triangle + square + circle];
  const columnSums = [diamond + square + triangle, square * 3, null];
  const answer = triangle + diamond + circle;
  return {
    prompt: "같은 모양은 같은 수를 나타냅니다. 가로줄과 세로줄의 합을 이용하여 마지막 세로줄의 합을 구하세요.",
    visual: { kind: "book2", subtype: "matrix", cells, rowSums, columnSums },
    answer: String(answer),
    solution: `가운데 세로줄에는 네모가 3개 있으므로 네모는 ${columnSums[1]} ÷ 3 = ${square}입니다. 둘째 가로줄에서 마름모는 ${rowSums[1]} - ${square} - ${square} = ${diamond}, 첫째 가로줄에서 세모는 ${rowSums[0]} - ${diamond} - ${square} = ${triangle}, 셋째 가로줄에서 동그라미는 ${rowSums[2]} - ${triangle} - ${square} = ${circle}입니다. 따라서 마지막 세로줄의 합은 ${triangle} + ${diamond} + ${circle} = ${answer}입니다.`,
    meta: { sourceLayout: "shape-matrix-3x3-last-column", shapeValues: { diamond, square, triangle, circle }, rowSums, columnSums, targetAxis: "column", targetIndex: 2 }
  };
}

function matrixProblem02(difficulty) {
  const [circle, diamond, square, triangle] = distinctValues(difficulty, 4);
  const cells = [
    ["circle", "circle", "triangle", "diamond"],
    ["diamond", "circle", "square", "square"],
    ["circle", "circle", "circle", "square"],
    ["diamond", "circle", "circle", "square"]
  ];
  const rowSums = [null, diamond + circle + square * 2, circle * 3 + square, diamond + circle * 2 + square];
  const columnSums = [circle * 2 + diamond * 2, circle * 4, triangle + square + circle * 2, diamond + square * 3];
  const answer = circle * 2 + triangle + diamond;
  return {
    prompt: "같은 모양은 같은 수를 나타냅니다. 가로줄과 세로줄의 합을 이용하여 첫째 가로줄의 합을 구하세요.",
    visual: { kind: "book2", subtype: "matrix", cells, rowSums, columnSums },
    answer: String(answer),
    solution: `둘째 세로줄에는 동그라미가 4개 있으므로 동그라미는 ${columnSums[1]} ÷ 4 = ${circle}입니다. 셋째 가로줄에서 네모는 ${rowSums[2]} - ${circle} × 3 = ${square}, 넷째 가로줄에서 마름모는 ${rowSums[3]} - ${circle} × 2 - ${square} = ${diamond}, 셋째 세로줄에서 세모는 ${columnSums[2]} - ${square} - ${circle} × 2 = ${triangle}입니다. 따라서 첫째 가로줄의 합은 ${circle} + ${circle} + ${triangle} + ${diamond} = ${answer}입니다.`,
    meta: { sourceLayout: "shape-matrix-4x4-first-row", shapeValues: { circle, diamond, square, triangle }, rowSums, columnSums, targetAxis: "row", targetIndex: 0 }
  };
}

function matrixProblem22(difficulty) {
  const [square, circle, cross, diamond, triangle] = distinctValues(difficulty, 5);
  const cells = [
    ["square", "circle", "circle", "square"],
    ["cross", "diamond", "triangle", "diamond"],
    ["circle", "circle", "square", "circle"]
  ];
  const rowSums = [square * 2 + circle * 2, null, square + circle * 3];
  const columnSums = [square + cross + circle, circle * 2 + diamond, circle + triangle + square, square + diamond + circle];
  const answer = cross + diamond * 2 + triangle;
  return {
    prompt: "같은 모양은 같은 수를 나타냅니다. 가로줄과 세로줄의 합을 이용하여 가운데 가로줄의 합을 구하세요.",
    visual: { kind: "book2", subtype: "matrix", cells, rowSums, columnSums },
    answer: String(answer),
    solution: `첫째와 셋째 가로줄을 비교하면 동그라미는 ${(rowSums[2] * 2) - rowSums[0]} ÷ 4 = ${circle}, 네모는 ${rowSums[2]} - ${circle} × 3 = ${square}입니다. 첫째 세로줄에서 십자는 ${columnSums[0]} - ${square} - ${circle} = ${cross}, 둘째 세로줄에서 마름모는 ${columnSums[1]} - ${circle} × 2 = ${diamond}, 셋째 세로줄에서 세모는 ${columnSums[2]} - ${circle} - ${square} = ${triangle}입니다. 따라서 가운데 가로줄의 합은 ${cross} + ${diamond} + ${triangle} + ${diamond} = ${answer}입니다.`,
    meta: { sourceLayout: "shape-matrix-3x4-second-row", shapeValues: { square, circle, cross, diamond, triangle }, rowSums, columnSums, targetAxis: "row", targetIndex: 1 }
  };
}

export function book02UnitTestShapeMatrix({ difficulty = 2, sourceCase } = {}) {
  const number = Number(sourceCase?.number);
  if (sourceCase?.sourceKind !== "unit-test" || sourceCase?.sourceId !== "book-02" || !SOURCE_QUESTIONS.has(number)) return null;
  if (number === 1) return matrixProblem01(difficulty);
  if (number === 2) return matrixProblem02(difficulty);
  return matrixProblem22(difficulty);
}
