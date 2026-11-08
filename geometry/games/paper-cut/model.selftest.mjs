import assert from 'node:assert/strict';
import {bank,anchors,candidate,piecesAfter,tally,solutions,area,equalCounts} from './model.js';
assert.deepEqual(Object.values(bank).map(items=>items.length),[12,12]);
assert.deepEqual(tally(piecesAfter([[{x:.5,y:0},{x:.5,y:1}]])),{4:2});
assert.deepEqual(tally(piecesAfter([[{x:1,y:0},{x:.25,y:1}]])),{3:1,4:1});
assert.deepEqual(tally(piecesAfter([[{x:.5,y:0},{x:1,y:.5}]])),{3:1,5:1});
assert.deepEqual(tally(piecesAfter([[{x:0,y:1},{x:1,y:0}],[{x:0,y:0},{x:1,y:1}]])),{3:4});
assert.deepEqual(tally(piecesAfter([[{x:.5,y:0},{x:.5,y:1}],[{x:0,y:1},{x:.5,y:0}]])),{3:2,4:1});
assert.deepEqual(tally(piecesAfter([[{x:.75,y:0},{x:.75,y:1}],[{x:0,y:.5},{x:1,y:.5}]])),{4:4});
assert.deepEqual(tally(piecesAfter([[{x:0,y:.5},{x:1,y:.5}],[{x:0,y:0},{x:1,y:.25}]])),{3:1,4:2});
let cuts=0,accepted=0;
for(const task of [...bank.count,...bank.make]){
 const before=piecesAfter(task.cuts);assert.ok(Math.abs(before.reduce((sum,p)=>sum+area(p),0)-1)<1e-5);
 for(let i=0;i<anchors.length;i++)for(let j=i+1;j<anchors.length;j++){
  const result=candidate(task,anchors[i],anchors[j]);
  assert.ok(Math.abs(result.pieces.reduce((sum,p)=>sum+area(p),0)-1)<1e-5,`${task.id} lost area`);
  assert.ok(result.pieces.every(p=>p.length>=3&&p.every(v=>v.x>=0&&v.x<=1&&v.y>=0&&v.y<=1)));
  const counts=tally(result.pieces);assert.equal(result.correct,result.changed&&equalCounts(counts,task.target||{}));
  accepted+=Number(result.correct);cuts++;
 }
 if(task.target)assert.ok(solutions(task).length>0,`${task.id} has no valid cut`);
}
const multi=bank.make.find(t=>solutions(t).length>1);const answers=solutions(multi);assert.ok(candidate(multi,...answers[0]).correct&&candidate(multi,...answers.at(-1)).correct,'Do not lock to an example cut');
assert.equal(candidate(multi,anchors[0],anchors[0]).correct,false);
console.log(JSON.stringify({questions:24,cutChecks:cuts,acceptedCuts:accepted,areaConservation:true,multipleSolutionsAccepted:true,teacherApproved:false}));
