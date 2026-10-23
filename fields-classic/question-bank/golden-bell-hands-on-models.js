import { reflectCell } from "../../geometry/games/mirror-manor/levels.js";
import { foldSelectedCells, cutCells } from "./golden-bell-hands-on-folding.js?v=20261023t";

// Authored practice, not protected original questions or their answer records.
export const HANDS_ON_UNITS = [
  { bookId: "book-01", id: "movement", title: "도형 움직이기", lessons: ["clock-turning", "mirror-reflection", "digital-turn-flip"], activities: ["turn-clock", "mirror-tiles"] },
  { bookId: "book-01", id: "folding", title: "색종이 접기", lessons: ["fold-one-cut", "fold-two-cut"], activities: ["fold-once", "fold-twice"] },
  { bookId: "book-01", id: "equal-sums", title: "마방진과 가쿠로 퍼즐", lessons: ["equal-line-sums", "equal-line-placement", "gakuro-sum-grid"], activities: ["cross-sums"] },
  { bookId: "book-01", id: "logic", title: "수 추리와 논리 추리", lessons: ["number-inference", "preference-logic", "relative-order-running", "book1-equalize-transfer"], activities: ["line-order", "share-equally"] },
  // 2권: 레벨 게임(golden-bell-book02-games.js). 단원의 모든 레슨에서 열린다.
  { bookId: "book-02", id: "matrix", title: "매트릭스와 주고받기", lessons: ["number-splitting", "addition-matrix", "give-take-sum-difference", "two-term-arithmetic"], activities: ["b2-matrix"] },
  { bookId: "book-02", id: "balance", title: "양팔저울", lessons: ["balance-order", "shape-number-equations", "arithmetic-sequences"], activities: ["b2-balance", "b2-matrix"] },
  { bookId: "book-02", id: "pattern", title: "규칙찾기와 수열", lessons: ["repeating-sequence", "sequence-rules", "dual-shape-color-pattern", "multiples-2", "growth-patterns"], activities: ["b2-pattern"] },
  { bookId: "book-02", id: "sudoku", title: "약속과 스도쿠", lessons: ["multiples-3", "diamond-number-promise", "multiples-4", "sudoku", "fractions-and-folds", "multiples-5"], activities: ["b2-sudoku"] }
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
  // 골든벨 풀이: ① 교차점(가운데) 후보 정하기 → ② 남은 카드를 두 줄에 나누기 → ③ 카드·합 확인.
  // 가운데는 아이가 고른다. 남은 네 수가 합이 같은 두 쌍으로 나뉘어야 하므로 되는 가운데와 안 되는 가운데가 섞여 있다.
  "cross-sums": { title: "두 줄의 합 맞추기", kind: "cross", lesson: "equal-line-placement", rounds: [{ cards: [1, 2, 3, 4, 5] }, { cards: [2, 3, 4, 5, 6] }, { cards: [1, 3, 5, 7, 9] }] },
  "line-order": { title: "조건대로 줄 세우기", kind: "order", lesson: "relative-order-running", rounds: [
    { clues: [{ kind: "last", a: "C" }, { kind: "adjacent", a: "B", b: "A" }, { kind: "first", a: "D" }] },
    { clues: [{ kind: "last", a: "A" }, { kind: "adjacent", a: "D", b: "A" }, { kind: "before", a: "C", b: "B" }] },
    { clues: [{ kind: "first", a: "B" }, { kind: "adjacent", a: "C", b: "D" }, { kind: "last", a: "A" }] }
  ] },
  "share-equally": { title: "같아지도록 옮기기", kind: "transfer", lesson: "book1-equalize-transfer", rounds: [{ left: 10, right: 4 }, { left: 12, right: 6 }, { left: 15, right: 5 }] },
  // 2권 레벨 게임. qr: false = 게임 QR 서버에 아직 등록되지 않아 학습지 QR에서 뺀다.
  "b2-matrix": { title: "도형 값 찾기", kind: "level-game", game: "b2-matrix", lesson: "addition-matrix", qr: false, rounds: [] },
  "b2-balance": { title: "무게 줄 세우기", kind: "level-game", game: "b2-balance", lesson: "balance-order", qr: false, rounds: [] },
  "b2-pattern": { title: "무늬 기차", kind: "level-game", game: "b2-pattern", lesson: "repeating-sequence", qr: false, rounds: [] },
  "b2-sudoku": { title: "빈칸 채우기", kind: "level-game", game: "b2-sudoku", lesson: "sudoku", qr: false, rounds: [] }
};

export function unitForLesson(bookId, lessonId) {
  return HANDS_ON_UNITS.find((unit) => unit.bookId === bookId && unit.lessons.includes(lessonId));
}

export function clockValueAfterQuarterTurns(start, quarterTurns) {
  return ((start - 1 + quarterTurns * 3) % 12 + 12) % 12 + 1;
}

// 지금 펼친 단계에서 새로 생긴 자국(접은 선 반대쪽 같은 거리) 칸.
export function unfoldTargets(round, unfold) {
  const n = round.model.folds.length;
  if (unfold < 1 || unfold > n) return [];
  const before = cutCells(round.model, n - unfold + 1);
  return cutCells(round.model, n - unfold).filter((cell) => !before.includes(cell));
}

export const unfoldStageDone = (round, state) => unfoldTargets(round, state.unfold).every((cell) => state.cells.includes(cell));

export function expectedCells(activity, round) {
  if (activity.kind === "mirror") return round.given.map((cell) => reflectCell(cell, round.axis)).map(([x, y]) => y * 4 + x).sort((a, b) => a - b);
  if (activity.kind === "fold") return foldSelectedCells(round.model);
  return [];
}

// 숫자 뒤 목적격 조사: 받침 있는 읽기(영·일·삼·육·칠·팔)면 「을」, 아니면 「를」.
export const eulReul = (n) => `${n}${[0, 1, 3, 6, 7, 8].includes(Math.abs(n) % 10) ? "을" : "를"}`;

// 가운데 카드 center로 남은 네 수를 합이 같은 두 쌍으로 나눌 수 있는가.
export function crossCenterWorks(round, center) {
  const rest = round.cards.filter((n) => n !== center);
  const total = rest.reduce((a, b) => a + b, 0);
  return total % 2 === 0 && rest.slice(1).some((n) => rest[0] + n === total / 2);
}

export function clueText(clue) {
  if (clue.kind === "first") return `${clue.a}는 맨 앞에 있습니다.`;
  if (clue.kind === "last") return `${clue.a}는 맨 뒤에 있습니다.`;
  return `${clue.a}는 ${clue.b}${clue.kind === "adjacent" ? " 바로" : "보다"} 앞에 있습니다.`;
}

// 골든벨 풀이 순서: 자리가 바로 정해지는 조건(맨 앞·맨 뒤) → 붙어 있는 조건(바로 앞) → 사이 조건(~보다 앞).
const CLUE_ORDER = { first: 0, last: 0, adjacent: 1, before: 2 };
export const orderedClues = (round) => round.clues.map((clue, index) => ({ clue, index })).sort((a, b) => CLUE_ORDER[a.clue.kind] - CLUE_ORDER[b.clue.kind] || a.index - b.index).map(({ clue }) => clue);
// 지금 풀 조건: 순서대로 보아 아직 맞지 않는 첫 조건(다 맞으면 -1).
export const currentClueIndex = (round, slots) => orderedClues(round).findIndex((clue) => !matchesClue(slots, clue));

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
  return { activityId, roundIndex, turns: 0, foldStep: 0, cut: false, cells: [], slots: Array(activity.kind === "cross" ? 5 : 4).fill(null), selected: null, left: round.left, right: round.right, moved: 0, moves: 0, history: [], checked: false, solved: false, feedback: "",
    // 옮기기(transfer)는 골든벨 풀이 순서를 그대로 밟는다: ① 짝 없는 구슬로 차이 찾기 → ② 차이를 반으로 나눠 줄 만큼 고르기 → ③ 옮긴 뒤 덧셈·뺄셈으로 확인.
    phase: "diff", marked: [], give: [], note: "", misses: 0,
    // 접기(fold)도 풀이 순서대로: 자른 뒤 마지막 접기부터 한 번씩 펼치고, 펼칠 때마다 새 자국을 표시한다.
    unfold: 0 };
}

export function activityCheck(state) {
  const activity = HANDS_ON_ACTIVITIES[state.activityId], round = activity.rounds[state.roundIndex];
  if (activity.kind === "clock") return state.turns === round.turns;
  if (["mirror", "fold"].includes(activity.kind)) {
    const expected = expectedCells(activity, round);
    return state.cells.length === expected.length && expected.every((cell) => state.cells.includes(cell)) && (activity.kind !== "fold" || (state.cut && state.unfold === round.model.folds.length));
  }
  if (activity.kind === "cross") {
    // 자리: 0 위 · 1 왼쪽 · 2 오른쪽 · 3 아래 · 4 가운데.
    const [top, left, right, bottom] = state.slots;
    return state.slots.every((n) => round.cards.includes(n)) && new Set(state.slots).size === 5 && top + bottom === left + right;
  }
  if (activity.kind === "order") return new Set(state.slots).size === 4 && state.slots.every((v) => ["A", "B", "C", "D"].includes(v)) && round.clues.every((clue) => matchesClue(state.slots, clue));
  return state.phase === "done" && state.left === state.right && state.left + state.right === round.left + round.right;
}

export const transferDifference = (round) => round.left - round.right;

export function activityFeedback(state) {
  const activity = HANDS_ON_ACTIVITIES[state.activityId], round = activity.rounds[state.roundIndex];
  if (!state.solved) return ({ clock: "출발한 수와 방향, 돌린 양을 함께 살펴보세요.", mirror: "거울에서 떨어진 칸 수가 양쪽에서 같은지 살펴보세요.", fold: "접은 선의 반대쪽에도 같은 거리에 자국이 생기는지 살펴보세요.", cross: "카드를 한 번씩 쓰고 가로줄과 세로줄을 비교해 보세요.", order: "앞뒤 방향과 '바로 앞' 조건을 다시 살펴보세요.", transfer: "옮긴 뒤 A와 B의 개수를 덧셈과 뺄셈으로 다시 세어 보세요." })[activity.kind];
  if (activity.kind === "clock") return `맞았어요. ${round.start}에서 출발해 ${clockValueAfterQuarterTurns(round.start, round.turns)}을 가리킵니다.`;
  if (activity.kind === "mirror") return "맞았어요. 거울 양쪽에서 같은 거리에 있는 칸끼리 짝이 됩니다.";
  if (activity.kind === "fold") return `맞았어요. 마지막에 접은 선부터 펼치면 잘린 칸 ${state.cells.length}개가 나타납니다.`;
  if (activity.kind === "cross") { const c = state.slots[4]; return `맞았어요. 가운데 ${eulReul(c)} 두 줄이 함께 쓰므로 남은 두 쌍의 합(${state.slots[1]} + ${state.slots[2]} = ${state.slots[0]} + ${state.slots[3]})만 같으면 돼요. 가로 ${state.slots[1]} + ${c} + ${state.slots[2]} = ${state.slots[1] + c + state.slots[2]}, 세로 ${state.slots[0]} + ${c} + ${state.slots[3]} = ${state.slots[0] + c + state.slots[3]}입니다.`; }
  if (activity.kind === "order") return `맞았어요. ${state.slots.join(" → ")} 순서가 모든 조건에 맞습니다.`;
  return `맞았어요. 차이 ${transferDifference(round)}개를 둘로 나눈 ${state.moved}개를 옮겨 ${round.left} − ${state.moved} = ${state.left}, ${round.right} + ${state.moved} = ${state.right}로 같아졌어요.`;
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
    Object.assign(state, state.history.pop(), { checked: false, feedback: "", note: "" });
    return true;
  }
  const snapshot = { turns: state.turns, foldStep: state.foldStep, cut: state.cut, cells: [...state.cells], slots: [...state.slots], selected: state.selected, left: state.left, right: state.right, moved: state.moved, moves: state.moves, phase: state.phase, marked: [...state.marked], give: [...state.give], note: "", unfold: state.unfold };
  let changed = false;
  if (activity.kind === "fold" && ["unfold", "cell"].includes(action)) {
    const n = round.model.folds.length;
    state.note = "";
    if (action === "unfold" && state.cut && state.unfold < n && unfoldStageDone(round, state)) { state.unfold++; changed = true; }
    if (action === "cell" && state.cut && state.unfold > 0 && Number.isInteger(value) && value >= 0 && value < 16) {
      const targets = unfoldTargets(round, state.unfold);
      if (targets.includes(value)) { state.cells = state.cells.includes(value) ? state.cells.filter((cell) => cell !== value) : [...state.cells, value]; changed = true; }
      else if (!state.cells.includes(value)) {
        const fold = round.model.folds[n - state.unfold];
        state.note = `방금 펼친 ${fold === "left" || fold === "right" ? "세로" : "가로"} 접은 선을 거울로 생각해 봐. 있던 자국에서 접은 선까지 몇 칸인지 세고, 반대쪽으로 같은 칸만큼 가면 새 자국이야.`;
        state.misses++;
        return true;
      }
    }
    if (changed) { state.history.push(snapshot); state.moves++; state.checked = false; state.feedback = ""; }
    return changed;
  }
  if (activity.kind === "transfer" && ["mark", "give", "hand"].includes(action)) {
    const difference = transferDifference(round);
    state.note = "";
    if (action === "mark" && state.phase === "diff" && Number.isInteger(value) && value >= 0 && value < round.left) {
      // B와 짝이 있는 구슬(앞쪽 right개)은 차이가 아니다.
      if (value < round.right) { state.note = "그 구슬은 아래 B의 구슬과 짝이 있어요. 짝이 없는 A의 구슬만 눌러요."; state.misses++; return true; }
      state.marked = state.marked.includes(value) ? state.marked.filter((i) => i !== value) : [...state.marked, value];
      if (state.marked.length === difference) state.phase = "half";
      changed = true;
    }
    if (action === "give" && state.phase === "half" && state.marked.includes(value)) {
      state.give = state.give.includes(value) ? state.give.filter((i) => i !== value) : [...state.give, value];
      changed = true;
    }
    if (action === "hand" && state.phase === "half" && state.give.length) {
      const k = state.give.length;
      if (k * 2 !== difference) {
        // 미리 따져 보게 한다 — 옮기지 않고 그 결과만 말해 준다.
        state.note = k * 2 > difference
          ? `${k}개를 주면 A는 ${round.left - k}개, B는 ${round.right + k}개가 되어 이번엔 B가 ${k * 2 - difference}개 더 많아요. 한 개를 줄 때마다 차이는 2씩 줄어요.`
          : `${k}개를 주면 A는 ${round.left - k}개, B는 ${round.right + k}개라 아직 A가 ${difference - k * 2}개 더 많아요. 한 개를 줄 때마다 차이는 2씩 줄어요.`;
        state.misses++;
        return true;
      }
      state.left -= k; state.right += k; state.moved = k; state.phase = "done";
      changed = true;
    }
  }
  if (action === "turn" && activity.kind === "clock" && [-1, 1].includes(value) && Math.abs(state.turns + value) <= 8) { state.turns += value; changed = true; }
  if (action === "fold" && activity.kind === "fold" && state.foldStep < round.model.folds.length) { state.foldStep++; changed = true; }
  if (action === "cut" && activity.kind === "fold" && state.foldStep === round.model.folds.length && !state.cut) { state.cut = true; state.cells = cutCells(round.model, round.model.folds.length); changed = true; }
  if (action === "cell" && Number.isInteger(value) && value >= 0 && value < 16 && activity.kind === "mirror") {
    const givenSide = round.axis.kind === "vertical" ? value % 4 < 2 : Math.floor(value / 4) < 2;
    if (!givenSide) { state.cells = state.cells.includes(value) ? state.cells.filter((cell) => cell !== value) : [...state.cells, value]; changed = true; }
  }
  if (action === "slot" && ["cross", "order"].includes(activity.kind) && Number.isInteger(value) && value >= 0 && value < state.slots.length) {
    const pool = activity.kind === "cross" ? round.cards : ["A", "B", "C", "D"];
    // ① 가운데부터: 두 줄이 함께 쓰는 교차점을 먼저 정해야 남은 카드를 나눌 수 있다.
    state.note = "";
    if (activity.kind === "cross" && state.slots[4] === null && value !== 4 && state.selected !== null) { state.note = "먼저 두 줄이 함께 쓰는 가운데 자리에 놓을 카드를 정해 봐."; state.selected = null; return true; }
    if (state.selected === null) { state.selected = state.slots[value]; return true; }
    if (pool.includes(state.selected)) {
      const previous = state.slots.indexOf(state.selected);
      if (previous >= 0) state.slots[previous] = state.slots[value];
      state.slots[value] = state.selected;
      state.selected = null;
      changed = true;
    }
  }
  if (changed) { state.history.push(snapshot); state.moves++; state.checked = false; state.feedback = ""; }
  return changed;
}
