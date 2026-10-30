(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE52_U5_M3_PRACTICE = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";
  const id = "5-2-u5-e3-mission-3-synthetic";
  const key = "source52U5VertexProductsPractice";
  // Position order: top, left, center, right, far right, bottom.
  const cells = [[1,0],[0,1],[1,1],[2,1],[3,1],[1,2]];
  const pairs = [[0,5],[1,3],[2,4]];
  const pools = [[3,4,5,6,7,9],[2,5,7,8,9,11],[3,5,7,8,10,11]];
  const gcd = (a,b) => b ? gcd(b,a%b) : a;
  function derive(index) {
    const values = pools[index];
    if (!values) throw new Error("검증된 연습문항 범위를 벗어났습니다.");
    const products = [];
    for (const a of pairs[0]) for (const b of pairs[1]) for (const c of pairs[2]) products.push(values[a]*values[b]*values[c]);
    products.sort((a,b)=>a-b);
    if (new Set(products).size !== 8) throw new Error("꼭짓점의 곱이 중복되어 순서를 확정할 수 없습니다.");
    const low = products[1], high = products[4];
    return { values, products, low, high, answer: gcd(low,high) };
  }
  function diagram(values) {
    const squares = cells.map(([x,y],i) => `<g><rect x="${20+x*60}" y="${20+y*60}" width="60" height="60"/><text x="${50+x*60}" y="${58+y*60}" fill="currentColor" stroke="none" text-anchor="middle" font-size="24" font-family="sans-serif">${values[i]}</text></g>`).join("");
    return `<svg viewBox="0 0 280 220" role="img" aria-label="숫자 여섯 개가 적힌 십자 모양 정육면체 전개도" xmlns="http://www.w3.org/2000/svg" style="display:block;width:min(100%,280px);height:auto;margin:12px auto"><g fill="white" stroke="currentColor" stroke-width="2">${squares}</g></svg>`;
  }
  function build(index) {
    const p = derive(index);
    const opposite = pairs.map(([a,b]) => `${p.values[a]}와 ${p.values[b]}`).join(", ");
    const divisors = Array.from({length:Math.min(p.low,p.high)},(_,i)=>i+1).filter(n=>p.low%n===0 && p.high%n===0);
    return {
      prompt: `<div data-source-item-id="${id}" data-pool-index="${index}"><p>다음 전개도로 정육면체를 만들었습니다. 각 꼭짓점에서 만나는 세 면에 적힌 수를 곱합니다. 여덟 곱 중 두 번째로 작은 수와 네 번째로 큰 수의 최대공약수를 구하세요.</p>${diagram(p.values)}</div>`,
      answer: String(p.answer),
      solution: `<div data-source-answer="${id}">${diagram(p.values)}<p>전개도를 접으면 마주 보는 면은 ${opposite}입니다. 한 꼭짓점에는 각 쌍에서 한 면씩 만납니다.</p><p>세 수의 곱을 작은 수부터 나열하면 ${p.products.join(", ")}입니다. 두 번째로 작은 수는 ${p.low}, 네 번째로 큰 수는 ${p.high}입니다.</p><p>두 수의 공약수는 ${divisors.join(", ")}이므로 최대공약수는 <b>${p.answer}</b>입니다.</p></div>`,
      answerVisual: "", answerVisualRequired: false, answerVisualStatus: "not-required",
      answerModel: {values: p.values, products: p.products, low: p.low, high: p.high, answer: p.answer},
      sourceValuesExcluded: true
    };
  }
  function generate(type, user, difficulty, seed, variant = 0) {
    if (!type || type.id !== id || type.generatorKey !== key || !type.sourceVerified || type.reviewLocked !== false) return null;
    if (!Number.isSafeInteger(variant) || variant < 0) throw new Error("변형 번호 오류");
    const i = variant % pools.length;
    return {...build(i), sourceItemId:id, generator:key, generationMode:"fixed-verified-pool", verifiedPoolIndex:i, verifiedVariantCount:3, verifiedVariantTarget:3, verifiedVariantId:`${id}:v${i}`, variantProvenance:"synthetic-different-net-and-values", publisherKeyVerified:false, publisherAnswerVerified:false, answerVerification:"folded-opposites-and-eight-vertex-products"};
  }
  function install(target) {
    const bank=target?.HSE_GENERATORS;
    if (!bank || typeof bank.generate!=="function" || typeof bank.generatorKey!=="function") return false;
    if (bank.__source52U5M3PracticeInstalled) return true;
    const oldKey=bank.generatorKey.bind(bank), oldGenerate=bank.generate.bind(bank);
    const matches=type=>type?.id===id || type?.sourceItemId===id || type?.generatorKey===key;
    bank.generatorKey=type=>matches(type)?(type.id===id && type.generatorKey===key && type.sourceVerified===true && type.reviewLocked===false?key:""):oldKey(type);
    bank.generate=(type,user,difficulty,seed,variant=0)=>matches(type)?generate(type,user,difficulty,seed,variant):oldGenerate(type,user,difficulty,seed,variant);
    if (Array.isArray(bank.names) && !bank.names.includes(key)) bank.names.push(key);
    Object.defineProperty(bank,"__source52U5M3PracticeInstalled",{value:true});
    return true;
  }
  return Object.freeze({id,key,cells,pairs,pools,derive,build,generate,install});
});
