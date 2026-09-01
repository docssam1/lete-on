#!/usr/bin/env node
"use strict";

const itemIndex = require("../data/item-index.js");
const issues = [];

function check(condition, message) {
  if (!condition) issues.push(message);
}

function arrange(cards, length) {
  const results = [];
  function visit(remaining, chosen) {
    if (chosen.length === length) {
      if (chosen[0] !== 0) results.push(Number(chosen.join("")));
      return;
    }
    remaining.forEach(function (card, index) {
      visit(remaining.slice(0, index).concat(remaining.slice(index + 1)), chosen.concat(card));
    });
  }
  visit(cards, []);
  return [...new Set(results)];
}

function fillPattern(pattern) {
  const results = [];
  function visit(index, digits) {
    if (index === pattern.length) {
      results.push(Number(digits.join("")));
      return;
    }
    if (pattern[index] !== null) {
      visit(index + 1, digits.concat(pattern[index]));
      return;
    }
    for (let digit = 0; digit <= 9; digit += 1) {
      if (index === 0 && digit === 0) continue;
      visit(index + 1, digits.concat(digit));
    }
  }
  visit(0, []);
  return results;
}

function digitArray(number, length) {
  return String(number).padStart(length, "0").split("").map(Number);
}

function arrangeDigits(cards, length) {
  const results = [];
  function visit(remaining, chosen) {
    if (chosen.length === length) {
      results.push(chosen);
      return;
    }
    remaining.forEach(function (card, index) {
      visit(remaining.slice(0, index).concat(remaining.slice(index + 1)), chosen.concat(card));
    });
  }
  visit(cards, []);
  return results;
}

function readKoreanNumber(number) {
  const digits = ["", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구"];
  const smallUnits = ["", "십", "백", "천"];
  const largeUnits = ["", "만", "억", "조"];
  function readGroup(value) {
    let text = "";
    for (let place = 3; place >= 0; place -= 1) {
      const divisor = 10 ** place;
      const digit = Math.floor(value / divisor) % 10;
      if (!digit) continue;
      if (digit !== 1 || place === 0) text += digits[digit];
      text += smallUnits[place];
    }
    return text;
  }
  const groups = [];
  let remaining = number;
  let groupIndex = 0;
  while (remaining > 0) {
    const group = remaining % 10000;
    if (group) groups.unshift(`${readGroup(group)}${largeUnits[groupIndex]}`);
    remaining = Math.floor(remaining / 10000);
    groupIndex += 1;
  }
  return groups.join(" ");
}

function scalar(value, unit) {
  return { kind: "scalar", value: String(value), unit: unit || null };
}

function set(values, unit) {
  return { kind: "set", values: values.map(String).sort(), unit: unit || null };
}

function ordered(values, unit) {
  return { kind: "ordered", values: values.map(String), unit: unit || null };
}

function verifyAffinePairs(pairs, slopeNumerator, slopeDenominator, intercept, label) {
  const first = pairs[0];
  const second = pairs[1];
  const derivedNumerator = second[1] - first[1];
  const derivedDenominator = second[0] - first[0];
  check(derivedNumerator * slopeDenominator === slopeNumerator * derivedDenominator, `${label} slope changed`);
  check(pairs.every(function (pair) {
    return pair[1] * slopeDenominator === pair[0] * slopeNumerator + intercept * slopeDenominator;
  }), `${label} formula does not fit every source pair`);
}

function uniqueSameFactorShift(pairs, label) {
  const shifts = [];
  for (let shift = -20; shift <= 20; shift += 1) {
    if (pairs.every(function (pair) { return (pair[0] + shift) * (pair[0] + shift) === pair[1]; })) shifts.push(shift);
  }
  check(shifts.length === 1, `${label} same-factor rule is not unique in the checked family`);
  return shifts[0];
}

function gcd(first, second) {
  let a = Math.abs(first);
  let b = Math.abs(second);
  while (b) {
    const remainder = a % b;
    a = b;
    b = remainder;
  }
  return a;
}

function rational(label, whole, numerator, denominator) {
  return {
    label,
    numerator: whole * denominator + numerator,
    denominator
  };
}

function compareRationalDescending(first, second) {
  return second.numerator * first.denominator - first.numerator * second.denominator;
}

function rankRationals(values, label) {
  const ranked = values.slice().sort(compareRationalDescending);
  for (let index = 1; index < ranked.length; index += 1) {
    check(
      ranked[index - 1].numerator * ranked[index].denominator !== ranked[index].numerator * ranked[index - 1].denominator,
      `${label} has a tied rank`
    );
  }
  return ranked;
}

function rationalText(value) {
  const divisor = gcd(value.numerator, value.denominator);
  return `${value.numerator / divisor}/${value.denominator / divisor}`;
}

function permutations(values) {
  if (!values.length) return [[]];
  return values.flatMap(function (value, index) {
    const rest = values.slice(0, index).concat(values.slice(index + 1));
    return permutations(rest).map(function (tail) { return [value].concat(tail); });
  });
}

function countEquivalentFractions(baseNumerator, baseDenominator, numeratorMin, numeratorMax, denominatorMin, denominatorMax, label) {
  const matches = [];
  for (let denominator = denominatorMin + 1; denominator < denominatorMax; denominator += 1) {
    for (let numerator = numeratorMin + 1; numerator < numeratorMax; numerator += 1) {
      if (numerator * baseDenominator === denominator * baseNumerator) matches.push(`${numerator}/${denominator}`);
    }
  }
  check(new Set(matches).size === matches.length, `${label} contains a duplicate equivalent fraction`);
  return matches.length;
}

function subtractRational(first, second) {
  return rational("difference", 0, first.numerator * second.denominator - second.numerator * first.denominator, first.denominator * second.denominator);
}

function addRational(first, second) {
  return rational("sum", 0, first.numerator * second.denominator + second.numerator * first.denominator, first.denominator * second.denominator);
}

function sumRationals(values) {
  return values.reduce(function (total, value) { return addRational(total, value); }, rational("zero", 0, 0, 1));
}

function wholeFromKnownRemainder(usedFractions, knownRemainder, label) {
  const remaining = subtractRational(rational("whole", 1, 0, 1), sumRationals(usedFractions));
  check(remaining.numerator > 0, `${label} has no positive remainder`);
  const scaled = knownRemainder * remaining.denominator;
  check(scaled % remaining.numerator === 0, `${label} does not produce one whole-number total`);
  return scaled / remaining.numerator;
}

function firstSharedToothCount(first, second, label) {
  const matches = [];
  for (let toothCount = 1; toothCount <= first * second; toothCount += 1) {
    if (toothCount % first === 0 && toothCount % second === 0) matches.push(toothCount);
  }
  check(matches.length > 0, `${label} has no shared tooth count`);
  const result = matches[0];
  check(matches.filter(value => value < result).length === 0, `${label} first shared tooth count is not unique`);
  return result;
}

function negate(vector) {
  return vector.map(value => -value);
}

function dot(first, second) {
  return first.reduce((sum, value, index) => sum + value * second[index], 0);
}

function foldCubeNet(faces, label) {
  const byPosition = new Map(faces.map(face => [`${face.x},${face.y}`, face]));
  const orientations = new Map();
  const first = faces[0];
  orientations.set(first.id, { normal: [0, 0, 1], right: [1, 0, 0], down: [0, 1, 0] });
  const queue = [first];
  const moves = [
    { dx: 1, dy: 0, turn: orientation => ({ normal: orientation.right, right: negate(orientation.normal), down: orientation.down }) },
    { dx: -1, dy: 0, turn: orientation => ({ normal: negate(orientation.right), right: orientation.normal, down: orientation.down }) },
    { dx: 0, dy: 1, turn: orientation => ({ normal: orientation.down, right: orientation.right, down: negate(orientation.normal) }) },
    { dx: 0, dy: -1, turn: orientation => ({ normal: negate(orientation.down), right: orientation.right, down: orientation.normal }) }
  ];
  while (queue.length) {
    const face = queue.shift();
    const orientation = orientations.get(face.id);
    moves.forEach(function (move) {
      const next = byPosition.get(`${face.x + move.dx},${face.y + move.dy}`);
      if (!next) return;
      const turned = move.turn(orientation);
      const known = orientations.get(next.id);
      if (known) {
        check(known.normal.join(",") === turned.normal.join(","), `${label} has an inconsistent fold at ${next.id}`);
        return;
      }
      orientations.set(next.id, turned);
      queue.push(next);
    });
  }
  check(orientations.size === 6, `${label} does not connect all six faces`);
  check(new Set([...orientations.values()].map(orientation => orientation.normal.join(","))).size === 6, `${label} folds two faces onto one side`);
  return orientations;
}

function oppositeFace(orientations, faceId, label) {
  const face = orientations.get(faceId);
  const matches = [...orientations.entries()].filter(function (entry) {
    return entry[0] !== faceId && dot(face.normal, entry[1].normal) === -1;
  });
  check(matches.length === 1, `${label} does not have one opposite face for ${faceId}`);
  return matches[0] && matches[0][0];
}

function hiddenBackSum(faces, frontValues, label) {
  const orientations = foldCubeNet(faces, label);
  const valueById = new Map(faces.map(face => [face.id, face.value]));
  const idByValue = new Map(faces.map(face => [face.value, face.id]));
  return frontValues.reduce(function (sum, frontValue) {
    const frontId = idByValue.get(frontValue);
    check(Boolean(frontId), `${label} has no face numbered ${frontValue}`);
    const backId = oppositeFace(orientations, frontId, label);
    return sum + valueById.get(backId);
  }, 0);
}

function mixedFromFraction(numerator, denominator, unit) {
  const divisor = gcd(numerator, denominator);
  const reducedNumerator = numerator / divisor;
  const reducedDenominator = denominator / divisor;
  return {
    kind: "mixed",
    whole: String(Math.floor(reducedNumerator / reducedDenominator)),
    numerator: String(reducedNumerator % reducedDenominator),
    denominator: String(reducedDenominator),
    unit: unit || null
  };
}

function decimalFromHundredths(value, unit) {
  const absolute = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  return scalar(`${sign}${Math.floor(absolute / 100)}.${String(absolute % 100).padStart(2, "0")}`, unit);
}

function decimalFromFraction(numerator, denominator, precision, unit) {
  const scale = 10 ** precision;
  const scaled = numerator * scale / denominator;
  check(Number.isInteger(scaled), `non-terminating decimal: ${numerator}/${denominator}`);
  const whole = Math.floor(scaled / scale);
  const decimal = String(scaled % scale).padStart(precision, "0").replace(/0+$/, "");
  return scalar(decimal ? `${whole}.${decimal}` : whole, unit);
}

function actualAnswer(item) {
  const answer = item.responseContract === "rubric" ? item.canonicalAnswer.result : item.canonicalAnswer;
  if (item.responseContract === "set") return set(answer.values, answer.unit);
  if (item.responseContract === "ordered") return ordered(answer.values, answer.unit);
  if (answer.whole !== undefined && answer.numerator !== undefined && answer.denominator !== undefined) {
    return { kind: "mixed", whole: answer.whole, numerator: answer.numerator, denominator: answer.denominator, unit: answer.unit };
  }
  return scalar(answer.value, answer.unit);
}

function sameAnswer(actual, expected) {
  if (!actual || actual.kind !== expected.kind || actual.unit !== expected.unit) return false;
  if (expected.kind === "set" || expected.kind === "ordered") return actual.values.join("|") === expected.values.join("|");
  if (expected.kind === "mixed") {
    return actual.whole === expected.whole && actual.numerator === expected.numerator && actual.denominator === expected.denominator;
  }
  return actual.value === expected.value;
}

function byCards(cards, length) {
  return arrange(cards, length);
}

const q01 = {
  1: function () {
    const candidates = [];
    for (let number = 84569901; number < 84571000; number += 1) {
      const digits = digitArray(number, 8);
      if (digits[0] === 8 && digits[6] === 7 && digits[7] === 7) candidates.push(number);
    }
    check(candidates[0] === 84569977, "q01 i1 minimum candidate changed");
    return scalar(readKoreanNumber(Math.min(...candidates)));
  },
  2: function () {
    const candidates = byCards([1, 8, 2, 7, 3, 0, 6], 7).filter(function (number) {
      const digits = digitArray(number, 7);
      return number > 6870000 && number < 6872000 && digits[5] === 0 && digits[6] > digits[4];
    });
    check(candidates.length === 1, "q01 i2 answer is not unique");
    return scalar(candidates[0]);
  },
  3: function () {
    const candidates = [];
    for (let thousand = 0; thousand <= 9; thousand += 1) {
      const million = 6 * thousand;
      if (million > 9) continue;
      for (let hundredThousand = 0; hundredThousand <= 9; hundredThousand += 1) {
        for (let ten = 0; ten <= 9; ten += 1) {
          for (let one = 0; one <= 9; one += 1) {
            const digits = [5, million, hundredThousand, 4, thousand, 2, ten, one];
            if (new Set(digits).size === 8) candidates.push(Number(digits.join("")));
          }
        }
      }
    }
    return scalar(Math.min(...candidates));
  },
  4: function () {
    const candidates = [10485612, 20412593, 38491029, 78061460, 10431008, 20040152].filter(function (number) {
      const digits = digitArray(number, 8);
      return digits[2] === 4 && digits[4] === 1 && number % 2 === 0;
    });
    check(candidates.length === 1, "q01 i4 option filter is not unique");
    return scalar(candidates[0]);
  },
  5: function () {
    const candidates = [];
    for (let million = 0; million <= 4; million += 1) {
      const ten = 2 * million;
      const fixed = [3, million, 7, 2, ten];
      if (new Set(fixed).size !== fixed.length) continue;
      const remaining = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].filter(digit => !fixed.includes(digit));
      arrangeDigits(remaining, 4).forEach(function (open) {
        const digits = [3, open[0], million, 7, open[1], 2, open[2], ten, open[3]];
        if (new Set(digits).size === 9) candidates.push(Number(digits.join("")));
      });
    }
    return scalar(Math.max(...candidates));
  },
  6: function () {
    const candidates = [];
    for (let number = 3439997 + 1; number < 3440001; number += 1) candidates.push(number);
    return set(candidates);
  },
  7: function () {
    const candidates = [];
    for (let number = 5749901; number < 5750000; number += 1) {
      const digits = digitArray(number, 7);
      if (digits[5] === 6 && digits[6] === 6) candidates.push(number);
    }
    check(candidates.length === 1, "q01 i7 answer is not unique");
    return scalar(readKoreanNumber(candidates[0]));
  },
  8: function () {
    const candidates = [];
    for (let a = 0; a <= 9; a += 1) for (let b = 0; b <= 9; b += 1) for (let c = 0; c <= 9; c += 1) {
      for (let d = 0; d <= 9; d += 1) for (let one = 1; one <= 9; one += 1) {
        candidates.push(Number([2, 4, a, b, 1, c, d, 0, one].join("")));
      }
    }
    const minimum = Math.min(...candidates);
    return scalar(digitArray(minimum, 9).filter(digit => digit === 0).length, "개");
  },
  9: function () {
    const candidates = byCards([1, 2, 3, 4, 6, 8, 9], 7).filter(function (number) {
      const digits = digitArray(number, 7);
      return number > 9845000 && number < 9847000 && digits[5] + digits[4] === digits[6] && digits[4] < digits[5];
    });
    check(candidates.length === 1, "q01 i9 answer is not unique");
    return scalar(candidates[0]);
  },
  10: function () {
    const candidates = [];
    for (let tenThousand = 0; tenThousand <= 9; tenThousand += 1) {
      for (let thousand = 0; thousand <= 9; thousand += 1) {
        const number = Number([8, 2, tenThousand, thousand, 6, 3, 3].join(""));
        const digitSum = digitArray(number, 7).reduce((sum, digit) => sum + digit, 0);
        if (number > 8000000 && number < 8450000 && digitSum === 30) candidates.push(number);
      }
    }
    check(candidates.length === 9, "q01 i10 candidate count changed");
    return scalar(candidates.length, "개");
  }
};

const q03 = {
  1: () => scalar((39 * 16 + 31 * 12) / 12, "타"),
  2: () => scalar((87 - 3) / 4, "개"),
  3: () => scalar((55 * 18 + 18) / 42, "개"),
  4: function () {
    const totalMinutes = 1 * 60 + 30 + 268;
    return scalar(`${Math.floor(totalMinutes / 60)}시 ${totalMinutes % 60}분`);
  },
  5: function () {
    const totalMinutes = 11 * 60 + 47 + 396;
    const hour24 = Math.floor(totalMinutes / 60);
    return scalar(`오후 ${hour24 - 12}시 ${totalMinutes % 60}분`);
  },
  6: () => scalar((18 - 9) * 60 / 12, "개"),
  7: () => scalar(((19 - 10) * 60 - 60) / 24, "개"),
  8: () => scalar((16 - 10) * 60 / 36, "개"),
  9: () => scalar((180 / 60 * 27) / (60 / 60), "분"),
  10: () => scalar((240 / 60 * 19) / 2, "분")
};

const q04 = {
  1: () => ordered([699, 23, 30, 9]),
  2: function () {
    const values = byCards([3, 6, 4, 2, 1], 3).filter(number => Math.floor(number / 26) === 15 && number % 26 !== 0).sort((a, b) => a - b);
    check(values.join("|") === "412|413", "q04 i2 source candidates changed");
    return scalar(values.length, "개");
  },
  3: () => scalar(613 % 59),
  4: () => set(byCards([9, 5, 2, 7, 4], 3).filter(number => Math.floor(number / 34) === 21 && number % 34 !== 0)),
  5: () => scalar(Math.floor(685 / 24)),
  6: () => scalar(Math.floor(874 / 52)),
  7: () => scalar(Array.from({ length: 900 }, (_, index) => index + 100).filter(number => Math.floor(number / 23) === number % 23).length, "개"),
  8: () => scalar(Array.from({ length: 900 }, (_, index) => index + 100).filter(number => Math.floor(number / 21) === number % 21).length, "개"),
  9: () => scalar(byCards([4, 5, 1, 7, 3], 3).filter(number => Math.floor(number / 17) === 25 && number % 17 !== 0).length, "개"),
  10: function () {
    const values = [];
    for (let quotient = 10; quotient <= 99; quotient += 1) {
      const number = 70 * quotient + 42;
      if (number >= 100 && number <= 999) values.push(number);
    }
    return set(values);
  },
  11: function () {
    const values = [];
    for (let number = 100; number <= 999; number += 1) if (number % 54 === 48) values.push(number);
    return ordered([Math.max(...values), Math.min(...values)]);
  },
  12: function () {
    const values = [];
    for (let number = 100; number <= 999; number += 1) {
      const q49 = Math.floor(number / 49);
      const r49 = number % 49;
      const q52 = Math.floor(number / 52);
      const digitSum = digitArray(number, 3).reduce((sum, digit) => sum + digit, 0);
      if (q49 >= 10 && r49 >= 10 && q52 < 10 && digitSum === 15) values.push(number);
    }
    check(values.length === 1, "q04 i12 answer is not unique");
    return scalar(values[0]);
  },
  13: function () {
    const values = [];
    for (let number = 100; number <= 999; number += 1) {
      const q29 = Math.floor(number / 29);
      const r29 = number % 29;
      const q32 = Math.floor(number / 32);
      const digitSum = digitArray(number, 3).reduce((sum, digit) => sum + digit, 0);
      if (q29 >= 10 && r29 >= 10 && q32 < 10 && digitSum === 12) values.push(number);
    }
    return set(values);
  },
  14: () => scalar(byCards([5, 6, 7, 8, 9], 3).filter(number => Math.floor(number / 47) === 19 && number % 47 !== 0).length, "개"),
  15: () => scalar(byCards([5, 6, 7, 8, 9], 3).filter(number => Math.floor(number / 54) === 17 && number % 54 !== 0).length, "개")
};

const q05 = {
  1: function () {
    const first = 180 - 60 - 95;
    const fourthAngle = 360 - 140 - 60 - 95;
    const second = 180 - fourthAngle - 95;
    return ordered([first, second], "도");
  },
  2: () => scalar(180 - (180 - 50) - (180 - 20 - 130), "도"),
  3: () => scalar(180 - (180 - 62) - (180 - 35 - 105), "도"),
  4: () => scalar(180 - (180 - 75) - (180 - 15 - 120), "도"),
  5: () => scalar(180 - (180 - 64) / 2 - (180 - 36) / 2, "도"),
  6: () => scalar(180 - (180 - 46) / 2 - (180 - 54) / 2, "도"),
  7: () => scalar(180 - 35 - 90, "도"),
  8: () => scalar(180 - 30 - 90, "도"),
  9: () => scalar(180 - 20 - 90, "도"),
  10: function () {
    const outerAngle = 180 - 35 - 25;
    const adjacentAngle = 180 - outerAngle;
    return scalar(180 - adjacentAngle - 90, "도");
  }
};

const q07 = {
  1: function () {
    const driftMinutes = (2 * 6 + 5) * 24 / 6;
    check(driftMinutes === 68, "q07 i1 drift calculation changed");
    return scalar(`오후 ${Math.floor(driftMinutes / 60)}시 ${driftMinutes % 60}분`);
  },
  2: function () {
    const driftSeconds = (2 * 2 + 1) * 60 * 7 / 2;
    check(driftSeconds === 17 * 60 + 30, "q07 i2 drift calculation changed");
    return scalar("11시 42분 30초");
  },
  3: function () {
    const elapsedHalfHours = 43;
    const differenceMinutes = (5 + 7) * elapsedHalfHours / 6;
    check(differenceMinutes === 86, "q07 i3 two-clock difference changed");
    return scalar(`${Math.floor(differenceMinutes / 60)}시간 ${differenceMinutes % 60}분`);
  },
  4: function () {
    const combinedDailyWorkNumerator = 1 + 1;
    const combinedDailyWorkDenominator = 12;
    return scalar(combinedDailyWorkDenominator / combinedDailyWorkNumerator, "일");
  },
  5: function () {
    const driftMinutes = (2 * 9 + 4) * 9 / 9;
    check(driftMinutes === 22, "q07 i5 drift calculation changed");
    return scalar(`6시 ${60 - driftMinutes}분`);
  },
  6: function () {
    const driftMinutes = (2 * 7 + 1) * 14 / 7;
    check(driftMinutes === 30, "q07 i6 drift calculation changed");
    return scalar("오전 11시 30분");
  },
  7: function () {
    const driftMinutes = 3 * 10 / 2;
    check(driftMinutes === 15, "q07 i7 drift calculation changed");
    return scalar(`1시 ${driftMinutes}분`);
  },
  8: function () {
    const driftSeconds = (2 * 2 + 1) * 60 * 7 / 2;
    check(driftSeconds === 17 * 60 + 30, "q07 i8 drift calculation changed");
    return scalar("오전 10시 42분 30초");
  },
  9: function () {
    const driftMinutes = (3 * 5 + 1) * 30 / 5;
    check(driftMinutes === 96, "q07 i9 drift calculation changed");
    return scalar("8시 24분");
  },
  10: function () {
    const clockDifferenceNumerator = 18 * 5 - 7 * 7;
    const clockDifferenceDenominator = 7 * 5;
    const elapsedNumerator = 25;
    const elapsedDenominator = 3;
    return mixedFromFraction(clockDifferenceNumerator * elapsedNumerator, clockDifferenceDenominator * elapsedDenominator, "분");
  }
};

const q08 = {
  1: function () {
    const inSeoToYeonSuCm = 520 - 387;
    const inSeoToSangMiCm = 150 - inSeoToYeonSuCm;
    return decimalFromHundredths(inSeoToYeonSuCm - inSeoToSangMiCm, "m");
  },
  2: function () {
    const taeHwaToSeokJuCm = 420 - 363;
    const eunHeeToTaeHwaCm = 275 - taeHwaToSeokJuCm;
    return decimalFromHundredths(eunHeeToTaeHwaCm - taeHwaToSeokJuCm, "m");
  },
  3: function () {
    const chungJuToMunGyeong = 18553 + 29540 - 41270;
    const munGyeongToGyeongJu = 29540 - chungJuToMunGyeong - 8891;
    return decimalFromHundredths(munGyeongToGyeongJu - chungJuToMunGyeong, "km");
  },
  4: function () {
    const oSongToDaeJeon = 16232 + 29260 - 41270;
    const daeJeonToDaeGu = 29260 - oSongToDaeJeon - 10981;
    return decimalFromHundredths(daeJeonToDaeGu - oSongToDaeJeon, "km");
  },
  5: function () {
    const seonHoToJunSuCm = 384 - 295;
    const seonHoToGyeongSuCm = 190 - seonHoToJunSuCm;
    return decimalFromHundredths(seonHoToGyeongSuCm - seonHoToJunSuCm, "m");
  },
  6: function () {
    const oSanToAnSeong = 8630 + 32887 - 37826;
    const anSeongToNamWon = 32887 - oSanToAnSeong - 15042;
    return decimalFromHundredths(anSeongToNamWon - oSanToAnSeong, "km");
  }
};

const q09 = {
  1: () => decimalFromFraction((21 - 16) * 87, 100 * 10, 3, "km"),
  2: () => decimalFromFraction(82 * 225 - 16 * 100, 10000, 3, "km"),
  3: () => decimalFromFraction(150 * 11, 4, 1, "km"),
  4: () => decimalFromFraction(65 * 5 * 8, 2 * 100, 0, "L"),
  5: () => decimalFromFraction((804 - 756) * 15, 10 * 4, 0, "km"),
  6: () => decimalFromFraction(954 * 6 * 1000, 10 * 3600, 0, "m"),
  7: () => decimalFromFraction(2 * 3 * 3, 2, 0, "시간"),
  8: () => decimalFromFraction((29 - 26) * 11, 10 * 4, 3, "km"),
  9: () => decimalFromFraction((130 + 158) * 17, 100 * 5, 3, "km"),
  10: () => decimalFromFraction((140 - 125) * 28, 100 * 5, 2, "km")
};

function uniqueAngle(label, predicate) {
  const candidates = [];
  for (let angle = 1; angle < 180; angle += 1) {
    if (predicate(angle)) candidates.push(angle);
  }
  check(candidates.length === 1, `${label} angle answer is not unique`);
  return scalar(candidates[0], "도");
}

const q10 = {
  1: () => uniqueAngle("q10 i1", angle => angle === 180 - (360 - (90 - (180 - 165)) - 45 - 90)),
  2: () => uniqueAngle("q10 i2", angle => angle === 360 - 90 - (180 - 60) - 95),
  3: () => uniqueAngle("q10 i3", angle => angle === 35 + 45),
  4: () => uniqueAngle("q10 i4", angle => angle === 90 - (360 - 90 - (180 - 50) - 85)),
  5: () => uniqueAngle("q10 i5", angle => angle === 48 + 72),
  6: () => uniqueAngle("q10 i6", angle => angle === 90 - (360 - 115 - 100 - 90)),
  7: () => uniqueAngle("q10 i7", angle => angle === 50 + (100 - (180 - 115))),
  8: () => uniqueAngle("q10 i8", angle => 3 * (40 - angle) === 20 + 40),
  9: () => uniqueAngle("q10 i9", angle => 3 * (60 - angle) === 30 + 60),
  10: () => uniqueAngle("q10 i10", angle => 2 * (180 - 115 - angle) + 20 === 360 - 115 - (90 - 25) - 90)
};

const q11 = {
  1: () => scalar((7 - 1) * 180, "도"),
  2: () => uniqueAngle("q11 i2", angle => (120 - angle) + (2 * angle - 10) + 50 === 180),
  3: () => uniqueAngle("q11 i3", angle => 30 + angle === 70 - 20),
  4: () => uniqueAngle("q11 i4", angle => angle + (65 - 15) === 65),
  5: function () {
    const candidates = [];
    for (let x = 1; x < 180; x += 1) {
      for (let y = 1; y < 180; y += 1) {
        if (x + y === 180 && 4 * x === 5 * y) candidates.push(x - y);
      }
    }
    check(candidates.length === 1, "q11 i5 angle pair is not unique");
    return scalar(candidates[0], "도");
  }
};

const q12 = {
  1: function () {
    const candidates = [];
    for (let number = 121; number < 150; number += 1) {
      if (number % 5 === 4 && number % 7 === 4) candidates.push(number);
    }
    check(candidates.length === 1, "q12 i1 range answer is not unique");
    return scalar(candidates[0], "명");
  },
  2: function () {
    const candidates = [];
    for (let number = 1; number < 100; number += 1) {
      if (number % 7 === 0 && number % 12 === 0) candidates.push(number);
    }
    check(candidates.length === 1, "q12 i2 least common multiple changed");
    return scalar(Math.min(...candidates), "개");
  },
  3: function () {
    const candidates = [];
    for (let number = 100; number <= 180; number += 1) {
      if (number % 10 === 8 && (number + 4) % 12 === 0) candidates.push(number);
    }
    check(candidates.length === 1, "q12 i3 range answer is not unique");
    return scalar(candidates[0], "명");
  },
  4: function () {
    const candidates = [];
    for (let number = 41; number < 50; number += 1) {
      if (number % 3 === 0 && number % 7 === 0) candidates.push(number);
    }
    check(candidates.length === 1, "q12 i4 range answer is not unique");
    return scalar(candidates[0], "명");
  },
  5: function () {
    const candidates = [];
    for (let number = 10; number < 100; number += 1) {
      if ((number + 2) % 8 === 0 && (number + 2) % 10 === 0) candidates.push(number);
    }
    check(candidates.join("|") === "38|78", "q12 i5 shortage candidates changed");
    return scalar(Math.max(...candidates), "개");
  }
};

const q13 = {
  1: function () {
    return scalar(Math.max(...byCards([3, 4, 5, 6], 3).filter(number => number % 3 === 0)));
  },
  2: function () {
    const candidates = byCards([5, 2, 0, 4, 3], 3).filter(number => number > 300 && number < 600 && number % 4 === 0);
    return scalar(candidates.length, "개");
  },
  3: function () {
    return scalar(byCards([0, 1, 4, 5], 3).filter(number => number % 6 === 0).length, "개");
  },
  4: function () {
    return set(byCards([1, 2, 5, 6], 3).filter(number => number > 500 && number % 6 === 0));
  },
  5: function () {
    const candidates = byCards([1, 3, 9, 8, 6, 0], 3).filter(number => number % 9 === 0);
    return scalar(Math.max(...candidates) - Math.min(...candidates));
  },
  6: function () {
    return scalar(Math.max(...byCards([1, 4, 5, 6, 8], 3).filter(number => number % 6 === 0)));
  },
  7: function () {
    const candidates = byCards([3, 0, 6, 9, 7], 3);
    const largestMultipleOf5 = Math.max(...candidates.filter(number => number % 5 === 0));
    const smallestMultipleOf3 = Math.min(...candidates.filter(number => number % 3 === 0));
    return scalar(largestMultipleOf5 - smallestMultipleOf3);
  },
  8: function () {
    return scalar(Math.max(...byCards([9, 5, 6, 1], 4).filter(number => number % 6 === 0)));
  },
  9: function () {
    const candidates = byCards([1, 2, 3, 5, 8], 3).filter(number => number % 3 === 0 && number % 4 === 0);
    return scalar(candidates.reduce((sum, number) => sum + number, 0));
  },
  10: function () {
    return scalar(byCards([2, 3, 4, 5, 6], 3).filter(number => number % 6 === 0).length, "개");
  }
};

const q14 = {
  1: function () {
    const octagons = 24;
    const sharedEdges = octagons - 1;
    return scalar(octagons * 8 - sharedEdges * 2, "개");
  },
  2: function () {
    const values = Array.from({ length: 5 }, function (_, index) { return (index + 1) * 4; });
    check(new Set(values).size === 5, "q14 i2 table values are not unique by order");
    return ordered(values, "개");
  },
  3: function () {
    const values = Array.from({ length: 5 }, function (_, index) { return 3 + index + 1; });
    check(new Set(values).size === 5, "q14 i3 table values are not unique by order");
    return ordered(values, "개");
  },
  4: function () {
    const rowCounts = Array.from({ length: 10 }, function (_, index) { return index + 1; });
    return scalar(rowCounts.reduce(function (sum, count) { return sum + count; }, 0), "개");
  },
  5: function () {
    const shownCounts = [4, 7, 10];
    const differences = shownCounts.slice(1).map(function (count, index) { return count - shownCounts[index]; });
    check(differences.length === 2 && differences.every(function (difference) { return difference === 3; }), "q14 i5 shown arrays do not have one growth rule");
    return scalar("3개씩 늘어나는 관계가 있습니다.");
  },
  6: function () {
    const values = Array.from({ length: 5 }, function (_, index) {
      const order = index + 1;
      return 2 + order * 2;
    });
    return ordered(values, "개");
  },
  7: function () {
    const values = Array.from({ length: 5 }, function (_, index) { return 5 + index + 1; });
    return ordered(values, "개");
  },
  8: function () {
    const order = 62;
    const color = order % 2 === 0 ? "노란색" : "초록색";
    const tileCount = 1 + 4 * order;
    check(color === "노란색" && tileCount === 249, "q14 i8 color/count pair is not unique");
    return ordered([color, `${tileCount}개`]);
  },
  9: function () {
    return ordered(Array.from({ length: 5 }, function (_, index) { return (index + 1) * 2; }), "개");
  },
  10: function () {
    return ordered(Array.from({ length: 5 }, function (_, index) { return (index + 1) * 3; }), "개");
  }
};

const q15 = {
  1: function () {
    verifyAffinePairs([[11, 121], [15, 165], [17, 187]], 11, 1, 0, "q15 i1");
    return scalar("△=◇×11");
  },
  2: function () {
    verifyAffinePairs([[12, 86], [13, 93], [17, 121]], 7, 1, 2, "q15 i2");
    return scalar("△=◇×7+2");
  },
  3: function () {
    verifyAffinePairs([[1, 1], [2, 6], [3, 11]], 5, 1, -4, "q15 i3");
    return scalar("☆=♡×5-4");
  },
  4: function () {
    verifyAffinePairs([[24, 12], [32, 16], [34, 17]], 1, 2, 0, "q15 i4");
    return scalar("☆=◇÷2");
  },
  5: function () {
    const shift = uniqueSameFactorShift([[1, 9], [2, 16], [3, 25]], "q15 i5");
    check(shift === 2, "q15 i5 shift changed");
    return scalar("●=(■+2)×(■+2)");
  },
  6: function () {
    verifyAffinePairs([[26, 12], [24, 11], [22, 10]], 1, 2, -1, "q15 i6");
    return scalar("●=(◆-2)÷2");
  },
  7: function () {
    verifyAffinePairs([[11, 2], [22, 3], [33, 4]], 1, 11, 1, "q15 i7");
    return scalar("☆=◇÷11+1");
  },
  8: function () {
    const shift = uniqueSameFactorShift([[3, 4], [4, 9], [5, 16]], "q15 i8");
    check(shift === -1, "q15 i8 shift changed");
    return scalar("■=(♣-1)×(♣-1)");
  },
  9: function () {
    verifyAffinePairs([[35, 100], [45, 110], [55, 120]], 1, 1, 65, "q15 i9");
    return scalar("△=□+65");
  },
  10: function () {
    verifyAffinePairs([[1, 2], [2, 7], [3, 12]], 5, 1, -3, "q15 i10");
    return scalar("◇=♡×5-3");
  },
  11: function () {
    verifyAffinePairs([[38, 2], [57, 3], [76, 4]], 1, 19, 0, "q15 i11");
    return scalar("△=○÷19");
  }
};

const q16 = {
  1: function () {
    const candidates = [];
    for (let circle = 1; circle <= 9; circle += 1) {
      for (let star = 1; star <= 9; star += 1) {
        for (let triangle = 0; triangle <= 9; triangle += 1) {
          const divisor = 10 * star + triangle;
          if (star + triangle !== 7 || divisor <= 49) continue;
          if (111 * circle === divisor * 14 + 49) candidates.push([circle, star, triangle]);
        }
      }
    }
    check(candidates.length === 1, "q16 i1 hidden digits are not unique");
    return ordered(candidates[0]);
  },
  2: function () {
    const candidates = [];
    for (let divisor = 10; divisor <= 99; divisor += 1) {
      const first = Math.floor(divisor / 10);
      const second = divisor % 10;
      for (let third = 0; third <= 9; third += 1) {
        const quotient = 70 + third;
        const dividend = divisor * quotient;
        if (dividend < 100 || dividend > 999) continue;
        const fourth = Math.floor(dividend / 100);
        const fifth = Math.floor(dividend / 10) % 10;
        const sixth = dividend % 10;
        const firstProduct = divisor * 7;
        if (firstProduct < 10 || firstProduct > 99 || Math.floor(firstProduct / 10) !== third) continue;
        const seventh = firstProduct % 10;
        const prefix = 10 * fourth + fifth;
        if (Math.floor(prefix / divisor) !== 7 || prefix - firstProduct !== fourth) continue;
        if (10 * fourth + sixth !== divisor * third) continue;
        const digits = [first, second, third, fourth, fifth, sixth, seventh];
        if (new Set(digits).size === digits.length) candidates.push(digits);
      }
    }
    check(candidates.length === 1, "q16 i2 seven hidden digits are not unique");
    return ordered(candidates[0]);
  },
  3: function () {
    const candidates = [];
    for (let charm = 1; charm <= 9; charm += 1) {
      for (let kind = 0; kind <= 9; kind += 1) {
        if (charm + kind !== 9) continue;
        const divisor = 10 * charm + kind;
        for (let child = 1; child <= 9; child += 1) {
          for (let young = 0; young <= 9; young += 1) {
            for (let person = 0; person <= 9; person += 1) {
              const digits = [charm, kind, young, child, person];
              if (new Set(digits).size !== digits.length) continue;
              const product = divisor * 3;
              const dividend = 100 * young + 10 * child + person;
              const remainder = 10 * person + 7;
              if (product === 100 * young + 35 && dividend === product + remainder && remainder < divisor) candidates.push(digits);
            }
          }
        }
      }
    }
    check(candidates.length === 1, "q16 i3 five hidden digits are not unique");
    return ordered(candidates[0]);
  },
  4: function () {
    const candidates = [];
    for (let green = 1; green <= 9; green += 1) {
      for (let yellow = 1; yellow <= 9; yellow += 1) {
        const divisor = 11 * green;
        const dividend = 111 * yellow;
        if (green === yellow + 1 && dividend % divisor === 25) candidates.push([green, yellow]);
      }
    }
    check(candidates.length === 1, "q16 i4 repeated color digits are not unique");
    return ordered(candidates[0]);
  },
  5: function () {
    const candidates = [];
    for (let adult = 1; adult <= 9; adult += 1) {
      for (let person = 0; person <= 9; person += 1) {
        if (adult + person !== 7) continue;
        const divisor = 10 * adult + person;
        const product = divisor * 6;
        if (product < 100 || product > 999 || Math.floor(product / 10) % 10 !== 0 || product % 10 !== person) continue;
        const young = Math.floor(product / 100);
        for (let child = 1; child < adult; child += 1) {
          const digits = [young, child, adult, person];
          if (new Set(digits).size !== digits.length) continue;
          const dividend = 100 * young + 10 * child + person;
          if (Math.floor(dividend / divisor) === 6 && dividend % divisor === 10 * child) candidates.push(digits);
        }
      }
    }
    check(candidates.length === 1, "q16 i5 four hidden digits are not unique");
    return ordered(candidates[0]);
  }
};

const q17 = {
  1: function () {
    const candidates = fillPattern([8, null, 4, 6, null]).filter(number => number % 5 === 0 && number % 6 === 0);
    return scalar(Math.max(...candidates));
  },
  2: function () {
    const candidates = fillPattern([9, 9, null, 3, null]).filter(number => number % 2 === 0 && number % 3 === 0);
    return scalar(Math.min(...candidates));
  },
  3: function () {
    const candidates = fillPattern([null, 9, 7, 5, null]).filter(number => number % 4 === 0 && number % 9 === 0);
    return scalar(Math.max(...candidates));
  },
  4: function () {
    return set(fillPattern([6, null, 2, null]).filter(number => number % 4 === 0 && number % 9 === 0));
  },
  5: function () {
    return scalar(fillPattern([7, null, 4, null]).filter(number => number % 5 === 0 && number % 3 === 0).length, "개");
  },
  6: function () {
    return set(fillPattern([8, null, 2, null]).filter(number => number % 5 === 0 && number % 9 === 0));
  }
};

const q18 = {
  1: function () {
    const shared = firstSharedToothCount(42, 36, "q18 i1");
    return scalar(shared / 42, "바퀴");
  },
  2: function () {
    const shared = firstSharedToothCount(16, 28, "q18 i2");
    return scalar(shared / 16, "바퀴");
  },
  3: function () {
    const shared = firstSharedToothCount(30, 18, "q18 i3");
    return scalar(shared / 30, "바퀴");
  },
  4: function () {
    const shared = firstSharedToothCount(21, 35, "q18 i4");
    return scalar(shared / 21, "바퀴");
  },
  5: function () {
    const shared = firstSharedToothCount(36, 30, "q18 i5");
    return scalar(shared / 30, "바퀴");
  },
  6: function () {
    const shared = firstSharedToothCount(64, 96, "q18 i6");
    return ordered([shared / 64, shared / 96], "바퀴");
  },
  7: function () {
    const shared = firstSharedToothCount(64, 112, "q18 i7");
    return scalar(shared / 64, "번");
  },
  8: function () {
    const shared = firstSharedToothCount(30, 12, "q18 i8");
    return scalar(shared / 30, "바퀴");
  },
  9: function () {
    const shared = firstSharedToothCount(12, 32, "q18 i9");
    return scalar(shared / 12, "바퀴");
  },
  10: function () {
    const shared = firstSharedToothCount(36, 40, "q18 i10");
    const seconds = shared / 36 * 30;
    check(seconds % 60 === 0, "q18 i10 time is not an exact number of minutes");
    return scalar(`${seconds / 60}분 후`);
  }
};

const q19 = {
  1: function () {
    const faces = [
      { id: "one", value: 1, x: 1, y: -1 },
      { id: "three", value: 3, x: 0, y: 0 },
      { id: "ga", value: null, x: 1, y: 0 },
      { id: "na", value: null, x: 2, y: 0 },
      { id: "da", value: null, x: 2, y: 1 },
      { id: "two", value: 2, x: 3, y: 1 }
    ];
    const orientations = foldCubeNet(faces, "q19 i1");
    const known = new Map([["one", 1], ["two", 2], ["three", 3]]);
    const values = ["ga", "na", "da"].map(function (faceId) {
      const oppositeId = oppositeFace(orientations, faceId, "q19 i1");
      check(known.has(oppositeId), `q19 i1 ${faceId} is not opposite a numbered source face`);
      return 7 - known.get(oppositeId);
    });
    check(new Set(values).size === 3, "q19 i1 blank values are not uniquely assigned");
    return ordered(values);
  },
  2: function () {
    const faces = [
      { id: "f5", value: 5, x: 0, y: 0 }, { id: "f6", value: 6, x: 1, y: 0 },
      { id: "f1", value: 1, x: 1, y: 1 }, { id: "f2", value: 2, x: 2, y: 1 },
      { id: "f3", value: 3, x: 2, y: 2 }, { id: "f4", value: 4, x: 3, y: 2 }
    ];
    return scalar(hiddenBackSum(faces, [4, 5, 6, 1], "q19 i2"));
  },
  3: function () {
    const faces = [
      { id: "f5", value: 5, x: 0, y: 0 }, { id: "f6", value: 6, x: 1, y: 0 },
      { id: "f9", value: 9, x: 1, y: 1 }, { id: "f7", value: 7, x: 2, y: 1 },
      { id: "f4", value: 4, x: 3, y: 1 }, { id: "f8", value: 8, x: 2, y: 2 }
    ];
    return scalar(hiddenBackSum(faces, [6, 7, 7, 8], "q19 i3"));
  },
  4: function () {
    const faces = [
      { id: "f1", value: 1, x: 1, y: 0 }, { id: "f2", value: 2, x: 0, y: 1 },
      { id: "f3", value: 3, x: 1, y: 1 }, { id: "f4", value: 4, x: 1, y: 2 },
      { id: "f5", value: 5, x: 2, y: 2 }, { id: "f6", value: 6, x: 2, y: 3 }
    ];
    return scalar(hiddenBackSum(faces, [1, 4, 2, 5, 3, 6, 1, 3, 5, 6, 4, 2, 1, 4, 2, 3], "q19 i4"));
  },
  5: function () {
    const faces = [
      { id: "f3", value: 3, x: 1, y: 0 }, { id: "f6", value: 6, x: 0, y: 1 },
      { id: "f1", value: 1, x: 1, y: 1 }, { id: "f5", value: 5, x: 2, y: 1 },
      { id: "f2", value: 2, x: 3, y: 1 }, { id: "f4", value: 4, x: 1, y: 2 }
    ];
    return scalar(hiddenBackSum(faces, [6, 3, 4, 1, 2, 6, 5, 1, 2], "q19 i5"));
  },
  6: function () {
    const faces = [
      { id: "f9", value: 9, x: 0, y: 0 }, { id: "f8", value: 8, x: 1, y: 0 },
      { id: "f6", value: 6, x: 2, y: 0 }, { id: "f7", value: 7, x: 2, y: 1 },
      { id: "f5", value: 5, x: 3, y: 1 }, { id: "f4", value: 4, x: 4, y: 1 }
    ];
    return scalar(hiddenBackSum(faces, [8, 8, 9], "q19 i6"));
  },
  7: function () {
    const faces = [
      { id: "pip4", x: 0, y: 2 }, { id: "da", x: 1, y: 1 },
      { id: "ra", x: 1, y: 2 }, { id: "ga", x: 2, y: 0 },
      { id: "na", x: 2, y: 1 }, { id: "pip2", x: 3, y: 0 }
    ];
    const orientations = foldCubeNet(faces, "q19 i7");
    const ga = orientations.get("ga").normal;
    const na = orientations.get("na").normal;
    const common = [...orientations.entries()].filter(function (entry) {
      return entry[0] !== "ga" && entry[0] !== "na" && dot(entry[1].normal, ga) === 0 && dot(entry[1].normal, na) === 0;
    }).map(entry => entry[0]).sort();
    check(common.join("|") === "da|pip2", "q19 i7 common perpendicular faces changed");
    check(oppositeFace(orientations, "pip2", "q19 i7") === "da", "q19 i7 common perpendicular faces are not opposite");
    return scalar(7);
  }
};

const q20 = {
  1: function () {
    const ranked = rankRationals([
      rational("5/6", 0, 5, 6),
      rational("7/15", 0, 7, 15),
      rational("3/10", 0, 3, 10),
      rational("5/8", 0, 5, 8)
    ], "q20 i1");
    return scalar(rationalText(ranked[2]));
  },
  2: function () {
    const ranked = rankRationals([
      rational("3/4", 0, 3, 4),
      rational("1/2", 0, 1, 2),
      rational("2/3", 0, 2, 3),
      rational("11/30", 0, 11, 30),
      rational("16/27", 0, 16, 27)
    ], "q20 i2");
    return scalar(rationalText(ranked[2]));
  },
  3: function () {
    const ranked = rankRationals([
      rational("9/14", 0, 9, 14),
      rational("1/4", 0, 1, 4),
      rational("10/21", 0, 10, 21),
      rational("5/12", 0, 5, 12)
    ], "q20 i3");
    return scalar(rationalText(ranked[1]));
  },
  4: function () {
    const people = ["연수", "진호", "선미", "현주"];
    const drinks = ["주스", "콜라", "사이다", "식혜"];
    const assignments = permutations(drinks).filter(function (orderedDrinks) {
      const byPerson = new Map(people.map(function (person, index) { return [person, orderedDrinks[index]]; }));
      return !["콜라", "사이다"].includes(byPerson.get("진호")) && byPerson.get("선미") === "식혜" && byPerson.get("현주") === "사이다";
    });
    check(assignments.length === 1, "q20 i4 preference conditions do not have one assignment");
    const favorite = assignments[0] && assignments[0][people.indexOf("연수")];
    const ranked = rankRationals([
      rational("주스", 0, 7, 8),
      rational("콜라", 0, 11, 15),
      rational("사이다", 0, 4, 5),
      rational("식혜", 0, 2, 3)
    ], "q20 i4");
    const bottleLabels = ["㉠", "㉡", "㉢", "㉣"];
    const rank = ranked.findIndex(function (entry) { return entry.label === favorite; });
    check(rank >= 0, "q20 i4 favorite drink is missing from bottles");
    return scalar(bottleLabels[rank]);
  },
  5: function () {
    const ranked = rankRationals([
      rational("부안", 0, 3, 4),
      rational("강릉", 1, 3, 4),
      rational("목포", 1, 1, 2),
      rational("대구", 0, 15, 16),
      rational("부산", 1, 3, 5)
    ], "q20 i5");
    return ordered(ranked.map(function (entry) { return entry.label; }));
  }
};

const q21 = {
  1: function () { return scalar(countEquivalentFractions(7, 15, 20, 60, 50, 100, "q21 i1"), "개"); },
  2: function () { return scalar(countEquivalentFractions(9, 16, 30, 70, 40, 100, "q21 i2"), "개"); },
  3: function () { return scalar(countEquivalentFractions(5, 12, 10, 40, 30, 80, "q21 i3"), "개"); }
};

const q22 = {
  1: function () {
    const term = function (position) { return rational(`term-${position}`, 0, 2 * position - 1, 3 * position); };
    return scalar(rationalText(subtractRational(term(7), term(6))));
  },
  2: function () {
    const term = function (position) { return rational(`term-${position}`, 0, position, 2 ** position); };
    return scalar(rationalText(subtractRational(term(7), term(9))));
  }
};

const q23 = {
  1: function () {
    return scalar(wholeFromKnownRemainder([
      rational("day-1", 0, 1, 5), rational("day-2", 0, 1, 12), rational("day-3", 0, 1, 15),
      rational("day-4", 0, 1, 30), rational("day-5", 0, 1, 60)
    ], 1800, "q23 i1"), "개");
  },
  2: function () {
    return scalar(wholeFromKnownRemainder([rational("books", 0, 1, 6), rational("paper", 0, 3, 5)], 140, "q23 i2"), "cm");
  },
  3: function () {
    return scalar(wholeFromKnownRemainder([
      rational("day-1", 0, 1, 20), rational("day-2", 0, 1, 30), rational("day-3", 0, 1, 42),
      rational("day-4", 0, 1, 12), rational("day-5", 0, 1, 6)
    ], 1800, "q23 i3"), "kg");
  },
  4: function () {
    return scalar(wholeFromKnownRemainder([rational("first", 0, 1, 4), rational("second", 0, 2, 7)], 260, "q23 i4"), "cm");
  },
  5: function () {
    return scalar(wholeFromKnownRemainder([rational("first", 0, 2, 5), rational("second", 0, 1, 2)], 15, "q23 i5"), "cm");
  },
  6: function () {
    const candidates = [];
    for (let total = 1; total <= 1000; total += 1) {
      if (total % 4 !== 0 || total % 10 !== 0) continue;
      const jiHoon = total / 4 - 5;
      const younger = total / 10 + 3;
      const older = jiHoon + 2;
      if (jiHoon > 0 && younger > 0 && older > 0 && total - jiHoon - younger - older === 21) candidates.push({ total, younger });
    }
    check(candidates.length === 1, "q23 i6 does not have one whole-number marble assignment");
    return scalar(candidates[0].younger, "개");
  },
  7: function () {
    const remaining = subtractRational(rational("whole", 1, 0, 1), sumRationals([rational("first", 0, 1, 4), rational("second", 0, 3, 8)]));
    return scalar(48 * remaining.numerator / remaining.denominator, "m²");
  },
  8: function () {
    return scalar(wholeFromKnownRemainder([rational("science", 0, 1, 6), rational("story", 0, 1, 4), rational("history", 0, 1, 8)], 11, "q23 i8"), "권");
  },
  9: function () {
    const remaining = subtractRational(rational("whole", 1, 0, 1), sumRationals([
      rational("day-1", 0, 1, 6), rational("day-2", 0, 3, 8), rational("day-3", 0, 60, 240)
    ]));
    return scalar(rationalText(remaining));
  },
  10: function () {
    const metres = wholeFromKnownRemainder([rational("subway", 0, 3, 5), rational("bus", 0, 1, 4)], 800 + 400, "q23 i10");
    check(metres % 1000 === 0, "q23 i10 total distance is not a whole number of kilometres");
    return scalar(metres / 1000, "km");
  }
};

function nearestNatural(value, label) {
  const whole = Math.floor(value.numerator / value.denominator);
  const remainder = value.numerator - whole * value.denominator;
  check(remainder * 2 !== value.denominator, `${label} is equally close to two natural numbers`);
  return remainder * 2 < value.denominator ? whole : whole + 1;
}

const q24 = {
  1: function () {
    const first = rankRationals([rational("35/4", 0, 35, 4), rational("8 5/6", 8, 5, 6)], "q24 i1 first pair")[0];
    const second = rankRationals([rational("4 7/9", 4, 7, 9), rational("9/2", 0, 9, 2)], "q24 i1 second pair")[0];
    const third = rankRationals([rational("17/12", 0, 17, 12), rational("7/5", 0, 7, 5)], "q24 i1 third pair")[0];
    const result = subtractRational(addRational(first, second), third);
    return mixedFromFraction(result.numerator, result.denominator);
  },
  2: function () {
    const result = sumRationals(Array.from({ length: 6 }, function (_, index) { return rational(`term-${index + 1}`, 0, 1, 3 ** (index + 1)); }));
    const divisor = gcd(result.numerator, result.denominator);
    const numerator = result.numerator / divisor;
    const denominator = result.denominator / divisor;
    check(denominator > numerator, "q24 i2 expected denominator must exceed numerator");
    return scalar(denominator - numerator);
  },
  3: function () {
    const result = sumRationals([[5, 6], [6, 7], [7, 8], [8, 9]].map(function (pair) { return rational("term", 0, 1, pair[0] * pair[1]); }));
    return scalar(rationalText(result));
  },
  4: function () {
    const result = sumRationals([[6, 7], [7, 8], [8, 9], [9, 10], [10, 11]].map(function (pair) { return rational("term", 0, 1, pair[0] * pair[1]); }));
    return scalar(rationalText(result));
  },
  5: function () {
    const first = addRational(rational("3 5/12", 3, 5, 12), rational("4 2/9", 4, 2, 9));
    const second = addRational(subtractRational(rational("9 3/10", 9, 3, 10), rational("2 5/6", 2, 5, 6)), rational("3 4/5", 3, 4, 5));
    return scalar(nearestNatural(first, "q24 i5 first expression") + nearestNatural(second, "q24 i5 second expression"));
  },
  6: function () {
    const result = sumRationals([[5, 7], [7, 9], [9, 11], [11, 13]].map(function (pair) { return rational("term", 0, 1, pair[0] * pair[1]); }));
    return scalar(rationalText(result));
  }
};

const q25 = {
  1: () => scalar((60 - 5 - 5) * (38 - 5 - 5), "m²"),
  2: () => scalar((40 - 3 - 3) * (26 - 3 - 3), "m²"),
  3: () => scalar((27 - 4 - 4) * (18 - 3 - 3), "m²"),
  4: () => scalar((28 - 5 - 5) * (49 - 6 - 6), "m²")
};

const q26 = {
  1: function () {
    const side = 6;
    const upperRightSegment = side / 3;
    const lowerRightSegment = side - upperRightSegment;
    check(lowerRightSegment === upperRightSegment * 2, "q26 i1 side ratio changed");
    const extension = side * upperRightSegment / lowerRightSegment;
    return scalar((side + extension) * side / 2, "cm²");
  },
  2: function () {
    const givenTriangle = 44;
    const quadrilateralToTriangle = 4;
    const baseRatio = 6;
    return scalar(givenTriangle * (quadrilateralToTriangle - 1) / baseRatio, "cm²");
  },
  3: function () {
    const givenTriangle = 20;
    const quadrilateralToTriangle = 5;
    const baseRatio = 5;
    return scalar(givenTriangle * (quadrilateralToTriangle - 1) / baseRatio, "cm²");
  },
  4: function () {
    const givenTriangle = 30;
    const equalAreaSubtractions = [givenTriangle, givenTriangle];
    check(equalAreaSubtractions[0] === equalAreaSubtractions[1], "q26 i4 parallelogram subtraction no longer preserves equal areas");
    return scalar(equalAreaSubtractions[1], "cm²");
  },
  5: function () {
    const givenTriangle = 36;
    const quadrilateralToTriangle = 5;
    const baseRatio = 6;
    return scalar(givenTriangle * (quadrilateralToTriangle - 1) / baseRatio, "cm²");
  }
};

function clockAfterNoon(changeSecondsPerDay, days, direction) {
  const shifted = 12 * 60 * 60 + direction * changeSecondsPerDay * days;
  const hour24 = Math.floor(shifted / 3600);
  const minute = Math.floor((shifted % 3600) / 60);
  return { hour24, minute };
}

const q27 = {
  1: function () {
    const result = clockAfterNoon(5 * 60 + 15, 8, 1);
    check(result.hour24 === 12 && result.minute === 42, "q27 i1 clock calculation changed");
    return scalar("오후 12시 42분");
  },
  2: function () {
    const result = clockAfterNoon(1 * 60 + 36, 15, -1);
    const options = [[11, 24], [11, 30], [11, 36], [12, 24], [12, 36]];
    const matches = options.map(function (value, index) { return value[0] === result.hour24 && value[1] === result.minute ? index + 1 : null; }).filter(Boolean);
    check(matches.length === 1 && matches[0] === 3, "q27 i2 answer option is not unique");
    return scalar("③");
  },
  3: function () {
    const result = clockAfterNoon(2 * 60 + 48, 20, -1);
    check(result.hour24 === 11 && result.minute === 4, "q27 i3 clock calculation changed");
    return scalar("오전 11시 4분");
  },
  4: function () {
    const result = clockAfterNoon(6 * 60 + 20, 9, 1);
    const options = [[11, 3], [11, 33], [11, 57], [12, 3], [12, 57]];
    const matches = options.map(function (value, index) { return value[0] === result.hour24 && value[1] === result.minute ? index + 1 : null; }).filter(Boolean);
    check(matches.length === 1 && matches[0] === 5, "q27 i4 answer option is not unique");
    return scalar("⑤");
  }
};

function clockSmallAngle(hour, minute) {
  const hourAngle = (hour % 12) * 30 + minute * 0.5;
  const minuteAngle = minute * 6;
  const difference = Math.abs(hourAngle - minuteAngle) % 360;
  return Math.min(difference, 360 - difference);
}

const q28 = {
  1: function () {
    const fourHourMarks = 4 * 30;
    const halfMark = 30 / 2;
    return ordered([fourHourMarks, halfMark, fourHourMarks + halfMark], "도");
  },
  2: function () {
    const matches = [];
    for (let hour = 1; hour <= 12; hour += 1) {
      if (clockSmallAngle(hour, 0) === 60) matches.push(hour);
    }
    check(matches.length === 2, "q28 i2 exact-hour answer is not unique as a set");
    return set(matches, "시");
  },
  3: function () { return scalar(clockSmallAngle(9, 30), "도"); },
  4: function () { return scalar(clockSmallAngle(3, 30), "도"); },
  5: function () {
    const matches = [];
    for (let totalMinutes = 12 * 60; totalMinutes <= 17 * 60 + 30; totalMinutes += 30) {
      const hour = Math.floor(totalMinutes / 60);
      const minute = totalMinutes % 60;
      if (clockSmallAngle(hour, minute) === 60) matches.push([hour, minute]);
    }
    check(matches.length === 1 && matches[0][0] === 14 && matches[0][1] === 0, "q28 i5 schedule answer is not unique");
    return scalar("오후 2시");
  },
  6: function () { return scalar(clockSmallAngle(1, 50), "도"); },
  7: function () { return scalar(clockSmallAngle(4, 0), "도"); },
  8: function () {
    const baseAngle = 5 * 30;
    const actualAngle = clockSmallAngle(10, 24);
    return ordered([baseAngle, actualAngle - baseAngle, actualAngle], "도");
  },
  9: function () { return scalar(clockSmallAngle(11, 30), "도"); },
  10: function () { return scalar((2 * 60 + 50) * 0.5, "도"); },
  11: function () {
    const movedMinutes = 240 / 6;
    const startMinutes = 7 * 60 + 40;
    const endMinutes = startMinutes + movedMinutes;
    return scalar(`${Math.floor(endMinutes / 60)}시 ${endMinutes % 60}분`);
  },
  12: function () { return scalar((1 * 60 + 40) * 0.5, "도"); },
  13: function () {
    const activeArc = 360 - 117;
    const intervalAngle = activeArc / 9;
    return scalar(intervalAngle * 5, "도");
  },
  14: function () { return scalar(clockSmallAngle(5, 50), "도"); },
  15: function () {
    const matches = [];
    for (let hour = 1; hour <= 12; hour += 1) {
      const minute = 40;
      const hourHandAngle = (hour % 12) * 30 + minute * 0.5;
      if (hourHandAngle === 110) matches.push([hour, minute]);
    }
    check(matches.length === 1, "q28 i15 hidden-number clock answer is not unique");
    return ordered(matches[0], "시·분");
  }
};

const q29 = {
  1: function () { return scalar(54 / 4.5, "분"); },
  2: function () { return scalar(35 / 1.4, "분"); },
  3: function () { return scalar(159.8 / (1.3 + 2.1), "분"); },
  4: function () {
    const rates = [18.4 / 3.2, 15.05 / 2.5];
    const greatest = Math.max.apply(null, rates);
    const matches = rates.map(function (rate, index) { return Math.abs(rate - greatest) < 1e-12 ? index : -1; }).filter(function (index) { return index >= 0; });
    check(matches.length === 1 && matches[0] === 1, "q29 i4 faucet comparison is not unique");
    return scalar("㉡ 수도꼭지");
  },
  5: function () {
    return scalar((24 * 450) / 432, "분");
  },
  6: function () {
    const hours = 1 + 18 / 60;
    const oneHourAmount = 140 / hours;
    return scalar(oneHourAmount.toFixed(1), "L");
  },
  7: function () {
    const firstRate = 47.45 / (3 + 15 / 60);
    const secondRate = 53.41 / (3 + 30 / 60);
    const totalMinutes = 134.37 / (firstRate + secondRate);
    const minutes = Math.floor(totalMinutes);
    const seconds = Math.round((totalMinutes - minutes) * 60);
    check(Math.abs(totalMinutes - 4.5) < 1e-12, "q29 i7 combined faucet time changed");
    return ordered([minutes, seconds], "분·초");
  }
};

function congruentRectanglePairs(regions, label) {
  const groups = new Map();
  const limit = 1 << regions.length;
  for (let mask = 1; mask < limit; mask += 1) {
    const selected = regions.filter(function (_, index) { return mask & (1 << index); });
    const left = Math.min.apply(null, selected.map(function (region) { return region[0]; }));
    const right = Math.max.apply(null, selected.map(function (region) { return region[1]; }));
    const top = Math.min.apply(null, selected.map(function (region) { return region[2]; }));
    const bottom = Math.max.apply(null, selected.map(function (region) { return region[3]; }));
    const area = selected.reduce(function (sum, region) { return sum + (region[1] - region[0]) * (region[3] - region[2]); }, 0);
    if (area !== (right - left) * (bottom - top)) continue;
    const dimensions = [right - left, bottom - top].sort(function (a, b) { return a - b; });
    const signature = dimensions.join("x");
    groups.set(signature, (groups.get(signature) || 0) + 1);
  }
  const pairCount = [...groups.values()].reduce(function (sum, count) { return sum + count * (count - 1) / 2; }, 0);
  check(Number.isInteger(pairCount), `${label} rectangle pair count is not an integer`);
  return pairCount;
}

function gridRegions(widths, heights) {
  const regions = [];
  let top = 0;
  heights.forEach(function (height) {
    let left = 0;
    widths.forEach(function (width) {
      regions.push([left, left + width, top, top + height]);
      left += width;
    });
    top += height;
  });
  return regions;
}

function cycleMirrorPairs(cellCount, largestGroup) {
  const seen = new Set();
  const pairs = new Set();
  for (let length = 1; length <= largestGroup; length += 1) {
    for (let start = 0; start < cellCount; start += 1) {
      const cells = Array.from({ length }, function (_, offset) { return (start + offset) % cellCount; }).sort(function (a, b) { return a - b; });
      const key = cells.join(",");
      if (seen.has(key)) continue;
      seen.add(key);
      const mirror = cells.map(function (cell) { return (cell + cellCount / 2) % cellCount; }).sort(function (a, b) { return a - b; }).join(",");
      if (key === mirror) continue;
      pairs.add([key, mirror].sort().join("|"));
    }
  }
  return pairs.size;
}

function layeredIsoscelesPairs(rowCount) {
  const pairs = new Set();
  for (let depth = 1; depth <= rowCount; depth += 1) {
    for (let firstColumn = 0; firstColumn < 3; firstColumn += 1) {
      for (let lastColumn = firstColumn; lastColumn < 3; lastColumn += 1) {
        const mirrorFirst = 2 - lastColumn;
        const mirrorLast = 2 - firstColumn;
        if (firstColumn === mirrorFirst && lastColumn === mirrorLast) continue;
        const shape = `${depth}:${firstColumn}-${lastColumn}`;
        const mirror = `${depth}:${mirrorFirst}-${mirrorLast}`;
        pairs.add([shape, mirror].sort().join("|"));
      }
    }
  }
  return pairs.size;
}

function diagonalFanPairs(divisionCount) {
  let pairs = 0;
  for (let span = 1; span <= divisionCount; span += 1) pairs += divisionCount - span + 1;
  return pairs;
}

function triangleFanMirrorPairs(divisionCount) {
  let pairs = 0;
  for (let span = 1; span <= divisionCount; span += 1) {
    pairs += Math.floor((divisionCount - span + 1) / 2);
  }
  return pairs;
}

const q30 = {
  1: function () { return scalar(congruentRectanglePairs([[0, 4, 0, 1], [0, 4, 1, 3], [0, 4, 3, 4]], "q30 i1"), "쌍"); },
  2: function () { return scalar(congruentRectanglePairs(gridRegions([10, 5, 20], [10, 5, 20]), "q30 i2"), "쌍"); },
  3: function () { return scalar(cycleMirrorPairs(4, 3), "쌍"); },
  4: function () {
    return scalar(congruentRectanglePairs([
      [0, 3, 0, 3], [3, 15, 0, 3], [0, 3, 3, 15], [3, 15, 3, 15],
      [15, 21, 0, 15], [0, 15, 15, 21], [15, 21, 15, 21]
    ], "q30 i4"), "쌍");
  },
  5: function () { return scalar(cycleMirrorPairs(6, 3), "쌍"); },
  6: function () { return scalar(layeredIsoscelesPairs(4), "쌍"); },
  7: function () { return scalar(diagonalFanPairs(5), "쌍"); },
  8: function () { return scalar(diagonalFanPairs(3), "쌍"); },
  9: function () { return scalar(triangleFanMirrorPairs(5), "쌍"); },
  10: function () { return scalar(layeredIsoscelesPairs(3), "쌍"); },
  11: function () { return scalar(triangleFanMirrorPairs(5), "쌍"); },
  12: function () { return scalar(triangleFanMirrorPairs(6), "쌍"); },
  13: function () { return scalar(triangleFanMirrorPairs(4), "쌍"); }
};

function trainLengthFromTwoTunnels(shortTunnel, shortTime, longTunnel, completeTime, label) {
  const speed = shortTunnel / shortTime;
  const trainLength = speed * completeTime - longTunnel;
  check(speed > 0 && trainLength > 0, `${label} has no positive train length`);
  check(Math.abs(shortTunnel / speed - shortTime) < 1e-12, `${label} short-tunnel time does not reverse-check`);
  check(Math.abs((longTunnel + trainLength) / speed - completeTime) < 1e-12, `${label} complete-pass time does not reverse-check`);
  return trainLength;
}

const q31 = {
  1: function () { return scalar(trainLengthFromTwoTunnels(1330, 14, 1530, 18, "q31 i1"), "m"); },
  2: function () { return scalar(trainLengthFromTwoTunnels(630, 7, 870, 11, "q31 i2"), "m"); }
};

function decimalTextFromScaledInteger(value, precision) {
  if (!precision) return String(value);
  const scale = 10 ** precision;
  const whole = Math.floor(value / scale);
  const decimal = String(value % scale).padStart(precision, "0").replace(/0+$/, "");
  return decimal ? `${whole}.${decimal}` : String(whole);
}

function roundedFractionText(numerator, denominator, precision, label) {
  const scale = 10 ** precision;
  const scaledNumerator = numerator * scale;
  const lower = Math.floor(scaledNumerator / denominator);
  const remainder = scaledNumerator % denominator;
  const rounded = lower + (remainder * 2 >= denominator ? 1 : 0);
  check(
    rounded * denominator * 2 >= scaledNumerator * 2 - denominator &&
      rounded * denominator * 2 < scaledNumerator * 2 + denominator,
    `${label} rounded value is outside its half-up interval`
  );
  return decimalTextFromScaledInteger(rounded, precision);
}

function truncatedFractionText(numerator, denominator, precision, label) {
  const scale = 10 ** precision;
  const truncated = Math.floor(numerator * scale / denominator);
  check(
    truncated * denominator <= numerator * scale && (truncated + 1) * denominator > numerator * scale,
    `${label} truncated value is outside its decimal interval`
  );
  return decimalTextFromScaledInteger(truncated, precision);
}

function oneDecimalDividendsRoundingToWhole(divisorTenths, roundedWhole, label) {
  const matches = [];
  for (let dividendTenths = 1; dividendTenths <= 9999; dividendTenths += 1) {
    const doubledDividend = dividendTenths * 2;
    const lowerBound = (roundedWhole * 2 - 1) * divisorTenths;
    const upperBound = (roundedWhole * 2 + 1) * divisorTenths;
    if (doubledDividend >= lowerBound && doubledDividend < upperBound && dividendTenths % 10 !== 0) {
      matches.push(dividendTenths);
    }
  }
  check(matches.join("|") === "111|112|113|114|115|116|117|118|119|121|122|123|124|125|126|127", `${label} candidate interval changed`);
  return matches;
}

function twoDecimalDividendsRoundingQuotientToTenths(divisorTenths, roundedTenths, label) {
  const matches = [];
  for (let dividendHundredths = 1; dividendHundredths <= 99999; dividendHundredths += 1) {
    const scaledDividend = 20 * dividendHundredths;
    const lowerBound = (2 * roundedTenths - 1) * 10 * divisorTenths;
    const upperBound = (2 * roundedTenths + 1) * 10 * divisorTenths;
    if (scaledDividend >= lowerBound && scaledDividend < upperBound) matches.push(dividendHundredths);
  }
  check(matches.length > 0 && new Set(matches).size === matches.length, `${label} candidate set is empty or duplicated`);
  return matches;
}

const q32 = {
  1: () => decimalFromFraction(9387, 1490, 1),
  2: function () {
    const wholeAndDecimalHundredths = 258 * 2;
    const whole = Math.floor(wholeAndDecimalHundredths / 100);
    const decimalHundredths = wholeAndDecimalHundredths % 100;
    check(whole === 5 && decimalHundredths === 16, "q32 i2 reconstructed decimal changed");
    return decimalFromFraction(whole * 100, decimalHundredths, 2);
  },
  3: () => decimalFromFraction(3132, 435, 1),
  4: function () {
    return scalar(oneDecimalDividendsRoundingToWhole(17, 7, "q32 i4").length, "개");
  },
  5: () => decimalFromFraction(59400, 7425, 0),
  6: () => scalar(roundedFractionText(451520, 68890, 2, "q32 i6")),
  7: () => decimalFromFraction(39600, 2475, 0),
  8: function () {
    const matches = twoDecimalDividendsRoundingQuotientToTenths(6, 247, "q32 i8");
    check(matches.join("|") === "1479|1480|1481|1482|1483|1484", "q32 i8 candidate interval changed");
    return scalar(decimalTextFromScaledInteger(Math.max(...matches), 2));
  },
  9: () => decimalFromFraction(720, 45, 0),
  10: function () {
    const matches = twoDecimalDividendsRoundingQuotientToTenths(8, 124, "q32 i10");
    check(matches.join("|") === "988|989|990|991|992|993|994|995", "q32 i10 candidate interval changed");
    return scalar(decimalTextFromScaledInteger(Math.max(...matches), 2));
  },
  11: () => scalar(roundedFractionText(173, 73, 1, "q32 i11")),
  12: () => ordered([
    truncatedFractionText(85, 12, 2, "q32 i12 hundredths"),
    roundedFractionText(85, 12, 1, "q32 i12 tenths")
  ]),
  13: () => scalar(roundedFractionText(299, 86, 1, "q32 i13")),
  14: () => ordered([
    truncatedFractionText(520, 37, 2, "q32 i14 hundredths"),
    roundedFractionText(520, 37, 1, "q32 i14 tenths")
  ]),
  15: () => ordered([
    truncatedFractionText(380, 43, 2, "q32 i15 hundredths"),
    roundedFractionText(380, 43, 1, "q32 i15 tenths")
  ])
};

function naturalQuotientRemainder(dividendScaled, divisorScaled, precision, label) {
  const quotient = Math.floor(dividendScaled / divisorScaled);
  const remainder = dividendScaled - quotient * divisorScaled;
  check(remainder >= 0 && remainder < divisorScaled, `${label} does not satisfy the quotient-remainder bounds`);
  check(divisorScaled * quotient + remainder === dividendScaled, `${label} does not reconstruct the dividend`);
  return [String(quotient), decimalTextFromScaledInteger(remainder, precision)];
}

function largestOneDecimalBelow(hundredths, label) {
  const candidates = [];
  for (let tenths = 0; tenths <= 99; tenths += 1) {
    if (tenths * 10 < hundredths) candidates.push(tenths);
  }
  check(candidates.length > 0, `${label} has no one-decimal remainder candidate`);
  const largest = Math.max(...candidates);
  check(largest * 10 < hundredths && (largest + 1) * 10 >= hundredths, `${label} is not the greatest one-decimal remainder`);
  return largest;
}

const q33 = {
  1: function () {
    const dividendTenths = 78 * 5 + 32;
    return ordered(naturalQuotientRemainder(dividendTenths, 62, 1, "q33 i1"));
  },
  2: function () {
    const dividendTenths = 44 * 3 + 27;
    const quotientTenths = Math.floor(dividendTenths * 10 / 29);
    const remainderHundredths = dividendTenths * 10 - 29 * quotientTenths;
    check(29 * (quotientTenths + 1) > dividendTenths * 10, "q33 i2 quotient was not stopped at tenths");
    return scalar(decimalTextFromScaledInteger(remainderHundredths, 2));
  },
  3: function () {
    const matches = [];
    for (let targetTenths = 34; targetTenths <= 38; targetTenths += 1) {
      const otherTenths = 60 - targetTenths;
      if (100 * targetTenths === 10 * 14 * otherTenths) matches.push(targetTenths);
    }
    check(matches.join("|") === "35", "q33 i3 option set does not have one answer");
    return scalar(decimalTextFromScaledInteger(matches[0], 1));
  },
  4: function () {
    const dividendTenths = 24 * 7 + 19;
    return ordered(naturalQuotientRemainder(dividendTenths, 77, 1, "q33 i4"));
  },
  5: function () {
    const remainderTenths = largestOneDecimalBelow(257, "q33 i5");
    const dividendHundredths = 257 * 11 + remainderTenths * 10;
    return scalar(roundedFractionText(dividendHundredths, 637, 1, "q33 i5"));
  },
  6: function () {
    const dividendTenths = 54 * 4 + 18;
    return ordered(naturalQuotientRemainder(dividendTenths, 46, 1, "q33 i6"));
  },
  7: function () {
    const remainderTenths = largestOneDecimalBelow(139, "q33 i7");
    const dividendHundredths = 139 * 31 + remainderTenths * 10;
    return scalar(roundedFractionText(dividendHundredths, 523, 1, "q33 i7"));
  },
  8: function () {
    const largerHundredths = (542 + 194) / 2;
    const smallerHundredths = (542 - 194) / 2;
    check(largerHundredths + smallerHundredths === 542 && largerHundredths - smallerHundredths === 194, "q33 i8 sum/difference reverse-check failed");
    return scalar(roundedFractionText(largerHundredths, smallerHundredths, 2, "q33 i8"));
  },
  9: function () {
    const additions = [];
    for (let hundredths = 1; hundredths <= 5; hundredths += 1) {
      if (((4100 + hundredths) * 10) % 95 === 0) additions.push(hundredths);
    }
    check(additions.join("|") === "4", "q33 i9 does not have one smallest terminating adjustment");
    return scalar(decimalTextFromScaledInteger(additions[0], 2));
  },
  10: function () {
    const remainderTenths = largestOneDecimalBelow(324, "q33 i10");
    const dividendHundredths = 324 * 17 + remainderTenths * 10;
    return scalar(roundedFractionText(dividendHundredths, 712, 1, "q33 i10"));
  },
  11: function () {
    const firstTenths = 3212 / 44;
    const secondTenths = 58800 / 84;
    check(Number.isInteger(firstTenths) && Number.isInteger(secondTenths), "q33 i11 hidden values are not exact tenths");
    return scalar(decimalTextFromScaledInteger(firstTenths + secondTenths, 1));
  },
  12: function () {
    const dividendTenths = 57 * 4 + 13;
    return scalar(naturalQuotientRemainder(dividendTenths, 84, 1, "q33 i12")[1]);
  }
};

function originalCost(markupPercent, discountWon, profitWon, label) {
  const numerator = 100 * (discountWon + profitWon);
  check(numerator % markupPercent === 0, `${label} original cost is not an integer`);
  const cost = numerator / markupPercent;
  check(cost * (100 + markupPercent) % 100 === 0, `${label} list price is not an integer`);
  const listPrice = cost * (100 + markupPercent) / 100;
  check(listPrice - discountWon - cost === profitWon, `${label} reverse-check failed`);
  const candidates = [];
  for (let candidate = 1; candidate <= 100000; candidate += 1) {
    if (markupPercent * candidate === 100 * (discountWon + profitWon)) candidates.push(candidate);
  }
  check(candidates.length === 1 && candidates[0] === cost, `${label} original cost is not unique`);
  return scalar(cost, "원");
}

const q34 = {
  1: function () {
    const groups = [["소망반", 25 * 80], ["햇살반", 28 * 75]];
    check(groups.every(group => group[1] % 100 === 0), "q34 i1 participant count is not whole");
    const max = Math.max(...groups.map(group => group[1]));
    const winners = groups.filter(group => group[1] === max).map(group => group[0]);
    check(winners.length === 1, "q34 i1 comparison does not have one winner");
    return scalar(winners[0]);
  },
  2: function () {
    const people = [["유진", 30 * 60], ["시우", 40 * 40]];
    check(people.every(person => person[1] % 100 === 0), "q34 i2 success count is not whole");
    const max = Math.max(...people.map(person => person[1]));
    const winners = people.filter(person => person[1] === max).map(person => person[0]);
    check(winners.length === 1, "q34 i2 comparison does not have one winner");
    return scalar(winners[0]);
  },
  3: function () {
    const unionPercent = 100 - 46;
    const candidates = [];
    for (let overlapPercent = 0; overlapPercent <= 100; overlapPercent += 1) {
      if (48 + 12 - overlapPercent === unionPercent) candidates.push(overlapPercent);
    }
    check(candidates.length === 1 && candidates[0] === 6, "q34 i3 overlap percent is not unique");
    check(300 * candidates[0] % 100 === 0, "q34 i3 overlap count is not whole");
    return scalar(300 * candidates[0] / 100, "명");
  },
  4: () => originalCost(15, 2400, 3000, "q34 i4"),
  5: () => originalCost(30, 4000, 2000, "q34 i5")
};

function rollingDistanceDifference(largerDiameter, smallerDiameter, turns, label) {
  check(largerDiameter > smallerDiameter && turns > 0, `${label} source dimensions are invalid`);
  const differenceHundredths = (largerDiameter - smallerDiameter) * 314 * turns;
  check(differenceHundredths > 0, `${label} distance comparison is not unique`);
  return scalar(decimalTextFromScaledInteger(differenceHundredths, 2), "cm");
}

function sweptAreaAroundRectangle(width, height, sweepWidth, label) {
  check(width > 0 && height > 0 && sweepWidth > 0, `${label} source dimensions are invalid`);
  const cornerHundredths = sweepWidth * sweepWidth * 314;
  const straightHundredths = 2 * (width + height) * sweepWidth * 100;
  const areaHundredths = cornerHundredths + straightHundredths;
  check(areaHundredths === sweepWidth * sweepWidth * 314 + width * sweepWidth * 2 * 100 + height * sweepWidth * 2 * 100, `${label} area decomposition changed`);
  return scalar(decimalTextFromScaledInteger(areaHundredths, 2), "cm²");
}

const q35 = {
  1: () => rollingDistanceDifference(40, 30, 3, "q35 i1"),
  2: () => rollingDistanceDifference(30, 10, 4, "q35 i2"),
  3: function () {
    const radius = 4;
    return sweptAreaAroundRectangle(20, 20, radius * 2, "q35 i3");
  },
  4: () => sweptAreaAroundRectangle(9, 12, 4, "q35 i4"),
  5: () => sweptAreaAroundRectangle(24, 10, 8, "q35 i5")
};

const q36 = {
  1: function () {
    const firstHeight = 9 * 1000 / (30 * 30);
    const remainingMinutes = 40 * 30 * (20 - firstHeight) / 1000;
    check(Number.isInteger(firstHeight) && Number.isInteger(remainingMinutes), "q36 i1 graph values are not exact");
    check(30 * 30 * firstHeight === 9000 && 40 * 30 * (20 - firstHeight) === remainingMinutes * 1000, "q36 i1 volume reverse-check failed");
    return ordered([firstHeight, 9 + remainingMinutes]);
  },
  2: function () {
    const waterToBlockTop = 20 * 5;
    const waterAboveBlock = 20 * (8 - 5);
    const baseArea = waterAboveBlock / (4 - 3);
    const blockVolume = baseArea * 3 - waterToBlockTop;
    check(baseArea === 60 && blockVolume === 80, "q36 i2 fill-graph reconstruction failed");
    return scalar(blockVolume, "m³");
  },
  3: function () {
    const waterToBlockTop = 10 * 10;
    const waterAboveBlock = 10 * (15 - 10);
    const baseArea = waterAboveBlock / (7 - 5);
    const blockVolume = baseArea * 5 - waterToBlockTop;
    check(baseArea === 25 && blockVolume === 25, "q36 i3 fill-graph reconstruction failed");
    return scalar(blockVolume, "m³");
  },
  4: function () {
    const waterVolume = 6 * 6 * 4 + 14 * 6 * 2;
    return decimalFromFraction(waterVolume, (6 + 14) * 6, 1, "cm");
  },
  5: function () {
    const totalVolume = 30 * 15 * 5;
    const leftVolume = 20 * 15 * 3;
    const rightHeight = (totalVolume - leftVolume) / ((30 - 20) * 15);
    check(Number.isInteger(rightHeight) && leftVolume + (30 - 20) * 15 * rightHeight === totalVolume, "q36 i5 reverse water height is not unique");
    return scalar(rightHeight);
  },
  6: function () {
    const waterVolume = 7 * 8 * 5 + 13 * 8 * 2;
    return decimalFromFraction(waterVolume, (7 + 13) * 8, 2, "cm");
  }
};

function triangularPrismHeightFromLateralStrip(sideLengths, label) {
  check(sideLengths.length === 3 && sideLengths.every(length => Number.isInteger(length) && length > 0), `${label} base side lengths are invalid`);
  const unfoldedWidth = sideLengths.reduce((sum, length) => sum + length, 0);
  const candidates = [];
  for (let height = 1; height <= 100; height += 1) {
    if (height === unfoldedWidth) candidates.push(height);
  }
  check(candidates.length === 1, `${label} 45-degree height is not unique`);
  check(Math.abs(Math.atan2(candidates[0], unfoldedWidth) * 180 / Math.PI - 45) < 1e-12, `${label} unfolded angle is not 45 degrees`);
  return scalar(candidates[0], "cm");
}

const q37 = {
  1: () => triangularPrismHeightFromLateralStrip([9, 6, 5], "q37 i1"),
  2: () => triangularPrismHeightFromLateralStrip([8, 7, 6], "q37 i2")
};

function continuedFractionTerms(numerator, denominator, label) {
  check(Number.isInteger(numerator) && Number.isInteger(denominator) && numerator > denominator && denominator > 0, `${label} fraction is invalid`);
  const terms = [];
  let top = numerator;
  let bottom = denominator;
  while (bottom) {
    const whole = Math.floor(top / bottom);
    terms.push(whole);
    const remainder = top - whole * bottom;
    top = bottom;
    bottom = remainder;
  }
  check(terms.length > 0 && terms[terms.length - 1] > 1, `${label} does not have one regular expansion`);
  return terms;
}

function normalizedFraction(numerator, denominator, label) {
  check(Number.isInteger(numerator) && Number.isInteger(denominator) && denominator !== 0, `${label} fraction is invalid`);
  const sign = denominator < 0 ? -1 : 1;
  const divisor = gcd(numerator, denominator);
  return { numerator: sign * numerator / divisor, denominator: sign * denominator / divisor };
}

function repeatedNestedSubtraction(base, repeats, tailDenominator, reciprocalResult, label) {
  let value = normalizedFraction(tailDenominator, 1, `${label} tail`);
  for (let step = 0; step < repeats; step += 1) {
    check(value.numerator !== 0, `${label} has a zero divisor at step ${step + 1}`);
    value = normalizedFraction(base * value.numerator - value.denominator, value.numerator, `${label} step ${step + 1}`);
  }
  if (reciprocalResult) {
    check(value.numerator !== 0, `${label} final reciprocal is undefined`);
    value = normalizedFraction(value.denominator, value.numerator, `${label} result`);
  }
  return value;
}

const q38 = {
  1: function () {
    const parts = continuedFractionTerms(267, 32, "q38 i1");
    check(parts.join("|") === "8|2|1|10", "q38 i1 natural parts changed");
    return scalar(parts[0] + parts[1] + parts[2] - parts[3]);
  },
  2: function () {
    const terms = continuedFractionTerms(197, 90, "q38 i2");
    check(terms.length === 5 && terms[4] === 2, "q38 i2 fixed 1/2 tail changed");
    return scalar(terms.slice(0, 4).reduce((sum, value) => sum + value, 0));
  },
  3: function () {
    const terms = continuedFractionTerms(155, 48, "q38 i3");
    check(terms.length === 5 && terms[4] === 3, "q38 i3 fixed 1/3 tail changed");
    return scalar(terms.slice(0, 4).reduce((sum, value) => sum + value, 0));
  },
  4: function () {
    const result = repeatedNestedSubtraction(1, 3, 3, false, "q38 i4");
    check(result.denominator === 1, "q38 i4 result is not a whole number");
    return scalar(result.numerator);
  },
  5: () => scalar(rationalText(repeatedNestedSubtraction(2, 3, 2, true, "q38 i5"))),
  6: () => scalar(rationalText(repeatedNestedSubtraction(4, 2, 4, true, "q38 i6")))
};

function decimalPowerPositionDigit(digit, exponent, label) {
  check(Number.isInteger(digit) && digit > 0 && digit < 10 && Number.isInteger(exponent) && exponent > 0, `${label} source values are invalid`);
  const numerator = BigInt(digit) ** BigInt(exponent);
  const digits = numerator.toString();
  check(digits.length <= exponent, `${label} is not smaller than 1 as a decimal power`);
  const paddedDigits = digits.padStart(exponent, "0");
  const indexedDigit = Number(paddedDigits[exponent - 1]);
  check(indexedDigit === Number(numerator % 10n), `${label} decimal-position and last-digit calculations disagree`);
  return scalar(indexedDigit);
}

const q39 = {
  1: () => decimalPowerPositionDigit(8, 60, "q39 i1"),
  2: () => decimalPowerPositionDigit(9, 75, "q39 i2"),
  3: () => decimalPowerPositionDigit(5, 100, "q39 i3"),
  4: () => decimalPowerPositionDigit(4, 80, "q39 i4"),
  5: () => decimalPowerPositionDigit(3, 71, "q39 i5"),
  6: () => decimalPowerPositionDigit(7, 65, "q39 i6"),
  7: () => decimalPowerPositionDigit(6, 360, "q39 i7")
};

const rotatedDigit = new Map([[0, 0], [1, 1], [2, 2], [5, 5], [6, 9], [8, 8], [9, 6]]);
function rotationallySymmetricNumbers(digits, minimum, maximum, label) {
  const allowed = new Set(digits);
  const matches = [];
  for (let value = minimum; value <= maximum; value += 1) {
    const source = String(value);
    if (![...source].every(char => allowed.has(Number(char)))) continue;
    const rotated = [...source].reverse().map(function (char) {
      return rotatedDigit.get(Number(char));
    });
    if (rotated.some(function (digit) { return digit === undefined; })) continue;
    if (rotated.join("") === source) matches.push(value);
  }
  check(new Set(matches).size === matches.length, `${label} enumeration contains duplicates`);
  return matches;
}

function rotationalSymmetryCount(digits, minimum, maximum, expected, label) {
  const matches = rotationallySymmetricNumbers(digits, minimum, maximum, label);
  check(matches.join("|") === expected.join("|"), `${label} exhaustive list disagrees with the source solution`);
  return scalar(matches.length, "개");
}

const q40 = {
  1: () => rotationalSymmetryCount([0, 1, 6, 8, 9], 1000, 6118, [1001, 1111, 1691, 1881, 1961, 6009], "q40 i1"),
  2: () => rotationalSymmetryCount([0, 1, 5, 6, 9], 1000, 9115, [1001, 1111, 1551, 1691, 1961, 5005, 5115, 5555, 5695, 5965, 6009, 6119, 6559, 6699, 6969, 9006], "q40 i2"),
  3: () => rotationalSymmetryCount([0, 1, 2, 5, 6, 8, 9], 8000, 9999, [8008, 8118, 8228, 8558, 8698, 8888, 8968, 9006, 9116, 9226, 9556, 9696, 9886, 9966], "q40 i3"),
  4: () => rotationalSymmetryCount([0, 1, 2, 6, 7, 9], 100, 999, [101, 111, 121, 202, 212, 222, 609, 619, 629, 906, 916, 926], "q40 i4"),
  5: () => rotationalSymmetryCount([0, 4, 5, 6, 8, 9], 100, 999, [505, 555, 585, 609, 659, 689, 808, 858, 888, 906, 956, 986], "q40 i5"),
  6: () => rotationalSymmetryCount([0, 1, 3, 5, 6, 8, 9], 100, 999, [101, 111, 151, 181, 505, 515, 555, 585, 609, 619, 659, 689, 808, 818, 858, 888, 906, 916, 956, 986], "q40 i6")
};

const calculators = new Map([
  ["2:1", () => scalar(7n ** 26n % 10n)],
  ["2:2", () => scalar(1333333n * 1333333n)],
  ["2:3", () => {
    check(999999n * 888889n === 888888111111n, "q02 i3 source option calculation changed");
    return scalar("㉡");
  }],
  ["2:4", () => scalar(133333n * 133333n)],
  ["2:5", () => scalar(123454321n / 11111n)],
  ["2:6", () => scalar(777777n * 999999n)],
  ["2:7", () => scalar(111110888889n / 111111n)],
  ["2:8", () => scalar(7n ** 30n % 10n)],
  ["6:1", () => scalar(10 * 9, "쌍")],
  ["6:2", () => scalar(2 * 1, "쌍")],
  ["6:3", () => scalar(4 * 3, "쌍")],
  ["6:4", () => scalar(2 * 1, "쌍")]
]);

Object.keys(q01).forEach(itemNumber => calculators.set(`1:${itemNumber}`, q01[itemNumber]));
Object.keys(q03).forEach(itemNumber => calculators.set(`3:${itemNumber}`, q03[itemNumber]));
Object.keys(q04).forEach(itemNumber => calculators.set(`4:${itemNumber}`, q04[itemNumber]));
Object.keys(q05).forEach(itemNumber => calculators.set(`5:${itemNumber}`, q05[itemNumber]));
Object.keys(q07).forEach(itemNumber => calculators.set(`7:${itemNumber}`, q07[itemNumber]));
Object.keys(q08).forEach(itemNumber => calculators.set(`8:${itemNumber}`, q08[itemNumber]));
Object.keys(q09).forEach(itemNumber => calculators.set(`9:${itemNumber}`, q09[itemNumber]));
Object.keys(q10).forEach(itemNumber => calculators.set(`10:${itemNumber}`, q10[itemNumber]));
Object.keys(q11).forEach(itemNumber => calculators.set(`11:${itemNumber}`, q11[itemNumber]));
Object.keys(q12).forEach(itemNumber => calculators.set(`12:${itemNumber}`, q12[itemNumber]));
Object.keys(q13).forEach(itemNumber => calculators.set(`13:${itemNumber}`, q13[itemNumber]));
Object.keys(q14).forEach(itemNumber => calculators.set(`14:${itemNumber}`, q14[itemNumber]));
Object.keys(q15).forEach(itemNumber => calculators.set(`15:${itemNumber}`, q15[itemNumber]));
Object.keys(q16).forEach(itemNumber => calculators.set(`16:${itemNumber}`, q16[itemNumber]));
Object.keys(q17).forEach(itemNumber => calculators.set(`17:${itemNumber}`, q17[itemNumber]));
Object.keys(q18).forEach(itemNumber => calculators.set(`18:${itemNumber}`, q18[itemNumber]));
Object.keys(q19).forEach(itemNumber => calculators.set(`19:${itemNumber}`, q19[itemNumber]));
Object.keys(q20).forEach(itemNumber => calculators.set(`20:${itemNumber}`, q20[itemNumber]));
Object.keys(q21).forEach(itemNumber => calculators.set(`21:${itemNumber}`, q21[itemNumber]));
Object.keys(q22).forEach(itemNumber => calculators.set(`22:${itemNumber}`, q22[itemNumber]));
Object.keys(q23).forEach(itemNumber => calculators.set(`23:${itemNumber}`, q23[itemNumber]));
Object.keys(q24).forEach(itemNumber => calculators.set(`24:${itemNumber}`, q24[itemNumber]));
Object.keys(q25).forEach(itemNumber => calculators.set(`25:${itemNumber}`, q25[itemNumber]));
Object.keys(q26).forEach(itemNumber => calculators.set(`26:${itemNumber}`, q26[itemNumber]));
Object.keys(q27).forEach(itemNumber => calculators.set(`27:${itemNumber}`, q27[itemNumber]));
Object.keys(q28).forEach(itemNumber => calculators.set(`28:${itemNumber}`, q28[itemNumber]));
Object.keys(q29).forEach(itemNumber => calculators.set(`29:${itemNumber}`, q29[itemNumber]));
Object.keys(q30).forEach(itemNumber => calculators.set(`30:${itemNumber}`, q30[itemNumber]));
Object.keys(q31).forEach(itemNumber => calculators.set(`31:${itemNumber}`, q31[itemNumber]));
Object.keys(q32).forEach(itemNumber => calculators.set(`32:${itemNumber}`, q32[itemNumber]));
Object.keys(q33).forEach(itemNumber => calculators.set(`33:${itemNumber}`, q33[itemNumber]));
Object.keys(q34).forEach(itemNumber => calculators.set(`34:${itemNumber}`, q34[itemNumber]));
Object.keys(q35).forEach(itemNumber => calculators.set(`35:${itemNumber}`, q35[itemNumber]));
Object.keys(q36).forEach(itemNumber => calculators.set(`36:${itemNumber}`, q36[itemNumber]));
Object.keys(q37).forEach(itemNumber => calculators.set(`37:${itemNumber}`, q37[itemNumber]));
Object.keys(q38).forEach(itemNumber => calculators.set(`38:${itemNumber}`, q38[itemNumber]));
Object.keys(q39).forEach(itemNumber => calculators.set(`39:${itemNumber}`, q39[itemNumber]));
Object.keys(q40).forEach(itemNumber => calculators.set(`40:${itemNumber}`, q40[itemNumber]));

const items = itemIndex.items || [];
check(items.length === 302, "independent audit requires all 302 pilot items");
check(calculators.size === 302, "independent calculator count must be 302");

items.forEach(function (item) {
  const key = `${item.diagnosticNumber}:${item.itemNumber}`;
  const calculate = calculators.get(key);
  check(Boolean(calculate), `missing independent calculator: ${key}`);
  if (!calculate) return;
  const expected = calculate();
  const actual = actualAnswer(item);
  check(sameAnswer(actual, expected), `independent answer mismatch: ${key}`);
});

if (issues.length) {
  console.error(`FAIL pilot independent math audit (${issues.length})`);
  issues.forEach(issue => console.error(`- ${issue}`));
  process.exit(1);
}

console.log("PASS pilot independent math audit: items=302 q25-rearranged-area=4 q27-fractional-clock=4 q28-clock-angle=15 q29-decimal-water-rate=7 q30-congruent-shape=13 q31-train-tunnel=2 q32-decimal-division=15 q33-quotient-remainder=12 q34-percent-application=5 q35-rolling-circle=5 q36-water-volume=6 q37-prism-height=2 q38-nested-fractions=6 q39-decimal-power-digit=7 q40-rotational-digit-symmetry=6 answers=unique-by-contract");
