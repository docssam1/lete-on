(function(root,factory){"use strict";const api=factory();if(typeof module==="object"&&module.exports)module.exports=api;root.HSE_SOURCE_52_U2_PAGE18_EXAMPLE31=api;api.install(root)})(typeof window!=="undefined"?window:globalThis,function(){
  "use strict";
  const id="5-2-u2-e3-example-1-synthetic",key="source52U2Page18Example31",pools=Object.freeze([
    {ratio:[1,2],bounce:3,height:20},
    {ratio:[2,5],bounce:2,height:40},
    {ratio:[3,5],bounce:3,height:27}
  ]);
  // Reverse two rises for easier practice and four for harder practice; keep standard cases.
  const tierPools=Object.freeze({
    '-1':Object.freeze([{ratio:[1,2],bounce:2,height:20},{ratio:[2,3],bounce:2,height:16},{ratio:[3,4],bounce:2,height:18}]),
    '0':pools,
    '1':Object.freeze([{ratio:[2,3],bounce:4,height:16},{ratio:[3,4],bounce:4,height:81},{ratio:[4,5],bounce:4,height:256}])
  });
  const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a),frac=(n,d)=>{if(!Number.isSafeInteger(n)||!Number.isSafeInteger(d)||d<=0)throw new Error("분수 계산을 확인하세요.");const g=gcd(n,d);return{n:n/g,d:d/g}},pow=(x,n)=>{let v=1;for(let i=0;i<n;i++)v*=x;return v};
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])),math=s=>`<span class="math-inline-expression">${esc(s)}</span>`;
  function derive(index,difficulty=0){const p=tierPools[difficulty]?.[index];if(!p)throw Error("검증된 난도와 변형을 선택하세요.");const r=frac(...p.ratio),initial=frac(p.height*pow(r.d,p.bounce),pow(r.n,p.bounce));if(initial.d!==1)throw new Error("처음 높이가 자연수인지 확인하세요.");return{p,ratio:r,initial,answer:`${initial.n}cm`}}
  function build(index,difficulty){const v=derive(index,difficulty),p=v.p,r=v.ratio,ratio=`${r.n}/${r.d}`;let current=frac(p.height,1),lines=[];
    for(let i=p.bounce;i>0;i--){const before=frac(current.n*r.d,current.d*r.n);if(before.d!==1)throw Error("각 단계의 높이를 확인하세요.");lines.push(`${i}번째 높이 ${current.n}cm를 ${ratio}로 나누면 ${i===1?'처음 높이':`${i-1}번째 높이`}는 ${before.n}cm입니다.`);current=before;}
    lines[0]=`각 상승 높이는 바로 전 낙하 높이에 ${ratio}를 곱한 값이므로, 이전 높이는 상승 높이를 ${ratio}로 나누어 구합니다. ${lines[0]}`;
    const prompt=`<div class="source52-p18e31-question"><p>공을 떨어뜨리면 바닥에 닿을 때마다 바로 전 낙하 높이의 ${math(ratio)}만큼 올라갑니다. ${p.bounce}번째로 올라간 높이가 ${p.height}cm였다면 처음 떨어뜨린 높이는 몇 cm인가요?</p></div>`;
    return{prompt,answer:v.answer,solution:`<span data-source-answer="${id}" class="source52-u2-solution">${lines.map((s,i)=>`<span class="source52-u2-step">${i+1}. ${esc(s)}</span>`).join("")}</span>`,answerVisual:"",answerModel:{numerator:v.initial.n,denominator:1,unit:"cm",answer:v.answer},questionModel:{kind:"repeated-rebound-height-inversion",sourceSubitem:id},sourceValuesExcluded:true};
  }
  function generate(type,u,d,s,variant=0){if(type?.sourceItemId!==id||type?.id!==id||type?.sourceVerified!==true||type?.reviewLocked!==false||type?.generatorKey!==key)return null;if(!Number.isSafeInteger(variant)||variant<0||![-1,0,1].includes(d))throw new Error("고정 변형 또는 난이도 값이 올바르지 않습니다.");const poolIndex=variant%pools.length,q=build(poolIndex,d);return Object.freeze({...q,prompt:`<div data-source-item-id="${id}" data-pool-index="${poolIndex}" data-variant="${poolIndex}" data-difficulty-offset="${d}" data-level="${d+1}">${q.prompt}</div>`,sourceItemId:id,generator:key,generationMode:"fixed-verified-pool",verifiedPoolIndex:poolIndex,verifiedVariantCount:3,verifiedVariantTarget:3,verifiedVariantId:`${id}:v${poolIndex}`,variantProvenance:"synthetic-source-structure",answerVisualRequired:false,answerVisualStatus:"not-required",difficultyDesign:["two-rise-inversion","standard-repeated-fraction-inversion","four-rise-inversion"][d+1],reasoningSteps:tierPools[d][poolIndex].bounce,sourceStructurePreserved:true,sourceEvidenceRef:"canonical-source:d870f8ab03e392a5ec8be1626ad380685d50bab5f8e410ec2ccfb7e578266463; printed p.18 Example 3-1; PDF p.14; Apple Vision OCR + direct visual source cross-check",publisherKeyVerified:false,publisherAnswerVerified:false,handwrittenAnswerVerified:false,answerVerification:"independent-exact-repeated-ratio-inversion"})}
  function install(target){const api=target?.HSE_GENERATORS;if(!api||typeof api.generatorKey!=="function"||typeof api.generate!=="function")return false;if(api.__source52U2Page18Example31Installed)return true;const oldKey=api.generatorKey.bind(api),oldGenerate=api.generate.bind(api);api.generatorKey=t=>t?.sourceItemId===id||t?.id===id||t?.generatorKey===key?(t.id===id&&t.sourceItemId===id&&t.generatorKey===key&&t.sourceVerified===true&&t.reviewLocked===false?key:""):oldKey(t);api.generate=(t,u,d,s,v=0)=>t?.sourceItemId===id||t?.id===id||t?.generatorKey===key?generate(t,u,d,s,v):oldGenerate(t,u,d,s,v);if(Array.isArray(api.names)&&!api.names.includes(key))api.names.push(key);Object.defineProperty(api,"__source52U2Page18Example31Installed",{value:true});return true}
  return Object.freeze({id,key,pools,tierPools,derive,build,generate,install});
});
