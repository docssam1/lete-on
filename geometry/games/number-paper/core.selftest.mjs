import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import { bank, activities, problemsFor, answerFor, gradeCells, gradeSum } from './core.js';
import { foldSequence, sourceBoard } from './render.js';
import { languages, translation } from './i18n.js';

// Independent physical layer simulation. Move the entire 4×4 cell packet,
// reversing each moving stack, rather than using the model's mirror orbit.
function independent(p) {
  const sheet=Array.from({length:4},(_,r)=>Array.from({length:4},(_,c)=>[r*4+c]));
  for(let r=0;r<4;r++)for(let c=0;c<4;c++) {
    const moving=p.hDir==='up'?r>=2:r<2;
    if(moving){sheet[3-r][c].push(...sheet[r][c].slice().reverse());sheet[r][c]=[];}
  }
  for(let c=0;c<4;c++)for(let r=0;r<4;r++) {
    const moving=p.vDir==='left'?c>=2:c<2;
    if(moving){sheet[r][3-c].push(...sheet[r][c].slice().reverse());sheet[r][c]=[];}
  }
  const occupied=[];
  for(let r=0;r<4;r++)for(let c=0;c<4;c++)if(sheet[r][c].length)occupied.push([r,c]);
  const top=Math.min(...occupied.map(p=>p[0])),left=Math.min(...occupied.map(p=>p[1]));
  const cutIds=new Set(p.cells.flatMap(cell=>sheet[top+cell.r][left+cell.c]));
  let cut=0,remain=0;
  for(let r=0;r<4;r++)for(let c=0;c<4;c++)if(cutIds.has(r*4+c))cut+=p.grid[r][c];else remain+=p.grid[r][c];
  return {cutIds:[...cutIds].sort((a,b)=>a-b),cut,remain};
}
function verifyDiagram(svg,p) {
  const cells=[...svg.matchAll(/<rect data-packet-cell="(\d),(\d)" x="([\d.]+)" y="([\d.]+)" width="40" height="40" fill="([^"]+)"/g)];
  assert.equal(cells.length,28);
  const shown=[];
  for(const [,r,c,x,y,fill] of cells){assert.equal(Number(x),16+Number(c)*40);assert.equal(Number(y),16+Number(r)*40);if(fill.startsWith('url'))shown.push([Number(r),Number(c)]);}
  const unfolded=new Set(shown.flatMap(([r,c])=>[r*4+c,(3-r)*4+c,r*4+3-c,(3-r)*4+3-c]));
  assert.deepEqual([...unfolded].sort((a,b)=>a-b),independent(p).cutIds);
}
assert.equal(bank.length,40);assert.equal(new Set(bank.map(p=>p.id)).size,40);
let enumerated=0;
for(const a of activities){assert.equal(problemsFor(a.id).length,20);assert.equal(new Set(problemsFor(a.id).map(p=>JSON.stringify([p.grid,p.hDir,p.vDir,p.cells]))).size,20);}
for(const p of bank) {
  const check=independent(p),ids=[...p.removed].sort((a,b)=>a-b);
  assert.deepEqual(ids,check.cutIds,p.id);assert.equal(p.cut,check.cut);assert.equal(p.remain,check.remain);assert.equal(p.total,check.cut+check.remain);
  assert.equal(gradeCells(p,ids),true);assert.equal(gradeCells(p,[...ids,ids[0]]),false);
  let validSets=0;
  for(let mask=0;mask<65536;mask++) {
    const selected=[];for(let id=0;id<16;id++)if(mask&(1<<id))selected.push(id);
    if(gradeCells(p,selected))validSets++;enumerated++;
  }
  assert.equal(validSets,1,p.id);
  for(let n=0;n<=p.total+1;n++)assert.equal(gradeSum(p,String(n)),n===answerFor(p),p.id);
  for(const value of ['','1e1','-1','1.5','Infinity','NaN','1x'])assert.equal(gradeSum(p,value),false);
  for(const lang of languages) {
    const t=translation(lang),svg=foldSequence(p,t),board=sourceBoard(p,[],'cells',t);
    assert.equal((svg.match(/<svg /g)||[]).length,3);assert.equal((svg.match(/data-packet-cell=/g)||[]).length,28);
    assert.equal((svg.match(/fill="url\(#cut-/g)||[]).length,p.cells.length);
    verifyDiagram(svg,p);
    assert.equal((board.match(/data-cell=/g)||[]).length,16);assert.equal((board.match(/aria-pressed="true"/g)||[]).length,0);
    assert(!board.includes('removed'));assert(!board.includes('undefined'));assert(!svg.includes('undefined'));assert(!svg.includes('NaN'));
    for(const [i,n] of p.grid.flat().entries())assert(board.includes(`<span>${n}</span>`));
  }
}
// Negative controls: corrupt an answer and a condition. Independent layers
// must reject both; the published bank is never modified.
const brokenAnswer={...bank[0],removed:new Set([1,3,12,15])};
assert.throws(()=>assert.deepEqual([...brokenAnswer.removed].sort((a,b)=>a-b),independent(brokenAnswer).cutIds));
const brokenCondition={...bank[0],cells:[{r:0,c:1}]};
assert.throws(()=>assert.deepEqual([...brokenCondition.removed].sort((a,b)=>a-b),independent(brokenCondition).cutIds));
assert.throws(()=>verifyDiagram(foldSequence(bank[0],translation('ko')).replace('x="16" y="16" width="40"','x="56" y="16" width="40"'),bank[0]));
assert.throws(()=>globalThis.GW_NUMBER_PAPER.numberPaperModel({...bank[0],hDir:'diagonal'}));
assert.throws(()=>globalThis.GW_NUMBER_PAPER.numberPaperModel({...bank[0],cells:[{r:0,c:0},{r:0,c:0}]}));

// Compare the extraction with the original worksheet generator using all four
// directions, every local packet cell, two ask modes and nonuniform numbers.
const oldCode=readFileSync(new URL('./fixtures/legacy-number-model.js',import.meta.url),'utf8');
const newCode=readFileSync(new URL('../../worksheet/paper-fold/fold-1.js',import.meta.url),'utf8');
const oldContext=vm.createContext({}),newContext=vm.createContext({GW_NUMBER_PAPER:globalThis.GW_NUMBER_PAPER});
vm.runInContext(oldCode,oldContext);vm.runInContext(newCode,newContext);
let legacyCases=0;
for(const hDir of ['up','down'])for(const vDir of ['left','right'])for(let r=0;r<2;r++)for(let c=0;c<2;c++)for(const askCut of [true,false]) {
  const preset={grid:[[0,5,12,104],[6,3,2,1],[4,1,5,3],[3,6,4,2]],hDir,vDir,cell:{r,c}};
  const old=oldContext.genNumber(askCut,preset),now=newContext.genNumber(askCut,preset);
  for(const key of ['packetRow','packetCol','total','cut','remain','answer'])assert.equal(now[key],old[key]);
  assert.deepEqual([...now.removed].sort(),[...old.removed].sort());legacyCases++;
}
function randomMath(){let seed=87123;const math=Object.create(Math);math.random=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);return math;}
oldContext.Math=randomMath();newContext.Math=randomMath();
for(const difficulty of ['easy','mid','hard'])for(let i=0;i<200;i++){
  const old=oldContext.genNumber(i%2===0,null,difficulty),now=newContext.genNumber(i%2===0,null,difficulty);
  for(const key of ['packetRow','packetCol','total','cut','remain','answer'])assert.equal(now[key],old[key]);
  assert.equal(JSON.stringify(now.grid),JSON.stringify(old.grid));assert.equal(JSON.stringify(now.cells),JSON.stringify(old.cells));
  assert.deepEqual([...now.removed].sort(),[...old.removed].sort());legacyCases++;
}
console.log(JSON.stringify({problems:bank.length,independent_layer_simulations:40,enumerated_cell_sets:enumerated,unique_valid_set_per_problem:true,legacy_worksheet_cases:legacyCases,languages:languages.length,negative_controls:['wrong answer cell','wrong cut condition','wrong SVG coordinate','invalid fold','duplicate cut'],status:'pass'},null,2));
