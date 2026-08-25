"use strict";

global.window = {};
require("./curriculum.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const unit = window.HSE_CURRICULUM.semesters.find(item => item.id === "6-1").units.find(item => item.id === "6-1-u2");
const types = unit.subunits.flatMap(subunit => subunit.types);
const attr = (prompt, name) => {
  const match = prompt.match(new RegExp(`data-${name}="([^"]*)"`));
  if (!match) throw new Error(`data-${name} 없음`);
  return match[1];
};
const values = prompt => attr(prompt, "values").split(",").map(Number);

function expected(generated) {
  const kind = attr(generated.prompt, "angular-solid-kind");
  const v = values(generated.prompt);
  if (kind === "prism-relation") return (v[1] - 2) / 2;
  if (kind === "prism-lateral-area") return 2 * v[0] * v[1] + v[0] * v[2];
  if (kind === "prism-net-perimeter") return 2 * Math.abs(v[3] - v[4]);
  if (kind === "prism-parallel-cut") return 2 * ((v[0] + 2) + 3 * v[0] + 2 * v[0]);
  if (kind === "prism-face-areas") return 2 * v.slice(2).reduce((sum, area) => sum + area / v[1], 0) + v[0] * v[1];
  if (kind === "prism-net-dimensions") return 2 * v[3] + v[0] * v[2];
  if (kind === "prism-45-rise") return v[1] * v[2];
  if (kind === "prism-radial-split") return 9 * v[0];
  if (kind === "prism-crossed-faces") return v[1];
  if (kind === "prism-shortest-route") return Math.sqrt(v[1] ** 2 + v[2] ** 2);
  if (kind === "prism-truncated") return 6 * v[0] + 9 * v[0] + 3 * v[0] + 2;
  if (kind === "prism-unfolded-triangle") return v[1] * v[2] * v[3] / 2;
  if (kind === "prism-pyramid-face-sum") {
    const sides = (v[1] - 3) / 2;
    return (3 * sides) * (2 * sides);
  }
  if (kind === "pyramid-net-perimeter") return 2 * Math.abs(v[3] - v[4]);
  if (kind === "equal-edge-sums") return 2 * (v[2] - v[1]);
  if (kind === "two-solid-totals") return (6 * v[0] + 2) + (4 * v[1] + 2);
  if (kind === "pyramid-edge-points") return v[0] + 1 + 2 * v[0] * (v[1] - 1);
  if (kind === "solid-edge-length-difference") return Math.abs((2 * v[0] * v[1] + v[0] * v[2]) - 2 * v[0] * v[3]);
  if (kind === "glued-prism-pyramid") return (2 * v[0] + 1) + 4 * v[0] + (2 * v[0] + 1);
  if (kind === "tetra-midpoint-route") return v[0];
  if (kind === "pyramid-shortest-route" || kind === "tetra-all-face-route") return Math.sqrt(v[1] ** 2 + v[2] ** 2);
  if (kind === "glued-two-pyramids") return (v[0] + 2) + 3 * v[0] + 2 * v[0];
  if (kind === "square-pyramid-net-area") return v[0] * v[1];
  throw new Error(`알 수 없는 유형 ${kind}`);
}

const failures = [];
let count = 0;
for (const type of types) for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 500; seed += 1) {
  try {
    const generated = api.generate(type, 0, difficulty, seed, type.variant);
    if (!generated) throw new Error("생성 결과 없음");
    const answer = expected(generated);
    if (!Number.isFinite(Number(answer))) throw new Error("독립 검산 결과가 유한수가 아님");
    if (String(generated.answer) !== String(answer)) throw new Error(`정답 ${generated.answer}, 독립 검산 ${answer}`);
    if (/NaN|Infinity|undefined/.test(`${generated.prompt}${generated.answer}${generated.solution}`)) throw new Error("표시할 수 없는 값");
    if (!generated.solution.includes(String(generated.answer))) throw new Error("풀이에 정답 근거가 없음");
    if (/shortest-route|all-face-route/.test(attr(generated.prompt, "angular-solid-kind"))) {
      const v = values(generated.prompt);
      if (v[1] ** 2 + v[2] ** 2 !== Number(generated.answer) ** 2) throw new Error("최단거리 치수와 답 불일치");
    }
    count += 1;
  } catch (error) {
    failures.push(`${type.id} / 난이도 ${difficulty} / 시드 ${seed}: ${error.message}`);
  }
}

if (failures.length) {
  console.error(`각기둥과 각뿔 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 80).join("\n"));
  process.exit(1);
}
console.log(`각기둥과 각뿔 감사 통과: ${types.length}유형, ${count}개 생성`);
