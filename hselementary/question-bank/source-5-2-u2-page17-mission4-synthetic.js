(function(root,factory){"use strict";const api=factory();if(typeof module==="object"&&module.exports)module.exports=api;root.HSE_SOURCE_52_U2_PAGE17_MISSION4=api;api.install(root)})(typeof window!=="undefined"?window:globalThis,function(){
  "use strict";
  const id="5-2-u2-e2-mission-4-synthetic",key="source52U2Page17Mission4",pools=Object.freeze([{first:4,count:30},{first:7,count:25},{first:2,count:40}]);
  const gcd=(a,b)=>b?gcd(b,a%b):a,frac=(n,d)=>{if(!Number.isSafeInteger(n)||!Number.isSafeInteger(d)||d<=0)throw new Error("분수 계산을 확인하세요.");const g=gcd(n,d);return{n:n/g,d:d/g}},text=x=>`${x.n}/${x.d}`;
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])),math=s=>`<span class="math-inline-expression">${esc(s)}</span>`;
  function derive(index){const p=pools[index],rawNumerator=p.first*(p.first+3),rawDenominator=(p.first+3*p.count)*(p.first+3*p.count+3),answer=frac(rawNumerator,rawDenominator);return{p,rawNumerator,rawDenominator,answer:text(answer),answerFraction:answer}}
  function build(index,difficulty){const v=derive(index),a=v.p.first,n=v.p.count,terms=[a,a+3,a+6,a+9],prompt=`<div class="source52-p17m4-question"><p>다음 규칙에 따라 분수를 계속 나열합니다.</p><p class="math-inline-expression">${terms.map((x,i)=>`${x}/${x+6}`).join(", ")}, …</p><p>첫 번째부터 ${n}번째까지의 분수를 모두 곱하면 얼마인가요?</p>${difficulty<0?`<span class="source52-u2-hint">도움말: 분모의 수열을 분자의 수열과 나란히 놓고 같은 항을 약분해 보세요.</span>`:""}</div>`;
    const high=`${a}/${a+6} × ${a+3}/${a+9} × … × ${a+3*(n-1)}/${a+3*(n-1)+6}`;
    const lines=difficulty<0?[
      `분모의 수는 분자의 수보다 6씩 크므로, 분모의 첫 항부터는 분자의 세 번째 항과 차례로 같습니다.`,
      `같은 항을 약분하면 처음 두 분자와 마지막 두 분모만 남습니다: ${math(`${a}×${a+3}/(${a+3*n}×${a+3*n+3})=${v.rawNumerator}/${v.rawDenominator}=${v.answer}`)}.`
    ]:difficulty===0?[
      `분모의 수열을 두 칸 옮기면 분자의 수열과 겹칩니다. 따라서 ${math(high)}에서 공통 항을 약분합니다.`,
      `남는 곱은 ${math(`${a}×${a+3}/(${a+3*n}×${a+3*n+3})=${v.answer}`)}입니다.`
    ]:[
      `분자를 ${a}, ${a+3}, …로 놓으면 분모는 두 항 뒤의 분자와 같아집니다.`,
      `공통 인수를 약분하면 ${math(`${a}×${a+3}/(${a+3*n}×${a+3*n+3})=${v.rawNumerator}/${v.rawDenominator}=${v.answer}`)}입니다.`
    ];
    return{prompt,answer:v.answer,solution:`<span data-source-answer="${id}" class="source52-u2-solution">${lines.map((s,i)=>`<span class="source52-u2-step">${i+1}. ${s}</span>`).join("")}</span>`,answerVisual:"",answerModel:{numerator:v.answerFraction.n,denominator:v.answerFraction.d,answer:v.answer},questionModel:{kind:"offset-arithmetic-fraction-product",termCount:n,sourceSubitem:id},sourceValuesExcluded:true};
  }
  function generate(type,u,d,s,variant=0){if(type?.sourceItemId!==id||type?.id!==id||type?.sourceVerified!==true||type?.reviewLocked!==false||type?.generatorKey!==key)return null;if(!Number.isSafeInteger(variant)||variant<0||![-1,0,1].includes(d))throw new Error("고정 변형 또는 난이도 값이 올바르지 않습니다.");const poolIndex=variant%pools.length,q=build(poolIndex,d);return Object.freeze({...q,prompt:`<div data-source-item-id="${id}" data-pool-index="${poolIndex}" data-variant="${poolIndex}" data-difficulty-offset="${d}" data-level="${d+1}">${q.prompt}</div>`,sourceItemId:id,generator:key,generationMode:"fixed-verified-pool",verifiedPoolIndex:poolIndex,verifiedVariantCount:3,verifiedVariantTarget:3,verifiedVariantId:`${id}:v${poolIndex}`,variantProvenance:"synthetic-source-structure",answerVisualRequired:false,answerVisualStatus:"not-required",difficultyDesign:["guided-offset-cancellation","standard-telescoping-product","efficient-endpoint-product"][d+1],reasoningSteps:2,sourceStructurePreserved:true,sourceEvidenceRef:"canonical-source:d870f8ab03e392a5ec8be1626ad380685d50bab5f8e410ec2ccfb7e578266463; printed p.17 Mission 4; PDF p.13; Apple Vision OCR + direct visual source cross-check",publisherKeyVerified:false,publisherAnswerVerified:false,handwrittenAnswerVerified:false,answerVerification:"independent-telescoping-fraction-product"})}
  function install(target){const api=target?.HSE_GENERATORS;if(!api||typeof api.generatorKey!=="function"||typeof api.generate!=="function")return false;if(api.__source52U2Page17Mission4Installed)return true;const oldKey=api.generatorKey.bind(api),oldGenerate=api.generate.bind(api);api.generatorKey=t=>t?.sourceItemId===id||t?.id===id||t?.generatorKey===key?(t.id===id&&t.sourceItemId===id&&t.generatorKey===key&&t.sourceVerified===true&&t.reviewLocked===false?key:""):oldKey(t);api.generate=(t,u,d,s,v=0)=>t?.sourceItemId===id||t?.id===id||t?.generatorKey===key?generate(t,u,d,s,v):oldGenerate(t,u,d,s,v);if(Array.isArray(api.names)&&!api.names.includes(key))api.names.push(key);Object.defineProperty(api,"__source52U2Page17Mission4Installed",{value:true});return true}
  return Object.freeze({id,key,pools,derive,build,generate,install});
});
