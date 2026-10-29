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
  // Synthetic tenths of a centimetre; the licensed source remains in private records.
  const pools = Object.freeze([
    Object.freeze([1360, 1380, 1390, 1400, 1410, 1420, 1440]),
    Object.freeze([1395, 1415, 1425, 1435, 1445, 1455, 1475]),
    Object.freeze([1335, 1355, 1365, 1375, 1385, 1395, 1415])
  ]);
  const format = n => Number((n / 10).toFixed(1)).toString();
  function makeQuestion(variant = 0) {
    if (!Number.isSafeInteger(variant) || variant < 0) return null;
    const index = variant % pools.length, values = pools[index];
    const sum = values.reduce((a, b) => a + b, 0);
    if (sum % values.length !== 0) throw new Error("평균이 소수 첫째 자리로 나타나는지 확인하세요.");
    const average = sum / values.length;
    const rows = values.map((value, i) => `<tr><th scope="row">학생 ${i + 1}</th><td>${format(value)}</td></tr>`).join("");
    const prompt = `<div class="source52-p58e1-question" data-source-item-id="${sourceItemId}" data-pool-index="${index}"><p>표에 나타낸 일곱 학생의 키의 평균을 구하세요.</p><table class="source52-p58e1-table"><caption>학생들의 키</caption><thead><tr><th scope="col">학생</th><th scope="col">키(cm)</th></tr></thead><tbody>${rows}</tbody></table></div>`;
    const solution = `<div class="source52-p58e1-solution" data-source-answer="${sourceItemId}"><p>일곱 학생의 키를 모두 더합니다.</p><p class="math-inline-expression">${values.map(format).join(" + ")} = ${format(sum)} (cm)</p><p>합을 학생 수로 나누면 평균입니다.</p><p class="math-inline-expression">${format(sum)} ÷ ${values.length} = <strong>${format(average)}</strong> (cm)</p></div>`;
    return Object.freeze({ prompt, answer: `${format(average)}cm`, solution, sourceItemId, generator: generatorKey, variant: index, variantIndex: index, poolIndex: index, verifiedPoolIndex: index, verifiedVariantId: `${sourceItemId}:synthetic:${index}`, difficultyOffset: 0, difficultyLevel: 2, difficultyRank: 2, sourceStructurePreserved: true, variantProvenance: "synthetic-source-structure", generationMode: "fixed-verified-pool", verifiedVariantCount: pools.length, verifiedVariantTarget: pools.length, answerVisualRequired: false, answerVisualStatus: "not-required", publisherKeyVerified: false, publisherAnswerVerified: false, handwrittenAnswerVerified: false, answerVerification: "independent-synthetic-mean", answerModel: Object.freeze({ sumTenths: sum, count: values.length, meanTenths: average, unit: "cm" }), questionModel: Object.freeze({ heightTenths: [...values] }) });
  }
  function install(target) {
    const api = target?.HSE_GENERATORS;
    if (!api || typeof api.generatorKey !== "function" || typeof api.generate !== "function") return false;
    if (api.__source52P58OriginalE1Installed) return true;
    const previousKey = api.generatorKey.bind(api), previousGenerate = api.generate.bind(api);
    const matches = type => type && (type.id === sourceItemId || type.sourceItemId === sourceItemId || type.generatorKey === generatorKey);
    api.generatorKey = type => matches(type) ? type.id === sourceItemId && type.sourceItemId === sourceItemId && type.generatorKey === generatorKey && type.reviewLocked === false && type.sourceVerified === true ? generatorKey : "" : previousKey(type);
    api.generate = (type, rank, difficulty, seed, variant = 0) => matches(type) ? api.generatorKey(type) ? makeQuestion(variant) : null : previousGenerate(type, rank, difficulty, seed, variant);
    if (Array.isArray(api.names) && !api.names.includes(generatorKey)) api.names.push(generatorKey);
    Object.defineProperty(api, "__source52P58OriginalE1Installed", { value: true });
    return true;
  }
  return Object.freeze({ sourceItemId, generatorKey, pools, makeQuestion, install });
});
