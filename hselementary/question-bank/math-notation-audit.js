"use strict";

const fs = require("node:fs");
const path = require("node:path");

global.window = {};
require("./source-inventory-4-1.js");
require("./curriculum.js");
require("./generators.js");
require("./math-notation.js");

const api = window.HSE_GENERATORS;
const notation = window.HSE_MATH_NOTATION;
const allTypes = window.HSE_CURRICULUM.semesters.flatMap(semester => semester.units.flatMap(unit => unit.subunits.flatMap(subunit => subunit.types.map(type => ({
  ...type,
  semesterId: semester.id,
  unitId: unit.id,
  unitName: unit.name,
  subunitName: subunit.name
})))));
const types = allTypes.filter(type => api.generatorKey(type) && !type.reviewLocked);
const read = filename => fs.readFileSync(path.join(__dirname, filename), "utf8");
const failures = [];
let generatedCount = 0;
let fractionSampleCount = 0;
let mixedFractionSampleCount = 0;
let symbolicFractionSampleCount = 0;
if (types.length !== 686) failures.push(`공개 검수 대상은 686개여야 하나 ${types.length}개입니다.`);

const countTokens = (tokens, type) => tokens.reduce((count, token) => count + (token.type === type ? 1 : 0) + (token.type === "fraction" ? countTokens(token.numerator, type) + countTokens(token.denominator, type) : 0), 0);
const notationCases = [
  ["3/4", 1, 0],
  ["2 1/3", 1, 0],
  ["□/10", 1, 0],
  ["가/나", 1, 0],
  ["A/7", 1, 0],
  ["(가×라×마)/(나×다×바)", 1, 0],
  ["1/(5+1/7)", 2, 0],
  ["cm², m^3, ㎠, ㎥", 0, 4]
];
notationCases.forEach(([source, fractionCount, powerCount]) => {
  const tokens = notation.tokenize(source);
  if (countTokens(tokens, "fraction") !== fractionCount) failures.push(`공통 렌더러 분수 판독 실패: ${source}`);
  if (countTokens(tokens, "power") !== powerCount) failures.push(`공통 렌더러 단위 판독 실패: ${source}`);
});
[
  "km/h",
  "m/s",
  "점 A2와 점 B3",
  "2026/08/22"
].forEach(source => {
  const tokens = notation.tokenize(source);
  if (countTokens(tokens, "fraction") || countTokens(tokens, "power")) failures.push(`일반 문자열을 수학 표기로 오인했습니다: ${source}`);
});
const nestedFraction = notation.tokenize("1/(5+1/7)").find(token => token.type === "fraction");
if (!nestedFraction || notation.fractionAria(nestedFraction).includes("/")) failures.push("중첩 분수의 접근성 이름에 슬래시가 남아 있습니다.");

function fail(type, difficulty, seed, message) {
  failures.push(`${type.id} / 난이도 ${difficulty} / 시드 ${seed}: ${message}`);
}

for (const type of types) {
  for (const difficulty of [-1, 0, 1]) {
    for (let seed = 1; seed <= 50; seed += 1) {
      const generated = api.generate(type, 0, difficulty, seed, type.variant ?? 0);
      generatedCount += 1;
      if (!generated?.prompt || generated.answer === undefined || !generated.solution) {
        fail(type, difficulty, seed, "문제·정답·풀이 중 빠진 값이 있습니다.");
        continue;
      }

      const all = [generated.prompt, String(generated.answer), generated.solution].join("\n");
      const visible = all.replace(/<span hidden\b[^>]*><\/span>/g, "");
      const plainVisible = visible.replace(/<svg\b[\s\S]*?<\/svg>/g, " ").replace(/<[^>]+>/g, " ");
      fractionSampleCount += (plainVisible.match(/(?:\d+|□|[A-Za-z가-힣])\s*\/\s*(?:\d+|□|[A-Za-z가-힣])/g) || []).length;
      mixedFractionSampleCount += (plainVisible.match(/\b\d+\s+\d+\s*\/\s*\d+/g) || []).length;
      symbolicFractionSampleCount += (plainVisible.match(/(?:□|[A-Za-z가-힣])\s*\/|\/\s*(?:□|[A-Za-z가-힣])/g) || []).length;

      if (/\b\d+\s*(?:m|cm)\s+0\s*(?:cm|mm)\b/.test(visible)) fail(type, difficulty, seed, "0인 하위 단위가 붙은 복합 길이 표기가 있습니다.");
      if (/\b(?:km|cm|mm|m)\s*\^[23]\b/.test(visible)) fail(type, difficulty, seed, "캐럿으로 적은 넓이·부피 단위가 남아 있습니다.");

      const svgs = [...visible.matchAll(/<svg\b[\s\S]*?<\/svg>/g)].map(match => match[0]);
      svgs.forEach(svg => {
        const labels = [...svg.matchAll(/<text\b[^>]*>([\s\S]*?)<\/text>/g)].map(match => match[1].replace(/<[^>]+>/g, ""));
        labels.forEach(label => {
          if (/(?:\([^)]{1,80}\)|\d+|□|[A-Za-z가-힣])\s*\/\s*(?:\([^)]{1,80}\)|\d+|□|[A-Za-z가-힣])/.test(label)) fail(type, difficulty, seed, `SVG 치수에 일반 문자열 분수가 남아 있습니다: ${label}`);
        });
        if (/class="svg-measurement"[^>]*(?:role="img"|aria-label=)/.test(svg)) fail(type, difficulty, seed, "SVG 내부 치수 그룹이 중복 접근성 이미지로 노출됩니다.");
      });
    }
  }
}

const appSource = read("app.js");
const generatorSource = read("generators.js");
const styleSource = read("styles.css");
if (!appSource.includes("mathNotation.tokenize") || !appSource.includes("mathNotation.fractionAria")) failures.push("화면 렌더러가 검증 가능한 공통 수학 표기 모듈을 사용하지 않습니다.");
if (!generatorSource.includes("svgMeasurementLabel") || !generatorSource.includes("svg-measure-fraction")) failures.push("SVG 분수 치수 공통 렌더러가 없습니다.");
if (!styleSource.includes(".question-prompt svg text,.type-preview-question svg text")) failures.push("문제·미리보기 SVG의 공통 글꼴 규칙이 없습니다.");
if (!fractionSampleCount || !mixedFractionSampleCount || !symbolicFractionSampleCount) failures.push("분수·대분수·문자 분수 검수 표본이 충분하지 않습니다.");

if (failures.length) {
  console.error(`수학 표기 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 40).join("\n"));
  process.exit(1);
}

console.log(`수학 표기 감사 통과: ${types.length}유형, ${generatedCount.toLocaleString()}개 생성`);
console.log(`검수 표본: 분수 ${fractionSampleCount.toLocaleString()}개, 대분수 ${mixedFractionSampleCount.toLocaleString()}개, 문자·빈칸 분수 ${symbolicFractionSampleCount.toLocaleString()}개`);
