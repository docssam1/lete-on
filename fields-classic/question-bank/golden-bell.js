import { GOLDEN_BELL_BOOKS, goldenBellBookById } from "./golden-bell-data.js?v=20260828r";
import { book05Markup } from "./book05-renderers.js?v=20260828n";
import { book06Markup } from "./book06-renderers.js?v=20260828p";
import { book07Markup } from "./book07-renderers.js?v=20260828q";
import { book08Markup } from "./book08-renderers.js?v=20260828r";

const $ = (id) => document.getElementById(id);
const params = new URLSearchParams(location.search);
const student = params.get("student") || "DEMO";
const requestedBook = params.get("book") || "book-01";
const storageKey = `fields-classic-golden-bell:${student}`;

function loadProgress() {
  try { return JSON.parse(localStorage.getItem(storageKey) || "{}") || {}; }
  catch { return {}; }
}

const state = {
  bookId: goldenBellBookById(requestedBook).id,
  lessonId: null,
  phase: "concept",
  selections: {},
  feedback: null,
  progress: loadProgress()
};

function saveProgress() {
  localStorage.setItem(storageKey, JSON.stringify(state.progress));
}

function activeBook() { return goldenBellBookById(state.bookId); }
function activeLesson() { return activeBook().lessons.find((lesson) => lesson.id === state.lessonId) || activeBook().lessons[0]; }
function lessonProgress(lesson = activeLesson()) { return state.progress[state.bookId]?.[lesson?.id] || {}; }

function completeOriginal() {
  const lesson = activeLesson();
  state.progress[state.bookId] ||= {};
  state.progress[state.bookId][lesson.id] ||= {};
  state.progress[state.bookId][lesson.id].original = true;
  saveProgress();
}

function completeExtension() {
  const lesson = activeLesson();
  state.progress[state.bookId] ||= {};
  state.progress[state.bookId][lesson.id] ||= {};
  state.progress[state.bookId][lesson.id].extension = true;
  state.progress[state.bookId][lesson.id].completedAt = new Date().toISOString();
  saveProgress();
}

function isLessonComplete(lesson) { return Boolean(lessonProgress(lesson).original && lessonProgress(lesson).extension); }

function phaseAllowed(phase) {
  const progress = lessonProgress();
  if (phase === "concept" || phase === "original") return true;
  if (phase === "extension") return Boolean(progress.original);
  return Boolean(progress.original && progress.extension);
}

function setPhase(phase) {
  if (!phaseAllowed(phase)) return;
  state.phase = phase;
  state.selections = {};
  state.feedback = null;
  render();
}

function clockMarkup(value) {
  const handAngle = ((value % 12) * Math.PI) / 6;
  const handX = 100 + Math.sin(handAngle) * 34;
  const handY = 74 - Math.cos(handAngle) * 34;
  const markerId = `clock-arrow-${value}`;
  return `<svg class="clock-svg source-clock" viewBox="0 0 200 150" role="img" aria-label="12, 3, 6, 9가 표시되고 ${value}를 가리키는 시계 바늘"><defs><marker id="${markerId}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#178bc0" /></marker></defs><rect x="44" y="18" width="112" height="112" fill="#f5f6f7" /><text class="clock-cardinal" x="100" y="30">12</text><text class="clock-cardinal" x="144" y="74">3</text><text class="clock-cardinal" x="100" y="118">6</text><text class="clock-cardinal" x="56" y="74">9</text><line class="hand" x1="100" y1="74" x2="${handX.toFixed(1)}" y2="${handY.toFixed(1)}" marker-end="url(#${markerId})" /><circle cx="100" cy="74" r="9" fill="#a6a9ac" /><circle cx="100" cy="74" r="4" fill="#d9dcde" /></svg>`;
}

function foldNotchMarkup() {
  const option = (number, path) => `<figure><svg viewBox="0 0 120 72" aria-label="${number}번 펼친 모양"><rect class="paper" x="8" y="9" width="104" height="54" /><path class="crease" d="M60 9V63" />${path}</svg><figcaption>${number}번</figcaption></figure>`;
  return `<div class="fold-original"><svg viewBox="0 0 210 120" role="img" aria-label="왼쪽 색종이를 오른쪽으로 한 번 접고 칠해진 부분을 자르는 과정"><rect x="10" y="18" width="176" height="84" fill="#fff" stroke="#4e93aa" stroke-width="2" /><rect class="paper" x="98" y="18" width="88" height="84" /><path class="crease" d="M98 18V102" /><path d="M22 60H82" fill="none" stroke="#178bc0" stroke-width="3" /><path d="M74 52l10 8-10 8" fill="none" stroke="#178bc0" stroke-width="3" /><path d="M98 43h38l-15 17 15 17H98z" fill="#2d7d96" /></svg><div class="fold-options">${option(1,'<path class="cut" d="M38 24h22l-10 12 10 12H38z" />')}${option(2,'<path class="cut" d="M60 22L45 36 60 50 75 36z" />')}${option(3,'<path class="cut" d="M43 18h34L68 36l9 18H43l9-18z" />')}${option(4,'<path class="cut" d="M8 27l15 9-15 9zM112 27L97 36l15 9z" />')}</div></div>`;
}

function foldStoryMarkup() {
  const option = (number, stars) => `<figure><svg viewBox="0 0 120 72" aria-label="${number}번 펼친 초대장"><rect class="paper" x="8" y="9" width="104" height="54" /><path class="crease" d="M60 9V63" />${stars.map(([x, y]) => `<text class="story-star" x="${x}" y="${y}">★</text>`).join("")}</svg><figcaption>${number}번</figcaption></figure>`;
  return `<div class="fold-original"><svg viewBox="0 0 180 120" role="img" aria-label="초대장을 오른쪽으로 한 번 접고 별 모양 펀치로 뚫는 과정"><rect class="paper" x="8" y="18" width="164" height="84" /><path class="crease" d="M90 18V102" /><path d="M18 60H78" fill="none" stroke="#178bc0" stroke-width="3" /><path d="M70 52l10 8-10 8" fill="none" stroke="#178bc0" stroke-width="3" /><text class="story-star large" x="128" y="70">★</text></svg><div class="fold-options">${option(1,[[82,43]])}${option(2,[[38,43],[82,43]])}${option(3,[[76,35],[92,50]])}${option(4,[[32,35],[46,50],[76,35],[90,50]])}</div></div>`;
}

function valueCell(value, className = "") {
  return `<span class="${className} ${value == null ? "blank-value" : ""}">${value == null ? "?" : value}</span>`;
}

function lineDiagramMarkup(diagram) {
  if (diagram.shape === "tee") return `<div class="line-diagram"><div class="line-tee">${valueCell(diagram.left,"left")}${valueCell(diagram.center,"center")}${valueCell(diagram.right,"right")}${valueCell(diagram.down1,"down1")}${valueCell(diagram.down2,"down2")}</div></div>`;
  if (diagram.verticalMiddle != null) return `<div class="line-diagram"><div class="line-cross offset">${valueCell(diagram.top,"top")}${valueCell(diagram.center,"center")}${valueCell(diagram.right,"right")}${valueCell(diagram.verticalMiddle,"vmiddle")}${valueCell(diagram.bottom,"bottom")}</div></div>`;
  return `<div class="line-diagram"><div class="line-cross">${valueCell(diagram.top,"top")}${valueCell(diagram.left,"left")}${valueCell(diagram.center,"center")}${valueCell(diagram.right,"right")}${valueCell(diagram.bottom,"bottom")}</div></div>`;
}

function matrixShape(name) {
  const labels = { oval: "동그라미", triangle: "세모", square: "네모", diamond: "마름모" };
  return `<i class="matrix-shape ${name}" role="img" aria-label="${labels[name] || name}"></i>`;
}

function matrixEquationMarkup(left, right, sum) {
  return `<div class="matrix-equation">${matrixShape(left)}<b>+</b>${matrixShape(right)}<b>=</b><strong>${sum}</strong></div>`;
}

function matrixGridMarkup(grid) {
  const cell = (shape, name) => `<span class="${name}">${shape ? matrixShape(shape) : ""}</span>`;
  return `<div class="shape-matrix-grid">${cell(grid.topLeft,"tl")}${cell(grid.topRight,"tr")}${cell(grid.bottomLeft,"bl")}${cell(grid.bottomRight,"br")}<strong class="row-top">${grid.rowTop ?? ""}</strong><strong class="row-bottom">${grid.rowBottom ?? "?"}</strong><strong class="col-left">${grid.colLeft ?? ""}</strong><strong class="col-right">${grid.colRight ?? "?"}</strong></div>`;
}

function matrixPanelMarkup(panel) {
  const body = panel.equations
    ? `${panel.equations.map((row) => matrixEquationMarkup(row[0], row[1], row[2])).join("")}<div class="matrix-target">${matrixShape(panel.target)}<b>= ?</b></div>`
    : matrixGridMarkup(panel.grid);
  return `<figure class="matrix-panel"><figcaption>${panel.label}</figcaption>${body}</figure>`;
}

function book02MatrixMarkup(story = false) {
  const panels = story ? [
    { label: "", equations: [["oval", "square", 14], ["square", "square", 18]], target: "oval" }
  ] : [
    { label: "(1)", equations: [["oval", "oval", 4], ["oval", "triangle", 5]], target: "triangle" },
    { label: "(2)", equations: [["oval", "square", 12], ["square", "square", 16]], target: "oval" },
    { label: "(3)-1", grid: { topLeft: "triangle", topRight: "triangle", bottomLeft: "oval", bottomRight: null, rowTop: 18, rowBottom: null, colLeft: 15, colRight: null } },
    { label: "(3)-2", grid: { topLeft: "triangle", topRight: "triangle", bottomLeft: "oval", bottomRight: "square", rowTop: 18, rowBottom: null, colLeft: 15, colRight: 13 } },
    { label: "(4)", grid: { topLeft: "diamond", topRight: "diamond", bottomLeft: "square", bottomRight: "oval", rowTop: 12, rowBottom: null, colLeft: 15, colRight: 13 } },
    { label: "(5)", grid: { topLeft: "square", topRight: "diamond", bottomLeft: "square", bottomRight: "oval", rowTop: 11, rowBottom: 13, colLeft: 16, colRight: null } }
  ];
  return `<div class="matrix-panel-set ${story ? "single" : ""}">${panels.map(matrixPanelMarkup).join("")}</div>`;
}

function balanceBeamMarkup(left, right, heavySide) {
  const sideClass = heavySide === "left" ? "left-heavy" : heavySide === "right" ? "right-heavy" : "level";
  const accessibleLeft = String(left).replace(/<[^>]*>/g, "").trim() || "왼쪽 물체";
  const accessibleRight = String(right).replace(/<[^>]*>/g, "").trim() || "오른쪽 물체";
  return `<div class="balance-unit" role="img" aria-label="${accessibleLeft}와 ${accessibleRight}의 양팔저울"><div class="balance-load left">${left}</div><div class="balance-load right">${right}</div><div class="balance-beam ${sideClass}"><span></span><span></span></div><div class="balance-stand"></div></div>`;
}

function book02BalanceMarkup(story = false) {
  const balances = story
    ? [["🐰", "🐢", "left"], ["🐢", "🐿️", "left"]]
    : [["A", "B", "left"], ["C", "A", "right"], ["C", "B", "left"]];
  return `<div class="balance-set">${balances.map((item) => balanceBeamMarkup(...item)).join("")}</div>`;
}

function patternMarkup(story = false) {
  const symbols = story
    ? ["△", "■", "○", "☆", "▲", "□", "○", "★", "△", "■", "●", "☆", "?"]
    : ["○", "◆", "☆", "♡", "●", "◇", "☆", "♥", "○", "◇", "★", "♡", "○", "?"];
  return `<div class="dual-pattern" role="img" aria-label="모양과 색이 함께 반복되는 규칙">${symbols.map((symbol, index) => `<span class="${symbol === "?" ? "pattern-blank" : ""}">${symbol === "?" ? "" : symbol}</span>${index < symbols.length - 1 ? "" : ""}`).join("")}</div>`;
}

function promiseDiamondMarkup(diagram) {
  return `<div class="promise-diamond">${valueCell(diagram.top,"promise-top")}${valueCell(diagram.left,"promise-left")}${valueCell(diagram.right,"promise-right")}${valueCell(diagram.bottom,"promise-bottom")}</div>`;
}

function book02PromiseMarkup(story = false) {
  const diagrams = story ? [
    { top: 10, left: 2, right: 3, bottom: 5 },
    { top: 15, left: 4, right: 5, bottom: 6 },
    { top: null, left: 6, right: 7, bottom: 8 }
  ] : [
    { top: 6, left: 1, right: 2, bottom: 3 },
    { top: 12, left: 2, right: 3, bottom: 7 },
    { top: 16, left: 5, right: 7, bottom: 4 },
    { top: null, left: 1, right: 8, bottom: 9 },
    { top: 21, left: 10, right: null, bottom: 2 }
  ];
  return `<div class="promise-set">${diagrams.map(promiseDiamondMarkup).join("")}</div>`;
}

function book03SixMarkup(story = false) {
  if (story) return '<div class="equation-board single"><span>8 × 25 + 16</span><b>=</b><span>8 × <i>□</i></span></div>';
  const equations = [
    "6 + 6 + 6 + 6 + 60 = 6 × □",
    "6 × 20 + 6 = 6 × □",
    "6 × 28 + 6 + 6 = 6 × □",
    "6 + 6 + 6 + 6 = 6 × □ = 12 × □ = 24 × □",
    "12 × 7 = 6 × □ = 3 × □ = 2 × □",
    "6 × 124 - 6 = 6 × □",
    "6 × 79 - 12 = 6 × □",
    "275 × 6 - 18 = 6 × □"
  ];
  return `<div class="equation-board">${equations.map((equation) => `<span>${equation.replaceAll("□", "<i>□</i>")}</span>`).join("")}</div>`;
}

function unitBarMarkup(count, label) {
  return `<div class="unit-bar" aria-label="${label} ${count}칸"><b>${label}</b><span>${Array.from({ length: count }, () => "<i></i>").join("")}</span></div>`;
}

function dotGroupMarkup(count, label) {
  return `<div class="dot-group" aria-label="${label} ${count}개"><b>${label}</b><span>${Array.from({ length: count }, () => "<i></i>").join("")}</span></div>`;
}

function book03MultipleMarkup(story = false) {
  if (story) return `<div class="multiple-story"><strong>48</strong><span>${Array.from({ length: 8 }, () => "<i>6</i>").join("")}</span></div>`;
  return `<div class="multiple-board"><div>${unitBarMarkup(1,"A")}${unitBarMarkup(4,"B")}</div><div>${dotGroupMarkup(6,"A")}${dotGroupMarkup(1,"B")}</div><div class="multiple-facts"><span>6+6+6+6+6+6+6 = 42</span><span>16은 8과 2의 배수</span><span>35는 7과 5의 배수</span></div></div>`;
}

function verticalAdditionMarkup(rows, label) {
  const result = rows.at(-1);
  const addends = rows.slice(0, -1);
  return `<figure class="vertical-addition"><figcaption>${label}</figcaption><div>${addends.map((row, index) => `<span>${index === addends.length - 1 ? "<b>+</b>" : ""}${row}</span>`).join("")}<strong>${result}</strong></div></figure>`;
}

function book03CryptarithmMarkup(story = false) {
  const panels = story
    ? [["□", "□", "□", "△2"]]
    : [["□", "□", "6"], ["□", "□", "△6"], ["□", "□", "□", "6"], ["□", "□", "□", "△1"]];
  return `<div class="vertical-addition-set ${story ? "single" : ""}">${panels.map((rows, index) => verticalAdditionMarkup(rows, story ? "" : `(${index + 1})`)).join("")}</div>`;
}

function magicGridMarkup(cells, label) {
  return `<figure class="magic-grid-wrap"><figcaption>${label}</figcaption><div class="magic-grid">${cells.map((cell) => `<span class="${cell === "△" ? "target" : ""}">${cell ?? ""}</span>`).join("")}</div></figure>`;
}

function book03MagicMarkup(story = false) {
  const grids = story
    ? [["2","7","6","9","5","1","4","△","8"]]
    : [
      [null,null,null,"6","10","14","8","△",null],
      ["12","9",null,null,"15",null,null,"△","18"],
      [null,null,"11","△","9",null,"7",null,"3"],
      [null,"3","8",null,"7","△","6",null,null]
    ];
  return `<div class="magic-grid-set ${story ? "single" : ""}">${grids.map((cells, index) => magicGridMarkup(cells, story ? "" : `${index + 1}`)).join("")}</div>`;
}

function polyominoShapeMarkup(cells, label) {
  const width = Math.max(...cells.map(([x]) => x)) + 1;
  const height = Math.max(...cells.map(([, y]) => y)) + 1;
  const blocks = cells.map(([x, y]) => `<i style="grid-column:${x + 1};grid-row:${y + 1}"></i>`).join("");
  return `<figure class="polyomino-shape" aria-label="${label}"><div style="--shape-columns:${width};--shape-rows:${height}">${blocks}</div></figure>`;
}

function polyominoFamilyMarkup(count, shapes) {
  return `<section class="polyomino-family"><strong>정사각형 ${count}개</strong><div>${shapes.map((shape, index) => polyominoShapeMarkup(shape, `${count}칸 모양 ${index + 1}`)).join("")}</div></section>`;
}

function book04PolyominoMarkup(story = false) {
  const families = [
    [1, [[[0, 0]]]],
    [2, [[[0, 0], [1, 0]]]],
    [3, [[[0, 0], [1, 0], [2, 0]], [[0, 0], [0, 1], [1, 1]]]],
    [4, [
      [[0, 0], [1, 0], [2, 0], [3, 0]],
      [[0, 0], [1, 0], [0, 1], [1, 1]],
      [[0, 0], [1, 0], [2, 0], [1, 1]],
      [[0, 0], [0, 1], [0, 2], [1, 2]],
      [[1, 0], [2, 0], [0, 1], [1, 1]]
    ]]
  ];
  const visible = story ? families.slice(2) : families;
  return `<div class="polyomino-board ${story ? "story" : ""}">${visible.map(([count, shapes]) => polyominoFamilyMarkup(count, shapes)).join("")}</div>`;
}

function cubeGlyphMarkup(x, y, size = 24) {
  const half = size / 2;
  const depth = size * 0.34;
  return `<g transform="translate(${x} ${y})"><path class="cube-top" d="M0 0L${half} ${-depth}L${size} 0L${half} ${depth}Z"/><path class="cube-front" d="M0 0L${half} ${depth}V${size + depth}L0 ${size}Z"/><path class="cube-side" d="M${size} 0L${half} ${depth}V${size + depth}L${size} ${size}Z"/></g>`;
}

function cubeSceneMarkup(cubes, label) {
  return `<figure class="cube-scene"><svg viewBox="0 0 150 118" role="img" aria-label="${label}">${cubes.map(([x, y]) => cubeGlyphMarkup(x, y)).join("")}</svg><figcaption>${label}</figcaption></figure>`;
}

function book04HiddenCubesMarkup(story = false) {
  const scenes = story ? [
    { label: "전체 8개 · 보이는 것 5개", cubes: [[28, 60], [52, 60], [40, 44], [64, 44], [52, 28]] }
  ] : [
    { label: "전체 4개 · 보이는 것 3개", cubes: [[34, 62], [58, 62], [46, 38]] },
    { label: "전체 9개 · 보이는 것 7개", cubes: [[22, 70], [46, 70], [70, 70], [34, 54], [58, 54], [82, 54], [46, 30]] },
    { label: "전체 10개 · 보이는 것 6개", cubes: [[18, 74], [42, 74], [66, 74], [30, 58], [54, 58], [42, 34]] }
  ];
  return `<div class="cube-scene-set ${story ? "single" : ""}">${scenes.map(({ cubes, label }) => cubeSceneMarkup(cubes, label)).join("")}</div>`;
}

function balanceTokensMarkup(symbol, count, className) {
  return `<span class="balance-tokens ${className}">${Array.from({ length: count }, () => `<i>${symbol}</i>`).join("")}</span>`;
}

function book04BalanceMarkup(story = false) {
  const square = (count) => balanceTokensMarkup("", count, "squares");
  const triangle = (count) => balanceTokensMarkup("", count, "triangles");
  const circle = (count) => balanceTokensMarkup("", count, "circles");
  const star = (count) => balanceTokensMarkup("★", count, "stars");
  if (story) return `<div class="balance-substitution single">${balanceBeamMarkup(star(1), square(2), "level")}${balanceBeamMarkup(circle(1), `${star(1)}${square(1)}`, "level")}</div>`;
  return `<div class="balance-substitution"><section><strong>(1)</strong>${balanceBeamMarkup(`${triangle(2)}${square(2)}`, square(6), "level")}${balanceBeamMarkup(circle(1), `${triangle(1)}${square(1)}`, "level")}</section><section><strong>(2)</strong>${balanceBeamMarkup(`${triangle(2)}${square(5)}`, `${triangle(3)}${square(3)}`, "level")}${balanceBeamMarkup(triangle(4), '<span class="balance-question">?</span>', "level")}</section></div>`;
}

function directionMapMarkup(markerIndex, label) {
  const cells = Array.from({ length: 4 }, (_, index) => `<span class="${index === markerIndex ? "target" : ""}"><i></i>${index === markerIndex ? "㉮" : ""}</span>`).join("");
  return `<figure class="direction-map"><div class="direction-grid">${cells}<b class="north">북</b><b class="south">남</b><b class="west">서</b><b class="east">동</b></div><figcaption>${label}</figcaption></figure>`;
}

function book04DirectionMarkup(story = false) {
  const maps = story ? [directionMapMarkup(0, "마을 건물")] : [directionMapMarkup(0, "장소"), directionMapMarkup(3, "친구의 집")];
  return `<div class="direction-map-set ${story ? "single" : ""}">${maps.join("")}</div>`;
}

function book05SetMarkup(visual) {
  return `<div class="gold-b5-set">${visual.panels.map((panel) => `<figure><div class="book05-visual">${book05Markup({ kind: "book5", ...panel.visual })}</div><figcaption>${panel.label}</figcaption></figure>`).join("")}</div>`;
}

function book06SetMarkup(visual) {
  return `<div class="gold-b6-set">${visual.panels.map((panel) => `<figure><div class="book06-visual">${book06Markup({ kind: "book6", ...panel.visual })}</div><figcaption>${panel.label}</figcaption></figure>`).join("")}</div>`;
}

function book07SetMarkup(visual) {
  return `<div class="gold-b7-set">${visual.panels.map((panel) => `<figure><div class="book07-visual">${book07Markup({ kind: "book7", ...panel.visual })}</div><figcaption>${panel.label}</figcaption></figure>`).join("")}</div>`;
}

function book08SetMarkup(visual) {
  return `<div class="gold-b8-set">${visual.panels.map((panel) => `<figure><div class="book08-visual">${book08Markup({ kind: "book8", ...panel.visual })}</div><figcaption>${panel.label}</figcaption></figure>`).join("")}</div>`;
}

function visualMarkup(visual) {
  if (!visual) return "";
  if (visual.kind === "clock") return clockMarkup(visual.value);
  if (visual.kind === "fold-notch-options") return foldNotchMarkup();
  if (visual.kind === "fold-story-options") return foldStoryMarkup();
  if (visual.kind === "fold-star") return '<div class="fold-star"><div class="folded"></div><b>→</b><strong>펼치기</strong></div>';
  if (visual.kind === "equal-line-set") return `<div class="line-diagram-set">${visual.diagrams.map(lineDiagramMarkup).join("")}</div>`;
  if (visual.kind === "equal-line") return lineDiagramMarkup({ shape: "cross", ...visual });
  if (visual.kind === "logic-cards") return '<div class="logic-visual"><span>A</span><span>B</span><span>C</span><b>↔</b><span>서로 다른 선택</span></div>';
  if (visual.kind === "logic-food") return '<div class="logic-visual"><span>민지</span><span>서윤</span><span>도윤</span><b>↔</b><span>김밥</span><span>샌드위치</span><span>떡볶이</span></div>';
  if (visual.kind === "book02-matrix-original") return book02MatrixMarkup(false);
  if (visual.kind === "book02-matrix-story") return book02MatrixMarkup(true);
  if (visual.kind === "book02-balance-original") return book02BalanceMarkup(false);
  if (visual.kind === "book02-balance-story") return book02BalanceMarkup(true);
  if (visual.kind === "book02-dual-pattern-original") return patternMarkup(false);
  if (visual.kind === "book02-dual-pattern-story") return patternMarkup(true);
  if (visual.kind === "book02-promise-original") return book02PromiseMarkup(false);
  if (visual.kind === "book02-promise-story") return book02PromiseMarkup(true);
  if (visual.kind === "book03-six-original") return book03SixMarkup(false);
  if (visual.kind === "book03-six-story") return book03SixMarkup(true);
  if (visual.kind === "book03-multiple-original") return book03MultipleMarkup(false);
  if (visual.kind === "book03-multiple-story") return book03MultipleMarkup(true);
  if (visual.kind === "book03-cryptarithm-original") return book03CryptarithmMarkup(false);
  if (visual.kind === "book03-cryptarithm-story") return book03CryptarithmMarkup(true);
  if (visual.kind === "book03-magic-original") return book03MagicMarkup(false);
  if (visual.kind === "book03-magic-story") return book03MagicMarkup(true);
  if (visual.kind === "book04-polyomino-original") return book04PolyominoMarkup(false);
  if (visual.kind === "book04-polyomino-story") return book04PolyominoMarkup(true);
  if (visual.kind === "book04-hidden-cubes-original") return book04HiddenCubesMarkup(false);
  if (visual.kind === "book04-hidden-cubes-story") return book04HiddenCubesMarkup(true);
  if (visual.kind === "book04-balance-original") return book04BalanceMarkup(false);
  if (visual.kind === "book04-balance-story") return book04BalanceMarkup(true);
  if (visual.kind === "book04-direction-original") return book04DirectionMarkup(false);
  if (visual.kind === "book04-direction-story") return book04DirectionMarkup(true);
  if (visual.kind === "book5") return `<div class="book05-visual">${book05Markup(visual)}</div>`;
  if (visual.kind === "book5-set") return book05SetMarkup(visual);
  if (visual.kind === "book6") return `<div class="book06-visual">${book06Markup(visual)}</div>`;
  if (visual.kind === "book6-set") return book06SetMarkup(visual);
  if (visual.kind === "book7") return `<div class="book07-visual">${book07Markup(visual)}</div>`;
  if (visual.kind === "book7-set") return book07SetMarkup(visual);
  if (visual.kind === "book8") return `<div class="book08-visual">${book08Markup(visual)}</div>`;
  if (visual.kind === "book8-set") return book08SetMarkup(visual);
  return "";
}

function renderBookTabs() {
  $("bookTabs").innerHTML = GOLDEN_BELL_BOOKS.map((book, index) => `<button type="button" class="${book.id === state.bookId ? "active" : ""} ${book.status}" data-book="${book.id}" ${book.id === state.bookId ? 'aria-current="page"' : ""}><span>${String(index + 1).padStart(2, "0")}</span><strong>${book.label}</strong></button>`).join("");
  $("bookTabs").querySelectorAll("button").forEach((button) => button.addEventListener("click", () => {
    state.bookId = button.dataset.book;
    state.lessonId = activeBook().lessons[0]?.id || null;
    state.phase = "concept";
    state.selections = {};
    state.feedback = null;
    const next = new URL(location.href);
    next.searchParams.set("book", state.bookId);
    history.replaceState(null, "", next);
    render();
  }));
  requestAnimationFrame(() => {
    const tabs = $("bookTabs");
    const activeTab = tabs.querySelector("button.active");
    if (activeTab) tabs.scrollLeft = activeTab.offsetLeft - (tabs.clientWidth - activeTab.offsetWidth) / 2;
  });
}

function renderLessonList() {
  const book = activeBook();
  if (!book.lessons.length) {
    $("lessonList").innerHTML = "";
    return;
  }
  $("lessonList").innerHTML = book.lessons.map((lesson, index) => {
    const complete = isLessonComplete(lesson);
    return `<button type="button" class="lesson-button ${lesson.id === state.lessonId ? "active" : ""} ${complete ? "complete" : ""}" data-lesson="${lesson.id}"><span>${String(index + 1).padStart(2, "0")}</span><div><strong>${lesson.title}</strong><small>${lesson.unit}</small></div><em>${complete ? "완료" : "학습"}</em></button>`;
  }).join("");
  $("lessonList").querySelectorAll("button").forEach((button) => button.addEventListener("click", () => {
    state.lessonId = button.dataset.lesson;
    state.phase = "concept";
    state.selections = {};
    state.feedback = null;
    render();
  }));
}

function renderStageSteps() {
  const phases = [
    ["concept", "1", "개념"],
    ["original", "2", "골든벨"],
    ["extension", "3", "이야기"],
    ["complete", "4", "완료"]
  ];
  const progress = lessonProgress();
  $("stageSteps").innerHTML = phases.map(([id, number, label]) => {
    const complete = id === "concept" ? state.phase !== "concept" : id === "original" ? progress.original : id === "extension" || id === "complete" ? progress.extension : false;
    return `<button type="button" class="stage-step ${state.phase === id ? "active" : ""} ${complete ? "complete" : ""}" data-phase="${id}" ${state.phase === id ? 'aria-current="step"' : ""} ${phaseAllowed(id) ? "" : "disabled"}><strong>${complete ? "✓" : number}</strong><span>${label}</span></button>`;
  }).join("");
  $("stageSteps").querySelectorAll("button").forEach((button) => button.addEventListener("click", () => setPhase(button.dataset.phase)));
}

function renderConcept(lesson) {
  return `<p class="lesson-kicker">${lesson.unit} · 대표 개념</p><h2>${lesson.story.title}</h2><p class="lesson-lead">${lesson.representativeConcept}</p><div class="story-band"><span class="story-icon">?</span><div><strong>${lesson.story.title}</strong><p>${lesson.story.text}<br>${lesson.story.mission}</p></div></div><section class="concept-box"><strong>${lesson.explanation.headline}</strong><ol>${lesson.explanation.steps.map((step) => `<li>${step}</li>`).join("")}</ol></section><button type="button" class="primary-action" data-next-phase="original">다음</button>`;
}

function choiceButtons(groupId, options) {
  return `<div class="answer-choices">${options.map((option) => `<button type="button" class="${state.selections[groupId] === option ? "selected" : ""}" data-choice-group="${groupId}" data-choice="${option}">${option}</button>`).join("")}</div>`;
}

function normalizeAnswer(value) {
  return String(value ?? "").normalize("NFC").replace(/\s+/g, "").trim();
}

function answersMatch(actual, expected) {
  const approved = Array.isArray(expected) ? expected : [expected];
  return approved.some((value) => normalizeAnswer(actual) === normalizeAnswer(value));
}

function hasAnswer(value) {
  return normalizeAnswer(value) !== "";
}

function escapeAttribute(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function answerControl(groupId, item, scope) {
  if (item.answerMode !== "input") return choiceButtons(groupId, item.options);
  const inputMode = item.inputMode === "numeric" ? "numeric" : "text";
  const label = inputMode === "numeric" ? "답을 숫자로 쓰세요" : "답을 쓰세요";
  return `<label class="answer-input-wrap"><span>${label}</span><input type="text" inputmode="${inputMode}" autocomplete="off" spellcheck="false" value="${escapeAttribute(state.selections[groupId])}" aria-label="${escapeAttribute(item.prompt)} 답" data-input-group="${groupId}" data-answer-scope="${scope}" /></label>`;
}

function renderOriginal(lesson) {
  const result = state.feedback?.kind === "original" ? state.feedback : null;
  const allAnswered = lesson.original.items.every((item) => hasAnswer(state.selections[item.id]));
  return `<div class="quiz-head"><div><span>${lesson.original.title}</span><h2>${lesson.title}</h2></div></div><p class="lesson-lead">${lesson.original.prompt}</p><div class="quiz-visual">${visualMarkup(lesson.original.visual)}</div><div class="quiz-items">${lesson.original.items.map((item) => { const status = result ? answersMatch(state.selections[item.id], item.answer) ? "correct" : "incorrect" : ""; const conditions = item.conditions?.length ? `<ul class="original-conditions">${item.conditions.map((condition) => `<li>${condition}</li>`).join("")}</ul>` : ""; return `<section class="quiz-item ${status}"><strong>${item.prompt}</strong>${conditions}${answerControl(item.id, item, "original")}</section>`; }).join("")}</div>${result ? `<p class="feedback ${result.passed ? "success" : ""}">${result.message}</p>` : ""}<button type="button" class="primary-action" data-check="original" ${allAnswered ? "" : "disabled"}>${result?.passed ? "다음" : "확인"}</button>`;
}

function renderExtension(lesson) {
  const groupId = `${lesson.id}:extension`;
  const result = state.feedback?.kind === "extension" ? state.feedback : null;
  const selected = state.selections[groupId];
  return `<div class="quiz-head"><div><span>${lesson.extension.title}</span><h2>${lesson.extension.story}</h2></div></div><p class="lesson-lead">${lesson.extension.prompt}</p><div class="quiz-visual">${visualMarkup(lesson.extension.visual)}</div><section class="quiz-item ${result ? answersMatch(selected, lesson.extension.answer) ? "correct" : "incorrect" : ""}"><strong>${lesson.extension.prompt}</strong>${answerControl(groupId, lesson.extension, "extension")}</section>${result ? `<p class="feedback ${result.passed ? "success" : ""}">${result.message}</p>` : ""}<button type="button" class="primary-action" data-check="extension" ${hasAnswer(selected) ? "" : "disabled"}>${result?.passed ? "완료" : "확인"}</button>`;
}

function renderComplete(lesson) {
  const book = activeBook();
  const nextLesson = book.lessons.find((candidate) => !isLessonComplete(candidate));
  return `<section class="complete-panel"><span class="medal">✓</span><h2>${lesson.title} 학습 완료</h2><p>이 개념을 잘 익혔습니다.</p>${nextLesson ? `<button type="button" class="primary-action" data-next-lesson="${nextLesson.id}">다음</button>` : `<button type="button" class="primary-action" data-book-complete>${book.label} 학습 완료</button>`}</section>`;
}

function renderPending(book) {
  return `<section class="pending-panel"><span>!</span><h2>${book.label} 골든벨 학습 준비 중</h2><p>학습 자료를 준비하고 있습니다.</p></section>`;
}

function bindLessonActions() {
  $("lessonContent").querySelector("[data-next-phase]")?.addEventListener("click", (event) => setPhase(event.currentTarget.dataset.nextPhase));
  $("lessonContent").querySelectorAll("[data-choice-group]").forEach((button) => button.addEventListener("click", () => {
    state.selections[button.dataset.choiceGroup] = button.dataset.choice;
    state.feedback = null;
    renderContent();
  }));
  $("lessonContent").querySelectorAll("[data-input-group]").forEach((input) => input.addEventListener("input", () => {
    state.selections[input.dataset.inputGroup] = input.value;
    state.feedback = null;
    input.closest(".quiz-item")?.classList.remove("correct", "incorrect");
    $("lessonContent").querySelector(".feedback")?.remove();
    const lesson = activeLesson();
    const scope = input.dataset.answerScope;
    const checkButton = $("lessonContent").querySelector(`[data-check="${scope}"]`);
    if (!checkButton) return;
    checkButton.disabled = scope === "original"
      ? !lesson.original.items.every((item) => hasAnswer(state.selections[item.id]))
      : !hasAnswer(state.selections[`${lesson.id}:extension`]);
    checkButton.textContent = "확인";
  }));
  $("lessonContent").querySelector('[data-check="original"]')?.addEventListener("click", () => {
    const lesson = activeLesson();
    if (state.feedback?.kind === "original" && state.feedback.passed) return setPhase("extension");
    const passed = lesson.original.items.every((item) => answersMatch(state.selections[item.id], item.answer));
    if (passed) completeOriginal();
    const retryVerb = lesson.original.items.every((item) => item.answerMode === "input") ? "써" : "골라";
    state.feedback = {
      kind: "original",
      passed,
      message: passed ? "잘했어요. 다음으로 가요." : `${lesson.explanation.headline} 설명을 떠올리고 다시 ${retryVerb} 보세요.`
    };
    render();
  });
  $("lessonContent").querySelector('[data-check="extension"]')?.addEventListener("click", () => {
    const lesson = activeLesson();
    if (state.feedback?.kind === "extension" && state.feedback.passed) return setPhase("complete");
    const selected = state.selections[`${lesson.id}:extension`];
    const passed = answersMatch(selected, lesson.extension.answer);
    if (passed) completeExtension();
    state.feedback = { kind: "extension", passed, message: passed ? lesson.extension.explanation : `원본에서 배운 원리는 같습니다. ${lesson.explanation.steps[0]}` };
    render();
  });
  $("lessonContent").querySelector("[data-next-lesson]")?.addEventListener("click", (event) => {
    state.lessonId = event.currentTarget.dataset.nextLesson;
    state.phase = "concept";
    state.selections = {};
    state.feedback = null;
    render();
  });
}

function renderContent() {
  const book = activeBook();
  if (!book.lessons.length) {
    $("lessonContent").innerHTML = renderPending(book);
    return;
  }
  const lesson = activeLesson();
  const markup = state.phase === "concept" ? renderConcept(lesson)
    : state.phase === "original" ? renderOriginal(lesson)
      : state.phase === "extension" ? renderExtension(lesson)
        : renderComplete(lesson);
  $("lessonContent").innerHTML = markup;
  bindLessonActions();
}

function renderSummary() {
  const book = activeBook();
  const completed = book.lessons.filter(isLessonComplete).length;
  $("currentBookLabel").textContent = book.label;
  $("completedCount").textContent = `${completed} / ${book.lessons.length || "-"}`;
  $("levelState").textContent = book.lessons.length && completed === book.lessons.length ? "완료" : book.lessons.length ? "학습 중" : "준비 중";
  $("bookTitle").textContent = `${book.label} · ${book.title}`;
  $("bookSource").innerHTML = `<strong>학습 안내</strong><br>${book.lessons.length ? "개념을 골든벨과 이야기로 익힙니다." : "준비 중입니다."}`;
}

function render() {
  const book = activeBook();
  if (book.lessons.length && !book.lessons.some((lesson) => lesson.id === state.lessonId)) state.lessonId = book.lessons[0].id;
  renderBookTabs();
  renderLessonList();
  renderSummary();
  if (book.lessons.length) renderStageSteps();
  else $("stageSteps").innerHTML = '<div class="stage-step"><strong>-</strong><span>준비 중</span></div>';
  renderContent();
}

$("studentName").textContent = student;
$("backLink").href = `./?student=${encodeURIComponent(student)}&mode=curriculum`;
render();
