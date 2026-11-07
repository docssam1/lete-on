(function(root,factory){"use strict";const api=factory();if(typeof module==="object"&&module.exports)module.exports=api;root.HSE_SOURCE_52_U2_PAGE17_MISSION5=api;api.install(root)})(typeof window!=="undefined"?window:globalThis,function(){
  "use strict";
  const id="5-2-u2-e2-mission-5-synthetic",key="source52U2Page17Mission5",pools=Object.freeze([
    {height:[16,3],heightText:"5 1/3",ratio:[1,2],ratioText:"1/2"},
    {height:[15,2],heightText:"7 1/2",ratio:[2,3],ratioText:"2/3"},
    {height:[15,4],heightText:"3 3/4",ratio:[1,3],ratioText:"1/3"}
  ]);
  const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a),frac=(n,d)=>{if(!Number.isSafeInteger(n)||!Number.isSafeInteger(d)||d<=0)throw new Error("분수 계산을 확인하세요.");const g=gcd(n,d);return{n:n/g,d:d/g}},add=(a,b)=>frac(a.n*b.d+b.n*a.d,a.d*b.d),mul=(a,b)=>frac(a.n*b.n,a.d*b.d),twice=a=>frac(2*a.n,a.d),text=x=>{const w=Math.floor(x.n/x.d),r=x.n%x.d;return r?`${w?`${w} `:""}${r}/${x.d}`:String(w)};
  const escape=s=>String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])),math=s=>`<span class="math-inline-expression">${escape(s)}</span>`;
  const riseCounts=Object.freeze({'-1':2,'0':3,'1':4}), ordinals=['첫','두','세','네'];
  function derive(index,difficulty=0){
    const p=pools[index],count=riseCounts[difficulty];if(!p||!count)throw new Error("검증된 난도와 변형을 선택하세요.");
    const height=frac(...p.height),ratio=frac(...p.ratio),rises=[];let current=height;
    for(let i=0;i<count;i++){current=mul(current,ratio);rises.push(current)}
    const answer=rises.reduce((total,rise,i)=>add(total,i===count-1?rise:twice(rise)),height);
    return{p,count,height,ratio,rises,answer:text(answer),answerFraction:answer};
  }
  function build(index,difficulty){
    const v=derive(index,difficulty),H=v.p.heightText,r=v.p.ratioText,last=ordinals[v.count-1];
    const prompt=`<div class="source52-p17m5-question"><p>높이 ${math(`${H}m`)}에서 떨어뜨린 공은 바닥에 닿을 때마다 바로 전 낙하 높이의 ${math(r)}만큼 올라갑니다. 이 공이 ${last} 번째로 올라간 순간까지 이동한 전체 거리는 몇 m인가요?</p></div>`;
    const lines=[`처음 낙하한 거리는 ${math(`${H}m`)}입니다.`];
    v.rises.forEach((rise,i)=>{const previous=i?text(v.rises[i-1]):H;lines.push(`${ordinals[i]} 번째 상승 높이는 ${math(`${previous}×${r}=${text(rise)}m`)}입니다.`)});
    const sum=[H,...v.rises.map((rise,i)=>`${i===v.count-1?'':'2×'}${text(rise)}`)].join('+');
    lines.push(`처음 낙하, 마지막 전까지의 각 상승과 낙하, 마지막 상승을 더하면 ${math(`${sum}=${v.answer}m`)}입니다.`);
    return{prompt,answer:`${v.answer}m`,solution:`<span data-source-answer="${id}" class="source52-u2-solution">${lines.map((s,i)=>`<span class="source52-u2-step">${i+1}. ${s}</span>`).join("")}</span>`,answerVisual:"",answerModel:{numerator:v.answerFraction.n,denominator:v.answerFraction.d,unit:"m",answer:`${v.answer}m`},questionModel:{kind:"rebounding-ball-total-distance-through-rise",riseCount:v.count,sourceSubitem:id},sourceValuesExcluded:true};
  }
  function generate(type,u,d,s,variant=0){if(type?.sourceItemId!==id||type?.id!==id||type?.sourceVerified!==true||type?.reviewLocked!==false||type?.generatorKey!==key)return null;if(!Number.isSafeInteger(variant)||variant<0||![-1,0,1].includes(d))throw new Error("고정 변형 또는 난이도 값이 올바르지 않습니다.");const poolIndex=variant%pools.length,q=build(poolIndex,d);return Object.freeze({...q,prompt:`<div data-source-item-id="${id}" data-pool-index="${poolIndex}" data-variant="${poolIndex}" data-difficulty-offset="${d}" data-level="${d+1}">${q.prompt}</div>`,sourceItemId:id,generator:key,generationMode:"fixed-verified-pool",verifiedPoolIndex:poolIndex,verifiedVariantCount:3,verifiedVariantTarget:3,verifiedVariantId:`${id}:v${poolIndex}`,variantProvenance:"synthetic-source-structure",answerVisualRequired:false,answerVisualStatus:"not-required",difficultyDesign:["second-rise-distance-accounting","standard-third-rise-distance-model","fourth-rise-distance-accounting"][d+1],reasoningSteps:riseCounts[d]+2,sourceStructurePreserved:true,sourceEvidenceRef:"canonical-source:d870f8ab03e392a5ec8be1626ad380685d50bab5f8e410ec2ccfb7e578266463; printed p.17 Mission 5; PDF p.13; Apple Vision OCR + direct visual source cross-check",publisherKeyVerified:false,publisherAnswerVerified:false,handwrittenAnswerVerified:false,answerVerification:"independent-exact-rebound-distance-sum"})}
  function install(target){const api=target?.HSE_GENERATORS;if(!api||typeof api.generatorKey!=="function"||typeof api.generate!=="function")return false;if(api.__source52U2Page17Mission5Installed)return true;const oldKey=api.generatorKey.bind(api),oldGenerate=api.generate.bind(api);api.generatorKey=t=>t?.sourceItemId===id||t?.id===id||t?.generatorKey===key?(t.id===id&&t.sourceItemId===id&&t.generatorKey===key&&t.sourceVerified===true&&t.reviewLocked===false?key:""):oldKey(t);api.generate=(t,u,d,s,v=0)=>t?.sourceItemId===id||t?.id===id||t?.generatorKey===key?generate(t,u,d,s,v):oldGenerate(t,u,d,s,v);if(Array.isArray(api.names)&&!api.names.includes(key))api.names.push(key);Object.defineProperty(api,"__source52U2Page17Mission5Installed",{value:true});return true}
  return Object.freeze({id,key,pools,riseCounts,derive,build,generate,install});
});
