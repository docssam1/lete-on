(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_U4_PAGE44_EXAMPLE22 = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";
  const sourceItemId = "5-2-u4-e2-example-2";
  const generatorKey = "source52RoundedQuotientRangePage44Example22";
  const pools = Object.freeze([
    Object.freeze({ divisorTenths: 152, targetTenths: 37 }),
    Object.freeze({ divisorTenths: 124, targetTenths: 42 }),
    Object.freeze({ divisorTenths: 216, targetTenths: 28 })
  ]);
  const decimal = (value, places = 1) => {
    const digits = String(value).padStart(places + 1, "0");
    const whole = digits.slice(0, -places);
    const fraction = digits.slice(-places).replace(/0+$/, "");
    return fraction ? `${whole}.${fraction}` : whole;
  };

  function calculate(divisorTenths, targetTenths) {
    if (!Number.isSafeInteger(divisorTenths) || divisorTenths <= 0 || divisorTenths % 2 !== 0
      || !Number.isSafeInteger(targetTenths) || targetTenths <= 0) {
      throw new TypeError("양의 나누는 수와 목표 몫을 확인해 주세요.");
    }
    const lowerCents = divisorTenths * (2 * targetTenths - 1) / 2;
    const upperCents = divisorTenths * (2 * targetTenths + 1) / 2;
    if (!Number.isSafeInteger(lowerCents) || !Number.isSafeInteger(upperCents) || lowerCents <= 0 || upperCents <= lowerCents) {
      throw new RangeError("반올림 범위의 경계를 정확히 계산할 수 없습니다.");
    }
    const divisor = decimal(divisorTenths, 1);
    const target = decimal(targetTenths, 1);
    const lower = decimal(lowerCents, 2);
    const upper = decimal(upperCents, 2);
    const lowerQuotientHundredths = decimal(targetTenths * 10 - 5, 2);
    const upperQuotientHundredths = decimal(targetTenths * 10 + 5, 2);
    return Object.freeze({ divisorTenths, targetTenths, divisor, target, lowerCents, upperCents,
      lower, upper, lowerQuotientHundredths, upperQuotientHundredths, answer: `${lower}≤x<${upper}` });
  }

  function getQuestion(poolIndex = 0, difficultyOffset = 0) {
    if (!Number.isSafeInteger(poolIndex) || poolIndex < 0 || poolIndex >= pools.length || ![-1, 0, 1].includes(difficultyOffset)) return null;
    const pool = pools[poolIndex];
    const result = calculate(pool.divisorTenths, pool.targetTenths + difficultyOffset);
    const prompt = `어떤 수 x를 ${result.divisor}로 나눈 몫을 반올림하여 소수 첫째 자리까지 나타내면 ${result.target}입니다. x의 범위를 구하세요.`;
    const solution = `<div class="source52-u4-p44-e22-solution" data-source-answer="${sourceItemId}" data-pool-index="${poolIndex}"><ol><li>소수 첫째 자리까지 반올림해 ${result.target}이 되는 몫의 범위는 ${result.lowerQuotientHundredths}≤x÷${result.divisor}&lt;${result.upperQuotientHundredths}입니다. 아래쪽 경계는 포함하고 위쪽 경계는 포함하지 않습니다.</li><li>양변에 양수 ${result.divisor}를 곱해 부등호 방향을 그대로 유지합니다: ${result.divisor}×${result.lowerQuotientHundredths}≤x&lt;${result.divisor}×${result.upperQuotientHundredths}.</li><li>곱을 계산하면 ${result.lower}≤x&lt;${result.upper}입니다. 따라서 답은 ${result.answer}입니다.</li></ol></div>`;
    return Object.freeze({
      prompt: `<div class="source52-u4-p44-e22-question" data-source-item="${sourceItemId}" data-source-item-id="${sourceItemId}" data-pool-index="${poolIndex}" data-difficulty-offset="${difficultyOffset}"><p>${prompt}</p></div>`,
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
      difficultyDesign: ["guided-rounding-interval", "positive-divisor-boundary-scaling", "independent-half-open-range-check"][difficultyOffset + 1],
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
      answerVerification: "exact-rational-rounding-and-half-open-interval"
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
    if (api.__source52U4Page44Example22Installed) return true;
    const oldKey = api.generatorKey.bind(api), oldGenerate = api.generate.bind(api);
    api.generatorKey = type => belongs(type) ? (resolves(type) ? generatorKey : "") : oldKey(type);
    api.generate = (type, user, difficulty, seed, variant = 0) => belongs(type) ? generate(type, user, difficulty, seed, variant) : oldGenerate(type, user, difficulty, seed, variant);
    if (Array.isArray(api.names) && !api.names.includes(generatorKey)) api.names.push(generatorKey);
    Object.defineProperty(api, "__source52U4Page44Example22Installed", { value: true });
    return true;
  }
  return Object.freeze({ sourceItemId, generatorKey, pools, calculate, getQuestion, generate, belongs, resolves, install });
});
