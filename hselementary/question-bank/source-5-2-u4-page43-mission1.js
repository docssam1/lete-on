(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_U4_PAGE43_MISSION1 = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const id = "5-2-u4-e1-mission-1";
  const key = "source52DecimalNaturalProductsPage43Mission1";
  const pools = Object.freeze([
    [[36, 125], [80, 375], [24, 125], [15, 84, true]],
    [[72, 125], [40, 620], [16, 325], [28, 84, true]],
    [[28, 150], [70, 360], [24, 175], [16, 85, true]]
  ].map(entries => Object.freeze(entries.map(([hundredths, natural, naturalFirst = false]) => Object.freeze({ hundredths, natural, naturalFirst })))));
  const fmt = value => {
    const integer = Math.trunc(value / 100);
    const decimal = String(value % 100).padStart(2, "0").replace(/0+$/, "");
    return decimal ? `${integer}.${decimal}` : String(integer);
  };
  const esc = value => String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
  function calculate(pool) {
    if (!Array.isArray(pool) || pool.length !== 4 || pool.some(item => !Number.isSafeInteger(item.hundredths) || item.hundredths <= 0 || !Number.isSafeInteger(item.natural) || item.natural <= 0)) throw new TypeError("확인된 네 곱셈식만 사용할 수 있습니다.");
    return pool.map(item => {
      const productHundredths = item.hundredths * item.natural;
      return Object.freeze({ ...item, productHundredths, answer: fmt(productHundredths) });
    });
  }
  function build(poolIndex = 0, difficultyOffset = 0) {
    if (!Number.isSafeInteger(poolIndex) || poolIndex < 0 || poolIndex >= pools.length) throw new RangeError("확인된 수치 묶음 0~2만 사용할 수 있습니다.");
    if (![-1, 0, 1].includes(difficultyOffset)) throw new RangeError("난이도 오프셋은 -1, 0, 1이어야 합니다.");
    const items = calculate(pools[poolIndex]);
    const hint = difficultyOffset < 0 ? '<p class="source52-u4-p43-m1-hint">도움말: 소수점을 잠시 떼고 자연수의 곱을 구한 뒤, 처음 소수의 자릿수만큼 소수점을 옮기세요.</p>' : "";
    const rows = items.map((item, index) => {
      const expression = item.naturalFirst ? `${item.natural} × ${fmt(item.hundredths)}` : `${fmt(item.hundredths)} × ${item.natural}`;
      return { prompt: `<span class="source52-u4-p43-m1-index">(${index + 1})</span> ${expression}`,
        solution: `${expression} = ${item.hundredths} × ${item.natural} ÷ 100 = ${item.hundredths * item.natural} ÷ 100 = ${item.answer}` };
    });
    const prompt = `<div class="source52-u4-p43-m1-question" data-source-item-id="${id}" data-pool-index="${poolIndex}" data-difficulty-offset="${difficultyOffset}"><p>다음 곱셈을 하여라.</p><ol>${rows.map(row => `<li>${row.prompt}</li>`).join("")}</ol>${hint}</div>`;
    const solution = `<div class="source52-u4-p43-m1-solution" data-source-answer="${id}" data-pool-index="${poolIndex}"><ol>${rows.map(row => `<li>${esc(row.solution)}</li>`).join("")}</ol><p class="source52-u4-p43-m1-answer">답: ${items.map(item => item.answer).join(", ")}</p></div>`;
    return Object.freeze({
      prompt, answer: `(${items.map(item => item.answer).join(", ")})`, solution,
      sourceItemId: id, generator: key, generationMode: "fixed-verified-pool", verifiedPoolIndex: poolIndex,
      verifiedVariantCount: pools.length, verifiedVariantTarget: pools.length, verifiedVariantId: `${id}:v${poolIndex}`,
      variantProvenance: "synthetic-source-structure", difficultyOffset, difficultyLevel: difficultyOffset + 1,
      difficultyRank: difficultyOffset + 1, sourceDifficultyRank: 1,
      difficultyDesign: ["guided-decimal-placement", "independent-hundredths-products", "four-product-fluency"][difficultyOffset + 1],
      reasoningSteps: 4, sourceStepCount: 4, difficultyStepDelta: difficultyOffset, sourceStructurePreserved: true,
      sourcePdfPage: 39, sourcePrintedPage: 43,
      questionModel: { expressions: pools[poolIndex].map(item => ({ decimal: fmt(item.hundredths), natural: item.natural, naturalFirst: item.naturalFirst })) },
      answerModel: { orderedAnswers: items.map(item => item.answer), productHundredths: items.map(item => item.productHundredths) },
      answerVisualRequired: false, answerVisualStatus: "not-required", publisherKeyVerified: false,
      publisherAnswerVerified: false, handwrittenAnswerVerified: false, answerVerification: "exact-hundredths-times-natural-number"
    });
  }
  function belongs(type) { return Boolean(type && (type.id === id || type.sourceItemId === id || type.generatorKey === key)); }
  function resolves(type) { return Boolean(type && type.id === id && type.sourceItemId === id && type.generatorKey === key && type.sourceVerified === true && type.reviewLocked === false); }
  function generate(type, user, difficultyOffset, seed, variant = 0) {
    if (!belongs(type) || !resolves(type)) return null;
    if (!Number.isSafeInteger(variant) || variant < 0) throw new RangeError("고정 변형 번호는 0 이상의 정수여야 합니다.");
    return build(variant % pools.length, [-1, 0, 1].includes(difficultyOffset) ? difficultyOffset : 0);
  }
  function install(target) {
    const api = target?.HSE_GENERATORS;
    if (!api || typeof api.generatorKey !== "function" || typeof api.generate !== "function") return false;
    if (api.__source52U4Page43Mission1Installed) return true;
    const oldKey = api.generatorKey.bind(api); const oldGenerate = api.generate.bind(api);
    api.generatorKey = type => belongs(type) ? (resolves(type) ? key : "") : oldKey(type);
    api.generate = (type, user, difficulty, seed, variant = 0) => belongs(type) ? generate(type, user, difficulty, seed, variant) : oldGenerate(type, user, difficulty, seed, variant);
    if (Array.isArray(api.names) && !api.names.includes(key)) api.names.push(key);
    Object.defineProperty(api, "__source52U4Page43Mission1Installed", { value: true });
    return true;
  }
  return Object.freeze({ id, key, pools, calculate, build, generate, belongs, resolves, install });
});
