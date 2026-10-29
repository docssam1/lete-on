(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_U4_PAGE43_MISSION2 = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";
  const id = "5-2-u4-e1-mission-2";
  const key = "source52FieldCropRemainderAreaDifferencePage43Mission2";
  // Rates are stored as hundredths (24 means 0.24). Areas use ten-thousandths of m².
  const pools = Object.freeze([
    { length: 36, width: 40, cabbageHundredths: 24, sweetPotatoHundredths: 30 },
    { length: 32, width: 45, cabbageHundredths: 20, sweetPotatoHundredths: 30 },
    { length: 28, width: 50, cabbageHundredths: 30, sweetPotatoHundredths: 40 }
  ].map(Object.freeze));
  const formatArea = tenThousandths => {
    const whole = Math.trunc(tenThousandths / 10000);
    const fraction = String(tenThousandths % 10000).padStart(4, "0").replace(/0+$/, "");
    return fraction ? `${whole}.${fraction}` : String(whole);
  };
  const formatRate = hundredths => `0.${String(hundredths).padStart(2, "0")}`.replace(/0+$/, "").replace(/\.$/, "");
  const esc = value => String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));

  function calculate(pool) {
    if (!pool || !Number.isSafeInteger(pool.length) || pool.length <= 0 || !Number.isSafeInteger(pool.width) || pool.width <= 0
      || !Number.isSafeInteger(pool.cabbageHundredths) || pool.cabbageHundredths <= 0 || pool.cabbageHundredths >= 100
      || !Number.isSafeInteger(pool.sweetPotatoHundredths) || pool.sweetPotatoHundredths <= 0 || pool.sweetPotatoHundredths >= 100) {
      throw new TypeError("확인된 밭의 넓이와 비율 조건만 사용할 수 있습니다.");
    }
    const fieldArea = pool.length * pool.width;
    const fieldAreaTenThousandths = fieldArea * 10000;
    const cabbageTenThousandths = fieldAreaTenThousandths * pool.cabbageHundredths / 100;
    const remainingTenThousandths = fieldAreaTenThousandths - cabbageTenThousandths;
    const sweetPotatoTenThousandths = remainingTenThousandths * pool.sweetPotatoHundredths / 100;
    const differenceTenThousandths = Math.abs(sweetPotatoTenThousandths - cabbageTenThousandths);
    if (![cabbageTenThousandths, remainingTenThousandths, sweetPotatoTenThousandths, differenceTenThousandths].every(Number.isSafeInteger)) {
      throw new Error("정확하게 계산되는 넓이만 사용할 수 있습니다.");
    }
    return Object.freeze({
      fieldArea, fieldAreaTenThousandths, cabbageTenThousandths, remainingTenThousandths,
      sweetPotatoTenThousandths, differenceTenThousandths,
      cabbageArea: formatArea(cabbageTenThousandths), remainingArea: formatArea(remainingTenThousandths),
      sweetPotatoArea: formatArea(sweetPotatoTenThousandths), difference: formatArea(differenceTenThousandths),
      cabbageRate: formatRate(pool.cabbageHundredths), sweetPotatoRate: formatRate(pool.sweetPotatoHundredths)
    });
  }

  function build(poolIndex = 0, difficultyOffset = 0) {
    if (!Number.isSafeInteger(poolIndex) || poolIndex < 0 || poolIndex >= pools.length) throw new RangeError("확인된 수치 묶음 0~2만 사용할 수 있습니다.");
    if (![-1, 0, 1].includes(difficultyOffset)) throw new RangeError("난이도 오프셋은 -1, 0, 1이어야 합니다.");
    const pool = pools[poolIndex];
    const result = calculate(pool);
    const itemPrompt = `가로와 세로가 각각 ${pool.length}m, ${pool.width}m인 밭의 전체 넓이 중 ${result.cabbageRate}에는 배추를 심고, 남은 넓이의 ${result.sweetPotatoRate}에는 고구마를 심었습니다. 배추밭과 고구마밭의 넓이 차를 구하여라.`;
    const hint = difficultyOffset < 0
      ? '<p class="source52-u4-p43-m2-hint">도움말: 먼저 밭 전체 넓이와 배추밭 넓이를 구하세요. 고구마는 배추를 심고 남은 넓이를 기준으로 계산합니다.</p>'
      : difficultyOffset > 0
        ? '<p class="source52-u4-p43-m2-hint">풀이할 때 “남은 넓이의 비율”이 어느 넓이를 기준으로 하는지 먼저 확인하세요.</p>'
        : "";
    const steps = [
      `전체 넓이: ${pool.length}×${pool.width}=${result.fieldArea}m²`,
      `배추밭: ${result.fieldArea}×${result.cabbageRate}=${result.cabbageArea}m²`,
      `남은 땅: ${result.fieldArea}−${result.cabbageArea}=${result.remainingArea}m²`,
      `고구마밭(남은 땅 기준): ${result.remainingArea}×${result.sweetPotatoRate}=${result.sweetPotatoArea}m²`,
      `넓이 차: ${result.sweetPotatoTenThousandths >= result.cabbageTenThousandths ? result.sweetPotatoArea : result.cabbageArea}−${result.sweetPotatoTenThousandths >= result.cabbageTenThousandths ? result.cabbageArea : result.sweetPotatoArea}=${result.difference}m²`
    ];
    const prompt = `<div class="source52-u4-p43-m2-question" data-source-item-id="${id}" data-pool-index="${poolIndex}" data-difficulty-offset="${difficultyOffset}"><p>${esc(itemPrompt)}</p>${hint}</div>`;
    const solution = `<div class="source52-u4-p43-m2-solution" data-source-answer="${id}" data-pool-index="${poolIndex}"><ol>${steps.map(step => `<li>${esc(step)}</li>`).join("")}</ol><table class="source52-u4-p43-m2-work-table"><tbody><tr><th>밭 전체</th><td>${result.fieldArea}m²</td></tr><tr><th>배추밭</th><td>${result.cabbageArea}m²</td></tr><tr><th>남은 넓이</th><td>${result.remainingArea}m²</td></tr><tr><th>고구마밭</th><td>${result.sweetPotatoArea}m²</td></tr></tbody></table><p class="source52-u4-p43-m2-answer"><strong>답: ${result.difference}m²</strong></p></div>`;
    return Object.freeze({
      prompt, answer: `${result.difference}m²`, solution, sourceItemId: id, generator: key,
      generationMode: "fixed-verified-pool", verifiedPoolIndex: poolIndex,
      verifiedVariantCount: pools.length, verifiedVariantTarget: pools.length,
      verifiedVariantId: `${id}:v${poolIndex}`, variantProvenance: "synthetic-source-structure",
      difficultyOffset, difficultyLevel: difficultyOffset + 1, difficultyRank: difficultyOffset + 1,
      sourceDifficultyRank: 1,
      difficultyDesign: ["guided-remainder-share", "separate-total-and-remainder", "remainder-base-check"][difficultyOffset + 1],
      reasoningSteps: 5, sourceStepCount: 1, difficultyStepDelta: difficultyOffset,
      sourceStructurePreserved: true, sourcePdfPage: 39, sourcePrintedPage: 43,
      questionModel: { ...pool, answerModel: result }, answerModel: { ...result, answer: `${result.difference}m²` },
      answerVisualRequired: false, answerVisualStatus: "not-required",
      publisherKeyVerified: false, publisherAnswerVerified: false, handwrittenAnswerVerified: false,
      answerVerification: "exact-total-cabbage-remainder-and-sweet-potato-area-difference"
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
    if (api.__source52U4Page43Mission2Installed) return true;
    const oldKey = api.generatorKey.bind(api); const oldGenerate = api.generate.bind(api);
    api.generatorKey = type => belongs(type) ? (resolves(type) ? key : "") : oldKey(type);
    api.generate = (type, user, difficulty, seed, variant = 0) => belongs(type) ? generate(type, user, difficulty, seed, variant) : oldGenerate(type, user, difficulty, seed, variant);
    if (Array.isArray(api.names) && !api.names.includes(key)) api.names.push(key);
    Object.defineProperty(api, "__source52U4Page43Mission2Installed", { value: true });
    return true;
  }
  return Object.freeze({ id, key, pools, calculate, build, generate, belongs, resolves, install });
});
