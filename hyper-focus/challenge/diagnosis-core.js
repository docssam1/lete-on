(function(root){
 'use strict';
 const taxonomy=root.HFChallengeTaxonomy||(typeof require==='function'?require('./challenge-taxonomy.js'):null);
 const SEED=62001,CUTOFF=60,POINTS=5;
 const clone=x=>JSON.parse(JSON.stringify(x));
 function canonical(value){
  if(value===undefined)return 'null';
  if(value===null||typeof value!=='object')return JSON.stringify(value);
  return Array.isArray(value)?'['+value.map(canonical).join(',')+']':'{'+Object.keys(value).sort().map(k=>JSON.stringify(k)+':'+canonical(value[k])).join(',')+'}';
 }
 // Content-change detector, not a security hash or source-authenticity claim.
 function fingerprint(q){const source=q.sourceQuestion||q;let h=2166136261;const s=canonical({typeId:source.typeId,prompt:source.prompt,payload:source.payload,answer:source.answer,problemHtml:source.problemHtml});for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return 'v1-'+(h>>>0).toString(16).padStart(8,'0');}
 function checkRound(round){if(!Number.isInteger(round)||round<1||round>4)throw new Error('회차는 1부터 4까지의 정수여야 합니다.');}
 function sourceModules(){
  if(typeof module!=='undefined'&&module.exports&&!root.HFChallengeSupplement)require('./concept-catalog.js').build();
  if(!root.HFChallengeBank||!root.HFChallengeSupplement||!taxonomy)throw new Error('시험지와 유형 분류를 먼저 불러와 주세요.');
  return {bank:root.HFChallengeBank,extra:root.HFChallengeSupplement};
 }
 function describeRound(round){
  checkRound(round);if(root.HFChallengePublicCatalog?.rounds){const result=root.HFChallengePublicCatalog.rounds.find(r=>r.round===round);if(!result||result.questions.length!==20||result.extra.length!==6)throw Error('교재 분류 자료 확인 필요');return clone(result);}const {bank,extra}=sourceModules();
  function describe(q,section,index){
   const number=q.number||index+1,source=q.sourceQuestion||q;
   return {occurrenceId:`challenge-r${round}-${section}-${String(number).padStart(2,'0')}`,fingerprint:fingerprint(q),round,number,section,typeId:source.typeId,taxonomy:taxonomy.getTaxonomy(q,round,section),points:section==='main'?POINTS:0};
  }
  const questions=bank.createMockExam(round,SEED).questions.map((q,i)=>describe(q,'main',i));
  const additional=extra.get(round).questions.map((q,i)=>describe(q,'extra',i));
  if(questions.length!==20||additional.length!==6)throw new Error('회차 구성 확인 필요: 본문 20문항, 추가 6문항이어야 합니다.');
  if(new Set([...questions,...additional].map(q=>q.occurrenceId)).size!==26)throw new Error('시험지 문항 식별자가 중복됩니다.');
  return {round,seed:SEED,questionCount:20,extraCount:6,maxScore:100,cutoff:CUTOFF,questions,extra:additional};
 }
 function validateInputs(input){
  const errors=[];let exam;
  if(!input||typeof input!=='object'||Array.isArray(input))return {valid:false,errors:['진단 입력이 필요합니다.']};
  try{exam=describeRound(input.round);}catch(e){return {valid:false,errors:[e.message]};}
  if(!Array.isArray(input.responses))return {valid:false,errors:['responses는 명시적인 채점 상태 목록이어야 합니다.']};
  const known=new Map(exam.questions.map(q=>[q.occurrenceId,q])),seen=new Set();
  for(const response of input.responses){
   if(!response||typeof response!=='object'||Array.isArray(response)){errors.push('채점 항목 형식이 올바르지 않습니다.');continue;}
   const id=response.occurrenceId,q=known.get(id);
   if(!q)errors.push('이 회차 본문에 없는 문항입니다: '+String(id));
   if(seen.has(id))errors.push('중복 채점 문항입니다: '+String(id));seen.add(id);
   if(!['correct','wrong','pending'].includes(response.status))errors.push('채점 상태는 correct, wrong, pending 중 하나여야 합니다.');
   if(q&&response.fingerprint!==undefined&&response.fingerprint!==q.fingerprint)errors.push('문항이 수정되었습니다. 기존 채점을 다시 확인하세요: '+id);
  }
  if(input.student!==undefined&&(!input.student||typeof input.student!=='object'||Array.isArray(input.student)))errors.push('학생 정보 형식이 올바르지 않습니다.');
  return {valid:errors.length===0,errors};
 }
 function aggregate(rows,level){
  const map=new Map(),idKey=level==='areas'?'areaId':level==='subareas'?'subareaId':'typeId',labelKey=idKey.replace('Id','Label');
  rows.forEach(row=>{const t=row.taxonomy,id=t[idKey];if(!map.has(id))map.set(id,{id,label:t[labelKey],areaId:t.areaId,areaLabel:t.areaLabel,total:0,graded:0,correct:0,wrong:0,pending:0,questionIds:[],wrongQuestionIds:[]});const g=map.get(id);g.total++;g[row.status]++;if(row.status!=='pending')g.graded++;g.questionIds.push(row.occurrenceId);if(row.status==='wrong')g.wrongQuestionIds.push(row.occurrenceId);});
  return [...map.values()].map(g=>({...g,rate:g.graded?Math.round(g.correct/g.graded*100):null,status:g.pending?'pending':g.graded<4?'insufficient':g.correct/g.graded>=.75?'strength':g.correct/g.graded<.5?'review':'developing',evidenceLabel:g.pending?`${g.pending}문항 미채점`:g.graded<4?'문항 수가 적어 강약점 판단 보류':'이번 회차에서 관찰한 결과'}));
 }
 function analyze(input){
  const validation=validateInputs(input);if(!validation.valid){const error=new Error(validation.errors.join('\n'));error.code='INVALID_DIAGNOSIS_INPUT';error.errors=validation.errors;throw error;}
  const exam=describeRound(input.round),marks=new Map(input.responses.map(r=>[r.occurrenceId,r.status]));
  const rows=exam.questions.map(q=>({...q,status:marks.get(q.occurrenceId)||'pending'}));
  const correctCount=rows.filter(r=>r.status==='correct').length,wrongQuestions=rows.filter(r=>r.status==='wrong'),pendingCount=rows.filter(r=>r.status==='pending').length,complete=pendingCount===0,earnedPoints=correctCount*POINTS;
  const groups={areas:aggregate(rows,'areas'),subareas:aggregate(rows,'subareas'),types:aggregate(rows,'types')};
  const strongAreas=new Set(groups.areas.filter(g=>g.status==='strength').map(g=>g.id));
  const strengthMisses=wrongQuestions.filter(q=>strongAreas.has(q.taxonomy.areaId)).map(q=>({...q,reason:'같은 영역의 다른 문항은 잘 해결했습니다. 이 유형의 풀이를 다시 확인해 보세요. 실수인지 개념의 어려움인지는 풀이 확인이 필요합니다.'}));
  const recommendations=wrongQuestions.map(q=>({occurrenceId:q.occurrenceId,number:q.number,fingerprint:q.fingerprint,typeId:q.typeId,typeLabel:q.taxonomy.typeLabel,areaLabel:q.taxonomy.areaLabel,reason:strongAreas.has(q.taxonomy.areaId)?'잘 해결한 영역에서 놓친 유형':'이번 회차에서 틀린 유형',action:q.taxonomy.nextStep,potentialPoints:POINTS,priority:strongAreas.has(q.taxonomy.areaId)?0:1})).sort((a,b)=>a.priority-b.priority||a.number-b.number);
  const needed=complete?Math.max(0,Math.ceil((CUTOFF-earnedPoints)/POINTS)):null;
  const goalQuestions=needed===null?[]:recommendations.slice(0,needed);
  return {version:'challenge-diagnosis-v1',round:input.round,student:input.student?{name:String(input.student.name||'').trim().slice(0,30),kindergarten:String(input.student.kindergarten||'').trim().slice(0,60)}:null,cutoff:CUTOFF,maxScore:100,pointsPerQuestion:POINTS,complete,score:complete?earnedPoints:null,earnedPoints,possibleScoreRange:[earnedPoints,earnedPoints+pendingCount*POINTS],correctCount,wrongCount:wrongQuestions.length,pendingCount,gradedCount:20-pendingCount,cutoffStatus:complete?(earnedPoints>=CUTOFF?'reached':'below'):'pending',rows,groups,wrongQuestions,wrongTypeIds:[...new Set(wrongQuestions.map(q=>q.typeId))],practiceSelection:clone(wrongQuestions),strengthMisses,recommendations,scorePlan:{neededCorrectForCutoff:needed,questionIds:goalQuestions.map(q=>q.occurrenceId),potentialGain:goalQuestions.length*POINTS,projectedScore:complete?earnedPoints+goalQuestions.length*POINTS:null,statement:complete?(needed?`틀린 문항 중 ${needed}문항을 추가로 맞히면 이 시험 기준 ${CUTOFF}점입니다. 다음 시험의 점수를 보장하지는 않습니다.`:'이 시험에서는 60점 기준에 도달했습니다. 틀린 유형은 따로 확인하세요.'):'미채점 문항을 확인한 뒤 목표 점수를 계산합니다.'},limitations:['이번 회차의 채점 결과이며 장기적인 능력이나 실수의 원인을 단정하지 않습니다.','추가 연습 6문항은 점수와 강약점 집계에 포함하지 않습니다.']};
 }
 const api={version:'challenge-diagnosis-v1',getTaxonomy:taxonomy.getTaxonomy,describeRound,validateInputs,analyze,fingerprint};root.HFChallengeDiagnosis=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
