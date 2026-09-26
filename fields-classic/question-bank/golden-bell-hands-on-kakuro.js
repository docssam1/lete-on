// New practice grids follow the card-placement action on teacher slide 24.
// The source questions and their answer layouts are not reproduced here.
export const KAKURO_ROUNDS = Object.freeze([
  { id: "kakuro-1", rows: 2, cols: 2, givens: { 0: 1 }, cards: [4, 7, 8], rowSums: [5, 15], colSums: [8, 12] },
  { id: "kakuro-2", rows: 2, cols: 3, givens: { 0: 2, 4: 3 }, cards: [6, 9, 7, 5], rowSums: [17, 15], colSums: [9, 9, 14] },
  { id: "kakuro-3", rows: 2, cols: 2, givens: { 3: 6 }, cards: [3, 9, 2], rowSums: [12, 8], colSums: [5, 15] },
  { id: "kakuro-4", rows: 2, cols: 3, givens: { 2: 5, 4: 7 }, cards: [8, 1, 4, 9], rowSums: [14, 20], colSums: [12, 8, 14] },
  { id: "kakuro-5", rows: 2, cols: 3, givens: { 0: 6, 5: 1 }, cards: [2, 7, 9, 5], rowSums: [15, 15], colSums: [15, 7, 8] }
].map((round) => Object.freeze({
  ...round,
  givens: Object.freeze(round.givens),
  cards: Object.freeze(round.cards),
  rowSums: Object.freeze(round.rowSums),
  colSums: Object.freeze(round.colSums)
})));

const givenAt = (round, index) => Object.hasOwn(round.givens, index) ? round.givens[index] : null;
const sum = (values) => values.reduce((total, value) => total + value, 0);

export function newKakuroState(round) {
  return {
    cells: Array.from({ length: round.rows * round.cols }, (_, index) => givenAt(round, index)),
    selected: null,
    checked: false,
    solved: false,
    feedback: ""
  };
}

export function kakuroSelection(round, state, card) {
  if (!Number.isInteger(card) || !round.cards.includes(card)) return state.selected;
  return state.selected === card ? null : card;
}

export function kakuroCheck(round, state) {
  if (!Array.isArray(state.cells) || state.cells.length !== round.rows * round.cols) return false;
  if (!Object.keys(round.givens).every((index) => state.cells[index] === round.givens[index])) return false;
  const placed = state.cells.filter((_, index) => givenAt(round, index) === null);
  if (placed.length !== round.cards.length || new Set(placed).size !== round.cards.length ||
      !placed.every((value) => round.cards.includes(value))) return false;
  return round.rowSums.every((target, row) =>
    sum(state.cells.slice(row * round.cols, (row + 1) * round.cols)) === target) &&
    round.colSums.every((target, col) =>
      sum(Array.from({ length: round.rows }, (_, row) => state.cells[row * round.cols + col])) === target);
}

export function kakuroFeedback(round, state) {
  if (kakuroCheck(round, state)) return "맞았어요. 모든 카드를 한 번씩 쓰고 가로와 세로의 합도 맞췄어요.";
  if (state.cells.some((value) => value === null)) return "빈칸에 카드를 모두 놓아 보세요.";
  const wrongRow = round.rowSums.findIndex((target, row) =>
    sum(state.cells.slice(row * round.cols, (row + 1) * round.cols)) !== target);
  if (wrongRow >= 0) return `${wrongRow + 1}번째 가로줄의 합을 다시 살펴보세요.`;
  const wrongCol = round.colSums.findIndex((target, col) =>
    sum(Array.from({ length: round.rows }, (_, row) => state.cells[row * round.cols + col])) !== target);
  return wrongCol >= 0 ? `${wrongCol + 1}번째 세로줄의 합을 다시 살펴보세요.` : "카드를 한 번씩만 썼는지 살펴보세요.";
}

export function applyKakuroAction(round, state, action, value) {
  if (state.solved) return state;
  if (action === "kakuro-check") {
    const solved = kakuroCheck(round, state);
    return { ...state, checked: true, solved, feedback: kakuroFeedback(round, state) };
  }
  if (action === "kakuro-card") {
    const selected = kakuroSelection(round, state, value);
    return selected === state.selected ? state : { ...state, selected, checked: false, feedback: "" };
  }
  if (action !== "kakuro-cell" || !Number.isInteger(value) || value < 0 ||
      value >= state.cells.length || givenAt(round, value) !== null) return state;
  const cells = [...state.cells];
  if (state.selected === null) {
    if (cells[value] === null) return state;
    cells[value] = null;
  } else {
    if (!round.cards.includes(state.selected)) return state;
    const previous = cells.indexOf(state.selected);
    if (previous === value) return { ...state, selected: null };
    if (previous >= 0) cells[previous] = null;
    cells[value] = state.selected;
  }
  return { ...state, cells, selected: null, checked: false, feedback: "" };
}

const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g,
  (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);

export function kakuroScene(round, state) {
  const frame = "width:min(100%,320px);margin-inline:auto;";
  const triangle = "display:grid;place-items:center;width:100%;aspect-ratio:1;background:#d6ebf4;color:#173746;font-weight:700;font-size:18px;";
  const cellStyle = "width:100%;aspect-ratio:1;min-width:0;min-height:0;border:1px solid #76a6bc;border-radius:0;background:#fff;color:#182d38;font-size:22px;font-weight:700;";
  const grid = [];
  for (let col = 0; col < round.cols; col++) {
    grid.push(`<span role="img" aria-label="${col + 1}번째 세로줄의 합 ${round.colSums[col]}" style="${triangle}clip-path:polygon(50% 0,100% 100%,0 100%);">${round.colSums[col]}</span>`);
  }
  grid.push('<span aria-hidden="true"></span>');
  for (let row = 0; row < round.rows; row++) {
    for (let col = 0; col < round.cols; col++) {
      const index = row * round.cols + col;
      const value = state.cells[index];
      const label = `${row + 1}행 ${col + 1}열`;
      grid.push(givenAt(round, index) !== null
        ? `<span role="img" aria-label="${label}, 처음 놓인 수 ${value}" style="${cellStyle}display:grid;place-items:center;background:#e9f3f6;box-sizing:border-box;">${escapeHtml(value)}</span>`
        : `<button type="button" data-hand-action="kakuro-cell" data-value="${index}" aria-label="${label}, ${value === null ? "빈칸" : `${value} 카드`}" style="${cellStyle}cursor:pointer;box-sizing:border-box;" ${state.solved ? "disabled" : ""}>${value === null ? "" : escapeHtml(value)}</button>`);
    }
    grid.push(`<span role="img" aria-label="${row + 1}번째 가로줄의 합 ${round.rowSums[row]}" style="${triangle}clip-path:polygon(0 0,100% 50%,0 100%);">${round.rowSums[row]}</span>`);
  }
  const cards = round.cards.map((card) => {
    const used = state.cells.includes(card);
    return `<button type="button" data-hand-action="kakuro-card" data-value="${card}" aria-label="${card} 카드${used ? ", 격자에 놓임" : ""}" aria-pressed="${state.selected === card}" style="width:48px;height:52px;flex:0 0 48px;border:2px solid ${state.selected === card ? "#146b68" : "#82aab8"};border-radius:4px;background:${used ? "#e9f3f6" : "#fff"};color:#182d38;font-size:21px;font-weight:700;cursor:pointer;" ${state.solved ? "disabled" : ""}>${card}</button>`;
  }).join("");
  return `<div class="hand-kakuro" style="${frame}box-sizing:border-box;overflow:hidden;"><div role="group" aria-label="가로 세로 합 격자" style="display:grid;grid-template-columns:repeat(${round.cols + 1},minmax(0,1fr));gap:3px;align-items:center;">${grid.join("")}</div><div role="group" aria-label="놓을 숫자 카드" style="display:flex;flex-wrap:wrap;justify-content:center;gap:8px;margin-top:18px;">${cards}</div></div>`;
}
