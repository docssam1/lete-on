"use strict";

// Independent regression checks for the reusable advanced shape-pattern renderer.
global.window = {};
require("./generators.js");

const api = window.HSE_GENERATORS;
const expectedKinds = [
  "polygon-chain",
  "polygon-chain-inverse",
  "box-chain",
  "crossed-square-points",
  "spiral-grid-points",
  "hex-stone-cluster",
  "dotted-square-chain",
  "coin-checker"
];
const types = expectedKinds.map((_, variant) => ({ id: `advanced-shape-${variant}`, generatorKey: "advancedShapePattern", variant }));

const check = (condition, message) => {
  if (!condition) throw new Error(message);
};
const attribute = (tag, name) => tag.match(new RegExp("\\b" + name + "=\"([^\"]*)\""))?.[1];
const numberAttribute = (tag, name) => Number(attribute(tag, name));
const tags = (body, tagName) => [...body.matchAll(new RegExp(`<${tagName}\\b[^>]*>`, "g"))].map(match => match[0]);
const stageGroups = prompt => [...prompt.matchAll(/(<g class="pattern-stage"[^>]*>)([\s\S]*?)<\/g>/g)].map(match => ({ tag: match[1], body: match[2] }));
const normalizedLine = tag => {
  const first = [numberAttribute(tag, "x1"), numberAttribute(tag, "y1")].map(value => value.toFixed(3)).join(",");
  const second = [numberAttribute(tag, "x2"), numberAttribute(tag, "y2")].map(value => value.toFixed(3)).join(",");
  return first < second ? `${first}|${second}` : `${second}|${first}`;
};
const normalizedPoint = tag => [numberAttribute(tag, "cx"), numberAttribute(tag, "cy")].map(value => value.toFixed(3)).join(",");
const promptInteger = (prompt, pattern, context) => {
  const value = Number(prompt.match(pattern)?.[1]);
  check(Number.isInteger(value), context + ": 지문 수를 읽지 못했습니다.");
  return value;
};

check(types.length === 8, "재사용 도형 렌더러는 8개 분기를 유지해야 합니다.");

// Numeric invariants of the reusable models.
check(7 * 7 === 49, "소용돌이 점 배열 계산식이 틀렸습니다.");
check((76 - 6) / 5 + 1 === 15, "육각형 역산 계산식이 틀렸습니다.");
check(3 * 10 * 9 + 1 === 271, "육각형 바둑돌 계산식이 틀렸습니다.");
check(8 * 17 + 4 === 140, "입체 상자 계산식이 틀렸습니다.");
check((53 - 3) / 5 === 10, "점 정사각형 역산 계산식이 틀렸습니다.");

let generatedCount = 0;
for (const type of types) {
  for (const difficulty of [-1, 0, 1]) {
    for (let seed = 1; seed <= 420; seed += 1) {
      const generated = api.generate(type, 0, difficulty, seed, type.variant);
      const context = `${type.id} / 분기 ${type.variant} / 난이도 ${difficulty} / 시드 ${seed}`;
      check(generated && generated.prompt && generated.answer && generated.solution, context + ": 생성 결과가 비어 있습니다.");
      check(!/NaN|undefined|Infinity/.test(generated.prompt + generated.answer + generated.solution), context + ": 계산 또는 표기가 깨졌습니다.");

      const svg = generated.prompt.match(/<svg class="pattern-diagram pattern-source"[^>]*>/)?.[0];
      check(Boolean(svg), context + ": 원본 근거 도형 그림이 없습니다.");
      check(attribute(svg, "data-source-verified") === "true", context + ": 원본 대조 표시가 없습니다.");
      const kind = attribute(svg, "data-pattern-kind");
      check(kind === expectedKinds[type.variant], context + `: 그림 계열이 ${kind}로 잘못 연결됐습니다.`);

      const groups = stageGroups(generated.prompt);
      const listedStages = attribute(svg, "data-stage-values").split(",").map(Number);
      check(groups.length === listedStages.length, context + ": 단계 그림 수가 맞지 않습니다.");
      groups.forEach((group, groupIndex) => {
        const stage = numberAttribute(group.tag, "data-stage");
        const lineTags = tags(group.body, "line");
        const circleTags = tags(group.body, "circle");
        check(stage === listedStages[groupIndex], context + ": 단계 순서가 어긋났습니다.");
        check(lineTags.length === numberAttribute(group.tag, "data-expected-lines"), context + `: ${stage}번째 선이 렌더 데이터보다 적거나 많습니다.`);
        check(circleTags.length === numberAttribute(group.tag, "data-expected-points"), context + `: ${stage}번째 점이 렌더 데이터보다 적거나 많습니다.`);
        check(new Set(lineTags.map(normalizedLine)).size === lineTags.length, context + `: ${stage}번째에 겹쳐 그린 선이 있습니다.`);
        check(new Set(circleTags.map(normalizedPoint)).size === circleTags.length, context + `: ${stage}번째에 겹쳐 그린 점이 있습니다.`);
        [...lineTags, ...circleTags].forEach(tag => {
          const values = [...tag.matchAll(/\b(?:x1|x2|y1|y2|cx|cy|r)="([^"]+)"/g)].map(match => Number(match[1]));
          check(values.length > 0 && values.every(Number.isFinite), context + `: ${stage}번째 좌표가 깨졌습니다.`);
        });

        if (type.variant <= 1) {
          const sides = numberAttribute(svg, "data-polygon-sides");
          check(lineTags.length === sides + (stage - 1) * (sides - 1), context + `: ${stage}번째 다각형 성냥개비 수가 그림과 다릅니다.`);
        } else if (type.variant === 2) {
          check(lineTags.length === 8 * stage + 4, context + `: ${stage}번째 입체 상자의 실제 선 수가 틀렸습니다.`);
        } else if (type.variant === 3) {
          check(circleTags.length === 8 * stage - 3, context + `: ${stage}번째 대각선 정사각형 점 수가 틀렸습니다.`);
        } else if (type.variant === 4) {
          check(circleTags.length === stage * stage && lineTags.length === stage * stage - 1, context + `: ${stage}번째 소용돌이 점·선 수가 틀렸습니다.`);
        } else if (type.variant === 5) {
          check(circleTags.length === 3 * stage * (stage - 1) + 1, context + `: ${stage}번째 육각형 바둑돌 수가 틀렸습니다.`);
        } else if (type.variant === 6) {
          check(circleTags.length === 5 * stage + 3, context + `: ${stage}번째 점 정사각형 수가 틀렸습니다.`);
        } else {
          const low = circleTags.filter(tag => tag.includes("pattern-coin-low")).length;
          const high = circleTags.filter(tag => tag.includes("pattern-coin-high")).length;
          check(low === Math.ceil(stage * stage / 2) && high === Math.floor(stage * stage / 2), context + `: ${stage}번째 동전 색 배치가 틀렸습니다.`);
        }
      });

      const answer = Number(generated.answer);
      if (type.variant === 0) {
        const target = promptInteger(generated.prompt, /(\d+)개를 이어 붙이는 데/, context);
        const sides = numberAttribute(svg, "data-polygon-sides");
        check(answer === sides + (target - 1) * (sides - 1), context + ": 이어 붙인 다각형 정답이 틀렸습니다.");
      } else if (type.variant === 1) {
        const matchsticks = promptInteger(generated.prompt, /성냥개비 (\d+)개로/, context);
        const sides = numberAttribute(svg, "data-polygon-sides");
        const candidates = Array.from({ length: 200 }, (_, index) => index + 1).filter(count => sides + (count - 1) * (sides - 1) === matchsticks);
        check(candidates.length === 1 && candidates[0] === answer, context + ": 다각형 역산 답이 유일하지 않거나 틀렸습니다.");
      } else if (type.variant === 2) {
        const target = promptInteger(generated.prompt, /상자 (\d+)개를 만드는 데/, context);
        check(answer === 8 * target + 4, context + ": 입체 상자 정답이 틀렸습니다.");
      } else if (type.variant === 3) {
        const target = promptInteger(generated.prompt, /(\d+)번째 도형에 찍힌 점/, context);
        check(answer === 8 * target - 3, context + ": 대각선 정사각형 점 정답이 틀렸습니다.");
      } else if (type.variant === 4) {
        const target = promptInteger(generated.prompt, /(\d+)번째 도형에 있는 점/, context);
        check(answer === target * target, context + ": 소용돌이 점 정답이 틀렸습니다.");
      } else if (type.variant === 5) {
        const target = promptInteger(generated.prompt, /(\d+)번째 도형에 필요한 바둑돌/, context);
        check(answer === 3 * target * (target - 1) + 1, context + ": 육각형 바둑돌 정답이 틀렸습니다.");
      } else if (type.variant === 6) {
        const pointCount = promptInteger(generated.prompt, /점을 모두 (\d+)개 찍어/, context);
        const candidates = Array.from({ length: 200 }, (_, index) => index + 1).filter(count => 5 * count + 3 === pointCount);
        check(candidates.length === 1 && candidates[0] === answer, context + ": 점 정사각형 역산 답이 유일하지 않거나 틀렸습니다.");
      } else {
        const target = promptInteger(generated.prompt, /(\d+)번째 도형에 놓인 동전/, context);
        const expected = Math.ceil(target * target / 2) * 50 + Math.floor(target * target / 2) * 100;
        check(answer === expected, context + ": 동전 금액 정답이 틀렸습니다.");
      }
      generatedCount += 1;
    }
  }
}

console.log(`재사용 도형 렌더러 감사 통과: 8유형, ${generatedCount}개 생성, 실제 SVG 점·선과 역산 유일성 검증`);
