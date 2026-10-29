(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_AVERAGE_PAGE58_EXAMPLE13 = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";
  const sourceItemId = "5-2-u6-e1-example-3";
  const generatorKey = "source52AverageOriginalPage58Example13";
  const months = Object.freeze([2, 4, 6, 8, 10, 12]);
  const pools=Object.freeze([{air:[3,6,9,19,14,6],water:[6,8,10,15,16,8]},{air:[2,5,10,20,15,8],water:[5,9,12,16,14,10]},{air:[5,8,12,18,15,8],water:[4,7,10,14,13,6]}]);
  function chart(pool) {
    const {air,water}=pool; const label=`기온 ${air.join()}도; 수온 ${water.join()}도`;
    const left = 65, top = 30, dx = 75, dy = 10, bottom = top + 22 * dy;
    const x = i => left + i * dx, y = value => bottom - value * dy;
    const grids = Array.from({length: 23}, (_, v) => `<line class="source52-p58ex13-grid${v % 5 === 0 ? " major" : ""}" x1="${left}" y1="${y(v)}" x2="${x(5)}" y2="${y(v)}"/>`).join("");
    const vertical = months.map((m,i) => `<line class="source52-p58ex13-grid-vertical" x1="${x(i)}" y1="${top}" x2="${x(i)}" y2="${bottom}"/><text class="source52-p58ex13-axis-label" x="${x(i)}" y="${bottom + 20}" text-anchor="middle">${m}</text>`).join("");
    const ticks = [0,5,10,15,20].map(v => `<text class="source52-p58ex13-axis-label" x="${left - 10}" y="${y(v)+4}" text-anchor="end" data-axis-value="${v}">${v}</text>`).join("");
    const series = (values, name) => `<polyline class="source52-p58ex13-line ${name}" points="${values.map((v,i)=>`${x(i)},${y(v)}`).join(" ")}"/>${values.map((v,i)=>`<circle class="source52-p58ex13-point ${name}" data-month="${months[i]}" data-value="${v}" cx="${x(i)}" cy="${y(v)}" r="3.2"/>`).join("")}`;
    return `<svg class="source52-p58ex13-chart" viewBox="0 0 470 325" role="img" aria-label="${label}" xmlns="http://www.w3.org/2000/svg"><title>기온과 수온</title><text class="source52-p58ex13-title" x="250" y="18" text-anchor="middle">기온과 수온</text><text class="source52-p58ex13-axis-label" x="20" y="40">(℃)</text>${grids}${vertical}<line class="source52-p58ex13-axis" x1="${left}" y1="${top}" x2="${left}" y2="${bottom}"/><line class="source52-p58ex13-axis" x1="${left}" y1="${bottom}" x2="${x(5)}" y2="${bottom}"/>${ticks}${series(air,"air")}${series(water,"water")}<text class="source52-p58ex13-axis-label" x="${x(5)}" y="${bottom+38}" text-anchor="end">(월)</text><line class="source52-p58ex13-line air" x1="130" y1="${bottom+58}" x2="160" y2="${bottom+58}"/><text class="source52-p58ex13-legend" x="168" y="${bottom+62}">기온</text><line class="source52-p58ex13-line water" x1="235" y1="${bottom+58}" x2="265" y2="${bottom+58}"/><text class="source52-p58ex13-legend" x="273" y="${bottom+62}">수온</text></svg>`;
  }
  function makeQuestion(variant=0){if(!Number.isSafeInteger(variant)||variant<0)return null;const index=variant%pools.length,p=pools[index],airSum=p.air.reduce((a,b)=>a+b,0),waterSum=p.water.reduce((a,b)=>a+b,0),difference=Math.abs(airSum-waterSum)/months.length;if(!Number.isInteger(difference))throw new Error("평균의 차를 확인하세요.");
    const prompt=`<div class="source52-p58ex13-question" data-source-item-id="${sourceItemId}" data-pool-index="${index}"><p>두 달마다 잰 기온과 수온을 꺾은선그래프로 나타냈습니다. 두 평균의 차를 구하세요.</p>${chart(p)}</div>`;
    const solution=`<div class="source52-p58ex13-solution" data-source-answer="${sourceItemId}"><p>기온의 합은 ${p.air.join(" + ")} = ${airSum}℃, 수온의 합은 ${p.water.join(" + ")} = ${waterSum}℃입니다.</p><p>각각 여섯 번 측정했으므로 평균의 차는 두 합의 차를 6으로 나눈 ${Math.abs(airSum-waterSum)} ÷ 6 = <strong>${difference}</strong>℃입니다.</p></div>`;
    return Object.freeze({prompt,answer:`${difference}℃`,solution,sourceItemId,generator:generatorKey,variant:index,variantIndex:index,poolIndex:index,verifiedPoolIndex:index,verifiedVariantId:`${sourceItemId}:synthetic:${index}`,difficultyOffset:0,difficultyLevel:2,difficultyRank:2,sourceStructurePreserved:true,variantProvenance:"synthetic-source-structure",generationMode:"fixed-verified-pool",verifiedVariantCount:3,verifiedVariantTarget:3,answerVisualRequired:false,answerVisualStatus:"not-required",publisherKeyVerified:false,publisherAnswerVerified:false,handwrittenAnswerVerified:false,answerVerification:"independent-graph-coordinates-and-mean-difference",questionModel:Object.freeze({months:[...months],air:[...p.air],water:[...p.water]}),answerModel:Object.freeze({airSum,waterSum,count:6,difference,unit:"℃"})});}
  function install(target) {
    const api=target?.HSE_GENERATORS;
    if(!api || typeof api.generatorKey!=="function" || typeof api.generate!=="function") return false;
    if(api.__source52P58OriginalExample13Installed) return true;
    const previousKey=api.generatorKey.bind(api), previousGenerate=api.generate.bind(api);
    const matches=type=>type&&(type.id===sourceItemId||type.sourceItemId===sourceItemId||type.generatorKey===generatorKey);
    api.generatorKey=type=>matches(type)?type.id===sourceItemId&&type.sourceItemId===sourceItemId&&type.generatorKey===generatorKey&&type.reviewLocked===false&&type.sourceVerified===true?generatorKey:"":previousKey(type);
    api.generate=(type,rank,difficulty,seed,variant=0)=>matches(type)?api.generatorKey(type)?makeQuestion(variant):null:previousGenerate(type,rank,difficulty,seed,variant);
    if(Array.isArray(api.names)&&!api.names.includes(generatorKey)) api.names.push(generatorKey);
    Object.defineProperty(api,"__source52P58OriginalExample13Installed",{value:true}); return true;
  }
  return Object.freeze({sourceItemId,generatorKey,months,pools,chart,makeQuestion,install});
});
