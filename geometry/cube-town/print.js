import { levels as countLevels } from "../games/count-heights/levels.js";
import { COPY_BUILD_LEVELS } from "../data/copy-build-levels.js";
import { levels as viewLevels } from "../games/three-views/levels.js";

const $ = (selector) => document.querySelector(selector);
const GAME_COPY_WOOD = "copy-wood";
const GAME_COPY_COLOR = "copy-color";
const GAME_COUNT = "count-heights";
const GAME_VIEWS = "three-views";
let selectedProblems = [];

// 표지 테마 — 지오메트리 랩의 학습지 표지와 같은 개념을 쓴다. "쌓기를 옮겨
// 적는 공부"(copy 2종 · 개수 세기)는 원목 앰버, "보고 알아내는 공부"(여러
// 방향에서 본 모양)는 블루. 색은 포인트로만 쓰므로 흑백 인쇄에서도 표지의
// 짜임(테두리 · 구분선 · 캐릭터 실루엣)은 그대로 성립한다.
//
// 캐릭터는 world-map/assets/geometry-characters.png 한 장을 3x3 스프라이트로
// 잘라 쓴다. 칸 이름은 worksheet/styles.css의 .gw-char-* 와 같은 규칙이다.
const COVER_THEMES = {
  stack: { accent: "#b0741c", chars: ["gw-char-cubie", "gw-char-box"] },
  view: { accent: "#1e6f9e", chars: ["gw-char-protractor", "gw-char-sphere"] }
};

const GAME_COPY = {
  [GAME_COPY_WOOD]: {
    title: "똑같이 쌓기 · 원목 관찰",
    cover: "똑같이 쌓기<br />원목 관찰",
    subtitle: "입체 모양을 살펴보고,<br />각 자리의 높이를 기록해 보세요.",
    instruction: "문제 모양을 보고, 위에서 본 바닥판의 각 칸에 쌓기나무 높이를 써 보세요.",
    theme: "stack"
  },
  [GAME_COPY_COLOR]: {
    title: "똑같이 쌓기 · 컬러 색칠",
    cover: "똑같이 쌓기<br />컬러 색칠",
    subtitle: "색과 위치를 자세히 살펴보고,<br />같은 모양에 똑같이 색칠해 보세요.",
    instruction: "왼쪽의 색깔 쌓기나무를 보고, 오른쪽의 같은 모양에 위치와 색을 똑같이 칠하세요.",
    theme: "stack"
  },
  [GAME_COUNT]: {
    title: "쌓기나무 개수 세기",
    cover: "쌓기나무<br />개수 세기",
    subtitle: "쌓기나무 맨 위에 수를 쓰고,<br />쓴 수를 모두 더해 보세요.",
    instruction: "문제 모양의 각 쌓기나무 맨 위에 들어갈 수를 쓰고, 모두 더하여 전체 개수를 구하세요.",
    theme: "stack"
  },
  [GAME_VIEWS]: {
    title: "여러 방향에서 본 모양",
    cover: "여러 방향에서<br />본 모양",
    subtitle: "쌓기나무를 앞, 옆, 위에서 본 모양을<br />색칠해 보세요.",
    instruction: "쌓기나무를 앞, 옆, 위에서 본 모양을 각각 색칠해 보세요.",
    theme: "view"
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
  if (game === GAME_VIEWS) {
    if (level === "all") return viewLevels.flatMap((entry) => entry.pool);
    return viewLevels[Number(level) - 1].pool;
  }
  if (game === GAME_COUNT) {
    // WHY .pool (not .problems): .problems is the 5-problem session slice the
    // game deals out per visit; paper sheets use the full 20-problem curated
    // pool so a 20-question book has no repeats.
    if (level === "all") return countLevels.flatMap((entry) => entry.pool);
    return countLevels[Number(level) - 1].pool;
  }
  const entries = level === "all"
    ? COPY_BUILD_LEVELS
    : [COPY_BUILD_LEVELS[Number(level) - 1]];
  const color = game === GAME_COPY_COLOR;
  return entries.flatMap((entry) => entry.problems.slice(color ? 5 : 0, color ? 10 : 5));
}

// three-views problems already carry a hand-authored 20-problem pool per level
// and their views are pre-derived from a fixed heightmap convention (see
// games/three-views/levels.js), so — unlike copy — they are used as-is
// with no rotate/mirror expansion: transforming the map would leave the
// pre-baked front/side/top views describing the wrong shape.
//
// count-heights problems are ALSO used as-is. The game's pools are curated so
// that every column's top face is visible from the fixed 3/4 camera (the child
// writes a number on each top). Rotating or mirroring the heightmap moves tall
// columns in front of short ones, hiding top faces — the printed circles then
// sit on occluded cubes and the sheet becomes unsolvable.
function pickProblems() {
  const game = $("#gameSelect").value;
  const requested = Number($("#countSelect").value);
  const pool = problemPool();
  const useAsIs = game === GAME_VIEWS || game === GAME_COUNT;
  const expanded = useAsIs ? shuffled(pool) : shuffled(expandVariants(pool, true));
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
  const { top, left, right } = cubeFaces(x, z, y, originX, originY, size);
  const [topFill, leftFill, rightFill] = CUBE_COLORS[colorName] || CUBE_COLORS.cube;
  polygon(context, left, leftFill, "#735b3e");
  polygon(context, right, rightFill, "#735b3e");
  polygon(context, top, topFill, "#735b3e");
}

function cubeFaces(x, z, y, originX, originY, size) {
  const half = size / 2;
  const depth = size * 0.48;
  const height = size * 0.72;
  const sx = originX + (x - z) * half;
  const sy = originY + (x + z) * depth / 2 - (y + 1) * height;
  const top = [[sx, sy - depth / 2], [sx + half, sy], [sx, sy + depth / 2], [sx - half, sy]];
  const left = [top[3], top[2], [top[2][0], top[2][1] + height], [top[3][0], top[3][1] + height]];
  const right = [top[2], top[1], [top[1][0], top[1][1] + height], [top[2][0], top[2][1] + height]];
  return { top, left, right };
}

function problemGrid(problem) {
  return problem.heights || normalizeCopyProblem(problem).grid;
}

function problemColor(problem, x, z, y, blank) {
  if (blank) return "blank";
  return normalizeCopyProblem(problem).colorMap?.[z]?.[x]?.[y] || "cube";
}

function drawProblem(canvas, problem, { blank = false, writeOnTop = false, answers = false } = {}) {
  const canvasWidth = 300;
  const canvasHeight = 160;
  const ratio = 2;
  canvas.width = canvasWidth * ratio;
  canvas.height = canvasHeight * ratio;
  const context = canvas.getContext("2d");
  context.scale(ratio, ratio);
  context.clearRect(0, 0, canvasWidth, canvasHeight);
  const grid = problemGrid(problem);
  const cubes = [];
  grid.forEach((row, z) => row.forEach((height, x) => {
    for (let y = 0; y < height; y += 1) cubes.push({ x, z, y });
  }));
  const unitPoints = cubes.flatMap((cube) => {
    const faces = cubeFaces(cube.x, cube.z, cube.y, 0, 0, 1);
    return [...faces.top, ...faces.left, ...faces.right];
  });
  const xs = unitPoints.map(([x]) => x);
  const ys = unitPoints.map(([, y]) => y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const contentWidth = Math.max(1, maxX - minX);
  const contentHeight = Math.max(1, maxY - minY);
  const size = Math.min(64, 276 / contentWidth, 142 / contentHeight);
  const originX = (canvasWidth - contentWidth * size) / 2 - minX * size;
  const originY = (canvasHeight - contentHeight * size) / 2 - minY * size;
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
  if (writeOnTop) drawTopNumberPlaces(context, grid, originX, originY, size, answers);
}

function drawTopNumberPlaces(context, grid, originX, originY, size, answers) {
  const radius = Math.max(7, Math.min(12, size * 0.18));
  grid.forEach((row, z) => row.forEach((height, x) => {
    if (!height) return;
    const faces = cubeFaces(x, z, height - 1, originX, originY, size);
    const centerX = faces.top.reduce((sum, point) => sum + point[0], 0) / faces.top.length;
    const centerY = faces.top.reduce((sum, point) => sum + point[1], 0) / faces.top.length;
    context.save();
    context.beginPath();
    context.ellipse(centerX, centerY, radius * 1.08, radius * 0.82, 0, 0, Math.PI * 2);
    context.fillStyle = answers ? "#e6f4ea" : "#ffffff";
    context.strokeStyle = answers ? "#278958" : "#173457";
    context.lineWidth = 1.2;
    context.fill();
    context.stroke();
    if (answers) {
      context.fillStyle = "#173457";
      context.font = `900 ${Math.max(10, radius * 1.15)}px sans-serif`;
      context.textAlign = "center";
      context.textBaseline = "middle";
      context.fillText(String(height), centerX, centerY + 0.3);
    }
    context.restore();
  }));
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
  const workedExample = index === 0;
  const exampleEquation = problem.heights.flat().filter(Boolean).join(" + ");
  article.className = `question count-question${workedExample ? " worked-example" : ""}`;
  article.innerHTML = `
    <span class="question-number">${index + 1}</span>
    ${workedExample ? '<span class="example-badge">풀이 예시</span>' : ""}
    <canvas class="cube-canvas"></canvas>
    <div class="answer-line"><span>전체</span><i>${workedExample ? problem.answer.total : ""}</i><span>개</span></div>
    ${workedExample ? `<p class="example-note">${exampleEquation} = <strong>${problem.answer.total}</strong>개</p>` : ""}
  `;
  target.append(article);
  drawProblem(article.querySelector("canvas"), problem, { writeOnTop: true, answers: workedExample });
}

function renderCopyQuestion(problem, index, target, colorMode) {
  const article = document.createElement("article");
  const workedExample = index === 0;
  article.className = `question copy-question ${colorMode ? "color-copy-question" : "wood-copy-question"}${workedExample ? " worked-example" : ""}`;
  article.innerHTML = colorMode
    ? `
      <span class="question-number">${index + 1}</span>
      ${workedExample ? '<span class="example-badge">풀이 예시</span>' : ""}
      <div class="copy-pair">
        <figure><figcaption>문제 모양</figcaption><canvas class="cube-canvas target-copy"></canvas></figure>
        <figure><figcaption>${workedExample ? "색칠한 정답" : "똑같이 색칠"}</figcaption><canvas class="cube-canvas blank-copy"></canvas></figure>
      </div>
      <div class="color-key"><span class="green">○ 초록</span><span class="blue">△ 파랑</span><span class="yellow">★ 노랑</span><span class="rose">□ 빨강</span></div>
    `
    : `
      <span class="question-number">${index + 1}</span>
      ${workedExample ? '<span class="example-badge">풀이 예시</span>' : ""}
      <div class="wood-observe">
        <figure><figcaption>문제 모양</figcaption><canvas class="cube-canvas target-copy"></canvas></figure>
        <figure><figcaption>${workedExample ? "각 칸의 높이 정답" : "위에서 본 칸에 높이 쓰기"}</figcaption>${topViewMarkup(problem, workedExample)}</figure>
      </div>
    `;
  target.append(article);
  drawProblem(article.querySelector(".target-copy"), problem);
  const blankCanvas = article.querySelector(".blank-copy");
  if (blankCanvas) drawProblem(blankCanvas, problem, { blank: !workedExample });
}

// three-views questions carry a 3D picture plus three view grids, so they need
// far more room than the copy/count questions — one column of two per page
// instead of the usual 2x2 grid.
function createQuestionSheet(pageIndex, pageCount) {
  const game = $("#gameSelect").value;
  const config = GAME_COPY[game];
  const section = document.createElement("section");
  section.className = "sheet question-sheet";
  section.innerHTML = `
    <header class="sheet-header">
      <div><span>GFIELD CUBE TOWN</span><h1>${config.title}</h1></div>
      <div class="student-lines"><span>이름</span><i></i><span>날짜</span><i></i></div>
    </header>
    <div class="sheet-kicker"><p>${config.instruction}</p><b>${pageIndex + 1} / ${pageCount}</b></div>
    <div class="question-grid${game === GAME_VIEWS ? " views-question-grid" : ""}"></div>
  `;
  $("#questionSheets").append(section);
  return section.querySelector(".question-grid");
}

// Renders an empty dotted grid (question side) or a filled-in grid (answer
// side) straight from a views.{front,side,top} array — the data already
// encodes the correct front/side/top orientation, so it is never recomputed.
function viewGridMarkup(view, answers = false) {
  const rows = view.length;
  const cols = view[0].length;
  const cells = view
    .flatMap((row) => row.map((filled) => `<span class="${answers && filled ? "filled" : ""}"></span>`))
    .join("");
  return `<div class="view-answer-grid" style="--v-rows:${rows};--v-cols:${cols}">${cells}</div>`;
}

function viewsFigureMarkup(problem, answers) {
  return `
    <figure><figcaption>앞에서 본 모양</figcaption>${viewGridMarkup(problem.views.front, answers)}</figure>
    <figure><figcaption>옆에서 본 모양</figcaption>${viewGridMarkup(problem.views.side, answers)}</figure>
    <figure><figcaption>위에서 본 모양</figcaption>${viewGridMarkup(problem.views.top, answers)}</figure>
  `;
}

function renderViewsQuestion(problem, index, target) {
  const article = document.createElement("article");
  article.className = "question views-question";
  article.innerHTML = `
    <span class="question-number">${index + 1}</span>
    <div class="views-layout">
      <figure class="views-cube"><figcaption>쌓기나무 모양</figcaption><canvas class="cube-canvas"></canvas></figure>
      <div class="views-grids">${viewsFigureMarkup(problem, false)}</div>
    </div>
  `;
  target.append(article);
  drawProblem(article.querySelector(".cube-canvas"), { heights: problem.map });
}

function renderAnswer(problem, index) {
  const game = $("#gameSelect").value;
  const article = document.createElement("article");
  if (game === GAME_VIEWS) {
    article.className = "answer-item views-answer-item";
    article.innerHTML = `
      <h2>${index + 1}번</h2>
      <div class="views-layout">
        <figure class="views-cube"><canvas class="answer-canvas"></canvas></figure>
        <div class="views-grids">${viewsFigureMarkup(problem, true)}</div>
      </div>
    `;
    $("#answers").append(article);
    drawProblem(article.querySelector(".answer-canvas"), { heights: problem.map });
    return;
  }
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
  // Only the copy games (똑같이 쌓기) are limited to levels 1-3; count-heights
  // and three-views both ship five full levels.
  const limitedLevels = $("#gameSelect").value !== GAME_COUNT && $("#gameSelect").value !== GAME_VIEWS;
  $("#levelSelect").querySelectorAll("option").forEach((option) => {
    const value = Number(option.value);
    option.hidden = limitedLevels && value > 3;
    option.disabled = limitedLevels && value > 3;
  });
  if (limitedLevels && Number($("#levelSelect").value) > 3) $("#levelSelect").value = "all";
}

// 표지 = 제목 + 부제 + 테마(포인트 색 · 캐릭터). data-theme 하나만 바꾸면
// print.css가 색을 갈아 주고, 캐릭터는 테마가 지명한 스프라이트 칸으로 다시
// 그린다.
function renderCover(config) {
  const theme = COVER_THEMES[config.theme] ? config.theme : "stack";
  $("#coverTitle").innerHTML = config.cover;
  $("#coverSubtitle").innerHTML = config.subtitle;
  const cover = $("#coverSheet");
  cover.dataset.theme = theme;
  const slot = $("#coverMascots");
  slot.replaceChildren(...COVER_THEMES[theme].chars.map((cls) => {
    const el = document.createElement("i");
    el.className = `gw-char ${cls}`;
    return el;
  }));
}

function generate() {
  updateLevelOptions();
  pickProblems();
  $("#questionSheets").replaceChildren();
  $("#answers").replaceChildren();
  const game = $("#gameSelect").value;
  $("#answers").className = `answer-grid${game === GAME_VIEWS ? " views-answer-grid" : ""}`;
  const perPage = game === GAME_COUNT ? 5 : game === GAME_VIEWS ? 2 : 4;
  const pageCount = Math.ceil(selectedProblems.length / perPage);
  for (let page = 0; page < pageCount; page += 1) {
    const target = createQuestionSheet(page, pageCount);
    selectedProblems.slice(page * perPage, page * perPage + perPage).forEach((problem, offset) => {
      const index = page * perPage + offset;
      if (game === GAME_COUNT) renderCountQuestion(problem, index, target);
      else if (game === GAME_VIEWS) renderViewsQuestion(problem, index, target);
      else renderCopyQuestion(problem, index, target, game === GAME_COPY_COLOR);
    });
  }
  selectedProblems.forEach(renderAnswer);
  const config = GAME_COPY[game];
  renderCover(config);
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

// 지오메트리 랩의 연습책 카드가 이 주소로 딥링크한다:
//   print.html?game=<...>&level=<all|1..5>&count=<n>&cover=1
// 랩은 "무엇을 몇 문제, 표지를 넣어" 까지만 정하고 실제 문제 고르기와 인쇄는
// 여기가 한다. 넘어온 값은 모두 select의 실제 option으로만 좁혀 받는다 —
// 주소창에서 손으로 고친 값이 화면에 없는 상태를 만들면, 보이는 설정과 뽑히는
// 문제가 어긋난다.
function applyInitialParams() {
  const params = new URLSearchParams(window.location.search);
  const initialGame = params.get("game");
  if (initialGame && GAME_COPY[initialGame]) {
    $("#gameSelect").value = initialGame;
  }
  updateLevelOptions();
  const initialLevel = params.get("level");
  if (initialLevel) {
    const option = $("#levelSelect").querySelector(`option[value="${initialLevel}"]`);
    if (option && !option.disabled) $("#levelSelect").value = initialLevel;
  }
  // 문제 수는 이 페이지의 선택지(5/10/20)와 랩의 선택지가 다를 수 있으므로,
  // 없는 값이 오면 가장 가까운 선택지로 붙인다. 무시하고 기본값으로 되돌리면
  // 20문제를 시킨 사람이 조용히 10문제를 받는다.
  const initialCount = Number(params.get("count"));
  if (initialCount > 0) {
    const options = Array.from($("#countSelect").options).map((o) => Number(o.value));
    const nearest = options.reduce((best, value) => (
      Math.abs(value - initialCount) < Math.abs(best - initialCount) ? value : best
    ), options[0]);
    $("#countSelect").value = String(nearest);
  }
  const initialCover = params.get("cover");
  if (initialCover !== null) $("#coverToggle").checked = initialCover !== "0";
}

applyInitialParams();
generate();
