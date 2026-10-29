(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_AVERAGE_PAGE58_EXAMPLE14 = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";
  const sourceItemId="5-2-u6-e1-example-4";
  const generatorKey="source52AverageOriginalPage58Example14";
  function table() {
    return `<table class="source52-p58ex14-table"><caption>갑과 을의 수학 점수</caption><thead><tr><th scope="col">구분</th><th scope="col">1회</th><th scope="col">2회</th><th scope="col">3회</th><th scope="col">4회</th><th scope="col">5회</th></tr></thead><tbody><tr><th scope="row">갑</th><td>68점</td><td>77점</td><td>95점</td><td>100점</td><td>㉠</td></tr><tr><th scope="row">을</th><td>㉡</td><td>90점</td><td>82점</td><td>㉢</td><td>95점</td></tr></tbody></table>`;
  }
  function makeQuestion() {
    const firstFour=68+77+95+100, a=firstFour/4, b=100+a-90, otherMean=a+3, c=otherMean*5-b-90-82-95;
    if (a!==85 || b!==95 || c!==78) throw new Error("점수표 계산 검산 실패");
    const prompt=`<div class="source52-p58ex14-question" data-source-item-id="${sourceItemId}" data-pool-index="0"><p>다음 표는 갑과 을의 수학 점수를 나타낸 것입니다. 두 사람은 모두 5번씩 시험을 쳤습니다.</p><p>갑의 평균 점수와 갑의 5회 점수가 같고, 을의 1회와 2회 평균 점수와 갑의 4회와 5회 평균 점수가 같습니다. 또, 갑의 평균 점수는 을의 평균 점수보다 3점 낮습니다. ㉢에 알맞은 점수를 구하여라.</p>${table()}</div>`;
    const solution=`<div class="source52-p58ex14-solution" data-source-answer="${sourceItemId}"><p>갑의 다섯 번째 점수가 갑의 평균이므로, 앞 네 번의 평균도 갑의 평균과 같습니다. (68 + 77 + 95 + 100) ÷ 4 = 85이므로 ㉠은 85점입니다.</p><p>갑의 4회와 5회 평균은 (100 + 85) ÷ 2 = 92.5점입니다. 을의 1회와 2회 합도 92.5 × 2 = 185점이므로 ㉡은 185 − 90 = 95점입니다.</p><p>을의 평균은 갑보다 3점 높은 88점이므로 다섯 번의 합은 88 × 5 = 440점입니다. 따라서 ㉢은 440 − (95 + 90 + 82 + 95) = <strong>78</strong>점입니다.</p></div>`;
    return Object.freeze({prompt,answer:"78점",solution,sourceItemId,generator:generatorKey,variant:0,variantIndex:0,poolIndex:0,verifiedPoolIndex:0,verifiedVariantId:`${sourceItemId}:original`,difficultyOffset:0,difficultyLevel:2,difficultyRank:2,sourceStructurePreserved:true,variantProvenance:"source-original-fixed",generationMode:"fixed-verified-pool",verifiedVariantCount:1,verifiedVariantTarget:1,answerVisualRequired:false,answerVisualStatus:"not-required",publisherKeyVerified:false,publisherAnswerVerified:false,handwrittenAnswerVerified:false,answerVerification:"independent-exhaustive-integer-score-enumeration",answerModel:Object.freeze({a:85,b:95,c:78})});
  }
  function install(target) {
    const api=target?.HSE_GENERATORS;
    if(!api||typeof api.generatorKey!=="function"||typeof api.generate!=="function") return false;
    if(api.__source52P58OriginalExample14Installed) return true;
    const previousKey=api.generatorKey.bind(api),previousGenerate=api.generate.bind(api);
    const matches=type=>type&&(type.id===sourceItemId||type.sourceItemId===sourceItemId||type.generatorKey===generatorKey);
    api.generatorKey=type=>matches(type)?type.id===sourceItemId&&type.sourceItemId===sourceItemId&&type.generatorKey===generatorKey&&type.reviewLocked===false&&type.sourceVerified===true?generatorKey:"":previousKey(type);
    api.generate=(type,rank,difficulty,seed,variant=0)=>matches(type)?api.generatorKey(type)&&Number(variant)===0?makeQuestion():null:previousGenerate(type,rank,difficulty,seed,variant);
    if(Array.isArray(api.names)&&!api.names.includes(generatorKey)) api.names.push(generatorKey);
    Object.defineProperty(api,"__source52P58OriginalExample14Installed",{value:true});return true;
  }
  return Object.freeze({sourceItemId,generatorKey,table,makeQuestion,install});
});
