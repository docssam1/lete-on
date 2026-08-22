// 더클래식 1과정 8권 전용 생성기.
// 교재의 인쇄 문제 번호별 풀이 구조를 유지하고, 모든 값은 정답에서 역산해 만든다.

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const sample = (items) => items[randomInt(0, items.length - 1)];
const sum = (items) => items.reduce((total, value) => total + value, 0);
const numberHasBatchim = (value) => [0, 1, 3, 6, 7, 8].includes(Math.abs(value) % 10);
const numberObject = (value) => `${value}${numberHasBatchim(value) ? "을" : "를"}`;
const numberSubject = (value) => `${value}${numberHasBatchim(value) ? "이" : "가"}`;
const numberTopic = (value) => `${value}${numberHasBatchim(value) ? "은" : "는"}`;
const numberAnd = (value) => `${value}${numberHasBatchim(value) ? "과" : "와"}`;

function shuffle(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = randomInt(0, index);
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

function fractionText(numerator, denominator) {
  return `${numerator}/${denominator}`;
}

function book8Problem({ prompt, subtype, visual = {}, answer, solution, family, meta = {} }) {
  return {
    prompt,
    visual: { kind: "book8", subtype, ...visual },
    answer: String(answer),
    solution,
    meta: { family, answer, ...meta }
  };
}

const symbol = (index) => ["○", "△", "□", "☆"][index];

function balanceDifferenceDeductionBook8({ difficulty = 2 }) {
  const result = randomInt(2, difficulty === 3 ? 18 : 12);
  const common = randomInt(4, difficulty === 3 ? 24 : 16);
  const leftKnown = randomInt(2, difficulty === 3 ? 18 : 11);
  const rightKnown = leftKnown + result;
  if ([common, leftKnown, rightKnown].includes(result)) return balanceDifferenceDeductionBook8({ difficulty });
  return book8Problem({
    prompt: "두 저울이 모두 수평일 때 별 한 개가 나타내는 수를 구하세요.",
    subtype: "balance",
    visual: { equations: [[common, "+", "☆", "=", common + result], [leftKnown, "+", "☆", "=", rightKnown]] },
    answer: result,
    solution: `두 번째 저울의 양쪽에서 ${numberObject(leftKnown)} 빼면 별 한 개는 ${rightKnown}-${leftKnown}=${result}입니다.`,
    family: "balance-difference-b8",
    meta: { common, leftKnown, rightKnown, result }
  });
}

function overlapCircleSumBook8({ difficulty = 2 }) {
  const left = Array.from({ length: difficulty === 1 ? 2 : 3 }, () => randomInt(2, difficulty === 3 ? 16 : 11));
  const overlap = randomInt(2, difficulty === 3 ? 18 : 12);
  const visibleRight = difficulty === 3 ? [randomInt(2, 9)] : [];
  const result = sum(left) - sum(visibleRight);
  if (result < 2 || [overlap, ...left, ...visibleRight].includes(result)) return overlapCircleSumBook8({ difficulty });
  return book8Problem({
    prompt: "겹친 두 원 안에 있는 수의 합이 같을 때 색칠한 부분의 수를 구하세요.",
    subtype: "overlap-circles",
    visual: { left, overlap, right: [...visibleRight, "?"], shadedSide: "right" },
    answer: result,
    solution: visibleRight.length
      ? `겹친 부분의 수 ${numberTopic(overlap)} 양쪽에 함께 들어가므로, 왼쪽에만 있는 수의 합 ${sum(left)}에서 오른쪽의 보이는 수 ${numberObject(sum(visibleRight))} 빼면 ${result}입니다.`
      : `겹친 부분의 수 ${numberTopic(overlap)} 양쪽에 함께 들어가므로, 왼쪽에만 있는 수의 합 ${numberSubject(sum(left))} 색칠한 부분의 수입니다. 따라서 답은 ${result}입니다.`,
    family: "overlap-circle-b8",
    meta: { left, overlap, visibleRight, result }
  });
}

function symbolAdditiveChainBook8({ difficulty = 2 }) {
  const values = shuffle(Array.from({ length: difficulty === 3 ? 15 : 10 }, (_, index) => index + 1)).slice(0, 3);
  const equations = [
    `${symbol(0)} + ${symbol(0)} = ${values[0] * 2}`,
    `${symbol(0)} + ${symbol(1)} = ${values[0] + values[1]}`,
    `${symbol(1)} + ${symbol(2)} = ${values[1] + values[2]}`
  ];
  const result = sum(values);
  return book8Problem({
    prompt: "같은 도형은 같은 수를 나타낼 때 세 도형이 나타내는 수의 합을 구하세요.",
    subtype: "symbol-equations", visual: { equations, target: "○ + △ + □" },
    answer: result,
    solution: `○=${values[0]}, △=${values[1]}, □=${values[2]}이므로 합은 ${result}입니다.`,
    family: "symbol-additive-chain-b8", meta: { values, result }
  });
}

function additionMatrixTargetBook8({ difficulty = 2 }) {
  const size = difficulty === 3 ? 3 : 2;
  const rows = Array.from({ length: size }, () => randomInt(2, difficulty === 3 ? 16 : 11));
  const columns = Array.from({ length: size }, () => randomInt(2, difficulty === 3 ? 16 : 11));
  const targetRow = randomInt(0, size - 1);
  const targetColumn = randomInt(0, size - 1);
  const cells = rows.map((row) => columns.map((column) => row + column));
  const result = cells[targetRow][targetColumn];
  if (new Set(cells.flat()).size !== cells.flat().length || [...rows, ...columns].includes(result)) return additionMatrixTargetBook8({ difficulty });
  const shown = cells.map((line, rowIndex) => line.map((value, columnIndex) => rowIndex === targetRow && columnIndex === targetColumn ? "?" : value));
  return book8Problem({
    prompt: "가로 수와 세로 수를 더해 만든 표에서 색칠한 칸의 수를 구하세요.",
    subtype: "matrix", visual: { operation: "+", rows, columns, cells: shown, targetRow, targetColumn },
    answer: result,
    solution: `색칠한 칸은 ${rows[targetRow]}+${columns[targetColumn]}=${result}입니다.`,
    family: "addition-matrix-target-b8", meta: { rows, columns, targetRow, targetColumn, result }
  });
}

function additionMatrixCompleteBook8({ difficulty = 2 }) {
  const rows = [randomInt(2, 9), randomInt(10, difficulty === 3 ? 19 : 15)];
  const columns = [randomInt(2, 9), randomInt(10, difficulty === 3 ? 19 : 15)];
  const cells = rows.map((row) => columns.map((column) => row + column));
  const targetRow = randomInt(0, 1);
  const targetColumn = randomInt(0, 1);
  const result = cells[targetRow][targetColumn];
  if (new Set(cells.flat()).size !== cells.flat().length || [...rows, ...columns].includes(result)) return additionMatrixCompleteBook8({ difficulty });
  return book8Problem({
    prompt: "도형이 나타내는 수를 찾아 덧셈 표의 빈칸에 알맞은 수를 구하세요.",
    subtype: "matrix",
    visual: {
      operation: "+", rowLabels: ["○", "△"], columnLabels: ["□", "☆"],
      rows, columns, cells: cells.map((line, r) => line.map((value, c) => r === targetRow && c === targetColumn ? "?" : value)),
      targetRow, targetColumn
    },
    answer: result,
    solution: `표의 가로값 ${numberAnd(rows[targetRow])} 세로값 ${numberObject(columns[targetColumn])} 더하면 ${result}입니다.`,
    family: "addition-matrix-complete-b8", meta: { rows, columns, targetRow, targetColumn, result }
  });
}

function symbolOperationDeductionBook8({ difficulty = 2 }) {
  const first = randomInt(2, difficulty === 3 ? 9 : 7);
  const second = randomInt(2, difficulty === 3 ? 9 : 7);
  if (first === second || second === first * first) return symbolOperationDeductionBook8({ difficulty });
  const pairTotal = first + second;
  const result = second;
  return book8Problem({
    prompt: "같은 도형은 같은 수를 나타낼 때 세모가 나타내는 수를 구하세요.",
    subtype: "symbol-equations",
    visual: { equations: [`○ × ${first} = ${first * first}`, `△ + ○ = ${pairTotal}`], target: "△" },
    answer: result,
    solution: `첫 식에서 ○=${first}입니다. 둘째 식에서 ${pairTotal}-${first}=${second}이므로 △=${result}입니다.`,
    family: "symbol-operation-b8", meta: { first, second, pairTotal, result }
  });
}

function symbolCrossEquationBook8({ difficulty = 2 }) {
  const values = shuffle(Array.from({ length: difficulty === 3 ? 15 : 10 }, (_, index) => index + 1)).slice(0, 3);
  const rows = [
    ["○", "+", "△", "=", values[0] + values[1]],
    ["△", "+", "□", "=", values[1] + values[2]],
    ["○", "+", "□", "=", values[0] + values[2]]
  ];
  const result = values[1];
  if ([values[0] + values[1], values[1] + values[2], values[0] + values[2]].includes(result)) return symbolCrossEquationBook8({ difficulty });
  return book8Problem({
    prompt: "가로와 세로의 식을 함께 보고 세모가 나타내는 수를 구하세요.",
    subtype: "operation-grid", visual: { rows, target: "△" }, answer: result,
    solution: `세 식을 이용하면 △=(${values[0] + values[1]}+${values[1] + values[2]}-${values[0] + values[2]})÷2=${result}입니다.`,
    family: "symbol-cross-b8", meta: { values, pairSums: [values[0] + values[1], values[1] + values[2], values[0] + values[2]], result }
  });
}

function conditionalSymbolChainBook8({ difficulty = 2 }) {
  const values = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3);
  const result = values[1];
  if (values[0] + values[2] === result) return conditionalSymbolChainBook8({ difficulty });
  const conditions = [
    `○ + △ = ${values[0] + values[1]}`,
    `△ + □ = ${values[1] + values[2]}`,
    `○ + □ = ${values[0] + values[2]}`,
    "세 도형은 서로 다른 한 자리 수입니다."
  ];
  return book8Problem({
    prompt: "조건을 모두 만족할 때 세모가 나타내는 수를 구하세요.",
    subtype: "conditions", visual: { conditions, target: "△" }, answer: result,
    solution: `첫째 합과 둘째 합을 더한 뒤 셋째 합을 빼면 △를 두 번 센 값입니다. 따라서 △=${result}입니다.`,
    family: "conditional-symbol-chain-b8", meta: { values, conditions, result }
  });
}

function conditionalTwoDigitSymbolBook8({ difficulty = 2 }) {
  const tens = randomInt(2, 8);
  const gap = sample([-2, -1, 1, 2]);
  const ones = tens + gap;
  if (ones < 0 || ones > 9) return conditionalTwoDigitSymbolBook8({ difficulty });
  const result = tens * 10 + ones;
  return book8Problem({
    prompt: "도형 조건에 맞는 두 자리 수를 구하세요.",
    subtype: "conditions",
    visual: { conditions: [`십의 자리 ○와 일의 자리 △의 합은 ${tens + ones}입니다.`, `△는 ○보다 ${Math.abs(gap)} ${gap > 0 ? "큽니다" : "작습니다"}.`], target: "○△" },
    answer: result,
    solution: `합이 ${tens + ones}이고 차가 ${Math.abs(gap)}인 두 수는 ${numberAnd(tens)} ${ones}입니다. 따라서 두 자리 수는 ${result}입니다.`,
    family: "conditional-two-digit-b8", meta: { tens, ones, gap, result }
  });
}

function cyclicPairSumsBook8({ difficulty = 2 }) {
  const values = shuffle(Array.from({ length: difficulty === 3 ? 18 : 12 }, (_, index) => index + 1)).slice(0, 3);
  const pairSums = [values[0] + values[1], values[1] + values[2], values[2] + values[0]];
  const result = sum(values);
  return book8Problem({
    prompt: "두 도형씩 더한 세 식을 보고 세 도형이 나타내는 수의 합을 구하세요.",
    subtype: "symbol-equations",
    visual: { equations: [`○ + △ = ${pairSums[0]}`, `△ + □ = ${pairSums[1]}`, `□ + ○ = ${pairSums[2]}`], target: "○ + △ + □" },
    answer: result,
    solution: `세 식의 합 ${numberTopic(sum(pairSums))} 세 도형의 합을 두 번 센 값입니다. ${sum(pairSums)}÷2=${result}입니다.`,
    family: "cyclic-pair-sums-b8", meta: { values, pairSums, result }
  });
}

function pyramidCryptarithmBook8({ difficulty = 2 }) {
  const digit = randomInt(2, difficulty === 3 ? 8 : 7);
  const addend = randomInt(11, difficulty === 3 ? 89 : 59);
  const repeated = digit * 11;
  const total = repeated + addend;
  if (total > 99 || addend % 10 === digit) return pyramidCryptarithmBook8({ difficulty });
  const result = digit;
  return book8Problem({
    prompt: "피라미드 세로셈에서 같은 별은 같은 숫자일 때 별에 알맞은 수를 구하세요.",
    subtype: "vertical", visual: { top: "☆☆", bottom: String(addend), operator: "+", result: String(total), note: "같은 별은 같은 숫자" },
    answer: result,
    solution: `${repeated}+${addend}=${total}이므로 ☆가 나타내는 숫자는 ${result}입니다.`,
    family: "pyramid-cryptarithm-b8", meta: { digit, addend, repeated, total, result }
  });
}

function blankDigitVerticalAdditionBook8({ difficulty = 2 }) {
  const missing = randomInt(difficulty === 1 ? 12 : 23, difficulty === 3 ? 87 : 69);
  const known = randomInt(11, difficulty === 3 ? 89 : 59);
  const total = missing + known;
  if (total > 150) return blankDigitVerticalAdditionBook8({ difficulty });
  const digits = [Math.floor(missing / 10), missing % 10];
  const result = sum(digits);
  if ([known, total].includes(result)) return blankDigitVerticalAdditionBook8({ difficulty });
  return book8Problem({
    prompt: "세로셈의 두 빈칸에 들어갈 숫자의 합을 구하세요.",
    subtype: "vertical", visual: { top: "□□", bottom: String(known), operator: "+", result: String(total), note: "□마다 서로 다른 빈칸" },
    answer: result,
    solution: `빈 두 자리 수는 ${total}-${known}=${missing}입니다. 두 숫자의 합은 ${digits[0]}+${digits[1]}=${result}입니다.`,
    family: "blank-digit-addition-b8", meta: { missing, known, total, digits, result }
  });
}

function cardEquationSolutions(cards, target) {
  const solutions = [];
  const largest = Math.max(...cards);
  const smallest = Math.min(...cards);
  for (const a of cards) for (const b of cards) for (const c of cards) for (const d of cards) {
    if (new Set([a, b, c, d]).size !== 4 || !cards.every((value) => [a, b, c, d].includes(value))) continue;
    if (a !== largest || b !== smallest || c === 0) continue;
    const first = 10 * a + b;
    const second = 10 * c + d;
    if (first > second && first + second === target) solutions.push([first, second]);
  }
  return solutions;
}

function allDigitsOnceCryptarithmBook8({ difficulty = 2 }) {
  for (let attempt = 0; attempt < 500; attempt += 1) {
    const pool = difficulty === 3 ? [0,1,2,3,4,5,6,7,8,9] : [1,2,3,4,5,6,7,8,9];
    const cards = shuffle(pool).slice(0, 4);
    const largest = Math.max(...cards);
    const smallest = Math.min(...cards);
    const remaining = shuffle(cards.filter((value) => value !== largest && value !== smallest));
    if (remaining[0] === 0) remaining.reverse();
    const first = largest * 10 + smallest;
    const second = remaining[0] * 10 + remaining[1];
    const target = first + second;
    const solutions = cardEquationSolutions(cards, target);
    if (solutions.length !== 1) continue;
    const answer = `${solutions[0][0]}+${solutions[0][1]}=${target}`;
    return book8Problem({
      prompt: "네 숫자 카드를 한 번씩 써서 큰 수를 위에 놓는 덧셈식을 완성하세요.",
      subtype: "cards", visual: { cards, layout: "□□ + □□", target, note: "가장 큰 카드는 위 수의 십의 자리, 가장 작은 카드는 위 수의 일의 자리" }, answer,
      solution: `가장 큰 카드 ${numberAnd(largest)} 가장 작은 카드 ${numberObject(smallest)} 위 수에 놓고 남은 카드를 한 번씩 쓰면 가능한 식은 ${answer} 한 가지입니다.`,
      family: "all-digits-once-b8", meta: { cards, target, solutions, result: answer }
    });
  }
  return allDigitsOnceCryptarithmBook8({ difficulty });
}

function orderedSymbolCandidates(total) {
  const candidates = [];
  for (let a = 1; a <= 9; a += 1) for (let b = 0; b <= 9; b += 1) for (let c = 0; c <= 9; c += 1) {
    if (a > b && b > c && 10 * a + b + c === total) candidates.push([a, b, c]);
  }
  return candidates;
}

function orderedSymbolCryptarithmBook8({ difficulty = 2 }) {
  for (let attempt = 0; attempt < 300; attempt += 1) {
    const values = shuffle([1,2,3,4,5,6,7,8,9]).slice(0, 3).sort((a, b) => b - a);
    const total = 10 * values[0] + values[1] + values[2];
    const candidates = orderedSymbolCandidates(total);
    if (candidates.length !== 1) continue;
    const result = sum(values);
    return book8Problem({
      prompt: "서로 다른 도형의 크기 조건과 세로셈을 만족할 때 세 도형의 수를 더하세요.",
      subtype: "vertical", visual: { top: "○△", bottom: "□", operator: "+", result: String(total), note: "○ > △ > □" },
      answer: result,
      solution: `조건과 세로셈을 함께 만족하는 값은 ○=${values[0]}, △=${values[1]}, □=${values[2]}뿐이므로 합은 ${result}입니다.`,
      family: "ordered-symbol-b8", meta: { total, values, candidates, result }
    });
  }
  return orderedSymbolCryptarithmBook8({ difficulty });
}

function repeatedSymbolCryptarithmBook8({ difficulty = 2 }) {
  const digit = randomInt(1, difficulty === 3 ? 8 : 7);
  const total = digit * 12;
  return book8Problem({
    prompt: "같은 동그라미는 같은 숫자일 때 동그라미가 나타내는 수를 구하세요.",
    subtype: "vertical", visual: { top: "○○", bottom: "○", operator: "+", result: String(total), note: "같은 동그라미는 같은 숫자" },
    answer: digit,
    solution: `십의 자리 ○는 ○가 10개인 값이므로 ○○와 ○를 더하면 ○가 모두 12개입니다. ${total}÷12=${digit}입니다.`,
    family: "repeated-symbol-b8", meta: { digit, total, result: digit }
  });
}

function multiSymbolCandidates(total) {
  const candidates = [];
  for (let a = 1; a <= 9; a += 1) for (let b = 1; b <= 9; b += 1) for (let c = 0; c <= 9; c += 1) {
    if (new Set([a, b, c]).size < 3 || !(a > b && b > c)) continue;
    if ((10 * a + b) + (10 * b + c) === total) candidates.push([a, b, c]);
  }
  return candidates;
}

function multiSymbolCryptarithmBook8({ difficulty = 2 }) {
  for (let attempt = 0; attempt < 300; attempt += 1) {
    const values = shuffle([1,2,3,4,5,6,7,8,9]).slice(0, 3).sort((a, b) => b - a);
    const total = 10 * values[0] + values[1] + 10 * values[1] + values[2];
    const candidates = multiSymbolCandidates(total);
    if (candidates.length !== 1) continue;
    const result = sum(values);
    return book8Problem({
      prompt: "서로 다른 도형의 세로셈과 크기 조건을 만족할 때 세 도형의 수를 더하세요.",
      subtype: "vertical", visual: { top: "○△", bottom: "△□", operator: "+", result: String(total), note: "○ > △ > □" },
      answer: result,
      solution: `조건을 만족하는 값은 ○=${values[0]}, △=${values[1]}, □=${values[2]} 한 가지이므로 합은 ${result}입니다.`,
      family: "multi-symbol-b8", meta: { total, values, candidates, result }
    });
  }
  return multiSymbolCryptarithmBook8({ difficulty });
}

function doubledSymbolResultBook8({ difficulty = 2 }) {
  const digit = randomInt(1, difficulty === 3 ? 8 : 6);
  const total = digit * 22;
  return book8Problem({
    prompt: "같은 별은 같은 숫자일 때 별이 나타내는 수를 구하세요.",
    subtype: "vertical", visual: { top: "☆☆", bottom: "☆☆", operator: "+", result: String(total), note: "같은 별은 같은 숫자" },
    answer: digit,
    solution: `☆☆ 하나는 ☆가 11개인 값이므로 두 수를 더하면 ☆가 모두 22개입니다. ${total}÷22=${digit}입니다.`,
    family: "doubled-symbol-b8", meta: { digit, total, result: digit }
  });
}

function letterPyramidCryptarithmBook8({ difficulty = 2 }) {
  const value = randomInt(difficulty === 1 ? 123 : 214, difficulty === 3 ? 487 : 376);
  const total = value * 2;
  const digits = String(value).split("").map(Number);
  const result = sum(digits);
  return book8Problem({
    prompt: "문자 피라미드의 같은 문자는 같은 숫자일 때 A, B, C의 수를 더하세요.",
    subtype: "vertical", visual: { top: "ABC", bottom: "ABC", operator: "+", result: String(total), note: "A, B, C는 서로 다른 숫자" },
    answer: result,
    solution: `${numberObject(total)} 똑같이 두 수로 가르면 ABC=${value}입니다. 따라서 ${digits.join("+")}=${result}입니다.`,
    family: "letter-pyramid-b8", meta: { value, total, digits, result }
  });
}

function repeatedNumberMultipleAnswersBook8({ difficulty = 2 }) {
  const fixed = randomInt(1, difficulty === 3 ? 4 : 3);
  const valid = [];
  for (let digit = 1; digit <= 9 - fixed; digit += 1) {
    const resultDigit = digit + fixed;
    if (digit !== fixed && resultDigit !== fixed && resultDigit !== digit) valid.push(digit);
  }
  return book8Problem({
    prompt: "서로 다른 도형은 서로 다른 숫자일 때 동그라미에 들어갈 수를 모두 찾으세요.",
    subtype: "vertical", visual: { top: "○○", bottom: String(fixed * 11), operator: "+", result: "□□", note: "○와 □는 서로 다른 숫자" },
    answer: valid.join(", "),
    solution: `○에 1부터 차례로 넣어 같은 숫자 두 자리 수의 덧셈이 되는지 확인하면 ${valid.join(", ")}입니다.`,
    family: "repeated-number-list-b8", meta: { fixed, valid, result: valid }
  });
}

function linkedCryptarithmBook8({ difficulty = 2 }) {
  const digit = randomInt(1, difficulty === 3 ? 7 : 6);
  const firstTotal = digit * 12;
  const known = randomInt(3, difficulty === 3 ? 18 : 12);
  if (known === digit) return linkedCryptarithmBook8({ difficulty });
  const finalTotal = firstTotal + known;
  return book8Problem({
    prompt: "이어진 두 세로셈을 보고 동그라미가 나타내는 수를 구하세요.",
    subtype: "linked-vertical",
    visual: { equations: [{ top: "○○", bottom: "○", operator: "+", result: "△□" }, { top: "△□", bottom: String(known), operator: "+", result: String(finalTotal) }] },
    answer: digit,
    solution: `둘째 식에서 △□=${finalTotal}-${known}=${firstTotal}입니다. 첫째 식은 ○가 12개인 값이므로 ○=${firstTotal}÷12=${digit}입니다.`,
    family: "linked-cryptarithm-b8", meta: { digit, firstTotal, known, finalTotal, result: digit }
  });
}

function subtractRepeatedCandidates(total, gap) {
  const candidates = [];
  for (let a = 1; a <= 9; a += 1) for (let b = 0; b <= 9; b += 1) for (let c = 1; c <= 9; c += 1) for (let d = 1; d <= 9; d += 1) {
    if (a !== c + gap || 10 * a + b - c !== 11 * d) continue;
    candidates.push([a, b, c, d]);
  }
  return candidates.filter((values) => 11 * values[3] === total);
}

function subtractToRepeatedNumberBook8({ difficulty = 2 }) {
  for (let attempt = 0; attempt < 400; attempt += 1) {
    const a = randomInt(3, 9);
    const c = randomInt(1, a - 1);
    const gap = a - c;
    const d = randomInt(1, 8);
    const b = 11 * d + c - 10 * a;
    if (b < 0 || b > 9) continue;
    const total = 11 * d;
    const candidates = subtractRepeatedCandidates(total, gap);
    if (candidates.length !== 1 || d === gap) continue;
    return book8Problem({
      prompt: "세로 뺄셈과 숫자 조건을 만족할 때 별이 나타내는 수를 구하세요.",
      subtype: "vertical", visual: { top: "○△", bottom: "□", operator: "−", result: "☆☆", note: `○는 □보다 ${gap} 큽니다.` },
      answer: d,
      solution: `조건과 뺄셈을 함께 만족하는 식은 ${10 * a + b}-${c}=${total}이므로 ☆=${d}입니다.`,
      family: "subtract-repeated-b8", meta: { a, b, c, d, gap, total, candidates, result: d }
    });
  }
  return subtractToRepeatedNumberBook8({ difficulty });
}

function equalizeTransferBook8({ difficulty = 2 }) {
  const result = randomInt(2, difficulty === 3 ? 18 : 12);
  const smaller = randomInt(8, difficulty === 3 ? 40 : 28);
  const larger = smaller + result * 2;
  if ([smaller, larger].includes(result)) return equalizeTransferBook8({ difficulty });
  return book8Problem({
    prompt: "많은 쪽에서 적은 쪽으로 몇 개를 옮기면 두 사람의 수가 같아지나요?",
    subtype: "bars", visual: { bars: [{ label: "가", value: larger }, { label: "나", value: smaller }], action: "가 → 나" },
    answer: `${result}개`,
    solution: `두 수의 차는 ${larger}-${smaller}=${result * 2}개입니다. 옮긴 수의 두 배만큼 차가 줄어드므로 ${result * 2}÷2=${result}개입니다.`,
    family: "equalize-transfer-b8", meta: { larger, smaller, result }
  });
}

function chainedEqualizeTransferBook8({ difficulty = 2 }) {
  const final = randomInt(10, difficulty === 3 ? 35 : 24);
  const firstTransfer = randomInt(2, difficulty === 3 ? 10 : 7);
  const secondTransfer = randomInt(2, difficulty === 3 ? 10 : 7);
  const initial = [final + firstTransfer, final - firstTransfer + secondTransfer, final - secondTransfer];
  if (initial.some((value) => value <= 0) || firstTransfer === secondTransfer || initial[1] === initial[0] || initial[1] === initial[2]) return chainedEqualizeTransferBook8({ difficulty });
  const result = initial[1];
  return book8Problem({
    prompt: "가가 나에게 주고, 이어서 나가 다에게 주었더니 세 사람의 수가 같아졌습니다. 나가 처음 가진 수를 구하세요.",
    subtype: "transfer",
    visual: { people: [{ label: "가", value: initial[0] }, { label: "나", value: "?" }, { label: "다", value: initial[2] }], steps: [`가가 나에게 ${firstTransfer}개`, `나가 다에게 ${secondTransfer}개`], final },
    answer: `${result}개`,
    solution: `마지막에 모두 ${final}개입니다. 나는 마지막에 ${secondTransfer}개를 주고 처음에 ${firstTransfer}개를 받았으므로 ${final}+${secondTransfer}-${firstTransfer}=${result}개입니다.`,
    family: "chained-equalize-b8", meta: { final, firstTransfer, secondTransfer, initial, result }
  });
}

function totalDifferenceBarsBook8({ difficulty = 2 }) {
  const smaller = randomInt(5, difficulty === 3 ? 40 : 25);
  const difference = randomInt(2, difficulty === 3 ? 24 : 14);
  const larger = smaller + difference;
  const total = larger + smaller;
  const askLarger = Math.random() < 0.5;
  const result = askLarger ? larger : smaller;
  if (result === difference) return totalDifferenceBarsBook8({ difficulty });
  return book8Problem({
    prompt: `두 수의 합은 ${total}이고 차는 ${difference}입니다. ${askLarger ? "큰 수" : "작은 수"}를 구하세요.`,
    subtype: "bars", visual: { bars: [{ label: "큰 수", units: 1, offset: difference }, { label: "작은 수", units: 1 }], facts: [`합 ${total}`, `차 ${difference}`] },
    answer: result,
    solution: `합에서 차 ${numberObject(difference)} 빼면 작은 수 두 개가 되어 (${total}-${difference})÷2=${smaller}입니다. 따라서 ${askLarger ? `${smaller}+${difference}=${larger}` : smaller}입니다.`,
    family: "total-difference-bars-b8", meta: { smaller, larger, difference, total, askLarger, result }
  });
}

function futureAgeSumBook8({ difficulty = 2 }) {
  const younger = randomInt(5, difficulty === 3 ? 20 : 14);
  const difference = randomInt(2, difficulty === 3 ? 12 : 8);
  const years = randomInt(2, difficulty === 3 ? 12 : 7);
  const older = younger + difference;
  const futureTotal = younger + older + years * 2;
  if (younger === difference || younger === years) return futureAgeSumBook8({ difficulty });
  return book8Problem({
    prompt: `${years}년 뒤 두 사람 나이의 합은 ${futureTotal}살이고 나이 차는 ${difference}살입니다. 지금 어린 사람의 나이는 몇 살인가요?`,
    subtype: "bars", visual: { bars: [{ label: "많은 나이", units: 1, offset: difference }, { label: "적은 나이", units: 1 }], facts: [`${years}년 뒤 합 ${futureTotal}살`, `차 ${difference}살`] },
    answer: `${younger}살`,
    solution: `지금 나이의 합은 ${futureTotal}-${years * 2}=${younger + older}살입니다. 차를 빼고 반으로 나누면 (${younger + older}-${difference})÷2=${younger}살입니다.`,
    family: "future-age-sum-b8", meta: { younger, older, difference, years, futureTotal, result: younger }
  });
}

function tableTotalDifferenceBook8({ difficulty = 2 }) {
  const first = randomInt(8, difficulty === 3 ? 35 : 24);
  const difference = randomInt(2, difficulty === 3 ? 16 : 10);
  const second = first + difference;
  const other = randomInt(5, difficulty === 3 ? 30 : 20);
  const total = first + second + other;
  const result = second;
  if (result === other || result === difference) return tableTotalDifferenceBook8({ difficulty });
  return book8Problem({
    prompt: "표의 세 수의 합과 두 빈칸의 차를 보고 큰 빈칸의 수를 구하세요.",
    subtype: "table", visual: { headers: ["가", "나", "다", "합"], rows: [["?", "?", other, total]], notes: [`나는 가보다 ${difference} 큽니다.`] },
    answer: result,
    solution: `두 빈칸의 합은 ${total}-${other}=${first + second}입니다. 차 ${numberObject(difference)} 더한 뒤 반으로 나누면 (${first + second}+${difference})÷2=${result}입니다.`,
    family: "table-total-difference-b8", meta: { first, second, other, difference, total, result }
  });
}

function reverseTransferThreeBook8({ difficulty = 2 }) {
  const final = [randomInt(8, 24), randomInt(8, 24), randomInt(8, 24)];
  const fromA = randomInt(2, difficulty === 3 ? 9 : 6);
  const fromC = randomInt(2, difficulty === 3 ? 9 : 6);
  const initial = [final[0] + fromA, final[1] - fromA - fromC, final[2] + fromC];
  if (initial[1] <= 0 || final.includes(initial[1]) || initial[1] === fromA || initial[1] === fromC) return reverseTransferThreeBook8({ difficulty });
  const result = initial[1];
  return book8Problem({
    prompt: "가와 다가 나에게 준 뒤의 수가 보입니다. 나가 처음 가진 수를 구하세요.",
    subtype: "transfer", visual: { people: final.map((value, index) => ({ label: ["가", "나", "다"][index], value })), steps: [`가가 나에게 ${fromA}개`, `다가 나에게 ${fromC}개`], mode: "final" },
    answer: `${result}개`,
    solution: `나는 가에게 ${fromA}개, 다에게 ${fromC}개를 받았습니다. 받은 수를 되돌리면 ${final[1]}-${fromA}-${fromC}=${result}개입니다.`,
    family: "reverse-transfer-three-b8", meta: { final, fromA, fromC, initial, result }
  });
}

function sumMultipleBarsBook8({ difficulty = 2 }) {
  const multiplier = randomInt(2, difficulty === 3 ? 6 : 4);
  const smaller = randomInt(3, difficulty === 3 ? 18 : 12);
  const larger = smaller * multiplier;
  const total = smaller + larger;
  const askLarger = Math.random() < 0.5;
  const result = askLarger ? larger : smaller;
  if (result === multiplier) return sumMultipleBarsBook8({ difficulty });
  return book8Problem({
    prompt: `두 수의 합은 ${total}이고 큰 수는 작은 수의 ${multiplier}배입니다. ${askLarger ? "큰 수" : "작은 수"}를 구하세요.`,
    subtype: "bars", visual: { bars: [{ label: "큰 수", units: multiplier }, { label: "작은 수", units: 1 }], facts: [`합 ${total}`] },
    answer: result,
    solution: `전체는 같은 묶음 ${multiplier + 1}개이므로 한 묶음은 ${total}÷${multiplier + 1}=${smaller}입니다. ${askLarger ? `큰 수는 ${smaller}×${multiplier}=${larger}` : `작은 수는 ${smaller}`}입니다.`,
    family: "sum-multiple-bars-b8", meta: { multiplier, smaller, larger, total, askLarger, result }
  });
}

function differenceMultipleBarsBook8({ difficulty = 2 }) {
  const multiplier = randomInt(2, difficulty === 3 ? 7 : 5);
  const smaller = randomInt(3, difficulty === 3 ? 18 : 12);
  const larger = smaller * multiplier;
  const difference = larger - smaller;
  const askLarger = Math.random() < 0.5;
  const result = askLarger ? larger : smaller;
  if (result === multiplier) return differenceMultipleBarsBook8({ difficulty });
  return book8Problem({
    prompt: `큰 수는 작은 수의 ${multiplier}배이고 두 수의 차는 ${difference}입니다. ${askLarger ? "큰 수" : "작은 수"}를 구하세요.`,
    subtype: "bars", visual: { bars: [{ label: "큰 수", units: multiplier }, { label: "작은 수", units: 1 }], facts: [`차 ${difference}`] },
    answer: result,
    solution: `차는 같은 묶음 ${multiplier - 1}개이므로 한 묶음은 ${difference}÷${multiplier - 1}=${smaller}입니다. ${askLarger ? `큰 수는 ${larger}` : `작은 수는 ${smaller}`}입니다.`,
    family: "difference-multiple-bars-b8", meta: { multiplier, smaller, larger, difference, askLarger, result }
  });
}

function sumMultipleOffsetBook8({ difficulty = 2 }) {
  const multiplier = randomInt(2, difficulty === 3 ? 5 : 4);
  const smaller = randomInt(4, difficulty === 3 ? 20 : 13);
  const sign = Math.random() < 0.5 ? 1 : -1;
  const offset = randomInt(1, difficulty === 3 ? 10 : 6);
  const larger = smaller * multiplier + sign * offset;
  if (larger <= smaller) return sumMultipleOffsetBook8({ difficulty });
  const total = smaller + larger;
  const result = smaller;
  if (result === offset || result === multiplier) return sumMultipleOffsetBook8({ difficulty });
  return book8Problem({
    prompt: `두 수의 합은 ${total}이고 큰 수는 작은 수의 ${multiplier}배보다 ${offset} ${sign > 0 ? "큽니다" : "작습니다"}. 작은 수를 구하세요.`,
    subtype: "bars", visual: { bars: [{ label: "큰 수", units: multiplier, offset: sign * offset }, { label: "작은 수", units: 1 }], facts: [`합 ${total}`] },
    answer: result,
    solution: `${sign > 0 ? `합에서 ${numberObject(offset)} 빼면` : `합에 ${numberObject(offset)} 더하면`} 같은 묶음 ${multiplier + 1}개입니다. ${sign > 0 ? total - offset : total + offset}÷${multiplier + 1}=${result}입니다.`,
    family: "sum-multiple-offset-b8", meta: { multiplier, smaller, larger, sign, offset, total, result }
  });
}

function threePersonDifferenceBook8({ difficulty = 2 }) {
  const middle = randomInt(6, difficulty === 3 ? 28 : 18);
  const above = randomInt(2, difficulty === 3 ? 12 : 8);
  const below = randomInt(1, Math.min(middle - 1, difficulty === 3 ? 10 : 6));
  const first = middle + above;
  const third = middle - below;
  const pairTotal = first + third;
  if (middle === above || middle === below) return threePersonDifferenceBook8({ difficulty });
  const adjustment = above - below;
  const adjustmentText = adjustment >= 0
    ? `나 두 개에 ${adjustment}개를 더한 값`
    : `나 두 개에서 ${Math.abs(adjustment)}개를 뺀 값`;
  const reverseExpression = adjustment >= 0
    ? `(${pairTotal}-${adjustment})÷2`
    : `(${pairTotal}+${Math.abs(adjustment)})÷2`;
  return book8Problem({
    prompt: `가는 나보다 ${above}개 많고, 다는 나보다 ${below}개 적습니다. 가와 다의 합이 ${pairTotal}개일 때 나의 수를 구하세요.`,
    subtype: "bars", visual: { bars: [{ label: "가", units: 1, offset: above }, { label: "나", units: 1 }, { label: "다", units: 1, offset: -below }], facts: [`가+다=${pairTotal}`] },
    answer: `${middle}개`,
    solution: `가와 다의 합은 ${adjustmentText}입니다. ${reverseExpression}=${middle}개입니다.`,
    family: "three-person-difference-b8", meta: { middle, above, below, first, third, pairTotal, result: middle }
  });
}

function transferToMultipleBook8({ difficulty = 2 }) {
  const multiplier = randomInt(2, difficulty === 3 ? 5 : 4);
  const moved = randomInt(2, difficulty === 3 ? 10 : 7);
  const afterSmall = randomInt(5, difficulty === 3 ? 20 : 14);
  const afterLarge = afterSmall * multiplier;
  const initialLarge = afterLarge + moved;
  const initialSmall = afterSmall - moved;
  if (initialSmall <= 0) return transferToMultipleBook8({ difficulty });
  const total = initialLarge + initialSmall;
  const result = initialLarge;
  return book8Problem({
    prompt: `가가 나에게 ${moved}개를 주었더니 가의 수가 나의 ${multiplier}배가 되었습니다. 처음 두 사람의 합이 ${total}개일 때 가가 처음 가진 수를 구하세요.`,
    subtype: "transfer", visual: { people: [{ label: "가", value: "?" }, { label: "나", value: "?" }], steps: [`가 → 나 ${moved}개`, `준 뒤 가는 나의 ${multiplier}배`], total },
    answer: `${result}개`,
    solution: `준 뒤에도 합은 ${total}개이고 같은 묶음은 ${multiplier + 1}개입니다. 나의 수는 ${total}÷${multiplier + 1}=${afterSmall}개, 가의 수는 ${afterLarge}개입니다. 가가 준 ${moved}개를 되돌리면 ${result}개입니다.`,
    family: "transfer-to-multiple-b8", meta: { multiplier, moved, afterSmall, afterLarge, initialLarge, initialSmall, total, result }
  });
}

function conditionalThreeShareBook8({ difficulty = 2 }) {
  const final = randomInt(8, difficulty === 3 ? 28 : 20);
  const firstMove = randomInt(2, difficulty === 3 ? 9 : 6);
  const secondMove = randomInt(2, difficulty === 3 ? 9 : 6);
  const initial = [final + firstMove, final - firstMove + secondMove, final - secondMove];
  if (initial.some((value) => value <= 0) || initial[0] === firstMove || initial[0] === secondMove) return conditionalThreeShareBook8({ difficulty });
  const result = initial[0];
  return book8Problem({
    prompt: `가가 나에게 ${firstMove}개를 주고, 나가 다에게 ${secondMove}개를 주었더니 세 사람의 수가 모두 ${final}개가 되었습니다. 가가 처음 가진 수를 구하세요.`,
    subtype: "transfer", visual: { people: [{ label: "가", value: "?" }, { label: "나", value: "?" }, { label: "다", value: "?" }], steps: [`가 → 나 ${firstMove}개`, `나 → 다 ${secondMove}개`], final },
    answer: `${result}개`,
    solution: `가는 ${firstMove}개를 준 뒤 ${final}개이므로 처음에는 ${final}+${firstMove}=${result}개입니다.`,
    family: "conditional-three-share-b8", meta: { final, firstMove, secondMove, initial, result }
  });
}

function reverseDoubleOffsetBook8({ difficulty = 2 }) {
  const added = randomInt(4, difficulty === 3 ? 24 : 15);
  const offset = randomInt(1, difficulty === 3 ? 12 : 8);
  const result = added + offset;
  const final = result + added;
  return book8Problem({
    prompt: `어떤 수에 ${numberObject(added)} 더한 수는 처음 수의 두 배보다 ${offset} 작습니다. 어떤 수를 구하세요.`,
    subtype: "process", visual: { start: "?", steps: [`+ ${added}`], result: final, relation: `처음 수의 2배보다 ${offset} 작음` },
    answer: result,
    solution: `처음 수를 두 번 놓은 값에서 ${numberObject(offset)} 뺀 수와 처음 수에 ${numberObject(added)} 더한 수가 같습니다. 한쪽의 처음 수를 지우면 어떤 수는 ${added}+${offset}=${result}입니다.`,
    family: "reverse-double-offset-b8", meta: { added, offset, final, result }
  });

}

function reverseArithmeticChainBook8({ difficulty = 2 }) {
  const start = randomInt(5, difficulty === 3 ? 40 : 25);
  const add = randomInt(3, difficulty === 3 ? 20 : 12);
  const subtract = randomInt(2, Math.min(start + add - 1, difficulty === 3 ? 18 : 10));
  const final = start + add - subtract;
  if (add === subtract || [add, subtract, final].includes(start)) return reverseArithmeticChainBook8({ difficulty });
  return book8Problem({
    prompt: `${numberObject(add)} 더하고 ${numberObject(subtract)} 뺐더니 ${numberSubject(final)} 되었습니다. 처음 수를 구하세요.`,
    subtype: "process", visual: { start: "?", steps: [`+ ${add}`, `− ${subtract}`], result: final },
    answer: start,
    solution: `${final}에 ${numberObject(subtract)} 더하고 ${numberObject(add)} 빼면 ${final}+${subtract}-${add}=${start}입니다.`,
    family: "reverse-arithmetic-chain-b8", meta: { start, add, subtract, final, result: start }
  });
}

function reverseTransferEventsBook8({ difficulty = 2 }) {
  const start = randomInt(12, difficulty === 3 ? 45 : 30);
  const gave = randomInt(2, difficulty === 3 ? 12 : 8);
  const received = randomInt(2, difficulty === 3 ? 12 : 8);
  const final = start - gave + received;
  if (gave === received || [gave, received, final].includes(start)) return reverseTransferEventsBook8({ difficulty });
  return book8Problem({
    prompt: `친구에게 ${gave}개를 주고 다른 친구에게 ${received}개를 받았더니 ${final}개가 되었습니다. 처음 수를 구하세요.`,
    subtype: "process", visual: { start: "?", steps: [`− ${gave}`, `+ ${received}`], result: final },
    answer: `${start}개`,
    solution: `마지막 ${final}개에서 받은 ${received}개를 빼고 준 ${gave}개를 더하면 ${start}개입니다.`,
    family: "reverse-transfer-events-b8", meta: { start, gave, received, final, result: start }
  });
}

function reverseMultiplyDivideBook8({ difficulty = 2 }) {
  const multiplier = randomInt(2, difficulty === 3 ? 6 : 4);
  const divisor = randomInt(2, difficulty === 3 ? 5 : 4);
  const start = randomInt(3, difficulty === 3 ? 20 : 12) * divisor;
  const added = randomInt(2, difficulty === 3 ? 15 : 9) * divisor;
  const final = (start * multiplier + added) / divisor;
  if ([multiplier, added, divisor, final].includes(start)) return reverseMultiplyDivideBook8({ difficulty });
  return book8Problem({
    prompt: `어떤 수에 ${numberObject(multiplier)} 곱하고 ${numberObject(added)} 더한 뒤 ${divisor}로 나누었더니 ${numberSubject(final)} 되었습니다. 처음 수를 구하세요.`,
    subtype: "process", visual: { start: "?", steps: [`× ${multiplier}`, `+ ${added}`, `÷ ${divisor}`], result: final },
    answer: start,
    solution: `${final}×${divisor}-${added}=${start * multiplier}, ${start * multiplier}÷${multiplier}=${start}입니다.`,
    family: "reverse-multiply-divide-b8", meta: { start, multiplier, added, divisor, final, result: start }
  });
}

function reverseSplitEqualBook8({ difficulty = 2 }) {
  const parts = randomInt(2, difficulty === 3 ? 5 : 4);
  const share = randomInt(4, difficulty === 3 ? 18 : 12);
  const given = randomInt(1, Math.min(share - 1, difficulty === 3 ? 8 : 5));
  const afterGive = share - given;
  const start = share * parts;
  return book8Problem({
    prompt: `어떤 수를 똑같이 ${parts}묶음으로 나눈 뒤 한 묶음에서 ${given}개를 주었더니 ${afterGive}개가 남았습니다. 처음 수를 구하세요.`,
    subtype: "process", visual: { start: "?", steps: [`÷ ${parts}`, `− ${given}`], result: afterGive },
    answer: `${start}개`,
    solution: `나누어 가진 한 묶음은 ${afterGive}+${given}=${share}개입니다. ${share}×${parts}=${start}개입니다.`,
    family: "reverse-split-equal-b8", meta: { parts, share, given, afterGive, start, result: start }
  });
}

function giveAsMuchOnceBook8({ difficulty = 2 }) {
  const second = randomInt(3, difficulty === 3 ? 18 : 12);
  const first = randomInt(second + 2, difficulty === 3 ? 45 : 30);
  const after = [first - second, second * 2];
  const result = first;
  if ([second, ...after].includes(result)) return giveAsMuchOnceBook8({ difficulty });
  return book8Problem({
    prompt: `가가 나에게 나가 가진 만큼 주었더니 가는 ${after[0]}개가 되었습니다. 나의 처음 수가 ${second}개일 때 가가 처음 가진 수를 구하세요.`,
    subtype: "transfer", visual: { people: [{ label: "가", value: "?" }, { label: "나", value: second }], steps: ["가는 나가 가진 만큼 줌"], finalValues: after },
    answer: `${result}개`,
    solution: `가는 나가 가진 ${second}개를 주고 ${after[0]}개가 남았으므로 처음에는 ${after[0]}+${second}=${result}개입니다.`,
    family: "give-as-much-once-b8", meta: { first, second, after, result }
  });
}

function giveAsMuchReturnBook8({ difficulty = 2 }) {
  const first = randomInt(12, difficulty === 3 ? 40 : 28);
  const second = randomInt(3, Math.min(first - 2, difficulty === 3 ? 16 : 11));
  const returned = randomInt(1, Math.min(second - 1, difficulty === 3 ? 7 : 5));
  const afterFirst = [first - second, second * 2];
  const final = [afterFirst[0] + returned, afterFirst[1] - returned];
  const result = first;
  if ([second, returned, ...afterFirst, ...final].includes(result)) return giveAsMuchReturnBook8({ difficulty });
  return book8Problem({
    prompt: `가가 나에게 나가 가진 만큼 준 뒤 나가 가에게 ${returned}개를 돌려주었습니다. 마지막에 가가 ${final[0]}개일 때 가가 처음 가진 수를 구하세요.`,
    subtype: "transfer", visual: { people: [{ label: "가", value: "?" }, { label: "나", value: second }], steps: ["가는 나가 가진 만큼 줌", `나 → 가 ${returned}개`], finalValues: final },
    answer: `${result}개`,
    solution: `가의 마지막 ${final[0]}개에서 돌려받은 ${returned}개를 빼면 ${afterFirst[0]}개입니다. 나의 처음 수인 ${second}개를 다시 더하면 ${result}개입니다.`,
    family: "give-as-much-return-b8", meta: { first, second, returned, afterFirst, final, result }
  });
}

function shadedFractionCountBook8({ difficulty = 2 }) {
  const denominator = randomInt(3, difficulty === 3 ? 10 : 7);
  const numerator = randomInt(1, denominator - 1);
  const unit = randomInt(2, difficulty === 3 ? 12 : 8);
  const whole = denominator * unit;
  const result = numerator * unit;
  if ([denominator, numerator, whole].includes(result)) return shadedFractionCountBook8({ difficulty });
  return book8Problem({
    prompt: `구슬 ${whole}개의 ${fractionText(numerator, denominator)}만큼은 몇 개인가요?`,
    subtype: "fraction", visual: { denominator, numerator, whole, unknown: true },
    answer: `${result}개`,
    solution: `${whole}÷${denominator}=${unit}개가 한 조각이고, ${unit}×${numerator}=${result}개입니다.`,
    family: "shaded-fraction-count-b8", meta: { denominator, numerator, unit, whole, result }
  });
}

function fractionGivenAwayOriginalBook8({ difficulty = 2 }) {
  const denominator = randomInt(3, difficulty === 3 ? 9 : 7);
  const numerator = randomInt(1, denominator - 1);
  const unit = randomInt(3, difficulty === 3 ? 14 : 9);
  const original = denominator * unit;
  const given = numerator * unit;
  const remaining = original - given;
  return book8Problem({
    prompt: `전체의 ${fractionText(numerator, denominator)}만큼 주었더니 ${remaining}개가 남았습니다. 처음 수를 구하세요.`,
    subtype: "fraction", visual: { denominator, numerator: denominator - numerator, whole: "?", label: "남은 부분", shownValue: remaining },
    answer: `${original}개`,
    solution: `남은 부분은 전체의 ${fractionText(denominator - numerator, denominator)}입니다. ${remaining}÷${denominator - numerator}=${unit}개가 한 조각이므로 전체는 ${unit}×${denominator}=${original}개입니다.`,
    family: "fraction-given-away-b8", meta: { denominator, numerator, unit, original, given, remaining, result: original }
  });
}

function sequentialFractionRemainsBook8({ difficulty = 2 }) {
  const firstDenominator = sample([2, 3, 4]);
  const firstNumerator = 1;
  const secondDenominator = sample([2, 3]);
  const secondNumerator = 1;
  const scale = randomInt(2, difficulty === 3 ? 12 : 8);
  const original = firstDenominator * secondDenominator * scale;
  const afterFirst = original * (firstDenominator - firstNumerator) / firstDenominator;
  const final = afterFirst * (secondDenominator - secondNumerator) / secondDenominator;
  return book8Problem({
    prompt: `처음 수의 ${fractionText(firstNumerator, firstDenominator)}만큼 쓰고, 남은 것의 ${fractionText(secondNumerator, secondDenominator)}만큼 다시 썼더니 ${final}개가 남았습니다. 처음 수를 구하세요.`,
    subtype: "fraction-process", visual: { start: "?", steps: [`${fractionText(firstNumerator, firstDenominator)} 사용`, `남은 것의 ${fractionText(secondNumerator, secondDenominator)} 사용`], result: final },
    answer: `${original}개`,
    solution: `두 번째 사용 전에는 ${final}÷${secondDenominator - secondNumerator}×${secondDenominator}=${afterFirst}개입니다. 처음에는 ${afterFirst}÷${firstDenominator - firstNumerator}×${firstDenominator}=${original}개입니다.`,
    family: "sequential-fraction-remains-b8", meta: { firstDenominator, firstNumerator, secondDenominator, secondNumerator, original, afterFirst, final, result: original }
  });
}

function fractionDifferenceWholeBook8({ difficulty = 2 }) {
  const denominator = randomInt(4, difficulty === 3 ? 10 : 8);
  const low = randomInt(1, denominator - 2);
  const high = randomInt(low + 1, denominator - 1);
  const unit = randomInt(3, difficulty === 3 ? 14 : 9);
  const difference = (high - low) * unit;
  const whole = denominator * unit;
  return book8Problem({
    prompt: `전체의 ${fractionText(high, denominator)}만큼과 ${fractionText(low, denominator)}만큼의 차가 ${difference}개입니다. 전체는 몇 개인가요?`,
    subtype: "fraction", visual: { denominator, numerator: high - low, whole: "?", label: "두 양의 차", shownValue: difference },
    answer: `${whole}개`,
    solution: `분수의 차는 ${fractionText(high - low, denominator)}입니다. 한 조각은 ${difference}÷${high - low}=${unit}개이므로 전체는 ${unit}×${denominator}=${whole}개입니다.`,
    family: "fraction-difference-whole-b8", meta: { denominator, low, high, unit, difference, whole, result: whole }
  });
}

function fractionShareDifferenceBook8({ difficulty = 2 }) {
  const denominator = sample([3, 4, 5, 6]);
  const firstNumerator = randomInt(1, denominator - 1);
  const secondNumerator = randomInt(1, denominator - 1);
  if (firstNumerator === secondNumerator) return fractionShareDifferenceBook8({ difficulty });
  const unit = randomInt(3, difficulty === 3 ? 15 : 9);
  const first = firstNumerator * unit;
  const second = secondNumerator * unit;
  const difference = Math.abs(first - second);
  const result = first + second;
  return book8Problem({
    prompt: `두 모둠은 크기가 같은 전체에서 각각 ${fractionText(firstNumerator, denominator)}, ${fractionText(secondNumerator, denominator)}만큼입니다. 두 모둠의 차가 ${difference}명일 때 두 모둠은 모두 몇 명인가요?`,
    subtype: "fraction-pair", visual: { denominator, numerators: [firstNumerator, secondNumerator], difference },
    answer: `${result}명`,
    solution: `분자 차 ${Math.abs(firstNumerator - secondNumerator)}조각이 ${difference}명이므로 한 조각은 ${unit}명입니다. 두 모둠은 ${first}+${second}=${result}명입니다.`,
    family: "fraction-share-difference-b8", meta: { denominator, firstNumerator, secondNumerator, unit, first, second, difference, result }
  });
}

function reverseTwoContainerTransfersBook8({ difficulty = 2 }) {
  const initial = [randomInt(12, difficulty === 3 ? 45 : 30), randomInt(12, difficulty === 3 ? 45 : 30)];
  const firstMove = randomInt(2, Math.min(initial[0] - 1, difficulty === 3 ? 12 : 8));
  const afterFirst = [initial[0] - firstMove, initial[1] + firstMove];
  const secondMove = randomInt(2, Math.min(afterFirst[1] - 1, difficulty === 3 ? 10 : 7));
  const final = [afterFirst[0] + secondMove, afterFirst[1] - secondMove];
  if ([firstMove, secondMove, final[0]].includes(initial[0])) return reverseTwoContainerTransfersBook8({ difficulty });
  return book8Problem({
    prompt: `첫 상자에서 둘째 상자로 ${firstMove}개를 옮기고, 다시 둘째에서 첫째로 ${secondMove}개를 옮겼더니 첫 상자에 ${final[0]}개가 되었습니다. 첫 상자에 처음 몇 개 있었나요?`,
    subtype: "transfer", visual: { people: [{ label: "첫 상자", value: "?" }, { label: "둘째 상자", value: "" }], steps: [`첫째 → 둘째 ${firstMove}개`, `둘째 → 첫째 ${secondMove}개`], finalValues: [final[0]] },
    answer: `${initial[0]}개`,
    solution: `마지막 ${final[0]}개에서 받은 ${secondMove}개를 빼고 처음에 준 ${firstMove}개를 더하면 ${final[0]}-${secondMove}+${firstMove}=${initial[0]}개입니다.`,
    family: "reverse-two-containers-b8", meta: { initial, firstMove, afterFirst, secondMove, final, result: initial[0] }
  });
}

function threeContainerConditionBook8({ difficulty = 2 }) {
  const middle = randomInt(5, difficulty === 3 ? 24 : 16);
  const firstGap = randomInt(2, difficulty === 3 ? 10 : 7);
  const thirdGap = randomInt(1, Math.min(middle - 1, difficulty === 3 ? 9 : 6));
  const values = [middle + firstGap, middle, middle - thirdGap];
  const total = sum(values);
  if (middle === firstGap || middle === thirdGap) return threeContainerConditionBook8({ difficulty });
  return book8Problem({
    prompt: `세 주머니의 합은 ${total}개입니다. 첫째는 둘째보다 ${firstGap}개 많고 셋째는 둘째보다 ${thirdGap}개 적을 때 둘째 주머니의 수를 구하세요.`,
    subtype: "bars", visual: { bars: [{ label: "첫째", units: 1, offset: firstGap }, { label: "둘째", units: 1 }, { label: "셋째", units: 1, offset: -thirdGap }], facts: [`합 ${total}`] },
    answer: `${middle}개`,
    solution: firstGap >= thirdGap
      ? `둘째 세 개에 ${firstGap - thirdGap}개를 더한 값이 ${total}입니다. (${total}-${firstGap - thirdGap})÷3=${middle}개입니다.`
      : `둘째 세 개에서 ${thirdGap - firstGap}개를 뺀 값이 ${total}입니다. (${total}+${thirdGap - firstGap})÷3=${middle}개입니다.`,
    family: "three-container-condition-b8", meta: { middle, firstGap, thirdGap, values, total, result: middle }
  });
}

function sequentialFractionConsumptionBook8({ difficulty = 2 }) {
  const firstDenominator = sample([2, 3, 4]);
  const secondDenominator = sample([2, 3, 4]);
  const scale = randomInt(2, difficulty === 3 ? 12 : 8);
  const original = firstDenominator * secondDenominator * scale;
  const afterFirst = original * (firstDenominator - 1) / firstDenominator;
  const final = afterFirst * (secondDenominator - 1) / secondDenominator;
  return book8Problem({
    prompt: `처음 수에서 ${fractionText(1, firstDenominator)}만큼 먹고, 남은 것에서 ${fractionText(1, secondDenominator)}만큼 먹었더니 ${final}개가 남았습니다. 처음 수를 구하세요.`,
    subtype: "fraction-process", visual: { start: "?", steps: [`전체의 ${fractionText(1, firstDenominator)} 먹음`, `남은 것의 ${fractionText(1, secondDenominator)} 먹음`], result: final },
    answer: `${original}개`,
    solution: `두 번째 전에는 ${final}÷${secondDenominator - 1}×${secondDenominator}=${afterFirst}개이고, 처음에는 ${afterFirst}÷${firstDenominator - 1}×${firstDenominator}=${original}개입니다.`,
    family: "sequential-fraction-consumption-b8", meta: { firstDenominator, secondDenominator, original, afterFirst, final, result: original }
  });
}

function fractionSubgroupCountBook8({ difficulty = 2 }) {
  const firstDenominator = sample([2, 3, 4, 5]);
  const secondDenominator = sample([2, 3, 4, 5]);
  const firstNumerator = randomInt(1, firstDenominator - 1);
  const secondNumerator = randomInt(1, secondDenominator - 1);
  const firstUnit = randomInt(2, difficulty === 3 ? 12 : 8);
  const secondUnit = randomInt(2, difficulty === 3 ? 12 : 8);
  const firstTotal = firstDenominator * firstUnit;
  const secondTotal = secondDenominator * secondUnit;
  const firstCount = firstNumerator * firstUnit;
  const secondCount = secondNumerator * secondUnit;
  const result = firstCount + secondCount;
  if ([firstTotal, secondTotal, firstDenominator, secondDenominator, firstNumerator, secondNumerator].includes(result)) return fractionSubgroupCountBook8({ difficulty });
  return book8Problem({
    prompt: `가 모둠 ${firstTotal}명 중 ${fractionText(firstNumerator, firstDenominator)}만큼과 나 모둠 ${secondTotal}명 중 ${fractionText(secondNumerator, secondDenominator)}만큼을 합하면 몇 명인가요?`,
    subtype: "fraction-pair", visual: { denominators: [firstDenominator, secondDenominator], numerators: [firstNumerator, secondNumerator], totals: [firstTotal, secondTotal] },
    answer: `${result}명`,
    solution: `가 모둠은 ${firstTotal}÷${firstDenominator}×${firstNumerator}=${firstCount}명, 나 모둠은 ${secondTotal}÷${secondDenominator}×${secondNumerator}=${secondCount}명입니다. 합은 ${result}명입니다.`,
    family: "fraction-subgroup-count-b8", meta: { firstDenominator, secondDenominator, firstNumerator, secondNumerator, firstUnit, secondUnit, firstTotal, secondTotal, firstCount, secondCount, result }
  });
}

export const BOOK08_GENERATORS = Object.freeze({
  balanceDifferenceDeductionBook8,
  overlapCircleSumBook8,
  symbolAdditiveChainBook8,
  additionMatrixTargetBook8,
  additionMatrixCompleteBook8,
  symbolOperationDeductionBook8,
  symbolCrossEquationBook8,
  conditionalSymbolChainBook8,
  conditionalTwoDigitSymbolBook8,
  cyclicPairSumsBook8,
  pyramidCryptarithmBook8,
  blankDigitVerticalAdditionBook8,
  allDigitsOnceCryptarithmBook8,
  orderedSymbolCryptarithmBook8,
  repeatedSymbolCryptarithmBook8,
  multiSymbolCryptarithmBook8,
  doubledSymbolResultBook8,
  letterPyramidCryptarithmBook8,
  repeatedNumberMultipleAnswersBook8,
  linkedCryptarithmBook8,
  subtractToRepeatedNumberBook8,
  equalizeTransferBook8,
  chainedEqualizeTransferBook8,
  totalDifferenceBarsBook8,
  futureAgeSumBook8,
  tableTotalDifferenceBook8,
  reverseTransferThreeBook8,
  sumMultipleBarsBook8,
  differenceMultipleBarsBook8,
  sumMultipleOffsetBook8,
  threePersonDifferenceBook8,
  transferToMultipleBook8,
  conditionalThreeShareBook8,
  reverseDoubleOffsetBook8,
  reverseArithmeticChainBook8,
  reverseTransferEventsBook8,
  reverseMultiplyDivideBook8,
  reverseSplitEqualBook8,
  giveAsMuchOnceBook8,
  giveAsMuchReturnBook8,
  shadedFractionCountBook8,
  fractionGivenAwayOriginalBook8,
  sequentialFractionRemainsBook8,
  fractionDifferenceWholeBook8,
  fractionShareDifferenceBook8,
  reverseTwoContainerTransfersBook8,
  threeContainerConditionBook8,
  sequentialFractionConsumptionBook8,
  fractionSubgroupCountBook8
});
