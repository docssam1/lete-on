(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_AVERAGE_PAGE58_EXAMPLE11 = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";
  const sourceItemId = "5-2-u6-e1-example-1";
  const generatorKey = "source52AverageOriginalPage58Example11";
  const pools=Object.freeze([{tens:8,ones:3,known:[72,86,92],mean:84},{tens:7,ones:6,known:[75,85,90],mean:80},{tens:9,ones:2,known:[70,74,80],mean:80}]);
  function candidates(p){const r=[];for(let a=0;a<=9;a++)for(let b=0;b<=9;b++){const x=10*p.tens+a,y=10*b+p.ones;if(x+y+p.known.reduce((n,v)=>n+v,0)===p.mean*5)r.push([x,y]);}return r;}
  function scoreTable(p){const [a,b,c]=p.known;return `<figure class="source52-p58ex11-figure"><figcaption>다섯 과목의 점수</figcaption><svg class="source52-p58ex11-table" viewBox="0 0 600 100" role="img" aria-label="국어의 십의 자리 ${p.tens}, 수학의 일의 자리 ${p.ones}, 사회 ${a}점, 과학 ${b}점, 영어 ${c}점" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="1" width="598" height="98" fill="white" stroke="currentColor" stroke-width="2"/><path d="M0 50H600 M100 0V100 M200 0V100 M300 0V100 M400 0V100 M500 0V100" fill="none" stroke="currentColor" stroke-width="2"/><g text-anchor="middle" dominant-baseline="middle" fill="currentColor" font-size="23"><text x="50" y="25">과목</text><text x="150" y="25">국어</text><text x="250" y="25">수학</text><text x="350" y="25">사회</text><text x="450" y="25">과학</text><text x="550" y="25">영어</text><text x="50" y="75">점수</text><text x="135" y="75">${p.tens}</text><text x="265" y="75">${p.ones}</text><text x="350" y="75">${a}</text><text x="450" y="75">${b}</text><text x="550" y="75">${c}</text></g><path d="M155 100 L160 89 L165 75 L173 68 L184 64 L195 59 L201 54 L209 59 L221 63 L234 68 L238 77 L241 90 L245 100 Z" fill="white" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg></figure>`;}
  function makeQuestion(variant=0){if(!Number.isSafeInteger(variant)||variant<0)return null;const index=variant%pools.length,p=pools[index],possible=candidates(p);if(possible.length!==1)throw new Error("가능한 점수 쌍이 하나인지 확인하세요.");const [korean,math]=possible[0],total=p.mean*5,known=p.known.reduce((a,b)=>a+b,0),combined=total-known;
    const prompt=`<div class="source52-p58ex11-question" data-source-item-id="${sourceItemId}" data-pool-index="${index}"><p>찢어진 성적표의 다섯 과목 평균이 ${p.mean}점입니다. 국어와 수학 점수를 각각 구하세요.</p>${scoreTable(p)}<p>국어: ______점　　수학: ______점</p></div>`;
    const solution=`<div class="source52-p58ex11-solution" data-source-answer="${sourceItemId}"><p>다섯 과목의 합은 ${p.mean} × 5 = ${total}점이고 보이는 세 점수의 합은 ${p.known.join(" + ")} = ${known}점입니다. 따라서 국어와 수학의 합은 ${total} − ${known} = ${combined}점입니다.</p><p>국어의 십의 자리는 ${p.tens}, 수학의 일의 자리는 ${p.ones}입니다. 가능한 점수를 모두 대조하면 국어 ${korean}점과 수학 ${math}점 한 쌍입니다.</p></div>`;
    return Object.freeze({prompt,answer:`국어 ${korean}점, 수학 ${math}점`,solution,sourceItemId,generator:generatorKey,variant:index,variantIndex:index,poolIndex:index,verifiedPoolIndex:index,verifiedVariantId:`${sourceItemId}:synthetic:${index}`,difficultyOffset:0,difficultyLevel:2,difficultyRank:2,sourceStructurePreserved:true,variantProvenance:"synthetic-source-structure",generationMode:"fixed-verified-pool",verifiedVariantCount:3,verifiedVariantTarget:3,answerVisualRequired:false,answerVisualStatus:"not-required",publisherKeyVerified:false,publisherAnswerVerified:false,handwrittenAnswerVerified:false,answerVerification:"independent-exhaustive-digit-enumeration",questionModel:Object.freeze({tens:p.tens,ones:p.ones,known:[...p.known],mean:p.mean}),answerModel:Object.freeze({korean,math,combined,total})});}
  function install(target) {
    const api = target?.HSE_GENERATORS;
    if (!api || typeof api.generatorKey !== "function" || typeof api.generate !== "function") return false;
    if (api.__source52P58OriginalExample11Installed) return true;
    const previousKey = api.generatorKey.bind(api), previousGenerate = api.generate.bind(api);
    const matches = type => type && (type.id === sourceItemId || type.sourceItemId === sourceItemId || type.generatorKey === generatorKey);
    api.generatorKey = type => matches(type) ? type.id === sourceItemId && type.sourceItemId === sourceItemId && type.generatorKey === generatorKey && type.reviewLocked === false && type.sourceVerified === true ? generatorKey : "" : previousKey(type);
    api.generate = (type, rank, difficulty, seed, variant = 0) => matches(type) ? api.generatorKey(type) ? makeQuestion(variant) : null : previousGenerate(type, rank, difficulty, seed, variant);
    if (Array.isArray(api.names) && !api.names.includes(generatorKey)) api.names.push(generatorKey);
    Object.defineProperty(api, "__source52P58OriginalExample11Installed", { value: true });
    return true;
  }
  return Object.freeze({ sourceItemId, generatorKey, pools, candidates, scoreTable, makeQuestion, install });
});
