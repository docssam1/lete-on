import {LAB_CONTENT} from './lab-content.js';
import {mountMagazine} from './magazine.js?v=20261015-guided';

const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const entries=[['intro','사전 이야기','랩코니와 악어의 이야기를 먼저 들어요.'],['week','요일별 공부하기','월요일부터 하루씩 이어 가요.'],['magazine','스토리로 공부하기','사진과 이야기를 따라 궁금한 것을 찾아요.'],['build','조립하기','봉투 열기부터 10단계 만들기까지.'],['lab','3D 실험실','자석과 먹이를 직접 움직여 봐요.']];
const days=['월','화','수','목','금'];
const stories=[
 {title:'랩코니가 악어를 데려왔어요.',image:'cover-kit-branded.svg',alt:'실제 종이 자석 악어와 물고기·당근',text:'종이로 만든 악어 앞에 물고기와 당근이 놓여 있어요. 랩코니는 먹이를 천천히 가까이 가져가 보려 해요.',quote:'어떤 모습이 나타날까? 먼저 사진을 같이 볼까요?'},
 {title:'보이지 않는 힘을 찾아볼까요?',image:'force-bar.png',alt:'실제 막대자석과 철 클립 관찰 사진',text:'자석에 철 클립을 가까이 가져가면 어떤 모습일까요? 자석의 여러 부분과 두 자석을 차례로 살펴보고, 나만의 악어도 만들어요.',quote:'처음 생각과 직접 본 모습을 나란히 놓아 봐요.',goals:true},
 {title:'작은 실험실을 준비해요.',image:'labconi-charles.png',alt:'준비를 안내하는 샤를 랩코니',text:'화면 속 준비물부터 함께 살펴봐요. 실물 키트로 만들 때는 어른과 자석 개수를 세고, 가위와 자석 고정을 확인해요.',quote:'자석은 입·코·귀에 넣지 않아요. 느슨하거나 떨어진 자석은 어른에게 알려요.'}
];
let introPage=0,section='intro',origin=null,day=1,finished=false,restoreHash='home';
const history=[];
const currentHash=()=>location.hash.slice(1)||'home';
const lab=()=>window.__POPCORN_LAB__;
const magazine=()=>mountMagazine($('#magazine-host'));
const dayStages=n=>LAB_CONTENT.stages.filter(s=>s.day===n);

function remember(){history.push({hash:currentHash(),introPage,section,origin,day,finished,stage:lab()?.getState().stageId,magazinePage:magazine()?.page});}
function navigate(hash){const same=currentHash()===hash;location.hash=hash;if(same)window.dispatchEvent(new CustomEvent('popcornlab:route',{detail:{name:hash,actual:['build','teach'].includes(hash)?'lab':hash}}));refresh();}
function renderIntro(){
 const s=stories[introPage];
 $('#intro-host').innerHTML=`<div class="source-step"><span class="source-step-number"><small>UNIT</small>1</span><strong class="source-step-title">사전 이야기</strong></div><div class="guide-story"><figure><img src="../assets/${s.image}" alt="${s.alt}"></figure><div><p class="guide-page">${introPage+1} / ${stories.length}</p><h1 id="intro-title">${s.title}</h1><p>${s.text}</p>${s.goals?'<ol class="guide-goals"><li>자석의 극을 찾을 수 있다.</li><li>자석 사이에 작용하는 힘의 종류를 설명할 수 있다.</li><li>자석 악어가 입을 다물고 먹이를 먹는 이유를 설명할 수 있다.</li></ol>':''}<aside class="guide-voice"><img src="../assets/labconi-charles.png" alt="랩코니"><p>${s.quote}</p></aside></div></div>`;
}
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
 if(hash==='intro'){introPage=0;renderIntro();}
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
 if(h==='home'){origin=null;section='intro';introPage=0;finished=false;lab()?.useRole('self');renderIntro();navigate('intro');}
 else if(h==='intro'){
  if(introPage<stories.length-1){introPage++;renderIntro();}
  else{section='magazine';origin='story';magazine()?.show(0);navigate('magazine');}
 }else if(h==='week'){
  if(finished){finished=false;section='week';origin='week';navigate('notes');}
  else openDay(day);
 }else if(h==='magazine'){
  const m=magazine();if(m.page<4)m.show(m.page+1,true);
  else{section='build';origin='story-build';navigate('build');}
 }else if(['lab','teach','build'].includes(h)){lab()?.advance();}
 else if(h.startsWith('reading/')||h.startsWith('watch/')){$('[data-reading-back]')?.click();}
 else if(h==='book'){
  if(!$('#book-next').disabled)$('#book-next').click();else navigate(restoreHash);
 }else if(h==='notes'){origin=null;section='intro';navigate('home');}
 else navigate(restoreHash);
 refresh();
 requestAnimationFrame(()=>requestAnimationFrame(()=>{const b=['lab','teach','build'].includes(currentHash())?$('#lab-next'):$('#guide-next');b?.focus({preventScroll:true});}));
}
function previous(){
 const last=history.pop();if(!last)return;
 ({introPage,section,origin,day,finished}=last);renderIntro();
 if(last.hash==='magazine')magazine()?.show(last.magazinePage||0);
 navigate(last.hash);
 if(['lab','teach','build'].includes(last.hash)&&last.stage)lab()?.goStage(last.stage);
 refresh();
}
function refresh(){
 const h=currentHash(),inLab=['lab','teach','build'].includes(h);
 if(inLab&&origin==='week'){const current=LAB_CONTENT.stages.find(s=>s.id===lab()?.getState().stageId);if(current?.day<=5)day=current.day;}
 if(h==='home'){section='intro';$('#guide-status').textContent='랩코니와 함께 시작해요.';}
 else if(h==='intro'){$('#guide-status').textContent=`사전 이야기 ${introPage+1} / ${stories.length}`;}
 else if(h==='week'){$('#guide-status').textContent=finished?'한 주의 안내를 모두 살펴봤어요.':`${days[day-1]}요일부터 이어 볼까요?`;}
 else if(h==='magazine'){$('#guide-status').textContent=`이야기 ${magazine()?.page+1} / 5`;}
 else if(h==='notes'){$('#guide-status').textContent='내가 직접 쓴 기록을 살펴봐요.';renderCurrentNotes();}
 else if(h==='book'){$('#guide-status').textContent=$('#book-caption').textContent;}
 else if(!inLab){$('#guide-status').textContent='자료를 살펴보고 읽던 곳으로 돌아가요.';}
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
$('#home-title').textContent='랩코니와 자석 악어를 만나요.';
renderIntro();
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
window.addEventListener('hashchange',()=>{if(currentHash()==='intro')renderIntro();refresh();});
window.__POPCORN_GUIDE__={next,previous,select,openDay,getState:()=>({section,origin,day,introPage,finished})};
refresh();
