/* Promo presentation only. Course data and generators are read-only. */
(function () {
'use strict';
const $ = s => document.querySelector(s), $$ = s => Array.from(document.querySelectorAll(s));
const app=$('.magic-book-app'), cover=$('[data-scene="cover"]'), reader=$('[data-scene="reader"]'), content=$('#bookContent');
const panels=new Map($$('.book-content > [data-panel]').map(p=>[p.dataset.panel,p]));
const order=['video','menu','labs','village','worksheet','roadmap'];
const reduced=matchMedia('(prefers-reduced-motion:reduce)'), narrow=matchMedia('(max-width:700px)');
let view='cover',turning=false,hero=null,lab=null,level='preschool',sample='preschool',sheetIndex=0,sampleOpen=false,activeCut='full',allCourses=false,stageIndex=0;
let tourTimer=0,exampleTimer=0,tourStep=0;
let pace=2;
const teaser=$('#teaserVideo'),film=$('#introVideo'),frame=$('#villageFrame');
const cuts={full:['showreel-full.mp4','poster-full.jpg'],short:['showreel-60s.mp4','poster-60s.jpg']};
const modes={
 preschool:{title:'두 친구에게 똑같이 나누어 주세요.',meaning:'옮기며 관계를 찾고, 조건에 맞게 해결해요.'},
 elementary:{title:'곱해서 10이 되는 짝을 찾아요.',meaning:'같은 수를 묶어 보는 힘, 곱셈.'},
 middle:{title:'한 수가 바뀌면, 다른 수는?',meaning:'곱이 일정한 두 수의 관계를 발견합니다.'},
 high:{title:'잘게 나눌수록, 넓이가 보입니다.',meaning:'눈으로 본 변화를 수와 식으로 다룹니다.'}
};
const samples={
 preschool:{pages:6,topic:'가르기와 모으기',headline:'손으로 나눈 수를,<br>내 힘으로 풀어요.',copy:'나누고 모으던 경험을 그림과 수로 옮깁니다. 짧은 이야기를 읽고 분류하는 문제까지 이어집니다.',source:'과정 0 · 6회차 발췌',word:4,caption:'가르기 · 연산 연습 · 분류하고 세기'},
 elementary:{pages:8,topic:'곱하여 10 · 나눗셈 문장제',headline:'계산한 답을 넘어,<br>이야기 속 관계까지.',copy:'곱하여 10의 원리를 익히고, 같은 회차의 나눗셈에서는 읽고 식을 세우는 문장형 문제 24문항을 연습합니다.',source:'과정 8 · 1회차 발췌',word:3,caption:'1–3쪽 곱하여 10 · 4–8쪽 나눗셈 문장형 연습'},
 middle:{pages:6,topic:'비례와 반비례',headline:'외운 공식이 아니라,<br>이해한 관계로.',copy:'두 수의 관계를 식과 그래프로 연결합니다. 개념을 확인한 뒤 직접 계산하고 그래프를 읽어 식으로 나타냅니다.',source:'과정 31 · 5회차 발췌',word:null,caption:'비례 개념 · 반비례 그래프 · 연산 연습'},
 high:{pages:6,topic:'미분과 적분',headline:'눈으로 본 변화를,<br>수학의 언어로.',copy:'접선의 기울기와 곡선 아래 넓이. 움직이는 모형에서 발견한 개념을 식으로 다루며 연습합니다.',source:'과정 43 · 4회차 발췌',word:null,caption:'미분·접선 · 실전 연습 · 적분'}
};
function play(v){const p=v.play();if(p)p.catch(()=>syncMedia());}
function mediaSource(v,name,poster){const src='../assets/promo/video/'+name;if(v.getAttribute('src')!==src){v.src=src;if(poster)v.poster='../assets/promo/video/'+poster;v.load();}}
function syncMedia(){
 $('#teaserPlay').textContent=teaser.paused?'▶':'Ⅱ';$('#teaserPlay').setAttribute('aria-label',teaser.paused?'미리보기 재생':'미리보기 일시정지');
 $('#teaserSound').textContent=teaser.muted?'음소거':'♪';$('#teaserSound').setAttribute('aria-label',teaser.muted?'배경음 켜기':'배경음 끄기');
 $('#cinemaPlay').hidden=!film.paused||film.ended;$('#playToggle').textContent=film.paused?'▶':'Ⅱ';$('#playToggle').setAttribute('aria-label',film.paused?'재생':'일시정지');
 $('#muteToggle').textContent=film.muted?'×♪':'♪';$('#muteToggle').setAttribute('aria-label',film.muted?'소리 켜기':'음소거');
}
function setCut(key,autoplay){if(!cuts[key])return;activeCut=key;const c=cuts[key];mediaSource(film,c[0],c[1]);$$('[data-cut]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.cut===key)));$('#videoFinish').hidden=true;if(autoplay)play(film);}
function frameActive(active){if(frame.getAttribute('src'))frame.contentWindow.postMessage({type:'nm-promo-active',active},location.origin);}
function prepare(next,autoplay){
 if(window.NMCoverMath)window.NMCoverMath.setActive(next==='cover');
 $('#cinemaControls').hidden=next!=='video';
 teaser.pause();film.pause();
 stopTour();clearInterval(exampleTimer);
 if(hero)hero.setActive(false);if(lab)lab.setActive(false);frameActive(false);
 if(next==='menu'){
   if(!hero)hero=window.NMPromoExperience.create($('#heroExperience'),{mode:'preschool',compact:true});
   hero.setActive(!document.hidden);mediaSource(teaser,'showreel-15s-vertical.mp4');teaser.volume=.6;
   if(autoplay&&!reduced.matches)play(teaser);
 }
 if(next==='video'){setCut(activeCut,autoplay);}
 if(next==='labs'){if(!lab)lab=window.NMPromoExperience.create($('#labExperience'),{mode:level});lab.setMode(level);lab.setActive(!document.hidden);}
 if(next==='village'){if(!frame.getAttribute('src'))frame.src=frame.dataset.src;else frameActive(true);}
 if(next==='worksheet')renderSample();
 if(next==='roadmap')renderRoadmap();
 syncMedia();
}
function snapshot(panel){
 const clone=panel.cloneNode(true);clone.removeAttribute('hidden');clone.removeAttribute('inert');clone.removeAttribute('data-panel');clone.removeAttribute('aria-labelledby');clone.classList.add('turn-snapshot');clone.setAttribute('aria-hidden','true');clone.inert=true;
 [clone,...clone.querySelectorAll('[id]')].forEach(n=>n.removeAttribute('id'));
 clone.querySelectorAll('button,a,input,iframe').forEach(n=>n.tabIndex=-1);
 const originals=panel.querySelectorAll('canvas');
 clone.querySelectorAll('canvas').forEach((n,i)=>{const im=document.createElement('img');try{const ctl=originals[i].closest('#heroExperience')?hero:lab;im.src=(ctl&&ctl.capture&&ctl.capture())||originals[i].toDataURL();}catch(e){}im.alt='';im.style.cssText=n.style.cssText;im.style.width='100%';im.style.height='100%';n.replaceWith(im);});
 clone.querySelectorAll('video').forEach(n=>{const im=document.createElement('img');im.src=n.poster;im.alt='';im.style.cssText='width:100%;height:100%;object-fit:cover';n.replaceWith(im);});
 clone.querySelectorAll('iframe').forEach(n=>{const im=document.createElement('img');im.src='../assets/promo/shots/village.webp';im.alt='';im.style.cssText='width:100%;height:100%;object-fit:cover';n.replaceWith(im);});
 return clone;
}
function turn(from,to,direction,done){
 if(reduced.matches){done();return;}
 turning=true;content.classList.add('is-turning');updateNav();
 // Keep the outgoing spread visible while the incoming local WebGL scene renders.
 const hold=snapshot(from);hold.classList.add('curl-staging');
 hold.style.setProperty('display',from.classList.contains('panel-menu')?'grid':from.classList.contains('panel-video')||from.classList.contains('panel-village')?'block':'flex','important');
 content.append(hold);
 requestAnimationFrame(()=>{
   const finish=()=>{hold.remove();content.classList.remove('is-turning');turning=false;updateNav();done();};
   window.NMPageCurl.turn({container:content,from,to:snapshot(to),direction,narrow:narrow.matches,duration:1100,onComplete:finish});
   hold.remove();
 });
}
function updateNav(){
 const i=order.indexOf(view);$('#bookBack').disabled=turning;$('#bookNext').disabled=turning||i===order.length-1;
 $$('.chapter-nav [data-route]').forEach(b=>{if(b.dataset.route===view)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');b.disabled=turning;});
}
function go(next,{historyMode='push',animate=true,autoplay=false,focus=true}={}){
 if(turning)return;if(!order.includes(next)&&next!=='cover')next='cover';if(view===next&&next!=='cover')return;
 const from=view,fromPanel=panels.get(from),toPanel=panels.get(next);let fromSnapshot;
 if(animate&&fromPanel&&toPanel&&!reduced.matches)fromSnapshot=snapshot(fromPanel);
 view=next;app.dataset.view=next;const closed=next==='cover';
 cover.classList.toggle('is-active',closed);cover.setAttribute('aria-hidden',String(!closed));cover.inert=!closed;
 reader.classList.toggle('is-active',!closed);reader.setAttribute('aria-hidden',String(closed));reader.inert=closed;
 panels.forEach((p,id)=>{const on=id===next;p.hidden=!on;p.inert=!on;p.setAttribute('aria-hidden',String(!on));});
 prepare(next,autoplay);
 if(historyMode==='push'&&location.hash!=='#'+next)history.pushState({nmBook:true,view:next},'','#'+next);
 if(historyMode==='replace')history.replaceState({nmBook:true,view:next},'','#'+next);
 const finish=()=>{if(focus){const t=closed?$('#openBook'):(toPanel.querySelector('h1,h2')||$('#bookContent'));t.focus({preventScroll:true});}};
 if(fromSnapshot){turn(fromSnapshot,toPanel,order.indexOf(next)>=order.indexOf(from)?1:-1,finish);}else finish();
 updateNav();
}
function previous(){const i=order.indexOf(view);go(i>0?order[i-1]:'cover',{autoplay:false});}
function next(){const i=order.indexOf(view),target=order[i+1];if(target)go(target,{autoplay:target==='video'||target==='menu'});}
$('#openBook').addEventListener('click',()=>{
 if(turning)return;turning=true;cover.classList.add('is-opening');
 // The first spread is the full two-minute film, never the split teaser page.
 // Start from the explicit click so mobile browsers allow its audio to play.
 teaser.pause();setCut('full',false);film.currentTime=0;play(film);
 if(window.NMCoverMath)window.NMCoverMath.setActive(false);
 setTimeout(()=>{turning=false;cover.classList.remove('is-opening');go('video',{animate:false,autoplay:true});},reduced.matches?0:650);
});
$('#bookHome').addEventListener('click',()=>go('cover'));$('#bookBack').addEventListener('click',previous);$('#bookNext').addEventListener('click',next);
$$('[data-route]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.route,{autoplay:b.dataset.route==='video'})));
$$('[data-cut]').forEach(b=>b.addEventListener('click',()=>setCut(b.dataset.cut,true)));
$('#teaserPlay').addEventListener('click',()=>teaser.paused?play(teaser):teaser.pause());
$('#teaserSound').addEventListener('click',()=>{teaser.muted=!teaser.muted;syncMedia();});
[$('#cinemaPlay'),$('#playToggle'),film].forEach(b=>b.addEventListener('click',()=>{if(film.paused){$('#videoFinish').hidden=true;play(film);}else film.pause();}));
$('#muteToggle').addEventListener('click',()=>{film.muted=!film.muted;syncMedia();});
[film,teaser].forEach(v=>{v.addEventListener('play',syncMedia);v.addEventListener('pause',syncMedia);v.addEventListener('volumechange',syncMedia);v.addEventListener('contextmenu',e=>e.preventDefault());v.addEventListener('error',syncMedia);});
film.addEventListener('timeupdate',()=>{$('#videoProgress').value=film.duration?Math.round(film.currentTime/film.duration*1000):0;const t=film.currentTime||0;$('#videoTime').textContent=Math.floor(t/60)+':'+String(Math.floor(t%60)).padStart(2,'0');});
$('#videoProgress').addEventListener('input',e=>{if(Number.isFinite(film.duration))film.currentTime=+e.target.value/1000*film.duration;});
film.addEventListener('ended',()=>{$('#videoFinish').hidden=false;syncMedia();});
function changeLevel(id){if(!modes[id])return;level=id;$('#labsTitle').textContent=modes[id].title;$('#labMeaning').textContent=modes[id].meaning;$$('[data-level]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.level===id)));if(lab)lab.setMode(id);}
$$('[data-level]').forEach(b=>b.addEventListener('click',()=>changeLevel(b.dataset.level)));
$('#labToSheet').addEventListener('click',()=>{sample=level;sheetIndex=0;sampleOpen=false;go('worksheet');});
frame.addEventListener('load',()=>frameActive(view==='village'));
window.addEventListener('message',e=>{
 if(e.origin!==location.origin||e.source!==frame.contentWindow||!e.data)return;
 if(e.data.type==='nm-promo-ready')frameActive(view==='village');
 if(e.data.type==='nm-promo-route'&&['labs','worksheet','roadmap'].includes(e.data.view))go(e.data.view);
});
function samplePath(i){return '../assets/promo/samples-v4/'+sample+'/page-'+(i+1)+'.webp';}
function renderSample(){
 const s=samples[sample];$$('[data-sample]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.sample===sample)));
 $('#sampleTopic').textContent=s.topic;$('#sampleHeadline').innerHTML=s.headline;$('#sampleCopy').textContent=s.copy;$('#sampleSource').textContent=s.source+' · 실제 학습지';
 $('#sampleCover').src=samplePath(0);$('#sampleCover').alt=s.topic+' 실제 학습지';
 $('#wordPreview').hidden=s.word===null;$('#sampleEditorial').hidden=sampleOpen;$('#sampleReader').hidden=!sampleOpen;$('#sampleCaption').textContent=s.caption;
 renderSheets();
}
function renderSheets(){const total=samples[sample].pages,step=narrow.matches?1:2;sheetIndex=Math.max(0,Math.min(sheetIndex,total-step));$('#sheetA').src=samplePath(sheetIndex);$('#sheetA').alt=samples[sample].topic+' 발췌 '+(sheetIndex+1)+'쪽';$('#sheetB').src=samplePath(Math.min(sheetIndex+1,total-1));$('#sheetB').alt=samples[sample].topic+' 발췌 '+Math.min(sheetIndex+2,total)+'쪽';$('#sheetCounter').textContent=(sheetIndex+1)+(step===2?'–'+Math.min(total,sheetIndex+2):'')+' / '+total;$('#sheetPrev').disabled=sheetIndex===0;$('#sheetNext').disabled=sheetIndex>=total-step;}
$$('[data-sample]').forEach(b=>b.addEventListener('click',()=>{sample=b.dataset.sample;sheetIndex=0;sampleOpen=false;renderSample();}));
function openSample(index=0){sheetIndex=index;sampleOpen=true;renderSample();}
$('#openSamples').addEventListener('click',()=>openSample());$('#samplePreview').addEventListener('click',()=>openSample());
$('#wordPreview').addEventListener('click',()=>openSample(samples[sample].word||0));$('#closeSamples').addEventListener('click',()=>{sampleOpen=false;renderSample();});
function turnSheet(d){const step=narrow.matches?1:2;sheetIndex+=d*step;renderSheets();const spread=$('.sheet-spread');spread.classList.remove('is-changing');requestAnimationFrame(()=>spread.classList.add('is-changing'));}
$('#sheetPrev').addEventListener('click',()=>turnSheet(-1));$('#sheetNext').addEventListener('click',()=>turnSheet(1));
function zoom(offset=0){$('#zoomImage').src=samplePath(Math.min(sheetIndex+offset,samples[sample].pages-1));$('#sheetZoom').showModal();}
$$('[data-zoom]').forEach(b=>b.addEventListener('click',()=>zoom(+b.dataset.zoom)));$('#zoomSheet').addEventListener('click',()=>zoom());$('#zoomClose').addEventListener('click',()=>$('#sheetZoom').close());
narrow.addEventListener('change',()=>{if(sampleOpen)renderSheets();});
function escapeHTML(t){return String(t||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function renderRoadmap(){
 const stages=window.NM_STAGES||[],specs=window.NM_COURSE_SPEC||[];
 if(!$('#roadmapRows').children.length){stages.forEach((s,i)=>{const b=document.createElement('button');b.className='roadmap-stop';b.dataset.stage=s.key;b.innerHTML='<span class="station">'+(i+1)+'</span><strong>'+escapeHTML(s.name.ko.split(' — ')[0])+'</strong><small>과정 '+s.courses.from+(s.courses.to!==s.courses.from?'–'+s.courses.to:'')+'</small>';b.addEventListener('click',()=>{stopTour();stageIndex=i;allCourses=false;renderRoadmap();});$('#roadmapRows').append(b);});const traveller=document.createElement('span');traveller.className='roadmap-traveller';traveller.setAttribute('aria-hidden','true');traveller.textContent='✦';$('#roadmapRows').append(traveller);}
 $$('.roadmap-stop').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===stageIndex&&!allCourses)));
 const selected=stages[stageIndex];if(!selected)return;
 $('#stageTitle').textContent=allCourses?'전체 '+specs.length+'과정':selected.name.ko;
 $('#stageLearn').textContent=allCourses?'과정 번호순으로 전체 학습 내용을 확인하세요.':selected.learn.ko;
 updatePace(selected);
 const filtered=allCourses?specs:specs.filter(s=>s.id>=selected.courses.from&&s.id<=selected.courses.to);
 $('#courseRows').innerHTML=filtered.map(s=>'<article class="course-row" data-course="'+s.id+'"><strong>'+String(s.id).padStart(2,'0')+'</strong><b>'+escapeHTML(s.title.ko)+'</b></article>').join('');
 $('#courseRows').scrollTop=0;$('#allCourses').setAttribute('aria-pressed',String(allCourses));$('#allCourses').textContent=allCourses?'단계별로 보기 ↗':'전체 과정표 보기 ↗';
 const pin=$('.roadmap-traveller');pin.hidden=allCourses;
 requestAnimationFrame(()=>{const station=$$('.roadmap-stop .station')[stageIndex],r=station.getBoundingClientRect(),rail=$('#roadmapRows').getBoundingClientRect();pin.style.transform='translate('+(r.left-rail.left+r.width-5)+'px,'+(r.top-rail.top-6)+'px)';});
 clearInterval(exampleTimer);$('#stageExample').hidden=allCourses;
 const steps=selected.example.split('→').map(s=>s.trim());let exampleStep=0;
 function example(){const el=$('#stageExpression');el.textContent=steps[exampleStep];el.classList.remove('is-revealing');requestAnimationFrame(()=>el.classList.add('is-revealing'));exampleStep=(exampleStep+1)%steps.length;}
 example();$('#stageExample').classList.toggle('is-multi',steps.length>1&&!reduced.matches);
 if(!allCourses&&!reduced.matches&&steps.length>1)exampleTimer=setInterval(example,2400);
}
function stopTour(){clearInterval(tourTimer);tourTimer=0;$('#roadmapPlay').setAttribute('aria-pressed','false');$('#roadmapPlay').textContent='여정 재생 ▶';}
$('#roadmapPlay').addEventListener('click',()=>{if(tourTimer){stopTour();return;}allCourses=false;stageIndex=0;tourStep=0;renderRoadmap();$('#roadmapPlay').setAttribute('aria-pressed','true');$('#roadmapPlay').textContent='여정 멈춤 Ⅱ';tourTimer=setInterval(()=>{tourStep++;if(tourStep>=window.NM_STAGES.length){stopTour();return;}stageIndex=tourStep;renderRoadmap();},3000);});
$('#allCourses').addEventListener('click',()=>{stopTour();allCourses=!allCourses;renderRoadmap();});
function updatePace(stage){const match=(stage.meta&&stage.meta.ko||'').match(/주 2회 기준\s*(\d+)주/),weeks=pace===1?stage.weeks:(match?Number(match[1]):null);$('#paceEstimate').textContent=!allCourses&&weeks?'선택한 단계 · 약 '+weeks+'주':'';$$('[data-pace]').forEach(b=>b.setAttribute('aria-pressed',String(+b.dataset.pace===pace)));}
$$('[data-pace]').forEach(b=>b.addEventListener('click',()=>{pace=+b.dataset.pace;updatePace(window.NM_STAGES[stageIndex]);}));
window.addEventListener('resize',()=>{if(view==='roadmap')renderRoadmap();});
function hashView(){const v=location.hash.slice(1);return order.includes(v)?v:({story1:'labs',story2:'village',story3:'worksheet'}[v]||'cover');}
window.addEventListener('popstate',()=>{if(turning){setTimeout(()=>go(hashView(),{historyMode:'none',animate:false}),1250);return;}go(hashView(),{historyMode:'none'});});
window.addEventListener('hashchange',()=>{const v=hashView();if(v!==view&&!turning)go(v,{historyMode:'none'});});
window.addEventListener('keydown',e=>{
 if($('#sheetZoom').open||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)||e.target.isContentEditable)return;
 if(e.key==='Escape'&&view!=='cover'){e.preventDefault();previous();}
 if(e.key==='PageDown'){e.preventDefault();next();}
 if(e.key==='PageUp'){e.preventDefault();previous();}
});
document.addEventListener('visibilitychange',()=>{if(hero)hero.setActive(!document.hidden&&view==='menu');if(lab)lab.setActive(!document.hidden&&view==='labs');frameActive(!document.hidden&&view==='village');if(document.hidden){teaser.pause();film.pause();stopTour();clearInterval(exampleTimer);}else if(view==='roadmap')renderRoadmap();});
const initial=hashView();go(initial,{historyMode:'replace',animate:false,focus:false});
window.NMPromoBook={getState:()=>({view,level,sample,sheetIndex,sampleOpen,turning}),go,experience:()=>({hero,lab})};
})();
