import { reflectCell } from "../../geometry/games/mirror-manor/levels.js";
import { foldSelectedCells } from "./golden-bell-hands-on-folding.js?v=20260925a";

// Authored practice, not protected original questions or their answer records.
export const HANDS_ON_UNITS = [
  { bookId: "book-01", id: "movement", title: "도형 움직이기", lessons: ["clock-turning", "mirror-reflection", "digital-turn-flip"], activities: ["turn-clock", "mirror-tiles"] },
  { bookId: "book-01", id: "folding", title: "색종이 접기", lessons: ["fold-one-cut", "fold-two-cut"], activities: ["fold-once", "fold-twice"] },
  { bookId: "book-01", id: "equal-sums", title: "마방진과 가쿠로 퍼즐", lessons: ["equal-line-sums", "equal-line-placement", "gakuro-sum-grid"], activities: ["cross-sums"] },
  { bookId: "book-01", id: "logic", title: "수 추리와 논리 추리", lessons: ["number-inference", "preference-logic", "relative-order-running", "book1-equalize-transfer"], activities: ["line-order", "share-equally"] }
];

const cut = (row, col) => [[[col / 4, row / 4], [(col + 1) / 4, row / 4], [(col + 1) / 4, (row + 1) / 4], [col / 4, (row + 1) / 4]]];
const folding = (folds, row, col) => ({ model: { folds, cuts: cut(row, col), grid: 4 } });
export const HANDS_ON_ACTIVITIES = {
  "turn-clock": { title: "시계 바늘 돌리기", kind: "clock", lesson: "clock-turning", rounds: [
    { start: 3, turns: 2 }, { start: 5, turns: -1 }, { start: 8, turns: 4 }
  ] },
  "mirror-tiles": { title: "거울 모양 만들기", kind: "mirror", lesson: "mirror-reflection", rounds: [
    { axis: { kind: "vertical", at: 2 }, given: [[0, 0], [1, 0], [1, 1], [1, 2]] },
    { axis: { kind: "horizontal", at: 2 }, given: [[0, 0], [1, 0], [2, 0], [0, 1]] },
    { axis: { kind: "vertical", at: 2 }, given: [[0, 0], [0, 1], [1, 1], [1, 2]] }
  ] },
  "fold-once": { title: "한 번 접고 잘라 보기", kind: "fold", lesson: "fold-one-cut", rounds: [folding(["right"], 0, 3), folding(["up"], 0, 1), folding(["left"], 2, 0)] },
  "fold-twice": { title: "두 번 접고 펼쳐 보기", kind: "fold", lesson: "fold-two-cut", rounds: [folding(["right", "down"], 3, 2), folding(["up", "left"], 0, 1), folding(["down", "left"], 3, 0)] },
  "cross-sums": { title: "두 줄의 합 맞추기", kind: "cross", lesson: "equal-line-placement", rounds: [{ center: 3 }, { center: 1 }, { center: 5 }] },
  "line-order": { title: "조건대로 줄 세우기", kind: "order", lesson: "relative-order-running", rounds: [
    { clues: [{ kind: "last", a: "C" }, { kind: "adjacent", a: "B", b: "A" }, { kind: "first", a: "D" }] },
    { clues: [{ kind: "last", a: "A" }, { kind: "adjacent", a: "D", b: "A" }, { kind: "before", a: "C", b: "B" }] },
    { clues: [{ kind: "first", a: "B" }, { kind: "adjacent", a: "C", b: "D" }, { kind: "last", a: "A" }] }
  ] },
  "share-equally": { title: "같아지도록 옮기기", kind: "transfer", lesson: "book1-equalize-transfer", rounds: [{ left: 10, right: 4 }, { left: 12, right: 6 }, { left: 15, right: 5 }] }
};

export function unitForLesson(bookId, lessonId) {
  return HANDS_ON_UNITS.find((unit) => unit.bookId === bookId && unit.lessons.includes(lessonId));
}

export function clockValueAfterQuarterTurns(start, quarterTurns) {
  return ((start - 1 + quarterTurns * 3) % 12 + 12) % 12 + 1;
}

export function expectedCells(activity, round) {
  if (activity.kind === "mirror") return round.given.map((cell) => reflectCell(cell, round.axis)).map(([x, y]) => y * 4 + x).sort((a, b) => a - b);
  if (activity.kind === "fold") return foldSelectedCells(round.model);
  return [];
}

export function clueText(clue) {
  if (clue.kind === "first") return `${clue.a}는 맨 앞에 있습니다.`;
  if (clue.kind === "last") return `${clue.a}는 맨 뒤에 있습니다.`;
  return `${clue.a}는 ${clue.b}${clue.kind === "adjacent" ? " 바로" : "보다"} 앞에 있습니다.`;
}

export function matchesClue(slots, clue) {
  const a = slots.indexOf(clue.a), b = slots.indexOf(clue.b);
  if (a < 0) return false;
  if (clue.kind === "first") return a === 0;
  if (clue.kind === "last") return a === slots.length - 1;
  if (b < 0) return false;
  return clue.kind === "adjacent" ? a + 1 === b : a < b;
}

export function newActivityState(activityId, roundIndex = 0) {
  const activity = HANDS_ON_ACTIVITIES[activityId];
  const round = activity.rounds[roundIndex];
  return { activityId, roundIndex, turns: 0, foldStep: 0, cut: false, cells: [], slots: Array(4).fill(null), selected: null, left: round.left, right: round.right, moved: 0, moves: 0, history: [], checked: false, solved: false, feedback: "" };
}

export function activityCheck(state) {
  const activity = HANDS_ON_ACTIVITIES[state.activityId], round = activity.rounds[state.roundIndex];
  if (activity.kind === "clock") return state.turns === round.turns;
  if (["mirror", "fold"].includes(activity.kind)) {
    const expected = expectedCells(activity, round);
    return state.cells.length === expected.length && expected.every((cell) => state.cells.includes(cell)) && (activity.kind !== "fold" || state.cut);
  }
  if (activity.kind === "cross") {
    const [top, left, right, bottom] = state.slots;
    return state.slots.every((n) => Number.isInteger(n) && n >= 1 && n <= 5) && new Set([...state.slots, round.center]).size === 5 && top + bottom === left + right;
  }
  if (activity.kind === "order") return new Set(state.slots).size === 4 && state.slots.every((v) => ["A", "B", "C", "D"].includes(v)) && round.clues.every((clue) => matchesClue(state.slots, clue));
  return state.left === state.right && state.left + state.right === round.left + round.right;
}

export function activityFeedback(state) {
  const activity = HANDS_ON_ACTIVITIES[state.activityId], round = activity.rounds[state.roundIndex];
  if (!state.solved) return ({ clock: "출발한 수와 방향, 돌린 양을 함께 살펴보세요.", mirror: "거울에서 떨어진 칸 수가 양쪽에서 같은지 살펴보세요.", fold: "접은 선의 반대쪽에도 같은 거리에 자국이 생기는지 살펴보세요.", cross: "카드를 한 번씩 쓰고 가로줄과 세로줄을 비교해 보세요.", order: "앞뒤 방향과 '바로 앞' 조건을 다시 살펴보세요.", transfer: "옮긴 뒤 A와 B의 개수를 비교해 보세요." })[activity.kind];
  if (activity.kind === "clock") return `맞았어요. ${round.start}에서 출발해 ${clockValueAfterQuarterTurns(round.start, round.turns)}을 가리킵니다.`;
  if (activity.kind === "mirror") return "맞았어요. 거울 양쪽에서 같은 거리에 있는 칸끼리 짝이 됩니다.";
  if (activity.kind === "fold") return `맞았어요. 마지막에 접은 선부터 펼치면 잘린 칸 ${state.cells.length}개가 나타납니다.`;
  if (activity.kind === "cross") return `맞았어요. 가로 ${state.slots[1]} + ${round.center} + ${state.slots[2]} = ${state.slots[1] + round.center + state.slots[2]}, 세로 ${state.slots[0]} + ${round.center} + ${state.slots[3]} = ${state.slots[0] + round.center + state.slots[3]}입니다.`;
  if (activity.kind === "order") return `맞았어요. ${state.slots.join(" → ")} 순서가 모든 조건에 맞습니다.`;
  return `맞았어요. ${state.moved}개를 옮겨 ${round.left} − ${state.moved} = ${state.left}, ${round.right} + ${state.moved} = ${state.right}로 같아졌어요. 한 개를 옮길 때 차이는 2 줄어듭니다.`;
}

// UI and tests use the same bounded transitions; attempts never update lesson grades.
export function applyActivityAction(state, action, value) {
  const activity = HANDS_ON_ACTIVITIES[state.activityId], round = activity.rounds[state.roundIndex];
  if (action === "check") {
    state.checked = true;
    state.solved = activityCheck(state);
    state.feedback = activityFeedback(state);
    return true;
  }
  if (state.solved) return false;
  if (action === "choose") { state.selected = value; return true; }
  if (action === "undo") {
    if (!state.history.length) return false;
    Object.assign(state, state.history.pop(), { checked: false, feedback: "" });
    return true;
  }
  const snapshot = { turns: state.turns, foldStep: state.foldStep, cut: state.cut, cells: [...state.cells], slots: [...state.slots], selected: state.selected, left: state.left, right: state.right, moved: state.moved, moves: state.moves };
  let changed = false;
  if (action === "turn" && activity.kind === "clock" && [-1, 1].includes(value) && Math.abs(state.turns + value) <= 8) { state.turns += value; changed = true; }
  if (action === "fold" && activity.kind === "fold" && state.foldStep < round.model.folds.length) { state.foldStep++; changed = true; }
  if (action === "cut" && activity.kind === "fold" && state.foldStep === round.model.folds.length && !state.cut) { state.cut = true; changed = true; }
  if (action === "cell" && Number.isInteger(value) && value >= 0 && value < 16 && ["mirror", "fold"].includes(activity.kind)) {
    const givenSide = activity.kind === "mirror" && (round.axis.kind === "vertical" ? value % 4 < 2 : Math.floor(value / 4) < 2);
    if (!givenSide && (activity.kind !== "fold" || state.cut)) { state.cells = state.cells.includes(value) ? state.cells.filter((cell) => cell !== value) : [...state.cells, value]; changed = true; }
  }
  if (action === "slot" && ["cross", "order"].includes(activity.kind) && Number.isInteger(value) && value >= 0 && value < 4) {
    const pool = activity.kind === "cross" ? [1, 2, 3, 4, 5].filter((n) => n !== round.center) : ["A", "B", "C", "D"];
    if (state.selected === null) { state.selected = state.slots[value]; return true; }
    if (pool.includes(state.selected)) {
      const previous = state.slots.indexOf(state.selected);
      if (previous >= 0) state.slots[previous] = state.slots[value];
      state.slots[value] = state.selected;
      state.selected = null;
      changed = true;
    }
  }
  if (action === "move" && activity.kind === "transfer" && [-1, 1].includes(value) && (value > 0 ? state.left > 0 : state.right > 0)) { state.left -= value; state.right += value; state.moved += value; changed = true; }
  if (changed) { state.history.push(snapshot); state.moves++; state.checked = false; state.feedback = ""; }
  return changed;
}
