(function(root,factory){"use strict";const api=factory();if(typeof module==="object"&&module.exports)module.exports=api;root.HSE_SOURCE_52_U2_PAGE18_EXAMPLE34=api;api.install(root)})(typeof window!=="undefined"?window:globalThis,function(){
  "use strict";
  const id="5-2-u2-e3-example-4-synthetic",key="source52U2Page18Example34",pools=Object.freeze([
    {firstDenominator:3,secondDenominator:2,total:7500},
    {firstDenominator:5,secondDenominator:4,total:8100},
    {firstDenominator:4,secondDenominator:3,total:7700}
  ]);
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])),math=s=>`<span class="math-inline-expression">${esc(s)}</span>`,money=n=>`${n.toLocaleString("en-US")}원`;
  function derive(index){const p=pools[index],parts=p.firstDenominator+p.secondDenominator;if(p.total%parts!==0)throw new Error("두 사람의 몫이 자연수인지 확인하세요.");const unit=p.total/parts,first=p.firstDenominator*unit,second=p.secondDenominator*unit;return{p,parts,unit,first,second,answer:`지우 ${money(first)}, 민호 ${money(second)}`}}
  function build(index,difficulty){const v=derive(index),p=v.p,a=p.firstDenominator,b=p.secondDenominator,ratio=`${a}:${b}`,unit=money(v.unit),first=money(v.first),second=money(v.second),total=money(p.total);
    const prompt=`<div class="source52-p18e34-question"><p>지우와 민호의 저금액을 합하면 ${total}입니다. 지우의 저금액을 ${a}등분한 한 부분과 민호의 저금액을 ${b}등분한 한 부분이 같습니다. 지우와 민호는 각각 얼마를 저금했나요?</p></div>`;
    const steps=[
      `두 사람의 같은 부분을 한 단위로 생각하면 지우는 ${a}단위, 민호는 ${b}단위이므로 저금액의 비는 ${math(ratio)}입니다.`,
      `합은 ${v.parts}단위이고 ${total}이므로 한 단위는 ${math(`${p.total.toLocaleString("en-US")}÷${v.parts}=${unit}`)}입니다.`,
      `지우는 ${math(`${a}×${unit}=${first}`)}, 민호는 ${math(`${b}×${unit}=${second}`)}입니다.`
    ];
    if(difficulty<0)steps.unshift("두 사람이 나눈 한 부분의 금액이 같다는 조건을 이용합니다.");
    return{prompt,answer:v.answer,solution:`<span data-source-answer="${id}" class="source52-u2-solution">${steps.map((s,i)=>`<span class="source52-u2-step">${i+1}. ${s}</span>`).join("")}</span>`,answerVisual:"",answerModel:{firstAmount:v.first,secondAmount:v.second,firstName:"지우",secondName:"민호",unit:"원",ratio:[a,b],answer:v.answer},questionModel:{kind:"equal-fraction-values-share-total",sourceSubitem:id},sourceValuesExcluded:true};
  }
  function generate(type,u,d,s,variant=0){if(type?.sourceItemId!==id||type?.id!==id||type?.sourceVerified!==true||type?.reviewLocked!==false||type?.generatorKey!==key)return null;if(!Number.isSafeInteger(variant)||variant<0||![-1,0,1].includes(d))throw new Error("고정 변형 또는 난이도 값이 올바르지 않습니다.");const poolIndex=variant%pools.length,q=build(poolIndex,d);return Object.freeze({...q,prompt:`<div data-source-item-id="${id}" data-pool-index="${poolIndex}" data-variant="${poolIndex}" data-difficulty-offset="${d}" data-level="${d+1}">${q.prompt}</div>`,sourceItemId:id,generator:key,generationMode:"fixed-verified-pool",verifiedPoolIndex:poolIndex,verifiedVariantCount:3,verifiedVariantTarget:3,verifiedVariantId:`${id}:v${poolIndex}`,variantProvenance:"synthetic-source-structure",answerVisualRequired:false,answerVisualStatus:"not-required",difficultyDesign:["guided-ratio-parts","standard-equal-fraction-ratio","efficient-common-scale-equation"][d+1],reasoningSteps:d<0?4:3,sourceStructurePreserved:true,sourceEvidenceRef:"canonical-source:d870f8ab03e392a5ec8be1626ad380685d50bab5f8e410ec2ccfb7e578266463; printed p.18 Example 3-4; PDF p.14; Apple Vision OCR + direct visual source cross-check",publisherKeyVerified:false,publisherAnswerVerified:false,handwrittenAnswerVerified:false,answerVerification:"independent-exact-equal-fraction-share-ratio"})}
  function install(target){const api=target?.HSE_GENERATORS;if(!api||typeof api.generatorKey!=="function"||typeof api.generate!=="function")return false;if(api.__source52U2Page18Example34Installed)return true;const oldKey=api.generatorKey.bind(api),oldGenerate=api.generate.bind(api);api.generatorKey=t=>t?.sourceItemId===id||t?.id===id||t?.generatorKey===key?(t.id===id&&t.sourceItemId===id&&t.generatorKey===key&&t.sourceVerified===true&&t.reviewLocked===false?key:""):oldKey(t);api.generate=(t,u,d,s,v=0)=>t?.sourceItemId===id||t?.id===id||t?.generatorKey===key?generate(t,u,d,s,v):oldGenerate(t,u,d,s,v);if(Array.isArray(api.names)&&!api.names.includes(key))api.names.push(key);Object.defineProperty(api,"__source52U2Page18Example34Installed",{value:true});return true}
  return Object.freeze({id,key,pools,derive,build,generate,install});
});
