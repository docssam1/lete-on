"use strict";

// Regression checks for 4-2 unit 6 drawings and answers.
global.window = {};
require("./generators.js");

const api = window.HSE_GENERATORS;
const types = [
  { id: "4-2-u6-t1", name: "정다각형과 대각선" },
  { id: "4-2-u6-t2", name: "정다각형의 활용" },
  { id: "4-2-u6-t3", name: "평면 덮기" },
  { id: "4-2-u6-t4", name: "도형 나누기와 만들기" }
].map(type => ({ ...type, semesterId: "4-2", unitId: "4-2-u6", unitName: "다각형" }));

const attribute = (tag, name) => tag.match(new RegExp("\\b" + name + "=\"([^\"]*)\""))?.[1];
const check = (condition, message) => {
  if (!condition) throw new Error(message);
};
const normalize = cells => {
  const minX = Math.min(...cells.map(cell => cell[0]));
  const minY = Math.min(...cells.map(cell => cell[1]));
  return cells.map(cell => [cell[0] - minX, cell[1] - minY]).sort((a, b) => a[0] - b[0] || a[1] - b[1]);
};
const key = cells => normalize(cells).map(cell => cell.join(",")).join(";");
const rotations = cells => {
  const result = new Map();
  let current = cells;
  for (let index = 0; index < 4; index += 1) {
    current = normalize(current);
    result.set(key(current), current);
    current = current.map(cell => [cell[1], -cell[0]]);
  }
  return [...result.values()];
};
const placements = (rows, cols, cells) => rotations(cells).reduce((total, shape) => {
  const width = Math.max(...shape.map(cell => cell[0])) + 1;
  const height = Math.max(...shape.map(cell => cell[1])) + 1;
  return total + Math.max(0, cols - width + 1) * Math.max(0, rows - height + 1);
}, 0);

let generatedCount = 0;
for (const type of types) {
  for (const difficulty of [-1, 0, 1]) {
    for (let seed = 1; seed <= 350; seed += 1) {
      const generated = api.generate(type, 0, difficulty, seed, seed % 9);
      const context = type.id + " / 난이도 " + difficulty + " / 시드 " + seed;
      check(generated && generated.answer && generated.solution, context + ": 결과가 비어 있습니다.");
      check(!/NaN|undefined/.test(generated.prompt + generated.answer + generated.solution), context + ": 계산값이 깨졌습니다.");

      if (type.id === "4-2-u6-t1") {
        const svg = generated.prompt.match(/<svg class="geometry-diagram polygon-diagonal"[^>]*>/)?.[0];
        check(Boolean(svg), context + ": 대각선 도형이 없습니다.");
        const sides = Number(attribute(svg, "data-polygon-sides"));
        const mode = attribute(svg, "data-diagonal-mode");
        if (mode === "fan") check(Number(generated.answer) === sides - 3, context + ": 한 꼭짓점 대각선 수가 틀렸습니다.");
        else if (generated.prompt.includes("대각선이 ")) check(Number(generated.answer) * (Number(generated.answer) - 3) / 2 === sides * (sides - 3) / 2, context + ": 대각선 수와 꼭짓점 수가 맞지 않습니다.");
        else {
          const values = [...generated.prompt.matchAll(/정(\d+)각형/g)].map(match => Number(match[1]));
          check(values.length >= 2 && Number(generated.answer) === Math.abs(values[0] * (values[0] - 3) / 2 - values[1] * (values[1] - 3) / 2), context + ": 두 다각형의 대각선 차가 틀렸습니다.");
        }
      }

      if (type.id === "4-2-u6-t2") {
        const meet = generated.prompt.match(/<svg class="geometry-diagram regular-meet"[^>]*>/)?.[0];
        if (meet) {
          const angles = (attribute(meet, "data-angles") || "").split(",").map(Number);
          check(angles.reduce((sum, value) => sum + value, 0) === 360 && angles.includes(Number(generated.answer)), context + ": 한 점 둘레 각이 맞지 않습니다.");
        } else if (generated.prompt.includes("한 내각의 크기")) {
          const interior = Number(generated.prompt.match(/한 내각의 크기가 (\d+)°/)?.[1]);
          check(Number(generated.answer) === 180 - interior, context + ": 내각과 외각 계산이 틀렸습니다.");
        } else {
          const sideLength = Number(generated.prompt.match(/한 변의 길이가 (\d+)cm/)?.[1]);
          const sides = Number(generated.prompt.match(/정(\d+)각형/)?.[1]);
          check(Number(generated.answer) === sideLength * sides, context + ": 정다각형 둘레가 틀렸습니다.");
        }
      }

      if (type.id === "4-2-u6-t3") {
        const svg = generated.prompt.match(/<svg class="geometry-diagram tile-board"[^>]*>/)?.[0];
        check(Boolean(svg), context + ": 타일 그림이 없습니다.");
        const rows = Number(attribute(svg, "data-tile-rows"));
        const cols = Number(attribute(svg, "data-tile-cols"));
        const highlight = attribute(svg, "data-tile-highlight");
        const expected = highlight === "checker" ? Math.ceil(rows * cols / 2) : rows * cols;
        check(Number(generated.answer) === expected, context + ": 타일 수가 그림의 행·열과 맞지 않습니다.");
      }

      if (type.id === "4-2-u6-t4") {
        const svg = generated.prompt.match(/<svg class="geometry-diagram piece-placement"[^>]*>/)?.[0];
        check(Boolean(svg), context + ": 조각 그림이 없습니다.");
        const rows = Number(attribute(svg, "data-piece-rows"));
        const cols = Number(attribute(svg, "data-piece-cols"));
        const cells = (attribute(svg, "data-piece-cells") || "").split(";").filter(Boolean).map(value => value.split(",").map(Number));
        check(cells.length > 0 && Number(generated.answer) === placements(rows, cols, cells), context + ": 조각 배치 수가 틀렸습니다.");
      }
      generatedCount += 1;
    }
  }
}

console.log("다각형 감사 통과: 4유형, " + generatedCount + "개 생성");
