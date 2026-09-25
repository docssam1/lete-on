#!/usr/bin/env node
'use strict';

/* MD11 L4/L5 source-shaped arithmetic gate.
 * learner_stage: Korean middle school grade 2, semester 1.
 * Criteria: language, representations, prerequisites, reasoning-load and
 * response-mode (integer coefficient plus x/y exponents) are checked here.
 * Private textbook images are never loaded or copied by this test.
 */
const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const store = new Map();
const w = {console,Set,Map,Math,JSON,Date,URL,URLSearchParams,setTimeout,clearTimeout};
w.window = w;
w.document = {getElementById:()=>({}),querySelector:()=>null,querySelectorAll:()=>[],head:{appendChild(){}},body:{appendChild(){}}};
w.localStorage = {getItem:k=>store.has(k)?store.get(k):null,setItem:(k,v)=>store.set(k,String(v))};
vm.createContext(w);
for(const file of ['engine/rng.js','engine/threads/mid2.js','data/threads.js','data/middle-concepts.js','data/middle-pacing.js','app/exam.js']) {
  vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),w,{filename:file});
}

const plain = v => JSON.parse(JSON.stringify(v));
const sig = p => JSON.stringify({prompt:p.prompt.ko,tex:p.tex,answer:p.answer});
const mul = (a,b) => ({c:a.c*b.c,x:a.x+b.x,y:a.y+b.y});
const div = (a,b) => ({c:a.c/b.c,x:a.x-b.x,y:a.y-b.y});
const same = (a,b,label) => assert.deepEqual(plain(a),plain(b),label);

function checkReverse(p,label){
  const m=p.algebra;
  assert.equal(m.operation,'solve-missing-monomial',`${label}: semantic operation`);
  assert.deepEqual(plain(p.answer),[m.missing.c,m.missing.x,m.missing.y],`${label}: answer model drift`);
  assert(m.missing.c!==0 && m.missing.x>=1 && m.missing.y>=1,`${label}: missing monomial response contract`);
  if(m.form==='mul') same(mul(m.a,m.missing),m.b,`${label}: A*M=B`);
  else if(m.form==='divide') same(div(m.a,m.missing),m.b,`${label}: A/M=B`);
  else if(m.form==='mulDiv') same(div(mul(m.a,m.missing),m.b),m.c,`${label}: A*M/B=C`);
  else if(m.form==='divMul') same(mul(div(m.a,m.missing),m.b),m.c,`${label}: A/M*B=C`);
  else assert.fail(`${label}: unknown reverse form ${m.form}`);
  assert.equal((p.tex.match(/\\square/g)||[]).length,3,`${label}: coefficient and two exponent boxes`);
  assert.equal(p.negative,m.missing.c<0,`${label}: minus-key contract`);
}

function checkFormula(p,label){
  const m=p.algebra;
  assert.equal(m.operation,'substitute-shape-formula',`${label}: semantic operation`);
  assert(['rectangle','triangle','parallelogram','rhombus','rectPrism','pyramid'].includes(m.shape),`${label}: unsupported formula`);
  const product=m.factors.reduce((acc,v)=>mul(acc,v),{c:m.factor.n,x:0,y:0});
  const independently={c:product.c/m.factor.d,x:product.x,y:product.y};
  same(independently,m.result,`${label}: independent formula result`);
  assert(Number.isInteger(m.result.c) && m.result.c>0,`${label}: coefficient must simplify to a positive integer`);
  assert(m.result.x>=1 && m.result.y>=1,`${label}: both letter exponents stay observable`);
  assert.deepEqual(plain(p.answer),[m.result.c,m.result.x,m.result.y],`${label}: response/model drift`);
  assert.equal((p.tex.match(/\\square/g)||[]).length,3,`${label}: coefficient and two exponent boxes`);
  assert(!/그림을 보고|도형을 찾아/.test(p.prompt.ko),`${label}: geometry inference leaked into arithmetic task`);
}

const cases=[
  {level:4,mode:'solveBox',count:12,validate:checkReverse,min:250},
  {level:5,mode:'formulaSub',count:24,validate:checkFormula,min:350}
];
for(const test of cases){
  const seen=new Set();
  const structures=new Set();
  for(let seed=0;seed<12000;seed++){
    const numeric=w.NM_RNG.hashSeed(`MD11/${test.level}/${seed}`);
    const p=w.NM_TGEN.md11_monoMulDiv({mode:test.mode},w.NM_RNG.mulberry32(numeric));
    test.validate(p,`MD11 L${test.level} seed ${seed}`);
    seen.add(sig(p));
    structures.add(p.algebra.form||p.algebra.shape);
    const replay=w.NM_TGEN.md11_monoMulDiv({mode:test.mode},w.NM_RNG.mulberry32(numeric));
    assert.equal(sig(replay),sig(p),`MD11 L${test.level}: deterministic replay changed`);
  }
  assert(seen.size>=test.min,`MD11 L${test.level}: visible pool too small (${seen.size})`);
  assert.equal(structures.size,test.level===4?4:6,`MD11 L${test.level}: source structures missing`);
  for(let seed=0;seed<100;seed++){
    const shared=new Set();
    const numeric=w.NM_RNG.hashSeed(`MD11/set/${test.level}/${seed}`);
    const practice=w.NM_EXAM.buildProblems('MD11',test.level,test.count,numeric,null,null,shared);
    const teaching=w.NM_EXAM.buildProblems('MD11',test.level,4,numeric^0x9e3779b9,null,null,shared);
    const all=practice.concat(teaching);
    assert.equal(all.length,test.count+4);
    assert.equal(new Set(all.map(w.NM_EXAM.problemKey)).size,all.length,`MD11 L${test.level}: learner-visible repeat`);
  }
  console.log(`PASS MD11 L${test.level} ${test.mode}: ${seen.size.toLocaleString()} sampled variants; ${test.count}+4 no-repeat allocation.`);
}

const levels=w.NM_THREADS.MD11.levels;
assert.deepEqual(plain(levels.slice(-2).map(v=>v.params.mode)),['solveBox','formulaSub']);
assert.equal(w.NM_MIDDLE_CONCEPTS.MD11.source,'2-1A:66,70,80-81,106-108');
assert(w.NM_MIDDLE_CONCEPTS.MD11.steps.join(' ').includes('1/2'));
const extra=w.NM_MIDDLE_PACING.grades[2].supplementary.filter(v=>v.t==='MD11');
assert.deepEqual(plain(extra.map(v=>[v.lv,v.n])),[[4,12],[5,24]]);
console.log('PASS learner-fit: middle2-1 Korean instructions, explicit formulas, no geometry inference, integer three-field response.');
