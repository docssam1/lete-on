(() => {
  "use strict";

  const api = window.HSE_GENERATORS;
  if (!api) throw new Error("개념탐구 6 텍스트 생성기에는 HSE_GENERATORS가 필요합니다.");

  const fmt = value => Number(value).toFixed(3).replace(/\.?0+$/, "");
  const positive = (...values) => {
    if (values.some(value => !Number.isFinite(value) || value <= 0)) throw new Error("양수 조건을 만족하지 않습니다.");
  };
  const people = (...values) => {
    positive(...values);
    if (values.some(value => !Number.isInteger(value))) throw new Error("학생 수는 양의 정수여야 합니다.");
  };
  const table = (rows, answer) => `<table class="problem-table source62-e6-text-answer-table" data-phase="answer"><thead><tr><th scope="col">항목</th><th scope="col">값</th></tr></thead><tbody>${[...rows, ["답", answer]].map(([label, value]) => `<tr><th scope="row">${label}</th><td>${value}</td></tr>`).join("")}</tbody></table>`;
  const freezePools = rows => Object.freeze(rows.map(row => Object.freeze(row)));

  // Integer lengths are hundredths of a metre, weights tenths of a kg, heights thousandths of a metre.
  const definitions = [
    {
      suffix: "example-4", key: "sourceGrade6SecondDecimalDivisionE6Example4Text",
      pools: freezePools([[800, 700], [400, 600], [1200, 900]]),
      designs: ["last-gender-counts-given", "source-opposite-yearly-changes", "current-total-from-yearly-increase"],
      steps: [3, 8, 9],
      build([boys, girls], level) {
        const total = boys + girls, currentBoys = boys * 95 / 100, currentGirls = girls * 108 / 100;
        people(boys, girls, currentBoys, currentGirls);
        const currentTotal = currentBoys + currentGirls, difference = Math.abs(currentBoys - currentGirls);
        positive(currentTotal - total);
        const last = level === 0
          ? `작년에 규원이네 마을 학생 수는 남학생 ${boys}명, 여학생 ${girls}명이었다.`
          : `작년에 규원이네 마을 학생 수는 남학생과 여학생을 합하여 ${total}명이었다.`;
        const current = level === 0 ? "" : level === 1
          ? ` 모두 ${currentTotal}명이 되었다.`
          : ` 올해 전체 학생 수는 작년보다 ${currentTotal - total}명 늘었다.`;
        const prompt = `${last} 올해는 작년 남학생의 0.05만큼이 줄고 작년 여학생의 0.08만큼이 늘었다.${current} 올해 남학생과 여학생 수의 차는 몇 명인가?`;
        const reconstruction = level === 2 ? `올해 전체 학생 수는 ${total}+${currentTotal - total}=${currentTotal}명입니다. ` : "";
        const inverse = level === 0 ? "" : `작년 여학생 수는 (${currentTotal}-${total}×0.95)÷(1.08-0.95)=${girls}명이고, 작년 남학생 수는 ${total}-${girls}=${boys}명입니다. `;
        const answer = `${difference}명`;
        return { prompt, answer, solution: `${reconstruction}${inverse}올해 남학생은 ${boys}×0.95=${currentBoys}명, 여학생은 ${girls}×1.08=${currentGirls}명이므로 두 수의 차는 ${Math.max(currentBoys, currentGirls)}-${Math.min(currentBoys, currentGirls)}=${difference}명입니다.`, rows: [["작년 남학생", `${boys}명`], ["작년 여학생", `${girls}명`], ["올해 남학생", `${currentBoys}명`], ["올해 여학생", `${currentGirls}명`]] };
      }
    },
    {
      suffix: "mission-1", key: "sourceGrade6SecondDecimalDivisionE6Mission1Text",
      pools: freezePools([[150], [200], [250]]),
      designs: ["last-gender-counts-given", "source-last-year-gender-ratio", "gender-ratio-from-relative-excess"],
      steps: [2, 5, 6],
      build([boys], level) {
        const girls = boys * 13 / 10, total = boys + girls;
        const currentBoys = boys * 11 / 10, currentGirls = girls * 8 / 10;
        people(boys, girls, currentBoys, currentGirls);
        const last = level === 0 ? `어느 학교의 작년 6학년 남학생은 ${boys}명, 여학생은 ${girls}명이었다.`
          : `어느 학교의 작년 6학년 학생은 ${total}명이고, ${level === 1 ? "여학생 수는 남학생 수의 1.3배였다." : "여학생 수는 남학생 수보다 남학생 수의 0.3배만큼 더 많았다."}`;
        const prompt = `${last} 작년보다 올해 남학생 수는 0.1배만큼 늘었고, 여학생 수는 0.2배만큼 줄었다고 한다. 올해 6학년 남학생과 여학생은 각각 몇 명인가?`;
        const reconstruction = level === 2 ? "작년 여학생 수는 남학생 수의 1+0.3=1.3배입니다. " : "";
        const inverse = level === 0 ? "" : `작년 남학생은 ${total}÷(1+1.3)=${boys}명, 여학생은 ${total}-${boys}=${girls}명입니다. `;
        const answer = `남학생 ${currentBoys}명, 여학생 ${currentGirls}명`;
        return { prompt, answer, solution: `${reconstruction}${inverse}올해 남학생은 ${boys}×(1+0.1)=${currentBoys}명이고 여학생은 ${girls}×(1-0.2)=${currentGirls}명입니다.`, rows: [["작년 남학생", `${boys}명`], ["작년 여학생", `${girls}명`], ["올해 남학생", `${currentBoys}명`], ["올해 여학생", `${currentGirls}명`]] };
      }
    },
    {
      suffix: "mission-2", key: "sourceGrade6SecondDecimalDivisionE6Mission2Text",
      pools: freezePools([[1350], [1800], [2400]]),
      designs: ["both-whole-tape-shares-given", "source-nested-tape-share", "remainder-from-equal-pieces"],
      steps: [3, 4, 5],
      build([length], level) {
        const first = length * 30 / 100, second = first * 80 / 100, remainder = length - first - second;
        positive(first, second, remainder);
        const secondShare = level === 0 ? "나영이는 전체의 0.24를" : "나영이는 혜진이가 가진 것의 0.8배를";
        const remainderStatement = level === 2
          ? `승철이가 가진 색 테이프를 길이가 같은 3조각으로 잘랐더니 한 조각의 길이가 ${fmt(remainder / 300)}m였다면`
          : `승철이가 가진 색 테이프의 길이가 ${fmt(remainder / 100)}m라면`;
        const prompt = `혜진, 나영, 승철 세 사람은 색 테이프 한 개를 나누어 가졌다. 혜진이는 전체의 0.3을, ${secondShare}, 승철이는 혜진이와 나영이가 갖고 남은 나머지를 모두 가졌다. ${remainderStatement} 처음에 있던 색 테이프의 길이는 몇 m인가?`;
        const reconstruction = level === 2 ? `승철이가 가진 전체 길이는 ${fmt(remainder / 300)}×3=${fmt(remainder / 100)}m입니다. ` : "";
        const nested = level === 0 ? "" : "나영이가 가진 길이는 전체의 0.3×0.8=0.24입니다. ";
        const answer = `${fmt(length / 100)}m`;
        return { prompt, answer, solution: `${reconstruction}${nested}승철이가 가진 길이는 전체의 1-0.3-0.24=0.46이므로 처음 길이는 ${fmt(remainder / 100)}÷0.46=${answer}입니다.`, rows: [["혜진", `${fmt(first / 100)}m`], ["나영", `${fmt(second / 100)}m`], ["승철", `${fmt(remainder / 100)}m`]] };
      }
    },
    {
      suffix: "mission-3", key: "sourceGrade6SecondDecimalDivisionE6Mission3Text",
      pools: freezePools([[514, 437, 385], [437, 377, 324], [590, 504, 442]]),
      designs: ["dog-weight-given", "source-three-animal-pair-sums", "third-pair-from-pair-difference"],
      steps: [4, 6, 7],
      build([dogTurtle, turtleMonkey, monkeyDog], level) {
        const turtle = (dogTurtle + turtleMonkey - monkeyDog) / 2;
        const dog = dogTurtle - turtle, monkey = turtleMonkey - turtle;
        positive(turtle, dog, monkey);
        const roundedTenths = Math.floor((20 * turtle + monkey) / (2 * monkey));
        const rounding = "거북의 무게는 원숭이의 무게의 약 몇 배인지 반올림하여 소수 첫째 자리까지 나타내어라.";
        const prompt = level === 0
          ? `개의 무게는 ${fmt(dog / 10)}kg이고, 개와 거북의 무게의 합은 ${fmt(dogTurtle / 10)}kg, 원숭이와 개의 무게의 합은 ${fmt(monkeyDog / 10)}kg이다. ${rounding}`
          : `개와 거북의 무게의 합은 ${fmt(dogTurtle / 10)}kg, 거북과 원숭이의 무게의 합은 ${fmt(turtleMonkey / 10)}kg이다. ${level === 1 ? `원숭이와 개의 무게의 합은 ${fmt(monkeyDog / 10)}kg이다.` : `원숭이와 개의 무게의 합은 개와 거북의 무게의 합보다 ${fmt((dogTurtle - monkeyDog) / 10)}kg 가볍다.`} ${rounding}`;
        const reconstruction = level === 2 ? `원숭이와 개의 무게의 합은 ${fmt(dogTurtle / 10)}-${fmt((dogTurtle - monkeyDog) / 10)}=${fmt(monkeyDog / 10)}kg입니다. ` : "";
        const inverse = level === 0
          ? `거북은 ${fmt(dogTurtle / 10)}-${fmt(dog / 10)}=${fmt(turtle / 10)}kg, 원숭이는 ${fmt(monkeyDog / 10)}-${fmt(dog / 10)}=${fmt(monkey / 10)}kg입니다. `
          : `거북은 (${fmt(dogTurtle / 10)}+${fmt(turtleMonkey / 10)}-${fmt(monkeyDog / 10)})÷2=${fmt(turtle / 10)}kg이고, 원숭이는 ${fmt(turtleMonkey / 10)}-${fmt(turtle / 10)}=${fmt(monkey / 10)}kg입니다. `;
        const answer = `약 ${fmt(roundedTenths / 10)}배`;
        return { prompt, answer, solution: `${reconstruction}${inverse}${fmt(turtle / 10)}÷${fmt(monkey / 10)}의 몫을 반올림하여 소수 첫째 자리까지 나타내면 ${answer}입니다.`, rows: [["개", `${fmt(dog / 10)}kg`], ["거북", `${fmt(turtle / 10)}kg`], ["원숭이", `${fmt(monkey / 10)}kg`]] };
      }
    },
    {
      suffix: "mission-4", key: "sourceGrade6SecondDecimalDivisionE6Mission4Text",
      pools: freezePools([[5000], [8000], [10000]]),
      designs: ["first-bounce-difference", "source-second-bounce-difference", "third-bounce-difference"],
      steps: [2, 4, 6],
      build([height], level) {
        const times = level + 1, ordinal = ["첫", "두", "세"][level];
        const highCoefficient = 7 ** times, lowCoefficient = 4 ** times, denominator = 10 ** times;
        const high = height * highCoefficient / denominator, low = height * lowCoefficient / denominator;
        positive(height, high, low, high - low);
        const prompt = `두 개의 공을 일정한 높이에서 떨어뜨리면 하나는 떨어뜨린 높이의 0.7만큼 튀어 오르고, 다른 하나는 떨어진 높이의 0.4만큼 튀어 오른다. 두 공을 같은 높이에서 떨어뜨렸을 때, ${ordinal} 번째로 튀어 오르는 높이의 차가 ${fmt((high - low) / 1000)}m라면 처음 공을 떨어뜨린 높이는 몇 m인가?`;
        const coefficients = times === 1 ? "각각 처음 높이의 0.7배와 0.4배"
          : `각각 처음 높이의 0.7${"×0.7".repeat(times - 1)}=${fmt(highCoefficient / denominator)}배와 0.4${"×0.4".repeat(times - 1)}=${fmt(lowCoefficient / denominator)}배`;
        const answer = `${fmt(height / 1000)}m`;
        return { prompt, answer, solution: `${ordinal} 번째 높이는 ${coefficients}입니다. 따라서 처음 높이는 ${fmt((high - low) / 1000)}÷(${fmt(highCoefficient / denominator)}-${fmt(lowCoefficient / denominator)})=${answer}입니다.`, rows: [[`${ordinal} 번째 높은 공`, `${fmt(high / 1000)}m`], [`${ordinal} 번째 낮은 공`, `${fmt(low / 1000)}m`], ["높이의 차", `${fmt((high - low) / 1000)}m`]] };
      }
    },
    {
      suffix: "mission-5", key: "sourceGrade6SecondDecimalDivisionE6Mission5Text",
      pools: freezePools([[180, 140, 468, 32], [160, 120, 300, 20], [210, 150, 400, 40]]),
      designs: ["front-revolutions-given", "source-wheel-revolution-difference", "second-leg-from-total-revolution-difference"],
      steps: [1, 4, 5],
      build([front, rear, extra, firstLegExtra], level) {
        const frontTurns = extra * rear / (front - rear), rearTurns = frontTurns + extra;
        people(frontTurns, rearTurns, firstLegExtra * rear / (front - rear));
        const distance = front * frontTurns;
        positive(front, rear, distance);
        const condition = level === 0 ? `이 자전거로 일정한 거리를 달리자 앞바퀴가 ${frontTurns}번 회전하였다. 이 자전거가 달린 거리는 몇 m인가?`
          : level === 1 ? `이 자전거로 일정한 거리를 달리자 뒷바퀴는 앞바퀴보다 ${extra}번 더 많이 회전하였다. 이 자전거가 달린 거리는 몇 m인가?`
          : `이 자전거로 두 구간을 연달아 달리자 전체에서 뒷바퀴는 앞바퀴보다 ${extra + firstLegExtra}번 더 많이 회전하였다. 첫 구간에서는 뒷바퀴가 앞바퀴보다 ${firstLegExtra}번 더 많이 회전하였다. 두 번째 구간에서 달린 거리는 몇 m인가?`;
        const prompt = `앞바퀴의 둘레는 ${fmt(front / 100)}m, 뒷바퀴 둘레는 ${fmt(rear / 100)}m인 자전거가 있다. ${condition}`;
        const reconstruction = level === 2 ? `두 번째 구간의 회전 수 차는 ${extra + firstLegExtra}-${firstLegExtra}=${extra}번입니다. ` : "";
        const inverse = level === 0 ? "" : `앞바퀴와 같은 횟수만큼 뒷바퀴가 돌면 거리의 차는 한 번당 ${fmt(front / 100)}-${fmt(rear / 100)}=${fmt((front - rear) / 100)}m입니다. 이 차이를 뒷바퀴의 추가 ${extra}번 회전이 메우므로 앞바퀴 회전 수는 ${extra}×${fmt(rear / 100)}÷${fmt((front - rear) / 100)}=${frontTurns}번입니다. `;
        const answer = `${fmt(distance / 100)}m`;
        return { prompt, answer, solution: `${reconstruction}${inverse}거리는 ${fmt(front / 100)}×${frontTurns}=${answer}입니다. 뒷바퀴도 ${fmt(rear / 100)}×${rearTurns}=${answer}로 같은 거리를 갑니다.`, rows: [["앞바퀴 회전", `${frontTurns}번`], ["뒷바퀴 회전", `${rearTurns}번`]] };
      }
    },
    {
      suffix: "mission-6", key: "sourceGrade6SecondDecimalDivisionE6Mission6Text",
      pools: freezePools([[22, 18, 8950, 8250], [18, 12, 8800, 8000], [24, 16, 9100, 8100]]),
      designs: ["boys-score-total-given", "source-weighted-class-average", "gender-count-difference-and-average-gap"],
      steps: [4, 5, 6],
      build([boys, girls, maleAverage, femaleAverage], level) {
        people(boys, girls);
        const maleTotal = boys * maleAverage, femaleTotal = girls * femaleAverage;
        const average = (maleTotal + femaleTotal) / (boys + girls);
        positive(maleAverage - average, average - femaleAverage);
        if (!Number.isInteger(average)) throw new Error("전체 평균은 소수 둘째 자리 이내여야 합니다.");
        const male = level === 0 ? `남학생 ${boys}명의 점수의 합은 ${fmt(maleTotal / 100)}점`
          : level === 1 ? `남학생 ${boys}명의 평균 점수는 ${fmt(maleAverage / 100)}점`
          : `남학생들의 평균 점수는 ${fmt(maleAverage / 100)}점`;
        const difference = level === 2 ? ` 남학생 수는 여학생 수보다 ${boys - girls}명 더 많다.` : "";
        const female = level === 2 ? `여학생들의 평균 점수는 남학생들의 평균 점수보다 ${fmt((maleAverage - femaleAverage) / 100)}점 낮다.`
          : `여학생들의 평균 점수는 ${fmt(femaleAverage / 100)}점이다.`;
        const prompt = `민재네 반 전체 학생의 수학 시험 평균 점수는 ${fmt(average / 100)}점이고, ${male}, ${female}${difference} 민재네 반 여학생은 모두 몇 명인가?`;
        const inverse = level === 2
          ? `여학생 평균은 ${fmt(maleAverage / 100)}-${fmt((maleAverage - femaleAverage) / 100)}=${fmt(femaleAverage / 100)}점입니다. 남학생 한 명의 평균 초과분은 ${fmt(maleAverage / 100)}-${fmt(average / 100)}=${fmt((maleAverage - average) / 100)}점이고, 여학생 한 명의 평균 부족분은 ${fmt(average / 100)}-${fmt(femaleAverage / 100)}=${fmt((average - femaleAverage) / 100)}점입니다. 같은 수의 남녀를 짝지으면 한 쌍의 부족분은 ${fmt((average - femaleAverage) / 100)}-${fmt((maleAverage - average) / 100)}=${fmt((2 * average - maleAverage - femaleAverage) / 100)}점입니다. 추가 남학생 ${boys - girls}명의 초과분을 메우는 여학생 수는 ${boys - girls}×${fmt((maleAverage - average) / 100)}÷${fmt((2 * average - maleAverage - femaleAverage) / 100)}=${girls}명입니다.`
          : `${level === 1 ? `남학생 점수의 합은 ${boys}×${fmt(maleAverage / 100)}=${fmt(maleTotal / 100)}점입니다. ` : ""}남학생들의 점수 합이 전체 평균을 기준으로 한 합보다 ${fmt(maleTotal / 100)}-${boys}×${fmt(average / 100)}=${fmt((maleTotal - boys * average) / 100)}점 많습니다. 여학생 한 명당 ${fmt(average / 100)}-${fmt(femaleAverage / 100)}=${fmt((average - femaleAverage) / 100)}점씩 부족하므로 여학생 수는 ${fmt((maleTotal - boys * average) / 100)}÷${fmt((average - femaleAverage) / 100)}=${girls}명입니다.`;
        const answer = `${girls}명`;
        return { prompt, answer, solution: inverse, rows: [["남학생", `${boys}명`], ["여학생", `${girls}명`], ["전체 학생", `${boys + girls}명`], ["전체 점수 합", `${fmt((maleTotal + femaleTotal) / 100)}점`], ["전체 평균", `${fmt(average / 100)}점`]] };
      }
    }
  ];

  const byId = new Map(definitions.map(definition => [`6-2-u2-e6-${definition.suffix}`, definition]));
  const byKey = new Map(definitions.map(definition => [definition.key, definition]));
  const resolve = type => type?.sourceItemId ? byId.get(type.sourceItemId) : byKey.get(type?.generatorKey);
  const originalKey = api.generatorKey;
  const originalGenerate = api.generate;
  api.generatorKey = type => {
    const definition = resolve(type);
    return definition ? (type.reviewLocked ? "" : definition.key) : originalKey(type);
  };
  api.generate = (type, levelRank, difficultyOffset, seed, variant = 0) => {
    const definition = resolve(type);
    if (!definition) return originalGenerate(type, levelRank, difficultyOffset, seed, variant);
    if (type.reviewLocked) return null;
    if (!Number.isInteger(variant)) throw new Error("고정 변형 번호는 정수여야 합니다.");
    const poolIndex = ((variant % 3) + 3) % 3;
    const offset = Number(difficultyOffset ?? 0);
    if (![-1, 0, 1].includes(offset)) throw new Error("난이도는 -1, 0, +1이어야 합니다.");
    const level = offset + 1, sourceItemId = `6-2-u2-e6-${definition.suffix}`;
    const item = definition.build(definition.pools[poolIndex], level);
    const difficultyDesign = definition.designs[level];
    return {
      prompt: item.prompt, answer: item.answer, solution: item.solution,
      answerVisual: `<div class="source62-e6-text-answer" data-answer-source="${sourceItemId}" data-verified-pool-index="${poolIndex}" data-difficulty-design="${difficultyDesign}">${table(item.rows, item.answer)}</div>`,
      sourceItemId, generator: definition.key, generationMode: "fixed-verified-pool",
      verifiedPoolIndex: poolIndex, verifiedVariantCount: 3, verifiedVariantTarget: 3,
      verifiedVariantId: `${sourceItemId}:v${poolIndex}`, difficultyDesign, reasoningSteps: definition.steps[level],
      variantProvenance: poolIndex === 0 && level === 1 ? "source-values" : "source-structure-variant"
    };
  };
  if (Array.isArray(api.names)) for (const { key } of definitions) if (!api.names.includes(key)) api.names.push(key);
  // Registration only: inventory and curriculum release decisions belong to the integrator.
})();
