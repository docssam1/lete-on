import {esc} from './intake.mjs';
import {trackOf} from './flow.mjs';
import {progressRoadmapMarkup} from './progress-roadmap.mjs';
import {compareBookPolicy} from './recommendation-policy.mjs';
import {PURPOSE_DETAILS} from './optional-details.mjs';
import {academyExperienceMarkup,academyRecordMarkup} from './academy-experience.mjs';

// Presentation only: callers own navigation, edits, persistence and plan acceptance.
const TABS=[['current','전체 로드맵'],['paths','다음 경로'],['analysis','분석지']];
const TRACKS={application:'교과',depth:'심화',thinking:'사고력',arithmetic:'연산'};
const DIRECTIONS=[
 ['current','유지','지금 속도 그대로'],
 ['faster','빠르게','다음 범위를 앞당겨'],
 ['consolidate','다지기','지금 범위를 더 탄탄히'],
 ['deepen','심화','같은 범위를 더 깊게'],
];
const preschool=s=>/^p[4-7]$/.test(s.wizard?.quick?.stage||'');
const mathCourses=s=>(s.courses||[]).filter(c=>Object.hasOwn(TRACKS,trackOf(c)));
const courseName=c=>[c.course||c.name,c.volume].filter(Boolean).join(' ')||'교재 이름 미입력';
const directionOf=s=>DIRECTIONS.find(x=>x[0]===s.wizard?.quick?.learningDirection)||DIRECTIONS[0];

// The overview is supplied by the existing flow. Retain its original chart and
// optional tools without importing that flow or regenerating source tables.
function element(html,tag,opening){
 const found=opening.exec(html);if(!found)return null;
 const start=found.index,innerStart=start+found[0].length;
 const tokens=new RegExp(`<!--[\\s\\S]*?-->|<\\/?${tag}\\b[^>]*>`,'gi');tokens.lastIndex=innerStart;
 let depth=1,token;
 while((token=tokens.exec(html))){
  if(token[0].startsWith('<!--'))continue;
  if(token[0].startsWith('</'))depth--;else if(!token[0].endsWith('/>'))depth++;
  if(!depth)return {inner:html.slice(innerStart,token.index),outer:html.slice(start,tokens.lastIndex)};
 }
 return null;
}
function legacyParts(view){
 const html=String(view?.html||'');
 return {
  chart:element(html,'section',/<section\b[^>]*\bdata-result-roadmap(?=\s|=|>)[^>]*>/i)?.inner||'',
  extras:element(html,'div',/<div\b[^>]*\bclass=["'][^"']*\bresult-more-body\b[^"']*["'][^>]*>/i)?.inner||'',
  profile:element(html,'div',/<div\b[^>]*\bclass=["'][^"']*\bux-overview-head\b[^"']*["'][^>]*>/i)?.inner||'',
 };
}

function purposeState(s,id){
 const q=s.wizard?.quick||{},status=q.detailStatuses?.[id],previous=q.compact?.lastGoalAnswers?.[id];
 if(s.goals?.[id]===true)return {selected:true,text:'생각해요'};
 if(status==='none'||previous==='no')return {selected:false,text:'지금은 관심 없어요'};
 if(status==='later')return {selected:false,text:'나중에 입력'};
 if(status==='entered')return {selected:true,text:'입력한 내용 보기'};
 return {selected:false,text:'필요할 때 살펴보기'};
}
function academyState(s,kind){
 const goals=s.goals||{},q=s.wizard?.quick||{};
 if(kind==='premier'){
  if(['consider','current','later'].includes(goals.premier))return {selected:true,text:goals.premier==='later'?'나중에 고려':'생각해요'};
  if(goals.premier==='none'||q.target==='none')return {selected:false,text:'학원 목표 없이'};
  if(['soma','fields'].includes(q.target))return {selected:true,text:q.target==='soma'?'소마 고려':'필즈 고려'};
  return {selected:false,text:'미정이어도 괜찮아요'};
 }
 const labels={grade2:'초2 고려',grade3:'초3 고려',later:'나중에 고려',none:'선택하지 않음',undecided:'시점 미정'};
 return {selected:['grade2','grade3','later'].includes(goals.hwangso)||(s.wizard?.interests||[]).includes('hwangso'),text:labels[goals.hwangso]||'필요할 때 살펴보기'};
}
function goalButtons(s,{selectedOnly=false,basic=false}={}){
 const purposes=PURPOSE_DETAILS.map(d=>({...d,...purposeState(s,d.id),attribute:'data-purpose-detail'}));
 const academies=[{id:'premier',label:preschool(s)?'프리미어·소마·필즈':'소마·필즈 준비',...academyState(s,'premier'),attribute:'data-academy-detail'},{id:'hwangso',label:'황소 선발',...academyState(s,'hwangso'),attribute:'data-academy-detail'}];
 const basicIds=preschool(s)?['gifted','premier']:['gifted','highSchool'];
 const all=[...purposes,...academies].filter(d=>!selectedOnly||d.selected||(basic&&basicIds.includes(d.id)));
 if(!all.length)return '';
 return `<section class="result-hub-goals"><h2>${selectedOnly&&!basic?'생각하는 목표':'목표별로 살펴보기'}</h2><div class="result-hub-goal-grid">${all.map(d=>`<button type="button" class="result-hub-goal${d.selected?' is-selected':''}" ${d.attribute}="${d.id}"><span><strong>${esc(d.label)}</strong><small>${esc(d.text)}</small></span><span aria-hidden="true">›</span></button>`).join('')}</div></section>`;
}
function bookEdits(s){
 const courses=mathCourses(s);
 if(!courses.length)return `<div class="result-hub-book-edits"><button type="button" data-quick-learning>학습 기록 더하기</button></div>`;
 return `<section class="result-hub-book-edits" aria-label="교재별 기록 수정">${courses.map(c=>`<div class="result-hub-book-row"><span><small>${TRACKS[trackOf(c)]}</small><strong>${esc(courseName(c))}</strong></span><button type="button" data-edit-book="${esc(c.id)}" aria-label="${esc(courseName(c))} 기록 수정">수정</button></div>`).join('')}</section>`;
}
function directionChoices(s){
 const selected=directionOf(s)[0];
 return `<section class="result-hub-directions"><h2>어느 방향으로 이어갈까요?</h2><fieldset><legend class="sr-only">앞으로의 학습 방향</legend>${DIRECTIONS.map(([value,title,copy])=>`<label class="result-hub-direction"><input type="radio" name="learningDirection" value="${value}"${selected===value?' checked':''}><span><strong>${title}</strong><small>${copy}</small></span></label>`).join('')}</fieldset><p class="result-hub-note">부모가 고른 방향이에요. 실제 진도와 기간은 자료를 비교하며 정해요.</p></section>`;
}
function wishText(s){
 const goals=PURPOSE_DETAILS.filter(d=>purposeState(s,d.id).selected).map(d=>d.label);
 if(academyState(s,'premier').selected)goals.push(preschool(s)?'프리미어·소마·필즈':'소마·필즈');
 if(academyState(s,'hwangso').selected)goals.push('황소');
 return [directionOf(s)[1],...goals].join(' · ');
}
function analysis(s){
 const policy=compareBookPolicy(s),courses=mathCourses(s);
 const lines=Object.entries(TRACKS).map(([key,label])=>{
  const items=courses.filter(c=>trackOf(c)===key);
  return items.length?`<span>${label} · ${items.map(c=>esc(courseName(c))).join(' / ')}</span>`:'';
 }).filter(Boolean);
 const academies=(s.wizard?.academies||[]).map(academyRecordMarkup);
 if(academies.length)lines.push(`<span>학원 경험 · ${academies.join(' / ')}</span>`);
 const candidates=policy.candidates.slice(0,2);
 const firstSentence=text=>String(text||'').split(/(?<=[.!?])\s+/)[0];
 const reasons=candidates.length?candidates.map(c=>`<p><strong>${esc(c.title)}</strong><span>${esc(firstSentence(c.text))}</span></p>`).join(''):`<p>${esc(policy.questions[0]||policy.text)}</p>`;
 const checks=[...new Set([...policy.candidates.flatMap(c=>c.confirmation||[]),...policy.questions])].slice(0,2);
 const next=checks.length?checks.map(t=>`<span>${esc(t)}</span>`).join(''):'<span>필요한 교재나 목표를 열어 다음 범위를 확인해요.</span>';
 return `<section class="result-hub-analysis"><h2>기록으로 보는 학습 안내</h2><dl><div><dt>현재 기록</dt><dd>${lines.join('')||'아직 입력한 교재가 없어요.'}</dd></div><div><dt>희망 방향</dt><dd>${esc(wishText(s))}<small>부모가 선택한 내용</small></dd></div><div><dt>설명</dt><dd>${reasons}<small>기존 교재 운용 기준에 따른 비교 제안</small></dd></div><div><dt>다음 확인</dt><dd>${next}</dd></div></dl><p class="result-hub-note">학습 기록에 따른 안내예요. 이해도·혼자 푸는 정도는 따로 확인해요.</p></section>`;
}
function actions(){
 return `<div class="result-actions ux-result-actions result-hub-actions"><button type="button" class="primary" data-quick-save>이 로드맵 보관하기</button><button type="button" data-monthly-action="open">월별 계획 보기 <span aria-hidden="true">›</span></button></div>`;
}

export function resultHubScreen(s,data={},legacyView={}){
 const q=s.wizard?.quick||{},tab=TABS.some(([id])=>id===q.resultTab)?q.resultTab:'current',legacy=legacyParts(legacyView);
 const chart=preschool(s)?legacy.chart:progressRoadmapMarkup(s,data);
 let content,tools;
 if(tab==='paths'){content=directionChoices(s)+(!preschool(s)?`<section class="result-hub-path-preview">${chart}</section>`:'');tools=goalButtons(s);}
 else if(tab==='analysis'){content=analysis(s);tools=bookEdits(s)+goalButtons(s,{selectedOnly:true});}
 else{
  const recorded=`<section class="result-roadmap result-hub-current" data-result-roadmap>${chart||'<p>현재 학습 기록을 더하면 과정과 비교할 수 있어요.</p>'}</section>`;
  const names={...TRACKS,science:'과학',other:'타 과목'},facts=(s.courses||[]).map(c=>`<span><b>${esc(names[trackOf(c)]||'학습')}</b> ${esc(courseName(c))}</span>`).join('');content=`<section class="result-hub-recorded-summary" aria-label="입력한 학습 기록"><strong>입력한 학습 기록</strong><div>${facts||'아직 입력한 교재가 없어요.'}</div></section>${s.wizard?.academies?.length?`<details class="result-hub-academy-details"><summary>학원 경험과 참고 목차 보기</summary>${academyExperienceMarkup(s.wizard.academies)}</details>`:''}<p class="result-hub-reference-meaning">아래는 전체 참고 경로예요. 선택한 칸은 살펴보는 구간이며, 아이의 진도를 뜻하지 않아요.</p><div data-full-route-map></div>`+(preschool(s)?recorded+actions():`${actions()}<details class="result-hub-book-scene"><summary>수학 교재를 입체로 보기</summary><div data-progress-scene></div></details><details class="result-hub-source-progress" data-source-progress><summary>교재별 진도와 원표 비교 보기</summary>${recorded}</details>`);
  tools=goalButtons(s,{selectedOnly:true,basic:true})+bookEdits(s);
 }
 const tabs=`<nav class="result-hub-tabs" aria-label="로드맵 결과 보기">${TABS.map(([id,label])=>`<button type="button" data-result-tab="${id}" class="${id===tab?'is-active':''}"${id===tab?' aria-current="page"':''}>${label}</button>`).join('')}</nav>`;
 const extra=legacy.extras||'<div data-ux-goals-slot></div><div data-ai-slot></div>';
 const more=`<details class="result-more result-hub-more" data-result-more><summary>더 살펴보기</summary><div class="result-more-body">${extra}</div></details>`;
 return {...legacyView,title:'우리 아이의 로드맵',say:'지금 기록에서 이어갈 과정을 살펴보세요.',hideNext:true,html:`<section class="result-hub" data-result-hub="${tab}">${legacy.profile?`<div class="ux-overview-head">${legacy.profile}</div>`:''}${tabs}<div class="result-hub-panel" data-result-panel="${tab}">${content}</div>${tab==='current'?'':actions()}${tools}${more}</section>`};
}
