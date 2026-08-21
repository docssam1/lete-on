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
    prompt: `어느 반 학생들에게 ${withOf(pair[0])} ${objectOf(pair[1])} 좋아하는지 조사했습니다. ${objectOf(pair[0])} 좋아하는 학생은 ${first}명, ${objectOf(pair[1])} 좋아하는 학생은 ${second}명입니다. 둘 다 좋아하는 학생이 ${both}명이고 모든 학생이 둘 중 하나는 좋아한다면, 이 반 학생은 모두 몇 명입니까?`,
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
  const HEN = { a: "닭", b: "토끼", aUnit: 2, bUnit: 4, unit: "다리", counter: "마리", place: "농장" };
  // 같음 난이도의 원본이 둘이다. 파이널 2회 13번은 자전거, 3회 18번은 닭과 토끼다.
  const kinds = difficulty === 2
    ? sample([BIKE, HEN])
    : sample(difficulty === 1
      ? [BIKE, { a: "오리", b: "돼지", aUnit: 2, bUnit: 4, unit: "다리", counter: "마리", place: "농장" }]
      : [
        HEN,
        { a: "오토바이", b: "자동차", aUnit: 2, bUnit: 4, unit: "바퀴", counter: "대", place: "주차장" },
        { a: "세발자전거", b: "네발자전거", aUnit: 3, bUnit: 4, unit: "바퀴", counter: "대", place: "놀이터" }
      ]);
  const total = difficulty === 1 ? randomInt(5, 11) : difficulty === 2 ? randomInt(8, 18) : randomInt(9, 20);
  const bCount = randomInt(1, total - 1);
  const aCount = total - bCount;
  const units = aCount * kinds.aUnit + bCount * kinds.bUnit;
  // 원본은 한 종류만 묻기도 하고(2회 13번) 둘 다 묻기도 한다(3회 18번). 푸는 방법은 같다.
  const askBoth = Math.random() < 0.5;
  return {
    prompt: `${kinds.place}에 ${withOf(kinds.a)} ${subjectOf(kinds.b)} 모두 ${total}${kinds.counter} 있습니다. ${kinds.unit}가 모두 ${units}개일 때, ${askBoth ? `${withOf(kinds.a)} ${topicOf(kinds.b)} 각각 몇 ${kinds.counter}` : `${topicOf(kinds.b)} 몇 ${kinds.counter}`}입니까?`,
    answer: askBoth ? `${kinds.a} ${aCount}${kinds.counter}, ${kinds.b} ${bCount}${kinds.counter}` : `${bCount}${kinds.counter}`,
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
    prompt: `${withOf(pair[0])} ${pair[1]}의 나이의 합은 ${sum}${pair[2]}이고, ${topicOf(pair[0])} ${pair[1]}보다 ${gap}${pair[2]} 더 많습니다. ${topicOf(pair[0])} 몇 ${pair[2]}입니까?`,
    answer: `${older}${pair[2]}`,
    solution: `합 ${sum}에서 ${objectOf(`차 ${gap}`)} 빼면 ${pair[1]} 나이의 두 배인 ${subjectOf(sum - gap)} 됩니다. ${topicOf(pair[1])} ${younger}${pair[2]}이고 ${topicOf(pair[0])} ${younger} + ${gap} = ${older}${pair[2]}입니다.`,
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

// ── 합 조건 격자 ────────────────────────────────────────────
// 16·17·19번은 모양이 달라도 "칸에 값을 넣고 행·열의 합을 맞춘다"는 뼈대가 같다.
// 셀은 {t:'blank'} 채워야 할 칸, {t:'num',v} 이미 적힌 수, {t:'shape',s} 도형, null 칸 없음.

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
    prompt: `${withOf(names[0])} ${subjectOf(names[1])} 사탕을 똑같이 가지려고 합니다. ${subjectOf(names[0])} ${names[1]}에게 사탕 몇 개를 주어야 하는지 구하세요.`,
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

function shapeRepeatOrdinal({ difficulty = 2 }) {
  const shapeNames = shuffle(["동그라미", "세모", "네모", "마름모", "별"]);
  const settings = difficulty === 1
    ? { patterns: [[0, 1]], target: [8, 12] }
    : difficulty === 3
      ? { patterns: [[0, 1, 2, 1], [0, 0, 1, 2], [0, 1, 2, 0]], target: [17, 30] }
      : { patterns: [[0, 1, 0], [0, 0, 1], [0, 1, 1]], target: [11, 20] };
  const pattern = sample(settings.patterns);
  const cycle = pattern.map((index) => shapeNames[index]);
  const target = randomInt(settings.target[0], settings.target[1]);
  const shownCount = cycle.length * 2 + 1;
  const items = Array.from({ length: shownCount }, (_, index) => cycle[index % cycle.length]);
  const answer = cycle[(target - 1) % cycle.length];
  const cycleText = cycle.join(", ");
  return {
    prompt: `아래 그림의 규칙을 찾아 ${target}번째 모양을 그리세요.`,
    visual: { kind: "repeat-shape-sequence", items, target },
    answer,
    answerVisual: { kind: "repeat-shape-answer", item: answer },
    solution: `한 반복마디는 ${cycleText}입니다. 이 반복마디를 차례대로 이어 보면 ${target}번째 모양은 ${answer}입니다.`
  };
}

function equalPartition(parts, { difficulty = 2 }) {
  const ranges = difficulty === 1 ? [2, 8] : difficulty === 3 ? [8, 20] : [4, 14];
  const part = randomInt(ranges[0], ranges[1]);
  const top = part * parts;
  const middle = parts === 4 ? top / 2 : null;
  const label = parts === 2 ? "두 수" : parts === 3 ? "세 수" : "네 수";
  const detail = parts === 4
    ? `먼저 ${objectOf(top)} 반으로 가르면 ${withOf(middle)} ${middle}입니다. ${objectOf(middle)} 다시 반으로 가르면 ${withOf(part)} ${part}이므로, 맨 아래 빈칸에는 모두 ${subjectOf(part)} 들어갑니다.`
    : `${objectOf(top)} 똑같은 ${parts}부분으로 가르면 한 부분은 ${part}입니다. 따라서 ${label}는 모두 ${part}입니다.`;
  return {
    prompt: `아래 수를 ${label}로 똑같이 가르려고 합니다. 맨 아래 빈칸 하나에 들어갈 수를 구하세요.`,
    visual: { kind: "equal-partition-tree", top, parts, middle },
    answer: String(part),
    solution: detail,
    meta: { top, parts, part, middle }
  };
}

function equalPartitionTwo(options) {
  return equalPartition(2, options);
}

function equalPartitionThree(options) {
  return equalPartition(3, options);
}

function equalPartitionFour(options) {
  return equalPartition(4, options);
}

function reverseTransferTotal({ difficulty = 2 }) {
  const names = sample([["재이", "준이"], ["유나", "민서"], ["하나", "지우"]]);
  const afterEach = randomInt(difficulty === 1 ? 4 : difficulty === 2 ? 6 : 8, difficulty === 1 ? 8 : difficulty === 2 ? 14 : 18) * 2;
  const receiverBefore = afterEach / 2;
  const giverBefore = afterEach + receiverBefore;
  let prompt;
  if (difficulty === 1) {
    prompt = `${names[1]}는 구슬을 ${receiverBefore}개 가지고 있었습니다. ${names[0]}가 ${names[1]}에게 ${names[1]}가 가지고 있던 만큼의 구슬을 주었더니 두 사람의 구슬 수가 같아졌습니다. ${names[0]}가 처음 가지고 있던 구슬은 몇 개입니까?`;
  } else if (difficulty === 3) {
    prompt = `${names[0]}가 ${names[1]}에게 ${names[1]}가 가지고 있던 만큼의 구슬을 주었더니 두 사람의 구슬 수가 같아졌고, 두 사람의 구슬을 모두 합하면 ${afterEach * 2}개였습니다. ${names[0]}가 처음 가지고 있던 구슬은 몇 개입니까?`;
  } else {
    prompt = `${names[0]}가 ${names[1]}에게 ${names[1]}가 가지고 있던 만큼의 구슬을 주었더니 두 사람은 각각 ${afterEach}개의 구슬을 가지게 되었습니다. ${names[0]}가 처음 가지고 있던 구슬은 몇 개입니까?`;
  }
  return {
    prompt,
    answer: `${giverBefore}개`,
    solution: `준 뒤에 ${names[1]}의 구슬은 ${afterEach}개입니다. 처음 가진 만큼을 한 번 더 받아 ${afterEach}개가 되었으므로 처음에는 ${receiverBefore}개였습니다. ${names[0]}에게는 준 뒤 ${afterEach}개와 준 구슬 ${receiverBefore}개가 있었으므로 처음에는 ${giverBefore}개입니다.`,
    meta: { names, afterEach, receiverBefore, giverBefore }
  };
}

function balanceOrderChain({ difficulty = 2 }) {
  const count = difficulty === 3 ? 4 : 3;
  const ordered = shuffle(["●", "◆", "■", "★", "▲"]).slice(0, count);
  const relations = [];
  for (let index = 0; index < count - 1; index += 1) {
    const reverse = Math.random() < 0.5;
    relations.push(reverse
      ? { left: ordered[index + 1], right: ordered[index], heavier: "right" }
      : { left: ordered[index], right: ordered[index + 1], heavier: "left" });
  }
  if (difficulty >= 2) {
    const reverse = Math.random() < 0.5;
    relations.push(reverse
      ? { left: ordered.at(-1), right: ordered[0], heavier: "right" }
      : { left: ordered[0], right: ordered.at(-1), heavier: "left" });
  }
  return {
    prompt: `양팔저울 ${relations.length}개를 보고 무거운 물건부터 차례대로 기호를 쓰세요.`,
    visual: { kind: "balance-order-chain", relations: shuffle(relations) },
    answer: ordered.join(" > "),
    solution: `아래로 내려간 접시에 있는 물건이 더 무겁습니다. 저울의 관계를 이어 보면 ${ordered.join(" > ")}입니다.`,
    meta: { ordered, relations }
  };
}

function balanceGivenUnitWeight({ difficulty = 2 }) {
  const symbols = shuffle(["●", "◆", "■", "★"]);
  const [unit, first, second, target] = symbols;
  const unitGrams = randomInt(1, difficulty === 3 ? 3 : 2);
  let factors;
  let equations;
  if (difficulty === 1) {
    factors = [1, 2, 0, 3];
    equations = [
      { left: [first], right: [unit, unit] },
      { left: [target], right: [first, unit] }
    ];
  } else if (difficulty === 3) {
    factors = [1, 3, 4, 7];
    equations = [
      { left: [first], right: [unit, unit, unit] },
      { left: [second], right: [first, unit] },
      { left: [target], right: [first, second] }
    ];
  } else {
    factors = [1, 3, 2, 5];
    equations = [
      { left: [first], right: [unit, unit, unit] },
      { left: [second], right: [unit, unit] },
      { left: [target], right: [first, second] }
    ];
  }
  const weights = Object.fromEntries(symbols.map((symbol, index) => [symbol, factors[index] * unitGrams]));
  return {
    prompt: `다음 양팔저울은 모두 수평입니다. ${unit} 1개의 무게가 ${unitGrams}g일 때, ${target} 1개의 무게를 구하세요.`,
    visual: { kind: "balance-unit-equations", equations, unit, unitGrams },
    answer: `${weights[target]}g`,
    solution: equations.map((row) => `${row.left.join("+")}=${row.right.join("+")}`).join(" → ") + `이므로 ${target} 1개의 무게는 ${weights[target]}g입니다.`,
    meta: { symbols, factors, weights, equations, unit, unitGrams, target }
  };
}

function distinctShapeValueEquation({ difficulty = 2 }) {
  const symbols = shuffle(["○", "□", "◇", "△", "✚"]);
  const [a, b, c, d, e] = symbols;
  let rows;
  let values;
  let limit;
  if (difficulty === 1) {
    limit = 5;
    values = { [a]: 1, [b]: 2, [c]: 3, [d]: 4, [e]: 5 };
    rows = [
      { left: [a, a], right: [b] },
      { left: [a, b], right: [c] },
      { left: [a, c], right: [d] },
      { left: [a, d], right: [e] }
    ];
  } else {
    limit = 9;
    const family = sample(["fibonacci", "triple", "double"]);
    if (family === "triple") {
      values = { [a]: 1, [b]: 3, [c]: 4, [d]: 5, [e]: 9 };
      rows = [
        { left: [a, a, a], right: [b] },
        { left: [a, b], right: [c] },
        { left: [a, c], right: [d] },
        { left: [c, d], right: [e] }
      ];
    } else if (family === "double") {
      values = { [a]: 1, [b]: 2, [c]: 4, [d]: 5, [e]: 7 };
      rows = [
        { left: [a, a], right: [b] },
        { left: [b, b], right: [c] },
        { left: [a, c], right: [d] },
        { left: [b, d], right: [e] }
      ];
    } else {
      values = { [a]: 1, [b]: 2, [c]: 3, [d]: 5, [e]: 8 };
      rows = [
        { left: [a, a], right: [b] },
        { left: [a, b], right: [c] },
        { left: [b, c], right: [d] },
        { left: [c, d], right: [e] }
      ];
    }
    if (difficulty === 3) rows = shuffle(rows);
  }
  const targetCandidates = difficulty === 1 ? [d, e] : [c, d, e];
  const target = sample(targetCandidates);
  return {
    prompt: `각 도형은 1부터 ${limit}까지의 서로 다른 수를 나타냅니다. 식을 보고 ${target}가 나타내는 수를 구하세요.`,
    visual: { kind: "distinct-shape-equations", rows, limit, target },
    answer: String(values[target]),
    solution: `같은 도형은 같은 수이고 서로 다른 도형은 서로 다른 수입니다. 식을 차례로 맞추면 ${symbols.map((symbol) => `${symbol}=${values[symbol]}`).join(", ")}이므로 ${target}=${values[target]}입니다.`,
    meta: { symbols, values, rows, limit, target }
  };
}

function constantStepNumberSequence({ difficulty = 2 }) {
  const rowCount = difficulty === 1 ? 1 : 2;
  const length = difficulty === 3 ? 7 : 6;
  const rows = [];
  for (let rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
    const step = randomInt(2, difficulty === 3 ? 12 : 7);
    const descending = rowIndex > 0 ? true : Math.random() < 0.35;
    const start = descending ? randomInt(step * length + 5, step * length + 30) : randomInt(1, 12);
    const items = Array.from({ length }, (_, index) => start + (descending ? -step : step) * index);
    const gap = randomInt(2, length - 2);
    rows.push({ items, gap, step: descending ? -step : step });
  }
  return {
    prompt: "같은 수만큼 늘어나거나 줄어드는 규칙을 찾아 빈칸에 알맞은 수를 쓰세요.",
    visual: { kind: "number-sequences", rows: rows.map((row) => ({ items: row.items.map((value, index) => index === row.gap ? null : value) })) },
    answer: rows.map((row, index) => `(${index + 1}) ${row.items[row.gap]}`).join(", "),
    solution: rows.map((row, index) => `(${index + 1}) ${Math.abs(row.step)}씩 ${row.step > 0 ? "커지므로" : "작아지므로"} 빈칸은 ${row.items[row.gap]}입니다.`).join(" "),
    meta: { rows }
  };
}

function bookInterleavedNumberSequence({ difficulty = 2 }) {
  const strands = difficulty === 3 ? 3 : 2;
  const strandLength = difficulty === 1 ? 4 : 5;
  const rules = Array.from({ length: strands }, (_, index) => {
    const step = randomInt(2, difficulty === 3 ? 7 : 5) + index;
    return { start: randomInt(1, 8) + index, step };
  });
  const items = [];
  for (let round = 0; round < strandLength; round += 1) {
    for (const rule of rules) items.push(rule.start + rule.step * round);
  }
  const gaps = rules.map((_, strand) => (strandLength - randomInt(1, 2)) * strands + strand).sort((a, b) => a - b);
  return {
    prompt: `${strands}개의 수열이 번갈아 나오는 규칙을 찾아 빈칸에 알맞은 수를 쓰세요.`,
    visual: { kind: "number-sequences", rows: [{ items: items.map((value, index) => gaps.includes(index) ? null : value) }] },
    answer: gaps.map((gap, index) => `${["ㄱ", "ㄴ", "ㄷ"][index]}=${items[gap]}`).join(", "),
    solution: rules.map((rule, index) => `${index + 1}번째 수열은 ${rule.step}씩 커집니다.`).join(" ") + ` 따라서 빈칸은 ${gaps.map((gap) => items[gap]).join(", ")}입니다.`,
    meta: { strands, rules, items, gaps }
  };
}

function previousTwoSumSequence({ difficulty = 2 }) {
  const first = randomInt(1, difficulty === 3 ? 6 : 4);
  const second = randomInt(first + 1, difficulty === 3 ? 9 : 6);
  const length = difficulty === 1 ? 6 : 7;
  const items = [first, second];
  while (items.length < length) items.push(items.at(-1) + items.at(-2));
  const gap = difficulty === 1 ? length - 1 : randomInt(4, length - 1);
  return {
    prompt: "앞의 두 수를 더해 다음 수를 만드는 규칙입니다. 빈칸에 알맞은 수를 쓰세요.",
    visual: { kind: "number-sequences", rows: [{ items: items.map((value, index) => index === gap ? null : value) }] },
    answer: String(items[gap]),
    solution: `${withOf(items[gap - 2])} ${objectOf(items[gap - 1])} 더하면 ${items[gap]}이므로 빈칸은 ${items[gap]}입니다.`,
    meta: { items, gap }
  };
}

function repeatingNumberSequence({ difficulty = 2 }) {
  const size = difficulty === 1 ? 2 : difficulty === 3 ? 4 : 3;
  const pattern = shuffle(Array.from({ length: 9 }, (_, index) => index + 1)).slice(0, size);
  const length = size * 3;
  const items = Array.from({ length }, (_, index) => pattern[index % size]);
  const gap = randomInt(size + 1, length - 2);
  return {
    prompt: "반복마디를 찾아 빈칸에 알맞은 수를 쓰세요.",
    visual: { kind: "number-sequences", rows: [{ items: items.map((value, index) => index === gap ? null : value) }] },
    answer: String(items[gap]),
    solution: `${subjectOf(pattern.join(", "))} 한 반복마디입니다. 같은 자리의 수를 찾으면 ${items[gap]}입니다.`,
    meta: { pattern, items, gap }
  };
}

function repeatingSymbolSequence({ difficulty = 2 }) {
  const shapes = shuffle(["circle", "triangle", "square", "diamond", "star"]);
  const length = difficulty === 1 ? 2 : difficulty === 3 ? 4 : 3;
  const pattern = Array.from({ length }, (_, index) => ({
    shape: shapes[index],
    filled: difficulty === 1 ? index % 2 === 1 : Math.random() < 0.5,
    count: difficulty === 3 ? randomInt(1, 3) : 1
  }));
  const shown = Array.from({ length: length * 2 + 1 }, (_, index) => pattern[index % length]);
  const target = pattern[shown.length % length];
  const shapeNames = { circle: "동그라미", triangle: "세모", square: "네모", diamond: "마름모", star: "별" };
  const answer = `${target.filled ? "색칠한" : "색칠하지 않은"} ${shapeNames[target.shape]} ${target.count}개`;
  return {
    prompt: "모양·색·개수의 반복마디를 찾아 다음에 올 그림을 고르세요.",
    visual: { kind: "symbol-pattern-sequence", items: shown, target },
    answer,
    solution: `한 반복마디는 ${pattern.map((item) => `${item.filled ? "색칠한" : "빈"} ${shapeNames[item.shape]} ${item.count}개`).join(" → ")}입니다. 따라서 다음 그림은 ${answer}입니다.`,
    meta: { pattern, shown, target }
  };
}

function progressiveNumberTable({ difficulty = 2 }) {
  const rows = difficulty === 1 ? 1 : 2;
  const columns = difficulty === 3 ? 4 : 3;
  const base = randomInt(0, 5);
  const rowStep = randomInt(1, 4);
  const columnStep = randomInt(1, 4);
  const stageStep = randomInt(1, difficulty === 3 ? 5 : 3);
  const fullStages = Array.from({ length: 4 }, (_, stage) => Array.from({ length: rows }, (_, row) => Array.from({ length: columns }, (_, column) => base + row * rowStep + column * columnStep + stage * stageStep)));
  const targetRow = randomInt(0, rows - 1);
  const targetColumn = randomInt(0, columns - 1);
  const shownStages = fullStages.map((grid, stage) => grid.map((row, rowIndex) => row.map((value, column) => stage === 3 && rowIndex === targetRow && column === targetColumn ? null : value)));
  const answer = fullStages[3][targetRow][targetColumn];
  return {
    prompt: "단계가 바뀔 때마다 같은 규칙으로 수가 변합니다. 4단계 빈칸에 알맞은 수를 쓰세요.",
    visual: { kind: "progressive-number-table", stages: shownStages },
    answer: String(answer),
    solution: `다음 단계로 갈 때 같은 자리의 수가 ${stageStep}씩 커집니다. 따라서 빈칸은 ${answer}입니다.`,
    meta: { fullStages, targetRow, targetColumn, stageStep, answer }
  };
}

function matchstickSharedPolygonGrowth({ difficulty = 2 }) {
  const variant = Math.random() < 0.5 ? "square" : "house";
  const target = randomInt(difficulty === 1 ? 4 : difficulty === 2 ? 6 : 9, difficulty === 1 ? 6 : difficulty === 2 ? 9 : 13);
  const first = variant === "square" ? 4 : 5;
  const added = variant === "square" ? 3 : 4;
  const answer = first + added * (target - 1);
  return {
    prompt: `${variant === "square" ? "네모" : "집"} 모양을 옆으로 이어 붙였습니다. ${target}개를 만드는 데 필요한 성냥개비는 모두 몇 개입니까?`,
    visual: { kind: "book2-growth", subtype: "matchstick", variant, stages: [1, 2, 3], target },
    answer: `${answer}개`,
    solution: `처음에는 ${first}개가 필요하고 한 모양을 더 붙일 때마다 겹치는 변 하나를 함께 써서 ${added}개씩 늘어납니다. ${first}에서 ${added}개씩 ${target - 1}번 늘리면 ${answer}개입니다.`,
    meta: { variant, target, first, added, answer }
  };
}

const triangularNumber = (number) => (number * (number + 1)) / 2;

function triangularStoneGrowth({ difficulty = 2 }) {
  const target = randomInt(difficulty === 1 ? 3 : difficulty === 2 ? 5 : 7, difficulty === 1 ? 5 : difficulty === 2 ? 7 : 10);
  const side = target + 2;
  const white = triangularNumber(target - 1);
  const black = triangularNumber(side) - white;
  const difference = Math.abs(black - white);
  return {
    prompt: `삼각형 모양으로 놓은 ${target}번째 바둑돌에서 검은 돌과 흰 돌의 개수 차는 몇 개입니까?`,
    visual: { kind: "book2-growth", subtype: "triangle-stones", stages: [1, 2, 3, 4], target },
    answer: `${difference}개`,
    solution: `${target}번째에는 검은 돌 ${black}개, 흰 돌 ${white}개가 있으므로 차는 ${difference}개입니다.`,
    meta: { target, side, black, white, difference }
  };
}

function squareBorderStoneGrowth({ difficulty = 2 }) {
  const target = randomInt(difficulty === 1 ? 3 : difficulty === 2 ? 5 : 7, difficulty === 1 ? 5 : difficulty === 2 ? 7 : 9);
  const side = target + 1;
  const black = side <= 2 ? side * side : 4 * (side - 1);
  const white = Math.max(0, (side - 2) * (side - 2));
  const difference = Math.abs(black - white);
  const more = black === white ? "같습니다" : `${black > white ? "검은 돌" : "흰 돌"}이 ${difference}개 더 많습니다`;
  return {
    prompt: `네모 테두리 모양으로 놓은 ${target}번째 바둑돌에서 어느 색 돌이 몇 개 더 많습니까?`,
    visual: { kind: "book2-growth", subtype: "square-stones", stages: [1, 2, 3, 4], target },
    answer: more,
    solution: `${target}번째는 한 변이 ${side}개인 네모입니다. 검은 돌 ${black}개, 흰 돌 ${white}개이므로 ${more}.`,
    meta: { target, side, black, white, difference, more }
  };
}

function staircaseTileGrowth({ difficulty = 2 }) {
  const target = randomInt(difficulty === 1 ? 4 : difficulty === 2 ? 6 : 9, difficulty === 1 ? 6 : difficulty === 2 ? 9 : 12);
  const answer = triangularNumber(target);
  return {
    prompt: `계단 모양을 같은 규칙으로 늘려 갈 때 ${target}번째 모양의 타일은 모두 몇 개입니까?`,
    visual: { kind: "book2-growth", subtype: "staircase", stages: [1, 2, 3, 4], target },
    answer: `${answer}개`,
    solution: `1개부터 ${target}개까지 차례로 더하면 ${answer}개입니다.`,
    meta: { target, answer }
  };
}

function repeatedFoldCutCount({ difficulty = 2 }) {
  const folds = randomInt(difficulty === 1 ? 2 : difficulty === 2 ? 4 : 6, difficulty === 1 ? 4 : difficulty === 2 ? 6 : 9);
  const answer = 2 ** folds;
  return {
    prompt: `정사각형 종이를 계속 반으로 ${folds}번 접었습니다. 다시 펼쳐 접힌 선을 따라 모두 자르면 종이는 몇 장이 됩니까?`,
    visual: { kind: "book2-growth", subtype: "fold-cut", stages: [0, 1, 2, 3], target: folds },
    answer: `${answer}장`,
    solution: `한 번 접을 때마다 펼쳐서 자른 종이 수가 2배가 됩니다. 1장 → ${Array.from({ length: folds }, (_, index) => 2 ** (index + 1)).join("장 → ")}장이므로 ${answer}장입니다.`,
    meta: { folds, answer }
  };
}

function coloredTriangleGrowth({ difficulty = 2 }) {
  const target = randomInt(difficulty === 1 ? 3 : difficulty === 2 ? 5 : 7, difficulty === 1 ? 5 : difficulty === 2 ? 7 : 10);
  const blue = triangularNumber(target);
  const white = triangularNumber(target - 1);
  const difference = blue - white;
  return {
    prompt: `두 색 삼각형을 같은 규칙으로 늘려 갈 때 ${target}번째 모양에서 두 색의 개수 차는 몇 개입니까?`,
    visual: { kind: "book2-growth", subtype: "colored-triangle", stages: [1, 2, 3, 4], target },
    answer: `${difference}개`,
    solution: `색칠한 삼각형은 ${blue}개, 흰 삼각형은 ${white}개이므로 차는 ${difference}개입니다.`,
    meta: { target, blue, white, difference }
  };
}

function nestedCircleCount({ difficulty = 2 }) {
  const target = randomInt(difficulty === 1 ? 4 : difficulty === 2 ? 6 : 9, difficulty === 1 ? 6 : difficulty === 2 ? 9 : 12);
  const answer = triangularNumber(target);
  return {
    prompt: `원을 같은 규칙으로 겹쳐 그릴 때 ${target}번째 모양에서 찾을 수 있는 원은 모두 몇 개입니까?`,
    visual: { kind: "book2-growth", subtype: "nested-circles", stages: [1, 2, 3, 4], target },
    answer: `${answer}개`,
    solution: `${target}번째에는 1개, 2개, …, ${target}개인 원 묶음이 있으므로 모두 ${answer}개입니다.`,
    meta: { target, answer }
  };
}

function cubeSquareLayerGrowth({ difficulty = 2 }) {
  for (let attempt = 0; attempt < 300; attempt += 1) {
    const made = geometryWorksheetProblem("SQ", difficulty);
    if (!made || made.figures.patternKind !== "pyramid" || made.answer.mode !== "nth") continue;
    return {
      prompt: made.prompt,
      visual: { kind: "geometry-worksheet", figures: made.figures },
      answer: made.answerText,
      solution: `1층부터 ${made.answer.n}층까지 층마다 1개, 4개, 9개처럼 정사각형 수가 필요합니다. 모두 더하면 ${made.answer.count}개입니다.`,
      meta: { worksheetType: made.type, patternKind: made.figures.patternKind, ...made.answer }
    };
  }
  return null;
}

function growingSegmentCount({ difficulty = 2 }) {
  const target = randomInt(difficulty === 1 ? 4 : difficulty === 2 ? 6 : 9, difficulty === 1 ? 6 : difficulty === 2 ? 9 : 12);
  const answer = triangularNumber(target);
  return {
    prompt: `선분을 같은 규칙으로 늘려 갈 때 ${target}번째 모양의 선분은 모두 몇 개입니까?`,
    visual: { kind: "book2-growth", subtype: "segments", stages: [1, 2, 3, 4], target },
    answer: `${answer}개`,
    solution: `각 단계에서 선분이 1개, 2개, 3개처럼 늘어납니다. 1부터 ${target}까지 더하면 ${answer}개입니다.`,
    meta: { target, answer }
  };
}

function foldPunchDoubling({ difficulty = 2 }) {
  const folds = randomInt(difficulty === 1 ? 1 : difficulty === 2 ? 3 : 6, difficulty === 1 ? 3 : difficulty === 2 ? 5 : 9);
  const answer = 2 ** folds;
  return {
    prompt: `색종이를 계속 반으로 ${folds}번 접고 구멍을 1개 뚫었습니다. 모두 펼치면 구멍은 몇 개입니까?`,
    visual: { kind: "book2-growth", subtype: "fold-punch", stages: [0, 1, 2, 3], target: folds },
    answer: `${answer}개`,
    solution: `한 번 펼칠 때마다 구멍 수가 2배가 됩니다. 1개에서 ${folds}번 2배씩 늘어나므로 ${answer}개입니다.`,
    meta: { folds, answer }
  };
}

function fourNumberCenterRule({ difficulty = 2 }) {
  const family = difficulty === 1 ? "sum" : difficulty === 2 ? sample(["sum-minus", "opposite-difference"]) : "opposite-difference";
  const makeItem = () => {
    let outer;
    let center;
    do {
      outer = Array.from({ length: 4 }, () => randomInt(1, difficulty === 3 ? 15 : 9));
      const [top, right, bottom, left] = outer;
      if (family === "sum") center = top + right + bottom + left;
      if (family === "sum-minus") center = top + left + right - bottom;
      if (family === "opposite-difference") center = top + bottom - left - right;
    } while (center < 1 || center > 50);
    return { outer, center };
  };
  const items = Array.from({ length: 4 }, makeItem);
  const answer = items.at(-1).center;
  const ruleText = family === "sum"
    ? "바깥 네 수를 모두 더합니다"
    : family === "sum-minus"
      ? "위·왼쪽·오른쪽 수를 더한 뒤 아래 수를 뺍니다"
      : "위와 아래 수의 합에서 왼쪽과 오른쪽 수의 합을 뺍니다";
  return {
    prompt: "앞의 세 그림에서 바깥 수와 가운데 수 사이의 약속을 찾아, 마지막 그림의 가운데에 알맞은 수를 쓰세요.",
    visual: { kind: "center-number-rule", items: items.map((item, index) => ({ ...item, hidden: index === items.length - 1 })) },
    answer: String(answer),
    solution: `${ruleText}. 같은 약속으로 계산하면 ${answer}입니다.`,
    meta: { family, items, answer }
  };
}

function numberGridRowRule({ difficulty = 2 }) {
  const family = difficulty === 1 ? "sum" : difficulty === 2 ? sample(["sum", "minus-middle"]) : sample(["minus-middle", "minus-last"]);
  const makeRow = () => {
    let row;
    do {
      const a = randomInt(3, difficulty === 3 ? 20 : 12);
      const b = randomInt(1, difficulty === 3 ? 12 : 8);
      const c = randomInt(1, difficulty === 3 ? 12 : 8);
      const result = family === "sum" ? a + b + c : family === "minus-middle" ? a - b + c : a + b - c;
      row = [a, b, c, result];
    } while (row[3] < 1 || row[3] > 50);
    return row;
  };
  let rows;
  do {
    rows = Array.from({ length: 4 }, makeRow);
  } while (family !== "sum" && rows.slice(0, 3).every((row) => row[1] === row[2]));
  const blankColumn = difficulty === 1 ? 3 : randomInt(0, 3);
  const answer = rows[3][blankColumn];
  const shown = rows.map((row, rowIndex) => row.map((value, column) => rowIndex === 3 && column === blankColumn ? null : value));
  const ruleText = family === "sum" ? "앞의 세 수를 더하면 마지막 수가 됩니다" : family === "minus-middle" ? "첫째 수에서 둘째 수를 빼고 셋째 수를 더합니다" : "첫째 수와 둘째 수를 더하고 셋째 수를 뺍니다";
  return {
    prompt: "각 줄에 같은 계산 약속이 있습니다. 약속을 찾아 빈칸에 알맞은 수를 쓰세요.",
    visual: { kind: "number-rule-grid", rows: shown, blank: [3, blankColumn] },
    answer: String(answer),
    solution: `${ruleText}. 마지막 줄에도 같은 약속을 쓰면 빈칸은 ${answer}입니다.`,
    meta: { family, rows, blankColumn, answer }
  };
}

function twoDigitComposeRule({ difficulty = 2 }) {
  const operation = difficulty === 1 ? "subtract" : sample(["add", "subtract"]);
  const makeItem = () => {
    let first;
    let second;
    let result;
    do {
      first = randomInt(21, difficulty === 3 ? 89 : 69);
      second = randomInt(12, difficulty === 3 ? 78 : 59);
      if (operation === "subtract" && second > first) [first, second] = [second, first];
      result = operation === "add" ? first + second : first - second;
    } while (result < 5 || result > 99 || first % 10 === second % 10);
    return { first, second, result };
  };
  const items = Array.from({ length: 4 }, makeItem);
  let hidden = { item: 3, field: "result", digit: null };
  if (difficulty === 3) hidden = { item: 3, field: Math.random() < 0.5 ? "first" : "second", digit: randomInt(0, 1) };
  const targetItem = items[hidden.item];
  const answer = hidden.field === "result" ? targetItem.result : String(targetItem[hidden.field]).padStart(2, "0")[hidden.digit];
  return {
    prompt: `두 줄의 숫자로 각각 두 자리 수를 만드세요. 두 수를 ${operation === "add" ? "더하는" : "빼는"} 같은 약속으로 빈칸을 채우세요.`,
    visual: { kind: "two-digit-compose-rule", items, operation, hidden },
    answer: String(answer),
    solution: `마지막 그림의 두 수는 ${withOf(targetItem.first)} ${targetItem.second}입니다. ${targetItem.first} ${operation === "add" ? "+" : "−"} ${targetItem.second} = ${targetItem.result}이므로 빈칸은 ${answer}입니다.`,
    meta: { operation, items, hidden, answer }
  };
}

function countSudokuSolutions(grid, size, regions, limit = 2) {
  const working = grid.map((row) => [...row]);
  const regionAt = regions ? (row, column) => regions[row][column] : () => null;
  let count = 0;
  const choices = (row, column) => {
    const used = new Set(working[row]);
    for (let scan = 0; scan < size; scan += 1) used.add(working[scan][column]);
    if (regions) {
      const region = regionAt(row, column);
      for (let r = 0; r < size; r += 1) for (let c = 0; c < size; c += 1) if (regionAt(r, c) === region) used.add(working[r][c]);
    }
    return Array.from({ length: size }, (_, index) => index + 1).filter((value) => !used.has(value));
  };
  const search = () => {
    if (count >= limit) return;
    let target = null;
    let candidates = null;
    for (let row = 0; row < size; row += 1) {
      for (let column = 0; column < size; column += 1) {
        if (working[row][column]) continue;
        const next = choices(row, column);
        if (!next.length) return;
        if (!candidates || next.length < candidates.length) {
          target = [row, column];
          candidates = next;
        }
      }
    }
    if (!target) {
      count += 1;
      return;
    }
    const [row, column] = target;
    for (const value of candidates) {
      working[row][column] = value;
      search();
      working[row][column] = 0;
      if (count >= limit) return;
    }
  };
  search();
  return count;
}

function transformSudoku(solution, regions) {
  const size = solution.length;
  const turns = randomInt(0, 3);
  const mirrored = Math.random() < 0.5;
  const transformCell = (row, column) => {
    let r = row;
    let c = mirrored ? size - 1 - column : column;
    for (let turn = 0; turn < turns; turn += 1) [r, c] = [c, size - 1 - r];
    return [r, c];
  };
  const result = Array.from({ length: size }, () => Array(size).fill(0));
  const regionResult = regions ? Array.from({ length: size }, () => Array(size).fill(0)) : null;
  for (let row = 0; row < size; row += 1) {
    for (let column = 0; column < size; column += 1) {
      const [r, c] = transformCell(row, column);
      result[r][c] = solution[row][column];
      if (regions) regionResult[r][c] = regions[row][column];
    }
  }
  const digits = shuffle(Array.from({ length: size }, (_, index) => index + 1));
  return { solution: result.map((row) => row.map((value) => digits[value - 1])), regions: regionResult };
}

function makeSudoku({ size, regions = null, difficulty = 2, label }) {
  const base = size === 3
    ? [[1, 2, 3], [2, 3, 1], [3, 1, 2]]
    : [[1, 2, 3, 4], [3, 4, 1, 2], [2, 1, 4, 3], [4, 3, 2, 1]];
  const transformed = transformSudoku(base, regions);
  const solution = transformed.solution;
  const regionMap = transformed.regions;
  const desiredBlanks = size === 3
    ? (difficulty === 1 ? 3 : difficulty === 2 ? 4 : 5)
    : (difficulty === 1 ? 6 : difficulty === 2 ? 8 : 10);
  let puzzle = solution.map((row) => [...row]);
  const removed = [];
  for (const cell of shuffle(Array.from({ length: size * size }, (_, index) => index))) {
    if (removed.length >= desiredBlanks) break;
    const row = Math.floor(cell / size);
    const column = cell % size;
    const previous = puzzle[row][column];
    puzzle[row][column] = 0;
    if (countSudokuSolutions(puzzle, size, regionMap) === 1) removed.push([row, column]);
    else puzzle[row][column] = previous;
  }
  if (removed.length < Math.min(desiredBlanks, size === 3 ? 3 : 6)) return null;
  const target = sample(removed);
  const answer = solution[target[0]][target[1]];
  return {
    prompt: `1부터 ${size}까지의 수가 가로와 세로${regionMap ? ", 굵은 선으로 나눈 각 영역" : ""}에 한 번씩 들어가도록 빈칸을 채울 때, ㉠에 들어갈 수를 구하세요.`,
    visual: { kind: "sudoku-grid", size, grid: puzzle, regions: regionMap, target },
    answer: String(answer),
    solution: `가로와 세로${regionMap ? ", 굵은 선 안" : ""}에 같은 수가 겹치지 않게 채우면 ㉠은 ${answer}입니다.`,
    meta: { label, size, puzzle, solution, regions: regionMap, target, answer, solutionCount: countSudokuSolutions(puzzle, size, regionMap) }
  };
}

const SUDOKU_THREE_REGIONS = [[0, 0, 1], [2, 0, 1], [2, 2, 1]];
const SUDOKU_FOUR_SQUARE_REGIONS = [[0, 0, 1, 1], [0, 0, 1, 1], [2, 2, 3, 3], [2, 2, 3, 3]];
const SUDOKU_FOUR_IRREGULAR_REGIONS = [[0, 0, 0, 1], [2, 0, 1, 1], [2, 2, 3, 1], [2, 3, 3, 3]];

function sudokuThreeRowColumn({ difficulty = 2 }) {
  return makeSudoku({ size: 3, difficulty, label: "3x3-row-column" });
}

function sudokuThreeRegion({ difficulty = 2 }) {
  return makeSudoku({ size: 3, regions: SUDOKU_THREE_REGIONS, difficulty, label: "3x3-region" });
}

function sudokuFourSquareRegion({ difficulty = 2 }) {
  return makeSudoku({ size: 4, regions: SUDOKU_FOUR_SQUARE_REGIONS, difficulty, label: "4x4-square-region" });
}

function sudokuFourIrregularRegion({ difficulty = 2 }) {
  return makeSudoku({ size: 4, regions: SUDOKU_FOUR_IRREGULAR_REGIONS, difficulty, label: "4x4-irregular-region" });
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

function symbolChainArithmetic({ difficulty = 2 }) {
  const circle = difficulty === 1 ? randomInt(6, 9) : difficulty === 2 ? randomInt(12, 19) : randomInt(15, 19);
  const offset = difficulty === 1 ? randomInt(1, 2) : difficulty === 2 ? randomInt(1, 4) : randomInt(3, 6);
  const subtract = circle * 2 + offset;
  const heart = circle * 3;
  const club = heart + circle - subtract;
  const diamond = club * 2 - circle;
  const star = diamond + club - circle;
  const triangle = star + diamond - circle;
  const hard = difficulty === 3;
  const rows = [
    ["circle", "+", "circle", "+", "circle", "=", "heart"],
    ["heart", "+", "circle", "-", subtract, "=", "club"],
    ["club", "+", "club", "-", "circle", "=", "diamond"],
    ["diamond", "+", "club", "-", "circle", "=", "star"]
  ];
  if (hard) rows.push(["star", "+", "diamond", "-", "circle", "=", "triangle"]);
  const target = hard ? "triangle" : "star";
  const answer = hard ? triangle : star;
  const given = difficulty === 1 ? { circle, heart } : { circle };
  const steps = [`○ = ${circle}`, `♥ = ${circle} + ${circle} + ${circle} = ${heart}`];
  if (difficulty !== 1) steps.shift();
  steps.push(`♣ = ${heart} + ${circle} - ${subtract} = ${club}`);
  steps.push(`◆ = ${club} + ${club} - ${circle} = ${diamond}`);
  steps.push(`★ = ${diamond} + ${club} - ${circle} = ${star}`);
  if (hard) steps.push(`▲ = ${star} + ${diamond} - ${circle} = ${triangle}`);
  return {
    prompt: `${difficulty === 1 ? `○가 ${circle}, ♥가 ${heart}일 때` : `○가 ${circle}일 때`}, ${hard ? "▲" : "★"}는 얼마입니까?`,
    visual: { kind: "symbol-chain", rows, given, target },
    answer: String(answer),
    solution: steps.join(" → "),
    meta: { circle, heart, club, diamond, star, triangle: hard ? triangle : null, subtract, target, result: answer }
  };
}

function shapeMatrixThreeFeatures({ difficulty = 2 }) {
  const shapes = shuffle(["circle", "square", "triangle"]);
  const fills = shuffle(["hatch", "empty", "gray"]);
  const outerShift = randomInt(0, 2);
  const fillShift = randomInt(0, 2);
  const targets = difficulty === 3 ? [[1, 1], [2, 2]] : [[2, 2]];
  const isTarget = (row, column) => targets.some(([r, c]) => r === row && c === column);
  const cells = [];
  for (let row = 0; row < 3; row += 1) {
    for (let column = 0; column < 3; column += 1) {
      cells.push({
        row,
        column,
        outer: shapes[(row + column + outerShift) % 3],
        inner: shapes[(row + column + outerShift + 1) % 3],
        fill: fills[(column - row + fillShift + 6) % 3],
        missing: isTarget(row, column),
        hintOuter: difficulty === 1 && isTarget(row, column)
      });
    }
  }
  const shapeName = { circle: "동그라미", square: "네모", triangle: "세모" };
  const fillName = { hatch: "빗금 친", empty: "색칠하지 않은", gray: "회색으로 칠한" };
  const answers = cells.filter((cell) => cell.missing).map((cell) => `큰 ${shapeName[cell.outer]} 안의 ${fillName[cell.fill]} ${shapeName[cell.inner]}`);
  return {
    prompt: difficulty === 3 ? "도형의 규칙을 찾아 두 빈칸에 알맞은 모양을 그리세요." : "도형의 규칙을 찾아 빈칸에 알맞은 모양을 그리세요.",
    visual: { kind: "shape-matrix-three", cells },
    answerVisual: { kind: "shape-matrix-three", cells: cells.map((cell) => ({ ...cell, missing: false, hintOuter: false })) },
    answer: answers.join(" / "),
    solution: `각 가로줄과 세로줄에서 바깥 도형, 안쪽 도형, 칠하기가 한 번씩 나타납니다. 따라서 ${answers.join("이고, ")}입니다.`,
    meta: { cells, targets, answers }
  };
}

function trianglePositionCycle({ difficulty = 2 }) {
  const clockwise = randomInt(0, 1) === 0
    ? ["top", "bottom-right", "bottom-left"]
    : ["top", "bottom-left", "bottom-right"];
  const start = randomInt(0, 2);
  const outerCycle = [...clockwise.slice(start), ...clockwise.slice(0, start)];
  const cycle = [...outerCycle, "center"];
  const shown = difficulty === 1 ? 8 : difficulty === 2 ? 6 : 4;
  const target = difficulty === 1 ? randomInt(9, 12) : difficulty === 2 ? randomInt(12, 20) : randomInt(25, 40);
  const answerPosition = cycle[(target - 1) % cycle.length];
  const positionName = { top: "위쪽", "bottom-left": "왼쪽 아래", "bottom-right": "오른쪽 아래", center: "가운데" };
  return {
    prompt: `규칙을 찾아 ${target}번째 모양을 완성하세요.`,
    visual: { kind: "triangle-position-cycle", sequence: Array.from({ length: shown }, (_, index) => cycle[index % 4]), target },
    answerVisual: { kind: "triangle-position-answer", position: answerPosition },
    answer: `${positionName[answerPosition]} 삼각형`,
    solution: `칠한 곳은 ${cycle.map((position) => positionName[position]).join(" → ")}의 네 자리로 반복됩니다. ${target}번째는 ${positionName[answerPosition]} 삼각형을 칠합니다.`,
    meta: { cycle, shown, target, answerPosition }
  };
}

function triangleMaxEdgeSum({ difficulty = 2 }) {
  const start = difficulty === 3 ? randomInt(1, 2) : 1;
  const step = difficulty === 3 ? 2 : 1;
  const values = Array.from({ length: 6 }, (_, index) => start + index * step);
  const corners = shuffle(values.slice(3));
  const total = values.reduce((sum, value) => sum + value, 0);
  const sideSum = (total + corners.reduce((sum, value) => sum + value, 0)) / 3;
  const nodes = {
    top: corners[0],
    "bottom-left": corners[1],
    "bottom-right": corners[2]
  };
  nodes.left = sideSum - nodes.top - nodes["bottom-left"];
  nodes.right = sideSum - nodes.top - nodes["bottom-right"];
  nodes.bottom = sideSum - nodes["bottom-left"] - nodes["bottom-right"];
  const given = difficulty === 1 ? ["top"] : [];
  const arrangement = `위 ${nodes.top}, 왼쪽 가운데 ${nodes.left}, 왼쪽 아래 ${nodes["bottom-left"]}, 아래 가운데 ${nodes.bottom}, 오른쪽 아래 ${nodes["bottom-right"]}, 오른쪽 가운데 ${nodes.right}`;
  return {
    prompt: "주어진 여섯 수를 한 번씩 써서 세 변의 합이 모두 같게 만들 때, 한 변의 합이 가장 커지도록 빈칸을 채우세요.",
    visual: { kind: "triangle-max-sum", values, nodes, given },
    answerVisual: { kind: "triangle-max-sum", values, nodes, given: Object.keys(nodes), answerOnly: true },
    answer: `가능한 답: ${arrangement}`,
    solution: `가장 큰 세 수를 세 꼭짓점에 놓으면 한 변의 합이 가장 커집니다. 한 변의 합은 ${sideSum}이며, 가능한 배치 한 가지는 ${arrangement}입니다.`,
    meta: { values, nodes, sideSum }
  };
}

function overlappingNumberBonds({ difficulty = 2 }) {
  const partCount = difficulty === 3 ? 4 : 3;
  const parts = Array.from({ length: partCount }, (_, index) => randomInt(index === 0 ? 1 : 2, difficulty === 1 ? 6 : 8));
  const totals = parts.slice(0, -1).map((value, index) => value + parts[index + 1]);
  const shownParts = parts.map((value, index) => {
    if (difficulty === 3) return index === 0 ? String(value) : index === parts.length - 1 ? "star" : "blank";
    return index < 2 ? String(value) : "star";
  });
  const steps = [];
  let known = parts[0];
  const startIndex = difficulty === 3 ? 0 : 1;
  if (difficulty === 3) {
    for (let index = 0; index < totals.length; index += 1) {
      const next = totals[index] - known;
      steps.push(`${totals[index]} - ${known} = ${next}`);
      known = next;
    }
  } else {
    steps.push(`${totals[startIndex]} - ${parts[startIndex]} = ${parts[startIndex + 1]}`);
  }
  const answer = parts.at(-1);
  return {
    prompt: "가르기·모으기에서 위의 수는 아래 두 수를 모은 수입니다. ☆에 알맞은 수를 구하세요.",
    visual: { kind: "overlap-bonds", totals, shownParts, highlightShared: difficulty === 1 },
    answer: String(answer),
    solution: `${steps.join(" → ")}이므로 ☆은 ${answer}입니다.`,
    meta: { parts, totals, result: answer }
  };
}

function letterBlockMove({ difficulty = 2 }) {
  const exampleChars = sample([["소", "마"], ["나", "무"], ["하", "늘"], ["도", "형"]]);
  const targets = ["학", "꿈", "별", "빛", "힘", "봄"];
  const targetChars = difficulty === 3 ? shuffle(targets).slice(0, 2) : [sample(targets)];
  return {
    prompt: difficulty === 1
      ? "보기처럼 글자 블록을 왼쪽으로 1/4바퀴 돌린 뒤 좌우로 뒤집어 빈칸에 그리세요."
      : "보기와 같은 방법으로 글자 블록을 움직일 때, 빈칸에 알맞은 그림을 그리세요.",
    visual: { kind: "letter-block-transform", exampleChars, targetChars },
    answerVisual: { kind: "letter-block-transform-answer", chars: targetChars },
    answer: "왼쪽으로 1/4바퀴 돌린 뒤 좌우로 뒤집은 그림",
    solution: "보기의 글자 블록 전체를 왼쪽으로 1/4바퀴 돌린 다음 좌우로 뒤집습니다.",
    meta: { exampleChars, targetChars, operation: "rotate-ccw-then-flip-horizontal" }
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

function foldNumberCutSum({ difficulty = 2 }) {
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


// --- 파이널 3회 (2026-08-13) ---

function matchstickGrowth({ difficulty = 2 }) {
  // 파이널 3회 10번: 네모를 옆으로 이어 붙이면 맞닿는 변을 함께 쓰므로 3개씩만 늘어난다.
  // 네모 10개 = 4 + 3 x 9 = 31개가 원본 확정 답이다.
  const target = difficulty === 1 ? randomInt(4, 9) : difficulty === 2 ? 10 : randomInt(11, 25);
  return {
    prompt: `성냥개비로 그림과 같이 네모를 옆으로 이어 붙여 만들려고 합니다. 네모를 ${target}개 만들려면 성냥개비는 모두 몇 개 필요합니까?`,
    visual: { kind: "matchstick-row", shown: 3, target },
    answer: `${3 * target + 1}개`,
    solution: `첫 번째 네모는 성냥개비 4개로 만듭니다. 네모를 하나씩 더 붙일 때마다 맞닿는 변은 함께 쓰므로 3개씩만 더 필요합니다. 따라서 4 + 3 × ${target - 1} = ${3 * target + 1}개입니다.`,
    meta: { target }
  };
}

function neitherSetCount({ difficulty = 2 }) {
  // 파이널 3회 20번: 전체에서 '형 또는 누나가 있는 학생'을 빼면 둘 다 없는 학생이다.
  // 조사를 자동으로 붙이려다 "형을(를) 있는 학생" 같은 말이 나왔다. 문장을 통째로 적어 둔다.
  const PAIRS = [
    { total: "우리 반 학생", a: "형이 있는", b: "누나가 있는", both: "형과 누나가 모두 있는", neither: "형도 누나도 없는" },
    { total: "동아리 학생", a: "강아지를 기르는", b: "고양이를 기르는", both: "강아지와 고양이를 모두 기르는", neither: "강아지도 고양이도 기르지 않는" },
    { total: "체험학습에 간 학생", a: "김밥을 싸 온", b: "샌드위치를 싸 온", both: "김밥과 샌드위치를 모두 싸 온", neither: "김밥도 샌드위치도 싸 오지 않은" },
    { total: "도서관에 온 학생", a: "동화책을 빌린", b: "만화책을 빌린", both: "두 가지를 모두 빌린", neither: "아무것도 빌리지 않은" }
  ];
  const kinds = difficulty === 2 ? PAIRS[0] : sample(PAIRS);
  const total = difficulty === 1 ? randomInt(20, 30) : difficulty === 2 ? 40 : randomInt(35, 60);
  const both = difficulty === 1 ? randomInt(1, 3) : randomInt(2, 6);
  const aOnly = randomInt(both + 2, Math.floor(total / 2));
  const bOnly = randomInt(both + 1, Math.max(both + 2, Math.floor(total / 4)));
  const union = aOnly + bOnly - both;
  // 합집합이 전체를 넘으면 문제가 성립하지 않는다. 남는 학생이 최소 한 명은 있어야 한다.
  if (union >= total) return neitherSetCount({ difficulty });
  return {
    prompt: `${kinds.total} ${total}명 중 ${kinds.a} 학생은 ${aOnly}명, ${kinds.b} 학생은 ${bOnly}명입니다. ${kinds.both} 학생이 ${both}명일 때, ${kinds.neither} 학생은 몇 명입니까?`,
    answer: `${total - union}명`,
    solution: `둘 중 하나라도 해당하는 학생은 ${aOnly} + ${bOnly} - ${both} = ${union}명입니다. 전체 ${total}명에서 빼면 ${total - union}명입니다.`,
    meta: { total, aOnly, bOnly, both, union }
  };
}

function targetScoreCombination({ difficulty = 2 }) {
  // 파이널 3회 9번: 두 발이 같은 점수에 맞아도 되므로 합은 중복을 허용해 센다.
  // 연속된 점수만 쓰면 합의 가짓수가 늘 (개수 x 2 - 1)이라 문제가 한 가지로 굳는다.
  // 같음 난이도만 원본 과녁(1~5점)을 그대로 쓰고, 나머지는 점수를 흩어 놓는다.
  const pick = (count, max) => shuffle(Array.from({ length: max }, (_, k) => k + 1)).slice(0, count).sort((a, b) => a - b);
  const scores = difficulty === 2 ? [1, 2, 3, 4, 5] : pick(difficulty === 1 ? 3 : randomInt(4, 5), difficulty === 1 ? 6 : 12);
  const sums = new Set();
  for (const a of scores) for (const b of scores) sums.add(a + b);
  const sorted = [...sums].sort((a, b) => a - b);
  return {
    prompt: `그림과 같은 과녁에 화살을 두 번 쏘았습니다. 두 발 모두 과녁에 맞았을 때, 두 점수의 합으로 나올 수 있는 점수는 모두 몇 가지입니까? (같은 곳에 두 번 맞을 수도 있습니다.)`,
    visual: { kind: "target-board", scores },
    answer: `${sorted.length}가지`,
    solution: `가장 작은 합은 ${sorted[0]}점, 가장 큰 합은 ${sorted[sorted.length - 1]}점입니다. 나올 수 있는 합을 모두 쓰면 ${sorted.join(", ")}점으로 ${sorted.length}가지입니다.`,
    meta: { scores, sums: sorted }
  };
}

function mixedSequence({ difficulty = 2 }) {
  // 파이널 3회 17번: 한 문항 안에 서로 다른 규칙의 수열 셋이 들어간다.
  // 원본 수치는 확인되지 않아 구조(증가폭 증가 · 앞의 두 수의 합 · 두 수열 교대)만 맞춘다.
  const rows = [];

  const startA = randomInt(1, 6);
  const stepA = randomInt(1, 3);
  const growA = difficulty === 1 ? 1 : randomInt(1, 2);
  const seqA = [startA];
  for (let i = 0; i < 5; i += 1) seqA.push(seqA[i] + stepA + growA * i);
  rows.push({ items: seqA, gaps: [5], rule: `늘어나는 폭이 ${growA}씩 커집니다` });

  const seqB = [randomInt(1, 4), randomInt(2, 6)];
  for (let i = 0; i < 4; i += 1) seqB.push(seqB[seqB.length - 1] + seqB[seqB.length - 2]);
  rows.push({ items: seqB, gaps: [5], rule: "앞의 두 수를 더한 값이 다음 수입니다" });

  const oddStart = randomInt(2, 9);
  const oddStep = randomInt(1, 3);
  const evenStart = randomInt(10, 20);
  const evenStep = randomInt(1, 3);
  const seqC = [];
  for (let i = 0; i < 6; i += 1) {
    seqC.push(i % 2 === 0 ? oddStart + oddStep * (i / 2) : evenStart - evenStep * ((i - 1) / 2));
  }
  // 두 수열이 섞인 규칙은 빼는 쪽이 0 이하로 내려가면 어린 학생이 읽어 낼 수 없다.
  if (seqC.some((value) => value <= 0)) return mixedSequence({ difficulty });
  rows.push({ items: seqC, gaps: [5], rule: "홀수 번째와 짝수 번째가 각각 다른 규칙입니다" });

  const answers = rows.map((row) => row.items[row.gaps[0]]);
  return {
    prompt: "규칙을 찾아 빈칸에 알맞은 수를 각각 구하세요.",
    visual: { kind: "number-sequences", rows: rows.map((row) => ({ items: row.items.map((value, index) => (row.gaps.includes(index) ? null : value)) })) },
    answer: answers.map((value, index) => `(${index + 1}) ${value}`).join(", "),
    solution: rows.map((row, index) => `(${index + 1}) ${row.rule}. 따라서 ${answers[index]}입니다.`).join(" "),
    meta: { answers }
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

function triangleRowStoneDifference({ difficulty = 2 }) {
  // 파이널 3회 13번: 줄마다 한 개씩 늘려 홀수 줄은 검은 돌, 짝수 줄은 흰 돌을 놓는다.
  // 첫 줄 검은 돌 1개를 남기고 두 줄씩 묶으면 묶음마다 검은 돌이 1개씩 더 많다.
  const gap = difficulty === 1 ? randomInt(3, 5) : difficulty === 2 ? 8 : randomInt(9, 15);
  const rows = 2 * (gap - 1) + 1;
  let black = 0;
  let white = 0;
  for (let i = 1; i <= rows; i += 1) {
    if (i % 2 === 1) black += i;
    else white += i;
  }
  // 되돌아 세어 확인한다. 공식이 맞더라도 줄 수를 잘못 뒤집으면 여기서 걸린다.
  if (black - white !== gap) return null;
  return {
    prompt: `바둑돌을 그림과 같이 줄마다 한 개씩 늘려 놓았습니다. 검은 바둑돌이 흰 바둑돌보다 ${gap}개 더 많아지는 것은 몇 번째 줄까지 놓았을 때입니까?`,
    visual: { kind: "stone-triangle-rows", shown: 5 },
    answer: `${rows}번째 줄`,
    solution: `첫 줄의 검은 돌 1개를 남기고 둘째 줄부터 두 줄씩 묶으면 묶음마다 검은 돌이 1개씩 더 많습니다. 차가 ${gap}개가 되려면 묶음이 ${gap - 1}개 필요하므로 1 + 2 × ${gap - 1} = ${rows}번째 줄입니다.`,
    meta: { rows, black, white }
  };
}

function hasBatchim(word) {
  // 마지막 글자의 받침 유무. 한글 음절은 0xAC00부터 28개씩 묶여 있고 그 안에서 받침이 0이면 없다.
  const last = String(word).trim().slice(-1);
  if (/\d/.test(last)) return "013678".includes(last);
  const code = last.charCodeAt(0);
  if (code < 0xac00 || code > 0xd7a3) return false;
  return (code - 0xac00) % 28 !== 0;
}

// 이름을 무작위로 뽑으면 "예린는"·"서연가" 같은 말이 그대로 인쇄된다. 받침으로 골라 붙인다.
const topicOf = (name) => `${name}${hasBatchim(name) ? "은" : "는"}`;
const subjectOf = (name) => `${name}${hasBatchim(name) ? "이" : "가"}`;
const withOf = (name) => `${name}${hasBatchim(name) ? "과" : "와"}`;
const objectOf = (word) => `${word}${hasBatchim(word) ? "을" : "를"}`;

function rowColumnCountPlacement({ difficulty = 2 }) {
  // 파이널 3회 1번: 조건을 만족하는 여러 그림 중 하나를 그리는 문제다. 원본도 가능한 답이 여러 개다.
  const size = difficulty === 1 ? 3 : difficulty === 2 ? 4 : 5;
  const grid = Array.from({ length: size }, () => Array.from({ length: size }, () => (Math.random() < 0.55 ? 1 : 0)));
  const rows = grid.map((row) => row.reduce((a, b) => a + b, 0));
  const cols = Array.from({ length: size }, (_, c) => grid.reduce((sum, row) => sum + row[c], 0));
  // 개수가 0인 줄은 그 줄을 통째로 비우면 끝이라 문제가 되지 않는다.
  if (rows.some((n) => n === 0) || cols.some((n) => n === 0)) return null;
  // 같은 가로·세로 개수를 갖는 배치를 세어 조건이 너무 막연하지 않은 문제만 낸다.
  const rowChoices = rows.map((need) => {
    const list = [];
    for (let mask = 0; mask < (1 << size); mask += 1) {
      let bits = 0;
      for (let c = 0; c < size; c += 1) if (mask & (1 << c)) bits += 1;
      if (bits === need) list.push(mask);
    }
    return list;
  });
  let solutions = 0;
  const solutionCap = difficulty === 1 ? 8 : difficulty === 2 ? 25 : 60;
  const walk = (index, colUsed) => {
    if (solutions > solutionCap) return;
    if (index === size) {
      if (colUsed.every((n, c) => n === cols[c])) solutions += 1;
      return;
    }
    for (const mask of rowChoices[index]) {
      const next = colUsed.slice();
      let ok = true;
      for (let c = 0; c < size; c += 1) {
        if (mask & (1 << c)) next[c] += 1;
        if (next[c] > cols[c]) ok = false;
      }
      if (ok) walk(index + 1, next);
    }
  };
  walk(0, Array(size).fill(0));
  const minSolutions = difficulty === 1 ? 1 : 2;
  if (solutions < minSolutions || solutions > solutionCap) return null;
  return {
    prompt: "오른쪽과 아래에 쓰인 수는 그 줄에 있는 ★의 개수입니다. 조건에 맞게 빈칸에 ★을 그려 넣으세요.",
    visual: { kind: "count-placement-grid", size, rows, cols },
    answer: grid.map((row) => row.map((cell) => (cell ? "★" : "·")).join("")).join(" / "),
    solution: "각 가로줄과 세로줄의 별 개수를 차례로 확인하며 그립니다. 제시한 그림은 조건을 만족하는 답의 한 예입니다.",
    meta: { grid, rows, cols, solutions }
  };
}

function truthLieRanking({ difficulty = 2 }) {
  // 파이널 3회 2번: 거짓말한 사람을 지문에서 지정한다. 순서가 하나로 안 정해져도
  // 묻는 사람의 등수는 하나여야 한다(원본도 B·C가 거짓말하고 E의 등수는 3등 하나였다).
  // 같은 문제를 여러 장 만들 때 답을 찍지 못하도록, 가능한 두 순서에서 등수가 같은 사람 중 한 명을 묻는다.
  // 가·나·다로 부르면 "나: 가는 나보다 바로 뒤에" 처럼 이름 '나'와 대명사 '나'가 겹쳐 읽을 수 없다.
  const NAMES = shuffle(["지호", "서연", "민준", "하은", "도현", "예린", "시우"]);
  const people = NAMES.slice(0, difficulty === 1 ? 4 : difficulty === 2 ? 5 : 6);
  const liars = difficulty === 1 ? 1 : 2;
  const rankOf = (order, name) => order.indexOf(name) + 1;
  if (difficulty === 2) {
    const [a, b, c, d, e] = people;
    const liarNames = [b, c];
    const claims = [
      { speaker: a, text: `${a}: 나는 1등도 2등도 아니야.`, holds: (o) => rankOf(o, a) > 2 },
      { speaker: b, text: `${b}: 나는 1등도 2등도 아니야.`, holds: (o) => rankOf(o, b) > 2 },
      { speaker: c, text: `${c}: 나는 3등 또는 4등이야.`, holds: (o) => [3, 4].includes(rankOf(o, c)) },
      { speaker: d, text: `${d}: 나는 ${withOf(a)} ${b}보다 늦게 들어왔어.`, holds: (o) => rankOf(o, d) > rankOf(o, a) && rankOf(o, d) > rankOf(o, b) },
      { speaker: e, text: `${e}: 나는 ${c}보다 늦었지만 ${a}보다는 빨리 들어왔어.`, holds: (o) => rankOf(o, e) > rankOf(o, c) && rankOf(o, e) < rankOf(o, a) }
    ];
    const liarSet = new Set(liarNames);
    const orders = permutations(people).filter((order) => claims.every(({ speaker, holds }) => holds(order) === !liarSet.has(speaker)));
    const settled = [e, a, d].filter((name) => new Set(orders.map((order) => rankOf(order, name))).size === 1);
    if (!orders.length || !settled.length) return null;
    const target = sample(settled);
    const rank = rankOf(orders[0], target);
    const liarSubject = `${withOf(b)} ${subjectOf(c)}`;
    return {
      prompt: `${people.length}명이 달리기를 했습니다. 달리기가 끝난 뒤 ${liarSubject} 거짓말을 했고, 다른 사람은 참말을 했습니다. ${topicOf(target)} 몇 등입니까?`,
      visual: { kind: "statement-list", items: claims.map(({ text }) => text) },
      answer: `${rank}등`,
      solution: `${topicOf(b)} 1등이나 2등이고 ${topicOf(c)} 3등과 4등이 아닙니다. 다른 세 사람의 참말을 차례로 적용하면 ${topicOf(target)} 항상 ${rank}등입니다.`,
      meta: { rank, target, liars: liarNames, people, orders: orders.length, template: "final-3-q2" }
    };
  }
  const truth = shuffle(people.slice());
  const liarSet = new Set(shuffle(people.slice()).slice(0, liars));
  // 약한 말(1등이 아니다 · 먼저 들어왔다)만 쓰면 조건을 만족하는 순서가 중앙값 48가지나 남아
  // 누구의 등수도 하나로 정해지지 않았다. 등수를 콕 집는 말을 섞어야 순서가 좁혀진다.
  // form은 검산기가 말의 뜻을 글자 그대로 다시 세울 수 있게 남기는 값이다.
  const CLAIMS = [
    (a, b, n) => ({ text: `${a}: 나는 ${n}등이야.`, form: { kind: "rank", a, n }, holds: (o) => rankOf(o, a) === n }),
    (a, b, n) => ({ text: `${a}: 나는 ${n}등이야.`, form: { kind: "rank", a, n }, holds: (o) => rankOf(o, a) === n }),
    (a, b) => ({ text: `${a}: ${topicOf(b)} 나보다 바로 뒤에 들어왔어.`, form: { kind: "next", a, b }, holds: (o) => rankOf(o, b) === rankOf(o, a) + 1 }),
    (a, b) => ({ text: `${a}: 나는 ${b}보다 먼저 들어왔어.`, form: { kind: "before", a, b }, holds: (o) => rankOf(o, a) < rankOf(o, b) }),
    (a) => ({ text: `${a}: 나는 1등이 아니야.`, form: { kind: "notFirst", a }, holds: (o) => rankOf(o, a) !== 1 })
  ];
  // 아무 말이나 만들면 조건을 만족하는 순서가 아예 없는 경우가 대부분이었다(3,000번에 18번 성공).
  // 실제 순서를 먼저 정하고, 거짓말할 사람은 그 순서에서 틀린 말을, 나머지는 맞는 말을 하게 만든다.
  const claims = [];
  for (const name of people) {
    const wantTrue = !liarSet.has(name);
    let made = null;
    for (let attempt = 0; attempt < 40 && !made; attempt += 1) {
      const other = sample(people.filter((p) => p !== name));
      const claim = sample(CLAIMS)(name, other, randomInt(1, people.length));
      if (claim.holds(truth) === wantTrue) made = claim;
    }
    if (!made) return null;
    claims.push({ speaker: name, claim: made });
  }
  // 지문에서 지정한 사람의 말만 거짓이고 나머지 사람의 말은 참인 순서를 전부 찾는다.
  const orders = permutations(people).filter((order) => claims.every(({ speaker, claim }) => claim.holds(order) === !liarSet.has(speaker)));
  if (!orders.length) return null;
  // 순서가 여러 가지여도 등수가 하나로 정해지는 사람만 묻는다(원본도 순서는 두 가지였다).
  const settled = people.filter((name) => new Set(orders.map((order) => rankOf(order, name))).size === 1);
  if (!settled.length) return null;
  const target = sample(settled);
  const rank = rankOf(orders[0], target);
  const liarNames = people.filter((name) => liarSet.has(name));
  const liarSubject = liarNames.length === 1 ? subjectOf(liarNames[0]) : `${withOf(liarNames[0])} ${subjectOf(liarNames[1])}`;
  return {
    prompt: `${people.length}명이 달리기를 했습니다. 달리기가 끝난 뒤 ${liarSubject} 거짓말을 했고, 다른 사람은 참말을 했습니다. ${topicOf(target)} 몇 등입니까?`,
    visual: { kind: "statement-list", items: claims.map(({ claim }) => claim.text) },
    answer: `${rank}등`,
    solution: `${liarSubject} 한 말은 반대로, 다른 사람의 말은 그대로 적용해 가능한 순서를 찾습니다. 가능한 순서에서 ${topicOf(target)} 항상 ${rank}등입니다.`,
    meta: { rank, target, liars: liarNames, people, orders: orders.length, claims: claims.map(({ speaker, claim }) => ({ speaker, ...claim.form })) }
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
  const kinds = sample(ITEMS);
  // 반을 다시 반으로 나누므로 한 사람 몫은 짝수여야 한다.
  const each = difficulty === 1 ? 2 * randomInt(1, 4) : difficulty === 2 ? 2 * randomInt(2, 6) : 2 * randomInt(3, 14);
  const gap = each;
  return {
    prompt: `${withOf(kinds.a)} ${subjectOf(kinds.b)} ${objectOf(kinds.thing)} 똑같이 나누어 가졌습니다. 그런데 ${subjectOf(kinds.a)} 자기가 가진 ${kinds.thing}의 반을 ${kinds.b}에게 주었더니 두 사람이 가진 ${kinds.thing} 수의 차이는 ${gap}${kinds.counter}입니다. 처음에 있던 ${topicOf(kinds.thing)} 모두 몇 ${kinds.counter}입니까?`,
    answer: `${each * 2}${kinds.counter}`,
    solution: `${subjectOf(kinds.a)} 반을 주면 ${topicOf(kinds.a)} 처음의 반, ${topicOf(kinds.b)} 처음의 한 배 반을 가지므로 차는 처음 한 사람 몫과 같습니다. 따라서 한 사람이 ${gap}${kinds.counter}씩 가졌고 처음에는 모두 ${each * 2}${kinds.counter}${hasBatchim(kinds.counter) ? "이었습니다" : "였습니다"}.`,
    meta: { each, gap }
  };
}

function sevenPeopleOrder({ difficulty = 2 }) {
  // 파이널 3회 7번: 가운데 사람, 두 사람 사이, 앞뒤 인원 비교를 함께 사용해 자리를 찾는다.
  const NAMES = shuffle(["윤정희", "준우", "민서", "하율", "도현", "서아", "지훈", "예린", "시우"]);
  const total = difficulty === 1 ? 5 : difficulty === 2 ? 7 : 9;
  const people = NAMES.slice(0, total);
  const [anchor, target] = people;
  const anchorPos = (total + 1) / 2;
  const between = difficulty === 1 ? 1 : difficulty === 2 ? randomInt(1, 2) : randomInt(1, 3);
  const side = sample([-1, 1]);
  const targetPos = anchorPos + side * (between + 1);
  const conditions = [
    `${anchor}보다 앞에 있는 학생 수와 뒤에 있는 학생 수는 같습니다.`,
    `${withOf(anchor)} ${target} 사이에는 학생이 ${between}명 있습니다.`,
    side > 0
      ? `${target}보다 앞에 있는 학생 수가 뒤에 있는 학생 수보다 많습니다.`
      : `${target}보다 뒤에 있는 학생 수가 앞에 있는 학생 수보다 많습니다.`
  ];
  // 조건을 만족하는 자리 배치를 전부 확인해 묻는 사람의 자리가 하나인지 본다.
  const seats = [];
  for (let p = 1; p <= total; p += 1) {
    if (p === anchorPos) continue;
    const sameGap = Math.abs(p - anchorPos) - 1 === between;
    const sameSide = side > 0 ? p - 1 > total - p : total - p > p - 1;
    if (sameGap && sameSide) seats.push(p);
  }
  if (seats.length !== 1 || seats[0] !== targetPos) return null;
  return {
    prompt: `${total}명이 한 줄로 서 있습니다. ${topicOf(target)} 앞에서 몇 번째에 서 있습니까?`,
    visual: { kind: "statement-list", items: conditions },
    answer: `앞에서 ${targetPos}번째`,
    solution: `${anchor}보다 앞뒤에 있는 학생 수가 같으므로 ${topicOf(anchor)} 가운데인 ${anchorPos}번째입니다. 두 사람 사이의 학생 수와 앞뒤 인원 비교를 함께 적용하면 ${topicOf(target)} 앞에서 ${targetPos}번째입니다.`,
    meta: { total, anchorPos, between, targetPos, side }
  };
}

function vertexDegreeSum({ difficulty = 2 }) {
  // 파이널 3회 11번: 불규칙하게 놓인 원을 가로·세로·대각선으로 연결한다. 같음 난이도는 원본처럼 9점에 비슷한 수의 선을 쓴다.
  const basePoints = [
    { x: 45, y: 24 }, { x: 145, y: 18 }, { x: 18, y: 76 }, { x: 75, y: 78 }, { x: 125, y: 74 },
    { x: 195, y: 55 }, { x: 55, y: 132 }, { x: 125, y: 132 }, { x: 178, y: 108 }, { x: 215, y: 145 }
  ];
  const pointCount = difficulty === 1 ? 7 : difficulty === 2 ? 9 : 10;
  const points = basePoints.slice(0, pointCount).map((point) => ({
    x: point.x + randomInt(-5, 5),
    y: point.y + randomInt(-5, 5)
  }));
  const all = [];
  points.forEach((p, i) => points.forEach((q, j) => {
    if (j <= i) return;
    const distance = Math.hypot(p.x - q.x, p.y - q.y);
    if (distance <= (difficulty === 3 ? 135 : 125)) all.push([i, j]);
  }));
  // 먼저 모든 점을 가장 가까운 앞쪽 점과 이어 연결된 뼈대를 만든 뒤 나머지 선을 채운다.
  const edges = [];
  const used = new Set();
  const addEdge = (a, b) => {
    const edge = a < b ? [a, b] : [b, a];
    const key = edge.join("-");
    if (!used.has(key)) { used.add(key); edges.push(edge); }
  };
  for (let i = 1; i < points.length; i += 1) {
    let closest = 0;
    for (let j = 1; j < i; j += 1) {
      const current = Math.hypot(points[i].x - points[j].x, points[i].y - points[j].y);
      const best = Math.hypot(points[i].x - points[closest].x, points[i].y - points[closest].y);
      if (current < best) closest = j;
    }
    addEdge(i, closest);
  }
  const want = difficulty === 1 ? randomInt(9, 11) : difficulty === 2 ? randomInt(15, 18) : randomInt(21, 24);
  shuffle(all).forEach(([a, b]) => { if (edges.length < want) addEdge(a, b); });
  if (edges.length !== want) return null;
  // 외톨이 점이 있으면 "각 점에 연결된 선의 수"를 묻는 그림으로 어색하다.
  const degree = points.map(() => 0);
  edges.forEach(([i, j]) => { degree[i] += 1; degree[j] += 1; });
  if (degree.some((d) => d === 0)) return null;
  const sum = degree.reduce((a, b) => a + b, 0);
  if (sum !== edges.length * 2) return null;
  return {
    prompt: "그림의 각 점에 연결된 선의 개수를 세어 모두 더하면 얼마입니까?",
    visual: { kind: "vertex-degree", edges, points },
    answer: `${sum}`,
    solution: `선은 모두 ${edges.length}개입니다. 선 하나마다 양쪽 끝점에서 한 번씩 세므로 합은 ${edges.length} × 2 = ${sum}입니다.`,
    meta: { edges: edges.length, sum, degree }
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

function geometryWorksheetProblem(typeCode, difficulty) {
  const worksheet = globalThis.GW_GEN;
  if (!worksheet) return null;
  const level = difficulty === 1 ? "easy" : difficulty === 3 ? "hard" : "mid";
  const rng = worksheet.createRng(`QB:${typeCode}:${level}:${Math.random()}`);
  return worksheet.make(typeCode, rng, level);
}

function cubeStepSequence({ difficulty = 2 }) {
  const made = geometryWorksheetProblem("TS", difficulty);
  if (!made) return null;
  return {
    prompt: made.prompt,
    visual: { kind: "geometry-worksheet", figures: made.figures },
    answer: made.answerText,
    solution: `${made.answer.stageTotals.map((total, index) => `${index + 1}단계 ${total}개`).join(" → ")}이므로 답은 ${made.answerText}입니다.`,
    meta: { worksheetType: made.type, ...made.answer }
  };
}

function cubeFillBoxWorksheet({ difficulty = 2 }) {
  let made = null;
  for (let attempt = 0; attempt < 100; attempt += 1) {
    const candidate = geometryWorksheetProblem("CU", difficulty);
    if (!candidate) return null;
    const sourceLikeActual = difficulty !== 2 || (candidate.answer.placed >= 6 && candidate.answer.placed <= 12);
    if (sourceLikeActual) {
      made = candidate;
      break;
    }
  }
  if (!made) return null;
  return {
    prompt: "다음과 같은 상자 안에 쌓기나무를 가득 채우려고 합니다. 몇 개의 쌓기나무가 더 필요합니까?",
    visual: { kind: "geometry-worksheet", figures: made.figures },
    answer: made.answerText,
    solution: `상자를 가득 채우면 ${made.answer.total}개이고 지금 ${made.answer.placed}개가 있으므로 ${made.answer.total} - ${made.answer.placed} = ${made.answer.need}개가 더 필요합니다.`,
    meta: { worksheetType: made.type, ...made.answer }
  };
}

function cubeHiddenCountWalled({ difficulty = 2 }) {
  const made = geometryWorksheetProblem("IH", difficulty);
  if (!made) return null;
  return {
    prompt: made.prompt,
    visual: { kind: "geometry-worksheet", figures: made.figures },
    answer: made.answerText,
    solution: `전체 ${made.answer.total}개 중 벽 앞에서 보이는 ${made.answer.visible}개를 빼면 ${made.answer.total} - ${made.answer.visible} = ${made.answer.hidden}개입니다.`,
    meta: { worksheetType: made.type, ...made.answer }
  };
}

export const GENERATORS = {
  equalPartitionTwo,
  equalPartitionThree,
  equalPartitionFour,
  reverseTransferTotal,
  balanceOrderChain,
  balanceGivenUnitWeight,
  distinctShapeValueEquation,
  constantStepNumberSequence,
  bookInterleavedNumberSequence,
  previousTwoSumSequence,
  repeatingNumberSequence,
  repeatingSymbolSequence,
  progressiveNumberTable,
  matchstickSharedPolygonGrowth,
  triangularStoneGrowth,
  squareBorderStoneGrowth,
  staircaseTileGrowth,
  repeatedFoldCutCount,
  coloredTriangleGrowth,
  nestedCircleCount,
  cubeSquareLayerGrowth,
  growingSegmentCount,
  foldPunchDoubling,
  fourNumberCenterRule,
  numberGridRowRule,
  twoDigitComposeRule,
  sudokuThreeRowColumn,
  sudokuThreeRegion,
  sudokuFourSquareRegion,
  sudokuFourIrregularRegion,
  cubeStepSequence,
  cubeFillBoxWorksheet,
  cubeHiddenCountWalled,
  rowColumnCountPlacement,
  truthLieRanking,
  halfGiveReverse,
  sevenPeopleOrder,
  vertexDegreeSum,
  squareCountShape,
  matchstickGrowth,
  neitherSetCount,
  targetScoreCombination,
  mixedSequence,
  borderGoStoneDifference,
  triangleRowStoneDifference,
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
  verticalCryptarithmShapeSum,
  foldNumberRemainingSum,
  foldNumberCutSum,
  foldDiagonalNumberSum,
  foldTargetSumColoring,
  foldCutPieceCount,
  foldPunchShapeCount,
  foldStackFind,
  foldStackOrder,
  foldCutShapeChoice,
  triangleSumPlacement,
  twoByTwoSumFill,
  shapeSumGrid,
  edgeSumCycle,
  equalizeTransfer,
  numberPyramid,
  raceOrder,
  discNumberRule,
  shapeSumTable,
  shapeRepeatOrdinal,
  repeatShapeSequence,
  arrowNumberGrid,
  numberCardEquation,
  busPassengers,
  sourceNonadjacentPyramid,
  sourceGoStoneDifference,
  sourceColoredShapeNumber,
  sourceSymbolRelations,
  symbolChainArithmetic,
  shapeMatrixThreeFeatures,
  trianglePositionCycle,
  triangleMaxEdgeSum,
  overlappingNumberBonds,
  letterBlockMove,
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
