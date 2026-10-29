(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_CUBOID_PAGE49_M2 = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const sourceItemId = "5-2-u5-e1-mission-2";
  const generatorKey = "source52CuboidViewsSidePerimeterPage49Mission2";
  const definition = Object.freeze({ sourceItemId, generatorKey, sourcePdfPage: 45, sourcePrintedPage: 49 });
  const source = Object.freeze({ frontWidthCm: 7, frontHeightCm: 10, topWidthCm: 7, topDepthCm: 5 });

  function verifyModel() {
    const { frontWidthCm, frontHeightCm, topWidthCm, topDepthCm } = source;
    if (frontWidthCm !== topWidthCm) throw new Error("앞면과 윗면의 공통 가로 길이가 일치해야 합니다.");
    const sidePerimeterCm = 2 * (frontHeightCm + topDepthCm);
    if (sidePerimeterCm !== 30) throw new Error("옆면은 10cm×5cm 직사각형이고 둘레는 30cm여야 합니다.");
    return Object.freeze({ widthCm: frontWidthCm, heightCm: frontHeightCm, depthCm: topDepthCm, sidePerimeterCm });
  }

  function viewsDiagram(includeSide = false) {
    const model = verifyModel();
    return `<svg class="source52-p49m2-views" viewBox="0 0 ${includeSide ? 600 : 410} 240" role="img" aria-label="${includeSide ? "앞에서 본 7cm와 10cm, 위에서 본 7cm와 5cm, 옆면의 높이 10cm와 깊이 5cm" : "앞에서 본 직사각형은 가로 7cm 세로 10cm, 위에서 본 직사각형은 가로 7cm 세로 5cm"}" xmlns="http://www.w3.org/2000/svg">
      <g class="source52-p49m2-view">
        <rect x="72" y="36" width="112" height="160" />
        <path d="M72 28v-8m112 8v-8M72 22h112M64 36h-8m8 160h-8M60 36v160" />
        <text x="128" y="15" text-anchor="middle">7cm</text><text x="31" y="121" text-anchor="middle" transform="rotate(-90 31 121)">10cm</text>
        <text class="source52-p49m2-label" x="128" y="225" text-anchor="middle">앞</text>
      </g>
      <g class="source52-p49m2-view">
        <rect x="264" y="71" width="112" height="80" />
        <path d="M264 63v-8m112 8v-8M264 57h112M256 71h-8m8 80h-8M252 71v80" />
        <text x="320" y="50" text-anchor="middle">7cm</text><text x="223" y="111" text-anchor="middle" transform="rotate(-90 223 111)">5cm</text>
        <text class="source52-p49m2-label" x="320" y="186" text-anchor="middle">위</text>
      </g>
      ${includeSide ? `<g class="source52-p49m2-result">
        <rect x="455" y="36" width="80" height="160" />
        <path d="M455 28v-8m80 8v-8M455 22h80M447 36h-8m8 160h-8M443 36v160" />
        <text x="495" y="15" text-anchor="middle">5cm</text><text x="414" y="121" text-anchor="middle" transform="rotate(-90 414 121)">10cm</text>
        <text class="source52-p49m2-label" x="495" y="225" text-anchor="middle">옆</text>
      </g>` : ""}
    </svg>`;
  }

  function makeQuestion() {
    const model = verifyModel();
    const prompt = `<div class="source52-p49m2-question" data-source-item-id="${sourceItemId}" data-pool-index="0"><p>다음은 어떤 직육면체를 앞과 위에서 본 모양입니다. 이 직육면체를 옆에서 보았을 때 보이는 면의 둘레는 몇 cm인가요?</p>${viewsDiagram(false)}</div>`;
    const solution = `<div class="source52-p49m2-solution" data-source-answer="${sourceItemId}"><p>앞에서 본 그림과 위에서 본 그림의 가로가 모두 7cm이므로 두 그림은 직육면체의 같은 가로 방향을 나타냅니다.</p>${viewsDiagram(true)}<ol><li>앞에서 본 그림에서 직육면체의 높이는 10cm입니다.</li><li>위에서 본 그림에서 직육면체의 깊이는 5cm입니다. 따라서 옆에서 보이는 면은 가로 5cm, 세로 10cm인 직사각형입니다.</li><li>옆면의 둘레는 <strong>2×(10+5)=30cm</strong>입니다.</li></ol><p class="source52-p49m2-final-answer">답: 30cm</p></div>`;
    return Object.freeze({ prompt, answer: "30cm", solution, sourceItemId, generator: generatorKey,
      variant: 0, variantIndex: 0, poolIndex: 0, verifiedPoolIndex: 0,
      verifiedVariantId: `${sourceItemId}:fixed-front-top-views`, difficultyOffset: 0, difficultyLevel: 2, difficultyRank: 2,
      sourceStructurePreserved: true, answerVisualRequired: false, answerVisualStatus: "not-required",
      publisherKeyVerified: false, publisherAnswerVerified: false, handwrittenAnswerVerified: false,
      answerVerification: "independent-front-top-shared-dimension-side-perimeter", generationMode: "fixed-verified-pool",
      verifiedVariantCount: 1, verifiedVariantTarget: 1, answerModel: model });
  }

  function install(target) {
    const api = target?.HSE_GENERATORS;
    if (!api || typeof api.generatorKey !== "function" || typeof api.generate !== "function") return false;
    if (api.__source52P49M2Installed) return true;
    const previousKey = api.generatorKey.bind(api), previousGenerate = api.generate.bind(api);
    const matches = type => type && (type.id === sourceItemId || type.sourceItemId === sourceItemId || type.generatorKey === generatorKey);
    api.generatorKey = type => matches(type)
      ? type.id === sourceItemId && type.sourceItemId === sourceItemId && type.generatorKey === generatorKey && type.reviewLocked === false && type.sourceVerified === true ? generatorKey : ""
      : previousKey(type);
    api.generate = (type, rank, difficulty, seed, variant = 0) => matches(type)
      ? api.generatorKey(type) && Number(variant) === 0 ? makeQuestion() : null
      : previousGenerate(type, rank, difficulty, seed, variant);
    if (Array.isArray(api.names) && !api.names.includes(generatorKey)) api.names.push(generatorKey);
    Object.defineProperty(api, "__source52P49M2Installed", { value: true });
    return true;
  }

  return Object.freeze({ definition, source, verifyModel, viewsDiagram, makeQuestion, install });
});
