(function(root,factory){"use strict";const api=factory();if(typeof module==="object"&&module.exports)module.exports=api;root.HSE_SOURCE52_P51_M4=api;api.install(root);})(typeof window!=="undefined"?window:globalThis,function(){
  "use strict";
  const sourceItemId="5-2-u5-e2-mission-4",generatorKey="source52TwoCubeNetsOverlapPage51Mission4";
  const nets=Object.freeze([
    Object.freeze({id:"first",base:"나",faces:Object.freeze([{id:"다",x:-1,y:0},{id:"나",x:0,y:0},{id:"가",x:0,y:1},{id:"라",x:-1,y:-1},{id:"마",x:-2,y:-1},{id:"바",x:-2,y:-2}])}),
    Object.freeze({id:"second",base:"사",faces:Object.freeze([{id:"사",x:1,y:0},{id:"아",x:2,y:0},{id:"자",x:2,y:-1},{id:"차",x:2,y:-2},{id:"카",x:3,y:-2},{id:"타",x:2,y:-3}])})
  ]);
  const V=Object.freeze({E:Object.freeze([1,0,0]),W:Object.freeze([-1,0,0]),N:Object.freeze([0,1,0]),S:Object.freeze([0,-1,0]),B:Object.freeze([0,0,-1])});
  function neg(a){return a.map(x=>-x)}
  function foldNet(net){const byPosition=new Map(net.faces.map(f=>[`${f.x},${f.y}`,f.id])),orientations=new Map([[net.base,{u:V.E,v:V.N,n:V.B}]]),queue=[net.base],moves=[[1,0,"E"],[-1,0,"W"],[0,1,"N"],[0,-1,"S"]];while(queue.length){const faceId=queue.shift(),face=net.faces.find(f=>f.id===faceId),o=orientations.get(faceId);for(const[dx,dy,d]of moves){const next=byPosition.get(`${face.x+dx},${face.y+dy}`);if(!next||orientations.has(next))continue;let n;if(d==="E")n={u:neg(o.n),v:o.v,n:o.u};else if(d==="W")n={u:o.n,v:o.v,n:neg(o.u)};else if(d==="N")n={u:o.u,v:neg(o.n),n:o.v};else n={u:o.u,v:o.n,n:neg(o.v)};orientations.set(next,n);queue.push(next);}}return orientations;}
  function verifyModel(){const first=foldNet(nets[0]),second=foldNet(nets[1]);for(let i=0;i<nets.length;i++){if(nets[i].faces.length!==6)throw new Error("각 전개도는 여섯 면이어야 합니다.");const normals=new Set([...((i===0?first:second).values())].map(o=>o.n.join(",")));if(normals.size!==6)throw new Error("전개도 접힘 결과에서 여섯 면 방향이 겹칩니다.");}
    const shared={first:findNormal(first,V.E),second:findNormal(second,V.W)};if(first.get(nets[0].base).n.join(",")!==V.B.join(",")||second.get(nets[1].base).n.join(",")!==V.B.join(",")||shared.first!=="바"||shared.second!=="차")throw new Error("나·사 바닥 조건의 두 정육면체 겹침 면 검증 실패");
    return Object.freeze({sameSizeCubes:2,facesPerNet:Object.freeze([6,6]),bottomFaces:Object.freeze(["나","사"]),firstNetSideFacingSecond:shared.first,secondNetSideFacingFirst:shared.second,overlap:Object.freeze([shared.first,shared.second])});}
  function findNormal(orientations,wanted){return [...orientations].find(([,o])=>o.n.join(",")===wanted.join(","))?.[0]||null;}
  function netSvg(){
    const all=nets.flatMap(n=>n.faces.map(f=>({...f,netId:n.id}))),s=62,px=x=>38+(x+2)*s,py=y=>48+(3-y)*s;
    const occupied=new Map(all.map(f=>[`${f.x},${f.y}`,f]));
    const faces=all.map(f=>`<g class="face ${f.netId}"><rect x="${px(f.x)}" y="${py(f.y+1)}" width="${s}" height="${s}"/><text x="${px(f.x+.5)}" y="${py(f.y+.5)}">${f.id}</text></g>`).join("");
    const edges=[];
    for(const f of all){
      for(const [dx,dy,x1,y1,x2,y2] of [[-1,0,f.x,f.y,f.x,f.y+1],[1,0,f.x+1,f.y,f.x+1,f.y+1],[0,-1,f.x,f.y,f.x+1,f.y],[0,1,f.x,f.y+1,f.x+1,f.y+1]]){
        const neighbor=occupied.get(`${f.x+dx},${f.y+dy}`);
        if(neighbor&&(dx<0||dy<0))continue;
        const kind=!neighbor?"boundary":neighbor.netId===f.netId?"fold":"join";
        edges.push(`<line class="${kind}" x1="${px(x1)}" y1="${py(y1)}" x2="${px(x2)}" y2="${py(y2)}"/>`);
      }
    }
    return `<svg class="source52-p51m4-net" viewBox="0 0 448 460" role="img" aria-label="두 정육면체 전개도의 재현. 첫째 전개도의 나와 둘째 전개도의 사가 바닥면이고, 두 전개도는 나와 사의 변에서 붙어 있습니다.">${faces}<g class="net-edges">${edges.join("")}</g></svg>`;
  }
  function build(){const model=verifyModel();const prompt=`<div class="source52-p51m4-question" data-source-item-id="${sourceItemId}" data-pool-index="0"><p>다음 전개도는 크기가 똑같은 2개의 정육면체의 전개도를 붙인 모양이다. 면 나와 면 사가 바닥면에 닿도록 전개도를 접었을 때, 두 정육면체가 서로 겹쳐지는 면은 무엇과 무엇인가?</p><div class="source52-p51m4-figure">${netSvg()}</div></div>`;const solution=`<div class="source52-p51m4-solution" data-source-answer="${sourceItemId}"><p>바닥면 나와 사가 맞닿은 변의 양쪽에 있으므로, 두 정육면체에서 이 변 위로 세워지는 면이 서로 겹칩니다.</p><p>첫째 전개도를 접으면 면 다와 면 바는 서로 마주 봅니다. 면 다가 접힌 반대쪽, 즉 면 사가 있는 쪽에 면 바가 세워집니다.</p><p>둘째 전개도를 접으면 면 아와 면 차는 서로 마주 봅니다. 면 아가 접힌 반대쪽, 즉 면 나가 있는 쪽에 면 차가 세워집니다. 따라서 첫째 정육면체의 바와 둘째 정육면체의 차가 서로 겹칩니다.</p><p class="source52-p51m4-answer">답: 바와 차</p></div>`;return Object.freeze({prompt,answer:"바와 차",solution,answerVisualRequired:false,answerVisualStatus:"not-required",sourceItemId,generator:generatorKey,variant:0,variantIndex:0,poolIndex:0,verifiedPoolIndex:0,verifiedVariantId:`${sourceItemId}:bottom-na-sa-overlap-ba-cha`,generationMode:"fixed-verified-pool",verifiedVariantCount:1,verifiedVariantTarget:1,difficultyOffset:0,difficultyLevel:2,difficultyRank:2,sourceStructurePreserved:true,sourcePdfPage:47,sourcePrintedPage:51,publisherKeyVerified:false,publisherAnswerVerified:false,handwrittenAnswerVerified:false,answerVerification:"independent-cube-net-fold-orientation-propagation",questionModel:model,answerModel:model});}
  function belongs(type){return Boolean(type&&(type.id===sourceItemId||type.sourceItemId===sourceItemId||type.generatorKey===generatorKey));}
  function resolves(type){return Boolean(type&&type.id===sourceItemId&&type.sourceItemId===sourceItemId&&type.generatorKey===generatorKey&&type.sourceVerified===true&&type.reviewLocked===false);}
  function generate(type,user,difficulty,seed,variant=0){if(!belongs(type)||!resolves(type)||Number(variant)!==0)return null;return build();}
  function install(target){const bank=target?.HSE_GENERATORS;if(!bank||typeof bank.generatorKey!=="function"||typeof bank.generate!=="function")return false;if(bank.__source52P51M4Installed)return true;const oldKey=bank.generatorKey.bind(bank),oldGenerate=bank.generate.bind(bank);bank.generatorKey=type=>belongs(type)?(resolves(type)?generatorKey:""):oldKey(type);bank.generate=(type,user,difficulty,seed,variant=0)=>belongs(type)?generate(type,user,difficulty,seed,variant):oldGenerate(type,user,difficulty,seed,variant);if(Array.isArray(bank.names)&&!bank.names.includes(generatorKey))bank.names.push(generatorKey);Object.defineProperty(bank,"__source52P51M4Installed",{value:true});return true;}
  return Object.freeze({sourceItemId,generatorKey,nets,foldNet,verifyModel,netSvg,build,generate,belongs,resolves,install});
});
