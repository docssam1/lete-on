#!/usr/bin/env node
'use strict';
/* MD84 source-bound math/uniqueness gate. Private textbook images are not copied here. */
const assert=require('assert/strict'),fs=require('fs'),path=require('path'),vm=require('vm');
const root=path.resolve(__dirname,'..'),store=new Map();
const w={console,Set,Map,Math,JSON,Date,URL,URLSearchParams,setTimeout,clearTimeout};w.window=w;
w.document={getElementById:()=>({}),querySelector:()=>null,querySelectorAll:()=>[],head:{appendChild(){}},body:{appendChild(){}}};
w.localStorage={getItem:k=>store.has(k)?store.get(k):null,setItem:(k,v)=>store.set(k,String(v))};
vm.createContext(w);
function load(f){vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),w,{filename:f});}
load('engine/rng.js');load('engine/threads/mid13.js');load('data/threads.js');load('data/middle-concepts.js');load('app/exam.js');
const modes=['medianOdd','medianEven','modeSingle','modeMultiple','modeCategory','summary'];
const counts=[12,12,12,24,24,24];
const plain=v=>JSON.parse(JSON.stringify(v));
const sig=p=>JSON.stringify({tex:p.tex,prompt:p.prompt,answer:p.answer});
function median(v){const a=v.slice().sort((x,y)=>x-y),n=a.length;return n%2?a[(n-1)/2]:(a[n/2-1]+a[n/2])/2;}
function modesOf(v){const c=new Map();v.forEach(x=>c.set(x,(c.get(x)||0)+1));const max=Math.max(...c.values());return [...c].filter(([,n])=>n===max).map(([x])=>x).sort((a,b)=>a-b);}
function validate(p,mode,label){
  assert.equal(p.widget,'numpad',label+': widget');
  assert.equal(p.answerType,'number',label+': answer type');
  assert(p.stats&&p.stats.mode===mode,label+': semantic data missing');
  if(mode==='medianOdd'||mode==='medianEven')assert.equal(p.answer,median(p.stats.values),label+': median');
  if(mode==='modeSingle')assert.deepEqual(modesOf(p.stats.values),[p.answer],label+': single mode');
  if(mode==='modeMultiple')assert.deepEqual(plain(p.answer),modesOf(p.stats.values),label+': multiple modes');
  if(mode==='modeCategory'){
    const max=Math.max(...p.stats.counts);
    assert.equal(p.stats.counts.filter(n=>n===max).length,1,label+': category tie');
    assert.equal(p.answer,p.stats.winner+1,label+': category code');
  }
  if(mode==='summary'){
    const values=p.stats.values,sum=values.reduce((a,b)=>a+b,0);
    assert.deepEqual(plain(p.answer),[sum/values.length,median(values),modesOf(values)[0]],label+': combined values');
    assert.equal(modesOf(values).length,1,label+': combined mode not unique');
  }
  const slots=(p.tex.match(/\\square/g)||[]).length;
  assert.equal(slots,Array.isArray(p.answer)?p.answer.length:1,label+': blank count');
}
let generated=0;
for(let i=0;i<modes.length;i++){
  const mode=modes[i],seen=new Set();
  for(let seed=0;seed<5000;seed++){
    const h=w.NM_RNG.hashSeed('MD84/'+mode+'/'+seed),rng=w.NM_RNG.mulberry32(h);
    const p=w.NM_TGEN.md84_center({mode},rng);validate(p,mode,mode+'/'+seed);seen.add(sig(p));
    const replay=w.NM_TGEN.md84_center({mode},w.NM_RNG.mulberry32(h));
    assert.equal(sig(replay),sig(p),mode+': deterministic replay');
    generated++;
  }
  assert(seen.size>=1000,mode+': visible pool too small '+seen.size);
  for(let seed=0;seed<60;seed++){
    const shared=new Set(),h=w.NM_RNG.hashSeed('MD84/set/'+mode+'/'+seed);
    const practice=w.NM_EXAM.buildProblems('MD84',i+1,counts[i],h,null,null,shared);
    const teaching=w.NM_EXAM.buildProblems('MD84',i+1,4,h^0x9e3779b9,null,null,shared);
    const all=practice.concat(teaching);
    assert.equal(all.length,counts[i]+4);
    assert.equal(new Set(all.map(w.NM_EXAM.problemKey)).size,all.length,mode+': repeated learner-visible variant');
  }
  console.log('PASS MD84 '+mode+': '+seen.size.toLocaleString()+' sampled; '+counts[i]+'+4 unique allocation');
}
assert.deepEqual(plain(w.NM_THREADS.MD84.levels.map(x=>x.params.mode)),modes);
assert.equal(w.NM_MIDDLE_CONCEPTS.MD84.source,'1-2:224-230');
assert(w.NM_MIDDLE_CONCEPTS.MD84.steps.join(' ').includes('짝수'));
console.log('PASS MD84: '+generated.toLocaleString()+' independent calculations; learner-fit middle1-2; current numpad/multi-slot contract.');
