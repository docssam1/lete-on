"use strict";

global.window = {};
require("./curriculum.js");
require("./generators.js");

const curriculum = window.HSE_CURRICULUM;
const api = window.HSE_GENERATORS;
const unit = curriculum.semesters.find(item => item.id === "5-1")?.units.find(item => item.id === "5-1-u3");
const types = unit?.subunits.flatMap(item => item.types) || [];
const e4 = types.filter(type => type.sourceItemId?.startsWith("5-1-u3-e4-"));
const failures = [];
let checked = 0;

const fail = message => failures.push(message);
const expectedIds = new Set([
  "5-1-u3-e4-exploration",
  "5-1-u3-e4-example-4-1",
  "5-1-u3-e4-example-4-2",
  "5-1-u3-e4-example-4-3",
  "5-1-u3-e4-mission-1",
  "5-1-u3-e4-mission-2",
  "5-1-u3-e4-mission-3",
  "5-1-u3-e4-mission-4",
  "5-1-u3-e4-mission-5",
  "5-1-u3-e4-mission-6"
]);
const expectedKinds = new Map([
  [0, "candle-time"],
  [1, "paired-ages"],
  [2, "two-rate-fill"],
  [3, "city-time"],
  [4, "future-age-multiple"],
  [5, "joined-table-seats"],
  [6, "opposite-tree-circle"],
  [7, "rounded-parking-fee"],
  [8, "sound-distance"],
  [9, "coin-stack-city-time"]
]);
const expectedContracts = new Map([
  [0, "single-value"], [1, "ordered"], [2, "ordered"], [3, "ordered"],
  [4, "single-value"], [5, "single-value"], [6, "single-value"],
  [7, "single-value"], [8, "single-value"], [9, "single-value"]
]);
const expectedValueLengths = new Map([
  ["candle-time", 6], ["paired-ages", 5], ["two-rate-fill", 5],
  ["city-time", 2], ["future-age-multiple", 4], ["joined-table-seats", 1],
  ["opposite-tree-circle", 3], ["rounded-parking-fee", 2],
  ["sound-distance", 2], ["coin-stack-city-time", 4]
]);
const sourcePhrases = new Map([
  [0, ["초에", "시각"]],
  [1, ["형의", "민수"]],
  [2, ["물통", "관계식"]],
  [3, ["로마", "서울", "뉴욕"]],
  [4, ["어머니", "아들"]],
  [5, ["탁자", "앉을 수"]],
  [6, ["호수", "나무"]],
  [7, ["주차", "올려"]],
  [8, ["소리", "기온"]],
  [9, ["카이로", "리스본", "동전"]]
]);

function enumerateNaturalCandidates(limit, predicate) {
  const candidates = [];
  for (let value = 1; value <= limit; value += 1) if (predicate(value)) candidates.push(value);
  return candidates;
}

function enumerateNaturalPairs(limit, predicate) {
  const candidates = [];
  for (let first = 1; first <= limit; first += 1) {
    for (let second = 1; second <= limit; second += 1) if (predicate(first, second)) candidates.push([first, second]);
  }
  return candidates;
}

function clockText(totalMinutes) {
  const minutesInDay = ((totalMinutes % 1440) + 1440) % 1440;
  const hour24 = Math.floor(minutesInDay / 60);
  const minute = minutesInDay % 60;
  const period = hour24 < 12 ? "오전" : "오후";
  const hour = hour24 % 12 || 12;
  return `${period} ${hour}시${minute ? ` ${minute}분` : ""}`;
}

function clockSecondsText(totalSeconds) {
  const secondsInDay = ((totalSeconds % 86400) + 86400) % 86400;
  const hour24 = Math.floor(secondsInDay / 3600);
  const minute = Math.floor(secondsInDay / 60) % 60;
  const second = secondsInDay % 60;
  const period = hour24 < 12 ? "오전" : "오후";
  const hour = hour24 % 12 || 12;
  return `${period} ${hour}시 ${minute}분 ${second}초`;
}

function parseTag(prompt) {
  const matches = [...prompt.matchAll(/<span hidden data-correspondence-e4-kind="([^"]+)" data-correspondence-e4-values="([^"]*)" data-result-contract="([^"]+)"><\/span>/g)];
  if (matches.length !== 1) throw new Error(`독립 검산 태그가 ${matches.length}개입니다.`);
  const [, kind, rawValues, contract] = matches[0];
  const values = rawValues.split(",").filter(Boolean).map(value => {
    if (!/^-?\d+(?:\.\d+)?$/.test(value)) throw new Error("검산 태그 값에 숫자가 아닌 값이 있습니다.");
    const number = Number(value);
    if (!Number.isFinite(number) || !Number.isInteger(number)) throw new Error("검산 태그 값이 유한한 정수가 아닙니다.");
    return number;
  });
  if (values.length !== expectedValueLengths.get(kind)) throw new Error(`${kind} 태그 값 개수가 다릅니다.`);
  return { kind, values, contract };
}

function requireUnique(candidates, label) {
  if (candidates.length !== 1) throw new Error(`${label} 자연수 후보가 ${candidates.length}개입니다.`);
  return candidates;
}

function independentCalculation(kind, values) {
  let answer;
  let candidates;
  let display;
  if (kind === "candle-time") {
    const [startLength, lostLength, sampleMinutes, startTime, targetLength, elapsed] = values;
    if (startLength <= 0 || lostLength <= 0 || sampleMinutes <= 0 || startTime < 0 || targetLength <= 0 || elapsed <= 0) throw new Error("초 길이·시간 조건이 올바르지 않습니다.");
    const limit = Math.max(1440, Math.ceil(startLength * sampleMinutes / lostLength) + 1);
    candidates = enumerateNaturalCandidates(limit, value => startLength - lostLength * value / sampleMinutes === targetLength);
    requireUnique(candidates, "초 길이 역문제");
    answer = elapsed;
    if (candidates[0] !== elapsed) throw new Error(`태그의 경과 시간 ${elapsed}과 역산값 ${candidates[0]}이 다릅니다.`);
    display = clockText(startTime + elapsed);
  } else if (kind === "paired-ages") {
    const [older, younger, yearsAgo, olderYearsAgo, youngerYearsLater] = values;
    const pastSum = older + younger - 2 * yearsAgo;
    if (older <= younger || younger <= 0 || yearsAgo <= 0 || olderYearsAgo <= 0 || youngerYearsLater <= 0) throw new Error("두 나이 조건이 올바르지 않습니다.");
    candidates = enumerateNaturalPairs(Math.max(older + younger, pastSum), (old, young) =>
      old > young && old + young === pastSum + 2 * yearsAgo && old - olderYearsAgo === young + youngerYearsLater);
    requireUnique(candidates, "두 나이 역문제");
    if (candidates[0][0] !== older || candidates[0][1] !== younger) throw new Error("태그의 두 나이와 역산값이 다릅니다.");
    answer = `${older}살, ${younger}살`;
    display = answer;
  } else if (kind === "two-rate-fill") {
    const [slowRate, fastRate, capacity, switchTime, totalTime] = values;
    if (slowRate <= 0 || fastRate <= slowRate || capacity <= 0 || switchTime <= 0 || totalTime <= 0) throw new Error("물 채우기 속도 조건이 올바르지 않습니다.");
    const limit = Math.max(1440, Math.ceil(capacity / slowRate) + switchTime + 1);
    candidates = enumerateNaturalCandidates(limit, value => fastRate * value === capacity + (fastRate - slowRate) * switchTime);
    requireUnique(candidates, "물 채우기 역문제");
    if (candidates[0] !== totalTime) throw new Error(`태그의 전체 시간 ${totalTime}과 역산값 ${candidates[0]}이 다릅니다.`);
    answer = totalTime;
    display = `${fastRate}×△=${capacity}+${fastRate - slowRate}×□, ${totalTime}분`;
  } else if (kind === "city-time") {
    const [newYorkMinutes, seoulMinutes] = values;
    const expectedSeoul = newYorkMinutes + 13 * 60;
    if (newYorkMinutes < 0 || seoulMinutes < 0) throw new Error("도시 시각 값이 올바르지 않습니다.");
    candidates = enumerateNaturalCandidates(2880, value => value === expectedSeoul);
    requireUnique(candidates, "도시 시각 역문제");
    if (candidates[0] !== seoulMinutes) throw new Error(`태그의 서울 시각 ${seoulMinutes}과 역산값 ${candidates[0]}이 다릅니다.`);
    answer = seoulMinutes;
    display = `□=△+13, ${seoulMinutes >= 1440 ? "다음 날 " : "같은 날 "}${clockText(seoulMinutes)}`;
  } else if (kind === "future-age-multiple") {
    const [mother, son, multiplier, years] = values;
    if (mother <= son || son <= 0 || multiplier <= 1 || years <= 0) throw new Error("미래 나이 조건이 올바르지 않습니다.");
    candidates = enumerateNaturalCandidates(mother + son + 1000, value => mother + value === (son + value) * multiplier);
    requireUnique(candidates, "미래 나이 역문제");
    if (candidates[0] !== years) throw new Error(`태그의 미래 연수 ${years}와 역산값 ${candidates[0]}이 다릅니다.`);
    answer = years;
    display = `${years}년 뒤`;
  } else if (kind === "joined-table-seats") {
    const [tableCount] = values;
    if (tableCount <= 0) throw new Error("탁자 수가 자연수가 아닙니다.");
    answer = tableCount * 4 + 2;
    candidates = enumerateNaturalCandidates(answer, value => value === tableCount * 4 + 2);
    requireUnique(candidates, "탁자 자리 역문제");
    display = `${answer}명`;
  } else if (kind === "opposite-tree-circle") {
    const [firstTree, oppositeTree, spacing] = values;
    if (firstTree <= 0 || oppositeTree <= firstTree || spacing <= 0) throw new Error("원 둘레 나무 조건이 올바르지 않습니다.");
    answer = (oppositeTree - firstTree) * spacing * 2;
    candidates = enumerateNaturalCandidates(answer, value => value === (oppositeTree - firstTree) * spacing * 2);
    requireUnique(candidates, "원 둘레 역문제");
    display = `${answer}m`;
  } else if (kind === "rounded-parking-fee") {
    const [actualMinutes, chargedMinutes] = values;
    if (actualMinutes <= 30 || chargedMinutes < actualMinutes || chargedMinutes % 10 !== 0) throw new Error("올림 주차요금 조건이 올바르지 않습니다.");
    answer = 3000 + (chargedMinutes - 30) / 10 * 500;
    candidates = enumerateNaturalCandidates(answer, value => value === 3000 + (chargedMinutes - 30) / 10 * 500);
    requireUnique(candidates, "주차요금 역문제");
    display = `${answer}원`;
  } else if (kind === "sound-distance") {
    const [temperature, seconds] = values;
    if (temperature < 0 || seconds <= 0) throw new Error("소리 거리 조건이 올바르지 않습니다.");
    const speed = 331 + 0.6 * temperature;
    answer = Number((speed * seconds).toFixed(1));
    // 거리 자체가 소수일 수 있으므로, 자연수인 경과 초를 역문제로 전수 확인한다.
    candidates = enumerateNaturalCandidates(120, value => Number((speed * value).toFixed(1)) === answer);
    requireUnique(candidates, "소리 거리의 경과 시간 역문제");
    if (candidates[0] !== seconds) throw new Error(`태그의 경과 시간 ${seconds}과 역산값 ${candidates[0]}이 다릅니다.`);
    display = `${answer}m`;
  } else if (kind === "coin-stack-city-time") {
    const [coinCount, startSeconds, elapsedSeconds, lisbonSeconds] = values;
    if (coinCount < 2 || startSeconds < 0 || elapsedSeconds <= 0 || lisbonSeconds < 0) throw new Error("동전 쌓기 시각 조건이 올바르지 않습니다.");
    let expectedElapsed = 0;
    for (let coin = 2; coin <= coinCount; coin += 1) expectedElapsed += String(coin).length;
    candidates = enumerateNaturalCandidates(Math.max(3 * coinCount, expectedElapsed + 1), value => value === expectedElapsed);
    requireUnique(candidates, "동전 쌓기 시간 역문제");
    if (candidates[0] !== elapsedSeconds) throw new Error(`태그의 쌓기 시간 ${elapsedSeconds}과 역산값 ${candidates[0]}이 다릅니다.`);
    const expectedLisbon = startSeconds - 3600 + elapsedSeconds;
    if (expectedLisbon !== lisbonSeconds) throw new Error(`태그의 리스본 시각 ${lisbonSeconds}과 계산값 ${expectedLisbon}이 다릅니다.`);
    display = clockSecondsText(lisbonSeconds);
  } else {
    throw new Error(`알 수 없는 E4 대응 규칙 ${kind}`);
  }
  if (candidates.length !== 1) throw new Error("역문제 자연수 후보가 하나가 아닙니다.");
  return { display, candidates };
}

function checkAnchors() {
  const anchors = [
    ["candle-time", [30, 3, 20, 1140, 6, 160], "오후 9시 40분"],
    ["paired-ages", [19, 12, 7, 3, 4], "19살, 12살"],
    ["two-rate-fill", [4, 6, 240, 30, 50], "6×△=240+2×□, 50분"],
    ["city-time", [540, 1320], "□=△+13, 같은 날 오후 10시"],
    ["future-age-multiple", [16, 5, 2, 6], "6년 뒤"],
    ["joined-table-seats", [8], "34명"],
    ["opposite-tree-circle", [2, 8, 3], "36m"],
    ["rounded-parking-fee", [32, 40], "3500원"],
    ["sound-distance", [5, 3], "1002m"],
    ["coin-stack-city-time", [39, 58020, 68, 54488], "오후 3시 8분 8초"]
  ];
  for (const [kind, values, expected] of anchors) {
    try {
      const result = independentCalculation(kind, values);
      if (result.display !== expected || result.candidates.length !== 1) throw new Error(`계산값 ${result.display}, 후보 ${result.candidates.length}`);
    } catch (error) {
      fail(`원문 앵커 ${kind}: ${error.message}`);
    }
  }
}

function checkGenerated(type, generated, difficulty) {
  if (!generated?.prompt || generated.answer === undefined || !generated.solution) throw new Error("문제·정답·풀이가 모두 있어야 합니다.");
  const tag = parseTag(generated.prompt);
  if (tag.kind !== expectedKinds.get(type.variant)) throw new Error(`태그 유형 ${tag.kind}가 변형 ${type.variant}와 다릅니다.`);
  if (tag.contract !== expectedContracts.get(type.variant)) throw new Error(`답 계약 ${tag.contract}가 원문 계약과 다릅니다.`);
  for (const phrase of sourcePhrases.get(type.variant)) if (!generated.prompt.includes(phrase)) throw new Error(`원문 핵심 표현 ${phrase}가 없습니다.`);
  const recalculated = independentCalculation(tag.kind, tag.values);
  if (String(generated.answer).replaceAll(" ", "") !== recalculated.display.replaceAll(" ", "")) throw new Error(`독립 계산 ${recalculated.display}과 표시 답 ${generated.answer}가 다릅니다.`);
  const text = `${generated.prompt} ${generated.solution}`;
  if (difficulty === -1 && !generated.prompt.includes("풀이 도움:")) throw new Error("쉬움 난이도 안내가 없습니다.");
  if (difficulty === 0 && (text.includes("풀이 도움:") || text.includes("다시 확인하세요."))) throw new Error("기준 난이도에 다른 단계 안내가 섞였습니다.");
  if (difficulty === 1 && !generated.prompt.includes("처음 조건에 다시 넣어 맞는지 확인하세요.")) throw new Error("어려움 난이도 안내가 없습니다.");
  if (/undefined|null|NaN|Infinity|방정식|함수|좌표|순열|조합|확률|소인수|제곱근|미지수|이차/.test(text)) throw new Error("화면 오류 또는 학년 밖 표현이 있습니다.");
  checked += 1;
}

if (!unit) fail("5-1 규칙과 대응 단원을 찾을 수 없습니다.");
if (types.length !== 41 || e4.length !== 10) fail(`규칙과 대응 유형 수가 전체 41·개념탐구 4 10이 아닙니다: ${types.length}/${e4.length}`);
if (new Set(types.map(type => type.sourceItemId)).size !== types.length) fail("원문 유형 ID가 중복됩니다.");
if (new Set(e4.map(type => type.sourceItemId)).size !== 10 || e4.some(type => !expectedIds.has(type.sourceItemId))) fail("개념탐구 4 원문 ID 집합이 다릅니다.");
if (e4.some(type => type.reviewLocked || api.generatorKey(type) !== "correspondenceE4")) fail("개념탐구 4는 variant 0~9 모두 공개·correspondenceE4 연결이어야 합니다.");
if (new Set(e4.map(type => type.variant)).size !== 10 || e4.some(type => !expectedKinds.has(type.variant))) fail("개념탐구 4 variant 0~9 구성이 완전하지 않습니다.");
for (const type of e4) {
  const expectedPage = type.sourceSection === "mission" ? 38 : 37;
  if (type.sourcePdfPage !== expectedPage || type.sourcePrintedPage !== expectedPage + 1) fail(`${type.sourceItemId}: 원문 쪽수가 다릅니다.`);
  if (!type.sourceVerified) fail(`${type.sourceItemId}: 원문 확인 표시가 없습니다.`);
}
checkAnchors();

for (const type of e4) {
  for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 1000; seed += 1) {
    try {
      const generated = api.generate(type, 0, difficulty, seed, type.variant);
      checkGenerated(type, generated, difficulty);
    } catch (error) {
      fail(`${type.sourceItemId} / 난이도 ${difficulty} / 시드 ${seed}: ${error.message}`);
    }
  }
}

if (failures.length) {
  console.error(`5-1 규칙과 대응 개념탐구 4 독립 감사 실패: ${failures.length}건\n${failures.slice(0, 100).join("\n")}`);
  process.exit(1);
}
console.log(`5-1 규칙과 대응 개념탐구 4 독립 감사 통과: 원문 10항목 · 공개 10/잠금 0 · ${checked.toLocaleString()}회 별도 공식·역문제 자연수 전수열거·원문 앵커·난이도·초등 언어 검사`);
