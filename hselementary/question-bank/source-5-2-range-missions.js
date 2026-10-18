(function (root, factory) {
  "use strict";
  const exported = factory();
  if (typeof module === "object" && module.exports) module.exports = exported;
  root.HSE_SOURCE_52_RANGE_MISSIONS = exported;
  exported.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  // The printed page and its handwritten work are private. Only new values live here.
  const freeze = value => {
    if (value && typeof value === "object" && !Object.isFrozen(value)) {
      Object.values(value).forEach(freeze);
      Object.freeze(value);
    }
    return value;
  };
  const check = (condition, message) => { if (!condition) throw new Error(message); };
  const esc = value => String(value).replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));
  const math = value => `<span class="math-inline-expression">${esc(value)}</span>`;
  const given = (value, role) => `<span class="source52-mission-number" data-given="${role}">${esc(value)}</span>`;
  const steps = lines => `<span class="source52-mission-solution">${lines.map((line, index) => `<span class="source52-mission-step">${index + 1}. ${line}</span>`).join("")}</span>`;
  const hint = value => `<span class="source52-mission-hint">도움말: ${value}</span>`;
  const definitions = freeze([
    { sourceItemId: "5-2-u1-e1-mission-1", generatorKey: "source52RangeMissionOne", kind: "two-overlapping-ranges", resultContract: "rubric", pools: [
      { aLower: 12, aUpperExclusive: 22, bLowerExclusive: 18, bUpper: 31 },
      { aLower: 24, aUpperExclusive: 36, bLowerExclusive: 31, bUpper: 44 },
      { aLower: 46, aUpperExclusive: 59, bLowerExclusive: 53, bUpper: 67 }
    ] },
    { sourceItemId: "5-2-u1-e1-mission-2", generatorKey: "source52RangeMissionTwo", kind: "missing-upper-multiple-count", resultContract: "set", pools: [
      { lower: 34, divisor: 4, count: 10 }, { lower: 47, divisor: 5, count: 8 }, { lower: 61, divisor: 6, count: 9 }
    ] },
    { sourceItemId: "5-2-u1-e1-mission-3", generatorKey: "source52RangeMissionThree", kind: "two-digit-endpoint-pairs", resultContract: "single-value", pools: [
      { targetLower: 120, targetUpper: 189 }, { targetLower: 110, targetUpper: 185 }, { targetLower: 101, targetUpper: 179 }
    ] },
    { sourceItemId: "5-2-u1-e1-mission-4", generatorKey: "source52RangeMissionFour", kind: "distinct-digit-decimals", resultContract: "single-value", pools: [
      { digits: [0, 1, 3, 4, 6, 8], lowerHundredths: 310, upperHundredths: 640 },
      { digits: [0, 1, 2, 4, 6, 9], lowerHundredths: 240, upperHundredths: 620 },
      { digits: [0, 2, 3, 4, 7, 8], lowerHundredths: 320, upperHundredths: 740 }
    ] },
    { sourceItemId: "5-2-u1-e1-mission-5", generatorKey: "source52RangeMissionFive", kind: "two-minimum-bus-counts", resultContract: "range", pools: [
      { capacityA: 32, busesA: 9, capacityB: 45, busesB: 7 },
      { capacityA: 38, busesA: 8, capacityB: 50, busesB: 6 },
      { capacityA: 36, busesA: 11, capacityB: 48, busesB: 9 }
    ] },
    { sourceItemId: "5-2-u1-e1-mission-6", generatorKey: "source52RangeMissionSix", kind: "bounded-box-count", resultContract: "range", pools: [
      { total: 850, minimum: 19, maximum: 28 },
      { total: 724, minimum: 21, maximum: 30 },
      { total: 967, minimum: 26, maximum: 38 }
    ] }
  ]);
  const byId = new Map(definitions.map(item => [item.sourceItemId, item]));
  const ownedKeys = new Set(definitions.map(item => item.generatorKey));

  function buildOne(pool, level) {
    const { aLower, aUpperExclusive, bLowerExclusive, bUpper } = pool;
    const aLast = aUpperExclusive - 1, bFirst = bLowerExclusive + 1;
    check(aLower < bFirst && bFirst <= aLast && aLast < bUpper, "두 범위는 원문처럼 겹쳐야 합니다.");
    const unionCount = bUpper - aLower + 1;
    const overlapCount = aLast - bFirst + 1;
    const overlapSum = (bFirst + aLast) * overlapCount / 2;
    const sumLower = aLower + bFirst, sumUpper = aLast + bUpper;
    const derived = level === 2 ? aUpperExclusive - 3 : null;
    const first = level === 2 ? `${given(aLower, "a-lower")} 이상 ㉠ 미만, ㉠은 ${given(derived, "upper-base")}보다 ${given(3, "upper-extra")} 큰 수` : `${given(aLower, "a-lower")} 이상 ${given(aUpperExclusive, "a-upper-exclusive")} 미만`;
    const prompt = `두 자연수의 조건을 살펴보세요.<span class="source52-mission-parts"><span>(가) ${first}</span><span>(나) ${given(bLowerExclusive, "b-lower-exclusive")} 초과 ${given(bUpper, "b-upper")} 이하</span></span><span class="source52-mission-parts"><span>(1) (가) 또는 (나)를 만족하는 자연수는 몇 개인가요?</span><span>(2) (가)와 (나)를 모두 만족하는 자연수의 합을 구하세요.</span><span>(3) (가)를 만족하는 수 ㄱ과 (나)를 만족하는 수 ㄴ에 대하여 ㄱ+ㄴ의 범위를 ‘이상’과 ‘이하’로 나타내세요.</span></span>${level === 0 ? hint("양 끝을 포함하는지 먼저 확인하고 두 범위의 공통 부분을 찾으세요.") : ""}`;
    const solution = steps([
      ...(level === 2 ? [`㉠은 ${math(`${derived} + 3 = ${aUpperExclusive}`)}입니다.`] : []),
      `(가)는 ${aLower}부터 ${aLast}, (나)는 ${bFirst}부터 ${bUpper}까지입니다. ‘미만’과 ‘초과’의 끝수는 포함하지 않습니다.`,
      `두 범위가 겹치므로 (가) 또는 (나)는 ${aLower}부터 ${bUpper}까지입니다. ${math(`${bUpper} - ${aLower} + 1 = ${unionCount}`)}개입니다.`,
      `두 조건을 모두 만족하는 수는 ${bFirst}부터 ${aLast}까지 ${overlapCount}개입니다. 양 끝의 합을 이용하면 ${math(`(${bFirst} + ${aLast}) × ${overlapCount} ÷ 2 = ${overlapSum}`)}입니다.`,
      `ㄱ+ㄴ의 최솟값은 ${math(`${aLower} + ${bFirst} = ${sumLower}`)}, 최댓값은 ${math(`${aLast} + ${bUpper} = ${sumUpper}`)}입니다. 두 자연수의 범위는 이어져 있어 사이의 모든 합도 가능합니다.`
    ]);
    return { prompt, answer: `(1) ${unionCount}개, (2) ${overlapSum}, (3) ${sumLower} 이상 ${sumUpper} 이하`, solution,
      questionModel: { kind: "two-overlapping-ranges", ...pool, ...(level === 2 ? { derivedUpperBase: derived } : {}) },
      answerModel: { unionCount, overlapFirst: bFirst, overlapLast: aLast, overlapSum, sumLower, sumUpper, allSumsConsecutive: true } };
  }

  function buildTwo(pool, level) {
    const { lower, divisor, count } = pool;
    const first = Math.ceil(lower / divisor) * divisor, last = first + (count - 1) * divisor, next = last + divisor;
    const answers = Array.from({ length: divisor }, (_, index) => last + 1 + index);
    const countText = level === 2 ? `${given(count - 2, "count-base")}개보다 ${given(2, "count-extra")}개 많습니다` : `${given(count, "count") }개입니다`;
    const prompt = `${given(lower, "lower")} 이상 □ 미만인 자연수 가운데 ${given(divisor, "divisor")}로 나누어떨어지는 수는 ${countText}. □에 들어갈 수 있는 자연수를 모두 구하세요.${level === 0 ? hint(`처음으로 조건에 맞는 배수는 ${first}입니다.`) : ""}`;
    const solution = steps([
      ...(level === 2 ? [`배수는 ${math(`${count - 2} + 2 = ${count}`)}개입니다.`] : []),
      `${lower} 이상인 첫 ${divisor}의 배수는 ${first}입니다. 배수를 ${count}개 세면 마지막 배수는 ${math(`${first} + ${divisor} × (${count} - 1) = ${last}`)}입니다.`,
      `그다음 배수는 ${math(`${last} + ${divisor} = ${next}`)}입니다. □는 ${last}보다 커야 마지막 배수를 포함하고, ${next} 이하여야 다음 배수를 포함하지 않습니다.`,
      `따라서 □는 ${answers.join(", ")}입니다. □가 ${last}이면 마지막 배수가 빠지고 ${next + 1}이면 다음 배수가 추가됩니다.`
    ]);
    return { prompt, answer: answers.join(", "), solution,
      questionModel: { kind: "missing-upper-multiple-count", ...pool, firstMultiple: first },
      answerModel: { contract: "set", values: answers, lastMultiple: last, nextMultiple: next } };
  }

  function buildThree(pool, level) {
    const { targetLower, targetUpper } = pool;
    const targetCount = targetUpper - targetLower + 1;
    const maxLower = 99 - targetCount - 1, count = maxLower - 10 + 1;
    check(count > 0, "두 자리 끝수의 쌍이 없습니다.");
    const upperText = level === 2 ? `㉠ 이하이고, ㉠은 ${given(targetLower, "target-lower")}보다 ${given(targetUpper - targetLower, "target-span")} 큰 수` : `${given(targetUpper, "target-upper")} 이하`;
    const prompt = `ㄱ 초과 ㄴ 미만인 자연수의 개수와 ${given(targetLower, "target-lower")} 이상 ${upperText}인 자연수의 개수가 같습니다. ㄱ과 ㄴ이 모두 두 자리 수일 때 가능한 순서쌍 (ㄱ, ㄴ)은 몇 개인가요?${level === 0 ? hint("ㄱ과 ㄴ 사이의 자연수는 ㄴ-ㄱ-1개입니다.") : ""}`;
    const solution = steps([
      ...(level === 2 ? [`㉠은 ${math(`${targetLower} + ${targetUpper - targetLower} = ${targetUpper}`)}입니다.`] : []),
      `${targetLower} 이상 ${targetUpper} 이하인 자연수는 양 끝을 포함해 ${math(`${targetUpper} - ${targetLower} + 1 = ${targetCount}`)}개입니다.`,
      `ㄱ 초과 ㄴ 미만의 개수는 ㄴ-ㄱ-1이므로 ${math(`ㄴ - ㄱ - 1 = ${targetCount}`)}, 곧 ${math(`ㄴ = ㄱ + ${targetCount + 1}`)}입니다.`,
      `ㄱ과 ㄴ은 모두 두 자리여야 하므로 ㄱ은 ${math(`10 ≤ ㄱ ≤ 99 - ${targetCount + 1} = ${maxLower}`)}입니다.`,
      `ㄱ을 ${maxLower - 10 + 1}가지로 고르면 ㄴ은 하나씩 정해집니다. 따라서 ${count}쌍입니다.`
    ]);
    return { prompt, answer: `${count}쌍`, solution,
      questionModel: { kind: "two-digit-endpoint-pairs", ...pool, ...(level === 2 ? { derivedTargetSpan: targetUpper - targetLower } : {}) },
      answerModel: { value: count, targetCount, endpointGap: targetCount + 1, lowerFirst: 10, lowerLast: maxLower } };
  }

  function buildFour(pool, level) {
    const { digits, lowerHundredths, upperHundredths } = pool;
    check(new Set(digits).size === 6 && digits.every(d => Number.isInteger(d) && d >= 0 && d <= 9), "서로 다른 여섯 카드가 필요합니다.");
    const candidates = [];
    for (const integer of digits) for (const tenths of digits) for (const hundredths of digits) {
      if (new Set([integer, tenths, hundredths]).size !== 3) continue;
      const value = 100 * integer + 10 * tenths + hundredths;
      if (value > lowerHundredths && value <= upperHundredths) candidates.push({ integer, tenths, hundredths, value });
    }
    const groups = [...new Set(candidates.map(item => item.integer))].sort((a, b) => a - b).map(integer => ({ integer, count: candidates.filter(item => item.integer === integer).length }));
    const upperText = level === 2 ? `㉠ 이하이고 ㉠은 ${given((upperHundredths - 10) / 100, "upper-base")}보다 ${given("0.1", "upper-extra")} 큰 수` : `${given(upperHundredths / 100, "upper") } 이하`;
    const prompt = `아래 서로 다른 숫자 카드 여섯 장에서 한 번에 카드 세 장을 골라 한 자리에 한 장씩 놓습니다. 같은 카드는 다시 쓸 수 없습니다.<span class="source52-mission-cards" aria-label="숫자 카드 ${digits.join(', ')}">${digits.map(d => `<span class="source52-mission-card">${d}</span>`).join("")}</span>만들 수 있는 소수 두 자리 수 중 ${given(lowerHundredths / 100, "lower")} 초과 ${upperText}인 수는 모두 몇 개인가요?${level === 0 ? hint("정수 부분에 놓을 숫자별로 나누어 세고, 소수 부분의 두 자리는 순서가 있음을 기억하세요.") : ""}`;
    const groupText = groups.map(group => `정수 부분이 ${group.integer}일 때 ${group.count}개`).join(", ");
    const solution = steps([
      ...(level === 2 ? [`㉠은 ${math(`${(upperHundredths - 10) / 100} + 0.1 = ${upperHundredths / 100}`)}입니다.`] : []),
      `숫자 카드는 각각 한 장이므로 정수 부분, 소수 첫째 자리, 소수 둘째 자리에 서로 다른 카드를 놓습니다. 카드의 순서를 바꾸면 다른 소수가 됩니다.`,
      `${lowerHundredths / 100}보다 크고 ${upperHundredths / 100}보다 작거나 같은지 세 자리 배치마다 확인합니다. 경계의 왼쪽은 제외하고 오른쪽은 포함합니다.`,
      `${groupText}입니다. 정수 부분에 따라 나누어 세면 빠뜨리거나 중복하여 세지 않습니다.`,
      `따라서 ${math(groups.map(g => g.count).join(" + ") + " = " + candidates.length)}개입니다.`
    ]);
    return { prompt, answer: `${candidates.length}개`, solution,
      questionModel: { kind: "distinct-digit-decimals", digits, lowerHundredths, upperHundredths, cardUse: "once", placesAfterDecimal: 2 },
      answerModel: { value: candidates.length, byIntegerPart: groups, strictLower: true, inclusiveUpper: true } };
  }

  function buildFive(pool, level) {
    const { capacityA, busesA, capacityB, busesB } = pool;
    const aLow = capacityA * (busesA - 1) + 1, aHigh = capacityA * busesA;
    const bLow = capacityB * (busesB - 1) + 1, bHigh = capacityB * busesB;
    const lower = Math.max(aLow, bLow), upper = Math.min(aHigh, bHigh);
    check(lower <= upper, "두 버스 조건의 공통 부분이 없습니다.");
    const derived = level === 2 ? busesB - 2 : null;
    const second = level === 2 ? `㉠대이며 ㉠은 ${given(derived, "bus-base")}보다 ${given(2, "bus-extra")}대 많습니다` : `${given(busesB, "buses-b")}대입니다`;
    const prompt = `학생들을 모두 버스에 태우려고 합니다. ${given(capacityA, "capacity-a")}인승 버스가 필요한 최소 수는 ${given(busesA, "buses-a")}대이고, ${given(capacityB, "capacity-b")}인승 버스가 필요한 최소 수는 ${second}. 학생 수의 범위를 ‘초과’와 ‘미만’을 사용해 나타내세요. 운전기사와 선생님의 수는 생각하지 않습니다.${level === 0 ? hint("한 대 적게 썼을 때의 최대 인원보다 학생이 많아야 합니다.") : ""}`;
    const solution = steps([
      ...(level === 2 ? [`㉠은 ${math(`${derived} + 2 = ${busesB}`)}대입니다.`] : []),
      `${capacityA}인승 버스를 최소 ${busesA}대 써야 하므로 ${math(`${capacityA} × ${busesA - 1} = ${aLow - 1}`)}명보다 많고 ${math(`${capacityA} × ${busesA} = ${aHigh}`)}명 이하입니다.`,
      `${capacityB}인승 버스를 최소 ${busesB}대 써야 하므로 ${math(`${capacityB} × ${busesB - 1} = ${bLow - 1}`)}명보다 많고 ${math(`${capacityB} × ${busesB} = ${bHigh}`)}명 이하입니다.`,
      `두 조건의 공통 범위는 ${lower}명부터 ${upper}명까지입니다. ${lower - 1}명은 조건 하나에 필요한 버스가 줄고, ${upper + 1}명은 조건 하나에 더 많은 버스가 필요합니다.`,
      `따라서 학생 수는 ${lower - 1}명 초과 ${upper + 1}명 미만입니다.`
    ]);
    return { prompt, answer: `${lower - 1}명 초과 ${upper + 1}명 미만`, solution,
      questionModel: { kind: "two-minimum-bus-counts", ...pool, ...(level === 2 ? { derivedBusBase: derived } : {}) },
      answerModel: { lower, upper, displayLower: lower - 1, displayUpper: upper + 1, lowerIncluded: false, upperIncluded: false } };
  }

  function buildSix(pool, level) {
    const { total, minimum, maximum } = pool;
    const lower = Math.ceil(total / maximum), upper = Math.floor(total / minimum);
    check(lower <= upper, "사용할 수 있는 상자 수가 없습니다.");
    const totalBase = total - 17;
    const totalText = level === 2 ? `${given(totalBase, "total-base")}개에 ${given(17, "total-extra")}개를 더했습니다` : `${given(total, "total")}개입니다`;
    const prompt = `과일은 모두 ${totalText}. 남김없이 여러 상자에 나누어 담되, 한 상자에 ${given(minimum, "minimum")}개 이상 ${given(maximum, "maximum")}개 이하로 담습니다. 사용할 수 있는 상자 수의 범위를 ‘초과’와 ‘미만’을 사용해 나타내세요.${level === 0 ? hint("상자 수를 가장 적게 하려면 한 상자에 가장 많이 담는 수를 생각하세요.") : ""}`;
    const solution = steps([
      ...(level === 2 ? [`과일은 모두 ${math(`${totalBase} + 17 = ${total}`)}개입니다.`] : []),
      `${lower - 1}상자에는 최대 ${math(`${maximum} × ${lower - 1} = ${maximum * (lower - 1)}`)}개밖에 담지 못합니다. 따라서 최소 ${lower}상자가 필요합니다.`,
      `${upper + 1}상자를 쓰려면 최소 ${math(`${minimum} × ${upper + 1} = ${minimum * (upper + 1)}`)}개가 필요합니다. 따라서 최대 ${upper}상자입니다.`,
      `그 사이의 상자 수에도 고르게 나누어 담으면 한 상자에 ${minimum}개 이상 ${maximum}개 이하가 되므로 모두 가능합니다.`,
      `상자 수는 ${lower}부터 ${upper}까지이므로 ${lower - 1}상자 초과 ${upper + 1}상자 미만입니다.`
    ]);
    return { prompt, answer: `${lower - 1}상자 초과 ${upper + 1}상자 미만`, solution,
      questionModel: { kind: "bounded-box-count", ...pool },
      answerModel: { lower, upper, displayLower: lower - 1, displayUpper: upper + 1, lowerIncluded: false, upperIncluded: false } };
  }

  const builders = { "two-overlapping-ranges": buildOne, "missing-upper-multiple-count": buildTwo, "two-digit-endpoint-pairs": buildThree,
    "distinct-digit-decimals": buildFour, "two-minimum-bus-counts": buildFive, "bounded-box-count": buildSix };
  function getQuestion(sourceItemId, variant = 0, difficultyOffset = 0) {
    const definition = byId.get(sourceItemId);
    check(Boolean(definition), "등록되지 않은 5-2 Mission 원문 항목입니다.");
    check(Number.isSafeInteger(variant) && variant >= 0, "고정 변형 번호가 올바르지 않습니다.");
    check([-1, 0, 1].includes(difficultyOffset), "난이도는 -1, 0, 1이어야 합니다.");
    const poolIndex = variant % 3, level = difficultyOffset + 1;
    const item = builders[definition.kind](definition.pools[poolIndex], level);
    const prompt = `<div class="source52-mission-question" data-source-item="${sourceItemId}" data-source-item-id="${sourceItemId}" data-pool-index="${poolIndex}" data-difficulty-offset="${difficultyOffset}" data-level="${level}">${item.prompt}</div>`;
    return freeze({ ...item, prompt, sourceItemId, generator: definition.generatorKey, generationMode: "fixed-verified-pool",
      verifiedPoolIndex: poolIndex, verifiedVariantCount: 3, verifiedVariantTarget: 3, verifiedVariantId: `${sourceItemId}:v${poolIndex}`,
      variantProvenance: "source-structure-variant", resultContract: definition.resultContract, mathematicalContract: definition.resultContract,
      answerVisualRequired: false, answerVisualStatus: "not-required", difficultyDesign: ["intermediate-hint", "source-structure", "derive-one-given-first"][level],
      difficultyOffset, difficultyLevel: level, difficultyRank: level, sourceDifficultyRank: 1, reasoningSteps: [3, 4, 5][level], sourceStepCount: 4,
      difficultyStepDelta: [-1, 0, 1][level], sourceStructurePreserved: true,
      sourceEvidenceRef: "source-memory:hs-elementary.unit.5-2-1.e1-missions-direct-solutions-20261018",
      publisherKeyVerified: false, publisherAnswerVerified: false, handwrittenAnswerVerified: false,
      answerVerification: "independent-enumeration-user-authorized" });
  }
  function resolve(type) {
    if (!type || typeof type !== "object") return null;
    const definition = byId.get(type.sourceItemId);
    return definition && type.id === definition.sourceItemId && type.generatorKey === definition.generatorKey ? definition : null;
  }
  function belongsToModule(type) { return Boolean(type && (byId.has(type.id) || byId.has(type.sourceItemId) || ownedKeys.has(type.generatorKey))); }
  function install(target) {
    const api = target?.HSE_GENERATORS;
    if (!api || typeof api.generatorKey !== "function" || typeof api.generate !== "function") return false;
    if (api.__source52RangeMissionsInstalled) return true;
    const previousKey = api.generatorKey.bind(api), previousGenerate = api.generate.bind(api);
    api.generatorKey = type => {
      if (!belongsToModule(type)) return previousKey(type);
      const definition = resolve(type);
      return definition && type.reviewLocked === false && type.sourceVerified === true ? definition.generatorKey : "";
    };
    api.generate = (type, levelRank, difficultyOffset, seed, variant = 0) => {
      if (!belongsToModule(type)) return previousGenerate(type, levelRank, difficultyOffset, seed, variant);
      const definition = resolve(type);
      if (!definition || type.reviewLocked !== false || type.sourceVerified !== true) return null;
      return getQuestion(definition.sourceItemId, variant, difficultyOffset ?? 0);
    };
    if (Array.isArray(api.names)) for (const definition of definitions) if (!api.names.includes(definition.generatorKey)) api.names.push(definition.generatorKey);
    Object.defineProperty(api, "__source52RangeMissionsInstalled", { value: true });
    return true;
  }
  return freeze({ definitions, sourceItemIds: freeze(definitions.map(item => item.sourceItemId)), getQuestion, install,
    registrationOnly: true, publisherKeyVerified: false, publisherAnswerVerified: false, handwrittenAnswerVerified: false,
    answerVerification: "independent-enumeration-user-authorized" });
});
