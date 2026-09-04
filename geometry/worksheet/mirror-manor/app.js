import { levels } from "../../games/mirror-manor/levels.js?v=mirror-manor-11";
import { messages } from "../../games/mirror-manor/i18n.js?v=mirror-manor-11";
import { curriculumBandLabel } from "../../shared/curriculum-bands.js?v=curriculum-1";

const $ = (selector) => document.querySelector(selector);
const select = $("#levelSelect");
const countInput = $("#countInput");
const toggle = $("#answerToggle");
const coverToggle = $("#coverToggle");
const worksheet = $("#worksheet");
const sheetTemplate = $("#sheetTemplate");
let offset = 0;
const cellKey = (cell) => cell.join(",");

const allOption = document.createElement("option");
allOption.value = "all";
allOption.textContent = `전체 유형 · ${levels.reduce((sum, level) => sum + level.problems.length, 0)}문항`;
select.append(allOption);
levels.forEach((level) => {
  const option = document.createElement("option");
  option.value = level.id;
  option.textContent = `${level.id}. ${messages.ko[level.titleKey]} · ${level.difficulty}`;
  select.append(option);
});

function requestedCount() {
  const count = Math.max(1, Math.min(20, Math.round(Number(countInput.value) || 6)));
  countInput.value = String(count);
  return count;
}

function balancedEntries(count) {
  return Array.from({ length: count }, (_, index) => {
    const position = index + offset;
    const level = levels[position % levels.length];
    const problemIndex = Math.floor(position / levels.length) % level.problems.length;
    return { level, problem: level.problems[problemIndex] };
  });
}

function selectedEntries() {
  const count = requestedCount();
  const level = levels.find((item) => String(item.id) === select.value);
  if (!level || count > level.problems.length) {
    select.value = "all";
    return balancedEntries(count);
  }
  return Array.from({ length: count }, (_, index) => ({
    level,
    problem: level.problems[(offset + index) % level.problems.length]
  }));
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
  const showAnswers = toggle.checked;
  const entries = selectedEntries();
  const selectedLevel = levels.find((item) => String(item.id) === select.value);
  const title = selectedLevel ? messages.ko[selectedLevel.titleKey] : "거울대칭 종합 활동";
  const description = selectedLevel
    ? `${curriculumBandLabel("mirror-manor", selectedLevel.id, "ko")} · ${selectedLevel.difficulty} · ${messages.ko[selectedLevel.descKey]}`
    : "초등팩토 1 · 1031 입문 · 입문 · 다섯 유형을 고르게 연습해 보세요.";
  $("#coverTitle").textContent = title;
  $("#coverSubtitle").textContent = selectedLevel ? messages.ko[selectedLevel.descKey] : "반쪽 칠하기부터 두 거울까지 차례로 연습합니다.";
  $("#coverLevel").textContent = selectedLevel ? curriculumBandLabel("mirror-manor", selectedLevel.id, "ko") : "초등팩토 1 · 1031 입문";
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
      const article = document.createElement("article");
      article.className = `problem interaction-${problem.interaction}`;
      article.dataset.problemId = problem.id;
      article.dataset.level = String(level.id);
      article.innerHTML = `<header><b>${problemNumber}</b><span><small>${level.id}. ${messages.ko[level.titleKey]}</small>${promptFor(problem)}</span></header>${problemVisual(problem, showAnswers)}<div class="answer-line">${showAnswers ? "정답 표시" : ""}</div>`;
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
$("#refreshButton").addEventListener("click", () => { offset = (offset + requestedCount()) % 50; render(); });
$("#printButton").addEventListener("click", () => print());
render();
