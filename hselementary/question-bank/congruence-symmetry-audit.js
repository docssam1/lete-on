"use strict";

global.window = {};
require("./curriculum.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const semester = window.HSE_CURRICULUM.semesters.find(item => item.id === "5-2");
const unit = semester.units.find(item => item.id === "5-2-u3");
const types = unit.subunits.flatMap(subunit => subunit.types.map(type => ({
  ...type,
  semesterId: semester.id,
  unitId: unit.id,
  unitName: unit.name,
  subunitName: subunit.name
})));

const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
const lcm = (a, b) => Math.abs(a * b) / gcd(a, b);
const attribute = (prompt, name) => {
  const match = prompt.match(new RegExp(`data-${name}="([^"]*)"`));
  if (!match) throw new Error(`검산 속성 data-${name}이 없습니다.`);
  return match[1];
};
const numbers = value => value.split(",").map(Number);
const combinations = (values, count) => {
  const output = [];
  const visit = (start, chosen) => {
    if (chosen.length === count) return output.push(chosen);
    for (let index = start; index < values.length; index += 1) visit(index + 1, [...chosen, values[index]]);
  };
  visit(0, []);
  return output;
};
const centerLineCount = (width, height) => {
  const directions = new Set();
  const add = (dx, dy) => {
    if (!dx && !dy) return;
    const divisor = gcd(dx, dy);
    dx /= divisor;
    dy /= divisor;
    if (dx < 0 || (dx === 0 && dy < 0)) { dx *= -1; dy *= -1; }
    directions.add(`${dx},${dy}`);
  };
  for (let x = 0; x <= width; x += 1) { add(x - width / 2, -height / 2); add(x - width / 2, height / 2); }
  for (let y = 1; y < height; y += 1) { add(-width / 2, y - height / 2); add(width / 2, y - height / 2); }
  return directions.size;
};

function expectedAnswer(generated) {
  const kind = attribute(generated.prompt, "congruence-kind");
  const values = numbers(attribute(generated.prompt, "values"));
  if (kind === "required-condition") return "3";
  if (kind === "side-combinations" || kind === "stick-triangles") {
    return String(combinations(values, 3).filter(([a, b, c]) => a + b > c).length);
  }
  if (kind === "angle-pairs") {
    let count = 0;
    for (let i = 0; i < values.length; i += 1) for (let j = i; j < values.length; j += 1) if (values[i] + values[j] < 180) count += 1;
    return String(count);
  }
  if (kind === "missing-side") {
    const [first, second, limit] = values;
    return String(Array.from({ length: limit }, (_, index) => index + 1).filter(value => value !== first && value !== second && Math.abs(second - first) < value && value < first + second).length);
  }
  if (kind === "regular-parts") return String(Array.from({ length: values[0] - 1 }, (_, index) => index + 2).filter(value => values[0] % value === 0).length);
  if (kind === "folded-angle" || kind === "line-rays") return String(values[0] * 2);
  if (kind === "isosceles-angle") return String((180 - values[0]) / 2);
  if (kind === "square-overlap") return String((values[0] - values[1]) * (values[0] - values[2]));
  if (kind === "congruent-area") return String(values[1] * values[2]);
  if (kind === "equilateral-trapezoid") return String(values[0] * 5);
  if (kind === "fan-height") return String(values[2] * 2 / (values[0] * values[1]));
  if (kind === "line-point") {
    const axis = attribute(generated.prompt, "axis");
    const [x, y] = values;
    if (axis === "vertical") return `${8 - x}, ${y}`;
    if (axis === "horizontal") return `${x}, ${8 - y}`;
    return `${y}, ${x}`;
  }
  if (kind === "axis-count") return String(values[0]);
  if (kind === "palindrome-rank") {
    const rank = values[0];
    return String((Math.floor((rank - 1) / 10) + 1) * 101 + ((rank - 1) % 10) * 10);
  }
  if (kind === "folded-paper-area") return String(values[0] * values[1] - values[3] * 2 ** values[2]);
  if (kind === "mirror-bounces") {
    const travel = lcm(values[0], values[1]);
    return String(travel / values[0] + travel / values[1] - 2);
  }
  if (kind === "point-coordinate") return `${2 * values[2] - values[0]}, ${2 * values[3] - values[1]}`;
  if (kind === "rotated-codes") return String(attribute(generated.prompt, "symbols").split(",").filter(symbol => symbol !== "0").length);
  if (kind === "point-overlap") return String((values[0] - 2 * values[2]) * (values[1] - 2 * values[3]));
  if (kind === "rotation-time") return String(180 / values[0] * 60);
  if (kind === "point-trapezoids") return String(values[2] / (values[0] + values[1]));
  if (kind === "center-lines") return String(centerLineCount(values[0], values[1]));
  throw new Error(`알 수 없는 검산 유형 ${kind}입니다.`);
}

const visualKinds = new Set(["side-combinations", "missing-side", "regular-parts", "folded-angle", "isosceles-angle", "square-overlap", "congruent-area", "equilateral-trapezoid", "fan-height", "line-point", "line-rays", "axis-count", "mirror-bounces", "point-coordinate", "point-overlap", "rotation-time", "point-trapezoids", "center-lines"]);
const failures = [];
let generatedCount = 0;
for (const type of types) {
  for (const difficulty of [-1, 0, 1]) {
    for (let seed = 1; seed <= 350; seed += 1) {
      try {
        const generated = api.generate(type, 0, difficulty, seed, type.variant ?? 0);
        if (!generated?.prompt || generated.answer === undefined || !generated.solution) throw new Error("문제·정답·풀이 중 빠진 값이 있습니다.");
        if (generated.generator !== type.generatorKey) throw new Error(`생성기 연결이 ${generated.generator}입니다.`);
        if (/NaN|Infinity|undefined/.test(`${generated.prompt}${generated.answer}${generated.solution}`)) throw new Error("표시할 수 없는 값이 생성되었습니다.");
        const kind = attribute(generated.prompt, "congruence-kind");
        const expected = expectedAnswer(generated);
        if (String(generated.answer) !== expected) throw new Error(`정답 ${generated.answer}, 독립 검산 ${expected}`);
        if (visualKinds.has(kind) && !generated.prompt.includes("<svg")) throw new Error("그림이 필요한 문제에 SVG가 없습니다.");
        if (generated.prompt.includes("<svg") && !/aria-label="[^"]+"/.test(generated.prompt)) throw new Error("그림의 설명이 없습니다.");
        generatedCount += 1;
      } catch (error) {
        failures.push(`${type.id} / 난이도 ${difficulty} / 시드 ${seed}: ${error.message}`);
      }
    }
  }
}

if (failures.length) {
  console.error(`합동과 대칭 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 40).join("\n"));
  process.exit(1);
}

console.log(`합동과 대칭 감사 통과: ${types.length}유형, ${generatedCount}개 생성`);
