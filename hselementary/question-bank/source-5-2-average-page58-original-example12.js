(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_AVERAGE_PAGE58_EXAMPLE12 = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";
  const sourceItemId = "5-2-u6-e1-example-2";
  const generatorKey = "source52AverageOriginalPage58Example12";
  const pools = Object.freeze([[1400,1450,1500,1550,1600],[1520,1570,1620,1670,1720],[1620,1670,1720,1770,1820]].map(x=>Object.freeze(x)));
  const fmt = n => Number((n/100).toFixed(2)).toString();
  function makeQuestion(variant=0) {
    if(!Number.isSafeInteger(variant)||variant<0)return null;
    const index=variant%pools.length,times=pools[index],first=times.slice(0,3).reduce((a,b)=>a+b,0),last=times.slice(2).reduce((a,b)=>a+b,0),total=times.reduce((a,b)=>a+b,0),middle=first+last-total;
    if(first%3||last%3||total%5||middle!==times[2])throw new Error("겹치는 평균을 확인하세요.");
    const prompt=`<div class="source52-p58ex12-question" data-source-item-id="${sourceItemId}" data-pool-index="${index}"><p>달리기에서 일찍 도착한 순서대로 다섯 학생에게 번호를 붙였습니다.</p><p>앞 세 학생의 평균 기록은 ${fmt(first/3)}초, 뒤 세 학생의 평균 기록은 ${fmt(last/3)}초입니다. 다섯 학생 전체의 평균은 ${fmt(total/5)}초입니다. 가운데 학생의 기록을 구하세요.</p></div>`;
    const solution=`<div class="source52-p58ex12-solution" data-source-answer="${sourceItemId}"><p>앞 세 학생의 합은 ${fmt(first/3)} × 3 = ${fmt(first)}초, 뒤 세 학생의 합은 ${fmt(last/3)} × 3 = ${fmt(last)}초입니다.</p><p>전체 합은 ${fmt(total/5)} × 5 = ${fmt(total)}초입니다. 앞뒤 두 합을 더하면 가운데 기록이 두 번 들어가므로 전체 합을 빼면 가운데 기록은 ${fmt(first)} + ${fmt(last)} − ${fmt(total)} = <strong>${fmt(middle)}</strong>초입니다.</p></div>`;
    return Object.freeze({prompt,answer:`${fmt(middle)}초`,solution,sourceItemId,generator:generatorKey,variant:index,variantIndex:index,poolIndex:index,verifiedPoolIndex:index,verifiedVariantId:`${sourceItemId}:synthetic:${index}`,difficultyOffset:0,difficultyLevel:2,difficultyRank:2,sourceStructurePreserved:true,variantProvenance:"synthetic-source-structure",generationMode:"fixed-verified-pool",verifiedVariantCount:3,verifiedVariantTarget:3,answerVisualRequired:false,answerVisualStatus:"not-required",publisherKeyVerified:false,publisherAnswerVerified:false,handwrittenAnswerVerified:false,answerVerification:"independent-overlap-and-order-witness",questionModel:Object.freeze({firstMeanHundredths:first/3,lastMeanHundredths:last/3,overallMeanHundredths:total/5}),answerModel:Object.freeze({first,last,total,middle})});
  }
  function install(target) {
    const api = target?.HSE_GENERATORS;
    if (!api || typeof api.generatorKey !== "function" || typeof api.generate !== "function") return false;
    if (api.__source52P58OriginalExample12Installed) return true;
    const previousKey = api.generatorKey.bind(api), previousGenerate = api.generate.bind(api);
    const matches = type => type && (type.id === sourceItemId || type.sourceItemId === sourceItemId || type.generatorKey === generatorKey);
    api.generatorKey = type => matches(type) ? type.id === sourceItemId && type.sourceItemId === sourceItemId && type.generatorKey === generatorKey && type.reviewLocked === false && type.sourceVerified === true ? generatorKey : "" : previousKey(type);
    api.generate = (type, rank, difficulty, seed, variant = 0) => matches(type) ? api.generatorKey(type) ? makeQuestion(variant) : null : previousGenerate(type, rank, difficulty, seed, variant);
    if (Array.isArray(api.names) && !api.names.includes(generatorKey)) api.names.push(generatorKey);
    Object.defineProperty(api, "__source52P58OriginalExample12Installed", { value: true });
    return true;
  }
  return Object.freeze({ sourceItemId, generatorKey, pools, makeQuestion, install });
});
