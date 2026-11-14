/* Per-question study selection. Public metadata contains units and locators only,
 * never question text, answers or solution content. */
(function(g){'use strict';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const GROUPS=[
 ['중1-1',[['m-prime','소인수분해'],['m-integer','정수와 유리수'],['m-expression','문자와 식'],['m-equation','일차방정식'],['m-linear-graph','좌표와 그래프']]],
 ['중1-2',[['m-figure','기본 도형과 작도'],['m-plane','평면도형'],['m-solid','입체도형'],['m-data','자료의 정리와 해석']]],
 ['중2-1',[['m-rational','유리수와 순환소수'],['m-polynomial','식의 계산'],['m-inequality','일차부등식'],['m-simultaneous','연립일차방정식'],['m-linear-function','일차함수']]],
 ['중2-2',[['m-triangle','삼각형의 성질'],['m-quadrilateral','사각형의 성질'],['m-similarity','도형의 닮음'],['m-pythagoras','피타고라스 정리'],['m-probability','경우의 수와 확률']]],
 ['중3-1',[['m-root','제곱근과 실수'],['m-factor','다항식의 곱셈과 인수분해'],['m-quadratic','이차방정식'],['m-parabola','이차함수']]],
 ['중3-2',[['m-trig','삼각비'],['m-circle','원의 성질'],['m-statistics','통계']]],
 ['공통수학1',[['c1-poly','다항식의 연산'],['c1-remainder','나머지정리와 인수분해'],['c1-complex','복소수'],['c1-quadratic','이차방정식'],['c1-parabola','이차방정식과 이차함수'],['c1-equation','여러 가지 방정식'],['c1-inequality','여러 가지 부등식'],['c1-count','순열과 조합'],['c1-matrix','행렬']]],
 ['공통수학2',[['c2-coordinate','평면좌표'],['c2-line','직선의 방정식'],['c2-circle','원의 방정식'],['c2-transform','도형의 이동'],['c2-set','집합'],['c2-proposition','명제'],['c2-function','함수·합성함수·역함수'],['c2-rational','유리함수'],['c2-irrational','무리함수']]],
 ['대수',[['a-power','거듭제곱근과 지수'],['a-log','로그'],['a-exponential','지수함수'],['a-logarithmic','로그함수'],['a-angle','일반각과 호도법'],['a-trig','삼각함수'],['a-law','사인법칙과 코사인법칙'],['a-arithmetic','등차수열'],['a-geometric','등비수열'],['a-sum','수열의 합'],['a-recursion','수학적 귀납법과 귀납적 수열']]],
 ['미적분Ⅰ',[['cal-limit','함수의 극한'],['cal-continuity','함수의 연속'],['cal-coefficient','미분계수'],['cal-derivative','도함수'],['cal-application','도함수의 활용'],['cal-integral','부정적분과 정적분']]],
 ['확률과 통계',[['p-count','여러 가지 순열과 조합'],['p-probability','확률과 조건부확률'],['p-statistics','확률분포와 통계적 추정']]],
 ['이전 교육과정·별도 확인',[['old-external','선분의 외분']]]
];
const UNITS=GROUPS.flatMap(([course,rows],ci)=>rows.map(([id,title],order)=>({id,title,course,ci,order}))),ids=new Set(UNITS.map(u=>u.id)),UNIT=Object.fromEntries(UNITS.map(u=>[u.id,u]));
// 기출 단원 목록(GROUPS)은 확률과 통계에서 끝난다. 그 뒤 과목을 공부 중이면 앞 과정은 모두 배운 범위다.
const LATER_STAGES=['미적분Ⅱ','기하'];
const STAGES=GROUPS.map(x=>x[0]),VERSION='20261106.1';
const unique=v=>[...new Set(Array.isArray(v)?v:[])];
const validUnits=v=>unique(v).filter(id=>ids.has(id));
const nums=v=>unique(v).filter(n=>Number.isInteger(n)&&n>=1&&n<=30).sort((a,b)=>a-b);
const STATES={correct:'혼자 맞힘',helped:'힌트·해설 참고',wrong:'틀림',unanswered:'배웠지만 못 풀거나 남김',unlearned:'아직 배우지 않음'};
const catalog=()=>g.PlannerMockItemData||{};
function paper(value){return g.PlannerMockSchedule?.resolvePaper(value)||g.PlannerMockLibrary?.find(value)||null;}
function items(value){const p=paper(value),d=p&&catalog()[p.id];return d?.items||[];}
function restoreKnowledge(v){return v?.version===1&&typeof v.signature==='string'&&v.signature.length<=400?{version:1,signature:v.signature,learned:validUnits(v.learned)}:null;}
function knowledge(a,s,actual){
 const signature=g.PlannerIntake?.progressCourse(g.PlannerIntake.effective(a),'schoolStatus')||'',saved=restoreKnowledge(s?.knowledge);
 if(saved&&saved.signature===signature)return{...saved,explicit:true,stage:actual?.stage||null};
 const stage=actual?.stage,ci=LATER_STAGES.includes(stage)?STAGES.length:STAGES.indexOf(stage),learned=UNITS.filter(u=>u.ci<ci&&u.course!=='이전 교육과정·별도 확인').map(u=>u.id);
 if(actual?.done)learned.push(...UNITS.filter(u=>u.course===stage).map(u=>u.id));
 const boundary=s?.signature===signature?s.boundary:null;
 const last={'c1-equations':'c1-inequality','c1-all':'c1-matrix','c2-geometry':'c2-transform','c2-all':'c2-irrational','alg-trig':'a-law','alg-all':'a-recursion','cal-limit':'cal-limit','cal-coefficient':'cal-coefficient','cal-all':'cal-integral'}[boundary],end=UNIT[last];
 if(end&&end.course===stage)learned.push(...UNITS.filter(u=>u.course===stage&&u.order<=end.order).map(u=>u.id));
 return{version:1,signature,learned:validUnits(learned),explicit:false,stage:stage||null};
}
function knowledgeInput(input,a,actual){return input.knowledgeEdited==='on'?{version:1,signature:g.PlannerIntake.progressCourse(g.PlannerIntake.effective(a),'schoolStatus'),learned:UNITS.filter(u=>input['learned-unit-'+u.id]==='on').map(u=>u.id)}:null;}
function knowledgeFields(k){return `<details class="mock-unit-check"><summary>문항을 고를 배운 단원 확인 · ${k.learned.length}개</summary><input type="hidden" name="knowledgeEdited" value=""><p>이전 과목과 확인한 완료 범위를 기본으로 표시했습니다. 실제로 배우지 않은 단원은 해제해 주세요. 교재 분량 완료율이나 예정 종료일로 이수 처리하지 않습니다. 현재 과목을 바꾸면 다시 확인합니다.</p>${GROUPS.map(([course,rows])=>`<fieldset><legend>${esc(course)}</legend><div class="mock-unit-grid">${rows.map(([id,title])=>`<label><input type="checkbox" name="learned-unit-${id}"${k.learned.includes(id)?' checked':''}> ${esc(title)}</label>`).join('')}</div></fieldset>`).join('')}</details>`;}
function select(value,learned,{mode='current',target=[],projected=false}={}){
 const p=paper(value);if(!p)return null;const known=new Set(validUnits(learned)),targets=validUnits(target),rows=items(p),map=new Map(rows.map(q=>[q.number,q]));
 const s={version:1,paperId:p.id,metadataVersion:VERSION,mode,projected:!!projected,selected:[],excludedUnlearned:[],excludedOther:[],unmapped:[],learnedUnitIds:[...known],targetUnitIds:targets};
 for(let n=1;n<=30;n++){const q=map.get(n);if(!q||q.unverified||!q.requires?.length||q.requires.some(id=>!ids.has(id))){s.unmapped.push(n);continue;}if(q.requires.some(id=>!known.has(id))){s.excludedUnlearned.push(n);continue;}if(mode==='remedial'&&!targets.some(id=>q.unitId===id||q.requires.includes(id))){s.excludedOther.push(n);continue;}s.selected.push(n);}
 return s;
}
function restoreSelection(v,r){
 const p=paper(r);if(!v||v.version!==1||!p||p.id!==v.paperId||!['current','remedial','whole'].includes(v.mode)||typeof v.metadataVersion!=='string'||v.metadataVersion.length>40)return null;
 const keys=['selected','excludedUnlearned','excludedOther','unmapped'];let all=[];const out={version:1,paperId:p.id,metadataVersion:v.metadataVersion,mode:v.mode,projected:v.projected===true};
 for(const key of keys){out[key]=nums(v[key]);if((v[key]?.length||0)!==out[key].length||out[key].some(n=>all.includes(n)))return null;all.push(...out[key]);}
 out.learnedUnitIds=validUnits(v.learnedUnitIds);out.targetUnitIds=validUnits(v.targetUnitIds);return out;
}
function restoreRecord(r){const s=restoreSelection(r?.questionSelection,r);if(!s||s.projected||!s.selected.length)return{};return{questionSelection:s,answers:Object.fromEntries(s.selected.map(n=>[n,Object.hasOwn(STATES,r.answers?.[n])?r.answers[n]:'unanswered']))};}
function aggregate(s,answers){return{total:s.selected.length,unlearned:s.selected.filter(n=>answers[n]==='unlearned').length,correct:s.selected.filter(n=>answers[n]==='correct').length,helped:s.selected.filter(n=>answers[n]==='helped').length};}
function focusUnit(s,q){return s?.mode==='remedial'?s.targetUnitIds.find(id=>q?.requires?.includes(id))||q?.unitId:q?.unitId;}
function readInput(input,r,previous){
 if(!input.questionSelection)return{value:null,error:null};let raw;try{raw=JSON.parse(input.questionSelection);}catch{return{error:'문항 선택 정보를 다시 열어 확인해 주세요.'};}
 const s=restoreSelection(raw,r);if(!s||s.projected)return{error:'시험과 문항 범위를 다시 확인해 주세요. 예정 문항은 현재 배운 단원으로 다시 골라야 합니다.'};
 if(!s.selected.length)return{error:'현재 배운 단원으로 선택된 문항이 없습니다. 배운 단원을 확인한 뒤 기록해 주세요.'};
 const answers={};for(const n of s.selected){const v=input['question-'+n];if(!Object.hasOwn(STATES,v))return{error:n+'번의 결과를 선택해 주세요. 배우지 않았다면 미학습으로 표시합니다.'};answers[n]=v;}
 const byUnit=new Map(),rows=items(s.paperId);for(const n of s.selected){const state=answers[n],q=rows.find(q=>q.number===n);if(!q||state==='unlearned'||state==='correct')continue;const u=UNIT[focusUnit(s,q)];if(!u)continue;const row=byUnit.get(u.id)||{unitId:u.id,title:u.title,missed:0,helped:0,cause:Object.hasOwn(g.PlannerMockEvidence?.CAUSES||{},r.cause)?r.cause:'unknown'};if(state==='helped')row.helped++;else row.missed++;byUnit.set(u.id,row);}
 const applicable=s.selected.filter(n=>answers[n]!=='unlearned').map(n=>({q:rows.find(q=>q.number===n),state:answers[n]})).filter(x=>x.q);
 const coveredUnitIds=validUnits(applicable.flatMap(({q})=>[q.unitId,...q.requires])).filter(id=>applicable.filter(({q})=>q.unitId===id||q.requires.includes(id)).every(({q,state})=>state==='correct'||focusUnit(s,q)===id));
 return{value:{questionSelection:s,answers,...aggregate(s,answers),units:[...byUnit.values()],coveredUnitIds},error:null};
}
function numberText(s){return s?.selected.length?s.selected.join(', ')+'번':'선택된 문항 없음';}
function summary(s){if(!s)return'';return `<div class="mock-item-summary"><p><strong>${s.mode==='whole'?'전체 시험 30문항':s.projected?'예정 범위를 마친 뒤 풀 번호':'지금 풀 문제 번호'} · ${esc(numberText(s))}</strong></p><p>미학습 제외 ${s.excludedUnlearned.length}문항${s.excludedUnlearned.length?' ('+s.excludedUnlearned.join(', ')+'번)':''} · 단원 검수 대기 ${s.unmapped.length}문항${s.mode==='remedial'?' · 보완 대상 외 '+s.excludedOther.length+'문항':''}</p>${s.projected?'<p>예정 진도 기준입니다. 결과 기록·인쇄 때 현재 배운 단원으로 다시 고릅니다.</p>':''}${s.unmapped.length?'<details><summary>단원 검수 대기 번호</summary><p>'+s.unmapped.join(', ')+'번 · 자동 선정과 수행률에서 제외합니다.</p></details>':''}</div>`;}
function fields(d){const s=restoreSelection(d.questionSelection,d);if(!s)return'';const rows=items(s.paperId);return `<section data-mock-question-fields><h4>${s.mode==='whole'?'전체 시험 30문항 결과':'문항별 결과 기록'}</h4>${summary(s)}<input type="hidden" name="questionSelection" value="${esc(JSON.stringify(s))}"><p>종이에 푼 뒤 공식 해설로 확인하고 표시하세요. 미학습은 수행률에서 빠지고, 배웠지만 남긴 문항은 포함됩니다. 복합 문항은 대표 단원으로 묶고, 재점검에서는 이번 보완 단원을 우선 연결합니다.</p><div class="mock-question-grid">${s.selected.map(n=>`<label>${n}번 · ${esc(UNIT[focusUnit(s,rows.find(q=>q.number===n))]?.title||'단원 확인')}<select name="question-${n}" required><option value="">결과 선택</option>${Object.entries(STATES).map(([id,title])=>`<option value="${id}"${d.answers?.[n]===id?' selected':''}>${title}</option>`).join('')}</select></label>`).join('')}</div>${s.mode==='whole'?`<p>공식 문제 PDF를 인쇄해 전체 시험으로 푼 뒤, 공식 해설로 채점한 결과를 기록하세요. 원점수는 100점 만점으로, 미학습을 제외한 수행률은 별도로 계산합니다.</p><div data-mock-full-preview aria-live="polite"></div>`:`<button type="button" data-mock-print-form>선택 문항 학습지 인쇄</button>`}</section>`;}
function refreshForm(f){const el=f.elements.questionSelection;if(!el)return;let s;try{s=JSON.parse(el.value);}catch{return;}const answers=Object.fromEntries(s.selected.map(n=>[n,f.elements['question-'+n]?.value]));for(const [k,v]of Object.entries(aggregate(s,answers)))if(f.elements[k])f.elements[k].value=v;}
function targetUnits(topics){return validUnits(topics.flatMap(t=>t.unitId?[t.unitId]:UNITS.filter(u=>u.title===t.title||u.title.replace(/와 |과 |·/g,'')===t.title.replace(/와 |과 |·/g,'')).map(u=>u.id)));}
function forRecord(value,k,extra={}){const s=select(value,k?.learned||[],extra);return s?{questionSelection:s,rangeMode:'selected',scope:s.selected.length?validUnits(s.selected.map(n=>items(s.paperId).find(q=>q.number===n)?.unitId)).map(id=>UNIT[id].title).join(' · ').slice(0,160):'배운 단원 확인 필요',total:s.selected.length,unlearned:0,correct:0,helped:0}:{};}
function partialCheckpoint(k){if(!k?.explicit)return null;return /^중/.test(k.stage)?'h1-03':({'공통수학1':'h1-06','공통수학2':'h1-10','대수':'h2-06','미적분Ⅰ':k.learned.includes('cal-coefficient')?'h2-10':'h2-09'}[k.stage]||null);}
function projectedUnits(row,k){const set=new Set(k.learned);for(const [course,step]of row.needs||[]){const ci=STAGES.indexOf(course);for(const u of UNITS)if(u.ci<ci&&u.course!=='이전 교육과정·별도 확인')set.add(u.id);const end=({'공통수학1':step===1?'c1-inequality':'c1-matrix','공통수학2':step===1?'c2-transform':'c2-irrational','대수':step===1?'a-law':'a-recursion','미적분Ⅰ':step===1?'cal-limit':step===2?'cal-coefficient':'cal-integral'})[course];for(const u of UNITS)if(u.course===course&&(!end||u.order<=UNIT[end].order))set.add(u.id);}return[...set];}
g.PlannerMockItems=Object.freeze({VERSION,UNITS,UNIT,GROUPS,STATES,validUnits,items,restoreKnowledge,knowledge,knowledgeInput,knowledgeFields,select,restoreSelection,restoreRecord,aggregate,focusUnit,readInput,numberText,summary,fields,refreshForm,targetUnits,forRecord,partialCheckpoint,projectedUnits});
})(window);
