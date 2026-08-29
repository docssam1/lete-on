"use strict";

global.window = {};
require("./curriculum.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const semester = window.HSE_CURRICULUM.semesters.find(item => item.id === "4-2");
const unit = semester.units.find(item => item.id === "4-2-u4");
const targetSubunits = unit.subunits;
const failures = [];
let generatedCount = 0;

const sourceRobotAnswer = (3 + 3) * 20 + 90 / 10 * 2;
if (sourceRobotAnswer !== 138) failures.push(`Mission 6 원문 고정값은 138초여야 하나 ${sourceRobotAnswer}초입니다.`);
const sourceTrapezoidAnswer = (39 - 13) / 2;
if (sourceTrapezoidAnswer !== 13) failures.push(`예제 1-2 원문 고정값은 13cm여야 하나 ${sourceTrapezoidAnswer}cm입니다.`);
const sourceGrowingAnswer = Math.abs(2 - 4 + 6);
if (sourceGrowingAnswer !== 4) failures.push(`Mission 3 원문 고정값은 4cm여야 하나 ${sourceGrowingAnswer}cm입니다.`);

const attr = (html, name) => html.match(new RegExp(`${name}="([^"]+)"`))?.[1] || "";
const chooseTwo = value => value * (value - 1) / 2;

for (const subunit of targetSubunits) {
  for (const type of subunit.types) {
    if (type.reviewLocked) {
      if (type.sourceVerified) failures.push(`${type.id}: 검수 대기 유형이 원본 검증 완료로 표시됩니다.`);
      continue;
    }
    if (!type.sourceVerified || !type.sourceEvidence.includes(type.label)) {
      failures.push(`${type.id}: 유형별 원본 근거가 없습니다.`);
    }
    for (const difficulty of [-1, 0, 1]) {
      for (let seed = 1; seed <= 200; seed += 1) {
        let generated;
        try {
          generated = api.generate(type, 0, difficulty, seed, type.variant);
          generatedCount += 1;
        } catch (error) {
          failures.push(`${type.id} / 난이도 ${difficulty} / 시드 ${seed}: ${error.message}`);
          break;
        }
        const combined = `${generated.prompt} ${generated.answer} ${generated.solution}`;
        if (!generated.prompt || generated.answer === "" || !generated.solution || /undefined|null|NaN|Infinity/.test(combined)) {
          failures.push(`${type.id} / 난이도 ${difficulty} / 시드 ${seed}: 문제·정답·풀이가 깨졌습니다.`);
          break;
        }

        let expected;
        if (type.generatorKey === "quadPerpParallelDistance") {
          if (type.variant === 0 || type.variant === 1) {
            const counts = attr(generated.prompt, "data-line-families").split(",").map(Number);
            expected = type.variant === 0
              ? counts[0] * counts[1]
              : counts.reduce((sum, value) => sum + chooseTwo(value), 0);
          } else if (type.variant === 2) {
            const parts = attr(generated.prompt, "data-distance-parts").split(",").map(Number);
            const total = Number(attr(generated.prompt, "data-distance-total"));
            const [from, to] = attr(generated.prompt, "data-distance-target").split(",").map(Number);
            expected = total / parts.reduce((sum, value) => sum + value, 0) * parts.slice(from, to).reduce((sum, value) => sum + value, 0);
          } else if (type.variant === 5) {
            const [firstDistance, secondDistance, moveSeconds, turnUnit, turnSeconds, turnAngle] = attr(generated.prompt, "data-robot-path").split(",").map(Number);
            expected = (firstDistance + secondDistance) * moveSeconds + turnAngle / turnUnit * turnSeconds;
            if (turnAngle !== 90 || 90 % turnUnit !== 0) failures.push(`${type.id} / 시드 ${seed}: 회전 조건이 90°를 정확히 나누지 못합니다.`);
          } else if (type.variant === 6) {
            const [top, bottom, leftAngle, rightAngle, height] = attr(generated.prompt, "data-trapezoid-distance").split(",").map(Number);
            expected = (bottom - top) / 2;
            if (leftAngle !== 45 || rightAngle !== 45 || height !== expected) failures.push(`${type.id} / 시드 ${seed}: 45도 사다리꼴의 길이 자료가 맞지 않습니다.`);
          } else if (type.variant === 7) {
            const [startLength, increment, drawCount, storedAnswer] = attr(generated.prompt, "data-growing-turn").split(",").map(Number);
            let horizontalPosition = 0;
            for (let step = 1; step <= drawCount; step += 2) horizontalPosition += (step % 4 === 1 ? 1 : -1) * (startLength + step * increment);
            expected = Math.abs(horizontalPosition);
            if (drawCount % 2 !== 0 || storedAnswer !== expected) failures.push(`${type.id} / 시드 ${seed}: 마지막 선분이 처음 선분과 평행하지 않거나 저장 답이 다릅니다.`);
          } else {
            const values = attr(generated.prompt, "data-staircase-verticals").split(",").map(Number);
            const hidden = Number(attr(generated.prompt, "data-staircase-hidden"));
            expected = type.variant === 4 ? values[hidden] : values.reduce((sum, value) => sum + value, 0);
          }
        } else if (type.generatorKey === "quadParallelAngleCondition") {
          if (type.variant === 0 || type.variant === 1) {
            const count = Number(attr(generated.prompt, "data-parallel-count"));
            const angle = Number(attr(generated.prompt, "data-parallel-angle"));
            expected = (count - 1) * angle;
          } else {
            const target = Number(attr(generated.prompt, "data-target-angle"));
            const candidateAngles = [...generated.prompt.matchAll(/data-candidate="([^"]+)" data-angle="([^"]+)"/g)].map(match => Number(match[2]));
            expected = candidateAngles.slice(1).filter(value => value === target).length;
          }
        } else if (type.generatorKey === "quadAngleChainOne" || (type.generatorKey === "quadAngleChainTwo" && type.variant === 0)) {
          const directions = attr(generated.prompt, "data-chain-directions").split(",").map(Number);
          expected = Math.abs(directions[directions.length - 1]);
          const interiors = attr(generated.prompt, "data-chain-interiors").split(",").map(Number);
          const lineGap = Number(attr(generated.prompt, "data-chain-line-gap"));
          if (lineGap < 18) failures.push(`${type.id} / 시드 ${seed}: 두 평행선의 화면 간격이 ${lineGap}px로 너무 좁습니다.`);
          directions.slice(0, -1).forEach((direction, index) => {
            const geometricInterior = 180 - Math.abs(direction - directions[index + 1]);
            if (interiors[index] !== geometricInterior) failures.push(`${type.id} / 시드 ${seed}: SVG 방향과 표시 각이 다릅니다.`);
          });
        } else if (type.generatorKey === "quadAngleChainTwo") {
          const angle = Number(attr(generated.prompt, "data-laser-angle"));
          expected = 180 - 2 * angle;
        } else if (type.generatorKey === "quadPropertyRelations") {
          if (type.variant === 0) {
            const key = `${attr(generated.prompt, "data-lattice-columns")}x${attr(generated.prompt, "data-lattice-rows")}`;
            expected = ({ "3x2": 9, "3x3": 70, "4x3": 276 })[key];
          } else {
            expected = Number(attr(generated.prompt, "data-parallelogram-angle")) / 2;
          }
        } else if (type.generatorKey === "quadPropertyApplication") {
          const sides = attr(generated.prompt, "data-shape-sides").split(",").map(Number);
          const side = Number(generated.prompt.match(/한 변의 길이가 (\d+)cm/)?.[1]);
          expected = (sides.reduce((sum, value) => sum + value, 0) - 2 * (sides.length - 1)) * side;
        } else if (type.generatorKey === "quadSquareSpecial") {
          if (type.variant === 0) {
            const side = Number(attr(generated.prompt, "data-paper-side"));
            const count = Number(attr(generated.prompt, "data-paper-count"));
            expected = generated.prompt.includes("사용한 색종이") ? count : 2 * (side + (count - 1) * side / 2 + side);
          } else if (type.variant === 1) {
            expected = 90 - Number(attr(generated.prompt, "data-fold-half"));
          } else {
            const [a, b, c] = attr(generated.prompt, "data-square-sides").split(",").map(Number);
            expected = generated.prompt.includes("나와 다의 한 변") ? b : c;
          }
        } else if (type.generatorKey === "quadRectangleCount") {
          if (type.variant <= 2) {
            const [m, n] = attr(generated.prompt, "data-grid-size").split(",").map(Number);
            const rectangleCount = m * (m + 1) / 2 * n * (n + 1) / 2;
            if (type.variant === 0) expected = rectangleCount;
            if (type.variant === 1) {
              const [r, c] = attr(generated.prompt, "data-grid-mark").split(",").map(Number);
              expected = r * (m - r + 1) * c * (n - c + 1);
            }
            if (type.variant === 2) {
              let squares = 0;
              for (let size = 1; size <= Math.min(m, n); size += 1) squares += (m - size + 1) * (n - size + 1);
              expected = `${rectangleCount}, ${squares}`;
            }
          } else {
            const widths = attr(generated.prompt, "data-staircase-widths").split(",").map(Number);
            expected = 0;
            for (let top = 0; top < widths.length; top += 1) {
              for (let bottom = top; bottom < widths.length; bottom += 1) {
                const commonWidth = Math.min(...widths.slice(top, bottom + 1));
                expected += commonWidth * (commonWidth + 1) / 2;
              }
            }
          }
        }

        if (String(generated.answer) !== String(expected)) {
          failures.push(`${type.id} / 난이도 ${difficulty} / 시드 ${seed}: 정답 ${generated.answer}, 독립 계산 ${expected}`);
          break;
        }
      }
    }
  }
}

if (targetSubunits[0].types.length !== 8) failures.push(`수선과 평행선: ${targetSubunits[0].types.length}유형`);
if (targetSubunits[1].types.length !== 3) failures.push(`평행선의 조건과 성질: ${targetSubunits[1].types.length}유형`);
if (targetSubunits[2].types.length !== 3) failures.push(`평행선 사이의 각도 ①: ${targetSubunits[2].types.length}유형`);
if (targetSubunits[3].types.length !== 2) failures.push(`평행선 사이의 각도 ②: ${targetSubunits[3].types.length}유형`);
const readyCounts = [7, 3, 3, 2, 2, 1, 3, 4];
targetSubunits.forEach((subunit, index) => {
  const ready = subunit.types.filter(type => !type.reviewLocked).length;
  if (ready !== readyCounts[index]) failures.push(`${subunit.name}: 공개 ${ready}유형, 예상 ${readyCounts[index]}유형`);
});

if (failures.length) {
  console.error(`4-2 사각형 유형 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 40).join("\n"));
  process.exit(1);
}

console.log(`4-2 사각형 개념탐구 1~8 · 공개 23개 세부 유형 · ${generatedCount.toLocaleString()}회 독립 검산 통과`);
