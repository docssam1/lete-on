import {
  HANDS_ON_ACTIVITIES, HANDS_ON_UNITS, activityCheck, newActivityState,
  expectedCells, clockValueAfterQuarterTurns, clueText
} from "./golden-bell-hands-on-models.js?v=20260922a";
import { foldPaper, unfoldCuts } from "./golden-bell-book01-folding.js?v=20260922d";

// Print numbering v1: filtering or changing object insertion order must not renumber challenges.
const PRINT_ORDER = Object.freeze([
  ["turn-clock", 1], ["mirror-tiles", 4], ["fold-once", 7],
  ["fold-twice", 10], ["cross-sums", 13], ["line-order", 16], ["share-equally", 19]
].map(([id, first], index) => Object.freeze({ id, first, number: `T${String(index + 1).padStart(2, "0")}` })));
const esc = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
const direction = { right: "왼쪽 반을 오른쪽으로", left: "오른쪽 반을 왼쪽으로", up: "아래쪽 반을 위쪽으로", down: "위쪽 반을 아래쪽으로" };
const turnDirection = (turns) => turns < 0 ? "시계 반대 방향" : "시계 방향";
const challengeNo = (first, index) => `D${String(first + index).padStart(2, "0")}`;
const sorted = (cells) => [...new Set(cells)].sort((a, b) => a - b);
const coordinates = (cells) => cells.map((cell) => `(${Math.floor(cell / 4) + 1}, ${cell % 4 + 1})`).join(", ");
const permutations = (values) => values.length ? values.flatMap((value, index) => permutations(values.filter((_, i) => i !== index)).map((rest) => [value, ...rest])) : [[]];

function ensure(condition, message) {
  if (!condition) throw new Error(`Hands-on print: ${message}`);
}

function svg(body, label, cls = "", viewBox = "0 0 200 200") {
  return `<svg class="hand-paper-diagram ${cls}" viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(label)}">${body}</svg>`;
}

const text = (x, y, value, size = 20) => `<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="central" fill="#172124" font-size="${size}">${esc(value)}</text>`;
const line = (x1, y1, x2, y2, extra = "", width = 1.6) => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="#273b40" stroke-width="${width}" ${extra}/>`;
const rect = (x, y, w, h, fill = "#fff", extra = "") => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" stroke="#273b40" stroke-width="1.6" ${extra}/>`;
const figure = (drawing, caption, cls = "", responseKey = "") => `<figure class="hand-paper-figure ${cls}"${responseKey ? ` data-print-response="${esc(responseKey)}"` : ""}>${drawing}<figcaption>${esc(caption)}</figcaption></figure>`;

function arrow(x, y, tx, ty, color = "#2456a6") {
  const length = Math.hypot(tx - x, ty - y), ux = (tx - x) / length, uy = (ty - y) / length;
  return `<path d="M${x} ${y}L${tx} ${ty}M${tx - ux * 9 - uy * 5} ${ty - uy * 9 + ux * 5}L${tx} ${ty}L${tx - ux * 9 + uy * 5} ${ty - uy * 9 - ux * 5}" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
}

function clock(value, label) {
  let body = '<circle cx="100" cy="100" r="94" fill="#fff" stroke="#273b40" stroke-width="2"/>';
  for (let n = 1; n <= 12; n++) {
    const angle = n * Math.PI / 6;
    body += text(100 + Math.sin(angle) * 75, 100 - Math.cos(angle) * 75, n);
  }
  if (value !== null) {
    const angle = value * Math.PI / 6;
    body += `<g class="hand-paper-clock-hand">${arrow(100, 100, 100 + Math.sin(angle) * 54, 100 - Math.cos(angle) * 54)}</g>`;
  }
  body += '<circle cx="100" cy="100" r="4" fill="#273b40"/>';
  return svg(body, label, "hand-paper-clock");
}

function hatch(x, y, size, crossed = false) {
  const body = [8, 20, 32].filter((v) => v < size).map((v) => line(x + 3, y + v, x + v, y + 3)).join("");
  return crossed ? `${line(x + 7, y + 7, x + size - 7, y + size - 7)}${line(x + size - 7, y + 7, x + 7, y + size - 7)}` : body;
}

function cellGrid({ given = [], answer = [], axis = null, label = "빈 4 x 4 격자" } = {}) {
  let body = "";
  for (let index = 0; index < 16; index++) {
    const x = 24 + index % 4 * 40, y = 24 + Math.floor(index / 4) * 40;
    const role = given.includes(index) ? "given" : answer.includes(index) ? "answer" : "blank";
    body += `<g data-cell="${index}" data-cell-role="${role}">${rect(x, y, 40, 40, role === "given" ? "#cceee9" : role === "answer" ? "#fbe4ae" : "#fff")}${role === "blank" ? "" : hatch(x, y, 40, role === "answer")}</g>`;
  }
  for (let i = 0; i < 4; i++) body += text(44 + i * 40, 12, i + 1) + text(12, 44 + i * 40, i + 1);
  if (axis) {
    const p = 24 + axis.at * 40;
    body += `<g class="hand-paper-mirror-axis">${axis.kind === "vertical"
      ? line(p - 2, 23, p - 2, 185, "", 2.2) + line(p + 2, 23, p + 2, 185, "", 2.2)
      : line(23, p - 2, 185, p - 2, "", 2.2) + line(23, p + 2, 185, p + 2, "", 2.2)}</g>`;
  }
  return svg(body, label, "hand-paper-cell-grid");
}

function foldScene(model, count, cut = false) {
  const poly = foldPaper(model, count);
  const xs = poly.map((p) => p.x), ys = poly.map((p) => p.y);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
  const pos = (v) => 20 + v * 160;
  const points = (shape) => shape.map(({ x, y }) => `${pos(x)},${pos(y)}`).join(" ");
  const next = model.folds[count];
  const vertical = next === "right" || next === "left";
  let body = rect(20, 20, 160, 160);
  body += `<polygon data-fold-step="${count}" points="${points(poly)}" fill="#cceee9" stroke="#273b40" stroke-width="2"/>`;
  for (let i = 1; i < 4; i++) {
    const p = i / 4;
    if (p > x0 && p < x1 && !(next && vertical && p === .5)) body += line(pos(p), pos(y0), pos(p), pos(y1));
    if (p > y0 && p < y1 && !(next && !vertical && p === .5)) body += line(pos(x0), pos(p), pos(x1), pos(p));
  }
  if (next) {
    ensure(direction[next], `unsupported fold direction: ${next}`);
    const cx = pos((x0 + x1) / 2), cy = pos((y0 + y1) / 2);
    body += vertical ? line(100, pos(y0), 100, pos(y1), 'stroke-dasharray="6 4"', 3) : line(pos(x0), 100, pos(x1), 100, 'stroke-dasharray="6 4"', 3);
    body += vertical ? arrow(next === "right" ? 60 : 140, cy, next === "right" ? 140 : 60, cy) : arrow(cx, next === "down" ? 60 : 140, cx, next === "down" ? 140 : 60);
  }
  if (cut) {
    body += model.cuts.map((shape) => `<polygon class="hand-paper-cut" points="${points(shape.map(([x, y]) => ({ x, y })))}" fill="#fbe4ae" stroke="#7a3519" stroke-width="3"/>${text(pos(shape.reduce((sum, p) => sum + p[0], 0) / shape.length), pos(shape.reduce((sum, p) => sum + p[1], 0) / shape.length), "X", 23)}`).join("");
  }
  return svg(body, cut ? "접힌 종이의 X 표시 영역을 자르기" : `${count}번 접힌 종이, ${direction[next] || "접기 완료"}`, "hand-paper-fold-scene");
}

function cross(round, slots = [], key = "") {
  const positions = [[72, 8], [12, 68], [132, 68], [72, 128]];
  let body = positions.map(([x, y], i) => `<g data-slot="${i}"${key ? ` data-print-response="${esc(`${key}/slot-${i + 1}`)}"` : ""}>${rect(x, y, 56, 56)}${slots[i] === undefined ? "" : text(x + 28, y + 28, slots[i], 26)}</g>`).join("");
  body += `<g data-fixed-center="${round.center}">${rect(72, 68, 56, 56, "#cceee9")}${rect(77, 73, 46, 46, "none")}${text(100, 96, round.center, 26)}</g>`;
  return svg(body, slots.length ? "가로와 세로의 합이 같은 대표 배치" : `중앙 ${round.center} 고정, 나머지 네 자리 빈칸`, "hand-paper-cross");
}

function orderLine(slots = [], key = "") {
  return `<div class="hand-paper-order" role="group" aria-label="맨 앞에서 맨 뒤까지 네 자리"><span>앞</span>${Array.from({ length: 4 }, (_, i) => `<span class="hand-paper-order-slot" data-slot="${i}"${key ? ` data-print-response="${esc(`${key}/slot-${i + 1}`)}"` : ""}><b>${esc(slots[i] || "")}</b><small>${i + 1}번째</small></span>`).join("")}<span>뒤</span></div>`;
}

function blocks(a, b) {
  let body = "";
  [a, b].forEach((count, group) => {
    const y = 16 + group * 86;
    body += text(23, y + 22, group ? "B" : "A", 25);
    for (let i = 0; i < count; i++) {
      const x = 51 + i % 10 * 27, by = y + Math.floor(i / 10) * 28;
      body += rect(x, by, 23, 23, group ? "#fbe4ae" : "#cceee9") + (group ? text(x + 11.5, by + 11.5, "+", 20) : line(x + 5, by + 18, x + 18, by + 5));
    }
    body += text(358, y + 22, `${count}개`, 22);
  });
  return svg(body, `A ${a}개, B ${b}개의 수 블록`, "hand-paper-blocks", "0 0 395 180");
}

function response(key, name, label, unit = "", wide = false) {
  return `<div class="hand-paper-response${wide ? " hand-paper-response-wide" : ""}" data-print-response="${esc(`${key}/${name}`)}"><span>${esc(label)}</span><span class="hand-paper-blank" aria-label="빈 답칸"></span>${unit ? `<span>${esc(unit)}</span>` : ""}</div>`;
}

function reason(key, label = "이유를 써 보세요.") {
  return `<div class="hand-paper-reason" data-print-response="${esc(`${key}/reason`)}"><span>${esc(label)}</span><div class="hand-paper-writing-lines" aria-label="이유를 쓰는 두 줄"></div></div>`;
}

function prompt(activity, round) {
  switch (activity.kind) {
    case "clock": return `${round.start}에서 ${turnDirection(round.turns)}으로 1/4바퀴씩 ${Math.abs(round.turns)}번 돌립니다. 마지막 바늘을 그리고 기록하세요.`;
    case "mirror": return `이중선은 거울입니다. 빗금 모양이 비치도록 ${round.axis.kind === "vertical" ? "오른쪽" : "아래쪽"} 빈 반쪽을 색칠하세요.`;
    case "fold": return "화살표대로 접고 마지막 종이의 X 영역을 자릅니다. 완전히 펼쳤을 때 잘린 칸을 빈 격자에 표시하세요.";
    case "cross": return `1, 2, 3, 4, 5를 한 번씩 써서 두 줄의 합을 같게 만드세요. 가운데 ${round.center}는 고정입니다.`;
    case "order": return "A, B, C, D를 한 번씩 써서 모든 조건에 맞게 앞에서부터 놓으세요.";
    case "transfer": return `A ${round.left}개, B ${round.right}개입니다. A에서 B로 옮겨 같게 만드세요. 블록 하나는 1개입니다.`;
    default: throw new Error(`Hands-on print: unsupported kind ${activity.kind}`);
  }
}

function studentContent(activity, round, key) {
  switch (activity.kind) {
    case "clock": return `<div class="hand-paper-figures">${figure(clock(round.start, `출발 바늘: ${round.start}`), "출발 바늘")}${figure(clock(null, "마지막 바늘을 그릴 빈 시계"), "마지막 바늘 그리기", "hand-paper-drawing-response", `${key}/clock`)}</div><div class="hand-paper-responses">${response(key, "direction", "방향", "", true)}${response(key, "turns", "1/4바퀴씩", "번")}${response(key, "end", "마지막 수")}</div>${reason(key)}`;
    case "mirror": return `${figure(cellGrid({ given: round.given.map(([x, y]) => y * 4 + x), axis: round.axis, label: "주어진 빗금과 거울선, 반쪽은 빈 4 x 4 격자" }), "위 숫자는 열, 왼쪽 숫자는 행", "hand-paper-drawing-response", `${key}/grid`)}<div class="hand-paper-responses">${response(key, "count", "새로 색칠한 칸", "개")}</div>${reason(key, "거울에서 같은 거리인 두 칸을 써 보세요.")}`;
    case "fold": {
      const steps = round.model.folds.map((fold, i) => figure(foldScene(round.model, i), `${i + 1}. ${direction[fold]}`)).join("");
      return `<div class="hand-paper-fold-sequence">${steps}${figure(foldScene(round.model, round.model.folds.length, true), `${round.model.folds.length + 1}. X 영역 자르기`)}${figure(cellGrid(), "완전히 펼친 결과 그리기", "hand-paper-drawing-response", `${key}/grid`)}</div><div class="hand-paper-responses">${response(key, "count", "잘린 칸", "개")}${response(key, "unfold", "먼저 되돌릴 접기", "번")}</div>${reason(key, "어느 접기부터 펼쳤는지 이유를 써 보세요.")}`;
    }
    case "cross": return `<p class="hand-paper-cards">남은 카드: ${[1, 2, 3, 4, 5].filter((n) => n !== round.center).join(", ")}</p>${figure(cross(round, [], key), "이중 테두리: 고정 카드", "hand-paper-drawing-response")}<div class="hand-paper-responses">${response(key, "horizontal", "가로 식과 합", "", true)}${response(key, "vertical", "세로 식과 합", "", true)}</div>${reason(key, "두 합이 같은지 확인한 방법을 써 보세요.")}`;
    case "order": return `<ul class="hand-paper-clues">${round.clues.map((clue) => `<li>${esc(clueText(clue))}</li>`).join("")}</ul>${orderLine([], key)}${reason(key, "조건 세 가지를 순서대로 확인해 보세요.")}`;
    case "transfer": return `${figure(blocks(round.left, round.right), "A: 빗금 블록 / B: + 블록")}<div class="hand-paper-responses">${response(key, "moved", "A에서 B로", "개")}${response(key, "left", "옮긴 뒤 A", "개")}${response(key, "right", "옮긴 뒤 B", "개")}${response(key, "difference", "옮긴 뒤 차이", "개")}${response(key, "left-equation", "A의 뺄셈식", "", true)}${response(key, "right-equation", "B의 덧셈식", "", true)}</div>${reason(key)}`;
    default: throw new Error(`Hands-on print: unsupported kind ${activity.kind}`);
  }
}

function insidePolygon([x, y], polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, yi] = polygon[i], [xj, yj] = polygon[j];
    if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

// Independent forward tracking, checked against the shared model's reverse-unfold solver.
function foldedCells(model) {
  return Array.from({ length: 16 }, (_, cell) => cell).filter((cell) => {
    let x = (cell % 4 + .5) / 4, y = (Math.floor(cell / 4) + .5) / 4;
    for (const fold of model.folds) {
      ensure(direction[fold], `unsupported fold direction: ${fold}`);
      if (fold === "right" && x < .5 || fold === "left" && x > .5) x = 1 - x;
      if (fold === "down" && y < .5 || fold === "up" && y > .5) y = 1 - y;
    }
    return model.cuts.some((polygon) => insidePolygon([x, y], polygon));
  });
}

function satisfies(slots, clue) {
  const a = slots.indexOf(clue.a), b = slots.indexOf(clue.b);
  switch (clue.kind) {
    case "first": return a === 0;
    case "last": return a === 3;
    case "adjacent": return slots[a + 1] === clue.b;
    case "before": return a < b;
    default: throw new Error(`Hands-on print: unsupported clue ${clue.kind}`);
  }
}

function solve(id, index) {
  const activity = HANDS_ON_ACTIVITIES[id], round = activity.rounds[index];
  const state = newActivityState(id, index);
  const result = {};
  if (activity.kind === "clock") {
    const labels = Array.from({ length: 12 }, (_, i) => i + 1);
    let position = labels.indexOf(round.start);
    result.trail = [round.start];
    for (let i = 0; i < Math.abs(round.turns); i++) {
      position = (position + Math.sign(round.turns) * 3 + 12) % 12;
      result.trail.push(labels[position]);
    }
    result.end = labels[position];
    ensure(result.end === clockValueAfterQuarterTurns(round.start, round.turns), `${id}/${index}: clock check`);
    state.turns = round.turns;
  } else if (activity.kind === "mirror" || activity.kind === "fold") {
    result.cells = activity.kind === "fold" ? foldedCells(round.model) : sorted(round.given.map(([x, y]) => round.axis.kind === "vertical" ? y * 4 + (2 * round.axis.at - 1 - x) : (2 * round.axis.at - 1 - y) * 4 + x));
    ensure(JSON.stringify(result.cells) === JSON.stringify(expectedCells(activity, round)), `${id}/${index}: independent cell check`);
    state.cells = result.cells;
    state.cut = true;
  } else if (activity.kind === "cross" || activity.kind === "order") {
    const pool = activity.kind === "cross" ? [1, 2, 3, 4, 5].filter((n) => n !== round.center) : ["A", "B", "C", "D"];
    const candidates = permutations(pool);
    const valid = candidates.filter((slots) => activity.kind === "cross" ? slots[1] + round.center + slots[2] === slots[0] + round.center + slots[3] : round.clues.every((clue) => satisfies(slots, clue)));
    ensure(valid.length > 0, `${id}/${index}: no valid arrangement`);
    ensure(candidates.every((slots) => valid.includes(slots) === activityCheck({ ...state, slots })), `${id}/${index}: all arrangements checked`);
    result.slots = valid[0];
    result.count = valid.length;
    state.slots = result.slots;
  } else if (activity.kind === "transfer") {
    result.moved = (round.left - round.right) / 2;
    result.each = (round.left + round.right) / 2;
    ensure(Number.isInteger(result.moved) && result.moved >= 0 && result.moved <= round.left, `${id}/${index}: invalid transfer`);
    ensure(round.left - result.moved === result.each && round.right + result.moved === result.each, `${id}/${index}: transfer equations`);
    Object.assign(state, { left: result.each, right: result.each, moved: result.moved });
  }
  ensure(activityCheck(state), `${id}/${index}: model check failed`);
  return result;
}

function foldSolution(round, cells, quick) {
  const final = figure(cellGrid({ answer: cells, label: "완전히 펼친 종이의 잘린 칸" }), "완전히 펼친 결과 (X)");
  if (quick) return final;
  const steps = [figure(foldScene(round.model, round.model.folds.length, true), "자를 때")];
  for (let remaining = round.model.folds.length - 1; remaining > 0; remaining--) {
    const poly = foldPaper(round.model, remaining);
    const points = (shape) => shape.map(({ x, y }) => `${20 + x * 160},${20 + y * 160}`).join(" ");
    const body = `<polygon points="${points(poly)}" fill="#cceee9" stroke="#273b40" stroke-width="2"/>${unfoldCuts(round.model, remaining).map((cut) => `<polygon points="${points(cut)}" fill="#fbe4ae" stroke="#273b40" stroke-width="2"/>${text(20 + cut.reduce((sum, p) => sum + p.x, 0) / cut.length * 160, 20 + cut.reduce((sum, p) => sum + p.y, 0) / cut.length * 160, "X")}`).join("")}`;
    steps.push(figure(svg(body, `${remaining + 1}번째 접기를 되돌린 자국`, "hand-paper-fold-scene"), `${remaining + 1}번 접기 펼침`));
  }
  return `<div class="hand-paper-figures">${steps.join("")}${final}</div>`;
}

function answerContent(activity, round, answer, quick) {
  let summary, drawing, steps = [];
  if (activity.kind === "clock") {
    summary = `${turnDirection(round.turns)}, 1/4바퀴씩 ${Math.abs(round.turns)}번, 마지막 수 ${answer.end}.`;
    drawing = figure(clock(answer.end, `마지막 바늘: ${answer.end}`), "마지막 바늘");
    steps = [`1/4바퀴마다 수 눈금 3칸: ${answer.trail.join(" → ")}.`, "끝 수뿐 아니라 방향과 돌린 횟수가 모두 맞아야 합니다. 한 바퀴를 돌면 출발 수로 돌아와도 회전량은 0이 아닙니다."];
  } else if (activity.kind === "mirror") {
    summary = `새로 색칠할 칸 ${answer.cells.length}개. (행, 열): ${coordinates(answer.cells)}.`;
    drawing = figure(cellGrid({ given: round.given.map(([x, y]) => y * 4 + x), answer: answer.cells, axis: round.axis, label: "빗금은 주어진 칸, X는 거울에 비친 칸" }), "빗금: 주어진 칸 / X: 비친 칸");
    steps = [round.axis.kind === "vertical" ? "행은 그대로 두고 열을 1 ↔ 4, 2 ↔ 3으로 짝짓습니다." : "열은 그대로 두고 행을 1 ↔ 4, 2 ↔ 3으로 짝짓습니다.", "칸 중심과 거울선 사이 거리가 짝끼리 같습니다. 주어진 칸은 새로 색칠한 칸 수에 넣지 않습니다."];
  } else if (activity.kind === "fold") {
    summary = `잘린 칸 ${answer.cells.length}개. ${round.model.folds.length}번 접기부터 펼칩니다. (행, 열): ${coordinates(answer.cells)}.`;
    drawing = foldSolution(round, answer.cells, quick);
    steps = [`접기 순서: ${round.model.folds.map((fold, i) => `${i + 1}. ${direction[fold]}`).join(" / ")}. 펼치기는 역순입니다.`, "16칸의 중심을 접기 순서대로 옮겨 자를 영역 안에 도착하는 칸을 다시 셌습니다. 이 결과가 역순으로 펼친 자국과 같습니다."];
  } else if (activity.kind === "cross") {
    const [top, left, right, bottom] = answer.slots;
    summary = `대표 예: 가로 ${left} + ${round.center} + ${right} = ${left + round.center + right}, 세로 ${top} + ${round.center} + ${bottom} = ${top + round.center + bottom}.`;
    drawing = figure(cross(round, answer.slots), "유효한 배치의 한 가지 예");
    steps = [`남은 카드 네 장의 24가지 배치를 모두 계산하면 유효한 배치는 ${answer.count}가지입니다.`, "중앙 수는 두 줄에 공통입니다. 양끝 두 수의 합을 비교하고, 1~5를 중복 없이 한 번씩 썼는지 확인합니다."];
  } else if (activity.kind === "order") {
    summary = `앞에서부터 ${answer.slots.join(" → ")}.`;
    drawing = orderLine(answer.slots);
    steps = [...round.clues.map((clue) => `${clueText(clue)} ${clue.a}: ${answer.slots.indexOf(clue.a) + 1}번째${clue.b ? `, ${clue.b}: ${answer.slots.indexOf(clue.b) + 1}번째` : ""}로 조건을 만족합니다.`), `서로 다른 네 카드의 24가지 순서를 모두 확인한 유효 배치: ${answer.count}가지.`];
  } else {
    summary = `A에서 B로 ${answer.moved}개. 옮긴 뒤 A ${answer.each}개, B ${answer.each}개, 차이 0개.`;
    drawing = figure(blocks(answer.each, answer.each), "옮긴 뒤 A와 B");
    steps = [`A: ${round.left} - ${answer.moved} = ${answer.each}. B: ${round.right} + ${answer.moved} = ${answer.each}.`, `한 개를 옮기면 차이는 2 줄어듭니다. (${round.left} - ${round.right}) ÷ 2 = ${answer.moved}. 전체 ${round.left + round.right}개 = ${answer.each} + ${answer.each}로 보존됩니다.`];
  }
  const accepted = activity.kind === "cross" ? "다양한 유효해 허용: 위 예와 달라도 중앙 고정, 카드 중복 없음, 가로 합 = 세로 합이면 맞습니다." : activity.kind === "order" ? "모든 카드를 한 번씩 쓰고 모든 조건을 만족하는 순서를 허용합니다." : "";
  return `<p class="hand-paper-answer-summary">${esc(summary)}</p>${drawing}${accepted ? `<p class="hand-paper-accepted-rule">${esc(accepted)}</p>` : ""}${quick ? "" : `<ol class="hand-paper-solution-steps">${steps.map((step) => `<li>${esc(step)}</li>`).join("")}</ol>`}`;
}

function item(entry, activity, index, mode) {
  const round = activity.rounds[index], key = `${entry.id}/${index}`, no = challengeNo(entry.first, index);
  const answers = mode !== "study", wide = activity.kind === "fold" && mode !== "quick";
  return `<section class="hand-paper-item${wide ? " hand-paper-item-wide full-width-exercise" : ""}" data-print-key="${key}" data-hand-key="${key}" data-print-exercise-key="${key}" data-print-challenge="${no}" data-print-activity="${entry.id}" data-round-index="${index}" data-hand-kind="${activity.kind}" data-print-role="${answers ? "answer" : "student"}"${answers ? ' data-answer-kind="author-practice"' : ""}><h2 class="hand-paper-item-title">${no} <span>${esc(activity.title)} · ${index + 1}/3</span></h2>${answers ? answerContent(activity, round, solve(entry.id, index), mode === "quick") : `<p class="hand-paper-prompt">${esc(prompt(activity, round))}</p>${studentContent(activity, round, key)}`}</section>`;
}

/** Pure authored-practice print adapter; never reads protected answers or screen state. */
export function handsOnPrintPages(book, lessons, { mode = "study", student = "" } = {}) {
  ensure(["study", "answers", "quick", "both"].includes(mode), `unsupported mode: ${mode}`);
  if (mode === "both") return handsOnPrintPages(book, lessons, { mode: "study", student }) + handsOnPrintPages(book, lessons, { mode: "answers", student });
  const selected = new Set((lessons || []).map((lesson) => typeof lesson === "string" ? lesson : lesson?.id));
  const units = HANDS_ON_UNITS.filter((unit) => unit.bookId === book?.id);
  const name = String(student ?? "").trim(), watermark = name ? `${name} · GFIELD` : "GFIELD";
  const pages = [];
  for (const entry of PRINT_ORDER) {
    const unit = units.find((value) => value.activities.includes(entry.id));
    if (!unit) continue;
    const activity = HANDS_ON_ACTIVITIES[entry.id];
    if (!selected.has(activity.lesson)) continue;
    ensure(activity.rounds.length === 3, `${entry.id}: numbering v1 requires three rounds`);
    const answers = mode !== "study", part = `${answers ? "answers-hands-on" : "hands-on-activity"}-${entry.id}`;
    // Long fold sequences start on full-width rows; the parent performs final measured packing.
    const perPage = activity.kind === "fold" && mode !== "quick" ? 2 : 3;
    for (let start = 0; start < 3; start += perPage) {
      const end = Math.min(3, start + perPage), range = `${challengeNo(entry.first, start)}~${challengeNo(entry.first, end - 1)}`;
      pages.push(`<article class="gold-print-page hand-paper-page" data-print-book="${esc(book.id)}" data-print-lesson="${esc(activity.lesson)}" data-print-unit="${esc(unit.id)}" data-print-activity="${entry.id}" data-print-part="${part}-${Math.floor(start / perPage) + 1}" data-print-mode="${mode}" data-watermark="${esc(watermark)}"><header class="gold-print-head hand-paper-head"><div><span>FIELDS CLASSIC · ${mode === "study" ? "체험 학습지" : mode === "quick" ? "체험 빠른 정답" : "체험 답안과 풀이"}</span><h1>${entry.number} ${esc(activity.title)}</h1><p>${esc(book.label || book.id)} · ${esc(unit.title)} · ${range}</p></div><p class="hand-paper-student">이름 <span>${esc(name)}</span></p></header><div class="gold-print-block hand-paper-grid">${Array.from({ length: end - start }, (_, i) => item(entry, activity, start + i, mode)).join("")}</div><footer class="gold-print-footer hand-paper-footer">${esc(book.label || book.id)} · ${esc(unit.title)} · ${entry.number} · ${range} · GFIELD</footer></article>`);
    }
  }
  return pages.join("");
}
