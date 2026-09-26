// A moved pile flips over before it lands on top of the pile already there.
const FOLDS = {
  right: { source: [0, 2], target: [1, 3] },
  left: { source: [1, 3], target: [0, 2] },
  down: { source: [0, 1], target: [2, 3] },
  up: { source: [2, 3], target: [0, 1] }
};

export const FOLD_QUARTER_ROUNDS = Object.freeze([
  { folds: ["down", "right"] },
  { folds: ["up", "left"] },
  { folds: ["right", "up"] },
  { folds: ["left", "down"] },
  { folds: ["right", "down"] }
]);

export function foldedQuarterPiles(folds) {
  const piles = [[1], [2], [3], [4]];
  for (const direction of folds) {
    const fold = FOLDS[direction];
    if (!fold) throw new Error(`Unknown fold: ${direction}`);
    for (let i = 0; i < 2; i++) {
      const from = fold.source[i], to = fold.target[i];
      piles[to] = [...piles[to], ...piles[from].slice().reverse()];
      piles[from] = [];
    }
  }
  return piles;
}

export function topFoldedQuarter(round) {
  const occupied = foldedQuarterPiles(round.folds).filter((pile) => pile.length);
  if (occupied.length !== 1 || occupied[0].length !== 4) throw new Error("Two orthogonal folds must make one four-layer pile");
  return occupied[0].at(-1);
}

const names = { right: "오른쪽", left: "왼쪽", down: "아래쪽", up: "위쪽" };

export function foldQuarterScene(round, state) {
  const step = state.foldStep;
  const paper = step === 0
    ? `<div class="hand-quarter-original">${[1, 2, 3, 4].map((n) => `<span>${n}</span>`).join("")}</div>`
    : `<div class="hand-quarter-folded step-${step} ${["up", "down"].includes(round.folds[0]) ? "wide" : "tall"}"><span>${state.solved ? topFoldedQuarter(round) : "?"}</span></div>`;
  const choices = [1, 2, 3, 4].map((n) => `<button type="button" data-hand-action="quarter-choice" data-value="${n}" aria-label="${n}번 칸 고르기" aria-pressed="${state.quarterChoice === n}" ${step < 2 || state.solved ? "disabled" : ""}>${n}</button>`).join("");
  return `<div class="hand-quarter"><div class="hand-quarter-stage"><figure>${paper}<figcaption>${step === 0 ? "처음 색종이" : step === 1 ? "한 번 접은 종이 · 두 겹" : "두 번 접은 종이 · 네 겹"}</figcaption></figure></div><div class="hand-controls"><button type="button" data-hand-action="fold" ${step >= 2 || state.solved ? "disabled" : ""}>${step < 2 ? `${step + 1}번째: ${names[round.folds[step]]}으로 접기` : "접기 완료"}</button></div><p class="hand-diagram-label">맨 위에 오는 번호</p><div class="hand-quarter-choices" role="group" aria-label="맨 위에 오는 번호">${choices}</div></div>`;
}

export function foldQuarterFeedback(round, state) {
  if (!state.solved) return "종이를 접을 때마다 움직인 부분이 남은 부분 위에 놓입니다. 접는 순서를 다시 따라가 보세요.";
  return `${names[round.folds[0]]}으로 접고 ${names[round.folds[1]]}으로 다시 접으면 ${topFoldedQuarter(round)}번 칸이 맨 위에 옵니다.`;
}
