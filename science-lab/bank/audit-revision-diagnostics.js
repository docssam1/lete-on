import {needsSourceTeacherReview} from '../v2/source-content.js';
// 현재 문항의 진단은 원래 문항의 보기·답이 아닌 해당 버전의 계약과 대조한다.
export function auditRevisionDiagnostics(rows,byId,misconceptions){
 const errors=[],used=new Map();
 const use=(code,id)=>{if(!Object.hasOwn(misconceptions,code))errors.push(`${id}: 없는 버전 오개념 ${code}`);else used.set(code,(used.get(code)||0)+1);};
 for(const q of rows||[]){
  if(!byId.has(q.id)){errors.push(`${q.id}: 없는 버전 문항`);continue;}
  const d=q.diagnosticOverride,ac=q.answerContract||{};
  if(!q.contentVersion||d?.version!==q.contentVersion){errors.push(`${q.id}: 문항과 진단의 버전 불일치`);continue;}
  if(ac.type==='short-text'){
   if(!d.typed?.any&&!(d.typed?.pats||[]).length)errors.push(`${q.id}: 버전 단답 진단 없음`);
   if(d.typed?.any)use(d.typed.any,q.id);
   for(const[,code]of d.typed?.pats||[])use(code,q.id);
  }else if(ac.type==='single-choice'||ac.type==='multi-choice'){
   const right=new Set(ac.type==='single-choice'?[ac.answer]:ac.answers),n=q.choices?.length||0;
   if(!d.distractors||!Object.keys(d.distractors).length)errors.push(`${q.id}: 버전 선택형 진단 없음`);
   for(const[i,code]of Object.entries(d.distractors||{})){const k=Number(i);if(!Number.isInteger(k)||k<0||k>=n)errors.push(`${q.id}: 버전 보기 번호 범위 밖 ${i}`);if(right.has(k))errors.push(`${q.id}: 버전 정답 보기를 오답으로 적음 ${k}`);use(code,q.id);}
  }
 }
 return{errors,used};
}

// A closed-form original can deliberately require a teacher's judgment. Check
// the actual contract and suppression of automatic rules; original status alone
// never exempts a question from diagnostic coverage.
export function auditSourceReviewDiagnostics(q,misc){
 const ac=q.answerContract||{};
 if(q.sourceRef?.type!=='original'||!['single-choice','multi-choice','short-text'].includes(ac.type))return null;
 const contracts=['sourceResponseContract','earthMotionContract','seasonContract'].filter(key=>ac[key]).map(key=>({key,contract:ac[key]}));
 if(ac.reviewRequired!==true&&!contracts.some(({contract:c})=>c.teacherRequired===true||['written-explanation','teacher-review'].includes(c.kind)))return null;
 const errors=[],entry=contracts[0],c=entry?.contract;
 let valid=contracts.length===1&&needsSourceTeacherReview(q)&&c.teacherRequired===true;
 if(entry?.key==='sourceResponseContract')valid&&=c.kind==='written-explanation'&&c.exactStringScoring===false&&Array.isArray(c.required)&&c.required.length>0&&c.required.every(x=>typeof x==='string'&&x.trim());
 else valid&&=c?.kind==='teacher-review'&&typeof(c.reason??c.heldReason)==='string'&&(c.reason??c.heldReason).trim().length>0&&c.exactStringScoring!==true;
 if(!valid)errors.push(`${q.id}: 교사 확인 원문의 검토 계약이 불완전함`);
 for(const key of['distractors','typed','cloze','cells'])if(misc?.[key]?.[q.id]!=null)errors.push(`${q.id}: 교사 확인 원문에 자동 진단 ${key}가 있음`);
 return{errors};
}
