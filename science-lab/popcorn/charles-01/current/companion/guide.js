import {LAB_CONTENT} from './lab-content.js';
import {mountMagazine} from './magazine.js?v=20261015-guided';
import {mountWelcome} from './welcome.js?v=20261015-welcome-autoplay-1';
import {mountStudy} from './study-deck.js?v=20261015-modern-video-1';
import {mountPageFlow} from './page-flow.js?v=20261015-pages-1';

const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const entries=[['intro','먼저 공부하기','이야기와 영상을 한 화면씩 함께 봐요.'],['week','요일별 공부하기','월요일부터 하루씩 이어 가요.'],['magazine','스토리로 공부하기','사진과 이야기를 따라 궁금한 것을 찾아요.'],['build','조립하기','봉투 열기부터 10단계 만들기까지.'],['lab','3D 실험실','자석과 먹이를 직접 움직여 봐요.']];
const days=['월','화','수','목','금'];
let introPage=0,section='intro',origin=null,day=1,finished=false,restoreHash='home';
const history=[];
let study;const flows=new WeakMap();let currentFlow=null;
function flowFor(source){if(!source)return null;if(!flows.has(source))flows.set(source,mountPageFlow(source,{onChange:()=>queueMicrotask(refresh)}));return flows.get(source);}
function syncFlow(){const h=currentHash();let source=null;if(h==='magazine')source=magazine()?.host.querySelector(`[data-mag-spread="${magazine().page}"]`);else if(h.startsWith('reading/'))source=$('#reading-host .reading-article');if(currentFlow){currentFlow.setActive(false);if(!currentFlow.source.isConnected)currentFlow.dispose();}currentFlow=source?flowFor(source):null;currentFlow?.setActive(true);}

const welcome=mountWelcome($('#welcome-host'),{onContinue:beginIntro});
window.__POPCORN_WELCOME__=welcome;
function beginIntro(){origin=null;section='intro';introPage=0;finished=false;lab()?.useRole('self');study.enter({reset:true});navigate('intro');}
const currentHash=()=>location.hash.slice(1)||'home';
const lab=()=>window.__POPCORN_LAB__;
const magazine=()=>mountMagazine($('#magazine-host'));
const dayStages=n=>LAB_CONTENT.stages.filter(s=>s.day===n);

function remember(){history.push({hash:currentHash(),introPage,section,origin,day,finished,stage:lab()?.getState().stageId,magazinePage:magazine()?.page,flowPage:currentFlow?.getState().page||0,study:study?.getState()});}
function navigate(hash){const same=currentHash()===hash;location.hash=hash;if(same)window.dispatchEvent(new CustomEvent('popcornlab:route',{detail:{name:hash,actual:['build','teach'].includes(hash)?'lab':hash}}));refresh();}
function renderIntro(){study?.enter();}

function renderCurrentNotes(){
 let host=$('#guided-records');if(!host){host=document.createElement('section');host.id='guided-records';host.className='guide-current-notes';$('#journal').before(host);}
 const state=lab()?.getState();if(!state)return;
 const labels={virtual:'화면 모형',real:'실물 관찰',prediction:'내 예상',explanation:'내 설명'};
 const records=state.session.records||[],drafts=Object.entries(state.session.drafts||{}).flatMap(([stage,fields])=>Object.entries(fields).filter(([key,value])=>key!=='choice'&&String(value).trim()).map(([key,value])=>({stage,value})));
 host.dataset.role=state.role;
 host.innerHTML=`<h2>방금 남긴 실험 이야기</h2>${records.length?records.map(r=>`<article><strong>${esc(labels[r.kind]||'내 기록')} · ${esc(r.title)}</strong><p>${esc(r.observation||r.text||'')}</p></article>`).join(''):'<p>아직 직접 남긴 실험 기록이 없어요. 떠오른 생각은 아래에 적어도 좋아요.</p>'}${drafts.length?`<details><summary>이 화면을 오가며 적어 둔 글</summary>${drafts.map(d=>`<article><strong>${esc(LAB_CONTENT.stages.find(s=>s.id===d.stage)?.title||'내 생각')}</strong><p>${esc(d.value)}</p></article>`).join('')}</details>`:''}`;
}
function select(hash){
 remember();origin=null;finished=false;section=hash;
 lab()?.useRole(hash==='build'?'training':'self');
 if(hash==='intro'){introPage=0;study.enter({reset:true});}
 if(hash==='week')day=1;
 if(hash==='magazine')magazine()?.show(0);
 navigate(hash);
}
function openDay(n){
 day=n;origin='week';section='week';finished=false;
 const first=dayStages(n)[0];
 window.dispatchEvent(new CustomEvent('popcornlab:jump',{detail:{stageId:first.id,returnToMagazine:false}}));
 refresh();
}
function activateLab(stageId,from){
 origin=from;section='lab';
 window.dispatchEvent(new CustomEvent('popcornlab:jump',{detail:{stageId,returnToMagazine:false}}));
 refresh();
}
function next(){
 const h=currentHash();remember();
 if(h==='home'){welcome.continue();}
 else if(h==='intro'){
  if(study.next()){introPage=study.getState().itemIndex;}
  else{section='magazine';origin='story';magazine()?.show(0);navigate('magazine');}
 }else if(h==='week'){
  if(finished){finished=false;section='week';origin='week';navigate('notes');}
  else openDay(day);
 }else if(h==='magazine'){
  const m=magazine();if(currentFlow?.next()){}else if(m.page<4){m.show(m.page+1);syncFlow();currentFlow?.show(0);}
  else{section='build';origin='story-build';navigate('build');}
 }else if(['lab','teach','build'].includes(h)){lab()?.advance();}
 else if(h.startsWith('reading/')||h.startsWith('watch/')){if(!currentFlow?.next())$('[data-reading-back]')?.click();}
 else if(h==='book'){
  if(!$('#book-next').disabled)$('#book-next').click();else navigate(restoreHash);
 }else if(h==='notes'){origin=null;section='intro';navigate('home');}
 else navigate(restoreHash);
 refresh();
 requestAnimationFrame(()=>requestAnimationFrame(()=>{const b=['lab','teach','build'].includes(currentHash())?$('#lab-next'):$('#guide-next');b?.focus({preventScroll:true});}));
}
function previous(){
 const last=history.pop();if(!last)return;
 ({introPage,section,origin,day,finished}=last);if(last.study)study.restore(last.study);
 if(last.hash==='magazine')magazine()?.show(last.magazinePage||0);
 navigate(last.hash);syncFlow();currentFlow?.show(last.flowPage||0);
 if(['lab','teach','build'].includes(last.hash)&&last.stage)lab()?.goStage(last.stage);
 refresh();
}
function refresh(){
 const h=currentHash(),inLab=['lab','teach','build'].includes(h);
 document.body.dataset.pageTurn=String(['home','intro','magazine'].includes(h)||h.startsWith('reading/'));
 study?.setActive(h==='intro');
 if(inLab&&origin==='week'){const current=LAB_CONTENT.stages.find(s=>s.id===lab()?.getState().stageId);if(current?.day<=5)day=current.day;}
 if(h==='home'){section='intro';$('#guide-status').textContent='랩코니와 함께 시작해요.';}
 else if(h==='intro'){const st=study.getState();introPage=st.itemIndex;$('#guide-status').textContent=`먼저 공부하기 ${st.itemIndex+1}/${st.itemCount} · ${st.pageIndex+1}/${st.pageCount}`;}
 else if(h==='week'){$('#guide-status').textContent=finished?'한 주의 안내를 모두 살펴봤어요.':`${days[day-1]}요일부터 이어 볼까요?`;}
 else if(h==='magazine'){const f=currentFlow?.getState();$('#guide-status').textContent=`이야기 ${magazine()?.page+1}/5${f?' · '+(f.page+1)+'/'+f.pages:''}`;}
 else if(h==='notes'){$('#guide-status').textContent='내가 직접 쓴 기록을 살펴봐요.';renderCurrentNotes();}
 else if(h==='book'){$('#guide-status').textContent=$('#book-caption').textContent;}
 else if(!inLab){const f=currentFlow?.getState();$('#guide-status').textContent=f?`읽기 ${f.page+1}/${f.pages}`:'자료를 살펴보고 읽던 곳으로 돌아가요.';}
 $('#guide-navigation').hidden=inLab;
 $('#guide-prev').disabled=history.length===0;
 $('#guide-tools').hidden=['home','intro','week'].includes(h);
 for(const a of document.querySelectorAll('.main-nav [data-view]')){
  const active=inLab?(origin==='week'?'week':h==='build'?'build':section==='build'?'build':'lab'):h==='home'?'intro':['intro','week','magazine'].includes(h)?h:section;
  a.toggleAttribute('data-active',a.dataset.view===active);
  if(a.dataset.view===active)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');
 }
 document.body.dataset.guideSection=section;
 document.body.dataset.guideLab=String(inLab);
}

$('#home-index').innerHTML=entries.map(([hash,title,copy])=>`<a href="#${hash}" data-guide-entry="${hash}"><strong>${title}</strong><span>${copy}</span><b aria-hidden="true">›</b></a>`).join('');
study=mountStudy($('#intro-host'),{onChange:()=>queueMicrotask(refresh)});
window.__POPCORN_STUDY__=study;
for(const [i,row] of [...document.querySelectorAll('.week-day')].entries()){
 const actions=row.querySelector('.day-actions');
 if(actions){const check=actions.querySelector('label');actions.innerHTML=`<button class="button" type="button" data-guide-day="${i+1}">${days[i]}요일 공부하기</button>`;if(check){const note=document.createElement('details');note.className='guide-day-record';note.innerHTML='<summary>내 활동 표시</summary>';note.append(check);actions.append(note);}}
}
document.addEventListener('click',event=>{
 const link=event.target.closest('[data-guide-entry],.main-nav [data-view]');
 if(link){event.preventDefault();select(link.dataset.guideEntry||link.dataset.view);}
 const d=event.target.closest('[data-guide-day]');if(d){remember();openDay(Number(d.dataset.guideDay));}
 const tool=event.target.closest('#guide-tools a');if(tool){restoreHash=currentHash();$('#guide-tools').open=false;}
 if(event.target.closest('#guide-next'))next();
 if(event.target.closest('#guide-prev'))previous();
 if(event.target.closest('#guide-start'))next();
});
window.addEventListener('popcornlab:before-advance',event=>{
 const current=event.detail.current,nextStage=event.detail.next;
 if(origin==='week'&&(!nextStage||nextStage.day!==day)){
  event.preventDefault();
  const list=dayStages(day),remaining=list[list.findIndex(s=>s.id===current.id)+1];
  if(remaining){lab()?.goStage(remaining.id);}
  else{remember();if(day<5)day++;else finished=true;section='week';navigate('week');}
 }else if(!nextStage){
  event.preventDefault();remember();
  if(currentHash()==='build'){activateLab('fish-trial','build');}
  else{finished=true;navigate('notes');}
 }
});
window.addEventListener('popcornlab:guided-change',refresh);
window.addEventListener('popcornlab:route',()=>queueMicrotask(refresh));
window.addEventListener('hashchange',()=>{if(currentHash()==='intro')renderIntro();refresh();syncFlow();});
window.addEventListener('popcornlab:route',()=>queueMicrotask(()=>{refresh();syncFlow();}));
window.__POPCORN_GUIDE__={next,previous,select,openDay,getState:()=>({section,origin,day,introPage,finished,flow:currentFlow?.getState(),study:study?.getState()})};
refresh();
queueMicrotask(syncFlow);
