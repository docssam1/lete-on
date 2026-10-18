// Intake vocabulary only. Class labels never imply a course, result or promotion.
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const ACADEMY_UNKNOWN='모름';
const timingLabels={current:'현재',past:'이전',unknown:'모름'};
// Old default status=unknown is not evidence that a parent selected “모름”.
export function academyTiming(record={}){
 return ['current','past'].includes(record.status)||record.status==='unknown'&&record.timingReported===true?record.status:'';
}
export const academyTimingLabel=record=>timingLabels[academyTiming(record)]||'';
export function academyTimingPatch(value,touched=false){
 if(!touched)return {};
 if(!Object.hasOwn(timingLabels,value))throw Error('다닌 시점은 목록에서 선택해 주세요.');
 return {status:value,timingReported:true};
}
export function academyTimingMarkup(value='',{name='academy:timing',compact=false,refresh='data-scene-refresh'}={}){
 return `<label class="${compact?'compact-field':'field'} academy-timing-field"><span${compact?' class="sr-only"':''}>다닌 시점</span><select name="${esc(name)}" aria-label="다닌 시점" ${refresh}><option value="" ${value?'disabled':'selected'}>다닌 시점</option>${[['current','현재 다녀요'],['past','전에 다녔어요'],['unknown','모름']].map(([v,t])=>`<option value="${v}" ${value===v?'selected':''}>${t}</option>`).join('')}</select></label>`;
}
export function academyLevelOptions(institution,value=''){
 const approved=institution==='필즈'?['S1','S2','S3','E1','E2','G','H']:institution==='소마'?['프리미어1','프리미어2','챌린지','A1','A2']:institution==='CMS'?Array.from({length:15},(_,i)=>`WHY ${i+1}`):[];
 const proposed=[];
 const options=[['',institution==='CMS'?'WHY 단계 선택':'반·레벨 선택'],...approved.map(v=>[v,['G','H'].includes(v)?`${v} (주 1회)`:v]),[ACADEMY_UNKNOWN,'모름']];
 if(value&&!options.some(([v])=>v===value))options.push([value,`기존 입력 · ${value}`]);
 return {ask:['소마','필즈','CMS'].includes(institution),options,proposed,confirmation:institution==='시매쓰'?'반·레벨 질문 생략은 기획안·원장님 확인 대기입니다.':''};
}
export function academyLevelAllowed(institution,value,previous=''){
 if(!['소마','필즈','CMS'].includes(institution))return value===previous;
 return academyLevelOptions(institution,previous).options.some(([v])=>v===value);
}
export function academyLevelMarkup(institution,value='',{name='academy:level',compact=false,refresh='data-scene-refresh'}={}){
 const model=academyLevelOptions(institution,value),field=compact?'compact-field':'field';
 const control=model.ask?`<label class="${field}"><span${compact?' class="sr-only"':''}>학원 반·레벨</span><select name="${esc(name)}" aria-label="학원 반·레벨" ${refresh}>${model.options.map(([v,t])=>`<option value="${esc(v)}" ${value===v?'selected':''}>${esc(t)}</option>`).join('')}</select></label>`:value?`<p class="note" data-preserved-academy-level>기존 반·레벨 · ${esc(value)} (보존)</p>`:'';
 return control+(model.confirmation?`<p class="note" data-academy-confirmation="pending">${esc(model.confirmation)}</p>`:'');
}
