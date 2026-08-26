// 더클래식 1과정 7권 전용 생성기.
// 교재의 인쇄 문제 번호별 풀이 구조를 유지하며 숫자와 맥락만 안전하게 바꾼다.

const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const sample = (items) => items[randomInt(0, items.length - 1)];
const sum = (items) => items.reduce((total, value) => total + value, 0);
const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];
const MONTH_DAYS = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

function shuffle(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = randomInt(0, index);
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

function gcd(first, second) {
  let a = Math.abs(first);
  let b = Math.abs(second);
  while (b) [a, b] = [b, a % b];
  return a || 1;
}

const lcm = (first, second) => Math.abs(first * second) / gcd(first, second);
const pad2 = (value) => String(value).padStart(2, "0");
const mod = (value, divisor) => ((value % divisor) + divisor) % divisor;
const isPalindrome = (value) => String(value) === [...String(value)].reverse().join("");

function dateSerial(month, date, leap = false) {
  const days = [...MONTH_DAYS];
  if (leap) days[1] = 29;
  return days.slice(0, month - 1).reduce((total, value) => total + value, 0) + date;
}

function clockParts(totalMinutes) {
  const normalized = mod(totalMinutes, 12 * 60);
  const hour = normalized === 0 ? 12 : Math.floor(normalized / 60) || 12;
  return { hour, minute: normalized % 60, total: normalized };
}

function clockText(totalMinutes) {
  const { hour, minute } = clockParts(totalMinutes);
  return `${hour}시 ${minute}분`;
}

function book7Problem({ prompt, subtype, visual = {}, answer, solution, family, meta = {} }) {
  return {
    prompt,
    visual: { kind: "book7", subtype, ...visual },
    answer: String(answer),
    solution,
    meta: { family, answer, ...meta }
  };
}

function calendarMonthShiftWeekdayBook7({ difficulty = 2 }) {
  const month = randomInt(1, 11);
  const sourceDate = randomInt(1, Math.min(MONTH_DAYS[month - 1], MONTH_DAYS[month]) - 1);
  const sourceWeekday = randomInt(0, 6);
  const shift = MONTH_DAYS[month - 1] % 7;
  const targetWeekday = mod(sourceWeekday + shift, 7);
  const askFirst = difficulty === 1 || Math.random() < 0.45;
  const shownDate = askFirst ? 1 : sourceDate;
  return book7Problem({
    prompt: `${month}월 ${shownDate}일은 ${WEEKDAYS[sourceWeekday]}요일입니다. ${month + 1}월 ${shownDate}일은 무슨 요일인가요?`,
    subtype: "calendar-path",
    visual: { dates: [{ month, date: shownDate, weekday: WEEKDAYS[sourceWeekday] }, { month: month + 1, date: shownDate, weekday: "?" }], shifts: [MONTH_DAYS[month - 1]] },
    answer: `${WEEKDAYS[targetWeekday]}요일`,
    solution: `${month}월은 ${MONTH_DAYS[month - 1]}일까지이고, ${MONTH_DAYS[month - 1]}을 7로 나눈 나머지는 ${shift}입니다. ${WEEKDAYS[sourceWeekday]}요일에서 ${shift}칸 옮기면 ${WEEKDAYS[targetWeekday]}요일입니다.`,
    family: "calendar-month-shift",
    meta: { month, sourceDate: shownDate, sourceWeekday, shift, targetWeekday }
  });
}

function calendarCrossMonthKnownWeekday({ difficulty = 2 }) {
  const startMonth = randomInt(1, difficulty === 3 ? 9 : 10);
  const monthGap = randomInt(difficulty === 1 ? 1 : 2, difficulty === 3 ? 3 : 2);
  const targetMonth = startMonth + monthGap;
  const startDate = randomInt(1, MONTH_DAYS[startMonth - 1] - 4);
  const targetDate = randomInt(1, MONTH_DAYS[targetMonth - 1] - 2);
  const startWeekday = randomInt(0, 6);
  const elapsed = dateSerial(targetMonth, targetDate) - dateSerial(startMonth, startDate);
  const targetWeekday = mod(startWeekday + elapsed, 7);
  return book7Problem({
    prompt: `어느 해 ${startMonth}월 ${startDate}일은 ${WEEKDAYS[startWeekday]}요일입니다. 같은 해 ${targetMonth}월 ${targetDate}일은 무슨 요일인가요?`,
    subtype: "calendar-path",
    visual: { dates: [{ month: startMonth, date: startDate, weekday: WEEKDAYS[startWeekday] }, { month: targetMonth, date: targetDate, weekday: "?" }], shifts: [elapsed] },
    answer: `${WEEKDAYS[targetWeekday]}요일`,
    solution: `두 날짜 사이에는 ${elapsed}일이 있습니다. ${elapsed}을 7로 나눈 나머지만큼 옮기면 ${WEEKDAYS[targetWeekday]}요일입니다.`,
    family: "calendar-cross-month",
    meta: { startMonth, startDate, targetMonth, targetDate, startWeekday, elapsed, targetWeekday, leap: false }
  });
}

function weekdayAfterDaysBook7({ difficulty = 2 }) {
  const weekday = randomInt(0, 6);
  const days = randomInt(difficulty === 1 ? 8 : 15, difficulty === 3 ? 90 : 45);
  const targetWeekday = mod(weekday + days, 7);
  return book7Problem({
    prompt: `오늘은 ${WEEKDAYS[weekday]}요일입니다. 오늘부터 ${days}일 후는 무슨 요일인가요?`,
    subtype: "weekday-ring", visual: { start: WEEKDAYS[weekday], days, target: "?" },
    answer: `${WEEKDAYS[targetWeekday]}요일`,
    solution: `${days}을 7로 나눈 나머지는 ${days % 7}입니다. ${WEEKDAYS[weekday]}요일에서 ${days % 7}칸 옮기면 ${WEEKDAYS[targetWeekday]}요일입니다.`,
    family: "weekday-after-days", meta: { weekday, days, targetWeekday }
  });
}

function timeUnitConversionBook7({ difficulty = 2 }) {
  const modes = difficulty === 1 ? ["day-hour", "hour-minute", "minute-second"] : ["day-hour", "hour-minute", "minute-second", "minute-hour"];
  const mode = sample(modes);
  let source;
  let answer;
  let fromUnit;
  let toUnit;
  let factor;
  if (mode === "day-hour") [source, factor, fromUnit, toUnit] = [randomInt(2, 5), 24, "일", "시간"];
  if (mode === "hour-minute") [source, factor, fromUnit, toUnit] = [randomInt(2, 9), 60, "시간", "분"];
  if (mode === "minute-second") [source, factor, fromUnit, toUnit] = [randomInt(2, 12), 60, "분", "초"];
  if (mode === "minute-hour") [source, factor, fromUnit, toUnit] = [randomInt(2, 9) * 60, 1 / 60, "분", "시간"];
  answer = source * factor;
  return book7Problem({
    prompt: `${source}${fromUnit}은 몇 ${toUnit}인가요?`, subtype: "time-equation",
    visual: { expression: `${source}${fromUnit} = □${toUnit}` }, answer: `${answer}${toUnit}`,
    solution: mode === "minute-hour" ? `${source}÷60=${answer}이므로 ${answer}${toUnit}입니다.` : `${source}×${factor}=${answer}이므로 ${answer}${toUnit}입니다.`,
    family: "time-conversion", meta: { mode, source, factor, result: answer }
  });
}

function analogClockReadingBook7({ difficulty = 2 }) {
  const hour = randomInt(1, 12);
  const minuteStep = difficulty === 1 ? 5 : difficulty === 2 ? sample([1, 5]) : 1;
  const minute = minuteStep === 5 ? randomInt(0, 11) * 5 : randomInt(1, 59);
  const total = (hour % 12) * 60 + minute;
  return book7Problem({
    prompt: "시계가 나타내는 시각을 쓰세요.", subtype: "clock",
    visual: { clocks: [{ total, label: "시각" }] }, answer: clockText(total),
    solution: `짧은 바늘은 ${hour}시를 지나고 긴 바늘은 ${minute}분을 가리키므로 ${clockText(total)}입니다.`,
    family: "clock-reading", meta: { total, hour, minute }
  });
}

function elapsedTimeAnalogBook7({ difficulty = 2 }) {
  const start = randomInt(1 * 60, difficulty === 3 ? 10 * 60 : 7 * 60) + randomInt(0, 11) * 5;
  const duration = randomInt(difficulty === 1 ? 3 : 5, difficulty === 3 ? 26 : 16) * 10 + randomInt(0, 1) * 5;
  const end = start + duration;
  const hours = Math.floor(duration / 60);
  const minutes = duration % 60;
  return book7Problem({
    prompt: "시작한 시각과 끝난 시각을 보고 걸린 시간을 구하세요.", subtype: "clock-pair",
    visual: { clocks: [{ total: start, label: "시작" }, { total: end, label: "끝" }] },
    answer: `${hours}시간 ${minutes}분`,
    solution: `끝 시각에서 시작 시각을 빼면 ${duration}분입니다. ${duration}분은 ${hours}시간 ${minutes}분입니다.`,
    family: "elapsed-time", meta: { start, end, duration, hours, minutes }
  });
}

function timeAddSubtractBase60Book7({ difficulty = 2 }) {
  const operation = Math.random() < 0.5 ? "+" : "-";
  let first = randomInt(4 * 60, 11 * 60) + randomInt(4, 11) * 5;
  const second = randomInt(1, difficulty === 3 ? 5 : 3) * 60 + randomInt(4, 11) * 5;
  if (operation === "-" && first <= second) first = second + randomInt(1, 4) * 60 + 15;
  const result = operation === "+" ? first + second : first - second;
  return book7Problem({
    prompt: "60분을 기준으로 받아올림이나 받아내림을 하여 계산하세요.", subtype: "time-equation",
    visual: { expression: `${clockText(first)} ${operation} ${Math.floor(second / 60)}시간 ${second % 60}분 = □` },
    answer: clockText(result),
    solution: `모두 분으로 바꾸면 ${first}${operation}${second}=${result}분이고, 다시 바꾸면 ${clockText(result)}입니다.`,
    family: "time-arithmetic", meta: { operation, first, second, result }
  });
}

function findEndTimeBook7({ difficulty = 2 }) {
  const start = randomInt(1 * 60, 8 * 60) + randomInt(0, 11) * 5;
  const duration = randomInt(1, difficulty === 3 ? 5 : 3) * 60 + randomInt(1, 11) * 5;
  const end = start + duration;
  return book7Problem({
    prompt: `${clockText(start)}에 시작하여 ${Math.floor(duration / 60)}시간 ${duration % 60}분 동안 했습니다. 끝난 시각을 구하세요.`,
    subtype: "clock-pair", visual: { clocks: [{ total: start, label: "시작" }, { total: end, label: "끝 ?" }] },
    answer: clockText(end), solution: `${clockText(start)}에 ${duration}분을 더하면 ${clockText(end)}입니다.`,
    family: "find-end-time", meta: { start, duration, end }
  });
}

function findStartTimeBook7({ difficulty = 2 }) {
  const duration = randomInt(1, difficulty === 3 ? 5 : 3) * 60 + randomInt(1, 11) * 5;
  const start = randomInt(1 * 60, 7 * 60) + randomInt(0, 11) * 5;
  const end = start + duration;
  return book7Problem({
    prompt: `${Math.floor(duration / 60)}시간 ${duration % 60}분 동안 한 뒤 ${clockText(end)}에 끝났습니다. 시작한 시각을 구하세요.`,
    subtype: "clock-pair", visual: { clocks: [{ total: start, label: "시작 ?" }, { total: end, label: "끝" }] },
    answer: clockText(start), solution: `${clockText(end)}에서 ${duration}분을 빼면 ${clockText(start)}입니다.`,
    family: "find-start-time", meta: { start, duration, end }
  });
}

function consecutiveFullMonthReverse() {
  const july31 = randomInt(0, 6);
  const august31 = mod(july31 + 31, 7);
  const july1 = mod(july31 - 30, 7);
  const june1 = mod(july1 - 30, 7);
  return book7Problem({
    prompt: `어떤 달의 31일은 ${WEEKDAYS[july31]}요일이고 다음 달 31일은 ${WEEKDAYS[august31]}요일입니다. 바로 전 달의 1일은 무슨 요일인가요?`,
    subtype: "calendar-path", visual: { dates: [{ month: 7, date: 31, weekday: WEEKDAYS[july31] }, { month: 8, date: 31, weekday: WEEKDAYS[august31] }, { month: 6, date: 1, weekday: "?" }], shifts: [31, -60] },
    answer: `${WEEKDAYS[june1]}요일`,
    solution: "31일이 연달아 있는 달은 7월과 8월입니다. 7월 31일에서 30일 전이 7월 1일이고, 다시 30일 전이 6월 1일입니다.",
    family: "consecutive-full-month", meta: { july31, august31, july1, june1 }
  });
}

function leapYearCrossMonthWeekday({ difficulty = 2 }) {
  const startMonth = 1;
  const startDate = randomInt(20, 27);
  const targetMonth = 3;
  const targetDate = randomInt(5, difficulty === 3 ? 20 : 14);
  const startWeekday = randomInt(0, 6);
  const elapsed = dateSerial(targetMonth, targetDate, true) - dateSerial(startMonth, startDate, true);
  const targetWeekday = mod(startWeekday + elapsed, 7);
  return book7Problem({
    prompt: `윤년인 어느 해 ${startMonth}월 ${startDate}일은 ${WEEKDAYS[startWeekday]}요일입니다. 같은 해 ${targetMonth}월 ${targetDate}일은 무슨 요일인가요?`,
    subtype: "calendar-path", visual: { dates: [{ month: startMonth, date: startDate, weekday: WEEKDAYS[startWeekday] }, { month: targetMonth, date: targetDate, weekday: "?" }], shifts: [elapsed], leap: true },
    answer: `${WEEKDAYS[targetWeekday]}요일`,
    solution: `윤년의 2월은 29일까지입니다. 두 날짜 사이는 ${elapsed}일이므로 요일은 ${elapsed % 7}칸 옮겨 ${WEEKDAYS[targetWeekday]}요일입니다.`,
    family: "calendar-cross-month", meta: { startMonth, startDate, targetMonth, targetDate, startWeekday, elapsed, targetWeekday, leap: true }
  });
}

function mirrorClockReadingBook7({ difficulty = 2 }) {
  const original = randomInt(1 * 60, 11 * 60) + randomInt(0, difficulty === 1 ? 11 : 59);
  const mirror = mod(12 * 60 - original, 12 * 60);
  return book7Problem({
    prompt: "거울에 비친 시계를 보고 원래 시각을 구하세요.", subtype: "mirror-clock",
    visual: { clocks: [{ total: mirror, label: "거울에 비친 시계", mirrored: true }, { total: original, label: "원래 시계 ?" }] },
    answer: clockText(original), solution: `거울 시각 ${clockText(mirror)}을 12시에서 되돌리면 원래 시각은 ${clockText(original)}입니다.`,
    family: "mirror-clock-reading", meta: { original: mod(original, 720), mirror }
  });
}

function mirrorClockElapsed({ difficulty = 2 }) {
  const sleep = randomInt(20 * 60, 23 * 60) + randomInt(0, 5) * 10;
  const wake = randomInt(5 * 60, difficulty === 3 ? 9 * 60 : 8 * 60) + randomInt(0, 5) * 10;
  const sleep12 = mod(sleep, 720);
  const wake12 = mod(wake, 720);
  const mirrorSleep = mod(720 - sleep12, 720);
  const mirrorWake = mod(720 - wake12, 720);
  const duration = 24 * 60 - sleep + wake;
  return book7Problem({
    prompt: "잠들 때와 일어날 때 거울에 비친 시계를 보고 잠을 잔 시간을 구하세요.", subtype: "mirror-clock",
    visual: { clocks: [{ total: mirrorSleep, label: "밤 · 거울", mirrored: true }, { total: mirrorWake, label: "아침 · 거울", mirrored: true }] },
    answer: `${Math.floor(duration / 60)}시간 ${duration % 60}분`,
    solution: `원래 시각은 밤 ${clockText(sleep12)}, 아침 ${clockText(wake12)}입니다. 밤 12시를 지나 센 시간은 ${Math.floor(duration / 60)}시간 ${duration % 60}분입니다.`,
    family: "mirror-clock-elapsed", meta: { sleep, wake, sleep12, wake12, mirrorSleep, mirrorWake, duration }
  });
}

function mirrorSymmetricClock() {
  return book7Problem({
    prompt: "12시 외에 거울에 비친 시침과 분침의 모양이 원래 시계와 같은 시각을 구하세요.", subtype: "mirror-clock",
    visual: { clocks: [{ total: 0, label: "12시 · 보기" }, { total: 360, label: "?" }] },
    answer: "6시", solution: "시침과 분침이 모두 세로선 위에 놓이는 6시는 좌우로 뒤집어도 같은 모양입니다.",
    family: "mirror-symmetric-clock", meta: { target: 360 }
  });
}

function arithmeticSequenceNthBook7({ difficulty = 2 }) {
  const start = randomInt(1, difficulty === 3 ? 20 : 10);
  const step = randomInt(2, difficulty === 3 ? 12 : 8);
  const position = randomInt(difficulty === 1 ? 8 : 20, difficulty === 3 ? 90 : 55);
  const result = start + step * (position - 1);
  return book7Problem({
    prompt: `${start}부터 ${step}씩 뛰어 센 수열의 ${position}번째 수를 구하세요.`, subtype: "sequence",
    visual: { values: [start, start + step, start + step * 2, start + step * 3, "…", "?"], step, position },
    answer: String(result), solution: `첫 수를 제외하고 ${step}씩 ${position - 1}번 더하므로 ${start}+${step}×${position - 1}=${result}입니다.`,
    family: "arithmetic-sequence-nth", meta: { start, step, position, result }
  });
}

function sharedPolygonMatchsticksBook7({ difficulty = 2 }) {
  const sides = randomInt(3, difficulty === 3 ? 6 : 5);
  const count = randomInt(difficulty === 1 ? 8 : 20, difficulty === 3 ? 60 : 40);
  const added = sides - 1;
  const result = sides + added * (count - 1);
  return book7Problem({
    prompt: `정${["", "", "", "삼각형", "사각형", "오각형", "육각형"][sides]} ${count}개를 한 변씩 맞닿게 이어 만듭니다. 필요한 성냥개비는 몇 개인가요?`.replace("정정", "정"),
    subtype: "matchsticks", visual: { sides, shown: Math.min(4, count), count }, answer: `${result}개`,
    solution: `첫 도형은 ${sides}개, 다음 도형부터는 공통 변 하나를 함께 써서 ${added}개씩 늘어납니다. ${sides}+${added}×${count - 1}=${result}개입니다.`,
    family: "shared-matchsticks", meta: { sides, count, added, result }
  });
}

function divisionFillLongForm({ difficulty = 2 }) {
  const divisor = randomInt(2, difficulty === 3 ? 9 : 7);
  const quotient = randomInt(difficulty === 1 ? 4 : 11, difficulty === 3 ? 45 : 28);
  const remainder = randomInt(0, divisor - 1);
  const dividend = divisor * quotient + remainder;
  const hidden = sample(["quotient", "remainder"]);
  const result = hidden === "quotient" ? quotient : remainder;
  return book7Problem({
    prompt: `나눗셈 세로식의 빈칸에 알맞은 수를 쓰세요.`, subtype: "division",
    visual: { dividend, divisor, quotient: hidden === "quotient" ? "?" : quotient, remainder: hidden === "remainder" ? "?" : remainder },
    answer: String(result), solution: `${divisor}×${quotient}+${remainder}=${dividend}이므로 빈칸은 ${result}입니다.`,
    family: "division-fill", meta: { divisor, quotient, remainder, dividend, hidden, result }
  });
}

function reverseLinearEquationBook7({ difficulty = 2 }) {
  const multiplier = randomInt(2, difficulty === 3 ? 9 : 7);
  const addend = randomInt(1, difficulty === 3 ? 15 : 9);
  const unknown = randomInt(difficulty === 1 ? 5 : 11, difficulty === 3 ? 45 : 28);
  const target = addend + multiplier * unknown;
  return book7Problem({
    prompt: `${addend}+${multiplier}×□=${target}에서 □에 알맞은 수를 구하세요.`, subtype: "equation",
    visual: { expression: `${addend} + ${multiplier} × □ = ${target}` }, answer: String(unknown),
    solution: `${target}-${addend}=${target - addend}, ${target - addend}÷${multiplier}=${unknown}이므로 □=${unknown}입니다.`,
    family: "reverse-linear", meta: { multiplier, addend, unknown, target }
  });
}

function arithmeticSequencePositionBook7({ difficulty = 2 }) {
  const start = randomInt(1, 12);
  const step = randomInt(2, difficulty === 3 ? 12 : 8);
  const position = randomInt(difficulty === 1 ? 8 : 15, difficulty === 3 ? 50 : 30);
  const target = start + step * (position - 1);
  return book7Problem({
    prompt: `${start}, ${start + step}, ${start + step * 2}, ${start + step * 3}, …, ${target}에서 ${target}은 몇 번째 수인가요?`, subtype: "sequence",
    visual: { values: [start, start + step, start + step * 2, start + step * 3, "…", target], step, position: "?" },
    answer: `${position}번째`, solution: `(${target}-${start})÷${step}=${position - 1}번 뛰었고 첫 수를 포함하므로 ${position}번째입니다.`,
    family: "arithmetic-sequence-position", meta: { start, step, position, target }
  });
}

function sparseArithmeticSequenceBook7({ difficulty = 2 }) {
  const step = randomInt(2, difficulty === 3 ? 12 : 8);
  const start = randomInt(1, 15);
  const indices = difficulty === 1 ? [1, 3, 5] : [1, 4, 7];
  const values = indices.map((index) => start + step * (index - 1));
  const hiddenIndex = randomInt(0, 2);
  const shown = values.map((value, index) => index === hiddenIndex ? "?" : value);
  return book7Problem({
    prompt: "앞의 수에 같은 수를 더해 만든 수열입니다. 빈칸에 알맞은 수를 구하세요.", subtype: "sequence-table",
    visual: { indices, values: shown }, answer: String(values[hiddenIndex]),
    solution: `보이는 두 수와 순서의 차로 한 번에 ${step}씩 커지는 것을 알 수 있습니다. 빈칸은 ${values[hiddenIndex]}입니다.`,
    family: "sparse-sequence", meta: { start, step, indices, values, hiddenIndex, result: values[hiddenIndex] }
  });
}

function indexedArithmeticSequenceBook7({ difficulty = 2 }) {
  const first = randomInt(1, 9);
  const step = randomInt(2, difficulty === 3 ? 12 : 8);
  const targetIndex = randomInt(difficulty === 1 ? 18 : 30, difficulty === 3 ? 80 : 55);
  const result = first + step * (targetIndex - 1);
  return book7Problem({
    prompt: "순서와 수의 대응 규칙을 찾아 마지막 빈칸에 알맞은 수를 쓰세요.", subtype: "sequence-table",
    visual: { indices: [1, 2, 3, 4, targetIndex], values: [first, first + step, first + step * 2, first + step * 3, "?"] },
    answer: String(result), solution: `순서가 1 커질 때 수는 ${step}씩 커집니다. ${first}+${step}×${targetIndex - 1}=${result}입니다.`,
    family: "indexed-sequence", meta: { first, step, targetIndex, result }
  });
}

function twoCategoryProblem({ difficulty, labels, units, unitName, family, generatorLabel }) {
  const totalCount = randomInt(difficulty === 1 ? 8 : 12, difficulty === 3 ? 28 : 20);
  const secondCount = randomInt(2, totalCount - 2);
  const firstCount = totalCount - secondCount;
  const totalUnits = firstCount * units[0] + secondCount * units[1];
  return book7Problem({
    prompt: `${labels[0]}와 ${labels[1]}가 모두 ${totalCount}${generatorLabel}이고 ${unitName}의 합은 ${totalUnits}입니다. 각각 몇 ${generatorLabel}인가요?`,
    subtype: "assumption-table", visual: { labels, units, totalCount, totalUnits, unitName },
    answer: `${labels[0]} ${firstCount}${generatorLabel}, ${labels[1]} ${secondCount}${generatorLabel}`,
    solution: `모두 ${labels[0]}라고 하면 ${units[0] * totalCount}${unitName}입니다. 차이 ${totalUnits - units[0] * totalCount}${unitName}를 한 ${generatorLabel}을 바꿀 때 늘어나는 ${units[1] - units[0]}${unitName}로 나누면 ${labels[1]}는 ${secondCount}${generatorLabel}, ${labels[0]}는 ${firstCount}${generatorLabel}입니다.`,
    family, meta: { labels, units, totalCount, totalUnits, firstCount, secondCount }
  });
}

const twoLegAnimalAssumption = ({ difficulty = 2 }) => {
  const variant = Math.random() < 0.65 ? { labels: ["닭", "토끼"], units: [2, 4] } : { labels: ["개미", "거미"], units: [6, 8] };
  return twoCategoryProblem({ difficulty, ...variant, unitName: "개", family: "two-category", generatorLabel: "마리" });
};

const twoWheelVehicleAssumption = ({ difficulty = 2 }) => twoCategoryProblem({ difficulty, labels: ["두발자전거", "자동차"], units: [2, 4], unitName: "개", family: "two-category", generatorLabel: "대" });
const twoCardValueAssumption = ({ difficulty = 2 }) => twoCategoryProblem({ difficulty, labels: ["3 카드", difficulty === 3 ? "8 카드" : "5 카드"], units: [3, difficulty === 3 ? 8 : 5], unitName: "", family: "two-category", generatorLabel: "장" });
const twoScoreValueAssumption = ({ difficulty = 2 }) => twoCategoryProblem({ difficulty, labels: [difficulty === 1 ? "2점 문제" : "3점 문제", difficulty === 1 ? "5점 문제" : "7점 문제"], units: [difficulty === 1 ? 2 : 3, difficulty === 1 ? 5 : 7], unitName: "점", family: "two-category", generatorLabel: "개" });
const twoCoinValueAssumption = ({ difficulty = 2 }) => twoCategoryProblem({ difficulty, labels: [difficulty === 3 ? "50원 우표" : "10원 동전", difficulty === 3 ? "100원 우표" : "50원 동전"], units: [difficulty === 3 ? 50 : 10, difficulty === 3 ? 100 : 50], unitName: "원", family: "two-category", generatorLabel: "개" });

function correctWrongScoreAssumption({ difficulty = 2 }) {
  const total = randomInt(difficulty === 1 ? 8 : 10, difficulty === 3 ? 20 : 15);
  const gain = randomInt(3, difficulty === 3 ? 12 : 8);
  const penalty = randomInt(2, difficulty === 3 ? 7 : 5);
  const base = randomInt(2, 10) * 10;
  const correct = randomInt(2, total - 2);
  const wrong = total - correct;
  const score = base + correct * gain - wrong * penalty;
  return book7Problem({
    prompt: `기본 ${base}점에서 ${total}문제를 풀었습니다. 맞히면 ${gain}점을 얻고 틀리면 ${penalty}점을 잃어 ${score}점이 되었습니다. 맞힌 문제는 몇 개인가요?`,
    subtype: "assumption-table", visual: { labels: ["맞힘", "틀림"], units: [gain, -penalty], totalCount: total, totalUnits: score, unitName: "점", base },
    answer: `${correct}개`,
    solution: `모두 맞았다고 하면 ${base + total * gain}점입니다. 한 문제를 틀림으로 바꾸면 ${gain + penalty}점 줄어듭니다. ${(base + total * gain) - score}÷${gain + penalty}=${wrong}이므로 맞힌 문제는 ${correct}개입니다.`,
    family: "correct-wrong-score", meta: { total, gain, penalty, base, correct, wrong, score }
  });
}

function constantStepObjectGrowthBook7({ difficulty = 2 }) {
  const start = randomInt(2, 8);
  const step = randomInt(2, difficulty === 3 ? 9 : 6);
  const position = randomInt(difficulty === 1 ? 10 : 25, difficulty === 3 ? 70 : 45);
  const result = start + step * (position - 1);
  return book7Problem({
    prompt: `바둑돌을 같은 규칙으로 늘어놓았습니다. ${position}번째 모양의 바둑돌은 모두 몇 개인가요?`, subtype: "growth-dots",
    visual: { counts: [start, start + step, start + step * 2, start + step * 3], position }, answer: `${result}개`,
    solution: `처음 ${start}개에서 ${step}개씩 ${position - 1}번 늘어나므로 ${result}개입니다.`,
    family: "object-growth", meta: { start, step, position, result }
  });
}

function boundedSymbolSumExtrema({ difficulty = 2 }) {
  const offset = randomInt(2, difficulty === 3 ? 9 : 6);
  const bound = randomInt(difficulty === 1 ? 20 : 30, difficulty === 3 ? 60 : 45);
  const valid = [];
  for (let first = 1; first < bound; first += 1) {
    const second = 2 * first - offset;
    if (second >= 1 && first + second < bound) valid.push({ first, second, total: first + second });
  }
  const minTotal = valid[0].total;
  const maxTotal = valid.at(-1).total;
  const result = minTotal + maxTotal;
  return book7Problem({
    prompt: `자연수 ■와 ●의 합은 ${bound}보다 작고, ■+■=●+${offset}입니다. ■+●의 가장 큰 값과 가장 작은 값의 합을 구하세요.`,
    subtype: "condition-list", visual: { conditions: [`■+●<${bound}`, `■+■=●+${offset}`] }, answer: String(result),
    solution: `조건을 만족하는 합의 가장 작은 값은 ${minTotal}, 가장 큰 값은 ${maxTotal}이므로 합은 ${result}입니다.`,
    family: "bounded-symbol", meta: { offset, bound, valid, minTotal, maxTotal, result }
  });
}

function winLossNetZero({ difficulty = 2 }) {
  const up = difficulty === 3 ? 3 : 2;
  const down = difficulty === 3 ? 2 : 1;
  const factor = up + down;
  const multiplier = randomInt(2, difficulty === 3 ? 6 : 4);
  const total = factor * multiplier;
  const wins = down * multiplier;
  const losses = total - wins;
  return book7Problem({
    prompt: `계단에서 이기면 ${up}칸 올라가고 지면 ${down}칸 내려옵니다. ${total}번 한 뒤 처음 자리로 돌아왔다면 몇 번 이겼나요?`,
    subtype: "assumption-table", visual: { labels: ["이김", "짐"], units: [up, -down], totalCount: total, totalUnits: 0, unitName: "칸" },
    answer: `${wins}번`, solution: `${wins}×${up}-${losses}×${down}=0이므로 ${wins}번 이겼습니다.`,
    family: "win-loss", meta: { up, down, total, wins, losses, net: 0 }
  });
}

function sharedConsumptionAssumption({ difficulty = 2 }) {
  let giants;
  let dwarfs;
  const totalPeople = randomInt(difficulty === 1 ? 12 : 20, difficulty === 3 ? 48 : 34);
  do {
    giants = randomInt(2, totalPeople - 4);
    dwarfs = totalPeople - giants;
  } while (dwarfs % 2 !== 0);
  const fruits = dwarfs / 2 + giants * 2;
  return book7Problem({
    prompt: `난쟁이와 거인이 모두 ${totalPeople}명이고 귤 ${fruits}개를 먹었습니다. 난쟁이는 2명이 1개를 나누어 먹고 거인은 1명이 2개를 먹습니다. 각각 몇 명인가요?`,
    subtype: "assumption-table", visual: { labels: ["난쟁이", "거인"], units: ["2명당 1개", "1명당 2개"], totalCount: totalPeople, totalUnits: fruits, unitName: "개" },
    answer: `난쟁이 ${dwarfs}명, 거인 ${giants}명`, solution: `${dwarfs}명의 난쟁이는 ${dwarfs / 2}개, ${giants}명의 거인은 ${giants * 2}개를 먹어 모두 ${fruits}개입니다.`,
    family: "shared-consumption", meta: { totalPeople, dwarfs, giants, fruits }
  });
}

function countDifferenceAssumption({ difficulty = 2 }) {
  const rabbits = randomInt(2, difficulty === 3 ? 12 : 8);
  const difference = randomInt(rabbits + 2, rabbits + (difficulty === 3 ? 15 : 10));
  const chickens = rabbits + difference;
  const legDifference = chickens * 2 - rabbits * 4;
  if (legDifference <= 0) return countDifferenceAssumption({ difficulty });
  return book7Problem({
    prompt: `닭이 토끼보다 ${difference}마리 많고, 닭의 다리 수가 토끼의 다리 수보다 ${legDifference}개 많습니다. 닭과 토끼는 각각 몇 마리인가요?`,
    subtype: "assumption-table", visual: { labels: ["닭", "토끼"], units: [2, 4], totalCount: `${difference}마리 차`, totalUnits: legDifference, unitName: "다리 차" },
    answer: `닭 ${chickens}마리, 토끼 ${rabbits}마리`, solution: `${chickens}×2-${rabbits}×4=${legDifference}이고 ${chickens}-${rabbits}=${difference}이므로 답은 닭 ${chickens}마리, 토끼 ${rabbits}마리입니다.`,
    family: "count-difference", meta: { rabbits, chickens, difference, legDifference }
  });
}

function linkedSequenceCorrespondence({ difficulty = 2 }) {
  const firstStart = randomInt(1, 8);
  const firstStep = randomInt(2, 6);
  const secondStart = randomInt(2, 9);
  const secondStep = randomInt(3, difficulty === 3 ? 10 : 7);
  const position = randomInt(15, difficulty === 3 ? 50 : 32);
  const target = firstStart + firstStep * (position - 1);
  const result = secondStart + secondStep * (position - 1);
  return book7Problem({
    prompt: "두 수열에서 같은 순서에 놓인 수끼리 짝입니다. 첫째 수열의 마지막 수와 짝인 둘째 수열의 수를 구하세요.", subtype: "sequence-table",
    visual: { indices: [1, 2, 3, "…", position], values: [[firstStart, firstStart + firstStep, firstStart + firstStep * 2, "…", target], [secondStart, secondStart + secondStep, secondStart + secondStep * 2, "…", "?"]] },
    answer: String(result), solution: `첫째 수열의 ${target}은 ${position}번째입니다. 둘째 수열의 ${position}번째 수는 ${secondStart}+${secondStep}×${position - 1}=${result}입니다.`,
    family: "linked-sequences", meta: { firstStart, firstStep, secondStart, secondStep, position, target, result }
  });
}

function climbSlipDays({ difficulty = 2 }) {
  const climb = randomInt(difficulty === 1 ? 3 : 5, difficulty === 3 ? 12 : 9);
  const slip = randomInt(1, climb - 1);
  const days = randomInt(difficulty === 1 ? 3 : 5, difficulty === 3 ? 14 : 9);
  const net = climb - slip;
  const height = climb + net * (days - 1);
  return book7Problem({
    prompt: `달팽이가 낮에는 ${climb}m 올라가고 밤에는 ${slip}m 미끄러집니다. 높이 ${height}m 기둥의 꼭대기에 몇째 날 도착하나요?`,
    subtype: "climb", visual: { climb, slip, height, days }, answer: `${days}일째`,
    solution: `하루가 지나면 ${net}m씩 높아지지만 마지막 날 밤에는 미끄러지지 않습니다. ${days - 1}일 밤까지 ${net * (days - 1)}m, ${days}일 낮에 ${climb}m를 올라 ${height}m에 도착합니다.`,
    family: "climb-slip", meta: { climb, slip, net, height, days }
  });
}

function exchangeContainerTotal({ difficulty = 2 }) {
  const rate = randomInt(3, difficulty === 3 ? 6 : 5);
  const initial = randomInt(difficulty === 1 ? 8 : 15, difficulty === 3 ? 70 : 42);
  let empty = initial;
  let exchanged = 0;
  const rounds = [];
  while (empty >= rate) {
    const received = Math.floor(empty / rate);
    rounds.push({ empty, received });
    exchanged += received;
    empty = received + (empty % rate);
  }
  const total = initial + exchanged;
  return book7Problem({
    prompt: `음료 ${initial}병을 마셨습니다. 빈 병 ${rate}개를 가져가면 음료 1병으로 바꾸어 줍니다. 바꾼 음료도 모두 마시고 다시 바꿀 때, 마실 수 있는 음료는 모두 몇 병인가요?`,
    subtype: "exchange", visual: { initial, rate, rounds: rounds.slice(0, 4) }, answer: `${total}병`,
    solution: `빈 병을 ${rate}개씩 바꾸는 일을 더 바꿀 수 없을 때까지 되풀이하면 새로 ${exchanged}병을 받습니다. 처음 ${initial}병과 합해 ${total}병입니다.`,
    family: "container-exchange", meta: { rate, initial, exchanged, remaining: empty, total, rounds }
  });
}

function reverseDoublingTargetDay({ difficulty = 2 }) {
  const start = randomInt(1, difficulty === 3 ? 5 : 3);
  const fullDay = randomInt(difficulty === 1 ? 5 : 7, difficulty === 3 ? 11 : 9);
  const back = randomInt(1, Math.min(difficulty === 1 ? 2 : 4, fullDay - 2));
  const targetDay = fullDay - back;
  const target = start * (2 ** (targetDay - 1));
  const full = start * (2 ** (fullDay - 1));
  return book7Problem({
    prompt: `첫날 ${start}개에서 시작해 날마다 두 배가 되어 ${fullDay}일째 ${full}개가 되었습니다. ${target}개였던 날은 며칠째인가요?`,
    subtype: "doubling", visual: { start, fullDay, full, target, targetDay: "?" }, answer: `${targetDay}일째`,
    solution: `${full}개에서 하루 전으로 갈 때마다 반으로 줄이면 ${target}개는 ${targetDay}일째입니다.`,
    family: "reverse-doubling-day", meta: { start, fullDay, back, targetDay, target, full }
  });
}

function doublingFractionStartCount({ difficulty = 2 }) {
  const start = randomInt(1, difficulty === 3 ? 6 : 4);
  const fullDay = randomInt(difficulty === 1 ? 5 : 7, difficulty === 3 ? 10 : 9);
  const back = randomInt(2, Math.min(4, fullDay - 2));
  const earlierDay = fullDay - back;
  const earlier = start * (2 ** (earlierDay - 1));
  const full = start * (2 ** (fullDay - 1));
  const result = earlier + start;
  return book7Problem({
    prompt: `첫날부터 날마다 두 배가 되어 ${fullDay}일째 ${full}개가 되었습니다. ${earlierDay}일째의 개수와 첫날의 개수를 더하면 얼마인가요?`,
    subtype: "doubling", visual: { start: "?", fullDay, full, target: "?", targetDay: earlierDay }, answer: `${result}개`,
    solution: `${full}개를 ${back}번 반으로 나누면 ${earlierDay}일째 ${earlier}개이고, 다시 첫날까지 거꾸로 가면 ${start}개입니다. 두 수의 합은 ${result}개입니다.`,
    family: "doubling-fraction-start", meta: { start, fullDay, back, earlierDay, earlier, full, result }
  });
}

function doublingStartCount({ difficulty = 2 }) {
  const normalStart = 1;
  const normalDay = randomInt(difficulty === 1 ? 6 : 8, difficulty === 3 ? 13 : 10);
  const earlier = randomInt(1, difficulty === 3 ? 4 : 3);
  const targetDay = normalDay - earlier;
  const full = 2 ** (normalDay - 1);
  const neededStart = 2 ** earlier;
  return book7Problem({
    prompt: `첫날 1개에서 시작해 날마다 두 배가 되면 ${normalDay}일째 ${full}개가 됩니다. 같은 수를 ${targetDay}일째 만들려면 첫날 몇 개에서 시작해야 하나요?`,
    subtype: "doubling", visual: { start: normalStart, fullDay: normalDay, full, compareDay: targetDay }, answer: `${neededStart}개`,
    solution: `${earlier}일 더 일찍 같은 수가 되려면 첫날의 수도 ${earlier}번 두 배가 되어야 합니다. 첫날 ${neededStart}개입니다.`,
    family: "doubling-start", meta: { normalStart, normalDay, earlier, targetDay, full, neededStart }
  });
}

function doublingHalfFullDay({ difficulty = 2 }) {
  const fullDay = randomInt(difficulty === 1 ? 5 : 8, difficulty === 3 ? 16 : 12);
  const full = randomInt(1, 4) * (2 ** (fullDay - 1));
  const half = full / 2;
  return book7Problem({
    prompt: `연못의 수초가 날마다 두 배로 늘어 ${fullDay}일째 연못을 가득 덮었습니다. 연못의 절반을 덮은 날은 며칠째인가요?`,
    subtype: "doubling", visual: { fullDay, full, half, target: half, targetDay: "?" }, answer: `${fullDay - 1}일째`,
    solution: `하루 뒤에 두 배가 되어 가득 차므로, 절반이었던 날은 바로 하루 전인 ${fullDay - 1}일째입니다.`,
    family: "doubling-half-day", meta: { fullDay, full, half, targetDay: fullDay - 1 }
  });
}

function doublingTwoStartEarlier({ difficulty = 2 }) {
  const normalDay = randomInt(difficulty === 1 ? 6 : 9, difficulty === 3 ? 15 : 12);
  const multiplier = difficulty === 3 ? sample([2, 4]) : 2;
  const daysEarlier = Math.log2(multiplier);
  const targetDay = normalDay - daysEarlier;
  return book7Problem({
    prompt: `첫날 1개에서 시작하면 날마다 두 배가 되어 ${normalDay}일째 가득 찹니다. 첫날 ${multiplier}개에서 시작하면 며칠째 가득 차나요?`,
    subtype: "doubling", visual: { start: 1, normalDay, compareStart: multiplier, target: "가득", targetDay: "?" }, answer: `${targetDay}일째`,
    solution: `첫날의 수가 ${multiplier}배이면 ${daysEarlier}일치만큼 앞서 시작한 것과 같습니다. 따라서 ${targetDay}일째 가득 찹니다.`,
    family: "doubling-earlier", meta: { normalDay, multiplier, daysEarlier, targetDay }
  });
}

function polygonBorderPointCount({ difficulty = 2 }) {
  const sides = randomInt(3, difficulty === 3 ? 6 : 5);
  const pointsPerSide = randomInt(difficulty === 1 ? 3 : 5, difficulty === 3 ? 12 : 9);
  const total = sides * (pointsPerSide - 1);
  return book7Problem({
    prompt: `정${["", "", "", "삼각형", "사각형", "오각형", "육각형"][sides]}의 각 변에 꼭짓점을 포함해 점을 ${pointsPerSide}개씩 같은 간격으로 찍었습니다. 점은 모두 몇 개인가요?`,
    subtype: "polygon-points", visual: { sides, pointsPerSide, target: "total" }, answer: `${total}개`,
    solution: `각 변의 끝 점은 다음 변과 겹칩니다. 한 변마다 새로 세는 점은 ${pointsPerSide - 1}개이므로 ${pointsPerSide - 1}×${sides}=${total}개입니다.`,
    family: "polygon-border-points", meta: { sides, pointsPerSide, total }
  });
}

function polygonBorderSideCountInverse({ difficulty = 2 }) {
  const sides = randomInt(3, difficulty === 3 ? 6 : 5);
  const pointsPerSide = randomInt(difficulty === 1 ? 3 : 5, difficulty === 3 ? 13 : 9);
  const total = sides * (pointsPerSide - 1);
  return book7Problem({
    prompt: `정${["", "", "", "삼각형", "사각형", "오각형", "육각형"][sides]}의 둘레에 같은 간격으로 점 ${total}개를 찍었습니다. 꼭짓점을 포함하면 한 변에 점이 몇 개인가요?`,
    subtype: "polygon-points", visual: { sides, pointsPerSide: "?", total }, answer: `${pointsPerSide}개`,
    solution: `${total}÷${sides}=${pointsPerSide - 1}은 한 변의 간격 수입니다. 점의 수는 간격 수보다 1 많으므로 ${pointsPerSide}개입니다.`,
    family: "polygon-side-points-inverse", meta: { sides, pointsPerSide, total }
  });
}

function polygonStakesFromSide({ difficulty = 2 }) {
  const sides = randomInt(3, difficulty === 3 ? 6 : 5);
  const stakesPerSide = randomInt(difficulty === 1 ? 4 : 6, difficulty === 3 ? 15 : 10);
  const total = sides * (stakesPerSide - 1);
  return book7Problem({
    prompt: `정${["", "", "", "삼각형", "사각형", "오각형", "육각형"][sides]} 모양 울타리의 한 변에 양 끝을 포함해 말뚝을 ${stakesPerSide}개씩 세웁니다. 필요한 말뚝은 모두 몇 개인가요?`,
    subtype: "polygon-points", visual: { sides, pointsPerSide: stakesPerSide, target: "stakes" }, answer: `${total}개`,
    solution: `꼭짓점의 말뚝은 두 변이 함께 씁니다. (${stakesPerSide}-1)×${sides}=${total}개입니다.`,
    family: "polygon-stakes", meta: { sides, stakesPerSide, total }
  });
}

function closedPerimeterObjectCount({ difficulty = 2 }) {
  const spacing = randomInt(2, difficulty === 3 ? 12 : 8);
  const count = randomInt(difficulty === 1 ? 8 : 14, difficulty === 3 ? 50 : 30);
  const perimeter = spacing * count;
  return book7Problem({
    prompt: `둘레가 ${perimeter}m인 닫힌 길에 ${spacing}m 간격으로 가로등을 세웁니다. 가로등은 모두 몇 개인가요?`,
    subtype: "perimeter-loop", visual: { perimeter, spacing, count: "?" }, answer: `${count}개`,
    solution: `닫힌 길에서는 가로등 수와 간격 수가 같습니다. ${perimeter}÷${spacing}=${count}개입니다.`,
    family: "closed-object-count", meta: { spacing, count, perimeter }
  });
}

function closedPerimeterFromSpacingCount({ difficulty = 2 }) {
  const spacing = randomInt(2, difficulty === 3 ? 15 : 9);
  const count = randomInt(difficulty === 1 ? 8 : 15, difficulty === 3 ? 60 : 35);
  const perimeter = spacing * count;
  return book7Problem({
    prompt: `닫힌 연못 둘레에 ${spacing}m 간격으로 나무 ${count}그루를 심었습니다. 연못의 둘레는 몇 m인가요?`,
    subtype: "perimeter-loop", visual: { perimeter: "?", spacing, count }, answer: `${perimeter}m`,
    solution: `닫힌 둘레의 간격 수는 나무 수와 같은 ${count}개입니다. ${spacing}×${count}=${perimeter}m입니다.`,
    family: "closed-perimeter", meta: { spacing, count, perimeter }
  });
}

function betweenObjectsSubdivisionCount({ difficulty = 2 }) {
  const oldCount = randomInt(difficulty === 1 ? 6 : 10, difficulty === 3 ? 30 : 20);
  const subdivisions = randomInt(2, difficulty === 3 ? 6 : 4);
  const newPerGap = subdivisions - 1;
  const result = oldCount * newPerGap;
  return book7Problem({
    prompt: `닫힌 길에 나무 ${oldCount}그루가 같은 간격으로 있습니다. 이웃한 두 나무 사이를 ${subdivisions}등분하여 등분점마다 꽃을 한 송이씩 심으면 꽃은 모두 몇 송이인가요?`,
    subtype: "between-loop", visual: { oldCount, subdivisions, newPerGap }, answer: `${result}송이`,
    solution: `나무 사이 한 곳마다 새 등분점은 ${newPerGap}개이고, 닫힌 길의 나무 사이는 ${oldCount}곳입니다. ${newPerGap}×${oldCount}=${result}송이입니다.`,
    family: "between-subdivision", meta: { oldCount, subdivisions, newPerGap, result }
  });
}

function perimeterCapacity({ difficulty = 2 }) {
  const lampCount = randomInt(difficulty === 1 ? 6 : 10, difficulty === 3 ? 28 : 18);
  const seatsPerBench = randomInt(2, difficulty === 3 ? 6 : 4);
  const benchesPerGap = difficulty === 3 ? randomInt(1, 2) : 1;
  const benches = lampCount * benchesPerGap;
  const people = benches * seatsPerBench;
  return book7Problem({
    prompt: `닫힌 광장 둘레의 가로등 ${lampCount}개 사이마다 의자를 ${benchesPerGap}개씩 놓았습니다. 의자 하나에 ${seatsPerBench}명씩 앉으면 모두 몇 명이 앉을 수 있나요?`,
    subtype: "between-loop", visual: { oldCount: lampCount, subdivisions: benchesPerGap + 1, newPerGap: benchesPerGap }, answer: `${people}명`,
    solution: `가로등 사이는 ${lampCount}곳이므로 의자는 ${lampCount}×${benchesPerGap}=${benches}개입니다. ${benches}×${seatsPerBench}=${people}명이 앉을 수 있습니다.`,
    family: "perimeter-capacity", meta: { lampCount, benchesPerGap, benches, seatsPerBench, people }
  });
}

function betweenObjectPerimeter({ difficulty = 2 }) {
  const lamps = randomInt(difficulty === 1 ? 5 : 8, difficulty === 3 ? 20 : 14);
  const treesPerGap = randomInt(1, difficulty === 3 ? 5 : 3);
  const spacing = randomInt(2, difficulty === 3 ? 8 : 5);
  const intervalsPerGap = treesPerGap + 1;
  const perimeter = lamps * intervalsPerGap * spacing;
  return book7Problem({
    prompt: `닫힌 연못 둘레에 가로등 ${lamps}개가 같은 간격으로 있고, 이웃한 가로등 사이마다 나무가 ${treesPerGap}그루씩 있습니다. 모든 이웃한 물체 사이가 ${spacing}m라면 연못의 둘레는 몇 m인가요?`,
    subtype: "between-loop", visual: { oldCount: lamps, subdivisions: intervalsPerGap, newPerGap: treesPerGap }, answer: `${perimeter}m`,
    solution: `가로등 사이 한 곳에는 간격이 ${intervalsPerGap}개이고 그런 곳이 ${lamps}곳입니다. ${lamps}×${intervalsPerGap}×${spacing}=${perimeter}m입니다.`,
    family: "between-object-perimeter", meta: { lamps, treesPerGap, spacing, intervalsPerGap, perimeter }
  });
}

function innerOuterPathObjectCount({ difficulty = 2 }) {
  const spacing = randomInt(2, difficulty === 3 ? 6 : 4);
  const innerWidth = spacing * randomInt(4, difficulty === 3 ? 12 : 8);
  const innerHeight = spacing * randomInt(3, difficulty === 3 ? 9 : 6);
  const thickness = spacing * randomInt(1, difficulty === 3 ? 3 : 2);
  const outerWidth = innerWidth + thickness * 2;
  const outerHeight = innerHeight + thickness * 2;
  const innerCount = 2 * (innerWidth + innerHeight) / spacing;
  const outerCount = 2 * (outerWidth + outerHeight) / spacing;
  const total = innerCount + outerCount;
  return book7Problem({
    prompt: `직사각형 산책로의 안쪽과 바깥쪽 가장자리에 ${spacing}m 간격으로 가로등을 세웁니다. 그림의 크기일 때 가로등은 모두 몇 개인가요?`,
    subtype: "inner-outer", visual: { spacing, innerWidth, innerHeight, outerWidth, outerHeight }, answer: `${total}개`,
    solution: `안쪽은 ${innerCount}개, 바깥쪽은 ${outerCount}개이므로 모두 ${total}개입니다.`,
    family: "inner-outer-count", meta: { spacing, innerWidth, innerHeight, outerWidth, outerHeight, innerCount, outerCount, total }
  });
}

function polygonBorderShapeConversion({ difficulty = 2 }) {
  const choices = difficulty === 3 ? [3, 4, 5, 6] : [3, 4, 5];
  const sourceSides = sample(choices);
  const targetSides = sample(choices.filter((value) => value !== sourceSides));
  const intervals = lcm(sourceSides, targetSides) * randomInt(1, difficulty === 3 ? 4 : 3);
  const sourcePoints = intervals / sourceSides + 1;
  const targetPoints = intervals / targetSides + 1;
  return book7Problem({
    prompt: `같은 수의 바둑돌을 정${["", "", "", "삼각형", "사각형", "오각형", "육각형"][sourceSides]} 둘레에 놓으니 한 변에 꼭짓점을 포함해 ${sourcePoints}개씩 놓였습니다. 이 바둑돌로 정${["", "", "", "삼각형", "사각형", "오각형", "육각형"][targetSides]}을 만들면 한 변에 몇 개씩 놓이나요?`,
    subtype: "polygon-points", visual: { sides: sourceSides, pointsPerSide: sourcePoints, targetSides }, answer: `${targetPoints}개`,
    solution: `전체 바둑돌은 (${sourcePoints}-1)×${sourceSides}=${intervals}개입니다. ${intervals}÷${targetSides}+1=${targetPoints}개씩 놓입니다.`,
    family: "polygon-shape-conversion", meta: { sourceSides, targetSides, intervals, sourcePoints, targetPoints }
  });
}

function palindromeLengthCount({ difficulty = 2 }) {
  const digits = difficulty === 1 ? 2 : difficulty === 2 ? randomInt(2, 4) : randomInt(4, 5);
  const freeDigits = Math.ceil(digits / 2);
  const count = 9 * (10 ** (freeDigits - 1));
  const factors = [9, ...Array.from({ length: freeDigits - 1 }, () => 10)];
  return book7Problem({
    prompt: `앞에서 읽어도 뒤에서 읽어도 같은 ${digits}자리 자연수는 모두 몇 개인가요?`,
    subtype: "palindrome-list", visual: { digits, examples: digits === 2 ? [11, 22, 33] : digits === 3 ? [101, 121, 202] : ["앞 절반", "뒤집어 붙이기"] }, answer: `${count}개`,
    solution: `앞쪽 ${freeDigits}자리만 정하면 뒤쪽이 정해집니다. 첫 자리는 1부터 9까지이고 나머지는 0부터 9까지이므로 ${factors.join("×")}=${count}개입니다.`,
    family: "palindrome-count", meta: { digits, freeDigits, count }
  });
}

function threeDigitPalindromeDigitSum({ difficulty = 2 }) {
  let targetSum;
  let valid;
  do {
    targetSum = randomInt(difficulty === 1 ? 6 : 8, difficulty === 3 ? 24 : 20);
    valid = [];
    for (let first = 1; first <= 9; first += 1) {
      const middle = targetSum - first * 2;
      if (middle >= 0 && middle <= 9) valid.push(first * 101 + middle * 10);
    }
  } while (valid.length < 2 || valid.length > (difficulty === 3 ? 7 : 5));
  return book7Problem({
    prompt: `각 자리 숫자의 합이 ${targetSum}인 세 자리 대칭수를 모두 찾으세요.`,
    subtype: "palindrome-list", visual: { digits: 3, examples: ["□", "○", "□"], targetSum }, answer: valid.join(", "),
    solution: `백의 자리와 일의 자리를 같은 수로 놓고 가운데 수를 찾으면 ${valid.join(", ")}입니다.`,
    family: "palindrome-digit-sum", meta: { targetSum, valid }
  });
}

function calendarDatePalindrome({ difficulty = 2 }) {
  let startMonth;
  let endMonth;
  let valid;
  do {
    startMonth = randomInt(1, difficulty === 1 ? 10 : 8);
    endMonth = randomInt(startMonth + 2, 12);
    valid = [];
    for (let month = startMonth; month <= endMonth; month += 1) {
      for (let date = 1; date <= MONTH_DAYS[month - 1]; date += 1) {
        const text = `${pad2(month)}${pad2(date)}`;
        if (isPalindrome(text)) valid.push(`${month}월 ${date}일`);
      }
    }
  } while (!valid.length || valid.length > 5);
  return book7Problem({
    prompt: `${startMonth}월부터 ${endMonth}월까지 월과 일을 각각 두 자리로 이어 썼을 때 대칭수가 되는 날짜를 모두 찾으세요.`,
    subtype: "palindrome-list", visual: { digits: 4, examples: [`${pad2(startMonth)}월`, "두 자리 날짜"], range: [startMonth, endMonth] }, answer: valid.join(", "),
    solution: `월 두 자리와 일 두 자리를 이어 쓴 네 자리 수를 뒤집어 확인하면 ${valid.join(", ")}입니다.`,
    family: "calendar-palindrome", meta: { startMonth, endMonth, valid }
  });
}

function clockTimePalindrome({ difficulty = 2 }) {
  const all = [];
  for (let hour = 1; hour <= 12; hour += 1) {
    for (let minute = 0; minute < 60; minute += 1) {
      const text = `${pad2(hour)}${pad2(minute)}`;
      if (isPalindrome(text)) all.push({ hour, minute, text });
    }
  }
  let startHour;
  let endHour;
  let valid;
  do {
    startHour = difficulty === 1 ? 1 : randomInt(1, 7);
    endHour = difficulty === 3 ? 12 : randomInt(Math.max(startHour + 3, 5), 12);
    valid = all.filter(({ hour }) => hour >= startHour && hour <= endHour);
  } while (!valid.length);
  return book7Problem({
    prompt: `${startHour}시부터 ${endHour}시 59분까지 시와 분을 각각 두 자리로 이어 쓴 수가 대칭수인 시각은 모두 몇 개인가요?`,
    subtype: "palindrome-list", visual: { digits: 4, examples: ["시 두 자리", "분 두 자리"], range: [startHour, endHour] }, answer: `${valid.length}개`,
    solution: `조건에 맞는 시각은 ${valid.map(({ hour, minute }) => `${hour}시 ${minute}분`).join(", ")}으로 모두 ${valid.length}개입니다.`,
    family: "clock-palindrome", meta: { startHour, endHour, valid, count: valid.length }
  });
}

function reversedDifferenceValues(difference) {
  const digitGap = difference / 9;
  const values = [];
  for (let ones = 1; ones + digitGap <= 9; ones += 1) values.push((ones + digitGap) * 10 + ones);
  return values;
}

function reversedTwoDigitDifferenceEnumeration({ difficulty = 2 }) {
  const digitGap = difficulty === 1 ? randomInt(7, 8) : difficulty === 2 ? randomInt(4, 7) : randomInt(2, 5);
  const difference = digitGap * 9;
  const valid = reversedDifferenceValues(difference);
  return book7Problem({
    prompt: `두 자리 수에서 십의 자리와 일의 자리를 바꾼 수를 빼면 ${difference}입니다. 처음 수가 더 클 때 가능한 처음 수를 모두 찾으세요.`,
    subtype: "reverse-digits", visual: { difference, mode: "all" }, answer: valid.join(", "),
    solution: `두 자리의 차는 ${digitGap}이어야 합니다. 가능한 수는 ${valid.join(", ")}입니다.`,
    family: "reverse-difference-list", meta: { digitGap, difference, valid }
  });
}

function reversedTwoDigitDifferenceExtreme({ difficulty = 2 }) {
  const digitGap = randomInt(difficulty === 1 ? 6 : 2, difficulty === 3 ? 7 : 6);
  const difference = digitGap * 9;
  const valid = reversedDifferenceValues(difference);
  const smallest = valid[0];
  const largest = valid.at(-1);
  return book7Problem({
    prompt: `앞뒤를 바꾼 수를 빼면 ${difference}가 되는 두 자리 수 중 처음 수가 더 큰 수의 가장 큰 수와 가장 작은 수를 차례로 쓰세요.`,
    subtype: "reverse-digits", visual: { difference, mode: "extreme" }, answer: `${largest}, ${smallest}`,
    solution: `두 자리의 차가 ${digitGap}인 수는 ${valid.join(", ")}이므로 가장 큰 수는 ${largest}, 가장 작은 수는 ${smallest}입니다.`,
    family: "reverse-difference-extreme", meta: { digitGap, difference, valid, smallest, largest }
  });
}

function reversedDigitGivenTens({ difficulty = 2 }) {
  const tens = randomInt(3, 9);
  const ones = randomInt(1, tens - 1);
  const value = tens * 10 + ones;
  const reversed = ones * 10 + tens;
  const difference = value - reversed;
  return book7Problem({
    prompt: `십의 자리가 ${tens}인 두 자리 수가 있습니다. 이 수에서 앞뒤를 바꾼 수를 빼면 ${difference}입니다. 처음 수를 구하세요.`,
    subtype: "reverse-digits", visual: { tens, ones: "?", difference }, answer: String(value),
    solution: `두 자리 숫자의 차는 ${difference}÷9=${tens - ones}입니다. 일의 자리는 ${ones}이므로 처음 수는 ${value}입니다.`,
    family: "reverse-given-tens", meta: { tens, ones, value, reversed, difference }
  });
}

function reversedDigitPairRange({ difficulty = 2 }) {
  const tens = randomInt(3, 9);
  const ones = randomInt(1, tens - 1);
  const value = tens * 10 + ones;
  const reversed = ones * 10 + tens;
  const difference = value - reversed;
  const pairSum = value + reversed;
  const margin = randomInt(1, difficulty === 3 ? 5 : 3);
  const lower = pairSum - margin;
  const upper = pairSum + margin;
  return book7Problem({
    prompt: `어떤 두 자리 수는 앞뒤를 바꾼 수보다 ${difference} 크고, 두 수의 합은 ${lower}보다 크고 ${upper}보다 작습니다. 처음 수를 구하세요.`,
    subtype: "reverse-digits", visual: { difference, range: [lower, upper], mode: "range" }, answer: String(value),
    solution: `자리 숫자의 차는 ${difference}÷9=${tens - ones}이고 두 수의 합은 ${pairSum}입니다. 두 조건을 함께 만족하는 처음 수는 ${value}입니다.`,
    family: "reverse-pair-range", meta: { tens, ones, value, reversed, difference, pairSum, lower, upper }
  });
}

function fourPointDistanceChain({ difficulty = 2 }) {
  const labels = difficulty === 3 ? ["가", "나", "다", "라", "마", "바"] : ["가", "나", "다", "라"];
  const gaps = Array.from({ length: labels.length - 1 }, () => randomInt(2, difficulty === 3 ? 15 : 10));
  const leftSpan = sum(gaps.slice(0, Math.ceil(gaps.length / 2)));
  const rightSpan = sum(gaps.slice(Math.floor(gaps.length / 2)));
  const overlap = gaps[Math.floor(gaps.length / 2)];
  const total = sum(gaps);
  return book7Problem({
    prompt: `일직선 위의 점 사이 거리입니다. 왼쪽 묶음은 ${leftSpan}m, 오른쪽 묶음은 ${rightSpan}m이고 두 묶음이 ${overlap}m 겹칩니다. 맨 처음 점과 맨 끝 점 사이의 거리를 구하세요.`,
    subtype: "distance-line", visual: { labels, gaps, leftSpan, rightSpan, overlap }, answer: `${total}m`,
    solution: `두 묶음의 거리를 더하고 겹쳐 센 ${overlap}m를 한 번 빼면 ${leftSpan}+${rightSpan}-${overlap}=${total}m입니다.`,
    family: "distance-chain", meta: { labels, gaps, leftSpan, rightSpan, overlap, total }
  });
}

function vennProblem({ difficulty, family, mode }) {
  const leftOnly = randomInt(2, difficulty === 3 ? 18 : 11);
  const overlap = randomInt(1, difficulty === 3 ? 12 : 7);
  const rightOnly = randomInt(2, difficulty === 3 ? 18 : 11);
  const neither = randomInt(1, difficulty === 3 ? 10 : 6);
  const leftTotal = leftOnly + overlap;
  const rightTotal = rightOnly + overlap;
  const union = leftOnly + overlap + rightOnly;
  const total = union + neither;
  let prompt;
  let answer;
  if (mode === "overlap-all") {
    prompt = `학생 ${union}명이 두 활동 중 적어도 하나를 합니다. 첫 활동은 ${leftTotal}명, 둘째 활동은 ${rightTotal}명이 할 때 두 활동을 모두 하는 학생은 몇 명인가요?`;
    answer = overlap;
  } else if (mode === "union") {
    prompt = `첫 활동을 하는 학생은 ${leftTotal}명, 둘째 활동은 ${rightTotal}명이고 둘 다 하는 학생은 ${overlap}명입니다. 적어도 한 활동을 하는 학생은 몇 명인가요?`;
    answer = union;
  } else if (mode === "exactly-one") {
    prompt = `첫 활동은 ${leftTotal}명, 둘째 활동은 ${rightTotal}명, 둘 다 하는 학생은 ${overlap}명입니다. 한 가지 활동만 하는 학생은 몇 명인가요?`;
    answer = leftOnly + rightOnly;
  } else if (mode === "neither") {
    prompt = `학생은 모두 ${total}명입니다. 첫 활동은 ${leftTotal}명, 둘째 활동은 ${rightTotal}명, 둘 다 하는 학생은 ${overlap}명일 때 어느 활동도 하지 않는 학생은 몇 명인가요?`;
    answer = neither;
  } else {
    prompt = `학생은 모두 ${total}명이고 어느 활동도 하지 않는 학생은 ${neither}명입니다. 첫 활동은 ${leftTotal}명, 둘째 활동은 ${rightTotal}명일 때 두 활동을 모두 하는 학생은 몇 명인가요?`;
    answer = overlap;
  }
  const asksOverlap = mode === "overlap-all" || mode === "overlap-neither";
  return book7Problem({
    prompt, subtype: "venn", visual: {
      leftOnly: "?", overlap: asksOverlap ? "?" : overlap, rightOnly: "?",
      neither: mode === "neither" ? "?" : mode === "overlap-neither" ? neither : "-",
      labels: ["첫 활동", "둘째 활동"], leftTotal, rightTotal,
      total: mode === "neither" || mode === "overlap-neither" ? total : mode === "overlap-all" ? union : null
    }, answer: `${answer}명`,
    solution: `왼쪽만 ${leftOnly}명, 겹친 부분 ${overlap}명, 오른쪽만 ${rightOnly}명, 어느 쪽도 아닌 부분 ${neither}명으로 나누어 보면 답은 ${answer}명입니다.`,
    family, meta: { mode, leftOnly, overlap, rightOnly, neither, leftTotal, rightTotal, union, total, result: answer }
  });
}

const vennOverlapAll = ({ difficulty = 2 }) => vennProblem({ difficulty, family: "venn-overlap-all", mode: "overlap-all" });
const vennUnionTotal = ({ difficulty = 2 }) => vennProblem({ difficulty, family: "venn-union", mode: "union" });
const vennExactlyOne = ({ difficulty = 2 }) => vennProblem({ difficulty, family: "venn-exactly-one", mode: "exactly-one" });
const vennNeitherBook7 = ({ difficulty = 2 }) => vennProblem({ difficulty, family: "venn-neither", mode: "neither" });
const vennOverlapWithNeither = ({ difficulty = 2 }) => vennProblem({ difficulty, family: "venn-overlap-neither", mode: "overlap-neither" });

function twoWayTableCount({ difficulty = 2 }) {
  const cells = Array.from({ length: 2 }, () => Array.from({ length: 2 }, () => randomInt(2, difficulty === 3 ? 20 : 12)));
  const rowTotals = cells.map((row) => sum(row));
  const columnTotals = [cells[0][0] + cells[1][0], cells[0][1] + cells[1][1]];
  const hiddenRow = randomInt(0, 1);
  const hiddenColumn = randomInt(0, 1);
  const result = cells[hiddenRow][hiddenColumn];
  return book7Problem({
    prompt: "두 가지 기준으로 나눈 표의 행과 열 합을 보고 빈칸에 알맞은 수를 구하세요.",
    subtype: "two-way-table", visual: { cells: cells.map((row, rowIndex) => row.map((value, columnIndex) => rowIndex === hiddenRow && columnIndex === hiddenColumn ? "?" : value)), rowTotals, columnTotals }, answer: String(result),
    solution: `빈칸이 있는 줄의 합에서 보이는 수를 빼면 ${result}입니다. 다른 방향의 합으로도 확인할 수 있습니다.`,
    family: "two-way-table", meta: { cells, rowTotals, columnTotals, hiddenRow, hiddenColumn, result }
  });
}

function palindromeAdjacentDigitDifference({ difficulty = 2 }) {
  const difference = randomInt(difficulty === 1 ? 7 : 5, difficulty === 3 ? 8 : 7);
  const valid = [];
  for (let first = 1; first <= 9; first += 1) {
    for (let middle = 0; middle <= 9; middle += 1) {
      if (Math.abs(first - middle) === difference) valid.push(first * 101 + middle * 10);
    }
  }
  return book7Problem({
    prompt: `이웃한 두 자리 숫자의 차가 ${difference}인 세 자리 대칭수를 모두 찾으세요.`,
    subtype: "palindrome-list", visual: { digits: 3, examples: ["□", "○", "□"], adjacentDifference: difference }, answer: valid.join(", "),
    solution: `백의 자리와 일의 자리를 같게 놓고 가운데 자리와의 차를 ${difference}로 맞추면 ${valid.join(", ")}입니다.`,
    family: "palindrome-adjacent", meta: { difference, valid }
  });
}

function complementGroupsTotal({ difficulty = 2 }) {
  const leftOnly = randomInt(2, difficulty === 3 ? 15 : 10);
  const overlap = randomInt(1, difficulty === 3 ? 10 : 6);
  const rightOnly = randomInt(2, difficulty === 3 ? 15 : 10);
  const neither = randomInt(1, difficulty === 3 ? 8 : 5);
  const notLeft = rightOnly + neither;
  const notRight = leftOnly + neither;
  const total = leftOnly + overlap + rightOnly + neither;
  return book7Problem({
    prompt: `첫 모둠에 속하지 않은 학생은 ${notLeft}명, 둘째 모둠에 속하지 않은 학생은 ${notRight}명, 두 모둠에 모두 속한 학생은 ${overlap}명, 어느 모둠에도 속하지 않은 학생은 ${neither}명입니다. 학생은 모두 몇 명인가요?`,
    subtype: "condition-list", visual: { conditions: [`첫 모둠이 아닌 학생 ${notLeft}명`, `둘째 모둠이 아닌 학생 ${notRight}명`, `두 모둠에 모두 속한 학생 ${overlap}명`, `어느 모둠에도 속하지 않은 학생 ${neither}명`] }, answer: `${total}명`,
    solution: `두 '속하지 않은 수'를 더하고 겹친 학생을 더한 뒤, 어느 쪽도 아닌 학생은 두 번 세었으므로 한 번 빼면 ${notLeft}+${notRight}+${overlap}-${neither}=${total}명입니다.`,
    family: "complement-total", meta: { leftOnly, overlap, rightOnly, neither, notLeft, notRight, total }
  });
}

function fourGroupComplementTotal({ difficulty = 2 }) {
  const groups = Array.from({ length: 4 }, () => randomInt(2, difficulty === 3 ? 16 : 10));
  const total = sum(groups);
  const complements = groups.map((value) => total - value);
  return book7Problem({
    prompt: `학생들을 겹치지 않는 네 모둠으로 나누었습니다. 각 모둠에 속하지 않은 학생 수가 차례로 ${complements.join(", ")}명입니다. 학생은 모두 몇 명인가요?`,
    subtype: "condition-list", visual: { conditions: complements.map((value, index) => `${index + 1}모둠이 아닌 학생 ${value}명`) }, answer: `${total}명`,
    solution: `각 학생은 자신이 속한 모둠을 뺀 나머지 세 번씩 세어집니다. ${sum(complements)}÷3=${total}명입니다.`,
    family: "four-complement", meta: { groups, complements, total }
  });
}

function reverseAddPalindrome({ difficulty = 2 }) {
  let start;
  let reversed;
  let result;
  do {
    start = randomInt(difficulty === 1 ? 12 : 20, difficulty === 3 ? 89 : 76);
    reversed = Number([...String(start)].reverse().join(""));
    result = start + reversed;
  } while (!isPalindrome(result) || start % 10 === 0 || start === reversed);
  return book7Problem({
    prompt: `${start}의 앞뒤를 바꾼 수를 더하여 대칭수를 만드세요.`,
    subtype: "reverse-digits", visual: { value: start, reversed, mode: "add" }, answer: String(result),
    solution: `${start}의 앞뒤를 바꾼 수는 ${reversed}이고, ${start}+${reversed}=${result}입니다.`,
    family: "reverse-add-palindrome", meta: { start, reversed, result }
  });
}

function minimumStoneMoves({ difficulty = 2 }) {
  const target = [[1, 1], [2, 1], [1, 2], [2, 2], [1, 3], [2, 3]];
  const moves = randomInt(1, difficulty === 3 ? 3 : 2);
  const outside = shuffle([[0, 0], [3, 0], [0, 2], [3, 2], [0, 4], [3, 4]]);
  const movedIndices = shuffle(target.map((_, index) => index)).slice(0, moves);
  const initial = target.map((point) => [...point]);
  movedIndices.forEach((targetIndex, index) => { initial[targetIndex] = outside[index]; });
  return book7Problem({
    prompt: "왼쪽 바둑돌을 옮겨 오른쪽 목표 모양과 같게 만들려고 합니다. 가장 적게 몇 개를 옮겨야 하나요?",
    subtype: "stone-move", visual: { initial, target }, answer: `${moves}개`,
    solution: `이미 같은 자리에 있는 바둑돌은 ${target.length - moves}개입니다. 다른 자리에 있는 ${moves}개만 옮기면 되므로 답은 ${moves}개입니다.`,
    family: "stone-moves", meta: { initial, target, moves, movedIndices }
  });
}

function kaprekarStep(value) {
  const digits = String(value).padStart(3, "0").split("").sort();
  const small = Number(digits.join(""));
  const large = Number([...digits].reverse().join(""));
  return { value: large - small, large, small };
}

function kaprekar495({ difficulty = 2 }) {
  let start;
  let history;
  do {
    const digits = shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).slice(0, 3);
    if (digits[0] === 0) [digits[0], digits[1]] = [digits[1], digits[0]];
    start = Number(digits.join(""));
    history = [];
    let current = start;
    for (let count = 0; count < 10 && current !== 495; count += 1) {
      const next = kaprekarStep(current);
      history.push(next);
      current = next.value;
    }
  } while (!history.length || history.at(-1).value !== 495 || history.length > (difficulty === 1 ? 3 : difficulty === 2 ? 5 : 7));
  return book7Problem({
    prompt: `${start}의 숫자를 큰 수와 작은 수로 배열해 큰 수에서 작은 수를 빼는 일을 되풀이합니다. 495가 되려면 몇 번 계산해야 하나요?`,
    subtype: "reverse-digits", visual: { value: start, mode: "kaprekar" }, answer: `${history.length}번`,
    solution: `${history.map(({ large, small, value }) => `${large}-${String(small).padStart(3, "0")}=${value}`).join(", ")}이므로 ${history.length}번입니다.`,
    family: "kaprekar-495", meta: { start, history, count: history.length }
  });
}

function threeCircleEqualSum({ difficulty = 2 }) {
  const leftOverlap = randomInt(2, difficulty === 3 ? 16 : 11);
  const rightOverlap = randomInt(2, difficulty === 3 ? 16 : 11);
  const hiddenSide = Math.random() < 0.5 ? "left" : "right";
  let leftExclusive;
  let rightExclusive;
  let result;
  if (hiddenSide === "right") {
    leftExclusive = randomInt(Math.max(2, rightOverlap - leftOverlap + 2), difficulty === 3 ? 22 : 15);
    rightExclusive = leftOverlap + leftExclusive - rightOverlap;
    result = rightExclusive;
  } else {
    rightExclusive = randomInt(Math.max(2, leftOverlap - rightOverlap + 2), difficulty === 3 ? 22 : 15);
    leftExclusive = rightOverlap + rightExclusive - leftOverlap;
    result = leftExclusive;
  }
  if (result <= 0) return threeCircleEqualSum({ difficulty });
  const top = randomInt(5, difficulty === 3 ? 24 : 17);
  const lowerSum = leftOverlap + leftExclusive;
  return book7Problem({
    prompt: "세 원으로 나눈 그림에서 아래 두 원 안에 쓰인 수의 합이 같습니다. 색칠한 부분의 수를 구하세요.",
    subtype: "three-circles", visual: {
      top, leftOverlap, rightOverlap,
      leftExclusive: hiddenSide === "left" ? "?" : leftExclusive,
      rightExclusive: hiddenSide === "right" ? "?" : rightExclusive,
      hiddenSide
    }, answer: String(result),
    solution: `아래 왼쪽 원의 합과 오른쪽 원의 합이 같아야 합니다. ${leftOverlap}+${leftExclusive}=${rightOverlap}+${rightExclusive}=${lowerSum}이므로 색칠한 부분은 ${result}입니다.`,
    family: "three-circle-sum", meta: { top, leftOverlap, rightOverlap, leftExclusive, rightExclusive, hiddenSide, lowerSum, result }
  });
}

function unitTestLargestReversedDifferenceBook7({ difficulty = 2 }) {
  const digitGap = randomInt(difficulty === 1 ? 7 : 3, difficulty === 3 ? 7 : 6);
  const difference = digitGap * 9;
  const valid = reversedDifferenceValues(difference);
  const largest = valid.at(-1);
  return book7Problem({
    prompt: `앞뒤 숫자를 바꾼 수와 처음 수의 차가 ${difference}일 때, 만들 수 있는 가장 큰 두 자리 수를 구하세요.`,
    subtype: "reverse-digits",
    visual: { difference, mode: "extreme" },
    answer: String(largest),
    solution: `십의 자리와 일의 자리의 차는 ${difference}÷9=${digitGap}입니다. 조건에 맞는 수는 ${valid.join(", ")}이므로 가장 큰 수는 ${largest}입니다.`,
    family: "reverse-difference-extreme",
    meta: { digitGap, difference, valid, smallest: valid[0], largest }
  });
}

function unitTestUnpaddedClockPalindromeBook7({ difficulty = 2 }) {
  const startHour = difficulty === 1 ? randomInt(1, 5) : randomInt(6, 9);
  const hours = difficulty === 3 ? 4 : 3;
  const endHour = Math.min(12, startHour + hours);
  const valid = [];
  for (let hour = startHour; hour < endHour; hour += 1) {
    for (let minute = 0; minute < 60; minute += 1) {
      const text = `${hour}${minute}`;
      if (isPalindrome(text)) valid.push({ hour, minute, text });
    }
  }
  if (!valid.length) return unitTestUnpaddedClockPalindromeBook7({ difficulty });
  return book7Problem({
    prompt: `${startHour}시부터 ${endHour}시까지 시와 분을 그대로 이어 쓴 수가 대칭수가 되는 시각은 모두 몇 번인가요?`,
    subtype: "palindrome-list",
    visual: { digits: 4, examples: [`${startHour}시 8분 → ${startHour}8`, `${Math.min(10, endHour - 1)}시 6분 → ${Math.min(10, endHour - 1)}6`], range: [startHour, endHour] },
    answer: `${valid.length}번`,
    solution: `조건에 맞는 시각은 ${valid.map(({ hour, minute }) => `${hour}시 ${minute}분`).join(", ")}으로 모두 ${valid.length}번입니다.`,
    family: "unit-unpadded-clock-palindrome-b7",
    meta: { startHour, endHour, valid, count: valid.length }
  });
}

function unitTestFourGroupThreeCluesBook7({ difficulty = 2 }) {
  const first = randomInt(4, difficulty === 3 ? 16 : 11);
  const second = randomInt(4, difficulty === 3 ? 16 : 11);
  const third = randomInt(3, difficulty === 3 ? 13 : 9);
  const fourth = randomInt(3, difficulty === 3 ? 13 : 9);
  const groups = [first, second, third, fourth];
  const total = sum(groups);
  const notFirst = total - first;
  const notSecond = total - second;
  const neitherThirdNorFourth = first + second;
  return book7Problem({
    prompt: `학생들을 겹치지 않는 가, 나, 다, 라 네 모둠으로 나누었습니다. 가 모둠이 아닌 학생은 ${notFirst}명, 나 모둠이 아닌 학생은 ${notSecond}명이고, 다 또는 라 모둠이 아닌 학생은 ${neitherThirdNorFourth}명입니다. 학생은 모두 몇 명인가요?`,
    subtype: "condition-list",
    visual: { conditions: [`가 모둠 아님 ${notFirst}명`, `나 모둠 아님 ${notSecond}명`, `다·라 모둠 아님 ${neitherThirdNorFourth}명`] },
    answer: `${total}명`,
    solution: `전체를 □명이라 하면 가 모둠은 □-${notFirst}, 나 모둠은 □-${notSecond}명입니다. 두 모둠의 합이 ${neitherThirdNorFourth}명이므로 □×2-${notFirst + notSecond}=${neitherThirdNorFourth}, 전체는 ${total}명입니다.`,
    family: "unit-four-group-three-clues-b7",
    meta: { groups, total, notFirst, notSecond, neitherThirdNorFourth }
  });
}

export const BOOK07_GENERATORS = Object.freeze({
  calendarMonthShiftWeekdayBook7,
  calendarCrossMonthKnownWeekday,
  weekdayAfterDaysBook7,
  timeUnitConversionBook7,
  analogClockReadingBook7,
  elapsedTimeAnalogBook7,
  timeAddSubtractBase60Book7,
  findEndTimeBook7,
  findStartTimeBook7,
  consecutiveFullMonthReverse,
  leapYearCrossMonthWeekday,
  mirrorClockReadingBook7,
  mirrorClockElapsed,
  mirrorSymmetricClock,
  arithmeticSequenceNthBook7,
  sharedPolygonMatchsticksBook7,
  divisionFillLongForm,
  reverseLinearEquationBook7,
  arithmeticSequencePositionBook7,
  sparseArithmeticSequenceBook7,
  indexedArithmeticSequenceBook7,
  twoLegAnimalAssumption,
  twoWheelVehicleAssumption,
  twoCardValueAssumption,
  twoScoreValueAssumption,
  twoCoinValueAssumption,
  correctWrongScoreAssumption,
  constantStepObjectGrowthBook7,
  boundedSymbolSumExtrema,
  winLossNetZero,
  sharedConsumptionAssumption,
  countDifferenceAssumption,
  linkedSequenceCorrespondence,
  climbSlipDays,
  exchangeContainerTotal,
  reverseDoublingTargetDay,
  doublingFractionStartCount,
  doublingStartCount,
  doublingHalfFullDay,
  doublingTwoStartEarlier,
  polygonBorderPointCount,
  polygonBorderSideCountInverse,
  polygonStakesFromSide,
  closedPerimeterObjectCount,
  closedPerimeterFromSpacingCount,
  betweenObjectsSubdivisionCount,
  perimeterCapacity,
  betweenObjectPerimeter,
  innerOuterPathObjectCount,
  polygonBorderShapeConversion,
  palindromeLengthCount,
  threeDigitPalindromeDigitSum,
  calendarDatePalindrome,
  clockTimePalindrome,
  reversedTwoDigitDifferenceEnumeration,
  reversedTwoDigitDifferenceExtreme,
  reversedDigitGivenTens,
  reversedDigitPairRange,
  fourPointDistanceChain,
  vennOverlapAll,
  vennUnionTotal,
  vennExactlyOne,
  vennNeitherBook7,
  vennOverlapWithNeither,
  twoWayTableCount,
  palindromeAdjacentDigitDifference,
  complementGroupsTotal,
  fourGroupComplementTotal,
  reverseAddPalindrome,
  minimumStoneMoves,
  kaprekar495,
  threeCircleEqualSum,
  unitTestLargestReversedDifferenceBook7,
  unitTestUnpaddedClockPalindromeBook7,
  unitTestFourGroupThreeCluesBook7
});
