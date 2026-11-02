import '../../../highschool-selection/shared/grading.js';
const grading=globalThis.HIGHSELECT_GRADING;
export function publicExam(exam){return {id:exam.id,title:exam.title,programId:exam.programId,scope:exam.scope,mode:exam.mode,version:exam.version,questionCount:exam.questions.length,pageCount:exam.pages.length,answerPageCount:exam.answerPages?.length||0,durationMinutes:exam.durationMinutes,responseMode:'self-check'};}
export function publicQuestions(exam){return exam.questions.map(q=>({number:q.number,responseType:q.responseType,...(q.fields?{fields:q.fields}:{})}));}
export function normalizeInput(raw){return String(raw??'').normalize('NFKC').replace(/\\pi\b|\bpi\b/g,'π').replace(/[−–]/g,'-').replace(/\u200b/g,'').trim();}
function decimalFraction(value){return value.replace(/^(-?\d+)\.(\d{1,6})$/,(_,a,b)=>String(Number(a)*10**b.length+(a.startsWith('-')?-1:1)*Number(b))+'/'+10**b.length);}
export function evaluateResponse(value,question){
 const spec=structuredClone(question.spec);
 const clean=x=>{let s=normalizeInput(x);if(spec.ratio)s=s.replace(':','/');if(spec.algebra)s=s.replace(/[{}*]/g,'');return decimalFraction(s);};
 let input=Array.isArray(value)?value.map(clean):clean(value);
 if(question.responseType==='multi_input'){
  if(!Array.isArray(value)||value.length!==question.fields.length)throw new Error('response_invalid');
  input={slots:question.fields.map((f,i)=>({slotId:f.slotId,groupId:f.groupId,value:input[i]}))};
 }
 spec.answers=spec.answers?.map(clean);
 if(spec.slots)spec.slots=spec.slots.map(s=>({...s,answer:clean(s.answer)}));
 if(spec.variants)spec.variants=spec.variants.map(slots=>slots.map(s=>({...s,answer:clean(s.answer)})));
 if(question.responseType==='input' && spec.answers?.some(a=>grading.normalize(input,spec.normalize)===grading.normalize(a,spec.normalize)))return 'correct';
 const result=grading.evaluate(input,spec);
 return result.state==='wrong' && spec.manualFallback ? 'review' : result.state;
}
export function makeReport(exam,responses){
 if(!Array.isArray(responses)||responses.length!==exam.questions.length)throw new Error('response_invalid');
 const rows=exam.questions.map((q,i)=>{
  const value=responses[i];
  if(typeof value!=='string' && !Array.isArray(value))throw new Error('response_invalid');
  if((Array.isArray(value)?value:[value]).some(x=>typeof x!=='string'||x.length>240))throw new Error('response_invalid');
  return {number:q.number,state:evaluateResponse(value,q),...q.classification};
 });
 return summarize(exam,rows);
}
export function makeSelfReport(exam,marks){
 if(!Array.isArray(marks)||marks.length!==exam.questions.length||marks.some(x=>!['O','X',''].includes(x)))throw Error('response_invalid');
 const rows=exam.questions.map((q,i)=>({number:q.number,state:marks[i]==='O'?'correct':marks[i]==='X'?'wrong':'blank',...q.classification}));
 return {...summarize(exam,rows),gradingMethod:'self-reported',final:false};
}
function summarize(exam,rows){
 const correct=rows.filter(x=>x.state==='correct').length,wrong=rows.filter(x=>x.state==='wrong').length,blank=rows.filter(x=>x.state==='blank').length,review=rows.filter(x=>x.state==='review').length;
 const groups=new Map();
 for(const row of rows){const label=row.domain||'통합';const g=groups.get(label)||{label,correct:0,wrong:0,blank:0,review:0,total:0};g[row.state]++;g.total++;groups.set(label,g);}
 return {exam:publicExam(exam),correctCount:correct,wrongCount:wrong,blankCount:blank,reviewCount:review,score:correct,total:rows.length,final:review===0,cutlineDecision:null,domains:[...groups.values()],items:rows};
}
export function validGrant(student,examId,now=Date.now()){return Boolean(student?.active&&Date.parse(student.expires_at)>now&&Array.isArray(student.exam_grants)&&student.exam_grants.includes(examId));}
export function fixedEqual(a,b){if(typeof a!=='string'||typeof b!=='string'||a.length!==b.length)return false;let n=0;for(let i=0;i<a.length;i++)n|=a.charCodeAt(i)^b.charCodeAt(i);return n===0;}

export function applyReview(report,number,decision){
 if(!['correct','wrong'].includes(decision)||!Number.isSafeInteger(number))throw Error('review_invalid');
 const row=report.items.find(x=>x.number===number);if(!row||row.state!=='review')throw Error('review_invalid');
 const rows=report.items.map(x=>x.number===number?{...x,state:decision}:x);
 return summarize({...report.exam,questions:rows,pages:new Array(report.exam.pageCount)},rows);
}
