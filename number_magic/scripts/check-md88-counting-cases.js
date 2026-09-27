#!/usr/bin/env node
'use strict';

/* MD88 source-scope, independent arithmetic, determinism and visible-variant gate. */
const assert=require('assert/strict');
const fs=require('fs'),path=require('path'),vm=require('vm');
const root=path.resolve(__dirname,'..'),store=new Map();
const w={console,Set,Map,Math,JSON,Date,URL,URLSearchParams,setTimeout,clearTimeout};
w.window=w;
w.document={getElementById:()=>({}),querySelector:()=>null,querySelectorAll:()=>[],head:{appendChild(){}},body:{appendChild(){}}};
w.localStorage={getItem:k=>store.has(k)?store.get(k):null,setItem:(k,v)=>store.set(k,String(v))};
vm.createContext(w);
const load=f=>vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),w,{filename:f});
load('engine/rng.js');load('engine/threads/mid11.js');load('data/threads.js');load('app/exam.js');

const gen=w.NM_TGEN.md88_countingCases;
const modes=['eventCount','either','both','lineup','fixedSeat'];
const levels={eventCount:1,either:2,both:3,lineup:4,fixedSeat:5};
const minimumPools={eventCount:100,either:100,both:100,lineup:60,fixedSeat:100};
function factorial(n){let x=1;for(let i=2;i<=n;i++)x*=i;return x;}
function falling(n,r){let x=1;for(let i=0;i<r;i++)x*=n-i;return x;}
function oracle(m){
  switch(m.mode){
    case 'eventCount':
      if(m.kind==='atLeast')return m.n-m.k+1;
      if(m.kind==='atMost')return m.k;
      if(m.kind==='multiple')return Math.floor(m.n/m.d);
      if(m.kind==='odd')return Math.ceil(m.n/2);
      if(m.kind==='even')return Math.floor(m.n/2);
      break;
    case 'either':return m.a+m.b;
    case 'both':return m.a*m.b;
    case 'lineup':return falling(m.n,m.r);
    case 'fixedSeat':
      if(m.kind==='oneFixed')return factorial(m.n-1);
      if(m.kind==='twoFixed')return factorial(m.n-2);
      if(m.kind==='eitherAtFirst')return 2*factorial(m.n-1);
      if(m.kind==='bothEnds')return 2*factorial(m.n-2);
  }
  throw new Error('unknown counting model '+JSON.stringify(m));
}
function validate(p,mode,label){
  const m=p.countingModel;
  assert(m,label+': countingModel missing');assert.equal(m.mode,mode,label+': mode');
  assert.equal(p.widget,'numpad',label+': current input contract');
  assert.equal(p.answerType,'number',label+': numeric answer');
  assert(Number.isInteger(p.answer)&&p.answer>=0&&p.answer<=9999,label+': answer outside four-digit numpad');
  assert.equal(p.answer,oracle(m),label+': independent arithmetic mismatch');
  const visible=JSON.stringify([p.prompt,p.word,p.wordAsk,p.tex]);
  assert(!/확률|probability|概率/i.test(visible),label+': probability leaked into MD88');
  assert(!/232/.test(visible),label+': unsupported page leaked into learner content');
  return p;
}

const summary={};
for(const mode of modes){
  const first=validate(gen({mode},()=>0),mode,mode+'/first');
  const size=first.countingModel.poolSize;
  assert(size>=minimumPools[mode],mode+': pool too small');
  const keys=new Set();
  for(let i=0;i<size;i++){
    const p=validate(gen({mode},()=>(i+.5)/size),mode,mode+'/'+i);
    assert.equal(p.countingModel.poolSize,size,mode+': unstable pool size');
    const key=w.NM_EXAM.problemKey(p);
    assert(!keys.has(key),mode+': duplicate learner-visible variant '+key);
    keys.add(key);
  }
  summary[mode]=size;
}

/* Required 12/24 worksheets, plus a second 24-item round sharing reservations.
   If a finite pool is exhausted the app must fail rather than reuse a variant. */
for(const mode of modes){
  const level=levels[mode],count=level===1?12:24,seed=w.NM_RNG.hashSeed('md88-'+mode);
  const a=w.NM_EXAM.buildProblems('MD88',level,count,seed);
  const b=w.NM_EXAM.buildProblems('MD88',level,count,seed);
  a.forEach((p,i)=>validate(p,mode,mode+'/round/'+i));
  assert.equal(new Set(a.map(w.NM_EXAM.problemKey)).size,count,mode+': duplicate in worksheet');
  assert.deepEqual(a.map(w.NM_EXAM.problemKey),b.map(w.NM_EXAM.problemKey),mode+': deterministic replay changed');
  if(count===24){
    const reserved=new Set(a.map(w.NM_EXAM.problemKey));
    const c=w.NM_EXAM.buildProblems('MD88',level,24,w.NM_RNG.hashSeed('md88-'+mode+'-second'),null,null,reserved);
    assert.equal(c.length,24);assert.equal(reserved.size,48,mode+': shared no-repeat reservation failed');
  }
}

console.log('PASS MD88 pools:',JSON.stringify(summary));
console.log('PASS MD88: p.216-230 scope only; independent arithmetic and four-digit numpad contract.');
console.log('PASS MD88: deterministic 12/24 worksheets and 48-item shared no-repeat rounds.');
