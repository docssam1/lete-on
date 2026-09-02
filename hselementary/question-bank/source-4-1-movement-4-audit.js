"use strict";

const fs = require("fs");
const path = require("path");
global.window = {};
require("./source-inventory-4-1.js");
require("./curriculum.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const runtime = window.HSE_SOURCE_INVENTORY_41;
const mappings = require("./source-inventory/4-1-native-generators.json").mappings;
const generatorKey = "source41PlaneTransformFour";
const digitMap = { 0: 0, 1: 1, 2: 2, 5: 5, 6: 9, 8: 8, 9: 6 };
const publicItems = new Map([
  ["4-1-u4-e4-example-4-1", 1], ["4-1-u4-e4-example-4-3", 3],
  ["4-1-u4-e4-mission-1", 5], ["4-1-u4-e4-mission-2", 6],
  ["4-1-u4-e4-mission-3", 7], ["4-1-u4-e4-mission-4", 8],
  ["4-1-u4-e4-mission-5", 9], ["4-1-u4-e4-mission-6", 10]
]);
const lockedItems = ["4-1-u4-e4-exploration", "4-1-u4-e4-example-4-2", "4-1-u4-e4-example-4-4"];
const expectedPoolSizes = { 1: [6, 65, 6], 3: [19, 90, 104], 5: [31, 115, 92], 6: [66, 20, 19], 8: [12, 954, 123043], 10: [36, 131, 284] };
const faceTransforms = new Map([
  ["", "r0"], ["rotate(90 45 45)", "r90"], ["rotate(180 45 45)", "r180"], ["rotate(270 45 45)", "r270"],
  ["translate(90 0) scale(-1 1)", "f0"], ["rotate(90 45 45) translate(90 0) scale(-1 1)", "f90"],
  ["rotate(180 45 45) translate(90 0) scale(-1 1)", "f180"], ["rotate(270 45 45) translate(90 0) scale(-1 1)", "f270"]
]);
const transformedFace = { r0: "f90", r90: "f0", r180: "f270", r270: "f180", f0: "r90", f90: "r0", f180: "r270", f270: "r180" };
const allFaceStates = Object.keys(transformedFace);
const failures = [];
const styles = fs.readFileSync(path.join(__dirname, "styles.css"), "utf8");
const observed = new Map();
let generatedAttempts = 0;
let validatedQuestions = 0;
let lockedCalls = 0;
let physicalOneChecks = 0;
let sawOriginalTwoThirty = false;

function fail(message) { if (failures.length < 100) failures.push(message); }
function expect(value, message) { if (!value) throw new Error(message); }
function turn(value) { return [...String(value)].reverse().map(digit => digitMap[digit]).join(""); }
function mod(value) { return ((value % 360) + 360) % 360; }
function smallAngle(first, second) { return Math.min(Math.abs(first - second), 360 - Math.abs(first - second)); }
function attrCount(html, pattern) { return (String(html).match(pattern) || []).length; }
function attribute(tag, name) { return String(tag).match(new RegExp(`${name}="([^"]*)"`))?.[1]; }
function closeTo(first, second, tolerance = .02) { return Math.abs(first - second) <= tolerance; }
function readEvidence(question) {
  const match = String(question.prompt).match(/data-source41-kind="([^"]+)" data-source41-payload="([^"]+)" data-source41-expected="([^"]+)"/);
  expect(match, "숨은 검산 자료가 없습니다.");
  return { templateId: match[1], payload: JSON.parse(decodeURIComponent(match[2])), expected: decodeURIComponent(match[3]) };
}
function visiblePrompt(question) { return String(question.prompt).replace(/<span hidden[^>]*><\/span>/g, "").replace(/\s+/g, " "); }
function svgByKind(html, kind) {
  const match = String(html).match(new RegExp(`<svg[^>]*data-source41-e4-kind="${kind}"[^>]*>[\\s\\S]*?<\\/svg>`));
  expect(match, `${kind} SVG를 찾을 수 없습니다.`);
  return match[0];
}
function cardNumbers(cards) {
  const values = new Set();
  const visit = (left, made) => {
    if (made.length === 6) { if (made[0] !== 0) values.add(Number(made.join(""))); return; }
    left.forEach((digit, index) => visit(left.filter((_, next) => next !== index), [...made, digit]));
  };
  visit(cards, []);
  return [...values].sort((a, b) => a - b);
}
function borrowCount(minuend, subtrahend) {
  const top = String(minuend); const bottom = String(subtrahend).padStart(top.length, "0");
  let borrow = 0, count = 0;
  for (let index = top.length - 1; index >= 0; index -= 1) {
    if (Number(top[index]) - borrow < Number(bottom[index])) { count += 1; borrow = 1; } else borrow = 0;
  }
  return count;
}
function fixedValues(lower, upper) { const output = []; for (let value = lower; value <= upper; value += 1) if (turn(value) === String(value)) output.push(value); return output; }
function timeText(total) { const value = ((total % 720) + 720) % 720; return `${Math.floor(value / 60) || 12}시 ${String(value % 60).padStart(2, "0")}분`; }
function crossesTwelve(hour, minute, elapsed) { return (hour % 12) * 60 + minute + elapsed >= 720; }
function minuteCarry(minute, elapsed) { return minute + (elapsed % 60) >= 60; }
function durationText(minutes) { const hours = Math.floor(minutes / 60), rest = minutes % 60; return [hours ? `${hours}시간` : "", rest ? `${rest}분` : ""].filter(Boolean).join(" "); }
function components(cells) {
  const left = new Set(cells.map(([row, column]) => `${row},${column}`)); let count = 0;
  while (left.size) {
    count += 1;
    const first = left.values().next().value.split(",").map(Number), queue = [first]; left.delete(first.join(","));
    while (queue.length) {
      const [row, column] = queue.pop();
      [[row - 1, column], [row + 1, column], [row, column - 1], [row, column + 1]].forEach(([nextRow, nextColumn]) => {
        const key = `${nextRow},${nextColumn}`; if (left.delete(key)) queue.push([nextRow, nextColumn]);
      });
    }
  }
  return count;
}
function faceCards(html, kind) {
  const output = [];
  const regex = /<svg class="([^"]*source41-e4-face[^"]*)"[^>]*data-source41-e4-kind="([^"]+)"[^>]*data-card-index="([^"]+)" data-face-state="([^"]+)"[^>]*>([\s\S]*?)<\/svg>/g;
  let match;
  while ((match = regex.exec(String(html)))) {
    if (match[2] !== kind) continue;
    const transform = match[5].match(/<g transform="([^"]*)">/)?.[1], renderedState = faceTransforms.get(transform);
    expect(renderedState, `${kind} ${match[3]}번 카드의 렌더 변환을 해석할 수 없습니다.`);
    expect(renderedState === match[4], `${kind} ${match[3]}번 카드의 상태 메타데이터와 실제 변환이 다릅니다.`);
    output.push({ className: match[1], label: match[3], state: renderedState, html: match[0] });
  }
  return output;
}
function verifyPhysicalOne(solution, original) {
  if (!String(original).includes("1")) return;
  const svg = svgByKind(solution, "e4-example-4-1-turned");
  const rotation = svg.match(/class="source41-e4-physical-turn" transform="rotate\(180 ([\d.]+) ([\d.]+)\)"/);
  expect(rotation, "예제 4-1 풀이의 실제 180도 회전 그룹이 없습니다.");
  const centerX = Number(rotation[1]), centerY = Number(rotation[2]);
  [...String(original)].forEach((digit, digitIndex) => {
    if (digit !== "1") return;
    const group = svg.match(new RegExp(`<g data-digit-index="${digitIndex}" data-digit="1">([\\s\\S]*?)<\\/g>`));
    expect(group, `예제 4-1의 ${digitIndex}번째 숫자 1 조각을 찾을 수 없습니다.`);
    const transformed = {}; const rectRegex = /<rect[^>]*data-segment="([bc])"[^>]*>/g; let rect;
    while ((rect = rectRegex.exec(group[1]))) {
      const x = Number(attribute(rect[0], "x")), y = Number(attribute(rect[0], "y"));
      const width = Number(attribute(rect[0], "width")), height = Number(attribute(rect[0], "height"));
      transformed[rect[1]] = [2 * centerX - (x + width / 2), 2 * centerY - (y + height / 2)];
    }
    const targetIndex = String(original).length - digitIndex - 1, baseX = 10 + 48 * targetIndex;
    const expectedE = [baseX + 4.5, 68], expectedF = [baseX + 4.5, 32];
    expect(transformed.b && closeTo(transformed.b[0], expectedE[0], .6) && closeTo(transformed.b[1], expectedE[1], .6), "숫자 1의 b 조각이 물리 회전 뒤 왼쪽 아래 e 위치에 오지 않습니다.");
    expect(transformed.c && closeTo(transformed.c[0], expectedF[0], .6) && closeTo(transformed.c[1], expectedF[1], .6), "숫자 1의 c 조각이 물리 회전 뒤 왼쪽 위 f 위치에 오지 않습니다.");
    physicalOneChecks += 1;
  });
}
function verifyMirrorClockSvg(prompt, raw) {
  const svg = svgByKind(prompt, "e4-mission-6-mirror");
  expect(attrCount(svg, /scale\(-1 1\)/g) === 1, "Mission 6 시계는 실제 바늘 그룹을 정확히 한 번만 거울 반사해야 합니다.");
  for (const [name, index, length] of [["hour", 0, 42], ["minute", 1, 62]]) {
    const line = svg.match(new RegExp(`<line data-hand="${name}"[^>]*>`));
    expect(line, `Mission 6의 ${name} 바늘이 없습니다.`);
    const angle = raw.actualAngles[index], radians = angle * Math.PI / 180;
    const expectedX = 90 + length * Math.sin(radians), expectedY = 90 - length * Math.cos(radians);
    const x = Number(attribute(line[0], "x2")), y = Number(attribute(line[0], "y2"));
    expect(closeTo(x, expectedX) && closeTo(y, expectedY), `Mission 6의 ${name} 바늘 endpoint가 실제 각도와 다릅니다.`);
    const reflectedX = 180 - x, reflectedY = y;
    const visibleAngle = mod(Math.atan2(reflectedX - 90, 90 - reflectedY) * 180 / Math.PI);
    expect(closeTo(visibleAngle, raw.visibleAngles[index], .03), `Mission 6의 ${name} 바늘을 화면에서 역산한 거울 각도가 다릅니다.`);
  }
}
function observe(variant, difficulty, key) {
  const id = `${variant}:${difficulty}`;
  if (!observed.has(id)) observed.set(id, new Set());
  observed.get(id).add(key);
}

function independentlyCheck(variant, difficulty, question) {
  const { templateId, payload, expected } = readEvidence(question), raw = payload.raw, levelIndex = difficulty + 1;
  expect(payload.templateId === templateId && payload.coreFingerprint && payload.visualFingerprint, "templateId 또는 fingerprint가 없습니다.");
  expect(question.answer === expected, "생성기 답과 화면 근거의 답이 다릅니다.");
  expect(!/undefined|null|NaN|Infinity/.test(`${question.prompt}${question.solution}${question.answer}`), "잘못된 값이 화면에 있습니다.");
  if (expectedPoolSizes[variant]) expect(raw.candidatePoolSize === expectedPoolSizes[variant][levelIndex] || raw.cardPoolSize === expectedPoolSizes[variant][levelIndex], `유형 ${variant} 난이도 ${difficulty}의 안전 후보 수가 설계와 다릅니다.`);

  if (variant === 1) {
    const original = String(raw.original), rotated = turn(original), digit69Count = [...original].filter(digit => digit === "6" || digit === "9").length;
    const distinctCount = new Set(original).size, borrows = borrowCount(rotated, original), difference = Number(rotated) - Number(original);
    expect(rotated === raw.turned && difference === Number(expected) && difference > 0, "예제 4-1을 독립 회전 계산한 값이 다릅니다.");
    if (difficulty === -1) expect(distinctCount === 3 && digit69Count === 1 && borrows === 1, "예제 4-1 쉬움의 서로 다른 숫자·6/9·받아내림 조건이 다릅니다.");
    if (difficulty === 0) expect(digit69Count >= 1 && digit69Count <= 2 && difference >= 100 && difference <= 899, "예제 4-1 표준의 6/9 개수 또는 차 범위가 다릅니다.");
    if (difficulty === 1) expect(digit69Count >= 2 && borrows >= 2 && original !== rotated, "예제 4-1 어려움의 6/9·받아내림 조건이 다릅니다.");
    expect(/data-physical-turn="true"/.test(question.solution), "일곱 조각을 실제로 돌린 SVG가 없습니다.");
    verifyPhysicalOne(question.solution, original);
    expect(payload.visualFingerprint === `${original}:${rotated}`, "예제 4-1의 보이는 조각 fingerprint가 다릅니다.");
    observe(variant, difficulty, payload.coreFingerprint);
  } else if (variant === 3) {
    const hour = raw.actual.hour, minute = raw.actual.minute;
    const hourAngle = (hour % 12) * 30 + minute * .5, minuteAngle = minute * 6, handGap = smallAngle(hourAngle, minuteAngle);
    expect(raw.actualAngles[0] === hourAngle && raw.actualAngles[1] === minuteAngle, "예제 4-3의 처음 바늘 각도가 다릅니다.");
    expect(raw.rotatedAngles[0] === mod(hourAngle + 270) && raw.rotatedAngles[1] === mod(minuteAngle + 270), "예제 4-3은 원시 바늘 각도에 270도를 직접 더해야 합니다.");
    expect(raw.mirrorAngles[0] === mod(360 - raw.rotatedAngles[0]) && raw.mirrorAngles[1] === mod(360 - raw.rotatedAngles[1]), "예제 4-3 작은 시계의 거울 각도가 다릅니다.");
    if (difficulty === -1) expect([0, 30].includes(minute) && handGap >= 40, "예제 4-3 쉬움의 분 또는 바늘 간격이 다릅니다.");
    if (difficulty === 0) expect([10, 15, 20, 25, 30, 35, 40, 45, 50].includes(minute) && handGap >= 30, "예제 4-3 표준의 분 또는 바늘 간격이 다릅니다.");
    if (difficulty === 1) expect(minute % 5 === 0 && minute !== 0 && minute !== 30 && handGap >= 24 && hourAngle % 30 !== 0, "예제 4-3 어려움의 분 또는 바늘 간격이 다릅니다.");
    if (hour === 2 && minute === 30) { expect(raw.rotatedAngles[0] === 345 && raw.rotatedAngles[1] === 90 && raw.rotatedAngles[0] !== 337.5, "2시 30분 표본의 물리 회전 각도가 다릅니다."); sawOriginalTwoThirty = true; }
    expect(attrCount(question.prompt, /data-hand="hour"/g) === 2 && attrCount(question.prompt, /data-hand="minute"/g) === 2 && attrCount(question.prompt, /data-ticks="12"/g) === 2 && /data-mirror="true"/.test(question.prompt), "큰 시계와 작은 거울 시계가 완전하지 않습니다.");
    const large = svgByKind(question.prompt, "e4-example-4-3-rotated"), mirror = svgByKind(question.prompt, "e4-example-4-3-mirror");
    expect(/width:min\(180px,100%\)/.test(large) && /width:min\(118px,100%\)/.test(mirror), "예제 4-3의 작은 거울·큰 실제 시계 크기 차가 없습니다.");
    expect(Number(attribute(large.match(/<svg[^>]+>/)[0], "data-raw-hour-angle")) === raw.rotatedAngles[0], "예제 4-3 큰 시계가 원시 회전 각도로 그려지지 않았습니다.");
    expect(payload.visualFingerprint === `${raw.rotatedAngles[0]}:${raw.rotatedAngles[1]}`, "예제 4-3의 시계 fingerprint가 다릅니다.");
    observe(variant, difficulty, payload.coreFingerprint);
  } else if (variant === 5) {
    const values = cardNumbers(raw.cards), third = values[2], counts = new Map(); raw.cards.forEach(digit => counts.set(digit, (counts.get(digit) || 0) + 1));
    const distinctCount = counts.size, digit69Count = (counts.get(6) || 0) + (counts.get(9) || 0);
    expect(third === raw.third && Number(turn(third)) === raw.upside && raw.P - raw.upside === raw.x && third - raw.x === Number(expected), "Mission 1의 여섯 장 전수 배열 계산이 다릅니다.");
    expect(raw.cards.length === 7 && (counts.get(0) || 0) === 1 && digit69Count >= 1 && distinctCount >= 5 && Math.max(...counts.values()) <= 2, "Mission 1의 0·6/9·서로 다른 카드 공통 조건이 다릅니다.");
    expect(values.length >= 500 && raw.candidateCount === values.length && !String(third).endsWith("0") && raw.x > 0 && third - raw.x > 0 && raw.P <= 999999, "Mission 1의 후보 수 또는 숨은 수 안전 조건이 다릅니다.");
    if (difficulty === -1) expect(distinctCount >= 6 && raw.x >= 1000 && raw.x <= 9999, "Mission 1 쉬움의 카드 종류 또는 x 범위가 다릅니다.");
    if (difficulty === 0) expect(distinctCount >= 5 && distinctCount <= 7 && raw.x >= 4000 && raw.x <= 19999, "Mission 1 표준의 카드 종류 또는 x 범위가 다릅니다.");
    if (difficulty === 1) expect(distinctCount >= 5 && distinctCount <= 6 && raw.x >= 20000 && raw.x <= 50000 && borrowCount(third, raw.x) >= 2, "Mission 1 어려움의 카드 종류·x·받아내림 조건이 다릅니다.");
    const renderedCards = [...String(question.prompt).matchAll(/data-source41-e4-kind="e4-mission-1-card" data-seven-value="([0-9])"/g)].map(match => Number(match[1]));
    expect(JSON.stringify(renderedCards) === JSON.stringify(raw.cards) && renderedCards.length === 7, "Mission 1의 물리 카드 7장 또는 표시 순서가 다릅니다.");
    expect(payload.visualFingerprint === `${raw.cards.join("")}|${raw.P}`, "Mission 1의 카드·제시값 fingerprint가 다릅니다.");
    observe(variant, difficulty, [...raw.cards].sort((a, b) => a - b).join(""));
  } else if (variant === 6) {
    const [hour, minute] = raw.actual.split(":").map(Number), carry = minute + raw.elapsed >= 60, crossing = crossesTwelve(hour, minute, raw.elapsed);
    expect(turn(raw.actual.replace(":", "")) === raw.shown.replace(":", "") && timeText((hour % 12) * 60 + minute + raw.elapsed) === expected, "Mission 2의 전자시계 시간 계산이 다릅니다.");
    if (difficulty === -1) expect([5, 10].includes(raw.elapsed) && !carry && !crossing, "Mission 2 쉬움은 분 올림이 없어야 합니다.");
    if (difficulty === 0) expect(raw.elapsed >= 10 && raw.elapsed <= 25 && raw.elapsed % 5 === 0 && carry && !crossing, "Mission 2 표준은 분 올림이 정확히 있고 12시를 넘지 않아야 합니다.");
    if (difficulty === 1) expect(raw.elapsed >= 25 && raw.elapsed <= 55 && raw.elapsed % 5 === 0 && crossing, "Mission 2 어려움은 12시를 넘어야 합니다.");
    const clockSvg = svgByKind(question.prompt, "e4-mission-2-upside-clock");
    expect(attribute(clockSvg.match(/<svg[^>]+>/)[0], "data-seven-value") === raw.shown && /data-colon="true"/.test(clockSvg) && raw.shown.length === 5 && raw.actual.length === 5, "Mission 2의 고정폭 시각 또는 쌍점이 없습니다.");
    expect(!/data-physical-turn="true"|rotate\(180/.test(clockSvg) && attrCount(clockSvg, /data-segment="colon-/g) === 2, "Mission 2의 보이는 시각을 다시 180도 돌렸습니다.");
    expect(payload.visualFingerprint === `${raw.shown}|${raw.elapsed}`, "Mission 2의 보이는 시각 fingerprint가 다릅니다.");
    observe(variant, difficulty, payload.coreFingerprint);
  } else if (variant === 7) {
    const cards = faceCards(question.prompt, "e4-mission-3-card"), targetCards = faceCards(question.prompt, "e4-mission-3-target");
    expect(cards.length === 16 && targetCards.length === 1, "Mission 3의 카드 16장 또는 목표 카드가 없습니다.");
    const renderedBoard = cards.map(card => card.state), target = targetCards[0].state;
    const matches = renderedBoard.map((state, index) => transformedFace[state] === target ? index : -1).filter(index => index >= 0);
    expect(JSON.stringify(renderedBoard) === JSON.stringify(raw.board) && target === raw.target && matches.length === Number(expected), "Mission 3의 렌더 상태를 전수 비교한 답이 다릅니다.");
    expect(new Set(renderedBoard).size === 8 && allFaceStates.every(state => renderedBoard.includes(state)), "Mission 3은 D4 여덟 상태를 모두 사용해야 합니다.");
    if (difficulty === -1) expect(matches.length >= 5 && matches.length <= 6, "Mission 3 쉬움의 정답 얼굴 수는 5~6개여야 합니다.");
    if (difficulty === 0) expect(matches.length >= 3 && matches.length <= 4, "Mission 3 표준의 정답 얼굴 수는 3~4개여야 합니다.");
    if (difficulty === 1) expect(matches.length >= 1 && matches.length <= 2 && renderedBoard.filter(state => state === raw.nearState).length >= 4, "Mission 3 어려움의 정답 수 또는 가까운 방해 상태 수가 다릅니다.");
    expect(!/data-target-match|source41-e4-face-solution-match|aria-label="[^"]*(맞는|정답)|fill="#dff5e7"|stroke="#147a48"/.test(question.prompt), "Mission 3 문제 DOM에 정답 위치 단서가 있습니다.");
    const solutionCards = faceCards(question.solution, "e4-mission-3-solution-card"), highlighted = solutionCards.map((card, index) => card.className.includes("source41-e4-face-solution-match") ? index : -1).filter(index => index >= 0);
    expect(solutionCards.length === 16 && JSON.stringify(highlighted) === JSON.stringify(matches), "Mission 3 풀이에서만 맞는 얼굴을 정확히 표시해야 합니다.");
    expect(payload.visualFingerprint === `${target}|${renderedBoard.join(",")}`, "Mission 3의 목표·배치 fingerprint가 다릅니다.");
    observe(variant, difficulty, payload.coreFingerprint);
  } else if (variant === 8) {
    const values = fixedValues(raw.lower, raw.upper), width = raw.upper - raw.lower;
    expect(JSON.stringify(values) === JSON.stringify(raw.values) && values.length === Number(expected) && raw.fixedCount === 42, "Mission 4의 네 자리 수 전수 열거가 다릅니다.");
    if (difficulty === -1) expect([0, 500].includes(raw.lower % 1000) && width === 499 && values.length >= 3 && values.length <= 4, "Mission 4 쉬움의 천 단위 절반 범위 또는 답 개수가 다릅니다.");
    if (difficulty === 0) expect(raw.lower % 100 === 0 && raw.upper % 100 === 0 && width >= 1000 && width <= 3000 && values.length >= 5 && values.length <= 12, "Mission 4 표준의 100 단위 범위 또는 답 개수가 다릅니다.");
    if (difficulty === 1) expect(raw.lower % 10 === 0 && raw.upper % 10 === 0 && raw.lower % 100 !== 0 && raw.upper % 100 !== 0 && width >= 2500 && width <= 6500 && values.length >= 10 && values.length <= 24, "Mission 4 어려움의 10 단위 범위 또는 답 개수가 다릅니다.");
    const empty = svgByKind(question.prompt, "e4-mission-4-empty");
    expect(/data-empty-board="true"/.test(empty) && attrCount(empty, /data-lit="true"/g) === 0 && attrCount(empty, /data-lit="false"/g) === 28 && attrCount(empty, /data-digit-index=/g) === 4, "Mission 4 문제판은 켜진 조각 0개·꺼진 조각 28개여야 합니다.");
    for (let digitIndex = 0; digitIndex < 4; digitIndex += 1) {
      const group = empty.match(new RegExp(`<g data-digit-index="${digitIndex}" data-digit="">([\\s\\S]*?)<\\/g>`));
      expect(group && attrCount(group[1], /data-lit="false"/g) === 7, `Mission 4의 ${digitIndex + 1}번째 빈 자리에 꺼진 조각 7개가 없습니다.`);
    }
    expect(!/data-seven-value="8888"|data-seven-value="9006"/.test(empty), "Mission 4 문제판에 특정 수의 조각이 들어 있습니다.");
    expect(payload.visualFingerprint === `${raw.lower}:${raw.upper}`, "Mission 4의 범위 fingerprint가 다릅니다.");
    observe(variant, difficulty, payload.coreFingerprint);
  } else if (variant === 9) {
    const transformed = Array.from({ length: 4 }, (_, row) => Array.from({ length: 4 }, (_, column) => raw.original[3 - column][3 - row]));
    const selected = raw.mask.map(([row, column]) => transformed[row][column]), black = selected.filter(value => value === "B").length, white = 11 - black;
    const blackTotal = raw.original.flat().filter(value => value === "B").length;
    const maskKeys = new Set(raw.mask.map(([row, column]) => `${row},${column}`)), holes = Array.from({ length: 16 }, (_, index) => [Math.floor(index / 4), index % 4]).filter(([row, column]) => !maskKeys.has(`${row},${column}`));
    const maskComponents = components(raw.mask), holeComponents = components(holes), difference = Math.abs(white - black);
    expect(JSON.stringify(transformed) === JSON.stringify(raw.transformed) && difference === Number(expected), "Mission 5의 좌표 변환과 색 계산이 다릅니다.");
    expect(raw.original.flat().length === 16 && raw.original.flat().every(value => value === "B" || value === "W") && blackTotal >= 6 && blackTotal <= 10, "Mission 5 처음 돌판의 16개 돌 또는 색 수가 다릅니다.");
    expect(raw.original.every(row => new Set(row).size === 2) && [0, 1, 2, 3].every(column => new Set(raw.original.map(row => row[column])).size === 2), "Mission 5의 모든 행과 열에는 두 색이 있어야 합니다.");
    expect(raw.mask.length === 11 && maskKeys.size === 11 && [0, 1, 2, 3].every(row => raw.mask.filter(([maskRow]) => maskRow === row).length >= 2 && raw.mask.filter(([maskRow]) => maskRow === row).length <= 3) && [0, 1, 2, 3].every(column => raw.mask.filter(([, maskColumn]) => maskColumn === column).length >= 2 && raw.mask.filter(([, maskColumn]) => maskColumn === column).length <= 3), "Mission 5 mask의 11칸·행·열 조건이 다릅니다.");
    if (difficulty === -1) expect(maskComponents === 1 && [5, 7].includes(difference), "Mission 5 쉬움의 덩어리 또는 차 조건이 다릅니다.");
    if (difficulty === 0) expect(maskComponents >= 1 && maskComponents <= 2 && difference === 3, "Mission 5 표준의 덩어리 또는 차 조건이 다릅니다.");
    if (difficulty === 1) expect(maskComponents >= 2 && maskComponents <= 3 && holeComponents >= 3 && difference === 1, "Mission 5 어려움의 덩어리 또는 차 조건이 다릅니다.");
    expect(attrCount(question.prompt, /data-stone=/g) === 16 && attrCount(question.solution, /data-stone=/g) === 11 && attrCount(question.prompt, /<rect data-mask=/g) === 11, "Mission 5의 문제·풀이 돌 공개 범위가 다릅니다.");
    expect(attrCount(svgByKind(question.prompt, "e4-mission-5-target"), /data-stone=/g) === 0, "Mission 5 문제의 빈 11칸에 변환 뒤 돌을 미리 보였습니다.");
    expect(raw.candidatePoolSize >= 200, "Mission 5 안전 후보가 200개보다 적습니다.");
    observe(variant, difficulty, payload.coreFingerprint);
  } else if (variant === 10) {
    const [hour, minute] = raw.actual, hourAngle = (hour % 12) * 30 + minute * .5, minuteAngle = minute * 6;
    const gap = smallAngle(hourAngle, minuteAngle), crossing = crossesTwelve(hour, minute, raw.elapsed), carry = minuteCarry(minute, raw.elapsed);
    expect(raw.actualAngles[0] === hourAngle && raw.actualAngles[1] === minuteAngle && raw.visibleAngles[0] === mod(360 - hourAngle) && raw.visibleAngles[1] === mod(360 - minuteAngle) && timeText((hour % 12) * 60 + minute + raw.elapsed) === expected, "Mission 6 거울 시계의 각도 또는 시간 계산이 다릅니다.");
    if (difficulty === -1) expect([0, 30].includes(minute) && [30, 60, 90].includes(raw.elapsed) && !crossing && !carry && gap >= 35, "Mission 6 쉬움의 분·올림·12시 통과·바늘 간격 조건이 다릅니다.");
    if (difficulty === 0) expect([10, 20, 40, 50].includes(minute) && raw.elapsed >= 40 && raw.elapsed <= 100 && raw.elapsed % 10 === 0 && carry && !crossing && gap >= 30, "Mission 6 표준의 분 올림·12시 통과·바늘 간격 조건이 다릅니다.");
    if (difficulty === 1) expect(minute % 5 === 0 && minute !== 0 && minute !== 30 && raw.elapsed >= 65 && raw.elapsed <= 145 && raw.elapsed % 5 === 0 && crossing && gap >= 20, "Mission 6 어려움의 12시 통과 또는 바늘 간격 조건이 다릅니다.");
    verifyMirrorClockSvg(question.prompt, raw);
    expect(/data-ticks="60"/.test(question.prompt) && /data-mirror="true"/.test(question.prompt), "Mission 6의 촘촘한 눈금 또는 거울이 없습니다.");
    expect(!/0시간/.test(question.prompt) && question.prompt.includes(`${durationText(raw.elapsed)} 뒤`), "Mission 6의 지난 시간 문구가 자연스럽지 않습니다.");
    expect(payload.visualFingerprint === `${raw.visibleAngles.join(":")}|${raw.elapsed}`, "Mission 6의 거울 바늘 fingerprint가 다릅니다.");
    observe(variant, difficulty, payload.coreFingerprint);
  }
}

for (const [sourceItemId, variant] of publicItems) {
  const item = runtime.items.find(entry => entry.sourceItemId === sourceItemId), mapping = mappings.find(entry => entry.sourceItemId === sourceItemId);
  if (!(item?.generatorKey === generatorKey && item.variant === variant && !item.reviewLocked && mapping?.generatorKey === generatorKey && mapping.variant === variant)) fail(`${sourceItemId}: 공개 연결이 다릅니다.`);
}
for (const sourceItemId of lockedItems) {
  const item = runtime.items.find(entry => entry.sourceItemId === sourceItemId);
  if (!(item?.reviewLocked && item.generatorKey === "" && !mappings.some(entry => entry.sourceItemId === sourceItemId))) fail(`${sourceItemId}: 잠긴 유형의 연결이 남아 있습니다.`);
  for (const difficulty of [-1, 0, 1]) for (let seed = 0; seed < 500; seed += 1) {
    lockedCalls += 1;
    try { api.generate({ ...item, generatorKey }, 0, difficulty, 900000 + seed, item.variant); fail(`${sourceItemId}: 직접 호출이 거부되지 않았습니다.`); } catch (error) { if (!/검수 대기/.test(error.message)) fail(`${sourceItemId}: 직접 호출이 다른 오류로 끝났습니다.`); }
  }
}

for (const [sourceItemId, variant] of publicItems) {
  const item = runtime.items.find(entry => entry.sourceItemId === sourceItemId);
  for (const difficulty of [-1, 0, 1]) {
    for (let set = 0; set < 1000; set += 1) {
      const seenCore = new Set(), seenVisual = new Set(), seenPrompt = new Set(); let made = 0;
      for (let attempt = 0; attempt < 48 && made < 3; attempt += 1) {
        const seed = 100000 + variant * 10000000 + (difficulty + 1) * 1000000 + set * 48 + attempt;
        try {
          const question = api.generate(item, 0, difficulty, seed, variant); generatedAttempts += 1;
          independentlyCheck(variant, difficulty, question);
          const payload = readEvidence(question).payload, promptFingerprint = visiblePrompt(question);
          if (seenCore.has(payload.coreFingerprint) || seenVisual.has(payload.visualFingerprint) || seenPrompt.has(promptFingerprint)) continue;
          seenCore.add(payload.coreFingerprint); seenVisual.add(payload.visualFingerprint); seenPrompt.add(promptFingerprint); made += 1; validatedQuestions += 1;
        } catch (error) { fail(`${sourceItemId} / 난이도 ${difficulty} / 세트 ${set}: ${error.message}`); break; }
      }
      if (made !== 3) fail(`${sourceItemId} / 난이도 ${difficulty} / 세트 ${set}: 보이는 조건·수·그림이 서로 다른 세 문항을 만들지 못했습니다.`);
    }
  }
}

const observedMinimums = {
  1: [6, 65, 6], 3: [19, 90, 104], 5: [31, 115, 92], 6: [66, 20, 19],
  7: [200, 200, 200], 8: [12, 100, 100], 9: [200, 200, 200], 10: [36, 131, 284]
};
for (const [variantText, minimums] of Object.entries(observedMinimums)) for (const difficulty of [-1, 0, 1]) {
  const count = observed.get(`${variantText}:${difficulty}`)?.size || 0;
  if (count < minimums[difficulty + 1]) fail(`유형 ${variantText} 난이도 ${difficulty}에서 서로 다른 핵심 후보가 ${count}개뿐입니다(최소 ${minimums[difficulty + 1]}개).`);
}

if (!/\.geometry-diagram \.source41-e4-segment\{fill:#174866/.test(styles) || !/\.geometry-diagram\.source41-e4-face \[data-feature="dot-eye"\]\{fill:#174866/.test(styles) || !/\.geometry-diagram\.source41-e4-stones \[data-stone="B"\]\{fill:#172f45/.test(styles)) fail("전용 SVG 색칠 규칙이 없습니다.");
if (validatedQuestions !== 72000) fail(`서로 다른 세 문항 감사 수가 정확히 72,000이 아닙니다: ${validatedQuestions}`);
if (lockedCalls !== 4500) fail(`잠금 직접 호출 감사 수가 정확히 4,500이 아닙니다: ${lockedCalls}`);
if (physicalOneChecks < 1000) fail(`숫자 1의 bc->ef 물리 회전 검사가 부족합니다: ${physicalOneChecks}`);
if (!sawOriginalTwoThirty) fail("예제 4-3의 원본 2시 30분 표본을 생성 감사에서 확인하지 못했습니다.");
if (failures.length) { console.error(`4-1 개념탐구 4 난수 감사 실패: ${failures.length}건`); console.error(failures.join("\n")); process.exit(1); }
console.log(`4-1 개념탐구 4 난수 감사 통과: 공개 8유형 · 잠금 3유형 · 서로 다른 문항 ${validatedQuestions.toLocaleString()}개 · 생성/독립 검산 ${generatedAttempts.toLocaleString()}회 · 잠금 직접 호출 ${lockedCalls.toLocaleString()}회 · 숫자 1 물리 회전 ${physicalOneChecks.toLocaleString()}회`);
