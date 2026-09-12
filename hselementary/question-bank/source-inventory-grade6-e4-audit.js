"use strict";

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const dir = __dirname;
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const percent = value => Number(value.toFixed(2)).toString() + "%";
const close = (left, right) => Math.abs(Number(left) - Number(right)) < 1e-8;
const tagAttr = (tag, name) => tag.match(new RegExp(name + "=\"([^\"]*)\""))?.[1] || "";

const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(dir, "source-inventory-grade6.js"), "utf8"), context);
vm.runInContext(fs.readFileSync(path.join(dir, "generators.js"), "utf8"), context);
const catalog = context.window.HSE_SOURCE_INVENTORY_GRADE6;
const api = context.window.HSE_GENERATORS;

// Independent oracle: expected answers never come from generator answerVisual/data-values.
const cases = [
  {
    id: "6-1-u5-e4-exploration-1",
    pools: [
      { total: 5000, agree: 70, oppose: 30, agreeReasons: [35, 34, 22, 9], opposeReasons: [33, 32, 28, 7] },
      { total: 6000, agree: 60, oppose: 40, agreeReasons: [40, 30, 20, 10], opposeReasons: [25, 35, 30, 10] },
      { total: 4000, agree: 75, oppose: 25, agreeReasons: [30, 28, 25, 17], opposeReasons: [40, 30, 20, 10] }
    ]
  },
  {
    id: "6-1-u5-e4-exploration-2",
    pools: [
      { total: 5000, agree: 70, oppose: 30, agreeReasons: [35, 34, 22, 9], opposeReasons: [33, 32, 28, 7] },
      { total: 6000, agree: 60, oppose: 40, agreeReasons: [40, 30, 20, 10], opposeReasons: [25, 35, 30, 10] },
      { total: 4000, agree: 75, oppose: 25, agreeReasons: [30, 28, 25, 17], opposeReasons: [40, 30, 20, 10] }
    ]
  },
  {
    id: "6-1-u5-e4-example-1",
    pools: [
      { totalMan: 5000, surname: [22, 15, 8, 55], branches: [42, 17, 9, 32] },
      { totalMan: 4000, surname: [25, 10, 12, 53], branches: [40, 20, 15, 25] },
      { totalMan: 5000, surname: [20, 15, 10, 55], branches: [45, 20, 12, 23] }
    ]
  },
  {
    id: "6-1-u5-e4-example-2",
    pools: [
      { total: 600, male: 60, female: 40, maleRates: [25, 35, 40], femaleRates: [45, 25, 30] },
      { total: 800, male: 55, female: 45, maleRates: [30, 30, 40], femaleRates: [40, 35, 25] },
      { total: 500, male: 48, female: 52, maleRates: [20, 45, 35], femaleRates: [30, 30, 40] }
    ]
  },
  { id: "6-1-u5-e4-mission-1", pools: [{ before: [30, 25, 20, 15, 10] }, { before: [40, 20, 15, 15, 10] }, { before: [20, 30, 25, 15, 10] }] },
  {
    id: "6-1-u5-e4-mission-2",
    pools: [
      { gender: [62, 38], academies: [35, 30, 20, 15] },
      { gender: [55, 45], academies: [30, 20, 35, 15] },
      { gender: [64, 36], academies: [40, 25, 20, 15] }
    ]
  },
  {
    id: "6-1-u5-e4-mission-4",
    pools: [
      { gifts: [30, 25, 20, 25], toys: [45, 20, 10, 25], count: 24 },
      { gifts: [25, 30, 20, 25], toys: [40, 25, 15, 20], count: 30 },
      { gifts: [35, 20, 20, 25], toys: [50, 15, 10, 25], count: 18 }
    ]
  },
  {
    id: "6-1-u5-e4-mission-5",
    pools: [
      { total: 80, angles: [36, 81, 162, 81], known: [8, 8, 12], points: [6, 6, 8] },
      { total: 100, angles: [36, 72, 180, 72], known: [10, 10, 20], points: [5, 5, 8] },
      { total: 60, angles: [60, 60, 180, 60], known: [10, 6, 15], points: [4, 4, 5] }
    ]
  },
  {
    id: "6-1-u5-e4-mission-6",
    pools: [
      { male: 52, female: 48, maleItem: 104, femaleItem: 72, femaleRate: 24 },
      { male: 55, female: 45, maleItem: 99, femaleItem: 54, femaleRate: 20 },
      { male: 48, female: 52, maleItem: 72, femaleItem: 65, femaleRate: 25 }
    ]
  }
];

const agreeLabels = ["일자리가 생기므로", "관광 수요 증가", "지역의 성장", "기타"];
const opposeLabels = ["공사 중 공해 발생", "환경 훼손 염려", "교통 체증", "기타"];
const academyLabels = ["미술 학원", "피아노 학원", "발레 학원", "기타"];
const sum = values => values.reduce((total, value) => total + value, 0);
const segment = (title, labels, values) => ({ title, labels, values });

function scoreModel(data) {
  const groups = data.angles.map(angle => data.total * angle / 360);
  const counts = [data.known[0], data.known[1], groups[1] - data.known[1], data.known[2], groups[2] - data.known[2], groups[3]];
  const scores = [0, data.points[0], data.points[2], data.points[0] + data.points[1], data.points[1] + data.points[2], sum(data.points)];
  const rows = scores.map((score, index) => ({ score, count: counts[index] })).sort((a, b) => a.score - b.score);
  return { counts, rows, average: rows.reduce((total, row) => total + row.score * row.count, 0) / data.total };
}

function expectedAnswer(variant, data) {
  if (variant === 0) return String(data.total * data.agree * Math.max(...data.agreeReasons) / 10000 - data.total * data.oppose * Math.max(...data.opposeReasons) / 10000) + "명";
  if (variant === 1) {
    const moved = data.total * data.oppose * data.opposeReasons[2] / 10000;
    const oldOther = data.total * data.agree * data.agreeReasons[3] / 10000;
    return percent((oldOther + moved) * 100 / (data.total * data.agree / 100 + moved));
  }
  if (variant === 2) return String(data.totalMan * data.surname[0] * (data.branches[0] - data.branches[2]) / 10000) + "만명";
  if (variant === 3) {
    const counts = data.maleRates.map((_, index) => data.total * (data.male * data.maleRates[index] + data.female * data.femaleRates[index]) / 10000);
    const largest = Math.max(...counts);
    return ["피아노", "미술", "태권도"][counts.indexOf(largest)] + ", " + largest.toLocaleString("ko-KR") + "명";
  }
  if (variant === 4) {
    const after = [data.before[0] / 2, data.before[1], data.before[2] + data.before[0] / 2, data.before[3], data.before[4]];
    return ["소설", "참고서", "위인전", "시집", "기타"].map((name, index) => name + after[index] + "%").join(", ");
  }
  if (variant === 5) return percent(data.gender[1] * data.academies[1] / 100);
  if (variant === 6) return String(data.count * 10000 / (data.gifts[2] * data.toys[1])) + "명";
  if (variant === 7) return String(scoreModel(data).average) + "점";
  const femaleTotal = data.femaleItem * 100 / data.femaleRate;
  const maleTotal = femaleTotal * 100 / data.female * data.male / 100;
  return percent(data.maleItem * 100 / maleTotal);
}

function expectedVisuals(variant, data) {
  if (variant === 0) {
    const graphs = [segment("찬반 여부", ["찬성", "반대"], [data.agree, data.oppose]), segment("찬성 이유", agreeLabels, data.agreeReasons), segment("반대 이유", opposeLabels, data.opposeReasons)];
    return { problem: graphs, answer: graphs };
  }
  if (variant === 1) {
    const before = [segment("이동 전 찬반 여부", ["찬성", "반대"], [data.agree, data.oppose]), segment("이동 전 찬성 이유", agreeLabels, data.agreeReasons), segment("이동 전 반대 이유", opposeLabels, data.opposeReasons)];
    const moved = data.total * data.oppose * data.opposeReasons[2] / 10000;
    const oldOther = data.total * data.agree * data.agreeReasons[3] / 10000;
    const newAgree = data.total * data.agree / 100 + moved;
    const otherRate = (oldOther + moved) * 100 / newAgree;
    return { problem: before, answer: [...before, segment("바뀐 뒤 찬반 여부", ["찬성", "반대"], [newAgree * 100 / data.total, 100 - newAgree * 100 / data.total]), segment("바뀐 뒤 찬성 이유", ["기타", "기타 외"], [otherRate, 100 - otherRate])] };
  }
  if (variant === 2) {
    const graphs = [segment("우리나라 성씨별 사람 수", ["김씨", "이씨", "박씨", "기타"], data.surname), segment("김씨의 본관별 사람 수", ["김해 김씨", "경주 김씨", "광산 김씨", "기타"], data.branches)];
    return { problem: graphs, answer: graphs };
  }
  if (variant === 3) {
    const graphs = [segment("남녀 학생 수", ["남학생", "여학생"], [data.male, data.female]), segment("다니는 학원별 남학생 수", ["피아노", "미술", "태권도"], data.maleRates), segment("다니는 학원별 여학생 수", ["피아노", "미술", "태권도"], data.femaleRates)];
    return { problem: graphs, answer: graphs };
  }
  if (variant === 4) {
    const labels = ["소설", "참고서", "위인전", "시집", "기타"];
    const after = [data.before[0] / 2, data.before[1], data.before[2] + data.before[0] / 2, data.before[3], data.before[4]];
    return { problem: [segment("1학기 학급 문고의 종류별 권수", labels, data.before), segment("2학기 학급 문고의 종류별 권수", [], [])], answer: [segment("1학기 학급 문고의 종류별 권수", labels, data.before), segment("2학기 학급 문고의 종류별 권수", labels, after)] };
  }
  if (variant === 5) {
    const graphs = [segment("남녀의 수", ["남학생", "여학생"], data.gender), segment("여학생이 다니고 싶은 학원별 학생 수", academyLabels, data.academies)];
    return { problem: graphs, answer: graphs };
  }
  if (variant === 6) {
    const graphs = [segment("받고 싶은 선물별 학생 수", ["휴대전화", "게임기", "장난감", "기타"], data.gifts), segment("장난감 종류별 학생 수", ["로봇", "팽이", "큐브", "기타"], data.toys)];
    return { problem: graphs, answer: graphs };
  }
  if (variant === 7) {
    const labels = ["3문제 모두 틀린 학생", "1문제 맞힌 학생", "2문제 맞힌 학생", "3문제 맞힌 학생"];
    const values = data.angles.map(angle => angle / 3.6);
    return { problem: [segment("시험 결과", labels, values)], answer: [segment("시험 결과", labels, values)] };
  }
  const productValues = [34, data.femaleRate, 20, 12, 100 - 34 - data.femaleRate - 20 - 12];
  const graphs = [segment("남·여학생 수", ["남학생", "여학생"], [data.male, data.female]), segment("여학생이 좋아하는 상표", ["가 상표", "나 상표", "다 상표", "라 상표", "기타"], productValues)];
  return { problem: graphs, answer: graphs };
}

function extractGraphs(html) {
  return [...html.matchAll(/<svg\b([^>]*\bsource61-graphs-e4-diagram\b[^>]*)>([\s\S]*?)<\/svg>/g)].map(match => {
    const attrs = match[1];
    const body = match[2];
    const isPie = body.includes("source61-e4-pie");
    const tags = isPie
      ? [...body.matchAll(/<path\b[^>]*\bsource61-e4-sector\b[^>]*>/g)].map(item => item[0])
      : [...body.matchAll(/<rect\b[^>]*\bsource61-e4-strip-segment\b[^>]*>/g)].map(item => item[0]);
    return {
      title: tagAttr(attrs, "aria-label"),
      phase: tagAttr(attrs, "data-phase"),
      labels: tags.map(tag => tagAttr(tag, isPie ? "data-segment-label" : "data-strip-label")),
      values: tags.map(tag => Number(tagAttr(tag, isPie ? "data-segment-percent" : "data-strip-percent")))
    };
  });
}

function extractTables(html) {
  return [...html.matchAll(/<table\b[^>]*\bsource61-e4-table\b[^>]*data-phase="([^"]+)"[^>]*>([\s\S]*?)<\/table>/g)].map(match => ({
    phase: match[1],
    rows: [...match[2].matchAll(/<tr>([\s\S]*?)<\/tr>/g)].map(row => [...row[1].matchAll(/<(?:th|td)>([\s\S]*?)<\/(?:th|td)>/g)].map(cell => cell[1].replace(/<[^>]+>/g, "").trim()))
  }));
}

function compareGraphs(actual, expected, phase, label) {
  check(actual.length === expected.length, `${label}: ${phase} 그래프 수 ${actual.length}/${expected.length}`);
  expected.forEach((wanted, index) => {
    const got = actual[index];
    if (!got) return;
    check(got.phase === phase, `${label}: ${index + 1}번 그래프 phase가 ${got.phase}입니다.`);
    check(got.title === wanted.title, `${label}: ${index + 1}번 제목 '${got.title}' != '${wanted.title}'`);
    check(JSON.stringify(got.labels) === JSON.stringify(wanted.labels), `${label}: ${wanted.title} 항목 순서 불일치 (${got.labels.join("/")})`);
    check(got.values.length === wanted.values.length && got.values.every((value, valueIndex) => close(value, wanted.values[valueIndex])), `${label}: ${wanted.title} 구간 비율 불일치 (${got.values.join("/")})`);
    check(!got.values.length || close(sum(got.values), 100), `${label}: ${wanted.title} 구간 합이 100%가 아닙니다.`);
  });
}

function inspectCase(variant, data, generated, pool, difficulty) {
  const label = `${cases[variant].id}/d${difficulty}/p${pool}`;
  check(generated.answer === expectedAnswer(variant, data), `${label}: 별도 정답표와 출력 답 불일치 (${generated.answer})`);
  check(!generated.prompt.includes('data-phase="answer"') && !generated.prompt.includes("data-final-answer="), `${label}: 문제 DOM에 답 자료가 노출되었습니다.`);
  check(generated.prompt.includes('data-values=""'), `${label}: 문제의 숨은 답 자료가 비어 있지 않습니다.`);
  const expected = expectedVisuals(variant, data);
  compareGraphs(extractGraphs(generated.prompt), expected.problem, "problem", label);
  compareGraphs(extractGraphs(generated.answerVisual || ""), expected.answer, "answer", label);

  const answerGraphs = extractGraphs(generated.answerVisual || "");
  check(answerGraphs.length > 0 && answerGraphs.every(graph => graph.phase === "answer"), `${label}: 답안 그래프 phase 오류`);
  const answerTables = extractTables(generated.answerVisual || "");
  check(answerTables.every(table => table.phase === "answer"), `${label}: 답안 표 phase 오류`);
  if ((generated.answerVisual || "").includes("data-strip-guide=")) {
    check(((generated.answerVisual || "").match(/data-strip-guide=/g) || []).length >= 11, `${label}: 10% 눈금 누락`);
  }

  if (variant <= 1) {
    [...agreeLabels, ...opposeLabels].forEach(name => check(generated.prompt.includes(name), `${label}: 원문 항목명 누락 ${name}`));
    ["일자리 창출·인구 증가", "공공시설 증가", "지역 경제 활성", "공사 중 소음 발생", "환경 오염"].forEach(name => check(!generated.prompt.includes(name), `${label}: 대체 표현 잔존 ${name}`));
  }
  if (variant === 1) {
    const moved = data.total * data.oppose * data.opposeReasons[2] / 10000;
    check(data.opposeReasons[2] > 0 && Number.isInteger(moved), `${label}: 교통 체증 index=2 이동수 계약 오류`);
  }
  if (variant === 2) {
    check(sum(data.surname) === 100 && sum(data.branches) === 100, `${label}: 성씨 자료 합 오류`);
    check(Number.isInteger(data.totalMan * data.surname[0] * (data.branches[0] - data.branches[2]) / 10000), `${label}: 답이 정수 만 명이 아닙니다.`);
    check(((generated.answerVisual || "").match(/source61-e4-strip-segment is-solved/g) || []).length === 2, `${label}: 김해·광산 강조가 정확히 2개가 아닙니다.`);
  }
  if (variant === 3) ["피아노", "미술", "태권도"].forEach(name => check(generated.prompt.includes(name), `${label}: Example 4-2 항목 누락 ${name}`));
  if (variant === 5) {
    academyLabels.forEach(name => check(generated.prompt.includes(name), `${label}: Mission 2 항목 누락 ${name}`));
    check(!generated.prompt.includes("태권도"), `${label}: Mission 2에 태권도가 남았습니다.`);
  }
  if (variant === 7) {
    const model = scoreModel(data);
    check(new Set(model.rows.map(row => row.score)).size === 6, `${label}: 점수 열 중복`);
    const knownScores = [0, data.points[0], data.points[0] + data.points[1]];
    const expectedProblemRows = [["점수", "학생 수"], ...model.rows.map(row => [`${row.score}점`, knownScores.includes(row.score) ? String(row.count) : "□"])];
    const expectedAnswerRows = [["점수", "학생 수"], ...model.rows.map(row => [`${row.score}점`, String(row.count)])];
    const problemTables = extractTables(generated.prompt);
    check(problemTables.length === 1 && JSON.stringify(problemTables[0].rows) === JSON.stringify(expectedProblemRows), `${label}: 문제 표 셀 자료 불일치`);
    check(answerTables.length === 1 && JSON.stringify(answerTables[0].rows) === JSON.stringify(expectedAnswerRows), `${label}: 답 표 셀 자료 불일치`);
    check(close(model.rows.reduce((total, row) => total + row.score * row.count, 0) / data.total, model.average), `${label}: 가중합 평균 재검산 실패`);
  }
  if (variant === 8 && pool === 0) {
    const femaleTotal = data.femaleItem * 100 / data.femaleRate;
    const maleTotal = femaleTotal * data.male / data.female;
    check(data.maleItem === 104 && maleTotal === 325 && expectedAnswer(variant, data) === "32%", `${label}: 남학생 325명 중 104명 계약 오류`);
  }
}

const types = cases.map(entry => catalog.items.find(item => item.sourceItemId === entry.id));
check(types.every(Boolean), "E4 공개 9유형이 모두 분류표에 있어야 합니다.");
check(["6-1-u5-e4-example-3", "6-1-u5-e4-mission-3"].every(id => catalog.items.find(item => item.sourceItemId === id)?.reviewLocked), "E4 잠금 유형이 공개되었습니다.");

let generatedCount = 0;
types.forEach((type, variant) => {
  for (const difficulty of [-1, 0, 1]) {
    const seeds = new Map();
    for (let seed = 1; seed <= 1000 && seeds.size < 3; seed += 1) {
      const generated = api.generate(type, 0, difficulty, seed, type.variant);
      if (generated && !seeds.has(generated.verifiedPoolIndex)) seeds.set(generated.verifiedPoolIndex, seed);
    }
    check(seeds.size === 3, `${type.sourceItemId}/d${difficulty}: 고정 풀 3개를 찾지 못했습니다.`);
    for (const [pool, seed] of seeds) {
      try {
        const generated = api.generate(type, 0, difficulty, seed, type.variant);
        inspectCase(variant, cases[variant].pools[pool], generated, pool, difficulty);
        generatedCount += 1;
      } catch (error) {
        failures.push(`${type.sourceItemId}/d${difficulty}/p${pool}: ${error.message}`);
      }
    }
  }
});

if (failures.length) {
  console.error("6-1 5단원 E4 전수 감사 실패: " + failures.length + "건");
  console.error(failures.slice(0, 160).join("\n"));
  process.exit(1);
}
console.log("6-1 5단원 E4 전수 감사 통과: 별도 고정 정답표, 원문 항목·그래프·표, 9유형 × 3난이도 × 3고정 문항 = " + generatedCount + "개");
