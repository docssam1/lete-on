(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_U4_PAGE44_EXAMPLE21 = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";
  const sourceItemId = "5-2-u4-e2-example-1";
  const generatorKey = "source52DecimalPlaceScalingEquationsPage44Example21";
  const pools = Object.freeze([
    Object.freeze({ multiplicand: 364, multiplier: 28 }),
    Object.freeze({ multiplicand: 635, multiplier: 42 }),
    Object.freeze({ multiplicand: 728, multiplier: 35 })
  ]);
  const formatInteger = value => BigInt(value).toLocaleString("ko-KR");
  function formatScaled(value, decimalPlaces) {
    const digits = String(value).padStart(decimalPlaces + 1, "0");
    const integer = digits.slice(0, -decimalPlaces);
    const fraction = digits.slice(-decimalPlaces).replace(/0+$/, "");
    return fraction ? `${integer}.${fraction}` : integer;
  }

  function calculate(multiplicand, multiplier) {
    if (!Number.isSafeInteger(multiplicand) || multiplicand < 100 || multiplicand > 999
      || !Number.isSafeInteger(multiplier) || multiplier < 10 || multiplier > 99) {
      throw new TypeError("기준 곱셈식의 두 자연수를 확인해 주세요.");
    }
    const product = BigInt(multiplicand) * BigInt(multiplier);
    const values = Object.freeze([
      formatScaled(Number(product), 2),
      formatInteger(BigInt(multiplier) * 10n),
      formatScaled(multiplier, 1),
      formatInteger(multiplicand)
    ]);
    return Object.freeze({
      multiplicand,
      multiplier,
      product: product.toString(),
      referenceEquation: `${formatInteger(multiplicand)}×${formatInteger(multiplier)}=${formatInteger(product)}`,
      multiplicandHundredths: formatScaled(multiplicand, 2),
      multiplicandThousandths: formatScaled(multiplicand, 3),
      multiplierHundredThousandths: formatScaled(multiplier, 5),
      productHundredths: formatScaled(Number(product), 2),
      productTenths: formatScaled(Number(product), 1),
      productTenThousandths: formatScaled(Number(product), 4),
      productHundredThousandths: formatScaled(Number(product), 5),
      answerValues: values,
      answer: `(${values.join(", ")})`
    });
  }

  function getQuestion(poolIndex = 0, difficultyOffset = 0) {
    if (!Number.isSafeInteger(poolIndex) || poolIndex < 0 || poolIndex >= pools.length || ![-1, 0, 1].includes(difficultyOffset)) return null;
    const pool = pools[poolIndex];
    const result = calculate(pool.multiplicand + difficultyOffset * 3, pool.multiplier);
    const prompt = `${result.referenceEquation}을 이용하여 다음 식을 만족하는 ㉠, ㉡, ㉢, ㉣의 값을 각각 구하세요.`;
    const equations = [
      `${result.multiplicandHundredths}×${formatInteger(result.multiplier)}=㉠`,
      `${result.multiplicandHundredths}×㉡=${result.productTenths}`,
      `${result.multiplicandThousandths}×㉢=${result.productTenThousandths}`,
      `㉣×${result.multiplierHundredThousandths}=${result.productHundredThousandths}`
    ];
    const solution = `<div class="source52-u4-p44-e21-solution" data-source-answer="${sourceItemId}" data-pool-index="${poolIndex}"><p>기준식 ${result.referenceEquation}을 사용합니다.</p><ol><li>㉠: ${result.multiplicandHundredths}×${formatInteger(result.multiplier)}=(${formatInteger(result.multiplicand)}×${formatInteger(result.multiplier)})÷100=${result.productHundredths}입니다.</li><li>㉡: ${result.productTenths}÷${result.multiplicandHundredths}=(${formatInteger(result.product)}÷10)÷(${formatInteger(result.multiplicand)}÷100)=${formatInteger(result.multiplier)}×10=${result.answerValues[1]}입니다.</li><li>㉢: ${result.productTenThousandths}÷${result.multiplicandThousandths}=(${formatInteger(result.product)}÷10000)÷(${formatInteger(result.multiplicand)}÷1000)=${formatInteger(result.multiplier)}÷10=${result.answerValues[2]}입니다.</li><li>㉣: ${result.productHundredThousandths}÷${result.multiplierHundredThousandths}=(${formatInteger(result.product)}÷100000)÷(${formatInteger(result.multiplier)}÷100000)=${result.answerValues[3]}입니다.</li></ol></div>`;
    return Object.freeze({
      prompt: `<div class="source52-u4-p44-e21-question" data-source-item="${sourceItemId}" data-source-item-id="${sourceItemId}" data-pool-index="${poolIndex}" data-difficulty-offset="${difficultyOffset}"><p>${prompt}</p><div class="source52-u4-p44-e21-equations">${equations.map((equation, index) => `<p><span>(${index + 1})</span>${equation}</p>`).join("")}</div></div>`,
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
      difficultyDesign: ["decimal-place-guided-scaling", "equivalent-quotient-relations", "independent-scale-factor-check"][difficultyOffset + 1],
      reasoningSteps: 4,
      sourceStepCount: 1,
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
      answerVerification: "exact-integer-product-and-decimal-scale-ratios"
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
    if (api.__source52U4Page44Example21Installed) return true;
    const oldKey = api.generatorKey.bind(api), oldGenerate = api.generate.bind(api);
    api.generatorKey = type => belongs(type) ? (resolves(type) ? generatorKey : "") : oldKey(type);
    api.generate = (type, user, difficulty, seed, variant = 0) => belongs(type) ? generate(type, user, difficulty, seed, variant) : oldGenerate(type, user, difficulty, seed, variant);
    if (Array.isArray(api.names) && !api.names.includes(generatorKey)) api.names.push(generatorKey);
    Object.defineProperty(api, "__source52U4Page44Example21Installed", { value: true });
    return true;
  }
  return Object.freeze({ sourceItemId, generatorKey, pools, calculate, getQuestion, generate, belongs, resolves, install });
});
