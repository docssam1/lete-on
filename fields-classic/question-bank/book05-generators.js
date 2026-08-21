// 더클래식 1과정 5권 전용 생성기.
// 원본 페이지를 복제하지 않고, 단계와 인쇄 문제 번호로 확인한 풀이 구조만 재현한다.

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

const sum = (items) => items.reduce((total, value) => total + value, 0);
const product = (items) => items.reduce((total, value) => total * value, 1);
const triangular = (number) => (number * (number + 1)) / 2;
const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];
const MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function snakePath(rows, columns, reverseRows = false) {
  const path = [];
  for (let row = 0; row < rows; row += 1) {
    const columnsInRow = Array.from({ length: columns }, (_, column) => column);
    if ((row + Number(reverseRows)) % 2) columnsInRow.reverse();
    columnsInRow.forEach((column) => path.push([row, column]));
  }
  return path;
}

function spiralPath(rows, columns) {
  const path = [];
  let top = 0;
  let bottom = rows - 1;
  let left = 0;
  let right = columns - 1;
  while (top <= bottom && left <= right) {
    for (let column = left; column <= right; column += 1) path.push([top, column]);
    top += 1;
    for (let row = top; row <= bottom; row += 1) path.push([row, right]);
    right -= 1;
    if (top <= bottom) {
      for (let column = right; column >= left; column -= 1) path.push([bottom, column]);
      bottom -= 1;
    }
    if (left <= right) {
      for (let row = bottom; row >= top; row -= 1) path.push([row, left]);
      left += 1;
    }
  }
  return path;
}

function diagonalPath(rows, columns, reverse = false) {
  const path = [];
  for (let diagonal = 0; diagonal <= rows + columns - 2; diagonal += 1) {
    const cells = [];
    for (let row = 0; row < rows; row += 1) {
      const column = diagonal - row;
      if (column >= 0 && column < columns) cells.push([row, column]);
    }
    if ((diagonal + Number(reverse)) % 2) cells.reverse();
    path.push(...cells);
  }
  return path;
}

function pathGridProblem(path, rows, columns, start, subtype, prompt, family) {
  const values = Array.from({ length: rows }, () => Array(columns).fill(null));
  path.forEach(([row, column], index) => { values[row][column] = start + index; });
  const targetIndex = randomInt(Math.max(2, Math.floor(path.length / 3)), path.length - 2);
  const target = { row: path[targetIndex][0], column: path[targetIndex][1], index: targetIndex };
  const clues = new Set([0, 1, path.length - 1, targetIndex - 1, targetIndex + 1]);
  if (path.length > 10) clues.add(Math.floor(path.length / 2));
  return {
    prompt,
    visual: { kind: "book5", subtype, rows, columns, path, values, target, clues: [...clues] },
    answer: String(start + targetIndex),
    solution: `화살표를 따라 ${start}부터 1씩 이어 쓰면 물음표 칸은 ${start + targetIndex}입니다.`,
    meta: { family, rows, columns, path, values, start, targetIndex, target, answer: start + targetIndex }
  };
}

function sequentialPathNumberGrid({ difficulty = 2 }) {
  const rows = difficulty === 1 ? 3 : 4;
  const columns = difficulty === 3 ? 5 : difficulty === 1 ? 3 : 4;
  const kind = difficulty === 1 ? "snake" : sample(["snake", "spiral"]);
  let path = kind === "spiral" ? spiralPath(rows, columns) : snakePath(rows, columns, Math.random() < 0.5);
  if (Math.random() < 0.5) path = [...path].reverse();
  const start = randomInt(1, difficulty === 3 ? 30 : 12);
  return pathGridProblem(path, rows, columns, start, "path-number-grid", "선을 따라 이어지는 수 배열에서 물음표 칸의 수를 구하세요.", "path-number-grid");
}

function diagonalFillNumberGrid({ difficulty = 2 }) {
  const rows = difficulty === 1 ? 3 : 4;
  const columns = difficulty === 3 ? 5 : 4;
  let path = diagonalPath(rows, columns, Math.random() < 0.5);
  if (difficulty === 3 && Math.random() < 0.5) path = [...path].reverse();
  const start = randomInt(1, difficulty === 3 ? 25 : 10);
  return pathGridProblem(path, rows, columns, start, "diagonal-number-grid", "대각선 방향으로 이어지는 규칙을 보고 물음표 칸의 수를 구하세요.", "diagonal-number-grid");
}

function lineCycleNumberTable({ difficulty = 2 }) {
  const lineCount = difficulty === 1 ? 3 : difficulty === 2 ? 4 : 5;
  const shown = difficulty === 1 ? 4 : 5;
  const start = randomInt(1, difficulty === 3 ? 20 : 8);
  const rows = Array.from({ length: lineCount }, (_, line) => Array.from({ length: shown }, (_, index) => start + line + index * lineCount));
  const targetLine = randomInt(0, lineCount - 1);
  const targetPosition = randomInt(shown + 1, shown + (difficulty === 3 ? 5 : 3));
  const answer = start + targetLine + (targetPosition - 1) * lineCount;
  return {
    prompt: `${lineCount}개의 줄에 수를 차례로 한 번씩 놓습니다. ${targetLine + 1}번 줄의 ${targetPosition}번째 수를 구하세요.`,
    visual: { kind: "book5", subtype: "line-cycle", rows, lineCount, targetLine, targetPosition },
    answer: String(answer),
    solution: `${targetLine + 1}번 줄에서는 ${lineCount}씩 커집니다. ${rows[targetLine][0]}에서 ${lineCount}씩 ${targetPosition - 1}번 이어 가면 ${answer}입니다.`,
    meta: { family: "line-cycle", lineCount, shown, start, rows, targetLine, targetPosition, answer }
  };
}

function fingerBounceSequence({ difficulty = 2 }) {
  const cycle = ["엄지", "검지", "중지", "약지", "새끼", "약지", "중지", "검지"];
  const position = randomInt(difficulty === 1 ? 9 : difficulty === 2 ? 18 : 35, difficulty === 1 ? 24 : difficulty === 2 ? 48 : 90);
  const answer = cycle[(position - 1) % cycle.length];
  return {
    prompt: `엄지부터 새끼손가락까지 갔다가 다시 엄지 쪽으로 돌아오며 수를 셉니다. ${position}을 말할 때 어느 손가락인가요?`,
    visual: { kind: "book5", subtype: "finger-bounce", cycle, position },
    answer,
    solution: `손가락 순서는 ${cycle.join(" → ")}이고 다시 반복됩니다. ${position}은 ${answer}에서 말합니다.`,
    meta: { family: "finger-bounce", cycle, position, cycleIndex: (position - 1) % cycle.length, answer }
  };
}

function calendarCells(days, firstWeekday) {
  const cells = Array(firstWeekday).fill(null);
  for (let day = 1; day <= days; day += 1) cells.push(day);
  while (cells.length % 7) cells.push(null);
  return cells;
}

function calendarMonthPosition({ difficulty = 2 }) {
  const month = randomInt(1, 12);
  const days = MONTH_DAYS[month - 1];
  const firstWeekday = randomInt(0, 6);
  const date = randomInt(difficulty === 1 ? 3 : 8, days - 2);
  const weekdayIndex = (firstWeekday + date - 1) % 7;
  const askDate = difficulty === 3 && Math.random() < 0.5;
  const week = Math.floor((firstWeekday + date - 1) / 7) + 1;
  const answer = askDate ? `${date}일` : `${WEEKDAYS[weekdayIndex]}요일`;
  return {
    prompt: askDate
      ? `${month}월 달력에서 ${week}번째 줄의 ${WEEKDAYS[weekdayIndex]}요일은 며칠인가요?`
      : `${month}월 ${date}일은 무슨 요일인가요?`,
    visual: { kind: "book5", subtype: "calendar", month, days, firstWeekday, cells: calendarCells(days, firstWeekday), targetDate: askDate ? null : date, targetWeekday: askDate ? weekdayIndex : null, hiddenDates: askDate ? [date] : [] },
    answer,
    solution: `달력의 첫 줄부터 같은 요일 칸을 따라가면 ${answer}입니다.`,
    meta: { family: "calendar-position", month, days, firstWeekday, date, weekdayIndex, week, askDate, answer }
  };
}

function calendarCrossMonthWeekday({ difficulty = 2 }) {
  const month = randomInt(1, 11);
  const days = MONTH_DAYS[month - 1];
  const firstWeekday = randomInt(0, 6);
  const sourceDate = randomInt(days - 8, days - 2);
  const offset = randomInt(difficulty === 1 ? 5 : 9, difficulty === 3 ? 24 : 16);
  const serial = sourceDate + offset;
  const targetMonth = serial <= days ? month : month + 1;
  const targetDate = serial <= days ? serial : serial - days;
  const weekdayIndex = (firstWeekday + sourceDate - 1 + offset) % 7;
  return {
    prompt: `${month}월 ${sourceDate}일에서 ${offset}일 뒤는 몇 월 며칠이며 무슨 요일인가요?`,
    visual: { kind: "book5", subtype: "calendar-pair", calendars: [
      { month, days, firstWeekday, cells: calendarCells(days, firstWeekday) },
      { month: month + 1, days: MONTH_DAYS[month], firstWeekday: (firstWeekday + days) % 7, cells: calendarCells(MONTH_DAYS[month], (firstWeekday + days) % 7) }
    ], sourceDate },
    answer: `${targetMonth}월 ${targetDate}일 ${WEEKDAYS[weekdayIndex]}요일`,
    solution: `${month}월의 마지막 날까지 먼저 센 뒤 남은 날을 다음 달에서 셉니다. 요일도 ${offset}칸 옮기면 ${targetMonth}월 ${targetDate}일 ${WEEKDAYS[weekdayIndex]}요일입니다.`,
    meta: { family: "calendar-cross-month", month, days, firstWeekday, sourceDate, offset, targetMonth, targetDate, weekdayIndex }
  };
}

function calendarSameWeekdaySum({ difficulty = 2 }) {
  const month = randomInt(1, 12);
  const days = MONTH_DAYS[month - 1];
  const firstWeekday = randomInt(0, 6);
  const weekdayIndex = randomInt(0, 6);
  const firstDate = ((weekdayIndex - firstWeekday + 7) % 7) + 1;
  const dates = [];
  for (let date = firstDate; date <= days; date += 7) dates.push(date);
  const pair = shuffle(dates).slice(0, 2).sort((a, b) => a - b);
  const hiddenSide = randomInt(0, 1);
  const shown = pair[1 - hiddenSide];
  const target = pair[hiddenSide];
  const pairSum = pair[0] + pair[1];
  return {
    prompt: `${month}월의 같은 ${WEEKDAYS[weekdayIndex]}요일인 두 날짜의 합이 ${pairSum}입니다. 한 날짜가 ${shown}일일 때 다른 날짜를 구하세요.`,
    visual: { kind: "book5", subtype: "calendar", month, days, firstWeekday, cells: calendarCells(days, firstWeekday), targetDate: shown, targetWeekday: weekdayIndex, hiddenDates: [target] },
    answer: `${target}일`,
    solution: `같은 요일 날짜는 7일씩 차이 납니다. 날짜의 합 ${pairSum}에서 ${shown}를 빼면 다른 날짜는 ${target}일입니다.`,
    meta: { family: "calendar-same-weekday", month, days, firstWeekday, weekdayIndex, dates, pair, shown, target, pairSum }
  };
}

function countPaths(rows, columns, blocked = new Set(), start = [0, 0], end = [rows - 1, columns - 1]) {
  const ways = Array.from({ length: rows }, () => Array(columns).fill(0));
  ways[start[0]][start[1]] = blocked.has(`${start[0]}:${start[1]}`) ? 0 : 1;
  for (let row = start[0]; row <= end[0]; row += 1) {
    for (let column = start[1]; column <= end[1]; column += 1) {
      if (row === start[0] && column === start[1]) continue;
      if (blocked.has(`${row}:${column}`)) continue;
      ways[row][column] = (row > start[0] ? ways[row - 1][column] : 0) + (column > start[1] ? ways[row][column - 1] : 0);
    }
  }
  return ways[end[0]][end[1]];
}

function shortestPathRectangle({ difficulty = 2 }) {
  const rows = difficulty === 1 ? randomInt(2, 3) : difficulty === 2 ? randomInt(3, 4) : randomInt(4, 5);
  const columns = difficulty === 1 ? randomInt(2, 3) : difficulty === 2 ? randomInt(3, 4) : randomInt(4, 5);
  const answer = countPaths(rows + 1, columns + 1);
  return {
    prompt: `출발점에서 도착점까지 오른쪽이나 아래쪽으로만 움직이는 가장 짧은 길은 모두 몇 가지인가요?`,
    visual: { kind: "book5", subtype: "route-grid", rows: rows + 1, columns: columns + 1, blocked: [], waypoint: null },
    answer: `${answer}가지`,
    solution: `출발점에서 각 점까지 오는 길의 수를 왼쪽 수와 위쪽 수를 더해 차례로 적으면 도착점은 ${answer}입니다.`,
    meta: { family: "shortest-rectangle", rows: rows + 1, columns: columns + 1, blocked: [], answer }
  };
}

function shortestPathIrregularGrid({ difficulty = 2 }) {
  const rows = difficulty === 1 ? 4 : difficulty === 2 ? 5 : 6;
  const columns = difficulty === 1 ? 4 : difficulty === 2 ? 5 : 6;
  let blocked = new Set();
  let answer = 0;
  for (let attempt = 0; attempt < 100 && (answer < 2 || answer > 200); attempt += 1) {
    blocked = new Set();
    const count = difficulty === 1 ? 1 : difficulty === 2 ? 3 : 5;
    shuffle(Array.from({ length: rows * columns - 2 }, (_, index) => index + 1)).slice(0, count).forEach((flat) => {
      const row = Math.floor(flat / columns);
      const column = flat % columns;
      if (row !== rows - 1 || column !== columns - 1) blocked.add(`${row}:${column}`);
    });
    answer = countPaths(rows, columns, blocked);
  }
  if (answer < 1) return shortestPathIrregularGrid({ difficulty });
  return {
    prompt: "막힌 점을 지나지 않고 오른쪽이나 아래쪽으로만 움직이는 가장 짧은 길은 모두 몇 가지인가요?",
    visual: { kind: "book5", subtype: "route-grid", rows, columns, blocked: [...blocked], waypoint: null },
    answer: `${answer}가지`,
    solution: `막힌 점에는 0을 쓰고, 나머지 점에는 왼쪽과 위쪽에서 오는 길의 수를 더합니다. 도착점의 수는 ${answer}입니다.`,
    meta: { family: "shortest-irregular", rows, columns, blocked: [...blocked], answer }
  };
}

function shortestPathViaWaypoint({ difficulty = 2 }) {
  const rows = difficulty === 1 ? 4 : difficulty === 2 ? 5 : 6;
  const columns = difficulty === 1 ? 4 : difficulty === 2 ? 5 : 6;
  const waypoint = { row: randomInt(1, rows - 2), column: randomInt(1, columns - 2) };
  const first = countPaths(waypoint.row + 1, waypoint.column + 1);
  const second = countPaths(rows - waypoint.row, columns - waypoint.column);
  const answer = first * second;
  return {
    prompt: "출발점에서 별표 점을 꼭 지나 도착점까지 가는 가장 짧은 길은 모두 몇 가지인가요?",
    visual: { kind: "book5", subtype: "route-grid", rows, columns, blocked: [], waypoint },
    answer: `${answer}가지`,
    solution: `출발점에서 별표까지 ${first}가지, 별표에서 도착점까지 ${second}가지입니다. 앞의 길마다 뒤의 길을 이을 수 있으므로 모두 ${answer}가지입니다.`,
    meta: { family: "shortest-waypoint", rows, columns, waypoint, first, second, answer }
  };
}

function enumerateNumbers(digits, length) {
  const results = [];
  function visit(prefix, remaining) {
    if (prefix.length === length) {
      results.push(Number(prefix.join("")));
      return;
    }
    remaining.forEach((digit, index) => {
      if (prefix.length === 0 && digit === 0) return;
      visit([...prefix, digit], [...remaining.slice(0, index), ...remaining.slice(index + 1)]);
    });
  }
  visit([], digits);
  return [...new Set(results)].sort((a, b) => a - b);
}

function digitCardNumberEnumeration({ difficulty = 2 }) {
  const cardCount = difficulty === 1 ? 3 : difficulty === 2 ? 4 : 5;
  const digits = shuffle(Array.from({ length: 10 }, (_, index) => index)).slice(0, cardCount).sort((a, b) => a - b);
  const length = difficulty === 3 ? 3 : 2;
  const numbers = enumerateNumbers(digits, length);
  return {
    prompt: `숫자 카드 중 ${length}장을 골라 한 번씩만 써서 만들 수 있는 ${length}자리 수는 모두 몇 개인가요?`,
    visual: { kind: "book5", subtype: "digit-cards", digits, length, targetRank: null },
    answer: `${numbers.length}개`,
    solution: `맨 앞에는 0을 놓지 않고, 첫 자리부터 차례로 카드를 정해 빠짐없이 써 보면 모두 ${numbers.length}개입니다.`,
    meta: { family: "digit-enumeration", digits, length, numbers, answer: numbers.length }
  };
}

function digitCardRankedNumber({ difficulty = 2 }) {
  const cardCount = difficulty === 1 ? 3 : difficulty === 2 ? 4 : 5;
  const digits = shuffle(Array.from({ length: 10 }, (_, index) => index)).slice(0, cardCount).sort((a, b) => a - b);
  const length = difficulty === 3 ? 3 : 2;
  const numbers = enumerateNumbers(digits, length);
  const rank = randomInt(2, Math.max(2, Math.min(numbers.length - 1, difficulty === 1 ? 5 : difficulty === 2 ? 10 : 20)));
  const answer = numbers[rank - 1];
  return {
    prompt: `숫자 카드를 한 번씩만 써서 만든 ${length}자리 수를 작은 수부터 차례로 썼습니다. ${rank}번째 수를 구하세요.`,
    visual: { kind: "book5", subtype: "digit-cards", digits, length, targetRank: rank },
    answer: String(answer),
    solution: `맨 앞자리를 작은 숫자부터 정하고, 같은 첫자리끼리는 다음 자리를 작은 순서로 씁니다. ${rank}번째 수는 ${answer}입니다.`,
    meta: { family: "digit-ranked", digits, length, numbers, rank, answer }
  };
}

function twoDigitConditionRank(kind, difficulty) {
  let condition = 0;
  let numbers = [];
  for (let attempt = 0; attempt < 100 && numbers.length < 5; attempt += 1) {
    condition = kind === "sum" ? randomInt(6, 14) : randomInt(2, 7);
    numbers = [];
    for (let number = 10; number <= 99; number += 1) {
      const tens = Math.floor(number / 10);
      const ones = number % 10;
      const valid = kind === "sum" ? tens + ones === condition : Math.abs(tens - ones) === condition;
      if (valid) numbers.push(number);
    }
  }
  const maximumRank = Math.min(numbers.length, difficulty === 1 ? 4 : difficulty === 2 ? 7 : numbers.length);
  const rank = randomInt(2, maximumRank);
  const descending = difficulty === 3 && Math.random() < 0.5;
  const ordered = descending ? [...numbers].reverse() : numbers;
  return { condition, numbers: ordered, rank, descending, answer: ordered[rank - 1] };
}

function twoDigitDigitSumRank({ difficulty = 2 }) {
  const made = twoDigitConditionRank("sum", difficulty);
  return {
    prompt: `십의 자리 숫자와 일의 자리 숫자의 합이 ${made.condition}인 두 자리 수를 ${made.descending ? "큰" : "작은"} 수부터 썼습니다. ${made.rank}번째 수를 구하세요.`,
    visual: { kind: "book5", subtype: "digit-condition", conditionLabel: `두 숫자의 합 = ${made.condition}`, rank: made.rank, descending: made.descending },
    answer: String(made.answer),
    solution: `십의 자리 숫자를 차례로 정하고, 합이 ${made.condition}이 되는 일의 자리 숫자를 짝지어 씁니다. 순서대로 놓은 ${made.rank}번째 수는 ${made.answer}입니다.`,
    meta: { family: "digit-sum-rank", ...made }
  };
}

function twoDigitDigitDifferenceRank({ difficulty = 2 }) {
  const made = twoDigitConditionRank("difference", difficulty);
  return {
    prompt: `십의 자리 숫자와 일의 자리 숫자의 차가 ${made.condition}인 두 자리 수를 ${made.descending ? "큰" : "작은"} 수부터 썼습니다. ${made.rank}번째 수를 구하세요.`,
    visual: { kind: "book5", subtype: "digit-condition", conditionLabel: `두 숫자의 차 = ${made.condition}`, rank: made.rank, descending: made.descending },
    answer: String(made.answer),
    solution: `두 자리 숫자의 차가 ${made.condition}이 되는 수만 빠짐없이 쓰고 순서대로 놓으면 ${made.rank}번째 수는 ${made.answer}입니다.`,
    meta: { family: "digit-difference-rank", ...made }
  };
}

function multiplicationTablePattern({ difficulty = 2 }) {
  const size = difficulty === 1 ? 3 : difficulty === 2 ? 4 : 5;
  const rowHeaders = shuffle(Array.from({ length: 8 }, (_, index) => index + 2)).slice(0, size);
  const columnHeaders = shuffle(Array.from({ length: 8 }, (_, index) => index + 2)).slice(0, size);
  const values = rowHeaders.map((rowValue) => columnHeaders.map((columnValue) => rowValue * columnValue));
  const target = { row: randomInt(0, size - 1), column: randomInt(0, size - 1) };
  const answer = values[target.row][target.column];
  return {
    prompt: "윗줄의 수와 왼쪽 수를 곱해 표를 만들었습니다. 물음표에 알맞은 수를 구하세요.",
    visual: { kind: "book5", subtype: "multiplication-table", rowHeaders, columnHeaders, values, target },
    answer: String(answer),
    solution: `${rowHeaders[target.row]}와 ${columnHeaders[target.column]}를 곱하면 ${answer}입니다.`,
    meta: { family: "multiplication-table", rowHeaders, columnHeaders, values, target, answer }
  };
}

function productCycleCompletion({ difficulty = 2 }) {
  const sides = difficulty === 1 ? 3 : difficulty === 2 ? randomInt(4, 5) : randomInt(6, 8);
  const vertices = shuffle(Array.from({ length: 8 }, (_, index) => index + 2)).slice(0, sides);
  const edges = vertices.map((value, index) => value * vertices[(index + 1) % sides]);
  const targetIndex = randomInt(1, sides - 1);
  const visibleVertices = difficulty === 1 ? [0, (targetIndex + 1) % sides] : [0];
  return {
    prompt: "이웃한 두 꼭짓점의 수를 곱해 변의 수를 만들었습니다. 물음표 꼭짓점의 수를 구하세요.",
    visual: { kind: "book5", subtype: "product-cycle", vertices, edges, targetIndex, visibleVertices },
    answer: String(vertices[targetIndex]),
    solution: `보이는 꼭짓점에서 시작해 변의 수를 이웃한 꼭짓점 수로 나누며 따라가면 물음표는 ${vertices[targetIndex]}입니다.`,
    meta: { family: "product-cycle", sides, vertices, edges, targetIndex, visibleVertices, answer: vertices[targetIndex] }
  };
}

function multiplicationMatrixProducts({ difficulty = 2 }) {
  const rows = 2;
  const columns = difficulty === 1 ? 2 : difficulty === 2 ? 3 : 4;
  const cells = Array.from({ length: rows }, () => Array.from({ length: columns }, () => randomInt(2, difficulty === 3 ? 9 : 7)));
  const rowProducts = cells.map(product);
  const columnProducts = Array.from({ length: columns }, (_, column) => cells[0][column] * cells[1][column]);
  const target = { row: randomInt(0, 1), column: randomInt(0, columns - 1) };
  const answer = cells[target.row][target.column];
  return {
    prompt: "각 줄의 수를 모두 곱한 값이 오른쪽과 아래에 적혀 있습니다. 물음표 칸의 수를 구하세요.",
    visual: { kind: "book5", subtype: "product-matrix", cells, rowProducts, columnProducts, target, cardPool: null },
    answer: String(answer),
    solution: `물음표가 있는 줄의 곱에서 나머지 보이는 수를 차례로 나누면 ${answer}입니다.`,
    meta: { family: "matrix-products", rows, columns, cells, rowProducts, columnProducts, target, answer }
  };
}

function permutations(items) {
  if (items.length <= 1) return [items];
  const result = [];
  items.forEach((item, index) => {
    permutations([...items.slice(0, index), ...items.slice(index + 1)]).forEach((rest) => result.push([item, ...rest]));
  });
  return result;
}

function matrixMatches(flat, rows, columns, rowProducts, columnProducts, reveals) {
  const cells = Array.from({ length: rows }, (_, row) => flat.slice(row * columns, (row + 1) * columns));
  if (!cells.every((row, index) => product(row) === rowProducts[index])) return false;
  if (!Array.from({ length: columns }, (_, column) => product(cells.map((row) => row[column]))).every((value, index) => value === columnProducts[index])) return false;
  return reveals.every(({ row, column, value }) => cells[row][column] === value);
}

function multiplicationMatrixPlacement({ difficulty = 2 }) {
  const rows = 2;
  const columns = difficulty === 1 ? 2 : 3;
  const cardPool = shuffle(Array.from({ length: 8 }, (_, index) => index + 2)).slice(0, rows * columns);
  const flat = shuffle(cardPool);
  const cells = Array.from({ length: rows }, (_, row) => flat.slice(row * columns, (row + 1) * columns));
  const rowProducts = cells.map(product);
  const columnProducts = Array.from({ length: columns }, (_, column) => cells[0][column] * cells[1][column]);
  const all = permutations(cardPool);
  const reveals = [{ row: 0, column: 0, value: cells[0][0] }];
  let matches = all.filter((candidate) => matrixMatches(candidate, rows, columns, rowProducts, columnProducts, reveals));
  const revealCandidates = shuffle(Array.from({ length: rows * columns - 1 }, (_, index) => index + 1));
  while (matches.length > 1 && revealCandidates.length) {
    const position = revealCandidates.shift();
    const row = Math.floor(position / columns);
    const column = position % columns;
    reveals.push({ row, column, value: cells[row][column] });
    matches = all.filter((candidate) => matrixMatches(candidate, rows, columns, rowProducts, columnProducts, reveals));
  }
  if (matches.length !== 1 || reveals.length >= rows * columns) return multiplicationMatrixPlacement({ difficulty });
  const hidden = [];
  cells.forEach((rowValues, row) => rowValues.forEach((value, column) => {
    if (!reveals.some((reveal) => reveal.row === row && reveal.column === column)) hidden.push({ row, column, value });
  }));
  const target = sample(hidden);
  return {
    prompt: "수 카드를 한 번씩 넣어 가로와 세로의 곱을 맞췄습니다. 물음표 칸의 수를 구하세요.",
    visual: { kind: "book5", subtype: "product-matrix", cells, rowProducts, columnProducts, target, cardPool, reveals },
    answer: String(target.value),
    solution: `가로와 세로의 곱을 함께 맞추고 쓴 카드를 지우면 물음표 칸에는 ${target.value}만 들어갑니다.`,
    meta: { family: "matrix-placement", rows, columns, cells, flat, rowProducts, columnProducts, cardPool, reveals, matches, target, answer: target.value }
  };
}

function uniqueSymbolPair() {
  for (let attempt = 0; attempt < 200; attempt += 1) {
    const first = randomInt(2, 9);
    const second = randomInt(2, 9);
    if (first === second) continue;
    const targetProduct = first * second;
    const targetSum = first + second;
    const candidates = [];
    for (let a = 1; a <= 9; a += 1) for (let b = 1; b <= 9; b += 1) {
      if (a > b && a * b === targetProduct && a + b === targetSum) candidates.push([a, b]);
    }
    if (candidates.length === 1) return { larger: Math.max(first, second), smaller: Math.min(first, second), targetProduct, targetSum, candidates };
  }
  return null;
}

function symbolProductPair({ difficulty = 2 }) {
  const made = uniqueSymbolPair();
  if (!made) return null;
  const symbols = shuffle(["●", "▲"]);
  return {
    prompt: `${symbols[0]}는 ${symbols[1]}보다 큰 수입니다. 두 모양의 수를 곱하면 ${made.targetProduct}, 더하면 ${made.targetSum}입니다. ${symbols[0]}의 수를 구하세요.`,
    visual: { kind: "book5", subtype: "symbol-equations", equations: [`${symbols[0]} × ${symbols[1]} = ${made.targetProduct}`, `${symbols[0]} + ${symbols[1]} = ${made.targetSum}`, `${symbols[0]} > ${symbols[1]}`], target: symbols[0] },
    answer: String(made.larger),
    solution: `곱이 ${made.targetProduct}인 두 수 중 합이 ${made.targetSum}인 수는 ${made.smaller}, ${made.larger}입니다. 더 큰 ${symbols[0]}는 ${made.larger}입니다.`,
    meta: { family: "symbol-product-pair", ...made, symbols, answer: made.larger }
  };
}

function symbolMultiplicationChain({ difficulty = 2 }) {
  const values = shuffle(Array.from({ length: 8 }, (_, index) => index + 2)).slice(0, difficulty === 3 ? 4 : 3);
  const symbols = ["●", "▲", "■", "★"].slice(0, values.length);
  const equations = [];
  for (let index = 0; index < values.length - 1; index += 1) equations.push(`${symbols[index]} × ${symbols[index + 1]} = ${values[index] * values[index + 1]}`);
  equations.unshift(`${symbols[0]} = ${values[0]}`);
  const answer = values.at(-1);
  return {
    prompt: `같은 모양은 같은 수입니다. 이어진 곱셈식을 보고 ${symbols.at(-1)}의 수를 구하세요.`,
    visual: { kind: "book5", subtype: "symbol-equations", equations, target: symbols.at(-1) },
    answer: String(answer),
    solution: `${symbols[0]}부터 곱한 값을 앞 모양의 수로 차례로 나누면 ${symbols.at(-1)}는 ${answer}입니다.`,
    meta: { family: "symbol-product-chain", values, symbols, equations, answer }
  };
}

function symbolSolutions(equations, symbolCount) {
  const results = [];
  function visit(values) {
    if (values.length === symbolCount) {
      if (new Set(values).size !== values.length) return;
      if (equations.every(({ left, operator, right, result }) => {
        const value = operator === "×" ? values[left] * values[right] : operator === "+" ? values[left] + values[right] : values[left] - values[right];
        return value === result;
      })) results.push(values);
      return;
    }
    for (let value = 1; value <= 9; value += 1) visit([...values, value]);
  }
  visit([]);
  return results;
}

function symbolMixedOperationGrid({ difficulty = 2 }) {
  const symbolCount = difficulty === 1 ? 2 : 3;
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const symbols = ["●", "▲", "■"].slice(0, symbolCount);
    const values = shuffle(Array.from({ length: 9 }, (_, index) => index + 1)).slice(0, symbolCount);
    const equations = symbolCount === 2
      ? [
        { left: 0, operator: "×", right: 1, result: values[0] * values[1] },
        { left: 0, operator: "+", right: 1, result: values[0] + values[1] },
        values[0] > values[1]
          ? { left: 0, operator: "−", right: 1, result: values[0] - values[1] }
          : { left: 1, operator: "−", right: 0, result: values[1] - values[0] }
      ]
      : [
        { left: 0, operator: "×", right: 1, result: values[0] * values[1] },
        { left: 1, operator: "+", right: 2, result: values[1] + values[2] },
        values[0] > values[2]
          ? { left: 0, operator: "−", right: 2, result: values[0] - values[2] }
          : { left: 2, operator: "−", right: 0, result: values[2] - values[0] }
      ];
    const solutions = symbolSolutions(equations, symbolCount);
    if (solutions.length !== 1) continue;
    const answer = sum(values);
    const labels = equations.map((equation) => `${symbols[equation.left]} ${equation.operator} ${symbols[equation.right]} = ${equation.result}`);
    return {
      prompt: "같은 모양은 같은 수, 다른 모양은 다른 수입니다. 식을 만족하는 모든 모양의 수를 더하세요.",
      visual: { kind: "book5", subtype: "symbol-equations", equations: labels, target: symbols.join(" + ") },
      answer: String(answer),
      solution: `식을 차례로 맞추면 ${symbols.map((symbol, index) => `${symbol}=${values[index]}`).join(", ")}입니다. 모두 더하면 ${answer}입니다.`,
      meta: { family: "symbol-mixed-grid", symbols, values, equations, solutions, answer }
    };
  }
  return null;
}

function handshakePairCount({ difficulty = 2 }) {
  const people = randomInt(difficulty === 1 ? 4 : difficulty === 2 ? 6 : 9, difficulty === 1 ? 6 : difficulty === 2 ? 9 : 13);
  const answer = triangular(people - 1);
  return {
    prompt: `${people}명이 서로 한 번씩 악수합니다. 악수는 모두 몇 번 하나요?`,
    visual: { kind: "book5", subtype: "people-circle", count: people, connect: false, label: "악수" },
    answer: `${answer}번`,
    solution: `첫 사람은 ${people - 1}번, 다음 사람은 새 사람과 ${people - 2}번씩 악수합니다. ${people - 1} + ${people - 2} + … + 1 = ${answer}번입니다.`,
    meta: { family: "pair-count", context: "handshake", count: people, answer }
  };
}

function pairSelectionCount({ difficulty = 2 }) {
  const count = randomInt(difficulty === 1 ? 4 : difficulty === 2 ? 6 : 9, difficulty === 1 ? 6 : difficulty === 2 ? 9 : 12);
  const item = sample(["친구", "숫자 카드", "색연필"]);
  const answer = triangular(count - 1);
  return {
    prompt: `${count}개의 ${item} 중 서로 다른 2개를 고르는 방법은 모두 몇 가지인가요? 고르는 순서만 바뀐 것은 같은 방법입니다.`,
    visual: { kind: "book5", subtype: "selection-items", count, item },
    answer: `${answer}가지`,
    solution: `첫째 것과 짝지을 수 있는 방법부터 겹치지 않게 세면 ${count - 1} + ${count - 2} + … + 1 = ${answer}가지입니다.`,
    meta: { family: "pair-count", context: "selection", count, item, answer }
  };
}

function completeGraphSegmentCount({ difficulty = 2 }) {
  const count = randomInt(difficulty === 1 ? 4 : difficulty === 2 ? 6 : 8, difficulty === 1 ? 6 : difficulty === 2 ? 8 : 11);
  const answer = triangular(count - 1);
  return {
    prompt: `원 위의 점 ${count}개를 서로 한 번씩 모두 이었습니다. 그은 선분은 모두 몇 개인가요?`,
    visual: { kind: "book5", subtype: "people-circle", count, connect: true, label: "선분" },
    answer: `${answer}개`,
    solution: `한 점에서 새로 잇는 선을 겹치지 않게 세면 ${count - 1} + ${count - 2} + … + 1 = ${answer}개입니다.`,
    meta: { family: "pair-count", context: "segments", count, answer }
  };
}

function inversePairCount({ difficulty = 2 }) {
  const count = randomInt(difficulty === 1 ? 5 : difficulty === 2 ? 8 : 11, difficulty === 1 ? 8 : difficulty === 2 ? 11 : 15);
  const pairCount = triangular(count - 1);
  return {
    prompt: `모든 사람이 서로 한 번씩 악수했더니 모두 ${pairCount}번이었습니다. 사람은 몇 명인가요?`,
    visual: { kind: "book5", subtype: "pair-ladder", pairCount },
    answer: `${count}명`,
    solution: `1부터 차례로 더해 ${pairCount}이 되는 때를 찾습니다. 1 + 2 + … + ${count - 1} = ${pairCount}이므로 ${count}명입니다.`,
    meta: { family: "inverse-pair-count", count, pairCount, answer: count }
  };
}

function squareNumberOddSum({ difficulty = 2 }) {
  const target = randomInt(difficulty === 1 ? 4 : difficulty === 2 ? 7 : 11, difficulty === 1 ? 7 : difficulty === 2 ? 11 : 15);
  const odds = Array.from({ length: target }, (_, index) => index * 2 + 1);
  const answer = sum(odds);
  return {
    prompt: `1부터 홀수를 ${target}개 차례로 더한 사각수를 구하세요.`,
    visual: { kind: "book5", subtype: "odd-square", target, odds },
    answer: String(answer),
    solution: `${odds.slice(0, 4).join(" + ")}${odds.length > 4 ? " + … + " + odds.at(-1) : ""} = ${answer}입니다.`,
    meta: { family: "odd-square", target, odds, answer }
  };
}

function pascalRow(rowNumber) {
  let row = [1];
  for (let index = 1; index < rowNumber; index += 1) row = [1, ...row.slice(0, -1).map((value, itemIndex) => value + row[itemIndex + 1]), 1];
  return row;
}

function pascalRowSum({ difficulty = 2 }) {
  const rowNumber = randomInt(difficulty === 1 ? 4 : difficulty === 2 ? 6 : 8, difficulty === 1 ? 6 : difficulty === 2 ? 8 : 11);
  const row = pascalRow(rowNumber);
  const answer = sum(row);
  return {
    prompt: `각 줄의 양 끝에는 1을 쓰고, 가운데 수는 바로 위의 두 수를 더해 만듭니다. ${rowNumber}번째 줄의 수를 모두 더하세요.`,
    visual: { kind: "book5", subtype: "pascal", rows: Array.from({ length: Math.min(rowNumber, 6) }, (_, index) => pascalRow(index + 1)), targetRow: rowNumber },
    answer: String(answer),
    solution: `${rowNumber}번째 줄은 ${row.join(", ")}입니다. 모두 더하면 ${answer}입니다.`,
    meta: { family: "pascal-row", rowNumber, row, answer }
  };
}

function triangleFigureCount({ difficulty = 2 }) {
  if (difficulty < 3 || Math.random() < 0.55) {
    const segments = randomInt(difficulty === 1 ? 3 : 5, difficulty === 1 ? 5 : 8);
    const answer = triangular(segments);
    return {
      prompt: "큰 삼각형 안에서 찾을 수 있는 크고 작은 삼각형은 모두 몇 개인가요?",
      visual: { kind: "book5", subtype: "triangle-count", mode: "fan", order: segments },
      answer: `${answer}개`,
      solution: `밑변의 붙어 있는 한 칸짜리부터 ${segments}칸짜리까지 세면 ${segments} + ${segments - 1} + … + 1 = ${answer}개입니다.`,
      meta: { family: "triangle-count", mode: "fan", order: segments, answer }
    };
  }
  const order = randomInt(3, 6);
  let upward = 0;
  for (let side = 1; side <= order; side += 1) upward += triangular(order - side + 1);
  let downward = 0;
  for (let side = 1; side <= Math.floor(order / 2); side += 1) downward += triangular(order - side * 2 + 1);
  const answer = upward + downward;
  return {
    prompt: "정삼각형 모눈에서 찾을 수 있는 크고 작은 삼각형은 모두 몇 개인가요?",
    visual: { kind: "book5", subtype: "triangle-count", mode: "grid", order },
    answer: `${answer}개`,
    solution: `위쪽을 향한 삼각형 ${upward}개와 아래쪽을 향한 삼각형 ${downward}개를 더하면 ${answer}개입니다.`,
    meta: { family: "triangle-count", mode: "grid", order, upward, downward, answer }
  };
}

function squareGridCount({ difficulty = 2 }) {
  const order = randomInt(difficulty === 1 ? 2 : difficulty === 2 ? 4 : 6, difficulty === 1 ? 4 : difficulty === 2 ? 6 : 8);
  const bySize = Array.from({ length: order }, (_, index) => {
    const side = index + 1;
    return { side, count: (order - side + 1) * (order - side + 1) };
  });
  const answer = sum(bySize.map((item) => item.count));
  return {
    prompt: "정사각형 모눈에서 찾을 수 있는 크고 작은 정사각형은 모두 몇 개인가요?",
    visual: { kind: "book5", subtype: "square-count", order },
    answer: `${answer}개`,
    solution: `${bySize.map((item) => `${item.side}칸짜리 ${item.count}개`).join(", ")}를 더하면 ${answer}개입니다.`,
    meta: { family: "square-grid-count", order, bySize, answer }
  };
}

function triangularRowBoundaryNumber({ difficulty = 2 }) {
  const row = randomInt(difficulty === 1 ? 5 : difficulty === 2 ? 8 : 12, difficulty === 1 ? 8 : difficulty === 2 ? 12 : 18);
  const askFirst = Math.random() < 0.5;
  const first = triangular(row - 1) + 1;
  const last = triangular(row);
  const answer = askFirst ? first : last;
  return {
    prompt: `첫째 줄에 1개, 둘째 줄에 2개씩 수를 차례로 씁니다. ${row}번째 줄의 ${askFirst ? "첫" : "마지막"} 수를 구하세요.`,
    visual: { kind: "book5", subtype: "number-rows", mode: "triangle", previewRows: 4, targetRow: row, askFirst },
    answer: String(answer),
    solution: `${row - 1}번째 줄까지 쓴 수는 ${triangular(row - 1)}개입니다. ${row}번째 줄은 ${first}부터 ${last}까지이므로 답은 ${answer}입니다.`,
    meta: { family: "triangle-row-boundary", row, first, last, askFirst, answer }
  };
}

function squareRowBoundaryNumber({ difficulty = 2 }) {
  const row = randomInt(difficulty === 1 ? 4 : difficulty === 2 ? 7 : 10, difficulty === 1 ? 7 : difficulty === 2 ? 10 : 14);
  const askFirst = Math.random() < 0.5;
  const first = (row - 1) * (row - 1) + 1;
  const last = row * row;
  const answer = askFirst ? first : last;
  return {
    prompt: `첫째 줄부터 1개, 3개, 5개씩 수를 차례로 씁니다. ${row}번째 줄의 ${askFirst ? "첫" : "마지막"} 수를 구하세요.`,
    visual: { kind: "book5", subtype: "number-rows", mode: "square", previewRows: 4, targetRow: row, askFirst },
    answer: String(answer),
    solution: `${row - 1}번째 줄까지 쓴 수는 ${first - 1}개입니다. ${row}번째 줄은 ${first}부터 ${last}까지이므로 답은 ${answer}입니다.`,
    meta: { family: "square-row-boundary", row, first, last, askFirst, answer }
  };
}

export const BOOK05_GENERATORS = {
  sequentialPathNumberGrid,
  diagonalFillNumberGrid,
  lineCycleNumberTable,
  fingerBounceSequence,
  calendarMonthPosition,
  calendarCrossMonthWeekday,
  calendarSameWeekdaySum,
  shortestPathRectangle,
  shortestPathIrregularGrid,
  shortestPathViaWaypoint,
  digitCardNumberEnumeration,
  digitCardRankedNumber,
  twoDigitDigitSumRank,
  twoDigitDigitDifferenceRank,
  multiplicationTablePattern,
  productCycleCompletion,
  multiplicationMatrixProducts,
  multiplicationMatrixPlacement,
  symbolProductPair,
  symbolMultiplicationChain,
  symbolMixedOperationGrid,
  handshakePairCount,
  pairSelectionCount,
  completeGraphSegmentCount,
  inversePairCount,
  squareNumberOddSum,
  pascalRowSum,
  triangleFigureCount,
  squareGridCount,
  triangularRowBoundaryNumber,
  squareRowBoundaryNumber
};
