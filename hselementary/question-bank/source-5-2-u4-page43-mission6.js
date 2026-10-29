(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_U4_PAGE43_MISSION6 = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";
  const sourceItemId = "5-2-u4-e1-mission-6";
  const generatorKey = "source52RoundedQuotientNaturalSumPage43Mission6";
  const pools = Object.freeze([
    Object.freeze({ divisor: 41, targetTenths: 32 }),
    Object.freeze({ divisor: 67, targetTenths: 18 }),
    Object.freeze({ divisor: 37, targetTenths: 41 })
  ]);
  const ceilDiv = (a, b) => Math.floor((a + b - 1) / b);
  const format = value => Number(value).toLocaleString("ko-KR");
  const decimalTenths = value => `${Math.floor(value / 10)}.${value % 10}`;
  const decimalHundredths = value => `${Math.floor(value / 100)}.${String(value % 100).padStart(2, "0")}`;

  function calculate(divisor, targetTenths) {
    if (!Number.isSafeInteger(divisor) || divisor <= 0 || !Number.isSafeInteger(targetTenths) || targetTenths <= 0) {
      throw new TypeError("나눗수와 양의 소수 첫째 자리 목표값을 확인해 주세요.");
    }
    const lowerNumerator = divisor * (2 * targetTenths - 1);
    const upperNumerator = divisor * (2 * targetTenths + 1);
    const first = ceilDiv(lowerNumerator, 20);
    const last = ceilDiv(upperNumerator, 20) - 1;
    if (![lowerNumerator, upperNumerator, first, last].every(Number.isSafeInteger) || first < 1 || last < first) {
      throw new RangeError("조건을 만족하는 자연수 범위가 없습니다.");
    }
    const count = last - first + 1;
    const sum = ((first + last) * count) / 2;
    if (!Number.isSafeInteger(count) || !Number.isSafeInteger(sum)) throw new RangeError("합을 정확히 계산할 수 없습니다.");
    const lowerHundredths = 10 * targetTenths - 5;
    const upperHundredths = 10 * targetTenths + 5;
    return Object.freeze({ divisor, targetTenths, target: decimalTenths(targetTenths), lowerHundredths,
      upperHundredths, lowerProductHundredths: divisor * lowerHundredths, upperProductHundredths: divisor * upperHundredths,
      first, last, count, sum });
  }

  function getQuestion(poolIndex = 0, difficultyOffset = 0) {
    if (!Number.isSafeInteger(poolIndex) || poolIndex < 0 || poolIndex >= pools.length || ![-1, 0, 1].includes(difficultyOffset)) return null;
    const pool = pools[poolIndex];
    const result = calculate(pool.divisor, pool.targetTenths + difficultyOffset);
    const particle = [0, 3, 6].includes(result.divisor % 10) ? "으로" : "로";
    const prompt = `어떤 자연수를 ${format(result.divisor)}${particle} 나눈 몫을 반올림하여 소수 첫째 자리까지 나타내면 ${result.target}입니다. 이러한 자연수를 모두 더하세요.`;
    const solution = `<div class="source52-u4-p43-m6-solution" data-source-answer="${sourceItemId}" data-pool-index="${poolIndex}"><ol><li>어떤 자연수를 n이라 하면 몫을 반올림해 ${result.target}이 되는 범위는 ${decimalHundredths(result.lowerHundredths)}≤n÷${format(result.divisor)}&lt;${decimalHundredths(result.upperHundredths)}입니다.</li><li>양변에 ${format(result.divisor)}를 곱하면 ${format(result.divisor)}×${decimalHundredths(result.lowerHundredths)}≤n&lt;${format(result.divisor)}×${decimalHundredths(result.upperHundredths)}입니다. 즉 ${decimalHundredths(result.lowerProductHundredths)}≤n&lt;${decimalHundredths(result.upperProductHundredths)}이므로 자연수는 ${format(result.first)}부터 ${format(result.last)}까지입니다.</li><li>자연수는 모두 ${format(result.count)}개입니다.</li><li>합은 (${format(result.first)}+${format(result.last)})×${format(result.count)}÷2=${format(result.sum)}입니다.</li></ol></div>`;
    return Object.freeze({
      prompt: `<div class="source52-u4-p43-m6-question" data-source-item="${sourceItemId}" data-source-item-id="${sourceItemId}" data-pool-index="${poolIndex}" data-difficulty-offset="${difficultyOffset}"><p>${prompt}</p></div>`,
      answer: format(result.sum), solution, sourceItemId, generator: generatorKey,
      generationMode: "fixed-verified-pool", verifiedPoolIndex: poolIndex, verifiedVariantCount: pools.length,
      verifiedVariantTarget: pools.length, verifiedVariantId: `${sourceItemId}:v${poolIndex}`,
      variantProvenance: "synthetic-source-structure",
      difficultyOffset, difficultyLevel: difficultyOffset + 1, difficultyRank: difficultyOffset + 1,
      sourceDifficultyRank: 1, difficultyDesign: ["guided-rounding-interval", "integer-boundary-range", "independent-arithmetic-series-sum"][difficultyOffset + 1],
      reasoningSteps: 4, sourceStepCount: 1, difficultyStepDelta: difficultyOffset,
      sourceStructurePreserved: true, sourcePdfPage: 39, sourcePrintedPage: 43,
      questionModel: result, answerModel: result, answerVisualRequired: false, answerVisualStatus: "not-required",
      publisherKeyVerified: false, publisherAnswerVerified: false, handwrittenAnswerVerified: false,
      answerVerification: "exact-rational-rounding-interval-and-integer-sum"
    });
  }

  function belongs(type) { return Boolean(type && (type.id === sourceItemId || type.sourceItemId === sourceItemId || type.generatorKey === generatorKey)); }
  function resolves(type) { return Boolean(type && type.id === sourceItemId && type.sourceItemId === sourceItemId && type.generatorKey === generatorKey && type.sourceVerified === true && type.reviewLocked === false); }
  function generate(type, user, difficultyOffset, seed, variant = 0) {
    if (!belongs(type) || !resolves(type)) return null;
    if (!Number.isSafeInteger(variant) || variant < 0) throw new RangeError("고정 변형 번호는 0 이상의 정수여야 합니다.");
    return getQuestion(variant % pools.length, [-1, 0, 1].includes(difficultyOffset) ? difficultyOffset : 0);
  }
  function install(target) {
    const api = target?.HSE_GENERATORS;
    if (!api || typeof api.generatorKey !== "function" || typeof api.generate !== "function") return false;
    if (api.__source52U4Page43Mission6Installed) return true;
    const oldKey = api.generatorKey.bind(api), oldGenerate = api.generate.bind(api);
    api.generatorKey = type => belongs(type) ? (resolves(type) ? generatorKey : "") : oldKey(type);
    api.generate = (type, user, difficulty, seed, variant = 0) => belongs(type) ? generate(type, user, difficulty, seed, variant) : oldGenerate(type, user, difficulty, seed, variant);
    if (Array.isArray(api.names) && !api.names.includes(generatorKey)) api.names.push(generatorKey);
    Object.defineProperty(api, "__source52U4Page43Mission6Installed", { value: true });
    return true;
  }
  return Object.freeze({ sourceItemId, generatorKey, pools, calculate, getQuestion, generate, belongs, resolves, install });
});
