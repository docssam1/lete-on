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

function shapeSubstitutionVisual(phase, model) {
  const pairKnown = ["pair", "substitute", "verify"].includes(phase);
  const targetKnown = ["substitute", "verify"].includes(phase);
  const token = (shape, value = "") => `<span class="guided-shape-token ${shape}">${shape === "diamond" ? "◇" : "○"}${value ? `<b>${value}</b>` : ""}</span>`;
  return `<div class="guided-substitution-visual ${phase}" role="img" aria-label="같은 모양의 값을 찾아 다른 식에 넣는 과정"><div class="guided-equation ${phase === "pair" ? "active" : ""}">${token(model.pairShape, pairKnown ? model.pairValue : "")}<i>+</i>${token(model.pairShape, pairKnown ? model.pairValue : "")}<i>=</i><strong>${model.pairTotal}</strong></div><div class="guided-equation ${phase === "substitute" || phase === "verify" ? "active" : ""}">${token(model.targetShape, targetKnown ? model.targetValue : "?")}<i>+</i>${token(model.pairShape, pairKnown ? model.pairValue : "")}<i>=</i><strong>${model.mixedTotal}</strong></div><p>${phase === "equations" ? "같은 모양은 언제나 같은 수예요." : phase === "pair" ? `${model.pairTotal}을 똑같이 나누면 ${model.pairValue}씩이에요.` : phase === "substitute" ? `${model.mixedTotal}에서 ${model.pairValue}를 빼면 ${model.targetValue}이에요.` : `${model.targetValue} + ${model.pairValue} = ${model.mixedTotal}, 두 식이 모두 맞아요.`}</p></div>`;
}

function balanceUnit([left, right, heavySide], active) {
  return `<figure class="guided-balance-unit ${heavySide}-heavy ${active ? "active" : ""}"><div class="guided-balance-load left">${left}</div><div class="guided-balance-load right">${right}</div><div class="guided-balance-line"></div><div class="guided-balance-stand"></div><figcaption>${left} ${heavySide === "left" ? ">" : "<"} ${right}</figcaption></figure>`;
}

function balanceOrderVisual(phase, model) {
  const showSecond = phase !== "first";
  const showChain = ["chain", "verify"].includes(phase);
  return `<div class="guided-balance-visual"><div class="guided-balance-pair">${balanceUnit(model.first, true)}${balanceUnit(model.second, showSecond)}</div>${showChain ? `<div class="guided-order-chain">${model.order.map((item, index) => `<span>${item}</span>${index < model.order.length - 1 ? "<b>&gt;</b>" : ""}`).join("")}</div>` : ""}<p>${phase === "first" ? "아래로 내려간 곰이 더 무거워요." : phase === "second" ? "둘째 저울도 아래로 내려간 토끼부터 읽어요." : phase === "chain" ? "토끼를 가운데에 놓으면 두 관계가 이어져요." : "완성한 순서를 두 저울에 다시 대어 확인해요."}</p></div>`;
}

function patternSymbol(shape, filled) {
  const symbols = { circle: filled ? "●" : "○", triangle: filled ? "▲" : "△", square: filled ? "■" : "□" };
  return symbols[shape] || "?";
}

function dualPatternVisual(phase, model) {
  const items = Array.from({ length: model.count }, (_, index) => ({
    shape: model.shapes[index % model.shapes.length],
    filled: model.fills[index % model.fills.length]
  }));
  const symbols = items.map(({ shape, filled }, index) => {
    const text = phase === "shape" ? patternSymbol(shape, false) : phase === "fill" ? (filled ? "●" : "○") : patternSymbol(shape, filled);
    return `<span><b>${text}</b><i>${index + 1}</i></span>`;
  }).join("");
  return `<div class="guided-pattern-visual ${phase}" role="img" aria-label="모양 주기와 색 주기를 따로 찾아 합치는 과정"><div class="guided-pattern-row">${symbols}</div><div class="guided-cycle-key"><span class="shape-key">모양 주기 ${model.shapes.length}</span><span class="fill-key">색 주기 ${model.fills.length}</span></div><p>${phase === "combined" ? "두 규칙이 한 줄에 함께 보여요." : phase === "shape" ? "색을 가리고 모양만 세 칸씩 읽어요." : phase === "fill" ? "모양을 가리고 빈 칸과 색칠한 칸만 읽어요." : "두 차례를 같은 번호에서 다시 합쳐요."}</p></div>`;
}

function promiseDiagramMarkup(diagram, showRule) {
  return `<figure class="guided-promise-diagram"><div><strong class="top">${diagram.top}</strong><span class="left">${diagram.left}</span><span class="right">${diagram.right}</span><span class="bottom">${diagram.bottom}</span></div>${showRule ? `<figcaption>${diagram.left} + ${diagram.bottom} + ${diagram.right} = ${diagram.top}</figcaption>` : ""}</figure>`;
}

function numberPromiseVisual(phase, model) {
  const showRule = ["rule", "confirm", "reverse"].includes(phase);
  const showSecond = ["confirm", "reverse"].includes(phase);
  return `<div class="guided-promise-visual"><div>${promiseDiagramMarkup(model.examples[0], showRule)}${showSecond ? promiseDiagramMarkup(model.examples[1], true) : ""}</div>${phase === "reverse" ? '<p class="guided-reverse-rule">위 - 왼쪽 - 아래 = 오른쪽</p>' : ""}<p>${phase === "observe" ? "네 자리의 수를 차례로 살펴봐요." : phase === "rule" ? "옆과 아래의 세 수를 더하면 위 수가 돼요." : phase === "confirm" ? "다른 그림에서도 같은 약속이 맞아요." : "빈자리가 바뀌면 덧셈을 거꾸로 계산해요."}</p></div>`;
}

export function guidedConceptVisual(experience, step) {
  const beat = experience.beats[Math.max(0, Math.min(step, experience.beats.length - 1))];
  if (experience.family === "fold-symmetry") return foldVisual(beat.phase);
  if (experience.family === "equal-line") return equalLineVisual(beat.phase, experience.model);
  if (experience.family === "one-to-one-logic") return logicVisual(beat.phase, experience.model);
  if (experience.family === "shape-substitution") return shapeSubstitutionVisual(beat.phase, experience.model);
  if (experience.family === "balance-order-chain") return balanceOrderVisual(beat.phase, experience.model);
  if (experience.family === "dual-shape-color-cycle") return dualPatternVisual(beat.phase, experience.model);
  if (experience.family === "four-number-promise") return numberPromiseVisual(beat.phase, experience.model);
  return "";
}

export function guidedConceptPrintSummary(experience) {
  return `<div class="gold-print-experience guided-print-summary"><p><strong>개념 순서</strong> ${experience.beats.map((beat) => beat.caption).join(" → ")}</p>${guidedConceptVisual(experience, experience.beats.length - 1)}</div>`;
}
