// New diagrams retain the source's action: infer one missing number from equal line sums.
export const EQUAL_LINE_ROUNDS = Object.freeze([
  { points: [[1, 0, null], [0, 1, 6], [1, 1, 4], [2, 1, 2], [1, 2, 5]], lines: [[1, 2, 3], [0, 2, 4]] },
  { points: [[0, 0, 7], [1, 0, 5], [2, 0, null], [0, 1, 6], [0, 2, 4]], lines: [[0, 1, 2], [0, 3, 4]] },
  { points: [[0, 0, 2], [1, 0, 8], [2, 0, null], [1, 1, 5], [1, 2, 6]], lines: [[0, 1, 2], [1, 3, 4]] },
  { points: [[1, 0, 3], [0, 1, 8], [1, 1, 2], [2, 1, 4], [1, 2, null]], lines: [[1, 2, 3], [0, 2, 4]] },
  { points: [[0, 0, 9], [1, 0, 1], [2, 0, 6], [1, 1, 7], [1, 2, null]], lines: [[0, 1, 2], [1, 3, 4]] }
]);

export function equalLineAnswer(round) {
  const missing = round.points.findIndex((point) => point[2] === null);
  const target = round.lines.find((line) => line.includes(missing));
  const known = round.lines.find((line) => !line.includes(missing));
  if (missing < 0 || !target || !known) throw new Error("One line must determine the missing cell");
  return known.reduce((sum, index) => sum + round.points[index][2], 0)
    - target.reduce((sum, index) => sum + (round.points[index][2] ?? 0), 0);
}

const position = (point) => [48 + point[0] * 100, 48 + point[1] * 100];

export function equalLineScene(round, state) {
  const index = round.points.findIndex((point) => point[2] === null);
  const lines = round.lines.map((line) => `<polyline points="${line.map((cell) => position(round.points[cell]).join(",")).join(" ")}"/>`).join("");
  const points = round.points.map((point, cell) => {
    const [x, y] = position(point);
    return `<g><circle cx="${x}" cy="${y}" r="27" class="${cell === index ? "missing" : ""}"/><text x="${x}" y="${y}">${cell === index ? state.equalChoice ?? "?" : point[2]}</text></g>`;
  }).join("");
  const choices = Array.from({ length: 12 }, (_, i) => i + 1).map((value) => `<button type="button" data-hand-action="equal-choice" data-value="${value}" aria-label="빈칸에 ${value} 놓기" aria-pressed="${state.equalChoice === value}" ${state.solved ? "disabled" : ""}>${value}</button>`).join("");
  const sum = (line) => line.every((cell) => round.points[cell][2] !== null || state.equalChoice !== null)
    ? line.reduce((total, cell) => total + (round.points[cell][2] ?? state.equalChoice), 0) : "?";
  return `<div class="hand-equal-lines"><svg viewBox="0 0 296 296" role="img" aria-label="두 줄의 합을 같게 만드는 도형"><g class="hand-equal-links">${lines}</g><g class="hand-equal-points">${points}</g></svg><div class="hand-sums"><span>첫째 줄 <b>${sum(round.lines[0])}</b></span><span>둘째 줄 <b>${sum(round.lines[1])}</b></span></div><div class="hand-equal-choices" role="group" aria-label="빈칸에 놓을 수">${choices}</div></div>`;
}

export function equalLineFeedback(round, state) {
  if (!state.solved) return "빈칸이 없는 줄부터 더한 뒤, 다른 줄의 합과 비교해 보세요.";
  const missing = round.points.findIndex((point) => point[2] === null);
  const known = round.lines.find((line) => !line.includes(missing));
  const knownValues = known.map((cell) => round.points[cell][2]);
  return `맞았어요. 빈칸이 없는 줄은 ${knownValues.join(" + ")} = ${knownValues.reduce((a, b) => a + b, 0)}이고, 빈칸에는 ${equalLineAnswer(round)}가 들어갑니다.`;
}
