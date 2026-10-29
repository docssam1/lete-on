(function(root,factory){"use strict";const api=factory();if(typeof module==="object"&&module.exports)module.exports=api;root.HSE_SOURCE_52_U2_PAGE18_EXAMPLE33=api;api.install(root)})(typeof window!=="undefined"?window:globalThis,function(){
  "use strict";
  const id="5-2-u2-e3-example-3-synthetic",key="source52U2Page18Example33",pools=Object.freeze([
    {first:[1,4],second:[1,3],third:[1,2],lastArea:240},
    {first:[2,7],second:[1,5],third:[1,2],lastArea:280},
    {first:[1,8],second:[2,7],third:[1,2],lastArea:250}
  ]);
  const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a),frac=(n,d)=>{if(!Number.isSafeInteger(n)||!Number.isSafeInteger(d)||d<=0)throw new Error("분수 계산을 확인하세요.");const g=gcd(n,d);return{n:n/g,d:d/g}},add=(a,b)=>frac(a.n*b.d+b.n*a.d,a.d*b.d),subtract=(a,b)=>frac(a.n*b.d-b.n*a.d,a.d*b.d),multiply=(a,b)=>frac(a.n*b.n,a.d*b.d),divide=(a,b)=>frac(a.n*b.d,a.d*b.n),fmt=x=>x.d===1?String(x.n):`${x.n}/${x.d}`;
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])),math=s=>`<span class="math-inline-expression">${esc(s)}</span>`;
  function derive(index){const p=pools[index],first=frac(...p.first),second=frac(...p.second),third=frac(...p.third),remaining1=subtract(frac(1,1),first),remaining2=multiply(remaining1,subtract(frac(1,1),second)),lastShare=multiply(remaining2,third),total=divide(frac(p.lastArea,1),lastShare);if(total.d!==1)throw new Error("공원 전체 넓이가 자연수인지 확인하세요.");return{p,first,second,third,remaining1,remaining2,lastShare,total,answer:`${total.n}m²`}}
  function build(index,difficulty){const v=derive(index),p=v.p,first=fmt(v.first),second=fmt(v.second),third=fmt(v.third),left1=fmt(v.remaining1),left2=fmt(v.remaining2),share=fmt(v.lastShare),total=v.total.n;
    const prompt=`<div class="source52-p18e33-question"><p>공원 전체 넓이의 ${math(first)}에 놀이터를 만들었습니다. 남은 넓이의 ${math(second)}에 산책로를 만들고, 다시 남은 넓이의 ${math(third)}에 잔디를 심었습니다. 잔디를 심은 곳이 ${p.lastArea}m²라면 공원 전체 넓이는 몇 m²인가요?</p></div>`;
    const steps=difficulty<0?[
      `놀이터를 만들고 남은 비율은 ${math(`1−${first}=${left1}`)}입니다. 산책로를 만들고 남은 비율은 ${math(`${left1}×(1−${second})=${left2}`)}입니다.`,
      `잔디가 차지하는 비율은 전체의 ${math(`${left2}×${third}=${share}`)}입니다. 따라서 전체 넓이는 ${math(`${p.lastArea}÷${share}=${total}m²`)}입니다.`
    ]:difficulty===0?[
      `잔디를 심은 넓이는 전체의 ${math(`(1−${first})×(1−${second})×${third}=${share}`)}입니다.`,
      `공원 전체 넓이를 구하면 ${math(`${p.lastArea}÷${share}=${total}m²`)}입니다.`
    ]:[
      `잔디는 전체의 ${math(`${left1}×(1−${second})×${third}=${share}`)}을 차지합니다.`,
      `따라서 전체 넓이는 ${math(`${p.lastArea}×${v.lastShare.d}/${v.lastShare.n}=${total}m²`)}입니다.`
    ];
    return{prompt,answer:v.answer,solution:`<span data-source-answer="${id}" class="source52-u2-solution">${steps.map((s,i)=>`<span class="source52-u2-step">${i+1}. ${s}</span>`).join("")}</span>`,answerVisual:"",answerModel:{numerator:total,denominator:1,unit:"m²",answer:v.answer},questionModel:{kind:"successive-fractions-of-remaining-area",sourceSubitem:id},sourceValuesExcluded:true};
  }
  function generate(type,u,d,s,variant=0){if(type?.sourceItemId!==id||type?.id!==id||type?.sourceVerified!==true||type?.reviewLocked!==false||type?.generatorKey!==key)return null;if(!Number.isSafeInteger(variant)||variant<0||![-1,0,1].includes(d))throw new Error("고정 변형 또는 난이도 값이 올바르지 않습니다.");const poolIndex=variant%pools.length,q=build(poolIndex,d);return Object.freeze({...q,prompt:`<div data-source-item-id="${id}" data-pool-index="${poolIndex}" data-variant="${poolIndex}" data-difficulty-offset="${d}" data-level="${d+1}">${q.prompt}</div>`,sourceItemId:id,generator:key,generationMode:"fixed-verified-pool",verifiedPoolIndex:poolIndex,verifiedVariantCount:3,verifiedVariantTarget:3,verifiedVariantId:`${id}:v${poolIndex}`,variantProvenance:"synthetic-source-structure",answerVisualRequired:false,answerVisualStatus:"not-required",difficultyDesign:["guided-successive-remaining-area","standard-nested-fraction-product","efficient-reciprocal-area-calculation"][d+1],reasoningSteps:2,sourceStructurePreserved:true,sourceEvidenceRef:"canonical-source:d870f8ab03e392a5ec8be1626ad380685d50bab5f8e410ec2ccfb7e578266463; printed p.18 Example 3-3; PDF p.14; Apple Vision OCR + direct visual source cross-check",publisherKeyVerified:false,publisherAnswerVerified:false,handwrittenAnswerVerified:false,answerVerification:"independent-exact-successive-remaining-fractions"})}
  function install(target){const api=target?.HSE_GENERATORS;if(!api||typeof api.generatorKey!=="function"||typeof api.generate!=="function")return false;if(api.__source52U2Page18Example33Installed)return true;const oldKey=api.generatorKey.bind(api),oldGenerate=api.generate.bind(api);api.generatorKey=t=>t?.sourceItemId===id||t?.id===id||t?.generatorKey===key?(t.id===id&&t.sourceItemId===id&&t.generatorKey===key&&t.sourceVerified===true&&t.reviewLocked===false?key:""):oldKey(t);api.generate=(t,u,d,s,v=0)=>t?.sourceItemId===id||t?.id===id||t?.generatorKey===key?generate(t,u,d,s,v):oldGenerate(t,u,d,s,v);if(Array.isArray(api.names)&&!api.names.includes(key))api.names.push(key);Object.defineProperty(api,"__source52U2Page18Example33Installed",{value:true});return true}
  return Object.freeze({id,key,pools,derive,build,generate,install});
});
