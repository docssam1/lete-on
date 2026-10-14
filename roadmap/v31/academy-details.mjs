import {academyContext,academyReferenceMarkup} from './academy-reference.mjs';
import {esc} from './intake.mjs';

export const HWANGSO_LABELS={grade2:'초2 고려',grade3:'초3 고려',later:'나중에 고려',none:'선택하지 않음',undecided:'아직 미정'};
export function hwangsoTimingAnswered(s){
 if(typeof s.goals.hwangsoTimingAnswered==='boolean')return s.goals.hwangsoTimingAnswered;
 return ['grade2','grade3','later','none'].includes(s.goals.hwangso);
}
export function syncHwangsoInquiry(s){
 s.goals.hwangsoInquiry=hwangsoTimingAnswered(s)?'answered':s.wizard.interests.includes('hwangso')?'interested':'not_asked';
}
export function recordHwangsoTiming(s){
 if(!Object.hasOwn(HWANGSO_LABELS,s.goals.hwangso))return;
 s.goals.hwangsoTimingAnswered=true;syncHwangsoInquiry(s);
}
export function recordHwangsoBranch(s,draft){
 const matches=Object.entries(HWANGSO_LABELS).filter(([,label])=>draft.values.includes(label));
 if(matches.length!==1)return;
 s.goals.hwangso=matches[0][0];
 s.goals.hwangsoReasons=[...(draft.hwangsoReasons||[])];
 s.goals.hwangsoReasonNote=draft.hwangsoReasonNote||'';
 recordHwangsoTiming(s);
}
export function academyChoices(s){
 const target=({soma:'소마 고려',fields:'필즈 고려',none:'학원 목표 없이',undecided:'미정'})[s.wizard.quick.target]||'아직 입력하지 않음';
 const timing=hwangsoTimingAnswered(s)?HWANGSO_LABELS[s.goals.hwangso]:'시점 입력하기';
 return academyReferenceMarkup(academyContext(s))+`<details class="academy-selection-details"><summary>학원·선발 상세 (선택)</summary><div class="actions"><button type="button" data-academy-detail="premier">소마·필즈 준비 · ${esc(target)}</button><button type="button" data-academy-detail="hwangso">황소 · ${esc(timing)}</button></div></details>`;
}
export function openAcademyDetail(s,kind,returnStep){
 if(!['premier','hwangso'].includes(kind))throw Error('학원 상세 항목을 확인해 주세요.');
 s.wizard.quick.academyDetail={kind,returnStep:['plan','routes'].includes(returnStep)?returnStep:'overview',refiningBefore:!!s.wizard.quick.refining,draft:{premier:s.goals.premier,hwangso:s.goals.hwangso,hwangsoReasons:[...(s.goals.hwangsoReasons||[])],hwangsoReasonNote:s.goals.hwangsoReasonNote||''}};
 s.wizard.quick.refining=true;return kind;
}
export function academyScreenState(s){
 const draft=s.wizard.quick.academyDetail?.draft;
 return draft?{...s,goals:{...s.goals,...draft}}:s;
}
export function collectAcademyDetail(s,d){
 const session=s.wizard.quick.academyDetail;
 if(!session)return false;
 const draft=session.draft;
 if(s.wizard.step==='premier'){if(d.has('premier'))draft.premier=d.get('premier');return true;}
 if(s.wizard.step==='hwangso'||s.wizard.step==='hwangso-reason'){
  if(d.has('hwangso'))draft.hwangso=d.get('hwangso');
  if(s.wizard.step==='hwangso-reason'){draft.hwangsoReasons=d.getAll('hwangsoReasons');draft.hwangsoReasonNote=String(d.get('hwangsoReasonNote')||'');}
  return true;
 }
 return false;
}
export function finishAcademyDetail(s,skip=false){
 const q=s.wizard.quick,session=q.academyDetail;
 if(!session)return null;
 if(!skip&&session.kind==='hwangso'){
  s.goals.hwangso=session.draft.hwangso;recordHwangsoTiming(s);
  if(!s.wizard.interests.includes('hwangso'))s.wizard.interests.push('hwangso');
  if(s.wizard.step==='hwangso')return 'hwangso-reason';
  s.goals.hwangsoReasons=[...session.draft.hwangsoReasons];s.goals.hwangsoReasonNote=session.draft.hwangsoReasonNote;
 }
 if(!skip&&session.kind==='premier')s.goals.premier=session.draft.premier;
 if(!skip&&!s.wizard.interests.includes(session.kind))s.wizard.interests.push(session.kind);
 if(!skip&&session.kind==='premier'&&s.goals.premier==='none')s.wizard.interests=s.wizard.interests.filter(x=>x!=='premier');
 syncHwangsoInquiry(s);delete q.academyDetail;q.refining=session.refiningBefore;return session.returnStep;
}
