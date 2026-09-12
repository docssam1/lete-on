"use strict";

global.window = {};
require("./generators.js");
const api = window.HSE_GENERATORS;
const failures = [];
const sourceIds = [
  "6-1-u5-e2-exploration", "6-1-u5-e2-example-1", "6-1-u5-e2-example-2", "6-1-u5-e2-example-3",
  "6-1-u5-e2-mission-1", "6-1-u5-e2-mission-2", "6-1-u5-e2-mission-3", "6-1-u5-e2-mission-4",
  "6-1-u5-e2-mission-5", "6-1-u5-e2-mission-6"
];
const layouts = [
  "pictograph-table-strip", "paired-food-strips", "three-year-time-strips", "measured-flower-strip",
  "class-fruit-strips", "paired-school-strips", "three-year-height-strips", "season-strip",
  "essay-domain-strip", "table-dual-rectangles"
];
const visibilityContracts = [
  "problem:2x2-pictograph-visible;table-values-hidden;strip-values-hidden|answer:table-and-strip-values",
  "problem:restaurant-totals-visible;food-rates-visible|answer:target-rate-and-money-visible",
  "problem:year-totals-visible;time-rates-visible|answer:first-two-bands-highlighted",
  "problem:length-rose-other-visible;inferred-flower-values-hidden|answer:flower-total-visible",
  "problem:class2-rate-hidden;fruit-rates-visible|answer:class2-rate-and-grape-count-visible",
  "problem:school-totals-visible;grade-rates-visible|answer:sixth-grade-rates-highlighted",
  "problem:all-three-years-visible;height-rates-visible|answer:2007-2012-target-highlighted",
  "problem:summer-rate-visible;other-season-rates-hidden|answer:all-season-rates-visible",
  "problem:data-count-visible;geometry-rate-hidden|answer:geometry-rate-and-wrong-count-visible",
  "problem:student-table-visible;grade-rates-visible|answer:sixth-grade-areas-highlighted"
];
const answerContracts = [
  "ordered-table-strip", "restaurant-money-difference", "time-band-total", "flower-total",
  "grape-student-count", "school-sixth-grade-difference", "height-sixth-grade-difference",
  "autumn-student-count", "geometry-wrong-count", "sixth-grade-area-difference"
];
const hiddenAnswer = html => {
  const match = String(html).match(/data-source61-graphs-e2-kind="[^"]+" data-source-item="[^"]+" data-values="([^"]*)"/);
  if (!match) throw new Error("E2 독립 자료 속성이 없습니다.");
  return match[1].split(",").map(Number);
};
const plain = value => String(value).replace(/,/g, "").replace(/\s/g, "");
const answerFrom = (variant, values) => {
  if (variant === 0) return `학생 수 ${values.slice(0, 4).join(", ")}명, 백분율 ${values.slice(4, 8).join(", ")}%`;
  if (variant === 1) {
    const [totalA, totalB, priceA, priceB, ...rates] = values;
    const countA = totalA * rates[2] / 100, countB = totalB * rates[6] / 100;
    const moneyA = countA * priceA, moneyB = countB * priceB;
    return `${moneyB > moneyA ? "나" : "가"} 식당, ${Math.abs(moneyB - moneyA)}원 더 많음`;
  }
  if (variant === 2) {
    const totals = values.slice(0, 3), rates = values.slice(3);
    return `${totals.reduce((sum, total, index) => sum + total * (rates[index * 3] + rates[index * 3 + 1]) / 100, 0)}명`;
  }
  if (variant === 3) return `${({ "40,25,20,10,5": 40, "40,24,20,8,8": 50, "30,30,15,15,10": 80 }[values.slice(3, 8).join(",")])}송이`;
  if (variant === 4) {
    const total = values[0], classRate = values[2], grapeRate = values[5 + 3];
    const classCount = total * classRate / 100;
    return `포도 ${classCount * grapeRate / 100}명`;
  }
  if (variant === 5) {
    const totalA = values[0], totalB = values[1], ratesA = values.slice(2, 8), ratesB = values.slice(8, 14);
    const countA = totalA * ratesA[5] / 100, countB = totalB * ratesB[5] / 100;
    return `${countA >= countB ? "민정이네" : "소희네"} 학교, ${Math.abs(countA - countB)}명 더 많음`;
  }
  if (variant === 6) {
    const totalA = values[0], totalB = values[1], rates = values.slice(3);
    return `${Math.abs(totalA * rates[3] / 100 - totalB * rates[7] / 100)}명`;
  }
  if (variant === 7) return `${values[0] * values[3] / 100}명`;
  if (variant === 8) {
    const essayCount = values[0] * values[1] / 100;
    const geometryCount = essayCount * values[3] / 100;
    return `${geometryCount - values[7]}문제`;
  }
  const [a, b, c, d] = values.slice(4, 8);
  return `${(a * b - c * d) * values[values.length - 1] / 100}cm²`;
};
const poolExpectations = [
  [ [72,48,32,48,36,24,16,24], [64,52,36,48,32,26,18,24], [88,46,34,32,44,23,17,16] ],
  [ [3000,5000,8000,5000,23,31,18,28,14,35,26,25], [4000,3000,6000,7000,20,30,25,25,15,20,40,25], [5200,4000,7000,6500,28,22,25,25,20,25,30,25] ],
  [ [3000,2500,2000,22,38,40,26,38,36,33,40,27], [2400,2000,1600,25,35,40,30,35,35,32,43,25], [3600,2800,2400,18,42,40,25,40,35,35,40,25] ],
  [ [20,8,5,40,25,20,10,5,5,2,8], [25,10,8,40,24,20,8,8,3,1,12], [30,9,10,30,30,15,15,10,2,1,24] ],
  [ [200,30,25,25,20,36,24,20,14,6], [200,25,30,20,25,30,25,20,15,10], [300,20,40,25,15,28,24,22,15,11] ],
  [ [600,400,21,20,16,15,15,13,14,15,15,17,20,19], [500,450,15,16,17,18,14,20,12,15,16,17,18,22], [800,600,14,15,16,18,19,18,10,12,16,18,19,25] ],
  [ [1000,800,1000,35.6,37.8,21,5.6,27.6,38.4,25.5,8.5,23.1,40,26.5,10.4], [1200,900,1000,32.5,35,25,7.5,25,37,26,12,21,38,27,14], [1500,1000,1000,30,40,24,6,22,36,31,11,18,38,30.5,13.5] ],
  [ [80,15,35,20,30], [120,20,35,15,30], [200,20,30,20,30] ],
  [ [250,20,36,22,18,16,4,9], [400,25,32,28,18,16,6,20], [500,20,25,35,20,15,5,23] ],
  [ [42,126,105,147,18,5,10,7,10,30,25,35], [80,100,120,100,16,6,12,6,20,25,30,25], [80,100,120,200,20,8,15,8,16,20,24,40] ]
];
const visiblePart = html => String(html).replace(/<span hidden[^>]*>[\s\S]*?<\/span>/g, "");
let generatedCount = 0;
for (let variant = 0; variant < sourceIds.length; variant += 1) {
  const seen = new Set();
  for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 200; seed += 1) {
    let generated;
    try {
      generated = api.generate({ sourceItemId: sourceIds[variant], generatorKey: "sourceGrade6GraphsE2", reviewLocked: false, variant }, 0, difficulty, seed + (variant + 1) * 100000, variant);
      generatedCount += 1;
      seen.add(generated.verifiedPoolIndex);
      const problemValues = hiddenAnswer(generated.prompt), answerValues = hiddenAnswer(generated.answerVisual);
      if (problemValues.join(",") !== answerValues.join(",")) failures.push(`${sourceIds[variant]}: 문제·답 자료 불일치`);
      if (generated.prompt.includes("data-result-highlight=")) failures.push(`${sourceIds[variant]}: 문제에 정답 표시`);
      if (!generated.answerVisual.includes("source61-graphs-e2-answer") || !generated.answerVisual.includes("data-result-highlight=")) failures.push(`${sourceIds[variant]}: 답 그림·강조 누락`);
      if (!generated.prompt.includes(`data-layout="${layouts[variant]}"`) || !generated.answerVisual.includes(`data-layout="${layouts[variant]}"`)) failures.push(`${sourceIds[variant]}: layout 계약 불일치`);
      if (!generated.prompt.includes('data-phase="problem"') || !generated.answerVisual.includes('data-phase="answer"')) failures.push(`${sourceIds[variant]}: 문제·답 단계 계약 누락`);
      if (!generated.prompt.includes(`data-visibility-contract="${visibilityContracts[variant]}"`) || !generated.answerVisual.includes(`data-source61-e2-visibility-contract="${visibilityContracts[variant]}"`)) failures.push(`${sourceIds[variant]}: 보임·숨김 계약 누락`);
      if (!generated.answerVisual.includes(`data-source61-e2-answer-contract="${answerContracts[variant]}"`)) failures.push(`${sourceIds[variant]}: 답 계약 누락`);
      const visiblePrompt = visiblePart(generated.prompt), visibleAnswer = visiblePart(generated.answerVisual);
      if (!visibleAnswer.includes(generated.answer)) failures.push(`${sourceIds[variant]}: 답 그림 안에 최종 답 누락`);
      if (plain(generated.answer) !== plain(answerFrom(variant, problemValues))) failures.push(`${sourceIds[variant]}: 독립 답 불일치 ${generated.answer}/${answerFrom(variant, problemValues)}`);
      if (variant === 0 && !generated.prompt.includes('data-source61-graphs-e2-pictograph-quadrants="2x2"')) failures.push(`${sourceIds[variant]}: 그림그래프 2x2 계약 누락`);
      if (variant === 0) {
        const problemTable = visiblePrompt.match(/<table[^>]*data-source61-e2-summary-table="student-and-percent"[^>]*>([\s\S]*?)<\/table>/);
        const answerTable = visibleAnswer.match(/<table[^>]*data-source61-e2-summary-table="student-and-percent"[^>]*>([\s\S]*?)<\/table>/);
        if (!problemTable || (problemTable[1].match(/<tbody>[\s\S]*?<tr>/g) || []).length !== 1 || (problemTable[1].match(/<tr>/g) || []).length !== 3) failures.push(`${sourceIds[variant]}: 문제 표의 학생 수·백분율 두 행 누락`);
        if (!answerTable || (answerTable[1].match(/<tr>/g) || []).length !== 3 || !answerTable[1].includes("백분율(%)")) failures.push(`${sourceIds[variant]}: 답 표의 학생 수·백분율 두 행 누락`);
        if (!generated.prompt.includes('data-source61-e2-empty-strip="true"')) failures.push(`${sourceIds[variant]}: 완성 전 띠그래프 빈 구조 계약 누락`);
        const blankStrip = visiblePrompt.match(/<svg[^>]*data-source61-e2-empty-strip="true"[^>]*>([\s\S]*?)<\/svg>/);
        if (!blankStrip || (blankStrip[1].match(/class="source61-e2-segment/g) || []).length !== 1) failures.push(`${sourceIds[variant]}: 완성 전 띠그래프에 정답 경계 노출`);
      }
      if (variant === 1 && (!visiblePrompt.includes("전체") || !visiblePrompt.includes("그릇"))) failures.push(`${sourceIds[variant]}: 음식점 전체량 표시 누락`);
      if (variant === 2 && (!visiblePrompt.includes("전체") || !visiblePrompt.includes("명"))) failures.push(`${sourceIds[variant]}: 연도별 전체 학생 수 표시 누락`);
      if (variant === 3 && (!visiblePrompt.includes("전체") || !visiblePrompt.includes("cm") || !visiblePrompt.includes("기타"))) failures.push(`${sourceIds[variant]}: 꽃 띠그래프 치수 표기 누락`);
      if (variant === 4 && /2반\s*25%/.test(visiblePrompt)) failures.push(`${sourceIds[variant]}: 문제 화면에 2반 25% 노출`);
      if (variant === 4 && !visiblePrompt.includes("포도를 좋아하는 학생 수")) failures.push(`${sourceIds[variant]}: 포도 학생 수 최종 질문 누락`);
      if (variant === 7 && /봄\s*15%|가을\s*20%|겨울\s*30%/.test(visiblePrompt)) failures.push(`${sourceIds[variant]}: 계절 추론값 문제 노출`);
      if (variant === 3 && !generated.prompt.includes("math-fraction")) failures.push(`${sourceIds[variant]}: 분수 표시가 공통 수식이 아님`);
      if (variant === 7 && !generated.prompt.includes("math-fraction")) failures.push(`${sourceIds[variant]}: 분수 표시가 공통 수식이 아님`);
      if (variant === 8) {
        const dataCount = problemValues[6];
        if (!visiblePrompt.includes(`자료와 가능성 (${dataCount}문제)`)) failures.push(`${sourceIds[variant]}: 자료와 가능성 실제 개수 표기 누락`);
        if (visiblePrompt.includes(`도형 ${problemValues[3]}%`)) failures.push(`${sourceIds[variant]}: 문제에 도형 비율 노출`);
        if (!generated.solution.includes(`${problemValues[3]}%`)) failures.push(`${sourceIds[variant]}: 풀이에 도형 환산 근거 누락`);
      }
      if (variant === 9 && problemValues[0] === 42 && !visiblePrompt.includes("42")) failures.push(`${sourceIds[variant]}: 원본 학생 수 표 누락`);
      const segments = [...generated.prompt.matchAll(/data-row-segments="([^"]+)"/g)];
      segments.forEach(match => { const sum = match[1].split(",").reduce((total, value) => total + Number(value), 0); if (Math.abs(sum - 100) > 1e-8) failures.push(`${sourceIds[variant]}: 구간 합 ${sum}`); });
      if (generated.verifiedPoolIndex === 0 && problemValues.join(",") !== poolExpectations[variant][0].join(",")) failures.push(`${sourceIds[variant]}: 원본 pool 0 수치 불일치`);
    } catch (error) { failures.push(`${sourceIds[variant]} / ${difficulty} / ${seed}: ${error.message}`); }
  }
  if (![0, 1, 2].every(pool => seen.has(pool))) failures.push(`${sourceIds[variant]}: pool 0/1/2 누락 (${[...seen].join(",")})`);
}
if (failures.length) { console.error(`여러 가지 그래프 E2 독립 감사 실패: ${failures.length}건`); console.error(failures.slice(0, 60).join("\n")); process.exit(1); }
console.log(`여러 가지 그래프 E2 독립 감사 통과: 10유형 × 3난이도 × 200회 = ${generatedCount.toLocaleString()}회, 고정 pool·독립 답·문제/답 자료·구간 합 계약 확인`);
