"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const dir = __dirname;
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(dir, "generators.js"), "utf8"), context, { filename: "generators.js" });
vm.runInContext(fs.readFileSync(path.join(dir, "source-grade6-volume-e4.js"), "utf8"), context, { filename: "source-grade6-volume-e4.js" });
const inventoryContext = { window: {} };
vm.createContext(inventoryContext);
vm.runInContext(fs.readFileSync(path.join(dir, "source-inventory-grade6.js"), "utf8"), inventoryContext, { filename: "source-inventory-grade6.js" });
const inventory = inventoryContext.window.HSE_SOURCE_INVENTORY_GRADE6.items.filter(item => item.generatorKey === "sourceGrade6VolumeE4");
const normalize = value => String(value).replace(/,/g, "").replace(/\s+/g, "");
const fraction = (n, d) => {
  const gcd = (a, b) => b ? gcd(b, a % b) : Math.abs(a);
  const divisor = gcd(n, d);
  return d / divisor === 1 ? String(n / divisor) : `${n / divisor}/${d / divisor}`;
};
const mixed = (n, d) => {
  const reduced = fraction(n, d);
  if (!reduced.includes("/")) return reduced;
  const [numerator, denominator] = reduced.split("/").map(Number);
  const whole = Math.floor(numerator / denominator);
  const remainder = numerator % denominator;
  return whole ? `${whole} ${remainder}/${denominator}` : reduced;
};
const pools = {
  tilt: [
    { depth: 8, width: 20, height: 26, segment: 6, restored: 16, sealed: [160, 13] },
    { depth: 10, width: 18, height: 30, segment: 12, restored: 21, sealed: [63, 5] },
    { depth: 12, width: 24, height: 34, segment: 10, restored: 22, sealed: [264, 17] }
  ],
  overflow: [
    { width: 20, depth: 40, height: 50, water: 45, overflow: 2500 },
    { width: 24, depth: 30, height: 48, water: 44, overflow: 2400 },
    { width: 25, depth: 32, height: 45, water: 40, overflow: 3200 }
  ],
  equal: [[16, 6, 8], [12, 8, 6], [15, 10, 6]],
  rod: [[40, 20, 15, 8, [375, 23]], [36, 24, 12, 6, [288, 23]], [30, 25, 10, 5, [300, 29]]],
  flow: [[1600, 400, 30, 3000, 1400, 12, 42], [2000, 400, 28, 4000, 1600, 10, 40], [1200, 300, 24, 2400, 1200, 8, 32]],
  units: [[2000000, 56440, 700, 80000, 1864260], [3000000, 145850, 300, 51000, 2803450], [1000000, 95000, 900, 4000, 901900]],
  thick: [[38, 18, 24, 4, 6000], [34, 23, 22, 2, 11400], [44, 28, 23, 3, 16720]],
  spill: [[45, 20, 30, 600], [30, 24, 18, 2592], [30, 20, 16, 1280]],
  stone: [[16, 16, 10, 1280, 15], [18, 18, 8, 1296, 12], [20, 20, 9, 1200, 12]],
  displacement: [[16, 15, 12, 8, 6, 15], [18, 16, 11, 6, 4, 12], [24, 18, 9, 9, 12, 12]],
  partition: [[6750, 15, 25, 9, [45, 4]], [7500, 15, 25, 12, [15, 1]], [7000, 12, 28, 10, [14, 1]]]
};
const expected = (variant, p) => {
  if (variant === 0) return `${p.tilt.segment}cm`;
  if (variant === 1) return `${p.tilt.restored}cm`;
  if (variant === 2) return `${mixed(p.tilt.sealed[0], p.tilt.sealed[1])}cm`;
  if (variant === 3) return `${p.overflow.width * p.overflow.depth * (p.overflow.height - p.overflow.water) + p.overflow.overflow}cm³`;
  if (variant === 4) return `${mixed(p.equal[0] * p.equal[1] * p.equal[2] * 3, p.equal[0] * p.equal[1] + p.equal[0] * p.equal[2] + p.equal[1] * p.equal[2])}cm`;
  if (variant === 5) return `${mixed(p.rod[0] * p.rod[1] * p.rod[2], p.rod[0] * p.rod[1] - p.rod[3] * p.rod[3])}cm`;
  if (variant === 6) return `${p.flow[6]}cm`;
  if (variant === 7) return `${p.units[4]}mL`;
  if (variant === 8) return `${p.thick[4]}cm³ = ${(p.thick[4] / 1000).toLocaleString("ko-KR", { maximumFractionDigits: 2 })}L`;
  if (variant === 9) return `${p.spill[3]}mL`;
  if (variant === 10) return `${p.stone[4]}cm`;
  if (variant === 11) return `${p.displacement[5]}cm`;
  const numerator = p.partition[4][0];
  const denominator = p.partition[4][1];
  return `${mixed(numerator, denominator)}cm`;
};
const sourcePool = (variant, index) => {
  if (variant <= 2) return { tilt: pools.tilt[index] };
  if (variant === 3) return { overflow: pools.overflow[index] };
  if (variant === 4) return { equal: pools.equal[index] };
  if (variant === 5) return { rod: pools.rod[index] };
  if (variant === 6) return { flow: pools.flow[index] };
  if (variant === 7) return { units: pools.units[index] };
  if (variant === 8) return { thick: pools.thick[index] };
  if (variant === 9) return { spill: pools.spill[index] };
  if (variant === 10) return { stone: pools.stone[index] };
  if (variant === 11) return { displacement: pools.displacement[index] };
  return { partition: pools.partition[index] };
};
for (const item of inventory) {
  check(item.reviewLocked === false, `${item.sourceItemId}: 공개 잠금 상태입니다.`);
  check(item.verifiedVariantCount === 3, `${item.sourceItemId}: 고정 문항 수가 3이 아닙니다.`);
  for (let difficulty of [-1, 0, 1]) {
    const seen = new Set();
    for (let seed = 1; seed <= 300; seed += 1) {
      const question = context.window.HSE_GENERATORS.generate(item, 1, difficulty, seed, item.variant);
      if (question.verifiedPoolIndex === undefined || seen.has(question.verifiedPoolIndex)) continue;
      const index = question.verifiedPoolIndex;
      const data = sourcePool(item.variant, index);
      const answer = expected(item.variant, data);
      const exposed = [question.prompt, question.answer, question.solution, question.answerVisual].join("\n");
      const visibleMarkup = [question.prompt, question.solution, question.answerVisual].join("\n");
      check(normalize(question.answer) === normalize(answer), `${item.sourceItemId} pool${index} diff${difficulty}: 답 ${question.answer} != 독립 계산 ${answer}`);
      check(question.sourceItemId === item.sourceItemId, `${item.sourceItemId} pool${index}: 다른 원문 유형 ${question.sourceItemId}이 섞였습니다.`);
      check(!/(?:cm|m)\^[23]/.test(exposed), `${item.sourceItemId} pool${index}: 사용자 노출 문자열에 caret 단위가 남았습니다.`);
      check(!/\d+\s*\/\s*\d+/.test(visibleMarkup), `${item.sourceItemId} pool${index}: 문제·풀이·답 그림에 한 줄 slash 분수가 남았습니다.`);
      const problemTag = question.prompt.match(/<svg[^>]*data-phase="problem"[^>]*>/)?.[0] || "";
      const answerTag = question.answerVisual.match(/<svg[^>]*data-phase="answer"[^>]*>/)?.[0] || "";
      const attribute = (tag, name) => tag.match(new RegExp(`${name}="([^"]*)"`))?.[1] || "";
      const problemModel = attribute(problemTag, "data-model-key");
      const answerModel = attribute(answerTag, "data-model-key");
      const problemValues = attribute(problemTag, "data-source61-volume-e4-values");
      const answerValues = attribute(answerTag, "data-source61-volume-e4-values");
      check(problemModel && problemModel === answerModel, `${item.sourceItemId} pool${index}: 문제·답 모델이 다릅니다.`);
      check(problemValues && problemValues === answerValues, `${item.sourceItemId} pool${index}: 문제·답 좌표 자료가 다릅니다.`);
      [[question.prompt, problemTag, "문제"], [question.answerVisual, answerTag, "답"]].forEach(([markup, tag, phase]) => {
        const required = attribute(tag, "data-required-elements").split(",").filter(Boolean);
        check(required.length > 0, `${item.sourceItemId} pool${index}: ${phase} 필수 시각 요소 목록이 없습니다.`);
        required.forEach(role => check(markup.includes(`data-visual-element="${role}"`), `${item.sourceItemId} pool${index}: ${phase} 그림에 ${role} 요소가 없습니다.`));
      });
      if ([2, 4, 5, 12].includes(item.variant) && question.answer.includes("/")) {
        check(question.solution.includes("math-fraction"), `${item.sourceItemId} pool${index}: 풀이 분수가 공통 math-fraction 구조가 아닙니다.`);
        if (/\d+\s+\d+\/\d+/.test(question.answer)) check(question.solution.includes("math-mixed-number"), `${item.sourceItemId} pool${index}: 풀이 대분수가 공통 math-mixed-number 구조가 아닙니다.`);
        check(question.answerVisual.includes("svg-measure-fraction") && question.answerVisual.includes("fraction-bar"), `${item.sourceItemId} pool${index}: 답 그림 분수가 SVG 세로 분수 구조가 아닙니다.`);
      }
      check(question.answerVisual.includes(`data-answer-source="${item.sourceItemId}"`), `${item.sourceItemId} pool${index}: 답 출처 연결이 없습니다.`);
      seen.add(index);
    }
    check(seen.size === 3, `${item.sourceItemId} diff${difficulty}: 3개 검증 풀을 모두 만들지 못했습니다 (${[...seen].join(",")}).`);
  }
}
check(inventory.length === 13, `E4 공개 유형 수가 13이 아닙니다: ${inventory.length}`);
if (failures.length) {
  console.error(`6-1 부피 활용 E4 수학 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 80).join("\n"));
  process.exit(1);
}
console.log(`6-1 부피 활용 E4 수학 감사 통과: 13유형 × 3풀 × 3난이도 = ${13 * 3 * 3}개 독립 계산·모델 연결 확인`);
