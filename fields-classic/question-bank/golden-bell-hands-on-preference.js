// Authored practice modeled on the source's three-person, three-choice deduction format.
export const PREFERENCE_ROUNDS = Object.freeze([
  {
    people: ["민아", "지후", "서윤"],
    objects: ["드럼", "피아노", "플루트"],
    clues: [{ person: 0, object: 1, kind: "likes" }, { person: 1, object: 0, kind: "not" }]
  },
  {
    people: ["하린", "도윤", "유나"],
    objects: ["자전거", "버스", "기차"],
    clues: [{ person: 2, object: 1, kind: "likes" }, { person: 0, object: 0, kind: "not" }]
  },
  {
    people: ["태오", "수빈", "가온"],
    objects: ["쿠키", "떡", "빵"],
    clues: [{ person: 1, object: 0, kind: "not" }, { person: 1, object: 2, kind: "not" }, { person: 2, object: 0, kind: "not" }]
  },
  {
    people: ["나율", "현우", "이안"],
    objects: ["장미", "튤립", "해바라기"],
    clues: [{ person: 0, object: 2, kind: "likes" }, { person: 1, object: 0, kind: "not" }]
  },
  {
    people: ["지민", "채아", "시온"],
    objects: ["연필", "색연필", "붓"],
    clues: [{ person: 2, object: 0, kind: "not" }, { person: 2, object: 1, kind: "not" }, { person: 0, object: 0, kind: "not" }]
  }
]);

const esc = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);

export function preferenceClueText(round, clue) {
  const object = round.objects[clue.object];
  const last = object.charCodeAt(object.length - 1);
  const particle = last >= 0xac00 && last <= 0xd7a3 && (last - 0xac00) % 28 ? "을" : "를";
  return `${round.people[clue.person]}는 ${object}${particle} ${clue.kind === "not" ? "좋아하지 않습니다" : "좋아합니다"}.`;
}

export function preferenceMatchesClue(assignment, clue) {
  return clue.kind === "likes" ? assignment[clue.person] === clue.object : clue.kind === "not" && assignment[clue.person] !== clue.object;
}

// A cell index is person * 3 + object. Selecting a cell clears its row and column.
export function preferenceSelection(cells, index) {
  const current = Array.isArray(cells) ? cells : [];
  if (!Number.isInteger(index) || index < 0 || index >= 9) return [...current];
  if (current.includes(index)) return current.filter((cell) => cell !== index);
  return [...current.filter((cell) => Math.floor(cell / 3) !== Math.floor(index / 3) && cell % 3 !== index % 3), index].sort((a, b) => a - b);
}

export function preferenceCheck(round, state) {
  const cells = state?.cells;
  if (!Array.isArray(cells) || cells.length !== 3 || cells.some((cell) => !Number.isInteger(cell) || cell < 0 || cell >= 9)) return false;
  const people = cells.map((cell) => Math.floor(cell / 3));
  const objects = cells.map((cell) => cell % 3);
  if (new Set(people).size !== 3 || new Set(objects).size !== 3) return false;
  const assignment = Array(3);
  cells.forEach((cell) => { assignment[Math.floor(cell / 3)] = cell % 3; });
  return round.clues.every((clue) => preferenceMatchesClue(assignment, clue));
}

export function preferenceFeedback(round, state) {
  if (preferenceCheck(round, state)) return "맞았어요. 세 사람의 선택이 겹치지 않고 모든 조건에 맞아요.";
  if (!Array.isArray(state?.cells) || state.cells.length !== 3) return "각 사람에게 하나씩, 서로 다른 것을 골라 보세요.";
  return "같은 것을 두 번 고르지 않았는지, 조건을 하나씩 다시 살펴보세요.";
}

export function preferenceScene(round, state) {
  const cells = Array.isArray(state?.cells) ? state.cells : [];
  const clues = round.clues.map((clue) => `<li>${esc(preferenceClueText(round, clue))}</li>`).join("");
  const headings = round.objects.map((object) => `<th scope="col">${esc(object)}</th>`).join("");
  const rows = round.people.map((person, row) => `<tr><th scope="row">${esc(person)}</th>${round.objects.map((object, col) => {
    const index = row * 3 + col;
    return `<td><button type="button" class="hand-preference-cell" data-hand-action="preference" data-value="${index}" aria-label="${esc(person)}: ${esc(object)}" aria-pressed="${cells.includes(index)}" ${state?.solved ? "disabled" : ""}>${cells.includes(index) ? "✓" : ""}</button></td>`;
  }).join("")}</tr>`).join("");
  return `<div class="hand-preference"><ul class="hand-clues">${clues}</ul><table class="hand-preference-grid"><caption>좋아하는 것 짝짓기</caption><thead><tr><th scope="col">친구</th>${headings}</tr></thead><tbody>${rows}</tbody></table></div>`;
}
