import {ORDERED,DOMAINS,LEVELS,CONTESTS,domainOf,levelOf,contestsOf} from './data/curriculum.js';
import {OBSERVE_SETS,STAGES} from './data/observe-sets.js';

const esc=value=>String(value??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
export const binderResources=[
 ...ORDERED.map(unit=>({key:'unit:'+unit.id,kind:'unit',id:unit.id,title:unit.title,
  sub:unit.sub,href:`#/u/${unit.id}`,domain:domainOf(unit).id,level:levelOf(unit).id,
  contests:contestsOf(unit).map(c=>c.id),unit,
  search:[unit.title,unit.sub,unit.activity.title,domainOf(unit).title,...unit.concept.terms.map(t=>t[0])].join(' ')})),
 ...OBSERVE_SETS.map(set=>({key:'observe:'+set.id,kind:'observe',id:set.id,title:set.title,
  sub:STAGES[set.stage].title,href:`#/observe/${set.id}`,domain:'life',level:set.level,
  contests:['nature'],set,search:[set.title,set.short,set.lead,'자연관찰',STAGES[set.stage].title].join(' ')})),
];
const normalized=value=>String(value).normalize('NFKC').toLocaleLowerCase('ko');
export function filterBinderResources({domain='',level='',contest='',kind='',query=''}={}){
 const words=normalized(query).trim().split(/\s+/).filter(Boolean);
 const results=binderResources.filter(r=>(!domain||r.domain===domain)&&(!level||r.level===level)
  &&(!contest||r.contests.includes(contest))&&(!kind||r.kind===kind)
  &&words.every(word=>normalized(r.search).includes(word)));
 return contest==='nature'?[...results.filter(r=>r.kind==='observe'),...results.filter(r=>r.kind==='unit')]:results;
}
export function defaultBinderResource(resources=binderResources){
 return resources.find(r=>r.kind==='unit'&&r.unit.part!=='A')||resources[0];
}
function scoreOf(state){return Number.isInteger(state?.quizBest)&&state.quizBest>=0&&state.quizBest<=3?state.quizBest:null;}
function statusHtml(state){
 const score=scoreOf(state);
 return `<p class="binder-status">${state?.videoDone?'실험 장면 봄 · ':''}${score===null?'확인 문제 기록 없음':`확인 문제 최고 ${score}/3`}</p>`;
}
export function binderPreviewHtml(resource,state={}){
 if(!resource)return '<div class="binder-empty"><h2>찾는 자료가 없어요.</h2><p>검색어를 지우거나 다른 영역을 선택해 보세요.</p></div>';
 const unit=resource.unit,set=resource.set,reference=unit?.part==='A';
 const level=LEVELS.find(l=>l.id===resource.level)?.title||'';
 const points=unit?unit.concept.points.slice(0,3).map(([text])=>text):set.steps.slice(0,3);
 return `<article class="binder-sheet" aria-labelledby="binder-preview-title" data-resource="${esc(resource.key)}">
  <div class="binder-page-body">
   <p class="binder-kicker">${esc(DOMAINS.find(d=>d.id===resource.domain)?.title)} · ${esc(level)}</p>
   <h2 id="binder-preview-title">${esc(resource.title)}</h2><p class="binder-sub">${esc(resource.sub)}</p>
   <p class="binder-question">${esc(unit?.concept.lead||set.lead)}</p>
   <h3>${unit?(reference?'자료에서 살펴볼 것':'이 실험에서 할 일'):'관찰하며 해 볼 일'}</h3>
   <p>${esc(unit?.activity.title||STAGES[set.stage].sub)}</p>
   <ol class="binder-flow">${(unit?['개념 읽기','실험 장면 살펴보기','직접 활동하고 설명하기','확인 문제 풀기']:set.steps).map((text,i)=>`<li><span>${String(i+1).padStart(2,'0')}</span>${esc(text)}</li>`).join('')}</ol>
   ${unit?`<section class="binder-kit"><h3>준비물 미리 보기</h3><p>${unit.activity.materials.map(esc).join(' · ')}</p></section>`:''}
   ${unit?.note?`<p class="binder-source-note">${esc(unit.note)}</p>`:''}
   <div class="binder-start"><a class="binder-primary" href="${resource.href}">${unit?(reference?'참고 자료 열기':'실험 시작하기'):'자연관찰 연습 열기'} <span aria-hidden="true">→</span></a>${unit?statusHtml(state):''}</div>
   ${unit?`<p class="binder-source">지도자료 ${esc(unit.part)}-${unit.no} · ${esc(unit.source)}</p>`:''}
  </div>
  <aside class="binder-notes" aria-label="자료 미리 보기">
   <section><h3>${unit?'핵심 정리':'관찰 순서'}</h3><ul>${points.map(text=>`<li>${esc(text)}</li>`).join('')}</ul></section>
   <section><h3>정리해 볼 것</h3><p>${esc(unit?.discuss?.[0]?.q||'관찰한 특징을 그림과 글로 나타내고, 다른 대상과 비교해 보아요.')}</p></section>
   <section><h3>활동 기록</h3><p>${unit?'직접 활동한 내용은 실험을 마친 뒤 따로 정리해요.':'현장 관찰과 여러 날 이어 보는 관찰을 구별해요.'}</p><a href="${unit?`#/u/${unit.id}/report`:resource.href}">${unit?'탐구보고서 열기':'관찰 자료 열기'}</a></section>
  </aside><div class="binder-watermark" aria-hidden="true">GFIELD · 지필드</div>
 </article>`;
}
export function mountBinderHome(root,{store,footer=()=>''}={}){
 const states=new Map();
 const stateOf=id=>{if(!states.has(id)){let value={};try{value=store?.unit(id)||{};}catch{}states.set(id,value);}return states.get(id);};
 const units=binderResources.filter(r=>r.kind==='unit');
 const checked=units.filter(r=>(scoreOf(stateOf(r.id))??-1)>=2).length;
 const last=units.filter(r=>Number.isFinite(stateOf(r.id).updatedAt)&&stateOf(r.id).updatedAt>0)
  .sort((a,b)=>stateOf(b.id).updatedAt-stateOf(a.id).updatedAt)[0];
 root.innerHTML=`<div class="science-binder">
  <a class="binder-skip" href="#binder-content">선택한 자료로 건너뛰기</a>
  <header class="binder-top"><a class="binder-brand" href="#/"><b>GFIELD</b><span>사이언스 랩</span></a><span class="binder-tagline">실험으로 교과 배우기</span><span class="binder-progress">확인 문제 2개 이상 맞힌 자료 ${checked}/${units.length}</span></header>
  <main class="binder-home"><div class="binder-heading"><div><h1>나의 과학 서류철</h1><p>궁금한 것을 고르고, 실험에서 배운 내용을 연결해요.</p></div>${last?`<a class="binder-resume" href="${last.href}">이어서 보기 <b>${esc(last.title)}</b></a>`:''}</div>
   <nav class="binder-domains" aria-label="자료 영역"><button type="button" data-domain="" aria-pressed="true">전체 <span>${binderResources.length}</span></button>${DOMAINS.map(d=>{const count=binderResources.filter(r=>r.domain===d.id).length;return `<button type="button" data-domain="${d.id}" aria-pressed="false"${count?'':' disabled'}>${esc(d.title)} <span>${count||'준비 중'}</span></button>`;}).join('')}</nav>
   <div class="binder-open"><div class="binder-rings" aria-hidden="true"><i></i><i></i><i></i></div>
    <section class="binder-index" aria-labelledby="binder-index-title"><h2 id="binder-index-title">자료 차례</h2>
     <p class="binder-index-description">실험·참고 ${units.length}개 · 자연관찰 ${OBSERVE_SETS.length}개</p>
     <label class="binder-search"><span>자료 찾기</span><input type="search" placeholder="실험·생물 이름이나 낱말" autocomplete="off"></label>
     <div class="binder-filters"><label>자료<select data-filter="kind"><option value="">모든 자료</option><option value="unit">실험·참고 자료</option><option value="observe">자연관찰 연습</option></select></label><label>수준<select data-filter="level"><option value="">모든 수준</option>${LEVELS.map(l=>`<option value="${l.id}">${esc(l.title)}</option>`).join('')}</select></label><label>대회<select data-filter="contest"><option value="">모든 대회</option>${CONTESTS.map(c=>`<option value="${c.id}">${esc(c.title)}</option>`).join('')}</select></label></div>
     <p class="binder-result" role="status" aria-live="polite"></p><div class="binder-list"></div>
    </section><div id="binder-content" class="binder-content" tabindex="-1"></div>
   </div>
   <nav class="binder-library" aria-label="관련 자료"><h2>대회 안내와 기록 자료</h2><div>${CONTESTS.map(c=>`<a href="#/contest/${c.id}">${esc(c.title)} 안내</a>`).join('')}<a href="#/observe">자연관찰 자료</a><a href="#/field">현장 관찰 기록</a></div></nav>
   <p class="binder-origin">기존 지도자료의 주제별 실험이에요. 현행 학년·학기별 <a href="./v2/#/">교과 연결 사고력 수업</a>은 사이언스 랩 v2에서 열어요.</p>
  </main>${footer()}</div>`;
 const list=root.querySelector('.binder-list'),content=root.querySelector('.binder-content'),input=root.querySelector('.binder-search input'),result=root.querySelector('.binder-result');
 let filters={domain:'',kind:'',level:'',contest:'',query:''},selected=defaultBinderResource()?.key,alive=true;
 const listeners=[];
 const on=(target,type,handler)=>{const guarded=event=>{if(alive)handler(event);};target.addEventListener(type,guarded);listeners.push(()=>target.removeEventListener(type,guarded));};
 const domainButtons=[...root.querySelectorAll('[data-domain]')],filterSelects=[...root.querySelectorAll('[data-filter]')];
 const sync=()=>{domainButtons.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.domain===filters.domain)));filterSelects.forEach(select=>{select.value=filters[select.dataset.filter];});};
 function select(key){
  if(!alive)return;
  const resource=filterBinderResources(filters).find(r=>r.key===key);if(!resource)return;
  selected=key;content.innerHTML=binderPreviewHtml(resource,resource.kind==='unit'?stateOf(resource.id):{});
  list.querySelectorAll('[data-resource-key]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.resourceKey===selected)));
 }
 function build(){
  if(!alive)return;
  const resources=filterBinderResources(filters);
  if(!resources.some(r=>r.key===selected))selected=defaultBinderResource(resources)?.key;
  result.textContent=`자료 ${resources.length}개${filters.query.trim()?' 검색됨':''}`;
  list.innerHTML=resources.length?`<ul>${resources.map((r,i)=>`<li><button type="button" data-resource-key="${esc(r.key)}" aria-controls="binder-content" aria-pressed="${r.key===selected}"><span class="binder-number">${String(i+1).padStart(2,'0')}</span><span><b>${esc(r.title)}</b><small>${esc(r.kind==='observe'?r.sub:r.unit.part==='A'?'탐구 방법 참고':r.sub)}</small></span><span aria-hidden="true">›</span></button></li>`).join('')}</ul>`:'<p class="binder-empty">찾는 자료가 없어요.</p><button type="button" data-binder-reset>전체 자료 보기</button>';
  if(selected)select(selected);else content.innerHTML=binderPreviewHtml(null);
 }
 on(list,'click',event=>{
  const button=event.target.closest('[data-resource-key]');if(button)select(button.dataset.resourceKey);
  if(event.target.closest('[data-binder-reset]')){filters={domain:'',kind:'',level:'',contest:'',query:''};input.value='';sync();build();input.focus();}
 });
 on(list,'keydown',event=>{
  const button=event.target.closest('[data-resource-key]');if(!button||!['ArrowDown','ArrowUp','Home','End'].includes(event.key))return;
  event.preventDefault();const buttons=[...list.querySelectorAll('[data-resource-key]')],index=buttons.indexOf(button);
  const next=event.key==='Home'?0:event.key==='End'?buttons.length-1:Math.max(0,Math.min(buttons.length-1,index+(event.key==='ArrowDown'?1:-1)));
  buttons[next].focus();select(buttons[next].dataset.resourceKey);
 });
 domainButtons.forEach(button=>on(button,'click',()=>{filters.domain=button.dataset.domain;sync();build();}));
 filterSelects.forEach(select=>on(select,'change',()=>{filters[select.dataset.filter]=select.value;build();}));
 on(input,'input',()=>{filters.query=input.value;if(filters.query.trim())filters.domain='';sync();build();});
 on(input,'keydown',event=>{if(event.key==='Enter'&&selected){const resource=filterBinderResources(filters).find(r=>r.key===selected);if(resource)location.hash=resource.href;}});
 on(root.querySelector('.binder-skip'),'click',event=>{event.preventDefault();content.focus();});
 on(document,'keydown',event=>{if((event.ctrlKey||event.metaKey)&&event.key==='/'){event.preventDefault();input.focus();}});
 build();
 return()=>{if(!alive)return;alive=false;listeners.splice(0).forEach(off=>off());};
}
