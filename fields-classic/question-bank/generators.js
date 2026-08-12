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

function numberHasFinalConsonant(value) {
  // 한 자리 읽기의 받침 유무: 일·삼·육·칠·팔·영은 받침이 있고 이·사·오·구는 없다.
  return [true, true, false, true, false, false, true, true, true, false][Math.abs(value) % 10];
}

function objectParticle(value) {
  return numberHasFinalConsonant(value) ? "을" : "를";
}

function subjectParticle(value) {
  return numberHasFinalConsonant(value) ? "이" : "가";
}

function wrongOperationCorrection({ difficulty = 2 }) {
  if (difficulty === 1) {
    const step = randomInt(3, 9);
    const original = randomInt(step + 2, 20);
    const wrong = original - step;
    const correct = original + step;
    return {
      prompt: `어떤 수에 ${step}${objectParticle(step)} 더해야 할 것을 잘못하여 빼었더니 ${wrong}${subjectParticle(wrong)} 되었습니다. 바르게 계산한 값은 얼마입니까?`,
      answer: `${correct}`,
      solution: `잘못 계산한 식은 (어떤 수) - ${step} = ${wrong}이므로 어떤 수는 ${wrong} + ${step} = ${original}입니다. 바르게 계산하면 ${original} + ${step} = ${correct}입니다.`,
      meta: { mode: "add-instead-subtract", step, original, wrong, correct }
    };
  }

  if (difficulty === 3) {
    let first = randomInt(6, 19);
    let second = randomInt(6, 19);
    while (first === second) second = randomInt(6, 19);
    const original = randomInt(Math.max(first, second) + 10, 60);
    const wrong = original - first + second;
    const correct = original + first - second;
    return {
      prompt: `어떤 수에 ${first}${objectParticle(first)} 더한 뒤 ${second}${objectParticle(second)} 빼야 할 것을 잘못하여 ${first}${objectParticle(first)} 빼고 ${second}${objectParticle(second)} 더했더니 ${wrong}${subjectParticle(wrong)} 되었습니다. 바르게 계산한 값은 얼마입니까?`,
      answer: `${correct}`,
      solution: `잘못 계산한 식은 (어떤 수) - ${first} + ${second} = ${wrong}이므로 어떤 수는 ${wrong} + ${first} - ${second} = ${original}입니다. 바르게 계산하면 ${original} + ${first} - ${second} = ${correct}입니다.`,
      meta: { mode: "swapped-two-steps", first, second, original, wrong, correct }
    };
  }

  const step = randomInt(8, 19);
  const original = randomInt(step + 5, 55);
  const wrong = original - step;
  const correct = original + step;
  return {
    prompt: `어떤 수에 ${step}${objectParticle(step)} 더해야 할 것을 잘못하여 빼었더니 ${wrong}${subjectParticle(wrong)} 되었습니다. 바르게 계산한 값은 얼마입니까?`,
    answer: `${correct}`,
    solution: `잘못 계산한 식은 (어떤 수) - ${step} = ${wrong}이므로 어떤 수는 ${wrong} + ${step} = ${original}입니다. 바르게 계산하면 ${original} + ${step} = ${correct}입니다.`,
    meta: { mode: "add-instead-subtract", step, original, wrong, correct }
  };
}

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
  const gIndex = sample(oddSlots);
  const nIndex = sample(evenSlots);
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

const MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function shiftDate(month, day, delta) {
  let m = month;
  let d = day + delta;
  while (d > MONTH_DAYS[m - 1]) { d -= MONTH_DAYS[m - 1]; m += 1; }
  while (d < 1) { m -= 1; d += MONTH_DAYS[m - 1]; }
  return { month: m, day: d };
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

function delayedDatePromise({ difficulty = 2 }) {
  const ago = difficulty === 1 ? randomInt(2, 6) : difficulty === 2 ? randomInt(7, 14) : randomInt(10, 25);
  // 시험일은 반드시 오늘보다 뒤여야 한다. after가 ago와 같으면 오늘 날짜가 그대로 답이 되어 문제에 노출된다.
  const after = difficulty === 1 ? randomInt(ago + 1, 12) : difficulty === 2 ? randomInt(15, 25) : randomInt(26, 45);
  const month = randomInt(2, 10);
  const day = randomInt(ago + 1, MONTH_DAYS[month - 1]);
  const heard = shiftDate(month, day, -ago);
  const exam = shiftDate(heard.month, heard.day, after);
  return {
    prompt: `선생님께서 ${ago}일 전에 "오늘부터 ${after}일 후에 수학 시험을 보겠습니다"라고 말씀하셨습니다. 오늘이 ${month}월 ${day}일일 때, 수학 시험을 보는 날은 몇 월 며칠입니까?`,
    answer: `${exam.month}월 ${exam.day}일`,
    solution: `말씀하신 날은 ${month}월 ${day}일의 ${ago}일 전인 ${heard.month}월 ${heard.day}일입니다. 그날부터 ${after}일 후를 세면 ${exam.month}월 ${exam.day}일입니다.`,
    meta: { ago, after, month, day, heard, exam }
  };
}

function twoTypeUnitTotal({ difficulty = 2 }) {
  const BIKE = { a: "두발자전거", b: "세발자전거", aUnit: 2, bUnit: 3, unit: "바퀴", counter: "대", place: "자전거 가게" };
  const kinds = difficulty === 2
    ? BIKE
    : sample(difficulty === 1
      ? [BIKE, { a: "오리", b: "돼지", aUnit: 2, bUnit: 4, unit: "다리", counter: "마리", place: "농장" }]
      : [
        { a: "닭", b: "토끼", aUnit: 2, bUnit: 4, unit: "다리", counter: "마리", place: "농장" },
        { a: "오토바이", b: "자동차", aUnit: 2, bUnit: 4, unit: "바퀴", counter: "대", place: "주차장" },
        { a: "세발자전거", b: "네발자전거", aUnit: 3, bUnit: 4, unit: "바퀴", counter: "대", place: "놀이터" }
      ]);
  const total = difficulty === 1 ? randomInt(5, 11) : difficulty === 2 ? randomInt(8, 18) : randomInt(9, 20);
  const bCount = randomInt(1, total - 1);
  const aCount = total - bCount;
  const units = aCount * kinds.aUnit + bCount * kinds.bUnit;
  return {
    prompt: `${kinds.place}에 ${kinds.a}와 ${kinds.b}가 모두 ${total}${kinds.counter} 있습니다. ${kinds.unit}가 모두 ${units}개일 때, ${kinds.b}는 몇 ${kinds.counter}입니까?`,
    answer: `${bCount}${kinds.counter}`,
    solution: `모두 ${kinds.a}라면 ${kinds.unit}는 ${total} × ${kinds.aUnit} = ${aCount * kinds.aUnit + bCount * kinds.aUnit}개입니다. 실제보다 ${units - total * kinds.aUnit}개가 적고, ${kinds.b} 한 ${kinds.counter}를 바꿀 때마다 ${kinds.bUnit - kinds.aUnit}개씩 늘어나므로 ${kinds.b}는 ${bCount}${kinds.counter}입니다.`,
    meta: { total, aCount, bCount, units, aUnit: kinds.aUnit, bUnit: kinds.bUnit }
  };
}

function totalDifference({ difficulty = 2 }) {
  const pair = sample([["형", "동생", "살"], ["언니", "동생", "살"], ["누나", "동생", "살"]]);
  const gap = difficulty === 1 ? randomInt(2, 4) : difficulty === 2 ? randomInt(3, 7) : randomInt(5, 11);
  const younger = difficulty === 1 ? randomInt(3, 8) : difficulty === 2 ? randomInt(5, 14) : randomInt(8, 22);
  const older = younger + gap;
  const sum = older + younger;
  return {
    prompt: `${pair[0]}와 ${pair[1]}의 나이의 합은 ${sum}${pair[2]}인데 ${pair[0]}이 ${pair[1]}보다 ${gap}${pair[2]} 더 많습니다. ${pair[0]}은 몇 ${pair[2]}입니까?`,
    answer: `${older}${pair[2]}`,
    solution: `합 ${sum}에서 차 ${gap}을 빼면 ${pair[1]} 나이의 두 배인 ${sum - gap}이 됩니다. ${pair[1]}은 ${younger}${pair[2]}이고 ${pair[0]}은 ${younger} + ${gap} = ${older}${pair[2]}입니다.`,
    meta: { sum, gap, older, younger }
  };
}

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

function calendarDateWeekday({ difficulty = 2 }) {
  const month = randomInt(1, 12);
  const days = MONTH_DAYS[month - 1];
  const firstWeekday = randomInt(0, 6);           // 그 달 1일의 요일

  // 찢어진 달력: 남은 부분은 첫 몇 줄뿐이고, 묻는 날짜는 반드시 찢겨 나간 아래쪽에 있어야 한다.
  // 남은 줄에 그 날짜가 그대로 보이면 세어 볼 것도 없이 답이 읽힌다.
  const keepRows = difficulty === 3 ? 1 : 2;
  const lastShown = keepRows * 7 - firstWeekday;  // 남은 줄의 마지막 날짜
  const reach = difficulty === 1 ? 7 : difficulty === 2 ? 21 : 28;
  const target = randomInt(lastShown + 1, Math.min(lastShown + reach, days));
  const answerIndex = (firstWeekday + target - 1) % 7;
  const cells = [];
  for (let i = 0; i < firstWeekday; i += 1) cells.push(null);
  for (let day = 1; day <= lastShown; day += 1) cells.push(day);

  const anchor = lastShown;
  const anchorWeekday = WEEKDAYS[(firstWeekday + anchor - 1) % 7];
  return {
    prompt: `달력의 아래쪽이 찢어졌습니다. 남은 부분을 보고 이달 ${target}일은 무슨 요일인지 구하세요.`,
    visual: { kind: "torn-calendar", month, firstWeekday, cells, target },
    answer: `${WEEKDAYS[answerIndex]}요일`,
    solution: `남은 달력에서 ${anchor}일은 ${anchorWeekday}요일입니다. 같은 요일은 7일마다 돌아오므로 ${anchor}일에서 ${target - anchor}일을 더 세면 ${target}일은 ${WEEKDAYS[answerIndex]}요일입니다.`,
    meta: { month, firstWeekday, target, answerIndex, lastShown }
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

function edgeSumCycle({ difficulty = 2 }) {
  const max = difficulty === 1 ? 9 : difficulty === 2 ? 15 : 25;
  let values;
  let solution;
  let edges;
  do {
    values = shuffle(Array.from({ length: max }, (_, index) => index + 1)).slice(0, 4);
    solution = shuffle(values);
    edges = [
      solution[0] + solution[1],
      solution[1] + solution[2],
      solution[2] + solution[3],
      solution[3] + solution[0]
    ];
  } while (permutations(values).filter((candidate) => (
    candidate[0] + candidate[1] === edges[0]
    && candidate[1] + candidate[2] === edges[1]
    && candidate[2] + candidate[3] === edges[2]
    && candidate[3] + candidate[0] === edges[3]
  )).length !== 1);

  const [topLeft, topRight, bottomRight, bottomLeft] = solution;
  return {
    prompt: "주어진 수 카드를 한 번씩 모두 사용하여 네 원 안에 넣으세요. 각 변에 적힌 수는 양끝 원 안의 두 수의 합입니다.",
    visual: { kind: "edge-sum-cycle", values: shuffle(values), edges },
    answer: `왼쪽 위 ${topLeft}, 오른쪽 위 ${topRight}, 오른쪽 아래 ${bottomRight}, 왼쪽 아래 ${bottomLeft}`,
    solution: `윗변의 합이 ${edges[0]}이 되는 두 수를 먼저 찾습니다. 이어서 오른쪽 변, 아랫변, 왼쪽 변의 합을 차례로 확인하면 네 자리가 하나로 정해집니다.`
  };
}

function equalizeTransfer({ difficulty = 2 }) {
  const lower = randomInt(difficulty === 1 ? 4 : difficulty === 2 ? 6 : 10, difficulty === 1 ? 8 : difficulty === 2 ? 12 : 15);
  const transfer = randomInt(1, difficulty === 1 ? 3 : difficulty === 2 ? 4 : 5);
  const higher = lower + transfer * 2;
  const names = Math.random() < 0.5 ? ["강준", "다현"] : ["유진", "민서"];
  return {
    prompt: `${names[0]}이와 ${names[1]}이가 사탕을 똑같이 가지려고 합니다. ${names[0]}이가 ${names[1]}이에게 사탕 몇 개를 주어야 하는지 구하세요.`,
    visual: { kind: "equalize-bags", names, higher, lower },
    answer: `${transfer}개`,
    solution: `두 사람의 사탕 수 차이는 ${higher - lower}개입니다. 한 개를 주면 한쪽은 1개 줄고 다른 쪽은 1개 늘므로, 차이의 반인 ${transfer}개를 주면 같습니다.`
  };
}

function numberPyramid({ difficulty = 2 }) {
  const max = difficulty === 1 ? 6 : difficulty === 2 ? 10 : 16;
  const cards = shuffle(Array.from({ length: max }, (_, index) => index + 1)).slice(0, 3);
  const middle = sample(cards);
  const target = cards.reduce((sum, value) => sum + value, 0) + middle;
  return {
    prompt: "첫째 줄에 주어진 수 카드 세 장을 한 번씩 넣어 두 번 모으기 한 값이 아래 수가 되도록 하세요. ㉠에 들어갈 수를 구하세요.",
    visual: { kind: "number-pyramid", cards: shuffle(cards), target },
    answer: String(middle),
    solution: `두 번 모으기 한 값은 첫째 줄의 세 수의 합에 가운데 수를 한 번 더 더한 값입니다. 카드의 합은 ${cards.reduce((sum, value) => sum + value, 0)}이므로, ${target}에서 ${cards.reduce((sum, value) => sum + value, 0)}을 빼면 ㉠은 ${middle}입니다.`
  };
}

function raceOrder({ difficulty = 2 }) {
  const names = shuffle(["준수", "민호", "성준", "연우", "지우"]);
  const total = difficulty === 3 ? 5 : 4;
  const selected = names.slice(0, total);
  const [first, earlier, fixed, later, extra] = selected;
  if (total === 4) {
    return {
      prompt: `${selected.join("·")} ${total}명의 친구들이 달리기를 하고 있습니다. 다음을 보고 ${first}는 몇 등인지 구하세요.`,
      visual: { kind: "race-order", total, conditions: [`${fixed}은 3등입니다.`, `${earlier}은 ${later}보다 먼저 들어왔지만 1등은 아닙니다.`] },
      answer: "1등",
      solution: `${fixed}은 3등입니다. ${earlier}은 ${later}보다 먼저 들어왔지만 1등이 아니므로 ${earlier}은 2등, ${later}은 4등입니다. 따라서 ${first}는 1등입니다.`,
    };
  }
  return {
    prompt: `${selected.join("·")} ${total}명의 친구들이 달리기를 하고 있습니다. 다음을 보고 ${first}는 몇 등인지 구하세요.`,
    visual: { kind: "race-order", total, conditions: [`${fixed}은 3등입니다.`, `${extra}은 5등입니다.`, `${earlier}은 ${later}보다 먼저 들어왔지만 1등은 아닙니다.`] },
    answer: "1등",
    solution: `${fixed}은 3등이고, ${earlier}은 ${later}보다 먼저 들어왔지만 1등이 아닙니다. ${extra}은 5등이므로 ${earlier}은 2등, ${later}은 4등입니다. 따라서 ${first}는 1등입니다.`,
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

function repeatShapeSequence({ difficulty = 2 }) {
  const target = randomInt(difficulty === 1 ? 8 : difficulty === 2 ? 11 : 21, difficulty === 1 ? 12 : difficulty === 2 ? 20 : 35);
  const cycle = ["동그라미", "세모", "동그라미"];
  const answer = cycle[(target - 1) % cycle.length];
  return {
    prompt: `아래 그림의 규칙을 찾아 ${target}번째 모양을 구하세요.`,
    visual: { kind: "repeat-shape-sequence", items: cycle.concat(cycle, cycle.slice(0, 1)), target },
    answer,
    solution: `동그라미, 세모, 동그라미가 3개씩 반복됩니다. ${target}을 3개씩 나눈 나머지를 확인하면 ${target}번째는 ${answer}입니다.`
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
    solution: `오른쪽 화살표는 1씩 커지고, 위쪽 화살표는 10씩 작아집니다. 화살표를 차례로 따라가면 ${start}에서 ${answer}가 됩니다.`
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
    solution: `꼭대기 ${top}과 이웃한 칸에는 ${top}을 쓸 수 없고, 둘째 줄 왼쪽의 ${left}과 이웃한 칸에는 ${left}을 쓸 수 없습니다. 따라서 ㉠에는 남은 수 ${answer}이 들어갑니다.`
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
  const rectangleWeight = difficulty === 3 ? 3 : 2;
  const starRectangles = difficulty === 1 ? 1 : 2;
  const starWeight = 1 + starRectangles * rectangleWeight;
  const answer = starWeight + rectangleWeight;
  return {
    prompt: "다음 양팔저울은 모두 수평입니다. [그림 3]이 수평이 되려면 오른쪽 접시에 ○을 몇 개 놓아야 하는지 구하세요.",
    visual: { kind: "balance-relations", rectangleWeight, starRectangles },
    answer: `${answer}개`,
    solution: `둘째 저울에서 긴 네모 1개는 ○ ${rectangleWeight}개와 같습니다. 첫째 저울에서 ☆는 ○ 1개와 긴 네모 ${starRectangles}개입니다. 따라서 [그림 3]의 ☆와 긴 네모의 무게는 ○ ${answer}개와 같습니다.`
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
  const target = difficulty === 1 ? randomInt(5, 6) : difficulty === 2 ? randomInt(6, 7) : randomInt(7, 9);
  return {
    prompt: `구슬을 놓아 다음 모양을 만들어 갈 때, ${target}번째 모양에는 구슬을 몇 개 놓는지 구하세요.`,
    visual: { kind: "growing-dot-square", target },
    answer: String(target * target),
    solution: `1번째는 1개, 2번째는 4개, 3번째는 9개, 4번째는 16개입니다. 다음 모양으로 갈수록 가로와 세로에 구슬이 한 개씩 늘어납니다. ${target}번째는 가로 ${target}줄에 ${target}개씩 있으므로 모두 ${target * target}개입니다.`
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
  const sum = top + bottom;
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


export const GENERATORS = {
  hiddenCardCondition,
  closestTwoDigitCardSum,
  frontBackTotal,
  wrongOperationCorrection,
  pairedSequences,
  setUnionCount,
  delayedDatePromise,
  twoTypeUnitTotal,
  totalDifference,
  calendarDateWeekday,
  magicSquare,
  diagonalFoldHoleCount,
  edgeSumCycle,
  equalizeTransfer,
  numberPyramid,
  raceOrder,
  discNumberRule,
  shapeSumTable,
  repeatShapeSequence,
  arrowNumberGrid,
  numberCardEquation,
  busPassengers,
  sourceNonadjacentPyramid,
  sourceGoStoneDifference,
  sourceColoredShapeNumber,
  sourceSymbolRelations,
  sourceBalanceRelations,
  sourcePianoBounce,
  sourceSymbolSumGrid,
  sourceGrowingDotSquare,
  sourceTwoDigitSumDifference,
  sourceEqualLineCross,
  sourceBusStops,
  twoDigitCondition,
  repeatShape,
  pianoZigzag,
  goStoneTriangle,
  lineOrder,
  paperFoldHoleCount
};
