(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_U4_PAGE44_EXAMPLE23 = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";
  const sourceItemId = "5-2-u4-e2-example-3";
  const generatorKey = "source52RepeatedDecimalProductDigitAndPlacesPage44Example23";
  const pools = Object.freeze([
    Object.freeze({ repeatCount: 11, repeatedDigit: 3, lastHundredth: 4 }),
    Object.freeze({ repeatCount: 17, repeatedDigit: 5, lastHundredth: 5 }),
    Object.freeze({ repeatCount: 23, repeatedDigit: 7, lastHundredth: 6 })
  ]);

  function calculate(repeatCount, repeatedDigit, lastHundredth) {
    if (!Number.isSafeInteger(repeatCount) || repeatCount < 2 || repeatCount > 10000
      || !Number.isSafeInteger(repeatedDigit) || repeatedDigit < 1 || repeatedDigit > 9
      || !Number.isSafeInteger(lastHundredth) || lastHundredth < 2 || lastHundredth > 9) {
      throw new TypeError("반복 횟수와 한 자리 수를 확인해 주세요.");
    }
    const numerator = BigInt(repeatCount) * (BigInt(repeatedDigit) ** BigInt(repeatCount));
    const denominator = 10n ** BigInt(repeatCount);
    if (numerator >= denominator) throw new RangeError("소수점 아래 자리 수를 확인할 수 없는 값입니다.");
    const powerLastDigit = (BigInt(repeatedDigit) ** BigInt(repeatCount)) % 10n;
    const firstAnswer = Number(numerator % 10n);
    const factorial = Array.from({ length: lastHundredth }, (_, index) => BigInt(index + 1)).reduce((product, value) => product * value, 1n);
    const rawDecimalPlaces = 2 * lastHundredth + 1;
    let reducedNumerator = factorial;
    let trailingZeros = 0;
    while (reducedNumerator % 10n === 0n) {
      reducedNumerator /= 10n;
      trailingZeros += 1;
    }
    const decimalPlaces = rawDecimalPlaces - trailingZeros;
    const numeratorText = String(reducedNumerator).padStart(decimalPlaces + 1, "0");
    const productDecimal = `${numeratorText.slice(0, -decimalPlaces)}.${numeratorText.slice(-decimalPlaces)}`;
    return Object.freeze({
      repeatCount, repeatedDigit, lastHundredth, numerator: numerator.toString(),
      numeratorDigits: numerator.toString().length, powerLastDigit: Number(powerLastDigit),
      firstAnswer, factorial: factorial.toString(), reducedNumerator: reducedNumerator.toString(),
      rawDecimalPlaces, trailingZeros, decimalPlaces, productDecimal,
      answer: `(${firstAnswer}, ${decimalPlaces})`
    });
  }

  function getQuestion(poolIndex = 0, difficultyOffset = 0) {
    if (!Number.isSafeInteger(poolIndex) || poolIndex < 0 || poolIndex >= pools.length || ![-1, 0, 1].includes(difficultyOffset)) return null;
    const pool = pools[poolIndex];
    const adjustment = difficultyOffset;
    const result = calculate(pool.repeatCount, pool.repeatedDigit + adjustment, pool.lastHundredth + adjustment);
    const cycle = [];
    let digit = result.repeatedDigit;
    while (!cycle.includes(digit)) { cycle.push(digit); digit = digit * result.repeatedDigit % 10; }
    const cyclePosition = ((result.repeatCount - 1) % cycle.length) + 1;
    const cycleExplanation = `${result.repeatedDigit}의 거듭제곱의 일의 자리는 ${cycle.join(" → ")} 순서로 ${cycle.length}개씩 반복하며, ${result.repeatCount}번째는 이 순서의 ${cyclePosition}번째인 ${result.powerLastDigit}입니다.`;
    const decimalFactor = `0.0${result.lastHundredth}`;
    const prefix = "0.01×0.02×…";
    const prompt = `(1) ${result.repeatCount}에 0.${result.repeatedDigit}을 ${result.repeatCount}번 곱했을 때, 소수 ${result.repeatCount}번째 자리의 수는 무엇인가요? (2) ${prefix}×${decimalFactor}×0.1을 계산한 값은 소수 몇 자리 수인가요?`;
    const solution = `<div class="source52-u4-p44-e23-solution" data-source-answer="${sourceItemId}" data-pool-index="${poolIndex}"><ol><li>${result.repeatCount}에 0.${result.repeatedDigit}을 ${result.repeatCount}번 곱한 값은 (${result.repeatCount}×${result.repeatedDigit}<sup>${result.repeatCount}</sup>)÷10<sup>${result.repeatCount}</sup>입니다. 소수점 아래 ${result.repeatCount}번째 자리는 정수 ${result.repeatCount}×${result.repeatedDigit}<sup>${result.repeatCount}</sup>의 일의 자리와 같습니다.</li><li>${cycleExplanation} ${result.repeatCount}의 일의 자리는 ${result.repeatCount % 10}이므로, 곱의 일의 자리는 ${result.repeatCount % 10}×${result.powerLastDigit}의 일의 자리인 ${result.firstAnswer}입니다.</li><li>둘째 곱에서 0.01부터 0.0${result.lastHundredth}까지의 분자는 1×2×…×${result.lastHundredth}=${result.factorial}이고, 분모는 10<sup>${result.rawDecimalPlaces}</sup>입니다. 분자 끝의 0 ${result.trailingZeros}개를 약분하면 ${result.productDecimal}이므로 소수점 아래 자릿수는 ${result.decimalPlaces}자리입니다. 답은 ${result.answer}입니다.</li></ol></div>`;
    return Object.freeze({
      prompt: `<div class="source52-u4-p44-e23-question" data-source-item="${sourceItemId}" data-source-item-id="${sourceItemId}" data-pool-index="${poolIndex}" data-difficulty-offset="${difficultyOffset}"><p>${prompt}</p></div>`,
      answer: result.answer,
      solution,
      sourceItemId,
      generator: generatorKey,
      generationMode: "fixed-verified-pool",
      verifiedPoolIndex: poolIndex,
      verifiedVariantCount: pools.length,
      verifiedVariantTarget: pools.length,
      verifiedVariantId: `${sourceItemId}:v${poolIndex}`,
      variantProvenance: "synthetic-source-structure",
      difficultyOffset,
      difficultyLevel: difficultyOffset + 1,
      difficultyRank: difficultyOffset + 1,
      sourceDifficultyRank: 1,
      difficultyDesign: ["guided-units-digit-and-factorial-scaling", "independent-decimal-factor-count", "combined-last-digit-and-trailing-zero-check"][difficultyOffset + 1],
      reasoningSteps: 3,
      sourceStepCount: 2,
      difficultyStepDelta: difficultyOffset,
      sourceStructurePreserved: true,
      sourcePdfPage: 40,
      sourcePrintedPage: 44,
      questionModel: result,
      answerModel: result,
      answerVisualRequired: false,
      answerVisualStatus: "not-required",
      publisherKeyVerified: false,
      publisherAnswerVerified: false,
      handwrittenAnswerVerified: false,
      answerVerification: "exact-bigint-last-digit-and-decimal-place-count"
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
    if (api.__source52U4Page44Example23Installed) return true;
    const oldKey = api.generatorKey.bind(api), oldGenerate = api.generate.bind(api);
    api.generatorKey = type => belongs(type) ? (resolves(type) ? generatorKey : "") : oldKey(type);
    api.generate = (type, user, difficulty, seed, variant = 0) => belongs(type) ? generate(type, user, difficulty, seed, variant) : oldGenerate(type, user, difficulty, seed, variant);
    if (Array.isArray(api.names) && !api.names.includes(generatorKey)) api.names.push(generatorKey);
    Object.defineProperty(api, "__source52U4Page44Example23Installed", { value: true });
    return true;
  }
  return Object.freeze({ sourceItemId, generatorKey, pools, calculate, getQuestion, generate, belongs, resolves, install });
});
