#!/usr/bin/env node
'use strict';

/* MD87 source scope, independent correlation/count oracle, determinism and
   learner-visible finite-pool identity gate. */
const assert=require('assert/strict'),fs=require('fs'),path=require('path'),vm=require('vm');
const root=path.resolve(__dirname,'..'),store=new Map();
const w={console,Set,Map,Math,JSON,Date,URL,URLSearchParams,setTimeout,clearTimeout};w.window=w;
w.document={getElementById:()=>({}),querySelector:()=>null,querySelectorAll:()=>[],head:{appendChild(){}},body:{appendChild(){}}};
w.localStorage={getItem:k=>store.has(k)?store.get(k):null,setItem:(k,v)=>store.set(k,String(v))};
vm.createContext(w);
const load=f=>vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),w,{filename:f});
load('engine/rng.js');load('engine/threads/mid15.js');load('data/threads.js');
w.NM_THREADS.MD87={name:{ko:'산점도와 상관관계'},gen:'md87_scatter',unit:'M-87',widgets:['numpad','graphPlane'],levels:[
  {id:1,params:{mode:'plot'}},{id:2,params:{mode:'read'}},{id:3,params:{mode:'correlation'}},{id:4,params:{mode:'strength'}}]};
load('app/exam.js');

const gen=w.NM_TGEN.md87_scatter,modes=['plot','read','correlation','strength'];
const levels={plot:1,read:2,correlation:3,strength:4},counts={plot:12,read:24,correlation:12,strength:24};
function corr(points){
  const n=points.length,mx=points.reduce((s,p)=>s+p[0],0)/n,my=points.reduce((s,p)=>s+p[1],0)/n;
  let xy=0,xx=0,yy=0;points.forEach(p=>{const dx=p[0]-mx,dy=p[1]-my;xy+=dx*dy;xx+=dx*dx;yy+=dy*dy;});
  return xy/Math.sqrt(xx*yy);
}
function kind(r){
  if(r>=.88)return 'strongPositive';if(r>=.28&&r<=.58)return 'weakPositive';if(Math.abs(r)<=.08)return 'none';
  if(r<=-.28&&r>=-.58)return 'weakNegative';if(r<=-.88)return 'strongNegative';throw new Error('coefficient fell in an excluded ambiguity band: '+r);
}
function queryCount(points,q){return points.filter(p=>q.kind==='xAtLeast'?p[0]>=q.value:q.kind==='yAtLeast'?p[1]>=q.value:q.kind==='bothAtLeast'?p[0]>=q.x&&p[1]>=q.y:p[1]>p[0]).length;}
function check(p,mode,label){
  const m=p.scatterModel,sp=p.scatterPlot;assert(m&&sp,label+': scatter data missing');assert.equal(m.mode,mode);assert.equal(sp.mode,mode);
  assert.equal(p.widget,'numpad');assert.equal(p.answerType,'number');assert.deepEqual(Array.from(sp.points,x=>Array.from(x)),Array.from(m.points,x=>Array.from(x)));
  assert(sp.points.every(pt=>pt.length===2&&pt.every(Number.isFinite)),label+': invalid ordered pair');
  assert(new Set(sp.points.map(pt=>pt.join(','))).size===sp.points.length,label+': duplicate point');
  if(mode==='plot'){
    assert.equal(sp.showTable,true);assert.equal(sp.plotted,false);assert.deepEqual(Array.from(p.graph.pts),[]);assert.equal(p.answer,m.points.length);assert.equal(m.points.length,6);
  }else{
    assert.equal(sp.plotted,true);assert.deepEqual(Array.from(p.graph.pts,x=>Array.from(x)),Array.from(m.points,x=>Array.from(x)));
    if(mode==='read')assert.equal(p.answer,queryCount(m.points,m.query),label+': independent count mismatch');
    else{
      const r=corr(m.points),k=kind(r);assert.equal(m.kind,k,label+': independent relation mismatch');assert(Math.abs(r-m.r)<1e-12);
      assert.equal(p.answer,mode==='correlation'?(k==='none'?3:k.includes('Positive')?1:2):({strongPositive:1,weakPositive:2,none:3,weakNegative:4,strongNegative:5})[k]);
    }
  }
  assert(!/144|145|146|147|148|149|150|151|152|153/.test(JSON.stringify([p.prompt,p.tex])),label+': source locator leaked');
  return p;
}

const sizes=w.NM_TGEN.md87ScatterPoolSizes;
assert.equal(sizes.plot,240);assert(sizes.read>=500);assert.equal(sizes.correlation,960);assert.equal(sizes.strength,960);
for(const mode of modes){
  const size=sizes[mode],keys=new Set();
  for(let i=0;i<size;i++){
    const p=check(gen({mode},()=>(i+.5)/size),mode,mode+'/'+i),key=w.NM_EXAM.problemKey(p);
    assert(!keys.has(key),mode+': duplicate learner-visible pool item');keys.add(key);
  }
  assert.equal(keys.size,size,mode+': exact visible capacity mismatch');
  const level=levels[mode],count=counts[mode],seed=w.NM_RNG.hashSeed('md87-'+mode);
  const a=w.NM_EXAM.buildProblems('MD87',level,count,seed),b=w.NM_EXAM.buildProblems('MD87',level,count,seed);
  a.forEach((p,i)=>check(p,mode,mode+'/round/'+i));
  assert.equal(new Set(a.map(w.NM_EXAM.problemKey)).size,count,mode+': duplicate within worksheet');
  assert.deepEqual(a.map(w.NM_EXAM.problemKey),b.map(w.NM_EXAM.problemKey),mode+': deterministic replay changed');
  const reserved=new Set(a.map(w.NM_EXAM.problemKey));
  const c=w.NM_EXAM.buildProblems('MD87',level,count,w.NM_RNG.hashSeed('md87-'+mode+'-next'),null,null,reserved);
  assert.equal(c.length,count);assert.equal(reserved.size,count*2,mode+': shared no-repeat reservation failed');
}

/* Plotting items keep the answer and blank grid constant, so the table points
   themselves must participate in identity. */
const original=gen({mode:'plot'},()=>0),changed=JSON.parse(JSON.stringify(original));
changed.scatterPlot.points[0][1]+=1;
assert.notEqual(w.NM_EXAM.problemKey(original),w.NM_EXAM.problemKey(changed),'scatter point data missing from problemKey');

console.log('PASS MD87 pools:',JSON.stringify(sizes));
console.log('PASS MD87: ordered-pair plotting, condition counts and separated positive/negative/no-correlation coefficient bands.');
console.log('PASS MD87: exact visible identity includes scatter points; deterministic 12/24 and shared no-repeat second rounds.');
