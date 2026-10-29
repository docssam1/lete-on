(function(root,factory){"use strict";const api=factory();if(typeof module==="object"&&module.exports)module.exports=api;root.HSE_SOURCE_52_U2_PAGE17_MISSION3=api;api.install(root)})(typeof window!=="undefined"?window:globalThis,function(){
  "use strict";
  const id="5-2-u2-e2-mission-3-synthetic",key="source52U2Page17Mission3",pools=Object.freeze([
    {term:18,multiplier:[7,2],multiplierText:"3 1/2"},
    {term:24,multiplier:[17,3],multiplierText:"5 2/3"},
    {term:32,multiplier:[15,2],multiplierText:"7 1/2"}
  ]);
  const gcd=(a,b)=>b?gcd(b,a%b):a,frac=(n,d)=>{const g=gcd(n,d);return{n:n/g,d:d/g}},mul=(a,b)=>frac(a.n*b.n,a.d*b.d),text=x=>{const w=Math.floor(x.n/x.d),r=x.n%x.d;return r?`${w?`${w} `:""}${r}/${x.d}`:String(w)};
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])),math=s=>`<span class="math-inline-expression">${esc(s)}</span>`;
  function termAt(position){if(!Number.isSafeInteger(position)||position<1)throw new Error("항 번호는 자연수여야 합니다.");let preceding=0,denominator=3;while(preceding+denominator-1<position){preceding+=denominator-1;denominator++}return{preceding,denominator,numerator:position-preceding,count:denominator-1}}
  function derive(index){const p=pools[index],term=termAt(p.term),fraction=frac(term.numerator,term.denominator),factor=frac(...p.multiplier),answer=mul(fraction,factor);return{p,term,fraction,factor,answer:text(answer),answerFraction:answer}}
  function build(index,difficulty){const v=derive(index),termText=`${v.term.numerator}/${v.term.denominator}`,prompt=`<div class="source52-p17m3-question"><p>분수를 다음 규칙에 따라 차례로 나열했습니다.</p><p class="math-inline-expression">1/3, 2/3, 1/4, 2/4, 3/4, 1/5, 2/5, …</p><p>${v.p.term}번째 분수에 ${math(v.p.multiplierText)}를 곱하면 얼마인가요?</p>${difficulty<0?`<span class="source52-u2-hint">도움말: 분모가 3, 4, 5, …인 묶음마다 몇 개의 분수가 있는지 세어 보세요.</span>`:""}</div>`;
    const lines=difficulty<0?[
      `분모가 3부터 ${v.term.denominator-1}까지인 묶음에는 차례로 2, 3, …, ${v.term.denominator-2}개가 있어 모두 ${v.term.preceding}개입니다.`,
      `따라서 ${v.p.term}번째는 분모가 ${v.term.denominator}인 묶음의 ${v.term.numerator}번째, 즉 ${math(termText)}입니다. 곱하면 ${math(`${termText}×${v.p.multiplierText}=${v.answer}`)}입니다.`
    ]:difficulty===0?[
      `분모가 3부터 ${v.term.denominator-1}까지인 항의 수를 더하면 ${math(`${Array.from({length:v.term.denominator-3},(_,i)=>i+2).join("+")}=${v.term.preceding}`)}입니다.`,
      `남은 ${v.p.term-v.term.preceding}번째 항은 분모가 ${v.term.denominator}인 묶음의 ${v.term.numerator}번째이므로 ${math(`${termText}×${v.p.multiplierText}=${v.answer}`)}입니다.`
    ]:[
      `분모가 3부터 ${v.term.denominator-1}까지인 묶음의 항 수 합은 ${v.term.preceding}개이므로 ${v.p.term}번째 항은 ${math(termText)}입니다.`,
      `대분수를 가분수로 바꾸어 곱하면 ${math(`${termText}×${v.p.multiplier[0]}/${v.p.multiplier[1]}=${v.answer}`)}입니다.`
    ];
    return{prompt,answer:v.answer,solution:`<span data-source-answer="${id}" class="source52-u2-solution">${lines.map((s,i)=>`<span class="source52-u2-step">${i+1}. ${s}</span>`).join("")}</span>`,answerVisual:"",answerModel:{numerator:v.answerFraction.n,denominator:v.answerFraction.d,answer:v.answer},questionModel:{kind:"triangular-group-fraction-sequence",term:v.p.term,sourceSubitem:id},sourceValuesExcluded:true};
  }
  function generate(type,u,d,s,variant=0){if(type?.sourceItemId!==id||type?.id!==id||type?.sourceVerified!==true||type?.reviewLocked!==false||type?.generatorKey!==key)return null;if(!Number.isSafeInteger(variant)||variant<0||![-1,0,1].includes(d))throw new Error("고정 변형 또는 난이도 값이 올바르지 않습니다.");const poolIndex=variant%pools.length,q=build(poolIndex,d);return Object.freeze({...q,prompt:`<div data-source-item-id="${id}" data-pool-index="${poolIndex}" data-variant="${poolIndex}" data-difficulty-offset="${d}" data-level="${d+1}">${q.prompt}</div>`,sourceItemId:id,generator:key,generationMode:"fixed-verified-pool",verifiedPoolIndex:poolIndex,verifiedVariantCount:3,verifiedVariantTarget:3,verifiedVariantId:`${id}:v${poolIndex}`,variantProvenance:"synthetic-source-structure",answerVisualRequired:false,answerVisualStatus:"not-required",difficultyDesign:["guided-triangular-group-counting","standard-sequence-position-reasoning","efficient-block-index-calculation"][d+1],reasoningSteps:2,sourceStructurePreserved:true,sourceEvidenceRef:"canonical-source:d870f8ab03e392a5ec8be1626ad380685d50bab5f8e410ec2ccfb7e578266463; printed p.17 Mission 3; PDF p.13; Apple Vision OCR + direct visual source cross-check",publisherKeyVerified:false,publisherAnswerVerified:false,handwrittenAnswerVerified:false,answerVerification:"independent-triangular-sequence-position-and-fraction-product"})}
  function install(target){const api=target?.HSE_GENERATORS;if(!api||typeof api.generatorKey!=="function"||typeof api.generate!=="function")return false;if(api.__source52U2Page17Mission3Installed)return true;const oldKey=api.generatorKey.bind(api),oldGenerate=api.generate.bind(api);api.generatorKey=t=>t?.sourceItemId===id||t?.id===id||t?.generatorKey===key?(t.id===id&&t.sourceItemId===id&&t.generatorKey===key&&t.sourceVerified===true&&t.reviewLocked===false?key:""):oldKey(t);api.generate=(t,u,d,s,v=0)=>t?.sourceItemId===id||t?.id===id||t?.generatorKey===key?generate(t,u,d,s,v):oldGenerate(t,u,d,s,v);if(Array.isArray(api.names)&&!api.names.includes(key))api.names.push(key);Object.defineProperty(api,"__source52U2Page17Mission3Installed",{value:true});return true}
  return Object.freeze({id,key,pools,termAt,derive,build,generate,install});
});
