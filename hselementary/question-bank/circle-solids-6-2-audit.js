"use strict";

global.window = {};
require("./curriculum.js");
require("./generators.js");

const api = window.HSE_GENERATORS;
const semester = window.HSE_CURRICULUM.semesters.find(item => item.id === "6-2");
const wanted = new Set(["6-2-u4-t4", "6-2-u5-t3", "6-2-u5-t4", "6-2-u5-t5", "6-2-u5-t6", "6-2-u6-t1", "6-2-u6-t2", "6-2-u6-t3"]);
const types = semester.units.flatMap(unit => unit.subunits.flatMap(subunit => subunit.types)).filter(type => wanted.has(type.id));
const decimal = (value, places = 2) => {
  const scale = 10 ** places;
  return (Math.round((value + Number.EPSILON) * scale) / scale).toString();
};
const evidence = prompt => {
  const kind = prompt.match(/data-circle-solid-kind="([^"]+)"/)?.[1];
  const values = prompt.match(/data-values="([^"]*)"/)?.[1]?.split(",").map(Number);
  if (!kind || !values) throw new Error("검수 근거 없음");
  return { kind, values };
};

function expected(generated) {
  const { kind, values: v } = evidence(generated.prompt);
  if (kind === "continued-ratio") return `${v[4]}:${v[5]}:${v[6]}`;
  if (kind === "square-minus-circle") return decimal(v[0] ** 2 - v[2] * v[1] ** 2);
  if (kind === "annulus") return decimal(v[2] * (v[0] ** 2 - v[1] ** 2));
  if (kind === "rectangle-minus-circles") return decimal((v[1] * 2 * v[0]) * (2 * v[0]) - v[1] * v[2] * v[0] ** 2);
  if (kind === "quarter-segment") return decimal(v[2] * v[0] ** 2 * v[1] / 360 - v[0] ** 2 / 2);
  if (kind === "annular-sector") return decimal(v[3] * (v[0] ** 2 - v[1] ** 2) * v[2] / 360);
  if (kind === "circle-outside-difference") {
    const circle = v[1] * v[2] * v[0] ** 2;
    const outside = (v[1] * 2 * v[0]) * (2 * v[0]) - circle;
    return decimal(circle - outside);
  }
  if (kind === "rolling-rectangle") return decimal(2 * (v[0] + v[1]) + 2 * v[3] * v[2]);
  if (kind === "pivot-arc") return decimal(2 * v[2] * v[0] * v[1] / 360);
  if (kind === "corner-tether") return decimal(v[3] * v[2] ** 2 * 3 / 4);
  if (kind === "equal-points-angle") return decimal(360 * v[1] / v[0]);
  if (kind === "inscribed-central") return String(v[0] * 2);
  if (kind === "regular-central") return String(360 / v[0]);
  if (kind === "cylinder-lateral") return decimal(2 * v[2] * v[0] * v[1]);
  if (kind === "roller-area") return decimal(2 * v[3] * v[0] * v[1] * v[2]);
  if (kind === "cylinder-helix") return String(Math.hypot(v[0], v[1]));
  if (kind === "cone-net-angle") return String(360 * v[0] / v[1]);
  if (kind === "cone-frame") return decimal(v[1] * v[2] + 2 * v[3] * v[0]);
  if (kind === "cone-roll") return String(v[1] / v[0]);
  if (kind === "rotate-rectangle" || kind === "rotate-triangle") return String(2 * v[0] + v[1]);
  if (kind === "rotate-stepped") return decimal(v[3] * v[0] ** 2);
  throw new Error(`알 수 없는 유형 ${kind}`);
}

const failures = [];
let count = 0;
const seen = new Map(types.map(type => [type.id, new Set()]));
for (const type of types) for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 500; seed += 1) {
  try {
    const generated = api.generate(type, 0, difficulty, seed);
    if (!generated) throw new Error("생성 결과 없음");
    const audit = evidence(generated.prompt);
    const answer = expected(generated);
    if (generated.answer !== answer) throw new Error(`정답 ${generated.answer}, 독립 검산 ${answer}`);
    if (/NaN|Infinity|undefined/.test(`${generated.prompt}${generated.answer}${generated.solution}`)) throw new Error("표시할 수 없는 값");
    if (!generated.solution.includes(generated.answer)) throw new Error("풀이에 정답 근거가 없음");
    if (audit.kind !== "continued-ratio" && !/aria-label=/.test(generated.prompt)) throw new Error("그림의 읽기 설명 없음");
    seen.get(type.id).add(audit.kind);
    count += 1;
  } catch (error) {
    failures.push(`${type.id} / 난이도 ${difficulty} / 시드 ${seed}: ${error.message}`);
  }
}

for (const type of types) if (seen.get(type.id).size < (type.id === "6-2-u4-t4" ? 1 : 3)) failures.push(`${type.id}: 문제 구조 다양성 부족`);
if (types.length !== wanted.size) failures.push(`대상 유형 ${wanted.size}개 중 ${types.length}개만 찾음`);

if (failures.length) {
  console.error(`6-2 원·비례·회전체 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 100).join("\n"));
  process.exit(1);
}
console.log(`6-2 원·비례·회전체 감사 통과: ${types.length}유형, ${count}개 생성`);
