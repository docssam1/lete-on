(function(root){
  'use strict';

  const VERSION='replacement-spatial-20260911-v1';
  const LEVELS=['easy','same','hard'];
  const INK='#284b60', BLUE='#4f98b9', GREEN='#63a58b', GOLD='#e3bb55', WARM='#c97454';
  const OCCURRENCES=Object.freeze({
    'mock-dice-target-bottom':'dice-target-bottom',
    'r3-main-15-checker-stack-count':'checker-stack-count',
    'r4-extra-2-checker-stack-count':'checker-stack-count',
    'r3-main-18-tetra-cube-hole-count':'tetra-cube-hole-count',
    'r4-extra-3-tetra-cube-hole-count':'tetra-cube-hole-count',
    'r3-extra-3-block-build-count':'block-build-count',
    'r3-extra-6-stack-box-fill':'cube-count-fill-custom',
    'r4-extra-5-stack-box-fill':'stack-box-fill'
  });
  const POLICY=Object.freeze({
    'dice-target-bottom':['네 칸을 굴리며 두 방향의 면을 추적','다섯 칸을 굴리며 두 번 이상 방향 전환','다섯 칸을 굴리며 세 방향과 세 번 이상 방향 전환'],
    'checker-stack-count':['높이 2의 작은 계단에서 두 색 세기','높이 3의 넓은 계단에서 층별 색 세기','높이 4의 계단에서 가려진 층까지 추론'],
    'tetra-cube-hole-count':['구멍 1개와 2층 조각 1개','구멍 2개와 2층 조각 2개','구멍 2개와 2층 조각 3개'],
    'block-build-count':['윗면의 B 블록 2~3개','넓어진 윗면의 B 블록 4~5개','더 큰 직육면체의 B 블록 5~6개'],
    'stack-box-fill':['높이 2 상자의 빈칸 계산','높이 3 상자의 빈칸 계산','넓이와 높이가 커진 상자의 두 단계 계산'],
    'cube-count-fill-custom':['현재 개수와 높이 2 상자의 빈칸','현재 개수와 높이 3 상자의 빈칸','넓이와 높이가 커진 상자의 현재·추가 개수']
  });

  const clone=value=>JSON.parse(JSON.stringify(value));
  const sum=values=>values.reduce((total,value)=>total+value,0);
  const esc=value=>String(value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  function freeze(value){if(value&&typeof value==='object'&&!Object.isFrozen(value)){Object.values(value).forEach(freeze);Object.freeze(value);}return value;}
  function hash32(value){let hash=2166136261;for(const ch of String(value))hash=Math.imul(hash^ch.charCodeAt(0),16777619);return hash>>>0;}
  function rng(seed){let state=seed>>>0;return function(lo,hi){state+=0x6d2b79f5;let t=state;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return lo+Math.floor(((t^(t>>>14))>>>0)/4294967296*(hi-lo+1));};}
  function shuffled(values,random){const out=values.slice();for(let index=out.length-1;index>0;index--){const other=random(0,index);[out[index],out[other]]=[out[other],out[index]];}return out;}
  const text=(x,y,value,size=16,fill=INK,weight=600)=>`<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle" font-size="${size}" fill="${fill}" font-weight="${weight}">${esc(value)}</text>`;
  const polygon=(points,fill='#fff',stroke=INK,width=1.35,extra='')=>`<polygon points="${points.map(point=>point.join(',')).join(' ')}" fill="${fill}" stroke="${stroke}" stroke-width="${width}" stroke-linejoin="round" ${extra}/>`;
  const line=(a,b,stroke=INK,width=1.6,extra='')=>`<path d="M${a[0]} ${a[1]}L${b[0]} ${b[1]}" fill="none" stroke="${stroke}" stroke-width="${width}" stroke-linecap="round" ${extra}/>`;
  const rect=(x,y,width,height,fill='#fff',stroke=INK,strokeWidth=1.3,radius=0,extra='')=>`<rect x="${x}" y="${y}" width="${width}" height="${height}" rx="${radius}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" ${extra}/>`;
  function svg(body,height,label,kind){return `<svg xmlns="http://www.w3.org/2000/svg" class="challenge-visual variant-visual replacement-spatial-visual" data-spatial-kind="${esc(kind)}" viewBox="0 0 660 ${height}" role="img" aria-label="${esc(label)}" style="width:100%;height:auto;max-height:none;font-family:'Malgun Gothic',sans-serif"><title>${esc(label)}</title>${body}</svg>`;}

  function sourceKind(source){const expected=OCCURRENCES[source&&source.typeId],actual=source&&source.payload&&source.payload.kind;return expected&&expected===actual?actual:null;}
  function supports(source){return !!sourceKind(source);}
  function levels(source){const ok=supports(source);return {easy:ok,same:ok,hard:ok};}
  function notes(source){const kind=sourceKind(source);return kind?POLICY[kind].slice():['','',''];}

  function isoPoint(x,y,z,originX,originY,unit){return [originX+(x-y)*unit*.86,originY+(x+y)*unit*.46-z*unit*.94];}
  function cubeCenterTop(cube,originX,originY,unit){return isoPoint(cube[0]+.5,cube[1]+.5,cube[2]+1,originX,originY,unit);}
  function pileBody(heightMap,options={}){
    const depth=heightMap.length,width=heightMap[0].length,originX=options.originX||330,originY=options.originY||150,unit=options.unit||34;
    const cells=[];heightMap.forEach((row,y)=>row.forEach((height,x)=>{for(let z=0;z<height;z++)cells.push([x,y,z]);}));
    const occupied=new Set(cells.map(cell=>cell.join(',')));
    let body=`<g class="spatial-pile" data-camera="geometry-standard-high-iso" data-width="${width}" data-depth="${depth}">`;
    for(let y=0;y<depth;y++)for(let x=0;x<width;x++){
      const base=[isoPoint(x,y,0,originX,originY,unit),isoPoint(x+1,y,0,originX,originY,unit),isoPoint(x+1,y+1,0,originX,originY,unit),isoPoint(x,y+1,0,originX,originY,unit)];
      const hole=options.markHoles===true&&heightMap[y][x]===0;
      body+=polygon(base,hole?'#fff8f2':'#f7fafb',hole?WARM:'#b7cbd4',hole?1.8:.85,hole?`data-hole="${x},${y}"`:'');
    }
    cells.sort((left,right)=>(left[0]+left[1])-(right[0]+right[1])||left[2]-right[2]||left[1]-right[1]||left[0]-right[0]);
    for(const cell of cells){
      const [x,y,z]=cell,key=cell.join(','),fills=options.colorForCube?options.colorForCube({x,y,z,key}):['#dff1eb','#b9dbd0','#91c5b6'];
      const p000=isoPoint(x,y,z,originX,originY,unit),p100=isoPoint(x+1,y,z,originX,originY,unit),p010=isoPoint(x,y+1,z,originX,originY,unit),p110=isoPoint(x+1,y+1,z,originX,originY,unit);
      const p001=isoPoint(x,y,z+1,originX,originY,unit),p101=isoPoint(x+1,y,z+1,originX,originY,unit),p011=isoPoint(x,y+1,z+1,originX,originY,unit),p111=isoPoint(x+1,y+1,z+1,originX,originY,unit);
      let faces='';
      if(!occupied.has(`${x+1},${y},${z}`))faces+=polygon([p100,p110,p111,p101],fills[2],'#45687a',1.35,'class="cube-face right"');
      if(!occupied.has(`${x},${y+1},${z}`))faces+=polygon([p010,p110,p111,p011],fills[1],'#45687a',1.35,'class="cube-face front"');
      if(!occupied.has(`${x},${y},${z+1}`))faces+=polygon([p001,p101,p111,p011],fills[0],'#45687a',1.35,'class="cube-face top"');
      body+=`<g class="spatial-cube" data-cube="${key}"${options.pieceAt&&options.pieceAt.has(key)?` data-piece="${options.pieceAt.get(key)}"`:''}>${faces}</g>`;
    }
    return {body:body+'</g>',cubeCount:cells.length,cells,originX,originY,unit};
  }
  function boxWireframe(width,depth,height,originX,originY,unit){
    const edges=[[[0,0,0],[width,0,0]],[[0,depth,0],[width,depth,0]],[[0,0,height],[width,0,height]],[[0,depth,height],[width,depth,height]],[[0,0,0],[0,depth,0]],[[width,0,0],[width,depth,0]],[[0,0,height],[0,depth,height]],[[width,0,height],[width,depth,height]],[[0,0,0],[0,0,height]],[[width,0,0],[width,0,height]],[[0,depth,0],[0,depth,height]],[[width,depth,0],[width,depth,height]]];
    return `<g class="box-wireframe" data-wireframe-edges="12">${edges.map(edge=>line(isoPoint(...edge[0],originX,originY,unit),isoPoint(...edge[1],originX,originY,unit),'#6f8793',1.25,'stroke-dasharray="5 4"')).join('')}</g>`;
  }

  function rollDie(state,direction){
    if(direction==='N')return {top:state.south,bottom:state.north,north:state.top,south:state.bottom,east:state.east,west:state.west};
    if(direction==='S')return {top:state.north,bottom:state.south,north:state.bottom,south:state.top,east:state.east,west:state.west};
    if(direction==='E')return {top:state.west,bottom:state.east,north:state.north,south:state.south,east:state.top,west:state.bottom};
    if(direction==='W')return {top:state.east,bottom:state.west,north:state.north,south:state.south,east:state.bottom,west:state.top};
    throw Error('알 수 없는 주사위 이동입니다.');
  }
  function allOrientations(){
    const first={top:1,bottom:6,north:2,south:5,east:3,west:4},queue=[first],byKey=new Map();
    while(queue.length){const state=queue.shift(),key=[state.top,state.bottom,state.north,state.south,state.east,state.west].join(',');if(byKey.has(key))continue;byKey.set(key,state);for(const direction of ['N','S','E','W'])queue.push(rollDie(state,direction));}
    return [...byKey.values()];
  }
  const DIE_ORIENTATIONS=allOrientations();
  const MOVE={N:[-1,0],S:[1,0],E:[0,1],W:[0,-1]},INVERSE={N:'S',S:'N',E:'W',W:'E'};
  const ROUTE_CACHE=new Map();
  function routeCandidates(length,difficulty){
    const cacheKey=`${length}-${difficulty}`;if(ROUTE_CACHE.has(cacheKey))return ROUTE_CACHE.get(cacheKey);
    const rows=5,cols=5,out=[];
    function visit(path,directions){
      if(directions.length===length){const turns=directions.slice(1).filter((direction,index)=>direction!==directions[index]).length,kinds=new Set(directions).size,minTurns=difficulty==='easy'?1:difficulty==='same'?2:3,minKinds=difficulty==='hard'?3:2;if(turns>=minTurns&&kinds>=minKinds)out.push({start:path[0],route:directions.slice(),path:path.map(point=>point.slice()),turns});return;}
      for(const direction of ['N','E','S','W']){
        if(directions.length&&INVERSE[direction]===directions.at(-1))continue;
        if(directions.length>1&&directions.at(-1)===direction&&directions.at(-2)===direction)continue;
        const current=path.at(-1),step=MOVE[direction],next=[current[0]+step[0],current[1]+step[1]];
        if(next[0]<0||next[0]>=rows||next[1]<0||next[1]>=cols||path.some(point=>point[0]===next[0]&&point[1]===next[1]))continue;
        visit([...path,next],[...directions,direction]);
      }
    }
    for(let row=0;row<rows;row++)for(let column=0;column<cols;column++)visit([[row,column]],[]);
    ROUTE_CACHE.set(cacheKey,out);return out;
  }
  function quadPoint(points,u,v){const a=[points[0][0]*(1-u)+points[1][0]*u,points[0][1]*(1-u)+points[1][1]*u],b=[points[3][0]*(1-u)+points[2][0]*u,points[3][1]*(1-u)+points[2][1]*u];return [a[0]*(1-v)+b[0]*v,a[1]*(1-v)+b[1]*v];}
  const PIPS={1:[[.5,.5]],2:[[.28,.28],[.72,.72]],3:[[.28,.28],[.5,.5],[.72,.72]],4:[[.28,.28],[.72,.28],[.28,.72],[.72,.72]],5:[[.28,.28],[.72,.28],[.5,.5],[.28,.72],[.72,.72]],6:[[.28,.23],[.72,.23],[.28,.5],[.72,.5],[.28,.77],[.72,.77]]};
  function dieBody(orientation,cx,cy,scale=.58){
    const faces=[[[0,-36],[44,-14],[0,8],[-44,-14]],[[-44,-14],[0,8],[0,60],[-44,38]],[[0,8],[44,-14],[44,38],[0,60]]],values=[orientation.top,orientation.south,orientation.east],fills=['#fbfdfe','#e5eef1','#d1e0e5'];
    const content=faces.map((face,index)=>polygon(face,fills[index],'#315c73',1.75)+PIPS[values[index]].map(position=>{const point=quadPoint(face,...position);return `<circle cx="${point[0]}" cy="${point[1]}" r="3.8" fill="#214d67"/>`;}).join('')).join('');
    return `<g class="start-die" data-die-on-start="true" transform="translate(${cx} ${cy}) scale(${scale})">${content}</g>`;
  }
  function boardPoint(row,column,options){return [options.centerX+(column-row)*options.cellX,options.topY+(column+row)*options.cellY];}
  function boardCenter(row,column,options){return boardPoint(row+.5,column+.5,options);}
  function diceSvg(payload,solution){
    const options={centerX:330,topY:48,cellX:43,cellY:22},path=payload.path,marker=`spatial-arrow-${hash32(payload.route.join('')+Object.values(payload.startOrientation).join(',')).toString(16)}`;
    let body=text(330,19,'화살표를 따라 ㉠까지',15,INK,700)+`<g class="dice-board" data-dice-board="5x5" data-camera="geometry-standard-high-iso" data-route="${payload.route.join('')}"><defs><marker id="${marker}" viewBox="0 0 10 10" refX="8.7" refY="5" markerWidth="2.7" markerHeight="2.7" orient="auto"><path d="M0 1L9 5L0 9z" fill="#287594"/></marker></defs>`;
    for(let row=0;row<5;row++)for(let column=0;column<5;column++){
      const points=[boardPoint(row,column,options),boardPoint(row,column+1,options),boardPoint(row+1,column+1,options),boardPoint(row+1,column,options)],target=path.at(-1)[0]===row&&path.at(-1)[1]===column;
      body+=polygon(points,target?'#fff0aa':'#fff',target?'#b37b16':'#78929f',target?2:1.15,target?'class="target-cell"':'');
    }
    path.slice(1).forEach((cell,index)=>{const previous=path[index],from=boardCenter(...previous,options),to=boardCenter(...cell,options),dx=to[0]-from[0],dy=to[1]-from[1],a=[from[0]+dx*.09,from[1]+dy*.09],b=[to[0]-dx*.12,to[1]-dy*.12],length=Math.hypot(b[0]-a[0],b[1]-a[1]).toFixed(2);body+=line(a,b,'#287594',2.25,`class="roll-arrow" data-direction="${payload.route[index]}" data-arrow-length="${length}" marker-end="url(#${marker})"`);});
    const start=boardCenter(...payload.start,options),target=boardCenter(...path.at(-1),options);
    body+=dieBody(payload.startOrientation,start[0],start[1]-27,.55)+text(target[0],target[1]+13,solution?payload.answer:'㉠',solution?14:17,solution?'#1f685f':'#8a5b09',800)+'</g>';
    if(solution)body+=rect(245,300,170,30,'#edf7f2','#43877c',1.4,15)+text(330,315,`㉠의 밑면 ${payload.answer}`,14,'#1f685f',800);
    return svg(body,solution?340:312,solution?'굴린 순서와 마지막 밑면을 확인한 주사위 풀이':'높은 등각 격자에서 화살표를 따라 굴리는 주사위','dice-target-bottom');
  }
  function diceQuestion(difficulty,random){
    const length=difficulty==='easy'?4:5,candidates=routeCandidates(length,difficulty),picked=candidates[random(0,candidates.length-1)],orientation=clone(DIE_ORIENTATIONS[random(0,DIE_ORIENTATIONS.length-1)]);
    let finish=orientation,trace=[];for(const direction of picked.route){finish=rollDie(finish,direction);trace.push(finish.bottom);}
    const payload={kind:'dice-target-bottom',rows:5,cols:5,start:picked.start.slice(),route:picked.route.slice(),path:picked.path.map(point=>point.slice()),turns:picked.turns,startOrientation:orientation,oppositeRule:'sum-seven',targetStep:length,view:'geometry-standard-high-iso',responseMode:'target-bottom-number',answer:finish.bottom};
    return {payload,prompt:'마주 보는 면의 눈의 합이 7인 주사위입니다. 화살표를 따라 ㉠까지 굴렸을 때 바닥에 닿는 면의 눈을 쓰세요.',problemHtml:diceSvg(payload,false),answer:finish.bottom,answerHtml:`${finish.bottom}`,solution:`한 칸씩 굴릴 때 밑면은 ${trace.join(' → ')}로 바뀝니다. ㉠의 밑면은 ${finish.bottom}입니다.`,solutionDiagram:diceSvg(payload,true),difficultyEvidence:{metric:'rolls-and-turns',value:length,turns:picked.turns}};
  }

  function monotoneMap(width,depth,maxHeight,random,minimumCubes){
    for(let attempt=0;attempt<120;attempt++){
      const map=Array.from({length:depth},()=>Array(width).fill(0));
      for(let y=0;y<depth;y++)for(let x=0;x<width;x++){
        if(x===0&&y===0){map[y][x]=maxHeight;continue;}
        const cap=Math.min(x?map[y][x-1]:maxHeight,y?map[y-1][x]:maxHeight),drop=random(0,Math.min(cap,2));
        map[y][x]=cap-drop;
      }
      const total=sum(map.flat()),distinct=new Set(map.flat()).size;
      if(total>=minimumCubes&&total<width*depth*maxHeight&&distinct>=2&&map.flat().filter(Boolean).length>=Math.ceil(width*depth*.55))return map;
    }
    throw Error('읽을 수 있는 계단 모양을 만들지 못했습니다.');
  }
  function checkerCounts(map,offset){const answer={black:0,white:0};map.forEach((row,y)=>row.forEach((height,x)=>{for(let z=0;z<height;z++)answer[(x+y+z+offset)%2===0?'black':'white']++;}));return answer;}
  function checkerSvg(payload,solution){
    const maximum=Math.max(...payload.heightMap.flat()),unit=payload.width===4&&payload.depth===4?31:36,originY=48+maximum*unit*.94,palette={black:['#45545d','#303d45','#1f2b31'],white:['#fff','#e6eff2','#cbdde2']};
    const pile=pileBody(payload.heightMap,{unit,originX:330,originY,colorForCube:cube=>palette[(cube.x+cube.y+cube.z+payload.checkerOffset)%2===0?'black':'white']});
    let body=text(330,19,'검은색과 흰색이 번갈아 맞닿는 쌓기나무',15,INK,700)+pile.body;
    if(solution)body+=rect(200,315,260,32,'#edf7f2','#43877c',1.3,16)+text(330,331,`검은색 ${payload.answer.black}개 · 흰색 ${payload.answer.white}개`,14,'#1f685f',800);
    return svg(body,solution?360:325,solution?'층별 색을 확인한 쌓기나무 풀이':'높은 등각 시점의 검은색과 흰색 계단 쌓기나무','checker-stack-count');
  }
  function checkerQuestion(difficulty,random){
    const level=LEVELS.indexOf(difficulty),sizes=[[3,3,2],[4,3,3],[4,4,4]][level],[width,depth,maxHeight]=sizes,map=monotoneMap(width,depth,maxHeight,random,[7,12,18][level]),offset=random(0,1),answer=checkerCounts(map,offset),payload={kind:'checker-stack-count',heightMap:map,checkerOffset:offset,width,depth,maxHeight,noFloatingCubes:true,camera:'geometry-standard-high-iso',visibilityRule:'monotone-toward-open-corner',responseMode:'black-white-counts',answer};
    return {payload,prompt:'서로 맞닿는 쌓기나무는 검은색과 흰색이 번갈아 놓입니다. 검은색과 흰색 쌓기나무는 각각 몇 개입니까?',problemHtml:checkerSvg(payload,false),answer,answerHtml:`검은색 ${answer.black}개 · 흰색 ${answer.white}개`,solution:`기둥마다 아래에서 위로 색을 번갈아 셉니다. 검은색은 ${answer.black}개, 흰색은 ${answer.white}개입니다.`,solutionDiagram:checkerSvg(payload,true),difficultyEvidence:{metric:'visible-columns-plus-height',value:map.flat().filter(Boolean).length+maxHeight}};
  }

  const TETROMINO_BASE=[[[0,0],[1,0],[2,0],[3,0]],[[0,0],[1,0],[0,1],[1,1]],[[0,0],[1,0],[2,0],[1,1]],[[0,0],[0,1],[0,2],[1,2]],[[1,0],[2,0],[0,1],[1,1]]];
  function normalize2(shape){const minX=Math.min(...shape.map(cell=>cell[0])),minY=Math.min(...shape.map(cell=>cell[1]));return shape.map(([x,y])=>[x-minX,y-minY]).sort((a,b)=>a[1]-b[1]||a[0]-b[0]);}
  function tetrominoOrientations(){const byKey=new Map();for(const base of TETROMINO_BASE)for(let mirror=0;mirror<2;mirror++)for(let turn=0;turn<4;turn++){let shape=base.map(([x,y])=>[mirror?-x:x,y]);for(let count=0;count<turn;count++)shape=shape.map(([x,y])=>[-y,x]);shape=normalize2(shape);byKey.set(JSON.stringify(shape),shape);}return [...byKey.values()];}
  const TETROMINOES=tetrominoOrientations();
  function placements(width,depth,available){
    const out=[];for(const shape of TETROMINOES){const maxX=Math.max(...shape.map(cell=>cell[0])),maxY=Math.max(...shape.map(cell=>cell[1]));for(let y=0;y+maxY<depth;y++)for(let x=0;x+maxX<width;x++){const cells=shape.map(cell=>[cell[0]+x,cell[1]+y]);if(cells.every(cell=>available.has(cell.join(','))))out.push(cells);}}
    return out;
  }
  function exactTile(width,depth,holeKeys,random){
    const available=new Set();for(let y=0;y<depth;y++)for(let x=0;x<width;x++)if(!holeKeys.has(`${x},${y}`))available.add(`${x},${y}`);
    const options=placements(width,depth,available).map(cells=>({cells,priority:random(0,0x7fffffff)})).sort((a,b)=>a.priority-b.priority),byCell=new Map();
    for(const option of options)for(const cell of option.cells){const key=cell.join(',');if(!byCell.has(key))byCell.set(key,[]);byCell.get(key).push(option.cells);}
    const used=new Set(),chosen=[],failed=new Set();
    function search(){
      if(used.size===available.size)return true;
      const signature=[...used].sort().join(';');if(failed.has(signature))return false;
      let best=null,bestOptions=null;
      for(const key of available){if(used.has(key))continue;const viable=(byCell.get(key)||[]).filter(cells=>cells.every(cell=>!used.has(cell.join(','))));if(!viable.length){failed.add(signature);return false;}if(!bestOptions||viable.length<bestOptions.length){best=key;bestOptions=viable;if(viable.length===1)break;}}
      for(const cells of bestOptions){cells.forEach(cell=>used.add(cell.join(',')));chosen.push(cells);if(search())return true;chosen.pop();cells.forEach(cell=>used.delete(cell.join(',')));}
      failed.add(signature);return false;
    }
    return search()?chosen.map(piece=>piece.map(([x,y])=>[x,y,0])):null;
  }
  function chooseTopPieces(width,depth,holeKeys,count,random){
    const available=new Set();for(let y=0;y<depth;y++)for(let x=0;x<width;x++)if(!holeKeys.has(`${x},${y}`))available.add(`${x},${y}`);
    const options=shuffled(placements(width,depth,available),random),chosen=[],used=new Set();
    function search(index){if(chosen.length===count)return true;for(let cursor=index;cursor<options.length;cursor++){const cells=options[cursor];if(cells.some(cell=>used.has(cell.join(','))))continue;cells.forEach(cell=>used.add(cell.join(',')));chosen.push(cells);if(search(cursor+1))return true;chosen.pop();cells.forEach(cell=>used.delete(cell.join(',')));}return false;}
    if(!search(0))throw Error('2층 테트라큐브 배치를 만들지 못했습니다.');
    return chosen.map(piece=>piece.map(([x,y])=>[x,y,1]));
  }
  function tetraModel(difficulty,random){
    const level=LEVELS.indexOf(difficulty),width=level===0?5:6,depth=5,holeCount=level===0?1:2,topCount=level+1;
    const interior=[];for(let y=1;y<depth-1;y++)for(let x=1;x<width-1;x++)interior.push([x,y]);
    const holeSets=[];
    if(holeCount===1)for(const cell of interior)holeSets.push([cell]);
    else for(let a=0;a<interior.length;a++)for(let b=a+1;b<interior.length;b++)if(Math.abs(interior[a][0]-interior[b][0])+Math.abs(interior[a][1]-interior[b][1])>=2)holeSets.push([interior[a],interior[b]]);
    for(const holes of shuffled(holeSets,random)){
      const holeKeys=new Set(holes.map(cell=>cell.join(','))),basePieces=exactTile(width,depth,holeKeys,random);if(!basePieces)continue;
      const topPieces=chooseTopPieces(width,depth,holeKeys,topCount,random),pieces=[...basePieces,...topPieces],heightMap=Array.from({length:depth},()=>Array(width).fill(0));
      for(const piece of pieces)for(const [x,y,z]of piece)heightMap[y][x]=Math.max(heightMap[y][x],z+1);
      return {width,depth,holes:holes.map(cell=>cell.slice()),pieces,heightMap,topPieceCount:topCount,cubeCount:pieces.length*4};
    }
    throw Error('구멍이 보이는 테트라큐브 모양을 만들지 못했습니다.');
  }
  const PIECE_PALETTE=[['#dff1eb','#b9dbd0','#91c5b6'],['#d9ecf3','#b3d3df','#87b8ca'],['#eee5ca','#d9c797','#bca769'],['#e9dff1','#cfbde0','#ae93c6'],['#f0ddd8','#ddb9b0','#c79284'],['#dcebe5','#b9d4c9','#8eb6a6'],['#e1e8f1','#becbdd','#96a8c1'],['#f2e8d1','#dccba2','#bca77a'],['#d9ece8','#afd2ca','#83b5aa'],['#e7e2f0','#c9bedc','#a698c1'],['#f0e1cc','#ddc19b','#c49f6f'],['#dceaf1','#b8d0dd','#8fadc0']];
  function topPlan(heightMap,left,top,cell,solution){let body='<g class="tetra-top-plan" data-plan="marked-holes">';heightMap.forEach((row,y)=>row.forEach((height,x)=>{const hole=!height;body+=rect(left+x*cell,top+y*cell,cell,cell,hole?'#fff8f2':height===2?'#9fcfc0':'#dff1eb',hole?WARM:'#5c9483',hole?1.8:1.1,1,hole?`data-plan-hole="${x},${y}"`:`data-plan-height="${height}"`);if(solution&&hole)body+=text(left+(x+.5)*cell,top+(y+.5)*cell,'×',14,WARM,800);}));return body+'</g>';}
  function tetraSvg(payload,solution){
    const pieceAt=new Map();payload.pieces.forEach((piece,index)=>piece.forEach(cell=>pieceAt.set(cell.join(','),index)));
    const unit=24,originY=56+2*unit*.94,pile=pileBody(payload.heightMap,{unit,originX:190,originY,pieceAt,markHoles:true,colorForCube:cube=>PIECE_PALETTE[pieceAt.get(cube.key)%PIECE_PALETTE.length]});
    let body=text(190,19,'입체 모양',15,INK,700)+pile.body+text(500,19,'위에서 본 바탕그림',15,INK,700)+topPlan(payload.heightMap,425,48,25,solution);
    if(solution){const layers=[payload.heightMap.flat().filter(height=>height>=1).length,payload.heightMap.flat().filter(height=>height>=2).length];body+=rect(337,244,300,42,'#edf7f2','#43877c',1.2,9)+text(487,257,`1층 ${layers[0]}개 + 2층 ${layers[1]}개 = ${payload.cubeCount}개`,12,'#1f685f',800)+text(487,274,`${payload.cubeCount} ÷ 4 = ${payload.answer}`,13,'#1f685f',800);}
    return svg(body,300,solution?'구멍과 층별 개수를 확인한 테트라큐브 풀이':'구멍이 보이는 바탕그림과 높은 등각 시점의 테트라큐브 입체','tetra-cube-hole-count');
  }
  function tetraQuestion(difficulty,random){
    const model=tetraModel(difficulty,random),answer=model.pieces.length,payload={kind:'tetra-cube-hole-count',...model,tetraCubeSize:4,topView:'marked-holes',camera:'geometry-standard-high-iso',responseMode:'tetra-cube-count',answer};
    return {payload,prompt:'쌓기나무 4개로 만든 테트라큐브로 이 모양을 만들었습니다. 사용한 테트라큐브는 모두 몇 개입니까?',problemHtml:tetraSvg(payload,false),answer,answerHtml:`${answer}개`,solution:`1층과 2층의 쌓기나무는 모두 ${model.cubeCount}개입니다. ${model.cubeCount}÷4=${answer}이므로 테트라큐브는 ${answer}개입니다.`,solutionDiagram:tetraSvg(payload,true),difficultyEvidence:{metric:'holes-and-upper-pieces',value:model.holes.length+model.topPieceCount}};
  }

  function dominoesOnTop(width,depth,height,count,random){
    const options=[];for(let y=0;y<depth;y++)for(let x=0;x<width;x++){if(x+1<width)options.push([[x,y,height-1],[x+1,y,height-1]]);if(y+1<depth)options.push([[x,y,height-1],[x,y+1,height-1]]);}
    const ordered=shuffled(options,random),used=new Set(),chosen=[];
    function search(index){if(chosen.length===count)return true;for(let cursor=index;cursor<ordered.length;cursor++){const piece=ordered[cursor];if(piece.some(cell=>used.has(cell.join(','))))continue;piece.forEach(cell=>used.add(cell.join(',')));chosen.push(piece);if(search(cursor+1))return true;chosen.pop();piece.forEach(cell=>used.delete(cell.join(',')));}return false;}
    if(!search(0))throw Error('겹치지 않는 B 블록 배치를 만들지 못했습니다.');return chosen;
  }
  function blockBuildSvg(payload,solution){
    const bAt=new Map();payload.bPieces.forEach((piece,index)=>piece.forEach(cell=>bAt.set(cell.join(','),index)));
    const map=Array.from({length:payload.depth},()=>Array(payload.width).fill(payload.height)),unit=payload.width===5?29:33,originX=410,originY=62+payload.height*unit*.94;
    const blue=['#83bdd8','#5a9cbc','#397e9f'],yellow=['#f4d66b','#dfbd4e','#bd9c32'],pile=pileBody(map,{unit,originX,originY,pieceAt:bAt,colorForCube:cube=>bAt.has(cube.key)?yellow:blue});
    const demoA=pileBody([[1]],{unit:28,originX:70,originY:70,colorForCube:()=>blue}),demoB=pileBody([[1,1]],{unit:27,originX:145,originY:70,colorForCube:()=>yellow});
    let body=text(112,18,'보기',15,INK,800)+demoA.body+text(70,118,'A',14,INK,800)+demoB.body+text(168,118,'B',14,INK,800)+line([218,20],[218,246],'#d5e0e5',1.1)+text(430,18,'만든 모양',15,INK,800)+pile.body;
    for(const piece of payload.bPieces){const a=cubeCenterTop(piece[0],originX,originY,unit),b=cubeCenterTop(piece[1],originX,originY,unit);body+=line(a,b,'#8b6a18',2.3,'class="b-piece-connector" data-b-connector="true"');body+=`<circle cx="${a[0]}" cy="${a[1]}" r="3" fill="#8b6a18"/><circle cx="${b[0]}" cy="${b[1]}" r="3" fill="#8b6a18"/>`;}
    body+=text(430,263,`가로 ${payload.width}칸 · 세로 ${payload.depth}칸 · 높이 ${payload.height}칸`,13,'#526c7a',700);
    if(solution)body+=rect(270,283,320,32,'#edf7f2','#43877c',1.2,16)+text(430,299,`A ${payload.answer.A}개 · B ${payload.answer.B}개`,14,'#1f685f',800);
    return svg(body,solution?328:286,solution?'A 블록과 B 블록의 수를 확인한 풀이':'A 한 칸 블록과 B 두 칸 블록으로 만든 높은 등각 직육면체','block-build-count');
  }
  function blockBuildQuestion(difficulty,random){
    const level=LEVELS.indexOf(difficulty),options=[[[3,2,2,2],[4,2,2,3]],[[4,3,2,4],[5,3,2,5]],[[5,3,2,5],[4,3,3,6]]][level],config=options[random(0,options.length-1)],[width,depth,height,bCount]=config,bPieces=dominoesOnTop(width,depth,height,bCount,random),total=width*depth*height,answer={A:total-bCount*2,B:bCount},payload={kind:'block-build-count',width,depth,height,bPieces,allBVisibleOnTop:true,pieceGrouping:'top-center-connectors',camera:'geometry-standard-high-iso',responseMode:'two-block-counts',answer};
    return {payload,prompt:'A 블록은 쌓기나무 1개, B 블록은 붙어 있는 쌓기나무 2개입니다. 이 직육면체에 사용한 A 블록과 B 블록은 각각 몇 개입니까?',problemHtml:blockBuildSvg(payload,false),answer,answerHtml:`A 블록 ${answer.A}개 · B 블록 ${answer.B}개`,solution:`전체는 ${width}×${depth}×${height}=${total}칸입니다. B 블록 ${bCount}개가 ${bCount*2}칸을 차지하므로 A 블록은 ${total}−${bCount*2}=${answer.A}개입니다.`,solutionDiagram:blockBuildSvg(payload,true),difficultyEvidence:{metric:'total-cells-and-dominoes',value:total+bCount}};
  }

  function fillMap(width,depth,boxH,random){
    for(let attempt=0;attempt<160;attempt++){
      const map=Array.from({length:depth},()=>Array(width).fill(0));
      for(let y=0;y<depth;y++)map[y][0]=boxH;
      for(let y=0;y<depth;y++)for(let x=1;x<width;x++){
        const cap=Math.min(map[y][x-1],y?map[y-1][x]:boxH),floor=Math.max(0,cap-2);map[y][x]=random(floor,cap);
      }
      const placed=sum(map.flat()),full=width*depth*boxH,distinct=new Set(map.flat()).size;
      if(placed>=Math.ceil(full*.42)&&placed<=Math.floor(full*.82)&&distinct>=2&&map.flat().filter(Boolean).length>=Math.ceil(width*depth*.55))return map;
    }
    throw Error('빈칸이 분명한 상자 모양을 만들지 못했습니다.');
  }
  function fillSvg(payload,solution){
    const unit=payload.width===4?31:37,originX=330,originY=54+payload.boxH*unit*.94,pile=pileBody(payload.heightMap,{unit,originX,originY,colorForCube:()=>['#dff1eb','#b9dbd0','#91c5b6']}),wire=boxWireframe(payload.width,payload.depth,payload.boxH,originX,originY,unit);
    let body=text(330,19,'점선 상자 안의 쌓기나무',15,INK,700)+pile.body+wire+text(330,291,`가로 ${payload.width}칸 · 세로 ${payload.depth}칸 · 높이 ${payload.boxH}칸`,13,'#526c7a',700);
    if(solution)body+=rect(190,310,280,34,'#edf7f2','#43877c',1.2,17)+text(330,327,`현재 ${payload.placed}개 · 더 필요한 수 ${payload.need}개`,14,'#1f685f',800);
    return svg(body,solution?356:308,solution?'현재 수와 가득 채울 때의 수를 확인한 풀이':'높은 등각 시점의 점선 상자와 계단 모양 쌓기나무',payload.kind);
  }
  function fillQuestion(kind,difficulty,random){
    const level=LEVELS.indexOf(difficulty),sizes=[[[3,3,2],[4,2,2]],[[3,3,3],[4,3,2]],[[4,3,3],[3,4,3]]][level],size=sizes[random(0,sizes.length-1)],[width,depth,boxH]=size,heightMap=fillMap(width,depth,boxH,random),placed=sum(heightMap.flat()),full=width*depth*boxH,need=full-placed,custom=kind==='cube-count-fill-custom',answer=custom?[placed,need]:need,payload={kind,width,depth,boxH,heightMap,placed,full,need,camera:'geometry-standard-high-iso',shapeRule:'solid-columns-monotone-toward-open-corner',responseMode:custom?'current-and-additional-cube-counts':'additional-cube-count',answer};
    return {payload,prompt:custom?`가로 ${width}칸, 세로 ${depth}칸, 높이 ${boxH}칸인 점선 상자 안에 쌓기나무가 몇 개 있습니까? 또 빈틈없이 채우려면 몇 개가 더 필요합니까?`:`가로 ${width}칸, 세로 ${depth}칸, 높이 ${boxH}칸인 점선 상자를 빈틈없이 채우려면 쌓기나무가 몇 개 더 필요합니까?`,problemHtml:fillSvg(payload,false),answer,answerHtml:custom?`(1) ${placed}개 · (2) ${need}개`:`${need}개`,solution:`현재 쌓인 수는 ${heightMap.map(row=>row.join('+')).join(' / ')}를 모두 더한 ${placed}개입니다. 상자 전체는 ${width}×${depth}×${boxH}=${full}개이므로 ${full}−${placed}=${need}개가 더 필요합니다.`,solutionDiagram:fillSvg(payload,true),difficultyEvidence:{metric:'box-capacity-and-visible-columns',value:full+heightMap.flat().filter(Boolean).length}};
  }

  function generate(source,difficulty,seed){
    const kind=sourceKind(source);if(!kind)throw Error('지원하지 않는 공간 세부 유형입니다.');
    if(!LEVELS.includes(difficulty))throw Error('easy, same, hard 중 한 난이도가 필요합니다.');
    if(!Number.isInteger(seed)||seed<0||seed>4294967295)throw Error('seed는 0부터 4294967295까지의 정수여야 합니다.');
    const random=rng((seed^hash32(source.typeId))>>>0),question=kind==='dice-target-bottom'?diceQuestion(difficulty,random):kind==='checker-stack-count'?checkerQuestion(difficulty,random):kind==='tetra-cube-hole-count'?tetraQuestion(difficulty,random):kind==='block-build-count'?blockBuildQuestion(difficulty,random):fillQuestion(kind,difficulty,random);
    const responseMode=question.payload.responseMode,semantic=JSON.stringify(question.payload),id=`spatial-${source.typeId}-${difficulty}-${seed}-${hash32(semantic).toString(16).padStart(8,'0')}`;
    const complete={...question,id,typeId:source.typeId,number:source.number,domain:source.domain||'도형',difficulty,seed,answerCandidates:[clone(question.answer)],variant:{family:'replacement-spatial',spatialFamily:kind,difficulty,seed,version:VERSION,visibleEvidence:'coordinate-model',originalReprint:false},learnerFit:{gate:'learner-fit',learner_stage:'6세 유치원',language:'짧은 한국어 지시문',representations:'높은 등각 입체와 좌표 기반 바탕그림',prerequisites:'수 세기, 쌓기나무, 주사위 면 추적, 간단한 더하기와 빼기',reasoningLoad:POLICY[kind][LEVELS.indexOf(difficulty)],responseMode,status:'candidate'},evidence:{owner:'challenge_studio',reviewer:'parent-independent-qa',release:'locked',sourceLocator:source.typeId,gate:'single-answer-visible-evidence',criteria:['exactly-one-answer','canonical-high-isometric-camera','visible-or-constrained-hidden-cubes','clear-cube-boundaries']}};
    complete.payload.sourceTypeId=source.typeId;complete.payload.difficulty=difficulty;complete.payload.seed=seed;
    if(!complete.prompt||complete.answer===undefined||!/^<svg\b/.test(complete.problemHtml)||!/^<svg\b/.test(complete.solutionDiagram)||/undefined|NaN/.test(complete.problemHtml+complete.solutionDiagram))throw Error('공간 문항 표현 검증에 실패했습니다.');
    return freeze(complete);
  }

  const api=Object.freeze({version:VERSION,supports,levels,notes,generate,occurrences:clone(OCCURRENCES)});
  root.HFChallengeReplacementSpatial=api;
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
