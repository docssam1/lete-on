(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_CUBE_BOX_MISSION3 = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const sourceItemId = "5-2-u1-e3-mission-3-cube-box-count";
  const generatorKey = "source52ApplicationMissionThreeCubeBoxes";
  // Synthetic centimetre dimensions; the printed 300×1000×400 cm / 15 cm values stay source-only.
  const pools = [
    { room: [330, 960, 420], side: 16 },
    { room: [360, 840, 450], side: 18 },
    { room: [390, 1080, 480], side: 20 }
  ];
  const dimensionDeltas = [0, 10, -10];
  const esc = value => String(value).replace(/[&<>"']/g, character => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));
  const fmt = value => Number(value).toLocaleString("en-US");

  function diagram(room, side) {
    const labels = room.map(value => `${value}cm`);
    return `<svg class="geometry-diagram source52-cube-box-diagram" data-source52-cube-box="true" data-room-cm="${room.join("x")}" data-cube-side-cm="${side}" role="img" aria-label="직육면체 창고: 가로 ${labels[0]}, 세로 ${labels[1]}, 높이 ${labels[2]}; 정육면체 상자 한 변 ${side}센티미터" viewBox="0 0 520 300" xmlns="http://www.w3.org/2000/svg"><path d="M125 170V78L260 38L395 78V170L260 222Z" fill="#edf3f9" stroke="#162b46" stroke-width="4"/><path d="M125 78L260 125L395 78M260 125V222M125 170L260 222L395 170" fill="none" stroke="#162b46" stroke-width="3"/><path d="M95 78V170M95 78h18M95 170h18M125 252h270M125 244v16M395 244v16" fill="none" stroke="#51657f" stroke-width="2" stroke-dasharray="6 5"/><text x="56" y="130" font-size="17" text-anchor="middle" transform="rotate(-90 56 130)">높이 ${esc(labels[2])}</text><text x="260" y="280" font-size="17" text-anchor="middle">가로 ${esc(labels[0])}</text><text x="277" y="43" font-size="16" text-anchor="middle" transform="rotate(-16 277 43)">세로 ${esc(labels[1])}</text><rect x="211" y="83" width="46" height="38" rx="4" fill="#fff" stroke="#526780" stroke-width="2"/><text x="234" y="108" font-size="13" text-anchor="middle">${esc(`${side}cm`)}</text></svg>`;
  }

  function build(variant, difficultyOffset) {
    const delta = dimensionDeltas[difficultyOffset + 1];
    const source = pools[variant];
    const room = source.room.map((value, index) => value + delta * (index + 1));
    const side = source.side;
    const counts = room.map(value => Math.floor(value / side));
    const remainders = room.map(value => value % side);
    const answer = counts.reduce((product, value) => product * value, 1);
    const support = difficultyOffset === -1
      ? `<p class="source52-cube-box-hint">도움말: 방의 길이를 모두 cm로 바꾼 뒤, 각 방향에서 상자 한 변 길이로 나누어 들어가는 개수를 구해 보세요.</p>` : "";
    const extra = difficultyOffset === 1
      ? `<p>각 방향에 남는 공간을 확인하고, 상자를 더 넣을 수 없는 까닭을 설명하세요.</p>` : "";
    const prompt = `<div class="source52-cube-box-question"><p>가로 ${room[0] / 100}m, 세로 ${room[1] / 100}m, 높이 ${room[2] / 100}m인 창고 안에 가로, 세로, 높이가 모두 ${side}cm인 상자를 넣으려고 한다. 창고에는 최대 몇 개까지 상자를 넣을 수 있겠는가?</p>${diagram(room, side)}${extra}${support}</div>`;
    const solution = `<div class="source52-cube-box-solution"><ol><li>창고의 세 길이를 cm로 나타내면 ${fmt(room[0])}cm, ${fmt(room[1])}cm, ${fmt(room[2])}cm입니다.</li><li>각 방향에 들어가는 상자 수는 각각 ${fmt(room[0])}÷${side}=${fmt(counts[0])}개, ${fmt(room[1])}÷${side}=${fmt(counts[1])}개, ${fmt(room[2])}÷${side}=${fmt(counts[2])}개입니다.</li><li>남는 길이는 각 방향 ${remainders.map(value => `${value}cm`).join(", ")}이므로 같은 방향으로 상자를 더 넣을 수 없습니다.</li><li>${fmt(counts[0])}×${fmt(counts[1])}×${fmt(counts[2])}=${fmt(answer)}개입니다.</li></ol></div>`;
    return {
      prompt: `<div data-source-item="${sourceItemId}" data-source-item-id="${sourceItemId}" data-pool-index="${variant}" data-variant="${variant}" data-difficulty-offset="${difficultyOffset}" data-level="${difficultyOffset + 1}">${prompt}</div>`,
      answer: `${fmt(answer)}개`, solution, sourceItemId, generator: generatorKey,
      generationMode: "fixed-verified-pool", verifiedPoolIndex: variant,
      verifiedVariantCount: pools.length, verifiedVariantTarget: pools.length,
      verifiedVariantId: `${sourceItemId}:v${variant}`, difficultyOffset,
      difficultyLevel: difficultyOffset + 1, difficultyRank: difficultyOffset + 1,
      difficultyDesign: ["guided-unit-conversion", "source-box-count", "explain-unused-space"][difficultyOffset + 1],
      reasoningSteps: 3 + difficultyOffset + 1, sourceStructurePreserved: true,
      answerVisualRequired: false, answerVisualStatus: "not-required", publisherKeyVerified: false,
      publisherAnswerVerified: false, handwrittenAnswerVerified: false,
      answerVerification: "independent-calculation-user-authorized",
      questionModel: { roomCm: room, cubeSideCm: side, axisCounts: counts },
      answerModel: { roomCm: room, cubeSideCm: side, axisCounts: counts, remaindersCm: remainders, boxes: answer }
    };
  }

  function getQuestion(variant = 0, difficultyOffset = 0) {
    if (!Number.isSafeInteger(variant) || variant < 0 || variant >= pools.length || ![-1, 0, 1].includes(difficultyOffset)) return null;
    return Object.freeze(build(variant, difficultyOffset));
  }
  const definition = Object.freeze({ sourceItemId, generatorKey, poolCount: pools.length });
  function resolves(type) { return Boolean(type && type.id === sourceItemId && type.sourceItemId === sourceItemId && type.generatorKey === generatorKey); }
  function install(target) {
    const generators = target?.HSE_GENERATORS;
    if (!generators || typeof generators.generatorKey !== "function" || typeof generators.generate !== "function") return false;
    if (generators.__source52ApplicationMissionThreeInstalled) return true;
    const previousKey = generators.generatorKey.bind(generators);
    const previousGenerate = generators.generate.bind(generators);
    const belongs = type => Boolean(type && (type.id === sourceItemId || type.sourceItemId === sourceItemId || type.generatorKey === generatorKey));
    generators.generatorKey = type => !belongs(type) ? previousKey(type) : resolves(type) && type.reviewLocked === false && type.sourceVerified === true ? generatorKey : "";
    generators.generate = (type, levelRank, difficultyOffset, seed, variant = 0) => !belongs(type) ? previousGenerate(type, levelRank, difficultyOffset, seed, variant) : resolves(type) && type.reviewLocked === false && type.sourceVerified === true ? getQuestion(variant, difficultyOffset ?? 0) : null;
    if (Array.isArray(generators.names) && !generators.names.includes(generatorKey)) generators.names.push(generatorKey);
    Object.defineProperty(generators, "__source52ApplicationMissionThreeInstalled", { value: true });
    return true;
  }
  return Object.freeze({ definition, pools, getQuestion, resolves, install, publisherKeyVerified: false });
});
