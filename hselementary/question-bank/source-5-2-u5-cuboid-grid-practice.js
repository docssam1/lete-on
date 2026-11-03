(function(root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE52_U5_GRID_PRACTICE = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function() {
  "use strict";
  const id = "5-2-u5-e1-mission-1-grid-synthetic", key = "source52U5CuboidGridPractice";
  const cases = Object.freeze([[4,3,2],[5,2,2],[5,3,2],[5,4,2]].map(Object.freeze));
  const chooseTwo = n => n * (n - 1) / 2;
  function model(index) {
    const dimensions = cases[index];
    if (!dimensions) throw new Error("검증된 연습문항 범위를 벗어났습니다.");
    const factors = dimensions.map(n => chooseTwo(n + 1));
    return { dimensions, factors, answer: factors.reduce((a,b) => a*b, 1) };
  }
  function diagram([w,h,d]) {
    const x=38, y=30+9*d, dx=12*d, dy=-9*d, width=25*w, height=24*h;
    const lines=[];
    const line=(x1,y1,x2,y2,role) => lines.push(`<line data-grid-line="${role}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`);
    for(let i=1;i<w;i++) { line(x+25*i,y,x+25*i,y+height,"front-vertical"); line(x+25*i,y,x+25*i+dx,y+dy,"top-width"); }
    for(let i=1;i<h;i++) { line(x,y+24*i,x+width,y+24*i,"front-horizontal"); line(x+width,y+24*i,x+width+dx,y+24*i+dy,"side-height"); }
    for(let i=1;i<d;i++) { line(x+12*i,y-9*i,x+width+12*i,y-9*i,"top-depth"); line(x+width+12*i,y-9*i,x+width+12*i,y+height-9*i,"side-depth"); }
    return `<svg viewBox="0 0 ${x+width+dx+38} ${y+height+20}" role="img" aria-label="앞면이 가로 ${w}칸, 높이 ${h}칸이고 깊이는 ${d}칸인 격자 직육면체" xmlns="http://www.w3.org/2000/svg" style="display:block;width:min(100%,270px);height:auto;margin:4px auto"><g fill="none" stroke="#191511" stroke-width="1.5" stroke-linejoin="round"><path d="M${x} ${y}h${width}v${height}h-${width}Z M${x} ${y}l${dx} ${dy}h${width}l-${dx} ${-dy} M${x+width} ${y+height}l${dx} ${dy}v-${height}"/>${lines.join("")}</g></svg>`;
  }
  function build(index) {
    const m=model(index), [w,h,d]=m.dimensions, [a,b,c]=m.factors;
    const ways = n => Array.from({length:n}, (_, i) => n-i).join("+");
    return {
      prompt:`<div data-source-item-id="${id}" data-pool-index="${index}"><p>그림의 격자선을 경계로 만들 수 있는 크고 작은 직육면체는 모두 몇 개인가요? (자르지 않은 전체 모양도 한 개로 셉니다.)</p>${diagram(m.dimensions)}</div>`,
      answer:`${m.answer}개`,
      solution:`<div data-source-answer="${id}"><p>각 방향에서 직육면체의 양쪽 경계가 될 격자면 두 개를 고릅니다. 가로의 두 경계는 ${ways(w)}=${a}가지로 고릅니다. 같은 방법으로 높이는 ${ways(h)}=${b}가지, 깊이는 ${ways(d)}=${c}가지입니다.</p><p>각 방향의 선택을 곱하면 ${a}×${b}×${c}=<strong>${m.answer}개</strong>입니다. 각 방향의 맨 바깥 경계를 고르는 경우에 전체 모양도 포함됩니다.</p></div>`,
      answerVisual:"",answerVisualRequired:false,answerVisualStatus:"not-required",answerModel:m,sourceValuesExcluded:true
    };
  }
  function generate(type,user,difficulty,seed,variant=0) {
    if (!type || type.id!==id || type.generatorKey!==key || type.sourceVerified!==true || type.reviewLocked!==false) return null;
    if (!Number.isSafeInteger(variant) || variant<0) throw new Error("변형 번호 오류");
    const index=variant%cases.length;
    return {...build(index),sourceItemId:id,generator:key,generationMode:"fixed-verified-pool",verifiedPoolIndex:index,verifiedVariantCount:4,verifiedVariantTarget:4,verifiedVariantId:`${id}:v${index}`,variantProvenance:"synthetic-different-grid-dimensions",publisherKeyVerified:false,publisherAnswerVerified:false,answerVerification:"independent-grid-interval-enumeration"};
  }
  function install(target) {
    const api=target?.HSE_GENERATORS;
    if(!api || typeof api.generate!=="function" || typeof api.generatorKey!=="function") return false;
    if(api.__source52U5GridPracticeInstalled) return true;
    const oldKey=api.generatorKey.bind(api), oldGenerate=api.generate.bind(api), matches=t=>t?.id===id||t?.sourceItemId===id||t?.generatorKey===key;
    api.generatorKey=t=>matches(t)?t.id===id&&t.generatorKey===key&&t.sourceVerified===true&&t.reviewLocked===false?key:"":oldKey(t);
    api.generate=(t,u,d,s,v=0)=>matches(t)?generate(t,u,d,s,v):oldGenerate(t,u,d,s,v);
    if(Array.isArray(api.names)&&!api.names.includes(key)) api.names.push(key);
    Object.defineProperty(api,"__source52U5GridPracticeInstalled",{value:true});
    return true;
  }
  return Object.freeze({id,key,cases,model,diagram,build,generate,install});
});
