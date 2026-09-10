'use strict';

const assert=require('node:assert/strict');
const spatial=require('../challenge/variant-replacement-spatial.js');
const specials=require('../challenge/concept-replacement-specials.js');
require('../challenge/challenge-bank.js');
const more=require('../challenge/exam-more.js');

const LEVELS=['easy','same','hard'];
const SOURCES=[
  ['mock-dice-target-bottom','dice-visible-faces'],
  ['r3-main-13','dice-visible-faces'],
  ['r4-main-15','dice-visible-faces'],
  ['r3-main-15-checker-stack-count','checker-stack-count'],
  ['r4-extra-2-checker-stack-count','checker-stack-count'],
  ['r3-main-18-tetra-cube-hole-count','tetra-cube-hole-count'],
  ['r4-extra-3-tetra-cube-hole-count','tetra-cube-hole-count'],
  ['r3-extra-3-block-build-count','block-build-count'],
  ['r3-extra-6-stack-box-fill','cube-count-fill-custom'],
  ['r4-extra-5-stack-box-fill','stack-box-fill']
].map(([typeId,kind],index)=>({typeId,number:index+1,domain:'도형',payload:{kind}}));

const clone=value=>JSON.parse(JSON.stringify(value));
const total=values=>values.reduce((sum,value)=>sum+value,0);
const equal=(left,right)=>JSON.stringify(left)===JSON.stringify(right);

function solveDice(payload){
  // Rotate labelled face-normal vectors. This does not reuse the generator's
  // face-name transition table.
  let faces=[
    {normal:[0,0,1],value:payload.startOrientation.top},
    {normal:[0,0,-1],value:payload.startOrientation.bottom},
    {normal:[0,-1,0],value:payload.startOrientation.north},
    {normal:[0,1,0],value:payload.startOrientation.south},
    {normal:[1,0,0],value:payload.startOrientation.east},
    {normal:[-1,0,0],value:payload.startOrientation.west}
  ];
  for(const direction of payload.route){
    faces=faces.map(face=>{const [x,y,z]=face.normal,normal=direction==='N'?[x,-z,y]:direction==='S'?[x,z,-y]:direction==='E'?[z,y,-x]:[-z,y,x];return {normal,value:face.value};});
  }
  const valueAt=normal=>{const matches=faces.filter(face=>equal(face.normal,normal));assert.equal(matches.length,1,'each final direction must have exactly one face');return matches[0].value;};
  return [valueAt([0,0,1]),valueAt([0,1,0]),valueAt([1,0,0])];
}

function solvePayload(payload){
  switch(payload.kind){
    case 'dice-visible-faces':return solveDice(payload);
    case 'checker-stack-count':{
      const answer={black:0,white:0};
      payload.heightMap.forEach((row,y)=>row.forEach((height,x)=>{for(let z=0;z<height;z++)answer[(x+y+z+payload.checkerOffset)%2===0?'black':'white']++;}));
      return answer;
    }
    case 'tetra-cube-hole-count':{
      const cubes=total(payload.heightMap.flat());assert.equal(cubes%4,0,'tetra-cube model must contain a multiple of four cubes');return cubes/4;
    }
    case 'block-build-count':return {A:payload.width*payload.depth*payload.height-payload.bPieces.length*2,B:payload.bPieces.length};
    case 'stack-box-fill':return payload.width*payload.depth*payload.boxH-total(payload.heightMap.flat());
    case 'cube-count-fill-custom':{
      const placed=total(payload.heightMap.flat()),full=payload.width*payload.depth*payload.boxH;return [placed,full-placed];
    }
    default:throw Error(`unsupported spatial payload kind: ${payload.kind}`);
  }
}

function solve(question){assert(question&&question.payload,'question payload is required');return solvePayload(question.payload);}

function assertMonotone(map,label){
  assert(Array.isArray(map)&&map.length>0&&map.every(row=>Array.isArray(row)&&row.length===map[0].length),`${label}: rectangular height map required`);
  for(let y=0;y<map.length;y++)for(let x=0;x<map[0].length;x++){
    assert(Number.isInteger(map[y][x])&&map[y][x]>=0,`${label}: heights must be nonnegative integers`);
    if(x)assert(map[y][x]<=map[y][x-1],`${label}: height rises toward the open right side`);
    if(y)assert(map[y][x]<=map[y-1][x],`${label}: height rises toward the open front side`);
  }
}

function assertPath(payload,difficulty,label){
  const delta={N:[-1,0],S:[1,0],E:[0,1],W:[0,-1]},inverse={N:'S',S:'N',E:'W',W:'E'},path=[payload.start.slice()];
  for(const [index,direction] of payload.route.entries()){
    assert(delta[direction],`${label}: invalid direction`);if(index)assert.notEqual(direction,inverse[payload.route[index-1]],`${label}: immediate reversal`);
    const prior=path.at(-1),move=delta[direction],next=[prior[0]+move[0],prior[1]+move[1]];
    assert(next[0]>=0&&next[0]<payload.rows&&next[1]>=0&&next[1]<payload.cols,`${label}: route leaves board`);
    assert(!path.some(cell=>equal(cell,next)),`${label}: route revisits a cell`);path.push(next);
  }
  assert.deepEqual(path,payload.path,`${label}: stored path differs from route`);
  const expectedLength=difficulty==='easy'?4:5,turns=payload.route.slice(1).filter((direction,index)=>direction!==payload.route[index]).length;
  assert.equal(payload.route.length,expectedLength,`${label}: roll length`);assert.equal(payload.targetStep,expectedLength,`${label}: target step`);
  assert.equal(payload.rows,4,`${label}: board rows`);assert.equal(payload.cols,4,`${label}: board columns`);
  assert(turns>=(difficulty==='easy'?1:difficulty==='same'?2:3),`${label}: too few turns`);
  if(difficulty==='hard')assert(new Set(payload.route).size>=3,`${label}: hard route must use three directions`);
  assert.equal((payload.problemHtml.match(/class="roll-arrow"/g)||[]).length,expectedLength,`${label}: every roll needs one arrow`);
  const lengths=[...payload.problemHtml.matchAll(/data-arrow-length="([\d.]+)"/g)].map(match=>Number(match[1]));
  assert.equal(lengths.length,expectedLength,`${label}: arrow length evidence`);assert(lengths.every(length=>length>=37),`${label}: arrow shafts must stay long`);
  assert(/markerWidth="2\.7" markerHeight="2\.7"/.test(payload.problemHtml),`${label}: arrowheads must stay small`);
  assert(/data-dice-board="4x4"/.test(payload.problemHtml),`${label}: a 4×4 isometric board is required`);
  assert.equal((payload.problemHtml.match(/data-die-on-start="true"/g)||[]).length,1,`${label}: one 3D die must sit on the start cell`);
  assert(/data-finish-die="blank"/.test(payload.problemHtml),`${label}: the problem needs a blank finish die`);
  assert(/data-finish-die="solved"/.test(payload.solutionDiagram),`${label}: the solution needs a filled finish die`);
  assert.equal((payload.problemHtml.match(/data-response-slot=/g)||[]).length,3,`${label}: top, front, and right response slots are required`);
  assert.deepEqual([...payload.problemHtml.matchAll(/data-response-slot="([^"]+)"/g)].map(match=>match[1]),['top','front','right'],`${label}: response slot order`);
}

function assertTetra(payload,difficulty,label){
  const holes=[];payload.heightMap.forEach((row,y)=>row.forEach((height,x)=>{if(height===0)holes.push([x,y]);assert(height<=2,`${label}: pile must remain at most two levels`);}));
  assert.deepEqual(holes,payload.holes,`${label}: height-map holes differ from stored holes`);
  assert.equal(holes.length,difficulty==='easy'?1:2,`${label}: wrong visible hole count`);
  for(const [x,y] of holes)assert(x>0&&x<payload.width-1&&y>0&&y<payload.depth-1,`${label}: hole must be interior`);
  assert.equal(payload.topPieceCount,LEVELS.indexOf(difficulty)+1,`${label}: upper piece count`);
  const fromPieces=[];
  for(const piece of payload.pieces){
    assert.equal(piece.length,4,`${label}: every tetra-cube needs four cubes`);
    const set=new Set(piece.map(cell=>cell.join(','))),seen=new Set([piece[0].join(',')]),queue=[piece[0]];
    while(queue.length){const [x,y,z]=queue.shift();for(const [dx,dy,dz] of [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]]){const key=[x+dx,y+dy,z+dz].join(',');if(set.has(key)&&!seen.has(key)){seen.add(key);queue.push(key.split(',').map(Number));}}}
    assert.equal(seen.size,4,`${label}: disconnected tetra-cube`);fromPieces.push(...piece.map(cell=>cell.join(',')));
  }
  assert.equal(new Set(fromPieces).size,fromPieces.length,`${label}: tetra-cubes overlap`);
  const fromMap=[];payload.heightMap.forEach((row,y)=>row.forEach((height,x)=>{for(let z=0;z<height;z++)fromMap.push([x,y,z].join(','));}));
  assert.deepEqual(fromPieces.slice().sort(),fromMap.slice().sort(),`${label}: pieces do not cover the visible solid`);
  assert.equal(payload.cubeCount,fromMap.length,`${label}: cube count`);assert.equal(payload.pieces.length,fromMap.length/4,`${label}: tetra-cube count`);
  assert.equal((payload.problemHtml.match(/data-plan-hole=/g)||[]).length,holes.length,`${label}: top plan must expose every hole`);
  assert(payload.problemHtml.includes('위에서 본 바탕그림'),`${label}: required top-plan title`);
}

function assertBlock(payload,difficulty,label){
  const used=[];
  for(const piece of payload.bPieces){
    assert.equal(piece.length,2,`${label}: B block must contain two cubes`);
    assert.equal(piece.reduce((distance,cell,index)=>index?distance+Math.abs(cell[0]-piece[0][0])+Math.abs(cell[1]-piece[0][1])+Math.abs(cell[2]-piece[0][2]):0,0),1,`${label}: B cubes must share a face`);
    for(const cell of piece){assert(cell[0]>=0&&cell[0]<payload.width&&cell[1]>=0&&cell[1]<payload.depth,`${label}: B cube leaves solid`);assert.equal(cell[2],payload.height-1,`${label}: every B cube must be visible on top`);used.push(cell.join(','));}
  }
  assert.equal(new Set(used).size,used.length,`${label}: B blocks overlap`);
  const range=difficulty==='easy'?[2,3]:difficulty==='same'?[4,5]:[5,6];assert(payload.bPieces.length>=range[0]&&payload.bPieces.length<=range[1],`${label}: B count outside level`);
  assert.equal((payload.problemHtml.match(/data-b-connector="true"/g)||[]).length,payload.bPieces.length,`${label}: visible connector per B block`);
  assert(payload.width*payload.depth*payload.height<=36,`${label}: solid is too large for the learner stage`);
}

function assertFill(payload,difficulty,label){
  assertMonotone(payload.heightMap,label);assert.equal(payload.heightMap.length,payload.depth,`${label}: depth`);assert(payload.heightMap.every(row=>row.length===payload.width),`${label}: width`);
  assert(payload.heightMap.every(row=>row[0]===payload.boxH),`${label}: full left wall constrains hidden columns`);
  const placed=total(payload.heightMap.flat()),full=payload.width*payload.depth*payload.boxH;
  assert.equal(payload.placed,placed,`${label}: placed count`);assert.equal(payload.full,full,`${label}: box capacity`);assert.equal(payload.need,full-placed,`${label}: fill count`);assert(payload.need>0,`${label}: box must have space`);
  assert(/data-wireframe-edges="12"/.test(payload.problemHtml),`${label}: complete box wireframe required`);
  if(difficulty==='hard')assert.equal(full,36,`${label}: hard box capacity`);else if(difficulty==='same')assert([24,27].includes(full),`${label}: same box capacity`);else assert([16,18].includes(full),`${label}: easy box capacity`);
}

function semanticKey(payload){
  const model=clone(payload);for(const key of ['sourceTypeId','difficulty','seed','answer'])delete model[key];
  if(model.bPieces)model.bPieces=model.bPieces.map(piece=>piece.map(cell=>cell.join(',')).sort()).sort();
  if(model.pieces)model.pieces=model.pieces.map(piece=>piece.map(cell=>cell.join(',')).sort()).sort();
  return JSON.stringify(model);
}

function validateQuestion(question,source,difficulty,seed){
  const label=`${source.typeId} ${difficulty} seed ${seed}`,payload=question.payload;
  assert.equal(question.typeId,source.typeId,`${label}: source type`);assert.equal(question.difficulty,difficulty,`${label}: difficulty`);assert.equal(question.seed,seed,`${label}: seed`);
  assert.equal(question.variant.family,'replacement-spatial',`${label}: family`);assert.equal(question.variant.spatialFamily,source.payload.kind,`${label}: spatial family`);
  assert.deepEqual(question.answer,solve(question),`${label}: independent answer`);assert.deepEqual(question.answerCandidates,[question.answer],`${label}: exactly one accepted answer`);
  assert(Object.isFrozen(question)&&Object.isFrozen(payload),`${label}: generated model must be immutable`);
  assert(/^<svg\b/.test(question.problemHtml)&&/^<svg\b/.test(question.solutionDiagram),`${label}: inline SVG pair required`);
  assert(!/undefined|NaN|Infinity/.test(question.problemHtml+question.solutionDiagram),`${label}: invalid drawing value`);
  assert(/<title>[^<]+<\/title>/.test(question.problemHtml)&&/role="img"/.test(question.problemHtml),`${label}: accessible title required`);
  assert(/data-camera="geometry-standard-high-iso"/.test(question.problemHtml),`${label}: canonical high isometric camera required`);
  if(payload.kind==='dice-visible-faces'){
    assertPath({...payload,problemHtml:question.problemHtml,solutionDiagram:question.solutionDiagram},difficulty,label);
    assert.deepEqual(payload.queryFaces,['top','front','right'],`${label}: queried faces`);assert.equal(payload.responseMode,'three-visible-face-numbers',`${label}: response mode`);
    const orientation=payload.startOrientation,values=Object.values(orientation);assert.deepEqual(values.slice().sort((a,b)=>a-b),[1,2,3,4,5,6],`${label}: die labels`);
    assert.equal(orientation.top+orientation.bottom,7,`${label}: top opposite`);assert.equal(orientation.north+orientation.south,7,`${label}: north opposite`);assert.equal(orientation.east+orientation.west,7,`${label}: east opposite`);
  }else if(payload.kind==='checker-stack-count'){
    assertMonotone(payload.heightMap,label);assert.equal(Math.max(...payload.heightMap.flat()),LEVELS.indexOf(difficulty)+2,`${label}: maximum height`);
    assert.equal(total(Object.values(question.answer)),total(payload.heightMap.flat()),`${label}: color counts cover every cube`);
    assert.equal((question.problemHtml.match(/class="spatial-cube"/g)||[]).length,total(payload.heightMap.flat()),`${label}: one rendered group per cube`);
  }else if(payload.kind==='tetra-cube-hole-count')assertTetra({...payload,problemHtml:question.problemHtml},difficulty,label);
  else if(payload.kind==='block-build-count')assertBlock({...payload,problemHtml:question.problemHtml},difficulty,label);
  else assertFill({...payload,problemHtml:question.problemHtml},difficulty,label);
  const wrong=clone(question);wrong.answer=Array.isArray(question.answer)?question.answer.map(value=>value+1):typeof question.answer==='object'?Object.fromEntries(Object.entries(question.answer).map(([key,value])=>[key,value+1])):question.answer+1;
  assert.notDeepEqual(wrong.answer,solve(wrong),`${label}: wrong-answer negative check`);
}

function run(){
  assert.equal(spatial.version,'replacement-spatial-20260911-v2');
  const fixed=specials.cloneDiceFinishVisibleFaces();
  assert.deepEqual(fixed.map(question=>question.payload.route.length),[4,5,5],'shared fixed dice routes must be 4, 5, and 5 rolls');
  fixed[0].payload.route[0]='W';
  assert.equal(specials.cloneDiceFinishVisibleFaces()[0].payload.route[0],'E','shared fixed dice API must return a defensive clone');
  const fixedSources=[globalThis.HFChallengeBank.createMockExam(1,62001).questions[11],more.get(3).questions[12],more.get(4).questions[14]];
  assert.deepEqual(fixedSources.map(question=>question.typeId),['mock-dice-target-bottom','r3-main-13','r4-main-15'],'fixed dice source type IDs must stay stable');
  assert(fixedSources.every(question=>question.payload.kind==='dice-visible-faces'),'all fixed dice sources must use one visible-faces family');
  assert.deepEqual(fixedSources.map(question=>question.payload.route.length),[4,5,5],'fixed exam dice routes must use the shared 4/5-roll progression');
  for(const source of SOURCES){assert(spatial.supports(source),`${source.typeId}: registered occurrence`);assert.deepEqual(spatial.levels(source),{easy:true,same:true,hard:true});assert.equal(spatial.notes(source).length,3);}
  assert(!spatial.supports({typeId:'not-registered',payload:{kind:'checker-stack-count'}}),'generic kind must not widen occurrence scope');
  assert(!spatial.supports({typeId:SOURCES[0].typeId,payload:{kind:'checker-stack-count'}}),'kind mismatch must stay unsupported');
  for(const bad of [-1,1.5,NaN,Infinity,4294967296])assert.throws(()=>spatial.generate(SOURCES[0],'same',bad));
  assert.throws(()=>spatial.generate(SOURCES[0],'bogus',1));assert.throws(()=>spatial.generate({typeId:'unknown',payload:{kind:'dice-visible-faces'}},'same',1));

  let independentChecks=0,negativeChecks=0,determinismChecks=0;
  for(const source of SOURCES)for(const difficulty of LEVELS)for(let seed=0;seed<16;seed++){
    const question=spatial.generate(source,difficulty,seed);validateQuestion(question,source,difficulty,seed);
    assert.deepEqual(question,spatial.generate(source,difficulty,seed),`${source.typeId} ${difficulty} ${seed}: deterministic output`);
    independentChecks++;negativeChecks++;determinismChecks++;
  }

  const representativeByKind=new Map();for(const source of SOURCES)if(!representativeByKind.has(source.payload.kind))representativeByKind.set(source.payload.kind,source);
  const uniqueModels=[];
  for(const [kind,source] of representativeByKind)for(const difficulty of LEVELS){
    const models=new Set();for(let seed=0;seed<64;seed++)models.add(semanticKey(spatial.generate(source,difficulty,seed).payload));
    assert(models.size>=24,`${kind} ${difficulty}: fewer than 24 genuine coordinate models`);uniqueModels.push({kind,difficulty,count:models.size});
  }
  const report={passed:true,moduleVersion:spatial.version,registeredOccurrences:SOURCES.length,levels:LEVELS,independentChecks,negativeChecks,determinismChecks,minimumUniqueModels:24,uniqueModels,visualContracts:{camera:'geometry-standard-high-iso',diceBoard:'4x4',diceRolls:'4-5',diceArrowheads:'2.7',diceAnswers:'top-front-right',tetraVisibleHoles:'1-2',cubeBoundaries:'1.35px exposed-face strokes'}};
  console.log(JSON.stringify(report,null,2));return report;
}

module.exports={solve,solvePayload,run};
if(require.main===module)run();
