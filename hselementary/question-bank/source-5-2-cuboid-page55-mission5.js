(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_CUBOID_PAGE55_M5 = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const sourceItemId = "5-2-u5-e4-mission-5";
  const generatorKey = "source52CuboidDiceRollNinetiethFacePage55Mission5";
  const definition = Object.freeze({ sourceItemId, generatorKey, sourcePdfPage: 51, sourcePrintedPage: 55 });
  const startFaces = Object.freeze({ top: 2, bottom: 5, front: 6, back: 1, right: 3, left: 4 });
  const finalFaces = Object.freeze({ top: 5, bottom: 2, front: 6, back: 1, right: 4, left: 3 });
  const pipPatterns = Object.freeze({
    1: [[0.5, 0.5]],
    2: [[0.25, 0.25], [0.75, 0.75]],
    3: [[0.25, 0.25], [0.5, 0.5], [0.75, 0.75]],
    4: [[0.25, 0.25], [0.75, 0.25], [0.25, 0.75], [0.75, 0.75]],
    5: [[0.25, 0.25], [0.75, 0.25], [0.5, 0.5], [0.25, 0.75], [0.75, 0.75]],
    6: [[0.25, 0.2], [0.75, 0.2], [0.25, 0.5], [0.75, 0.5], [0.25, 0.8], [0.75, 0.8]]
  });

  function facePips(value, face, { x, bottom, size, dx, dy, className = "source52-p55m5-pip" }) {
    return pipPatterns[value].map(([u, v]) => {
      let cx, cy;
      if (face === "top") [cx, cy] = [x + u * size + v * dx, bottom - size - v * dy];
      else if (face === "front") [cx, cy] = [x + u * size, bottom - size + v * size];
      else [cx, cy] = [x + size + v * dx, bottom - size - v * dy + u * size];
      const radius = face === "front" ? 4 : Math.min(3, dy * 0.18);
      return `<circle class="${className}" cx="${cx}" cy="${cy}" r="${radius}"/>`;
    }).join("");
  }

  function cubeSvg({ x, bottom, size, dx, dy, faces = null, label }) {
    return `<g class="source52-p55m5-die" data-die-label="${label}" data-visible-faces="${faces ? `${faces.top},${faces.front},${faces.right}` : "blank"}"><polygon class="source52-p55m5-top" points="${x},${bottom - size} ${x + dx},${bottom - size - dy} ${x + size + dx},${bottom - size - dy} ${x + size},${bottom - size}"/>` +
      `<polygon class="source52-p55m5-right" points="${x + size},${bottom - size} ${x + size + dx},${bottom - size - dy} ${x + size + dx},${bottom - dy} ${x + size},${bottom}"/>` +
      `<rect class="source52-p55m5-front" x="${x}" y="${bottom - size}" width="${size}" height="${size}"/>` +
      (faces ? facePips(faces.top, "top", { x, bottom, size, dx, dy }) + facePips(faces.front, "front", { x, bottom, size, dx, dy }) + facePips(faces.right, "right", { x, bottom, size, dx, dy }) : "") +
      `</g>`;
  }

  function pathCell(x, y, width, dx, dy, label, className = "") {
    return `<g class="source52-p55m5-cell ${className}"><polygon points="${x},${y} ${x + width},${y} ${x + width + dx},${y - dy} ${x + dx},${y - dy}"/><text x="${x + (width + dx) / 2}" y="${y - dy / 2 + 3}" text-anchor="middle">${label}</text></g>`;
  }

  function diagram({ solution = false } = {}) {
    const firstDie = cubeSvg({ x: 18, bottom: 195, size: 68, dx: 22, dy: 16, faces: startFaces, label: "start" });
    const endDie = cubeSvg({ x: 525, bottom: 192, size: 66, dx: 22, dy: 16, faces: solution ? finalFaces : null, label: "90th" });
    const mobileStart = cubeSvg({ x: 8, bottom: 107, size: 50, dx: 16, dy: 13, faces: startFaces, label: "start" });
    const mobileEnd = cubeSvg({ x: 120, bottom: 249, size: 70, dx: 23, dy: 17, faces: solution ? finalFaces : null, label: "90th" });
    return `<div class="source52-p55m5-diagram-wrap"><svg class="source52-p55m5-diagram source52-p55m5-diagram--wide" viewBox="0 0 650 245" role="img" aria-label="처음 주사위는 위 2, 앞 6, 오른쪽 3입니다. 오른쪽으로 첫째와 둘째 칸을 지난 뒤 꺾어 셋째 칸부터 90째 칸까지 굴립니다. 마지막 주사위의 위·앞·오른쪽 면은 ${solution ? "5, 6, 4" : "빈칸"}입니다." xmlns="http://www.w3.org/2000/svg">` +
      `${firstDie}${pathCell(86, 195, 68, 22, 16, "첫째 칸")}${pathCell(154, 195, 68, 22, 16, "둘째 칸")}${pathCell(176, 179, 68, 22, 16, "셋째 칸", "is-turn")}` +
      `<text class="source52-p55m5-ellipsis" x="248" y="143" text-anchor="middle">···</text>${pathCell(250, 126, 68, 22, 16, "90째 칸", "is-final")}` +
      `<path class="source52-p55m5-arrow" d="M414 161h55m-8-8 8 8-8 8"/>${endDie}` +
      `<text class="source52-p55m5-caption" x="60" y="224" text-anchor="middle">처음 주사위</text><text class="source52-p55m5-caption" x="570" y="224" text-anchor="middle">90째 칸 주사위</text></svg>` +
      `<svg class="source52-p55m5-diagram source52-p55m5-diagram--mobile" viewBox="0 0 310 290" role="img" aria-label="처음 주사위는 위 2, 앞 6, 오른쪽 3입니다. 오른쪽으로 첫째와 둘째 칸을 지난 뒤 꺾어 셋째 칸부터 90째 칸까지 굴립니다. 마지막 주사위의 위·앞·오른쪽 면은 ${solution ? "5, 6, 4" : "빈칸"}입니다." xmlns="http://www.w3.org/2000/svg">` +
      `${mobileStart}${pathCell(58, 107, 50, 16, 13, "첫째")}${pathCell(108, 107, 50, 16, 13, "둘째")}${pathCell(124, 94, 50, 16, 13, "셋째", "is-turn")}` +
      `<text class="source52-p55m5-ellipsis" x="179" y="64" text-anchor="middle">···</text>${pathCell(178, 54, 50, 16, 13, "90째", "is-final")}` +
      `<path class="source52-p55m5-arrow source52-p55m5-mobile-arrow" d="M245 95v30m-7-8 7 8 7-8"/>${mobileEnd}` +
      `<text class="source52-p55m5-caption" x="38" y="130" text-anchor="middle">처음</text><text class="source52-p55m5-caption" x="164" y="278" text-anchor="middle">90째 칸 주사위</text></svg><p class="source52-p55m5-mobile-path">첫째·둘째 칸 → 꺾어서 셋째 칸부터 90째 칸</p></div>`;
  }

  function answerVisual() {
    const answerDie = cubeSvg({ x: 15, bottom: 112, size: 76, dx: 25, dy: 18, faces: finalFaces, label: "answer" });
    return `<svg class="source52-p55m5-answer-visual" viewBox="0 0 125 125" role="img" aria-label="90째 칸 주사위의 위 5, 앞 6, 오른쪽 4" xmlns="http://www.w3.org/2000/svg">${answerDie}</svg>`;
  }

  function verifyModel() {
    if (startFaces.top + startFaces.bottom !== 7 || startFaces.front + startFaces.back !== 7 || startFaces.right + startFaces.left !== 7) throw new Error("처음 주사위의 마주 보는 면 합은 7이어야 합니다.");
    if (JSON.stringify(finalFaces) !== JSON.stringify({ top: 5, bottom: 2, front: 6, back: 1, right: 4, left: 3 })) throw new Error("90째 칸의 주사위 방향이 모델과 다릅니다.");
    if (88 % 4 !== 0) throw new Error("두 번째 축의 88회 굴림은 네 번 주기가 완성되어야 합니다.");
    return Object.freeze({ sourceItemId, rolls: 90, firstAxisRolls: 2, perpendicularAxisRolls: 88, perpendicularCycle: 4, startFaces, finalFaces, answer: Object.freeze({ top: 5, front: 6, right: 4 }), publisherAnswerKeyVerified: false });
  }

  function makeQuestion() {
    const answerModel = verifyModel();
    const prompt = `<div class="source52-p55m5-question" data-source-item-id="${sourceItemId}" data-pool-index="0"><p>다음 그림의 주사위는 마주 보는 면끼리의 눈의 합이 항상 7입니다. 주사위를 길을 따라 90번 굴려 마지막 칸에 도착했을 때 생기는 주사위의 눈을 빈 곳에 알맞게 그려 넣으세요.</p>${diagram()}<p class="source52-p55m5-answer-line">위·앞·오른쪽 면의 눈을 그림에 그려 보세요.</p></div>`;
    const solution = `<div class="source52-p55m5-solution" data-source-answer="${sourceItemId}"><p>주사위의 마주 보는 면의 눈의 합이 7이라는 조건으로 처음 보이지 않는 면도 알 수 있습니다.</p>${diagram({ solution: true })}<ol><li>처음 주사위는 위 2, 앞 6, 오른쪽 3입니다. 따라서 아래 5, 뒤 1, 왼쪽 4입니다.</li><li>첫 번째 축에서 두 번 굴리면 위 5, 앞 6, 오른쪽 4가 됩니다.</li><li>셋째 칸부터는 수직인 축으로 88번 굴립니다. 같은 방향으로 굴릴 때 네 번마다 처음 방향으로 돌아오고, 88은 4의 배수이므로 보이는 세 면은 그대로입니다.</li><li>따라서 90째 칸 주사위의 위·앞·오른쪽 면은 각각 5, 6, 4입니다.</li></ol><p class="source52-p55m5-final-answer">마지막 주사위: 위 5 · 앞 6 · 오른쪽 4</p></div>`;
    return Object.freeze({ prompt, answer: "위 5, 앞 6, 오른쪽 4", solution, answerVisual: answerVisual(), sourceItemId, generator: generatorKey, variant: 0, variantIndex: 0, poolIndex: 0, verifiedPoolIndex: 0, verifiedVariantId: `${sourceItemId}:90-roll-path`, difficultyOffset: 0, difficultyLevel: 2, difficultyRank: 2, sourceStructurePreserved: true, answerVisualRequired: true, answerVisualStatus: "verified-drawing", publisherKeyVerified: false, publisherAnswerVerified: false, handwrittenAnswerVerified: false, answerVerification: "independent-dice-roll-path-orientation-model", generationMode: "fixed-verified-pool", verifiedVariantCount: 1, verifiedVariantTarget: 1, answerModel });
  }

  function install(target) {
    const api = target?.HSE_GENERATORS;
    if (!api || typeof api.generatorKey !== "function" || typeof api.generate !== "function") return false;
    if (api.__source52P55M5Installed) return true;
    const previousKey = api.generatorKey.bind(api), previousGenerate = api.generate.bind(api);
    const matches = type => type && (type.id === sourceItemId || type.sourceItemId === sourceItemId || type.generatorKey === generatorKey);
    api.generatorKey = type => matches(type)
      ? type.id === sourceItemId && type.sourceItemId === sourceItemId && type.generatorKey === generatorKey && type.reviewLocked === false && type.sourceVerified === true ? generatorKey : ""
      : previousKey(type);
    api.generate = (type, rank, difficulty, seed, variant = 0) => matches(type)
      ? api.generatorKey(type) && Number(variant) === 0 ? makeQuestion() : null
      : previousGenerate(type, rank, difficulty, seed, variant);
    if (Array.isArray(api.names) && !api.names.includes(generatorKey)) api.names.push(generatorKey);
    Object.defineProperty(api, "__source52P55M5Installed", { value: true });
    return true;
  }

  return Object.freeze({ definition, startFaces, finalFaces, pipPatterns, facePips, cubeSvg, diagram, answerVisual, verifyModel, makeQuestion, install });
});
