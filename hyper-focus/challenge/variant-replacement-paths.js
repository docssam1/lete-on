(function(root){
  'use strict';

  const VERSION='replacement-paths-20260911-v1';
  const STAGE='6세 / 유치원';
  const LEVELS=['easy','same','hard'];
  const FAMILIES={
    shortest:new Set(['r3-main-9-shortest-path-grid','r4-extra-4-shortest-path-grid']),
    partition:new Set(['r3-extra-1-congruent-marked-partition','r4-main-18-congruent-marked-partition']),
    network:new Set(['r4-extra-6-simple-path-network'])
  };
  const EXPECTED_KIND={shortest:'shortest-path-grid',partition:'congruent-marked-partition',network:'simple-path-network'};
  const NOTES={
    shortest:['3×3의 작은 모눈, 검은 지점 1개, 대각선 1개','4×3의 작은 모눈, 검은 지점 1개, 대각선 1개','5×4의 작은 모눈, 검은 지점 1개, 대각선 1개'],
    partition:['합동인 두 부분으로 나눌 그림 1개','합동인 두 부분으로 나눌 그림 2개','합동인 두 부분으로 나눌 그림 3개'],
    network:['갈림이 적은 길에서 재방문 없이 세기','갈림이 늘어난 길에서 재방문 없이 세기','여러 갈림이 연결된 길에서 재방문 없이 세기']
  };
  const INK='#24445b', GRID='#8195a2', BLUE='#4f93ad', ORANGE='#d17940', GREEN='#2f7c5c';
  const DIRS=[[1,0],[-1,0],[0,1],[0,-1]];

  const clone=value=>JSON.parse(JSON.stringify(value));
  const freeze=value=>{if(value&&typeof value==='object'&&!Object.isFrozen(value)){Object.values(value).forEach(freeze);Object.freeze(value);}return value;};
  const esc=value=>String(value).replace(/[&<>"']/g,character=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[character]));
  const pointKey=point=>point[0]+','+point[1];
  const pointSort=(left,right)=>left[1]-right[1]||left[0]-right[0];
  const samePoint=(left,right)=>left[0]===right[0]&&left[1]===right[1];
  const bitCount=value=>{let count=0;for(let current=value;current;current>>>=1)count+=current&1;return count;};
  function hash(value){let result=2166136261;for(const character of String(value))result=Math.imul(result^character.charCodeAt(0),16777619);return result>>>0;}
  function svg(body,width,height,label,extra=''){
    return `<svg class="challenge-visual replacement-path-visual" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(label)}" style="width:100%;height:auto;max-height:none;font-family:'Malgun Gothic',sans-serif" ${extra}>${body}</svg>`;
  }
  const line=(x1,y1,x2,y2,color=INK,width=2,extra='')=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}" stroke-linecap="round" ${extra}/>`;
  const text=(x,y,value,size=14,color=INK,weight=700,anchor='middle')=>`<text x="${x}" y="${y}" fill="${color}" text-anchor="${anchor}" dominant-baseline="middle" font-size="${size}" font-weight="${weight}">${esc(value)}</text>`;

  function familyOf(source){
    if(!source||!source.payload)return null;
    for(const family of Object.keys(FAMILIES))if(FAMILIES[family].has(source.typeId)&&source.payload.kind===EXPECTED_KIND[family])return family;
    return null;
  }

  function supports(source){return familyOf(source)!==null;}
  function levels(source){const ok=supports(source);return {easy:ok,same:ok,hard:ok};}
  function notes(source){const family=familyOf(source);return family?NOTES[family].slice():[];}

  function monotoneWays(from,to,blocked){
    if(to[0]<from[0]||to[1]>from[1])return 0;
    const ways=new Map([[pointKey(from),1]]);
    for(let y=from[1];y>=to[1];y--)for(let x=from[0];x<=to[0];x++){
      const here=[x,y],key=pointKey(here);
      if(samePoint(here,from))continue;
      if(blocked&&samePoint(here,blocked)){ways.set(key,0);continue;}
      ways.set(key,(ways.get((x-1)+','+y)||0)+(ways.get(x+','+(y+1))||0));
    }
    return ways.get(pointKey(to))||0;
  }

  function solveShortest(spec){
    const start=[0,spec.rows],end=[spec.cols,0],diagonal=spec.diagonals[0];
    const before=monotoneWays(start,diagonal[0],spec.blocked[0]);
    const after=monotoneWays(diagonal[1],end,spec.blocked[0]);
    return {answer:before*after,before,after,distance:spec.cols+spec.rows-2+Math.SQRT2};
  }

  const shortestPools={};
  function shortestPool(difficulty){
    if(shortestPools[difficulty])return shortestPools[difficulty];
    const level=LEVELS.indexOf(difficulty),dims=[[3,3],[4,3],[5,4]][level],candidates=[];
    const [cols,rows]=dims,start=[0,rows],end=[cols,0];
    for(let diagonalX=0;diagonalX<cols;diagonalX++)for(let diagonalY=1;diagonalY<=rows;diagonalY++){
      const diagonal=[[diagonalX,diagonalY],[diagonalX+1,diagonalY-1]];
      const unblocked=monotoneWays(start,diagonal[0],null)*monotoneWays(diagonal[1],end,null);
      for(let x=0;x<=cols;x++)for(let y=0;y<=rows;y++){
        const blocked=[x,y];
        if([start,end,...diagonal].some(point=>samePoint(point,blocked)))continue;
        const spec={cols,rows,blocked:[blocked],directions:['E','N','NE'],diagonals:[diagonal],responseMode:'shortest-path-count'};
        const solved=solveShortest(spec);
        if(solved.answer<=0||solved.answer>=unblocked)continue;
        if(level===2&&solved.answer<4)continue;
        candidates.push({...spec,answer:solved.answer});
      }
    }
    candidates.sort((left,right)=>JSON.stringify(left).localeCompare(JSON.stringify(right)));
    if(candidates.length<24)throw new Error('가장 짧은 길 후보가 24개보다 적습니다.');
    shortestPools[difficulty]=freeze(candidates);
    return shortestPools[difficulty];
  }

  function renderShortest(spec,solution){
    const cell=42,gridWidth=spec.cols*cell,gridHeight=spec.rows*cell,left=(660-gridWidth)/2,top=30,blocked=spec.blocked[0],diagonal=spec.diagonals[0],solved=solveShortest(spec);
    let body='';
    for(let y=0;y<=spec.rows;y++)for(let x=0;x<spec.cols;x++)body+=line(left+x*cell,top+y*cell,left+(x+1)*cell,top+y*cell,GRID,1.8,'data-grid-edge="horizontal"');
    for(let x=0;x<=spec.cols;x++)for(let y=0;y<spec.rows;y++)body+=line(left+x*cell,top+y*cell,left+x*cell,top+(y+1)*cell,GRID,1.8,'data-grid-edge="vertical"');
    const a=[left+diagonal[0][0]*cell,top+diagonal[0][1]*cell],b=[left+diagonal[1][0]*cell,top+diagonal[1][1]*cell];
    body+=line(a[0],a[1],b[0],b[1],ORANGE,4,'data-diagonal="true"');
    for(let y=0;y<=spec.rows;y++)for(let x=0;x<=spec.cols;x++){
      const cx=left+x*cell,cy=top+y*cell;
      if(x===blocked[0]&&y===blocked[1])body+=`<circle cx="${cx}" cy="${cy}" r="9" fill="#263641" data-black-point="true"/>`;
      else body+=`<circle cx="${cx}" cy="${cy}" r="3.8" fill="#fff" stroke="#4f7488" stroke-width="1.4"/>`;
    }
    body+=text(left-18,top+gridHeight+18,'출발',13,INK,800)+text(left+gridWidth+18,top-17,'도착',13,INK,800);
    if(solution){
      body+=`<circle cx="${a[0]}" cy="${a[1]}" r="13" fill="#edf7f2" stroke="${GREEN}" stroke-width="1.5"/>${text(a[0],a[1],solved.before,12,GREEN,900)}`;
      body+=`<circle cx="${b[0]}" cy="${b[1]}" r="13" fill="#edf7f2" stroke="${GREEN}" stroke-width="1.5"/>${text(b[0],b[1],solved.after,12,GREEN,900)}`;
      body+=text(330,top+gridHeight+43,`${solved.before} × ${solved.after} = ${solved.answer}가지`,14,GREEN,900);
    }else body+=text(330,top+gridHeight+43,'주황색 대각선 길은 한 번만 사용할 수 있습니다.',13,'#526c7a',650);
    return svg(body,660,top+gridHeight+65,solution?'대각선 앞뒤의 길 수를 나누어 센 풀이':'검은 지점 하나와 주황색 대각선 하나가 있는 작은 모눈','data-compact-grid="true"');
  }

  function shortestQuestion(source,difficulty,seed){
    const pool=shortestPool(difficulty),spec=clone(pool[(seed+hash(source.typeId))%pool.length]),solved=solveShortest(spec);
    return {
      typeId:source.typeId,
      number:source.number,
      domain:source.domain||'논리추리',
      payload:{kind:'shortest-path-grid',cols:spec.cols,rows:spec.rows,blocked:spec.blocked,directions:spec.directions,diagonals:spec.diagonals,blackPointCount:1,diagonalCount:1,distanceModel:'unit-orthogonal-and-root-two-diagonal',responseMode:'shortest-path-count'},
      prompt:'출발점에서 도착점까지 그어진 길을 따라 가장 짧은 길로 가려고 합니다. 오른쪽, 위쪽 또는 주황색 대각선으로 움직이고, 검은 지점 1개를 지나지 않을 때 갈 수 있는 길은 모두 몇 가지일까요?',
      problemHtml:renderShortest(spec,false),
      answer:solved.answer,
      answerHtml:solved.answer+'가지',
      solution:`주황색 대각선을 지나면 오른쪽 한 번과 위쪽 한 번을 따로 가는 것보다 짧습니다. 따라서 가장 짧은 길은 모두 대각선을 지납니다. 대각선 시작점까지 ${solved.before}가지, 끝점부터 도착점까지 ${solved.after}가지이므로 ${solved.before}×${solved.after}=${solved.answer}가지입니다.`,
      solutionDiagram:renderShortest(spec,true),
      resultContract:'single-number'
    };
  }

  function connected(cells){
    if(!cells.length)return false;
    const available=new Set(cells.map(pointKey)),seen=new Set([pointKey(cells[0])]),queue=[cells[0]];
    while(queue.length){
      const current=queue.pop();
      for(const direction of DIRS){
        const next=[current[0]+direction[0],current[1]+direction[1]],key=pointKey(next);
        if(available.has(key)&&!seen.has(key)){seen.add(key);queue.push(next);}
      }
    }
    return seen.size===cells.length;
  }

  function normalizeCells(cells){
    const minX=Math.min(...cells.map(cell=>cell[0])),minY=Math.min(...cells.map(cell=>cell[1]));
    return cells.map(cell=>[cell[0]-minX,cell[1]-minY]).sort(pointSort);
  }

  function congruenceKey(cells){
    const forms=[];
    for(const swap of [false,true])for(const sx of [-1,1])for(const sy of [-1,1]){
      forms.push(normalizeCells(cells.map(([x,y])=>{const first=swap?y:x,second=swap?x:y;return [first*sx,second*sy];})).map(pointKey).join(';'));
    }
    return forms.sort()[0];
  }

  function rawPartitions(cells){
    const size=cells.length/2,solutions=[];
    for(let mask=1;mask<2**cells.length;mask++){
      if(!(mask&1)||bitCount(mask)!==size)continue;
      const first=cells.filter((_,index)=>mask&(1<<index)),second=cells.filter((_,index)=>!(mask&(1<<index)));
      if(connected(first)&&connected(second)&&congruenceKey(first)===congruenceKey(second))solutions.push([first.slice().sort(pointSort),second.slice().sort(pointSort)]);
    }
    return solutions;
  }

  function markedPartitions(board){
    return rawPartitions(board.cells).filter(parts=>parts.every(part=>board.markers.filter(marker=>part.some(cell=>samePoint(cell,marker))).length===1));
  }

  const PARTITION_BASES=[
    [[0,0],[1,0],[2,0],[3,0],[0,1],[1,1],[2,1],[0,2]],
    [[0,0],[1,0],[3,0],[0,1],[1,1],[2,1],[3,1],[0,2]],
    [[1,0],[2,0],[3,0],[0,1],[1,1],[2,1],[3,1],[0,2]],
    [[0,0],[1,0],[2,0],[3,0],[0,1],[1,1],[0,2],[1,2]],
    [[0,0],[1,0],[2,0],[3,0],[0,1],[3,1],[0,2],[1,2]],
    [[0,0],[3,0],[0,1],[1,1],[2,1],[3,1],[0,2],[1,2]],
    [[2,0],[3,0],[0,1],[1,1],[2,1],[3,1],[0,2],[1,2]],
    [[0,0],[1,0],[2,0],[3,0],[0,1],[2,1],[0,2],[2,2]]
  ];

  function transformed(cells,transform){
    return normalizeCells(cells.map(([x,y])=>{
      let first=transform&4?y:x,second=transform&4?x:y;
      if(transform&1)first=-first;
      if(transform&2)second=-second;
      return [first,second];
    }));
  }

  let partitionCandidates;
  function partitionPool(){
    if(partitionCandidates)return partitionCandidates;
    const candidates=new Map();
    PARTITION_BASES.forEach(base=>{
      for(let transform=0;transform<8;transform++){
        const cells=transformed(base,transform),partitions=rawPartitions(cells);
        if(partitions.length!==1)continue;
        const parts=partitions[0];
        parts[0].forEach(first=>parts[1].forEach(second=>{
          if(Math.abs(first[0]-second[0])+Math.abs(first[1]-second[1])<2)return;
          const markers=[first,second].map(point=>point.slice()).sort(pointSort),board={cells:clone(cells),markers};
          const solutions=markedPartitions(board);
          if(solutions.length!==1)return;
          const signature=board.cells.map(pointKey).join(';')+'|'+board.markers.map(pointKey).join(';');
          candidates.set(signature,{...board,parts:clone(solutions[0])});
        }));
      }
    });
    partitionCandidates=[...candidates.values()].sort((left,right)=>JSON.stringify(left).localeCompare(JSON.stringify(right)));
    if(partitionCandidates.length<72)throw new Error('유일해 분할 후보가 난이도별 24개보다 적습니다.');
    partitionCandidates=freeze(partitionCandidates);
    return partitionCandidates;
  }

  function treeMarker(cx,cy,size){
    return `<g data-partition-marker="tree" aria-label="나무 표식"><circle cx="${cx}" cy="${cy-size*.07}" r="${size*.19}" fill="#81b978" stroke="${GREEN}" stroke-width="1.2"/><circle cx="${cx-size*.13}" cy="${cy+size*.01}" r="${size*.13}" fill="#91c589" stroke="${GREEN}" stroke-width="1"/><circle cx="${cx+size*.13}" cy="${cy+size*.01}" r="${size*.13}" fill="#91c589" stroke="${GREEN}" stroke-width="1"/><rect x="${cx-size*.04}" y="${cy+size*.08}" width="${size*.08}" height="${size*.17}" fill="#9b6d46"/></g>`;
  }

  function renderPartitionBoard(board,index,count,solution){
    const slot=660/count,cell=count===1?45:count===2?38:31,maxX=Math.max(...board.cells.map(point=>point[0])),maxY=Math.max(...board.cells.map(point=>point[1])),width=(maxX+1)*cell,height=(maxY+1)*cell,x0=index*slot+(slot-width)/2,y0=48+(128-height)/2;
    const partByCell=new Map();
    board.parts.forEach((part,partIndex)=>part.forEach(position=>partByCell.set(pointKey(position),partIndex)));
    let body=text(index*slot+slot/2,22,count===1?'그림':'('+(index+1)+')',14,INK,800);
    board.cells.forEach(position=>{
      const x=x0+position[0]*cell,y=y0+position[1]*cell,part=partByCell.get(pointKey(position));
      body+=`<rect x="${x}" y="${y}" width="${cell}" height="${cell}" fill="${solution?(part===0?'#dcefe9':'#e8edf4'):'#fff'}" stroke="#708b9c" stroke-width="1.3"/>`;
    });
    if(solution)board.cells.forEach(position=>{
      const current=partByCell.get(pointKey(position)),x=x0+position[0]*cell,y=y0+position[1]*cell;
      for(const [dx,dy,edge] of [[1,0,[x+cell,y,x+cell,y+cell]],[0,1,[x,y+cell,x+cell,y+cell]]]){
        const neighbor=partByCell.get((position[0]+dx)+','+(position[1]+dy));
        if(neighbor!==undefined&&neighbor!==current)body+=line(...edge,'#2456c4',3.4,'data-partition-boundary="true"');
      }
    });
    board.markers.forEach(position=>{body+=treeMarker(x0+(position[0]+.5)*cell,y0+(position[1]+.5)*cell,cell);});
    return body;
  }

  function renderPartition(boards,solution){
    const body=boards.map((board,index)=>renderPartitionBoard(board,index,boards.length,solution)).join('')+text(330,213,solution?'굵은 파란 선이 유일한 나눔입니다.':'각 부분에 나무 표식이 하나씩 들어가게 나누세요.',13,solution?GREEN:'#526c7a',700);
    return svg(body,660,232,solution?'각 부분에 나무 표식 하나가 들어가는 유일한 합동 분할 풀이':'나무 표식이 두 개 있는 작은 모눈 도형');
  }

  function partitionQuestion(source,difficulty,seed){
    const pool=partitionPool(),count=LEVELS.indexOf(difficulty)+1,start=(seed+hash(source.typeId))%pool.length,boards=[];
    for(let offset=0;boards.length<count;offset++){
      const candidate=clone(pool[(start+offset*37)%pool.length]);
      const signature=candidate.cells.map(pointKey).join(';')+'|'+candidate.markers.map(pointKey).join(';');
      if(!boards.some(board=>board.signature===signature))boards.push({...candidate,signature});
    }
    boards.forEach(board=>{delete board.signature;if(markedPartitions(board).length!==1)throw new Error('분할 그림의 해가 한 가지가 아닙니다.');});
    const answer=boards.map(board=>clone(board.parts));
    return {
      typeId:source.typeId,
      number:source.number,
      domain:source.domain||'도형',
      payload:{kind:'congruent-marked-partition',boards:boards.map(board=>({cells:board.cells,markers:board.markers})),allowRotation:true,allowReflection:true,oneMarkerPerPart:true,uniqueSolutionCount:1,responseMode:'draw-partition-lines'},
      prompt:`다음 ${boards.length===1?'그림을':'그림들을'} 같은 모양, 같은 크기의 두 부분으로 나누세요. 각 부분에는 나무 표식이 하나씩 들어가야 합니다. 두 부분은 돌리거나 뒤집었을 때 겹치면 같은 모양입니다.`,
      problemHtml:renderPartition(boards,false),
      answer,
      answerHtml:boards.length===1?'풀이 그림과 같이 나누기':boards.map((_,index)=>'('+(index+1)+') 풀이 그림과 같이 나누기').join(' · '),
      solution:'각 그림의 모든 칸을 빠짐없이 두 부분으로 나눕니다. 두 부분의 칸 수가 같고, 돌리거나 뒤집어 겹치며, 각 부분에 나무 표식이 하나씩 들어가는 나눔은 풀이 그림의 한 가지뿐입니다.',
      solutionDiagram:renderPartition(boards,true),
      resultContract:'unique-drawing-partition'
    };
  }

  function enumerateSimplePaths(payload){
    const neighbors=Object.fromEntries(payload.vertices.map(vertex=>[vertex.id,[]]));
    payload.edges.forEach(edge=>{neighbors[edge[0]].push(edge[1]);neighbors[edge[1]].push(edge[0]);});
    let count=0;const firstCounts={};
    function visit(node,seen,first){
      if(node===payload.end){count++;firstCounts[first]=(firstCounts[first]||0)+1;return;}
      neighbors[node].forEach(next=>{
        if(seen.has(next))return;
        seen.add(next);visit(next,seen,first||next);seen.delete(next);
      });
    }
    visit(payload.start,new Set([payload.start]),null);
    return {count,firstCounts};
  }

  function ladderGraph(columns,mask){
    const vertices=[{id:'A',x:48,y:116},{id:'T',x:612,y:116}],edges=[['A','U0'],['A','L0']];
    const left=110,right=550,gap=columns===1?0:(right-left)/(columns-1);
    for(let index=0;index<columns;index++)vertices.push({id:'U'+index,x:Math.round(left+index*gap),y:52},{id:'L'+index,x:Math.round(left+index*gap),y:180});
    for(let index=0;index<columns-1;index++)edges.push(['U'+index,'U'+(index+1)],['L'+index,'L'+(index+1)]);
    edges.push(['U'+(columns-1),'T'],['L'+(columns-1),'T']);
    for(let index=0;index<columns;index++)if(mask&(1<<index))edges.push(['U'+index,'L'+index]);
    const payload={kind:'simple-path-network',vertices,edges,start:'A',end:'T',undirected:true,noRevisit:true,columns,rungMask:mask,responseMode:'number'};
    const solved=enumerateSimplePaths(payload);
    payload.branchCounts=Object.values(solved.firstCounts).sort((leftCount,rightCount)=>rightCount-leftCount);
    return {...payload,answer:solved.count};
  }

  const networkPools={};
  function networkPool(difficulty){
    if(networkPools[difficulty])return networkPools[difficulty];
    const level=LEVELS.indexOf(difficulty),ranges=[{min:3,max:5,bits:[1,2]},{min:4,max:6,bits:[2,3]},{min:5,max:7,bits:[3,4,5]}][level],pool=[];
    for(let columns=ranges.min;columns<=ranges.max;columns++)for(let mask=1;mask<2**columns;mask++)if(ranges.bits.includes(bitCount(mask)))pool.push(ladderGraph(columns,mask));
    pool.sort((left,right)=>left.columns-right.columns||left.rungMask-right.rungMask);
    if(pool.length<24)throw new Error('재방문 없는 길 후보가 24개보다 적습니다.');
    networkPools[difficulty]=freeze(pool);
    return networkPools[difficulty];
  }

  function childIcon(x,y){
    return `<g aria-label="혜연"><circle cx="${x}" cy="${y-23}" r="8" fill="#f5d3b8" stroke="${INK}" stroke-width="1.3"/><path d="M${x} ${y-15}v20m-11-9 11 7 11-7m-9 19-2 16m-8-16 2 16" fill="none" stroke="${INK}" stroke-width="2" stroke-linecap="round"/></g>`;
  }
  function houseIcon(x,y){
    return `<g aria-label="과자 집"><path d="M${x-19} ${y-5}L${x} ${y-25}l19 20v24h-38z" fill="#f5dfbb" stroke="${INK}" stroke-width="1.5"/><rect x="${x-5}" y="${y+5}" width="10" height="14" fill="#fff" stroke="${INK}" stroke-width="1"/></g>`;
  }

  function renderNetwork(payload,solution){
    const byId=Object.fromEntries(payload.vertices.map(vertex=>[vertex.id,vertex]));
    let body='';
    payload.edges.forEach((edge,index)=>{
      const from=byId[edge[0]],to=byId[edge[1]],first=edge.includes('A'),color=solution&&first?(edge.includes('U0')?'#3d8ba6':'#7e9b4e'):GRID;
      body+=line(from.x,from.y,to.x,to.y,color,solution&&first?4:2.2,`data-network-edge="${index}"`);
    });
    payload.vertices.forEach(vertex=>{body+=`<circle cx="${vertex.x}" cy="${vertex.y}" r="${vertex.id==='A'||vertex.id==='T'?6:5}" fill="#fff" stroke="${INK}" stroke-width="1.5" data-network-vertex="${vertex.id}"/>`;});
    body+=childIcon(22,117)+houseIcon(638,114)+text(48,215,'출발',13,INK,800)+text(612,215,'도착',13,INK,800);
    if(solution){
      const counts=payload.branchCounts;
      body+=text(118,30,'위쪽 시작 '+counts[0]+'가지',12,'#3d8ba6',800)+text(118,204,'아래쪽 시작 '+counts[1]+'가지',12,'#6f8d42',800);
      body+=text(330,222,counts[0]+' + '+counts[1]+' = '+payload.answer+'가지',14,GREEN,900);
    }
    return svg(body,660,242,solution?'첫 갈림별로 재방문 없는 길을 센 풀이':'여러 갈림과 지점이 있는 길 그림');
  }

  function networkQuestion(source,difficulty,seed){
    const pool=networkPool(difficulty),spec=clone(pool[(seed+hash(source.typeId))%pool.length]),answer=spec.answer;
    delete spec.answer;
    return {
      typeId:source.typeId,
      number:source.number,
      domain:source.domain||'논리추리',
      payload:spec,
      prompt:'혜연이가 과자 집으로 가는 길은 모두 몇 가지입니까? 단, 지나간 지점은 다시 지나가지 않습니다.',
      problemHtml:renderNetwork({...spec,answer},false),
      answer,
      answerHtml:answer+'가지',
      solution:`첫 갈림에서 위쪽 길로 시작하는 경우는 ${spec.branchCounts[0]}가지, 아래쪽 길로 시작하는 경우는 ${spec.branchCounts[1]}가지입니다. 지나간 지점을 다시 지나는 경우를 빼면 ${spec.branchCounts[0]}+${spec.branchCounts[1]}=${answer}가지입니다.`,
      solutionDiagram:renderNetwork({...spec,answer},true),
      resultContract:'single-number'
    };
  }

  function generate(source,difficulty,seed){
    const family=familyOf(source);
    if(!family||!LEVELS.includes(difficulty))throw new Error('지원하지 않는 원문 또는 난이도입니다.');
    if(!Number.isSafeInteger(seed)||seed<0||seed>4294967295)throw new Error('seed는 0부터 4294967295까지의 정수여야 합니다.');
    const question=family==='shortest'?shortestQuestion(source,difficulty,seed):family==='partition'?partitionQuestion(source,difficulty,seed):networkQuestion(source,difficulty,seed);
    const payloadSignature=JSON.stringify(question.payload);
    question.id=`replacement-path-${source.typeId}-${difficulty}-${seed}-${hash(payloadSignature).toString(16).padStart(8,'0')}`;
    question.difficulty=difficulty;
    question.seed=seed;
    question.variant={family:'replacement-paths',replacementFamily:family,difficulty,seed,version:VERSION,reasoningLoad:NOTES[family][LEVELS.indexOf(difficulty)],visibleEvidence:'enumerated-single-answer',originalReprint:false};
    question.learnerFit={gate:'learner-fit',learner_stage:STAGE,language:'짧은 한국어 문장과 그림 안의 최소 표기',representations:family==='partition'?'작은 모눈과 나무 표식':family==='shortest'?'작은 모눈, 검은 지점, 대각선 한 개':'점과 선으로 된 길',prerequisites:'수 세기, 모눈 이동, 같은 모양 비교',reasoningLoad:question.variant.reasoningLoad,status:'candidate'};
    return freeze(question);
  }

  const api=Object.freeze({VERSION,STAGE,supports,levels,notes,generate});
  root.HFChallengeReplacementPaths=api;
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
