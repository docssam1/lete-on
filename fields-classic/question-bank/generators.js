import { G1_GENERATORS } from "./g1-generators.js?v=20260816a";

const COLORS = ["흰색", "검은색"];
const SHAPES = ["동그라미", "세모", "네모"];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sample(list) {
  return list[randomInt(0, list.length - 1)];
}

function shuffle(list) {
  const result = [...list];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = randomInt(0, index);
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

function numberHasBatchim(value) {
  return [0, 1, 3, 6, 7, 8].includes(Math.abs(value) % 10);
}

function numberObject(value) {
  return `${value}${numberHasBatchim(value) ? "을" : "를"}`;
}

function numberSubject(value) {
  return `${value}${numberHasBatchim(value) ? "이" : "가"}`;
}

function numberQuote(value) {
  return `${value}${numberHasBatchim(value) ? "이라고" : "라고"}`;
}

function numberAnd(value) {
  return `${value}${numberHasBatchim(value) ? "과" : "와"}`;
}

function numberAs(value) {
  return `${value}${[0, 3, 6].includes(Math.abs(value) % 10) ? "으로" : "로"}`;
}

function koreanParticle(word, withBatchim, withoutBatchim) {
  const lastCode = [...word].at(-1)?.charCodeAt(0) ?? 0;
  const hasBatchim = lastCode >= 0xac00 && lastCode <= 0xd7a3 && (lastCode - 0xac00) % 28 !== 0;
  return `${word}${hasBatchim ? withBatchim : withoutBatchim}`;
}

function hiddenCardCondition({ difficulty = 2 }) {
  const universe = Array.from({ length: 10 }, (_, index) => index);
  const hidden = sample(universe);
  const clueCount = difficulty === 1 ? 3 : difficulty === 3 ? 5 : 4;
  const cardCount = difficulty === 1 ? 4 : difficulty === 3 ? 6 : 5;
  const pattern = difficulty === 1
    ? [true, false, true]
    : difficulty === 3
      ? [true, false, true, false, true]
      : [true, false, true, false];
  let clues;
  let candidates;
  let attempts = 0;

  do {
    clues = pattern.slice(0, clueCount).map((hasCard) => {
      const pool = hasCard ? universe.filter((value) => value !== hidden) : universe.filter((value) => value !== hidden);
      const values = shuffle(pool).slice(0, hasCard ? cardCount - 1 : cardCount);
      if (hasCard) values.push(hidden);
      return { hasCard, values: values.sort((a, b) => a - b) };
    });
    candidates = universe.filter((value) => clues.every((clue) => (
      clue.hasCard ? clue.values.includes(value) : !clue.values.includes(value)
    )));
    attempts += 1;
  } while ((candidates.length !== 1 || candidates[0] !== hidden) && attempts < 500);

  if (candidates.length !== 1 || candidates[0] !== hidden) return hiddenCardCondition({ difficulty });

  return {
    prompt: "숫자 카드 1장을 찾고 있습니다. 다음은 여러 숫자 카드 중에 찾는 카드가 있는지 없는지를 나타낸 것입니다. 찾는 숫자 카드는 무엇일까요?",
    visual: { kind: "hidden-card-conditions", clues },
    answer: String(hidden),
    solution: `‘있습니다’인 줄에는 모두 있고 ‘없습니다’인 줄에는 없는 수를 차례로 확인하면 ${hidden}만 남습니다.`
  };
}

function closestTwoDigitCardSum({ difficulty = 2 }) {
  const makeExpressions = (cards, target) => {
    const expressions = new Map();
    for (const order of permutations(cards)) {
      const first = order[0] * 10 + order[1];
      const second = order[2] * 10 + order[3];
      const pair = [first, second].sort((a, b) => a - b);
      const key = `${pair[0]}+${pair[1]}`;
      expressions.set(key, { first: pair[0], second: pair[1], sum: first + second });
    }
    const distance = Math.min(...[...expressions.values()].map((item) => Math.abs(item.sum - target)));
    return [...expressions.values()].filter((item) => Math.abs(item.sum - target) === distance);
  };

  let cards;
  let target;
  let best;
  let valid = false;
  let attempts = 0;
  do {
    cards = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4);
    target = difficulty === 1 ? sample([60, 70, 80, 90]) : difficulty === 2 ? 100 : randomInt(83, 117);
    best = makeExpressions(cards, target);
    attempts += 1;
    const distance = best.length ? Math.abs(best[0].sum - target) : 99;
    const validDistance = difficulty === 1 ? distance === 0 : difficulty === 2 ? distance >= 1 && distance <= 6 : distance >= 1 && distance <= 8;
    valid = best.length === 2 && validDistance;
    if (valid) break;
  } while (attempts < 1000);

  if (!valid) return closestTwoDigitCardSum({ difficulty });
  const sum = best[0].sum;
  const answerText = best.map((item) => `${item.first} + ${item.second}`).join(" 또는 ");
  return {
    prompt: `숫자 카드 4장을 한 번씩 사용하여 두 자리 수 2개를 만드세요. 두 수의 합이 ${target}에 가장 가깝도록 빈칸을 채우고 계산하세요.`,
    visual: { kind: "closest-card-sum", cards: shuffle(cards), target },
    answer: `${answerText} = ${sum}`,
    solution: `숫자 카드를 십의 자리와 일의 자리에 바꾸어 넣으며 합을 비교합니다. ${answerText}로 만들면 합은 ${sum}이고, ${target}과의 차가 ${Math.abs(sum - target)}로 가장 작습니다.`
  };
}

function frontBackTotal({ difficulty = 2 }) {
  const names = shuffle(["현지", "준호", "민서", "도윤", "서윤"]);
  if (difficulty === 1) {
    const before = randomInt(3, 8);
    const after = randomInt(3, 8);
    const total = before + after + 1;
    return {
      prompt: `${names[0]} 앞에 ${before}명, 뒤에 ${after}명이 한 줄로 서 있습니다. 줄을 선 사람은 모두 몇 명인가요?`,
      answer: `${total}명`,
      solution: `앞의 ${before}명과 뒤의 ${after}명에 ${names[0]} 1명을 더합니다. ${before} + 1 + ${after} = ${total}이므로 모두 ${total}명입니다.`,
      meta: { mode: "counts", before, after, total }
    };
  }

  if (difficulty === 3) {
    const firstFront = randomInt(7, 14);
    const between = randomInt(1, 4);
    const secondBack = randomInt(7, 14);
    const secondFront = firstFront + between + 1;
    const total = secondFront + secondBack - 1;
    return {
      prompt: `${names[0]}는 앞에서 ${firstFront}번째입니다. ${names[0]}와 ${names[1]} 사이에는 ${between}명이 있고, ${names[1]}는 ${names[0]}보다 뒤에 서 있습니다. ${names[1]}가 뒤에서 ${secondBack}번째라면 줄을 선 사람은 모두 몇 명인가요?`,
      answer: `${total}명`,
      solution: `${names[1]}는 앞에서 ${firstFront} + ${between} + 1 = ${secondFront}번째입니다. 앞에서 ${secondFront}번째와 뒤에서 ${secondBack}번째에는 ${names[1]}가 두 번 들어가므로 한 번 뺍니다. ${secondFront} + ${secondBack} - 1 = ${total}명입니다.`,
      meta: { mode: "between", firstFront, between, secondFront, secondBack, total }
    };
  }

  const front = randomInt(10, 18);
  const back = randomInt(8, 16);
  const total = front + back - 1;
  return {
    prompt: `${names[0]}는 놀이 기구를 타려고 한 줄로 섰습니다. ${names[0]}는 앞에서 ${front}번째이고, 뒤에서 세면 ${back}번째입니다. 줄을 선 사람은 모두 몇 명인가요?`,
    answer: `${total}명`,
    solution: `앞에서 셀 때와 뒤에서 셀 때 ${names[0]}가 두 번 들어갑니다. ${front} + ${back} - 1 = ${total}이므로 모두 ${total}명입니다.`,
    meta: { mode: "positions", front, back, total }
  };
}

function wrongOperationCorrection({ difficulty = 2 }) {
  if (difficulty === 1) {
    const intended = sample(["add", "subtract"]);
    const change = randomInt(3, 9);
    const start = intended === "add" ? randomInt(15, 45) : randomInt(change + 10, 50);
    const wrongResult = intended === "add" ? start - change : start + change;
    const correct = intended === "add" ? start + change : start - change;
    const correctText = intended === "add"
      ? `${start}에 ${numberObject(change)} 더해야 하는데`
      : `${start}에서 ${numberObject(change)} 빼야 하는데`;
    const wrongText = intended === "add"
      ? `${start}에서 ${numberObject(change)} 빼어`
      : `${start}에 ${numberObject(change)} 더하여`;
    const correctSymbol = intended === "add" ? "+" : "-";

    return {
      prompt: `${correctText} 잘못하여 ${wrongText} ${numberQuote(wrongResult)} 계산했습니다. 바르게 계산한 값은 얼마인가요?`,
      answer: String(correct),
      solution: `${start} ${correctSymbol} ${change} = ${correct}이므로 바르게 계산한 값은 ${correct}입니다.`,
      meta: { mode: "known-start", intended, start, change, wrongResult, correct }
    };
  }

  if (difficulty === 3) {
    const added = randomInt(8, 17);
    const subtracted = randomInt(2, 9);
    const startMax = Math.min(70, 99 - added + subtracted);
    const start = randomInt(added + subtracted + 10, startMax);
    const wrongResult = start - added - subtracted;
    const correct = start + added - subtracted;

    return {
      prompt: `어떤 수에 ${numberObject(added)} 더한 다음 ${numberObject(subtracted)} 빼야 합니다. 그런데 ${numberObject(added)} 잘못하여 빼고, 이어서 ${numberObject(subtracted)} 뺐더니 ${numberSubject(wrongResult)} 되었습니다. 바르게 계산한 값은 얼마인가요?`,
      answer: String(correct),
      solution: `${wrongResult}에 ${numberObject(subtracted)} 더하고 ${numberObject(added)} 더하면 처음 수는 ${start}입니다. 바르게 계산하면 ${start} + ${added} - ${subtracted} = ${correct}입니다.`,
      meta: { mode: "unknown-two-step", start, added, subtracted, wrongResult, correct }
    };
  }

  const change = randomInt(7, 18);
  const start = randomInt(change + 12, 60);
  const wrongResult = start - change;
  const correct = start + change;

  return {
    prompt: `어떤 수에 ${numberObject(change)} 더해야 하는데 잘못하여 ${numberObject(change)} 뺐더니 ${numberSubject(wrongResult)} 되었습니다. 바르게 계산한 값은 얼마인가요?`,
    answer: String(correct),
    solution: `${wrongResult} + ${change} = ${start}이므로 처음 수는 ${start}입니다. 바르게 계산하면 ${start} + ${change} = ${correct}입니다.`,
    meta: { mode: "unknown-one-step", intended: "add", start, change, wrongResult, correct }
  };
}

function shapeMatrixRule({ difficulty = 2 }) {
  const shapes = ["circle", "square", "triangle"];
  const fills = ["plain", "gray", "hatch"];
  const direction = sample([1, 2]);
  const cycle = [0, direction, (direction * 2) % 3];
  const shapeRows = difficulty === 3 ? shuffle([0, 1, 2]) : cycle;
  const shapeColumns = difficulty === 3 ? shuffle([0, 1, 2]) : cycle;
  const outerOffset = randomInt(0, 2);
  const innerOffset = (outerOffset + sample([1, 2])) % 3;
  const fillRows = difficulty === 3 ? shuffle([0, 1, 2]) : [0, 2, 1];
  const fillColumns = difficulty === 3 ? shuffle([0, 1, 2]) : [0, 1, 2];
  const fillOffset = randomInt(0, 2);
  const missingIndex = difficulty === 3 ? sample([0, 2, 6, 8]) : 8;

  const fullCells = Array.from({ length: 9 }, (_, index) => {
    const row = Math.floor(index / 3);
    const column = index % 3;
    const shapeIndex = (shapeRows[row] + shapeColumns[column]) % 3;
    const fillIndex = (fillRows[row] + fillColumns[column] + fillOffset) % 3;
    return {
      outer: shapes[(shapeIndex + outerOffset) % 3],
      inner: shapes[(shapeIndex + innerOffset) % 3],
      fill: difficulty === 1 ? "plain" : fills[fillIndex]
    };
  });
  const answerCell = fullCells[missingIndex];
  const cells = fullCells.map((cell, index) => index === missingIndex ? null : cell);
  const shapeNames = { circle: "동그라미", square: "네모", triangle: "세모" };
  const fillNames = { plain: "칠하지 않은", gray: "회색으로 칠한", hatch: "빗금으로 칠한" };
  const answer = `큰 ${shapeNames[answerCell.outer]} 안에 ${fillNames[answerCell.fill]} 작은 ${shapeNames[answerCell.inner]}`;
  const trackedRules = difficulty === 1 ? "큰 도형과 작은 도형" : "큰 도형, 작은 도형, 칠한 방법";

  return {
    prompt: "다음 도형의 규칙을 찾아 ㉠에 알맞은 모양을 그리세요.",
    visual: {
      kind: "shape-matrix-rule",
      id: Math.random().toString(36).slice(2, 10),
      cells,
      missingIndex
    },
    answer,
    solution: `가로줄과 세로줄을 살펴보면 ${trackedRules}이 겹치지 않고 한 번씩 나타납니다. 따라서 ㉠에는 ${answer} 모양이 들어갑니다.`,
    meta: {
      difficulty,
      size: 3,
      missingIndex,
      answerCell,
      fullCells,
      tracks: difficulty === 1 ? ["outer", "inner"] : ["outer", "inner", "fill"]
    }
  };
}

function delayedDatePromise({ difficulty = 2 }) {
  const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const toDayNumber = (month, day) => monthDays.slice(0, month - 1).reduce((sum, value) => sum + value, 0) + day;
  const fromDayNumber = (value) => {
    let month = 1;
    let day = value;
    while (day > monthDays[month - 1]) {
      day -= monthDays[month - 1];
      month += 1;
    }
    return { month, day };
  };
  const dateText = ({ month, day }) => `${month}월 ${day}일`;

  if (difficulty === 1) {
    const month = randomInt(2, 11);
    const after = randomInt(7, 14);
    const heardDay = randomInt(2, monthDays[month - 1] - after);
    const heard = { month, day: heardDay };
    const final = { month, day: heardDay + after };
    return {
      prompt: `선생님께서 ${dateText(heard)}에 그날부터 ${after}일 후에 수학 시험을 보겠다고 말씀하셨습니다. 수학 시험을 보는 날짜는 몇 월 며칠인가요?`,
      answer: dateText(final),
      solution: `${dateText(heard)}에서 ${after}일만큼 앞으로 세면 ${dateText(final)}입니다.`,
      meta: { mode: "known-heard-date", heard: toDayNumber(heard.month, heard.day), after, final: toDayNumber(final.month, final.day) }
    };
  }

  let today;
  let heardAgo;
  let after;
  let delayed;
  let heardNumber;
  let plannedNumber;
  let finalNumber;
  let attempts = 0;
  do {
    const month = sample(difficulty === 2 ? [3, 4, 5, 6, 8, 9, 10] : [2, 3, 4, 5, 6, 7, 8, 9, 10]);
    today = { month, day: monthDays[month - 1] - randomInt(0, 5) };
    heardAgo = difficulty === 2 ? randomInt(7, 12) : randomInt(8, 16);
    after = difficulty === 2 ? randomInt(17, 25) : randomInt(22, 36);
    delayed = difficulty === 3 ? randomInt(2, 7) : 0;
    const todayNumber = toDayNumber(today.month, today.day);
    heardNumber = todayNumber - heardAgo;
    plannedNumber = heardNumber + after;
    finalNumber = plannedNumber + delayed;
    attempts += 1;
  } while ((heardNumber < 1 || finalNumber > 365 || fromDayNumber(finalNumber).month === today.month) && attempts < 500);

  if (attempts >= 500) return delayedDatePromise({ difficulty });
  const heard = fromDayNumber(heardNumber);
  const planned = fromDayNumber(plannedNumber);
  const final = fromDayNumber(finalNumber);
  const delaySentence = delayed ? ` 그 뒤 시험 날짜가 ${delayed}일 더 늦어졌습니다.` : "";
  const delaySolution = delayed ? ` 다시 ${delayed}일 뒤는 ${dateText(final)}입니다.` : "";

  return {
    prompt: `선생님께서 ${after}일 후에 수학 시험을 보겠다고 ${heardAgo}일 전에 말씀하셨습니다.${delaySentence} 오늘이 ${dateText(today)}일 때, 수학 시험을 보는 날짜는 몇 월 며칠인가요?`,
    answer: dateText(final),
    solution: `오늘 ${dateText(today)}에서 ${heardAgo}일 전은 ${dateText(heard)}입니다. 그날부터 ${after}일 뒤는 ${dateText(planned)}입니다.${delaySolution}`,
    meta: {
      mode: delayed ? "past-promise-delayed" : "past-promise",
      today: toDayNumber(today.month, today.day),
      heardAgo,
      heard: heardNumber,
      after,
      planned: plannedNumber,
      delayed,
      final: finalNumber
    }
  };
}

function tornCalendarWeekday({ difficulty = 2 }) {
  const monthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  const month = randomInt(1, 12);
  const firstWeekday = randomInt(0, 6);
  const lastDate = monthDays[month - 1];
  const weekdayFor = (date) => (firstWeekday + date - 1) % 7;
  const dateAt = (week, weekday) => {
    const date = 1 + weekday - firstWeekday + week * 7;
    return date >= 1 && date <= lastDate ? date : null;
  };

  let columns;
  let weekRows;
  let target;
  if (difficulty === 1) {
    columns = [0, 1, 2, 3, 4, 5, 6];
    weekRows = [0];
    target = randomInt(8, 14);
  } else if (difficulty === 2) {
    const start = randomInt(0, 4);
    columns = [start, start + 1, start + 2];
    weekRows = [0, 1];
    target = randomInt(17, Math.min(28, lastDate));
  } else {
    const start = randomInt(0, 4);
    const visibleWeek = randomInt(1, 3);
    columns = [start, start + 1, start + 2];
    weekRows = [visibleWeek];
    const shownDates = columns.map((weekday) => dateAt(visibleWeek, weekday)).filter(Boolean);
    const candidates = Array.from({ length: lastDate }, (_, index) => index + 1).filter((date) => (
      !shownDates.includes(date) && Math.min(...shownDates.map((shown) => Math.abs(shown - date))) >= 9
    ));
    target = sample(candidates);
  }

  const rows = weekRows.map((week) => columns.map((weekday) => dateAt(week, weekday)));
  const shown = rows.flatMap((row) => row.map((date, index) => date ? { date, weekday: columns[index] } : null).filter(Boolean));
  const reference = shown.reduce((best, item) => (
    Math.abs(item.date - target) < Math.abs(best.date - target) ? item : best
  ));
  const difference = target - reference.date;
  const direction = difference >= 0 ? "앞으로" : "뒤로";
  const distance = Math.abs(difference);
  const remainder = distance % 7;
  const answer = `${weekdays[weekdayFor(target)]}요일`;

  return {
    prompt: `어느 해 ${month}월 달력의 일부분입니다. ${month}월 ${target}일은 무슨 요일인가요?`,
    visual: { kind: "torn-calendar", month, columns, headers: columns.map((weekday) => weekdays[weekday]), rows },
    answer,
    solution: `${month}월 ${reference.date}일은 ${weekdays[reference.weekday]}요일입니다. 7일마다 같은 요일이므로 ${distance}일을 7일씩 묶고 남은 ${remainder}일만큼 ${direction} 세면 ${month}월 ${target}일은 ${answer}입니다.`,
    meta: { difficulty, month, firstWeekday, target, targetWeekday: weekdayFor(target), columns, weekRows, rows, reference, difference }
  };
}

function twoTypeUnitTotal({ difficulty = 2 }) {
  // 같음 난이도의 원본이 둘이다. 파이널 2회 13번은 두발·세발자전거, 3회 18번은 닭과 토끼다.
  // 셈은 같으므로 유형을 쪼개지 않고 같음 난이도에서 두 장면이 모두 나오게 한다.
  if (difficulty === 3 || (difficulty === 2 && Math.random() < 0.5)) {
    const total = difficulty === 2 ? randomInt(7, 13) : randomInt(7, 15);
    const rabbits = randomInt(2, total - 2);
    const chickens = total - rabbits;
    const units = chickens * 2 + rabbits * 4;
    return {
      prompt: `닭과 토끼가 합해서 ${total}마리 있습니다. 다리 수가 모두 ${units}개일 때, 토끼는 몇 마리인지 구하세요.`,
      visual: { kind: "two-type-units", variant: "animals", items: [{ label: "닭", units: 2 }, { label: "토끼", units: 4 }] },
      answer: `${rabbits}마리`,
      solution: `모두 닭이라고 생각하면 다리는 ${total} × 2 = ${total * 2}개입니다. 실제 다리는 ${units - total * 2}개 더 많고, 토끼 한 마리로 바꿀 때마다 다리가 2개씩 늘어납니다. ${units - total * 2}을 2개씩 나누면 토끼는 ${rabbits}마리입니다.`,
      meta: { difficulty, variant: "animals", total, smallCount: chickens, largeCount: rabbits, smallUnits: 2, largeUnits: 4, units }
    };
  }

  const total = difficulty === 1 ? randomInt(4, 7) : randomInt(7, 13);
  const tricycles = randomInt(1, total - 1);
  const bicycles = total - tricycles;
  const units = bicycles * 2 + tricycles * 3;
  return {
    prompt: `두발자전거와 세발자전거가 합해서 ${total}대 있습니다. 바퀴 수가 모두 ${units}개일 때, 세발자전거는 몇 대인지 구하세요.`,
    visual: { kind: "two-type-units", variant: "bicycles", items: [{ label: "두발자전거", units: 2 }, { label: "세발자전거", units: 3 }] },
    answer: `${tricycles}대`,
    solution: `모두 두발자전거라고 생각하면 바퀴는 ${total} × 2 = ${total * 2}개입니다. 실제 바퀴는 ${units - total * 2}개 더 많고, 세발자전거 한 대로 바꿀 때마다 바퀴가 1개씩 늘어납니다. 따라서 세발자전거는 ${tricycles}대입니다.`,
    meta: { difficulty, variant: "bicycles", total, smallCount: bicycles, largeCount: tricycles, smallUnits: 2, largeUnits: 3, units }
  };
}

function rowColumnSolutions(rowCounts, columnCounts, limit = 100) {
  const size = rowCounts.length;
  const popcount = (value) => {
    let count = 0;
    for (let bits = value; bits; bits >>= 1) count += bits & 1;
    return count;
  };
  const rowOptions = rowCounts.map((count) => (
    Array.from({ length: 2 ** size }, (_, mask) => mask).filter((mask) => popcount(mask) === count)
  ));
  const solutions = [];

  function visit(row, columnSums, masks) {
    if (solutions.length >= limit) return;
    if (row === size) {
      if (columnSums.every((count, index) => count === columnCounts[index])) solutions.push([...masks]);
      return;
    }
    const rowsLeft = size - row - 1;
    for (const mask of rowOptions[row]) {
      const nextSums = columnSums.map((count, column) => count + ((mask >> column) & 1));
      const possible = nextSums.every((count, column) => (
        count <= columnCounts[column] && count + rowsLeft >= columnCounts[column]
      ));
      if (possible) visit(row + 1, nextSums, [...masks, mask]);
    }
  }

  visit(0, Array(size).fill(0), []);
  return solutions;
}

function rowColumnCountPlacement({ difficulty = 2 }) {
  const size = difficulty === 1 ? 3 : difficulty === 3 ? 5 : 4;
  const solutionRange = difficulty === 1 ? [1, 4] : difficulty === 2 ? [2, 12] : [3, 30];
  let rowCounts;
  let columnCounts;
  let solutions;
  let attempts = 0;

  do {
    const matrix = Array.from({ length: size }, () => (
      Array.from({ length: size }, () => Math.random() < 0.5 ? 1 : 0)
    ));
    rowCounts = matrix.map((row) => row.reduce((sum, value) => sum + value, 0));
    columnCounts = Array.from({ length: size }, (_, column) => (
      matrix.reduce((sum, row) => sum + row[column], 0)
    ));
    attempts += 1;
    if ([...rowCounts, ...columnCounts].some((count) => count === 0)) continue;
    solutions = rowColumnSolutions(rowCounts, columnCounts, solutionRange[1] + 1);
  } while ((!solutions || solutions.length < solutionRange[0] || solutions.length > solutionRange[1]) && attempts < 1000);

  if (!solutions || solutions.length < solutionRange[0] || solutions.length > solutionRange[1]) {
    const fallback = difficulty === 1
      ? { rows: [3, 2, 1], columns: [2, 2, 2] }
      : difficulty === 2
        ? { rows: [3, 3, 4, 2], columns: [4, 3, 3, 2] }
        : { rows: [2, 1, 5, 3, 5], columns: [4, 3, 3, 4, 2] };
    rowCounts = fallback.rows;
    columnCounts = fallback.columns;
    solutions = rowColumnSolutions(rowCounts, columnCounts, solutionRange[1] + 1);
  }

  const masks = sample(solutions);
  const matrix = masks.map((mask) => Array.from({ length: size }, (_, column) => (mask >> column) & 1));
  const answerRows = matrix.map((row) => row.map((value) => value ? "★" : "·").join(" "));
  return {
    prompt: "다음 조건에 맞게 빈칸에 별을 그려 넣으세요. 삼각형 안의 수는 그 줄에 있는 별의 수를 나타내며, 가로와 세로의 수를 모두 맞춰야 합니다.",
    visual: { kind: "row-column-count-placement", size, rowCounts, columnCounts },
    answer: `예: ${answerRows.join(" / ")}`,
    solution: `가로줄의 별 수가 차례로 ${rowCounts.join(", ")}개, 세로줄의 별 수가 차례로 ${columnCounts.join(", ")}개가 되도록 놓습니다. 조건을 모두 만족하는 다른 배치도 정답입니다.`,
    meta: { difficulty, size, rowCounts, columnCounts, matrix, solutionCount: solutions.length }
  };
}

function rankingStatementValue(statement, order) {
  const rank = (name) => order.indexOf(name) + 1;
  const speakerRank = rank(statement.speaker);
  if (statement.kind === "self-rank") return speakerRank === statement.rank;
  if (statement.kind === "self-not-rank") return speakerRank !== statement.rank;
  if (statement.kind === "not-top-two") return speakerRank > 2;
  if (statement.kind === "rank-pair") return statement.ranks.includes(speakerRank);
  if (statement.kind === "before") return speakerRank < rank(statement.other);
  if (statement.kind === "after") return speakerRank > rank(statement.other);
  if (statement.kind === "immediately-before") return speakerRank + 1 === rank(statement.other);
  if (statement.kind === "immediately-after") return speakerRank - 1 === rank(statement.other);
  if (statement.kind === "before-both") return statement.others.every((name) => speakerRank < rank(name));
  if (statement.kind === "after-both") return statement.others.every((name) => speakerRank > rank(name));
  if (statement.kind === "between") return rank(statement.first) < speakerRank && speakerRank < rank(statement.second);
  return false;
}

function rankingStatementText(statement) {
  if (statement.kind === "self-rank") return `나는 ${statement.rank}등이야.`;
  if (statement.kind === "self-not-rank") return `나는 ${statement.rank}등이 아니야.`;
  if (statement.kind === "not-top-two") return "나는 1등도 2등도 아니야.";
  if (statement.kind === "rank-pair") return `나는 ${statement.ranks[0]}등 또는 ${statement.ranks[1]}등이야.`;
  if (statement.kind === "before") return `나는 ${statement.other}보다 빨랐어.`;
  if (statement.kind === "after") return `나는 ${statement.other}보다 늦었어.`;
  if (statement.kind === "immediately-before") return `나는 ${statement.other} 바로 앞이야.`;
  if (statement.kind === "immediately-after") return `나는 ${statement.other} 바로 뒤야.`;
  if (statement.kind === "before-both") return `나는 ${statement.others.join(", ")}보다 빨랐어.`;
  if (statement.kind === "after-both") return `나는 ${statement.others.join(", ")}보다 늦었어.`;
  if (statement.kind === "between") return `나는 ${statement.first}보다 늦었지만 ${statement.second}보다 빨랐어.`;
  return "";
}

function rankingStatementCandidates(speaker, names, difficulty) {
  const others = names.filter((name) => name !== speaker);
  const statements = [];
  const add = (statement) => statements.push({ speaker, ...statement });
  for (let rank = 1; rank <= names.length; rank += 1) {
    add({ kind: "self-rank", rank });
    add({ kind: "self-not-rank", rank });
  }
  if (names.length >= 4) add({ kind: "not-top-two" });
  for (let first = 1; first < names.length; first += 1) add({ kind: "rank-pair", ranks: [first, first + 1] });
  for (const other of others) {
    add({ kind: "before", other });
    add({ kind: "after", other });
    add({ kind: "immediately-before", other });
    add({ kind: "immediately-after", other });
  }
  for (let first = 0; first < others.length; first += 1) {
    for (let second = first + 1; second < others.length; second += 1) {
      add({ kind: "before-both", others: [others[first], others[second]] });
      add({ kind: "after-both", others: [others[first], others[second]] });
      add({ kind: "between", first: others[first], second: others[second] });
      add({ kind: "between", first: others[second], second: others[first] });
    }
  }
  if (difficulty === 1) return statements.filter((item) => ["self-rank", "self-not-rank", "before", "after"].includes(item.kind));
  if (difficulty === 3) return statements.filter((item) => !["self-rank", "self-not-rank", "rank-pair"].includes(item.kind));
  return statements;
}

function truthLieRanking({ difficulty = 2 }) {
  const namePool = ["민서", "서윤", "도윤", "지우", "하린", "예준", "수아", "현우", "유나", "준호"];
  const count = difficulty === 1 ? 4 : 5;
  const liarCount = difficulty === 1 ? 1 : 2;
  let result;

  for (let attempt = 0; attempt < 3000 && !result; attempt += 1) {
    const names = shuffle(namePool).slice(0, count);
    const actualOrder = shuffle(names);
    const liarNames = shuffle(names).slice(0, liarCount);
    const targetName = sample(names);
    const statements = names.map((speaker) => {
      const shouldBeTrue = !liarNames.includes(speaker);
      let candidates = rankingStatementCandidates(speaker, names, difficulty)
        .filter((statement) => rankingStatementValue(statement, actualOrder) === shouldBeTrue);
      if (speaker === targetName) candidates = candidates.filter((statement) => statement.kind !== "self-rank");
      return sample(candidates);
    });
    if (statements.some((statement) => !statement)) continue;
    const texts = statements.map(rankingStatementText);
    if (new Set(texts).size !== texts.length) continue;
    const complexKinds = new Set(["not-top-two", "rank-pair", "before-both", "after-both", "between"]);
    if (difficulty === 2 && !statements.some((statement) => complexKinds.has(statement.kind))) continue;

    const validOrders = permutations(names).filter((order) => statements.every((statement) => (
      rankingStatementValue(statement, order) === !liarNames.includes(statement.speaker)
    )));
    const targetRanks = [...new Set(validOrders.map((order) => order.indexOf(targetName) + 1))];
    const maximumOrders = difficulty === 3 ? 1 : difficulty === 2 ? 4 : 6;
    if (!validOrders.length || validOrders.length > maximumOrders || targetRanks.length !== 1) continue;
    result = { names, actualOrder, liarNames, targetName, statements, validOrders, targetRank: targetRanks[0] };
  }

  if (!result) return truthLieRanking({ difficulty });
  const liarText = result.liarNames.join(", ");
  const orderText = result.validOrders.map((order) => order.join(" → ")).join(" 또는 ");
  return {
    prompt: `${result.names.join(", ")} ${result.names.length}명이 달리기를 했습니다. ${liarText}는 거짓말을 했고, 다른 사람은 참말을 했습니다. ${result.targetName}는 몇 등일까요?`,
    visual: {
      kind: "truth-lie-ranking",
      liarNames: result.liarNames,
      statements: result.statements.map((statement) => ({ ...statement, text: rankingStatementText(statement) }))
    },
    answer: `${result.targetRank}등`,
    solution: `거짓말한 사람의 말은 반대로, 다른 사람의 말은 그대로 표시해 가능한 순서를 찾습니다. 가능한 순서는 ${orderText}이고, 어느 경우에도 ${result.targetName}는 ${result.targetRank}등입니다.`,
    meta: { difficulty, ...result }
  };
}

function targetScoreCombinations({ difficulty = 2 }) {
  const possibleSums = (scores, shotCount) => {
    const sums = new Set();
    const collect = (startIndex, shotsLeft, total) => {
      if (shotsLeft === 0) {
        sums.add(total);
        return;
      }
      for (let index = startIndex; index < scores.length; index += 1) collect(index, shotsLeft - 1, total + scores[index]);
    };
    collect(0, shotCount, 0);
    return [...sums].sort((a, b) => a - b);
  };

  const shotCount = difficulty === 3 ? 3 : 2;
  const count = difficulty === 1 ? randomInt(3, 4) : randomInt(5, 6);
  let scores;
  do {
    scores = [randomInt(1, 3)];
    const maximumStep = difficulty === 3 ? 3 : 2;
    while (scores.length < count) scores.push(scores.at(-1) + randomInt(1, maximumStep));
  } while (scores.at(-1) > (difficulty === 3 ? 15 : 12));

  const sums = possibleSums(scores, shotCount);
  return {
    prompt: `다음 과녁에 화살을 ${shotCount}번 쏘아 모두 맞혔습니다. 얻을 수 있는 점수는 모두 몇 가지일까요? (같은 점수를 여러 번 맞힐 수도 있습니다.)`,
    visual: { kind: "target-score-combinations", scores, shotCount },
    answer: `${sums.length}가지`,
    solution: `작은 점수부터 ${shotCount}번 맞힌 합을 빠짐없이 적으면 ${sums.join(", ")}점입니다. 따라서 모두 ${sums.length}가지입니다.`,
    meta: { difficulty, scores, shotCount, sums }
  };
}

function matchstickShapeSequence({ difficulty = 2 }) {
  const shapePools = {
    1: [{ label: "삼각형", sides: 3 }, { label: "사각형", sides: 4 }],
    2: [{ label: "삼각형", sides: 3 }, { label: "사각형", sides: 4 }, { label: "오각형", sides: 5 }],
    3: [{ label: "오각형", sides: 5 }, { label: "육각형", sides: 6 }]
  };
  const shape = sample(shapePools[difficulty] || shapePools[2]);
  const target = difficulty === 1 ? randomInt(2, 11) : difficulty === 2 ? randomInt(4, 12) : randomInt(7, 16);
  const increment = shape.sides - 1;
  const sequence = Array.from({ length: target }, (_, index) => shape.sides + index * increment);
  const answer = sequence.at(-1);
  const clue = difficulty === 1
    ? `첫 번째는 ${shape.sides}개이고, 도형 하나를 더 붙일 때마다 ${increment}개씩 늘어납니다.`
    : difficulty === 2
      ? `첫 번째는 ${shape.sides}개, 두 번째는 ${sequence[1]}개입니다.`
      : "그림을 보고 성냥개비가 몇 개씩 늘어나는지 찾아보세요.";

  return {
    prompt: `성냥개비로 ${shape.label}을 오른쪽으로 이어 만들어 나갑니다. 이웃한 두 ${shape.label}은 변 한 개를 함께 씁니다. ${shape.label} ${target}개를 만들려면 성냥개비가 모두 몇 개 필요할까요?`,
    visual: {
      kind: "matchstick-shape-sequence",
      shape: shape.label,
      sides: shape.sides,
      target,
      clue
    },
    answer: `${answer}개`,
    solution: `첫 번째 ${shape.label}에는 ${shape.sides}개가 필요합니다. ${shape.label} 하나를 더 붙일 때마다 함께 쓰는 변 한 개를 빼고 ${increment}개씩 더 필요합니다. ${sequence.join(" → ")}이므로 ${target}개를 만들 때는 성냥개비가 ${answer}개 필요합니다.`,
    meta: { difficulty, shape: shape.label, sides: shape.sides, target, increment, sequence, answer }
  };
}

function connectedLineDegreeSum({ difficulty = 2 }) {
  const config = difficulty === 1
    ? { rows: 2, columns: 3, extraMin: 0, extraMax: 3 }
    : difficulty === 2
      ? { rows: 3, columns: 3, extraMin: 3, extraMax: 6 }
      : { rows: 3, columns: 4, extraMin: 4, extraMax: 9 };
  const width = 340;
  const height = 205;
  const nodes = [];
  for (let row = 0; row < config.rows; row += 1) {
    for (let column = 0; column < config.columns; column += 1) {
      nodes.push({
        id: row * config.columns + column,
        x: 42 + column * (256 / (config.columns - 1)) + randomInt(-4, 4),
        y: 32 + row * (140 / (config.rows - 1)) + randomInt(-4, 4)
      });
    }
  }

  const edges = [];
  const edgeKeys = new Set();
  const addEdge = (first, second) => {
    const edge = first < second ? [first, second] : [second, first];
    const key = edge.join("-");
    if (edgeKeys.has(key)) return;
    edgeKeys.add(key);
    edges.push(edge);
  };
  for (let row = 0; row < config.rows; row += 1) {
    for (let column = 0; column < config.columns; column += 1) {
      const current = row * config.columns + column;
      if (column + 1 < config.columns) addEdge(current, current + 1);
      if (row + 1 < config.rows) addEdge(current, current + config.columns);
    }
  }

  const extraCandidates = [];
  for (let row = 0; row + 1 < config.rows; row += 1) {
    for (let column = 0; column + 1 < config.columns; column += 1) {
      const topLeft = row * config.columns + column;
      extraCandidates.push([topLeft, topLeft + config.columns + 1]);
      extraCandidates.push([topLeft + 1, topLeft + config.columns]);
    }
  }
  const extraCount = randomInt(config.extraMin, Math.min(config.extraMax, extraCandidates.length));
  shuffle(extraCandidates).slice(0, extraCount).forEach(([first, second]) => addEdge(first, second));

  const degrees = Array(nodes.length).fill(0);
  for (const [first, second] of edges) {
    degrees[first] += 1;
    degrees[second] += 1;
  }
  const answer = degrees.reduce((sum, degree) => sum + degree, 0);
  const shown = difficulty === 1 ? [randomInt(0, nodes.length - 1)] : [];
  const clue = difficulty === 1
    ? "숫자가 적힌 원처럼, 그 원에 닿은 줄만 세어 보세요."
    : "원을 차례로 보며 연결된 줄을 빠짐없이 세어 보세요.";

  return {
    prompt: "각각의 ○ 안에 그 원에 연결된 줄의 개수를 적습니다. 모든 ○ 안에 적을 수의 합은 얼마일까요?",
    visual: { kind: "connected-line-degree-sum", width, height, nodes, edges, degrees, shown, clue },
    answer: String(answer),
    solution: `선을 빠짐없이 세면 ${edges.length}개입니다. 선 하나는 양쪽 끝의 두 원에서 한 번씩 세므로 ${edges.length} + ${edges.length} = ${answer}입니다.`,
    meta: { difficulty, rows: config.rows, columns: config.columns, extraCount, nodes, edges, degrees, answer }
  };
}

function letterBlockTransform({ difficulty = 2 }) {
  const targetPools = {
    1: ["학", "산", "문", "별", "봄", "꿈", "달", "집", "꽃", "해", "강", "길", "눈", "비", "빛", "숲", "책", "수", "말", "공", "손", "발", "차", "배"],
    2: ["학", "봄", "꿈", "달", "집", "꽃", "해", "강", "길", "눈", "비", "빛", "숲", "책", "수", "말", "공", "손", "발", "차", "배", "별", "문", "산", "불", "물", "돌", "풀"],
    3: ["학교", "수학", "나무", "모양", "나라", "구름", "바다", "하늘", "사과", "기차", "토끼", "우산", "연필", "가방", "시계", "의자", "창문", "동물", "친구", "공원", "별빛", "눈꽃", "봄날", "여름", "가을", "겨울", "풍선", "그림", "숫자", "구슬"]
  };
  const target = sample(targetPools[difficulty] || targetPools[2]);
  const guide = difficulty === 1
    ? "반시계 방향으로 90도 돌린 뒤, 좌우로 뒤집습니다."
    : "보기의 글자가 어떻게 움직였는지 살펴보세요.";

  return {
    prompt: "다음과 같은 방법으로 글자 모양을 움직일 때, 빈 상자 안에 알맞은 그림을 그리세요.",
    visual: {
      kind: "letter-block-transform",
      example: "소마",
      target,
      guide
    },
    answer: "그림 답안",
    answerVisual: { kind: "letter-block-answer", word: target },
    solution: `보기의 글자를 반시계 방향으로 90도 돌린 뒤 좌우로 뒤집었습니다. '${target}'도 같은 순서로 움직여 그립니다.`,
    responseKind: "drawing",
    meta: {
      difficulty,
      example: "소마",
      target,
      operations: ["rotate-counterclockwise-90", "flip-left-right"]
    }
  };
}

function mixedSequences({ difficulty = 2 }) {
  const labels = ["㉠", "㉡", "㉢"];
  const growingStart = randomInt(1, difficulty === 3 ? 5 : 3);
  const growingFirstStep = difficulty === 3 ? randomInt(1, 2) : 1;
  const growing = [growingStart];
  for (let index = 1; index < 7; index += 1) {
    growing.push(growing.at(-1) + growingFirstStep + index - 1);
  }

  let sumPrevious;
  do {
    sumPrevious = [randomInt(1, 4), randomInt(3, 7)];
    while (sumPrevious.length < 7) sumPrevious.push(sumPrevious.at(-1) + sumPrevious.at(-2));
  } while (sumPrevious.at(-1) > 99 || sumPrevious[0] >= sumPrevious[1]);

  const oddStart = randomInt(1, 4);
  const evenStart = randomInt(2, 6);
  const oddStep = difficulty === 3 ? randomInt(1, 3) : 1;
  const evenStep = difficulty === 1 ? 2 : difficulty === 2 ? randomInt(2, 3) : randomInt(2, 4);
  const interleaved = Array.from({ length: 8 }, (_, index) => (
    index % 2 === 0
      ? oddStart + Math.floor(index / 2) * oddStep
      : evenStart + Math.floor(index / 2) * evenStep
  ));

  const blankIndexes = difficulty === 1
    ? [5, 6, 6]
    : difficulty === 2
      ? [5, 6, 0]
      : [randomInt(2, 5), randomInt(3, 5), randomInt(0, 5)];
  const clues = difficulty === 1
    ? ["더하는 수가 1씩 커집니다.", "앞의 두 수를 더합니다.", "한 칸씩 건너뛴 수를 따로 봅니다."]
    : ["", "", ""];
  const values = [growing, sumPrevious, interleaved];
  const rows = values.map((terms, index) => ({
    label: `(${index + 1})`,
    terms,
    blankIndex: blankIndexes[index],
    answerLabel: labels[index],
    clue: clues[index]
  }));
  const answers = rows.map((row) => row.terms[row.blankIndex]);

  return {
    prompt: "다음은 일정한 규칙에 따라 수를 늘어놓은 것입니다. 빈칸에 들어갈 수를 쓰세요.",
    visual: { kind: "mixed-sequences", rows },
    answer: labels.map((label, index) => `${label} ${answers[index]}`).join(", "),
    solution: `${labels[0]}은 더하는 수가 ${growingFirstStep}, ${growingFirstStep + 1}, ${growingFirstStep + 2}처럼 1씩 커지는 규칙입니다. ${labels[1]}은 앞의 두 수를 더해 다음 수를 만드는 규칙입니다. ${labels[2]}은 한 칸씩 건너뛴 두 수열을 따로 보면 됩니다. 따라서 ${labels.map((label, index) => `${label}=${answers[index]}`).join(", ")}입니다.`,
    meta: {
      difficulty,
      rules: ["growing-difference", "sum-previous-two", "interleaved"],
      rows,
      answers,
      parameters: { growingStart, growingFirstStep, oddStart, evenStart, oddStep, evenStep }
    }
  };
}

function neitherSetCount({ difficulty = 2 }) {
  const contexts = [
    { group: "학급", first: "형이 있는", second: "누나가 있는", unit: "명" },
    { group: "반", first: "축구를 좋아하는", second: "야구를 좋아하는", unit: "명" },
    { group: "모임", first: "사과를 좋아하는", second: "포도를 좋아하는", unit: "명" }
  ];
  const context = sample(contexts);
  const both = randomInt(difficulty === 1 ? 1 : 2, difficulty === 3 ? 7 : 5);
  const firstOnly = randomInt(difficulty === 1 ? 3 : 6, difficulty === 3 ? 18 : 13);
  const secondOnly = randomInt(difficulty === 1 ? 2 : 4, difficulty === 3 ? 15 : 11);
  const neither = randomInt(difficulty === 1 ? 3 : 6, difficulty === 3 ? 18 : 13);
  const firstTotal = firstOnly + both;
  const secondTotal = secondOnly + both;
  const total = firstOnly + both + secondOnly + neither;
  let prompt;
  let solution;
  let shown;

  if (difficulty === 1) {
    prompt = `${context.group}에는 모두 ${total}${context.unit}이 있습니다. ${context.first} 사람만 ${firstOnly}${context.unit}, ${context.second} 사람만 ${secondOnly}${context.unit}, 두 가지에 모두 해당하는 사람은 ${both}${context.unit}입니다. 어느 쪽에도 해당하지 않는 사람은 몇 ${context.unit}일까요?`;
    solution = `두 가지 중 적어도 하나에 해당하는 사람은 ${firstOnly} + ${both} + ${secondOnly} = ${firstOnly + both + secondOnly}${context.unit}입니다. 전체 ${total}${context.unit}에서 빼면 ${total} - ${firstOnly + both + secondOnly} = ${neither}${context.unit}입니다.`;
    shown = { mode: "parts", firstOnly, both, secondOnly };
  } else if (difficulty === 2) {
    prompt = `${context.group}에는 모두 ${total}${context.unit}이 있습니다. ${context.first} 사람은 ${firstTotal}${context.unit}, ${context.second} 사람은 ${secondTotal}${context.unit}이고, 두 가지에 모두 해당하는 사람은 ${both}${context.unit}입니다. 어느 쪽에도 해당하지 않는 사람은 몇 ${context.unit}일까요?`;
    const union = firstTotal + secondTotal - both;
    solution = `두 가지에 모두 해당하는 ${both}${context.unit}을 두 번 세지 않도록 한 번 뺍니다. ${firstTotal} + ${secondTotal} - ${both} = ${union}${context.unit}이 적어도 하나에 해당합니다. 따라서 ${total} - ${union} = ${neither}${context.unit}입니다.`;
    shown = { mode: "totals", firstTotal, secondTotal, both };
  } else {
    prompt = `${context.group}에는 모두 ${total}${context.unit}이 있습니다. ${context.first} 사람은 ${firstTotal}${context.unit}, ${context.second} 사람은 ${secondTotal}${context.unit}이고, ${context.first} 사람만 ${firstOnly}${context.unit}입니다. 어느 쪽에도 해당하지 않는 사람은 몇 ${context.unit}일까요?`;
    const overlap = firstTotal - firstOnly;
    const union = firstTotal + secondTotal - overlap;
    solution = `두 가지에 모두 해당하는 사람은 ${firstTotal} - ${firstOnly} = ${overlap}${context.unit}입니다. 적어도 하나에 해당하는 사람은 ${firstTotal} + ${secondTotal} - ${overlap} = ${union}${context.unit}이므로, ${total} - ${union} = ${neither}${context.unit}입니다.`;
    shown = { mode: "hidden-overlap", firstOnly, firstTotal, secondTotal };
  }

  return {
    prompt,
    visual: {
      kind: "venn-neither",
      first: context.first,
      second: context.second,
      unit: context.unit,
      total,
      shown
    },
    answer: `${neither}${context.unit}`,
    solution,
    meta: { difficulty, context, firstOnly, secondOnly, both, neither, firstTotal, secondTotal, total }
  };
}

function hiddenScoreRanking({ difficulty = 2 }) {
  const names = shuffle(["수종", "세윤", "현희", "도연", "민서", "지우", "하린", "준호"]).slice(0, difficulty === 3 ? 5 : 4);
  let hundred;
  let baseTen;
  do {
    hundred = randomInt(2, 8);
    baseTen = randomInt(1, 7);
  } while (hundred === baseTen + 1);

  const upperTen = baseTen + 2;
  const middleTen = baseTen + 1;
  const symbols = ["●", "★", "◆", "■"];
  const score = (a, b, c) => a * 100 + b * 10 + c;
  const rows = difficulty === 3
    ? [
        { name: names[0], score: score(hundred, upperTen, 0), rank: 1 },
        { name: names[1], score: score(hundred, middleTen, 1), blankIndex: 1, symbol: symbols[0], rank: 2 },
        { name: names[2], score: score(hundred, baseTen, 2), blankIndex: 0, symbol: symbols[1], rank: 3 },
        { name: names[3], score: score(hundred, baseTen, 1), blankIndex: 2, symbol: symbols[2], rank: 4 },
        { name: names[4], score: score(hundred, baseTen, 0), blankIndex: 2, symbol: symbols[3], rank: 5 }
      ]
    : [
        { name: names[0], score: score(hundred, upperTen, 0), rank: 1 },
        { name: names[1], score: score(hundred, middleTen, 1), blankIndex: 1, symbol: symbols[0], rank: 2 },
        { name: names[2], score: score(hundred, baseTen, 1), blankIndex: 0, symbol: symbols[1], rank: 3 },
        { name: names[3], score: score(hundred, baseTen, 0), blankIndex: 2, symbol: symbols[2], rank: 4 }
      ];
  const hiddenRows = rows.filter((row) => row.blankIndex !== undefined);
  const hiddenDigits = hiddenRows.map((row) => Number(String(row.score)[row.blankIndex]));
  const candidates = difficulty === 1 ? shuffle(hiddenDigits) : null;
  const candidateSentence = candidates ? ` 가려진 곳에 들어갈 숫자는 ${candidates.join(", ")}이고, 한 번씩만 사용합니다.` : "";
  const answer = hiddenRows.map((row) => `${row.name} ${row.score}장`).join(", ");
  const symbolAnswer = hiddenRows.map((row, index) => `${row.symbol}=${hiddenDigits[index]}`).join(", ");
  const solution = difficulty === 3
    ? `${symbols[1]}은 앞뒤 점수의 백의 자리를 비교하면 ${hundred}입니다. 그러면 ${symbols[0]}은 ${baseTen}보다 크고 ${upperTen}보다 작으므로 ${middleTen}입니다. 마지막 두 점수는 ${hundred}${baseTen}2보다 작으면서 서로 다른 숫자를 써야 하므로 ${symbols[2]}=1, ${symbols[3]}=0입니다. 따라서 ${symbolAnswer}이고, 점수는 ${answer}입니다.`
    : `${symbols[1]}은 앞뒤 점수의 백의 자리를 비교하면 ${hundred}입니다. ${symbols[2]}은 ${hundred}${baseTen}1보다 작은 ${hundred}${baseTen}${symbols[2]}의 일의 자리이므로 0입니다. ${symbols[0]}은 ${baseTen}보다 크고 ${upperTen}보다 작으므로 ${middleTen}입니다. 따라서 ${symbolAnswer}이고, 점수는 ${answer}입니다.`;

  return {
    prompt: `다음은 친구들이 모은 우표의 수를 많이 모은 순서대로 나타낸 표입니다. 가려진 숫자는 모두 다릅니다.${candidateSentence} 가려진 친구들의 우표 수를 각각 구하세요.`,
    visual: { kind: "hidden-score-ranking", rows, candidates },
    answer,
    solution,
    meta: { difficulty, rows, hiddenDigits, symbols: hiddenRows.map((row) => row.symbol), hundred, baseTen, upperTen, middleTen }
  };
}

function twoDigitEvenCount({ difficulty = 2 }) {
  const cardCount = difficulty === 1 ? 3 : difficulty === 2 ? 4 : 5;
  const pool = difficulty === 3 ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9] : [1, 2, 3, 4, 5, 6, 7, 8, 9];
  let cards;
  let numbers;
  do {
    cards = shuffle(pool).slice(0, cardCount).sort((a, b) => a - b);
    numbers = [];
    for (const tens of cards) {
      for (const ones of cards) {
        if (tens !== 0 && tens !== ones && ones % 2 === 0) numbers.push(tens * 10 + ones);
      }
    }
  } while (numbers.length < 2 || new Set(numbers).size !== numbers.length || (difficulty === 3 && !cards.includes(0)));

  const sortedNumbers = [...numbers].sort((a, b) => a - b);
  const zeroNote = cards.includes(0) ? " 0은 십의 자리에 놓을 수 없습니다." : "";
  return {
    prompt: `아래 ${cardCount}장의 수 카드 중 두 장을 한 번씩 사용하여 두 자리 짝수를 만들려고 합니다. 만들 수 있는 두 자리 짝수는 모두 몇 개일까요?${zeroNote}`,
    visual: { kind: "even-card-count", cards: shuffle(cards) },
    answer: `${sortedNumbers.length}개`,
    solution: `일의 자리에 짝수 카드를 놓고, 남은 카드 중 0이 아닌 카드를 십의 자리에 놓습니다. 만들 수 있는 수는 ${sortedNumbers.join(", ")}로 모두 ${sortedNumbers.length}개입니다.`,
    meta: { difficulty, cards, numbers: sortedNumbers, cardCount }
  };
}

function reverseInitialCount({ difficulty = 2 }) {
  const contexts = [
    { place: "생일 파티", subject: "친구", unit: "명" },
    { place: "놀이방", subject: "어린이", unit: "명" },
    { place: "체험 교실", subject: "학생", unit: "명" }
  ];
  const context = sample(contexts);
  const operationCount = difficulty === 1 ? 2 : difficulty === 2 ? 4 : 6;
  let initial;
  let operations;
  let final;
  do {
    initial = randomInt(difficulty === 1 ? 6 : 9, difficulty === 3 ? 24 : 18);
    operations = Array.from({ length: operationCount }, (_, index) => ({
      delta: (index % 2 === 0 ? 1 : -1) * randomInt(2, difficulty === 3 ? 9 : 7)
    }));
    if (Math.random() < 0.5) operations = operations.map((item) => ({ delta: -item.delta }));
    let current = initial;
    let valid = true;
    for (const operation of operations) {
      current += operation.delta;
      if (current < 2) valid = false;
    }
    final = current;
    if (!valid) final = -1;
  } while (final < 2 || final > 35);

  const actionText = operations.map((operation, index) => {
    const action = operation.delta > 0 ? `${operation.delta}${context.unit}이 더 왔습니다` : `${Math.abs(operation.delta)}${context.unit}이 갔습니다`;
    return `${index === 0 ? "모인 뒤" : "그 다음"} ${action}`;
  }).join(". ");
  const reverseSteps = [...operations].reverse().map((operation) => operation.delta > 0 ? `-${operation.delta}` : `+${Math.abs(operation.delta)}`);
  return {
    prompt: `${context.subject}들이 ${context.place}에 모였습니다. ${actionText}. 마지막에 ${final}${context.unit}이 남아 있다면 처음에 있던 ${context.subject}은 몇 ${context.unit}이었을까요?`,
    visual: { kind: "reverse-count-timeline", operations, final, unit: context.unit },
    answer: `${initial}${context.unit}`,
    solution: `마지막 ${final}${context.unit}부터 일어난 일을 거꾸로 되돌립니다. ${final} ${reverseSteps.join(" ")} = ${initial}이므로 처음에는 ${initial}${context.unit}이 있었습니다.`,
    meta: { difficulty, context, initial, operations, final, operationCount }
  };
}

function eraseExpressionTarget({ difficulty = 2 }) {
  const termCount = difficulty === 1 ? 2 : difficulty === 2 ? 3 : 4;
  let first;
  let terms;
  let removeIndex;
  let target;
  let fullValue;
  do {
    first = randomInt(difficulty === 1 ? 12 : 20, difficulty === 3 ? 55 : 42);
    const magnitudes = shuffle(Array.from({ length: 14 }, (_, index) => index + 2)).slice(0, termCount);
    terms = magnitudes.map((value, index) => ({ sign: (index + randomInt(0, 1)) % 2 === 0 ? 1 : -1, value }));
    const signed = terms.map((term) => term.sign * term.value);
    removeIndex = randomInt(0, terms.length - 1);
    fullValue = first + signed.reduce((sum, value) => sum + value, 0);
    target = fullValue - signed[removeIndex];
  } while (target < 1 || target > 60 || fullValue < 1 || terms.some((term, index) => index !== removeIndex && term.sign * term.value === terms[removeIndex].sign * terms[removeIndex].value));

  const expression = `${first}${terms.map((term) => `${term.sign > 0 ? "+" : "-"}${term.value}`).join("")}`;
  const removed = `${terms[removeIndex].sign > 0 ? "+" : "-"}${terms[removeIndex].value}`;
  return {
    prompt: "아래 식이 성립하도록 필요 없는 부분 한 곳을 X로 지우세요. 부호와 수를 함께 지워야 합니다.",
    visual: { kind: "erase-expression-target", first, terms, target },
    answer: removed,
    solution: `${removed}을 지우면 ${expression.replace(removed, "")} = ${target}가 되어 식이 성립합니다.`,
    meta: { difficulty, first, terms, removeIndex, removed, target, fullValue, termCount }
  };
}

function collectionRepeatGap({ difficulty = 2 }) {
  const step = difficulty === 3 ? randomInt(1, 2) : 1;
  const halfGap = difficulty === 1 ? randomInt(2, 3) : difficulty === 2 ? randomInt(4, 5) : randomInt(6, 8);
  const start = randomInt(1, difficulty === 3 ? 5 : 4);
  const firstSum = 2 * start + halfGap * step;
  const secondSum = firstSum + step;
  const circleCount = halfGap * 2 + 2;
  const circles = [start];
  for (let index = 0; index < circleCount - 1; index += 1) {
    const target = index % 2 === 0 ? firstSum : secondSum;
    circles.push(target - circles.at(-1));
  }
  const betweenCount = circleCount - 2;
  const shownCircles = circles.slice(0, difficulty === 1 ? 4 : 3);
  return {
    prompt: `이웃한 두 원 안의 수를 더한 값이 네모 안에서 ${firstSum}, ${secondSum}, ${firstSum}, ${secondSum}, …와 같이 반복됩니다. 처음 나온 수 ${start}부터 다음에 같은 수 ${start}가 나올 때까지, 그 사이에는 원 안의 수가 몇 개 있을까요?`,
    visual: { kind: "collection-repeat-gap", circles, shownCircles, sums: [firstSum, secondSum], start },
    answer: `${betweenCount}개`,
    solution: `원을 차례로 채우면 ${circles.join(", ")}입니다. 처음과 끝의 ${start}를 빼면 그 사이에는 ${betweenCount}개의 수가 있습니다.`,
    meta: { difficulty, step, halfGap, start, firstSum, secondSum, circles, circleCount, betweenCount }
  };
}

function solveMixedOperationCards(cards, base, target, extraTarget, given) {
  return permutations(cards).filter((values) => (
    base + values[0] === values[1]
    && base * values[2] === values[3]
    && values[1] - values[4] === target
    && (extraTarget == null || values[3] - values[5] === extraTarget)
    && (!given || values[given.index] === given.value)
  ));
}

function mixedOperationCardEquation({ difficulty = 2 }) {
  let base;
  let target;
  let extraTarget = null;
  let solution;
  let allCards;
  let given = null;
  let solutions;
  let attempts = 0;

  do {
    base = difficulty === 3 ? randomInt(2, 4) : 2;
    const addend = randomInt(difficulty === 1 ? 3 : 5, difficulty === 3 ? 14 : 11);
    const multiplier = randomInt(2, difficulty === 3 ? 9 : 7);
    const sum = base + addend;
    const product = base * multiplier;
    target = randomInt(1, sum - 1);
    const subtrahend = sum - target;
    solution = [addend, sum, multiplier, product, subtrahend];
    if (difficulty === 3) {
      extraTarget = randomInt(1, product - 1);
      solution.push(product - extraTarget);
    }
    allCards = [...solution];
    given = difficulty === 1 ? { index: 2, value: multiplier } : null;
    solutions = new Set(allCards).size === allCards.length
      ? solveMixedOperationCards(allCards, base, target, extraTarget, given)
      : [];
    attempts += 1;
  } while (solutions.length !== 1 && attempts < 1000);

  if (solutions.length !== 1) return mixedOperationCardEquation({ difficulty });
  const availableCards = allCards.filter((_, index) => !given || index !== given.index);
  const [addend, sum, multiplier, product, subtrahend, extraSubtrahend] = solution;
  const equations = [`${base} + ${addend} = ${sum}`, `${base} × ${multiplier} = ${product}`, `${sum} - ${subtrahend} = ${target}`];
  if (difficulty === 3) equations.push(`${product} - ${extraSubtrahend} = ${extraTarget}`);
  return {
    prompt: `${given ? "이미 놓인 수를 제외한 " : ""}숫자 카드 ${availableCards.length}장을 빈칸에 한 번씩만 넣어 모든 식을 완성하세요.`,
    visual: { kind: "mixed-operation-cards", cards: shuffle(availableCards), base, target, extraTarget, given },
    answer: equations.join(", "),
    solution: `윗줄의 덧셈과 왼쪽의 곱셈을 먼저 맞춘 뒤, 윗줄의 결과에서 오른쪽 수를 빼어 ${target}${difficulty === 3 ? `, 왼쪽 곱셈의 결과에서 아래 수를 빼어 ${extraTarget}` : ""}이 되는지 확인합니다. ${equations.join(", ")}입니다.`,
    meta: { difficulty, base, target, extraTarget, given, allCards, availableCards, solution, solutionCount: solutions.length }
  };
}

function enumerateTwoDigitCards(cards, lowerExclusive, upperExclusive) {
  const values = new Set();
  cards.forEach((tens, tensIndex) => cards.forEach((ones, onesIndex) => {
    if (tensIndex === onesIndex || tens === 0) return;
    const value = tens * 10 + ones;
    if ((lowerExclusive == null || value > lowerExclusive) && value < upperExclusive) values.add(value);
  }));
  return [...values].sort((a, b) => a - b);
}

function twoDigitCardEnumeration({ difficulty = 2 }) {
  const cardCount = difficulty === 1 ? 4 : difficulty === 2 ? 5 : 6;
  let cards;
  let lowerExclusive;
  let upperExclusive;
  let answers;
  let attempts = 0;
  do {
    cards = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, cardCount);
    if (difficulty === 1) {
      lowerExclusive = null;
      upperExclusive = sample([30, 40, 50]);
    } else if (difficulty === 2) {
      lowerExclusive = null;
      upperExclusive = sample([30, 40, 50, 60, 70]);
    } else {
      lowerExclusive = randomInt(12, 48);
      upperExclusive = Math.min(89, lowerExclusive + randomInt(18, 36));
    }
    answers = enumerateTwoDigitCards(cards, lowerExclusive, upperExclusive);
    attempts += 1;
  } while ((answers.length < (difficulty === 1 ? 3 : 5) || answers.length > (difficulty === 1 ? 6 : difficulty === 2 ? 12 : 14)) && attempts < 1000);

  if (answers.length < 3) return twoDigitCardEnumeration({ difficulty });
  const condition = lowerExclusive == null
    ? `${upperExclusive}보다 작은`
    : `${lowerExclusive}보다 크고 ${upperExclusive}보다 작은`;
  return {
    prompt: `숫자 카드 중에서 2장을 골라 두 자리 수를 만들 때, ${condition} 수를 모두 쓰세요. 같은 카드는 한 수에 한 번만 쓸 수 있습니다.`,
    visual: { kind: "two-digit-card-enumeration", cards: shuffle(cards), condition },
    responseKind: "list",
    answer: answers.join(", "),
    solution: `십의 자리에 0을 놓지 않고, 같은 카드를 두 번 쓰지 않도록 차례로 만듭니다. 조건에 맞는 수는 ${answers.join(", ")}입니다.`,
    meta: { difficulty, cards, lowerExclusive, upperExclusive, answers, answerCount: answers.length }
  };
}

function numberCardEquation({ difficulty = 2 }) {
  const cardMin = difficulty === 1 ? 10 : difficulty === 2 ? 20 : 35;
  const cardMax = difficulty === 1 ? 45 : difficulty === 2 ? 79 : 99;
  let first;
  let second;
  let third;
  let target;
  do {
    first = randomInt(cardMin, cardMax);
    second = randomInt(cardMin, cardMax);
    third = randomInt(cardMin, cardMax);
    target = first + second - third;
  } while (new Set([first, second, third]).size !== 3 || target < cardMin || target > (difficulty === 3 ? 130 : 99));
  const cards = shuffle([first, second, third]);
  return {
    prompt: "숫자 카드 세 장을 한 번씩 모두 사용하여 다음 식을 완성하세요.",
    visual: { kind: "number-card-plus-minus", values: cards, target },
    answer: `${first} + ${second} - ${third} = ${target}`,
    solution: `세 수 중에서 먼저 더할 두 수와 뺄 수를 정합니다. ${first} + ${second} - ${third} = ${target}입니다. 곱셈과 나눗셈은 사용하지 않습니다.`
  };
}

function permutations(values) {
  if (values.length < 2) return [values];
  return values.flatMap((value, index) => permutations([...values.slice(0, index), ...values.slice(index + 1)])
    .map((tail) => [value, ...tail]));
}

function indexCombinations(values, count) {
  if (count === 0) return [[]];
  if (values.length < count) return [];
  return values.flatMap((value, index) => indexCombinations(values.slice(index + 1), count - 1)
    .map((tail) => [value, ...tail]));
}

const EQUAL_LINE_EIGHT_LAYOUTS = permutations([1, 2, 3, 4, 5, 6, 7, 8])
  .map((values) => ({ values, sum: values[0] + values[1] + values[2] }))
  .filter(({ values, sum }) => (
    values[2] + values[3] + values[4] === sum
    && values[4] + values[5] + values[6] === sum
    && values[6] + values[7] + values[0] === sum
  ));

function edgeSumCycle({ difficulty = 2 }) {
  const max = 12;
  let cards;
  let solution;
  let edges;
  let given = null;
  do {
    solution = shuffle(Array.from({ length: max }, (_, index) => index + 1)).slice(0, 4);
    edges = [
      solution[0] + solution[1],
      solution[1] + solution[2],
      solution[2] + solution[3],
      solution[3] + solution[0]
    ];
    cards = [...solution];
    if (difficulty === 3) {
      const distractor = shuffle(Array.from({ length: max }, (_, index) => index + 1).filter((value) => !solution.includes(value)))[0];
      cards.push(distractor);
    }
  } while (permutations(cards).filter((candidate) => (
    candidate[0] + candidate[1] === edges[0]
    && candidate[1] + candidate[2] === edges[1]
    && candidate[2] + candidate[3] === edges[2]
    && candidate[3] + candidate[0] === edges[3]
  )).length !== 1);

  if (difficulty === 1) {
    const index = randomInt(0, 3);
    given = { index, value: solution[index] };
  }

  const [topLeft, topRight, bottomRight, bottomLeft] = solution;
  const cardInstruction = difficulty === 3 ? "주어진 수 카드 중 네 장을 골라 한 번씩 사용하여" : "주어진 수 카드를 한 번씩 모두 사용하여";
  return {
    prompt: `${cardInstruction} 네 원 안에 넣으세요. 각 변에 적힌 수는 양끝 원 안의 두 수의 합입니다.`,
    visual: { kind: "edge-sum-cycle", values: shuffle(cards), edges, given },
    answer: `왼쪽 위 ${topLeft}, 오른쪽 위 ${topRight}, 오른쪽 아래 ${bottomRight}, 왼쪽 아래 ${bottomLeft}`,
    solution: "윗변에 적힌 합을 만드는 두 수를 먼저 찾습니다. 이어서 오른쪽 변, 아랫변, 왼쪽 변의 합을 차례로 확인하면 네 자리가 하나로 정해집니다.",
    meta: { difficulty, cards, solution, edges, given }
  };
}

function gridNumberPlacementFive({ difficulty = 2 }) {
  let cards;
  let layout;
  let distractor = null;
  let comparison = null;
  do {
    if (difficulty === 3) {
      cards = shuffle(Array.from({ length: 12 }, (_, index) => index + 1)).slice(0, 6);
      layout = cards.slice(0, 5);
      distractor = cards[5];
      const target = layout[1];
      const top = layout[0];
      if (target > top && distractor <= top) comparison = "큽니다";
      else if (target < top && distractor >= top) comparison = "작습니다";
      else comparison = null;
    } else {
      const start = difficulty === 1 ? 1 : randomInt(1, 4);
      cards = Array.from({ length: 5 }, (_, index) => start + index);
      layout = shuffle(cards);
    }
  } while (difficulty === 3 && comparison === null);

  const [top, target, center, right, bottom] = layout;
  const clues = [
    `${center}의 왼쪽에 ${numberSubject(right)} 있습니다.`,
    `${numberSubject(bottom)} ${right} 바로 아래에 있습니다.`,
    `${numberSubject(top)} ${center}의 위에 있습니다.`
  ];
  const given = difficulty === 1 ? { position: "top", value: top } : null;
  const extra = difficulty === 3 ? `㉠에 들어갈 수는 ${top}보다 ${comparison}` : "";

  return {
    prompt: "주어진 조건을 보고 다섯 칸에 수 카드를 한 번씩 넣을 때, ㉠에 들어갈 수를 구하세요.",
    visual: { kind: "five-cell-placement", cards: shuffle(cards), clues, given, extra },
    answer: String(target),
    solution: `${center}의 왼쪽에 ${numberSubject(right)} 있으므로 가운데 두 칸에 ${numberAnd(center)} ${numberObject(right)} 놓습니다. ${numberSubject(bottom)} ${right} 바로 아래에 있고, ${numberSubject(top)} ${center}의 위에 있습니다. 남은 수${difficulty === 3 ? ` 중 ${top}보다 ${comparison === "큽니다" ? "큰" : "작은"}` : ""} ${numberSubject(target)} ㉠에 들어갑니다.`,
    meta: { difficulty, cards, layout, distractor, comparison, clues, given, answer: target }
  };
}

function equalizeTransfer({ difficulty = 2 }) {
  const lower = randomInt(difficulty === 1 ? 4 : difficulty === 2 ? 6 : 10, difficulty === 1 ? 8 : difficulty === 2 ? 12 : 15);
  const transfer = randomInt(1, difficulty === 1 ? 3 : difficulty === 2 ? 4 : 5);
  const higher = lower + transfer * 2;
  const names = Math.random() < 0.5 ? ["강준", "다현"] : ["유진", "민서"];
  return {
    prompt: "두 친구가 사탕을 똑같이 가지려고 합니다. 사탕이 많은 친구가 적은 친구에게 몇 개를 주어야 하는지 구하세요.",
    visual: { kind: "equalize-bags", names, higher, lower },
    answer: `${transfer}개`,
    solution: `두 사람의 사탕 수 차이는 ${higher - lower}개입니다. 한 개를 주면 한쪽은 1개 줄고 다른 쪽은 1개 늘므로, 차이의 반인 ${transfer}개를 주면 같습니다.`,
    meta: { difficulty, higher, lower, transfer }
  };
}

function totalDifferenceShare({ difficulty = 2 }) {
  const names = shuffle(["윤서", "다빈", "지우", "민호", "서윤", "도윤"]);
  const largerName = names[0];
  const smallerName = names[1];
  const base = randomInt(difficulty === 1 ? 4 : difficulty === 2 ? 6 : 8, difficulty === 1 ? 8 : difficulty === 2 ? 13 : 15);
  const transfer = difficulty === 3 ? randomInt(1, 3) : 0;
  const afterDifference = difficulty === 3 ? shuffle([2, 4, 6])[0] : 0;
  const difference = difficulty === 1 ? 2 : difficulty === 2 ? shuffle([2, 4, 6])[0] : afterDifference + transfer * 2;
  const larger = base + difference;
  const smaller = base;
  const total = larger + smaller;
  // 파이널 2회 18번의 원본은 형제 나이(합 21·차 5 → 13살)다. 큐브 나누기와 셈이 같은 문제라
  // 유형을 쪼개지 않고 시나리오만 늘린다. 난이도 3은 주고받기 비틀기라 나이 표현이 안 맞아 제외한다.
  const agePair = difficulty !== 3 && Math.random() < 0.5 ? sample([["형", "동생"], ["언니", "동생"], ["누나", "동생"]]) : null;
  if (agePair) {
    return {
      prompt: `${koreanParticle(agePair[0], "과", "와")} ${agePair[1]}의 나이의 합은 ${total}살인데 ${koreanParticle(agePair[0], "이", "가")} ${agePair[1]}보다 ${difference}살 더 많습니다. ${koreanParticle(agePair[0], "은", "는")} 몇 살입니까?`,
      visual: { kind: "total-difference-share", total, difference, transfer: 0, afterDifference: 0, showHint: difficulty === 1 },
      answer: `${larger}살`,
      solution: `합 ${total}에서 차 ${difference}를 빼면 ${agePair[1]} 나이의 두 배인 ${total - difference}이 됩니다. ${agePair[1]}은 ${smaller}살이고 ${agePair[0]}은 ${smaller} + ${difference} = ${larger}살입니다.`,
      meta: { difficulty, largerName: agePair[0], smallerName: agePair[1], base, transfer: 0, afterDifference: 0, difference, larger, smaller, total, scenario: "age" }
    };
  }
  const prompt = difficulty === 3
    ? `${total}개의 큐브가 있습니다. 처음에는 ${koreanParticle(largerName, "이", "가")} ${smallerName}보다 더 많이 갖고 있었습니다. ${koreanParticle(largerName, "이", "가")} ${smallerName}에게 ${transfer}개를 주었더니 ${largerName}의 큐브가 ${afterDifference}개 더 많았습니다. ${koreanParticle(largerName, "은", "는")} 처음에 큐브를 몇 개 가지고 있었습니까?`
    : `${total}개의 큐브가 있습니다. ${koreanParticle(largerName, "이", "가")} ${smallerName}보다 큐브를 ${difference}개 더 많이 가지려고 합니다. ${koreanParticle(largerName, "은", "는")} 큐브를 몇 개 가져야 합니까?`;
  return {
    prompt,
    visual: { kind: "total-difference-share", total, difference, transfer, afterDifference, showHint: difficulty === 1 },
    answer: `${larger}개`,
    solution: `${difficulty === 3 ? `${transfer}개를 주면 두 사람의 차이는 ${transfer * 2}개 줄어드므로, 처음 차이는 ${difference}개입니다. ` : ""}전체에서 차이 ${difference}개를 먼저 떼어 놓으면 ${total - difference}개가 남습니다. 남은 큐브를 똑같이 나누면 한 사람당 ${base}개이고, 더 많이 가진 ${largerName}의 큐브는 ${base}+${difference}=${larger}개입니다.`,
    meta: { difficulty, largerName, smallerName, base, transfer, afterDifference, difference, larger, smaller, total }
  };
}

function totalDifferenceCandyShare({ difficulty = 2 }) {
  const names = shuffle(["윤서", "다빈", "지우", "민호", "서윤", "도윤"]);
  const largerName = names[0];
  const smallerName = names[1];
  const base = randomInt(difficulty === 1 ? 4 : difficulty === 2 ? 7 : 9, difficulty === 1 ? 8 : difficulty === 2 ? 14 : 16);
  const transfer = difficulty === 3 ? randomInt(1, 3) : 0;
  const afterDifference = difficulty === 3 ? sample([2, 4, 6]) : 0;
  const difference = difficulty === 1 ? 2 : difficulty === 2 ? sample([2, 4, 6, 8]) : afterDifference + transfer * 2;
  const larger = base + difference;
  const smaller = base;
  const total = larger + smaller;
  const prompt = difficulty === 3
    ? `${total}개의 사탕이 있습니다. 처음에는 ${koreanParticle(largerName, "이", "가")} ${smallerName}보다 더 많이 가지고 있었습니다. ${koreanParticle(largerName, "이", "가")} ${smallerName}에게 ${transfer}개를 주었더니 ${largerName}의 사탕이 ${afterDifference}개 더 많았습니다. ${koreanParticle(largerName, "은", "는")} 처음에 사탕을 몇 개 가지고 있었습니까?`
    : `${total}개의 사탕이 있습니다. ${koreanParticle(largerName, "이", "가")} ${smallerName}보다 사탕을 ${difference}개 더 많이 가지려고 합니다. ${koreanParticle(largerName, "은", "는")} 사탕을 몇 개 가져야 합니까?`;
  return {
    prompt,
    visual: { kind: "total-difference-candy", total, difference, transfer, afterDifference, showHint: difficulty === 1 },
    answer: `${larger}개`,
    solution: `${difficulty === 3 ? `${transfer}개를 주면 두 사람의 차이는 ${transfer * 2}개 줄어드므로, 처음 차이는 ${difference}개입니다. ` : ""}전체에서 차이 ${difference}개를 먼저 떼어 놓으면 ${total - difference}개가 남습니다. 남은 사탕을 똑같이 나누면 한 사람당 ${base}개이고, 더 많이 가진 ${largerName}의 사탕은 ${base}+${difference}=${larger}개입니다.`,
    meta: { difficulty, largerName, smallerName, base, transfer, afterDifference, difference, larger, smaller, total }
  };
}

function solveFiveCardPyramid(cards, target, given) {
  const layouts = new Map();
  const omittedIndexes = cards.length === 5 ? [-1] : cards.map((_, index) => index);
  omittedIndexes.forEach((omittedIndex) => {
    const used = omittedIndex < 0 ? cards : cards.filter((_, index) => index !== omittedIndex);
    permutations(used).forEach((values) => {
      if (values[0] + values[1] !== values[3] || values[1] + values[2] !== values[4] || values[3] + values[4] !== target) return;
      if (given && values[given.index] !== given.value) return;
      layouts.set(values.join(","), { values, omitted: omittedIndex < 0 ? null : cards[omittedIndex] });
    });
  });
  return [...layouts.values()];
}

function fiveCardSumPyramid({ difficulty = 2 }) {
  let cards;
  let target;
  let given;
  let distractor = null;
  let layouts;
  let attempts = 0;
  do {
    const max = difficulty === 1 ? 5 : difficulty === 2 ? 8 : 10;
    const bottom = [randomInt(1, max), randomInt(1, max), randomInt(1, max)];
    const solution = [bottom[0], bottom[1], bottom[2], bottom[0] + bottom[1], bottom[1] + bottom[2]];
    if (new Set(solution).size !== 5) {
      layouts = [];
      attempts += 1;
      continue;
    }
    cards = [...solution];
    target = solution[3] + solution[4];
    given = difficulty === 1 ? { index: 0, value: solution[0] } : null;
    if (difficulty === 3) {
      distractor = randomInt(1, Math.max(...solution) + 4);
      if (cards.includes(distractor)) {
        layouts = [];
        attempts += 1;
        continue;
      }
      cards.push(distractor);
    }
    layouts = solveFiveCardPyramid(cards, target, given);
    attempts += 1;
  } while ((layouts.length < 1
    || layouts.length > 6
    || new Set(layouts.map((layout) => layout.values[1])).size !== 1
    || (difficulty === 3 && (new Set(layouts.map((layout) => layout.omitted)).size !== 1 || layouts[0].omitted !== distractor)))
    && attempts < 1000);

  if (!layouts.length) return fiveCardSumPyramid({ difficulty });
  const answer = layouts[0].values[1];
  const example = layouts[0].values;
  const availableCards = cards.filter((_, index) => !given || index !== given.index);
  return {
    prompt: `${difficulty === 3 ? "숫자 카드 6장 중 5장을 골라" : `숫자 카드 ${availableCards.length}장을`} 빈칸에 한 번씩 넣으세요. 이웃한 아래 두 수를 더한 값이 바로 위 칸의 수가 될 때, ㉠에 들어갈 수를 구하세요.`,
    visual: { kind: "five-card-pyramid", cards: shuffle(availableCards), target, given },
    answer: String(answer),
    solution: `아래층을 ${example[0]}, ${example[1]}, ${numberAs(example[2])} 놓으면 가운데층은 ${example[3]}, ${example[4]}이고 꼭대기는 ${numberSubject(target)} 됩니다. 가능한 배치를 모두 확인해도 ㉠은 ${answer}입니다.${difficulty === 3 ? ` 쓰지 않는 카드는 ${distractor}입니다.` : ""}`,
    meta: { difficulty, cards, availableCards, target, given, distractor, layouts: layouts.map((layout) => layout.values), omitted: layouts.map((layout) => layout.omitted), answer, layoutCount: layouts.length }
  };
}

function stairGridPlacement({ difficulty = 2 }) {
  const max = difficulty === 1 ? 6 : difficulty === 2 ? 9 : 12;
  const solution = shuffle(Array.from({ length: max }, (_, index) => index + 1)).slice(0, 4);
  const [above, target, left, below] = solution;
  const given = difficulty === 1 ? { index: 0, value: above } : null;
  let distractor = null;
  let allCards = [...solution];
  if (difficulty === 3) {
    distractor = Math.max(...solution) + randomInt(1, 3);
    allCards.push(distractor);
  }
  const availableCards = allCards.filter((_, index) => !given || index !== given.index);
  return {
    prompt: `${difficulty === 3 ? "가장 큰 수 카드는 쓰지 않고, 나머지 " : ""}숫자 카드 ${availableCards.length}장을 빈칸에 한 번씩 넣으세요. ${below}의 왼쪽에 ${numberSubject(left)} 있습니다. ${numberSubject(below)} ${above}의 바로 아래에 있습니다. ㉠에 들어갈 수를 구하세요.`,
    visual: { kind: "stair-grid-placement", cards: shuffle(availableCards), given },
    answer: String(target),
    solution: `${below}의 바로 위에 ${above}, ${below}의 왼쪽에 ${numberObject(left)} 놓습니다. 남은 표시 칸에는 ${target}이 들어갑니다.${difficulty === 3 ? ` 쓰지 않는 가장 큰 수는 ${distractor}입니다.` : ""}`,
    meta: { difficulty, solution, above, target, left, below, given, distractor, allCards, availableCards }
  };
}

function verticalStairGridPlacement({ difficulty = 2 }) {
  const max = difficulty === 1 ? 6 : difficulty === 2 ? 9 : 12;
  const solution = shuffle(Array.from({ length: max }, (_, index) => index + 1)).slice(0, 4);
  const [target, left, right, below] = solution;
  const given = difficulty === 1 ? { index: 2, value: right } : null;
  let distractor = null;
  let allCards = [...solution];
  if (difficulty === 3) {
    distractor = Math.max(...solution) + randomInt(1, 3);
    allCards.push(distractor);
  }
  const availableCards = allCards.filter((_, index) => !given || index !== given.index);
  return {
    prompt: `${difficulty === 3 ? "가장 큰 수 카드는 쓰지 않고, 나머지 " : ""}숫자 카드 ${availableCards.length}장을 빈칸에 한 번씩 넣으세요. ${numberSubject(left)} ${right}의 왼쪽에 있습니다. ${numberSubject(below)} ${right}의 바로 아래에 있습니다. ㉠에 들어갈 수를 구하세요.`,
    visual: { kind: "vertical-stair-grid-placement", cards: shuffle(availableCards), given },
    answer: String(target),
    solution: `가운데 오른쪽 칸에 ${right}, 그 왼쪽에 ${numberObject(left)} 놓습니다. ${right}의 바로 아래에 ${numberObject(below)} 놓으면 남은 표시 칸에는 ${numberSubject(target)} 들어갑니다.${difficulty === 3 ? ` 쓰지 않는 가장 큰 수는 ${distractor}입니다.` : ""}`,
    meta: { difficulty, solution, target, left, right, below, given, distractor, allCards, availableCards }
  };
}

function lGridPlacement({ difficulty = 2 }) {
  const pool = difficulty === 3 ? [1, 2, 3, 4, 5] : [1, 2, 3, 4];
  const solution = shuffle(pool).slice(0, 4);
  const cards = difficulty === 3 ? [...pool] : [...solution];
  const targetIndex = 2;
  const given = difficulty === 1 ? { index: 1, value: solution[1] } : null;
  const conditions = [
    `${solution[1]} 바로 왼쪽 칸: ${solution[0]}`,
    `${solution[2]} 바로 아래 칸: ${solution[3]}`
  ];
  if (difficulty === 3) conditions.push(`${solution[1]} 바로 아래 칸: ${solution[2]}`);
  return {
    prompt: `주어진 조건을 보고 빈칸에 ${difficulty === 3 ? "다섯 수 중 네 수를 골라" : "1, 2, 3, 4를"} 한 번씩 넣으세요. ㉠에 알맞은 수를 구하세요.`,
    visual: { kind: "l-grid-placement", cards: shuffle(cards), given, targetIndex, conditions },
    answer: String(solution[targetIndex]),
    solution: `${conditions.join(" / ")} 조건을 차례로 표시하면 ㉠에 들어가는 수는 ${solution[targetIndex]}입니다.`,
    meta: { difficulty, cards, solution, given, targetIndex, conditions }
  };
}

function numberPyramid({ difficulty = 2 }) {
  const max = difficulty === 1 ? 6 : difficulty === 2 ? 10 : 14;
  let cards;
  let usedCards;
  let middle;
  let target;
  let candidateMiddles;
  do {
    cards = shuffle(Array.from({ length: max }, (_, index) => index + 1)).slice(0, difficulty === 3 ? 4 : 3);
    usedCards = difficulty === 3 ? shuffle(cards).slice(0, 3) : [...cards];
    middle = sample(usedCards);
    target = usedCards.reduce((sum, value) => sum + value, 0) + middle;
    candidateMiddles = new Set(permutations(cards).filter((candidate) => {
      const chosen = candidate.slice(0, 3);
      return chosen.reduce((sum, value) => sum + value, 0) + chosen[1] === target;
    }).map((candidate) => candidate[1]));
  } while (difficulty === 3 && (candidateMiddles.size !== 1 || !candidateMiddles.has(middle)));

  const cardSum = usedCards.reduce((sum, value) => sum + value, 0);
  const hint = difficulty === 1 ? `세 수 카드의 합은 ${cardSum}입니다.` : "";
  return {
    prompt: `첫째 줄에 주어진 수 카드${difficulty === 3 ? " 네 장 중 세 장을 골라" : " 세 장을"} 한 번씩 넣어 두 번 모으기 한 값이 아래 수가 되도록 하세요. ㉠에 들어갈 수를 구하세요.`,
    visual: { kind: "number-pyramid", cards: shuffle(cards), target, hint },
    answer: String(middle),
    solution: `두 번 모으기 한 값은 첫째 줄에 넣은 세 수의 합에 가운데 수를 한 번 더 더한 값입니다. 넣은 세 수의 합은 ${cardSum}이므로, ${target}에서 ${numberObject(cardSum)} 빼면 ㉠은 ${middle}입니다.${difficulty === 3 ? ` 쓰지 않는 카드는 ${cards.find((value) => !usedCards.includes(value))}입니다.` : ""}`,
    meta: { difficulty, cards, usedCards, middle, target, cardSum, candidateMiddles: [...candidateMiddles], answer: middle }
  };
}

function raceOrder({ difficulty = 2 }) {
  const names = shuffle(["준수", "민호", "성준", "연우", "지우"]);
  const total = difficulty === 3 ? 5 : 4;
  const selected = names.slice(0, total);
  const [remaining, earlier, fixed, later, extra] = selected;
  const targetName = sample(selected);
  const ranks = { [remaining]: 1, [earlier]: 2, [fixed]: 3, [later]: 4, ...(extra ? { [extra]: 5 } : {}) };
  if (total === 4) {
    return {
      prompt: `${selected.join("·")} ${total}명의 친구들이 달리기를 하고 있습니다. 다음을 보고 ${koreanParticle(targetName, "은", "는")} 몇 등인지 구하세요.`,
      visual: { kind: "race-order", total, conditions: [`${koreanParticle(fixed, "은", "는")} 3등입니다.`, `${koreanParticle(earlier, "은", "는")} ${later}보다 먼저 들어왔지만 1등은 아닙니다.`] },
      answer: `${ranks[targetName]}등`,
      solution: `${koreanParticle(fixed, "은", "는")} 3등입니다. ${koreanParticle(earlier, "은", "는")} ${later}보다 먼저 들어왔지만 1등이 아니므로 ${koreanParticle(earlier, "은", "는")} 2등, ${koreanParticle(later, "은", "는")} 4등입니다. ${koreanParticle(remaining, "은", "는")} 남은 자리인 1등이므로 ${koreanParticle(targetName, "은", "는")} ${ranks[targetName]}등입니다.`,
      meta: { difficulty, selected, ranks, targetName, answer: ranks[targetName] }
    };
  }
  return {
    prompt: `${selected.join("·")} ${total}명의 친구들이 달리기를 하고 있습니다. 다음을 보고 ${koreanParticle(targetName, "은", "는")} 몇 등인지 구하세요.`,
    visual: { kind: "race-order", total, conditions: [`${koreanParticle(fixed, "은", "는")} 3등입니다.`, `${koreanParticle(extra, "은", "는")} 5등입니다.`, `${koreanParticle(earlier, "은", "는")} ${later}보다 먼저 들어왔지만 1등은 아닙니다.`] },
    answer: `${ranks[targetName]}등`,
    solution: `${koreanParticle(fixed, "은", "는")} 3등이고, ${koreanParticle(extra, "은", "는")} 5등입니다. ${koreanParticle(earlier, "은", "는")} ${later}보다 먼저 들어왔지만 1등이 아니므로 ${koreanParticle(earlier, "은", "는")} 2등, ${koreanParticle(later, "은", "는")} 4등입니다. ${koreanParticle(remaining, "은", "는")} 남은 자리인 1등이므로 ${koreanParticle(targetName, "은", "는")} ${ranks[targetName]}등입니다.`,
    meta: { difficulty, selected, ranks, targetName, answer: ranks[targetName] }
  };
}

function orderPositionFromBack({ difficulty = 2 }) {
  const totalRange = difficulty === 1 ? [4, 5] : difficulty === 2 ? [5, 7] : [7, 9];
  const betweenRange = difficulty === 1 ? [0, 1] : difficulty === 2 ? [1, 2] : [1, 3];
  const settingsPool = [];
  for (let total = totalRange[0]; total <= totalRange[1]; total += 1) {
    for (let fixedPosition = 1; fixedPosition <= total; fixedPosition += 1) {
      for (let between = betweenRange[0]; between <= betweenRange[1]; between += 1) {
        const distance = between + 1;
        const candidates = [fixedPosition - distance, fixedPosition + distance].filter((position) => position >= 1 && position <= total);
        if (candidates.length === 1) settingsPool.push({ total, fromBack: total - fixedPosition + 1, between, fixedPosition, distance, targetPosition: candidates[0] });
      }
    }
  }
  const settings = sample(settingsPool);
  const names = shuffle(["지우", "민호", "서윤", "도윤", "하린", "준우", "예린"]);
  const fixedName = names[0];
  const targetName = names[1];
  const fixedPosition = settings.fixedPosition;
  const distance = settings.distance;
  const candidates = [fixedPosition - distance, fixedPosition + distance]
    .filter((position) => position >= 1 && position <= settings.total);
  const targetPosition = settings.targetPosition;
  const conditions = [
    `${koreanParticle(fixedName, "은", "는")} 뒤에서 ${settings.fromBack}번째로 달리고 있습니다.`,
    `${koreanParticle(fixedName, "과", "와")} ${targetName} 사이에는 ${settings.between}명이 달리고 있습니다.`
  ];
  return {
    prompt: `${settings.total}명의 친구들이 달리기를 하고 있습니다. 다음을 보고 ${koreanParticle(targetName, "은", "는")} 몇 등으로 달리고 있는지 구하세요.`,
    visual: { kind: "race-order", total: settings.total, conditions },
    answer: String(targetPosition),
    solution: `${koreanParticle(fixedName, "은", "는")} 뒤에서 ${settings.fromBack}번째이므로 앞에서 ${fixedPosition}등입니다. 두 사람 사이에 ${settings.between}명이 있으려면 ${koreanParticle(targetName, "은", "는")} ${targetPosition}등입니다.`,
    meta: { difficulty, ...settings, fixedName, targetName, fixedPosition, distance, candidates, targetPosition }
  };
}

function orderPositionFromFront({ difficulty = 2 }) {
  const settings = difficulty === 1
    ? { total: 4, fromFront: sample([1, 4]), between: 1 }
    : difficulty === 2
      ? { total: 5, fromFront: sample([2, 4]), between: 1 }
      : { total: 7, fromFront: sample([3, 5]), between: 2 };
  const names = shuffle(["지우", "민호", "서윤", "도윤", "하린", "준우", "예린"]);
  const fixedName = names[0];
  const targetName = names[1];
  const distance = settings.between + 1;
  const candidates = [settings.fromFront - distance, settings.fromFront + distance]
    .filter((position) => position >= 1 && position <= settings.total);
  const targetPosition = candidates[0];
  const conditions = [
    `${koreanParticle(fixedName, "은", "는")} 앞에서 ${settings.fromFront}번째로 달리고 있습니다.`,
    `${koreanParticle(fixedName, "과", "와")} ${targetName} 사이에는 ${settings.between}명이 달리고 있습니다.`
  ];
  return {
    prompt: `${settings.total}명의 친구들이 달리기를 하고 있습니다. 다음을 보고 ${koreanParticle(targetName, "은", "는")} 몇 등으로 달리고 있는지 구하세요.`,
    visual: { kind: "race-order", total: settings.total, conditions },
    answer: String(targetPosition),
    solution: `${koreanParticle(fixedName, "은", "는")} 앞에서 ${settings.fromFront}번째입니다. 두 사람 사이에 ${settings.between}명이 있으므로 ${koreanParticle(targetName, "은", "는")} ${targetPosition}등입니다.`,
    meta: { difficulty, ...settings, fixedName, targetName, distance, candidates, targetPosition }
  };
}

function orderPositionSevenPeople({ difficulty = 2 }) {
  const names = shuffle(["주희", "지훈", "서윤", "도윤", "하린", "준우", "예린", "민서"]);
  const fixedName = names[0];
  const relatedName = names[1];
  const askedName = difficulty === 3 ? names[2] : relatedName;
  const mirrored = Math.random() < 0.5;
  const total = difficulty === 1 ? 5 : difficulty === 2 ? 7 : 8;
  const fromBack = mirrored ? 2 : total - 1;
  const between = difficulty === 1 ? 2 : difficulty === 2 ? 3 : 2;
  const fixedPosition = total - fromBack + 1;
  const distance = between + 1;
  const relatedCandidates = [fixedPosition - distance, fixedPosition + distance]
    .filter((position) => position >= 1 && position <= total);
  const relatedPosition = relatedCandidates[0];
  const askedPosition = difficulty === 3
    ? relatedPosition + (relatedPosition > fixedPosition ? 1 : -1)
    : relatedPosition;
  const conditions = [
    `${koreanParticle(fixedName, "은", "는")} 뒤에서 ${fromBack}번째에 서 있습니다.`,
    `${koreanParticle(fixedName, "과", "와")} ${relatedName} 사이에는 ${between}명이 서 있습니다.`
  ];
  if (difficulty === 3) {
    conditions.push(`${koreanParticle(askedName, "은", "는")} ${relatedName}의 바로 ${askedPosition > relatedPosition ? "뒤" : "앞"}에 서 있습니다.`);
  }
  const hint = difficulty === 1
    ? `${koreanParticle(fixedName, "은", "는")} 앞에서 ${fixedPosition}번째입니다.`
    : "";
  return {
    prompt: `${total}명의 친구들이 줄을 서 있습니다. 다음을 보고 ${koreanParticle(askedName, "은", "는")} 앞에서 몇 번째에 서 있는지 구하세요.`,
    visual: { kind: "line-position-seven", total, conditions, hint },
    answer: String(askedPosition),
    solution: `${koreanParticle(fixedName, "은", "는")} 뒤에서 ${fromBack}번째이므로 앞에서 ${fixedPosition}번째입니다. ${koreanParticle(fixedName, "과", "와")} ${relatedName} 사이에 ${between}명이 있으므로 ${koreanParticle(relatedName, "은", "는")} 앞에서 ${relatedPosition}번째입니다.${difficulty === 3 ? ` ${koreanParticle(askedName, "은", "는")} ${relatedName}의 바로 ${askedPosition > relatedPosition ? "뒤" : "앞"}이므로 앞에서 ${askedPosition}번째입니다.` : ""}`,
    meta: { difficulty, total, fromBack, between, fixedName, relatedName, askedName, fixedPosition, distance, relatedCandidates, relatedPosition, askedPosition, mirrored }
  };
}

function additionTableGrid({ difficulty = 2 }) {
  const size = difficulty === 1 ? 3 : difficulty === 2 ? 4 : 5;
  const start = randomInt(1, difficulty === 3 ? 5 : 8);
  let across = randomInt(1, difficulty === 1 ? 2 : 3);
  let down = randomInt(2, difficulty === 3 ? 4 : 3);
  if (across === down) down += 1;
  const grid = Array.from({ length: size }, (_, row) => (
    Array.from({ length: size }, (_, column) => start + row * down + column * across)
  ));
  const target = { row: size - 1, column: size - 1 };
  const givenPositions = difficulty === 1
    ? [[0, 0], [0, 1], [0, 2], [1, 0], [1, 2]]
    : difficulty === 2
      ? [[0, 0], [0, 1], [0, 2], [0, 3], [1, 0], [1, 1], [1, 3], [2, 1], [3, 0]]
      : [[0, 0], [0, 2], [1, 0], [2, 3], [3, 1], [4, 0]];
  const givens = givenPositions.map(([row, column]) => ({ row, column, value: grid[row][column] }));
  const answer = grid[target.row][target.column];
  return {
    prompt: "다음 표는 일정한 규칙으로 수를 나열한 것입니다. 규칙을 찾아 빈칸 ㉠에 알맞은 수를 구하세요.",
    visual: { kind: "addition-table-grid", size, givens, target },
    answer: String(answer),
    solution: `오른쪽으로 갈 때마다 ${across}씩 커지고, 아래로 내려갈 때마다 ${down}씩 커집니다. 시작 수 ${start}에서 오른쪽으로 ${across}씩 ${size - 1}번, 아래로 ${down}씩 ${size - 1}번 더하면 ㉠은 ${answer}입니다.`,
    meta: { difficulty, size, start, across, down, grid, givens, target, answer }
  };
}

function additionTableGridBottomLeft({ difficulty = 2 }) {
  const size = difficulty === 1 ? 3 : difficulty === 2 ? 4 : 5;
  const start = randomInt(1, difficulty === 3 ? 5 : 8);
  let across = randomInt(difficulty === 1 ? 1 : 2, difficulty === 1 ? 3 : 6);
  let down = randomInt(2, difficulty === 3 ? 5 : 4);
  if (across === down) down = down === 4 ? 2 : down + 1;
  const grid = Array.from({ length: size }, (_, row) => (
    Array.from({ length: size }, (_, column) => start + row * down + column * across)
  ));
  const target = { row: size - 1, column: 0 };
  const givenPositions = difficulty === 1
    ? [[0, 0], [0, 1], [0, 2], [1, 1], [1, 2], [2, 2]]
    : difficulty === 2
      ? [[0, 0], [0, 1], [0, 2], [1, 1], [1, 2], [1, 3], [2, 3], [3, 3]]
      : [[0, 0], [0, 2], [1, 3], [2, 0], [3, 4], [4, 4]];
  const givens = givenPositions.map(([row, column]) => ({ row, column, value: grid[row][column] }));
  const answer = grid[target.row][target.column];
  const hint = difficulty === 1 ? `오른쪽으로 ${across}씩, 아래로 ${down}씩 커집니다.` : "";
  return {
    prompt: "다음 표는 일정한 규칙으로 수를 나열한 것입니다. 규칙을 찾아 빈칸 ㉠에 알맞은 수를 구하세요.",
    visual: { kind: "addition-table-grid", size, givens, target, hint },
    answer: String(answer),
    solution: `오른쪽으로 한 칸 갈 때마다 ${across}씩 커지고, 아래로 한 칸 갈 때마다 ${down}씩 커집니다. 첫 수 ${start}에서 아래로 ${down}씩 ${size - 1}번 더하면 ㉠은 ${answer}입니다.`,
    meta: { difficulty, size, start, across, down, grid, givens, target, answer }
  };
}

function additionTableGridOffset({ difficulty = 2 }) {
  const size = difficulty === 1 ? 3 : difficulty === 2 ? 4 : 5;
  const start = randomInt(1, difficulty === 3 ? 6 : 8);
  let across = randomInt(1, difficulty === 1 ? 2 : 4);
  let down = randomInt(2, difficulty === 1 ? 3 : 4);
  if (across === down) down = down === 4 ? 2 : down + 1;
  const grid = Array.from({ length: size }, (_, row) => (
    Array.from({ length: size }, (_, column) => start + row * down + column * across)
  ));
  const target = { row: size - 1, column: size - 1 };
  const givenPositions = difficulty === 1
    ? [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [2, 0]]
    : difficulty === 2
      ? [[0, 0], [0, 1], [0, 2], [0, 3], [1, 1], [1, 2], [2, 0], [2, 2], [3, 0]]
      : [[0, 0], [0, 2], [1, 1], [2, 3], [3, 0], [4, 1]];
  const givens = givenPositions.map(([row, column]) => ({ row, column, value: grid[row][column] }));
  const answer = grid[target.row][target.column];
  return {
    prompt: "다음 표는 일정한 규칙으로 수를 나열한 것입니다. 규칙을 찾아 빈칸 ㉠에 알맞은 수를 구하세요.",
    visual: { kind: "addition-table-grid", size, givens, target },
    answer: String(answer),
    solution: `오른쪽으로 한 칸 갈 때마다 ${across}씩 커지고, 아래로 한 칸 갈 때마다 ${down}씩 커집니다. 첫 수 ${start}에서 오른쪽으로 ${size - 1}번, 아래로 ${size - 1}번 가면 ${answer}입니다.`,
    meta: { difficulty, size, start, across, down, grid, givens, target, answer }
  };
}

function discNumberRule({ difficulty = 2 }) {
  const max = difficulty === 1 ? 8 : difficulty === 2 ? 12 : 20;
  const makeDisc = () => {
    const northWest = randomInt(1, max);
    const northEast = randomInt(1, max);
    const southWest = randomInt(1, max);
    const southEast = randomInt(1, max);
    const center = (northWest + northEast + southWest + southEast) / 2;
    return Number.isInteger(center) ? { northWest, northEast, southWest, southEast, center } : null;
  };
  let first;
  let second;
  let third;
  do {
    first = makeDisc();
    second = makeDisc();
    const northEast = randomInt(2, max);
    const southWest = randomInt(1, max);
    const southEast = randomInt(1, max);
    const center = randomInt(3, max);
    const northWest = center * 2 - northEast - southWest - southEast;
    third = northWest >= 1 && northWest <= max ? { northWest, northEast, southWest, southEast, center } : null;
  } while (!first || !second || !third);
  return {
    prompt: "원판에 적힌 수의 규칙을 찾아 마지막 원판의 빈 칸에 알맞은 수를 구하세요.",
    visual: { kind: "disc-number-rule", discs: [first, second, { ...third, northWest: "?" }] },
    answer: String(third.northWest),
    solution: `중심 수는 바깥 네 수의 합을 2로 나눈 값입니다. 마지막 원판에서 바깥 세 수의 합을 더해 ${third.center * 2}에서 빼면 빈 칸은 ${third.northWest}입니다.`
  };
}

function shapeSumTable({ difficulty = 2 }) {
  const max = difficulty === 1 ? 5 : difficulty === 2 ? 9 : 15;
  const diamond = randomInt(1, max);
  const square = randomInt(1, max);
  const circle = randomInt(1, max);
  const rowOne = diamond * 2;
  const rowTwo = square + circle;
  const columnOne = diamond + square;
  const columnTwo = diamond + circle;
  return {
    prompt: "[보기]는 가로, 세로 각 줄의 합을 나타낸 표입니다. 오른쪽 표에서 같은 모양은 같은 수를 나타낼 때, ㉠에 알맞은 수를 구하세요.",
    visual: { kind: "shape-sum-table", rowOne, columnOne, columnTwo, rowTwo },
    answer: String(rowTwo),
    solution: `마름모는 ${diamond}, 네모는 ${square}, 동그라미는 ${circle}입니다. 두 번째 줄의 합은 ${square} + ${circle} = ${rowTwo}입니다.`
  };
}

function shapeSumRowTarget({ difficulty = 2 }) {
  const max = difficulty === 1 ? 8 : difficulty === 2 ? 20 : 25;
  const [diamond, square, circle] = shuffle(Array.from({ length: max }, (_, index) => index + 1)).slice(0, 3);
  const rowOne = diamond + square;
  const columnOne = diamond * 2;
  const columnTwo = square + circle;
  const target = diamond + circle;
  const showExample = difficulty !== 3;
  const revealDiamond = difficulty === 1;
  return {
    prompt: showExample
      ? "[보기]에서 색칠된 칸은 가로, 세로 각 줄의 합을 나타냅니다. 오른쪽 표에서 같은 모양은 같은 수를 나타낼 때, ㉠에 알맞은 수를 구하세요."
      : "색칠된 칸은 가로, 세로 각 줄의 합을 나타냅니다. 같은 모양은 같은 수를 나타낼 때, ㉠에 알맞은 수를 구하세요.",
    visual: { kind: "shape-sum-row-target", rowOne, columnOne, columnTwo, showExample, revealDiamond, diamond },
    answer: String(target),
    solution: `마름모 두 개의 합이 ${columnOne}이므로 마름모는 ${diamond}입니다. 네모는 ${rowOne}에서 ${numberObject(diamond)} 빼면 ${square}, 동그라미는 ${columnTwo}에서 ${numberObject(square)} 빼면 ${circle}입니다. 따라서 ㉠은 ${diamond} + ${circle} = ${target}입니다.`,
    meta: { difficulty, diamond, square, circle, rowOne, columnOne, columnTwo, target, showExample, revealDiamond }
  };
}

function shapeSumBottomTarget({ difficulty = 2 }) {
  const max = difficulty === 1 ? 5 : difficulty === 2 ? 8 : 10;
  let diamond;
  let circle;
  let square;
  do {
    [diamond, circle, square] = shuffle(Array.from({ length: max }, (_, index) => index + 1)).slice(0, 3);
  } while (circle + square === diamond * 2);
  const rowOne = diamond + circle;
  const rowTwo = diamond + square;
  const columnOne = diamond * 2;
  const target = circle + square;
  const showExample = difficulty !== 3;
  const revealDiamond = difficulty === 1;
  return {
    prompt: showExample
      ? "[보기]에서 색칠된 칸은 가로, 세로 각 줄의 합을 나타냅니다. 오른쪽 표에서 같은 모양은 같은 수를 나타낼 때, ㉠에 알맞은 수를 구하세요."
      : "색칠된 칸은 가로, 세로 각 줄의 합을 나타냅니다. 같은 모양은 같은 수를 나타낼 때, ㉠에 알맞은 수를 구하세요.",
    visual: { kind: "shape-sum-bottom-target", rowOne, rowTwo, columnOne, showExample, revealDiamond, diamond },
    answer: String(target),
    solution: `마름모 두 개의 합이 ${columnOne}이므로 마름모는 ${diamond}입니다. 동그라미는 ${rowOne}에서 ${numberObject(diamond)} 빼면 ${circle}, 네모는 ${rowTwo}에서 ${numberObject(diamond)} 빼면 ${square}입니다. 따라서 ㉠은 ${circle} + ${square} = ${target}입니다.`,
    meta: { difficulty, diamond, circle, square, rowOne, rowTwo, columnOne, target, showExample, revealDiamond }
  };
}

function shapeSumColumnTarget({ difficulty = 2 }) {
  const max = difficulty === 1 ? 6 : difficulty === 2 ? 9 : 12;
  const [diamond, circle, square] = shuffle(Array.from({ length: max }, (_, index) => index + 1)).slice(0, 3);
  const rowOne = diamond + circle;
  const rowTwo = square * 2;
  const columnTwo = circle + square;
  const target = diamond + square;
  const showExample = difficulty !== 3;
  const revealSquare = difficulty === 1;
  return {
    prompt: showExample
      ? "[보기]에서 색칠된 칸은 가로, 세로 각 줄의 합을 나타냅니다. 오른쪽 표에서 같은 모양은 같은 수를 나타낼 때, ㉠에 알맞은 수를 구하세요."
      : "색칠된 칸은 가로, 세로 각 줄의 합을 나타냅니다. 같은 모양은 같은 수를 나타낼 때, ㉠에 알맞은 수를 구하세요.",
    visual: { kind: "shape-sum-column-target", rowOne, rowTwo, columnTwo, showExample, revealSquare, square },
    answer: String(target),
    solution: `네모 두 개의 합이 ${rowTwo}이므로 네모는 ${square}입니다. 동그라미는 ${columnTwo}에서 ${numberObject(square)} 빼면 ${circle}, 마름모는 ${rowOne}에서 ${numberObject(circle)} 빼면 ${diamond}입니다. 따라서 ㉠은 ${diamond} + ${square} = ${target}입니다.`,
    meta: { difficulty, diamond, circle, square, rowOne, rowTwo, columnTwo, target, showExample, revealSquare }
  };
}

function shapeSumRepeatedColumnTarget({ difficulty = 2 }) {
  const max = difficulty === 1 ? 6 : difficulty === 2 ? 12 : 15;
  const [diamond, circle, square] = shuffle(Array.from({ length: max }, (_, index) => index + 1)).slice(0, 3);
  const rowOne = diamond + circle;
  const rowTwo = square + circle;
  const columnTwo = circle * 2;
  const target = diamond + square;
  const showExample = difficulty !== 3;
  const revealCircle = difficulty === 1;
  return {
    prompt: showExample
      ? "[보기]에서 색칠된 칸은 가로, 세로 각 줄의 합을 나타냅니다. 오른쪽 표에서 같은 모양은 같은 수를 나타낼 때, ㉠에 알맞은 수를 구하세요."
      : "색칠된 칸은 가로, 세로 각 줄의 합을 나타냅니다. 같은 모양은 같은 수를 나타낼 때, ㉠에 알맞은 수를 구하세요.",
    visual: { kind: "shape-sum-repeated-column-target", rowOne, rowTwo, columnTwo, showExample, revealCircle, circle },
    answer: String(target),
    solution: `동그라미 두 개를 더한 값은 ${columnTwo}입니다. 따라서 동그라미는 ${circle}입니다. 마름모는 ${rowOne}에서 ${numberObject(circle)} 빼면 ${diamond}, 네모는 ${rowTwo}에서 ${numberObject(circle)} 빼면 ${square}입니다. 따라서 ㉠은 ${diamond} + ${square} = ${target}입니다.`,
    meta: { difficulty, diamond, circle, square, rowOne, rowTwo, columnTwo, target, showExample, revealCircle }
  };
}

function repeatShapeSequence({ difficulty = 2 }) {
  const target = randomInt(difficulty === 1 ? 8 : difficulty === 2 ? 11 : 21, difficulty === 1 ? 12 : difficulty === 2 ? 20 : 35);
  const cycle = ["동그라미", "세모", "동그라미"];
  const answer = cycle[(target - 1) % cycle.length];
  return {
    prompt: `아래 그림의 규칙을 찾아 ${target}번째 모양을 구하세요.`,
    visual: { kind: "repeat-shape-sequence", items: cycle.concat(cycle, cycle.slice(0, 1)), target },
    answer,
    solution: `동그라미, 세모, 동그라미가 3개씩 반복됩니다. ${numberObject(target)} 3개씩 나눈 나머지를 확인하면 ${target}번째는 ${answer}입니다.`
  };
}

function repeatShapeColorDual({ difficulty = 2 }) {
  const shapePool = [
    { name: "동그라미", outline: "○", filled: "●" },
    { name: "세모", outline: "△", filled: "▲" },
    { name: "네모", outline: "□", filled: "■" },
    { name: "마름모", outline: "◇", filled: "◆" },
    { name: "별", outline: "☆", filled: "★" }
  ];
  const shapeCount = difficulty === 1 ? 2 : difficulty === 2 ? 3 : 4;
  const shapeCycle = shuffle(shapePool).slice(0, shapeCount);
  const fillCycle = difficulty === 3
    ? sample([[true, false, false], [false, true, true]])
    : Math.random() < 0.5 ? [true, false] : [false, true];
  const previewCount = difficulty === 1 ? 8 : difficulty === 2 ? 9 : 12;
  const target = difficulty === 1 ? randomInt(9, 14) : difficulty === 2 ? randomInt(15, 24) : randomInt(25, 48);
  const itemAt = (index) => {
    const shape = shapeCycle[index % shapeCycle.length];
    const filled = fillCycle[index % fillCycle.length];
    return { name: shape.name, symbol: filled ? shape.filled : shape.outline, filled };
  };
  const items = Array.from({ length: previewCount }, (_, index) => itemAt(index));
  const answerItem = itemAt(target - 1);
  const answerColor = answerItem.filled ? "검은색" : "흰색";
  return {
    prompt: `모양과 색의 규칙을 찾아 ${target}번째 모양을 쓰거나 그리세요.`,
    visual: { kind: "repeat-shape-color-dual", items, target, previewCount, shapeCount, fillCount: fillCycle.length, showGuide: difficulty === 1 },
    answer: `${answerColor} ${answerItem.name}`,
    solution: `모양은 ${shapeCount}개씩, 색은 ${fillCycle.length}개씩 같은 순서로 반복됩니다. ${target}번째의 모양과 색을 각각 찾아 합치면 ${answerColor} ${answerItem.name}입니다.`,
    meta: { difficulty, shapeCycle, fillCycle, items, target, previewCount, answerItem, answerColor }
  };
}

function threeShapeCycle({ difficulty = 2 }) {
  const shapePool = [
    { symbol: "△", name: "세모" },
    { symbol: "○", name: "동그라미" },
    { symbol: "◇", name: "마름모" },
    { symbol: "□", name: "네모" },
    { symbol: "☆", name: "별" }
  ];
  const cycle = shuffle(shapePool).slice(0, 3);
  const target = difficulty === 1 ? randomInt(8, 12) : difficulty === 2 ? randomInt(11, 20) : randomInt(24, 45);
  const previewCount = difficulty === 2 ? 7 : 6;
  const items = Array.from({ length: previewCount }, (_, index) => cycle[index % cycle.length]);
  const answerShape = cycle[(target - 1) % cycle.length];
  const remainder = target % cycle.length;
  return {
    prompt: `아래 그림의 규칙을 찾아 ${target}번째 모양을 쓰거나 그리세요.`,
    visual: { kind: "three-shape-cycle", cycle, items, target, showGuide: difficulty === 1 },
    answer: answerShape.name,
    solution: `${cycle.map((shape) => shape.name).join(", ")} 순서로 세 모양이 반복됩니다. ${numberObject(target)} 3개씩 묶었을 때 ${remainder === 0 ? "마지막" : `${remainder}번째`} 모양이므로 답은 ${answerShape.name}입니다.`,
    meta: { difficulty, cycle, items, target, previewCount, answerShape, remainder }
  };
}

function fourShapeCycle({ difficulty = 2 }) {
  const shapePool = [
    { symbol: "△", name: "세모" },
    { symbol: "○", name: "동그라미" },
    { symbol: "◇", name: "마름모" },
    { symbol: "□", name: "네모" },
    { symbol: "☆", name: "별" },
    { symbol: "⬠", name: "오각형" },
    { symbol: "⬡", name: "육각형" }
  ];
  const cycle = shuffle(shapePool).slice(0, 4);
  const target = difficulty === 1 ? randomInt(9, 14) : difficulty === 2 ? randomInt(12, 24) : randomInt(32, 60);
  const previewCount = difficulty === 1 ? 8 : difficulty === 2 ? 9 : 4;
  const items = Array.from({ length: previewCount }, (_, index) => cycle[index % cycle.length]);
  const answerShape = cycle[(target - 1) % cycle.length];
  const remainder = target % cycle.length;
  return {
    prompt: `아래 그림의 규칙을 찾아 ${target}번째 모양을 쓰거나 그리세요.`,
    visual: { kind: "three-shape-cycle", cycle, items, target, showGuide: difficulty === 1 },
    answer: answerShape.name,
    solution: `${cycle.map((shape) => shape.name).join(", ")} 순서로 네 모양이 반복됩니다. ${numberObject(target)} 4개씩 묶었을 때 ${remainder === 0 ? "마지막" : `${remainder}번째`} 모양이므로 답은 ${answerShape.name}입니다.`,
    meta: { difficulty, cycle, items, target, previewCount, answerShape, remainder }
  };
}

function fourItemCycleWithDuplicate({ difficulty = 2 }) {
  const shapePool = [
    { symbol: "△", name: "세모" },
    { symbol: "○", name: "동그라미" },
    { symbol: "◇", name: "마름모" },
    { symbol: "□", name: "네모" },
    { symbol: "☆", name: "별" },
    { symbol: "⬠", name: "오각형" },
    { symbol: "⬡", name: "육각형" }
  ];
  const [first, repeated, last] = shuffle(shapePool).slice(0, 3);
  const cycle = difficulty === 3 && Math.random() < 0.5
    ? [first, repeated, last, repeated]
    : [first, repeated, repeated, last];
  const target = difficulty === 1 ? randomInt(9, 14) : difficulty === 2 ? randomInt(12, 24) : randomInt(32, 60);
  const previewCount = difficulty === 1 ? 8 : difficulty === 2 ? 9 : 4;
  const items = Array.from({ length: previewCount }, (_, index) => cycle[index % cycle.length]);
  const answerShape = cycle[(target - 1) % cycle.length];
  const remainder = target % cycle.length;
  return {
    prompt: `아래 그림의 규칙을 찾아 ${target}번째 모양을 쓰거나 그리세요.`,
    visual: { kind: "three-shape-cycle", cycle, items, target, showGuide: difficulty === 1 },
    answer: answerShape.name,
    solution: `${cycle.map((shape) => shape.name).join(", ")} 순서로 네 칸이 반복됩니다. ${numberObject(target)} 4개씩 묶었을 때 ${remainder === 0 ? "마지막" : `${remainder}번째`} 모양이므로 답은 ${answerShape.name}입니다.`,
    meta: { difficulty, cycle, items, target, previewCount, answerShape, remainder, repeatedShape: repeated }
  };
}

function arrowNumberGrid({ difficulty = 2 }) {
  const start = randomInt(difficulty === 1 ? 40 : difficulty === 2 ? 60 : 120, difficulty === 1 ? 59 : difficulty === 2 ? 89 : 180);
  const moves = [1, 1, -10, 1, -10, -1, -1, -10];
  const answer = moves.reduce((value, move) => value + move, start);
  return {
    prompt: "보기의 화살표가 나타내는 규칙을 찾아, 출발 수에서 화살표를 따라간 마지막 칸의 수를 구하세요.",
    visual: { kind: "arrow-number-grid", start },
    answer: String(answer),
    solution: `오른쪽 화살표는 1씩 커지고, 위쪽 화살표는 10씩 작아집니다. 화살표를 차례로 따라가면 ${start}에서 ${numberSubject(answer)} 됩니다.`
  };
}

function arrowNumberHorizontalTens({ difficulty = 2 }) {
  const templates = difficulty === 1
    ? [
      ["right", "right", "down", "left", "down"],
      ["down", "down", "right", "up", "right"],
      ["right", "down", "right", "up", "right"]
    ]
    : difficulty === 2
      ? [
        ["right", "right", "down", "left", "down", "right", "right", "up"],
        ["down", "down", "right", "up", "right", "down", "down", "left"],
        ["right", "down", "right", "up", "right", "down", "down", "left"]
      ]
      : [
        ["right", "right", "down", "left", "down", "left", "down", "right", "right", "up"],
        ["down", "down", "right", "up", "right", "up", "right", "down", "down", "left"],
        ["right", "down", "right", "up", "right", "down", "right", "down", "left", "left"]
      ];
  const directions = sample(templates);
  const vector = { left: [-1, 0], right: [1, 0], up: [0, -1], down: [0, 1] };
  const delta = { left: -10, right: 10, up: 1, down: -1 };
  const points = [{ x: 0, y: 0 }];
  const offsets = [0];
  directions.forEach((direction) => {
    const previous = points.at(-1);
    const [x, y] = vector[direction];
    points.push({ x: previous.x + x, y: previous.y + y });
    offsets.push(offsets.at(-1) + delta[direction]);
  });
  const lower = difficulty === 1 ? 20 : difficulty === 2 ? 40 : 50;
  const upper = difficulty === 1 ? 59 : difficulty === 2 ? 69 : 75;
  const startMin = Math.max(lower, 1 - Math.min(...offsets));
  const startMax = Math.min(upper, 99 - Math.max(...offsets));
  const start = randomInt(startMin, startMax);
  const values = offsets.map((offset) => start + offset);
  const answer = values.at(-1);
  const legendCenter = randomInt(12, 48);
  const legend = {
    center: legendCenter,
    left: legendCenter - 10,
    right: legendCenter + 10,
    up: legendCenter + 1,
    down: legendCenter - 1
  };
  const directionNames = { left: "왼쪽", right: "오른쪽", up: "위쪽", down: "아래쪽" };
  return {
    prompt: "[보기]의 화살표가 나타내는 규칙을 찾아 오른쪽 그림의 ㉠에 알맞은 수를 써 넣으세요.",
    visual: { kind: "arrow-number-horizontal-tens", start, directions, points, legend },
    answer: String(answer),
    solution: `오른쪽은 10 커지고 왼쪽은 10 작아지며, 위쪽은 1 커지고 아래쪽은 1 작아집니다. ${start}에서 ${directions.map((direction) => directionNames[direction]).join(" → ")} 순서로 가면 ${values.join(" → ")}이므로 ㉠은 ${answer}입니다.`,
    meta: { difficulty, start, directions, points, offsets, values, answer, legend }
  };
}

function arrowNumberPathSeven({ difficulty = 2 }) {
  const delta = { left: -1, right: 1, up: -10, down: 10 };
  const vector = { left: [-1, 0], right: [1, 0], up: [0, -1], down: [0, 1] };
  const stepCount = difficulty === 1 ? 5 : difficulty === 2 ? 7 : 9;
  let directions;
  let points;
  let attempts = 0;
  do {
    directions = [];
    points = [{ x: 0, y: 0 }];
    for (let index = 0; index < stepCount; index += 1) {
      const current = points.at(-1);
      const used = new Set(points.map((point) => `${point.x}:${point.y}`));
      const choices = shuffle(Object.keys(vector)).filter((direction) => {
        const [x, y] = vector[direction];
        const next = { x: current.x + x, y: current.y + y };
        return Math.abs(next.x) <= 4 && Math.abs(next.y) <= 4 && !used.has(`${next.x}:${next.y}`);
      });
      if (!choices.length) break;
      const direction = choices[0];
      const [x, y] = vector[direction];
      directions.push(direction);
      points.push({ x: current.x + x, y: current.y + y });
    }
    attempts += 1;
  } while ((directions.length !== stepCount
    || new Set(directions).size < (difficulty === 1 ? 2 : difficulty === 2 ? 3 : 4)
    || (difficulty >= 2 && !directions.includes("down"))) && attempts < 1000);

  const pathIsValid = directions.length === stepCount
    && new Set(directions).size >= (difficulty === 1 ? 2 : difficulty === 2 ? 3 : 4)
    && (difficulty < 2 || directions.includes("down"));
  if (!pathIsValid) return arrowNumberPathSeven({ difficulty });
  const offsets = [0];
  directions.forEach((direction) => offsets.push(offsets.at(-1) + delta[direction]));
  const startMin = Math.max(difficulty === 1 ? 30 : difficulty === 2 ? 45 : 65, 1 - Math.min(...offsets));
  const valueLimit = difficulty === 3 ? 180 : 99;
  const startMax = Math.max(startMin, Math.min(startMin + (difficulty === 1 ? 30 : 40), valueLimit - Math.max(...offsets)));
  const start = randomInt(startMin, startMax);
  const values = offsets.map((offset) => start + offset);
  const answer = values.at(-1);
  const directionNames = { left: "왼쪽", right: "오른쪽", up: "위쪽", down: "아래쪽" };
  return {
    prompt: "[보기]의 화살표가 나타내는 규칙을 찾아 오른쪽 그림의 ㉠에 알맞은 수를 써 넣으세요.",
    visual: { kind: "arrow-number-path-seven", directions, points, start },
    answer: String(answer),
    solution: `왼쪽은 1 작아지고, 오른쪽은 1 커지며, 위쪽은 10 작아지고 아래쪽은 10 커집니다. ${start}에서 ${directions.map((direction) => directionNames[direction]).join(" → ")} 순서로 가면 수는 ${values.join(" → ")} 순서가 됩니다. 따라서 ㉠은 ${answer}입니다.`,
    meta: { difficulty, stepCount, directions, points, start, values, answer, valueLimit }
  };
}

function busPassengers({ max, difficulty }) {
  const start = randomInt(8, Math.max(9, Math.min(max - 5, 35)));
  const boarded = randomInt(2, Math.max(2, Math.min(max - start, difficulty >= 2 ? 12 : 8)));
  const left = randomInt(2, Math.min(start + boarded - 1, difficulty >= 3 ? 15 : 9));
  return {
    prompt: `버스에 ${start}명이 타고 있었습니다. 정류장에서 ${boarded}명이 타고 ${left}명이 내렸습니다. 지금 버스에 몇 명이 타고 있나요?`,
    visual: { kind: "bus", start, boarded, left },
    answer: `${start + boarded - left}명`,
    solution: `처음 사람 수에 탄 사람 ${boarded}명을 더하고, 내린 사람 ${left}명을 뺍니다.`
  };
}

function twoDigitCondition({ max }) {
  const tens = randomInt(2, Math.max(2, Math.min(8, Math.floor((max - 1) / 10))));
  const gap = randomInt(1, Math.min(5, tens));
  const ones = tens - gap;
  const value = tens * 10 + ones;
  const lower = tens * 10 - 1;
  const upper = (tens + 1) * 10;
  const parity = value % 2 === 0 ? "짝수" : "홀수";
  return {
    prompt: `${lower}보다 크고 ${upper}보다 작은 두 자리 ${parity}입니다. 십의 자리 숫자가 일의 자리 숫자보다 ${gap} 큰 수를 구하세요.`,
    visual: { kind: "place", tens, ones: "?" },
    answer: String(value),
    solution: "범위 안의 수를 먼저 적고, 일의 자리와 십의 자리의 차이를 확인합니다. 마지막으로 짝수나 홀수 조건을 확인합니다."
  };
}

function repeatShape({ max, difficulty }) {
  const shapePattern = shuffle(SHAPES).slice(0, difficulty >= 3 ? 3 : 2);
  const colorPattern = difficulty >= 2 ? COLORS : [sample(COLORS)];
  const cycle = shapePattern.length * colorPattern.length;
  const target = randomInt(Math.max(8, cycle + 2), Math.max(10, max));
  const shape = shapePattern[(target - 1) % shapePattern.length];
  const color = colorPattern[(target - 1) % colorPattern.length];
  const items = Array.from({ length: Math.min(cycle * 2, 8) }, (_, index) => ({
    shape: shapePattern[index % shapePattern.length],
    color: colorPattern[index % colorPattern.length]
  }));
  return {
    prompt: `아래 규칙에서 ${target}번째 모양은 무엇인가요?`,
    visual: { kind: "shapes", items },
    answer: `${color} ${shape}`,
    solution: `모양과 색이 각각 몇 개씩 반복되는지 찾아 ${target}번째 위치를 확인합니다.`
  };
}

function pianoZigzag({ max, difficulty }) {
  const keys = difficulty >= 3 ? 7 : 5;
  const target = randomInt(keys + 3, Math.max(keys + 5, max));
  const period = (keys - 1) * 2;
  const offset = (target - 1) % period;
  const position = offset < keys ? offset + 1 : period - offset + 1;
  return {
    prompt: `건반 1에서 시작해 오른쪽으로 한 칸씩 가다가 ${keys}번 건반에서 다시 왼쪽으로 한 칸씩 옵니다. ${target}번째에 누르는 건반은 몇 번인가요?`,
    visual: { kind: "piano", keys, target },
    answer: `${position}번`,
    solution: `1번부터 ${keys}번까지 갔다가 되돌아오는 왕복 마디를 그려 ${target}번째를 찾습니다.`
  };
}

function goStoneTriangle({ max, difficulty }) {
  const largestGap = Math.max(3, Math.min(Math.floor(max / 2), difficulty + 5));
  const gap = randomInt(difficulty >= 3 ? 4 : 2, largestGap);
  const blackMore = Math.random() < 0.5;
  const target = blackMore ? gap * 2 - 1 : gap * 2;
  const color = blackMore ? "검은 돌" : "흰 돌";
  return {
    prompt: `그림과 같은 규칙으로 바둑돌을 놓습니다. ${color}이 다른 색 돌보다 ${gap}개 더 많다면 몇 번째 모양인가요?`,
    visual: { kind: "go-stone", stages: difficulty >= 2 ? 5 : 4 },
    answer: `${target}번째`,
    solution: `1번째는 검은 돌이 1개, 2번째는 흰 돌이 1개 더 많습니다. 그다음에는 색이 번갈아 바뀌면서 차이가 2개, 3개처럼 하나씩 늘어납니다. ${color}의 차이가 ${gap}개가 되는 차례는 ${target}번째입니다.`
  };
}

function lineOrder({ difficulty }) {
  const total = randomInt(difficulty >= 3 ? 7 : 5, difficulty >= 2 ? 9 : 7);
  const between = randomInt(1, Math.min(3, total - 2));
  const first = randomInt(1, total - between - 1);
  const second = first + between + 1;
  return {
    prompt: `${total}명의 친구가 한 줄로 서 있습니다. 지우는 앞에서 ${first}번째이고, 지우와 민서 사이에는 ${between}명이 있습니다. 민서가 지우보다 뒤에 있다면 민서는 앞에서 몇 번째인가요?`,
    visual: { kind: "line", total, first, second },
    answer: `${second}번째`,
    solution: `지우의 자리에서 뒤로 사이 사람 수 ${between}명과 민서 자리 한 칸을 더 이동합니다.`
  };
}

function sourceNonadjacentPyramid() {
  const pairs = [[1,2],[1,3],[2,1],[2,3],[3,1],[3,2]];
  const [top, left] = sample(pairs);
  const answer = [1,2,3].find((value) => value !== top && value !== left);
  return {
    prompt: "도형 안에 1, 2, 3을 같은 숫자끼리 서로 이웃하지 않도록 써넣을 때, ㉠에 들어갈 수를 구하세요.",
    visual: { kind: "nonadjacent-pyramid", top, left },
    answer: String(answer),
    solution: `꼭대기 ${numberAnd(top)} 이웃한 칸에는 ${numberObject(top)} 쓸 수 없고, 둘째 줄 왼쪽의 ${numberAnd(left)} 이웃한 칸에는 ${numberObject(left)} 쓸 수 없습니다. 따라서 ㉠에는 남은 수 ${numberSubject(answer)} 들어갑니다.`
  };
}

function sourceGoStoneDifference({ difficulty = 2 }) {
  const target = difficulty === 1 ? randomInt(6, 10) : difficulty === 2 ? randomInt(12, 18) : randomInt(19, 30);
  return {
    prompt: `바둑돌이 그림과 같은 규칙으로 놓여 있습니다. ${target}번째에 놓여 있는 흰 바둑돌과 검은 바둑돌의 수의 차는 몇 개인지 구하세요.`,
    visual: { kind: "source-go-stones", target },
    answer: `${target + 1}개`,
    solution: `1번째의 차는 2개, 2번째의 차는 3개, 3번째의 차는 4개, 4번째의 차는 5개입니다. 다음 모양으로 갈수록 차가 1개씩 늘어나므로 ${target}번째의 차는 ${target + 1}개입니다.`
  };
}

function sourceColoredShapeNumber({ difficulty = 2 }) {
  const digits = [0, 0, 0, 0];
  const active = difficulty === 1 ? randomInt(2, 3) : 4;
  shuffle([0, 1, 2, 3]).slice(0, active).forEach((index) => {
    digits[index] = randomInt(1, 3);
  });
  const weights = [64, 16, 4, 1];
  const answer = digits.reduce((sum, digit, index) => sum + digit * weights[index], 0);
  return {
    prompt: "다음은 도형을 색칠하여 수를 나타낸 것입니다. 아래 도형이 나타내는 수는 얼마인지 구하세요.",
    visual: { kind: "colored-shape-number", digits },
    answer: String(answer),
    solution: `각 열의 칸 하나는 왼쪽부터 64, 16, 4, 1을 나타냅니다. 색칠한 칸의 수를 세어 더하면 ${answer}입니다.`
  };
}

function sourceSymbolRelations({ difficulty = 2 }) {
  const rule = difficulty === 1
    ? { star: 6, circle: 4, triangle: 5, square: 9, firstStar: 2, firstCircle: 3, final: ["○", "▽"] }
    : difficulty === 3
      ? { star: 8, circle: 6, triangle: 7, square: 22, firstStar: 3, firstCircle: 4, final: ["☆", "▽", "▽"] }
      : { star: 8, circle: 6, triangle: 7, square: 15, firstStar: 3, firstCircle: 4, final: ["☆", "▽"] };
  return {
    prompt: "다음 ☆, ○, ▽은 서로 다른 한 자리 수입니다. □가 나타내는 수를 구하세요.",
    visual: { kind: "symbol-relations", ...rule },
    answer: String(rule.square),
    solution: `첫째 식에서 ☆는 ${rule.star}, ○은 ${rule.circle}입니다. 둘째 식에서 ▽은 ${rule.triangle}입니다. 마지막 식을 계산하면 □는 ${rule.square}입니다.`
  };
}

function sourceBalanceRelations({ difficulty = 2 }) {
  const templates = [];
  const rectangleWeights = [2, 3];
  const starRectangleCounts = difficulty === 1 ? [1, 2, 3] : difficulty === 2 ? [1, 2, 3] : [2, 3];
  const targetRectangleCounts = difficulty === 3 ? [2, 3] : [1];
  const circlePairs = difficulty === 3 ? [[2, 1], [3, 2], [3, 1], [4, 2]] : [[2, 1], [3, 2]];
  const middleRectangleCounts = [2, 3];
  rectangleWeights.forEach((rectangleWeight) => {
    starRectangleCounts.forEach((starRectangles) => {
      targetRectangleCounts.forEach((targetRectangles) => {
        circlePairs.forEach(([leftCircleCount, rightCircleCount]) => {
          middleRectangleCounts.forEach((middleRectangleCount) => templates.push({
            rectangleWeight, starRectangles, targetRectangles, leftCircleCount, rightCircleCount, middleRectangleCount
          }));
        });
      });
    });
  });
  const { rectangleWeight, starRectangles, targetRectangles, leftCircleCount, rightCircleCount, middleRectangleCount } = sample(templates);
  const starWeight = leftCircleCount - rightCircleCount + starRectangles * rectangleWeight;
  const answer = starWeight + targetRectangles * rectangleWeight;
  const hint = difficulty === 1 ? `도움: [그림 2]에서 긴 네모 1개의 무게를 먼저 구하세요.` : "";
  return {
    prompt: "다음 양팔저울은 모두 수평입니다. [그림 3]이 수평이 되려면 오른쪽 접시에 ○을 몇 개 놓아야 하는지 구하세요.",
    visual: { kind: "balance-relations", rectangleWeight, starRectangles, targetRectangles, leftCircleCount, rightCircleCount, middleRectangleCount, hint },
    answer: `${answer}개`,
    solution: `둘째 저울에서 긴 네모 1개는 ○ ${rectangleWeight}개와 같습니다. 첫째 저울에서 ☆는 ○ 1개와 긴 네모 ${starRectangles}개입니다. 따라서 [그림 3]의 ☆와 긴 네모 ${targetRectangles}개의 무게는 ○ ${answer}개와 같습니다.`,
    meta: { difficulty, rectangleWeight, starRectangles, targetRectangles, leftCircleCount, rightCircleCount, middleRectangleCount, starWeight, answer }
  };
}

function sourcePianoBounce({ difficulty = 2 }) {
  const target = difficulty === 1 ? randomInt(18, 42) : difficulty === 2 ? randomInt(50, 90) : randomInt(91, 150);
  const notes = ["도", "레", "미", "파", "솔", "라", "시", "도"];
  const offset = (target - 1) % 14;
  const key = offset < 8 ? offset + 1 : 15 - offset;
  return {
    prompt: `윤아는 건반 아래에 쓰인 순서로 피아노를 치고 있습니다. 윤아가 건반을 ${target}번 쳤다면 마지막에 친 음은 무엇인지 구하세요.`,
    visual: { kind: "source-piano", target },
    answer: notes[key - 1],
    solution: `도부터 다음 도까지 갔다가 다시 처음 도로 돌아오는 순서를 확인합니다. ${target}번째는 ${notes[key - 1]}를 치는 차례입니다.`
  };
}

function sourceSymbolSumGrid({ difficulty = 2 }) {
  const square = randomInt(difficulty === 1 ? 3 : 5, difficulty === 3 ? 10 : 8);
  const star = randomInt(difficulty === 1 ? 2 : 3, difficulty === 3 ? 10 : 7);
  const triangle = randomInt(difficulty === 1 ? 3 : 5, difficulty === 3 ? 12 : 9);
  const circle = randomInt(difficulty === 1 ? 2 : 4, difficulty === 3 ? 12 : 9);
  const rowOne = star + square + triangle;
  const rowTwo = square * 2 + star;
  const rowThree = triangle + square + circle;
  const columnTwo = square * 3;
  const answer = triangle + star + circle;
  return {
    prompt: "다음 그림에서 같은 도형은 같은 수를 나타내고, 오른쪽과 아래에 쓰여진 수는 각 줄의 합을 나타냅니다. ㉠에 알맞은 수를 구하세요.",
    visual: { kind: "symbol-sum-grid", rowOne, rowTwo, rowThree, columnTwo },
    answer: String(answer),
    solution: `가운데 세모 칸의 합은 ${columnTwo}이므로 네모는 ${square}입니다. 둘째 줄에서 별은 ${star}, 첫째 줄에서 세모는 ${triangle}, 셋째 줄에서 동그라미는 ${circle}입니다. 따라서 ㉠은 ${triangle} + ${star} + ${circle} = ${answer}입니다.`
  };
}

function sourceGrowingDotSquare({ difficulty = 2 }) {
  const target = difficulty === 1 ? randomInt(4, 8) : difficulty === 2 ? randomInt(5, 9) : randomInt(7, 11);
  const theme = sample(["navy", "coral", "gold", "teal"]);
  const pieceCount = target * target;
  return {
    prompt: `구슬을 놓아 다음 모양을 만들어 갈 때, ${target}번째 모양에는 구슬을 몇 개 놓는지 구하세요.`,
    visual: { kind: "growing-dot-square", target, theme },
    answer: String(pieceCount),
    solution: `1번째는 1개, 2번째는 4개, 3번째는 9개, 4번째는 16개입니다. 다음 모양으로 갈수록 가로와 세로에 구슬이 한 개씩 늘어납니다. ${target}번째는 가로 ${target}줄에 ${target}개씩 있으므로 모두 ${pieceCount}개입니다.`,
    meta: { difficulty, target, theme, pieceCount, answer: pieceCount }
  };
}

function sourceTwoDigitSumDifference({ difficulty = 2 }) {
  const choices = [];
  const minTens = difficulty === 1 ? 3 : difficulty === 2 ? 4 : 5;
  for (let tens = minTens; tens <= 9; tens += 1) {
    for (let ones = 0; ones < tens; ones += 1) {
      if (difficulty === 1 && ones > 5) continue;
      choices.push({ tens, ones });
    }
  }
  const { tens, ones } = sample(choices);
  const sum = tens + ones;
  const gap = tens - ones;
  return {
    prompt: "다음 주어진 조건을 만족하는 두 자리 수를 구하세요.",
    visual: { kind: "number-conditions", sum, gap },
    answer: String(tens * 10 + ones),
    solution: `십의 자리와 일의 자리의 합이 ${sum}, 차가 ${gap}입니다. 두 수를 만족하는 십의 자리는 ${tens}, 일의 자리는 ${ones}이므로 ${tens * 10 + ones}입니다.`
  };
}

function sourceEqualLineCross() {
  const layouts = [
    [1, 3, 5, 2, 4], [1, 4, 3, 2, 5], [2, 3, 1, 4, 5], [2, 5, 3, 1, 4],
    [3, 1, 5, 4, 2], [3, 2, 1, 5, 4], [3, 4, 5, 1, 2], [3, 5, 1, 2, 4],
    [4, 1, 3, 5, 2], [4, 3, 5, 2, 1], [5, 2, 3, 4, 1], [5, 3, 1, 4, 2]
  ];
  const [top, left, center, right, bottom] = sample(layouts);
  const sum = top + center + bottom;
  return {
    prompt: "1부터 5까지 수를 한 번씩 넣어 가로줄과 세로줄에 놓인 세 수의 합을 같게 하려고 합니다. ㉠에 들어갈 수를 구하세요.",
    visual: { kind: "equal-line-cross", top, left, center, right, bottom },
    answer: String(center),
    solution: `가로줄과 세로줄의 합이 모두 ${sum}이 되어야 합니다. 남은 수를 차례로 넣어 확인하면 가운데 ㉠은 ${center}입니다.`
  };
}

function sourceBusStops({ difficulty = 2 }) {
  const start = randomInt(difficulty === 1 ? 15 : difficulty === 2 ? 20 : 26, difficulty === 1 ? 24 : difficulty === 2 ? 34 : 45);
  const left = randomInt(difficulty === 1 ? 3 : 5, difficulty === 1 ? 7 : difficulty === 2 ? 11 : 16);
  const boarded = randomInt(difficulty === 1 ? 4 : 6, difficulty === 1 ? 9 : difficulty === 2 ? 14 : 20);
  const answer = start - left + boarded;
  return {
    prompt: `${start}명이 탄 버스가 출발했습니다. 다음과 같이 내리고 탔다면, 지금 버스에 타고 있는 사람은 몇 명인지 구하세요.`,
    visual: { kind: "bus-stops", start, left, boarded },
    answer: `${answer}명`,
    solution: `처음 ${start}명에서 첫 번째 정류장에 내린 ${left}명을 빼고, 두 번째 정류장에서 탄 ${boarded}명을 더합니다. ${start} - ${left} + ${boarded} = ${answer}입니다.`
  };
}

function shapeSumGridTriangleTop({ difficulty = 2 }) {
  let values;
  for (let attempt = 0; attempt < 100 && !values; attempt += 1) {
    const [triangle, square, circle, diamond, heart] = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 5);
    const rowSums = [triangle * 3, square * 2 + triangle, circle + diamond + heart];
    const columnSums = [triangle + square + circle, triangle + square + diamond, triangle * 2 + heart];
    if (new Set([...rowSums.slice(0, 2), ...columnSums]).size !== 5) continue;
    values = { triangle, square, circle, diamond, heart, rowSums, columnSums };
  }
  if (!values) return shapeSumGridTriangleTop({ difficulty });
  const { triangle, square, circle, diamond, heart, rowSums, columnSums } = values;
  const baseAnswer = rowSums[2];
  const answer = difficulty === 3 ? baseAnswer + triangle : baseAnswer;
  const hint = difficulty === 1 ? `도움: 세모 한 개는 ${triangle}입니다.` : "";
  return {
    prompt: difficulty === 3
      ? "다음 그림에서 같은 도형은 같은 수를 나타냅니다. ㉠과 세모 한 개를 더한 수를 구하세요."
      : "다음 그림에서 같은 도형은 같은 수를 나타내고, 오른쪽과 아래에 쓰인 수는 각 줄에 있는 세 수의 합을 나타냅니다. ㉠에 알맞은 수를 구하세요.",
    visual: { kind: "shape-sum-grid-triangle-top", rowSums, columnSums, hint },
    answer: String(answer),
    solution: `${difficulty === 1 ? `도움말에서 세모는 ${triangle}입니다. ` : `첫째 줄에서 세모 세 개의 합이 ${rowSums[0]}이므로 세모는 ${triangle}입니다. `}둘째 줄에서 네모는 ${square}입니다. 첫째와 둘째 세로줄에서 동그라미는 ${circle}, 마름모는 ${diamond}입니다. 셋째 세로줄에서 하트는 ${heart}입니다. ㉠은 ${circle} + ${diamond} + ${heart} = ${baseAnswer}입니다.${difficulty === 3 ? ` 여기에 세모 ${triangle}을 더하면 ${answer}입니다.` : ""}`,
    meta: { difficulty, triangle, square, circle, diamond, heart, rowSums, columnSums, baseAnswer, answer }
  };
}

function shapeSumGridTopTarget({ difficulty = 2 }) {
  const [triangle, square, circle, diamond] = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4);
  const rowSums = [triangle + square + circle, diamond + square + circle, circle * 2 + triangle];
  const columnSums = [triangle + diamond + circle, square * 2 + triangle, circle * 3];
  const hiddenSums = difficulty === 3 ? ["column-2"] : [];
  const hint = difficulty === 1 ? `○ 한 개는 ${circle}입니다.` : "";
  const squareTriangleComparison = square >= triangle
    ? `둘째 줄의 합 ${rowSums[1]}은 첫째 세로줄의 합 ${columnSums[0]}보다 ${square - triangle} 큽니다. 두 줄에 공통인 마름모와 동그라미를 빼고 보면 네모가 세모보다 ${square - triangle} 큰 것이므로 네모는 ${square}입니다.`
    : `첫째 세로줄의 합 ${columnSums[0]}은 둘째 줄의 합 ${rowSums[1]}보다 ${triangle - square} 큽니다. 두 줄에 공통인 마름모와 동그라미를 빼고 보면 세모가 네모보다 ${triangle - square} 큰 것이므로 네모는 ${square}입니다.`;
  return {
    prompt: "다음 그림에서 같은 도형은 같은 수를 나타내고, 오른쪽과 아래에 쓰인 수는 각 줄에 있는 세 수의 합을 나타냅니다. ㉠에 알맞은 수를 구하세요.",
    visual: { kind: "shape-sum-grid-top-target", rowSums, columnSums, hiddenSums, hint },
    answer: String(rowSums[0]),
    solution: `${difficulty === 1 ? `도움말에서 동그라미는 ${circle}입니다. ` : `셋째 세로줄에서 동그라미는 ${circle}입니다. `}셋째 줄에서 세모는 ${triangle}입니다. ${difficulty === 3 ? squareTriangleComparison : `둘째 세로줄에서 네모는 ${square}입니다.`} 따라서 ㉠은 ${triangle} + ${square} + ${circle} = ${rowSums[0]}입니다.`,
    meta: { difficulty, triangle, square, circle, diamond, rowSums, columnSums, hiddenSums, answer: rowSums[0] }
  };
}

function shapeSumGridTriangleColumnTarget({ difficulty = 2 }) {
  const [triangle, square, diamond, circle] = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 4);
  const rowSums = [triangle + circle + diamond, triangle + square * 2, triangle + diamond + square];
  const columnSums = [triangle * 3, circle + square + diamond, diamond + square * 2];
  const hiddenSums = difficulty === 3 ? ["column-3"] : [];
  const hint = difficulty === 1 ? `세모 한 개는 ${triangle}입니다.` : "";
  return {
    prompt: "다음 그림에서 같은 도형은 같은 수를 나타내고, 오른쪽과 아래에 쓰인 수는 각 줄에 있는 세 수의 합을 나타냅니다. ㉠에 알맞은 수를 구하세요.",
    visual: { kind: "shape-sum-grid-triangle-column-target", rowSums, columnSums, hiddenSums, hint },
    answer: String(rowSums[0]),
    solution: `${difficulty === 1 ? `도움말에서 세모는 ${triangle}입니다. ` : `첫째 세로줄에는 세모가 세 개 있고 합이 ${columnSums[0]}이므로 세모는 ${triangle}입니다. `}둘째 줄에서 네모는 ${square}입니다. 셋째 줄에서 마름모는 ${diamond}입니다. 둘째 세로줄에서 동그라미는 ${circle}입니다. 따라서 ㉠은 ${triangle} + ${circle} + ${diamond} = ${rowSums[0]}입니다.`,
    meta: { difficulty, triangle, square, diamond, circle, rowSums, columnSums, hiddenSums, answer: rowSums[0] }
  };
}

function busBoardThenLeave({ difficulty = 2 }) {
  const start = randomInt(difficulty === 1 ? 15 : difficulty === 2 ? 20 : 24, difficulty === 1 ? 24 : difficulty === 2 ? 34 : 40);
  const boardedFirst = randomInt(difficulty === 1 ? 3 : 6, difficulty === 1 ? 8 : difficulty === 2 ? 14 : 15);
  const afterFirst = start + boardedFirst;
  const left = randomInt(difficulty === 1 ? 2 : 8, Math.min(difficulty === 1 ? 7 : difficulty === 2 ? 18 : 20, afterFirst - 5));
  const boardedLast = difficulty === 3 ? randomInt(3, 10) : 0;
  const events = [
    { action: "board", count: boardedFirst },
    { action: "leave", count: left },
    ...(difficulty === 3 ? [{ action: "board", count: boardedLast }] : [])
  ];
  const answer = events.reduce((count, event) => count + (event.action === "board" ? event.count : -event.count), start);
  const calculation = [start, `+ ${boardedFirst}`, `- ${left}`, ...(difficulty === 3 ? [`+ ${boardedLast}`] : []), `= ${answer}`].join(" ");
  return {
    prompt: `${start}명이 탄 버스가 출발했습니다. 다음과 같이 타고 내렸다면, 지금 버스에 타고 있는 사람은 몇 명인지 구하세요.`,
    visual: {
      kind: "bus-stops",
      events,
      hintAfterFirst: difficulty === 1 ? `첫 번째 정류장을 지난 뒤에는 ${afterFirst}명이 타고 있습니다.` : ""
    },
    answer: `${answer}명`,
    solution: `처음 ${start}명에서 첫 번째 정류장에 탄 ${boardedFirst}명을 더하고, 두 번째 정류장에서 내린 ${left}명을 뺍니다.${difficulty === 3 ? ` 세 번째 정류장에서 탄 ${boardedLast}명을 다시 더합니다.` : ""} ${calculation}명입니다.`,
    meta: { difficulty, start, events, afterFirst, answer }
  };
}

function symbolRelationTwoToThree({ difficulty = 2 }) {
  const templates = difficulty === 1
    ? SYMBOL_RELATION_UNIQUE_TEMPLATES.filter(({ firstStar, firstCircle }) => firstStar <= 6 && firstCircle <= 6)
    : difficulty === 2
      ? SYMBOL_RELATION_UNIQUE_TEMPLATES.filter(({ firstStar, firstCircle }) => firstStar <= 7 && firstCircle <= 7)
      : SYMBOL_RELATION_UNIQUE_TEMPLATES;
  const { firstStar, firstCircle, values } = sample(templates);
  const pairTargets = [["○", "▽"], ["☆", "○"], ["☆", "▽"]];
  const tripleTargets = [
    ["☆", "○", "▽"],
    ["☆", "○", "○"],
    ["○", "○", "▽"],
    ["☆", "▽", "▽"]
  ];
  const final = sample(difficulty === 3 ? tripleTargets : pairTargets);
  const answer = final.reduce((sum, symbol) => sum + values[symbol], 0);
  const hint = difficulty === 1 ? `도움: 첫째 식과 둘째 식을 함께 만족하는 ☆는 ${values["☆"]}입니다.` : "";
  return {
    prompt: "다음 ☆, ○, ▽은 서로 다른 한 자리 수입니다. □가 나타내는 수를 구하세요.",
    visual: { kind: "symbol-relation-two-to-three", firstStar, firstCircle, final, hint },
    answer: String(answer),
    solution: `첫째 식과 둘째 식을 함께 만족하는 서로 다른 한 자리 수를 찾으면 ☆=${values["☆"]}, ○=${values["○"]}, ▽=${values["▽"]}입니다. 마지막 식 ${final.join("+")}를 계산하면 □는 ${answer}입니다.`,
    meta: { difficulty, firstStar, firstCircle, values, final, answer }
  };
}

const SYMBOL_RELATION_UNIQUE_TEMPLATES = (() => {
  const templates = [];
  for (let firstStar = 2; firstStar <= 9; firstStar += 1) {
    for (let firstCircle = 2; firstCircle <= 9; firstCircle += 1) {
      const solutions = [];
      for (let star = 1; star <= 9; star += 1) {
        for (let circle = 1; circle <= 9; circle += 1) {
          if (firstStar * star !== firstCircle * circle || (star + circle) % 2 !== 0) continue;
          const triangle = (star + circle) / 2;
          if (triangle <= 9 && new Set([star, circle, triangle]).size === 3) solutions.push({ "☆": star, "○": circle, "▽": triangle });
        }
      }
      if (solutions.length === 1) templates.push({ firstStar, firstCircle, values: solutions[0] });
    }
  }
  return templates;
})();

function symbolRelationThreeToFour({ difficulty = 2 }) {
  const templates = difficulty === 3
    ? SYMBOL_RELATION_UNIQUE_TEMPLATES
    : SYMBOL_RELATION_UNIQUE_TEMPLATES.filter(({ firstStar, firstCircle }) => firstStar <= 7 && firstCircle <= 7);
  const { firstStar, firstCircle, values } = sample(templates);
  const pairTargets = [
    ["○", "▽"],
    ["☆", "○"],
    ["☆", "▽"]
  ];
  const tripleTargets = [
    ["☆", "○", "▽"],
    ["☆", "▽", "▽"],
    ["○", "○", "▽"]
  ];
  const final = sample(difficulty === 3 ? tripleTargets : pairTargets);
  const answer = final.reduce((sum, symbol) => sum + values[symbol], 0);
  const hint = difficulty === 1 ? `도움: 첫째 식과 둘째 식을 함께 만족하는 ☆는 ${values["☆"]}입니다.` : "";
  return {
    prompt: "다음 ☆, ○, ▽은 서로 다른 한 자리 수입니다. □가 나타내는 수를 구하세요.",
    visual: { kind: "symbol-relation-three-to-four", firstStar, firstCircle, final, hint },
    answer: String(answer),
    solution: `첫째 식과 둘째 식을 함께 만족하는 서로 다른 한 자리 수를 찾으면 ☆=${values["☆"]}, ○=${values["○"]}, ▽=${values["▽"]}입니다. 마지막 식 ${final.join("+")}를 계산하면 □는 ${answer}입니다.`,
    meta: { difficulty, firstStar, firstCircle, values, final, answer }
  };
}

function numberLineSixPoints({ difficulty = 2 }) {
  const limit = difficulty === 1 ? [5, 16] : difficulty === 2 ? [4, 28] : [10, 26];
  let gaps;
  let distances;
  do {
    gaps = Array.from({ length: 5 }, () => randomInt(limit[0], limit[1]));
    const [ab, bc, cd, de, ef] = gaps;
    distances = {
      ac: ab + bc,
      ad: ab + bc + cd,
      bd: bc + cd,
      ce: cd + de,
      bf: bc + cd + de + ef
    };
  } while (new Set(Object.values(distances)).size < 5 || distances.bf > 100 || (difficulty === 3 && gaps.reduce((sum, value) => sum + value, 0) > 100));

  const [ab, bc, cd, de, ef] = gaps;
  const askWhole = difficulty === 3;
  const answer = askWhole ? gaps.reduce((sum, value) => sum + value, 0) : ef;
  const target = askWhole ? "A와 F" : "E와 F";
  const hints = difficulty === 1 ? [{ from: "B", to: "C", value: bc }, { from: "C", to: "D", value: cd }] : [];
  return {
    prompt: `다음 그림은 수직선 위에 있는 6개 점 사이의 거리를 나타낸 것입니다. 두 점 ${target} 사이의 거리를 구하세요.`,
    visual: { kind: "number-line-six-points", gaps, distances, hints, target: askWhole ? "AF" : "EF" },
    answer: String(answer),
    solution: `AC ${distances.ac}에서 AD ${distances.ad}까지 늘어난 만큼 CD는 ${cd}입니다. BD ${distances.bd}에서 CD ${numberObject(cd)} 빼면 BC는 ${bc}, CE ${distances.ce}에서 CD ${numberObject(cd)} 빼면 DE는 ${de}입니다. BF ${distances.bf}에서 BC, CD, DE의 합 ${numberObject(bc + cd + de)} 빼면 EF는 ${ef}입니다.${askWhole ? ` 또 AC에서 BC를 빼면 AB는 ${ab}이므로 AF는 AB ${numberAnd(ab)} BF ${numberObject(distances.bf)} 더한 ${answer}입니다.` : ""}`,
    meta: { difficulty, gaps, distances, hints, target: askWhole ? "AF" : "EF", answer }
  };
}

function goStoneDifferenceInverse({ difficulty = 2 }) {
  const targetColor = difficulty === 3 && Math.random() < 0.5 ? "흰 돌" : "검은 돌";
  const difference = difficulty === 1 ? randomInt(3, 8) : difficulty === 2 ? randomInt(8, 21) : randomInt(12, 25);
  const answer = targetColor === "검은 돌" ? difference * 2 - 1 : difference * 2;
  const sequence = targetColor === "검은 돌" ? "1, 3, 5, 7, …" : "2, 4, 6, 8, …";
  const hint = difficulty === 1 ? `${targetColor}이 더 많은 때는 ${sequence}번째입니다.` : "";
  return {
    prompt: `다음과 같은 규칙으로 바둑돌을 놓을 때 ${targetColor}이 다른 색 돌보다 ${difference}개 많아지는 것은 몇 번째인지 구하세요.`,
    visual: { kind: "go-stone-difference-inverse", stages: 5, targetColor, difference, hint },
    answer: `${answer}번째`,
    solution: `${targetColor}이 1개, 2개, 3개, … 더 많은 때는 차례로 ${sequence}번째입니다. 따라서 ${difference}개 더 많은 때는 ${answer}번째입니다.`,
    meta: { difficulty, targetColor, difference, answer }
  };
}

function goStoneDifferenceInverseWhite({ difficulty = 2 }) {
  const difference = difficulty === 1 ? randomInt(3, 8) : difficulty === 2 ? randomInt(8, 20) : randomInt(12, 24);
  const offset = difficulty === 3 ? sample([2, 4]) : 0;
  const baseAnswer = difference * 2;
  const answer = baseAnswer + offset;
  const hint = difficulty === 1 ? "흰 돌이 1개, 2개, 3개 더 많은 때는 차례로 2번째, 4번째, 6번째입니다." : "";
  const targetText = offset
    ? `흰 돌이 ${difference}개 더 많은 때보다 ${offset}번째 뒤`
    : `흰 돌이 ${difference}개 더 많은 때`;
  const prompt = offset
    ? `다음과 같은 규칙으로 바둑돌을 놓습니다. 흰 돌이 검은 돌보다 ${difference}개 많아지는 때보다 ${offset}번째 뒤에 있는 모양은 몇 번째인지 구하세요.`
    : `다음과 같은 규칙으로 바둑돌을 놓을 때 흰 돌이 검은 돌보다 ${difference}개 많아지는 것은 몇 번째인지 구하세요.`;

  return {
    prompt,
    visual: { kind: "go-stone-difference-inverse", stages: 5, targetColor: "흰 돌", difference, hint, targetText },
    answer: `${answer}번째`,
    solution: `흰 돌이 1개, 2개, 3개, … 더 많은 때는 차례로 2번째, 4번째, 6번째, …입니다. 흰 돌이 ${difference}개 더 많은 때는 ${baseAnswer}번째${offset ? `이고, 여기에서 ${offset}번째 뒤는 ${answer}번째` : ""}입니다.`,
    meta: { difficulty, targetColor: "흰 돌", difference, offset, baseAnswer, answer }
  };
}

function balanceScaleThreeObjects({ difficulty = 2 }) {
  const squareBesideStar = randomInt(1, 3);
  const squareBesideCircle = randomInt(1, 3);
  const squareBesideDiamond = randomInt(1, 3);
  const diamondWeight = squareBesideStar + squareBesideCircle;
  const starWeight = squareBesideDiamond + diamondWeight;
  const circleWeight = squareBesideStar + starWeight;
  const askCombined = difficulty === 3;
  const answer = askCombined ? circleWeight + diamondWeight : circleWeight;
  const target = askCombined ? "○ 1개와 ◇ 1개를 합한 무게" : "○ 1개의 무게";
  const hint = difficulty === 1
    ? `◇ 1개는 □ ${diamondWeight}개의 무게와 같습니다.`
    : "";

  return {
    prompt: `다음 양팔저울은 모두 수평입니다. ${target}는 □ 몇 개의 무게와 같은지 구하세요.`,
    visual: {
      kind: "balance-scale-three-objects",
      squareBesideStar,
      squareBesideCircle,
      squareBesideDiamond,
      hint,
      askCombined
    },
    answer: `${answer}개`,
    solution: `첫째 저울의 ○를 □ ${squareBesideStar}개와 ☆ 1개로 바꾸어 둘째 저울에 놓아 봅니다. 양쪽의 ☆를 빼면 ◇ 1개는 □ ${diamondWeight}개와 같습니다. 셋째 저울에서 ☆ 1개는 □ ${squareBesideDiamond}개와 ◇ 1개이므로 □ ${starWeight}개와 같습니다. 따라서 ○ 1개는 □ ${circleWeight}개${askCombined ? `이고, 여기에 ◇의 □ ${diamondWeight}개를 더하면 모두 □ ${answer}개` : ""}와 같습니다.`,
    meta: { difficulty, squareBesideStar, squareBesideCircle, squareBesideDiamond, diamondWeight, starWeight, circleWeight, askCombined, answer }
  };
}

function buildBalanceCircleTargetTemplates(maxCount, maxTargetCount, minTargetObjects) {
  const gcd = (left, right) => {
    let a = left;
    let b = right;
    while (b) [a, b] = [b, a % b];
    return a;
  };
  const templates = [];
  for (let circleWeight = 1; circleWeight <= 12; circleWeight += 1) {
    for (let diamondWeight = 1; diamondWeight <= 12; diamondWeight += 1) {
      for (let starWeight = 1; starWeight <= 12; starWeight += 1) {
        if (new Set([circleWeight, diamondWeight, starWeight]).size !== 3) continue;
        if (gcd(gcd(circleWeight, diamondWeight), starWeight) !== 1) continue;
        const firstRelations = [];
        const secondRelations = [];
        const targets = [];
        for (let circleCount = 1; circleCount <= maxCount; circleCount += 1) {
          for (let diamondCount = 1; diamondCount <= maxCount; diamondCount += 1) {
            for (let starCount = 1; starCount <= maxCount; starCount += 1) {
              if (circleCount * circleWeight + diamondCount * diamondWeight === starCount * starWeight) {
                firstRelations.push({ circleCount, diamondCount, starCount });
              }
              if (diamondCount * diamondWeight + starCount * starWeight === circleCount * circleWeight) {
                secondRelations.push({ diamondCount, starCount, circleCount });
              }
            }
          }
        }
        for (let targetDiamondCount = 1; targetDiamondCount <= maxTargetCount; targetDiamondCount += 1) {
          for (let targetStarCount = 1; targetStarCount <= maxTargetCount; targetStarCount += 1) {
            if (targetDiamondCount + targetStarCount < minTargetObjects) continue;
            const targetWeight = targetDiamondCount * diamondWeight + targetStarCount * starWeight;
            if (targetWeight % circleWeight !== 0) continue;
            const answer = targetWeight / circleWeight;
            if (answer < 2 || answer > 12) continue;
            targets.push({ targetDiamondCount, targetStarCount, answer });
          }
        }
        for (const first of firstRelations) {
          for (const second of secondRelations) {
            for (const target of targets) {
              templates.push({
                ...first,
                secondDiamondCount: second.diamondCount,
                secondStarCount: second.starCount,
                secondCircleCount: second.circleCount,
                ...target,
                weights: { circle: circleWeight, diamond: diamondWeight, star: starWeight }
              });
            }
          }
        }
      }
    }
  }
  return templates;
}

const BALANCE_CIRCLE_TARGET_TEMPLATES = {
  1: buildBalanceCircleTargetTemplates(3, 2, 2),
  2: buildBalanceCircleTargetTemplates(4, 3, 3),
  3: buildBalanceCircleTargetTemplates(5, 4, 4)
};

function balanceScaleCircleTarget({ difficulty = 2 }) {
  const template = sample(BALANCE_CIRCLE_TARGET_TEMPLATES[difficulty] || BALANCE_CIRCLE_TARGET_TEMPLATES[2]);
  const hint = difficulty === 1
    ? `도움: ○는 ${template.weights.circle}칸, ◇는 ${template.weights.diamond}칸, ☆는 ${template.weights.star}칸으로 나타낼 수 있습니다.`
    : "";
  return {
    prompt: "다음 양팔저울은 모두 수평입니다. [그림 3]의 오른쪽 접시에 ○를 몇 개 올려놓으면 수평이 되는지 구하세요.",
    visual: { kind: "balance-scale-circle-target", ...template, hint },
    answer: `${template.answer}개`,
    solution: `두 저울에 모두 맞도록 무게를 같은 크기의 칸으로 나타내면 ○는 ${template.weights.circle}칸, ◇는 ${template.weights.diamond}칸, ☆는 ${template.weights.star}칸으로 둘 수 있습니다. [그림 3]의 왼쪽은 ${template.targetDiamondCount * template.weights.diamond} + ${template.targetStarCount * template.weights.star} = ${template.targetDiamondCount * template.weights.diamond + template.targetStarCount * template.weights.star}칸이고, ○ ${template.answer}개의 무게와 같습니다.`,
    meta: { difficulty, ...template }
  };
}

function buildBalanceStarTemplates(maxCount, targetCircleCount, maxTargetDiamonds, maxWeight) {
  const templates = [];
  for (let starLeft = 2; starLeft <= maxCount; starLeft += 1) {
    for (let diamondRight = 2; diamondRight <= maxCount; diamondRight += 1) {
      for (let circleLeft = 2; circleLeft <= maxCount; circleLeft += 1) {
        for (let starRight = 2; starRight <= maxCount; starRight += 1) {
          for (let targetDiamonds = 1; targetDiamonds <= maxTargetDiamonds; targetDiamonds += 1) {
            const starWeight = circleLeft * diamondRight + 1;
            const diamondWeight = starRight + starLeft * circleLeft;
            const circleWeight = diamondRight * diamondWeight - starLeft * starWeight;
            const targetWeight = targetCircleCount * circleWeight + targetDiamonds * diamondWeight;
            if (circleWeight <= 0 || targetWeight % starWeight !== 0) continue;
            const answer = targetWeight / starWeight;
            if (answer < 2 || answer > 12) continue;
            if (new Set([starWeight, circleWeight, diamondWeight]).size !== 3) continue;
            const divisor = [starWeight, circleWeight, diamondWeight].reduce((left, right) => {
              let a = left;
              let b = right;
              while (b) [a, b] = [b, a % b];
              return a;
            });
            const weights = {
              star: starWeight / divisor,
              circle: circleWeight / divisor,
              diamond: diamondWeight / divisor
            };
            if (Math.max(...Object.values(weights)) > maxWeight) continue;
            templates.push({ starLeft, diamondRight, circleLeft, starRight, targetCircleCount, targetDiamonds, weights, answer });
          }
        }
      }
    }
  }
  return templates;
}

const BALANCE_STAR_TEMPLATES = {
  1: buildBalanceStarTemplates(3, 1, 3, 12),
  2: buildBalanceStarTemplates(4, 1, 3, 18),
  3: buildBalanceStarTemplates(5, 2, 4, 24)
};

function balanceScaleStarTarget({ difficulty = 2 }) {
  const template = sample(BALANCE_STAR_TEMPLATES[difficulty] || BALANCE_STAR_TEMPLATES[2]);
  const { starLeft, diamondRight, circleLeft, starRight, targetCircleCount, targetDiamonds, weights, answer } = template;
  const hint = difficulty === 1
    ? `도움: 각 물건의 무게를 같은 크기의 칸으로 나타내어 두 저울에 모두 맞는 수를 찾아보세요.`
    : "";
  return {
    prompt: "다음 양팔저울은 모두 수평입니다. [그림 3]의 오른쪽 접시에 ☆를 몇 개 올려놓으면 수평이 되는지 구하세요.",
    visual: { kind: "balance-scale-star-target", starLeft, diamondRight, circleLeft, starRight, targetCircleCount, targetDiamonds, hint },
    answer: `${answer}개`,
    solution: `두 저울에 모두 맞도록 무게를 같은 크기의 칸으로 나타내면 ☆는 ${weights.star}칸, ○는 ${weights.circle}칸, ◇는 ${weights.diamond}칸으로 둘 수 있습니다. [그림 3]의 왼쪽은 ${targetCircleCount * weights.circle} + ${targetDiamonds * weights.diamond} = ${targetCircleCount * weights.circle + targetDiamonds * weights.diamond}칸이고, ☆ ${answer}개의 무게와 같습니다.`,
    meta: { difficulty, starLeft, diamondRight, circleLeft, starRight, targetCircleCount, targetDiamonds, weights, answer }
  };
}

function balanceScaleFourObjects({ difficulty = 2 }) {
  let result = null;
  for (let attempt = 0; attempt < 300 && !result; attempt += 1) {
    const starCount = difficulty === 1 ? randomInt(1, 2) : randomInt(2, difficulty === 2 ? 3 : 4);
    let diamondCount = difficulty === 1 ? randomInt(starCount + 1, 5) : randomInt(starCount + 1, difficulty === 2 ? 5 : 6);
    if (diamondCount === starCount) diamondCount += 1;
    const divisor = ((a, b) => { while (b) [a, b] = [b, a % b]; return a; })(starCount, diamondCount);
    if (divisor !== 1) continue;
    const starWeight = diamondCount / divisor;
    const diamondWeight = starCount / divisor;
    const squareStarCount = randomInt(1, 2);
    const squareDiamondCount = randomInt(1, 2);
    const squareWeight = squareStarCount * starWeight + squareDiamondCount * diamondWeight;
    const circleSquareCount = difficulty === 1 ? randomInt(1, 2) : randomInt(1, difficulty === 2 ? 3 : 4);
    const circleDiamondCount = difficulty === 1 ? randomInt(0, 2) : randomInt(difficulty === 2 ? 1 : 0, difficulty === 2 ? 3 : 4);
    const circleWeight = circleSquareCount * squareWeight + circleDiamondCount * diamondWeight;
    if (circleWeight % diamondWeight !== 0) continue;
    const answer = circleWeight / diamondWeight;
    if (answer < 3 || answer > (difficulty === 3 ? 24 : 14)) continue;
    const expandedStarCount = circleSquareCount * squareStarCount;
    const expandedDiamondCount = circleSquareCount * squareDiamondCount + circleDiamondCount;
    const replacementGroups = expandedStarCount / starCount;
    if (!Number.isInteger(replacementGroups)) continue;
    result = { starCount, diamondCount, starWeight, diamondWeight, squareStarCount, squareDiamondCount, squareWeight, circleSquareCount, circleDiamondCount, circleWeight, expandedStarCount, expandedDiamondCount, replacementGroups, answer };
  }
  if (!result) return balanceScaleFourObjects({ difficulty });
  const { starCount, diamondCount, starWeight, diamondWeight, squareStarCount, squareDiamondCount, squareWeight, circleSquareCount, circleDiamondCount, circleWeight, expandedStarCount, expandedDiamondCount, replacementGroups, answer } = result;
  const hint = difficulty === 1 ? `☆ 1개는 ◇ ${starWeight}개의 무게와 같습니다.` : "";
  return {
    prompt: "다음 양팔저울은 모두 수평입니다. ○ 1개는 ◇ 몇 개의 무게와 같은지 구하세요.",
    visual: { kind: "balance-scale-four-objects", starCount, diamondCount, squareStarCount, squareDiamondCount, circleSquareCount, circleDiamondCount, hint },
    answer: `${answer}개`,
    solution: `셋째 저울을 이용해 첫째 저울의 □를 바꾸면 ○ 1개는 ☆ ${expandedStarCount}개와 ◇ ${expandedDiamondCount}개를 합한 무게입니다. 둘째 저울의 ☆ ${starCount}개를 ◇ ${diamondCount}개로 ${replacementGroups}번 바꾸면 ○ 1개는 ◇ ${answer}개의 무게와 같습니다.`,
    meta: { difficulty, starCount, diamondCount, starWeight, diamondWeight, squareStarCount, squareDiamondCount, squareWeight, circleSquareCount, circleDiamondCount, circleWeight, expandedStarCount, expandedDiamondCount, replacementGroups, answer }
  };
}

function symbolSumGridSquareTop({ difficulty = 2 }) {
  const max = difficulty === 1 ? 6 : difficulty === 2 ? 9 : 12;
  const [square, diamond, circle, triangle] = shuffle(Array.from({ length: max - 1 }, (_, index) => index + 2)).slice(0, 4);
  const rowSums = [square * 3, square + diamond + triangle, diamond + circle * 2];
  const columnSums = [square * 2 + diamond, square + diamond + circle, square + triangle + circle];
  const hiddenSums = difficulty === 3 ? ["column-2"] : [];
  return {
    prompt: "다음 그림에서 같은 도형은 같은 수를 나타내고, 오른쪽과 아래에 쓰인 수는 각 줄에 있는 세 수의 합을 나타냅니다. ㉠에 알맞은 수를 구하세요.",
    visual: {
      kind: "symbol-sum-grid-square-top",
      rowSums,
      columnSums,
      hiddenSums,
      hint: difficulty === 1 ? `□ 한 개는 ${square}입니다.` : ""
    },
    answer: String(columnSums[2]),
    solution: `첫째 줄에서 네모는 ${square}입니다. 첫째 세로줄에서 마름모는 ${diamond}, ${difficulty === 3 ? "셋째 줄" : "둘째 세로줄"}에서 동그라미는 ${circle}, 둘째 줄에서 세모는 ${triangle}입니다. 따라서 ㉠은 ${square} + ${triangle} + ${circle} = ${columnSums[2]}입니다.`,
    meta: { difficulty, square, diamond, circle, triangle, rowSums, columnSums, hiddenSums, answer: columnSums[2] }
  };
}

function shapeEquationAddSubtract({ difficulty = 2 }) {
  let square;
  let addend;
  let total;
  let heart;
  let minuend;

  if (difficulty === 1) {
    square = randomInt(2, 6);
    addend = randomInt(1, 9 - square);
    heart = randomInt(1, 9 - square);
    total = square + addend;
    minuend = square + heart;
  } else {
    do {
      square = randomInt(difficulty === 2 ? 21 : 24, difficulty === 2 ? 39 : 48);
      addend = randomInt(14, difficulty === 2 ? 39 : 46);
      heart = randomInt(12, difficulty === 2 ? 29 : 38);
      total = square + addend;
      minuend = square + heart;
    } while (total > 99 || minuend > 99 || square % 10 + addend % 10 < 10 || square % 10 + heart % 10 < 10);
  }

  const exampleCircle = randomInt(2, 6);
  const exampleAdd = randomInt(1, 9 - exampleCircle);
  const exampleDifference = randomInt(1, 9 - exampleCircle);
  const equations = [
    { left: "square", operator: "+", right: addend, result: total },
    { left: minuend, operator: "-", right: "square", result: "heart" }
  ];
  let target = "heart";
  let answer = heart;
  let extraAddend = 0;
  let star = 0;

  if (difficulty === 3) {
    extraAddend = randomInt(11, 27);
    star = heart + extraAddend;
    equations.push({ left: "heart", operator: "+", right: extraAddend, result: "star" });
    target = "star";
    answer = star;
  }

  const targetName = target === "heart" ? "하트" : "별";
  const solution = difficulty === 3
    ? `네모는 ${total}에서 ${numberObject(addend)} 뺀 ${square}입니다. ${minuend}에서 ${numberObject(square)} 빼면 하트는 ${heart}이고, ${heart} + ${extraAddend} = ${star}이므로 별은 ${star}입니다.`
    : `네모는 ${total}에서 ${numberObject(addend)} 뺀 ${square}입니다. ${minuend}에서 ${numberObject(square)} 빼면 하트는 ${heart}입니다.`;
  return {
    prompt: `[보기]의 계산식처럼 같은 모양은 같은 수를 나타냅니다. 오른쪽 계산식에 있는 두 네모도 같은 수를 나타낼 때, ${targetName}에 알맞은 수를 구하세요.`,
    visual: {
      kind: "shape-equation-add-subtract",
      example: {
        circle: exampleCircle,
        addend: exampleAdd,
        sum: exampleCircle + exampleAdd,
        minuend: exampleCircle + exampleDifference,
        difference: exampleDifference
      },
      equations,
      target
    },
    answer: String(answer),
    solution,
    meta: { difficulty, square, addend, total, heart, minuend, extraAddend, star, target, answer }
  };
}

function twoDigitParityGap({ difficulty = 2 }) {
  let result;
  for (let attempt = 0; attempt < 300 && !result; attempt += 1) {
    const tens = randomInt(difficulty === 3 ? 4 : 3, difficulty === 3 ? 6 : 7);
    const evenOnes = [0, 2, 4, 6, 8].filter((ones) => ones < tens);
    const ones = sample(evenOnes);
    const answer = tens * 10 + ones;
    const gap = tens - ones;
    const lower = difficulty === 3 ? Math.max(10, (tens - 3) * 10) : (tens - 1) * 10;
    const upper = difficulty === 3 ? Math.min(100, (tens + 4) * 10) : (tens + 2) * 10;
    const digitSum = difficulty === 3 ? tens + ones : null;
    const gapCandidates = Array.from({ length: upper - lower - 1 }, (_, index) => lower + index + 1)
      .filter((value) => value % 2 === 0 && Math.floor(value / 10) - value % 10 === gap);
    const solutions = gapCandidates.filter((value) => digitSum === null || Math.floor(value / 10) + value % 10 === digitSum);
    if (solutions.length !== 1 || solutions[0] !== answer) continue;
    if (difficulty === 3 && gapCandidates.length < 2) continue;
    const distractors = shuffle(Array.from({ length: upper - lower - 1 }, (_, index) => lower + index + 1)
      .filter((value) => value % 2 === 0 && value !== answer && !solutions.includes(value))).slice(0, 2);
    if (difficulty === 1 && distractors.length < 2) continue;
    result = {
      tens,
      ones,
      answer,
      gap,
      lower,
      upper,
      digitSum,
      gapCandidates,
      solutions,
      choices: difficulty === 1 ? shuffle([answer, ...distractors]) : []
    };
  }
  if (!result) return twoDigitParityGap({ difficulty });
  const { tens, ones, answer, gap, lower, upper, digitSum, gapCandidates, solutions, choices } = result;
  const sumSentence = digitSum === null ? "" : ` 또 십의 자리 숫자와 일의 자리 숫자의 합은 ${digitSum}입니다.`;
  return {
    prompt: `일의 자리 숫자가 0, 2, 4, 6, 8인 수를 짝수라고 합니다. 다음 주어진 조건을 만족하는 두 자리 수를 ${difficulty === 1 ? "보기에서 고르세요." : "구하세요."}`,
    visual: { kind: "two-digit-parity-gap", lower, upper, gap, digitSum, choices },
    answer: String(answer),
    solution: `${lower}보다 크고 ${upper}보다 작은 짝수 중 십의 자리 숫자와 일의 자리 숫자의 차가 ${gap}인 수를 찾습니다.${sumSentence} 십의 자리 숫자는 ${tens}, 일의 자리 숫자는 ${ones}이므로 답은 ${answer}입니다.`,
    meta: { difficulty, tens, ones, answer, gap, lower, upper, digitSum, gapCandidates, solutions, choices }
  };
}

function twoDigitEvenOnesGreaterGap({ difficulty = 2 }) {
  const candidatesFor = (gap, lower, upper) => Array.from({ length: upper - lower - 1 }, (_, index) => lower + index + 1)
    .filter((value) => value >= 10
      && value <= 99
      && value % 2 === 0
      && value % 10 - Math.floor(value / 10) === gap);
  let result;
  for (let attempt = 0; attempt < 500 && !result; attempt += 1) {
    const tens = randomInt(1, difficulty === 3 ? 7 : 6);
    const possibleOnes = [2, 4, 6, 8].filter((ones) => ones > tens);
    if (!possibleOnes.length) continue;
    const ones = sample(possibleOnes);
    const answer = tens * 10 + ones;
    const gap = ones - tens;
    const allGapCandidates = candidatesFor(gap, 9, 100);
    const answerIndex = allGapCandidates.indexOf(answer);
    const previous = allGapCandidates[answerIndex - 1] || 9;
    const next = allGapCandidates[answerIndex + 1] || 100;
    let lower;
    let upper;
    let digitSum = null;
    if (difficulty === 3) {
      lower = Math.max(9, answer - randomInt(20, 38));
      upper = Math.min(100, answer + randomInt(20, 38));
      digitSum = tens + ones;
    } else {
      lower = randomInt(Math.max(9, previous), answer - 1);
      upper = randomInt(answer + 1, Math.min(100, next));
      if (difficulty === 2) {
        lower = Math.max(10, previous, answer - 20, Math.floor(lower / 10) * 10);
        upper = Math.min(100, next, answer + 20, Math.ceil(upper / 10) * 10);
      }
    }
    const gapCandidates = candidatesFor(gap, lower, upper);
    const solutions = gapCandidates.filter((value) => digitSum === null
      || Math.floor(value / 10) + value % 10 === digitSum);
    if (solutions.length !== 1 || solutions[0] !== answer) continue;
    if (difficulty === 3 && gapCandidates.length < 2) continue;
    const distractors = shuffle(Array.from({ length: upper - lower - 1 }, (_, index) => lower + index + 1)
      .filter((value) => value >= 10 && value <= 99 && value % 2 === 0 && value !== answer)).slice(0, 2);
    if (difficulty === 1 && distractors.length < 2) continue;
    result = {
      tens,
      ones,
      answer,
      gap,
      lower,
      upper,
      digitSum,
      gapCandidates,
      solutions,
      choices: difficulty === 1 ? shuffle([answer, ...distractors]) : []
    };
  }
  if (!result) return twoDigitEvenOnesGreaterGap({ difficulty });
  const { tens, ones, answer, gap, lower, upper, digitSum, gapCandidates, solutions, choices } = result;
  const sumSentence = digitSum === null ? "" : ` 또 십의 자리 숫자와 일의 자리 숫자의 합은 ${digitSum}입니다.`;
  return {
    prompt: `일의 자리 숫자가 0, 2, 4, 6, 8인 수를 짝수라고 합니다. 다음 주어진 조건을 만족하는 두 자리 수를 ${difficulty === 1 ? "보기에서 고르세요." : "구하세요."}`,
    visual: { kind: "two-digit-parity-gap", lower, upper, gap, digitSum, choices, onesGreater: true },
    answer: String(answer),
    solution: `${lower}보다 크고 ${upper}보다 작은 짝수를 적어 봅니다. 일의 자리 숫자가 십의 자리 숫자보다 ${gap} 큰 수를 찾습니다.${sumSentence} 십의 자리 숫자는 ${tens}, 일의 자리 숫자는 ${ones}이므로 답은 ${answer}입니다.`,
    meta: { difficulty, tens, ones, answer, gap, lower, upper, digitSum, gapCandidates, solutions, choices }
  };
}

function twoDigitOddGap({ difficulty = 2 }) {
  const allForGap = (gap) => Array.from({ length: 90 }, (_, index) => index + 10)
    .filter((value) => value % 2 === 1 && value % 10 - Math.floor(value / 10) === gap);
  const gap = difficulty === 3 ? sample([2, 3, 4, 5, 6]) : sample([3, 4, 5, 6, 7]);
  const allCandidates = allForGap(gap);
  const takeCount = difficulty === 3 ? Math.min(randomInt(2, 3), allCandidates.length) : 1;
  const selected = allCandidates.slice(0, takeCount);
  const nextCandidate = allCandidates[takeCount] || 100;
  const upper = randomInt(selected.at(-1) + 1, Math.min(nextCandidate, selected.at(-1) + 10));
  const candidates = allCandidates.filter((value) => value < upper);
  const answer = difficulty === 3 ? candidates.reduce((sum, value) => sum + value, 0) : candidates[0];
  const choices = difficulty === 1
    ? shuffle([answer, ...shuffle(Array.from({ length: upper - 10 }, (_, index) => index + 10)
      .filter((value) => value % 2 === 1 && value !== answer)).slice(0, 2)]).sort((a, b) => a - b)
    : [];
  return {
    prompt: difficulty === 3
      ? "다음 조건을 만족하는 두 자리 수를 모두 찾아 더한 수를 구하세요."
      : "다음 조건을 만족하는 두 자리 수를 구하세요.",
    visual: { kind: "two-digit-odd-gap", upper, gap, choices },
    answer: String(answer),
    solution: `${upper}보다 작은 두 자리 홀수를 차례로 살펴봅니다. 십의 자리 숫자가 일의 자리 숫자보다 ${gap} 작은 수는 ${candidates.join(", ")}입니다.${difficulty === 3 ? ` 이 수들을 더하면 ${candidates.join(" + ")} = ${answer}입니다.` : ` 따라서 답은 ${answer}입니다.`}`,
    meta: { difficulty, upper, gap, candidates, choices, answer }
  };
}

function twoDigitOddBoundedGap({ difficulty = 2 }) {
  const candidatesFor = (gap, lower, upper) => Array.from({ length: 90 }, (_, index) => index + 10)
    .filter((value) => value > lower
      && value < upper
      && value % 2 === 1
      && value % 10 - Math.floor(value / 10) === gap);
  let result;
  for (let attempt = 0; attempt < 500 && !result; attempt += 1) {
    const gap = difficulty === 3 ? sample([2, 3, 4]) : sample([2, 3, 4, 5, 6, 7]);
    const allCandidates = candidatesFor(gap, 9, 100);
    const answerIndex = difficulty === 3
      ? randomInt(1, allCandidates.length - 2)
      : randomInt(0, allCandidates.length - 1);
    const answer = allCandidates[answerIndex];
    const previous = allCandidates[answerIndex - 1] || 9;
    const next = allCandidates[answerIndex + 1] || 100;
    const lower = difficulty === 3
      ? Math.max(9, allCandidates[answerIndex - 1] - randomInt(1, 5))
      : randomInt(Math.max(9, previous), answer - 1);
    const upper = difficulty === 3
      ? Math.min(100, allCandidates[answerIndex + 1] + randomInt(1, 5))
      : randomInt(answer + 1, Math.min(100, next));
    const gapCandidates = candidatesFor(gap, lower, upper);
    const digitSum = difficulty === 3 ? Math.floor(answer / 10) + answer % 10 : null;
    const solutions = gapCandidates.filter((value) => digitSum === null
      || Math.floor(value / 10) + value % 10 === digitSum);
    if (solutions.length !== 1 || solutions[0] !== answer) continue;
    if (difficulty === 3 && gapCandidates.length < 3) continue;
    const distractors = shuffle(Array.from({ length: upper - lower - 1 }, (_, index) => lower + index + 1)
      .filter((value) => value >= 10 && value <= 99 && value % 2 === 1 && value !== answer)).slice(0, 2);
    if (difficulty === 1 && distractors.length < 2) continue;
    result = {
      gap,
      lower,
      upper,
      answer,
      digitSum,
      gapCandidates,
      solutions,
      choices: difficulty === 1 ? shuffle([answer, ...distractors]) : []
    };
  }
  if (!result) return twoDigitOddBoundedGap({ difficulty });
  const { gap, lower, upper, answer, digitSum, gapCandidates, solutions, choices } = result;
  const tens = Math.floor(answer / 10);
  const ones = answer % 10;
  const sumSentence = digitSum === null ? "" : ` 또 십의 자리 숫자와 일의 자리 숫자의 합은 ${digitSum}입니다.`;
  return {
    prompt: `일의 자리 숫자가 1, 3, 5, 7, 9인 수를 홀수라고 합니다. 다음 주어진 조건을 만족하는 두 자리 수를 ${difficulty === 1 ? "보기에서 고르세요." : "구하세요."}`,
    visual: { kind: "two-digit-odd-bounded-gap", lower, upper, gap, digitSum, choices },
    answer: String(answer),
    solution: `${lower}보다 크고 ${upper}보다 작은 홀수를 차례로 살펴봅니다. 일의 자리 숫자가 십의 자리 숫자보다 ${gap} 큰 수를 찾습니다.${sumSentence} 십의 자리 숫자는 ${tens}, 일의 자리 숫자는 ${ones}이므로 답은 ${answer}입니다.`,
    meta: { difficulty, gap, lower, upper, answer, digitSum, gapCandidates, solutions, choices }
  };
}

function triangleTileGrowth({ difficulty = 2 }) {
  const target = difficulty === 1 ? randomInt(4, 8) : difficulty === 2 ? randomInt(6, 10) : randomInt(7, 11);
  const theme = sample(["navy", "coral", "gold", "teal"]);
  const pieceCount = target * target;
  const askIndex = difficulty === 3;
  return {
    prompt: askIndex
      ? `작은 정삼각형 색종이를 이어 붙여 그림과 같은 규칙으로 모양을 만듭니다. 작은 정삼각형 색종이가 ${pieceCount}장 필요한 것은 몇 번째 모양인가요?`
      : `작은 정삼각형 색종이를 이어 붙여 그림과 같은 규칙으로 모양을 만들어 나갑니다. ${target}번째 모양에는 작은 정삼각형 색종이가 몇 장 필요한가요?`,
    visual: { kind: "triangle-tile-growth", stages: [1, 2, 3, 4], showCounts: difficulty === 1, target, pieceCount, askIndex, theme },
    answer: askIndex ? `${target}번째` : `${pieceCount}장`,
    solution: `1번째부터 작은 삼각형 수는 1장, 4장, 9장, 16장으로 늘어납니다. ${target}번째는 ${target}을 ${target}번 더한 ${pieceCount}장이므로, ${askIndex ? `${pieceCount}장이 필요한 것은 ${target}번째` : `${target}번째 모양에는 ${pieceCount}장`}입니다.`,
    meta: { difficulty, target, pieceCount, askIndex, theme, answer: askIndex ? target : pieceCount }
  };
}

function squareTileGrowth({ difficulty = 2 }) {
  const target = difficulty === 1 ? randomInt(4, 8) : difficulty === 2 ? randomInt(6, 10) : randomInt(7, 11);
  const theme = sample(["navy", "coral", "gold", "teal"]);
  const pieceCount = target * target;
  const askIndex = difficulty === 3;
  return {
    prompt: askIndex
      ? `작은 정사각형 색종이를 이어 붙여 그림과 같은 규칙으로 모양을 만듭니다. 작은 정사각형 색종이가 ${pieceCount}장 필요한 것은 몇 번째 모양인가요?`
      : `작은 정사각형 색종이를 이어 붙여 그림과 같은 규칙으로 모양을 만들어 나갑니다. ${target}번째 모양에는 작은 정사각형 색종이가 몇 장 필요한가요?`,
    visual: { kind: "square-tile-growth", stages: [1, 2, 3, 4], showCounts: difficulty === 1, target, pieceCount, askIndex, theme },
    answer: askIndex ? `${target}번째` : `${pieceCount}장`,
    solution: `1번째부터 작은 정사각형 수는 1장, 4장, 9장, 16장으로 늘어납니다. ${target}번째는 한 줄에 ${target}장씩 ${target}줄이므로 모두 ${pieceCount}장입니다.${askIndex ? ` 따라서 ${pieceCount}장이 필요한 것은 ${target}번째입니다.` : ""}`,
    meta: { difficulty, target, pieceCount, askIndex, theme, answer: askIndex ? target : pieceCount }
  };
}

function foldNumberCutSum({ difficulty = 2 }) {
  const size = 4;
  const foldMask = difficulty === 1
    ? [[1, 1], [1, 2]]
    : difficulty === 2
      ? [[0, 2], [1, 0], [1, 1], [1, 2]]
      : [[0, 1], [0, 2], [1, 0], [1, 1], [1, 2]];
  const grid = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8]);
  const cutCellMap = new Map();
  foldMask.forEach(([row, column]) => {
    const reflected = [size - 1 - column, size - 1 - row];
    [[row, column], reflected].forEach(([cutRow, cutColumn]) => {
      cutCellMap.set(`${cutRow}-${cutColumn}`, [cutRow, cutColumn]);
    });
  });
  const cutCells = [...cutCellMap.values()].sort(([rowA, columnA], [rowB, columnB]) => rowA - rowB || columnA - columnB);
  const cutValues = cutCells.map(([row, column]) => grid[row * size + column]);
  const answer = cutValues.reduce((sum, value) => sum + value, 0);
  return {
    prompt: "색종이를 대각선으로 한 번 접은 후 칠해진 부분을 잘라내었습니다. 잘려 나간 부분에 있는 수들의 합을 구하세요.",
    visual: { kind: "fold-number-cut-sum", size, foldMask, grid, cutCells },
    answer: String(answer),
    solution: `대각선 위쪽의 칸은 접으면 맞은편 칸과 겹치고, 대각선에 걸친 칸은 한 번만 셉니다. 잘리는 칸의 수를 식으로 쓰면 ${cutValues.join(" + ")} = ${answer}입니다.`,
    meta: { difficulty, size, foldMask, grid, cutCells, cutValues, answer }
  };
}

function foldNumberCutSumMainDiagonal({ difficulty = 2 }) {
  const size = 4;
  const foldMask = difficulty === 1
    ? [[0, 1], [1, 1]]
    : difficulty === 2
      ? [[0, 1], [1, 1], [1, 2], [1, 3]]
      : [[0, 1], [0, 2], [1, 1], [1, 2], [1, 3]];
  const grid = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8]);
  const cutCellMap = new Map();
  foldMask.forEach(([row, column]) => {
    const reflected = [column, row];
    [[row, column], reflected].forEach(([cutRow, cutColumn]) => {
      cutCellMap.set(`${cutRow}-${cutColumn}`, [cutRow, cutColumn]);
    });
  });
  const cutCells = [...cutCellMap.values()].sort(([rowA, columnA], [rowB, columnB]) => rowA - rowB || columnA - columnB);
  const cutValues = cutCells.map(([row, column]) => grid[row * size + column]);
  const answer = cutValues.reduce((sum, value) => sum + value, 0);
  return {
    prompt: "색종이를 한 번 접은 후 칠해진 부분을 잘라내었습니다. 잘려 나간 부분에 있는 수들의 합을 구하세요.",
    visual: { kind: "fold-number-cut-sum", size, foldMask, grid, cutCells, foldDirection: "main" },
    answer: String(answer),
    solution: `왼쪽 위에서 오른쪽 아래로 그어진 접은 선의 양쪽에서 서로 겹치는 칸을 함께 찾습니다. 잘리는 칸의 수를 식으로 쓰면 ${cutValues.join(" + ")} = ${answer}입니다.`,
    meta: { difficulty, size, foldMask, grid, cutCells, cutValues, foldDirection: "main", answer }
  };
}

function foldNumberCutSumLShape({ difficulty = 2 }) {
  const size = 4;
  const foldMask = difficulty === 1
    ? [[1, 1], [2, 1]]
    : difficulty === 2
      ? [[1, 1], [2, 0], [2, 1]]
      : [[1, 0], [1, 1], [2, 0], [2, 1]];
  const grid = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8]);
  const cutCellMap = new Map();
  foldMask.forEach(([row, column]) => {
    const reflected = [size - 1 - column, size - 1 - row];
    [[row, column], reflected].forEach(([cutRow, cutColumn]) => {
      cutCellMap.set(`${cutRow}-${cutColumn}`, [cutRow, cutColumn]);
    });
  });
  const cutCells = [...cutCellMap.values()].sort(([rowA, columnA], [rowB, columnB]) => rowA - rowB || columnA - columnB);
  const cutValues = cutCells.map(([row, column]) => grid[row * size + column]);
  const answer = cutValues.reduce((sum, value) => sum + value, 0);
  return {
    prompt: "색종이를 대각선으로 한 번 접은 후 칠해진 부분을 잘라내었습니다. 잘려 나간 부분에 있는 수들의 합을 구하세요.",
    visual: { kind: "fold-number-cut-sum", size, foldMask, grid, cutCells },
    answer: String(answer),
    solution: `접은 선의 양쪽에서 서로 겹치는 칸을 함께 찾습니다. 잘리는 칸의 수를 식으로 쓰면 ${cutValues.join(" + ")} = ${answer}입니다.`,
    meta: { difficulty, size, foldMask, grid, cutCells, cutValues, answer }
  };
}

function buildEqualLineSumEightCards({ difficulty, actualTargetSum, actualTargetIndex, actualGivenIndices, sameTargetSums = null }) {
  const targetSum = difficulty === 1 ? sample([12, 13]) : difficulty === 2 ? sample(sameTargetSums || [actualTargetSum]) : sample([12, 13, 14, 15]);
  const pool = EQUAL_LINE_EIGHT_LAYOUTS.filter((item) => item.sum === targetSum);
  let solution = sample(pool);
  let targetIndex;
  let givenIndices;
  let candidates;

  if (difficulty === 1) {
    targetIndex = sample([1, 3, 5, 7]);
    givenIndices = [(targetIndex + 7) % 8, (targetIndex + 1) % 8];
  } else if (difficulty === 2) {
    targetIndex = Array.isArray(actualTargetIndex) ? sample(actualTargetIndex) : actualTargetIndex;
    givenIndices = actualGivenIndices === "other-corners"
      ? [0, 2, 4, 6].filter((index) => index !== targetIndex)
      : actualGivenIndices;
  } else {
    let choices = [];
    for (let attempt = 0; attempt < 100 && choices.length === 0; attempt += 1) {
      solution = sample(pool);
      targetIndex = sample([0, 2, 4, 6]);
      const otherIndexes = Array.from({ length: 8 }, (_, index) => index).filter((index) => index !== targetIndex);
      choices = shuffle(indexCombinations(otherIndexes, 3)).filter((indexes) => {
        const cornerClues = indexes.filter((index) => index % 2 === 0).length;
        if (cornerClues > 2) return false;
        const matching = pool.filter((item) => indexes.every((index) => item.values[index] === solution.values[index]));
        return matching.length > 1 && new Set(matching.map((item) => item.values[targetIndex])).size === 1;
      });
    }
    if (choices.length === 0) return buildEqualLineSumEightCards({ difficulty, actualTargetSum, actualTargetIndex, actualGivenIndices });
    givenIndices = choices[0];
  }

  candidates = pool.filter((item) => givenIndices.every((index) => item.values[index] === solution.values[index]));
  const targetValues = [...new Set(candidates.map((item) => item.values[targetIndex]))];
  if (targetValues.length !== 1) return buildEqualLineSumEightCards({ difficulty, actualTargetSum, actualTargetIndex, actualGivenIndices });
  const answer = solution.values[targetIndex];
  const completed = solution.values.join(" → ");
  const solutionText = difficulty === 1
    ? `㉠이 있는 변의 합이 ${targetSum}이므로 양옆의 두 수를 ${targetSum}에서 빼면 ㉠은 ${answer}입니다.`
    : difficulty === 2
      ? `1부터 8까지의 합은 36입니다. 네 변의 합은 ${targetSum * 4}이고 모서리 수는 두 번씩 더해지므로 네 모서리의 합은 ${targetSum * 4} - 36 = ${targetSum * 4 - 36}입니다. 보이는 세 모서리를 빼면 ㉠은 ${answer}입니다.`
      : `각 변의 합이 ${targetSum}이 되도록 남은 수를 한 번씩 넣어 확인합니다. 왼쪽 위부터 시계 방향으로 ${completed}이므로 ㉠은 ${answer}입니다.`;
  return {
    prompt: `1부터 8까지의 수를 한 번씩 사용하여 가로와 세로 각 줄에 있는 세 수의 합이 모두 ${numberSubject(targetSum)} 되도록 하려고 합니다. ㉠에 알맞은 수를 구하세요.`,
    visual: { kind: "equal-line-eight-cards", cards: [1, 2, 3, 4, 5, 6, 7, 8], layout: solution.values, targetSum, targetIndex, givenIndices },
    answer: String(answer),
    solution: solutionText,
    meta: { difficulty, layout: solution.values, targetSum, targetIndex, givenIndices, candidateCount: candidates.length, targetValues, answer }
  };
}

function equalLineSumEightCards({ difficulty = 2 }) {
  return buildEqualLineSumEightCards({ difficulty, actualTargetSum: 15, actualTargetIndex: 2, actualGivenIndices: [0, 4, 6] });
}

function equalLineSumEightCardsFifteenTopLeft({ difficulty = 2 }) {
  return buildEqualLineSumEightCards({ difficulty, actualTargetSum: 15, actualTargetIndex: 0, actualGivenIndices: [2, 4, 6], sameTargetSums: [12, 13, 14, 15] });
}

function equalLineSumEightCardsTwelve({ difficulty = 2 }) {
  return buildEqualLineSumEightCards({ difficulty, actualTargetSum: 12, actualTargetIndex: [0, 2, 4, 6], actualGivenIndices: "other-corners" });
}


// ── 색종이 접기 ─────────────────────────────────────────────
// 접기를 "반평면으로 자르기"로 다룬다. 가로·세로뿐 아니라 대각선도 같은 방식으로 처리된다.
// 접는 선은 자르고 남은 조각의 가장자리가 되므로, 구멍을 가장자리에서 떨어뜨려 두면
// 펼쳤을 때 항상 2배가 된다. 가장자리에 걸치면 겹쳐서 개수가 줄어든다.
const FOLD_LINES = {
  v: { keep: (p) => 0.5 - p.x, mirror: (p) => ({ x: 1 - p.x, y: p.y }), label: "세로" },
  h: { keep: (p) => 0.5 - p.y, mirror: (p) => ({ x: p.x, y: 1 - p.y }), label: "가로" },
  d1: { keep: (p) => p.x - p.y, mirror: (p) => ({ x: p.y, y: p.x }), label: "대각선" },
  d2: { keep: (p) => 1 - p.x - p.y, mirror: (p) => ({ x: 1 - p.y, y: 1 - p.x }), label: "대각선" }
};

function polygonArea(polygon) {
  let sum = 0;
  for (let i = 0; i < polygon.length; i += 1) {
    const a = polygon[i];
    const b = polygon[(i + 1) % polygon.length];
    sum += a.x * b.y - b.x * a.y;
  }
  return Math.abs(sum) / 2;
}

function clipHalfPlane(polygon, keep) {
  const out = [];
  for (let i = 0; i < polygon.length; i += 1) {
    const current = polygon[i];
    const next = polygon[(i + 1) % polygon.length];
    const dCurrent = keep(current);
    const dNext = keep(next);
    if (dCurrent >= -1e-9) out.push(current);
    if ((dCurrent > 1e-9 && dNext < -1e-9) || (dCurrent < -1e-9 && dNext > 1e-9)) {
      const t = dCurrent / (dCurrent - dNext);
      out.push({ x: current.x + (next.x - current.x) * t, y: current.y + (next.y - current.y) * t });
    }
  }
  return out;
}

function polygonEdgeDistance(polygon, point) {
  let best = Infinity;
  for (let i = 0; i < polygon.length; i += 1) {
    const a = polygon[i];
    const b = polygon[(i + 1) % polygon.length];
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const len2 = dx * dx + dy * dy;
    const t = len2 === 0 ? 0 : Math.max(0, Math.min(1, ((point.x - a.x) * dx + (point.y - a.y) * dy) / len2));
    best = Math.min(best, Math.hypot(point.x - (a.x + dx * t), point.y - (a.y + dy * t)));
  }
  return best;
}

function pointInPolygon(polygon, point) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i, i += 1) {
    const a = polygon[i];
    const b = polygon[j];
    if ((a.y > point.y) !== (b.y > point.y)
      && point.x < ((b.x - a.x) * (point.y - a.y)) / (b.y - a.y) + a.x) inside = !inside;
  }
  return inside;
}

function buildFoldStages(directions) {
  let polygon = [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 1 }];
  const stages = [];
  for (const direction of directions) {
    stages.push({ polygon, fold: direction });
    polygon = clipHalfPlane(polygon, FOLD_LINES[direction].keep);
  }
  stages.push({ polygon, fold: null });
  return stages;
}

function placeHoles(polygon, count, margin) {
  const holes = [];
  let attempts = 0;
  while (holes.length < count && attempts < 600) {
    attempts += 1;
    const point = { x: Math.random(), y: Math.random() };
    if (!pointInPolygon(polygon, point)) continue;
    if (polygonEdgeDistance(polygon, point) < margin) continue;
    if (holes.some((item) => Math.hypot(item.x - point.x, item.y - point.y) < margin * 2.4)) continue;
    holes.push(point);
  }
  return holes;
}

function foldQuestion({ directions, holeCount, margin = 0.07 }) {
  const stages = buildFoldStages(directions);

  // 접는 선이 이미 조각의 가장자리이면 실제로는 접히지 않는다. 그런 단계는 문제가 안 된다.
  for (let i = 0; i < directions.length; i += 1) {
    if (polygonArea(stages[i + 1].polygon) >= polygonArea(stages[i].polygon) - 1e-9) return null;
  }

  const holes = placeHoles(stages[stages.length - 1].polygon, holeCount, margin);
  if (holes.length < holeCount) return null;

  // 답을 2의 거듭제곱으로 가정하지 않고, 실제로 되접어 펼치며 서로 다른 구멍을 센다.
  let points = holes.map((hole) => ({ ...hole }));
  for (let i = directions.length - 1; i >= 0; i -= 1) {
    const { mirror } = FOLD_LINES[directions[i]];
    const next = [...points];
    for (const point of points) {
      const reflected = mirror(point);
      if (!next.some((item) => Math.hypot(item.x - reflected.x, item.y - reflected.y) < 1e-6)) next.push(reflected);
    }
    if (next.some((item) => !pointInPolygon(stages[i].polygon, item))) return null;
    points = next;
  }
  const answer = points.length;
  if (answer !== holeCount * 2 ** directions.length) return null;
  const diagonal = directions.some((d) => d === "d1" || d === "d2");
  const times = ["", "한 번", "두 번", "세 번"][directions.length];
  return {
    prompt: `색종이를 그림처럼 ${diagonal ? "대각선을 따라 " : "반으로 "}${times} 접은 다음 구멍을 ${holeCount}개 뚫었습니다. 색종이를 펼쳤을 때 구멍은 모두 몇 개입니까?`,
    visual: { kind: "paper-fold", stages, holes },
    answer: `${answer}개`,
    solution: `한 번 접을 때마다 겹이 두 배가 됩니다. ${times} 접었으므로 구멍 하나가 펼쳤을 때 ${2 ** directions.length}개가 되고, 구멍 ${holeCount}개를 각각 펼치면 모두 ${answer}개입니다.`,
    meta: { directions, holeCount, answer, holes, stages }
  };
}

function paperFoldHoleCount({ difficulty = 2 }) {
  const folds = difficulty === 1 ? 1 : 2;
  const first = sample(["v", "h"]);
  const directions = folds === 1 ? [first] : [first, first === "v" ? "h" : "v"];
  const holeCount = randomInt(1, folds === 1 ? 3 : 2);
  return foldQuestion({ directions, holeCount }) || paperFoldHoleCount({ difficulty });
}

// ── 색종이 접기: 수가 쓰인 색종이 (더클래식 1과정 1권 41·50쪽) ──────────
// 4x4 숫자판을 가로·세로로 한 번씩 접는다. 접힌 2x2 묶음이 놓이는 사분면은
// 접는 방향(위/아래·왼/오른)에 따라 달라지고, 색칠 칸이 가리키는 원본 칸도
// 그에 따라 달라진다. 잘리는 칸은 색칠 칸의 거울 궤도 {r,3-r}x{c,3-c} 네 개.
// ── 세로셈 복면산: 세 도형의 값 합 (파이널 2회 14번 계열) ──────────────
// 검증표에는 값 셋(세모 9·네모 0·별 1)과 답 10만 있고 식의 배치는 없다.
// 그 값으로 성립하는 두 자리 세로셈만 16가지라 원본 배치는 정해지지 않는다.
// 그래서 배치를 지어내지 않고 같은 구조 계열을 만들되, 해가 하나뿐일 때만 낸다.
const CRYPTO_SHAPES = ["△", "□", "☆"];

function cryptarithmSolutionCount(first, second, sum) {
  // 서로 다른 숫자를 넣어 실제로 식이 성립하는 경우를 전수로 센다.
  const value = (pattern, assign) => pattern.reduce((total, index) => total * 10 + assign[index], 0);
  let count = 0;
  let only = null;
  for (let a = 0; a <= 9; a += 1) for (let b = 0; b <= 9; b += 1) for (let c = 0; c <= 9; c += 1) {
    if (a === b || b === c || a === c) continue;
    const assign = [a, b, c];
    if (assign[first[0]] === 0 || assign[second[0]] === 0 || assign[sum[0]] === 0) continue;
    if (value(first, assign) + value(second, assign) !== value(sum, assign)) continue;
    count += 1;
    only = assign;
    if (count > 1) return { count, only: null };
  }
  return { count, only };
}

function verticalCryptarithmShapeSum({ difficulty = 2 }) {
  const firstLength = difficulty === 3 ? 3 : 2;
  const secondLength = firstLength;

  // 허용 숫자가 셋뿐이라 무작위로 식을 찍으면 대부분 성립하지 않는다.
  // 자리 조합을 전수로 훑어 성립하는 것만 모은 뒤 그중에서 고른다.
  const patterns = (length) => {
    let list = [[]];
    for (let i = 0; i < length; i += 1) list = list.flatMap((p) => [0, 1, 2].map((d) => [...p, d]));
    return list;
  };
  const firstPatterns = patterns(firstLength);
  const secondPatterns = patterns(secondLength);

  for (let round = 0; round < 300; round += 1) {
    const digits = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3);
    const value = (pattern) => pattern.reduce((total, index) => total * 10 + digits[index], 0);
    const candidates = [];
    for (const first of firstPatterns) {
      if (digits[first[0]] === 0) continue;
      for (const second of secondPatterns) {
        if (digits[second[0]] === 0) continue;
        const total = value(first) + value(second);
        const sumDigits = String(total).split("").map(Number);
        if (!sumDigits.every((d) => digits.includes(d))) continue;
        const sum = sumDigits.map((d) => digits.indexOf(d));
        // 자리 올림으로 한 자리 늘어나는 형태(원본 계열)만 쓴다. 식을 더 짧게 하면
        // 기호 셋을 정할 단서가 모자라 해가 여러 개가 된다 — 조건을 만족하는 식 1,398개를
        // 전수로 훑어 유일해가 하나도 없음을 확인했다. 그래서 쉬움은 식을 줄이는 대신 힌트를 준다.
        if (difficulty !== 3 && sum.length !== firstLength + 1) continue;
        if (new Set([...first, ...second, ...sum]).size !== 3) continue;   // 세 도형이 모두 나와야 한다
        candidates.push({ first, second, sum });
      }
    }
    const unique = [];
    for (const candidate of shuffle(candidates)) {
      if (cryptarithmSolutionCount(candidate.first, candidate.second, candidate.sum).count === 1) {
        unique.push(candidate);
        break;                                    // 하나만 찾으면 충분하다
      }
    }
    if (!unique.length) continue;

    const { first, second, sum } = unique[0];
    const answer = digits[0] + digits[1] + digits[2];
    const naming = CRYPTO_SHAPES.map((shape, index) => `${shape}는 ${digits[index]}`).join(", ");
    // 쉬움은 한 도형의 값을 알려 준다. 이미 유일해인 식이므로 힌트가 답을 흐리지 않는다.
    const hintIndex = difficulty === 1 ? randomInt(0, 2) : -1;
    const hint = hintIndex >= 0 ? ` (단, ${CRYPTO_SHAPES[hintIndex]}는 ${digits[hintIndex]}입니다.)` : "";
    return {
      prompt: `다음 세로셈에서 같은 도형은 같은 숫자를, 다른 도형은 다른 숫자를 나타냅니다. 세 도형이 나타내는 수의 합을 구하시오.${hint}`,
      visual: {
        kind: "cryptarithm-vertical",
        first: first.map((index) => CRYPTO_SHAPES[index]),
        second: second.map((index) => CRYPTO_SHAPES[index]),
        sum: sum.map((index) => CRYPTO_SHAPES[index])
      },
      answer: String(answer),
      solution: `자리마다 올림을 따져 보면 ${naming}입니다. 세 도형이 나타내는 수를 더하면 ${digits[0]} + ${digits[1]} + ${digits[2]} = ${answer}입니다.`,
      meta: { digits, first, second, sum, answer, hintIndex }
    };
  }
  return null;
}

function foldNumberSumCore(askCut) {
  const N = 4;
  const grid = Array.from({ length: N }, () => Array.from({ length: N }, () => randomInt(1, 4)));
  const hDir = sample(["up", "down"]);
  const vDir = sample(["left", "right"]);
  const packetRow = hDir === "up" ? 0 : 2;
  const packetCol = vDir === "left" ? 0 : 2;

  const cutCount = randomInt(1, 2);
  const cells = [];
  while (cells.length < cutCount) {
    const candidate = { r: randomInt(0, 1), c: randomInt(0, 1) };
    if (!cells.some((item) => item.r === candidate.r && item.c === candidate.c)) cells.push(candidate);
  }

  const removed = new Set();
  for (const cell of cells) {
    const gr = packetRow + cell.r;
    const gc = packetCol + cell.c;
    for (const r of [gr, N - 1 - gr]) for (const c of [gc, N - 1 - gc]) removed.add(r * N + c);
  }

  let total = 0;
  let cut = 0;
  for (let r = 0; r < N; r += 1) for (let c = 0; c < N; c += 1) {
    total += grid[r][c];
    if (removed.has(r * N + c)) cut += grid[r][c];
  }
  const remain = total - cut;
  if (remain <= 0 || cut <= 0) return foldNumberSumCore(askCut);

  return {
    prompt: `다음과 같이 수가 쓰인 색종이를 접어서 색칠된 부분을 자른 후 펼쳤을 때, ${askCut ? "잘려나간" : "남아 있는"} 수들의 합을 구하시오.`,
    visual: { kind: "fold-number-grid", grid, hDir, vDir, cells, removed },
    answer: String(askCut ? cut : remain),
    solution: `색칠한 칸은 접힌 자리에서 거울처럼 겹친 네 칸을 함께 자릅니다. 잘린 칸의 합은 ${cut}이고 전체 합은 ${total}이므로, ${askCut ? `잘려나간 수의 합은 ${cut}` : `남은 수의 합은 ${total} - ${cut} = ${remain}`}입니다.`,
    meta: { grid, hDir, vDir, packetRow, packetCol, cells, removed, total, cut, remain }
  };
}

function foldNumberRemainingSum({ difficulty = 2 }) {
  return foldNumberSumCore(false);
}

// codex 갈래의 foldNumberCutSum(실전 선발시험 검증본)과 이름만 같고 구조가 다르다.
// 이쪽은 교재 1권 41·50쪽의 '뒤로 접은 2x2' 문법이라 별도 이름으로 둔다.
function foldNumberCutSumTextbook({ difficulty = 2 }) {
  return foldNumberSumCore(true);
}

// ── 색종이 접기: 대각선 한 번 접기 숫자판 ─────────────────────────────
// 대각선에서 떨어진 온전한 칸은 거울짝 {(r,c),(c,r)} 둘이 잘리고,
// 대각선에 걸친 반칸은 두 겹이 곧 그 칸의 양쪽 반이라 그 칸 하나만 잘린다.
function foldDiagonalNumberSum({ difficulty = 2 }) {
  const N = 4;
  const grid = Array.from({ length: N }, () => Array.from({ length: N }, () => randomInt(1, 9)));
  const keepLower = Math.random() < 0.5;
  const inKeep = (r, c) => (keepLower ? r > c : c > r);

  const units = [];
  for (let r = 0; r < N; r += 1) for (let c = 0; c < N; c += 1) {
    if (inKeep(r, c)) units.push({ r, c, half: false });
    if (r === c) units.push({ r, c, half: true });
  }
  const key = (u) => `${u.r},${u.c}`;
  const adjacent = (a, b) => Math.abs(a.r - b.r) + Math.abs(a.c - b.c) === 1;
  const want = randomInt(3, 5);
  const region = [sample(units)];
  let guard = 0;
  while (region.length < want && guard < 200) {
    guard += 1;
    const candidates = units.filter((u) => !region.some((v) => key(v) === key(u)) && region.some((v) => adjacent(u, v)));
    if (!candidates.length) break;
    region.push(sample(candidates));
  }
  if (!region.some((u) => !u.half)) return foldDiagonalNumberSum({ difficulty });

  const removed = new Set();
  for (const u of region) {
    removed.add(u.r * N + u.c);
    if (!u.half) removed.add(u.c * N + u.r);
  }
  let total = 0;
  let cut = 0;
  for (let r = 0; r < N; r += 1) for (let c = 0; c < N; c += 1) {
    total += grid[r][c];
    if (removed.has(r * N + c)) cut += grid[r][c];
  }
  const remain = total - cut;
  if (remain <= 0 || cut <= 0) return foldDiagonalNumberSum({ difficulty });

  const askCut = difficulty !== 1;
  return {
    prompt: `색종이를 한 번 접은 후 칠해진 부분을 잘라내었습니다. ${askCut ? "잘려나간 부분에 있는" : "남아 있는"} 수들의 합을 구하시오.`,
    visual: { kind: "fold-diagonal-grid", grid, keepLower, region },
    answer: String(askCut ? cut : remain),
    solution: `대각선에서 떨어진 칸은 접으면 마주 보는 칸과 겹쳐 함께 잘리고, 대각선에 걸친 칸은 그 칸 하나만 잘립니다. 잘린 칸의 합은 ${cut}, 전체 합은 ${total}이므로 ${askCut ? `잘려나간 수의 합은 ${cut}` : `남은 수의 합은 ${remain}`}입니다.`,
    meta: { grid, keepLower, region, removed, total, cut, remain }
  };
}

// ── 색종이 접기: 목표 합이 되게 색칠하기 (역방향) ──────────────────────
// 수가 보이도록 뒤로 두 번 접은 2x2에서, 잘라낼 칸들의 궤도 합이 목표가
// 되도록 학생이 칸을 고른다. 15가지 부분집합 중 답이 유일할 때만 낸다.
function foldTargetSumColoring({ difficulty = 2 }) {
  const N = 4;
  const grid = Array.from({ length: N }, () => Array.from({ length: N }, () => randomInt(1, 3)));
  const packetRow = sample([0, 2]);
  const packetCol = sample([0, 2]);
  const firstFold = sample(["h", "v"]);

  const cellOrbitSum = [[0, 0], [0, 0]];
  for (let r = 0; r < 2; r += 1) for (let c = 0; c < 2; c += 1) {
    const gr = packetRow + r;
    const gc = packetCol + c;
    cellOrbitSum[r][c] = grid[gr][gc] + grid[gr][3 - gc] + grid[3 - gr][gc] + grid[3 - gr][3 - gc];
  }
  const cells = [{ r: 0, c: 0 }, { r: 0, c: 1 }, { r: 1, c: 0 }, { r: 1, c: 1 }];
  const answerSet = shuffle(cells).slice(0, randomInt(1, 2));
  const target = answerSet.reduce((total, cell) => total + cellOrbitSum[cell.r][cell.c], 0);

  let matches = 0;
  for (let mask = 1; mask < 16; mask += 1) {
    let sum = 0;
    cells.forEach((cell, index) => { if (mask & (1 << index)) sum += cellOrbitSum[cell.r][cell.c]; });
    if (sum === target) matches += 1;
  }
  if (matches !== 1) return foldTargetSumColoring({ difficulty });

  const positionName = (cell) => `${cell.r === 0 ? "위" : "아래"}쪽 ${cell.c === 0 ? "왼" : "오른"}쪽`;
  const particle = [1, 3, 6, 7, 8, 0].includes(target % 10) ? "이" : "가";
  return {
    prompt: `다음과 같이 수가 쓰여 있는 색종이를 두 번 접은 후 접은 선을 따라 잘라냈습니다. 잘라낸 부분에 쓰인 수의 합이 ${target}${particle} 되려면 어떤 부분을 잘라야 하는지 두 번 접은 모양에 색칠하시오. (단, 수가 보이도록 뒤로 접습니다.)`,
    visual: { kind: "fold-number-inverse", grid, packetRow, packetCol, firstFold },
    answer: `접은 모양의 ${answerSet.map(positionName).join("과 ")} 칸`,
    solution: `접은 2x2의 각 칸은 거울로 겹친 네 칸의 합(${cellOrbitSum.flat().join("·")})을 나타냅니다. 이 중 합이 ${target}이 되는 조합은 ${answerSet.map(positionName).join(", ")} 칸뿐입니다.`,
    meta: { grid, packetRow, packetCol, firstFold, cellOrbitSum, answerSet, target }
  };
}

// ── 색종이 접기: 접고 선 따라 자르기 조각 개수 (더클래식 1권 39·43·48쪽) ──
// 자르는 선은 접은 선이 아니라 접힌 조각 위에 그은 선(대각선 X·모서리 클립).
// 조각 수는 공식이 없다 — 잘린 선을 거울 반사로 펼친 뒤 격자 flood fill로
// 실제 분할을 센다. 서로 다른 두 해상도가 일치할 때만 낸다.
function unfoldSegments(segments, directions) {
  let current = segments.map((segment) => [{ ...segment[0] }, { ...segment[1] }]);
  for (let i = directions.length - 1; i >= 0; i -= 1) {
    const { mirror } = FOLD_LINES[directions[i]];
    current = current.concat(current.map((segment) => [mirror(segment[0]), mirror(segment[1])]));
  }
  return current;
}

function countPieceRegions(segments, resolution) {
  const blocked = new Uint8Array(resolution * resolution);
  for (const [a, b] of segments) {
    const steps = Math.max(2, Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) * resolution * 8));
    for (let k = 0; k <= steps; k += 1) {
      const t = k / steps;
      const ci = Math.min(resolution - 1, Math.max(0, Math.floor((a.x + (b.x - a.x) * t) * resolution)));
      const cj = Math.min(resolution - 1, Math.max(0, Math.floor((a.y + (b.y - a.y) * t) * resolution)));
      blocked[cj * resolution + ci] = 1;
    }
  }
  let count = 0;
  const seen = new Uint8Array(resolution * resolution);
  const stack = [];
  for (let start = 0; start < resolution * resolution; start += 1) {
    if (blocked[start] || seen[start]) continue;
    count += 1;
    seen[start] = 1;
    stack.push(start);
    while (stack.length) {
      const v = stack.pop();
      const vi = v % resolution;
      if (vi > 0 && !blocked[v - 1] && !seen[v - 1]) { seen[v - 1] = 1; stack.push(v - 1); }
      if (vi < resolution - 1 && !blocked[v + 1] && !seen[v + 1]) { seen[v + 1] = 1; stack.push(v + 1); }
      if (v - resolution >= 0 && !blocked[v - resolution] && !seen[v - resolution]) { seen[v - resolution] = 1; stack.push(v - resolution); }
      if (v + resolution < resolution * resolution && !blocked[v + resolution] && !seen[v + resolution]) { seen[v + resolution] = 1; stack.push(v + resolution); }
    }
  }
  return count;
}

function foldCutPieceCount({ difficulty = 2 }) {
  const directions = sample([["h"], ["v"], ["h", "v"], ["v", "h"]]);
  const stages = buildFoldStages(directions);
  const finalPolygon = stages[stages.length - 1].polygon;
  const w = Math.max(...finalPolygon.map((p) => p.x));
  const h = Math.max(...finalPolygon.map((p) => p.y));
  const diagA = [{ x: 0, y: 0 }, { x: w, y: h }];
  const diagB = [{ x: 0, y: h }, { x: w, y: 0 }];
  const clips = [
    [{ x: w / 2, y: 0 }, { x: 0, y: h / 2 }], [{ x: w / 2, y: 0 }, { x: w, y: h / 2 }],
    [{ x: 0, y: h / 2 }, { x: w / 2, y: h }], [{ x: w, y: h / 2 }, { x: w / 2, y: h }]
  ];
  const cutChoice = sample(["X", "A", "B", "clip1", "clip2"]);
  const cuts = cutChoice === "X" ? [diagA, diagB]
    : cutChoice === "A" ? [diagA]
      : cutChoice === "B" ? [diagB]
        : cutChoice === "clip1" ? [sample(clips)]
          : (() => {
            const a = randomInt(0, 3);
            let b = randomInt(0, 3);
            while (b === a) b = randomInt(0, 3);
            return [clips[a], clips[b]];
          })();

  const unfolded = unfoldSegments(cuts, directions);
  const n1 = countPieceRegions(unfolded, 401);
  const n2 = countPieceRegions(unfolded, 643);
  if (n1 !== n2 || n1 < 2 || n1 > 24) return foldCutPieceCount({ difficulty });

  const times = ["", "한 번", "두 번"][directions.length];
  return {
    prompt: `정사각형 모양의 색종이를 다음과 같이 ${times} 접어서 선을 따라 잘랐을 때, 모두 몇 조각이 되는지 구하시오.`,
    visual: { kind: "fold-cut-pieces", directions, stages, cuts },
    answer: `${n1}조각`,
    solution: `접힌 조각 위에 그은 선을 거울로 펼쳐 보면, 종이가 ${n1}개의 조각으로 나뉩니다.`,
    meta: { directions, stages, cuts, unfolded, answer: n1 }
  };
}

// ── 색종이 접기: 반원·원 펀치 (더클래식 1권 51쪽 계열) ────────────────
// 접힌 조각의 안쪽에는 원, 가장자리에는 반원(평평한 면이 가장자리에 붙게)을 뚫는다.
// 접은 선 위의 반원은 펼치면 거울짝과 붙어 온전한 원이 되고, 원래 가장자리의
// 반원은 반원인 채로 거울 수만큼 늘어난다. 병합 개수는 래스터 재검산으로 확인한다.
function punchRaster(pieces, resolution) {
  const hole = new Uint8Array(resolution * resolution);
  for (let j = 0; j < resolution; j += 1) for (let i = 0; i < resolution; i += 1) {
    const x = (i + 0.5) / resolution;
    const y = (j + 0.5) / resolution;
    for (const q of pieces) {
      if (Math.hypot(x - q.cx, y - q.cy) >= q.r) continue;
      if (q.type === "half" && (x - q.cx) * q.nx + (y - q.cy) * q.ny > 0) continue;
      hole[j * resolution + i] = 1;
      break;
    }
  }
  const seen = new Uint8Array(resolution * resolution);
  let circles = 0;
  let semis = 0;
  for (let start = 0; start < resolution * resolution; start += 1) {
    if (!hole[start] || seen[start]) continue;
    let touches = false;
    const stack = [start];
    seen[start] = 1;
    while (stack.length) {
      const v = stack.pop();
      const vi = v % resolution;
      const vj = Math.floor(v / resolution);
      if (vi === 0 || vj === 0 || vi === resolution - 1 || vj === resolution - 1) touches = true;
      for (const w of [v - 1, v + 1, v - resolution, v + resolution]) {
        if (w < 0 || w >= resolution * resolution) continue;
        if (Math.abs((w % resolution) - vi) > 1) continue;
        if (hole[w] && !seen[w]) { seen[w] = 1; stack.push(w); }
      }
    }
    if (touches) semis += 1; else circles += 1;
  }
  return { circles, semis };
}

function foldPunchShapeCount({ difficulty = 2 }) {
  const directions = sample([["h"], ["v"], ["h", "v"], ["v", "h"]]);
  const stages = buildFoldStages(directions);
  const finalPolygon = stages[stages.length - 1].polygon;
  const w = Math.max(...finalPolygon.map((p) => p.x));
  const h = Math.max(...finalPolygon.map((p) => p.y));
  const hasV = directions.includes("v");
  const hasH = directions.includes("h");
  const edges = [
    { name: "left", crease: false }, { name: "top", crease: false },
    { name: "right", crease: hasV }, { name: "bottom", crease: hasH }
  ];
  const punches = [];
  const radius = () => 0.05 + Math.random() * 0.02;
  const clash = (cx, cy, r) => punches.some((q) => Math.hypot(q.cx - cx, q.cy - cy) < q.r + r + 0.05);

  let guard = 0;
  while (punches.filter((q) => q.type === "full").length < 1 && guard++ < 300) {
    const r = radius();
    const cx = r + 0.05 + Math.random() * (w - 2 * (r + 0.05));
    const cy = r + 0.05 + Math.random() * (h - 2 * (r + 0.05));
    if (!clash(cx, cy, r)) punches.push({ type: "full", cx, cy, r });
  }
  const wantHalf = randomInt(1, 2);
  while (punches.filter((q) => q.type === "half").length < wantHalf && guard++ < 600) {
    const edge = sample(edges);
    const r = radius();
    const t = 0.18 + Math.random() * 0.64;
    let cx;
    let cy;
    let nx = 0;
    let ny = 0;
    if (edge.name === "left") { cx = 0; cy = t * h; nx = -1; }
    else if (edge.name === "right") { cx = w; cy = t * h; nx = 1; }
    else if (edge.name === "top") { cy = 0; cx = t * w; ny = -1; }
    else { cy = h; cx = t * w; ny = 1; }
    if (edge.name === "left" || edge.name === "right") { if (cy < r + 0.06 || cy > h - r - 0.06) continue; }
    else if (cx < r + 0.06 || cx > w - r - 0.06) continue;
    if (clash(cx, cy, r)) continue;
    punches.push({ type: "half", cx, cy, r, nx, ny, edge: edge.name, crease: edge.crease });
  }
  if (punches.filter((q) => q.type === "half").length < 1 || punches.filter((q) => q.type === "full").length < 1) {
    return foldPunchShapeCount({ difficulty });
  }

  let pieces = punches.map((q) => ({ ...q }));
  for (let i = directions.length - 1; i >= 0; i -= 1) {
    const { mirror } = FOLD_LINES[directions[i]];
    const add = pieces.map((q) => {
      const m = mirror({ x: q.cx, y: q.cy });
      const out = { ...q, cx: m.x, cy: m.y };
      if (q.type === "half") {
        if (directions[i] === "v") out.nx = -q.nx;
        if (directions[i] === "h") out.ny = -q.ny;
      }
      return out;
    });
    for (const q of add) {
      if (!pieces.some((p) => Math.hypot(p.cx - q.cx, p.cy - q.cy) < 1e-9 && p.type === q.type
        && (p.type === "full" || (p.nx === q.nx && p.ny === q.ny)))) pieces.push(q);
    }
  }

  const merged = [];
  const used = new Array(pieces.length).fill(false);
  for (let i = 0; i < pieces.length; i += 1) {
    if (used[i]) continue;
    const a = pieces[i];
    if (a.type === "full") { merged.push({ kind: "circle", cx: a.cx, cy: a.cy, r: a.r }); used[i] = true; continue; }
    let mate = -1;
    for (let j = i + 1; j < pieces.length; j += 1) {
      if (used[j]) continue;
      const b = pieces[j];
      if (b.type === "half" && Math.hypot(a.cx - b.cx, a.cy - b.cy) < 1e-9 && Math.abs(a.r - b.r) < 1e-9
        && a.nx === -b.nx && a.ny === -b.ny) { mate = j; break; }
    }
    used[i] = true;
    if (mate >= 0) { used[mate] = true; merged.push({ kind: "circle", cx: a.cx, cy: a.cy, r: a.r }); } else {
      merged.push({ kind: "semi", cx: a.cx, cy: a.cy, r: a.r, nx: a.nx, ny: a.ny });
    }
  }
  for (const m of merged) {
    if (m.kind !== "semi") continue;
    const onEdge = (m.nx === -1 && Math.abs(m.cx) < 1e-9) || (m.nx === 1 && Math.abs(m.cx - 1) < 1e-9)
      || (m.ny === -1 && Math.abs(m.cy) < 1e-9) || (m.ny === 1 && Math.abs(m.cy - 1) < 1e-9);
    if (!onEdge) return foldPunchShapeCount({ difficulty });
  }
  const circles = merged.filter((m) => m.kind === "circle").length;
  const semis = merged.filter((m) => m.kind === "semi").length;

  const check = punchRaster(pieces, 241);
  if (check.circles !== circles || check.semis !== semis) return foldPunchShapeCount({ difficulty });

  const times = ["", "한 번", "두 번"][directions.length];
  return {
    prompt: `다음 그림과 같이 색종이를 ${times} 접은 후 펀치로 반원과 원을 뚫었습니다. 색종이를 펼쳤을 때 반원과 원 모양이 각각 몇 개씩 나오는지 구하시오.`,
    visual: { kind: "fold-punch", directions, stages, punches },
    answer: `반원 ${semis}개, 원 ${circles}개`,
    solution: `접은 선 위에 뚫린 반원은 펼치면 거울짝과 붙어 온전한 원이 되고, 원래 가장자리의 반원은 반원인 채로 늘어납니다. 그 결과 반원 ${semis}개, 원 ${circles}개가 나옵니다.`,
    meta: { directions, stages, punches, pieces, circles, semis }
  };
}

// ── 색종이 접기: 겹친 색종이 순서 (더클래식 1권 35~36·44~46쪽) ────────
// 같은 크기 정사각형 8장을 3x3 자리(가장자리 중앙 한 자리 비움)에 겹친다.
// 답의 유일성 조건은 z순서상 바로 위 종이와 겹치는 연속 사슬이어야 한다 —
// "위 종이 중 아무나와 겹침"이면 그 종이가 먼저 걷혀 중간 종이가 조기에 드러난다.
function foldStackCore(askOrder) {
  const anchors = [];
  for (let r = 0; r < 3; r += 1) for (let c = 0; c < 3; c += 1) anchors.push({ r, c });
  const dropEdge = sample([1, 3, 5, 7]);
  const pos = anchors.filter((_, i) => i !== dropEdge);
  const labels = shuffle(["가", "나", "다", "라", "마", "바", "사", "아"]);
  const over = (a, b) => Math.abs(pos[a].r - pos[b].r) < 2 && Math.abs(pos[a].c - pos[b].c) < 2;

  for (let attempt = 0; attempt < 800; attempt += 1) {
    const z = shuffle(pos.map((_, i) => i));
    let ok = true;
    for (let k = 1; k < 8; k += 1) if (!over(z[k], z[k - 1])) { ok = false; break; }
    if (!ok) continue;

    const spots = [];
    for (let k = 0; k < 8 && ok; k += 1) {
      const piece = pos[z[k]];
      let best = null;
      let bestDist = -1;
      for (let i = 1; i <= 8; i += 1) for (let j = 1; j <= 8; j += 1) {
        const x = piece.c + (i * 2) / 9;
        const y = piece.r + (j * 2) / 9;
        let covered = false;
        let clear = Infinity;
        for (let m = 0; m < k; m += 1) {
          const q = pos[z[m]];
          if (x > q.c && x < q.c + 2 && y > q.r && y < q.r + 2) { covered = true; break; }
          const dx = Math.max(q.c - x, x - (q.c + 2), 0);
          const dy = Math.max(q.r - y, y - (q.r + 2), 0);
          clear = Math.min(clear, Math.hypot(dx, dy));
        }
        if (covered) continue;
        const d = Math.min(clear, x - piece.c, piece.c + 2 - x, y - piece.r, piece.r + 2 - y);
        if (d > bestDist) { bestDist = d; best = { x, y }; }
      }
      if (!best || bestDist < 0.12) { ok = false; break; }
      spots.push(best);
    }
    if (!ok) continue;

    const order = z.map((i) => labels[i]);
    const wantTop = Math.random() < 0.3;
    return {
      prompt: askOrder
        ? "다음은 크기가 모두 같은 정사각형 모양의 색종이 8장을 겹쳐 놓은 것입니다. 가장 위에 있는 색종이부터 순서대로 쓰시오."
        : `다음은 크기가 모두 같은 정사각형 모양의 색종이 8장을 겹쳐 놓은 것입니다. 가장 ${wantTop ? "위" : "밑"}에 놓인 색종이는 어느 것입니까?`,
      visual: { kind: "fold-stack", pos, z, spots, order },
      answer: askOrder ? order.join(" → ") : (wantTop ? order[0] : order[7]),
      solution: askOrder
        ? `겹친 종이를 위에서부터 하나씩 걷어내며 온전히 드러나는 것을 확인하면 ${order.join(" → ")} 순서입니다.`
        : `겹친 종이를 위에서부터 하나씩 걷어내며 확인하면, 가장 ${wantTop ? "위" : "밑"}에 놓인 종이는 ${wantTop ? order[0] : order[7]}입니다.`,
      meta: { pos, z, labels, spots, order, askOrder, wantTop }
    };
  }
  return foldStackCore(askOrder);
}

function foldStackFind({ difficulty = 2 }) {
  return foldStackCore(false);
}

function foldStackOrder({ difficulty = 2 }) {
  return foldStackCore(true);
}

// ── 색종이 접기: 접어 자르고 펼친 모양 4지선다 (더클래식 1권 37~38·47쪽) ──
// 두 번 접은 2x2 조각의 모서리 삼각형을 잘라내고 펼친 모양을 고른다.
// 오답은 실제 오개념으로 만든다: 반사 하나 빠뜨림·거울 대신 평행이동·다른 모서리.
// 정답은 거울 펼치기와 별개로 "점을 접어 넣어 삼각형에 드는지"로 재검산한다.
function mirrorPolygon(polygon, dir) {
  const { mirror } = FOLD_LINES[dir];
  return polygon.map((pt) => mirror(pt));
}
function shiftPolygon(polygon, dx, dy) {
  return polygon.map((pt) => ({ x: pt.x + dx, y: pt.y + dy }));
}
function foldPointIn(point, directions) {
  let q = { ...point };
  for (const d of directions) { if (FOLD_LINES[d].keep(q) < 0) q = FOLD_LINES[d].mirror(q); }
  return q;
}
function shapeRasterMask(polygons, resolution) {
  const mask = new Uint8Array(resolution * resolution);
  for (let j = 0; j < resolution; j += 1) for (let i = 0; i < resolution; i += 1) {
    const pt = { x: (i + 0.5) / resolution, y: (j + 0.5) / resolution };
    for (const polygon of polygons) if (pointInPolygon(polygon, pt)) { mask[j * resolution + i] = 1; break; }
  }
  return mask;
}
function maskDifference(a, b) {
  let n = 0;
  for (let i = 0; i < a.length; i += 1) if (a[i] !== b[i]) n += 1;
  return n;
}

function foldCutShapeChoice({ difficulty = 2 }) {
  const directions = sample([["h", "v"], ["v", "h"]]);
  const w = 0.5;
  const length = 0.2 + Math.random() * 0.14;
  const corner = sample(["tl", "tr", "bl", "br"]);
  const triangleAt = (c, len) => (c === "tl" ? [{ x: 0, y: 0 }, { x: len, y: 0 }, { x: 0, y: len }]
    : c === "tr" ? [{ x: w, y: 0 }, { x: w, y: len }, { x: w - len, y: 0 }]
      : c === "bl" ? [{ x: 0, y: w }, { x: len, y: w }, { x: 0, y: w - len }]
        : [{ x: w, y: w }, { x: w - len, y: w }, { x: w, y: w - len }]);
  const cut = triangleAt(corner, length);

  const unfold = (polygons) => {
    let current = polygons;
    for (let i = directions.length - 1; i >= 0; i -= 1) current = current.concat(current.map((p) => mirrorPolygon(p, directions[i])));
    return current;
  };
  const correct = unfold([cut]);
  const wrongOnlyOne = [cut, mirrorPolygon(cut, directions[1])];
  const wrongShift = [cut, shiftPolygon(cut, w, 0), shiftPolygon(cut, 0, w), shiftPolygon(cut, w, w)];
  const otherCorner = sample(["tl", "tr", "bl", "br"].filter((k) => k !== corner));
  const wrongCorner = unfold([triangleAt(otherCorner, length)]);

  const resolution = 181;
  const correctMask = shapeRasterMask(correct, resolution);
  const candidates = [wrongOnlyOne, wrongShift, wrongCorner]
    .filter((w2) => maskDifference(shapeRasterMask(w2, resolution), correctMask) > resolution * resolution * 0.01);
  if (candidates.length < 3) return foldCutShapeChoice({ difficulty });

  const foldMask = new Uint8Array(resolution * resolution);
  for (let j = 0; j < resolution; j += 1) for (let i = 0; i < resolution; i += 1) {
    const q = foldPointIn({ x: (i + 0.5) / resolution, y: (j + 0.5) / resolution }, directions);
    if (pointInPolygon(cut, q)) foldMask[j * resolution + i] = 1;
  }
  if (maskDifference(foldMask, correctMask) > resolution * resolution * 0.004) return foldCutShapeChoice({ difficulty });

  const options = shuffle([{ polygons: correct, ok: true }, ...candidates.map((w2) => ({ polygons: w2, ok: false }))]);
  const answerIndex = options.findIndex((o) => o.ok);
  return {
    prompt: "색종이를 두 번 접은 후 칠해진 부분을 잘라내었습니다. 남은 부분을 펼쳤을 때의 그림으로 알맞은 것을 고르시오.",
    visual: { kind: "fold-unfold-choice", directions, cut, options },
    answer: "①②③④"[answerIndex],
    solution: "잘린 삼각형을 접은 순서의 반대로 거울에 비추듯 펼치면, 두 번 접었으므로 네 자리에 대칭으로 나타납니다.",
    meta: { directions, cut, options, answerIndex }
  };
}

function diagonalFoldHoleCount({ difficulty = 2 }) {
  // 파이널 2회 15번: 대각선을 따라 세 번 접고 구멍 하나 → 8개.
  const folds = difficulty === 1 ? 2 : 3;
  const directions = [];
  for (let i = 0; i < folds; i += 1) {
    directions.push(i === 0 ? sample(["d1", "d2"]) : sample(["v", "h", "d1", "d2"]));
  }
  const holeCount = difficulty === 3 ? randomInt(1, 2) : 1;
  return foldQuestion({ directions, holeCount, margin: 0.05 }) || diagonalFoldHoleCount({ difficulty });
}





// ── main 갈래에서 이식한 파이널 2·3회 생성기 (2026-08-18) ──────────────
// 조사는 이 갈래의 koreanParticle로 통일한다(main의 hasBatchim 계열은 가져오지 않는다).

function pairedSequences({ difficulty = 2 }) {
  // 홀수 자리와 짝수 자리가 서로 다른 규칙을 따르는 수열. 빈칸은 자리마다 하나씩 둔다.
  const length = difficulty === 1 ? 8 : 10;
  const oddStart = randomInt(1, 6);
  const oddStep = randomInt(2, difficulty === 1 ? 4 : 5);
  const evenStart = randomInt(1, 6);
  let evenStep = randomInt(2, difficulty === 1 ? 4 : 5);
  while (evenStep === oddStep) evenStep = randomInt(2, difficulty === 1 ? 4 : 5);

  // 어려움은 짝수 자리를 계차가 1씩 커지는 수열로 바꾼다.
  const evenAt = (index) => (difficulty === 3
    ? evenStart + evenStep * index + (index * (index - 1)) / 2
    : evenStart + evenStep * index);
  const oddAt = (index) => oddStart + oddStep * index;

  const terms = Array.from({ length }, (_, position) => (
    position % 2 === 0 ? oddAt(position / 2) : evenAt((position - 1) / 2)
  ));

  // 빈칸은 뒤쪽 절반에서 홀수 자리 하나, 짝수 자리 하나를 고른다.
  const half = Math.floor(length / 2);
  const oddSlots = terms.map((_, i) => i).filter((i) => i % 2 === 0 && i >= half);
  const evenSlots = terms.map((_, i) => i).filter((i) => i % 2 === 1 && i >= half);
  // ㄱ이 항상 앞에 오도록 자리 순서로 이름을 붙인다. 뒤집히면 읽는 순서와 어긋난다.
  const [gIndex, nIndex] = [sample(oddSlots), sample(evenSlots)].sort((a, b) => a - b);
  const g = terms[gIndex];
  const n = terms[nIndex];

  const shown = terms.map((value, index) => {
    if (index === gIndex) return "ㄱ";
    if (index === nIndex) return "ㄴ";
    return String(value);
  }).join(", ");

  const evenRule = difficulty === 3
    ? `${evenStart}부터 커지는 폭이 ${evenStep}, ${evenStep + 1}, ${evenStep + 2}처럼 1씩 늘어납니다`
    : `${evenStart}부터 ${evenStep}씩 커집니다`;

  return {
    prompt: `다음은 일정한 규칙으로 늘어놓은 수입니다. ㄱ과 ㄴ에 알맞은 수를 각각 구하세요.\n${shown}`,
    answer: `ㄱ=${g}, ㄴ=${n}`,
    solution: `홀수 번째 자리끼리 보면 ${oddStart}부터 ${oddStep}씩 커지고, 짝수 번째 자리끼리 보면 ${evenRule}. 두 수열을 따로 이어가면 ㄱ은 ${g}, ㄴ은 ${n}입니다.`,
    meta: { length, oddStart, oddStep, evenStart, evenStep, gIndex, nIndex, g, n, terms }
  };
}

function setUnionCount({ difficulty = 2 }) {
  const pair = sample([["축구", "야구"], ["피아노", "태권도"], ["딸기", "포도"], ["수영", "줄넘기"]]);
  const scale = difficulty === 1 ? [5, 10] : difficulty === 2 ? [9, 20] : [14, 30];
  const both = randomInt(difficulty === 1 ? 1 : 3, difficulty === 1 ? 4 : 8);
  const first = randomInt(both + 2, scale[1]);
  const second = randomInt(Math.max(both + 2, scale[0]), scale[1]);
  const total = first + second - both;
  return {
    prompt: `어느 반 학생들에게 ${pair[0]}와 ${pair[1]}을 좋아하는지 조사했습니다. ${pair[0]}를 좋아하는 학생은 ${first}명, ${pair[1]}을 좋아하는 학생은 ${second}명입니다. 둘 다 좋아하는 학생이 ${both}명이고 모든 학생이 둘 중 하나는 좋아한다면, 이 반 학생은 모두 몇 명입니까?`,
    answer: `${total}명`,
    solution: `두 수를 그냥 더하면 둘 다 좋아하는 ${both}명을 두 번 세게 됩니다. ${first} + ${second} - ${both} = ${total}이므로 모두 ${total}명입니다.`,
    meta: { first, second, both, total }
  };
}


function magicSquare({ difficulty = 2 }) {
  // 3x3 마방진은 등차수열 아홉 개면 항상 만들어진다. 가운데가 다섯째 수이고 한 줄의 합은 그 세 배다.
  const start = difficulty === 1 ? randomInt(1, 6) : difficulty === 2 ? randomInt(2, 12) : randomInt(5, 25);
  const step = difficulty === 1 ? randomInt(1, 2) : difficulty === 2 ? randomInt(2, 4) : randomInt(3, 7);
  const v = (k) => start + step * k;             // v(0) … v(8)
  // 로슈 방식 배치. 인덱스는 등차수열에서의 순번이다.
  const layout = [[3, 8, 1], [2, 4, 6], [7, 0, 5]];
  const grid = layout.map((row) => row.map((k) => v(k)));
  const lineSum = v(4) * 3;

  const givenCount = difficulty === 1 ? 4 : difficulty === 2 ? 3 : 2;
  const positions = shuffle(Array.from({ length: 9 }, (_, i) => i)).slice(0, givenCount);
  const shown = grid.map((row, r) => row.map((value, c) => (positions.includes(r * 3 + c) ? value : null)));

  return {
    prompt: `아래 아홉 개의 수를 한 번씩만 써서 가로, 세로, 대각선에 놓인 세 수의 합이 모두 같도록 빈칸을 채우세요.`,
    visual: { kind: "magic-square", cards: Array.from({ length: 9 }, (_, k) => v(k)), shown },
    answer: grid.map((row) => row.join(" ")).join(" / "),
    solution: `아홉 수는 ${step}씩 커지는 수이므로 가운데에는 다섯째 수인 ${v(4)}이 들어가고 한 줄의 합은 ${v(4)} × 3 = ${lineSum}입니다. 합이 ${lineSum}이 되도록 남은 수를 짝지어 넣으면 위부터 ${grid.map((row) => row.join(", ")).join(" / ")}입니다.`,
    meta: { start, step, grid, lineSum, givenCount }
  };
}

function triangleSumPlacement({ difficulty = 2 }) {
  // 2행 격자에서 한 칸만 비워 두고 1부터 n까지를 한 번씩 넣는다. 원본(같게)은 2x3에 1~5.
  const columns = difficulty === 1 ? 2 : difficulty === 3 ? 4 : 3;
  const cellCount = columns * 2 - (difficulty === 1 ? 0 : 1);
  const numbers = Array.from({ length: cellCount }, (_, i) => i + 1);
  const slots = [];
  for (let r = 0; r < 2; r += 1) {
    for (let c = 0; c < columns; c += 1) {
      if (difficulty !== 1 && r === 0 && c === 0) continue; // 왼쪽 위는 빈 자리
      slots.push({ r, c });
    }
  }

  const arrangements = permutations(numbers);
  const target = arrangements[randomInt(0, arrangements.length - 1)];
  const sumsOf = (values) => {
    const rows = [0, 0];
    const cols = Array.from({ length: columns }, () => 0);
    slots.forEach((slot, index) => { rows[slot.r] += values[index]; cols[slot.c] += values[index]; });
    return { rows, cols };
  };
  const { rows, cols } = sumsOf(target);
  const matches = arrangements.filter((candidate) => {
    const s = sumsOf(candidate);
    return s.rows.every((v, i) => v === rows[i]) && s.cols.every((v, i) => v === cols[i]);
  });
  if (matches.length !== 1) return triangleSumPlacement({ difficulty });

  const cells = Array.from({ length: 2 }, (_, r) => Array.from({ length: columns }, (_, c) => (
    slots.some((slot) => slot.r === r && slot.c === c) ? { t: "blank" } : null
  )));
  const answer = slots.map((slot, index) => `${slot.r === 0 ? "위" : "아래"} ${slot.c + 1}번째 ${target[index]}`).join(", ");
  return {
    prompt: `1부터 ${cellCount}까지의 수를 한 번씩만 넣어 가로줄과 세로줄에 놓인 수의 합이 오른쪽과 아래에 쓰인 수가 되도록 빈칸을 채우세요.`,
    visual: { kind: "sum-grid", cells, rowSums: rows, colSums: cols, cards: numbers },
    answer,
    solution: `줄에 한 칸만 남는 곳부터 채웁니다. 각 줄의 합을 차례로 맞추면 배치가 하나로 정해집니다. ${answer}입니다.`,
    meta: { columns, cellCount, target, rows, cols, slots }
  };
}

function twoByTwoSumFill({ difficulty = 2 }) {
  // 2x2 네 칸. 행 합과 열 합만으로는 답이 하나로 정해지지 않는다.
  // "네 수가 모두 다르고 0보다 크다"는 조건이 붙어야 유일해가 된다.
  const cap = difficulty === 1 ? 6 : difficulty === 2 ? 9 : 14;
  const values = shuffle(Array.from({ length: cap }, (_, i) => i + 1)).slice(0, 4);
  const [a, b, c, d] = values;
  const rows = [a + b, c + d];
  const cols = [a + c, b + d];
  const candidates = [];
  for (let first = 1; first < rows[0]; first += 1) {
    const second = rows[0] - first;
    const third = cols[0] - first;
    const fourth = rows[1] - third;
    if (second < 1 || third < 1 || fourth < 1) continue;
    if (third + fourth !== rows[1] || second + fourth !== cols[1]) continue;
    if (new Set([first, second, third, fourth]).size !== 4) continue;
    candidates.push([first, second, third, fourth]);
  }
  if (candidates.length !== 1) return twoByTwoSumFill({ difficulty });

  return {
    prompt: "빈칸에 알맞은 수를 써넣으세요. 오른쪽과 아래에 쓰인 수는 그 줄에 있는 두 수의 합입니다. (단, 네 수는 서로 다르고 0보다 큽니다.)",
    visual: { kind: "sum-grid", cells: [[{ t: "blank" }, { t: "blank" }], [{ t: "blank" }, { t: "blank" }]], rowSums: rows, colSums: cols },
    answer: `위 ${a}, ${b} / 아래 ${c}, ${d}`,
    solution: `왼쪽 위를 ${a}로 두면 첫째 줄의 남은 칸은 ${b}, 첫째 열의 남은 칸은 ${c}, 마지막 칸은 ${d}입니다. 네 수가 모두 다르고 0보다 큰 경우는 이 하나뿐입니다.`,
    meta: { a, b, c, d, rows, cols }
  };
}

function shapeSumGrid({ difficulty = 2 }) {
  // 도형이 같으면 같은 수. 주어진 줄의 합으로 도형 값을 알아낸 뒤 ㉠ 줄의 합을 구한다.
  const size = difficulty === 1 ? 3 : 4;
  const symbols = ["○", "♡", "◇", "△"].slice(0, size === 3 ? 3 : 4);
  const values = shuffle(Array.from({ length: 9 }, (_, i) => i + 1)).slice(0, symbols.length);
  const grid = Array.from({ length: size }, () => Array.from({ length: size }, () => randomInt(0, symbols.length - 1)));
  if (new Set(grid.flat()).size !== symbols.length) return shapeSumGrid({ difficulty });

  const rowSum = (r) => grid[r].reduce((total, index) => total + values[index], 0);
  const colSum = (c) => grid.reduce((total, row) => total + values[row[c]], 0);
  const hiddenRow = randomInt(0, size - 1);
  const hiddenCol = randomInt(0, size - 1);
  const extraHidden = difficulty === 3 ? 1 : 0;
  const hiddenRow2 = extraHidden ? (hiddenRow + 1) % size : -1;

  const rowSums = Array.from({ length: size }, (_, r) => (r === hiddenRow || r === hiddenRow2 ? null : rowSum(r)));
  const colSums = Array.from({ length: size }, (_, c) => (c === hiddenCol ? null : colSum(c)));

  // 보이는 합만으로 도형 값이 하나로 정해져야 한다.
  const solutions = [];
  const search = (assign) => {
    if (solutions.length > 1) return;
    if (assign.length === symbols.length) {
      const ok = rowSums.every((sum, r) => sum === null || grid[r].reduce((t, i) => t + assign[i], 0) === sum)
        && colSums.every((sum, c) => sum === null || grid.reduce((t, row) => t + assign[row[c]], 0) === sum);
      if (ok) solutions.push([...assign]);
      return;
    }
    for (let v = 1; v <= 9; v += 1) search([...assign, v]);
  };
  search([]);
  if (solutions.length !== 1) return shapeSumGrid({ difficulty });

  const answer = rowSum(hiddenRow);
  const cells = grid.map((row) => row.map((index) => ({ t: "shape", s: symbols[index] })));
  const shownRowSums = rowSums.map((sum, r) => (r === hiddenRow ? "㉠" : sum));
  return {
    prompt: "같은 도형은 같은 수를 나타냅니다. 오른쪽과 아래에 쓰인 수는 그 줄에 있는 수의 합입니다. ㉠에 알맞은 수를 구하세요.",
    visual: { kind: "sum-grid", cells, rowSums: shownRowSums, colSums },
    answer: String(answer),
    solution: `줄의 합을 견주어 도형 값을 하나씩 정하면 ${symbols.map((symbol, i) => `${symbol}는 ${solutions[0][i]}`).join(", ")}입니다. ㉠ 줄에 있는 도형을 더하면 ${answer}입니다.`,
    meta: { size, symbols, values: solutions[0], grid, answer, hiddenRow, hiddenCol }
  };
}

function checkerCounts(side) {
  // 바둑판처럼 번갈아 놓으면 네 귀퉁이와 같은 색이 (홀수 x 홀수)일 때만 하나 더 많다.
  const first = Math.ceil((side * side) / 2);
  return { first, second: side * side - first };
}

function borderGoStoneDifference({ difficulty = 2 }) {
  // 파이널 3회 19번: 테두리를 한 줄씩 넓히며 흑백을 번갈아 놓는다.
  // 확정 답(5번째 = 흰 25 · 검 24 = 7x7)에서 첫 그림이 3x3임을 역산했다.
  const target = difficulty === 1 ? randomInt(3, 4) : difficulty === 2 ? 5 : randomInt(6, 9);
  const side = target + 2;
  const { first: white, second: black } = checkerCounts(side);
  const diff = white - black;
  return {
    prompt: `바둑돌을 그림과 같이 테두리를 한 줄씩 넓혀 가며 흰 돌과 검은 돌을 번갈아 놓았습니다. ${target}번째 모양에서 흰 바둑돌과 검은 바둑돌 중 어느 것이 몇 개 더 많습니까?`,
    visual: { kind: "checker-square-growth", shown: [3, 4, 5, 6], target },
    answer: diff === 0 ? "두 색의 개수가 같습니다" : `흰 바둑돌이 ${diff}개 더 많습니다`,
    solution: `${target}번째 모양은 한 줄에 ${side}개씩 ${side}줄입니다. 전체 ${side * side}개를 번갈아 놓으면 흰 돌 ${white}개, 검은 돌 ${black}개입니다.`,
    meta: { side, white, black }
  };
}

function halfGiveReverse({ difficulty = 2 }) {
  // 파이널 3회 6번: 똑같이 나눈 뒤 한 사람이 자기 몫의 반을 주면 차는 처음 한 사람 몫과 같아진다.
  const ITEMS = [
    { thing: "사탕", counter: "개", a: "형", b: "동생" },
    { thing: "구슬", counter: "개", a: "지호", b: "서연" },
    { thing: "색종이", counter: "장", a: "언니", b: "동생" },
    { thing: "딱지", counter: "장", a: "민준", b: "예린" },
    { thing: "쿠키", counter: "개", a: "누나", b: "동생" },
    { thing: "스티커", counter: "장", a: "하은", b: "시우" }
  ];
  const kinds = difficulty === 2 ? ITEMS[0] : sample(ITEMS);
  // 반을 다시 반으로 나누므로 한 사람 몫은 짝수여야 한다.
  const each = difficulty === 1 ? 2 * randomInt(1, 4) : difficulty === 2 ? 4 : 2 * randomInt(3, 14);
  const gap = each;
  return {
    prompt: `${koreanParticle(kinds.thing, "을", "를")} ${koreanParticle(kinds.a, "과", "와")} ${koreanParticle(kinds.b, "이", "가")} 똑같이 나누어 가졌습니다. 그런데 ${koreanParticle(kinds.a, "이", "가")} 자기가 가진 ${kinds.thing}의 반을 ${kinds.b}에게 주었더니 두 사람이 가진 ${kinds.thing}의 수의 차가 ${gap}${koreanParticle(kinds.counter, "이", "가")} 되었습니다. 처음에 있던 ${koreanParticle(kinds.thing, "은", "는")} 모두 몇 ${kinds.counter}입니까?`,
    answer: `${each * 2}${kinds.counter}`,
    solution: `${koreanParticle(kinds.a, "이", "가")} 반을 주면 ${koreanParticle(kinds.a, "은", "는")} 처음의 반, ${koreanParticle(kinds.b, "은", "는")} 처음의 한 배 반을 가지므로 차는 처음 한 사람 몫과 같습니다. 따라서 한 사람이 ${gap}${kinds.counter}씩 가졌고 처음에는 모두 ${each * 2}${kinds.counter}였습니다.`,
    meta: { each, gap }
  };
}

function countRectangles(cells) {
  const set = new Set(cells.map(([r, c]) => `${r},${c}`));
  const rs = cells.map((cell) => cell[0]);
  const cs = cells.map((cell) => cell[1]);
  const counts = {};
  for (let r0 = Math.min(...rs); r0 <= Math.max(...rs); r0 += 1) {
    for (let c0 = Math.min(...cs); c0 <= Math.max(...cs); c0 += 1) {
      for (let r1 = r0; r1 <= Math.max(...rs); r1 += 1) {
        for (let c1 = c0; c1 <= Math.max(...cs); c1 += 1) {
          let ok = true;
          for (let r = r0; r <= r1 && ok; r += 1) for (let c = c0; c <= c1 && ok; c += 1) if (!set.has(`${r},${c}`)) ok = false;
          if (ok) {
            const size = (r1 - r0 + 1) * (c1 - c0 + 1);
            counts[size] = (counts[size] || 0) + 1;
          }
        }
      }
    }
  }
  return counts;
}

function squareCountShape({ difficulty = 2 }) {
  // 파이널 3회 14번: 불규칙하게 붙은 도형에서 크고 작은 사각형을 모두 센다.
  // 확정 답 10개 = 한 칸 5 · 두 칸 4 · 세 칸 1. 5칸 모양 중 이 조합을 만드는 것이 실제로 있다.
  const size = difficulty === 1 ? 4 : difficulty === 2 ? 5 : randomInt(6, 7);
  const cells = [[0, 0]];
  while (cells.length < size) {
    const [r, c] = sample(cells);
    const [dr, dc] = sample([[1, 0], [-1, 0], [0, 1], [0, -1]]);
    const next = [r + dr, c + dc];
    if (!cells.some(([a, b]) => a === next[0] && b === next[1])) cells.push(next);
  }
  const counts = countRectangles(cells);
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  // 한 줄로만 늘어선 모양은 세는 재미가 없고, 같음 난이도는 원본 구성과 맞춘다.
  const distinctRows = new Set(cells.map((cell) => cell[0])).size;
  const distinctCols = new Set(cells.map((cell) => cell[1])).size;
  if (distinctRows < 2 || distinctCols < 2) return null;
  if (difficulty === 2 && !(counts[1] === 5 && counts[2] === 4 && counts[3] === 1 && total === 10)) return null;
  const parts = Object.keys(counts).map(Number).sort((a, b) => a - b).map((size2) => `${size2}칸짜리 ${counts[size2]}개`);
  return {
    prompt: "그림에서 찾을 수 있는 크고 작은 사각형은 모두 몇 개입니까?",
    visual: { kind: "cell-shape", cells },
    answer: `${total}개`,
    solution: `${parts.join(", ")}로 모두 ${total}개입니다.`,
    meta: { cells, counts, total }
  };
}



// ── 삼각형 세 변의 합을 같게 만들고 그 합을 최대로 (F29 · 파이널 3회 3번) ──────
// 원본 확인(2026-08-18, Drive PDF): "1부터 6까지의 수를 한 번씩 사용하여 한 줄의 수의 합이
// 모두 같게 되는 경우를 만들 때, 한 줄의 합이 가장 큰 경우 빈 칸을 채워보세요."
// 꼭짓점 3 + 변 가운데 3 = 여섯 자리. 세 변의 합을 더하면 꼭짓점만 두 번 세어지므로
// 3S = (전체 합) + (꼭짓점 합)이다. 따라서 합을 키우려면 큰 수를 꼭짓점에 놓아야 한다.
// 연속한 여섯 수 k..k+5에서 최대는 3k+9(꼭짓점이 큰 셋), 최소는 3k+6(꼭짓점이 작은 셋)이다.
function triangleMaxEdgeSum({ difficulty = 2 }) {
  // 연속한 여섯 수로 고정하면 난이도 1·2가 늘 같은 문항이 된다(검산에서 고유 9종만 나왔다).
  // 여섯 수는 연속일 필요가 없으므로, 같음 난이도만 원본(1~6)을 쓰고 나머지는 수를 흩어 뽑는다.
  const askMax = difficulty === 2 ? true : Math.random() < 0.5;
  const numbers = difficulty === 2
    ? [1, 2, 3, 4, 5, 6]
    : shuffle(Array.from({ length: difficulty === 1 ? 7 : 11 }, (_, i) => i + 1)).slice(0, 6).sort((a, b) => a - b);
  const total = numbers.reduce((a, b) => a + b, 0);

  // 답을 공식으로 가정하지 않고 720가지 배치를 전수로 훑어 조건을 만족하는 것만 모은다.
  // 자리: 0·1·2 = 꼭짓점(위·왼아래·오른아래), 3 = 위-왼아래 변, 4 = 왼아래-오른아래 변, 5 = 오른아래-위 변
  const SIDES = [[0, 3, 1], [1, 4, 2], [2, 5, 0]];
  const valid = [];
  for (const perm of permutations(numbers)) {
    const sums = SIDES.map((side) => side.reduce((a, i) => a + perm[i], 0));
    if (sums[0] === sums[1] && sums[1] === sums[2]) valid.push({ perm, sum: sums[0] });
  }
  if (!valid.length) return null;
  const target = askMax
    ? Math.max(...valid.map((v) => v.sum))
    : Math.min(...valid.map((v) => v.sum));
  const best = valid.filter((v) => v.sum === target);
  // 회전·뒤집기(6가지)를 빼면 배치가 하나여야 답이 정해진다.
  if (best.length !== 6) return null;
  const answer = best[0].perm;
  // 되짚어 확인: 공식과 전수 결과가 같은지
  const vertexSum = answer[0] + answer[1] + answer[2];
  if ((total + vertexSum) / 3 !== target) return null;

  const isRun = numbers.every((n, i) => i === 0 || n === numbers[i - 1] + 1);
  // 힌트 자리를 고정하면 같은 그림만 나온다. 쉬움 난이도는 꼭짓점 하나를 무작위로 보여 준다.
  const given = difficulty === 1 ? [randomInt(0, 2)] : [];
  return {
    prompt: `${isRun ? `${numbers[0]}부터 ${numbers[5]}까지의 수` : `${numbers.join(", ")}를`} 한 번씩 사용하여 삼각형의 한 줄에 놓인 세 수의 합이 모두 같게 만들려고 합니다. 한 줄의 합이 가장 ${askMax ? "큰" : "작은"} 경우가 되도록 빈 칸을 채우세요.`,
    visual: { kind: "triangle-edge-sum", numbers, given: given.map((i) => ({ slot: i, value: answer[i] })) },
    answer: `한 줄의 합 ${target} (꼭짓점 위 ${answer[0]}, 왼쪽 아래 ${answer[1]}, 오른쪽 아래 ${answer[2]} / 변 가운데 ${answer[3]}·${answer[4]}·${answer[5]})`,
    solution: `세 줄의 합을 모두 더하면 꼭짓점의 수만 두 번 세어집니다. 그래서 (한 줄의 합) × 3 = ${total} + (꼭짓점 세 수의 합)입니다. 합을 가장 ${askMax ? "크게" : "작게"} 하려면 ${askMax ? "큰" : "작은"} 수 ${answer.slice(0, 3).slice().sort((a, b) => a - b).join("·")}을 꼭짓점에 놓아야 하고, 이때 한 줄의 합은 ${target}입니다.`,
    meta: { numbers, target, answer, askMax, vertexSum, arrangements: best.length }
  };
}

export const GENERATORS = {
  triangleMaxEdgeSum,
  pairedSequences,
  setUnionCount,
  magicSquare,
  triangleSumPlacement,
  twoByTwoSumFill,
  shapeSumGrid,
  borderGoStoneDifference,
  halfGiveReverse,
  squareCountShape,

  diagonalFoldHoleCount,
  foldNumberRemainingSum,
  foldNumberCutSumTextbook,
  foldDiagonalNumberSum,
  foldTargetSumColoring,
  foldCutPieceCount,
  foldPunchShapeCount,
  foldStackFind,
  foldStackOrder,
  foldCutShapeChoice,
  verticalCryptarithmShapeSum,

  ...G1_GENERATORS,
  hiddenCardCondition,
  closestTwoDigitCardSum,
  frontBackTotal,
  wrongOperationCorrection,
  shapeMatrixRule,
  delayedDatePromise,
  tornCalendarWeekday,
  twoTypeUnitTotal,
  rowColumnCountPlacement,
  truthLieRanking,
  targetScoreCombinations,
  matchstickShapeSequence,
  connectedLineDegreeSum,
  letterBlockTransform,
  mixedSequences,
  neitherSetCount,
  hiddenScoreRanking,
  twoDigitEvenCount,
  reverseInitialCount,
  eraseExpressionTarget,
  collectionRepeatGap,
  mixedOperationCardEquation,
  twoDigitCardEnumeration,
  edgeSumCycle,
  gridNumberPlacementFive,
  equalizeTransfer,
  totalDifferenceShare,
  totalDifferenceCandyShare,
  fiveCardSumPyramid,
  stairGridPlacement,
  verticalStairGridPlacement,
  lGridPlacement,
  numberPyramid,
  raceOrder,
  orderPositionFromBack,
  orderPositionFromFront,
  orderPositionSevenPeople,
  additionTableGrid,
  additionTableGridBottomLeft,
  additionTableGridOffset,
  discNumberRule,
  shapeSumTable,
  shapeSumRowTarget,
  shapeSumBottomTarget,
  shapeSumColumnTarget,
  shapeSumRepeatedColumnTarget,
  repeatShapeSequence,
  repeatShapeColorDual,
  threeShapeCycle,
  fourShapeCycle,
  fourItemCycleWithDuplicate,
  arrowNumberGrid,
  arrowNumberHorizontalTens,
  arrowNumberPathSeven,
  numberCardEquation,
  busPassengers,
  sourceNonadjacentPyramid,
  sourceGoStoneDifference,
  sourceColoredShapeNumber,
  sourceSymbolRelations,
  symbolRelationTwoToThree,
  symbolRelationThreeToFour,
  numberLineSixPoints,
  goStoneDifferenceInverse,
  goStoneDifferenceInverseWhite,
  sourceBalanceRelations,
  balanceScaleThreeObjects,
  balanceScaleCircleTarget,
  balanceScaleStarTarget,
  balanceScaleFourObjects,
  sourcePianoBounce,
  sourceSymbolSumGrid,
  shapeSumGridTriangleTop,
  shapeSumGridTopTarget,
  shapeSumGridTriangleColumnTarget,
  symbolSumGridSquareTop,
  shapeEquationAddSubtract,
  twoDigitParityGap,
  twoDigitEvenOnesGreaterGap,
  twoDigitOddGap,
  twoDigitOddBoundedGap,
  triangleTileGrowth,
  squareTileGrowth,
  sourceGrowingDotSquare,
  sourceTwoDigitSumDifference,
  sourceEqualLineCross,
  sourceBusStops,
  busBoardThenLeave,
  foldNumberCutSum,
  foldNumberCutSumMainDiagonal,
  foldNumberCutSumLShape,
  equalLineSumEightCards,
  equalLineSumEightCardsFifteenTopLeft,
  equalLineSumEightCardsTwelve,
  twoDigitCondition,
  repeatShape,
  pianoZigzag,
  goStoneTriangle,
  lineOrder,
  paperFoldHoleCount
};
