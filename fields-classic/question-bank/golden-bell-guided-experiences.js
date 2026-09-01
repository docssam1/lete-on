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

function sixBundleVisual(phase, model) {
  const groups = phase === "groups" ? model.startGroups : phase === "extra" ? model.startGroups + model.extraGroups : model.totalGroups;
  const groupMarkup = Array.from({ length: Math.max(0, groups) }, (_, index) => `<span class="guided-six-bundle" aria-label="6개 묶음 ${index + 1}">${Array.from({ length: 6 }, () => '<i aria-hidden="true"></i>').join("")}</span>`).join("");
  const equation = phase === "groups"
    ? `${model.base} × ${model.startGroups} = ${model.base * model.startGroups}`
    : phase === "extra"
      ? `${model.base * model.extraGroups} = ${model.base} × ${model.extraGroups}`
      : phase === "combine"
        ? `${model.base} × ${model.startGroups} + ${model.base} × ${model.extraGroups} = ${model.base} × ${model.totalGroups}`
        : `${model.base * model.startGroups} + ${model.base * model.extraGroups} = ${model.base * model.totalGroups}`;
  return `<div class="guided-six-bundle-visual ${phase}" role="img" aria-label="6개씩 묶어 등가식으로 나타내는 과정"><div class="guided-six-bundle-groups">${groupMarkup}</div><div class="guided-six-bundle-equation">${equation}</div><p>${phase === "groups" ? "6개씩 묶인 덩어리를 세어 보세요." : phase === "extra" ? "더해진 12도 6개짜리 묶음으로 바꾸어 보세요." : phase === "combine" ? `${model.startGroups}묶음과 ${model.extraGroups}묶음을 합치면 ${model.totalGroups}묶음이에요.` : `${model.totalGroups}묶음 × 6 = ${model.totalGroups * 6}개인지 확인합니다.`}</p></div>`;
}

function multipleDirectionVisual(phase, model) {
  const solved = phase === "divide" || phase === "verify";
  return `<div class="guided-multiple-visual ${phase}" role="img" aria-label="기준량과 비교량의 방향을 확인하고 비교량을 기준량으로 나누는 과정"><div class="guided-multiple-bars"><span class="guided-multiple-unit">${model.unitLabel || "기준량"}<b>${model.unit}</b></span><span class="guided-multiple-comparison">${model.comparisonLabel || "비교량"}<b>${model.comparison}</b></span></div><div class="guided-multiple-equation">${solved ? `${model.comparison} ÷ ${model.unit} = ${model.ratio}` : `${model.comparison} ÷ ${model.unit} = ?`}</div><p>${phase === "unit" ? "먼저 기준이 되는 양을 정합니다." : phase === "repeat" ? `${model.comparison} 안에 기준량 ${model.unit}이 몇 번 들어가는지 세어요.` : phase === "divide" ? "비교량을 기준량으로 나누어 몇 배인지 구합니다." : `${model.ratio}배가 맞는지 기준량을 반복해 확인합니다.`}</p></div>`;
}

function verticalCryptarithmVisual(phase, model) {
  const showOnes = ["ones", "carry", "verify"].includes(phase);
  const showCarry = ["carry", "verify"].includes(phase);
  const cell = (value, label) => `<span class="guided-cryptarithm-cell" aria-label="${label}">${value}</span>`;
  const spacer = '<span class="guided-cryptarithm-spacer" aria-hidden="true"></span>';
  const addend = phase === "verify" ? model.symbolValue : model.symbol;
  const rows = Array.from({ length: model.repeat }, (_, index) => `<div class="guided-cryptarithm-addend"><b>${index === model.repeat - 1 ? "+" : ""}</b>${spacer}${cell(addend, `더하는 수 ${index + 1}`)}</div>`).join("");
  return `<div class="guided-cryptarithm-visual ${phase}" role="img" aria-label="도형을 숫자로 바꾸는 세로셈과 받아올림 과정"><div class="guided-cryptarithm-stack"><div class="guided-cryptarithm-carry"><small>${showCarry ? "받아올림" : ""}</small>${cell(showCarry ? model.carryValue : "", "받아올림")}${spacer}</div>${rows}<div class="guided-cryptarithm-rule"></div><div class="guided-cryptarithm-result">${spacer}${cell(phase === "verify" ? model.carryValue : model.resultTens, "십의 자리")}${cell(showOnes ? model.resultOnes : "?", "일의 자리")}</div></div><p>${phase === "layout" ? "같은 도형 세 개를 세로셈 자리에 맞추어 놓아요." : phase === "ones" ? `${model.symbol}을 세 번 더한 일의 자리는 ${model.resultOnes}예요.` : phase === "carry" ? `${model.symbolValue} + ${model.symbolValue} + ${model.symbolValue} = 12이므로 ${model.carryValue}을 십의 자리로 받아올려요.` : `${model.symbolValue} + ${model.symbolValue} + ${model.symbolValue} = ${model.carryValue}${model.resultOnes}, 받아올림 ${model.carryValue}까지 확인합니다.`}</p></div>`;
}

function magicLineTargetVisual(phase, model) {
  const grid = Array.from({ length: 9 }, (_, index) => index === model.targetIndex && ["solve", "verify"].includes(phase) ? model.target : index === model.targetIndex ? "?" : (model.grid[index] ?? "·"));
  const line = model.grid.slice(0, 3).join(" + ");
  return `<div class="guided-magic-visual ${phase}" role="img" aria-label="3x3 마방진의 완성 줄을 찾아 빈칸을 역산하는 과정"><div class="guided-magic-grid">${grid.map((value, index) => `<span class="${index < 3 ? "is-target-line" : ""}">${value}</span>`).join("")}</div><div class="guided-magic-equation">${phase === "complete" ? "완성된 줄을 찾아요" : `${line} = ${model.lineSum}`}${["solve", "verify"].includes(phase) ? ` → 빈칸 = ${model.target}` : " → ?"}</div><p class="guided-magic-rule">3×3 마방진은 9칸이고, 가로·세로·대각선 한 줄의 합은 ${model.lineSum}예요.</p><p>${phase === "complete" ? "가로, 세로, 대각선을 살펴 한 줄을 정합니다." : phase === "target" ? `이 줄의 합은 ${model.lineSum}이므로 빈칸을 찾아요.` : phase === "solve" ? `${model.lineSum}에서 알고 있는 수를 빼서 빈칸 ${model.target}을 역산합니다.` : `빈칸 ${model.target}을 넣어 다른 줄의 합도 확인합니다.`}</p></div>`;
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
  if (experience.family === "six-bundle-equation") return sixBundleVisual(beat.phase, experience.model);
  if (experience.family === "multiple-direction") return multipleDirectionVisual(beat.phase, experience.model);
  if (experience.family === "vertical-cryptarithm-carry") return verticalCryptarithmVisual(beat.phase, experience.model);
  if (experience.family === "magic-line-target") return magicLineTargetVisual(beat.phase, experience.model);
  return "";
}

export function guidedConceptPrintSummary(experience) {
  return `<div class="gold-print-experience guided-print-summary"><p><strong>개념 순서</strong> ${experience.beats.map((beat) => beat.caption).join(" → ")}</p>${guidedConceptVisual(experience, experience.beats.length - 1)}</div>`;
}
