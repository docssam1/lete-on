"use strict";

global.window = {};
require("./generators.js");

const inventory = require("./source-inventory/4-1-source-items.json");
const api = window.HSE_GENERATORS;
const generatorKey = "source41LargeNumberOne";
const seedsPerDifficulty = 500;
const difficulties = [-1, 0, 1];
const symbols = ["㉠", "㉡", "㉢", "㉣"];
const smallUnits = ["", "십", "백", "천"];
const largeUnits = ["", "만", "억", "조", "경", "해"];
const digitWords = ["영", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구"];
const expectedSourceIds = [
  "4-1-u1-e1-exploration",
  "4-1-u1-e1-example-1-1",
  "4-1-u1-e1-example-1-2",
  "4-1-u1-e1-example-1-3",
  "4-1-u1-e1-example-1-4",
  "4-1-u1-e1-mission-1",
  "4-1-u1-e1-mission-2",
  "4-1-u1-e1-mission-3",
  "4-1-u1-e1-mission-4",
  "4-1-u1-e1-mission-5",
  "4-1-u1-e1-mission-6"
];
const expectedKinds = [
  "exploration-four-part",
  "read-and-write",
  "scaled-place-ratio",
  "expanded-count-blank",
  "represented-digit-order",
  "four-coefficients",
  "unit-count-scaled-digit-sum",
  "two-marked-place-ratio",
  "two-scale-digit-sum",
  "four-number-digit-count",
  "signal-distance-digit-difference"
];
const originalNumbers = [
  "32765894",
  "1234567890123456789",
  "6823970600",
  "343970600",
  "6498200",
  "5907380154387",
  "63987003",
  "270823",
  "819304641030627",
  "8952053713062007",
  "9708553606000",
  "299790000"
];
const failures = [];

function check(condition, message) {
  if (!condition) failures.push(message);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function formatInteger(value) {
  return String(value).replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function power(exponent) {
  return 10n ** BigInt(exponent);
}

function digitAt(value, exponent) {
  return Number(BigInt(value) / power(exponent) % 10n);
}

function digitAtText(value, exponent) {
  const text = String(value).replace(/^0+(?=\d)/, "");
  const index = text.length - exponent - 1;
  return index < 0 || index >= text.length ? 0 : Number(text[index]);
}

function readSmallKorean(value) {
  const parts = [];
  for (let exponent = 3; exponent >= 0; exponent -= 1) {
    const digit = Math.floor(value / 10 ** exponent) % 10;
    if (!digit) continue;
    const word = digit === 1 && exponent > 0 ? "" : digitWords[digit];
    parts.push(`${word}${smallUnits[exponent]}`);
  }
  return parts.join("");
}

function readKorean(value) {
  let remaining = BigInt(value);
  if (!remaining) return "영";
  const parts = [];
  let groupIndex = 0;
  while (remaining > 0n) {
    const group = Number(remaining % 10000n);
    if (group) parts.unshift(`${readSmallKorean(group)}${largeUnits[groupIndex]}`);
    remaining /= 10000n;
    groupIndex += 1;
  }
  return parts.join(" ");
}

function readEnglishSmall(value) {
  const ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
  const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
  const parts = [];
  if (value >= 100) {
    parts.push(`${ones[Math.floor(value / 100)]} hundred`);
    value %= 100;
  }
  if (value >= 20) {
    parts.push(tens[Math.floor(value / 10)]);
    if (value % 10) parts.push(ones[value % 10]);
  } else if (value) parts.push(ones[value]);
  return parts.join(" ");
}

function readEnglish(value) {
  const groupUnits = ["", "thousand", "million", "billion", "trillion", "quadrillion", "quintillion"];
  let remaining = BigInt(value);
  if (!remaining) return "zero";
  const parts = [];
  let groupIndex = 0;
  while (remaining > 0n) {
    const group = Number(remaining % 1000n);
    if (group) parts.unshift(`${readEnglishSmall(group)}${groupUnits[groupIndex] ? ` ${groupUnits[groupIndex]}` : ""}`);
    remaining /= 1000n;
    groupIndex += 1;
  }
  return parts.join(" ");
}

function readNamedPlaces(value, namedUnits) {
  const text = String(value);
  const parts = [];
  for (let index = 0; index < text.length; index += 1) {
    const digit = Number(text[index]);
    if (!digit) continue;
    const exponent = text.length - index - 1;
    if (exponent === 0) parts.push(digitWords[digit]);
    else if (exponent <= 3) parts.push(`${digit === 1 ? "" : digitWords[digit]}${smallUnits[exponent]}`);
    else parts.push(`${digitWords[digit]}${namedUnits[exponent - 4]}`);
  }
  return parts.join(" ");
}

function multiplyDecimalByInt(value, multiplier) {
  let carry = 0;
  const output = [];
  for (let index = String(value).length - 1; index >= 0; index -= 1) {
    const product = Number(String(value)[index]) * multiplier + carry;
    output.push(product % 10);
    carry = Math.floor(product / 10);
  }
  while (carry) {
    output.push(carry % 10);
    carry = Math.floor(carry / 10);
  }
  return output.reverse().join("").replace(/^0+(?=\d)/, "");
}

function visibleText(value) {
  return String(value).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function attribute(tag, name) {
  return tag.match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
}

function readEvidence(prompt) {
  const tag = prompt.match(/<span hidden data-source41-kind="[^"]+" data-source41-payload="[^"]+" data-source41-expected="[^"]*"><\/span>/)?.[0];
  assert(tag, "독립 검산 자료가 없습니다.");
  return {
    kind: attribute(tag, "data-source41-kind"),
    payload: JSON.parse(decodeURIComponent(attribute(tag, "data-source41-payload"))),
    declared: decodeURIComponent(attribute(tag, "data-source41-expected"))
  };
}

function countMatches(value, pattern) {
  return (String(value).match(pattern) || []).length;
}

function auditStructure(variant, prompt) {
  const checks = [
    () => {
      assert(countMatches(prompt, /<li>/g) === 8, "개념탐구의 네 활동과 네 보기가 모두 있어야 합니다.");
      for (const marker of ["장점", "단점", "우리말", "영어", "큰 수 이야기"]) assert(prompt.includes(marker), `개념탐구 표지 ${marker}가 없습니다.`);
    },
    () => {
      assert(countMatches(prompt, /<li>/g) === 2, "읽기와 쓰기 두 물음이어야 합니다.");
      assert(prompt.includes("우리말로 읽으세요") && prompt.includes("숫자로 나타내세요"), "읽기와 쓰기의 묻는 값이 다릅니다.");
    },
    () => {
      for (const marker of ["첫째 수", "둘째 수", "분의 1", "몇 배"]) assert(prompt.includes(marker), `배수 비교 표지 ${marker}가 없습니다.`);
      assert(prompt.includes("㉠") && prompt.includes("㉡"), "두 표시 숫자가 없습니다.");
    },
    () => {
      assert(countMatches(prompt, /이 (?:□|\d+)개/g) === 5, "자릿값 개수 조건은 다섯 개여야 합니다.");
      assert(prompt.includes("□에 알맞은 수"), "빈칸의 값을 묻지 않습니다.");
    },
    () => {
      assert(countMatches(prompt, /<li>/g) === 4, "서로 다른 네 표현이 있어야 합니다.");
      assert(prompt.includes("큰 것부터") && symbols.every(symbol => prompt.includes(symbol)), "자리값 순서 문제의 표지가 부족합니다.");
    },
    () => {
      assert(countMatches(prompt, / × /g) === 4, "네 자릿값 곱셈 항이 있어야 합니다.");
      assert(symbols.every(symbol => prompt.includes(symbol)), "네 기호가 모두 없습니다.");
    },
    () => {
      assert(countMatches(prompt, /이 \d+개/g) === 3, "단위 개수 조건은 세 개여야 합니다.");
      assert(countMatches(prompt, /자리 숫자/g) === 2 && prompt.includes("합을 구하세요"), "두 자리 숫자의 합을 묻지 않습니다.");
    },
    () => {
      assert(prompt.includes("㉠") && prompt.includes("㉡") && prompt.includes("몇 배"), "두 표시 숫자의 자리값 배수 구조가 아닙니다.");
    },
    () => {
      assert(prompt.includes("배 한 수") && prompt.includes("분의 1로 한 수"), "서로 다른 두 자리 이동이 없습니다.");
      assert(countMatches(prompt, /자리 숫자/g) === 2 && prompt.includes("합을 구하세요"), "자리 숫자 둘의 합을 묻지 않습니다.");
    },
    () => {
      assert(countMatches(prompt, /<li>/g) === 4 && countMatches(prompt, / 작은 수/g) === 4, "네 수의 범위 설명이 모두 있어야 합니다.");
      assert(prompt.includes("숫자 9") && prompt.includes("몇 번"), "특정 숫자의 사용 횟수를 묻지 않습니다.");
    },
    () => {
      for (const marker of ["1초", "m", "초 동안", "cm", "자리 숫자", "차를 구하세요"]) assert(prompt.includes(marker), `거리 환산 표지 ${marker}가 없습니다.`);
    }
  ];
  checks[variant]();
}

function independentAnswer(kind, payload, prompt) {
  if (kind === "exploration-four-part") {
    assert(payload.namedUnits.length === 5, "새 단위 이름은 다섯 개여야 합니다.");
    assert(new Set(payload.namedUnits).size === 5, "새 단위 이름이 겹칩니다.");
    const custom = readNamedPlaces(payload.customNumber, payload.namedUnits);
    const advantages = payload.statements.filter(statement => statement.role === "advantage");
    const disadvantages = payload.statements.filter(statement => statement.role === "disadvantage");
    assert(advantages.length === 1 && disadvantages.length === 1, "장점과 단점의 답이 하나씩 정해지지 않습니다.");
    const korean = readKorean(payload.comparisonNumber);
    const english = readEnglish(payload.comparisonNumber);
    const story = formatInteger(payload.storyNumber);
    const answer = `(1) ${custom} / (2) ${advantages[0].label}, ${disadvantages[0].label} / (3) 우리말: ${korean}; 영어: ${english}; 묶음: 4자리, 3자리 / (4) ${story}`;
    return { answer, tokens: [custom, advantages[0].label, disadvantages[0].label, korean, english, story], complexity: String(payload.customNumber).length + String(payload.comparisonNumber).length + String(payload.storyNumber).length };
  }

  if (kind === "read-and-write") {
    const readText = readKorean(payload.readNumber);
    const writeText = readKorean(payload.writeNumber);
    assert(prompt.includes(formatInteger(payload.readNumber)) && prompt.includes(writeText), "문제의 숫자·우리말 수와 검산 자료가 다릅니다.");
    const written = formatInteger(payload.writeNumber);
    return { answer: `(1) ${readText} / (2) ${written}`, tokens: [readText, written], complexity: String(payload.readNumber).length + String(payload.writeNumber).length };
  }

  if (kind === "scaled-place-ratio") {
    const upUnit = power(payload.upPower);
    const downUnit = power(payload.downPower);
    assert(BigInt(payload.second) % downUnit === 0n, "둘째 수를 나눈 값이 자연수가 아닙니다.");
    const firstScaled = BigInt(payload.first) * upUnit;
    const secondScaled = BigInt(payload.second) / downUnit;
    const firstExponent = payload.firstMarkedExponent + payload.upPower;
    const secondExponent = payload.secondMarkedExponent - payload.downPower;
    const firstValue = BigInt(digitAt(firstScaled, firstExponent)) * power(firstExponent);
    const secondValue = BigInt(digitAt(secondScaled, secondExponent)) * power(secondExponent);
    assert(secondValue > 0n && firstValue % secondValue === 0n, "두 자리값의 배수가 자연수 하나로 정해지지 않습니다.");
    return { answer: formatInteger(firstValue / secondValue), tokens: [formatInteger(firstValue / secondValue)], complexity: payload.upPower + payload.downPower + firstExponent - secondExponent + String(payload.first).length };
  }

  if (kind === "expanded-count-blank") {
    const candidates = [];
    for (let candidate = 0; candidate <= 999; candidate += 1) {
      const value = payload.exponents.reduce((sum, exponent, index) => sum + BigInt(payload.counts[index] === null ? candidate : payload.counts[index]) * power(exponent), 0n);
      if (value === BigInt(payload.total)) candidates.push(candidate);
    }
    assert(candidates.length === 1, `빈칸 답 후보가 ${candidates.length}개입니다.`);
    return { answer: String(candidates[0]), tokens: [String(candidates[0])], complexity: Math.max(...payload.exponents) + String(payload.total).length + String(candidates[0]).length };
  }

  if (kind === "represented-digit-order") {
    const values = [
      BigInt(payload.firstNumber),
      BigInt(payload.secondNumber),
      BigInt(payload.thirdBase) * power(payload.scalePower),
      payload.fourthCounts.reduce((sum, count, index) => sum + BigInt(count) * power(payload.fourthUnitExponents[index]), 0n)
    ];
    assert(prompt.includes(readKorean(values[0])) && prompt.includes(formatInteger(values[1])), "네 수의 표현과 검산 자료가 다릅니다.");
    const placeValues = values.map(value => {
      const exponents = value.toString().split("").map((digit, index, digits) => Number(digit) === payload.targetDigit ? digits.length - index - 1 : -1).filter(exponent => exponent >= 0);
      assert(exponents.length === 1, `숫자 ${payload.targetDigit}의 자리가 하나로 표시되지 않습니다.`);
      return BigInt(payload.targetDigit) * power(exponents[0]);
    });
    assert(new Set(placeValues.map(String)).size === 4, "비교할 네 자리값이 서로 다르지 않습니다.");
    const answer = placeValues.map((value, index) => ({ value, label: symbols[index] })).sort((left, right) => left.value > right.value ? -1 : 1).map(item => item.label).join(", ");
    return { answer, tokens: [answer], complexity: Math.max(...values.map(value => value.toString().length)) };
  }

  if (kind === "four-coefficients") {
    const base = power(payload.groupWidth);
    let remaining = BigInt(payload.value);
    const recovered = [];
    for (let index = 0; index < 4; index += 1) {
      recovered.unshift(Number(remaining % base));
      remaining /= base;
    }
    assert(remaining === 0n && recovered.every(value => value > 0 && BigInt(value) < base), "네 묶음으로 하나씩 나뉘지 않습니다.");
    const answer = recovered.map((value, index) => `${symbols[index]} ${value}`).join(", ");
    return { answer, tokens: [answer], complexity: payload.groupWidth };
  }

  if (kind === "unit-count-scaled-digit-sum") {
    assert(payload.exponents.length === 3 && payload.counts.length === 3, "단위 개수 조건이 세 개가 아닙니다.");
    const base = payload.counts.reduce((sum, count, index) => sum + BigInt(count) * power(payload.exponents[index]), 0n);
    const scaled = base * power(payload.scalePower);
    const answer = payload.requestedExponents.reduce((sum, exponent) => sum + digitAt(scaled, exponent), 0);
    return { answer: String(answer), tokens: [String(answer)], complexity: Math.max(...payload.exponents) + payload.scalePower };
  }

  if (kind === "two-marked-place-ratio") {
    const highDigit = digitAtText(payload.number, payload.highExponent);
    const lowDigit = digitAtText(payload.number, payload.lowExponent);
    const highValue = BigInt(highDigit) * power(payload.highExponent);
    const lowValue = BigInt(lowDigit) * power(payload.lowExponent);
    assert(lowValue > 0n && highValue > lowValue && highValue % lowValue === 0n, "표시한 두 자리값의 배수가 하나로 정해지지 않습니다.");
    const answer = formatInteger(highValue / lowValue);
    return { answer, tokens: [answer], complexity: String(payload.number).length + payload.highExponent - payload.lowExponent };
  }

  if (kind === "two-scale-digit-sum") {
    const divisor = power(payload.downPower);
    assert(BigInt(payload.base) % divisor === 0n, "분의 1로 한 수가 자연수가 아닙니다.");
    const upValue = BigInt(payload.base) * power(payload.upPower);
    const downValue = BigInt(payload.base) / divisor;
    const answer = digitAt(upValue, payload.upExponent) + digitAt(downValue, payload.downExponent);
    return { answer: String(answer), tokens: [String(answer)], complexity: String(payload.base).length + payload.upPower + payload.downPower };
  }

  if (kind === "four-number-digit-count") {
    assert(payload.clues.length === 4, "범위로 나타낸 수가 네 개가 아닙니다.");
    let total = 0;
    for (const clue of payload.clues) {
      const value = BigInt(clue.base) - BigInt(clue.subtrahend);
      assert(value > 0n, "보다 작은 수가 자연수가 아닙니다.");
      total += value.toString().split("").filter(digit => Number(digit) === payload.targetDigit).length;
    }
    const maximumExponent = Math.max(...payload.clues.map(clue => String(clue.base).length - 1));
    return { answer: String(total), tokens: [String(total)], complexity: maximumExponent + payload.clues.reduce((sum, clue) => sum + String(clue.subtrahend).length, 0) / 4 };
  }

  if (kind === "signal-distance-digit-difference") {
    const meters = multiplyDecimalByInt(payload.speed, payload.seconds);
    const centimeters = multiplyDecimalByInt(meters, payload.centimeterUnit);
    const digits = payload.requestedExponents.map(exponent => digitAtText(centimeters, exponent));
    assert(digits[0] !== digits[1], "두 자리 숫자의 차가 0으로 고정되었습니다.");
    const answer = String(Math.abs(digits[0] - digits[1]));
    return { answer, tokens: [answer], complexity: String(payload.speed).length + String(payload.seconds).length + Math.log10(payload.seconds) };
  }

  throw new Error(`알 수 없는 검산 구조 ${kind}입니다.`);
}

const sourceItems = inventory.items.filter(item => Number(item.unit) === 1 && Number(item.exploration) === 1);
check(sourceItems.length === 11, `원문 목록 항목 수가 11개가 아닙니다: ${sourceItems.length}`);
check(sourceItems.map(item => item.sourceItemId).join("|") === expectedSourceIds.join("|"), "variant 0..10과 원문 목록 정렬 순서가 다릅니다.");
check(api.names.includes(generatorKey), `${generatorKey} 생성기가 등록되지 않았습니다.`);
for (let variant = 0; variant < 11; variant += 1) {
  check(api.generatorKey({ generatorKey, variant }) === generatorKey, `variant ${variant}: generatorKey 연결이 끊겼습니다.`);
}

const promptSets = Array.from({ length: 11 }, () => difficulties.map(() => new Set()));
const answerSets = Array.from({ length: 11 }, () => difficulties.map(() => new Set()));
const complexitySums = Array.from({ length: 11 }, () => difficulties.map(() => 0));
const kindOwners = new Map();
let generatedCount = 0;

for (let variant = 0; variant < 11; variant += 1) {
  const type = { id: expectedSourceIds[variant], name: sourceItems[variant]?.typeLabel || expectedSourceIds[variant], generatorKey, variant };
  for (let difficultyIndex = 0; difficultyIndex < difficulties.length; difficultyIndex += 1) {
    const difficulty = difficulties[difficultyIndex];
    for (let seed = 1; seed <= seedsPerDifficulty; seed += 1) {
      const context = `variant ${variant} / 난이도 ${difficulty} / 시드 ${seed}`;
      try {
        const generated = api.generate(type, 0, difficulty, seed, variant);
        assert(generated?.generator === generatorKey, "다른 생성기가 호출되었습니다.");
        assert(Boolean(generated.prompt && generated.answer !== "" && generated.solution), "문제·정답·풀이가 비었습니다.");
        const visible = visibleText(`${generated.prompt} ${generated.answer} ${generated.solution}`);
        assert(!/undefined|null|NaN|Infinity/.test(visible), "깨진 계산값이 보입니다.");
        assert(!/\b\d+\s*\/\s*\d+\b/.test(visible), "가공되지 않은 분수가 보입니다.");
        assert(!/\d+\.\d{5,}/.test(visible), "긴 소수 꼬리가 보입니다.");
        for (const term of [/√/, /제곱근/, /순열/, /조합/, /로그/, /지수/, /미지수/, /방정식/, /절댓값/, /계수/]) assert(!term.test(visible), `초등 범위를 벗어난 표현 ${term}이 보입니다.`);
        const visibleNumbers = [...visible.matchAll(/\d[\d,]*/g)].map(match => match[0].replace(/,/g, ""));
        for (const originalNumber of originalNumbers) assert(!visibleNumbers.includes(originalNumber), `원문 숫자 ${originalNumber}를 그대로 사용했습니다.`);

        auditStructure(variant, generated.prompt);
        const evidence = readEvidence(generated.prompt);
        assert(evidence.kind === expectedKinds[variant], `분기 구조가 ${evidence.kind}로 바뀌었습니다.`);
        assert(evidence.payload.variant === variant, "검산 자료의 variant가 다릅니다.");
        assert(evidence.payload.level === difficulty + 1, "난이도 단계가 다릅니다.");
        const owner = kindOwners.get(evidence.kind);
        assert(owner === undefined || owner === variant, `검산 구조 ${evidence.kind}가 둘 이상의 variant에 쓰였습니다.`);
        kindOwners.set(evidence.kind, variant);

        const independent = independentAnswer(evidence.kind, evidence.payload, generated.prompt);
        assert(String(independent.answer) === String(evidence.declared), `생성기 선언 답 ${evidence.declared}과 독립 답 ${independent.answer}이 다릅니다.`);
        assert(String(independent.answer) === String(generated.answer), `표시 답 ${generated.answer}과 독립 답 ${independent.answer}이 다릅니다.`);
        for (const token of independent.tokens) assert(generated.solution.includes(String(token)), `풀이에 필요한 결과 ${token}이 없습니다.`);
        assert(visibleText(generated.solution).length >= 45, "풀이 단계가 너무 짧습니다.");

        promptSets[variant][difficultyIndex].add(visibleText(generated.prompt));
        answerSets[variant][difficultyIndex].add(String(generated.answer));
        complexitySums[variant][difficultyIndex] += independent.complexity;
        generatedCount += 1;
      } catch (error) {
        failures.push(`${context}: ${error.message}`);
      }
    }
  }
}

const minimumAnswerDiversity = [100, 100, 2, 8, 8, 100, 8, 2, 8, 4, 5];
for (let variant = 0; variant < 11; variant += 1) {
  for (let difficultyIndex = 0; difficultyIndex < difficulties.length; difficultyIndex += 1) {
    check(promptSets[variant][difficultyIndex].size >= 300, `variant ${variant} / 난이도 ${difficulties[difficultyIndex]}: 문제 다양성이 ${promptSets[variant][difficultyIndex].size}개뿐입니다.`);
    check(answerSets[variant][difficultyIndex].size >= minimumAnswerDiversity[variant], `variant ${variant} / 난이도 ${difficulties[difficultyIndex]}: 정답 다양성이 ${answerSets[variant][difficultyIndex].size}개뿐입니다.`);
  }
  const averages = complexitySums[variant].map(sum => sum / seedsPerDifficulty);
  check(averages[0] < averages[1] && averages[1] < averages[2], `variant ${variant}: 난이도별 범위·추론 단계가 커지지 않습니다 (${averages.map(value => value.toFixed(2)).join(", ")}).`);
}

check(kindOwners.size === 11, `서로 식별되는 variant 구조가 11개가 아닙니다: ${kindOwners.size}`);
check(generatedCount === 11 * 3 * seedsPerDifficulty, `생성 검산 횟수가 ${generatedCount}회입니다.`);

if (failures.length) {
  console.error(`4-1 큰 수 개념탐구 1 전용 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 80).join("\n"));
  process.exit(1);
}

console.log(`4-1 큰 수 개념탐구 1 전용 감사 통과: 원문 11항목 · 11구조 · ${generatedCount.toLocaleString()}회 독립 검산 · 난수/난이도/초등 표현 확인`);
