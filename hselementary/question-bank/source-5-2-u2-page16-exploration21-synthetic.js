(function (root, factory) {
  "use strict";
  const exported = factory();
  if (typeof module === "object" && module.exports) module.exports = exported;
  root.HSE_SOURCE_52_U2_PAGE16_EXPLORATION21 = exported;
  exported.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";
  const sourceItemId = "5-2-u2-e2-exploration-1-synthetic";
  const generatorKey = "source52U2Page16Exploration21";
  const pools = Object.freeze([
    Object.freeze({ capacityNumerator: 3, capacityDenominator: 5, filledNumerator: 2, filledDenominator: 3 }),
    Object.freeze({ capacityNumerator: 7, capacityDenominator: 8, filledNumerator: 4, filledDenominator: 7 }),
    Object.freeze({ capacityNumerator: 7, capacityDenominator: 9, filledNumerator: 3, filledDenominator: 7 })
  ]);
  const esc = value => String(value).replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));
  const math = text => `<span class="math-inline-expression">${esc(text)}</span>`;
  const step = lines => `<span class="source52-u2-solution">${lines.map((line, index) => `<span class="source52-u2-step">${index + 1}. ${line}</span>`).join("")}</span>`;
  const gcd = (a, b) => { while (b) [a, b] = [b, a % b]; return a; };
  function derive(pool) {
    const { capacityNumerator: a, capacityDenominator: b, filledNumerator: c, filledDenominator: d } = pool;
    if (![a, b, c, d].every(Number.isSafeInteger) || a <= 0 || a >= b || c <= 0 || c >= d) throw new Error("용량과 채워진 비율은 양의 진분수여야 합니다.");
    const numerator = a * c, denominator = b * d, divisor = gcd(numerator, denominator);
    return { ...pool, numerator, denominator, simplifiedNumerator: numerator / divisor, simplifiedDenominator: denominator / divisor };
  }
  function build(pool, difficultyOffset) {
    const v = derive(pool);
    const capacity = `${v.capacityNumerator}/${v.capacityDenominator} L`, portion = `${v.filledNumerator}/${v.filledDenominator}`;
    const prompt = `들이가 ${math(capacity)}인 물통에 전체 용량의 ${math(portion)}만큼 물이 들어 있습니다. 물통에 들어 있는 물은 몇 L인가요?${difficultyOffset === -1 ? `<span class="source52-u2-hint">도움말: 전체 용량에 물이 차 있는 비율을 곱하세요.</span>` : ""}`;
    const product = `${v.capacityNumerator}/${v.capacityDenominator}×${v.filledNumerator}/${v.filledDenominator}`;
    const lines = [
      `물의 양은 물통 전체 용량의 ${math(portion)}이므로, 전체 용량에 이 분수를 곱합니다.`,
      `${math(`${product} = ${v.numerator}/${v.denominator}`)}입니다.`,
      `${math(`${v.numerator}/${v.denominator} = ${v.simplifiedNumerator}/${v.simplifiedDenominator}`)}로 약분합니다.`,
      `따라서 물통에 들어 있는 물은 ${math(`${v.simplifiedNumerator}/${v.simplifiedDenominator} L`)}입니다.`
    ];
    if (difficultyOffset === -1) lines.splice(1, 0, "분자끼리 곱하고 분모끼리 곱합니다.");
    if (difficultyOffset === 1) lines.splice(2, 0, `곱을 계산한 뒤 분자와 분모를 ${gcd(v.numerator, v.denominator)}로 나누어 기약분수로 나타냅니다.`);
    return {
      prompt, answer: `${v.simplifiedNumerator}/${v.simplifiedDenominator} L`, solution: `<div data-source-answer="${sourceItemId}">${step(lines)}</div>`,
      questionModel: { kind: "fraction-of-container-capacity", ...pool },
      answerModel: { productNumerator: v.numerator, productDenominator: v.denominator, simplifiedNumerator: v.simplifiedNumerator, simplifiedDenominator: v.simplifiedDenominator }
    };
  }
  function generate(type, variant = 0, difficultyOffset = 0) {
    if (!type || type.sourceItemId !== sourceItemId || type.id !== sourceItemId || type.generatorKey !== generatorKey) return null;
    if (type.reviewLocked !== false || type.sourceVerified !== true) return null;
    if (!Number.isSafeInteger(variant) || variant < 0) throw new Error("고정 변형 번호가 올바르지 않습니다.");
    if (![-1, 0, 1].includes(difficultyOffset)) throw new Error("난이도는 -1, 0, 1이어야 합니다.");
    const poolIndex = variant % pools.length, item = build(pools[poolIndex], difficultyOffset);
    return Object.freeze({ ...item,
      prompt: `<div class="source52-u2-page16-exploration21" data-source-item="${sourceItemId}" data-source-item-id="${sourceItemId}" data-pool-index="${poolIndex}" data-variant="${poolIndex}" data-difficulty-offset="${difficultyOffset}" data-level="${difficultyOffset + 1}">${item.prompt}</div>`,
      sourceItemId, generator: generatorKey, generationMode: "fixed-verified-pool",
      verifiedPoolIndex: poolIndex, verifiedVariantCount: pools.length, verifiedVariantTarget: pools.length,
      verifiedVariantId: `${sourceItemId}:v${poolIndex}`, variantProvenance: "synthetic-source-structure",
      resultContract: "single-value-with-units", mathematicalContract: "fraction-of-capacity-multiplication-and-simplification",
      answerVisualRequired: false, answerVisualStatus: "not-required",
      difficultyDesign: ["guided-capacity-times-filled-fraction", "fraction-product-and-reduction", "explicit-product-and-greatest-common-divisor-check"][difficultyOffset + 1],
      reasoningSteps: difficultyOffset === -1 ? 5 : 4, sourceStructurePreserved: true,
      sourceEvidenceRef: "canonical-source:d870f8ab03e392a5ec8be1626ad380685d50bab5f8e410ec2ccfb7e578266463; printed p.16 Concept Exploration 2 (1); physical PDF p.12; original/clean scan + Apple Vision OCR",
      publisherKeyVerified: false, publisherAnswerVerified: false, handwrittenAnswerVerified: false,
      answerVerification: "independent-exact-fraction-product"
    });
  }
  function belongs(type) { return Boolean(type && (type.id === sourceItemId || type.sourceItemId === sourceItemId || type.generatorKey === generatorKey)); }
  function install(target) {
    const api = target?.HSE_GENERATORS;
    if (!api || typeof api.generatorKey !== "function" || typeof api.generate !== "function") return false;
    if (api.__source52U2Page16Exploration21Installed) return true;
    const previousKey = api.generatorKey.bind(api), previousGenerate = api.generate.bind(api);
    api.generatorKey = type => belongs(type) ? (type.id === sourceItemId && type.sourceItemId === sourceItemId && type.generatorKey === generatorKey && type.reviewLocked === false && type.sourceVerified === true ? generatorKey : "") : previousKey(type);
    api.generate = (type, unitIndex, difficultyOffset, seed, variant = 0) => belongs(type) ? generate(type, variant, difficultyOffset ?? 0) : previousGenerate(type, unitIndex, difficultyOffset, seed, variant);
    if (Array.isArray(api.names) && !api.names.includes(generatorKey)) api.names.push(generatorKey);
    Object.defineProperty(api, "__source52U2Page16Exploration21Installed", { value: true });
    return true;
  }
  return Object.freeze({ sourceItemId, generatorKey, pools, derive, build, generate, install });
});
