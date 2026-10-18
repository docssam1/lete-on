import assert from 'node:assert/strict';
import {bank,answerFor} from './core.js';
import {initialActivity,piecesFor} from './activity-model.js';
import {makeTenPlan,additionSteps,requestHelp,nextHelp,restoreHelp,HELP_PLAN_VERSION} from './calculation-help.js';
import {initialCalculation,restoreCalculation,submitCalculation,phaseFor} from './calculation.js';
function verify(numbers,steps){
 const available=[...numbers];let tens=0;
 for(const step of steps){
  assert.deepEqual(step.usedBefore,numbers.map((v,i)=>v-available[i]));
  if(step.kind==='make-ten'){
   // Independent enumeration: a whole-number group must be used if one exists.
   let minWhole=Infinity;
   for(let mask=1;mask<2**available.length;mask++){
    let sum=0,count=0;for(let i=0;i<available.length;i++)if(mask&(1<<i)){if(!available[i]){sum=-999;break;}sum+=available[i];count++;}
    if(sum===10)minWhole=Math.min(minWhole,count);
   }
   if(Number.isFinite(minWhole)){assert.notEqual(step.strategy,'split');assert.equal(step.contributions.length,minWhole);}
   else assert.equal(step.strategy,'split');
   const seen=new Set();let made=0;
   for(const c of step.contributions){assert(!seen.has(c.index));seen.add(c.index);assert.equal(c.before,available[c.index]);assert(c.take>0&&c.take<=available[c.index]);available[c.index]-=c.take;assert.equal(c.after,available[c.index]);made+=c.take;}
   assert.equal(made,10);assert.equal(step.left+step.number,10);assert.equal(step.total,10);tens++;assert.equal(step.tenCount,tens);
  }else{
   assert.equal(step.tenCount,tens);assert.deepEqual(step.available,available);assert.equal(step.remainder,available.reduce((n,v)=>n+v,0));assert(step.remainder<10);assert.equal(step.left,tens*10);assert.equal(step.number,step.remainder);assert.equal(step.total,numbers.reduce((n,v)=>n+v,0));
  }
  assert.deepEqual(step.usedAfter,numbers.map((v,i)=>v-available[i]));assert.equal(tens*10+available.reduce((n,v)=>n+v,0),numbers.reduce((n,v)=>n+v,0));
 }
 assert.equal(steps.at(-1).kind,'finish');
}
const references=[[3,6,7,4],[1,5,8,5],[8,7],[6,6],[3,3,3,3],[1,2],Array(12).fill(1)];
for(const numbers of references)verify(numbers,makeTenPlan(numbers));
assert.deepEqual(makeTenPlan([1,5,8,5])[0].contributions.map(c=>c.take),[5,5]);
const moved=makeTenPlan([8,7])[0];assert.equal(moved.strategy,'split');assert.deepEqual(moved.contributions.map(c=>[c.take,c.after]),[[8,0],[2,5]]);
let plans=0,actions=0;
for(const p of bank){
 const numbers=piecesFor(p).flatMap(piece=>piece.cells.map(id=>p.grid[Math.floor(id/4)][id%4]));
 const steps=additionSteps(p),model={phase:'done',collected:piecesFor(p).map(x=>x.id),cutKeys:p.cells.map(x=>x.r*2+x.c)};verify(numbers,steps);plans++;
 let calc={...initialCalculation(),input:'999'};assert.deepEqual(requestHelp(p,initialActivity(),calc),calc);assert.deepEqual(nextHelp(p,model,calc),calc);calc=requestHelp(p,model,calc);
 for(let i=0;i<steps.length;i++){
  assert.equal(calc.helpStep,i);assert.equal(calc.input,'999');assert.equal(calc.solved,false);assert.equal(phaseFor('challenge',model,calc),'calculate');assert.deepEqual(restoreCalculation(p,model,calc),calc);
  if(steps[i].kind==='make-ten'){assert.equal(calc.helpPacked,false);calc=nextHelp(p,model,calc);assert.equal(calc.helpStep,i);assert.equal(calc.helpPacked,true);actions++;assert.deepEqual(restoreCalculation(p,model,calc),calc);}
  if(i<steps.length-1){calc=nextHelp(p,model,calc);actions++;}
 }
 assert.equal(steps.at(-1).total,answerFor(p));assert.equal(submitCalculation(p,model,calc).solved,false);
 const correct=submitCalculation(p,model,{...calc,input:String(answerFor(p))});assert.equal(correct.solved,true);assert.equal(correct.assisted,true);
 assert.deepEqual(restoreHelp(p,initialActivity(),calc),{});
 assert.equal(restoreHelp(p,model,{assisted:true,helpStep:999,helpOpen:true}).helpStep,0); // prior sequential help restarts safely
 assert.equal(restoreHelp(p,model,{assisted:true,helpPlanVersion:HELP_PLAN_VERSION,helpStep:999,helpOpen:true}).helpStep,steps.length-1);
}
let seed=20261018;const rnd=n=>{seed=(seed*1664525+1013904223)>>>0;return seed%n;};
for(let i=0;i<200;i++){const nums=Array.from({length:4+rnd(7)},()=>1+rnd(9));verify(nums,makeTenPlan(nums));}
for(const bad of [[],[0],[10],[-1],[1.5],Array(17).fill(1)])assert.throws(()=>makeTenPlan(bad));
console.log(JSON.stringify({cards:plans,referenceScenarios:references.length,additionalScenarios:200,tenMakingActions:actions,wholePartnersFirst:true,splitConservation:true,noAutomaticCompletion:true,legacyHelpMigration:true,restoreValidated:true},null,2));
