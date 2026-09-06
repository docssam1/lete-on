import { levels, validateLevels, expectedFor } from "../../games/shape-transform/levels.js?v=shape-transform-3";
import { domainNames, normalizeCount, chooseEntries, groupPages, entryHeight, operationText, displacementText, pathData, anchorIndex, changedCorners } from "./workbook-core.js?v=workbook-5";
import { rotationCue } from "../../games/shape-transform/rotation-cue.js?v=rotation-cue-1";

const $ = (selector) => document.querySelector(selector);
const select = $("#levelSelect");
const countInput = $("#countInput");
const answerToggle = $("#answerToggle");
const coverToggle = $("#coverToggle");
const worksheet = $("#worksheet");
const descriptions = [
  "같은 모양을 찾고, 다른 보기의 꺾임을 살펴봅니다.",
  "모양과 크기, 방향은 그대로 두고 위치만 바꿉니다.",
  "점 O를 중심으로 정해진 방향과 각도만큼 돌립니다.",
  "점 O를 기준으로 모든 길이를 같은 비율로 늘립니다.",
  "점 O를 기준으로 모든 길이를 같은 비율로 줄입니다."
];
const colors = ["#236b62", "#b25346", "#796499", "#9b7a23", "#427f95"];
let entries = [];

function labelPoint([x, y], label) {
  return `<circle class="vertex-dot" cx="${x}" cy="${y}" r="1.4"/><text class="point-label" x="${x > 88 ? x - 6 : x + 3}" y="${y < 10 ? y + 7 : y - 3}">${label}</text>`;
}

function pivotMarkup([x, y]) {
  return `<circle class="pivot-dot" cx="${x}" cy="${y}" r="1.8"/><text class="point-label" x="${x + 3}" y="${y + 6}">O</text>`;
}

function arcPath(pivot, start, angle) {
  const [px, py] = pivot;
  const radius = Math.hypot(start[0] - px, start[1] - py);
  const radians = angle * Math.PI / 180;
  const x = px + (start[0] - px) * Math.cos(radians) - (start[1] - py) * Math.sin(radians);
  const y = py + (start[0] - px) * Math.sin(radians) + (start[1] - py) * Math.cos(radians);
  return `M${start.join(" ")} A${radius} ${radius} 0 ${Math.abs(angle) > 180 ? 1 : 0} ${angle > 0 ? 1 : 0} ${x} ${y}`;
}

function arrow(path, id, className = "proof-line") {
  return `<defs><marker id="${id}" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="4" markerHeight="4" orient="auto-start-reverse"><path class="arrow-head" d="M0 0L6 3L0 6Z"/></marker></defs><path class="${className}" d="${path}" marker-end="url(#${id})"/>`;
}

function proofMarkup(problem, points, role, id) {
  const { operation, target, closed } = problem;
  const pivot = operation.pivot || [50, 50];
  const firstWrong = (problem.answerIndex + 1) % 3;
  if (operation.kind === "same-bends" || problem.level === 1) {
    if (role !== firstWrong) return "";
    return changedCorners(problem, role).map(({ point: [x, y] }) => `<circle class="proof-circle" cx="${x}" cy="${y}" r="4.3"/>`).join("");
  }
  const correct = role === problem.answerIndex;
  const scale = operation.kind === "enlarge" || operation.kind === "reduce";
  if (role === "target") return scale ? `<path class="proof-edge" d="${pathData(points.slice(0, 2))}"/>` : "";
  if (!correct) return "";
  const ghost = `<path class="ghost-line" d="${pathData(target, closed)}"/>`;
  if (operation.kind === "translate") {
    const [x, y] = target[0];
    const [ex, ey] = points[0];
    return ghost + arrow(`M${x} ${y} H${ex} V${ey}`, `${id}-move`);
  }
  if (operation.kind === "rotate") {
    const index = anchorIndex(problem);
    return ghost + `<path class="proof-ray" d="M${target[index]} L${pivot} L${points[index]}"/>` + arrow(arcPath(pivot, target[index], operation.angle), `${id}-turn`);
  }
  return ghost + `<path class="proof-ray" d="M${pivot} L${target[0]} L${points[0]} M${pivot} L${target[1]} L${points[1]}"/><path class="proof-edge" d="${pathData(points.slice(0, 2))}"/>`;
}

function shapeSvg(problem, points, label, role, id, showAnswer = false, cover = false) {
  const { operation, closed } = problem;
  const pivot = operation.pivot || [50, 50];
  const grid = Array.from({ length: 9 }, (_, index) => (index + 1) * 10).map((n) => `M${n} 0V100M0 ${n}H100`).join("");
  const shape = pathData(points, closed);
  const hasPivot = ["rotate", "enlarge", "reduce"].includes(operation.kind);
  const hasEdge = ["enlarge", "reduce"].includes(operation.kind);
  let cues = "";
  if (!cover && problem.level !== 1) cues += labelPoint(points[anchorIndex(problem)], "A");
  if (!cover && hasEdge) cues += labelPoint(points[1], "B");
  if (hasPivot) cues += pivotMarkup(pivot);
  return `<svg class="shape-svg${closed ? " plane-shape" : ""}" viewBox="-5 -5 110 110" role="img" aria-label="${label}" data-role="${role}"><path class="grid-line" d="${grid}"/><rect class="grid-border" width="100" height="100"/>${closed ? `<path class="shape-fill" d="${shape}"/>` : ""}<path class="shape-line" d="${shape}"/>${showAnswer ? proofMarkup(problem, points, role, id) : ""}${cues}</svg>`;
}

function drawingSvg(drawing, role, id, showAnswer) {
  const { operation, closed, target, answer } = drawing;
  const isTarget = role === "target";
  const visiblePoints = isTarget ? target : showAnswer ? answer : null;
  const hasPivot = ["rotate", "enlarge", "reduce"].includes(operation.kind);
  const lines = Array.from({ length: 9 }, (_, index) => (index + 1) * 10).map((n) => `M${n} 0V100M0 ${n}H100`).join("");
  const dots = Array.from({ length: 121 }, (_, index) => `<circle class="grid-point" cx="${index % 11 * 10}" cy="${Math.floor(index / 11) * 10}" r=".55"/>`).join("");
  let shape = "", proof = "", labels = "";
  if (visiblePoints) {
    const d = pathData(visiblePoints, closed);
    shape = `${closed ? `<path class="shape-fill" d="${d}"/>` : ""}<path class="shape-line${isTarget ? "" : " drawing-answer"}" d="${d}"/>`;
    if (drawing.level !== 1) labels += labelPoint(visiblePoints[anchorIndex(drawing)], "A");
    if (["enlarge", "reduce"].includes(operation.kind)) labels += labelPoint(visiblePoints[1], "B");
    if (showAnswer && drawing.level !== 1) {
      proof = proofMarkup({ ...drawing, choices: [answer], answerIndex: 0 }, visiblePoints, isTarget ? "target" : 0, id);
    }
  }
  if (hasPivot) labels += pivotMarkup(operation.pivot);
  const label = isTarget ? "기준 도형" : showAnswer ? "그리기 정답 도형" : "빈 그리기 격자";
  return `<svg class="shape-svg drawing-svg${closed && visiblePoints ? " plane-shape" : ""}" viewBox="-5 -5 110 110" role="img" aria-label="${label}" data-role="${role}"><path class="grid-line" d="${lines}"/><rect class="grid-border" width="100" height="100"/>${dots}${shape}${proof}${labels}</svg>`;
}

function turnText(operation) {
  return `${operation.angle < 0 ? "반시계" : "시계"} 방향 ${Math.abs(operation.angle)}° (${Math.abs(operation.angle) === 90 ? "반의 반 바퀴" : "반 바퀴"})`;
}

function promptFor(problem) {
  const { operation } = problem;
  if (problem.level === 1) return "기준 도형과 모양이 같은 것을 고르세요.";
  if (operation.kind === "translate") return `${displacementText(operation)} 옮긴 도형을 고르세요.`;
  if (operation.kind === "rotate") return `점 O를 중심으로 ${turnText(operation)} 돌린 도형을 고르세요.`;
  if (operation.kind === "reduce") return "점 O를 기준으로 변의 길이를 절반으로 줄인 도형을 고르세요.";
  return `점 O를 기준으로 ${operationText(operation)}한 도형을 고르세요.`;
}

function evidenceFor(problem, showAnswer) {
  const { operation } = problem;
  const firstWrong = (problem.answerIndex + 1) % 3;
  if (showAnswer) {
    if (problem.level === 1) return `${firstWrong + 1}번 보기의 동그라미 부분은 꺾이는 위치가 다릅니다. 정답은 모든 꺾임이 같습니다.`;
    if (operation.kind === "translate") return `모든 꼭짓점이 ${displacementText(operation)} 함께 움직입니다. 점선은 옮기기 전 도형입니다.`;
    if (operation.kind === "rotate") return `O는 고정. A는 ${operation.angle < 0 ? "반시계" : "시계"} 방향으로 ${Math.abs(operation.angle)}° 돌았습니다. 점선은 처음 도형입니다.`;
    return `변 AB와 모든 변의 길이가 ${operation.scale === .5 ? "절반" : "2배"}입니다. O는 고정. 점선은 바꾸기 전 도형입니다.`;
  }
  if (problem.level === 1) return "틀린 보기 하나를 골라, 기준과 다른 꺾임에 동그라미 하세요.";
  if (operation.kind === "translate") return "기준 그림의 점 A에서 옮겨 갈 자리까지 화살표를 그리세요.";
  if (operation.kind === "rotate") return "기준 그림에서 점 A가 점 O 주위를 도는 방향과 경로를 표시하세요.";
  return "기준과 고른 보기의 변 AB를 진하게 긋고 길이를 비교하세요.";
}

function problemMarkup({ level, problem }, number, showAnswer) {
  const prefix = `q-${number}`;
  const turning = problem.operation.kind === "rotate";
  const cue = turning ? `<div class="turn-indicator">${rotationCue(problem.operation.angle, operationText(problem.operation))}</div>` : "";
  const choices = problem.choices.map((points, index) => `<figure class="figure mini-choice${showAnswer && index === problem.answerIndex ? " correct" : ""}"><figcaption>${index + 1}${showAnswer && index === problem.answerIndex ? " 정답" : ""}</figcaption>${shapeSvg(problem, points, `보기 ${index + 1}`, index, `${prefix}-${index}`, showAnswer)}</figure>`).join("");
  return `<article class="problem" data-problem-id="${problem.id}" data-level="${level.id}" data-response-mode="choice" data-coordinate-model="bank-original"><header class="problem-heading"><b class="problem-number">${String(number).padStart(2, "0")}</b><p class="problem-prompt">${promptFor(problem)}</p></header><div class="visual${turning ? " with-turn" : ""}"><figure class="figure target"><figcaption>기준</figcaption>${shapeSvg(problem, problem.target, "기준 도형", "target", `${prefix}-target`, showAnswer)}</figure>${cue}${choices}</div><div class="evidence${showAnswer ? " answer-explanation" : ""}"><span class="answer-line">${showAnswer ? `정답 ${problem.answerIndex + 1}번` : "정답 (　　 )"}</span><span class="evidence-task">${evidenceFor(problem, showAnswer)}</span></div></article>`;
}

function drawingMarkup({ level, drawing }, number, showAnswer) {
  const { operation } = drawing;
  const prefix = `draw-${number}`;
  const turning = operation.kind === "rotate";
  let prompt = "기준 도형을 위치와 크기까지 똑같이 그리세요.";
  if (operation.kind === "translate") prompt = `${displacementText(operation)} 옮긴 도형을 그리세요.`;
  if (turning) prompt = `점 O를 중심으로 ${turnText(operation)} 돌린 도형을 그리세요.`;
  if (operation.kind === "enlarge") prompt = "점 O를 기준으로 변의 길이를 2배로 늘린 도형을 그리세요.";
  if (operation.kind === "reduce") prompt = "점 O를 기준으로 변의 길이를 절반으로 줄인 도형을 그리세요.";
  const evidence = showAnswer
    ? ["꺾이는 위치와 변의 길이, 도형의 위치까지 같습니다.",
      `모든 꼭짓점을 ${displacementText(operation)} 옮겼습니다. 점선은 처음 도형입니다.`,
      `O는 그대로, A는 ${operation.angle < 0 ? "반시계" : "시계"} 방향으로 ${Math.abs(operation.angle)}° 돌았습니다.`,
      "O는 그대로, O에서 각 꼭짓점까지 가로와 세로 거리가 모두 2배입니다.",
      "O는 그대로, O에서 각 꼭짓점까지 가로와 세로 거리가 모두 절반입니다."][level.id - 1]
    : ["꺾이는 곳을 격자점에 표시한 뒤 차례로 이으세요.",
      "각 꼭짓점이 움직이는 방향과 칸 수를 확인하세요.",
      "점 O는 그대로 두고, 돌린 꼭짓점들을 차례로 이으세요.",
      "O에서 각 꼭짓점까지 가로와 세로 거리를 모두 늘리세요.",
      "O에서 각 꼭짓점까지 가로와 세로 거리를 모두 줄이세요."][level.id - 1];
  const cue = turning ? `<div class="turn-indicator">${rotationCue(operation.angle, turnText(operation))}</div>` : "";
  return `<article class="problem drawing-problem" data-problem-id="${drawing.id}" data-level="${level.id}" data-response-mode="draw" data-coordinate-model="${drawing.derivation.kind}"><header class="problem-heading"><b class="problem-number">${String(number).padStart(2, "0")}</b><p class="problem-prompt">${prompt}</p></header><div class="visual drawing-visual${turning ? " with-turn" : ""}"><figure class="figure target"><figcaption>기준</figcaption>${drawingSvg(drawing, "target", `${prefix}-target`, showAnswer)}</figure>${cue}<figure class="figure drawing-board"><figcaption>${showAnswer ? "정답 그림" : "내가 그린 도형"}</figcaption>${drawingSvg(drawing, "drawing", `${prefix}-answer`, showAnswer)}</figure></div><div class="evidence${showAnswer ? " answer-explanation" : ""}"><span class="evidence-task">${evidence}</span></div></article>`;
}

function renderCover(pages, selectedEntries) {
  const selected = levels.find((level) => String(level.id) === select.value);
  $("#coverTitle").textContent = selected ? `${selected.id}. ${domainNames[selected.id - 1]}` : "관찰 · 이동 · 회전 · 확대 · 줄이기";
  $("#coverSubtitle").textContent = selected ? descriptions[selected.id - 1] : "다섯 영역을 차례로 살펴보는 도형 탐구 학습지";
  $("#coverLevel").textContent = selected ? `학습 영역 · ${domainNames[selected.id - 1]}` : "학습 영역 · 전체 5개";
  $("#coverCount").textContent = `${selectedEntries.length}문항 · 본문 ${pages.length}쪽${answerToggle.checked ? " · 정답·풀이" : ""}`;
  $("#coverSheet").hidden = !coverToggle.checked;
  // Worked examples use separate figures, never an answer to a selected problem.
  const coverSeeds = [
    [[36,34],[62,34],[62,46],[54,46],[54,66],[36,66]],
    [[32,32],[68,32],[68,68],[56,68],[56,52],[32,52]],
    [[34,32],[48,32],[48,44],[68,44],[68,68],[34,68]]
  ];
  const exampleLevels = selected ? [selected, selected, selected] : levels;
  const examples = exampleLevels.map((level, index) => {
    const problem = { ...level.problems[0], target:coverSeeds[index % coverSeeds.length], closed:true };
    problem.choices = [expectedFor(problem)];
    problem.answerIndex = 0;
    return { level, problem };
  });
  $("#coverExamples").innerHTML = examples.map(({ level, problem }, index) => `<div class="cover-example" style="--example-color:${colors[selected ? index : level.id - 1]}"><div class="example-label"><b>${String(index + 1).padStart(2, "0")}</b><strong>${domainNames[level.id - 1]}</strong><small class="${problem.operation.kind === "rotate" ? "cover-turn" : ""}">${problem.operation.kind === "rotate" ? rotationCue(problem.operation.angle, operationText(problem.operation)) : ""}<span>${operationText(problem.operation)}</span></small></div>${shapeSvg(problem, problem.target, "살펴보기 기준 도형", "target", `cover-${index}-target`, false, true)}${shapeSvg(problem, problem.choices[problem.answerIndex], "살펴보기 변화한 도형", "result", `cover-${index}-result`, false, true)}</div>`).join("");
}

export function renderEntries(selectedEntries) {
  const pages = groupPages(selectedEntries);
  renderCover(pages, selectedEntries);
  worksheet.querySelectorAll(".sheet").forEach((sheet) => sheet.remove());
  let number = 1;
  pages.forEach((page, pageIndex) => {
    const level = page[0].level;
    const sheet = $("#sheetTemplate").content.firstElementChild.cloneNode(true);
    sheet.dataset.level = String(level.id);
    sheet.style.setProperty("--row-template", page.map((entry) => `${entryHeight(entry)}mm`).join(" "));
    sheet.querySelector(".sheet-title").textContent = `${String(level.id).padStart(2, "0")}  ${domainNames[level.id - 1]}`;
    sheet.querySelector(".sheet-description").textContent = descriptions[level.id - 1];
    sheet.querySelector(".problem-grid").innerHTML = page.map((entry) => entry.responseMode === "draw" ? drawingMarkup(entry, number++, answerToggle.checked) : problemMarkup(entry, number++, answerToggle.checked)).join("");
    sheet.querySelector(".sheet-footer-text").textContent = `${domainNames[level.id - 1]} · 같은 문제 안의 격자는 모두 같은 크기입니다.${answerToggle.checked ? " · 정답·풀이" : ""}`;
    sheet.querySelector(".page-number").textContent = `${pageIndex + 1} / ${pages.length}`;
    worksheet.append(sheet);
  });
}

function render() { renderEntries(entries); }

function newSelection() {
  const selected = levels.find((level) => String(level.id) === select.value);
  const available = selected ? selected.problems.length : levels.reduce((sum, level) => sum + level.problems.length, 0);
  const requested = Number(countInput.value);
  const count = normalizeCount(countInput.value, available);
  countInput.value = String(count);
  const capped = requested > Math.min(20, available);
  const notice = $("#countNotice");
  notice.classList.toggle("capped", capped);
  notice.textContent = capped
    ? selected ? `${domainNames[selected.id - 1]}은 ${available}문항이 있어 ${count}문항으로 조정했습니다. 선택 영역은 그대로입니다.` : `한 번에 최대 20문항입니다. 20문항으로 조정했습니다.`
    : selected ? `${domainNames[selected.id - 1]} ${available}문항 중 ${count}문항` : `전체 ${available}문항 중 ${count}문항 · 영역별로 나누어 인쇄`;
  const previous = entries.map(({ problem }) => problem.id).join(",");
  entries = chooseEntries(levels, select.value, count);
  if (entries.map(({ problem }) => problem.id).join(",") === previous) {
    const firstDomain = entries.filter((entry) => entry.level.id === entries[0].level.id && entry.responseMode === "choice");
    if (firstDomain.length > 1) [entries[0], entries[1]] = [entries[1], entries[0]];
    else {
      const { level, problem } = entries[0];
      const replacement = level.problems.find((candidate) => !entries.some((entry) => entry.problem.id === candidate.id));
      if (replacement) entries[0] = { level, problem: replacement, responseMode: "choice" };
    }
  }
  render();
}

try {
  validateLevels();
  select.innerHTML = levels.map((level) => `<option value="${level.id}">${level.id}. ${domainNames[level.id - 1]}</option>`).join("") + `<option value="all">전체 영역</option>`;
  const initial = new URLSearchParams(location.search).get("level");
  select.value = initial === "all" || levels.some((level) => String(level.id) === initial) ? initial : "1";
  if (select.value === "all") countInput.value = "20";
  select.addEventListener("change", newSelection);
  countInput.addEventListener("change", newSelection);
  answerToggle.addEventListener("change", render);
  coverToggle.addEventListener("change", render);
  $("#refreshButton").addEventListener("click", newSelection);
  $("#printButton").addEventListener("click", () => window.print());
  newSelection();
} catch (error) {
  worksheet.hidden = true;
  $("#loadError").hidden = false;
  $("#loadError").textContent = "문항 데이터를 확인하지 못했습니다. 잠시 후 다시 열어 주세요.";
  document.querySelectorAll(".maker-settings input, .maker-settings select, .maker-settings button").forEach((control) => { control.disabled = true; });
  console.error(error);
}
