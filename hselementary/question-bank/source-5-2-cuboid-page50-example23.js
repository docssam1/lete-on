(function(root,factory){"use strict";const api=factory();if(typeof module==="object"&&module.exports)module.exports=api;root.HSE_SOURCE52_P50_E23=api;api.install(root);})(typeof window!=="undefined"?window:globalThis,function(){
  "use strict";
  const sourceItemId="5-2-u5-e2-example-2-3",generatorKey="source52CubeNetCandidateFacePage50Example23";
  const base=Object.freeze([[2,1],[0,2],[1,2],[2,2],[2,3]]);
  const candidates=Object.freeze({1:[2,0],2:[1,1],3:[0,1],4:[-1,2],5:[0,3],6:[1,3],7:[2,4],8:[3,3],9:[3,2],10:[3,1]});
  const valid=Object.freeze([4,8,9,10]);
  function verifyModel(){
    const vec=(x,y,z)=>[x,y,z],same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
    function classify(cells){
      const set=new Set(cells.map(([x,y])=>`${x},${y}`));let edges=0;
      for(const [x,y] of cells){if(set.has(`${x+1},${y}`))edges++;if(set.has(`${x},${y+1}`))edges++;}
      if(edges!==5)return "overlap-cycle";
      const root=[...cells].sort((a,b)=>a[1]-b[1]||a[0]-b[0])[0],frames=new Map([[`${root[0]},${root[1]}`,[vec(1,0,0),vec(0,1,0),vec(0,0,1)]]]),queue=[root];
      while(queue.length){const [x,y]=queue.shift(),[u,v,n]=frames.get(`${x},${y}`),neighbors=[
        [1,0,[n.map(a=>-a),v,u]],[-1,0,[n,v,u.map(a=>-a)]],
        [0,1,[u,n.map(a=>-a),v]],[0,-1,[u,n,v.map(a=>-a)]]
      ];
      for(const [dx,dy,frame] of neighbors){const key=`${x+dx},${y+dy}`;if(!set.has(key))continue;if(frames.has(key)){if(!same(frames.get(key),frame))return "overlap-cycle";}else{frames.set(key,frame);queue.push([x+dx,y+dy]);}}
      }
      const normals=new Set([...frames.values()].map(frame=>JSON.stringify(frame[2])));
      return normals.size===6?"valid":"duplicate-face";
    }
    const checks=Object.fromEntries(Object.entries(candidates).map(([n,pos])=>[n,classify([...base,pos])]));
    const verified=Object.keys(checks).filter(n=>checks[n]==="valid").map(Number);
    if(verified.join(",")!==valid.join(","))throw new Error(`원문 정육면체 전개도 후보가 유일하게 판정되지 않습니다: ${verified}`);
    return Object.freeze({base,candidates,checks,valid,validCount:valid.length});
  }
  function diagram(){
    const {side=64,x0=105,y0=55}=Object.create(null),m=verifyModel();
    const colored=m.base.map(([cx,cy])=>`<g class="source52-p50e23-cell source52-p50e23-base"><rect x="${x0+cx*side}" y="${y0+cy*side}" width="${side}" height="${side}"/><text x="${x0+(cx+.5)*side}" y="${y0+(cy+.5)*side}">색칠</text></g>`).join("");
    const labels=Object.entries(m.candidates).map(([n,[cx,cy]])=>`<g class="source52-p50e23-cell"><rect x="${x0+cx*side}" y="${y0+cy*side}" width="${side}" height="${side}"/><text x="${x0+(cx+.5)*side}" y="${y0+(cy+.5)*side}">${n}</text></g>`).join("");
    const seamPath=`M${x0+side} ${y0+2*side}v${side} M${x0+2*side} ${y0+2*side}v${side} M${x0+2*side} ${y0+2*side}h${side} M${x0+2*side} ${y0+3*side}h${side}`;
    const seams=`<path class="source52-p50e23-fold-underlay" d="${seamPath}"/><path class="source52-p50e23-fold" d="${seamPath}"/>`;
    return `<svg class="geometry-diagram source52-p50e23-diagram" viewBox="0 0 500 420" role="img" aria-label="색칠한 다섯 면과 번호 1부터 10까지 중 하나를 더해 정육면체 전개도가 되는지 확인하는 그림"><text class="source52-p50e23-caption" x="250" y="28" text-anchor="middle">번호 면 하나를 더해 접기</text>${colored}${labels}${seams}</svg>`;
  }
  function build(){
    const m=verifyModel();
    const prompt=`<div class="source52-p50e23-question" data-source-item-id="${sourceItemId}" data-pool-index="0"><p>다음 그림에서 색칠한 부분과 ①부터 ⑩까지의 면 중 하나를 골라 정육면체의 전개도를 만들려고 합니다. 고를 수 있는 면을 모두 쓰세요.</p>${diagram()}</div>`;
    const outcomes=Object.entries(m.checks).map(([n,result])=>`<tr><th>${n}</th><td>${result==="valid"?"가능":result==="overlap-cycle"?"면이 겹치는 고리가 생김":"접었을 때 두 면이 같은 방향으로 겹침"}</td></tr>`).join("");
    const solution=`<div class="source52-p50e23-solution" data-source-answer="${sourceItemId}"><p>색칠한 다섯 칸에 후보 면을 하나씩 붙여 여섯 칸의 접힘 방향을 확인합니다. 번호가 있는 면의 개수만 세지 않고, 접은 뒤 서로 다른 여섯 방향을 차지하는지도 살펴봅니다.</p><table class="source52-p50e23-table"><thead><tr><th>번호</th><th>접었을 때</th></tr></thead><tbody>${outcomes}</tbody></table><p>2와 6은 이미 연결된 면 사이에 고리가 생겨 정육면체 전개도가 되지 않습니다. 1, 3, 5, 7은 접었을 때 두 면이 같은 방향에 놓입니다. 4, 8, 9, 10은 여섯 면이 서로 다른 방향을 차지해 모두 가능합니다.</p><p class="source52-p50e23-answer">답: 4, 8, 9, 10</p></div>`;
    return Object.freeze({prompt,answer:"4, 8, 9, 10",solution,answerVisual:diagram(),sourceItemId,generator:generatorKey,variant:0,variantIndex:0,poolIndex:0,verifiedPoolIndex:0,verifiedVariantId:`${sourceItemId}:candidate-face-folds`,generationMode:"fixed-verified-pool",verifiedVariantCount:1,verifiedVariantTarget:1,difficultyOffset:0,difficultyLevel:2,difficultyRank:2,sourceStructurePreserved:true,answerVisualRequired:true,answerVisualStatus:"verified-reconstruction",sourcePdfPage:46,sourcePrintedPage:50,publisherKeyVerified:false,publisherAnswerVerified:false,handwrittenAnswerVerified:false,answerVerification:"all-ten-face-candidates-fold-orientation-and-overlap-check",questionModel:{shadedFaces:5,numberedCandidates:10},answerModel:{validCandidates:m.valid,invalidCandidates:Object.keys(m.checks).map(Number).filter(n=>!m.valid.includes(n))}});
  }
  function belongs(type){return Boolean(type&&(type.id===sourceItemId||type.sourceItemId===sourceItemId||type.generatorKey===generatorKey));}
  function resolves(type){return Boolean(type&&type.id===sourceItemId&&type.sourceItemId===sourceItemId&&type.generatorKey===generatorKey&&type.sourceVerified===true&&type.reviewLocked===false);}
  function generate(type,user,difficulty,seed,variant=0){if(!belongs(type)||!resolves(type)||variant!==0)return null;return build();}
  function install(target){const bank=target?.HSE_GENERATORS;if(!bank||typeof bank.generatorKey!=="function"||typeof bank.generate!=="function")return false;if(bank.__source52U5P50E23Installed)return true;const oldKey=bank.generatorKey.bind(bank),oldGenerate=bank.generate.bind(bank);bank.generatorKey=type=>belongs(type)?(resolves(type)?generatorKey:""):oldKey(type);bank.generate=(type,user,difficulty,seed,variant=0)=>belongs(type)?generate(type,user,difficulty,seed,variant):oldGenerate(type,user,difficulty,seed,variant);if(Array.isArray(bank.names)&&!bank.names.includes(generatorKey))bank.names.push(generatorKey);Object.defineProperty(bank,"__source52U5P50E23Installed",{value:true});return true;}
  return Object.freeze({sourceItemId,generatorKey,base,candidates,verifyModel,diagram,build,generate,belongs,resolves,install});
});
