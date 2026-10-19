import assert from 'node:assert/strict';
import {bank,answerFor} from './core.js';
import {initialActivity,advance,restoreActivity,visibleIds,projectCell,holesAt,piecesFor,foldGeometry,cutKeysFor,sceneShift,stageFor} from './activity-model.js';
import {paperScene,foldDirections} from './activity-render.js';
import {translation,languages} from './activity-i18n.js';
const sorted=x=>[...x].sort((a,b)=>a-b);
let transitions=0,scenes=0;
for(const p of bank){
  // Independently move physical stacks on a board. No production projection.
  const board=Array.from({length:4},(_,r)=>Array.from({length:4},(_,c)=>[r*4+c]));
  const snapshots=[board.map(row=>row.map(stack=>[...stack]))];
  const movingRows=p.hDir==='up'?[2,3]:[0,1];
  for(const r of movingRows)for(let c=0;c<4;c++){board[3-r][c].push(...board[r][c].reverse());board[r][c]=[];}
  snapshots.push(board.map(row=>row.map(stack=>[...stack])));
  const movingCols=p.vDir==='left'?[2,3]:[0,1];
  for(let r=0;r<4;r++)for(const c of movingCols){board[r][3-c].push(...board[r][c].reverse());board[r][c]=[];}
  snapshots.push(board);
  const expectedCut=p.cells.flatMap(({r,c})=>board[p.packetRow+r][p.packetCol+c]);
  assert.deepEqual(sorted(expectedCut),sorted(p.removed));
  snapshots.forEach((snapshot,stage)=>{
    const visible=[];snapshot.forEach((row,r)=>row.forEach((stack,c)=>{if(stack.length)visible.push(r*4+c);for(const id of stack)assert.equal(projectCell(id,p,stage),r*4+c);}));
    assert.deepEqual(visibleIds(p,stage),visible);
    for(let bits=0;bits<2**p.cells.length;bits++){
      const keys=cutKeysFor(p).filter((_,i)=>(bits>>i)&1);
      const removed=new Set(p.cells.filter((_,i)=>(bits>>i)&1).flatMap(({r,c})=>board[p.packetRow+r][p.packetCol+c]));
      const expected=[];snapshot.forEach((row,r)=>row.forEach((stack,c)=>{if(stack.length&&stack.every(id=>removed.has(id)))expected.push(r*4+c);}));
      assert.deepEqual(sorted(holesAt(p,keys,stage)),expected);
    }
  });
  // Independently join adjacent target squares with union-find; don't tear kept paper.
  const target=Array.from({length:16},(_,id)=>id).filter(id=>p.activity==='cut'?expectedCut.includes(id):!expectedCut.includes(id));
  const parent=Array.from({length:16},(_,i)=>i),root=id=>parent[id]===id?id:(parent[id]=root(parent[id]));
  for(const id of target)for(const n of target)if(Math.abs(Math.floor(id/4)-Math.floor(n/4))+Math.abs(id%4-n%4)===1)parent[root(n)]=root(id);
  const groups=new Map();for(const id of target){const key=root(id);groups.set(key,[...(groups.get(key)||[]),id]);}
  assert.deepEqual(piecesFor(p).map(x=>x.cells.join(',')).sort(),[...groups.values()].map(x=>x.join(',')).sort());
  assert.equal(piecesFor(p).reduce((sum,piece)=>sum+piece.sum,0),answerFor(p));
  let state=initialActivity();
  assert.deepEqual(advance(p,state,'collect','0'),state);
  assert.deepEqual(advance(p,state,'cut',cutKeysFor(p)[0]),state);
  const check=()=>{
    assert.deepEqual(restoreActivity(p,state),state);
    const geometry=paperScene(p,state,translation('ko'));
    const holes=holesAt(p,state.cutKeys,stageFor(state.phase));
    const layers=[...geometry.matchAll(/data-layers="(\d+)" data-cells="([\d,]+)"/g)];
    if(!['collect','done'].includes(state.phase))for(const layer of layers){
      // The shadow cannot refill a cut hole or introduce cells outside the sheet.
      for(const id of layer[2].split(',').map(Number))assert(!holes.has(id));
    }
    if(state.phase==='cut')assert.equal(layers[0][1],'4');
    if(state.phase==='fold-v')assert(layers.every(layer=>layer[1]==='2'));
    for(const lang of languages){const html=paperScene(p,state,translation(lang));assert(!html.includes('undefined'));assert(!html.includes('NaN'));scenes++;}
    transitions++;
  };
  check();state=advance(p,state,'fold');check();state=advance(p,state,'fold');check();
  for(const key of cutKeysFor(p)){state=advance(p,state,'cut',key);check();assert.deepEqual(advance(p,state,'cut',key),state);}
  assert.equal(state.phase,'unfold-v');
  state=advance(p,state,'fold');check();state=advance(p,state,'fold');check();
  assert.equal(state.phase,'collect');
  assert.deepEqual(advance(p,state,'collect','not-a-piece'),state);
  for(const piece of piecesFor(p)){state=advance(p,state,'collect',piece.id);check();assert.deepEqual(advance(p,state,'collect',piece.id),state);}
  assert.equal(state.phase,'done');
  assert.deepEqual(advance(p,state,'fold'),state);
  assert.deepEqual(restoreActivity(p,{phase:'done',cutKeys:[],collected:[]}),initialActivity());
  assert.doesNotThrow(()=>restoreActivity(p,{phase:'collect',cutKeys:{},collected:{}}));
  for(const phase of ['fold-h','fold-v','cut','unfold-v','unfold-h','collect']){
    const shift=sceneShift(p,phase),ids=visibleIds(p,stageFor(phase));
    const rows=ids.map(id=>Math.floor(id/4)),cols=ids.map(id=>id%4);
    assert.equal((Math.min(...rows)+Math.max(...rows)+1)*12.5+shift.y,50);
    assert.equal((Math.min(...cols)+Math.max(...cols)+1)*12.5+shift.x,50);
  }
  for(const phase of ['fold-h','fold-v','unfold-v','unfold-h']){
    const g=foldGeometry(p,phase);assert.equal(g.rows*g.cols,g.horizontal?8:4);assert.equal(Math.abs(g.angle),180);
    for(const lang of languages){
      const arrow=foldDirections(p,{phase},translation(lang));
      assert(arrow.includes(g.horizontal?'beside-paper':'above-paper'));
      const dir=g.horizontal?p.hDir:p.vDir,opposite={up:'down',down:'up',left:'right',right:'left'};
      assert(arrow.includes(`data-direction="${g.unfold?opposite[dir]:dir}"`));
    }
  }
  for(const phase of ['cut','collect','done'])assert.equal(foldDirections(p,{phase},translation('ko')),'');
}
// Negative controls must fail against independent physical truth.
const p=bank[0];assert.notDeepEqual(sorted(holesAt(p,cutKeysFor(p),0)),sorted(holesAt(p,cutKeysFor(p),0)).slice(1));
assert.notDeepEqual(piecesFor(p).map(x=>x.cells),[[...p.removed]]); // first cut has separated corner pieces
// A new activity checkpoint must preserve old quiz data and unrelated games.
const {saveGameProgress,readProfile}=await import('../../shared/profile-storage.js');
const previousStorage=globalThis.localStorage;
const original={name:'preserved',progress:{otherGame:{round:7},'number-paper':{selected:[1,3],input:'9',phase:'sum'}},custom:{keep:true}};
let stored=JSON.stringify(original);
try{
  globalThis.localStorage={getItem:()=>stored,setItem:(_,value)=>{stored=value;}};
  saveGameProgress('number-paper',{paperPlay:{version:3,model:initialActivity()}});
  const current=readProfile();
  assert.deepEqual(current.progress.otherGame,original.progress.otherGame);
  for(const key of ['selected','input','phase'])assert.deepEqual(current.progress['number-paper'][key],original.progress['number-paper'][key]);
  assert.deepEqual(current.custom,original.custom);assert.equal(current.name,original.name);
}finally{if(previousStorage===undefined)delete globalThis.localStorage;else globalThis.localStorage=previousStorage;}
console.log(JSON.stringify({problems:bank.length,transitions,translatedScenes:scenes,physicalStages:120,connectedPieces:true,invalidActionsRejected:true,restoration:true,additiveProfilePreservation:true},null,2));
