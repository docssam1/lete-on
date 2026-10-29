(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_CUBOID_PAGE49_M3 = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const sourceItemId = "5-2-u5-e1-mission-3";
  const generatorKey = "source52CuboidTapeWrapPage49Mission3";
  const definition = Object.freeze({ sourceItemId, generatorKey, sourcePdfPage: 45, sourcePrintedPage: 49 });
  const source = Object.freeze({ widthCm: 30, depthCm: 24, heightCm: 35, wrapsPerLoop: 2, knotCm: 16, loopCount: 3 });

  function verifyModel() {
    const { widthCm: w, depthCm: d, heightCm: h, wrapsPerLoop, knotCm, loopCount } = source;
    const loops = Object.freeze([
      Object.freeze({ directions: "가로·높이", perimeterCm: 2 * (w + h) }),
      Object.freeze({ directions: "세로·높이", perimeterCm: 2 * (d + h) }),
      Object.freeze({ directions: "가로·세로", perimeterCm: 2 * (w + d) })
    ]);
    const oneWrapCm = loops.reduce((sum, loop) => sum + loop.perimeterCm, 0);
    const wrappedTapeCm = wrapsPerLoop * oneWrapCm;
    const knotTapeCm = loopCount * knotCm;
    const totalCm = wrappedTapeCm + knotTapeCm;
    if (loops.map(loop => loop.perimeterCm).join(",") !== "130,118,108" || oneWrapCm !== 356 || wrappedTapeCm !== 712 || knotTapeCm !== 48 || totalCm !== 760) {
      throw new Error("세 방향 고리의 길이·두 번 감기·세 매듭 길이 합이 원문 조건과 일치해야 합니다.");
    }
    return Object.freeze({ loops, oneWrapCm, wrapsPerLoop, wrappedTapeCm, knotCount: loopCount, knotCm, knotTapeCm, totalCm, answerCm: totalCm });
  }

  function knot(x, y, rotate = 0) {
    return `<g class="source52-p49m3-knot" transform="translate(${x} ${y}) rotate(${rotate})"><path d="M0 0C-13 -12 -22 -7 -19 0C-15 7 -7 5 0 0C7 -5 15 -7 19 0C22 7 13 12 0 0M0 0l-4 16m4-16 5 16"/></g>`;
  }

  function diagram({ solution = false } = {}) {
    const model = verifyModel();
    return `<svg class="source52-p49m3-diagram" viewBox="40 10 500 360" role="img" aria-label="가로 30cm, 세로 24cm, 높이 35cm인 상자에 세 방향으로 각각 두 겹씩 감긴 테이프와 세 개의 매듭${solution ? "; 각 고리 둘레 130cm, 118cm, 108cm" : ""}" xmlns="http://www.w3.org/2000/svg">
      <g class="source52-p49m3-cuboid">
        <path d="M95 185H345L455 105H205Z M95 185V315H345V185 M345 185 455 105V235L345 315"/>
      </g>
      <g class="source52-p49m3-wraps" data-loop-count="${model.loops.length}" data-wraps-per-loop="${model.wrapsPerLoop}">
        <!-- One horizontal loop around width and depth, drawn as two parallel wraps. -->
        <path d="M95 242H345L455 162M95 258H345L455 178"/>
        <!-- One loop around width and height, drawn as two parallel wraps. -->
        <path d="M145 149H395V279M155 141H405V271"/>
        <!-- One loop around depth and height, drawn as two parallel wraps. -->
        <path d="M212 315V185L322 105M228 315V185L338 105"/>
      </g>
      ${knot(150, 145, 0)}${knot(220, 195, 0)}${knot(400, 210, 35)}
      <g class="source52-p49m3-dimensions">
        <path d="M95 337v10m250-10v10M95 343h250M355 325l8 8m102-88 8 8M359 329 469 249M84 185h-9m9 130h-9M79 185v130"/>
        <text x="220" y="365" text-anchor="middle">30cm</text>
        <text x="453" y="313" text-anchor="middle">24cm</text>
        <text x="61" y="250" text-anchor="middle" transform="rotate(-90 61 250)">35cm</text>
      </g>
    </svg>`;
  }

  function makeQuestion() {
    const model = verifyModel();
    const prompt = `<div class="source52-p49m3-question" data-source-item-id="${sourceItemId}" data-pool-index="0"><p>다음 그림과 같은 상자를 색 테이프로 묶었다. 색 테이프는 2번씩 감았고, 매듭을 묶는 데 16cm씩 사용했다. 사용한 색 테이프는 모두 몇 cm인가요?</p>${diagram()}</div>`;
    const solution = `<div class="source52-p49m3-solution" data-source-answer="${sourceItemId}"><p>그림에는 세 방향의 고리가 있고, 각 고리 둘레를 두 번씩 감습니다. 매듭은 세 고리에 하나씩 있습니다.</p>${diagram({ solution: true })}<ol><li>가로와 높이 방향 고리: 2×(30+35)=130cm</li><li>세로와 높이 방향 고리: 2×(24+35)=118cm</li><li>가로와 세로 방향 고리: 2×(30+24)=108cm</li><li>세 고리를 두 번씩 감은 길이: 2×(130+118+108)=712cm</li><li>세 매듭에 쓴 길이: 3×16=48cm</li></ol><p>모두 712+48=<strong>760cm</strong>입니다.</p><p class="source52-p49m3-final-answer">답: 760cm</p></div>`;
    return Object.freeze({ prompt, answer: "760cm", solution, sourceItemId, generator: generatorKey,
      variant: 0, variantIndex: 0, poolIndex: 0, verifiedPoolIndex: 0,
      verifiedVariantId: `${sourceItemId}:fixed-three-double-wraps`, difficultyOffset: 0, difficultyLevel: 2, difficultyRank: 2,
      sourceStructurePreserved: true, answerVisualRequired: false, answerVisualStatus: "not-required",
      publisherKeyVerified: false, publisherAnswerVerified: false, handwrittenAnswerVerified: false,
      answerVerification: "independent-three-loop-double-wrap-and-knots-model", generationMode: "fixed-verified-pool",
      verifiedVariantCount: 1, verifiedVariantTarget: 1, answerModel: model });
  }

  function install(target) {
    const api = target?.HSE_GENERATORS;
    if (!api || typeof api.generatorKey !== "function" || typeof api.generate !== "function") return false;
    if (api.__source52P49M3Installed) return true;
    const previousKey = api.generatorKey.bind(api), previousGenerate = api.generate.bind(api);
    const matches = type => type && (type.id === sourceItemId || type.sourceItemId === sourceItemId || type.generatorKey === generatorKey);
    api.generatorKey = type => matches(type)
      ? type.id === sourceItemId && type.sourceItemId === sourceItemId && type.generatorKey === generatorKey && type.reviewLocked === false && type.sourceVerified === true ? generatorKey : ""
      : previousKey(type);
    api.generate = (type, rank, difficulty, seed, variant = 0) => matches(type)
      ? api.generatorKey(type) && Number(variant) === 0 ? makeQuestion() : null
      : previousGenerate(type, rank, difficulty, seed, variant);
    if (Array.isArray(api.names) && !api.names.includes(generatorKey)) api.names.push(generatorKey);
    Object.defineProperty(api, "__source52P49M3Installed", { value: true });
    return true;
  }

  return Object.freeze({ definition, source, verifyModel, diagram, makeQuestion, install });
});
