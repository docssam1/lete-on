import { levels } from "../../games/mirror-manor/levels.js?v=mirror-manor-11";
import { messages } from "../../games/mirror-manor/i18n.js?v=mirror-manor-11";

const $ = (selector) => document.querySelector(selector);
const select = $("#levelSelect");
const toggle = $("#answerToggle");
const grid = $("#problemGrid");
let offset = 0;
const cellKey = (cell) => cell.join(",");

levels.forEach((level) => {
  const option = document.createElement("option");
  option.value = level.id;
  option.textContent = `${level.id}. ${messages.ko[level.titleKey]} · ${level.difficulty}`;
  select.append(option);
});

function boardCells(problem, answer) {
  const given = new Set((problem.sourceCells || problem.givens?.flatMap((item) => item.cells) || []).map(cellKey));
  const targets = new Set((problem.targetCells || problem.targets?.flatMap((item) => item.cells) || []).map(cellKey));
  const vertical = problem.axis.kind === "double" ? problem.axis.verticalAt : problem.axis.kind === "vertical" ? problem.axis.at : null;
  const horizontal = problem.axis.kind === "double" ? problem.axis.horizontalAt : problem.axis.kind === "horizontal" ? problem.axis.at : null;
  const cells = Array.from({ length: problem.grid.cols * problem.grid.rows }, (_, index) => {
    const x = index % problem.grid.cols;
    const y = Math.floor(index / problem.grid.cols);
    const id = `${x},${y}`;
    const classes = ["sheet-cell"];
    if (given.has(id)) classes.push("given");
    if (answer && targets.has(id)) classes.push("answer");
    return `<i class="${classes.join(" ")}"></i>`;
  }).join("");
  return `<div class="mirror-board" style="--cols:${problem.grid.cols};--rows:${problem.grid.rows};--mirror-left:${vertical === null ? 0 : (vertical / problem.grid.cols) * 100}%;--mirror-top:${horizontal === null ? 0 : (horizontal / problem.grid.rows) * 100}%">${cells}${vertical !== null ? '<b class="mirror vertical"></b>' : ""}${horizontal !== null ? '<b class="mirror horizontal"></b>' : ""}</div>`;
}

function dotBoard(problem, answer) {
  const dots = Array.from({ length: problem.grid.cols * problem.grid.rows }, (_, index) => {
    const x = index % problem.grid.cols;
    const y = Math.floor(index / problem.grid.cols);
    const source = cellKey([x, y]) === cellKey(problem.sourceCell);
    return `<i class="dot${source ? " source" : ""}" style="left:${((x + .5) / problem.grid.cols) * 100}%;top:${((y + .5) / problem.grid.rows) * 100}%"></i>`;
  }).join("");
  const choices = problem.choices.map((choice, index) => {
    const correct = cellKey(choice) === cellKey(problem.targetCell);
    return `<b class="dot-choice${answer && correct ? " correct" : ""}" style="left:${((choice[0] + .5) / problem.grid.cols) * 100}%;top:${((choice[1] + .5) / problem.grid.rows) * 100}%">${index + 1}</b>`;
  }).join("");
  return `<div class="dot-board ${problem.grid.lattice}">${dots}${choices}<span class="dot-mirror"></span></div>`;
}

function symbolBoard(problem, answer) {
  const answerId = problem.choices.find((choice) => choice.kind === "mirror")?.id;
  const choices = problem.choices.map((choice, index) => `<li class="${answer && choice.id === answerId ? "correct" : ""}"><b>${index + 1}</b><span class="glyph ${choice.kind} axis-${problem.axis.kind}">${choice.text}</span></li>`).join("");
  return `<div class="symbol-question"><div class="source-glyph">${problem.sourceText}</div><span class="glass-line"></span><ol>${choices}</ol></div>`;
}

function trayShapes(problem) {
  return `<div class="paper-tray">${problem.tray.map((piece) => {
    const width = Math.max(...piece.shape.map(([x]) => x)) + 1;
    const height = Math.max(...piece.shape.map(([, y]) => y)) + 1;
    const filled = new Set(piece.shape.map(cellKey));
    return `<span style="--cols:${width};--rows:${height}">${Array.from({ length: width * height }, (_, index) => `<i class="${filled.has(`${index % width},${Math.floor(index / width)}`) ? "on" : ""}"></i>`).join("")}</span>`;
  }).join("")}</div>`;
}

function promptFor(problem) {
  if (problem.interaction === "paint-reflection") return "거울 반대편의 알맞은 칸을 색칠하세요.";
  if (problem.interaction === "drag-reflection") return "보기의 물건을 거울에 비친 자리에 그리세요.";
  if (problem.interaction === "distance-match") return "거울선에서 같은 줄·같은 거리인 점을 고르세요.";
  if (problem.interaction === "symbol-reflection") return "거울에 비친 글자나 기호를 고르세요.";
  return "두 거울에 비친 나머지 칸을 모두 색칠하세요.";
}

function problemVisual(problem, answer) {
  if (problem.interaction === "distance-match") return dotBoard(problem, answer);
  if (problem.interaction === "symbol-reflection") return symbolBoard(problem, answer);
  return `${boardCells(problem, answer)}${problem.interaction === "drag-reflection" && !answer ? trayShapes(problem) : ""}`;
}

function render() {
  const level = levels[Number(select.value || 1) - 1];
  const showAnswers = toggle.checked;
  const problems = Array.from({ length: 6 }, (_, index) => level.problems[(offset + index) % level.problems.length]);
  $("#sheetTitle").textContent = messages.ko[level.titleKey];
  $("#sheetDescription").textContent = `${level.difficulty} · ${messages.ko[level.descKey]}`;
  grid.replaceChildren();
  problems.forEach((problem, index) => {
    const article = document.createElement("article");
    article.className = `problem interaction-${problem.interaction}`;
    article.innerHTML = `<header><b>${index + 1}</b><span>${promptFor(problem)}</span></header>${problemVisual(problem, showAnswers)}<div class="answer-line">${showAnswers ? "정답 표시" : ""}</div>`;
    grid.append(article);
  });
}

select.addEventListener("change", () => { offset = 0; render(); });
toggle.addEventListener("change", render);
$("#refreshButton").addEventListener("click", () => { offset = (offset + 6) % 10; render(); });
$("#printButton").addEventListener("click", () => print());
render();
