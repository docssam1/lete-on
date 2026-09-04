import { levels } from "../../games/geoboard/levels.js?v=geoboard-8";
import { curriculumBandLabel } from "../../shared/curriculum-bands.js?v=curriculum-1";
import {
  enumerateEquilateralTriangles,
  enumerateSquares,
  squareBoardPoints,
  triangularBoardPoints,
  triangularDistanceSquared
} from "../../games/geoboard/lattice-enumerator.js?v=geoboard-4";

const $ = (selector) => document.querySelector(selector);
const select = $("#levelSelect");
const countInput = $("#countInput");
const toggle = $("#answerToggle");
const coverToggle = $("#coverToggle");
const worksheet = $("#worksheet");
const sheetTemplate = $("#sheetTemplate");
let offset = 0;

const copy = {
  1: { title: "선분과 열린 모양", description: "보기를 살펴보고 같은 위치의 점을 차례로 이어 보세요." },
  2: { title: "삼각형·사각형·오각형", description: "보기에 나온 닫힌 도형을 같은 위치와 방향으로 그리세요." },
  3: { title: "정사각형의 종류와 경우의 수", description: "정사각형을 크기별로 찾고, 위치가 다른 경우까지 빠짐없이 세어 보세요." },
  4: { title: "정삼각형의 종류와 경우의 수", description: "삼각 점판에서 크기가 다른 정삼각형과 모든 위치를 찾아보세요." },
  5: { title: "선을 그어 도형 나누기", description: "주어진 외곽선에 정해진 수의 선을 그어 목표 도형으로 나누세요." }
};

const initialSamples = {
  1: [0, 1, 4, 6, 7, 9],
  2: [0, 1, 4, 8, 10, 13],
  3: [0, 1, 2, 4, 5, 8],
  4: [0, 1, 2, 4, 5, 8],
  5: [0, 1, 3, 5, 7, 9]
};

const allOption = document.createElement("option");
allOption.value = "all";
allOption.textContent = `전체 유형 · ${levels.reduce((sum, level) => sum + level.problems.length, 0)}문항`;
select.append(allOption);
levels.forEach((level) => {
  const option = document.createElement("option");
  option.value = String(level.id);
  option.textContent = `${level.id}. ${copy[level.id].title} · ${level.stage} ${level.difficulty}`;
  select.append(option);
});

function requestedCount() {
  const count = Math.max(1, Math.min(20, Math.round(Number(countInput.value) || 6)));
  countInput.value = String(count);
  return count;
}

function orderedProblems(level) {
  const preferred = initialSamples[level.id];
  const indexes = [...preferred, ...level.problems.map((_, index) => index).filter((index) => !preferred.includes(index))];
  return indexes.map((index) => level.problems[index]);
}

function balancedEntries(count) {
  const pools = new Map(levels.map((level) => [level.id, orderedProblems(level)]));
  return Array.from({ length: count }, (_, index) => {
    const position = index + offset;
    const level = levels[position % levels.length];
    const pool = pools.get(level.id);
    const problemIndex = Math.floor(position / levels.length) % pool.length;
    return { level, problem: pool[problemIndex] };
  });
}

function selectedEntries() {
  const count = requestedCount();
  const level = levels.find((item) => String(item.id) === select.value);
  if (!level || count > level.problems.length) {
    select.value = "all";
    return balancedEntries(count);
  }
  const pool = orderedProblems(level);
  return Array.from({ length: count }, (_, index) => ({ level, problem: pool[(offset + index) % pool.length] }));
}

function splitEvenly(entries) {
  const pageCount = Math.ceil(entries.length / 6);
  const baseSize = Math.floor(entries.length / pageCount);
  const extra = entries.length % pageCount;
  const pages = [];
  let cursor = 0;
  for (let pageIndex = 0; pageIndex < pageCount; pageIndex += 1) {
    const size = baseSize + (pageIndex < extra ? 1 : 0);
    pages.push(entries.slice(cursor, cursor + size));
    cursor += size;
  }
  return pages;
}

const closePoints = (points) => [...points, points[0]];
const polygonOrder = (vertices) => {
  const center = vertices.reduce((sum, point) => [sum[0] + point[0], sum[1] + point[1]], [0, 0]).map((value) => value / vertices.length);
  return [...vertices].sort((a, b) => Math.atan2(a[1] - center[1], a[0] - center[0]) - Math.atan2(b[1] - center[1], b[0] - center[0]));
};

function squareMap(point, size) {
  const pad = 13;
  const step = (100 - pad * 2) / Math.max(1, size - 1);
  return [pad + point[0] * step, pad + point[1] * step];
}

function triangleMap(point, size) {
  const pad = 12;
  const span = 100 - pad * 2;
  const step = span / Math.max(1, size - 1);
  return [pad + (point[0] + point[1] * 0.5) * step, pad + point[1] * step * Math.sqrt(3) / 2];
}

function pathData(points, map) {
  return points.map((point, index) => `${index ? "L" : "M"}${map(point).map((value) => value.toFixed(2)).join(" ")}`).join(" ");
}

function dotsMarkup(points, map, requiredPoint = null) {
  return points.map((point) => {
    const [x, y] = map(point);
    const required = requiredPoint && point[0] === requiredPoint[0] && point[1] === requiredPoint[1];
    return `<g class="peg${required ? " required" : ""}"><circle class="peg-shadow" cx="${x + 0.8}" cy="${y + 1.1}" r="2.5"/><circle class="peg-head" cx="${x}" cy="${y}" r="2.25"/>${required ? `<circle class="required-ring" cx="${x}" cy="${y}" r="4.7"/>` : ""}</g>`;
  }).join("");
}

function squareBoardSvg({ size, lines = [], lineClass = "", label = "정사각 점판", requiredPoint = null }) {
  const points = squareBoardPoints(size);
  const map = (point) => squareMap(point, size);
  const paths = lines.map((line) => `<path class="band ${lineClass}" d="${pathData(line, map)}"/>`).join("");
  return `<svg class="pegboard-svg square-board" viewBox="0 0 100 100" role="img" aria-label="${label}"><rect class="board-edge" x="4" y="4" width="92" height="92" rx="5"/><rect class="board-surface" x="6" y="6" width="88" height="88" rx="4"/>${paths}${dotsMarkup(points, map, requiredPoint)}</svg>`;
}

function triangularBoardSvg({ size, lines = [], lineClass = "", label = "삼각 점판" }) {
  const points = triangularBoardPoints(size);
  const map = (point) => triangleMap(point, size);
  const paths = lines.map((line) => `<path class="band ${lineClass}" d="${pathData(line, map)}"/>`).join("");
  return `<svg class="pegboard-svg triangular-board" viewBox="0 0 112 100" role="img" aria-label="${label}"><path class="board-edge" d="M8 8 L104 8 L56 94 Z"/><path class="board-surface" d="M11 11 L101 11 L56 90 Z"/>${paths}${dotsMarkup(points, map)}</svg>`;
}

function modelAndWork(problem, showAnswer) {
  const target = problem.kind === "closed" ? closePoints(problem.vertices) : problem.vertices;
  const shape = problem.kind === "closed" ? ["삼각형", "사각형", "오각형"][Math.max(0, problem.vertices.length - 3)] : (problem.vertices.length === 2 ? "선분" : "열린 모양");
  return {
    prompt: `보기와 같은 ${shape}을 오른쪽 점판에 그리세요.`,
    visual: `<div class="model-pair"><figure><figcaption>보기</figcaption>${squareBoardSvg({ size: 5, lines: [target], lineClass: "model-band", label: `${shape} 보기` })}</figure><figure><figcaption>${showAnswer ? "모범 답" : "그리기"}</figcaption>${squareBoardSvg({ size: 5, lines: showAnswer ? [target] : [], lineClass: "answer-band", label: showAnswer ? `${shape} 모범 답` : "빈 점판" })}</figure></div>`,
    answer: showAnswer ? `모범 선: 꼭짓점 ${problem.vertices.length}개를 보기와 같은 순서로 이어요.` : "고무줄 선을 그리세요."
  };
}

function representativeLines(problem) {
  if (problem.kind === "square-count") {
    const placements = enumerateSquares(squareBoardPoints(problem.boardSize));
    const representatives = new Map();
    placements.sort((a, b) => a.sideSquared - b.sideSquared).forEach((placement) => {
      if (!representatives.has(placement.typeKey)) representatives.set(placement.typeKey, closePoints(polygonOrder(placement.vertices)));
    });
    return [...representatives.values()].slice(0, problem.targetKindCount);
  }
  const placements = enumerateEquilateralTriangles(triangularBoardPoints(problem.boardSize), triangularDistanceSquared);
  const representatives = new Map();
  placements.sort((a, b) => a.sideSquared - b.sideSquared).forEach((placement) => {
    if (!representatives.has(placement.typeKey)) representatives.set(placement.typeKey, closePoints(polygonOrder(placement.vertices)));
  });
  return [...representatives.values()].slice(0, problem.targetKindCount);
}

function countProblem(problem, showAnswer) {
  const isSquare = problem.kind === "square-count";
  const shape = isSquare ? "정사각형" : "정삼각형";
  const board = isSquare ? `${problem.boardSize}×${problem.boardSize}` : `한 변에 점 ${problem.boardSize}개인 삼각`;
  const typeQuestion = problem.questionMode === "types";
  const answerLines = showAnswer && typeQuestion ? representativeLines(problem) : [];
  const svg = isSquare
    ? squareBoardSvg({ size: problem.boardSize, lines: answerLines, lineClass: "type-solution", label: `${board} 점판` })
    : triangularBoardSvg({ size: problem.boardSize, lines: answerLines, lineClass: "type-solution", label: `${board} 점판` });
  const choices = !typeQuestion ? `<div class="number-choices">${problem.answerChoices.map((choice) => `<span class="${showAnswer && choice === problem.answerValue ? "correct" : ""}">${choice}</span>`).join("")}</div>` : "";
  const prompt = typeQuestion
    ? `${board} 점판에서 크기가 다른 ${shape}을 ${problem.targetKindCount}가지 찾아 그리세요.`
    : `${board} 점판에서 만들 수 있는 ${shape}은 모두 몇 개인가요?`;
  const answer = typeQuestion
    ? (showAnswer ? `모범 답: 크기가 다른 ${shape} ${problem.targetKindCount}가지` : `${problem.targetKindCount}가지 도형을 점판에 그리세요.`)
    : (showAnswer ? `정답: ${problem.answerValue}가지` : "알맞은 수에 표시하세요.");
  return { prompt, visual: `<div class="count-stage">${svg}${choices}${showAnswer && !typeQuestion ? `<strong class="count-answer">${problem.answerValue}가지</strong>` : ""}</div>`, answer };
}

function partitionProblem(problem, showAnswer) {
  const requiredPoint = problem.requiredVertex == null ? null : problem.outline[problem.requiredVertex];
  const solution = showAnswer ? problem.acceptedSolutions[0] : [];
  const lines = [closePoints(problem.outline), ...solution.map(([a, b]) => [problem.outline[a], problem.outline[b]])];
  const prompt = `${requiredPoint ? "표시한 점을 지나도록 " : ""}선 ${problem.lineTotal}개를 그어 삼각형 ${problem.targetTriangles}개와 사각형 ${problem.targetQuadrilaterals}개로 나누세요.`;
  return {
    prompt,
    visual: `<div class="partition-stage">${squareBoardSvg({ size: 5, lines, lineClass: showAnswer ? "partition-answer-line" : "partition-outline", label: "도형 나누기 점판", requiredPoint })}<div class="goal-chips"><span>선 ${problem.lineTotal}개</span><span>△ ${problem.targetTriangles}</span><span>□ ${problem.targetQuadrilaterals}</span></div></div>`,
    answer: showAnswer ? `모범 분할: 가능한 답 ${problem.validation.solutionCount}가지 중 한 가지` : "외곽선 안에 분할선을 그리세요."
  };
}

function problemContent(problem, showAnswer) {
  if (problem.kind === "open" || problem.kind === "closed") return modelAndWork(problem, showAnswer);
  if (problem.kind === "square-count" || problem.kind === "triangle-count") return countProblem(problem, showAnswer);
  return partitionProblem(problem, showAnswer);
}

function render() {
  const showAnswer = toggle.checked;
  const entries = selectedEntries();
  const selectedLevel = levels.find((item) => String(item.id) === select.value);
  const title = selectedLevel ? `${selectedLevel.id}단계 · ${copy[selectedLevel.id].title}` : "점판 도형 종합 활동";
  const description = selectedLevel
    ? `${curriculumBandLabel("geoboard", selectedLevel.id, "ko")} · ${copy[selectedLevel.id].description}  |  ${selectedLevel.stage} ${selectedLevel.difficulty}`
    : "1031 입문 · 입문 · 1031 초급 · 다섯 유형을 고르게 연습해 보세요.";
  $("#coverTitle").textContent = selectedLevel ? copy[selectedLevel.id].title : "점판 도형 종합 활동";
  $("#coverSubtitle").textContent = selectedLevel ? copy[selectedLevel.id].description : "선분 만들기부터 도형 나누기까지 차례로 연습합니다.";
  $("#coverLevel").textContent = selectedLevel ? curriculumBandLabel("geoboard", selectedLevel.id, "ko") : "1031 입문 · 초급";
  $("#coverCount").textContent = `${entries.length} QUESTIONS`;
  $("#coverSheet").hidden = !coverToggle.checked;
  worksheet.querySelectorAll(".sheet").forEach((sheet) => sheet.remove());
  let problemNumber = 1;
  const pages = splitEvenly(entries);
  pages.forEach((pageEntries, pageIndex) => {
    const sheet = sheetTemplate.content.firstElementChild.cloneNode(true);
    sheet.dataset.page = String(pageIndex + 1);
    sheet.querySelector(".sheet-title").textContent = title;
    sheet.querySelector(".sheet-description").textContent = description;
    sheet.querySelector(".page-number").textContent = `${pageIndex + 1} / ${pages.length}`;
    const grid = sheet.querySelector(".problem-grid");
    grid.style.setProperty("--row-count", String(Math.ceil(pageEntries.length / 2)));
    pageEntries.forEach(({ level, problem }) => {
      const content = problemContent(problem, showAnswer);
      const article = document.createElement("article");
      article.className = `problem kind-${problem.kind}${showAnswer ? " showing-answer" : ""}`;
      article.dataset.problemId = problem.id;
      article.dataset.kind = problem.kind;
      article.dataset.level = String(level.id);
      article.innerHTML = `<header><b>${problemNumber}</b><span><small>${level.id}. ${copy[level.id].title}</small>${content.prompt}</span></header><div class="visual">${content.visual}</div><div class="answer-line">${content.answer}</div>`;
      grid.append(article);
      problemNumber += 1;
    });
    worksheet.append(sheet);
  });
}

select.addEventListener("change", () => { offset = 0; render(); });
countInput.addEventListener("change", () => { offset = 0; render(); });
toggle.addEventListener("change", render);
coverToggle.addEventListener("change", render);
$("#refreshButton").addEventListener("click", () => {
  offset = (offset + requestedCount()) % 55;
  render();
});
$("#printButton").addEventListener("click", () => window.print());
render();
