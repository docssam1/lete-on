"use strict";

const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const dir = __dirname;
const failures = [];
const fail = message => failures.push(message);
const check = (condition, message) => { if (!condition) fail(message); };
const sourceIds = [
  "6-1-u6-e2-exploration", "6-1-u6-e2-example-1", "6-1-u6-e2-example-2", "6-1-u6-e2-example-3", "6-1-u6-e2-example-4", "6-1-u6-e2-mission-1",
  "6-1-u6-e2-mission-2", "6-1-u6-e2-mission-3", "6-1-u6-e2-mission-4", "6-1-u6-e2-mission-5"
];
const allResults = new Set();
const difficultyBodies = new Map();
const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(dir, "generators.js"), "utf8"), context, { filename: "generators.js" });
vm.runInContext(fs.readFileSync(path.join(dir, "source-inventory-grade6.js"), "utf8"), context, { filename: "source-inventory-grade6.js" });
vm.runInContext(fs.readFileSync(path.join(dir, "source-grade6-volume-e2.js"), "utf8"), context, { filename: "source-grade6-volume-e2.js" });
const generator = context.window.HSE_GENERATORS;
const type = sourceItemId => context.window.HSE_SOURCE_INVENTORY_GRADE6.items.find(item => item.sourceItemId === sourceItemId);
const normalize = value => String(value).replace(/,/g, "").replace(/\s+/g, "");
const factorTriples = n => {
  const result = [];
  for (let a = 1; a * a * a <= n; a += 1) for (let b = a; b * b <= n / a; b += 1) if (n % (a * b) === 0) result.push([a, b, n / (a * b)]);
  return result;
};
const congruentStairFacts = data => {
  const columnCount = data.heights.length;
  const maxLayers = Math.max(...data.heights);
  const profileCells = data.heights.reduce((sum, value) => sum + value, 0);
  const blockLength = data.length / columnCount;
  const blockDepth = data.depth / data.rows;
  const blockHeight = data.height / maxLayers;
  const occupied = new Set();
  data.heights.forEach((height, x) => { for (let y = 0; y < data.rows; y += 1) for (let z = 0; z < height; z += 1) occupied.add(`${x},${y},${z}`); });
  const faces = [
    [1, 0, 0, blockDepth * blockHeight], [-1, 0, 0, blockDepth * blockHeight],
    [0, 1, 0, blockLength * blockHeight], [0, -1, 0, blockLength * blockHeight],
    [0, 0, 1, blockLength * blockDepth], [0, 0, -1, blockLength * blockDepth]
  ];
  let surface = 0;
  occupied.forEach(cell => {
    const [x, y, z] = cell.split(",").map(Number);
    faces.forEach(([dx, dy, dz, area]) => { if (!occupied.has(`${x + dx},${y + dy},${z + dz}`)) surface += area; });
  });
  return { blockCount: occupied.size, blockVolume: blockLength * blockDepth * blockHeight, volume: occupied.size * blockLength * blockDepth * blockHeight, surface, profileCells, boundingCellCount: columnCount * data.rows * maxLayers };
};
const expected = {
  exploration: [[30, 24, 6], [28, 20, 4], [36, 26, 5]],
  "example-1": [12, 24, 36],
  "example-2": [
    { length: 8, depth: 3, height: 3, heights: [3, 2, 1], rows: 4 },
    { length: 9, depth: 4, height: 6, heights: [3, 2, 1], rows: 4 },
    { length: 12, depth: 6, height: 3, heights: [3, 2, 1], rows: 4 }
  ],
  "example-3": [
    { width: 36, totalDepth: 40, lowDepth: 16, highStart: 20, highEnd: 16, lowHeight: 8 },
    { width: 30, totalDepth: 30, lowDepth: 10, highStart: 22, highEnd: 18, lowHeight: 8 },
    { width: 42, totalDepth: 42, lowDepth: 14, highStart: 24, highEnd: 18, lowHeight: 9 }
  ],
  "example-4": [[3, 10, 4], [5, 9, 6], [7, 11, 5]],
  "mission-1": [48, 60, 72],
  "mission-2": [[110, 22, 14], [120, 24, 12], [96, 16, 8]],
  "mission-3": [10, 8, 12],
  "mission-4": [
    { boardLength: 25, boardDepth: 11, flatHeight: 1, cuboidLength: 10, cuboidDepth: 6, rightGap: 7, doubledHeight: 5 },
    { boardLength: 32, boardDepth: 12, flatHeight: 1, cuboidLength: 8, cuboidDepth: 6, rightGap: 8, doubledHeight: 7 },
    { boardLength: 28, boardDepth: 10, flatHeight: 1, cuboidLength: 8, cuboidDepth: 6, rightGap: 6, doubledHeight: 9 }
  ],
  "mission-5": [[8, 6, 12], [10, 7, 9], [12, 8, 10]]
};
const kindOf = id => id.endsWith("exploration") ? "exploration" : id.match(/e2-(example|mission)-(\d+)$/)?.slice(1).join("-");
const attr = (tag, name) => tag.match(new RegExp(`${name}=\"([^\"]*)\"`))?.[1] || "";
const svgTag = (markup, phase) => markup.match(new RegExp(`<svg[^>]*data-phase=\"${phase}\"[^>]*>`))?.[0] || "";
const textOnly = markup => String(markup).replace(/<svg[\s\S]*?<\/svg>/g, "").replace(/<span hidden[\s\S]*?<\/span>/g, "");
const learnerText = markup => String(markup).replace(/<style[\s\S]*?<\/style>/g, "").replace(/<[^>]*>/g, " ");
const coreProblemBody = markup => learnerText(String(markup)
  .replace(/<p[^>]*data-step-evidence[^>]*>[\s\S]*?<\/p>/g, "")
  .replace(/<svg[\s\S]*?<\/svg>/g, "")
  .replace(/<span hidden[\s\S]*?<\/span>/g, "")).replace(/\s+/g, " ").trim();
const forbiddenLearnerNotation = /a≤b≤c|a²|[VS][₁₂₃₄₅]|\b(?:s|h|a|V|S|N)\b|\d\s*[sah](?=\s|$|[=×()+\-0-9])/;
const forbiddenTechnicalLabels = /원문 유형|고정 풀|sourceItemId|6-1-u6-e2-/;

check(generator.generatorKey(type(sourceIds[0])) === "sourceGrade6VolumeE2", "E2 generatorKey 연결이 없습니다.");
sourceIds.forEach(sourceItemId => {
  check(type(sourceItemId) && Number.isInteger(type(sourceItemId).variant), `${sourceItemId}: 실제 공개 catalog type 또는 variant가 없습니다.`);
  check(JSON.stringify(type(sourceItemId)?.verifiedVariantProvenance) === JSON.stringify(["source-values", "source-structure-variant", "source-structure-variant"]), `${sourceItemId}: 풀별 원문·변형 관계가 기록되지 않았습니다.`);
});
for (const sourceItemId of sourceIds) {
  const kind = kindOf(sourceItemId);
  for (const difficulty of [-1, 0, 1]) {
    const seenPools = new Set();
    for (let pool = 0; pool < 3; pool += 1) {
      const generated = generator.generate(type(sourceItemId), 1, difficulty, 20260909 + pool, pool);
      const problemTag = svgTag(generated.prompt, "problem");
      const answerTag = svgTag(generated.answerVisual, "answer");
      const label = `${sourceItemId}/pool${pool}/difficulty${difficulty}`;
      check(generated.sourceItemId === sourceItemId, `${label}: sourceItemId가 바뀌었습니다.`);
      check(generated.generationMode === "fixed-verified-pool" && generated.verifiedVariantCount === 3, `${label}: fixed-verified-pool 계약이 없습니다.`);
      check(generated.verifiedPoolIndex === pool, `${label}: catalog type.variant보다 호출 인수 variant가 우선하지 않습니다.`);
      check(generated.variantProvenance === (pool === 0 ? "source-values" : "source-structure-variant"), `${label}: 원문 수치·원문 구조 변형 구분이 잘못되었습니다.`);
      check(!seenPools.has(generated.verifiedPoolIndex), `${label}: 풀이 중복되었습니다.`);
      seenPools.add(generated.verifiedPoolIndex);
      check(problemTag && answerTag, `${label}: 문제·정답 SVG가 없습니다.`);
      check(attr(problemTag, "data-model-key") === attr(answerTag, "data-model-key"), `${label}: 문제·정답 모델이 다릅니다.`);
      check(attr(problemTag, "data-source61-volume-e2-values") === attr(answerTag, "data-source61-volume-e2-values"), `${label}: 문제·정답 구조 데이터가 다릅니다.`);
      check(generated.answerVisual.includes(`data-answer-source=\"${sourceItemId}\"`), `${label}: 정답 출처 연결이 없습니다.`);
      check(!textOnly(generated.prompt).includes(generated.answer), `${label}: 문제에 정답 문자열이 노출되었습니다.`);
      check(!/<svg[^>]*data-phase=\"problem\"[^>]*>[\s\S]*?(?:답:|정답|=\s*\d+cm³|가지)/.test(generated.prompt), `${label}: 문제 SVG에 답·해결 배치가 노출되었습니다.`);
      check(!/(?:cm|m)\^[23]/.test([generated.prompt, generated.solution, generated.answerVisual].join("\n")), `${label}: caret 단위가 남았습니다.`);
      check(!/\d+\s*\/\s*\d+/.test([generated.prompt, generated.answerVisual].join("\n")), `${label}: 문제 또는 SVG에 slash 분수가 남았습니다.`);
      const visibleLearnerText = [generated.prompt, generated.solution, generated.answerVisual].map(learnerText).join("\n");
      check(!forbiddenLearnerNotation.test(visibleLearnerText), `${label}: 학습자 표시 영역에 문자식 기호가 남았습니다.`);
      check(!forbiddenTechnicalLabels.test(visibleLearnerText), `${label}: 학습자 표시 영역에 기술 라벨이 노출되었습니다.`);
      check(!/(전수 열거|전수로 찾습니다|계단형 직육면체 프리즘)/.test(visibleLearnerText), `${label}: 학생 표시 영역에 교정 전 전문 표현이 남았습니다.`);
      check(generated.answerVisual.includes(`data-answer-source=\"${sourceItemId}\"`) && generated.answerVisual.includes(`data-verified-pool-index=\"${pool}\"`), `${label}: 기술 증거 data-* 속성이 없습니다.`);
      if (difficulty === -1) check(generated.prompt.includes('data-step-evidence="guided"'), `${label}: 쉬움 안내가 없습니다.`);
      if (difficulty === 0) check(!generated.prompt.includes("data-step-evidence="), `${label}: 기준 단계에 안내가 섞였습니다.`);
      if (difficulty === 1) check(generated.prompt.includes('data-step-evidence="independent-reasoning"'), `${label}: 어려움 안내가 없습니다.`);
      const bodyKey = `${sourceItemId}:pool${pool}`;
      if (!difficultyBodies.has(bodyKey)) difficultyBodies.set(bodyKey, new Map());
      difficultyBodies.get(bodyKey).set(difficulty, coreProblemBody(generated.prompt));
      allResults.add(`${sourceItemId}:${pool}:${difficulty}:${generated.answer}`);

      if (kind === "exploration") {
        const [width, height, cut] = expected.exploration[pool];
        const volume = (width - 2 * cut) * (height - 2 * cut) * cut;
        const perimeter = 2 * (width + height);
        const difference = width - height;
        const promptText = learnerText(generated.prompt).replace(/\s+/g, " ");
        check(normalize(generated.answer) === normalize(`${volume}개`), `${label}: 1cm³ 블록 개수 독립 계산이 다릅니다.`);
        check(!generated.prompt.includes("상자의 부피") && !generated.answer.includes("cm³"), `${label}: exploration이 부피를 묻거나 답에 부피 단위를 포함합니다.`);
        check(generated.solution.includes(`${width - 2 * cut}×${height - 2 * cut}×${cut}`), `${label}: 절단 후 세 변 근거가 없습니다.`);
        check(promptText.includes("(상자의 두께는 생각하지 않습니다.)"), `${label}: 상자 두께 원문 조건이 없습니다.`);
        if (difficulty === -1) {
          check(promptText.includes(`접은 뒤 상자의 밑면은 가로 ${width - 2 * cut}cm, 세로 ${height - 2 * cut}cm`), `${label}: 쉬움 문제에 실제 밑면 두 길이가 없습니다.`);
          check(generated.solution.startsWith("접은 뒤 밑면 가로") && !generated.solution.includes(`${width}-2×${cut}`), `${label}: 쉬움 풀이가 주어진 밑면 대신 절단 계산부터 시작합니다.`);
        } else if (difficulty === 0) {
          check(promptText.includes(`가로 ${width}cm, 세로 ${height}cm`) && !promptText.includes("접은 뒤 상자의 밑면은"), `${label}: 기준 문제가 원본 종이 조건이 아닙니다.`);
          check(generated.solution.startsWith("접은 뒤 밑면은 가로"), `${label}: 기준 풀이 첫 단계가 종이에서 밑면 찾기가 아닙니다.`);
        } else {
          check(promptText.includes(`둘레가 ${perimeter}cm`) && promptText.includes(`가로가 세로보다 ${difference}cm 더 긴`), `${label}: 어려움 문제에 둘레·차 조건이 없습니다.`);
          check(!promptText.includes(`전체 가로 ${width}cm`) && !promptText.includes(`전체 세로 ${height}cm`), `${label}: 어려움 문제 그림에 원래 가로·세로 수가 노출됩니다.`);
          check(generated.solution.startsWith(`종이의 가로와 세로의 합은 ${perimeter}÷2=`) && generated.solution.indexOf("접은 뒤 밑면") > generated.solution.indexOf("가로와 세로의 합"), `${label}: 어려움 풀이가 둘레·차로 종이 두 길이를 먼저 구하지 않습니다.`);
        }
        ["paper-width-dimension", "paper-width-start", "paper-width-end", "paper-height-dimension", "paper-height-start", "paper-height-end", "cut-width-dimension", "cut-width-start", "cut-width-end", "cut-height-dimension", "cut-height-start", "cut-height-end"].forEach(role => check(generated.answerVisual.includes(`data-visual-element=\"${role}\"`), `${label}: ${role} 치수 요소가 없습니다.`));
      } else if (kind === "example-1" || kind === "mission-1") {
        const n = expected[kind][pool];
        const triples = factorTriples(n);
        const allDifferent = triples.filter(([a, b, c]) => a < b && b < c);
        const shortest = [...new Set(triples.map(([a]) => a))];
        const expectedAnswer = difficulty === 1 ? `전체 ${triples.length}가지, 세 변의 길이가 모두 다른 경우 ${allDifferent.length}가지` : `${triples.length}가지`;
        const promptText = learnerText(generated.prompt).replace(/\s+/g, " ");
        check(normalize(generated.answer) === normalize(expectedAnswer), `${label}: 난이도별 직육면체 답이 독립 계산과 다릅니다.`);
        check(generated.solution.includes(triples.map(item => item.join("×")).join(", ")), `${label}: 모든 인수 세쌍이 풀이에 없습니다.`);
        check(!`${generated.prompt}${generated.solution}`.includes("a≤b≤c") && `${generated.prompt}${generated.solution}${generated.answerVisual}`.includes("세 변의 길이를 작은 수부터 차례로"), `${label}: 인수 나열이 초등 표현으로 안내되지 않습니다.`);
        if (difficulty === -1) {
          check(promptText.includes(`가장 짧은 변으로 가능한 길이는 ${shortest.map(value => `${value}cm`).join(", ")}`), `${label}: 쉬움 문제에 가장 짧은 변 후보가 없습니다.`);
          check(generated.solution.startsWith("가장 짧은 변으로 가능한 길이가"), `${label}: 쉬움 풀이가 주어진 후보부터 시작하지 않습니다.`);
        } else if (difficulty === 0) {
          check(!promptText.includes("가장 짧은 변으로 가능한 길이는") && !promptText.includes("세 변의 길이가 모두 다른 경우의 수도"), `${label}: 기준 문제에 쉬움·어려움 조건이 섞였습니다.`);
          check(generated.solution.startsWith("세 변의 길이를 작은 수부터 차례로"), `${label}: 기준 풀이 첫 단계가 원본 조건과 다릅니다.`);
        } else {
          check(promptText.includes("전체 가지 수") && promptText.includes("세 변의 길이가 모두 다른 경우의 수도"), `${label}: 어려움 문제가 두 가지 수를 묻지 않습니다.`);
          check(generated.solution.startsWith("먼저 서로 다른 직육면체의 모든 경우") && generated.solution.includes(`세 변의 길이가 모두 다른 경우는 ${allDifferent.map(item => item.join("×")).join(", ")}`), `${label}: 어려움 풀이·분류 근거가 문제와 맞지 않습니다.`);
          check(generated.answerVisual.includes(`세 변의 길이가 모두 다른 경우 ${allDifferent.length}가지`), `${label}: 어려움 답 그림에 추가 답이 없습니다.`);
        }
        if (kind === "mission-1" && pool === 0 && difficulty !== 1) check(generated.answer === "9가지", `${label}: 원본 정육면체 48개 답이 9가지가 아닙니다.`);
      } else if (kind === "example-2") {
        const data = expected["example-2"][pool];
        const facts = congruentStairFacts(data);
        const frontBackArea = 2 * data.length * data.height * facts.profileCells / (data.heights.length * Math.max(...data.heights));
        const topBottomArea = 2 * data.length * data.depth;
        const stepEndArea = 2 * data.height * data.depth;
        const expectedAnswer = difficulty === 1
          ? `직육면체 ${facts.blockCount}개, 겉넓이 ${facts.surface}cm², 부피 ${facts.volume}cm³`
          : `겉넓이 ${facts.surface}cm², 부피 ${facts.volume}cm³`;
        const promptText = learnerText(generated.prompt).replace(/\s+/g, " ");
        check(attr(problemTag, "data-model-key") === "congruent-block-stair", `${label}: 같은 직육면체 계단 모델이 아닙니다.`);
        check(normalize(generated.answer) === normalize(expectedAnswer), `${label}: 계단 직육면체 답이 노출 면 전수 계산과 다릅니다.`);
        check(facts.blockCount === 24 && facts.volume === data.length * data.depth * data.height / facts.boundingCellCount * 24, `${label}: 3×4×3칸 중 24조각 부피 계산이 다릅니다.`);
        check(Math.abs(facts.surface - (frontBackArea + topBottomArea + stepEndArea)) < 1e-8, `${label}: 복셀 노출 면과 세 묶음 겉넓이 계산이 다릅니다.`);
        check(generated.solution.includes(`앞에서 본 계단은 ${data.heights.join("+")}=${facts.profileCells}칸`) && generated.solution.includes(`직육면체는 ${facts.profileCells}×${data.rows}=${facts.blockCount}개`), `${label}: 3·2·1층과 깊이 4줄의 조각 수 근거가 없습니다.`);
        check(generated.solution.includes(`겉넓이는 ${frontBackArea}+${topBottomArea}+${stepEndArea}=${facts.surface}cm²`), `${label}: 겉넓이의 독립 면 분해 근거가 없습니다.`);
        [generated.prompt, generated.answerVisual].forEach((markup, phaseIndex) => {
          ["congruent-stair-back-profile", "congruent-stair-top-face", "congruent-stair-riser-face", "congruent-stair-depth-grid", "congruent-stair-riser-grid", "congruent-stair-front-cell", "congruent-stair-profile-outline", "congruent-stair-length-dimension", "congruent-stair-height-dimension", "congruent-stair-depth-dimension"].forEach(role => check(markup.includes(`data-visual-element=\"${role}\"`), `${label}/${phaseIndex ? "답" : "문제"}: ${role}가 없습니다.`));
        });
        check((generated.prompt.match(/data-visual-element="congruent-stair-front-cell"/g) || []).length === 6, `${label}: 앞면 3+2+1칸이 정확히 여섯 칸이 아닙니다.`);
        check((generated.prompt.match(/data-visual-element="congruent-stair-depth-grid"/g) || []).length === 9, `${label}: 세 칸의 윗면이 깊이 4줄로 나뉘지 않았습니다.`);
        check(generated.answerVisual.includes('data-visual-element="congruent-stair-answer-card"'), `${label}: 답 그림의 계산 표가 없습니다.`);
        check(!promptText.includes("정육면체 24개") && promptText.includes("모양과 크기가 같은 직육면체"), `${label}: 원문의 직육면체 표현이 보존되지 않았습니다.`);
        if (difficulty === -1) {
          check(promptText.includes(`높은 쪽부터 ${data.heights.join("칸, ")}칸`) && promptText.includes(`깊이 방향은 ${data.rows}줄`), `${label}: 쉬움 문제에 앞면 칸과 깊이 줄 안내가 없습니다.`);
          check(generated.solution.startsWith(`앞면 ${data.heights.join("+")}칸과 깊이 ${data.rows}줄이 주어졌습니다.`), `${label}: 쉬움 풀이가 주어진 칸 안내부터 시작하지 않습니다.`);
        } else if (difficulty === 0) {
          check(promptText.includes(`직육면체 ${facts.blockCount}개`) && !promptText.includes("높은 쪽부터"), `${label}: 기준 문제가 원문의 24개 조건과 그림 해석을 보존하지 않았습니다.`);
          check(generated.solution.startsWith("그림을 앞면의 계단 칸과 뒤쪽 깊이 줄로 나누어 봅니다."), `${label}: 기준 풀이가 그림의 칸 읽기부터 시작하지 않습니다.`);
        } else {
          check(!promptText.includes(`직육면체 ${facts.blockCount}개`) && promptText.includes("사용한 직육면체의 수"), `${label}: 어려움 문제에서 조각 수를 직접 주거나 묻지 않습니다.`);
          check(generated.solution.startsWith("먼저 그림의 칸을 빠짐없이 셉니다."), `${label}: 어려움 풀이가 그림에서 조각 수를 찾는 단계부터 시작하지 않습니다.`);
        }
        if (pool === 0) check(generated.answer === (difficulty === 1 ? "직육면체 24개, 겉넓이 98cm², 부피 48cm³" : "겉넓이 98cm², 부피 48cm³"), `${label}: 원문 8×3×3 계단 답이 98cm²·48cm³가 아닙니다.`);
      } else if (kind === "example-3") {
        const data = expected["example-3"][pool];
        const highDepth = data.totalDepth - data.lowDepth;
        const highCrossSection = highDepth * (data.highStart + data.highEnd) / 2;
        const lowCrossSection = data.lowDepth * data.lowHeight;
        const finalHeight = (highCrossSection + lowCrossSection) / data.totalDepth;
        const cutCrossSection = highDepth * ((data.highStart - finalHeight) + (data.highEnd - finalHeight)) / 2;
        const fillCrossSection = data.lowDepth * (finalHeight - data.lowHeight);
        const candidates = [];
        for (let candidate = data.lowHeight + 1; candidate < data.highEnd; candidate += 1) {
          const cut = highDepth * ((data.highStart - candidate) + (data.highEnd - candidate)) / 2;
          const fill = data.lowDepth * (candidate - data.lowHeight);
          if (cut === fill) candidates.push(candidate);
        }
        const promptText = learnerText(generated.prompt).replace(/\s+/g, " ");
        check(attr(problemTag, "data-model-key") === "earthwork-leveling", `${label}: 흙 고르기 점·선분 모델이 아닙니다.`);
        check(Number.isInteger(finalHeight) && normalize(generated.answer) === normalize(`${finalHeight}m`), `${label}: 전체 부피를 전체 밑면으로 나눈 높이가 다릅니다.`);
        check(cutCrossSection === fillCrossSection && JSON.stringify(candidates) === JSON.stringify([finalHeight]), `${label}: 깎은 양과 채운 양이 같아지는 자연수 높이가 하나가 아닙니다.`);
        check(generated.solution.includes(`높은 부분의 깊이는 ${data.totalDepth}-${data.lowDepth}=${highDepth}m`) || generated.solution.startsWith(`높은 부분의 깊이는 ${highDepth}m로 주어졌습니다.`), `${label}: 높은 부분 깊이 근거가 없습니다.`);
        check(generated.solution.includes(`${highDepth}×(${data.highStart}+${data.highEnd})÷2=${highCrossSection}m²`) && generated.solution.includes(`${data.lowDepth}×${data.lowHeight}=${lowCrossSection}m²`), `${label}: 사다리꼴·직사각형 단면 계산이 없습니다.`);
        check(generated.solution.includes(`(${highCrossSection}+${lowCrossSection})÷${data.totalDepth}=${finalHeight}m`) && generated.solution.includes(`각각 ${cutCrossSection}m²로 같습니다`), `${label}: 부피 보존과 깎기·채우기 재검산이 없습니다.`);
        const roles = [
          "earthwork-back-profile", "earthwork-high-top", "earthwork-low-top", "earthwork-cliff", "earthwork-end-face", "earthwork-front-profile",
          "earthwork-total-depth-dimension", "earthwork-low-depth-dimension", "earthwork-high-start-height-dimension",
          "earthwork-high-end-height-dimension", "earthwork-low-height-dimension", "earthwork-width-dimension"
        ];
        [generated.prompt, generated.answerVisual].forEach((markup, phaseIndex) => roles.forEach(role => check(markup.includes(`data-visual-element=\"${role}\"`), `${label}/${phaseIndex ? "답" : "문제"}: ${role}가 없습니다.`)));
        ["earthwork-cut-area", "earthwork-fill-area", "earthwork-final-level", "earthwork-answer-card"].forEach(role => check(generated.answerVisual.includes(`data-visual-element=\"${role}\"`), `${label}: 답 그림의 ${role}가 없습니다.`));
        check(!generated.prompt.includes("깎은 단면") && !generated.prompt.includes(`${finalHeight}m`), `${label}: 문제에 최종 높이 또는 재검산 값이 노출되었습니다.`);
        if (difficulty === -1) {
          check(promptText.includes(`높은 부분의 깊이는 ${highDepth}m`) && !promptText.includes(`전체 깊이가 ${data.totalDepth}m`), `${label}: 쉬움 문제에 계산된 높은 부분 깊이가 없습니다.`);
          check(generated.solution.startsWith(`높은 부분의 깊이는 ${highDepth}m로 주어졌습니다.`), `${label}: 쉬움 풀이가 주어진 깊이부터 시작하지 않습니다.`);
        } else if (difficulty === 0) {
          check(promptText.includes(`폭이 ${data.width}m`) && promptText.includes(`전체 깊이가 ${data.totalDepth}m`) && promptText.includes(`낮은 부분은 깊이 ${data.lowDepth}m`), `${label}: 기준 문제가 원본의 폭·전체 깊이·낮은 부분 깊이를 보존하지 않습니다.`);
          check(generated.solution.startsWith(`높은 부분의 깊이는 ${data.totalDepth}-${data.lowDepth}=${highDepth}m입니다.`), `${label}: 기준 풀이가 깊이의 차부터 시작하지 않습니다.`);
        } else {
          check(promptText.includes("모든 부분의 폭은 같습니다") && !promptText.includes(`폭이 ${data.width}m`), `${label}: 어려움 문제가 공통 폭만 주고 수치를 숨기지 않습니다.`);
          check(generated.solution.startsWith("폭은 모든 부분에서 같으므로 옆에서 본 단면 넓이를"), `${label}: 어려움 풀이가 공통 폭을 없애는 생각부터 시작하지 않습니다.`);
        }
        if (pool === 0) check(generated.answer === "14m" && highDepth === 24 && highCrossSection === 432 && lowCrossSection === 128 && cutCrossSection === 96, `${label}: 원본 20m·16m·8m·40m·16m 조건의 답과 재검산이 다릅니다.`);
      } else if (kind === "example-4") {
        const [width, depth, height] = expected["example-4"][pool];
        const ropeA = 2 * (depth + height);
        const ropeB = 2 * (width + height);
        const horizontalRope = 2 * (width + depth);
        const ropeC = ropeB + horizontalRope;
        const candidates = [];
        for (let candidateWidth = 1; candidateWidth < ropeC; candidateWidth += 1) {
          for (let candidateDepth = 1; candidateDepth < ropeC; candidateDepth += 1) {
            for (let candidateHeight = 1; candidateHeight < ropeC; candidateHeight += 1) {
              if (2 * (candidateDepth + candidateHeight) === ropeA && 2 * (candidateWidth + candidateHeight) === ropeB && ropeB + 2 * (candidateWidth + candidateDepth) === ropeC) candidates.push([candidateWidth, candidateDepth, candidateHeight]);
            }
          }
        }
        const volume = width * depth * height;
        const promptText = learnerText(generated.prompt).replace(/\s+/g, " ");
        check(attr(problemTag, "data-model-key") === "two-loop-rope-box", `${label}: 예제 4가 두 고리 상자 모델이 아닙니다.`);
        check(normalize(generated.answer) === normalize(`${volume}cm³`), `${label}: 두 고리 끈 부피가 독립 계산과 다릅니다.`);
        check(JSON.stringify(candidates) === JSON.stringify([[width, depth, height]]), `${label}: 두 고리 끈 조건의 자연수 해가 하나가 아닙니다: ${JSON.stringify(candidates)}`);
        check(generated.solution.includes(`다에서는 나의 고리 ${ropeB}cm를 빼면 수평 고리는 ${ropeC}-${ropeB}=${horizontalRope}cm`) || generated.solution.includes(`다의 끈에는 나의 고리 ${ropeB}cm가 함께 들어 있습니다.`) || generated.solution.includes(`다의 끈은 나의 고리와 수평 고리 두 개로 되어 있으므로 수평 고리는 ${ropeC}-${ropeB}=${horizontalRope}cm`), `${label}: 다의 두 고리 분해 풀이가 없습니다.`);
        check(generated.solution.includes(`가로는 (${ropeB / 2}+${horizontalRope / 2}-${ropeA / 2})÷2=${width}cm, 깊이는 ${horizontalRope / 2}-${width}=${depth}cm, 높이는 ${ropeB / 2}-${width}=${height}cm`), `${label}: 세 변을 찾는 실제 수 풀이가 없습니다.`);
        const ropeRoles = ["box-a-depth-height-visible", "box-a-depth-height-hidden", "box-b-width-height-visible", "box-b-width-height-hidden", "box-c-width-height-visible", "box-c-width-height-hidden", "box-c-width-depth-visible", "box-c-width-depth-hidden"];
        [generated.prompt, generated.answerVisual].forEach((markup, phaseIndex) => ropeRoles.forEach(role => check((markup.match(new RegExp(`data-visual-element=\\"${role}\\"`, "g")) || []).length === 1, `${label}/${phaseIndex ? "답" : "문제"}: ${role} 끈 경로가 정확히 하나가 아닙니다.`)));
        ["two-loop-width-dimension", "two-loop-height-dimension", "two-loop-depth-dimension", "two-loop-answer-card"].forEach(role => check((generated.answerVisual.match(new RegExp(`data-visual-element=\\"${role}\\"`, "g")) || []).length === 1, `${label}: 답 그림의 ${role}가 없습니다.`));
        check((generated.prompt.match(/data-rope-loop="width-height"/g) || []).length === 4 && (generated.prompt.match(/data-rope-loop="width-depth"/g) || []).length === 2, `${label}: 셋째 그림의 두 고리 계약이 아닙니다.`);
        check(!generated.prompt.includes(`가로 ${width}cm`) && !generated.prompt.includes(`깊이 ${depth}cm`) && !generated.prompt.includes(`높이 ${height}cm`), `${label}: 문제 그림에 답 치수가 노출되었습니다.`);
        check(promptText.includes("(단, 매듭의 길이는 생각하지 않습니다.)"), `${label}: 원문의 매듭 길이 제외 조건이 없습니다.`);
        if (difficulty === -1) {
          check(promptText.includes("가의 끈은 깊이와 높이를 한 바퀴") && promptText.includes("수평 고리로 되어 있습니다") && generated.solution.startsWith(`가의 끈 길이의 절반은 ${ropeA}÷2=`), `${label}: 쉬움의 고리 안내 또는 첫 풀이가 다릅니다.`);
        } else if (difficulty === 0) {
          check(promptText.includes(`그림과 같이 ${ropeA}cm, ${ropeB}cm, ${ropeC}cm`) && !promptText.includes("다에는 나의 고리"), `${label}: 기준 문제가 원문의 세 끈 길이만 제시하지 않습니다.`);
          check(generated.solution.startsWith("가의 끈은 깊이와 높이를"), `${label}: 기준 풀이가 보이는 고리 해석부터 시작하지 않습니다.`);
        } else {
          check(promptText.includes("다에는 나의 고리가 함께 들어") && generated.solution.startsWith(`다의 끈에는 나의 고리 ${ropeB}cm가 함께 들어 있습니다.`), `${label}: 어려움의 공통 고리 조건 또는 첫 풀이가 다릅니다.`);
        }
        if (pool === 0) check(generated.answer === "120cm³" && ropeA === 28 && ropeB === 14 && ropeC === 40 && JSON.stringify(candidates) === JSON.stringify([[3, 10, 4]]), `${label}: 원문 28cm·14cm·40cm의 120cm³ 계약이 다릅니다.`);
      } else if (kind === "mission-2") {
        const [rope, cubeLeft, cuboidLeft] = expected["mission-2"][pool];
        const s = (rope - cubeLeft) / 8;
        const h = ((rope - cuboidLeft) - 6 * s) / 2;
        const volume = s * s * h;
        const cubeUsed = rope - cubeLeft;
        const cuboidUsed = rope - cuboidLeft;
        const usedDifference = cuboidUsed - cubeUsed;
        const promptText = learnerText(generated.prompt).replace(/\s+/g, " ");
        check(normalize(generated.answer) === normalize(`${volume}cm³`), `${label}: 끈 식 역검산이 다릅니다.`);
        check((8 * s + cubeLeft) === rope && (6 * s + 2 * h + cuboidLeft) === rope, `${label}: 두 상자의 두 고리 끈 길이가 역검산되지 않습니다.`);
        check(generated.solution.includes(`가의 밑면 한 변은 ${cubeUsed}÷8=${s}cm`) && generated.solution.includes(`높이는 (${cuboidUsed}-6×${s})÷2=${h}cm`), `${label}: 실제 수를 넣은 두 끈 경로 풀이가 없습니다.`);
        [generated.prompt, generated.answerVisual].forEach((markup, phaseIndex) => ["cube-continuous-rope", "cuboid-continuous-rope"].forEach(role => {
          const paths = markup.match(new RegExp(`<path[^>]*data-visual-element=\"${role}\"[^>]*>`, "g")) || [];
          check(paths.length === 1, `${label}/${phaseIndex ? "답" : "문제"}: ${role} 단일 경로가 정확히 하나가 아닙니다.`);
          const d = paths[0] ? attr(paths[0], "d") : "";
          const join = paths[0] ? attr(paths[0], "data-rope-join").replace(",", " ") : "";
          const commands = d.match(/[A-Za-z]/g) || [];
          check((d.match(/[Mm]/g) || []).length === 1 && commands.every(command => /[ML]/i.test(command)) && join && d.split(join).length >= 4, `${label}: ${role}가 중앙 매듭에서 두 방향으로 이어진 직선 경로가 아닙니다.`);
          check(attr(paths[0] || "", "data-rope-style") === "surface-cross" && attr(paths[0] || "", "data-rope-loop-count") === "2", `${label}: ${role}의 표면 십자 경로 계약이 없습니다.`);
          const knotRole = role.replace("-continuous-rope", "-rope-knot");
          check((markup.match(new RegExp(`<circle[^>]*data-visual-element=\"${knotRole}\"[^>]*>`, "g")) || []).length === 1, `${label}: ${knotRole}가 정확히 하나가 아닙니다.`);
        }));
        check(!/(?:cube|cuboid)-(?:base|vertical)-loop/.test(`${generated.prompt}${generated.answerVisual}`), `${label}: 분리된 끈 경로가 남았습니다.`);
        check(!generated.prompt.includes("가로 둘레 4×") && !generated.prompt.includes("위아래 둘레 2×"), `${label}: 기준 문제 그림에 풀이 공식이 노출되었습니다.`);
        check(promptText.includes("(단, 매듭의 길이는 생각하지 않습니다.)"), `${label}: 원문의 매듭 길이 제외 조건이 없습니다.`);
        if (difficulty === -1) {
          check(promptText.includes(`가에서 실제 사용한 끈은 ${cubeUsed}cm`) && promptText.includes(`나에서 실제 사용한 끈은 ${cuboidUsed}cm`) && !promptText.includes("남은 끈"), `${label}: 쉬움 문제의 실제 사용 길이 조건이 잘못되었습니다.`);
          check(generated.solution.startsWith(`가에서 사용한 끈은 ${cubeUsed}cm, 나에서 사용한 끈은 ${cuboidUsed}cm로 주어졌습니다.`) && !generated.solution.includes(`${rope}-${cubeLeft}`), `${label}: 쉬움 풀이가 이미 주어진 사용 길이 대신 뺄셈부터 시작합니다.`);
        } else if (difficulty === 0) {
          check(promptText.includes(`가에서 남은 끈은 ${cubeLeft}cm`) && promptText.includes(`나에서 남은 끈은 ${cuboidLeft}cm`), `${label}: 기준 문제의 두 남은 끈 조건이 없습니다.`);
          check(generated.solution.startsWith("가의 전체 끈에서 남은 끈을 빼면"), `${label}: 기준 풀이가 남은 끈 조건부터 시작하지 않습니다.`);
        } else {
          check(promptText.includes(`가에서 남은 끈은 ${cubeLeft}cm`) && promptText.includes(`나는 가보다 사용한 끈이 ${usedDifference}cm 더 깁니다`) && !promptText.includes("나에서 남은 끈"), `${label}: 어려움 문제의 차이 조건이 잘못되었습니다.`);
          check(generated.solution.startsWith(`가에서 사용한 끈은 ${rope}-${cubeLeft}=${cubeUsed}cm입니다.`) && generated.solution.includes(`나에서 사용한 끈은 ${cubeUsed}+${usedDifference}=${cuboidUsed}cm`) && !generated.solution.includes(`${rope}-${cuboidLeft}`), `${label}: 어려움 풀이가 차이로 나의 사용 길이를 먼저 구하지 않습니다.`);
        }
      } else if (kind === "mission-4") {
        const data = expected["mission-4"][pool];
        const cubeSide = data.boardDepth - data.cuboidDepth;
        const totalVolume = data.boardLength * data.boardDepth * data.flatHeight;
        const cubeVolume = cubeSide ** 3;
        const baseArea = data.cuboidLength * data.cuboidDepth;
        const remainingVolume = totalVolume - cubeVolume;
        const doubledHeight = 2 * remainingVolume / baseArea;
        const expectedAnswer = `${Math.floor(doubledHeight / 2)} 1/2cm`;
        const cubeX = 0;
        const cubeY = data.cuboidDepth;
        const cuboidX = data.boardLength - data.rightGap - data.cuboidLength;
        const nonOverlapping = cubeX + cubeSide <= cuboidX || cuboidX + data.cuboidLength <= cubeX || cubeY + cubeSide <= 0 || data.cuboidDepth <= cubeY;
        const promptText = learnerText(generated.prompt).replace(/\s+/g, " ");
        check(attr(problemTag, "data-model-key") === "soil-solids-flattened-volume", `${label}: 흙을 고르게 편 부피 보존 모델이 아닙니다.`);
        check(type(sourceItemId).commonTypeId === "soil-solids-flattened-volume-height", `${label}: mission-4의 세부 유형 ID가 평평하게 펴기 전 높이 유형과 다릅니다.`);
        check(Number.isInteger(doubledHeight) && doubledHeight === data.doubledHeight && remainingVolume * 2 === baseArea * doubledHeight, `${label}: 높이의 정확한 유리수 부피 등식이 다릅니다.`);
        check(cubeSide > 0 && cubeVolume < totalVolume && cuboidX >= 0 && cuboidX + data.cuboidLength + data.rightGap === data.boardLength && cubeY + cubeSide <= data.boardDepth && data.cuboidDepth <= data.boardDepth && nonOverlapping, `${label}: 판 위 가·나 배치가 맞지 않거나 겹칩니다.`);
        check(normalize(generated.answer) === normalize(expectedAnswer), `${label}: 나의 높이가 정확한 대분수 답과 다릅니다.`);
        check(generated.solution.includes(`${data.boardLength}×${data.boardDepth}×${data.flatHeight}=${totalVolume}cm³`) && generated.solution.includes(`${data.boardDepth}-${data.cuboidDepth}=${cubeSide}cm`) && generated.solution.includes(`${cubeSide}×${cubeSide}×${cubeSide}=${cubeVolume}cm³`) && generated.solution.includes(`${data.cuboidLength}×${data.cuboidDepth}=${baseArea}cm²`) && generated.solution.includes(`${totalVolume}-${cubeVolume}=${remainingVolume}cm³`) && generated.solution.includes(`${remainingVolume}÷${baseArea}=${expectedAnswer}`), `${label}: 전체 흙·가의 한 변·가의 부피·나의 밑면 넓이·남은 부피·나눗셈 풀이가 없습니다.`);
        check((generated.solution.match(/나의 높이는/g) || []).length === 1, `${label}: 계산된 나의 높이가 하나로 정해지지 않았습니다.`);
        [generated.prompt, generated.answerVisual].forEach((markup, phaseIndex) => ["initial-board-plan", "soil-cube-front-face", "soil-cuboid-front-face", "right-gap-dimension", "cuboid-length-dimension", "cuboid-depth-dimension", "flattened-board-plan", "flattened-soil-top-face", "flattened-height-dimension"].forEach(role => check(markup.includes(`data-visual-element=\"${role}\"`), `${label}/${phaseIndex ? "답" : "문제"}: ${role} 시각 역할이 없습니다.`)));
        ["cuboid-height-mixed-fraction", "cuboid-height-whole", "cuboid-height-numerator", "cuboid-height-fraction-bar", "cuboid-height-denominator", "cuboid-height-unit", "soil-volume-answer-card"].forEach(role => check(generated.answerVisual.includes(`data-visual-element=\"${role}\"`), `${label}: 정답 SVG의 ${role} 역할이 없습니다.`));
        check(!/\d+\s*\/\s*\d+/.test(generated.answerVisual), `${label}: 정답 SVG 라벨에 raw slash 분수가 남았습니다.`);
        check(!textOnly(generated.prompt).includes(`가의 한 변: ${cubeSide}cm`) && !textOnly(generated.prompt).includes(`나의 높이: ${expectedAnswer}`) && !textOnly(generated.prompt).includes(`남은 부피: ${remainingVolume}cm³`), `${label}: 문제에 가의 한 변·나의 높이·남은 부피가 새어 나왔습니다.`);
        if (difficulty === -1) check(promptText.includes(`나의 밑면은 가로 ${data.cuboidLength}cm, 세로 ${data.cuboidDepth}cm`) && generated.prompt.includes('data-step-evidence="guided"') && generated.prompt.includes(`${data.boardDepth}-${data.cuboidDepth}으로 가의 한 변`), `${label}: 쉬움의 한 변·전체 부피 첫 단계 안내가 없습니다.`);
        if (difficulty === 0) check(!promptText.includes("나의 밑면은") && !generated.prompt.includes("data-step-evidence="), `${label}: 기준 문제에 쉬움 힌트 또는 답 밑면이 섞였습니다.`);
        if (difficulty === 1) check(promptText.includes("가의 한 변이나 나의 밑면 넓이는 직접 알려주지 않았습니다") && generated.prompt.includes('data-step-evidence="independent-reasoning"') && !promptText.includes("나의 밑면은"), `${label}: 어려움의 그림 치수 추론 조건이 없습니다.`);
        if (pool === 0) check(doubledHeight === 5 && generated.answer === "2 1/2cm" && totalVolume === 275 && cubeVolume === 125 && remainingVolume === 150, `${label}: 원문 5/2cm와 275·125·150 부피 계약이 다릅니다.`);
      } else if (kind === "mission-5") {
        const [width, height, depth] = expected["mission-5"][pool];
        const ropeA = 2 * (depth + height);
        const ropeB = 2 * (width + height);
        const ropeC = 4 * (width + height + depth);
        const sideSum = ropeC / 4;
        const hardDifference = ropeC - ropeA - ropeB;
        const candidates = [];
        for (let candidateWidth = 1; candidateWidth < sideSum; candidateWidth += 1) {
          for (let candidateHeight = 1; candidateHeight < sideSum - candidateWidth; candidateHeight += 1) {
            const candidateDepth = sideSum - candidateWidth - candidateHeight;
            if (2 * (candidateDepth + candidateHeight) === ropeA && 2 * (candidateWidth + candidateHeight) === ropeB) candidates.push([candidateWidth, candidateHeight, candidateDepth]);
          }
        }
        const volume = width * height * depth;
        const promptText = learnerText(generated.prompt).replace(/\s+/g, " ");
        check(normalize(generated.answer) === normalize(`${volume}cm³`), `${label}: 세 끈 부피가 독립 계산과 다릅니다.`);
        check(JSON.stringify(candidates) === JSON.stringify([[width, height, depth]]), `${label}: 세 끈 조건의 자연수 해가 하나가 아닙니다: ${JSON.stringify(candidates)}`);
        check(generated.solution.includes(`가로는 ${sideSum}-${ropeA / 2}=${width}cm`) && generated.solution.includes(`세로는 ${sideSum}-${ropeB / 2}=${depth}cm`) && generated.solution.includes(`높이는 ${sideSum}-${width}-${depth}=${height}cm`), `${label}: 세 변을 찾는 실제 수 풀이가 없습니다.`);
        ["box-a-depth-height-visible", "box-a-depth-height-hidden", "box-b-width-height-visible", "box-b-width-height-hidden", "box-c-depth-height-visible", "box-c-depth-height-hidden", "box-c-width-height-visible", "box-c-width-height-hidden", "box-c-width-depth-visible", "box-c-width-depth-hidden"].forEach(role => check(generated.answerVisual.includes(`data-visual-element=\"${role}\"`), `${label}: ${role} 끈 경로가 없습니다.`));
        ["box-width-dimension", "box-height-dimension", "box-depth-dimension"].forEach(role => check(generated.answerVisual.includes(`data-visual-element=\"${role}\"`), `${label}: 답 그림의 ${role} 치수 근거가 없습니다.`));
        check(promptText.includes("(단, 매듭의 길이는 생각하지 않습니다.)"), `${label}: 원문의 매듭 길이 제외 조건이 없습니다.`);
        if (difficulty === -1) {
          check(promptText.includes("가의 끈은 세로와 높이의 합의 2배") && promptText.includes("다의 세 방향 끈은 가로·세로·높이의 합의 4배"), `${label}: 쉬움 문제에 세 끈의 방향별 뜻이 없습니다.`);
          check(generated.solution.startsWith(`가의 끈 길이의 절반은 ${ropeA}÷2=`), `${label}: 쉬움 풀이가 주어진 끈 해석부터 시작하지 않습니다.`);
        } else if (difficulty === 0) {
          check(promptText.includes(`각각 ${ropeA}cm, ${ropeB}cm, ${ropeC}cm`) && !promptText.includes("합보다"), `${label}: 기준 문제가 원문의 세 끈 길이를 그대로 제시하지 않습니다.`);
          check(generated.solution.startsWith("가의 끈은 세로와 높이를 각각 두 번 지나므로"), `${label}: 기준 풀이가 원문 끈 경로 해석부터 시작하지 않습니다.`);
        } else {
          check(promptText.includes(`각각 ${ropeA}cm, ${ropeB}cm`) && promptText.includes(`합보다 ${hardDifference}cm 더 깁니다`) && !promptText.includes(`사용한 끈 ${ropeC}cm`), `${label}: 어려움 문제의 세 번째 끈 관계가 잘못되었습니다.`);
          check(generated.solution.startsWith(`다에서 사용한 끈은 ${ropeA}+${ropeB}+${hardDifference}=${ropeC}cm입니다.`), `${label}: 어려움 풀이가 세 번째 끈 길이 계산부터 시작하지 않습니다.`);
        }
        if (pool === 0) check(generated.answer === "576cm³", `${label}: 원문 세 끈 상자 부피가 576cm³가 아닙니다.`);
      } else {
        const unit = expected["mission-3"][pool];
        const depth = 5 * unit;
        const layerVolumes = [1, 2, 3, 4, 5].map(layer => layer * unit * unit * depth);
        const volumeByLayers = layerVolumes.reduce((sum, value) => sum + value, 0);
        const volumeByPrism = 15 * unit * unit * depth;
        const surfaceByFaces = 2 * 15 * unit * unit + 20 * unit * depth;
        check(normalize(generated.answer) === normalize(`부피 ${volumeByLayers}cm³, 겉넓이 ${surfaceByFaces}cm²`), `${label}: 계단 부피·겉넓이 공식이 다릅니다.`);
        check(volumeByLayers === volumeByPrism && surfaceByFaces === 130 * unit * unit, `${label}: 계단 두 방식 계산이 일치하지 않습니다.`);
        layerVolumes.forEach(value => check(`${generated.solution}${generated.answerVisual}`.includes(String(value)), `${label}: 층별 부피 ${value} 근거가 없습니다.`));
        ["stair-front-face", "stair-back-face", "stair-top-face", "stair-side-face", "stair-depth-edge", "unit-dimension", "width-dimension", "height-dimension", "depth-dimension"].forEach(role => check(generated.answerVisual.includes(`data-visual-element=\"${role}\"`), `${label}: ${role} 입체 요소가 없습니다.`));
        check(generated.answerVisual.includes('data-visual-element="cross-section-perimeter-20-cells"') && generated.answerVisual.includes('data-cell-count="20"'), `${label}: 답 그림에 단면 바깥 둘레 20칸 강조가 없습니다.`);
        const promptText = learnerText(generated.prompt).replace(/\s+/g, " ");
        if (difficulty === -1) {
          check(promptText.includes("앞면 칸 수는 차례로 1칸, 2칸, 3칸, 4칸, 5칸"), `${label}: 쉬움 문제에 앞면 칸 수가 없습니다.`);
          check(generated.solution.startsWith("높이가 1층부터 5층인 다섯 부분의 앞면 칸 수가"), `${label}: 쉬움 풀이가 주어진 앞면 칸 수부터 시작하지 않습니다.`);
        } else if (difficulty === 0) {
          check(promptText.includes(`깊이가 ${depth}cm`) && promptText.includes(`${unit}cm씩 다섯 칸`), `${label}: 기준 문제의 실제 한 칸·깊이 조건이 없습니다.`);
          check(generated.solution.startsWith("앞면을 살펴보면"), `${label}: 기준 풀이가 계단 앞면 읽기부터 시작하지 않습니다.`);
        } else {
          check(promptText.includes(`전체 가로 ${5 * unit}cm를 똑같이 5등분`) && promptText.includes("깊이는 전체 가로와 같습니다"), `${label}: 어려움 문제의 5등분·깊이 관계가 없습니다.`);
          check(!promptText.includes(`한 칸 ${unit}cm`) && !promptText.includes(`깊이 ${depth}cm`), `${label}: 어려움 문제 그림에 한 칸·깊이 수가 직접 노출됩니다.`);
          check(generated.solution.startsWith(`전체 가로 ${5 * unit}cm를 5등분했으므로 한 칸은 ${5 * unit}÷5=${unit}cm입니다. 깊이는 전체 가로와 같으므로 ${depth}cm입니다.`), `${label}: 어려움 풀이가 5등분과 깊이 관계로 먼저 값을 구하지 않습니다.`);
        }
      }
    }
    check(seenPools.size === 3, `${sourceItemId}/difficulty${difficulty}: 3개 풀이 모두 생성되지 않았습니다.`);
  }
}
check(allResults.size === sourceIds.length * 3 * 3, `전체 고정 풀·난이도 결과 수가 ${sourceIds.length * 3 * 3}개가 아닙니다: ${allResults.size}`);
difficultyBodies.forEach((bodies, label) => {
  check(bodies.size === 3, `${label}: 세 난이도 문제 본문을 모두 모으지 못했습니다.`);
  check(new Set(bodies.values()).size === 3, `${label}: 힌트 문장을 제거하면 세 난이도 문제 본문이 구조적으로 같아집니다.`);
});
if (failures.length) {
  console.error(`6-1 부피 개념탐구 2 수학 감사 실패: ${failures.length}건`);
  console.error(failures.slice(0, 120).join("\n"));
  process.exit(1);
}
console.log(`6-1 부피 개념탐구 2 수학 감사 통과: ${sourceIds.length}유형 × 3풀 × 3난이도, 인수 전수 열거·24개 직육면체 노출 면·흙 부피 보존·두 끈 역검산·두 고리 단일해·세 끈 단일해·계단 두 공식·문제/정답 분리 확인`);
