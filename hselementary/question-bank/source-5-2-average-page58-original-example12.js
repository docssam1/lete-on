(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_AVERAGE_PAGE58_EXAMPLE12 = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";
  const sourceItemId = "5-2-u6-e1-example-2";
  const generatorKey = "source52AverageOriginalPage58Example12";
  function makeQuestion() {
    // Hundredths of a second, so 15.1 × 3 + 16.4 × 3 − 15.78 × 5 is exact.
    const first = 1510 * 3, last = 1640 * 3, all = 1578 * 5, middle = first + last - all;
    if (middle !== 1560) throw new Error("겹치는 평균의 독립 계산이 맞지 않습니다.");
    const prompt = `<div class="source52-p58ex12-question" data-source-item-id="${sourceItemId}" data-pool-index="0"><p>100m 달리기 대회에서 먼저 들어온 학생 순서대로 1번부터 5번까지 번호를 정했습니다.</p><p>1번, 2번, 3번 학생의 평균 기록은 15.1초이고, 3번, 4번, 5번 학생의 평균 기록은 16.4초입니다. 5명의 평균 기록이 15.78초라면 3번 학생의 기록은 몇 초인가요?</p></div>`;
    const solution = `<div class="source52-p58ex12-solution" data-source-answer="${sourceItemId}"><p>1번부터 3번까지 기록의 합은 15.1 × 3 = 45.3초입니다.</p><p>3번부터 5번까지 기록의 합은 16.4 × 3 = 49.2초입니다.</p><p>다섯 명의 기록의 합은 15.78 × 5 = 78.9초입니다.</p><p>앞의 세 명과 뒤의 세 명의 합을 더하면 3번 학생의 기록이 두 번 포함됩니다. 따라서 이 합에서 다섯 명 전체의 합을 빼면 3번 학생의 기록이 남습니다.</p><p>45.3 + 49.2 − 78.9 = <strong>15.6</strong> (초)</p></div>`;
    return Object.freeze({ prompt, answer: "15.6초", solution, sourceItemId, generator: generatorKey, variant: 0, variantIndex: 0, poolIndex: 0, verifiedPoolIndex: 0, verifiedVariantId: `${sourceItemId}:original`, difficultyOffset: 0, difficultyLevel: 2, difficultyRank: 2, sourceStructurePreserved: true, variantProvenance: "source-original-fixed", generationMode: "fixed-verified-pool", verifiedVariantCount: 1, verifiedVariantTarget: 1, answerVisualRequired: false, answerVisualStatus: "not-required", publisherKeyVerified: false, publisherAnswerVerified: false, handwrittenAnswerVerified: false, answerVerification: "independent-exact-hundredths-and-order-witness", answerModel: Object.freeze({ first: 45.3, last: 49.2, total: 78.9, middle: 15.6 }) });
  }
  function install(target) {
    const api = target?.HSE_GENERATORS;
    if (!api || typeof api.generatorKey !== "function" || typeof api.generate !== "function") return false;
    if (api.__source52P58OriginalExample12Installed) return true;
    const previousKey = api.generatorKey.bind(api), previousGenerate = api.generate.bind(api);
    const matches = type => type && (type.id === sourceItemId || type.sourceItemId === sourceItemId || type.generatorKey === generatorKey);
    api.generatorKey = type => matches(type) ? type.id === sourceItemId && type.sourceItemId === sourceItemId && type.generatorKey === generatorKey && type.reviewLocked === false && type.sourceVerified === true ? generatorKey : "" : previousKey(type);
    api.generate = (type, rank, difficulty, seed, variant = 0) => matches(type) ? api.generatorKey(type) && Number(variant) === 0 ? makeQuestion() : null : previousGenerate(type, rank, difficulty, seed, variant);
    if (Array.isArray(api.names) && !api.names.includes(generatorKey)) api.names.push(generatorKey);
    Object.defineProperty(api, "__source52P58OriginalExample12Installed", { value: true });
    return true;
  }
  return Object.freeze({ sourceItemId, generatorKey, makeQuestion, install });
});
