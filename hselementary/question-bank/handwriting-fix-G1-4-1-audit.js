"use strict";

// 4-1 손글씨 대조 수정 묶음 G1(2026-11-28) 감사.
// 고친 유형마다 세 난이도 × 여러 시드에서 새 조건·새 답을 문제 글과 그림에서 다시 읽어 독립 계산한다.

global.window = {};
require("./generators.js");

const api = window.HSE_GENERATORS;
const failures = [];
const seeds = Array.from({ length: 40 }, (_, index) => index + 1);
const difficulties = [-1, 0, 1];
const weekdays = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
let checked = 0;

const check = (condition, message) => { if (!condition) failures.push(message); };
const visible = html => String(html).replace(/<span hidden[^>]*><\/span>/g, "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
const payloadOf = prompt => JSON.parse(decodeURIComponent(prompt.match(/data-source41-payload="([^"]*)"/)[1]));
const points = text => text.trim().split(/\s+/).map(pair => pair.split(",").map(Number));
const angleAt = (vertex, first, second) => {
  const a = Math.atan2(first[1] - vertex[1], first[0] - vertex[0]);
  const b = Math.atan2(second[1] - vertex[1], second[0] - vertex[0]);
  let difference = Math.abs(a - b) * 180 / Math.PI;
  if (difference > 180) difference = 360 - difference;
  return difference;
};
const segmentsCross = (p1, p2, p3, p4) => {
  const o = (p, q, r) => (q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]);
  return o(p3, p4, p1) * o(p3, p4, p2) < 0 && o(p1, p2, p3) * o(p1, p2, p4) < 0;
};
const lineIntersection = ([p1, p2], [p3, p4]) => {
  const d = (p1[0] - p2[0]) * (p3[1] - p4[1]) - (p1[1] - p2[1]) * (p3[0] - p4[0]);
  const a = p1[0] * p2[1] - p1[1] * p2[0];
  const b = p3[0] * p4[1] - p3[1] * p4[0];
  return [(a * (p3[0] - p4[0]) - (p1[0] - p2[0]) * b) / d, (a * (p3[1] - p4[1]) - (p1[1] - p2[1]) * b) / d];
};
const each = (generatorKey, variant, callback) => {
  for (const difficulty of difficulties) for (const seed of seeds) {
    const context = `${generatorKey}#${variant} 난이도 ${difficulty} 시드 ${seed}`;
    try {
      const generated = api.generate({ id: `${generatorKey}-${variant}`, generatorKey, variant }, 0, difficulty, seed, variant);
      callback(generated, context, difficulty);
      checked += 1;
    } catch (error) {
      failures.push(`${context}: ${error.message}`);
    }
  }
};

// 원문 기준값(심화 p.23 Mission 5·6, p.66~68, 확인학습 39).
check(720 - (110 + 136 + 124 + 95 + 130) - (22 + 55) === 48, "Mission 5 원문 답은 48°여야 합니다.");
check(720 - 2 * (180 - 40) === 440, "Mission 6 원문 구조(40°)의 답은 440°여야 합니다.");
check((10205 - (20 + 15) * (22 * 23 / 2)) / 45 === 30, "확인학습 39 원문 답은 30원이어야 합니다.");
check((9 + 10) * (11 + 12) === 437, "예제 4-3 원문 답은 437이어야 합니다.");

// 4-1-u2-t3-10: 그림의 실제 각도가 문제의 각도·답과 같고, 두 선분이 실제로 엇갈린다.
each("source41AngleThree", 9, (generated, context) => {
  const payload = payloadOf(generated.prompt);
  const known = payload.knownAngles;
  const polygon = points(generated.prompt.match(/<svg class="geometry-diagram source41-two-turn-octagon"[\s\S]*?<polygon points="([^"]+)"/)[1]);
  check(polygon.length === 8, `${context}: 도형 꼭짓점이 8개가 아닙니다.`);
  const [top, upperRight, lowerRight, firstTip, secondTip, lowerLeft, left, upperLeft] = polygon;
  const measured = [
    angleAt(top, upperLeft, upperRight), angleAt(upperLeft, left, top), angleAt(left, lowerLeft, upperLeft),
    angleAt(lowerLeft, secondTip, left), angleAt(upperRight, top, lowerRight), angleAt(firstTip, lowerRight, secondTip),
    angleAt(secondTip, firstTip, lowerLeft)
  ];
  measured.forEach((value, index) => check(Math.abs(value - known[index]) < 1, `${context}: ${index}번 각이 그림에서 ${value.toFixed(1)}°로 ${known[index]}°와 다릅니다.`));
  const target = angleAt(lowerRight, upperRight, firstTip);
  const answer = 720 - known.reduce((sum, value) => sum + value, 0);
  check(Math.abs(target - answer) < 1, `${context}: ㉠이 그림에서 ${target.toFixed(1)}°로 답 ${answer}°와 다릅니다.`);
  check(String(generated.answer) === String(answer), `${context}: 답 ${generated.answer}이 독립 계산 ${answer}과 다릅니다.`);
  check(segmentsCross(lowerRight, firstTip, secondTip, lowerLeft), `${context}: 두 선분이 엇갈리지 않습니다.`);
  check((generated.prompt.match(/data-known-index=/g) || []).length === 7 && (generated.prompt.match(/class="source41-angle-arc"/g) || []).length === 8, `${context}: 각 호 표시가 8개가 아닙니다.`);
  check(!/그림은 각의 위치를 나타냅니다/.test(generated.prompt), `${context}: 옛 문장이 남았습니다.`);
});

// 4-1-u2-t3-11: 그림의 네 직선·네 삼각형에서 실제 여덟 각의 합을 재어 답(360+2×주어진 각)과 맞춘다.
each("source41AngleThree", 10, (generated, context) => {
  const given = payloadOf(generated.prompt).givenAngle;
  const triangles = [...generated.prompt.matchAll(/<polygon data-triangle="\d" points="([^"]+)"/g)].map(match => points(match[1]));
  const lines = [...generated.prompt.matchAll(/<line data-straight-line="\d" x1="([^"]+)" y1="([^"]+)" x2="([^"]+)" y2="([^"]+)"/g)].map(match => [[+match[1], +match[2]], [+match[3], +match[4]]]);
  check(triangles.length === 4 && lines.length === 4, `${context}: 삼각형 4개·직선 4개가 아닙니다.`);
  const outerSum = triangles.reduce((sum, [tip, first, second]) => sum + angleAt(first, tip, second) + angleAt(second, first, tip), 0);
  const answer = 720 - 2 * (180 - given);
  check(Math.abs(outerSum - answer) < 2, `${context}: 그림의 여덟 각 합 ${outerSum.toFixed(1)}°가 답 ${answer}°와 다릅니다.`);
  const center = lineIntersection(lines[0], lines[1]);
  const crossAngle = angleAt(center, lines[0][0], lines[1][0]);
  check(Math.abs(Math.min(crossAngle, 180 - crossAngle) - given) < 1, `${context}: 두 직선 사이 각이 ${crossAngle.toFixed(1)}°로 ${given}°와 다릅니다.`);
  triangles.forEach((triangle, index) => check(lines.some(line => Math.abs((line[1][0] - line[0][0]) * (triangle[0][1] - line[0][1]) - (line[1][1] - line[0][1]) * (triangle[0][0] - line[0][0])) / Math.hypot(line[1][0] - line[0][0], line[1][1] - line[0][1]) < 0.6), `${context}: ${index + 1}번 삼각형 꼭짓점이 직선 위에 없습니다.`));
  check(String(generated.answer) === String(answer), `${context}: 답 ${generated.answer}이 ${answer}과 다릅니다.`);
});

// 4-1-u6-t3-4: 요일·합으로 2월 1일 요일을 완전 탐색해 하나로 정해지는지 본다.
each("source41ArraySumThree", 3, (generated, context) => {
  const text = visible(generated.prompt);
  const match = text.match(/2월 달력에서 (\S+요일)인 날짜를 모두 더했더니 (\d+)이었습니다\. 같은 해 3월 (\d+)일은 무슨 요일인가요\?/);
  check(Boolean(match), `${context}: 요일 조건 문장이 없습니다.`);
  if (!match) return;
  const [, weekday, sumText, marchText] = match;
  const candidates = [];
  for (let first = 0; first < 7; first += 1) {
    const dates = Array.from({ length: 28 }, (_, index) => index + 1).filter(date => weekdays[(first + date - 1) % 7] === weekday);
    if (dates.reduce((sum, date) => sum + date, 0) === Number(sumText)) candidates.push(weekdays[(first + 28 + Number(marchText) - 1) % 7]);
  }
  check(new Set(candidates).size === 1, `${context}: 답이 하나로 정해지지 않습니다(${candidates.join(",")}).`);
  check(candidates[0] === generated.answer, `${context}: 답 ${generated.answer}이 완전 탐색 ${candidates[0]}과 다릅니다.`);
});

// 4-1-u6-t3-9: 날 수·요일·개수·합으로 1일의 요일을 완전 탐색한다.
each("source41ArraySumThree", 8, (generated, context) => {
  const text = visible(generated.prompt);
  const match = text.match(/(\d+)일까지 있는 달의 달력에서 (\S+요일)인 날짜들을 모두 색칠했더니 색칠한 날짜는 (\d+)개이고 합이 (\d+)이었습니다\./);
  check(Boolean(match), `${context}: 요일 조건 문장이 없습니다.`);
  if (!match) return;
  const [, daysText, weekday, countText, sumText] = match;
  const candidates = [];
  for (let first = 0; first < 7; first += 1) {
    const dates = Array.from({ length: Number(daysText) }, (_, index) => index + 1).filter(date => weekdays[(first + date - 1) % 7] === weekday);
    if (dates.length === Number(countText) && dates.reduce((sum, date) => sum + date, 0) === Number(sumText)) candidates.push(weekdays[(first + Number(daysText) - 1) % 7]);
  }
  check(new Set(candidates).size === 1, `${context}: 답이 하나로 정해지지 않습니다(${candidates.join(",")}).`);
  check(candidates[0] === generated.answer, `${context}: 답 ${generated.answer}이 완전 탐색 ${candidates[0]}과 다릅니다.`);
});

// 4-1-u6-t3-11: 가운데 가격을 1원부터 완전 탐색해 자연수 답이 하나인지 본다.
each("source41ArraySumThree", 10, (generated, context) => {
  const text = visible(generated.prompt);
  const match = text.match(/물건 (\d+)개를 한 줄로 늘어놓았습니다\. 가격은 가운데 있는 물건이 가장 싸고, 가운데에서 왼쪽 끝으로 갈수록 (\d+)원씩 비싸지고 오른쪽 끝으로 갈수록 (\d+)원씩 비싸집니다\. 물건 전체의 가격이 (\d+)원일 때/);
  check(Boolean(match), `${context}: 원문 조건(가운데가 가장 쌈, 왼쪽·오른쪽 증가 폭) 문장이 없습니다.`);
  if (!match) return;
  const [count, left, right, total] = match.slice(1).map(Number);
  const half = (count - 1) / 2;
  const found = [];
  for (let middle = 1; middle <= total; middle += 1) {
    let sum = middle;
    for (let step = 1; step <= half; step += 1) sum += (middle + left * step) + (middle + right * step);
    if (sum === total) found.push(middle);
  }
  check(found.length === 1 && left !== right, `${context}: 가운데 가격이 하나로 정해지지 않습니다(${found.join(",")}).`);
  check(`${found[0]}원` === generated.answer, `${context}: 답 ${generated.answer}이 완전 탐색 ${found[0]}원과 다릅니다.`);
});

// 4-1-u6-t4-4: 묻는 네 수가 보기(1~8)와 겹치지 않고 답이 보기 결과와 다르다.
each("source41OperationRuleFour", 3, (generated, context) => {
  const boards = [...generated.prompt.matchAll(/<div class="source-corner-board"><span>(\d+)<\/span><span>(\d+)<\/span><strong>([^<]+)<\/strong><span>(\d+)<\/span><span>(\d+)<\/span><\/div>/g)];
  check(boards.length === 3, `${context}: 네 꼭짓점 그림이 3개가 아닙니다.`);
  if (boards.length !== 3) return;
  const values = [1, 2, 4, 5].map(index => Number(boards[2][index]));
  check(values.every(value => value >= 9), `${context}: 묻는 수 ${values.join(",")}가 보기 수와 겹칩니다.`);
  check(values.every((value, index) => !index || value === values[0] + index), `${context}: 묻는 네 수가 원문처럼 이어지지 않습니다.`);
  const answer = (values[0] + values[1]) * (values[2] + values[3]);
  check(String(generated.answer) === String(answer) && ![21, 165].includes(answer), `${context}: 답 ${generated.answer}이 ${answer}과 다르거나 보기 결과와 같습니다.`);
});

// 4-1-u2-t1-3: 직각 표시 없는 반직선 쌍은 모두 직각과 15° 넘게 떨어진다.
each("source41AngleOne", 2, (generated, context) => {
  const { angles } = payloadOf(generated.prompt);
  for (let first = 0; first < angles.length; first += 1) for (let second = first + 1; second < angles.length; second += 1) {
    const difference = angles[second] - angles[first];
    const marked = (angles[first] === 0 && angles[second] === 90) || (angles[first] === 90 && angles[second] === 180);
    check(marked || Math.abs(difference - 90) > 15, `${context}: ${angles[first]}°·${angles[second]}° 사이가 ${difference}°로 직각과 헷갈립니다.`);
  }
  let obtuse = 0;
  for (let first = 0; first < angles.length; first += 1) for (let second = first + 1; second < angles.length; second += 1) if (angles[second] - angles[first] > 90 && angles[second] - angles[first] < 180) obtuse += 1;
  check(String(generated.answer) === String(obtuse), `${context}: 둔각 수 ${generated.answer}이 ${obtuse}와 다릅니다.`);
});

// 4-1-u4-t3-8: 정답 글에 문제에 없는 기호가 없다.
each("source41PlaneTransformThree", 7, (generated, context) => {
  check(!/[A-F]/.test(generated.answer) && !/[A-F]-[A-F]/.test(visible(generated.solution)), `${context}: 정답·풀이에 문제에 없는 기호가 있습니다.`);
  check(/6, 7, 8번째 칸에 2, 3, 4번째 칸과 같은 모양/.test(generated.answer), `${context}: 칸 번호로 쓴 정답이 아닙니다.`);
});

// 4-1-u5-t2, 4-1-u5-t2-6: 시간·거리 답에 단위가 붙는다.
each("source41BarGraphTwo", 0, (generated, context) => check(/^\d+분$/.test(String(generated.answer)), `${context}: 시간 답에 단위가 없습니다(${generated.answer}).`));
each("source41BarGraphTwo", 2, (generated, context, difficulty) => check(difficulty === -1 ? /^\d+m$/.test(String(generated.answer)) : /^\d+분$/.test(String(generated.answer)), `${context}: 답에 단위가 없습니다(${generated.answer}).`));

// 4-1-u1-t1: 명사 뒤 조사 오류가 없다.
each("source41LargeNumberOne", 0, (generated, context) => {
  const text = visible(generated.prompt);
  check(!/글자이|\(이\)라고/.test(text) && /이라고 부르기로/.test(text), `${context}: 조사 오류가 남았습니다.`);
});

// 4-1-u1-t3-4: 원문처럼 "아래의 뛰어 세기와 같은 방법"이고, 보기 줄에 처음 수가 섞이지 않으며 답이 맞다.
each("source41LargeNumberThree", 3, (generated, context) => {
  const payload = payloadOf(generated.prompt);
  const start = BigInt(payload.wrongFinal) + BigInt(payload.jumpCount) * BigInt(payload.wrongStep);
  check(String(start) === payload.start, `${context}: 처음 수 계산이 다릅니다.`);
  check(!payload.demonstration.includes(payload.start), `${context}: 보기 줄에 처음 수가 섞였습니다.`);
  check(/아래의 뛰어 세기와 같은 방법으로/.test(visible(generated.prompt)), `${context}: 원문 문장이 아닙니다.`);
  const correct = start - BigInt(payload.jumpCount) * BigInt(payload.correctStep);
  check(BigInt(payload.demonstration[0]) - BigInt(payload.demonstration[1]) === BigInt(payload.correctStep) && correct > 0n, `${context}: 보기 뛰어 세기 간격이 다릅니다.`);
});

if (failures.length) {
  console.error(`손글씨 대조 수정 G1(4-1) 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 60).join("\n"));
  process.exit(1);
}
console.log(`손글씨 대조 수정 G1(4-1) 감사 통과: 12유형 · ${checked.toLocaleString()}개 생성 · 그림 실측 각도·요일/가격 완전 탐색·단위·기호 확인`);
