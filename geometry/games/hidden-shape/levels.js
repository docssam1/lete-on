const text = (ko, en, zh, ja) => ({ ko, en, zh, ja });

export function countFan(rayCount, horizontalCount = 0) {
  const oneBase = (rayCount * (rayCount - 1)) / 2;
  return {
    total: oneBase * (horizontalCount + 1),
    oneBase,
    bases: horizontalCount + 1,
    byWidth: Array.from({ length: rayCount - 1 }, (_, index) => ({
      size: index + 1,
      count: (rayCount - index - 1) * (horizontalCount + 1)
    }))
  };
}

export function countSquareGrid(order) {
  const bySize = Array.from({ length: order }, (_, index) => {
    const size = index + 1;
    return { size, count: (order - size + 1) ** 2 };
  });
  return { total: bySize.reduce((sum, item) => sum + item.count, 0), bySize };
}

export function countRectangles(cells) {
  const set = new Set(cells.map(([x, y]) => `${x},${y}`));
  const xs = cells.map(([x]) => x);
  const ys = cells.map(([, y]) => y);
  const minX = Math.min(...xs), maxX = Math.max(...xs), minY = Math.min(...ys), maxY = Math.max(...ys);
  const byArea = new Map();
  let total = 0;
  for (let x1 = minX; x1 <= maxX; x1 += 1) for (let x2 = x1; x2 <= maxX; x2 += 1) {
    for (let y1 = minY; y1 <= maxY; y1 += 1) for (let y2 = y1; y2 <= maxY; y2 += 1) {
      let complete = true;
      for (let x = x1; x <= x2 && complete; x += 1) for (let y = y1; y <= y2; y += 1) {
        if (!set.has(`${x},${y}`)) { complete = false; break; }
      }
      if (complete) {
        const area = (x2 - x1 + 1) * (y2 - y1 + 1);
        byArea.set(area, (byArea.get(area) || 0) + 1);
        total += 1;
      }
    }
  }
  return { total, byArea: [...byArea].sort((a, b) => a[0] - b[0]).map(([area, count]) => ({ area, count })) };
}

const triangular = (n) => (n * (n + 1)) / 2;
export function countTriangleGrid(order) {
  const upwardBySize = Array.from({ length: order }, (_, index) => {
    const size = index + 1;
    return { size, count: triangular(order - size + 1) };
  });
  const downwardBySize = Array.from({ length: Math.floor(order / 2) }, (_, index) => {
    const size = index + 1;
    return { size, count: triangular(order - size * 2 + 1) };
  });
  const upward = upwardBySize.reduce((sum, item) => sum + item.count, 0);
  const downward = downwardBySize.reduce((sum, item) => sum + item.count, 0);
  return { total: upward + downward, upward, downward, upwardBySize, downwardBySize };
}

function choicesFor(answer, seed) {
  const candidates = [answer, answer - 1, answer + 1, answer + Math.max(2, Math.round(answer * 0.18)), answer - Math.max(2, Math.round(answer * 0.12)), answer + 3]
    .filter((value) => value > 0);
  const unique = [...new Set(candidates)].slice(0, 4);
  while (unique.length < 4) unique.push(Math.max(1, answer + unique.length + 2));
  const shift = seed % 4;
  const choices = [...unique.slice(shift), ...unique.slice(0, shift)];
  return { choices, answerIndex: choices.indexOf(answer) };
}

function makeProblem(level, number, kind, data, result, source) {
  const answer = result.total;
  return {
    id: `hidden-${level}-${String(number).padStart(2, "0")}`,
    kind,
    ...data,
    answer,
    ...choicesFor(answer, level * 17 + number * 7),
    sourceRef: `${source}:item-${String(number).padStart(2, "0")}`
  };
}

const fanOne = [3,4,5,6,7,4,5,6,7,8].map((rayCount, index) =>
  makeProblem(1, index + 1, "fan", { rayCount, horizontalCount: 0, variant: index % 4 }, countFan(rayCount, 0), "fields-classic:triangle-count"));

const fanLayeredSpecs = [[3,1],[4,1],[5,1],[6,1],[3,2],[4,2],[5,2],[6,2],[7,1],[7,2]];
const fanLayered = fanLayeredSpecs.map(([rayCount, horizontalCount], index) =>
  makeProblem(2, index + 1, "fan", { rayCount, horizontalCount, variant: (index + 1) % 4 }, countFan(rayCount, horizontalCount), "fields-classic:triangle-figure-count"));

const squareOrders = [2,3,4,5,6,3,4,5,6,7];
const squareGrid = squareOrders.map((order, index) =>
  makeProblem(3, index + 1, "square-grid", { order, variant: index % 5 }, countSquareGrid(order), "fields-classic:square-grid-count-book5"));

const parseCells = (rows) => rows.flatMap((row, y) => [...row].flatMap((value, x) => value === "#" ? [[x, y]] : []));
const irregularRows = [
  ["###","##."], [".###","###."], ["##.","###",".##"], ["####",".##."], ["###.","####","..##"],
  ["##..","####",".###"], [".###","####","###."], ["###","###",".#."], ["####","###.",".###"], [".###.","#####","##.##"]
];
const irregular = irregularRows.map((rows, index) => {
  const cells = parseCells(rows);
  return makeProblem(4, index + 1, "irregular-grid", { cells, rows }, countRectangles(cells), "fields-classic:square-count");
});

const triangleOrders = [3,4,5,6,7,4,5,6,7,8];
const triangleGrid = triangleOrders.map((order, index) =>
  makeProblem(5, index + 1, "triangle-grid", { order, variant: index % 5 }, countTriangleGrid(order), "fields-classic:regular-triangle-grid-count-book5"));

export const levels = [
  { id:1, difficulty:"입문", title:text("부채꼴 삼각형","Triangle Fan","扇形三角形","扇形の三角形"), description:text("크고 작은 삼각형 세기","Count large and small triangles","数大大小小的三角形","大小の三角形を数える"), problems:fanOne },
  { id:2, difficulty:"초급", title:text("겹친 삼각형","Layered Triangles","重叠三角形","重なった三角形"), description:text("가로선이 있는 크고 작은 삼각형 세기","Count large and small triangles on horizontal lines","数横线上大大小小的三角形","横線にある大小の三角形を数える"), problems:fanLayered },
  { id:3, difficulty:"초급", title:text("정사각형 모눈","Square Grid","正方形方格","正方形の方眼"), description:text("한 칸부터 큰 정사각형까지 세어요.","Count squares of every size.","数出各种大小的正方形。","小さいものから大きい正方形まで数えます。"), problems:squareGrid },
  { id:4, difficulty:"초급", title:text("붙인 사각형","Joined Rectangles","拼接四边形","つないだ四角形"), description:text("완성된 직사각형을 넓이별로 찾아요.","Find complete rectangles by area.","按面积寻找完整的长方形。","完成した長方形を面積別に探します。"), problems:irregular },
  { id:5, difficulty:"중급", title:text("정삼각형 모눈","Triangle Grid","正三角形网格","正三角形の格子"), description:text("위와 아래를 향한 삼각형을 함께 세어요.","Count upward and downward triangles.","一起数向上和向下的三角形。","上向きと下向きの三角形を数えます。"), problems:triangleGrid }
];

export function resultFor(problem) {
  if (problem.kind === "fan") return countFan(problem.rayCount, problem.horizontalCount);
  if (problem.kind === "square-grid") return countSquareGrid(problem.order);
  if (problem.kind === "irregular-grid") return countRectangles(problem.cells);
  if (problem.kind === "triangle-grid") return countTriangleGrid(problem.order);
  throw new Error(`Unknown hidden-shape kind: ${problem.kind}`);
}

export function validateLevels() {
  const errors = [];
  const ids = new Set(), refs = new Set();
  if (levels.length !== 5) errors.push("level-count");
  levels.forEach((level) => {
    if (level.problems.length !== 10) errors.push(`level-${level.id}-problem-count`);
    level.problems.forEach((problem) => {
      if (ids.has(problem.id)) errors.push(`duplicate-id:${problem.id}`); ids.add(problem.id);
      if (refs.has(problem.sourceRef)) errors.push(`duplicate-source:${problem.sourceRef}`); refs.add(problem.sourceRef);
      const result = resultFor(problem);
      if (result.total !== problem.answer) errors.push(`answer:${problem.id}`);
      if (problem.choices.length !== 4 || new Set(problem.choices).size !== 4) errors.push(`choices:${problem.id}`);
      if (problem.choices[problem.answerIndex] !== problem.answer) errors.push(`answer-index:${problem.id}`);
      if (problem.choices.filter((value) => value === problem.answer).length !== 1) errors.push(`answer-unique:${problem.id}`);
    });
  });
  return errors;
}
