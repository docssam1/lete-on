'use strict';

const assert=require('node:assert/strict');
const replacement=require('../challenge/variant-replacement-paths.js');

const LEVELS=['easy','same','hard'];
const DIRECTIONS=[[1,0],[-1,0],[0,1],[0,-1]];
const pointKey=point=>point[0]+','+point[1];
const pointSort=(left,right)=>left[1]-right[1]||left[0]-right[0];
const samePoint=(left,right)=>left[0]===right[0]&&left[1]===right[1];
const bitCount=value=>{let count=0;for(let current=value;current;current>>>=1)count+=current&1;return count;};

function connected(cells){
  if(!cells.length)return false;
  const available=new Set(cells.map(pointKey)),seen=new Set([pointKey(cells[0])]),queue=[cells[0]];
  while(queue.length){
    const current=queue.pop();
    for(const direction of DIRECTIONS){
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
    const transformed=cells.map(([x,y])=>{const first=swap?y:x,second=swap?x:y;return [first*sx,second*sy];});
    forms.push(normalizeCells(transformed).map(pointKey).join(';'));
  }
  return forms.sort()[0];
}

function solvePartitionBoard(board){
  assert(Array.isArray(board.cells)&&board.cells.length%2===0,'partition board must have an even number of cells');
  assert.equal(new Set(board.cells.map(pointKey)).size,board.cells.length,'partition cells must be unique');
  assert.equal(board.markers.length,2,'partition board must have exactly two markers');
  assert.equal(new Set(board.markers.map(pointKey)).size,2,'partition markers must occupy different cells');
  assert(board.markers.every(marker=>board.cells.some(cell=>samePoint(cell,marker))),'partition marker must be on a board cell');
  const solutions=[],partSize=board.cells.length/2;
  for(let mask=1;mask<2**board.cells.length;mask++){
    if(!(mask&1)||bitCount(mask)!==partSize)continue;
    const first=board.cells.filter((_,index)=>mask&(1<<index)).slice().sort(pointSort);
    const second=board.cells.filter((_,index)=>!(mask&(1<<index))).slice().sort(pointSort);
    if(!connected(first)||!connected(second)||congruenceKey(first)!==congruenceKey(second))continue;
    if([first,second].some(part=>board.markers.filter(marker=>part.some(cell=>samePoint(cell,marker))).length!==1))continue;
    solutions.push([first,second]);
  }
  assert.equal(solutions.length,1,'partition must have exactly one solution after rotation and reflection');
  return solutions[0];
}

function solveShortestPayload(payload){
  assert.equal(payload.blocked.length,1,'shortest path must contain exactly one black point');
  assert.equal(payload.diagonals.length,1,'shortest path must contain exactly one diagonal');
  assert.deepEqual(payload.directions,['E','N','NE'],'shortest path directions changed');
  const start=[0,payload.rows],end=[payload.cols,0],blocked=payload.blocked[0],diagonal=payload.diagonals[0];
  assert(![start,end,...diagonal].some(point=>samePoint(point,blocked)),'black point hides a required endpoint');
  assert.equal(diagonal[1][0]-diagonal[0][0],1,'diagonal must move one column right');
  assert.equal(diagonal[0][1]-diagonal[1][1],1,'diagonal must move one row up');
  const completed=[];
  function visit(point,distance,usedDiagonal,path){
    if(samePoint(point,end)){completed.push({distance,usedDiagonal,path:path.slice()});return;}
    const moves=[{to:[point[0]+1,point[1]],distance:1,diagonal:false},{to:[point[0],point[1]-1],distance:1,diagonal:false}];
    if(samePoint(point,diagonal[0]))moves.push({to:diagonal[1],distance:Math.SQRT2,diagonal:true});
    moves.forEach(move=>{
      if(move.to[0]>payload.cols||move.to[1]<0||samePoint(move.to,blocked))return;
      path.push(move.to);visit(move.to,distance+move.distance,usedDiagonal||move.diagonal,path);path.pop();
    });
  }
  visit(start,0,false,[start]);
  assert(completed.length>0,'shortest path graph has no route');
  const minimum=Math.min(...completed.map(route=>route.distance));
  const shortest=completed.filter(route=>Math.abs(route.distance-minimum)<1e-9);
  assert(shortest.every(route=>route.usedDiagonal),'every shortest path must use the single diagonal');
  return {answer:shortest.length,distance:minimum,allShortestUseDiagonal:true};
}

function solveNetworkPayload(payload){
  const ids=new Set(payload.vertices.map(vertex=>vertex.id));
  assert.equal(ids.size,payload.vertices.length,'network vertex ids must be unique');
  assert(ids.has(payload.start)&&ids.has(payload.end),'network start and end are required');
  const neighbors=Object.fromEntries(payload.vertices.map(vertex=>[vertex.id,[]])),edgeKeys=new Set();
  payload.edges.forEach(edge=>{
    assert.equal(edge.length,2,'network edge needs two endpoints');
    assert(ids.has(edge[0])&&ids.has(edge[1])&&edge[0]!==edge[1],'network edge endpoint is invalid');
    const edgeKey=edge.slice().sort().join('|');
    assert(!edgeKeys.has(edgeKey),'network contains a duplicate edge');
    edgeKeys.add(edgeKey);neighbors[edge[0]].push(edge[1]);neighbors[edge[1]].push(edge[0]);
  });
  let count=0;const firstCounts={};
  function visit(node,seen,first){
    if(node===payload.end){count++;firstCounts[first]=(firstCounts[first]||0)+1;return;}
    neighbors[node].forEach(next=>{
      if(seen.has(next))return;
      seen.add(next);visit(next,seen,first||next);seen.delete(next);
    });
  }
  visit(payload.start,new Set([payload.start]),null);
  assert(count>0,'network has no route');
  return {answer:count,branchCounts:Object.values(firstCounts).sort((left,right)=>right-left)};
}

function solvePayload(payload){
  assert(payload&&typeof payload==='object','payload is required');
  if(payload.kind==='shortest-path-grid')return solveShortestPayload(payload).answer;
  if(payload.kind==='congruent-marked-partition')return payload.boards.map(solvePartitionBoard);
  if(payload.kind==='simple-path-network')return solveNetworkPayload(payload).answer;
  throw new Error('unsupported replacement path payload: '+payload.kind);
}

function solve(question){return solvePayload(question.payload);}

function semanticSignature(question){
  const payload=question.payload;
  if(payload.kind==='shortest-path-grid')return JSON.stringify({cols:payload.cols,rows:payload.rows,blocked:payload.blocked,diagonals:payload.diagonals});
  if(payload.kind==='congruent-marked-partition')return JSON.stringify(payload.boards);
  return JSON.stringify({vertices:payload.vertices,edges:payload.edges});
}

function run(){
  const fixtures=[
    {typeId:'r3-main-9-shortest-path-grid',number:9,domain:'논리추리',payload:{kind:'shortest-path-grid'}},
    {typeId:'r4-extra-4-shortest-path-grid',number:4,domain:'도형',payload:{kind:'shortest-path-grid'}},
    {typeId:'r3-extra-1-congruent-marked-partition',number:1,domain:'도형',payload:{kind:'congruent-marked-partition'}},
    {typeId:'r4-main-18-congruent-marked-partition',number:18,domain:'도형',payload:{kind:'congruent-marked-partition'}},
    {typeId:'r4-extra-6-simple-path-network',number:6,domain:'논리추리',payload:{kind:'simple-path-network'}}
  ];
  const byFamily={shortest:0,partition:0,network:0},distinct={};
  assert.equal(replacement.supports({typeId:'r3-main-9',payload:{kind:'shortest-path-grid'}}),false,'near-named type must not be reused');
  assert.equal(replacement.supports({typeId:'r3-main-9-shortest-path-grid',payload:{kind:'links'}}),false,'wrong payload kind must be rejected');
  assert.deepEqual(replacement.levels({typeId:'not-a-source',payload:{kind:'shortest-path-grid'}}),{easy:false,same:false,hard:false});
  for(const fixture of fixtures){
    assert(replacement.supports(fixture),fixture.typeId+' is not supported');
    assert.deepEqual(replacement.levels(fixture),{easy:true,same:true,hard:true});
    assert.equal(replacement.notes(fixture).length,3);
    const sourceBefore=JSON.stringify(fixture);
    for(const difficulty of LEVELS){
      const signatures=new Set();
      for(let seed=0;seed<24;seed++){
        const question=replacement.generate(fixture,difficulty,seed),again=replacement.generate(fixture,difficulty,seed);
        assert.deepEqual(question,again,'generation must be deterministic');
        assert.equal(JSON.stringify(fixture),sourceBefore,'source question was mutated');
        assert.equal(question.typeId,fixture.typeId);
        assert.equal(question.difficulty,difficulty);
        assert.equal(question.seed,seed);
        assert.equal(question.variant.family,'replacement-paths');
        assert.equal(question.variant.visibleEvidence,'enumerated-single-answer');
        assert(Object.isFrozen(question)&&Object.isFrozen(question.payload),'generated question must be frozen');
        assert(!/undefined|NaN/.test(question.problemHtml+question.solutionDiagram));
        assert.deepEqual(question.answer,solve(question),fixture.typeId+' '+difficulty+' '+seed+' answer mismatch');
        signatures.add(semanticSignature(question));
        const payload=question.payload;
        if(payload.kind==='shortest-path-grid'){
          byFamily.shortest++;
          const independent=solveShortestPayload(payload);
          assert.equal(independent.answer,question.answer);
          assert(payload.cols<=5&&payload.rows<=4,'shortest path grid is not compact');
          assert.equal(payload.blackPointCount,1);
          assert.equal(payload.diagonalCount,1);
          assert.equal((question.problemHtml.match(/data-black-point="true"/g)||[]).length,1);
          assert.equal((question.problemHtml.match(/data-diagonal="true"/g)||[]).length,1);
          assert(question.problemHtml.includes('data-compact-grid="true"'));
          assert(question.prompt.includes('가장 짧은 길'));
          assert(!/최단거리/.test(question.prompt+question.solution+question.problemHtml+question.solutionDiagram));
        }else if(payload.kind==='congruent-marked-partition'){
          byFamily.partition++;
          assert.equal(payload.boards.length,LEVELS.indexOf(difficulty)+1);
          assert.equal(payload.allowRotation,true);
          assert.equal(payload.allowReflection,true);
          assert.equal(payload.oneMarkerPerPart,true);
          assert.equal(payload.uniqueSolutionCount,1);
          assert.equal((question.problemHtml.match(/data-partition-marker="tree"/g)||[]).length,payload.boards.length*2);
          assert.equal((question.problemHtml.match(/data-partition-boundary="true"/g)||[]).length,0,'student diagram reveals partition');
          assert((question.solutionDiagram.match(/data-partition-boundary="true"/g)||[]).length>=payload.boards.length);
          payload.boards.forEach(board=>solvePartitionBoard(board));
        }else{
          byFamily.network++;
          const independent=solveNetworkPayload(payload);
          assert.equal(independent.answer,question.answer);
          assert.deepEqual(independent.branchCounts,payload.branchCounts);
          assert.equal(payload.noRevisit,true);
          assert.equal(payload.undirected,true);
          assert(question.prompt.includes('지나간 지점은 다시 지나가지 않습니다'));
          assert.equal((question.problemHtml.match(/data-network-edge=/g)||[]).length,payload.edges.length);
          assert.equal((question.problemHtml.match(/data-network-vertex=/g)||[]).length,payload.vertices.length);
        }
      }
      assert.equal(signatures.size,24,fixture.typeId+' '+difficulty+' needs at least 24 distinct seed variants');
      distinct[fixture.typeId+':'+difficulty]=signatures.size;
    }
  }
  for(const seed of [-1,1.5,NaN,Infinity,4294967296])assert.throws(()=>replacement.generate(fixtures[0],'same',seed));
  assert.throws(()=>replacement.generate(fixtures[0],'bogus',1));
  assert.throws(()=>replacement.generate({typeId:'r3-main-9',payload:{kind:'shortest-path-grid'}},'same',1));
  const result={ok:true,version:replacement.VERSION,fixtures:fixtures.length,questions:Object.values(byFamily).reduce((sum,value)=>sum+value,0),byFamily,distinct};
  process.stdout.write('CHALLENGE_REPLACEMENT_PATHS_OK '+JSON.stringify(result)+'\n');
  return result;
}

if(require.main===module)run();

module.exports={solve,solvePayload};
