// Exact wording reviews preserve contracts. A separately versioned weather answer revision follows this layer.
export const STUDENT_LANGUAGE_VERSION='20261117-student-language-review';
export function languageFingerprint(value){let a=2166136261,b=3335557771;for(const c of JSON.stringify(value)){const n=c.charCodeAt(0);a=Math.imul(a^n,16777619);b=Math.imul(b^n,2246822519);}return(a>>>0).toString(16).padStart(8,'0')+(b>>>0).toString(16).padStart(8,'0');}
const clone=x=>JSON.parse(JSON.stringify(x)),modules=new Map(),revised=new WeakMap();
const units=new Set(['s31-u01','s31-u02','s31-u03','s31-u04','c22-s32-u01','c22-s32-u02','c22-s32-u03','c22-s32-u04','s41-u01','s41-u02','s41-u03','s41-u04','c22-s42-u01','c22-s42-u02','c22-s42-u03','c22-s42-u04','c22-s51-u01','c22-s51-u02','c22-s51-u03','c22-s51-u04','c22-s52-u01','c22-s52-u02','c22-s52-u03','c22-s52-u04','c22-s61-u01','c22-s61-u02','c22-s61-u03','c22-s61-u04','c22-s62-u01','c22-s62-u02','c22-s62-u03','c22-s62-u04','s31-mid','s31-fin','c22-s32-mid','c22-s32-fin','c22-s41-mid','c22-s41-fin','c22-s42-mid','c22-s42-fin','c22-s51-mid','c22-s51-fin','s41-mid','s32-mid','s32-fin']);
async function reviewOf(unit){if(!units.has(unit))return null;if(!modules.has(unit))modules.set(unit,import(`../data/language/${unit}.js?v=${STUDENT_LANGUAGE_VERSION}`).then(m=>m.review));return modules.get(unit);}
const protectedKeys=new Set(['sourceRef','evidence','previousVersions','taxonomy','answer','accepted','vocabulary','answerContract','responseContract','diagnosticOverride','figures','art','verificationModel','sources','standards']);
export function reviewTextTree(value,text){
 if(typeof value==='string')return Object.hasOwn(text,value)?text[value]:value;
 if(Array.isArray(value)){const out=value.map(v=>reviewTextTree(v,text));return out.every((v,i)=>v===value[i])?value:out;}
 if(!value||typeof value!=='object')return value;
 const pairs=Object.entries(value).map(([k,v])=>[k,protectedKeys.has(k)&&!(k==='answer'&&value.type==='example')?v:reviewTextTree(v,text)]);return pairs.every(([k,v])=>v===value[k])?value:Object.fromEntries(pairs);
}
export function reviewQuestionRows(rows,review){
 if(!rows?.length||!review)return rows;let changed=false;
 const next=rows.map(q=>{
  if(q.status!=='authored')return q;const key=q.id+':'+languageFingerprint(q);if(!Object.hasOwn(review.questions,key))return q;
  changed=true;if(revised.has(q))return revised.get(q);const oldVersion=q.contentVersion||1,changes=review.questions[key],fields={};
  for(const k of ['prompt','givens','choices','explanation'])if(q[k]!=null)fields[k]=reviewTextTree(q[k],changes);
  if(Object.entries(fields).every(([k,v])=>v===q[k]))return q;
  const diagnostic=q.diagnosticOverride?.version===oldVersion?{diagnosticOverride:{...q.diagnosticOverride,version:STUDENT_LANGUAGE_VERSION}}:{};
  const result={...q,...fields,...diagnostic,contentVersion:STUDENT_LANGUAGE_VERSION,previousVersions:[...clone(q.previousVersions||[]),{...clone(q),version:oldVersion,snapshotKind:'full-question'}]};revised.set(q,result);return result;
 });return changed?next:rows;
}
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function reviewPaperText(html,review){if(!review)return html;const map=Object.fromEntries(Object.entries(review.text).map(([a,b])=>[escape(a),escape(b)]));return html.replace(/<[^>]*>|[^<]+/g,part=>{if(part.startsWith('<'))return part;const trimmed=part.trim();return Object.hasOwn(map,trimmed)?part.replace(trimmed,map[trimmed]):part;});}
export async function reviewStudentModule(unit,mod){
 const review=await reviewOf(unit);if(!review)return mod;
 const result={...mod};for(const k of ['items','source','similar'])if(mod[k])result[k]=reviewQuestionRows(mod[k],review);
 if(mod.bankPaper)result.bankPaper=args=>reviewPaperText(mod.bankPaper(args),args.mode==='student'?{...review,text:{...review.text,...review.studentHeaders}}:review);
 if(unit==='c22-s52-u03'){const{weatherExampleItems}=await import('./weather-example-response.js?v=20261123-weather-example-response');result.items=weatherExampleItems(result.items,unit);}
 return result;
}
export async function reviewStudentWorkbook(unit,workbook){const review=await reviewOf(unit);const result=review?reviewTextTree(workbook,review.text):workbook;return unit==='c22-s52-u03'?(await import('./weather-example-response.js?v=20261123-weather-example-response')).withWeatherExampleWorkbook(result):result;}
export async function reviewClassroomLanguage(unit,mod){const review=await reviewOf(unit);if(!review||!mod.classroomItems)return mod;const items=reviewQuestionRows(mod.classroomItems,review);return items===mod.classroomItems?mod:{...mod,classroomItems:items};}
