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
  const prompt = difficulty === 1
    ? `두 사람의 수 차이는 ${larger - smaller}개입니다. 많은 쪽에서 적은 쪽으로 몇 개를 옮기면 같아지나요?`
    : difficulty === 3
      ? `두 사람이 가진 수는 모두 ${larger + smaller}개이고, 많은 쪽은 ${larger}개입니다. 많은 쪽에서 적은 쪽으로 몇 개를 옮기면 같아지나요?`
      : "많은 쪽에서 적은 쪽으로 몇 개를 옮기면 두 사람의 수가 같아지나요?";
  const bars = difficulty === 3
    ? [{ label: "가", value: larger }, { label: "나", value: "?" }]
    : [{ label: "가", value: larger }, { label: "나", value: smaller }];
  return book8Problem({
    prompt,
    subtype: "bars", visual: { bars, action: "가 → 나", ...(difficulty === 1 ? { facts: [`차 ${larger - smaller}개`] } : {}), ...(difficulty === 3 ? { facts: [`합 ${larger + smaller}개`] } : {}) },
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

const UNIT_DIGITS_BOOK8 = Array.from({ length: 10 }, (_, index) => index);
const UNIT_PRODUCT_POSITIONS_BOOK8 = [
  [0, 1], [0, 2],
  [1, 2], [1, 3],
  [2, 0], [2, 3],
  [3, 0], [3, 1]
];
const UNIT_SHAPE_SUM_GRIDS_BOOK8 = {
  2: [
    ["◇", "□", "□", "□"],
    ["△", "□", "◇", "○"],
    ["○", "○", "○", "○"],
    ["○", "◇", "○", "◇"]
  ],
  21: [
    ["□", "△", "○", "☆"],
    ["○", "○", "☆", "○"],
    ["☆", "☆", "☆", "○"],
    ["△", "△", "△", "△"]
  ]
};

function unitPermuteBook8(items, callback) {
  const used = Array(items.length).fill(false);
  const current = [];
  const visit = (index) => {
    if (index === items.length) {
      callback([...current]);
      return;
    }
    items.forEach((item, itemIndex) => {
      if (used[itemIndex]) return;
      used[itemIndex] = true;
      current.push(item);
      visit(index + 1);
      current.pop();
      used[itemIndex] = false;
    });
  };
  visit(0);
}

function unitAssignmentsBook8(symbols, callback) {
  const used = new Set();
  const values = {};
  const visit = (index) => {
    if (index === symbols.length) {
      callback({ ...values });
      return;
    }
    for (let value = 1; value <= 9; value += 1) {
      if (used.has(value)) continue;
      used.add(value);
      values[symbols[index]] = value;
      visit(index + 1);
      delete values[symbols[index]];
      used.delete(value);
    }
  };
  visit(0);
}

function unitGridLineValueBook8(line, assignment) {
  return line.reduce((total, item) => total + assignment[item], 0);
}

function unitShapeGridSolutionsBook8(cells, rowSums, columnSums, knownColumns) {
  const symbols = [...new Set(cells.flat())];
  const solutions = [];
  unitAssignmentsBook8(symbols, (assignment) => {
    const rowsMatch = cells.every((row, rowIndex) => unitGridLineValueBook8(row, assignment) === rowSums[rowIndex]);
    const columnsMatch = knownColumns.every((columnIndex) => (
      cells.reduce((total, row) => total + assignment[row[columnIndex]], 0) === columnSums[columnIndex]
    ));
    if (rowsMatch && columnsMatch) solutions.push(assignment);
  });
  return solutions;
}

function unitDifficultyMaxBook8(difficulty, easy, medium, hard) {
  return difficulty === 1 ? easy : difficulty === 3 ? hard : medium;
}

function unitRandomDistinctBook8(count, min, max) {
  return shuffle(Array.from({ length: max - min + 1 }, (_, index) => min + index)).slice(0, count);
}

function unitBalanceThreeTargetsBook8({ difficulty = 2 } = {}) {
  const max = unitDifficultyMaxBook8(difficulty, 8, 12, 18);
  for (let attempt = 0; attempt < 300; attempt += 1) {
    const [square, circle] = unitRandomDistinctBook8(2, 1, max);
    const left = square + circle + circle;
    const right = square + square + circle;
    const target = square + circle;
    if (left === right || target === left || target === right) continue;
    const hint = difficulty === 1 ? "두 저울의 차이를 먼저 비교해 보세요. " : "";
    return book8Problem({
      prompt: hint + "같은 모양은 같은 무게입니다. 두 저울이 수평일 때 □+○, □, ○의 무게를 각각 구하세요.",
      subtype: "balance",
      visual: {
        equations: [
          ["□", "+", "○", "+", "○", "=", left],
          ["□", "+", "□", "+", "○", "=", right],
          ["□", "+", "○", "=", "?"],
          ["□", "=", "?"],
          ["○", "=", "?"]
        ]
      },
      answer: target + "g, " + square + "g, " + circle + "g",
      solution: "첫째 식과 둘째 식을 비교하면 " + (square > circle
        ? "□가 ○보다 " + (square - circle) + "g 무겁습니다. "
        : "○가 □보다 " + (circle - square) + "g 무겁습니다. ")
        + "두 식의 합은 " + (left + right) + "이고, □+○는 " + target + "g입니다. 따라서 □=" + square + "g, ○=" + circle + "g입니다.",
      family: "unit-q01-balance",
      meta: { difficulty, square, circle, left, right, target, result: [target, square, circle] }
    });
  }
  throw new Error("unit-q01 balance generation failed");
}

function unitFourByFourShapeSumBook8({ difficulty = 2, variant = 2 } = {}) {
  const cells = UNIT_SHAPE_SUM_GRIDS_BOOK8[variant];
  const symbols = [...new Set(cells.flat())];
  const max = unitDifficultyMaxBook8(difficulty, 6, 8, 9);
  const hiddenColumns = variant === 2 ? [0] : [1, 3];
  const knownColumns = [0, 1, 2, 3].filter((columnIndex) => !hiddenColumns.includes(columnIndex));
  for (let attempt = 0; attempt < 600; attempt += 1) {
    const values = unitRandomDistinctBook8(symbols.length, 1, max);
    const assignment = Object.fromEntries(symbols.map((item, index) => [item, values[index]]));
    const rowSums = cells.map((row) => unitGridLineValueBook8(row, assignment));
    const columnSums = [0, 1, 2, 3].map((columnIndex) => cells.reduce((total, row) => total + assignment[row[columnIndex]], 0));
    const solutions = unitShapeGridSolutionsBook8(cells, rowSums, columnSums, knownColumns);
    const targetValues = [...new Set(solutions.map((solution) => hiddenColumns.map((columnIndex) => (
      cells.reduce((total, row) => total + solution[row[columnIndex]], 0)
    )).join(",")))];
    if (targetValues.length !== 1) continue;
    const target = hiddenColumns.map((columnIndex) => columnSums[columnIndex]);
    const answer = target.join(", ");
    const targetText = variant === 2 ? "첫째 세로줄의 합" : "둘째와 넷째 세로줄의 합";
    const targetSentence = targetText + "은";
    const hint = difficulty === 1 ? "가로줄과 세로줄을 차례로 살펴보세요. " : "";
    return book8Problem({
      prompt: hint + "같은 모양은 같은 수입니다. 표의 가로줄과 보이는 세로줄의 합을 이용하여 " + targetText + "을 구하세요.",
      subtype: "matrix",
      visual: {
        operation: "+",
        cells,
        rowLabels: rowSums.map(String),
        columnLabels: columnSums.map((value, index) => hiddenColumns.includes(index) ? "?" : String(value)),
        rows: rowSums,
        columns: columnSums
      },
      answer,
      solution: symbols.map((item) => item + "=" + assignment[item]).join(", ") + "이므로 " + targetSentence + " " + answer + "입니다.",
      family: "unit-q" + String(variant).padStart(2, "0") + "-shape-sum",
      meta: { difficulty, variant, symbols, assignment, rowSums, columnSums, hiddenColumns, targetValues, assignmentSolutions: solutions }
    });
  }
  throw new Error("unit-q" + variant + " shape grid generation failed");
}

function unitFourByFourShapeSumQ02Book8({ difficulty = 2 } = {}) {
  return unitFourByFourShapeSumBook8({ difficulty, variant: 2 });
}

function unitFourByFourShapeSumQ21Book8({ difficulty = 2 } = {}) {
  return unitFourByFourShapeSumBook8({ difficulty, variant: 21 });
}

function unitProductPlacementSolutionsBook8(digits, rowProducts, columnProducts, revealed, clues) {
  const solutions = [];
  unitPermuteBook8(digits, (values) => {
    if (solutions.length >= 2) return;
    const rowMatch = [0, 1, 2, 3].every((rowIndex) => (
      values.filter((_, index) => UNIT_PRODUCT_POSITIONS_BOOK8[index][0] === rowIndex)
        .reduce((product, value) => product * value, 1) === rowProducts[rowIndex]
    ));
    const columnMatch = [0, 1, 2, 3].every((columnIndex) => (
      values.filter((_, index) => UNIT_PRODUCT_POSITIONS_BOOK8[index][1] === columnIndex)
        .reduce((product, value) => product * value, 1) === columnProducts[columnIndex]
    ));
    const cluesMatch = revealed.every((index) => values[index] === clues[index]);
    if (rowMatch && columnMatch && cluesMatch) solutions.push([...values]);
  });
  return solutions;
}

function unitProductPlacementCellsBook8(values, revealed) {
  const cells = Array.from({ length: 4 }, () => Array(4).fill(""));
  UNIT_PRODUCT_POSITIONS_BOOK8.forEach(([row, column], index) => {
    cells[row][column] = revealed.includes(index) ? String(values[index]) : "?";
  });
  return cells;
}

function unitFourByFourProductPlacementBook8({ difficulty = 2 } = {}) {
  const digits = [2, 3, 4, 5, 6, 7, 8, 9];
  const requestedClues = difficulty === 1 ? 6 : difficulty === 3 ? 2 : 4;
  const values = shuffle(digits);
  const rowProducts = [0, 1, 2, 3].map((rowIndex) => (
    values.filter((_, index) => UNIT_PRODUCT_POSITIONS_BOOK8[index][0] === rowIndex)
      .reduce((product, value) => product * value, 1)
  ));
  const columnProducts = [0, 1, 2, 3].map((columnIndex) => (
    values.filter((_, index) => UNIT_PRODUCT_POSITIONS_BOOK8[index][1] === columnIndex)
      .reduce((product, value) => product * value, 1)
  ));
  let revealed = shuffle(Array.from({ length: values.length }, (_, index) => index)).slice(0, requestedClues);
  let solutions = unitProductPlacementSolutionsBook8(digits, rowProducts, columnProducts, revealed, values);
  const remaining = shuffle(Array.from({ length: values.length }, (_, index) => index).filter((index) => !revealed.includes(index)));
  while (solutions.length > 1 && remaining.length && revealed.length < values.length - 1) {
    revealed.push(remaining.shift());
    solutions = unitProductPlacementSolutionsBook8(digits, rowProducts, columnProducts, revealed, values);
  }
  if (solutions.length !== 1) throw new Error("unit-q03 product placement has no unique answer");
  const cells = unitProductPlacementCellsBook8(values, revealed);
  return book8Problem({
    prompt: "2부터 9까지의 수를 한 번씩 넣습니다. 가로줄과 세로줄의 곱을 보고 빈칸을 모두 채우세요.",
    subtype: "matrix",
    visual: { operation: "×", cells, rowLabels: rowProducts.map(String), columnLabels: columnProducts.map(String), rows: rowProducts, columns: columnProducts },
    answer: values.join(", "),
    solution: "가로줄의 곱과 세로줄의 곱을 차례로 맞추면 빈칸의 배열은 " + values.join(", ") + "입니다.",
    family: "unit-q03-product-placement",
    meta: { difficulty, values, rowProducts, columnProducts, revealed, solutions }
  });
}

const UNIT_MULTIPLICATIVE_SHAPES_BOOK8 = [
  { diamond: "◇", square: "□", circle: "○", pentagon: "⬟", triangle: "△", cross: "✚" },
  { diamond: "◆", square: "■", circle: "●", pentagon: "⬢", triangle: "▲", cross: "✦" },
  { diamond: "♢", square: "▣", circle: "◉", pentagon: "⬡", triangle: "▽", cross: "✣" }
];

function unitMultiplicativeShapeSystemBook8({ difficulty = 2 } = {}) {
  const shapes = UNIT_MULTIPLICATIVE_SHAPES_BOOK8[difficulty - 1] || UNIT_MULTIPLICATIVE_SHAPES_BOOK8[0];
  const values = { diamond: 2, square: 4, circle: 8, pentagon: 3, triangle: 9, cross: 6 };
  const equations = [
    shapes.diamond + "×" + shapes.diamond + "=" + shapes.square,
    shapes.square + "×" + shapes.square + "=" + shapes.diamond + "×" + shapes.circle,
    shapes.pentagon + "×" + shapes.pentagon + "=" + shapes.triangle,
    shapes.cross + "×" + shapes.cross + "=" + shapes.square + "×" + shapes.triangle
  ];
  const hint = difficulty === 1 ? "같은 모양끼리 곱하는 식부터 찾아보세요. " : "";
  return book8Problem({
    prompt: hint + "같은 모양은 같은 수이고, 서로 다른 모양은 서로 다른 한 자리 수입니다. 식을 보고 " + shapes.cross + "가 나타내는 수를 구하세요.",
    subtype: "symbol-equations",
    visual: { equations, target: shapes.cross },
    answer: shapes.cross + "=6",
    solution: shapes.diamond + "×" + shapes.diamond + "=" + shapes.square + "에서 " + shapes.diamond + "=2, " + shapes.square + "=4입니다. " + shapes.cross + "×" + shapes.cross + "=4×9=36이므로 " + shapes.cross + "=6입니다.",
    family: "unit-q04-multiplicative-shapes",
    meta: { difficulty, shapes, values, result: 6 }
  });
}

function unitCyclicShapeValuesBook8({ difficulty = 2 } = {}) {
  const max = unitDifficultyMaxBook8(difficulty, 8, 12, 16);
  const [diamond, circle, square] = unitRandomDistinctBook8(3, 1, max);
  const pairSums = [diamond + square, square + circle, circle + diamond];
  return book8Problem({
    prompt: "같은 모양은 같은 수입니다. 세 식을 보고 ◇, ○, □가 나타내는 수를 각각 구하세요.",
    subtype: "symbol-equations",
    visual: {
      equations: [
        "◇+□=" + pairSums[0],
        "□+○=" + pairSums[1],
        "○+◇=" + pairSums[2]
      ],
      target: "◇, ○, □"
    },
    answer: "◇=" + diamond + ", ○=" + circle + ", □=" + square,
    solution: "세 식을 더하면 각 모양이 두 번씩 나타납니다. 따라서 ◇+○+□=" + ((pairSums[0] + pairSums[1] + pairSums[2]) / 2) + "이고, 각 식에 대입하면 ◇=" + diamond + ", ○=" + circle + ", □=" + square + "입니다.",
    family: "unit-q05-cyclic-shape-sums",
    meta: { difficulty, values: { diamond, circle, square }, pairSums }
  });
}

function unitThreeDigitAdditionSolutionsBook8({ unit, bottomHundreds, resultHundreds, resultUnits }) {
  const solutions = [];
  for (let circle = 1; circle <= 9; circle += 1) {
    for (let square = 0; square <= 9; square += 1) {
      for (let diamond = 0; diamond <= 9; diamond += 1) {
        if (new Set([circle, square, diamond, unit, bottomHundreds, resultHundreds, resultUnits]).size !== 7) continue;
        const left = 100 * circle + 10 * square + unit;
        const right = 100 * bottomHundreds + 11 * diamond;
        const result = 100 * resultHundreds + 10 * circle + resultUnits;
        if (unit + diamond < 10 || square + diamond + 1 < 10) continue;
        if (left + right === result) solutions.push({ circle, square, diamond });
      }
    }
  }
  return solutions;
}

function unitShapeAdditionCryptarithmBook8({ difficulty = 2 } = {}) {
  for (let attempt = 0; attempt < 1200; attempt += 1) {
    const fixed = shuffle(UNIT_DIGITS_BOOK8);
    const unit = fixed[0];
    const bottomHundreds = fixed.find((value) => value !== unit && value !== 0);
    const resultHundreds = fixed.find((value) => value !== unit && value !== bottomHundreds && value !== 0);
    const resultUnits = fixed.find((value) => value !== unit && value !== bottomHundreds && value !== resultHundreds);
    if ([unit, bottomHundreds, resultHundreds, resultUnits].some((value) => value === undefined)) continue;
    const solutions = unitThreeDigitAdditionSolutionsBook8({ unit, bottomHundreds, resultHundreds, resultUnits });
    if (solutions.length !== 1) continue;
    const { circle, square, diamond } = solutions[0];
    const sumOfShapes = circle + square + diamond;
    const easyKnown = difficulty === 1 ? `○=${circle}입니다. ` : "";
    const hardTarget = difficulty === 3 ? " 세 도형이 나타내는 수의 합도 구하세요." : "";
    const answer = difficulty === 3
      ? `○=${circle}, □=${square}, ◇=${diamond}, 합=${sumOfShapes}`
      : `○=${circle}, □=${square}, ◇=${diamond}`;
    return book8Problem({
      prompt: easyKnown + "같은 도형은 같은 수입니다. 빈칸에 알맞은 수를 넣어 계산을 완성하세요." + hardTarget,
      subtype: "vertical",
      visual: { top: "○□" + unit, bottom: bottomHundreds + "◇◇", operator: "+", result: resultHundreds + "○" + resultUnits, note: difficulty === 1 ? `○=${circle}` : difficulty === 3 ? "○+□+◇도 구합니다." : "같은 도형은 같은 수입니다." },
      answer,
      solution: circle + "" + square + unit + "+" + bottomHundreds + diamond + diamond + "=" + resultHundreds + circle + resultUnits + "이므로 ○=" + circle + ", □=" + square + ", ◇=" + diamond + (difficulty === 3 ? `이고 합은 ${sumOfShapes}` : "") + "입니다.",
      family: "unit-q06-shape-addition",
      meta: { difficulty, unit, bottomHundreds, resultHundreds, resultUnits, circle, square, diamond, sumOfShapes, solutions }
    });
  }
  throw new Error("unit-q06 shape addition generation failed");
}

function unitThreeAddendBlankSumBook8({ difficulty = 2 } = {}) {
  const easyTop = difficulty === 1 ? randomInt(1, 9) : null;
  const total = difficulty === 1
    ? 199 - 9 * easyTop
    : randomInt(difficulty === 3 ? 204 : 198, difficulty === 3 ? 207 : 203);
  const candidates = [];
  for (let top = 1; top <= 9; top += 1) for (let firstTens = 1; firstTens <= 9; firstTens += 1) for (let firstUnits = 0; firstUnits <= 9; firstUnits += 1) for (let secondTens = 1; secondTens <= 9; secondTens += 1) for (let secondUnits = 0; secondUnits <= 9; secondUnits += 1) {
    if (difficulty === 1 && top !== easyTop) continue;
    if (top + 10 * firstTens + firstUnits + 10 * secondTens + secondUnits !== total) continue;
    candidates.push([top, firstTens, firstUnits, secondTens, secondUnits]);
  }
  if (!candidates.length) throw new Error("unit-q07 blank sum has no candidate");
  const [top, firstTens, firstUnits, secondTens, secondUnits] = sample(candidates);
    const digitSum = top + firstTens + firstUnits + secondTens + secondUnits;
    const knownTop = difficulty === 1 ? String(top) : "□";
    const extraCondition = difficulty === 3 ? " 일의 자리와 십의 자리에서 모두 받아올림이 생깁니다." : "";
    return book8Problem({
    prompt: knownTop + " + □□ + □□ = " + numberObject(total) + " 만들도록 빈칸에 수를 넣을 때, 들어가는 숫자의 합을 구하세요." + extraCondition,
      subtype: "symbol-equations",
      visual: { equations: [knownTop + " + □□ + □□ = " + total], target: difficulty === 1 ? "모든 숫자의 합" : "빈칸 숫자의 합", ...(difficulty === 3 ? { note: "두 자리 모두 받아올림" } : {}) },
      answer: digitSum,
      solution: "빈칸의 숫자는 " + top + ", " + firstTens + ", " + firstUnits + ", " + secondTens + ", " + secondUnits + "입니다. 모두 더하면 " + digitSum + "입니다.",
      family: "unit-q07-three-addend-blank-sum",
      meta: { difficulty, digits: [top, firstTens, firstUnits, secondTens, secondUnits], total, result: digitSum, candidateCount: candidates.length }
    });
}

function unitQ08SolutionsBook8(total) {
  const solutions = [];
  for (let diamond = 1; diamond <= 9; diamond += 1) {
    for (let plus = 0; plus <= 9; plus += 1) {
      for (let circle = 0; circle <= 9; circle += 1) {
        for (let square = 0; square <= 9; square += 1) {
          if (new Set([diamond, plus, circle, square]).size !== 4) continue;
          const value = 1000 * diamond + 100 * plus + 10 * circle + square + 20 * circle + 2 * square;
          if (value === total) solutions.push({ diamond, plus, circle, square });
        }
      }
    }
  }
  return solutions;
}

function unitMultiAddendShapeCryptarithmBook8({ difficulty = 2 } = {}) {
  for (let attempt = 0; attempt < 600; attempt += 1) {
    const [diamond, plus, circle, square] = unitRandomDistinctBook8(4, 0, 9);
    if (diamond === 0) continue;
    const total = 1000 * diamond + 100 * plus + 30 * circle + 3 * square;
    const solutions = unitQ08SolutionsBook8(total);
    if (solutions.length !== 1) continue;
    const shapeSum = diamond + plus + circle + square;
    const hardTarget = difficulty === 3 ? " 네 도형이 나타내는 수의 합도 구하세요." : "";
    const answer = difficulty === 3
      ? `◇=${diamond}, ✚=${plus}, ○=${circle}, □=${square}, 합=${shapeSum}`
      : `◇=${diamond}, ✚=${plus}, ○=${circle}, □=${square}`;
    return book8Problem({
      prompt: (difficulty === 1 ? `◇=${diamond}, ✚=${plus}입니다. ` : "") + "같은 도형은 같은 수입니다. ◇✚○□+○□+○□의 값을 구하세요." + hardTarget,
      subtype: "symbol-equations",
      visual: { equations: ["◇✚○□ + ○□ + ○□ = " + total, ...(difficulty === 1 ? [`◇=${diamond}, ✚=${plus}`] : [])], target: difficulty === 3 ? "네 도형과 그 합" : "◇, ✚, ○, □" },
      answer,
      solution: "○□가 두 번 더해지므로 전체 식은 " + total + "입니다. 각 도형을 대입하면 ◇=" + diamond + ", ✚=" + plus + ", ○=" + circle + ", □=" + square + (difficulty === 3 ? `이고 합은 ${shapeSum}` : "") + "입니다.",
      family: "unit-q08-three-addend-cryptarithm",
      meta: { difficulty, values: { diamond, plus, circle, square }, total, shapeSum, solutions }
    });
  }
  throw new Error("unit-q08 cryptarithm generation failed");
}

function unitQ09SolutionsBook8() {
  const solutions = [];
  for (let circle = 1; circle <= 9; circle += 1) {
    for (let heart = 0; heart <= 9; heart += 1) {
      for (let diamond = 0; diamond <= 9; diamond += 1) {
        for (let star = 1; star <= 9; star += 1) {
          for (let square = 0; square <= 9; square += 1) {
            if (new Set([circle, heart, diamond, star, square]).size !== 5) continue;
            if (100 * circle + 10 * heart + diamond + 10 * diamond + star === 1000 * star + 100 * square + 10 * square + circle) {
              solutions.push({ circle, heart, diamond, star, square });
            }
          }
        }
      }
    }
  }
  return solutions;
}

function unitCarryShapeCryptarithmBook8({ difficulty = 2 } = {}) {
  const solutions = unitQ09SolutionsBook8();
  if (solutions.length !== 1) throw new Error("unit-q09 cryptarithm rule is not unique");
  const { circle, heart, diamond, star, square } = solutions[0];
  const askCombinedValue = difficulty === 3;
  const equations = ["○♥◇ + ◇☆ = ☆□□○"];
  if (difficulty === 1) equations.push("○=9, ◇=8, ☆=1");
  if (askCombinedValue) equations.push("○ + ♥ = ?");
  const result = askCombinedValue ? circle + heart : heart;
  const target = askCombinedValue ? "○+♥" : "♥";
  const prompt = difficulty === 1
    ? "○=9, ◇=8, ☆=1을 알고 있습니다. 같은 도형은 같은 수이고 서로 다른 도형은 서로 다른 수입니다. ○♥◇+◇☆=☆□□○에서 ♥가 나타내는 수를 구하세요."
    : askCombinedValue
      ? "같은 도형은 같은 수이고 서로 다른 도형은 서로 다른 수입니다. ○♥◇+◇☆=☆□□○를 만족할 때 ○와 ♥가 나타내는 수의 합을 구하세요."
      : "같은 도형은 같은 수이고 서로 다른 도형은 서로 다른 수입니다. ○♥◇+◇☆=☆□□○에서 ♥가 나타내는 수를 구하세요.";
  return book8Problem({
    prompt,
    subtype: "symbol-equations",
    visual: { equations, target },
    answer: result,
    solution: "일의 자리, 십의 자리, 백의 자리를 차례로 비교하면 ○=" + circle + ", ♥=" + heart + ", ◇=" + diamond + ", ☆=" + star + ", □=" + square + "입니다. 따라서 " + target + "=" + result + "입니다.",
    family: "unit-q09-five-symbol-cryptarithm",
    meta: { difficulty, values: { circle, heart, diamond, star, square }, solutions, ask: askCombinedValue ? "circlePlusHeart" : "heart", result }
  });
}

function unitRepeatedResultSolutionsBook8(firstHundreds, secondUnits) {
  const solutions = [];
  for (let circle = 1; circle <= 9; circle += 1) {
    for (let square = 0; square <= 9; square += 1) {
      for (let diamond = 1; diamond <= 9; diamond += 1) {
        if (new Set([firstHundreds, secondUnits, circle, square, diamond]).size !== 5) continue;
        if (100 * firstHundreds + 10 * square + circle + 10 * circle + secondUnits === 111 * diamond) {
          solutions.push({ circle, square, diamond });
        }
      }
    }
  }
  return solutions;
}

function unitRepeatedResultCryptarithmBook8({ difficulty = 2 } = {}) {
  for (let attempt = 0; attempt < 1000; attempt += 1) {
    const firstHundreds = randomInt(1, 9);
    const secondUnits = randomInt(0, 9);
    if (firstHundreds === secondUnits) continue;
    const solutions = unitRepeatedResultSolutionsBook8(firstHundreds, secondUnits);
    if (solutions.length !== 1) continue;
    const { circle, square, diamond } = solutions[0];
    const shapeSum = circle + square + diamond;
    const answer = difficulty === 3
      ? `○=${circle}, □=${square}, ◇=${diamond}, 합=${shapeSum}`
      : `○=${circle}, □=${square}, ◇=${diamond}`;
    return book8Problem({
      prompt: (difficulty === 1 ? `◇=${diamond}입니다. ` : "") + "같은 도형은 같은 수입니다. " + firstHundreds + "□○+○" + secondUnits + "=◇◇◇를 만족하는 ○, □, ◇를 구하세요." + (difficulty === 3 ? " 세 도형의 합도 구하세요." : ""),
      subtype: "vertical",
      visual: { top: firstHundreds + "□○", bottom: "○" + secondUnits, operator: "+", result: "◇◇◇", note: difficulty === 1 ? `◇=${diamond}` : difficulty === 3 ? "○+□+◇도 구합니다." : "같은 도형은 같은 수입니다." },
      answer,
      solution: firstHundreds + square + circle + "+" + circle + secondUnits + "=" + diamond + diamond + diamond + "이므로 ○=" + circle + ", □=" + square + ", ◇=" + diamond + (difficulty === 3 ? `이고 합은 ${shapeSum}` : "") + "입니다.",
      family: "unit-q10-repeated-result",
      meta: { difficulty, firstHundreds, secondUnits, circle, square, diamond, shapeSum, solutions }
    });
  }
  throw new Error("unit-q10 repeated result generation failed");
}

function unitAgeSumDifferenceBook8({ difficulty = 2 } = {}) {
  const younger = randomInt(5, unitDifficultyMaxBook8(difficulty, 9, 13, 18));
  const difference = randomInt(2, difficulty === 3 ? 8 : 5);
  const older = younger + difference;
  const total = younger + older;
  return book8Problem({
    prompt: "두 사람의 나이 합은 " + total + "살이고, 형은 동생보다 " + difference + "살 많습니다. 두 사람의 나이를 각각 구하세요.",
    subtype: "bars",
    visual: { bars: [{ label: "동생", units: 1 }, { label: "형", units: 1, offset: difference }], facts: ["합 " + total + "살", "차 " + difference + "살"] },
    answer: "동생 " + younger + "살, 형 " + older + "살",
    solution: "합에서 차를 빼면 동생 나이의 두 배입니다. (" + total + "-" + difference + ")÷2=" + younger + "살이므로 형은 " + older + "살입니다.",
    family: "unit-q12-age-sum-difference",
    meta: { difficulty, younger, older, difference, total }
  });
}

function unitTableDifferenceBook8({ difficulty = 2 } = {}) {
  const unknown = randomInt(5, unitDifficultyMaxBook8(difficulty, 10, 18, 25));
  const difference = randomInt(2, difficulty === 3 ? 7 : 5);
  const first = randomInt(8, 20);
  const third = randomInt(5, 14);
  const fourth = randomInt(7, 16);
  const second = unknown + difference;
  const total = first + second + third + fourth + unknown;
  return book8Problem({
    prompt: "다섯 명이 모은 수를 표로 나타냈습니다. B는 E보다 " + difference + "만큼 많고, 모두 합하면 " + total + "입니다. E를 구하세요.",
    subtype: "table",
    visual: {
      headers: ["이름", "A", "B", "C", "D", "E", "합계"],
      rows: [["수", String(first), "?", String(third), String(fourth), "?", String(total)]],
      notes: ["B는 E보다 " + difference + "만큼 많습니다."]
    },
    answer: unknown,
    solution: "B와 E를 합하면 " + (total - first - third - fourth) + "입니다. E+(E+" + difference + ")=" + (total - first - third - fourth) + "이므로 E=" + unknown + "입니다.",
    family: "unit-q13-table-total-difference",
    meta: { difficulty, first, second, third, fourth, unknown, difference, total }
  });
}

function unitDifferenceMultipleBothBook8({ difficulty = 2 } = {}) {
  const girls = randomInt(4, unitDifficultyMaxBook8(difficulty, 8, 12, 18));
  const multiplier = difficulty === 1 ? 3 : difficulty === 3 ? 5 : 4;
  const boys = girls * multiplier;
  const difference = boys - girls;
  return book8Problem({
    prompt: "남학생 수는 여학생 수의 " + multiplier + "배이고, 남학생이 여학생보다 " + difference + "명 많습니다. 남학생과 여학생 수를 각각 구하세요.",
    subtype: "bars",
    visual: { bars: [{ label: "여학생", units: 1 }, { label: "남학생", units: multiplier }], facts: ["차 " + difference + "명"] },
    answer: "남학생 " + boys + "명, 여학생 " + girls + "명",
    solution: "남학생과 여학생의 차는 여학생 " + (multiplier - 1) + "명분입니다. " + difference + "÷" + (multiplier - 1) + "=" + girls + "명이므로 남학생은 " + boys + "명입니다.",
    family: "unit-q14-difference-multiple-both",
    meta: { difficulty, boys, girls, multiplier, difference }
  });
}

function unitSumMultipleOffsetBothBook8({ difficulty = 2 } = {}) {
  const smaller = randomInt(5, unitDifficultyMaxBook8(difficulty, 9, 14, 20));
  const multiplier = difficulty === 1 ? 2 : difficulty === 3 ? 4 : 3;
  const offset = randomInt(2, difficulty === 3 ? 7 : 4);
  const larger = smaller * multiplier + offset;
  const total = smaller + larger;
  return book8Problem({
    prompt: "큰 수는 작은 수의 " + multiplier + "배보다 " + offset + "만큼 많고, 두 수의 합은 " + total + "입니다. 두 수를 각각 구하세요.",
    subtype: "bars",
    visual: { bars: [{ label: "작은 수", units: 1 }, { label: "큰 수", units: multiplier, offset }], facts: ["합 " + total] },
    answer: "작은 수 " + smaller + ", 큰 수 " + larger,
    solution: "큰 수에서 작은 수 " + multiplier + "배와 " + numberObject(offset) + " 생각하면, 합은 작은 수 " + (multiplier + 1) + "배+" + offset + "입니다. (" + total + "-" + offset + ")÷" + (multiplier + 1) + "=" + smaller + "이므로 큰 수는 " + larger + "입니다.",
    family: "unit-q15-sum-multiple-offset-both",
    meta: { difficulty, smaller, larger, multiplier, offset, total }
  });
}

function unitReverseThreeEventsBook8({ difficulty = 2 } = {}) {
  const start = randomInt(18, unitDifficultyMaxBook8(difficulty, 30, 42, 60));
  const gave = randomInt(2, 7);
  const received = randomInt(3, 9);
  const gaveAgain = randomInt(2, 6);
  const final = start - gave + received - gaveAgain;
  return book8Problem({
    prompt: "어떤 수에서 " + gave + "만큼 빼고 " + received + "만큼 더한 뒤 다시 " + gaveAgain + "만큼 빼었더니 최종값은 " + final + "입니다. 처음 수를 구하세요.",
    subtype: "process",
    visual: { start: "?", steps: ["-" + gave, "+" + received, "-" + gaveAgain], result: final },
    answer: start,
    solution: "마지막 수에 마지막으로 뺀 수를 더하고, 더한 수를 빼고, 처음 뺀 수를 더합니다. " + final + "+" + gaveAgain + "-" + received + "+" + gave + "=" + start + "입니다.",
    family: "unit-q16-reverse-three-events",
    meta: { difficulty, start, gave, received, gaveAgain, final }
  });
}

function unitGiveAsMuchOnceBook8({ difficulty = 2 } = {}) {
  const problem = giveAsMuchOnceBook8({ difficulty });
  const { first, second, after } = problem.meta;
  return {
    ...problem,
    prompt: difficulty === 1
      ? "지우가 처음 " + second + "개를 가졌습니다. 민수가 지우에게 " + second + "개를 주었더니 민수에게 " + after[0] + "개가 남았습니다. 민수가 처음 가진 수를 구하세요."
      : difficulty === 3
        ? "민수가 지우에게 지우가 가진 만큼 주었습니다. 준 뒤 지우는 " + after[1] + "개, 민수는 " + after[0] + "개가 되었습니다. 민수가 처음 가진 수를 구하세요."
        : "민수가 지우에게 지우가 가진 만큼 주었더니 민수에게 " + after[0] + "개가 남았습니다. 지우가 처음 가진 수가 " + second + "개일 때 민수가 처음 가진 수를 구하세요.",
    visual: {
      ...problem.visual,
      people: difficulty === 3 ? [{ label: "민수(준 뒤)", value: after[0] }, { label: "지우(준 뒤)", value: after[1] }] : [{ label: "민수", value: "?" }, { label: "지우", value: second }],
      steps: [difficulty === 1 ? `민수→지우 ${second}개` : "민수가 지우가 가진 만큼 줌"]
    },
    solution: "민수는 지우가 가진 " + second + "개를 주고 " + after[0] + "개가 남았으므로 처음에는 " + after[0] + "+" + second + "=" + first + "개입니다."
  };
}

function unitFractionDifferenceSubgroupBook8({ difficulty = 2 } = {}) {
  const denominator = difficulty === 1 ? 6 : difficulty === 3 ? 10 : 8;
  const high = denominator - 2;
  const low = 2;
  const unit = randomInt(3, difficulty === 3 ? 9 : 6);
  const highGroup = high * unit;
  const lowGroup = low * unit;
  const difference = highGroup - lowGroup;
  return book8Problem({
    prompt: "남학생은 전체의 " + high + "/" + denominator + ", 여학생은 전체의 " + low + "/" + denominator + "입니다. 남학생이 여학생보다 " + difference + "명 많을 때 남학생은 몇 명인가요?",
    subtype: "fraction-pair",
    visual: { denominators: [denominator, denominator], numerators: [high, low], difference },
    answer: highGroup + "명",
    solution: "두 모둠의 분수 차는 " + (high - low) + "/" + denominator + "입니다. 이 차가 " + difference + "명이므로 한 조각은 " + unit + "명이고, 남학생은 " + high + "×" + unit + "=" + highGroup + "명입니다.",
    family: "unit-q20-fraction-difference-subgroup",
    meta: { difficulty, denominator, high, low, unit, highGroup, lowGroup, difference }
  });
}

function unitFractionGivenAwayBook8({ difficulty = 2, action = "사용" } = {}) {
  const profile = difficulty === 1
    ? { denominator: 4, numerator: 1, unitMin: 3, unitMax: 6 }
    : difficulty === 3
      ? { denominator: 8, numerator: 3, unitMin: 6, unitMax: 11 }
      : { denominator: 6, numerator: 2, unitMin: 4, unitMax: 8 };
  const unit = randomInt(profile.unitMin, profile.unitMax);
  const original = profile.denominator * unit;
  const given = profile.numerator * unit;
  const remaining = original - given;
  const actionText = action === "사용" ? "사용했더니" : "주었더니";
  const easyClue = difficulty === 1 ? ` 한 조각은 ${unit}개입니다.` : "";
  const hardAsk = difficulty === 3 ? " 사용하거나 준 수와 처음 수도 모두 구하세요." : " 처음 수를 구하세요.";
  const answer = difficulty === 3 ? `처음 수 ${original}개, ${action === "사용" ? "사용한" : "준"} 수 ${given}개` : `${original}개`;
  return book8Problem({
    prompt: `전체의 ${fractionText(profile.numerator, profile.denominator)}만큼 ${actionText} ${remaining}개가 남았습니다.${easyClue}${hardAsk}`,
    subtype: "fraction",
    visual: { denominator: profile.denominator, numerator: profile.denominator - profile.numerator, whole: "?", label: "남은 부분", shownValue: remaining, ...(difficulty === 1 ? { unitValue: unit } : {}) },
    answer,
    solution: `남은 부분은 전체의 ${fractionText(profile.denominator - profile.numerator, profile.denominator)}입니다. ${remaining}÷${profile.denominator - profile.numerator}=${unit}개가 한 조각이므로 전체는 ${unit}×${profile.denominator}=${original}개이고, ${action === "사용" ? "사용한" : "준"} 수는 ${given}개입니다.`,
    family: "fraction-given-away-b8",
    meta: { difficulty, denominator: profile.denominator, numerator: profile.numerator, unit, original, given, remaining, result: original, action }
  });
}

function unitFractionUsedOriginalBook8({ difficulty = 2 } = {}) {
  return unitFractionGivenAwayBook8({ difficulty, action: "사용" });
}

function unitFractionGivenOriginalBook8({ difficulty = 2 } = {}) {
  return unitFractionGivenAwayBook8({ difficulty, action: "나눔" });
}

function unitLetterPyramidBook8({ difficulty = 2 } = {}) {
  for (let attempt = 0; attempt < 300; attempt += 1) {
    const [a, b, c, d] = unitRandomDistinctBook8(4, 0, 9);
    if (a === 0) continue;
    const total = a + (10 * a + b) + (100 * a + 10 * b + c) + (1000 * a + 100 * b + 10 * c + d);
    const solutions = [];
    for (let aa = 1; aa <= 9; aa += 1) {
      for (let bb = 0; bb <= 9; bb += 1) {
        for (let cc = 0; cc <= 9; cc += 1) {
          for (let dd = 0; dd <= 9; dd += 1) {
            if (new Set([aa, bb, cc, dd]).size !== 4) continue;
            const candidate = aa + (10 * aa + bb) + (100 * aa + 10 * bb + cc) + (1000 * aa + 100 * bb + 10 * cc + dd);
            if (candidate === total) solutions.push({ a: aa, b: bb, c: cc, d: dd });
          }
        }
      }
    }
    if (solutions.length !== 1) continue;
    const number = 1000 * a + 100 * b + 10 * c + d;
    const digitSum = a + b + c + d;
    const answer = difficulty === 3 ? `ABCD=${number}, 숫자의 합=${digitSum}` : number;
    return book8Problem({
      prompt: (difficulty === 1 ? `A=${a}입니다. ` : "") + "A, B, C, D는 서로 다른 숫자입니다. A+AB+ABC+ABCD=" + total + "일 때 ABCD를 구하세요." + (difficulty === 3 ? " A, B, C, D의 합도 구하세요." : ""),
      subtype: "symbol-equations",
      visual: { equations: ["A", "AB", "ABC", "ABCD", "A + AB + ABC + ABCD = " + total, ...(difficulty === 1 ? [`A=${a}`] : [])], target: difficulty === 3 ? "ABCD와 숫자의 합" : "ABCD" },
      answer,
      solution: "천의 자리부터 자리값을 비교하면 A=" + a + ", B=" + b + ", C=" + c + ", D=" + d + "입니다. 따라서 ABCD=" + number + (difficulty === 3 ? `이고 숫자의 합은 ${digitSum}` : "") + "입니다.",
      family: "unit-q22-letter-pyramid",
      meta: { difficulty, values: { a, b, c, d }, total, number, digitSum, solutions }
    });
  }
  throw new Error("unit-q22 letter pyramid generation failed");
}

function unitPairEqualizeChainBook8({ difficulty = 2 } = {}) {
  const giveToB = difficulty === 1 ? 1 : randomInt(1, difficulty === 3 ? 4 : 2);
  const giveToC = difficulty === 1 ? 2 : randomInt(1, difficulty === 3 ? 5 : 3);
  const middle = randomInt(8, unitDifficultyMaxBook8(difficulty, 14, 20, 28));
  const first = middle + 2 * giveToB;
  const third = middle - 2 * giveToC;
  const total = first + middle + third;
  return book8Problem({
    prompt: "가가 나에게 " + giveToB + "개를 주면 가와 나의 수가 같아지고, 나가 다에게 " + giveToC + "개를 주면 나와 다의 수가 같아집니다. 가와 다의 합이 " + (first + third) + "개일 때 나의 처음 수를 구하세요.",
    subtype: "transfer",
    visual: { people: [{ label: "민수", value: "?" }, { label: "지우", value: "?" }, { label: "하준", value: "?" }], steps: ["민수→지우 " + giveToB + "개 후 같음", "지우→하준 " + giveToC + "개 후 같음"], total: total },
    answer: "지우 " + middle + "개",
    solution: "민수의 처음 수는 지우보다 " + (2 * giveToB) + "개 많고, 하준의 처음 수는 지우보다 " + (2 * giveToC) + "개 적습니다. 민수와 하준의 합은 지우의 두 배+" + (2 * giveToB - 2 * giveToC) + "이므로 지우는 " + middle + "개입니다.",
    family: "unit-q23-pair-equalize-chain",
    meta: { difficulty, giveToB, giveToC, first, middle, third, total }
  });
}

function unitThreeBagTransferConditionBook8({ difficulty = 2 } = {}) {
  const [minimum, maximum] = difficulty === 1 ? [5, 8] : difficulty === 3 ? [13, 18] : [9, 12];
  const afterEqual = randomInt(minimum, maximum);
  const initial = [afterEqual + 1, 2 * afterEqual - 1, afterEqual];
  const total = sum(initial);
  return book8Problem({
    prompt: "세 주머니에 모두 " + total + "개가 있습니다. 가에서 나로 1개를 옮겼더니 가와 다의 수가 같아졌고, 그때 나의 수는 가와 다의 수의 합과 같았습니다. 처음 가, 나, 다의 수를 구하세요.",
    subtype: "transfer",
    visual: { people: [{ label: "첫째 주머니", value: "?" }, { label: "둘째 주머니", value: "?" }, { label: "셋째 주머니", value: "?" }], steps: ["첫째→둘째 1개", "옮긴 뒤 첫째=셋째", "옮긴 뒤 둘째=첫째+셋째"], total },
    answer: "첫째 " + initial[0] + "개, 둘째 " + initial[1] + "개, 셋째 " + initial[2] + "개",
    solution: "옮긴 뒤 첫째와 셋째는 각각 " + afterEqual + "개입니다. 둘째의 옮긴 뒤 수는 " + (2 * afterEqual) + "개이므로 처음 둘째는 1개를 빼서 " + initial[1] + "개입니다. 처음 첫째는 1개를 더해 " + initial[0] + "개입니다.",
    family: "unit-q24-three-bag-transfer",
    meta: { difficulty, afterEqual, initial, total }
  });
}

function unitFractionSubgroupFromWholeBook8({ difficulty = 2 } = {}) {
  const configuration = difficulty === 1
    ? { denominator: 6, boysNumerator: 4, girlsNumerator: 2, boyPartNumerator: 1, boyPartDenominator: 2, girlPartNumerator: 1, girlPartDenominator: 2, unit: 3 }
    : difficulty === 3
      ? { denominator: 12, boysNumerator: 7, girlsNumerator: 5, boyPartNumerator: 2, boyPartDenominator: 5, girlPartNumerator: 3, girlPartDenominator: 5, unit: 5 }
      : { denominator: 9, boysNumerator: 5, girlsNumerator: 4, boyPartNumerator: 1, boyPartDenominator: 3, girlPartNumerator: 1, girlPartDenominator: 4, unit: 6 };
  const { denominator, boysNumerator, girlsNumerator, boyPartNumerator, boyPartDenominator, girlPartNumerator, girlPartDenominator, unit } = configuration;
  const boys = boysNumerator * unit;
  const girls = girlsNumerator * unit;
  const total = boys + girls;
  const boySiblings = boys * boyPartNumerator / boyPartDenominator;
  const girlSiblings = girls * girlPartNumerator / girlPartDenominator;
  const result = boySiblings + girlSiblings;
  const boyFraction = fractionText(boysNumerator, denominator);
  const girlFraction = fractionText(girlsNumerator, denominator);
  const boyPart = fractionText(boyPartNumerator, boyPartDenominator);
  const girlPart = fractionText(girlPartNumerator, girlPartDenominator);
  return book8Problem({
    prompt: "전체 학생 중 남학생은 " + boyFraction + ", 여학생은 " + girlFraction + "입니다. 남학생 중 " + boyPart + "에 해당하는 학생과 여학생 중 " + girlPart + "에 해당하는 학생에게 형제자매가 있을 때 형제자매가 있는 학생은 모두 몇 명인가요?",
    subtype: "fraction-pair",
    visual: { denominators: [denominator, denominator], numerators: [boysNumerator, girlsNumerator], totals: [boys, girls], difference: boys - girls },
    answer: result + "명",
    solution: "남학생은 " + boys + "명, 여학생은 " + girls + "명입니다. 남학생 중 " + boySiblings + "명(" + boyPart + "), 여학생 중 " + girlSiblings + "명(" + girlPart + ")이므로 모두 " + result + "명입니다.",
    family: "unit-q25-fraction-subgroups",
    meta: { difficulty, unit, denominator, boysNumerator, girlsNumerator, boyPartNumerator, boyPartDenominator, girlPartNumerator, girlPartDenominator, boys, girls, total, boySiblings, girlSiblings, result }
  });
}

export const BOOK08_UNIT_TEST_GENERATORS = Object.freeze({
  1: unitBalanceThreeTargetsBook8,
  2: unitFourByFourShapeSumQ02Book8,
  3: unitFourByFourProductPlacementBook8,
  4: unitMultiplicativeShapeSystemBook8,
  5: unitCyclicShapeValuesBook8,
  6: unitShapeAdditionCryptarithmBook8,
  7: unitThreeAddendBlankSumBook8,
  8: unitMultiAddendShapeCryptarithmBook8,
  9: unitCarryShapeCryptarithmBook8,
  10: unitRepeatedResultCryptarithmBook8,
  11: equalizeTransferBook8,
  12: unitAgeSumDifferenceBook8,
  13: unitTableDifferenceBook8,
  14: unitDifferenceMultipleBothBook8,
  15: unitSumMultipleOffsetBothBook8,
  16: unitReverseThreeEventsBook8,
  17: unitGiveAsMuchOnceBook8,
  18: unitFractionUsedOriginalBook8,
  19: unitFractionGivenOriginalBook8,
  20: unitFractionDifferenceSubgroupBook8,
  21: unitFourByFourShapeSumQ21Book8,
  22: unitLetterPyramidBook8,
  23: unitPairEqualizeChainBook8,
  24: unitThreeBagTransferConditionBook8,
  25: unitFractionSubgroupFromWholeBook8
});

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
  fractionSubgroupCountBook8,
  unitBalanceThreeTargetsBook8,
  unitFourByFourShapeSumBook8,
  unitFourByFourShapeSumQ02Book8,
  unitFourByFourShapeSumQ21Book8,
  unitFourByFourProductPlacementBook8,
  unitMultiplicativeShapeSystemBook8,
  unitCyclicShapeValuesBook8,
  unitShapeAdditionCryptarithmBook8,
  unitThreeAddendBlankSumBook8,
  unitMultiAddendShapeCryptarithmBook8,
  unitCarryShapeCryptarithmBook8,
  unitRepeatedResultCryptarithmBook8,
  unitAgeSumDifferenceBook8,
  unitTableDifferenceBook8,
  unitDifferenceMultipleBothBook8,
  unitSumMultipleOffsetBothBook8,
  unitReverseThreeEventsBook8,
  unitGiveAsMuchOnceBook8,
  unitFractionDifferenceSubgroupBook8,
  unitLetterPyramidBook8,
  unitPairEqualizeChainBook8,
  unitThreeBagTransferConditionBook8,
  unitFractionSubgroupFromWholeBook8,
  BOOK08_UNIT_TEST_GENERATORS
});
