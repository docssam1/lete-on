#!/usr/bin/env node
'use strict';
// Independent checks: never call a generator evaluator to recompute the key.
const assert = require('assert/strict'), fs = require('fs'), path = require('path'), vm = require('vm');
const root = path.resolve(__dirname,'..'), w = {console}; w.window=w; vm.createContext(w);
for (const file of ['engine/rng.js','data/graph-drawing.js']) vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),w,{filename:file});
const api=w.NM_GRAPH_DRAWING;
// Independent identity/capacity model: do not trust the producer's public key.
function identity(p) {
  const c=p.coefficients;
  return JSON.stringify([p.mode,p.variant,c.a,c.b,c.p,c.q]);
}
function expectedPool(mode,variant) {
  const magnitudes=mode==='inverse'?[4,6,8,12]:mode==='quadratic'?[0.5,1,2]:[1,2,3];
  const offsets=mode==='linear'?[-2,-1,1,2]:[0];
  const shifts=mode==='quadratic'&&variant==='shifted'?[-1,1]:[0];
  const identities=new Set();
  for(const a of magnitudes.flatMap(n=>[n,-n])) for(const b of offsets) for(const p of shifts) for(const q of shifts) {
    identities.add(JSON.stringify([mode,variant,a,b,p,q]));
  }
  return identities;
}
function checkSet(generated,previous=[]) {
  const used=new Set(previous.map(identity));
  for(const p of generated) {
    assert(!used.has(identity(p)),'A fixed mathematical variant was selected again.');
    used.add(identity(p));
  }
}
// The old six-question contract is deliberately frozen. Extra questions must
// come from unused pool members without changing existing first-six seeds.
function oldFirstSix(mode,variant,seed) {
  const r=w.NM_RNG, rng=r.mulberry32(r.hashSeed('graph-drawing:v1:'+mode+':'+variant+':'+seed));
  const magnitudes=mode==='inverse'?[4,6,8,12]:mode==='quadratic'?[0.5,1,2]:[1,2,3];
  const pos=r.shuffle(rng,magnitudes).slice(0,3),neg=r.shuffle(rng,magnitudes).slice(0,3).map(a=>-a);
  return r.shuffle(rng,pos.concat(neg)).map(a=>{
    const c={a,b:0,p:0,q:0};
    if(mode==='linear') c.b=r.pick(rng,[-2,-1,1,2]);
    if(mode==='quadratic'&&variant==='shifted'){c.p=r.pick(rng,[-1,1]);c.q=r.pick(rng,[-1,1]);}
    return c;
  });
}
function check(p) {
  assert.equal(p.answerType,'rubric'); assert.equal(p.assessment,'teacher-review');
  assert(!Object.hasOwn(p,'answer'),'Drawing must not be passed off as a numeric answer.');
  assert.equal(p.graph.kind,'points'); assert.equal(p.graph.pts.length,0,'Student graph contains answer points.');
  assert.deepEqual(Object.keys(p.graph).sort(),['kind','pts','xr','yr'],'Answer-bearing student graph property.');
  assert(p.rubric.length>=3); assert(p.source); assert(p.tex.startsWith('y='));
  const c=p.coefficients, xs=Array.from(p.xValues), ys=Array.from(p.yValues), pts=p.solutionGraph.pts;
  assert.notEqual(c.a,0); assert.equal(xs.length,ys.length); assert.equal(new Set(xs).size,xs.length);
  assert.equal(pts.length,xs.length);
  for (let i=0;i<xs.length;i++) {
    const x=xs[i],y=ys[i]; assert(Number.isInteger(x)); assert(Number.isInteger(y));
    assert.deepEqual(Array.from(pts[i]),[x,y]);
    assert(x>p.graph.xr[0]&&x<p.graph.xr[1]); assert(y>p.graph.yr[0]&&y<p.graph.yr[1]);
    if (p.mode==='inverse') {
      assert.notEqual(x,0); assert.notEqual(y,0); assert.equal(x*y,c.a);
      const quadrant=x>0?(y>0?1:4):(y>0?2:3);
      assert((c.a>0?[1,3]:[2,4]).includes(quadrant));
    } else if (p.mode==='quadratic') assert.equal(y-c.q,c.a*Math.pow(x-c.p,2)+0);
    else assert.equal(y-c.b,c.a*x+0);
  }
  assert.deepEqual(Array.from(p.solutionGraph.xr),Array.from(p.graph.xr));
  assert.deepEqual(Array.from(p.solutionGraph.yr),Array.from(p.graph.yr));
  if (p.mode==='inverse') {
    assert.equal(xs.filter(x=>x<0).length,3); assert.equal(xs.filter(x=>x>0).length,3);
    assert.equal(p.solutionGraph.kind,'hyperbola'); assert.equal(p.solutionGraph.k,c.a);
    assert.deepEqual(Array.from(p.features.quadrants),c.a>0?[1,3]:[2,4]);
  } else if (p.mode==='quadratic') {
    assert.equal(p.solutionGraph.kind,'parabola'); assert.equal(p.solutionGraph.a,c.a); assert.equal(p.solutionGraph.p,c.p); assert.equal(p.solutionGraph.q,c.q);
    assert(xs.includes(c.p));
    for(let i=0;i<xs.length;i++){assert.equal(xs[i]+xs[xs.length-1-i],2*c.p);assert.equal(ys[i],ys[ys.length-1-i]);}
  } else {
    assert.equal(p.solutionGraph.kind,'line'); assert.equal(p.solutionGraph.m,c.a); assert.equal(p.solutionGraph.b,c.b);
    assert.equal(c.a*p.features.xIntercept+c.b,0);
    assert.equal(p.features.yIntercept,c.b);
    if(p.mode==='direct') {assert.equal(c.b,0);assert(xs.includes(0));}
  }
}
let sets=0,problems=0;
const coverage=new Map();
for (const mode of api.modes) for (const variant of (mode==='quadratic'?['basic','shifted']:['basic'])) {
  for (let seed=0;seed<1000;seed++) {
    const options={mode,variant,count:6,seed:'independent-'+seed}, generated=api.makeSet(options);
    assert.equal(generated.length,6);
    assert.equal(generated.filter(p=>p.coefficients.a>0).length,3);
    assert.equal(generated.filter(p=>p.coefficients.a<0).length,3);
    assert.equal(new Set(generated.map(p=>p.tex)).size,6,'Duplicate formula in a six-task block.');
    checkSet(generated);
    assert.equal(JSON.stringify(generated.map(p=>p.coefficients)),JSON.stringify(oldFirstSix(mode,variant,options.seed)),'An existing six-task seed changed.');
    assert(!generated.some(p=>p.tex===api.lesson(mode,variant).example.tex),'Worked example leaks a practice answer.');
    assert.equal(new Set(generated.map(p=>p.id)).size,6);
    assert.equal(JSON.stringify(generated),JSON.stringify(api.makeSet(options)),'Seed is not deterministic.');
    for(const p of generated){check(p);problems++;coverage.set(mode+':'+variant+':'+p.coefficients.a,true);}
    sets++;
  }
  check(api.lesson(mode,variant).example);
}
let capacityCases=0,exclusionCases=0;
const capacities={direct:6,inverse:8,linear:24,'quadratic:basic':6,'quadratic:shifted':24};
for(const mode of api.modes) for(const variant of (mode==='quadratic'?['basic','shifted']:['basic'])) {
  const expected=expectedPool(mode,variant),capacity=capacities[mode==='quadratic'?mode+':'+variant:mode];
  assert.equal(expected.size,capacity);
  for(let count=1;count<=capacity;count++) for(let seed=0;seed<20;seed++) {
    const options={mode,variant,count,seed:'capacity-'+seed}, generated=api.makeSet(options);
    assert.equal(generated.length,count);checkSet(generated);
    for(const p of generated){check(p);assert(expected.has(identity(p)),'A variant escaped its source-bounded bank.');}
    assert.equal(JSON.stringify(generated),JSON.stringify(api.makeSet(options)));
    assert(!generated.some(p=>p.tex===api.lesson(mode,variant).example.tex));
    if(count===capacity) assert.deepEqual(new Set(generated.map(identity)),expected,'The full finite pool was not exhausted exactly.');
    for(let offset=0;offset+6<=generated.length;offset+=6) {
      assert.equal(generated.slice(offset,offset+6).filter(p=>p.coefficients.a>0).length,3);
    }
    capacityCases++;
  }
  for(const count of [capacity+1,60]) {
    const exclude=new Set(['unrelated-key']),before=Array.from(exclude);
    assert.throws(()=>api.makeSet({mode,variant,count,exclude}),error=>{
      assert.equal(error.code,'NM_UNIQUE_POOL_EXHAUSTED');assert.equal(error.requested,count);
      assert.equal(error.available,capacity);assert.equal(error.capacity,capacity);
      assert.equal(error.mode,mode);assert.equal(error.variant,variant);return true;
    });
    assert.deepEqual(Array.from(exclude),before,'A failed capacity request changed reservations.');
  }
  for(let seed=0;seed<50;seed++) {
    const exclude=new Set(['unrelated-key']), previous=[];
    while(previous.length<capacity) {
      const count=Math.min(3,capacity-previous.length),before=new Set(exclude);
      const generated=api.makeSet({mode,variant,count,seed:'overlap-'+seed,exclude});
      checkSet(generated,previous);
      for(const p of generated){assert(!before.has(api.getProblemKey(p)));assert(exclude.has(api.getProblemKey(p)));}
      const twinExclude=new Set(before);
      assert.equal(JSON.stringify(generated),JSON.stringify(api.makeSet({mode,variant,count,seed:'overlap-'+seed,exclude:twinExclude})));
      assert.deepEqual(exclude,twinExclude);
      previous.push(...generated);exclusionCases++;
    }
    assert.equal(exclude.size,capacity+1);assert(exclude.has('unrelated-key'));
    const before=Array.from(exclude);
    assert.throws(()=>api.makeSet({mode,variant,count:1,seed:'another-seed',exclude}),error=>error.code==='NM_UNIQUE_POOL_EXHAUSTED'&&error.available===0);
    assert.deepEqual(Array.from(exclude),before);
  }
  const all=api.makeSet({mode,variant,count:capacity,seed:'unbalanced'});
  const excludedPositive=all.filter(p=>p.coefficients.a>0),exclude=new Set(excludedPositive.map(api.getProblemKey));
  const negatives=api.makeSet({mode,variant,count:capacity/2,seed:'unbalanced',exclude});
  assert(negatives.every(p=>p.coefficients.a<0),'Sign balancing reintroduced an excluded positive variant.');
  checkSet(negatives,excludedPositive);
  const p=all[0],copy=JSON.parse(JSON.stringify(p));copy.id='another-id';copy.seed='another-seed';
  assert.equal(api.getProblemKey(copy),api.getProblemKey(p),'Identity depends on render id or seed.');
  copy.coefficients.a*=-1;assert.notEqual(api.getProblemKey(copy),api.getProblemKey(p));
}
// A failed second overlapping block must not reserve even one new graph.
const partialExclude=new Set();api.makeSet({mode:'inverse',count:6,exclude:partialExclude});
const partialBefore=Array.from(partialExclude);
assert.throws(()=>api.makeSet({mode:'inverse',count:3,exclude:partialExclude}),error=>error.code==='NM_UNIQUE_POOL_EXHAUSTED'&&error.available===2);
assert.deepEqual(Array.from(partialExclude),partialBefore);
assert.equal(api.makeSet({mode:'inverse',count:2,exclude:partialExclude}).length,2);
// Mixed modes share a reservation set without hiding unrelated graph types.
const mixedExclude=new Set(),mixed=[];
for(const mode of api.modes) for(const variant of (mode==='quadratic'?['basic','shifted']:['basic'])) {
  const generated=api.makeSet({mode,variant,count:6,exclude:mixedExclude});checkSet(generated,mixed);mixed.push(...generated);
}
assert.equal(mixedExclude.size,30);
for(const bad of [[],{},'key']) assert.throws(()=>api.makeSet({exclude:bad}),/exclude must be a Set/);
for(const bad of [0,-1,1.2,61,NaN,Infinity,'6']) assert.throws(()=>api.makeSet({count:bad}));
assert.throws(()=>api.makeSet({mode:'unknown'})); assert.throws(()=>api.lesson('unknown'));
assert.throws(()=>api.makeSet({mode:'inverse',variant:'shifted'}));
assert.notEqual(api.makeSet({mode:'quadratic',variant:'basic'})[0].id,api.makeSet({mode:'quadratic',variant:'shifted'})[0].id);
const mutations=[
  p=>{p.graph.pts=[[1,1]];},p=>{p.graph.kind='hyperbola';p.graph.k=p.coefficients.a;},
  p=>{p.yValues[0]+=1;},p=>{p.xValues[0]=0;},p=>{p.solutionGraph.k*=-1;},
  p=>{p.graph.xr=[-1,1];},p=>{p.answer=123;},p=>{p.features.quadrants=[1,2];}
];
for(const mutate of mutations){const p=JSON.parse(JSON.stringify(api.makeSet({mode:'inverse',count:1})[0]));mutate(p);assert.throws(()=>check(p),'Negative fixture escaped independent validation.');}
const collidingExample=api.makeSet({mode:'inverse',count:6})[0].tex;
assert.throws(()=>assert(!api.makeSet({mode:'inverse',count:6}).some(p=>p.tex===collidingExample)),'Example collision negative fixture escaped.');
const unique=api.makeSet({mode:'inverse',count:6}),cycled=unique.concat(JSON.parse(JSON.stringify(unique[0])));
cycled[cycled.length-1].id='a-new-id-is-not-a-new-variant';
assert.throws(()=>checkSet(cycled),'Cycle/refill duplicate negative fixture escaped.');
assert.throws(()=>checkSet([cycled[cycled.length-1]],unique),'Cross-round duplicate negative fixture escaped.');
console.log(`PASS graph-drawing: ${sets.toLocaleString()} seeded sets / ${problems.toLocaleString()} problems; independent values, graph bounds, signed branches, symmetry, blank student graphs and ${mutations.length} negative fixtures.`);
console.log(`PASS finite banks: ${capacityCases.toLocaleString()} count/seed cases; ${exclusionCases.toLocaleString()} cross-round reservation cases; exact capacities 6/8/24/6/24, transactional exhaustion, canonical keys and duplicate negative fixtures.`);
console.log('PASS outside-bank examples, unchanged first-six seeds, available sign balance, teacher-only rubric and invalid input rejection.');
