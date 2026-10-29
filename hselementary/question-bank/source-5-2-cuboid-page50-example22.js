(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE52_P50_E22 = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";
  const sourceItemId = "5-2-u5-e2-example-2-2";
  const generatorKey = "source52CuboidSquarePaperNetEdgeSumPage50Example22";
  function verifyModel() {
    const side = 20, flapHeight = 4, bottomOpening = side - 14;
    const topOpening = bottomOpening;
    const otherWidth = (side - 2 * bottomOpening) / 2;
    const sideWidths = [otherWidth, bottomOpening, otherWidth, bottomOpening];
    const height = side - 2 * flapHeight;
    const dimensions = [height, sideWidths[0], sideWidths[1]];
    if(side!==20||flapHeight!==4||topOpening!==6||bottomOpening!==6||sideWidths.join(",")!=="4,6,4,6"||height!==12||dimensions.join(",")!=="12,4,6") throw new Error("원문 절단 그림에서 직육면체 전개도가 하나로 정해지지 않습니다.");
    return Object.freeze({ side, flapHeight, topOpening, bottomOpening, sideWidths, height, dimensions, edgeSum: 4 * dimensions.reduce((a,b)=>a+b,0) });
  }
  function diagram({ showFolds = false } = {}) {
    const m=verifyModel(), s=14, x=50, y=38, w=m.side*s, h=m.side*s;
    const cut = `<rect class="source52-p50e22-cut" style="fill:#dfe7f0 !important" fill="#dfe7f0" x="${x}" y="${y}" width="${4*s}" height="${4*s}"/><rect class="source52-p50e22-cut" style="fill:#dfe7f0 !important" fill="#dfe7f0" x="${x+10*s}" y="${y}" width="${10*s}" height="${4*s}"/><rect class="source52-p50e22-cut" style="fill:#dfe7f0 !important" fill="#dfe7f0" x="${x}" y="${y+16*s}" width="${14*s}" height="${4*s}"/>`;
    const faceStrip = `<rect class="source52-p50e22-net" x="${x}" y="${y+4*s}" width="${w}" height="${12*s}"/>${showFolds ? `<line class="source52-p50e22-fold" x1="${x+4*s}" y1="${y+4*s}" x2="${x+4*s}" y2="${y+16*s}"/><line class="source52-p50e22-fold" x1="${x+10*s}" y1="${y+4*s}" x2="${x+10*s}" y2="${y+16*s}"/><line class="source52-p50e22-fold" x1="${x+14*s}" y1="${y+4*s}" x2="${x+14*s}" y2="${y+16*s}"/>` : ""}`;
    const flaps = `<rect class="source52-p50e22-flap" x="${x+4*s}" y="${y}" width="${6*s}" height="${4*s}"/><rect class="source52-p50e22-flap" x="${x+14*s}" y="${y+16*s}" width="${6*s}" height="${4*s}"/>`;
    return `<svg class="geometry-diagram source52-p50e22-diagram" viewBox="-18 0 398 400" role="img" aria-label="20cm 정사각형 종이에서 색칠한 부분 세 곳을 자른 직육면체 전개도"><defs><pattern id="source52-p50e22-dots" width="8" height="8" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="#e5ebf2"/><circle cx="2" cy="2" r="1.25" fill="#3e5572"/><circle cx="6" cy="6" r="1.25" fill="#3e5572"/></pattern></defs><rect class="source52-p50e22-outline" x="${x}" y="${y}" width="${w}" height="${h}"/>${faceStrip}${flaps}${cut}<line class="source52-p50e22-measure" x1="${x-12}" y1="${y}" x2="${x-12}" y2="${y+4*s}"/><line class="source52-p50e22-measure" x1="${x-18}" y1="${y}" x2="${x-6}" y2="${y}"/><line class="source52-p50e22-measure" x1="${x-18}" y1="${y+4*s}" x2="${x-6}" y2="${y+4*s}"/><text class="source52-p50e22-label" x="${x-30}" y="${y+2*s}" text-anchor="end" dominant-baseline="middle">4cm</text><line class="source52-p50e22-measure" x1="${x}" y1="${y+h+12}" x2="${x+14*s}" y2="${y+h+12}"/><text class="source52-p50e22-label" x="${x+7*s}" y="${y+h+32}" text-anchor="middle">14cm</text><text class="source52-p50e22-label" x="${x+w/2}" y="${y+h+51}" text-anchor="middle">한 변 20cm</text><text class="source52-p50e22-cut-label" x="${x+2*s}" y="${y+2*s}" text-anchor="middle" dominant-baseline="middle">자름</text><text class="source52-p50e22-cut-label" x="${x+15*s}" y="${y+2*s}" text-anchor="middle" dominant-baseline="middle">자름</text><text class="source52-p50e22-cut-label" x="${x+7*s}" y="${y+18*s}" text-anchor="middle" dominant-baseline="middle">자름</text></svg>`;
  }
  function build() {
    const m=verifyModel();
    const prompt=`<div class="source52-p50e22-question" data-source-item-id="${sourceItemId}" data-pool-index="0"><p>한 변의 길이가 20cm인 정사각형 모양의 종이에서 색칠한 부분을 잘라 낸 다음, 남은 종이를 접어 직육면체를 만들었습니다. 직육면체의 모든 모서리 길이의 합을 구하세요.</p>${diagram()}</div>`;
    const solution=`<div class="source52-p50e22-solution" data-source-answer="${sourceItemId}"><ol><li>아래쪽에서 14cm를 잘라 내고 남은 면의 가로는 20−14=<strong>6cm</strong>입니다.</li><li>서로 마주 보는 윗면과 밑면은 같은 크기이므로, 위와 아래에 남은 면의 세로는 그림에 표시된 4cm로 같습니다. 따라서 옆면 띠의 높이는 20−4−4=<strong>12cm</strong>입니다.</li><li>옆면 네 장의 폭은 4cm와 6cm가 번갈아 나타납니다. 실제로 4+6+4+6=20cm이므로 직육면체의 세 변은 4cm, 6cm, 12cm입니다.</li><li>모든 모서리 길이의 합은 같은 길이의 모서리 네 개씩이므로 4×(4+6+12)=<strong>88cm</strong>입니다.</li></ol><p class="source52-p50e22-answer">답: 88cm</p></div>`;
    return Object.freeze({prompt,answer:"88cm",solution,answerVisual:diagram({ showFolds: true }),sourceItemId,generator:generatorKey,variant:0,variantIndex:0,poolIndex:0,verifiedPoolIndex:0,verifiedVariantId:`${sourceItemId}:square-paper-cuboid-net`,generationMode:"fixed-verified-pool",verifiedVariantCount:1,verifiedVariantTarget:1,difficultyOffset:0,difficultyLevel:2,difficultyRank:2,sourceStructurePreserved:true,answerVisualRequired:true,answerVisualStatus:"verified-reconstruction",sourcePdfPage:46,sourcePrintedPage:50,publisherKeyVerified:false,publisherAnswerVerified:false,handwrittenAnswerVerified:false,answerVerification:"independent-cut-net-dimensions-and-edge-count",questionModel:{paperSide:20,cutHeight:4,bottomCutWidth:14},answerModel:{dimensions:m.dimensions,sideWidths:m.sideWidths,edgeSum:m.edgeSum}});
  }
  function belongs(type){return Boolean(type&&(type.id===sourceItemId||type.sourceItemId===sourceItemId||type.generatorKey===generatorKey));}
  function resolves(type){return Boolean(type&&type.id===sourceItemId&&type.sourceItemId===sourceItemId&&type.generatorKey===generatorKey&&type.sourceVerified===true&&type.reviewLocked===false);}
  function generate(type,user,difficulty,seed,variant=0){if(!belongs(type)||!resolves(type)||variant!==0)return null;return build();}
  function install(target){const bank=target?.HSE_GENERATORS;if(!bank||typeof bank.generatorKey!=="function"||typeof bank.generate!=="function")return false;if(bank.__source52U5P50E22Installed)return true;const oldKey=bank.generatorKey.bind(bank),oldGenerate=bank.generate.bind(bank);bank.generatorKey=type=>belongs(type)?(resolves(type)?generatorKey:""):oldKey(type);bank.generate=(type,user,difficulty,seed,variant=0)=>belongs(type)?generate(type,user,difficulty,seed,variant):oldGenerate(type,user,difficulty,seed,variant);if(Array.isArray(bank.names)&&!bank.names.includes(generatorKey))bank.names.push(generatorKey);Object.defineProperty(bank,"__source52U5P50E22Installed",{value:true});return true;}
  return Object.freeze({sourceItemId,generatorKey,verifyModel,diagram,build,generate,belongs,resolves,install});
});
