import { levels } from "../games/count-heights/levels.js";

const $ = (selector) => document.querySelector(selector);
let selectedProblems = [];

function shuffled(list) {
  return [...list].sort(() => Math.random() - .5);
}

function problemPool() {
  const level = $("#levelSelect").value;
  if (level === "all") return levels.flatMap((entry) => entry.problems);
  return levels[Number(level) - 1].problems;
}

function rotateHeights(heights) {
  return heights[0].map((_, column) => heights.map((row) => row[column]).reverse());
}

function mirrorHeights(heights) {
  return heights.map((row) => [...row].reverse());
}

function variantOf(problem, transform, suffix) {
  const heights = transform(problem.heights);
  return {
    ...problem,
    id: `${problem.id}-${suffix}`,
    board: [heights[0].length, heights.length],
    heights
  };
}

function pickProblems() {
  const pool = problemPool();
  const requested = Number($("#countSelect").value);
  const expanded = [
    ...pool,
    ...pool.map((problem) => variantOf(problem, rotateHeights, "rotated")),
    ...pool.map((problem) => variantOf(problem, mirrorHeights, "mirrored"))
  ];
  selectedProblems = shuffled(expanded).slice(0, requested);
}

function drawCube(context, x, z, y, originX, originY, size) {
  const half = size / 2;
  const depth = size * .48;
  const height = size * .72;
  const sx = originX + (x - z) * half;
  const sy = originY + (x + z) * depth / 2 - (y + 1) * height;
  const top = [[sx,sy-depth/2],[sx+half,sy],[sx,sy+depth/2],[sx-half,sy]];
  const left = [top[3],top[2],[top[2][0],top[2][1]+height],[top[3][0],top[3][1]+height]];
  const right = [top[2],top[1],[top[1][0],top[1][1]+height],[top[2][0],top[2][1]+height]];
  polygon(context, left, "#d3a955", "#84622c");
  polygon(context, right, "#bc8c3f", "#84622c");
  polygon(context, top, "#f0cf85", "#84622c");
}

function polygon(context, points, fill, stroke) {
  context.beginPath();
  context.moveTo(points[0][0], points[0][1]);
  points.slice(1).forEach(([x,y]) => context.lineTo(x,y));
  context.closePath();
  context.fillStyle = fill;
  context.fill();
  context.strokeStyle = stroke;
  context.lineWidth = 1;
  context.stroke();
}

function drawProblem(canvas, problem) {
  const ratio = 2;
  canvas.width = 300 * ratio;
  canvas.height = 150 * ratio;
  const context = canvas.getContext("2d");
  context.scale(ratio, ratio);
  const [width, depth] = problem.board;
  const size = Math.min(42, 150 / Math.max(width, depth));
  const originX = 150;
  const originY = 117 - Math.max(width, depth) * 6 + problem.maxHeight * 11;
  const cubes = [];
  problem.heights.forEach((row,z) => row.forEach((height,x) => {
    for (let y=0; y<height; y+=1) cubes.push({x,z,y});
  }));
  cubes.sort((a,b) => (a.x+a.z+a.y*.01) - (b.x+b.z+b.y*.01));
  cubes.forEach((cube) => drawCube(context,cube.x,cube.z,cube.y,originX,originY,size));
}

function renderQuestion(problem, index, target) {
  const article = document.createElement("article");
  article.className = "question";
  const occupied = problem.heights.flat().filter(Boolean);
  article.innerHTML = `
    <span class="question-number">${index+1}</span>
    <canvas class="cube-canvas"></canvas>
    <div class="height-grid">${occupied.map(() => '<span class="height-cell"></span>').join("")}</div>
    <div class="answer-line"><span>전체</span><i></i><span>개</span></div>
  `;
  target.append(article);
  drawProblem(article.querySelector("canvas"), problem);
}

function createQuestionSheet(pageIndex, pageCount) {
  const section = document.createElement("section");
  section.className = "sheet question-sheet";
  section.innerHTML = `
    <header class="sheet-header">
      <div><span>GFIELD CUBE TOWN</span><h1>쌓기나무 개수 세기</h1></div>
      <div class="student-lines"><span>이름</span><i></i><span>날짜</span><i></i></div>
    </header>
    <div class="sheet-kicker"><p>각 자리의 가장 높은 층수를 쓰고 모두 더하여 전체 개수를 구하세요.</p><b>${pageIndex + 1} / ${pageCount}</b></div>
    <div class="question-grid"></div>
  `;
  $("#questionSheets").append(section);
  return section.querySelector(".question-grid");
}

function renderAnswer(problem, index) {
  const article = document.createElement("article");
  article.className = "answer-item";
  const heights = problem.heights.flat().filter(Boolean);
  article.innerHTML = `<h2>${index+1}번</h2><div class="answer-heights">${heights.map((height) => `<span>${height}</span>`).join("")}</div><p class="answer-total">전체 <b>${problem.answer.total}</b>개</p>`;
  $("#answers").append(article);
}

function generate() {
  pickProblems();
  $("#questionSheets").replaceChildren();
  $("#answers").replaceChildren();
  const pageCount = Math.ceil(selectedProblems.length / 5);
  for (let page = 0; page < pageCount; page += 1) {
    const target = createQuestionSheet(page, pageCount);
    selectedProblems.slice(page * 5, page * 5 + 5).forEach((problem, offset) => {
      renderQuestion(problem, page * 5 + offset, target);
    });
  }
  selectedProblems.forEach(renderAnswer);
  const selectedLevel = $("#levelSelect").value;
  $("#coverLevel").textContent = selectedLevel === "all" ? "전체 혼합" : `레벨 ${selectedLevel}`;
  $("#coverCount").textContent = `${selectedProblems.length} QUESTIONS`;
  $("#coverSheet").hidden = !$("#coverToggle").checked;
  $("#answerSheet").hidden = !$("#answerToggle").checked;
}

$("#levelSelect").addEventListener("change", generate);
$("#countSelect").addEventListener("change", generate);
$("#coverToggle").addEventListener("change", () => { $("#coverSheet").hidden = !$("#coverToggle").checked; });
$("#answerToggle").addEventListener("change", () => { $("#answerSheet").hidden = !$("#answerToggle").checked; });
$("#generate").addEventListener("click", generate);
$("#printButton").addEventListener("click", () => window.print());
generate();
