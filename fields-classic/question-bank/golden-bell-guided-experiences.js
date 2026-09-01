function foldVisual(phase) {
  const folded = ["folded", "cut"].includes(phase);
  const cut = ["cut", "unfolded"].includes(phase);
  const unfolded = phase === "unfolded";
  return `<svg class="guided-fold-svg" viewBox="0 0 260 170" role="img" aria-label="색종이를 접고 자른 뒤 펼치는 과정"><rect class="guided-paper" x="40" y="30" width="180" height="110" /><path class="guided-crease" d="M130 30V140" /><g class="guided-fold-half ${folded ? "is-folded" : ""}"><rect x="40" y="30" width="90" height="110" /><path d="M52 85H112M104 77L114 85L104 93" /></g>${cut ? '<path class="guided-cut right" d="M151 70L168 85L151 100" />' : ""}${unfolded ? '<path class="guided-cut left" d="M109 70L92 85L109 100" />' : ""}<text x="130" y="160">${phase === "flat" ? "접기 전" : phase === "folded" ? "반으로 접기" : phase === "cut" ? "접은 채 자르기" : "거울처럼 펼치기"}</text></svg>`;
}

function equalLineVisual(phase, model) {
  const compare = ["compare", "solve"].includes(phase);
  const solved = phase === "solve";
  return `<div class="guided-line-visual ${phase}"><div class="guided-line-cross"><span class="top">${solved ? model.answer : "?"}</span><span class="left">${model.left}</span><span class="center">${model.center}</span><span class="right">${model.right}</span><span class="bottom">${model.bottom}</span></div><p>${phase === "center" ? `가운데 ${model.center}은 두 줄에 함께 있어요.` : compare ? `${model.left} + ${model.right} = ${model.left + model.right}　·　${solved ? `${model.answer} + ${model.bottom} = ${model.left + model.right}` : `? + ${model.bottom} = ${model.left + model.right}`}` : "가로줄과 세로줄을 찾아요."}</p></div>`;
}

function logicVisual(phase, model) {
  const states = {
    start: [["possible", "possible", "possible"], ["possible", "possible", "possible"], ["possible", "possible", "possible"]],
    fixed: [["yes", "no", "no"], ["no", "possible", "possible"], ["no", "possible", "possible"]],
    eliminate: [["yes", "no", "no"], ["no", "yes", "no"], ["no", "no", "yes"]],
    solved: [["yes", "no", "no"], ["no", "yes", "no"], ["no", "no", "yes"]]
  };
  const cells = states[phase] || states.start;
  return `<div class="guided-logic-visual"><div class="logic-grid"><span></span>${model.choices.map((choice) => `<b>${choice}</b>`).join("")}${model.people.map((person, row) => `<strong>${person}</strong>${cells[row].map((status) => `<i class="${status}">${status === "yes" ? "✓" : status === "no" ? "×" : "○"}</i>`).join("")}`).join("")}</div><p>${phase === "start" ? "처음에는 가능한 것을 모두 열어 둬요." : phase === "fixed" ? `${model.people[0]}의 답을 먼저 확정해요.` : phase === "eliminate" ? "이미 사용한 답과 조건에 맞지 않는 답을 지워요." : "한 사람에게 하나씩만 남았어요."}</p></div>`;
}

export function guidedConceptVisual(experience, step) {
  const beat = experience.beats[Math.max(0, Math.min(step, experience.beats.length - 1))];
  if (experience.family === "fold-symmetry") return foldVisual(beat.phase);
  if (experience.family === "equal-line") return equalLineVisual(beat.phase, experience.model);
  if (experience.family === "one-to-one-logic") return logicVisual(beat.phase, experience.model);
  return "";
}

export function guidedConceptPrintSummary(experience) {
  return `<div class="gold-print-experience guided-print-summary"><p><strong>개념 순서</strong> ${experience.beats.map((beat) => beat.caption).join(" → ")}</p>${guidedConceptVisual(experience, experience.beats.length - 1)}</div>`;
}
