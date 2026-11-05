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
