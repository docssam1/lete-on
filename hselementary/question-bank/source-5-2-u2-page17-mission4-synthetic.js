(function(root,factory){"use strict";const api=factory();if(typeof module==="object"&&module.exports)module.exports=api;root.HSE_SOURCE_52_U2_PAGE17_MISSION4=api;api.install(root)})(typeof window!=="undefined"?window:globalThis,function(){
  "use strict";
  const id="5-2-u2-e2-mission-4-synthetic",key="source52U2Page17Mission4",pools=Object.freeze([{first:4,count:30},{first:7,count:25},{first:2,count:40}]);
  // Keep the approved standard pool intact. Offset controls how many factors survive cancellation.
  const tierPools=Object.freeze({
    '-1':Object.freeze([{first:4,count:6,offset:1},{first:7,count:7,offset:1},{first:2,count:8,offset:1}]),
    '0':Object.freeze(pools.map(p=>Object.freeze({...p,offset:2}))),
    '1':Object.freeze([{first:4,count:60,offset:3},{first:7,count:65,offset:3},{first:2,count:70,offset:3}])
  });
  const gcd=(a,b)=>b?gcd(b,a%b):a,frac=(n,d)=>{if(!Number.isSafeInteger(n)||!Number.isSafeInteger(d)||d<=0)throw new Error("분수 계산을 확인하세요.");const g=gcd(n,d);return{n:n/g,d:d/g}},text=x=>`${x.n}/${x.d}`;
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])),math=s=>`<span class="math-inline-expression">${esc(s)}</span>`;
  function derive(index,difficulty=0){
    const p=tierPools[difficulty]?.[index];if(!p)throw new Error("검증된 난도와 변형을 선택하세요.");
    const numeratorFactors=Array.from({length:p.offset},(_,i)=>p.first+3*i);
    const denominatorFactors=Array.from({length:p.offset},(_,i)=>p.first+3*(p.count+i));
    const rawNumerator=numeratorFactors.reduce((x,y)=>x*y,1),rawDenominator=denominatorFactors.reduce((x,y)=>x*y,1);
    const answer=frac(rawNumerator,rawDenominator);
    return{p,numeratorFactors,denominatorFactors,rawNumerator,rawDenominator,answer:text(answer),answerFraction:answer};
  }
  function build(index,difficulty){
    const v=derive(index,difficulty),a=v.p.first,n=v.p.count,k=v.p.offset,terms=[a,a+3,a+6,a+9];
    const prompt=`<div class="source52-p17m4-question"><p>다음 규칙에 따라 분수를 계속 나열합니다.</p><p class="math-inline-expression">${terms.map(x=>`${x}/${x+3*k}`).join(", ")}, …</p><p>첫 번째부터 ${n}번째까지의 분수를 모두 곱하면 얼마인가요?</p></div>`;
    const last=a+3*(n-1),product=`${a}/${a+3*k} × ${a+3}/${a+3+3*k} × … × ${last}/${last+3*k}`;
    const remaining=`(${v.numeratorFactors.join("×")})/(${v.denominatorFactors.join("×")})`;
    const lines=[
      `분자와 분모는 각각 3씩 커지고, 분모는 분자보다 ${3*k} 크므로 분모의 첫 항은 분자의 ${k+1}번째 항과 같습니다.`,
      `${math(product)}에서 같은 인수를 약분하면 처음 분자 ${k}개와 마지막 분모 ${k}개만 남습니다.`,
      `따라서 ${math(`${remaining}=${v.rawNumerator}/${v.rawDenominator}=${v.answer}`)}입니다.`
    ];
    return{prompt,answer:v.answer,solution:`<span data-source-answer="${id}" class="source52-u2-solution">${lines.map((s,i)=>`<span class="source52-u2-step">${i+1}. ${s}</span>`).join("")}</span>`,answerVisual:"",answerModel:{numerator:v.answerFraction.n,denominator:v.answerFraction.d,answer:v.answer},questionModel:{kind:"offset-arithmetic-fraction-product",termCount:n,offset:k,sourceSubitem:id},sourceValuesExcluded:true};
  }
  function generate(type,u,d,s,variant=0){if(type?.sourceItemId!==id||type?.id!==id||type?.sourceVerified!==true||type?.reviewLocked!==false||type?.generatorKey!==key)return null;if(!Number.isSafeInteger(variant)||variant<0||![-1,0,1].includes(d))throw new Error("고정 변형 또는 난이도 값이 올바르지 않습니다.");const poolIndex=variant%pools.length,q=build(poolIndex,d);return Object.freeze({...q,prompt:`<div data-source-item-id="${id}" data-pool-index="${poolIndex}" data-variant="${poolIndex}" data-difficulty-offset="${d}" data-level="${d+1}">${q.prompt}</div>`,sourceItemId:id,generator:key,generationMode:"fixed-verified-pool",verifiedPoolIndex:poolIndex,verifiedVariantCount:3,verifiedVariantTarget:3,verifiedVariantId:`${id}:v${poolIndex}`,variantProvenance:"synthetic-source-structure",answerVisualRequired:false,answerVisualStatus:"not-required",difficultyDesign:["one-factor-cancellation","two-factor-cancellation","three-factor-cancellation"][d+1],reasoningSteps:2,sourceStructurePreserved:true,sourceEvidenceRef:"canonical-source:d870f8ab03e392a5ec8be1626ad380685d50bab5f8e410ec2ccfb7e578266463; printed p.17 Mission 4; PDF p.13; Apple Vision OCR + direct visual source cross-check",publisherKeyVerified:false,publisherAnswerVerified:false,handwrittenAnswerVerified:false,answerVerification:"independent-telescoping-fraction-product"})}
  function install(target){const api=target?.HSE_GENERATORS;if(!api||typeof api.generatorKey!=="function"||typeof api.generate!=="function")return false;if(api.__source52U2Page17Mission4Installed)return true;const oldKey=api.generatorKey.bind(api),oldGenerate=api.generate.bind(api);api.generatorKey=t=>t?.sourceItemId===id||t?.id===id||t?.generatorKey===key?(t.id===id&&t.sourceItemId===id&&t.generatorKey===key&&t.sourceVerified===true&&t.reviewLocked===false?key:""):oldKey(t);api.generate=(t,u,d,s,v=0)=>t?.sourceItemId===id||t?.id===id||t?.generatorKey===key?generate(t,u,d,s,v):oldGenerate(t,u,d,s,v);if(Array.isArray(api.names)&&!api.names.includes(key))api.names.push(key);Object.defineProperty(api,"__source52U2Page17Mission4Installed",{value:true});return true}
  return Object.freeze({id,key,pools,tierPools,derive,build,generate,install});
});
