// A current presentation correction; prior wording and scoring stay restorable.
export const TERM_PARTICLE_VERSION='20261105-term-particles';
export const TERM_PARTICLE_UNITS=Object.freeze(['c22-s61-u01','c22-s62-u03']);
const particles={를:'을',는:'은',와:'과',가:'이'};
export function termParticleLanguage(text,unit){
 if(typeof text!=='string')return text;
 if(unit==='c22-s61-u01')return text.replace(/용액(를|는|와|가)(?=[\s.,·?!(<]|$)/g,(_,particle)=>'용액'+particles[particle]);
 if(unit==='c22-s62-u03')return text.replace(/전기 회로을(?=[\s.,·?!(<]|$)/g,'전기 회로를');
 return text;
}
function wording(value,unit){
 if(typeof value==='string')return termParticleLanguage(value,unit);
 if(Array.isArray(value))return value.map(v=>wording(v,unit));
 if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,wording(v,unit)]));
 return value;
}
function presentation(question,unit,book=false){
 const fields=unit==='c22-s62-u03'?['misconception']:book?['topic','prompt','choices','given','parts']:['prompt','choices','givens'];
 let next=question;
 for(const key of fields){
  if(!Object.hasOwn(question,key))continue;
  const text=wording(question[key],unit);
  if(JSON.stringify(text)!==JSON.stringify(question[key])){if(next===question)next={...question};next[key]=text;}
 }
 return next;
}
const clone=value=>JSON.parse(JSON.stringify(value));
export function termParticleCurrentItems(rows,unit){
 if(unit!=='c22-s61-u01'||!Array.isArray(rows))return rows;
 let changed=false;
 const items=rows.map(question=>{
  if(!/^c22-s61-u01-b\d+$/.test(question.id)||question.workbookRef?.unit!==unit||question.status!=='authored'||['original','similar'].includes(question.sourceRef?.type)||question.contentVersion!=='20261105-acid-student-language')return question;
  const next=presentation(question,unit);if(next===question)return question;changed=true;
  const override=question.diagnosticOverride?.version===question.contentVersion?{diagnosticOverride:{...clone(question.diagnosticOverride),version:TERM_PARTICLE_VERSION}}:{};
  return {...next,...override,contentVersion:TERM_PARTICLE_VERSION,previousVersions:[...(question.previousVersions?clone(question.previousVersions):[]),{...clone(question),version:question.contentVersion}]};
 });
 return changed?items:rows;
}
export function withTermParticleLanguage(workbook){
 if(!TERM_PARTICLE_UNITS.includes(workbook.unit))return workbook;
 const unit=workbook.unit,questions=workbook.questions.map(q=>presentation(q,unit,true));
 if(unit==='c22-s62-u03')return {...workbook,questions};
 const pages=rows=>rows.map(page=>({...page,title:wording(page.title,unit),section:wording(page.section,unit),blocks:wording(page.blocks,unit),rail:wording(page.rail,unit)}));
 return {...workbook,questions,pages:pages(workbook.pages),teacherStudentPages:pages(workbook.teacherStudentPages),figures:Object.fromEntries(Object.entries(workbook.figures).map(([key,html])=>[key,html.replace(/>([^<]*)</g,(_,text)=>'>'+termParticleLanguage(text,unit)+'<')]))};
}

export const GUIDANCE_PARTICLE_VERSION='20261105-guidance-particles';
export const GUIDANCE_PARTICLE_UNITS=Object.freeze(['c22-s62-u04','c22-s62-u03','c22-s62-u01','c22-s61-u03']);
const guidanceParticles={'것와':'것과','까닭와':'까닭과','방향를':'방향을','분를':'분을','겨울를':'겨울을','닿음를':'닿음을','설명를':'설명을'};
export function guidanceParticleLanguage(value,unit){
 if(!GUIDANCE_PARTICLE_UNITS.includes(unit))return value;
 if(typeof value==='string')return value.replace(/(것와|까닭와|방향를|분를|겨울를|닿음를|설명를)(?=[\s.,·?!(<]|$)/g,match=>guidanceParticles[match]);
 if(Array.isArray(value))return value.map(v=>guidanceParticleLanguage(v,unit));
 if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([k,v])=>[k,guidanceParticleLanguage(v,unit)]));
 return value;
}
export function withGuidanceParticles(workbook){
 const unit=workbook.unit;if(!GUIDANCE_PARTICLE_UNITS.includes(unit))return workbook;
 const questions=workbook.questions.map(question=>{
  let next=question;
  for(const key of (unit==='c22-s62-u04'?['criteria','requirements','responseContract']:['criteria','requirements'])){
   if(!Object.hasOwn(question,key))continue;
   const text=guidanceParticleLanguage(question[key],unit);
   if(JSON.stringify(text)!==JSON.stringify(question[key])){if(next===question)next={...question};next[key]=text;}
  }
  return next;
 });
 if(unit!=='c22-s62-u03')return {...workbook,questions};
 const pages=rows=>rows.map(page=>Object.hasOwn(page,'blocks')?{...page,blocks:guidanceParticleLanguage(page.blocks,unit)}:page);
 return {...workbook,questions,pages:pages(workbook.pages),teacherStudentPages:pages(workbook.teacherStudentPages)};
}
// This drawing rubric keeps the same teacher-review requirements. A new full
// snapshot retains the earlier wording for already-saved responses.
export function guidanceParticleCurrentItems(rows,unit){
 if(unit!=='c22-s62-u04'||!Array.isArray(rows))return rows;
 let changed=false;
 const items=rows.map(question=>{
  if(question.id!=='c22-s62-u04-b096'||question.status!=='authored'||question.sourceRef?.type!=='authored-supplement'||question.contentVersion!=='20261104-student-science-language')return question;
  const responseContract=guidanceParticleLanguage(question.responseContract,unit),answerContract=guidanceParticleLanguage(question.answerContract,unit);
  if(JSON.stringify(responseContract)===JSON.stringify(question.responseContract)&&JSON.stringify(answerContract)===JSON.stringify(question.answerContract))return question;
  changed=true;
  const override=question.diagnosticOverride?.version===question.contentVersion?{diagnosticOverride:{...clone(question.diagnosticOverride),version:GUIDANCE_PARTICLE_VERSION}}:{};
  return {...question,...override,responseContract,answerContract,contentVersion:GUIDANCE_PARTICLE_VERSION,previousVersions:[...(question.previousVersions?clone(question.previousVersions):[]),{...clone(question),version:question.contentVersion}]};
 });
 return changed?items:rows;
}
