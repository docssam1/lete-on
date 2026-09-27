#!/usr/bin/env node
'use strict';

/* MD85 source-scope, independent statistics, determinism and exact visible-pool gate. */
const assert=require('assert/strict'),fs=require('fs'),path=require('path'),vm=require('vm');
const root=path.resolve(__dirname,'..'),store=new Map();
const w={console,Set,Map,Math,JSON,Date,URL,URLSearchParams,setTimeout,clearTimeout};w.window=w;
w.document={getElementById:()=>({}),querySelector:()=>null,querySelectorAll:()=>[],head:{appendChild(){}},body:{appendChild(){}}};
w.localStorage={getItem:k=>store.has(k)?store.get(k):null,setItem:(k,v)=>store.set(k,String(v))};
vm.createContext(w);
const load=f=>vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),w,{filename:f});
load('engine/rng.js');load('engine/threads/mid12.js');load('data/threads.js');load('app/exam.js');

const gen=w.NM_TGEN.md85_dispersion,modes=['deviation','missingDeviation','varianceStd','compare'];
const levels={deviation:1,missingDeviation:2,varianceStd:3,compare:4};
const expectedCounts={deviation:12,missingDeviation:24,varianceStd:24,compare:24};
function sum(a){return a.reduce((s,x)=>s+x,0);}function mean(a){return sum(a)/a.length;}
function variance(a){const m=mean(a);return a.reduce((s,x)=>s+(x-m)**2,0)/a.length;}
function check(p,mode,label){
  const m=p.dispersionModel;assert(m,label+': model missing');assert.equal(m.mode,mode,label+': mode');
  assert.equal(p.widget,'numpad',label+': existing input contract');assert.equal(p.answerType,'number');
  if(mode==='deviation'){
    const mu=mean(m.data),dev=m.data.map(x=>x-mu);
    assert.equal(mu,m.mean);assert.equal(sum(dev),0);assert.equal(p.answer,dev[m.target]);assert.equal(m.answer,p.answer);
  }else if(mode==='missingDeviation'){
    assert.equal(sum(m.deviations),0);assert.equal(p.answer,m.deviations[m.missing]);assert.equal(m.knownSum+p.answer,0);
  }else if(mode==='varianceStd'){
    const data=Array.from(m.data),mu=mean(data),dev=data.map(x=>x-mu),q=dev.reduce((s,x)=>s+x*x,0),v=q/data.length;
    assert.equal(mu,m.mean);assert.deepEqual(dev,Array.from(m.deviations));assert.equal(sum(dev),0);assert.equal(q,m.squaredSum);assert.equal(v,m.variance);
    assert.deepEqual(Array.from(p.answer),[v,v]);assert.equal(m.standardDeviation.coefficient,1);assert.equal(m.standardDeviation.radicand,v);
    assert(!Number.isInteger(Math.sqrt(v)),label+': selected standard deviation should retain a radical');
  }else{
    const ma=mean(m.dataA),mb=mean(m.dataB),va=variance(m.dataA),vb=variance(m.dataB);
    assert.equal(ma,m.meanA);assert.equal(mb,m.meanB);assert.equal(va,m.varianceA);assert.equal(vb,m.varianceB);assert.notEqual(ma,mb);assert.notEqual(va,vb);
    assert.deepEqual(Array.from(p.answer),[ma>mb?1:2,va<vb?1:2]);
  }
  assert.equal(JSON.stringify([p.prompt,p.tex]).includes('p.12'),false,label+': source locator leaked');
  return p;
}

const sizes=w.NM_TGEN.md85DispersionPoolSizes;
assert(sizes.deviation>=1000);assert(sizes.missingDeviation>=1000);assert(sizes.varianceStd>=500);assert(sizes.compare>=1000);
for(const mode of modes){
  const size=sizes[mode],keys=new Set();
  for(let i=0;i<size;i++){
    const p=check(gen({mode},()=>(i+.5)/size),mode,mode+'/'+i),key=w.NM_EXAM.problemKey(p);
    assert(!keys.has(key),mode+': duplicate learner-visible pool item '+key);keys.add(key);
  }
  assert.equal(keys.size,size,mode+': exact capacity mismatch');
  const level=levels[mode],count=expectedCounts[mode],seed=w.NM_RNG.hashSeed('md85-'+mode);
  const a=w.NM_EXAM.buildProblems('MD85',level,count,seed),b=w.NM_EXAM.buildProblems('MD85',level,count,seed);
  a.forEach((p,i)=>check(p,mode,mode+'/round/'+i));
  assert.equal(new Set(a.map(w.NM_EXAM.problemKey)).size,count,mode+': duplicate in worksheet');
  assert.deepEqual(a.map(w.NM_EXAM.problemKey),b.map(w.NM_EXAM.problemKey),mode+': deterministic replay changed');
  const reserved=new Set(a.map(w.NM_EXAM.problemKey));
  const c=w.NM_EXAM.buildProblems('MD85',level,count,w.NM_RNG.hashSeed('md85-'+mode+'-next'),null,null,reserved);
  assert.equal(c.length,count);assert.equal(reserved.size,count*2,mode+': second worksheet reused a visible variant');
}
console.log('PASS MD85 exact pools:',JSON.stringify(sizes));
console.log('PASS MD85: mean, deviation sum 0, population variance, sqrt standard deviation and comparison oracles.');
console.log('PASS MD85: deterministic 12/24-item worksheets and shared no-repeat second rounds.');
