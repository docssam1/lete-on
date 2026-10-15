import {LAB_CONTENT} from './lab-content.js';
import {mountMagazine} from './magazine.js?v=20261015-guided';
import {mountWelcome} from './welcome.js?v=20261015-opening-1';
import {READINGS,VIDEO_CARDS} from './reading-content.js';

const $=s=>document.querySelector(s);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const entries=[['intro','사전 이야기','랩코니와 악어의 이야기를 먼저 들어요.'],['week','요일별 공부하기','월요일부터 하루씩 이어 가요.'],['magazine','스토리로 공부하기','사진과 이야기를 따라 궁금한 것을 찾아요.'],['build','조립하기','봉투 열기부터 10단계 만들기까지.'],['lab','3D 실험실','자석과 먹이를 직접 움직여 봐요.']];
const days=['월','화','수','목','금'];
const stories=[
 {title:'종이 악어의 입이 움직인다고?',image:'cover-kit-branded.svg',alt:'실제 종이 자석 악어와 두 먹이 손잡이',chapter:'랩코니의 초대',text:'랩코니가 실험대에 종이 악어를 올려놓았어요. 옆에는 물고기와 당근이 놓여 있어요. 이 작은 악어에는 어떤 비밀이 숨어 있을까요?',lines:[['labconi-charles.png','랩코니','오늘은 이 악어와 함께 보이지 않는 힘을 찾아볼 거야.'],['starry.png','스타리','가까이에서 본 모습도, 멀리에서 본 모습도 놓치지 말자!'],['butterbee.png','버터비','물고기와 당근 준비 완료! 자석부터 만나러 가 볼까?']]},
 {title:'자석이 들려주는 작은 이야기',image:'force-bar.png',alt:'원본 막대자석과 철 클립 관찰 사진',chapter:'스타리의 이야기 책장',text:'숟가락 모양의 옛 나침반, 방향을 찾는 바늘, 찰칵 닫히는 필통. 자석은 오래전부터 우리 곁에 있었어요. 스타리가 자석의 이야기와 두 시연 영상을 꺼내 놓았어요.',lines:[['starry.png','스타리','한국어로 읽고, English로도 만나 봐. 궁금한 이야기를 펼쳐도 좋아!']],catalog:true},
 {title:'우리의 자석 악어 대작전!',image:'assembly-06.png',alt:'실제 악어의 위턱과 아래턱에 자석을 붙이는 사진',chapter:'버터비의 준비 시간',text:'이제 사진과 이야기를 따라 자석을 살펴보고, 봉투 속 준비물을 펼쳐서 나만의 악어를 만들어요. 직접 본 모습은 내 기록으로 남겨요.',lines:[['butterbee.png','버터비','실물로 할 때는 어른과 준비물을 확인하자. 가위는 조심조심!'],['labconi-charles.png','랩코니','자석은 입·코·귀에 넣지 않아. 떨어지거나 느슨한 자석은 어른에게 알려 줘.']],goals:true}
];
let introPage=0,section='intro',origin=null,day=1,finished=false,restoreHash='home';
const history=[];
const welcome=mountWelcome($('#welcome-host'),{onContinue:beginIntro});
window.__POPCORN_WELCOME__=welcome;
function beginIntro(){origin=null;section='intro';introPage=0;finished=false;lab()?.useRole('self');renderIntro();navigate('intro');}
const currentHash=()=>location.hash.slice(1)||'home';
const lab=()=>window.__POPCORN_LAB__;
const magazine=()=>mountMagazine($('#magazine-host'));
const dayStages=n=>LAB_CONTENT.stages.filter(s=>s.day===n);

function remember(){history.push({hash:currentHash(),introPage,section,origin,day,finished,stage:lab()?.getState().stageId,magazinePage:magazine()?.page});}
function navigate(hash){const same=currentHash()===hash;location.hash=hash;if(same)window.dispatchEvent(new CustomEvent('popcornlab:route',{detail:{name:hash,actual:['build','teach'].includes(hash)?'lab':hash}}));refresh();}
function readingCards(ids){return READINGS.filter(a=>!ids||ids.includes(a.id)).map(a=>`<button class="reading-banner" type="button" data-reading-id="${a.id}" data-reading-return="intro"><span class="reading-banner-photo"><img src="../assets/${a.image}" alt="${esc(a.ko.caption)}" loading="lazy"></span><span class="reading-banner-copy"><small>${esc(a.topic.ko)} · 한·영 읽기</small><strong>${esc(a.ko.title)}</strong><span>${esc(a.ko.deck)}</span><b>이야기 펼치기</b></span></button>`).join('');}
function videoCards(){return VIDEO_CARDS.map(v=>`<button class="reading-video-banner" type="button" data-watch-id="${v.id}" data-reading-return="intro"><span class="reading-video-photo"><img src="../assets/${v.image}" alt="${esc(v.ko.title)}" loading="lazy"><span aria-hidden="true">▶</span></span><span><small>${esc(v.publisher)} · ${v.duration}</small><strong>${esc(v.ko.title)}</strong><p>${esc(v.ko.question)}</p><b>영상 함께 보기</b></span></button>`).join('');}
function renderIntro(){
 const s=stories[introPage];
 const media=s.catalog?`<section class="intro-library" aria-labelledby="intro-library-title"><div class="intro-section-heading"><div><h2 id="intro-library-title">스타리의 자석 이야기 책장</h2><p>궁금한 배너를 펼쳐 읽어요.</p></div><div class="reading-language" role="group" aria-label="읽기 배너 언어"><button type="button" data-reading-banners-language="ko" aria-pressed="true">한국어</button><button type="button" data-reading-banners-language="en" aria-pressed="false">English</button></div></div><div class="reading-banners" data-reading-banners data-reading-return="intro">${readingCards()}</div><h2>움직임으로 만나는 자석</h2><div class="reading-video-banners" data-video-banners data-reading-return="intro">${videoCards()}</div></section>`:introPage===0?`<section class="intro-preview" aria-labelledby="intro-preview-title"><div class="intro-section-heading"><h2 id="intro-preview-title">먼저 영상으로 자석을 만나요.</h2><p>시연을 보거나, 다음으로 이야기를 이어 가요.</p></div><div class="reading-video-banners" data-video-banners data-reading-return="intro">${videoCards()}</div></section>`:'';
 $('#intro-host').innerHTML=`<div class="intro-masthead"><strong>팝콘실험실</strong><span>샤를 1호 · 자석 탐정단</span></div><article class="intro-chapter" data-intro-page="${introPage}"><div class="intro-chapter-heading"><span>${introPage+1} / ${stories.length}</span><h1 id="intro-title">${s.title}</h1><p>${s.chapter}</p></div>${introPage===0?media:''}<div class="intro-story-spread ${s.catalog?'intro-catalog-lead':''}"><figure class="intro-photo"><img src="../assets/${s.image}" alt="${s.alt}"><figcaption>팝콘실험실 샤를 1호 · 실제 키트 사진</figcaption></figure><div class="intro-story-copy"><p class="intro-narration">${s.text}</p><div class="intro-dialogue">${s.lines.map(([image,name,line])=>`<div class="intro-line"><img src="../assets/${image}" alt="${name}"><div><strong>${name}</strong><p>${line}</p></div></div>`).join('')}</div></div></div>${s.goals?'<section class="intro-mission"><h2>이번 주, 우리가 찾아낼 세 가지</h2><ol class="guide-goals"><li>자석의 극을 찾을 수 있다.</li><li>자석 사이에 작용하는 힘의 종류를 설명할 수 있다.</li><li>자석 악어가 입을 다물고 먹이를 먹는 이유를 설명할 수 있다.</li></ol></section>':''}${introPage===0?'':media}</article>`;
 window.dispatchEvent(new CustomEvent('popcornreading:hydrate'));
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
 if(h==='home'){welcome.continue();}
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
 else if(h==='intro'){$('#guide-status').textContent=`자석 탐정단 이야기 ${introPage+1} / ${stories.length}`;}
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
