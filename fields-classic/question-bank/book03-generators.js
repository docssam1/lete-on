// 더클래식 1과정 3권 전용 생성기.
// 원본은 저장하지 않고, 원본에서 확인한 풀이 구조와 문제 번호 분류만 코드로 재현한다.

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const sample = (items) => items[randomInt(0, items.length - 1)];

function shuffle(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = randomInt(0, index);
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

function gcd(a, b) {
  let left = Math.abs(a);
  let right = Math.abs(b);
  while (right) [left, right] = [right, left % right];
  return left || 1;
}

function numberWithUnit(value, unit = "") {
  return `${value}${unit}`;
}

function fractionText(top, bottom) {
  return `${top}/${bottom}`;
}

const TANGRAM_PIECES = Object.freeze([
  { id: 1, kind: "큰 삼각형", area: 4 },
  { id: 2, kind: "큰 삼각형", area: 4 },
  { id: 3, kind: "중간 삼각형", area: 2 },
  { id: 4, kind: "정사각형", area: 2 },
  { id: 5, kind: "평행사변형", area: 2 },
  { id: 6, kind: "작은 삼각형", area: 1 },
  { id: 7, kind: "작은 삼각형", area: 1 }
]);

function tangramShapeComposition({ difficulty = 2 }) {
  const uniqueKinds = [
    { kind: "중간 삼각형", answerId: 1 },
    { kind: "정사각형", answerId: 2 },
    { kind: "평행사변형", answerId: 3 }
  ];
  const target = sample(uniqueKinds);
  const rotations = difficulty === 1 ? [0] : difficulty === 2 ? [0, 90] : [45, 90, 135];
  const rotation = sample(rotations);
  const options = shuffle(uniqueKinds).map((item, index) => ({
    option: index + 1,
    kind: item.kind,
    rotation: sample(rotations),
    correct: item.kind === target.kind
  }));
  const correct = options.find((item) => item.correct);
  return {
    prompt: "칠교판의 빈자리에 꼭 맞는 조각을 보기에서 고르세요. 조각은 돌려서 놓을 수 있습니다.",
    visual: { kind: "book3", subtype: "tangram-fit", targetKind: target.kind, rotation, options },
    answer: `${correct.option}번 ${target.kind}`,
    solution: `빈자리의 변과 꼭짓점을 살펴보면 ${target.kind} 조각과 모양과 크기가 같습니다. 따라서 ${correct.option}번입니다.`,
    meta: { family: "tangram-fit", targetKind: target.kind, correctOption: correct.option, optionKinds: options.map((item) => item.kind) }
  };
}

function tangramPieceArea({ difficulty = 2 }) {
  const count = difficulty === 1 ? 2 : difficulty === 2 ? 3 : 4;
  const selected = shuffle(TANGRAM_PIECES).slice(0, count).map((item) => item.id);
  const answer = TANGRAM_PIECES.filter((item) => selected.includes(item.id)).reduce((sum, item) => sum + item.area, 0);
  return {
    prompt: "모눈 한 칸의 넓이를 1이라고 할 때, 색칠한 칠교 조각을 모두 모아 만든 도형의 넓이를 구하세요.",
    visual: { kind: "book3", subtype: "tangram-area", pieces: TANGRAM_PIECES, selected },
    answer: String(answer),
    solution: `색칠한 조각의 넓이는 ${TANGRAM_PIECES.filter((item) => selected.includes(item.id)).map((item) => item.area).join(" + ")}이므로 모두 ${answer}입니다.`,
    meta: { family: "tangram-area", selected, pieceAreas: Object.fromEntries(TANGRAM_PIECES.map((item) => [item.id, item.area])), answer }
  };
}

function unitGridArea({ difficulty = 2 }) {
  const size = difficulty === 1 ? 4 : difficulty === 2 ? 5 : 6;
  const all = Array.from({ length: size * size }, (_, index) => ({ row: Math.floor(index / size), column: index % size }));
  const fullCount = difficulty === 1 ? randomInt(4, 7) : difficulty === 2 ? randomInt(7, 12) : randomInt(10, 17);
  const fullCells = shuffle(all).slice(0, fullCount);
  const occupied = new Set(fullCells.map((cell) => `${cell.row}:${cell.column}`));
  const halfCount = difficulty === 1 ? 2 : difficulty === 2 ? sample([2, 4]) : sample([4, 6]);
  const halfCells = shuffle(all.filter((cell) => !occupied.has(`${cell.row}:${cell.column}`)))
    .slice(0, halfCount)
    .map((cell, index) => ({ ...cell, diagonal: index % 2 ? "back" : "forward" }));
  const areaTwice = fullCells.length * 2 + halfCells.length;
  const answer = areaTwice / 2;
  return {
    prompt: "작은 정사각형 한 칸의 넓이를 1이라고 할 때, 색칠한 도형의 넓이를 구하세요.",
    visual: { kind: "book3", subtype: "unit-grid-area", size, fullCells, halfCells },
    answer: Number.isInteger(answer) ? String(answer) : `${Math.floor(answer)}와 1/2`,
    solution: `온칸은 ${fullCells.length}개이고 반칸은 ${halfCells.length}개입니다. 반칸 두 개를 온칸 하나로 묶으면 넓이는 ${Number.isInteger(answer) ? answer : `${Math.floor(answer)}와 1/2`}입니다.`,
    meta: { family: "unit-grid-area", size, fullCount: fullCells.length, halfCount: halfCells.length, areaTwice }
  };
}

function growingShapeAreaSum({ difficulty = 2 }) {
  const shape = sample(["triangle", "square"]);
  const count = difficulty === 1 ? randomInt(3, 4) : difficulty === 2 ? randomInt(4, 6) : randomInt(5, 7);
  const start = 1;
  const areas = Array.from({ length: count }, (_, index) => (start + index) * (start + index));
  const answer = areas.reduce((sum, value) => sum + value, 0);
  const shapeLabel = { triangle: "정삼각형", square: "정사각형", pentagon: "정오각형", hexagon: "정육각형" }[shape];
  return {
    prompt: `작은 조각의 넓이가 1일 때, 1번째부터 ${count}번째까지 모든 ${shapeLabel} 넓이의 합을 구하세요.`,
    visual: { kind: "book3", subtype: "shape-area-growth", shape, start, count, areas },
    answer: String(answer),
    solution: `각 모양의 넓이는 ${areas.join(", ")}입니다. 모두 더하면 ${areas.join(" + ")} = ${answer}입니다.`,
    meta: { family: "shape-area-growth", shape, start, count, areas, answer }
  };
}

function nestedSquareOuterArea({ difficulty = 2 }) {
  const count = difficulty === 1 ? 6 : difficulty === 2 ? 7 : randomInt(8, 9);
  const firstSide = 1;
  const step = 1;
  const unitArea = difficulty === 1 ? randomInt(1, 3) : difficulty === 2 ? randomInt(1, 4) : randomInt(2, 6);
  const sides = Array.from({ length: count }, (_, index) => firstSide + step * index);
  const areas = sides.map((side) => side * side * unitArea);
  const askSum = difficulty === 1;
  const answer = askSum ? areas.reduce((sum, value) => sum + value, 0) : areas.at(-1);
  return {
    prompt: askSum
      ? `작은 정사각형 한 칸의 넓이가 ${unitArea}입니다. 정사각형을 같은 규칙으로 ${count}번째까지 겹쳐 그렸을 때, 가장 바깥 정사각형들의 넓이를 1번째부터 모두 더한 값을 구하세요.`
      : `작은 정사각형 한 칸의 넓이가 ${unitArea}입니다. 정사각형을 같은 규칙으로 겹쳐 그렸을 때, ${count}번째 모양에서 가장 바깥 정사각형의 넓이를 구하세요.`,
    visual: { kind: "book3", subtype: "nested-square-area", sides: sides.slice(0, Math.min(5, sides.length)), target: count, askSum, unitArea },
    answer: String(answer),
    solution: `가장 바깥 정사각형의 한 변은 ${sides.join(", ")}로 늘어납니다. 넓이는 ${areas.join(", ")}${askSum ? `이고 이를 모두 더하면 ${answer}` : `이므로 ${count}번째는 ${answer}`}입니다.`,
    meta: { family: "nested-square-area", count, firstSide, step, unitArea, sides, areas, askSum, answer }
  };
}

function fractionShapeFor(difficulty) {
  if (difficulty === 1) return sample([{ shape: "triangle", parts: 3 }, { shape: "square", parts: 4 }, { shape: "hexagon", parts: 6 }]);
  if (difficulty === 2) return sample([{ shape: "square", parts: 8 }, { shape: "hexagon", parts: 6 }, { shape: "hexagon", parts: 12 }]);
  return sample([{ shape: "triangle", parts: 6 }, { shape: "square", parts: 12 }, { shape: "hexagon", parts: 12 }, { shape: "hexagon", parts: 18 }]);
}

function equalPartShadedFraction({ difficulty = 2 }) {
  const { shape, parts } = fractionShapeFor(difficulty);
  const shaded = randomInt(1, parts - 1);
  const rotation = randomInt(0, parts - 1);
  return {
    prompt: "도형을 모양과 크기가 같은 조각으로 나누었습니다. 색칠한 부분을 분수로 나타내세요.",
    visual: { kind: "book3", subtype: "fraction-shape", shape, parts, shaded, rotation, visibleLines: parts },
    answer: fractionText(shaded, parts),
    solution: `전체는 ${parts}조각이고 색칠한 부분은 ${shaded}조각이므로 ${fractionText(shaded, parts)}입니다.`,
    meta: { family: "equal-fraction", shape, parts, shaded, rotation }
  };
}

function equalPartitionDrawing({ difficulty = 2 }) {
  const { shape, parts } = fractionShapeFor(difficulty);
  const shaded = difficulty === 1 ? 1 : randomInt(1, Math.max(1, Math.floor(parts / 2)));
  const visual = { kind: "book3", subtype: "fraction-shape", shape, parts, shaded: 0, rotation: 0, visibleLines: 0, targetParts: parts };
  const answerVisual = { ...visual, shaded, visibleLines: parts };
  return {
    prompt: `도형을 모양과 크기가 같은 ${parts}조각으로 나누고, 그중 ${shaded}조각을 색칠하세요.`,
    visual,
    answerVisual,
    answer: `${parts}조각으로 나누고 ${shaded}조각 색칠`,
    responseKind: "drawing",
    solution: `가운데에서 바깥쪽으로 선을 그어 같은 ${parts}조각을 만들고, 그중 ${shaded}조각을 색칠합니다.`,
    meta: { family: "equal-partition-drawing", shape, parts, shaded }
  };
}

function incompletePartitionFraction({ difficulty = 2 }) {
  const { shape, parts } = fractionShapeFor(Math.max(2, difficulty));
  const shaded = randomInt(1, Math.max(1, Math.floor(parts / 2)));
  const visibleLines = difficulty === 1 ? Math.max(1, parts - 2) : difficulty === 2 ? Math.max(1, Math.floor(parts / 2)) : Math.max(1, Math.floor(parts / 3));
  const rotation = randomInt(0, parts - 1);
  return {
    prompt: "빠진 선을 이어 모양과 크기가 같은 작은 조각으로 완성한 뒤, 색칠한 부분을 분수로 나타내세요.",
    visual: { kind: "book3", subtype: "fraction-shape", shape, parts, shaded, rotation, visibleLines, incomplete: true },
    answerVisual: { kind: "book3", subtype: "fraction-shape", shape, parts, shaded, rotation, visibleLines: parts },
    answer: fractionText(shaded, parts),
    solution: `빠진 선을 모두 이으면 전체가 ${parts}조각이 됩니다. 색칠한 조각은 ${shaded}개이므로 ${fractionText(shaded, parts)}입니다.`,
    meta: { family: "incomplete-fraction", shape, parts, shaded, visibleLines, rotation }
  };
}

function obliqueSquareGridArea({ difficulty = 2 }) {
  const vectorOptions = difficulty === 1 ? [[1, 1], [1, 2], [2, 1]] : difficulty === 2 ? [[1, 2], [2, 1], [2, 2], [1, 3]] : [[2, 3], [3, 2], [1, 4], [3, 3]];
  const count = difficulty === 3 ? 2 : 1;
  const squares = Array.from({ length: count }, (_, index) => {
    const [dx, dy] = sample(vectorOptions);
    return { dx, dy, offsetX: index * 7, offsetY: index % 2 };
  });
  const areas = squares.map(({ dx, dy }) => dx * dx + dy * dy);
  const answer = count === 1 ? String(areas[0]) : `㉠=${areas[0]}, ㉡=${areas[1]}`;
  return {
    prompt: count === 1
      ? "모눈 한 칸의 넓이가 1일 때, 기울어진 정사각형의 넓이를 구하세요."
      : "모눈 한 칸의 넓이가 1일 때, ㉠과 ㉡ 정사각형의 넓이를 각각 구하세요.",
    visual: { kind: "book3", subtype: "oblique-square-area", squares },
    answer,
    responseKind: count === 1 ? "text" : "list",
    solution: `각 정사각형을 둘러싼 큰 사각형에서 바깥 삼각형을 빼면 넓이는 ${areas.join(", ")}입니다.`,
    meta: { family: "oblique-square-area", squares, areas, answer }
  };
}

function foldedStripLength({ difficulty = 2 }) {
  const turns = difficulty === 1 ? 2 : difficulty === 2 ? 3 : 4;
  const points = [{ x: 0, y: 0 }];
  let horizontal = true;
  for (let index = 0; index <= turns; index += 1) {
    const length = randomInt(2, difficulty === 3 ? 6 : 5);
    const direction = index % 4 < 2 ? 1 : -1;
    const previous = points.at(-1);
    points.push(horizontal
      ? { x: previous.x + length * direction, y: previous.y }
      : { x: previous.x, y: previous.y + length });
    horizontal = !horizontal;
  }
  const segments = points.slice(1).map((point, index) => Math.abs(point.x - points[index].x) + Math.abs(point.y - points[index].y));
  const answer = segments.reduce((sum, value) => sum + value, 0);
  return {
    prompt: "모눈 한 칸의 길이가 1cm입니다. 접어 놓은 색테이프를 곧게 펼쳤을 때의 전체 길이를 구하세요.",
    visual: { kind: "book3", subtype: "grid-path", points },
    answer: `${answer}cm`,
    solution: `접힌 각 구간의 길이는 ${segments.join("cm, ")}cm입니다. 모두 더하면 ${answer}cm입니다.`,
    meta: { family: "folded-strip", points, segments, answer }
  };
}

function midpointNumberLine({ difficulty = 2 }) {
  const gap = difficulty === 1 ? randomInt(3, 8) : difficulty === 2 ? randomInt(7, 15) : randomInt(12, 25);
  const middle = randomInt(difficulty === 3 ? 20 : 8, difficulty === 3 ? 70 : 45);
  const left = middle - gap;
  const right = middle + gap;
  return {
    prompt: `수직선에서 ${left}와 ${right}의 중간수를 구하세요.`,
    visual: { kind: "book3", subtype: "number-line", left, right, divisions: difficulty === 1 ? 4 : difficulty === 2 ? 6 : 8, target: "middle" },
    answer: String(middle),
    solution: `${left}와 ${right}를 더하면 ${left + right}이고 이를 똑같이 두 수로 가르면 ${middle}입니다.`,
    meta: { family: "midpoint", left, right, middle }
  };
}

function segmentChainDistance({ difficulty = 2 }) {
  const gaps = Array.from({ length: 3 }, () => randomInt(difficulty === 1 ? 3 : 6, difficulty === 3 ? 24 : 16));
  const [ab, bc, cd] = gaps;
  const givens = { AC: ab + bc, BD: bc + cd, AD: ab + bc + cd };
  const answers = { AB: ab, BC: bc, CD: cd };
  return {
    prompt: "수직선 위 A, B, C, D 사이의 겹친 거리가 그림과 같습니다. AB, BC, CD의 길이를 각각 구하세요.",
    visual: { kind: "book3", subtype: "segment-chain", labels: ["A", "B", "C", "D"], gaps, givens, target: "AB · BC · CD" },
    answer: `AB=${ab}cm, BC=${bc}cm, CD=${cd}cm`,
    responseKind: "list",
    solution: `AC와 BD를 더하면 가운데 BC를 두 번 세므로, BC는 ${givens.AC} + ${givens.BD} - ${givens.AD} = ${bc}cm입니다. 이어서 AB는 ${givens.AC} - ${bc} = ${ab}cm, CD는 ${givens.BD} - ${bc} = ${cd}cm입니다.`,
    meta: { family: "segment-chain", gaps, givens, answers }
  };
}

function equalIntervalLength({ difficulty = 2 }) {
  const divisions = difficulty === 1 ? randomInt(3, 5) : difficulty === 2 ? randomInt(4, 7) : randomInt(6, 9);
  const unit = randomInt(difficulty === 3 ? 4 : 2, difficulty === 3 ? 12 : 8);
  const left = randomInt(1, 25);
  const right = left + divisions * unit;
  return {
    prompt: `두 수 ${left}와 ${right} 사이를 똑같은 간격으로 ${divisions}칸 나누었습니다. 한 칸의 거리를 구하세요.`,
    visual: { kind: "book3", subtype: "number-line", left, right, divisions, target: "interval" },
    answer: String(unit),
    solution: `두 끝 수의 차는 ${right} - ${left} = ${right - left}입니다. 이를 ${divisions}칸으로 똑같이 나누면 한 칸은 ${unit}입니다.`,
    meta: { family: "equal-interval", left, right, divisions, unit }
  };
}

function walkingStepRatio({ difficulty = 2 }) {
  const ratio = difficulty === 1 ? randomInt(2, 3) : difficulty === 2 ? randomInt(3, 5) : randomInt(4, 7);
  const personSteps = randomInt(4, difficulty === 3 ? 12 : 9);
  const dogSteps = personSteps * ratio;
  return {
    prompt: `한 아이의 한 걸음은 강아지 한 걸음의 ${ratio}배입니다. 같은 거리를 아이가 ${personSteps}걸음 걸었다면 강아지는 몇 걸음 걷습니까?`,
    visual: { kind: "book3", subtype: "step-ratio", ratio, personSteps },
    answer: `${dogSteps}걸음`,
    solution: `아이의 한 걸음 동안 강아지는 ${ratio}걸음을 걷습니다. ${personSteps}번 반복하면 ${personSteps} × ${ratio} = ${dogSteps}걸음입니다.`,
    meta: { family: "step-ratio", ratio, personSteps, dogSteps }
  };
}

function routeDistanceMultiple({ difficulty = 2 }) {
  const first = randomInt(4, difficulty === 3 ? 15 : 10);
  const wholeMultiple = difficulty === 1 ? randomInt(3, 4) : difficulty === 2 ? randomInt(4, 6) : randomInt(6, 9);
  const whole = first * wholeMultiple;
  const second = whole - first;
  const answer = wholeMultiple - 1;
  return {
    prompt: `집에서 도서관까지는 같은 걸음으로 ${first}분, 집에서 학교까지는 ${whole}분 걸립니다. 도서관이 집과 학교 사이에 있을 때, 도서관에서 학교까지의 거리는 도서관에서 집까지의 거리의 몇 배입니까?`,
    visual: { kind: "book3", subtype: "route-multiple", first, whole, second, ratio: answer, segments: [first, second] },
    answer: `${answer}배`,
    solution: `도서관에서 학교까지는 ${whole} - ${first} = ${second}분 거리입니다. ${second}는 ${first}의 ${answer}배입니다.`,
    meta: { family: "route-multiple", first, whole, second, answer }
  };
}

function rodRatioTotalBook3({ difficulty = 2 }) {
  const firstUnits = difficulty === 1 ? 2 : randomInt(2, 4);
  const secondUnits = difficulty === 3 ? randomInt(4, 7) : randomInt(firstUnits + 1, firstUnits + 3);
  const unit = randomInt(2, difficulty === 3 ? 8 : 6);
  const first = firstUnits * unit;
  const second = secondUnits * unit;
  const total = first + second;
  return {
    prompt: `막대 ㉠과 ㉡을 이어 놓은 전체 길이가 ${total}cm입니다. 그림의 같은 칸 길이가 모두 같을 때 두 막대의 길이를 각각 구하세요.`,
    visual: { kind: "book3", subtype: "rods", rows: [{ label: "㉠", units: firstUnits }, { label: "㉡", units: secondUnits }], total, maxUnits: secondUnits },
    answer: `㉠=${first}cm, ㉡=${second}cm`,
    solution: `전체는 같은 길이 ${firstUnits + secondUnits}칸입니다. 한 칸은 ${total}을 ${firstUnits + secondUnits}칸으로 똑같이 나눈 ${unit}cm이므로 ㉠은 ${first}cm, ㉡은 ${second}cm입니다.`,
    meta: { family: "rod-total", firstUnits, secondUnits, unit, first, second, total }
  };
}

function unitObjectLength({ difficulty = 2 }) {
  const counts = difficulty === 1 ? [4, 5] : difficulty === 2 ? sample([[4, 5], [5, 6], [3, 7]]) : sample([[6, 8], [7, 9], [5, 8]]);
  const common = difficulty === 3 ? randomInt(3, 7) : randomInt(2, 5);
  const total = counts[0] * counts[1] * common;
  const lengths = [total / counts[0], total / counts[1]];
  return {
    prompt: `길이가 ${total}cm인 끈을 성냥개비 ${counts[0]}개와 지우개 ${counts[1]}개로 각각 재었습니다. 성냥개비 1개와 지우개 1개의 길이를 각각 구하세요.`,
    visual: { kind: "book3", subtype: "object-measure", total, rows: [{ icon: "성냥", count: counts[0] }, { icon: "지우개", count: counts[1] }] },
    answer: `성냥개비=${lengths[0]}cm, 지우개=${lengths[1]}cm`,
    solution: `${total}cm를 각각 ${counts[0]}개와 ${counts[1]}개로 똑같이 나누면 ${lengths[0]}cm와 ${lengths[1]}cm입니다.`,
    meta: { family: "unit-object", counts, total, lengths }
  };
}

function equivalentObjectLength({ difficulty = 2 }) {
  const match = randomInt(2, difficulty === 3 ? 7 : 5);
  const pencil = randomInt(match + 2, difficulty === 3 ? 16 : 12);
  const log = 2 * pencil - 2 * match;
  const givenTarget = difficulty === 1 ? "log" : sample(["log", "pencil"]);
  const givenValue = givenTarget === "log" ? log : pencil;
  const askTarget = givenTarget === "log" ? "pencil" : "log";
  const answer = askTarget === "log" ? log : pencil;
  return {
    prompt: `통나무 1개와 성냥개비 5개를 늘어놓은 길이는 성냥개비 3개와 연필 2자루를 늘어놓은 길이와 같습니다. 성냥개비 1개의 길이는 ${match}cm이고 ${givenTarget === "log" ? "통나무" : "연필"} 1개의 길이가 ${givenValue}cm일 때, ${askTarget === "log" ? "통나무" : "연필"} 1개의 길이를 구하세요.`,
    visual: { kind: "book3", subtype: "object-equation", left: [{ icon: "통나무", count: 1 }, { icon: "성냥", count: 5 }], right: [{ icon: "성냥", count: 3 }, { icon: "연필", count: 2 }], givenTarget, givenValue, match },
    answer: `${answer}cm`,
    solution: `양쪽에서 성냥개비 3개를 지우면 통나무 1개와 성냥개비 2개의 길이가 연필 2자루와 같습니다. 성냥개비 1개는 ${match}cm이므로 관계를 거꾸로 계산하면 답은 ${answer}cm입니다.`,
    meta: { family: "equivalent-object", match, pencil, log, givenTarget, givenValue, askTarget, answer }
  };
}

function objectCombinationEquivalentCount({ difficulty = 2 }) {
  const pencilInMatches = difficulty === 1 ? randomInt(2, 3) : difficulty === 2 ? randomInt(3, 5) : randomInt(5, 7);
  const pencils = difficulty === 1 ? 1 : randomInt(1, difficulty === 3 ? 3 : 2);
  const matches = randomInt(1, difficulty === 3 ? 7 : 5);
  const answer = pencils * pencilInMatches + matches;
  return {
    prompt: `리코더 1개의 길이는 연필 ${pencils}자루와 성냥개비 ${matches}개를 이은 길이와 같습니다. 연필 1자루의 길이가 성냥개비 ${pencilInMatches}개를 이은 길이와 같을 때, 리코더 1개는 성냥개비 몇 개를 이은 길이와 같습니까?`,
    visual: { kind: "book3", subtype: "object-count-equivalence", pencils, matches, pencilInMatches },
    answer: `${answer}개`,
    solution: `연필 ${pencils}자루는 성냥개비 ${pencils} × ${pencilInMatches} = ${pencils * pencilInMatches}개와 같습니다. 여기에 성냥개비 ${matches}개를 더하면 ${answer}개입니다.`,
    meta: { family: "object-count-equivalence", pencils, matches, pencilInMatches, answer }
  };
}

function proportionalRodsCommonTotal({ difficulty = 2 }) {
  const firstCount = difficulty === 1 ? 2 : randomInt(2, 4);
  const secondCount = difficulty === 3 ? randomInt(firstCount + 2, firstCount + 5) : randomInt(firstCount + 1, firstCount + 3);
  const base = randomInt(2, difficulty === 3 ? 7 : 5);
  const total = firstCount * secondCount * base;
  const firstLength = total / firstCount;
  const secondLength = total / secondCount;
  const givenFirst = Math.random() < 0.5;
  const given = givenFirst ? firstLength : secondLength;
  const answer = givenFirst ? secondLength : firstLength;
  return {
    prompt: `막대 ㉠ ${firstCount}개를 이은 길이와 막대 ㉡ ${secondCount}개를 이은 길이가 같습니다. 막대 ${givenFirst ? "㉠" : "㉡"} 1개의 길이가 ${given}cm일 때, 막대 ${givenFirst ? "㉡" : "㉠"} 1개의 길이를 구하세요.`,
    visual: { kind: "book3", subtype: "rods", rows: [{ label: "㉠", units: firstCount }, { label: "㉡", units: secondCount }], given: { label: givenFirst ? "㉠" : "㉡", value: given } },
    answer: `${answer}cm`,
    solution: `같은 전체 길이는 ${total}cm입니다. 이를 ${givenFirst ? secondCount : firstCount}개로 똑같이 나누면 한 막대의 길이는 ${answer}cm입니다.`,
    meta: { family: "proportional-rods", firstCount, secondCount, total, firstLength, secondLength, givenFirst, given, answer }
  };
}

function meetingDistanceRatio({ difficulty = 2 }) {
  const ratio = difficulty === 1 ? 2 : difficulty === 2 ? randomInt(2, 4) : randomInt(4, 6);
  const unit = randomInt(difficulty === 3 ? 6 : 4, difficulty === 3 ? 15 : 10);
  const slower = unit;
  const faster = unit * ratio;
  const total = slower + faster;
  return {
    prompt: `두 집은 ${total}m 떨어져 있습니다. 두 사람이 서로 마주 보고 걸어 만났습니다. 빠른 사람의 속도가 느린 사람의 ${ratio}배라면 두 사람은 각각 몇 m를 걸었습니까?`,
    visual: { kind: "book3", subtype: "meeting-distance", total, ratio, faster, slower },
    answer: `빠른 사람=${faster}m, 느린 사람=${slower}m`,
    solution: `간 거리는 속도와 같이 ${ratio}:1로 나뉩니다. 전체를 ${ratio + 1}묶음으로 나누면 한 묶음은 ${unit}m이므로 ${faster}m와 ${slower}m입니다.`,
    meta: { family: "meeting-distance", ratio, unit, faster, slower, total }
  };
}

function mixedIntervalDistance({ difficulty = 2 }) {
  const leftDivisions = difficulty === 1 ? 3 : randomInt(3, 5);
  const rightDivisions = difficulty === 3 ? randomInt(5, 7) : randomInt(3, 5);
  const leftUnit = randomInt(3, difficulty === 3 ? 10 : 7);
  const rightUnit = randomInt(3, difficulty === 3 ? 10 : 7);
  const leftStart = randomInt(2, 15);
  const join = leftStart + leftDivisions * leftUnit;
  const rightEnd = join + rightDivisions * rightUnit;
  const leftIndex = randomInt(1, leftDivisions - 1);
  const rightIndex = randomInt(1, rightDivisions - 1);
  const targetLeft = leftStart + leftIndex * leftUnit;
  const targetRight = join + rightIndex * rightUnit;
  const answer = targetRight - targetLeft;
  return {
    prompt: "왼쪽 구간과 오른쪽 구간을 서로 다른 크기의 똑같은 간격으로 나누었습니다. 그림의 ㉠과 ㉡ 사이의 거리를 구하세요.",
    visual: { kind: "book3", subtype: "mixed-interval", leftStart, join, rightEnd, leftDivisions, rightDivisions, leftIndex, rightIndex },
    answer: String(answer),
    solution: `왼쪽 한 칸은 ${leftUnit}, 오른쪽 한 칸은 ${rightUnit}입니다. ㉠은 ${targetLeft}, ㉡은 ${targetRight}이므로 거리는 ${targetRight} - ${targetLeft} = ${answer}입니다.`,
    meta: { family: "mixed-interval", leftStart, join, rightEnd, leftDivisions, rightDivisions, leftUnit, rightUnit, leftIndex, rightIndex, targetLeft, targetRight, answer }
  };
}

function differenceUnitMeasure({ difficulty = 2 }) {
  const pair = difficulty === 1 ? [2, 3] : difficulty === 2 ? sample([[2, 3], [3, 4]]) : sample([[3, 4], [4, 5], [5, 6]]);
  const [firstCount, secondCount] = pair;
  const scale = randomInt(2, difficulty === 3 ? 7 : 5);
  const firstLength = secondCount * scale;
  const secondLength = firstCount * scale;
  const difference = firstLength - secondLength;
  const total = firstCount * firstLength;
  const answer = total / difference;
  return {
    prompt: `연필의 길이는 막대 ㉠으로 재면 ${firstCount}번이고, 막대 ㉡으로 재면 ${secondCount}번입니다. 막대 ㉢의 길이는 ㉠에서 ㉡을 잘라낸 길이와 같습니다. 연필을 ㉢으로 재면 몇 번입니까?`,
    visual: { kind: "book3", subtype: "difference-unit", firstCount, secondCount, firstLength, secondLength, difference, total },
    answer: `${answer}번`,
    solution: `같은 전체 길이를 맞추면 ㉠은 ${secondCount}칸, ㉡은 ${firstCount}칸으로 볼 수 있습니다. 두 막대의 차는 1칸이고 연필 전체는 ${firstCount * secondCount}칸이므로 ${answer}번입니다.`,
    meta: { family: "difference-unit", firstCount, secondCount, scale, firstLength, secondLength, difference, total, answer }
  };
}

const digitRow = (value) => String(value).split("");

function cryptarithmSingleDouble({ difficulty = 2 }) {
  const digit = difficulty === 1 ? randomInt(2, 4) : difficulty === 2 ? randomInt(4, 7) : randomInt(6, 9);
  const sum = digit * 2;
  return {
    prompt: "같은 도형은 같은 수를 나타냅니다. 동그라미가 나타내는 수를 구하세요.",
    visual: { kind: "cryptarithm-vertical", first: ["○"], second: ["○"], sum: digitRow(sum) },
    answer: String(digit),
    solution: `${sum}을 똑같이 두 수로 가르면 ${digit}과 ${digit}이므로 동그라미는 ${digit}입니다.`,
    meta: { family: "cryptarithm-single-double", digit, sum, answer: digit }
  };
}

function cryptarithmRepeatedNumberDouble({ difficulty = 2 }) {
  const digit = difficulty === 1 ? randomInt(1, 3) : difficulty === 2 ? randomInt(2, 4) : randomInt(5, 9);
  const number = digit * 11;
  const sum = number * 2;
  return {
    prompt: "같은 도형은 같은 수를 나타냅니다. 네모가 나타내는 수를 구하세요.",
    visual: { kind: "cryptarithm-vertical", first: ["□", "□"], second: ["□", "□"], sum: digitRow(sum) },
    answer: String(digit),
    solution: `${number} + ${number} = ${sum}이므로 네모 한 칸에는 ${digit}이 들어갑니다.`,
    meta: { family: "cryptarithm-repeated-double", digit, number, sum, answer: digit }
  };
}

function cryptarithmFixedDigitAddition({ difficulty = 2 }) {
  let digit;
  let first;
  let second;
  let firstRow;
  let secondRow;
  if (difficulty === 1) {
    do {
      digit = randomInt(2, 8);
      second = randomInt(1, 7);
    } while (digit + second >= 10);
    first = digit;
    firstRow = ["△"];
    secondRow = digitRow(second);
  } else if (difficulty === 2) {
    const tens = randomInt(2, 7);
    second = randomInt(3, 9);
    digit = randomInt(10 - second, 9);
    first = tens * 10 + digit;
    firstRow = [String(tens), "△"];
    secondRow = digitRow(second);
  } else {
    const ones = randomInt(1, 8);
    const addend = randomInt(24, 69);
    digit = randomInt(2, 8);
    first = digit * 10 + ones;
    second = addend;
    firstRow = ["△", String(ones)];
    secondRow = digitRow(second);
  }
  const sum = first + second;
  return {
    prompt: "같은 도형은 같은 수를 나타냅니다. 세모가 나타내는 수를 구하세요.",
    visual: { kind: "cryptarithm-vertical", first: firstRow, second: secondRow, sum: digitRow(sum) },
    answer: String(digit),
    solution: `자리별로 거꾸로 계산하면 세모가 있는 자리는 ${digit}입니다. 실제로 ${first} + ${second} = ${sum}입니다.`,
    meta: { family: "cryptarithm-fixed-digit", digit, first, second, sum, answer: digit }
  };
}

function cryptarithmMissingDigitColumn({ difficulty = 2 }) {
  const [firstSymbol, secondSymbol] = sample([
    ["□", "○"],
    ["○", "◇"],
    ["◇", "□"]
  ]);
  let firstValue;
  let secondValue;
  let addends;
  let sum;
  let sumRow;

  if (difficulty === 3) {
    // 원본 연습 8~11번처럼 같은 두 자리 수를 세 번 더한다.
    // 17+17+17=51, 24+24+24=72, 31+31+31=93만 이 꼴에서 유일해다.
    const candidate = sample([
      { firstValue: 1, secondValue: 7, sum: 51 },
      { firstValue: 2, secondValue: 4, sum: 72 },
      { firstValue: 3, secondValue: 1, sum: 93 }
    ]);
    ({ firstValue, secondValue, sum } = candidate);
    addends = Array.from({ length: 3 }, () => [firstSymbol, secondSymbol]);
    sumRow = [String(Math.floor(sum / 10)), firstSymbol];
  } else {
    // 원본 확인 1~2번처럼 두 도형이 여러 자리에 반복되는 두 자리 덧셈이다.
    // 일의 자리의 보이는 숫자가 첫 도형을, 십의 자리가 둘째 도형을 하나로 정한다.
    firstValue = randomInt(2, 7);
    const onesFixed = difficulty === 1
      ? randomInt(1, 9 - firstValue)
      : randomInt(10 - firstValue, 9);
    const carry = firstValue + onesFixed >= 10 ? 1 : 0;
    const tensFixed = randomInt(1, 8 - firstValue);
    secondValue = tensFixed + firstValue + carry;
    const onesResult = (firstValue + onesFixed) % 10;
    addends = [
      [String(tensFixed), firstSymbol],
      [firstSymbol, String(onesFixed)]
    ];
    sum = secondValue * 10 + onesResult;
    sumRow = [secondSymbol, String(onesResult)];
  }

  const askFirst = Math.random() < 0.5;
  const askSymbol = askFirst ? firstSymbol : secondSymbol;
  const answer = askFirst ? firstValue : secondValue;
  const firstNumber = Number(addends[0].map((token) => token === firstSymbol ? firstValue : token === secondSymbol ? secondValue : token).join(""));
  const addendNumbers = addends.map((row) => Number(row.map((token) => token === firstSymbol ? firstValue : token === secondSymbol ? secondValue : token).join("")));
  return {
    prompt: `같은 도형은 같은 수를, 다른 도형은 다른 수를 나타냅니다. ${askSymbol}가 나타내는 수를 구하세요.`,
    visual: { kind: "cryptarithm-vertical", addends, sum: sumRow },
    answer: String(answer),
    solution: difficulty === 3
      ? `${firstNumber}을 세 번 더하면 ${sum}입니다. 따라서 ${firstSymbol}는 ${firstValue}, ${secondSymbol}는 ${secondValue}이고 ${askSymbol}는 ${answer}입니다.`
      : `일의 자리부터 계산하면 ${firstSymbol}는 ${firstValue}입니다. 십의 자리까지 계산하면 ${secondSymbol}는 ${secondValue}이므로 ${askSymbol}는 ${answer}입니다.`,
    meta: {
      family: "cryptarithm-two-symbol-column",
      symbols: [firstSymbol, secondSymbol],
      values: [firstValue, secondValue],
      addends,
      addendNumbers,
      sum,
      sumRow,
      askSymbol,
      answer
    }
  };
}

function cryptarithmLinkedEquations({ difficulty = 2 }) {
  const base = randomInt(1, difficulty === 3 ? 7 : 6);
  const symbols = ["○", "△", "□", "◇"];
  const values = [base, base * 2, base * 3, base * 5];
  const rows = [
    { left: [symbols[0], symbols[0]], result: symbols[1] }
  ];
  let known;
  let askSymbols;
  if (difficulty === 1) {
    known = values[1] + values[0];
    rows.push({ left: [symbols[1], symbols[0]], result: known });
    askSymbols = symbols.slice(0, 2);
  } else if (difficulty === 2) {
    rows.push({ left: [symbols[1], symbols[0]], result: symbols[2] });
    known = values[2] + values[1];
    rows.push({ left: [symbols[2], symbols[1]], result: known });
    askSymbols = symbols.slice(0, 3);
  } else {
    rows.push({ left: [symbols[1], symbols[0]], result: symbols[2] });
    rows.push({ left: [symbols[2], symbols[1]], result: symbols[3] });
    known = values[3] + values[2];
    rows.push({ left: [symbols[3], symbols[2]], result: known });
    askSymbols = symbols;
  }
  const answerValues = values.slice(0, askSymbols.length);
  return {
    prompt: "같은 도형은 같은 수를 나타냅니다. 이어진 식을 보고 각 도형이 나타내는 수를 구하세요.",
    visual: { kind: "book3", subtype: "equation-chain", rows },
    answer: askSymbols.map((symbol, index) => `${symbol}=${answerValues[index]}`).join(", "),
    solution: `마지막 식의 수를 앞의 관계에 맞게 거꾸로 나눕니다. ${askSymbols.map((symbol, index) => `${symbol}=${answerValues[index]}`).join(", ")}입니다.`,
    meta: { family: "cryptarithm-linked", base, symbols: askSymbols, values: answerValues, known }
  };
}

function binaryWeightSelection({ difficulty = 2 }) {
  const weights = [1, 2, 4, 8];
  const wantedCount = difficulty === 1 ? randomInt(1, 2) : difficulty === 2 ? randomInt(2, 3) : randomInt(3, 4);
  const selected = shuffle(weights).slice(0, wantedCount).sort((a, b) => a - b);
  const target = selected.reduce((sum, value) => sum + value, 0);
  return {
    prompt: `1g, 2g, 4g, 8g 무게추를 한 번씩만 사용할 수 있습니다. ${target}g을 만들려면 어떤 무게추를 골라야 합니까?`,
    visual: { kind: "book3", subtype: "binary-weight", weights, target },
    answer: selected.map((value) => `${value}g`).join(" + "),
    solution: `${target}에서 가장 큰 무게추부터 차례로 빼면 ${selected.slice().reverse().join(", ")}을 고르게 됩니다. 합은 ${selected.join(" + ")} = ${target}입니다.`,
    meta: { family: "binary-weight", weights, selected, target }
  };
}

function coloredCellNumberCode({ difficulty = 2 }) {
  const weights = [1, 2, 4, 8];
  const minCount = difficulty === 1 ? 1 : 2;
  const maxCount = difficulty === 3 ? 4 : 3;
  const colored = shuffle([0, 1, 2, 3]).slice(0, randomInt(minCount, maxCount)).sort((a, b) => a - b);
  const answer = colored.reduce((sum, index) => sum + weights[index], 0);
  return {
    prompt: "각 칸의 수는 1, 2, 4, 8입니다. 색칠한 칸의 수를 모두 더해 나타낸 수를 구하세요.",
    visual: { kind: "book3", subtype: "cell-code", weights, colored, showWeights: difficulty !== 3 },
    answer: String(answer),
    solution: `색칠한 칸은 ${colored.map((index) => weights[index]).join(", ")}입니다. 모두 더하면 ${colored.map((index) => weights[index]).join(" + ")} = ${answer}입니다.`,
    meta: { family: "cell-code", weights, colored, answer }
  };
}

function symbolValueCode({ difficulty = 2 }) {
  const symbols = ["○", "△", "□"];
  const values = shuffle(Array.from({ length: difficulty === 3 ? 12 : 9 }, (_, index) => index + 1)).slice(0, 3);
  const [circle, triangle, square] = values;
  const rows = [
    { symbols: [symbols[0], symbols[0]], total: circle * 2 },
    { symbols: [symbols[0], symbols[1]], total: circle + triangle },
    { symbols: [symbols[1], symbols[2]], total: triangle + square }
  ];
  const targetSymbols = difficulty === 1 ? [symbols[2]] : difficulty === 2 ? [symbols[0], symbols[2]] : symbols;
  const valueBySymbol = Object.fromEntries(symbols.map((symbol, index) => [symbol, values[index]]));
  const answer = targetSymbols.reduce((sum, symbol) => sum + valueBySymbol[symbol], 0);
  return {
    prompt: `같은 도형은 같은 수를 나타냅니다. ${targetSymbols.join(" + ")}의 값을 구하세요.`,
    visual: { kind: "book3", subtype: "symbol-code", rows, targetSymbols },
    answer: String(answer),
    solution: `첫째 줄에서 ○=${circle}, 둘째 줄에서 △=${triangle}, 셋째 줄에서 □=${square}입니다. 따라서 ${targetSymbols.map((symbol) => valueBySymbol[symbol]).join(" + ")} = ${answer}입니다.`,
    meta: { family: "symbol-code", symbols, values, rows, targetSymbols, answer }
  };
}

function rotateMatrix(matrix) {
  return matrix[0].map((_, column) => matrix.map((row) => row[column]).reverse());
}

function matrixVariants(matrix) {
  const variants = [];
  let current = matrix.map((row) => [...row]);
  for (let turn = 0; turn < 4; turn += 1) {
    variants.push(current);
    variants.push(current.map((row) => [...row].reverse()));
    current = rotateMatrix(current);
  }
  return [...new Map(variants.map((variant) => [JSON.stringify(variant), variant])).values()];
}

function magicThreeVariants(start, step) {
  const base = [[8, 1, 6], [3, 5, 7], [4, 9, 2]];
  return matrixVariants(base).map((matrix) => matrix.map((row) => row.map((value) => start + (value - 1) * step)));
}

function pickMagicThreeClues(variants, solution, difficulty, targetIndex = null) {
  const indices = shuffle(Array.from({ length: 9 }, (_, index) => index).filter((index) => index !== targetIndex));
  const minimum = targetIndex == null
    ? difficulty === 1 ? 4 : difficulty === 2 ? 3 : 2
    : difficulty === 1 ? 4 : difficulty === 2 ? 3 : 2;
  const clues = indices.slice(0, minimum);
  const flatSolution = solution.flat();
  const matching = () => variants.filter((candidate) => clues.every((index) => candidate.flat()[index] === flatSolution[index]));
  while (clues.length < indices.length) {
    const candidates = matching();
    if (targetIndex == null ? candidates.length === 1 : new Set(candidates.map((candidate) => candidate.flat()[targetIndex])).size === 1) break;
    clues.push(indices[clues.length]);
  }
  return clues;
}

function magicSquareThreeComplete({ difficulty = 2 }) {
  const start = randomInt(1, difficulty === 3 ? 8 : 5);
  const step = difficulty === 1 ? 1 : randomInt(1, difficulty === 3 ? 4 : 3);
  const variants = magicThreeVariants(start, step);
  const solution = sample(variants);
  const clues = pickMagicThreeClues(variants, solution, difficulty);
  const shown = solution.flat().map((value, index) => clues.includes(index) ? value : null);
  const cards = Array.from({ length: 9 }, (_, index) => start + index * step);
  const lineSum = solution[0].reduce((sum, value) => sum + value, 0);
  return {
    prompt: "주어진 아홉 수를 한 번씩 사용하여 가로, 세로, 대각선의 합이 모두 같도록 마방진을 완성하세요.",
    visual: { kind: "book3", subtype: "magic-grid", size: 3, cards, shown, lineSum },
    answerVisual: { kind: "book3", subtype: "magic-grid", size: 3, cards: [], shown: solution.flat(), lineSum },
    answer: solution.map((row) => row.join(" ")).join(" / "),
    responseKind: "drawing",
    solution: `가운데에는 아홉 수의 가운데 수가 들어가고 한 줄의 합은 ${lineSum}입니다. 합을 맞추면 ${solution.map((row) => row.join(", ")).join(" / ")}입니다.`,
    meta: { family: "magic-three-complete", start, step, solution, clues, lineSum }
  };
}

function magicSquareThreeTarget({ difficulty = 2 }) {
  const start = randomInt(1, difficulty === 3 ? 9 : 5);
  const step = difficulty === 1 ? 1 : randomInt(1, difficulty === 3 ? 4 : 3);
  const variants = magicThreeVariants(start, step);
  const solution = sample(variants);
  const targetIndex = randomInt(0, 8);
  const clues = pickMagicThreeClues(variants, solution, difficulty, targetIndex);
  const answer = solution.flat()[targetIndex];
  const shown = solution.flat().map((value, index) => index === targetIndex ? "㉠" : clues.includes(index) ? value : null);
  const lineSum = solution[0].reduce((sum, value) => sum + value, 0);
  return {
    prompt: "가로, 세로, 대각선에 놓인 세 수의 합이 모두 같습니다. ㉠에 알맞은 수를 구하세요.",
    visual: { kind: "book3", subtype: "magic-grid", size: 3, cards: [], shown, lineSum: difficulty === 1 ? lineSum : null },
    answer: String(answer),
    solution: `한 줄의 합은 가운데 수의 3배인 ${lineSum}입니다. ㉠이 있는 줄의 다른 수를 빼면 ${answer}입니다.`,
    meta: { family: "magic-three-target", start, step, solution, clues, targetIndex, lineSum, answer }
  };
}

const MAGIC_FOUR_BASE = Object.freeze([[16, 2, 3, 13], [5, 11, 10, 8], [9, 7, 6, 12], [4, 14, 15, 1]]);

function magicFourSolution() {
  return sample(matrixVariants(MAGIC_FOUR_BASE));
}

function magicSquareFourTarget({ difficulty = 2 }) {
  const solution = magicFourSolution();
  const targetRow = randomInt(0, 3);
  const targetColumn = randomInt(0, 3);
  const targetIndex = targetRow * 4 + targetColumn;
  const hidden = new Set([targetIndex]);
  if (difficulty >= 2) {
    for (let row = 0; row < 4; row += 1) {
      if (row === targetRow) continue;
      if (difficulty === 2 && hidden.size >= 3) break;
      hidden.add(row * 4 + randomInt(0, 3));
    }
  }
  const shown = solution.flat().map((value, index) => index === targetIndex ? "㉠" : hidden.has(index) ? null : value);
  const answer = solution[targetRow][targetColumn];
  return {
    prompt: "1부터 16까지의 수를 한 번씩 쓴 4×4 마방진입니다. 가로, 세로, 대각선의 합이 모두 같을 때 ㉠을 구하세요.",
    visual: { kind: "book3", subtype: "magic-grid", size: 4, cards: [], shown, lineSum: 34 },
    answer: String(answer),
    solution: `1부터 16까지를 쓴 4×4 마방진의 한 줄 합은 34입니다. ㉠이 있는 가로줄에서 보이는 세 수를 34에서 빼면 ${answer}입니다.`,
    meta: { family: "magic-four-target", solution, targetRow, targetColumn, targetIndex, hidden: [...hidden], answer, lineSum: 34 }
  };
}

function magicSquareFourComplete({ difficulty = 2 }) {
  const solution = magicFourSolution();
  const blankCount = difficulty === 1 ? 1 : difficulty === 2 ? 2 : 4;
  const rows = shuffle([0, 1, 2, 3]).slice(0, blankCount);
  const targetLabels = ["㉠", "㉡", "㉢", "㉣"];
  const targets = rows.map((row, index) => ({ index: row * 4 + randomInt(0, 3), label: targetLabels[index] }));
  const targetByIndex = Object.fromEntries(targets.map((target) => [target.index, target.label]));
  const shown = solution.flat().map((value, index) => targetByIndex[index] || value);
  const answers = targets.map((target) => ({ ...target, value: solution.flat()[target.index] }));
  return {
    prompt: "1부터 16까지의 수를 한 번씩 써서 모든 가로, 세로, 대각선의 합이 34가 되도록 빈칸을 채우세요.",
    visual: { kind: "book3", subtype: "magic-grid", size: 4, cards: [], shown, lineSum: 34 },
    answerVisual: { kind: "book3", subtype: "magic-grid", size: 4, cards: [], shown: solution.flat(), lineSum: 34 },
    answer: answers.map((item) => `${item.label}=${item.value}`).join(", "),
    solution: `각 빈칸이 있는 가로줄에서 보이는 세 수를 34에서 빼면 ${answers.map((item) => `${item.label}=${item.value}`).join(", ")}입니다.`,
    meta: { family: "magic-four-complete", solution, targets: answers, lineSum: 34 }
  };
}

const PENTAGON_RING_BASES = Object.freeze([
  [1, 5, 10, 2, 4, 9, 3, 6, 7, 8],
  [1, 6, 10, 3, 4, 5, 8, 2, 7, 9],
  [1, 8, 7, 6, 3, 4, 9, 2, 5, 10],
  [1, 9, 4, 8, 2, 7, 5, 6, 3, 10],
  [1, 10, 3, 6, 5, 7, 2, 8, 4, 9]
]);
const PENTAGON_RING_LINES = Object.freeze([[0, 1, 2], [2, 3, 4], [4, 5, 6], [6, 7, 8], [8, 9, 0]]);

function ringLineSums(values) {
  return PENTAGON_RING_LINES.map((line) => line.reduce((sum, index) => sum + values[index], 0));
}

function transformRing(values) {
  const turn = randomInt(0, 4) * 2;
  const rotated = values.map((_, index) => values[(index + turn) % values.length]);
  if (Math.random() < 0.5) return rotated;
  return rotated.map((_, index) => rotated[(rotated.length - index) % rotated.length]);
}

function eachPermutation(values, visit, limit = Infinity) {
  const used = Array(values.length).fill(false);
  const current = [];
  let count = 0;
  const walk = () => {
    if (count >= limit) return;
    if (current.length === values.length) {
      count += 1;
      visit([...current]);
      return;
    }
    for (let index = 0; index < values.length && count < limit; index += 1) {
      if (used[index]) continue;
      used[index] = true;
      current.push(values[index]);
      walk();
      current.pop();
      used[index] = false;
    }
  };
  walk();
  return count;
}

function ringSolutionCount(shown, lineSum, stopAt = 2) {
  const positions = shown.map((value, index) => value == null ? index : -1).filter((index) => index >= 0);
  const used = new Set(shown.filter((value) => value != null));
  const remaining = Array.from({ length: 10 }, (_, index) => index + 1).filter((value) => !used.has(value));
  let matches = 0;
  eachPermutation(remaining, (candidate) => {
    if (matches >= stopAt) return;
    const values = [...shown];
    positions.forEach((position, index) => { values[position] = candidate[index]; });
    if (ringLineSums(values).every((sum) => sum === lineSum)) matches += 1;
  });
  return matches;
}

function polygonRingEqualSum({ difficulty = 2 }) {
  const solution = transformRing(sample(PENTAGON_RING_BASES));
  const lineSum = ringLineSums(solution)[0];
  const order = shuffle(Array.from({ length: 10 }, (_, index) => index));
  const initialCount = difficulty === 1 ? 7 : difficulty === 2 ? 6 : 5;
  const clues = order.slice(0, initialCount);
  let shown = solution.map((value, index) => clues.includes(index) ? value : null);
  while (ringSolutionCount(shown, lineSum) !== 1 && clues.length < 9) {
    clues.push(order[clues.length]);
    shown = solution.map((value, index) => clues.includes(index) ? value : null);
  }
  return {
    prompt: "1부터 10까지의 수를 한 번씩 사용하여 오각형 둘레의 다섯 줄에 놓인 세 수의 합이 모두 같도록 빈 원을 채우세요.",
    visual: { kind: "book3", subtype: "polygon-ring", cards: [1,2,3,4,5,6,7,8,9,10], shown, lineSum },
    answerVisual: { kind: "book3", subtype: "polygon-ring", cards: [], shown: solution, lineSum },
    answer: solution.join(", "),
    responseKind: "drawing",
    solution: `각 줄의 합은 ${lineSum}입니다. 이미 놓인 두 수의 합을 ${lineSum}에서 빼며 이어 가면 ${solution.join(", ")} 순서로 놓입니다.`,
    meta: { family: "polygon-ring", solution, lineSum, clues, uniqueCount: ringSolutionCount(shown, lineSum) }
  };
}

const TRIANGLE_LAYOUT_CACHE = new Map();

function triangleLines(size) {
  return size === 6
    ? [[0, 1, 2], [2, 3, 4], [4, 5, 0]]
    : [[0, 1, 2, 3], [3, 4, 5, 6], [6, 7, 8, 0]];
}

function triangleLayouts(size) {
  if (TRIANGLE_LAYOUT_CACHE.has(size)) return TRIANGLE_LAYOUT_CACHE.get(size);
  const values = Array.from({ length: size }, (_, index) => index + 1);
  const lines = triangleLines(size);
  const layouts = [];
  eachPermutation(values, (candidate) => {
    const sums = lines.map((line) => line.reduce((sum, index) => sum + candidate[index], 0));
    if (sums.every((sum) => sum === sums[0])) layouts.push({ values: candidate, lineSum: sums[0] });
  });
  TRIANGLE_LAYOUT_CACHE.set(size, layouts);
  return layouts;
}

function triangleEqualSumProblem(size, difficulty) {
  const layouts = triangleLayouts(size);
  const solution = sample(layouts);
  const order = shuffle(Array.from({ length: size }, (_, index) => index));
  const initialCount = size === 6
    ? difficulty === 1 ? 3 : difficulty === 2 ? 2 : 1
    : difficulty === 1 ? 5 : difficulty === 2 ? 4 : 3;
  const clues = order.slice(0, initialCount);
  const candidates = () => layouts.filter((layout) => layout.lineSum === solution.lineSum
    && clues.every((index) => layout.values[index] === solution.values[index]));
  while (candidates().length !== 1 && clues.length < size - 1) clues.push(order[clues.length]);
  const shown = solution.values.map((value, index) => clues.includes(index) ? value : null);
  return {
    prompt: `1부터 ${size}까지의 수를 한 번씩 사용하여 삼각형 세 변에 놓인 수의 합이 모두 ${solution.lineSum}이 되도록 빈 원을 채우세요.`,
    visual: { kind: "book3", subtype: "triangle-equal-sum", size, cards: Array.from({ length: size }, (_, index) => index + 1), shown, lineSum: solution.lineSum },
    answerVisual: { kind: "book3", subtype: "triangle-equal-sum", size, cards: [], shown: solution.values, lineSum: solution.lineSum },
    answer: solution.values.join(", "),
    responseKind: "drawing",
    solution: `한 변의 합 ${solution.lineSum}에서 이미 놓인 수를 빼며 꼭짓점과 변의 가운데 수를 정하면 ${solution.values.join(", ")} 순서로 놓입니다.`,
    meta: { family: `triangle-edge-${size}`, size, solution: solution.values, lineSum: solution.lineSum, clues, uniqueCount: candidates().length }
  };
}

function triangleEdgeSumSix({ difficulty = 2 }) {
  return triangleEqualSumProblem(6, difficulty);
}

function triangleEdgeSumNine({ difficulty = 2 }) {
  return triangleEqualSumProblem(9, difficulty);
}

export const BOOK03_GENERATORS = {
  tangramShapeComposition,
  tangramPieceArea,
  unitGridArea,
  growingShapeAreaSum,
  nestedSquareOuterArea,
  equalPartShadedFraction,
  equalPartitionDrawing,
  incompletePartitionFraction,
  obliqueSquareGridArea,
  foldedStripLength,
  midpointNumberLine,
  segmentChainDistance,
  equalIntervalLength,
  walkingStepRatio,
  routeDistanceMultiple,
  rodRatioTotalBook3,
  unitObjectLength,
  equivalentObjectLength,
  objectCombinationEquivalentCount,
  proportionalRodsCommonTotal,
  meetingDistanceRatio,
  mixedIntervalDistance,
  differenceUnitMeasure,
  cryptarithmSingleDouble,
  cryptarithmRepeatedNumberDouble,
  cryptarithmFixedDigitAddition,
  cryptarithmMissingDigitColumn,
  cryptarithmLinkedEquations,
  binaryWeightSelection,
  coloredCellNumberCode,
  symbolValueCode,
  magicSquareThreeComplete,
  magicSquareThreeTarget,
  magicSquareFourTarget,
  polygonRingEqualSum,
  triangleEdgeSumSix,
  triangleEdgeSumNine,
  magicSquareFourComplete
};
