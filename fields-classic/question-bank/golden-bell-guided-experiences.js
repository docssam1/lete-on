function foldVisual(phase) {
  const folded = ["folded", "cut"].includes(phase);
  const cut = ["cut", "unfolded"].includes(phase);
  const unfolded = phase === "unfolded";
  return `<svg class="guided-fold-svg" viewBox="0 0 260 170" role="img" aria-label="색종이를 접고 자른 뒤 펼치는 과정"><rect class="guided-paper" x="40" y="30" width="180" height="110" /><path class="guided-crease" d="M130 30V140" /><g class="guided-fold-half ${folded ? "is-folded" : ""}"><rect x="40" y="30" width="90" height="110" /><path d="M52 85H112M104 77L114 85L104 93" /></g>${cut ? '<path class="guided-cut right" d="M151 70L168 85L151 100" />' : ""}${unfolded ? '<path class="guided-cut left" d="M109 70L92 85L109 100" />' : ""}<text x="130" y="160">${phase === "flat" ? "접기 전" : phase === "folded" ? "반으로 접기" : phase === "cut" ? "접은 채 자르기" : "거울처럼 펼치기"}</text></svg>`;
}

function doubleFoldVisual(phase) {
  const marks = phase === "open-two" ? 4 : phase === "open-one" ? 2 : phase === "second" ? 1 : 0;
  const captions = {
    flat: "접기 전 정사각형에서 두 접은 선을 확인해요.",
    first: "세로선을 따라 한 번 포개요.",
    second: "가로선을 따라 다시 포갠 뒤 한 곳을 잘라요.",
    "open-one": "마지막 가로 접기를 먼저 펼치면 자국이 2개가 돼요.",
    "open-two": "첫 세로 접기까지 펼치면 자국이 4개가 돼요."
  };
  return `<div class="guided-double-fold ${phase}" role="img" aria-label="색종이를 두 번 접고 마지막 접기부터 거꾸로 펼치는 과정"><div class="guided-double-fold-paper"><i class="vertical"></i><i class="horizontal"></i>${Array.from({ length: marks }, (_, index) => `<b class="m${index + 1}">★</b>`).join("")}</div><div class="guided-double-fold-order"><span>접기 1</span><span>접기 2</span><strong>펼치기 2</strong><strong>펼치기 1</strong></div><p>${captions[phase]}</p></div>`;
}

function equalLineVisual(phase, model) {
  const compare = ["compare", "solve"].includes(phase);
  const solved = phase === "solve";
  return `<div class="guided-line-visual ${phase}"><div class="guided-line-cross"><span class="top">${solved ? model.answer : "?"}</span><span class="left">${model.left}</span><span class="center">${model.center}</span><span class="right">${model.right}</span><span class="bottom">${model.bottom}</span></div><p>${phase === "center" ? `가운데 ${model.center}은 두 줄에 함께 있어요.` : compare ? `${model.left} + ${model.right} = ${model.left + model.right}　·　${solved ? `${model.answer} + ${model.bottom} = ${model.left + model.right}` : `? + ${model.bottom} = ${model.left + model.right}`}` : "가로줄과 세로줄을 찾아요."}</p></div>`;
}

function lineCardPlacementVisual(phase, model) {
  const centerVisible = ["center", "pairs", "verify"].includes(phase);
  const pairsVisible = ["pairs", "verify"].includes(phase);
  const valueAt = (index) => {
    if (!centerVisible && index === 2) return "?";
    if (!pairsVisible && index !== 2) return "?";
    return [model.pairs[0][0], model.pairs[1][0], model.center, model.pairs[0][1], model.pairs[1][1]][index];
  };
  return `<div class="guided-line-card-placement ${phase}" role="img" aria-label="교차점에 수를 놓고 남은 카드를 같은 합의 짝으로 묶는 과정"><div class="guided-line-card-deck">${model.cards.map((card) => `<span>${card}</span>`).join("")}</div><div class="guided-line-card-cross">${Array.from({ length: 5 }, (_, index) => `<b class="p${index + 1}">${valueAt(index)}</b>`).join("")}</div><p>${phase === "cards" ? "사용할 카드를 한 번씩 확인해요." : phase === "center" ? `교차점에 ${model.center}을 놓으면 두 줄에 공통으로 들어가요.` : phase === "pairs" ? `${model.pairs[0].join("+")}와 ${model.pairs[1].join("+")}의 합이 같아요.` : `${model.pairs[0][0]}+${model.center}+${model.pairs[0][1]} = ${model.pairs[1][0]}+${model.center}+${model.pairs[1][1]}인지 확인해요.`}</p></div>`;
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

function mirrorDirectionVisual(phase) {
  const sideVisible = ["side", "vertical", "compare"].includes(phase);
  const verticalVisible = ["vertical", "compare"].includes(phase);
  return `<div class="guided-mirror-direction ${phase}" role="img" aria-label="거울 방향에 따라 선이 좌우 또는 위아래로 바뀌는 과정"><svg viewBox="0 0 420 210"><path class="axis vertical" d="M210 16V194"/><path class="axis horizontal" d="M35 105H385"/><g class="source" transform="translate(105 66)"><path d="M0 32V-25M0-15L-30-15"/></g>${sideVisible ? '<g class="side" transform="translate(315 66)"><path d="M0 32V-25M0-15L30-15"/></g>' : ''}${verticalVisible ? '<g class="bottom" transform="translate(105 148)"><path d="M0-32V25M0 15L-30 15"/></g>' : ''}<text x="105" y="22">처음 모양</text><text x="315" y="22">좌우 거울</text><text x="105" y="203">위아래 거울</text></svg><p>${phase === "source" ? "비스듬한 선이 세로선의 위쪽 왼편에 있습니다." : phase === "side" ? "옆 거울에서는 높이는 그대로, 왼쪽과 오른쪽만 바뀝니다." : phase === "vertical" ? "위아래 거울에서는 좌우는 그대로, 높이만 바뀝니다." : "거울선에서 같은 거리인지 세 방향을 다시 비교합니다."}</p></div>`;
}

function digitalTransformVisual(phase, model) {
  const steps = [
    ["source", model.source, "처음 숫자의 켜진 선을 봅니다."],
    ["flip", model.flipped, "좌우로 뒤집으면 2와 5가 서로 바뀝니다."],
    ["half", model.halfTurned, "반 바퀴에서는 위아래와 자리 순서도 함께 바뀝니다."],
    ["equation", `${model.source} + ${model.flipped}`, "바뀐 수를 먼저 적고 계산합니다."]
  ];
  const active = Math.max(0, steps.findIndex(([name]) => name === phase));
  return `<div class="guided-digital-transform ${phase}" role="img" aria-label="디지털 숫자의 선분을 움직여 뒤집고 돌리는 과정"><div>${steps.map(([name, value], index) => `<span class="${index <= active ? "visible" : ""}"><small>${index + 1}</small><b>${value}</b><i>${name === "source" ? "처음" : name === "flip" ? "좌우" : name === "half" ? "반 바퀴" : "계산"}</i></span>`).join("")}</div><p>${steps[active][2]}</p></div>`;
}

function sumGridPlacementVisual(phase) {
  const values = phase === "given" ? [3, "", "", ""] : phase === "row" ? [3, 5, "", ""] : phase === "column" ? [3, 5, 6, ""] : [3, 5, 6, 4];
  return `<div class="guided-sum-grid-placement ${phase}" role="img" aria-label="숫자 카드를 한 번씩 놓아 가로와 세로 합을 맞추는 과정"><div class="cards"><span>4</span><span>5</span><span>6</span></div><div class="board">${values.map((value) => `<b>${value}</b>`).join("")}<i class="r1">8</i><i class="r2">10</i><i class="c1">9</i><i class="c2">9</i></div><p>${phase === "given" ? "3이 놓인 표와 사용할 카드 4, 5, 6을 확인합니다." : phase === "row" ? "윗줄은 8이므로 8-3=5를 놓습니다." : phase === "column" ? "왼쪽 세로줄은 9이므로 9-3=6을 놓습니다." : "남은 4를 놓고 네 줄의 합을 모두 확인합니다."}</p></div>`;
}

function numberConditionFilterVisual(phase, model) {
  const firstDone = ["first", "second", "verify"].includes(phase);
  const secondDone = ["second", "verify"].includes(phase);
  return `<div class="guided-number-filter ${phase}" role="img" aria-label="후보 수에 조건을 하나씩 적용하는 과정"><div>${model.candidates.map((value) => `<span class="${secondDone && !model.answer.includes(value) ? "removed" : firstDone ? "kept" : ""}">${value}</span>`).join("")}</div><ol><li class="${firstDone ? "done" : ""}">각 자리의 합이 4</li><li class="${secondDone ? "done" : ""}">홀수</li></ol><p>${phase === "candidates" ? "먼저 빠짐없이 후보를 적습니다." : phase === "first" ? "13, 22, 31, 40은 첫 조건을 모두 만족합니다." : phase === "second" ? "짝수인 22와 40을 지우면 13과 31이 남습니다." : "13과 31의 자리 합과 홀짝을 다시 확인합니다."}</p></div>`;
}

function relativeOrderVisual(phase, model) {
  const shown = phase === "empty" ? ["?", "?", "?", "?"] : phase === "last" ? ["?", "?", "?", "A"] : phase === "pair" ? ["?", "?", "C", "A"] : model.answer;
  return `<div class="guided-relative-order ${phase}" role="img" aria-label="조건을 읽어 앞뒤 순서를 정하는 과정"><div><b>앞</b>${shown.map((person) => `<span>${person}</span>`).join("")}<b>뒤</b></div><p>${phase === "empty" ? "왼쪽을 앞, 오른쪽을 뒤로 정합니다." : phase === "last" ? "A를 가장 뒤에 고정합니다." : phase === "pair" ? "C를 A의 바로 앞에 붙입니다." : "D를 B와 C 사이에 놓으면 B-D-C-A입니다."}</p></div>`;
}

function equalizeTransferVisual(phase, model) {
  const moved = ["move", "equal"].includes(phase) ? model.transfer : 0;
  const left = model.left - moved;
  const right = model.right + moved;
  const dots = (count, name) => `<span aria-label="${name} ${count}개">${Array.from({ length: count }, () => "<i></i>").join("")}</span>`;
  return `<div class="guided-equalize-transfer ${phase}" role="img" aria-label="많은 쪽에서 적은 쪽으로 옮겨 수를 같게 만드는 과정"><div>${dots(left, "A")}<b>${left}</b></div><strong>${phase === "difference" ? `${model.left}-${model.right}=${model.left-model.right}` : phase === "move" ? `${model.transfer}개 이동` : phase === "equal" ? `${left} = ${right}` : "차이는 몇 개?"}</strong><div>${dots(right, "B")}<b>${right}</b></div><p>${phase === "start" ? "두 양을 나란히 놓고 차이를 봅니다." : phase === "difference" ? "차이를 2로 나누면 옮길 수가 됩니다." : phase === "move" ? "많은 쪽에서 적은 쪽으로 차이의 절반을 옮깁니다." : "두 양이 같은지 마지막으로 확인합니다."}</p></div>`;
}

export function guidedConceptVisual(experience, step) {
  const beat = experience.beats[Math.max(0, Math.min(step, experience.beats.length - 1))];
  if (experience.family === "fold-symmetry") return foldVisual(beat.phase);
  if (experience.family === "double-fold-symmetry") return doubleFoldVisual(beat.phase);
  if (experience.family === "equal-line") return equalLineVisual(beat.phase, experience.model);
  if (experience.family === "line-card-placement") return lineCardPlacementVisual(beat.phase, experience.model);
  if (experience.family === "one-to-one-logic") return logicVisual(beat.phase, experience.model);
  if (experience.family === "shape-substitution") return shapeSubstitutionVisual(beat.phase, experience.model);
  if (experience.family === "balance-order-chain") return balanceOrderVisual(beat.phase, experience.model);
  if (experience.family === "dual-shape-color-cycle") return dualPatternVisual(beat.phase, experience.model);
  if (experience.family === "four-number-promise") return numberPromiseVisual(beat.phase, experience.model);
  if (experience.family === "six-bundle-equation") return sixBundleVisual(beat.phase, experience.model);
  if (experience.family === "multiple-direction") return multipleDirectionVisual(beat.phase, experience.model);
  if (experience.family === "vertical-cryptarithm-carry") return verticalCryptarithmVisual(beat.phase, experience.model);
  if (experience.family === "magic-line-target") return magicLineTargetVisual(beat.phase, experience.model);
  if (experience.family === "mirror-direction") return mirrorDirectionVisual(beat.phase, experience.model);
  if (experience.family === "digital-transform") return digitalTransformVisual(beat.phase, experience.model);
  if (experience.family === "sum-grid-placement") return sumGridPlacementVisual(beat.phase, experience.model);
  if (experience.family === "number-condition-filter") return numberConditionFilterVisual(beat.phase, experience.model);
  if (experience.family === "relative-order") return relativeOrderVisual(beat.phase, experience.model);
  if (experience.family === "equalize-transfer") return equalizeTransferVisual(beat.phase, experience.model);
  return "";
}

export function guidedConceptPrintSummary(experience) {
  return `<div class="gold-print-experience guided-print-summary"><p><strong>개념 순서</strong> ${experience.beats.map((beat) => beat.caption).join(" → ")}</p>${guidedConceptVisual(experience, experience.beats.length - 1)}</div>`;
}
