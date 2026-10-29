(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_U4_PAGE42_EXAMPLE14 = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const id = "5-2-u4-e1-example-4";
  const key = "source52SpoiledFruitProfitPricePage42Example14";
  const pools = Object.freeze([
    { fruitCount: 200, purchaseCost: 72000, spoiledPercent: 10, profitPercent: 25 },
    { fruitCount: 240, purchaseCost: 84000, spoiledPercent: 12.5, profitPercent: 15 },
    { fruitCount: 250, purchaseCost: 90000, spoiledPercent: 20, profitPercent: 10 }
  ].map(Object.freeze));
  const comma = value => Number(value).toLocaleString("en-US");
  const percent = value => `${Number.isInteger(value) ? value : String(value)}%`;
  const esc = value => String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));

  function calculate(pool) {
    if (!Number.isSafeInteger(pool.fruitCount) || pool.fruitCount <= 0
      || !Number.isSafeInteger(pool.purchaseCost) || pool.purchaseCost <= 0
      || !Number.isFinite(pool.spoiledPercent) || pool.spoiledPercent < 0 || pool.spoiledPercent >= 100
      || !Number.isFinite(pool.profitPercent) || pool.profitPercent < 0) {
      throw new TypeError("확인된 수량과 비율 조건만 사용할 수 있습니다.");
    }
    const spoiledNumerator = pool.fruitCount * pool.spoiledPercent;
    const spoiled = spoiledNumerator / 100;
    const saleable = pool.fruitCount - spoiled;
    const profitNumerator = pool.purchaseCost * pool.profitPercent;
    const desiredProfit = profitNumerator / 100;
    const targetRevenue = pool.purchaseCost + desiredProfit;
    if (!Number.isInteger(spoiled) || !Number.isInteger(saleable) || saleable <= 0
      || !Number.isInteger(desiredProfit) || !Number.isInteger(targetRevenue)
      || targetRevenue % saleable !== 0) {
      throw new Error("상한 수량·목표 매출·한 개 판매값이 모두 정확한 자연수가 되는 묶음만 사용할 수 있습니다.");
    }
    const price = targetRevenue / saleable;
    return Object.freeze({
      spoiled, saleable, desiredProfit, targetRevenue, price,
      spoiledPercent: percent(pool.spoiledPercent),
      profitPercent: percent(pool.profitPercent)
    });
  }

  function build(poolIndex = 0, difficultyOffset = 0) {
    if (!Number.isSafeInteger(poolIndex) || poolIndex < 0 || poolIndex >= pools.length) throw new RangeError("확인된 수치 묶음 0~2만 사용할 수 있습니다.");
    if (![-1, 0, 1].includes(difficultyOffset)) throw new RangeError("난이도 오프셋은 -1, 0, 1이어야 합니다.");
    const pool = pools[poolIndex];
    const result = calculate(pool);
    const spoiledRatio = String(pool.spoiledPercent / 100);
    const profitRatio = String(pool.profitPercent / 100);
    const itemPrompt = `귤 ${comma(pool.fruitCount)}개를 ${comma(pool.purchaseCost)}원에 사 왔습니다. 이 중 전체의 ${spoiledRatio}가 상해 버렸습니다. 남은 귤을 모두 같은 가격에 팔아 귤을 산 가격의 ${profitRatio}만큼 이익을 얻으려면 귤 한 개에 얼마씩 팔아야 하는지 구하여라.`;
    const hint = difficultyOffset < 0
      ? `<p class="source52-u4-p42-e14-hint">도움말: 먼저 팔 수 있는 귤의 수를 구하고, 전체 구입 가격에 이익을 더한 금액을 그 수로 나누세요.</p>`
      : "";
    const steps = [
      `상한 귤은 ${comma(pool.fruitCount)}×${spoiledRatio}=${comma(result.spoiled)}개이므로, 팔 수 있는 귤은 ${comma(pool.fruitCount)}−${comma(result.spoiled)}=${comma(result.saleable)}개입니다.`,
      `얻으려는 이익은 전체 구입 가격의 ${profitRatio}이므로 ${comma(pool.purchaseCost)}×${profitRatio}=${comma(result.desiredProfit)}원입니다.`,
      `필요한 전체 판매 금액은 구입 가격과 이익의 합인 ${comma(pool.purchaseCost)}+${comma(result.desiredProfit)}=${comma(result.targetRevenue)}원입니다.`,
      `한 개 판매값은 ${comma(result.targetRevenue)}÷${comma(result.saleable)}=${comma(result.price)}원이므로 귤 한 개에 ${comma(result.price)}원씩 팔면 됩니다.`
    ];
    const prompt = `<div class="source52-u4-p42-e14-question" data-source-item-id="${id}" data-pool-index="${poolIndex}" data-difficulty-offset="${difficultyOffset}"><p>${esc(itemPrompt)}</p>${hint}</div>`;
    const solution = `<div class="source52-u4-p42-e14-solution" data-source-answer="${id}" data-pool-index="${poolIndex}"><ol>${steps.map(step => `<li>${esc(step)}</li>`).join("")}</ol><table class="source52-u4-p42-e14-work-table"><tbody><tr><th>팔 수 있는 귤</th><td>${comma(result.saleable)}개</td></tr><tr><th>목표 판매 금액</th><td>${comma(result.targetRevenue)}원</td></tr><tr><th>귤 한 개 값</th><td>${comma(result.price)}원</td></tr></tbody></table><p class="source52-u4-p42-e14-answer"><strong>답: ${comma(result.price)}원</strong></p></div>`;
    return Object.freeze({
      prompt, answer: `${result.price}원`, solution, sourceItemId: id, generator: key,
      generationMode: "fixed-verified-pool", verifiedPoolIndex: poolIndex,
      verifiedVariantCount: pools.length, verifiedVariantTarget: pools.length,
      verifiedVariantId: `${id}:v${poolIndex}`, variantProvenance: "synthetic-source-structure",
      difficultyOffset, difficultyLevel: difficultyOffset + 1, difficultyRank: difficultyOffset + 1,
      sourceDifficultyRank: 1,
      difficultyDesign: ["guided-saleable-and-target-total", "separate-profit-from-cost", "full-reverse-price-reasoning"][difficultyOffset + 1],
      reasoningSteps: 4, sourceStepCount: 1, difficultyStepDelta: difficultyOffset,
      sourceStructurePreserved: true, sourcePdfPage: 38, sourcePrintedPage: 42,
      questionModel: { fruitCount: pool.fruitCount, purchaseCost: pool.purchaseCost, spoiledPercent: pool.spoiledPercent, profitPercent: pool.profitPercent },
      answerModel: { ...result, answer: `${result.price}원` },
      answerVisualRequired: false, answerVisualStatus: "not-required",
      publisherKeyVerified: false, publisherAnswerVerified: false,
      handwrittenAnswerVerified: false, answerVerification: "exact-saleable-count-and-profit-revenue-division"
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
    if (api.__source52U4Page42Example14Installed) return true;
    const oldKey = api.generatorKey.bind(api);
    const oldGenerate = api.generate.bind(api);
    api.generatorKey = type => belongs(type) ? (resolves(type) ? key : "") : oldKey(type);
    api.generate = (type, user, difficulty, seed, variant = 0) => belongs(type) ? generate(type, user, difficulty, seed, variant) : oldGenerate(type, user, difficulty, seed, variant);
    if (Array.isArray(api.names) && !api.names.includes(key)) api.names.push(key);
    Object.defineProperty(api, "__source52U4Page42Example14Installed", { value: true });
    return true;
  }
  return Object.freeze({ id, key, pools, calculate, build, generate, belongs, resolves, install });
});
