(function(root,factory){"use strict";const api=factory();if(typeof module==="object"&&module.exports)module.exports=api;root.HSE_SOURCE52_P51_M1=api;api.install(root);})(typeof window!=="undefined"?window:globalThis,function(){
  "use strict";
  const sourceItemId="5-2-u5-e2-mission-1",generatorKey="source52CuboidNetPaperPerimeterPage51Mission1";
  const faces=Object.freeze([
    {x:0,y:2,w:6,h:4,label:"6×4"},
    {x:6,y:2,w:2,h:4,label:"2×4"},
    {x:8,y:2,w:6,h:4,label:"6×4"},
    {x:8,y:0,w:6,h:2,label:"6×2"},
    {x:8,y:6,w:6,h:2,label:"6×2"},
    {x:14,y:6,w:4,h:2,label:"4×2"}
  ]);
  function verifyModel(){
    const facePerimeterSum=2*(2*(6+4)+2*(2+4)+2*(6+4)+2*(2+4)+2*(6+2)+2*(6+2))/2;
    const seams=[];
    for(let i=0;i<faces.length;i++)for(let j=i+1;j<faces.length;j++){
      const a=faces[i],b=faces[j];
      if(Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x)>0&&Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y)>0)throw new Error("원문 전개도 면이 겹칩니다.");
      const vertical=(a.x+a.w===b.x||b.x+b.w===a.x)?Math.max(0,Math.min(a.y+a.h,b.y+b.h)-Math.max(a.y,b.y)):0;
      const horizontal=(a.y+a.h===b.y||b.y+b.h===a.y)?Math.max(0,Math.min(a.x+a.w,b.x+b.w)-Math.max(a.x,b.x)):0;
      if(vertical||horizontal)seams.push(vertical||horizontal);
    }
    const sorted=seams.slice().sort((a,b)=>a-b);
    const seamSum=seams.reduce((sum,n)=>sum+n,0),perimeter=facePerimeterSum-2*seamSum;
    if(facePerimeterSum!==96||sorted.join(",")!=="2,4,4,6,6"||seamSum!==22||perimeter!==52)throw new Error("p.51 Mission 1 원문 전개도 둘레 검증에 실패했습니다.");
    return Object.freeze({dimensions:[6,2,4],faceCount:faces.length,facePerimeterSum,seamsCm:Object.freeze(sorted),seamSum,perimeterCm:perimeter});
  }
  function cubeSvg(){return `<svg class="source52-p51m1-cube" viewBox="0 0 360 240" role="img" aria-label="가로 6cm, 세로 2cm, 높이 4cm인 직육면체"><path d="M55 72h170v112H55z M225 72l65-43v112l-65 43z M55 72l65-43h170l-65 43" class="solid"/><path d="M55 184l65-43 M120 29v112h170" class="hidden"/><text x="140" y="211">6cm</text><text x="318" y="96">4cm</text><text x="67" y="38">2cm</text></svg>`;}
  function netSvg(showDimensions=false){
    const scale=20,pad=18;
    const edgeMap=new Map();
    const add=(x1,y1,x2,y2)=>{const a=`${x1},${y1}`,b=`${x2},${y2}`,k=[a,b].sort().join("|");edgeMap.set(k,(edgeMap.get(k)||0)+1);};
    for(const f of faces){const x0=f.x,y0=f.y,x1=f.x+f.w,y1=f.y+f.h;for(let x=x0;x<x1;x++){add(x,y0,x+1,y0);add(x,y1,x+1,y1);}for(let y=y0;y<y1;y++){add(x0,y,x0,y+1);add(x1,y,x1,y+1);}}
    const edgeLines=[...edgeMap].map(([key,count])=>{const [a,b]=key.split("|");const [x1,y1]=a.split(",").map(Number),[x2,y2]=b.split(",").map(Number);return `<line class="${count===2?"fold":"cut"}" x1="${pad+x1*scale}" y1="${pad+y1*scale}" x2="${pad+x2*scale}" y2="${pad+y2*scale}"/>`;}).join("");
    const rects=showDimensions?faces.map(f=>`<text x="${pad+(f.x+f.w/2)*scale}" y="${pad+(f.y+f.h/2)*scale}">${f.label}</text>`).join(""):"";
    return `<svg class="source52-p51m1-net" viewBox="0 0 396 196" role="img" aria-label="직육면체 전개도: 접힘선 다섯 곳으로 여섯 면이 연결된 원문 배치">${edgeLines}${rects}</svg>`;
  }
  function build(){
    const model=verifyModel();
    const prompt=`<div class="source52-p51m1-question" data-source-item-id="${sourceItemId}" data-pool-index="0"><p>가로, 세로, 높이가 각각 6cm, 2cm, 4cm인 직육면체를 아래 전개도와 같은 형태로 직사각형 모양의 도화지에 그리려고 합니다. 그려진 전개도의 둘레는 몇 cm인가요?</p><div class="source52-p51m1-figures">${cubeSvg()}${netSvg()}</div></div>`;
    const solution=`<div class="source52-p51m1-solution" data-source-answer="${sourceItemId}"><p>여섯 면의 둘레를 각각 더하면 96cm입니다.</p><p>전개도에서 맞닿은 다섯 접힘선의 길이는 4cm, 4cm, 6cm, 6cm, 2cm입니다. 각 접힘선은 두 면의 둘레에 한 번씩 세어졌지만 전개도의 바깥 둘레에는 들어가지 않으므로, 각각 두 번씩 빼야 합니다.</p><p>96−2×(4+4+6+6+2)=96−44=<strong>52(cm)</strong></p><p class="source52-p51m1-answer">답: 52cm</p></div>`;
    return Object.freeze({prompt,answer:"52cm",solution,answerVisualRequired:true,answerVisual:`<div class="source52-p51m1-solution-net">${netSvg(true)}</div>`,sourceItemId,generator:generatorKey,variant:0,variantIndex:0,poolIndex:0,verifiedPoolIndex:0,verifiedVariantId:`${sourceItemId}:source-net-perimeter-52cm`,generationMode:"fixed-verified-pool",verifiedVariantCount:1,verifiedVariantTarget:1,difficultyOffset:0,difficultyLevel:2,difficultyRank:2,sourceStructurePreserved:true,answerVisualStatus:"verified-reconstruction",sourcePdfPage:47,sourcePrintedPage:51,publisherKeyVerified:false,publisherAnswerVerified:false,handwrittenAnswerVerified:false,answerVerification:"reconstructed-source-net-five-seam-perimeter",questionModel:model,answerModel:model});
  }
  function belongs(type){return Boolean(type&&(type.id===sourceItemId||type.sourceItemId===sourceItemId||type.generatorKey===generatorKey));}
  function resolves(type){return Boolean(type&&type.id==="5-2-u5-e2-mission-1"&&type.sourceItemId===sourceItemId&&type.generatorKey===generatorKey&&type.sourceVerified===true&&type.reviewLocked===false);}
  function generate(type,user,difficulty,seed,variant=0){if(!belongs(type)||!resolves(type)||Number(variant)!==0)return null;return build();}
  function install(target){const bank=target?.HSE_GENERATORS;if(!bank||typeof bank.generatorKey!=="function"||typeof bank.generate!=="function")return false;if(bank.__source52P51M1Installed)return true;const oldKey=bank.generatorKey.bind(bank),oldGenerate=bank.generate.bind(bank);bank.generatorKey=type=>belongs(type)?(resolves(type)?generatorKey:""):oldKey(type);bank.generate=(type,user,difficulty,seed,variant=0)=>belongs(type)?generate(type,user,difficulty,seed,variant):oldGenerate(type,user,difficulty,seed,variant);if(Array.isArray(bank.names)&&!bank.names.includes(generatorKey))bank.names.push(generatorKey);Object.defineProperty(bank,"__source52P51M1Installed",{value:true});return true;}
  return Object.freeze({sourceItemId,generatorKey,faces,verifyModel,cubeSvg,netSvg,build,generate,belongs,resolves,install});
});
