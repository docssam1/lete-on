"use strict";

global.window = {};
require("./generators.js");
const api = window.HSE_GENERATORS;
const failures = [];
const sourceIds = [
  "6-1-u5-e3-exploration", "6-1-u5-e3-example-1", "6-1-u5-e3-example-2", "6-1-u5-e3-example-3",
  "6-1-u5-e3-mission-1", "6-1-u5-e3-mission-2", "6-1-u5-e3-mission-3", "6-1-u5-e3-mission-4",
  "6-1-u5-e3-mission-5", "6-1-u5-e3-mission-6"
];
const layouts = [
  "pet-table-blank-circle", "mixed-tree-circle", "paired-job-circles", "three-overlap-circles",
  "book-circle-sum-difference", "paired-livestock-circles", "paired-grain-circles", "nutrition-circle-nested-percent",
  "paired-sales-mixed-unit-circles", "three-preference-circles"
];
const poolZeroAnswers = [
  "학생 수 120, 75, 60, 45명, 백분율 40, 25, 20, 15%", "30그루", "800,000명", "310명", "96권",
  "수정이네가 1마리 더 많음", "22%", "3개", "B 분식점, 5만원 더 많음", "480명"
];

const valuesFrom = html => {
  const match = String(html).match(/data-source61-graphs-e3-kind="[^"]+" data-source-item="[^"]+" data-values="([^"]*)"/);
  if (!match) throw new Error("E3 독립 자료 속성이 없습니다.");
  return match[1] ? match[1].split(",").map(Number) : [];
};
const compact = value => String(value).replace(/,/g, "").replace(/\s/g, "");
const expectedAnswer = (variant, values) => {
  if (variant === 0) return `학생 수 ${values.slice(0, 4).join(", ")}명, 백분율 ${values.slice(4, 8).join(", ")}%`;
  if (variant === 1) return `${values[0] * values[4] * values[5] / 10000}그루`;
  if (variant === 2) {
    const men = values[0], maleProfessionalRate = values[4], femaleSelfRate = values[7], gap = values[11];
    return `${(men + (men * maleProfessionalRate / 100 - gap) * 100 / femaleSelfRate).toLocaleString("ko-KR")}명`;
  }
  if (variant === 3) {
    const [total, art, pe, nonBoth] = values;
    const both = 360 - nonBoth, neither = 360 - art - pe + both;
    return `${total * neither / 360}명`;
  }
  if (variant === 4) {
    const [total, sumRate, difference, otherRate] = values;
    const pair = total * sumRate / 100, biography = (pair - difference) / 2;
    const novel = total - pair - total * otherRate / 100;
    return `${biography - novel}권`;
  }
  if (variant === 5) {
    const first = values[0] * values[5] / 100, second = values[1] * values[10] / 100;
    return `${first >= second ? "수정이네" : "진영이네"}가 ${Math.abs(first - second)}마리 더 많음`;
  }
  if (variant === 6) {
    const bean = values[0] * values[4] / 100 + values[1] * values[8] / 100;
    return `${bean * 100 / (values[0] + values[1])}%`;
  }
  if (variant === 7) {
    const [weight, , , , otherRate, part, need] = values;
    return `${Math.ceil(need / (weight * otherRate * part / 10000))}개`;
  }
  if (variant === 8) {
    const a = values[0] * values[6] / 100, b = values[1] * values[11] / 100;
    return `${a >= b ? "A" : "B"} 분식점, ${Math.abs(a - b)}만원 더 많음`;
  }
  const [total, mountain, seaDislike, both] = values;
  return `${total * (360 - mountain - (360 - seaDislike) + both) / 360}명`;
};
const visiblePart = html => String(html).replace(/<span hidden[^>]*>[\s\S]*?<\/span>/g, "");
const sectorPaths = html => [...String(html).matchAll(/<g class="source61-e3-sector[^"]*"[^>]*><path d="([^"]+)"/g)].map(match => match[1]);
const checkAngles = (html, sourceId) => {
  for (const signature of String(html).matchAll(/data-angle-signature="([^"]+)"/g)) {
    const sum = signature[1].split(",").reduce((total, value) => total + Number(value), 0);
    if (Math.abs(sum - 360) > 1e-8) failures.push(`${sourceId}: 원그래프 중심각 합 ${sum}`);
  }
  for (const sector of String(html).matchAll(/<g class="source61-e3-sector[^"]*"[^>]*data-segment-label="([^"]+)"[^>]*data-segment-angle="([^"]+)"[^>]*>([\s\S]*?)<\/g>/g)) {
    const arc = sector[3].match(/data-angle-owner="([^"]+)" data-angle-value="([^"]+)"/);
    if (arc && (arc[1] !== sector[1] || Math.abs(Number(arc[2]) - Number(sector[2])) > 1e-8)) failures.push(`${sourceId}: ${sector[1]} 각도 표시가 다른 부채꼴에 연결됨`);
  }
};

let generatedCount = 0;
for (let variant = 0; variant < sourceIds.length; variant += 1) {
  const seen = new Set();
  for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 200; seed += 1) {
    try {
      const generated = api.generate({ sourceItemId: sourceIds[variant], generatorKey: "sourceGrade6GraphsE3", reviewLocked: false, variant }, 0, difficulty, seed + (variant + 1) * 100000, variant);
      if (!generated) throw new Error("생성 결과가 없습니다.");
      generatedCount += 1;
      seen.add(generated.verifiedPoolIndex);
      const problemValues = valuesFrom(generated.prompt), answerValues = valuesFrom(generated.answerVisual);
      const problem = visiblePart(generated.prompt), answer = visiblePart(generated.answerVisual);
      if (problemValues.length) failures.push(`${sourceIds[variant]}: 문제 화면의 숨은 검사 값에 답 자료가 노출됨`);
      if (!answerValues.length) failures.push(`${sourceIds[variant]}: 답 화면의 독립 검산 자료 누락`);
      if (compact(generated.answer) !== compact(expectedAnswer(variant, answerValues))) failures.push(`${sourceIds[variant]}: 독립 답 불일치 ${generated.answer}/${expectedAnswer(variant, answerValues)}`);
      if (!generated.prompt.includes(`data-layout="${layouts[variant]}"`) || !generated.answerVisual.includes(`data-layout="${layouts[variant]}"`)) failures.push(`${sourceIds[variant]}: 그림 배치 계약 누락`);
      if (!generated.prompt.includes('data-phase="problem"') || !generated.answerVisual.includes('data-phase="answer"')) failures.push(`${sourceIds[variant]}: 문제·답 단계 계약 누락`);
      if (problem.includes("data-result-highlight=") || problem.includes("data-final-answer=")) failures.push(`${sourceIds[variant]}: 문제 그림에 답 표시`);
      if (!answer.includes(generated.answer) || !generated.answerVisual.includes("source61-graphs-e3-answer") || !generated.answerVisual.includes("data-result-highlight=")) failures.push(`${sourceIds[variant]}: 답 그림·최종 답 누락`);
      if (/undefined|null|NaN|Infinity|\$\{[^}]+\}/.test(problem + answer + generated.solution)) failures.push(`${sourceIds[variant]}: 깨진 값 노출`);
      checkAngles(problem, sourceIds[variant]);
      checkAngles(answer, sourceIds[variant]);
      if (variant !== 0) {
        const problemPaths = sectorPaths(problem);
        const answerPaths = sectorPaths(answer);
        if (!problemPaths.length || problemPaths.join("|") !== answerPaths.join("|")) failures.push(`${sourceIds[variant]}: 문제·답 원그래프 구간 불일치`);
      }
      if (generated.verifiedPoolIndex === 0 && compact(generated.answer) !== compact(poolZeroAnswers[variant])) failures.push(`${sourceIds[variant]}: 원본 대표 답 불일치`);
      if (generated.verifiedPoolIndex === 0 && variant === 1 && !problem.includes('data-angle-owner="벚나무" data-angle-value="54"')) failures.push(`${sourceIds[variant]}: 54°가 벚나무 구간에 붙지 않음`);
      if (generated.verifiedPoolIndex === 0 && variant === 3 && (!problem.includes('data-angle-owner="좋아하는 학생" data-angle-value="270"') || !problem.includes('data-angle-owner="좋아하는 학생" data-angle-value="240"') || !problem.includes('data-angle-owner="둘 다 좋아하지 않는 쪽" data-angle-value="150"'))) failures.push(`${sourceIds[variant]}: 270°·240°·150°의 대상 구간 불일치`);
      if (generated.verifiedPoolIndex === 0 && variant === 7 && (!problem.includes("기타 성분 가운데 25%") || !/기타(?:\s*·)?\s*2%/.test(problem))) failures.push(`${sourceIds[variant]}: 기타 2%와 그 안의 25% 구분 누락`);
      if (generated.verifiedPoolIndex === 0 && variant === 9 && !problem.includes('data-angle-owner="둘 다 좋아하는 학생" data-angle-value="160"')) failures.push(`${sourceIds[variant]}: 160°가 둘 다 좋아하는 학생 구간에 붙지 않음`);
      if (variant === 3 && /1550명/.test(problem + answer + generated.solution)) failures.push(`${sourceIds[variant]}: 잘못된 이전 답 1550명 노출`);
    } catch (error) {
      failures.push(`${sourceIds[variant]} / ${difficulty} / ${seed}: ${error.message}`);
    }
  }
  if (![0, 1, 2].every(pool => seen.has(pool))) failures.push(`${sourceIds[variant]}: 고정 pool 0·1·2 누락`);
}

if (failures.length) {
  console.error(`여러 가지 그래프 E3 독립 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 80).join("\n"));
  process.exit(1);
}
console.log(`여러 가지 그래프 E3 독립 감사 통과: 10유형 × 3난이도 × 200회 = ${generatedCount.toLocaleString()}회, 원본 대표 답·독립 계산·각도 대상·문제/답 동일 자료 확인`);
