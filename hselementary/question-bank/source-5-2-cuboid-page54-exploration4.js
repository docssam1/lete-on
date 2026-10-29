(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.HSE_SOURCE_52_CUBOID_PAGE54_E4 = api;
  api.install(root);
})(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";
  const sourceItemId="5-2-u5-e4-exploration-1", generatorKey="source52CuboidRollPage54Exploration4";
  const definition=Object.freeze({sourceItemId,generatorKey,sourcePdfPage:50,sourcePrintedPage:54});
  const net=Object.freeze({"0,0":2,"1,0":5,"1,1":4,"2,1":3,"2,2":1,"3,2":6});
  const moves=Object.freeze(["R","R","R","F","L","F","R"]);
  const pathCells=Object.freeze([[1,0],[2,0],[3,0],[3,1],[2,1],[2,2],[3,2]]);
  const initial=Object.freeze({"+x":3,"-x":2,"+y":5,"-y":1,"+z":4,"-z":6});
  const rolls=Object.freeze({
    R:{"+x":"-z","+z":"+x","-x":"+z","-z":"-x","+y":"+y","-y":"-y"},
    F:{"-y":"-z","+z":"-y","+y":"+z","-z":"+y","+x":"+x","-x":"-x"},
    L:{"-x":"-z","+z":"-x","+x":"+z","-z":"+x","+y":"+y","-y":"-y"}
  });
  const negate=v=>v.map(n=>-n), key=(x,y)=>`${x},${y}`, vectors={"+x":[1,0,0],"-x":[-1,0,0],"+y":[0,1,0],"-y":[0,-1,0],"+z":[0,0,1],"-z":[0,0,-1]};
  function foldNet(){
    const root="1,1", basis=new Map([[root,[[0,0,1],[1,0,0],[0,1,0]]]]), queue=[root];
    while(queue.length){const p=queue.shift(),[x,y]=p.split(",").map(Number),[n,u,v]=basis.get(p);const transitions=[[[1,0],[u,negate(n),v]],[[-1,0],[negate(u),n,v]],[[0,1],[v,u,negate(n)]],[[0,-1],[negate(v),u,n]]];
      for(const [[dx,dy],state] of transitions){const q=key(x+dx,y+dy);if(net[q]!==undefined&&!basis.has(q)){basis.set(q,state);queue.push(q);}}
    }
    if(basis.size!==6)throw new Error("주사위 전개도 여섯 면이 모두 연결되지 않았습니다.");
    const byNormal=new Map([...basis].map(([p,[n]])=>[n.join(","),net[p]]));
    const pairs=[];for(const v of [[1,0,0],[0,1,0],[0,0,1]]){const a=byNormal.get(v.join(",")),b=byNormal.get(negate(v).join(","));pairs.push([a,b].sort((x,y)=>x-y));}
    return pairs.sort((a,b)=>a[0]-b[0]);
  }
  function simulate(){let state={...initial};const bottoms=[];for(const move of moves){const mapping=rolls[move];state=Object.fromEntries(Object.entries(state).map(([direction,value])=>[mapping[direction],value]));bottoms.push(state["-z"]);}return Object.freeze({oppositePairs:foldNet(),moves,bottoms:Object.freeze(bottoms),sum:bottoms.reduce((a,b)=>a+b,0)});}
  function verifyModel(){const result=simulate();if(JSON.stringify(result.oppositePairs)!==JSON.stringify([[1,5],[2,3],[4,6]]))throw new Error("전개도에서 맞은편 면을 확인하지 못했습니다.");if(JSON.stringify(result.bottoms)!==JSON.stringify([3,4,2,1,4,3,1])||result.sum!==18)throw new Error("원문 이동 경로의 바닥 눈 합이 맞지 않습니다.");if(pathCells.length!==7||moves.length!==pathCells.length)throw new Error("원문 바닥 칸 수가 일곱 칸이 아닙니다.");return result;}
  function netDiagram(){const s=48,offset=[20,18];return `<svg class="source52-p54e4-net" viewBox="0 0 250 170" role="img" aria-label="정육면체 전개도: 2의 오른쪽에 5, 5의 아래에 4, 4의 오른쪽에 3, 3의 아래에 1, 1의 오른쪽에 6이 있습니다." xmlns="http://www.w3.org/2000/svg">${Object.entries(net).map(([p,n])=>{const[x,y]=p.split(",").map(Number),cx=offset[0]+x*s,cy=offset[1]+y*s;return `<rect x="${cx}" y="${cy}" width="${s}" height="${s}"/><text x="${cx+s/2}" y="${cy+s/2+6}">${n}</text>`;}).join("")}</svg>`;}
  function startCube(){return `<svg class="source52-p54e4-cube" viewBox="0 0 190 165" role="img" aria-label="처음 주사위의 윗면은 4, 앞면은 1, 오른쪽 면은 3" xmlns="http://www.w3.org/2000/svg"><polygon points="50,42 93,16 143,42 99,68" class="top"/><polygon points="50,42 99,68 99,126 50,100" class="front"/><polygon points="99,68 143,42 143,101 99,126" class="side"/><text x="95" y="47">4</text><text x="74" y="90">1</text><text x="119" y="88">3</text></svg>`;}
  let markerSequence=0;
  function pathDiagram({solution=false}={}){const markerId=`source52-p54e4-arrow-${++markerSequence}`;const s=46,ox=44,oy=30,pts=pathCells.map(([x,y])=>[ox+(x-1)*s,oy+y*s]);const rects=pts.map(([x,y])=>`<rect x="${x}" y="${y}" width="${s}" height="${s}"/>`).join("");const arrows=pts.slice(0,-1).map(([x,y],i)=>{const[nx,ny]=pts[i+1],dx=Math.sign(nx-x),dy=Math.sign(ny-y),cx=x+s/2,cy=y+s/2,ax=dx?cx:cx-14,ay=cy-13;return `<path d="M${ax-dx*5} ${ay-dy*5} L${ax+dx*6} ${ay+dy*6}" marker-end="url(#${markerId})"/>`;}).join("");const values=solution?pts.map(([x,y],i)=>`<text class="bottom" x="${x+s/2}" y="${y+s/2+5}">${[3,4,2,1,4,3,1][i]}</text>`).join(""):"";return `<svg class="source52-p54e4-path" viewBox="0 0 220 216" role="img" aria-label="첫 번째 칸 왼쪽에서 출발하여 시작 주사위에서 오른쪽으로 세 칸, 앞쪽으로 한 칸, 왼쪽으로 한 칸, 앞쪽으로 한 칸, 오른쪽으로 한 칸 굴립니다.${solution?" 바닥에 닿은 수는 차례로 3, 4, 2, 1, 4, 3, 1입니다.":""}" xmlns="http://www.w3.org/2000/svg"><defs><marker id="${markerId}" viewBox="0 0 7 7" markerWidth="5" markerHeight="5" refX="6" refY="3.5" orient="auto"><path d="M0 0 L7 3.5 L0 7 z"/></marker></defs>${rects}<text class="start-label" x="21" y="13">출발</text><g class="arrows"><path class="start-arrow" d="M8 53 L40 53" marker-end="url(#${markerId})"/>${arrows}</g>${values}</svg>`;}
  function diagrams({solution=false}={}){return `<div class="source52-p54e4-diagrams"><figure>${netDiagram()}<figcaption>전개도</figcaption></figure><figure>${startCube()}<figcaption>굴리기 시작 전</figcaption></figure><figure>${pathDiagram({solution})}<figcaption>${solution?"경로·바닥 눈":"바닥 칸 이동 경로"}</figcaption></figure></div>`;}
  function makeQuestion(){const answerModel=verifyModel();const prompt=`<div class="source52-p54e4-question" data-source-item-id="${sourceItemId}" data-pool-index="0"><p>다음 전개도를 접어 만든 정육면체를 화살표 방향으로 굴립니다. 그림에 표시된 일곱 정사각형의 바닥에 닿은 면에 쓰인 수를 모두 더하면 얼마인가요?</p>${diagrams()}</div>`;const solution=`<div class="source52-p54e4-solution" data-source-answer="${sourceItemId}"><p>전개도를 접어 맞은편 면을 확인하고, 시작 방향과 화살표 경로대로 한 칸씩 굴립니다.</p><ol><li>전개도에서 맞은편 면은 1과 5, 2와 3, 4와 6입니다.</li><li>처음에는 윗면 4, 앞면 1, 오른쪽 면 3입니다.</li><li>오른쪽으로 세 번, 앞쪽으로 한 번, 왼쪽으로 한 번, 앞쪽으로 한 번, 오른쪽으로 한 번 굴리면 바닥에 닿는 수는 3, 4, 2, 1, 4, 3, 1입니다.</li><li>모두 더하면 3+4+2+1+4+3+1=<strong>18</strong>입니다.</li></ol><p class="source52-p54e4-final">답: 18</p></div>`;return Object.freeze({prompt,answer:"18",solution,answerVisual:diagrams({solution:true}),sourceItemId,generator:generatorKey,variant:0,variantIndex:0,poolIndex:0,verifiedPoolIndex:0,verifiedVariantId:`${sourceItemId}:source-dice-roll-path`,difficultyOffset:0,difficultyLevel:2,difficultyRank:2,sourceStructurePreserved:true,answerVisualRequired:true,answerVisualStatus:"verified-reconstruction",publisherKeyVerified:false,publisherAnswerVerified:false,handwrittenAnswerVerified:false,answerVerification:"independent-dice-net-fold-and-roll-simulation",generationMode:"fixed-verified-pool",verifiedVariantCount:1,verifiedVariantTarget:1,answerModel});}
  function install(target){const api=target?.HSE_GENERATORS;if(!api||typeof api.generatorKey!=="function"||typeof api.generate!=="function")return false;if(api.__source52P54E4Installed)return true;const oldKey=api.generatorKey.bind(api),oldGenerate=api.generate.bind(api),matches=t=>t&&(t.id===sourceItemId||t.sourceItemId===sourceItemId||t.generatorKey===generatorKey);api.generatorKey=t=>matches(t)?t.id===sourceItemId&&t.sourceItemId===sourceItemId&&t.generatorKey===generatorKey&&t.reviewLocked===false&&t.sourceVerified===true?generatorKey:"":oldKey(t);api.generate=(t,rank,difficulty,seed,variant=0)=>matches(t)?api.generatorKey(t)&&Number(variant)===0?makeQuestion():null:oldGenerate(t,rank,difficulty,seed,variant);if(Array.isArray(api.names)&&!api.names.includes(generatorKey))api.names.push(generatorKey);Object.defineProperty(api,"__source52P54E4Installed",{value:true});return true;}
  return Object.freeze({definition,net,moves,pathCells,foldNet,simulate,verifyModel,diagrams,makeQuestion,install});
});
