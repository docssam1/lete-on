(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_ROUNDING_E2 = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const esc = value => String(value).replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));
  const number = value => Number(value).toLocaleString("en-US");
  const round = (value, unit) => Math.floor(value / unit + 0.5) * unit;
  const ceil = (value, unit) => Math.ceil(value / unit) * unit;
  const floor = (value, unit) => Math.floor(value / unit) * unit;
  const equation = value => `<span class="math-inline-expression">${esc(value)}</span>`;
  const item = (kind, prompt, answer, solution, model) => ({
    prompt: `<div class="source52-range-question source52-rounding-question" data-source-kind="${kind}">${prompt}</div>`,
    answer: String(answer), solution: `<div class="source52-range-solution source52-rounding-solution">${solution}</div>`,
    questionModel: model, answerModel: { value: String(answer) },
    answerVisualRequired: false, answerVisualStatus: "not-required"
  });

  const ids = [
    "5-2-u1-e2-exploration",
    "5-2-u1-e2-example-2-1",
    "5-2-u1-e2-example-2-2",
    "5-2-u1-e2-example-2-3"
  ];
  const keys = ["source52RoundingExploration2", "source52RoundingExample21", "source52RoundingExample22", "source52RoundingExample23"];
  const difficultyDesigns = [
    ["place-value-hint", "direct-rounding", "explain-each-place-value"],
    ["place-value-hint", "compare-each-result", "show-each-rounding-result"],
    ["rounding-steps-given", "compare-two-sums", "compare-rounded-parts-and-whole"],
    ["place-value-hint", "two-condition-filter", "intersect-two-condition-filters"]
  ];
  const pools = [
    [194638, 527491, 863752],
    [[18209, 29064, 41325, 67472], [23521, 36483, 51768, 82344], [14209, 37654, 51829, 78462]],
    [[4262234, 5303782], [3164235, 4723012], [5281437, 3644278]],
    [[1742, 3144, 4664, 5878, 6939], [2132, 3455, 5813, 7264, 9188], [1954, 2534, 3744, 6248, 8841]]
  ];

  function build(index, poolIndex, level) {
    if (index === 0) {
      const value = pools[index][poolIndex] + level * 17;
      const raised = ceil(value, 100), dropped = floor(value, 1000), nearest = round(value, 10000);
      const answer = `${number(raised)}, ${number(dropped)}, ${number(nearest)}`;
      const difficultyText = level === 0 ? "올림은 지정한 자리보다 작은 수가 남으면 다음 단위로 올리고, 반올림은 바로 오른쪽 숫자를 살펴보세요." : level === 2 ? "각 방법으로 나타낸 수를 먼저 적고, 지정한 자리보다 작은 숫자가 어떻게 처리되는지 설명하세요." : "";
      const prompt = `${number(value)}를 (1) 올림하여 백의 자리까지, (2) 버림하여 천의 자리까지, (3) 반올림하여 만의 자리까지 각각 나타내세요.${difficultyText ? ` <p class=\"source52-rounding-hint\">도움말: ${difficultyText}</p>` : ""}`;
      const solution = `올림은 지정한 자리보다 작은 숫자가 남으면 다음 단위로 올립니다. 따라서 (1)은 ${equation(`${number(value)} → ${number(raised)}`)}입니다. 버림은 작은 자리를 없애므로 (2)는 ${equation(`${number(value)} → ${number(dropped)}`)}입니다. 만의 자리에서 반올림할 때 천의 자리 숫자는 ${Math.floor(value / 1000) % 10}이므로 (3)은 ${equation(`${number(value)} → ${number(nearest)}`)}입니다. 답은 차례로 ${answer}입니다.`;
      return item("rounding-operations", prompt, answer, solution, { value, raised, dropped, nearest });
    }
    if (index === 1) {
      const candidates = pools[index][poolIndex];
      const valid = candidates.filter(value => ceil(value, 100) === round(value, 100));
      if (valid.length !== 2) throw new Error("5-2 rounding Example 2-1 pool must have exactly two answers");
      const labels = ["㉠", "㉡", "㉢", "㉣"];
      const answer = valid.map(value => labels[candidates.indexOf(value)]).join(", ");
      const difficultyText = level === 0 ? "백의 자리까지 어림할 때는 십의 자리 숫자를 먼저 살펴보세요." : level === 2 ? "각 수의 두 결과를 계산해 표처럼 비교한 다음, 같은 기호를 모두 쓰세요." : "";
      const prompt = `다음 수 중에서 올림하여 백의 자리까지 나타낸 수와 반올림하여 백의 자리까지 나타낸 수가 같은 것을 모두 찾아 기호로 쓰세요.${candidates.map((value, position) => `${["㉠", "㉡", "㉢", "㉣"][position]} ${number(value)}`).join("　")}${difficultyText ? `<p class=\"source52-rounding-hint\">도움말: ${difficultyText}</p>` : ""}`;
      const solution = candidates.map((value, position) => `${labels[position]} ${number(value)}: 올림하면 ${number(ceil(value, 100))}, 반올림하면 ${number(round(value, 100))}${valid.includes(value) ? "으로 같습니다" : "으로 다릅니다"}`).join(". ");
      return item("rounding-equal-results", prompt, answer, `${solution}. 따라서 답은 ${answer}입니다.`, { candidates, roundedUp: candidates.map(value => ceil(value, 100)), rounded: candidates.map(value => round(value, 100)), valid });
    }
    if (index === 2) {
      const [male, female] = pools[index][poolIndex].map(value => value + level * 113);
      const floors = [floor(male, 10000), floor(female, 10000)];
      const ceils = [ceil(male, 10000), ceil(female, 10000)];
      const roundedEach = [round(male, 10000), round(female, 10000)];
      const actualTotal = male + female;
      const roundedTotal = round(actualTotal, 10000);
      const first = Math.abs(ceils[0] + ceils[1] - floors[0] - floors[1]);
      const second = Math.abs(roundedEach[0] + roundedEach[1] - roundedTotal);
      const answer = `${number(first)}명, ${number(second)}명`;
      const prompt = `어느 도시의 가상 인구 자료입니다. 남자 인구는 ${number(male)}명, 여자 인구는 ${number(female)}명입니다. (1) 두 수를 각각 버림하여 만의 자리까지 나타내어 더한 값과, 각각 올림하여 만의 자리까지 나타내어 더한 값의 차를 구하세요. (2) 두 수를 각각 반올림하여 만의 자리까지 나타낸 뒤 더한 값과, 두 수의 합을 반올림하여 만의 자리까지 나타낸 값의 차를 구하세요.`;
      const solution = `(1) 버림한 합은 ${equation(`${number(floors[0])} + ${number(floors[1])} = ${number(floors[0] + floors[1])}`)}이고, 올림한 합은 ${equation(`${number(ceils[0])} + ${number(ceils[1])} = ${number(ceils[0] + ceils[1])}`)}입니다. 차는 ${number(first)}명입니다. (2) 각각 반올림한 합은 ${equation(`${number(roundedEach[0])} + ${number(roundedEach[1])} = ${number(roundedEach[0] + roundedEach[1])}`)}입니다. 실제 합 ${number(actualTotal)}명을 반올림하면 ${number(roundedTotal)}명이므로 두 값의 차는 ${number(second)}명입니다.`;
      return item("rounding-sum-comparison", prompt, answer, solution, { male, female, floors, ceils, roundedEach, actualTotal, roundedTotal, first, second });
    }
    if (index === 3) {
      const candidates = pools[index][poolIndex];
      const valid = candidates.filter(value => ceil(value, 10) !== round(value, 10) && floor(value, 100) !== round(value, 100));
      if (valid.length !== 1) throw new Error("5-2 rounding Example 2-2 pool must have exactly one answer");
      const answer = valid.length;
      const difficultyText = level === 0 ? "십의 자리 조건은 일의 자리 숫자를, 백의 자리 조건은 십의 자리 숫자를 먼저 살펴보세요." : level === 2 ? "첫째 조건을 만족하는 후보와 둘째 조건을 만족하는 후보를 각각 찾은 뒤 공통인 수를 확인하세요." : "";
      const prompt = `다음 수 중에서 두 조건을 모두 만족하는 수는 몇 개인가요? ${candidates.map(number).join(", ")}<ol><li>올림하여 십의 자리까지 나타낸 수와 반올림하여 십의 자리까지 나타낸 수가 다릅니다.</li><li>버림하여 백의 자리까지 나타낸 수와 반올림하여 백의 자리까지 나타낸 수가 다릅니다.</li></ol>${difficultyText ? `<p class=\"source52-rounding-hint\">도움말: ${difficultyText}</p>` : ""}`;
      const tests = candidates.map(value => ({ value, tens: ceil(value, 10) !== round(value, 10), hundreds: floor(value, 100) !== round(value, 100) }));
      const solution = `각 수를 십의 자리까지 올림·반올림하고, 백의 자리까지 버림·반올림하여 비교합니다. 두 조건을 모두 만족하는 수는 ${valid.map(number).join(", ")} 하나이므로 ${answer}개입니다.`;
      return item("rounding-condition-count", prompt, answer, solution, { candidates, tests, valid });
    }
    throw new Error("Unknown Grade 5-2 rounding source item");
  }

  function getQuestion(sourceItemId, variant = 0, difficultyOffset = 0) {
    const index = ids.indexOf(sourceItemId);
    if (index < 0 || !Number.isSafeInteger(variant) || variant < 0 || ![-1, 0, 1].includes(difficultyOffset)) return null;
    const poolIndex = variant % 3, level = difficultyOffset + 1;
    const result = build(index, poolIndex, level);
    return Object.freeze({ ...result,
      prompt: `<div data-source-item="${sourceItemId}" data-source-item-id="${sourceItemId}" data-pool-index="${poolIndex}" data-variant="${poolIndex}" data-difficulty-offset="${difficultyOffset}" data-level="${level}">${result.prompt}</div>`,
      sourceItemId, generator: keys[index], generationMode: "fixed-verified-pool", verifiedPoolIndex: poolIndex,
      verifiedVariantCount: 3, verifiedVariantTarget: 3, verifiedVariantId: `${sourceItemId}:v${poolIndex}`,
      variantProvenance: "source-structure-variant", difficultyOffset, difficultyLevel: level, difficultyRank: level,
      sourceDifficultyRank: 1, difficultyDesign: difficultyDesigns[index][level], reasoningSteps: level + 2,
      sourceStepCount: 3, difficultyStepDelta: level - 1,
      sourceStructurePreserved: true, sourceEvidenceRef: "source-memory:hs-elementary.unit.5-2-1.e2-direct-review-20261019",
      publisherKeyVerified: false, publisherAnswerVerified: false, handwrittenAnswerVerified: false,
      answerVerification: "independent-calculation-user-authorized" });
  }

  const definitions = ids.map((sourceItemId, index) => Object.freeze({ sourceItemId, generatorKey: keys[index], poolCount: 3, kind: ["rounding-operations", "rounding-equal-results", "rounding-sum-comparison", "rounding-condition-count"][index] }));
  const byId = new Map(definitions.map(definition => [definition.sourceItemId, definition]));
  const ownedKeys = new Set(keys);
  function resolve(type) {
    if (!type || typeof type !== "object") return null;
    const definition = byId.get(type.sourceItemId);
    return definition && type.id === definition.sourceItemId && type.generatorKey === definition.generatorKey ? definition : null;
  }
  function install(target) {
    const api = target?.HSE_GENERATORS;
    if (!api || typeof api.generatorKey !== "function" || typeof api.generate !== "function") return false;
    if (api.__source52RoundingE2Installed) return true;
    const previousKey = api.generatorKey.bind(api), previousGenerate = api.generate.bind(api);
    const belongs = type => Boolean(type && (byId.has(type.id) || byId.has(type.sourceItemId) || ownedKeys.has(type.generatorKey)));
    api.generatorKey = type => {
      if (!belongs(type)) return previousKey(type);
      const definition = resolve(type);
      return definition && type.reviewLocked === false && type.sourceVerified === true ? definition.generatorKey : "";
    };
    api.generate = (type, levelRank, difficultyOffset, seed, variant = 0) => {
      if (!belongs(type)) return previousGenerate(type, levelRank, difficultyOffset, seed, variant);
      const definition = resolve(type);
      return definition && type.reviewLocked === false && type.sourceVerified === true
        ? getQuestion(definition.sourceItemId, variant, difficultyOffset ?? 0) : null;
    };
    if (Array.isArray(api.names)) for (const key of keys) if (!api.names.includes(key)) api.names.push(key);
    Object.defineProperty(api, "__source52RoundingE2Installed", { value: true });
    return true;
  }

  return Object.freeze({ ids, keys, pools, definitions, getQuestion, resolve, install, publisherKeyVerified: false, answerVerification: "independent-calculation-user-authorized" });
});
