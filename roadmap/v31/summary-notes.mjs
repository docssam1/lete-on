import {esc} from './intake.mjs';
const purposeNames={science:'과학',gifted:'영재원',competition:'대회',highSchool:'학교·진로',other:'타 과목'};
const schoolNames={gifted_school:'영재고',science_school:'과학고',autonomous:'자사고',general:'일반고',undecided:'미정'};
export function createAutomaticSummary(s,purpose,fields){
 const f=fields,g=s.goals||{},context={};let parts=[];
 if(purpose==='science'){context.goal=f.summaryGoal??g.sciencePurpose??'';parts=[f.bookName||f.title,f.scope,context.goal];}
 if(purpose==='gifted'){context.region=f.summaryRegion??s.profile?.region??'';parts=[f.institution||f.title,f.program,f.recruitmentYear,context.region];}
 if(purpose==='competition')parts=[f.title,({wish:'응시 희망',none:'자료 학습·미응시',hold:'응시 보류',undecided:'방향 미정'})[f.intent]||'방향 미정'];
 if(purpose==='highSchool'){context.schoolTypes=structuredClone(g.schoolTypes||f.autoSummary?.context?.schoolTypes||[]);context.medical=g.medical??f.autoSummary?.context?.medical??false;parts=[...context.schoolTypes.map(x=>schoolNames[x]||x),f.institution||f.title,f.schoolAdmissionYear?`학교 목표 ${f.schoolAdmissionYear}학년도`:'',context.medical?'의학계열 희망':''];}
 if(purpose==='other')parts=[f.bookName||f.title,f.volume,f.scope];
 if(purpose==='academy')parts=[f.title||f.bookName,f.startValue||f.plan?.start?.value,f.endValue||f.plan?.end?.value||'종료 월 미확인',`${f.source?.appliesYear||2026} ${f.source?.targetClass||'7세 E1반'} 사용자 제공 사례`];
 if(purpose==='generic')parts=[...new Set([f.title,f.bookName,f.volume,f.scope,f.institution,f.program,f.recruitmentYear].filter(Boolean))];
 return {version:1,purpose,sourceRole:'generated_from_current_fields',text:parts.filter(Boolean).join(' / '),context};
}
export function prepareNoteEditor(item,s){
 const f=structuredClone(item);
 if(!Object.hasOwn(item,'userNote')&&item.note){f.legacyNote=item.note;f.note='';f.legacyNoteRole='unclassified';}
 else if(Object.hasOwn(item,'userNote'))f.note=item.userNote;
 if(!f.autoSummary&&f.legacyNote){const purpose=({gifted:'gifted',competition:'competition',science:'science'})[item.axis]||'generic';f.autoSummary=createAutomaticSummary(s||{},purpose,f);}
 if(f.autoSummary?.purpose==='gifted')f.summaryRegion=s?.profile?.region??f.autoSummary.context?.region??'';
 if(f.autoSummary?.purpose==='science')f.summaryGoal=s?.goals?.sciencePurpose??f.autoSummary.context?.goal??'';
 return f;
}
export function notesForOperation(s,fields){
 const f=fields,result={note:String(f.note??''),userNote:String(f.note??'')};
 if(f.autoSummary?.purpose)result.autoSummary=createAutomaticSummary(s,f.autoSummary.purpose,f);
 if(f.legacyNote){
  if(f.legacyNoteRole==='user'){result.userNote=[f.legacyNote,result.userNote].filter(Boolean).join('\n');result.note=result.userNote;result.legacyNote='';result.legacyNoteArchive=f.legacyNote;result.legacyNoteRole='user';}
  else{result.legacyNote=f.legacyNote;result.legacyNoteRole=f.legacyNoteRole||'unclassified';}
 }
 return result;
}
export function noteMarkup(item){
 const summary=item.autoSummary,user=Object.hasOwn(item,'userNote')?item.userNote:'',legacy=item.legacyNote||(!Object.hasOwn(item,'userNote')?item.note:'');
 return `${summary?.text?`<p data-auto-summary><strong>자동 요약</strong> · ${esc(summary.text)}</p>`:''}${user?`<p data-user-note><strong>사용자 메모</strong> · ${esc(user)}</p>`:''}${legacy?`<details data-legacy-note><summary>${item.legacyNoteRole==='auto'?'이전 자동 요약 (보존)':'기존 메모 (작성 구분 확인 필요)'}</summary><p>${esc(legacy)}</p></details>`:''}`;
}
export function summaryPurposeName(purpose){return purposeNames[purpose]||'선택 목표';}
