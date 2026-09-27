#!/usr/bin/env node
'use strict';
// |a|-|b|는 일반 산술 파서가 건너뛰므로, 실제 발견한 오개념을 별도로 재현한다.
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert/strict');
const root=path.resolve(__dirname,'..'),w={console};w.window=w;vm.createContext(w);
for(const f of ['engine/rng.js','engine/generators.js','engine/threads/mid.js','engine/threads/mid10.js','data/threads.js','data/middle-concepts.js'])vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),w);
const t=w.NM_THREADS.MD2,lv=t.levels.find(l=>l.id===2);
let negativeFirst=0,positiveFirst=0;
for(let seed=0;seed<4000;seed++){
  const p=w.NM_TGEN[t.gen](lv.params,w.NM_RNG.mulberry32(seed));
  const nums=p.tex.match(/-?\d+/g).map(Number);assert.equal(p.answer,nums[0]+nums[1]);
  if(nums[0]<0)negativeFirst++;else positiveFirst++;
  for(const name of ['steps','solution']){
    const line=p[name][0],m=/^\|(-?\d+)\| - \|(-?\d+)\|/.exec(line.tex);assert(m,line.tex);
    assert.equal(Math.abs(Number(m[1]))-Math.abs(Number(m[2])),line.blank,line.tex);
    assert.equal(line.blank,Math.abs(Math.abs(nums[0])-Math.abs(nums[1])));
    assert.equal(p[name][1].blank,p.answer);
  }
}
assert(negativeFirst&&positiveFirst);
console.log('PASS MD2 different-sign addition: 4,000 problems / 8,000 absolute-value steps; both sign orders.');
const seen=new Set();
for(let seed=0;seed<1000;seed++){
  const p=w.NM_TGEN.md69_proportionGraph({mode:'inverseGraph'},w.NM_RNG.mulberry32(seed));
  const a=p.graph.k;assert.equal(a,p.answer);assert.notEqual(a,0);
  for(const x of [-6,-3,-1,1,3,6]){
    const y=a/x,q=x>0?(y>0?1:4):(y>0?2:3);
    assert((a>0?[1,3]:[2,4]).includes(q));seen.add(q);
  }
}
assert.equal(seen.size,4);
assert(w.NM_MIDDLE_CONCEPTS.MD69.steps.join(' ').includes('제1·3사분면'));
assert(w.NM_MIDDLE_CONCEPTS.MD69.steps.join(' ').includes('제2·4사분면'));
console.log('PASS inverse proportion: 1,000 generated constants / 6,000 points; positive I/III, negative II/IV.');
