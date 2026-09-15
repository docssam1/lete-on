"use strict";

const fs = require("node:fs");
const path = require("node:path");

global.window = {};
require("./source-inventory-4-1.js");
require("./source-inventory-grade6.js");
require("./curriculum.js");
require("./generators.js");
require("./source-4-2-parallel-angle.js");
require("./source-grade6-decimal-e1-mission4.js");
require("./source-grade6-decimal-e1-mission3.js");
require("./source-grade6-decimal-e2-example2.js");
require("./source-grade6-decimal-e2-example4.js");
require("./source-grade6-decimal-e2-mission6.js");
require("./source-grade6-decimal-e4-example1.js");
require("./source-grade6-decimal-e4-mission4.js");
require("./source-grade6-volume-e2.js");
require("./source-grade6-volume-e3-mission3.js");
require("./source-grade6-volume-e4.js");
require("./source-grade6-surface-e1.js");
require("./math-notation.js");

const api = window.HSE_GENERATORS;
const notation = window.HSE_MATH_NOTATION;
const EXPECTED_PUBLIC_TYPE_COUNT = 1064;
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
if (types.length !== EXPECTED_PUBLIC_TYPE_COUNT) failures.push(`공개 검수 대상은 ${EXPECTED_PUBLIC_TYPE_COUNT}개여야 하나 ${types.length}개입니다.`);

const countTokens = (tokens, type) => tokens.reduce((count, token) => count + (token.type === type ? 1 : 0) + (token.type === "fraction" ? countTokens(token.numerator, type) + countTokens(token.denominator, type) : token.type === "mixed" ? countTokens([token.fraction], type) : 0), 0);
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
if (countTokens(notation.tokenize("2 1/3"), "mixed") !== 1) failures.push("공통 렌더러 대분수 판독 실패: 2 1/3");
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

      const all = [generated.prompt, String(generated.answer), generated.solution, generated.answerVisual || ""].join("\n");
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
if (!/\.math-fraction\{[^}]*grid-template-columns:max-content[^}]*justify-items:stretch/.test(styleSource)) failures.push("분수의 가장 넓은 항 기준 그리드 폭 또는 양쪽 확장이 없습니다.");
if (!/\.math-fraction>span\{[^}]*width:100%/.test(styleSource)) failures.push("분수선이 분수 전체 폭을 따르도록 자식 폭이 고정되지 않았습니다.");
if (/\.math-fraction\{[^}]*vertical-align:-\.35em/.test(styleSource)) failures.push("분수에 수동 기준선 보정이 남아 있습니다.");
if (!/\.math-mixed-number\{[^}]*vertical-align:middle/.test(styleSource)) failures.push("대분수의 문장 속 수직 정렬 규칙이 없습니다.");

async function auditFractionLayout() {
  const playwrightPath = process.env.HSE_PLAYWRIGHT_PATH || path.join(process.env.USERPROFILE || "", ".cache", "codex-runtimes", "codex-primary-runtime", "dependencies", "node", "node_modules", "playwright");
  let browser;
  try {
    const { chromium } = require(playwrightPath);
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage({ viewport: { width: 1440, height: 720 } });
    await page.setContent(`<!doctype html><html><head><meta charset="utf-8"></head><body>
      <main id="fixture">
        <p id="korean-line">한글 <span id="baseline-probe"></span><span class="math-fraction" data-fraction="five-over-120"><span>5</span><span>120</span></span> 과 <span class="math-fraction" data-fraction="eleven-over-15"><span>11</span><span>15</span></span> 를 비교합니다.</p>
        <p id="long-line"><span class="math-fraction" data-fraction="long"><span>123456789</span><span>120</span></span> 은 긴 분수입니다.</p>
        <p id="mixed-line"><span class="math-mixed-number" id="mixed"><span id="mixed-whole">2</span><span class="math-fraction" data-fraction="mixed"><span>11</span><span>15</span></span></span> 입니다.</p>
        <p id="expression-line"><span class="math-inline-expression" id="expression"><span class="math-fraction"><span>11</span><span>15</span></span> + <span class="math-fraction"><span>5</span><span>120</span></span> = <span class="math-fraction"><span>9</span><span>10</span></span></span></p>
        <p id="atom-line">수량은 <span class="math-inline-expression" id="number-unit">120<span class="math-unit">cm<sup>2</sup></span></span> 입니다.</p>
        <div class="equation expanded" id="expanded-equation">9,999 × 2,222 + 3,333 × 3,334 = □</div>
      </main>
    </body></html>`);
    await page.addStyleTag({ content: styleSource.replace(/^@import[^;]+;\s*/, "") });
    await page.addStyleTag({ content: `html,body{margin:0;padding:0;overflow-x:hidden}#fixture{box-sizing:border-box;width:calc(100vw - 32px);margin:16px;font-family:"Malgun Gothic",sans-serif;font-size:20px;font-weight:750;line-height:1.8}#fixture p{margin:0 0 18px}#baseline-probe{display:inline-block;width:0;height:0;vertical-align:baseline}#expression-line,#atom-line{max-width:100%}` });

    for (const viewport of [{ label: "desktop", width: 1440 }, { label: "390px", width: 390 }]) {
      await page.setViewportSize({ width: viewport.width, height: 720 });
      const layout = await page.evaluate(() => {
        const rect = element => {
          const { left, right, top, bottom, width, height } = element.getBoundingClientRect();
          return { left, right, top, bottom, width, height, centerX: left + width / 2, centerY: top + height / 2 };
        };
        const fraction = element => {
          const [numerator, denominator] = element.children;
          return { box: rect(element), numerator: rect(numerator), denominator: rect(denominator), numeratorScrollWidth: numerator.scrollWidth, denominatorScrollWidth: denominator.scrollWidth };
        };
        const koreanLine = document.querySelector("#korean-line");
        const koreanText = koreanLine.firstChild;
        const koreanRange = document.createRange();
        koreanRange.setStart(koreanText, 0);
        koreanRange.setEnd(koreanText, koreanText.length);
        const koreanStyle = getComputedStyle(koreanLine);
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        context.font = koreanStyle.font;
        const xHeight = context.measureText("x").actualBoundingBoxAscent || parseFloat(koreanStyle.fontSize) * 0.5;
        const mixed = document.querySelector("#mixed");
        const expression = document.querySelector("#expression");
        const atom = document.querySelector("#number-unit");
        const expanded = document.querySelector("#expanded-equation");
        const expandedRange = document.createRange();
        expandedRange.selectNodeContents(expanded);
        return {
          fractions: Object.fromEntries([...document.querySelectorAll("[data-fraction]")].map(element => [element.dataset.fraction, fraction(element)])),
          korean: rect(koreanRange),
          koreanLine: rect(koreanLine),
          baselineY: rect(document.querySelector("#baseline-probe")).top,
          expectedMiddleY: rect(document.querySelector("#baseline-probe")).top - xHeight / 2,
          mixedWhole: rect(document.querySelector("#mixed-whole")),
          mixedFraction: fraction(mixed.querySelector(".math-fraction")).box,
          expressionRects: expression.getClientRects().length,
          atomRects: atom.getClientRects().length,
          expressionWhiteSpace: getComputedStyle(expression).whiteSpace,
          atomWhiteSpace: getComputedStyle(atom).whiteSpace,
          expandedLineCount: expandedRange.getClientRects().length,
          expandedWhiteSpace: getComputedStyle(expanded).whiteSpace,
          expandedOverflowWrap: getComputedStyle(expanded).overflowWrap,
          expandedFits: expanded.scrollWidth <= expanded.clientWidth + 1,
          documentOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
        };
      });
      for (const [name, measurement] of Object.entries(layout.fractions)) {
        const { box, numerator, denominator, numeratorScrollWidth, denominatorScrollWidth } = measurement;
        if (Math.abs(numerator.centerX - box.centerX) > 0.5 || Math.abs(denominator.centerX - box.centerX) > 0.5) failures.push(`${viewport.label}: ${name}의 분자 또는 분모가 분수 중심과 맞지 않습니다.`);
        if (Math.abs(numerator.left - box.left) > 0.5 || Math.abs(numerator.right - box.right) > 0.5) failures.push(`${viewport.label}: ${name}의 분수선이 전체 분수 폭을 덮지 않습니다.`);
        if (numeratorScrollWidth > numerator.width + 0.5 || denominatorScrollWidth > denominator.width + 0.5) failures.push(`${viewport.label}: ${name}의 분자 또는 분모가 분수 폭 안에서 잘립니다.`);
      }
      const inlineFraction = layout.fractions["five-over-120"].box;
      const baselineOffset = Math.abs(inlineFraction.centerY - layout.expectedMiddleY);
      if (baselineOffset > 1 || inlineFraction.top < layout.koreanLine.top - 0.5 || inlineFraction.bottom > layout.koreanLine.bottom + 0.5) failures.push(`${viewport.label}: 5/120이 주변 한글의 기준선 또는 줄높이와 맞지 않습니다 (${baselineOffset.toFixed(2)}px, 실제 ${Math.abs(inlineFraction.centerY - layout.baselineY).toFixed(2)}px, 기대 ${Math.abs(layout.expectedMiddleY - layout.baselineY).toFixed(2)}px).`);
      if (Math.abs(layout.mixedWhole.centerY - layout.mixedFraction.centerY) > 0.5) failures.push(`${viewport.label}: 대분수의 자연수와 분수가 수직으로 맞지 않습니다.`);
      if (layout.expressionRects !== 1 || layout.atomRects !== 1 || layout.expressionWhiteSpace !== "nowrap" || layout.atomWhiteSpace !== "nowrap") failures.push(`${viewport.label}: 수식 또는 숫자·단위 원자가 줄바꿈될 수 있습니다.`);
      if (layout.expandedLineCount !== 1 || layout.expandedWhiteSpace !== "nowrap" || layout.expandedOverflowWrap !== "normal" || !layout.expandedFits) failures.push(`${viewport.label}: 한 줄 계산식이 중간에서 갈라지거나 칸을 넘습니다.`);
      if (layout.documentOverflow > 0.5) failures.push(`${viewport.label}: 수식 검수 화면에 가로 넘침이 있습니다.`);
    }
  } catch (error) {
    failures.push(`실제 DOM 분수 조판 검수를 실행하지 못했습니다: ${error.message}`);
  } finally {
    await browser?.close();
  }
}

async function main() {
  const failuresBeforeDomAudit = failures.length;
  await auditFractionLayout();
  if (failures.length === failuresBeforeDomAudit) console.log("실제 DOM 분수 조판 검수 통과: 1440px, 390px");
  if (failures.length) {
    console.error(`수학 표기 감사 실패: ${failures.length}건`);
    console.error(failures.slice(0, 40).join("\n"));
    process.exit(1);
  }

  console.log(`수학 표기 감사 통과: ${types.length}유형, ${generatedCount.toLocaleString()}개 생성`);
  console.log(`검수 표본: 분수 ${fractionSampleCount.toLocaleString()}개, 대분수 ${mixedFractionSampleCount.toLocaleString()}개, 문자·빈칸 분수 ${symbolicFractionSampleCount.toLocaleString()}개`);
}

main();
