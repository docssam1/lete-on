(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_CUBOID_PAGE54_EXAMPLE43 = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";
  const sourceItemId = "5-2-u5-e4-example-4-3";
  const generatorKey = "source52CuboidPage54Example43";
  const definition = Object.freeze({ sourceItemId, generatorKey, sourcePdfPage: 50, sourcePrintedPage: 54 });
  const front = Object.freeze([[1, 6, 1], [5, 2, 5]]);
  const top = Object.freeze([[4, 4, 4], [4, 4, 4]]);
  const rightSide = Object.freeze([[5, 1], [2, 6]]);
  const pipPoints = Object.freeze({
    1: [[0.5, 0.5]],
    2: [[0.27, 0.28], [0.73, 0.72]],
    3: [[0.27, 0.28], [0.5, 0.5], [0.73, 0.72]],
    4: [[0.27, 0.28], [0.73, 0.28], [0.27, 0.72], [0.73, 0.72]],
    5: [[0.27, 0.28], [0.73, 0.28], [0.5, 0.5], [0.27, 0.72], [0.73, 0.72]],
    6: [[0.27, 0.25], [0.73, 0.25], [0.27, 0.5], [0.73, 0.5], [0.27, 0.75], [0.73, 0.75]]
  });
  function pipMarkup(value, x, y, w, h, prefix, skewX = 0) {
    return pipPoints[value].map(([px, py], index) => `<circle class="pip" cx="${x + px * w + py * skewX}" cy="${y + py * h}" r="3.8" data-pip="${value}-${prefix}-${index + 1}"/>`).join("");
  }
  function sidePipMarkup(value, x, y, prefix) {
    return pipPoints[value].map(([px, py], index) => `<circle class="pip" cx="${x + px * 36}" cy="${y - px * 36 + py * 62}" r="3.8" data-pip="${value}-${prefix}-${index + 1}"/>`).join("");
  }
  function sourceDiagram() {
    const parts = [];
    const u = 74, d = 36, h = 62, x0 = 28, y0 = 88;
    // Draw six top faces (two rows by three columns); every printed top face shows four pips.
    for (let depth = 1; depth >= 0; depth -= 1) {
      for (let col = 0; col < 3; col += 1) {
        const x = x0 + col * u + depth * d;
        const y = y0 - depth * d;
        parts.push(`<polygon class="top-face" points="${x},${y} ${x + u},${y} ${x + u + d},${y - d} ${x + d},${y - d}"/>`);
        parts.push(pipPoints[top[depth][col]].map(([px,py],index)=>
          `<circle class="pip" cx="${x+px*u+py*d}" cy="${y-py*d}" r="3.8" data-pip="${top[depth][col]}-top-${depth}-${col}-${index+1}"/>`).join(""));
      }
    }
    // Draw the 2×2 visible right side and its printed pips.
    for (let depth = 1; depth >= 0; depth -= 1) {
      for (let row = 0; row < 2; row += 1) {
        const x = x0 + 3 * u + depth * d;
        const y = y0 + row * h - depth * d;
        parts.push(`<polygon class="side-face" points="${x},${y} ${x + d},${y - d} ${x + d},${y - d + h} ${x},${y + h}"/>`);
        parts.push(sidePipMarkup(rightSide[depth][row], x + 4, y + 3, `side-${depth}-${row}`));
      }
    }
    // Draw the six front faces with the pips read from the clean source scan.
    for (let row = 0; row < 2; row += 1) {
      for (let col = 0; col < 3; col += 1) {
        const x = x0 + col * u, y = y0 + row * h;
        parts.push(`<rect class="front-face" x="${x}" y="${y}" width="${u}" height="${h}"/>`);
        parts.push(pipMarkup(front[row][col], x + 8, y + 6, u - 16, h - 12, `front-${row}-${col}`));
      }
    }
    return `<figure class="source52-p54e43-figure"><svg class="source52-p54e43-block" viewBox="0 0 440 250" role="img" aria-label="주사위 12개를 가로 3개, 깊이 2개, 높이 2개로 붙인 모양. 앞면 윗줄은 1, 6, 1, 아랫줄은 5, 2, 5이고 위쪽 6면에는 각각 4개의 점이 있습니다. 오른쪽 면은 앞쪽 위 5, 아래 1이고 뒤쪽 위 2, 아래 6입니다." xmlns="http://www.w3.org/2000/svg"><g stroke="#4b463f" stroke-width="1.5" stroke-linejoin="round">${parts.join("")}</g></svg><figcaption>앞면 윗줄 1·6·1, 아랫줄 5·2·5 · 윗면은 모두 4</figcaption></figure>`;
  }
  function makeQuestion() {
    const figure = sourceDiagram();
    const prompt = `<div class="source52-p54e43-question" data-source-item-id="${sourceItemId}" data-pool-index="0"><p>그림과 같이 주사위 12개를 붙였습니다. 맞닿은 두 면의 눈 수가 서로 같고, 주사위에서 마주 보는 두 면의 눈 수의 합은 7입니다. 바깥 면에 있는 눈 수의 합은 얼마인가요?</p>${figure}</div>`;
    const solution = `<div class="source52-p54e43-solution" data-source-answer="${sourceItemId}"><p>주사위가 맞닿은 곳은 안쪽이므로 바깥에 드러난 면만 셉니다.</p><ol><li>가로로 3개씩 놓인 줄은 깊이 2줄과 높이 2층에 있어 모두 4줄입니다. 한 줄의 왼쪽 바깥 면을 x라 하면 첫째와 둘째 주사위가 맞닿은 눈은 7−x입니다. 둘째 주사위의 반대 면은 x이므로 셋째와 맞닿은 눈도 x이고, 오른쪽 바깥 면은 7−x입니다. 따라서 한 줄의 양쪽 바깥 눈의 합은 7이고 네 줄에서는 4×7=28입니다.</li><li>앞쪽 여섯 면의 눈 합은 (1+6+1)+(5+2+5)=20입니다. 깊이 방향으로 짝을 이룬 두 주사위는 맞닿은 눈이 같고 각 주사위의 마주 보는 면의 합은 7이므로, 앞·뒤 바깥 면의 합은 앞면 합의 2배인 20×2=40입니다.</li><li>윗면 여섯 개는 모두 4이므로 윗면 합은 6×4=24입니다. 높이 방향으로 짝을 이룬 주사위도 맞닿은 눈이 같아 위·아래 바깥 면의 합은 24×2=48입니다.</li></ol><p class="source52-p54e43-equation">바깥 눈의 합 = 28 + 40 + 48 = <strong>116</strong></p><p class="source52-p54e43-answer">답: <strong>116</strong></p></div>`;
    return Object.freeze({ prompt, answer: "116", solution, answerVisual: figure, sourceItemId, generator: generatorKey, variant: 0, variantIndex: 0, poolIndex: 0, verifiedPoolIndex: 0, verifiedVariantId: `${sourceItemId}:source-3x2x2-dice-block`, difficultyOffset: 0, difficultyLevel: 2, difficultyRank: 2, sourceStructurePreserved: true, answerVisualRequired: true, answerVisualStatus: "verified-reconstruction", publisherKeyVerified: false, publisherAnswerVerified: false, handwrittenAnswerVerified: false, answerVerification: "independent-axis-by-axis-exterior-pip-sum", generationMode: "fixed-verified-pool", verifiedVariantCount: 1, verifiedVariantTarget: 1 });
  }
  function install(target) {
    const api = target?.HSE_GENERATORS;
    if (!api || typeof api.generatorKey !== "function" || typeof api.generate !== "function") return false;
    if (api.__source52P54E43Installed) return true;
    const oldKey = api.generatorKey.bind(api), oldGenerate = api.generate.bind(api);
    const matches = type => type && (type.id === sourceItemId || type.sourceItemId === sourceItemId || type.generatorKey === generatorKey);
    api.generatorKey = type => matches(type) ? type.id === sourceItemId && type.sourceItemId === sourceItemId && type.generatorKey === generatorKey && type.reviewLocked === false && type.sourceVerified === true ? generatorKey : "" : oldKey(type);
    api.generate = (type, rank, difficulty, seed, variant = 0) => matches(type) ? api.generatorKey(type) && Number(variant) === 0 ? makeQuestion() : null : oldGenerate(type, rank, difficulty, seed, variant);
    if (Array.isArray(api.names) && !api.names.includes(generatorKey)) api.names.push(generatorKey);
    Object.defineProperty(api, "__source52P54E43Installed", { value: true, configurable: false, enumerable: false });
    return true;
  }
  return Object.freeze({ definition, sourceItemId, generatorKey, front, top, rightSide, sourceDiagram, makeQuestion, install });
});
