(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_U4_PAGE42_EXAMPLE13 = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const id = "5-2-u4-e1-example-3";
  const key = "source52RoundingTruncationDecimalHundredthsPage42Example13";
  const pools = Object.freeze([
    { truncatedTens: 320, roundedTens: 330, multiplierTenths: 134, targetHundredthsDigit: 8 },
    { truncatedTens: 670, roundedTens: 680, multiplierTenths: 127, targetHundredthsDigit: 9 },
    { truncatedTens: 120, roundedTens: 130, multiplierTenths: 247, targetHundredthsDigit: 6 }
  ].map(Object.freeze));
  const comma = value => Number(value).toLocaleString("en-US");
  const fmtTenths = value => `${Math.floor(value / 10)}.${value % 10}`;
  const fmtHundredths = value => `${Math.floor(value / 100)}.${String(value % 100).padStart(2, "0")}`;
  const esc = value => String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));

  function calculate(pool) {
    if (!Number.isSafeInteger(pool.truncatedTens) || !Number.isSafeInteger(pool.roundedTens)
      || pool.truncatedTens % 10 !== 0 || pool.roundedTens % 10 !== 0
      || !Number.isSafeInteger(pool.multiplierTenths) || pool.multiplierTenths <= 0
      || !Number.isSafeInteger(pool.targetHundredthsDigit) || pool.targetHundredthsDigit < 0 || pool.targetHundredthsDigit > 9) {
      throw new TypeError("확인된 자리 수와 소수 조건만 사용할 수 있습니다.");
    }
    const lowerTenTimesX = Math.max(pool.truncatedTens, pool.roundedTens - 5);
    const upperTenTimesX = Math.min(pool.truncatedTens + 10, pool.roundedTens + 5);
    const candidates = [];
    for (let tenTimesX = lowerTenTimesX; tenTimesX < upperTenTimesX; tenTimesX += 1) {
      const productHundredths = tenTimesX * pool.multiplierTenths;
      const hundredthsDigit = productHundredths % 10;
      candidates.push(Object.freeze({
        tenTimesX,
        x: fmtTenths(tenTimesX),
        productHundredths,
        product: fmtHundredths(productHundredths),
        hundredthsDigit
      }));
    }
    const matches = candidates.filter(candidate => candidate.hundredthsDigit === pool.targetHundredthsDigit);
    if (matches.length !== 1) throw new Error(`소수 둘째 자리 조건의 답이 하나여야 합니다. 현재 ${matches.length}개입니다.`);
    return Object.freeze({
      lowerTenTimesX,
      upperTenTimesX,
      candidates: Object.freeze(candidates),
      matches: Object.freeze(matches),
      answer: matches[0].x,
      answerTenths: matches[0].tenTimesX,
      multiplier: fmtTenths(pool.multiplierTenths)
    });
  }

  function build(poolIndex = 0, difficultyOffset = 0) {
    if (!Number.isSafeInteger(poolIndex) || poolIndex < 0 || poolIndex >= pools.length) throw new RangeError("확인된 수치 묶음 0~2만 사용할 수 있습니다.");
    if (![-1, 0, 1].includes(difficultyOffset)) throw new RangeError("난이도 오프셋은 -1, 0, 1이어야 합니다.");
    const pool = pools[poolIndex];
    const result = calculate(pool);
    const tenTimesXRange = `${result.lowerTenTimesX} ≤ 10x < ${result.upperTenTimesX}`;
    const candidateList = result.candidates.map(candidate => candidate.x).join(", ");
    const tableRows = result.candidates.map(candidate => `<tr${candidate.tenTimesX === result.answerTenths ? ' class="is-answer"' : ""}><td>${candidate.x}</td><td>${candidate.product}</td><td>${candidate.hundredthsDigit}</td></tr>`).join("");
    const hint = difficultyOffset < 0
      ? `<p class="source52-u4-p42-e13-hint">도움말: 두 조건의 공통 범위를 먼저 찾고, 그 안의 한 자리 소수를 하나씩 곱해 보세요.</p>`
      : "";
    const steps = difficultyOffset < 0
      ? [
          `버림 조건에서 ${pool.truncatedTens} ≤ 10x < ${pool.truncatedTens + 10}이고, 반올림 조건에서 ${pool.roundedTens - 5} ≤ 10x < ${pool.roundedTens + 5}입니다.`,
          `두 범위의 공통 부분은 ${tenTimesXRange}이므로 x는 ${candidateList}입니다.`,
          `각 후보에 ${result.multiplier}를 곱해 소수 둘째 자리 숫자를 비교하면 ${result.answer}만 ${pool.targetHundredthsDigit}입니다.`
        ]
      : difficultyOffset === 0
        ? [
            `버림 조건은 ${pool.truncatedTens} ≤ 10x < ${pool.truncatedTens + 10}, 반올림 조건은 ${pool.roundedTens - 5} ≤ 10x < ${pool.roundedTens + 5}입니다.`,
            `공통 범위는 ${tenTimesXRange}이므로 한 자리 소수 후보는 ${candidateList}입니다.`,
            `표에서 ${result.multiplier}를 곱한 값의 소수 둘째 자리 숫자가 ${pool.targetHundredthsDigit}인 후보를 고르면 x=${result.answer}입니다.`
          ]
        : [
            `두 어림 조건의 교집합은 ${tenTimesXRange}, 즉 x∈{${candidateList}}입니다.`,
            `x∈{${candidateList}}에 각각 ${result.multiplier}를 곱하면 표의 값과 소수 둘째 자리 숫자를 얻습니다.`,
            `조건 ${pool.targetHundredthsDigit}을 만족하는 값은 x=${result.answer} 하나뿐입니다.`
          ];
    const prompt = `<div class="source52-u4-p42-e13-question" data-source-item-id="${id}" data-pool-index="${poolIndex}" data-difficulty-offset="${difficultyOffset}"><p>한 자리 소수 x에 10을 곱한 값을 버림하여 십의 자리까지 나타내면 ${pool.truncatedTens}, 반올림하여 십의 자리까지 나타내면 ${pool.roundedTens}입니다. 이 소수 한 자리 수에 ${result.multiplier}를 곱한 값의 소수 둘째 자리 숫자가 ${pool.targetHundredthsDigit}일 때, x를 구하여라.</p>${hint}</div>`;
    const solution = `<div class="source52-u4-p42-e13-solution" data-source-answer="${id}" data-pool-index="${poolIndex}"><ol>${steps.map(step => `<li>${esc(step)}</li>`).join("")}</ol><table class="source52-u4-p42-e13-candidate-table"><thead><tr><th>x</th><th>${result.multiplier}x</th><th>소수 둘째 자리 숫자</th></tr></thead><tbody>${tableRows}</tbody></table><p class="source52-u4-p42-e13-answer"><strong>답: ${result.answer}</strong></p></div>`;
    return Object.freeze({
      prompt, answer: result.answer, solution, sourceItemId: id, generator: key,
      generationMode: "fixed-verified-pool", verifiedPoolIndex: poolIndex,
      verifiedVariantCount: pools.length, verifiedVariantTarget: pools.length,
      verifiedVariantId: `${id}:v${poolIndex}`, variantProvenance: "synthetic-source-structure",
      difficultyOffset, difficultyLevel: difficultyOffset + 1, difficultyRank: difficultyOffset + 1,
      sourceDifficultyRank: 1,
      difficultyDesign: ["guided-rounding-intersection", "candidate-enumeration", "exact-decimal-digit-filter"][difficultyOffset + 1],
      reasoningSteps: 3, sourceStepCount: 1, difficultyStepDelta: difficultyOffset,
      sourceStructurePreserved: true, sourcePdfPage: 38, sourcePrintedPage: 42,
      questionModel: { truncatedTens: pool.truncatedTens, roundedTens: pool.roundedTens, multiplier: result.multiplier, targetHundredthsDigit: pool.targetHundredthsDigit },
      answerModel: { answer: result.answer, candidates: result.candidates, matches: result.matches, multiplier: result.multiplier },
      answerVisualRequired: false, answerVisualStatus: "not-required",
      publisherKeyVerified: false, publisherAnswerVerified: false,
      handwrittenAnswerVerified: false, answerVerification: "exact-tenths-and-hundredths-digit-filter"
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
    if (api.__source52U4Page42Example13Installed) return true;
    const oldKey = api.generatorKey.bind(api);
    const oldGenerate = api.generate.bind(api);
    api.generatorKey = type => belongs(type) ? (resolves(type) ? key : "") : oldKey(type);
    api.generate = (type, user, difficulty, seed, variant = 0) => belongs(type) ? generate(type, user, difficulty, seed, variant) : oldGenerate(type, user, difficulty, seed, variant);
    if (Array.isArray(api.names) && !api.names.includes(key)) api.names.push(key);
    Object.defineProperty(api, "__source52U4Page42Example13Installed", { value: true });
    return true;
  }
  return Object.freeze({ id, key, pools, calculate, build, generate, belongs, resolves, install });
});
