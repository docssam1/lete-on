(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_U4_PAGE43_MISSION5 = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";
  const id = "5-2-u4-e1-mission-5";
  const key = "source52ClosedTapeRingLengthPage43Mission5";
  const pools = Object.freeze([
    { pieceCount: 12, pieceLengthTenths: 53, overlapTenths: 7 },
    { pieceCount: 14, pieceLengthTenths: 48, overlapTenths: 5 },
    { pieceCount: 18, pieceLengthTenths: 37, overlapTenths: 4 }
  ].map(Object.freeze));
  const fmtTenths = value => {
    if (!Number.isSafeInteger(value) || value < 0) throw new TypeError("0 이상의 정확한 소수 첫째 자리까지만 사용할 수 있습니다.");
    return value % 10 === 0 ? String(value / 10) : `${Math.floor(value / 10)}.${value % 10}`;
  };
  const esc = value => String(value).replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));

  function calculate(pool) {
    if (!pool || !Number.isSafeInteger(pool.pieceCount) || pool.pieceCount < 3
      || !Number.isSafeInteger(pool.pieceLengthTenths) || pool.pieceLengthTenths <= 0
      || !Number.isSafeInteger(pool.overlapTenths) || pool.overlapTenths <= 0
      || pool.overlapTenths >= pool.pieceLengthTenths) {
      throw new TypeError("테이프 수·길이·겹친 길이를 확인해 주세요.");
    }
    const joinedCount = pool.pieceCount;
    const separateLengthTenths = joinedCount * pool.pieceLengthTenths;
    const overlapTotalTenths = joinedCount * pool.overlapTenths;
    const answerTenths = separateLengthTenths - overlapTotalTenths;
    if (![separateLengthTenths, overlapTotalTenths, answerTenths].every(Number.isSafeInteger) || answerTenths <= 0) {
      throw new RangeError("정확히 계산할 수 있는 양수 길이만 사용할 수 있습니다.");
    }
    return Object.freeze({
      pieceCount: pool.pieceCount,
      pieceLength: fmtTenths(pool.pieceLengthTenths),
      overlap: fmtTenths(pool.overlapTenths),
      joinedCount,
      separateLength: fmtTenths(separateLengthTenths),
      overlapTotal: fmtTenths(overlapTotalTenths),
      answerTenths,
      answer: fmtTenths(answerTenths)
    });
  }

  function diagram(result, showJoinCount = false) {
    const cx = 408, cy = 105, rx = 55, ry = 38;
    const seams = Array.from({ length: result.joinedCount }, (_, index) => {
      const angle = (Math.PI * 2 * index) / result.joinedCount;
      const dx = Math.cos(angle), dy = Math.sin(angle);
      const x1 = cx + dx * (rx - 11), y1 = cy + dy * (ry - 11);
      const x2 = cx + dx * (rx + 11), y2 = cy + dy * (ry + 11);
      const x = cx + dx * rx, y = cy + dy * ry;
      return `<line class="source52-u4-p43-m5-seam" x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}"/><circle class="source52-u4-p43-m5-overlap" cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3.1"/>`;
    }).join("");
    return `<svg class="source52-u4-p43-m5-diagram" viewBox="0 0 520 190" role="img" aria-label="테이프 한 장 ${result.pieceLength}센티미터, 겹친 길이 ${result.overlap}센티미터, ${result.pieceCount}장으로 만든 고리${showJoinCount ? `, 겹침 ${result.joinedCount}곳` : ""}. 그림은 개략도입니다."><g class="source52-u4-p43-m5-strip"><text x="105" y="25" text-anchor="middle" class="source52-u4-p43-m5-label">테이프 한 장 ${result.pieceLength}cm</text><path d="M28 63H202V102H28Z" class="source52-u4-p43-m5-piece"/><path d="M178 63H352V102H178Z" class="source52-u4-p43-m5-piece source52-u4-p43-m5-piece-second"/><path d="M178 63H202V102H178Z" class="source52-u4-p43-m5-overlap-block"/><path d="M28 50V43H202V50M178 113V120H202V113" class="source52-u4-p43-m5-measure"/><text x="190" y="139" text-anchor="middle" class="source52-u4-p43-m5-overlap-label">겹친 길이 ${result.overlap}cm</text><text x="384" y="82" text-anchor="middle" class="source52-u4-p43-m5-dots">···</text></g><g class="source52-u4-p43-m5-ring"><ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" class="source52-u4-p43-m5-ring-base"/>${seams}<text x="408" y="169" text-anchor="middle" class="source52-u4-p43-m5-label">${showJoinCount ? `고리 연결 ${result.joinedCount}곳` : "고리 모양 (개략도)"}</text></g></svg>`;
  }

  function build(poolIndex = 0, difficultyOffset = 0) {
    if (!Number.isSafeInteger(poolIndex) || poolIndex < 0 || poolIndex >= pools.length) throw new RangeError("확인된 수치 묶음 0~2만 사용할 수 있습니다.");
    if (![-1, 0, 1].includes(difficultyOffset)) throw new RangeError("난이도 오프셋은 -1, 0, 1이어야 합니다.");
    const pool = pools[poolIndex], result = calculate(pool);
    const visual = diagram(result);
    const hint = difficultyOffset < 0
      ? '<p class="source52-u4-p43-m5-hint">도움말: 고리로 닫을 때 마지막 조각도 첫 조각과 겹칩니다. 테이프가 몇 번 연결되는지 세어 보세요.</p>'
      : difficultyOffset > 0
        ? '<p class="source52-u4-p43-m5-hint">고리를 한 바퀴 따라가며 겹치는 곳의 수를 먼저 세어 식을 세워 보세요.</p>' : "";
    const prompt = `<div class="source52-u4-p43-m5-question" data-source-item-id="${id}" data-pool-index="${poolIndex}" data-difficulty-offset="${difficultyOffset}"><p>길이가 ${result.pieceLength}cm인 종이테이프 ${result.pieceCount}장을 ${result.overlap}cm씩 겹치게 이어 일렬로 길게 만들고, 마지막과 첫 테이프도 같은 길이로 겹쳐 고리 모양의 띠를 만들었습니다. 띠의 길이는 얼마인가요?</p>${visual}${hint}</div>`;
    const solution = `<div class="source52-u4-p43-m5-solution" data-source-answer="${id}" data-pool-index="${poolIndex}"><ol><li>고리에서는 마지막 테이프와 첫 번째 테이프도 이어지므로 겹치는 곳은 ${result.pieceCount}곳입니다.</li><li>테이프를 겹치지 않고 놓은 전체 길이는 ${result.pieceCount}×${result.pieceLength}=${result.separateLength}cm입니다.</li><li>겹친 부분의 길이는 ${result.pieceCount}×${result.overlap}=${result.overlapTotal}cm입니다.</li><li>띠의 길이는 ${result.separateLength}−${result.overlapTotal}=${result.answer}cm입니다.</li></ol><p class="source52-u4-p43-m5-answer"><strong>답: ${result.answer}cm</strong></p></div>`;
    return Object.freeze({
      prompt, answer: `${result.answer}cm`, solution, sourceItemId: id, generator: key,
      generationMode: "fixed-verified-pool", verifiedPoolIndex: poolIndex,
      verifiedVariantCount: pools.length, verifiedVariantTarget: pools.length,
      verifiedVariantId: `${id}:v${poolIndex}`, variantProvenance: "synthetic-source-structure",
      difficultyOffset, difficultyLevel: difficultyOffset + 1, difficultyRank: difficultyOffset + 1,
      sourceDifficultyRank: 1,
      difficultyDesign: ["guided-count-closed-loop-overlaps", "subtract-each-overlap-once", "independent-total-length-check"][difficultyOffset + 1],
      reasoningSteps: 4, sourceStepCount: 1, difficultyStepDelta: difficultyOffset, solutionPageWeight: 2,
      sourceStructurePreserved: true, sourcePdfPage: 39, sourcePrintedPage: 43,
      questionModel: { ...pool, answerModel: result }, answerModel: result,
      answerVisualRequired: true, answerVisualStatus: "verified-reconstruction", answerVisual: diagram(result, true),
      publisherKeyVerified: false, publisherAnswerVerified: false, handwrittenAnswerVerified: false,
      answerVerification: "exact-tenths-closed-loop-overlap-count"
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
    if (api.__source52U4Page43Mission5Installed) return true;
    const oldKey = api.generatorKey.bind(api), oldGenerate = api.generate.bind(api);
    api.generatorKey = type => belongs(type) ? (resolves(type) ? key : "") : oldKey(type);
    api.generate = (type, user, difficulty, seed, variant = 0) => belongs(type) ? generate(type, user, difficulty, seed, variant) : oldGenerate(type, user, difficulty, seed, variant);
    if (Array.isArray(api.names) && !api.names.includes(key)) api.names.push(key);
    Object.defineProperty(api, "__source52U4Page43Mission5Installed", { value: true });
    return true;
  }
  return Object.freeze({ id, key, pools, fmtTenths, calculate, diagram, build, generate, belongs, resolves, install });
});
