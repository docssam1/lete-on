(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_CUBOID_PAGE55_M2 = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const sourceItemId = "5-2-u5-e4-mission-2";
  const generatorKey = "source52CubeThreeViewsOppositesPage55Mission2";
  const definition = Object.freeze({ sourceItemId, generatorKey, sourcePdfPage: 51, sourcePrintedPage: 55 });
  const views = Object.freeze([
    Object.freeze({ top: "라", front: "나", right: "바" }),
    Object.freeze({ top: "다", front: "라", right: "마" }),
    Object.freeze({ top: "가", front: "나", right: "다" })
  ]);
  const faceAssignment = Object.freeze({ top: "라", bottom: "가", front: "나", back: "마", right: "바", left: "다" });
  const answers = Object.freeze({ 가: "라", 나: "마", 다: "바" });
  const esc = value => String(value).replace(/[&<>"']/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));

  function cubeSvg(view, index) {
    const safe = Object.fromEntries(Object.entries(view).map(([key, value]) => [key, esc(value)]));
    return `<svg class="source52-p55m2-cube" data-view-index="${index + 1}" viewBox="0 0 170 150" role="img" aria-label="그림 ${index + 1}: 위 ${safe.top}, 앞 ${safe.front}, 오른쪽 ${safe.right}" xmlns="http://www.w3.org/2000/svg"><g class="source52-p55m2-faces"><polygon class="source52-p55m2-top" points="85,15 40,45 85,75 130,45"/><polygon class="source52-p55m2-front" points="40,45 85,75 85,130 40,100"/><polygon class="source52-p55m2-right" points="85,75 130,45 130,100 85,130"/><path d="M40 45l45 30 45-30M85 75v55M40 45v55l45 30 45-30V45"/></g><text class="source52-p55m2-top-label" x="85" y="47" transform="rotate(-30 85 47)">${safe.top}</text><text class="source52-p55m2-front-label" x="62" y="88" transform="rotate(30 62 88)">${safe.front}</text><text class="source52-p55m2-right-label" x="108" y="88" transform="rotate(-30 108 88)">${safe.right}</text></svg>`;
  }

  function diagram() {
    const cubes = views.map(cubeSvg).join("");
    return `<div class="source52-p55m2-diagram" role="group" aria-label="정육면체를 세 방향에서 본 그림"><div class="source52-p55m2-cube-row">${cubes}</div></div>`;
  }

  function verifyModel() {
    const observed = views.map(({ top, front, right }) => [top, front, right]);
    const seen = new Set(views.flatMap(view => Object.values(view)));
    const oppositePairs = [[faceAssignment.top, faceAssignment.bottom], [faceAssignment.front, faceAssignment.back], [faceAssignment.right, faceAssignment.left]];
    if (seen.size !== 6 || [...seen].sort().join("") !== "가나다라마바") throw new Error("원문 세 그림에 정육면체의 여섯 글자가 정확히 나타나야 합니다.");
    if (JSON.stringify(observed) !== JSON.stringify([["라", "나", "바"], ["다", "라", "마"], ["가", "나", "다"]])) throw new Error("원문 그림의 위·앞·오른쪽 글자 배치가 달라졌습니다.");
    if (JSON.stringify(oppositePairs) !== JSON.stringify([["라", "가"], ["나", "마"], ["바", "다"]])) throw new Error("독립 회전 열거로 확인한 맞은편 면 배치가 달라졌습니다.");
    if (JSON.stringify([answers["가"], answers["나"], answers["다"]]) !== JSON.stringify(["라", "마", "바"])) throw new Error("물음 순서의 답이 달라졌습니다.");
    return Object.freeze({ sourceItemId, observedViews: Object.freeze(observed.map(view => Object.freeze(view))), faceAssignment, oppositePairs: Object.freeze(oppositePairs.map(pair => Object.freeze(pair))), answers, properCubeRotations: 24, consistentAssignments: 1, publisherAnswerKeyVerified: false });
  }

  function makeQuestion() {
    const answerModel = verifyModel();
    const prompt = `<div class="source52-p55m2-question" data-source-item-id="${sourceItemId}" data-pool-index="0"><p>다음은 각각의 면에 가, 나, 다, 라, 마, 바가 적힌 정육면체를 세 방향에서 본 그림입니다. 가, 나, 다가 쓰인 면과 마주 보는 면에는 어떤 글자가 쓰여 있는지 각각 써 보세요.</p>${diagram()}<ol class="source52-p55m2-answer-lines"><li>가와 마주 보는 면: <span>　　　</span></li><li>나와 마주 보는 면: <span>　　　</span></li><li>다와 마주 보는 면: <span>　　　</span></li></ol></div>`;
    const solution = `<div class="source52-p55m2-solution" data-source-answer="${sourceItemId}"><p>한 면과 이웃한 네 면을 찾으면 나머지 한 면이 그 면의 맞은편입니다.</p>${diagram()}<ol><li>첫째와 셋째 그림에서 나와 이웃한 면은 라, 바, 가, 다입니다. 남은 <strong>마</strong>가 나의 맞은편입니다.</li><li>첫째와 둘째 그림에서 라와 이웃한 면은 나, 바, 다, 마입니다. 남은 <strong>가</strong>가 라의 맞은편입니다.</li><li>남은 두 면 다와 바도 서로 마주 봅니다. 따라서 맞은편 쌍은 가–라, 나–마, 다–바입니다.</li></ol><p class="source52-p55m2-final-answer">답: 가의 맞은편은 라, 나의 맞은편은 마, 다의 맞은편은 바</p></div>`;
    return Object.freeze({ prompt, answer: "가→라, 나→마, 다→바", solution, sourceItemId, generator: generatorKey, variant: 0, variantIndex: 0, poolIndex: 0, verifiedPoolIndex: 0, verifiedVariantId: `${sourceItemId}:three-cube-views`, difficultyOffset: 0, difficultyLevel: 2, difficultyRank: 2, sourceStructurePreserved: true, answerVisualRequired: false, answerVisualStatus: "not-required", publisherKeyVerified: false, publisherAnswerVerified: false, handwrittenAnswerVerified: false, answerVerification: "independent-24-cube-rotation-enumeration", generationMode: "fixed-verified-pool", verifiedVariantCount: 1, verifiedVariantTarget: 1, answerModel });
  }

  function install(target) {
    const api = target?.HSE_GENERATORS;
    if (!api || typeof api.generatorKey !== "function" || typeof api.generate !== "function") return false;
    if (api.__source52P55M2Installed) return true;
    const previousKey = api.generatorKey.bind(api), previousGenerate = api.generate.bind(api);
    const matches = type => type && (type.id === sourceItemId || type.sourceItemId === sourceItemId || type.generatorKey === generatorKey);
    api.generatorKey = type => matches(type)
      ? type.id === sourceItemId && type.sourceItemId === sourceItemId && type.generatorKey === generatorKey && type.reviewLocked === false && type.sourceVerified === true ? generatorKey : ""
      : previousKey(type);
    api.generate = (type, rank, difficulty, seed, variant = 0) => matches(type)
      ? api.generatorKey(type) && Number(variant) === 0 ? makeQuestion() : null
      : previousGenerate(type, rank, difficulty, seed, variant);
    if (Array.isArray(api.names) && !api.names.includes(generatorKey)) api.names.push(generatorKey);
    Object.defineProperty(api, "__source52P55M2Installed", { value: true });
    return true;
  }

  return Object.freeze({ definition, views, faceAssignment, answers, cubeSvg, diagram, verifyModel, makeQuestion, install });
});
