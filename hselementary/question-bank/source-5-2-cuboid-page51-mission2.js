(function(root,factory){"use strict";const api=factory();if(typeof module==="object"&&module.exports)module.exports=api;root.HSE_SOURCE52_P51_M2=api;api.install(root);})(typeof window!=="undefined"?window:globalThis,function(){
  "use strict";
  const sourceItemId="5-2-u5-e2-mission-2",generatorKey="source52CuboidNetPaperEdgeSumPage51Mission2";
  const sourceFaces=Object.freeze([
    {x:0,y:6,w:6,h:18,kind:"side",label:"18×6"},
    {x:6,y:6,w:9,h:18,kind:"side",label:"18×9"},
    {x:15,y:6,w:6,h:18,kind:"side",label:"18×6"},
    {x:21,y:6,w:9,h:18,kind:"side",label:"18×9"},
    {x:6,y:0,w:9,h:6,kind:"cap",label:"9×6"},
    {x:21,y:24,w:9,h:6,kind:"cap",label:"9×6"}
  ]);
  function verifyModel(){
    const overlaps=[];
    for(let i=0;i<sourceFaces.length;i++)for(let j=i+1;j<sourceFaces.length;j++){
      const a=sourceFaces[i],b=sourceFaces[j];
      const overlapW=Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x);
      const overlapH=Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y);
      if(overlapW>0&&overlapH>0)overlaps.push([i,j]);
    }
    if(overlaps.length)throw new Error("p.51 Mission 2의 여섯 면 배치가 겹칩니다.");
    const seams=[];
    for(let i=0;i<sourceFaces.length;i++)for(let j=i+1;j<sourceFaces.length;j++){
      const a=sourceFaces[i],b=sourceFaces[j];
      const vertical=(a.x+a.w===b.x||b.x+b.w===a.x)?Math.max(0,Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y)):0;
      const horizontal=(a.y+a.h===b.y||b.y+b.h===a.y)?Math.max(0,Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x)):0;
      if(vertical||horizontal)seams.push(vertical||horizontal);
    }
    const sorted=seams.slice().sort((a,b)=>a-b);
    const cuboidEdges=[18,9,6],edgeSum=4*cuboidEdges.reduce((a,b)=>a+b,0);
    const paperArea=30*30,netArea=sourceFaces.reduce((s,f)=>s+f.w*f.h,0);
    if(sourceFaces.length!==6||sorted.join(",")!=="9,9,18,18,18"||edgeSum!==132||netArea!==648||paperArea!==900)throw new Error("p.51 Mission 2의 원문 전개도·직육면체 모서리 합 검증에 실패했습니다.");
    return Object.freeze({paperCm:[30,30],stripHeightCm:18,marginTopCm:6,marginBottomCm:6,sideWidthsCm:Object.freeze([6,9,6,9]),cuboidDimensionsCm:Object.freeze(cuboidEdges),faceCount:sourceFaces.length,netAreaCm2:netArea,paperAreaCm2:paperArea,edgeSumCm:edgeSum,seamsCm:Object.freeze(sorted)});
  }
  function netSvg(showDimensions=true){
    const ox=56,oy=25,s=9,px=x=>ox+x*s,py=y=>oy+y*s;
    const lines=[
      [0,0,30,0,"paper-edge"],[30,0,30,30,"paper-edge"],[30,30,0,30,"paper-edge"],[0,30,0,0,"paper-edge"],
      [0,6,6,6,"cut"],[15,6,30,6,"cut"],[0,24,21,24,"cut"],
      [6,0,6,6,"cut"],[15,0,15,6,"cut"],[21,24,21,30,"cut"],
      ...(showDimensions?[[6,6,6,24,"fold"],[15,6,15,24,"fold"],[21,6,21,24,"fold"],
      [6,6,15,6,"fold"],[21,24,30,24,"fold"]]:[])
    ];
    const lineMarkup=lines.map(([x1,y1,x2,y2,kind])=>`<line class="${kind}" x1="${px(x1)}" y1="${py(y1)}" x2="${px(x2)}" y2="${py(y2)}"/>`).join("");
    const labels=`<text x="${px(-4.1)}" y="${py(15)}">18cm</text>${showDimensions?`<text x="${px(3)}" y="${py(15)}">6</text><text x="${px(10.5)}" y="${py(15)}">9</text><text x="${px(18)}" y="${py(15)}">6</text><text x="${px(25.5)}" y="${py(15)}">9</text><text x="${px(10.5)}" y="${py(3)}">9×6</text><text x="${px(25.5)}" y="${py(27)}">9×6</text><text class="paper-label" x="${px(15)}" y="${py(31.7)}">30cm</text>`:""}`;
    const bracket=`<path class="measurement" d="M ${px(-.5)} ${py(6)} Q ${px(-2)} ${py(15)} ${px(-.5)} ${py(24)}"/>`;
    return `<svg class="source52-p51m2-net" viewBox="0 0 356 335" role="img" aria-label="한 변이 30cm인 정사각형 종이 안에 그린 직육면체 전개도. 가운데 띠 높이는 18cm입니다.">${lineMarkup}${bracket}${labels}</svg>`;
  }
  function build(){
    const model=verifyModel();
    const prompt=`<div class="source52-p51m2-question" data-source-item-id="${sourceItemId}" data-pool-index="0"><p>한 변이 30cm인 정사각형 모양의 종이에 다음과 같이 직육면체의 전개도를 그렸다. 그린 직육면체의 전개도를 접어 직육면체를 만들었을 때, 만든 직육면체의 모든 모서리의 길이의 합을 구하여라.</p><div class="source52-p51m2-figure">${netSvg(false)}</div></div>`;
    const solution=`<div class="source52-p51m2-solution" data-source-answer="${sourceItemId}"><p>정사각형 종이의 한 변은 30cm이고, 가운데 옆면 띠의 높이는 18cm입니다. 남는 길이 30−18=12cm가 위와 아래에 똑같이 나뉘므로, 전개도에서 위·아래 면의 한 변은 각각 6cm입니다.</p><p>네 옆면의 폭은 짧은 것과 긴 것이 번갈아 두 번씩 나타나고, 종이 한 변의 길이가 30cm이므로 두 폭의 합은 30÷2=15cm입니다. 한 폭이 6cm이므로 다른 폭은 15−6=9cm입니다. 따라서 직육면체의 세 변은 18cm, 6cm, 9cm입니다.</p><p>직육면체에는 길이 18cm, 6cm, 9cm인 모서리가 각각 4개씩 있습니다.</p><p>4×(18+6+9)=4×33=<strong>132(cm)</strong></p><p class="source52-p51m2-answer">답: 132cm</p></div>`;
    return Object.freeze({prompt,answer:"132cm",solution,answerVisualRequired:true,answerVisual:`<div class="source52-p51m2-solution-net">${netSvg(true)}</div>`,sourceItemId,generator:generatorKey,variant:0,variantIndex:0,poolIndex:0,verifiedPoolIndex:0,verifiedVariantId:`${sourceItemId}:30cm-square-net-edge-sum-132cm`,generationMode:"fixed-verified-pool",verifiedVariantCount:1,verifiedVariantTarget:1,difficultyOffset:0,difficultyLevel:2,difficultyRank:2,sourceStructurePreserved:true,answerVisualStatus:"verified-reconstruction",sourcePdfPage:47,sourcePrintedPage:51,publisherKeyVerified:false,publisherAnswerVerified:false,handwrittenAnswerVerified:false,answerVerification:"30cm-paper-square-18cm-side-strip-and-six-source-net-faces",questionModel:model,answerModel:model});
  }
  function belongs(type){return Boolean(type&&(type.id===sourceItemId||type.sourceItemId===sourceItemId||type.generatorKey===generatorKey));}
  function resolves(type){return Boolean(type&&type.id===sourceItemId&&type.sourceItemId===sourceItemId&&type.generatorKey===generatorKey&&type.sourceVerified===true&&type.reviewLocked===false);}
  function generate(type,user,difficulty,seed,variant=0){if(!belongs(type)||!resolves(type)||Number(variant)!==0)return null;return build();}
  function install(target){const bank=target?.HSE_GENERATORS;if(!bank||typeof bank.generatorKey!=="function"||typeof bank.generate!=="function")return false;if(bank.__source52P51M2Installed)return true;const oldKey=bank.generatorKey.bind(bank),oldGenerate=bank.generate.bind(bank);bank.generatorKey=type=>belongs(type)?(resolves(type)?generatorKey:""):oldKey(type);bank.generate=(type,user,difficulty,seed,variant=0)=>belongs(type)?generate(type,user,difficulty,seed,variant):oldGenerate(type,user,difficulty,seed,variant);if(Array.isArray(bank.names)&&!bank.names.includes(generatorKey))bank.names.push(generatorKey);Object.defineProperty(bank,"__source52P51M2Installed",{value:true});return true;}
  return Object.freeze({sourceItemId,generatorKey,sourceFaces,verifyModel,netSvg,build,generate,belongs,resolves,install});
});
