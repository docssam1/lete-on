'use strict';
const assert=require('node:assert/strict'),fs=require('fs'),path=require('path');
const bank=require('../challenge/exam-supplement.js');
const {partitions,quadrilaterals}=require('./supplement-geometry.cjs');
const perm=a=>a.length?a.flatMap((v,i)=>perm(a.filter((_,j)=>j!==i)).map(t=>[v,...t])):[[]];
const only=a=>{assert.equal(a.length,1);return a[0];};
const canon=parts=>parts.map(p=>[...p].sort((a,b)=>a-b).join(',')).sort().join(';');
function solve(p){
  if(p.kind.startsWith('priority-'))return require('./challenge-priority-solvers.cjs').solve(p);
  switch(p.kind){
    case 'digit-multiselect':return p.options.filter(n=>n>=10&&n<100&&n%2===0&&n%10>Math.floor(n/10));
    case 'difference-equation-count':return p.differences.map(d=>p.cards.flatMap(a=>p.cards.filter(b=>b!==a&&a-b===d)).length);
    case 'weight-order':{
      const possible=new Set();
      for(let apple=1;apple<=12;apple++)for(let pear=1;pear<=12;pear++)for(let berry=1;berry<=12;berry++)for(let orange=1;orange<=12;orange++){
        const weights={apple,pear,berry,orange};
        if(!p.relations.every(([a,op,b,c])=>op==='>'?weights[a]>weights[b]:weights[a]===b*weights[c]))continue;
        const sorted=Object.keys(weights).sort((a,b)=>weights[a]-weights[b]);possible.add(sorted[3]+','+sorted[0]);
      }return only([...possible]).split(',').map(k=>({orange:'귤',berry:'딸기',apple:'사과',pear:'배'})[k]);
    }
    case 'congruent-partition':return only(partitions(p.size).filter(t=>t.parts.every(r=>p.apples.filter(i=>r.includes(i)).length===1&&p.berries.filter(i=>r.includes(i)).length===1))).parts;
    case 'inside-outside-analogy':return only(p.options.flatMap(([a,b],i)=>a===p.inner&&b===p.outer?[i+1]:[]));
    case 'digital-mirror':return p.equations.map(e=>only(Array.from({length:100},(_,n)=>n).filter(n=>{const t=e.map(v=>v==='blank'?n:v);return t[0]+t[2]===t[4];}))).reduce((s,n)=>s+n,0);
    case 'maximum-under-conditions':return Math.max(...Array.from({length:100},(_,n)=>n).filter(n=>p.lower.every(v=>n>v)&&p.upper.every(v=>n<v)&&n%2===p.parity));
    case 'smallest-equation-blank':{
      const values=p.equations.map(e=>only(Array.from({length:100},(_,n)=>n).filter(n=>{const t=e.map(v=>v==='blank'?n:v);return (t[1]==='+'?t[0]+t[2]:t[0]-t[2])===t[3];})));
      return only(values.flatMap((v,i)=>v===Math.min(...values)?[i+1]:[]));
    }
    case 'card-distribution':return only(perm(p.cards).filter(a=>p.targets.every((t,i)=>a[2*i]<a[2*i+1]&&a[2*i]+a[2*i+1]===t))).reduce((s,n,i)=>{if(i%2===0)s.push([n]);else s[s.length-1].push(n);return s;},[]);
    case 'general-quadrilateral-count':return quadrilaterals(p.points,p.segments).length;
    case 'independent-color-shape-period':{
      const sequence=Array.from({length:p.through},(_,i)=>({shape:p.shapes[i%p.shapes.length],color:p.colors[i%p.colors.length]})),nth=sequence[p.position-1];
      return [nth.color+' '+({star:'별',circle:'원',triangle:'삼각형',square:'정사각형'})[nth.shape],sequence.filter(t=>t.shape===p.targetShape&&t.color===p.colors[p.targetColor]).length];
    }
    case 'circle-bar-code':{
      const weights=[];for(let a=0;a<10;a++)for(let b=0;b<10;b++)if(p.examples.every(e=>a*e.circle+b*e.bars===e.value))weights.push([a,b]);
      const [a,b]=only(weights);return p.shown.reduce((s,e)=>s+a*e.circle+b*e.bars,0);
    }
    default:throw new Error('Unsolved supplement '+p.kind);
  }
}
module.exports={solve};
let checks=0;const ids=new Set();
for(const round of [1,2]){
  const extra=bank.get(round);assert.equal(extra.questions.length,6);
  assert.deepEqual(extra.questions.map(q=>q.number),[1,2,3,4,5,6]);
  for(const q of extra.questions){
    assert(!ids.has(q.typeId));ids.add(q.typeId);
    const answer=solve(q.payload);
    if(q.payload.kind==='congruent-partition')assert.equal(canon(answer),canon(q.answer));else assert.deepEqual(answer,q.answer,q.typeId);
    assert(q.solution.length>35);checks++;
  }
}
const mirror=bank.get(1).questions[5];
// Preserve regression coverage of the displaced balance renderer without counting it as current coverage.
const scales=bank.getPrevious(1).questions[2].problemHtml;
assert.deepEqual(bank.get(1).questions.filter(q=>q.priorityReplacement).map(q=>q.number),[2,3]);
assert.deepEqual(bank.get(2).questions.filter(q=>q.priorityReplacement).map(q=>q.number),[2]);
assert.equal((scales.match(/class="proper-balance"/g)||[]).length,3);
assert.deepEqual([...scales.matchAll(/data-tilt="(\d+)"/g)].map(m=>Number(m[1])),[12,0,12]);
const pans=[...scales.matchAll(/data-beam-y="(\d+)" data-pan-y="(\d+)"/g)].map(m=>[Number(m[1]),Number(m[2])]);
assert.equal(pans.length,6);assert(pans.every(([beamY,panY])=>panY-beamY===92));
assert.equal((mirror.problemHtml.match(/class="reflected-equation"/g)||[]).length,2);
assert.equal((mirror.problemHtml.match(/translate\(660 0\) scale\(-1 1\)/g)||[]).length,2);
// Decode the authored seven-segment source against an independent conventional map.
const src=fs.readFileSync(path.resolve(__dirname,'../challenge/exam-supplement.js'),'utf8');
const definitions=src.match(/const digitSegments=(\[[^;]+);/)[1];
const digits=Function('return '+definitions)();
const standard=['abcdef','bc','abdeg','abcdg','bcfg','acdfg','acdefg','abc','abcdefg','abcdfg'];
assert.deepEqual(digits.map(s=>[...s].sort().join('')),standard);
require('../challenge/challenge-bank.js');
for(const round of [1,2])assert.equal(globalThis.HFChallengeBank.createMockExam(round,62001).questions.length,20);
const result={passed:true,independentExtraChecks:checks,distinctExtraTypes:ids.size,mainQuestionsPerRound:20,extraQuestionsPerRound:6,mirrorTransformChecks:2,congruentPartitionSolutions:1,cardDistributionSolutions:1};
fs.writeFileSync(path.resolve(__dirname,'../output/qa/challenge-editions-separated/supplement-report.json'),JSON.stringify(result,null,2));
console.log(JSON.stringify(result,null,2));
