"use strict";

const fs = require("node:fs");
const path = require("node:path");

global.window = {};
require("./generators.js");
require("./source-inventory-4-1.js");

const inventory = require("./source-inventory/4-1-source-items.json");
const nativeMappings = require("./source-inventory/4-1-native-generators.json").mappings;
const api = window.HSE_GENERATORS;
const runtimeInventory = window.HSE_SOURCE_INVENTORY_41;
const generatorKey = "source41AngleSix";
const safeVariants = [0, 1, 2, 3, 5, 6, 7, 8, 9, 10];
const lockedVariants = [4];
const difficulties = [-1, 0, 1];
const seedsPerDifficulty = 500;
const failures = [];
let generatedCount = 0;

const sourceItems = [
  ["4-1-u2-e6-exploration", 0, false, "시곗바늘 위치와 각도 추론"],
  ["4-1-u2-e6-example-6-1", 1, false, "시각별 시곗바늘 그리기와 각도"],
  ["4-1-u2-e6-example-6-2", 2, false, "시각별 작은 각 계산"],
  ["4-1-u2-e6-example-6-3", 3, false, "바늘 위치와 각도로 시각 찾기"],
  ["4-1-u2-e6-example-6-4", 4, true, "시침 위치와 각도로 시각 찾기"],
  ["4-1-u2-e6-mission-1", 5, false, "주어진 시각의 바늘 각도"],
  ["4-1-u2-e6-mission-2", 6, false, "여러 시각의 작은 각"],
  ["4-1-u2-e6-mission-3", 7, false, "시간 간격의 시침 회전각"],
  ["4-1-u2-e6-mission-4", 8, false, "눈금 없는 시계의 시각 추론"],
  ["4-1-u2-e6-mission-5", 9, false, "분침 회전각으로 종료 시각"],
  ["4-1-u2-e6-mission-6", 10, false, "회전한 시계의 바늘 각도 추론"]
];

const sourceAnchors = {
  0: { times: [[2, null], [null, 30], [5, 50]], directedAngle: 125 },
  1: { times: [[4, 0], [2, 30], [6, 50], [10, 46]], angles: [120, 105, 95, 47] },
  2: { times: [[8, 0], [11, 30], [3, 10], [7, 52]], angles: [120, 165, 35, 76] },
  3: { minute: 40, hourRange: [1, 6], angle: 100, answer: [4, 40] },
  4: { minute: 30, angle: 135, conflictingAnswers: [[1, 30], [10, 30]], officialAnswer: [1, 30] },
  5: { times: [[3, 48], [6, 30]], angles: [174, 15] },
  6: { times: [[1, 24], [4, 40], [8, 32], [11, 50]], angles: [102, 100, 64, 55] },
  7: { start: [5, 40], end: [7, 20], hourHandTurn: 50 },
  8: { answer: [9, 8], directedAngle: 134 },
  9: { start: [4, 30], minuteHandTurn: 132, answer: [4, 52] },
  10: { answer: [5, 40], directedAngle: 70 }
};

function check(condition, message) {
  if (!condition) failures.push(message);
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function normalize(angle) {
  return ((angle % 360) + 360) % 360;
}

function timeData(hour, minute) {
  const normalizedHour = hour % 12;
  const hourAngle = normalizedHour * 30 + minute * 0.5;
  const minuteAngle = minute * 6;
  const directedAngle = normalize(minuteAngle - hourAngle);
  return {
    hour: normalizedHour,
    minute,
    hourAngle,
    minuteAngle,
    directedAngle,
    smallAngle: Math.min(directedAngle, 360 - directedAngle)
  };
}

function enumerate(predicate) {
  const matches = [];
  for (let hour = 0; hour < 12; hour += 1) {
    for (let minute = 0; minute < 60; minute += 1) {
      const data = timeData(hour, minute);
      if (predicate(data)) matches.push(data);
    }
  }
  return matches;
}

function formatTime(hour, minute) {
  return `${hour % 12 || 12}시 ${minute}분`;
}

function attribute(tag, name) {
  return String(tag).match(new RegExp(`\\b${name}="([^"]*)"`))?.[1];
}

function tags(html, tagName) {
  return String(html).match(new RegExp(`<${tagName}\\b[^>]*>`, "g")) || [];
}

function svgs(html) {
  return String(html).match(/<svg\b[\s\S]*?<\/svg>/g) || [];
}

function pointDistance(first, second) {
  return Math.hypot(first[0] - second[0], first[1] - second[1]);
}

function pointSegmentDistance(point, start, end) {
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  const lengthSquared = dx * dx + dy * dy;
  if (!lengthSquared) return pointDistance(point, start);
  const ratio = Math.max(0, Math.min(1, ((point[0] - start[0]) * dx + (point[1] - start[1]) * dy) / lengthSquared));
  return pointDistance(point, [start[0] + ratio * dx, start[1] + ratio * dy]);
}

function evidence(generated) {
  const marker = generated.prompt.match(/<span hidden\b[^>]*data-source41-kind="([^"]+)"[^>]*data-source41-payload="([^"]+)"[^>]*data-source41-expected="([^"]+)"[^>]*><\/span>/);
  assert(marker, "원문 근거 자료를 읽을 수 없습니다.");
  return {
    kind: marker[1],
    payload: JSON.parse(decodeURIComponent(marker[2])),
    expected: decodeURIComponent(marker[3])
  };
}

function visibleText(html) {
  return String(html)
    .replace(/<span hidden[\s\S]*?<\/span>/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function auditClockSvg(svg, variant) {
  const root = svg.match(/^<svg\b[^>]*>/)?.[0] || "";
  assert(root.includes("source41-clock"), `분기 ${variant}: 시계 전용 SVG가 아닙니다.`);
  assert(attribute(root, "viewBox") === "0 0 220 220", `분기 ${variant}: 시계 viewBox가 다릅니다.`);
  const rotation = Number(attribute(root, "data-clock-rotation"));
  const numerals = attribute(root, "data-numerals") === "true";
  const state = attribute(root, "data-clock-state");
  assert(Number.isFinite(rotation), `분기 ${variant}: 회전값이 없습니다.`);

  for (const line of tags(svg, "line")) {
    for (const name of ["x1", "y1", "x2", "y2"]) {
      const value = Number(attribute(line, name));
      assert(Number.isFinite(value) && value >= 0 && value <= 220, `분기 ${variant}: ${name}=${value}가 시계 밖입니다.`);
    }
  }
  for (const circle of tags(svg, "circle")) {
    const cx = Number(attribute(circle, "cx"));
    const cy = Number(attribute(circle, "cy"));
    const radius = Number(attribute(circle, "r"));
    assert([cx, cy, radius].every(Number.isFinite) && cx - radius >= 0 && cy - radius >= 0 && cx + radius <= 220 && cy + radius <= 220, `분기 ${variant}: 원이 시계 밖입니다.`);
  }
  for (const text of tags(svg, "text")) {
    const x = Number(attribute(text, "x"));
    const y = Number(attribute(text, "y"));
    assert(Number.isFinite(x) && Number.isFinite(y) && x >= 0 && x <= 220 && y >= 0 && y <= 220, `분기 ${variant}: 글자가 시계 밖입니다.`);
  }

  const hands = tags(svg, "line").filter(line => attribute(line, "data-hand"));
  for (const hand of hands) {
    const role = attribute(hand, "data-hand");
    const length = Number(attribute(hand, "data-hand-length"));
    const clockAngle = Number(attribute(hand, "data-clock-angle"));
    const start = [Number(attribute(hand, "x1")), Number(attribute(hand, "y1"))];
    const end = [Number(attribute(hand, "x2")), Number(attribute(hand, "y2"))];
    const radians = (90 - normalize(clockAngle + rotation)) * Math.PI / 180;
    const expectedEnd = [110 + length * Math.cos(radians), 110 - length * Math.sin(radians)];
    assert(role === "hour" ? length === 48 : length === 72, `분기 ${variant}: 시침·분침 길이가 뒤바뀌었습니다.`);
    assert(Math.abs(pointDistance(start, end) - length) < 0.15, `분기 ${variant}: ${role} 바늘 길이가 자료와 다릅니다.`);
    assert(pointDistance(end, expectedEnd) < 0.2, `분기 ${variant}: ${role} 바늘이 회전값과 다른 방향입니다.`);
  }

  if (!numerals) {
    assert(!svg.includes("source41-clock-number"), `분기 ${variant}: 숫자 없는 시계에 숫자가 표시됐습니다.`);
    assert(hands.length === 2, `분기 ${variant}: 숫자 없는 시계는 길이가 다른 두 바늘이 모두 보여야 합니다.`);
    const lengths = hands.map(hand => Number(attribute(hand, "data-hand-length"))).sort((a, b) => a - b);
    assert(JSON.stringify(lengths) === JSON.stringify([48, 72]), `분기 ${variant}: 숫자 없는 시계에서 시침과 분침을 구별할 수 없습니다.`);
  } else {
    assert(tags(svg, "text").filter(text => attribute(text, "data-clock-number")).length === 12, `분기 ${variant}: 숫자 있는 시계의 12개 숫자가 완전하지 않습니다.`);
  }

  if (state === "blank-drawing") assert(hands.length === 0, `분기 ${variant}: 학생이 바늘을 그릴 빈 시계에 답이 먼저 그려졌습니다.`);
  const angleLabel = svg.match(/<text\b[^>]*data-angle-label="[^"]+"[^>]*>[^<]*<\/text>/)?.[0];
  if (angleLabel) {
    const value = Number(attribute(angleLabel, "data-angle-label"));
    const shown = String(angleLabel).replace(/<[^>]+>/g, "");
    assert(shown === `${value}°`, `분기 ${variant}: 각도 글자의 앞 숫자가 빠졌습니다.`);
    const point = [Number(attribute(angleLabel, "x")), Number(attribute(angleLabel, "y"))];
    for (const hand of hands) {
      const start = [Number(attribute(hand, "x1")), Number(attribute(hand, "y1"))];
      const end = [Number(attribute(hand, "x2")), Number(attribute(hand, "y2"))];
      assert(pointSegmentDistance(point, start, end) >= 9, `분기 ${variant}: ${shown} 글자가 바늘과 겹칩니다.`);
    }
  }
}

function independentAnswer(variant, payload) {
  if (variant === 0) {
    const matches = enumerate(data => data.directedAngle === payload.targetDirectedAngle);
    assert(matches.length === 1, "개념탐구 숫자 없는 시계의 시각이 하나가 아닙니다.");
    const target = matches[0];
    return `(1) 알 수 없음; (2) 분침의 위치; (3) ${payload.shownMinute}분이지만 몇 시인지는 알 수 없음; (4) 시침의 위치; (5) ${formatTime(target.hour, target.minute)}`;
  }
  if ([1, 2, 5, 6].includes(variant)) return payload.times.map(([hour, minute]) => `${timeData(hour, minute).smallAngle}°`).join(", ");
  if (variant === 3) {
    const matches = enumerate(data => data.minute === payload.minute && (data.hour || 12) >= payload.rangeStart && (data.hour || 12) < payload.rangeEnd && data.smallAngle === payload.smallAngle);
    assert(matches.length === 1, "시침 범위와 각도로 찾는 시각이 하나가 아닙니다.");
    return formatTime(matches[0].hour, matches[0].minute);
  }
  if (variant === 7) {
    const start = payload.start[0] * 60 + payload.start[1];
    const end = payload.end[0] * 60 + payload.end[1];
    assert(end - start === payload.duration, "시침 이동 문제의 시작과 끝 시간이 다릅니다.");
    return `${payload.duration / 2}°`;
  }
  if (variant === 8 || variant === 10) {
    const matches = enumerate(data => data.directedAngle === payload.directedAngle);
    assert(matches.length === 1, "회전한 숫자 없는 시계의 시각이 하나가 아닙니다.");
    return formatTime(matches[0].hour, matches[0].minute);
  }
  const start = payload.start[0] * 60 + payload.start[1];
  const elapsed = payload.minuteHandTurn / 6;
  assert(elapsed === payload.elapsed && elapsed < 60, "분침 이동각이 한 바퀴 미만의 시간과 맞지 않습니다.");
  const end = (start + elapsed) % 720;
  return formatTime(Math.floor(end / 60), end % 60);
}

check(api.names.includes(generatorKey), "시침과 분침 전용 생성기가 등록되지 않았습니다.");
const groupItems = inventory.items.filter(item => item.unit === 2 && item.exploration === 6);
check(groupItems.length === 11, `각도 개념탐구 6 원문 항목은 11개여야 하나 ${groupItems.length}개입니다.`);

for (const [sourceItemId, variant, locked, label] of sourceItems) {
  const item = groupItems.find(entry => entry.sourceItemId === sourceItemId);
  const runtimeItem = runtimeInventory.items.find(entry => entry.sourceItemId === sourceItemId);
  const mapping = nativeMappings.find(entry => entry.sourceItemId === sourceItemId);
  check(Boolean(item), `${sourceItemId}: 원문 목록에 없습니다.`);
  check(item?.typeLabel === label, `${sourceItemId}: 쉬운 한글 유형명이 달라졌습니다.`);
  check(item?.sourcePdfPage === (sourceItemId.includes("mission") ? 33 : 32), `${sourceItemId}: PDF 쪽수가 다릅니다.`);
  check(item?.sourcePrintedPage === (sourceItemId.includes("mission") ? 29 : 28), `${sourceItemId}: 교재 쪽수가 다릅니다.`);
  if (locked) {
    check(!mapping, `${sourceItemId}: 답이 둘인 문항이 공개 매핑에 들어갔습니다.`);
    check(runtimeItem?.reviewLocked && !runtimeItem?.generatorKey, `${sourceItemId}: 모순 문항이 잠기지 않았습니다.`);
  } else {
    check(mapping?.generatorKey === generatorKey && mapping?.variant === variant, `${sourceItemId}: 전용 생성기 분기가 연결되지 않았습니다.`);
    check(runtimeItem?.reviewLocked === false && runtimeItem?.generatorKey === generatorKey, `${sourceItemId}: 브라우저에서 공개되지 않았습니다.`);
  }
}

check(nativeMappings.filter(mapping => mapping.generatorKey === generatorKey).length === 10, "시침과 분침 전용 공개 매핑은 10개여야 합니다.");
check(runtimeInventory.verifiedMappings === 138, `4-1 공개 유형은 138개여야 하나 ${runtimeInventory.verifiedMappings}개입니다.`);

try {
  api.generate({ generatorKey, variant: 4 }, 0, 0, 1, 4);
  failures.push("예제 6-4가 생성되어서는 안 됩니다.");
} catch (error) {
  check(/1시 30분과 10시 30분|공식답과 충돌/.test(error.message), "예제 6-4 잠금 사유가 정확하지 않습니다.");
}

const sourceSmallCandidates = enumerate(data => data.smallAngle === 135 && data.minute === 30).map(data => formatTime(data.hour, data.minute));
check(JSON.stringify(sourceSmallCandidates) === JSON.stringify(["1시 30분", "10시 30분"]), "135°와 분침 6 조건의 전체 후보 검사가 달라졌습니다.");
const nightCandidates = sourceSmallCandidates.filter(value => value.startsWith("10시"));
check(JSON.stringify(nightCandidates) === JSON.stringify(["10시 30분"]), "밤 조건으로 남는 10시 30분을 확인하지 못했습니다.");

const sourceDirectionalChecks = [[125, "5시 50분"], [134, "9시 8분"], [70, "5시 40분"]];
for (const [angle, expected] of sourceDirectionalChecks) {
  const matches = enumerate(data => data.directedAngle === angle);
  check(matches.length === 1 && formatTime(matches[0].hour, matches[0].minute) === expected, `${angle}° 방향각의 원문 시각은 ${expected} 하나여야 합니다.`);
}
const sourceTenDegree = enumerate(data => data.smallAngle === 10).map(data => formatTime(data.hour, data.minute));
check(sourceTenDegree.includes("4시 20분") && sourceTenDegree.includes("7시 40분") && !sourceTenDegree.includes("5시 40분"), "Mission 6의 70°를 10°로 잘못 읽는 회귀를 잡지 못했습니다.");

const signatures = new Map();
const complexity = new Map();
for (const variant of safeVariants) {
  for (const difficulty of difficulties) {
    const key = `${variant}:${difficulty}`;
    signatures.set(key, new Set());
    complexity.set(key, []);
    for (let seed = 1; seed <= seedsPerDifficulty; seed += 1) {
      try {
        const generated = api.generate({ generatorKey, variant }, 0, difficulty, seed, variant);
        generatedCount += 1;
        const proof = evidence(generated);
        assert(proof.expected === generated.answer, `분기 ${variant}: 숨은 기대답과 실제 답이 다릅니다.`);
        assert(JSON.stringify(proof.payload.sourceAnchor) === JSON.stringify(sourceAnchors[variant]), `분기 ${variant}: 원문 기준값이 바뀌었습니다.`);
        assert(independentAnswer(variant, proof.payload) === generated.answer, `분기 ${variant}: 독립 계산값과 답이 다릅니다.`);
        const visible = visibleText(`${generated.prompt} ${generated.solution}`);
        assert(!/undefined|null|NaN|Infinity/.test(`${visible} ${generated.answer}`), `분기 ${variant}: 잘못된 값이 보입니다.`);
        assert(!/순열|조합|모듈러|mod\b|라디안/.test(visible), `분기 ${variant}: 초등 과정 밖 표현이 보입니다.`);
        assert(!/\b0시\b/.test(visible), `분기 ${variant}: 12시가 0시로 표시됐습니다.`);
        const expected = independentAnswer(variant, proof.payload);
        signatures.get(key).add(JSON.stringify([proof.kind, proof.payload, expected]));
        complexity.get(key).push(Number(proof.payload.complexity));
        for (const svg of svgs(generated.prompt)) auditClockSvg(svg, variant);
        if ([8, 10].includes(variant)) {
          const clock = svgs(generated.prompt)[0];
          assert(clock && attribute(clock.match(/^<svg\b[^>]*>/)?.[0], "data-numerals") === "false", `분기 ${variant}: 숫자 없는 시계가 아닙니다.`);
          assert(!/data-clock-number=/.test(clock), `분기 ${variant}: 12의 위치를 짐작할 숫자가 남았습니다.`);
        }
        if (variant === 0) assert((generated.prompt.match(/<li>/g) || []).length === 5, "개념탐구 본문의 다섯 물음이 모두 남아 있지 않습니다.");
      } catch (error) {
        failures.push(`분기 ${variant} / 난이도 ${difficulty} / 시드 ${seed}: ${error.message}`);
        break;
      }
    }
  }
}

for (const variant of safeVariants) {
  for (const difficulty of difficulties) check(signatures.get(`${variant}:${difficulty}`).size >= 20, `분기 ${variant} / 난이도 ${difficulty}: 문제 변화가 너무 적습니다.`);
  const low = complexity.get(`${variant}:-1`).reduce((sum, value) => sum + value, 0) / seedsPerDifficulty;
  const high = complexity.get(`${variant}:1`).reduce((sum, value) => sum + value, 0) / seedsPerDifficulty;
  check(high > low, `분기 ${variant}: 상 난이도의 조건 복잡도가 하보다 높지 않습니다.`);
}

const styles = fs.readFileSync(path.join(__dirname, "styles.css"), "utf8");
check(styles.includes(".source41-clock .hour-hand{stroke:#d18b08;stroke-width:5"), "시침의 굵기 스타일이 없습니다.");
check(styles.includes(".source41-clock .minute-hand{stroke:#1d6fb8;stroke-width:3.2"), "분침의 굵기 스타일이 없습니다.");
check(styles.includes('font-family:Pretendard,"Malgun Gothic",Arial,sans-serif'), "시계 숫자와 각도 글자의 공통 글꼴이 없습니다.");

if (failures.length) {
  console.error(`4-1 각도 개념탐구 6 전용 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 50).join("\n"));
  process.exit(1);
}

console.log(`4-1 각도 개념탐구 6 전용 감사 통과: 원문 11항목 · 공개 10 · 검수 대기 1 · ${generatedCount.toLocaleString()}회 독립 계산 · 720시각 방향 전수 검사 · 시침/분침 길이·회전·글자 가시성 확인`);
