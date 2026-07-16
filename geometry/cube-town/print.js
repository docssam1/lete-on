import { levels as countLevels } from "../games/count-heights/levels.js";
import { COPY_BUILD_LEVELS } from "../data/copy-build-levels.js";

const $ = (selector) => document.querySelector(selector);
const GAME_COPY_WOOD = "copy-wood";
const GAME_COPY_COLOR = "copy-color";
const GAME_COUNT = "count-heights";
let selectedProblems = [];

const GAME_COPY = {
  [GAME_COPY_WOOD]: {
    title: "똑같이 쌓기 · 원목 관찰",
    cover: "똑같이 쌓기<br />원목 관찰",
    subtitle: "입체 모양을 살펴보고,<br />각 자리의 높이를 기록해 보세요.",
    instruction: "문제 모양을 보고, 위에서 본 바닥판의 각 칸에 쌓기나무 높이를 써 보세요."
  },
  [GAME_COPY_COLOR]: {
    title: "똑같이 쌓기 · 컬러 색칠",
    cover: "똑같이 쌓기<br />컬러 색칠",
    subtitle: "색과 위치를 자세히 살펴보고,<br />같은 모양에 똑같이 색칠해 보세요.",
    instruction: "왼쪽의 색깔 쌓기나무를 보고, 오른쪽의 같은 모양에 위치와 색을 똑같이 칠하세요."
  },
  [GAME_COUNT]: {
    title: "쌓기나무 개수 세기",
    cover: "쌓기나무<br />개수 세기",
    subtitle: "높이를 살펴보고, 하나씩 더하고,<br />공간을 수로 표현해 보세요.",
    instruction: "각 자리의 가장 높은 층수를 쓰고 모두 더하여 전체 개수를 구하세요."
  }
};

const CUBE_COLORS = {
  cube: ["#f3d59b", "#d2a55e", "#bd8745"],
  green: ["#a8c989", "#759d60", "#5b7d48"],
  blue: ["#9bbbd4", "#628ba9", "#4c6f8b"],
  yellow: ["#f7d86f", "#d6aa32", "#b88720"],
  rose: ["#efa49a", "#c97067", "#a9514a"],
  blank: ["#ffffff", "#e9eceb", "#d3d8d6"]
};

function shuffled(list) {
  return [...list].sort(() => Math.random() - 0.5);
}

function rotateMatrix(matrix) {
  return matrix[0].map((_, column) => matrix.map((row) => row[column]).reverse());
}

function mirrorMatrix(matrix) {
  return matrix.map((row) => [...row].reverse());
}

function normalizeCopyProblem(problem) {
  return Array.isArray(problem) ? { grid: problem, colorMap: null } : problem;
}

function transformCopyProblem(problem, transform, suffix) {
  const normalized = normalizeCopyProblem(problem);
  return {
    id: `copy-${suffix}-${Math.random().toString(36).slice(2)}`,
    grid: transform(normalized.grid),
    colorMap: normalized.colorMap ? transform(normalized.colorMap) : null
  };
}

function transformCountProblem(problem, transform, suffix) {
  const heights = transform(problem.heights);
  return {
    ...problem,
    id: `${problem.id}-${suffix}`,
    board: [heights[0].length, heights.length],
    heights
  };
}

function expandVariants(pool, isCopy) {
  const transform = isCopy ? transformCopyProblem : transformCountProblem;
  return [
    ...pool,
    ...pool.map((problem) => transform(problem, rotateMatrix, "r90")),
    ...pool.map((problem) => transform(problem, (grid) => rotateMatrix(rotateMatrix(grid)), "r180")),
    ...pool.map((problem) => transform(problem, mirrorMatrix, "mirror")),
    ...pool.map((problem) => transform(problem, (grid) => rotateMatrix(mirrorMatrix(grid)), "mirror-r90"))
  ];
}

function problemPool() {
  const game = $("#gameSelect").value;
  const level = $("#levelSelect").value;
  if (game === GAME_COUNT) {
    if (level === "all") return countLevels.flatMap((entry) => entry.problems);
    return countLevels[Number(level) - 1].problems;
  }
  const entries = level === "all"
    ? COPY_BUILD_LEVELS
    : [COPY_BUILD_LEVELS[Number(level) - 1]];
  const color = game === GAME_COPY_COLOR;
  return entries.flatMap((entry) => entry.problems.slice(color ? 5 : 0, color ? 10 : 5));
}

function pickProblems() {
  const game = $("#gameSelect").value;
  const requested = Number($("#countSelect").value);
  const expanded = shuffled(expandVariants(problemPool(), game !== GAME_COUNT));
  selectedProblems = Array.from({ length: requested }, (_, index) => expanded[index % expanded.length]);
}

function polygon(context, points, fill, stroke) {
  context.beginPath();
  context.moveTo(points[0][0], points[0][1]);
  points.slice(1).forEach(([x, y]) => context.lineTo(x, y));
  context.closePath();
  context.fillStyle = fill;
  context.fill();
  context.strokeStyle = stroke;
  context.lineWidth = 1;
  context.stroke();
}

function drawCube(context, x, z, y, originX, originY, size, colorName = "cube") {
  const half = size / 2;
  const depth = size * 0.48;
  const height = size * 0.72;
  const sx = originX + (x - z) * half;
  const sy = originY + (x + z) * depth / 2 - (y + 1) * height;
  const top = [[sx, sy - depth / 2], [sx + half, sy], [sx, sy + depth / 2], [sx - half, sy]];
  const left = [top[3], top[2], [top[2][0], top[2][1] + height], [top[3][0], top[3][1] + height]];
  const right = [top[2], top[1], [top[1][0], top[1][1] + height], [top[2][0], top[2][1] + height]];
  const [topFill, leftFill, rightFill] = CUBE_COLORS[colorName] || CUBE_COLORS.cube;
  polygon(context, left, leftFill, "#735b3e");
  polygon(context, right, rightFill, "#735b3e");
  polygon(context, top, topFill, "#735b3e");
}

function problemGrid(problem) {
  return problem.heights || normalizeCopyProblem(problem).grid;
}

function problemColor(problem, x, z, y, blank) {
  if (blank) return "blank";
  return normalizeCopyProblem(problem).colorMap?.[z]?.[x]?.[y] || "cube";
}

function drawProblem(canvas, problem, { blank = false } = {}) {
  const ratio = 2;
  canvas.width = 300 * ratio;
  canvas.height = 160 * ratio;
  const context = canvas.getContext("2d");
  context.scale(ratio, ratio);
  context.clearRect(0, 0, 300, 160);
  const grid = problemGrid(problem);
  const width = grid[0].length;
  const depth = grid.length;
  const maxHeight = Math.max(...grid.flat());
  const size = Math.min(60, 190 / Math.max(width, depth), 140 / Math.max(2, maxHeight));
  const originX = 150;
  const originY = 124 - Math.max(width, depth) * 4 + maxHeight * 8;
  const cubes = [];
  grid.forEach((row, z) => row.forEach((height, x) => {
    for (let y = 0; y < height; y += 1) cubes.push({ x, z, y });
  }));
  cubes.sort((a, b) => (a.x + a.z + a.y * 0.01) - (b.x + b.z + b.y * 0.01));
  cubes.forEach((cube) => drawCube(
    context,
    cube.x,
    cube.z,
    cube.y,
    originX,
    originY,
    size,
    problemColor(problem, cube.x, cube.z, cube.y, blank)
  ));
}

function topViewMarkup(problem, answers = false) {
  const grid = problemGrid(problem);
  const size = Math.max(grid.length, ...grid.map((row) => row.length));
  const cells = Array.from({ length: size * size }, (_, index) => {
    const z = Math.floor(index / size);
    const x = index % size;
    const height = grid[z]?.[x] || 0;
    return `<span class="${height ? "used" : ""}">${answers && height ? height : ""}</span>`;
  }).join("");
  return `<div class="top-view-grid" style="--grid-size:${size}">${cells}</div>`;
}

function renderCountQuestion(problem, index, target) {
  const article = document.createElement("article");
  article.className = "question";
  const occupied = problem.heights.flat().filter(Boolean);
  article.innerHTML = `
    <span class="question-number">${index + 1}</span>
    <canvas class="cube-canvas"></canvas>
    <div class="height-grid">${occupied.map(() => '<span class="height-cell"></span>').join("")}</div>
    <div class="answer-line"><span>전체</span><i></i><span>개</span></div>
  `;
  target.append(article);
  drawProblem(article.querySelector("canvas"), problem);
}

function renderCopyQuestion(problem, index, target, colorMode) {
  const article = document.createElement("article");
  article.className = `question copy-question ${colorMode ? "color-copy-question" : "wood-copy-question"}`;
  article.innerHTML = colorMode
    ? `
      <span class="question-number">${index + 1}</span>
      <div class="copy-pair">
        <figure><figcaption>문제 모양</figcaption><canvas class="cube-canvas target-copy"></canvas></figure>
        <figure><figcaption>똑같이 색칠</figcaption><canvas class="cube-canvas blank-copy"></canvas></figure>
      </div>
      <div class="color-key"><span class="green">○ 초록</span><span class="blue">△ 파랑</span><span class="yellow">★ 노랑</span><span class="rose">□ 빨강</span></div>
    `
    : `
      <span class="question-number">${index + 1}</span>
      <div class="wood-observe">
        <figure><figcaption>문제 모양</figcaption><canvas class="cube-canvas target-copy"></canvas></figure>
        <figure><figcaption>위에서 본 칸에 높이 쓰기</figcaption>${topViewMarkup(problem)}</figure>
      </div>
    `;
  target.append(article);
  drawProblem(article.querySelector(".target-copy"), problem);
  const blankCanvas = article.querySelector(".blank-copy");
  if (blankCanvas) drawProblem(blankCanvas, problem, { blank: true });
}

function createQuestionSheet(pageIndex, pageCount) {
  const config = GAME_COPY[$("#gameSelect").value];
  const section = document.createElement("section");
  section.className = "sheet question-sheet";
  section.innerHTML = `
    <header class="sheet-header">
      <div><span>GFIELD CUBE TOWN</span><h1>${config.title}</h1></div>
      <div class="student-lines"><span>이름</span><i></i><span>날짜</span><i></i></div>
    </header>
    <div class="sheet-kicker"><p>${config.instruction}</p><b>${pageIndex + 1} / ${pageCount}</b></div>
    <div class="question-grid"></div>
  `;
  $("#questionSheets").append(section);
  return section.querySelector(".question-grid");
}

function renderAnswer(problem, index) {
  const game = $("#gameSelect").value;
  const article = document.createElement("article");
  article.className = `answer-item ${game !== GAME_COUNT ? "copy-answer-item" : ""}`;
  if (game === GAME_COUNT) {
    const heights = problem.heights.flat().filter(Boolean);
    article.innerHTML = `<h2>${index + 1}번</h2><div class="answer-heights">${heights.map((height) => `<span>${height}</span>`).join("")}</div><p class="answer-total">전체 <b>${problem.answer.total}</b>개</p>`;
  } else {
    const grid = problemGrid(problem);
    const total = grid.flat().reduce((sum, height) => sum + height, 0);
    article.innerHTML = `
      <h2>${index + 1}번</h2>
      <canvas class="answer-canvas"></canvas>
      ${game === GAME_COPY_WOOD ? topViewMarkup(problem, true) : ""}
      <p class="answer-total">사용한 쌓기나무 <b>${total}</b>개</p>
    `;
  }
  $("#answers").append(article);
  const canvas = article.querySelector(".answer-canvas");
  if (canvas) drawProblem(canvas, problem);
}

function updateLevelOptions() {
  const isCopy = $("#gameSelect").value !== GAME_COUNT;
  $("#levelSelect").querySelectorAll("option").forEach((option) => {
    const value = Number(option.value);
    option.hidden = isCopy && value > 3;
    option.disabled = isCopy && value > 3;
  });
  if (isCopy && Number($("#levelSelect").value) > 3) $("#levelSelect").value = "all";
}

function generate() {
  updateLevelOptions();
  pickProblems();
  $("#questionSheets").replaceChildren();
  $("#answers").replaceChildren();
  const game = $("#gameSelect").value;
  const perPage = game === GAME_COUNT ? 5 : 4;
  const pageCount = Math.ceil(selectedProblems.length / perPage);
  for (let page = 0; page < pageCount; page += 1) {
    const target = createQuestionSheet(page, pageCount);
    selectedProblems.slice(page * perPage, page * perPage + perPage).forEach((problem, offset) => {
      const index = page * perPage + offset;
      if (game === GAME_COUNT) renderCountQuestion(problem, index, target);
      else renderCopyQuestion(problem, index, target, game === GAME_COPY_COLOR);
    });
  }
  selectedProblems.forEach(renderAnswer);
  const config = GAME_COPY[game];
  $("#coverTitle").innerHTML = config.cover;
  $("#coverSubtitle").innerHTML = config.subtitle;
  const selectedLevel = $("#levelSelect").value;
  $("#coverLevel").textContent = selectedLevel === "all" ? "전체 혼합" : `레벨 ${selectedLevel}`;
  $("#coverCount").textContent = `${selectedProblems.length} QUESTIONS`;
  $("#coverSheet").hidden = !$("#coverToggle").checked;
  $("#answerSheet").hidden = !$("#answerToggle").checked;
}

$("#gameSelect").addEventListener("change", generate);
$("#levelSelect").addEventListener("change", generate);
$("#countSelect").addEventListener("change", generate);
$("#coverToggle").addEventListener("change", () => { $("#coverSheet").hidden = !$("#coverToggle").checked; });
$("#answerToggle").addEventListener("change", () => { $("#answerSheet").hidden = !$("#answerToggle").checked; });
$("#generate").addEventListener("click", generate);
$("#printButton").addEventListener("click", () => window.print());
generate();
