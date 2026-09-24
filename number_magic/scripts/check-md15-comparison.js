#!/usr/bin/env node
'use strict';

/* MD15 L4~6 exact-comparison, finite-pool and old-level regression. */
const assert=require('assert/strict');
const fs=require('fs'),path=require('path'),vm=require('vm');
const root=path.resolve(__dirname,'..');
const store=new Map();
const w={console,Set,Map,Math,JSON,Date,URL,URLSearchParams,setTimeout,clearTimeout};
w.window=w;
w.document={getElementById:()=>({}),querySelector:()=>null,querySelectorAll:()=>[],head:{appendChild(){}},body:{appendChild(){}}};
w.localStorage={getItem:k=>store.has(k)?store.get(k):null,setItem:(k,v)=>store.set(k,String(v))};
vm.createContext(w);
const load=f=>vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),w,{filename:f});
load('engine/rng.js'); load('engine/threads/mid3.js'); load('data/threads.js'); load('app/exam.js');

const gen=w.NM_TGEN.md15_sqrtValue;
const modes=['comparePositive','compareNegative','compareMixed'];
const levels={comparePositive:4,compareNegative:5,compareMixed:6};

function cmpFrac(aN,aD,bN,bD){
  const a=aN*bD,b=bN*aD;
  return a===b?0:(a>b?1:-1);
}
function exact(problem){
  const {left,right}=problem.comparison;
  if(left.sign!==right.sign) return left.sign>right.sign?1:-1;
  if(left.sign===0)return 0;
  const ls=left.kind==='root'?{n:left.n,d:left.d}:{n:left.n*left.n,d:left.d*left.d};
  const rs=right.kind==='root'?{n:right.n,d:right.d}:{n:right.n*right.n,d:right.d*right.d};
  const mag=cmpFrac(ls.n,ls.d,rs.n,rs.d);
  return left.sign>0?mag:-mag;
}
function verify(problem,mode){
  assert(problem.comparison,mode+' comparison metadata missing');
  assert.equal(problem.comparison.mode,mode);
  const cmp=exact(problem),relation=cmp>0?'>':(cmp<0?'<':'=');
  assert.equal(problem.comparison.relation,relation,'exact rational comparison mismatch');
  assert.equal(problem.answer,cmp>0?1:(cmp<0?3:2),'choice number mismatch');
  assert.match(problem.tex,/①>\\;②=\\;③</,'visible relation guide missing');
  assert(problem.answerRelationTex.startsWith(String(problem.answer)+'\\;('),'answer key must start with the selected number');
  assert.equal(problem.solution.at(-1).blank,problem.answer);
  return problem;
}

/* Every finite-pool entry is reachable once with a bucket-centered RNG value.
   This also proves that no two pool entries have the same learner-visible tex. */
const poolSummary={};
for(const mode of modes){
  const first=verify(gen({mode},()=>0),mode);
  const size=first.comparison.poolSize;
  assert(size>=1000,mode+' pool is too small for repeated 24-question practice');
  const tex=new Set(),answers=new Set();
  for(let i=0;i<size;i++){
    const p=verify(gen({mode},()=>(i+.5)/size),mode);
    assert.equal(p.comparison.poolIndex,i,mode+' pool bucket is unreachable');
    assert(!tex.has(p.tex),mode+' duplicate visible variant: '+p.tex);
    tex.add(p.tex); answers.add(p.answer);
  }
  assert.deepEqual([...answers].sort(),[1,2,3],mode+' must contain left/equal/right answers');
  poolSummary[mode]=size;
}

/* Explicit requirements: negative-root reversal; fraction/decimal equality;
   different signs; and no floating-point approximation in the answer. */
let sawNegativeReverse=false,sawFraction=false,sawDecimal=false,sawMixedSign=false,sawMixedEquality=false;
for(let seed=0;seed<20000;seed++){
  const neg=verify(gen({mode:'compareNegative'},w.NM_RNG.mulberry32(seed)),'compareNegative');
  const left=neg.comparison.left,right=neg.comparison.right;
  if(neg.answer!==2 && left.sign<0 && right.sign<0) sawNegativeReverse=true;
  const p=verify(gen({mode:'compareMixed'},w.NM_RNG.mulberry32(seed)),'compareMixed');
  sawFraction ||= /\\dfrac/.test(p.tex);
  sawDecimal ||= /\d+\.\d/.test(p.tex);
  sawMixedSign ||= p.comparison.left.sign!==p.comparison.right.sign;
  sawMixedEquality ||= p.answer===2 && p.comparison.left.kind!==p.comparison.right.kind;
}
assert(sawNegativeReverse&&sawFraction&&sawDecimal&&sawMixedSign&&sawMixedEquality,'required comparison fixtures did not appear');

/* Seed replay and a deliberately large classroom round. Core de-duplication
   must never repeat a visible variant. */
for(const mode of modes){
  const lv=levels[mode],seed=w.NM_RNG.hashSeed('md15-'+mode+'-60');
  const a=w.NM_EXAM.buildProblems('MD15',lv,60,seed);
  const b=w.NM_EXAM.buildProblems('MD15',lv,60,seed);
  a.forEach(p=>verify(p,mode));
  assert.equal(new Set(a.map(w.NM_EXAM.problemKey)).size,60,mode+' repeated a learner-visible variant');
  assert.deepEqual(a.map(p=>p.tex),b.map(p=>p.tex),mode+' seed replay changed');
}

/* New branches are before the legacy branch and must not consume an old
   level's RNG calls or change its output. */
const legacy={
  perfect:{tex:'\\sqrt{1936} = \\square',answer:44},
  squareOfSqrt:{tex:'(\\sqrt{109})^2 = \\square',answer:109},
  absValue:{tex:'\\sqrt{(-22)^2} = \\square',answer:22}
};
for(const [mode,expected] of Object.entries(legacy)){
  const p=gen({mode},w.NM_RNG.mulberry32(20260924));
  assert.equal(p.tex,expected.tex,mode+' legacy tex changed');
  assert.equal(p.answer,expected.answer,mode+' legacy answer changed');
}

console.log('PASS MD15 comparison pools:',JSON.stringify(poolSummary));
console.log('PASS MD15 comparison: exact rational math, 3-way answers, sign reversal, fraction/decimal/equality coverage.');
console.log('PASS MD15 comparison: 60 unique deterministic items per new level; legacy levels unchanged.');
