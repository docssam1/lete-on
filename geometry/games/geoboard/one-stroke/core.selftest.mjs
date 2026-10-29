import assert from "node:assert/strict";
import {readFile,mkdtemp,writeFile} from "node:fs/promises";
import {spawnSync} from "node:child_process";
import {fileURLToPath} from "node:url";
import {join} from "node:path";
import {tmpdir} from "node:os";
import {edgeKey,nodePoint,fresh,step,undo,usedEdges,isSolved,isStuck,restorePath,restoreProgress,validateBank,createTrace} from "./core.js";
import {copy} from "./i18n.js";
const bank=validateBank(JSON.parse(await readFile(new URL("./bank.json",import.meta.url),"utf8")));
const python=process.env.PYTHON||"python",checker=fileURLToPath(new URL("./verify_bank.py",import.meta.url)),bankPath=fileURLToPath(new URL("./bank.json",import.meta.url));
const run=spawnSync(python,[checker,bankPath],{encoding:"utf8"});assert.equal(run.status,0,run.stderr);
const proof=JSON.parse(run.stdout);assert.equal(proof.status,"PASS");
let validTrails=0,transitions=0,startChecks=0;
for(const p of bank.problems){
  // Exhaustive edge-permutation DFS is independent of NetworkX and the reducer.
  const keys=p.edges.map(([a,b])=>[a,b].sort().join("|"));
  const starts=[];
  function enumerate(current,remaining,path){
    if(!remaining.length){validTrails++;assert.equal(isSolved(p,restorePath(p,path)),true);return 1;}
    let found=0;
    for(const key of remaining){const pair=key.split("|");if(pair.includes(current))found+=enumerate(pair.find(id=>id!==current),remaining.filter(k=>k!==key),[...path,pair.find(id=>id!==current)]);}
    return found;
  }
  for(const id of Object.keys(p.nodes)){
    const allowed=enumerate(id,keys,[id])>0;if(allowed)starts.push(id);
    assert.equal(step(p,fresh(),id).error,allowed?null:"wrongStart");startChecks++;
  }
  assert.deepEqual(starts.sort(),[...p.starts].sort());
  const reference=proof.proofs.find(q=>q.id===p.id);
  for(const trail of Object.values(reference.trails)){
    let state=fresh();
    for(const id of trail){const result=step(p,state,id);assert.equal(result.error,null);state=result.state;transitions++;}
    assert.equal(isSolved(p,state),true);assert.equal(isSolved(p,undo(state)),false);assert.deepEqual(restorePath(p,trail),state);
    for(const radius of [5,10.8]){
      let pointerState=step(p,fresh(),trail[0]).state;
      const input=createTrace(p,()=>pointerState,id=>{const result=step(p,pointerState,id);pointerState=result.state;return result.error;},{radius,corridor:6});
      input.begin(nodePoint(p.nodes[trail[0]]));
      for(const id of trail.slice(1))input.move(nodePoint(p.nodes[id]));
      assert.deepEqual(pointerState.path,trail,`${p.id}: sparse drag at radius ${radius}`);
    }
  }
}
const p=bank.problems[0];let state=step(p,fresh(),"a").state;
state=step(p,state,"b").state;assert.equal(step(p,state,"a").error,"usedLine");assert.deepEqual(step(p,state,"d").state,state);
assert.equal(step(p,state,"d").error,"followLines");
assert.equal(isSolved(p,{path:["a","b","a","b"]}),false,"A line count alone cannot certify completion");
for(const value of [["b"],["a","b","a"],["a","d"],["a","a"],["missing"],null])assert.deepEqual(restorePath(p,value),fresh());
const trap=bank.problems.find(p=>p.id==="os-triangle-tail");
const stuck=step(trap,step(trap,fresh(),"b").state,"d").state;
assert.equal(isStuck(trap,stuck),true);assert.equal(isSolved(trap,stuck),false);assert.equal(isStuck(trap,undo(stuck)),false);
let pointer=step(p,fresh(),"a").state;
const input=createTrace(p,()=>pointer,id=>{const result=step(p,pointer,id);pointer=result.state;return result.error;},{radius:5,corridor:5});
const a=nodePoint(p.nodes.a),b=nodePoint(p.nodes.b);input.begin(a);
input.move({x:(a.x+b.x)/2,y:a.y});assert.ok(input.preview);assert.deepEqual(pointer.path,["a"]);
input.move({x:90,y:5});input.move(b);assert.deepEqual(pointer.path,["a"],"An off-line detour cannot reconnect at another peg");
input.move(a);input.move(b);assert.deepEqual(pointer.path,["a","b"]);
const forged=restoreProgress(bank,{version:1,bankVersion:1,level:3,indices:{1:3,2:3,3:3},paths:{[p.id]:["a","b","a"]}});
assert.deepEqual(forged.indices,{1:0,2:0,3:0});assert.deepEqual(forged.paths[p.id],[]);
for(const language of ["ko","en","zh","ja"]){for(const key of Object.keys(copy.ko))assert.equal(typeof copy[language][key],typeof copy.ko[key]);assert.equal(copy[language].levels.length,3);}
const folder=await mkdtemp(join(tmpdir(),"euler-negative-")),bad=structuredClone(bank);bad.problems[0].starts=["b"];
const badPath=join(folder,"bad-bank.json");await writeFile(badPath,JSON.stringify(bad));
assert.notEqual(spawnSync(python,[checker,badPath],{encoding:"utf8"}).status,0,"Independent gate rejects false start metadata");
console.log(JSON.stringify({status:"PASS",problems:12,networkx:proof.networkx,startChecks,validTrails,transitions,sparseDragRadii:[5,10.8],negativeControls:true,
  learnerFit:{gate:"learner-fit",learner_stage:bank.learnerStage,language:"short concrete prompts; no graph-degree notation",representations:"visible pegs and complete given edge network",prerequisites:"follow a line; distinguish points from lines",reasoningLoad:"3-9 edges; return to junctions; choose a starting point",responseMode:"continuous edge tracing with equivalent keyboard traversal",teacherApproval:false}}));
