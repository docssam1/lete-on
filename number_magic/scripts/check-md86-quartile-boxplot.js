#!/usr/bin/env node
'use strict';
/* MD86 source-bound arithmetic, deterministic replay, and no-repeat gate. */
const assert=require('assert/strict'),fs=require('fs'),path=require('path'),vm=require('vm');
const root=path.resolve(__dirname,'..'),store=new Map();
const w={console,Set,Map,Math,JSON,Date,URL,URLSearchParams,setTimeout,clearTimeout};w.window=w;
w.document={getElementById:()=>({}),querySelector:()=>null,querySelectorAll:()=>[],head:{appendChild(){}},body:{appendChild(){}}};
w.localStorage={getItem:k=>store.has(k)?store.get(k):null,setItem:(k,v)=>store.set(k,String(v))};
vm.createContext(w);
function load(f){vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),w,{filename:f});}
const levelDefs=[
  {id:1,params:{mode:'quartilesOdd'}},{id:2,params:{mode:'quartilesEven'}},
  {id:3,params:{mode:'spread'}},{id:4,params:{mode:'fiveNumber'}},
  {id:5,params:{mode:'boxRead'}},{id:6,params:{mode:'boxDraw'}}
];
load('engine/rng.js');load('engine/threads/mid14.js');load('data/threads.js');
w.NM_THREADS.MD86={name:{ko:'사분위수와 상자그림',en:'Quartiles and Box Plots',zh:'四分位数与箱形图'},gen:'md86_quartileBox',prereq:['MD84'],levels:levelDefs};
load('app/exam.js');
const modes=levelDefs.map(x=>x.params.mode),counts=[12,12,24,24,24,24];
const plain=v=>JSON.parse(JSON.stringify(v));
const sig=p=>JSON.stringify({tex:p.tex,prompt:p.prompt,answer:p.answer,graph:p.graph,solutionGraph:p.solutionGraph});
function median(sorted){const n=sorted.length;return n%2?sorted[(n-1)/2]:(sorted[n/2-1]+sorted[n/2])/2;}
function summary(values){const a=plain(values).sort((x,y)=>x-y),h=Math.floor(a.length/2);return{ordered:a,min:a[0],q1:median(a.slice(0,h)),median:median(a),q3:median(a.slice(a.length-h)),max:a[a.length-1]};}
function validatePlot(g,s,blank,label){
  assert.equal(g.kind,'boxPlot',label+': plot kind');assert.equal(!!g.blank,blank,label+': blank state');
  assert(Number.isFinite(g.lo)&&Number.isFinite(g.hi)&&g.lo<=s.min&&g.hi>=s.max,label+': scale bounds');
  if(blank){for(const k of ['min','q1','median','q3','max'])assert.equal(g[k],undefined,label+': blank graph leaks '+k);}
  else for(const k of ['min','q1','median','q3','max'])assert.equal(g[k],s[k],label+': '+k);
}
function validate(p,mode,label){
  const m=p.quartileModel;assert(m&&m.mode===mode,label+': semantic model');
  if(m.values){
    const s=summary(m.values);for(const k of ['min','q1','median','q3','max'])assert.equal(m[k],s[k],label+': '+k);
    assert.deepEqual(plain(m.ordered),s.ordered,label+': ordered data');
    if(mode==='quartilesOdd'||mode==='quartilesEven')assert.deepEqual(plain(p.answer),[s.q1,s.median,s.q3],label+': quartile answer');
    if(mode==='spread')assert.deepEqual(plain(p.answer),[s.max-s.min,s.q3-s.q1],label+': spread answer');
    if(mode==='fiveNumber')assert.deepEqual(plain(p.answer),[s.min,s.q1,s.median,s.q3,s.max],label+': five-number answer');
  }
  const s={min:m.min,q1:m.q1,median:m.median,q3:m.q3,max:m.max};
  if(mode==='boxRead'){
    validatePlot(p.graph,s,false,label);const expected={min:s.min,q1:s.q1,median:s.median,q3:s.q3,max:s.max,range:s.max-s.min,iqr:s.q3-s.q1}[m.ask];
    assert.equal(p.answer,expected,label+': read answer');
  }
  if(mode==='boxDraw'){
    assert.deepEqual(plain(p.answer),[s.min,s.q1,s.median,s.q3,s.max],label+': draw summary');
    validatePlot(p.graph,s,true,label);validatePlot(p.solutionGraph,s,false,label+' solution');
  }
}
let generated=0;
for(let i=0;i<modes.length;i++){
  const mode=modes[i],seen=new Set();
  for(let seed=0;seed<5000;seed++){
    const h=w.NM_RNG.hashSeed('MD86/'+mode+'/'+seed),p=w.NM_TGEN.md86_quartileBox({mode},w.NM_RNG.mulberry32(h));
    validate(p,mode,mode+'/'+seed);seen.add(sig(p));
    assert.equal(sig(w.NM_TGEN.md86_quartileBox({mode},w.NM_RNG.mulberry32(h))),sig(p),mode+': deterministic replay');generated++;
  }
  assert(seen.size>=1000,mode+': finite visible domain sampled too narrowly '+seen.size);
  for(let seed=0;seed<80;seed++){
    const shared=new Set(),h=w.NM_RNG.hashSeed('MD86/set/'+mode+'/'+seed);
    const practice=w.NM_EXAM.buildProblems('MD86',i+1,counts[i],h,null,null,shared);
    const teaching=w.NM_EXAM.buildProblems('MD86',i+1,4,h^0x9e3779b9,null,null,shared);
    const all=practice.concat(teaching),keys=all.map(w.NM_EXAM.problemKey);
    assert.equal(all.length,counts[i]+4);assert.equal(new Set(keys).size,all.length,mode+': repeated learner-visible variant');
  }
  console.log('PASS MD86 '+mode+': '+seen.size.toLocaleString()+' deterministic sampled variants; '+counts[i]+'+4 shared unique');
}
/* A changed visible plot or teacher solution must never collapse to the same identity. */
{
  const read=w.NM_TGEN.md86_quartileBox({mode:'boxRead'},w.NM_RNG.mulberry32(123));
  const altered=plain(read);altered.graph.median+=1;
  assert.notEqual(w.NM_EXAM.problemKey(read),w.NM_EXAM.problemKey(altered),'completed plot data missing from problemKey');
  const draw=w.NM_TGEN.md86_quartileBox({mode:'boxDraw'},w.NM_RNG.mulberry32(456));
  const alteredSolution=plain(draw);alteredSolution.solutionGraph.median+=1;
  assert.notEqual(w.NM_EXAM.problemKey(draw),w.NM_EXAM.problemKey(alteredSolution),'teacher plot data missing from problemKey');
}
console.log('PASS MD86: '+generated.toLocaleString()+' independent calculations; box plot visible identity locked; source scope p.128-143 only.');
