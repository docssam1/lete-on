import { visibleFaces } from "../../games/dice-roll/levels.js?v=dice-roll-3";
import { BOARD_BASIS, DIE_BASE_CENTER, DIE_FACE_QUADS, DIE_ON_BOARD_SCALE, VIEWPOINT_ID, boardFrame, cellCenter, cellPolygon, pointOnQuad, pointsAttribute } from "../../games/dice-roll/projection.js?v=dice-roll-1";
import { ACTIVITIES, chooseProblems, groupPages, normalizeActivity, normalizeCount, normalizeLanguage, normalizeLevel, validateProblem } from "./workbook-core.js?v=dice-sheet-6";

const $ = (selector) => document.querySelector(selector);
const escape = (value) => String(value).replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));
const params = new URLSearchParams(location.search);
const activitySelect = $("#activitySelect"), levelSelect = $("#levelSelect"), countInput = $("#countInput"), coverToggle = $("#coverToggle"), answerToggle = $("#answerToggle"), languageSelect = $("#languageSelect"), worksheet = $("#worksheet");
let language = normalizeLanguage(params.get("lang"));
let round = /^\d+$/.test(params.get("round") || "") ? Number(params.get("round")) >>> 0 : 0;
const seed = /^\d+$/.test(params.get("seed") || "") ? Number(params.get("seed")) >>> 0 : crypto.getRandomValues(new Uint32Array(1))[0];
let problems = [];

const COPY = {
  ko: { title: "주사위 굴리기", worksheet: "문제은행 학습지", activity: "활동", level: "난이도", count: "문항 수", language: "언어", cover: "표지", answers: "정답·풀이", newSet: "새 문제", print: "인쇄", all: "모든 활동 섞기", levels: ["", "", "2 · 짧은 경로", "3 · 꺾인 경로", "4 · 긴 경로", "5 · 종합 추리"], name: "이름", date: "날짜", subtitle: "주사위의 세 면과 이동 방향을 연결해 밑면의 변화를 추리해요.", rule: "마주 보는 면의 눈의 합은 7입니다.", answer: "답", contents: "학습 내용", total: (q, p) => `${q}문항 · ${p}쪽`, prompt: { sequence: "주사위를 화살표 방향으로 굴릴 때, 각 칸에서 바닥에 닿는 면의 눈을 차례로 쓰세요.", target: "주사위를 화살표 방향으로 ㉠까지 굴릴 때, ㉠에서 바닥에 닿는 면의 눈을 구하세요.", sum: "주사위를 화살표 방향으로 굴릴 때, 표시한 칸에서 바닥에 닿는 면의 눈을 모두 더하세요.", paired: "같은 주사위 2개를 각각 굴렸더니 색칠한 마지막 칸에 같은 눈이 닿았습니다. 둘째 주사위의 ㉠에 있는 눈을 구하세요.", visible: "화살표를 따라 끝까지 굴린 뒤 주사위의 윗면·앞면·오른쪽 면의 눈을 쓰세요." }, solution: { sequence: "한 칸씩 굴리며 밑면을 기록합니다.", target: "여섯 면의 자리를 한 칸씩 바꾸어 마지막 밑면을 찾습니다.", sum: "경로의 밑면을 기록한 뒤 표시한 칸의 눈만 더합니다.", paired: "첫째 주사위의 마지막 밑면을 찾고 둘째 경로를 거꾸로 따라갑니다.", visible: "한 칸씩 굴린 뒤 마지막 방향의 세 면을 읽습니다." }, face: { top: "윗면", front: "앞면", right: "오른쪽 면" } },
  en: { title: "Dice Rolling", worksheet: "Question Bank Worksheet", activity: "Activity", level: "Level", count: "Questions", language: "Language", cover: "Cover", answers: "Answers", newSet: "New set", print: "Print", all: "Mix all activities", levels: ["", "", "2 · Short route", "3 · Turning route", "4 · Long route", "5 · Combined reasoning"], name: "Name", date: "Date", subtitle: "Connect the three visible faces with each roll to track the bottom face.", rule: "Opposite faces add to 7.", answer: "Answer", contents: "Contents", total: (q, p) => `${q} questions · ${p} pages`, prompt: { sequence: "Roll the die along the arrows. Record the bottom face on each cell.", target: "Roll the die to ㉠. Find the number touching the board at ㉠.", sum: "Add the bottom-face numbers on all marked cells.", paired: "Two identical dice finish with the same face touching the colored cell. Find the hidden face ㉠ on the second die.", visible: "Roll to the end, then record the top, front, and right faces." }, solution: { sequence: "Roll one cell at a time and record each bottom face.", target: "Move all six faces one step at a time and read the last bottom face.", sum: "Record every bottom face, then add only the marked cells.", paired: "Find the first final bottom face, then trace the second route backward.", visible: "Roll one cell at a time and read the three final faces." }, face: { top: "Top", front: "Front", right: "Right" } },
  zh: { title: "骰子滚动", worksheet: "题库练习纸", activity: "活动", level: "难度", count: "题数", language: "语言", cover: "封面", answers: "答案", newSet: "新题", print: "打印", all: "混合所有活动", levels: ["", "", "2 · 短路线", "3 · 转弯路线", "4 · 长路线", "5 · 综合推理"], name: "姓名", date: "日期", subtitle: "结合可见的三个面和滚动方向，推理底面的变化。", rule: "相对两个面的点数和是7。", answer: "答案", contents: "学习内容", total: (q, p) => `${q}题 · ${p}页`, prompt: { sequence: "沿箭头滚动骰子，依次写出每格接触底板的点数。", target: "把骰子滚到㉠，求㉠处接触底板的点数。", sum: "求所有标记格中接触底板的点数之和。", paired: "两个相同骰子到达色格时接触底板的点数相同。求第二个骰子的㉠。", visible: "沿箭头滚到终点，写出上面、前面和右面的点数。" }, solution: { sequence: "每次滚动一格并记录底面。", target: "逐格移动六个面的位置，找出最后的底面。", sum: "先记录所有底面，再只加标记格。", paired: "先找第一个骰子的终点底面，再逆推第二条路线。", visible: "逐格滚动后读取终点的三个面。" }, face: { top: "上面", front: "前面", right: "右面" } },
  ja: { title: "さいころを転がす", worksheet: "問題バンク学習プリント", activity: "活動", level: "難易度", count: "問題数", language: "言語", cover: "表紙", answers: "答え", newSet: "新しい問題", print: "印刷", all: "すべての活動を混ぜる", levels: ["", "", "2 · 短い経路", "3 · 曲がる経路", "4 · 長い経路", "5 · 総合推理"], name: "名前", date: "日付", subtitle: "見える3面と転がす向きを結びつけ、底面の変化を考えます。", rule: "向かい合う面の目の和は7です。", answer: "答え", contents: "学習内容", total: (q, p) => `${q}問 · ${p}ページ`, prompt: { sequence: "矢印の向きに転がし、各マスで底板につく目を順に書きましょう。", target: "㉠まで転がしたとき、底板につく目を求めましょう。", sum: "印のあるマスで底板につく目をすべて足しましょう。", paired: "同じさいころ2個は色のマスで同じ目が底板につきます。2個目の㉠を求めましょう。", visible: "最後まで転がし、上・前・右の面の目を書きましょう。" }, solution: { sequence: "1マスずつ転がして底面を記録します。", target: "6面の位置を1マスずつ動かし、最後の底面を調べます。", sum: "すべての底面を記録し、印のマスだけを足します。", paired: "1個目の最後の底面を調べ、2本目の経路を逆にたどります。", visible: "1マスずつ転がし、最後の3面を読みます。" }, face: { top: "上面", front: "前面", right: "右面" } }
};

const PIPS = { 1: [[.5, .5]], 2: [[.25, .25], [.75, .75]], 3: [[.24, .24], [.5, .5], [.76, .76]], 4: [[.25, .25], [.75, .25], [.25, .75], [.75, .75]], 5: [[.23, .23], [.77, .23], [.5, .5], [.23, .77], [.77, .77]], 6: [[.25, .2], [.75, .2], [.25, .5], [.75, .5], [.25, .8], [.75, .8]] };
let markerSerial = 0;
const copy = () => COPY[language];
const markerLabels = () => language === "ko" ? ["가", "나", "다"] : ["A", "B", "C"];

function facePips(face, quad, value, hiddenFace, reveal) {
  if (hiddenFace === face && !reveal) {
    const [x, y] = pointOnQuad(quad, .5, .5);
    return `<text class="unknown-face" x="${x}" y="${y + 6}">㉠</text>`;
  }
  return PIPS[value].map(([u, v]) => {
    const [cx, cy] = pointOnQuad(quad, u, v);
    return `<circle cx="${cx}" cy="${cy}" r="4.2"/>`;
  }).join("");
}

function dieFaces(orientation, hiddenFace = null, reveal = false) {
  const visible = visibleFaces(orientation);
  return Object.entries(DIE_FACE_QUADS).map(([face, quad]) => `<polygon class="die-face ${face}${hiddenFace === face && !reveal ? " unknown" : ""}" points="${pointsAttribute(quad)}"/>${facePips(face, quad, visible[face], hiddenFace, reveal)}`).join("");
}

function boardDie(orientation, x, y, hiddenFace, reveal) {
  const scale = DIE_ON_BOARD_SCALE, tx = x - DIE_BASE_CENTER[0] * scale, ty = y - DIE_BASE_CENTER[1] * scale;
  return `<g class="board-die" transform="translate(${tx} ${ty}) scale(${scale})" data-contact-center="${x},${y}" data-local-base="${DIE_BASE_CENTER}">${dieFaces(orientation, hiddenFace, reveal)}</g>`;
}

function dieSvg(orientation, blank = false, hiddenFace = null, reveal = false) {
  const faces = blank ? Object.entries(DIE_FACE_QUADS).map(([face, quad]) => `<polygon class="die-face ${face} blank" points="${pointsAttribute(quad)}"/>`).join("") : dieFaces(orientation, hiddenFace, reveal);
  return `<svg class="die-svg${blank ? " blank" : ""}" viewBox="12 4 140 126" aria-hidden="true">${faces}</svg>`;
}

function targetStepsFor(problem, board) {
  if (problem.activity === "sequence") return board.bottomValues.map((_, index) => index);
  if (problem.activity === "sum") return problem.targetSteps;
  if (problem.activity === "target" || problem.activity === "paired") return [board.bottomValues.length - 1];
  return [];
}

function stepLabel(problem, board, index, targetIndex, reveal) {
  if (targetIndex < 0) return "";
  if (reveal) return board.bottomValues[index];
  if (problem.activity === "sequence") return index + 1;
  if (problem.activity === "target") return "㉠";
  if (problem.activity === "sum") return markerLabels()[targetIndex];
  return "";
}

function boardSvg(problem, board, boardIndex, reveal) {
  const frame = boardFrame(board.rows, board.cols), start = board.path[0], markerId = `sheet-arrow-${markerSerial += 1}`, targets = targetStepsFor(problem, board);
  const cells = Array.from({ length: board.rows * board.cols }, (_, index) => {
    const row = Math.floor(index / board.cols), column = index % board.cols;
    const pathStep = board.path.findIndex(([r, c], step) => step > 0 && r === row && c === column) - 1;
    return `<polygon class="board-cell${targets.includes(pathStep) ? " target" : ""}" points="${pointsAttribute(cellPolygon(row, column, frame))}"/>`;
  }).join("");
  const arrows = board.path.slice(1).map((cell, index) => {
    const previous = board.path[index], fromCenter = cellCenter(previous[0], previous[1], frame), toCenter = cellCenter(cell[0], cell[1], frame), dx = toCenter[0] - fromCenter[0], dy = toCenter[1] - fromCenter[1];
    return `<line x1="${fromCenter[0] + dx * .28}" y1="${fromCenter[1] + dy * .28}" x2="${toCenter[0] - dx * .2}" y2="${toCenter[1] - dy * .2}" marker-end="url(#${markerId})" data-direction="${board.directions[index]}" data-vector="${dx},${dy}"/>`;
  }).join("");
  const labels = board.path.slice(1).map((cell, index) => {
    const targetIndex = targets.indexOf(index), label = stepLabel(problem, board, index, targetIndex, reveal);
    if (label === "") return "";
    const center = cellCenter(cell[0], cell[1], frame);
    return `<circle class="step-back" cx="${center[0]}" cy="${center[1]}" r="15"/><text class="step-label" x="${center[0]}" y="${center[1] + 5}">${label}</text>`;
  }).join("");
  const hiddenFace = problem.activity === "paired" && boardIndex === 1 ? problem.unknownFace : null;
  const die = boardDie(board.startOrientation, ...cellCenter(start[0], start[1], frame), hiddenFace, reveal);
  return `<svg class="route-board" viewBox="0 0 ${frame.width} ${frame.height}" role="img" aria-label="${escape(copy().title)}" data-viewpoint="${VIEWPOINT_ID}" data-east-vector="${BOARD_BASIS.east}" data-south-vector="${BOARD_BASIS.south}" data-route="${board.directions.join("")}"><defs><marker id="${markerId}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z"/></marker></defs>${cells}${arrows}${die}${labels}<path class="view-corner" d="M ${frame.origin[0] - 18} ${frame.height - 7} L ${frame.origin[0]} ${frame.height - 1} L ${frame.origin[0] + 18} ${frame.height - 7}"/></svg>`;
}

function answerText(problem) {
  if (problem.activity !== "visible") return String(problem.answer);
  return Object.entries(problem.answer).map(([face, value]) => `${copy().face[face]} ${value}`).join(" · ");
}

function responseMarkup(problem, reveal) {
  if (reveal) return `<div class="answer-box"><strong>${escape(copy().answer)}: ${escape(answerText(problem))}</strong><p>${escape(copy().solution[problem.activity])}</p></div>`;
  if (problem.activity === "sequence") return `<div class="sequence-slots">${problem.boards[0].bottomValues.map((_, index) => `<span><b>${index + 1}</b></span>`).join("")}</div>`;
  if (problem.activity === "visible") return `<div class="face-slots">${Object.values(copy().face).map((label) => `<label>${escape(label)}<span></span></label>`).join("")}</div>`;
  if (problem.activity === "sum") return `<div class="sum-slots">${problem.targetSteps.map((_, index) => `<span>${markerLabels()[index]} <b></b></span>`).join("")}<i>=</i><strong></strong></div>`;
  return `<div class="write-answer">${escape(copy().answer)} <span></span></div>`;
}

function problemVisual(problem, reveal) {
  if (problem.activity === "paired") return `<div class="paired-boards">${problem.boards.map((board, index) => `<figure><figcaption>${index + 1}</figcaption>${boardSvg(problem, board, index, reveal)}</figure>`).join("")}</div>${responseMarkup(problem, reveal)}`;
  if (problem.activity === "visible") return `<div class="visible-work"><div>${boardSvg(problem, problem.boards[0], 0, reveal)}</div><div class="finish-die">${dieSvg(problem.boards[0].finalOrientation, !reveal)}<span>${reveal ? escape(answerText(problem)) : ""}</span></div></div>${responseMarkup(problem, reveal)}`;
  return `<div class="single-board">${boardSvg(problem, problem.boards[0], 0, reveal)}</div>${responseMarkup(problem, reveal)}`;
}

function problemMarkup(problem, number, reveal) {
  const activity = ACTIVITIES.find((item) => item.id === problem.activity);
  return `<article class="problem ${problem.activity}-problem" data-problem-id="${escape(problem.id)}" data-activity="${problem.activity}"><header><b>${number}</b><div><small>${escape(activity.names[language])}</small><p>${escape(copy().prompt[problem.activity])}</p></div></header><div class="problem-visual">${problemVisual(problem, reveal)}</div></article>`;
}

function coverMarkup(pages) {
  const included = ACTIVITIES.filter((activity) => problems.some((problem) => problem.activity === activity.id));
  return `<section id="coverSheet" class="book-cover"${coverToggle.checked ? "" : " hidden"}><div class="cover-brand"><span>GFIELD GEOMETRY</span><strong>${escape(copy().worksheet)}</strong></div><div class="cover-copy"><p>DICE ROLLING</p><h1>${escape(copy().title)}</h1><div class="cover-rule"></div><p class="cover-subtitle">${escape(copy().subtitle)}<br>${escape(copy().rule)}</p></div><div class="cover-mascots" aria-hidden="true"><i class="gw-char gw-char-cubie"></i><i class="gw-char gw-char-box"></i></div><div class="dice-cover-contents"><strong>${escape(copy().contents)}</strong>${included.map((activity) => `<span>${escape(activity.names[language])}</span>`).join("")}</div><div class="cover-meta"><div><span>${escape(copy().name)}</span><i></i></div><div><span>${escape(copy().date)}</span><i></i></div><div><strong>${escape(copy().total(problems.length, pages.length + 1))}</strong></div></div><footer class="cover-footer"><span>GFIELD · GEOMETRY WORKBOOK</span><b>1 / ${pages.length + 1}</b></footer></section>`;
}

function render() {
  problems.forEach(validateProblem);
  const pages = groupPages(problems), reveal = answerToggle.checked, offset = +coverToggle.checked;
  let number = 1;
  worksheet.innerHTML = coverMarkup(pages) + pages.map((page, index) => `<section class="sheet" data-page="${index + 1 + offset}"><header class="sheet-head"><div><small>GFIELD · ${escape(copy().worksheet)}</small><h1>${escape(copy().title)}</h1><p>${escape(copy().rule)}</p></div><div class="name-line">${escape(copy().name)} <span></span></div></header><div class="problem-grid">${page.map((problem) => problemMarkup(problem, number++, reveal)).join("")}</div><footer><span>${escape(copy().subtitle)}</span><b>${index + 1 + offset} / ${pages.length + offset}</b></footer></section>`).join("");
  worksheet.hidden = false;
  worksheet.dataset.answerMode = String(reveal);
  $("#countNotice").textContent = copy().total(problems.length, pages.length + offset);
  syncUrl();
}

function syncUrl() {
  const url = new URL(location.href);
  const state = { activity: activitySelect.value, level: levelSelect.value, count: problems.length, lang: language, cover: +coverToggle.checked, answers: +answerToggle.checked, seed, round };
  Object.entries(state).forEach(([key, value]) => url.searchParams.set(key, String(value)));
  history.replaceState(null, "", url);
}

function localize() {
  const currentActivity = activitySelect.value || "all";
  const currentLevel = normalizeLevel(levelSelect.value || params.get("level"));
  document.documentElement.lang = language;
  document.title = `${copy().title} | GFIELD`;
  document.querySelectorAll("[data-copy]").forEach((node) => { node.textContent = copy()[node.dataset.copy]; });
  activitySelect.innerHTML = `<option value="all">${escape(copy().all)}</option>` + ACTIVITIES.map((activity) => `<option value="${activity.id}">${escape(activity.names[language])}</option>`).join("");
  activitySelect.value = currentActivity;
  levelSelect.innerHTML = [2, 3, 4, 5].map((level) => `<option value="${level}">${escape(copy().levels[level])}</option>`).join("");
  levelSelect.value = String(currentLevel);
  languageSelect.value = language;
}

function generate() {
  countInput.value = normalizeCount(countInput.value);
  problems = chooseProblems(activitySelect.value, countInput.value, { level: levelSelect.value, seed, round });
  render();
}

activitySelect.value = normalizeActivity(params.get("activity"));
levelSelect.value = String(normalizeLevel(params.get("level")));
countInput.value = String(normalizeCount(params.get("count") ?? 20));
coverToggle.checked = params.get("cover") !== "0";
answerToggle.checked = params.get("answers") === "1";
localize();
activitySelect.value = normalizeActivity(params.get("activity"));
levelSelect.value = String(normalizeLevel(params.get("level")));
generate();

activitySelect.addEventListener("change", () => { round = 0; generate(); });
levelSelect.addEventListener("change", () => { round = 0; generate(); });
countInput.addEventListener("change", generate);
coverToggle.addEventListener("change", render);
answerToggle.addEventListener("change", render);
languageSelect.addEventListener("change", () => { language = normalizeLanguage(languageSelect.value); localize(); render(); });
$("#refreshButton").addEventListener("click", () => { round = (round + 1) >>> 0; generate(); });
$("#printButton").addEventListener("click", () => print());
