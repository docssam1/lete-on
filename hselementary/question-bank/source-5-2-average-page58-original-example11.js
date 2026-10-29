(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_AVERAGE_PAGE58_EXAMPLE11 = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";
  const sourceItemId = "5-2-u6-e1-example-1";
  const generatorKey = "source52AverageOriginalPage58Example11";
  function candidates() {
    const result = [];
    for (let one = 0; one <= 9; one++) for (let ten = 0; ten <= 9; ten++) {
      const korean = 90 + one, math = 10 * ten + 4;
      if (korean + math + 78 + 90 + 80 === 86 * 5) result.push([korean, math]);
    }
    return result;
  }
  function scoreTable() {
    return `<figure class="source52-p58ex11-figure"><figcaption>희선이의 성적표</figcaption><svg class="source52-p58ex11-table" viewBox="0 0 600 100" role="img" aria-label="과목과 점수: 국어는 십의 자리 9만 보임, 수학은 일의 자리 4만 보임, 사회 78, 과학 90, 영어 80" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="1" width="598" height="98" fill="white" stroke="currentColor" stroke-width="2"/><path d="M0 50H600 M100 0V100 M200 0V100 M300 0V100 M400 0V100 M500 0V100" fill="none" stroke="currentColor" stroke-width="2"/><g text-anchor="middle" dominant-baseline="middle" fill="currentColor" font-size="23"><text x="50" y="25">과목</text><text x="150" y="25">국어</text><text x="250" y="25">수학</text><text x="350" y="25">사회</text><text x="450" y="25">과학</text><text x="550" y="25">영어</text><text x="50" y="75">점수</text><text x="135" y="75">9</text><text x="265" y="75">4</text><text x="350" y="75">78</text><text x="450" y="75">90</text><text x="550" y="75">80</text></g><path d="M155 100 L160 90 L164 75 L170 68 L182 64 L195 59 L200 53 L207 58 L220 62 L233 67 L237 75 L240 89 L245 100 Z" fill="white" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg></figure>`;
  }
  function makeQuestion() {
    const possible = candidates();
    if (JSON.stringify(possible) !== "[[98,84]]") throw new Error("성적표의 가능한 점수 검산 실패");
    const prompt = `<div class="source52-p58ex11-question" data-source-item-id="${sourceItemId}" data-pool-index="0"><p>희선이 성적표의 일부분이 찢어졌습니다. 희선이의 다섯 과목 성적의 평균이 86점일 때, 국어 점수와 수학 점수는 각각 몇 점인지 구하여라.</p>${scoreTable()}<p>국어: ______점　　수학: ______점</p></div>`;
    const solution = `<div class="source52-p58ex11-solution" data-source-answer="${sourceItemId}"><p>다섯 과목 점수의 합은 86 × 5 = 430점입니다.</p><p>국어와 수학 점수의 합은 430 − (78 + 90 + 80) = 182점입니다.</p><p>국어 점수는 십의 자리가 9이므로 90점대입니다. 수학 점수는 일의 자리가 4이므로 182에서 끝자리가 4인 수를 빼면 끝자리가 8입니다. 따라서 국어 점수는 98점이고, 수학 점수는 182 − 98 = 84점입니다.</p><p>확인: (98 + 84 + 78 + 90 + 80) ÷ 5 = 86 (점)</p></div>`;
    return Object.freeze({ prompt, answer: "국어 98점, 수학 84점", solution, sourceItemId, generator: generatorKey, variant: 0, variantIndex: 0, poolIndex: 0, verifiedPoolIndex: 0, verifiedVariantId: `${sourceItemId}:original`, difficultyOffset: 0, difficultyLevel: 2, difficultyRank: 2, sourceStructurePreserved: true, variantProvenance: "source-original-fixed", generationMode: "fixed-verified-pool", verifiedVariantCount: 1, verifiedVariantTarget: 1, answerVisualRequired: false, answerVisualStatus: "not-required", publisherKeyVerified: false, publisherAnswerVerified: false, handwrittenAnswerVerified: false, answerVerification: "independent-exhaustive-digit-enumeration", answerModel: Object.freeze({ korean: 98, math: 84, combined: 182, total: 430 }) });
  }
  function install(target) {
    const api = target?.HSE_GENERATORS;
    if (!api || typeof api.generatorKey !== "function" || typeof api.generate !== "function") return false;
    if (api.__source52P58OriginalExample11Installed) return true;
    const previousKey = api.generatorKey.bind(api), previousGenerate = api.generate.bind(api);
    const matches = type => type && (type.id === sourceItemId || type.sourceItemId === sourceItemId || type.generatorKey === generatorKey);
    api.generatorKey = type => matches(type) ? type.id === sourceItemId && type.sourceItemId === sourceItemId && type.generatorKey === generatorKey && type.reviewLocked === false && type.sourceVerified === true ? generatorKey : "" : previousKey(type);
    api.generate = (type, rank, difficulty, seed, variant = 0) => matches(type) ? api.generatorKey(type) && Number(variant) === 0 ? makeQuestion() : null : previousGenerate(type, rank, difficulty, seed, variant);
    if (Array.isArray(api.names) && !api.names.includes(generatorKey)) api.names.push(generatorKey);
    Object.defineProperty(api, "__source52P58OriginalExample11Installed", { value: true });
    return true;
  }
  return Object.freeze({ sourceItemId, generatorKey, candidates, scoreTable, makeQuestion, install });
});
