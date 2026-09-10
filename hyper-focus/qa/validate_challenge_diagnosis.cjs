const assert=require('node:assert/strict');
const api=require('../challenge/diagnosis-core.js');
let checks=0;function ok(value,msg){assert.ok(value,msg);checks++;}
function responses(round,count){return api.describeRound(round).questions.map((q,i)=>({occurrenceId:q.occurrenceId,fingerprint:q.fingerprint,status:i<count?'correct':'wrong'}));}
for(let round=1;round<=4;round++){
 const exam=api.describeRound(round),before=JSON.stringify(globalThis.HFChallengeBank.createMockExam(round,62001));
 ok(exam.questions.length===20&&exam.extra.length===6,'all 26 occurrences');
 for(const q of [...exam.questions,...exam.extra])ok(q.taxonomy.areaId&&q.taxonomy.subareaId&&q.taxonomy.typeLabel,'all levels mapped');
 ok(new Set([...exam.questions,...exam.extra].map(q=>q.occurrenceId)).size===26,'unique occurrences');
 for(const count of [0,11,12,13,20]){
  const result=api.analyze({round,responses:responses(round,count)});
  ok(result.score===count*5,'fixed five-point score');
  ok(result.cutoffStatus===(count>=12?'reached':'below'),'cutoff 55/60/65');
  ok(result.wrongQuestions.length===20-count&&result.practiceSelection.length===20-count,'wrong-only practice');
  ok(result.practiceSelection.every(q=>q.status==='wrong'),'never correct as wrong');
  ok(result.groups.areas.reduce((s,g)=>s+g.total,0)===20,'domain total');
  ok(result.groups.subareas.reduce((s,g)=>s+g.correct,0)===count,'subarea counts');
  ok(result.groups.types.reduce((s,g)=>s+g.wrong,0)===20-count,'type counts');
  ok(result.scorePlan.projectedScore===Math.max(count*5,60),'possible gain arithmetic');
 }
 const pending=api.analyze({round,responses:[]});
 ok(pending.score===null&&pending.wrongCount===0&&pending.pendingCount===20,'unset not zero or wrong');
 ok(pending.practiceSelection.length===0&&pending.recommendations.length===0,'unset no prescription');
 ok(pending.groups.areas.every(g=>g.rate===null&&g.status==='pending'),'unset no strengths');
 const incomplete=api.analyze({round,responses:responses(round,20).slice(0,12)});
 ok(incomplete.score===null&&incomplete.earnedPoints===60&&incomplete.possibleScoreRange[1]===100&&incomplete.cutoffStatus==='pending','partial 60 not final');
 const withPending=responses(round,20);withPending[0].status='pending';
 ok(api.analyze({round,responses:withPending}).wrongCount===0,'explicit pending not wrong');
 ok(!api.validateInputs({round,responses:[responses(round,20)[0],responses(round,20)[0]]}).valid,'duplicates rejected');
 ok(!api.validateInputs({round,responses:[{...responses(round,20)[0],fingerprint:'old'}]}).valid,'stale fingerprint rejected');
 ok(!api.validateInputs({round,responses:[{...responses(round,20)[0],status:'o'}]}).valid,'unknown marks rejected');
 ok(!api.validateInputs({round,responses:[{...exam.extra[0],status:'wrong'}]}).valid,'extras excluded explicitly');
 const correct=api.analyze({round,responses:responses(round,20)}),large=correct.groups.areas.find(g=>g.total>=4);
 if(large){const marks=responses(round,20),id=large.questionIds[0];marks.find(m=>m.occurrenceId===id).status='wrong';const one=api.analyze({round,responses:marks});ok(one.strengthMisses.some(q=>q.occurrenceId===id),'strong area single miss linked');ok(one.strengthMisses[0].reason.includes('확인이 필요'),'no careless mistake inference');}
 ok(correct.groups.types.filter(g=>g.total<4).every(g=>g.status==='insufficient'),'small samples not ability claims');
 ok(before===JSON.stringify(globalThis.HFChallengeBank.createMockExam(round,62001)),'source state immutable');
 const copied=api.describeRound(round);copied.questions[0].taxonomy.typeLabel='mutated';ok(api.describeRound(round).questions[0].taxonomy.typeLabel!=='mutated','isolated metadata');
}
for(const round of [0,5,'1',null,NaN])ok(!api.validateInputs({round,responses:[]}).valid,'invalid round');
ok(!api.validateInputs(null).valid,'null input');
ok(!api.validateInputs({round:1,responses:{}}).valid,'not an array');
assert.throws(()=>api.analyze({round:1,responses:[{occurrenceId:'bad',status:'wrong'}]}),/없는 문항/);checks++;
ok(api.fingerprint({prompt:'a',payload:{x:1,y:2}})===api.fingerprint({payload:{y:2,x:1},prompt:'a'}),'canonical fingerprint');
ok(api.fingerprint({prompt:'a'})!==api.fingerprint({prompt:'b'}),'changed prompt changes fingerprint');
console.log(JSON.stringify({status:'passed',checks,rounds:4,mainOccurrences:80,extraOccurrences:24,cutoff:60,pointsPerQuestion:5,pendingIsWrong:false}));
