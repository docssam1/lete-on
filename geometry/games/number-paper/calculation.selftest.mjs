import assert from 'node:assert/strict';
import {bank,answerFor} from './core.js';
import {initialActivity,advance,piecesFor,cutKeysFor} from './activity-model.js';
import {initialCalculation,restoreCalculation,submitCalculation,completedActivity,phaseFor,difficultyFor} from './calculation.js';
import {readProfile,saveGameProgress} from '../../shared/profile-storage.js';
let checks=0;
for(const p of bank){
 let model=initialActivity(),calc=initialCalculation();
 const sum=piecesFor(p).reduce((n,piece)=>n+piece.sum,0);assert.equal(sum,answerFor(p));
 assert.equal(completedActivity('challenge',model,{input:String(sum),solved:true}),false);
 assert.deepEqual(submitCalculation(p,model,{input:String(sum),solved:false}),{input:String(sum),solved:false});
 model=advance(p,model,'fold');model=advance(p,model,'fold');for(const key of cutKeysFor(p))model=advance(p,model,'cut',key);model=advance(p,model,'fold');model=advance(p,model,'fold');
 const pieces=piecesFor(p);
 for(let i=0;i<pieces.length;i++){
  assert.equal(phaseFor('challenge',model,calc),'collect');assert.equal(completedActivity('challenge',model,calc),false);model=advance(p,model,'collect',pieces[i].id);
 }
 assert.equal(model.phase,'done');assert.equal(phaseFor('play',model,calc),'done');assert.equal(phaseFor('challenge',model,calc),'calculate');
 for(const input of ['',String(sum+1),'-1','1.5','1e2','abc']){
  const attempt=submitCalculation(p,model,{input,solved:false});assert.equal(attempt.solved,false);assert.equal(attempt.input,input);assert.equal(completedActivity('challenge',model,attempt),false);checks++;
 }
 calc=submitCalculation(p,model,{input:String(sum),solved:false});assert.equal(calc.solved,true);assert.equal(phaseFor('challenge',model,calc),'done');assert.equal(completedActivity('challenge',model,calc),true);
 assert.deepEqual(restoreCalculation(p,model,calc),calc);
 assert.equal(restoreCalculation(p,initialActivity(),calc).solved,false);
 assert.equal(restoreCalculation(p,model,{input:String(sum+1),solved:true}).solved,false);
 assert.deepEqual(restoreCalculation(p,model,{input:'9',solved:false}),{input:'9',solved:false});
}
assert.equal(difficultyFor('invalid'),'play');assert.equal(difficultyFor('challenge'),'challenge');
const previous=globalThis.localStorage;let data=JSON.stringify({progress:{unrelated:{keep:1},'number-paper':{phase:'sum',paperPlay:{version:3,index:2,model:{phase:'collect'}}}}});
try{globalThis.localStorage={getItem:()=>data,setItem:(_,v)=>{data=v;}};const before=readProfile();saveGameProgress('number-paper',{paperPlayDifficulty:'challenge',paperPlayChallenge:{version:3,index:0,calculation:{input:'9',solved:false}}});const after=readProfile();assert.deepEqual(after.progress.unrelated,before.progress.unrelated);assert.deepEqual(after.progress['number-paper'].paperPlay,before.progress['number-paper'].paperPlay);assert.equal(after.progress['number-paper'].phase,'sum');}finally{if(previous===undefined)delete globalThis.localStorage;else globalThis.localStorage=previous;}
console.log(JSON.stringify({cards:40,wrongInputsRejected:checks,collectBeforeCalculate:true,correctAnswerRequired:true,restoreValidated:true,basicAndOtherProgressPreserved:true},null,2));
