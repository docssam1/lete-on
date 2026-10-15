const clone=v=>structuredClone(v);
const keys=['profile','goals','courses','answers','courseAnswers','support','academy','wizard'];
function payload(s){const p={};for(const k of keys)if(s[k]!==undefined)p[k]=clone(s[k]);if(p.wizard?.quick)delete p.wizard.quick.briefEdit;return p;}
export function briefSession(s){const x=s.wizard?.quick?.briefEdit;return x?.step===s.wizard.step?x:null;}
export function beginBrief(s,{returnStep}={}){if(briefSession(s))return s;const w=s.wizard;const destination=returnStep||w.quick.optionalDetail?.returnStep||(w.quick.refining?'overview':w.history.at(-1))||'overview';const draft=payload(s);w.quick.briefEdit={version:1,step:w.step,returnStep:destination,pendingCourseId:w.pendingCourseId||'',draft};return s;}
export function briefWorkingState(s){const x=briefSession(s);if(!x)return s;const working=clone(s);for(const k of keys)if(x.draft[k]!==undefined)working[k]=clone(x.draft[k]);delete working.wizard.quick.briefEdit;return working;}
export function storeBriefDraft(s,working){const x=briefSession(s);if(!x)throw Error('작성 중인 기록을 다시 열어 주세요.');const next=clone(s);next.wizard.quick.briefEdit={...clone(x),draft:payload(working)};return next;}
export function commitBrief(s){const next=briefWorkingState(s);if(next.wizard?.quick)delete next.wizard.quick.briefEdit;return next;}
export function discardBrief(s){const next=clone(s);delete next.wizard.quick.briefEdit;return next;}
