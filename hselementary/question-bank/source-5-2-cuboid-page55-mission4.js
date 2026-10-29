(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_CUBOID_PAGE55_M4 = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const sourceItemId = "5-2-u5-e4-mission-4";
  const generatorKey = "source52FourDiceWallHiddenPipsPage55Mission4";
  const definition = Object.freeze({ sourceItemId, generatorKey, sourcePdfPage: 51, sourcePrintedPage: 55 });
  const dice = Object.freeze([
    Object.freeze({ id: "upper", x: 69, bottom: 198, top: 1, front: 3, right: 5 }),
    Object.freeze({ id: "front-left", x: 42, bottom: 294, top: 1, front: 2, right: 3 }),
    Object.freeze({ id: "lower-right", x: 145, bottom: 274, top: 6, front: 2, right: 4 })
  ]);
  const visibleFaces = Object.freeze(dice.flatMap(die => [die.top, die.front, die.right]));
  const allPips = 4 * 21;
  const visiblePips = visibleFaces.reduce((sum, value) => sum + value, 0);
  const answer = allPips - visiblePips;
  const pipPatterns = Object.freeze({
    1: [[0.5, 0.5]],
    2: [[0.25, 0.25], [0.75, 0.75]],
    3: [[0.25, 0.25], [0.5, 0.5], [0.75, 0.75]],
    4: [[0.25, 0.25], [0.75, 0.25], [0.25, 0.75], [0.75, 0.75]],
    5: [[0.25, 0.25], [0.75, 0.25], [0.5, 0.5], [0.25, 0.75], [0.75, 0.75]],
    6: [[0.25, 0.2], [0.75, 0.2], [0.25, 0.5], [0.75, 0.5], [0.25, 0.8], [0.75, 0.8]]
  });

  function pips(value, face, { x, bottom, size, dx, dy }) {
    const points = pipPatterns[value].map(([u, v]) => {
      if (face === "top") return [x + u * size + v * dx, bottom - size - v * dy];
      if (face === "front") return [x + u * size, bottom - size + v * size];
      return [x + size + v * dx, bottom - size - v * dy + u * size];
    });
    return points.map(([cx, cy]) => `<circle class="source52-p55m4-pip" cx="${cx}" cy="${cy}" r="4.1"/>`).join("");
  }

  function dieSvg(die) {
    const size = 76, dx = 27, dy = 20, { x, bottom } = die;
    return `<g class="source52-p55m4-die" data-visible-pips="${die.top},${die.front},${die.right}"><polygon class="source52-p55m4-top" points="${x},${bottom - size} ${x + dx},${bottom - size - dy} ${x + size + dx},${bottom - size - dy} ${x + size},${bottom - size}"/><polygon class="source52-p55m4-right" points="${x + size},${bottom - size} ${x + size + dx},${bottom - size - dy} ${x + size + dx},${bottom - dy} ${x + size},${bottom}"/><rect class="source52-p55m4-front" x="${x}" y="${bottom - size}" width="${size}" height="${size}"/>${pips(die.top, "top", { x, bottom, size, dx, dy })}${pips(die.front, "front", { x, bottom, size, dx, dy })}${pips(die.right, "right", { x, bottom, size, dx, dy })}</g>`;
  }

  function diagram() {
    const cubes = [dice[2], dice[0], dice[1]].map(dieSvg).join("");
    return `<svg class="source52-p55m4-diagram" viewBox="0 0 270 335" role="img" aria-label="벽과 바닥 모서리에 네 주사위를 쌓았습니다. 세 주사위의 윗면, 앞면, 오른쪽 면에 보이는 눈은 각각 1·3·5, 1·2·3, 6·2·4이며 한 주사위는 완전히 가려져 있습니다." xmlns="http://www.w3.org/2000/svg"><path class="source52-p55m4-wall" d="M96 20v82"/><path class="source52-p55m4-floor" d="M42 294L12 324M248 254h19"/>${cubes}<text class="source52-p55m4-caption" x="135" y="330" text-anchor="middle">보이는 면의 눈</text></svg>`;
  }

  function verifyModel() {
    if (dice.length !== 3 || visibleFaces.join(",") !== "1,3,5,1,2,3,6,2,4") throw new Error("원문에서 읽은 세 주사위의 아홉 면 눈이 달라졌습니다.");
    for (const die of dice) {
      const faces = [die.top, die.front, die.right];
      if (new Set(faces).size !== 3 || faces.some((value, i) => faces.slice(i + 1).some(other => value + other === 7))) throw new Error("보이는 세 면은 서로 다른 인접면이어야 합니다.");
    }
    if (visiblePips !== 27 || allPips !== 84 || answer !== 57) throw new Error("네 주사위의 전체 눈에서 보이는 눈을 뺀 값이 57이어야 합니다.");
    return Object.freeze({ sourceItemId, visibleFaces, visibleFaceCount: visibleFaces.length, visiblePips, standardDieTotal: 21, dieCount: 4, allPips, answer, publisherAnswerKeyVerified: false });
  }

  function makeQuestion() {
    const answerModel = verifyModel();
    const prompt = `<div class="source52-p55m4-question" data-source-item-id="${sourceItemId}" data-pool-index="0"><p>네 개의 주사위를 다음 그림과 같이 벽에 쌓아 놓았습니다. 보이지 않는 면에 있는 눈의 수의 합은 얼마인가요? 주사위의 마주 보는 면의 눈의 수의 합은 7입니다.</p>${diagram()}</div>`;
    const solution = `<div class="source52-p55m4-solution" data-source-answer="${sourceItemId}"><p>주사위 한 개의 여섯 면에 있는 눈은 1부터 6까지이므로 합은 21입니다.</p>${diagram()}<ol><li>주사위 4개의 전체 눈의 합은 21×4=84입니다.</li><li>그림에서 보이는 아홉 면의 눈은 1, 3, 5, 1, 2, 3, 6, 2, 4이고, 합은 27입니다.</li><li>따라서 가려진 면의 눈의 합은 84−27=57입니다. 가려진 각 면의 수를 따로 정할 필요는 없습니다.</li></ol><p class="source52-p55m4-final-answer">답: 57</p></div>`;
    return Object.freeze({ prompt, answer: "57", solution, sourceItemId, generator: generatorKey, variant: 0, variantIndex: 0, poolIndex: 0, verifiedPoolIndex: 0, verifiedVariantId: `${sourceItemId}:visible-face-total`, difficultyOffset: 0, difficultyLevel: 2, difficultyRank: 2, sourceStructurePreserved: true, answerVisualRequired: false, answerVisualStatus: "not-required", publisherKeyVerified: false, publisherAnswerVerified: false, handwrittenAnswerVerified: false, answerVerification: "independent-standard-dice-total-minus-visible-pips", generationMode: "fixed-verified-pool", verifiedVariantCount: 1, verifiedVariantTarget: 1, answerModel });
  }

  function install(target) {
    const api = target?.HSE_GENERATORS;
    if (!api || typeof api.generatorKey !== "function" || typeof api.generate !== "function") return false;
    if (api.__source52P55M4Installed) return true;
    const previousKey = api.generatorKey.bind(api), previousGenerate = api.generate.bind(api);
    const matches = type => type && (type.id === sourceItemId || type.sourceItemId === sourceItemId || type.generatorKey === generatorKey);
    api.generatorKey = type => matches(type)
      ? type.id === sourceItemId && type.sourceItemId === sourceItemId && type.generatorKey === generatorKey && type.reviewLocked === false && type.sourceVerified === true ? generatorKey : ""
      : previousKey(type);
    api.generate = (type, rank, difficulty, seed, variant = 0) => matches(type)
      ? api.generatorKey(type) && Number(variant) === 0 ? makeQuestion() : null
      : previousGenerate(type, rank, difficulty, seed, variant);
    if (Array.isArray(api.names) && !api.names.includes(generatorKey)) api.names.push(generatorKey);
    Object.defineProperty(api, "__source52P55M4Installed", { value: true });
    return true;
  }

  return Object.freeze({ definition, dice, visibleFaces, visiblePips, allPips, answer, pipPatterns, pips, dieSvg, diagram, verifyModel, makeQuestion, install });
});
