(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_U4_PAGE43_MISSION3 = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";
  const id = "5-2-u4-e1-mission-3";
  const key = "source52DecimalDayToTimePage43Mission3";
  const pools = Object.freeze([6, 9, 13].map(dayHundredths => Object.freeze({ dayHundredths })));
  const formatDay = hundredths => `0.${String(hundredths).padStart(2, "0")}`;
  const esc = value => String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));

  function calculate(pool) {
    if (!pool || !Number.isSafeInteger(pool.dayHundredths) || pool.dayHundredths <= 0 || pool.dayHundredths >= 100) {
      throw new TypeError("확인된 1일 미만의 소수만 사용할 수 있습니다.");
    }
    const totalSeconds = pool.dayHundredths * 864;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return Object.freeze({
      day: formatDay(pool.dayHundredths), totalSeconds, hours, minutes, seconds,
      answer: `${hours}시간 ${minutes}분 ${seconds}초`
    });
  }

  function build(poolIndex = 0, difficultyOffset = 0) {
    if (!Number.isSafeInteger(poolIndex) || poolIndex < 0 || poolIndex >= pools.length) throw new RangeError("확인된 수치 묶음 0~2만 사용할 수 있습니다.");
    if (![-1, 0, 1].includes(difficultyOffset)) throw new RangeError("난이도 오프셋은 -1, 0, 1이어야 합니다.");
    const pool = pools[poolIndex];
    const result = calculate(pool);
    const decimalHours = (result.totalSeconds / 3600).toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
    const fractionalHours = ((result.totalSeconds % 3600) / 3600).toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
    const decimalMinutes = ((result.totalSeconds % 3600) / 60).toFixed(1).replace(/\.0$/, "");
    const fractionalMinutes = ((result.totalSeconds % 60) / 60).toFixed(1).replace(/\.0$/, "");
    const hint = difficultyOffset < 0
      ? '<p class="source52-u4-p43-m3-hint">도움말: 하루는 24시간입니다. 먼저 일수를 시간으로 바꾸세요.</p>'
      : difficultyOffset > 0
        ? '<p class="source52-u4-p43-m3-hint">시간의 소수 부분은 분으로, 분의 소수 부분은 초로 바꾸어 보세요.</p>'
        : "";
    const prompt = `<div class="source52-u4-p43-m3-question" data-source-item-id="${id}" data-pool-index="${poolIndex}" data-difficulty-offset="${difficultyOffset}"><p>${result.day}일은 몇 시간 몇 분 몇 초인가?</p>${hint}</div>`;
    const steps = [
      `1일은 24시간이므로 ${result.day}일은 ${result.day}×24=${decimalHours}시간입니다.`,
      `${decimalHours}시간은 ${result.hours}시간과 ${fractionalHours}시간입니다.`,
      `남은 시간 ${fractionalHours}시간은 ${fractionalHours}×60=${decimalMinutes}분입니다.`,
      `${decimalMinutes}분은 ${result.minutes}분과 ${fractionalMinutes}분이므로 ${fractionalMinutes}×60=${result.seconds}초입니다.`,
      `따라서 ${result.hours}시간 ${result.minutes}분 ${result.seconds}초입니다.`
    ];
    const solution = `<div class="source52-u4-p43-m3-solution" data-source-answer="${id}" data-pool-index="${poolIndex}"><ol>${steps.map(step => `<li>${esc(step)}</li>`).join("")}</ol><p class="source52-u4-p43-m3-answer"><strong>답: ${esc(result.answer)}</strong></p></div>`;
    return Object.freeze({
      prompt, answer: result.answer, solution, sourceItemId: id, generator: key,
      generationMode: "fixed-verified-pool", verifiedPoolIndex: poolIndex,
      verifiedVariantCount: pools.length, verifiedVariantTarget: pools.length,
      verifiedVariantId: `${id}:v${poolIndex}`, variantProvenance: "synthetic-source-structure",
      difficultyOffset, difficultyLevel: difficultyOffset + 1, difficultyRank: difficultyOffset + 1,
      sourceDifficultyRank: 1,
      difficultyDesign: ["guided-day-to-hour-conversion", "hour-minute-second-conversion", "independent-unit-conversion-check"][difficultyOffset + 1],
      reasoningSteps: 5, sourceStepCount: 1, difficultyStepDelta: difficultyOffset,
      sourceStructurePreserved: true, sourcePdfPage: 39, sourcePrintedPage: 43,
      questionModel: { ...pool, answerModel: result }, answerModel: result,
      answerVisualRequired: false, answerVisualStatus: "not-required",
      publisherKeyVerified: false, publisherAnswerVerified: false, handwrittenAnswerVerified: false,
      answerVerification: "exact-day-to-hour-minute-second-conversion"
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
    if (api.__source52U4Page43Mission3Installed) return true;
    const oldKey = api.generatorKey.bind(api); const oldGenerate = api.generate.bind(api);
    api.generatorKey = type => belongs(type) ? (resolves(type) ? key : "") : oldKey(type);
    api.generate = (type, user, difficulty, seed, variant = 0) => belongs(type) ? generate(type, user, difficulty, seed, variant) : oldGenerate(type, user, difficulty, seed, variant);
    if (Array.isArray(api.names) && !api.names.includes(key)) api.names.push(key);
    Object.defineProperty(api, "__source52U4Page43Mission3Installed", { value: true });
    return true;
  }
  return Object.freeze({ id, key, pools, calculate, build, generate, belongs, resolves, install });
});
