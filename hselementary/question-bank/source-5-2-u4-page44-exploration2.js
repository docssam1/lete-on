(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_U4_PAGE44_EXPLORATION2 = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";
  const sourceItemId = "5-2-u4-e2-exploration";
  const generatorKey = "source52DecimalProductMissingDigitsPage44Exploration2";
  const pools = Object.freeze([
    Object.freeze({ multiplicandTenThousand: 5412, multiplierHundredThousand: 63847 }),
    Object.freeze({ multiplicandTenThousand: 4251, multiplierHundredThousand: 81627 }),
    Object.freeze({ multiplicandTenThousand: 3461, multiplierHundredThousand: 31681 })
  ]);
  const formatInteger = value => BigInt(value).toLocaleString("ko-KR");
  const formatOperand = (value, decimalPlaces) => {
    const digits = String(value).padStart(decimalPlaces, "0");
    return `0.${digits}`;
  };

  function calculate(multiplicandTenThousand, multiplierHundredThousand) {
    if (!Number.isSafeInteger(multiplicandTenThousand) || multiplicandTenThousand <= 0
      || !Number.isSafeInteger(multiplierHundredThousand) || multiplierHundredThousand <= 0) {
      throw new TypeError("두 양의 정수 곱을 입력해 주세요.");
    }
    const product = BigInt(multiplicandTenThousand) * BigInt(multiplierHundredThousand);
    if (product >= 1000000000n) throw new RangeError("곱은 1보다 작은 소수여야 합니다.");
    const digits = product.toString().padStart(9, "0");
    const missingDigits = Object.freeze([Number(digits[3]), Number(digits[8])]);
    if (missingDigits.some(digit => !Number.isInteger(digit) || digit < 1 || digit > 9)) {
      throw new RangeError("빈칸에는 1부터 9까지 한 자리 자연수가 들어가야 합니다.");
    }
    return Object.freeze({
      multiplicandTenThousand,
      multiplierHundredThousand,
      multiplicand: formatOperand(multiplicandTenThousand, 4),
      multiplier: formatOperand(multiplierHundredThousand, 5),
      productInteger: product.toString(),
      productDigits: digits,
      product: `0.${digits}`,
      maskedProduct: `0.${digits.slice(0, 3)}□${digits.slice(4, 8)}□`,
      missingDigits,
      answer: `(${missingDigits[0]}, ${missingDigits[1]})`
    });
  }

  function getQuestion(poolIndex = 0, difficultyOffset = 0) {
    if (!Number.isSafeInteger(poolIndex) || poolIndex < 0 || poolIndex >= pools.length || ![-1, 0, 1].includes(difficultyOffset)) return null;
    const pool = pools[poolIndex];
    const result = calculate(pool.multiplicandTenThousand + difficultyOffset * 3, pool.multiplierHundredThousand);
    const labeledProduct = `0.${result.productDigits.slice(0, 3)}㉠${result.productDigits.slice(4, 8)}㉡`;
    const prompt = `다음을 만족하는 한 자리 자연수 ㉠과 ㉡을 각각 구하세요. <span class="source52-u4-p44-equation">${result.multiplicand}×${result.multiplier}=${labeledProduct}</span>`;
    const solution = `<div class="source52-u4-p44-e2-solution" data-source-answer="${sourceItemId}" data-pool-index="${poolIndex}"><ol><li>먼저 소수점을 빼고 곱하면 ${formatInteger(result.multiplicandTenThousand)}×${formatInteger(result.multiplierHundredThousand)}=${formatInteger(result.productInteger)}입니다.</li><li>두 수의 소수 자릿수는 4+5=9이므로 곱은 ${result.product}입니다.</li><li>곱의 소수점 아래 네 번째와 아홉 번째 자리 숫자를 읽으면 ㉠=${result.missingDigits[0]}, ㉡=${result.missingDigits[1]}입니다.</li></ol></div>`;
    return Object.freeze({
      prompt: `<div class="source52-u4-p44-e2-question" data-source-item="${sourceItemId}" data-source-item-id="${sourceItemId}" data-pool-index="${poolIndex}" data-difficulty-offset="${difficultyOffset}"><p>${prompt}</p></div>`,
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
      difficultyDesign: ["guided-decimal-place-count", "exact-integer-product", "independent-digit-position-check"][difficultyOffset + 1],
      reasoningSteps: 3,
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
      answerVerification: "exact-integer-decimal-product-and-digit-extraction"
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
    if (api.__source52U4Page44Exploration2Installed) return true;
    const oldKey = api.generatorKey.bind(api), oldGenerate = api.generate.bind(api);
    api.generatorKey = type => belongs(type) ? (resolves(type) ? generatorKey : "") : oldKey(type);
    api.generate = (type, user, difficulty, seed, variant = 0) => belongs(type) ? generate(type, user, difficulty, seed, variant) : oldGenerate(type, user, difficulty, seed, variant);
    if (Array.isArray(api.names) && !api.names.includes(generatorKey)) api.names.push(generatorKey);
    Object.defineProperty(api, "__source52U4Page44Exploration2Installed", { value: true });
    return true;
  }
  return Object.freeze({ sourceItemId, generatorKey, pools, calculate, getQuestion, generate, belongs, resolves, install });
});
