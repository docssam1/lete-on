(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_ROUNDING_MISSIONS = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const esc = value => String(value).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fmt = value => Number(value).toLocaleString("en-US");
  const hasKoreanNumberBatchim = value => [0, 1, 3, 6, 7, 8].includes(Number(String(Math.abs(value)).replace(/\D/g, "").slice(-1)));
  const particle = (value, withoutBatchim, withBatchim) => hasKoreanNumberBatchim(value) ? withBatchim : withoutBatchim;
  const ceil = (n, unit) => Math.ceil(n / unit) * unit;
  const floor = (n, unit) => Math.floor(n / unit) * unit;
  const round = (n, unit) => Math.floor(n / unit + 0.5) * unit;
  const eq = value => `<span class="math-inline-expression">${esc(value)}</span>`;
  const ids = [1, 2, 3].map(n => `5-2-u1-e2-mission-${n}`);
  const keys = ["source52RoundingMissionOne", "source52RoundingMissionTwo", "source52RoundingMissionThree"];
  const pools = Object.freeze([
    Object.freeze([[5832, 8417], [6300, 9076], [2699, 4501]].map(Object.freeze)),
    Object.freeze([[83642, 246718], [59239, 184500], [67300, 328091]].map(Object.freeze)),
    Object.freeze([
      Object.freeze({ target: 400000, digits: Object.freeze([0, 9, 3, 8, 2, 4]) }),
      Object.freeze({ target: 400000, digits: Object.freeze([0, 6, 3, 8, 2, 4]) }),
      Object.freeze({ target: 600000, digits: Object.freeze([0, 7, 5, 9, 1, 6]) })
    ])
  ]);
  const hints = [
    ["수를 10, 100, 1000씩 묶어 표의 빈칸을 채워 보세요.", "각 자리의 작은 숫자가 남는지 확인하고, 표를 차례대로 완성하세요.", "올림한 수를 쓰고, 각 결과에서 원래 수보다 얼마나 커졌는지도 살펴보세요."],
    ["두 어림값을 각각 구한 다음, 큰 값에서 작은 값을 빼세요.", "각 소문항에서 올림 결과와 반올림 결과를 나란히 적어 비교하세요.", "두 결과의 순서가 바뀌어도 차는 음수가 되지 않도록 계산하세요."],
    ["목표보다 작은 수와 큰 수에서 각각 가장 가까운 수를 찾아 비교하세요.", "첫 자리에 0을 놓을 수 없고, 카드 한 장은 한 번만 쓸 수 있습니다.", "가장 가까운 수를 먼저 정한 뒤, 그 수를 천의 자리까지 반올림하세요."]
  ];

  function nearestUsingCards(digits, target) {
    const candidates = [];
    function visit(prefix, rest) {
      if (!rest.length) { if (prefix[0] !== 0) candidates.push(Number(prefix.join(""))); return; }
      for (let i = 0; i < rest.length; i++) visit([...prefix, rest[i]], [...rest.slice(0, i), ...rest.slice(i + 1)]);
    }
    visit([], [...digits]);
    const distances = candidates.map(value => [value, Math.abs(value - target)]);
    const min = Math.min(...distances.map(([, distance]) => distance));
    const winners = distances.filter(([, distance]) => distance === min).map(([value]) => value);
    if (winners.length !== 1) throw new Error("Mission 3 pool must have one uniquely nearest number");
    return { candidates, winners, minDistance: min };
  }

  function build(index, poolIndex, level) {
    const help = level === 0 ? `<p class="source52-rounding-hint">도움말: ${hints[index][0]}</p>` : level === 2 ? `<p class="source52-rounding-hint">풀이 순서: ${hints[index][2]}</p>` : "";
    if (index === 0) {
      const values = pools[0][poolIndex];
      const units = [10, 100, 1000];
      const answers = values.map(value => units.map(unit => ceil(value, unit)));
      const table = `<table class="source52-rounding-table"><thead><tr><th>수</th><th>십의 자리</th><th>백의 자리</th><th>천의 자리</th></tr></thead><tbody>${values.map((value, row) => `<tr><th>${fmt(value)}</th>${answers[row].map((_, col) => `<td><span class="source52-rounding-blank" aria-label="빈칸"></span></td>`).join("")}</tr>`).join("")}</tbody></table>`;
      const answerVisual = `<table class="source52-rounding-table" aria-label="완성한 올림 표"><thead><tr><th>수</th><th>십의 자리</th><th>백의 자리</th><th>천의 자리</th></tr></thead><tbody>${values.map((value, row) => `<tr><th>${fmt(value)}</th>${answers[row].map(result => `<td>${fmt(result)}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
      const solution = values.map((value, row) => `${fmt(value)}${particle(value, "는", "은")} ${eq(`${fmt(ceil(value, 10))}`)}(십의 자리), ${eq(`${fmt(ceil(value, 100))}`)}(백의 자리), ${eq(`${fmt(ceil(value, 1000))}`)}(천의 자리)까지 올림합니다.`).join("<br>");
      const answer = answers.flat().map(fmt).join(", ");
      return { prompt: `다음 수를 올림하여 표에 주어진 자리까지 나타내세요.${table}${help}`, answer, solution: `${solution}<p>표에 쓰는 답은 차례로 ${answer}입니다.</p>`, questionModel: { values, units }, answerModel: { values: answers }, answerVisual };
    }
    if (index === 1) {
      const values = pools[1][poolIndex];
      const details = values.map(value => ({ value, up: ceil(value, 100), nearest: round(value, 1000) }));
      const differences = details.map(x => Math.abs(x.up - x.nearest));
      const answer = differences.map(n => `${fmt(n)}`).join(", ");
      const solution = details.map((x, i) => `(${i + 1}) ${fmt(x.value)}${particle(x.value, "를", "을")} 백의 자리까지 올림하면 ${fmt(x.up)}, 천의 자리까지 반올림하면 ${fmt(x.nearest)}입니다. 두 수의 차는 ${eq(`${fmt(Math.max(x.up, x.nearest))} − ${fmt(Math.min(x.up, x.nearest))} = ${fmt(differences[i])}`)}입니다.`).join("<br>");
      const prompt = `다음 수를 올림하여 백의 자리까지 나타낸 수와 반올림하여 천의 자리까지 나타낸 수의 차를 구하세요.<ol>${values.map((v, i) => `<li>${fmt(v)}</li>`).join("")}</ol>${help}`;
      return { prompt, answer, solution: `${solution}<p>답은 차례로 ${answer}입니다.</p>`, questionModel: { values, roundedUp: details.map(x => x.up), roundedToThousand: details.map(x => x.nearest) }, answerModel: { differences } };
    }
    if (index === 2) {
      const { target, digits } = pools[2][poolIndex];
      const { winners, minDistance } = nearestUsingCards(digits, target);
      const selected = winners[0];
      const below = Math.max(...nearestUsingCards(digits, target).candidates.filter(n => n < target));
      const above = Math.min(...nearestUsingCards(digits, target).candidates.filter(n => n > target));
      const belowDistance = target - below, aboveDistance = above - target;
      const rounded = round(selected, 1000);
      const cards = `<div class="source52-rounding-cards" role="img" aria-label="수 카드 ${digits.join(", ")}">${digits.map(n => `<span class="digit-card">${n}</span>`).join("")}</div>`;
      const prompt = `다음 수 카드를 한 번씩 모두 사용하여 만들 수 있는 여섯 자리 수 중에서 ${fmt(target)}에 가장 가까운 수를 반올림하여 천의 자리까지 나타내세요.${cards}${help}`;
      const solution = `${fmt(target)}보다 작은 수 중 가장 큰 수는 ${fmt(below)}이고 차는 ${fmt(belowDistance)}입니다. ${fmt(target)}보다 큰 수 중 가장 작은 수는 ${fmt(above)}이고 차는 ${fmt(aboveDistance)}입니다. ${minDistance === belowDistance ? `작은 쪽이 더 가까우므로 ${fmt(selected)}${particle(selected, "를", "을")} 고릅니다.` : `큰 쪽이 더 가까우므로 ${fmt(selected)}${particle(selected, "를", "을")} 고릅니다.`} ${fmt(selected)}${particle(selected, "를", "을")} 천의 자리까지 반올림하면 ${eq(`${fmt(selected)} → ${fmt(rounded)}`)}입니다.`;
      return { prompt, answer: fmt(rounded), solution, questionModel: { target, digits, selected, rounded }, answerModel: { selected, rounded } };
    }
    throw new Error("Unknown Grade 5-2 rounding mission");
  }

  function getQuestion(sourceItemId, variant = 0, difficultyOffset = 0) {
    const index = ids.indexOf(sourceItemId);
    if (index < 0 || !Number.isSafeInteger(variant) || variant < 0 || ![-1, 0, 1].includes(difficultyOffset)) return null;
    const poolIndex = variant % 3;
    const result = build(index, poolIndex, difficultyOffset + 1);
    return Object.freeze({ ...result,
      prompt: `<div data-source-item="${sourceItemId}" data-source-item-id="${sourceItemId}" data-pool-index="${poolIndex}" data-variant="${poolIndex}" data-difficulty-offset="${difficultyOffset}">${result.prompt}</div>`,
      sourceItemId, generator: keys[index], generationMode: "fixed-verified-pool", verifiedPoolIndex: poolIndex,
      verifiedVariantCount: 3, verifiedVariantTarget: 3, verifiedVariantId: `${sourceItemId}:v${poolIndex}`,
      variantProvenance: "source-structure-variant", difficultyOffset, difficultyLevel: difficultyOffset + 1, difficultyRank: difficultyOffset + 1,
      sourceDifficultyRank: 1, difficultyDesign: ["worked-place-value-hint", "direct-solve", "compare-and-justify"][difficultyOffset + 1],
      reasoningSteps: difficultyOffset + 3, sourceStepCount: 3, difficultyStepDelta: difficultyOffset,
      sourceStructurePreserved: true, sourceEvidenceRef: "source-memory:hs-elementary.unit.5-2-1.e2-direct-review-20261019",
      publisherKeyVerified: false, publisherAnswerVerified: false, handwrittenAnswerVerified: false,
      answerVerification: "independent-enumeration-user-authorized",
      answerVisualRequired: index === 0, answerVisualStatus: index === 0 ? "verified" : "not-required" });
  }

  const definitions = ids.map((sourceItemId, index) => Object.freeze({ sourceItemId, generatorKey: keys[index], poolCount: 3, kind: ["rounding-ceil-table", "rounding-difference", "rounding-nearest-card-number"][index] }));
  const byId = new Map(definitions.map(x => [x.sourceItemId, x]));
  const ownedKeys = new Set(keys);
  function resolve(type) { const d = type && byId.get(type.sourceItemId); return d && type.id === d.sourceItemId && type.generatorKey === d.generatorKey ? d : null; }
  function install(target) {
    const api = target?.HSE_GENERATORS;
    if (!api || typeof api.generatorKey !== "function" || typeof api.generate !== "function") return false;
    if (api.__source52RoundingMissionsInstalled) return true;
    const prevKey = api.generatorKey.bind(api), prevGenerate = api.generate.bind(api);
    const belongs = t => Boolean(t && (byId.has(t.id) || byId.has(t.sourceItemId) || ownedKeys.has(t.generatorKey)));
    api.generatorKey = t => { if (!belongs(t)) return prevKey(t); const d = resolve(t); return d && t.reviewLocked === false && t.sourceVerified === true ? d.generatorKey : ""; };
    api.generate = (t, rank, offset, seed, variant = 0) => { if (!belongs(t)) return prevGenerate(t, rank, offset, seed, variant); const d = resolve(t); return d && t.reviewLocked === false && t.sourceVerified === true ? getQuestion(d.sourceItemId, variant, offset ?? 0) : null; };
    if (Array.isArray(api.names)) for (const key of keys) if (!api.names.includes(key)) api.names.push(key);
    Object.defineProperty(api, "__source52RoundingMissionsInstalled", { value: true });
    return true;
  }
  return Object.freeze({ ids, keys, pools, definitions, getQuestion, resolve, install, nearestUsingCards,
    publisherKeyVerified: false, answerVerification: "independent-enumeration-user-authorized" });
});
