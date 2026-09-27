import { icon } from "../../geometry/games/shape-transform/ui-icons.js";
import { reflectCell } from "../../geometry/games/mirror-manor/levels.js";
import { foldPaper, unfoldCuts } from "./golden-bell-hands-on-folding.js?v=20260925a";
import { HANDS_ON_ACTIVITIES, unitForLesson, newActivityState, applyActivityAction, clockValueAfterQuarterTurns, clueText, matchesClue } from "./golden-bell-hands-on-models.js?v=20260925a";
import { handsOnGuide } from "./golden-bell-hands-on-guide.js?v=20260925a";

const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const sessions = new Map();
const direction = { right: "오른쪽", left: "왼쪽", up: "위쪽", down: "아래쪽" };
const button = (action, label, symbol, { value, disabled = false, cls = "" } = {}) => `<button type="button" class="${cls}" data-hand-action="${action}"${value === undefined ? "" : ` data-value="${esc(value)}"`} ${disabled ? "disabled" : ""} title="${esc(label)}" aria-label="${esc(label)}">${symbol ? icon(symbol) : ""}${cls.includes("icon-only") ? "" : `<span>${esc(label)}</span>`}</button>`;

function task(activity, round) {
  if (activity.kind === "clock") return `${round.start}에서 ${round.turns < 0 ? "시계 반대" : "시계"} 방향으로 ${Math.abs(round.turns) === 4 ? "한 바퀴" : Math.abs(round.turns) === 2 ? "반 바퀴" : "반의 반 바퀴"} 돌리세요.`;
  if (activity.kind === "mirror") return `${round.axis.kind === "vertical" ? "오른쪽" : "아래쪽"} 거울에 비칠 모양을 완성하세요.`;
  if (activity.kind === "fold") return `색종이를 ${round.model.folds.map((d) => direction[d]).join(", 다시 ")}으로 접어 표시한 칸을 자릅니다. 펼치면 잘릴 칸을 모두 고르세요.`;
  if (activity.kind === "cross") return `1, 2, 3, 4, 5를 한 번씩 놓아 가로줄과 세로줄의 합을 같게 만드세요. 가운데 수는 ${round.center}입니다.`;
  if (activity.kind === "order") return "네 친구를 조건에 맞게 앞에서부터 놓으세요.";
  return `A는 ${round.left}개, B는 ${round.right}개를 가졌습니다. A가 B에게 주어 두 사람의 개수를 같게 만드세요.`;
}

function clockScene(round, state) {
  const angle = (round.start % 12) * 30 + state.turns * 90;
  const labels = Array.from({ length: 12 }, (_, i) => {
    const a = (i + 1) * Math.PI / 6;
    return `<text x="${130 + 95 * Math.sin(a)}" y="${130 - 95 * Math.cos(a)}">${i + 1}</text>`;
  }).join("");
  const marks = Array.from({ length: 12 }, (_, i) => `<path transform="rotate(${i * 30} 130 130)" d="M130 13V20"/>`).join("");
  return `<div class="hand-clock"><svg viewBox="0 0 260 260" role="img" aria-label="${round.start}에서 출발한 바늘이 현재 ${clockValueAfterQuarterTurns(round.start, state.turns)}을 가리키는 시계"><circle cx="130" cy="130" r="122" class="clock-rim"/><g class="clock-ticks">${marks}</g>${labels}<path class="clock-start" transform="rotate(${round.start * 30} 130 130)" d="M130 130V66"/><g class="clock-hand" style="transform:rotate(${angle}deg)"><path d="M130 134V55M122 64L130 54L138 64"/></g><circle cx="130" cy="130" r="6" class="clock-pin"/></svg><p class="hand-measure">돌린 양 <strong>${Math.abs(state.turns)} / 4 바퀴</strong><span>${state.turns === 0 ? "출발" : state.turns < 0 ? "시계 반대 방향" : "시계 방향"}</span></p><div class="hand-controls">${button("turn", "시계 반대로 ¼바퀴", "retry", { value: -1, disabled: state.solved || state.turns <= -8 })}${button("turn", "시계 방향으로 ¼바퀴", "clockwise", { value: 1, disabled: state.solved || state.turns >= 8 })}</div></div>`;
}

function cellGrid(state, { given = [], axis, enabled = true, label, pair = null }) {
  const painted = given.map(([x, y]) => y * 4 + x);
  const cells = Array.from({ length: 16 }, (_, i) => {
    const sourceSide = axis && (axis.kind === "vertical" ? i % 4 < 2 : Math.floor(i / 4) < 2);
    const selected = state.cells.includes(i);
    const classes = `hand-cell${painted.includes(i) ? " given" : ""}${selected ? " selected" : ""}${pair?.[1] === i ? " pair-source" : ""}`;
    const cellLabel = `${Math.floor(i / 4) + 1}행 ${i % 4 + 1}열`;
    if (sourceSide) return `<span class="${classes}" role="img" aria-label="${cellLabel}${painted.includes(i) ? " 색칠한 칸" : " 빈 칸"}"></span>`;
    return `<button type="button" class="${classes}" data-hand-action="cell" data-value="${i}" aria-label="${cellLabel}" aria-pressed="${selected}" ${!enabled || state.solved ? "disabled" : ""}>${selected ? icon("check") : ""}</button>`;
  }).join("");
  const link = pair ? `<svg class="hand-pair-guide" viewBox="0 0 4 4" preserveAspectRatio="none" aria-hidden="true"><path d="M${pair[0] % 4 + .5} ${Math.floor(pair[0] / 4) + .5}L${pair[1] % 4 + .5} ${Math.floor(pair[1] / 4) + .5}"/><circle cx="${pair[0] % 4 + .5}" cy="${Math.floor(pair[0] / 4) + .5}" r=".055"/><circle cx="${pair[1] % 4 + .5}" cy="${Math.floor(pair[1] / 4) + .5}" r=".055"/></svg>` : "";
  return `<div class="hand-grid ${axis ? `mirror-${axis.kind}` : ""}" role="group" aria-label="${esc(label)}">${cells}${link}</div>`;
}

function mirrorScene(round, state) {
  const selected = state.cells.at(-1);
  const counterpart = selected === undefined ? null : reflectCell([selected % 4, Math.floor(selected / 4)], round.axis);
  const pair = counterpart ? [selected, counterpart[1] * 4 + counterpart[0]] : null;
  return `<div class="hand-mirror"><p class="hand-diagram-label">주어진 모양 · 거울 · 비친 모양</p>${cellGrid(state, { given: round.given, axis: round.axis, label: "거울 모양 만들기", pair })}<p class="hand-diagram-label">${pair ? "점선으로 이은 두 칸은 거울선에서 같은 거리입니다." : `${round.axis.kind === "vertical" ? "가운데 세로선" : "가운데 가로선"}이 거울입니다.`}</p></div>`;
}

const points = (poly) => poly.map(({ x, y }) => `${20 + x * 200},${20 + y * 200}`).join(" ");
const paperBounds = (poly) => ({ x0: Math.min(...poly.map((p) => p.x)), y0: Math.min(...poly.map((p) => p.y)), x1: Math.max(...poly.map((p) => p.x)), y1: Math.max(...poly.map((p) => p.y)) });
const rectangle = (x0, y0, x1, y1) => [{ x: x0, y: y0 }, { x: x1, y: y0 }, { x: x1, y: y1 }, { x: x0, y: y1 }];
function foldArrow(fold, bounds) {
  const x = 20 + (bounds.x0 + bounds.x1) * 100, y = 20 + (bounds.y0 + bounds.y1) * 100;
  const positions = { right: [70, y, 170, y], left: [170, y, 70, y], down: [x, 70, x, 170], up: [x, 170, x, 70] };
  const [sx, sy, ex, ey] = positions[fold];
  const ux = Math.sign(ex - sx), uy = Math.sign(ey - sy);
  return `<path class="hand-fold-arrow" d="M${sx} ${sy}L${ex} ${ey}M${ex - ux * 12 - uy * 7} ${ey - uy * 12 + ux * 7}L${ex} ${ey}L${ex - ux * 12 + uy * 7} ${ey - uy * 12 - ux * 7}"/>`;
}
function movingFlap(round, count) {
  if (!count) return "";
  const fold = round.model.folds[count - 1];
  const { x0, y0, x1, y1 } = paperBounds(foldPaper(round.model, count - 1));
  const bounds = { right: [x0, y0, .5, y1], left: [.5, y0, x1, y1], down: [x0, y0, x1, .5], up: [x0, .5, x1, y1] }[fold];
  if (!bounds || bounds[2] <= bounds[0] || bounds[3] <= bounds[1]) return "";
  return `<polygon class="hand-fold-moving ${fold === "left" || fold === "right" ? "vertical" : "horizontal"}" points="${points(rectangle(...bounds))}"/>`;
}
function foldScene(round, state, animateFold = false) {
  const count = state.solved ? 0 : state.foldStep;
  const shape = foldPaper(round.model, count);
  const cuts = state.solved ? unfoldCuts(round.model) : state.foldStep === round.model.folds.length ? unfoldCuts(round.model, state.foldStep) : [];
  const next = state.solved ? null : round.model.folds[count];
  const bounds = paperBounds(shape);
  const crease = next ? next === "left" || next === "right"
    ? `<path class="hand-fold-crease" d="M120 ${20 + bounds.y0 * 200}V${20 + bounds.y1 * 200}"/>`
    : `<path class="hand-fold-crease" d="M${20 + bounds.x0 * 200} 120H${20 + bounds.x1 * 200}"/>` : "";
  const grid = [70, 120, 170].map((p) => `<path d="M${p} 20V220M20 ${p}H220"/>`).join("");
  const svg = `<svg viewBox="0 0 240 240" role="img" aria-label="${state.solved ? "완전히 펼친 색종이" : `${state.foldStep}번 접은 색종이${state.cut ? ", 표시한 칸을 자름" : ""}`}"><defs><clipPath id="hand-fold-grid-clip"><polygon points="${points(shape)}"/></clipPath></defs><rect class="hand-fold-outline" x="20" y="20" width="200" height="200"/><polygon class="hand-fold-paper" points="${points(shape)}"/><g class="hand-fold-grid" clip-path="url(#hand-fold-grid-clip)">${grid}</g>${crease}${next ? foldArrow(next, bounds) : ""}${cuts.map((poly) => `<polygon class="${state.cut ? "hand-fold-hole" : "hand-fold-mark"}" points="${points(poly)}"/>`).join("")}${animateFold ? movingFlap(round, count) : ""}</svg>`;
  const doneFold = state.foldStep === round.model.folds.length;
  return `<div class="hand-fold-layout"><figure>${svg}<figcaption>${state.solved ? "펼친 뒤" : state.cut ? "자른 뒤" : `${state.foldStep}번 접은 뒤`}</figcaption></figure><div><p class="hand-diagram-label">펼치면 잘릴 칸</p>${cellGrid(state, { enabled: state.cut, label: "잘릴 칸 예상" })}</div></div><div class="hand-controls">${button("fold", doneFold ? "접기 완료" : `${direction[round.model.folds[state.foldStep]]}으로 접기`, "next", { disabled: doneFold || state.solved })}${button("cut", "표시한 칸 자르기", null, { disabled: !doneFold || state.cut || state.solved })}</div>`;
}

function cardsAndSlots(activity, round, state) {
  const isCross = activity.kind === "cross";
  const cards = isCross ? [1, 2, 3, 4, 5].filter((n) => n !== round.center) : ["A", "B", "C", "D"];
  const slot = (i) => `<button type="button" class="hand-slot ${state.selected !== null && state.slots[i] === state.selected ? "picked" : ""}" data-hand-action="slot" data-value="${i}" aria-label="${isCross ? ["위", "왼쪽", "오른쪽", "아래"][i] : `${i + 1}번째`} 자리${state.slots[i] === null ? " 비어 있음" : ` ${state.slots[i]}`}" ${state.solved ? "disabled" : ""}>${esc(state.slots[i] ?? "?")}</button>`;
  const bank = `<div class="hand-card-bank" role="group" aria-label="놓을 카드">${cards.map((card) => `<button type="button" data-hand-action="choose" data-value="${card}" aria-label="${card} 카드" aria-pressed="${state.selected === card}" ${state.solved ? "disabled" : ""} class="hand-number-card ${state.slots.includes(card) ? "placed" : ""}">${card}${state.slots.includes(card) ? `<small>${icon("check")}</small>` : ""}</button>`).join("")}</div>`;
  if (isCross) {
    const sum = (a, b) => state.slots[a] !== null && state.slots[b] !== null ? state.slots[a] + round.center + state.slots[b] : "?";
    return `<div class="hand-cross"><div class="hand-cross-grid"><span></span>${slot(0)}<span></span>${slot(1)}<b class="hand-center">${round.center}</b>${slot(2)}<span></span>${slot(3)}<span></span></div><div class="hand-sums"><span>가로 합 <b>${sum(1, 2)}</b></span><span>세로 합 <b>${sum(0, 3)}</b></span></div></div>${bank}`;
  }
  return `<ul class="hand-clues">${round.clues.map((clue) => `<li>${state.checked ? icon(matchesClue(state.slots, clue) ? "check" : "close") : ""}${esc(clueText(clue))}</li>`).join("")}</ul><div class="hand-order-labels"><b>앞</b><b>뒤</b></div><div class="hand-order-slots">${state.slots.map((_, i) => slot(i)).join("")}</div>${bank}`;
}

function transferScene(round, state) {
  const pile = (who, count, value) => `<div class="hand-pile ${who.toLowerCase()}"><h4>${who} <strong>${count}개</strong></h4><div class="hand-tokens" aria-hidden="true">${Array.from({ length: count }, () => "<i></i>").join("")}</div>${button("move", `${who}에서 1개 옮기기`, value > 0 ? "next" : "back", { value, disabled: state.solved || count === 0 })}</div>`;
  return `<div class="hand-piles">${pile("A", state.left, 1)}${pile("B", state.right, -1)}</div><div class="hand-sums"><span>옮긴 개수 <b>${state.moved}</b></span><span>두 사람의 차이 <b>${Math.abs(state.left - state.right)}</b></span></div>`;
}

function renderActivity(container, unit, session, onQuestions) {
  const previousTurn = container.querySelector(".clock-hand")?.style.transform;
  const previousActivity = container.dataset.handActivity;
  const previousFoldStep = Number(container.querySelector(".hand-scene")?.dataset.handFoldStep ?? -1);
  container.dataset.handActivity = session.active;
  const activity = HANDS_ON_ACTIVITIES[session.active];
  const state = session.states[session.active] ||= newActivityState(session.active);
  const round = activity.rounds[state.roundIndex];
  const kind = activity.kind;
  const guide = handsOnGuide(activity, round, state);
  const portrait = state.solved ? "docssam-praise.webp" : state.checked ? "docssam-thinking.webp" : "docssam-guide.webp";
  const scene = kind === "clock" ? clockScene(round, state) : kind === "mirror" ? mirrorScene(round, state) : kind === "fold" ? foldScene(round, state, previousActivity === session.active && state.foldStep > previousFoldStep && previousFoldStep >= 0) : ["cross", "order"].includes(kind) ? cardsAndSlots(activity, round, state) : transferScene(round, state);
  const atEnd = state.roundIndex === activity.rounds.length - 1;
  container.innerHTML = `<div class="hand-toolbar"><nav class="hand-activity-tabs" aria-label="단원 체험">${unit.activities.map((id) => `<button type="button" data-hand-activity="${id}" aria-current="${id === session.active ? "true" : "false"}" class="${id === session.active ? "active" : ""}">${esc(HANDS_ON_ACTIVITIES[id].title)}</button>`).join("")}</nav><span class="hand-round">도전 ${state.roundIndex + 1} / ${activity.rounds.length}</span></div><h3 class="hand-title">${esc(activity.title)}</h3><p class="hand-task">${esc(task(activity, round))}</p><div class="hand-guide" data-guide-phase="${guide.phase}"><img src="./${portrait}" alt="" width="96" height="96"><div class="hand-guide-copy" role="status" aria-live="polite" aria-atomic="true"><strong>독쌤</strong><p>${esc(guide.text)}</p></div></div><div class="hand-scene" data-hand-kind="${kind}" data-hand-round="${state.roundIndex}"${kind === "fold" ? ` data-hand-fold-step="${state.foldStep}"` : ""}>${scene}</div><p class="hand-feedback ${state.checked ? state.solved ? "correct" : "retry" : ""}" ${state.checked ? "" : "hidden"}>${state.checked ? icon(state.solved ? "check" : "close") : ""}<span>${esc(state.feedback)}</span></p><div class="hand-footer"><div class="hand-tools">${button("undo", "한 번 되돌리기", "back", { cls: "icon-only", disabled: !state.history.length || state.solved })}${button("reset", "이 도전 다시 시작", "retry", { cls: "icon-only" })}</div>${state.solved ? button(atEnd ? "questions" : "next", atEnd ? "연결 문제 풀기" : "다음 도전", "next", { cls: "hand-primary" }) : button("check", "결과 확인", "check", { cls: "hand-primary", disabled: kind === "fold" && !state.cut })}</div>${state.solved && atEnd ? '<p class="hand-finished">체험 도전 3개 완료</p>' : ""}`;
  container.querySelectorAll("[data-hand-activity]").forEach((tab) => tab.addEventListener("click", () => {
    session.active = tab.dataset.handActivity;
    renderActivity(container, unit, session, onQuestions);
    container.querySelector(`[data-hand-activity="${session.active}"]`).focus({ preventScroll: true });
  }));
  const hand = container.querySelector(".clock-hand");
  if (hand && previousTurn && previousActivity === session.active && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    hand.animate([{ transform: previousTurn }, { transform: hand.style.transform }], { duration: 220, easing: "ease-out" });
  }
  container.querySelectorAll("[data-hand-action]").forEach((control) => control.addEventListener("click", () => {
    const action = control.dataset.handAction;
    const value = control.dataset.value === undefined ? undefined : kind === "order" && action === "choose" ? control.dataset.value : Number(control.dataset.value);
    if (action === "questions") return onQuestions(activity.lesson);
    if (action === "reset") session.states[session.active] = newActivityState(session.active, state.roundIndex);
    else if (action === "next" && state.solved && !atEnd) session.states[session.active] = newActivityState(session.active, state.roundIndex + 1);
    else if (!applyActivityAction(state, action, value)) return;
    renderActivity(container, unit, session, onQuestions);
    const selector = `[data-hand-action="${action}"]${control.dataset.value === undefined ? "" : `[data-value="${control.dataset.value}"]`}`;
    const focusTarget = container.querySelector(`${selector}:not(:disabled)`) || container.querySelector('.hand-primary:not(:disabled)') || container.querySelector('[data-hand-activity]');
    focusTarget?.focus({ preventScroll: true });
  }));
}

export function mountHandsOn(container, { bookId, lessonId, onQuestions, onOpen }) {
  const unit = unitForLesson(bookId, lessonId);
  if (!unit) return;
  const key = `${bookId}/${unit.id}`;
  if (!sessions.has(key)) sessions.set(key, { active: unit.activities.find((id) => HANDS_ON_ACTIVITIES[id].lesson === lessonId) || unit.activities[0], states: {} });
  const session = sessions.get(key);
  const host = document.createElement("section");
  host.className = "gold-hands-on";
  host.dataset.handUnit = unit.id;
  host.innerHTML = `<h3>직접 해보기</h3><div class="hand-launches">${unit.activities.map((id) => `<button type="button" data-hand-open="${id}">${icon("play")}<span>${esc(HANDS_ON_ACTIVITIES[id].title)}</span></button>`).join("")}</div><dialog class="hand-modal" aria-label="직접 해보기"><div class="hand-modal-shell"><header class="hand-modal-header"><strong>직접 해보기</strong><button type="button" class="hand-close icon-only" data-hand-close title="체험 닫기" aria-label="체험 닫기">${icon("close")}</button></header><div class="hand-content"></div></div></dialog>`;
  const lead = container.querySelector(".lesson-lead");
  if (lead) lead.after(host); else container.prepend(host);
  const dialog = host.querySelector(".hand-modal");
  const content = host.querySelector(".hand-content");
  let trigger;
  const close = () => { if (dialog.open) dialog.close(); };
  host.querySelectorAll("[data-hand-open]").forEach((launch) => launch.addEventListener("click", () => {
    trigger = launch;
    session.active = launch.dataset.handOpen;
    onOpen();
    renderActivity(content, unit, session, (target) => { close(); onQuestions(target); });
    dialog.showModal();
    host.querySelector("[data-hand-close]").focus({ preventScroll: true });
  }));
  host.querySelector("[data-hand-close]").addEventListener("click", close);
  dialog.addEventListener("close", () => { if (trigger?.isConnected) trigger.focus({ preventScroll: true }); });
  host.addEventListener("keydown", (event) => event.stopPropagation());
}
