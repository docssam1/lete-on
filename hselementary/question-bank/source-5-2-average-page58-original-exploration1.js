(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_AVERAGE_PAGE58_ORIGINAL = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";
  const sourceItemId = "5-2-u6-e1-exploration";
  const generatorKey = "source52AverageOriginalPage58Exploration1";
  const names = Object.freeze(["효근", "동민", "석기", "예슬", "영수", "한별", "한초"]);
  const tenths = Object.freeze([1528, 1404, 1486, 1420, 1492, 1418, 1542]);
  function makeQuestion() {
    const sum = tenths.reduce((a, b) => a + b, 0);
    if (sum !== 10290 || sum / tenths.length !== 1470) throw new Error("원문 평균 검산 실패");
    const values = tenths.map(n => String(n / 10));
    const rows = names.map((name, i) => `<tr><th scope="row">${name}</th><td>${values[i]}</td></tr>`).join("");
    const prompt = `<div class="source52-p58e1-question" data-source-item-id="${sourceItemId}" data-pool-index="0"><p>다음은 예슬이네 모둠의 키를 조사하여 나타낸 표입니다. 키의 평균을 구하여라.</p><table class="source52-p58e1-table"><caption>예슬이네 모둠의 키</caption><thead><tr><th scope="col">이름</th><th scope="col">키(cm)</th></tr></thead><tbody>${rows}</tbody></table></div>`;
    const solution = `<div class="source52-p58e1-solution" data-source-answer="${sourceItemId}"><p>일곱 사람의 키를 모두 더합니다.</p><p class="math-inline-expression">152.8 + 140.4 + 148.6 + 142 + 149.2 + 141.8 + 154.2 = 1029 (cm)</p><p>합을 사람 수 7로 나누면 평균입니다.</p><p class="math-inline-expression">1029 ÷ 7 = <strong>147</strong> (cm)</p></div>`;
    return Object.freeze({ prompt, answer: "147cm", solution, sourceItemId, generator: generatorKey, variant: 0, variantIndex: 0, poolIndex: 0, verifiedPoolIndex: 0, verifiedVariantId: `${sourceItemId}:original`, difficultyOffset: 0, difficultyLevel: 2, difficultyRank: 2, sourceStructurePreserved: true, variantProvenance: "source-original-fixed", generationMode: "fixed-verified-pool", verifiedVariantCount: 1, verifiedVariantTarget: 1, answerVisualRequired: false, answerVisualStatus: "not-required", publisherKeyVerified: false, publisherAnswerVerified: false, handwrittenAnswerVerified: false, answerVerification: "independent-exact-arithmetic", answerModel: Object.freeze({ sum: 1029, count: 7, mean: 147, unit: "cm" }) });
  }
  function install(target) {
    const api = target?.HSE_GENERATORS;
    if (!api || typeof api.generatorKey !== "function" || typeof api.generate !== "function") return false;
    if (api.__source52P58OriginalE1Installed) return true;
    const previousKey = api.generatorKey.bind(api), previousGenerate = api.generate.bind(api);
    const matches = type => type && (type.id === sourceItemId || type.sourceItemId === sourceItemId || type.generatorKey === generatorKey);
    api.generatorKey = type => matches(type) ? type.id === sourceItemId && type.sourceItemId === sourceItemId && type.generatorKey === generatorKey && type.reviewLocked === false && type.sourceVerified === true ? generatorKey : "" : previousKey(type);
    api.generate = (type, rank, difficulty, seed, variant = 0) => matches(type) ? api.generatorKey(type) && Number(variant) === 0 ? makeQuestion() : null : previousGenerate(type, rank, difficulty, seed, variant);
    if (Array.isArray(api.names) && !api.names.includes(generatorKey)) api.names.push(generatorKey);
    Object.defineProperty(api, "__source52P58OriginalE1Installed", { value: true });
    return true;
  }
  return Object.freeze({ sourceItemId, generatorKey, names, tenths, makeQuestion, install });
});
