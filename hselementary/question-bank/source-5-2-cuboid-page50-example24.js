(function(root,factory){"use strict";const api=factory();if(typeof module==="object"&&module.exports)module.exports=api;root.HSE_SOURCE52_P50_E24=api;api.install(root);})(typeof window!=="undefined"?window:globalThis,function(){
  "use strict";
  const sourceItemId="5-2-u5-e2-example-2-4",generatorKey="source52CuboidNetPerimeterExtremaPage50Example24";
  const faces=Object.freeze({
    minimum:[[-3,0,0,4,"3×4"],[0,0,6,4,"6×4"],[6,0,9,4,"3×4"],[0,-3,6,0,"6×3"],[0,4,6,7,"6×3"],[0,7,6,11,"6×4"]],
    maximum:[[0,0,6,4,"6×4"],[6,0,9,4,"3×4"],[9,0,15,4,"6×4"],[6,-6,9,0,"3×6"],[6,4,9,10,"3×6"],[6,10,9,14,"3×4"]]
  });
  function measureLayout(layout){
    let seams=0,edges=0;const links=new Map(layout.map((_,i)=>[i,new Set()]));
    for(let i=0;i<layout.length;i++)for(let j=i+1;j<layout.length;j++){
      const [ax,ay,bx,by,label]=layout[i],[cx,cy,dx,dy,other]=layout[j];
      if(Math.min(bx,dx)-Math.max(ax,cx)>1e-8&&Math.min(by,dy)-Math.max(ay,cy)>1e-8)throw new Error("예시 전개도 면이 겹칩니다.");
      const vertical=(Math.abs(bx-cx)<1e-8||Math.abs(dx-ax)<1e-8)?Math.max(0,Math.min(by,dy)-Math.max(ay,cy)):0;
      const horizontal=(Math.abs(by-cy)<1e-8||Math.abs(dy-ay)<1e-8)?Math.max(0,Math.min(bx,dx)-Math.max(ax,cx)):0;
      const shared=vertical||horizontal;
      if(shared>0){edges++;seams+=shared;links.get(i).add(j);links.get(j).add(i);}
    }
    const seen=new Set([0]),queue=[0];while(queue.length){const i=queue.shift();for(const j of links.get(i))if(!seen.has(j)){seen.add(j);queue.push(j);}}
    if(edges!==5||seen.size!==6)throw new Error("예시 전개도는 여섯 면이 접힘 변 다섯 개로 연결되어야 합니다.");
    for(const [x0,y0,x1,y1,label] of layout){const dims=[x1-x0,y1-y0].sort((a,b)=>a-b).join("×");if(dims!==label.split("×").map(Number).sort((a,b)=>a-b).join("×"))throw new Error("전개도 면 치수 표시가 맞지 않습니다.");}
    return seams;
  }
  function verifyModel(){
    const dimensions=[6,4,3],facePerimeterSum=2*(2*(6+4)+2*(6+3)+2*(4+3));
    const minimumSeamSum=measureLayout(faces.minimum),maximumSeamSum=measureLayout(faces.maximum);
    const minimumPerimeter=facePerimeterSum-2*minimumSeamSum,maximumPerimeter=facePerimeterSum-2*maximumSeamSum;
    if(facePerimeterSum!==104||minimumSeamSum!==26||maximumSeamSum!==17||minimumPerimeter!==52||maximumPerimeter!==70)throw new Error("원문 직육면체 전개도의 둘레 극값이 검증되지 않았습니다.");
    return Object.freeze({dimensions,facePerimeterSum,minimumSeamSum,maximumSeamSum,minimumPerimeter,maximumPerimeter});
  }
  function cubeDiagram(){return `<svg class="geometry-diagram source52-p50e24-cuboid" viewBox="0 0 360 250" role="img" aria-label="가로 6cm, 세로 3cm, 높이 4cm인 직육면체"><path d="M64 80 224 80 286 38 126 38Z M224 80 286 38 286 158 224 200Z M64 80 224 80 224 200 64 200Z" class="source52-p50e24-solid"/><path d="M64 200 126 158 M126 38 126 158 286 158" class="source52-p50e24-hidden"/><text x="206" y="26" text-anchor="middle">6cm</text><text x="307" y="109" transform="rotate(90 307 109)">4cm</text><text x="256" y="216" text-anchor="middle" transform="rotate(-34 256 216)">3cm</text></svg>`;}
  function netSvg(kind){
    const scale=15,area=kind==="minimum"?faces.minimum:faces.maximum,coords=area.map(([x0,y0,x1,y1,label])=>({x:x0,y:y0,w:x1-x0,h:y1-y0,label}));
    const minX=Math.min(...coords.map(f=>f.x)),maxX=Math.max(...coords.map(f=>f.x+f.w)),minY=Math.min(...coords.map(f=>f.y)),maxY=Math.max(...coords.map(f=>f.y+f.h));
    const pad=20,x0=pad-minX*scale,y0=pad-minY*scale,width=(maxX-minX)*scale+2*pad,height=(maxY-minY)*scale+2*pad;
    const rects=coords.map(f=>`<g><rect x="${x0+f.x*scale}" y="${y0+f.y*scale}" width="${f.w*scale}" height="${f.h*scale}"/><text x="${x0+(f.x+f.w/2)*scale}" y="${y0+(f.y+f.h/2)*scale}">${f.label}</text></g>`).join("");
    return `<svg class="source52-p50e24-net" viewBox="0 0 ${width} ${height}" role="img" aria-label="${kind==="minimum"?"둘레가 가장 짧은":"둘레가 가장 긴"} 직육면체 전개도 예"><rect class="source52-p50e24-bg" x="0" y="0" width="${width}" height="${height}"/>${rects}</svg>`;
  }
  function build(){
    const m=verifyModel();
    const prompt=`<div class="source52-p50e24-question" data-source-item-id="${sourceItemId}" data-pool-index="0"><p>다음 직육면체의 전개도를 그렸을 때, 전개도의 둘레의 길이가 가장 길 때와 가장 짧을 때의 길이를 각각 구하세요.</p>${cubeDiagram()}</div>`;
    const solution=`<div class="source52-p50e24-solution" data-source-answer="${sourceItemId}"><p>직육면체의 여섯 면은 6×4cm 두 장, 6×3cm 두 장, 4×3cm 두 장입니다. 여섯 면을 따로 놓았을 때 둘레의 합은 2×[2(6+4)+2(6+3)+2(4+3)]=104cm입니다.</p><p>전개도에서 서로 붙인 변은 안쪽에 놓여 바깥 둘레에 포함되지 않습니다. 붙인 변 길이의 합을 Σ라 하면 전개도 둘레는 104−2Σ입니다. 직육면체에서 같은 방향의 모서리 4개는 네 옆면을 한 바퀴 연결합니다. 전개도에서 이 4개를 모두 붙여 두면 옆면이 고리처럼 닫혀 평평하게 펼칠 수 없으므로, 같은 방향의 연결 변은 최대 3개입니다. 따라서 Σ는 적어도 3×3+2×4=17cm이고, 많아도 3×6+2×4=26cm입니다.</p><p>제시한 두 전개도는 각각 극값을 만드는 예입니다. 가장 짧은 둘레는 104−2×26=<strong>52cm</strong>, 가장 긴 둘레는 104−2×17=<strong>70cm</strong>입니다.</p><p class="source52-p50e24-answer">답: 가장 길 때 70cm, 가장 짧을 때 52cm</p></div>`;
    return Object.freeze({prompt,answer:"가장 길 때 70cm, 가장 짧을 때 52cm",solution,answerVisual:`<div class="source52-p50e24-witness"><figure><figcaption>가장 짧은 둘레 · Σ=26cm · 면 치수 cm</figcaption>${netSvg("minimum")}</figure><figure><figcaption>가장 긴 둘레 · Σ=17cm · 면 치수 cm</figcaption>${netSvg("maximum")}</figure></div>`,sourceItemId,generator:generatorKey,variant:0,variantIndex:0,poolIndex:0,verifiedPoolIndex:0,verifiedVariantId:`${sourceItemId}:all-net-perimeter-extrema`,generationMode:"fixed-verified-pool",verifiedVariantCount:1,verifiedVariantTarget:1,difficultyOffset:0,difficultyLevel:2,difficultyRank:2,sourceStructurePreserved:true,answerVisualRequired:true,answerVisualStatus:"verified-reconstruction",sourcePdfPage:46,sourcePrintedPage:50,publisherKeyVerified:false,publisherAnswerVerified:false,handwrittenAnswerVerified:false,answerVerification:"spanning-tree-edge-bounds-and-net-witnesses",questionModel:{dimensions:m.dimensions},answerModel:{facePerimeterSum:m.facePerimeterSum,seamLengthSumExtrema:[m.maximumSeamSum,m.minimumSeamSum],perimeterExtrema:[m.maximumPerimeter,m.minimumPerimeter]}});
  }
  function belongs(type){return Boolean(type&&(type.id===sourceItemId||type.sourceItemId===sourceItemId||type.generatorKey===generatorKey));}
  function resolves(type){return Boolean(type&&type.id===sourceItemId&&type.sourceItemId===sourceItemId&&type.generatorKey===generatorKey&&type.sourceVerified===true&&type.reviewLocked===false);}
  function generate(type,user,difficulty,seed,variant=0){if(!belongs(type)||!resolves(type)||variant!==0)return null;return build();}
  function install(target){const bank=target?.HSE_GENERATORS;if(!bank||typeof bank.generatorKey!=="function"||typeof bank.generate!=="function")return false;if(bank.__source52U5P50E24Installed)return true;const oldKey=bank.generatorKey.bind(bank),oldGenerate=bank.generate.bind(bank);bank.generatorKey=type=>belongs(type)?(resolves(type)?generatorKey:""):oldKey(type);bank.generate=(type,user,difficulty,seed,variant=0)=>belongs(type)?generate(type,user,difficulty,seed,variant):oldGenerate(type,user,difficulty,seed,variant);if(Array.isArray(bank.names)&&!bank.names.includes(generatorKey))bank.names.push(generatorKey);Object.defineProperty(bank,"__source52U5P50E24Installed",{value:true});return true;}
  return Object.freeze({sourceItemId,generatorKey,faces,verifyModel,cubeDiagram,netSvg,build,generate,belongs,resolves,install});
});
