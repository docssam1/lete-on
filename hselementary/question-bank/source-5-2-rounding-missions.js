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
  const ids = [1, 2, 3, 4, 5, 6].map(n => `5-2-u1-e2-mission-${n}`);
  const keys = ["source52RoundingMissionOne", "source52RoundingMissionTwo", "source52RoundingMissionThree", "source52RoundingMissionFour", "source52RoundingMissionFive", "source52RoundingMissionSix"];
  const pools = Object.freeze([
    Object.freeze([[5832, 8417], [6300, 9076], [2699, 4501]].map(Object.freeze)),
    Object.freeze([[83642, 246718], [59239, 184500], [67300, 328091]].map(Object.freeze)),
    Object.freeze([
      Object.freeze({ target: 400000, digits: Object.freeze([0, 9, 3, 8, 2, 4]) }),
      Object.freeze({ target: 400000, digits: Object.freeze([0, 6, 3, 8, 2, 4]) }),
      Object.freeze({ target: 600000, digits: Object.freeze([0, 7, 5, 9, 1, 6]) })
    ]),
    Object.freeze([728164, 391257, 604238]),
    Object.freeze([[3, 10], [4, 100], [5, 1000]].map(Object.freeze)),
    Object.freeze([[3, 10, 100], [4, 100, 1000], [5, 1000, 10000]].map(Object.freeze))
  ]);
  const hints = [
    ["수를 10, 100, 1000씩 묶어 표의 빈칸을 채워 보세요.", "각 자리의 작은 숫자가 남는지 확인하고, 표를 차례대로 완성하세요.", "올림한 수를 쓰고, 각 결과에서 원래 수보다 얼마나 커졌는지도 살펴보세요."],
    ["두 어림값을 각각 구한 다음, 큰 값에서 작은 값을 빼세요.", "각 소문항에서 올림 결과와 반올림 결과를 나란히 적어 비교하세요.", "두 결과의 순서가 바뀌어도 차는 음수가 되지 않도록 계산하세요."],
    ["목표보다 작은 수와 큰 수에서 각각 가장 가까운 수를 찾아 비교하세요.", "첫 자리에 0을 놓을 수 없고, 카드 한 장은 한 번만 쓸 수 있습니다.", "가장 가까운 수를 먼저 정한 뒤, 그 수를 천의 자리까지 반올림하세요."],
    ["천의 자리까지 버림한 수와 반올림한 수를 각각 써서 비교하세요.", "빈칸에 0부터 9까지 넣고 두 결과가 같은지 확인하세요.", "버림과 반올림이 같아지려면 뒤의 세 자리에서 반올림해 올릴 수 없어야 합니다."],
    ["올림과 버림의 결과가 같아지는 수를 먼저 찾아보세요.", "반올림도 같은 수가 되려면 어느 자리에서 올림이 일어나지 않아야 할까요?", "세 방법의 결과가 같으려면 해당 자리의 배수인 수만 남습니다. 범위의 양 끝을 확인하세요."],
    ["십의 자리(또는 그보다 큰 자리)까지 올림한 결과와 반올림한 결과를 비교하세요.", "두 번째 조건에서는 더 큰 자리의 올림과 반올림 결과가 달라져야 합니다.", "두 조건을 각각 만족하는 끝자리 범위를 정한 뒤, 전체 자연수에서 전수 확인하세요."]
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
    if (index === 3) {
      const value = pools[3][poolIndex];
      const prefix = Math.floor(value / 1000);
      const suffix = value % 100;
      const answers = [];
      for (let digit = 0; digit <= 9; digit++) {
        const candidate = prefix * 1000 + digit * 100 + suffix;
        if (floor(candidate, 1000) === round(candidate, 1000)) answers.push(digit);
      }
      const displayed = `${prefix}□${String(suffix).padStart(2, "0")}`;
      const answer = answers.join(", ");
      const rows = Array.from({ length: 10 }, (_, digit) => {
        const candidate = prefix * 1000 + digit * 100 + suffix;
        return { digit, candidate, down: floor(candidate, 1000), nearest: round(candidate, 1000), matches: floor(candidate, 1000) === round(candidate, 1000) };
      });
      const prompt = `다음 여섯 자리 수를 버림, 반올림하여 각각 천의 자리까지 나타낸 수는 같습니다. ${displayed}의 □ 안에 들어갈 수 있는 숫자를 모두 쓰세요.${help}`;
      const solution = `천의 자리까지 버림한 수와 반올림한 수가 같으려면 백의 자리 아래의 수가 ${fmt(500)}보다 작아야 합니다. ${fmt(suffix)}를 고정하고 백의 자리 숫자를 0부터 9까지 확인하면 가능한 숫자는 ${answer}입니다. ${rows.filter(row => row.matches).map(row => `${row.digit}${particle(row.digit, "를", "을")} 넣으면 ${fmt(row.candidate)} → 버림 ${fmt(row.down)}, 반올림 ${fmt(row.nearest)}입니다.`).join(" ")} 5부터 9까지 넣으면 백의 자리 아래가 ${fmt(500)} 이상이 되어 반올림 결과가 버림 결과보다 커집니다. 따라서 답은 ${answer}입니다.`;
      return { prompt, answer, solution, questionModel: { prefix, suffix, displayed }, answerModel: { digits: answers } };
    }
    if (index === 4) {
      const [digitLength, unit] = pools[4][poolIndex];
      const lower = 10 ** (digitLength - 1), upper = 10 ** digitLength - 1;
      const matching = [];
      for (let n = lower; n <= upper; n++) if (ceil(n, unit) === floor(n, unit) && floor(n, unit) === round(n, unit)) matching.push(n);
      const first = Math.ceil(lower / unit) * unit, last = Math.floor(upper / unit) * unit;
      const answer = fmt(matching.length);
      const place = unit === 10 ? "십" : unit === 100 ? "백" : "천";
      const prompt = `${digitLength}자리 자연수 중에서 올림, 버림, 반올림의 어떠한 방법으로 어림하여 ${place}의 자리까지 나타내어도 같은 수가 되는 것은 모두 몇 개인가요?${help}`;
      const solution = `올림과 버림의 결과가 같으려면 원래 수가 ${fmt(unit)}의 배수여야 합니다. 이 수는 ${fmt(first)}부터 ${fmt(last)}까지 ${fmt(unit)}씩 증가합니다. 개수는 (${fmt(last)} − ${fmt(first)}) ÷ ${fmt(unit)} + 1 = ${answer}입니다. 이 수들은 이미 ${place}의 자리까지 정확한 수이므로 반올림 결과도 같습니다.`;
      return { prompt, answer, solution, questionModel: { digitLength, unit, lower, upper }, answerModel: { count: matching.length, first, last }, auditModel: { matchingCount: matching.length } };
    }
    if (index === 5) {
      const [digitLength, smallUnit, largeUnit] = pools[5][poolIndex];
      const lower = 10 ** (digitLength - 1), upper = 10 ** digitLength - 1;
      let count = 0;
      for (let n = lower; n <= upper; n++) if (ceil(n, smallUnit) === round(n, smallUnit) && ceil(n, largeUnit) !== round(n, largeUnit)) count++;
      const smallPlace = smallUnit === 10 ? "십" : smallUnit === 100 ? "백" : "천";
      const largePlace = largeUnit === 100 ? "백" : largeUnit === 1000 ? "천" : "만";
      const prompt = `다음 조건을 모두 만족하는 ${digitLength}자리 자연수는 몇 개인가요?<ol><li>올림하여 ${smallPlace}의 자리까지 나타낸 수와 반올림하여 ${smallPlace}의 자리까지 나타낸 수는 같습니다.</li><li>올림하여 ${largePlace}의 자리까지 나타낸 수와 반올림하여 ${largePlace}의 자리까지 나타낸 수는 다릅니다.</li></ol>${help}`;
      const half = Math.floor(smallUnit / 2);
      const countPerBlock = 5 * half + 4;
      const blockCount = 9;
      const answer = fmt(count);
      const solution = `먼저 ${fmt(smallUnit)}씩 묶어 봅니다. 첫째 조건을 만족하려면 각 묶음에서 나머지가 0 또는 ${fmt(Math.ceil(smallUnit / 2))} 이상이어야 합니다. 큰 자리(${fmt(largeUnit)})에서 올림과 반올림이 달라지는 부분은 큰 자리 묶음의 나머지가 1부터 ${fmt(5 * smallUnit - 1)}까지인 구간입니다. 이 구간은 첫 부분 구간 하나와 뒤이은 네 구간, 모두 다섯 개의 작은 자리 단위 구간으로 나뉩니다. 첫 부분 구간에서는 ${fmt(half)}개, 나머지 네 구간에서는 각각 ${fmt(half + 1)}개가 첫째 조건도 만족하므로 큰 자리 묶음 하나마다 ${fmt(half)} + ${fmt(half + 1)} × 4 = ${fmt(countPerBlock)}개입니다. ${digitLength}자리 범위에는 이런 큰 자리 묶음이 ${fmt(blockCount)}개 있으므로 ${fmt(countPerBlock)} × ${fmt(blockCount)} = ${answer}개입니다.`;
      return { prompt, answer, solution, questionModel: { digitLength, smallUnit, largeUnit, lower, upper }, answerModel: { count } };
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

  const definitions = ids.map((sourceItemId, index) => Object.freeze({ sourceItemId, generatorKey: keys[index], poolCount: 3, kind: ["rounding-ceil-table", "rounding-difference", "rounding-nearest-card-number", "rounding-digit-set", "rounding-common-estimate-count", "rounding-adjacent-place-count"][index] }));
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
