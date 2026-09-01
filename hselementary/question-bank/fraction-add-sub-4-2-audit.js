"use strict";

// Independent source-structure and answer audit for 4-2 unit 1.
global.window = {};
require("./curriculum.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const unit = window.HSE_CURRICULUM.semesters.find(semester => semester.id === "4-2").units.find(item => item.id === "4-2-u1");
const sourceGroup = unit.subunits[0];
const types = unit.subunits.flatMap(subunit => subunit.types);
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
const mixed = (numerator, denominator) => {
  const divisor = gcd(numerator, denominator);
  numerator /= divisor;
  denominator /= divisor;
  const whole = Math.floor(numerator / denominator);
  const remainder = numerator % denominator;
  if (!remainder) return String(whole);
  if (!whole) return `${remainder}/${denominator}`;
  return `${whole} ${remainder}/${denominator}`;
};
const reducedFraction = (numerator, denominator) => {
  const divisor = gcd(numerator, denominator);
  numerator /= divisor;
  denominator /= divisor;
  return denominator === 1 ? String(numerator) : `${numerator}/${denominator}`;
};
const attribute = (tag, name) => tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
const evidenceAnswer = (kind, values) => {
  if (kind === "fraction-1-exploration") return String(values[0] * 4);
  if (kind === "fraction-1-example-1") return String(values[0] + values[1] * 5 / 2);
  if (kind === "fraction-1-example-2") {
    const [ratioNumerator, ratioDenominator, difference, halfDenominator, offset] = values;
    const minji = difference * ratioDenominator / (ratioDenominator - ratioNumerator);
    const soyeon = minji * ratioNumerator / ratioDenominator;
    const eunjeong = minji / halfDenominator - offset;
    return String(soyeon + minji + eunjeong);
  }
  if (kind === "fraction-1-example-3") return String(values[0] * 7 / 9);
  if (kind === "fraction-1-example-4") return String(values[0] * 6 / 17);
  if (kind === "fraction-1-mission-1") return mixed(1, values[0] - 1);
  if (kind === "fraction-1-mission-2") return String((values[0] + values[1]) / 2 + values[1]);
  if (kind === "fraction-1-mission-3") return String((values[1] * 4 / 3 - values[0]) * 4);
  if (kind === "fraction-1-mission-4") return String(values[0] * 9);
  if (kind === "fraction-1-mission-5") {
    const [oneThirdWeight, fullWeight] = values;
    const emptyWeight = (oneThirdWeight * 3 - fullWeight) / 2;
    return String(emptyWeight + (fullWeight - emptyWeight) * 3 / 4);
  }
  if (kind === "fraction-1-mission-6") return String(values[0] * 6);
  if (kind === "fraction-2-exploration") {
    const labels = ["가", "나", "다", "라", "마"];
    const pairs = [];
    for (let index = 0; index < values.length; index += 2) pairs.push({ label: labels[index / 2], distance: Math.abs(values[index] / values[index + 1] - 3) });
    return pairs.sort((left, right) => left.distance - right.distance).map(item => item.label).join(", ");
  }
  if (kind === "fraction-2-example-1") {
    let count = 0;
    values.forEach(numerator => values.forEach(denominator => { if (numerator > denominator) count += 1; }));
    return String(count);
  }
  if (kind === "fraction-2-example-2") {
    const [quotient, remainder] = values;
    const denominator = remainder + 1;
    return reducedFraction(quotient * denominator + remainder, denominator);
  }
  if (kind === "fraction-2-example-3") {
    const [denominator, first, second, third] = values;
    return [["ㄱ", first], ["ㄴ", second], ["ㄷ", third]].sort((left, right) => left[1] / denominator - right[1] / denominator).map(item => item[0]).join(">");
  }
  if (kind === "fraction-2-example-4") return String((values.length - 1) / 3);
  if (kind === "fraction-2-mission-1") {
    const permutations = [];
    const visit = (prefix, rest) => {
      if (!rest.length) return permutations.push(prefix);
      rest.forEach((value, index) => visit([...prefix, value], [...rest.slice(0, index), ...rest.slice(index + 1)]));
    };
    visit([], values);
    const largest = permutations.map(cards => ({ whole: cards[0] * 10 + cards[1], numerator: cards[2], denominator: cards[3] * 10 + cards[4] })).filter(item => item.numerator < item.denominator).sort((left, right) => right.whole + right.numerator / right.denominator - (left.whole + left.numerator / left.denominator))[0];
    const smallest = permutations.map(cards => ({ whole: cards[0], numerator: cards[1] * 10 + cards[2], denominator: cards[3] * 10 + cards[4] })).filter(item => item.numerator < item.denominator).sort((left, right) => left.whole + left.numerator / left.denominator - (right.whole + right.numerator / right.denominator))[0];
    return `${mixed(largest.whole * largest.denominator + largest.numerator, largest.denominator)}, ${mixed(smallest.whole * smallest.denominator + smallest.numerator, smallest.denominator)}`;
  }
  if (kind === "fraction-2-mission-2") {
    const denominator = 6;
    const candidates = [];
    values.filter(value => value !== denominator).forEach(whole => values.filter(value => value !== denominator && value !== whole && value < denominator).forEach(numerator => candidates.push({ whole, numerator, value: whole + numerator / denominator })));
    candidates.sort((left, right) => Math.abs(left.value - 8) - Math.abs(right.value - 8));
    if (candidates.length > 1 && Math.abs(candidates[0].value - 8) === Math.abs(candidates[1].value - 8)) return "AMBIGUOUS";
    const best = candidates[0];
    return mixed(best.whole * denominator + best.numerator, denominator);
  }
  if (kind === "fraction-2-mission-3") {
    const [denominator, numeratorMultiplier = 5, denominatorMultiplier = 4] = values;
    const candidates = [];
    for (let numerator = 1; numerator < denominator; numerator += 1) if (numerator * numeratorMultiplier >= denominator * denominatorMultiplier) candidates.push(numerator);
    return candidates.map(numerator => reducedFraction(numerator, denominator)).join(", ");
  }
  if (kind === "fraction-2-mission-4") {
    const [denominator, lower, upper] = values;
    const candidates = [];
    for (let symbol = 1; (denominator + 1) * symbol < upper; symbol += 1) if (lower < (denominator + 1) * symbol && (denominator + 1) * symbol < upper) candidates.push(symbol);
    return candidates.join(", ");
  }
  if (kind === "fraction-2-mission-5") return values.slice(3).map(numerator => mixed(numerator, values[0])).join(", ");
  if (kind === "fraction-2-mission-6") {
    const [denominator, remainder, divisor, limit] = values;
    let count = 0;
    for (let numerator = denominator; numerator < denominator * limit; numerator += 1) if (numerator % divisor === remainder && numerator % 2 === 1) count += 1;
    return String(count);
  }
  if (kind === "fraction-3-exploration") {
    const answers = [];
    for (let index = 0; index < values.length; index += 4) {
      const [left, denominator, sign, right] = values.slice(index, index + 4);
      answers.push(mixed(sign === 1 ? left + right : left - right, denominator));
    }
    return answers.join(", ");
  }
  if (kind === "fraction-3-example-1") return mixed(values[0] + values[1] - values[2], values[3]);
  if (kind === "fraction-3-example-2") return `${["선주", "민주", "민서", "준호", "유진", "도윤"][values[3] === 0 ? 0 : values[3] === 1 ? 1 : values[3] === 2 ? 2 : values[3] === 3 ? 3 : values[3] === 4 ? 4 : 5]}가 ${mixed(Math.abs(values[1] - values[0]), values[2])}m`;
  if (kind === "fraction-3-example-3") {
    const [first, second, third, base, denominator] = values;
    const g = first - second - third;
    const n = base + g;
    return mixed(g + n, denominator);
  }
  if (kind === "fraction-3-example-4") {
    const [denominator, left, right, added, last] = values;
    const heart = left - right + added;
    return mixed(heart * 2 + last, denominator);
  }
  if (kind === "fraction-3-mission-1") return [["ㄱ", values[0]], ["ㄴ", values[1]], ["ㄷ", values[2]], ["ㄹ", values[3]]].sort((left, right) => right[1] - left[1]).map(([label]) => label).join(" → ");
  if (kind === "fraction-3-mission-2") return mixed(values[0] + values[1] + values[2], values[3]);
  if (kind === "fraction-3-mission-3") return mixed(values[0] - values[1], values[2]);
  if (kind === "fraction-3-mission-4") return `${Math.floor((values[1] - values[0]) / values[2])}시간 ${((values[1] - values[0]) % values[2]) * 60 / values[2]}분`;
  if (kind === "fraction-3-mission-5") {
    const [startHour, lesson, breakTime, lunch, denominator] = values;
    const endMinutes = startHour * 60 + (5 * lesson + 3 * breakTime + lunch) * 60 / denominator;
    const suffix = endMinutes >= 12 * 60 ? "오후" : "오전";
    const twelveHour = (Math.floor(endMinutes / 60) + 11) % 12 + 1;
    const minute = endMinutes % 60;
    return `${suffix} ${twelveHour}시${minute ? ` ${minute}분` : ""}`;
  }
  if (kind === "fraction-3-mission-6") return mixed(Math.abs(values[1] - values[0]), values[2]);
  if (kind === "fraction-4-exploration") {
    const [count, denominator, startWhole, wholeStep, startNumerator, numeratorStep] = values;
    const wholeSum = count * (2 * startWhole + (count - 1) * wholeStep) / 2;
    const numeratorSum = count * (2 * startNumerator + (count - 1) * numeratorStep) / 2;
    return mixed(wholeSum * denominator + numeratorSum, denominator);
  }
  if (kind === "fraction-4-example-1") return mixed(values[1] * values[2] - (values[1] - 1) * values[3], values[0]);
  if (kind === "fraction-4-example-2") return mixed(values[1] - values[3] * values[4] / values[2], values[0]);
  if (kind === "fraction-4-example-3") {
    const total = values[0] * (values[2] + values[3]);
    return `${Math.floor(total / values[1])}분${total % values[1] ? ` ${total % values[1] * 60 / values[1]}초` : ""}`;
  }
  if (kind === "fraction-4-example-4") return mixed((values[1] - values[2]) / 2, values[0]);
  if (kind === "fraction-4-mission-1") return String(values[3] * values[0] / (values[0] - values[1] - values[2]));
  if (kind === "fraction-4-mission-2") return mixed(values[1], values[0]);
  if (kind === "fraction-4-mission-3") return mixed(values[1] * values[2] - values[1] * values[3], values[0]);
  if (kind === "fraction-4-mission-4") return String(values[1] * values[2]);
  if (kind === "fraction-4-mission-5") {
    const total = values[0] * (values[2] + values[3] * (24 / values[4]));
    return `${Math.floor(total / values[1])}분${total % values[1] ? ` ${total % values[1] * 60 / values[1]}초` : ""}`;
  }
  if (kind === "fraction-4-mission-6") {
    const [denominator, count, oddRemainder, evenRemainder] = values;
    return mixed(count * (count + 1) / 2 * denominator + count / 2 * (oddRemainder + evenRemainder), denominator);
  }
  if (kind === "fraction-5-exploration" || kind === "fraction-5-mission-6") {
    const termAt = target => {
      let group = 1;
      while (group * (group + 1) / 2 < target) group += 1;
      const position = target - (group - 1) * group / 2;
      const numerator = kind === "fraction-5-exploration"
        ? (group - position + 1) * group + position
        : position === 1 ? group * group : (group - 1) * group + group - position + 1;
      return { numerator, denominator: group };
    };
    const first = termAt(values[0]);
    const second = termAt(values[1]);
    if (kind === "fraction-5-exploration") return `${mixed(first.numerator, first.denominator)}, ${mixed(second.numerator, second.denominator)}`;
    return mixed(first.numerator * second.denominator + second.numerator * first.denominator, first.denominator * second.denominator);
  }
  if (kind === "fraction-5-example-1") {
    const [denominator, maximumNumerator, differenceNumerator] = values;
    let count = 0;
    for (let smaller = 1; smaller <= maximumNumerator; smaller += 1) if (smaller + differenceNumerator <= maximumNumerator) count += 1;
    return String(count);
  }
  if (kind === "fraction-5-example-2") {
    const [denominator, first, third] = values;
    return mixed(first + (third - first) / 2 * 5, denominator);
  }
  if (kind === "fraction-5-example-3") {
    const [denominator, leftWhole, rightWhole, resultNumerator] = values;
    const candidates = [];
    for (let first = 1; first < denominator; first += 1) for (let second = 1; second < denominator; second += 1) if ((leftWhole * denominator + first) - (rightWhole * denominator + second) === resultNumerator) candidates.push([first, second]);
    const maximumSum = Math.max(...candidates.map(pair => pair[0] + pair[1]));
    const winners = candidates.filter(pair => pair[0] + pair[1] === maximumSum);
    return winners.length === 1 ? `ㄱ=${winners[0][0]}, ㄴ=${winners[0][1]}` : "AMBIGUOUS";
  }
  if (kind === "fraction-5-example-4") return String(values[0] * 2 + 1);
  if (kind === "fraction-5-mission-1") {
    const [denominator, firstPart, secondPart, right, subtractWhole] = values;
    let count = 0;
    for (let blank = 1; blank < denominator; blank += 1) if (firstPart + secondPart > right - (subtractWhole * denominator + blank)) count += 1;
    return String(count);
  }
  if (kind === "fraction-5-mission-2") return String(values[0] * values[1] - 1);
  if (kind === "fraction-5-mission-3") {
    const [denominator, targetNumerator, ...cards] = values;
    const pairs = [];
    for (let left = 0; left < cards.length; left += 1) for (let right = left + 1; right < cards.length; right += 1) pairs.push({ sum: cards[left] + cards[right], difference: cards[right] - cards[left] });
    const sumDistance = Math.min(...pairs.map(pair => Math.abs(pair.sum - targetNumerator)));
    const differenceDistance = Math.min(...pairs.map(pair => Math.abs(pair.difference - targetNumerator)));
    const sumWinners = pairs.filter(pair => Math.abs(pair.sum - targetNumerator) === sumDistance);
    const differenceWinners = pairs.filter(pair => Math.abs(pair.difference - targetNumerator) === differenceDistance);
    if (sumWinners.length !== 1 || differenceWinners.length !== 1) return "AMBIGUOUS";
    return `${mixed(sumWinners[0].sum, denominator)}, ${mixed(differenceWinners[0].difference, denominator)}`;
  }
  if (kind === "fraction-5-mission-4") {
    const [firstDenominator, denominatorStep, firstMissingIndex, shownDenominator] = values;
    return `ㄱ=${firstDenominator + (firstMissingIndex - 1) * denominatorStep}, ㄴ=${(shownDenominator - firstDenominator) / denominatorStep + 1}`;
  }
  if (kind === "fraction-5-mission-5") return String(values[0] + 1);
  if (kind === "fraction-6-exploration") {
    const [denominator, hojunMore, youngwooMore, hojunAndBeomjun] = values;
    return mixed(hojunAndBeomjun - hojunMore + youngwooMore, denominator);
  }
  if (kind === "fraction-6-example-1") {
    const [denominator, outer, innerLeft, innerRight, right] = values;
    return mixed(outer - innerLeft + innerRight - right, denominator);
  }
  if (kind === "fraction-6-example-2" || kind === "fraction-6-mission-1") {
    const [denominator, sum, difference] = values;
    if ((sum + difference) % 2 || (sum - difference) % 2 || sum <= difference) return "AMBIGUOUS";
    const larger = (sum + difference) / 2;
    const smaller = (sum - difference) / 2;
    if (larger + smaller !== sum || larger - smaller !== difference) return "AMBIGUOUS";
    return `${mixed(larger, denominator)}, ${mixed(smaller, denominator)}`;
  }
  if (kind === "fraction-6-example-3") {
    const [denominator, balls, removed, initial, after] = values;
    if ((initial - after) % removed) return "AMBIGUOUS";
    const ball = (initial - after) / removed;
    const oneBallBox = after - (balls - removed - 1) * ball;
    const emptyBox = oneBallBox - ball;
    if (ball <= 0 || emptyBox <= 0 || emptyBox + balls * ball !== initial || emptyBox + (balls - removed) * ball !== after) return "AMBIGUOUS";
    return mixed(oneBallBox, denominator);
  }
  if (kind === "fraction-6-example-4") {
    const [denominator, firstSecond, secondThird, firstThird] = values;
    const firstTwice = firstSecond + firstThird - secondThird;
    const secondTwice = firstSecond + secondThird - firstThird;
    const thirdTwice = firstThird + secondThird - firstSecond;
    if (firstTwice % 2 || secondTwice % 2 || thirdTwice % 2) return "AMBIGUOUS";
    const first = firstTwice / 2;
    const second = secondTwice / 2;
    const third = thirdTwice / 2;
    if (first <= 0 || second <= 0 || third <= 0 || first + second !== firstSecond || second + third !== secondThird || first + third !== firstThird) return "AMBIGUOUS";
    return `가=${mixed(first, denominator)}, 나=${mixed(second, denominator)}, 다=${mixed(third, denominator)}`;
  }
  if (kind === "fraction-6-mission-2") {
    const [denominator, correctSubtract, correctAdd, wrongAdd, wrongSubtract, wrongResult] = values;
    const original = wrongResult - wrongAdd + wrongSubtract;
    return mixed(original - correctSubtract + correctAdd, denominator);
  }
  if (kind === "fraction-6-mission-3") {
    const [denominator, sum, multiplier, offset] = values;
    const divisor = multiplier + 2;
    if ((sum + offset) % divisor) return "AMBIGUOUS";
    const first = (sum + offset) / divisor;
    const second = first * multiplier;
    const third = first - offset;
    if (first <= 0 || second <= 0 || third <= 0 || first + second + third !== sum || second !== first * multiplier || first - third !== offset) return "AMBIGUOUS";
    return `가=${mixed(first, denominator)}, 나=${mixed(second, denominator)}, 다=${mixed(third, denominator)}`;
  }
  if (kind === "fraction-6-mission-4") {
    const [denominator, firstSecond, secondThird, total] = values;
    const first = total - secondThird;
    const third = total - firstSecond;
    const second = firstSecond - first;
    if (first <= 0 || second <= 0 || third <= 0 || first + second !== firstSecond || second + third !== secondThird || first + second + third !== total || second % first) return "AMBIGUOUS";
    return String(second / first);
  }
  if (kind === "fraction-6-mission-5") {
    const [leftMultiplier, leftAdd, rightMultiplier, rightAdd, differenceWhole, differenceNumerator, lowerBound] = values;
    const coefficient = leftMultiplier - rightMultiplier - differenceWhole;
    const constant = leftAdd - rightAdd - differenceNumerator;
    if (!coefficient) return "AMBIGUOUS";
    const candidates = [];
    for (let symbol = lowerBound + 1; symbol <= 1000; symbol += 1) if (coefficient * symbol + constant === 0) candidates.push(symbol);
    return candidates.length === 1 ? String(candidates[0]) : "AMBIGUOUS";
  }
  if (kind === "fraction-6-mission-6") {
    const [denominator, total, left, equalTriangleSegments] = values;
    if ((total - left) % equalTriangleSegments) return "AMBIGUOUS";
    const triangle = (total - left) / equalTriangleSegments;
    const square = left - triangle;
    if (triangle <= 0 || square <= 0 || square + triangle !== left || square + triangle * (equalTriangleSegments + 1) !== total) return "AMBIGUOUS";
    return mixed(square, denominator);
  }
  if (kind === "card-fractions") {
    let count = 0;
    values.forEach(numerator => values.forEach(denominator => {
      if (numerator < denominator && numerator * 2 > denominator) count += 1;
    }));
    return String(count);
  }
  if (kind === "largest-mixed-card") {
    let best = null;
    values.forEach(whole => values.forEach(numerator => values.forEach(denominator => {
      if (new Set([whole, numerator, denominator]).size !== 3 || numerator >= denominator) return;
      const value = whole + numerator / denominator;
      if (!best || value > best.value) best = { whole, numerator, denominator, value };
    })));
    return mixed(best.whole * best.denominator + best.numerator, best.denominator);
  }
  if (kind === "quotient-remainder-count") return String(values[2] - values[1]);
  if (kind === "mixed-between") return String(values[3] - values[2]);
  if (kind === "three-related-fractions") {
    const [denominator, up, down, sum] = values;
    const middle = (sum - up + down) / 3;
    return `${middle + up}/${denominator}, ${middle}/${denominator}, ${middle - down}/${denominator}`;
  }
  if (kind === "conditioned-improper-count") {
    const [denominator, remainder, maxQuotient] = values;
    let count = 0;
    for (let numerator = 10; numerator < denominator * (maxQuotient + 1); numerator += 1) {
      if (numerator > denominator && Math.floor(numerator / denominator) <= maxQuotient && numerator % denominator === remainder && gcd(numerator, denominator) === 1) count += 1;
    }
    return String(count);
  }
  if (kind === "expression-order") {
    const labels = ["㉠", "㉡", "㉢", "㉣"];
    return values.slice(2).map((value, index) => ({ value, label: labels[index] })).sort((a, b) => a.value - b.value).map(item => item.label).join(", ");
  }
  if (kind === "time-sum-difference") {
    const [denominator, total, difference] = values;
    return `${mixed((total + difference) / 2, denominator)}시간, ${mixed((total - difference) / 2, denominator)}시간`;
  }
  if (kind === "route-total") return mixed(values[1] + values[2] + values[3], values[0]);
  if (kind === "day-night") {
    const day = (1440 - values[0]) / 2;
    const night = day + values[0];
    return `${Math.floor(day / 60)}시간 ${day % 60}분, ${Math.floor(night / 60)}시간 ${night % 60}분`;
  }
  if (kind === "clock-end") {
    const end = values[0] + values[1] * 60 / values[2];
    return `${Math.floor(end / 60)}시 ${end % 60}분`;
  }
  if (kind === "symbol-operation") return mixed(values[1] + values[2] + values[3] - 2 * values[4], values[0]);
  if (kind === "overlap-tape") return mixed(values[1] * values[2] - (values[1] - 1) * values[3], values[0]);
  if (kind === "salt-water") return mixed(values[1] * (values[0] - values[2]), values[0] * values[0]);
  if (kind === "wheel-distance") return mixed(Math.abs(values[1] * values[2] - values[3] * values[4]), values[0]);
  if (kind === "two-fraction-numerators") return `${(values[1] + values[2]) / 2}/${values[0]}, ${(values[1] - values[2]) / 2}/${values[0]}`;
  if (kind === "clock-difference") return String(values[1] * (values[2] + values[3]) / values[0]);
  if (kind === "fraction-sequence-sum") return mixed(values[1] * (values[1] + 1) / 2 * values[0] + values[1] * values[2], values[0]);
  if (kind === "fraction-inequality") return String(Array.from({ length: values[3] * values[0] }, (_, index) => index + 1).filter(value => values[2] * values[0] < value + values[1] && value + values[1] < values[3] * values[0]).length);
  if (kind === "arithmetic-fraction-sequence") return mixed(values[1] + values[2] * values[3], values[0]);
  if (kind === "card-fraction-sums") {
    const cards = values.slice(0, values.indexOf(-1));
    const sums = new Set();
    cards.forEach(a => cards.forEach(b => cards.forEach(c => cards.forEach(d => {
      if (new Set([a, b, c, d]).size !== 4 || a >= b || c >= d) return;
      const numerator = a * d + c * b;
      const denominator = b * d;
      if (numerator <= denominator) return;
      const divisor = gcd(numerator, denominator);
      sums.add(`${numerator / divisor}/${denominator / divisor}`);
    }))));
    return String(sums.size);
  }
  if (kind === "grouped-fraction-term") {
    const [target, group, position] = values;
    check((group - 1) * group / 2 < target && target <= group * (group + 1) / 2, `묶음 위치가 잘못되었습니다: ${values}`);
    return mixed((group - position + 1) * group + position, group);
  }
  if (kind === "same-denominator-symbol") return String(values.slice(1).reduce((sum, value) => sum + value, 0) / values[0]);
  if (kind === "two-grouped-terms") return mixed(values[2] * values[5] + values[4] * values[3], values[3] * values[5]);
  if (kind === "sum-difference") return `${mixed((values[1] + values[2]) / 2, values[0])}, ${mixed((values[1] - values[2]) / 2, values[0])}`;
  if (kind === "wrong-operation") return mixed(values[2] - values[1] * 2, values[0]);
  if (kind === "pairwise-sums" || kind === "three-object-weights") {
    const [denominator, ab, bc, ac] = values;
    const a = (ab + ac - bc) / 2;
    const b = (ab + bc - ac) / 2;
    const c = (ac + bc - ab) / 2;
    const suffix = kind === "three-object-weights" ? "kg" : "";
    return `${mixed(a, denominator)}${suffix}, ${mixed(b, denominator)}${suffix}, ${mixed(c, denominator)}${suffix}`;
  }
  if (kind === "same-symbol-equation") return String((values[3] - values[2] * values[1]) / (values[2] * (values[0] - 1)));
  if (kind === "equal-number-line") return mixed(values[0] * values[3], values[1] * values[2]);
  return null;
};

const expectedSourceItems = [
  ["4-2-fraction-1-exploration", "exploration", 2, 6],
  ["4-2-fraction-1-example-1", "example", 2, 6],
  ["4-2-fraction-1-example-2", "example", 2, 6],
  ["4-2-fraction-1-example-3", "example", 2, 6],
  ["4-2-fraction-1-example-4", "example", 2, 6],
  ["4-2-fraction-1-mission-1", "mission", 3, 7],
  ["4-2-fraction-1-mission-2", "mission", 3, 7],
  ["4-2-fraction-1-mission-3", "mission", 3, 7],
  ["4-2-fraction-1-mission-4", "mission", 3, 7],
  ["4-2-fraction-1-mission-5", "mission", 3, 7],
  ["4-2-fraction-1-mission-6", "mission", 3, 7]
];

const sourceGroupTwo = unit.subunits[1];
const expectedSourceItemsGroupTwo = [
  ["4-2-fraction-2-exploration", "exploration", 4, 8],
  ["4-2-fraction-2-example-1", "example", 4, 8],
  ["4-2-fraction-2-example-2", "example", 4, 8],
  ["4-2-fraction-2-example-3", "example", 4, 8],
  ["4-2-fraction-2-example-4", "example", 4, 8],
  ["4-2-fraction-2-mission-1", "mission", 5, 9],
  ["4-2-fraction-2-mission-2", "mission", 5, 9],
  ["4-2-fraction-2-mission-3", "mission", 5, 9],
  ["4-2-fraction-2-mission-4", "mission", 5, 9],
  ["4-2-fraction-2-mission-5", "mission", 5, 9],
  ["4-2-fraction-2-mission-6", "mission", 5, 9]
];
const sourceGroupThree = unit.subunits[2];
const expectedSourceItemsGroupThree = [
  ["4-2-fraction-3-exploration", "exploration", 6, 10],
  ["4-2-fraction-3-example-1", "example", 6, 10],
  ["4-2-fraction-3-example-2", "example", 6, 10],
  ["4-2-fraction-3-example-3", "example", 6, 10],
  ["4-2-fraction-3-example-4", "example", 6, 10],
  ["4-2-fraction-3-mission-1", "mission", 7, 11],
  ["4-2-fraction-3-mission-2", "mission", 7, 11],
  ["4-2-fraction-3-mission-3", "mission", 7, 11],
  ["4-2-fraction-3-mission-4", "mission", 7, 11],
  ["4-2-fraction-3-mission-5", "mission", 7, 11],
  ["4-2-fraction-3-mission-6", "mission", 7, 11]
];
const sourceGroupFour = unit.subunits[3];
const expectedSourceItemsGroupFour = [
  ["4-2-fraction-4-exploration", "exploration", 8, 12],
  ["4-2-fraction-4-example-1", "example", 8, 12],
  ["4-2-fraction-4-example-2", "example", 8, 12],
  ["4-2-fraction-4-example-3", "example", 8, 12],
  ["4-2-fraction-4-example-4", "example", 8, 12],
  ["4-2-fraction-4-mission-1", "mission", 9, 13],
  ["4-2-fraction-4-mission-2", "mission", 9, 13],
  ["4-2-fraction-4-mission-3", "mission", 9, 13],
  ["4-2-fraction-4-mission-4", "mission", 9, 13],
  ["4-2-fraction-4-mission-5", "mission", 9, 13],
  ["4-2-fraction-4-mission-6", "mission", 9, 13]
];
const sourceGroupFive = unit.subunits[4];
const expectedSourceItemsGroupFive = [
  ["4-2-fraction-5-exploration", "exploration", 10, 14],
  ["4-2-fraction-5-example-1", "example", 10, 14],
  ["4-2-fraction-5-example-2", "example", 10, 14],
  ["4-2-fraction-5-example-3", "example", 10, 14],
  ["4-2-fraction-5-example-4", "example", 10, 14],
  ["4-2-fraction-5-mission-1", "mission", 11, 15],
  ["4-2-fraction-5-mission-2", "mission", 11, 15],
  ["4-2-fraction-5-mission-3", "mission", 11, 15],
  ["4-2-fraction-5-mission-4", "mission", 11, 15],
  ["4-2-fraction-5-mission-5", "mission", 11, 15],
  ["4-2-fraction-5-mission-6", "mission", 11, 15]
];
const sourceGroupSix = unit.subunits[5];
const expectedSourceItemsGroupSix = [
  ["4-2-fraction-6-exploration", "exploration", 12, 16],
  ["4-2-fraction-6-example-1", "example", 12, 16],
  ["4-2-fraction-6-example-2", "example", 12, 16],
  ["4-2-fraction-6-example-3", "example", 12, 16],
  ["4-2-fraction-6-example-4", "example", 12, 16],
  ["4-2-fraction-6-mission-1", "mission", 13, 17],
  ["4-2-fraction-6-mission-2", "mission", 13, 17],
  ["4-2-fraction-6-mission-3", "mission", 13, 17],
  ["4-2-fraction-6-mission-4", "mission", 13, 17],
  ["4-2-fraction-6-mission-5", "mission", 13, 17],
  ["4-2-fraction-6-mission-6", "mission", 13, 17]
];

check(sourceGroup.types.length === 11, `개념탐구 1 유형 수가 11개가 아닙니다: ${sourceGroup.types.length}`);
expectedSourceItems.forEach(([sourceItemId, sourceSection, pdfPage, printedPage], index) => {
  const type = sourceGroup.types[index];
  check(Boolean(type), `개념탐구 1의 ${index + 1}번째 유형이 없습니다.`);
  if (!type) return;
  check(type.variant === index, `${type.id}: 변형 번호가 ${index}이 아닙니다: ${type.variant}`);
  check(type.generatorKey === "fractionUnderstanding", `${type.id}: 생성기 키가 fractionUnderstanding이 아닙니다.`);
  check(type.sourceItemId === sourceItemId, `${type.id}: 출처 ID가 다릅니다: ${type.sourceItemId}`);
  check(type.sourceSection === sourceSection, `${type.id}: 출처 구역이 다릅니다: ${type.sourceSection}`);
  check(type.sourcePdfPage === pdfPage, `${type.id}: PDF 쪽이 다릅니다: ${type.sourcePdfPage}`);
  check(type.sourcePrintedPage === printedPage, `${type.id}: 교재 쪽이 다릅니다: ${type.sourcePrintedPage}`);
  check(type.sourceVerified === true, `${type.id}: 원문 확인 표시가 없습니다.`);
  check(type.reviewLocked === false, `${type.id}: 검수 완료 유형이 잠겨 있습니다.`);
  check(type.label.length >= 12, `${type.id}: 아이가 풀이 구조를 알기에는 유형 이름이 너무 짧습니다: ${type.label}`);
});
check(sourceGroupTwo.types.length === 11, `개념탐구 2 유형 수가 11개가 아닙니다: ${sourceGroupTwo.types.length}`);
expectedSourceItemsGroupTwo.forEach(([sourceItemId, sourceSection, pdfPage, printedPage], index) => {
  const type = sourceGroupTwo.types[index];
  check(Boolean(type), `개념탐구 2의 ${index + 1}번째 유형이 없습니다.`);
  if (!type) return;
  check(type.variant === index, `${type.id}: 변형 번호가 ${index}이 아닙니다: ${type.variant}`);
  check(type.generatorKey === "advancedFractionCompare", `${type.id}: 생성기 키가 advancedFractionCompare이 아닙니다.`);
  check(type.sourceItemId === sourceItemId, `${type.id}: 출처 ID가 다릅니다: ${type.sourceItemId}`);
  check(type.sourceSection === sourceSection, `${type.id}: 출처 구역이 다릅니다: ${type.sourceSection}`);
  check(type.sourcePdfPage === pdfPage, `${type.id}: PDF 쪽이 다릅니다: ${type.sourcePdfPage}`);
  check(type.sourcePrintedPage === printedPage, `${type.id}: 교재 쪽이 다릅니다: ${type.sourcePrintedPage}`);
  check(type.sourceVerified === true, `${type.id}: 원문 확인 표시가 없습니다.`);
  check(type.reviewLocked === false, `${type.id}: 검수 완료 유형이 잠겨 있습니다.`);
  check(type.label.length >= 12, `${type.id}: 아이가 풀이 구조를 알기에는 유형 이름이 너무 짧습니다: ${type.label}`);
});
check(sourceGroupThree.types.length === 11, `개념탐구 3 유형 수가 11개가 아닙니다: ${sourceGroupThree.types.length}`);
expectedSourceItemsGroupThree.forEach(([sourceItemId, sourceSection, pdfPage, printedPage], index) => {
  const type = sourceGroupThree.types[index];
  check(Boolean(type), `개념탐구 3의 ${index + 1}번째 유형이 없습니다.`);
  if (!type) return;
  check(type.variant === index, `${type.id}: 변형 번호가 ${index}이 아닙니다: ${type.variant}`);
  check(type.generatorKey === "fractionAddSubOneAdvanced", `${type.id}: 생성기 키가 fractionAddSubOneAdvanced가 아닙니다.`);
  check(type.sourceItemId === sourceItemId, `${type.id}: 출처 ID가 다릅니다: ${type.sourceItemId}`);
  check(type.sourceSection === sourceSection, `${type.id}: 출처 구역이 다릅니다: ${type.sourceSection}`);
  check(type.sourcePdfPage === pdfPage, `${type.id}: PDF 쪽이 다릅니다: ${type.sourcePdfPage}`);
  check(type.sourcePrintedPage === printedPage, `${type.id}: 교재 쪽이 다릅니다: ${type.sourcePrintedPage}`);
  check(type.sourceVerified === true, `${type.id}: 원문 확인 표시가 없습니다.`);
  check(type.reviewLocked === false, `${type.id}: 검수 완료 유형이 잠겨 있습니다.`);
  check(type.label.length >= 12, `${type.id}: 아이가 풀이 구조를 알기에는 유형 이름이 너무 짧습니다: ${type.label}`);
});
check(sourceGroupFour.types.length === 11, `개념탐구 4 유형 수가 11개가 아닙니다: ${sourceGroupFour.types.length}`);
expectedSourceItemsGroupFour.forEach(([sourceItemId, sourceSection, pdfPage, printedPage], index) => {
  const type = sourceGroupFour.types[index];
  check(Boolean(type), `개념탐구 4의 ${index + 1}번째 유형이 없습니다.`);
  if (!type) return;
  check(type.variant === index, `${type.id}: 변형 번호가 ${index}이 아닙니다: ${type.variant}`);
  check(type.generatorKey === "fractionAddSubTwoAdvanced", `${type.id}: 생성기 키가 fractionAddSubTwoAdvanced가 아닙니다.`);
  check(type.sourceItemId === sourceItemId, `${type.id}: 출처 ID가 다릅니다: ${type.sourceItemId}`);
  check(type.sourceSection === sourceSection, `${type.id}: 출처 구역이 다릅니다: ${type.sourceSection}`);
  check(type.sourcePdfPage === pdfPage, `${type.id}: PDF 쪽이 다릅니다: ${type.sourcePdfPage}`);
  check(type.sourcePrintedPage === printedPage, `${type.id}: 교재 쪽이 다릅니다: ${type.sourcePrintedPage}`);
  check(type.sourceVerified === true, `${type.id}: 원문 확인 표시가 없습니다.`);
  check(type.reviewLocked === false, `${type.id}: 검수 완료 유형이 잠겨 있습니다.`);
  check(type.label.length >= 12, `${type.id}: 아이가 풀이 구조를 알기에는 유형 이름이 너무 짧습니다: ${type.label}`);
});
check(sourceGroupFive.types.length === 11, `개념탐구 5 유형 수가 11개가 아닙니다: ${sourceGroupFive.types.length}`);
expectedSourceItemsGroupFive.forEach(([sourceItemId, sourceSection, pdfPage, printedPage], index) => {
  const type = sourceGroupFive.types[index];
  check(Boolean(type), `개념탐구 5의 ${index + 1}번째 유형이 없습니다.`);
  if (!type) return;
  check(type.variant === index, `${type.id}: 변형 번호가 ${index}이 아닙니다: ${type.variant}`);
  check(type.generatorKey === "conditionedFraction", `${type.id}: 생성기 키가 conditionedFraction이 아닙니다.`);
  check(type.sourceItemId === sourceItemId, `${type.id}: 출처 ID가 다릅니다: ${type.sourceItemId}`);
  check(type.sourceSection === sourceSection, `${type.id}: 출처 구역이 다릅니다: ${type.sourceSection}`);
  check(type.sourcePdfPage === pdfPage, `${type.id}: PDF 쪽이 다릅니다: ${type.sourcePdfPage}`);
  check(type.sourcePrintedPage === printedPage, `${type.id}: 교재 쪽이 다릅니다: ${type.sourcePrintedPage}`);
  check(type.sourceVerified === true, `${type.id}: 원문 확인 표시가 없습니다.`);
  check(type.reviewLocked === false, `${type.id}: 검수 완료 유형이 잠겨 있습니다.`);
  check(type.label.length >= 12, `${type.id}: 아이가 풀이 구조를 알기에는 유형 이름이 너무 짧습니다: ${type.label}`);
});
check(sourceGroupSix.types.length === 11, `개념탐구 6 유형 수가 11개가 아닙니다: ${sourceGroupSix.types.length}`);
expectedSourceItemsGroupSix.forEach(([sourceItemId, sourceSection, pdfPage, printedPage], index) => {
  const type = sourceGroupSix.types[index];
  check(Boolean(type), `개념탐구 6의 ${index + 1}번째 유형이 없습니다.`);
  if (!type) return;
  check(type.variant === index, `${type.id}: 변형 번호가 ${index}이 아닙니다: ${type.variant}`);
  check(type.generatorKey === "fractionWordEquation", `${type.id}: 생성기 키가 fractionWordEquation이 아닙니다.`);
  check(type.sourceItemId === sourceItemId, `${type.id}: 출처 ID가 다릅니다: ${type.sourceItemId}`);
  check(type.sourceSection === sourceSection, `${type.id}: 출처 구역이 다릅니다: ${type.sourceSection}`);
  check(type.sourcePdfPage === pdfPage, `${type.id}: PDF 쪽이 다릅니다: ${type.sourcePdfPage}`);
  check(type.sourcePrintedPage === printedPage, `${type.id}: 교재 쪽이 다릅니다: ${type.sourcePrintedPage}`);
  check(type.sourceVerified === true, `${type.id}: 원문 확인 표시가 없습니다.`);
  check(type.reviewLocked === false, `${type.id}: 검수 완료 유형이 잠겨 있습니다.`);
  check(type.label.length >= 12, `${type.id}: 아이가 풀이 구조를 알기에는 유형 이름이 너무 짧습니다: ${type.label}`);
});
unit.subunits.slice(6).forEach(subunit => check(subunit.types.length === 6, `${subunit.id}: 기존 6유형 구성이 바뀌었습니다.`));

const sourcePageAnswers = [
  600 / ((1 - 1 / 2) * (1 - 1 / 3) * (1 - 1 / 4)),
  18 / (1 - 2 / 5) / (1 - 1 / 3) + 5,
  (() => { const minji = 51 / (1 - 31 / 48); return minji + minji * 31 / 48 + (minji / 2 - 10); })(),
  (() => { const original = 1260 / ((1 - 1 / 4) * (1 - 2 / 5) * (1 - 3 / 4)); return original * (1 - 1 / 4) * (1 - 2 / 5) * 3 / 4 - original / 4; })(),
  391 / (4 / 3 + 3 / 2),
  mixed(1, 11 - 1),
  (() => { const total = (7 + 3) / (1 - 3 / 4 - 1 / 12); return total / 12 + 3; })(),
  (4500 / (1 - 1 / 4) - 2000) / ((1 - 1 / 2) * (1 - 1 / 2)),
  (() => { const added = 6; const initial = (added - added / 3) / (1 / 3 - 1 / 4); return initial + added; })(),
  (() => { const empty = (12340 * 3 - 35220) / 2; return empty + (35220 - empty) * 3 / 4; })(),
  700 / (3 / 2 - 4 / 3)
];
const expectedSourcePageAnswers = ["2400", "50", "299", "980", "138", "1/10", "8", "16000", "54", "26640", "4200"];
sourcePageAnswers.forEach((answer, index) => {
  const expected = expectedSourcePageAnswers[index];
  const matches = typeof answer === "number" ? Math.abs(answer - Number(expected)) < 1e-8 : answer === expected;
  check(matches, `원문 ${expectedSourceItems[index][0]} 독립 풀이 답이 다릅니다: ${answer}`);
});

const sourcePageTwoAnswers = [
  "가, 나, 다, 라, 마",
  "10",
  "17/6",
  "ㄱ>ㄷ>ㄴ",
  "18",
  "65 4/23, 2 34/65",
  "7 5/6",
  "14/17, 15/17, 16/17",
  "3, 4",
  "1 1/7, 1 4/7, 1 6/7",
  "6"
];
const sourcePageTwoCalculated = [
  (() => [[20, 7], [19, 6], [23, 7], [17, 5], [12, 5]].map(([numerator, denominator], index) => ({ label: ["가", "나", "다", "라", "마"][index], distance: Math.abs(numerator / denominator - 3) })).sort((left, right) => left.distance - right.distance).map(item => item.label).join(", "))(),
  (() => { const cards = [4, 5, 6, 7, 8]; let count = 0; cards.forEach(numerator => cards.forEach(denominator => { if (numerator > denominator) count += 1; })); return String(count); })(),
  reducedFraction(2 * 6 + 5, 6),
  "ㄱ>ㄷ>ㄴ",
  (() => { let count = 0; for (let left = 1; left < 4; left += 1) for (let whole = 2; whole <= 4; whole += 1) for (let middle = 1; middle < 4; middle += 1) if (2 + left / 4 < whole + middle / 4 && whole + middle / 4 < 4 + 3 / 4) count += 1; return String(count); })(),
  (() => { const cards = [2, 3, 4, 5, 6]; return evidenceAnswer("fraction-2-mission-1", cards); })(),
  evidenceAnswer("fraction-2-mission-2", [2, 4, 5, 6, 7, 8]),
  evidenceAnswer("fraction-2-mission-3", [17, 5, 4]),
  evidenceAnswer("fraction-2-mission-4", [7, 20, 40]),
  evidenceAnswer("fraction-2-mission-5", [7, 3, 2, 8, 11, 13]),
  evidenceAnswer("fraction-2-mission-6", [8, 3, 7, 12])
];
sourcePageTwoCalculated.forEach((answer, index) => check(answer === sourcePageTwoAnswers[index], `원문 ${expectedSourceItemsGroupTwo[index][0]} 독립 풀이 답이 다릅니다: ${answer}`));

const sourcePageThreeAnswers = [
  "1 5/13, 7 1/5, 9 1/3, 4 1/4, 2 4/5, 2 3/7",
  "2 1/3",
  "민주가 1 2/5m",
  "1 6/7",
  "4 1/6",
  "ㄷ → ㄱ → ㄹ → ㄴ",
  "9 7/20",
  "3 8/15",
  "2시간 30분",
  "오후 2시",
  "3 1/5"
];
const sourcePageThreeCalculated = [
  evidenceAnswer("fraction-3-exploration", [8, 13, 1, 10, 32, 5, 1, 4, 31, 9, 1, 53, 61, 8, -1, 27, 32, 5, -1, 18, 23, 7, -1, 6]),
  evidenceAnswer("fraction-3-example-1", [109, 101, 175, 15]),
  evidenceAnswer("fraction-3-example-2", [19, 26, 5, 1]),
  evidenceAnswer("fraction-3-example-3", [26, 19, 3, 5, 7]),
  evidenceAnswer("fraction-3-example-4", [6, 4, 1, 7, 5]),
  evidenceAnswer("fraction-3-mission-1", [51, 46, 56, 50]),
  evidenceAnswer("fraction-3-mission-2", [67, 31, 89, 20]),
  evidenceAnswer("fraction-3-mission-3", [198, 145, 15]),
  evidenceAnswer("fraction-3-mission-4", [43, 53, 4]),
  evidenceAnswer("fraction-3-mission-5", [9, 6, 1, 7, 8]),
  evidenceAnswer("fraction-3-mission-6", [49, 81, 10])
];
sourcePageThreeCalculated.forEach((answer, index) => check(answer === sourcePageThreeAnswers[index], `원문 ${expectedSourceItemsGroupThree[index][0]} 독립 풀이 답이 다릅니다: ${answer}`));

const sourcePageFourAnswers = [
  "104 5/6",
  "55 3/4",
  "23",
  "16분 40초",
  "3 6/7",
  "49",
  "4/5",
  "57 1/2",
  "126",
  "14분",
  "210 40/43"
];
const sourcePageFourCalculated = [
  evidenceAnswer("fraction-4-exploration", [10, 30, 1, 2, 1, 3]),
  evidenceAnswer("fraction-4-example-1", [4, 5, 47, 3]),
  evidenceAnswer("fraction-4-example-2", [9, 272, 15, 25, 39]),
  evidenceAnswer("fraction-4-example-3", [4, 6, 17, 8]),
  evidenceAnswer("fraction-4-example-4", [7, 71, 17]),
  evidenceAnswer("fraction-4-mission-1", [7, 2, 3, 14]),
  evidenceAnswer("fraction-4-mission-2", [5, 4, 15]),
  evidenceAnswer("fraction-4-mission-3", [8, 4, 128, 13]),
  evidenceAnswer("fraction-4-mission-4", [11, 21, 6]),
  evidenceAnswer("fraction-4-mission-5", [3, 6, 2, 13, 12]),
  evidenceAnswer("fraction-4-mission-6", [43, 20, 1, 3])
];
sourcePageFourCalculated.forEach((answer, index) => check(answer === sourcePageFourAnswers[index], `원문 ${expectedSourceItemsGroupFour[index][0]} 독립 풀이 답이 다릅니다: ${answer}`));

const sourcePageFiveAnswers = [
  "7 1/4, 2",
  "22",
  "3 5/7",
  "ㄱ=3, ㄴ=4",
  "61",
  "5",
  "25",
  "3 1/2, 3 3/4",
  "ㄱ=35, ㄴ=16",
  "101",
  "15 2/7"
];
const sourcePageFiveCalculated = [
  evidenceAnswer("fraction-5-exploration", [30, 55]),
  evidenceAnswer("fraction-5-example-1", [25, 100, 78]),
  evidenceAnswer("fraction-5-example-2", [7, 6, 14]),
  evidenceAnswer("fraction-5-example-3", [5, 5, 3, 9]),
  evidenceAnswer("fraction-5-example-4", [30]),
  evidenceAnswer("fraction-5-mission-1", [7, 12, 25, 59, 3]),
  evidenceAnswer("fraction-5-mission-2", [13, 2]),
  evidenceAnswer("fraction-5-mission-3", [8, 32, 9, 19, 29, 39, 48]),
  evidenceAnswer("fraction-5-mission-4", [3, 4, 9, 63]),
  evidenceAnswer("fraction-5-mission-5", [100]),
  evidenceAnswer("fraction-5-mission-6", [27, 37])
];
sourcePageFiveCalculated.forEach((answer, index) => check(answer === sourcePageFiveAnswers[index], `원문 ${expectedSourceItemsGroupFive[index][0]} 독립 풀이 답이 다릅니다: ${answer}`));

const sourcePageSixAnswers = [
  "48 3/10",
  "3 5/12",
  "3 2/7, 1 4/7",
  "1",
  "가=2 11/13, 나=9/13, 다=3 6/13",
  "3 8/15, 1 2/3",
  "7 5/8",
  "가=4 10/17, 나=9 3/17, 다=7/17",
  "4",
  "9",
  "3 5/7"
];
const sourcePageSixCalculated = [
  evidenceAnswer("fraction-6-exploration", [10, 37, 12, 508]),
  evidenceAnswer("fraction-6-example-1", [12, 60, 67, 89, 41]),
  evidenceAnswer("fraction-6-example-2", [7, 34, 12]),
  evidenceAnswer("fraction-6-example-3", [10, 6, 2, 50, 34]),
  evidenceAnswer("fraction-6-example-4", [13, 46, 54, 82]),
  evidenceAnswer("fraction-6-mission-1", [15, 78, 28]),
  evidenceAnswer("fraction-6-mission-2", [8, 13, 59, 41, 31, 25]),
  evidenceAnswer("fraction-6-mission-3", [17, 241, 2, 71]),
  evidenceAnswer("fraction-6-mission-4", [3, 10, 32, 34]),
  evidenceAnswer("fraction-6-mission-5", [12, 5, 10, 7, 1, 7, 7]),
  evidenceAnswer("fraction-6-mission-6", [7, 83, 45, 2])
];
sourcePageSixCalculated.forEach((answer, index) => check(answer === sourcePageSixAnswers[index], `원문 ${expectedSourceItemsGroupSix[index][0]} 독립 풀이 답이 다릅니다: ${answer}`));

const seenKinds = new Set();
const sourcePromptVariants = new Map();
const sourceItemPattern = /^4-2-fraction-[1-6]-/;
const variedSourceItemPattern = /^4-2-fraction-[2-6]-/;
let generatedCount = 0;
for (const type of types) {
  for (const difficulty of [-1, 0, 1]) {
    for (let seed = 1; seed <= 350; seed += 1) {
      const context = `${type.id} / 난이도 ${difficulty} / 시드 ${seed}`;
      let generated;
      try {
        generated = api.generate(type, 0, difficulty, seed, type.variant);
      } catch (error) {
        failures.push(`${context}: ${error.message}`);
        continue;
      }
      check(Boolean(generated?.prompt && generated.answer && generated.solution), `${context}: 결과가 비어 있습니다.`);
      check(!/NaN|undefined|Infinity/.test(`${generated.prompt}${generated.answer}${generated.solution}`), `${context}: 계산값이 깨졌습니다.`);
      if (sourceItemPattern.test(type.sourceItemId)) {
        const visibleGeneratorText = `${generated.prompt}${generated.solution}`.replace(/<[^>]*>/g, "");
        check(!/\d+\s*\/\s*\d+/.test(visibleGeneratorText), `${context}: 세로 분수 도우미 대신 슬래시 분수 문자열이 보입니다.`);
        check(generated.prompt.includes('class="math-fraction"'), `${context}: 문제에 구조화된 분수 표시가 없습니다.`);
      }
      if (variedSourceItemPattern.test(type.sourceItemId)) {
        const promptText = generated.prompt.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
        if (!sourcePromptVariants.has(type.id)) sourcePromptVariants.set(type.id, new Set());
        sourcePromptVariants.get(type.id).add(promptText);
      }
      const tag = generated.prompt.match(/<span hidden data-fraction42-kind="[^"]+"[^>]*>/)?.[0];
      check(Boolean(tag), `${context}: 독립 검산 데이터가 없습니다.`);
      if (!tag) continue;
      const kind = attribute(tag, "data-fraction42-kind");
      const values = attribute(tag, "data-fraction42-values").split(",").map(Number);
      const declared = decodeURIComponent(attribute(tag, "data-fraction42-expected"));
      const independentlyCalculated = evidenceAnswer(kind, values);
      if (sourceItemPattern.test(type.sourceItemId)) check(kind === type.sourceItemId.replace("4-2-", ""), `${context}: 출처 ID와 생성 분기가 다릅니다: ${kind}`);
      seenKinds.add(kind);
      check(independentlyCalculated !== null, `${context}: 알 수 없는 검산 유형 ${kind}입니다.`);
      check(String(independentlyCalculated) === declared, `${context}: 내부 정답 ${declared}과 독립 계산 ${independentlyCalculated}이 다릅니다.`);
      check(String(generated.answer) === declared, `${context}: 표시 정답 ${generated.answer}과 검산 정답 ${declared}이 다릅니다.`);
      if (kind === "fraction-2-mission-5") {
        const [denominator, firstStep, secondStep, first] = values;
        const candidates = [];
        for (let candidate = denominator + 1; candidate < denominator * 2; candidate += 1) if (candidate + firstStep + secondStep < denominator * 2) candidates.push(candidate);
        check(firstStep + secondStep === denominator - 2, `${context}: 두 분자 차의 합이 유일성 조건과 다릅니다.`);
        check(candidates.length === 1 && candidates[0] === first, `${context}: 첫 분자 후보가 하나가 아닙니다: ${candidates.join(", ")}`);
      }
      if (kind === "fraction-3-mission-6") check(!String(generated.answer).startsWith("-"), `${context}: 두 값의 차가 음수입니다.`);
      if (kind === "fraction-5-example-1") check(values[2] % values[0] !== 0, `${context}: 두 분수의 차가 자연수로 축약되었습니다.`);
      if (kind === "fraction-5-example-3" || kind === "fraction-5-mission-3") check(independentlyCalculated !== "AMBIGUOUS", `${context}: 정답 후보가 하나로 정해지지 않습니다.`);
      if (kind === "fraction-5-mission-2") check(generated.prompt.includes("순서를 바꾸면 다른 경우"), `${context}: 순서쌍을 구분한다는 조건이 없습니다.`);
      if (kind === "fraction-5-mission-3") check(generated.prompt.includes("큰 수에서 작은 수"), `${context}: 뺄셈 순서가 명시되지 않았습니다.`);
      if (kind === "fraction-5-mission-5") check(generated.prompt.includes("모두 같은 자연수"), `${context}: 같은 기호의 뜻이 명시되지 않았습니다.`);
      if (kind === "fraction-5-exploration" || kind === "fraction-5-mission-6") check((generated.prompt.match(/class="sequence-group"/g) || []).length >= 4, `${context}: 묶음 경계가 충분히 표시되지 않았습니다.`);
      if (kind.startsWith("fraction-6-")) check(independentlyCalculated !== "AMBIGUOUS", `${context}: 조건으로 정답이 하나로 정해지지 않습니다.`);
      if (kind === "fraction-6-example-1") check(generated.prompt.includes("- {") && generated.prompt.includes("- ("), `${context}: 원문의 두 겹 괄호 위치가 유지되지 않았습니다.`);
      if (kind === "fraction-6-example-3") check(generated.prompt.includes("빈 상자의 무게가 아니라 공 1개가 든 상자의 무게"), `${context}: 공 1개가 든 상자를 묻는 조건이 분명하지 않습니다.`);
      if (kind === "fraction-6-mission-2") {
        check((generated.prompt.match(/class="calculation-line"/g) || []).length === 2, `${context}: 잘못한 식과 바른 식이 별도 줄로 구분되지 않았습니다.`);
        check(generated.prompt.includes("바르게 하려던 계산") && generated.prompt.includes("잘못한 계산"), `${context}: 두 계산의 이름이 분명하지 않습니다.`);
      }
      if (kind === "fraction-6-mission-5") {
        const [leftMultiplier, leftAdd, rightMultiplier, rightAdd, differenceWhole, differenceNumerator, lowerBound] = values;
        const candidates = [];
        for (let symbol = lowerBound + 1; symbol <= 1000; symbol += 1) if ((leftMultiplier - rightMultiplier - differenceWhole) * symbol + leftAdd - rightAdd - differenceNumerator === 0) candidates.push(symbol);
        check(candidates.length === 1 && String(candidates[0]) === declared, `${context}: ★ 자연수 후보가 하나가 아닙니다: ${candidates.join(", ")}`);
        check(generated.prompt.includes(`${lowerBound}보다 큰 자연수`), `${context}: ★의 자연수 범위가 지문에 없습니다.`);
      }
      if (kind === "fraction-6-mission-6") {
        check(generated.prompt.includes("[□+▲] | [▲] | [▲]") && generated.prompt.includes("같은 길이"), `${context}: 선분의 구간과 같은 기호 개수가 지문에 명시되지 않았습니다.`);
        check(!generated.prompt.includes("<svg"), `${context}: 선분 정보가 SVG에 의존합니다.`);
      }
      generatedCount += 1;
    }
  }
}

check(types.length === 66, `세부 유형 수가 66개가 아닙니다: ${types.length}`);
check(seenKinds.size === 66, `검산 유형 수가 66개가 아닙니다: ${seenKinds.size}`);
types.filter(type => variedSourceItemPattern.test(type.sourceItemId)).forEach(type => {
  const count = sourcePromptVariants.get(type.id)?.size || 0;
  check(count >= 24, `${type.id}: 350회 생성에서 본문 다양성이 부족합니다. 고유 문항 ${count}개`);
});
if (failures.length) {
  console.error(`4-2 분수 단원 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 30).join("\n"));
  process.exit(1);
}

console.log(`4-2 분수 단원 감사 통과: ${types.length}유형, ${generatedCount}개 생성, 검산 구조 ${seenKinds.size}종`);
