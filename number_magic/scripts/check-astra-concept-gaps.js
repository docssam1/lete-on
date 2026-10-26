#!/usr/bin/env node
'use strict';
// Source-independent arithmetic and presentation contract checks for the three
// new activities; compare untouched generators against the pre-change version.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {execFileSync} = require('node:child_process');
const root = path.resolve(__dirname, '..');
const baseline = '037f5086';
const katex = require('../vendor/katex/katex.min.js');
function context(old=false) {
  const c = {console}; c.window = c; vm.createContext(c);
  for (const f of ['engine/rng.js','engine/threads/mid6.js','engine/threads/mid7.js','data/threads.js']) {
    const text = old ? execFileSync('git',['show',`${baseline}:number_magic/${f}`],{cwd:root,encoding:'utf8'}) : fs.readFileSync(path.join(root,f),'utf8');
    vm.runInContext(text,c,{filename:f});
  }
  return c;
}
const c=context(), old=context(true);
const plain=x=>JSON.parse(JSON.stringify(x));
let samples=0, parity=0;
function generate(ctx,thread,params,seed){return ctx.NM_TGEN[ctx.NM_THREADS[thread].gen](params,ctx.NM_RNG.mulberry32(seed));}
for (const [thread,id,kind] of [['MD38',4,'changeBaseProduct'],['MD44',4,'averageRate'],['MD44',5,'definitionLimit']]) {
  const level=c.NM_THREADS[thread].levels.find(l=>l.id===id);
  assert(level.offLadder);
  for(const lang of ['ko','en','zh']) assert(level.concept[lang] && level.label[lang]);
  const unique=new Set();
  for(let seed=0;seed<1024;seed++) {
    const p=generate(c,thread,level.params,seed), m=p.mathModel;
    assert.equal(m.kind,kind);
    assert(Number.isInteger(p.answer));
    assert.equal(p.answerType,'number'); assert.equal(p.widget,'numpad');
    assert.equal(p.negative,p.answer<0);
    assert.equal((p.tex.match(/\\square/g)||[]).length,1);
    assert.equal(p.solution.at(-1).blank,p.answer);
    for(const lang of ['ko','en','zh']) assert(p.prompt[lang]);
    assert(!/undefined|NaN|Infinity/.test(JSON.stringify(p)));
    for(const tex of [p.tex,...p.solution.map(step=>step.tex)]) katex.renderToString(tex,{throwOnError:true,strict:'error'});
    assert.deepEqual(plain(p),plain(generate(c,thread,level.params,seed)));
    if(kind==='changeBaseProduct') {
      assert(m.a>1 && m.b>1 && m.a!==m.b && m.N>0);
      const independent=Math.log(m.b)/Math.log(m.a)*Math.log(m.N)/Math.log(m.b);
      assert(Math.abs(independent-p.answer)<1e-10);
      assert(Math.abs(Math.log(m.b)/Math.log(m.a)-Math.round(Math.log(m.b)/Math.log(m.a)))>1e-5);
      assert(p.tex.includes(`\\log_{${m.a}} ${m.b}`) && p.tex.includes(`\\log_{${m.b}} ${m.N}`));
    } else {
      const f=x=>m.a2*x*x+m.a1*x+m.a0;
      assert(p.tex.includes(`f(x)=`) && p.tex.includes(String(m.u)));
      if(kind==='averageRate') {
        assert(m.v>m.u);
        assert.equal((f(m.v)-f(m.u))/(m.v-m.u),p.answer);
        assert.equal(p.solution[0].blank,f(m.u)); assert.equal(p.solution[1].blank,f(m.v));
      } else {
        // Symmetric finite differences are exact for quadratics, independently
        // checking the limit at multiple scales without the derivative formula.
        for(const h of [1,0.5,0.125]) assert.equal((f(m.u+h)-f(m.u-h))/(2*h),p.answer);
        for(const h of [-2,-1,1,2]) assert.equal((f(m.u+h)-f(m.u))/h+0,m.a2*h+p.answer+0);
        assert(p.tex.includes('\\lim_{h\\to0}'));
      }
    }
    unique.add(p.tex); samples++;
  }
  assert(unique.size>=40,`${thread}-${id}: inadequate visible variety`);
}
for(const thread of ['MD38','MD44']) {
  for(const level of old.NM_THREADS[thread].levels) {
    for(let seed=0;seed<512;seed++) {
      const a=plain(generate(c,thread,level.params,seed));
      const b=plain(generate(old,thread,level.params,seed));
      // L3 corrects a misleading change-of-base instruction only. Every other
      // field and every legacy seed, answer, expression and solution is frozen.
      if(thread==='MD38' && level.id===3){delete a.prompt;delete b.prompt;}
      assert.deepEqual(a,b,`${thread}-${level.id} seed ${seed}`); parity++;
    }
  }
}
const ns=c.NM_THREADS.NS1.levels.find(l=>l.id===7);
assert.deepEqual(plain(ns.params),{max:99});
for(const lang of ['ko','en','zh']) {assert(ns.concept[lang].includes('47'));assert(!/472|400/.test(ns.concept[lang]));}
assert.deepEqual(plain(c.NM_THREADS.NS1.levels.filter(l=>l.id!==7)),plain(old.NM_THREADS.NS1.levels.filter(l=>l.id!==7)));
console.log(`PASS: ${samples} new activity samples, ${parity} legacy output comparisons, NS1-L7 locale/range checks.`);
